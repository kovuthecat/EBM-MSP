/**
 * Tests du sélecteur sur le nœud **réel** `content/noeuds/diabete-type-2/premiere-intention.yaml`
 * dans sa version **migrée P2 (v1.1)** : nœud `multi-options` avec `priorite` conditionnelle (D14)
 * et `exclusions` dures (D13). Trace des profils patients représentatifs à travers le moteur réel —
 * c'est la trace d'encodage exigée par la pipeline (docs/decision/00-global.md, étape 8).
 *
 * Fidélité au dossier `docs/decision/noeuds/B-premiere-intention.md` : priorité par critère dominant
 * (IC/rein → iSGLT2 ; athérome/obésité → AR GLP-1), gate insuline en hyperglycémie catabolique,
 * CI dures glucotoxicité + DFG < 20 (iSGLT2/association).
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import type { Criteria } from './conditions.ts'
import { evaluateNode } from './evaluateNode.ts'

const node = getNoeudById('premiere-intention')
if (node === undefined) {
  throw new Error('Nœud "premiere-intention" introuvable — prérequis de ces tests.')
}

const INSULINE = "Insuline d'initiation (souvent transitoire)"
const ISGLT2 = "Ajout d'un iSGLT2"
const GLP1 = "Ajout d'un AR GLP-1 (liraglutide, sémaglutide, dulaglutide)"
const TIRZEPATIDE = "Ajout d'un AR GIP/GLP-1 (tirzépatide)"
const ASSOCIATION = 'Association iSGLT2 + AR GLP-1'
const METFORMINE = 'Metformine seule (socle) — poursuivre'

/** Profil complet (le moteur lève sur toute variable manquante) — défaut = « socle metformine seul ». */
function criteria(overrides: Partial<Criteria> = {}): Criteria {
  return {
    ASCVD_etablie: false,
    insuffisance_cardiaque: false,
    DFG: 90,
    albuminurie: 'normo',
    IMC: 25,
    age: 60,
    HbA1c_actuelle: 8,
    symptomes_glucotoxicite: false,
    cetonemie: false,
    preference_injection: 'indifferent',
    contrainte_cout: false,
    ...overrides,
  }
}

function applicables(c: Criteria): string[] {
  return evaluateNode(node!, c).applicable.map((o) => o.intitule)
}
function exclues(c: Criteria): string[] {
  return [...evaluateNode(node!, c).excluded.keys()].map((o) => o.intitule)
}
function messagesAlertes(c: Criteria): string[] {
  return evaluateNode(node!, c).alertes.map((a) => a.message)
}

describe('evaluateNode — "premiere-intention" (migré P2 v1.1 · multi-options)', () => {
  it('IC + athérome (DFG normal) → iSGLT2 en tête, puis GLP-1, tirzépatide, association', () => {
    const c = criteria({ insuffisance_cardiaque: true, ASCVD_etablie: true, DFG: 80 })
    expect(applicables(c)).toEqual([ISGLT2, GLP1, TIRZEPATIDE, ASSOCIATION])
    expect(exclues(c)).toHaveLength(0)
  })

  it('ASCVD sans IC ni rein → AR GLP-1, puis iSGLT2 (bénéfice CV dur prouvé), puis tirzépatide', () => {
    const c = criteria({ ASCVD_etablie: true })
    expect(applicables(c)).toEqual([GLP1, ISGLT2, TIRZEPATIDE])
  })

  it('obésité seule (IMC ≥ 30, sans ASCVD ni IC/rein) → AR GLP-1 puis tirzépatide ; iSGLT2 absent', () => {
    const c = criteria({ IMC: 32 })
    expect(applicables(c)).toEqual([GLP1, TIRZEPATIDE])
  })

  it('ASCVD + obésité (sans IC/rein) → l’ASCVD fait passer iSGLT2 devant le tirzépatide', () => {
    const c = criteria({ ASCVD_etablie: true, IMC: 32 })
    expect(applicables(c)).toEqual([GLP1, ISGLT2, TIRZEPATIDE])
  })

  it('aucune comorbidité → metformine socle seule (option par défaut)', () => {
    expect(applicables(criteria())).toEqual([METFORMINE])
  })

  it('hyperglycémie catabolique (HbA1c 11 + glucotoxicité) → insuline en tête ; iSGLT2 EXCLU (acidocétose)', () => {
    const c = criteria({ HbA1c_actuelle: 11, symptomes_glucotoxicite: true, ASCVD_etablie: true, IMC: 32 })
    expect(applicables(c)).toEqual([INSULINE, GLP1, TIRZEPATIDE])
    expect(exclues(c)).toContain(ISGLT2)
  })

  it('DFG < 20 avec macroalbuminurie + athérome → iSGLT2 ET association EXCLUS (KDIGO) ; GLP-1/tirzépatide restent', () => {
    const c = criteria({ DFG: 18, albuminurie: 'macro', ASCVD_etablie: true })
    expect(applicables(c)).toEqual([GLP1, TIRZEPATIDE])
    expect(exclues(c)).toEqual(expect.arrayContaining([ISGLT2, ASSOCIATION]))
  })

  it('la raison d’une exclusion est tracée (jamais un retrait silencieux)', () => {
    const c = criteria({ HbA1c_actuelle: 11, symptomes_glucotoxicite: true, ASCVD_etablie: true })
    const result = evaluateNode(node!, c)
    const isglt2 = [...result.excluded.keys()].find((o) => o.intitule === ISGLT2)
    expect(isglt2).toBeDefined()
    expect(result.excluded.get(isglt2!)).toContain('symptomes_glucotoxicite == true')
  })

  it('cétonémie positive avec HbA1c < 10 → insuline déclenchée ; iSGLT2 exclu (résout la « metformine orpheline »)', () => {
    const c = criteria({ HbA1c_actuelle: 9, cetonemie: true, insuffisance_cardiaque: true })
    expect(applicables(c)).toEqual([INSULINE])
    expect(exclues(c)).toContain(ISGLT2)
  })

  it('DFG < 20 sans athérome ni obésité → metformine ET iSGLT2 exclus (sortie vide honnête, tracée)', () => {
    const c = criteria({ DFG: 18, albuminurie: 'macro' })
    expect(applicables(c)).toEqual([])
    expect(exclues(c)).toEqual(expect.arrayContaining([METFORMINE, ISGLT2]))
  })

  it('DFG 20–29 (metformine CI mais iSGLT2 initiable ≥ 20, KDIGO) → iSGLT2 proposé, PAS de sortie vide', () => {
    // Garde-fou anti-régression : ne PAS "corriger" le seuil à DFG < 30 — cela retirerait l'iSGLT2 en IRC 3b–4.
    expect(applicables(criteria({ DFG: 25 }))).toEqual([ISGLT2])
  })
})

describe('evaluateNode — "premiere-intention" : alertes cliniques (D15)', () => {
  it('HbA1c élevée → alerte de contrôle de la cétonémie', () => {
    expect(messagesAlertes(criteria({ HbA1c_actuelle: 11 })).some((m) => /cétonémie/i.test(m))).toBe(true)
  })

  it('signes de glucotoxicité → alerte de contrôle de la cétonémie', () => {
    expect(messagesAlertes(criteria({ symptomes_glucotoxicite: true })).some((m) => /cétonémie/i.test(m))).toBe(
      true,
    )
  })

  it('DFG 45–59 → alerte dose max metformine 2 000 mg/j (pas 1 000)', () => {
    const m = messagesAlertes(criteria({ DFG: 50 }))
    expect(m.some((x) => /2\s*000\s*mg/.test(x))).toBe(true)
    expect(m.some((x) => /1\s*000\s*mg/.test(x))).toBe(false)
  })

  it('DFG 30–44 → alerte dose max metformine 1 000 mg/j', () => {
    expect(messagesAlertes(criteria({ DFG: 40 })).some((x) => /1\s*000\s*mg/.test(x))).toBe(true)
  })

  it('DFG < 30 → alerte d’arrêt de la metformine (CI, toujours visible même quand iSGLT2 est proposé)', () => {
    expect(messagesAlertes(criteria({ DFG: 25 })).some((x) => /arrêter la metformine/i.test(x))).toBe(true)
  })

  it('DFG normal et HbA1c basse → aucune alerte', () => {
    expect(messagesAlertes(criteria())).toEqual([])
  })
})
