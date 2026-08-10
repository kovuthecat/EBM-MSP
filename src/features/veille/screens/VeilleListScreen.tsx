import { useEffect, useMemo, useState } from 'react'
import type { Navigation } from '../../shared/navigation'
import type { NiveauPreuve } from '../../shared/types'
import { EvidenceBadge } from '../../shared/badges/EvidenceBadge'
import { useUtilisateur } from '../../shared/lib/auth'
import type { EntreeVeille, NiveauPreuveVeille } from '../content/entree.types'
import { entrees, professionsPresentes, themesPresents } from '../content/loadEntrees'
import type { EtatArticle } from '../lib/articleEtats'
import { chargerEtats, definirEtat, retirerEtat } from '../lib/articleEtats'
import './VeilleListScreen.css'

/**
 * V1 — liste filtrable des entrées de veille (ARCHITECTURE.md, BRIEF_VEILLE.md §6).
 *
 * Les valeurs de filtre sont **dérivées du corpus réel** (`loadEntrees`), jamais de la taxonomie
 * complète : proposer les 13 thèmes quand 9 seulement sont produits offrirait des filtres qui ne
 * renvoient rien. Même principe que `DecisionDomainsScreen`, qui dérive ses domaines du contenu.
 *
 * Le détail est déplié **en place** plutôt que sur un second écran : à ce stade il s'agit d'arbitrer
 * le format et les options de tri, et comparer deux entrées côte à côte est plus utile qu'une
 * navigation. L'écran V2 (`veilleDetail`) reste à construire.
 */

/** Libellés d'affichage des thèmes. Le contenu porte des slugs ; l'écran ne doit jamais les montrer. */
const THEME_LABELS: Record<string, string> = {
  'soins-premiers': 'Soins premiers',
  'diabete-metabolisme': 'Diabète et métabolisme',
  'cardiovasculaire-prevention': 'Cardiovasculaire et prévention',
  'bpco-pneumo': 'BPCO et pneumologie',
  'infectiologie-antibiotherapie': 'Infectiologie et antibiothérapie',
  'geriatrie-deprescription': 'Gériatrie et déprescription',
  pediatrie: 'Pédiatrie',
  'prevention-depistage-vaccination': 'Prévention, dépistage, vaccination',
  'sante-mentale-addictologie': 'Santé mentale et addictologie',
  'douleur-soins-palliatifs': 'Douleur et soins palliatifs',
  ETP: 'Éducation thérapeutique',
  'sante-femme-perinatalite': 'Santé de la femme et périnatalité',
  orthophonie: 'Orthophonie',
  'soins-infirmiers': 'Soins infirmiers',
}

const labelTheme = (slug: string) => THEME_LABELS[slug] ?? slug

/** `meta.date_publication` (ISO, `AAAA-MM-JJ`) en affichage court `JJ/MM/AAAA` — repère de tri visible
 * depuis le retrait du filtre par semaine (2026-08-09). Repli sur la valeur brute si non parsable. */
const formaterDate = (isoDate: string): string => {
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/**
 * Le contenu Veille écrit `tres_faible` (brief §5, underscore) ; le badge transverse attend
 * `tres-faible` (trait d'union, `shared/types.ts`). L'écart est documenté depuis P1 dans
 * `decision/content/node.types.ts` : on le franchit par une fonction de mapping, comme prévu, et
 * non en unifiant les deux enums — `shared` ne se modifie pas sans décision.
 */
const toBadgeNiveau = (niveau: NiveauPreuveVeille): NiveauPreuve =>
  niveau === 'tres_faible' ? 'tres-faible' : niveau

/** Ordre de tri par niveau de preuve : du plus solide au moins solide, les brèves (null) en dernier. */
const RANG_PREUVE: Record<NiveauPreuveVeille, number> = {
  eleve: 0,
  modere: 1,
  faible: 2,
  tres_faible: 3,
}

type Tri = 'anciennete' | 'impact' | 'temps' | 'preuve'

const TRIS: { valeur: Tri; label: string; aide: string }[] = [
  { valeur: 'anciennete', label: 'Date', aide: 'Par ancienneté — direction réglable ci-contre' },
  { valeur: 'impact', label: "Impact d'abord", aide: "Ce qui change la pratique avant ce qui l'informe" },
  { valeur: 'temps', label: 'Temps de lecture', aide: 'Le plus court en premier' },
  { valeur: 'preuve', label: 'Niveau de preuve', aide: 'Le plus solide en premier' },
]

/** Sens du tri par ancienneté. `recent` = du plus récent au plus ancien (défaut). */
type OrdreAnciennete = 'recent' | 'ancien'

const TOUS = '__tous__'

interface VeilleListScreenProps {
  go: Navigation['go']
}

export function VeilleListScreen({ go }: VeilleListScreenProps) {
  const [theme, setTheme] = useState<string>(TOUS)
  const [profession, setProfession] = useState<string>(TOUS)
  const [impact, setImpact] = useState<string>(TOUS)
  const [route, setRoute] = useState<string>(TOUS)
  const [tri, setTri] = useState<Tri>('anciennete')
  const [ordreAnciennete, setOrdreAnciennete] = useState<OrdreAnciennete>('recent')
  const [deplie, setDeplie] = useState<string | null>(null)

  // GARDER/MASQUER (D51, 2026-08-06 ; passage flux/bibliothèque 2026-08-09) : état personnel par
  // praticien, chargé une fois la session connue. `etats` reste vide (jamais d'erreur bloquante) si
  // le chargement échoue — un praticien qui n'a pas encore d'état enregistré doit voir le flux
  // complet, pas un écran cassé. Le flux général exclut désormais TOUJOURS gardées et masquées (plus
  // de case à cocher pour les faire réapparaître ici) : une gardée vit dans « Ma bibliothèque », une
  // masquée n'est gérable (la re-marquer) que depuis cet écran.
  const utilisateur = useUtilisateur()
  const [etats, setEtats] = useState<Record<string, EtatArticle>>({})
  const [vue, setVue] = useState<'flux' | 'bibliotheque'>('flux')

  useEffect(() => {
    if (!utilisateur) {
      setEtats({})
      return
    }
    let actif = true
    chargerEtats()
      .then((valeurs) => {
        if (actif) setEtats(valeurs)
      })
      .catch(() => {
        // Best-effort : une erreur de chargement (réseau, RLS) laisse `etats` vide plutôt que de
        // casser l'écran — cf. commentaire ci-dessus.
      })
    return () => {
      actif = false
    }
  }, [utilisateur])

  const marquer = (articleId: string, etat: EtatArticle) => {
    setEtats((precedent) => ({ ...precedent, [articleId]: etat })) // optimiste
    void definirEtat(articleId, etat).catch(() => {
      // Best-effort : en cas d'échec, l'état local reste tel quel jusqu'au prochain chargement —
      // pas de rollback intrusif pour un geste aussi mineur que « garder »/« masquer ».
    })
  }

  const oublier = (articleId: string) => {
    setEtats((precedent) => {
      const suite = { ...precedent }
      delete suite[articleId]
      return suite
    })
    void retirerEtat(articleId).catch(() => {})
  }

  const parTitre = (a: EntreeVeille, b: EntreeVeille) => a.titre.localeCompare(b.titre, 'fr')

  const trier = (liste: EntreeVeille[]) =>
    [...liste].sort((a, b) => {
      if (tri === 'anciennete') {
        const cmp = a.meta.date_publication.localeCompare(b.meta.date_publication)
        return (ordreAnciennete === 'recent' ? -cmp : cmp) || parTitre(a, b)
      }
      if (tri === 'temps') return a.temps_lecture_min - b.temps_lecture_min || parTitre(a, b)
      if (tri === 'preuve') {
        const ra = a.niveau_preuve ? RANG_PREUVE[a.niveau_preuve] : 99
        const rb = b.niveau_preuve ? RANG_PREUVE[b.niveau_preuve] : 99
        return ra - rb || parTitre(a, b)
      }
      // 'impact' : pratique avant informatif, puis analyse avant brève.
      const ia = a.niveau_impact === 'pratique' ? 0 : 1
      const ib = b.niveau_impact === 'pratique' ? 0 : 1
      if (ia !== ib) return ia - ib
      const ra = a.route === 'analyse' ? 0 : 1
      const rb = b.route === 'analyse' ? 0 : 1
      return ra - rb || parTitre(a, b)
    })

  // Flux général : jamais les gardées (elles vivent dans la bibliothèque), jamais les masquées.
  const visibles = useMemo(() => {
    const filtrees = entrees.filter((e) => {
      if (etats[e.id] === 'garde' || etats[e.id] === 'masque') return false
      if (theme !== TOUS && !e.themes.includes(theme)) return false
      if (profession !== TOUS && !e.professions_concernees.includes(profession)) return false
      if (impact !== TOUS && e.niveau_impact !== impact) return false
      if (route !== TOUS && e.route !== route) return false
      return true
    })
    return trier(filtrees)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, profession, impact, route, tri, ordreAnciennete, etats])

  // Ma bibliothèque : les gardées (le contenu principal de l'écran) et les masquées (repliées,
  // uniquement pour pouvoir les re-marquer — sinon une masquée serait perdue sans retour possible).
  const gardees = useMemo(
    () => trier(entrees.filter((e) => etats[e.id] === 'garde')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [etats, tri, ordreAnciennete],
  )
  const masquees = useMemo(
    () => trier(entrees.filter((e) => etats[e.id] === 'masque')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [etats, tri, ordreAnciennete],
  )

  const listeAffichee = vue === 'flux' ? visibles : gardees
  const nbAnalyses = listeAffichee.filter((e) => e.route === 'analyse').length
  const nbPratiques = listeAffichee.filter((e) => e.niveau_impact === 'pratique').length

  const carte = (entree: EntreeVeille) => (
    <Carte
      key={entree.id}
      entree={entree}
      ouvert={deplie === entree.id}
      onToggle={() => setDeplie(deplie === entree.id ? null : entree.id)}
      etat={etats[entree.id]}
      connecte={Boolean(utilisateur)}
      onMarquer={(etat) => marquer(entree.id, etat)}
      onOublier={() => oublier(entree.id)}
      onDemanderConnexion={() => go('auth')}
    />
  )

  return (
    <div className="veille-list">
      <div className="veille-list__entete">
        <h1 className="veille-list__title">Veille clinique</h1>
        {/* Flux / bibliothèque (2026-08-09) : une gardée quitte le flux général pour vivre ici ; une
            masquée quitte le flux et n'est reprenable que depuis cet onglet (repli « Masquées »
            ci-dessous), jamais par une case à cocher dans le flux. */}
        {utilisateur && (
          <div className="veille-list__vues" role="tablist" aria-label="Affichage">
            <button
              type="button"
              role="tab"
              aria-selected={vue === 'flux'}
              className={vue === 'flux' ? 'veille-list__vue veille-list__vue--actif' : 'veille-list__vue'}
              onClick={() => setVue('flux')}
            >
              Flux
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={vue === 'bibliotheque'}
              className={
                vue === 'bibliotheque' ? 'veille-list__vue veille-list__vue--actif' : 'veille-list__vue'
              }
              onClick={() => setVue('bibliotheque')}
            >
              Ma bibliothèque{gardees.length > 0 ? ` (${gardees.length})` : ''}
            </button>
          </div>
        )}
      </div>
      <p className="veille-list__subtitle">
        {listeAffichee.length} entrée{listeAffichee.length > 1 ? 's' : ''} · {nbAnalyses} analyse
        {nbAnalyses > 1 ? 's' : ''} · {nbPratiques} à impact pratique
      </p>

      {vue === 'flux' && (
        <section className="veille-list__filtres" aria-label="Filtres">
          <Select
            label="Thème"
            valeur={theme}
            onChange={setTheme}
            options={themesPresents}
            rendu={labelTheme}
            tousLabel="Tous"
          />
          <Select
            label="Profession"
            valeur={profession}
            onChange={setProfession}
            options={professionsPresentes}
            tousLabel="Toutes"
          />
          <Select
            label="Impact"
            valeur={impact}
            onChange={setImpact}
            options={['pratique', 'informatif']}
            rendu={(v) => (v === 'pratique' ? 'Change la pratique' : 'Informatif')}
            tousLabel="Tous"
          />
          <Select
            label="Format"
            valeur={route}
            onChange={setRoute}
            options={['analyse', 'breve']}
            rendu={(v) => (v === 'analyse' ? 'Analyse critique' : 'Brève')}
            tousLabel="Tous"
          />
        </section>
      )}

      <section className="veille-list__tris" aria-label="Tri">
        <span className="veille-list__tris-label">Trier par</span>
        {TRIS.map((option) => (
          <button
            key={option.valeur}
            type="button"
            title={option.aide}
            className={
              option.valeur === tri ? 'veille-list__tri veille-list__tri--actif' : 'veille-list__tri'
            }
            onClick={() => setTri(option.valeur)}
          >
            {option.label}
          </button>
        ))}
        {tri === 'anciennete' && (
          <button
            type="button"
            className="veille-list__tri"
            title="Inverser le sens du tri par date"
            onClick={() => setOrdreAnciennete(ordreAnciennete === 'recent' ? 'ancien' : 'recent')}
          >
            {ordreAnciennete === 'recent' ? '↓ Plus récent d’abord' : '↑ Plus ancien d’abord'}
          </button>
        )}
      </section>

      {vue === 'flux' ? (
        visibles.length === 0 ? (
          <p className="veille-list__vide">Aucune entrée ne correspond à ces filtres.</p>
        ) : (
          <ul className="veille-list__cartes">{visibles.map(carte)}</ul>
        )
      ) : (
        <>
          {gardees.length === 0 ? (
            <p className="veille-list__vide">Aucune entrée gardée pour l'instant.</p>
          ) : (
            <ul className="veille-list__cartes">{gardees.map(carte)}</ul>
          )}
          {masquees.length > 0 && (
            <details className="veille-list__masquees">
              <summary>Masquées ({masquees.length}) — les reprendre</summary>
              <ul className="veille-list__cartes">{masquees.map(carte)}</ul>
            </details>
          )}
        </>
      )}
    </div>
  )
}

interface SelectProps {
  label: string
  valeur: string
  onChange: (valeur: string) => void
  options: string[]
  rendu?: (valeur: string) => string
  tousLabel: string
}

function Select({ label, valeur, onChange, options, rendu, tousLabel }: SelectProps) {
  return (
    <label className="veille-list__filtre">
      <span className="veille-list__filtre-label">{label}</span>
      <select value={valeur} onChange={(event) => onChange(event.target.value)}>
        <option value={TOUS}>{tousLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {rendu ? rendu(option) : option}
          </option>
        ))}
      </select>
    </label>
  )
}

function Carte({
  entree,
  ouvert,
  onToggle,
  etat,
  connecte,
  onMarquer,
  onOublier,
  onDemanderConnexion,
}: {
  entree: EntreeVeille
  ouvert: boolean
  onToggle: () => void
  /** État personnel courant (D51) — `undefined` = ni gardé ni masqué. */
  etat: EtatArticle | undefined
  connecte: boolean
  onMarquer: (etat: EtatArticle) => void
  onOublier: () => void
  onDemanderConnexion: () => void
}) {
  return (
    <li className={`veille-carte veille-carte--${entree.niveau_impact}`}>
      <div className="veille-carte__entete">
        <h2 className="veille-carte__titre">{entree.titre}</h2>

        {/* GARDER/MASQUER (D51, 2026-08-06) : état personnel, jamais partagé entre praticiens. Un
            visiteur non connecté voit une invite plutôt que des boutons inertes — cliquer dessus ouvre
            directement l'écran de connexion. Icônes compactes, alignées avec le titre : c'est une
            action secondaire, elle ne doit plus retarder la lecture du sujet. */}
        {connecte ? (
          <div className="veille-carte__etat">
            <button
              type="button"
              className={
                etat === 'garde' ? 'veille-carte__etat-bouton veille-carte__etat-bouton--actif' : 'veille-carte__etat-bouton'
              }
              title={etat === 'garde' ? 'Retirer de ma bibliothèque' : 'Garder dans ma bibliothèque'}
              aria-label={etat === 'garde' ? 'Retirer de ma bibliothèque' : 'Garder dans ma bibliothèque'}
              onClick={() => (etat === 'garde' ? onOublier() : onMarquer('garde'))}
            >
              {etat === 'garde' ? '★' : '☆'}
            </button>
            <button
              type="button"
              className={
                etat === 'masque' ? 'veille-carte__etat-bouton veille-carte__etat-bouton--actif' : 'veille-carte__etat-bouton'
              }
              title={etat === 'masque' ? 'Reprendre dans le flux' : 'Masquer'}
              aria-label={etat === 'masque' ? 'Reprendre dans le flux' : 'Masquer'}
              onClick={() => (etat === 'masque' ? onOublier() : onMarquer('masque'))}
            >
              {etat === 'masque' ? '🚫' : '✕'}
            </button>
          </div>
        ) : (
          <button type="button" className="veille-carte__etat-connexion" onClick={onDemanderConnexion}>
            Se connecter pour garder/masquer
          </button>
        )}
      </div>

      <p className="veille-carte__meta">
        {formaterDate(entree.meta.date_publication)} · {entree.source.nom} · {entree.type_publication}{' '}
        · {entree.themes.map(labelTheme).join(' · ')}
      </p>

      <div className="veille-carte__bandeau">
        <span className={`veille-carte__impact veille-carte__impact--${entree.niveau_impact}`}>
          {entree.niveau_impact === 'pratique' ? 'Change la pratique' : 'Informatif'}
        </span>
        {entree.niveau_preuve && <EvidenceBadge niveau={toBadgeNiveau(entree.niveau_preuve)} />}
        <span className={`veille-carte__route veille-carte__route--${entree.route}`}>
          {entree.route === 'analyse' ? 'Analyse critique' : 'Brève'}
        </span>
        <span className="veille-carte__temps">{entree.temps_lecture_min} min de lecture</span>
      </div>

      {/* SOP §7bis (D61) : sur orthophonie/santé-femme-périnatalité en route analyse, aucun référent
          de profession compétent n'a relu le fond clinique — bandeau visible, jamais réduit au détail
          déplié. Ne concerne jamais les 9 thèmes MG (relecture_referent y vaut toujours true). */}
      {!entree.meta.relecture_referent && (
        <p className="veille-carte__non-relu">
          ⚠ Non relu par un référent de profession — analyse produite par vérification tri-agents
          (SOP §7bis), sans validation clinique de fond sur ce domaine.
        </p>
      )}

      <p className="veille-carte__resume">{entree.resultat_resume}</p>

      {ouvert && (
        <div className="veille-carte__detail">
          <h3 className="veille-carte__sous-titre">Population</h3>
          <p>{entree.population}</p>

          {entree.appreciation_critique ? (
            <>
              <h3 className="veille-carte__sous-titre">Appréciation critique</h3>
              {entree.appreciation_critique
                .split(/\n\s*\n/)
                .filter((p) => p.trim())
                .map((paragraphe, index) => (
                  <p key={index}>{paragraphe.trim()}</p>
                ))}
            </>
          ) : (
            <p className="veille-carte__sans-appreciation">
              Une brève ne porte aucune appréciation critique propre : elle signale, situe et lie.
            </p>
          )}

          <p className="veille-carte__source">
            <a href={entree.source.lien} target="_blank" rel="noreferrer noopener">
              Source primaire
            </a>
            {entree.source.doi && <span> · DOI {entree.source.doi}</span>}
          </p>
        </div>
      )}

      <button type="button" className="veille-carte__toggle" onClick={onToggle}>
        {ouvert ? 'Replier' : entree.appreciation_critique ? "Lire l'appréciation critique" : 'Voir le détail'}
      </button>
    </li>
  )
}
