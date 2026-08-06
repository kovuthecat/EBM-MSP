import { useMemo } from 'react'
import type { Navigation } from '../../shared/navigation'
import { Icon } from '../../shared/icons/Icon'
import { noeudsParDomaine } from '../content/loadNodes'
import { iconeForDomaine, labelForDomaine, UPCOMING_DOMAINS } from '../lib/labels'
import './DecisionDomainsScreen.css'

interface DecisionDomainsScreenProps {
  go: Navigation['go']
}

/**
 * D2a — choix du DOMAINE (T-152, demande utilisateur). Domaines dérivés du contenu réel (`loadNodes`,
 * DECISIONS.md D8) : rien en dur, sauf les domaines « à venir » (cartes désactivées, libellés fixes
 * explicitement autorisés — `lib/labels.ts` `UPCOMING_DOMAINS`).
 *
 * SCINDÉ DE L'ANCIEN D2 (qui combinait ce choix ET la liste des nœuds) : la liste des domaines est
 * amenée à croître (six domaines déjà annoncés en « à venir ») et ne peut plus rester une rangée de
 * chips en tête de la liste des nœuds — cf. le commentaire de `Screen` dans `shared/navigation.ts`.
 * Clic sur un domaine actif → `decisionDomainNodes` (D2b), avec le slug en paramètre.
 */
export function DecisionDomainsScreen({ go }: DecisionDomainsScreenProps) {
  const activeDomaines = useMemo(() => Object.keys(noeudsParDomaine), [])

  return (
    <div className="decision-domains">
      <h1 className="decision-domains__title">Aide à la décision</h1>
      <p className="decision-domains__subtitle">Choisissez un domaine clinique.</p>

      <section className="decision-domains__domain-grid">
        {activeDomaines.map((domaine) => (
          <button
            key={domaine}
            type="button"
            className="decision-domains__domain-card"
            onClick={() => go('decisionDomainNodes', { domaine })}
          >
            <span className="decision-domains__domain-icon" aria-hidden="true">
              <Icon nom={iconeForDomaine(domaine) ?? 'lecture'} taille={22} />
            </span>
            <span className="decision-domains__domain-label">{labelForDomaine(domaine)}</span>
          </button>
        ))}
        {UPCOMING_DOMAINS.map((domaine) => (
          <span
            key={domaine.slug}
            className="decision-domains__domain-card decision-domains__domain-card--upcoming"
          >
            <span className="decision-domains__domain-icon" aria-hidden="true">
              <Icon nom={domaine.icone} taille={22} />
            </span>
            <span className="decision-domains__domain-label">{domaine.label}</span>
            <span className="decision-domains__domain-upcoming-badge">À venir</span>
          </span>
        ))}
      </section>
    </div>
  )
}
