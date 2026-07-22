import type { Navigation, NavigationParams, Screen } from './features/shared/navigation'
import { useNavigation } from './features/shared/navigation'
import { AppShell } from './features/shared/layout/AppShell'
import { HomeScreen } from './features/shared/screens/HomeScreen'
import { MethodeScreen } from './features/shared/screens/MethodeScreen'

function App() {
  const nav = useNavigation()

  return <AppShell nav={nav}>{renderScreen(nav.screen, nav.params, nav.go)}</AppShell>
}

/**
 * Écrans livrés : Home (D1), Méthode (S1). Le reste (Décision D2/D3, V1-V5 Veille,
 * Profil, Pour mémoire, Auth) est hors périmètre de cette session : placeholder
 * neutre, pas de page à styliser (cf. plans/P1/S1.md — Hors périmètre).
 */
function renderScreen(screen: Screen, params: NavigationParams, go: Navigation['go']) {
  switch (screen) {
    case 'home':
      return <HomeScreen go={go} />
    case 'methode':
      return <MethodeScreen />
    default:
      return <PlaceholderScreen go={go} />
  }
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
