/**
 * Banc du repli d'affichage (`lib/replierAffichage.ts`, dette « plafond d'affichage » levée le 2026-07-27).
 *
 * L'INVARIANT QUE CE FICHIER PROTÈGE tient en une phrase : **rien ne se perd**. Le repli est la seule
 * pièce de l'écran capable de faire disparaître une option de la vue d'un prescripteur ; chaque test
 * ci-dessous vérifie donc, en plus de son propos, que la réunion des deux partitions redonne l'entrée
 * exactement — même nombre d'options, mêmes intitulés.
 */
import { describe, expect, it } from 'vitest'
import { partitionnerAffichage, SEUIL_REPLI } from './replierAffichage.ts'
import type { FamilleVue, OptionVue } from './vueDecision.ts'
import type { Option } from '../content/node.types.ts'

/** `OptionVue` minimale : seuls `option.intitule` et `rang` comptent pour la partition. */
function opt(intitule: string, rang: number | undefined): OptionVue {
  return {
    option: { intitule, conditions: [] } as unknown as Option,
    badge: null,
    reasons: [],
    calculs: [],
    motifRang: undefined,
    alertes: [],
    rang,
  }
}

/** Une famille par libellé, chaque option dans son propre groupe d'égalité (le cas le plus courant). */
function famille(libelle: string | undefined, ...options: OptionVue[]): FamilleVue {
  return { libelle, exclusive: false, groupes: options.map((o) => [o]) }
}

const titres = (familles: FamilleVue[]) =>
  familles.flatMap((f) => f.groupes.flat()).map((v) => v.option.intitule)

/** Contrôle systématique : la partition est une PARTITION, pas un filtre. */
function verifierConservation(entree: FamilleVue[], p: ReturnType<typeof partitionnerAffichage>) {
  expect([...titres(p.principales), ...titres(p.repliees)].sort()).toEqual(titres(entree).sort())
  expect(p.nbRepliees).toBe(titres(p.repliees).length)
}

describe('replierAffichage — partitionnerAffichage', () => {
  it('replie tout ce qui n’est pas au meilleur rang, et compte exactement', () => {
    const familles = [
      famille('Boissons', opt('A', 1), opt('B', 3)),
      famille('Portions', opt('C', 4), opt('D', 1), opt('E', 6)),
    ]
    const p = partitionnerAffichage({ familles })
    expect(titres(p.principales)).toEqual(['A', 'D'])
    expect(titres(p.repliees).sort()).toEqual(['B', 'C', 'E'])
    expect(p.nbRepliees).toBe(3)
    verifierConservation(familles, p)
  })

  it('jette les familles VIDÉES par la partition, des deux côtés', () => {
    // Sans ce filtre, l'écran afficherait un titre de famille suivi de rien — « Boissons » puis le vide
    // dans le repli, « Portions » puis le vide au-dessus.
    // 4 options : le seuil doit être ATTEINT, sinon la partition ne se déclenche pas et le test ne teste
    // rien (première rédaction de ce test : 3 options, il passait pour la mauvaise raison).
    const familles = [famille('Boissons', opt('A', 1), opt('D', 1)), famille('Portions', opt('B', 5), opt('C', 5))]
    const p = partitionnerAffichage({ familles })
    expect(p.principales.map((f) => f.libelle)).toEqual(['Boissons'])
    expect(p.repliees.map((f) => f.libelle)).toEqual(['Portions'])
    verifierConservation(familles, p)
  })

  it('ne replie RIEN en dessous du seuil, même si les rangs diffèrent', () => {
    const familles = [famille('Boissons', opt('A', 1), opt('B', 9))]
    const p = partitionnerAffichage({ familles })
    expect(p.nbRepliees).toBe(0)
    expect(titres(p.principales)).toEqual(['A', 'B'])
    verifierConservation(familles, p)
  })

  it('replie dès que le seuil est ATTEINT (borne exacte, pas approchée)', () => {
    const sous = [famille('F', ...Array.from({ length: SEUIL_REPLI - 1 }, (_, i) => opt(`o${i}`, i === 0 ? 1 : 5)))]
    const au = [famille('F', ...Array.from({ length: SEUIL_REPLI }, (_, i) => opt(`o${i}`, i === 0 ? 1 : 5)))]
    expect(partitionnerAffichage({ familles: sous }).nbRepliees).toBe(0)
    expect(partitionnerAffichage({ familles: au }).nbRepliees).toBeGreaterThan(0)
  })

  it('ne replie RIEN quand toutes les options sont au même rang', () => {
    // Le contenu les déclare équivalentes : en cacher une partie inventerait une hiérarchie qu'il ne pose pas.
    const familles = [famille('F', opt('A', 2), opt('B', 2), opt('C', 2), opt('D', 2), opt('E', 2))]
    const p = partitionnerAffichage({ familles })
    expect(p.nbRepliees).toBe(0)
    verifierConservation(familles, p)
  })

  it('ne replie RIEN quand aucun rang n’est défini (nœud en ordered-first-match, D11)', () => {
    const familles = [famille(undefined, opt('A', undefined), opt('B', undefined), opt('C', undefined), opt('D', undefined))]
    const p = partitionnerAffichage({ familles })
    expect(p.nbRepliees).toBe(0)
    verifierConservation(familles, p)
  })

  it('traite une option SANS rang comme prioritaire — le doute ne cache jamais', () => {
    // Sens sûr : mieux vaut une option de trop visible qu'une option de trop cachée.
    const familles = [famille('F', opt('A', 1), opt('SANS', undefined), opt('C', 5), opt('D', 5))]
    const p = partitionnerAffichage({ familles })
    expect(titres(p.principales)).toEqual(['A', 'SANS'])
    expect(titres(p.repliees)).toEqual(['C', 'D'])
    verifierConservation(familles, p)
  })

  it('préserve les groupes d’égalité à l’intérieur d’une famille', () => {
    // Deux options ex aequo doivent rester dans le MÊME groupe après partition, sinon l'écran perdrait
    // la mention « à égalité » qui les relie.
    const familles: FamilleVue[] = [
      { libelle: 'F', exclusive: false, groupes: [[opt('A', 1), opt('B', 1)], [opt('C', 4)], [opt('D', 4)]] },
    ]
    const p = partitionnerAffichage({ familles })
    expect(p.principales[0].groupes).toEqual([[opt('A', 1), opt('B', 1)]])
    expect(p.principales[0].groupes[0]).toHaveLength(2)
    expect(p.nbRepliees).toBe(2)
    verifierConservation(familles, p)
  })
})
