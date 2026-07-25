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
/**
 * Appartenance à une liste — forme du moteur (`conditions.ts`, `deriveCritere.ts`) que `ATOMIC_RE` ne
 * reconnaît PAS, faute d'opérateur de comparaison. Sans elle, `humanizeAtomic` retombait sur son repli
 * « renvoyer la chaîne telle quelle » et affichait un JETON DU DSL au clinicien
 * (« traitements_en_cours ne_contient_pas gliptine »). Même classe de défaut que le sentinel `toujours`
 * attrapé en vérification red-team de D16 — jamais recherchée ailleurs qu'à l'endroit où elle avait mordu.
 */
const MEMBERSHIP_RE = /^(\w+)\s+(contient|ne_contient_pas)\s+(.+)$/

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

  const membership = MEMBERSHIP_RE.exec(trimmed)
  if (membership) {
    const [, variable, operator, rawValue] = membership
    const verbe = operator === 'contient' ? 'comprend' : 'ne comprend pas'
    return `${labelForCritere(variable)} ${verbe} ${labelForEnumValue(rawValue.trim())}`
  }

  const match = ATOMIC_RE.exec(trimmed)
  if (!match) return trimmed
  const [, variable, operator, rawValue] = match
  const value = rawValue.trim()

  // Booléen : « ASCVD établie = Oui » se lit comme une case de formulaire, pas comme une raison
  // clinique. Le libellé seul porte l'affirmation, « : non » la négation — tournure sûre quel que soit
  // le libellé, là où « pas de <libellé> » produirait des fautes de genre et de nombre.
  if (operator === '==' && value === 'true') return labelForCritere(variable)
  if (operator === '==' && value === 'false') return `${labelForCritere(variable)} : non`

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
 * logique (`evaluateNode` : `option.conditions.every(...)`). Cas spéciaux `['default']` (repli) et
 * `['toujours']` (socle systématiquement applicable, D16) : message explicite plutôt que d'afficher
 * littéralement le sentinel moteur — sinon une carte affiche « Pourquoi cette option : toujours »,
 * un jeton interne présenté au clinicien (trouvé par vérification red-team de D16).
 */
export function describeReasons(reasons: string[]): string {
  if (reasons.length === 1 && reasons[0] === 'default') {
    return "Option par défaut : retenue en l'absence de toute autre option plus spécifique applicable."
  }
  if (reasons.length === 1 && reasons[0] === 'toujours') {
    return 'Socle maintenu par la recommandation officielle, quelles que soient les comorbidités.'
  }
  return reasons.map((reason) => humanizeExpression(reason)).join(' et ')
}
