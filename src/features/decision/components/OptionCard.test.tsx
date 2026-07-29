/**
 * SB3 (P6, 2026-07-28) — T-040 : bordure gauche par verbe d'action (`option.action`) + contre-
 * indications déplacées dans le dépli (`<details>`), en première position.
 *
 * CE FICHIER REMPLACE l'ancien garde-fou T-025 (P4/S4, même jour), qui figeait un ordre du DOM
 * (contre-indications AVANT le dépli) que SB3 inverse délibérément. Tension tranchée par Thibault le
 * 2026-07-28 : compactage accepté, mais pas au prix de l'accessibilité — d'où le libellé du `<summary>`
 * qui change selon la présence de contre-indications, seul indicateur requis carte FERMÉE
 * (`OptionCard.tsx`). Les mêmes garanties structurelles sont reconduites ICI, à la nouvelle position :
 * une contre-indication n'est jamais silencieusement omise, toujours EN TÊTE du dépli (avant l'effet
 * attendu, avant avantages/inconvénients), et une option sans contre-indication ne réserve toujours
 * aucun espace.
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

describe('OptionCard — SB3/T-040 (contre-indications dans le dépli, en tête)', () => {
  it("place le bloc de contre-indications À L'INTÉRIEUR du <details>, avant l'effet attendu", () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['Grossesse.', 'Allaitement.'] }))

    const indexDetails = html.indexOf('<details')
    const indexCi = html.indexOf('option-card__ci')
    const indexEffet = html.indexOf('option-card__effet')

    expect(indexDetails).toBeGreaterThan(-1)
    expect(indexCi).toBeGreaterThan(indexDetails) // DANS le dépli désormais, plus avant lui (inverse de T-025)
    expect(indexCi).toBeLessThan(indexEffet)
  })

  it('place le bloc de contre-indications AVANT avantages/inconvénients (toujours en tête du dépli)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }))

    const indexCi = html.indexOf('option-card__ci')
    const indexLists = html.indexOf('option-card__lists')

    expect(indexCi).toBeGreaterThan(-1)
    expect(indexLists).toBeGreaterThan(-1)
    expect(indexCi).toBeLessThan(indexLists)
  })

  it('place le bloc de contre-indications APRÈS les doses (désormais dans le dépli, plus dans le socle)', () => {
    // Inverse du garde-fou T-025 : les doses restent dans le socle (avant le dépli), la contre-
    // indication l'a quitté — cette bascule EST le changement que T-040 demande.
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }), [
      { libelle: 'Dose', valeur: 10, unite: 'U/j' },
    ])

    const indexCalculs = html.indexOf('option-card__calculs')
    const indexCi = html.indexOf('option-card__ci')

    expect(indexCalculs).toBeGreaterThan(-1)
    expect(indexCi).toBeGreaterThan(indexCalculs)
  })

  it("ne réserve aucun espace quand l'option n'a pas de contre-indication", () => {
    const html = rendreCarte(optionDeBase())

    expect(html).not.toContain('option-card__ci')
  })

  // SB6 (P6, 2026-07-29) — le libellé neutre ci-dessus (sans icône ni couleur d'alerte) est justement
  // ce que la recette de contrôle S6 a mesuré comme insuffisant (0 information retenue au test des 20
  // secondes) : ces deux tests remplacent les anciennes assertions sur le texte fixe
  // « Contre-indications, effet attendu et plus », que le référent a explicitement libéré (« le texte
  // exact n'est pas figé », `plans/P6/SB6.md`).
  it('le <summary> porte l’icône ⚠, la couleur d’alerte dédiée et le décompte quand des contre-indications existent (SB6)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.', 'Autre CI.'] }))

    expect(html).toContain('option-card__detail-summary--ci')
    expect(html).toContain('⚠')
    expect(html).toContain('2 contre-indications, effet attendu et plus')
    expect(html).not.toContain('Effet attendu, avantages et inconvénients')
  })

  it('le <summary> accorde le décompte au singulier pour une seule contre-indication (SB6)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }))

    expect(html).toContain('1 contre-indication, effet attendu et plus')
    expect(html).not.toContain('1 contre-indications')
  })

  it("le <summary> annonce « Effet attendu, avantages et inconvénients » en leur absence, SANS icône ni couleur d'alerte — c'est l'unique indicateur carte fermée", () => {
    const html = rendreCarte(optionDeBase())

    expect(html).toContain('Effet attendu, avantages et inconvénients')
    expect(html).not.toContain('⚠')
    expect(html).not.toContain('option-card__detail-summary--ci')
  })
})

describe('OptionCard — SB3/T-040 (bordure gauche par verbe d’action)', () => {
  // Extrait la valeur de l'attribut `class` du <div> racine (React SSR : `class`, pas `className`).
  function classeRacine(html: string): string {
    const match = html.match(/^<div class="([^"]*)"/)
    if (!match) throw new Error('div racine introuvable dans le HTML rendu')
    return match[1]
  }

  it('option.action = "ajouter" → classe option-card--action-ajouter', () => {
    expect(classeRacine(rendreCarte(optionDeBase({ action: 'ajouter' })))).toBe('option-card option-card--action-ajouter')
  })

  it('option.action = "remplacer" → classe option-card--action-remplacer', () => {
    expect(classeRacine(rendreCarte(optionDeBase({ action: 'remplacer' })))).toBe(
      'option-card option-card--action-remplacer',
    )
  })

  it('option.action = "arreter" → classe option-card--action-arreter', () => {
    expect(classeRacine(rendreCarte(optionDeBase({ action: 'arreter' })))).toBe('option-card option-card--action-arreter')
  })

  it('option.action = "reduire" → classe option-card--action-reduire', () => {
    expect(classeRacine(rendreCarte(optionDeBase({ action: 'reduire' })))).toBe('option-card option-card--action-reduire')
  })

  it('option.action = "maintenir" → classe option-card--action-maintenir (réutilise --c-accent-decision)', () => {
    expect(classeRacine(rendreCarte(optionDeBase({ action: 'maintenir' })))).toBe(
      'option-card option-card--action-maintenir',
    )
  })

  it("option.action absent → aucune classe de bordure ajoutée (comportement actuel inchangé)", () => {
    const classe = classeRacine(rendreCarte(optionDeBase()))
    expect(classe).toBe('option-card')
    expect(classe).not.toMatch(/option-card--action-/)
  })
})
