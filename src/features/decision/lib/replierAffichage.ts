/**
 * REPLI D'AFFICHAGE — dette « plafond d'affichage », levée le 2026-07-27 (décision référent).
 *
 * LE PROBLÈME. `ebmfrance` pose qu'on ne négocie pas plus de 2-3 pistes avec un patient dans une même
 * consultation. Le contenu traitait cette contrainte par le RANG DÉCLARÉ (`priorite`) — mais l'écran
 * affichait tout, à plat, et un patient peut déclencher une dizaine de cartes sur `rhd-alimentation`. Le
 * rang était donc écrit sans jamais être vu. La dette était consignée à l'identique dans les
 * `incertitudes` des DEUX nœuds RHD.
 *
 * CE QUE CE MODULE FAIT, ET SURTOUT CE QU'IL NE FAIT PAS. Il PARTITIONNE les familles d'une `VueDecision`
 * en deux vues de même nature : celles du meilleur rang, et le reste. Il ne retire, ne filtre et ne
 * réordonne RIEN — la réunion des deux partitions est exactement l'entrée, option pour option. Le repli
 * est une divulgation progressive, pas un plafond : l'écran affiche le nombre exact de pistes repliées et
 * les rend d'un clic. Un praticien qui cherche une piste précise la trouve toujours.
 *
 * POURQUOI UN MODULE À PART plutôt que quelques lignes dans le JSX de `DecisionNodeScreen` : parce que
 * c'est la seule pièce de l'écran dont une erreur ferait DISPARAÎTRE une option de la vue d'un
 * prescripteur. Isolée, elle se teste sur ses cas limites (rangs absents, rang unique, famille vidée par
 * la partition) sans monter un rendu React, et l'invariant « rien ne se perd » s'écrit en une assertion.
 *
 * GÉNÉRIQUE PAR CONSTRUCTION (invariant CLAUDE.md 5) : aucun nom de nœud, aucun nom de domaine, aucun
 * libellé de famille. Le seul paramètre clinique est le rang, que le contenu déclare.
 */
import type { FamilleVue, VueDecision } from './vueDecision.ts'

/**
 * En deçà de ce nombre d'options applicables, on ne replie pas : l'écran n'est pas encombré, et un repli
 * coûterait un clic pour cacher deux cartes. Valeur choisie juste au-dessus des « 2-3 pistes négociables »
 * d'`ebmfrance` — replier n'a de sens qu'à partir du moment où l'écran en propose plus que ce qu'une
 * consultation peut absorber.
 */
export const SEUIL_REPLI = 4

export interface PartitionAffichage {
  /** Familles restreintes aux options du MEILLEUR rang — toujours dépliées. */
  principales: FamilleVue[]
  /** Familles restreintes aux options des rangs suivants — repliées derrière un bouton. */
  repliees: FamilleVue[]
  /** Nombre d'options dans `repliees` (affiché sur le bouton). 0 ⇒ ne rien replier. */
  nbRepliees: number
}

/** Toutes les options applicables d'une liste de familles, à plat. */
function toutesLesOptions(familles: readonly FamilleVue[]) {
  return familles.flatMap((famille) => famille.groupes.flat())
}

/** Reconstruit des familles ne gardant que les options retenues par `garde`, en jetant ce qui devient vide. */
function filtrer(familles: readonly FamilleVue[], garde: (rang: number | undefined) => boolean): FamilleVue[] {
  return familles
    .map((famille) => ({
      libelle: famille.libelle,
      exclusive: famille.exclusive,
      groupes: famille.groupes.map((groupe) => groupe.filter((vue) => garde(vue.rang))).filter((g) => g.length > 0),
    }))
    .filter((famille) => famille.groupes.length > 0)
}

/**
 * Partitionne les familles d'une vue en « meilleur rang » / « le reste ».
 *
 * Ne replie RIEN (`nbRepliees === 0`, tout dans `principales`) dans trois cas, chacun délibéré :
 *  - moins de `SEUIL_REPLI` options applicables — rien à désencombrer ;
 *  - aucun rang défini — nœud en `ordered-first-match`, où `priorite` est ignoré (D11) : replier « au-delà
 *    du meilleur rang » n'y voudrait rien dire, et de toute façon ces nœuds rendent une option unique ;
 *  - toutes les options au même rang — il n'y a pas de « reste » à replier, et en fabriquer un
 *    reviendrait à cacher des options que le contenu déclare équivalentes.
 */
export function partitionnerAffichage(vue: Pick<VueDecision, 'familles'>): PartitionAffichage {
  const options = toutesLesOptions(vue.familles)
  const rangs = options.map((o) => o.rang).filter((r): r is number => typeof r === 'number')

  const rien: PartitionAffichage = { principales: [...vue.familles], repliees: [], nbRepliees: 0 }
  if (options.length < SEUIL_REPLI) return rien
  if (rangs.length === 0) return rien

  const meilleur = Math.min(...rangs)
  // Une option SANS rang est traitée comme prioritaire (jamais repliée) : c'est le sens sûr du doute.
  // Le cas ne devrait pas se produire sur un nœud `multi-options` — si un jour il survient, il vaut mieux
  // qu'une option de trop soit visible qu'une option de trop soit cachée.
  const estPrincipale = (rang: number | undefined) => rang === undefined || rang === meilleur

  const principales = filtrer(vue.familles, estPrincipale)
  const repliees = filtrer(vue.familles, (rang) => !estPrincipale(rang))
  const nbRepliees = toutesLesOptions(repliees).length
  if (nbRepliees === 0) return rien
  return { principales, repliees, nbRepliees }
}
