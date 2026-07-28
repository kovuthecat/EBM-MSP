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
 *
 * ÉVALUATION TERNAIRE (DECISIONS.md D20, SPEC-valeur-indeterminee.md §2) : `evaluerDeriveTernaire`/
 * `resoudreArithTernaire` sont les pendants ternaires de `evaluerDerive`/`resoudreArith`, avec les
 * MÊMES deux propagations que `conditions.ts` :
 * - un OPÉRANDE indéterminé (nom absent de `renseignes`, quand il est fourni) rend indéterminée toute
 *   comparaison ou expression arithmétique qui le mentionne ;
 * - une DIVISION dont le dénominateur résout à `0` — QUE `renseignes` soit fourni ou non — rend
 *   indéterminé, **jamais `Infinity` ni `NaN`** : c'est le défaut réel `dose_basale_actuelle / poids`
 *   avec `poids` vide (12.4), et c'est pourquoi ce garde-fou n'est PAS conditionné à `renseignes`
 *   (`evaluerDerive`, le repli 2-arguments, en bénéficie donc aussi — cf. sa docstring).
 * `evaluerDerive`/`resoudreArith` restent la forme historique (2 arguments, jamais `INDETERMINE` en
 * sortie) : de simples enveloppes sur leur pendant ternaire avec `renseignes` absent, qui réconcilient
 * un résultat `INDETERMINE` en un booléen/nombre sûr (repli neutre) — jamais un second calcul.
 */
import { ConditionError, INDETERMINE, ternaryAll, ternaryAny, type Criteria, type CriteriaValue, type Ternaire } from './conditions'
import type { CritereEntree } from '../content/node.types'

type Scalaire = number | boolean | string
/** Un opérande résolu, ou `INDETERMINE` (D20) — jamais stocké dans un `CriteriaValue`. */
type ScalaireTernaire = Scalaire | typeof INDETERMINE

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

/**
 * Résout un opérande atomique en TERNAIRE : variable (valeur du critère — `INDETERMINE` si `renseignes`
 * est fourni et ne la contient pas), nombre, booléen, ou libellé d'énumération.
 */
function resoudreOperandeTernaire(
  token: string,
  criteria: Criteria,
  renseignes: ReadonlySet<string> | undefined,
): ScalaireTernaire {
  const t = token.trim()
  if (t in criteria) {
    if (renseignes !== undefined && !renseignes.has(t)) return INDETERMINE
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

/**
 * Résout une expression arithmétique simple (un opérateur binaire au plus) ou un opérande, en TERNAIRE.
 * Un opérande `INDETERMINE` rend l'expression `INDETERMINE`. Une DIVISION dont le dénominateur résout à
 * `0` rend `INDETERMINE` — TOUJOURS, que `renseignes` soit fourni ou non (D20 : « jamais `Infinity` ni
 * `NaN` », défaut réel `dose_basale_actuelle / poids` avec `poids` vide/nul, 12.4). Filet de sécurité
 * final : tout résultat numérique non fini (overflow…) est lui aussi ramené à `INDETERMINE`, jamais
 * laissé fuiter en `Infinity`/`NaN` vers un appelant.
 */
function resoudreArithTernaire(
  expression: string,
  criteria: Criteria,
  renseignes: ReadonlySet<string> | undefined,
): ScalaireTernaire {
  const m = ARITH_RE.exec(expression.trim())
  if (m) {
    const gaucheR = resoudreOperandeTernaire(m[1], criteria, renseignes)
    const droiteR = resoudreOperandeTernaire(m[3], criteria, renseignes)
    if (gaucheR === INDETERMINE || droiteR === INDETERMINE) return INDETERMINE
    const gauche = Number(gaucheR)
    const droite = Number(droiteR)
    let resultat: number
    switch (m[2]) {
      case '+':
        resultat = gauche + droite
        break
      case '-':
        resultat = gauche - droite
        break
      case '*':
        resultat = gauche * droite
        break
      case '/':
        if (droite === 0) return INDETERMINE
        resultat = gauche / droite
        break
      default:
        resultat = NaN
    }
    return Number.isFinite(resultat) ? resultat : INDETERMINE
  }
  return resoudreOperandeTernaire(expression, criteria, renseignes)
}

/** Pendant ternaire de `evaluerTerme` : mêmes formes reconnues, propage `INDETERMINE`. */
function evaluerTermeTernaire(
  terme: string,
  criteria: Criteria,
  renseignes: ReadonlySet<string> | undefined,
): Ternaire {
  const trimmed = terme.trim()

  // Appartenance à une liste (`contient` / `ne_contient_pas`) : traitée en premier, comme dans
  // `conditions.ts` — seule forme opérant sur un critère de type `liste`.
  const membership = MEMBERSHIP_RE.exec(trimmed)
  if (membership) {
    const [, variable, operator, rawValue] = membership
    if (!(variable in criteria)) {
      throw new ConditionError(`Dérivation : variable de critère inconnue "${variable}".`)
    }
    if (renseignes !== undefined && !renseignes.has(variable)) return INDETERMINE
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
    const gauche = resoudreArithTernaire(c[1], criteria, renseignes)
    const droite = resoudreArithTernaire(c[3], criteria, renseignes)
    if (gauche === INDETERMINE || droite === INDETERMINE) return INDETERMINE
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
  const v = resoudreOperandeTernaire(terme, criteria, renseignes)
  if (v === INDETERMINE) return INDETERMINE
  if (typeof v === 'boolean') return v
  throw new ConditionError(`Dérivation : terme non booléen "${terme.trim()}" (attendu une comparaison ou un critère booléen).`)
}

/**
 * Évalue une expression `derive` en TERNAIRE (D20). Composition `OR` (union) puis `AND` (intersection),
 * via `ternaryAny`/`ternaryAll` (`conditions.ts`, même table SPEC §2.3 que le DSL `conditions`).
 * `renseignes` absent ⇒ repli : ne renvoie jamais `INDETERMINE` par indétermination structurelle (mais
 * PEUT renvoyer `INDETERMINE` par division par zéro, cf. `resoudreArithTernaire` — garde-fou toujours
 * actif, jamais conditionné à `renseignes`).
 */
export function evaluerDeriveTernaire(
  expression: string,
  criteria: Criteria,
  renseignes: ReadonlySet<string> | undefined,
): Ternaire {
  const orTerms = splitMots(expression, 'OR')
  if (orTerms.length === 0) {
    throw new ConditionError(`Expression de dérivation vide : "${expression}".`)
  }
  const valeurs = orTerms.map((orTerm) =>
    ternaryAll(splitMots(orTerm, 'AND').map((terme) => evaluerTermeTernaire(terme, criteria, renseignes))),
  )
  return ternaryAny(valeurs)
}

/**
 * Évalue une expression `derive` (booléen) — FORME HISTORIQUE (2 arguments), enveloppe de
 * `evaluerDeriveTernaire` avec `renseignes` absent : ne diffère de son ancienne implémentation directe
 * QUE par le garde-fou division-par-zéro (D20, désormais toujours actif) — un `INDETERMINE` qui en
 * résulterait est ramené à `false`, repli neutre qui ne peut jamais être lu comme une AFFIRMATION
 * positive (jamais de score caché, brief §7) ; c'est le seul cas où ce repli peut apparaître ici, la
 * seule autre source d'`INDETERMINE` (nom absent de `renseignes`) étant inatteignable avec `renseignes`
 * absent.
 */
export function evaluerDerive(expression: string, criteria: Criteria): boolean {
  const resultat = evaluerDeriveTernaire(expression, criteria, undefined)
  return resultat === INDETERMINE ? false : resultat
}

/**
 * Évalue une expression arithmétique en NOMBRE (câblage P3 : doses calculées `Option.calculs`). Réutilise
 * la grammaire arithmétique (`poids * 0.15`, `dose_basale_actuelle + 2`…). Renvoie `null` si le résultat
 * n'est pas calculable (primitive non encore saisie, non renseignée — D20 — ou division par zéro), pour
 * que l'affichage puisse l'omettre (jamais `Infinity`/`NaN` affiché, D20 point 4 : « un calcul dont un
 * opérande est indéterminé ne s'affiche pas »).
 */
export function evaluerNombre(expression: string, criteria: Criteria, renseignes?: ReadonlySet<string>): number | null {
  const valeur = resoudreArithTernaire(expression, criteria, renseignes)
  return typeof valeur === 'number' && Number.isFinite(valeur) ? valeur : null
}

/**
 * Renvoie une copie de `criteria` où chaque critère porteur d'un `derive` est (re)calculé depuis les
 * autres critères. Les critères dérivés dépendent des primitives saisies (pas les uns des autres) :
 * l'évaluation se fait donc contre les valeurs d'entrée, sans dépendance d'ordre.
 *
 * Signature INCHANGÉE (2 arguments, D20 § « repli tout est renseigné ») : la richesse ternaire
 * (indétermination structurelle) est portée par `determinesEffectifs` ci-dessous, PAS ici — cette
 * fonction reste responsable uniquement de la VALEUR concrète stockée (qui doit rester un
 * `CriteriaValue` réel, cf. décision de conception actée : `Criteria` ne change pas). Elle bénéficie
 * malgré tout du garde-fou « jamais Infinity/NaN » via `evaluerDerive` (toujours actif, non conditionné
 * à `renseignes`, cf. sa docstring) : c'est ce qui fait bouger `banc/caracterisation.test.ts` même sans
 * qu'aucun appelant ne passe encore `renseignes` (aucun ne le fait dans ce lot, cf. périmètre de tâche).
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
 * Un critère est INDÉTERMINÉ (SPEC §2.2, DECISIONS.md D30 — amende D20) si son nom n'est pas dans
 * `renseignes` ET qu'aucune présomption de contenu ne l'autorise à valoir sa valeur par défaut :
 * `nombre`/`enum`/`bool`/`liste` sont TOUS indéterminés dès qu'absents de `renseignes`, SAUF
 * déclaration explicite `presomption_non: true` par le contenu — réservée aux `bool`/`liste` dont le
 * défaut « non »/« aucun » PEUT être présumé sans risque (établi mécaniquement : ne participe à aucune
 * condition d'option `role: securite` ni à aucune `exclusions` du nœud). `nombre`/`enum` n'ouvrent
 * jamais ce cas : ils restent indéterminés d'office, sans possibilité de présomption.
 */
function critereEstDetermine(critere: CritereEntree, renseignes: ReadonlySet<string>): boolean {
  if (renseignes.has(critere.nom)) return true
  if (critere.type === 'bool' || critere.type === 'liste') return critere.presomption_non === true
  return false // nombre / enum non renseigné
}

/**
 * Ensemble EFFECTIF des critères DÉTERMINÉS pour l'évaluation ternaire (`conditions.ts` `renseignes`,
 * `evaluerDeriveTernaire` ci-dessus) — SPEC-valeur-indeterminee.md §2.2/§2.4, DECISIONS.md D20.
 *
 * `renseignes` REÇU ici est le `touched` BRUT (noms effectivement fournis par le praticien, `undefined`
 * ⇒ repli « tout est renseigné », propagé tel quel en `undefined` de sortie — aucune fonction ternaire
 * en aval ne doit alors rien traiter comme indéterminé, comportement identique à avant ce chantier).
 * Ce que cette fonction AJOUTE au `touched` brut, pour obtenir l'ensemble réellement consommable par
 * `evaluateCondition`/`evaluerDeriveTernaire` (qui, eux, ne connaissent aucun `type` de critère,
 * générique D8) :
 * 1. les `bool`/`liste` portant `presomption_non: true` (déterminés par construction, cf.
 *    `critereEstDetermine` — D30 : c'est désormais l'EXCEPTION, plus le défaut) ;
 * 2. les critères DÉRIVÉS dont l'expression `derive` s'évalue à un booléen réel (jamais `INDETERMINE`)
 *    sur les PRIMITIFS déterminés à l'étape 1 — un seul passage suffit, aucun `derive` de ce contenu ne
 *    référence un autre `derive` (cf. docstring `calculerCriteresDerives` : « pas les uns des autres »).
 */
export function determinesEffectifs(
  criteres: CritereEntree[],
  criteria: Criteria,
  renseignes: ReadonlySet<string> | undefined,
): ReadonlySet<string> | undefined {
  if (renseignes === undefined) return undefined
  const primitifs = new Set<string>()
  for (const critere of criteres) {
    if (critere.derive == null && critereEstDetermine(critere, renseignes)) primitifs.add(critere.nom)
  }
  const effectifs = new Set(primitifs)
  for (const critere of criteres) {
    if (critere.derive == null) continue
    if (evaluerDeriveTernaire(critere.derive, criteria, primitifs) !== INDETERMINE) effectifs.add(critere.nom)
  }
  return effectifs
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
