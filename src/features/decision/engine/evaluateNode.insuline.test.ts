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
 * Trois décisions référent du 2026-07-26 (2ᵉ lot) ont été implémentées dans `insuline.yaml` — les 4
 * vignettes ci-dessous sont passées d'`it.fails` à `it` en conséquence (cf. `DECISIONS.md` D20/D21 pour le
 * mécanisme `enAttente`/`exclusions` déjà en place par ailleurs, et `docs/decision/validation/
 * recette-2026-07-25-prescription-intensifier.md`, captures 7-10 et 12.1-12.12, pour le constat qui les
 * avait fait remonter ; changelog `insuline.yaml` v0.7 pour le détail de l'implémentation) :
 *  - E-02 — une situation « naïf » ET une « insuline basale » cochée dans les traitements est une
 *    incohérence de SAISIE ; une alerte de nœud le DIT désormais, plutôt que de seulement s'abstenir de
 *    proposer.
 *  - E-03 — le pivot de la situation « basale seule » devient le PROFIL NOCTURNE (`profil_glycemique`)
 *    quand `mcg_disponible == true` ; la glycémie à jeun (`gaj_a_cible`) reste le pivot du repli sans MCG.
 *  - E-06 (et le second volet d'E-04) — sécurité (réduire la basale / ne pas sur-titrer) et efficacité
 *    (traitement non insulinique ou ajout d'un bolus) sont désormais CUMULABLES : les 2 options
 *    d'intensification de « basale_plus_bolus » sont réutilisées en « basale seule » sur les 2 signaux
 *    nommés par le référent (hypoglycémie/variabilité nocturne, sur-basalisation).
 *
 * 4ᵉ lot (2026-07-26) — 3 vignettes supplémentaires (blocs `F2`/`F3`/`F4` ci-dessous), correctifs issus du
 * red-team clinique « silence et omission » (`docs/decision/validation/chantier-2026-07-26/
 * redteam-clinique-silences.md`), profils EXACTS du rapport. F3 (priorité, situation « basale_plus_bolus »
 * sans AUCUN garde-fou d'hypoglycémie sur ses options d'escalade), F2 (même situation, silence total une
 * fois les 2 options d'escalade épuisées malgré une cible non atteinte), F4 (`hypo_severe_recurrente`
 * absent du choix de la molécule à l'initiation, alors qu'il pilote déjà la désintensification plus loin
 * dans le même nœud — fusionné dans `risque_hypoglycemique_eleve`, cf. changelog `insuline.yaml` v0.10).
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
 * dérivés (`cible_atteinte`, `risque_hypoglycemique_eleve`, `gaj_a_cible`, `over_basalisation`) sont recalculés par
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
  // Critère propre depuis le 2026-07-27 (arbitrage référent) : une hypo interprandiale accuse le BOLUS,
  // elle n'est donc recueillie que dans les schémas qui en comportent un. Valeur inerte ici.
  hypo_interprandiale: false,
  GAJ: 1.0,
  poids: 75,
  dose_basale_actuelle: 20,
  dose_rapide_actuelle: 5,
  cible_atteinte: true,
  risque_hypoglycemique_eleve: false,
  // Terrain justifiant une CIBLE relâchée — distinct de `risque_hypoglycemique_eleve` depuis le
  // 2026-07-27 : une hypo sévère appelle une correction du traitement, pas une cible plus permissive
  // (principe référent, déjà appliqué au nœud A).
  terrain_cible_assouplie: false,
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

describe('insuline — décisions référent 2026-07-26 implémentées (E-02/E-03/E-06, cf. changelog insuline.yaml v0.7)', () => {
  it(
    'E-02 — naïf ET « insuline basale » déjà cochée dans les traitements : incohérence de SAISIE, l\'outil le DIT. ' +
      'Référent (2026-07-26) : « si il est naïf, il ne peut pas avoir une basale dans son traitement. » ' +
      'Le prérequis 12.10 (recette 2026-07-25, déjà encodé) fait déjà taire SILENCIEUSEMENT ' +
      '« Initier une insuline basale » — correct pour l\'absence de l\'option, mais insuffisant seul : ' +
      'une nouvelle alerte de nœud signale désormais au praticien que la SAISIE elle-même est ' +
      'contradictoire — `situation_insuline == naif AND traitements_en_cours contient insuline_basale` ' +
      '(canal « alerte de nœud », D21 — le fait est vrai quel que soit le geste retenu).',
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

  it(
    'E-03 — le pivot est le PROFIL NOCTURNE (MCG), pas la glycémie à jeun. ' +
      'Référent (2026-07-26, répété 3 fois, dont recette capture 8) : « titrer sur la courbe nocturne, pas ' +
      'la GAJ ; la GAJ est le cas de repli quand il n\'y a pas de MCG, ce qui est maintenant rare. » ' +
      'Refonte implémentée : `mcg_disponible == true` → le profil nocturne (`profil_nocturne_permet_titration` / ' +
      '`profil_nocturne_a_cible`) gouverne le choix titrer / ne-pas-titrer ; repli sur la GAJ (`gaj_a_cible`) ' +
      'seulement si `mcg_disponible == false` (cf. `insuline.yaml`, changelog v0.7). ' +
      'Ici : MCG disponible, profil nocturne STABLE (aucune hypo), HbA1c au-dessus de la cible → la ' +
      'titration est admise sur ce motif nocturne, alors même que la GAJ, par ailleurs déclarée « à la ' +
      'cible », aurait routé vers « Ne pas sur-titrer » sous l\'ancien pivot — c\'est exactement le ' +
      'renversement demandé par le référent.',
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

  it(
    'E-06 — sécurité ET efficacité sont désormais CUMULABLES (défaut recette capture 9, corrigé 2026-07-26). ' +
      'Référent (2026-07-26) : « oui, action de contrôle glycémique en fonction des autres critères : soit ' +
      'un traitement non insulinique, soit ajouter un bolus. » En situation « basale seule », une ' +
      'hypoglycémie nocturne continue d\'exclure À LA FOIS « Titrer la basale » ET « Ne pas sur-titrer… » ' +
      '(leurs deux jeux d\'`exclusions` portent la même clause `profil_glycemique contient hypo_nocturne`) — ' +
      'mais le geste de sécurité « Corriger l\'hypoglycémie… » n\'est plus seul : une option d\'efficacité ' +
      'cumulable (traitement non insulinique OU ajout d\'un bolus), réutilisée telle quelle depuis la ' +
      'situation « basale_plus_bolus », répond désormais à l\'HbA1c (8 % vs cible 7 %) restée au-dessus de ' +
      'la cible.',
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
  // ATTENTE RÉVISÉE le 2026-07-27 (arbitrage référent, après collecte + red-team). Cette vignette
  // exigeait que « Titrer la basale » soit ÉCARTÉE au-dessus de 0,5 U/kg. Le seuil ne porte plus cette
  // exclusion : issu d'un post-hoc non pré-spécifié, retiré des Standards ADA en 2025 (maintenu par
  // l'AACE), jamais testé comme règle de décision, et coupant au milieu de la plage de doses d'entretien
  // réellement atteintes à la cible (0,34-0,78 U/kg). Les DEUX cartes coexistent désormais et le rang
  // hiérarchise : le praticien voit la lecture « titrer » et la lecture « intensifier autrement », et
  // arbitre — ce qu'il est le seul à pouvoir faire chez un patient dont la nuit reste hors cible (ici
  // GAJ 1,5 g/L). Le geste alternatif reste poussé, ce qui était l'objet réel du correctif de la veille.
  it('E-04a — « Titrer la basale » et « Ne pas sur-titrer… » coexistent (exclusion retirée le 2026-07-27)', () => {
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
    expect(has(titles(o), TITRER)).toBe(true)
    expect(has(excludedTitles(o), TITRER)).toBe(false)
    // Le point qui compte cliniquement n'a pas changé : l'alternative est POUSSÉE, pas laissée en prose.
    expect(has(titles(o), NE_PAS_SURTITRER)).toBe(true)
  })

  it(
    'E-04b — la sur-basalisation « suggère désormais d\'autres pistes de contrôle glycémique » (référent ' +
      '2026-07-26, même décision implémentée que E-06). En situation « basale seule », la carte ' +
      '« Ne pas sur-titrer… » continue de s\'afficher, mais elle n\'est plus seule : le levier GLP-1/bolus, ' +
      'qui ne figurait qu\'en PROSE (dans `avantages`), est désormais aussi une option distincte et ' +
      'actionnable — réutilisée depuis la situation « basale_plus_bolus », qui portait déjà « Ajouter un ' +
      'GLP-1 / une association fixe ».',
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
  // ATTENTE RÉVISÉE le 2026-07-27, en même temps qu'E-04a : `over_basalisation` n'étant plus une
  // exclusion de « Titrer la basale », un poids non renseigné ne met plus CETTE option en attente. Le
  // mécanisme D20 qu'elle démontrait reste vérifié, mais sur l'option qui dépend RÉELLEMENT du poids —
  // « Ne pas sur-titrer… », dont `over_basalisation` est le déclencheur. La vignette gagne au change :
  // elle vérifie désormais les deux bords à la fois, l'option retenue en attente ET celle qui ne doit
  // plus l'être. Le défaut qu'elle protégeait à l'origine (écarter une option sur une exclusion qu'on ne
  // peut pas trancher) reste couvert.
  it('un poids non renseigné met « Ne pas sur-titrer… » EN ATTENTE, et ne retient plus « Titrer la basale »', () => {
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
    const optNePasSurtitrer = node!.options.find((opt) => opt.intitule.includes(NE_PAS_SURTITRER))!

    // L'option qui DÉPEND du poids est retenue en attente, avec le critère à renseigner nommé —
    // ni écartée à tort sur une condition qu'on ne peut pas trancher, ni proposée en silence.
    expect(res.enAttente.get(optNePasSurtitrer)).toEqual(['poids'])
    expect(res.applicable.map((o2) => o2.intitule)).not.toContain(optNePasSurtitrer.intitule)
    expect([...res.excluded.keys()].map((o2) => o2.intitule)).not.toContain(optNePasSurtitrer.intitule)

    // L'option qui n'en dépend plus n'est plus retenue en otage par un poids manquant.
    expect(res.enAttente.has(optTitrer)).toBe(false)
    expect([...res.excluded.keys()].map((o2) => o2.intitule)).not.toContain(optTitrer.intitule)
  })
})

describe('insuline — E-07/E-08 : « risque_hypoglycemique_eleve » inclut l\'âge (arbitrage référent 2026-07-26, D20/D21 2ᵉ série)', () => {
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

describe(
  'insuline — F3 (redteam-clinique-silences.md, 2026-07-26, PRIORITÉ) : « basale_plus_bolus », ' +
    'aucun garde-fou d\'hypoglycémie sur les 2 options d\'escalade — 401/401 profils à risque du banc',
  () => {
    it(
      'profil EXACT du rapport (âge 105, TBR=1 %, TBR sévère=0 %, hypo_severe_recurrente=true, ' +
        'GLP-1/tirzépatide déjà en place) : « Ajouter un bolus » — seule sortie observée avant ce lot — ' +
        'est désormais EXCLUE (aucun signal MCG ne la bloquait, seul l\'antécédent le fait) ; ' +
        '« Ajouter un GLP-1... » restait de toute façon hors jeu (prérequis : tirzépatide déjà en cours) ; ' +
        '« Corriger l\'hypoglycémie ou la variabilité... », réutilisée pour cette situation (même lot), ' +
        'reste offerte — l\'exclusion ne se traduit jamais par un silence (R4).',
      () => {
        const o = {
          situation_insuline: 'basale_plus_bolus',
          age: 105,
          HbA1c_actuelle: 6.86,
          HbA1c_cible: 6,
          fragilite: false,
          hypo_severe_recurrente: true,
          TBR: 1,
          TBR_severe: 0,
          traitements_en_cours: ['iSGLT2', 'tirzepatide', 'sulfamide'],
        } as Partial<Criteria>
        const t = titles(o)
        const excl = excludedTitles(o)
        // Escalade bloquée : « Ajouter un bolus » écartée par exclusion (sécurité, R4 — motif tracé) ;
        // « Ajouter un GLP-1... » jamais candidate (prérequis : tirzépatide déjà en cours).
        expect(has(excl, AJOUTER_BOLUS)).toBe(true)
        expect(has(t, AJOUTER_BOLUS)).toBe(false)
        expect(has(t, AJOUTER_GLP1_BB)).toBe(false)
        // Ce qui reste offert : le geste de sécurité (réutilisé depuis « basale seule », même lot) et
        // l'optimisation des doses actuelles (réutilisée depuis « basal_bolus », finding F2 du même lot) —
        // jamais un silence pur.
        expect(has(t, CORRIGER_HYPO)).toBe(true)
        expect(has(t, OPTIMISER_BB)).toBe(true)
      },
    )
  },
)

describe(
  'insuline — F2 (redteam-clinique-silences.md, 2026-07-26) : « basale_plus_bolus », GLP-1 ET bolus ' +
    'déjà en place, cible non atteinte — 60/92 profils du banc réduits au seul repli avant ce lot',
  () => {
    it(
      'profil du rapport (« un patient déjà sous metformine + aGLP1 + insuline basale + insuline rapide, ' +
        'HbA1c 9 % pour une cible à 7 %, sans hypoglycémie ») : « Optimiser la répartition du ' +
        'basal-bolus » — réutilisée depuis la situation « basal_bolus » — comble le silence, le repli ' +
        '« Poursuivre... » ne s\'active plus.',
      () => {
        const o = {
          situation_insuline: 'basale_plus_bolus',
          traitements_en_cours: ['metformine', 'aGLP1', 'insuline_basale', 'insuline_rapide'],
          HbA1c_actuelle: 9,
          HbA1c_cible: 7,
          TBR: 2,
          TBR_severe: 0,
          CV_glycemique: 20,
          profil_glycemique: ['stable'],
          hypo_severe_recurrente: false,
          dose_basale_actuelle: 30,
          dose_rapide_actuelle: 10,
          poids: 80,
        } as Partial<Criteria>
        const t = titles(o)
        // Les 2 gestes d'ajout sont bien épuisés (prérequis : classes déjà en cours) — pas rouverts par ce lot.
        expect(has(t, AJOUTER_GLP1_BB)).toBe(false)
        expect(has(t, AJOUTER_BOLUS)).toBe(false)
        // Le silence est comblé : dose totale quotidienne = 30 + 10 = 40 U/j (calcul déjà câblé).
        expect(has(t, OPTIMISER_BB)).toBe(true)
        expect(has(t, POURSUIVRE)).toBe(false)
      },
    )
  },
)

describe(
  'insuline — F4 (redteam-clinique-silences.md, 2026-07-26) : `hypo_severe_recurrente` absent du choix ' +
    'de la molécule à l\'initiation — arbitrage I3, fusionné dans `risque_hypoglycemique_eleve`',
  () => {
    it(
      'profil EXACT du rapport (naïf, 74 ans, non fragile, EV longue, risque de schéma faible, SEUL ' +
        'signal = hypo_severe_recurrente) : « Choisir un analogue basal de 2ᵉ génération » devient ' +
        'applicable — auparavant silencieuse malgré ce signal, alors qu\'il pilotait déjà (en OR littéral) ' +
        'la désintensification du basal-bolus plus loin dans ce même nœud.',
      () => {
        const o = {
          situation_insuline: 'naif',
          age: 74,
          HbA1c_actuelle: 14.27,
          HbA1c_cible: 8.25,
          fragilite: false,
          esperance_vie: 'longue',
          risque_hypoglycemie_schema: 'faible',
          hypo_severe_recurrente: true,
          traitements_en_cours: ['aGLP1', 'sulfamide', 'gliptine'],
        } as Partial<Criteria>
        const t = titles(o)
        expect(has(t, ANALOGUE_2G)).toBe(true)
        expect(has(t, INITIER_BASALE)).toBe(true)
        // Déjà sous aGLP1 : cette option reste hors jeu (prérequis), non contestée par cette vignette.
        expect(has(t, GLP1_NAIF)).toBe(false)
      },
    )
  },
)

/**
 * ARBITRAGES RÉFÉRENT DU 2026-07-27 — trois décisions, trois vignettes. Aucune n'est visible dans le
 * golden master : les 180 profils gelés n'en contiennent pas la combinaison exacte (le générateur
 * cumule volontiers plusieurs signaux d'hypoglycémie à la fois, alors que ces vignettes testent
 * précisément le cas où UN SEUL est présent). C'est la démonstration, sur un cas réel, de ce que le
 * banc de caractérisation ne peut pas montrer — et donc de ce à quoi servent les vignettes.
 */
describe('insuline — arbitrages référent du 2026-07-27', () => {
  // `CORRIGER_HYPO` / `OPTIMISER_BB` sont déjà déclarés en tête de fichier — réutilisés tels quels.
  it(
    'A27-1 — basale SEULE, antécédent d\'hypo sévère récurrente pour SEUL signal (MCG rassurante) : ' +
      'le geste correctif est proposé (généralisation référent — le signal est une propriété du patient, ' +
      'pas du schéma)',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        hypo_severe_recurrente: true,
        // Les 4 signaux MCG sont explicitement RASSURANTS : sans la généralisation, aucun d'eux ne
        // déclenchait l'option, et ce patient restait sans réponse sous basale seule.
        mcg_disponible: true, TBR: 1, TBR_severe: 0, CV_glycemique: 20,
        profil_glycemique: ['stable'],
      } as Partial<Criteria>
      expect(has(titles(o), CORRIGER_HYPO)).toBe(true)
    },
  )

  it(
    'A27-2 — hypo INTERPRANDIALE sous basal-bolus : ouvre l\'optimisation de la répartition ' +
      '(le bolus est en cause), et ne bloque PAS la titration de la basale',
    () => {
      const o = {
        situation_insuline: 'basal_bolus',
        hypo_interprandiale: true,
        // Tout le reste est rassurant, y compris la cible : seule l'hypo interprandiale parle.
        cible_atteinte: true, mcg_disponible: true, TBR: 1, TBR_severe: 0, CV_glycemique: 20,
        profil_glycemique: ['stable'],
      } as Partial<Criteria>
      expect(has(titles(o), OPTIMISER_BB)).toBe(true)
    },
  )

  it(
    'A27-3 — hypo sévère récurrente SANS terrain gériatrique : cibles de MCG STANDARD, jamais assouplies ' +
      '(« une hypo sévère appelle une optimisation du traitement, pas un assouplissement des cibles »)',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        age: 55, fragilite: false, esperance_vie: 'longue',
        hypo_severe_recurrente: true,
        mcg_disponible: true,
      } as Partial<Criteria>
      const messages = alertMsgs(o)
      expect(messages.some((m) => m.includes('Cibles de MCG standard'))).toBe(true)
      expect(messages.some((m) => m.includes('ASSOUPLIES'))).toBe(false)
    },
  )

  it(
    'A27-4 — basale SEULE, glycémie à jeun DÉJÀ à la cible mais HbA1c au-dessus (écart post-prandial) : ' +
      'les deux gestes concrets sont proposés, pas seulement la prose qui dit « intensifier autrement »',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        GAJ: 1.0, HbA1c_actuelle: 8.5, HbA1c_cible: 7,
        // Aucun autre signal : ni hypoglycémie, ni variabilité, ni sur-basalisation. Avant l'arbitrage
        // du 2026-07-27, ce patient ne recevait QUE « Ne pas sur-titrer… — intensifier autrement », qui
        // dit d'intensifier sans nommer par quoi.
        mcg_disponible: false, TBR: 1, TBR_severe: 0, CV_glycemique: 20,
        profil_glycemique: ['stable'],
        poids: 80, dose_basale_actuelle: 20,
      } as Partial<Criteria>
      const t = titles(o)
      expect(has(t, AJOUTER_GLP1_BB)).toBe(true)
      expect(has(t, AJOUTER_BOLUS)).toBe(true)
      // La carte de cadrage reste affichée : elle dit POURQUOI on n'augmente pas la basale.
      expect(has(t, NE_PAS_SURTITRER)).toBe(true)
      // Et la titration de la basale reste bien fermée — le jeûne est à la cible.
      expect(has(t, TITRER)).toBe(false)
    },
  )

  it(
    'A27-3b — le MÊME antécédent chez un sujet âgé : cibles assouplies, cette fois à raison ' +
      '(c\'est l\'âge qui les relâche, pas l\'hypoglycémie)',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        age: 82, fragilite: false, esperance_vie: 'longue',
        hypo_severe_recurrente: true,
        mcg_disponible: true,
      } as Partial<Criteria>
      const messages = alertMsgs(o)
      expect(messages.some((m) => m.includes('ASSOUPLIES'))).toBe(true)
      expect(messages.some((m) => m.includes('Cibles de MCG standard'))).toBe(false)
    },
  )
})
