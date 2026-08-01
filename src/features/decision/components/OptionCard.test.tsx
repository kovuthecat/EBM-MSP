/**
 * SB3 (P6, 2026-07-28) — T-040 : bordure gauche par verbe d'action (`option.action`).
 *
 * CONTRE-INDICATIONS — DEUX PASSAGES LE 2026-08-01. Un premier correctif (matin) avait sorti les
 * contre-indications ACTIVES hors de tout dépli, dans une zone TOUJOURS visible, pour corriger le
 * défaut mesuré en recette (la posologie se lisait à travers un avertissement rouge). Rendu au
 * référent, celui-ci a demandé un second passage LE MÊME JOUR : la posologie reste toujours visible
 * (acquis conservé), mais la sécurité ne doit pas devenir une bannière permanente du socle — elle
 * retourne derrière SON PROPRE dépli, distinct de celui de l'argumentaire, REPLIÉ PAR DÉFAUT (comme
 * avant le premier correctif), mais dont le `<summary>` FERMÉ passe en registre rouge dès qu'au moins
 * une contre-indication n'est pas écartée (D20/T-068). Les tests ci-dessous vérifient cette structure à
 * DEUX `<details>` ; les garanties structurelles restent les mêmes : une contre-indication n'est jamais
 * silencieusement omise, et une option sans contre-indication ne réserve toujours aucun espace.
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

describe('OptionCard — dépli sécurité, propre et distinct de l’argumentaire (second passage 2026-08-01)', () => {
  it('place le bloc de contre-indications DANS un <details>, AVANT celui de l’argumentaire', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['Grossesse.', 'Allaitement.'] }))

    const indexPremierDetails = html.indexOf('<details')
    const indexCi = html.indexOf('option-card__ci"')
    const indexArgumentaire = html.indexOf('Proposé parce que, effet attendu et plus')

    expect(indexPremierDetails).toBeGreaterThan(-1)
    expect(indexCi).toBeGreaterThan(-1)
    expect(indexCi).toBeGreaterThan(indexPremierDetails) // dans un <details>, pas avant
    expect(indexCi).toBeLessThan(indexArgumentaire) // le dépli sécurité précède celui de l'argumentaire
  })

  it('deux <details> SÉPARÉS existent quand il y a une contre-indication (pas un seul dépli partagé)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }))
    const nombreDetails = (html.match(/<details/g) ?? []).length
    expect(nombreDetails).toBe(2)
  })

  it("une seule <details> quand il n'y a AUCUNE contre-indication (le dépli sécurité ne réserve aucun espace)", () => {
    const html = rendreCarte(optionDeBase())
    const nombreDetails = (html.match(/<details/g) ?? []).length
    expect(nombreDetails).toBe(1)
    expect(html).not.toContain('option-card__ci')
  })

  it('place le bloc de contre-indications APRÈS les doses (posologie visible sans déplier, sécurité derrière son dépli)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }), [
      { libelle: 'Dose', valeur: 10, unite: 'U/j' },
    ])

    const indexCalculs = html.indexOf('option-card__calculs')
    const indexCi = html.indexOf('option-card__ci"')

    expect(indexCalculs).toBeGreaterThan(-1)
    expect(indexCi).toBeGreaterThan(-1)
    expect(indexCalculs).toBeLessThan(indexCi)
  })

  // SB6 (P6, 2026-07-29), RESTAURÉ le 2026-08-01 (second passage) : l'icône ⚠, la couleur d'alerte
  // dédiée et le décompte exact reviennent sur le `<summary>` FERMÉ du dépli sécurité — replié par
  // défaut, mais reconnaissable de loin.
  it('le <summary> du dépli sécurité porte l’icône ⚠, la couleur d’alerte dédiée et le décompte quand des contre-indications ACTIVES existent', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.', 'Autre CI.'] }))

    expect(html).toContain('option-card__detail-summary--ci')
    expect(html).toContain('⚠')
    expect(html).toContain('2 contre-indications')
    expect(html).not.toContain('Contre-indications (aucune active)')
  })

  it('le <summary> accorde le décompte au singulier pour une seule contre-indication ACTIVE', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }))

    expect(html).toContain('1 contre-indication')
    expect(html).not.toContain('1 contre-indications')
  })

  it("le <summary> de l'ARGUMENTAIRE reste TOUJOURS neutre, même quand la carte porte des contre-indications actives", () => {
    const avecCi = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }))
    const sansCi = rendreCarte(optionDeBase())

    expect(avecCi).toContain('Proposé parce que, effet attendu et plus')
    expect(sansCi).toContain('Proposé parce que, effet attendu et plus')
    // La couleur d'alerte (`--ci`) ne doit JAMAIS être posée sur le <summary> de l'argumentaire — seul
    // celui du dépli sécurité peut la porter (vérifié en cherchant la classe sur CE <summary> précis).
    const summaryArgumentaire = avecCi.slice(avecCi.indexOf('Proposé parce que, effet attendu et plus') - 200)
    expect(summaryArgumentaire.slice(0, 200)).not.toContain('option-card__detail-summary--ci')
  })
})

describe('OptionCard — zone posologie (option.apercu, correctif 2026-08-01, CONSERVÉ tel quel au second passage)', () => {
  it("affiche `option.apercu` en dehors de TOUT dépli, en registre neutre, même quand la carte porte des contre-indications actives", () => {
    const html = rendreCarte(
      optionDeBase({
        contre_indications: ['CI de test.', 'Autre CI.'],
        apercu: 'dapagliflozine 10 mg/j (fixe) ; empagliflozine 10→25 mg/j',
      }),
    )

    const indexPremierDetails = html.indexOf('<details')
    const indexApercu = html.indexOf('option-card__apercu')

    expect(indexApercu).toBeGreaterThan(-1)
    expect(indexApercu).toBeLessThan(indexPremierDetails) // visible sans déplier, avant le premier dépli
    expect(html).toContain('dapagliflozine 10 mg/j (fixe) ; empagliflozine 10→25 mg/j')
    // Le texte de l'aperçu ne doit plus jamais apparaître concaténé au décompte du dépli sécurité.
    const summaryCi = html.slice(html.indexOf('option-card__detail-summary--ci'), html.indexOf('option-card__detail-summary--ci') + 300)
    expect(summaryCi).not.toContain('dapagliflozine')
  })

  it("n'affiche rien quand l'option ne porte pas d'aperçu (rendu inchangé)", () => {
    const html = rendreCarte(optionDeBase())
    expect(html).not.toContain('option-card__apercu')
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
    // Le bloc désamorcé vient APRÈS le bloc actif, TOUJOURS DANS LE MÊME DÉPLI SÉCURITÉ (second passage
    // 2026-08-01 : une CI levée reste avec la sécurité, elle ne rejoint pas l'argumentaire).
    expect(html.indexOf('option-card__ci--levee')).toBeGreaterThan(html.indexOf('option-card__ci"'))
  })

  it('LE DÉFAUT VISÉ (T-068) : le décompte du dépli sécurité ne compte plus la contre-indication levée (3, pas 4)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: CI_QUATRE_ETATS }), [], contreIndicationsDuProfil())

    expect(html).toContain('3 contre-indications : ')
    expect(html).not.toContain('4 contre-indications')
  })

  it('une contre-indication INDÉTERMINÉE compte dans le décompte (elle est affichée comme active — D20)', () => {
    // Sans ce test, on pourrait « ne compter que les actives » au sens strict et annoncer 2 pendant que
    // la zone sécurité en montre 3 : le chiffre affiché doit être celui des lignes réellement montrées.
    const html = rendreCarte(
      optionDeBase({ contre_indications: [{ texte: 'Insuffisance cardiaque.', condition: 'IC == true' }] }),
      [],
      evaluerContreIndications([{ texte: 'Insuffisance cardiaque.', condition: 'IC == true' }], { IC: false }, new Set()),
    )
    expect(html).toContain('1 contre-indication : ')
    expect(html).toContain('⚠')
  })

  it('toutes les contre-indications levées : le dépli sécurité existe TOUJOURS (rien à cacher), mais son <summary> fermé reste neutre — plus d’affordance de danger à tort', () => {
    const ci = [{ texte: 'Grossesse.', condition: 'grossesse == true' }]
    const html = rendreCarte(optionDeBase({ contre_indications: ci }), [], evaluerContreIndications(ci, { grossesse: false }))

    // Plus d'affordance de danger sur le <summary> fermé : c'est exactement ce que T-068 demande (ne
    // plus alerter à tort). Mais le dépli sécurité, lui, existe toujours — la CI levée doit rester
    // consultable quelque part, et sa place est ici, pas dans l'argumentaire (second passage 2026-08-01).
    expect(html).not.toContain('option-card__ci"') // pas de bloc ACTIF (aucune CI active)
    expect(html).not.toContain('⚠')
    expect(html).not.toContain('option-card__detail-summary--ci')
    expect(html).toContain('Contre-indications (aucune active)')
    // Mais l'information n'a pas disparu pour autant : le bloc levée est bien dans ce dépli.
    expect(html).toContain('option-card__ci--levee')
    expect(html).toContain('Ne s&#x27;applique pas à ce patient : ')
    expect(html).toContain('Grossesse.')
    const nombreDetails = (html.match(/<details/g) ?? []).length
    expect(nombreDetails).toBe(2) // dépli sécurité (avec la levée) + dépli argumentaire
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
      '<span class="option-card__ci-label">2 contre-indications : </span>Grossesse. · Alcoolisme.',
    )
    expect(htmlRepli).not.toContain('option-card__ci--levee')
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

/**
 * P10/S2 (T-079) — LE CÂBLAGE de `Option.motifs`. `lib/conditionText.test.ts` couvre le formateur ;
 * ce qui se vérifie ICI est que la carte lui passe bien la carte de motifs de SON option, aux deux
 * lignes qui affichent des branches (« Proposé parce que », « Ce rang tient compte de »).
 */
describe('OptionCard — P10/S2 : motifs rédigés portés par l’option', () => {
  function rendreAvecRaisons(option: Option, reasons: string[], motifRang?: string[]) {
    return renderToStaticMarkup(
      <OptionCard
        option={option}
        badge={null}
        reasons={reasons}
        calculs={[]}
        calculsEnAttente={[]}
        motifRang={motifRang}
        alertes={[]}
      />,
    )
  }

  it('« Proposé parce que » affiche le motif rédigé de la branche satisfaite', () => {
    const option = optionDeBase({
      conditions: ['ASCVD_etablie == true OR IMC >= 30'],
      motifs: { 'ASCVD_etablie == true': 'Maladie cardiovasculaire établie' },
    })
    const html = rendreAvecRaisons(option, ['ASCVD_etablie == true'])
    expect(html).toContain('Proposé parce que : Maladie cardiovasculaire établie')
    expect(html).not.toContain('athéromateuse')
  })

  it('sans motif pour la branche satisfaite, la carte rend exactement ce qu’elle rendait avant T-079', () => {
    const conditions = ['ASCVD_etablie == true OR IMC >= 30']
    const avecCarteInutile = rendreAvecRaisons(
      optionDeBase({ conditions, motifs: { 'IMC >= 30': 'Obésité' } }),
      ['ASCVD_etablie == true'],
    )
    const sansCarte = rendreAvecRaisons(optionDeBase({ conditions }), ['ASCVD_etablie == true'])
    expect(avecCarteInutile).toBe(sansCarte)
    expect(sansCarte).toContain('Proposé parce que : Maladie cardiovasculaire athéromateuse établie')
  })

  it('« Ce rang tient compte de » consomme les mêmes motifs (R6 couche 2)', () => {
    const option = optionDeBase({
      conditions: ['ASCVD_etablie == true'],
      priorite: [{ quand: 'ASCVD_etablie == true', rang: 2 }],
      motifs: { 'ASCVD_etablie == true': 'Maladie cardiovasculaire établie' },
    })
    const html = rendreAvecRaisons(option, ['ASCVD_etablie == true'], ['ASCVD_etablie == true'])
    expect(html).toContain('Ce rang tient compte de : Maladie cardiovasculaire établie')
  })
})
