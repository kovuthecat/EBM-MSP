import type { ReactNode } from 'react'
import type { Navigation } from '../navigation'
import { isChromeless, isVeilleScreen } from '../navigation'
import { Header } from './Header'
import { DisclaimerBar } from './DisclaimerBar'
import './AppShell.css'

interface AppShellProps {
  nav: Navigation
  children: ReactNode
}

/**
 * Shell applicatif : header sticky + bandeau disclaimer quand `showChrome`
 * (masqués sur `home` et `auth`, comme le prototype), puis l'écran courant.
 * Le bandeau disclaimer (propre à l'aide à la décision) ne s'affiche pas sur
 * les écrans du module Veille, qu'il ne concerne pas.
 */
export function AppShell({ nav, children }: AppShellProps) {
  const showChrome = !isChromeless(nav.screen)

  return (
    <div className="app-shell">
      {showChrome && (
        <>
          <Header nav={nav} />
          {!isVeilleScreen(nav.screen) && <DisclaimerBar />}
        </>
      )}
      <main className="app-shell__content">{children}</main>
    </div>
  )
}
