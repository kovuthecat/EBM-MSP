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
 * ARBITRAGE RÉFÉRENT DU 2026-07-29 — une option `role: securite` (D25) mise en avant ne porte PLUS
 * « Recommandée » mais un badge distinct (`'securite'`, « Mesure de sécurité »). Motif : « c'est le
 * meilleur choix parmi plusieurs » et « c'est ce qui reste quand le traitement habituel est écarté »
 * sont deux situations très différentes pour le praticien. Même précédent, même solution que D16.
 *
 * CE QUI NE CHANGE PAS, et chaque test ci-dessous en garde une part : QUELLES options sont mises en
 * avant, dans quel ordre, avec quel plafond — seule l'étiquette change. D'où le contre-exemple systématique
 * dans chaque cas (une option `geste` de la même famille garde `'recommandee'`).
 */
describe('computeBadges — badge dédié aux options `role: securite` (arbitrage référent 2026-07-29)', () => {
  it('repli historique : la 1re option non-socle est une carte de SÉCURITÉ → « securite », jamais « recommandee »', () => {
    const securite = opt('Interrompre le traitement (contre-indication)', ['a == true'], { role: 'securite' })
    const geste = opt('Introduire un agent', ['b == true'])
    const applicable = [securite, geste]
    const badges = computeBadges(famillesRepli(applicable, new Map()))
    expect(badges.get(securite)).toBe('securite')
    expect(badges.get(securite)).not.toBe('recommandee')
    // Non-régression : la carte de sécurité occupe bien la place mise en avant (elle est en tête) —
    // la suivante reste non badgée, exactement comme avant l'arbitrage.
    expect(badges.get(geste)).toBe(null)
  })

  it('repli historique : une option `geste` en tête garde « recommandee » (comportement INCHANGÉ), une `securite` derrière reste `null`', () => {
    const geste = opt('Introduire un agent', ['a == true'])
    const securite = opt('Interrompre le traitement (contre-indication)', ['b == true'], { role: 'securite' })
    const applicable = [geste, securite]
    const badges = computeBadges(famillesRepli(applicable, new Map()))
    expect(badges.get(geste)).toBe('recommandee')
    // Hors du groupe mis en avant : `null` comme avant — l'arbitrage ne badge PAS toutes les cartes de
    // sécurité, il renomme seulement le badge de celle qui en recevait déjà un.
    expect(badges.get(securite)).toBe(null)
  })

  it('famille CUMULABLE : la carte de sécurité porte « securite », le geste cumulable garde « recommandee »', () => {
    const securite = opt('Arrêter la metformine (DFG < 30)', ['default'], {
      famille: 'Cumulable',
      role: 'securite',
    })
    const geste = opt('Introduire un iSGLT2', ['default'], { famille: 'Cumulable' })
    const node = { options: [securite, geste], familles: [{ libelle: 'Cumulable', exclusive: false }] }
    const familles = groupesParFamille(node, [securite, geste], new Map())
    const badges = computeBadges(familles)
    expect(badges.get(securite)).toBe('securite')
    expect(badges.get(geste)).toBe('recommandee')
  })

  it('famille EXCLUSIVE : « securite » sur le groupe de tête, `null` hors tête (le plafond et l’ordre sont inchangés)', () => {
    const tete = opt('Tête (sécurité)', ['default'], { famille: 'Exclusive', role: 'securite' })
    const suivante = opt('Suivante (sécurité)', ['default'], { famille: 'Exclusive', role: 'securite' })
    const node = { options: [tete, suivante], familles: [{ libelle: 'Exclusive', exclusive: true }] }
    const rangs = new Map([
      [tete, 2],
      [suivante, 5],
    ])
    const familles = groupesParFamille(node, [tete, suivante], rangs)
    const badges = computeBadges(familles)
    expect(badges.get(tete)).toBe('securite')
    expect(badges.get(suivante)).toBe(null)
  })

  it('un socle reste « reco-officielle » (D16 inchangé) — `role` est une valeur unique, un socle n’est jamais `securite`', () => {
    const socle = opt('Metformine (socle) — poursuivre', ['toujours'])
    const securite = opt('Arrêter la metformine (DFG < 30)', ['a == true'], { role: 'securite' })
    const badges = computeBadges(famillesRepli([socle, securite], new Map()))
    expect(badges.get(socle)).toBe('reco-officielle')
    expect(badges.get(securite)).toBe('securite')
  })
})

/**
 * LE CAS RÉEL qui a motivé l'arbitrage (`statine`, profil D-03/D32 de la recette navigateur du
 * 2026-07-28, déjà caractérisé côté moteur par `engine/evaluateNode.statine.test.ts`) : maladie
 * athéromateuse établie + intolérance AVÉRÉE + statine pas encore en place, ancienneté du diabète et
 * autres FDRCV NON renseignés. Le parcours `ordered-first-match` fait halte sur « Discuter la statine »
 * (indéterminé) et n'atteint plus que la carte terminale `role: securite` — SEULE option applicable,
 * donc en tête, donc badgée. C'est ce badge-là que le référent a tranché.
 *
 * Nœud SANS `familles` déclarées ⇒ branche de REPLI de `computeBadges` : le cas se joue exactement sur la
 * règle historique D16, pas sur une famille fabriquée pour l'occasion.
 */
describe('computeBadges — cas réel (nœud `statine`, profil D-03/D32 : la seule carte applicable est une carte de sécurité)', () => {
  const node = getNoeudById('statine')
  if (!node) throw new Error('Nœud "statine" introuvable.')

  const RENSEIGNES = new Set([
    'age',
    'ASCVD_etablie',
    'diabete_complique',
    'dialyse',
    'statine_deja_en_place',
    'intolerance_statine',
    'CK_x_normale',
    // `anciennete_diabete_annees` et `autres_FDRCV` délibérément ABSENTS : c'est ce qui provoque la halte.
  ])

  function badgesPour(criteria: Criteria, renseignes?: ReadonlySet<string>) {
    const derived = calculerCriteresDerives(node!.criteres_entree, criteria)
    const res = evaluateNode(node!, derived, renseignes)
    return { res, badges: computeBadges(groupesParFamille(node!, res.applicable, res.rangs)) }
  }

  it('la carte terminale « Statine indisponible » (role: securite) porte « securite » et NON « Recommandée »', () => {
    const criteria = {
      ...buildDefaultCriteria(node.criteres_entree),
      age: 62,
      ASCVD_etablie: true,
      diabete_complique: false,
      dialyse: false,
      statine_deja_en_place: false,
      intolerance_statine: 'averee',
      CK_x_normale: 6,
    } as Criteria
    const { res, badges } = badgesPour(criteria, RENSEIGNES)

    const terminale = res.applicable.find((o) => o.intitule.includes('Statine indisponible'))
    expect(terminale).toBeDefined()
    // Prémisse du cas : c'est bien la SEULE carte affichée, donc celle qui reçoit la mise en avant.
    expect(res.applicable).toEqual([terminale])
    expect(terminale!.role).toBe('securite')
    expect(badges.get(terminale!)).toBe('securite')
    expect(badges.get(terminale!)).not.toBe('recommandee')
  })

  it('profil ORDINAIRE du même nœud (ASCVD établie, sans intolérance) : « Recommandée » est INCHANGÉ sur la carte `geste`', () => {
    const criteria = {
      ...buildDefaultCriteria(node.criteres_entree),
      age: 60,
      ASCVD_etablie: true,
      anciennete_diabete_annees: 8,
      autres_FDRCV: 1,
      diabete_complique: false,
      dialyse: false,
      statine_deja_en_place: false,
      intolerance_statine: 'non',
      CK_x_normale: 0,
    } as Criteria
    const { res, badges } = badgesPour(criteria)

    const haute = res.applicable.find((o) => o.intitule.includes('Statine de haute intensité'))
    expect(haute).toBeDefined()
    expect(haute!.role).toBe('geste')
    expect(badges.get(haute!)).toBe('recommandee')
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
        nature_intolerance: ['digestive'],
        DFG: 55,
        albuminurie: 'normo',
        insuffisance_cardiaque: false,
        ASCVD_etablie: false,
        IMC: 25,
        HbA1c_actuelle: 8,
        classes_a_benefice_indisponibles: false,
      }
      const { res, badges } = evaluerBadges(criteria)
      // Intitulés simplifiés (2026-08-04, demande utilisateur) : « AR GLP‑1 »/« iSGLT2 » nomment
      // désormais AUSSI l'introduction que la réduction/suspension de la même molécule — `action`
      // départage, même logique que `invariants.test.ts`/`evaluateNode.prescription.test.ts`.
      const reduireGLP1 = res.applicable.find((o) => o.intitule.startsWith('AR GLP') && o.action === 'reduire')
      // RETITRÉE le 2026-08-06 (P14/S8, T-171) : « iSGLT2 » (introduction) porte désormais l'action dans
      // le titre, cf. `prescription.yaml`.
      // RETITRÉE le 2026-08-09 (allègement des intitulés) : verbe retiré du titre (déjà porté par le
      // badge), `action` reste le discriminant.
      const isglt2 = res.applicable.find((o) => o.intitule === 'iSGLT2' && o.action === 'ajouter')
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
      // Intitulés simplifiés (2026-08-04, demande utilisateur) — `action` départage « Sulfamide » du
      // remplacement vs de la réduction/l'arrêt, même logique que le bloc précédent.
      // RETITRÉE le 2026-08-06 (P14/S6, T-169) : « Sulfamide » (remplacer) porte désormais l'action dans
      // le titre (désambiguïsation d'avec la place résiduelle, même intitulé nu) — `startsWith` sur le
      // radical commun plutôt que l'égalité stricte, comme les prédicats de `invariants.test.ts`.
      const remplacerSU = res.applicable.find((o) => o.intitule.startsWith('Sulfamide — remplacer') && o.action === 'remplacer')
      // RETITRÉE le 2026-08-06 (P14/S8, T-171), cf. commentaire du bloc précédent.
      // RETITRÉE le 2026-08-09 (allègement des intitulés) : verbe retiré du titre (déjà porté par le
      // badge), `action` reste le discriminant.
      const isglt2 = res.applicable.find((o) => o.intitule === 'iSGLT2' && o.action === 'ajouter')
      expect(remplacerSU).toBeDefined()
      expect(isglt2).toBeDefined()
      expect(res.rangs.get(remplacerSU!)).toBe(4)
      expect(res.rangs.get(isglt2!)).toBe(2)
      expect(badges.get(remplacerSU!)).toBe('recommandee')
      expect(badges.get(isglt2!)).toBe('recommandee')

      // Dans la famille exclusive « Le choix de l'agent », une option hors du groupe de tête (ex. la
      // gliptine de bas rang, applicable ici via `palette_glycemique_ouverte`) n'est PAS badgée.
      const familleAgent = familles.find((f) => f.libelle === "Le choix de l'agent")
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
