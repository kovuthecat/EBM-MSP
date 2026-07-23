import { Component, type ErrorInfo, type ReactNode } from 'react'
import type { Navigation } from '../navigation'
import './ScreenErrorBoundary.css'

interface ScreenErrorBoundaryProps {
  /** Pour revenir à l'accueil sans recharger la page (état volatile perdu de toute façon, D4). */
  go: Navigation['go']
  children: ReactNode
}

interface ScreenErrorBoundaryState {
  error: Error | null
}

/**
 * Filet de sécurité de rendu : sans cette limite, une exception non rattrapée (ex. `ConditionError`
 * propagée volontairement par le moteur — `engine/conditions.ts`, `engine/evaluateNode.ts` — sur un
 * contenu incohérent) fait disparaître tout l'arbre React, laissant un écran **blanc** en production
 * (aucun overlay d'erreur hors dev). Ce composant affiche l'erreur au lieu de la faire disparaître :
 * cohérent avec l'invariant du moteur « propager plutôt que masquer un écart » (brief §7,
 * `DecisionNodeScreen.tsx`) — une erreur affichée, pas une page blanche muette.
 *
 * Ne journalise nulle part hors console (aucun réseau au runtime du module Décision, CLAUDE.md
 * invariant 1) ; ne réessaie pas automatiquement (une erreur de contenu ne se résout pas seule).
 */
export class ScreenErrorBoundary extends Component<ScreenErrorBoundaryProps, ScreenErrorBoundaryState> {
  state: ScreenErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ScreenErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erreur de rendu capturée par ScreenErrorBoundary :', error, info.componentStack)
  }

  private reinitialiser = () => {
    this.setState({ error: null })
    this.props.go('home')
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="screen-error">
        <div className="screen-error__title">Cet écran n'a pas pu s'afficher</div>
        <p className="screen-error__text">
          Une incohérence de contenu ou d'affichage a interrompu le rendu. Ceci n'affecte aucune
          donnée patient (aucune saisie n'est enregistrée). Signalez ce message au référent.
        </p>
        <pre className="screen-error__detail">{error.message}</pre>
        <button type="button" className="screen-error__button" onClick={this.reinitialiser}>
          ← Retour à l'accueil
        </button>
      </div>
    )
  }
}
