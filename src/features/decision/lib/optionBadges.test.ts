import { describe, expect, it } from 'vitest'
import type { Option } from '../content/node.types.ts'
import { getNoeudById } from '../content/loadNodes.ts'
import { calculerCriteresDerives } from '../engine/deriveCritere.ts'
import type { Criteria } from '../engine/conditions.ts'
import { evaluateNode, groupesParFamille } from '../engine/evaluateNode.ts'
import { buildDefaultCriteria } from './formLayout.ts'
import { computeBadges } from './optionBadges.ts'

/**
 * `role` (A3) DÉRIVÉ ICI DES SENTINELLES, et c'est légitime dans ce fichier précis : ces options sont
 * synthétiques, elles n'existent que pour exercer `computeBadges`, et l'invariant I17 garantit sur le
 * CONTENU RÉEL que les deux ne peuvent pas diverger. Le dériver évite de réécrire vingt appels avec un
 * argument de plus, sans affaiblir la garantie — qui est portée par le banc, pas par ce fichier.
 * `extra.role` reste prioritaire pour les cas qui veulent le poser explicitement.
 */
function opt(intitule: string, conditions: string[], extra: Partial<Option> = {}): Option {
  const seule = conditions.length === 1 ? conditions[0] : undefined
  return {
    intitule,
    role: seule === 'toujours' ? 'socle' : seule === 'default' ? 'repli' : 'geste',
    conditions,
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
    ...extra,
  }
}

/**
 * Tests du repli HISTORIQUE (D16/S7-ui Lot 3) : nœud SANS `familles` déclarées, `groupesParFamille`
 * renvoie alors une famille unique `exclusive: undefined` et `computeBadges` doit reproduire EXACTEMENT
 * la règle d'origine (badge sur le groupe d'égalité contenant la 1re option non-socle). On construit ce
 * repli via `groupesParFamille({ options: applicable }, applicable, rangs)` (aucune option ne porte
 * `famille`, donc la branche repli s'active) plutôt que de fabriquer une `GroupeFamille` à la main : le
 * pipeline réel (mêmes fonctions que l'écran) est ainsi lui aussi couvert.
 */
function famillesRepli(applicable: Option[], rangs: Map<Option, number>) {
  return groupesParFamille({ options: applicable }, applicable, rangs)
}

describe('computeBadges — repli historique (nœud sans `familles` déclarées, D16)', () => {
  it('badge « reco-officielle » sur le socle « toujours », « recommandee » sur la 1re option non-socle', () => {
    const socle = opt('Metformine (socle) — poursuivre', ['toujours'])
    const ajout1 = opt('Ajout iSGLT2', ['a == true'])
    const ajout2 = opt('Ajout GLP-1', ['b == true'])
    const applicable = [socle, ajout1, ajout2]
    const badges = computeBadges(famillesRepli(applicable, new Map()))
    expect(badges.get(socle)).toBe('reco-officielle')
    expect(badges.get(ajout1)).toBe('recommandee')
    expect(badges.get(ajout2)).toBe(null)
  })

  it('sans socle « toujours » présent, la 1re option porte « recommandee » (comportement antérieur)', () => {
    const ajout1 = opt('A', ['a == true'])
    const ajout2 = opt('B', ['b == true'])
    const applicable = [ajout1, ajout2]
    const badges = computeBadges(famillesRepli(applicable, new Map()))
    expect(badges.get(ajout1)).toBe('recommandee')
    expect(badges.get(ajout2)).toBe(null)
  })

  it('un socle « toujours » seul (aucune autre option applicable) porte « reco-officielle », pas « recommandee »', () => {
    const socle = opt('Metformine (socle) — poursuivre', ['toujours'])
    const badges = computeBadges(famillesRepli([socle], new Map()))
    expect(badges.get(socle)).toBe('reco-officielle')
  })

  it('le socle n’est pas forcément en position 0 : la 1re option non-socle porte « recommandee » quelle que soit sa place', () => {
    const ajout = opt('Ajout', ['a == true'])
    const socle = opt('Socle', ['toujours'])
    // Ordre déjà trié par le moteur (ex. l'ajout a un rang inférieur au socle) : le socle est en 2e position.
    const applicable = [ajout, socle]
    const badges = computeBadges(famillesRepli(applicable, new Map()))
    expect(badges.get(ajout)).toBe('recommandee')
    expect(badges.get(socle)).toBe('reco-officielle')
  })

  it('deux options non-socle à égalité de rang (tête de liste) : les DEUX portent « recommandee », pas une seule (S7-ui Lot 3)', () => {
    const isglt2 = opt('Introduire un iSGLT2', ['default'])
    const glp1 = opt('Introduire un AR GLP-1', ['default'])
    const gliptine = opt('Gliptine (sitagliptine)', ['c == true'])
    // Rangs à égalité (2 et 2) pour les deux premières, rang moins bon (5) pour la 3e : reproduit le
    // défaut réel constaté en recette référent (nœud `prescription`, iSGLT2/AR GLP-1 par défaut).
    const applicable = [isglt2, glp1, gliptine]
    const rangs = new Map([
      [isglt2, 2],
      [glp1, 2],
      [gliptine, 5],
    ])
    const badges = computeBadges(famillesRepli(applicable, rangs))
    expect(badges.get(isglt2)).toBe('recommandee')
    expect(badges.get(glp1)).toBe('recommandee')
    expect(badges.get(gliptine)).toBe(null)
  })

  it('égalité rompue (rangs 2 et 3) : seule la 1re option non-socle porte « recommandee »', () => {
    const isglt2 = opt('Introduire un iSGLT2', ['default'])
    const glp1 = opt('Introduire un AR GLP-1', ['default'])
    const applicable = [isglt2, glp1]
    const rangs = new Map([
      [isglt2, 2],
      [glp1, 3],
    ])
    const badges = computeBadges(famillesRepli(applicable, rangs))
    expect(badges.get(isglt2)).toBe('recommandee')
    expect(badges.get(glp1)).toBe(null)
  })

  it('socle « toujours » + deux options non-socle à égalité de tête : le socle garde « reco-officielle », les deux autres « recommandee »', () => {
    const socle = opt('Metformine (socle) — poursuivre', ['toujours'])
    const isglt2 = opt('Introduire un iSGLT2', ['default'])
    const glp1 = opt('Introduire un AR GLP-1', ['default'])
    const applicable = [socle, isglt2, glp1]
    const rangs = new Map([
      [isglt2, 2],
      [glp1, 2],
    ])
    const badges = computeBadges(famillesRepli(applicable, rangs))
    expect(badges.get(socle)).toBe('reco-officielle')
    expect(badges.get(isglt2)).toBe('recommandee')
    expect(badges.get(glp1)).toBe('recommandee')
  })
})

describe('computeBadges — familles CUMULABLES (`exclusive: false`) : tout ce qui est affiché est à faire', () => {
  it('deux options cumulables à des rangs DIFFÉRENTS portent toutes deux « recommandee »', () => {
    const a = opt('A', ['default'], { famille: 'Cumulable' })
    const b = opt('B', ['default'], { famille: 'Cumulable' })
    const node = {
      options: [a, b],
      familles: [{ libelle: 'Cumulable', exclusive: false }],
    }
    const rangs = new Map([
      [a, 2],
      [b, 4],
    ])
    const familles = groupesParFamille(node, [a, b], rangs)
    const badges = computeBadges(familles)
    expect(badges.get(a)).toBe('recommandee')
    expect(badges.get(b)).toBe('recommandee')
  })

  it('une option socle « toujours » dans une famille cumulable garde « reco-officielle » (jamais « recommandee »)', () => {
    const socle = opt('Socle', ['toujours'], { famille: 'Cumulable' })
    const geste = opt('Geste', ['default'], { famille: 'Cumulable' })
    const node = { options: [socle, geste], familles: [{ libelle: 'Cumulable', exclusive: false }] }
    const familles = groupesParFamille(node, [socle, geste], new Map())
    const badges = computeBadges(familles)
    expect(badges.get(socle)).toBe('reco-officielle')
    expect(badges.get(geste)).toBe('recommandee')
  })
})

describe('computeBadges — familles EXCLUSIVES (`exclusive: true`) : badge réservé au groupe de tête', () => {
  it('option hors du groupe de tête : pas de badge', () => {
    const tete = opt('Tête', ['default'], { famille: 'Exclusive' })
    const suivante = opt('Suivante', ['default'], { famille: 'Exclusive' })
    const node = { options: [tete, suivante], familles: [{ libelle: 'Exclusive', exclusive: true }] }
    const rangs = new Map([
      [tete, 2],
      [suivante, 5],
    ])
    const familles = groupesParFamille(node, [tete, suivante], rangs)
    const badges = computeBadges(familles)
    expect(badges.get(tete)).toBe('recommandee')
    expect(badges.get(suivante)).toBe(null)
  })

  it('deux options à égalité de tête : les deux portent « recommandee »', () => {
    const a = opt('A', ['default'], { famille: 'Exclusive' })
    const b = opt('B', ['default'], { famille: 'Exclusive' })
    const node = { options: [a, b], familles: [{ libelle: 'Exclusive', exclusive: true }] }
    const rangs = new Map([
      [a, 2],
      [b, 2],
    ])
    const familles = groupesParFamille(node, [a, b], rangs)
    const badges = computeBadges(familles)
    expect(badges.get(a)).toBe('recommandee')
    expect(badges.get(b)).toBe('recommandee')
  })
})

/**
 * Scénarios sur le VRAI contenu (`getNoeudById('prescription')`) — décision référent « le badge, c'est
 * le PLAN » (2026-07-25) : « Recommandée » désigne tout ce qu'il faut faire, pas un vainqueur unique.
 * Deux gestes de natures différentes (une famille cumulable, une famille exclusive) doivent tous deux
 * porter le badge, même à des rangs `priorite` différents — le défaut que corrige `Noeud.familles`.
 */
describe('computeBadges — cas réel (nœud `prescription`, « le badge, c’est le plan »)', () => {
  const node = getNoeudById('prescription')
  if (!node) throw new Error('Nœud "prescription" introuvable.')

  function evaluerBadges(criteria: Criteria) {
    const derived = calculerCriteresDerives(node!.criteres_entree, criteria)
    const res = evaluateNode(node!, derived)
    const familles = groupesParFamille(node!, res.applicable, res.rangs)
    return { res, familles, badges: computeBadges(familles) }
  }

  it(
    'AR GLP-1 mal toléré + indication rénale : « Réduire la posologie de l’AR GLP-1 » (cumulable) ET ' +
      '« Introduire un iSGLT2 » (exclusif, tête) portent TOUS DEUX « recommandee »',
    () => {
      const criteria: Criteria = {
        ...buildDefaultCriteria(node.criteres_entree),
        intention: 'intensifier',
        traitements_en_cours: ['aGLP1'],
        intolerance_traitement: true,
        nature_intolerance: 'digestive',
        DFG: 55,
        albuminurie: 'normo',
        insuffisance_cardiaque: false,
        ASCVD_etablie: false,
        IMC: 25,
        HbA1c_actuelle: 8,
        classes_a_benefice_indisponibles: false,
      }
      const { res, badges } = evaluerBadges(criteria)
      const reduireGLP1 = res.applicable.find((o) => o.intitule.includes("Réduire la posologie de l'AR GLP"))
      const isglt2 = res.applicable.find((o) => o.intitule.includes('Introduire un iSGLT2'))
      expect(reduireGLP1).toBeDefined()
      expect(isglt2).toBeDefined()
      expect(badges.get(reduireGLP1!)).toBe('recommandee')
      expect(badges.get(isglt2!)).toBe('recommandee')
    },
  )

  it(
    '« Remplacer le sulfamide » (rang 4, cumulable) et « Introduire un iSGLT2 » (rang 2, exclusif — tête) : ' +
      'rangs DIFFÉRENTS, familles DIFFÉRENTES, tous deux badgés (le défaut corrigé — auparavant seul le ' +
      'rang le plus favorable global l’emportait)',
    () => {
      const criteria: Criteria = {
        ...buildDefaultCriteria(node.criteres_entree),
        intention: 'intensifier',
        // R1 (GRAMMAIRE-NOEUD.md) : la gliptine résiduelle testée ci-dessous n'a ICI aucune autre
        // indication — son applicabilité dépend ENTIÈREMENT de `palette_glycemique_ouverte`, donc de
        // `position_vs_cible` (plus de `intention` seule).
        position_vs_cible: 'au_dessus',
        traitements_en_cours: ['metformine', 'sulfamide'],
        hypoglycemie_recente: false,
        HbA1c_actuelle: 8,
        insuffisance_cardiaque: true,
        DFG: 70,
        albuminurie: 'normo',
        ASCVD_etablie: false,
        IMC: 27,
        classes_a_benefice_indisponibles: false,
      }
      const { res, familles, badges } = evaluerBadges(criteria)
      const remplacerSU = res.applicable.find((o) => o.intitule.includes('Remplacer le sulfamide'))
      const isglt2 = res.applicable.find((o) => o.intitule.includes('Introduire un iSGLT2'))
      expect(remplacerSU).toBeDefined()
      expect(isglt2).toBeDefined()
      expect(res.rangs.get(remplacerSU!)).toBe(4)
      expect(res.rangs.get(isglt2!)).toBe(2)
      expect(badges.get(remplacerSU!)).toBe('recommandee')
      expect(badges.get(isglt2!)).toBe('recommandee')

      // Dans la famille exclusive « Agent à ajouter », une option hors du groupe de tête (ex. la
      // gliptine de bas rang, applicable ici via `palette_glycemique_ouverte`) n'est PAS badgée.
      const familleAgent = familles.find((f) => f.libelle === 'Agent à ajouter')
      expect(familleAgent).toBeDefined()
      expect(familleAgent!.exclusive).toBe(true)
      const horsTete = res.applicable.find(
        (o) => o.intitule.includes('Gliptine') && !familleAgent!.groupes[0]?.includes(o),
      )
      expect(horsTete).toBeDefined()
      expect(badges.get(horsTete!)).toBe(null)
    },
  )
})
