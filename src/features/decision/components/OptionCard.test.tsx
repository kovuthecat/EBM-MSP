/**
 * T-025 (P4/S4, 2026-07-28) — le bloc « Contre-indications » remonte sous le titre/badges de la carte,
 * avant l'effet attendu et avant avantages/inconvénients (qui vivent dans le dépli `<details>`).
 *
 * GARDE-FOU DE NON-RÉGRESSION : la recette navigateur du 2026-07-28 (`docs/decision/validation/
 * recette-navigateur-2026-07-28.md`, Axe B-1) a mesuré ce bloc comme l'élément le MOINS saillant de la
 * carte — texte gris, sans bordure ni fond, placé après un lien décoratif — alors qu'il porte l'unique
 * interdiction de la carte. Ce test fige l'ordre du DOM pour que la régression soit détectée
 * automatiquement plutôt que par un humain devant l'écran (cf. `banc/carte-affichage.test.tsx`, même
 * logique appliquée à un autre invariant de socle).
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Option } from '../content/node.types'
import type { CalculAffiche } from '../lib/vueDecision'
import { OptionCard } from './OptionCard'

function optionDeBase(overrides: Partial<Option> = {}): Option {
  return {
    intitule: 'Option de test',
    role: 'geste',
    avantages: ['Avantage de test.'],
    inconvenients: ['Inconvénient de test.'],
    effet_attendu: 'Effet attendu de test (non chiffrable).',
    niveau_preuve: 'modere',
    conditions: ['toujours'],
    ...overrides,
  }
}

function rendreCarte(option: Option, calculs: CalculAffiche[] = []) {
  return renderToStaticMarkup(
    <OptionCard
      option={option}
      badge={null}
      reasons={['toujours']}
      calculs={calculs}
      calculsEnAttente={[]}
      motifRang={undefined}
      alertes={[]}
    />,
  )
}

describe('OptionCard — T-025 (contre-indications en tête de carte)', () => {
  it("place le bloc de contre-indications AVANT l'effet attendu dans l'ordre du DOM", () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['Grossesse.', 'Allaitement.'] }))

    const indexCi = html.indexOf('option-card__ci')
    const indexEffet = html.indexOf('option-card__effet')

    expect(indexCi).toBeGreaterThan(-1)
    expect(indexEffet).toBeGreaterThan(-1)
    expect(indexCi).toBeLessThan(indexEffet)
  })

  it('place le bloc de contre-indications AVANT le dépli (avantages/inconvénients)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }))

    const indexCi = html.indexOf('option-card__ci')
    const indexDetails = html.indexOf('<details')

    expect(indexCi).toBeGreaterThan(-1)
    expect(indexDetails).toBeGreaterThan(-1)
    expect(indexCi).toBeLessThan(indexDetails)
  })

  it('place le bloc de contre-indications juste après le titre/badges (avant les doses)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }), [
      { libelle: 'Dose', valeur: 10, unite: 'U/j' },
    ])

    const indexHeaderEnd = html.indexOf('option-card__header')
    const indexCi = html.indexOf('option-card__ci')
    const indexCalculs = html.indexOf('option-card__calculs')

    expect(indexHeaderEnd).toBeGreaterThan(-1)
    expect(indexCi).toBeGreaterThan(indexHeaderEnd)
    expect(indexCalculs).toBeGreaterThan(-1)
    expect(indexCi).toBeLessThan(indexCalculs)
  })

  it("ne réserve aucun espace quand l'option n'a pas de contre-indication (cf. « Si bloqué », S4.md)", () => {
    const html = rendreCarte(optionDeBase())

    expect(html).not.toContain('option-card__ci')
  })
})
