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
import type { NiveauPreuve as NoeudNiveauPreuve, Noeud, TypeCritere } from '../content/node.types'
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

/** Ordre d'affichage des nœuds par domaine (id du nœud), parcours clinique voulu — pas l'ordre alphabétique
 *  des fichiers dont il dérive par défaut (`loadNodes.ts`). */
const NODE_ORDER: Record<string, string[]> = {
  // Le module RHD ouvre le parcours (mesures hygiéno-diététiques avant la prescription), l'alimentation
  // avant l'activité — décision référent 2026-07-26. Il remplace l'ancien nœud unique `rhd`, retiré le
  // même jour : celui-ci rendait la même carte, mot pour mot, à deux patients que tout oppose.
  'diabete-type-2': [
    'rhd-alimentation',
    'rhd-activite-physique',
    'cible-glycemique',
    'prescription',
    'insuline',
    'statine',
  ],
}

/** Trie les nœuds d'un domaine selon `NODE_ORDER` ; nœud non catalogué (futur) placé en fin, ordre de contenu. */
export function sortNodesForDomaine(domaine: string, nodes: Noeud[]): Noeud[] {
  const ordre = NODE_ORDER[domaine]
  if (!ordre) return nodes
  const rang = new Map(ordre.map((id, index) => [id, index]))
  return [...nodes].sort((a, b) => (rang.get(a.id) ?? ordre.length) - (rang.get(b.id) ?? ordre.length))
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
  // Nœud F « Statine » — lot intolérance du 2026-07-27.
  intolerance_statine: 'Intolérance aux statines (non / rapportée / avérée)',
  // Le « 0 = non dosé » fait partie du libellé, et pas seulement du commentaire du contenu : c'est la
  // valeur par défaut du champ, et un praticien doit pouvoir le laisser tel quel sans croire qu'il affirme
  // une CK normale. Le parcours NHS demande d'ailleurs de NE PAS doser les CK chez un patient
  // asymptomatique — le champ n'apparaît que si une intolérance est rapportée ou avérée.
  CK_x_normale: 'CK, en multiples de la normale (0 = non dosé)',
  dialyse: 'Dialyse',
  cetonemie: 'Cétonémie',
  hypoglycemie_recente: 'Hypoglycémie récente',
  motivation: "Motivation du patient",
  capacite_activite: "Capacité à l'activité physique",
  alimentation_equilibree: 'Alimentation déjà équilibrée',
  activite_physique_reguliere: 'Activité physique déjà régulière',
  // Nœud E « Insuline » (docs/decision/noeuds/E-insuline.md §1)
  situation_insuline: "Situation d'insulinothérapie",
  cible_atteinte: 'HbA1c à la cible',
  // ⚠ DEUX dérivés voisins, à ne pas confondre. `risque_hypoglycemique_eleve` = « ce patient est exposé à
  // l'hypoglycémie » → pilote le CHOIX DU TRAITEMENT. `terrain_cible_assouplie` = « ce patient a peu à
  // gagner d'un contrôle strict » (âge / fragilité / horizon de vie) → pilote la CIBLE.
  // Dette I4 SOLDÉE le 2026-07-27 : un dérivé `terrain_fragile` existait dans `prescription` avec une
  // définition DIFFÉRENTE de celle que `insuline` portait sous le même nom. Les deux nœuds ont fait la
  // même scission ; `terrain_cible_assouplie` porte désormais exactement la même définition des deux
  // côtés (age >= 75 OR fragilite OR esperance_vie == limitee), ce qui est tout l'objet de l'opération.
  // Aucun invariant PAR NŒUD ne pouvait détecter la divergence — elle s'est vue à la relecture.
  risque_hypoglycemique_eleve: 'Risque hypoglycémique élevé (terrain, schéma ou antécédent d’hypo sévère)',
  terrain_cible_assouplie: 'Terrain justifiant une cible relâchée (âge / fragilité / espérance de vie)',
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
  // Nœud fusionné « Prescription » (docs/decision/noeuds/prescription.SPEC.md) — critères ajoutés à la fusion.
  intention: 'Intention thérapeutique (« je souhaite… »)',
  position_vs_cible: "Par rapport à l'objectif fixé pour ce patient",
  hba1c_sous_cible: 'HbA1c < 6,5 % (sur-contrôle)',
  // Critères DÉRIVÉS : jamais saisis, mais désormais LISIBLES — depuis R6 la ligne « Proposé parce que »
  // ne cite plus que les termes vrais, donc un dérivé sans libellé s'affichait sous son nom de variable
  // humanisé (« Remplacement agent sans benefice », sans accents). Ils ont besoin d'un libellé au même
  // titre qu'un critère saisi.
  palette_glycemique_ouverte: "Palette glycémique ouverte (place pour un agent de contrôle en plus)",
  remplacement_agent_sans_benefice:
    "Remplacement d'un agent sans bénéfice sur critère dur (gliptine, sulfamide)",
  denutrition: 'Dénutrition / carence (possible même chez l’obèse)',
  infections_uro_genitales_recidivantes: 'Infections génito-urinaires récidivantes',
  intolerance_traitement: 'Intolérance à un traitement en cours',
  nature_intolerance: "Nature de l'intolérance",
  dose_metformine: 'Dose de metformine (mg/j)',
  isglt2_indisponible: "iSGLT2 inutilisable (déjà en cours, DFG < 20 ou infections génito-urinaires récidivantes)",
  aglp1_indisponible: "AR GLP-1 inutilisable (déjà en cours, dénutrition ou IMC < 22)",
  metformine_deprescriptible:
    "Metformine déprescriptible (fragilité, en dessous de l'objectif, sans sulfamide, glinide, gliptine ni insuline)",
  // Écarts à la cible (K6) : lus par le SEUL `preremplissage`, jamais par une règle de décision. Ils ne
  // peuvent donc pas apparaître dans un « Proposé parce que » — mais ils sont catalogués comme les autres,
  // parce qu'une exception nominative dans l'invariant de couverture coûterait plus cher que ces deux lignes.
  ecart_au_dessus_cible: "HbA1c au-dessus de l'objectif fixé",
  ecart_nettement_au_dessus_cible: "HbA1c à 1 point ou plus au-dessus de l'objectif fixé",
  // Nœud F « Statine » — le champ qui dit si le geste est DÉJÀ FAIT (R9).
  statine_deja_en_place: 'Statine déjà en place',
  // Nœud E « Insuline » — complément AGP.
  hypo_interprandiale: 'Hypoglycémies entre les repas',
  profil_nocturne_permet_titration:
    "Profil nocturne compatible avec une titration de la basale (courbe stable ou phénomène de l'aube)",
  profil_nocturne_a_cible: 'Profil nocturne à la cible (excursions post-prandiales au premier plan)',
  // ── Module RHD, axe alimentation (`rhd-alimentation.yaml`) ──
  // ⚠ CES LIBELLÉS NOMMENT L'ITEM RECUEILLI, ILS NE DÉFINISSENT PAS L'ÉCHELLE. « occasionnel » vs
  // « fréquent » n'est défini nulle part dans le contenu, et c'est pourtant cette frontière-là qui fait
  // basculer la piste (`== frequent OR == quotidien`). Y écrire un seuil ici serait inventer du contenu
  // clinique dans un fichier de présentation (invariant CLAUDE.md 6) : la définition doit vivre dans le
  // champ `aide` du critère, sous version et changelog — signalé au référent, pas comblé ici.
  frequence_boissons_sucrees: 'Boissons sucrées',
  frequence_ultratransformes: 'Aliments ultra-transformés',
  frequence_restauration_rapide: 'Restauration rapide',
  matiere_grasse_cuisson: 'Matière grasse de cuisson',
  regularite_repas: 'Régularité des repas',
  frequence_grignotage: 'Grignotage',
  acces_alimentation: "Accès à l'alimentation",
  frequence_fruits_a_coque: 'Fruits à coque',
  frequence_legumineuses: 'Légumineuses',
  frequence_poisson: 'Poisson',
  frequence_viande_rouge_charcuterie: 'Viande rouge et charcuterie',
  signes_appel_tca: "Signes d'appel d'un trouble du comportement alimentaire",
  difficulte_estimation_portions: 'Estimation des portions',
  alimentation_emotionnelle: 'Alimentation émotionnelle',
  consommation_vin: 'Consommation de vin',
  // ── Module RHD, axe activité physique (`rhd-activite-physique.yaml`) ──
  frequence_activite_structuree: "Séances d'activité physique structurée",
  duree_seance: "Durée d'une séance",
  mode_deplacement_courts_trajets: 'Déplacements sur les courts trajets',
  temps_assis_quotidien: 'Temps assis par jour',
  rupture_sedentarite_habituelle: 'Interrompt habituellement les longues périodes assises',
  limitation_physique_connue: 'Limitation physique connue',
  symptomes_ischemie_effort: "Symptômes d'ischémie à l'effort",
  retinopathie_non_stabilisee_ou_proliferante: 'Rétinopathie non stabilisée ou proliférante',
  neuropathie_ou_mal_perforant_plantaire: 'Neuropathie ou mal perforant plantaire',
  verrou_effort:
    "Signe imposant un avis avant la pratique structurée (limitation, ischémie d'effort, rétinopathie, pied)",
  difficulte_acces_activite: "Difficulté d'accès à une activité physique",
  offre_proximite_connue: "Offre d'activité de proximité connue",
  experience_activite_negative: "Expérience négative de l'activité physique",
}

/** Libellé d'un critère (`criteres_entree[].nom`) ; repli générique si critère non catalogué (nœud futur). */
export function labelForCritere(nom: string): string {
  return CRITERE_LABELS[nom] ?? humanize(nom)
}

/**
 * Ce critère a-t-il un libellé RÉDIGÉ, par opposition au repli mécanique `humanize` ?
 *
 * Existe pour l'invariant I20 (`banc/libelles.test.ts`), et pour lui seul. Le repli est un filet de
 * sécurité pour un contenu pas encore catalogué — il n'a jamais eu vocation à être ce qu'un praticien
 * lit à l'écran. La distinction ne peut pas se mesurer en comparant à `humanize()` : un libellé rédigé
 * peut coïncider avec le repli (« Dialyse »), et la présence de la clé est la seule question honnête.
 */
export function libelleCritereCatalogue(nom: string): boolean {
  return Object.hasOwn(CRITERE_LABELS, nom)
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
  // traitements_en_cours (liste, partagé B/C/D/E, nœud fusionné prescription)
  metformine: 'Metformine',
  iSGLT2: 'iSGLT2 (gliflozine)',
  aGLP1: 'AR GLP-1',
  tirzepatide: 'Tirzépatide',
  sulfamide: 'Sulfamide',
  glinide: 'Glinide',
  gliptine: 'Gliptine (iDPP4)',
  insuline: 'Insuline',
  insuline_basale: 'Insuline basale',
  insuline_rapide: 'Insuline rapide',
  // position_vs_cible (champ à 4 crans, nœud prescription — R1 docs/decision/GRAMMAIRE-NOEUD.md)
  a_l_objectif: "À l'objectif",
  au_dessus: "Au-dessus de l'objectif",
  nettement_au_dessus: "Nettement au-dessus de l'objectif",
  sous_objectif: "En dessous de l'objectif (sur-traitement probable)",
  // nature_intolerance (nœud prescription, S8)
  aucune: 'Aucune / non précisée',
  digestive: 'Digestive',
  uro_genitale: 'Génito-urinaire',
  perte_poids: 'Perte de poids excessive',
  cutanee: 'Cutanée',
  autre: 'Autre',
  // intention (primer S8, nœud prescription) — R1 (docs/decision/GRAMMAIRE-NOEUD.md) : l'intention décrit
  // un ACTE du praticien (« je souhaite… »), jamais un ÉTAT du patient (position vs objectif) — c'est
  // `position_vs_cible`/`cible_atteinte` qui portent l'état, déclaré séparément. Libellés reformulés en
  // conséquence (2026-07-25) : les trois affirmaient encore une position vs objectif, ce que R1 a
  // précisément retiré du moteur ; les laisser aurait enseigné à l'écran une sémantique abandonnée.
  initier: 'Initier un traitement',
  intensifier: 'Intensifier (renforcer le contrôle glycémique)',
  optimiser: 'Optimiser (améliorer le rapport bénéfice/risque du traitement)',
  deprescrire: 'Déprescrire (alléger ou retirer un traitement)',
  // intolerance_statine (nœud F)
  non: 'Non',
  rapportee: 'Rapportée',
  averee: 'Avérée',
  // ── Module RHD ──
  // ⚠ CE DICTIONNAIRE EST INDEXÉ PAR LA VALEUR SEULE, jamais par le couple (critère, valeur) : `occasionnel`
  // rend le même libellé pour les boissons sucrées et pour le vin. Ces cinq crans de fréquence sont donc
  // tenus VOLONTAIREMENT GÉNÉRIQUES — y glisser une quantité (« 1 à 2 fois par semaine ») la propagerait à
  // tous les items qui partagent le cran, y compris ceux pour lesquels elle serait fausse. Toute précision
  // par item appartient au champ `aide` du critère, dans le contenu.
  jamais: 'Jamais',
  occasionnel: 'Occasionnel',
  frequent: 'Fréquent',
  quotidien: 'Quotidien',
  regulier: 'Régulier',
  // rhd-alimentation — crans propres à un seul critère
  beurre_graisses_animales: 'Beurre ou graisses animales',
  melange: 'Un peu des deux',
  huile_olive_ou_colza: "Huile d'olive ou de colza",
  reguliers: 'Réguliers',
  irreguliers: 'Irréguliers',
  sans_difficulte: 'Sans difficulté',
  quelques_difficultes: 'Quelques difficultés',
  difficultes_importantes: 'Difficultés importantes',
  facile: 'Facile',
  difficile: 'Difficile',
  ne_sait_pas: 'Ne sait pas',
  un_a_six_verres_semaine: '1 à 6 verres par semaine',
  sept_verres_ou_plus_semaine: '7 verres ou plus par semaine',
  // rhd-activite-physique
  une_fois_semaine: '1 fois par semaine',
  deux_a_trois_fois_semaine: '2 à 3 fois par semaine',
  quatre_fois_ou_plus_semaine: '4 fois ou plus par semaine',
  moins_10_min: 'Moins de 10 minutes',
  dix_a_trente_min: '10 à 30 minutes',
  plus_30_min: 'Plus de 30 minutes',
  actif_pied_ou_velo: 'À pied ou à vélo',
  motorise_ou_assis: 'En voiture ou en transport assis',
  mixte: 'Les deux selon les jours',
  moins_4h: 'Moins de 4 h',
  quatre_a_huit_h: '4 à 8 h',
  plus_8h: 'Plus de 8 h',
}

/** Libellé d'une valeur d'énumération ; repli générique (couvre aussi les valeurs numériques telles quelles). */
export function labelForEnumValue(valeur: string): string {
  return ENUM_VALUE_LABELS[valeur] ?? humanize(valeur)
}

/** Pendant de `libelleCritereCatalogue` pour les valeurs d'énumération (I20). */
export function libelleValeurCatalogue(valeur: string): boolean {
  return Object.hasOwn(ENUM_VALUE_LABELS, valeur)
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
