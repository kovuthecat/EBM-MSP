import { useMemo } from 'react'
import type { Navigation } from '../../shared/navigation'
import { Icon } from '../../shared/icons/Icon'
import type { NomIcone } from '../../shared/icons/paths'
import { entreesListe } from '../content/loadModules'
import { noeudsParDomaine } from '../content/loadNodes'
import { iconeForDomaine, labelForDomaine, sortNodesForDomaine } from '../lib/labels'
import './DecisionDomainsScreen.css'

/**
 * Icône de repli (T-149) quand un module/nœud ne déclare pas `icone` dans son contenu — jamais une
 * erreur, jamais un vide : `lecture` (existe déjà dans le kit, cf. `shared/icons/paths.ts`) se lit
 * comme un neutre générique « ouvrir/consulter ». Le composant reste générique (aucun nom de nœud
 * connu ici, invariant CLAUDE.md 5) : c'est le CONTENU qui choisit l'icône, cet écran se contente
 * d'un repli quand il n'en déclare pas.
 */
const ICONE_REPLI: NomIcone = 'lecture'

interface DecisionDomainNodesScreenProps {
  domaine: string | undefined
  go: Navigation['go']
}

/**
 * D2b — liste des nœuds/modules d'un domaine déjà choisi (T-152, demande utilisateur). Reprend le
 * rendu de carte de l'ancien D2 (icône, titre, chevron — cf. l'historique T-149/T-150), sans le
 * sélecteur de domaine qui vivait en tête de page (déplacé sur `DecisionDomainsScreen.tsx`, D2a).
 *
 * `domaine` absent ou inconnu (lien direct malformé, jamais produit par la navigation normale) : repli
 * silencieux sur une liste vide plutôt qu'un écran cassé — même esprit que le repli d'icône ci-dessus.
 */
export function DecisionDomainNodesScreen({ domaine, go }: DecisionDomainNodesScreenProps) {
  const nodes = useMemo(
    () => (domaine ? sortNodesForDomaine(domaine, noeudsParDomaine[domaine] ?? []) : []),
    [domaine],
  )
  // Regroupement par module (D22), appliqué APRÈS le tri : un module prend la place de son premier
  // nœud, donc l'ordre voulu par `NODE_ORDER` est préservé sans que `entreesListe` ait à le connaître.
  const entrees = useMemo(() => entreesListe(nodes), [nodes])

  return (
    <div className="decision-domains">
      <button
        type="button"
        className="decision-domains__back"
        onClick={() => go('decisionDomains')}
      >
        <Icon nom="chevron-gauche" taille={16} />
        Domaines
      </button>

      <h1 className="decision-domains__title">
        {domaine ? (
          <>
            <Icon
              nom={iconeForDomaine(domaine) ?? ICONE_REPLI}
              taille={26}
              className="decision-domains__title-icon"
            />
            {labelForDomaine(domaine)}
          </>
        ) : (
          'Domaine introuvable'
        )}
      </h1>
      <p className="decision-domains__subtitle">Choisissez un algorithme.</p>

      {nodes.length === 0 && (
        <p className="decision-domains__empty">Aucun algorithme disponible pour ce domaine.</p>
      )}

      <section className="decision-domains__group">
        {entrees.map((entree) =>
          entree.type === 'module' ? (
            // Un MODULE (D22) compte pour UNE entrée : ses nœuds ne sont pas listés ici, ils s'ouvrent
            // depuis l'écran de module après son cadrage partagé. Lister les deux à la fois annulerait
            // l'intérêt du module — le praticien entrerait dans un nœud sans avoir vu le cadrage.
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
