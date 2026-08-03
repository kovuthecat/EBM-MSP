import type { CritereEntree } from '../content/node.types'
import type { Criteria } from '../engine/conditions'

export type EsperanceVieValue = 'longue' | 'intermediaire' | 'limitee'

const TIERS: EsperanceVieValue[] = ['longue', 'intermediaire', 'limitee']

/**
 * Point de départ **non sourcé** pour `esperance_vie`, modifiable par le praticien (jamais imposé).
 * Le dossier de preuve (`docs/decision/noeuds/A-cible-glycemique.md`) documente seulement le mapping
 * catégorie ↔ durée (longue ≙ EV > 15 ans, limitee ≙ EV < 5 ans) mais aucune formule pour la dériver
 * de l'âge/des comorbidités : cette fonction est une aide au remplissage, pas un fait clinique
 * (CLAUDE.md invariant 6, « signaler plutôt qu'inventer »). Logique : `comorbidite_grave` seule
 * suffit (déjà traitée comme équivalente à `esperance_vie == limitee` dans les options du nœud A) ;
 * sinon un palier par âge, dégradé d'un cran par facteur de gravité présent (`fragilite`,
 * `antecedent_cv`).
 */
export function suggestEsperanceVie(criteria: Criteria): EsperanceVieValue {
  const age = Number(criteria.age ?? 0)
  const fragilite = Boolean(criteria.fragilite)
  const comorbiditeGrave = Boolean(criteria.comorbidite_grave)
  const antecedentCv = Boolean(criteria.antecedent_cv)

  if (comorbiditeGrave) return 'limitee'

  const ageTier: EsperanceVieValue = age >= 90 ? 'limitee' : age >= 75 ? 'intermediaire' : 'longue'
  const facteursGravite = [fragilite, antecedentCv].filter(Boolean).length
  const index = Math.min(TIERS.indexOf(ageTier) + facteursGravite, TIERS.length - 1)
  return TIERS[index]
}

/** Le nœud courant porte-t-il bien un critère `esperance_vie` à 3 valeurs ? (générique, pas d'id de nœud en dur, D8). */
export function hasEsperanceVieCritere(criteresEntree: CritereEntree[]): boolean {
  const critere = criteresEntree.find((c) => c.nom === 'esperance_vie')
  if (!critere || critere.type !== 'enum') return false
  return TIERS.every((valeur) => critere.valeurs?.includes(valeur))
}

/** Champs dont dépend la suggestion — sert à savoir quand la recalculer. */
export const ESPERANCE_VIE_DRIVERS = ['age', 'fragilite', 'comorbidite_grave', 'antecedent_cv'] as const

/**
 * Calcule la valeur à suggérer pour `esperance_vie`, ou `undefined` si rien ne doit changer — MÊME calcul
 * que portaient séparément `handleCriteriaChange` et `handleConfirmerChamps` (`DecisionNodeScreen.tsx`,
 * T-061), extrait ici pour qu'un second appelant ne le réécrive pas une seconde fois. Ne suggère JAMAIS
 * si le praticien a déjà choisi `esperance_vie` lui-même (`dejaChoisieAMain`) — un choix manuel ne se
 * fait écraser par aucun appelant — ni si aucun des noms de `nomsChanges` n'est un driver de la
 * suggestion (`ESPERANCE_VIE_DRIVERS`), ni si le nœud ne porte pas ce critère à 3 valeurs
 * (`hasEsperanceVieCritere`). `criteria` doit déjà porter les valeurs à jour des drivers — cette fonction
 * ne lit que `criteria`, elle ne fusionne rien : c'est à l'appelant de placer la valeur retournée où il
 * faut (`next.esperance_vie` en cours de saisie, ou un `setCriteria` fonctionnel une fois l'événement
 * passé).
 *
 * ⚠ HISTORIQUE À CONNAÎTRE avant de retoucher cette fonction — deux allers-retours sur le MÊME risque :
 *
 *  1. Un TROISIÈME appelant a existé (la reprise de session au clic sur « Reprendre les valeurs de ce
 *     patient », T-057 x T-061, ajouté le 2026-07-30 pour corriger un défaut de recette P8 §Scénario
 *     A/C). Il recalculait la suggestion à partir des drivers REPRIS de la mémoire de session.
 *  2. P12/S1 (2026-08-02) a constaté que ce 3ᵉ appelant pouvait faire CHANGER SILENCIEUSEMENT une
 *     suggestion déjà affichée : `antecedent_cv` ne porte pas `partage: true` sur `cible-glycemique`
 *     (ni `comorbidite_grave`), donc une ré-entrée dans le nœud le fait revenir à son défaut `false` —
 *     et la suggestion se recalculait sur ce dossier amputé d'un driver, sans qu'aucune réponse n'ait
 *     changé (constat n° 2 de la recette du 2026-08-02).
 *  3. Le correctif tenté DANS LA MÊME SESSION a été une garde ici (« ne suggère que si tous les
 *     `ESPERANCE_VIE_DRIVERS` sont dans un ensemble `renseignes` transmis par l'appelant ») — REVERTÉE
 *     QUELQUES HEURES PLUS TARD : `antecedent_cv`/`comorbidite_grave` portent `presomption_non: true`
 *     sur le nœud réel (R7/D20 : un `bool` présumé est DÉTERMINÉ dès le départ, jamais `touched`) — la
 *     garde ne pouvait donc JAMAIS être satisfaite sur `handleCriteriaChange`/`handleConfirmerChamps`
 *     NON PLUS, alors qu'eux n'ont jamais amputé aucun dossier. Mesuré au navigateur : le nœud le plus
 *     utilisé du produit (« Fixer la cible », vignette N2 : Âge → Ancienneté → « Rien à signaler ») ne
 *     rendait plus AUCUNE carte. Le défaut ne venait pas d'un driver INDÉTERMINÉ (un état que le moteur
 *     sait déjà représenter, `presomption_non` compris) mais d'un driver PERDU par un mécanisme
 *     particulier (la reprise inter-nœuds) — une garde générique sur les TROIS appelants soignait le mal
 *     à la mauvaise échelle.
 *  4. LE REMÈDE RETENU (P12/S1, même jour) : retirer le 3ᵉ appelant PLUTÔT QUE DE LE GARDER — cf.
 *     `DecisionNodeScreen.tsx` `handleReprendreValeurs`, qui ne calcule plus aucune suggestion. Cette
 *     fonction est donc revenue à sa signature d'avant le point 3 : `handleCriteriaChange` et
 *     `handleConfirmerChamps` restent ses SEULS appelants, tous deux opérant sur l'état LIVE du nœud
 *     courant (jamais sur une valeur reprise d'ailleurs) — le risque d'amputation qui a motivé la garde
 *     ne peut structurellement pas se produire sur ces deux chemins.
 *
 * NE PAS réintroduire de garde de complétude ici sans relire ce qui précède : le bon niveau pour ce
 * genre de risque est LE CHEMIN qui perd l'information (la reprise), pas cette fonction partagée par des
 * appelants qui, eux, ne perdent jamais rien.
 */
export function suggestionEsperanceVieSiApplicable(
  criteresEntree: CritereEntree[],
  criteria: Criteria,
  dejaChoisieAMain: boolean,
  nomsChanges: readonly string[],
): EsperanceVieValue | undefined {
  if (dejaChoisieAMain) return undefined
  if (!nomsChanges.some((nom) => (ESPERANCE_VIE_DRIVERS as readonly string[]).includes(nom))) return undefined
  if (!hasEsperanceVieCritere(criteresEntree)) return undefined
  return suggestEsperanceVie(criteria)
}
