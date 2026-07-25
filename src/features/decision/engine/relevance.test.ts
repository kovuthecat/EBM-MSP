/**
 * Tests du moteur de pertinence (P3 · S7‑ui Lot 1). Vérifie, sur le nœud réel `prescription`, que la
 * perturbation identifie bien les critères DÉCISIFS et écarte les critères INERTES pour un patient donné.
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import { buildDefaultCriteria } from '../lib/formLayout.ts'
import type { Criteria } from './conditions.ts'
import { calculerCriteresDerives } from './deriveCritere.ts'
import { evaluateNode } from './evaluateNode.ts'
import { champsDecisifsManquants, criteresPertinents } from './relevance.ts'

const node = getNoeudById('prescription')
if (!node) throw new Error('Nœud "prescription" introuvable.')

// Patient sous metformine, au-dessus de la cible, sans comorbidité — la reco dépend fortement du terrain.
const PROFIL: Criteria = {
  traitements_en_cours: ['metformine'],
  intention: 'optimiser',
  hba1c_sous_cible: false,
  HbA1c_actuelle: 8,
  ASCVD_etablie: true,
  insuffisance_cardiaque: false,
  DFG: 80,
  albuminurie: 'normo',
  IMC: 26,
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
  cible_atteinte: false,
  terrain_fragile: false,
}

describe('relevance — criteresPertinents', () => {
  const pertinents = criteresPertinents(node!, PROFIL)

  it('inclut les critères décisifs (comorbidités, terrain, traitements)', () => {
    expect(pertinents.has('ASCVD_etablie')).toBe(true) // active AR GLP-1 / iSGLT2
    expect(pertinents.has('IMC')).toBe(true) // ≥ 30 active AR GLP-1 / tirzépatide ; < 22 exclut
    expect(pertinents.has('DFG')).toBe(true) // < 60/30/20 bascule iSGLT2 / metformine
    expect(pertinents.has('traitements_en_cours')).toBe(true) // pilote tout
  })

  it('exclut un critère inerte pour ce patient (esperance_vie : ne pilote que terrain_fragile, non consommé ici)', () => {
    // Profil optimiser + ASCVD, metformine seule, non fragile : `esperance_vie` ne pilote que `terrain_fragile`,
    // que rien ne consomme (pas de SU/glinide/insuline pour O13, pas fragile pour l'alerte) → inerte.
    expect(pertinents.has('esperance_vie')).toBe(false)
  })

  it("n'inclut jamais un critère dérivé (non saisissable)", () => {
    expect(pertinents.has('cible_atteinte')).toBe(false)
    expect(pertinents.has('terrain_fragile')).toBe(false)
    expect(pertinents.has('hba1c_sous_cible')).toBe(false) // dérivé de HbA1c_actuelle (S8)
  })
})

describe('relevance — égalité de rang par défaut ne doit pas masquer un critère décisif (recette référent, S7-ui)', () => {
  // Profil de la recette : rien ne distingue iSGLT2 d'AR GLP‑1 par comorbidité (albuminurie normo, DFG ≥
  // 60, ASCVD absent, IMC < 30) → les deux tombent sur leur rang « default » (2 = égalité), départagés
  // par l'ordre du contenu (iSGLT2 déclaré avant AR GLP‑1) — PAS par une vraie préférence clinique. Cocher
  // `insuffisance_cardiaque` fait passer AR GLP‑1 à un rang moins bon (3) sans jamais dépasser le rang
  // d'iSGLT2 (qui reste 2) : l'ORDRE affiché ne change donc jamais, même si le calcul interne, si. Avant
  // le correctif (`evaluateNode.ts` expose `rangs`, `relevance.ts` les inclut dans la signature),
  // `criteresPertinents` ne regardait que l'ordre des intitulés et estompait `insuffisance_cardiaque` à
  // tort (« sans effet »), alors qu'il pilote bien un rang réel — juste invisible par coïncidence de tri.
  const PROFIL_RECETTE: Criteria = {
    ...buildDefaultCriteria(node!.criteres_entree),
    intention: 'initier',
    HbA1c_actuelle: 8.6,
    DFG: 74,
    IMC: 25,
    albuminurie: 'normo',
    ASCVD_etablie: false,
    insuffisance_cardiaque: false,
  }

  it("insuffisance_cardiaque est décisif même s'il ne change jamais l'ordre affiché pour ce patient", () => {
    const pertinents = criteresPertinents(node!, PROFIL_RECETTE)
    expect(pertinents.has('insuffisance_cardiaque')).toBe(true)
  })

  it('albuminurie (même mécanisme de rang à égalité) est décisif pour ce patient', () => {
    const pertinents = criteresPertinents(node!, PROFIL_RECETTE)
    expect(pertinents.has('albuminurie')).toBe(true)
  })

  it("l'ordre affiché des options est bien inchangé entre IC=false et IC=true (le piège de la recette)", () => {
    // Non-régression du diagnostic : ce n'est PAS un défaut de tri (l'ordre est correct et stable dans
    // les deux cas) — le défaut était que `criteresPertinents` confondait « ordre inchangé » avec
    // « aucun effet », alors que le RANG retenu, lui, change bien (2 → 3 pour AR GLP‑1).
    const derive = (ic: boolean) => ({ ...PROFIL_RECETTE, insuffisance_cardiaque: ic })
    const noms = (c: Criteria) => {
      const derived = calculerCriteresDerives(node!.criteres_entree, c)
      return evaluateNode(node!, derived).applicable.map((o) => o.intitule)
    }
    expect(noms(derive(false))).toEqual(noms(derive(true)))
  })

  it('aucun autre critère saisissable connu du patient n’est estompé à tort sur ce profil (garde-fou large)', () => {
    // Les critères transverses (âge, fragilité, préférences…) sont légitimement inertes ici (aucune
    // option ne dépend d'eux pour CE patient) : seule la liste ci-dessous est acceptée comme non-pertinente.
    const pertinents = criteresPertinents(node!, PROFIL_RECETTE)
    const inertesAcceptes = new Set([
      'age',
      'fragilite',
      'esperance_vie',
      'risque_hypoglycemie_schema',
      'hypoglycemie_recente',
      'nature_intolerance',
      'traitements_en_cours', // naïf par construction pour intention=initier (visible_si, T-2)
    ])
    for (const critere of node!.criteres_entree) {
      if (critere.derive != null) continue
      if (pertinents.has(critere.nom)) continue
      expect(inertesAcceptes.has(critere.nom)).toBe(true)
    }
  })
})

describe('relevance — champsDecisifsManquants (reco provisoire)', () => {
  it('rien de renseigné → tous les décisifs manquent', () => {
    const manquants = champsDecisifsManquants(node!, PROFIL, new Set())
    expect(manquants.length).toBeGreaterThan(0)
    expect(manquants).toContain('ASCVD_etablie')
  })

  it('tous les pertinents renseignés → aucun décisif manquant (reco définitive)', () => {
    const touched = criteresPertinents(node!, PROFIL)
    expect(champsDecisifsManquants(node!, PROFIL, touched)).toEqual([])
  })

  it('un décisif renseigné n’est plus « manquant »', () => {
    const manquants = champsDecisifsManquants(node!, PROFIL, new Set(['ASCVD_etablie']))
    expect(manquants).not.toContain('ASCVD_etablie')
    expect(manquants).toContain('DFG')
  })
})
