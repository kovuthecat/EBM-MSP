/**
 * Tests de `construireVueDecision`/`signatureVue` (unification écran ↔ signature de pertinence,
 * `docs/decision/GRAMMAIRE-NOEUD.md`). Ne réévalue pas ce que couvrent déjà `groupesExAequo.test.ts`,
 * `optionBadges.test.ts` (les briques) : vérifie seulement que la COMPOSITION assemble correctement
 * (repli sans `familles`, familles + groupe d'égalité, alertes), et surtout l'INVARIANT central —
 * `signatureVue` capture tout ce que `construireVueDecision` produit, y compris les dimensions que
 * l'ancienne `signature()` de `engine/relevance.ts` ignorait (doses calculées).
 */
import { describe, expect, it } from 'vitest'
import type { Alerte, CritereEntree, Noeud, Option } from '../content/node.types.ts'
import { evaluateNode } from '../engine/evaluateNode.ts'
import { criteresPertinents } from '../engine/relevance.ts'
import { describeReasons } from './conditionText.ts'
import { construireVueDecision, signatureVue } from './vueDecision.ts'

/** Fabrique une option minimale (comme `groupesExAequo.test.ts`/`optionBadges.test.ts`). */
function opt(intitule: string, conditions: string[], extra: Partial<Option> = {}): Option {
  const seule = conditions.length === 1 ? conditions[0] : undefined
  return {
    intitule,
    // `role` (A3) dérivé des sentinelles pour ces options SYNTHÉTIQUES : l'invariant I17 porte la
    // garantie sur le contenu réel, ce fichier n'a pas à la répéter à chaque appel.
    role: seule === 'toujours' ? 'socle' : seule === 'default' ? 'repli' : 'geste',
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
      synthese_critique: { donnee: '' },
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

describe('construireVueDecision — R4 : écartées (sécurité) vs non retenues (explication)', () => {
  it('une option EXCLUE apparaît dans `ecartees` avec le(s) motif(s) déclenché(s) ; une option qui échoue sur une condition apparaît dans `nonRetenues` avec SEULEMENT la 1re condition fautive', () => {
    const ecartee = opt('Écartée', ['flag == true'], { exclusions: ['danger == true'] })
    // Deux conditions : la 1re vraie (`ok`), la 2e fausse (`jamais`) — vérifie qu'on ne retient QUE la
    // première condition qui échoue, pas toutes (R4 : « c'est celle qui explique »).
    const nonRetenue = opt('Non retenue', ['ok == true', 'jamais == true'])
    const def = opt('Défaut', ['default'])
    const node = makeNode(
      [ecartee, nonRetenue, def],
      [
        { nom: 'flag', type: 'bool' },
        { nom: 'danger', type: 'bool' },
        { nom: 'ok', type: 'bool' },
        { nom: 'jamais', type: 'bool' },
      ],
    )
    const vue = construireVueDecision(node, { flag: true, danger: true, ok: true, jamais: false })
    expect(vue.ecartees).toEqual([{ option: ecartee, motifs: ['danger == true'] }])
    expect(vue.nonRetenues).toEqual([{ option: nonRetenue, condition: 'jamais == true' }])
  })

  it('une option de repli (`["default"]`) NON ACTIVÉE (une autre option couvre le patient) n’apparaît JAMAIS dans `nonRetenues` : sa non-activation n’est pas un refus, c’est sa sémantique', () => {
    const ajout = opt('Ajout', ['flag == true'])
    const def = opt('Défaut', ['default'])
    const node = makeNode([ajout, def], [{ nom: 'flag', type: 'bool' }])
    const vue = construireVueDecision(node, { flag: true }) // Ajout applicable → le repli ne s'active pas
    expect(vue.familles[0].groupes.flat().map((ov) => ov.option.intitule)).toEqual(['Ajout'])
    expect(vue.ecartees).toEqual([])
    expect(vue.nonRetenues).toEqual([])
  })

  it('un repli EXCLU par sa propre exclusion apparaît dans `ecartees` (sécurité) ; il n’a JAMAIS de vraie condition à faire échouer (`["default"]`), donc il ne peut pas figurer dans `nonRetenues`', () => {
    // Ici le repli ne s'active QUE parce qu'`A` a elle-même échoué sur sa condition (flag=false) :
    // `A` figure donc légitimement dans `nonRetenues` (faute de condition, explication) tandis que le
    // repli, une fois activé, est retiré par SA PROPRE exclusion et figure dans `ecartees` (sécurité).
    // Les deux listes coexistent ici, chacune pour la bonne raison — c'est ce qui distingue les deux
    // canaux, pas leur exclusivité mutuelle sur un même profil.
    const a = opt('A', ['flag == true'])
    const def = opt('Défaut', ['default'], { exclusions: ['interdit == true'] })
    const node = makeNode([a, def], [
      { nom: 'flag', type: 'bool' },
      { nom: 'interdit', type: 'bool' },
    ])
    const vue = construireVueDecision(node, { flag: false, interdit: true })
    expect(vue.ecartees).toEqual([{ option: def, motifs: ['interdit == true'] }])
    expect(vue.nonRetenues).toEqual([{ option: a, condition: 'flag == true' }])
  })
})

/**
 * P13/S4 (T-144) — `ecartees[].motifs` porte les branches SITUATIONNELLES d'une `exclusions`
 * déclenchée, jamais l'expression complète (R6 volet rendu, `docs/decision/GRAMMAIRE-NOEUD.md`). Même
 * défaut, même correctif que `raisonsSituationnelles` pour `reasons` (P10/S1) — ces tests en sont le
 * pendant côté écartées : une exclusion à plusieurs branches ne rend que celle(s) vraie(s) pour ce
 * patient, une exclusion à branche unique n'est pas affectée (non-régression).
 */
describe('construireVueDecision — R4/T-144 : `ecartees[].motifs` ne cite que les branches VRAIES d’une exclusion', () => {
  it('une exclusion à trois branches dont une seule est vraie ne rend QUE celle-là', () => {
    const a = opt('A', ['flag == true'], {
      exclusions: ['danger1 == true OR danger2 == true OR danger3 == true'],
    })
    const node = makeNode([a], [
      { nom: 'flag', type: 'bool' },
      { nom: 'danger1', type: 'bool' },
      { nom: 'danger2', type: 'bool' },
      { nom: 'danger3', type: 'bool' },
    ])
    const vue = construireVueDecision(node, { flag: true, danger1: false, danger2: true, danger3: false })
    expect(vue.ecartees).toEqual([{ option: a, motifs: ['danger2 == true'] }])
  })

  it('une exclusion à BRANCHE UNIQUE est rendue comme avant (non-régression)', () => {
    const a = opt('A', ['flag == true'], { exclusions: ['danger == true'] })
    const node = makeNode([a], [
      { nom: 'flag', type: 'bool' },
      { nom: 'danger', type: 'bool' },
    ])
    const vue = construireVueDecision(node, { flag: true, danger: true })
    expect(vue.ecartees).toEqual([{ option: a, motifs: ['danger == true'] }])
  })

  it('deux branches vraies simultanément sont TOUTES DEUX citées (information clinique, pas du bruit)', () => {
    const a = opt('A', ['flag == true'], {
      exclusions: ['danger1 == true OR danger2 == true'],
    })
    const node = makeNode([a], [
      { nom: 'flag', type: 'bool' },
      { nom: 'danger1', type: 'bool' },
      { nom: 'danger2', type: 'bool' },
    ])
    const vue = construireVueDecision(node, { flag: true, danger1: true, danger2: true })
    expect(vue.ecartees).toEqual([{ option: a, motifs: ['danger1 == true', 'danger2 == true'] }])
  })

  it('un motif rédigé (`Option.motifs`) sur la branche vraie remplace la traduction mécanique, une fois consommé par l’écran (`describeReasons`)', () => {
    // `construireVueDecision` ne consomme pas `Option.motifs` lui-même (P10/S2 : c'est une affaire de
    // PRÉSENTATION, cf. `lib/conditionText.ts`) — ce test vérifie donc le couple {branche situationnelle
    // exposée ici, motif rédigé porté par l'option} exactement comme l'écran les compose
    // (`DecisionNodeScreen.tsx` : `describeReasons(ecartee.motifs, ecartee.option.motifs)`).
    const a = opt('A', ['flag == true'], {
      exclusions: ['danger1 == true OR danger2 == true'],
      motifs: { 'danger2 == true': 'Risque hémorragique documenté' },
    })
    const node = makeNode([a], [
      { nom: 'flag', type: 'bool' },
      { nom: 'danger1', type: 'bool' },
      { nom: 'danger2', type: 'bool' },
    ])
    const vue = construireVueDecision(node, { flag: true, danger1: false, danger2: true })
    expect(vue.ecartees).toEqual([{ option: a, motifs: ['danger2 == true'] }])
    expect(describeReasons(vue.ecartees[0].motifs, vue.ecartees[0].option.motifs)).toBe(
      'Risque hémorragique documenté',
    )
  })
})

describe('signatureVue — R4 : un critère qui ne change QUE la liste des ÉCARTÉES est décisif (verrou du travail)', () => {
  // « A » est TOUJOURS candidate (`a == true`, fixé dans les deux profils comparés) et TOUJOURS exclue
  // (`y == true`, fixé lui aussi) : elle n'entre JAMAIS dans `applicable`/`familles`, quelle que soit la
  // valeur de `x`. Seule la liste des MOTIFS d'exclusion déclenchés (2e exclusion de l'option) varie selon
  // `x` — exactement le cas que R4 doit rendre visible : un critère qui ne bouge RIEN dans le panneau de
  // résultats (mêmes familles, mêmes alertes, aucune option ne devient applicable ou inapplicable) mais
  // change ce qui s'affiche dans les écartées. Avant ce travail, `excluded` n'entrait pas dans
  // `VueDecision`/`signatureVue` : un tel critère aurait été estompé à tort comme « sans effet ».
  const a = opt('A', ['a == true'], { exclusions: ['y == true', 'x == true'] })
  const node = makeNode(
    [a],
    [
      { nom: 'a', type: 'bool' },
      { nom: 'y', type: 'bool' },
      { nom: 'x', type: 'bool' },
    ],
  )

  it('les familles et les alertes sont IDENTIQUES entre x=false et x=true ; seule `ecartees` change', () => {
    const vueSansX = construireVueDecision(node, { a: true, y: true, x: false })
    const vueAvecX = construireVueDecision(node, { a: true, y: true, x: true })
    expect(vueSansX.familles).toEqual(vueAvecX.familles)
    expect(vueSansX.alertes).toEqual(vueAvecX.alertes)
    expect(vueSansX.ecartees).toEqual([{ option: a, motifs: ['y == true'] }])
    expect(vueAvecX.ecartees).toEqual([{ option: a, motifs: ['y == true', 'x == true'] }])
    expect(signatureVue(vueSansX)).not.toBe(signatureVue(vueAvecX))
  })

  it('`criteresPertinents` (engine/relevance.ts) voit bien `x` comme DÉCISIF alors qu’il ne change QUE les écartées — la propriété que ce travail garantit', () => {
    const pertinents = criteresPertinents(node, { a: true, y: true, x: false })
    expect(pertinents.has('x')).toBe(true)
  })
})

describe('construireVueDecision — R6 : justification SITUATIONNELLE (termes OR réellement vrais, pas la règle recopiée)', () => {
  it('une expression à plusieurs OR dont un seul terme est vrai pour ce patient → un seul motif dans `reasons`', () => {
    const a = opt('A', ['x == true OR y == true OR z == true'])
    const node = makeNode([a], [
      { nom: 'x', type: 'bool' },
      { nom: 'y', type: 'bool' },
      { nom: 'z', type: 'bool' },
    ])
    const vue = construireVueDecision(node, { x: false, y: true, z: false })
    const ov = vue.familles[0].groupes.flat().find((o) => o.option === a)
    expect(ov?.reasons).toEqual(['y == true'])
  })

  it('plusieurs termes OR vrais → TOUS renvoyés (le patient cumule les indications, information clinique, pas du bruit)', () => {
    const a = opt('A', ['x == true OR y == true OR z == true'])
    const node = makeNode([a], [
      { nom: 'x', type: 'bool' },
      { nom: 'y', type: 'bool' },
      { nom: 'z', type: 'bool' },
    ])
    const vue = construireVueDecision(node, { x: true, y: false, z: true })
    const ov = vue.familles[0].groupes.flat().find((o) => o.option === a)
    expect(ov?.reasons).toEqual(['x == true', 'z == true'])
  })

  it('plusieurs chaînes de `conditions` (en ET) : `termesVrais` appliqué à CHACUNE, résultats concaténés', () => {
    const a = opt('A', ['x == true OR y == true', 'z == true'])
    const node = makeNode([a], [
      { nom: 'x', type: 'bool' },
      { nom: 'y', type: 'bool' },
      { nom: 'z', type: 'bool' },
    ])
    const vue = construireVueDecision(node, { x: true, y: true, z: true })
    const ov = vue.familles[0].groupes.flat().find((o) => o.option === a)
    expect(ov?.reasons).toEqual(['x == true', 'y == true', 'z == true'])
  })

  it('les sentinelles `["default"]`/`["toujours"]` traversent SANS être évaluées par `termesVrais` (ne lèvent pas)', () => {
    const socle = opt('Socle', ['toujours'])
    const repli = opt('Repli', ['default'])
    const node = makeNode([socle, repli], [])
    // Aucune de ces deux options ne référence de critère réel : si `raisonsSituationnelles` tentait de
    // les évaluer comme des expressions, `termesVrais`/`evaluateCondition` lèveraient (`ConditionError`,
    // segment vide ou variable inconnue) plutôt que de les laisser passer telles quelles.
    expect(() => construireVueDecision(node, {})).not.toThrow()
    const vue = construireVueDecision(node, {})
    const ovSocle = vue.familles[0].groupes.flat().find((o) => o.option === socle)
    expect(ovSocle?.reasons).toEqual(['toujours'])
    // « Repli » ne s'active que si aucune option non-default n'est applicable : ici `socle` est
    // `toujours`, orthogonal au repli (docstring `evaluateNode.ts`) — le repli s'active donc bien.
    const ovRepli = vue.familles[0].groupes.flat().find((o) => o.option === repli)
    expect(ovRepli?.reasons).toEqual(['default'])
  })
})

describe('criteresPertinents — TEST VERROU (R6) : un critère qui ne change QUE la justification est vu DÉCISIF', () => {
  it('`w` ne change ni la sélection, ni le rang, ni le badge de A — seulement `reasons` — et reste pourtant décisif', () => {
    // `ok` est fixé à `true` dans les deux profils comparés : A est TOUJOURS applicable (1er terme OR
    // vrai), quelle que soit la valeur de `w`. Rien dans le panneau de résultats ne bouge (même option,
    // même — unique — famille/groupe, même badge, aucune alerte, aucune écartée/non-retenue) SAUF la
    // justification : `w` ajoute ou retire un second motif à `reasons`.
    const a = opt('A', ['ok == true OR w == true'])
    const node = makeNode([a], [
      { nom: 'ok', type: 'bool' },
      { nom: 'w', type: 'bool' },
    ])

    const vueSansW = construireVueDecision(node, { ok: true, w: false })
    const vueAvecW = construireVueDecision(node, { ok: true, w: true })

    // Tout, hors `reasons`, est identique — le « verrou » : rien d'autre à l'écran ne signale `w`.
    const sansReasons = (vue: ReturnType<typeof construireVueDecision>) => ({
      ...vue,
      familles: vue.familles.map((f) => ({
        ...f,
        groupes: f.groupes.map((g) =>
          g.map((ov) => ({ option: ov.option, badge: ov.badge, calculs: ov.calculs, motifRang: ov.motifRang })),
        ),
      })),
    })
    expect(sansReasons(vueSansW)).toEqual(sansReasons(vueAvecW))

    // La justification, elle, diffère bien :
    expect(vueSansW.familles[0].groupes[0][0].reasons).toEqual(['ok == true'])
    expect(vueAvecW.familles[0].groupes[0][0].reasons).toEqual(['ok == true', 'w == true'])
    expect(signatureVue(vueSansW)).not.toBe(signatureVue(vueAvecW))

    // ... et c'est précisément ce qui rend `w` DÉCISIF pour `engine/relevance.ts` : un critère qui ne
    // change QUE le texte de justification doit cesser d'être estompé à tort comme « sans effet » (R6).
    const pertinents = criteresPertinents(node, { ok: true, w: false })
    expect(pertinents.has('w')).toBe(true)
  })
})

describe('construireVueDecision — R6 arbitrage indication/prérequis : `prerequis` jamais dans `reasons`', () => {
  it('un `prerequis` VRAI (l’option reste applicable) n’apparaît JAMAIS dans `reasons`, même seul motif de non-retrait', () => {
    const a = opt('A', ['x == true'], { prerequis: ['y == true'] })
    const node = makeNode([a], [
      { nom: 'x', type: 'bool' },
      { nom: 'y', type: 'bool' },
    ])
    const vue = construireVueDecision(node, { x: true, y: true })
    const ov = vue.familles[0].groupes.flat().find((o) => o.option === a)
    expect(ov?.reasons).toEqual(['x == true'])
  })

  it('un `prerequis` FAUX retire l’option de l’écran (elle n’apparaît dans aucune famille) et figure dans `nonRetenues` avec ce prérequis comme motif — jamais dans `reasons` d’une carte affichée puisqu’elle n’est pas affichée', () => {
    const a = opt('A', ['x == true'], { prerequis: ['y == true'] })
    const node = makeNode([a], [
      { nom: 'x', type: 'bool' },
      { nom: 'y', type: 'bool' },
    ])
    const vue = construireVueDecision(node, { x: true, y: false })
    expect(vue.familles[0].groupes.flat()).toEqual([])
    expect(vue.nonRetenues).toEqual([{ option: a, condition: 'y == true' }])
  })
})

describe('construireVueDecision — R6 couche 2 : motif de rang (« pourquoi à ce rang »)', () => {
  it('rendu quand la famille distingue au moins deux rangs : présent pour l’option dont une règle de `priorite` CONDITIONNELLE (non "default") a matché, absent pour l’autre (rang FIXE, D13)', () => {
    const a = opt('A', ['toujours'], {
      priorite: [
        { quand: 'ic == true', rang: 1 },
        { quand: 'default', rang: 3 },
      ],
    })
    const b = opt('B', ['toujours'], { priorite: 2 })
    const node = makeNode([a, b], [{ nom: 'ic', type: 'bool' }])
    const vue = construireVueDecision(node, { ic: true })
    const ovA = vue.familles[0].groupes.flat().find((ov) => ov.option === a)
    const ovB = vue.familles[0].groupes.flat().find((ov) => ov.option === b)
    expect(ovA?.motifRang).toEqual(['ic == true'])
    expect(ovB?.motifRang).toBeUndefined() // rang FIXE : jamais de motif conditionnel à exposer
  })

  it('un `quand` disjonctif (`OR`) ne cite que la ou les branches réellement vraies pour ce patient (P10/S1, même correctif que `reasons`)', () => {
    const a = opt('A', ['toujours'], {
      priorite: [
        { quand: 'x == true OR y == true OR z == true', rang: 1 },
        { quand: 'default', rang: 3 },
      ],
    })
    const b = opt('B', ['toujours'], { priorite: 2 })
    const node = makeNode([a, b], [
      { nom: 'x', type: 'bool' },
      { nom: 'y', type: 'bool' },
      { nom: 'z', type: 'bool' },
    ])
    // Une seule branche vraie (`y`) : elle seule est citée, pas `x`/`z` qui sont fausses pour ce patient.
    const vueUneBranche = construireVueDecision(node, { x: false, y: true, z: false })
    const ovAUneBranche = vueUneBranche.familles[0].groupes.flat().find((ov) => ov.option === a)
    expect(ovAUneBranche?.motifRang).toEqual(['y == true'])

    // Deux branches vraies simultanément : les deux sont citées (le patient cumule, ce n'est pas du bruit).
    const vueDeuxBranches = construireVueDecision(node, { x: true, y: true, z: false })
    const ovADeuxBranches = vueDeuxBranches.familles[0].groupes.flat().find((ov) => ov.option === a)
    expect(ovADeuxBranches?.motifRang).toEqual(['x == true', 'y == true'])
  })

  it('NON rendu quand seule la règle de repli `"default"` a matché (pas de motif clinique distinct)', () => {
    const a = opt('A', ['toujours'], {
      priorite: [
        { quand: 'ic == true', rang: 1 },
        { quand: 'default', rang: 3 },
      ],
    })
    const b = opt('B', ['toujours'], { priorite: 2 })
    const node = makeNode([a, b], [{ nom: 'ic', type: 'bool' }])
    const vue = construireVueDecision(node, { ic: false }) // seule "default" matche pour A
    const ovA = vue.familles[0].groupes.flat().find((ov) => ov.option === a)
    expect(ovA?.motifRang).toBeUndefined()
  })

  it('NON rendu quand la famille ne forme qu’UN SEUL groupe d’égalité (aucune concurrence de rang à expliquer)', () => {
    // Une seule option dans la famille : par construction un seul groupe (`groupesExAequo`), même si sa
    // priorité est conditionnelle et a matché une règle réelle — « pourquoi celle-ci d'abord » n'a pas
    // de sens quand elle n'est en concurrence avec personne (R6, condition de rendu du motif de rang).
    const a = opt('A', ['toujours'], {
      priorite: [
        { quand: 'ic == true', rang: 1 },
        { quand: 'default', rang: 3 },
      ],
    })
    const node = makeNode([a], [{ nom: 'ic', type: 'bool' }])
    const vue = construireVueDecision(node, { ic: true })
    const ovA = vue.familles[0].groupes.flat().find((ov) => ov.option === a)
    expect(ovA?.motifRang).toBeUndefined()
  })
})

describe('construireVueDecision — alertes PORTÉES PAR UNE OPTION (addendum GRAMMAIRE-NOEUD.md, R2/R3)', () => {
  // Cas réel qui motive ce mécanisme : une alerte de NŒUD sur « incrétine en cours ou envisagé »
  // s'affichait alors même que l'AR GLP‑1 venait d'être écarté. Une alerte d'OPTION, elle, ne peut
  // exister QUE sur un `OptionVue` — qui n'existe QUE pour les options APPLICABLES (`familles`) — donc
  // ne peut jamais s'afficher pour un geste que le moteur n'a pas retenu.
  it('une alerte d’option dont `quand` est vraie apparaît sur son `OptionVue`', () => {
    const alerteOption: Alerte = { quand: 'x == true', message: 'Alerte propre à A', niveau: 'attention' }
    const a = opt('A', ['toujours'], { alertes: [alerteOption] })
    const node = makeNode([a], [{ nom: 'x', type: 'bool' }])
    const vue = construireVueDecision(node, { x: true })
    const ov = vue.familles[0].groupes.flat().find((o) => o.option === a)
    expect(ov?.alertes).toEqual([alerteOption])
  })

  it('une alerte d’option dont `quand` est fausse n’apparaît pas', () => {
    const alerteOption: Alerte = { quand: 'x == true', message: 'Alerte propre à A' }
    const a = opt('A', ['toujours'], { alertes: [alerteOption] })
    const node = makeNode([a], [{ nom: 'x', type: 'bool' }])
    const vue = construireVueDecision(node, { x: false })
    const ov = vue.familles[0].groupes.flat().find((o) => o.option === a)
    expect(ov?.alertes).toEqual([])
  })

  it('la même alerte n’apparaît PAS si l’option n’est pas applicable — la propriété qui motive tout le mécanisme', () => {
    // `A` n'est applicable que si `present == true` ; son alerte propre, elle, ne dépend que de `x`.
    // Ici `present` est faux : `A` échoue sur sa condition (non retenue), son `OptionVue` n'existe donc
    // pas, quand bien même `x` (qui piloterait son alerte) est vrai — l'alerte ne peut apparaître nulle
    // part, ni dans les familles, ni dans `ecartees`/`nonRetenues` (qui ne portent pas d'alertes).
    const alerteOption: Alerte = { quand: 'x == true', message: 'Alerte propre à A' }
    const a = opt('A', ['present == true'], { alertes: [alerteOption] })
    const def = opt('Défaut', ['default'])
    const node = makeNode([a, def], [
      { nom: 'present', type: 'bool' },
      { nom: 'x', type: 'bool' },
    ])
    const vue = construireVueDecision(node, { present: false, x: true })
    expect(vue.familles[0].groupes.flat().map((ov) => ov.option.intitule)).toEqual(['Défaut'])
    const alertesAffichees = vue.familles[0].groupes.flat().flatMap((ov) => ov.alertes)
    expect(alertesAffichees).toEqual([])
    expect(vue.nonRetenues).toEqual([{ option: a, condition: 'present == true' }])
  })
})

describe('criteresPertinents — TEST VERROU (alertes d’option) : un critère qui ne change QUE l’alerte d’une option est vu DÉCISIF', () => {
  it('`w` ne change ni la sélection, ni le rang, ni le badge, ni les raisons de A — seulement `alertes` — et reste pourtant décisif', () => {
    const alerteOption: Alerte = { quand: 'w == true', message: 'Alerte propre à A', niveau: 'attention' }
    const a = opt('A', ['toujours'], { alertes: [alerteOption] })
    const node = makeNode([a], [{ nom: 'w', type: 'bool' }])

    const vueSansW = construireVueDecision(node, { w: false })
    const vueAvecW = construireVueDecision(node, { w: true })

    // Tout, hors `alertes`, est identique — le « verrou » : rien d'autre à l'écran ne signale `w`.
    const sansAlertesOption = (vue: ReturnType<typeof construireVueDecision>) => ({
      ...vue,
      familles: vue.familles.map((f) => ({
        ...f,
        groupes: f.groupes.map((g) =>
          g.map((ov) => ({
            option: ov.option,
            badge: ov.badge,
            reasons: ov.reasons,
            calculs: ov.calculs,
            motifRang: ov.motifRang,
          })),
        ),
      })),
    })
    expect(sansAlertesOption(vueSansW)).toEqual(sansAlertesOption(vueAvecW))

    expect(vueSansW.familles[0].groupes[0][0].alertes).toEqual([])
    expect(vueAvecW.familles[0].groupes[0][0].alertes).toEqual([alerteOption])
    expect(signatureVue(vueSansW)).not.toBe(signatureVue(vueAvecW))

    // ... et c'est précisément ce qui rend `w` DÉCISIF pour `engine/relevance.ts` : un critère qui ne
    // change QUE l'alerte d'une option doit être vu comme pertinent, pas estompé à tort.
    const pertinents = criteresPertinents(node, { w: false })
    expect(pertinents.has('w')).toBe(true)
  })
})

describe('construireVueDecision — `enAttente` (DECISIONS.md D20, SPEC-valeur-indeterminee.md §2.4/§2.5)', () => {
  it('renseignes absent (repli) : `enAttente` toujours vide, comportement historique inchangé', () => {
    const a = opt('A', ['DFG < 60'])
    const node = makeNode([a], [{ nom: 'DFG', type: 'nombre' }])
    const vue = construireVueDecision(node, { DFG: 45 })
    expect(vue.enAttente).toEqual([])
  })

  it("une option en attente porte les critères manquants dans `VueDecision.enAttente`, absente des familles affichées", () => {
    const a = opt('A', ['DFG < 60'])
    const node = makeNode([a], [{ nom: 'DFG', type: 'nombre' }])
    const vue = construireVueDecision(node, { DFG: 45 }, new Set())
    expect(vue.familles[0].groupes.flat()).toEqual([])
    expect(vue.enAttente).toEqual([{ option: a, manquants: ['DFG'] }])
  })

  it('`enAttente` entre dans `signatureVue` (totalité, comme `ecartees`/`nonRetenues`) : un critère qui ne change QUE cette dimension doit rester DÉCISIF', () => {
    const a = opt('A', ['DFG < 60'])
    const node = makeNode([a], [{ nom: 'DFG', type: 'nombre' }])
    const vueRenseigne = construireVueDecision(node, { DFG: 45 }, new Set(['DFG']))
    const vueEnAttente = construireVueDecision(node, { DFG: 45 }, new Set())
    expect(signatureVue(vueRenseigne)).not.toBe(signatureVue(vueEnAttente))
  })

  it("une dose calculée dont l'opérande est indéterminé ne s'affiche pas (D20 point 4, plus de « ≈ 0 »)", () => {
    const a = opt('Socle', ['toujours'], {
      calculs: [{ libelle: 'Dose', expression: 'poids * 0.1', unite: 'U' }],
    })
    const node = makeNode([a], [{ nom: 'poids', type: 'nombre' }])
    const vueIndetermine = construireVueDecision(node, { poids: 0 }, new Set())
    expect(vueIndetermine.familles[0].groupes[0][0].calculs).toEqual([])

    const vueRenseignee = construireVueDecision(node, { poids: 70 }, new Set(['poids']))
    expect(vueRenseignee.familles[0].groupes[0][0].calculs).toEqual([{ libelle: 'Dose', valeur: 7, unite: 'U' }])
  })

  /**
   * DÉFAUT J de la recette référent (2026-07-27). Le test juste au-dessus fige le comportement CORRECT
   * — une dose non calculable n'est pas affichée. Ce qui manquait est ce que la carte dit ALORS : rien.
   * Le praticien voyait « Initier une insuline basale » sans aucune dose, sans savoir qu'un poids la
   * ferait apparaître.
   *
   * Le critère manquant était pourtant DÉJÀ réclamé — vérifié avant de coder : `poids` est bien
   * `pertinent` et bien dans `decisifsAConfirmer`. Le correctif ne touche donc pas le moteur : il
   * rétablit le LIEN entre le champ marqué dans le formulaire et la carte qui l'attend.
   */
  it('nomme les doses NON calculables et le champ qui les débloque (défaut J)', () => {
    const a = opt('Initier', ['toujours'], {
      calculs: [
        { libelle: 'Dose initiale (0,1 U/kg)', expression: 'poids * 0.1', unite: 'U/j' },
        { libelle: 'Dose initiale (0,2 U/kg)', expression: 'poids * 0.2', unite: 'U/j' },
      ],
    })
    const node = makeNode([a], [{ nom: 'poids', type: 'nombre' }])

    const sansPoids = construireVueDecision(node, { poids: 0 }, new Set())
    const carte = sansPoids.familles[0].groupes[0][0]
    expect(carte.calculs).toEqual([])
    expect(carte.calculsEnAttente).toEqual([
      { libelle: 'Dose initiale (0,1 U/kg)', criteresManquants: ['poids'] },
      { libelle: 'Dose initiale (0,2 U/kg)', criteresManquants: ['poids'] },
    ])

    // Poids renseigné : plus rien en attente, et les deux doses s'affichent.
    const avecPoids = construireVueDecision(node, { poids: 70 }, new Set(['poids']))
    expect(avecPoids.familles[0].groupes[0][0].calculsEnAttente).toEqual([])
    expect(avecPoids.familles[0].groupes[0][0].calculs).toHaveLength(2)
  })

  it('ne réclame RIEN en repli `renseignes` absent — aucune indétermination n’existe alors', () => {
    // Garde-fou de non-régression : tout le chantier D20 tient sur la promesse qu'un appelant qui ne
    // passe pas `renseignes` garde le comportement historique, à l'identique.
    const a = opt('Initier', ['toujours'], {
      calculs: [{ libelle: 'Dose', expression: 'poids * 0.1', unite: 'U' }],
    })
    const node = makeNode([a], [{ nom: 'poids', type: 'nombre' }])
    const vue = construireVueDecision(node, { poids: 70 })
    expect(vue.familles[0].groupes[0][0].calculsEnAttente).toEqual([])
  })

  it("une alerte d'option dont le `quand` est indéterminé ne s'affiche pas", () => {
    const alerteOption: Alerte = { quand: 'DFG < 30', message: 'Alerte rénale' }
    const a = opt('Socle', ['toujours'], { alertes: [alerteOption] })
    const node = makeNode([a], [{ nom: 'DFG', type: 'nombre' }])
    const vueIndetermine = construireVueDecision(node, { DFG: 20 }, new Set())
    expect(vueIndetermine.familles[0].groupes[0][0].alertes).toEqual([])

    const vueRenseignee = construireVueDecision(node, { DFG: 20 }, new Set(['DFG']))
    expect(vueRenseignee.familles[0].groupes[0][0].alertes).toEqual([alerteOption])
  })
})

/**
 * T-059 (P8 · S3, 2026-07-30) — `calculsEnAttente` doit entrer dans `signatureVue` au même titre que
 * `calculs` (totalité, docstring de tête). Reproduit le « Défaut net » de la recette référent (N11,
 * `docs/decision/validation/recette-praticien-naif-2026-07-30.md`) : sur `insuline.yaml`, l'option
 * « Optimiser la répartition du basal-bolus » calcule `"Dose totale quotidienne"` par
 * `dose_basale_actuelle + dose_rapide_actuelle` — DEUX critères. Tant qu'un SEUL des deux est renseigné,
 * le calcul reste IMPOSSIBLE dans tous les cas (`calculs` reste vide, AUCUN changement visible sur cette
 * dimension déjà sérialisée) — mais la liste des critères qui MANQUENT ENCORE (`calculsEnAttente`), elle,
 * change bel et bien selon LEQUEL des deux est déjà répondu. Avant ce correctif, cette dimension n'entrait
 * pas dans `signatureVue` : `engine/relevance.ts` ne voyait donc AUCUNE différence entre « rien de
 * renseigné » et « un seul des deux champs renseigné », et concluait à tort que CHACUN des deux champs de
 * dose était « sans effet sur la reco actuelle » — alors que la carte, elle, réclamait déjà nommément le
 * champ manquant restant (« Doses non calculées — à renseigner : … »). C'est la contradiction « qui croire
 * de l'écran ou de l'écran » relevée en N11.
 */
describe('signatureVue — T-059 : `calculsEnAttente` entre dans la signature de vue', () => {
  // Même expression que le calcul réel d'`insuline.yaml` (« Dose totale quotidienne »,
  // `dose_basale_actuelle + dose_rapide_actuelle`) — deux critères `nombre`, aucune borne déclarée ici
  // (non nécessaire pour ce test, qui ne perturbe pas via le banc mais compare directement des `renseignes`).
  const socle = opt('Optimiser', ['toujours'], {
    calculs: [{ libelle: 'Dose totale quotidienne', expression: 'dose_basale_actuelle + dose_rapide_actuelle', unite: 'U/j' }],
  })
  const node = makeNode(
    [socle],
    [
      { nom: 'dose_basale_actuelle', type: 'nombre' },
      { nom: 'dose_rapide_actuelle', type: 'nombre' },
    ],
  )
  // Valeurs quelconques (non nulles) : seul `renseignes` (D20) pilote l'indétermination ici, jamais la
  // valeur stockée — cf. `evaluerNombre`/`effectifs`, déjà vérifié par les tests « défaut J » ci-dessus.
  const criteria = { dose_basale_actuelle: 10, dose_rapide_actuelle: 8 }

  it('rien de renseigné vs seule `dose_basale_actuelle` renseignée : `calculs` reste VIDE dans les DEUX cas, mais `calculsEnAttente` nomme un critère manquant différent', () => {
    const vueRien = construireVueDecision(node, criteria, new Set())
    const vueBasaleSeule = construireVueDecision(node, criteria, new Set(['dose_basale_actuelle']))
    const carteRien = vueRien.familles[0].groupes[0][0]
    const carteBasale = vueBasaleSeule.familles[0].groupes[0][0]
    // La dimension DÉJÀ sérialisée avant ce correctif ne bouge pas — le défaut n'est pas là.
    expect(carteRien.calculs).toEqual([])
    expect(carteBasale.calculs).toEqual([])
    // La dimension QUI MANQUAIT, elle, diffère bien : deux critères manquants d'un côté, un seul de l'autre.
    expect(carteRien.calculsEnAttente).toEqual([
      { libelle: 'Dose totale quotidienne', criteresManquants: ['dose_basale_actuelle', 'dose_rapide_actuelle'] },
    ])
    expect(carteBasale.calculsEnAttente).toEqual([
      { libelle: 'Dose totale quotidienne', criteresManquants: ['dose_rapide_actuelle'] },
    ])
  })

  it('LE DÉFAUT (verrou) : ces deux vues, qui ne diffèrent QUE par `calculsEnAttente`, produisent désormais des signatures DIFFÉRENTES', () => {
    const vueRien = construireVueDecision(node, criteria, new Set())
    const vueBasaleSeule = construireVueDecision(node, criteria, new Set(['dose_basale_actuelle']))
    // Rien d'autre ne bouge (même option, même badge, mêmes raisons) — seule `calculsEnAttente` diffère ;
    // avant ce correctif, `signatureVue` des deux vues était donc IDENTIQUE.
    expect(vueRien.familles[0].groupes[0][0].badge).toBe(vueBasaleSeule.familles[0].groupes[0][0].badge)
    expect(vueRien.familles[0].groupes[0][0].reasons).toEqual(vueBasaleSeule.familles[0].groupes[0][0].reasons)
    expect(signatureVue(vueRien)).not.toBe(signatureVue(vueBasaleSeule))
  })

  it('`criteresPertinents` (engine/relevance.ts) voit désormais CHACUN des deux champs de dose comme DÉCISIF quand l’autre seul est renseigné — conforme au profil N11, plus « sans effet » sur un champ que la carte réclame déjà', () => {
    const pertinentsRienRenseigne = criteresPertinents(node, criteria, new Set())
    expect(pertinentsRienRenseigne.has('dose_basale_actuelle')).toBe(true)
    expect(pertinentsRienRenseigne.has('dose_rapide_actuelle')).toBe(true)
  })
})

/**
 * T-068 (P9 · S1, 2026-07-30) — l'ÉTAT des contre-indications remonte jusqu'au modèle de vue, et entre
 * dans `signatureVue` au même titre que les autres dimensions affichées (totalité, docstring de tête).
 *
 * POURQUOI CETTE DIMENSION DOIT Y ENTRER. Une contre-indication qui se désamorce ne change NI l'option
 * retenue, NI son badge, NI son rang, NI ses raisons : sur toutes les dimensions déjà sérialisées, les
 * deux vues sont identiques. Sans ce lot, le critère qui commande la contre-indication (ex. `DFG`) serait
 * donc vu « sans effet sur la reco » par `engine/relevance.ts` et estompé dans le formulaire — pendant
 * que la carte, elle, afficherait bel et bien un avertissement de moins. Exactement la contradiction
 * « qui croire, de l'écran ou de l'écran » déjà rencontrée sur `calculsEnAttente` (T-059, ci-dessus).
 */
describe('construireVueDecision / signatureVue — T-068 : état des contre-indications', () => {
  const optionAvecCi = (contreIndications: Option['contre_indications']) =>
    opt('Metformine', ['toujours'], { contre_indications: contreIndications })

  it('`OptionVue.contreIndications` porte le texte ET l’état, pour les deux formes de contenu', () => {
    const option = optionAvecCi(['Alcoolisme.', { texte: 'Insuffisance rénale sévère.', condition: 'DFG < 30' }])
    const node = makeNode([option], [{ nom: 'DFG', type: 'nombre' }])

    expect(construireVueDecision(node, { DFG: 90 }).familles[0].groupes[0][0].contreIndications).toEqual([
      { texte: 'Alcoolisme.', etat: 'active' },
      { texte: 'Insuffisance rénale sévère.', etat: 'levee' },
    ])
    expect(construireVueDecision(node, { DFG: 20 }).familles[0].groupes[0][0].contreIndications).toEqual([
      { texte: 'Alcoolisme.', etat: 'active' },
      { texte: 'Insuffisance rénale sévère.', etat: 'active' },
    ])
  })

  it('D20 : sur un critère NON renseigné, l’état est `indetermine` — jamais `levee`', () => {
    const option = optionAvecCi([{ texte: 'Insuffisance rénale sévère.', condition: 'DFG < 30' }])
    const node = makeNode([option], [{ nom: 'DFG', type: 'nombre' }])
    const vue = construireVueDecision(node, { DFG: 90 }, new Set())
    expect(vue.familles[0].groupes[0][0].contreIndications).toEqual([
      { texte: 'Insuffisance rénale sévère.', etat: 'indetermine' },
    ])
  })

  it('LE VERROU : deux vues qui ne diffèrent QUE par l’état d’une contre-indication ont des signatures DIFFÉRENTES', () => {
    const option = optionAvecCi([{ texte: 'Insuffisance rénale sévère.', condition: 'DFG < 30' }])
    const node = makeNode([option], [{ nom: 'DFG', type: 'nombre' }])
    const vueActive = construireVueDecision(node, { DFG: 20 })
    const vueLevee = construireVueDecision(node, { DFG: 90 })

    // Rien d'autre ne bouge : même option, même badge, mêmes raisons, mêmes doses.
    expect(vueActive.familles[0].groupes[0][0].badge).toBe(vueLevee.familles[0].groupes[0][0].badge)
    expect(vueActive.familles[0].groupes[0][0].reasons).toEqual(vueLevee.familles[0].groupes[0][0].reasons)
    expect(signatureVue(vueActive)).not.toBe(signatureVue(vueLevee))
  })

  it('`criteresPertinents` voit le critère d’une contre-indication comme DÉCISIF (il ne sera plus estompé à tort)', () => {
    const option = optionAvecCi([{ texte: 'Insuffisance rénale sévère.', condition: 'DFG < 30' }])
    const node = makeNode([option], [{ nom: 'DFG', type: 'nombre', min: 5, max: 120 }])
    expect(criteresPertinents(node, { DFG: 90 }).has('DFG')).toBe(true)
  })

  it('NON-RÉGRESSION : sur un contenu SANS `condition`, la signature ne porte AUCUN segment de contre-indication', () => {
    // Cette propriété n'est pas cosmétique : c'est elle qui garantit que le golden master de
    // caractérisation (`engine/banc/__snapshots__/`, qui liste des `signatureVue` complètes) reste byte à
    // byte identique tant qu'aucun nœud n'encode de contre-indication conditionnelle.
    const node = makeNode([optionAvecCi(['Alcoolisme.', { texte: 'Grossesse.' }])])
    expect(signatureVue(construireVueDecision(node, {}))).not.toContain('‡')
    // ... et la signature est bien celle d'une option SANS contre-indication du tout : la dimension
    // n'existe dans la chaîne que lorsqu'un état s'écarte de `active`.
    expect(signatureVue(construireVueDecision(node, {}))).toBe(
      signatureVue(construireVueDecision(makeNode([opt('Metformine', ['toujours'])]), {})),
    )
  })
})

/**
 * Défaut I (recette navigateur du 2026-07-27) — « pourquoi pas d'autres options » pollué par le
 * hors-périmètre. Sur `prescription`, un patient voyait 18,7 lignes en moyenne, dont 60 % de la forme
 * « Traitements en cours comprend Sulfamide / Gliptine / Insuline… » chez quelqu'un qui n'en prend aucun.
 *
 * Le nettoyage vit dans la VUE et non dans le moteur : `EvaluateNodeResult.nonRetenues` reste exhaustif
 * (R4, et des vignettes référent en dépendent). Ces tests vérifient les deux traitements — remplacer
 * quand c'est possible, retirer sinon — et le fait que le moteur, lui, n'a pas bougé.
 */
describe('construireVueDecision — « pourquoi pas » nettoyé des constats de périmètre (défaut I)', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'traitements', type: 'liste', valeurs: ['sulfamide', 'gliptine'] },
    { nom: 'ascvd', type: 'bool' },
  ]

  const noeudAvec = (options: Option[]): Noeud => makeNode(options, CRITERES)

  it('RETIRE la ligne quand toutes les conditions fausses sont des tests de présence', () => {
    const horsSujet = opt('Remplacer le sulfamide', ['traitements contient sulfamide'])
    const vue = construireVueDecision(noeudAvec([horsSujet, opt('repli', ['default'])]), {
      traitements: [],
      ascvd: false,
    })
    expect(vue.nonRetenues.map((n) => n.option.intitule)).not.toContain('Remplacer le sulfamide')
  })

  it('REMPLACE par une condition plus parlante quand il en existe une', () => {
    // Le moteur retient la PREMIÈRE fausse (R4) — ici le test de présence. La vue montre l'autre.
    const deuxConditions = opt('Introduire un iSGLT2', ['traitements contient gliptine', 'ascvd == true'])
    const noeud = noeudAvec([deuxConditions, opt('repli', ['default'])])
    const criteria = { traitements: [], ascvd: false }
    expect(evaluateNode(noeud, criteria).nonRetenues.get(deuxConditions)).toBe('traitements contient gliptine')
    const vue = construireVueDecision(noeud, criteria)
    expect(vue.nonRetenues.find((n) => n.option === deuxConditions)?.condition).toBe('ascvd == true')
  })

  it('ne touche PAS à une condition clinique ordinaire', () => {
    const clinique = opt('Statine', ['ascvd == true'])
    const vue = construireVueDecision(noeudAvec([clinique, opt('repli', ['default'])]), {
      traitements: [],
      ascvd: false,
    })
    expect(vue.nonRetenues.find((n) => n.option === clinique)?.condition).toBe('ascvd == true')
  })

  it('un `ne_contient_pas` faux est aussi un constat de périmètre — « vous prenez déjà cette classe »', () => {
    const dejaPris = opt('Introduire une gliptine', ['traitements ne_contient_pas gliptine'])
    const vue = construireVueDecision(noeudAvec([dejaPris, opt('repli', ['default'])]), {
      traitements: ['gliptine'],
      ascvd: false,
    })
    expect(vue.nonRetenues.map((n) => n.option.intitule)).not.toContain('Introduire une gliptine')
  })

  it('le MOTEUR reste exhaustif — le nettoyage est une décision d’affichage, pas de sélection', () => {
    const horsSujet = opt('Remplacer le sulfamide', ['traitements contient sulfamide'])
    const noeud = noeudAvec([horsSujet, opt('repli', ['default'])])
    const criteria = { traitements: [], ascvd: false }
    // R4 : toute option non retenue a un motif ENREGISTRÉ, même si l'écran ne le montre pas.
    expect(evaluateNode(noeud, criteria).nonRetenues.get(horsSujet)).toBe('traitements contient sulfamide')
  })
})

/**
 * TEST VERROU (arbitrage référent A3, 2026-08-01) : l'ORDRE DES FAMILLES entre dans `signatureVue` au
 * même titre que les autres dimensions affichées (totalité, cf. docstring de tête de `vueDecision.ts`).
 * Construit un nœud où DEUX critères sont vrais À LA FOIS pour x=false ET x=true — chaque famille a
 * TOUJOURS une option applicable, donc le CONTENU de chaque section (badge, reasons, calculs…) ne
 * bouge JAMAIS avec `x` — seul l'ORDRE des sections change (`prioritaire_si` sur « F2 »). Si
 * `signatureVue` ignorait cet ordre, les deux vues produiraient la MÊME signature et `x` serait à tort
 * vu « sans effet sur la reco actuelle » par `engine/relevance.ts` — exactement le défaut que la
 * totalité de `signatureVue` existe pour empêcher (cf. les autres TEST VERROU de ce fichier).
 */
describe('signatureVue — TEST VERROU : l’ordre des familles (hissage `prioritaire_si`) entre dans la signature', () => {
  const a = opt('A', ['toujours'], { famille: 'F1' })
  const b = opt('B', ['toujours'], { famille: 'F2' })
  const node = makeNode([a, b], [{ nom: 'x', type: 'bool' }], {
    familles: [
      { libelle: 'F1', exclusive: false },
      { libelle: 'F2', exclusive: false, prioritaire_si: 'x == true' },
    ],
  })

  it('x=false et x=true : mêmes options, mêmes badges, MAIS ordre des familles différent → vues DIFFÉRENTES', () => {
    const vueFalse = construireVueDecision(node, { x: false })
    const vueTrue = construireVueDecision(node, { x: true })
    expect(vueFalse.familles.map((f) => f.libelle)).toEqual(['F1', 'F2'])
    expect(vueTrue.familles.map((f) => f.libelle)).toEqual(['F2', 'F1']) // hissée devant F1.
    // Même contenu : les deux mêmes options, avec le même badge, dans les deux vues (seule leur SECTION
    // d'appartenance change de position, jamais leur statut).
    const optionsFalse = vueFalse.familles.flatMap((f) => f.groupes.flat().map((ov) => [ov.option.intitule, ov.badge]))
    const optionsTrue = vueTrue.familles.flatMap((f) => f.groupes.flat().map((ov) => [ov.option.intitule, ov.badge]))
    expect(new Set(optionsFalse.map((p) => p.join('@')))).toEqual(new Set(optionsTrue.map((p) => p.join('@'))))
  })

  it('la signature diffère malgré un contenu identique — l’ordre est bien une dimension DE LA SIGNATURE', () => {
    const vueFalse = construireVueDecision(node, { x: false })
    const vueTrue = construireVueDecision(node, { x: true })
    expect(signatureVue(vueFalse)).not.toBe(signatureVue(vueTrue))
  })

  it('`criteresPertinents` voit `x` comme DÉCISIF — un critère qui ne change QUE l’ordre des familles ne doit jamais être estompé à tort au formulaire', () => {
    const pertinents = criteresPertinents(node, { x: false })
    expect(pertinents.has('x')).toBe(true)
  })
})

/**
 * T-202 (P15/S8, 2026-08-11) — `posologie_detail[].quand` : un item de posologie peut être CONDITIONNEL
 * au patient, et la liste des items RETENUS entre dans `signatureVue` au même titre que les autres
 * dimensions affichées (totalité, docstring de tête).
 *
 * POURQUOI CETTE DIMENSION DOIT Y ENTRER — c'est L'ASSERTION LA PLUS IMPORTANTE DE CETTE SESSION (S8.md,
 * « Décision clé »). Un `quand` qui ne pilote QUE la posologie affichée (aucune autre dimension déjà
 * sérialisée ne bouge — même option retenue, même badge, mêmes raisons, aucune contre-indication, aucune
 * alerte) ne change RIEN sur toutes les dimensions déjà sérialisées AVANT ce lot. Sans cette dimension,
 * le critère qui commande cet item serait donc vu « sans effet sur la reco » par `engine/relevance.ts` et
 * ESTOMPÉ À TORT dans le formulaire — le praticien ne le renseignerait pas, et la posologie affichée
 * resterait fausse. C'est le piège documenté comme récurrent, à sa CINQUIÈME occurrence (R6, encadré
 * « Même prérequis d'architecture », `docs/decision/GRAMMAIRE-NOEUD.md`), déjà payé sur les alertes
 * d'option, les calculs en attente, les contre-indications conditionnelles et la justification
 * situationnelle.
 */
describe('construireVueDecision / signatureVue — T-202 : items de posologie conditionnels (`quand`)', () => {
  const optionAvecPosologie = (posologie_detail: Option['posologie_detail']) =>
    opt('Insuline basale', ['toujours'], { posologie_detail })

  it('`OptionVue.posologieDetail` ne retient QUE les items dont le `quand` est vrai (ou absent)', () => {
    const option = optionAvecPosologie([
      'Titrer par paliers de 2 U.', // forme courte : toujours retenue
      { texte: 'Selon la courbe nocturne MCG.', quand: 'MCG_disponible == true' },
      { texte: 'Selon la glycémie à jeun (repli sans capteur).', quand: 'MCG_disponible == false' },
    ])
    const node = makeNode([option], [{ nom: 'MCG_disponible', type: 'bool' }])

    expect(
      construireVueDecision(node, { MCG_disponible: true }).familles[0].groupes[0][0].posologieDetail,
    ).toEqual(['Titrer par paliers de 2 U.', { texte: 'Selon la courbe nocturne MCG.', quand: 'MCG_disponible == true' }])
    expect(
      construireVueDecision(node, { MCG_disponible: false }).familles[0].groupes[0][0].posologieDetail,
    ).toEqual([
      'Titrer par paliers de 2 U.',
      { texte: 'Selon la glycémie à jeun (repli sans capteur).', quand: 'MCG_disponible == false' },
    ])
  })

  it('D20 : sur un critère NON renseigné, l’item est ÉCARTÉ — DISTINCT d’une contre-indication, jamais montré « indéterminé »', () => {
    const option = optionAvecPosologie([{ texte: 'Selon la courbe nocturne MCG.', quand: 'MCG_disponible == true' }])
    const node = makeNode([option], [{ nom: 'MCG_disponible', type: 'bool' }])
    const vue = construireVueDecision(node, { MCG_disponible: true }, new Set())
    expect(vue.familles[0].groupes[0][0].posologieDetail).toEqual([])
  })

  it('LE VERROU : deux vues qui ne diffèrent QUE par un item de posologie retenu/écarté ont des signatures DIFFÉRENTES', () => {
    const option = optionAvecPosologie([{ texte: 'Selon la courbe nocturne MCG.', quand: 'MCG_disponible == true' }])
    const node = makeNode([option], [{ nom: 'MCG_disponible', type: 'bool' }])
    const vueAvecItem = construireVueDecision(node, { MCG_disponible: true })
    const vueSansItem = construireVueDecision(node, { MCG_disponible: false })

    // Rien d'autre ne bouge : même option, même badge, mêmes raisons, mêmes contre-indications.
    expect(vueAvecItem.familles[0].groupes[0][0].badge).toBe(vueSansItem.familles[0].groupes[0][0].badge)
    expect(vueAvecItem.familles[0].groupes[0][0].reasons).toEqual(vueSansItem.familles[0].groupes[0][0].reasons)
    expect(signatureVue(vueAvecItem)).not.toBe(signatureVue(vueSansItem))
  })

  it('`criteresPertinents` (engine/relevance.ts) voit `MCG_disponible` comme DÉCISIF alors qu’il ne pilote QUE la posologie — l’assertion centrale de T-202', () => {
    const option = optionAvecPosologie([
      { texte: 'Selon la courbe nocturne MCG.', quand: 'MCG_disponible == true' },
      { texte: 'Selon la glycémie à jeun (repli sans capteur).', quand: 'MCG_disponible == false' },
    ])
    const node = makeNode([option], [{ nom: 'MCG_disponible', type: 'bool' }])
    // Vérifié au préalable : ce critère ne change ni l'option retenue, ni son badge, ni ses raisons —
    // AUCUNE des dimensions préexistantes à T-202 ne bouge avec `MCG_disponible`.
    const vueVrai = construireVueDecision(node, { MCG_disponible: true })
    const vueFaux = construireVueDecision(node, { MCG_disponible: false })
    expect(vueVrai.familles[0].groupes[0][0].badge).toBe(vueFaux.familles[0].groupes[0][0].badge)
    expect(vueVrai.familles[0].groupes[0][0].reasons).toEqual(vueFaux.familles[0].groupes[0][0].reasons)

    const pertinents = criteresPertinents(node, { MCG_disponible: true })
    expect(pertinents.has('MCG_disponible')).toBe(true)
  })

  it('NON-RÉGRESSION : sur un contenu SANS `quand`, la signature ne porte AUCUN segment de posologie conditionnelle', () => {
    // Cette propriété n'est pas cosmétique : c'est elle qui garantit que le golden master de
    // caractérisation (`engine/banc/__snapshots__/`, qui liste des `signatureVue` complètes) reste byte
    // à byte identique tant qu'aucun nœud n'encode de `quand` sur un item de posologie (T-202 livre le
    // MÉCANISME seul, cf. `plans/P15/S8.md` § Hors périmètre).
    const node = makeNode([optionAvecPosologie(['Titrer par paliers de 2 U.', { texte: 'Vérifier la fonction rénale.' }])])
    expect(signatureVue(construireVueDecision(node, {}))).not.toContain('∴')
    // ... et la signature est bien celle d'une option SANS aucune dimension de posologie conditionnelle :
    // la dimension n'existe dans la chaîne que lorsqu'au moins un item est effectivement écarté.
    expect(signatureVue(construireVueDecision(node, {}))).toBe(
      signatureVue(construireVueDecision(makeNode([opt('Insuline basale', ['toujours'])]), {})),
    )
  })
})
