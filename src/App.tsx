import type { Navigation, NavigationParams, Screen } from './features/shared/navigation'
import { useNavigation } from './features/shared/navigation'
import { AppShell } from './features/shared/layout/AppShell'
import { HomeScreen } from './features/shared/screens/HomeScreen'
import { MethodeScreen } from './features/shared/screens/MethodeScreen'
import { DecisionDomainsScreen } from './features/decision/screens/DecisionDomainsScreen'
import { DecisionNodeScreen } from './features/decision/screens/DecisionNodeScreen'

function App() {
  const nav = useNavigation()

  return <AppShell nav={nav}>{renderScreen(nav.screen, nav.params, nav.go)}</AppShell>
}

/**
 * Écrans livrés : Home (D1), Méthode (S1), Décision D2/D3 (S4). Le reste
 * (V1-V5 Veille, Profil, Pour mémoire, Auth) est hors périmètre de P1 :
 * placeholder neutre, pas de page à styliser (cf. plans/P1/S4.md — Hors périmètre).
 */
function renderScreen(screen: Screen, params: NavigationParams, go: Navigation['go']) {
  switch (screen) {
    case 'home':
      return <HomeScreen go={go} />
    case 'methode':
      return <MethodeScreen />
    case 'decisionDomains':
      return <DecisionDomainsScreen go={go} />
    case 'decisionNode':
      // `key` force un remontage (et donc une réinitialisation des critères) quand on change de
      // nœud sans repasser par D2 (ex. lien direct entre deux nœuds, pas utilisé en P1 mais robuste).
      return <DecisionNodeScreen key={params.nodeId} nodeId={params.nodeId} go={go} />
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
