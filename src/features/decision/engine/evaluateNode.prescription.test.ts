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
    expect(alertMsgs(o).some((m) => m.includes('fragile'))).toBe(true)
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

  it('D4 — gliptine + obésité + au-dessus : REMPLACER la gliptine, jamais associer (pas d’ajout GLP-1/tirzépatide)', () => {
    const o = { traitements_en_cours: ['metformine', 'gliptine'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', IMC: 31, HbA1c_actuelle: 7.5 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Remplacer la gliptine')).toBe(true)
    expect(has(t, GLP1)).toBe(false)
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

  it('PC1 — optimiser, HbA1c 6,9 % (≥ 6,5 %) sous SU : ni déprescription ni palette glycémique (à l’objectif)', () => {
    // R1 : `position_vs_cible: 'a_l_objectif'` (déclaré, plus déduit d'`optimiser`) ⇒ cible_atteinte=true ;
    // palette fermée par construction (intention ≠ intensifier/initier) ; HbA1c 6,9 ⇒ hba1c_sous_cible=false
    // (pas d'O13).
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], intention: 'optimiser',
      position_vs_cible: 'a_l_objectif', age: 60, HbA1c_actuelle: 6.9 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Désintensifier')).toBe(false)
    expect(has(t, GLP1)).toBe(false) // pas d'ajout glycémique à l'objectif sans comorbidité
    expect(has(t, ISGLT2)).toBe(false)
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

  it('M2/A9 — SU sans indication iSGLT2 + AR GLP-1 contre-indiqué (IMC bas) : alerte « switch à vide » (red-team M2)', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], IMC: 21, DFG: 80, albuminurie: 'normo',
      insuffisance_cardiaque: false, ASCVD_etablie: false, risque_hypoglycemie_schema: 'eleve',
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(alertMsgs(o).some((m) => m.includes('aucun remplaçant protecteur') || m.includes('switch à vide'))).toBe(true)
  })
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
    // Alerte de cohérence INCHANGÉE par ce recâblage (arbitrage clinique du référent, hors périmètre R1) :
    // le scénario reste volontairement incohérent (optimiser ⇒ a_l_objectif par défaut, HbA1c 9 % quand même).
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
  it('RECETTE — optimiser + à l’objectif, fragile/EV limitée, ASCVD, IMC 20 sous metformine+gliptine : cible_atteinte=true, iSGLT2 applicable, switch gliptine→GLP-1 écarté (IMC < 22)', () => {
    // Profil exact de la recette qui a motivé R1 (docs/decision/GRAMMAIRE-NOEUD.md) : avant le recâblage,
    // `cible_atteinte` était déduit de `intention == optimiser`, ce qui était vrai ici par construction du
    // test — désormais il faut le DÉCLARER (`position_vs_cible: 'a_l_objectif'`) pour obtenir le même fait.
    // Ne teste que ce qui est FACTUEL aujourd'hui (pas de nouvelle option R3 — l'option de switch gliptine
    // reste unique, non scindée « arrêter » / « remplacer »).
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
    expect(has(result.applicable.map((opt) => opt.intitule), ISGLT2)).toBe(true)

    const gliptineSwitch = [...result.excluded.entries()].find(([opt]) => opt.intitule.includes('Remplacer la gliptine'))
    expect(gliptineSwitch).toBeDefined()
    expect(gliptineSwitch?.[1]).toContain('IMC < 22')
  })
})
