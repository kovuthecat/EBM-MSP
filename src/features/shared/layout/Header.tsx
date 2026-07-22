import { useState } from 'react'
import type { Navigation } from '../navigation'
import { AccountMenu } from './AccountMenu'
import './Header.css'

interface HeaderProps {
  nav: Navigation
}

/**
 * Header sticky : logo, pills Décision/Veille (état actif selon l'écran),
 * lien Méthode, menu compte. Reproduit le bloc `showChrome` du prototype
 * (lignes ~19-54 du `.dc.html`).
 */
export function Header({ nav }: HeaderProps) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)

  const isDecisionActive = nav.screen === 'decisionDomains' || nav.screen === 'decisionNode'
  const isVeilleActive = nav.screen === 'veilleList' || nav.screen === 'veilleDetail'

  return (
    <header className="header">
      <button
        type="button"
        className="header__brand"
        onClick={() => nav.go('home')}
      >
        <span className="header__logo-mark" aria-hidden="true" />
        <span className="header__brand-label">MSP Ménilmontant</span>
      </button>

      <nav className="header__pills" aria-label="Modules">
        <button
          type="button"
          className={
            isDecisionActive ? 'header__pill header__pill--decision-active' : 'header__pill'
          }
          onClick={() => nav.go('decisionDomains')}
        >
          Décision
        </button>
        <button
          type="button"
          className={
            isVeilleActive ? 'header__pill header__pill--veille-active' : 'header__pill'
          }
          onClick={() => nav.go('veilleList')}
        >
          Veille
        </button>
      </nav>

      <button type="button" className="header__methode" onClick={() => nav.go('methode')}>
        Méthode
      </button>

      <div className="header__spacer" />

      <AccountMenu
        open={accountMenuOpen}
        onToggle={() => setAccountMenuOpen((open) => !open)}
        onNavigate={(screen) => {
          setAccountMenuOpen(false)
          nav.go(screen)
        }}
      />
    </header>
  )
}
