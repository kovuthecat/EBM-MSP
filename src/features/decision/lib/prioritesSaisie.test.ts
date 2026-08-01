/**
 * Tests de `prioritesDeSaisie` (B2, 2026-08-01) — le classement des critères manquants par nombre
 * d'options débloquées, qui alimente le « Commencez par : … » du panneau EN ATTENTE.
 *
 * Ce qui compte ici et qu'aucun autre test ne couvre : le DÉTERMINISME du classement. Une phrase
 * « commencez par A, B, C » qui permuterait d'une frappe à l'autre serait pire que la liste qu'elle
 * remplace — le praticien la relirait à chaque rendu.
 */
import { describe, expect, it } from 'vitest'
import type { Option } from '../content/node.types.ts'
import type { OptionEnAttenteVue } from './vueDecision.ts'
import { prioritesDeSaisie } from './prioritesSaisie.ts'

/** Option minimale : seul `intitule` sert d'étiquette, le classement ne lit que `manquants`. */
function opt(intitule: string): Option {
  return {
    intitule,
    role: 'geste',
    conditions: [],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
  }
}

function enAttente(couples: Array<[string, string[]]>): OptionEnAttenteVue[] {
  return couples.map(([intitule, manquants]) => ({ option: opt(intitule), manquants }))
}

describe('prioritesDeSaisie — classement par nombre d’options débloquées', () => {
  it('un critère cité par plusieurs options n’apparaît qu’une fois, avec son décompte cumulé', () => {
    const priorites = prioritesDeSaisie(
      enAttente([
        ['A', ['dfg', 'poids']],
        ['B', ['dfg']],
        ['C', ['dfg', 'age']],
      ]),
    )
    expect(priorites).toEqual([
      { nom: 'dfg', options: 3 },
      { nom: 'poids', options: 1 },
      { nom: 'age', options: 1 },
    ])
  })

  it('le plus bloquant sort en tête, quel que soit son rang d’apparition', () => {
    // `rare` apparaît EN PREMIER mais ne bloque qu'une option ; `frequent` doit malgré tout passer devant.
    const priorites = prioritesDeSaisie(
      enAttente([
        ['A', ['rare']],
        ['B', ['frequent']],
        ['C', ['frequent']],
      ]),
    )
    expect(priorites.map((p) => p.nom)).toEqual(['frequent', 'rare'])
  })

  it('à égalité de décompte, l’ordre de PREMIÈRE APPARITION tranche — jamais l’ordre d’un `Map` ni un tri alphabétique', () => {
    // `zeta` apparaît avant `alpha` et les deux bloquent une seule option : `zeta` reste devant.
    // Un tri alphabétique inverserait, et rendrait le classement dépendant du nom des critères.
    const priorites = prioritesDeSaisie(
      enAttente([
        ['A', ['zeta']],
        ['B', ['alpha']],
      ]),
    )
    expect(priorites.map((p) => p.nom)).toEqual(['zeta', 'alpha'])
  })

  it('DÉTERMINISME : deux appels sur la même entrée donnent exactement la même liste', () => {
    const entree = enAttente([
      ['A', ['x', 'y']],
      ['B', ['y', 'z']],
      ['C', ['z', 'x']],
    ])
    expect(prioritesDeSaisie(entree)).toEqual(prioritesDeSaisie(entree))
  })

  it('registre vide → liste vide (le panneau n’est alors pas rendu du tout)', () => {
    expect(prioritesDeSaisie([])).toEqual([])
  })

  it('une option sans aucun manquant n’ajoute rien (cas défensif — le moteur ne devrait pas en produire)', () => {
    const priorites = prioritesDeSaisie(enAttente([['A', []], ['B', ['dfg']]]))
    expect(priorites).toEqual([{ nom: 'dfg', options: 1 }])
  })
})
