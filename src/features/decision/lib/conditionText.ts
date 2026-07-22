/**
 * Met en forme lisible les chaînes `conditions` satisfaites, renvoyées par le moteur
 * (`evaluateNode(...).reasons`), pour la ligne « Pourquoi cette option » (ARCHITECTURE.md D3 ;
 * S4.md T-006 "Décision clé" : « le pourquoi vient des conditions satisfaites renvoyées par le
 * moteur »). Reformate le texte des règles réellement évaluées par `evaluateNode` — ne réévalue
 * rien, n'invente aucune règle : traduction variable/valeur/opérateur → libellés (`lib/labels.ts`),
 * `AND`/`OR` → « et »/« ou ». Transparence brief §7 (« aucun score caché ») : on montre la règle
 * exacte, pas une paraphrase qui pourrait s'en écarter.
 *
 * Tokenisation volontairement minimale et locale à l'affichage : ne réutilise pas
 * `engine/conditions.ts` (S4 ne modifie/n'importe pas le moteur S3 pour cet usage de présentation) ;
 * couvre exactement les formes acceptées par le moteur (brief §11, cf. commentaires de
 * `conditions.ts`) : `variable OP valeur`, composé par `AND`/`OR`, pas de parenthèses.
 */
import { labelForCritere, labelForEnumValue } from './labels'

const ATOMIC_RE = /^(\w+)\s*(==|!=|<=|>=|<|>)\s*(.+)$/

const OPERATOR_LABELS: Record<string, string> = {
  '==': '=',
  '!=': '≠',
  '<=': '≤',
  '>=': '≥',
  '<': '<',
  '>': '>',
}

function humanizeAtomic(text: string): string {
  const trimmed = text.trim()
  const match = ATOMIC_RE.exec(trimmed)
  if (!match) return trimmed
  const [, variable, operator, rawValue] = match
  const value = rawValue.trim()
  const operatorLabel = OPERATOR_LABELS[operator] ?? operator
  const valueLabel = value === 'true' ? 'Oui' : value === 'false' ? 'Non' : labelForEnumValue(value)
  return `${labelForCritere(variable)} ${operatorLabel} ${valueLabel}`
}

function humanizeAndTerm(term: string): string {
  return term
    .split(/\s+AND\s+/)
    .map((atomic) => humanizeAtomic(atomic))
    .join(' et ')
}

function humanizeExpression(expression: string): string {
  return expression
    .split(/\s+OR\s+/)
    .map((orTerm) => humanizeAndTerm(orTerm))
    .join(' ou ')
}

/**
 * `reasons` = les chaînes de `Option.conditions` satisfaites par les critères courants (identiques,
 * par référence de contenu, à ce que `evaluateNode` a évalué). Les éléments du tableau sont en ET
 * logique (`evaluateNode` : `option.conditions.every(...)`). Cas spécial `['default']` (repli,
 * `evaluateNode.ts`) : message explicite plutôt que d'afficher littéralement "default".
 */
export function describeReasons(reasons: string[]): string {
  if (reasons.length === 1 && reasons[0] === 'default') {
    return "Option par défaut : retenue en l'absence de toute autre option plus spécifique applicable."
  }
  return reasons.map((reason) => humanizeExpression(reason)).join(' et ')
}
