/**
 * T-202 (P15/S8, 2026-08-11) — `evaluerPosologieDetail` : les items de `option.posologie_detail` RETENUS
 * pour un patient donné.
 *
 * CE QUI EST VÉRIFIÉ ICI, ET CE QUI NE L'EST PAS. Ce fichier ne teste QUE la brique du moteur (le filtre
 * et sa rétrocompatibilité) — même découpage que `evaluateNode.contre-indications.test.ts`, dont ce
 * fichier reprend délibérément la structure (précédent architectural exact à reproduire, `plans/P15/S8.md`
 * § « Décision clé »). Le fait que le résultat filtré remonte jusqu'au modèle de vue et entre dans
 * `signatureVue` est dans `lib/vueDecision.test.ts` ; son RENDU dans `components/OptionCard.test.tsx`.
 *
 * LE POINT LE PLUS SENSIBLE, ET C'EST LA DIFFÉRENCE AVEC `evaluerContreIndications` : ici, `INDETERMINE`
 * NE PRODUIT PAS UN ÉTAT « affiché mais désamorcé » — l'item est purement et simplement ÉCARTÉ de la
 * liste retenue, exactement comme s'il était faux (même politique que `evaluateAlertesDeListe` : « une
 * alerte dont le `quand` est indéterminé ne s'affiche pas »). Ce n'est PAS une violation de R7 : un item
 * de posologie n'est pas un fait de sécurité qui doit rester visible « au cas où » (R4) — c'est une
 * prose de conduite qui, si l'on ne sait pas si elle s'applique, n'a rien à faire sur l'écran.
 */
import { describe, expect, it } from 'vitest'
import type { ItemPosologie } from '../content/node.types.ts'
import { ConditionError } from './conditions.ts'
import { evaluerPosologieDetail } from './evaluateNode.ts'

describe('evaluerPosologieDetail — rétrocompatibilité (aucun `quand`)', () => {
  it('un item en FORME CHAÎNE (la seule forme du contenu existant) est TOUJOURS retenu', () => {
    // Y compris avec des critères qui, s'ils étaient lus, changeraient quelque chose : une chaîne ne
    // référence rien, il n'y a rien à évaluer.
    expect(evaluerPosologieDetail(['Titrer par paliers de 2 U.', 'Adapter au poids.'], { DFG: 90 })).toEqual([
      'Titrer par paliers de 2 U.',
      'Adapter au poids.',
    ])
  })

  it('un item en forme OBJET SANS `quand` est TOUJOURS retenu — même sort qu’une chaîne (ni l’un ni l’autre n’est filtré)', () => {
    // `evaluerPosologieDetail` FILTRE (jamais ne normalise/clone) : un objet sans `quand` reste l'objet
    // reçu, une chaîne reste la chaîne reçue — la comparaison porte donc sur le fait d'être RETENU (même
    // référence, même longueur), pas sur une égalité structurelle entre les deux formes.
    const objet: ItemPosologie = { texte: 'Titrer par paliers de 2 U.' }
    const chaine = 'Titrer par paliers de 2 U.'
    expect(evaluerPosologieDetail([objet], {})).toEqual([objet])
    expect(evaluerPosologieDetail([chaine], {})).toEqual([chaine])
  })

  it('champ absent ou tableau vide → aucun item (jamais `undefined`, jamais une liste fabriquée)', () => {
    expect(evaluerPosologieDetail(undefined, {})).toEqual([])
    expect(evaluerPosologieDetail([], {})).toEqual([])
  })

  it('les DEUX formes cohabitent dans le même tableau, dans l’ORDRE du contenu, un `quand` FAUX écartant SEULEMENT l’item qui le porte', () => {
    const retenus = evaluerPosologieDetail(
      [
        'Chaîne.',
        { texte: 'Objet sans quand.' },
        { texte: 'Objet conditionnel vrai.', quand: 'DFG < 90' },
        { texte: 'Objet conditionnel faux.', quand: 'DFG >= 90' },
      ],
      { DFG: 20 },
    )
    expect(retenus).toEqual(['Chaîne.', { texte: 'Objet sans quand.' }, { texte: 'Objet conditionnel vrai.', quand: 'DFG < 90' }])
  })
})

describe('evaluerPosologieDetail — un item conditionnel, RETENU ou ÉCARTÉ selon `quand`', () => {
  const item: ItemPosologie = { texte: 'Selon la courbe nocturne MCG.', quand: 'MCG_disponible == true' }

  it('`quand` VRAI → l’item est RETENU', () => {
    expect(evaluerPosologieDetail([item], { MCG_disponible: true })).toEqual([item])
  })

  it('`quand` FAUX → l’item est ÉCARTÉ (retiré de la liste, PAS affiché désamorcé — à la différence d’une contre-indication)', () => {
    expect(evaluerPosologieDetail([item], { MCG_disponible: false })).toEqual([])
  })

  it('`quand` INDÉTERMINÉ (critère non renseigné, D20) → l’item est ÉGALEMENT ÉCARTÉ, jamais retenu « au cas où »', () => {
    // `renseignes` fourni et VIDE : `MCG_disponible` a beau porter une valeur de départ, il n'est pas renseigné.
    expect(evaluerPosologieDetail([item], { MCG_disponible: true }, new Set())).toEqual([])
  })

  it('`renseignes` ABSENT ⇒ repli « tout est renseigné » : aucun item ne peut être écarté pour indétermination', () => {
    // C'est ce repli qui garantit que la suite existante et les bancs (qui n'ont jamais passé
    // `renseignes` sur cette dimension) voient exactement le comportement d'avant ce champ.
    expect(evaluerPosologieDetail([item], { MCG_disponible: true })).toEqual([item])
    expect(evaluerPosologieDetail([item], { MCG_disponible: false })).toEqual([])
  })

  it('le même item passe bien de retenu à écarté selon le seul critère saisi', () => {
    const retenu = (criteria: Record<string, boolean>, renseignes?: Set<string>) =>
      evaluerPosologieDetail([item], criteria, renseignes).length === 1
    expect(retenu({ MCG_disponible: true })).toBe(true)
    expect(retenu({ MCG_disponible: false })).toBe(false)
    expect(retenu({ MCG_disponible: true }, new Set())).toBe(false)
    expect(retenu({ MCG_disponible: true }, new Set(['MCG_disponible']))).toBe(true)
  })
})

describe('evaluerPosologieDetail — mêmes garde-fous que le reste du moteur', () => {
  it('propage `ConditionError` sur une expression malformée (jamais de faux silencieux, brief §7)', () => {
    expect(() => evaluerPosologieDetail([{ texte: 'x', quand: 'critere_inconnu == true' }], {})).toThrow(
      ConditionError,
    )
  })

  it('accepte la grammaire COMPLÈTE du DSL (AND/OR), sans second interpréteur', () => {
    const item: ItemPosologie = { texte: 'x', quand: 'DFG < 30 OR age > 80' }
    expect(evaluerPosologieDetail([item], { DFG: 90, age: 85 })).toEqual([item])
    expect(evaluerPosologieDetail([item], { DFG: 90, age: 60 })).toEqual([])
    // Un terme `OR` indéterminé alors que l'autre est faux ⇒ indéterminé (composition ternaire de
    // `evaluateCondition`, inchangée : cette brique ne fait que la consommer) ⇒ écarté, comme tout FAUX.
    expect(evaluerPosologieDetail([item], { DFG: 90, age: 60 }, new Set(['DFG']))).toEqual([])
  })
})
