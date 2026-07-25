/**
 * Tests de `groupesExAequo` (S7-ui Lot 2/3 — remplacement de la signature « rangs bruts » par une
 * signature « groupes d'égalité », cf. docstring `evaluateNode.ts`/`relevance.ts`). Couvre :
 *  - le comportement pur de la fonction (regroupement, garde-fou rang infini) ;
 *  - le cas réel qui a motivé le correctif (nœud `prescription`, iSGLT2/AR GLP-1 à égalité par défaut,
 *    départagés par l'insuffisance cardiaque) ;
 *  - la non-régression de la signature de `relevance.ts` : un critère qui change un rang SANS jamais
 *    changer l'ordre ni les égalités affichées ne doit PAS être vu comme décisif (contrairement à
 *    l'ancienne signature « rang brut », trop sensible).
 */
import { describe, expect, it } from 'vitest'
import type { Noeud, Option } from '../content/node.types.ts'
import type { Criteria } from './conditions.ts'
import { calculerCriteresDerives } from './deriveCritere.ts'
import { evaluateNode, groupesExAequo, groupesParFamille } from './evaluateNode.ts'
import { getNoeudById } from '../content/loadNodes.ts'
import { buildDefaultCriteria } from '../lib/formLayout.ts'
import { criteresPertinents } from './relevance.ts'

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

/** Fabrique un nœud complet (schéma) autour d'options : seuls `criteres_entree`/`options` importent ici. */
function makeNode(options: Option[], criteresEntree: Noeud['criteres_entree'] = []): Noeud {
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
  }
}

describe('groupesExAequo — comportement pur', () => {
  it('regroupe des options consécutives de même rang FINI', () => {
    const a = opt('A', ['toujours'])
    const b = opt('B', ['toujours'])
    const c = opt('C', ['toujours'])
    const rangs = new Map([
      [a, 2],
      [b, 2],
      [c, 5],
    ])
    expect(groupesExAequo([a, b, c], rangs)).toEqual([[a, b], [c]])
  })

  it('un rang +Infinity (option sans `priorite`) n’est JAMAIS groupé, même partagé par plusieurs options', () => {
    const a = opt('A', ['toujours'])
    const b = opt('B', ['toujours'])
    const rangs = new Map([
      [a, Number.POSITIVE_INFINITY],
      [b, Number.POSITIVE_INFINITY],
    ])
    // Sans ce garde-fou, un nœud où AUCUNE option ne déclare `priorite` verrait toutes ses options
    // « à égalité » côte à côte — régression visuelle majeure sur tous les nœuds existants.
    expect(groupesExAequo([a, b], rangs)).toEqual([[a], [b]])
  })

  it('rangs différents et non consécutifs : chaque option est son propre groupe', () => {
    const a = opt('A', ['toujours'])
    const b = opt('B', ['toujours'])
    const rangs = new Map([
      [a, 1],
      [b, 2],
    ])
    expect(groupesExAequo([a, b], rangs)).toEqual([[a], [b]])
  })

  it('map de rangs vide (ordered-first-match) : chaque option applicable reste seule dans son groupe', () => {
    const a = opt('A', ['toujours'])
    expect(groupesExAequo([a], new Map())).toEqual([[a]])
  })
})

describe('groupesExAequo — cas réel (nœud `prescription`, recette référent S7-ui)', () => {
  const node = getNoeudById('prescription')
  if (!node) throw new Error('Nœud "prescription" introuvable.')

  // Profil de la recette référent : intention=initier, HbA1c 8.6, DFG 74, IMC 25, pas d'ASCVD, pas d'IC
  // → rien ne distingue iSGLT2 d'AR GLP-1 (rang « default » = 2 pour les deux). R1 (GRAMMAIRE-NOEUD.md) :
  // aucune indication d'organe ici, les deux options ne sont applicables que via `palette_glycemique_ouverte`
  // — `nettement_au_dessus` est, à l'initiation, la seule valeur qui l'ouvre (remplace l'ancien seuil
  // absolu HbA1c ≥ 8,5 % désormais relatif à l'objectif du patient).
  const PROFIL: Criteria = {
    ...buildDefaultCriteria(node.criteres_entree),
    intention: 'initier',
    position_vs_cible: 'nettement_au_dessus',
    HbA1c_actuelle: 8.6,
    DFG: 74,
    IMC: 25,
    albuminurie: 'normo',
    ASCVD_etablie: false,
    insuffisance_cardiaque: false,
  }

  function evaluer(criteria: Criteria) {
    const derived = calculerCriteresDerives(node!.criteres_entree, criteria)
    return evaluateNode(node!, derived)
  }

  it('sans insuffisance cardiaque : iSGLT2 et AR GLP-1 forment un groupe d’égalité de 2 membres', () => {
    const res = evaluer(PROFIL)
    const groupes = groupesExAequo(res.applicable, res.rangs)
    const groupeIsglt2 = groupes.find((g) => g.some((o) => o.intitule.includes('iSGLT2')))
    expect(groupeIsglt2).toBeDefined()
    expect(groupeIsglt2!.length).toBe(2)
    expect(groupeIsglt2!.some((o) => o.intitule.includes('GLP'))).toBe(true)
  })

  it('avec insuffisance cardiaque : les rangs divergent, l’égalité entre iSGLT2 et AR GLP-1 disparaît', () => {
    const res = evaluer({ ...PROFIL, insuffisance_cardiaque: true })
    const groupes = groupesExAequo(res.applicable, res.rangs)
    const groupeIsglt2 = groupes.find((g) => g.some((o) => o.intitule.includes('iSGLT2')))
    expect(groupeIsglt2).toBeDefined()
    // Le groupe contenant iSGLT2 ne contient plus AR GLP-1 : l'égalité a été rompue.
    expect(groupeIsglt2!.some((o) => o.intitule.includes('GLP'))).toBe(false)
  })
})

describe('relevance — non-régression de la signature « groupes d’égalité » (pas « rang brut »)', () => {
  // Deux options TOUJOURS applicables (leur applicabilité ne dépend pas de `y`) : seul leur RANG en
  // dépend, via une priorité conditionnelle. `y` fait passer A de rang 2 à rang 3, mais B reste à 5 :
  // aucune égalité n'apparaît ni ne disparaît, et l'ORDRE affiché (A puis B) ne change jamais. L'ancienne
  // signature « rang brut » (`intitulé@rang`) aurait vu 2→3 comme un changement et signalé `y` comme
  // décisif à tort ; la signature « groupes d'égalité » l'ignorait — CE QUI RESTE VRAI ici.
  const a = opt('A', ['toujours'], { priorite: [{ quand: 'y == true', rang: 3 }, { quand: 'default', rang: 2 }] })
  const b = opt('B', ['toujours'], { priorite: 5 })
  const node = makeNode([a, b], [{ nom: 'y', type: 'bool' }])

  // ⚠ ATTENTE INVERSÉE (R6 couche 2, `docs/decision/GRAMMAIRE-NOEUD.md` § « pourquoi à ce rang » —
  // motif de rang, tâche « justification situationnelle »). ANCIEN : `false` (ce test attendait `y`
  // non pertinent). NOUVEAU : `true`. Le mécanisme n'est PAS celui que ce test met en garde contre (la
  // sensibilité au rang BRUT) — les groupes d'égalité restent identiques dans les deux cas ([A],[B]),
  // exactement comme avant. Ce qui a changé est une AUTRE dimension, désormais affichée : le motif du
  // rang de A (`OptionVue.motifRang`). Ce nœud sans `familles` déclarées retombe sur une famille unique
  // à 2 groupes (≥ 2, la condition de rendu du motif) ; pour `y == false`, la règle retenue est le repli
  // `"default"` → pas de motif (`undefined`) ; pour `y == true`, la règle « y == true » matche → motif
  // = "y == true". La carte de A affiche donc réellement une ligne en plus quand `y` passe à vrai — ce
  // n'est plus une variation interne invisible, c'est une variation d'ÉCRAN, donc `y` est bien DÉCISIF
  // par construction de `signatureVue` (totale, cf. `lib/vueDecision.ts`). Non un retour du bug d'origine.
  it('« y » ne change ni l’ordre ni les égalités affichées, mais fait apparaître le motif de rang de A → pertinent', () => {
    const pertinents = criteresPertinents(node, { y: false })
    expect(pertinents.has('y')).toBe(true)
  })

  it('non-régression : un nœud sans aucune `priorite` déclarée ne produit aucun groupe d’égalité', () => {
    const sansPriorite = makeNode([opt('A', ['toujours']), opt('B', ['toujours'])])
    const res = evaluateNode(sansPriorite, {})
    const groupes = groupesExAequo(res.applicable, res.rangs)
    expect(groupes.every((g) => g.length === 1)).toBe(true)
  })
})

/**
 * Tests de `groupesParFamille` (correctif « priorité multi-natures », S7-ui 2026-07-25) : l'axe
 * `priorite` seul mélange des natures d'actes différentes (ex. « introduire un iSGLT2 » et « réduire la
 * posologie du sulfamide » peuvent partager un rang) — les rendre « à égalité » suggère à tort un choix
 * exclusif alors que ces gestes se CUMULENT. `Option.famille` confine désormais le calcul d'égalité à
 * l'intérieur d'une même famille clinique.
 */
describe('groupesParFamille — comportement pur (repli sans `Noeud.familles` déclarées)', () => {
  it('deux familles au même rang fini : jamais groupées ensemble', () => {
    const a = opt('A', ['toujours'], { famille: 'Famille 1' })
    const b = opt('B', ['toujours'], { famille: 'Famille 2' })
    const rangs = new Map([
      [a, 2],
      [b, 2],
    ])
    const familles = groupesParFamille({ options: [a, b] }, [a, b], rangs)
    expect(familles).toHaveLength(2)
    expect(familles[0]).toEqual({ libelle: 'Famille 1', groupes: [[a]], exclusive: undefined })
    expect(familles[1]).toEqual({ libelle: 'Famille 2', groupes: [[b]], exclusive: undefined })
  })

  it('même famille, même rang fini : toujours groupées ensemble (réutilise `groupesExAequo`)', () => {
    const a = opt('A', ['toujours'], { famille: 'Famille 1' })
    const b = opt('B', ['toujours'], { famille: 'Famille 1' })
    const rangs = new Map([
      [a, 2],
      [b, 2],
    ])
    expect(groupesParFamille({ options: [a, b] }, [a, b], rangs)).toEqual([
      { libelle: 'Famille 1', groupes: [[a, b]], exclusive: undefined },
    ])
  })

  it('repli : aucune option du nœud ne porte `famille` → une famille unique sans libellé, identique à `groupesExAequo` seul', () => {
    const a = opt('A', ['toujours'])
    const b = opt('B', ['toujours'])
    const c = opt('C', ['toujours'])
    const rangs = new Map([
      [a, 2],
      [b, 2],
      [c, 5],
    ])
    expect(groupesParFamille({ options: [a, b, c] }, [a, b, c], rangs)).toEqual([
      { libelle: undefined, groupes: [[a, b], [c]], exclusive: undefined },
    ])
  })

  it('familles dans l’ordre de PREMIÈRE apparition dans `applicable` (pas l’ordre alphabétique ni un autre tri)', () => {
    const a = opt('A', ['toujours'], { famille: 'Z' })
    const b = opt('B', ['toujours'], { famille: 'A' })
    const c = opt('C', ['toujours'], { famille: 'Z' })
    const rangs = new Map([
      [a, 1],
      [b, 2],
      [c, 3],
    ])
    const familles = groupesParFamille({ options: [a, b, c] }, [a, b, c], rangs)
    expect(familles.map((f) => f.libelle)).toEqual(['Z', 'A'])
  })
})

describe('groupesParFamille — `Noeud.familles` déclarées (ordre explicite + `exclusive`)', () => {
  it('ordre des sections = ordre du tableau `familles`, PAS l’ordre d’écriture des options', () => {
    // Options écrites dans l'ordre B, A : si l'ordre des sections dérivait encore de l'écriture, on
    // verrait ['B', 'A'] ; la déclaration explicite `familles` doit imposer ['A', 'B'].
    const b = opt('B', ['toujours'], { famille: 'Famille B' })
    const a = opt('A', ['toujours'], { famille: 'Famille A' })
    const rangs = new Map([
      [b, 1],
      [a, 1],
    ])
    const node = {
      options: [b, a],
      familles: [
        { libelle: 'Famille A', exclusive: true },
        { libelle: 'Famille B', exclusive: false },
      ],
    }
    const familles = groupesParFamille(node, [b, a], rangs)
    expect(familles.map((f) => f.libelle)).toEqual(['Famille A', 'Famille B'])
    expect(familles.find((f) => f.libelle === 'Famille A')?.exclusive).toBe(true)
    expect(familles.find((f) => f.libelle === 'Famille B')?.exclusive).toBe(false)
  })

  it('une famille déclarée sans option applicable pour ce patient ne s’affiche pas', () => {
    const a = opt('A', ['toujours'], { famille: 'Famille A' })
    const node = {
      options: [a],
      familles: [
        { libelle: 'Famille A', exclusive: true },
        { libelle: 'Famille vide', exclusive: false },
      ],
    }
    const familles = groupesParFamille(node, [a], new Map([[a, 1]]))
    expect(familles.map((f) => f.libelle)).toEqual(['Famille A'])
  })
})

describe('groupesParFamille — cas réel (nœud `prescription`, correctif « priorité multi-natures »)', () => {
  const node = getNoeudById('prescription')
  if (!node) throw new Error('Nœud "prescription" introuvable.')

  function evaluer(criteria: Criteria) {
    const derived = calculerCriteresDerives(node!.criteres_entree, criteria)
    return evaluateNode(node!, derived)
  }

  it(
    'iSGLT2 (famille « Agent à ajouter ») et réduction du sulfamide (famille « Alléger ») au même rang 2 : ' +
      'jamais dans le même groupe d’égalité, malgré le rang partagé',
    () => {
      // Sulfamide mal toléré (intolérance) + IC : deux gestes DIFFÉRENTS de nature, tous deux rang 2,
      // mais qui se CUMULENT (introduire une protection cardio-rénale ET réduire un agent mal toléré),
      // jamais un choix exclusif — exactement le défaut que `famille` corrige (cf. consigne de tâche).
      const criteria: Criteria = {
        ...buildDefaultCriteria(node.criteres_entree),
        intention: 'intensifier',
        traitements_en_cours: ['metformine', 'sulfamide'],
        intolerance_traitement: true,
        nature_intolerance: 'digestive',
        insuffisance_cardiaque: true,
        DFG: 70,
        albuminurie: 'normo',
        ASCVD_etablie: false,
        IMC: 27,
        HbA1c_actuelle: 8,
        classes_a_benefice_indisponibles: false,
      }
      const res = evaluer(criteria)
      const isglt2 = res.applicable.find((o) => o.intitule.includes('iSGLT2'))
      const reduireSU = res.applicable.find((o) => o.intitule.includes('Réduire la posologie du sulfamide'))
      expect(isglt2).toBeDefined()
      expect(reduireSU).toBeDefined()
      expect(res.rangs.get(isglt2!)).toBe(2)
      expect(res.rangs.get(reduireSU!)).toBe(2) // même rang BRUT que iSGLT2

      const familles = groupesParFamille(node, res.applicable, res.rangs)
      const familleIsglt2 = familles.find((f) => f.groupes.some((g) => g.includes(isglt2!)))
      const familleReduireSU = familles.find((f) => f.groupes.some((g) => g.includes(reduireSU!)))
      expect(familleIsglt2!.libelle).not.toBe(familleReduireSU!.libelle)
      // Aucun groupe d'égalité ne contient les deux options à la fois.
      expect(familles.every((f) => f.groupes.every((g) => !(g.includes(isglt2!) && g.includes(reduireSU!))))).toBe(
        true,
      )
    },
  )

  it('sans comorbidité (profil recette référent) : iSGLT2 et AR GLP-1 restent à égalité DANS la même famille « Agent à ajouter »', () => {
    // Reprend le profil de la recette référent (cf. describe ci-dessus, S7-ui Lot 2) : intention=initier,
    // HbA1c 8.6, DFG 74, IMC 25, pas d'ASCVD, pas d'IC → rien ne distingue iSGLT2 d'AR GLP-1.
    const criteria: Criteria = {
      ...buildDefaultCriteria(node.criteres_entree),
      intention: 'initier',
      position_vs_cible: 'nettement_au_dessus',
      HbA1c_actuelle: 8.6,
      DFG: 74,
      IMC: 25,
      albuminurie: 'normo',
      ASCVD_etablie: false,
      insuffisance_cardiaque: false,
    }
    const res = evaluer(criteria)
    const familles = groupesParFamille(node, res.applicable, res.rangs)
    const familleAgent = familles.find((f) => f.libelle === 'Agent à ajouter')
    expect(familleAgent).toBeDefined()
    expect(familleAgent!.exclusive).toBe(true)
    const groupeIsglt2 = familleAgent!.groupes.find((g) => g.some((o) => o.intitule.includes('iSGLT2')))
    expect(groupeIsglt2).toBeDefined()
    expect(groupeIsglt2!.length).toBe(2)
    expect(groupeIsglt2!.some((o) => o.intitule.includes('GLP'))).toBe(true)
  })

  it('non-régression du correctif précédent : `insuffisance_cardiaque` reste un critère PERTINENT sur ce profil', () => {
    // Cocher l'IC rompt l'égalité iSGLT2/AR GLP-1 (elle bascule dans le groupe « Agent à ajouter » avec un
    // rang différent) : l'écran change, donc `criteresPertinents` doit continuer à le signaler comme
    // décisif, même maintenant que la signature de `relevance.ts` passe par `groupesParFamille`.
    const criteria: Criteria = {
      ...buildDefaultCriteria(node.criteres_entree),
      intention: 'initier',
      position_vs_cible: 'nettement_au_dessus',
      HbA1c_actuelle: 8.6,
      DFG: 74,
      IMC: 25,
      albuminurie: 'normo',
      ASCVD_etablie: false,
      insuffisance_cardiaque: false,
    }
    const pertinents = criteresPertinents(node, criteria)
    expect(pertinents.has('insuffisance_cardiaque')).toBe(true)
  })
})

describe('groupesParFamille — non-régression sur un nœud réel SANS `famille` déclarée', () => {
  it('un nœud multi-options réel sans aucune `famille` (`insuline`) produit exactement la structure d’avant (famille unique sans libellé)', () => {
    const node = getNoeudById('insuline')
    if (!node) throw new Error('Nœud "insuline" introuvable.')
    expect(node.options.every((o) => o.famille == null)).toBe(true)

    const criteria = buildDefaultCriteria(node.criteres_entree)
    const derived = calculerCriteresDerives(node.criteres_entree, criteria)
    const res = evaluateNode(node, derived)
    const familles = groupesParFamille(node, res.applicable, res.rangs)

    expect(familles).toHaveLength(1)
    expect(familles[0].libelle).toBeUndefined()
    expect(familles[0].exclusive).toBeUndefined()
    expect(familles[0].groupes).toEqual(groupesExAequo(res.applicable, res.rangs))
  })
})

/**
 * L'ORDRE DES SECTIONS EST ÉDITORIAL, PAS CALCULÉ. Il suit l'ordre de déclaration des options du nœud
 * et doit donc être STRICTEMENT IDENTIQUE d'un patient à l'autre. Une première implémentation le
 * dérivait de `applicable` (déjà trié par rang) : comme une famille s'étale sur plusieurs rangs
 * (« alléger » du rang 1 au 4, « sécurité » du 1 au 3), les sections se réordonnaient selon le profil —
 * la même instabilité que celle corrigée sur le formulaire (« modifier un critère plus bas déplace des
 * blocs plus haut »). Ce test verrouille l'invariant sur des profils volontairement très différents.
 */
describe('ordre des sections — stable quel que soit le patient', () => {
  const node = getNoeudById('prescription')
  if (!node) throw new Error('Nœud "prescription" introuvable.')

  const profil = (surcharge: Criteria): Criteria => ({
    ...buildDefaultCriteria(node.criteres_entree),
    HbA1c_actuelle: 8,
    DFG: 80,
    IMC: 27,
    age: 60,
    albuminurie: 'normo',
    esperance_vie: 'longue',
    risque_hypoglycemie_schema: 'faible',
    ...surcharge,
  })

  const profils: Array<[string, Criteria]> = [
    ['initiation nue', profil({ intention: 'initier' })],
    ['initiation HbA1c élevée', profil({ intention: 'initier', HbA1c_actuelle: 9.5 })],
    [
      'intensification complexe (IC + ASCVD + gliptine/sulfamide + intolérance)',
      profil({
        intention: 'intensifier',
        traitements_en_cours: ['metformine', 'gliptine', 'sulfamide'],
        insuffisance_cardiaque: true,
        ASCVD_etablie: true,
        intolerance_traitement: true,
        nature_intolerance: 'digestive',
      }),
    ],
    ['insuffisance rénale sévère', profil({ intention: 'optimiser', traitements_en_cours: ['metformine', 'sulfamide'], DFG: 25 })],
    ['déprescription chez le fragile', profil({ intention: 'deprescrire', age: 84, fragilite: true, traitements_en_cours: ['insuline', 'sulfamide'] })],
  ]

  const sectionsDe = (criteria: Criteria) => {
    const res = evaluateNode(node, calculerCriteresDerives(node.criteres_entree, criteria))
    return groupesParFamille(node, res.applicable, res.rangs).map((f) => f.libelle)
  }

  /**
   * Ordre éditorial de référence = ordre EXPLICITE de `node.familles` (correctif « ordre accidentel »,
   * 2026-07-25) — plus une déduction de la 1re apparition dans `node.options`, précisément ce que ce
   * test verrouille : l'ordre est désormais une déclaration de contenu, indépendante de l'écriture.
   */
  if (!node.familles) throw new Error('Nœud "prescription" : `familles` attendu pour ce test.')
  const ordreDeclare: (string | undefined)[] = node.familles.map((f) => f.libelle)

  it.each(profils)('%s — les sections affichées respectent l’ordre déclaré', (_libelle, criteria) => {
    const sections = sectionsDe(criteria)
    // Sous-suite de l'ordre déclaré (les familles sans option applicable sont simplement absentes).
    expect(sections).toEqual(ordreDeclare.filter((f) => sections.includes(f)))
  })

  it('deux profils opposés ne réordonnent jamais les sections communes', () => {
    const a = sectionsDe(profils[2][1])
    const b = sectionsDe(profils[4][1])
    const communes = a.filter((f) => b.includes(f))
    expect(communes).toEqual(b.filter((f) => a.includes(f)))
  })
})
