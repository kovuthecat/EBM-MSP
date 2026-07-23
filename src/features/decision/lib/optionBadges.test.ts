import { describe, expect, it } from 'vitest'
import type { Option } from '../content/node.types.ts'
import { computeBadges } from './optionBadges.ts'

function opt(intitule: string, conditions: string[]): Option {
  return {
    intitule,
    conditions,
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
  }
}

describe('computeBadges (D16)', () => {
  it('badge « reco-officielle » sur le socle « toujours », « recommandee » sur la 1re option non-socle', () => {
    const socle = opt('Metformine (socle) — poursuivre', ['toujours'])
    const ajout1 = opt('Ajout iSGLT2', ['a == true'])
    const ajout2 = opt('Ajout GLP-1', ['b == true'])
    const badges = computeBadges([socle, ajout1, ajout2])
    expect(badges.get(socle)).toBe('reco-officielle')
    expect(badges.get(ajout1)).toBe('recommandee')
    expect(badges.get(ajout2)).toBe(null)
  })

  it('sans socle « toujours » présent, la 1re option porte « recommandee » (comportement antérieur)', () => {
    const ajout1 = opt('A', ['a == true'])
    const ajout2 = opt('B', ['b == true'])
    const badges = computeBadges([ajout1, ajout2])
    expect(badges.get(ajout1)).toBe('recommandee')
    expect(badges.get(ajout2)).toBe(null)
  })

  it('un socle « toujours » seul (aucune autre option applicable) porte « reco-officielle », pas « recommandee »', () => {
    const socle = opt('Metformine (socle) — poursuivre', ['toujours'])
    const badges = computeBadges([socle])
    expect(badges.get(socle)).toBe('reco-officielle')
  })

  it('le socle n’est pas forcément en position 0 : la 1re option non-socle porte « recommandee » quelle que soit sa place', () => {
    const ajout = opt('Ajout', ['a == true'])
    const socle = opt('Socle', ['toujours'])
    // Ordre déjà trié par le moteur (ex. l'ajout a un rang inférieur au socle) : le socle est en 2e position.
    const badges = computeBadges([ajout, socle])
    expect(badges.get(ajout)).toBe('recommandee')
    expect(badges.get(socle)).toBe('reco-officielle')
  })
})
