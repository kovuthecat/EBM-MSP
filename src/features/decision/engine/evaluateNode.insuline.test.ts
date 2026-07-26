/**
 * Banc de vignettes EXÉCUTABLE du nœud `insuline` (`content/noeuds/diabete-type-2/insuline.yaml`).
 * Modèle de style : `evaluateNode.prescription.test.ts`. Ce nœud n'avait jusqu'ici AUCUNE vignette
 * clinique — celles-ci sont les premières, validées par le référent (tableau `E-01` à `E-09` du rapport
 * de tâche du 2026-07-26).
 *
 * LA RÈGLE QUI PRIME : la sortie attendue de chaque `it` vient du RÉFÉRENT, jamais du moteur exécuté a
 * posteriori pour en déduire l'attente. Quand attente et comportement divergent, la vignette est écrite
 * `it.fails` — elle DOIT échouer, et c'est le livrable : elle fige la divergence pour le chantier qui la
 * lèvera, au lieu de figer (à tort) le comportement actuel.
 *
 * Trois décisions référent du 2026-07-26 ne sont PAS encore implémentées dans `insuline.yaml`
 * (cf. `DECISIONS.md` D20/D21 pour le mécanisme `enAttente`/`exclusions` déjà en place par ailleurs, et
 * `docs/decision/validation/recette-2026-07-25-prescription-intensifier.md`, captures 7-10 et 12.1-12.12,
 * pour le constat qui les a fait remonter) :
 *  - E-02 — une situation « naïf » ET une « insuline basale » cochée dans les traitements est une
 *    incohérence de SAISIE ; l'outil doit le DIRE (alerte), pas seulement s'abstenir de proposer.
 *  - E-03 — le pivot de la situation « basale seule » doit devenir le PROFIL NOCTURNE (MCG) quand elle
 *    est disponible, la glycémie à jeun (`gaj_a_cible`) n'étant plus que le repli sans MCG.
 *  - E-06 (et le second volet d'E-04) — sécurité (réduire la basale / ne pas sur-titrer) et efficacité
 *    (traitement non insulinique ou ajout d'un bolus) doivent être CUMULABLES ; aujourd'hui seul le
 *    geste de sécurité est proposé et l'HbA1c au-dessus de la cible reste sans réponse.
 *
 * Ce fichier n'exécute et ne modifie que ce nœud + le moteur RÉEL (`evaluateNode` + `deriveCritere`) ;
 * aucun autre fichier du dépôt n'est touché par cette tâche (trois agents écrivent en parallèle sur
 * d'autres nœuds).
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import { calculerCriteresDerives } from './deriveCritere.ts'
import { evaluateNode } from './evaluateNode.ts'
import type { Criteria } from './conditions.ts'

const node = getNoeudById('insuline')
if (!node) throw new Error('Nœud "insuline" introuvable (content/noeuds/diabete-type-2/insuline.yaml).')

/**
 * Profil « neutre » cliniquement plausible : situation « basale seule », valeurs jamais à zéro par
 * accident (over_basalisation, gaj_a_cible… dépendent toutes de divisions/bornes sensibles à 0 — cf.
 * `docs/decision/validation/recette-2026-07-25-prescription-intensifier.md` 12.1-12.5). Les critères
 * dérivés (`cible_atteinte`, `terrain_fragile`, `gaj_a_cible`, `over_basalisation`) sont recalculés par
 * `calculerCriteresDerives` à chaque appel ; les valeurs ici ne servent qu'à la lecture du profil neutre
 * (même convention que `evaluateNode.prescription.test.ts`).
 */
const BASE: Criteria = {
  situation_insuline: 'basale_seule',
  age: 60,
  HbA1c_actuelle: 7,
  HbA1c_cible: 7,
  DFG: 70,
  fragilite: false,
  esperance_vie: 'longue',
  risque_hypoglycemie_schema: 'faible',
  hypo_severe_recurrente: false,
  symptomes_glucotoxicite: false,
  traitements_en_cours: [],
  preference_injection: 'indifferent',
  mcg_disponible: false,
  TBR: 2,
  TBR_severe: 0,
  CV_glycemique: 20,
  profil_glycemique: ['stable'],
  GAJ: 1.0,
  poids: 75,
  dose_basale_actuelle: 20,
  dose_rapide_actuelle: 5,
  cible_atteinte: true,
  terrain_fragile: false,
  gaj_a_cible: true,
  over_basalisation: false,
}

/** Mode « tout est renseigné » (D20, repli) : comportement booléen strict, comme avant le chantier. */
function evalProfile(overrides: Partial<Criteria>) {
  const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...overrides } as Criteria)
  return evaluateNode(node!, criteria)
}

/** Primitifs `nombre`/`enum` du nœud (seuls types réellement indéterminables tant que non saisis, D20
 * §2.2 — `bool`/`liste` restent déterminés par leur défaut, ce nœud ne déclare aucun
 * `confirmation_requise`). Sert à construire un `renseignes` réaliste pour les vignettes E-05/E-09. */
const CRITERES_NOMBRE_ENUM = node!.criteres_entree
  .filter((c) => c.derive == null && (c.type === 'nombre' || c.type === 'enum'))
  .map((c) => c.nom)

/**
 * Mode TERNAIRE (D20) : simule un formulaire où seuls les champs `nombre`/`enum` NON listés dans
 * `nonRenseignes` ont été effectivement saisis par le praticien — même convention que
 * `evaluateNode.indetermine.test.ts` (une valeur placeholder dans `overrides` ne rend pas le champ
 * « renseigné » ; seule son absence de l'ensemble `renseignes` compte).
 */
function evalProfileTernaire(overrides: Partial<Criteria>, nonRenseignes: string[]) {
  const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...overrides } as Criteria)
  const renseignes = new Set(CRITERES_NOMBRE_ENUM.filter((nom) => !nonRenseignes.includes(nom)))
  return evaluateNode(node!, criteria, renseignes)
}

const titles = (o: Partial<Criteria>) => evalProfile(o).applicable.map((opt) => opt.intitule)
const excludedTitles = (o: Partial<Criteria>) => [...evalProfile(o).excluded.keys()].map((opt) => opt.intitule)
const alertMsgs = (o: Partial<Criteria>) => evalProfile(o).alertes.map((a) => a.message)
const has = (list: string[], sub: string) => list.some((t) => t.includes(sub))

// Intitulés exacts (substrings sans apostrophe ni exposant, pour éviter tout piège de codage de
// caractère — même précaution que `GLP1` dans `evaluateNode.prescription.test.ts`).
const GLP1_NAIF = 'Envisager un GLP-1'
const INITIER_BASALE = 'Initier une insuline basale'
const ANALOGUE_2G = 'Choisir un analogue basal'
const CORRIGER_HYPO = 'variabilité (réduire la dose'
const NE_PAS_SURTITRER = 'Ne pas sur-titrer la basale'
const TITRER = 'Titrer la basale'
const AJOUTER_GLP1_BB = 'Ajouter un GLP-1 / une association fixe'
const AJOUTER_BOLUS = 'Ajouter un bolus au repas principal'
const DESINTENSIFIER = 'Désintensifier / alléger le schéma'
const OPTIMISER_BB = 'Optimiser la répartition du basal-bolus'
const POURSUIVRE = 'Poursuivre le schéma'

describe('insuline — E-01 : naïf, HbA1c au-dessus de la cible, pas de GLP-1 en cours', () => {
  it('GLP-1 (avant/avec l\'insuline) ET initiation d\'une basale sont TOUTES DEUX applicables (gestes cumulables, pas une alternative)', () => {
    const o = {
      situation_insuline: 'naif',
      HbA1c_actuelle: 9,
      HbA1c_cible: 7,
      traitements_en_cours: [],
      symptomes_glucotoxicite: false,
    } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, GLP1_NAIF)).toBe(true)
    expect(has(t, INITIER_BASALE)).toBe(true)
    // Un naïf fragile n'est pas ce profil (âge 60, non fragile, EV longue) : pas d'analogue 2ᵉ génération ici.
    expect(has(t, ANALOGUE_2G)).toBe(false)
  })
})

describe('insuline — décisions référent 2026-07-26 NON implémentées (spécification du travail restant)', () => {
  it.fails(
    'E-02 — naïf ET « insuline basale » déjà cochée dans les traitements : incohérence de SAISIE, l\'outil doit le DIRE. ' +
      'Référent (2026-07-26) : « si il est naïf, il ne peut pas avoir une basale dans son traitement. » ' +
      'Aujourd\'hui : le prérequis 12.10 (recette 2026-07-25, déjà encodé) fait taire SILENCIEUSEMENT ' +
      '« Initier une insuline basale » — correct pour l\'absence de l\'option, mais insuffisant : rien ne ' +
      'signale au praticien que la SAISIE elle-même est contradictoire. Aucune alerte de cohérence ' +
      'n\'existe dans ce nœud. Chantier : une alerte de nœud sur ' +
      '`situation_insuline == naif AND traitements_en_cours contient insuline_basale` (canal « alerte de ' +
      'nœud », D21 — le fait est vrai quel que soit le geste retenu).',
    () => {
      const o = {
        situation_insuline: 'naif',
        traitements_en_cours: ['insuline_basale'],
        HbA1c_actuelle: 9,
        HbA1c_cible: 7,
      } as Partial<Criteria>
      // Déjà correct (12.10, 2026-07-25) : l'option ne se propose plus.
      expect(has(titles(o), INITIER_BASALE)).toBe(false)
      // Manquant : aucune alerte ne nomme l'incohérence de saisie elle-même.
      expect(alertMsgs(o).some((m) => /incohéren/i.test(m))).toBe(true)
    },
  )

  it.fails(
    'E-03 — le pivot doit être le PROFIL NOCTURNE (MCG), pas la glycémie à jeun. ' +
      'Référent (2026-07-26, répété 3 fois, dont recette capture 8) : « titrer sur la courbe nocturne, pas ' +
      'la GAJ ; la GAJ est le cas de repli quand il n\'y a pas de MCG, ce qui est maintenant rare. » ' +
      'Refonte attendue : `mcg_disponible == true` → le profil nocturne gouverne le choix ' +
      'titrer / ne-pas-titrer ; repli sur la GAJ seulement si `mcg_disponible == false` (cf. ' +
      '`insuline.yaml`, bloc `incertitudes` « PIVOT gaj_a_cible », NON implémenté). ' +
      'Ici : MCG disponible, profil nocturne STABLE (aucune hypo), HbA1c au-dessus de la cible → la ' +
      'titration devrait être admise sur ce motif nocturne ; mais la GAJ, par ailleurs déclarée « à la ' +
      'cible », route aujourd\'hui vers « Ne pas sur-titrer » au lieu de « Titrer » — c\'est exactement le ' +
      'pivot que le référent demande de renverser.',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        mcg_disponible: true,
        profil_glycemique: ['stable'],
        HbA1c_actuelle: 8,
        HbA1c_cible: 7,
        GAJ: 1.0, // « à la cible » : c'est justement ce qui, aujourd'hui, empêche la titration
        TBR: 2,
        TBR_severe: 0,
        CV_glycemique: 20,
        dose_basale_actuelle: 20,
        poids: 75,
      } as Partial<Criteria>
      expect(has(titles(o), TITRER)).toBe(true)
    },
  )

  it.fails(
    'E-06 — sécurité ET efficacité doivent être CUMULABLES (défaut recette capture 9, jamais corrigé). ' +
      'Référent (2026-07-26) : « oui, action de contrôle glycémique en fonction des autres critères : soit ' +
      'un traitement non insulinique, soit ajouter un bolus. » Aujourd\'hui, en situation « basale seule », ' +
      'une hypoglycémie nocturne exclut À LA FOIS « Titrer la basale » ET « Ne pas sur-titrer… » (leurs deux ' +
      'jeux d\'`exclusions` portent la même clause `profil_glycemique contient hypo_nocturne`) : seul le ' +
      'geste de sécurité « Corriger l\'hypoglycémie… » reste applicable, et l\'HbA1c (8 % vs cible 7 %) reste ' +
      'au-dessus de la cible sans AUCUNE réponse. Chantier : ouvrir, aux côtés du geste de sécurité, une ' +
      'option d\'efficacité cumulable (traitement non insulinique OU ajout d\'un bolus), symétrique à celle ' +
      'qui existe déjà en situation « basale_plus_bolus ».',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        profil_glycemique: ['hypo_nocturne'],
        HbA1c_actuelle: 8,
        HbA1c_cible: 7,
        GAJ: 1.0,
        TBR: 2,
        TBR_severe: 0,
        CV_glycemique: 20,
        dose_basale_actuelle: 20,
        poids: 75,
      } as Partial<Criteria>
      const t = titles(o)
      // Le geste de sécurité, lui, est bien proposé (non contesté par cette vignette).
      expect(has(t, CORRIGER_HYPO)).toBe(true)
      // Manquant : aucun geste d'efficacité cumulé (non insulinique ou bolus) n'accompagne la sécurité.
      expect(t.some((intitule) => /GLP-1|bolus/i.test(intitule))).toBe(true)
    },
  )
})

describe('insuline — E-04 : sur-basalisation réelle (dose 40 U / poids 70 kg), GAJ hors cible', () => {
  it('E-04a — « Titrer la basale » EXCLUE, « Ne pas sur-titrer… » proposée [DÉJÀ CORRIGÉ, arbitrage référent 2026-07-26, D21 2ᵉ série]', () => {
    const o = {
      situation_insuline: 'basale_seule',
      poids: 70,
      dose_basale_actuelle: 40, // 40/70 ≈ 0,571 U/kg > 0,5 U/kg → over_basalisation vrai
      GAJ: 1.5, // hors cible [0,70-1,20]
      HbA1c_actuelle: 8,
      HbA1c_cible: 7,
      TBR: 2,
      TBR_severe: 0,
      CV_glycemique: 20,
      profil_glycemique: ['stable'],
    } as Partial<Criteria>
    expect(has(excludedTitles(o), TITRER)).toBe(true)
    expect(has(titles(o), NE_PAS_SURTITRER)).toBe(true)
  })

  it.fails(
    'E-04b — la sur-basalisation doit « suggérer d\'autres pistes de contrôle glycémique » (référent ' +
      '2026-07-26, même décision non implémentée que E-06). Aujourd\'hui, en situation « basale seule », ' +
      'seule la carte « Ne pas sur-titrer… » est proposée : le levier GLP-1/bolus n\'y figure qu\'en PROSE ' +
      '(dans `avantages`), jamais comme option distincte et actionnable — contrairement à la situation ' +
      '« basale_plus_bolus », qui porte une vraie option « Ajouter un GLP-1 / une association fixe ».',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        poids: 70,
        dose_basale_actuelle: 40,
        GAJ: 1.5,
        HbA1c_actuelle: 8,
        HbA1c_cible: 7,
        TBR: 2,
        TBR_severe: 0,
        CV_glycemique: 20,
        profil_glycemique: ['stable'],
      } as Partial<Criteria>
      expect(has(titles(o), AJOUTER_GLP1_BB)).toBe(true)
    },
  )
})

describe('insuline — E-05 : même sur-basalisation qu\'E-04, mais poids NON renseigné (D20)', () => {
  it('« Titrer la basale » passe EN ATTENTE (« à renseigner : poids »), pas écartée à tort', () => {
    const o = {
      situation_insuline: 'basale_seule',
      dose_basale_actuelle: 40,
      GAJ: 1.5, // hors cible, renseignée
      HbA1c_actuelle: 8,
      HbA1c_cible: 7,
      TBR: 2,
      TBR_severe: 0,
      CV_glycemique: 20,
      profil_glycemique: ['stable'],
      mcg_disponible: true,
    } as Partial<Criteria>
    const res = evalProfileTernaire(o, ['poids'])
    const optTitrer = node!.options.find((opt) => opt.intitule.includes(TITRER))!

    expect(res.enAttente.has(optTitrer)).toBe(true)
    expect(res.enAttente.get(optTitrer)).toEqual(['poids'])
    // Ni écartée (excluded) à tort par une exclusion qu'on ne peut pas trancher...
    expect([...res.excluded.keys()].map((opt) => opt.intitule)).not.toContain(optTitrer.intitule)
    // ... ni recommandée en silence non plus.
    expect(res.applicable.map((opt) => opt.intitule)).not.toContain(optTitrer.intitule)
  })
})

describe('insuline — E-07/E-08 : « terrain_fragile » inclut l\'âge (arbitrage référent 2026-07-26, D20/D21 2ᵉ série)', () => {
  it('E-07 — 80 ans, HbA1c 6 % pour une cible de 7 %, basal-bolus, case « fragile » NON cochée : « Désintensifier / alléger le schéma » apparaît quand même', () => {
    const o = {
      situation_insuline: 'basal_bolus',
      age: 80,
      HbA1c_actuelle: 6,
      HbA1c_cible: 7,
      fragilite: false,
      esperance_vie: 'longue',
      risque_hypoglycemie_schema: 'faible',
      hypo_severe_recurrente: false,
    } as Partial<Criteria>
    expect(has(titles(o), DESINTENSIFIER)).toBe(true)
  })

  it('E-08 — basal-bolus, à l\'objectif, ni hypoglycémie ni variabilité : repli « Poursuivre le schéma… et réévaluer »', () => {
    const o = {
      situation_insuline: 'basal_bolus',
      age: 60,
      HbA1c_actuelle: 7,
      HbA1c_cible: 7,
      fragilite: false,
      esperance_vie: 'longue',
      risque_hypoglycemie_schema: 'faible',
      hypo_severe_recurrente: false,
      TBR: 2,
      TBR_severe: 0,
      CV_glycemique: 20,
      profil_glycemique: ['stable'],
    } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, POURSUIVRE)).toBe(true)
    expect(has(t, DESINTENSIFIER)).toBe(false)
    expect(has(t, OPTIMISER_BB)).toBe(false)
  })
})

describe('insuline — E-09 : formulaire vierge (`renseignes` vide, D20)', () => {
  it('les options qui dépendent de `situation_insuline` passent EN ATTENTE ; le repli, lui, reste actif (ses conditions sont vacuité pure)', () => {
    const res = evalProfileTernaire({}, CRITERES_NOMBRE_ENUM)
    const optNaif = node!.options.find((opt) => opt.intitule.includes(GLP1_NAIF))!
    const optTitrer = node!.options.find((opt) => opt.intitule.includes(TITRER))!
    const optDesintensifier = node!.options.find((opt) => opt.intitule.includes(DESINTENSIFIER))!
    const optAjouterBolus = node!.options.find((opt) => opt.intitule.includes(AJOUTER_BOLUS))!

    expect(res.enAttente.has(optNaif)).toBe(true)
    expect(res.enAttente.has(optTitrer)).toBe(true)
    expect(res.enAttente.has(optDesintensifier)).toBe(true)
    expect(res.enAttente.has(optAjouterBolus)).toBe(true)
    expect(has(res.applicable.map((opt) => opt.intitule), POURSUIVRE)).toBe(true)
  })
})
