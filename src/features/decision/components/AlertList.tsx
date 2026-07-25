import type { Alerte } from '../content/node.types'
import './AlertList.css'

interface AlertListProps {
  alertes: Alerte[]
  /**
   * Variante d'affichage (addendum alertes d'option, `docs/decision/GRAMMAIRE-NOEUD.md`) : `'option'` =
   * rendu à l'intérieur d'une carte d'option (`OptionCard.tsx`), resserré pour s'insérer dans la carte
   * plutôt que sous le formulaire. Absent (défaut) = rendu historique des alertes de NŒUD, pleine
   * largeur sous le formulaire (D15). Mêmes classes de niveau (`info`/`attention`) dans les deux cas —
   * seule la classe de conteneur change, pas de second rendu dupliqué.
   */
  variant?: 'option'
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
 *
 * Réutilisé tel quel par `OptionCard.tsx` pour les alertes PORTÉES PAR UNE OPTION (`OptionVue.alertes`,
 * `lib/vueDecision.ts`) via `variant="option"` : même composant, jamais un second rendu — seule la mise
 * en forme s'adapte au contexte carte (cf. `AlertList.css`).
 */
export function AlertList({ alertes, variant }: AlertListProps) {
  if (alertes.length === 0) return null

  return (
    <div className={variant === 'option' ? 'alert-list alert-list--option' : 'alert-list'}>
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
