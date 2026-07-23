import { useCallback, useState } from 'react'

/**
 * Écrans de l'application. Navigation state-based (DECISIONS.md D9) : pas de
 * routeur, `screen` vit dans l'état React. Les 9 écrans couvrent 1:1 les
 * écrans du prototype (D1, D2, D3, V1-V5, S1) — cf. ARCHITECTURE.md.
 */
export type Screen =
  | 'home'
  | 'decisionDomains'
  | 'decisionNode'
  | 'veilleList'
  | 'veilleDetail'
  | 'profile'
  | 'memory'
  | 'auth'
  | 'methode'

export interface NavigationParams {
  nodeId?: string
  articleId?: string
}

export interface Navigation {
  screen: Screen
  params: NavigationParams
  go: (screen: Screen, params?: NavigationParams) => void
}

/** État de navigation minimal : `{ screen, params, go(screen, params?) }`. */
export function useNavigation(initial: Screen = 'home'): Navigation {
  const [screen, setScreen] = useState<Screen>(initial)
  const [params, setParams] = useState<NavigationParams>({})

  const go = useCallback((next: Screen, nextParams: NavigationParams = {}) => {
    setScreen(next)
    setParams(nextParams)
  }, [])

  return { screen, params, go }
}

/**
 * Écrans sans chrome (header + bandeau disclaimer), à l'image de `showChrome`
 * dans le prototype : masqué sur `home` et `auth`.
 */
export function isChromeless(screen: Screen): boolean {
  return screen === 'home' || screen === 'auth'
}

/**
 * Écrans du module Veille : le bandeau disclaimer (« Outil d'aide à la décision... ») ne les
 * concerne pas, ce module n'étant pas un outil de décision (directive de Thibault, 2026-07-23).
 */
export function isVeilleScreen(screen: Screen): boolean {
  return screen === 'veilleList' || screen === 'veilleDetail'
}
