import { useEffect, useRef, useState } from 'react'
import type { Navigation } from '../navigation'
import { AccountMenu } from './AccountMenu'
import './Header.css'

// T-034/P5 — durée d'affichage du retour transitoire après la purge « Nouveau patient ». Assez long pour
// être remarqué au coin de l'œil, assez court pour ne pas gêner un second geste volontaire.
const JUST_CLEARED_DURATION_MS = 1800

interface HeaderProps {
  nav: Navigation
  /**
   * T-026/D33 — « Nouveau patient » : purge la mémoire de session ET force le remontage des écrans.
   * Orchestré par le composant racine (`App.tsx`, seul endroit qui connaît à la fois `sessionCriteres.ts`
   * et le mécanisme de remontage par `key`, D28) ; ce composant ne porte que le geste et sa confirmation.
   */
  onNouveauPatient: () => void
}

/**
 * Header sticky : logo, pills Décision/Veille (état actif selon l'écran),
 * lien Méthode, bouton « Nouveau patient » (T-026/D33), menu compte. Reproduit le bloc `showChrome` du
 * prototype (lignes ~19-54 du `.dc.html`), à l'exception du bouton « Nouveau patient » qui n'existe pas
 * dans le prototype (défaut de recette D-13, corrigé le 2026-07-28).
 */
export function Header({ nav, onNouveauPatient }: HeaderProps) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)

  // T-034/P5 — retour visuel transitoire après la purge : sans lui, rien à l'écran ne distingue
  // « j'ai annulé » de « ça n'a rien fait » (BILAN-P4-2026-07-28.md §2bis). Local au bouton, comme
  // `accountMenuOpen` juste au-dessus — pas de composant de dialogue ni de toast partagé.
  const [justCleared, setJustCleared] = useState(false)
  const justClearedTimeoutRef = useRef<number | null>(null)

  // Nettoie le timeout si le composant démonte pendant l'état transitoire (évite un setState orphelin).
  useEffect(() => {
    return () => {
      if (justClearedTimeoutRef.current !== null) {
        window.clearTimeout(justClearedTimeoutRef.current)
      }
    }
  }, [])

  // Geste DESTRUCTIF, à portée d'un clic parasite en consultation (D-13) : confirmation simple avant de
  // purger. `window.confirm` — l'application n'a aucun composant de dialogue existant, en installer un
  // pour ce seul geste serait disproportionné (S5.md T-026, étape 3).
  const handleNouveauPatientClick = () => {
    const confirme = window.confirm(
      'Vider la session en cours et repartir avec un nouveau patient ? Les valeurs saisies non enregistrées seront perdues.',
    )
    if (!confirme) return

    onNouveauPatient()

    // Affiche le retour transitoire, puis revient à l'état normal après un court délai. Le bouton reste
    // cliquable entre-temps (pas de `disabled`) : un praticien qui rouvre tout de suite doit pouvoir le
    // refaire.
    setJustCleared(true)
    if (justClearedTimeoutRef.current !== null) {
      window.clearTimeout(justClearedTimeoutRef.current)
    }
    justClearedTimeoutRef.current = window.setTimeout(() => {
      setJustCleared(false)
      justClearedTimeoutRef.current = null
    }, JUST_CLEARED_DURATION_MS)
  }

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

      {/* T-026/D33 — à droite, hors du chemin de lecture du contenu clinique (jamais dans le formulaire
          ni près d'une action de saisie), à distance du menu compte pour ne pas se confondre avec un
          réglage de profil : c'est un geste de fin de consultation, pas un réglage. */}
      <button
        type="button"
        className={
          justCleared
            ? 'header__nouveau-patient header__nouveau-patient--vide'
            : 'header__nouveau-patient'
        }
        onClick={handleNouveauPatientClick}
      >
        {justCleared ? 'Session vidée' : 'Nouveau patient'}
      </button>

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
