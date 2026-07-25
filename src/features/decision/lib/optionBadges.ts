import type { Option } from '../content/node.types.ts'
import type { GroupeFamille } from '../engine/evaluateNode.ts'
import { isToujoursOption } from '../engine/evaluateNode.ts'

/** Badge de mise en avant d'une carte d'option (D16). `null` = carte non mise en avant. */
export type OptionBadge = 'recommandee' | 'reco-officielle' | null

/**
 * Calcule le badge de chaque option applicable, FAMILLE PAR FAMILLE (correctif « le badge, c'est le
 * PLAN » — 2026-07-25, tranché par le référent clinique). Le badge « recommandee » ne désigne plus « le
 * vainqueur » d'un tri global, mais TOUT CE QU'IL FAUT FAIRE : deux gestes de natures différentes (ex.
 * « arrêter l'AR GLP‑1 mal toléré » ET « introduire un iSGLT2 pour la protection rénale ») peuvent être
 * tous les deux recommandés, à faire en parallèle, même à des rangs `priorite` différents — l'ancienne
 * règle (badger le groupe d'égalité de la 1re option non-socle, SUR TOUTE LA LISTE) ne l'exprimait que
 * par coïncidence : si les deux gestes tombaient à des rangs différents, la moitié du plan perdait son
 * badge (cf. `Noeud.familles`, `engine/evaluateNode.ts` `groupesParFamille`).
 *
 * Règle par famille (`GroupeFamille.exclusive`) :
 * - option « toujours » (`isToujoursOption`, ex. socle metformine) → `'reco-officielle'`, INCHANGÉ,
 *   prioritaire sur toute logique de famille ;
 * - famille CUMULABLE (`exclusive: false`) : tout ce qui est affiché est à faire → `'recommandee'` sur
 *   TOUTES les options de la famille, indépendamment de leur rang respectif ;
 * - famille EXCLUSIVE (`exclusive: true`) : options ALTERNATIVES (on en choisit une) → `'recommandee'`
 *   réservé au groupe d'égalité de TÊTE de la famille (`groupes[0]`), les autres options restent `null` ;
 * - famille de REPLI (`exclusive: undefined`, nœud sans `Noeud.familles` déclarées) : règle HISTORIQUE
 *   inchangée (D16/S7‑ui Lot 3) — badge sur le groupe d'égalité contenant la 1re option non-socle.
 *
 * Prend directement le résultat de `groupesParFamille` (et non `applicable`/`rangs` bruts) : c'est
 * exactement ce que l'écran affiche par section, la même source que la signature de pertinence
 * (`engine/relevance.ts`) — les trois DOIVENT s'accorder (cf. docstring `groupesParFamille`).
 *
 * Fonction pure, extraite de l'écran (`DecisionNodeScreen.tsx`) pour rester testable sans rendu React.
 */
export function computeBadges(familles: GroupeFamille[]): Map<Option, OptionBadge> {
  const badges = new Map<Option, OptionBadge>()
  for (const famille of familles) {
    const toutesOptions = famille.groupes.flat()

    if (famille.exclusive === false) {
      // Cumulable : tout ce qui est affiché dans cette famille est à faire.
      for (const option of toutesOptions) {
        badges.set(option, isToujoursOption(option) ? 'reco-officielle' : 'recommandee')
      }
      continue
    }

    if (famille.exclusive === true) {
      // Exclusive : alternatives, badge réservé au groupe d'égalité de tête.
      const groupeTete = famille.groupes[0]
      for (const option of toutesOptions) {
        if (isToujoursOption(option)) {
          badges.set(option, 'reco-officielle')
        } else if (groupeTete?.includes(option)) {
          badges.set(option, 'recommandee')
        } else {
          badges.set(option, null)
        }
      }
      continue
    }

    // Repli (nœud sans `familles` déclarées) : règle historique D16/S7-ui Lot 3, inchangée — badge
    // sur le groupe d'égalité contenant la 1re option qui N'EST PAS un socle.
    const premiereNonSocle = toutesOptions.find((option) => !isToujoursOption(option))
    const groupeTete = premiereNonSocle
      ? famille.groupes.find((groupe) => groupe.includes(premiereNonSocle))
      : undefined
    for (const option of toutesOptions) {
      if (isToujoursOption(option)) {
        badges.set(option, 'reco-officielle')
      } else if (groupeTete?.includes(option)) {
        badges.set(option, 'recommandee')
      } else {
        badges.set(option, null)
      }
    }
  }
  return badges
}
