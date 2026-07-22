import { useMemo, useState } from 'react'
import type { Navigation } from '../../shared/navigation'
import type { Noeud } from '../content/node.types'
import { noeudsParDomaine } from '../content/loadNodes'
import { formatDateRevue, labelForDomaine, UPCOMING_DOMAINS } from '../lib/labels'
import './DecisionDomainsScreen.css'

interface DecisionDomainsScreenProps {
  go: Navigation['go']
}

interface ThemeGroup {
  theme: string
  nodes: Noeud[]
}

/**
 * Regroupe les nœuds d'un domaine par thème d'affichage (T-005 étape 1 ; ARCHITECTURE.md D2 :
 * « Regroupement des nœuds par thème (pour DT2 : cible, 1re intention, intensification…) »).
 *
 * Le schéma de contenu (`schema/noeud.schema.json`, `node.types.ts`) ne porte **pas** de champ
 * `theme` dédié — S4.md T-005 "Si bloqué" cite précisément cet exemple de champ manquant. Plutôt que
 * d'inventer une valeur ou de modifier le contenu/schéma (hors périmètre S4), ce groupement utilise
 * `noeud.titre` : un champ réel, déjà rédigé, qui coïncide 1:1 avec la notion de « thème » telle que
 * documentée pour DT2 (`docs/decision/00-global.md` : chaque nœud A→H a sa propre catégorie, pas de
 * partage entre nœuds). Conséquence assumée en P1 (un seul nœud) : l'intitulé de groupe et le titre
 * de la carte qu'il contient sont identiques — cf. bloc « Décision D2 » de `VALIDATION.md` pour
 * validation visuelle. Si un futur nœud doit partager un thème avec un autre sans partager son
 * titre, ce mécanisme ne suffira plus : ajouter un champ `theme` au schéma (décision hors périmètre
 * S4, pas de contournement UI).
 */
function groupByTheme(nodes: Noeud[]): ThemeGroup[] {
  const groups: ThemeGroup[] = []
  const indexByTheme = new Map<string, number>()
  for (const node of nodes) {
    const theme = node.titre
    const existingIndex = indexByTheme.get(theme)
    if (existingIndex === undefined) {
      indexByTheme.set(theme, groups.length)
      groups.push({ theme, nodes: [node] })
    } else {
      groups[existingIndex].nodes.push(node)
    }
  }
  return groups
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

  const nodes = selectedDomaine ? (noeudsParDomaine[selectedDomaine] ?? []) : []
  const groups = useMemo(() => groupByTheme(nodes), [nodes])

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

      {groups.length === 0 && (
        <p className="decision-domains__empty">Aucun algorithme disponible pour ce domaine.</p>
      )}

      {groups.map((group) => (
        <section key={group.theme} className="decision-domains__group">
          <h2 className="decision-domains__group-title">{group.theme}</h2>
          {group.nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className="decision-domains__node"
              onClick={() => go('decisionNode', { nodeId: node.id })}
            >
              <span className="decision-domains__node-info">
                <span className="decision-domains__node-title">{node.titre}</span>
                <span className="decision-domains__node-meta">
                  {node.population_cible} · révisé {formatDateRevue(node.meta.date_revue)}
                </span>
              </span>
              {node.veille_liee.length > 0 && (
                <span className="decision-domains__node-badge">Mis à jour par la veille</span>
              )}
            </button>
          ))}
        </section>
      ))}
    </div>
  )
}
