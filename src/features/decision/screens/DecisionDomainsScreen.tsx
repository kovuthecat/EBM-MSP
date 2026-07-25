import { useMemo, useState } from 'react'
import type { Navigation } from '../../shared/navigation'
import { noeudsParDomaine } from '../content/loadNodes'
import { labelForDomaine, sortNodesForDomaine, UPCOMING_DOMAINS } from '../lib/labels'
import './DecisionDomainsScreen.css'

interface DecisionDomainsScreenProps {
  go: Navigation['go']
}

/**
 * D2 — sélecteur de domaine + liste des nœuds (S4.md T-005). Domaines et nœuds dérivés du contenu
 * réel (`loadNodes`, DECISIONS.md D8) : rien en dur, sauf les domaines « à venir » (chips
 * désactivés, libellés fixes explicitement autorisés — `lib/labels.ts` `UPCOMING_DOMAINS`). Même
 * avec un seul domaine actif, l'en-tête de sélection est prévu (DECISIONS.md D8/D9).
 */
export function DecisionDomainsScreen({ go }: DecisionDomainsScreenProps) {
  const activeDomaines = useMemo(() => Object.keys(noeudsParDomaine), [])
  const [selectedDomaine, setSelectedDomaine] = useState<string | undefined>(activeDomaines[0])
  const upcoming = useMemo(
    () => UPCOMING_DOMAINS.filter((domaine) => !activeDomaines.includes(domaine.slug)),
    [activeDomaines],
  )

  const nodes = useMemo(
    () => (selectedDomaine ? sortNodesForDomaine(selectedDomaine, noeudsParDomaine[selectedDomaine] ?? []) : []),
    [selectedDomaine],
  )

  return (
    <div className="decision-domains">
      <h1 className="decision-domains__title">Aide à la décision</h1>
      <p className="decision-domains__subtitle">Choisissez un domaine, puis un algorithme.</p>

      <div className="decision-domains__chips">
        {activeDomaines.map((domaine) => (
          <button
            key={domaine}
            type="button"
            className={
              domaine === selectedDomaine
                ? 'decision-domains__chip decision-domains__chip--active'
                : 'decision-domains__chip'
            }
            onClick={() => setSelectedDomaine(domaine)}
          >
            {labelForDomaine(domaine)}
          </button>
        ))}
        {upcoming.map((domaine) => (
          <span
            key={domaine.slug}
            className="decision-domains__chip decision-domains__chip--upcoming"
          >
            {domaine.label} · à venir
          </span>
        ))}
      </div>

      {nodes.length === 0 && (
        <p className="decision-domains__empty">Aucun algorithme disponible pour ce domaine.</p>
      )}

      <section className="decision-domains__group">
        {nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            className="decision-domains__node"
            onClick={() => go('decisionNode', { nodeId: node.id })}
          >
            <span className="decision-domains__node-info">
              <span className="decision-domains__node-title">{node.titre}</span>
            </span>
            {node.veille_liee.length > 0 && (
              <span className="decision-domains__node-badge">Mis à jour par la veille</span>
            )}
          </button>
        ))}
      </section>
    </div>
  )
}
