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
 *
 * ÉVALUATION TERNAIRE (DECISIONS.md D20, `docs/decision/validation/chantier-2026-07-26/
 * SPEC-valeur-indeterminee.md` §2) : `evaluateCondition`/`evaluateAtomic` acceptent un troisième
 * paramètre optionnel `renseignes: ReadonlySet<string>` — l'ensemble des noms de critères à traiter
 * comme DÉTERMINÉS pour cette évaluation. Absent (`undefined`) ⇒ repli « tout est renseigné » :
 * comportement RIGOUREUSEMENT IDENTIQUE à avant ce champ (aucune fonction ternaire ne renvoie jamais
 * `INDETERMINE`), condition nécessaire pour que la suite existante et les bancs continuent de tourner
 * sans réécriture. Une variable absente de `renseignes` (quand il est fourni) rend l'atome qui la cite
 * `INDETERMINE`, qui se propage dans la composition AND/OR (cf. `ternaryAll`/`ternaryAny` ci-dessous,
 * table SPEC §2.3).
 *
 * `renseignes`, à CE niveau, est déjà l'ensemble EFFECTIF des noms déterminés — pas nécessairement le
 * `touched` brut de l'écran : `evaluateAtomic` ne connaît pas le TYPE déclaré d'un critère (`nombre` vs
 * `bool`…), donc pas la règle de détermination par type (SPEC §2.2, `bool`/`liste` restent déterminés
 * par défaut sauf `confirmation_requise`). C'est aux appelants qui connaissent `CritereEntree[]`
 * (`engine/deriveCritere.ts` `determinesEffectifs`, consommé par `evaluateNode.ts`/`lib/formLayout.ts`)
 * de construire ce `renseignes` effectif avant d'atteindre ce module — qui reste, lui, générique et
 * sans connaissance de type (comme le reste de ce fichier, D8).
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
 * Sentinelle du TROISIÈME état (DECISIONS.md D20) : une évaluation ternaire n'est jamais stockée dans
 * un `CriteriaValue` (qui ne change pas, cf. décision de conception actée) — uniquement une valeur de
 * RETOUR d'évaluation, jamais persistée dans `Criteria`.
 */
export const INDETERMINE = 'indetermine' as const

/** Résultat d'une évaluation ternaire : vrai, faux, ou `INDETERMINE` (SPEC §2.3). */
export type Ternaire = boolean | typeof INDETERMINE

/**
 * Composition ternaire `AND` (SPEC §2.3) : `faux` l'emporte toujours (même sur un `indetermine`
 * ailleurs dans la conjonction — « faux AND indéterminé = faux »), sinon un `indetermine` l'emporte sur
 * `vrai`, sinon tout est vrai. Généralisée à N opérandes (`option.conditions`/`prerequis` sont des
 * tableaux implicitement en ET) ; `[]` ⇒ `true` (vérité vacante, comme l'ancien `.every()`).
 */
export function ternaryAll(valeurs: Ternaire[]): Ternaire {
  if (valeurs.some((v) => v === false)) return false
  if (valeurs.some((v) => v === INDETERMINE)) return INDETERMINE
  return true
}

/**
 * Composition ternaire `OR` (SPEC §2.3) : `vrai` l'emporte toujours — propriété DÉCISIVE qui limite le
 * mutisme (§2.3 : « une disjonction dont une branche est vraie reste vraie ») — sinon un `indetermine`
 * l'emporte sur `faux`, sinon tout est faux. Généralisée à N opérandes (`option.exclusions` : « au
 * moins une vraie » ; les termes `OR` d'une expression) ; `[]` ⇒ `false` (comme l'ancien `.some()`).
 */
export function ternaryAny(valeurs: Ternaire[]): Ternaire {
  if (valeurs.some((v) => v === true)) return true
  if (valeurs.some((v) => v === INDETERMINE)) return INDETERMINE
  return false
}

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

function evaluateAtomic(text: string, criteria: Criteria, renseignes?: ReadonlySet<string>): Ternaire {
  const trimmed = text.trim()

  // Appartenance à une liste (`contient` / `ne_contient_pas`) : traitée en premier, elle est la
  // seule forme opérant sur un critère de type `liste` (valeur = tableau de libellés).
  const membership = MEMBERSHIP_RE.exec(trimmed)
  if (membership) {
    const [, variable, operator, rawValue] = membership
    if (!(variable in criteria)) {
      throw new ConditionError(`Variable de critère inconnue : "${variable}".`)
    }
    // Variable de critère inconnue : toujours une erreur, avant toute question de détermination
    // (D20 ne change rien à cet invariant, brief §7 « aucun score caché »).
    if (renseignes !== undefined && !renseignes.has(variable)) return INDETERMINE
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
  if (renseignes !== undefined && !renseignes.has(variable)) return INDETERMINE
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
 *
 * `renseignes` (optionnel, D20) : composition TERNAIRE (`ternaryAll`/`ternaryAny` ci-dessus), pas
 * simplement `.every()`/`.some()` — un `AND` reste `faux` dès qu'un terme est `faux`, même si un autre
 * est `indetermine` ; un `OR` reste `vrai` dès qu'un terme est `vrai`. Absent ⇒ repli booléen strict
 * (comportement identique à avant ce paramètre, cf. docstring de tête du fichier).
 */
export function evaluateCondition(
  expression: string,
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): Ternaire {
  const orTerms = splitTopLevel(expression, 'OR')
  // COURT-CIRCUIT explicite (boucles, pas `ternaryAll`/`ternaryAny` sur un tableau déjà évalué) :
  // essentiel pour ne RIEN changer au comportement historique quand `renseignes` est absent — l'ancien
  // `orTerms.some(andTerms.every(...))` s'arrêtait au premier terme `OR` PLEINEMENT vrai (jamais
  // n'évaluait les suivants) et au premier atome `AND` FAUX (jamais les suivants). Une composition
  // ternaire NAÏVE (`.map()` intégral puis `ternaryAll`/`ternaryAny`) évaluerait TOUJOURS tous les
  // atomes, y compris ceux qu'un contenu réel laisse volontairement inatteignables derrière un terme
  // décisif plus tôt — risque de `ConditionError` NOUVELLE sur une expression jamais réellement
  // rencontrée avant ce chantier.
  let disjonctionIndeterminee = false
  for (const orTerm of orTerms) {
    const andTerms = splitTopLevel(orTerm, 'AND')
    let conjonctionIndeterminee = false
    let conjonctionFausse = false
    for (const atomic of andTerms) {
      const valeur = evaluateAtomic(atomic, criteria, renseignes)
      if (valeur === false) {
        conjonctionFausse = true
        break // court-circuit AND : `faux` l'emporte, inutile d'évaluer les atomes suivants.
      }
      if (valeur === INDETERMINE) conjonctionIndeterminee = true
    }
    if (conjonctionFausse) continue
    if (!conjonctionIndeterminee) return true // conjonction pleinement vraie → court-circuit OR.
    disjonctionIndeterminee = true
  }
  return disjonctionIndeterminee ? INDETERMINE : false
}

/**
 * Atomes RESPONSABLES de l'indétermination de `expression` : les comparaisons élémentaires qui valent
 * `INDETERMINE` **et qui peuvent encore changer le verdict**. Vide si l'expression est déjà tranchée
 * (`true` ou `false`).
 *
 * POURQUOI CETTE FONCTION EXISTE — le défaut G, moitié résiduelle (recette visuelle du 2026-07-27,
 * écart 2). `evaluateNode.criteresManquants` construisait la liste « à renseigner : … » en lisant
 * l'expression ENTIÈRE, sans regarder quels termes `OR` étaient déjà FAUX. Sur `prescription`, option
 * « Réduire la posologie de la metformine » :
 *
 *     DFG >= 45 AND DFG < 60 AND dose_metformine > 2000
 *  OR DFG >= 30 AND DFG < 45 AND dose_metformine > 1000
 *  OR intolerance_traitement == true AND nature_intolerance == digestive
 *
 * un patient à DFG 45 ayant répondu « pas d'intolérance » laisse le 1ᵉʳ terme INDÉTERMINÉ (dose non
 * saisie) et les deux autres FAUX. L'option part donc légitimement en attente — mais l'écran réclamait
 * `dose_metformine` ET `nature_intolerance`, or `nature_intolerance` est masqué derrière
 * `visible_si: "intolerance_traitement == true"` : **le praticien lisait une demande qu'aucun champ de
 * l'écran ne permettait de satisfaire**. Le lot 1 avait corrigé l'ÉVALUATION (garde R8 ajouté au
 * contenu, le terme court-circuite bien à faux) sans corriger le NOMMAGE, qui l'ignorait.
 *
 * Ne retenir que les atomes des termes `OR` non encore faux rend la liste ACTIONNABLE par construction :
 * tout critère cité y modifie réellement le verdict s'il est renseigné. C'est ce que l'invariant I11
 * (`banc/impasse.test.ts`) vérifie désormais sur les six nœuds.
 *
 * COURT-CIRCUIT REPRODUIT À L'IDENTIQUE de `evaluateCondition` ci-dessus (même boucle, même `break` sur
 * le premier atome faux) — et pour la même raison, qui n'est pas la performance : un contenu réel laisse
 * volontairement des atomes inatteignables derrière un terme décisif plus tôt (`dose_metformine > 2000`
 * n'a de sens qu'une fois le DFG dans la bande). Les évaluer tous lèverait des `ConditionError`
 * nouvelles sur des expressions que le moteur n'a jamais réellement rencontrées.
 */
export function atomesIndetermines(
  expression: string,
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): string[] {
  const responsables: string[] = []
  for (const orTerm of splitTopLevel(expression, 'OR')) {
    const indetermines: string[] = []
    let conjonctionFausse = false
    for (const atomic of splitTopLevel(orTerm, 'AND')) {
      const valeur = evaluateAtomic(atomic, criteria, renseignes)
      if (valeur === false) {
        conjonctionFausse = true
        break
      }
      if (valeur === INDETERMINE) indetermines.push(atomic)
    }
    if (conjonctionFausse) continue
    // Conjonction pleinement vraie ⇒ `evaluateCondition` renverrait `true` : l'expression est tranchée,
    // il n'y a RIEN à renseigner — y compris ce qu'un terme `OR` précédent aurait laissé indéterminé.
    if (indetermines.length === 0) return []
    responsables.push(...indetermines)
  }
  return responsables
}

/**
 * Termes `OR` de `expression` réellement VRAIS pour ces critères (`docs/decision/GRAMMAIRE-NOEUD.md`,
 * R6 : « l'argumentaire est situationnel, jamais encyclopédique »). Le DSL n'a pas de parenthèses et
 * `AND` est prioritaire sur `OR` (docstring de tête de ce fichier) : toute expression est donc une
 * DISJONCTION DE CONJONCTIONS, et découper sur `OR` est EXACT, jamais une approximation.
 *
 * Réutilise `evaluateCondition` sur CHAQUE terme plutôt qu'un second tokeniseur : un terme `OR` est par
 * construction une conjonction SANS `OR` interne, donc l'évaluer seul via `evaluateCondition` est
 * strictement équivalent à évaluer sa conjonction de `AND` — c'est la seule façon de garantir que ce qui
 * est renvoyé ici est exactement ce que le moteur a évalué pour sélectionner l'option (même défaut que
 * le formateur `describeReasons` avant ce correctif, qui retokenisait de son côté et avait laissé passer
 * la fuite `ne_contient_pas`).
 *
 * Ne gère PAS les sentinelles `"default"` (D11) / `"toujours"` (D16) : comme `evaluateCondition`, cette
 * fonction ne reçoit que des expressions de comparaison réelles — c'est à l'appelant (`lib/vueDecision.ts`)
 * de les traiter en amont, avant tout appel à `termesVrais`.
 *
 * N'accepte pas de `renseignes` (D20) : appelée UNIQUEMENT sur les options déjà `applicable`
 * (`lib/vueDecision.ts` `raisonsSituationnelles`), dont `evaluateNode` a par construction déjà écarté
 * toute indétermination (une option indéterminée sur ses `conditions` part dans `enAttente`, jamais
 * `applicable`) — `evaluateCondition` ne peut donc jamais y renvoyer `INDETERMINE`. Le filtre compare
 * explicitement `=== true` (et non la troncature booléenne d'avant ce champ) pour rester correct même
 * si `evaluateCondition` renvoie désormais un type élargi (`Ternaire`, jamais `INDETERMINE` ici en
 * pratique, mais une chaîne non vide serait sinon vue « vraie » par un simple `if`).
 */
export function termesVrais(expression: string, criteria: Criteria): string[] {
  return splitTopLevel(expression, 'OR').filter((terme) => evaluateCondition(terme, criteria) === true)
}
