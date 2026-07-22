import type { Screen } from '../navigation'
import './AccountMenu.css'

interface AccountMenuProps {
  open: boolean
  onToggle: () => void
  onNavigate: (screen: Screen) => void
}

/**
 * Menu compte — stub visuel (pas d'auth en P1, cf. Hors périmètre S1) :
 * route vers des écrans placeholder neutres (`profile`, `memory`, `auth`).
 */
export function AccountMenu({ open, onToggle, onNavigate }: AccountMenuProps) {
  return (
    <div className="account-menu">
      <button type="button" className="account-menu__trigger" onClick={onToggle}>
        <span className="account-menu__avatar" aria-hidden="true">
          ?
        </span>
        Invité
      </button>
      {open && (
        <div className="account-menu__dropdown">
          <button type="button" onClick={() => onNavigate('profile')}>
            Profil
          </button>
          <button type="button" onClick={() => onNavigate('memory')}>
            Pour mémoire
          </button>
          <button
            type="button"
            className="account-menu__login"
            onClick={() => onNavigate('auth')}
          >
            Se connecter
          </button>
        </div>
      )}
    </div>
  )
}
