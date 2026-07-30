import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import type { Navigation } from '../../shared/navigation'
import { AlertList } from '../components/AlertList'
import { ArgumentPanel } from '../components/ArgumentPanel'
import { CadrageList } from '../components/CadrageList'
import { CriteriaForm } from '../components/CriteriaForm'
import { OptionCard } from '../components/OptionCard'
import { PopulationCible } from '../components/PopulationCible'
import { getModuleDuNoeud } from '../content/loadModules'
import { getNoeudById } from '../content/loadNodes'
import type { CritereEntree } from '../content/node.types'
import type { Criteria, CriteriaValue } from '../engine/conditions'
import { contraintesViolees } from '../engine/contraintes'
import { criteresPertinents } from '../engine/relevance'
import { describeReasons } from '../lib/conditionText'
import { ESPERANCE_VIE_DRIVERS, hasEsperanceVieCritere, suggestEsperanceVie } from '../lib/esperanceVieDefault'
import {
  appliquerPreremplissage,
  buildDefaultCriteria,
  decisifsAConfirmer,
  reinitialiserChampsMasques,
  valeurParDefaut,
} from '../lib/formLayout'
import { memoriserCriteres, reinitialiserSession, valeursReprises } from '../lib/sessionCriteres'
import { plafonnerPistes, PLAFOND_PISTES } from '../lib/replierAffichage'
import type { FamilleVue } from '../lib/vueDecision'
import { construireVueDecision } from '../lib/vueDecision'
import { formatDateRevue, labelForCritere, labelForDomaine } from '../lib/labels'
import './DecisionNodeScreen.css'

interface DecisionNodeScreenProps {
  nodeId: string | undefined
  go: Navigation['go']
}

/**
 * Noms des critères SAISISSABLES cités par l'expression d'une contrainte violée (T-022, P4/S3) — pour
 * nommer « les champs en cause » dans le bloc de suspension (D31). Même mécanique de correspondance que
 * `engine/evaluateNode.ts` `primitivesReferencees` (frontière de mot `\b`, un seul niveau de
 * déréférencement d'un critère `derive`, jamais chaîné) — RÉIMPLÉMENTÉE ici plutôt qu'importée : usage de
 * PRÉSENTATION seulement, même parti pris que `lib/conditionText.ts` (qui ne réutilise pas non plus le
 * moteur pour cette raison) ; `engine/` est hors périmètre de cette session (S3.md "Hors périmètre").
 *
 * Une contrainte (`engine/contraintes.ts`) compare typiquement DEUX critères entre eux (ex.
 * `"TBR_severe <= TBR"`) : les deux noms référencés par l'expression comptent comme « en cause », pas
 * seulement celui de gauche — l'outil ne sait pas lequel des deux est erroné (cf. docstring
 * `Contrainte`, `content/node.types.ts`).
 */
function champsEnCause(expression: string, criteresEntree: CritereEntree[]): string[] {
  const noms = new Set<string>()
  for (const critere of criteresEntree) {
    if (!new RegExp(`\\b${critere.nom}\\b`).test(expression)) continue
    if (critere.derive == null) {
      noms.add(critere.nom)
      continue
    }
    for (const autre of criteresEntree) {
      if (autre.derive == null && new RegExp(`\\b${autre.nom}\\b`).test(critere.derive)) noms.add(autre.nom)
    }
  }
  return [...noms]
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
 *
 * VALEUR INDÉTERMINÉE EN VIGUEUR (DECISIONS.md D20, `docs/decision/validation/chantier-2026-07-26/
 * SPEC-valeur-indeterminee.md` §2) : cet écran est celui qui alimente enfin `renseignes` — le moteur
 * (`evaluateNode`/`construireVueDecision`) et le calcul de pertinence (`criteresPertinents`) l'acceptaient
 * déjà en paramètre optionnel, mais aucun appelant ne le fournissait avant ce lot (repli « tout est
 * renseigné », comportement historique). `touched` (déjà présent, T-009) EST cet ensemble `renseignes` :
 * un critère « touché » par le praticien EST un critère « renseigné » — cf. `handleCriteriaChange`/
 * `handleCriteriaEffacer` ci-dessous pour la distinction saisi/vidé/jamais-touché qui rend cette
 * équivalence vraie (sans elle, vider un champ `nombre` laissait `touched` gonflé d'un « 0 » jamais
 * répondu, cf. défauts de recette 12.2/13.3).
 */
export function DecisionNodeScreen({ nodeId, go }: DecisionNodeScreenProps) {
  const node = nodeId ? getNoeudById(nodeId) : undefined
  // Module d'appartenance (D22), s'il existe : pilote UNIQUEMENT le lien de retour. Aucune donnée du
  // module n'entre dans l'évaluation — garde-fou R1, le nœud reste évaluable seul.
  const moduleDuNoeud = node ? getModuleDuNoeud(node) : undefined

  // K6 (décision référent, 2026-07-27) — REPRISE DE SESSION. Les critères que le contenu déclare
  // `partage` et que le praticien a déjà saisis sur un AUTRE nœud sont pré-remplis ici. Calculé UNE FOIS
  // à l'initialisation de l'état (`useState(() => …)`), jamais à chaque rendu : une valeur reprise est un
  // point de départ, pas une source qui écraserait en continu ce que le praticien tape ensuite.
  //
  // Ce qui circule est une valeur SAISIE, jamais une conclusion du moteur — cf. `lib/sessionCriteres.ts`
  // pour le raisonnement complet vis-à-vis du garde-fou R1 et de l'invariant « aucune persistance ».
  const reprises = node ? valeursReprises(node.criteres_entree) : []

  const [criteria, setCriteria] = useState<Criteria>(() => {
    if (!node) return {}
    const base = buildDefaultCriteria(node.criteres_entree)
    for (const { nom, valeur } of reprises) base[nom] = valeur
    // Une valeur reprise peut en pré-remplir une autre : la cible et l'HbA1c reprises de la session
    // suffisent à proposer la position vs objectif dès l'ouverture du nœud.
    return appliquerPreremplissage(node.criteres_entree, base, new Set(reprises.map((r) => r.nom))).criteria
  })
  // Critères déjà modifiés par l'utilisateur (T-009) : distingue une valeur par défaut (0, non
  // fiable cliniquement) d'une valeur réellement saisie, pour ne pas afficher un résultat basé sur
  // un âge/ancienneté resté à 0 sans que le praticien s'en rende compte.
  //
  // UNE VALEUR REPRISE COMPTE COMME SAISIE, et c'est un arbitrage à assumer plutôt qu'un raccourci : le
  // praticien A RÉPONDU à cette question, dans cette consultation, sur un autre écran. La laisser hors de
  // `touched` afficherait une valeur tout en la traitant comme indéterminée — le moteur la marquerait
  // « à confirmer » alors qu'elle est affichée remplie, c'est-à-dire exactement le défaut A du lot 1 (un
  // champ qui paraît répondu sans l'être). L'écran la SIGNALE donc comme reprise (`repris`), au lieu de la
  // faire passer pour non répondue.
  const [touched, setTouched] = useState<Set<string>>(() => new Set(reprises.map((r) => r.nom)))
  // Noms des champs PRÉ-REMPLIS, pour que le formulaire dise d'où vient la valeur. Figé à l'initialisation
  // et jamais mis à jour : dès que le praticien modifie un de ces champs, la mention devient fausse — d'où
  // le retrait ci-dessous dans `handleCriteriaChange`.
  const [repris, setRepris] = useState<Set<string>>(() => new Set(reprises.map((r) => r.nom)))
  // Champs remplis par une règle de CONTENU (`preremplissage`, K6) plutôt que par le praticien. Distincts
  // de `repris` (valeur venue d'un autre nœud) : l'origine n'est pas la même, la mention non plus.
  const [preremplis, setPreremplis] = useState<Set<string>>(() =>
    node
      ? new Set(
          appliquerPreremplissage(
            node.criteres_entree,
            (() => {
              const base = buildDefaultCriteria(node.criteres_entree)
              for (const { nom, valeur } of reprises) base[nom] = valeur
              return base
            })(),
            new Set(reprises.map((r) => r.nom)),
          ).preremplis,
        )
      : new Set(),
  )
  const [argOpen, setArgOpen] = useState(false)
  // R4 (`docs/decision/GRAMMAIRE-NOEUD.md`) : les options NON RETENUES (faute de condition) sont une
  // information d'EXPLICATION, consultée sur demande — fermée par défaut, jamais poussée à l'écran
  // (contrairement aux options ÉCARTÉES par une exclusion, information de SÉCURITÉ, toujours visibles).
  const [nonRetenuesOpen, setNonRetenuesOpen] = useState(false)
  // T-057 (P8 · S2, 2026-07-30) — FRONTIÈRE DE RE-ENTRÉE (D28). `frontiereReprise`/`afficherChoixReprise`
  // ci-dessous (calculés plus bas, une fois `criteresRenseignes` en main) décident SI le choix « Reprendre
  // / Repartir de zéro » doit remplacer le panneau de résultats. `frontiereLevee` mémorise qu'IL A DÉJÀ ÉTÉ
  // LEVÉ pour CE montage de nœud (clic sur « Reprendre les valeurs de ce patient ») : sans cet état
  // dédié, il n'existe aucune façon de distinguer un clic d'acquiescement (qui ne touche AUCUN champ) d'une
  // frontière encore active — la condition de frontière, elle, resterait vraie indéfiniment (`repris` ne
  // change pas suite à ce clic). Local à ce composant, jamais dans `sessionCriteres.ts` (« Si bloqué »
  // T-057 : aucun nouvel état global).
  const [frontiereLevee, setFrontiereLevee] = useState(false)

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
  // FUSION `touched` ∪ `preremplis` (T-023, D-06, P4/S3) — CE QUE L'ÉCRAN ET LE MOTEUR TRAITENT COMME
  // « RENSEIGNÉ » à partir d'ici, SANS changer `touched` lui-même.
  //
  // LE DÉFAUT (D-06) : une valeur calculée par `preremplissage` (K6) était bien écrite dans `criteria`
  // (`appliquerPreremplissage`, `handleCriteriaChange` ci-dessus) mais JAMAIS ajoutée à `touched` — donc
  // invisible au formulaire (`CriteriaForm` n'allume `aria-pressed`/`data-on` que sur `touched.has(nom)`)
  // ET invisible au moteur (`construireVueDecision`/`criteresPertinents`/... ne reçoivent que `touched`
  // comme `renseignes`). L'étiquette « · calculé, à vérifier » s'affichait donc seule, sans rien qui la
  // rende vraie : exactement l'hypothèse 1 de T-023 Étape 3, vérifiée avant de corriger.
  //
  // POURQUOI PAS SIMPLEMENT AJOUTER `preremplis` DANS `touched` : `appliquerPreremplissage`
  // (`lib/formLayout.ts`) ne reconsidère JAMAIS un critère déjà dans le `renseignes` qu'on lui passe
  // (`!renseignes.has(c.nom)`, cf. sa docstring K6 : « le pré-remplissage se REJOUE à chaque saisie, tant
  // que le champ visé n'a pas été répondu »). Fusionner les deux ensembles AVANT l'appel à
  // `appliquerPreremplissage` (dans `handleCriteriaChange`) figerait la valeur suggérée à la première
  // saisie qui la déclenche — un patient dont la cible bouge ensuite ne verrait plus jamais la position
  // rebasculer (`nettement_au_dessus` → `au_dessus`), ce que T-023 Étape 3/5 exige de vérifier. `touched`
  // brut continue donc SEUL de nourrir `appliquerPreremplissage`/`reinitialiserChampsMasques`
  // (`handleCriteriaChange`/`handleCriteriaEffacer`, inchangés) ; CETTE fusion, elle, nourrit tout ce qui
  // AFFICHE ou ÉVALUE une fois la valeur posée : le formulaire (`touched` passé à `CriteriaForm`
  // ci-dessous) et les quatre calculs de `renseignes` du moteur (`vue`, `pertinents`, `violations`,
  // `decisifsManquants`).
  const criteresRenseignes = useMemo(() => new Set([...touched, ...preremplis]), [touched, preremplis])

  // T-057 (P8 · S2, 2026-07-30) — FRONTIÈRE DE RE-ENTRÉE (D28). CE N'EST PAS UN BUG DE DÉMONTAGE : c'est
  // la conjonction de deux choses correctes prises séparément — (1) une valeur REPRISE compte comme
  // SAISIE (`touched`, arbitrage assumé au-dessus, ≈ l.111-117 : la laisser hors de `touched` afficherait
  // une valeur remplie tout en la traitant comme indéterminée) ; (2) certains nœuds déclarent `partage:
  // true` sur LA TOTALITÉ de leurs critères décisifs (ex. `cible-glycemique` : `age`,
  // `anciennete_diabete_annees`, `esperance_vie`, `fragilite`). La mémoire de session suffit alors, À
  // ELLE SEULE, à reconstituer toute la réponse — un nœud RÉ-OUVERT peut afficher une recommandation
  // BADGÉE ET FINIE, calculée pour le patient PRÉCÉDENT, avec « repris de votre saisie », SANS que rien
  // n'ait été saisi SUR CET écran. Reproduit en 3 clics dans la recette du 2026-07-30 (§« DÉFAUT MAJEUR
  // découvert entre N2 et N3 ») : sortir par « ← Domaine », ré-ouvrir le même nœud, lire le résultat de la
  // patiente précédente — « en consultation de 15 minutes, on lit le résultat, pas le formulaire ».
  //
  // LE CORRECTIF EST UNE FRONTIÈRE, PAS UN RETRAIT (D28 reste vivant, la reprise elle-même n'est pas
  // défaite — cf. le formulaire, inchangé). Condition de déclenchement ÉTROITE, à respecter À LA LETTRE
  // (S2.md T-057 "Étapes" 2, citée mot pour mot) : « `repris` non vide ET aucun élément de `touched` qui
  // ne soit dans `repris` » — autrement dit, `repris` ET `touched` calculés à partir de ce que l'écran a
  // DÉJÀ en main (aucun nouvel état global, `sessionCriteres.ts` non touché). Se lit : au moins UNE valeur
  // vient de la mémoire, et RIEN d'autre n'a été touché ici — ni un nouveau champ (`touched` grossirait
  // au-delà de `repris`), ni un champ reprise ÉDITÉ (il quitterait `repris` — cf. `handleCriteriaChange`,
  // « la mention "repris" cesse dès que le praticien touche au champ » — tout en restant dans `touched`,
  // cassant l'inclusion). DÈS QU'UN SEUL CHAMP EST SAISI SUR CE NŒUD, l'une des deux branches de la
  // condition devient fausse et le comportement actuel est RIGOUREUSEMENT INCHANGÉ — c'est ce qui
  // préserve le gain salué en N3/N4 (arriver sur un nœud avec 3 champs déjà remplis). Sur un nœud sans
  // AUCUNE reprise (premier patient, ou aucun critère `partage`), `repris` est vide et la frontière ne se
  // déclenche jamais.
  //
  // `frontiereLevee` (état dédié, ci-dessus) écarte la frontière pour le RESTE de ce montage une fois
  // « Reprendre les valeurs de ce patient » cliqué — sans lui, un clic d'acquiescement qui ne touche AUCUN
  // champ laisserait la condition vraie indéfiniment.
  const frontiereReprise = repris.size > 0 && [...touched].every((nom) => repris.has(nom))
  const afficherChoixReprise = frontiereReprise && !frontiereLevee

  const vue = useMemo(() => {
    if (!node) return undefined
    // `criteresRenseignes` (D20 + T-023/D-06) : calculé sur `criteria` IMMÉDIAT, la même source
    // temporelle — les deux avancent ensemble, jamais l'un en retard sur l'autre.
    return construireVueDecision(node, criteria, criteresRenseignes)
  }, [node, criteria, criteresRenseignes])

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
    // `criteresRenseignes` (D20 + T-023/D-06) transmis NON DIFFÉRÉ, comme `decisifsManquants` ci-dessous :
    // seul `criteria` (via `criteriaDiffere`) est temporisé (cf. commentaire au-dessus), `criteresRenseignes`
    // ne l'est jamais — sans quoi un champ tout juste répondu resterait vu « indéterminé » un instant de trop.
    return criteresPertinents(node, criteriaDiffere, criteresRenseignes)
  }, [node, criteriaDiffere, criteresRenseignes])

  // CONTRAINTES DE SAISIE violées (K3, `engine/contraintes.ts`). Sur `criteria` IMMÉDIAT et non
  // `criteriaDiffere` : c'est un signalement d'erreur de frappe, il doit disparaître dès que le praticien
  // corrige — un message qui reste affiché une seconde après la correction se lit comme un refus.
  // `criteresRenseignes` fait office de `renseignes` : une contrainte dont un opérande n'est pas encore
  // saisi n'est jamais « violée » (cf. `contraintesViolees`), sans quoi elle s'allumerait sur un
  // formulaire vierge.
  const violations = useMemo(
    () => (node ? contraintesViolees(node, criteria, criteresRenseignes) : []),
    [node, criteria, criteresRenseignes],
  )

  // Décisifs encore non confirmés → tant qu'il en reste, la reco est « provisoire » (jamais bloquée).
  // Réclamé et estompé dérivent tous deux de `pertinents` (cf. `decisifsAConfirmer`) : un champ ne peut
  // plus être simultanément « sans effet » et exigé. Calculé sur la MÊME source différée que `pertinents`
  // (`criteriaDiffere`, pas `criteria`) : sinon la visibilité (immédiate) et la pertinence (temporisée)
  // pourraient transitoirement se contredire (ex. un champ tout juste démasqué mais pas encore réévalué).
  const decisifsManquants = useMemo(
    () => decisifsAConfirmer(node?.criteres_entree ?? [], criteriaDiffere, criteresRenseignes, pertinents),
    [node, criteriaDiffere, criteresRenseignes, pertinents],
  )

  // P6/SB1 — DEUX COLONNES (formulaire à gauche, résultats sticky à droite sur écran large, empilés en
  // dessous de 960px). `isNarrow` PILOTE UNIQUEMENT LA MISE EN PAGE (bouton flottant, cf. plus bas) —
  // aucune des règles D30/D31/D32/D25/T-024 ne lit cet état : elles restent décidées par `vue`/
  // `violations` seuls, inchangés par cette session. `matchMedia` plutôt qu'un listener `resize` brut
  // (repris de la maquette `design/maquettes/Maquette upgrade UI.zip`, script du nœud `prescription`) :
  // ne redéclenche un rendu qu'au franchissement du seuil, pas à chaque pixel redimensionné.
  // `typeof window.matchMedia === 'function'` (pas seulement `typeof window !== 'undefined'`) : jsdom
  // (tests d'interaction, `DecisionNodeScreen.interaction.test.tsx`) fournit un objet `window` mais
  // n'implémente pas `matchMedia` — sans cette garde, CHAQUE test qui monte l'écran plantait au premier
  // rendu (`TypeError: window.matchMedia is not a function`), bien avant la moindre assertion sur
  // D30/D31/D32/D25/T-024. Repli à `false` (écran large) : c'est le comportement historique, celui que
  // ces tests vérifiaient déjà avant cette session.
  const supportsMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  const [isNarrow, setIsNarrow] = useState(() =>
    supportsMatchMedia ? window.matchMedia('(max-width: 959px)').matches : false,
  )
  useEffect(() => {
    if (!supportsMatchMedia) return
    const mql = window.matchMedia('(max-width: 959px)')
    const onChange = (event: MediaQueryListEvent) => setIsNarrow(event.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [supportsMatchMedia])
  // Cible du bouton flottant mobile (« Voir les recommandations (N) ↓ ») : le DÉBUT de la colonne
  // résultats, pas un élément particulier à l'intérieur — qu'elle contienne des cartes, le bloc de
  // suspension D31 ou le registre « en attente », le point d'arrivée est toujours le même.
  const resultatsColRef = useRef<HTMLDivElement>(null)
  const scrollVersResultats = () => {
    resultatsColRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  // N du bouton flottant : nombre d'options RÉELLEMENT rendues comme cartes dans la colonne droite à cet
  // instant — `vue.familles` aplati (`familles[].groupes[]` est `OptionVue[][]`, cf. `lib/vueDecision.ts`
  // `FamilleVue`), PAS une estimation. Zéro dès qu'une contrainte suspend le panneau (D31) : dans cet
  // état, `vue.familles` n'est de toute façon jamais consulté par le rendu (Étape 2 ci-dessous). T-057 :
  // ZÉRO aussi pendant la frontière de re-entrée — même principe, aucune carte n'est réellement rendue.
  const optionsRenduesCount = useMemo(() => {
    if (violations.length > 0 || afficherChoixReprise || !vue) return 0
    return vue.familles.reduce(
      (total, famille) => total + famille.groupes.reduce((sousTotal, groupe) => sousTotal + groupe.length, 0),
      0,
    )
  }, [violations, afficherChoixReprise, vue])

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
    //
    // T-061 (P8 · S2, 2026-07-30) — LE DÉFAUT CORRIGÉ ICI : la valeur suggérée était bien écrite dans
    // `next.esperance_vie` ci-dessous, mais jamais ajoutée ni à `touched` ni à `preremplis` — donc
    // invisible au formulaire (`CriteriaForm` n'allume `aria-pressed`/`data-on` que sur
    // `criteresRenseignes.has(nom)`, cf. plus bas) ET ignorée du moteur (`criteresRenseignes` ne la
    // contenait pas non plus). Mesuré en recette sur trois patients, dont le cas d'école que la ligne
    // nomme elle-même (88 ans, fragilité ET comorbidité grave cochées) : « elle n'a jamais rien
    // proposé ».
    //
    // LE CORRECTIF N'AJOUTE PAS `esperance_vie` À `touched` : ce serait faire passer une valeur
    // CALCULÉE pour une réponse du PRATICIEN, exactement ce que D20 interdit (« une valeur par défaut
    // n'est pas une réponse ») — le coût déjà payé pour cette confusion est documenté dans
    // `CriteriaForm.tsx` autour d'`aria-pressed`/`estAConfirmer`. Le véhicule correct est celui déjà
    // éprouvé par le CONTENU pour `preremplissage` (K6, `lib/formLayout.ts` `appliquerPreremplissage`) :
    // afficher la valeur, dire d'où elle vient (`preremplis` → « · calculé, à vérifier »,
    // `CriteriaForm.tsx` `renderOrigine`), la compter comme renseignée (`criteresRenseignes` = `touched`
    // ∪ `preremplis`, cf. plus bas) et la laisser modifiable — MÊME statut, MÊME mention, MÊMES règles de
    // retrait qu'un pré-remplissage de contenu (ex. la position vs objectif). `nomsAPreremplirEsp` est
    // fusionné avec `nouveaux` (pré-remplissage de CONTENU) plus bas : une seule écriture de
    // `preremplis` par appel, pas deux mentions distinctes pour une même case.
    //
    // La mention affichée en dessous du champ (`hints`, plus bas dans le JSX) reste « à valider » —
    // inchangée par ce correctif : c'est une aide au remplissage non sourcée (docstring
    // `esperanceVieDefault.ts` : « pas un fait clinique », CLAUDE.md invariant 6), jamais une
    // affirmation.
    const espChoisieAMain = touched.has('esperance_vie') || nom === 'esperance_vie'
    const dependClicheEsp = (ESPERANCE_VIE_DRIVERS as readonly string[]).includes(nom)
    const nomsAPreremplirEsp: string[] = []
    if (!espChoisieAMain && dependClicheEsp && hasEsperanceVieCritere(node.criteres_entree)) {
      next.esperance_vie = suggestEsperanceVie(next)
      nomsAPreremplirEsp.push('esperance_vie')
    }

    // `renseignes` APRÈS ce changement (D20) : `nom` vient d'être répondu — calculé AVANT
    // `reinitialiserChampsMasques` pour que la visibilité en cascade voie déjà ce champ comme déterminé
    // (repli « visible » de `champEstVisible` sur un `visible_si` autrement indéterminé, sinon
    // inutilement pessimiste pour le champ qu'on vient tout juste de saisir).
    const renseignesApres = new Set(touched).add(nom)

    // Un champ que ce changement vient de MASQUER (`visible_si`) est remis à sa valeur par défaut : une
    // valeur invisible ne doit jamais continuer à piloter la reco (cf. `formLayout.ts`). Il redevient
    // aussi « non renseigné », sinon il passerait pour confirmé s'il réapparaissait plus tard.
    const { criteria: nettoye, reinitialises } = reinitialiserChampsMasques(node.criteres_entree, next, renseignesApres)
    const touchedApres = new Set(touched).add(nom)
    for (const efface of reinitialises) touchedApres.delete(efface)

    // K6 — le pré-remplissage se REJOUE à chaque saisie, tant que le champ visé n'a pas été répondu :
    // saisir l'HbA1c après avoir saisi la cible doit proposer la position, pas attendre un remontage.
    // `appliquerPreremplissage` ne touche jamais un champ déjà renseigné : la position DÉCLARÉE fait foi
    // dès que le praticien l'a donnée.
    const { criteria: avecPrerempli, preremplis: nouveaux } = appliquerPreremplissage(
      node.criteres_entree,
      nettoye,
      touchedApres,
    )
    setCriteria(avecPrerempli)
    setTouched(touchedApres)
    // T-061 : fusion des DEUX sources de pré-remplissage — celui du CONTENU (`nouveaux`, ci-dessus) et
    // la suggestion d'ÉCRAN (`nomsAPreremplirEsp`, calculée en tête de fonction) — dans un seul appel :
    // `preremplis` ne distingue pas leur origine, seule la mention affichée le fait déjà (identique pour
    // les deux, « · calculé, à vérifier »).
    const aPreremplir = [...nouveaux, ...nomsAPreremplirEsp]
    if (aPreremplir.length > 0) {
      setPreremplis((previous) => new Set([...previous, ...aPreremplir]))
    }
    // Le champ que le praticien vient de saisir cesse d'être « pré-rempli ».
    if (preremplis.has(nom)) {
      setPreremplis((previous) => {
        const suivant = new Set(previous)
        suivant.delete(nom)
        return suivant
      })
    }
    // K6 : la mention « repris » cesse dès que le praticien touche au champ — elle deviendrait fausse.
    if (repris.has(nom)) {
      setRepris((previous) => {
        const suivant = new Set(previous)
        suivant.delete(nom)
        return suivant
      })
    }
    // K6 : mémoriser APRÈS coup, sur l'état déjà nettoyé — un champ que ce changement vient de masquer
    // ne doit pas partir en session avec la valeur qu'il avait juste avant d'être remis à zéro.
    memoriserCriteres(node.criteres_entree, avecPrerempli, touchedApres)
  }

  /**
   * Champ `nombre` VIDÉ par le praticien (D20 R7, `CriteriaForm.tsx` `onEffacer` — défauts de recette
   * 12.2/13.3) : DISTINCT de `handleCriteriaChange` — sinon `Number('') = 0` ET `touched` marqué font
   * enregistrer un « 0 » comme une réponse confirmée (« 0 facteur de risque »), alors que le champ vient
   * précisément d'être vidé. `nom` RESSORT de `touched` (donc de `renseignes` transmis au moteur, cf.
   * `vue`/`pertinents` ci-dessus) : il redevient « jamais renseigné », jamais « réponse zéro ». La valeur
   * stockée retombe sur son défaut générique (`valeurParDefaut`, `lib/formLayout.ts`, même définition que
   * l'initialisation du formulaire et que la remise à zéro d'un champ masqué) — cohérence, même si sans
   * effet sur l'évaluation moteur tant que `nom` n'est plus dans `renseignes`.
   */
  const handleCriteriaEffacer = (nom: string) => {
    const critere = node.criteres_entree.find((c) => c.nom === nom)
    const next = critere ? { ...criteria, [nom]: valeurParDefaut(critere) } : criteria

    const renseignesApres = new Set(touched)
    renseignesApres.delete(nom)

    const { criteria: nettoye, reinitialises } = reinitialiserChampsMasques(node.criteres_entree, next, renseignesApres)
    setCriteria(nettoye)
    setTouched((previous) => {
      const suivant = new Set(previous)
      suivant.delete(nom)
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

    // T-061 (Étape 5) — « Rien à signaler » ne passe PAS par `handleCriteriaChange` : sans ce relais, la
    // suggestion d'`esperance_vie` restait muette quand `fragilite`/`comorbidite_grave`/`antecedent_cv`
    // étaient soldés par ce bouton plutôt que cliqués un par un — pourtant LE geste réel du praticien
    // mesuré en recette (N2, N7). Même garde-fou qu'à la saisie directe (`espChoisieAMain` ci-dessus) :
    // ne recalcule rien si le praticien a déjà choisi lui-même `esperance_vie`. Les drapeaux confirmés
    // restent à leur valeur INCHANGÉE (`false`, la présomption de contenu) — seul `touched` bouge — donc
    // `suggestEsperanceVie` se relit sur `criteria` tel quel, sans fusion supplémentaire.
    const espChoisieAMain = touched.has('esperance_vie')
    const declencheSuggestionEsp = noms.some((nom) => (ESPERANCE_VIE_DRIVERS as readonly string[]).includes(nom))
    if (!espChoisieAMain && declencheSuggestionEsp && hasEsperanceVieCritere(node.criteres_entree)) {
      const suggestion = suggestEsperanceVie(criteria)
      if (criteria.esperance_vie !== suggestion) {
        setCriteria((previous) => ({ ...previous, esperance_vie: suggestion }))
      }
      setPreremplis((previous) => new Set(previous).add('esperance_vie'))
    }
  }

  /**
   * T-057 (P8 · S2) — « Repartir de zéro » : lève la frontière de re-entrée EN VIDANT ce qui l'a
   * déclenchée, plutôt qu'en se contentant de la masquer. Deux effets, EXACTEMENT comme « Nouveau
   * patient » (T-026/D33) :
   *  - la MÉMOIRE DE SESSION est purgée par `reinitialiserSession()` — LA MÊME fonction que le bouton du
   *    header, réutilisée telle quelle (S2.md T-057 "Étapes" 4 : « n'invente pas un second chemin de
   *    purge ») ;
   *  - le FORMULAIRE DE CE NŒUD revient à son état vierge. Le remontage par `key` que le bouton du header
   *    obtient via `App.tsx` (`resetEpoch`) n'est PAS accessible depuis cet écran (`DecisionNodeScreen` ne
   *    reçoit que `nodeId`/`go`, jamais `resetEpoch`/`setResetEpoch` — header hors périmètre de cette
   *    session, cf. "Hors périmètre") : un remontage RÉEL exigerait de faire remonter cet état jusqu'à
   *    `App.tsx`, une décision d'architecture, pas une correction d'écran. Vider directement l'état LOCAL
   *    (`criteria`/`touched`/`repris`/`preremplis`) obtient le même résultat VISIBLE pour ce nœud sans
   *    inventer un second mécanisme de purge de la SESSION (qui, lui, reste unique) — seule la manière
   *    d'obtenir un formulaire vierge diffère, pas ce qui est vidé.
   */
  const handleRepartirDeZero = () => {
    reinitialiserSession()
    setCriteria(buildDefaultCriteria(node.criteres_entree))
    setTouched(new Set())
    setRepris(new Set())
    setPreremplis(new Set())
    setFrontiereLevee(false)
  }

  // Aucun nœud « à venir » n'existe réellement en contenu (P1 ne livre que cible-glycemique) : la
  // notion de nœud non détaillé du prototype (`detailed: false`, données figées) n'a pas
  // d'équivalent en contenu réel. Repli défensif générique (pas de connaissance d'id de nœud
  // particulier, DECISIONS.md D8) : un nœud sans critère ni option exploitable retombe sur le bloc
  // placeholder du prototype plutôt que de planter (le schéma impose `options.length >= 1`, ce cas
  // ne devrait donc jamais se produire avec un contenu valide — robustesse, pas un chemin attendu).
  const isPlaceholder = node.criteres_entree.length === 0 || node.options.length === 0

  // Fusion des 3 alertes qui se recoupaient sur un formulaire vide/incomplet (remontée UI, 2026-07-29) :
  // « Reco provisoire », « Aucune option n'est proposée » et le bloc « En attente » disaient la même
  // chose trois fois (aucune carte à montrer, faute de critères) et occupaient à eux seuls tout l'écran
  // de résultats. Quand c'est le SEUL contenu possible (zéro carte, au moins une option en attente), on
  // ne garde que le bloc « en attente » (D20 R7, ci-dessous) — le plus précis des trois, il nomme déjà
  // l'option et les critères qui lui manquent. Sans effet sur l'état mixte (des cartes ET des options en
  // attente) : les deux messages y restent, chacun utile à sa place.
  const decisionEnAttenteSeule =
    violations.length === 0 &&
    !!vue &&
    !vue.familles.some((famille) => famille.groupes.length > 0) &&
    vue.enAttente.length > 0

  return (
    <div className="decision-node">
      {/* Retour vers le MODULE quand le nœud en fait partie (D22) : sans cela, on quitterait le module
          dès le premier nœud ouvert et le second axe ne serait plus atteignable qu'en repassant par la
          liste — alors que travailler les deux axes dans la même consultation est le cas prévu. */}
      {moduleDuNoeud ? (
        <button
          type="button"
          className="decision-node__back"
          onClick={() => go('decisionModule', { moduleId: moduleDuNoeud.id })}
        >
          ← Module : {moduleDuNoeud.titre}
        </button>
      ) : (
        <button type="button" className="decision-node__back" onClick={() => go('decisionDomains')}>
          ← Domaine : {labelForDomaine(node.domaine)}
        </button>
      )}
      <h1 className="decision-node__title">{node.titre}</h1>
      <PopulationCible texte={node.population_cible} />

      {/* Cadrage (D24) : positions de lecture du nœud, vraies pour tous ses patients. Rendu AVANT le
          formulaire — donc avant toute saisie — parce qu'elles conditionnent la lecture des options,
          alors que les alertes (`AlertList`, sous le formulaire) dépendent de ce qui vient d'être saisi.
          Cette séparation dans la page est la contrepartie visible de la séparation des deux canaux. */}
      {node.cadrage && <CadrageList cadrage={node.cadrage} />}

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
          {/* P6/SB1 — DEUX COLONNES génériques (formulaire à gauche, résultats sticky à droite ≥ 960px ;
              empilées en dessous, cf. CSS). Le moteur produit `familles`/`groupes` de façon identique
              pour les 6 nœuds DT2 : une seule disposition, pas une redisposition par nœud. AUCUNE des
              conditions ci-dessous n'a été réordonnée ni dupliquée par rapport au flux vertical précédent
              — seul leur conteneur DOM change (T-036 "Hors périmètre" : ne pas toucher au comportement). */}
          <div className="decision-node__body">
            <div className="decision-node__form-col">
              <CriteriaForm
                criteresEntree={node.criteres_entree}
                criteria={criteria}
                criteriaGroupement={criteriaDiffere}
                // T-023/D-06 (P4/S3) : `criteresRenseignes` (`touched` ∪ `preremplis`), pas `touched` seul —
                // sinon un segment pré-rempli par le contenu (K6) reste affiché `aria-pressed="false"` alors
                // que sa valeur a bien été posée (cf. la fusion ci-dessus, docstring complète sur `vue`).
                touched={criteresRenseignes}
                pertinents={pertinents}
                aConfirmer={new Set(decisifsManquants)}
                repris={repris}
                preremplis={preremplis}
                hints={
                  hasEsperanceVieCritere(node.criteres_entree) && !touched.has('esperance_vie')
                    ? { esperance_vie: 'Suggestion auto (âge, fragilité, comorbidité grave, antécédent CV) — à valider' }
                    : undefined
                }
                onConfirmerChamps={handleConfirmerChamps}
                onEffacer={handleCriteriaEffacer}
                // T-022 (D31) : `contraintesViolees` n'est PLUS transmis ici — le bandeau que `CriteriaForm`
                // en tirait s'affichait en tête de formulaire, 848 px au-dessus du champ fautif (D-15), ET en
                // double avec le bloc de suspension ci-dessous (« un bloc unique », Étape 1). Une contrainte
                // violée est désormais rendue UNE SEULE fois, à la place du panneau de résultats.
                onChange={handleCriteriaChange}
              />
            </div>

            <div className="decision-node__results-col" ref={resultatsColRef}>
          {/* Alertes de NŒUD (D15, faits de sécurité) : restent visibles MÊME quand une contrainte de
              saisie suspend le reste du panneau juste en dessous (T-022 "Si bloqué" : suspendre les
              résultats ne doit jamais faire disparaître un fait de sécurité qui aurait dû rester — un
              canal différent, cf. `docs/decision/GRAMMAIRE-NOEUD.md` R4/D15). */}
          {vue && <AlertList alertes={vue.alertes} />}

          {violations.length > 0 ? (
            // T-022 (D31, 2026-07-28) — UNE CONTRAINTE VIOLÉE SUSPEND TOUT LE RESTE DU PANNEAU DE
            // RÉSULTATS : ni cartes applicables, ni options écartées, ni bloc « en attente », ni
            // argumentaire (Étape 4, "rien d'autre que le message"). Recette du 2026-07-28 : sur
            // `insuline`, TBR = 1 / TBR sévère = 95 (saisie que le nœud vient de déclarer impossible)
            // laissait pourtant subsister trois cartes « Recommandée » contradictoires (D-04) — la
            // contrainte n'était qu'un canal d'affichage parallèle, jamais opposable au rendu. Elle
            // l'est désormais : ce bloc REMPLACE tout le panneau ci-dessous tant qu'une contrainte reste
            // violée.
            <div className="decision-node__contrainte-suspension" role="alert">
              <div className="decision-node__contrainte-suspension-titre">
                Saisie à corriger avant de poursuivre
              </div>
              {violations.map((contrainte) => {
                // Étape 2 : nommer les champs en cause ET permettre d'y aller. AUCUN champ de
                // `CriteriaForm` ne porte aujourd'hui d'`id` HTML (vérifié, `components/CriteriaForm.tsx`)
                // — construire une ancre cliquable aurait donc exigé un mécanisme de navigation neuf (y
                // ajouter des `id`, gérer le défilement), explicitement hors périmètre de cette tâche
                // (« ne construis pas un mécanisme de navigation »). Repli explicite, tel que prévu par la
                // tâche : le nom du champ en clair, jamais un identifiant technique (I20).
                const champs = champsEnCause(contrainte.expression, node.criteres_entree)
                return (
                  <div key={contrainte.expression} className="decision-node__contrainte-suspension-item">
                    <p className="decision-node__contrainte-suspension-message">{contrainte.message}</p>
                    {champs.length > 0 && (
                      <p className="decision-node__contrainte-suspension-champs">
                        Champ{champs.length > 1 ? 's' : ''} concerné{champs.length > 1 ? 's' : ''} :{' '}
                        {champs.map(labelForCritere).join(', ')}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : afficherChoixReprise ? (
            // T-057 (P8 · S2, 2026-07-30) — FRONTIÈRE DE RE-ENTRÉE (D28, cf. le calcul de
            // `frontiereReprise`/`afficherChoixReprise` en tête de composant pour la condition exacte et
            // sa justification). MÊME PARTI PRIS que la suspension D31 juste au-dessus : ce bloc REMPLACE
            // tout le panneau (ni cartes, ni écartées, ni en attente, ni argumentaire) — c'est le REGARD
            // PORTÉ SUR LE RÉSULTAT qu'il faut intercepter, pas le formulaire (qui continue d'afficher
            // « repris de votre saisie », inchangé). Les alertes de nœud et le cadrage restent visibles
            // (rendus hors de ce bloc, ci-dessus/en tête de page) : une information de sécurité ne se
            // cache jamais, comme pendant une suspension D31.
            <div className="decision-node__reprise-frontiere">
              <div className="decision-node__reprise-frontiere-titre">Ce nœud a déjà été ouvert dans cette consultation</div>
              <p className="decision-node__reprise-frontiere-texte">
                Les critères déjà renseignés proviennent de votre saisie sur un autre écran de cette
                consultation (« repris de votre saisie », dans le formulaire) ; rien n'a encore été saisi
                ici. Avant d'afficher une recommandation, confirmez qu'il s'agit bien du même patient.
              </p>
              <div className="decision-node__reprise-frontiere-actions">
                <button
                  type="button"
                  className="decision-node__reprise-frontiere-bouton"
                  onClick={() => setFrontiereLevee(true)}
                >
                  Reprendre les valeurs de ce patient
                </button>
                <button
                  type="button"
                  className="decision-node__reprise-frontiere-bouton decision-node__reprise-frontiere-bouton--secondaire"
                  onClick={handleRepartirDeZero}
                >
                  Repartir de zéro
                </button>
              </div>
            </div>
          ) : (
            <>
          {!decisionEnAttenteSeule && (
          <div className="decision-node__section-title">
            {decisifsManquants.length > 0 ? 'Options applicables — provisoire' : 'Options applicables'}
          </div>
          )}
          {!decisionEnAttenteSeule && decisifsManquants.length > 0 && (
            <p className="decision-node__provisional">
              <strong>Reco provisoire</strong> — {decisifsManquants.length} critère
              {decisifsManquants.length > 1 ? 's décisifs non confirmés' : ' décisif non confirmé'} dans le
              formulaire ci-dessus : les mesures chiffrées y sont marquées « à confirmer », les drapeaux se
              confirment d'un clic par « Rien à signaler ». La recommandation peut encore changer.
            </p>
          )}
          {decisionEnAttenteSeule ? null : vue && vue.familles.some((famille) => famille.groupes.length > 0) ? (
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
              // Extrait en fonction le 2026-07-27 (repli d'affichage) : le même rendu sert maintenant DEUX
              // fois — les pistes du meilleur rang, puis celles repliées derrière le bouton. Le corps est
              // rigoureusement inchangé ; seule la source des familles devient un paramètre.
              const rendreFamilles = (familles: FamilleVue[]) => familles.map((famille, indexFamille) => {
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
                      calculsEnAttente={optionVue.calculsEnAttente}
                      motifRang={optionVue.motifRang}
                      alertes={optionVue.alertes}
                    />
                  ))
                  if (groupe.length < 2) return cartes
                  return (
                    <div className="decision-node__egalite" key={`egalite-${cle}`}>
                      {/* Mention NEUTRE (correctif « priorité multi-natures ») : elle affirmait avant
                          « aucune de ces options n'est préférable à l'autre », faux pour des gestes
                          cumulables. La nuance « en choisir un » / « cumulables » est désormais portée
                          par le TITRE DE FAMILLE (mention générique dérivée de `exclusive`, ci-dessous),
                          jamais par cet encadré générique.

                          T-024 (P4/S3, 2026-07-28) : « À ÉGALITÉ — MÊME NIVEAU DE PRIORITÉ. » ne portait
                          aucun contenu de départage (recette du 2026-07-28, rencontré trois fois) — le
                          praticien prenait la première carte de la liste, un ordre qui n'a pourtant aucune
                          signification clinique à ce rang. Reformulée pour dire explicitement les trois
                          choses que l'arbitrage retient : équivalentes sur les données disponibles, l'outil
                          ne les départage pas, le choix revient au praticien — SANS rédiger de phrase de
                          départage clinique (hors périmètre, ce serait du contenu à valider par le
                          référent) ni afficher les conditions divergentes (ramènerait le DSL à l'écran,
                          famille 8). Effet d'ordre déjà neutralisé par la mise en page (vérifié, pas
                          supposé) : `.decision-node__egalite-grid` rend les cartes CÔTE À CÔTE (CSS grid,
                          `auto-fit`), et `OptionCard.tsx` ne porte aucun numéro ni rang affiché — rien ne
                          distingue la 1re carte des suivantes au-delà de l'ordre du DOM. */}
                      <p className="decision-node__egalite-mention">
                        Options équivalentes sur les données disponibles : l'outil ne les départage pas, le
                        choix revient au praticien.
                      </p>
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
              // PLAFOND D'AFFICHAGE — K5, décision référent : 5 pistes au maximum. RÉACTIVÉ le 2026-07-27
              // après avoir été neutralisé le matin même, où il avait caché une carte d'insuline
              // d'initiation chez un patient en état catabolique. Ce qui a changé n'est pas le réglage
              // mais le SIGNAL : `lib/replierAffichage.ts` ne replie plus « ce qui n'est pas au meilleur
              // rang » (le rang 0 du socle faisait alors de tout le reste un surplus) — il ne replie que
              // ce que le contenu DÉCLARE repliable (`Option.role`, A3), et jamais une carte portant une
              // contre-indication ou une alerte active. La question laissée ouverte ce soir-là — « quel
              // signal du contenu dit qu'une carte ne peut pas être repliée ? » — a reçu sa réponse.
              // Rien n'est retiré : `principales ∪ repliees` est exactement `vue.familles`, et le bouton
              // porte le compte exact de ce qu'il cache.
              const { principales, repliees, nbRepliees } = plafonnerPistes(vue)
              if (nbRepliees === 0) return rendreFamilles(vue.familles)
              return (
                <>
                  {rendreFamilles(principales)}
                  <details className="decision-node__repli">
                    <summary className="decision-node__repli-resume">
                      Autres pistes possibles ({nbRepliees})
                    </summary>
                    <p className="decision-node__repli-mention">
                      {nbRepliees === 1 ? 'Cette' : 'Ces'} {nbRepliees} {nbRepliees === 1 ? 'piste' : 'pistes'} s'applique{nbRepliees === 1 ? '' : 'nt'} à ce patient : {nbRepliees === 1 ? 'elle' : 'elles'} ne {nbRepliees === 1 ? 'n\'est' : 'sont'} pas écartée{nbRepliees === 1 ? '' : 's'}. Une
                      consultation ne permet d'en négocier que deux ou trois, l'écran en déplie donc au
                      plus {PLAFOND_PISTES} — {nbRepliees === 1 ? 'celle' : 'celles'} qui répond{nbRepliees === 1 ? '' : 'ent'} au plus grand nombre des éléments que
                      vous avez déclarés (les motifs listés sous chaque carte, « proposé parce que »). Les
                      gestes de sécurité et le socle ne sont jamais repliés.
                    </p>
                    {rendreFamilles(repliees)}
                  </details>
                </>
              )
            })()
          ) : (
            // T-023 Étape 2 : `applicable` ET `enAttente` sont TOUS DEUX vides — le nœud n'a rien à
            // proposer dans son périmètre pour ce patient. Ne fabrique aucun conseil clinique : dit
            // seulement que l'outil n'a rien, et renvoie au cadrage (positions de lecture du nœud,
            // `CadrageList` en tête de page) quand le nœud en déclare un.
            <p className="decision-node__empty">
              Cet algorithme n'a aucune conduite à proposer pour ce patient, avec les critères renseignés.
              {node.cadrage ? ' Son périmètre est décrit dans le cadrage en tête de page.' : ''}
            </p>
          )}

          {/* D20 R7 (SPEC-valeur-indeterminee.md §2.5, quatrième registre distinct des trois ci-dessous) —
              EN ATTENTE : ni proposée ni écartée, un ou plusieurs critères manquent pour trancher. Poussé
              comme `ecartees` (jamais replié) : c'est une QUESTION posée au praticien, pas une erreur — sur
              formulaire vierge, c'est ce bloc qui prend le relais du panneau de résultats vide (ci-dessus),
              plutôt qu'un « Aucune option ne correspond » qui affirmerait à tort une conclusion négative. */}
          {vue && vue.enAttente.length > 0 && (
            <div className="decision-node__en-attente">
              <div className="decision-node__en-attente-titre">
                En attente — critère{vue.enAttente.length > 1 ? 's' : ''} à renseigner pour trancher
              </div>
              {(() => {
                // T-060 (P8 · S2, 2026-07-30) — le titre ci-dessus s'affichait SEUL, « rien dessous »
                // (constaté 4 fois en recette, N1/N2/N7/N13b — « un encadré coloré vide se lit comme un
                // bug »). La donnée était pourtant déjà là et EXACTE (pas une heuristique) :
                // `vue.enAttente[].manquants` vient du registre `enAttente` d'`evaluateNode`, désigné
                // comme source de vérité par `engine/relevance.ts` (« cite TOUJOURS tous les critères
                // manquants d'une option, y compris en conjonction »). `manquants` ne contient QUE des
                // primitifs de `criteres_entree` (jamais un dérivé — `engine/evaluateNode.ts`
                // `primitivesReferencees` les déroule toujours vers leurs primitifs), donc CHACUN est
                // couvert par l'invariant I20 (`engine/banc/libelles.test.ts`, qui exige un libellé
                // rédigé pour TOUT `criteres_entree` d'un nœud publié) : `labelForCritere` ne peut pas
                // laisser sortir un identifiant brut ici pour un nœud publié — un `manquants` sans
                // libellé serait une violation d'I20 en amont, pas un défaut d'affichage à intercepter.
                //
                // DEUX FORMES POSSIBLES (Étape 2 de la tâche), UNE SEULE RETENUE PAR RENDU — jamais les
                // deux en même temps. En dessous d'un petit nombre de critères DISTINCTS (≤ 3, seuil
                // choisi parce que c'est le cas dominant en recette : une ou deux questions qui reviennent
                // sur plusieurs options), une phrase unique dédoublonnée est plus lisible qu'une liste
                // option par option qui répéterait le même nom de critère sous plusieurs intitulés — du
                // bruit, pas l'information cherchée (cf. N13b : « il manque : les traitements en cours »,
                // une phrase, pas un tableau). Au-delà, la liste par option (même registre que le bloc
                // « écartées » juste en dessous, jugé « excellent » par le rapport) redevient nécessaire :
                // des options différentes peuvent réclamer des critères différents, et les fondre en une
                // seule phrase perdrait cette distinction.
                const distincts: string[] = []
                const vus = new Set<string>()
                for (const enAttente of vue.enAttente) {
                  for (const nom of enAttente.manquants) {
                    if (vus.has(nom)) continue
                    vus.add(nom)
                    distincts.push(nom)
                  }
                }
                if (distincts.length <= 3) {
                  return (
                    <p className="decision-node__en-attente-item">
                      À renseigner pour trancher : {distincts.map(labelForCritere).join(', ')}.
                    </p>
                  )
                }
                return vue.enAttente.map((enAttente, index) => (
                  <p key={`${index}-${enAttente.option.intitule}`} className="decision-node__en-attente-item">
                    {enAttente.option.intitule} — à renseigner : {enAttente.manquants.map(labelForCritere).join(', ')}
                  </p>
                ))
              })()}
            </div>
          )}

          {/* R4 — ÉCARTÉES (sécurité) : l'option était indiquée, une exclusion l'a retirée. Toujours
              visible, discrètement, sous le panneau de résultats — jamais en silence (D13/R4). */}
          {vue && vue.ecartees.length > 0 && (
            <div className="decision-node__ecartees">
              {vue.ecartees.map((ecartee, index) => (
                <p key={`${index}-${ecartee.option.intitule}`} className="decision-node__ecartee">
                  {ecartee.option.intitule} écarté : {describeReasons(ecartee.motifs)}
                </p>
              ))}
            </div>
          )}

          {/* R4 — NON RETENUES (explication) : l'option n'était pas indiquée pour ce patient. Consultée
              sur demande seulement — sur un nœud à 22 options, la pousser rendrait l'écran illisible. */}
          {vue && vue.nonRetenues.length > 0 && (
            <div className="decision-node__non-retenues">
              <button
                type="button"
                className="decision-node__non-retenues-toggle"
                aria-expanded={nonRetenuesOpen}
                onClick={() => setNonRetenuesOpen((open) => !open)}
              >
                {nonRetenuesOpen ? 'Masquer les autres options' : 'Pourquoi pas d’autres options ?'}
              </button>
              {nonRetenuesOpen && (
                <div className="decision-node__non-retenues-liste">
                  {vue.nonRetenues.map((nonRetenue, index) => (
                    <p key={`${index}-${nonRetenue.option.intitule}`} className="decision-node__non-retenue">
                      {nonRetenue.option.intitule} : {describeReasons([nonRetenue.condition])}
                    </p>
                  ))}
                </div>
              )}
            </div>
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
            </div>
          </div>

          {/* Bouton flottant mobile (< 960px) — masqué ≥ 960px, où la colonne résultats est `sticky`
              (toujours dans le viewport pendant la saisie, cf. CSS) : y dupliquer ce raccourci n'aurait
              aucun usage. Compte `optionsRenduesCount` dérivé de `vue.familles` aplati (défini plus haut),
              jamais une valeur inventée — 0 pendant une suspension D31, comme le panneau qu'il cible. */}
          {isNarrow && (
            <button
              type="button"
              className="decision-node__floating-recos"
              onClick={scrollVersResultats}
            >
              Voir les recommandations ({optionsRenduesCount}) ↓
            </button>
          )}
        </>
      )}

      <div className="decision-node__footer">
        Révisé le {formatDateRevue(node.meta.date_revue)} · Aide à la décision fondée sur l'EBM — le
        praticien reste le lien avec le patient et le seul responsable de la décision.
      </div>
    </div>
  )
}
