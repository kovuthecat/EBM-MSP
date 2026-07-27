/**
 * Banc du repli d'affichage (`lib/replierAffichage.ts`, dette « plafond d'affichage » levée le 2026-07-27).
 *
 * L'INVARIANT QUE CE FICHIER PROTÈGE tient en une phrase : **rien ne se perd**. Le repli est la seule
 * pièce de l'écran capable de faire disparaître une option de la vue d'un prescripteur ; chaque test
 * ci-dessous vérifie donc, en plus de son propos, que la réunion des deux partitions redonne l'entrée
 * exactement — même nombre d'options, mêmes intitulés.
 */
import { readFileSync } from 'node:fs'
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
    calculsEnAttente: [],
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

/**
 * NON-RÉGRESSION DE SÉCURITÉ — ajoutée le 2026-07-27 (soir), après qu'une passe adversariale a démontré
 * que le repli livré quelques heures plus tôt CACHAIT une carte de sécurité sur le nœud `prescription`.
 *
 * Ce que le défaut a appris, et que ces tests figent : la recette écrivait « les cartes de sécurité sont
 * toutes au rang 1, donc dépliées par construction ». C'était faux — le socle metformine porte
 * `priorite: 0` avec une condition « toujours ». `Math.min` en faisait le meilleur rang, et tout le reste,
 * y compris le rang 1, passait derrière le bouton.
 *
 * La cause de fond est un glissement de sens : `priorite` a été écrit comme un ordre de TRI (D13/D14),
 * puis utilisé comme une porte d'AFFICHAGE. Rang 0 n'y signifie pas « le plus important » mais « socle ».
 * Aucun contenu du domaine n'avait été relu à cette aune.
 */
describe('replierAffichage — le piège du rang 0 (défaut avéré du 2026-07-27)', () => {
  it('reproduit le défaut : un socle au rang 0 replie TOUT le reste, rang 1 de sécurité compris', () => {
    // Reproduction fidèle de la structure de `prescription` pour un patient en état catabolique :
    // un socle « toujours » au rang 0, et la réponse de sécurité au rang 1.
    const familles = [
      famille('Socle', opt('Metformine — socle du traitement', 0)),
      famille('À faire d’emblée — sécurité', opt('Insuline d’initiation — état catabolique', 1)),
      famille('Agent à ajouter', opt('Tirzépatide', 4), opt('Remplacer le sulfamide', 4)),
    ]
    const p = partitionnerAffichage({ familles })
    // Le défaut, tel qu'il était : une seule carte dépliée, la carte de sécurité repliée.
    expect(titres(p.principales)).toEqual(['Metformine — socle du traitement'])
    expect(titres(p.repliees)).toContain('Insuline d’initiation — état catabolique')
    verifierConservation(familles, p)
  })

  it('l’écran ne replie plus rien tant que la question de fond n’est pas tranchée', () => {
    // GARDE-FOU DE PORTÉE. `partitionnerAffichage` reste une fonction correcte et testée — c'est son
    // USAGE qui était mal fondé. Le repli est donc neutralisé DANS L'ÉCRAN
    // (`screens/DecisionNodeScreen.tsx`, constante `REPLI_ACTIF`), pas ici.
    // Ce test lit le source de l'écran : si quelqu'un réactive le repli sans avoir répondu à la question
    // « quel signal du contenu dit qu'une carte ne peut pas être repliée ? », il tombe.
    const source = readFileSync('src/features/decision/screens/DecisionNodeScreen.tsx', 'utf-8')
    expect(source).toContain('const REPLI_ACTIF = false')
  })
})
