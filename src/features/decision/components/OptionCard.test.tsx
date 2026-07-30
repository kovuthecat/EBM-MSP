/**
 * SB3 (P6, 2026-07-28) — T-040 : bordure gauche par verbe d'action (`option.action`) + contre-
 * indications déplacées dans le dépli (`<details>`), en première position.
 *
 * CE FICHIER REMPLACE l'ancien garde-fou T-025 (P4/S4, même jour), qui figeait un ordre du DOM
 * (contre-indications AVANT le dépli) que SB3 inverse délibérément. Tension tranchée par Thibault le
 * 2026-07-28 : compactage accepté, mais pas au prix de l'accessibilité — d'où le libellé du `<summary>`
 * qui change selon la présence de contre-indications, seul indicateur requis carte FERMÉE
 * (`OptionCard.tsx`). Les mêmes garanties structurelles sont reconduites ICI, à la nouvelle position :
 * une contre-indication n'est jamais silencieusement omise, toujours EN TÊTE du dépli (avant l'effet
 * attendu, avant avantages/inconvénients), et une option sans contre-indication ne réserve toujours
 * aucun espace.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Option } from '../content/node.types'
import type { ContreIndicationEvaluee } from '../engine/evaluateNode'
import { evaluerContreIndications } from '../engine/evaluateNode'
import type { CalculAffiche } from '../lib/vueDecision'
import { OptionCard } from './OptionCard'

function optionDeBase(overrides: Partial<Option> = {}): Option {
  return {
    intitule: 'Option de test',
    role: 'geste',
    avantages: ['Avantage de test.'],
    inconvenients: ['Inconvénient de test.'],
    effet_attendu: 'Effet attendu de test (non chiffrable).',
    niveau_preuve: 'modere',
    conditions: ['toujours'],
    ...overrides,
  }
}

/**
 * Rendu d'une carte. `contreIndications` est volontairement OMIS par défaut : les tests SB3/SB6
 * ci-dessous rendent donc la carte exactement comme avant T-068 (repli « toutes actives », cf.
 * `OptionCard.tsx`) — c'est ce qui fait d'eux, tels quels, le test de non-régression de T-068.
 */
function rendreCarte(option: Option, calculs: CalculAffiche[] = [], contreIndications?: ContreIndicationEvaluee[]) {
  return renderToStaticMarkup(
    <OptionCard
      option={option}
      badge={null}
      reasons={['toujours']}
      calculs={calculs}
      calculsEnAttente={[]}
      motifRang={undefined}
      alertes={[]}
      contreIndications={contreIndications}
    />,
  )
}

describe('OptionCard — SB3/T-040 (contre-indications dans le dépli, en tête)', () => {
  it("place le bloc de contre-indications À L'INTÉRIEUR du <details>, avant l'effet attendu", () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['Grossesse.', 'Allaitement.'] }))

    const indexDetails = html.indexOf('<details')
    const indexCi = html.indexOf('option-card__ci')
    const indexEffet = html.indexOf('option-card__effet')

    expect(indexDetails).toBeGreaterThan(-1)
    expect(indexCi).toBeGreaterThan(indexDetails) // DANS le dépli désormais, plus avant lui (inverse de T-025)
    expect(indexCi).toBeLessThan(indexEffet)
  })

  it('place le bloc de contre-indications AVANT avantages/inconvénients (toujours en tête du dépli)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }))

    const indexCi = html.indexOf('option-card__ci')
    const indexLists = html.indexOf('option-card__lists')

    expect(indexCi).toBeGreaterThan(-1)
    expect(indexLists).toBeGreaterThan(-1)
    expect(indexCi).toBeLessThan(indexLists)
  })

  it('place le bloc de contre-indications APRÈS les doses (désormais dans le dépli, plus dans le socle)', () => {
    // Inverse du garde-fou T-025 : les doses restent dans le socle (avant le dépli), la contre-
    // indication l'a quitté — cette bascule EST le changement que T-040 demande.
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }), [
      { libelle: 'Dose', valeur: 10, unite: 'U/j' },
    ])

    const indexCalculs = html.indexOf('option-card__calculs')
    const indexCi = html.indexOf('option-card__ci')

    expect(indexCalculs).toBeGreaterThan(-1)
    expect(indexCi).toBeGreaterThan(indexCalculs)
  })

  it("ne réserve aucun espace quand l'option n'a pas de contre-indication", () => {
    const html = rendreCarte(optionDeBase())

    expect(html).not.toContain('option-card__ci')
  })

  // SB6 (P6, 2026-07-29) — le libellé neutre ci-dessus (sans icône ni couleur d'alerte) est justement
  // ce que la recette de contrôle S6 a mesuré comme insuffisant (0 information retenue au test des 20
  // secondes) : ces deux tests remplacent les anciennes assertions sur le texte fixe
  // « Contre-indications, effet attendu et plus », que le référent a explicitement libéré (« le texte
  // exact n'est pas figé », `plans/P6/SB6.md`).
  it('le <summary> porte l’icône ⚠, la couleur d’alerte dédiée et le décompte quand des contre-indications existent (SB6)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.', 'Autre CI.'] }))

    expect(html).toContain('option-card__detail-summary--ci')
    expect(html).toContain('⚠')
    expect(html).toContain('2 contre-indications, effet attendu et plus')
    expect(html).not.toContain('Effet attendu, avantages et inconvénients')
  })

  it('le <summary> accorde le décompte au singulier pour une seule contre-indication (SB6)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }))

    expect(html).toContain('1 contre-indication, effet attendu et plus')
    expect(html).not.toContain('1 contre-indications')
  })

  it("le <summary> annonce « Effet attendu, avantages et inconvénients » en leur absence, SANS icône ni couleur d'alerte — c'est l'unique indicateur carte fermée", () => {
    const html = rendreCarte(optionDeBase())

    expect(html).toContain('Effet attendu, avantages et inconvénients')
    expect(html).not.toContain('⚠')
    expect(html).not.toContain('option-card__detail-summary--ci')
  })
})

/**
 * T-068 (P9 · S1, 2026-07-30) — UNE CONTRE-INDICATION VÉRIFIABLE SE DÉSAMORCE.
 *
 * Le profil de référence est celui demandé par la tâche : QUATRE contre-indications sur la MÊME option et
 * le MÊME patient — une à condition vraie, une à condition fausse, une à condition indéterminée, une sans
 * condition. C'est le seul montage qui prouve que les quatre chemins cohabitent (un test par état, sur
 * quatre options différentes, ne dirait rien du décompte ni de l'ordre).
 */
describe('OptionCard — T-068 (contre-indications vérifiables : active / levée / indéterminée)', () => {
  /** Les 4 contre-indications du profil de référence, dans l'ordre du contenu. */
  const CI_QUATRE_ETATS = [
    { texte: 'Insuffisance rénale sévère.', condition: 'DFG < 30' }, // VRAIE ici (DFG = 20) → active
    { texte: 'Grossesse.', condition: 'grossesse == true' }, // FAUSSE ici → levée
    { texte: 'Insuffisance cardiaque.', condition: 'insuffisance_cardiaque == true' }, // non renseignée → indéterminée
    'Alcoolisme.', // non vérifiable automatiquement → affichée, comme avant T-068
  ]

  /** Le même patient pour les quatre : DFG bas, pas de grossesse, statut cardiaque NON renseigné. */
  const contreIndicationsDuProfil = () =>
    evaluerContreIndications(
      CI_QUATRE_ETATS,
      { DFG: 20, grossesse: false, insuffisance_cardiaque: false },
      new Set(['DFG', 'grossesse']),
    )

  it('les quatre états sont bien ceux attendus pour ce profil (le montage lui-même, avant tout rendu)', () => {
    expect(contreIndicationsDuProfil()).toEqual([
      { texte: 'Insuffisance rénale sévère.', etat: 'active' },
      { texte: 'Grossesse.', etat: 'levee' },
      { texte: 'Insuffisance cardiaque.', etat: 'indetermine' },
      { texte: 'Alcoolisme.', etat: 'active' },
    ])
  })

  it('active, indéterminée et sans condition restent dans le bloc d’alerte ; la levée n’y est PAS', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: CI_QUATRE_ETATS }), [], contreIndicationsDuProfil())
    const blocActif = html.slice(html.indexOf('option-card__ci"'), html.indexOf('option-card__ci option-card__ci--levee'))

    expect(blocActif).toContain('Insuffisance rénale sévère.')
    expect(blocActif).toContain('Insuffisance cardiaque.') // D20 : indéterminée = affichée normalement
    expect(blocActif).toContain('Alcoolisme.')
    expect(blocActif).not.toContain('Grossesse.')
  })

  it('la contre-indication levée est DÉSAMORCÉE, PAS EFFACÉE : elle reste dans le rendu, dans son propre bloc, avec la raison', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: CI_QUATRE_ETATS }), [], contreIndicationsDuProfil())

    expect(html).toContain('option-card__ci--levee')
    // `renderToStaticMarkup` échappe l'apostrophe (`&#x27;`) : on cherche la chaîne telle qu'elle est
    // réellement rendue, pas telle qu'elle est écrite dans le composant.
    expect(html).toContain('Ne s&#x27;applique pas à ce patient : ')
    expect(html).toContain('Grossesse.')
    // Le bloc désamorcé vient APRÈS le bloc d'alerte (l'actif garde la tête du dépli, SB3).
    expect(html.indexOf('option-card__ci--levee')).toBeGreaterThan(html.indexOf('option-card__ci"'))
  })

  it('LE DÉFAUT VISÉ : le décompte du <summary> ne compte plus la contre-indication levée (3, pas 4)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: CI_QUATRE_ETATS }), [], contreIndicationsDuProfil())

    expect(html).toContain('3 contre-indications, effet attendu et plus')
    expect(html).not.toContain('4 contre-indications')
  })

  it('une contre-indication INDÉTERMINÉE compte dans le décompte (elle est affichée comme active — D20)', () => {
    // Sans ce test, on pourrait « ne compter que les actives » au sens strict et annoncer 2 pendant que le
    // dépli en montre 3 : le chiffre de la carte fermée doit être celui des lignes qu'on lit en l'ouvrant.
    const html = rendreCarte(
      optionDeBase({ contre_indications: [{ texte: 'Insuffisance cardiaque.', condition: 'IC == true' }] }),
      [],
      evaluerContreIndications([{ texte: 'Insuffisance cardiaque.', condition: 'IC == true' }], { IC: false }, new Set()),
    )
    expect(html).toContain('1 contre-indication, effet attendu et plus')
    expect(html).toContain('⚠')
  })

  it('toutes les contre-indications levées : plus AUCUNE alerte annoncée carte fermée, mais le fait reste lisible dans le dépli', () => {
    const ci = [{ texte: 'Grossesse.', condition: 'grossesse == true' }]
    const html = rendreCarte(optionDeBase({ contre_indications: ci }), [], evaluerContreIndications(ci, { grossesse: false }))

    // Plus d'affordance de danger : c'est exactement ce que la tâche demande (ne plus alerter à tort).
    expect(html).toContain('Effet attendu, avantages et inconvénients')
    expect(html).not.toContain('⚠')
    expect(html).not.toContain('option-card__detail-summary--ci')
    // Mais l'information n'a pas disparu pour autant.
    expect(html).toContain('Ne s&#x27;applique pas à ce patient : ')
    expect(html).toContain('Grossesse.')
  })

  it('NON-RÉGRESSION : contre-indications sans condition → rendu STRICTEMENT identique, que l’état soit calculé ou non fourni', () => {
    const option = optionDeBase({ contre_indications: ['Grossesse.', 'Alcoolisme.'] })
    // (a) via le repli du composant (aucune prop) — le chemin qu'empruntait tout appelant avant T-068 ;
    // (b) via le modèle de vue, sur un contenu sans `condition`. Les deux HTML doivent être IDENTIQUES,
    // et le bloc de contre-indications rester la simple liste jointe par ' · ' d'avant ce lot.
    const htmlRepli = rendreCarte(option)
    const htmlCalcule = rendreCarte(option, [], evaluerContreIndications(option.contre_indications, {}))

    expect(htmlCalcule).toBe(htmlRepli)
    expect(htmlRepli).toContain(
      '<span class="option-card__ci-label">Contre-indications : </span>Grossesse. · Alcoolisme.',
    )
    expect(htmlRepli).not.toContain('option-card__ci--levee')
    expect(htmlRepli).toContain('2 contre-indications, effet attendu et plus')
  })

  it('NON-RÉGRESSION : la forme OBJET sans condition rend exactement comme la forme chaîne', () => {
    const chaines = rendreCarte(optionDeBase({ contre_indications: ['Grossesse.'] }))
    const objets = rendreCarte(optionDeBase({ contre_indications: [{ texte: 'Grossesse.' }] }))
    expect(objets).toBe(chaines)
  })
})

describe('OptionCard — SB3/T-040 (bordure gauche par verbe d’action)', () => {
  // Extrait la valeur de l'attribut `class` du <div> racine (React SSR : `class`, pas `className`).
  function classeRacine(html: string): string {
    const match = html.match(/^<div class="([^"]*)"/)
    if (!match) throw new Error('div racine introuvable dans le HTML rendu')
    return match[1]
  }

  it('option.action = "ajouter" → classe option-card--action-ajouter', () => {
    expect(classeRacine(rendreCarte(optionDeBase({ action: 'ajouter' })))).toBe('option-card option-card--action-ajouter')
  })

  it('option.action = "remplacer" → classe option-card--action-remplacer', () => {
    expect(classeRacine(rendreCarte(optionDeBase({ action: 'remplacer' })))).toBe(
      'option-card option-card--action-remplacer',
    )
  })

  it('option.action = "arreter" → classe option-card--action-arreter', () => {
    expect(classeRacine(rendreCarte(optionDeBase({ action: 'arreter' })))).toBe('option-card option-card--action-arreter')
  })

  it('option.action = "reduire" → classe option-card--action-reduire', () => {
    expect(classeRacine(rendreCarte(optionDeBase({ action: 'reduire' })))).toBe('option-card option-card--action-reduire')
  })

  it('option.action = "maintenir" → classe option-card--action-maintenir (réutilise --c-accent-decision)', () => {
    expect(classeRacine(rendreCarte(optionDeBase({ action: 'maintenir' })))).toBe(
      'option-card option-card--action-maintenir',
    )
  })

  it("option.action absent → aucune classe de bordure ajoutée (comportement actuel inchangé)", () => {
    const classe = classeRacine(rendreCarte(optionDeBase()))
    expect(classe).toBe('option-card')
    expect(classe).not.toMatch(/option-card--action-/)
  })
})
