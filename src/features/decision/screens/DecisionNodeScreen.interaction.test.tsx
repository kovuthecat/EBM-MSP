// @vitest-environment jsdom

/**
 * Tests d'INTERACTION (rendu DOM réel : `@testing-library/react` + `jsdom`) — première infrastructure
 * de ce type dans le projet. Les ~450 autres tests évaluent des fonctions pures (moteur, `lib/*`) ou du
 * HTML STATIQUE via `react-dom/server` (`CriteriaForm.test.tsx`), qui ne rejoue aucun événement — c'est
 * pourquoi `CriteriaForm.tsx` documente encore, à la date d'écriture, que sa branche `onEffacer` n'est
 * « validée que visuellement » faute d'infra RTL/jsdom. Ce fichier comble précisément ce trou, mais SEULEMENT
 * pour lui : un filet, pas une couverture (cadrage du lot, `docs/decision/validation/chantier-2026-07-26/`).
 *
 * QUATRE comportements, et seulement quatre, chacun mis en vigueur par la sémantique de la valeur
 * indéterminée (DECISIONS.md D20) et jusqu'ici garanti par le seul raisonnement — jamais par un test qui
 * rejoue un événement DOM :
 *
 * 1. Un champ `nombre` VIDÉ (pas juste remis à 0) quitte `renseignes` — LE défaut de recette 12.2/13.3
 *    (« 0 facteur de risque » enregistré comme un fait établi par une simple frappe d'effacement, parce
 *    que `Number('') === 0` et que l'ancien code laissait `touched` gonflé de ce zéro). Testé ici par la
 *    séquence RÉELLE : saisir une valeur, l'effacer, vérifier que le critère redevient non renseigné
 *    (l'input redevient visuellement vide) ET que la recommandation change en conséquence (l'option qui
 *    dépendait de ce critère quitte le panneau de résultats et retourne dans le registre « en attente »).
 *    Une régression vers l'ancien bug ne ferait PAS reparaître le registre : l'option disparaîtrait
 *    simplement en silence (0 ne satisfait pas la condition), sans jamais remonter comme indéterminée —
 *    précisément ce que ce test distingue.
 * 2. Le registre EN ATTENTE s'affiche, critères manquants nommés — le message qui remplace « Aucune
 *    option ne correspond » sur un formulaire vierge (D20 §2.5). S'il ne s'affichait pas réellement à
 *    l'écran (juste dans le modèle de vue testé unitairement), l'utilisateur ne verrait qu'un panneau vide
 *    sans explication.
 * 3. Le bouton « Rien à signaler » apparaît dès UN SEUL booléen décisif non renseigné (seuil descendu de
 *    2 à 1, D20 R7) — sans quoi un `confirmation_requise` ISOLÉ dans sa section n'a AUCUN moyen d'être
 *    confirmé. Testé avec un critère `confirmation_requise` SEUL dans sa section (le cas réel qui a motivé
 *    la baisse du seuil, ex. `diabete_complique` sur le nœud `statine`), pas accompagné d'un second
 *    booléen qui rendrait le test vrai même avec l'ancien seuil de 2.
 * 4. Le marqueur « à confirmer » cible les `nombre` décisifs ET les `bool` `confirmation_requise`
 *    décisifs, JAMAIS un `bool` ORDINAIRE (dont le « non » est une réponse clinique complète à part
 *    entière). `CriteriaForm.test.tsx` vérifie déjà cette frontière en HTML statique avec un `aConfirmer`
 *    fabriqué à la main ; ici elle est revérifiée BOUT EN BOUT — moteur réel → pertinence réelle
 *    (`engine/relevance.ts`) → câblage réel de l'écran (`DecisionNodeScreen.tsx`) → rendu réel — pour
 *    s'assurer qu'aucun maillon de cette chaîne ne casse la frontière que le composant, pris isolément,
 *    respecte déjà.
 *
 * CE QUE CE FICHIER NE TESTE PAS (cadrage du lot, règle de travail du référent) : ni l'apparence, ni la
 * mise en page, ni les couleurs — la validation VISUELLE reste humaine, jamais automatisée. Chaque
 * assertion ci-dessous porte sur un texte affiché, la valeur d'un champ, ou l'état coché d'une case —
 * jamais sur une classe CSS de présentation, une couleur ou une position. Les sélecteurs `.closest(...)`
 * utilisés plus bas naviguent la structure du DOM pour ISOLER le bon champ (plusieurs sections partagent
 * le même libellé de bouton) ; ils ne vérifient jamais un style.
 *
 * OUTILLAGE — le plus léger possible pour ce périmètre (CLAUDE.md invariant 8, devDependencies
 * uniquement) : `@testing-library/react` + `jsdom` (environnement local à CE fichier via le commentaire
 * `@vitest-environment` en tête — les ~450 autres tests continuent de tourner dans l'environnement `node`
 * par défaut, plus rapide, sans jsdom). Volontairement PAS `@testing-library/jest-dom` (les quatre
 * assertions ci-dessus s'expriment très bien avec `textContent`/`value`/`checked` natifs, un matcher de
 * plus n'aurait servi qu'un confort marginal) ni `user-event` (`fireEvent.change`/`fireEvent.click`
 * suffisent : on ne teste ni la frappe caractère par caractère, ni le focus).
 *
 * Nœud SYNTHÉTIQUE (le seul appelé, mocké via `getNoeudById`) plutôt qu'un vrai nœud DT2 : un test
 * d'interaction doit rester stable quand le contenu clinique évolue sous la plume d'une autre équipe
 * (périmètre de ce lot : `package.json`/config de test/tests nouveaux, jamais `content/**`) — même
 * discipline que `evaluateNode.indetermine.test.ts`/`vueDecision.test.ts` (nœuds fabriqués par une
 * fonction `opt`/`makeNode`, moteur générique, DECISIONS.md D8 : aucun nom de critère ni de nœud connu
 * d'avance). Le nœud ci-dessous porte volontairement trois sections d'UN SEUL champ chacune : c'est ce qui
 * permet d'isoler le bouton « Rien à signaler » de la section « Sécurité » (comportement 3, un booléen
 * seul) de celui de la section « Antécédents » (qui existe aussi, un booléen ORDINAIRE seul suffisant à
 * l'y faire apparaître également — cf. `CriteriaForm.tsx`, le bouton ne distingue pas les deux natures de
 * booléen, seul le marqueur « à confirmer » le fait, comportement 4).
 */
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Noeud, Option } from '../content/node.types'
import { DecisionNodeScreen } from './DecisionNodeScreen'

const { NODE } = vi.hoisted(() => {
  function opt(intitule: string, conditions: string[]): Option {
    return {
      intitule,
      conditions,
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
    }
  }

  // Fonction (pas un objet `satisfies`) : le TYPE DE RETOUR déclaré `Noeud` fournit le typage contextuel
  // qui préserve les littéraux (`type: 'nombre'`, `selection: 'multi-options'`…) — même convention que
  // `makeNode` dans `vueDecision.test.ts`/`evaluateNode.indetermine.test.ts`.
  function buildNode(): Noeud {
    return {
      id: 'noeud-interaction-test',
      domaine: 'test',
      titre: 'Nœud de test (interaction)',
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [
        // Section « Bilan » : un seul `nombre` décisif — comportements 1, 2 et 4 (marqueur `nombre`).
        { nom: 'nb_facteurs_risque', type: 'nombre', groupe: 'Bilan', min: 0, max: 10 },
        // Section « Sécurité » : un seul `bool` `confirmation_requise`, ISOLÉ — comportement 3 (seuil à
        // 1) et 4 (marqueur porté par un `confirmation_requise`).
        { nom: 'evenement_grave', type: 'bool', confirmation_requise: true, groupe: 'Sécurité' },
        // Section « Antécédents » : un seul `bool` ORDINAIRE, ISOLÉ — comportement 4 (PAS de marqueur,
        // même décisif et non renseigné).
        { nom: 'ascvd_etablie', type: 'bool', groupe: 'Antécédents' },
      ],
      options: [
        opt('Traitement de base', ['toujours']),
        opt('Renfort', ['nb_facteurs_risque >= 2']),
        opt('Suivi renforcé', ['evenement_grave == true']),
        opt('Alerte cardio', ['ascvd_etablie == true']),
      ],
      argumentaire: 'x',
      sources: {
        references_primaires: [],
        synthese_critique: { donnee: '', references: [] },
        reco_officielle: { source: '', position: '', divergence: false, explication: '' },
      },
      incertitudes: [],
      veille_liee: [],
      meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide', version: '1.0', changelog: [] },
    }
  }

  return { NODE: buildNode() }
})

// Seul le chargement du CONTENU est mocké (source de données) — `DecisionNodeScreen` et toute la chaîne
// qu'il appelle (`CriteriaForm`, `lib/vueDecision.ts`, `engine/*`) tournent en code RÉEL, non mocké.
vi.mock('../content/loadNodes', () => ({
  getNoeudById: (id: string) => (id === NODE.id ? NODE : undefined),
  getNoeudsByDomaine: () => [NODE],
  noeuds: [NODE],
  noeudsParDomaine: { test: [NODE] },
}))

afterEach(cleanup)

/** Rend l'écran réel sur le nœud synthétique ci-dessus ; `go` n'est jamais appelé dans ces scénarios. */
function renderNode() {
  return render(<DecisionNodeScreen nodeId={NODE.id} go={() => {}} />)
}

/** Le seul champ `nombre` du nœud (rôle ARIA natif d'un `<input type="number">`). */
function nombreInput(): HTMLInputElement {
  return screen.getByRole('spinbutton') as HTMLInputElement
}

/** Titres des cartes d'options actuellement PROPOSÉES (panneau de résultats, jamais le registre « en attente »). */
function titresOptionsProposees(container: HTMLElement): string[] {
  return [...container.querySelectorAll('.option-card__title')].map((el) => el.textContent ?? '')
}

/**
 * Textes complets des entrées du registre « en attente » (`<strong>{intitulé}</strong> — à renseigner :
 * …`). Lu directement dans le DOM plutôt que via `screen.getByText` : le texte de chaque entrée est
 * réparti entre le `<strong>` et le texte qui le suit, ce que le matcher PAR DÉFAUT de `getByText` ne
 * reconstitue pas (« text is broken up by multiple elements ») — même situation, même parade, que
 * `CriteriaForm.test.tsx` sur du HTML statique (`labelBlocks.find(...)`). Ceci lit du CONTENU affiché
 * (le texte réellement rendu), pas une classe de présentation.
 */
function entreesEnAttente(container: HTMLElement): string[] {
  return [...container.querySelectorAll('.decision-node__en-attente-item')].map((el) => el.textContent ?? '')
}

describe('DecisionNodeScreen — comportement 1 : un `nombre` vidé quitte `renseignes` (D20 R7, défauts de recette 12.2/13.3)', () => {
  it('saisir puis effacer nb_facteurs_risque fait réapparaître le registre « en attente » et disparaître l’option qui en dépendait', () => {
    const { container } = renderNode()
    const input = nombreInput()

    // État initial (jamais touché) : champ vide, l'option qui dépend de ce critère est EN ATTENTE, pas
    // simplement absente — le registre nomme le critère manquant.
    expect(input.value).toBe('')
    expect(titresOptionsProposees(container)).not.toContain('Renfort')
    expect(entreesEnAttente(container)).toContain('Renfort — à renseigner : Nb facteurs risque')

    // 1. SAISIE : franchit le seuil (>= 2) → l'option devient proposée, quitte le registre « en attente ».
    fireEvent.change(input, { target: { value: '3' } })
    expect(input.value).toBe('3')
    expect(titresOptionsProposees(container)).toContain('Renfort')
    expect(entreesEnAttente(container)).not.toContain('Renfort — à renseigner : Nb facteurs risque')

    // 2. EFFACEMENT (pas une remise à 0 manuelle) : déclenche `onEffacer`, PAS `onChange('nb_facteurs_risque', 0)`.
    // Si le défaut de recette 12.2/13.3 était réintroduit (`Number('') = 0` traité comme une réponse), le
    // critère resterait `renseignes` à 0 : l'option disparaîtrait SILENCIEUSEMENT (0 < 2, non satisfaite)
    // sans jamais repasser par le registre « en attente ». C'est précisément ce que les deux assertions
    // suivantes excluent.
    fireEvent.change(input, { target: { value: '' } })
    expect(input.value).toBe('') // redevient visuellement indiscernable d'un champ jamais saisi.
    expect(titresOptionsProposees(container)).not.toContain('Renfort')
    expect(entreesEnAttente(container)).toContain('Renfort — à renseigner : Nb facteurs risque') // ⇐ EN ATTENTE, pas silencieusement écartée.
  })
})

describe('DecisionNodeScreen — comportement 2 : le registre « en attente » affiche les critères manquants, nommés', () => {
  it('sur formulaire vierge, chaque option indéterminée apparaît avec le nom du critère qui la bloque', () => {
    const { container } = renderNode()
    expect(screen.getByText(/^En attente/)).toBeTruthy()
    expect(entreesEnAttente(container)).toContain('Renfort — à renseigner : Nb facteurs risque')
    expect(entreesEnAttente(container)).toContain('Suivi renforcé — à renseigner : Evenement grave')
  })
})

describe('DecisionNodeScreen — comportement 3 : « Rien à signaler » apparaît dès UN booléen décisif isolé (seuil à 1, D20 R7)', () => {
  it('le bouton est présent dans la section « Sécurité » (un seul `confirmation_requise`), et le confirme sans le cocher', () => {
    const { container } = renderNode()
    const checkbox = screen.getByLabelText('Evenement grave', { exact: false }) as HTMLInputElement
    const section = checkbox.closest('section')
    if (!section) throw new Error('section introuvable')

    // Présent alors qu'un SEUL booléen décisif est en jeu dans cette section — l'ancien seuil (2) ne
    // l'aurait jamais montré ici.
    const bouton = within(section).getByText('Rien à signaler')
    expect(bouton).toBeTruthy()
    expect(checkbox.checked).toBe(false) // pas encore répondu.

    fireEvent.click(bouton)

    // Confirmé SANS changer la valeur : reste décoché (« non » est la réponse, `false` est la vraie valeur).
    expect(checkbox.checked).toBe(false)
    // Le bouton disparaît (plus rien à confirmer dans cette section) et la reco qui en dépendait se
    // tranche enfin (« Suivi renforcé » quitte le registre « en attente », sans devenir proposée : la
    // réponse confirmée est « non »).
    expect(within(section).queryByText('Rien à signaler')).toBeNull()
    expect(entreesEnAttente(container)).not.toContain('Suivi renforcé — à renseigner : Evenement grave')
  })
})

describe('DecisionNodeScreen — comportement 4 : le marqueur « à confirmer » cible `nombre` + `bool confirmation_requise`, jamais un `bool` ordinaire', () => {
  it('marque le `nombre` décisif non renseigné', () => {
    renderNode()
    const input = nombreInput()
    const champ = input.closest('.criteria-form__field')
    if (!champ) throw new Error('champ introuvable')
    expect(champ.textContent).toContain('à confirmer')
  })

  it('marque le `bool` `confirmation_requise` décisif non renseigné', () => {
    renderNode()
    const checkbox = screen.getByLabelText('Evenement grave', { exact: false })
    const label = checkbox.closest('label')
    if (!label) throw new Error('label introuvable')
    expect(label.textContent).toContain('à confirmer')
  })

  it("ne marque PAS le `bool` ORDINAIRE, alors même qu'il est décisif, non renseigné, et que sa section propose aussi « Rien à signaler »", () => {
    renderNode()
    const checkbox = screen.getByLabelText('Ascvd etablie', { exact: false })
    const label = checkbox.closest('label')
    if (!label) throw new Error('label introuvable')
    const section = checkbox.closest('section')
    if (!section) throw new Error('section introuvable')

    // Preuve que ce booléen est bien traité comme décisif+non confirmé par le câblage réel (sinon la
    // négation ci-dessous serait triviale, vraie pour n'importe quel champ non pertinent) : le bouton
    // « Rien à signaler » de SA section existe bel et bien.
    expect(within(section).getByText('Rien à signaler')).toBeTruthy()
    // Et pourtant, aucun marqueur textuel « à confirmer » sur son libellé — un `bool` ordinaire non coché
    // EST une réponse clinique complète (« non »), pas une case en attente.
    expect(label.textContent).not.toContain('à confirmer')
  })
})
