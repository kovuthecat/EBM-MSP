/**
 * SB3 (P6, 2026-07-28) — T-040 : bordure gauche par verbe d'action (`option.action`).
 *
 * CONTRE-INDICATIONS — REFONDU le 2026-08-01 par P11/S6 (T-111, « carte en une ligne »). Après SB3
 * (un dépli partagé avec l'argumentaire) puis deux revers le même jour (posologie toujours visible,
 * puis dépli sécurité propre et distinct — cf. l'historique complet dans la docstring de tête
 * d'`OptionCard.tsx`), l'arbitrage référent « carte en une ligne, tout au clic » remplace les DEUX
 * `<details>` par des panneaux `hidden`, toujours rendus dans le DOM (`--pourquoi`, `--posologie`,
 * `--ci`, `--argumentaire`), ouverts un par un via des `PastilleInfo` (S3) dans la rangée. QUATRE à
 * l'écriture de ces tests ; un CINQUIÈME (`--preuves`, état des preuves) s'est ajouté le 2026-08-04 —
 * corrigé le 2026-08-11 (T-196, P15/S2) : ce commentaire annonçait encore QUATRE panneaux, cf. les tests
 * ci-dessous qui, eux, continuent délibérément de ne vérifier QUE ces quatre-là (title inchangé, portée
 * inchangée). Les garanties de fond restent les mêmes : une contre-indication n'est jamais
 * silencieusement omise, et le décompte affiché reste exact.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { CitationReco, Option, ReferencePrimaire } from '../content/node.types'
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
    // `option-card__apercu` a été remplacée le 2026-08-11 par `option-card__posologie-geste` — la ligne
    // « le geste et ses chiffres », qui porte `apercu` quand il est seul et `posologie_detail[0]` sinon.
    // L'intention de CE test est inchangée : ce bloc vit dans le panneau, jamais dans la rangée.
    const indexGeste = html.indexOf('option-card__posologie-geste')

    expect(indexGeste).toBeGreaterThan(-1)
    expect(indexGeste).toBeGreaterThan(indexPanneauPosologie) // dans le panneau, pas avant
    expect(html).toContain('dapagliflozine 10 mg/j (fixe) ; empagliflozine 10→25 mg/j')
    // ...et le panneau qui le porte est bien fermé : il faut toujours un clic pour le lire (D45).
    expect(html.slice(indexPanneauPosologie, html.indexOf('>', indexPanneauPosologie))).toContain('hidden')
    // La rangée elle-même (avant le premier panneau) ne porte plus jamais le bloc VISIBLE de posologie.
    // MISE À JOUR 2026-08-11 : ce commentaire disait jusqu'ici que le texte « réapparaît bien dans la
    // rangée, mais UNIQUEMENT dans la bulle de survol de `PastilleInfo` ». Ce n'est PLUS vrai — depuis le
    // 2026-08-04, cette bulle affiche le LIBELLÉ du bouton (« Posologie ») et `PastilleInfo` neutralise
    // sa prop `texte` par un `void` explicite. Le panneau est donc l'unique canal de ce texte. On
    // n'ASSERTE pourtant que l'absence de la classe, pas celle du texte : la bulle de survol reste un
    // canal légitime si une session future la rebranche, et ce test n'a jamais eu pour objet de
    // l'interdire (cf. docstring `PastilleInfo.tsx`).
    const rangee = html.slice(indexRangee, html.indexOf('option-card__panneau--pourquoi'))
    expect(rangee).not.toContain('option-card__posologie-geste')
  })

  it("n'affiche rien quand l'option ne porte ni aperçu ni détail de posologie (rendu inchangé)", () => {
    const html = rendreCarte(optionDeBase())
    expect(html).not.toContain('option-card__posologie-geste')
    expect(html).not.toContain('option-card__posologie-modalite')
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
 * R2 (2026-08-11) — `apercu` NE DOUBLE PLUS `posologie_detail` DANS LE PANNEAU.
 *
 * CE QUI EST EN JEU. `option.apercu` avait été créé par T-076 (P9/S9) pour le titre du `<summary>`
 * REPLIÉ ; P11/S6 a supprimé ce `<summary>` le 2026-08-01. Depuis, l'aperçu n'était plus qu'une première
 * ligne du panneau ouvert — redondante avec `posologie_detail[0]` (champ ajouté le 2026-08-04), qui dit
 * la même chose en plus précis et en sourcé.
 *
 * MAIS LE CORRECTIF NE PEUT PAS ÊTRE INCONDITIONNEL, et c'est tout l'objet de ces tests : 20 des 87
 * options portent `apercu` SANS `posologie_detail` — l'aperçu y EST tout le contenu de posologie du
 * panneau. Un rendu supprimé sans condition les viderait. Les deux branches sont donc couvertes ici au
 * niveau du COMPOSANT (une option synthétique par cas) ; `engine/banc/carte-affichage.test.tsx` tient la
 * même garantie sur les 87 options RÉELLES.
 */
describe('OptionCard — R2 : `apercu` conditionnel à l’absence de `posologie_detail`', () => {
  const APERCU = '+2 U si la glycémie à jeun reste haute 3 matins de suite, ou +10 % au-delà de 40 U/j'
  const DETAIL_GESTE =
    'Augmenter la basale de 2 U si la glycémie à jeun reste au-dessus de la cible 3 matins de suite (ebmfrance), ou de 10 % par paliers si la dose dépasse 40 U/j (SFD 2025, Avis 18).'
  const DETAIL_MODALITE = 'Réévaluer tous les 3 jours (HAS 2024, R.87).'

  /** Le panneau `--posologie` seul, découpé du panneau suivant (`--ci`). */
  function panneauPosologie(html: string): string {
    return html.slice(html.indexOf('option-card__panneau--posologie'), html.indexOf('option-card__panneau--ci'))
  }

  it('LE DÉFAUT VISÉ : avec les DEUX champs, l’aperçu n’est plus rendu dans le panneau — le praticien ne lit plus deux fois la même phrase', () => {
    const html = rendreCarte(optionDeBase({ apercu: APERCU, posologie_detail: [DETAIL_GESTE] }))

    expect(panneauPosologie(html)).not.toContain(APERCU)
    // Et nulle part ailleurs dans la carte : le seul rendu d'`apercu` était celui-là.
    expect(html).not.toContain(APERCU)
    // Ce qui reste est le détail, sourcé — l'information n'a pas été perdue, seule la redite l'a été.
    expect(panneauPosologie(html)).toContain(DETAIL_GESTE)
  })

  it('PÉRIMÈTRE (le cas qui interdit une suppression sèche) : avec `apercu` SEUL, il est TOUJOURS rendu — c’est là tout le contenu de posologie de 20 options', () => {
    const html = rendreCarte(optionDeBase({ apercu: APERCU }))

    expect(panneauPosologie(html)).toContain(APERCU)
    expect(panneauPosologie(html)).toContain('option-card__posologie-geste')
  })

  it('`posologie_detail: []` (tableau VIDE) compte comme absent : l’aperçu est rendu, le panneau n’est pas vidé par un champ déclaré mais sans contenu', () => {
    const html = rendreCarte(optionDeBase({ apercu: APERCU, posologie_detail: [] }))
    expect(panneauPosologie(html)).toContain(APERCU)
  })

  it('l’accès au panneau n’est jamais perdu : la pastille « Posologie » reste rendue dans les deux cas', () => {
    for (const option of [
      optionDeBase({ apercu: APERCU }),
      optionDeBase({ apercu: APERCU, posologie_detail: [DETAIL_GESTE] }),
    ]) {
      expect(rendreCarte(option)).toContain('aria-label="Posologie"')
    }
  })

  /**
   * DÉFAUT PRÉEXISTANT, corrigé le 2026-08-11 — INDÉPENDANT de R2, mais du même mécanisme d'affichage.
   * La garde qui décide de rendre la pastille posologie (`aDuContenuPosologie`, `OptionCard.tsx`)
   * n'interrogeait que `apercu`, `calculs` et `calculsEnAttente` : `posologie_detail` y manquait depuis
   * sa création (2026-08-04). Une option qui ne portait QUE ce champ voyait donc son panneau rendu et
   * rempli, mais sans aucune commande pour l'ouvrir — posologie inatteignable. Cas réel au jour du
   * correctif : « Envisager l'insuline » (`prescription.yaml`).
   */
  it('DÉFAUT PRÉEXISTANT : `posologie_detail` SEUL (ni aperçu ni calcul) rend bien une pastille « Posologie » — sans elle, le panneau était inatteignable', () => {
    const html = rendreCarte(optionDeBase({ posologie_detail: [DETAIL_GESTE, DETAIL_MODALITE] }))

    expect(html).toContain('aria-label="Posologie"')
    // ...et cette pastille commande BIEN le panneau posologie (et pas un autre) : c'est `aria-controls`,
    // pas le gestionnaire de clic, qui fait qu'une *disclosure* est utilisable au clavier et au lecteur
    // d'écran — même vérification que pour le badge de niveau de preuve dans le banc I12.
    const bouton = /<button[^>]*aria-label="Posologie"[^>]*>/.exec(html)?.[0]
    expect(bouton, 'aucune pastille « Posologie » dans la rangée').toBeTruthy()
    const cible = /aria-controls="([^"]+)"/.exec(bouton!)?.[1]
    expect(cible, 'la pastille posologie ne déclare aucun aria-controls').toBeTruthy()
    expect(html).toContain(`id="${cible}" class="option-card__panneau option-card__panneau--posologie"`)
    // Le contenu est bien là, derrière cette commande.
    expect(html).toContain(DETAIL_GESTE)
  })

  it('aucune pastille « Posologie » quand l’option ne déclare RIEN de posologique (garde inchangée dans ce sens)', () => {
    expect(rendreCarte(optionDeBase())).not.toContain('aria-label="Posologie"')
  })

  it('un seul bloc « geste » par carte, quelle que soit la combinaison de champs — jamais deux premières lignes concurrentes', () => {
    for (const option of [
      optionDeBase({ apercu: APERCU }),
      optionDeBase({ posologie_detail: [DETAIL_GESTE, DETAIL_MODALITE] }),
      optionDeBase({ apercu: APERCU, posologie_detail: [DETAIL_GESTE, DETAIL_MODALITE] }),
    ]) {
      const html = rendreCarte(option)
      expect((html.match(/option-card__posologie-geste/g) ?? []).length).toBe(1)
    }
  })
})

/**
 * R3 (2026-08-11) — HIÉRARCHIE DE LECTURE DU PANNEAU POSOLOGIE.
 *
 * Le panneau était du gris 12 px uniforme : l'aperçu, TOUS les paragraphes de `posologie_detail` et les
 * doses calculées partageaient le même registre (`.option-card__apercu` / `.option-card__calculs`,
 * `12px` + `--c-text-muted`). Les chiffres qui partent sur l'ordonnance avaient donc le poids visuel exact
 * des incises de sourçage. Ces tests fixent la RÉPARTITION EN CLASSES — les valeurs typographiques, elles,
 * vivent dans `OptionCard.css` et ne se testent pas ici (le rendu statique ne calcule aucun style).
 */
describe('OptionCard — R3 : le geste et ses chiffres au premier plan, les modalités en retrait', () => {
  const GESTE = 'Instauration (patient naïf) : 2 à 3 prises par jour, en milieu ou en fin de repas.'
  const MODALITE_1 = 'Augmenter par palier de une à deux semaines selon la tolérance digestive.'
  const MODALITE_2 = 'Adaptation au DFG : 3 g/j si DFG au-dessus de 60, 2 g/j si 45-59, 1 g/j si 30-44.'

  it('`posologie_detail[0]` est LE GESTE ; les paragraphes suivants sont des MODALITÉS, dans l’ordre du contenu', () => {
    const html = renderToStaticMarkup(
      <OptionCard
        option={optionDeBase({ posologie_detail: [GESTE, MODALITE_1, MODALITE_2] })}
        badge={null}
        reasons={['toujours']}
        calculs={[]}
        calculsEnAttente={[]}
        motifRang={undefined}
        alertes={[]}
      />,
    )

    expect(html).toContain(`<div class="option-card__posologie-geste">${GESTE}</div>`)
    expect(html).toContain(`<div class="option-card__posologie-modalite">${MODALITE_1}</div>`)
    expect(html).toContain(`<div class="option-card__posologie-modalite">${MODALITE_2}</div>`)
    // L'ordre du contenu est préservé — c'est lui qui porte la hiérarchie (cf. `Option.posologie_detail`).
    expect(html.indexOf(GESTE)).toBeLessThan(html.indexOf(MODALITE_1))
    expect(html.indexOf(MODALITE_1)).toBeLessThan(html.indexOf(MODALITE_2))
  })

  it('un `posologie_detail` à UN SEUL paragraphe ne produit que le geste, aucune modalité', () => {
    const html = rendreCarte(optionDeBase({ posologie_detail: [GESTE] }))
    expect(html).toContain('option-card__posologie-geste')
    expect(html).not.toContain('option-card__posologie-modalite')
  })

  it('un `apercu` seul est un GESTE, pas une modalité — c’est la conduite à tenir, même quand il est court', () => {
    const html = rendreCarte(optionDeBase({ apercu: 'dose fixe' }))
    expect(html).toContain('<div class="option-card__posologie-geste">dose fixe</div>')
    expect(html).not.toContain('option-card__posologie-modalite')
  })

  it('les doses CALCULÉES gardent leur bloc propre, distinct de la prose de posologie (et son libellé)', () => {
    const html = rendreCarte(optionDeBase({ posologie_detail: [GESTE] }), [
      { libelle: 'Dose initiale', valeur: 16, unite: 'U/j' },
    ])
    const panneau = html.slice(
      html.indexOf('option-card__panneau--posologie'),
      html.indexOf('option-card__panneau--ci'),
    )
    expect(panneau).toContain('option-card__posologie-geste')
    expect(panneau).toContain('option-card__calculs')
    expect(panneau).toContain('Doses indicatives : ')
    expect(panneau).toContain('option-card__calcul"')
    // Le geste précède les doses : on lit ce qu'on fait, puis le chiffre pour ce patient.
    expect(panneau.indexOf('option-card__posologie-geste')).toBeLessThan(panneau.indexOf('option-card__calculs'))
  })
})

/**
 * T-195 (P15/S2, 2026-08-11) — LA NOTE DE SOURCE, troisième registre du panneau posologie, SOUS
 * `.option-card__posologie-modalite`. Un item OBJET de `posologie_detail` (`{ texte, sources? }`, T-194)
 * peut porter des ids de `sources[]`, résolus contre LES DEUX registres de bibliographie du nœud :
 * `bibliographie` (→ `references_primaires`) ET `citationsReco` (→ `reco_officielle.references`,
 * arbitrage du 2026-08-11, `plans/P15/index.md` §Arbitrage) — jamais réinjectés en incise dans le texte.
 * Un id inconnu des deux registres est ignoré EN SILENCE (même politique que pour `option.references`,
 * cf. `OptionCard.tsx`) : ce n'est pas le rôle de ce composant de le signaler, c'est celui d'un invariant
 * de contenu (S3, fichier séparé).
 */
describe('OptionCard — T-195 : note de source du panneau posologie (item objet, `sources[]`)', () => {
  const BIBLIOGRAPHIE: ReferencePrimaire[] = [
    {
      id: 'ebmfrance-insuline',
      titre: 'ebmfrance — Insulinothérapie',
      annee: 2024,
      lien: 'https://ebmfrance.example/insuline',
      type_critere: 'dur',
    },
  ]
  const CITATIONS_RECO: CitationReco[] = [
    { nom: 'SFD 2025', detail: 'Avis 18', id: 'sfd-2025-avis18' },
    // Volontairement SANS `id` : par construction jamais résoluble (cf. `CitationReco.id`, optionnel).
    { nom: 'RCP ANSM (sans id)', lien: 'https://ansm.example/rcp' },
  ]

  function rendreAvecBibliographie(posologieDetail: Option['posologie_detail']) {
    return renderToStaticMarkup(
      <OptionCard
        option={optionDeBase({ posologie_detail: posologieDetail })}
        badge={null}
        reasons={['toujours']}
        calculs={[]}
        calculsEnAttente={[]}
        motifRang={undefined}
        alertes={[]}
        bibliographie={BIBLIOGRAPHIE}
        citationsReco={CITATIONS_RECO}
      />,
    )
  }

  it('item CHAÎNE (forme courte historique) : rendu inchangé, aucune note de source', () => {
    const TEXTE = 'Augmenter la basale de 2 U si la glycémie à jeun reste haute 3 matins de suite.'
    const html = rendreAvecBibliographie([TEXTE])

    expect(html).toContain(`<div class="option-card__posologie-geste">${TEXTE}</div>`)
    expect(html).not.toContain('option-card__posologie-source')
  })

  it('item OBJET SANS `sources` : rendu du texte inchangé, aucune note de source', () => {
    const TEXTE = 'Adapter par palier de une à deux semaines selon la tolérance digestive.'
    const html = rendreAvecBibliographie([{ texte: TEXTE }])

    expect(html).toContain(`<div class="option-card__posologie-geste">${TEXTE}</div>`)
    expect(html).not.toContain('option-card__posologie-source')
  })

  it('item OBJET avec une source de `references_primaires` (essai) : note rendue, avec lien', () => {
    const html = rendreAvecBibliographie([
      { texte: 'Augmenter de 2 U si la cible n’est pas atteinte.', sources: ['ebmfrance-insuline'] },
    ])
    const note = html.slice(html.indexOf('option-card__posologie-source'))

    expect(note).toContain('ebmfrance — Insulinothérapie (2024)')
    expect(note).toContain('href="https://ebmfrance.example/insuline"')
    expect(note).toContain('target="_blank"')
    expect(note).toContain('rel="noreferrer"')
  })

  it('item OBJET avec une source de `reco_officielle.references` (RCP/reco, second registre) : note rendue', () => {
    const html = rendreAvecBibliographie([
      { texte: 'Titration hebdomadaire selon la tolérance.', sources: ['sfd-2025-avis18'] },
    ])
    const note = html.slice(html.indexOf('option-card__posologie-source'))

    expect(note).toContain('SFD 2025 — Avis 18')
  })

  it('item OBJET avec une source INCONNUE des deux registres : AUCUNE note, AUCUNE erreur, le texte reste rendu', () => {
    const TEXTE = 'Réduire de 10 % si hypoglycémie sévère.'
    expect(() =>
      rendreAvecBibliographie([{ texte: TEXTE, sources: ['id-qui-nexiste-nulle-part'] }]),
    ).not.toThrow()
    const html = rendreAvecBibliographie([{ texte: TEXTE, sources: ['id-qui-nexiste-nulle-part'] }])

    expect(html).toContain(`<div class="option-card__posologie-geste">${TEXTE}</div>`)
    expect(html).not.toContain('option-card__posologie-source')
    expect(html).not.toContain('id-qui-nexiste-nulle-part') // jamais un id brut affiché
  })

  it('une entrée `reco_officielle.references` SANS `id` (donc jamais résoluble) ne casse rien et reste sans note', () => {
    const TEXTE = 'Vérifier la fonction rénale avant renouvellement.'
    const html = rendreAvecBibliographie([{ texte: TEXTE, sources: ['rcp-ansm-sans-id'] }])

    expect(html).toContain(`<div class="option-card__posologie-geste">${TEXTE}</div>`)
    expect(html).not.toContain('option-card__posologie-source')
  })

  it('plusieurs sources sur le même item sont TOUTES rendues, séparées par « · »', () => {
    const html = rendreAvecBibliographie([
      { texte: 'Suivre le schéma SFD.', sources: ['ebmfrance-insuline', 'sfd-2025-avis18'] },
    ])
    const note = html.slice(html.indexOf('option-card__posologie-source'), html.indexOf('option-card__panneau--ci'))

    expect(note).toContain('ebmfrance — Insulinothérapie (2024)')
    expect(note).toContain('SFD 2025 — Avis 18')
    expect(note).toContain(' · ')
  })

  it('sans les props `bibliographie`/`citationsReco` (appelant qui ne les transmet pas) : aucune note, aucune erreur', () => {
    const TEXTE = 'Adapter la dose au poids.'
    const html = renderToStaticMarkup(
      <OptionCard
        option={optionDeBase({ posologie_detail: [{ texte: TEXTE, sources: ['ebmfrance-insuline'] }] })}
        badge={null}
        reasons={['toujours']}
        calculs={[]}
        calculsEnAttente={[]}
        motifRang={undefined}
        alertes={[]}
      />,
    )

    expect(html).toContain(`<div class="option-card__posologie-geste">${TEXTE}</div>`)
    expect(html).not.toContain('option-card__posologie-source')
  })
})

/**
 * T-202 (P15/S8, 2026-08-11) — nouvelle prop `posologieDetail`, qui REMPLACE `option.posologie_detail`
 * QUAND FOURNIE, avec repli EXACT sur le comportement actuel (tout affiché, non filtré) pour tout
 * appelant qui ne la transmet pas — MÊME contrat que `contreIndications` (T-068, cf. sa docstring dans
 * `OptionCard.tsx`). Le filtrage par `quand` a déjà eu lieu en amont (`lib/vueDecision.ts`
 * `evaluerPosologieDetail`) : cette carte ne reçoit ici que des listes déjà décidées, elle n'évalue
 * jamais de `quand` elle-même — NON COUVERT avant cette session (aucun test n'exerçait encore cette prop,
 * elle n'existait pas).
 */
describe('OptionCard — T-202 : prop `posologieDetail` (items déjà filtrés par `quand`)', () => {
  const DETAIL_REPLI = 'Titrer par paliers de 2 U.'
  const DETAIL_MCG = 'Selon la courbe nocturne MCG.'

  it('SANS la prop (repli) : la carte affiche `option.posologie_detail` EN ENTIER, non filtré — même rendu qu’avant T-202', () => {
    const html = rendreCarte(optionDeBase({ posologie_detail: [DETAIL_REPLI, DETAIL_MCG] }))
    expect(html).toContain(DETAIL_REPLI)
    expect(html).toContain(DETAIL_MCG)
  })

  it('AVEC la prop fournie : la carte affiche EXACTEMENT la liste transmise, jamais `option.posologie_detail` directement (un item écarté par le modèle de vue n’apparaît pas)', () => {
    const html = renderToStaticMarkup(
      <OptionCard
        option={optionDeBase({ posologie_detail: [DETAIL_REPLI, DETAIL_MCG] })}
        badge={null}
        reasons={['toujours']}
        calculs={[]}
        calculsEnAttente={[]}
        motifRang={undefined}
        alertes={[]}
        posologieDetail={[DETAIL_REPLI]} // simule l'item MCG écarté par `evaluerPosologieDetail`
      />,
    )
    expect(html).toContain(DETAIL_REPLI)
    expect(html).not.toContain(DETAIL_MCG)
  })

  it('AVEC la prop fournie mais VIDE : aucun paragraphe de posologie rendu, même si `option.posologie_detail` en porte — la prop REMPLACE, ne fusionne jamais', () => {
    const html = renderToStaticMarkup(
      <OptionCard
        option={optionDeBase({ posologie_detail: [DETAIL_REPLI, DETAIL_MCG] })}
        badge={null}
        reasons={['toujours']}
        calculs={[]}
        calculsEnAttente={[]}
        motifRang={undefined}
        alertes={[]}
        posologieDetail={[]}
      />,
    )
    expect(html).not.toContain(DETAIL_REPLI)
    expect(html).not.toContain(DETAIL_MCG)
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
