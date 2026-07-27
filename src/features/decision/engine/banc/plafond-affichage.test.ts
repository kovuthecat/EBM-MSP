/**
 * Banc d'un nœud — COUCHE 3 « invariants », lot **affichage**.
 *
 * I18 — **le plafond d'affichage (K5) ne cache jamais un fait de sécurité, et ne vide jamais l'écran.**
 *
 * POURQUOI CET INVARIANT EXISTE, ET POURQUOI SUR LES NŒUDS RÉELS. Le repli d'affichage est la seule pièce
 * de cette application qui puisse faire DISPARAÎTRE une conduite des yeux d'un prescripteur — et il l'a
 * déjà fait, le 2026-07-27 au matin : chez un patient en cétonémie confirmée, l'écran n'affichait que
 * « Metformine, socle du traitement » et repliait « Insuline d'initiation (état catabolique) ». Le module
 * a été neutralisé le soir même, puis réactivé sur un signal entièrement différent (`Option.role`, A3).
 *
 * `lib/replierAffichage.test.ts` couvre déjà la MÉCANIQUE, sur des vues synthétiques. Ce fichier couvre
 * ce qu'aucun test synthétique ne peut couvrir : le comportement sur le CONTENU RÉEL des six nœuds, avec
 * les rôles réellement déclarés et les cartes réellement produites. C'est la différence entre « la
 * fonction est correcte » et « son usage l'est » — la distinction exacte que le défaut d'origine avait
 * mise en défaut (le module était juste, c'est son USAGE qui était mal fondé).
 *
 * TROIS PROPRIÉTÉS, dans l'ordre de gravité :
 *  1. rien ne se perd — `principales ∪ repliees` est exactement l'entrée ;
 *  2. aucune carte repliée ne porte de contre-indication, d'alerte d'option, ni un rôle protégé ;
 *  3. l'écran n'est jamais VIDE — au moins une carte reste dépliée dès qu'il y en avait une.
 *
 * Le test ne connaît ni nœud ni critère par son nom (D8) : rôles et charges de sécurité sont lus sur le
 * contenu chargé.
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import { construireVueDecision } from '../../lib/vueDecision.ts'
import { plafonnerPistes } from '../../lib/replierAffichage.ts'
import { calculerCriteresDerives } from '../deriveCritere.ts'
import { genererProfils, tailleBanc } from './profils.ts'

/** Profils par nœud : le défaut visé est structurel, mais il faut assez de patients pour que les nœuds
 * riches dépassent réellement le plafond (mesuré : `rhd-alimentation` sort jusqu'à 14 cartes). */
const PROFILS = 300

/** Rempli par le premier `it.each`, relu par le garde-fou global en fin de fichier. */
const profilsPlafonnesParNoeud = new Map<string, number>()

describe('I18 — le plafond d’affichage ne cache jamais un fait de sécurité', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))(
    'nœud %s',
    (_id, node) => {
      const manquements: string[] = []
      let profilsPlafonnes = 0

      for (const criteria of genererProfils(node, Math.min(PROFILS, tailleBanc(node)))) {
        const vue = construireVueDecision(node, calculerCriteresDerives(node.criteres_entree, criteria))
        const avant = vue.familles.flatMap((f) => f.groupes.flat())
        const { principales, repliees, nbRepliees } = plafonnerPistes(vue)
        const apres = [...principales, ...repliees].flatMap((f) => f.groupes.flat())

        // (1) RIEN NE SE PERD.
        if (apres.length !== avant.length) {
          manquements.push(`partition non conservatrice : ${avant.length} cartes en entrée, ${apres.length} en sortie`)
        }
        if (nbRepliees !== repliees.flatMap((f) => f.groupes.flat()).length) {
          manquements.push('le compte annoncé sur le bouton ne correspond pas au nombre de cartes repliées')
        }

        if (nbRepliees > 0) profilsPlafonnes++

        for (const vueOption of repliees.flatMap((f) => f.groupes.flat())) {
          const o = vueOption.option
          // (2) AUCUN FAIT DE SÉCURITÉ REPLIÉ — les trois canaux de D21, plus le rôle déclaré (A3).
          if (o.role !== 'geste') {
            manquements.push(`carte de rôle « ${o.role} » repliée : « ${o.intitule} »`)
          }
          if ((o.contre_indications ?? []).length > 0) {
            manquements.push(`carte portant une contre-indication repliée : « ${o.intitule} »`)
          }
          if (vueOption.alertes.length > 0) {
            manquements.push(`carte portant une alerte d'option ACTIVE repliée : « ${o.intitule} »`)
          }
        }

        // (3) L'ÉCRAN N'EST JAMAIS VIDE.
        const restantes = principales.flatMap((f) => f.groupes.flat()).length
        if (avant.length > 0 && restantes === 0) {
          manquements.push('toutes les cartes ont été repliées — écran vide')
        }
      }

      expect([...new Set(manquements)]).toEqual([])
      profilsPlafonnesParNoeud.set(node.id, profilsPlafonnes)
    },
    120_000,
  )

  /**
   * GARDE-FOU DU GARDE-FOU. Les trois propriétés ci-dessus sont toutes vraies, trivialement, d'un plafond
   * qui ne replie jamais rien. Sans cette assertion, désactiver le repli rendrait I18 vert — c'est-à-dire
   * exactement l'état dans lequel le module a passé la journée du 2026-07-27, et personne ne l'aurait su.
   * On exige donc qu'AU MOINS UN nœud ait réellement dépassé le plafond sur des patients du banc.
   * Volontairement formulé globalement et non par nœud : `statine` et `cible-glycemique` sont en
   * `ordered-first-match` (une carte, jamais de plafond), et les exiger tomberait à faux.
   */
  it('le plafond s’exerce réellement — au moins un nœud dépasse sur des patients du banc', () => {
    const total = [...profilsPlafonnesParNoeud.values()].reduce((a, b) => a + b, 0)
    expect(profilsPlafonnesParNoeud.size).toBe(noeuds.length)
    expect(total).toBeGreaterThan(0)
  })
})
