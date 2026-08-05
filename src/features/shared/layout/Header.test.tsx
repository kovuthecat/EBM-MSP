// @vitest-environment jsdom

/**
 * Bouton « Nouveau patient » — confirmation en deux temps SUR LE BOUTON (T-055/P8), et compteur d'état de
 * la mémoire de session (T-056/P8) : testés dans le même fichier parce qu'ils partagent le composant
 * `Header`. Le remontage des écrans lui-même reste couvert séparément par
 * `src/features/decision/lib/sessionCriteres.remount.test.tsx` (qui exerce `App.tsx`/`sessionCriteres.ts`
 * bout en bout).
 *
 * T-055 remplace `window.confirm` — la recette du 2026-07-30 a montré Chrome proposer « Empêcher cette
 * page de créer des boîtes de dialogue supplémentaires » dès la 2ᵉ occurrence, rendant le bouton
 * silencieusement inerte (S1.md « Décision clé »). Ici, `Header` est testé seul : la confirmation doit se
 * produire AVANT tout appel à `onNouveauPatient`, et un « Annuler » (ou un silence) ne doit rien
 * déclencher. **Aucun test ci-dessous ne mocke `window.confirm`.**
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Navigation } from '../navigation'
import type { CritereEntree } from '../../decision/content/node.types'
import { memoriserCriteres, reinitialiserSession } from '../../decision/lib/sessionCriteres'
import { Header } from './Header'

afterEach(() => {
  cleanup()
  reinitialiserSession()
})

const NAV: Navigation = { screen: 'decisionDomains', params: {}, go: () => {} }

describe('Header — bouton « Nouveau patient » (confirmation en deux temps, T-055)', () => {
  it('un premier clic passe en confirmation, SANS appeler `onNouveauPatient`', () => {
    const onNouveauPatient = vi.fn()
    render(<Header nav={NAV} onNouveauPatient={onNouveauPatient} />)

    fireEvent.click(screen.getByText('Nouveau patient'))

    expect(onNouveauPatient).not.toHaveBeenCalled()
    expect(screen.getByText('Confirmer ?')).toBeTruthy()
    expect(screen.getByText('Annuler')).toBeTruthy()
    expect(screen.queryByText('Nouveau patient')).toBeNull()
  })

  it('deux clics (geste, puis « Confirmer ? ») appellent `onNouveauPatient` UNE fois', () => {
    const onNouveauPatient = vi.fn()
    render(<Header nav={NAV} onNouveauPatient={onNouveauPatient} />)

    fireEvent.click(screen.getByText('Nouveau patient'))
    fireEvent.click(screen.getByText('Confirmer ?'))

    expect(onNouveauPatient).toHaveBeenCalledTimes(1)
  })

  it("« Annuler » n'appelle PAS `onNouveauPatient` et revient à « Nouveau patient »", () => {
    const onNouveauPatient = vi.fn()
    render(<Header nav={NAV} onNouveauPatient={onNouveauPatient} />)

    fireEvent.click(screen.getByText('Nouveau patient'))
    fireEvent.click(screen.getByText('Annuler'))

    expect(onNouveauPatient).not.toHaveBeenCalled()
    expect(screen.getByText('Nouveau patient')).toBeTruthy()
    expect(screen.queryByText('Confirmer ?')).toBeNull()
  })

  it("la confirmation est perceptible sans voir l'écran (aria-live + aria-label explicite)", () => {
    render(<Header nav={NAV} onNouveauPatient={vi.fn()} />)

    fireEvent.click(screen.getByText('Nouveau patient'))

    const confirmer = screen.getByText('Confirmer ?').closest('button')
    const annuler = screen.getByText('Annuler').closest('button')
    expect(confirmer?.getAttribute('aria-label')).toMatch(/Vider la session en cours/)
    expect(annuler?.getAttribute('aria-label')).toBeTruthy()
    expect(confirmer?.closest('[aria-live="polite"]')).toBeTruthy()
  })

  describe('délais (timers factices)', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('sans clic, la confirmation revient seule à « Nouveau patient » après son délai', () => {
      const onNouveauPatient = vi.fn()
      render(<Header nav={NAV} onNouveauPatient={onNouveauPatient} />)

      fireEvent.click(screen.getByText('Nouveau patient'))
      expect(screen.getByText('Confirmer ?')).toBeTruthy()

      act(() => {
        vi.runAllTimers()
      })

      expect(onNouveauPatient).not.toHaveBeenCalled()
      expect(screen.getByText('Nouveau patient')).toBeTruthy()
      expect(screen.queryByText('Confirmer ?')).toBeNull()
    })

    it('confirmer affiche « Session vidée » puis revient à « Nouveau patient » après le délai', () => {
      const onNouveauPatient = vi.fn()
      render(<Header nav={NAV} onNouveauPatient={onNouveauPatient} />)

      fireEvent.click(screen.getByText('Nouveau patient'))
      fireEvent.click(screen.getByText('Confirmer ?'))

      expect(onNouveauPatient).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Session vidée')).toBeTruthy()
      expect(screen.queryByText('Nouveau patient')).toBeNull()

      act(() => {
        vi.runAllTimers()
      })

      expect(screen.getByText('Nouveau patient')).toBeTruthy()
      expect(screen.queryByText('Session vidée')).toBeNull()
    })

    it("le bouton reste cliquable pendant l'état transitoire (pas de `disabled`)", () => {
      const onNouveauPatient = vi.fn()
      render(<Header nav={NAV} onNouveauPatient={onNouveauPatient} />)

      fireEvent.click(screen.getByText('Nouveau patient'))
      fireEvent.click(screen.getByText('Confirmer ?'))

      const button = screen.getByText('Session vidée').closest('button')
      expect(button?.disabled).toBe(false)
    })
  })
})

describe("Header — compteur d'état de la mémoire de session (T-056)", () => {
  it("n'affiche rien quand la mémoire est vide", () => {
    render(<Header nav={NAV} onNouveauPatient={vi.fn()} />)
    expect(screen.queryByText(/^Session\s*:/)).toBeNull()
  })

  it('affiche le compte après mémorisation de deux critères, disparaît après purge', () => {
    const criteres: CritereEntree[] = [
      { nom: 'a', type: 'nombre', min: 0, max: 10, partage: true },
      { nom: 'b', type: 'nombre', min: 0, max: 10, partage: true },
    ]
    memoriserCriteres(criteres, { a: 1, b: 2 }, new Set(['a', 'b']))

    const { unmount } = render(<Header nav={NAV} onNouveauPatient={vi.fn()} />)
    expect(screen.getByText('Session : 2 valeurs')).toBeTruthy()
    unmount()

    reinitialiserSession()
    render(<Header nav={NAV} onNouveauPatient={vi.fn()} />)
    expect(screen.queryByText(/^Session\s*:/)).toBeNull()
  })

  it('accord au singulier à une seule valeur mémorisée', () => {
    const criteres: CritereEntree[] = [{ nom: 'a', type: 'nombre', min: 0, max: 10, partage: true }]
    memoriserCriteres(criteres, { a: 1 }, new Set(['a']))

    render(<Header nav={NAV} onNouveauPatient={vi.fn()} />)
    expect(screen.getByText('Session : 1 valeur')).toBeTruthy()
  })
})

/**
 * T-159 (P13/S8) — le compteur devient cliquable : un clic ouvre un panneau listant les NOMS des
 * critères mémorisés et leur origine, jamais leur valeur (invariant CLAUDE.md 1 — `criteresSession()` en
 * est la seule source, testée nommément dans `sessionCriteres.test.ts`). Ce fichier vérifie le CÂBLAGE
 * côté `Header` : le clic ouvre/ferme le panneau, le texte affiché est bien les LIBELLÉS (pas les noms
 * bruts de critère), et — répétition volontaire du garde-fou, à ce niveau d'intégration — aucune valeur
 * saisie n'apparaît nulle part dans le DOM rendu.
 */
describe("Header — compteur cliquable, noms de critères sans valeur (T-159)", () => {
  it('fermé par défaut ; un clic ouvre le panneau et liste les critères mémorisés (libellé + origine)', () => {
    const criteres: CritereEntree[] = [
      { nom: 'HbA1c_actuelle', type: 'nombre', min: 0, max: 20, partage: true },
      { nom: 'HbA1c_cible', type: 'nombre', min: 0, max: 20, partage: true },
    ]
    // Une valeur RECONNAISSABLE (improbable) pour prouver, au test suivant, qu'elle ne fuite nulle part.
    memoriserCriteres(criteres, { HbA1c_actuelle: 12.34, HbA1c_cible: 6.5 }, new Set(['HbA1c_actuelle', 'HbA1c_cible']))

    render(<Header nav={NAV} onNouveauPatient={vi.fn()} />)
    const bouton = screen.getByRole('button', { name: /Session : 2 valeurs/ })
    expect(bouton.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('region', { name: /Critères mémorisés/i })).toBeNull()

    fireEvent.click(bouton)

    expect(bouton.getAttribute('aria-expanded')).toBe('true')
    const panneau = screen.getByRole('region', { name: /Critères mémorisés/i })
    // Libellés RÉDIGÉS (`labelForCritere`), pas les identifiants bruts de contenu.
    expect(panneau.textContent).toContain('HbA1c actuelle')
    expect(panneau.textContent).toContain('HbA1c cible')

    fireEvent.click(bouton)
    expect(bouton.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('region', { name: /Critères mémorisés/i })).toBeNull()
  })

  it("invariant CLAUDE.md 1 : aucune VALEUR saisie n'apparaît dans le DOM rendu, panneau ouvert", () => {
    const criteres: CritereEntree[] = [
      { nom: 'HbA1c_actuelle', type: 'nombre', min: 0, max: 999, partage: true },
    ]
    memoriserCriteres(criteres, { HbA1c_actuelle: 987.654 }, new Set(['HbA1c_actuelle']))

    const { container } = render(<Header nav={NAV} onNouveauPatient={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /Session : 1 valeur/ }))

    expect(container.innerHTML).not.toContain('987.654')
    expect(container.innerHTML).not.toContain('987,654')
  })

  it("distingue « saisi » et « repris d'un autre écran » selon l'origine mémorisée", () => {
    const criteres: CritereEntree[] = [
      { nom: 'HbA1c_actuelle', type: 'nombre', min: 0, max: 20, partage: true },
      { nom: 'HbA1c_cible', type: 'nombre', min: 0, max: 20, partage: true },
    ]
    memoriserCriteres(
      criteres,
      { HbA1c_actuelle: 9, HbA1c_cible: 7 },
      new Set(['HbA1c_actuelle', 'HbA1c_cible']),
      new Set(['HbA1c_cible']), // seul HbA1c_cible est encore `repris` au moment de l'appel.
    )

    const { container } = render(<Header nav={NAV} onNouveauPatient={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /Session : 2 valeurs/ }))

    // Un item par critère, dans l'ORDRE D'INSERTION (`HbA1c_actuelle` puis `HbA1c_cible`, cf.
    // `sessionCriteres.test.ts`) : chaque `<li>` isolé plutôt qu'un `textContent` global, pour vérifier
    // l'APPARIEMENT nom↔origine, pas seulement la présence des deux textes quelque part dans le panneau.
    const items = [...container.querySelectorAll('.header__session-detail-item')]
    expect(items).toHaveLength(2)
    expect(items[0].textContent).toContain('HbA1c actuelle')
    expect(items[0].textContent).toContain('saisi')
    expect(items[0].textContent).not.toContain('repris')
    expect(items[1].textContent).toContain('HbA1c cible')
    expect(items[1].textContent).toContain("repris d'un autre écran")
  })
})
