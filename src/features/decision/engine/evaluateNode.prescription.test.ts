/**
 * Banc de vignettes EXÉCUTABLE du nœud fusionné `prescription` (plan P3 · S4 — vérification adversariale).
 * Chaque test correspond à une vignette de `docs/decision/validation/vignettes-prescription.md` et vérifie,
 * sur le MOTEUR RÉEL (`evaluateNode` + `calculerCriteresDerives`), les règles gelées en S1 :
 *  - gating négatif de terrain (IMC<22/dénutrition → AR GLP-1/tirzépatide exclus ; tirzépatide ⊂ obésité) ;
 *  - fix « préférence » bug 9 (athérome pur → AR GLP-1 devant iSGLT2) ;
 *  - portes SU/gliptine/intolérance × position d'HbA1c (switch vs déprescription) ;
 *  - garde-fous durs (non-association, CI rénales, gate catabolique).
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import { calculerCriteresDerives } from './deriveCritere.ts'
import { evaluateNode } from './evaluateNode.ts'
import { construireVueDecision } from '../lib/vueDecision.ts'
import type { Criteria } from './conditions.ts'

const node = getNoeudById('prescription')
if (!node) throw new Error('Nœud "prescription" introuvable (content/noeuds/diabete-type-2/prescription.yaml).')

/** Profil « neutre » cliniquement plausible : pas de comorbidité, DFG/IMC/âge réalistes (jamais 0). */
const BASE: Criteria = {
  traitements_en_cours: [],
  intention: 'optimiser',
  // R1 (GRAMMAIRE-NOEUD.md) : l'état est désormais DÉCLARÉ, plus déduit de `intention`. `a_l_objectif`
  // est la valeur inerte du profil neutre (cf. commentaire du critère dans prescription.yaml).
  position_vs_cible: 'a_l_objectif',
  hba1c_sous_cible: false,
  HbA1c_actuelle: 8,
  ASCVD_etablie: false,
  insuffisance_cardiaque: false,
  DFG: 80,
  albuminurie: 'normo',
  IMC: 27,
  age: 60,
  fragilite: false,
  denutrition: false,
  esperance_vie: 'longue',
  risque_hypoglycemie_schema: 'faible',
  infections_uro_genitales_recidivantes: false,
  intolerance_traitement: false,
  nature_intolerance: 'aucune',
  hypoglycemie_recente: false,
  symptomes_glucotoxicite: false,
  cetonemie: false,
  preference_injection: 'indifferent',
  classes_a_benefice_indisponibles: false,
  cible_atteinte: true,
  terrain_fragile: false,
}

function evalProfile(overrides: Partial<Criteria>) {
  // Cast sûr : `overrides` (Partial) ne porte que des valeurs définies ; le spread ne fait qu'écraser
  // des clés existantes de BASE (complet). Sans cast, le spread d'un Partial est typé `… | undefined`.
  const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...overrides } as Criteria)
  return evaluateNode(node!, criteria)
}
const titles = (o: Partial<Criteria>) => evalProfile(o).applicable.map((opt) => opt.intitule)
const excludedTitles = (o: Partial<Criteria>) => [...evalProfile(o).excluded.keys()].map((opt) => opt.intitule)
const alertMsgs = (o: Partial<Criteria>) => evalProfile(o).alertes.map((a) => a.message)
const has = (list: string[], sub: string) => list.some((t) => t.includes(sub))
const idx = (list: string[], sub: string) => list.findIndex((t) => t.includes(sub))

const GLP1 = 'Introduire un AR GLP' // évite le trait insécable de "GLP‑1"
const ISGLT2 = 'Introduire un iSGLT2'
const TIRZ = 'Introduire le tirzépatide'

describe('prescription — A · terrain fragile / nutrition (gating négatif)', () => {
  it('F1 — vieillard fragile maigre (IMC 21) + ASCVD : AR GLP-1 exclu, tirzépatide absent', () => {
    const o = { age: 82, fragilite: true, IMC: 21, ASCVD_etablie: true, risque_hypoglycemie_schema: 'eleve',
      traitements_en_cours: ['metformine', 'sulfamide'], HbA1c_actuelle: 7.8 } as Partial<Criteria>
    expect(has(titles(o), GLP1)).toBe(false)
    expect(has(excludedTitles(o), GLP1)).toBe(true)
    expect(has(titles(o), TIRZ)).toBe(false)
  })

  it('F2 — obèse (IMC 34) MAIS dénutri + ASCVD : AR GLP-1 ET tirzépatide exclus (dénutrition ≠ IMC)', () => {
    const o = { age: 78, IMC: 34, denutrition: true, fragilite: true, ASCVD_etablie: true,
      traitements_en_cours: ['metformine'], intention: 'intensifier', position_vs_cible: 'au_dessus',
      HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), GLP1)).toBe(false)
    expect(has(titles(o), TIRZ)).toBe(false)
    expect(has(excludedTitles(o), GLP1)).toBe(true)
    expect(has(excludedTitles(o), TIRZ)).toBe(true)
  })

  it('F3 — fragile eutrophe (IMC 27) + ASCVD : AR GLP-1 proposé, DEVANT iSGLT2, + alerte fragilité', () => {
    const o = { age: 74, fragilite: true, IMC: 27, ASCVD_etablie: true,
      traitements_en_cours: ['metformine'], intention: 'intensifier', position_vs_cible: 'au_dessus',
      HbA1c_actuelle: 8 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, GLP1)).toBe(true)
    expect(idx(t, GLP1)).toBeLessThan(idx(t, ISGLT2))
    // ⚠ ASSERTION DÉPLACÉE, pas affaiblie (R2, 2026-07-25). L'alerte fragilité « on va introduire un
    // incrétine » a quitté les alertes de NŒUD pour devenir une alerte PORTÉE PAR L'OPTION : elle ne
    // s'affiche que si l'AR GLP‑1 est réellement applicable, et disparaît d'elle-même quand le terrain
    // l'écarte — c'est tout l'objet du découpage. Elle n'est donc plus dans `evaluateNode(...).alertes` ;
    // on la vérifie là où elle vit désormais, sur le modèle de vue. L'intention du test est intacte : ce
    // patient fragile à qui l'on propose un incrétine DOIT être averti.
    const vue = construireVueDecision(node!, calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...o } as Criteria))
    const alertesGlp1 = vue.familles
      .flatMap((famille) => famille.groupes.flat())
      .filter((optionVue) => optionVue.option.intitule.includes(GLP1))
      .flatMap((optionVue) => optionVue.alertes)
    expect(alertesGlp1.some((a) => a.message.includes('fragile'))).toBe(true)
  })
})

describe('prescription — B/C · préférence (fix bug 9) & tirzépatide ⊂ obésité', () => {
  it('P1 — ASCVD pur : AR GLP-1 DEVANT iSGLT2, tirzépatide absent (IMC 26)', () => {
    const o = { ASCVD_etablie: true, IMC: 26, traitements_en_cours: ['metformine'],
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8.2 } as Partial<Criteria>
    const t = titles(o)
    expect(idx(t, GLP1)).toBeGreaterThanOrEqual(0)
    expect(idx(t, GLP1)).toBeLessThan(idx(t, ISGLT2))
    expect(has(t, TIRZ)).toBe(false)
  })

  it('P2 — IC + rénal, non obèse, objectif non atteint : iSGLT2 DEVANT AR GLP-1 (glycémique), tirzépatide absent', () => {
    // S8 : GLP-1 devient proposable comme levier glycémique (cible non atteinte) même sans ASCVD/obésité ;
    // l'iSGLT2 (indication IC/rénal) reste DEVANT lui. Tirzépatide toujours réservé à l'obésité (IMC 28 < 30).
    // R1 : GLP-1 n'a ICI aucune autre indication (ASCVD/IMC≥30) — son applicabilité dépend ENTIÈREMENT de
    // `palette_glycemique_ouverte`, donc de `position_vs_cible` (plus de `intention` seule).
    const o = { insuffisance_cardiaque: true, DFG: 50, albuminurie: 'micro', IMC: 28,
      traitements_en_cours: ['metformine'], intention: 'intensifier', position_vs_cible: 'au_dessus',
      HbA1c_actuelle: 7.8 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, ISGLT2)).toBe(true)
    expect(has(t, GLP1)).toBe(true)
    expect(idx(t, ISGLT2)).toBeLessThan(idx(t, GLP1))
    expect(has(t, TIRZ)).toBe(false)
  })

  it('T1 — ASCVD maigre (IMC 24) : tirzépatide absent, AR GLP-1 proposé', () => {
    const o = { ASCVD_etablie: true, IMC: 24, traitements_en_cours: ['metformine'],
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), TIRZ)).toBe(false)
    expect(has(titles(o), GLP1)).toBe(true)
  })

  it('T2 — obèse (IMC 33) sans comorbidité, objectif non atteint : AR GLP-1 devant tirzépatide ; iSGLT2 aussi proposé (glycémique)', () => {
    // S8 : iSGLT2 devient proposable comme levier glycémique (cible non atteinte), en rang bas (pas d'indication
    // protectrice). GLP-1 (obésité, rang 2) reste devant tirzépatide (rang 4).
    // R1 : iSGLT2 n'a ICI aucune indication d'organe — son applicabilité dépend ENTIÈREMENT de
    // `palette_glycemique_ouverte`, donc de `position_vs_cible`.
    const o = { IMC: 33, DFG: 90, traitements_en_cours: ['metformine'],
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, GLP1)).toBe(true)
    expect(has(t, TIRZ)).toBe(true)
    expect(has(t, ISGLT2)).toBe(true)
    expect(idx(t, GLP1)).toBeLessThan(idx(t, TIRZ))
    expect(idx(t, GLP1)).toBeLessThan(idx(t, ISGLT2))
  })
})

describe('prescription — D · portes SU/gliptine × position', () => {
  it('D1 — SU + sur-traitement (HbA1c < 6,5 %) : DÉPRESCRIPTION à tout âge, pas de switch', () => {
    // `hba1c_sous_cible` dérive de l'HbA1c saisie (garde-fou absolu < 6,5 %), indépendant de
    // `position_vs_cible` — `sous_objectif` ici ne fait que refléter le même sur-traitement à l'écran.
    const o = { age: 72, traitements_en_cours: ['metformine', 'sulfamide'], intention: 'deprescrire',
      position_vs_cible: 'sous_objectif', hba1c_sous_cible: true, risque_hypoglycemie_schema: 'eleve',
      HbA1c_actuelle: 6.2 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Désintensifier')).toBe(true)
    expect(has(t, 'Remplacer le sulfamide')).toBe(false)
  })

  it('D1b — sur-traitement chez un sujet JEUNE non fragile sous SU : déprescription quand même (gel D2)', () => {
    const o = { age: 55, fragilite: false, traitements_en_cours: ['metformine', 'sulfamide'],
      intention: 'deprescrire', position_vs_cible: 'sous_objectif', HbA1c_actuelle: 6.0,
      risque_hypoglycemie_schema: 'eleve' } as Partial<Criteria>
    expect(has(titles(o), 'Désintensifier')).toBe(true)
  })

  it('D2 — SU + au-dessus + ASCVD : SWITCH du sulfamide, pas de désintensification, AR GLP-1 devant iSGLT2', () => {
    const o = { age: 64, traitements_en_cours: ['metformine', 'sulfamide'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', ASCVD_etablie: true, IMC: 29, risque_hypoglycemie_schema: 'eleve',
      HbA1c_actuelle: 7.8 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Remplacer le sulfamide')).toBe(true)
    expect(has(t, 'Désintensifier')).toBe(false)
    expect(idx(t, GLP1)).toBeLessThan(idx(t, ISGLT2))
  })

  it('D4 — gliptine + obésité + au-dessus : REMPLACER la gliptine, destination AR GLP-1 applicable (verrou levé), tirzépatide toujours écarté', () => {
    // ⚠ ATTENTE INVERSÉE par la levée du verrou gliptine (2026-07-25). Avant cette tâche, l'option
    // « Introduire un AR GLP-1 » exigeait `ne_contient_pas gliptine` : GLP1 était donc à `false` ici par
    // VERROU STRUCTUREL (même si l'IMC ≥ 30 l'indiquait par ailleurs), et seule l'ex-option atomique
    // « Remplacer la gliptine par un AR GLP-1 » portait la destination. Depuis la levée (option AR GLP-1
    // généralisée en destination de switch comme en ajout, cf. prescription.yaml), GLP1 devient
    // APPLICABLE — c'est la destination du switch de la gliptine, affichée à côté du verdict, pas une
    // association (le verdict « Remplacer la gliptine » implique l'arrêt de cette dernière, cf. alerte
    // dédiée). Le tirzépatide, lui, reste verrouillé : son option n'a PAS été touchée par cette tâche
    // (`ne_contient_pas gliptine` y est conservé), donc toujours écarté ici.
    const o = { traitements_en_cours: ['metformine', 'gliptine'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', IMC: 31, HbA1c_actuelle: 7.5 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Remplacer la gliptine')).toBe(true)
    expect(has(t, GLP1)).toBe(true)
    expect(has(t, TIRZ)).toBe(false)
  })

  it('D5 — combo gliptine + AR GLP-1 déjà en place : arrêter la gliptine redondante', () => {
    const o = { traitements_en_cours: ['metformine', 'gliptine', 'aGLP1'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 7.5 } as Partial<Criteria>
    expect(has(titles(o), 'Arrêter la gliptine redondante')).toBe(true)
  })
})

describe('prescription — E · intolérance & F · garde-fous durs', () => {
  it('I1 — intolérance digestive sous metformine + AR GLP-1 : option + alerte « viser la metformine »', () => {
    const o = { traitements_en_cours: ['metformine', 'aGLP1'], intolerance_traitement: true,
      nature_intolerance: 'digestive', intention: 'optimiser', ASCVD_etablie: true, IMC: 28, HbA1c_actuelle: 7 } as Partial<Criteria>
    expect(has(titles(o), "Optimiser l'agent mal toléré")).toBe(true)
    expect(alertMsgs(o).some((m) => m.includes('METFORMINE'))).toBe(true)
  })

  it('S1 — DFG 25 : arrêter la metformine, socle exclu', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], DFG: 25,
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), 'Arrêter la metformine')).toBe(true)
    expect(has(excludedTitles(o), 'Metformine (socle')).toBe(true)
  })

  it('S2 — DFG 18 sans comorbidité : iSGLT2 exclu (< 20), sortie non vide (pas d’écran muet)', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], DFG: 18, IMC: 26,
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), 'Arrêter la metformine')).toBe(true)
    expect(has(excludedTitles(o), ISGLT2)).toBe(true)
    expect(titles(o).length).toBeGreaterThan(0)
  })

  it('S3 — décompensation catabolique (HbA1c 11 + glucotoxicité + cétonémie) : insuline d’initiation + alerte', () => {
    const o = { traitements_en_cours: ['metformine'], HbA1c_actuelle: 11, symptomes_glucotoxicite: true,
      cetonemie: true, intention: 'intensifier', position_vs_cible: 'nettement_au_dessus' } as Partial<Criteria>
    expect(has(titles(o), "Insuline d'initiation")).toBe(true)
    expect(alertMsgs(o).some((m) => m.includes('cétonémie'))).toBe(true)
  })

  it('I2 — infections uro + iSGLT2 INDIQUÉ (IC) mais pas encore prescrit : alerte se déclenche (red-team H1)', () => {
    const o = { infections_uro_genitales_recidivantes: true, insuffisance_cardiaque: true,
      traitements_en_cours: ['metformine'], intention: 'intensifier', position_vs_cible: 'au_dessus',
      HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(alertMsgs(o).some((m) => m.includes('génito'))).toBe(true)
  })

  it('A8 — insuline + sulfamide en place : alerte hypoglycémie cumulée (red-team M1)', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide', 'insuline'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(alertMsgs(o).some((m) => m.includes('hypoglycémie cumulée'))).toBe(true)
  })

  it('R1 — refus d’injection + ASCVD : AR GLP-1 relégué (après iSGLT2 oral) + alerte refus (décision référent)', () => {
    const o = { ASCVD_etablie: true, IMC: 26, preference_injection: 'refuse',
      traitements_en_cours: ['metformine'], intention: 'intensifier', position_vs_cible: 'au_dessus',
      HbA1c_actuelle: 8 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, GLP1)).toBe(true) // reste applicable (pas d'exclusion), mais relégué
    expect(idx(t, GLP1)).toBeGreaterThan(idx(t, ISGLT2)) // iSGLT2 (oral) passe devant
    expect(alertMsgs(o).some((m) => m.includes("Refus des injections"))).toBe(true)
  })

  it('PC1 — optimiser, HbA1c 6,9 % (≥ 6,5 %) sous SU : pas de déprescription, palette fermée, mais switch ouvert', () => {
    // R1 : `position_vs_cible: 'a_l_objectif'` (déclaré, plus déduit d'`optimiser`) ⇒ cible_atteinte=true ;
    // palette fermée par construction (intention ≠ intensifier/initier) ; HbA1c 6,9 ⇒ hba1c_sous_cible=false
    // (pas d'O13).
    //
    // ⚠ ATTENTE RETOURNÉE PAR R3 (décision référent du 2026-07-25 : « le switch se déclenche dès qu'un
    // agent sans bénéfice dur est en cours, même sans maladie avérée »). Ce test exigeait auparavant
    // qu'aucun iSGLT2 / AR GLP-1 ne soit proposé ici. Ils le sont désormais — mais par une route
    // DIFFÉRENTE de celle que ce test gardait : la palette glycémique reste FERMÉE (pas d'escalade
    // glycémique à l'objectif, l'intention de PC1 est préservée), l'accès vient de
    // `remplacement_agent_sans_benefice`, qui fait du sulfamide en cours une 3ᵉ voie d'accès aux classes
    // protectrices. On assertionne donc les deux mécanismes séparément, et plus seulement leur effet
    // visible — sans quoi la distinction se perdrait au prochain changement.
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], intention: 'optimiser',
      position_vs_cible: 'a_l_objectif', age: 60, HbA1c_actuelle: 6.9 } as Partial<Criteria>
    const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...o } as Criteria)
    const t = titles(o)
    expect(criteria.palette_glycemique_ouverte).toBe(false) // aucune escalade glycémique à l'objectif
    expect(criteria.remplacement_agent_sans_benefice).toBe(true) // ...mais le SU ouvre le switch (R3)
    expect(has(t, 'Désintensifier')).toBe(false) // 6,9 % ≥ 6,5 % : pas de sur-traitement caractérisé
    expect(has(t, 'Remplacer le sulfamide')).toBe(true)
    expect(has(t, ISGLT2)).toBe(true) // destination du switch, pas ajout glycémique
  })

  it('PC2 — refus + obésité seule (pas d’alternative orale à bénéfice) : incrétines reléguées mais AFFICHÉES + alerte', () => {
    const o = { IMC: 33, DFG: 90, preference_injection: 'refuse', traitements_en_cours: ['metformine'],
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, GLP1)).toBe(true) // reléguée (rang 7) mais pas supprimée : pas de cul-de-sac
    expect(has(t, TIRZ)).toBe(true)
    expect(alertMsgs(o).some((m) => m.includes('Refus des injections'))).toBe(true)
  })

  it('M1 — classes protectrices déclarées INDISPONIBLES : pas d’introduction iSGLT2/GLP-1 (red-team M1)', () => {
    // Flag = iSGLT2 ET AR GLP-1 inutilisables → ne pas les proposer ; la place résiduelle SU/gliptine prend le relais.
    const o = { traitements_en_cours: ['metformine'], classes_a_benefice_indisponibles: true, DFG: 40,
      ASCVD_etablie: true, intention: 'intensifier', position_vs_cible: 'au_dessus',
      HbA1c_actuelle: 8 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, ISGLT2)).toBe(false)
    expect(has(t, GLP1)).toBe(false)
    expect(has(t, 'Gliptine (sitagliptine)')).toBe(true) // place résiduelle (rang remonté par le flag)
  })

  // M2/A9 : test retiré le 2026-07-25 (arbitrage référent, tâche D). L'alerte « Sulfamide chez un patient
  // SANS indication d'iSGLT2… aucun remplaçant protecteur pertinent » a été supprimée du nœud — fossile du
  // modèle d'avant R3 : depuis que le remplacement (`remplacement_agent_sans_benefice`) est une voie
  // d'accès à part entière aux classes protectrices, l'affirmation « aucun remplaçant pertinent » était
  // fausse pour ce même profil (le switch vers un iSGLT2/AR GLP-1 « pur glycémique » reste possible), et
  // R4 affiche désormais les options écartées avec leur motif, ce qui couvre le cas visé par l'alerte.
})

describe('prescription — correctifs vérification adversariale S8', () => {
  it('V-H1 — patient sous AR GLP-1 : gliptine résiduelle NON proposée (non-association préservée par la palette)', () => {
    const o = { traitements_en_cours: ['metformine', 'aGLP1'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8.5 } as Partial<Criteria>
    expect(has(titles(o), 'Gliptine (sitagliptine)')).toBe(false)
  })

  it('V-H1b — patient sous tirzépatide : gliptine résiduelle NON proposée', () => {
    const o = { traitements_en_cours: ['metformine', 'tirzepatide'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8.5 } as Partial<Criteria>
    expect(has(titles(o), 'Gliptine (sitagliptine)')).toBe(false)
  })

  it('V-M1 — état catabolique : AR GLP-1 exclu (pas seulement l’iSGLT2), insuline d’initiation en tête', () => {
    const o = { traitements_en_cours: ['metformine'], intention: 'intensifier',
      position_vs_cible: 'nettement_au_dessus', HbA1c_actuelle: 11,
      symptomes_glucotoxicite: true, cetonemie: true } as Partial<Criteria>
    expect(has(titles(o), GLP1)).toBe(false)
    expect(has(excludedTitles(o), GLP1)).toBe(true)
    expect(has(titles(o), "Insuline d'initiation")).toBe(true)
  })

  it('V-coherence — intention « optimiser » mais HbA1c 9 % : alerte de cohérence (intensification indiquée)', () => {
    // Le `quand` de cette alerte a été reciblé le 2026-07-25 (arbitrage référent, tâche E) : il portait sur
    // `intention == optimiser/deprescrire`, prémisse supprimée par R1 (« l'intention suppose l'objectif
    // atteint ») ; il porte désormais sur `position_vs_cible == a_l_objectif/sous_objectif`. Le scénario
    // ci-dessous reste volontairement incohérent (`position_vs_cible` non surchargé ⇒ `a_l_objectif`, le
    // défaut de BASE, HbA1c 9 % quand même) : même déclenchement, par le nouveau chemin.
    const o = { traitements_en_cours: ['metformine'], intention: 'optimiser', HbA1c_actuelle: 9 } as Partial<Criteria>
    expect(alertMsgs(o).some((m) => m.includes('Cohérence') && m.includes('INTENSIFICATION'))).toBe(true)
  })

  it('V-hba1c-derive — HbA1c 6,0 saisie (drapeau non requis) : déprescription du SU se déclenche', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], intention: 'deprescrire',
      position_vs_cible: 'sous_objectif', HbA1c_actuelle: 6.0,
      risque_hypoglycemie_schema: 'eleve' } as Partial<Criteria>
    expect(has(titles(o), 'Désintensifier')).toBe(true)
  })
})

describe('prescription — arbitrages référent S8 (séquençage, ordre pur-glycémique, nature intolérance)', () => {
  it('SEQ1 — naïf, HbA1c 7,2 %, sans comorbidité : monothérapie metformine (pas de palette de 2e agent)', () => {
    // R1 : à l'initiation, seul `nettement_au_dessus` ouvre la palette (remplace l'ancien seuil ABSOLU
    // HbA1c ≥ 8,5 %) ; `au_dessus` représente ici l'élévation modérée (7,2 %) qui ne l'ouvre pas.
    const o = { traitements_en_cours: [], intention: 'initier', position_vs_cible: 'au_dessus',
      HbA1c_actuelle: 7.2 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, ISGLT2)).toBe(false)
    expect(has(t, GLP1)).toBe(false)
    expect(has(t, 'Metformine (socle')).toBe(true)
  })

  it('SEQ2 — naïf, HbA1c 9 % : bithérapie d’emblée (palette ouverte)', () => {
    // R1 : `nettement_au_dessus` est la seule valeur qui ouvre la palette à l'initiation (relatif à
    // l'objectif du patient, plus le seuil absolu HbA1c ≥ 8,5 %).
    const o = { traitements_en_cours: [], intention: 'initier', position_vs_cible: 'nettement_au_dessus',
      HbA1c_actuelle: 9 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, ISGLT2)).toBe(true)
    expect(has(t, GLP1)).toBe(true)
  })

  it('ORD1 — pur glycémique, IMC 27 (≥ 25) : iSGLT2 et AR GLP-1 à égalité (iSGLT2 en tête par ordre)', () => {
    const o = { traitements_en_cours: ['metformine'], intention: 'intensifier', position_vs_cible: 'au_dessus',
      IMC: 27, HbA1c_actuelle: 8.5 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, ISGLT2) && has(t, GLP1)).toBe(true)
    expect(idx(t, ISGLT2)).toBeLessThan(idx(t, GLP1)) // égalité de rang → iSGLT2 (déclaré avant)
  })

  it('ORD2 — pur glycémique, IMC 23 (< 25) : iSGLT2 DEVANT l’AR GLP-1 (perte de poids peu souhaitable)', () => {
    const o = { traitements_en_cours: ['metformine'], intention: 'intensifier', position_vs_cible: 'au_dessus',
      IMC: 23, HbA1c_actuelle: 8.5 } as Partial<Criteria>
    const t = titles(o)
    expect(idx(t, ISGLT2)).toBeLessThan(idx(t, GLP1))
  })

  it('NAT1 — réduction AR GLP-1 ciblée par la nature (digestive) et pas si nature ≠', () => {
    const base = { traitements_en_cours: ['metformine', 'aGLP1'], intention: 'optimiser',
      intolerance_traitement: true, ASCVD_etablie: true, IMC: 28, HbA1c_actuelle: 7 } as Partial<Criteria>
    expect(has(titles({ ...base, nature_intolerance: 'digestive' }), "Réduire la posologie de l'AR GLP")).toBe(true)
    expect(has(titles({ ...base, nature_intolerance: 'cutanee' }), "Réduire la posologie de l'AR GLP")).toBe(false)
  })
})

describe('prescription — recette référent R1 (position_vs_cible déclaré, GRAMMAIRE-NOEUD.md)', () => {
  it('RECETTE — optimiser + à l’objectif, fragile/EV limitée, ASCVD, IMC 20 sous metformine+gliptine : cible_atteinte=true, verdict sur la gliptine ET iSGLT2 applicables (levée du verrou gliptine)', () => {
    // Profil exact de la recette qui a motivé R1 ET R3/R4 (docs/decision/GRAMMAIRE-NOEUD.md) — LE défaut
    // d'origine de toute la série : chez ce patient (IMC 20, athérome, sous gliptine), l'outil proposait
    // d'AJOUTER un iSGLT2 en CONSERVANT la gliptine, faute de verdict sur cette dernière (l'unique
    // remplaçant de l'ex-option atomique, l'AR GLP-1, étant exclu par l'IMC < 22).
    //
    // ⚠ ATTENTE INVERSÉE par la levée du verrou gliptine (2026-07-25, séquencement référent : garantie
    // structurelle conservée jusqu'à R4 — commit 3886d07 — puis levée). AVANT cette tâche, ce test
    // vérifiait que « Remplacer la gliptine par un AR GLP-1 » figurait dans `excluded` avec le motif
    // « IMC < 22 » et qu'aucun verdict sur la gliptine n'existait par ailleurs — c'était EXACTEMENT le
    // défaut à corriger, pas un comportement à figer. Depuis : (1) l'option de switch de la gliptine est
    // généralisée (remplaçant choisi parmi iSGLT2/AR GLP-1 selon la comorbidité, comme pour le sulfamide)
    // et ne porte plus les exclusions du remplaçant (IMC < 22 / dénutrition retirées, R3) ; (2)
    // `remplacement_agent_sans_benefice` couvre désormais la gliptine, pas seulement le sulfamide. Un
    // verdict sur la gliptine est donc désormais APPLICABLE ici (plus « écarté »), et l'iSGLT2 aussi —
    // les deux, ce que l'invariant 5 du banc vérifie sur tout l'espace des profils.
    const o = {
      intention: 'optimiser',
      traitements_en_cours: ['metformine', 'gliptine'],
      position_vs_cible: 'a_l_objectif',
      HbA1c_actuelle: 8,
      ASCVD_etablie: true,
      DFG: 70,
      albuminurie: 'normo',
      IMC: 20,
      age: 70,
      fragilite: true,
      esperance_vie: 'limitee',
    } as Partial<Criteria>
    const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...o } as Criteria)
    expect(criteria.cible_atteinte).toBe(true)

    const result = evaluateNode(node!, criteria)
    const applicableTitles = result.applicable.map((opt) => opt.intitule)
    expect(has(applicableTitles, ISGLT2)).toBe(true)
    expect(has(applicableTitles, 'Remplacer la gliptine')).toBe(true)
  })
})

describe('prescription — R3 (remplacement_agent_sans_benefice, GRAMMAIRE-NOEUD.md § « modifier un traitement existant »)', () => {
  it('R3-1 — sulfamide seul, sans comorbidité, à l’objectif : le switch se déclenche (seule présence de l’agent) et une destination protectrice devient applicable', () => {
    // R3 : chemin NOUVELLEMENT ouvert par cette tâche. Même profil que PC1 (ci-dessus, describe « E ·
    // intolérance & F · garde-fous durs ») dont le résultat ATTENDU était l'inverse (ni switch, ni ajout) —
    // PC1 est laissé rouge à dessein (cf. rapport de tâche) : R3 fait du sulfamide en cours une TROISIÈME
    // voie d'accès aux classes protectrices, indépendante de toute comorbidité.
    const o = { traitements_en_cours: ['metformine', 'sulfamide'] } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Remplacer le sulfamide')).toBe(true)
    expect(has(t, ISGLT2) || has(t, GLP1)).toBe(true)
  })

  it('R3-2 — gliptine seule, sans comorbidité, à l’objectif : le switch se déclenche ET une destination protectrice devient applicable (verrou levé)', () => {
    // ⚠ ATTENTE INVERSÉE par la levée du verrou gliptine (2026-07-25, séquencement référent : cf. tâche de
    // levée du verrou). Ce test vérifiait auparavant que la gliptine était volontairement EXCLUE du
    // dérivé `remplacement_agent_sans_benefice` (« sulfamide seulement », en attendant que
    // `ne_contient_pas gliptine` soit retiré de l'option AR GLP-1 après R4) — d'où iSGLT2 NON proposé. R4
    // est livré (commit 3886d07) et le verrou levé : la gliptine rejoint le sulfamide dans le dérivé, et
    // ce profil (sans aucune comorbidité) suit désormais EXACTEMENT le même chemin que R3-1 (sulfamide) :
    // le switch se déclenche sur la seule présence de l'agent, et au moins une destination protectrice
    // (iSGLT2 et/ou AR GLP-1, aucun terrain ne les excluant ici) devient applicable.
    const o = { traitements_en_cours: ['metformine', 'gliptine'] } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Remplacer la gliptine')).toBe(true)
    expect(has(t, ISGLT2) || has(t, GLP1)).toBe(true)
  })

  it('R3-3 — sulfamide + HbA1c < 6,5 % (hba1c_sous_cible) : le switch NE se déclenche PAS (sur-contrôle → déprescription, pas de remplacement)', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], HbA1c_actuelle: 6.0 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Remplacer le sulfamide')).toBe(false)
    expect(has(t, 'Désintensifier')).toBe(true) // le sur-contrôle reste géré par la désintensification
  })

  it('R3-4 — sulfamide + hypoglycémie récente : le switch NE se déclenche PAS non plus', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], hypoglycemie_recente: true } as Partial<Criteria>
    expect(has(titles(o), 'Remplacer le sulfamide')).toBe(false)
  })
})
