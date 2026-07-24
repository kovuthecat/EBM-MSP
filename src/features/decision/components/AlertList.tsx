import type { Alerte } from '../content/node.types'
import './AlertList.css'

interface AlertListProps {
  alertes: Alerte[]
}

/**
 * Alertes cliniques déclenchées (D15) : rappels/avertissements indépendants des options
 * sélectionnées (ex. contrôler la cétonémie, adapter la dose de metformine au DFG, orienter vers
 * une évaluation de chirurgie métabolique). Rendu générique : ne connaît aucun nœud/domaine par son
 * nom (D8), affiche `message` avec un style dérivé de `niveau` (`attention` = point de vigilance,
 * `info`/absent = rappel neutre).
 *
 * `EvaluateNodeResult.alertes` (`engine/evaluateNode.ts`) était calculé mais jamais rendu à l'écran
 * avant ce composant : pour les nœuds où une décision clinique s'encode uniquement en `alertes` (ex.
 * nœud H, modulation par `motivation`/`capacite_activite` sans jamais exclure d'option — D15), cela
 * la rendait invisible côté praticien.
 */
export function AlertList({ alertes }: AlertListProps) {
  if (alertes.length === 0) return null

  return (
    <div className="alert-list">
      {alertes.map((alerte, index) => (
        <div
          key={`${index}-${alerte.quand}`}
          className={
            alerte.niveau === 'attention'
              ? 'alert-list__item alert-list__item--attention'
              : 'alert-list__item alert-list__item--info'
          }
        >
          {alerte.message}
        </div>
      ))}
    </div>
  )
}
