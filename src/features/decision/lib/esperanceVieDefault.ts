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
