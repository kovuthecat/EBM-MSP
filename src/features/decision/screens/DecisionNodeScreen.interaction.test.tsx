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
  NODE_PRIORITES,
  NODE_INDISPONIBLE,
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
        synthese_critique: { donnee: '' },
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
        synthese_critique: { donnee: '' },
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

  /**
   * B2 (2026-08-01) — un nœud dont le formulaire VIERGE laisse PLUS DE TROIS critères distincts en
   * attente : c'est le seuil au-delà duquel le panneau bascule sur « Commencez par : … » plutôt que sur
   * l'énumération option par option. `bloquant` est réclamé par les TROIS options, les autres par une
   * seule chacun — il doit donc sortir en tête du classement, alors qu'il n'apparaît pas le premier dans
   * la déclaration de la 1ʳᵉ option.
   */
  function buildPrioritesNode(): Noeud {
    return {
      id: 'noeud-interaction-priorites-test',
      domaine: 'test',
      titre: 'Nœud de test (priorités de saisie)',
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [
        { nom: 'seul_a', type: 'bool', groupe: 'Divers' },
        { nom: 'bloquant', type: 'bool', groupe: 'Divers' },
        { nom: 'seul_b', type: 'bool', groupe: 'Divers' },
        { nom: 'seul_c', type: 'bool', groupe: 'Divers' },
      ],
      options: [
        opt('Option A', ['seul_a == true AND bloquant == true']),
        opt('Option B', ['seul_b == true AND bloquant == true']),
        opt('Option C', ['seul_c == true AND bloquant == true']),
      ],
      ...metaCommune(),
    }
  }

  /**
   * T-134 (P12/S9) — un critère DÉCISIF qui ne bloque JAMAIS l'option (reproduit le mécanisme réel de la
   * recette du 02/08, N7 : sur `prescription`, l'albuminurie ne fait jamais basculer iSGLT2 en `enAttente`
   * — l'option reste `applicable` quelle que soit sa valeur — et pourtant `engine/relevance.ts` la voit
   * DÉCISIVE parce qu'elle fait apparaître/disparaître une ALERTE D'OPTION selon sa valeur, ce qui change
   * la signature de la vue). L'unique option est un socle `["toujours"]` (jamais `enAttente`, jamais
   * `nonRetenue`) ; seule son ALERTE dépend d'`albuminurie` — c'est CETTE dimension, et elle seule, que la
   * perturbation détecte : `albuminurie` est donc `pertinent` (« décisif ») sans jamais être un critère
   * `enAttente` d'aucune option, exactement le cas que le bandeau « Reco provisoire » doit pouvoir résoudre
   * SANS qu'aucune carte ne bouge.
   */
  function buildIndisponibleNode(): Noeud {
    return {
      id: 'noeud-interaction-indisponible-test',
      domaine: 'test',
      titre: 'Nœud de test (indisponible)',
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [{ nom: 'albuminurie', type: 'enum', valeurs: ['normo', 'micro', 'macro'], groupe: 'Bilan' }],
      options: [
        opt('Socle protecteur', ['toujours'], {
          alertes: [{ quand: 'albuminurie == macro', message: 'Alerte de test : albuminurie macro' }],
        }),
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
    NODE_PRIORITES: buildPrioritesNode(),
    NODE_INDISPONIBLE: buildIndisponibleNode(),
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
  const tousLesNoeudsTest = [
    NODE,
    NODE_CONTRAINTE,
    NODE_SUSPENDU,
    NODE_RIEN_A_PROPOSER,
    NODE_PREREMPLISSAGE,
    NODE_EGALITE,
    NODE_PRIORITES,
    NODE_INDISPONIBLE,
  ]
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
/**
 * Remontée UI (2026-07-29) : le registre « en attente » n'énumère plus, par option, le nom du critère
 * qui la bloque (`.decision-node__en-attente-item`, retiré — contenu jugé redondant avec le rappel des
 * champs manquants déjà affiché par onglet). Seul le TITRE du bloc (`.decision-node__en-attente-titre`)
 * subsiste désormais dans le DOM ; cette aide de test n'en vérifie donc plus que la PRÉSENCE, plus la
 * liste — les tests qui avaient besoin de savoir QUELLE option est en attente s'appuient sur
 * `titresOptionsProposees` (son ABSENCE des cartes proposées) à la place.
 */
function blocEnAttentePresent(container: HTMLElement): boolean {
  return container.querySelector('.decision-node__en-attente') != null
}

/**
 * Accordéon du formulaire (P6 · SB2, `CriteriaForm.tsx`) : ouvre un groupe en cliquant sur le TITRE de sa
 * section repliée — `NODE` (ci-dessus) porte 3 groupes (Bilan/Sécurité/Antécédents), « Bilan » ouvert par
 * défaut, les deux autres repliés.
 *
 * PASSAIT AUPARAVANT PAR LA BARRE DE CHIPS, supprimée le 2026-07-29 (recette référent : elle doublait le
 * titre de section, qui porte désormais lui-même le compteur « N à confirmer »). Le titre d'une section
 * repliée était DÉJÀ un bouton d'ouverture avant ce changement — c'est donc le même geste utilisateur,
 * par le seul canal qui subsiste, et non un contournement inventé pour ce test.
 *
 * Sélection par classe plutôt que par `getByRole` : le titre porte maintenant le compteur dans le même
 * bouton, son nom accessible n'est donc plus exactement le libellé du groupe.
 *
 * IDEMPOTENT depuis le 2026-08-09 (même garde que `ouvrirSection`, `DecisionNodeScreen.bascule.test.tsx`) :
 * une section peut désormais s'ouvrir TOUTE SEULE (auto-avance sur un dernier décisif répondu,
 * `CriteriaForm.tsx` `avanceSiSectionComplete`) AVANT que ce test ne l'ouvre lui-même explicitement — ce
 * n'est plus une erreur, seulement un geste devenu superflu. Ne lève une erreur QUE si la section reste
 * introuvable À L'ÉTAT OUVERT NON PLUS (aucun `.criteria-form__label` ouvert ne porte ce libellé).
 */
function ouvrirGroupeFormulaire(container: HTMLElement, libelleGroupe: string) {
  const titre = [...container.querySelectorAll('.criteria-form__group-header-bouton')].find((bouton) =>
    new RegExp(libelleGroupe, 'i').test(bouton.textContent ?? ''),
  )
  if (!titre) {
    const dejaOuverte = [...container.querySelectorAll('.criteria-form__label')].some((label) =>
      new RegExp(libelleGroupe, 'i').test(label.textContent ?? ''),
    )
    if (dejaOuverte) return
    throw new Error(`section repliée « ${libelleGroupe} » introuvable (déjà ouverte ? un seul groupe ?)`)
  }
  fireEvent.click(titre)
}

describe('DecisionNodeScreen — comportement 1 : un `nombre` vidé quitte `renseignes` (D20 R7, défauts de recette 12.2/13.3)', () => {
  it('saisir puis effacer nb_facteurs_risque fait réapparaître le registre « en attente » et disparaître l’option qui en dépendait', () => {
    const { container } = renderNode()
    const input = nombreInput()

    // État initial (jamais touché) : champ vide, l'option qui dépend de ce critère est EN ATTENTE, pas
    // simplement absente — le registre existe (même s'il ne nomme plus le critère manquant, cf.
    // `blocEnAttentePresent`).
    expect(input.value).toBe('')
    expect(titresOptionsProposees(container)).not.toContain('Renfort')
    expect(blocEnAttentePresent(container)).toBe(true)

    // 1. SAISIE : franchit le seuil (>= 2) → l'option devient proposée, quitte le registre « en attente ».
    fireEvent.change(input, { target: { value: '3' } })
    expect(input.value).toBe('3')
    expect(titresOptionsProposees(container)).toContain('Renfort')

    // 2. EFFACEMENT (pas une remise à 0 manuelle) : déclenche `onEffacer`, PAS `onChange('nb_facteurs_risque', 0)`.
    // Si le défaut de recette 12.2/13.3 était réintroduit (`Number('') = 0` traité comme une réponse), le
    // critère resterait `renseignes` à 0 : l'option disparaîtrait SILENCIEUSEMENT (0 < 2, non satisfaite)
    // sans jamais repasser par le registre « en attente ». C'est précisément ce que les deux assertions
    // suivantes excluent.
    fireEvent.change(input, { target: { value: '' } })
    expect(input.value).toBe('') // redevient visuellement indiscernable d'un champ jamais saisi.
    expect(titresOptionsProposees(container)).not.toContain('Renfort')
    expect(blocEnAttentePresent(container)).toBe(true) // ⇐ EN ATTENTE, pas silencieusement écartée.
  })
})

describe('DecisionNodeScreen — comportement 2 : le registre « en attente » signale une décision suspendue', () => {
  it('sur formulaire vierge, aucune des deux options indéterminées ne devient une carte proposée, et le registre « en attente » l’annonce', () => {
    const { container } = renderNode()
    // Remontée UI (2026-07-29) : le détail par option (nom du critère qui bloque) est retiré du DOM à la
    // demande — seul le titre du registre subsiste (`blocEnAttentePresent`) ; l'absence des deux options
    // parmi les cartes proposées reste, elle, vérifiable.
    expect(screen.getByText(/^En attente/)).toBeTruthy()
    expect(blocEnAttentePresent(container)).toBe(true)
    expect(titresOptionsProposees(container)).not.toContain('Renfort')
    expect(titresOptionsProposees(container)).not.toContain('Suivi renforcé')
  })
})

describe('DecisionNodeScreen — comportement 3 : « Rien à signaler » apparaît dès UN booléen décisif isolé (seuil à 1, D20 R7)', () => {
  it('le bouton est présent dans la section « Sécurité » (un seul `confirmation_requise`), et le confirme sans le cocher', () => {
    const { container } = renderNode()
    // P6 · SB2 (accordéon) : le nœud porte 3 groupes (Bilan/Sécurité/Antécédents) → une seule section
    // ouverte à la fois, « Bilan » par défaut. Ouvrir « Sécurité » avant d'y chercher un champ — ses
    // champs ne sont pas dans le DOM tant que la section reste repliée.
    ouvrirGroupeFormulaire(container, 'Sécurité')
    // T-157 (P13/S8) — `within(formulaire)` plutôt qu'une recherche PLEINE PAGE : le cartouche « en
    // attente » porte désormais, dans la colonne RÉSULTATS, un `button` cliquable portant LE MÊME texte
    // (« Aller au champ « Evenement grave » ») — `getByLabelText` SANS portée les confondait (les deux
    // « contiennent » le texte cherché). Le formulaire (`.criteria-form`) et les résultats sont deux
    // sous-arbres disjoints (cf. `DecisionNodeScreen.tsx`, colonnes `form-col`/`results-col`) : y borner
    // la recherche lève l'ambiguïté sans changer la façon de chercher UN CHAMP DE FORMULAIRE.
    const formulaire = within(container.querySelector('.criteria-form') as HTMLElement)
    const checkbox = formulaire.getByLabelText('Evenement grave', { exact: false }) as HTMLInputElement
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
    expect(titresOptionsProposees(container)).not.toContain('Suivi renforcé')
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
    const { container } = renderNode()
    // P6 · SB2 (accordéon) : ouvrir « Sécurité » (repliée par défaut, seule « Bilan » l'est).
    ouvrirGroupeFormulaire(container, 'Sécurité')
    // T-157 — `within(formulaire)`, cf. le commentaire du même correctif un peu plus haut dans ce fichier
    // (collision avec le lien cliquable du cartouche « en attente »).
    const checkbox = within(container.querySelector('.criteria-form') as HTMLElement).getByLabelText(
      'Evenement grave',
      { exact: false },
    )
    const label = checkbox.closest('label')
    if (!label) throw new Error('label introuvable')
    expect(label.textContent).toContain('à confirmer')
  })

  it('marque AUSSI le `bool` ORDINAIRE décisif non renseigné — et sa section propose toujours « Rien à signaler » pour le résoudre', () => {
    const { container } = renderNode()
    // P6 · SB2 (accordéon) : ouvrir « Antécédents » (repliée par défaut, seule « Bilan » l'est).
    ouvrirGroupeFormulaire(container, 'Antécédents')
    // T-157 — `within(formulaire)`, même raison.
    const checkbox = within(container.querySelector('.criteria-form') as HTMLElement).getByLabelText(
      'Ascvd etablie',
      { exact: false },
    )
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

    // P6/SB4 (T-041) — le bloc de suspension (D31) doit vivre DANS la colonne résultats sticky (SB1),
    // pas être resté à l'extérieur par un oubli de déplacement : c'est elle qui reste visible pendant que
    // le formulaire défile, à gauche.
    expect(
      container.querySelector('.decision-node__results-col .decision-node__contrainte-suspension'),
    ).toBeTruthy()

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
  it('formulaire vierge, une option reste EN ATTENTE : le bloc « en attente » est le SEUL rendu à l’emplacement des cartes (remontée UI 2026-07-29 : plus de doublon avec « suspendu »/« reco provisoire »)', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_SUSPENDU.id} go={() => {}} />)
    expect(titresOptionsProposees(container)).toEqual([])
    // Les deux registres redondants (« suspendu », « reco provisoire ») ne sont plus rendus dans cet état,
    // et le bloc « en attente » ci-dessous n'énumère plus non plus l'option/le critère en cause (retiré à
    // la demande, 2026-07-29) — seul son titre en est désormais le seul porteur : trois puis deux alertes
    // qui se recoupaient sur un formulaire vide n'en font plus qu'une, réduite à l'essentiel.
    expect(container.querySelector('.decision-node__suspendu')).toBeNull()
    expect(container.querySelector('.decision-node__provisional')).toBeNull()
    expect(blocEnAttentePresent(container)).toBe(true)
    // P6/SB4 (T-041) — ce bloc « zéro carte » doit lui aussi vivre DANS la colonne résultats sticky (SB1).
    expect(container.querySelector('.decision-node__results-col .decision-node__en-attente')).toBeTruthy()
  })

  it("ni option applicable ni option en attente : l'écran dit explicitement que l'outil n'a rien à proposer", () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_RIEN_A_PROPOSER.id} go={() => {}} />)
    expect(titresOptionsProposees(container)).toEqual([])
    expect(container.querySelector('.decision-node__en-attente')).toBeNull()
    const bloc = container.querySelector('.decision-node__empty')
    expect(bloc).toBeTruthy()
    expect(bloc?.textContent).toMatch(/aucune conduite à proposer/i)
    // P6/SB4 (T-041) — même vérification que ci-dessus, pour l'autre bloc « zéro carte ».
    expect(container.querySelector('.decision-node__results-col .decision-node__empty')).toBeTruthy()
  })
})

/**
 * P10/S2 (T-079, 2026-07-31) — LE PANNEAU « POURQUOI PAS D'AUTRES OPTIONS ? » ÉNUMÈRE À LA NÉGATIVE.
 *
 * `lib/conditionText.test.ts` couvre la formulation elle-même ; ce test vérifie le CÂBLAGE — que l'écran
 * appelle bien `describeNonApplicable` (et non plus `describeReasons`, qui rendait la condition échouée
 * comme n'importe quelle raison satisfaite, à l'affirmative). Le nœud `NODE_RIEN_A_PROPOSER` sert ici une
 * seconde fois : son unique option part en `nonRetenues` dès le formulaire vierge (`presomption_non`),
 * c'est-à-dire exactement l'état où ce panneau est la SEULE explication disponible.
 */
describe('DecisionNodeScreen — P10/S2 : les options non retenues sont dites à la négative', () => {
  it('dit ce qui MANQUE, au lieu d’énoncer la condition échouée comme un fait du patient', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_RIEN_A_PROPOSER.id} go={() => {}} />)
    // Le panneau est « à la demande » (R4) : rien n'est poussé tant qu'on ne l'ouvre pas.
    expect(container.querySelector('.decision-node__non-retenue')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /pourquoi pas d/i }))

    const ligne = container.querySelector('.decision-node__non-retenue')?.textContent ?? ''
    expect(ligne).toBe("Option jamais par défaut — ne s'applique pas : il faudrait flag presume")
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

    // AVANT saisie : l'option qui dépend de `position` est EN ATTENTE (pas encore une carte proposée).
    expect(titresOptionsProposees(container)).not.toContain('Option position-dépendante')
    expect(blocEnAttentePresent(container)).toBe(true)

    fireEvent.change(inputs[0], { target: { value: '9' } }) // valeur_actuelle
    fireEvent.change(inputs[1], { target: { value: '7' } }) // valeur_cible

    // (1) Segment RÉELLEMENT sélectionné — `aria-pressed="true"`, pas seulement `data-on`. Libellé du
    // catalogue existant (`lib/labels.ts` ENUM_VALUE_LABELS, la valeur `au_dessus` y est déjà cataloguée
    // pour le nœud réel `prescription`) plutôt que le repli `humanize` — même valeur d'énumération,
    // même libellé, peu importe le nœud qui la porte (le dictionnaire est indexé par la VALEUR seule).
    // Libellé raccourci le 2026-08-01 (amélioration de lisibilité, `ENUM_VALUE_LABELS.au_dessus`) : le
    // sens complet a migré vers `describeEnumValue` (infobulle), le catalogue reste le même mécanisme.
    const bouton = screen.getByRole('button', { name: 'Au-dessus' })
    expect(bouton.getAttribute('aria-pressed')).toBe('true')

    // (2) Mention affichée — le champ dit d'où vient la valeur.
    const champ = bouton.closest('.criteria-form__field')
    expect(champ?.textContent).toContain('calculé, à vérifier')

    // (3) L'option quitte le registre « en attente » et devient une carte proposée : le moteur a bien
    // reçu la valeur comme renseignée, pas seulement l'écran.
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
    // Le critère reste réclamé — rien n'a été posé à sa place : l'option n'est toujours pas proposée.
    expect(titresOptionsProposees(container)).not.toContain('Option position-dépendante')
    expect(blocEnAttentePresent(container)).toBe(true)
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

/**
 * B2 (arbitrage référent, 2026-08-01) — LE FORMULAIRE VIERGE DIT PAR QUOI COMMENCER.
 *
 * Le défaut corrigé : sur un formulaire où rien n'est encore saisi, le panneau « En attente » énumérait
 * une ligne par option (une vingtaine sur `prescription`), chacune répétant les mêmes noms de critères.
 * C'est le PREMIER écran que voit le praticien, et le correctif P8 — une phrase compacte — ne s'y
 * appliquait jamais : son seuil (≤ 3 critères distincts) visait un formulaire déjà rempli.
 *
 * Ce qui est vérifié ici est le COMPORTEMENT, jamais la formulation exacte : la présence d'une amorce,
 * le fait que le critère le plus bloquant y figure, et surtout que le détail par option n'a pas été
 * SUPPRIMÉ mais DÉPLACÉ derrière un dépli (R4/D20 — on change ce qui est mis en avant, jamais ce qui
 * est disponible).
 */
describe('DecisionNodeScreen — B2 : sur formulaire vierge, le panneau « en attente » amorce la saisie', () => {
  it('met en tête le critère qui débloque le plus d’options, et range le détail par option dans un dépli', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_PRIORITES.id} go={() => {}} />)

    const panneau = container.querySelector('.decision-node__en-attente')
    expect(panneau).toBeTruthy()

    // Une amorce, et le critère réclamé par les TROIS options y arrive EN TÊTE — pas seulement présent :
    // c'est sa POSITION qui porte la réponse à « par quoi je commence ». Le libellé est celui rendu à
    // l'écran (`labelForCritere`), jamais le nom brut du critère.
    const amorce = panneau?.querySelector('.decision-node__en-attente-item')
    expect(amorce?.textContent).toMatch(/Commencez par\s*:\s*Bloquant/i)

    // Le détail par option existe TOUJOURS, mais derrière un dépli : rien n'a été retiré.
    // 2026-08-10 : rendu en lignes (`.decision-node__en-attente-ligne`, une par option) plutôt qu'en
    // paragraphes à plat — même information, classe renommée en conséquence.
    const detail = panneau?.querySelector('.decision-node__en-attente-detail')
    expect(detail).toBeTruthy()
    expect(detail?.querySelectorAll('.decision-node__en-attente-ligne')).toHaveLength(3)

    // ... et il n'est PLUS déversé au premier niveau du panneau : c'est tout l'objet du correctif.
    const auPremierNiveau = [...(panneau?.children ?? [])].filter((el) =>
      el.classList.contains('decision-node__en-attente-item'),
    )
    expect(auPremierNiveau).toHaveLength(1)
  })
})

/**
 * T-141 (P13/S2) — ACCORD DU VERBE AU SINGULIER (« 1 autre reste », pas « 1 autre restent »).
 *
 * Réutilise `NODE_PRIORITES` (B2 ci-dessus) : 4 critères distincts en attente sur formulaire vierge,
 * donc `priorites.length === 4` → branche `> 3`, tête de 3 critères, `reste === 1`. C'est exactement le
 * cas que l'ancien code accordait mal (le pluriel de la phrase environnante, jamais celui de `reste`).
 */
describe('DecisionNodeScreen — T-141 : accord du verbe au singulier dans le compte des critères restants', () => {
  it('reste === 1 : « 1 autre reste à renseigner ensuite », jamais « restent »', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_PRIORITES.id} go={() => {}} />)
    const note = container.querySelector('.decision-node__en-attente-note')
    expect(note?.textContent).toMatch(/1 autre reste à renseigner ensuite/)
    expect(note?.textContent).not.toMatch(/1 autre restent/)
  })
})

/**
 * T-139 (P13/S2) — LE DÉTAIL OPTION PAR OPTION EST ACCESSIBLE QUEL QUE SOIT LE NOMBRE DE CRITÈRES
 * MANQUANTS, PAS SEULEMENT AU-DELÀ DE 3 (§4.3 T4 / §7 P7 de la revue de conception, opacité N25).
 *
 * Avant ce correctif, le dépli « Voir le détail, option par option » n'était rendu QUE dans la branche
 * `priorites.length > 3` : dès qu'il ne restait qu'un ou deux critères distincts à saisir, l'écran disait
 * « À renseigner pour trancher : … » et AUCUNE option n'était nommée nulle part, dépli compris — c'était
 * littéralement N25 (Initier, un seul critère manquant, l'option de sécurité « Insuline d'initiation »
 * disparue de l'écran). Réutilise `NODE` (comportement 1/2/3/4 ci-dessus) : deux des trois critères
 * décisifs confirmés, un seul (`nb_facteurs_risque`) laissé vide — `priorites.length === 1`, la branche
 * QUI NE RENDAIT RIEN avant ce correctif. « Renfort » (l'option dont ce critère est le seul manquant)
 * doit être trouvable dans le DOM, dans le dépli.
 */
describe('DecisionNodeScreen — T-139 : le détail option par option est accessible même sous le seuil de 3 critères', () => {
  it('un seul critère manquant, une option en attente : son intitulé est présent dans le DOM (dépli)', () => {
    const { container } = renderNode()

    // Confirme les deux AUTRES critères décisifs (evenement_grave, ascvd_etablie), ne laisse QUE
    // nb_facteurs_risque non renseigné.
    ouvrirGroupeFormulaire(container, 'Sécurité')
    // T-157 — `within(formulaire)`, même raison que les deux correctifs plus haut dans ce fichier.
    const formulaire = within(container.querySelector('.criteria-form') as HTMLElement)
    const evenementGrave = formulaire.getByLabelText('Evenement grave', { exact: false }) as HTMLInputElement
    fireEvent.click(evenementGrave)
    expect(evenementGrave.checked).toBe(true)

    ouvrirGroupeFormulaire(container, 'Antécédents')
    const ascvdEtablie = within(container.querySelector('.criteria-form') as HTMLElement).getByLabelText(
      'Ascvd etablie',
      { exact: false },
    ) as HTMLInputElement
    fireEvent.click(ascvdEtablie)
    expect(ascvdEtablie.checked).toBe(true)

    // Les deux options qui dépendaient de ces critères sont désormais proposées ; seule « Renfort » reste
    // en attente, bloquée par le seul critère encore manquant.
    expect(titresOptionsProposees(container)).toContain('Suivi renforcé')
    expect(titresOptionsProposees(container)).toContain('Alerte cardio')
    expect(titresOptionsProposees(container)).not.toContain('Renfort')

    // AVANT T-139 : la phrase de tête (« À renseigner pour trancher : Nb facteurs risque. ») était la
    // SEULE chose rendue dans ce bloc — aucun dépli, donc aucun endroit où lire « Renfort ». C'est cette
    // absence que ce test rend rouge en premier.
    const panneau = container.querySelector('.decision-node__en-attente')
    expect(panneau).toBeTruthy()
    const detail = panneau?.querySelector('.decision-node__en-attente-detail')
    expect(detail).toBeTruthy()
    expect(detail?.textContent).toMatch(/Renfort/)
  })
})

/**
 * T-134 (P12/S9) — « JE NE L'AURAI PAS » : LE PRATICIEN DÉCLARE QU'UN CRITÈRE DÉCISIF RESTERA INCONNU.
 *
 * Reproduit le SCÉNARIO DE RÉFÉRENCE de la recette du 02/08 (N7, Mme Chevallier, 88 ans, EHPAD :
 * l'albuminurie manque au dossier et n'y sera jamais) SANS dépendre du contenu réel `prescription` —
 * `NODE_INDISPONIBLE` ci-dessus reproduit le MÊME mécanisme (un critère décisif via une ALERTE d'option,
 * qui ne bloque JAMAIS l'unique option `["toujours"]`, cf. sa docstring). Trois exigences, dans l'ordre où
 * `S9.md` les pose : (1) non-régression stricte tant que rien n'est déclaré ; (2) après déclaration, la
 * reco cesse d'être « provisoire » ET la mention de loyauté apparaît ; (3) AUCUNE option n'a changé — la
 * même carte, avant et après, jamais une autre.
 */
describe('DecisionNodeScreen — T-134 : déclarer un critère indisponible', () => {
  it('AVANT toute déclaration : comportement STRICTEMENT inchangé (non-régression)', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_INDISPONIBLE.id} go={() => {}} />)
    expect(titresOptionsProposees(container)).toEqual(['Socle protecteur'])
    const banniere = container.querySelector('.decision-node__provisional')
    expect(banniere?.textContent).toMatch(/Reco provisoire/)
    expect(banniere?.textContent).toMatch(/1 critère à confirmer/)
    // Aucune mention de loyauté tant que rien n'est déclaré — elle n'a pas d'objet.
    expect(container.querySelector('.decision-node__indisponible-mention')).toBeNull()
    expect(screen.getByRole('button', { name: 'Indisponible' })).toBeTruthy()
  })

  it("après déclaration : la reco cesse d'être provisoire, la mention d'absence apparaît, AUCUNE option ne change", () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_INDISPONIBLE.id} go={() => {}} />)
    const avant = titresOptionsProposees(container)

    fireEvent.click(screen.getByRole('button', { name: 'Indisponible' }))

    // AUCUNE OPTION NE CHANGE (garde-fou R7 — « Si bloqué » de S9.md) : même carte unique, avant/après.
    expect(titresOptionsProposees(container)).toEqual(avant)
    expect(titresOptionsProposees(container)).toEqual(['Socle protecteur'])

    // La reco n'est plus « provisoire ».
    expect(container.querySelector('.decision-node__provisional')).toBeNull()

    // La mention de loyauté nomme le critère et RÉUTILISE le registre du bloc de cadrage (« c'est au
    // praticien de le faire », `content/decision/noeuds/diabete-type-2/prescription.yaml` § cadrage).
    const mention = container.querySelector('.decision-node__indisponible-mention')
    expect(mention).toBeTruthy()
    expect(mention?.textContent).toMatch(/Albuminurie/)
    expect(mention?.textContent).toMatch(/c'est au praticien de le faire/)

    // Le bouton d'action a cédé la place à la mention déclarée (elle-même cliquable, pour annuler).
    // 2026-08-10 : icône seule (`Icon nom="interdit"`), le nom accessible porte désormais l'information
    // à la place du texte visible (`renderIndisponible`, `CriteriaForm.tsx`).
    expect(screen.queryByRole('button', { name: 'Indisponible' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Marqué indisponible' })).toBeTruthy()
  })

  it('un second clic ANNULE la déclaration (toggle) : le critère redevient réclamé normalement', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_INDISPONIBLE.id} go={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Indisponible' }))
    fireEvent.click(screen.getByRole('button', { name: 'Marqué indisponible' }))

    expect(container.querySelector('.decision-node__provisional')?.textContent).toMatch(/1 critère à confirmer/)
    expect(container.querySelector('.decision-node__indisponible-mention')).toBeNull()
    expect(screen.getByRole('button', { name: 'Indisponible' })).toBeTruthy()
  })

  /**
   * T-134, étape 4 de S9.md : « exclus les critères déclarés indisponibles … du cartouche EN ATTENTE ».
   * Réutilise `NODE` (comportement 1/2/4 ci-dessus, trois critères décisifs non confirmés dont
   * `nb_facteurs_risque` bloque « Renfort » en `enAttente`) plutôt qu'un nœud dédié — c'est le SEUL nœud
   * synthétique de ce fichier où un critère décisif RÉCLAMÉ par le cartouche EN ATTENTE (pas seulement le
   * bandeau « Reco provisoire ») peut être déclaré indisponible.
   */
  it('T-134 — le cartouche EN ATTENTE cesse aussi de nommer le critère déclaré indisponible', () => {
    const { container } = renderNode()
    // AVANT : les trois critères manquants (seuil ≤ 3, B2) sont nommés, `nb_facteurs_risque` compris.
    const avant = container.querySelector('.decision-node__en-attente-item')
    expect(avant?.textContent).toMatch(/Nb facteurs risque/i)

    // Le bouton « Indisponible » DU CHAMP NOMBRE, distingué des deux autres (un par critère décisif) par
    // sa proximité DOM avec l'unique `<input type="number">` du nœud. Icône depuis le 2026-08-10 (classe
    // renommée en conséquence, `CriteriaForm.css`).
    const champNombre = nombreInput().closest('.criteria-form__field')
    const boutonNombre = champNombre?.querySelector('.criteria-form__field-indisponible-icone')
    expect(boutonNombre).toBeTruthy()
    fireEvent.click(boutonNombre as Element)

    // APRÈS : `nb_facteurs_risque` a disparu de ce qui est réclamé, les deux autres critères restent.
    const apres = container.querySelector('.decision-node__en-attente-item')
    expect(apres?.textContent).not.toMatch(/Nb facteurs risque/i)
    expect(apres?.textContent).toMatch(/Evenement grave/i)
    expect(apres?.textContent).toMatch(/Ascvd etablie/i)

    // « Traitement de base » (`["toujours"]`) reste la SEULE option affichée — aucune option n'a changé.
    expect(titresOptionsProposees(container)).toEqual(['Traitement de base'])
  })
})
