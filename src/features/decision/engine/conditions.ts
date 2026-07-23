/**
 * Évaluateur générique d'une chaîne `conditions` (brief `docs/decision/BRIEF_DECISION.md` §7/§11 ;
 * `DECISIONS.md` D3 : moteur de règles TS pur, aucun score caché, jamais de ML).
 *
 * Ce module ne connaît **aucun nœud/domaine par son nom** (DECISIONS.md D8) : il évalue une
 * expression texte contre un objet `criteria` générique. Pas d'`eval`, pas de dépendance
 * d'expression tierce — tokenizer + évaluateur maison, volontairement restreint aux formes
 * réellement rencontrées dans le contenu (brief §11) :
 *
 * - comparaison atomique `variable OP valeur` avec `OP` parmi `== != < <= > >=` ;
 * - appartenance à une liste : `variable contient valeur` / `variable ne_contient_pas valeur`
 *   (le critère `variable` doit être de type `liste`, ex. `traitements_en_cours` — DECISIONS.md D13) ;
 * - `valeur` typée selon la valeur réelle du critère : nombre, booléen (`true`/`false`) ou
 *   chaîne (libellé d'énumération) ;
 * - composition par `AND` / `OR` (mots-clés majuscules, entourés d'espaces), **`AND` prioritaire
 *   sur `OR`** (brief §11 : "age >= 75 OR fragilite == true OR ..." = union de comparaisons ;
 *   "fragilite == true AND esperance_vie == limitee" = intersection) ;
 * - **pas de parenthèses** : non nécessaires pour le nœud A (cf. S3 "Si bloqué" — à étendre
 *   plutôt qu'à improviser un parseur générique si un futur nœud en a besoin).
 *
 * `contient` / `ne_contient_pas` (critère multivalué de type `liste`) sont implémentés depuis la
 * réalisation P2 du moteur (DECISIONS.md D13), sans toucher à la composition AND/OR : ils sont
 * détectés avant la comparaison scalaire et n'opèrent que sur une valeur de critère de type tableau.
 */

/**
 * Valeur d'un critère saisi par le praticien : nombre, booléen, libellé d'énumération/texte, ou
 * **liste de libellés** (critère multivalué de type `liste`, ex. `traitements_en_cours`) — cette
 * dernière forme n'est comparable que par `contient` / `ne_contient_pas` (DECISIONS.md D13).
 */
export type CriteriaValue = number | boolean | string | string[]

/** Objet de critères, générique : le moteur ne connaît aucun nom de variable a priori. */
export type Criteria = Record<string, CriteriaValue>

/** Opérateurs de comparaison supportés (brief §11). */
export type ComparisonOperator = '==' | '!=' | '<=' | '>=' | '<' | '>'

/**
 * Erreur explicite levée pour toute condition invalide : variable de critère inconnue, valeur mal
 * formée, ou opérateur non supporté pour le type de la valeur comparée. Volontairement distincte
 * d'une simple évaluation à `false` (brief §7 : "aucun score caché" — une condition mal formée ne
 * doit jamais se traduire silencieusement par une non-applicabilité).
 */
export class ConditionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConditionError'
  }
}

// Ordre important : tester les opérateurs à deux caractères avant leurs préfixes à un caractère
// (`<=`/`>=` avant `<`/`>`) pour que l'alternation regex ne matche pas prématurément.
const ATOMIC_RE = /^(\w+)\s*(==|!=|<=|>=|<|>)\s*(.+)$/
// Opérateurs-mots d'appartenance à une liste (critère de type `liste`, DECISIONS.md D13). Détectés
// AVANT la comparaison scalaire ; espaces requis autour (comme AND/OR), pas de forme collée.
const MEMBERSHIP_RE = /^(\w+)\s+(contient|ne_contient_pas)\s+(.+)$/

function splitTopLevel(expression: string, keyword: 'AND' | 'OR'): string[] {
  const parts = expression.split(new RegExp(`\\s+${keyword}\\s+`)).map((part) => part.trim())
  // Un segment vide trahit une expression malformée (expression vide/blanche, ou opérateur AND/OR
  // pendant sans opérande) : lever explicitement plutôt que le filtrer en silence — sinon une
  // condition vide s'évaluerait à un booléen muet (invariant « aucun score caché », brief §7 ;
  // cf. vérification red-team du moteur P2, DECISIONS.md D13).
  if (parts.some((part) => part.length === 0)) {
    throw new ConditionError(
      `Expression de condition malformée : "${expression.trim()}" ` +
        `(vide, ou opérateur ${keyword} sans opérande).`,
    )
  }
  return parts
}

function evaluateAtomic(text: string, criteria: Criteria): boolean {
  const trimmed = text.trim()

  // Appartenance à une liste (`contient` / `ne_contient_pas`) : traitée en premier, elle est la
  // seule forme opérant sur un critère de type `liste` (valeur = tableau de libellés).
  const membership = MEMBERSHIP_RE.exec(trimmed)
  if (membership) {
    const [, variable, operator, rawValue] = membership
    if (!(variable in criteria)) {
      throw new ConditionError(`Variable de critère inconnue : "${variable}".`)
    }
    const actual = criteria[variable]
    if (!Array.isArray(actual)) {
      throw new ConditionError(
        `Opérateur "${operator}" réservé aux critères de type liste : "${variable}" n'est pas une liste.`,
      )
    }
    const present = actual.includes(rawValue.trim())
    return operator === 'contient' ? present : !present
  }

  const match = ATOMIC_RE.exec(trimmed)
  if (!match) {
    throw new ConditionError(
      `Condition non reconnue : "${trimmed}" (forme attendue : "variable OP valeur", ` +
        `OP parmi == != < <= > >= contient ne_contient_pas).`,
    )
  }
  const [, variable, operatorText, rawValue] = match
  const operator = operatorText as ComparisonOperator

  if (!(variable in criteria)) {
    throw new ConditionError(`Variable de critère inconnue : "${variable}".`)
  }
  const actual = criteria[variable]
  const value = rawValue.trim()

  // Un critère de type `liste` ne se compare pas avec un opérateur scalaire : lever explicitement
  // plutôt que retomber en silence sur l'égalité de chaîne (invariant « aucun score caché », §7).
  if (Array.isArray(actual)) {
    throw new ConditionError(
      `Opérateur "${operator}" invalide sur le critère de type liste "${variable}" ` +
        `(utiliser "contient" / "ne_contient_pas").`,
    )
  }

  if (typeof actual === 'number') {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) {
      throw new ConditionError(`Valeur numérique invalide pour "${variable}" : "${value}".`)
    }
    switch (operator) {
      case '==':
        return actual === parsed
      case '!=':
        return actual !== parsed
      case '<':
        return actual < parsed
      case '<=':
        return actual <= parsed
      case '>':
        return actual > parsed
      case '>=':
        return actual >= parsed
    }
  }

  if (typeof actual === 'boolean') {
    if (value !== 'true' && value !== 'false') {
      throw new ConditionError(
        `Valeur booléenne invalide pour "${variable}" : "${value}" (attendu true/false).`,
      )
    }
    const parsed = value === 'true'
    if (operator === '==') return actual === parsed
    if (operator === '!=') return actual !== parsed
    throw new ConditionError(
      `Opérateur "${operator}" non supporté sur le booléen "${variable}" (seuls == et != le sont).`,
    )
  }

  // Chaîne (libellé d'énumération) : égalité/différence uniquement, pas d'ordre naturel.
  if (operator === '==') return actual === value
  if (operator === '!=') return actual !== value
  throw new ConditionError(
    `Opérateur "${operator}" non supporté sur l'énumération/texte "${variable}" ` +
      `(seuls == et != le sont).`,
  )
}

/**
 * Évalue une expression `conditions` (une chaîne du tableau `Option.conditions`) contre un objet
 * de critères. Compose les comparaisons atomiques par `OR` (union) puis `AND` (intersection),
 * `AND` étant prioritaire — ex. `"a OR b AND c"` = `a OR (b AND c)`.
 *
 * Ne gère pas le mot-clé spécial `"default"` : c'est `evaluateNode` qui le traite en amont (option
 * de repli), cette fonction ne reçoit que des expressions de comparaison réelles.
 */
export function evaluateCondition(expression: string, criteria: Criteria): boolean {
  const orTerms = splitTopLevel(expression, 'OR')
  return orTerms.some((orTerm) => {
    const andTerms = splitTopLevel(orTerm, 'AND')
    return andTerms.every((atomic) => evaluateAtomic(atomic, criteria))
  })
}
