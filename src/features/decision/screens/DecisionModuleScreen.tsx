import type { Navigation } from '../../shared/navigation'
import { CadrageList } from '../components/CadrageList'
import { getModuleById } from '../content/loadModules'
import { getNoeudById } from '../content/loadNodes'
import { labelForDomaine } from '../lib/labels'
import './DecisionModuleScreen.css'

interface DecisionModuleScreenProps {
  moduleId: string | undefined
  go: Navigation['go']
}

/**
 * Écran de MODULE (DECISIONS.md D22) : pose une fois le cadrage commun à plusieurs nœuds d'un domaine,
 * puis oriente vers celui qui correspond à la consultation. Il répond au constat qui a motivé D22 — la
 * charge de saisie est le risque n° 1, et deux nœuds d'un même module redéclaraient les mêmes énoncés
 * de cadrage chacun de leur côté (invariant I4).
 *
 * CE QUE CET ÉCRAN NE FAIT PAS, délibérément (garde-fou R1 de D22) : il ne collecte aucun critère et ne
 * transmet aucune valeur au nœud ouvert. Le primer n'est pas un questionnaire dont la réponse
 * conditionnerait la suite — c'est un aiguillage que le praticien peut ignorer, et les deux nœuds
 * restent accessibles quel que soit son choix. Faire circuler une saisie d'ici vers un nœud
 * transformerait le module en chaînage obligatoire, ce que la décision interdit explicitement : chaque
 * nœud doit rester évaluable seul.
 *
 * Générique : aucun module ni domaine connu par son nom (invariant CLAUDE.md 5) — tout vient du contenu.
 */
export function DecisionModuleScreen({ moduleId, go }: DecisionModuleScreenProps) {
  const module = moduleId ? getModuleById(moduleId) : undefined

  if (!module) {
    return (
      <div className="decision-module">
        <button type="button" className="decision-module__back" onClick={() => go('decisionDomains')}>
          ← Aide à la décision
        </button>
        <p className="decision-module__empty">Module introuvable.</p>
      </div>
    )
  }

  return (
    <div className="decision-module">
      <button type="button" className="decision-module__back" onClick={() => go('decisionDomains')}>
        ← Domaine : {labelForDomaine(module.domaine)}
      </button>
      <h1 className="decision-module__title">{module.titre}</h1>
      {module.population_cible && (
        <p className="decision-module__population">{module.population_cible}</p>
      )}

      {/* Même composant que le cadrage d'un nœud (D24) : c'est le même objet — des positions de lecture
          vraies pour tous les patients, sans condition. Seule la portée change (le module au lieu du
          nœud), ce qui ne justifie ni un second composant ni un second style. */}
      <CadrageList cadrage={module.cadrage} />

      <div className="decision-module__primer-question">{module.primer.question}</div>
      <p className="decision-module__primer-note">
        Cette question oriente, elle ne verrouille rien : les deux axes restent ouverts, dans l'ordre
        que vous voulez, et rien de ce qui est saisi dans l'un n'est repris dans l'autre.
      </p>

      <section className="decision-module__orientations">
        {module.primer.orientations.map((orientation) => {
          const noeud = getNoeudById(orientation.noeud)
          return (
            <button
              key={orientation.noeud}
              type="button"
              className="decision-module__orientation"
              onClick={() => go('decisionNode', { nodeId: orientation.noeud })}
            >
              <span className="decision-module__orientation-libelle">{orientation.libelle}</span>
              {noeud && <span className="decision-module__orientation-noeud">{noeud.titre}</span>}
              {orientation.indices && orientation.indices.length > 0 && (
                <ul className="decision-module__indices">
                  {orientation.indices.map((indice, index) => (
                    <li key={`${index}-${indice.slice(0, 24)}`}>{indice}</li>
                  ))}
                </ul>
              )}
            </button>
          )
        })}
      </section>
    </div>
  )
}
