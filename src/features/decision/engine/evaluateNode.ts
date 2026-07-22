/**
 * Sélection des options applicables d'un nœud de décision (brief `docs/decision/BRIEF_DECISION.md`
 * §7/§11 ; `DECISIONS.md` D3/D8). Module générique : aucun nœud/domaine par son nom — tout vient du
 * contenu (`Noeud.options[].conditions`) et des `criteria` fournis par l'appelant (UI, S4).
 *
 * Sémantique (S3 "Décision clé", d'après le brief §11) :
 * - une option est **applicable** si **toutes** les chaînes de son tableau `conditions` sont vraies
 *   (chaque chaîne peut elle-même composer des comparaisons par `AND`/`OR`, cf. `conditions.ts`) ;
 * - l'option dont `conditions` vaut exactement `["default"]` est la **repli** : applicable
 *   seulement si aucune option non-default ne l'est ;
 * - l'**ordre** des options du nœud est préservé (l'auteur du contenu ordonne du plus spécifique
 *   au plus général, default en dernier) — c'est à l'UI (S4) de choisir la 1re applicable comme
 *   "recommandée" et les suivantes comme alternatives.
 *
 * Hors périmètre P1 (DECISIONS.md D10, reporté en P2) : `contre_indications` comme exclusions
 * dures, champ `priorite`. Le nœud A n'en a pas besoin ; ce module reste extensible vers ça sans
 * changer la sémantique ci-dessus (une passe de filtrage/tri supplémentaire, en aval de celle-ci).
 */
import type { Noeud, Option } from '../content/node.types.ts'
import type { Criteria } from './conditions.ts'
import { evaluateCondition } from './conditions.ts'

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
  /** Options applicables, dans l'ordre du nœud. */
  applicable: Option[]
  /** Conditions satisfaites (le « pourquoi ») pour chaque option de `applicable`. */
  reasons: Map<Option, string[]>
}

/** Une option de repli porte exactement `conditions: ["default"]` (brief §11, ex. "Cible ~7 %"). */
function isDefaultOption(option: Option): boolean {
  return option.conditions.length === 1 && option.conditions[0] === 'default'
}

/**
 * Évalue un nœud de décision pour un jeu de critères et renvoie les options applicables, ordonnées,
 * avec la liste des conditions satisfaites par option. Propage `ConditionError` (via
 * `evaluateCondition`) sans la capturer : une variable de critère inconnue ou une condition mal
 * formée dans le contenu doit être visible, jamais avalée en silence (brief §7).
 */
export function evaluateNode(node: Noeud, criteria: Criteria): EvaluateNodeResult {
  // Nœud à sortie unique (D11) : la 1re option applicable dans l'ordre du nœud l'emporte.
  if (node.selection === 'ordered-first-match') {
    return evaluateOrderedFirstMatch(node, criteria)
  }

  const applicable: Option[] = []
  const reasons = new Map<Option, string[]>()
  const defaults: Option[] = []
  let anyNonDefaultApplicable = false

  for (const option of node.options) {
    if (isDefaultOption(option)) {
      defaults.push(option)
      continue
    }
    const satisfied = option.conditions.every((condition) => evaluateCondition(condition, criteria))
    if (satisfied) {
      anyNonDefaultApplicable = true
      applicable.push(option)
      reasons.set(option, [...option.conditions])
    }
  }

  if (!anyNonDefaultApplicable) {
    for (const option of defaults) {
      applicable.push(option)
      reasons.set(option, [...option.conditions])
    }
  }

  return { applicable, reasons }
}

/**
 * Sélection « ordered-first-match » (sortie UNIQUE, DECISIONS.md D11) : renvoie la PREMIÈRE option
 * non-default, dans l'ordre du nœud, dont toutes les conditions sont vraies ; à défaut, l'option de
 * repli (`["default"]`, placée en dernier). Pour les nœuds à cible unique (ex. cible glycémique) :
 * l'ordre EST la sémantique explicite, ce qui lève l'ambiguïté des conditions qui se chevauchent.
 * Propage `ConditionError` comme `evaluateNode` (jamais de faux silencieux, brief §7).
 */
function evaluateOrderedFirstMatch(node: Noeud, criteria: Criteria): EvaluateNodeResult {
  for (const option of node.options) {
    if (isDefaultOption(option)) continue
    if (option.conditions.every((condition) => evaluateCondition(condition, criteria))) {
      return { applicable: [option], reasons: new Map([[option, [...option.conditions]]]) }
    }
  }
  const fallback = node.options.find(isDefaultOption)
  if (fallback) {
    return { applicable: [fallback], reasons: new Map([[fallback, [...fallback.conditions]]]) }
  }
  return { applicable: [], reasons: new Map() }
}
