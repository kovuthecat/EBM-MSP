/**
 * Tests unitaires du tokenizer/évaluateur générique (`conditions.ts`). Volontairement indépendants
 * de tout nœud réel : ce module ne connaît aucun domaine/nœud par son nom (DECISIONS.md D8), les
 * critères ci-dessous sont des exemples synthétiques choisis pour couvrir la sémantique du DSL.
 */
import { describe, expect, it } from 'vitest'
import { ConditionError, INDETERMINE, evaluateCondition, termesVrais, ternaryAll, ternaryAny } from './conditions.ts'

describe('evaluateCondition — comparaisons atomiques', () => {
  it('compare un nombre avec chaque opérateur', () => {
    const criteria = { age: 65 }
    expect(evaluateCondition('age < 70', criteria)).toBe(true)
    expect(evaluateCondition('age < 60', criteria)).toBe(false)
    expect(evaluateCondition('age <= 65', criteria)).toBe(true)
    expect(evaluateCondition('age > 60', criteria)).toBe(true)
    expect(evaluateCondition('age >= 65', criteria)).toBe(true)
    expect(evaluateCondition('age == 65', criteria)).toBe(true)
    expect(evaluateCondition('age != 65', criteria)).toBe(false)
  })

  it('compare un booléen avec == et !=', () => {
    const criteria = { fragilite: true }
    expect(evaluateCondition('fragilite == true', criteria)).toBe(true)
    expect(evaluateCondition('fragilite != true', criteria)).toBe(false)
    expect(evaluateCondition('fragilite == false', criteria)).toBe(false)
  })

  it('compare une énumération/texte avec == et !=', () => {
    const criteria = { esperance_vie: 'longue' }
    expect(evaluateCondition('esperance_vie == longue', criteria)).toBe(true)
    expect(evaluateCondition('esperance_vie == limitee', criteria)).toBe(false)
    expect(evaluateCondition('esperance_vie != limitee', criteria)).toBe(true)
  })

  it('rejette un opérateur d\'ordre sur un booléen', () => {
    expect(() => evaluateCondition('fragilite < true', { fragilite: true })).toThrow(ConditionError)
  })

  it('rejette un opérateur d\'ordre sur une énumération/texte', () => {
    expect(() => evaluateCondition('esperance_vie >= longue', { esperance_vie: 'longue' })).toThrow(
      ConditionError,
    )
  })

  it('rejette une valeur booléenne mal formée', () => {
    expect(() => evaluateCondition('fragilite == oui', { fragilite: true })).toThrow(ConditionError)
  })

  it('rejette une valeur numérique mal formée', () => {
    expect(() => evaluateCondition('age < abc', { age: 10 })).toThrow(ConditionError)
  })

  it('rejette une variable de critère inconnue (erreur explicite, pas un faux silencieux)', () => {
    expect(() => evaluateCondition('poids < 80', { age: 10 })).toThrow(ConditionError)
    expect(() => evaluateCondition('poids < 80', { age: 10 })).toThrow(/poids/)
  })

  it('rejette une expression qui ne correspond à aucune forme reconnue', () => {
    expect(() => evaluateCondition('n\'importe quoi', { age: 10 })).toThrow(ConditionError)
  })
})

describe('evaluateCondition — composition AND / OR', () => {
  it('AND : vrai seulement si toutes les comparaisons sont vraies', () => {
    const criteria = { fragilite: true, esperance_vie: 'limitee' }
    expect(evaluateCondition('fragilite == true AND esperance_vie == limitee', criteria)).toBe(true)
    expect(
      evaluateCondition('fragilite == true AND esperance_vie == longue', criteria),
    ).toBe(false)
  })

  it('OR : vrai si au moins une comparaison est vraie', () => {
    const criteria = { age: 40, fragilite: false, risque_hypoglycemie_schema: 'eleve', esperance_vie: 'longue' }
    expect(
      evaluateCondition(
        'age >= 75 OR fragilite == true OR risque_hypoglycemie_schema == eleve OR esperance_vie == limitee',
        criteria,
      ),
    ).toBe(true)
    expect(
      evaluateCondition(
        'age >= 75 OR fragilite == true OR esperance_vie == limitee',
        criteria,
      ),
    ).toBe(false)
  })

  it('AND est prioritaire sur OR (pas de parenthèses nécessaires)', () => {
    // "a OR b AND c" doit se lire "a OR (b AND c)", jamais "(a OR b) AND c".
    const criteria = { a: false, b: true, c: false }
    // a=false, b AND c = true AND false = false -> global false
    expect(evaluateCondition('a == true OR b == true AND c == true', criteria)).toBe(false)
    // si c devient vrai : a=false OR (b AND c = true) -> true
    expect(evaluateCondition('a == true OR b == true AND c == true', { a: false, b: true, c: true })).toBe(
      true,
    )
  })
})

describe('evaluateCondition — appartenance à une liste (contient / ne_contient_pas, D13)', () => {
  it('contient : vrai si le libellé est présent dans la liste', () => {
    const criteria = { traitements_en_cours: ['metformine', 'iSGLT2'] }
    expect(evaluateCondition('traitements_en_cours contient metformine', criteria)).toBe(true)
    expect(evaluateCondition('traitements_en_cours contient aGLP1', criteria)).toBe(false)
  })

  it('ne_contient_pas : négation exacte de contient', () => {
    const criteria = { traitements_en_cours: ['metformine'] }
    expect(evaluateCondition('traitements_en_cours ne_contient_pas aGLP1', criteria)).toBe(true)
    expect(evaluateCondition('traitements_en_cours ne_contient_pas metformine', criteria)).toBe(false)
  })

  it('liste vide : contient toujours faux, ne_contient_pas toujours vrai', () => {
    const criteria = { traitements_en_cours: [] as string[] }
    expect(evaluateCondition('traitements_en_cours contient metformine', criteria)).toBe(false)
    expect(evaluateCondition('traitements_en_cours ne_contient_pas metformine', criteria)).toBe(true)
  })

  it('se compose avec AND / OR comme les comparaisons scalaires', () => {
    const criteria = { traitements_en_cours: ['metformine'], DFG: 45 }
    expect(evaluateCondition('traitements_en_cours contient metformine AND DFG < 60', criteria)).toBe(true)
    expect(evaluateCondition('traitements_en_cours ne_contient_pas aGLP1 AND DFG < 40', criteria)).toBe(false)
    expect(evaluateCondition('traitements_en_cours contient aGLP1 OR DFG < 60', criteria)).toBe(true)
  })

  it('contient sur un critère non-liste → ConditionError (jamais un faux silencieux)', () => {
    expect(() => evaluateCondition('age contient 5', { age: 60 })).toThrow(ConditionError)
  })

  it('opérateur scalaire sur un critère de type liste → ConditionError', () => {
    expect(() =>
      evaluateCondition('traitements_en_cours == metformine', { traitements_en_cours: ['metformine'] }),
    ).toThrow(ConditionError)
    expect(() =>
      evaluateCondition('traitements_en_cours < 3', { traitements_en_cours: ['metformine'] }),
    ).toThrow(ConditionError)
  })

  it('variable inconnue avec contient → ConditionError explicite (nom cité)', () => {
    expect(() => evaluateCondition('traitements contient metformine', { age: 1 })).toThrow(/traitements/)
  })
})

describe('evaluateCondition — expressions malformées : lever, jamais un faux silencieux (D13)', () => {
  it('rejette une expression vide ou uniquement blanche', () => {
    expect(() => evaluateCondition('', { age: 1 })).toThrow(ConditionError)
    expect(() => evaluateCondition('   ', { age: 1 })).toThrow(ConditionError)
  })

  it('rejette un opérateur OR pendant (opérande manquante en tête ou en queue)', () => {
    expect(() => evaluateCondition(' OR age > 0', { age: 1 })).toThrow(ConditionError)
    expect(() => evaluateCondition('age > 0 OR ', { age: 1 })).toThrow(ConditionError)
  })

  it('rejette un opérateur AND pendant', () => {
    expect(() => evaluateCondition('age > 0 AND ', { age: 1 })).toThrow(ConditionError)
    expect(() => evaluateCondition(' AND age > 0', { age: 1 })).toThrow(ConditionError)
  })

  it('une expression bien formée n’est pas affectée par le garde', () => {
    expect(evaluateCondition('age > 0 OR age < -5', { age: 3 })).toBe(true)
    expect(evaluateCondition('age > 0 AND age < 10', { age: 3 })).toBe(true)
  })
})

describe('termesVrais — termes OR réellement vrais (R6, docs/decision/GRAMMAIRE-NOEUD.md)', () => {
  // Expression à 3 termes OR (ex. proche de l'option iSGLT2 réelle), un seul vrai pour ce patient.
  const expr = 'insuffisance_cardiaque == true OR DFG < 60 OR ASCVD_etablie == true'

  it('un seul terme OR vrai parmi plusieurs → un seul motif renvoyé (pas les autres, même syntaxiquement présents)', () => {
    const criteria = { insuffisance_cardiaque: false, DFG: 80, ASCVD_etablie: true }
    expect(termesVrais(expr, criteria)).toEqual(['ASCVD_etablie == true'])
  })

  it('plusieurs termes OR vrais → TOUS renvoyés (le patient cumule les indications, information clinique)', () => {
    const criteria = { insuffisance_cardiaque: true, DFG: 45, ASCVD_etablie: true }
    expect(termesVrais(expr, criteria)).toEqual([
      'insuffisance_cardiaque == true',
      'DFG < 60',
      'ASCVD_etablie == true',
    ])
  })

  it('aucun terme vrai → tableau vide (jamais l’énumération complète des cas possibles)', () => {
    const criteria = { insuffisance_cardiaque: false, DFG: 80, ASCVD_etablie: false }
    expect(termesVrais(expr, criteria)).toEqual([])
  })

  it('un terme est une conjonction AND : renvoyé ENTIER s’il est vrai, absent s’il est faux (jamais scindé)', () => {
    const criteria = { fragilite: true, esperance_vie: 'limitee' }
    expect(termesVrais('fragilite == true AND esperance_vie == limitee', criteria)).toEqual([
      'fragilite == true AND esperance_vie == limitee',
    ])
    expect(termesVrais('fragilite == true AND esperance_vie == longue', criteria)).toEqual([])
  })

  it('expression sans OR (un seul terme atomique) : renvoie ce terme si vrai, tableau vide sinon', () => {
    expect(termesVrais('age >= 75', { age: 80 })).toEqual(['age >= 75'])
    expect(termesVrais('age >= 75', { age: 10 })).toEqual([])
  })

  it('réutilise evaluateCondition (pas de second tokeniseur) : propage ConditionError, jamais un faux silencieux', () => {
    expect(() => termesVrais('poids < 80', { age: 10 })).toThrow(ConditionError)
    expect(() => termesVrais('n\'importe quoi', { age: 10 })).toThrow(ConditionError)
  })
})

describe('ternaryAll / ternaryAny — table de composition (DECISIONS.md D20, SPEC §2.3)', () => {
  it('ternaryAll : faux l’emporte toujours, même sur un indéterminé ailleurs (« faux AND indéterminé = faux »)', () => {
    expect(ternaryAll([false, INDETERMINE])).toBe(false)
    expect(ternaryAll([INDETERMINE, false])).toBe(false)
  })
  it('ternaryAll : indéterminé si aucun faux mais au moins un indéterminé (« vrai AND indéterminé = indéterminé »)', () => {
    expect(ternaryAll([true, INDETERMINE])).toBe(INDETERMINE)
    expect(ternaryAll([INDETERMINE, INDETERMINE])).toBe(INDETERMINE)
  })
  it('ternaryAll : vrai seulement si tout est vrai ; [] vaut vrai (vérité vacante, comme .every())', () => {
    expect(ternaryAll([true, true])).toBe(true)
    expect(ternaryAll([])).toBe(true)
  })
  it('ternaryAny : vrai l’emporte toujours, même sur un indéterminé ailleurs (« vrai OR indéterminé = vrai »)', () => {
    expect(ternaryAny([true, INDETERMINE])).toBe(true)
    expect(ternaryAny([INDETERMINE, true])).toBe(true)
  })
  it('ternaryAny : indéterminé si aucun vrai mais au moins un indéterminé (« faux OR indéterminé = indéterminé »)', () => {
    expect(ternaryAny([false, INDETERMINE])).toBe(INDETERMINE)
    expect(ternaryAny([INDETERMINE, INDETERMINE])).toBe(INDETERMINE)
  })
  it('ternaryAny : faux seulement si tout est faux ; [] vaut faux (comme .some() sur [])', () => {
    expect(ternaryAny([false, false])).toBe(false)
    expect(ternaryAny([])).toBe(false)
  })
})

describe('evaluateCondition — ternaire (DECISIONS.md D20, SPEC-valeur-indeterminee.md §2)', () => {
  it('renseignes absent (repli) : comportement booléen strict inchangé, jamais INDETERMINE', () => {
    expect(evaluateCondition('age < 70', { age: 65 })).toBe(true)
    expect(evaluateCondition('age < 70', { age: 80 })).toBe(false)
  })

  it('une variable absente de `renseignes` rend l’atome qui la cite INDETERMINE', () => {
    expect(evaluateCondition('age < 70', { age: 65 }, new Set())).toBe(INDETERMINE)
  })

  it('une variable présente dans `renseignes` s’évalue normalement (booléen réel)', () => {
    expect(evaluateCondition('age < 70', { age: 65 }, new Set(['age']))).toBe(true)
    expect(evaluateCondition('age < 70', { age: 80 }, new Set(['age']))).toBe(false)
  })

  it('appartenance à une liste (contient/ne_contient_pas) : indéterminée si la variable n’est pas renseignée', () => {
    const criteria = { traitements_en_cours: ['metformine'] }
    expect(evaluateCondition('traitements_en_cours contient metformine', criteria, new Set())).toBe(INDETERMINE)
    expect(
      evaluateCondition('traitements_en_cours contient metformine', criteria, new Set(['traitements_en_cours'])),
    ).toBe(true)
  })

  it('une variable de critère INCONNUE lève toujours, `renseignes` fourni ou non (invariant préservé, brief §7)', () => {
    expect(() => evaluateCondition('poids < 80', { age: 10 }, new Set())).toThrow(ConditionError)
    expect(() => evaluateCondition('poids < 80', { age: 10 }, new Set(['age']))).toThrow(ConditionError)
  })

  it('AND (une seule condition) : faux AND indéterminé = faux', () => {
    const criteria = { fragilite: true, esperance_vie: 'limitee' }
    // esperance_vie non renseignée → indéterminée ; fragilite renseignée et vraie ne suffit pas à
    // sauver la conjonction, mais ICI c'est fragilite qui devient fausse pour tester le cas « faux ».
    expect(
      evaluateCondition('fragilite == false AND esperance_vie == limitee', criteria, new Set(['fragilite'])),
    ).toBe(false)
  })

  it('AND : vrai AND indéterminé = indéterminé (aucun terme faux, un terme indéterminé)', () => {
    const criteria = { fragilite: true, esperance_vie: 'limitee' }
    expect(
      evaluateCondition('fragilite == true AND esperance_vie == limitee', criteria, new Set(['fragilite'])),
    ).toBe(INDETERMINE)
  })

  it('PROPRIÉTÉ DE NON-MUTISME (SPEC §2.3, le test le plus important du point 1) : une disjonction de ' +
    'conjonctions reste VRAIE si UNE conjonction est pleinement vraie, même si une AUTRE branche est ' +
    'indéterminée — quelle que soit la position (avant ou après) de la branche vraie', () => {
    // Cas canonique de la spec : "DFG < 60 OR ASCVD_etablie == true", DFG inconnu, ASCVD cochée → vrai.
    const criteria1 = { DFG: 999, ASCVD_etablie: true }
    expect(evaluateCondition('DFG < 60 OR ASCVD_etablie == true', criteria1, new Set(['ASCVD_etablie']))).toBe(
      true,
    )

    // Branche vraie APRÈS la branche indéterminée (le DSL n'a pas de parenthèses, AND prime sur OR :
    // toute expression est une disjonction de conjonctions, cf. docstring de tête de conditions.ts).
    // `a` est VRAI et renseigné (pas faux) : la conjonction "a AND b" est bien INDÉTERMINÉE (à cause de
    // `b`, non renseigné), pas triviallement fausse à cause de `a` — condition nécessaire pour que ce
    // test exerce réellement le mutisme, pas un simple court-circuit AND sur un premier atome faux.
    const criteria2 = { a: true, b: true, c: true }
    expect(
      evaluateCondition('a == true AND b == true OR c == true', criteria2, new Set(['a', 'c'])),
    ).toBe(true) // (a AND b) = indéterminé (b non renseigné) OR (c == true) = vrai → vrai

    // Branche vraie AVANT la branche indéterminée.
    expect(
      evaluateCondition('c == true OR a == true AND b == true', criteria2, new Set(['a', 'c'])),
    ).toBe(true)

    // Sans la branche vraie (c devient fausse), la même expression devient franchement indéterminée —
    // pas de mutisme feint en faux : `a AND b` reste indéterminée (b non renseigné), `c` est fausse.
    const criteria3 = { a: true, b: true, c: false }
    expect(
      evaluateCondition('a == true AND b == true OR c == true', criteria3, new Set(['a', 'c'])),
    ).toBe(INDETERMINE)
  })

  it('court-circuit préservé (renseignes absent) : un terme jamais atteint après une branche décisive ' +
    'plus tôt ne lève pas, même s’il référence une variable inconnue — comportement historique ' +
    'rigoureusement inchangé (aucune évaluation eager nouvelle introduite par la ternarité)', () => {
    // AND : le premier atome est faux → le second (variable inconnue) n'est jamais évalué.
    expect(evaluateCondition('age == 999 AND variable_inexistante == true', { age: 10 })).toBe(false)
    // OR : le premier terme est pleinement vrai → le second (variable inconnue) n'est jamais évalué.
    expect(evaluateCondition('age == 10 OR variable_inexistante == true', { age: 10 })).toBe(true)
  })
})
