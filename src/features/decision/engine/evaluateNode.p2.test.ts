/**
 * Tests du comportement P2 du sélecteur (`evaluateNode.ts`, DECISIONS.md D13) : exclusions dures,
 * tri par `priorite` (mode multi-options), et opérateur `contient` via les conditions d'une option.
 *
 * Volontairement sur des nœuds **synthétiques** (le moteur ne connaît aucun nœud/domaine par son
 * nom, D8) : on isole la sémantique du sélecteur, indépendamment du contenu clinique réel. Les
 * nœuds A/B réels restent couverts par `evaluateNode.test.ts` et `content.test.ts`.
 */
import { describe, expect, it } from 'vitest'
import type { Noeud, Option, PrioriteConditionnelle } from '../content/node.types.ts'
import type { Criteria } from './conditions.ts'
import { ConditionError } from './conditions.ts'
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

/** Fabrique un nœud complet (schéma) autour d'options : seuls `selection` + `options` pilotent le tri. */
function makeNode(
  options: Option[],
  selection: 'multi-options' | 'ordered-first-match' = 'multi-options',
): Noeud {
  return {
    id: 'noeud-test',
    domaine: 'test',
    titre: 'Nœud de test',
    population_cible: 'test',
    selection,
    criteres_entree: [],
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

const noms = (opts: Option[]): string[] => opts.map((o) => o.intitule)

describe('evaluateNode — multi-options : exclusions dures (D13)', () => {
  it('une option applicable dont une exclusion est vraie est retirée et tracée dans `excluded`', () => {
    const a = opt('A', ['flag == true'], { exclusions: ['danger == true'] })
    const def = opt('Défaut', ['default'])
    const node = makeNode([a, def])

    const res = evaluateNode(node, { flag: true, danger: true })
    // A exclue → n'apparaît pas dans applicable ; le repli s'active faute d'option non-default applicable.
    expect(noms(res.applicable)).toEqual(['Défaut'])
    expect(res.excluded.has(a)).toBe(true)
    expect(res.excluded.get(a)).toEqual(['danger == true'])
  })

  it("sans déclenchement d'exclusion, l'option reste applicable et `excluded` est vide", () => {
    const a = opt('A', ['flag == true'], { exclusions: ['danger == true'] })
    const def = opt('Défaut', ['default'])
    const node = makeNode([a, def])

    const res = evaluateNode(node, { flag: true, danger: false })
    expect(noms(res.applicable)).toEqual(['A'])
    expect(res.excluded.size).toBe(0)
  })

  it("une option exclue ne compte pas comme applicable → le repli s'active", () => {
    const a = opt('A', ['flag == true'], { exclusions: ['danger == true'] })
    const b = opt('B', ['autre == true'], { exclusions: ['danger == true'] })
    const def = opt('Défaut', ['default'])
    const node = makeNode([a, b, def])

    const res = evaluateNode(node, { flag: true, autre: true, danger: true })
    expect(noms(res.applicable)).toEqual(['Défaut'])
    expect(res.excluded.has(a)).toBe(true)
    expect(res.excluded.has(b)).toBe(true)
  })

  it('le repli lui-même est soumis à ses exclusions (peut aboutir à aucune option)', () => {
    const a = opt('A', ['flag == true'])
    const def = opt('Défaut', ['default'], { exclusions: ['interdit == true'] })
    const node = makeNode([a, def])

    const res = evaluateNode(node, { flag: false, interdit: true })
    expect(res.applicable).toHaveLength(0)
    expect(res.excluded.has(def)).toBe(true)
  })

  it("une exclusion n'est évaluée que si les conditions de l'option sont satisfaites", () => {
    // L'exclusion référence une variable absente : elle lèverait SI évaluée. Conditions non
    // satisfaites (flag=false) → l'option n'est pas candidate → exclusion non évaluée → pas d'erreur.
    const a = opt('A', ['flag == true'], { exclusions: ['variable_absente == true'] })
    const def = opt('Défaut', ['default'])
    const node = makeNode([a, def])

    expect(() => evaluateNode(node, { flag: false })).not.toThrow()
  })

  it('une exclusion mal formée / à variable inconnue propage ConditionError (pas de faux silencieux)', () => {
    const a = opt('A', ['flag == true'], { exclusions: ['variable_absente == true'] })
    const def = opt('Défaut', ['default'])
    const node = makeNode([a, def])

    expect(() => evaluateNode(node, { flag: true })).toThrow(ConditionError)
    expect(() => evaluateNode(node, { flag: true })).toThrow(/variable_absente/)
  })
})

describe('evaluateNode — multi-options : tri par priorite (D13)', () => {
  it('les options applicables sont triées par priorite croissante', () => {
    const o1 = opt('rang-3', ['a == true'], { priorite: 3 })
    const o2 = opt('rang-1', ['a == true'], { priorite: 1 })
    const o3 = opt('rang-2', ['a == true'], { priorite: 2 })
    const node = makeNode([o1, o2, o3])

    expect(noms(evaluateNode(node, { a: true }).applicable)).toEqual(['rang-1', 'rang-2', 'rang-3'])
  })

  it('une option sans priorite passe après celles qui en ont une', () => {
    const sansRang = opt('sans-rang', ['a == true'])
    const rang1 = opt('rang-1', ['a == true'], { priorite: 1 })
    const node = makeNode([sansRang, rang1])

    expect(noms(evaluateNode(node, { a: true }).applicable)).toEqual(['rang-1', 'sans-rang'])
  })

  it('tri stable : à priorite égale, l’ordre du contenu est préservé', () => {
    const premier = opt('premier', ['a == true'], { priorite: 2 })
    const second = opt('second', ['a == true'], { priorite: 2 })
    const node = makeNode([premier, second])

    expect(noms(evaluateNode(node, { a: true }).applicable)).toEqual(['premier', 'second'])
  })

  it('sans aucun champ priorite, l’ordre du contenu est conservé (non-régression)', () => {
    const un = opt('un', ['a == true'])
    const deux = opt('deux', ['a == true'])
    const node = makeNode([un, deux])

    expect(noms(evaluateNode(node, { a: true }).applicable)).toEqual(['un', 'deux'])
  })
})

describe('evaluateNode — ordered-first-match : exclusions (D13)', () => {
  it('la 1re option satisfaite mais exclue est sautée au profit de la suivante', () => {
    const o1 = opt('première', ['a == true'], { exclusions: ['b == true'] })
    const o2 = opt('seconde', ['a == true'])
    const def = opt('Défaut', ['default'])
    const node = makeNode([o1, o2, def], 'ordered-first-match')

    const res = evaluateNode(node, { a: true, b: true })
    expect(noms(res.applicable)).toEqual(['seconde'])
    expect(res.excluded.has(o1)).toBe(true)
  })

  it('sans exclusion déclenchée, la 1re option satisfaite l’emporte', () => {
    const o1 = opt('première', ['a == true'], { exclusions: ['b == true'] })
    const o2 = opt('seconde', ['a == true'])
    const def = opt('Défaut', ['default'])
    const node = makeNode([o1, o2, def], 'ordered-first-match')

    expect(noms(evaluateNode(node, { a: true, b: false }).applicable)).toEqual(['première'])
  })

  it('si le repli est exclu et rien d’autre ne matche → aucune option, repli tracé dans `excluded`', () => {
    const o1 = opt('première', ['a == true'])
    const def = opt('Défaut', ['default'], { exclusions: ['z == true'] })
    const node = makeNode([o1, def], 'ordered-first-match')

    const res = evaluateNode(node, { a: false, z: true })
    expect(res.applicable).toHaveLength(0)
    expect(res.excluded.has(def)).toBe(true)
  })
})

describe('evaluateNode — conditions avec opérateur de liste `contient` (D13)', () => {
  it('sélectionne l’option quand la classe est présente dans traitements_en_cours', () => {
    const ajout = opt('Intensifier', ['traitements_en_cours ne_contient_pas iSGLT2'])
    const def = opt('Poursuivre', ['default'])
    const node = makeNode([ajout, def])

    expect(noms(evaluateNode(node, { traitements_en_cours: ['metformine'] }).applicable)).toEqual([
      'Intensifier',
    ])
    expect(noms(evaluateNode(node, { traitements_en_cours: ['metformine', 'iSGLT2'] }).applicable)).toEqual([
      'Poursuivre',
    ])
  })

  it('un opérateur scalaire sur un critère liste propage ConditionError', () => {
    const mauvais = opt('X', ['traitements_en_cours == metformine'])
    const def = opt('Défaut', ['default'])
    const node = makeNode([mauvais, def])

    expect(() => evaluateNode(node, { traitements_en_cours: ['metformine'] } as Criteria)).toThrow(
      ConditionError,
    )
  })
})

describe('evaluateNode — garde-fous « aucun score caché » (red-team P2, D13)', () => {
  it('une option non-repli au tableau `conditions` vide → ConditionError (pas d’applicabilité vacante)', () => {
    const bad = opt('sans-condition', [])
    const def = opt('Défaut', ['default'])
    const node = makeNode([bad, def])

    expect(() => evaluateNode(node, { a: true })).toThrow(ConditionError)
    expect(() => evaluateNode(node, { a: true })).toThrow(/sans-condition/)
  })

  it('idem en mode ordered-first-match', () => {
    const bad = opt('sans-condition', [])
    const def = opt('Défaut', ['default'])
    const node = makeNode([bad, def], 'ordered-first-match')

    expect(() => evaluateNode(node, { a: true })).toThrow(ConditionError)
  })

  it('une exclusion vide sur une option applicable → ConditionError (CI jamais désactivée en silence)', () => {
    const a = opt('A', ['flag == true'], { exclusions: [''] })
    const def = opt('Défaut', ['default'])
    const node = makeNode([a, def])

    // L'option est applicable (flag=true) → l'exclusion est évaluée → l'expression vide doit lever,
    // plutôt que d'être silencieusement ignorée (ce qui laisserait passer une contre-indication).
    expect(() => evaluateNode(node, { flag: true })).toThrow(ConditionError)
  })
})

describe('evaluateNode — multi-options : priorite conditionnelle (D14)', () => {
  // Patron du nœud B : iSGLT2 prioritaire si indication IC/rénale ; sinon AR GLP-1 prioritaire
  // (athérome/obésité). Chaque option porte ses propres règles de rang référençant la comorbidité.
  const REIN = 'insuffisance_cardiaque == true OR DFG < 60 OR albuminurie != normo'
  function noeudBLike(): ReturnType<typeof makeNode> {
    const isglt2 = opt(
      'iSGLT2',
      ['insuffisance_cardiaque == true OR DFG < 60 OR albuminurie != normo OR ASCVD_etablie == true'],
      { priorite: [{ quand: REIN, rang: 1 }, { quand: 'default', rang: 2 }] },
    )
    const glp1 = opt('AR GLP-1', ['ASCVD_etablie == true OR IMC >= 30'], {
      priorite: [{ quand: REIN, rang: 2 }, { quand: 'default', rang: 1 }],
    })
    const metformine = opt('Metformine', ['default'])
    return makeNode([isglt2, glp1, metformine])
  }

  it('indication IC/rénale présente → iSGLT2 passe avant AR GLP-1', () => {
    const res = evaluateNode(noeudBLike(), {
      insuffisance_cardiaque: true,
      DFG: 80,
      albuminurie: 'normo',
      ASCVD_etablie: true,
      IMC: 32,
    })
    expect(noms(res.applicable)).toEqual(['iSGLT2', 'AR GLP-1'])
  })

  it('athérome/obésité SANS IC/rénal → AR GLP-1 passe avant iSGLT2', () => {
    const res = evaluateNode(noeudBLike(), {
      insuffisance_cardiaque: false,
      DFG: 90,
      albuminurie: 'normo',
      ASCVD_etablie: true,
      IMC: 32,
    })
    expect(noms(res.applicable)).toEqual(['AR GLP-1', 'iSGLT2'])
  })

  it('la règle "default" sert de repli quand aucune condition ne matche', () => {
    const x = opt('X', ['a == true'], { priorite: [{ quand: 'b == true', rang: 1 }, { quand: 'default', rang: 5 }] })
    const y = opt('Y', ['a == true'], { priorite: 3 })
    const node = makeNode([x, y])
    // b=false → X prend le rang "default" 5 ; Y rang 3 → Y avant X
    expect(noms(evaluateNode(node, { a: true, b: false }).applicable)).toEqual(['Y', 'X'])
    // b=true → X prend rang 1 → X avant Y
    expect(noms(evaluateNode(node, { a: true, b: true }).applicable)).toEqual(['X', 'Y'])
  })

  it('aucune règle ne matche et pas de "default" → rang le plus faible (option en dernier)', () => {
    const sansMatch = opt('sans-match', ['a == true'], { priorite: [{ quand: 'b == true', rang: 1 }] })
    const fixe = opt('fixe-2', ['a == true'], { priorite: 2 })
    const node = makeNode([sansMatch, fixe])
    expect(noms(evaluateNode(node, { a: true, b: false }).applicable)).toEqual(['fixe-2', 'sans-match'])
  })

  it('rangs conditionnel et fixe se mélangent correctement dans le tri', () => {
    const cond = opt('cond-1', ['a == true'], { priorite: [{ quand: 'a == true', rang: 1 }] })
    const fixe = opt('fixe-2', ['a == true'], { priorite: 2 })
    const sans = opt('sans-rang', ['a == true'])
    const node = makeNode([fixe, sans, cond])
    expect(noms(evaluateNode(node, { a: true }).applicable)).toEqual(['cond-1', 'fixe-2', 'sans-rang'])
  })

  it('un `quand` malformé (variable inconnue) propage ConditionError, jamais un faux silencieux', () => {
    const bad = opt('bad', ['a == true'], { priorite: [{ quand: 'variable_absente == true', rang: 1 }] })
    const def = opt('def', ['default'])
    const node = makeNode([bad, def])
    expect(() => evaluateNode(node, { a: true })).toThrow(ConditionError)
    expect(() => evaluateNode(node, { a: true })).toThrow(/variable_absente/)
  })
})

describe('evaluateNode — rang conditionnel : garde-fous « aucun score caché » (red-team D14)', () => {
  // Contenu non validé par Ajv au runtime (D9) : le moteur doit lever, jamais trier en silence.
  it('règle qui matche mais SANS `rang` → ConditionError nommant l’option (pas de démotion muette)', () => {
    const x = opt('X', ['a == true'], {
      priorite: [{ quand: 'a == true' }] as unknown as PrioriteConditionnelle[],
    })
    const y = opt('Y', ['a == true'], { priorite: 5 })
    const node = makeNode([x, y])
    expect(() => evaluateNode(node, { a: true })).toThrow(ConditionError)
    expect(() => evaluateNode(node, { a: true })).toThrow(/X/)
  })

  it('règle SANS `quand` → ConditionError (pas un TypeError brut)', () => {
    const x = opt('X', ['a == true'], {
      priorite: [{ rang: 5 }] as unknown as PrioriteConditionnelle[],
    })
    const def = opt('def', ['default'])
    const node = makeNode([x, def])
    expect(() => evaluateNode(node, { a: true })).toThrow(ConditionError)
  })

  it('`rang: NaN` sur une règle qui matche → ConditionError (comparateur jamais nourri de NaN)', () => {
    const x = opt('X', ['a == true'], { priorite: [{ quand: 'default', rang: NaN }] })
    const y = opt('Y', ['a == true'], { priorite: 1 })
    const node = makeNode([x, y])
    expect(() => evaluateNode(node, { a: true })).toThrow(ConditionError)
  })

  it('`priorite` d’une forme inattendue (ni entier ni tableau) → ConditionError', () => {
    const x = opt('X', ['a == true'], { priorite: 'default' as unknown as number })
    const def = opt('def', ['default'])
    const node = makeNode([x, def])
    expect(() => evaluateNode(node, { a: true })).toThrow(ConditionError)
  })

  it('`priorite` numérique non fini → ConditionError', () => {
    const x = opt('X', ['a == true'], { priorite: Number.POSITIVE_INFINITY })
    const y = opt('Y', ['a == true'], { priorite: 1 })
    const node = makeNode([x, y])
    expect(() => evaluateNode(node, { a: true })).toThrow(ConditionError)
  })
})
