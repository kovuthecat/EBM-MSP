// @vitest-environment jsdom

/**
 * `PastilleInfo` (P11/S3, T-105) — 6 tests couvrant le contrat du bouton-icône « survol sur pointeur
 * fin, clic partout » (arbitrage référent 2026-08-01, question 1) : le nom accessible et l'état ARIA du
 * bouton, le clic (composant CONTRÔLÉ — `onToggle` un appel, aucun état interne), l'`aria-hidden` de
 * l'info-bulle (jamais l'unique porteuse de l'information — cf. docstring `PastilleInfo.tsx`), sa
 * présence permanente dans le DOM (c'est le CSS qui la masque, pas le JSX — sinon aucun survol possible),
 * et le registre visuel (`ton`).
 *
 * Aucun test ne mesure le CSS (media query `hover`/`pointer`, positionnement `right: 0`) : jsdom n'a pas
 * de moteur de rendu, cf. `/verif-visuelle` pour la vérification visuelle (checklist Mode B).
 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PastilleInfo } from './PastilleInfo'

afterEach(() => {
  cleanup()
})

describe('PastilleInfo', () => {
  it('le bouton porte aria-label, aria-expanded="false" et aria-controls', () => {
    render(
      <PastilleInfo
        icone="triangle-alerte"
        libelle="Contre-indications"
        texte="Insuffisance rénale sévère"
        ouvert={false}
        onToggle={vi.fn()}
        panneauId="panneau-ci"
      />,
    )

    const bouton = screen.getByRole('button', { name: 'Contre-indications' })
    expect(bouton.getAttribute('aria-expanded')).toBe('false')
    expect(bouton.getAttribute('aria-controls')).toBe('panneau-ci')
  })

  it('un clic appelle `onToggle` une fois', () => {
    const onToggle = vi.fn()
    render(
      <PastilleInfo
        icone="gelule"
        libelle="Posologie"
        texte="8 U/j"
        ouvert={false}
        onToggle={onToggle}
        panneauId="panneau-posologie"
      />,
    )

    screen.getByRole('button', { name: 'Posologie' }).click()

    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('`ouvert: true` → aria-expanded="true"', () => {
    render(
      <PastilleInfo
        icone="gelule"
        libelle="Posologie"
        texte="8 U/j"
        ouvert={true}
        onToggle={vi.fn()}
        panneauId="panneau-posologie"
      />,
    )

    expect(screen.getByRole('button', { name: 'Posologie' }).getAttribute('aria-expanded')).toBe(
      'true',
    )
  })

  it("l'info-bulle porte aria-hidden=\"true\" (le texte n'est pas exposé deux fois)", () => {
    const { container } = render(
      <PastilleInfo
        icone="triangle-alerte"
        libelle="Contre-indications"
        texte="Insuffisance rénale sévère"
        ouvert={false}
        onToggle={vi.fn()}
        panneauId="panneau-ci"
      />,
    )

    const bulle = container.querySelector('.pastille-info__bulle')
    expect(bulle?.getAttribute('aria-hidden')).toBe('true')
  })

  it('le texte est présent dans le DOM quel que soit `ouvert` (masqué par le CSS, pas par le JSX)', () => {
    const { rerender } = render(
      <PastilleInfo
        icone="triangle-alerte"
        libelle="Contre-indications"
        texte="Insuffisance rénale sévère"
        ouvert={false}
        onToggle={vi.fn()}
        panneauId="panneau-ci"
      />,
    )
    expect(screen.getByText('Insuffisance rénale sévère')).toBeTruthy()

    rerender(
      <PastilleInfo
        icone="triangle-alerte"
        libelle="Contre-indications"
        texte="Insuffisance rénale sévère"
        ouvert={true}
        onToggle={vi.fn()}
        panneauId="panneau-ci"
      />,
    )
    expect(screen.getByText('Insuffisance rénale sévère')).toBeTruthy()
  })

  it('`ton="danger"` ajoute la classe de registre attendue', () => {
    render(
      <PastilleInfo
        icone="triangle-alerte"
        libelle="Contre-indications"
        texte="Insuffisance rénale sévère"
        ouvert={false}
        onToggle={vi.fn()}
        panneauId="panneau-ci"
        ton="danger"
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Contre-indications' }).classList.contains(
        'pastille-info--danger',
      ),
    ).toBe(true)
  })
})
