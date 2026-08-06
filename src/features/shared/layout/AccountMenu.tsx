import type { Screen } from '../navigation'
import { seDeconnecter, useUtilisateur } from '../lib/auth'
import './AccountMenu.css'

interface AccountMenuProps {
  open: boolean
  onToggle: () => void
  onNavigate: (screen: Screen) => void
}

/**
 * Menu compte (D51, 2026-08-06) — état RÉEL désormais (mêmes comptes que `annuaire-msp`, cf.
 * `shared/lib/auth.ts`) : « Invité » + « Se connecter » redevient l'initiale de l'email connecté +
 * « Se déconnecter ». `profile`/`memory` restent des écrans placeholder (hors périmètre, cf.
 * `App.tsx`) — seule la connexion elle-même est réelle.
 */
export function AccountMenu({ open, onToggle, onNavigate }: AccountMenuProps) {
  const utilisateur = useUtilisateur()
  const connecte = Boolean(utilisateur)
  const initiale = utilisateur?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="account-menu">
      <button type="button" className="account-menu__trigger" onClick={onToggle}>
        <span className="account-menu__avatar" aria-hidden="true">
          {initiale}
        </span>
        {connecte ? utilisateur!.email : 'Invité'}
      </button>
      {open && (
        <div className="account-menu__dropdown">
          <button type="button" onClick={() => onNavigate('profile')}>
            Profil
          </button>
          <button type="button" onClick={() => onNavigate('memory')}>
            Pour mémoire
          </button>
          {connecte ? (
            <button type="button" className="account-menu__login" onClick={() => void seDeconnecter()}>
              Se déconnecter
            </button>
          ) : (
            <button
              type="button"
              className="account-menu__login"
              onClick={() => onNavigate('auth')}
            >
              Se connecter
            </button>
          )}
        </div>
      )}
    </div>
  )
}
