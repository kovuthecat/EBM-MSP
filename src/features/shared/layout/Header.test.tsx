// @vitest-environment jsdom

/**
 * Bouton « Nouveau patient » (T-026/D33) — le geste lui-même, isolé de la session et du remontage des
 * écrans (couverts séparément par `src/features/decision/lib/sessionCriteres.remount.test.tsx`, qui
 * exerce `App.tsx`/`sessionCriteres.ts` bout en bout). Ici, `Header` est testé seul : la confirmation
 * (`window.confirm`) doit se produire AVANT tout appel à `onNouveauPatient`, et un annulé ne doit
 * strictement rien déclencher — c'est la seule garde entre un clic parasite en consultation et une
 * purge réelle (D-13).
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
})
