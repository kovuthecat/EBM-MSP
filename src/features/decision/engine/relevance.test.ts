/**
 * Tests du moteur de pertinence (P3 · S7‑ui Lot 1). Vérifie, sur le nœud réel `prescription`, que la
 * perturbation identifie bien les critères DÉCISIFS et écarte les critères INERTES pour un patient donné.
 */
import { describe, expect, it } from 'vitest'
import type { CritereEntree, Noeud, Option } from '../content/node.types.ts'
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
  // R1 (GRAMMAIRE-NOEUD.md) : critère désormais DÉCLARÉ (plus déduit de `intention`) — sans lui, le moteur
  // de dérivation traiterait le nom du critère comme un libellé littéral (aucune clé trouvée), ce qui
  // fausserait silencieusement `cible_atteinte`/`palette_glycemique_ouverte`.
  position_vs_cible: 'a_l_objectif',
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
  // R1 (GRAMMAIRE-NOEUD.md) : aucune indication d'organe ici (ASCVD/IC/DFG/albuminurie tous négatifs) —
  // iSGLT2 et AR GLP-1 ne sont applicables que via `palette_glycemique_ouverte`, donc de
  // `position_vs_cible` (plus de `intention` seule). `nettement_au_dessus` est, à l'initiation, la seule
  // valeur qui l'ouvre (remplace l'ancien seuil absolu HbA1c ≥ 8,5 %).
  const PROFIL_RECETTE: Criteria = {
    ...buildDefaultCriteria(node!.criteres_entree),
    intention: 'initier',
    position_vs_cible: 'nettement_au_dessus',
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

/** Nœud synthétique minimal (même convention que `evaluateNode.indetermine.test.ts`) — le moteur de
 * pertinence ne connaît aucun nœud/critère par son nom (D8). */
function opt(intitule: string, conditions: string[], extra: Partial<Option> = {}): Option {
  return {
    intitule,
    conditions,
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
    ...extra,
  }
}

function makeNode(options: Option[], criteresEntree: CritereEntree[]): Noeud {
  return {
    id: 'noeud-test-pertinence',
    domaine: 'test',
    titre: 'Nœud de test',
    population_cible: 'test',
    criteres_entree: criteresEntree,
    options,
    argumentaire: 'x',
    sources: {
      references_primaires: [],
      medicalement_geek: { synthese: '', lien: '' },
      prescrire: { synthese: '' },
      reco_officielle: { source: '', position: '', divergence: false, explication: '' },
    },
    incertitudes: [],
    veille_liee: [],
    meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide', version: '1.0', changelog: [] },
  }
}

// D20 R7 — SPEC-valeur-indeterminee.md §2, DECISIONS.md D20 : `criteresPertinents`/`champsDecisifsManquants`
// doivent désormais REFLÉTER ce qui est réellement affiché (un nœud peut être `enAttente`), pas présumer
// que toute valeur par défaut est une réponse réelle.
describe('relevance — renseignes (D20 R7) : simuler la RÉPONSE, pas seulement changer la valeur stockée', () => {
  const criteres: CritereEntree[] = [{ nom: 'DFG', type: 'nombre' }]
  const a = opt('A', ['DFG < 60'])
  const node = makeNode([a], criteres)
  const criteria: Criteria = { DFG: 0 } // valeur par défaut, jamais saisie

  it('sans `renseignes` (repli) : comportement historique inchangé, DFG déjà vu décisif', () => {
    expect(criteresPertinents(node, criteria).has('DFG')).toBe(true)
  })

  it(
    'avec `renseignes` vide (rien de saisi) : DFG reste vu décisif — SANS la simulation de réponse ' +
      "(chaque essai ajoute le critère testé à l'ensemble effectif), la perturbation resterait " +
      'indéterminée quelle que soit la valeur candidate testée (DFG resterait absent des deux mondes ' +
      "comparés), et DFG serait à tort vu « sans effet » : le mutisme exact que ce lot corrige.",
    () => {
      expect(criteresPertinents(node, criteria, new Set()).has('DFG')).toBe(true)
    },
  )

  it('la RÉFÉRENCE (avant perturbation) reflète bien l’état réellement affiché : l’option est EN ATTENTE sur `renseignes` vide, pas silencieusement tranchée sur la valeur par défaut', () => {
    // Sanity check du scénario : sans `renseignes`, DFG=0 est lu comme une vraie réponse (0 < 60 vrai, A
    // applicable) ; avec `renseignes` vide, DFG est INDÉTERMINÉ, A part dans `enAttente` (comportement du
    // moteur, testé indépendamment par `evaluateNode.indetermine.test.ts`) — c'est CETTE différence de
    // référence que `criteresPertinents`/`champsDecisifsManquants` doivent maintenant prendre en compte.
    expect(evaluateNode(node, criteria).applicable.map((o) => o.intitule)).toEqual(['A'])
    expect(evaluateNode(node, criteria, new Set()).enAttente.has(a)).toBe(true)
  })
})

describe('relevance — champsDecisifsManquants avec `renseignes` explicite (D20 R7, 4e paramètre)', () => {
  const criteres: CritereEntree[] = [{ nom: 'DFG', type: 'nombre' }]
  const a = opt('A', ['DFG < 60'])
  const node = makeNode([a], criteres)

  it('DFG manque à la liste sur un formulaire vierge (`touched`/`renseignes` tous deux vides)', () => {
    const manquants = champsDecisifsManquants(node, { DFG: 0 }, new Set(), new Set())
    expect(manquants).toContain('DFG')
  })

  it('DFG ne manque plus une fois `touched`/`renseignes` mis à jour (le praticien a répondu)', () => {
    const manquants = champsDecisifsManquants(node, { DFG: 45 }, new Set(['DFG']), new Set(['DFG']))
    expect(manquants).not.toContain('DFG')
  })

  it('sans `renseignes` (4e paramètre omis) : comportement historique inchangé (rétro-compatibilité)', () => {
    // Même appel que la suite existante (`champsDecisifsManquants(node, criteria, touched)`, 3 arguments) :
    // le repli doit rester identique à avant ce lot, pour ne rien casser des appels déjà en place.
    const manquants = champsDecisifsManquants(node, { DFG: 0 }, new Set())
    expect(manquants).toContain('DFG') // DFG=0 < 60 : décisif dès avant ce lot, sans changement de comportement.
  })
})
