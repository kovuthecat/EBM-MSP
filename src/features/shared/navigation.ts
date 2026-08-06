import { useCallback, useState } from 'react'

/**
 * Écrans de l'application. Navigation state-based (DECISIONS.md D9) : pas de
 * routeur, `screen` vit dans l'état React. Les écrans D1-D3/V1-V5/S1 du
 * prototype — cf. ARCHITECTURE.md — plus `decisionDomainNodes` (D2b, T-152).
 *
 * D2 SCINDÉ EN DEUX (2026-08-06, T-152, demande utilisateur) : le prototype et `ARCHITECTURE.md`
 * documentaient un seul écran « choix du domaine puis liste des nœuds » (chips de domaine + liste
 * combinées). Motif de la scission : la liste des domaines est amenée à croître (roadmap `ARCHITECTURE.md`
 * D2/PROJECT_BRIEF.md — six domaines déjà annoncés en « à venir », T-150) et une rangée de chips en tête
 * de la liste des nœuds ne passe pas à l'échelle. `decisionDomains` reste l'écran de choix du DOMAINE
 * (D2a, cartes façon accueil, un domaine = une carte) ; `decisionDomainNodes` (D2b, nouveau) affiche la
 * liste des nœuds/modules du domaine choisi, avec un fil d'Ariane vers D2a plutôt qu'un sélecteur en
 * tête de page.
 */
export type Screen =
  | 'home'
  /** D2a — choix du DOMAINE (cartes), T-152. */
  | 'decisionDomains'
  /** D2b — liste des nœuds/modules du domaine choisi (ex-D2, sans le sélecteur), T-152. */
  | 'decisionDomainNodes'
  /** Écran de MODULE (D22) : cadrage partagé + primer d'orientation, entre la liste et un nœud. */
  | 'decisionModule'
  | 'decisionNode'
  | 'veilleList'
  | 'veilleDetail'
  | 'profile'
  | 'memory'
  | 'auth'
  | 'methode'

export interface NavigationParams {
  nodeId?: string
  /** Id de module pour l'écran `decisionModule` (D22). */
  moduleId?: string
  /** Slug de domaine (ex. `diabete-type-2`) pour l'écran `decisionDomainNodes` (D2b, T-152). */
  domaine?: string
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
