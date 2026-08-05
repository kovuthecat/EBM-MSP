/**
 * Tests de `prioritesDeSaisie` (B2, 2026-08-01 ; tri de sécurité T-140, P13/S2, 2026-08-04) — le
 * classement des critères manquants qui alimente le « Commencez par : … » du panneau EN ATTENTE.
 *
 * Ce qui compte ici et qu'aucun autre test ne couvre : le DÉTERMINISME du classement. Une phrase
 * « commencez par A, B, C » qui permuterait d'une frappe à l'autre serait pire que la liste qu'elle
 * remplace — le praticien la relirait à chaque rendu. Depuis T-140, le déterminisme doit tenir aussi
 * avec le nouveau premier critère de tri (`securite`), pas seulement avec le décompte.
 */
import { describe, expect, it } from 'vitest'
import type { Option, RoleOption } from '../content/node.types.ts'
import type { OptionEnAttenteVue } from './vueDecision.ts'
import { prioritesDeSaisie } from './prioritesSaisie.ts'

/** Option minimale : `intitule` sert d'étiquette, `role` pilote le tri T-140 (par défaut `geste`, neutre). */
function opt(intitule: string, role: RoleOption = 'geste'): Option {
  return {
    intitule,
    role,
    conditions: [],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
  }
}

/** Couple `[intitulé, manquants]`, ou triplet `[intitulé, manquants, role]` quand le rôle importe (T-140). */
function enAttente(couples: Array<[string, string[]] | [string, string[], RoleOption]>): OptionEnAttenteVue[] {
  return couples.map(([intitule, manquants, role]) => ({ option: opt(intitule, role), manquants }))
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
      { nom: 'dfg', options: 3, securite: false },
      { nom: 'poids', options: 1, securite: false },
      { nom: 'age', options: 1, securite: false },
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
    expect(priorites).toEqual([{ nom: 'dfg', options: 1, securite: false }])
  })
})

describe('prioritesDeSaisie — T-140 : un critère qui débloque une option `role: securite` passe devant', () => {
  it('un critère `securite` avec 1 option passe devant un critère non-securite avec 5 options', () => {
    const priorites = prioritesDeSaisie(
      enAttente([
        // `frequent` bloque 5 options ordinaires (`role: geste`, valeur par défaut de `opt`).
        ['A', ['frequent']],
        ['B', ['frequent']],
        ['C', ['frequent']],
        ['D', ['frequent']],
        ['E', ['frequent']],
        // `rare` ne bloque qu'UNE option, mais elle est `role: securite`.
        ['F', ['rare'], 'securite'],
      ]),
    )
    expect(priorites.map((p) => p.nom)).toEqual(['rare', 'frequent'])
    expect(priorites[0]).toEqual({ nom: 'rare', options: 1, securite: true })
    expect(priorites[1]).toEqual({ nom: 'frequent', options: 5, securite: false })
  })

  it('à égalité de `securite` (les deux, ou aucun des deux), le décompte tranche comme avant', () => {
    const priorites = prioritesDeSaisie(
      enAttente([
        ['A', ['peu_securise'], 'securite'],
        ['B', ['beaucoup_securise'], 'securite'],
        ['C', ['beaucoup_securise'], 'securite'],
      ]),
    )
    expect(priorites.map((p) => p.nom)).toEqual(['beaucoup_securise', 'peu_securise'])
  })

  it('à égalité complète (`securite` ET décompte), la première apparition tranche', () => {
    const priorites = prioritesDeSaisie(
      enAttente([
        ['A', ['zeta'], 'securite'],
        ['B', ['alpha'], 'securite'],
      ]),
    )
    expect(priorites.map((p) => p.nom)).toEqual(['zeta', 'alpha'])
  })

  it('un critère bloquant PLUSIEURS options dont une seule `securite` est marqué `securite: true`', () => {
    const priorites = prioritesDeSaisie(
      enAttente([
        ['A', ['mixte']],
        ['B', ['mixte'], 'securite'],
      ]),
    )
    expect(priorites).toEqual([{ nom: 'mixte', options: 2, securite: true }])
  })

  it('DÉTERMINISME du tri de sécurité : deux appels sur la même entrée donnent exactement la même liste', () => {
    const entree = enAttente([
      ['A', ['x'], 'securite'],
      ['B', ['y']],
      ['C', ['y']],
      ['D', ['z'], 'securite'],
    ])
    expect(prioritesDeSaisie(entree)).toEqual(prioritesDeSaisie(entree))
  })
})
