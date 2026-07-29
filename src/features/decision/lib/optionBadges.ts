import type { Option } from '../content/node.types.ts'
import type { GroupeFamille } from '../engine/evaluateNode.ts'

/**
 * « Cette option est-elle le SOCLE du traitement ? » — question de NATURE, à laquelle le contenu répond
 * désormais lui-même (A3, `Option.role`).
 *
 * Cette fonction lisait `isToujoursOption`, c'est-à-dire la sentinelle `conditions: ["toujours"]` — un
 * MÉCANISME de sélection détourné en indice de nature. C'est exactement le défaut qu'A3 corrige : le
 * contenu n'avait aucun moyen de dire ce qu'une option EST, on le devinait donc à partir de la façon dont
 * elle s'applique. ZÉRO CHANGEMENT DE COMPORTEMENT — l'invariant I17 verrouille l'équivalence
 * `conditions: ["toujours"]` ⟺ `role: socle` dans les deux sens ; ce qui change est ce que le code DIT.
 *
 * `evaluateNode` continue, lui, de lire les sentinelles : là, elles ne sont pas un indice de nature mais
 * la mécanique de sélection elle-même (repli, candidature permanente). La distinction est le point.
 */
function estSocle(option: Option): boolean {
  return option.role === 'socle'
}

/**
 * Badge de mise en avant d'une carte d'option (D16, étendu le 2026-07-29). `null` = carte non mise en
 * avant. Les quatre valeurs et leur sens sont documentés sur la prop `badge` de
 * `components/OptionCard.tsx` — seul endroit où elles deviennent du texte à l'écran.
 */
export type OptionBadge = 'recommandee' | 'reco-officielle' | 'securite' | null

/**
 * Badge d'une option MISE EN AVANT (celle qui, jusqu'au 2026-07-29, recevait invariablement
 * `'recommandee'`) — arbitrage référent du 2026-07-29, MÊME PROBLÈME ET MÊME SOLUTION QUE D16.
 *
 * LE DÉFAUT. « Recommandée » veut dire « c'est le meilleur choix parmi plusieurs, d'après les données ».
 * Une option `role: securite` (D25) n'est pas un choix d'agent thérapeutique : c'est ce qui reste quand
 * le traitement habituel est écarté (ex. `statine`, profil D-03 : maladie CV établie + intolérance
 * avérée → « Statine indisponible — alternatives hypolipémiantes », seule carte affichée, donc en tête,
 * donc badgée « Recommandée »). Les deux situations sont très différentes pour le praticien, et le même
 * badge pour les deux induit en erreur.
 *
 * LE PRÉCÉDENT SUIVI. D16 avait déjà distingué le socle (`'reco-officielle'`) de l'option EBM la plus
 * indiquée (`'recommandee'`) plutôt que de lui retirer son badge — le référent tranche ici de la même
 * façon : PAS de suppression du badge (la carte reste la conduite à tenir), une VALEUR DE BADGE de plus,
 * décidée ici, avec son libellé et son registre visuel propres dans `OptionCard`.
 *
 * PORTÉE STRICTEMENT LIMITÉE À L'ÉTIQUETTE : cette fonction ne s'insère qu'aux endroits où
 * `'recommandee'` était déjà attribué. Ni le tri, ni le plafond de 5 pistes, ni le repli d'affichage
 * (D25, `lib/replierAffichage.ts`) ne la consultent — ce qui est affiché, et dans quel ordre, est
 * inchangé. Une option `securite` HORS du groupe mis en avant reste `null`, comme avant.
 *
 * `socle` n'est jamais concerné (`role` est une valeur unique : une option socle n'est pas `securite`),
 * et `repli` garde `'recommandee'` — l'arbitrage ne porte que sur `securite`.
 */
function badgeMiseEnAvant(option: Option): OptionBadge {
  return option.role === 'securite' ? 'securite' : 'recommandee'
}

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
 * - option de SOCLE (`role: socle`, ex. metformine) → `'reco-officielle'`, INCHANGÉ,
 *   prioritaire sur toute logique de famille ;
 * - famille CUMULABLE (`exclusive: false`) : tout ce qui est affiché est à faire → mise en avant de
 *   TOUTES les options de la famille, indépendamment de leur rang respectif ;
 * - famille EXCLUSIVE (`exclusive: true`) : options ALTERNATIVES (on en choisit une) → mise en avant
 *   réservée au groupe d'égalité de TÊTE de la famille (`groupes[0]`), les autres options restent `null` ;
 * - famille de REPLI (`exclusive: undefined`, nœud sans `Noeud.familles` déclarées) : règle HISTORIQUE
 *   inchangée (D16/S7‑ui Lot 3) — mise en avant du groupe d'égalité contenant la 1re option non-socle.
 *
 * « Mise en avant » = `'recommandee'`, SAUF sur une option `role: securite`, qui reçoit `'securite'`
 * depuis l'arbitrage référent du 2026-07-29 (cf. `badgeMiseEnAvant` ci-dessus). Rien d'autre ne change :
 * QUELLES options sont mises en avant, et dans quel ordre elles s'affichent, est identique.
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
        badges.set(option, estSocle(option) ? 'reco-officielle' : badgeMiseEnAvant(option))
      }
      continue
    }

    if (famille.exclusive === true) {
      // Exclusive : alternatives, badge réservé au groupe d'égalité de tête.
      const groupeTete = famille.groupes[0]
      for (const option of toutesOptions) {
        if (estSocle(option)) {
          badges.set(option, 'reco-officielle')
        } else if (groupeTete?.includes(option)) {
          badges.set(option, badgeMiseEnAvant(option))
        } else {
          badges.set(option, null)
        }
      }
      continue
    }

    // Repli (nœud sans `familles` déclarées) : règle historique D16/S7-ui Lot 3, inchangée — badge
    // sur le groupe d'égalité contenant la 1re option qui N'EST PAS un socle.
    const premiereNonSocle = toutesOptions.find((option) => !estSocle(option))
    const groupeTete = premiereNonSocle
      ? famille.groupes.find((groupe) => groupe.includes(premiereNonSocle))
      : undefined
    for (const option of toutesOptions) {
      if (estSocle(option)) {
        badges.set(option, 'reco-officielle')
      } else if (groupeTete?.includes(option)) {
        badges.set(option, badgeMiseEnAvant(option))
      } else {
        badges.set(option, null)
      }
    }
  }
  return badges
}
