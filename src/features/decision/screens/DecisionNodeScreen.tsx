import { useDeferredValue, useMemo, useState } from 'react'
import type { Navigation } from '../../shared/navigation'
import { AlertList } from '../components/AlertList'
import { ArgumentPanel } from '../components/ArgumentPanel'
import { CriteriaForm } from '../components/CriteriaForm'
import { OptionCard } from '../components/OptionCard'
import { getNoeudById } from '../content/loadNodes'
import type { Criteria, CriteriaValue } from '../engine/conditions'
import { criteresPertinents } from '../engine/relevance'
import { ESPERANCE_VIE_DRIVERS, hasEsperanceVieCritere, suggestEsperanceVie } from '../lib/esperanceVieDefault'
import { buildDefaultCriteria, decisifsAConfirmer, reinitialiserChampsMasques } from '../lib/formLayout'
import { construireVueDecision } from '../lib/vueDecision'
import { formatDateRevue, labelForDomaine } from '../lib/labels'
import './DecisionNodeScreen.css'

interface DecisionNodeScreenProps {
  nodeId: string | undefined
  go: Navigation['go']
}

/**
 * D3 — nœud interrogeable (S4.md T-006) : formulaire de critères → options applicables (moteur S3)
 * → argumentaire dépliable. Recalcule `construireVueDecision` à chaque changement de critère (état
 * éphémère, `criteria`/`argOpen` en `useState` — aucune persistance, CLAUDE.md invariant 1). Tout ce
 * qui est affiché vient strictement du modèle de vue (`lib/vueDecision.ts` `construireVueDecision`,
 * T-006 "Décision clé") ; si le contenu et les critères sont incohérents (variable inconnue, etc.),
 * le moteur sous-jacent (`evaluateNode`) lève une `ConditionError` qui n'est volontairement pas
 * capturée ici — propager l'erreur plutôt que masquer un écart moteur/contenu (S4.md règle "Si
 * bloqué" ; `engine/conditions.ts`).
 */
export function DecisionNodeScreen({ nodeId, go }: DecisionNodeScreenProps) {
  const node = nodeId ? getNoeudById(nodeId) : undefined

  const [criteria, setCriteria] = useState<Criteria>(() =>
    node ? buildDefaultCriteria(node.criteres_entree) : {},
  )
  // Critères déjà modifiés par l'utilisateur (T-009) : distingue une valeur par défaut (0, non
  // fiable cliniquement) d'une valeur réellement saisie, pour ne pas afficher un résultat basé sur
  // un âge/ancienneté resté à 0 sans que le praticien s'en rende compte.
  const [touched, setTouched] = useState<Set<string>>(() => new Set())
  const [argOpen, setArgOpen] = useState(false)

  // Les critères dérivés (ex. cible_atteinte = HbA1c_actuelle <= HbA1c_cible ; over_basalisation =
  // dose_basale_actuelle / poids > 0,5) sont recalculés depuis les primitives saisies AVANT l'évaluation
  // du moteur — le DSL de `conditions.ts` ne compare qu'`variable OP littéral` (engine/deriveCritere.ts).
  //
  // La reco est calculée en PERMANENCE (P3 · S7-ui Lot 3, « sans gate dur »). L'ancien gate — exiger que
  // TOUS les nombres référencés soient saisis avant d'afficher quoi que ce soit — contredisait le moteur
  // de pertinence : un champ pouvait être à la fois estompé « sans effet sur la reco » ET bloquant
  // (constaté sur `age`, référencé par le dérivé `terrain_fragile` mais non décisif pour le patient en
  // cours). Les deux notions sont désormais dérivées de la MÊME source — `criteresPertinents` — ce qui
  // rend cette contradiction impossible par construction : estompé ⟺ non pertinent, réclamé ⟺ pertinent.
  //
  // Modèle de vue UNIQUE (`lib/vueDecision.ts`) : l'écran ne calcule plus rien lui-même (ni
  // `groupesParFamille`, ni `computeBadges`, ni les doses `calculs`) — tout vient de `construireVueDecision`,
  // la même fonction pure que sérialise `engine/relevance.ts` pour la signature de pertinence.
  const vue = useMemo(() => {
    if (!node) return undefined
    return construireVueDecision(node, criteria)
  }, [node, criteria])

  // TEMPORISATION (tâche 6c, recette référent) : `criteresPertinents` perturbe le moteur une fois par
  // critère saisissable (plusieurs évaluations d'`evaluateNode` chacune) — recalculer à CHAQUE frappe sur
  // un `nombre` (ex. HbA1c) fait bouger l'estompage de champs plus haut dans le formulaire pendant que le
  // praticien tape encore, ce qui est déstabilisant (bug remonté : « modifier l'IMC active/désactive des
  // critères plus haut »). `useDeferredValue` laisse React prioriser la frappe (valeur affichée immédiate,
  // cf. `criteria` passé tel quel à `CriteriaForm`) et ne recalculer la pertinence qu'une fois le rythme de
  // saisie retombé — sans code de temporisation maison, sans changer `relevance.ts` (qui reste synchrone
  // et testable, la temporisation ne vit QUE dans cet écran).
  const criteriaDiffere = useDeferredValue(criteria)

  // Critères PERTINENTS pour ce patient (moteur `engine/relevance.ts`, refonte UI P3) : pilote l'estompage
  // des champs sans effet (remarque 6) et la reco « provisoire » (remarque 7). Calculé sur `criteriaDiffere`
  // (temporisé) : coût borné mais non négligeable (plusieurs évaluations du moteur déterministe par frappe).
  const pertinents = useMemo(() => {
    if (!node || node.criteres_entree.length === 0 || node.options.length === 0) return undefined
    return criteresPertinents(node, criteriaDiffere)
  }, [node, criteriaDiffere])

  // Décisifs encore non confirmés → tant qu'il en reste, la reco est « provisoire » (jamais bloquée).
  // Réclamé et estompé dérivent tous deux de `pertinents` (cf. `decisifsAConfirmer`) : un champ ne peut
  // plus être simultanément « sans effet » et exigé. Calculé sur la MÊME source différée que `pertinents`
  // (`criteriaDiffere`, pas `criteria`) : sinon la visibilité (immédiate) et la pertinence (temporisée)
  // pourraient transitoirement se contredire (ex. un champ tout juste démasqué mais pas encore réévalué).
  const decisifsManquants = useMemo(
    () => decisifsAConfirmer(node?.criteres_entree ?? [], criteriaDiffere, touched, pertinents),
    [node, criteriaDiffere, touched, pertinents],
  )

  if (!node) {
    return (
      <div className="decision-node decision-node--missing">
        <p>Nœud introuvable.</p>
        <button type="button" className="decision-node__back" onClick={() => go('decisionDomains')}>
          ← Retour aux algorithmes
        </button>
      </div>
    )
  }

  // Calculé en synchrone (pas via les updaters de `setState`) : la mise à jour de `touched` dépend du
  // résultat de celle de `criteria`, et faire transiter cette information par une variable mutée entre
  // deux updaters dépendrait de leur ordre d'exécution et casserait en StrictMode (double invocation).
  const handleCriteriaChange = (nom: string, value: CriteriaValue) => {
    const next = { ...criteria, [nom]: value }
    // Suggestion auto d'`esperance_vie` (non sourcée, cf. lib/esperanceVieDefault.ts) : ne
    // s'applique que tant que le praticien n'a pas choisi cette valeur lui-même, et se recalcule
    // seulement quand un critère dont elle dépend change (pas à chaque frappe non liée).
    const espChoisieAMain = touched.has('esperance_vie') || nom === 'esperance_vie'
    const dependClicheEsp = (ESPERANCE_VIE_DRIVERS as readonly string[]).includes(nom)
    if (!espChoisieAMain && dependClicheEsp && hasEsperanceVieCritere(node.criteres_entree)) {
      next.esperance_vie = suggestEsperanceVie(next)
    }

    // Un champ que ce changement vient de MASQUER (`visible_si`) est remis à sa valeur par défaut : une
    // valeur invisible ne doit jamais continuer à piloter la reco (cf. `formLayout.ts`). Il redevient
    // aussi « non renseigné », sinon il passerait pour confirmé s'il réapparaissait plus tard.
    const { criteria: nettoye, reinitialises } = reinitialiserChampsMasques(node.criteres_entree, next)
    setCriteria(nettoye)
    setTouched((previous) => {
      const suivant = new Set(previous).add(nom)
      for (const efface of reinitialises) suivant.delete(efface)
      return suivant
    })
  }

  // « Rien à signaler » (tâche 4) : confirme d'un coup les drapeaux (`bool`) décisifs non renseignés
  // d'une section SANS changer leur valeur — ils restent à `false`, qui EST la réponse clinique (« non »).
  // Sans ce raccourci, ces critères resteraient éternellement « non confirmés » dans le compteur de la
  // reco provisoire dès lors que le praticien n'a — légitimement — rien à cocher.
  const handleConfirmerChamps = (noms: string[]) => {
    setTouched((previous) => {
      const suivant = new Set(previous)
      for (const nom of noms) suivant.add(nom)
      return suivant
    })
  }

  // Aucun nœud « à venir » n'existe réellement en contenu (P1 ne livre que cible-glycemique) : la
  // notion de nœud non détaillé du prototype (`detailed: false`, données figées) n'a pas
  // d'équivalent en contenu réel. Repli défensif générique (pas de connaissance d'id de nœud
  // particulier, DECISIONS.md D8) : un nœud sans critère ni option exploitable retombe sur le bloc
  // placeholder du prototype plutôt que de planter (le schéma impose `options.length >= 1`, ce cas
  // ne devrait donc jamais se produire avec un contenu valide — robustesse, pas un chemin attendu).
  const isPlaceholder = node.criteres_entree.length === 0 || node.options.length === 0

  return (
    <div className="decision-node">
      <button type="button" className="decision-node__back" onClick={() => go('decisionDomains')}>
        ← Domaine : {labelForDomaine(node.domaine)}
      </button>
      <h1 className="decision-node__title">{node.titre}</h1>
      <p className="decision-node__population">{node.population_cible}</p>

      {isPlaceholder ? (
        <div className="decision-node__placeholder">
          <div className="decision-node__placeholder-title">Contenu détaillé à venir</div>
          <p className="decision-node__placeholder-text">
            Ce nœud suivra la même structure que « Cible glycémique » : formulaire de critères,
            options avec preuve et effet attendu, argumentaire déplié avec reco officielle vs
            position critique.
          </p>
        </div>
      ) : (
        <>
          <CriteriaForm
            criteresEntree={node.criteres_entree}
            criteria={criteria}
            criteriaGroupement={criteriaDiffere}
            touched={touched}
            pertinents={pertinents}
            aConfirmer={new Set(decisifsManquants)}
            hints={
              hasEsperanceVieCritere(node.criteres_entree) && !touched.has('esperance_vie')
                ? { esperance_vie: 'Suggestion auto (âge, fragilité, comorbidité grave, antécédent CV) — à valider' }
                : undefined
            }
            onConfirmerChamps={handleConfirmerChamps}
            onChange={handleCriteriaChange}
          />

          {vue && <AlertList alertes={vue.alertes} />}

          <div className="decision-node__section-title">
            {decisifsManquants.length > 0 ? 'Options applicables — provisoire' : 'Options applicables'}
          </div>
          {decisifsManquants.length > 0 && (
            <p className="decision-node__provisional">
              <strong>Reco provisoire</strong> — {decisifsManquants.length} critère
              {decisifsManquants.length > 1 ? 's décisifs non confirmés' : ' décisif non confirmé'} dans le
              formulaire ci-dessus : les mesures chiffrées y sont marquées « à confirmer », les drapeaux se
              confirment d'un clic par « Rien à signaler ». La recommandation peut encore changer.
            </p>
          )}
          {vue && vue.familles.some((famille) => famille.groupes.length > 0) ? (
            (() => {
              // Regroupement PAR FAMILLE (`Noeud.familles` si déclarées, sinon repli historique — cf.
              // `lib/vueDecision.ts` `construireVueDecision`, qui compose `groupesParFamille`) : une
              // section par famille, dans l'ORDRE EXPLICITE de `Noeud.familles` (plus un sous-produit de
              // l'ordre d'écriture des options), et à l'intérieur seulement, les groupes d'égalité rendus
              // côte à côte pour un rang fini partagé — jamais deux options de familles différentes, même
              // à rang égal (ce qui suggérerait à tort un choix exclusif entre deux gestes qui en réalité
              // se CUMULENT, ex. « introduire un iSGLT2 » et « réduire la posologie du sulfamide »). Repli
              // sans `famille` déclarée (les 4 autres nœuds actuels) : une unique famille sans libellé,
              // rendu identique à l'ancien comportement à plat. Le badge (« le badge, c'est le plan »,
              // 2026-07-25) et les doses calculées sont déjà résolus dans `vue` — l'écran ne calcule plus
              // rien, il assemble.
              let cle = 0
              return vue.familles.map((famille, indexFamille) => {
                const sectionsGroupes = famille.groupes.map((groupe) => {
                  const cartes = groupe.map((optionVue) => (
                    <OptionCard
                      // `intitule` n'est pas garanti unique (cf. commentaire `EvaluateNodeResult` dans
                      // `engine/evaluateNode.ts`) : on compose avec un compteur pour une clé React sûre.
                      key={`${cle++}-${optionVue.option.intitule}`}
                      option={optionVue.option}
                      badge={optionVue.badge}
                      reasons={optionVue.reasons}
                      calculs={optionVue.calculs}
                    />
                  ))
                  if (groupe.length < 2) return cartes
                  return (
                    <div className="decision-node__egalite" key={`egalite-${cle}`}>
                      {/* Mention NEUTRE (correctif « priorité multi-natures ») : elle affirmait avant
                          « aucune de ces options n'est préférable à l'autre », faux pour des gestes
                          cumulables. La nuance « en choisir un » / « cumulables » est désormais portée
                          par le TITRE DE FAMILLE (mention générique dérivée de `exclusive`, ci-dessous),
                          jamais par cet encadré générique. */}
                      <p className="decision-node__egalite-mention">À égalité — même niveau de priorité.</p>
                      <div className="decision-node__egalite-grid">{cartes}</div>
                    </div>
                  )
                })
                if (famille.libelle == null) return sectionsGroupes
                return (
                  <div className="decision-node__famille" key={`famille-${indexFamille}-${famille.libelle}`}>
                    <div className="decision-node__famille-titre">
                      {famille.libelle}
                      {/* Mention d'interface GÉNÉRIQUE dérivée de `exclusive` (correctif « libellés
                          sans redondance », 2026-07-25) : jamais un vocabulaire clinique, juste la
                          convention « on choisit un » vs « tout est à faire ». Absente si `exclusive`
                          est `undefined` (nœud sans `familles` déclarées, repli). */}
                      {famille.exclusive === true && (
                        <span className="decision-node__famille-mention"> — en choisir un</span>
                      )}
                      {famille.exclusive === false && (
                        <span className="decision-node__famille-mention"> — gestes cumulables</span>
                      )}
                    </div>
                    {sectionsGroupes}
                  </div>
                )
              })
            })()
          ) : (
            <p className="decision-node__empty">Aucune option ne correspond à ces critères.</p>
          )}

          <button
            type="button"
            className="decision-node__toggle-argument"
            onClick={() => setArgOpen((open) => !open)}
          >
            {argOpen ? "Replier l'argumentaire" : "Déplier l'argumentaire"}
          </button>

          {argOpen && <ArgumentPanel node={node} />}
        </>
      )}

      <div className="decision-node__footer">
        Révisé le {formatDateRevue(node.meta.date_revue)} · Aide à la décision fondée sur l'EBM — le
        praticien reste le lien avec le patient et le seul responsable de la décision.
      </div>
    </div>
  )
}
