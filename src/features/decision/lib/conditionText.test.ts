import { describe, expect, it } from 'vitest'
import { describeReasons } from './conditionText'

describe('describeReasons', () => {
  it('reconnaît le repli `default` et affiche un message explicite (pas le jeton brut)', () => {
    expect(describeReasons(['default'])).toBe(
      "Option par défaut : retenue en l'absence de toute autre option plus spécifique applicable.",
    )
  })

  it('reconnaît le socle `toujours` (D16) et affiche un message explicite (pas le jeton brut)', () => {
    // Régression du finding red-team D16 : sans ce cas spécial, une carte affichait littéralement
    // « Pourquoi cette option : toujours » (jeton moteur interne montré au clinicien).
    const texte = describeReasons(['toujours'])
    expect(texte).not.toBe('toujours')
    expect(texte).toContain('recommandation officielle')
  })

  it('humanise une expression atomique réelle (variable/opérateur/valeur)', () => {
    expect(describeReasons(['age >= 75'])).toBe('Âge ≥ 75')
  })

  it('compose AND (« et ») et OR (« ou ») comme le moteur', () => {
    expect(describeReasons(['fragilite == true AND esperance_vie == limitee'])).toBe(
      'Fragilité = Oui et Espérance de vie = Limitée',
    )
    expect(describeReasons(['age >= 75 OR fragilite == true'])).toBe('Âge ≥ 75 ou Fragilité = Oui')
  })

  it('joint plusieurs éléments du tableau `reasons` (ET logique, comme `conditions.every`)', () => {
    expect(describeReasons(['age >= 75', 'fragilite == true'])).toBe('Âge ≥ 75 et Fragilité = Oui')
  })
})
