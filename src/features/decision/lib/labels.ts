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
  // Nœud E « Insuline » (docs/decision/noeuds/E-insuline.md §1)
  situation_insuline: "Situation d'insulinothérapie",
  cible_atteinte: 'HbA1c à la cible',
  terrain_fragile: 'Terrain fragile (âgé / fragile / EV limitée / risque hypo)',
  hypo_severe_recurrente: 'Hypoglycémies sévères récurrentes / non-perception',
  symptomes_glucotoxicite: 'Symptômes de glucotoxicité (polyuro-polydipsie, amaigrissement)',
  mcg_disponible: 'MCG disponible',
  TIR: 'TIR — temps dans la cible 70-180 mg/dL (%)',
  TBR: 'TBR — temps sous 70 mg/dL (%)',
  TBR_severe: 'TBR sévère — temps sous 54 mg/dL (%)',
  TAR: 'TAR — temps au-dessus de 180 mg/dL (%)',
  CV_glycemique: 'Coefficient de variation glycémique (%)',
  GMI: 'GMI — indicateur de gestion du glucose (%)',
  profil_glycemique: 'Profil glycémique (lecture AGP)',
  GAJ: 'Glycémie à jeun (g/L)',
  gaj_a_cible: 'Glycémie à jeun à la cible',
  poids: 'Poids (kg)',
  dose_basale_actuelle: 'Dose de basale actuelle (U/j)',
  dose_rapide_actuelle: 'Dose de rapide actuelle (U/j)',
  over_basalisation: 'Sur-basalisation (dose basale > 0,5 U/kg)',
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
  // Nœud E — situation_insuline
  naif: "Naïf d'insuline",
  basale_seule: 'Basale seule',
  basale_plus_bolus: 'Basal-plus / bolus',
  basal_bolus: 'Basal-bolus',
  // Nœud E — profil_glycemique (AGP)
  hypo_nocturne: 'Hypoglycémie nocturne',
  phenomene_aube: "Phénomène de l'aube",
  excursions_postprandiales: 'Excursions post-prandiales',
  hypo_interprandiale: 'Hypoglycémie interprandiale',
  stable: 'Stable',
  // traitements_en_cours (liste, partagé B/C/E)
  metformine: 'Metformine',
  iSGLT2: 'iSGLT2 (gliflozine)',
  aGLP1: 'AR GLP-1',
  sulfamide: 'Sulfamide',
  glinide: 'Glinide',
  gliptine: 'Gliptine (iDPP4)',
  insuline_basale: 'Insuline basale',
  insuline_rapide: 'Insuline rapide',
}

/** Libellé d'une valeur d'énumération ; repli générique (couvre aussi les valeurs numériques telles quelles). */
export function labelForEnumValue(valeur: string): string {
  return ENUM_VALUE_LABELS[valeur] ?? humanize(valeur)
}

/**
 * Description (tooltip) optionnelle d'une valeur d'énumération/liste — générique (aucune connaissance
 * d'un nom de critère). Utilisée par `CriteriaForm` comme infobulle native (`title`). Ex. lecture de
 * l'AGP par profil glycémique du nœud E (arbitrage référent §8-3 : « un tooltip de lecture de la courbe
 * pour chaque profil »). Renvoie `undefined` si aucune description n'est cataloguée.
 */
const ENUM_VALUE_DESCRIPTIONS: Record<string, string> = {
  // Profils AGP (nœud E « Insuline ») — comment lire la courbe et ce qu'elle oriente.
  hypo_nocturne: "Baisse glycémique en 2ᵉ partie de nuit sur l'AGP → réduire la basale, envisager un analogue de 2ᵉ génération, relâcher la cible.",
  phenomene_aube: "Remontée glycémique de ~4 h au réveil (couverture basale insuffisante) → titrer la basale.",
  excursions_postprandiales: "Pics après les repas alors que la glycémie à jeun est correcte → GLP-1 puis bolus au repas le plus hyperglycémiant.",
  hypo_interprandiale: "Hypoglycémies entre les repas → réduire le bolus correspondant.",
  stable: "Courbe régulière, faible variabilité — pas d'ajustement dicté par la forme.",
}

export function describeEnumValue(valeur: string): string | undefined {
  return ENUM_VALUE_DESCRIPTIONS[valeur]
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
