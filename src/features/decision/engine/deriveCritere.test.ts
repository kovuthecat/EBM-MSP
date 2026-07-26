import { describe, expect, it } from 'vitest'
import type { CritereEntree } from '../content/node.types'
import { ConditionError, INDETERMINE, type Criteria } from './conditions'
import {
  calculerCriteresDerives,
  criteresReferences,
  determinesEffectifs,
  evaluerDerive,
  evaluerDeriveTernaire,
  evaluerNombre,
} from './deriveCritere'

describe('evaluerDerive — grammaire de dérivation', () => {
  it('compare deux variables (cible_atteinte)', () => {
    expect(evaluerDerive('HbA1c_actuelle <= HbA1c_cible', { HbA1c_actuelle: 7, HbA1c_cible: 7.5 })).toBe(true)
    expect(evaluerDerive('HbA1c_actuelle <= HbA1c_cible', { HbA1c_actuelle: 8, HbA1c_cible: 7 })).toBe(false)
  })

  it('évalue une expression arithmétique (over_basalisation = dose/poids > 0.5)', () => {
    expect(evaluerDerive('dose_basale_actuelle / poids > 0.5', { dose_basale_actuelle: 50, poids: 80 })).toBe(true) // 0.625
    expect(evaluerDerive('dose_basale_actuelle / poids > 0.5', { dose_basale_actuelle: 30, poids: 80 })).toBe(false) // 0.375
  })

  it('OR de bool nu et de comparaisons (terrain_fragile)', () => {
    const expr = 'fragilite OR esperance_vie == limitee OR age >= 75 OR risque_hypoglycemie_schema == eleve'
    expect(evaluerDerive(expr, { fragilite: false, esperance_vie: 'longue', age: 60, risque_hypoglycemie_schema: 'faible' })).toBe(false)
    expect(evaluerDerive(expr, { fragilite: true, esperance_vie: 'longue', age: 60, risque_hypoglycemie_schema: 'faible' })).toBe(true)
    expect(evaluerDerive(expr, { fragilite: false, esperance_vie: 'limitee', age: 60, risque_hypoglycemie_schema: 'faible' })).toBe(true)
    expect(evaluerDerive(expr, { fragilite: false, esperance_vie: 'longue', age: 80, risque_hypoglycemie_schema: 'faible' })).toBe(true)
    expect(evaluerDerive(expr, { fragilite: false, esperance_vie: 'longue', age: 60, risque_hypoglycemie_schema: 'eleve' })).toBe(true)
  })

  it('AND (gaj_a_cible = GAJ dans [0.7, 1.2])', () => {
    expect(evaluerDerive('GAJ >= 0.7 AND GAJ <= 1.2', { GAJ: 1.0 })).toBe(true)
    expect(evaluerDerive('GAJ >= 0.7 AND GAJ <= 1.2', { GAJ: 1.5 })).toBe(false)
    expect(evaluerDerive('GAJ >= 0.7 AND GAJ <= 1.2', { GAJ: 0.5 })).toBe(false)
  })

  it('lève sur expression vide ou terme non booléen', () => {
    expect(() => evaluerDerive('', {})).toThrow(ConditionError)
    expect(() => evaluerDerive('age', { age: 60 })).toThrow(ConditionError) // nombre nu, pas un booléen
  })

  it('appartenance à une liste (contient / ne_contient_pas, R3 docs/decision/GRAMMAIRE-NOEUD.md — nécessaire à `remplacement_agent_sans_benefice`)', () => {
    const criteria = { traitements_en_cours: ['metformine', 'sulfamide'] }
    expect(evaluerDerive('traitements_en_cours contient sulfamide', criteria)).toBe(true)
    expect(evaluerDerive('traitements_en_cours contient gliptine', criteria)).toBe(false)
    expect(evaluerDerive('traitements_en_cours ne_contient_pas gliptine', criteria)).toBe(true)
    expect(evaluerDerive('traitements_en_cours ne_contient_pas sulfamide', criteria)).toBe(false)
  })

  it('contient lève sur un critère qui n’est pas une liste', () => {
    expect(() => evaluerDerive('age contient 60', { age: 60 })).toThrow(ConditionError)
  })
})

describe('calculerCriteresDerives', () => {
  const criteres: CritereEntree[] = [
    { nom: 'HbA1c_actuelle', type: 'nombre' },
    { nom: 'HbA1c_cible', type: 'nombre' },
    { nom: 'cible_atteinte', type: 'bool', derive: 'HbA1c_actuelle <= HbA1c_cible' },
    { nom: 'fragilite', type: 'bool' },
  ]

  it('injecte la valeur dérivée, laisse les primitives intactes', () => {
    const entree: Criteria = { HbA1c_actuelle: 7, HbA1c_cible: 8, cible_atteinte: false, fragilite: true }
    const out = calculerCriteresDerives(criteres, entree)
    expect(out.cible_atteinte).toBe(true) // recalculé (7 <= 8)
    expect(out.fragilite).toBe(true) // inchangé
    expect(entree.cible_atteinte).toBe(false) // pas de mutation de l'entrée
  })

  it("no-op si aucun critère n'a de derive (nœuds A/B/C/F/H)", () => {
    const sansDerive: CritereEntree[] = [{ nom: 'age', type: 'nombre' }]
    const entree: Criteria = { age: 70 }
    expect(calculerCriteresDerives(sansDerive, entree)).toEqual(entree)
  })
})

describe('evaluerNombre — doses calculées (P3)', () => {
  it('évalue une expression arithmétique en nombre', () => {
    expect(evaluerNombre('poids * 0.1', { poids: 80 })).toBeCloseTo(8)
    expect(evaluerNombre('poids * 0.2', { poids: 80 })).toBeCloseTo(16)
    expect(evaluerNombre('dose_basale_actuelle + 2', { dose_basale_actuelle: 40 })).toBe(42)
    expect(evaluerNombre('dose_basale_actuelle * 0.8', { dose_basale_actuelle: 50 })).toBeCloseTo(40)
  })
  it('renvoie null si non calculable (primitive manquante ou non finie)', () => {
    expect(evaluerNombre('poids * 0.1', {})).toBeNull() // poids absent → NaN → null
    expect(evaluerNombre('dose_basale_actuelle / poids', { dose_basale_actuelle: 40, poids: 0 })).toBeNull() // /0 → Infinity → null
  })
})

describe('criteresReferences', () => {
  const criteres: CritereEntree[] = [
    { nom: 'age', type: 'nombre' },
    { nom: 'HbA1c_actuelle', type: 'nombre' },
    { nom: 'HbA1c_cible', type: 'nombre' },
    { nom: 'cible_atteinte', type: 'bool', derive: 'HbA1c_actuelle <= HbA1c_cible' },
    { nom: 'TIR', type: 'nombre' }, // non référencé nulle part
    { nom: 'TBR', type: 'nombre' },
  ]
  const regles = ['situation_insuline == basale_seule', 'TBR > 4', 'age >= 75']

  it('inclut les critères des règles ET ceux référencés par un derive, exclut les non-référencés', () => {
    const refs = criteresReferences(criteres, regles)
    expect(refs.has('TBR')).toBe(true) // règle
    expect(refs.has('age')).toBe(true) // règle
    expect(refs.has('HbA1c_actuelle')).toBe(true) // via derive de cible_atteinte
    expect(refs.has('HbA1c_cible')).toBe(true) // via derive
    expect(refs.has('TIR')).toBe(false) // jamais référencé → non requis
  })
})

describe('evaluerDeriveTernaire — ternaire (DECISIONS.md D20, SPEC-valeur-indeterminee.md §2)', () => {
  it('renseignes undefined (repli) : comportement identique à evaluerDerive, jamais indéterminé par structure', () => {
    expect(evaluerDeriveTernaire('HbA1c_actuelle <= HbA1c_cible', { HbA1c_actuelle: 7, HbA1c_cible: 8 }, undefined)).toBe(
      true,
    )
  })

  it('un opérande absent de renseignes rend la COMPARAISON indéterminée', () => {
    const criteria = { HbA1c_actuelle: 7, HbA1c_cible: 8 }
    expect(evaluerDeriveTernaire('HbA1c_actuelle <= HbA1c_cible', criteria, new Set(['HbA1c_actuelle']))).toBe(
      INDETERMINE,
    )
    expect(
      evaluerDeriveTernaire(
        'HbA1c_actuelle <= HbA1c_cible',
        criteria,
        new Set(['HbA1c_actuelle', 'HbA1c_cible']),
      ),
    ).toBe(true)
  })

  it("propriété de NON-MUTISME : une disjonction avec une branche pleinement vraie reste vraie même si l'autre est indéterminée", () => {
    const criteria = { fragilite: true, esperance_vie: 'limitee', age: 60 }
    // "fragilite" seul suffit à rendre le premier terme vrai ; "esperance_vie == limitee" (2e terme)
    // n'est même pas indéterminé ici (non testé), mais on vérifie surtout qu'AGE indéterminé (3e terme,
    // absent de `renseignes`) ne fait PAS basculer l'ensemble en indéterminé.
    const expr = 'fragilite OR esperance_vie == limitee OR age >= 75'
    expect(evaluerDeriveTernaire(expr, criteria, new Set(['fragilite', 'esperance_vie']))).toBe(true)
  })

  it("ASYMÉTRIE : jamais Infinity ni NaN — une division par un dénominateur nul (poids vide/0) rend " +
    "indéterminé (défaut réel 12.4, dose_basale_actuelle / poids), TOUJOURS actif (repli compris)", () => {
    const criteria = { dose_basale_actuelle: 50, poids: 0 }
    // Bug historique : Infinity > 0.5 === true, affirmant à tort une "over-basalisation".
    expect(evaluerDeriveTernaire('dose_basale_actuelle / poids > 0.5', criteria, undefined)).toBe(INDETERMINE)
    expect(evaluerDeriveTernaire('dose_basale_actuelle / poids > 0.5', criteria, new Set(['dose_basale_actuelle', 'poids']))).toBe(
      INDETERMINE,
    )
  })

  it('jamais Infinity ni NaN — un dénominateur non renseigné (indéterminé) propage aussi, sans jamais produire NaN', () => {
    const criteria = { dose_basale_actuelle: 50, poids: 80 }
    const resultat = evaluerDeriveTernaire(
      'dose_basale_actuelle / poids > 0.5',
      criteria,
      new Set(['dose_basale_actuelle']), // poids non renseigné
    )
    expect(resultat).toBe(INDETERMINE)
    expect(resultat).not.toBe(Infinity)
    expect(Number.isNaN(resultat as unknown as number)).toBe(false)
  })

  it('evaluerDerive (2 args, repli) : le garde-fou division-par-zéro reste actif, ramené à `false` (jamais Infinity/NaN, jamais une affirmation positive)', () => {
    expect(evaluerDerive('dose_basale_actuelle / poids > 0.5', { dose_basale_actuelle: 50, poids: 0 })).toBe(false)
  })
})

describe('determinesEffectifs — ensemble effectif des critères déterminés (DECISIONS.md D20, SPEC §2.2/§2.4)', () => {
  const criteres: CritereEntree[] = [
    { nom: 'HbA1c_actuelle', type: 'nombre' },
    { nom: 'esperance_vie', type: 'enum', valeurs: ['longue', 'limitee'] },
    { nom: 'fragilite', type: 'bool' },
    { nom: 'ASCVD_etablie', type: 'bool', confirmation_requise: true },
    { nom: 'traitements_en_cours', type: 'liste', valeurs: ['metformine'] },
    { nom: 'cible_atteinte', type: 'bool', derive: 'HbA1c_actuelle <= 7' },
  ]

  it('renseignes undefined ⇒ undefined (repli explicite, comportement historique)', () => {
    expect(determinesEffectifs(criteres, {}, undefined)).toBeUndefined()
  })

  it('nombre/enum non renseignés ⇒ absents de l’ensemble effectif ; renseignés ⇒ présents', () => {
    const effectifs = determinesEffectifs(criteres, { HbA1c_actuelle: 7 }, new Set(['HbA1c_actuelle']))!
    expect(effectifs.has('HbA1c_actuelle')).toBe(true)
    expect(effectifs.has('esperance_vie')).toBe(false) // non renseigné, type enum
  })

  // `criteria` doit porter TOUTES les clés primitives (comme `buildDefaultCriteria` le garantit en
  // pratique) : `HbA1c_actuelle` est nécessaire ici pour que le `derive` de `cible_atteinte` se résolve
  // en comparaison numérique plutôt qu'en libellé littéral (`resoudreOperandeTernaire` ne consulte
  // `renseignes` QUE pour une clé présente dans `criteria`).
  const criteriaComplete: Criteria = { HbA1c_actuelle: 8, esperance_vie: 'longue', fragilite: false, ASCVD_etablie: false, traitements_en_cours: [] }

  it('bool/liste SANS confirmation_requise sont déterminés PAR DÉFAUT, même absents de renseignes', () => {
    const effectifs = determinesEffectifs(criteres, criteriaComplete, new Set())!
    expect(effectifs.has('fragilite')).toBe(true)
    expect(effectifs.has('traitements_en_cours')).toBe(true)
  })

  it('bool avec confirmation_requise reste INDÉTERMINÉ tant que non explicitement renseigné', () => {
    const sansConfirmation = determinesEffectifs(criteres, criteriaComplete, new Set())!
    expect(sansConfirmation.has('ASCVD_etablie')).toBe(false)
    const avecConfirmation = determinesEffectifs(criteres, criteriaComplete, new Set(['ASCVD_etablie']))!
    expect(avecConfirmation.has('ASCVD_etablie')).toBe(true)
  })

  it('un critère DÉRIVÉ est déterminé si les primitifs qu’il référence le sont', () => {
    const determine = determinesEffectifs(criteres, { HbA1c_actuelle: 6 }, new Set(['HbA1c_actuelle']))!
    expect(determine.has('cible_atteinte')).toBe(true)

    const indetermine = determinesEffectifs(criteres, { HbA1c_actuelle: 6 }, new Set())!
    expect(indetermine.has('cible_atteinte')).toBe(false)
  })
})
