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
import { buildDefaultCriteria } from '../lib/formLayout.ts'
import { construireVueDecision } from '../lib/vueDecision.ts'
import type { Criteria } from './conditions.ts'

const node = getNoeudById('prescription')
if (!node) throw new Error('Nœud "prescription" introuvable (content/noeuds/diabete-type-2/prescription.yaml).')

/** Profil « neutre » cliniquement plausible : pas de comorbidité, DFG/IMC/âge réalistes (jamais 0). */
// PROFIL NEUTRE — PART DES VALEURS PAR DÉFAUT DU NŒUD (2026-07-27), puis les surcharge.
// AVANT : un objet écrit entièrement à la main. Ajouter un critère au contenu (ici `HbA1c_cible`, K6) le
// laissait `undefined` sur TOUS les profils, et la première dérivation qui le lisait levait une
// `ConditionError` — 76 vignettes tombées d'un coup sur un changement qui ne touchait aucune règle de
// décision. Les valeurs nommées ci-dessous continuent d'écraser exactement ce qu'elles écrasaient :
// AUCUN profil ne change, le banc devient seulement résistant à la croissance du contenu.
const BASE: Criteria = {
  ...buildDefaultCriteria(node!.criteres_entree),
  traitements_en_cours: [],
  intention: 'optimiser',
  // GATING DOSE METFORMINE (2026-07-26, 3e série, prescription.yaml) : `dose_metformine` doit exister sur
  // TOUT profil (sinon `ConditionError` dès qu'un test place le DFG dans l'une des deux bandes RCP tout en
  // gardant metformine dans `traitements_en_cours`, cf. l'option « Réduire la posologie de la metformine »).
  // 1000 est un INERTE délibéré (comme `position_vs_cible: a_l_objectif` ci-dessous) : jamais strictement
  // supérieur à aucun des deux seuils RCP (2000 en bande 45-59, 1000 en bande 30-44) — ne déclenche donc
  // JAMAIS l'option par accident sur un profil qui ne la teste pas explicitement. Les vignettes qui testent
  // spécifiquement ce gating (P-39, P-50, P-57, P-58) surchargent `dose_metformine` explicitement.
  dose_metformine: 1000,
  // R1 (GRAMMAIRE-NOEUD.md) : l'état est désormais DÉCLARÉ, plus déduit de `intention`. `a_l_objectif`
  // est la valeur inerte du profil neutre (cf. commentaire du critère dans prescription.yaml).
  position_vs_cible: 'a_l_objectif',
  hba1c_sous_cible: false,
  HbA1c_actuelle: 8,
  ASCVD_etablie: false,
  insuffisance_cardiaque: false,
  DFG: 80,
  albuminurie: 'normo',
  poids: 78.03, taille: 1.7,
  age: 60,
  fragilite: false,
  denutrition: false,
  esperance_vie: 'longue',
  risque_hypoglycemie_schema: 'faible',
  infections_uro_genitales_recidivantes: false,
  intolerance_traitement: false,
  nature_intolerance: [],
  hypoglycemie_recente: false,
  // T-192 (P14/S19, 2026-08-07) : nouveau critère commun (`{ ref: hypo_severe_recurrente }`), DISTINCT de
  // `hypoglycemie_recente` juste au-dessus (épisode daté vs antécédent récurrent, cf. prescription.yaml).
  // `false` neutre, même convention que les autres booléens de ce profil.
  hypo_severe_recurrente: false,
  symptomes_glucotoxicite: false,
  cetonemie: false,
  preference_injection: 'indifferent',
  cible_atteinte: true,
  terrain_cible_assouplie: false,
}

function evalProfile(overrides: Partial<Criteria>) {
  // Cast sûr : `overrides` (Partial) ne porte que des valeurs définies ; le spread ne fait qu'écraser
  // des clés existantes de BASE (complet, cf. sa définition).
  const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...overrides } as Criteria)
  return evaluateNode(node!, criteria)
}
// ÉTIQUETTE PRÉFIXÉE PAR L'ACTION (2026-08-04) — la simplification des intitulés (demande utilisateur :
// « le badge d'action suffit, le titre peut se limiter au nom de la molécule ») a rendu plusieurs options
// TEXTUELLEMENT IDENTIQUES bien que cliniquement distinctes (ex. « iSGLT2 » nomme désormais aussi bien
// l'introduction que la suspension). Préfixer par `action` (quand elle existe) restaure une clé de
// recherche unique SANS changer `option.intitule` lui-même ni la façon dont l'écran l'affiche — ce fichier
// est un CONSOMMATEUR de test, pas la source de vérité du libellé. Préfixe plutôt que suffixe : les
// fragments existants qui tronquaient AVANT le trait d'union insécable de « GLP‑1 » (cf. commentaire
// d'origine) restent valides sans y toucher.
// TOUJOURS VALABLE APRÈS T-171 (P14/S8, 2026-08-06) : les intitulés de `prescription.yaml` sont redevenus
// uniques (l'action figure maintenant DANS le titre, ex. « iSGLT2 — introduire »), donc ce préfixage n'est
// plus strictement nécessaire pour désambiguïser — mais il reste inoffensif : `has()`/`idx()` matchent par
// sous-chaîne, et l'ancien radical (« iSGLT2 », « AR GLP », « Tirzépatide ») est toujours un préfixe du
// nouvel intitulé complet. Gardé tel quel pour limiter le diff de cette tâche mécanique.
const etiquette = (opt: { intitule: string; action?: string }) =>
  opt.action ? `${opt.action}·${opt.intitule}` : opt.intitule
const titles = (o: Partial<Criteria>) => evalProfile(o).applicable.map(etiquette)
const excludedTitles = (o: Partial<Criteria>) => [...evalProfile(o).excluded.keys()].map(etiquette)
const alertMsgs = (o: Partial<Criteria>) => evalProfile(o).alertes.map((a) => a.message)
const has = (list: string[], sub: string) => list.some((t) => t.includes(sub))
const idx = (list: string[], sub: string) => list.findIndex((t) => t.includes(sub))

const GLP1 = 'ajouter·AR GLP' // évite le trait insécable de "GLP‑1" ; préfixe = distingue de la réduction de dose
const ISGLT2 = 'ajouter·iSGLT2' // distingue de « Suspendre l'iSGLT2 », même intitulé bare depuis 2026-08-04
const TIRZ = 'ajouter·Tirzépatide' // distingue de la réduction de dose

describe('prescription — A · terrain fragile / nutrition (gating négatif)', () => {
  it('F1 — vieillard fragile maigre (IMC 21) + ASCVD : AR GLP-1 exclu, tirzépatide absent', () => {
    const o = { age: 82, fragilite: true, poids: 60.69, taille: 1.7, ASCVD_etablie: true, risque_hypoglycemie_schema: 'eleve',
      traitements_en_cours: ['metformine', 'sulfamide'], HbA1c_actuelle: 7.8 } as Partial<Criteria>
    expect(has(titles(o), GLP1)).toBe(false)
    expect(has(excludedTitles(o), GLP1)).toBe(true)
    expect(has(titles(o), TIRZ)).toBe(false)
  })

  it('F2 — obèse (IMC 34) MAIS dénutri + ASCVD : AR GLP-1 ET tirzépatide exclus (dénutrition ≠ IMC)', () => {
    const o = { age: 78, poids: 98.26, taille: 1.7, denutrition: true, fragilite: true, ASCVD_etablie: true,
      traitements_en_cours: ['metformine'], intention: 'intensifier', position_vs_cible: 'au_dessus',
      HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), GLP1)).toBe(false)
    expect(has(titles(o), TIRZ)).toBe(false)
    expect(has(excludedTitles(o), GLP1)).toBe(true)
    expect(has(excludedTitles(o), TIRZ)).toBe(true)
  })

  it('F3 — fragile eutrophe (IMC 27) + ASCVD : AR GLP-1 proposé, DEVANT iSGLT2, + alerte fragilité', () => {
    const o = { age: 74, fragilite: true, poids: 78.03, taille: 1.7, ASCVD_etablie: true,
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
      .filter((optionVue) => etiquette(optionVue.option).includes(GLP1))
      .flatMap((optionVue) => optionVue.alertes)
    expect(alertesGlp1.some((a) => a.message.includes('fragile'))).toBe(true)
  })
})

describe('prescription — B/C · préférence (fix bug 9) & tirzépatide ⊂ obésité', () => {
  it('P1 — ASCVD pur : AR GLP-1 DEVANT iSGLT2, tirzépatide absent (IMC 26)', () => {
    const o = { ASCVD_etablie: true, poids: 75.14, taille: 1.7, traitements_en_cours: ['metformine'],
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
    const o = { insuffisance_cardiaque: true, DFG: 50, albuminurie: 'micro', poids: 80.92, taille: 1.7,
      traitements_en_cours: ['metformine'], intention: 'intensifier', position_vs_cible: 'au_dessus',
      HbA1c_actuelle: 7.8 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, ISGLT2)).toBe(true)
    expect(has(t, GLP1)).toBe(true)
    expect(idx(t, ISGLT2)).toBeLessThan(idx(t, GLP1))
    expect(has(t, TIRZ)).toBe(false)
  })

  it('T1 — ASCVD maigre (IMC 24) : tirzépatide absent, AR GLP-1 proposé', () => {
    const o = { ASCVD_etablie: true, poids: 69.36, taille: 1.7, traitements_en_cours: ['metformine'],
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), TIRZ)).toBe(false)
    expect(has(titles(o), GLP1)).toBe(true)
  })

  it('T2 — obèse (IMC 33) sans comorbidité, objectif non atteint : AR GLP-1 devant tirzépatide ; iSGLT2 aussi proposé (glycémique)', () => {
    // S8 : iSGLT2 devient proposable comme levier glycémique (cible non atteinte), en rang bas (pas d'indication
    // protectrice). GLP-1 (obésité, rang 2) reste devant tirzépatide (rang 4).
    // R1 : iSGLT2 n'a ICI aucune indication d'organe — son applicabilité dépend ENTIÈREMENT de
    // `palette_glycemique_ouverte`, donc de `position_vs_cible`.
    const o = { poids: 95.37, taille: 1.7, DFG: 90, traitements_en_cours: ['metformine'],
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
  it('D1 — SU + sur-traitement (HbA1c < 6,5 %) : ARRÊT du sulfamide à tout âge, ET remplacement désormais ouvert (T-169/T-185)', () => {
    // `hba1c_sous_cible` dérive de l'HbA1c saisie (garde-fou absolu < 6,5 %), indépendant de
    // `position_vs_cible` — `sous_objectif` ici ne fait que refléter le même sur-traitement à l'écran.
    //
    // ⚠ ATTENTE INVERSÉE en DEUX temps sur ce profil (P14/S6, 2026-08-06, décisions référent) :
    // (T-169) « remplacer » n'est plus fermé par `hba1c_sous_cible == false` — `remplacer·Sulfamide`
    // devient VRAI. (T-185) « Désintensifier » est restreinte aux insulines (cf. `prescription.yaml`,
    // changelog v0.67) : ce patient est sous sulfamide SEUL (pas d'insuline), donc Désintensifier ne se
    // déclenche PLUS pour lui — c'est désormais « Sulfamide — arrêter » qui porte, nommément, la même
    // situation (hba1c_sous_cible == true). Les trois issues (arrêter/réduire/remplacer) sont donc
    // potentiellement disponibles pour un patient en sur-contrôle, à charge du praticien de choisir.
    const o = { age: 72, traitements_en_cours: ['metformine', 'sulfamide'], intention: 'deprescrire',
      position_vs_cible: 'sous_objectif', hba1c_sous_cible: true, risque_hypoglycemie_schema: 'eleve',
      HbA1c_actuelle: 6.2 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Désintensifier')).toBe(false)
    expect(has(t, 'arreter·Sulfamide')).toBe(true)
    expect(has(t, 'remplacer·Sulfamide')).toBe(true)
  })

  it('D1b — sur-traitement chez un sujet JEUNE non fragile sous SU : arrêt du sulfamide quand même (gel D2 ; T-185, Désintensifier ne porte plus ce cas)', () => {
    const o = { age: 55, fragilite: false, traitements_en_cours: ['metformine', 'sulfamide'],
      intention: 'deprescrire', position_vs_cible: 'sous_objectif', HbA1c_actuelle: 6.0,
      risque_hypoglycemie_schema: 'eleve' } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Désintensifier')).toBe(false) // T-185 : restreinte aux insulines, ce patient n'en a pas
    expect(has(t, 'arreter·Sulfamide')).toBe(true)
  })

  it('D2 — SU + au-dessus + ASCVD : SWITCH du sulfamide, pas de désintensification, AR GLP-1 devant iSGLT2', () => {
    const o = { age: 64, traitements_en_cours: ['metformine', 'sulfamide'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', ASCVD_etablie: true, poids: 83.81, taille: 1.7, risque_hypoglycemie_schema: 'eleve',
      HbA1c_actuelle: 7.8 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'remplacer·Sulfamide')).toBe(true)
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
      position_vs_cible: 'au_dessus', poids: 89.59, taille: 1.7, HbA1c_actuelle: 7.5 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'remplacer·Gliptine')).toBe(true)
    expect(has(t, GLP1)).toBe(true)
    expect(has(t, TIRZ)).toBe(false)
  })

  it('D5 — combo gliptine + AR GLP-1 déjà en place : arrêter la gliptine redondante', () => {
    const o = { traitements_en_cours: ['metformine', 'gliptine', 'aGLP1'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 7.5 } as Partial<Criteria>
    expect(has(titles(o), 'Gliptine (redondante)')).toBe(true)
  })
})

describe('prescription — E · intolérance & F · garde-fous durs', () => {
  it('I1 — intolérance digestive sous metformine + AR GLP-1 : option + alerte « viser la metformine »', () => {
    const o = { traitements_en_cours: ['metformine', 'aGLP1'], intolerance_traitement: true,
      nature_intolerance: ['digestive'], intention: 'optimiser', ASCVD_etablie: true, poids: 80.92, taille: 1.7, HbA1c_actuelle: 7 } as Partial<Criteria>
    expect(has(titles(o), "Optimiser l'agent mal toléré")).toBe(true)
    expect(alertMsgs(o).some((m) => m.includes('METFORMINE'))).toBe(true)
  })

  it('S1 — DFG 25 : arrêter la metformine, socle exclu', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], DFG: 25,
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), 'Metformine (DFG < 30)')).toBe(true)
    expect(has(excludedTitles(o), 'ajouter·Metformine')).toBe(true)
  })

  it('S2 — DFG 18 sans comorbidité : iSGLT2 exclu (< 20), sortie non vide (pas d’écran muet)', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], DFG: 18, poids: 75.14, taille: 1.7,
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), 'Metformine (DFG < 30)')).toBe(true)
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
    const o = { traitements_en_cours: ['metformine', 'sulfamide', 'insuline_basale'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(alertMsgs(o).some((m) => m.includes('hypoglycémie cumulée'))).toBe(true)
  })

  it('R1 — refus d’injection + ASCVD : AR GLP-1 relégué (après iSGLT2 oral) + alerte refus (décision référent)', () => {
    const o = { ASCVD_etablie: true, poids: 75.14, taille: 1.7, preference_injection: 'refuse',
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
    expect(has(t, 'remplacer·Sulfamide')).toBe(true)
    expect(has(t, ISGLT2)).toBe(true) // destination du switch, pas ajout glycémique
  })

  it('PC2 — refus + obésité seule (pas d’alternative orale à bénéfice) : incrétines reléguées mais AFFICHÉES + alerte', () => {
    const o = { poids: 95.37, taille: 1.7, DFG: 90, preference_injection: 'refuse', traitements_en_cours: ['metformine'],
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, GLP1)).toBe(true) // reléguée (rang 7) mais pas supprimée : pas de cul-de-sac
    expect(has(t, TIRZ)).toBe(true)
    expect(alertMsgs(o).some((m) => m.includes('Refus des injections'))).toBe(true)
  })

  it('M1 — classes protectrices déclarées INDISPONIBLES : pas d’introduction iSGLT2/GLP-1 (red-team M1)', () => {
    // iSGLT2 ET AR GLP-1 inutilisables → ne pas les proposer ; la place résiduelle SU/gliptine prend le relais.
    // Le drapeau SAISI `classes_a_benefice_indisponibles` a été retiré du nœud le 2026-07-29 : cette
    // indisponibilité est désormais CALCULÉE. On la produit donc par ses motifs réels, un par classe —
    // `infections_uro_genitales_recidivantes` rend `isglt2_indisponible` vrai, `IMC < 22` rend
    // `aglp1_indisponible` vrai (T-133 : `poids`/`taille` reproduisent IMC 21 — 60,69 / 1,7 / 1,7 = 21).
    // Cette voie est préférée à `denutrition: true` (l'autre disjonct possible)
    // parce que la dénutrition ouvrirait aussi « Reconsidérer un agent protecteur », polluant les titres.
    const o = { traitements_en_cours: ['metformine'], DFG: 40, poids: 60.69, taille: 1.7,
      infections_uro_genitales_recidivantes: true,
      ASCVD_etablie: true, intention: 'intensifier', position_vs_cible: 'au_dessus',
      HbA1c_actuelle: 8 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, ISGLT2)).toBe(false)
    expect(has(t, GLP1)).toBe(false)
    expect(has(t, 'ajouter·Gliptine')).toBe(true) // place résiduelle (rang remonté par le flag)
  })

  // M2/A9 : test retiré le 2026-07-25 (arbitrage référent, tâche D). L'alerte « Sulfamide chez un patient
  // SANS indication d'iSGLT2… aucun remplaçant protecteur pertinent » a été supprimée du nœud — fossile du
  // modèle d'avant R3 : depuis que le remplacement (`remplacement_agent_sans_benefice`) est une voie
  // d'accès à part entière aux classes protectrices, l'affirmation « aucun remplaçant pertinent » était
  // fausse pour ce même profil (le switch vers un iSGLT2/AR GLP-1 « pur glycémique » reste possible), et
  // R4 affiche désormais les options écartées avec leur motif, ce qui couvre le cas visé par l'alerte.
})

describe('prescription — correctifs vérification adversariale S8', () => {
  it('V-H1 — patient sous AR GLP-1 : gliptine résiduelle NON proposée, ET réapparaît sans lui (renforcée, chantier vignettes 2026-07-26)', () => {
    // RENFORCÉE (drapeau ASSERTION FAIBLE, docs/decision/validation/chantier-2026-07-26/
    // vignettes-existantes-a-valider.md, P-23) : l'assertion d'origine ne vérifiait qu'une absence, sans
    // contrepartie positive — une suppression totale de l'option « Gliptine — option glycémique » du contenu
    // aurait passé le test aussi bien qu'un comportement correct. Le second bloc ci-dessous (même palette
    // ouverte — intensifier + au-dessus — mais SANS AR GLP-1 en cours) prouve que l'absence vient bien du
    // mécanisme de non-association, pas d'une disparition plus large de l'option.
    const o = { traitements_en_cours: ['metformine', 'aGLP1'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8.5 } as Partial<Criteria>
    expect(has(titles(o), 'ajouter·Gliptine')).toBe(false)
    const oSansAGLP1 = { ...o, traitements_en_cours: ['metformine'] } as Partial<Criteria>
    expect(has(titles(oSansAGLP1), 'ajouter·Gliptine')).toBe(true)
  })

  it('V-H1b — patient sous tirzépatide : gliptine résiduelle NON proposée, ET réapparaît sans lui (renforcée, chantier vignettes 2026-07-26)', () => {
    // RENFORCÉE (même raison que V-H1 ci-dessus, drapeau ASSERTION FAIBLE sur P-24).
    const o = { traitements_en_cours: ['metformine', 'tirzepatide'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8.5 } as Partial<Criteria>
    expect(has(titles(o), 'ajouter·Gliptine')).toBe(false)
    const oSansTirzepatide = { ...o, traitements_en_cours: ['metformine'] } as Partial<Criteria>
    expect(has(titles(oSansTirzepatide), 'ajouter·Gliptine')).toBe(true)
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

  it('V-hba1c-derive — HbA1c 6,0 saisie (drapeau non requis) : arrêt du SU se déclenche (T-185 : Désintensifier ne porte plus le sulfamide)', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], intention: 'deprescrire',
      position_vs_cible: 'sous_objectif', HbA1c_actuelle: 6.0,
      risque_hypoglycemie_schema: 'eleve' } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Désintensifier')).toBe(false)
    expect(has(t, 'arreter·Sulfamide')).toBe(true)
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
    expect(has(t, 'ajouter·Metformine')).toBe(true)
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
      poids: 78.03, taille: 1.7, HbA1c_actuelle: 8.5 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, ISGLT2) && has(t, GLP1)).toBe(true)
    expect(idx(t, ISGLT2)).toBeLessThan(idx(t, GLP1)) // égalité de rang → iSGLT2 (déclaré avant)
  })

  it('ORD2 — pur glycémique, IMC 23 (< 25) : iSGLT2 DEVANT l’AR GLP-1 (perte de poids peu souhaitable)', () => {
    const o = { traitements_en_cours: ['metformine'], intention: 'intensifier', position_vs_cible: 'au_dessus',
      poids: 66.47, taille: 1.7, HbA1c_actuelle: 8.5 } as Partial<Criteria>
    const t = titles(o)
    expect(idx(t, ISGLT2)).toBeLessThan(idx(t, GLP1))
  })

  it('NAT1 — réduction AR GLP-1 ciblée par la nature (digestive) et pas si nature ≠', () => {
    const base = { traitements_en_cours: ['metformine', 'aGLP1'], intention: 'optimiser',
      intolerance_traitement: true, ASCVD_etablie: true, poids: 80.92, taille: 1.7, HbA1c_actuelle: 7 } as Partial<Criteria>
    expect(has(titles({ ...base, nature_intolerance: ['digestive'] }), 'reduire·AR GLP')).toBe(true)
    expect(has(titles({ ...base, nature_intolerance: ['cutanee'] }), 'reduire·AR GLP')).toBe(false)
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
      poids: 57.8, taille: 1.7,
      age: 70,
      fragilite: true,
      esperance_vie: 'limitee',
    } as Partial<Criteria>
    const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...o } as Criteria)
    expect(criteria.cible_atteinte).toBe(true)

    const result = evaluateNode(node!, criteria)
    const applicableTitles = result.applicable.map(etiquette)
    expect(has(applicableTitles, ISGLT2)).toBe(true)
    expect(has(applicableTitles, 'remplacer·Gliptine')).toBe(true)
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
    expect(has(t, 'remplacer·Sulfamide')).toBe(true)
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
    expect(has(t, 'remplacer·Gliptine')).toBe(true)
    expect(has(t, ISGLT2) || has(t, GLP1)).toBe(true)
  })

  it('R3-3 — sulfamide + HbA1c < 6,5 % (hba1c_sous_cible) : le switch SE déclenche AUSSI désormais (T-169), et c’est « Sulfamide — arrêter » qui porte le sur-contrôle (T-185)', () => {
    // ⚠ ATTENTE INVERSÉE EN DEUX TEMPS (P14/S6, 2026-08-06, décisions référent).
    // (T-169) « remplacer » disponible aussi quand l'HbA1c est sous la cible (`hba1c_sous_cible == false`
    // retiré des `conditions`) — AVANT, ce test vérifiait que le switch NE se déclenchait PAS en
    // sur-contrôle, exactement l'écart mesuré par S6.md.
    // (T-185) « Désintensifier » est restreinte aux insulines : ce patient sous sulfamide seul (pas
    // d'insuline) ne la déclenche plus — c'est « Sulfamide — arrêter » qui porte désormais, nommément, le
    // même sur-contrôle. Les trois gestes (arrêter/réduire tous deux non testés ici/remplacer) coexistent
    // à dessein (familles non exclusives) : au praticien de choisir.
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], HbA1c_actuelle: 6.0 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'remplacer·Sulfamide')).toBe(true)
    expect(has(t, 'Désintensifier')).toBe(false)
    expect(has(t, 'arreter·Sulfamide')).toBe(true) // porte désormais le sur-contrôle (T-185)
  })

  it('R3-4 — sulfamide + hypoglycémie récente, terrain NON fragile : le switch SE déclenche (arbitrage A1, 2026-08-01), la désintensification non ; la réduction de dose l’accompagne', () => {
    // ⚠ ATTENTE INVERSÉE le 2026-08-01 (arbitrage référent A1, `prescription.yaml` 0.46). ANCIEN :
    // `Remplacer le sulfamide` attendu ABSENT — l'option portait alors la condition
    // `hypoglycemie_recente == false`, qui fermait le switch à tout patient venant de faire une
    // hypoglycémie. NOUVEAU : attendu PRÉSENT, le verrou ayant été levé.
    // Ce test documentait donc un comportement RÉEL, mais il n'en portait aucune justification
    // clinique — et l'argumentaire de l'option, lui, justifie le remplacement PAR le risque
    // hypoglycémique (CAROLINA, NNT 45 sur l'hypo sévère). C'est cette contradiction que A1 a tranchée.
    // Les deux autres assertions sont CONSERVÉES telles quelles : elles testent une autre propriété
    // (le terrain non fragile n'ouvre pas « Désintensifier »), que A1 n'a pas touchée.
    // RENFORCÉE (drapeau ASSERTION FAIBLE, docs/decision/validation/chantier-2026-07-26/
    // vignettes-existantes-a-valider.md, P-37) : l'assertion d'origine ne vérifiait QUE l'absence du
    // switch, jamais ce qui s'affiche à la place. Ce profil (terrain par défaut : 60 ans, non fragile, EV
    // longue, risque hypo faible) ne remplit ni `terrain_cible_assouplie` (`age >= 75 OR fragilite OR EV
    // limitée`) ni `risque_hypoglycemie_schema == eleve` — les deux branches issues de la scission du
    // 2026-07-27 de l'ex-`terrain_fragile`. La branche « hypoglycémie récente + terrain fragile
    // → Désintensifier » (prescription.yaml:628) NE se déclenche donc PAS non plus ici (voir R3-4-fragile
    // ci-dessous pour la contre-épreuve positive sur terrain fragile). Le patient obtient en réalité
    // l'option de réduction de dose (conditions remplies : sulfamide présent + hypoglycémie récente,
    // prescription.yaml:680-683) — jamais vérifiée avant ce renforcement.
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], hypoglycemie_recente: true } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'remplacer·Sulfamide')).toBe(true)
    expect(has(t, 'Désintensifier')).toBe(false)
    expect(has(t, 'reduire·Sulfamide')).toBe(true)
  })

  it('R3-4-fragile (P-56) — sulfamide + hypoglycémie récente, terrain FRAGILE : « Sulfamide — arrêter » porte cette situation (T-185 ; Désintensifier ne couvre plus le sulfamide)', () => {
    // NOUVELLE (chantier vignettes 2026-07-26, couverture) : complétait R3-4 ci-dessus en couvrant enfin
    // POSITIVEMENT la seconde porte de « hypoglycémie récente ET terrain fragile ») — signalée par
    // l'audit comme jamais exercée par aucune vignette du banc. RETITRÉE le 2026-08-06 (T-185) :
    // « Désintensifier » est désormais restreinte aux insulines et ne se déclenche plus pour ce patient
    // (sulfamide seul, pas d'insuline) ; « Sulfamide — arrêter » reprend exactement la même situation
    // déclenchante (transposée du premier item de conditions de l'ex-« Désintensifier »).
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], hypoglycemie_recente: true,
      fragilite: true } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Désintensifier')).toBe(false)
    expect(has(t, 'arreter·Sulfamide')).toBe(true)
  })
})

/**
 * T-169 (P14/S6, 2026-08-06) — trois écarts mesurés entre la règle du référent et le contenu, comblés :
 * (1) « réduire » (sulfamide/glinide) ne se déclenchait pas quand le patient est déjà sous les DEUX
 * classes à bénéfice dur (plus d'agent protecteur à échanger) ; (2) « remplacer » restait fermé par
 * `hba1c_sous_cible == false` ; (3) deux cartes « Sulfamide » et deux cartes « Glinide » portaient le
 * même intitulé. Vignettes VALIDÉES par la section « Validation » de `plans/P14/S6.md` (T-169).
 */
describe('prescription — T-169 (P14/S6) : réduire/remplacer ouverts, titres désambiguïsés', () => {
  it('T169-a — sulfamide, déjà sous iSGLT2 ET AR GLP-1 (plus d’agent protecteur à ajouter), sans intolérance ni hypo récente : « réduire » devient applicable', () => {
    // Cas nommé par le référent : « déjà sous iSGLT2 et AR GLP‑1 » — plus d'agent à bénéfice dur à
    // ajouter en échange du sulfamide, donc réduire la posologie est la seule conduite qui reste. Avant
    // T-169, ce profil ne déclenchait NI intolérance NI hypoglycémie NI sous-objectif : « réduire » était
    // absente (cas non couvert, cf. tableau de la décision clé de T-169).
    const o = { traitements_en_cours: ['metformine', 'iSGLT2', 'aGLP1', 'sulfamide'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8, intolerance_traitement: false,
      hypoglycemie_recente: false } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'reduire·Sulfamide')).toBe(true)
  })

  it('T169-b — glinide, HbA1c sous la cible, pas d’hypoglycémie récente : « remplacer » devient applicable (verrou `hba1c_sous_cible` levé)', () => {
    // Symétrique de R3-3 (ci-dessus, côté sulfamide) : `hba1c_sous_cible == false` a été retiré des
    // `conditions` de « Glinide — remplacer » (T-169 étape 3) ; `hypoglycemie_recente == false`, qui
    // répond à autre chose, reste en vigueur et vaut trivialement ici (non déclarée).
    const o = { traitements_en_cours: ['metformine', 'glinide'], HbA1c_actuelle: 6.0 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'remplacer·Glinide')).toBe(true)
  })

  it('T169-c — sulfamide, HbA1c au-dessus, intolérance : « remplacer » ET « réduire » coexistent, titres DISTINCTS', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8, intolerance_traitement: true,
      nature_intolerance: ['digestive'] } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'remplacer·Sulfamide')).toBe(true)
    expect(has(t, 'reduire·Sulfamide')).toBe(true)
    // Désambiguïsation (T-169 étape 1) : les deux cartes n'ont plus l'intitulé nu « Sulfamide ».
    const intitulesSulfamide = evalProfile(o).applicable.filter((opt) => opt.intitule.startsWith('Sulfamide')).map((opt) => opt.intitule)
    expect(new Set(intitulesSulfamide).size).toBe(intitulesSulfamide.length) // aucun doublon d'intitulé
    expect(intitulesSulfamide).not.toContain('Sulfamide') // plus de titre nu applicable ici
  })
})

/**
 * T-185 (P14/S6, 2026-08-06) — redécoupage de « Traitement à alléger » : une carte d'arrêt PAR
 * MÉDICAMENT (« Sulfamide — arrêter », « Glinide — arrêter »), « Désintensifier » restreinte aux
 * insulines. Vignettes VALIDÉES par la section « Validation » de `plans/P14/S6.md` (T-185).
 */
describe('prescription — T-185 (P14/S6) : une carte d’arrêt par insulinosécréteur, Désintensifier restreinte aux insulines', () => {
  it('T185-a — sulfamide, HbA1c sous la cible : les TROIS issues visibles (arrêter · réduire · remplacer), sur DEUX familles', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], HbA1c_actuelle: 6.0,
      position_vs_cible: 'sous_objectif' } as Partial<Criteria>
    const res = evalProfile(o)
    const t = res.applicable.map(etiquette)
    expect(has(t, 'arreter·Sulfamide')).toBe(true)
    expect(has(t, 'reduire·Sulfamide')).toBe(true)
    expect(has(t, 'remplacer·Sulfamide')).toBe(true)
    const familles = new Set(
      res.applicable.filter((opt) => opt.intitule.startsWith('Sulfamide')).map((opt) => opt.famille),
    )
    expect(familles).toEqual(new Set(['Traitement à alléger', 'Traitement à corriger ou remplacer']))
  })

  it('T185-b — insuline SEULE, HbA1c sous la cible : « Désintensifier » présente, AUCUNE carte sulfamide/glinide', () => {
    const o = { traitements_en_cours: ['metformine', 'insuline_basale'], HbA1c_actuelle: 6.0 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Désintensifier')).toBe(true)
    expect(t.some((titre) => titre.includes('Sulfamide'))).toBe(false)
    expect(t.some((titre) => titre.includes('Glinide'))).toBe(false)
  })

  it('T185-c — sulfamide SANS insuline, HbA1c sous la cible : « Désintensifier » ABSENTE (c’est le redécoupage), « Sulfamide — arrêter » présente', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], HbA1c_actuelle: 6.0 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Désintensifier')).toBe(false)
    expect(has(t, 'arreter·Sulfamide')).toBe(true)
  })
})

/**
 * T-192 (P14/S19, 2026-08-07) — corrige le défaut D9 (`docs/decision/validation/
 * criteres-communs-2026-08-06.md` § 3.1) : `hypo_severe_recurrente` devient un critère saisi de ce nœud
 * (`{ ref }` vers `content/decision/criteres-communs/diabete-type-2.yaml`), plus seulement une phrase de
 * l'`aide` de `risque_hypoglycemie_schema`. Canal choisi (R8, GRAMMAIRE-NOEUD.md) : un quatrième terme, EN
 * DISJONCTION INDÉPENDANTE de `hypoglycemie_recente`, sur les `conditions` de « Sulfamide — arrêter » et
 * « Glinide — arrêter » SEULEMENT — jamais « réduire la posologie » (repli `bas_rang`), jamais une alerte
 * de nœud, jamais une exclusion sur « Sulfamide — introduire » (cf. le commentaire de la carte).
 */
describe('prescription — T-192 (P14/S19) : hypo_severe_recurrente déclenche « arrêter », pas « réduire »', () => {
  it('T192-a — sulfamide en cours, hypoglycémie sévère récurrente, AUCUN autre signal (pas d’hypo récente, cible atteinte, terrain non fragile) : « Sulfamide — arrêter » se déclenche SEULE sur ce nouveau motif, « réduire » reste absente', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], hypo_severe_recurrente: true } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'arreter·Sulfamide')).toBe(true)
    expect(has(t, 'reduire·Sulfamide')).toBe(false)
  })

  it('T192-b — même antécédent, glinide en cours : « Glinide — arrêter » se déclenche aussi (même fait commun, `concerne: [sulfamide, glinide]`), « réduire » reste absente', () => {
    const o = { traitements_en_cours: ['metformine', 'glinide'], hypo_severe_recurrente: true } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'arreter·Glinide')).toBe(true)
    expect(has(t, 'reduire·Glinide')).toBe(false)
  })

  it('T192-c — contre-épreuve : même profil, sans l’antécédent (hypo_severe_recurrente: false) : « Sulfamide — arrêter » NE se déclenche PAS — isole l’effet du nouveau terme', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], hypo_severe_recurrente: false } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'arreter·Sulfamide')).toBe(false)
  })
})

/**
 * P-38 ET SUIVANTES — chantier vignettes 2026-07-26 (`docs/decision/validation/chantier-2026-07-26/
 * vignettes-existantes-a-valider.md`). Vignettes VALIDÉES par le référent (tableau du mandat), toutes de
 * CONTENU (jamais un compte) : chaque `expect` verrouille un intitulé d'option ou un fragment de message
 * d'alerte précis, jamais une simple longueur de liste.
 */
describe('prescription — P-38+ (déprescrire la metformine, garde-fou 2026-07-26, DECISIONS.md)', () => {
  it('P-38 — sous metformine+iSGLT2, ASCVD, DFG 58, au-dessus de l’objectif : AR GLP-1 en tête de « Le choix de l’agent »', () => {
    // Profil validé référent (2026-07-26) : intensification chez un patient déjà sous metformine+iSGLT2,
    // ASCVD établie, DFG 58 (bande 30-59, adaptation de dose metformine). L'iSGLT2 étant déjà en place
    // (prerequis `ne_contient_pas iSGLT2` sur sa propre option d'ajout), le seul agent à bénéfice d'organe
    // encore disponible est l'AR GLP-1 (indication ASCVD) : il doit apparaître EN TÊTE de la famille
    // « Le choix de l'agent », avant la gliptine et le sulfamide résiduels (également ouverts ici par la
    // palette glycémique, cible non atteinte).
    const o = { traitements_en_cours: ['metformine', 'iSGLT2'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8, ASCVD_etablie: true, DFG: 58 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, GLP1)).toBe(true)
    expect(idx(t, GLP1)).toBeLessThan(idx(t, 'ajouter·Gliptine'))
    expect(idx(t, GLP1)).toBeLessThan(idx(t, 'ajouter·Sulfamide'))
  })

  it('P-39 — même profil (DFG 58 sous metformine), dose de metformine NON surchargée (défaut BASE = 1000, sous tout seuil) : la réduction ne se propose pas (décision référent 2026-07-26, 3e série, IMPLÉMENTÉE)', () => {
    // DÉCISION RÉFÉRENT (2026-07-26, chantier vignettes) : « Metformine présente devrait peut-être
    // demander de renseigner la dose. » IMPLÉMENTÉ (3e série, prescription.yaml) : nouveau critère
    // `dose_metformine`, l'option « Réduire la posologie de la metformine » exige désormais que la dose
    // ACTUELLE dépasse le maximum ajusté au DFG (RCP ANSM), plus la seule fourchette de DFG seule. Ce
    // profil ne surcharge PAS `dose_metformine` (reste au défaut INERTE de BASE, 1000 — jamais > à aucun
    // des deux seuils RCP) : en mode « tout est renseigné » (2 arguments, `titles()`), la comparaison est
    // déterministe et FAUSSE, l'option est donc absente d'`applicable`. P-57 ci-dessous vérifie le second
    // volet de la spécification référent — dose VRAIMENT non renseignée (indéterminée, D20) ⇒ option EN
    // ATTENTE, pas seulement absente.
    const o = { traitements_en_cours: ['metformine', 'iSGLT2'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8, ASCVD_etablie: true, DFG: 58 } as Partial<Criteria>
    expect(has(titles(o), 'reduire·Metformine')).toBe(false)
  })

  it('P-57 — même profil, dose de metformine VRAIMENT non renseignée (indéterminée, D20) : « Réduire la posologie » EN ATTENTE (« à renseigner : dose_metformine »), jamais affirmée à l’aveugle', () => {
    // Volet D20 de la décision référent (2026-07-26, 3e série) : « tant que la dose n'est pas renseignée,
    // le critère est indéterminé, donc l'option passe en attente... C'est exactement le comportement
    // voulu. » P-39 ci-dessus démontre l'absence en mode « tout est renseigné » (repli 2 arguments) ; ce
    // test exerce le VRAI chemin d'indétermination (3e argument `renseignes`, comme P-47) : tout le
    // profil est marqué renseigné SAUF `dose_metformine`, qui reste donc INDÉTERMINÉE bien que le DFG
    // (58, bande 45-59) et `traitements_en_cours` (contient metformine) soient, eux, parfaitement connus.
    const o = { traitements_en_cours: ['metformine', 'iSGLT2'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8, ASCVD_etablie: true, DFG: 58 } as Partial<Criteria>
    const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...o } as Criteria)
    const renseignes = new Set(Object.keys(criteria))
    renseignes.delete('dose_metformine') // LA seule inconnue de ce profil.
    const res = evaluateNode(node!, criteria, renseignes)
    // `opt.intitule` directement (pas `titles()`/`etiquette()`) : RETITRÉ le 2026-08-06 (P14/S8, T-171) —
    // l'intitulé est désormais unique par construction (« Metformine — réduire la posologie », distinct du
    // socle « Metformine — instaurer ou poursuivre »). `action === 'reduire'` gardé par prudence.
    const estReduireMetformine = (opt: { intitule: string; action?: string }) =>
      opt.intitule === 'Metformine — réduire la posologie' && opt.action === 'reduire'
    const enAttenteEntry = [...res.enAttente.entries()].find(([opt]) => estReduireMetformine(opt))
    expect(enAttenteEntry).toBeDefined()
    expect(enAttenteEntry?.[1]).toEqual(['dose_metformine'])
    expect(res.applicable.some(estReduireMetformine)).toBe(false)
    expect([...res.excluded.keys()].some(estReduireMetformine)).toBe(false)
  })

  it('P-58 — dose de metformine RENSEIGNÉE mais SOUS le maximum ajusté au DFG (1000 mg/j, DFG 50, bande 45-59 → max 2000) : « Réduire la posologie » ne se déclenche pas (vignette manquante, décision référent 2026-07-26, 3e série)', () => {
    // Contre-épreuve de P-50 (ci-dessous, dose AU-DESSUS du maximum) : une dose connue et déjà SOUS le
    // maximum ne justifie aucune réduction — le geste doit rester absent, pas seulement « en attente ».
    const o = { traitements_en_cours: ['metformine', 'iSGLT2'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8, ASCVD_etablie: true, DFG: 50,
      dose_metformine: 1000 } as Partial<Criteria>
    expect(has(titles(o), 'reduire·Metformine')).toBe(false)
  })

  it('P-40 — patient DÉJÀ sous insuline : « Envisager l’insuline » absente (exerce le PRÉREQUIS, pas l’ancienne condition)', () => {
    // Profil choisi pour que l'ANCIENNE condition de l'option (iSGLT2 + aGLP1/dénutrition/IMC<22, déjà
    // en place) soit VRAIE — sinon le test ne prouverait rien sur le nouveau `prerequis` ajouté le
    // 2026-07-26 (`ne_contient_pas insuline`, prescription.yaml:519-520) : il faut que l'option soit
    // écartée PAR le prérequis, pas déjà écartée en amont par ses conditions habituelles.
    const o = { traitements_en_cours: ['metformine', 'iSGLT2', 'aGLP1', 'insuline_basale'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), "Envisager l")).toBe(false)
  })

  it('P-41 — sous-objectif + fragile + metformine seule à bénéfice faible (iSGLT2 protecteur conservé) : « Déprescrire la metformine » apparaît', () => {
    const o = { traitements_en_cours: ['metformine', 'iSGLT2'], position_vs_cible: 'sous_objectif',
      fragilite: true, HbA1c_actuelle: 6.0 } as Partial<Criteria>
    expect(has(titles(o), 'Metformine (désintensification)')).toBe(true)
  })

  it('P-42 — le même patient SANS fragilité : « Déprescrire la metformine » absente', () => {
    const o = { traitements_en_cours: ['metformine', 'iSGLT2'], position_vs_cible: 'sous_objectif',
      fragilite: false, HbA1c_actuelle: 6.0 } as Partial<Criteria>
    expect(has(titles(o), 'Metformine (désintensification)')).toBe(false)
  })

  it('P-43 — le même patient (fragile, sous-objectif) + UN SULFAMIDE en plus : metformine PAS déprescrite, c’est le sulfamide qu’on retire d’abord (T-185 : « Sulfamide — arrêter », plus « Désintensifier »)', () => {
    const o = { traitements_en_cours: ['metformine', 'iSGLT2', 'sulfamide'], position_vs_cible: 'sous_objectif',
      fragilite: true, HbA1c_actuelle: 6.0 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Metformine (désintensification)')).toBe(false)
    // RETITRÉ le 2026-08-06 (T-185) : « Désintensifier » est restreinte aux insulines et ne se déclenche
    // plus pour ce patient sous sulfamide seul (pas d'insuline) — « Sulfamide — arrêter » porte désormais
    // nommément le même retrait.
    expect(has(t, 'Désintensifier')).toBe(false)
    expect(has(t, 'arreter·Sulfamide')).toBe(true)
  })

  it('P-44 — le même patient (fragile, sous-objectif) + INSULINE en plus : metformine PAS déprescrite, c’est l’insuline qu’on allège d’abord', () => {
    const o = { traitements_en_cours: ['metformine', 'iSGLT2', 'insuline_basale'], position_vs_cible: 'sous_objectif',
      fragilite: true, HbA1c_actuelle: 6.0 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Metformine (désintensification)')).toBe(false)
    expect(has(t, 'reduire·Insuline')).toBe(true)
  })

  it('P-45 — patient PAS sous metformine, fragile, sous-objectif : la carte socle « instaurer » reste présente (garde-fou du profil #121, prescription.yaml:214-221)', () => {
    // Régression trouvée par le banc de 180 profils le jour même de l'écriture de l'option (profil #121,
    // cf. commentaire `metformine_deprescriptible` dans prescription.yaml) : sans le garde-fou
    // `traitements_en_cours contient metformine` ajouté au dérivé, un patient qui n'a JAMAIS eu de
    // metformine mais remplit par ailleurs les 3 autres conditions (fragile, sous-objectif, aucun
    // sulfamide/gliptine/glinide/insuline) voyait sa carte socle « instaurer » supprimée à tort — rien à
    // « déprescrire » chez qui n'a jamais eu la molécule.
    const o = { traitements_en_cours: ['iSGLT2', 'tirzepatide'], position_vs_cible: 'sous_objectif',
      fragilite: true, HbA1c_actuelle: 6.0, poids: 92.48, taille: 1.7 } as Partial<Criteria>
    expect(has(titles(o), 'ajouter·Metformine')).toBe(true)
  })
})

describe('prescription — P-46+ (insuline déjà en place, correctif de sécurité 2026-07-26)', () => {
  it('P-46 — cétonémie chez un patient DÉJÀ sous insuline : alerte « rupture thérapeutique », « Insuline d’initiation » absente', () => {
    // Correctif du jour (`prescription.yaml:824-832`, validé référent 2026-07-26, 2e série) : le message
    // d'urgence sur la cétonémie vivait dans les `contre_indications` de l'option « Insuline d'initiation »
    // — il disparaissait donc avec elle une fois le prérequis `ne_contient_pas insuline` ajouté (un
    // patient déjà sous insuline ne recevait alors plus AUCUN signal). Ce profil n'était couvert par
    // AUCUNE vignette avant ce chantier.
    const o = { traitements_en_cours: ['metformine', 'insuline_basale'], cetonemie: true, intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), "Insuline d'initiation")).toBe(false)
    expect(alertMsgs(o).some((m) => m.includes('RUPTURE THÉRAPEUTIQUE'))).toBe(true)
  })
})

describe('prescription — P-47 (formulaire vierge, DECISIONS.md D20 — le défaut fondateur du chantier)', () => {
  it('P-47 — formulaire vierge (aucun critère renseigné) : la metformine socle EN ATTENTE, JAMAIS écartée', () => {
    // Le défaut d'origine documenté par D20 (`DECISIONS.md`, contexte) : sur formulaire vierge,
    // `prescription` « écarte la metformine — socle du DT2 — sur un DFG < 30 jamais saisi ». Ce test
    // exerce le 3e paramètre `renseignes` d'`evaluateNode` (absent partout ailleurs dans ce fichier, où le
    // repli « tout est renseigné » s'applique) avec un ensemble VIDE — aucun critère n'est déterminé, y
    // compris `DFG` et `position_vs_cible` dont dépend l'exclusion de la carte socle. Le moteur doit
    // suspendre son verdict (`enAttente`), jamais affirmer « pas d'indication rénale » (qui l'écarterait à
    // tort de `excluded`) ni « poursuivre sans réserve » (qui la laisserait passer dans `applicable` sans
    // avoir vérifié le DFG).
    const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE } as Criteria)
    const res = evaluateNode(node!, criteria, new Set())
    const applicableTitles = res.applicable.map(etiquette)
    const excludedTitles = [...res.excluded.keys()].map(etiquette)
    const enAttenteTitles = [...res.enAttente.keys()].map(etiquette)
    expect(has(applicableTitles, 'ajouter·Metformine')).toBe(false)
    expect(has(excludedTitles, 'ajouter·Metformine')).toBe(false)
    expect(has(enAttenteTitles, 'ajouter·Metformine')).toBe(true)
  })
})

/**
 * P-48 ET SUIVANTES — Travail 3 du mandat (« combler la couverture ») : l'audit relève 11 options sur 24
 * sans aucune vignette (`vignettes-existantes-a-valider.md`, section « Couverture »). Chaque vignette
 * ci-dessous cible UNE option précédemment non couverte, avec le profil le plus simple qui la déclenche
 * légitimement — jamais un profil forcé.
 */
describe('prescription — P-48+ (couverture des options jamais exercées par une vignette)', () => {
  it('P-48 — palette non-insulinique épuisée (iSGLT2+AR GLP-1 déjà en place, objectif non atteint) : « Envisager l’insuline » apparaît', () => {
    const o = { traitements_en_cours: ['metformine', 'iSGLT2', 'aGLP1'], intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8.5 } as Partial<Criteria>
    expect(has(titles(o), "Envisager l")).toBe(true)
  })

  it('P-49 — objectif atteint, sous metformine seule, aucune indication transverse : repli « Poursuivre le traitement en cours et réévaluer » (famille « Aucun geste — surveiller », zéro vignette avant ce chantier)', () => {
    const o = { traitements_en_cours: ['metformine'], position_vs_cible: 'a_l_objectif', intention: 'optimiser',
      HbA1c_actuelle: 7 } as Partial<Criteria>
    expect(has(titles(o), 'Poursuivre le traitement en cours et réévaluer')).toBe(true)
  })

  it('P-50 — metformine seule, DFG 45 (bande 45-59, max 2000 mg/j) avec une dose AU-DESSUS du maximum, aucune autre indication : « Réduire la posologie de la metformine » apparaît', () => {
    // MODIFIÉE (2026-07-26, 3e série, gating dose) : cette option exige désormais que la dose ACTUELLE
    // dépasse le maximum ajusté au DFG (RCP ANSM) — le seul DFG 45 ne suffit plus. `dose_metformine` doit
    // donc être explicitement surchargée au-delà de 2000 (le défaut INERTE de BASE, 1000, ne la
    // déclencherait plus, cf. commentaire de `BASE`) pour que ce profil reste un cas positif.
    const o = { traitements_en_cours: ['metformine'], DFG: 45, position_vs_cible: 'a_l_objectif',
      HbA1c_actuelle: 7, dose_metformine: 3000 } as Partial<Criteria>
    expect(has(titles(o), 'reduire·Metformine')).toBe(true)
  })

  it('P-51 — sulfamide + DFG 25 (insuffisance rénale sévère) : « Arrêter le sulfamide (DFG < 30) » apparaît (symétrique de l’arrêt de la metformine, jamais vérifié avant ce chantier)', () => {
    const o = { traitements_en_cours: ['metformine', 'sulfamide'], DFG: 25, intention: 'intensifier',
      position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), 'Sulfamide (DFG < 30)')).toBe(true)
  })

  it('P-52 — indication cardio-rénale ET athéromateuse/obésité simultanées, aucune classe encore en cours : « Association iSGLT2 + AR GLP-1 » apparaît', () => {
    const o = { traitements_en_cours: ['metformine'], insuffisance_cardiaque: true, DFG: 50,
      ASCVD_etablie: true, poids: 89.59, taille: 1.7, intention: 'intensifier', position_vs_cible: 'au_dessus',
      HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), 'Association iSGLT2')).toBe(true)
  })

  it('P-53 — sous tirzépatide, perte de poids excessive déclarée (nature_intolerance) : « Réduire la posologie du tirzépatide » apparaît', () => {
    const o = { traitements_en_cours: ['metformine', 'tirzepatide'], nature_intolerance: ['perte_poids'],
      intolerance_traitement: true, intention: 'optimiser', HbA1c_actuelle: 7 } as Partial<Criteria>
    expect(has(titles(o), 'reduire·Tirzépatide')).toBe(true)
  })

  it('P-54 — iSGLT2 déjà en place SANS aucune indication d’organe, infections génito-urinaires récidivantes : « Reconsidérer un agent protecteur prescrit hors indication » apparaît', () => {
    const o = { traitements_en_cours: ['metformine', 'iSGLT2'], infections_uro_genitales_recidivantes: true,
      ASCVD_etablie: false, insuffisance_cardiaque: false, DFG: 70, albuminurie: 'normo',
      intention: 'optimiser', HbA1c_actuelle: 7 } as Partial<Criteria>
    expect(has(titles(o), 'Reconsidérer un agent protecteur')).toBe(true)
  })

  it('P-55 — classes protectrices indisponibles, sous metformine seule, objectif non atteint : « Sulfamide (gliclazide MR ou glimépiride) » (place résiduelle) apparaît', () => {
    // Indisponibilité désormais CALCULÉE (cf. M1 ci-dessus) : produite par ses deux motifs réels.
    const o = { traitements_en_cours: ['metformine'], poids: 60.69, taille: 1.7,
      infections_uro_genitales_recidivantes: true,
      intention: 'intensifier', position_vs_cible: 'au_dessus', HbA1c_actuelle: 8 } as Partial<Criteria>
    expect(has(titles(o), 'ajouter·Sulfamide')).toBe(true)
  })
})

/**
 * RT-S1 À RT-S4 — chantier 2026-07-26 (4e série), quatre défauts GRAVES trouvés par deux audits red-team
 * indépendants : `docs/decision/validation/chantier-2026-07-26/redteam-clinique-securite.md` (findings
 * HAUTE-1, HAUTE-2, HAUTE-3) et `redteam-clinique-silences.md` (finding F1). Chaque vignette reprend LE
 * PROFIL EXACT du rapport d'audit correspondant (pas une reformulation).
 */
describe('prescription — RT-S1..S4 (red-team clinique 2026-07-26, défauts GRAVES corrigés)', () => {
  it('RT-S1 — sulfamide seul + DFG 25 + intolérance digestive : seule « Arrêter » s’affiche, jamais « Réduire » (redteam-clinique-securite HAUTE-1, 44 % du sous-groupe)', () => {
    const o = { intention: 'optimiser', traitements_en_cours: ['sulfamide'], dose_metformine: 0,
      HbA1c_actuelle: 8, position_vs_cible: 'au_dessus', ASCVD_etablie: false, insuffisance_cardiaque: false,
      DFG: 25, albuminurie: 'normo', poids: 78.03, taille: 1.7, symptomes_glucotoxicite: false, cetonemie: false,
      hypoglycemie_recente: false, denutrition: false, infections_uro_genitales_recidivantes: false,
      intolerance_traitement: true, nature_intolerance: ['digestive'], age: 68, fragilite: false,
      esperance_vie: 'intermediaire', risque_hypoglycemie_schema: 'faible', preference_injection: 'indifferent' } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Sulfamide (DFG < 30)')).toBe(true)
    expect(has(t, 'reduire·Sulfamide')).toBe(false)
    expect(has(excludedTitles(o), 'reduire·Sulfamide')).toBe(true)
  })

  it('RT-S2 — metformine seule + DFG 25 + intolérance digestive : seule « Arrêter » s’affiche, jamais « Réduire » (redteam-clinique-securite HAUTE-2)', () => {
    const o = { intention: 'optimiser', traitements_en_cours: ['metformine'], dose_metformine: 500,
      HbA1c_actuelle: 7.5, position_vs_cible: 'a_l_objectif', ASCVD_etablie: false, insuffisance_cardiaque: false,
      DFG: 25, albuminurie: 'normo', poids: 72.25, taille: 1.7, symptomes_glucotoxicite: false, cetonemie: false,
      hypoglycemie_recente: false, denutrition: false, infections_uro_genitales_recidivantes: false,
      intolerance_traitement: true, nature_intolerance: ['digestive'], age: 70, fragilite: false,
      esperance_vie: 'intermediaire', risque_hypoglycemie_schema: 'faible', preference_injection: 'indifferent' } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'Metformine (DFG < 30)')).toBe(true)
    expect(has(t, 'reduire·Metformine')).toBe(false)
    expect(has(excludedTitles(o), 'reduire·Metformine')).toBe(true)
    expect(has(excludedTitles(o), 'ajouter·Metformine')).toBe(true)
  })

  it('RT-S3 — iSGLT2 en place + cétonémie confirmée : « Suspendre l’iSGLT2 » apparaît, alerte cétonémie déclenchée (redteam-clinique-securite HAUTE-3, PRIORITÉ ABSOLUE, 25 % du banc)', () => {
    const o = { intention: 'optimiser', traitements_en_cours: ['metformine', 'iSGLT2'], dose_metformine: 1500,
      HbA1c_actuelle: 7.8, position_vs_cible: 'au_dessus', ASCVD_etablie: false, insuffisance_cardiaque: false,
      DFG: 70, albuminurie: 'normo', poids: 75.14, taille: 1.7, symptomes_glucotoxicite: false, cetonemie: true,
      hypoglycemie_recente: false, denutrition: false, infections_uro_genitales_recidivantes: false,
      intolerance_traitement: false, age: 58, fragilite: false, esperance_vie: 'longue',
      risque_hypoglycemie_schema: 'faible', preference_injection: 'indifferent' } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'arreter·iSGLT2')).toBe(true)
    expect(alertMsgs(o).some((m) => m.includes('cétonémie'))).toBe(true)
  })

  it('RT-S4 — sur-traitement DÉCLARÉ (sous_objectif), insuline seule, non fragile : l’allègement de l’insuline apparaît désormais (redteam-clinique-silences F1)', () => {
    const o = { intention: 'optimiser', HbA1c_actuelle: 6.5, position_vs_cible: 'sous_objectif',
      ASCVD_etablie: true, DFG: 46, albuminurie: 'micro', poids: 66.47, taille: 1.7, fragilite: false,
      hypoglycemie_recente: false, traitements_en_cours: ['metformine', 'insuline_basale'],
      hba1c_sous_cible: false } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, 'reduire·Insuline')).toBe(true)
    expect(has(t, 'Désintensifier')).toBe(true)
  })
})

/**
 * SCISSION SULFAMIDE / GLINIDE (2026-07-26, 5e série) — vignettes de non-régression du correctif d'un
 * correctif. Le garde-fou HAUTE-1 (`exclusions: DFG < 30`) avait été posé sur une option qui portait les
 * DEUX classes, alors que leur comportement rénal est OPPOSÉ : contre-indication formelle au RCP pour le
 * sulfamide, aucune pour le répaglinide (élimination hépatobiliaire ; en insuffisance rénale sévère le
 * RCP conclut à une réduction de dose, c'est-à-dire au geste même que l'option propose). Preuve :
 * `docs/decision/validation/chantier-2026-07-26/rcp-glinide-insuffisance-renale.md`.
 *
 * Ces deux tests tiennent les DEUX bords du correctif : le geste rendu au glinide, et la
 * contre-indication maintenue pour le sulfamide. Un futur regroupement des deux options ferait
 * échouer l'un ou l'autre.
 */
describe('prescription — scission sulfamide / glinide en insuffisance rénale (RCP, 5e série)', () => {
  const REDUC_SU = 'reduire·Sulfamide'
  const REDUC_GLIN = 'reduire·Glinide'

  it('G1 — glinide SEUL à DFG 25 avec hypoglycémie : la réduction de dose est PROPOSÉE (aucune CI rénale au RCP)', () => {
    const o = { traitements_en_cours: ['glinide'], DFG: 25, hypoglycemie_recente: true,
      dose_metformine: 0 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, REDUC_GLIN)).toBe(true)
    // L'option sulfamide ne doit pas apparaître : ce patient n'en prend pas.
    expect(has(t, REDUC_SU)).toBe(false)
    // Le fait de sécurité du RCP (exposition doublée) passe par une alerte d'OPTION, pas par un retrait.
    const vue = construireVueDecision(node!, calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...o } as Criteria))
    const carte = vue.familles
      .flatMap((famille) => famille.groupes.flat())
      .find((v) => etiquette(v.option).includes(REDUC_GLIN))
    expect(carte?.alertes.some((a) => a.message.includes('exposition'))).toBe(true)
  })

  it('G2 — sulfamide SEUL à DFG 25 avec hypoglycémie : la réduction reste ÉCARTÉE (CI rénale RCP maintenue)', () => {
    const o = { traitements_en_cours: ['sulfamide'], DFG: 25, hypoglycemie_recente: true,
      dose_metformine: 0 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, REDUC_SU)).toBe(false)
    expect(has(excludedTitles(o), REDUC_SU)).toBe(true)
    // R4 : l'arrêt prend le relais — le patient n'est jamais laissé sans conduite à tenir.
    expect(has(t, 'Sulfamide (DFG < 30)')).toBe(true)
  })

  it('G3 — les DEUX molécules à DFG 25 : le glinide est allégé, le sulfamide arrêté (plus de contradiction)', () => {
    const o = { traitements_en_cours: ['sulfamide', 'glinide'], DFG: 25, hypoglycemie_recente: true,
      dose_metformine: 0 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, REDUC_GLIN)).toBe(true)
    expect(has(t, REDUC_SU)).toBe(false)
    expect(has(t, 'Sulfamide (DFG < 30)')).toBe(true)
  })
})

/**
 * Lot « seuils rénaux » du 2026-07-27 (6e série). Arbitrages référent pris après collecte de preuve
 * (`docs/decision/validation/chantier-2026-07-27/preuve-seuils-renaux-su-glinide.md`) puis red-team
 * adversarial (`redteam-seuils-renaux.md`).
 *
 * POURQUOI CES VIGNETTES EXISTENT. Le golden master (`banc/caracterisation.test.ts`) ne bouge que sur UN
 * profil pour ce lot : le plancher d'HbA1c. L'exclusion `fragilite == true` du sulfamide, elle, ne mord sur
 * AUCUN profil du banc — les deux profils fragiles qui atteignaient l'option en étaient déjà exclus par
 * `DFG < 30`, si bien que le garde-fou ajouté n'y change aucune sortie. Un garde-fou qu'aucun profil ne
 * franchit est un garde-fou non testé : ces vignettes le franchissent explicitement.
 */
describe('prescription — lot seuils rénaux du 2026-07-27 (garde-fou gériatrique, plancher d’HbA1c)', () => {
  const SULFAMIDE = 'ajouter·Sulfamide'
  const DESINTENSIFIER = 'Désintensifier : alléger'

  // Profil qui ATTEINT réellement l'option sulfamide : palette glycémique ouverte (intensifier + au-dessus
  // de l'objectif), rein normal, aucun signal catabolique. Sans quoi on testerait une exclusion sur une
  // option déjà écartée pour un autre motif — l'erreur exacte que le golden master rendait invisible.
  const PORTE_SULFAMIDE = {
    intention: 'intensifier', position_vs_cible: 'au_dessus', cible_atteinte: false,
    traitements_en_cours: ['metformine'], dose_metformine: 1000, DFG: 80, HbA1c_actuelle: 8.5,
  } as Partial<Criteria>

  it('R6-1 — sujet NON fragile, porte ouverte : le sulfamide est bien proposé (contre-épreuve)', () => {
    expect(has(titles({ ...PORTE_SULFAMIDE, fragilite: false }), SULFAMIDE)).toBe(true)
  })

  it('R6-2 — sujet FRAGILE : le sulfamide est RETIRÉ, pas seulement déconseillé (SFD 2025, note 6)', () => {
    const o = { ...PORTE_SULFAMIDE, fragilite: true }
    expect(has(titles(o), SULFAMIDE)).toBe(false)
    // R4 : le retrait doit être VISIBLE et motivé, jamais un silence.
    expect(has(excludedTitles(o), SULFAMIDE)).toBe(true)
  })

  it('R6-3 — sujet fragile : la GLIPTINE reste offerte (la SFD ne vise que sulfamide et glinide)', () => {
    // Garde-fou de non-régression : le sur-blocage assumé par le référent porte sur UNE classe. Si une
    // future passe étend l'exclusion `fragilite` à la gliptine, ce test le signale — la gliptine est
    // précisément le repli que la SFD recommande chez ce patient (« préférer la gliptine »).
    expect(has(titles({ ...PORTE_SULFAMIDE, fragilite: true }), 'ajouter·Gliptine')).toBe(true)
  })

  // ---- Plancher d'HbA1c conditionnel (SFD 2025, Avis n° 12) --------------------------------------------
  // « IRC sévère (DFG 15-29) ou terminale (< 15) : cible ≤ 8 %, avec une limite INFÉRIEURE de 7 % en cas de
  // traitement par glinide ou insuline. » Le plancher unique à 6,5 % laissait passer toute la bande
  // 6,5-7 % — c'est-à-dire exactement la zone que la SFD interdit.
  it('R6-4 — DFG 25 sous répaglinide, HbA1c 6,8 % : « Glinide — arrêter » est PROPOSÉE (plancher à 7 %) — RETITRÉ T-185, Désintensifier ne porte plus le glinide', () => {
    // AVANT T-185, ce plancher se manifestait par « Désintensifier ». Depuis la restriction de
    // « Désintensifier » aux insulines (P14/S6, 2026-08-06), c'est « Glinide — arrêter » (nouvelle carte,
    // même déclencheur transposé) qui porte ce cas — patient sous glinide seul, pas d'insuline.
    const o = { traitements_en_cours: ['glinide'], DFG: 25, HbA1c_actuelle: 6.8,
      dose_metformine: 0 } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, DESINTENSIFIER)).toBe(false)
    expect(has(t, 'arreter·Glinide')).toBe(true)
  })

  it('R6-5 — même patient à DFG 50 : plancher général de 6,5 %, rien ne se déclenche à 6,8 %', () => {
    // Contre-épreuve indispensable : sans elle, R6-4 passerait aussi si le plancher avait été relevé à 7 %
    // POUR TOUT LE MONDE — ce que la source ne dit pas.
    const o = { traitements_en_cours: ['glinide'], DFG: 50, HbA1c_actuelle: 6.8,
      dose_metformine: 0 } as Partial<Criteria>
    expect(has(titles(o), DESINTENSIFIER)).toBe(false)
  })

  it('R6-6 — DFG 25 sous METFORMINE seule, HbA1c 6,8 % : plancher général (la SFD ne vise que glinide/insuline)', () => {
    // Seconde contre-épreuve, sur l'autre moitié de la condition. Cette zone reste au plancher de 6,5 %,
    // et c'est une lecture littérale de la source signalée en `incertitudes` — pas une évidence clinique.
    const o = { traitements_en_cours: ['metformine'], DFG: 25, HbA1c_actuelle: 6.8,
      dose_metformine: 500 } as Partial<Criteria>
    expect(has(titles(o), DESINTENSIFIER)).toBe(false)
  })

  it('R6-7 — DFG 25 sous insuline, HbA1c 6,8 % : la désintensification est PROPOSÉE (2e branche du plancher)', () => {
    const o = { traitements_en_cours: ['insuline_basale'], DFG: 25, HbA1c_actuelle: 6.8,
      dose_metformine: 0 } as Partial<Criteria>
    expect(has(titles(o), DESINTENSIFIER)).toBe(true)
  })

  it('R6-8 — DFG non renseigné (0) sous glinide, HbA1c 6,8 % : le plancher rénal ne se déclenche PAS', () => {
    // Le garde `DFG > 0` du dérivé. Sans lui, `DFG < 30` serait VRAI pour tout patient dont le DFG n'est
    // pas saisi (défaut 0 des nombres) et le plancher de 7 % s'appliquerait à toute la population.
    const o = { traitements_en_cours: ['glinide'], DFG: 0, HbA1c_actuelle: 6.8,
      dose_metformine: 0 } as Partial<Criteria>
    expect(has(titles(o), DESINTENSIFIER)).toBe(false)
  })
})
