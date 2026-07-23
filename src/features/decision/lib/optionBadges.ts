import type { Option } from '../content/node.types.ts'
import { isToujoursOption } from '../engine/evaluateNode.ts'

/** Badge de mise en avant d'une carte d'option (D16). `null` = carte non mise en avant. */
export type OptionBadge = 'recommandee' | 'reco-officielle' | null

/**
 * Calcule le badge de chaque option applicable (D16) : le socle « toujours » (ex. metformine, D16)
 * porte « reco-officielle », jamais « recommandee » (réservé à l'option EBM la plus indiquée). Le
 * badge « recommandee » va à la **première option qui N'EST PAS un socle** dans la liste déjà triée
 * par `evaluateNode` — pas à l'index 0 brut, qui serait souvent le socle lui-même (toujours en tête).
 *
 * Fonction pure, extraite de l'écran (`DecisionNodeScreen.tsx`) pour rester testable sans rendu React.
 */
export function computeBadges(applicable: Option[]): Map<Option, OptionBadge> {
  const badges = new Map<Option, OptionBadge>()
  const premiereNonSocle = applicable.findIndex((option) => !isToujoursOption(option))
  applicable.forEach((option, index) => {
    if (isToujoursOption(option)) {
      badges.set(option, 'reco-officielle')
    } else if (index === premiereNonSocle) {
      badges.set(option, 'recommandee')
    } else {
      badges.set(option, null)
    }
  })
  return badges
}
