import { describe, expect, it } from 'vitest'
import { describeReasons } from './conditionText'

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
    expect(positif).toBe('Traitements en cours comprend Gliptine (iDPP4)')

    const negatif = describeReasons(['traitements_en_cours ne_contient_pas aGLP1'])
    expect(negatif).not.toContain('ne_contient_pas')
    expect(negatif).toContain('ne comprend pas')
  })
})
