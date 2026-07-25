/**
 * Critères DÉRIVÉS (câblage P3, nœud E « Insuline ») — calculés par le formulaire à partir d'autres
 * critères, JAMAIS saisis à la main. Un critère porteur d'un champ `derive` (schema `noeud.schema.json`)
 * voit sa valeur recalculée ici avant l'évaluation du moteur, ce qui résout trois limites du DSL de
 * `conditions.ts` (qui ne compare qu'`variable OP littéral`) :
 *
 * - comparer DEUX variables : `HbA1c_actuelle <= HbA1c_cible` → `cible_atteinte` ;
 * - une expression arithmétique : `dose_basale_actuelle / poids > 0.5` → `over_basalisation` ;
 * - l'appartenance à une liste (`contient` / `ne_contient_pas`, critère de type `liste`), ex.
 *   `traitements_en_cours contient sulfamide` → `remplacement_agent_sans_benefice` (recette référent
 *   R3, docs/decision/GRAMMAIRE-NOEUD.md) : même sémantique que `conditions.ts`, ajoutée ici pour que
 *   `derive` en soit un VRAI sur-ensemble (un critère saisi de type liste doit pouvoir nourrir un
 *   dérivé sans détour par une option).
 *
 * Volontairement SÉPARÉ de `conditions.ts` (partagé par tous les nœuds au runtime) : la grammaire
 * `derive` est un sur-ensemble (var-vs-var, arithmétique, appartenance) qui n'a pas à alourdir ni
 * risquer le moteur de conditions. Générique (DECISIONS.md D8) : aucune connaissance d'un nom de
 * critère. Pas d'`eval`.
 *
 * Grammaire `derive` (composition `OR` > `AND` > comparaison/appartenance > arithmétique, `AND`/`OR`
 * majuscules entourés d'espaces, pas de parenthèses — comme `conditions.ts`) :
 *   terme        := comparaison | appartenance | booleen_nu
 *   comparaison  := arith  (== | != | <= | >= | < | >)  arith
 *   appartenance := variable_liste (contient | ne_contient_pas) libellé
 *   arith        := operande [ (+ | - | * | /) operande ]
 *   operande     := nom_de_variable | nombre | true | false | libellé_enum
 */
import { ConditionError, type Criteria, type CriteriaValue } from './conditions'
import type { CritereEntree } from '../content/node.types'

type Scalaire = number | boolean | string

const COMPARE_RE = /^(.+?)\s*(==|!=|<=|>=|<|>)\s*(.+)$/
const ARITH_RE = /^(.+?)\s*([+\-*/])\s*(.+)$/
// Appartenance à une liste (même sémantique que `conditions.ts` MEMBERSHIP_RE) : `variable` à un seul
// mot (`\w+`), pas de forme collée — détectée AVANT la comparaison scalaire, seule forme opérant sur
// un critère de type `liste` (valeur = tableau de libellés).
const MEMBERSHIP_RE = /^(\w+)\s+(contient|ne_contient_pas)\s+(.+)$/

function splitMots(expression: string, motCle: 'AND' | 'OR'): string[] {
  return expression
    .split(new RegExp(`\\s+${motCle}\\s+`))
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
}

/** Résout un opérande atomique : variable (valeur du critère), nombre, booléen, ou libellé d'énumération. */
function resoudreOperande(token: string, criteria: Criteria): Scalaire {
  const t = token.trim()
  if (t in criteria) {
    const v = criteria[t]
    if (Array.isArray(v)) {
      throw new ConditionError(`Dérivation : le critère liste "${t}" ne peut pas être utilisé dans une expression arithmétique/scalaire.`)
    }
    return v
  }
  if (t === 'true') return true
  if (t === 'false') return false
  const n = Number(t)
  if (t !== '' && !Number.isNaN(n)) return n
  return t // libellé d'énumération (ex. "limitee")
}

/** Résout une expression arithmétique simple (un opérateur binaire au plus) ou un opérande. */
function resoudreArith(expression: string, criteria: Criteria): Scalaire {
  const m = ARITH_RE.exec(expression.trim())
  if (m) {
    const gauche = Number(resoudreOperande(m[1], criteria))
    const droite = Number(resoudreOperande(m[3], criteria))
    switch (m[2]) {
      case '+':
        return gauche + droite
      case '-':
        return gauche - droite
      case '*':
        return gauche * droite
      case '/':
        return gauche / droite
    }
  }
  return resoudreOperande(expression, criteria)
}

function evaluerTerme(terme: string, criteria: Criteria): boolean {
  const trimmed = terme.trim()

  // Appartenance à une liste (`contient` / `ne_contient_pas`) : traitée en premier, comme dans
  // `conditions.ts` — seule forme opérant sur un critère de type `liste`.
  const membership = MEMBERSHIP_RE.exec(trimmed)
  if (membership) {
    const [, variable, operator, rawValue] = membership
    if (!(variable in criteria)) {
      throw new ConditionError(`Dérivation : variable de critère inconnue "${variable}".`)
    }
    const actual = criteria[variable]
    if (!Array.isArray(actual)) {
      throw new ConditionError(
        `Dérivation : opérateur "${operator}" réservé aux critères de type liste ("${variable}" n'en est pas une).`,
      )
    }
    const present = actual.includes(rawValue.trim())
    return operator === 'contient' ? present : !present
  }

  const c = COMPARE_RE.exec(trimmed)
  if (c) {
    const gauche = resoudreArith(c[1], criteria)
    const droite = resoudreArith(c[3], criteria)
    const op = c[2]
    if (typeof gauche === 'number' && typeof droite === 'number') {
      switch (op) {
        case '==':
          return gauche === droite
        case '!=':
          return gauche !== droite
        case '<':
          return gauche < droite
        case '<=':
          return gauche <= droite
        case '>':
          return gauche > droite
        case '>=':
          return gauche >= droite
      }
    }
    // Chaînes / booléens : égalité seulement (pas d'ordre naturel).
    if (op === '==') return gauche === droite
    if (op === '!=') return gauche !== droite
    throw new ConditionError(`Dérivation : opérateur "${op}" non supporté entre valeurs non numériques dans "${terme.trim()}".`)
  }
  // Terme booléen nu (ex. "fragilite").
  const v = resoudreOperande(terme, criteria)
  if (typeof v === 'boolean') return v
  throw new ConditionError(`Dérivation : terme non booléen "${terme.trim()}" (attendu une comparaison ou un critère booléen).`)
}

/** Évalue une expression `derive` (booléen). Composition `OR` (union) puis `AND` (intersection). */
export function evaluerDerive(expression: string, criteria: Criteria): boolean {
  const orTerms = splitMots(expression, 'OR')
  if (orTerms.length === 0) {
    throw new ConditionError(`Expression de dérivation vide : "${expression}".`)
  }
  return orTerms.some((orTerm) => splitMots(orTerm, 'AND').every((terme) => evaluerTerme(terme, criteria)))
}

/**
 * Évalue une expression arithmétique en NOMBRE (câblage P3 : doses calculées `Option.calculs`). Réutilise
 * la grammaire arithmétique (`poids * 0.15`, `dose_basale_actuelle + 2`…). Renvoie `null` si le résultat
 * n'est pas un nombre fini (ex. primitive non encore saisie), pour que l'affichage puisse l'omettre.
 */
export function evaluerNombre(expression: string, criteria: Criteria): number | null {
  const valeur = resoudreArith(expression, criteria)
  return typeof valeur === 'number' && Number.isFinite(valeur) ? valeur : null
}

/**
 * Renvoie une copie de `criteria` où chaque critère porteur d'un `derive` est (re)calculé depuis les
 * autres critères. Les critères dérivés dépendent des primitives saisies (pas les uns des autres) :
 * l'évaluation se fait donc contre les valeurs d'entrée, sans dépendance d'ordre.
 */
export function calculerCriteresDerives(criteres: CritereEntree[], criteria: Criteria): Criteria {
  const resultat: Criteria = { ...criteria }
  for (const critere of criteres) {
    if (critere.derive) {
      resultat[critere.nom] = evaluerDerive(critere.derive, criteria) as CriteriaValue
    }
  }
  return resultat
}

/**
 * Ensemble des noms de critères RÉELLEMENT référencés dans les règles du nœud (conditions, exclusions,
 * priorités conditionnelles, `quand` des alertes) ou dans une expression `derive`. Générique : un
 * critère non référencé ne peut pas changer la sortie du moteur, il est donc inutile de l'exiger.
 */
export function criteresReferences(
  criteres: CritereEntree[],
  regles: string[],
): Set<string> {
  const refs = new Set<string>()
  for (const critere of criteres) {
    const motif = new RegExp(`\\b${critere.nom}\\b`)
    const referenceDansRegle = regles.some((regle) => motif.test(regle))
    const referenceDansDerive = criteres.some((autre) => autre.derive != null && motif.test(autre.derive))
    if (referenceDansRegle || referenceDansDerive) refs.add(critere.nom)
  }
  return refs
}
