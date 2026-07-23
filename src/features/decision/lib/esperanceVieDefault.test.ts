import { describe, expect, it } from 'vitest'
import { hasEsperanceVieCritere, suggestEsperanceVie } from './esperanceVieDefault'

describe('suggestEsperanceVie', () => {
  it('suggère "longue" pour un adulte jeune sans facteur de gravité', () => {
    expect(suggestEsperanceVie({ age: 45, fragilite: false, comorbidite_grave: false, antecedent_cv: false })).toBe(
      'longue',
    )
  })

  it('suggère "limitee" dès que comorbidite_grave est vraie, quel que soit l’âge', () => {
    expect(suggestEsperanceVie({ age: 40, fragilite: false, comorbidite_grave: true, antecedent_cv: false })).toBe(
      'limitee',
    )
  })

  it('dégrade d’un palier par facteur de gravité (fragilité, antécédent CV)', () => {
    expect(suggestEsperanceVie({ age: 45, fragilite: true, comorbidite_grave: false, antecedent_cv: false })).toBe(
      'intermediaire',
    )
    expect(suggestEsperanceVie({ age: 45, fragilite: true, comorbidite_grave: false, antecedent_cv: true })).toBe(
      'limitee',
    )
  })

  it('utilise des paliers d’âge par défaut (75 ans, 90 ans)', () => {
    expect(suggestEsperanceVie({ age: 80, fragilite: false, comorbidite_grave: false, antecedent_cv: false })).toBe(
      'intermediaire',
    )
    expect(suggestEsperanceVie({ age: 95, fragilite: false, comorbidite_grave: false, antecedent_cv: false })).toBe(
      'limitee',
    )
  })

  it('ne descend jamais sous "limitee"', () => {
    expect(suggestEsperanceVie({ age: 95, fragilite: true, comorbidite_grave: false, antecedent_cv: true })).toBe(
      'limitee',
    )
  })
})

describe('hasEsperanceVieCritere', () => {
  it('reconnaît un critère esperance_vie à 3 valeurs', () => {
    expect(
      hasEsperanceVieCritere([{ nom: 'esperance_vie', type: 'enum', valeurs: ['longue', 'intermediaire', 'limitee'] }]),
    ).toBe(true)
  })

  it('rejette un nœud sans ce critère (générique, D8)', () => {
    expect(hasEsperanceVieCritere([{ nom: 'age', type: 'nombre' }])).toBe(false)
  })
})
