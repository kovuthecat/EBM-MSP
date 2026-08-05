import { useState } from 'react'
import type { Navigation, NavigationParams, Screen } from './features/shared/navigation'
import { useNavigation } from './features/shared/navigation'
import { AppShell } from './features/shared/layout/AppShell'
import { HomeScreen } from './features/shared/screens/HomeScreen'
import { MethodeScreen } from './features/shared/screens/MethodeScreen'
import { DecisionDomainsScreen } from './features/decision/screens/DecisionDomainsScreen'
import { DecisionModuleScreen } from './features/decision/screens/DecisionModuleScreen'
import { DecisionNodeScreen } from './features/decision/screens/DecisionNodeScreen'
import { VeilleListScreen } from './features/veille/screens/VeilleListScreen'
import { reinitialiserSession } from './features/decision/lib/sessionCriteres'

function App() {
  const nav = useNavigation()

  // T-026/D33 — « Nouveau patient ». Compteur jamais lu pour sa valeur, seulement injecté dans les `key`
  // ci-dessous : il force un remontage MÊME quand l'écran et le nœud ne changent pas (D-13 : rouvrir le
  // MÊME nœud devait déjà, à lui seul, repartir vierge). `App.tsx` est le seul composant qui connaît à la
  // fois la session (`sessionCriteres.ts`) et le mécanisme de remontage par `key` (D28) : c'est pourquoi
  // la purge est orchestrée ici plutôt que dans `Header.tsx`, qui ne porte que le geste et sa confirmation.
  const [resetEpoch, setResetEpoch] = useState(0)

  const handleNouveauPatient = () => {
    reinitialiserSession()
    setResetEpoch((epoch) => epoch + 1)
  }

  return (
    <AppShell nav={nav} onNouveauPatient={handleNouveauPatient}>
      {renderScreen(nav.screen, nav.params, nav.go, resetEpoch)}
    </AppShell>
  )
}

/**
 * Écrans livrés : Home (D1), Méthode (S1), Décision D2/D3 (S4). Le reste
 * (V1-V5 Veille, Profil, Pour mémoire, Auth) est hors périmètre de P1 :
 * placeholder neutre, pas de page à styliser (cf. plans/P1/S4.md — Hors périmètre).
 */
function renderScreen(screen: Screen, params: NavigationParams, go: Navigation['go'], resetEpoch: number) {
  switch (screen) {
    case 'home':
      return <HomeScreen key={resetEpoch} go={go} />
    case 'methode':
      return <MethodeScreen key={resetEpoch} />
    case 'decisionDomains':
      return <DecisionDomainsScreen key={resetEpoch} go={go} />
    case 'decisionModule':
      return <DecisionModuleScreen key={resetEpoch} moduleId={params.moduleId} go={go} />
    case 'decisionNode':
      // `key` force un remontage (et donc une réinitialisation des critères) quand on change de
      // nœud sans repasser par D2 (ex. lien direct entre deux nœuds, pas utilisé en P1 mais robuste),
      // ET quand `resetEpoch` avance (« Nouveau patient », T-026/D33) — y compris SANS changer de nœud :
      // rouvrir le MÊME écran doit repartir vierge, pas seulement le suivant (cf. D-13).
      return <DecisionNodeScreen key={`${resetEpoch}:${params.nodeId}`} nodeId={params.nodeId} go={go} />
    case 'veilleList':
      // V1 (PV1/S6). `veilleDetail` reste au placeholder : le détail est déplié dans la carte, le
      // temps d'arbitrer le format et les options de tri.
      return <VeilleListScreen key={resetEpoch} />
    default:
      return <PlaceholderScreen key={resetEpoch} go={go} />
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
