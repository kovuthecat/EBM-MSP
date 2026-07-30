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
