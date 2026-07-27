/**
 * Tests du registre `enAttente` et de l'évaluation ternaire dans `evaluateNode.ts` (DECISIONS.md D20,
 * `docs/decision/validation/chantier-2026-07-26/SPEC-valeur-indeterminee.md` §2). Nœuds **synthétiques**
 * (le moteur ne connaît aucun nœud/domaine par son nom, D8) — même convention que `evaluateNode.p2.test.ts`.
 */
import { describe, expect, it } from 'vitest'
import type { CritereEntree, Noeud, Option } from '../content/node.types.ts'
import { evaluateNode } from './evaluateNode.ts'

/** Fabrique une option minimale (les champs cliniques d'affichage ne changent pas la sélection). */
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

/** Fabrique un nœud complet (schéma) autour d'options et de critères d'entrée. */
function makeNode(
  options: Option[],
  criteresEntree: CritereEntree[],
  extra: Partial<Pick<Noeud, 'selection' | 'alertes'>> = {},
): Noeud {
  return {
    id: 'noeud-test',
    domaine: 'test',
    titre: 'Nœud de test',
    population_cible: 'test',
    criteres_entree: criteresEntree,
    options,
    argumentaire: 'x',
    sources: {
      references_primaires: [],
      synthese_critique: { donnee: '', references: [] },
      reco_officielle: { source: '', position: '', divergence: false, explication: '' },
    },
    incertitudes: [],
    veille_liee: [],
    meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide', version: '1.0', changelog: [] },
    ...extra,
  }
}

const noms = (opts: Option[]): string[] => opts.map((o) => o.intitule)

describe('evaluateNode — renseignes absent (repli, D20) : comportement historique inchangé', () => {
  it('sans `renseignes`, `enAttente` est toujours vide, même sur des critères jamais renseignés par un appelant ternaire', () => {
    const a = opt('A', ['DFG < 60'])
    const criteres: CritereEntree[] = [{ nom: 'DFG', type: 'nombre' }]
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { DFG: 45 })
    expect(res.enAttente.size).toBe(0)
    expect(noms(res.applicable)).toEqual(['A'])
  })
})

describe('evaluateNode — conditions/prerequis indéterminés ⇒ enAttente (Q1 référent)', () => {
  const criteres: CritereEntree[] = [{ nom: 'DFG', type: 'nombre' }]

  it("une condition sur un critère `nombre` non renseigné bascule l'option en `enAttente`, PAS dans `applicable` ni `nonRetenues`", () => {
    const a = opt('A', ['DFG < 60'])
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { DFG: 45 }, new Set())
    expect(res.applicable).toEqual([])
    expect(res.nonRetenues.has(a)).toBe(false)
    expect(res.enAttente.has(a)).toBe(true)
  })

  it("`enAttente` porte le nom du critère PRIMITIF manquant (pour l'écran « à renseigner : … »)", () => {
    const a = opt('A', ['DFG < 60'])
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { DFG: 45 }, new Set())
    expect(res.enAttente.get(a)).toEqual(['DFG'])
  })

  it('une fois DFG renseigné, la même option redevient tranchable (ici applicable)', () => {
    const a = opt('A', ['DFG < 60'])
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { DFG: 45 }, new Set(['DFG']))
    expect(noms(res.applicable)).toEqual(['A'])
    expect(res.enAttente.size).toBe(0)
  })

  it('un `prerequis` indéterminé a le même effet qu’une `condition` indéterminée', () => {
    const a = opt('A', ['toujours'], { prerequis: ['DFG < 60'] })
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { DFG: 45 }, new Set())
    expect(res.applicable).toEqual([])
    expect(res.enAttente.has(a)).toBe(true)
  })
})

describe('evaluateNode — PROPRIÉTÉ DE NON-MUTISME au niveau option (SPEC §2.3)', () => {
  it("une condition disjonctive reste VRAIE (option applicable) si une branche est vraie, même si une autre branche référence un critère non renseigné", () => {
    const criteres: CritereEntree[] = [
      { nom: 'DFG', type: 'nombre' },
      { nom: 'ASCVD_etablie', type: 'bool' },
    ]
    const a = opt('A', ['DFG < 60 OR ASCVD_etablie == true'])
    const node = makeNode([a], criteres)
    // DFG non renseigné (indéterminé) ; ASCVD_etablie renseignée (bool, déterminée par défaut de toute
    // façon, D20 §2.2) et vraie → l'option reste PROPOSÉE, jamais mise en attente.
    const res = evaluateNode(node, { DFG: 999, ASCVD_etablie: true }, new Set(['ASCVD_etablie']))
    expect(noms(res.applicable)).toEqual(['A'])
    expect(res.enAttente.size).toBe(0)
  })
})

describe("evaluateNode — ASYMÉTRIE condition/exclusion : une `exclusion` indéterminée n'est JAMAIS traitée comme fausse ni comme vraie (Q2 référent, point le plus sensible du lot)", () => {
  const criteres: CritereEntree[] = [
    { nom: 'indique', type: 'bool' },
    { nom: 'dialyse', type: 'nombre' }, // volontairement `nombre` pour forcer l'indétermination
  ]

  it("n'est PAS traitée comme fausse : l'option n'atterrit PAS dans `applicable` (elle laisserait passer un geste peut-être contre-indiqué)", () => {
    const a = opt('A', ['indique == true'], { exclusions: ['dialyse > 0'] })
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { indique: true, dialyse: 0 }, new Set(['indique']))
    expect(res.applicable).not.toContain(a)
    expect(noms(res.applicable)).not.toContain('A')
  })

  it("n'est PAS traitée comme vraie non plus : l'option n'atterrit PAS dans `excluded` (elle serait écartée à tort, perdant une option peut-être indiquée)", () => {
    const a = opt('A', ['indique == true'], { exclusions: ['dialyse > 0'] })
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { indique: true, dialyse: 0 }, new Set(['indique']))
    expect(res.excluded.has(a)).toBe(false)
  })

  it("bascule dans `enAttente`, le troisième état qui n'est ni l'un ni l'autre", () => {
    const a = opt('A', ['indique == true'], { exclusions: ['dialyse > 0'] })
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { indique: true, dialyse: 0 }, new Set(['indique']))
    expect(res.enAttente.has(a)).toBe(true)
    expect(res.enAttente.get(a)).toEqual(['dialyse'])
  })

  it('une fois `dialyse` renseigné, le verdict devient définitif — ici exclu (dialyse > 0 vrai)', () => {
    const a = opt('A', ['indique == true'], { exclusions: ['dialyse > 0'] })
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { indique: true, dialyse: 3 }, new Set(['indique', 'dialyse']))
    expect(res.excluded.has(a)).toBe(true)
    expect(res.enAttente.has(a)).toBe(false)
  })

  it('une fois `dialyse` renseigné à une valeur ne déclenchant pas l’exclusion, l’option redevient applicable', () => {
    const a = opt('A', ['indique == true'], { exclusions: ['dialyse > 0'] })
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { indique: true, dialyse: 0 }, new Set(['indique', 'dialyse']))
    expect(noms(res.applicable)).toEqual(['A'])
    expect(res.enAttente.has(a)).toBe(false)
  })
})

describe('evaluateNode — bool/liste restent déterminés PAR DÉFAUT (SPEC §2.2), sauf `confirmation_requise`', () => {
  it("un critère `bool` non renseigné (case non cochée) N'EST PAS indéterminé : l'option se tranche normalement", () => {
    const criteres: CritereEntree[] = [{ nom: 'fragilite', type: 'bool' }]
    const a = opt('A', ['fragilite == false'])
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { fragilite: false }, new Set()) // fragilite absent de renseignes
    expect(noms(res.applicable)).toEqual(['A'])
    expect(res.enAttente.size).toBe(0)
  })

  it("un critère `bool` `confirmation_requise: true` reste indéterminé tant qu'il n'est pas explicitement renseigné", () => {
    const criteres: CritereEntree[] = [{ nom: 'ASCVD_etablie', type: 'bool', confirmation_requise: true }]
    const a = opt('A', ['ASCVD_etablie == false'])
    const node = makeNode([a], criteres)
    const res = evaluateNode(node, { ASCVD_etablie: false }, new Set())
    expect(res.applicable).toEqual([])
    expect(res.enAttente.has(a)).toBe(true)

    const resRenseigne = evaluateNode(node, { ASCVD_etablie: false }, new Set(['ASCVD_etablie']))
    expect(noms(resRenseigne.applicable)).toEqual(['A'])
  })
})

/**
 * RÉVISION DE D20 — 2026-07-27. Ce `describe` s'intitulait « un non-default en attente ne bloque pas le
 * repli » et vérifiait l'INVERSE de ce qu'il vérifie aujourd'hui. Le comportement d'origine était
 * délibéré (« rester silencieux sur une option ne doit pas priver le patient d'un repli par ailleurs
 * sûr ») ; la recette référent du 2026-07-27 l'a renversé sur pièces.
 *
 * Le cas qui a tranché : sur `insuline`, patient NAÏF d'insuline, les 9 options passaient en attente ET
 * la carte « Poursuivre le schéma d'insuline en cours » s'affichait, badge « Recommandée ». Le moteur
 * suspendait son jugement, l'écran concluait — R7 exactement (« le moteur ne se prononce jamais sur ce
 * qu'il ignore »).
 *
 * Ce que le renversement a demandé de voir : le repli n'est pas un filet NEUTRE. Celui d'`insuline`
 * affirme « objectif atteint, sans hypoglycémie ni variabilité ». Tant qu'on le lisait comme « rien
 * d'autre ne s'applique, voici la conduite sûre », le motif d'origine tenait ; dès qu'on lit ce qu'il
 * DIT, il tombe.
 *
 * Le test ci-dessous n'a donc PAS été supprimé : il documente la frontière, dans les deux sens.
 */
describe('evaluateNode — repli `default` : une option EN ATTENTE suspend le repli (révision D20, 2026-07-27)', () => {
  it("le repli NE s'active PAS tant qu'une option non-default est EN ATTENTE (R7 : ne pas conclure sur ce qu'on ignore)", () => {
    const criteres: CritereEntree[] = [{ nom: 'DFG', type: 'nombre' }]
    const a = opt('A', ['DFG < 60'])
    const def = opt('Défaut', ['default'])
    const node = makeNode([a, def], criteres)
    const res = evaluateNode(node, { DFG: 999 }, new Set())
    expect(res.applicable).toEqual([])
    expect(res.enAttente.has(a)).toBe(true)
  })

  it("le repli s'active dès que l'indétermination est levée, même si l'option non-default reste non retenue", () => {
    // La contrepartie, et c'est elle qui borne la révision : suspendre le repli sur une INDÉTERMINATION
    // ne doit pas le suspendre sur un simple « non indiqué ». DFG renseigné à 999 ⇒ A est non retenue
    // (R4), plus en attente ⇒ le repli reprend son rôle de filet.
    const criteres: CritereEntree[] = [{ nom: 'DFG', type: 'nombre' }]
    const a = opt('A', ['DFG < 60'])
    const def = opt('Défaut', ['default'])
    const node = makeNode([a, def], criteres)
    const res = evaluateNode(node, { DFG: 999 }, new Set(['DFG']))
    expect(noms(res.applicable)).toEqual(['Défaut'])
    expect(res.enAttente.size).toBe(0)
    expect(res.nonRetenues.has(a)).toBe(true)
  })
})

describe('evaluateNode — priorite[].quand indéterminée (D20 §2.4) : ne matche pas, règle suivante essayée', () => {
  it("une règle de priorité dont `quand` est indéterminé est ignorée, la règle suivante (ou le repli +Infinity) s'applique", () => {
    const criteres: CritereEntree[] = [
      { nom: 'flag', type: 'bool' },
      { nom: 'age', type: 'nombre' },
    ]
    const a = opt('A', ['flag == true'], {
      priorite: [
        { quand: 'age >= 75', rang: 1 },
        { quand: 'default', rang: 5 },
      ],
    })
    const b = opt('B', ['flag == true'], { priorite: 2 })
    const node = makeNode([a, b], criteres)
    // age non renseigné : la 1re règle de priorité de A est indéterminée, ne matche pas → repli sur la
    // règle `default` (rang 5) — A n'est jamais en attente pour autant : sa CONDITION (flag) est décidée.
    const res = evaluateNode(node, { flag: true, age: 999 }, new Set(['flag']))
    expect(res.enAttente.size).toBe(0)
    expect(noms(res.applicable)).toEqual(['B', 'A']) // B (rang 2) avant A (rang 5 par repli)
  })
})

describe('evaluateNode — alertes de nœud : une alerte indéterminée ne s’affiche pas (D20 §2.4)', () => {
  it("`quand` indéterminé ⇒ alerte absente de `alertes` (jamais affichée sur donnée manquante)", () => {
    const criteres: CritereEntree[] = [{ nom: 'DFG', type: 'nombre' }]
    const a = opt('A', ['toujours'])
    const node = makeNode([a], criteres, { alertes: [{ quand: 'DFG < 30', message: 'Alerte rénale' }] })
    const res = evaluateNode(node, { DFG: 45 }, new Set())
    expect(res.alertes).toEqual([])
  })

  it('une fois DFG renseigné et vérifiant `quand`, l’alerte s’affiche normalement', () => {
    const criteres: CritereEntree[] = [{ nom: 'DFG', type: 'nombre' }]
    const a = opt('A', ['toujours'])
    const node = makeNode([a], criteres, { alertes: [{ quand: 'DFG < 30', message: 'Alerte rénale' }] })
    const res = evaluateNode(node, { DFG: 20 }, new Set(['DFG']))
    expect(res.alertes.map((al) => al.message)).toEqual(['Alerte rénale'])
  })
})

describe('evaluateNode — ordered-first-match : halte sur indéterminé (D20, l’ordre du nœud fait foi)', () => {
  const criteres: CritereEntree[] = [
    { nom: 'DFG', type: 'nombre' },
    { nom: 'flag', type: 'bool' },
  ]

  it("une option indéterminée rencontrée dans l'ordre arrête la résolution : le nœud entier devient en attente, les options suivantes ne sont jamais atteintes", () => {
    const a = opt('A', ['DFG < 30']) // indéterminée (DFG non renseigné)
    const b = opt('B', ['flag == true']) // serait vraie si on l'atteignait
    const def = opt('Défaut', ['default'])
    const node = makeNode([a, b, def], criteres, { selection: 'ordered-first-match' })
    const res = evaluateNode(node, { DFG: 999, flag: true }, new Set(['flag']))
    expect(res.applicable).toEqual([])
    expect(res.enAttente.has(a)).toBe(true)
    expect(res.nonRetenues.has(b)).toBe(false) // jamais atteinte
    expect(res.enAttente.has(b)).toBe(false)
  })

  it('sans option bloquante en tête, la sélection ordered-first-match fonctionne normalement', () => {
    const a = opt('A', ['DFG < 30'])
    const b = opt('B', ['flag == true'])
    const def = opt('Défaut', ['default'])
    const node = makeNode([a, b, def], criteres, { selection: 'ordered-first-match' })
    const res = evaluateNode(node, { DFG: 60, flag: true }, new Set(['DFG', 'flag']))
    expect(noms(res.applicable)).toEqual(['B'])
    expect(res.enAttente.size).toBe(0)
  })
})
