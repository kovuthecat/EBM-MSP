/**
 * Sélection des options applicables d'un nœud de décision (brief `docs/decision/BRIEF_DECISION.md`
 * §7/§11 ; `DECISIONS.md` D3/D8). Module générique : aucun nœud/domaine par son nom — tout vient du
 * contenu (`Noeud.options[].conditions`) et des `criteria` fournis par l'appelant (UI, S4).
 *
 * Sémantique (S3 "Décision clé", d'après le brief §11) :
 * - une option est **applicable** si **toutes** les chaînes de son tableau `conditions` sont vraies
 *   (chaque chaîne peut elle-même composer des comparaisons par `AND`/`OR`, cf. `conditions.ts`) ;
 * - une option par ailleurs applicable est **exclue** (retirée) si l'une de ses `exclusions` (DSL)
 *   est vraie ; elle est alors reportée dans `excluded` avec la ou les expressions déclenchées,
 *   jamais retirée en silence (invariant « aucun score caché ») — DECISIONS.md D13 ;
 * - l'option dont `conditions` vaut exactement `["default"]` est la **repli** : applicable
 *   seulement si aucune option non-default ne l'est (une option exclue ne compte pas comme applicable) ;
 * - l'option dont `conditions` vaut exactement `["toujours"]` (DECISIONS.md D16) est **toujours**
 *   applicable (subie aux mêmes règles d'exclusion que les autres). **En mode `multi-options`**, elle
 *   est orthogonale au repli `default` : un `toujours` ne « compte » pas comme un non-default
 *   satisfait, donc ne masque pas un éventuel repli — sert un « socle » toujours affiché (ex.
 *   metformine, nœud B) que d'autres options viennent compléter. **En mode `ordered-first-match`**,
 *   cette orthogonalité NE S'APPLIQUE PAS : l'ordre du nœud fait foi (D11), donc un `toujours` gagne
 *   dès qu'il est atteint dans la boucle et masquerait un `default` (ou toute option) placé après lui
 *   — à réserver au `multi-options` tant qu'aucun contenu réel n'a besoin d'un `toujours` en OFM ;
 * - en mode `multi-options`, les options applicables sont triées par `priorite` croissante (tri
 *   stable ; absente = rang le plus faible, ordre du contenu préservé) — DECISIONS.md D13. En mode
 *   `ordered-first-match`, l'**ordre** du nœud EST la priorité (sortie unique) ; `priorite` est ignoré.
 *
 * `priorite`, `exclusions` et le sentinel `toujours` sont optionnels/nouveaux : un nœud qui ne les
 * utilise pas (A actuel) garde exactement le comportement antérieur (P2 réalisée, DECISIONS.md D13,
 * sans régression).
 */
import type { Alerte, Noeud, Option } from '../content/node.types.ts'
import type { Criteria } from './conditions.ts'
import { ConditionError, evaluateCondition } from './conditions.ts'

/**
 * Résultat de l'évaluation d'un nœud pour un jeu de critères donné.
 *
 * `reasons` est indexé par référence à l'`Option` elle-même (et non par un `optionId`) : le schéma
 * de contenu (`schema/noeud.schema.json`, `src/features/decision/content/node.types.ts`) ne porte
 * pas de champ `id` par option, seulement `intitule` — un libellé d'affichage qu'on ne veut pas
 * présumer unique. Les options de `applicable` étant les mêmes références que celles de
 * `node.options`, l'appelant peut faire `reasons.get(option)` directement.
 */
export interface EvaluateNodeResult {
  /**
   * Options applicables. En `multi-options`, triées par `priorite` croissante (défaut = ordre du
   * nœud) ; en `ordered-first-match`, un seul élément (l'ordre du nœud fait foi).
   */
  applicable: Option[]
  /** Conditions satisfaites (le « pourquoi ») pour chaque option de `applicable`. */
  reasons: Map<Option, string[]>
  /**
   * Options qui auraient été applicables mais qu'une exclusion dure a retirées, indexées par la ou
   * les expressions `exclusions` déclenchées (le « pourquoi de l'exclusion »). Vide si aucune (D13).
   */
  excluded: Map<Option, string[]>
  /**
   * Alertes cliniques déclenchées pour ces critères (D15) : rappels/avertissements indépendants de
   * la sélection des options (ex. contrôler la cétonémie, adapter la dose au DFG). Vide si aucune.
   */
  alertes: Alerte[]
}

/** Une option de repli porte exactement `conditions: ["default"]` (brief §11, ex. "Cible ~7 %"). */
function isDefaultOption(option: Option): boolean {
  return option.conditions.length === 1 && option.conditions[0] === 'default'
}

/**
 * Une option « toujours » porte exactement `conditions: ["toujours"]` (D16, ex. socle metformine).
 * Exportée : l'UI (`DecisionNodeScreen.tsx`) s'en sert pour distinguer, à l'affichage, le socle
 * (badge « reco officielle ») de l'option EBM la plus indiquée (badge « Recommandée »), sans dupliquer
 * le sentinel `'toujours'` côté présentation.
 */
export function isToujoursOption(option: Option): boolean {
  return option.conditions.length === 1 && option.conditions[0] === 'toujours'
}

/**
 * Rejette une option non-repli au tableau `conditions` vide : sinon `[].every()` vaut `true`
 * (vérité vacante) et l'option serait applicable sans aucun « pourquoi », neutralisant le repli.
 * Défense au runtime (le schéma pose `minItems: 1`, mais `loadNodes` ne valide pas via Ajv, D9).
 */
function requireConditions(option: Option): void {
  if (option.conditions.length === 0) {
    throw new ConditionError(
      `Option "${option.intitule}" sans condition : une option non-repli doit porter au moins une ` +
        `condition (ou exactement ["default"]).`,
    )
  }
}

/**
 * Exclusions dures déclenchées d'une option : sous-ensemble de `option.exclusions` (expressions DSL)
 * qui s'évaluent à vrai pour ces critères. Vide si l'option n'a pas d'`exclusions`. Propage
 * `ConditionError` comme le reste du moteur (jamais de faux silencieux, brief §7).
 */
function triggeredExclusions(option: Option, criteria: Criteria): string[] {
  if (!option.exclusions || option.exclusions.length === 0) return []
  return option.exclusions.filter((expr) => evaluateCondition(expr, criteria))
}

/**
 * Alertes déclenchées d'un nœud pour ces critères (D15) : celles dont `quand` vaut `"default"`
 * (toujours) ou dont l'expression DSL est vraie. Indépendant de la sélection des options. Propage
 * `ConditionError` sur une expression malformée (jamais de faux silencieux, brief §7).
 */
function evaluateAlertes(node: Noeud, criteria: Criteria): Alerte[] {
  if (!node.alertes || node.alertes.length === 0) return []
  return node.alertes.filter(
    (alerte) => alerte.quand === 'default' || evaluateCondition(alerte.quand, criteria),
  )
}

/**
 * Rang effectif d'une option pour ces critères. `priorite` peut être :
 * - **absente** → rang le plus faible (`+Infinity`, placée en dernier) ;
 * - un **entier** → rang FIXE (D13) ;
 * - une **liste de règles** `{ quand, rang }` → rang CONDITIONNEL (D14) : la 1re règle dont `quand`
 *   est vrai (ou vaut exactement `"default"`) donne le rang ; si aucune ne matche → `+Infinity`.
 * Propage `ConditionError` si un `quand` est malformé (jamais de faux silencieux, brief §7).
 */
function resolvePriorite(option: Option, criteria: Criteria): number {
  const p = option.priorite
  if (p === undefined) return Number.POSITIVE_INFINITY
  if (typeof p === 'number') {
    if (!Number.isFinite(p)) {
      throw new ConditionError(`Option "${option.intitule}" : priorité numérique invalide (${String(p)}).`)
    }
    return p
  }
  // Contenu non validé par Ajv au runtime (D9) : garder les mêmes garde-fous « loud » qu'ailleurs
  // dans le moteur — une forme malformée lève `ConditionError` (nommant l'option), jamais un tri muet.
  if (!Array.isArray(p)) {
    throw new ConditionError(
      `Option "${option.intitule}" : priorité invalide (attendu un entier ou une liste de règles { quand, rang }).`,
    )
  }
  for (const regle of p) {
    if (typeof regle?.quand !== 'string') {
      throw new ConditionError(`Option "${option.intitule}" : règle de priorité sans "quand" (chaîne attendue).`)
    }
    if (regle.quand === 'default' || evaluateCondition(regle.quand, criteria)) {
      if (!Number.isFinite(regle.rang)) {
        throw new ConditionError(
          `Option "${option.intitule}" : règle de priorité (${regle.quand}) sans "rang" fini (${String(regle.rang)}).`,
        )
      }
      return regle.rang
    }
  }
  return Number.POSITIVE_INFINITY
}

/**
 * Évalue un nœud de décision pour un jeu de critères et renvoie les options applicables, ordonnées,
 * avec la liste des conditions satisfaites par option. Propage `ConditionError` (via
 * `evaluateCondition`) sans la capturer : une variable de critère inconnue ou une condition mal
 * formée dans le contenu doit être visible, jamais avalée en silence (brief §7).
 */
export function evaluateNode(node: Noeud, criteria: Criteria): EvaluateNodeResult {
  // Alertes cliniques (D15) : indépendantes de la sélection des options, calculées dans tous les cas.
  const alertes = evaluateAlertes(node, criteria)

  // Nœud à sortie unique (D11) : la 1re option applicable dans l'ordre du nœud l'emporte.
  if (node.selection === 'ordered-first-match') {
    return { ...evaluateOrderedFirstMatch(node, criteria), alertes }
  }

  const applicable: Option[] = []
  const reasons = new Map<Option, string[]>()
  const excluded = new Map<Option, string[]>()
  const defaults: Option[] = []
  let anyNonDefaultApplicable = false

  for (const option of node.options) {
    if (isDefaultOption(option)) {
      defaults.push(option)
      continue
    }
    if (isToujoursOption(option)) {
      // Toujours candidate (D16), sans compter comme un non-default « réel » : ne doit pas
      // masquer un éventuel repli `default` par ailleurs. Reste soumise à ses `exclusions`.
      const triggeredAlways = triggeredExclusions(option, criteria)
      if (triggeredAlways.length > 0) {
        excluded.set(option, triggeredAlways)
        continue
      }
      applicable.push(option)
      reasons.set(option, [...option.conditions])
      continue
    }
    requireConditions(option)
    const satisfied = option.conditions.every((condition) => evaluateCondition(condition, criteria))
    if (!satisfied) continue
    // Applicable sur ses conditions : une exclusion dure la retire (et la trace dans `excluded`).
    const triggered = triggeredExclusions(option, criteria)
    if (triggered.length > 0) {
      excluded.set(option, triggered)
      continue
    }
    anyNonDefaultApplicable = true
    applicable.push(option)
    reasons.set(option, [...option.conditions])
  }

  // Le repli ne s'active que si AUCUNE option non-default n'est réellement applicable (une option
  // exclue ne compte pas). Le repli est lui aussi soumis à ses propres exclusions.
  if (!anyNonDefaultApplicable) {
    for (const option of defaults) {
      const triggered = triggeredExclusions(option, criteria)
      if (triggered.length > 0) {
        excluded.set(option, triggered)
        continue
      }
      applicable.push(option)
      reasons.set(option, [...option.conditions])
    }
  }

  // Tri stable par priorité (fixe D13 ou conditionnelle D14). Rangs pré-calculés une seule fois :
  // évite de ré-évaluer les conditions à chaque comparaison et fait remonter proprement une
  // ConditionError (plutôt qu'en plein tri) ; sans `priorite`, l'ordre du contenu est préservé.
  const rangs = new Map<Option, number>()
  for (const option of applicable) rangs.set(option, resolvePriorite(option, criteria))
  applicable.sort((a, b) => {
    // `resolvePriorite` garantit un nombre fini ou `+Infinity` (jamais `undefined`/`NaN`) : comparaison
    // explicite plutôt qu'une soustraction (qui donnerait `NaN` pour deux `+Infinity`) ; rangs égaux
    // → 0, l'ordre du contenu est préservé (tri stable).
    const ra = rangs.get(a) as number
    const rb = rangs.get(b) as number
    if (ra === rb) return 0
    return ra < rb ? -1 : 1
  })

  return { applicable, reasons, excluded, alertes }
}

/**
 * Sélection « ordered-first-match » (sortie UNIQUE, DECISIONS.md D11) : renvoie la PREMIÈRE option
 * non-default, dans l'ordre du nœud, dont toutes les conditions sont vraies ; à défaut, l'option de
 * repli (`["default"]`, placée en dernier). Pour les nœuds à cible unique (ex. cible glycémique) :
 * l'ordre EST la sémantique explicite, ce qui lève l'ambiguïté des conditions qui se chevauchent.
 * Propage `ConditionError` comme `evaluateNode` (jamais de faux silencieux, brief §7).
 */
function evaluateOrderedFirstMatch(
  node: Noeud,
  criteria: Criteria,
): Omit<EvaluateNodeResult, 'alertes'> {
  const excluded = new Map<Option, string[]>()
  for (const option of node.options) {
    if (isDefaultOption(option)) continue
    requireConditions(option)
    const satisfied = isToujoursOption(option) || option.conditions.every((condition) => evaluateCondition(condition, criteria))
    if (!satisfied) continue
    // 1re option satisfaite : une exclusion dure la saute (on continue vers la suivante).
    const triggered = triggeredExclusions(option, criteria)
    if (triggered.length > 0) {
      excluded.set(option, triggered)
      continue
    }
    return { applicable: [option], reasons: new Map([[option, [...option.conditions]]]), excluded }
  }
  const fallback = node.options.find(isDefaultOption)
  if (fallback) {
    const triggered = triggeredExclusions(fallback, criteria)
    if (triggered.length > 0) {
      excluded.set(fallback, triggered)
      return { applicable: [], reasons: new Map(), excluded }
    }
    return { applicable: [fallback], reasons: new Map([[fallback, [...fallback.conditions]]]), excluded }
  }
  return { applicable: [], reasons: new Map(), excluded }
}
