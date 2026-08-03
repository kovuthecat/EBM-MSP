import { describe, expect, it } from 'vitest'
import type { CritereEntree } from '../content/node.types'
import { ConditionError, INDETERMINE, evaluateCondition, type Criteria } from './conditions'
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

describe('determinesEffectifs — ensemble effectif des critères déterminés (DECISIONS.md D30, amende D20, SPEC §2.2/§2.4)', () => {
  const criteres: CritereEntree[] = [
    { nom: 'HbA1c_actuelle', type: 'nombre' },
    { nom: 'esperance_vie', type: 'enum', valeurs: ['longue', 'limitee'] },
    { nom: 'fragilite', type: 'bool' },
    { nom: 'ASCVD_etablie', type: 'bool', presomption_non: true },
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

  it('bool/liste SANS presomption_non sont INDÉTERMINÉS PAR DÉFAUT (D30), même absents de renseignes', () => {
    const effectifs = determinesEffectifs(criteres, criteriaComplete, new Set())!
    expect(effectifs.has('fragilite')).toBe(false)
    expect(effectifs.has('traitements_en_cours')).toBe(false)
  })

  it('bool avec presomption_non: true reste DÉTERMINÉ par défaut, sans confirmation explicite (D30, exception au nouveau défaut)', () => {
    const sansReponse = determinesEffectifs(criteres, criteriaComplete, new Set())!
    expect(sansReponse.has('ASCVD_etablie')).toBe(true)
    const avecReponse = determinesEffectifs(criteres, criteriaComplete, new Set(['ASCVD_etablie']))!
    expect(avecReponse.has('ASCVD_etablie')).toBe(true)
  })

  it('un critère DÉRIVÉ est déterminé si les primitifs qu’il référence le sont', () => {
    const determine = determinesEffectifs(criteres, { HbA1c_actuelle: 6 }, new Set(['HbA1c_actuelle']))!
    expect(determine.has('cible_atteinte')).toBe(true)

    const indetermine = determinesEffectifs(criteres, { HbA1c_actuelle: 6 }, new Set())!
    expect(indetermine.has('cible_atteinte')).toBe(false)
  })
})

// =========================================================================================================
// T-133 (P12/S8) — CRITÈRES DÉRIVÉS NUMÉRIQUES (voie B) : un critère `type: nombre` porteur d'un `derive`
// arithmétique reçoit une VALEUR (pas un booléen). ÉCRITS AVANT LE CODE (brief S8.md, étape 1) : au moment
// où ces tests sont ajoutés, `calculerCriteresDerives` ne connaît que le chemin booléen (`evaluerDerive`)
// et `resoudreArithTernaire` ne supporte qu'UN SEUL opérateur binaire — les deux prochains blocs DOIVENT
// donc échouer avant l'extension du moteur (chaîne d'opérateurs pour l'IMC, `poids / taille / taille`), et
// le troisième bloc (propagation D20) est LE CŒUR de la tâche : c'est lui qui doit rester rouge tant que
// l'indéterminé n'est pas correctement propagé à travers un dérivé numérique.
// =========================================================================================================

describe('resoudreArithTernaire / evaluerNombre — CHAÎNE de plusieurs opérateurs (T-133, poids / taille / taille pour l’IMC)', () => {
  it('applique les opérateurs de GAUCHE À DROITE (pas un regroupement du membre de droite)', () => {
    // (poids / taille) / taille = (70 / 1.75) / 1.75 = 40 / 1.75 ≈ 22,857 — PAS poids / (taille / taille) = 70.
    expect(evaluerNombre('poids / taille / taille', { poids: 70, taille: 1.75 })).toBeCloseTo(22.857, 2)
  })

  it('un opérande manquant PROPAGE l’indéterminé à travers toute la chaîne (jamais un calcul partiel)', () => {
    expect(evaluerNombre('poids / taille / taille', { taille: 1.75 })).toBeNull()
  })

  it('une division par zéro À N’IMPORTE QUEL MAILLON de la chaîne rend indéterminé (jamais Infinity/NaN)', () => {
    expect(evaluerNombre('poids / taille / taille', { poids: 70, taille: 0 })).toBeNull()
  })

  it('un opérateur unique (forme historique) reste inchangé — non-régression de la chaîne à 1 maillon', () => {
    expect(evaluerNombre('poids * 0.15', { poids: 80 })).toBeCloseTo(12)
  })
})

describe('calculerCriteresDerives — critère `type: nombre` porteur d’un `derive` (T-133, IMC)', () => {
  const criteresIMC: CritereEntree[] = [
    { nom: 'poids', type: 'nombre' },
    { nom: 'taille', type: 'nombre' },
    { nom: 'IMC', type: 'nombre', derive: 'poids / taille / taille' },
  ]

  it('pose la VALEUR NUMÉRIQUE calculée sur le critère dérivé (pas un booléen)', () => {
    const entree: Criteria = { poids: 70, taille: 1.75, IMC: 999 } // 999 : valeur bidon, doit être écrasée
    const out = calculerCriteresDerives(criteresIMC, entree)
    expect(typeof out.IMC).toBe('number')
    expect(out.IMC).toBeCloseTo(22.857, 2)
  })

  it('CK_x_normale (autre dérivé numérique du domaine, statine) : rapport CK_UI_L / CK_normale_sup', () => {
    const criteresCK: CritereEntree[] = [
      { nom: 'CK_UI_L', type: 'nombre' },
      { nom: 'CK_normale_sup', type: 'nombre' },
      { nom: 'CK_x_normale', type: 'nombre', derive: 'CK_UI_L / CK_normale_sup' },
    ]
    const out = calculerCriteresDerives(criteresCK, { CK_UI_L: 725, CK_normale_sup: 145 })
    expect(out.CK_x_normale).toBeCloseTo(5, 5)
  })
})

describe("determinesEffectifs — critère `type: nombre` dérivé (T-133) : est-il DÉTERMINÉ selon ses opérandes ?", () => {
  const criteresIMC: CritereEntree[] = [
    { nom: 'poids', type: 'nombre' },
    { nom: 'taille', type: 'nombre' },
    { nom: 'IMC', type: 'nombre', derive: 'poids / taille / taille' },
  ]

  it('DÉTERMINÉ quand poids ET taille sont tous deux renseignés', () => {
    const criteria = calculerCriteresDerives(criteresIMC, { poids: 70, taille: 1.75 })
    const effectifs = determinesEffectifs(criteresIMC, criteria, new Set(['poids', 'taille']))!
    expect(effectifs.has('IMC')).toBe(true)
  })

  it('INDÉTERMINÉ (absent de l’ensemble effectif) quand le poids manque, même si la taille est connue', () => {
    const criteria = calculerCriteresDerives(criteresIMC, { poids: 70, taille: 1.75 })
    const effectifs = determinesEffectifs(criteresIMC, criteria, new Set(['taille']))! // poids absent
    expect(effectifs.has('IMC')).toBe(false)
  })

  it('INDÉTERMINÉ quand la taille manque, même si le poids est connu', () => {
    const criteria = calculerCriteresDerives(criteresIMC, { poids: 70, taille: 1.75 })
    const effectifs = determinesEffectifs(criteresIMC, criteria, new Set(['poids']))! // taille absente
    expect(effectifs.has('IMC')).toBe(false)
  })
})

describe(
  "PROPAGATION DE L'INDÉTERMINÉ (D20) À TRAVERS UN DÉRIVÉ NUMÉRIQUE — LE CŒUR DE LA TÂCHE (T-133). " +
    'Si le poids manque, l’IMC n’est pas « 0 », il est INDÉTERMINÉ, et une comparaison qui le lit (IMC >= 30) ' +
    'doit rester INDÉTERMINÉE — jamais `false`. Un IMC qui vaudrait 0 par défaut ferait disparaître ' +
    'silencieusement des options chez un patient incomplet (cf. « Si bloqué », S8.md).',
  () => {
    const criteresIMC: CritereEntree[] = [
      { nom: 'poids', type: 'nombre' },
      { nom: 'taille', type: 'nombre' },
      { nom: 'IMC', type: 'nombre', derive: 'poids / taille / taille' },
    ]

    it('poids ET taille renseignés : `IMC >= 30` est tranchée normalement (vrai ici, IMC ≈ 31,1)', () => {
      const criteria = calculerCriteresDerives(criteresIMC, { poids: 90, taille: 1.7 })
      const effectifs = determinesEffectifs(criteresIMC, criteria, new Set(['poids', 'taille']))
      expect(evaluateCondition('IMC >= 30', criteria, effectifs)).toBe(true)
    })

    it('LE POIDS MANQUE : `IMC >= 30` reste INDÉTERMINÉE — jamais `false` (pas d’IMC « 0 » qui ferait disparaître l’option)', () => {
      const criteria = calculerCriteresDerives(criteresIMC, { poids: 90, taille: 1.7 })
      const effectifs = determinesEffectifs(criteresIMC, criteria, new Set(['taille'])) // poids non renseigné
      expect(evaluateCondition('IMC >= 30', criteria, effectifs)).toBe(INDETERMINE)
    })

    it('LA TAILLE MANQUE : `IMC < 22` reste INDÉTERMINÉE de la même façon', () => {
      const criteria = calculerCriteresDerives(criteresIMC, { poids: 90, taille: 1.7 })
      const effectifs = determinesEffectifs(criteresIMC, criteria, new Set(['poids'])) // taille non renseignée
      expect(evaluateCondition('IMC < 22', criteria, effectifs)).toBe(INDETERMINE)
    })

    it('AUCUN opérande renseigné (formulaire vierge) : `IMC >= 30` indéterminée, pas faussement `false`', () => {
      const criteria = calculerCriteresDerives(criteresIMC, { poids: 0, taille: 0 })
      const effectifs = determinesEffectifs(criteresIMC, criteria, new Set())
      expect(evaluateCondition('IMC >= 30', criteria, effectifs)).toBe(INDETERMINE)
    })
  },
)
