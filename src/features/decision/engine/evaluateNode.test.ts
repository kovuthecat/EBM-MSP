/**
 * Tests du sélecteur d'options (`evaluateNode.ts`) sur le nœud **réel**
 * `content/noeuds/diabete-type-2/cible-glycemique.yaml` (S3, étape 3 — brief §11). Le module testé
 * ne connaît pas ce nœud par son nom : c'est ce fichier de test qui l'y ancre volontairement, pour
 * vérifier le comportement sur du contenu sourcé plutôt que sur un fixture inventé.
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import type { Criteria } from './conditions.ts'
import { ConditionError } from './conditions.ts'
import { evaluateNode } from './evaluateNode.ts'

const node = getNoeudById('cible-glycemique')
if (node === undefined) {
  throw new Error(
    'Nœud "cible-glycemique" introuvable sous content/noeuds/diabete-type-2 — prérequis de ces tests (S2).',
  )
}

const INTITULE_STRICTE = 'Cible ~6,5 %'
const INTITULE_DEFAUT = 'Cible ~7 %'
const INTITULE_SOUPLE = 'Cible 7,5–8 %'
const INTITULE_MOINS_CONTRAIGNANTE = 'Cible 8–8,5 %'

function intitules(options: { intitule: string }[]): string[] {
  return options.map((o) => o.intitule)
}

describe('evaluateNode — nœud "cible-glycemique" (brief §11)', () => {
  it('jeune, diabète récent, risque hypo faible, espérance longue, non fragile → cible stricte', () => {
    const criteria: Criteria = {
      age: 45,
      anciennete_diabete_annees: 5,
      esperance_vie: 'longue',
      fragilite: false,
      risque_hypoglycemie_schema: 'faible',
    }
    const result = evaluateNode(node, criteria)
    expect(intitules(result.applicable)).toEqual([INTITULE_STRICTE])

    const stricteOption = result.applicable[0]
    expect(result.reasons.get(stricteOption)).toEqual([
      'age < 60',
      'anciennete_diabete_annees < 10',
      'risque_hypoglycemie_schema == faible',
      'esperance_vie == longue',
      'fragilite == false',
    ])
  })

  it('profil intermédiaire (aucune borne franchie) → repli sur le default (~7 %)', () => {
    const criteria: Criteria = {
      age: 68,
      anciennete_diabete_annees: 8,
      esperance_vie: 'intermediaire',
      fragilite: false,
      risque_hypoglycemie_schema: 'faible',
    }
    const result = evaluateNode(node, criteria)
    expect(intitules(result.applicable)).toEqual([INTITULE_DEFAUT])
    expect(result.reasons.get(result.applicable[0])).toEqual(['default'])
  })

  describe('≥ 75 ans OU fragile OU risque hypo élevé OU espérance limitée → cible souple', () => {
    it('déclenché par l\'âge (≥ 75), sans franchir la borne "fragile ET espérance limitée"', () => {
      const criteria: Criteria = {
        age: 80,
        anciennete_diabete_annees: 5,
        esperance_vie: 'longue',
        fragilite: false,
        risque_hypoglycemie_schema: 'faible',
      }
      expect(intitules(evaluateNode(node, criteria).applicable)).toEqual([INTITULE_SOUPLE])
    })

    it('déclenché par la fragilité seule (espérance non limitée)', () => {
      const criteria: Criteria = {
        age: 50,
        anciennete_diabete_annees: 5,
        esperance_vie: 'longue',
        fragilite: true,
        risque_hypoglycemie_schema: 'faible',
      }
      expect(intitules(evaluateNode(node, criteria).applicable)).toEqual([INTITULE_SOUPLE])
    })

    it('déclenché par le risque hypoglycémique élevé', () => {
      const criteria: Criteria = {
        age: 50,
        anciennete_diabete_annees: 5,
        esperance_vie: 'longue',
        fragilite: false,
        risque_hypoglycemie_schema: 'eleve',
      }
      expect(intitules(evaluateNode(node, criteria).applicable)).toEqual([INTITULE_SOUPLE])
    })

    it('déclenché par l\'espérance de vie limitée seule (non fragile)', () => {
      const criteria: Criteria = {
        age: 50,
        anciennete_diabete_annees: 5,
        esperance_vie: 'limitee',
        fragilite: false,
        risque_hypoglycemie_schema: 'faible',
      }
      expect(intitules(evaluateNode(node, criteria).applicable)).toEqual([INTITULE_SOUPLE])
    })
  })

  it('fragile ET espérance limitée → la cible la moins contraignante est bien retenue', () => {
    const criteria: Criteria = {
      age: 80,
      anciennete_diabete_annees: 20,
      esperance_vie: 'limitee',
      fragilite: true,
      risque_hypoglycemie_schema: 'eleve',
    }
    const result = evaluateNode(node, criteria)
    // Note de contenu (pas un bug moteur) : la condition OR de "Cible 7,5–8 %" inclut déjà
    // `fragilite == true` et `esperance_vie == limitee` comme disjoints ; toute combinaison qui
    // satisfait la condition AND de "Cible 8–8,5 %" satisfait donc aussi celle de "Cible 7,5–8 %".
    // Les deux options sont applicables simultanément (aucun score caché, brief §7) ; l'ordre du
    // nœud place la borne la moins contraignante en dernier, cohérent avec "l'auteur ordonne du
    // plus spécifique au plus général" (Décision clé de S3) une fois qu'on lit "spécifique" comme
    // repérant l'option la plus étroite pour l'écran (S4), pas comme garantissant l'exclusivité.
    expect(intitules(result.applicable)).toEqual([INTITULE_SOUPLE, INTITULE_MOINS_CONTRAIGNANTE])
    expect(intitules(result.applicable)).toContain(INTITULE_MOINS_CONTRAIGNANTE)
  })

  it('le default n\'est pas retenu dès qu\'une autre option s\'applique', () => {
    const stricteCriteria: Criteria = {
      age: 45,
      anciennete_diabete_annees: 5,
      esperance_vie: 'longue',
      fragilite: false,
      risque_hypoglycemie_schema: 'faible',
    }
    expect(intitules(evaluateNode(node, stricteCriteria).applicable)).not.toContain(INTITULE_DEFAUT)

    const souplecriteria: Criteria = {
      age: 80,
      anciennete_diabete_annees: 5,
      esperance_vie: 'longue',
      fragilite: false,
      risque_hypoglycemie_schema: 'faible',
    }
    expect(intitules(evaluateNode(node, souplecriteria).applicable)).not.toContain(INTITULE_DEFAUT)
  })

  it('variable de critère inconnue → erreur explicite (pas un faux silencieux)', () => {
    // `esperance_vie` manque volontairement : la condition "esperance_vie == longue" de l'option
    // stricte doit lever, pas être évaluée à `false`.
    const incompleteCriteria = {
      age: 45,
      anciennete_diabete_annees: 5,
      fragilite: false,
      risque_hypoglycemie_schema: 'faible',
    } as Criteria
    expect(() => evaluateNode(node, incompleteCriteria)).toThrow(ConditionError)
    expect(() => evaluateNode(node, incompleteCriteria)).toThrow(/esperance_vie/)
  })
})
