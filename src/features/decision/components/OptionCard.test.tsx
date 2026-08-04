/**
 * SB3 (P6, 2026-07-28) — T-040 : bordure gauche par verbe d'action (`option.action`).
 *
 * CONTRE-INDICATIONS — REFONDU le 2026-08-01 par P11/S6 (T-111, « carte en une ligne »). Après SB3
 * (un dépli partagé avec l'argumentaire) puis deux revers le même jour (posologie toujours visible,
 * puis dépli sécurité propre et distinct — cf. l'historique complet dans la docstring de tête
 * d'`OptionCard.tsx`), l'arbitrage référent « carte en une ligne, tout au clic » remplace les DEUX
 * `<details>` par QUATRE panneaux `hidden`, toujours rendus dans le DOM (`--pourquoi`, `--posologie`,
 * `--ci`, `--argumentaire`), ouverts un par un via des `PastilleInfo` (S3) dans la rangée. Les tests
 * ci-dessous vérifient cette structure ; les garanties de fond restent les mêmes : une contre-
 * indication n'est jamais silencieusement omise, et le décompte affiché reste exact.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Option } from '../content/node.types'
import type { ContreIndicationEvaluee } from '../engine/evaluateNode'
import { evaluerContreIndications } from '../engine/evaluateNode'
import type { CalculAffiche, CalculEnAttente } from '../lib/vueDecision'
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
 * `calculsEnAttente` (P11/S6) : ajouté en 4e paramètre optionnel pour les tests du ton `attention` de
 * la pastille posologie, défaut `[]` pour ne rien changer aux appels existants.
 */
function rendreCarte(
  option: Option,
  calculs: CalculAffiche[] = [],
  contreIndications?: ContreIndicationEvaluee[],
  calculsEnAttente: CalculEnAttente[] = [],
) {
  return renderToStaticMarkup(
    <OptionCard
      option={option}
      badge={null}
      reasons={['toujours']}
      calculs={calculs}
      calculsEnAttente={calculsEnAttente}
      motifRang={undefined}
      alertes={[]}
      contreIndications={contreIndications}
    />,
  )
}

describe('OptionCard — panneaux P11/S6 (carte compacte à pastilles, 2026-08-01, T-111)', () => {
  it('place le bloc de contre-indications DANS le panneau --ci, qui précède le panneau --argumentaire', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['Grossesse.', 'Allaitement.'] }))

    const indexPanneauCi = html.indexOf('option-card__panneau--ci')
    const indexCi = html.indexOf('option-card__ci"')
    const indexPanneauArgumentaire = html.indexOf('option-card__panneau--argumentaire')

    expect(indexPanneauCi).toBeGreaterThan(-1)
    expect(indexCi).toBeGreaterThan(-1)
    expect(indexCi).toBeGreaterThan(indexPanneauCi) // dans le panneau, pas avant
    expect(indexCi).toBeLessThan(indexPanneauArgumentaire) // le panneau ci précède celui de l'argumentaire
  })

  it('les QUATRE panneaux (`--pourquoi`, `--posologie`, `--ci`, `--argumentaire`) sont TOUJOURS rendus, avec ou sans contre-indication', () => {
    const avecCi = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }))
    const sansCi = rendreCarte(optionDeBase())

    for (const html of [avecCi, sansCi]) {
      expect((html.match(/option-card__panneau--(pourquoi|posologie|ci|argumentaire)/g) ?? []).length).toBe(4)
    }
  })

  it("sans aucune contre-indication déclarée, le panneau --ci reste vide et aucune pastille « Contre-indications » n'apparaît dans la rangée", () => {
    const html = rendreCarte(optionDeBase())

    expect(html).not.toContain('option-card__ci"')
    expect(html).not.toContain('option-card__ci--levee')
    expect(html).not.toContain('aria-label="Contre-indications"')
  })

  it('place le panneau --posologie AVANT le panneau --ci (deux panneaux distincts, posologie puis sécurité, cet ordre)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }), [
      { libelle: 'Dose', valeur: 10, unite: 'U/j' },
    ])

    const indexPanneauPosologie = html.indexOf('option-card__panneau--posologie')
    const indexPanneauCi = html.indexOf('option-card__panneau--ci')

    expect(indexPanneauPosologie).toBeGreaterThan(-1)
    expect(indexPanneauCi).toBeGreaterThan(-1)
    expect(indexPanneauPosologie).toBeLessThan(indexPanneauCi)
  })

  // §5/§6 du garde-fou I12 (`carte-affichage.test.tsx`) au niveau du composant seul : le ton porte
  // désormais le signal de sécurité, à la place de l'ex-icône ⚠ (supprimée, P11/S6 étape 7).
  it('quand des contre-indications ACTIVES existent, la pastille « Contre-indications » porte le ton `danger`', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.', 'Autre CI.'] }))

    expect(html).toContain('aria-label="Contre-indications"')
    expect(html).toContain('pastille-info--danger')
    expect(html).toContain('2 contre-indications')
  })

  it('le décompte du panneau --ci s’accorde au singulier pour une seule contre-indication ACTIVE', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }))

    expect(html).toContain('1 contre-indication')
    expect(html).not.toContain('1 contre-indications')
  })

  it("le panneau --pourquoi (« Proposé parce que ») reste séparé du panneau --ci, dans les deux sens", () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }))
    const indexPanneauPourquoi = html.indexOf('option-card__panneau--pourquoi')
    const indexPanneauPosologie = html.indexOf('option-card__panneau--posologie')
    const panneauPourquoi = html.slice(indexPanneauPourquoi, indexPanneauPosologie)

    expect(panneauPourquoi).toContain('Proposé parce que')
    expect(panneauPourquoi).not.toContain('option-card__ci')
  })

  it('les quatre panneaux portent `hidden` au rendu statique (aucun ouvert par défaut)', () => {
    const html = rendreCarte(optionDeBase({ contre_indications: ['CI de test.'] }), [
      { libelle: 'Dose', valeur: 10, unite: 'U/j' },
    ])
    for (const nom of ['pourquoi', 'posologie', 'ci', 'argumentaire']) {
      const indexPanneau = html.indexOf(`option-card__panneau--${nom}`)
      const finBalise = html.indexOf('>', indexPanneau)
      expect(html.slice(indexPanneau, finBalise)).toContain('hidden')
    }
  })
})

/**
 * P12/S10 (T-136, arbitrage référent du 2026-08-02, point 4) — « quand un écran ne porte qu'une seule
 * option, sa carte s'affiche ouverte ». La carte ne le sait jamais par elle-même (elle ne voit pas ses
 * sœurs) : `carteUnique` est une prop transmise par l'appelant (`DecisionNodeScreen.tsx`, sur
 * `optionsRenduesCount === 1` — le compte des options AFFICHÉES, T-113). Ici, on ne teste que l'effet de
 * la prop sur LE COMPOSANT, indépendamment de qui la calcule.
 */
describe('OptionCard — carteUnique (P12/S10, T-136 : carte seule sur son écran = carte dépliée)', () => {
  it('par défaut (`carteUnique` omis) : comportement inchangé, les quatre panneaux restent fermés', () => {
    const html = rendreCarte(optionDeBase())
    for (const nom of ['pourquoi', 'posologie', 'ci', 'argumentaire']) {
      const indexPanneau = html.indexOf(`option-card__panneau--${nom}`)
      const finBalise = html.indexOf('>', indexPanneau)
      expect(html.slice(indexPanneau, finBalise)).toContain('hidden')
    }
  })

  it('`carteUnique={true}` : le panneau --preuves est ouvert par défaut (pas de `hidden`)', () => {
    const html = renderToStaticMarkup(
      <OptionCard
        option={optionDeBase()}
        badge={null}
        reasons={['toujours']}
        calculs={[]}
        calculsEnAttente={[]}
        motifRang={undefined}
        alertes={[]}
        carteUnique
      />,
    )
    const indexPanneau = html.indexOf('option-card__panneau--preuves')
    const finBalise = html.indexOf('>', indexPanneau)
    expect(html.slice(indexPanneau, finBalise)).not.toContain('hidden')
  })

  it('`carteUnique={true}` : les quatre autres panneaux restent fermés (un seul panneau change d’état initial)', () => {
    const html = renderToStaticMarkup(
      <OptionCard
        option={optionDeBase({ contre_indications: ['CI de test.'], apercu: 'dose fixe' })}
        badge={null}
        reasons={['toujours']}
        calculs={[]}
        calculsEnAttente={[]}
        motifRang={undefined}
        alertes={[]}
        carteUnique
      />,
    )
    // `--argumentaire` rejoint la liste des panneaux fermés le 2026-08-04 : l'argument EBM a déménagé
    // dans `--preuves`, qui est désormais le seul ouvert d'office.
    for (const nom of ['pourquoi', 'posologie', 'ci', 'argumentaire']) {
      const indexPanneau = html.indexOf(`option-card__panneau--${nom}`)
      const finBalise = html.indexOf('>', indexPanneau)
      expect(html.slice(indexPanneau, finBalise), `panneau --${nom}`).toContain('hidden')
    }
  })

  it("`carteUnique={true}` : l'argument EBM (`effet_attendu`) est lisible dans le HTML sans dépendre d'un clic — c'est exactement ce que la régression P11 (recette N2) avait mis derrière le chevron", () => {
    const html = renderToStaticMarkup(
      <OptionCard
        option={optionDeBase({
          effet_attendu: "Réduction de l'IDM non fatal, pas de la mortalité ; bénéfice absolu modeste.",
        })}
        badge={null}
        reasons={['toujours']}
        calculs={[]}
        calculsEnAttente={[]}
        motifRang={undefined}
        alertes={[]}
        carteUnique
      />,
    )
    // `--preuves` depuis le 2026-08-04 (l'effet chiffré y a déménagé) : c'est le CONTENU qui est
    // garanti lisible sans clic, pas un nom de panneau — l'intention de T-136 est inchangée.
    const indexPanneauPreuves = html.indexOf('option-card__panneau--preuves')
    const indexEffet = html.indexOf("Réduction de l&#x27;IDM non fatal")
    expect(indexEffet).toBeGreaterThan(indexPanneauPreuves)
    // Le panneau qui le porte n'est pas `hidden` : pas besoin de simuler un clic pour le lire.
    const finBalise = html.indexOf('>', indexPanneauPreuves)
    expect(html.slice(indexPanneauPreuves, finBalise)).not.toContain('hidden')
    // ET il ne reste pas en double dans `--argumentaire`, qui ne porte plus que les avantages et les
    // inconvénients.
    expect(html.indexOf("Réduction de l&#x27;IDM non fatal", html.indexOf('option-card__panneau--argumentaire'))).toBe(-1)
  })
})

describe('OptionCard — panneau posologie (P11/S6 amende D34 : la posologie passe derrière une pastille)', () => {
  it("`option.apercu` vit DANS le panneau --posologie, hidden par défaut — n'est PLUS jamais visible sans clic (c'est exactement ce que l'arbitrage référent du 2026-08-01, question 3, a tranché)", () => {
    const html = rendreCarte(
      optionDeBase({
        contre_indications: ['CI de test.', 'Autre CI.'],
        apercu: 'dapagliflozine 10 mg/j (fixe) ; empagliflozine 10→25 mg/j',
      }),
    )

    const indexRangee = html.indexOf('option-card__rangee')
    const indexPanneauPosologie = html.indexOf('option-card__panneau--posologie')
    const indexApercu = html.indexOf('option-card__apercu')

    expect(indexApercu).toBeGreaterThan(-1)
    expect(indexApercu).toBeGreaterThan(indexPanneauPosologie) // dans le panneau, pas avant
    expect(html).toContain('dapagliflozine 10 mg/j (fixe) ; empagliflozine 10→25 mg/j')
    // La rangée elle-même (avant le premier panneau) ne porte plus jamais le bloc VISIBLE de posologie
    // (`option-card__apercu`, même registre que le panneau). Le texte réapparaît bien dans la rangée,
    // mais UNIQUEMENT dans la bulle de survol de `PastilleInfo` (`aria-hidden`, masquée par CSS sauf
    // survol sur pointeur fin, S3) — ce n'est pas une régression de l'amendement D34 : cette bulle n'a
    // jamais été le canal accessible/tactile de l'information (cf. docstring `PastilleInfo.tsx`).
    const rangee = html.slice(indexRangee, html.indexOf('option-card__panneau--pourquoi'))
    expect(rangee).not.toContain('option-card__apercu')
  })

  it("n'affiche rien quand l'option ne porte pas d'aperçu (rendu inchangé)", () => {
    const html = rendreCarte(optionDeBase())
    expect(html).not.toContain('option-card__apercu')
  })

  // Défaut J (recette référent, 2026-07-27) : préservé par P11/S6 (étape 5) via le TON de la pastille,
  // maintenant que la ligne « Doses non calculées » n'est plus dans le socle.
  it('la pastille posologie porte le ton `attention` (registre ambre) quand une dose reste EN ATTENTE', () => {
    const html = rendreCarte(optionDeBase(), [], undefined, [
      { libelle: 'Dose initiale', criteresManquants: ['poids'] },
    ])

    expect(html).toContain('option-card__pastille-attention')
    expect(html).toContain('à renseigner :')
  })

  it("la pastille posologie reste au ton neutre (pas d'attention) quand il n'y a AUCUNE dose en attente", () => {
    const html = rendreCarte(optionDeBase({ apercu: 'dose fixe' }))
    expect(html).not.toContain('option-card__pastille-attention')
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
    // P11/S6 : le ⚠ a disparu (étape 7), le ton `danger` de la pastille porte désormais ce signal.
    expect(html).toContain('pastille-info--danger')
  })

  it('toutes les contre-indications levées : le panneau --ci existe TOUJOURS (rien à cacher), mais la pastille reste au ton neutre — plus d’affordance de danger à tort', () => {
    const ci = [{ texte: 'Grossesse.', condition: 'grossesse == true' }]
    const html = rendreCarte(optionDeBase({ contre_indications: ci }), [], evaluerContreIndications(ci, { grossesse: false }))

    // Plus d'affordance de danger sur la pastille fermée : c'est exactement ce que T-068 demande (ne
    // plus alerter à tort). Mais le panneau --ci, lui, existe toujours — la CI levée doit rester
    // consultable quelque part, et sa place est ici, pas dans l'argumentaire (P11/S6).
    expect(html).not.toContain('option-card__ci"') // pas de bloc ACTIF (aucune CI active)
    expect(html).not.toContain('pastille-info--danger')
    // La pastille « Contre-indications » existe (il y a bien une CI déclarée, levée), au ton neutre.
    expect(html).toContain('aria-label="Contre-indications"')
    expect(html).toContain('pastille-info--neutre')
    // Mais l'information n'a pas disparu pour autant : le bloc levée est bien dans ce panneau.
    expect(html).toContain('option-card__ci--levee')
    expect(html).toContain('Ne s&#x27;applique pas à ce patient : ')
    expect(html).toContain('Grossesse.')
    // Les quatre panneaux existent toujours (P11/S6), pas seulement « ci » + « argumentaire ».
    expect((html.match(/option-card__panneau--(pourquoi|posologie|ci|argumentaire)/g) ?? []).length).toBe(4)
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
