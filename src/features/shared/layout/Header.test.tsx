// @vitest-environment jsdom

/**
 * Bouton « Nouveau patient » (T-026/D33) — le geste lui-même, isolé de la session et du remontage des
 * écrans (couverts séparément par `src/features/decision/lib/sessionCriteres.remount.test.tsx`, qui
 * exerce `App.tsx`/`sessionCriteres.ts` bout en bout). Ici, `Header` est testé seul : la confirmation
 * (`window.confirm`) doit se produire AVANT tout appel à `onNouveauPatient`, et un annulé ne doit
 * strictement rien déclencher — c'est la seule garde entre un clic parasite en consultation et une
 * purge réelle (D-13).
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Navigation } from '../navigation'
import { Header } from './Header'

afterEach(cleanup)

const NAV: Navigation = { screen: 'decisionDomains', params: {}, go: () => {} }

describe('Header — bouton « Nouveau patient »', () => {
  it('demande confirmation puis appelle `onNouveauPatient` si le praticien confirme', () => {
    const onNouveauPatient = vi.fn()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<Header nav={NAV} onNouveauPatient={onNouveauPatient} />)
    fireEvent.click(screen.getByText('Nouveau patient'))

    expect(confirmSpy).toHaveBeenCalledTimes(1)
    expect(onNouveauPatient).toHaveBeenCalledTimes(1)

    confirmSpy.mockRestore()
  })

  it("n'appelle PAS `onNouveauPatient` si le praticien annule la confirmation — clic parasite sans effet", () => {
    const onNouveauPatient = vi.fn()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<Header nav={NAV} onNouveauPatient={onNouveauPatient} />)
    fireEvent.click(screen.getByText('Nouveau patient'))

    expect(confirmSpy).toHaveBeenCalledTimes(1)
    expect(onNouveauPatient).not.toHaveBeenCalled()

    confirmSpy.mockRestore()
  })

  // T-034/P5 — sans ce retour, rien à l'écran ne distingue « j'ai annulé » de « ça n'a rien fait »
  // (BILAN-P4-2026-07-28.md §2bis). Timers factices : pas de vrai délai dans le test.
  describe('retour visuel transitoire après la purge (T-034)', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it("confirmer affiche « Session vidée » puis revient à « Nouveau patient » après le délai", () => {
      const onNouveauPatient = vi.fn()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      render(<Header nav={NAV} onNouveauPatient={onNouveauPatient} />)
      fireEvent.click(screen.getByText('Nouveau patient'))

      expect(onNouveauPatient).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Session vidée')).toBeTruthy()
      expect(screen.queryByText('Nouveau patient')).toBeNull()

      act(() => {
        vi.runAllTimers()
      })

      expect(screen.getByText('Nouveau patient')).toBeTruthy()
      expect(screen.queryByText('Session vidée')).toBeNull()

      confirmSpy.mockRestore()
    })

    it("annuler la confirmation ne déclenche aucun état transitoire", () => {
      const onNouveauPatient = vi.fn()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

      render(<Header nav={NAV} onNouveauPatient={onNouveauPatient} />)
      fireEvent.click(screen.getByText('Nouveau patient'))

      expect(onNouveauPatient).not.toHaveBeenCalled()
      expect(screen.queryByText('Session vidée')).toBeNull()
      expect(screen.getByText('Nouveau patient')).toBeTruthy()

      act(() => {
        vi.runAllTimers()
      })

      expect(screen.queryByText('Session vidée')).toBeNull()
      expect(screen.getByText('Nouveau patient')).toBeTruthy()

      confirmSpy.mockRestore()
    })

    it('le bouton reste cliquable pendant l\'état transitoire (pas de `disabled`)', () => {
      const onNouveauPatient = vi.fn()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      render(<Header nav={NAV} onNouveauPatient={onNouveauPatient} />)
      fireEvent.click(screen.getByText('Nouveau patient'))

      const button = screen.getByText('Session vidée').closest('button')
      expect(button?.disabled).toBe(false)

      confirmSpy.mockRestore()
    })
  })
})
