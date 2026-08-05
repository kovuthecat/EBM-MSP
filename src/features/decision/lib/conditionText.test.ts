import { describe, expect, it } from 'vitest'
import { describeNonApplicable, describeReasons } from './conditionText'

describe('describeReasons', () => {
  it('reconnaît le repli `default` et affiche un message explicite (pas le jeton brut)', () => {
    expect(describeReasons(['default'])).toBe(
      "Option par défaut : retenue en l'absence de toute autre option plus spécifique applicable.",
    )
  })

  it('reconnaît le socle `toujours` (D16) et affiche un message explicite (pas le jeton brut)', () => {
    // Régression du finding red-team D16 : sans ce cas spécial, une carte affichait littéralement
    // « Pourquoi cette option : toujours » (jeton moteur interne montré au clinicien).
    const texte = describeReasons(['toujours'])
    expect(texte).not.toBe('toujours')
    expect(texte).toContain('recommandation officielle')
  })

  it('humanise une expression atomique réelle (variable/opérateur/valeur)', () => {
    expect(describeReasons(['age >= 75'])).toBe('Âge ≥ 75')
  })

  it('compose AND (« et ») et OR (« ou ») comme le moteur', () => {
    // ⚠ ATTENTE CHANGÉE (R6, 2026-07-25) : le rendu booléen était « Fragilité = Oui », qui se lit comme
    // une case de formulaire et non comme une raison clinique. Un booléen vrai est désormais rendu par
    // son seul libellé. Changement de PRÉSENTATION assumé, aucune règle de décision touchée.
    expect(describeReasons(['fragilite == true AND esperance_vie == limitee'])).toBe(
      'Fragilité et Espérance de vie = Limitée',
    )
    expect(describeReasons(['age >= 75 OR fragilite == true'])).toBe('Âge ≥ 75 ou Fragilité')
  })

  it('joint plusieurs éléments du tableau `reasons` (ET logique, comme `conditions.every`)', () => {
    expect(describeReasons(['age >= 75', 'fragilite == true'])).toBe('Âge ≥ 75 et Fragilité')
  })

  it('rend un booléen FAUX par « : non », jamais par une tournure accordée', () => {
    // « pas de <libellé> » produirait des fautes de genre et de nombre selon le critère ; « : non »
    // est sûr quel que soit le libellé, qui vient du contenu et n'est pas connu de ce module.
    expect(describeReasons(['insuffisance_cardiaque == false'])).toBe('Insuffisance cardiaque : non')
  })

  it("rend l'appartenance à une liste, au lieu de laisser fuir le jeton du DSL", () => {
    // Régression : `ATOMIC_RE` ne connaît que les opérateurs de comparaison, donc
    // `contient`/`ne_contient_pas` retombaient sur le repli « chaîne telle quelle » et affichaient
    // « traitements_en_cours ne_contient_pas gliptine » au clinicien.
    const positif = describeReasons(['traitements_en_cours contient gliptine'])
    expect(positif).not.toContain('contient')
    // Libellé raccourci le 2026-08-01 (amélioration de lisibilité, `ENUM_VALUE_LABELS.gliptine`) : le
    // sigle de classe (iDPP4) a migré vers `describeEnumValue` (infobulle des chips), pas ici.
    expect(positif).toBe('Traitements en cours comprend Gliptine')

    const negatif = describeReasons(['traitements_en_cours ne_contient_pas aGLP1'])
    expect(negatif).not.toContain('ne_contient_pas')
    expect(negatif).toContain('ne comprend pas')
  })
})

/**
 * P10/S2 (T-079) — MOTIFS RÉDIGÉS (`Option.motifs`). Le mécanisme est ADDITIF : ces tests vérifient
 * autant ce qu'il change (un motif remplace la branche humanisée) que ce qu'il ne change pas (sans
 * motif, ou pour une branche non citée, le rendu est celui d'avant).
 */
describe('describeReasons — motifs rédigés (P10/S2)', () => {
  it('affiche le motif rédigé à la place de la branche humanisée', () => {
    expect(
      describeReasons(['ASCVD_etablie == true'], {
        'ASCVD_etablie == true': 'Maladie cardiovasculaire établie, là où le bénéfice sur les événements durs est démontré',
      }),
    ).toBe('Maladie cardiovasculaire établie, là où le bénéfice sur les événements durs est démontré')
  })

  it('retombe sur la branche humanisée quand la branche n’a pas de motif (carte partielle)', () => {
    // Une option peut ne rédiger QU'UNE de ses branches : les autres gardent leur rendu mécanique.
    expect(describeReasons(['age >= 75'], { 'fragilite == true': 'Patient fragile' })).toBe('Âge ≥ 75')
  })

  it('n’affiche JAMAIS le motif d’une branche non satisfaite (P10/S1 : `reasons` ne contient que les vraies)', () => {
    const texte = describeReasons(['IMC >= 30'], {
      'ASCVD_etablie == true': 'Maladie cardiovasculaire établie',
      'IMC >= 30': 'Obésité',
    })
    expect(texte).toBe('Obésité')
    expect(texte).not.toContain('cardiovasculaire')
  })

  it('applique le motif à CHAQUE branche d’une expression restée disjonctive (cas des exclusions)', () => {
    expect(
      describeReasons(['age >= 75 OR fragilite == true'], { 'fragilite == true': 'Patient fragile' }),
    ).toBe('Âge ≥ 75 ou Patient fragile')
  })

  it('tolère les espaces de bord d’une clé, et rien d’autre', () => {
    expect(describeReasons(['age >= 75'], { '  age >= 75  ': 'Grand âge' })).toBe('Grand âge')
    // Un espace INTERNE en trop n'est pas une variation de mise en forme : c'est une autre chaîne, et
    // l'invariant I24 du banc refuse cette clé plutôt que de la faire deviner ici.
    expect(describeReasons(['age >= 75'], { 'age  >=  75': 'Grand âge' })).toBe('Âge ≥ 75')
  })

  it('laisse le sentinel `toujours` intact — aucune clé de `motifs` ne peut le désigner (I24)', () => {
    expect(describeReasons(['toujours'], { toujours: 'JAMAIS AFFICHÉ' })).toContain('recommandation officielle')
  })

  it('le sentinel `default` peut porter un motif rédigé sous la clé réservée `default` (extension post-S5)', () => {
    expect(describeReasons(['default'], { default: 'autonome, sans antécédent CV, espérance de vie longue' })).toBe(
      'autonome, sans antécédent CV, espérance de vie longue',
    )
  })

  it('`default` retombe sur le message générique en l’absence de motif dédié', () => {
    expect(describeReasons(['default'])).toContain('Option par défaut')
    expect(describeReasons(['default'], { 'autre clé': 'sans rapport' })).toContain('Option par défaut')
  })
})

/**
 * P10/S2 (T-079) — OPTIONS NON RETENUES : énumération NÉGATIVE. Toutes les branches de l'expression
 * reçue sont fausses pour ce patient ; le défaut corrigé n'est pas de les énumérer (c'est la règle
 * exacte, D3) mais de les énoncer à l'affirmative.
 */
describe('describeNonApplicable — le « pourquoi pas d’autres options ? »', () => {
  it('énumère les cas à la NÉGATIVE, jamais en liste positive', () => {
    // Le cas cité par la recette : « Introduire un AR GLP‑1 », 5 branches, aucune satisfaite.
    const texte = describeNonApplicable(
      'ASCVD_etablie == true OR IMC >= 30 OR palette_glycemique_ouverte == true OR ' +
        'remplacement_agent_sans_benefice == true OR DFG > 0 AND DFG < 30 AND cible_atteinte == false',
    )
    expect(texte).toBe(
      "ne s'applique pas : ni maladie cardiovasculaire athéromateuse établie, ni IMC (kg/m²) ≥ 30, " +
        'ni place disponible pour un agent de contrôle glycémique supplémentaire, ' +
        "ni accès à un agent de contrôle glycémique, en ajout ou en remplacement d'un agent sans bénéfice " +
        'sur critère dur (gliptine, sulfamide, glinide), ' +
        'ni DFG (mL/min/1,73 m²) > 0 et DFG (mL/min/1,73 m²) < 30 et HbA1c à la cible : non',
    )
    // La marque du défaut corrigé : les cas ne sont plus reliés par « ou » (ce qui les donnait à lire
    // comme une liste d'affirmations sur le patient) mais par « ni » — 5 cas, 4 séparateurs. Vérifié sur
    // le SÉPARATEUR et non par l'absence du mot « ou », qui apparaît légitimement DANS un libellé
    // (« en ajout ou en remplacement… »).
    expect(texte.split(', ni ')).toHaveLength(5)
  })

  it('met l’initiale en bas de casse SANS abîmer les sigles', () => {
    expect(describeNonApplicable('fragilite == true')).toContain('fragilité')
    // `IMC`, `DFG`, `HbA1c` : une majuscule ailleurs qu'en tête ⇒ le libellé n'est pas décapitalisé.
    expect(describeNonApplicable('IMC >= 30')).toContain('IMC (kg/m²) ≥ 30')
    expect(describeNonApplicable('HbA1c_actuelle >= 8')).toContain('HbA1c actuelle (%) ≥ 8')
  })

  it('dit au conditionnel ce qui manque quand la condition n’a qu’une seule branche', () => {
    // « ni » n'existe pas au singulier : « il faudrait X » porte la même négation sans faute de langue.
    expect(describeNonApplicable('age >= 75')).toBe("ne s'applique pas : il faudrait âge ≥ 75")
  })

  it('consomme les motifs rédigés, et ne retouche pas la prose d’auteur', () => {
    const texte = describeNonApplicable('ASCVD_etablie == true OR IMC >= 30', {
      'ASCVD_etablie == true': 'Maladie cardiovasculaire établie',
    })
    // La branche rédigée garde SA casse (l'auteur écrit ce qu'il veut) ; la branche mécanique est mise en
    // bas de casse pour s'insérer dans la phrase.
    expect(texte).toBe("ne s'applique pas : ni Maladie cardiovasculaire établie, ni IMC (kg/m²) ≥ 30")
  })
})

/**
 * P13/S4 (T-145, R6 volet rendu) — UN LITTÉRAL N'EST CITÉ QU'UNE FOIS dans une conjonction rendue (D19 :
 * « … et MCG disponible et TBR > 4 **et MCG disponible** et CV > 36 »). `humanizeAndTerm` est interne
 * (non exportée) : ces tests passent par les deux fonctions publiques qui la consomment, exactement comme
 * la « Décision clé » l'exige (« s'applique aux DEUX fonctions d'un seul geste »).
 */
describe('déduplication des littéraux dans une conjonction (T-145) — `describeReasons`', () => {
  it('un littéral répété dans une conjonction n’est rendu qu’une fois, ordre de première apparition préservé', () => {
    // Variables SYNTHÉTIQUES, non cataloguées (`labels.ts`) — le repli mécanique `humanize()` (capitale
    // initiale, `_`→espace) suffit à observer la déduplication sans dépendre d'un libellé rédigé qui
    // pourrait changer. Reproduit la forme exacte du défaut D19 (« … et MCG disponible et TBR > 4 **et
    // MCG disponible** et CV > 36 »), à noms de critère près.
    expect(
      describeReasons(['champ_teste == true AND valeur > 4 AND champ_teste == true AND autre_champ > 36']),
    ).toBe('Champ teste et Valeur > 4 et Autre champ > 36')
  })

  it('une conjonction SANS doublon reste inchangée', () => {
    expect(describeReasons(['age >= 75 AND fragilite == true'])).toBe('Âge ≥ 75 et Fragilité')
  })

  it('deux branches `OR` qui partagent un littéral gardent CHACUNE le sien — pas de déduplication ENTRE branches', () => {
    // Chaque branche `OR` est un cas clinique distinct (T-144 fait qu'une seule est rendue de toute
    // façon pour un patient donné) : la déduplication de T-145 ne doit jamais déborder sur le `OR`.
    expect(describeReasons(['age >= 75 AND fragilite == true OR fragilite == true'])).toBe(
      'Âge ≥ 75 et Fragilité ou Fragilité',
    )
  })
})

describe('déduplication des littéraux dans une conjonction (T-145) — `describeNonApplicable`', () => {
  it('un littéral répété dans une conjonction non retenue n’est rendu qu’une fois', () => {
    expect(describeNonApplicable('champ_teste == true AND champ_teste == true AND valeur > 4')).toBe(
      "ne s'applique pas : il faudrait champ teste et Valeur > 4",
    )
  })
})
