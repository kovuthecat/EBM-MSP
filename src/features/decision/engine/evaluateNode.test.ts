/**
 * Tests du sélecteur d'options (`evaluateNode.ts`) sur le nœud **réel**
 * `content/noeuds/diabete-type-2/cible-glycemique.yaml`, dans sa version **validée** (T-007bis) :
 * nœud à **sortie unique** (`selection: ordered-first-match`), bandes HAS < 9 / ≤ 8 / ~6,5 / ≤ 7.
 * Couvre notamment les corrections de la 2ᵉ passe (`docs/decision/noeuds/A-cible-glycemique.verification-p2.md`) :
 * borne d'âge sur le strict (A1), CV grave routé vers ≤ 8 % (A2), exclusivité (A3).
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import type { Criteria } from './conditions.ts'
import { ConditionError } from './conditions.ts'
import { evaluateNode } from './evaluateNode.ts'

const node = getNoeudById('cible-glycemique')
if (node === undefined) {
  throw new Error(
    'Nœud "cible-glycemique" introuvable sous content/noeuds/diabete-type-2 — prérequis de ces tests (S2/T-007bis).',
  )
}

const MOINS_CONTRAIGNANTE = 'Cible < 9 %'
const SOUPLE = 'Cible ≤ 8 %'
const STRICTE = 'Cible ~6,5 % (6,5–7 %)'
const DEFAUT = 'Cible ≤ 7 %'

/** Critères complets à partir d'un profil « défaut » (le moteur lève sur toute variable manquante). */
function criteria(overrides: Partial<Criteria> = {}): Criteria {
  return {
    age: 60,
    anciennete_diabete_annees: 8,
    esperance_vie: 'intermediaire',
    fragilite: false,
    risque_hypoglycemie_schema: 'faible',
    antecedent_cv: false,
    comorbidite_grave: false,
    ...overrides,
  }
}

function cible(c: Criteria): string[] {
  return evaluateNode(node!, c).applicable.map((o) => o.intitule)
}

describe('evaluateNode — "cible-glycemique" (T-007bis · ordered-first-match, sortie unique)', () => {
  it('renvoie toujours UNE seule cible (nœud à sortie unique)', () => {
    expect(evaluateNode(node!, criteria()).applicable).toHaveLength(1)
    expect(
      evaluateNode(node!, criteria({ fragilite: true, esperance_vie: 'limitee' })).applicable,
    ).toHaveLength(1)
  })

  it('jeune, récent, sans MCV, non fragile, hypo faible, EV longue → ~6,5 %', () => {
    expect(cible(criteria({ age: 52, anciennete_diabete_annees: 3, esperance_vie: 'longue' }))).toEqual([STRICTE])
  })

  it('A1 — sujet âgé (78) robuste, récent, sans MCV → ≤ 7 % (le ~6,5 % est verrouillé par age < 70)', () => {
    expect(cible(criteria({ age: 78, anciennete_diabete_annees: 3, esperance_vie: 'longue' }))).toEqual([DEFAUT])
  })

  it('profil intermédiaire → défaut ≤ 7 %', () => {
    expect(cible(criteria({ age: 68, anciennete_diabete_annees: 8, esperance_vie: 'intermediaire' }))).toEqual([DEFAUT])
  })

  it('A2 — CV établi grave (comorbidite_grave), non fragile, EV longue → ≤ 8 % (pas ≤ 7)', () => {
    expect(
      cible(criteria({ age: 64, antecedent_cv: true, comorbidite_grave: true, esperance_vie: 'longue' })),
    ).toEqual([SOUPLE])
  })

  it('fragile (EV non limitée) → ≤ 8 %', () => {
    expect(cible(criteria({ fragilite: true }))).toEqual([SOUPLE])
  })

  it('ancienneté > 10 ans ET risque hypo élevé → ≤ 8 %', () => {
    expect(cible(criteria({ anciennete_diabete_annees: 15, risque_hypoglycemie_schema: 'eleve' }))).toEqual([SOUPLE])
  })

  it('risque hypo élevé seul (ancienneté < 10) → défaut ≤ 7 % (pas ≤ 8, pas ~6,5)', () => {
    expect(cible(criteria({ anciennete_diabete_annees: 5, risque_hypoglycemie_schema: 'eleve' }))).toEqual([DEFAUT])
  })

  it('fragile ET EV limitée → < 9 % (bande la plus relâchée, évaluée en premier)', () => {
    expect(cible(criteria({ age: 82, fragilite: true, esperance_vie: 'limitee' }))).toEqual([MOINS_CONTRAIGNANTE])
  })

  it('comorbidité grave ET EV limitée → < 9 %', () => {
    expect(cible(criteria({ comorbidite_grave: true, esperance_vie: 'limitee' }))).toEqual([MOINS_CONTRAIGNANTE])
  })

  it('EV limitée SANS fragilité ni comorbidité grave → ≤ 8 % (pas < 9)', () => {
    expect(cible(criteria({ esperance_vie: 'limitee' }))).toEqual([SOUPLE])
  })

  it('reason = les conditions satisfaites de la cible retenue', () => {
    const c = criteria({ age: 52, anciennete_diabete_annees: 3, esperance_vie: 'longue' })
    const result = evaluateNode(node!, c)
    expect(result.reasons.get(result.applicable[0])).toContain('age < 70')
  })

  it('variable de critère inconnue → ConditionError (jamais un faux silencieux)', () => {
    // `esperance_vie` manque : la 1re option évaluée ("< 9 %" : "esperance_vie == limitee") doit lever.
    const incomplete = {
      age: 52,
      anciennete_diabete_annees: 3,
      fragilite: false,
      risque_hypoglycemie_schema: 'faible',
      antecedent_cv: false,
      comorbidite_grave: false,
    } as Criteria
    expect(() => evaluateNode(node!, incomplete)).toThrow(ConditionError)
    expect(() => evaluateNode(node!, incomplete)).toThrow(/esperance_vie/)
  })
})
