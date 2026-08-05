import { useMemo, useState } from 'react'
import type { NiveauPreuve } from '../../shared/types'
import { EvidenceBadge } from '../../shared/badges/EvidenceBadge'
import type { EntreeVeille, NiveauPreuveVeille } from '../content/entree.types'
import { entrees, professionsPresentes, semaines, themesPresents } from '../content/loadEntrees'
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
  'prevention-depistage-vaccination': 'Prévention, dépistage, vaccination',
  'sante-mentale-addictologie': 'Santé mentale et addictologie',
  'douleur-soins-palliatifs': 'Douleur et soins palliatifs',
  ETP: 'Éducation thérapeutique',
  'sante-femme-perinatalite': 'Santé de la femme et périnatalité',
  orthophonie: 'Orthophonie',
  'soins-infirmiers': 'Soins infirmiers',
}

const labelTheme = (slug: string) => THEME_LABELS[slug] ?? slug

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

type Tri = 'impact' | 'temps' | 'preuve'

const TRIS: { valeur: Tri; label: string; aide: string }[] = [
  { valeur: 'impact', label: "Impact d'abord", aide: "Ce qui change la pratique avant ce qui l'informe" },
  { valeur: 'temps', label: 'Temps de lecture', aide: 'Le plus court en premier' },
  { valeur: 'preuve', label: 'Niveau de preuve', aide: 'Le plus solide en premier' },
]

const TOUS = '__tous__'

export function VeilleListScreen() {
  const [semaine, setSemaine] = useState<string>(semaines[0] ?? TOUS)
  const [theme, setTheme] = useState<string>(TOUS)
  const [profession, setProfession] = useState<string>(TOUS)
  const [impact, setImpact] = useState<string>(TOUS)
  const [route, setRoute] = useState<string>(TOUS)
  const [seulementDecision, setSeulementDecision] = useState(false)
  const [tri, setTri] = useState<Tri>('impact')
  const [deplie, setDeplie] = useState<string | null>(null)

  const visibles = useMemo(() => {
    const filtrees = entrees.filter((e) => {
      if (semaine !== TOUS && e.date_semaine !== semaine) return false
      if (theme !== TOUS && !e.themes.includes(theme)) return false
      if (profession !== TOUS && !e.professions_concernees.includes(profession)) return false
      if (impact !== TOUS && e.niveau_impact !== impact) return false
      if (route !== TOUS && e.route !== route) return false
      if (seulementDecision && !e.impact_algorithme.concerne_decision) return false
      return true
    })

    const parTitre = (a: EntreeVeille, b: EntreeVeille) => a.titre.localeCompare(b.titre, 'fr')

    return [...filtrees].sort((a, b) => {
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
  }, [semaine, theme, profession, impact, route, seulementDecision, tri])

  const nbAnalyses = visibles.filter((e) => e.route === 'analyse').length
  const nbPratiques = visibles.filter((e) => e.niveau_impact === 'pratique').length

  return (
    <div className="veille-list">
      <h1 className="veille-list__title">Veille clinique</h1>
      <p className="veille-list__subtitle">
        {visibles.length} entrée{visibles.length > 1 ? 's' : ''} · {nbAnalyses} analyse
        {nbAnalyses > 1 ? 's' : ''} · {nbPratiques} à impact pratique
      </p>

      <section className="veille-list__filtres" aria-label="Filtres">
        <Select label="Semaine" valeur={semaine} onChange={setSemaine} options={semaines} tousLabel="Toutes" />
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
        <label className="veille-list__check">
          <input
            type="checkbox"
            checked={seulementDecision}
            onChange={(event) => setSeulementDecision(event.target.checked)}
          />
          Touche un algorithme
        </label>
      </section>

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
      </section>

      {visibles.length === 0 ? (
        <p className="veille-list__vide">Aucune entrée ne correspond à ces filtres.</p>
      ) : (
        <ul className="veille-list__cartes">
          {visibles.map((entree) => (
            <Carte
              key={entree.id}
              entree={entree}
              ouvert={deplie === entree.id}
              onToggle={() => setDeplie(deplie === entree.id ? null : entree.id)}
            />
          ))}
        </ul>
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
}: {
  entree: EntreeVeille
  ouvert: boolean
  onToggle: () => void
}) {
  const brouillon = entree.meta.statut === 'brouillon'

  return (
    <li className={`veille-carte veille-carte--${entree.niveau_impact}`}>
      <div className="veille-carte__bandeau">
        <span className={`veille-carte__route veille-carte__route--${entree.route}`}>
          {entree.route === 'analyse' ? 'Analyse critique' : 'Brève'}
        </span>
        <span className={`veille-carte__impact veille-carte__impact--${entree.niveau_impact}`}>
          {entree.niveau_impact === 'pratique' ? 'Change la pratique' : 'Informatif'}
        </span>
        {entree.niveau_preuve && <EvidenceBadge niveau={toBadgeNiveau(entree.niveau_preuve)} />}
        {entree.impact_algorithme.concerne_decision && (
          <span className="veille-carte__algo">
            Touche l'algorithme · {entree.impact_algorithme.noeuds_impactes.join(', ')}
          </span>
        )}
        {brouillon && <span className="veille-carte__brouillon">Brouillon — relecture à faire</span>}
        <span className="veille-carte__temps">{entree.temps_lecture_min} min</span>
      </div>

      <h2 className="veille-carte__titre">{entree.titre}</h2>

      <p className="veille-carte__meta">
        {entree.source.nom} · {entree.type_publication} ·{' '}
        {entree.themes.map(labelTheme).join(' · ')}
      </p>

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
