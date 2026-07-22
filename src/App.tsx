import type { Navigation, NavigationParams, Screen } from './features/shared/navigation'
import { useNavigation } from './features/shared/navigation'
import { AppShell } from './features/shared/layout/AppShell'

function App() {
  const nav = useNavigation()

  return <AppShell nav={nav}>{renderScreen(nav.screen, nav.params, nav.go)}</AppShell>
}

/**
 * Aucun écran livré pour l'instant (shell seul) : Home/Méthode arrivent en T-008,
 * Décision D2/D3 en S4. Tout écran → placeholder neutre.
 */
function renderScreen(_screen: Screen, _params: NavigationParams, go: Navigation['go']) {
  return <PlaceholderScreen go={go} />
}

function PlaceholderScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="placeholder-screen">
      <p className="placeholder-screen__text">Bientôt disponible.</p>
      <button type="button" className="placeholder-screen__button" onClick={() => go('home')}>
        Retour à l'accueil
      </button>
    </div>
  )
}

export default App
