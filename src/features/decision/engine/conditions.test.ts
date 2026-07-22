/**
 * Tests unitaires du tokenizer/évaluateur générique (`conditions.ts`). Volontairement indépendants
 * de tout nœud réel : ce module ne connaît aucun domaine/nœud par son nom (DECISIONS.md D8), les
 * critères ci-dessous sont des exemples synthétiques choisis pour couvrir la sémantique du DSL.
 */
import { describe, expect, it } from 'vitest'
import { ConditionError, evaluateCondition } from './conditions.ts'

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
