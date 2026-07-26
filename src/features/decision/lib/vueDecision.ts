/**
 * Modèle de vue UNIQUE de l'écran de décision (`docs/decision/GRAMMAIRE-NOEUD.md`, § « Prérequis
 * d'architecture » cité par R2/R4/R6) : `construireVueDecision` calcule TOUT ce que
 * `DecisionNodeScreen.tsx` a besoin de rendre pour un nœud et un jeu de critères donnés, et rien
 * d'autre. L'écran ne fait plus AUCUN calcul — il consomme `VueDecision` telle quelle.
 *
 * Ne réimplémente aucune logique : compose les briques existantes, chacune restant testable seule.
 * - `evaluateNode` (sélection/tri/alertes), `engine/evaluateNode.ts` ;
 * - `groupesParFamille` (sections + groupes d'égalité), `engine/evaluateNode.ts` ;
 * - `computeBadges` (badge par option), `lib/optionBadges.ts` ;
 * - le calcul des doses (`Option.calculs`), DÉPLACÉ ici depuis `components/OptionCard.tsx` (qui
 *   l'évaluait lui-même avant ce refactor).
 *
 * Pourquoi ce fichier existe : `engine/relevance.ts` calcule quels critères sont « décisifs » en
 * comparant une SIGNATURE de ce qui est affiché avant/après perturbation d'un critère. Cette
 * signature reconstruisait auparavant l'écran À LA MAIN, en chaîne, dans `relevance.ts` — chaque
 * dimension ajoutée à l'écran (groupes d'égalité, familles, badges, alertes) devait être répercutée
 * manuellement dans cette reconstruction, et l'oubli s'est produit quatre fois. Avec ce fichier,
 * `signatureVue` sérialise directement le même objet `VueDecision` que l'écran rend : tout ce qui
 * est affiché est dans la signature PAR CONSTRUCTION, plus par discipline.
 *
 * R4 (`docs/decision/GRAMMAIRE-NOEUD.md`) : `ecartees` (options retirées par une `exclusion` —
 * information de SÉCURITÉ, toujours affichée) et `nonRetenues` (options qui ont échoué sur une
 * `condition` — information d'EXPLICATION, consultée sur demande) entrent désormais dans
 * `VueDecision` ET dans `signatureVue`. C'est ce qui garantit qu'un critère qui ne change QUE l'une de
 * ces deux listes reste détecté comme DÉCISIF par `engine/relevance.ts` — sinon il serait estompé à
 * tort comme « sans effet », le défaut récurrent que ce fichier existe pour empêcher (cf. R6, même
 * document).
 *
 * R6 (même document, § « l'argumentaire est situationnel ») : `OptionVue.reasons` n'est plus la liste
 * littérale de `Option.conditions` (`EvaluateNodeResult.reasons`) mais les termes `OR` réellement vrais
 * pour CE patient (`engine/conditions.ts` `termesVrais`), calculés ICI et non dans `evaluateNode` —
 * `evaluateNode` tourne des centaines de fois par frappe via la boucle de perturbation, une
 * justification situationnelle n'a de coût que pour ce qui est rendu. `OptionVue.motifRang` (R6 couche
 * 2, « pourquoi à ce rang ») est en revanche déjà calculé par `evaluateNode` sans coût supplémentaire
 * (`EvaluateNodeResult.rangMotifs`, sous-produit de `resolvePriorite`) : ce fichier décide seulement DE
 * L'AFFICHER, réservé aux familles à au moins deux groupes d'égalité (une vraie concurrence de rang).
 * Ces deux dimensions entrent dans `signatureVue` au même titre que les autres (totalité, ci-dessus) :
 * un critère qui ne change QUE la justification ou QUE le motif de rang doit rester DÉCISIF.
 *
 * Alertes d'OPTION (addendum au schéma, même document § « Additions au schéma ») : `OptionVue.alertes`
 * ne vient PAS d'`evaluateNode`/`EvaluateNodeResult` — calculée ICI, sur `option.alertes`, avec la même
 * brique que les alertes de nœud (`evaluateAlertesDeListe`, `engine/evaluateNode.ts`), pour la même
 * raison que `reasons` : un coût par cycle de rendu, jamais par perturbation. Répond au défaut constaté
 * en recette où une alerte de NŒUD (qui ne voit que les critères) s'affichait à propos d'un traitement
 * que le moteur venait précisément d'écarter — une alerte d'OPTION, elle, n'existe que sur un `OptionVue`,
 * donc uniquement pour une option retenue par le moteur. Entre dans `signatureVue` comme les autres
 * dimensions (totalité) : un critère qui ne change QUE l'alerte d'une option doit rester DÉCISIF.
 *
 * VALEUR INDÉTERMINÉE (DECISIONS.md D20, SPEC-valeur-indeterminee.md §2) : `construireVueDecision`
 * accepte un troisième paramètre optionnel `renseignes: ReadonlySet<string>` (noms bruts fournis par le
 * praticien), transmis à `evaluateNode` (registre `enAttente`, désormais porté par `VueDecision`) et
 * utilisé ICI pour recalculer l'ensemble EFFECTIF (`engine/deriveCritere.ts` `determinesEffectifs`) —
 * consommé par `calculsAffiches`/les alertes d'option, exactement pour la même raison que `reasons`
 * ci-dessus (coût par cycle de rendu, `evaluateNode` ne le fait que pour LUI-MÊME). `enAttente` entre
 * dans `signatureVue` comme les autres dimensions (totalité) : un critère qui ne change QUE la liste des
 * options en attente doit rester DÉCISIF pour `engine/relevance.ts`.
 */
import type { Alerte, Noeud, Option } from '../content/node.types.ts'
import type { Criteria } from '../engine/conditions.ts'
import { termesVrais } from '../engine/conditions.ts'
import { calculerCriteresDerives, determinesEffectifs, evaluerNombre } from '../engine/deriveCritere.ts'
import { evaluateAlertesDeListe, evaluateNode, groupesParFamille } from '../engine/evaluateNode.ts'
import { computeBadges, type OptionBadge } from './optionBadges.ts'

/** Une dose/valeur calculée déjà évaluée, prête à l'affichage (câblage P3, `Option.calculs`). */
export interface CalculAffiche {
  libelle: string
  valeur: number
  unite: string | undefined
}

/** Une option applicable, avec tout ce que sa carte (`OptionCard.tsx`) a besoin de rendre. */
export interface OptionVue {
  option: Option
  badge: OptionBadge
  /**
   * Justification SITUATIONNELLE (R6, `docs/decision/GRAMMAIRE-NOEUD.md`) : les termes `OR` de
   * `option.conditions` réellement VRAIS pour CE patient — jamais la règle recopiée telle quelle
   * (`EvaluateNodeResult.reasons`, qui reste la liste littérale des conditions, cf. `raisonsSituationnelles`
   * ci-dessous). En général un seul motif ; plusieurs quand le patient cumule les indications (information
   * clinique, pas du bruit). Les sentinelles `["default"]`/`["toujours"]` traversent inchangées —
   * `describeReasons` (`lib/conditionText.ts`) les traite par un cas spécial.
   *
   * NE CONTIENT JAMAIS `option.prerequis` (R6, § arbitrage indication/prérequis) : un prérequis est un
   * garde-fou de cohérence (« ne prend pas déjà cette classe », « la niche n'est pas ouverte »), vrai
   * chez la quasi-totalité des patients — son énoncé n'apprend rien affiché, même s'il est aussi vrai
   * qu'une condition (l'évaluateur du moteur ne fait aucune différence entre les deux). Volontaire, pas
   * un oubli : voir `raisonsSituationnelles`, qui ne lit que `conditions`.
   */
  reasons: string[]
  /** Doses calculées déjà évaluées ; ne contient que celles calculables (cf. `evaluerNombre`). */
  calculs: CalculAffiche[]
  /**
   * Motif de rang (R6 couche 2, « pourquoi à ce rang ») : le `quand` (DSL brut, à humaniser comme
   * `reasons`) de la règle de `priorite` CONDITIONNELLE (D14) qui a fixé le rang de cette option pour ce
   * patient (`EvaluateNodeResult.rangMotifs`). `undefined` si l'option n'a pas de motif de rang (pas de
   * `priorite`, `priorite` FIXE D13, ou seul le repli `"default"` a matché) OU si sa famille ne compte
   * qu'UN SEUL groupe d'égalité — sans concurrence de rang réelle dans la famille, « pourquoi celle-ci
   * d'abord » ne veut rien dire (cf. `construireVueDecision`, qui applique cette dernière condition).
   */
  motifRang: string | undefined
  /**
   * Alertes PORTÉES PAR CETTE OPTION (`option.alertes`, `docs/decision/GRAMMAIRE-NOEUD.md` § additions
   * au schéma), déjà filtrées : seulement celles dont `quand` est vrai pour CE patient
   * (`evaluateAlertesDeListe`, `engine/evaluateNode.ts`). Calculées ICI (dans `construireVueDecision`),
   * **PAS** dans `evaluateNode`/`EvaluateNodeResult` — mêmes raisons que `reasons` ci-dessus : une alerte
   * d'option ne concerne que ce qui est RENDU, jamais l'applicabilité, et `evaluateNode` tourne des
   * centaines de fois par frappe via la boucle de perturbation.
   *
   * `OptionVue` n'existe QUE pour les options APPLICABLES (cf. `familles` dans `VueDecision`) : c'est ce
   * qui garantit, PAR CONSTRUCTION, qu'une alerte d'option ne s'affiche jamais pour un geste que le moteur
   * n'a pas retenu — le défaut constaté en recette (une alerte de nœud citant un traitement qui vient
   * d'être ÉCARTÉ) ne peut pas se reproduire ici : une option écartée ou non retenue n'a pas d'`OptionVue`
   * (elle vit dans `VueDecision.ecartees`/`nonRetenues`, qui ne portent pas d'alertes).
   */
  alertes: Alerte[]
}

/** Une section de l'écran : une famille clinique (ou le repli à plat, `libelle: undefined`). */
export interface FamilleVue {
  libelle: string | undefined
  exclusive: boolean | undefined
  /** Groupes d'égalité (`groupesExAequo`) à l'intérieur de cette famille, dans l'ordre d'affichage. */
  groupes: OptionVue[][]
}

/**
 * Une option ÉCARTÉE (R4) : elle était indiquée (ses `conditions` étaient vraies), une `exclusion` l'a
 * retirée. Information de SÉCURITÉ — toujours affichée, discrètement, avec son motif.
 */
export interface OptionEcarteeVue {
  option: Option
  /** Expressions `exclusions` déclenchées (`EvaluateNodeResult.excluded`) ; jamais vide. */
  motifs: string[]
}

/**
 * Une option NON RETENUE faute de `condition` (R4) : elle n'était pas indiquée pour ce patient.
 * Information d'EXPLICATION — consultée sur demande, jamais poussée à l'écran.
 */
export interface OptionNonRetenueVue {
  option: Option
  /** Première condition non satisfaite (`EvaluateNodeResult.nonRetenues`) — celle qui explique. */
  condition: string
}

/**
 * Une option EN ATTENTE (D20, SPEC-valeur-indeterminee.md §2.4/§2.5) : NI proposée NI écartée — l'une de
 * ses `conditions`/`prerequis`/`exclusions` reste indéterminée. `manquants` = les critères PRIMITIFS à
 * renseigner pour lever l'indétermination (`EvaluateNodeResult.enAttente`), jamais vide.
 */
export interface OptionEnAttenteVue {
  option: Option
  manquants: string[]
}

/** Tout ce que l'écran de décision rend pour un nœud et un jeu de critères donnés. */
export interface VueDecision {
  familles: FamilleVue[]
  alertes: Alerte[]
  /** R4 — options écartées par une exclusion (sécurité, toujours visibles). */
  ecartees: OptionEcarteeVue[]
  /** R4 — options non retenues faute de condition (explication, à la demande). */
  nonRetenues: OptionNonRetenueVue[]
  /** D20 — options en attente faute de critère renseigné (ni proposées, ni écartées, §2.5). */
  enAttente: OptionEnAttenteVue[]
}

/** Doses calculées d'une option (déplacé depuis `OptionCard.tsx`, comportement inchangé) : n'affiche
 * que celles calculables (une primitive non saisie — ex. poids — donne `null`, la ligne est omise ;
 * D20 : idem si un opérande est indéterminé au sens de `renseignes`/`effectifs`, ou si le calcul se
 * heurte à une division par zéro — jamais de `Infinity`/`NaN` affiché, cf. `evaluerNombre`). */
function calculsAffiches(option: Option, criteria: Criteria, effectifs?: ReadonlySet<string>): CalculAffiche[] {
  return (option.calculs ?? [])
    .map((calcul) => ({
      libelle: calcul.libelle,
      valeur: evaluerNombre(calcul.expression, criteria, effectifs),
      unite: calcul.unite,
    }))
    .filter((ligne): ligne is CalculAffiche => ligne.valeur != null)
}

/**
 * Une sentinelle moteur (`["default"]` D11, `["toujours"]` D16) N'EST PAS une expression évaluable :
 * `termesVrais`/`evaluateCondition` lèveraient dessus (`ConditionError`, variable de critère inconnue).
 * Même test que `isDefaultOption`/`isToujoursOption` (`engine/evaluateNode.ts`), réécrit ici sur un
 * `string[]` brut plutôt que sur une `Option` — évite d'exporter ces deux prédicats hors du moteur pour
 * un usage aussi ponctuel.
 */
function estSentinelle(conditions: string[]): boolean {
  return conditions.length === 1 && (conditions[0] === 'default' || conditions[0] === 'toujours')
}

/**
 * Justification SITUATIONNELLE d'une option (R6, `docs/decision/GRAMMAIRE-NOEUD.md`) : `option.conditions`
 * porte plusieurs chaînes en ET (`evaluateNode` : `.every(...)`) — on applique `termesVrais` à CHACUNE et
 * on concatène, plutôt que de recopier les règles littéralement (`EvaluateNodeResult.reasons`, qui reste
 * la liste brute des conditions, inchangée — utile ailleurs, ex. `evaluateNode.test.ts`). Les sentinelles
 * traversent SANS être évaluées (cf. `estSentinelle`) : `describeReasons` les traite par un cas spécial.
 *
 * PREND EXPLICITEMENT `option.conditions` en paramètre, PAS `option.prerequis` (R6, § arbitrage
 * indication/prérequis, livraison 2) : un `prerequis` est évalué EXACTEMENT comme une condition par le
 * moteur (`engine/evaluateNode.ts`), et serait donc tout aussi « décisif » si on le passait ici — c'est
 * précisément ce que l'arbitrage écarte. Ne JAMAIS élargir cette fonction à `option.prerequis`, même par
 * souci de symétrie avec le moteur : la séparation conditions/prérequis n'a de sens QUE si cette
 * frontière est tenue ici.
 */
function raisonsSituationnelles(conditions: string[], criteria: Criteria): string[] {
  if (estSentinelle(conditions)) return conditions
  return conditions.flatMap((condition) => termesVrais(condition, criteria))
}

/**
 * Construit le modèle de vue complet d'un nœud pour un jeu de critères. Recalcule les critères
 * dérivés en entrée (`calculerCriteresDerives`) avant d'évaluer le nœud — comme le faisait
 * `relevance.ts` — puis regroupe par famille (`groupesParFamille`) et calcule les badges
 * (`computeBadges`), exactement le pipeline que suivait `DecisionNodeScreen.tsx`.
 *
 * Les doses calculées (`OptionVue.calculs`) sont évaluées depuis `criteria` TEL QUE REÇU (pas les
 * dérivés) : c'est le comportement historique de `OptionCard.tsx`, conservé à l'identique — les
 * expressions de `Option.calculs` (ex. `poids * 0.1`) portent sur des primitives saisies, jamais sur
 * un critère dérivé.
 *
 * `OptionVue.reasons` (R6) est calculé ICI, PAS dans `evaluateNode` : ce dernier tourne des centaines de
 * fois par frappe via la boucle de perturbation (`engine/relevance.ts`), et une justification
 * situationnelle n'est utile que pour ce qui est RENDU une fois par cycle de rendu React. `motifRang`
 * (R6 couche 2) est en revanche un sous-produit GRATUIT déjà calculé par `evaluateNode`
 * (`EvaluateNodeResult.rangMotifs`) — cette fonction ne fait que décider SI on le montre : seulement
 * pour une famille dont `groupesParFamille` a produit AU MOINS DEUX groupes d'égalité (une vraie
 * concurrence de rang), sinon « pourquoi celle-ci d'abord » n'a pas de réponse à donner (R6).
 */
export function construireVueDecision(node: Noeud, criteria: Criteria, renseignes?: ReadonlySet<string>): VueDecision {
  const derived = calculerCriteresDerives(node.criteres_entree, criteria)
  const { applicable, alertes, rangs, rangMotifs, excluded, nonRetenues, enAttente } = evaluateNode(
    node,
    derived,
    renseignes,
  )
  // Ensemble EFFECTIF recalculé ICI (D20) : `evaluateNode` fait le même calcul pour SES propres besoins,
  // mais ne l'expose pas (coût par perturbation, cf. docstring de tête) — `calculsAffiches`/les alertes
  // d'option en ont besoin À NOUVEAU, une seule fois par cycle de rendu, comme `reasons` ci-dessous.
  const effectifs = determinesEffectifs(node.criteres_entree, derived, renseignes)
  const famillesBrutes = groupesParFamille(node, applicable, rangs)
  const badges = computeBadges(famillesBrutes)

  const familles: FamilleVue[] = famillesBrutes.map((famille) => {
    const motifRangPertinent = famille.groupes.length >= 2
    return {
      libelle: famille.libelle,
      exclusive: famille.exclusive,
      groupes: famille.groupes.map((groupe) =>
        groupe.map(
          (option): OptionVue => ({
            option,
            badge: badges.get(option) ?? null,
            reasons: raisonsSituationnelles(option.conditions, derived),
            calculs: calculsAffiches(option, criteria, effectifs),
            motifRang: motifRangPertinent ? rangMotifs.get(option) : undefined,
            alertes: evaluateAlertesDeListe(option.alertes, derived, effectifs),
          }),
        ),
      ),
    }
  })

  // R4 : ordre de `EvaluateNodeResult.excluded`/`nonRetenues`, lui-même l'ordre d'itération de
  // `node.options` dans `evaluateNode` (les deux Map sont peuplées dans cet ordre) — déterministe,
  // stable d'un appel à l'autre pour un même contenu.
  const ecartees: OptionEcarteeVue[] = [...excluded].map(([option, motifs]) => ({ option, motifs }))
  const nonRetenuesVue: OptionNonRetenueVue[] = [...nonRetenues].map(([option, condition]) => ({
    option,
    condition,
  }))
  // D20 : même ordre déterministe que ci-dessus (ordre d'itération de `node.options` dans `evaluateNode`).
  const enAttenteVue: OptionEnAttenteVue[] = [...enAttente].map(([option, manquants]) => ({ option, manquants }))

  return { familles, alertes, ecartees, nonRetenues: nonRetenuesVue, enAttente: enAttenteVue }
}

/**
 * Sérialisation d'une option de vue : identité (intitulé — même convention que l'ancienne
 * `signature()` et que la clé React de l'écran ; `Option` n'est pas garanti unique mais suffisant en
 * pratique, cf. docstring `EvaluateNodeResult` dans `engine/evaluateNode.ts`), badge, raisons, doses et
 * motif de rang (R6 couche 2 — DIMENSION AFFICHÉE depuis ce travail, donc soumise au même invariant de
 * totalité que les autres : un critère qui ne change QUE le motif de rang doit rester décisif pour
 * `engine/relevance.ts`, cf. `vueDecision.test.ts`). Concaténation manuelle plutôt que `JSON.stringify` :
 * `engine/relevance.ts` appelle cette fonction par PERTURBATION (une reconstruction complète de la vue
 * par valeur candidate de chaque critère saisissable, cf. `criteresPertinents`) — sur le banc
 * `prescription` (~1800 profils × ~25 critères × plusieurs candidats), ça représente des centaines de
 * milliers d'appels ; `JSON.stringify` mesurait ~6 % plus lent que cette forme sur ce banc (30,2 s vs
 * 28,6 s, chronométré 2026-07-25), au point de faire dépasser le budget de 30 s du test R5
 * (`banc/couverture.test.ts`). Les séparateurs (`|`, `§`, `«`…) sont choisis sans autre propriété que de
 * ne pas apparaître dans le contenu clinique réel.
 *
 * `alertes` (addendum alertes d'option, `docs/decision/GRAMMAIRE-NOEUD.md`) entre dans cette
 * sérialisation au même titre que les autres dimensions : c'est ce qui garantit qu'un critère qui ne
 * change QUE l'alerte d'une option (aucune autre dimension affichée ne bouge) reste vu DÉCISIF par
 * `engine/relevance.ts` — exactement le piège que l'unification écran/signature a fermé pour les autres
 * dimensions (cf. docstring de tête de ce fichier).
 */
function serialiseOption(ov: OptionVue): string {
  const reasons = ov.reasons.join('&')
  const calculs = ov.calculs.map((c) => `${c.libelle}=${c.valeur}${c.unite ?? ''}`).join('&')
  const alertes = ov.alertes.map((a) => `${a.message}~${a.niveau ?? ''}`).join('|')
  return `${ov.option.intitule}@${ov.badge ?? ''}«${reasons}»[${calculs}]¦${ov.motifRang ?? ''}‖${alertes}`
}

function serialiseFamille(famille: FamilleVue): string {
  return `${famille.libelle ?? ''}¤${famille.exclusive ?? ''}::${famille.groupes
    .map((groupe) => groupe.map(serialiseOption).join(','))
    .join('|')}`
}

/** Sérialisation d'une option écartée (R4) : identité + TOUS les motifs d'exclusion déclenchés. */
function serialiseEcartee(ecartee: OptionEcarteeVue): string {
  return `${ecartee.option.intitule}«${ecartee.motifs.join('&')}»`
}

/** Sérialisation d'une option non retenue (R4) : identité + la condition fautive retenue. */
function serialiseNonRetenue(nonRetenue: OptionNonRetenueVue): string {
  return `${nonRetenue.option.intitule}«${nonRetenue.condition}»`
}

/** Sérialisation d'une option en attente (D20) : identité + TOUS les critères manquants (ordre stable,
 * cf. `criteresManquants`/`primitivesReferencees`, `engine/evaluateNode.ts` — construits sur un `Set`
 * puis `node.criteres_entree`, donc déterministes pour un même contenu). */
function serialiseEnAttente(enAttente: OptionEnAttenteVue): string {
  return `${enAttente.option.intitule}«${enAttente.manquants.join('&')}»`
}

/**
 * Sérialise une `VueDecision` en chaîne STABLE et TOTALE : deux vues égales produisent la même
 * chaîne, et RIEN du modèle de vue n'est omis (familles, groupes d'égalité, badges, raisons, doses
 * calculées, alertes, options écartées, non retenues et EN ATTENTE — R4/D20) — c'est cette totalité qui
 * garantit qu'aucun critère décisif à l'écran ne peut plus être estompé à tort par `engine/relevance.ts`.
 */
export function signatureVue(vue: VueDecision): string {
  const familles = vue.familles.map(serialiseFamille).join('§§')
  const alertes = vue.alertes.map((a) => `${a.message}~${a.niveau ?? ''}`).join('|')
  const ecartees = vue.ecartees.map(serialiseEcartee).join('|')
  const nonRetenues = vue.nonRetenues.map(serialiseNonRetenue).join('|')
  const enAttente = vue.enAttente.map(serialiseEnAttente).join('|')
  return `${familles}##${alertes}##${ecartees}##${nonRetenues}##${enAttente}`
}
