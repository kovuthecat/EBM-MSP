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
 * NOMBRE D'OPTIONS qu'ils bloquent — rien de plus, hormis le tri de sécurité T-140 ci-dessous. Ce n'est
 * ni une heuristique, ni un score : le décompte porte sur `EvaluateNodeResult.enAttente`, registre exact
 * du moteur (`engine/evaluateNode.ts`), dont la docstring de `engine/relevance.ts` dit qu'il « cite
 * TOUJOURS tous les critères manquants d'une option, y compris en conjonction ». Répondre au critère de
 * tête est donc ce qui lève le plus d'indéterminations d'un coup — un fait mesuré sur la sortie du
 * moteur, pas une supposition sur ce que le praticien devrait juger important.
 *
 * TRI DE SÉCURITÉ (T-140, P13/S2, 2026-08-04) — LA SEULE IMPORTANCE JAMAIS SUGGÉRÉE, ET ELLE EST DÉCLARÉE
 * PAR LE CONTENU. Avant ce critère, la phrase « Commencez par… » pouvait faire passer huit critères qui
 * débloquent des options `role: geste` ordinaires devant l'unique critère qui débloque une option
 * `role: securite` — un patient pouvait donc voir « commencez par » lui demander cinq champs de confort
 * avant celui qui lève l'indétermination d'un filet de sécurité (T4/P7 de la revue de conception,
 * opacité N25). Le classement porte désormais D'ABORD sur `securite` (le critère débloque-t-il au moins
 * une option `role: securite` ?), PUIS sur le décompte, PUIS sur la première apparition. Ce n'est PAS un
 * jugement clinique inventé par ce module : `role: securite` est un fait du contenu (A3, arbitrage
 * référent du 2026-07-27), jamais deviné ni dérivé d'un intitulé — la même distinction que celle que
 * `OptionBadgeChip` (`components/OptionCard.tsx`) affiche déjà au practicien sous le nom « Mesure de
 * sécurité ». **Ce qui reste vrai, et c'est le point à ne pas perdre** : au sein d'un même statut de
 * sécurité (les deux `securite`, ou aucun des deux), le classement reste un pur décompte — un critère qui
 * bloque huit options `geste` n'est toujours pas « plus grave » qu'un autre qui n'en bloque qu'une, il
 * est seulement plus rentable à saisir tout de suite.
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5) : aucun nom de nœud, de domaine ni de critère. Le classement ne lit
 * que la forme du registre `enAttente` et le `role` déclaré de chaque `Option`, identiques pour tout
 * domaine à venir.
 *
 * DÉTERMINISME. À égalité de `securite` ET de décompte, l'ordre de PREMIÈRE APPARITION dans `enAttente`
 * tranche — lui-même déterministe, `evaluateNode` parcourant les options dans leur ordre de déclaration
 * YAML. Deux rendus successifs sur les mêmes critères produisent donc la même liste, dans le même ordre :
 * sans cette garantie, la phrase « commencez par… » clignoterait d'une frappe à l'autre.
 */
import type { OptionEnAttenteVue } from './vueDecision.ts'

/** Un critère manquant, avec le nombre d'options qu'il empêche de trancher. */
export interface PrioriteSaisie {
  nom: string
  /** Nombre d'options de `enAttente` dont ce critère fait partie des `manquants`. Toujours ≥ 1. */
  options: number
  /**
   * T-140 — vrai si CE CRITÈRE fait partie des `manquants` d'au moins une option `role: securite` du
   * registre `enAttente` fourni. Fait déclaré par le contenu (`Option.role`, A3), jamais deviné sur
   * l'intitulé — pilote le tri (cf. docstring de tête) et peut aussi servir à nommer l'enjeu dans la
   * phrase affichée à l'écran.
   */
  securite: boolean
}

/**
 * Les critères encore manquants, du plus prioritaire au moins prioritaire : d'abord ceux qui débloquent
 * une option `role: securite`, puis, à égalité, du plus bloquant au moins bloquant (T-140).
 *
 * Un critère cité par plusieurs options n'apparaît qu'UNE fois, avec son décompte cumulé : c'est
 * précisément ce que la liste option par option répétait sans le dire, et qui la rendait illisible.
 */
export function prioritesDeSaisie(enAttente: readonly OptionEnAttenteVue[]): PrioriteSaisie[] {
  const decompte = new Map<string, number>()
  const premiereApparition = new Map<string, number>()
  const debloqueUneSecurite = new Map<string, boolean>()

  for (const option of enAttente) {
    for (const nom of option.manquants) {
      decompte.set(nom, (decompte.get(nom) ?? 0) + 1)
      if (!premiereApparition.has(nom)) premiereApparition.set(nom, premiereApparition.size)
      if (option.option.role === 'securite') debloqueUneSecurite.set(nom, true)
    }
  }

  return [...decompte.entries()]
    .map(([nom, options]) => ({ nom, options, securite: debloqueUneSecurite.get(nom) ?? false }))
    .sort(
      (a, b) =>
        Number(b.securite) - Number(a.securite) ||
        b.options - a.options ||
        premiereApparition.get(a.nom)! - premiereApparition.get(b.nom)!,
    )
}
