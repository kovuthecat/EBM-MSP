/**
 * Tests de `construireVueDecision`/`signatureVue` (unification écran ↔ signature de pertinence,
 * `docs/decision/GRAMMAIRE-NOEUD.md`). Ne réévalue pas ce que couvrent déjà `groupesExAequo.test.ts`,
 * `optionBadges.test.ts` (les briques) : vérifie seulement que la COMPOSITION assemble correctement
 * (repli sans `familles`, familles + groupe d'égalité, alertes), et surtout l'INVARIANT central —
 * `signatureVue` capture tout ce que `construireVueDecision` produit, y compris les dimensions que
 * l'ancienne `signature()` de `engine/relevance.ts` ignorait (doses calculées).
 */
import { describe, expect, it } from 'vitest'
import type { Alerte, Noeud, Option } from '../content/node.types.ts'
import { construireVueDecision, signatureVue } from './vueDecision.ts'

/** Fabrique une option minimale (comme `groupesExAequo.test.ts`/`optionBadges.test.ts`). */
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

/** Fabrique un nœud complet (schéma) autour d'options : seuls les champs manipulés ici importent. */
function makeNode(
  options: Option[],
  criteresEntree: Noeud['criteres_entree'] = [],
  extra: Partial<Pick<Noeud, 'familles' | 'alertes'>> = {},
): Noeud {
  return {
    id: 'noeud-test',
    domaine: 'test',
    titre: 'Nœud de test',
    population_cible: 'test',
    selection: 'multi-options',
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
    ...extra,
  }
}

describe('construireVueDecision — repli (nœud sans `familles` déclarées)', () => {
  it('une famille unique sans libellé, groupes identiques à `groupesExAequo` seul', () => {
    const a = opt('A', ['toujours'])
    const b = opt('B', ['default'])
    const node = makeNode([a, b])
    const vue = construireVueDecision(node, {})
    expect(vue.familles).toHaveLength(1)
    expect(vue.familles[0].libelle).toBeUndefined()
    expect(vue.familles[0].exclusive).toBeUndefined()
    // « toujours » (socle) applicable ; « default » masqué car « toujours » ne compte pas comme
    // non-default réel — donc default s'active bien (aucune option non-default n'est applicable).
    const intitules = vue.familles[0].groupes.flat().map((ov) => ov.option.intitule)
    expect(intitules.sort()).toEqual(['A', 'B'])
  })

  it('badge/reasons/calculs portés par chaque `OptionVue`', () => {
    const socle = opt('Socle', ['toujours'])
    const ajout = opt('Ajout', ['x == true'], {
      calculs: [{ libelle: 'Dose', expression: '10 + 5', unite: 'mg' }],
    })
    const node = makeNode([socle, ajout], [{ nom: 'x', type: 'bool' }])
    const vue = construireVueDecision(node, { x: true })
    const ovSocle = vue.familles[0].groupes.flat().find((ov) => ov.option === socle)
    const ovAjout = vue.familles[0].groupes.flat().find((ov) => ov.option === ajout)
    expect(ovSocle?.badge).toBe('reco-officielle')
    expect(ovSocle?.reasons).toEqual(['toujours'])
    expect(ovAjout?.badge).toBe('recommandee')
    expect(ovAjout?.reasons).toEqual(['x == true'])
    expect(ovAjout?.calculs).toEqual([{ libelle: 'Dose', valeur: 15, unite: 'mg' }])
  })
})

describe('construireVueDecision — familles déclarées + groupe d’égalité', () => {
  it('deux options cumulables au même rang forment un groupe d’égalité de 2, dans leur famille', () => {
    // `w == true` (et non `['toujours']`, le sentinel du socle D16) : sinon `computeBadges` les
    // traiterait comme un socle (`isToujoursOption`) et badgerait `reco-officielle`, pas `recommandee`.
    const a = opt('A', ['w == true'], { famille: 'Cumulable', priorite: 2 })
    const b = opt('B', ['w == true'], { famille: 'Cumulable', priorite: 2 })
    const node = makeNode([a, b], [{ nom: 'w', type: 'bool' }], {
      familles: [{ libelle: 'Cumulable', exclusive: false }],
    })
    const vue = construireVueDecision(node, { w: true })
    expect(vue.familles).toHaveLength(1)
    expect(vue.familles[0].libelle).toBe('Cumulable')
    expect(vue.familles[0].exclusive).toBe(false)
    expect(vue.familles[0].groupes).toHaveLength(1)
    expect(vue.familles[0].groupes[0]).toHaveLength(2)
    expect(vue.familles[0].groupes[0].map((ov) => ov.option.intitule).sort()).toEqual(['A', 'B'])
    // Cumulable : les deux membres du groupe d'égalité portent le badge.
    expect(vue.familles[0].groupes[0].every((ov) => ov.badge === 'recommandee')).toBe(true)
  })
})

describe('construireVueDecision — alertes', () => {
  it('une alerte dont `quand` est vraie apparaît dans `vue.alertes`', () => {
    const a = opt('A', ['toujours'])
    const alerte: Alerte = { quand: 'x == true', message: 'Vérifier la fonction rénale', niveau: 'attention' }
    const node = makeNode([a], [{ nom: 'x', type: 'bool' }], { alertes: [alerte] })
    expect(construireVueDecision(node, { x: false }).alertes).toEqual([])
    expect(construireVueDecision(node, { x: true }).alertes).toEqual([alerte])
  })
})

describe('signatureVue — invariant central : totale et stable', () => {
  // `z` n'est référencé nulle part (ni conditions, ni exclusions, ni calculs) : deux jeux de critères
  // qui ne diffèrent que par `z` doivent produire EXACTEMENT la même vue rendue et la même signature.
  // `y` alimente en revanche un CALCUL affiché (`Option.calculs`) sans jamais changer quelle option
  // est applicable, son rang, ni son badge — c'est exactement la dimension que l'ancienne `signature()`
  // de `engine/relevance.ts` ignorait (elle ne comparait qu'intitulés + badges + alertes). Si
  // `signatureVue` l'ignorait aussi, ce test échouerait sur la dernière assertion.
  const socle = opt('Socle', ['toujours'], {
    calculs: [{ libelle: 'Dose', expression: 'y * 10', unite: 'mg' }],
  })
  const node = makeNode(
    [socle],
    [
      { nom: 'z', type: 'bool' },
      { nom: 'y', type: 'bool' },
    ],
  )

  it('deux jeux de critères qui ne diffèrent que par un critère inerte (`z`) → même signature ET même vue rendue', () => {
    const vueA = construireVueDecision(node, { z: true, y: false })
    const vueB = construireVueDecision(node, { z: false, y: false })
    expect(signatureVue(vueA)).toBe(signatureVue(vueB))
    expect(vueA).toEqual(vueB)
  })

  it('un critère qui ne change QUE la dose calculée change bien la vue rendue ET la signature', () => {
    const vueSansY = construireVueDecision(node, { z: true, y: false })
    const vueAvecY = construireVueDecision(node, { z: true, y: true })
    // La dose affichée change réellement (défaut historique : cette dimension était ignorée).
    expect(vueSansY.familles[0].groupes[0][0].calculs).toEqual([{ libelle: 'Dose', valeur: 0, unite: 'mg' }])
    expect(vueAvecY.familles[0].groupes[0][0].calculs).toEqual([{ libelle: 'Dose', valeur: 10, unite: 'mg' }])
    // Rien d'autre ne bouge (même option, même badge) — seule la signature totale le détecte.
    expect(vueSansY.familles[0].groupes[0][0].badge).toBe(vueAvecY.familles[0].groupes[0][0].badge)
    expect(signatureVue(vueSansY)).not.toBe(signatureVue(vueAvecY))
  })
})
