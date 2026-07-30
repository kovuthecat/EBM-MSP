/**
 * T-068 (P9 · S1, 2026-07-30) — `evaluerContreIndications` : l'état d'une contre-indication pour un
 * patient donné.
 *
 * CE QUI EST VÉRIFIÉ ICI, ET CE QUI NE L'EST PAS. Ce fichier ne teste QUE la brique du moteur (les trois
 * états et leur rétrocompatibilité) ; le fait que cet état remonte jusqu'au modèle de vue est dans
 * `lib/vueDecision.test.ts`, et son RENDU dans `components/OptionCard.test.tsx`. Le découpage suit celui
 * qui existe déjà pour les alertes d'option (`evaluateAlertesDeListe` ici, composition là-bas).
 *
 * LE POINT LE PLUS SENSIBLE est la troisième famille de cas : `INDETERMINE` ne doit JAMAIS produire
 * `levee`. Lever une contre-indication sur un critère non renseigné reviendrait à affirmer « ce patient
 * n'a pas d'insuffisance rénale » alors qu'on ne le sait pas — la violation frontale de R7/D20 (« le
 * moteur ne se prononce jamais sur ce qu'il ignore »), et sur le canal le plus coûteux qui soit puisque
 * l'erreur consisterait à taire un risque.
 */
import { describe, expect, it } from 'vitest'
import type { ContreIndication } from '../content/node.types.ts'
import { ConditionError } from './conditions.ts'
import { evaluerContreIndications } from './evaluateNode.ts'

describe('evaluerContreIndications — rétrocompatibilité (aucune `condition`)', () => {
  it('une contre-indication en FORME CHAÎNE (la seule forme du contenu existant) est TOUJOURS `active`', () => {
    // Y compris avec des critères qui, s'ils étaient lus, changeraient quelque chose : une chaîne ne
    // référence rien, il n'y a rien à évaluer.
    expect(evaluerContreIndications(['Alcoolisme.', 'Grossesse.'], { DFG: 90 })).toEqual([
      { texte: 'Alcoolisme.', etat: 'active' },
      { texte: 'Grossesse.', etat: 'active' },
    ])
  })

  it('une contre-indication en forme OBJET SANS `condition` est `active` — strictement équivalente à la chaîne', () => {
    const objet: ContreIndication = { texte: 'Alcoolisme.' }
    expect(evaluerContreIndications([objet], {})).toEqual(evaluerContreIndications(['Alcoolisme.'], {}))
  })

  it('champ absent ou tableau vide → aucune contre-indication (jamais `undefined`, jamais un état fabriqué)', () => {
    expect(evaluerContreIndications(undefined, {})).toEqual([])
    expect(evaluerContreIndications([], {})).toEqual([])
  })

  it('les DEUX formes cohabitent dans le même tableau, dans l’ORDRE du contenu', () => {
    const etats = evaluerContreIndications(
      ['Chaîne.', { texte: 'Objet sans condition.' }, { texte: 'Objet conditionnel.', condition: 'DFG < 30' }],
      { DFG: 90 },
    )
    expect(etats.map((ci) => ci.texte)).toEqual(['Chaîne.', 'Objet sans condition.', 'Objet conditionnel.'])
    expect(etats.map((ci) => ci.etat)).toEqual(['active', 'active', 'levee'])
  })
})

describe('evaluerContreIndications — les trois états d’une contre-indication conditionnelle', () => {
  // POLARITÉ (celle d'une `exclusion`, pas celle d'une condition d'applicabilité) : `DFG < 30` se lit
  // « cette contre-indication vaut pour un DFG < 30 », donc VRAIE = le fait est là = alerte active.
  const ci: ContreIndication = { texte: 'Insuffisance rénale sévère.', condition: 'DFG < 30' }

  it('`condition` VRAIE → `active` : la contre-indication s’applique à ce patient', () => {
    expect(evaluerContreIndications([ci], { DFG: 22 })).toEqual([
      { texte: 'Insuffisance rénale sévère.', etat: 'active' },
    ])
  })

  it('`condition` FAUSSE → `levee` : le critère saisi l’exclut (elle reste dans la liste, désamorcée)', () => {
    const etats = evaluerContreIndications([ci], { DFG: 90 })
    expect(etats).toEqual([{ texte: 'Insuffisance rénale sévère.', etat: 'levee' }])
    // Elle n'est PAS retirée : c'est tout le sens de « désamorcée, pas effacée » (R4).
    expect(etats).toHaveLength(1)
  })

  it('`condition` INDÉTERMINÉE (critère non renseigné, D20) → `indetermine`, JAMAIS `levee`', () => {
    // `renseignes` fourni et VIDE : `DFG` a beau porter une valeur de départ, il n'est pas renseigné.
    const etats = evaluerContreIndications([ci], { DFG: 90 }, new Set())
    expect(etats).toEqual([{ texte: 'Insuffisance rénale sévère.', etat: 'indetermine' }])
  })

  it('`renseignes` ABSENT ⇒ repli « tout est renseigné » : aucune contre-indication ne peut être `indetermine`', () => {
    // C'est ce repli qui garantit que la suite existante et les bancs (qui n'ont jamais passé
    // `renseignes` sur cette dimension) voient exactement le comportement d'avant ce champ.
    expect(evaluerContreIndications([ci], { DFG: 90 })[0].etat).toBe('levee')
    expect(evaluerContreIndications([ci], { DFG: 20 })[0].etat).toBe('active')
  })

  it('la même contre-indication passe bien d’un état à l’autre selon le seul critère saisi', () => {
    const etat = (criteria: Record<string, number>, renseignes?: Set<string>) =>
      evaluerContreIndications([ci], criteria, renseignes)[0].etat
    expect(etat({ DFG: 20 })).toBe('active')
    expect(etat({ DFG: 90 })).toBe('levee')
    expect(etat({ DFG: 90 }, new Set())).toBe('indetermine')
    expect(etat({ DFG: 90 }, new Set(['DFG']))).toBe('levee')
  })
})

describe('evaluerContreIndications — mêmes garde-fous que le reste du moteur', () => {
  it('propage `ConditionError` sur une expression malformée (jamais de faux silencieux, brief §7)', () => {
    expect(() => evaluerContreIndications([{ texte: 'x', condition: 'critere_inconnu == true' }], {})).toThrow(
      ConditionError,
    )
  })

  it('accepte la grammaire COMPLÈTE du DSL (AND/OR), sans second interpréteur', () => {
    const ci: ContreIndication = { texte: 'x', condition: 'DFG < 30 OR age > 80' }
    expect(evaluerContreIndications([ci], { DFG: 90, age: 85 })[0].etat).toBe('active')
    expect(evaluerContreIndications([ci], { DFG: 90, age: 60 })[0].etat).toBe('levee')
    // Un terme `OR` indéterminé alors que l'autre est faux ⇒ indéterminé (composition ternaire de
    // `evaluateCondition`, inchangée : cette brique ne fait que la consommer).
    expect(evaluerContreIndications([ci], { DFG: 90, age: 60 }, new Set(['DFG']))[0].etat).toBe('indetermine')
  })
})
