/**
 * Tests du moteur de pertinence (P3 · S7‑ui Lot 1). Vérifie, sur le nœud réel `prescription`, que la
 * perturbation identifie bien les critères DÉCISIFS et écarte les critères INERTES pour un patient donné.
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import type { Criteria } from './conditions.ts'
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
