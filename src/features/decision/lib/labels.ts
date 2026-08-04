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
import type { NomIcone } from '../../shared/icons/paths'
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
  // Nœuds RHD (alimentation + activité physique), 2026-07-29 : remplace `traitements_en_cours` sur ces
  // deux nœuds, qui ne lisaient que l'exposition à l'hypoglycémie et jamais la classe (cf. les YAML).
  insuline_ou_insulinosecreteur: 'Insuline, sulfamide ou glinide en cours',
  antecedent_cv: 'Antécédent cardiovasculaire',
  comorbidite_grave: 'Comorbidité grave',
  diabete_complique: "Diabète compliqué (atteinte d'organe : rétinopathie, néphropathie, neuropathie, macrovasculaire)",
  // Nœud F « Statine » — lot intolérance du 2026-07-27.
  intolerance_statine: 'Intolérance aux statines (non / rapportée / avérée)',
  // « (0 = non dosé) » RETIRÉ le 2026-08-03 (T-133, P12/S8) : `CK_x_normale` est devenu un critère DÉRIVÉ
  // (`CK_UI_L / CK_normale_sup`), plus une saisie directe — la mention décrivait la convention de l'ANCIEN
  // champ saisi, désormais fausse (un `CK_UI_L` non renseigné rend le multiple INDÉTERMINÉ, D20, jamais
  // `0` par convention). Le libellé sert encore : dans les phrases « Proposé parce que : … » (condition
  // humanisée sur le critère dérivé) et dans la ligne « · calculé » (`CriteriaForm.tsx`, T-133).
  CK_x_normale: 'CK, en multiples de la normale',
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
  // Passe A, 2026-07-29 : le nœud `insuline` déclare désormais `ecart_sous_objectif_cible`, le MÊME nom
  // et la MÊME dérivation que `prescription` (I4 inter-nœuds) — son libellé est donc celui déjà catalogué
  // plus bas, aucun ajout ici. À ne pas confondre avec `hba1c_sous_cible`, qui est le plancher ABSOLU
  // (< 6,5 %) de `prescription` et un concept distinct.
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
  // `TBR_severe` : libellé RETIRÉ le 2026-07-29 avec le critère (passe A, arbitrage référent — la
  // répartition TBR / TBR sévère n'est pas lisible en consultation, même avec capteur). Le laisser ici
  // aurait fait monter le compte de libellés morts d'I20bis, dont le plafond ne peut que descendre.
  TAR: 'TAR — temps au-dessus de 180 mg/dL (%)',
  CV_glycemique: 'Coefficient de variation glycémique (%)',
  GMI: 'GMI — indicateur de gestion du glucose (%)',
  // `profil_glycemique` (label ci-dessus jusqu'au 2026-07-30) RETIRÉ avec le critère : remplacé par
  // `profil_nocturne`/`profil_entre_repas`, catalogués plus bas (P8/S7, cf. `insuline.yaml` v0.34).
  // « habituelle » est porté par le LIBELLÉ à dessein (arbitrage référent 2026-07-29) : la règle de
  // descente retenue (ebmfrance) ne réagit pas à une valeur isolée. Cf. le champ `aide` du critère.
  GAJ: 'Glycémie à jeun habituelle (g/L)',
  // Passe A, 2026-07-29 : trois états là où il n'y avait qu'une appartenance à l'intervalle.
  // Bande 0,70-1,30 g/L — borne basse HAS (et seuil international d'hypoglycémie, donc déclencheur de
  // correction), borne haute SFD 2025 / ADA 2026. Divergence avec HAS (1,20) déclarée dans le nœud.
  gaj_a_cible: 'Glycémie à jeun à la cible',
  gaj_basse: 'Glycémie à jeun sous la cible (< 0,70 g/L)',
  gaj_haute: 'Glycémie à jeun au-dessus de la cible (> 1,30 g/L)',
  // Pivot « avant les repas » (arbitrage référent B, 2026-07-29) : la cible 0,70-1,30 est PRÉ-prandiale,
  // la glycémie du matin n'en est qu'un cas particulier. Le même seuil, avant un autre repas, juge le
  // bolus du repas précédent — c'est ainsi que FullSTEP a titré.
  glycemie_pre_repas: 'Glycémie avant le repas suivant, au repas le moins bien couvert (g/L)',
  pre_repas_haute: 'Glycémie avant le repas au-dessus de la cible (> 1,30 g/L) — bolus insuffisant',
  pre_repas_basse: 'Glycémie avant le repas sous la cible (< 0,70 g/L) — bolus trop fort',
  poids: 'Poids (kg)',
  // Ajouté T-133 (P12/S8) : `taille` alimente désormais le calcul de l'IMC (`prescription`, DÉRIVÉ,
  // `poids / taille / taille`) — l'unité est portée ICI, dans le libellé affiché, pas dans le nom de
  // variable technique (S8.md, « choisis, et dis lequel dans le libellé »).
  taille: 'Taille (m)',
  // Ajoutés T-133 (P12/S8) : `CK_UI_L`/`CK_normale_sup` alimentent désormais `CK_x_normale` (`statine`,
  // DÉRIVÉ, `CK_UI_L / CK_normale_sup`) — remplacent la saisie directe du multiple de la normale par ce
  // que le compte-rendu de laboratoire donne réellement : la valeur mesurée et la borne haute de la
  // normale du labo (qui varie d'un laboratoire à l'autre, d'où un champ plutôt qu'une constante).
  CK_UI_L: 'CK mesurées (UI/L)',
  CK_normale_sup: 'Borne haute de la normale du laboratoire (UI/L)',
  dose_basale_actuelle: 'Dose de basale actuelle (U/j)',
  dose_rapide_actuelle: 'Dose de rapide actuelle (U/j)',
  over_basalisation: 'Sur-basalisation (dose basale > 0,5 U/kg)',
  // `classes_a_benefice_indisponibles` RETIRÉ le 2026-07-29 avec le critère lui-même : le nœud calcule
  // désormais cette indisponibilité (`isglt2_indisponible AND aglp1_indisponible`) au lieu de la demander.
  // Nœud fusionné « Prescription » (docs/decision/noeuds/prescription.SPEC.md) — critères ajoutés à la fusion.
  intention: 'Intention thérapeutique (« je souhaite… »)',
  position_vs_cible: "Par rapport à l'objectif fixé pour ce patient",
  hba1c_sous_cible: 'HbA1c < 6,5 % (sur-contrôle)',
  // Critères DÉRIVÉS : jamais saisis, mais désormais LISIBLES — depuis R6 la ligne « Proposé parce que »
  // ne cite plus que les termes vrais, donc un dérivé sans libellé s'affichait sous son nom de variable
  // humanisé (« Remplacement agent sans benefice », sans accents). Ils ont besoin d'un libellé au même
  // titre qu'un critère saisi.
  palette_glycemique_ouverte: "Place disponible pour un agent de contrôle glycémique supplémentaire",
  remplacement_agent_sans_benefice:
    "Accès à un agent de contrôle glycémique, en ajout ou en remplacement d'un agent sans bénéfice sur critère dur (gliptine, sulfamide, glinide)",
  denutrition: 'Dénutrition / carence (possible même chez l’obèse)',
  infections_uro_genitales_recidivantes: 'Infections génito-urinaires récidivantes',
  intolerance_traitement: 'Intolérance à un traitement en cours',
  nature_intolerance: "Nature de l'intolérance",
  dose_metformine: 'Dose de metformine (mg/j)',
  isglt2_indisponible: "iSGLT2 inutilisable (déjà en cours, DFG < 20 ou infections génito-urinaires récidivantes)",
  aglp1_indisponible: "AR GLP-1 inutilisable (déjà en cours, dénutrition ou IMC < 22)",
  metformine_deprescriptible:
    "Metformine déprescriptible (fragilité, en dessous de l'objectif, sans sulfamide, glinide, gliptine ni insuline)",
  // Ajouté le 2026-08-04 (demande utilisateur, correctif « 3 cartes distinctes ») — lu par
  // `describeReasons` pour humaniser le motif d'une carte ÉCARTÉE (R4) : sans libellé, le repli
  // mécanique (`humanize`) afficherait le nom de variable brut. Le fait « dose à réduire » lui-même reste
  // une expression EN CLAIR dans le contenu (jamais un critère `derive`, cf. `prescription.yaml` pour le
  // pourquoi) : rien à cataloguer ici pour lui, `describeReasons` l'humanise terme par terme.
  metformine_seule_en_cours: 'Metformine seule en cours (aucun autre agent glycémique)',
  // Écarts à la cible (K6) : lus par le SEUL `preremplissage`, jamais par une règle de décision. Ils ne
  // peuvent donc pas apparaître dans un « Proposé parce que » — mais ils sont catalogués comme les autres,
  // parce qu'une exception nominative dans l'invariant de couverture coûterait plus cher que ces lignes.
  // Les QUATRE bandes depuis le 2026-07-29 (les deux seuils sous l'objectif ont été donnés par le référent).
  // TROIS LIBELLÉS RETIRÉS le 2026-07-29 (`ecart_au_dessus_cible`, `ecart_nettement_au_dessus_cible`,
  // `ecart_a_l_objectif_cible`) : `prescription` était le seul nœud à déclarer ces dérivés, et ils y ont
  // été supprimés avec le `preremplissage` de `position_vs_cible` qu'ils alimentaient. Plus aucun nœud ne
  // les déclare — les garder aurait fait grossir le compte de libellés MORTS que surveille I20bis
  // (`engine/banc/libelles.test.ts`), qui est un cliquet : il se baisse, il ne se relève pas.
  // `ecart_sous_objectif_cible` RESTE : le nœud `insuline` le déclare toujours (passe A, arbitrage
  // référent), il n'est donc pas mort.
  ecart_sous_objectif_cible: "HbA1c à 1 point ou plus en dessous de l'objectif fixé",
  // Nœud F « Statine » — le champ qui dit si le geste est DÉJÀ FAIT (R9).
  statine_deja_en_place: 'Statine déjà en place',
  // Nœud E « Insuline » — complément AGP. `profil_glycemique`/`hypo_interprandiale` RETIRÉS le
  // 2026-07-30 (P8/S7) : remplacés par `profil_nocturne`/`profil_entre_repas` ci-dessous (deux `enum`
  // au lieu d'une `liste` + un `bool` propre — cf. `insuline.yaml` changelog v0.34).
  profil_nocturne: 'Profil glycémique nocturne (lecture AGP)',
  profil_entre_repas: 'Profil glycémique entre les repas (lecture AGP)',
  // Libellé RÉÉCRIT le 2026-07-30 (P8/S7) : la courbe plate (ex-« stable ») cesse d'admettre la
  // titration, seule une hausse continue le fait désormais — l'ancien libellé (« courbe stable ou hausse
  // continue ») serait devenu faux.
  profil_nocturne_permet_titration:
    'Profil nocturne compatible avec une titration de la basale (hausse continue de la glycémie nocturne)',
  // Libellé RÉÉCRIT le 2026-07-30 (P8/S7) : le fondement change (courbe nocturne PLATE, plus excursions
  // post-prandiales — ce signal vit désormais dans `profil_entre_repas`) et le pivot est composé avec
  // `cible_atteinte` dans les `conditions` des options consommatrices (pas dans ce dérivé lui-même).
  profil_nocturne_a_cible:
    "Profil nocturne à la cible (courbe plate — l'écart d'HbA1c restant est diurne, la basale n'est pas en cause)",
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
  // Nœud E — profil_nocturne / profil_entre_repas (AGP). RENOMMÉS le 2026-07-30 (P8/S7) : remplacent
  // hypo_nocturne/phenomene_aube/excursions_postprandiales/stable/hypo_interprandiale (ex-valeurs de
  // `profil_glycemique` ou ex-critère `hypo_interprandiale`, tous retirés, cf. `insuline.yaml` v0.34).
  baisse_continue: 'Baisse continue de la glycémie nocturne',
  hausse_continue: 'Hausse continue de la glycémie nocturne',
  courbe_plate: 'Courbe nocturne plate',
  hausse_entre_repas: 'Hausse de la glycémie entre les repas',
  baisse_entre_repas: 'Baisse de la glycémie entre les repas',
  pas_de_signal: 'Pas de signal entre les repas',
  // traitements_en_cours (liste, partagé B/C/D/E, nœud fusionné prescription)
  metformine: 'Metformine',
  iSGLT2: 'iSGLT2 (gliflozine)',
  aGLP1: 'AR GLP-1',
  tirzepatide: 'Tirzépatide',
  sulfamide: 'Sulfamide',
  glinide: 'Glinide',
  // Raccourci le 2026-08-01 (même mécanisme que `intention`/`position_vs_cible` plus haut) : le sigle
  // de classe pharmacologique rejoint `ENUM_VALUE_DESCRIPTIONS` (déjà câblé en infobulle sur ces chips,
  // `title={describeEnumValue(valeur)}`), pour laisser Sulfamide/Gliptine/Glinide — les trois agents
  // sans bénéfice sur critère dur — tenir sur la même ligne de la grille de cases à cocher.
  gliptine: 'Gliptine',
  insuline: 'Insuline',
  insuline_basale: 'Insuline basale',
  insuline_rapide: 'Insuline rapide',
  // position_vs_cible (champ à 4 crans, nœud prescription — R1 docs/decision/GRAMMAIRE-NOEUD.md).
  // Raccourcis le 2026-08-01, même raison et même mécanisme que `intention` ci-dessus (le sens complet
  // du dernier cran — « sur-traitement probable » — vit désormais dans `ENUM_VALUE_DESCRIPTIONS`).
  a_l_objectif: "À l'objectif",
  au_dessus: "Au-dessus",
  nettement_au_dessus: "Nettement au-dessus",
  sous_objectif: "En dessous",
  // nature_intolerance (nœud prescription, S8) — `aucune` RETIRÉ le 2026-07-29 avec la conversion du
  // critère en `liste` multivaluée : une liste vide dit désormais « aucune nature précisée », la valeur
  // explicite n'a plus d'objet (elle n'existait que parce qu'un `enum` à choix unique en avait besoin).
  digestive: 'Digestive',
  uro_genitale: 'Génito-urinaire',
  perte_poids: 'Perte de poids excessive',
  cutanee: 'Cutanée',
  autre: 'Autre',
  // intention (primer S8, nœud prescription) — R1 (docs/decision/GRAMMAIRE-NOEUD.md) : l'intention décrit
  // un ACTE du praticien (« je souhaite… »), jamais un ÉTAT du patient (position vs objectif) — c'est
  // `position_vs_cible`/`cible_atteinte` qui portent l'état, déclaré séparément.
  //
  // LIBELLÉS RACCOURCIS AU SEUL VERBE (2026-08-01, amélioration de lisibilité) : la parenthèse
  // explicative qui suivait chacun (« Intensifier (renforcer le contrôle glycémique) », 45 caractères)
  // forçait un bouton par ligne sur `criteria-form__segmented` (`flex-wrap`, un texte trop long ne
  // laisse pas de place à un second bouton) et débordait même l'écran mobile (P6/SB4, 2026-07-28). Le
  // sens complet n'est PAS perdu : il vit désormais dans `ENUM_VALUE_DESCRIPTIONS` ci-dessous, déjà
  // câblé comme infobulle native (`title`) sur ces mêmes boutons — un raccourci de lecture, pas une
  // perte d'information.
  initier: 'Initier',
  intensifier: 'Intensifier',
  optimiser: 'Optimiser',
  deprescrire: 'Déprescrire',
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
  // `intention` (nœud prescription) — sens complet déplacé ici le 2026-08-01 quand le libellé affiché a
  // été raccourci au seul verbe (cf. `ENUM_VALUE_LABELS`, même entrées). Texte IDENTIQUE, mot pour mot,
  // à l'ancien libellé long : aucune reformulation, un déplacement.
  initier: 'Initier un traitement',
  intensifier: 'Intensifier (renforcer le contrôle glycémique)',
  optimiser: 'Optimiser (améliorer le rapport bénéfice/risque du traitement)',
  deprescrire: 'Déprescrire (alléger ou retirer un traitement)',
  // `position_vs_cible` — même déplacement, même règle (« sur-traitement probable » n'est perdu nulle
  // part, seulement déplacé de l'affichage direct vers l'infobulle).
  sous_objectif: "En dessous de l'objectif (sur-traitement probable)",
  // `traitements_en_cours` (liste) — sigle de classe déplacé en infobulle, cf. `ENUM_VALUE_LABELS`.
  gliptine: 'Gliptine (iDPP4)',
  // Profils AGP (nœud E « Insuline ») — comment lire la courbe et ce qu'elle oriente. RENOMMÉS le
  // 2026-07-30 (P8/S7) : la courbe plate gagne ici un GESTE qu'elle n'avait pas avant cette session
  // (« ne pas sur-titrer... ») — cf. `insuline.yaml` v0.34, dérivés `profil_nocturne_permet_titration`/
  // `profil_nocturne_a_cible`. CORRIGÉ le 2026-08-02 (T-067, P12/S4) : cette valeur ne déclenche plus
  // « Corriger l'hypoglycémie... » (2ᵉ génération, relâcher la cible) mais la carte dédiée « Réduire la
  // basale » — le tooltip ne doit plus promettre un geste que cette sélection ne déclenche plus.
  // RECORRIGÉ le 2026-08-02 (2ᵉ passe) : le chiffre est porté par HAS 2024 R.87/SFD 2025 Avis 18
  // (accord d'experts), pas une symétrie sans donnée — cf. commentaire de l'option dans `insuline.yaml`.
  baisse_continue: "Baisse glycémique en 2ᵉ partie de nuit sur l'AGP → réduire la basale (−2 U, ou −10 % au-delà de 40 U/j — HAS 2024 R.87, SFD 2025 Avis 18).",
  hausse_continue: "Remontée glycémique de ~4 h au réveil (couverture basale insuffisante) → titrer la basale.",
  courbe_plate: "Courbe nocturne régulière, sans hausse ni baisse marquée → si l'HbA1c reste au-dessus de l'objectif, la basale n'est pas en cause : ne pas sur-titrer, intensifier autrement (GLP-1 puis bolus).",
  hausse_entre_repas: "Pic glycémique après un repas alors que la glycémie à jeun est correcte → GLP-1 puis bolus, ou augmenter le bolus déjà en place, au repas le plus hyperglycémiant.",
  baisse_entre_repas: "Hypoglycémie entre les repas → réduire le bolus correspondant.",
  pas_de_signal: "Aucun signal notable entre les repas.",
  // Espérance de vie (critère partagé `esperance_vie`, cible-glycémique/prescription/insuline) —
  // T-069 (P9/S2, 2026-07-30). Seules deux des trois valeurs ont une définition chiffrée trouvée dans le
  // contenu déjà versé : `longue` (HAS 2024, `cible-glycemique.yaml` reco_officielle.position, « EV>15 ans »)
  // et `limitee` (synthèse Prescrire, `cible-glycemique.yaml` synthese_critique.donnee, « espérance de vie
  // < 5 ans »). `intermediaire` n'a de seuil chiffré nulle part dans le contenu versé (ni HAS, ni la
  // synthèse Prescrire, ni l'argumentaire) — pas d'entrée ici plutôt qu'un chiffre inventé (cf. bilan de
  // session P9/S2).
  longue: "Espérance de vie estimée supérieure à 15 ans (HAS) — avec un diagnostic récent et l'absence de maladie cardiovasculaire, c'est la situation où la cible la plus stricte (≤ 6,5 %) est envisagée.",
  limitee: "Espérance de vie estimée inférieure à 5 ans — un facteur d'assouplissement de la cible (jusqu'à 8-9 %) : le bénéfice d'un contrôle strict n'a pas le temps de se manifester, face au risque d'hypoglycémie.",
}

export function describeEnumValue(valeur: string): string | undefined {
  return ENUM_VALUE_DESCRIPTIONS[valeur]
}

/**
 * Ton sémantique d'une valeur d'énumération (P11/S4, T-107) — même mécanisme exact qu'`ENUM_VALUE_ICONS`
 * ci-dessous : un dictionnaire de CONTENU indexé par la VALEUR seule, jamais par un nom de critère ni de
 * nœud (invariant 5, `CLAUDE.md` D8). Colore le bouton de saisie (`.criteria-form__segment`/`.criteria-
 * form__chip`, `CriteriaForm.tsx`) selon le sens clinique de la valeur retenue, à l'état SÉLECTIONNÉ
 * uniquement — le repos reste neutre (cf. `CriteriaForm.css`). `undefined` pour toute valeur non
 * cataloguée : repli sur le bleu de sélection historique.
 *
 * REMPLACE la justification couleur qui vivait dans `ENUM_VALUE_ICONS` (« l'icône porte le code couleur
 * à elle seule ») pour les 4 crans de `position_vs_cible` : avec un ton en CSS, les emoji ✅⚠️🔴🔵
 * n'avaient plus de raison d'être — cf. leur retrait ci-dessous.
 *
 * CATALOGUE VOLONTAIREMENT ÉTROIT (S4.md T-107 étape 2) : seules les valeurs que la maquette
 * `Traiter - Refonte ergonomie.dc.html` colore réellement (l.116-119, section « Équilibre » +
 * `stylesAlbuminurie`/`stylesRisque` l.157-162/223-226) — jamais une extrapolation à d'autres valeurs
 * du même « air de famille » (ex. `preference_injection == refuse`, laissé neutre : une préférence
 * patient n'est pas un jugement clinique, cf. `CriteriaForm.tsx`).
 */
export type TonValeur = 'succes' | 'attention' | 'danger' | 'info' | 'neutre'

const ENUM_VALUE_TONES: Record<string, TonValeur> = {
  // `position_vs_cible` (nœud prescription, section « Équilibre ») — écart à l'objectif, du plus
  // favorable au moins favorable. `sous_objectif` (sur-traitement) est `info`, pas `danger` : ce n'est
  // pas un échec au même titre qu'un excès, plutôt un signal à considérer (même bleu que l'accent de
  // décision par défaut — cf. `CriteriaForm.css`, aucun triplet `--c-ton-info-*` dédié dans `tokens.css`).
  a_l_objectif: 'succes',
  au_dessus: 'attention',
  nettement_au_dessus: 'danger',
  sous_objectif: 'info',
  // `albuminurie` (nœud prescription)
  normo: 'succes',
  micro: 'attention',
  macro: 'danger',
  // `risque_hypoglycemie_schema` (partagé prescription/insuline)
  faible: 'succes',
  eleve: 'danger',
  // `esperance_vie` (partagé cible-glycémique/prescription/insuline, 2026-08-04, demande utilisateur :
  // chips plus lisibles au premier coup d'œil) : longue → cible stricte envisageable (succès), limitée →
  // facteur d'assouplissement de la cible (danger, même registre que `risque_hypoglycemie_schema`
  // ci-dessus — un signal à considérer, pas un jugement sur le patient), intermédiaire entre les deux.
  longue: 'succes',
  intermediaire: 'attention',
  limitee: 'danger',
  // `preference_injection` (partagé prescription/insuline, 2026-08-04, demande utilisateur) — ARBITRAGE
  // EXPLICITE DU RÉFÉRENT (2026-07-29, cf. `prescription.yaml`, commentaire de `classes_a_benefice_indisponibles`
  // retiré) : un refus d'injectable est une PRÉFÉRENCE du patient, jamais un jugement clinique. Le ton
  // reste donc PUREMENT visuel (repère de lecture), et surtout PAS le même mécanisme que les tons
  // cliniques ci-dessus qui pilotent une hiérarchie de gravité — demandé explicitement par l'utilisateur
  // malgré cette réserve, en connaissance du registre (gris neutre/vert/rouge, pas succès/danger au sens
  // clinique).
  indifferent: 'neutre',
  accepte: 'succes',
  refuse: 'danger',
}

export function toneForEnumValue(valeur: string): TonValeur | undefined {
  return ENUM_VALUE_TONES[valeur]
}

/**
 * Sous-ensemble de `ENUM_VALUE_TONES` qui se rend en PASTILLE RONDE plutôt qu'en simple couleur de
 * fond/bordure du bouton (`CriteriaForm.tsx` étape 6) — les 4 crans de `position_vs_cible` seulement
 * (maquette l.116-119 : chacun porte un `<span>` de 7 px ; les boutons `Albuminurie`/`Risque
 * hypoglycémique`, l.157-162/223-226, n'en portent AUCUN, seule leur couleur de sélection les distingue).
 * INDEXÉ PAR LA VALEUR, comme `ENUM_VALUE_TONES` — jamais par le nom du critère (D8) : ce n'est pas
 * « position_vs_cible en dur », c'est que ces 4 valeurs précises sont, dans le contenu de la maquette,
 * les seules à porter ce traitement graphique.
 */
const ENUM_VALUE_PASTILLE = new Set<string>(['a_l_objectif', 'au_dessus', 'nettement_au_dessus', 'sous_objectif'])

export function pastilleForEnumValue(valeur: string): boolean {
  return ENUM_VALUE_PASTILLE.has(valeur)
}

/**
 * Icône générique d'une valeur d'énumération (amélioration de lisibilité, 2026-08-01 ; réduite à 4
 * entrées le 2026-08-01, P11/S4 T-107) — même mécanisme que `labelForEnumValue`/`describeEnumValue`
 * ci-dessus : un dictionnaire de CONTENU, une fonction GÉNÉRIQUE (`CriteriaForm.tsx` ne connaît aucune
 * valeur par son nom). `undefined` pour toute valeur non cataloguée : le composant appelant retombe
 * alors sur le texte seul (ou, depuis T-107, sur la pastille de ton s'il y en a une), rendu historique.
 *
 * LES 4 VALEURS DE STATUT (`position_vs_cible`) SONT SORTIES DE CE DICTIONNAIRE (T-107) : leur
 * justification — « l'icône porte le code couleur à elle seule » — est devenue fausse dès qu'un ton CSS
 * existe pour la même distinction (`ENUM_VALUE_TONES` ci-dessus) ; les garder aurait fait cohabiter deux
 * mécanismes pour un seul message. Restent les 4 verbes d'`intention`, qui ne portent PAS de gravité
 * (initier/intensifier/optimiser/déprescrire sont quatre actes légitimes, aucun n'est meilleur qu'un
 * autre) — un pictogramme de SENS, pas une couleur d'alerte, donc toujours une icône plutôt qu'un ton.
 */
const ENUM_VALUE_ICONS: Record<string, NomIcone> = {
  // `intention` (nœud prescription) — tracés reconduits d'`Icon.tsx`/`paths.ts` (P11/S2, T-104),
  // choisis pour reproduire le pictogramme déjà utilisé dans la maquette pour chaque verbe.
  initier: 'lecture',
  intensifier: 'fleche-haut',
  optimiser: 'reglages',
  deprescrire: 'fleche-bas-pleine',
}

export function iconForEnumValue(valeur: string): NomIcone | undefined {
  return ENUM_VALUE_ICONS[valeur]
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
