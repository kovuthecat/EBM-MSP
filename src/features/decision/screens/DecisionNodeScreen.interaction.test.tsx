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

const {
  NODE,
  NODE_CONTRAINTE,
  NODE_SUSPENDU,
  NODE_RIEN_A_PROPOSER,
  NODE_PREREMPLISSAGE,
  NODE_EGALITE,
} = vi.hoisted(() => {
  function opt(intitule: string, conditions: string[], extra: Partial<Option> = {}): Option {
    const seule = conditions.length === 1 ? conditions[0] : undefined
    return {
      intitule,
      // `role` (A3) dérivé des sentinelles pour ces options SYNTHÉTIQUES : l'invariant I17 porte la
      // garantie sur le contenu réel, ce fichier n'a pas à la répéter à chaque appel.
      role: seule === 'toujours' ? 'socle' : seule === 'default' ? 'repli' : 'geste',
      conditions,
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
      // T-022/T-024 (P4/S3) : `extra` permet aux nœuds synthétiques ajoutés pour ces tâches de porter une
      // `priorite` (égalité de rang) sans dupliquer tout le corps de `opt` — les quatre comportements
      // existants au-dessus n'utilisent jamais ce 3ᵉ paramètre, rétro-compatibles par construction.
      ...extra,
    }
  }

  /**
   * Champs `Noeud` communs aux fixtures synthétiques ci-dessous, factorisés (sinon répétés 6 fois) —
   * TYPE DE RETOUR explicite (`Pick<Noeud, ...>`), même raison que sur `buildNode` ci-dessous : préserver
   * les littéraux (`statut: 'valide'`) par typage contextuel plutôt que par inférence élargie.
   */
  function metaCommune(): Pick<Noeud, 'argumentaire' | 'sources' | 'incertitudes' | 'veille_liee' | 'meta'> {
    return {
      argumentaire: 'x',
      sources: {
        references_primaires: [],
        synthese_critique: { donnee: '', references: [] },
        reco_officielle: { source: '', position: '', divergence: false, explication: '' },
      },
      incertitudes: [],
      veille_liee: [],
      meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide' as const, version: '1.0', changelog: [] },
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
        // T-018 (P4/S1, D30, 2026-07-28) : `confirmation_requise: true` retiré — champ hors périmètre
        // S1 (screens/), touché SEULEMENT pour rester compilable après le renommage du champ de contenu.
        // Un `bool` sans `presomption_non` est désormais indéterminé PAR DÉFAUT (le nouveau défaut D30),
        // ce qui reproduit l'effet recherché par ce fixture SANS déclarer le champ. Conséquence non
        // évaluée ici (hors périmètre) : `ascvd_etablie` ci-dessous (bool "ordinaire") est, par le même
        // nouveau défaut, ÉGALEMENT indéterminé désormais — la distinction que ce test vérifiait entre
        // les deux critères peut avoir changé de nature ; à revoir par la session qui possède ce fichier.
        { nom: 'evenement_grave', type: 'bool', groupe: 'Sécurité' },
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

  /**
   * T-022 (P4/S3, D31) — nœud synthétique portant une CONTRAINTE DE SAISIE (`Noeud.contraintes`,
   * `engine/contraintes.ts`) : reproduit la forme exacte de la recette (`tbr_severe <= tbr`, comparaison
   * entre deux critères), sans dépendre du contenu réel `insuline` (même discipline que `buildNode`
   * ci-dessus). Un socle `["toujours"]` sert à vérifier que la suspension retire VRAIMENT tout, y
   * compris une option qui s'affiche normalement en dehors de toute violation.
   */
  function buildContrainteNode(): Noeud {
    return {
      id: 'noeud-interaction-contrainte-test',
      domaine: 'test',
      titre: 'Nœud de test (contrainte)',
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [
        { nom: 'tbr', type: 'nombre', groupe: 'Sécurité', min: 0, max: 100 },
        { nom: 'tbr_severe', type: 'nombre', groupe: 'Sécurité', min: 0, max: 100 },
      ],
      contraintes: [
        {
          expression: 'tbr_severe <= tbr',
          message: 'Message de test : la valeur sévère ne peut pas dépasser la valeur standard.',
        },
      ],
      options: [opt('Socle toujours proposé', ['toujours']), opt('Corriger', ['tbr_severe > 1'])],
      ...metaCommune(),
    }
  }

  /**
   * T-023 Étape 1 (P4/S3) — `applicable` vide MAIS une option reste EN ATTENTE dès le formulaire vierge
   * (`critere_x` non renseigné rend sa condition indéterminée, jamais fausse) : le cas visé par la
   * "Décision clé" (a), une halte en cours qui ne doit jamais produire un panneau silencieux.
   */
  function buildSuspenduNode(): Noeud {
    return {
      id: 'noeud-interaction-suspendu-test',
      domaine: 'test',
      titre: 'Nœud de test (suspendu)',
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [{ nom: 'critere_x', type: 'nombre', groupe: 'Bilan', min: 0, max: 10 }],
      options: [opt('Option suspendue', ['critere_x >= 5'])],
      ...metaCommune(),
    }
  }

  /**
   * T-023 Étape 2 (P4/S3) — `applicable` ET `enAttente` TOUS DEUX vides dès le formulaire vierge :
   * `flag_presume` porte `presomption_non: true` (déterminé par défaut à `false`), donc la condition de
   * l'unique option est FAUSSE, jamais indéterminée — elle part en `nonRetenues` (explication, à la
   * demande), pas en `enAttente`. C'est le cas « le nœud n'a rien à proposer dans son périmètre ».
   */
  function buildRienAProposerNode(): Noeud {
    return {
      id: 'noeud-interaction-rien-a-proposer-test',
      domaine: 'test',
      titre: 'Nœud de test (rien à proposer)',
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [{ nom: 'flag_presume', type: 'bool', groupe: 'Bilan', presomption_non: true }],
      options: [opt('Option jamais par défaut', ['flag_presume == true'])],
      ...metaCommune(),
    }
  }

  /**
   * T-023 Étape 3-5 (P4/S3, D-06) — nœud synthétique isolant le mécanisme de `preremplissage` (K6) sans
   * dépendre du nœud réel `prescription` : `position` est pré-remplie à `au_dessus` par une règle
   * `{quand, valeur}` portant sur un critère DÉRIVÉ (`ecart_au_dessus`), exactement la forme du contenu
   * réel (`position_vs_cible`/`ecart_au_dessus_cible`) — seuls les noms changent. AUCUNE règle pour
   * `a_l_objectif` : reproduit le parti pris délibéré du contenu réel (« rien n'est pré-rempli sous la
   * cible », `content/noeuds/diabete-type-2/prescription.yaml`).
   */
  function buildPreremplissageNode(): Noeud {
    return {
      id: 'noeud-interaction-preremplissage-test',
      domaine: 'test',
      titre: 'Nœud de test (pré-remplissage)',
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [
        { nom: 'valeur_actuelle', type: 'nombre', groupe: 'Mesure', min: 0, max: 20 },
        { nom: 'valeur_cible', type: 'nombre', groupe: 'Mesure', min: 0, max: 20 },
        {
          nom: 'ecart_au_dessus',
          type: 'bool',
          derive: 'valeur_actuelle > 0 AND valeur_cible > 0 AND valeur_actuelle > valeur_cible',
        },
        {
          nom: 'position',
          type: 'enum',
          valeurs: ['a_l_objectif', 'au_dessus'],
          groupe: 'Mesure',
          preremplissage: [{ quand: 'ecart_au_dessus == true', valeur: 'au_dessus' }],
        },
      ],
      options: [opt('Option position-dépendante', ['position == au_dessus'])],
      ...metaCommune(),
    }
  }

  /**
   * T-024 (P4/S3) — deux options du MÊME rang fini (`priorite: 1` toutes les deux, aucune `famille`
   * déclarée → repli à plat) : `groupesExAequo` (`engine/evaluateNode.ts`) les regroupe côte à côte,
   * exactement la forme rencontrée trois fois par la recette du 2026-07-28.
   */
  function buildEgaliteNode(): Noeud {
    return {
      id: 'noeud-interaction-egalite-test',
      domaine: 'test',
      titre: 'Nœud de test (égalité)',
      population_cible: 'test',
      selection: 'multi-options',
      // Un critère neutre pour ne pas déclencher le repli "contenu détaillé à venir" (`isPlaceholder`,
      // `DecisionNodeScreen.tsx` : `criteres_entree.length === 0 || options.length === 0`) — non lu par
      // les deux options ci-dessous (sentinelles `toujours`, aucune condition à évaluer).
      criteres_entree: [{ nom: 'critere_neutre', type: 'bool', groupe: 'Divers', presomption_non: true }],
      options: [
        opt('Option A', ['toujours'], { priorite: 1 }),
        opt('Option B', ['toujours'], { priorite: 1 }),
      ],
      ...metaCommune(),
    }
  }

  return {
    NODE: buildNode(),
    NODE_CONTRAINTE: buildContrainteNode(),
    NODE_SUSPENDU: buildSuspenduNode(),
    NODE_RIEN_A_PROPOSER: buildRienAProposerNode(),
    NODE_PREREMPLISSAGE: buildPreremplissageNode(),
    NODE_EGALITE: buildEgaliteNode(),
  }
})

// Seul le chargement du CONTENU est mocké (source de données) — `DecisionNodeScreen` et toute la chaîne
// qu'il appelle (`CriteriaForm`, `lib/vueDecision.ts`, `engine/*`) tournent en code RÉEL, non mocké.
//
// T-022/T-023/T-024 (P4/S3) : le lot de nœuds synthétiques a grandi (un nœud par comportement testé,
// même discipline que `NODE` ci-dessus) — `getNoeudById` route désormais par une table plutôt qu'une
// égalité unique, sans changer le principe (seul le CONTENU est mocké). La table est construite À
// L'INTÉRIEUR de la factory (jamais dans une `const` module-scope entre `vi.hoisted` et `vi.mock`) : ce
// dernier est hoisté au-dessus des imports, une constante ordinaire ne l'est pas — seuls `NODE`,
// `NODE_CONTRAINTE`, etc. (issus de `vi.hoisted` ci-dessus) sont sûrs à référencer ici.
vi.mock('../content/loadNodes', () => {
  const tousLesNoeudsTest = [NODE, NODE_CONTRAINTE, NODE_SUSPENDU, NODE_RIEN_A_PROPOSER, NODE_PREREMPLISSAGE, NODE_EGALITE]
  return {
    getNoeudById: (id: string) => tousLesNoeudsTest.find((n) => n.id === id),
    getNoeudsByDomaine: () => tousLesNoeudsTest,
    noeuds: tousLesNoeudsTest,
    noeudsParDomaine: { test: tousLesNoeudsTest },
  }
})

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

/**
 * COMPORTEMENT 4 RÉVISÉ le 2026-07-27 (soir) — arbitrage référent A8, après la recette VISUELLE.
 *
 * Ce bloc exigeait que le marqueur « à confirmer » ne touche JAMAIS un `bool` ordinaire, au motif
 * qu'une case décochée EST une réponse clinique complète (« non »). Le motif reste vrai POUR LE
 * MOTEUR — D20 : un `bool` sans `confirmation_requise` est déterminé par défaut, et rien n'a changé
 * de ce côté. Il ne l'était pas pour le PRATICIEN : la recette visuelle a relevé, sur `statine`, un
 * bandeau annonçant « 1 critère décisif non confirmé » alors qu'AUCUN champ de l'écran ne portait de
 * marqueur. Le compteur comptait les booléens ordinaires, le marqueur les excluait — deux définitions
 * pour un même mot, et un praticien devant un nombre qu'il ne pouvait pas résoudre.
 *
 * Le référent a tranché pour la congruence : compteur et marqueurs ont désormais la même définition.
 * La contrepartie assumée est une densité de marqueurs plus forte, mesurée dans
 * `docs/decision/validation/chantier-2026-07-27/mesure-densite-marqueurs.md`.
 */
describe('DecisionNodeScreen — comportement 4 : le marqueur « à confirmer » couvre TOUT critère décisif non confirmé (A8)', () => {
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

  it('marque AUSSI le `bool` ORDINAIRE décisif non renseigné — et sa section propose toujours « Rien à signaler » pour le résoudre', () => {
    renderNode()
    const checkbox = screen.getByLabelText('Ascvd etablie', { exact: false })
    const label = checkbox.closest('label')
    if (!label) throw new Error('label introuvable')
    const section = checkbox.closest('section')
    if (!section) throw new Error('section introuvable')

    // Le mécanisme de résolution reste le même — le bouton « Rien à signaler » de SA section — et c'est
    // justement ce que le marqueur rend trouvable : avant A8, rien ne disait QUEL champ ce bouton visait.
    expect(within(section).getByText('Rien à signaler')).toBeTruthy()
    expect(label.textContent).toContain('à confirmer')
  })
})

/**
 * T-022 (P4/S3, D31, 2026-07-28) — UNE CONTRAINTE DE SAISIE VIOLÉE SUSPEND LE PANNEAU DE RÉSULTATS.
 *
 * Reproduit la recette (`docs/decision/validation/recette-navigateur-2026-07-28.md`, D-04) sur le nœud
 * synthétique `NODE_CONTRAINTE` : TBR = 1, TBR sévère = 95 viole `tbr_severe <= tbr`. Avant ce correctif,
 * le socle « toujours » ET l'option dépendante restaient affichés À CÔTÉ du message — ici, on vérifie
 * l'inverse : zéro carte, aucun repli, aucun bloc « en attente »/« écartées », seulement le message de
 * la contrainte (recopié du contenu, jamais réécrit) et les champs qu'elle cite, nommés en clair (I20).
 */
describe('DecisionNodeScreen — T-022 : une contrainte de saisie violée suspend tout le panneau de résultats (D31)', () => {
  it('TBR = 1 / TBR sévère = 95 (saisie que le nœud déclare impossible) : zéro carte, message de contrainte présent', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_CONTRAINTE.id} go={() => {}} />)
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]

    // AVANT saisie : la contrainte est INDÉTERMINÉE (aucun opérande renseigné, `contraintesViolees`) —
    // le socle « toujours » s'affiche normalement, comme sur n'importe quel autre nœud.
    expect(titresOptionsProposees(container)).toContain('Socle toujours proposé')

    fireEvent.change(inputs[0], { target: { value: '1' } }) // tbr
    fireEvent.change(inputs[1], { target: { value: '95' } }) // tbr_severe

    // ZÉRO carte — y compris le socle « toujours », qui s'affichait un instant plus tôt : la règle est
    // « rien d'autre que le message », pas « rien sauf le socle ».
    expect(titresOptionsProposees(container)).toEqual([])
    expect(container.querySelector('.decision-node__en-attente')).toBeNull()
    expect(container.querySelector('.decision-node__ecartees')).toBeNull()
    expect(container.querySelector('.decision-node__non-retenues')).toBeNull()
    expect(container.querySelector('.decision-node__toggle-argument')).toBeNull()

    // Le message de la contrainte s'affiche (recopié du contenu, jamais rédigé par l'écran).
    expect(
      screen.getByText(/la valeur sévère ne peut pas dépasser la valeur standard/i),
    ).toBeTruthy()
    // Les champs en cause sont nommés en clair (I20) — les deux critères comparés par l'expression,
    // jamais un identifiant technique du DSL (`tbr_severe <= tbr`).
    const champs = container.querySelector('.decision-node__contrainte-suspension-champs')?.textContent ?? ''
    expect(champs).toContain('Tbr')
    expect(champs).toContain('Tbr severe')

    // CORRIGER la saisie fait réapparaître le panneau normal (la contrainte n'est pas un blocage figé).
    fireEvent.change(inputs[1], { target: { value: '1' } }) // tbr_severe redevient <= tbr
    expect(container.querySelector('.decision-node__contrainte-suspension')).toBeNull()
    expect(titresOptionsProposees(container)).toContain('Socle toujours proposé')
  })
})

/**
 * T-023 Étape 1 (P4/S3, 2026-07-28) — ZÉRO OPTION APPLICABLE NE PRODUIT JAMAIS UNE PAGE SANS RÉPONSE.
 *
 * Deux nœuds synthétiques distincts pour les deux sous-cas explicitement distingués par la tâche :
 * une décision reste EN ATTENTE (halte), ou le nœud n'a RIEN à proposer dans son périmètre (ni
 * applicable, ni en attente). Les deux doivent produire un texte explicite à l'emplacement des cartes —
 * jamais un panneau muet (famille 7 du protocole de recette).
 */
describe('DecisionNodeScreen — T-023(a) : zéro option applicable ne produit jamais une page sans réponse', () => {
  it('formulaire vierge, une option reste EN ATTENTE : un bloc « suspendu » explicite remplace le silence à l’emplacement des cartes', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_SUSPENDU.id} go={() => {}} />)
    expect(titresOptionsProposees(container)).toEqual([])
    const bloc = container.querySelector('.decision-node__suspendu')
    expect(bloc).toBeTruthy()
    expect(bloc?.textContent).toMatch(/suspendue/i)
    // Le détail (option + critère manquant, en libellé rédigé) reste porté par le registre « en attente ».
    expect(entreesEnAttente(container)).toContain('Option suspendue — à renseigner : Critere x')
  })

  it("ni option applicable ni option en attente : l'écran dit explicitement que l'outil n'a rien à proposer", () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_RIEN_A_PROPOSER.id} go={() => {}} />)
    expect(titresOptionsProposees(container)).toEqual([])
    expect(container.querySelector('.decision-node__en-attente')).toBeNull()
    const bloc = container.querySelector('.decision-node__empty')
    expect(bloc).toBeTruthy()
    expect(bloc?.textContent).toMatch(/aucune conduite à proposer/i)
  })
})

/**
 * T-023 Étape 3-5 (P4/S3, D-06, 2026-07-28) — LE PRÉ-REMPLISSAGE CALCULÉ APPLIQUE CE QU'IL ANNONCE.
 *
 * Reproduit le défaut D-06 sur le nœud synthétique `NODE_PREREMPLISSAGE` (position vs objectif, isolée
 * du contenu réel `prescription`) : avant ce correctif, la valeur calculée par `preremplissage` (K6)
 * était écrite dans `criteria` mais jamais ajoutée à `touched`/`renseignes` — la mention « · calculé, à
 * vérifier » s'affichait donc SEULE, sans qu'aucun segment ne soit réellement sélectionné et sans que le
 * moteur cesse de réclamer le critère. Les TROIS assertions du premier `it` vérifient que les trois états
 * (segment sélectionné, mention affichée, critère absent des « à renseigner ») existent ENSEMBLE — la
 * décision clé de la tâche : aucun des trois ne doit pouvoir exister sans les deux autres.
 */
describe('DecisionNodeScreen — T-023(b) : le pré-remplissage calculé applique ce qu’il annonce (D-06)', () => {
  it('9/7 (nettement au-dessus) : le segment est réellement sélectionné, la mention s’affiche, le critère n’est plus réclamé', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_PREREMPLISSAGE.id} go={() => {}} />)
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]

    // AVANT saisie : l'option qui dépend de `position` est EN ATTENTE.
    expect(entreesEnAttente(container)).toContain('Option position-dépendante — à renseigner : Position')

    fireEvent.change(inputs[0], { target: { value: '9' } }) // valeur_actuelle
    fireEvent.change(inputs[1], { target: { value: '7' } }) // valeur_cible

    // (1) Segment RÉELLEMENT sélectionné — `aria-pressed="true"`, pas seulement `data-on`. Libellé du
    // catalogue existant (`lib/labels.ts` ENUM_VALUE_LABELS, la valeur `au_dessus` y est déjà cataloguée
    // pour le nœud réel `prescription`) plutôt que le repli `humanize` — même valeur d'énumération,
    // même libellé, peu importe le nœud qui la porte (le dictionnaire est indexé par la VALEUR seule).
    const bouton = screen.getByRole('button', { name: "Au-dessus de l'objectif" })
    expect(bouton.getAttribute('aria-pressed')).toBe('true')

    // (2) Mention affichée — le champ dit d'où vient la valeur.
    const champ = bouton.closest('.criteria-form__field')
    expect(champ?.textContent).toContain('calculé, à vérifier')

    // (3) Critère ABSENT des « à renseigner » — l'option quitte le registre « en attente » et devient
    // une carte proposée : le moteur a bien reçu la valeur comme renseignée, pas seulement l'écran.
    expect(entreesEnAttente(container)).not.toContain('Option position-dépendante — à renseigner : Position')
    expect(titresOptionsProposees(container)).toContain('Option position-dépendante')
  })

  it('6,5/8,5 (sous la cible, D28) : rien n’est pré-rempli, aucune mention ne s’affiche', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_PREREMPLISSAGE.id} go={() => {}} />)
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]

    fireEvent.change(inputs[0], { target: { value: '6.5' } }) // valeur_actuelle
    fireEvent.change(inputs[1], { target: { value: '8.5' } }) // valeur_cible (actuelle SOUS la cible)

    // Aucun segment sélectionné (le contenu ne déclare aucune règle sous la cible, D28 — délibéré).
    const segments = container.querySelectorAll('.criteria-form__segment')
    expect([...segments].some((s) => s.getAttribute('aria-pressed') === 'true')).toBe(false)
    // Aucune mention « calculé, à vérifier » nulle part sur la page.
    expect(container.textContent).not.toContain('calculé, à vérifier')
    // Le critère reste réclamé — rien n'a été posé à sa place.
    expect(entreesEnAttente(container)).toContain('Option position-dépendante — à renseigner : Position')
  })
})

/**
 * T-024 (P4/S3, 2026-07-28) — « À ÉGALITÉ » ASSUME LE CHOIX AU LIEU DE LE SUGGÉRER.
 *
 * Sur `NODE_EGALITE` (deux options de même rang fini, aucune famille déclarée), vérifie que la mention
 * dit explicitement que le départage revient au praticien — et que l'ancienne formulation muette
 * (« À ÉGALITÉ — MÊME NIVEAU DE PRIORITÉ. », sans aucun contenu de départage) a bien disparu.
 */
describe('DecisionNodeScreen — T-024 : deux options à égalité disent que le départage revient au praticien', () => {
  it('sur un profil à deux options de même rang, la mention nomme explicitement le praticien', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_EGALITE.id} go={() => {}} />)

    expect(titresOptionsProposees(container)).toEqual(['Option A', 'Option B'])
    const mention = container.querySelector('.decision-node__egalite-mention')
    expect(mention).toBeTruthy()
    expect(mention?.textContent).toMatch(/départage/i)
    expect(mention?.textContent).toMatch(/praticien/i)
    // L'ancienne mention, elle, ne portait aucun de ces deux mots.
    expect(mention?.textContent).not.toMatch(/^À égalité — même niveau de priorité\.$/)
  })
})
