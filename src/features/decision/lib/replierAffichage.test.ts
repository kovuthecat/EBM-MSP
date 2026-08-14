/**
 * Banc du plafond d'affichage (`lib/replierAffichage.ts`, K5 — décision référent du 2026-07-27).
 *
 * L'INVARIANT QUE CE FICHIER PROTÈGE tient en une phrase : **rien ne se perd**. Ce module est la seule
 * pièce de l'écran capable de faire disparaître une option de la vue d'un prescripteur — et il l'a déjà
 * fait, sur une carte d'insuline d'initiation chez un patient en état catabolique (cf. la docstring du
 * module). Chaque test vérifie donc, en plus de son propos, que la réunion des deux partitions redonne
 * l'entrée exactement.
 *
 * Le second bloc rejoue le défaut d'origine et vérifie qu'il ne peut plus se produire — non parce que le
 * tri a changé, mais parce que la carte de sécurité est désormais PROTÉGÉE par sa déclaration (A3).
 */
import { describe, expect, it } from 'vitest'
import { plafonnerPistes, PLAFOND_PISTES } from './replierAffichage.ts'
import type { FamilleVue, OptionVue } from './vueDecision.ts'
import type { Option, RoleOption } from '../content/node.types.ts'

interface Forme {
  role?: RoleOption
  rang?: number
  motifs?: number
  contreIndications?: string[]
  alertes?: number
}

/** `OptionVue` minimale : seuls le rôle, le rang, le nombre de motifs et la charge de sécurité comptent. */
function opt(intitule: string, forme: Forme = {}): OptionVue {
  return {
    option: {
      intitule,
      role: forme.role ?? 'geste',
      conditions: [],
      contre_indications: forme.contreIndications,
    } as unknown as Option,
    badge: null,
    reasons: Array.from({ length: forme.motifs ?? 0 }, (_, i) => `motif ${i}`),
    calculs: [],
    calculsEnAttente: [],
    motifRang: undefined,
    alertes: Array.from({ length: forme.alertes ?? 0 }, () => ({ quand: 'x', message: 'alerte' })),
    rang: forme.rang,
    // T-068 (P9) : `OptionVue` porte désormais les contre-indications ÉVALUÉES. `plafonnerPistes` ne les
    // lit pas (il lit `option.contre_indications`, le champ de contenu — cf. `estRepliable`), on reflète
    // donc simplement ici l'état par défaut de toute contre-indication non conditionnelle : ACTIVE.
    contreIndications: (forme.contreIndications ?? []).map((texte) => ({ texte, etat: 'active' as const })),
    // T-202 (P15/S8) : `OptionVue` porte désormais les items de posologie déjà filtrés par `quand`.
    // `plafonnerPistes` ne les lit pas (aucune de ses règles ne porte sur la posologie) — vide, comme
    // `calculs`/`calculsEnAttente` ci-dessus.
    posologieDetail: [],
  }
}

/** Une famille par libellé, chaque option dans son propre groupe d'égalité (le cas le plus courant). */
function famille(libelle: string | undefined, ...options: OptionVue[]): FamilleVue {
  return { libelle, exclusive: false, groupes: options.map((o) => [o]) }
}

const titres = (familles: FamilleVue[]) =>
  familles.flatMap((f) => f.groupes.flat()).map((v) => v.option.intitule)

/** Contrôle systématique : la partition est une PARTITION, pas un filtre. */
function verifierConservation(entree: FamilleVue[], p: ReturnType<typeof plafonnerPistes>) {
  expect([...titres(p.principales), ...titres(p.repliees)].sort()).toEqual(titres(entree).sort())
  expect(p.nbRepliees).toBe(titres(p.repliees).length)
}

/** `n` gestes ordinaires, tous équivalents — le cas le plus fréquent sur les nœuds RHD. */
function gestes(n: number, motifs = 1): OptionVue[] {
  return Array.from({ length: n }, (_, i) => opt(`geste ${i}`, { motifs }))
}

describe('plafonnerPistes — le plafond lui-même', () => {
  it('ne replie RIEN tant que le plafond n’est pas dépassé (borne exacte)', () => {
    const familles = [famille('F', ...gestes(PLAFOND_PISTES))]
    const p = plafonnerPistes(familles.length ? { familles } : { familles })
    expect(p.nbRepliees).toBe(0)
    verifierConservation(familles, p)
  })

  it('replie le surplus dès la première carte au-delà, et compte exactement', () => {
    const familles = [famille('F', ...gestes(PLAFOND_PISTES + 3))]
    const p = plafonnerPistes({ familles })
    expect(p.nbRepliees).toBe(3)
    expect(titres(p.principales)).toHaveLength(PLAFOND_PISTES)
    verifierConservation(familles, p)
  })

  it('jette les familles VIDÉES par la partition, des deux côtés', () => {
    const familles = [famille('A', ...gestes(6)), famille('B', opt('seul', { motifs: 9 }))]
    const p = plafonnerPistes({ familles })
    // « seul » a 9 motifs : il reste devant, sa famille survit ; la famille A perd des cartes sans dispa-
    // raître. Aucune famille vide ne doit subsister d'un côté ou de l'autre.
    for (const f of [...p.principales, ...p.repliees]) expect(f.groupes.length).toBeGreaterThan(0)
    verifierConservation(familles, p)
  })

  it('préserve les groupes d’égalité à l’intérieur d’une famille', () => {
    const a = opt('a', { motifs: 5 })
    const b = opt('b', { motifs: 5 })
    const familles: FamilleVue[] = [{ libelle: 'F', exclusive: true, groupes: [[a, b], ...gestes(6).map((g) => [g])] }]
    const p = plafonnerPistes({ familles })
    expect(p.principales[0].groupes[0].map((v) => v.option.intitule)).toEqual(['a', 'b'])
    verifierConservation(familles, p)
  })
})

describe('plafonnerPistes — ce qui ne peut JAMAIS être replié', () => {
  it.each([['socle'], ['securite'], ['repli']] as const)(
    'une option de rôle « %s » reste dépliée, même sans aucun motif satisfait',
    (role) => {
      const protegee = opt('protégée', { role, motifs: 0 })
      const familles = [famille('F', protegee, ...gestes(8, 3))]
      const p = plafonnerPistes({ familles })
      expect(titres(p.principales)).toContain('protégée')
      expect(titres(p.repliees)).not.toContain('protégée')
      verifierConservation(familles, p)
    },
  )

  it('une carte portant une CONTRE-INDICATION reste dépliée, même déclarée « geste »', () => {
    // Second garde-fou, volontairement redondant avec le rôle : si un futur contenu déclare `geste` une
    // carte qui porte un fait de sécurité, elle reste visible quand même (D21).
    const avecCI = opt('avec contre-indication', { motifs: 0, contreIndications: ['DFG < 30'] })
    const familles = [famille('F', avecCI, ...gestes(8, 3))]
    const p = plafonnerPistes({ familles })
    expect(titres(p.repliees)).not.toContain('avec contre-indication')
    verifierConservation(familles, p)
  })

  it('une carte portant une ALERTE D’OPTION active reste dépliée, même déclarée « geste »', () => {
    const avecAlerte = opt('avec alerte', { motifs: 0, alertes: 1 })
    const familles = [famille('F', avecAlerte, ...gestes(8, 3))]
    const p = plafonnerPistes({ familles })
    expect(titres(p.repliees)).not.toContain('avec alerte')
    verifierConservation(familles, p)
  })

  it('ne replie RIEN si AUCUNE carte n’est repliable, même très au-delà du plafond', () => {
    const familles = [famille('F', ...Array.from({ length: 9 }, (_, i) => opt(`sécurité ${i}`, { role: 'securite' })))]
    const p = plafonnerPistes({ familles })
    expect(p.nbRepliees).toBe(0)
    verifierConservation(familles, p)
  })

  it('les protégées CONSOMMENT les places : au-delà du plafond, tout le repliable est replié', () => {
    // 6 cartes de sécurité occupent déjà plus que le plafond — aucune place ne reste pour un geste.
    const familles = [
      famille('S', ...Array.from({ length: 6 }, (_, i) => opt(`sécurité ${i}`, { role: 'securite' }))),
      famille('G', ...gestes(3)),
    ]
    const p = plafonnerPistes({ familles })
    expect(p.nbRepliees).toBe(3)
    expect(titres(p.principales)).toHaveLength(6) // les 6 protégées, aucune évincée
    verifierConservation(familles, p)
  })
})

describe('plafonnerPistes — l’ordre de sélection, et sa limite assumée', () => {
  it('garde les cartes qui satisfont le PLUS de motifs (critère référent)', () => {
    const familles = [
      famille('F', opt('un motif', { motifs: 1 }), opt('trois motifs', { motifs: 3 }), ...gestes(5, 2)),
    ]
    const p = plafonnerPistes({ familles })
    expect(titres(p.principales)).toContain('trois motifs')
    expect(titres(p.repliees)).toContain('un motif')
    verifierConservation(familles, p)
  })

  it('départage à motifs égaux par le RANG déclaré', () => {
    const remplissage = Array.from({ length: 5 }, (_, i) => opt(`remplissage ${i}`, { motifs: 2, rang: 2 }))
    const familles = [
      famille('F', opt('rang 6', { motifs: 2, rang: 6 }), opt('rang 1', { motifs: 2, rang: 1 }), ...remplissage),
    ]
    const p = plafonnerPistes({ familles })
    expect(titres(p.repliees)).toContain('rang 6')
    expect(titres(p.principales)).toContain('rang 1')
    verifierConservation(familles, p)
  })

  it('une option SANS rang est classée en DERNIER — divergence assumée avec l’ancien module', () => {
    // L'ancienne partition traitait l'absence de rang comme prioritaire (« le doute ne cache jamais »),
    // en supposant le cas théorique. Il ne l'est pas : le banc en compte 33 sur `rhd-alimentation` et
    // 6912 sur `rhd-activite-physique`. Et le MOTEUR, lui, leur donne déjà `+Infinity`
    // (`groupesParFamille`) : les traiter comme prioritaires à l'affichage contredirait le tri qui a servi
    // à les grouper. La règle change donc de sens — ce qui n'est acceptable QUE parce que le repli ne
    // fait plus disparaître de carte de sécurité (rôle + charge de sécurité, tests ci-dessus). C'était
    // l'inverse quand l'ancienne règle a été écrite.
    const remplissage = Array.from({ length: 5 }, (_, i) => opt(`remplissage ${i}`, { motifs: 2, rang: 3 }))
    const familles = [famille('F', opt('sans rang', { motifs: 2 }), ...remplissage)]
    const p = plafonnerPistes({ familles })
    expect(titres(p.repliees)).toEqual(['sans rang'])
    verifierConservation(familles, p)
  })

  it('à motifs ET rang égaux, coupe dans l’ordre du contenu — arbitraire ASSUMÉ, jamais silencieux', () => {
    // C'est la limite MESURÉE du critère référent : sur `rhd-alimentation`, 95 % des cartes n'ont qu'un
    // seul motif satisfait et la frontière à la 5e place n'est nette que dans ~40 % des profils. Le coût
    // d'un mauvais départage est UN CLIC, jamais une piste invisible — c'est ce que ce test verrouille.
    const familles = [famille('F', ...gestes(8, 1))]
    const p = plafonnerPistes({ familles })
    expect(titres(p.principales)).toEqual(['geste 0', 'geste 1', 'geste 2', 'geste 3', 'geste 4'])
    expect(titres(p.repliees)).toEqual(['geste 5', 'geste 6', 'geste 7'])
    verifierConservation(familles, p)
  })
})

describe('plafonnerPistes — le défaut du 2026-07-27 ne peut plus se produire', () => {
  it('un socle au rang 0 ne replie plus la carte de sécurité de rang 1', () => {
    // REJOUE le contre-exemple exact : 58 ans, metformine + sulfamide, cétonémie confirmée, ASCVD,
    // insuffisance cardiaque, HbA1c 9. L'ancienne partition par MEILLEUR RANG faisait du socle (rang 0)
    // le seul rang déplié et repliait « Insuline d'initiation » (rang 1), la réponse de sécurité.
    // Ce qui protège désormais cette carte n'est pas son rang — c'est sa DÉCLARATION (A3).
    const socle = opt('Metformine (socle du traitement)', { role: 'socle', rang: 0 })
    const securite = opt("Insuline d'initiation (état catabolique)", { role: 'securite', rang: 1 })
    const familles = [famille('Socle', socle), famille('Sécurité', securite), famille('Ajout', ...gestes(6, 1))]
    const p = plafonnerPistes({ familles })
    expect(titres(p.principales)).toContain("Insuline d'initiation (état catabolique)")
    expect(titres(p.principales)).toContain('Metformine (socle du traitement)')
    verifierConservation(familles, p)
  })
})
