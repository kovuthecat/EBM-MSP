import { describe, expect, it } from 'vitest'
import type { CritereEntree } from '../content/node.types'
import { ConditionError, type Criteria } from './conditions'
import { calculerCriteresDerives, criteresReferences, evaluerDerive, evaluerNombre } from './deriveCritere'

describe('evaluerDerive — grammaire de dérivation', () => {
  it('compare deux variables (cible_atteinte)', () => {
    expect(evaluerDerive('HbA1c_actuelle <= HbA1c_cible', { HbA1c_actuelle: 7, HbA1c_cible: 7.5 })).toBe(true)
    expect(evaluerDerive('HbA1c_actuelle <= HbA1c_cible', { HbA1c_actuelle: 8, HbA1c_cible: 7 })).toBe(false)
  })

  it('évalue une expression arithmétique (over_basalisation = dose/poids > 0.5)', () => {
    expect(evaluerDerive('dose_basale_actuelle / poids > 0.5', { dose_basale_actuelle: 50, poids: 80 })).toBe(true) // 0.625
    expect(evaluerDerive('dose_basale_actuelle / poids > 0.5', { dose_basale_actuelle: 30, poids: 80 })).toBe(false) // 0.375
  })

  it('OR de bool nu et de comparaisons (terrain_fragile)', () => {
    const expr = 'fragilite OR esperance_vie == limitee OR age >= 75 OR risque_hypoglycemie_schema == eleve'
    expect(evaluerDerive(expr, { fragilite: false, esperance_vie: 'longue', age: 60, risque_hypoglycemie_schema: 'faible' })).toBe(false)
    expect(evaluerDerive(expr, { fragilite: true, esperance_vie: 'longue', age: 60, risque_hypoglycemie_schema: 'faible' })).toBe(true)
    expect(evaluerDerive(expr, { fragilite: false, esperance_vie: 'limitee', age: 60, risque_hypoglycemie_schema: 'faible' })).toBe(true)
    expect(evaluerDerive(expr, { fragilite: false, esperance_vie: 'longue', age: 80, risque_hypoglycemie_schema: 'faible' })).toBe(true)
    expect(evaluerDerive(expr, { fragilite: false, esperance_vie: 'longue', age: 60, risque_hypoglycemie_schema: 'eleve' })).toBe(true)
  })

  it('AND (gaj_a_cible = GAJ dans [0.7, 1.2])', () => {
    expect(evaluerDerive('GAJ >= 0.7 AND GAJ <= 1.2', { GAJ: 1.0 })).toBe(true)
    expect(evaluerDerive('GAJ >= 0.7 AND GAJ <= 1.2', { GAJ: 1.5 })).toBe(false)
    expect(evaluerDerive('GAJ >= 0.7 AND GAJ <= 1.2', { GAJ: 0.5 })).toBe(false)
  })

  it('lève sur expression vide ou terme non booléen', () => {
    expect(() => evaluerDerive('', {})).toThrow(ConditionError)
    expect(() => evaluerDerive('age', { age: 60 })).toThrow(ConditionError) // nombre nu, pas un booléen
  })
})

describe('calculerCriteresDerives', () => {
  const criteres: CritereEntree[] = [
    { nom: 'HbA1c_actuelle', type: 'nombre' },
    { nom: 'HbA1c_cible', type: 'nombre' },
    { nom: 'cible_atteinte', type: 'bool', derive: 'HbA1c_actuelle <= HbA1c_cible' },
    { nom: 'fragilite', type: 'bool' },
  ]

  it('injecte la valeur dérivée, laisse les primitives intactes', () => {
    const entree: Criteria = { HbA1c_actuelle: 7, HbA1c_cible: 8, cible_atteinte: false, fragilite: true }
    const out = calculerCriteresDerives(criteres, entree)
    expect(out.cible_atteinte).toBe(true) // recalculé (7 <= 8)
    expect(out.fragilite).toBe(true) // inchangé
    expect(entree.cible_atteinte).toBe(false) // pas de mutation de l'entrée
  })

  it("no-op si aucun critère n'a de derive (nœuds A/B/C/F/H)", () => {
    const sansDerive: CritereEntree[] = [{ nom: 'age', type: 'nombre' }]
    const entree: Criteria = { age: 70 }
    expect(calculerCriteresDerives(sansDerive, entree)).toEqual(entree)
  })
})

describe('evaluerNombre — doses calculées (P3)', () => {
  it('évalue une expression arithmétique en nombre', () => {
    expect(evaluerNombre('poids * 0.1', { poids: 80 })).toBeCloseTo(8)
    expect(evaluerNombre('poids * 0.2', { poids: 80 })).toBeCloseTo(16)
    expect(evaluerNombre('dose_basale_actuelle + 2', { dose_basale_actuelle: 40 })).toBe(42)
    expect(evaluerNombre('dose_basale_actuelle * 0.8', { dose_basale_actuelle: 50 })).toBeCloseTo(40)
  })
  it('renvoie null si non calculable (primitive manquante ou non finie)', () => {
    expect(evaluerNombre('poids * 0.1', {})).toBeNull() // poids absent → NaN → null
    expect(evaluerNombre('dose_basale_actuelle / poids', { dose_basale_actuelle: 40, poids: 0 })).toBeNull() // /0 → Infinity → null
  })
})

describe('criteresReferences', () => {
  const criteres: CritereEntree[] = [
    { nom: 'age', type: 'nombre' },
    { nom: 'HbA1c_actuelle', type: 'nombre' },
    { nom: 'HbA1c_cible', type: 'nombre' },
    { nom: 'cible_atteinte', type: 'bool', derive: 'HbA1c_actuelle <= HbA1c_cible' },
    { nom: 'TIR', type: 'nombre' }, // non référencé nulle part
    { nom: 'TBR', type: 'nombre' },
  ]
  const regles = ['situation_insuline == basale_seule', 'TBR > 4', 'age >= 75']

  it('inclut les critères des règles ET ceux référencés par un derive, exclut les non-référencés', () => {
    const refs = criteresReferences(criteres, regles)
    expect(refs.has('TBR')).toBe(true) // règle
    expect(refs.has('age')).toBe(true) // règle
    expect(refs.has('HbA1c_actuelle')).toBe(true) // via derive de cible_atteinte
    expect(refs.has('HbA1c_cible')).toBe(true) // via derive
    expect(refs.has('TIR')).toBe(false) // jamais référencé → non requis
  })
})
