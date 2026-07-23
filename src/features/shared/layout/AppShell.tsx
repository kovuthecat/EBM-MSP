import type { ReactNode } from 'react'
import type { Navigation } from '../navigation'
import { isChromeless, isVeilleScreen } from '../navigation'
import { Header } from './Header'
import { DisclaimerBar } from './DisclaimerBar'
import { ScreenErrorBoundary } from './ScreenErrorBoundary'
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
 *
 * Périmètre volontaire du `ScreenErrorBoundary` (D17) : n'enveloppe que `{children}` (le contenu
 * d'écran, source du crash constaté — `DecisionNodeScreen`/moteur), PAS `Header`/`DisclaimerBar`, qui
 * restent quasi statiques (liens de navigation) — risque de rendu jugé négligeable. À élargir si un
 * jour ces composants deviennent dynamiques (relevé en vérification red-team de D17).
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
      <main className="app-shell__content">
        {/* `key` remonte la limite (et efface son état d'erreur) à chaque changement d'écran ou de
            nœud — sinon une navigation via le header (pas via le bouton de la limite) laisserait
            l'écran d'erreur affiché par-dessus un écran suivant pourtant valide. */}
        <ScreenErrorBoundary key={`${nav.screen}:${nav.params.nodeId ?? ''}`} go={nav.go}>
          {children}
        </ScreenErrorBoundary>
      </main>
    </div>
  )
}
