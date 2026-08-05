import { useMemo, useState } from 'react'
import type { Navigation } from '../../shared/navigation'
import { Icon } from '../../shared/icons/Icon'
import type { NomIcone } from '../../shared/icons/paths'
import { entreesListe } from '../content/loadModules'
import { noeudsParDomaine } from '../content/loadNodes'
import { labelForDomaine, sortNodesForDomaine, UPCOMING_DOMAINS } from '../lib/labels'
import './DecisionDomainsScreen.css'

/**
 * Icône de repli (T-149) quand un module/nœud ne déclare pas `icone` dans son contenu — jamais une
 * erreur, jamais un vide : `lecture` (existe déjà dans le kit, cf. `shared/icons/paths.ts`) se lit
 * comme un neutre générique « ouvrir/consulter ». Le composant reste générique (aucun nom de nœud
 * connu ici, invariant CLAUDE.md 5) : c'est le CONTENU qui choisit l'icône, cet écran se contente
 * d'un repli quand il n'en déclare pas.
 */
const ICONE_REPLI: NomIcone = 'lecture'

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
  // Regroupement par module (D22), appliqué APRÈS le tri : un module prend la place de son premier
  // nœud, donc l'ordre voulu par `NODE_ORDER` est préservé sans que `entreesListe` ait à le connaître.
  const entrees = useMemo(() => entreesListe(nodes), [nodes])

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
        {entrees.map((entree) =>
          entree.type === 'module' ? (
            // Un MODULE (D22) compte pour UNE entrée : ses nœuds ne sont pas listés ici, ils s'ouvrent
            // depuis l'écran de module après son cadrage partagé. Lister les deux à la fois annulerait
            // l'intérêt du module — le praticien entrerait dans un nœud sans avoir vu le cadrage.
            // SOUS-TITRE (liste des nœuds du module) RETIRÉ (T-149, demande utilisateur) : l'écran de
            // module affiche déjà ce détail après clic, ici il alourdissait la carte sans ajouter
            // d'information utile à la décision « quel algorithme ouvrir ».
            <button
              key={`module-${entree.module.id}`}
              type="button"
              className="decision-domains__node"
              onClick={() => go('decisionModule', { moduleId: entree.module.id })}
            >
              <span className="decision-domains__node-icon" aria-hidden="true">
                <Icon nom={entree.module.icone ?? ICONE_REPLI} taille={20} />
              </span>
              <span className="decision-domains__node-title">{entree.module.titre}</span>
              <Icon nom="chevron-droite" taille={16} className="decision-domains__node-chevron" />
            </button>
          ) : (
            <button
              key={entree.noeud.id}
              type="button"
              className="decision-domains__node"
              onClick={() => go('decisionNode', { nodeId: entree.noeud.id })}
            >
              <span className="decision-domains__node-icon" aria-hidden="true">
                <Icon nom={entree.noeud.icone ?? ICONE_REPLI} taille={20} />
              </span>
              <span className="decision-domains__node-title">{entree.noeud.titre}</span>
              {entree.noeud.veille_liee.length > 0 && (
                <span className="decision-domains__node-badge">Mis à jour par la veille</span>
              )}
              <Icon nom="chevron-droite" taille={16} className="decision-domains__node-chevron" />
            </button>
          ),
        )}
      </section>
    </div>
  )
}
