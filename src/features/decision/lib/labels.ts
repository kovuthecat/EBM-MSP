/**
 * Libellés d'affichage dérivés du contenu (S4, câblage D2/D3). Le contenu (`schema/noeud.schema.json`,
 * `content/**`) ne porte pas de champ de libellé dédié pour `domaine` (juste un slug, ex.
 * `diabete-type-2`) ni pour `criteres_entree[].nom`/`valeurs[]` (des identifiants de variable, ex.
 * `esperance_vie`, `limitee`) — cf. S4.md T-005 "Si bloqué" (exemple cité : « thème d'affichage »).
 *
 * Parti pris (pas un contournement du moteur/contenu, juste de la présentation) : un dictionnaire
 * couvrant les identifiants déjà documentés — transcrits de `docs/decision/CADRAGE-8-noeuds.md` §0
 * (dictionnaire consolidé des variables, réutilisées par tous les nœuds A→H) et `ARCHITECTURE.md`
 * (domaines de la roadmap) — avec repli générique (`humanize`) pour tout identifiant non catalogué
 * (nouveau nœud/domaine futur). Rien n'est inventé côté clinique : ce sont des noms de variables et
 * de domaines déjà écrits dans les docs du projet, pas des faits médicaux nouveaux. À faire évoluer
 * si un jour un vrai champ de libellé est ajouté au schéma (décision hors périmètre S4).
 *
 * Le groupement des nœuds par « thème » (T-005) n'a pas besoin de ce mécanisme : il utilise
 * directement `noeud.titre` (champ réel, déjà en français correct) comme intitulé de groupe — voir
 * `DecisionDomainsScreen.tsx`.
 */
import type { NiveauPreuve as NoeudNiveauPreuve, TypeCritere } from '../content/node.types'
import type { NiveauPreuve as SharedNiveauPreuve } from '../../shared/types'
import { humanize } from './humanize'

/** Domaines réellement dotés de contenu, avec libellé connu (roadmap `ARCHITECTURE.md`/`DECISIONS.md` D8). */
const DOMAIN_LABELS: Record<string, string> = {
  'diabete-type-2': 'Diabète de type 2',
}

/** Un domaine « à venir » : pas de contenu en P1, chip désactivé, libellé fixe (S4.md T-005 "Décision clé"). */
export interface UpcomingDomain {
  slug: string
  label: string
}

/** Domaines annoncés par la roadmap mais sans nœud en P1 (ARCHITECTURE.md D2, PROJECT_BRIEF.md). */
export const UPCOMING_DOMAINS: UpcomingDomain[] = [
  { slug: 'cardiovasculaire', label: 'Cardiovasculaire' },
  { slug: 'bpco', label: 'BPCO' },
  { slug: 'geriatrie', label: 'Gériatrie' },
]

/** Libellé d'un domaine (slug réel, ex. `diabete-type-2`) ; repli générique si domaine non catalogué. */
export function labelForDomaine(domaine: string): string {
  return DOMAIN_LABELS[domaine] ?? humanize(domaine)
}

/** Dictionnaire consolidé des variables d'entrée, `docs/decision/CADRAGE-8-noeuds.md` §0 (nœuds A→H). */
const CRITERE_LABELS: Record<string, string> = {
  age: 'Âge',
  anciennete_diabete_annees: 'Ancienneté du diabète (ans)',
  esperance_vie: 'Espérance de vie',
  fragilite: 'Fragilité',
  risque_hypoglycemie_schema: 'Risque hypoglycémique du schéma',
  HbA1c_actuelle: 'HbA1c actuelle (%)',
  HbA1c_cible: 'HbA1c cible (%)',
  DFG: 'DFG (mL/min/1,73 m²)',
  albuminurie: 'Albuminurie',
  ASCVD_etablie: 'Maladie cardiovasculaire athéromateuse établie',
  insuffisance_cardiaque: 'Insuffisance cardiaque',
  IRC: 'Insuffisance rénale chronique',
  IMC: 'IMC (kg/m²)',
  prevention: 'Prévention',
  autres_FDRCV: 'Autres facteurs de risque cardiovasculaire',
  SCORE2: 'SCORE2 (% risque à 10 ans)',
  preference_injection: "Préférence vis-à-vis de l'injectable",
  contrainte_cout: 'Contrainte de coût',
  traitements_en_cours: 'Traitements en cours',
  antecedent_cv: 'Antécédent cardiovasculaire',
  comorbidite_grave: 'Comorbidité grave',
  diabete_complique: "Diabète compliqué (atteinte d'organe : rétinopathie, néphropathie, neuropathie, macrovasculaire)",
  dialyse: 'Dialyse',
  motivation: "Motivation du patient",
  capacite_activite: "Capacité à l'activité physique",
  alimentation_equilibree: 'Alimentation déjà équilibrée',
  activite_physique_reguliere: 'Activité physique déjà régulière',
  // Nœud D « Sulfamides / gliptines » (docs/decision/noeuds/D-sulfamides-gliptines.md §1)
  classes_a_benefice_indisponibles:
    'iSGLT2 et AR GLP-1 tous deux inutilisables (contre-indication, intolérance ou refus)',
}

/** Libellé d'un critère (`criteres_entree[].nom`) ; repli générique si critère non catalogué (nœud futur). */
export function labelForCritere(nom: string): string {
  return CRITERE_LABELS[nom] ?? humanize(nom)
}

/** Valeurs d'énumération rencontrées dans les `valeurs[]` des critères (même dictionnaire §0). */
const ENUM_VALUE_LABELS: Record<string, string> = {
  longue: 'Longue',
  intermediaire: 'Intermédiaire',
  limitee: 'Limitée',
  faible: 'Faible',
  eleve: 'Élevé',
  normo: 'Normoalbuminurie',
  micro: 'Microalbuminurie',
  macro: 'Macroalbuminurie',
  primaire: 'Primaire',
  secondaire: 'Secondaire',
  accepte: 'Accepte',
  refuse: 'Refuse',
  indifferent: 'Indifférent',
}

/** Libellé d'une valeur d'énumération ; repli générique (couvre aussi les valeurs numériques telles quelles). */
export function labelForEnumValue(valeur: string): string {
  return ENUM_VALUE_LABELS[valeur] ?? humanize(valeur)
}

/** `TypeCritere` est une union fermée (3 valeurs, `node.types.ts`) : dictionnaire exhaustif sûr. */
const TYPE_CRITERE_LABELS: Record<TypeCritere, string> = {
  dur: 'Critère dur',
  mixte: 'Critère mixte',
  substitution: 'Critère de substitution',
}

export function labelForTypeCritere(type: TypeCritere): string {
  return TYPE_CRITERE_LABELS[type]
}

/**
 * `node.types.ts` documente un écart de forme volontairement non résolu en S2 : l'énumération
 * `NiveauPreuve` du contenu utilise `tres_faible` (underscore), celle de `shared/types.ts` (créée en
 * S1 pour l'affichage transverse, réutilisée par `EvidenceBadge`) utilise `tres-faible` (trait
 * d'union) — cf. commentaire de `node.types.ts` : "à trancher... probablement par une fonction de
 * mapping plutôt qu'en unifiant les deux". Fonction de mapping demandée, exécutée ici (S4).
 */
export function toSharedNiveauPreuve(niveau: NoeudNiveauPreuve): SharedNiveauPreuve {
  return niveau === 'tres_faible' ? 'tres-faible' : niveau
}

/** `meta.date_revue` ("2026-07-22", ISO) → format du prototype ("22/07/2026"). Repli sur la chaîne
 *  brute si le contenu ne respecte pas ce format (le schéma ne contraint que `type: string`). */
export function formatDateRevue(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return iso
  const [, year, month, day] = match
  return `${day}/${month}/${year}`
}
