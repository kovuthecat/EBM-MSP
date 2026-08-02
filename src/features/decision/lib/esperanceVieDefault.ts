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
 * T-061), extrait ici pour qu'un troisième appelant (la reprise de session au clic sur « Reprendre les
 * valeurs de ce patient », T-057 x T-061, défaut signalé en recette P8 2026-07-30 §Scénario A/C) ne le
 * réécrive pas une troisième fois. Ne suggère JAMAIS si le praticien a déjà choisi `esperance_vie`
 * lui-même (`dejaChoisieAMain`) — un choix manuel ne se fait écraser par aucun appelant — ni si aucun des
 * noms de `nomsChanges` n'est un driver de la suggestion (`ESPERANCE_VIE_DRIVERS`), ni si le nœud ne porte
 * pas ce critère à 3 valeurs (`hasEsperanceVieCritere`). `criteria` doit déjà porter les valeurs à jour
 * des drivers — cette fonction ne lit que `criteria`, elle ne fusionne rien : c'est à l'appelant de placer
 * la valeur retournée où il faut (`next.esperance_vie` en cours de saisie, ou un `setCriteria` fonctionnel
 * une fois l'événement passé).
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
