/**
 * Types TS de l'entrée de veille, miroir de `schema/veille/entree.schema.json` et du modèle de
 * données de `docs/veille/BRIEF_VEILLE.md` §5.
 *
 * Trois écarts au brief §5, tous issus de la production réelle (PV1/S3) et assumés ici — ils sont
 * la matière du gel de modèle, pas des libertés :
 *
 * 1. `route` (`breve` | `analyse`) n'existe pas au brief §5 : il a été créé par la SOP v1.1 §5bis
 *    (D38) APRÈS la rédaction du brief. C'est un champ distinct de `niveau_impact` — la route se
 *    décide au screening, sur le potentiel ; `niveau_impact` est le verdict, après analyse. Une
 *    analyse peut conclure `informatif`, l'inverse est impossible (analyse ⊇ pratique).
 * 2. `appreciation_critique`, `niveau_preuve` et `pertinence_pratique` sont **nullables**. Le brief
 *    les donne obligatoires, mais SOP §5bis interdit à une brève de porter la moindre appréciation
 *    critique propre : sur une brève ces trois champs n'ont pas de valeur légitime, et les remplir
 *    serait produire une analyse déguisée. `null` est donc le seul encodage honnête.
 * 3. `meta.statut` porte `brouillon` tant que la relecture différée à J+3 (SOP §5, étape 5) n'a pas
 *    eu lieu. Aucune entrée ne naît `valide`.
 */

/** Échelle GRADE simplifiée du brief §5 (underscore, comme le contenu Décision). */
export type NiveauPreuveVeille = 'eleve' | 'modere' | 'faible' | 'tres_faible'

/** Route de production, SOP §5bis (D38). Décidée au screening, avant de savoir. */
export type Route = 'breve' | 'analyse'

/** Verdict d'impact, arrêté après l'analyse. Une brève est toujours `informatif`. */
export type NiveauImpact = 'pratique' | 'informatif'

export type PertinencePratique = 'forte' | 'moderee' | 'faible'

export type PropositionMaj = 'aucune' | 'candidate' | 'validee' | 'rejetee'

export type StatutEntree = 'brouillon' | 'valide'

export interface SourceEntree {
  nom: string
  lien: string
  doi?: string
}

export interface ImpactAlgorithme {
  concerne_decision: boolean
  /** Ids de nœuds de l'outil de décision (ex. `statine`). */
  noeuds_impactes: string[]
  proposition_maj: PropositionMaj
}

export interface MetaEntree {
  date_publication: string
  auteur: string
  statut: StatutEntree
  /**
   * `true` sur les 10 thèmes MG (le référent, généraliste, relit à J+3 — SOP §5 étape 5) —
   * `pediatrie` compris depuis D63 : la pédiatrie de soins premiers relève du champ MG.
   * `false` uniquement sur `orthophonie`/`sante-femme-perinatalite` en route `analyse` produite par
   * le circuit tri-agents (SOP §7bis, D61) : aucun référent de profession compétent n'a relu le fond
   * clinique. Doit rester **affiché**, jamais réduit à une mention dans le détail déplié.
   */
  relecture_referent: boolean
}

export interface EntreeVeille {
  id: string
  /** Semaine ISO de l'édition, ex. `2026-W33`. Identifiant du dossier d'archive. */
  date_semaine: string
  titre: string
  source: SourceEntree
  type_publication: string
  /** Thèmes de la taxonomie (BRIEF_VEILLE.md §4, 14 valeurs). */
  themes: string[]
  professions_concernees: string[]
  route: Route
  niveau_impact: NiveauImpact
  population: string
  resultat_resume: string
  /** `null` sur une brève : elle ne porte aucune appréciation critique propre (SOP §5bis). */
  appreciation_critique: string | null
  niveau_preuve: NiveauPreuveVeille | null
  pertinence_pratique: PertinencePratique | null
  impact_algorithme: ImpactAlgorithme
  temps_lecture_min: number
  meta: MetaEntree
}
