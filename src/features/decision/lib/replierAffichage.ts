/**
 * PLAFOND D'AFFICHAGE — K5, décision référent du 2026-07-27 : **5 pistes au maximum**.
 *
 * LE PROBLÈME. `ebmfrance` pose qu'on ne négocie pas plus de deux ou trois pistes avec un patient dans
 * une même consultation. Le contenu traitait cette contrainte par le rang déclaré (`priorite`), mais
 * l'écran affichait tout, à plat : la seconde recette navigateur a compté **dix cartes, toutes badgées
 * « Recommandée »** sur `rhd-alimentation`. Le rang était écrit sans jamais être vu.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────────────────
 * CE MODULE A DÉJÀ PRODUIT UN DÉFAUT DE SÉCURITÉ, ET C'EST LA PREMIÈRE CHOSE À SAVOIR EN LE LISANT.
 *
 * Sa première version (`partitionnerAffichage`, 2026-07-27 matin) dépliait le MEILLEUR RANG et repliait
 * le reste. J'avais écrit dans la recette : « les cartes de sécurité sont toutes au rang 1, donc dépliées
 * par construction ». C'était faux. Le socle metformine de `prescription` porte `priorite: 0`, si bien
 * que `Math.min` en faisait le meilleur rang et que tout le reste passait derrière le bouton. Contre-
 * exemple exécuté : 58 ans, metformine + sulfamide, **cétonémie confirmée**, ASCVD, insuffisance
 * cardiaque, HbA1c 9 — l'écran n'affichait QU'UNE carte (« Metformine, socle du traitement ») et repliait
 * « Insuline d'initiation (état catabolique) », qui est la réponse de sécurité à ce tableau.
 *
 * La cause de fond dépassait le correctif : `priorite` a été écrit comme un ordre de TRI (D13/D14) et je
 * l'ai transformé en porte d'AFFICHAGE. Rang 0 n'y veut pas dire « le plus important » mais « socle ».
 * Le repli a été neutralisé le soir même, avec cette question laissée ouverte au référent : *« quel signal
 * du contenu dit qu'une carte ne peut pas être repliée ? (la famille ? une alerte portée ? un champ
 * dédié ?) »*
 *
 * **A3 y a répondu : un champ dédié** (`Option.role`). C'est ce qui rend ce module réactivable — pas une
 * heuristique de plus sur le rang.
 * ─────────────────────────────────────────────────────────────────────────────────────────────────────
 *
 * DEUX GARDE-FOUS INDÉPENDANTS, et c'est délibéré : après ce défaut, un seul ne suffit pas.
 *
 * 1. **Le rôle déclaré** (A3) — seules les options `geste` peuvent être repliées. `socle`, `securite` et
 *    `repli` ne le sont jamais. C'est la réponse structurelle à la question ci-dessus.
 * 2. **La charge de sécurité** — une carte qui porte une contre-indication ou une alerte d'option ACTIVE
 *    n'est jamais repliée, quel que soit son rôle. Redondant avec (1) dans la quasi-totalité des cas, et
 *    c'est le but : si un futur contenu déclare `geste` une carte qui porte un fait de sécurité, elle
 *    reste visible quand même. Mesuré au moment de l'écrire : ce garde-fou coûte 0 carte sur
 *    `rhd-alimentation` (0/3202 gestes portent un fait de sécurité) et 0,5 % sur `rhd-activite-physique`
 *    — il ne neutralise donc pas le plafond là où il sert.
 *
 * RIEN NE DISPARAÎT. Ce module PARTITIONNE : `principales ∪ repliees` est exactement l'entrée, option
 * pour option (invariant testé). Le repli est une divulgation progressive — l'écran affiche le compte
 * exact et rend les pistes d'un clic.
 *
 * ORDRE DE SÉLECTION, et sa limite MESURÉE — à ne pas passer sous silence. Le référent a demandé de
 * « garder ceux qui répondent le mieux aux critères sélectionnés ». Le critère est donc le nombre de
 * motifs satisfaits (`OptionVue.reasons`, c'est-à-dire les termes VRAIS de `conditions`), puis le rang
 * déclaré, puis l'ordre du contenu. ⚠ **Sur les deux nœuds qui ont réellement besoin du plafond, ce
 * critère discrimine mal** : 95 % des cartes de `rhd-alimentation` n'ont qu'UN seul motif satisfait, et
 * la frontière à la 5ᵉ place n'est nette que dans ~40 % des profils (106/263 sur `rhd-alimentation`,
 * 38 % sur `rhd-activite-physique`, 55 % sur `prescription`). Dans les autres cas, la coupe se fait entre
 * ex æquo, donc dans l'ordre du fichier. C'est acceptable ICI **parce que rien n'est perdu** — le coût
 * d'un mauvais départage est un clic, pas une piste invisible. Mieux discriminer demanderait un travail
 * de CONTENU (des rangs qui varient réellement), pas une heuristique d'affichage : c'est une question
 * ouverte pour le référent, et elle est écrite ici plutôt que dissimulée derrière un tri d'apparence sûre.
 *
 * INVARIANT 2 (D3, « aucun score caché ») — comment ce tri le respecte. Un comptage de signaux satisfaits
 * EST un score. Il est admissible à une condition : être AFFICHÉ et explicable. Il l'est par construction,
 * et pas par une mention ajoutée après coup — le nombre trié est exactement la longueur de la liste
 * « Proposé parce que » que chaque carte affiche déjà, en toutes lettres. Le praticien ne lit pas un
 * chiffre opaque, il lit les motifs eux-mêmes.
 *
 * GÉNÉRIQUE (invariant CLAUDE.md 5) : aucun nom de nœud, de domaine ni de famille.
 */
import type { FamilleVue, OptionVue, VueDecision } from './vueDecision.ts'

/**
 * Nombre maximum de pistes dépliées (décision référent K5). Au-delà, le surplus part derrière un bouton
 * qui en porte le compte exact.
 */
export const PLAFOND_PISTES = 5

export interface PartitionAffichage {
  /** Familles restreintes aux options dépliées. */
  principales: FamilleVue[]
  /** Familles restreintes aux options repliées derrière le bouton. */
  repliees: FamilleVue[]
  /** Nombre d'options dans `repliees` (affiché sur le bouton). 0 ⇒ ne rien replier. */
  nbRepliees: number
}

/** Toutes les options d'une liste de familles, à plat, dans l'ordre d'affichage. */
function toutesLesOptions(familles: readonly FamilleVue[]): OptionVue[] {
  return familles.flatMap((famille) => famille.groupes.flat())
}

/**
 * Une carte peut-elle être repliée ? Les deux garde-fous de la docstring, dans cet ordre. Toute réponse
 * `false` est définitive : aucune règle de tri ne peut ensuite la replier.
 */
function estRepliable(vue: OptionVue): boolean {
  if (vue.option.role !== 'geste') return false
  if ((vue.option.contre_indications ?? []).length > 0) return false
  if (vue.alertes.length > 0) return false
  return true
}

/** Reconstruit des familles ne gardant que les options retenues, en jetant celles qui deviennent vides. */
function filtrer(familles: readonly FamilleVue[], garde: (vue: OptionVue) => boolean): FamilleVue[] {
  return familles
    .map((famille) => ({
      libelle: famille.libelle,
      exclusive: famille.exclusive,
      groupes: famille.groupes.map((groupe) => groupe.filter(garde)).filter((g) => g.length > 0),
    }))
    .filter((famille) => famille.groupes.length > 0)
}

/**
 * Partitionne les familles d'une vue en « pistes dépliées » / « surplus replié », sous le plafond K5.
 *
 * Ne replie RIEN dans deux cas, chacun délibéré :
 *  - le nombre de cartes ne dépasse pas le plafond — il n'y a rien à désencombrer ;
 *  - aucune carte n'est repliable (toutes protégées par leur rôle ou leur charge de sécurité) — fabriquer
 *    un repli reviendrait à cacher précisément ce qui ne doit pas l'être.
 */
export function plafonnerPistes(
  vue: Pick<VueDecision, 'familles'>,
  plafond: number = PLAFOND_PISTES,
): PartitionAffichage {
  const options = toutesLesOptions(vue.familles)
  const rien: PartitionAffichage = { principales: [...vue.familles], repliees: [], nbRepliees: 0 }
  if (options.length <= plafond) return rien

  // Ordre de l'affichage = ordre de référence pour les ex æquo (cf. la limite mesurée, docstring).
  const position = new Map<OptionVue, number>(options.map((o, i) => [o, i]))
  const repliables = options.filter(estRepliable)
  const proteges = options.length - repliables.length

  // Les protégées occupent la place en premier : le plafond ne peut pas les évincer. S'il n'en reste
  // aucune de disponible, tout ce qui est repliable est replié — et le bouton le dit.
  const placesRestantes = Math.max(0, plafond - proteges)

  const classees = [...repliables].sort(
    (a, b) =>
      b.reasons.length - a.reasons.length ||
      (a.rang ?? Number.POSITIVE_INFINITY) - (b.rang ?? Number.POSITIVE_INFINITY) ||
      position.get(a)! - position.get(b)!,
  )
  const aReplier = new Set(classees.slice(placesRestantes))
  if (aReplier.size === 0) return rien

  const principales = filtrer(vue.familles, (o) => !aReplier.has(o))
  const repliees = filtrer(vue.familles, (o) => aReplier.has(o))
  return { principales, repliees, nbRepliees: aReplier.size }
}
