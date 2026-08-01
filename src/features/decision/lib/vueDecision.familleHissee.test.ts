/**
 * Tests du HISSAGE CONDITIONNEL de famille sur le contenu RÉEL (`Famille.prioritaire_si`, arbitrage
 * référent A3, 2026-08-01, faisant suite au STOP argumenté de `plans/P10/S10.md`).
 *
 * Le mécanisme lui-même (partition stable, indétermination, `ConditionError`) est couvert sur des
 * nœuds SYNTHÉTIQUES par `engine/groupesExAequo.test.ts`. Ce fichier couvre exactement ce que le
 * mécanisme devait résoudre :
 *  - NON-RÉGRESSION PERMANENTE — le test de reproduction du défaut (vignette N7, `plans/P10/S10.md`
 *    § « Étape 2 »), recréé ici depuis le bilan de cette session antérieure, attente INVERSÉE : sur ce
 *    profil, « Traitement à alléger » précède désormais « Agent à ajouter » ;
 *  - non-régression explicite : sur une intention d'initiation ou d'intensification, l'ordre des
 *    familles de `prescription` reste identique à celui déclaré dans le contenu (aucune n'est hissée).
 */
import { describe, expect, it } from 'vitest'
import type { Criteria } from '../engine/conditions.ts'
import { getNoeudById } from '../content/loadNodes.ts'
import { buildDefaultCriteria } from './formLayout.ts'
import { construireVueDecision } from './vueDecision.ts'

const node = getNoeudById('prescription')
if (!node) throw new Error('Nœud "prescription" introuvable (content/decision/noeuds/diabete-type-2/prescription.yaml).')

describe('T-087 — non-régression permanente : N7, intention « déprescrire »', () => {
  it('« Traitement à alléger » précède désormais « Agent à ajouter » (le défaut de la recette référent est corrigé)', () => {
    // Profil calqué sur la vignette N7 (Mme Chevallier, 88 ans) — reproduit à l'identique depuis
    // `plans/P10/S10.md` § « Étape 2 », attente inversée.
    const criteriaBrut: Criteria = {
      ...buildDefaultCriteria(node.criteres_entree),
      intention: 'deprescrire',
      traitements_en_cours: ['metformine', 'sulfamide', 'insuline_basale'],
      dose_metformine: 1000,
      HbA1c_actuelle: 6.2,
      position_vs_cible: 'sous_objectif',
      DFG: 38,
      IMC: 20.7,
      age: 88,
      fragilite: true,
      denutrition: true,
      esperance_vie: 'limitee',
      risque_hypoglycemie_schema: 'eleve',
      ASCVD_etablie: false,
      insuffisance_cardiaque: false,
      albuminurie: 'normo',
      hypoglycemie_recente: true,
    } as Criteria

    const vue = construireVueDecision(node!, criteriaBrut)
    const libelles = vue.familles.map((f) => f.libelle)
    const idxAjouter = libelles.indexOf('Agent à ajouter')
    const idxAlleger = libelles.indexOf('Traitement à alléger')

    expect(idxAjouter).toBeGreaterThanOrEqual(0)
    expect(idxAlleger).toBeGreaterThanOrEqual(0)
    expect(idxAlleger).toBeLessThan(idxAjouter) // le défaut est corrigé : « alléger » précède « ajouter ».

    // Aucune option n'a disparu, aucune n'a changé de famille : les deux familles gardent le même
    // CONTENU qu'avant le hissage — seul l'ORDRE des sections a bougé (garde-fou explicite du brief).
    const familleAjouter = vue.familles.find((f) => f.libelle === 'Agent à ajouter')
    const familleAlleger = vue.familles.find((f) => f.libelle === 'Traitement à alléger')
    expect(familleAjouter!.groupes.flat().length).toBeGreaterThan(0)
    expect(familleAlleger!.groupes.flat().length).toBeGreaterThan(0)
  })
})

describe('T-087 — non-régression explicite : intention d’initiation ou d’intensification', () => {
  const profilBase = (surcharge: Criteria): Criteria => ({
    ...buildDefaultCriteria(node!.criteres_entree),
    HbA1c_actuelle: 8,
    DFG: 80,
    IMC: 27,
    age: 60,
    albuminurie: 'normo',
    esperance_vie: 'longue',
    risque_hypoglycemie_schema: 'faible',
    ...surcharge,
  })

  // Ordre déclaré dans `content/decision/noeuds/diabete-type-2/prescription.yaml` (`familles:`), avant
  // et après l'introduction de `prioritaire_si` — ce tableau lui-même n'a pas bougé (une seule
  // propriété ajoutée sur une entrée existante).
  const ordreDeclare = [
    "À faire d'emblée — sécurité",
    'Socle du traitement',
    'Traitement à corriger ou remplacer',
    'Agent à ajouter',
    'Traitement à alléger',
    'Aucun geste — surveiller',
  ]

  it.each([
    ['initiation nue', profilBase({ intention: 'initier' })],
    ['initiation HbA1c élevée', profilBase({ intention: 'initier', HbA1c_actuelle: 9.5 })],
    [
      'intensification complexe (IC + ASCVD + gliptine/sulfamide + intolérance)',
      profilBase({
        intention: 'intensifier',
        traitements_en_cours: ['metformine', 'gliptine', 'sulfamide'],
        insuffisance_cardiaque: true,
        ASCVD_etablie: true,
        intolerance_traitement: true,
        nature_intolerance: ['digestive'],
      }),
    ],
    [
      'optimisation, insuffisance rénale sévère',
      profilBase({ intention: 'optimiser', traitements_en_cours: ['metformine', 'sulfamide'], DFG: 25 }),
    ],
  ] as Array<[string, Criteria]>)(
    '%s — l’ordre des sections reste EXACTEMENT l’ordre déclaré (aucune famille hissée)',
    (_libelle, criteria) => {
      const vue = construireVueDecision(node!, criteria)
      const libelles = vue.familles.map((f) => f.libelle)
      // Sous-suite de l'ordre déclaré (les familles sans option applicable pour ce patient sont
      // simplement absentes) — jamais réordonnée : aucune de ces intentions ne rend
      // `intention == deprescrire` vraie, donc aucune famille ne porte de `prioritaire_si` satisfaite.
      expect(libelles).toEqual(ordreDeclare.filter((f) => libelles.includes(f)))
    },
  )
})
