/**
 * Par quoi commencer, quand l'écran ne sait encore rien (B2, arbitrage référent du 2026-08-01).
 *
 * LE DÉFAUT, MESURÉ. Le nœud `prescription` réclame 17 à 19 saisies avant de rien affirmer ; la recette
 * praticien naïf a chronométré **8 minutes** pour une consultation qui en dure 15, et le référent a
 * qualifié ce seul point de rédhibitoire. Sur un formulaire VIERGE, le panneau « En attente » énumérait
 * en outre une vingtaine d'options avec, pour chacune, ses critères manquants — le premier écran que
 * voit le praticien, et le plus décourageant. Le correctif P8 (une phrase compacte au lieu de la liste)
 * ne s'y appliquait jamais : son seuil (≤ 3 critères distincts) visait explicitement « le cas dominant
 * en recette, une ou deux questions qui reviennent sur plusieurs options », c'est-à-dire un formulaire
 * DÉJÀ bien rempli. Le pire moment n'était pas couvert.
 *
 * CE QUE CE MODULE CALCULE, ET CE QU'IL NE CALCULE PAS. Il classe les critères encore manquants par le
 * NOMBRE D'OPTIONS qu'ils bloquent — rien de plus. Ce n'est ni une heuristique, ni un score : le
 * décompte porte sur `EvaluateNodeResult.enAttente`, registre exact du moteur (`engine/evaluateNode.ts`),
 * dont la docstring de `engine/relevance.ts` dit qu'il « cite TOUJOURS tous les critères manquants d'une
 * option, y compris en conjonction ». Répondre au critère de tête est donc ce qui lève le plus
 * d'indéterminations d'un coup — un fait mesuré sur la sortie du moteur, pas une supposition sur ce que
 * le praticien devrait juger important. **Aucune importance clinique n'est suggérée** : un critère qui
 * bloque huit options n'est pas « plus grave » qu'un autre, il est seulement plus rentable à saisir tout
 * de suite.
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5) : aucun nom de nœud, de domaine ni de critère. Le classement ne lit
 * que la forme du registre `enAttente`, identique pour tout domaine à venir.
 *
 * DÉTERMINISME. À égalité de décompte, l'ordre de PREMIÈRE APPARITION dans `enAttente` tranche — lui-même
 * déterministe, `evaluateNode` parcourant les options dans leur ordre de déclaration YAML. Deux rendus
 * successifs sur les mêmes critères produisent donc la même liste, dans le même ordre : sans cette
 * garantie, la phrase « commencez par… » clignoterait d'une frappe à l'autre.
 */
import type { OptionEnAttenteVue } from './vueDecision.ts'

/** Un critère manquant, avec le nombre d'options qu'il empêche de trancher. */
export interface PrioriteSaisie {
  nom: string
  /** Nombre d'options de `enAttente` dont ce critère fait partie des `manquants`. Toujours ≥ 1. */
  options: number
}

/**
 * Les critères encore manquants, du plus bloquant au moins bloquant.
 *
 * Un critère cité par plusieurs options n'apparaît qu'UNE fois, avec son décompte cumulé : c'est
 * précisément ce que la liste option par option répétait sans le dire, et qui la rendait illisible.
 */
export function prioritesDeSaisie(enAttente: readonly OptionEnAttenteVue[]): PrioriteSaisie[] {
  const decompte = new Map<string, number>()
  const premiereApparition = new Map<string, number>()

  for (const option of enAttente) {
    for (const nom of option.manquants) {
      decompte.set(nom, (decompte.get(nom) ?? 0) + 1)
      if (!premiereApparition.has(nom)) premiereApparition.set(nom, premiereApparition.size)
    }
  }

  return [...decompte.entries()]
    .map(([nom, options]) => ({ nom, options }))
    .sort((a, b) => b.options - a.options || premiereApparition.get(a.nom)! - premiereApparition.get(b.nom)!)
}
