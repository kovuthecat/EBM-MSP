// @vitest-environment jsdom

/**
 * Kit d'icônes (P11/S2, T-104) — 4 tests couvrant le contrat du composant `Icon` : un tracé rendu par
 * nom de `ICON_PATHS` (dictionnaire fermé, 17 icônes), le défaut décoratif (`aria-hidden`), le mode
 * nommé (`role="img"` + `aria-label`), et l'absence de couleur en dur — la couleur doit toujours venir
 * de `currentColor`/`none`, jamais d'une valeur fixe, pour laisser le composant appelant la piloter.
 */
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ICON_PATHS, type NomIcone } from './paths'
import { Icon } from './Icon'

const NOMS = Object.keys(ICON_PATHS) as NomIcone[]

describe('Icon', () => {
  it.each(NOMS)('rend un <svg> pour "%s"', (nom) => {
    const { container } = render(<Icon nom={nom} />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('aria-hidden="true" et pas de `role` quand `libelle` est absent', () => {
    const { container } = render(<Icon nom="info" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.hasAttribute('role')).toBe(false)
  })

  it('`role="img"` + `aria-label` quand `libelle` est fourni', () => {
    const { container } = render(<Icon nom="info" libelle="Justification" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('role')).toBe('img')
    expect(svg?.getAttribute('aria-label')).toBe('Justification')
    expect(svg?.hasAttribute('aria-hidden')).toBe(false)
  })

  it('aucun tracé ne contient de couleur en dur', () => {
    const html = NOMS.map((nom) => render(<Icon nom={nom} />).container.innerHTML).join('')
    expect(html).not.toMatch(/(fill|stroke)="(?!none|currentColor)/)
  })
})
