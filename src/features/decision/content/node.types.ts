/**
 * Types TS miroir de `schema/noeud.schema.json` (docs/decision/BRIEF_DECISION.md §5.1/§11).
 *
 * Source de verite = le schema JSON ; ces types le reflètent 1:1 (T-002). Toute évolution du
 * schéma doit être répercutée ici.
 *
 * NB `NiveauPreuve` : cette enum utilise l'underscore `tres_faible`, identique au commentaire du
 * brief §5.1 et au gabarit §11. `src/features/shared/types.ts` définit un `NiveauPreuve` distinct
 * ('tres-faible', trait d'union) pour l'affichage transverse (créé en S1). Écart de forme signalé,
 * non résolu ici — hors périmètre S2 (shared ne se modifie pas sans décision) ; à trancher avant le
 * câblage des écrans (S4), probablement par une fonction de mapping plutôt qu'en unifiant les deux.
 */

/** Échelle GRADE simplifiée telle qu'exprimée dans le contenu YAML des nœuds (brief §4/§5.1). */
export type NiveauPreuve = 'eleve' | 'modere' | 'faible' | 'tres_faible'

/** Nature du critère évalué par une référence primaire (brief §4 : dur vs substitution). */
export type TypeCritere = 'dur' | 'mixte' | 'substitution'

export interface CritereEntree {
  nom: string
  type: 'nombre' | 'bool' | 'enum'
  /** Uniquement pertinent quand `type` vaut `'enum'`. */
  valeurs?: string[]
}

export interface Option {
  intitule: string
  avantages: string[]
  inconvenients: string[]
  /** Effet absolu / NNT / NNH, sinon la chaîne `"non chiffrable"`. */
  effet_attendu: string
  niveau_preuve: NiveauPreuve
  /** Règles d'affichage : expressions booléennes sur les `criteres_entree`, ou `['default']`. */
  conditions: string[]
  /** Optionnel : omis dans le gabarit §11 pour les options sans contre-indication propre. */
  contre_indications?: string[]
}

export interface ReferencePrimaire {
  titre: string
  annee: number
  lien: string
  type_critere: TypeCritere
}

export interface Source {
  references_primaires: ReferencePrimaire[]
  medicalement_geek: {
    synthese: string
    lien: string
  }
  prescrire: {
    synthese: string
  }
  reco_officielle: {
    source: string
    position: string
    divergence: boolean
    explication: string
  }
}

export interface ChangelogEntry {
  date: string
  auteur: string
  resume: string
  /** Id de l'entrée de veille à l'origine de la modification, si applicable (DECISIONS.md D5). */
  veille_source?: string
}

export interface Meta {
  date_revue: string
  auteur: string
  statut: 'brouillon' | 'valide'
  version: string
  changelog: ChangelogEntry[]
}

/** Nœud de décision (brief §5.1). `domaine` obligatoire — module Décision multi-domaine (D8). */
export interface Noeud {
  id: string
  domaine: string
  titre: string
  population_cible: string
  criteres_entree: CritereEntree[]
  options: Option[]
  argumentaire: string
  sources: Source
  incertitudes: string[]
  /** Ids d'entrées de veille ayant modifié ce nœud (pont bidirectionnel avec la veille). */
  veille_liee: string[]
  meta: Meta
}
