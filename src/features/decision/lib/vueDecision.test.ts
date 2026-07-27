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
import { criteresPertinents } from '../engine/relevance.ts'
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
      synthese_critique: { donnee: '', references: [] },
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
    expect(ovA?.motifRang).toBe('ic == true')
    expect(ovB?.motifRang).toBeUndefined() // rang FIXE : jamais de motif conditionnel à exposer
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
