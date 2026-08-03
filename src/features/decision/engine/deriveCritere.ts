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
 *   arith        := operande { (+ | - | * | /) operande }        (CHAÎNE, gauche à droite, T-133 P12/S8 —
 *                                                                  jusqu'ici un seul opérateur au plus)
 *   operande     := nom_de_variable | nombre | true | false | libellé_enum
 *
 * CRITÈRE DÉRIVÉ **NUMÉRIQUE** (T-133, P12/S8) : un critère `type: nombre` porteur d'un `derive` reçoit
 * la VALEUR de l'expression `arith` (ex. IMC = `poids / taille / taille`, CK_x_normale =
 * `CK_UI_L / CK_normale_sup`), pas un booléen — `calculerCriteresDerives` branche sur le `type` DÉCLARÉ
 * du critère (cf. sa docstring). La CHAÎNE d'opérateurs (au lieu d'un seul) est ce qui rend l'IMC
 * exprimable SANS parenthèses : `poids / taille / taille` = `(poids / taille) / taille` = poids/taille²,
 * ce qu'aucune expression à un seul opérateur ne peut dire. Non-régression garantie pour toute expression
 * historique (un seul opérateur) : la chaîne s'y réduit à un pli unique, calcul identique à avant.
 * SEUL `nombre` est supporté en sortie numérique — un `derive` d'`enum` (produire l'un de plusieurs
 * libellés selon condition) N'EXISTE PAS dans cette grammaire, cf. le commentaire de `position_vs_cible`
 * dans `content/decision/noeuds/diabete-type-2/prescription.yaml` : une tentative antérieure l'a déjà
 * écartée pour la même raison. `albuminurie` (enum à 3 valeurs) n'est donc PAS converti par ce chantier.
 *
 * ÉVALUATION TERNAIRE (DECISIONS.md D20, SPEC-valeur-indeterminee.md §2) : `evaluerDeriveTernaire`/
 * `resoudreArithTernaire` sont les pendants ternaires de `evaluerDerive`/`resoudreArith`, avec les
 * MÊMES deux propagations que `conditions.ts` :
 * - un OPÉRANDE indéterminé (nom absent de `renseignes`, quand il est fourni) — À N'IMPORTE QUEL MAILLON
 *   de la chaîne arithmétique — rend indéterminée toute comparaison ou expression qui le mentionne ;
 * - une DIVISION dont le dénominateur résout à `0` — QUE `renseignes` soit fourni ou non — rend
 *   indéterminé, **jamais `Infinity` ni `NaN`** : c'est le défaut réel `dose_basale_actuelle / poids`
 *   avec `poids` vide (12.4), et c'est pourquoi ce garde-fou n'est PAS conditionné à `renseignes`
 *   (`evaluerDerive`/`evaluerDeriveNombre`, le repli 2-arguments, en bénéficient donc aussi — cf. leurs
 *   docstrings).
 * `evaluerDerive`/`evaluerDeriveNombre`/`resoudreArith` restent la forme historique (2 arguments, jamais
 * `INDETERMINE` en sortie) : de simples enveloppes sur leur pendant ternaire avec `renseignes` absent,
 * qui réconcilient un résultat `INDETERMINE` en un booléen/nombre sûr (repli neutre) — jamais un second
 * calcul. LA DÉTERMINATION RÉELLE (ce `0`/`false` de repli est-il un VRAI zéro ou un indéterminé
 * maquillé ?) N'EST JAMAIS TRANCHÉE ICI : c'est `determinesEffectifs`, appelé avec le VRAI `renseignes`,
 * qui décide si le critère entre dans l'ensemble EFFECTIF — la propagation D20 pour un dérivé numérique
 * tient tout entière dans ce second appel, jamais dans la valeur stockée par `calculerCriteresDerives`.
 */
import { ConditionError, INDETERMINE, ternaryAll, ternaryAny, type Criteria, type CriteriaValue, type Ternaire } from './conditions'
import type { CritereEntree } from '../content/node.types'

type Scalaire = number | boolean | string
/** Un opérande résolu, ou `INDETERMINE` (D20) — jamais stocké dans un `CriteriaValue`. */
type ScalaireTernaire = Scalaire | typeof INDETERMINE

const COMPARE_RE = /^(.+?)\s*(==|!=|<=|>=|<|>)\s*(.+)$/
// CHAÎNE d'opérateurs (T-133, P12/S8) : `\s*([+\-*/])\s*` en groupe capturant, consommé par
// `String.split` qui conserve alors le délimiteur dans le tableau résultat — tokénise
// "poids / taille / taille" en `["poids", "/", "taille", "/", "taille"]`, GAUCHE À DROITE, sans priorité
// d'opérateur (comme le reste de ce DSL, docstring de tête). Remplace l'ancien `ARITH_RE` (un seul
// opérateur au plus) : cf. `resoudreArithTernaire` ci-dessous pour la justification complète (nécessaire
// à l'IMC, `poids / taille²`, qu'aucun opérateur binaire unique ne peut exprimer sans parenthèses).
const ARITH_SPLIT_RE = /\s*([+\-*/])\s*/
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
 * Résout une expression arithmétique — une CHAÎNE de zéro ou plusieurs opérateurs binaires (T-133,
 * P12/S8 : étendu depuis « un opérateur au plus », nécessaire à l'IMC, `poids / taille / taille` =
 * `(poids / taille) / taille` = poids / taille², que `poids / taille` seul ne peut pas exprimer sans
 * parenthèses, prohibées par ce DSL) — ou un simple opérande, en TERNAIRE.
 *
 * GAUCHE À DROITE, JAMAIS un regroupement du reste de la chaîne : `tokeniser` déjà cité ci-dessus
 * découpe TOUTE la chaîne en `[operande, op, operande, op, operande, …]`, puis ce qui suit PLIE
 * (`reduce` explicite) de gauche à droite — `a - b + c` = `(a - b) + c`, `a / b / c` = `(a / b) / c`.
 * C'est le seul choix qui donne le bon résultat pour l'IMC : un regroupement à DROITE donnerait
 * `a / (b / c)`, mathématiquement différent (et faux ici : `poids / (taille / taille)` = `poids`).
 *
 * NON-RÉGRESSION GARANTIE pour toute expression à UN SEUL opérateur (toute expression `derive`/`calculs`
 * du contenu au jour de ce chantier) : la chaîne se réduit alors à un unique pli, EXACTEMENT le calcul
 * que l'ancienne forme à un opérateur produisait.
 *
 * Un opérande `INDETERMINE` — À N'IMPORTE QUEL MAILLON de la chaîne — rend l'expression ENTIÈRE
 * `INDETERMINE` (propagation D20, cœur de T-133 : un poids manquant dans `poids / taille / taille` ne
 * calcule pas un IMC partiel, il ne calcule RIEN). Une DIVISION dont le dénominateur résout à `0` rend
 * `INDETERMINE` — TOUJOURS, que `renseignes` soit fourni ou non (D20 : « jamais `Infinity` ni `NaN` »,
 * défaut réel `dose_basale_actuelle / poids` avec `poids` vide/nul, 12.4). Filet de sécurité final : tout
 * résultat numérique non fini (overflow…) est lui aussi ramené à `INDETERMINE`, jamais laissé fuiter en
 * `Infinity`/`NaN` vers un appelant.
 */
function resoudreArithTernaire(
  expression: string,
  criteria: Criteria,
  renseignes: ReadonlySet<string> | undefined,
): ScalaireTernaire {
  const tokens = expression
    .trim()
    .split(ARITH_SPLIT_RE)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
  if (tokens.length === 0) return resoudreOperandeTernaire(expression, criteria, renseignes)

  let acc: ScalaireTernaire = resoudreOperandeTernaire(tokens[0], criteria, renseignes)
  for (let i = 1; i < tokens.length; i += 2) {
    const operateur = tokens[i]
    const operandeR = resoudreOperandeTernaire(tokens[i + 1], criteria, renseignes)
    if (acc === INDETERMINE || operandeR === INDETERMINE) {
      acc = INDETERMINE
      continue // continue de résoudre les opérandes suivants (erreurs éventuelles à faire surgir), sans plus calculer.
    }
    const gauche = Number(acc)
    const droite = Number(operandeR)
    let resultat: number
    switch (operateur) {
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
    acc = Number.isFinite(resultat) ? resultat : INDETERMINE
  }
  return acc
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
 * Évalue un `derive` NUMÉRIQUE — critère `type: nombre` porteur d'un `derive` arithmétique (T-133,
 * P12/S8 : IMC = `poids / taille / taille`, CK_x_normale = `CK_UI_L / CK_normale_sup`) — FORME
 * HISTORIQUE (2 arguments, repli « tout est renseigné »), pendant NUMÉRIQUE d'`evaluerDerive` ci-dessus
 * pour la même famille de critères que `evaluerNombre` sert déjà pour `Option.calculs`.
 *
 * Un résultat NON CALCULABLE (`evaluerNombre` renvoie `null` — opérande manquant, ou division par zéro,
 * D20) est ramené à `0` : MÊME repli neutre que `valeurParDefaut` (`lib/formLayout.ts`, un `nombre` non
 * saisi vaut `0` par défaut) et que la convention DÉJÀ EN PLACE sur `CK_x_normale` (« 0 = non dosé »,
 * `content/decision/noeuds/diabete-type-2/statine.yaml`) — jamais une valeur qui pourrait franchir un
 * seuil par accident (un poids manquant ne doit jamais faire lire un IMC élevé). Reproduit ainsi, sur le
 * profil VIERGE (`buildDefaultCriteria`, tous les `nombre` à `0`), EXACTEMENT le même IMC/CK qu'avant ce
 * chantier (l'ancien critère saisi valait déjà `0` par ce même défaut générique).
 *
 * CE `0` N'EST PAS LA DÉTERMINATION : exactement comme le repli booléen d'`evaluerDerive` (`false` qui
 * n'affirme rien tant que `determinesEffectifs` ne place pas le critère dans l'ensemble EFFECTIF), ce `0`
 * n'est qu'une VALEUR DE STOCKAGE sûre — la question « le poids est-il connu ? » reste tranchée par
 * `determinesEffectifs` (ci-dessous), qui rappelle `evaluerNombre` avec le VRAI `renseignes` et exclut le
 * critère de l'ensemble effectif s'il n'est pas calculable. C'est CETTE exclusion, pas la valeur stockée
 * ici, qui fait qu'`IMC >= 30` reste `INDETERMINE` pour `evaluateCondition` quand le poids manque —
 * exactement la propagation que le brief S8 (« si bloqué ») exige de ne jamais rater.
 */
export function evaluerDeriveNombre(expression: string, criteria: Criteria): number {
  return evaluerNombre(expression, criteria) ?? 0
}

/**
 * Renvoie une copie de `criteria` où chaque critère porteur d'un `derive` est (re)calculé depuis les
 * autres critères. Les critères dérivés dépendent des primitives saisies (pas les uns des autres) :
 * l'évaluation se fait donc contre les valeurs d'entrée, sans dépendance d'ordre.
 *
 * DEUX FORMES DE SORTIE selon le `type` DÉCLARÉ du critère dérivé (T-133, P12/S8 — jusque-là, `derive` ne
 * produisait qu'un BOOLÉEN, quel que soit le type porté par le critère qui le déclarait) : un critère
 * `type: nombre` reçoit la VALEUR numérique (`evaluerDeriveNombre`) ; tout autre type (`bool` en
 * pratique — aucun `derive` d'`enum`/`liste` n'est supporté, cf. `evaluerDeriveNombre`/schéma) continue de
 * recevoir le booléen historique (`evaluerDerive`). Générique par le TYPE, jamais par le NOM du critère
 * (D8) : n'importe quel domaine obtient le bon comportement en déclarant `type: nombre` + `derive`.
 *
 * Signature INCHANGÉE (2 arguments, D20 § « repli tout est renseigné ») : la richesse ternaire
 * (indétermination structurelle) est portée par `determinesEffectifs` ci-dessous, PAS ici — cette
 * fonction reste responsable uniquement de la VALEUR concrète stockée (qui doit rester un
 * `CriteriaValue` réel, cf. décision de conception actée : `Criteria` ne change pas). Elle bénéficie
 * malgré tout du garde-fou « jamais Infinity/NaN » via `evaluerDerive`/`evaluerDeriveNombre` (toujours
 * actif, non conditionné à `renseignes`, cf. leurs docstrings) : c'est ce qui fait bouger
 * `banc/caracterisation.test.ts` même sans qu'aucun appelant ne passe encore `renseignes` (aucun ne le
 * fait dans ce lot, cf. périmètre de tâche).
 */
export function calculerCriteresDerives(criteres: CritereEntree[], criteria: Criteria): Criteria {
  const resultat: Criteria = { ...criteria }
  for (const critere of criteres) {
    if (critere.derive) {
      resultat[critere.nom] =
        critere.type === 'nombre'
          ? evaluerDeriveNombre(critere.derive, criteria)
          : (evaluerDerive(critere.derive, criteria) as CriteriaValue)
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
 * 2. les critères DÉRIVÉS dont l'expression `derive` s'évalue à une valeur RÉELLE (jamais `INDETERMINE`)
 *    sur les PRIMITIFS déterminés à l'étape 1 — un seul passage suffit, aucun `derive` de ce contenu ne
 *    référence un autre `derive` (cf. docstring `calculerCriteresDerives` : « pas les uns des autres »).
 *    « Valeur réelle » se lit selon le `type` DÉCLARÉ du dérivé (T-133, P12/S8) : un booléen réel pour
 *    tout type autre que `nombre` (`evaluerDeriveTernaire`), une VALEUR NUMÉRIQUE calculable pour
 *    `type: nombre` (`evaluerNombre`, MÊME fonction — et donc MÊME garde-fou division-par-zéro — que
 *    `calculsAffiches`/`Option.calculs` réutilise déjà). C'EST CE BRANCHEMENT qui porte toute la
 *    propagation D20 pour un dérivé numérique : si `poids` est absent de `primitifs` (non renseigné),
 *    `evaluerNombre('poids / taille / taille', …, primitifs)` renvoie `null` (opérande INDÉTERMINÉ, cf.
 *    `resoudreArithTernaire`) → l'IMC n'entre PAS dans `effectifs` → toute condition qui le lit
 *    (`IMC >= 30`) est évaluée par `evaluateCondition` avec un `renseignes` qui ne le contient pas →
 *    `INDETERMINE`, jamais `false` sur la valeur de repli `0` posée par `calculerCriteresDerives`.
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
    const determine =
      critere.type === 'nombre'
        ? evaluerNombre(critere.derive, criteria, primitifs) !== null
        : evaluerDeriveTernaire(critere.derive, criteria, primitifs) !== INDETERMINE
    if (determine) effectifs.add(critere.nom)
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
