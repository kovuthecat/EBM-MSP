import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import type { Navigation } from '../../shared/navigation'
import { AlertList } from '../components/AlertList'
import { ArgumentPanel } from '../components/ArgumentPanel'
import { CadrageList } from '../components/CadrageList'
import { CriteriaForm } from '../components/CriteriaForm'
import { BasRangChip, OptionBadgeChip, OptionCard } from '../components/OptionCard'
import { PopulationCible } from '../components/PopulationCible'
import { Icon } from '../../shared/icons/Icon'
import { getModuleDuNoeud } from '../content/loadModules'
import { getNoeudById } from '../content/loadNodes'
import type { ActionOption, CritereEntree } from '../content/node.types'
import type { Criteria, CriteriaValue } from '../engine/conditions'
import { contraintesViolees } from '../engine/contraintes'
import { criteresPertinents } from '../engine/relevance'
import { describeNonApplicable, describeReasons } from '../lib/conditionText'
import { hasEsperanceVieCritere, suggestionEsperanceVieSiApplicable } from '../lib/esperanceVieDefault'
import {
  appliquerPreremplissage,
  buildDefaultCriteria,
  champsVisibles,
  decisifsAConfirmer,
  reinitialiserChampsMasques,
  valeurParDefaut,
  valeursProposeesDepuisSaisie,
} from '../lib/formLayout'
import { prioritesDeSaisie } from '../lib/prioritesSaisie'
import {
  memoriserCriteres,
  publierCritere,
  reinitialiserSession,
  valeursPubliees,
  valeursReprises,
  type ValeurPubliee,
  type ValeurReprise,
} from '../lib/sessionCriteres'
import { plafonnerPistes, PLAFOND_PISTES, type PartitionAffichage } from '../lib/replierAffichage'
import type { FamilleVue } from '../lib/vueDecision'
import { construireVueDecision } from '../lib/vueDecision'
import { formatDateRevue, labelForCritere, labelForDomaine } from '../lib/labels'
import './DecisionNodeScreen.css'

/**
 * Seuil JS « écran étroit » (P11/S7, T-114) — extrait des deux appels `matchMedia` ci-dessous, qui
 * l'écrivaient chacun en dur. TROIS copies de ce seuil coexistent dans le repo et NE PEUVENT PAS devenir
 * une seule source : une custom property CSS (`tokens.css`) est interdite dans une `@media` (S1), donc
 * `DecisionNodeScreen.css` garde ses deux valeurs littérales — `@media (min-width: 1200px)` (l.36) et
 * `@media (max-width: 1199px)` (l.69). Cette constante est la troisième copie, côté JS ; le commentaire de
 * tête de `tokens.css` explique pourquoi la CSS n'est pas centralisable. **Les trois valeurs doivent
 * changer ENSEMBLE** — un seul endroit modifié sans les deux autres recrée l'incohérence que T-114 corrige.
 *
 * Remonté de 959/960 à 1199/1200 (P12/S3, T-123, D47) : remesure sur les intitulés raccourcis par S2
 * (nœud `prescription`, 4 cartes) — la zone 1000-1100px est la seule où la grille à deux colonnes fait
 * encore déborder un titre de carte sur plusieurs lignes (0/4 puis 2/4 cartes sur une ligne), alors que
 * l'empilé (< seuil) et le large (≥ 1280px) tiennent déjà 4/4. 1200 fait passer toute cette zone dans le
 * régime empilé, où la colonne résultats a la pleine largeur de l'écran plutôt que la moitié d'une grille.
 */
export const LARGEUR_ETROITE_MAX = 1199

interface DecisionNodeScreenProps {
  nodeId: string | undefined
  go: Navigation['go']
}

/**
 * Noms des critères SAISISSABLES cités par l'expression d'une contrainte violée (T-022, P4/S3) — pour
 * nommer « les champs en cause » dans le bloc de suspension (D31). Même mécanique de correspondance que
 * `engine/evaluateNode.ts` `primitivesReferencees` (frontière de mot `\b`, un seul niveau de
 * déréférencement d'un critère `derive`, jamais chaîné) — RÉIMPLÉMENTÉE ici plutôt qu'importée : usage de
 * PRÉSENTATION seulement, même parti pris que `lib/conditionText.ts` (qui ne réutilise pas non plus le
 * moteur pour cette raison) ; `engine/` est hors périmètre de cette session (S3.md "Hors périmètre").
 *
 * Une contrainte (`engine/contraintes.ts`) compare typiquement DEUX critères entre eux (ex.
 * `"TBR_severe <= TBR"`) : les deux noms référencés par l'expression comptent comme « en cause », pas
 * seulement celui de gauche — l'outil ne sait pas lequel des deux est erroné (cf. docstring
 * `Contrainte`, `content/node.types.ts`).
 */
function champsEnCause(expression: string, criteresEntree: CritereEntree[]): string[] {
  const noms = new Set<string>()
  for (const critere of criteresEntree) {
    if (!new RegExp(`\\b${critere.nom}\\b`).test(expression)) continue
    if (critere.derive == null) {
      noms.add(critere.nom)
      continue
    }
    for (const autre of criteresEntree) {
      if (autre.derive == null && new RegExp(`\\b${autre.nom}\\b`).test(critere.derive)) noms.add(autre.nom)
    }
  }
  return [...noms]
}

/**
 * Nombre total d'options d'une liste de familles (aplatit `familles[].groupes[]`, `FamilleVue` de
 * `lib/vueDecision.ts`) — SEULE fonction de ce compte (P11/S7, T-113) : partagée par le CTA flottant
 * mobile et l'en-tête de la colonne de résultats (T-112), pour que les deux ne puissent jamais diverger.
 */
function compterOptions(familles: readonly FamilleVue[]): number {
  return familles.reduce(
    (total, famille) => total + famille.groupes.reduce((sousTotal, groupe) => sousTotal + groupe.length, 0),
    0,
  )
}

/**
 * T-134 (P12/S9) — phrase de LOYAUTÉ : la reco a été rendue SANS les critères que le praticien a
 * déclarés indisponibles (« je ne l'aurai pas », recette du 02/08, N7 : l'albuminurie manque au dossier
 * de l'EHPAD et n'y sera jamais). RÉUTILISE LE REGISTRE du bloc de cadrage plutôt que d'inventer un ton
 * nouveau (D24, `content/decision/noeuds/diabete-type-2/prescription.yaml` § cadrage : « une option
 * "Recommandée" ne les a pas évalués, c'est au praticien de le faire ») — même assertion, appliquée ici à
 * un critère précis plutôt qu'à un pan entier hors périmètre du nœud.
 *
 * GÉNÉRIQUE (D8) : `labels` vient de `labelForCritere`, comme partout ailleurs dans cet écran — aucun nom
 * de critère connu d'avance. `undefined` si rien à dire (aucune déclaration), pour que l'appelant décide
 * de ne rien rendre plutôt que de tester une chaîne vide.
 */
function texteIndisponibles(labels: readonly string[]): string | undefined {
  if (labels.length === 0) return undefined
  const liste = labels.join(', ')
  return labels.length === 1
    ? `Recommandation rendue sans le critère ${liste} : vous avez indiqué ne pas l'avoir. Il n'a pas été évalué, c'est au praticien de le faire.`
    : `Recommandation rendue sans les critères ${liste} : vous avez indiqué ne pas les avoir. Ils n'ont pas été évalués, c'est au praticien de le faire.`
}

/**
 * T-157 (P13/S8, P5) — CRITÈRES DU CARTOUCHE « EN ATTENTE », CLIQUABLES QUAND ATTEIGNABLES. Le fait qui
 * justifie la tâche : 2 207 px mesurés entre « À renseigner pour trancher : Espérance de vie » et son
 * champ, aucun renvoi cliquable (`docs/decision/CONSTRUIRE-UN-MODULE.md` §4, « la réponse arrive hors de
 * portée du regard »). Un clic sur un nom appelle `onOuvrir(nom)` — l'écran pose alors `champCible` sur
 * `CriteriaForm`, qui ouvre la section et focalise le champ (cf. sa docstring, `CriteriaForm.tsx`).
 *
 * ⚠ UN CRITÈRE PEUT ÊTRE DANS UNE SECTION MASQUÉE (R11, `CONSTRUIRE-UN-MODULE.md` §4 : « critère décisif
 * dans une section masquée ») — S1 ferme le cas connu (T1, `intention = initier` ⇒ `traitements = ∅`),
 * mais rien ne garantit qu'il n'en reste aucun autre. « Si le champ ciblé n'est pas atteignable, le lien
 * ne doit pas exister » (Décision clé, S8.md) : `atteignables` (calculé par l'appelant avec EXACTEMENT la
 * même source que `CriteriaForm` utilise pour grouper ses champs, `champsVisibles` sur `criteriaDiffere`/
 * `criteresRenseignes`) décide, nom par nom, du rendu — bouton si atteignable, texte simple sinon. Un lien
 * mort serait pire que pas de lien du tout (Décision clé).
 *
 * GÉNÉRIQUE (D8) : aucun nom de critère connu d'avance, `labelForCritere` comme partout ailleurs dans cet
 * écran. Fonction pure, testable sans monter l'écran entier.
 */
function rendreCriteresCliquables(
  noms: readonly string[],
  atteignables: ReadonlySet<string>,
  onOuvrir: (nom: string) => void,
) {
  return noms.map((nom, index) => (
    <span key={nom}>
      {index > 0 ? ', ' : ''}
      {atteignables.has(nom) ? (
        <button
          type="button"
          className="decision-node__en-attente-lien"
          onClick={() => onOuvrir(nom)}
          aria-label={`Aller au champ « ${labelForCritere(nom)} »`}
        >
          {labelForCritere(nom)}
        </button>
      ) : (
        labelForCritere(nom)
      )}
    </span>
  ))
}

/** Ordre fixe de la légende (T-112) — celui de l'énumération `ActionOption` (`content/node.types.ts`),
 * jamais l'ordre de rencontre : la légende doit rester identique d'un patient à l'autre sur un même nœud. */
const ORDRE_ACTIONS: readonly ActionOption[] = ['ajouter', 'remplacer', 'arreter', 'reduire', 'maintenir']

/**
 * Libellé de chaque verbe pour la légende (T-112) — même dictionnaire français que `OptionCard.tsx`
 * `ACTION_LABEL`, DUPLIQUÉ ici plutôt qu'importé : `OptionCard.*` est hors périmètre de cette session
 * (S6, livrée) — on ne le modifie pas pour en exporter une constante partagée.
 */
const LEGENDE_ACTION_LABEL: Record<ActionOption, string> = {
  ajouter: 'Ajouter',
  remplacer: 'Remplacer',
  arreter: 'Arrêter',
  reduire: 'Réduire',
  maintenir: 'Maintenir',
}

/**
 * Verbes d'action RÉELLEMENT employés par au moins une option du nœud (T-112 étape 1), dans l'ordre fixe
 * ci-dessus. Parcourt `vue.familles` EN ENTIER (pas seulement `principales`, cf. `plafonnerPistes`) :
 * une carte repliée derrière « Autres pistes possibles » (K5, `lib/replierAffichage.ts`) reste dans le
 * DOM — un `<details>` natif, jamais retiré — donc sa couleur doit rester lisible dans la légende même
 * avant de le déplier. Tableau vide ⇒ le nœud n'emploie pas ce vocabulaire (les 4 nœuds DT2 sans verbe,
 * `content/node.types.ts` `ActionOption`) : la légende ne doit alors rien rendre (étape 2).
 */
function verbesActionPresents(familles: readonly FamilleVue[]): ActionOption[] {
  const presents = new Set<ActionOption>()
  for (const famille of familles) {
    for (const groupe of famille.groupes) {
      for (const optionVue of groupe) {
        if (optionVue.option.action) presents.add(optionVue.option.action)
      }
    }
  }
  return ORDRE_ACTIONS.filter((verbe) => presents.has(verbe))
}

/**
 * D50/T-179 (P14/S10) — socle de `criteria` après REPRISE (K6/D28) et PUBLICATION (D50) : factorisé pour
 * n'écrire cette logique qu'une fois, réutilisée par les DEUX initialisations `useState` qui en ont besoin
 * (`criteria`/`preremplis`, cf. plus bas — même duplication assumée qu'avant cette tâche pour `reprises`
 * seul, jamais unifiée non plus).
 *
 * ORDRE DE PRIORITÉ POUR UN MÊME NOM : une REPRISE (une vraie saisie du praticien, sur un autre nœud de
 * cette consultation) prime TOUJOURS sur une PUBLICATION (une suggestion du moteur, D50) — jamais
 * l'inverse. En pratique les deux ne ciblent pas le même critère (D50, « après unification, le critère
 * publié n'a plus de lecteur hors préremplissage » — un critère `partage` a par construction un lecteur
 * `condition`/`derive` ailleurs), mais la garde coûte une ligne et supprime toute ambiguïté si un contenu
 * futur les fait un jour coïncider.
 *
 * `renseignes` en retour SERT À DEUX CHOSES pour `appliquerPreremplissage` (`lib/formLayout.ts`) : ne plus
 * reconsidérer ces noms comme candidats à un pré-remplissage de contenu, ET les compter comme DÉTERMINÉS
 * pour évaluer le `quand` d'un pré-remplissage d'un AUTRE critère (D20) — une valeur reprise ou publiée
 * peut donc, comme avant cette tâche pour les seules reprises, en pré-remplir une autre EN CASCADE dès
 * l'ouverture du nœud (ex. la cible PUBLIÉE par « Déterminer la cible » suffit à proposer la position vs
 * objectif, sans qu'aucune des deux valeurs n'ait été tapée sur CET écran).
 */
function baseAvecReprisesEtPublications(
  criteresEntree: CritereEntree[],
  reprises: readonly ValeurReprise[],
  publications: readonly ValeurPubliee[],
): { base: Criteria; renseignes: Set<string>; nomsPublies: string[] } {
  const base = buildDefaultCriteria(criteresEntree)
  for (const { nom, valeur } of reprises) base[nom] = valeur
  const nomsRepris = new Set(reprises.map((r) => r.nom))
  const nomsPublies: string[] = []
  for (const { nom, valeur } of publications) {
    if (nomsRepris.has(nom)) continue // une reprise (saisie réelle) prime toujours sur une publication.
    base[nom] = valeur
    nomsPublies.push(nom)
  }
  return { base, renseignes: new Set([...nomsRepris, ...nomsPublies]), nomsPublies }
}

/**
 * D3 — nœud interrogeable (S4.md T-006) : formulaire de critères → options applicables (moteur S3)
 * → argumentaire dépliable. Recalcule `construireVueDecision` à chaque changement de critère (état
 * éphémère, `criteria`/`argOpen` en `useState` — aucune persistance, CLAUDE.md invariant 1). Tout ce
 * qui est affiché vient strictement du modèle de vue (`lib/vueDecision.ts` `construireVueDecision`,
 * T-006 "Décision clé") ; si le contenu et les critères sont incohérents (variable inconnue, etc.),
 * le moteur sous-jacent (`evaluateNode`) lève une `ConditionError` qui n'est volontairement pas
 * capturée ici — propager l'erreur plutôt que masquer un écart moteur/contenu (S4.md règle "Si
 * bloqué" ; `engine/conditions.ts`).
 *
 * VALEUR INDÉTERMINÉE EN VIGUEUR (DECISIONS.md D20, `docs/decision/validation/chantier-2026-07-26/
 * SPEC-valeur-indeterminee.md` §2) : cet écran est celui qui alimente enfin `renseignes` — le moteur
 * (`evaluateNode`/`construireVueDecision`) et le calcul de pertinence (`criteresPertinents`) l'acceptaient
 * déjà en paramètre optionnel, mais aucun appelant ne le fournissait avant ce lot (repli « tout est
 * renseigné », comportement historique). `touched` (déjà présent, T-009) EST cet ensemble `renseignes` :
 * un critère « touché » par le praticien EST un critère « renseigné » — cf. `handleCriteriaChange`/
 * `handleCriteriaEffacer` ci-dessous pour la distinction saisi/vidé/jamais-touché qui rend cette
 * équivalence vraie (sans elle, vider un champ `nombre` laissait `touched` gonflé d'un « 0 » jamais
 * répondu, cf. défauts de recette 12.2/13.3).
 */
export function DecisionNodeScreen({ nodeId, go }: DecisionNodeScreenProps) {
  const node = nodeId ? getNoeudById(nodeId) : undefined
  // Module d'appartenance (D22), s'il existe : pilote UNIQUEMENT le lien de retour. Aucune donnée du
  // module n'entre dans l'évaluation — garde-fou R1, le nœud reste évaluable seul.
  const moduleDuNoeud = node ? getModuleDuNoeud(node) : undefined

  // K6 (décision référent, 2026-07-27) — REPRISE DE SESSION. Les critères que le contenu déclare
  // `partage` et que le praticien a déjà saisis sur un AUTRE nœud sont pré-remplis ici. Calculé UNE FOIS
  // à l'initialisation de l'état (`useState(() => …)`), jamais à chaque rendu : une valeur reprise est un
  // point de départ, pas une source qui écraserait en continu ce que le praticien tape ensuite.
  //
  // Ce qui circule est une valeur SAISIE, jamais une conclusion du moteur — cf. `lib/sessionCriteres.ts`
  // pour le raisonnement complet vis-à-vis du garde-fou R1 et de l'invariant « aucune persistance ».
  const reprises = node ? valeursReprises(node.criteres_entree) : []
  // D50/T-179 (P14/S10) — REPRISE PAR PUBLICATION. Une valeur qu'un AUTRE nœud `ordered-first-match` a
  // PUBLIÉE cette session (`Option.publie`, calculée plus bas via `optionRetenueOFM`/l'effet de publication
  // de CE nœud, s'il en est un) : `lib/sessionCriteres.ts` `valeursPubliees`, symétrique de `valeursReprises`
  // mais pour une CONCLUSION du moteur plutôt qu'une saisie. Comme `reprises` ci-dessus : recalculée à
  // chaque rendu mais seulement CONSULTÉE dans des initialiseurs `useState` qui ne s'exécutent qu'au
  // montage — même discipline, même raison (une suggestion est un point de départ, jamais une source qui
  // écraserait en continu ce que le praticien tape ensuite).
  const publications = node ? valeursPubliees(node.criteres_entree) : []

  const [criteria, setCriteria] = useState<Criteria>(() => {
    if (!node) return {}
    const { base, renseignes } = baseAvecReprisesEtPublications(node.criteres_entree, reprises, publications)
    // Une valeur reprise OU publiée peut en pré-remplir une autre : la cible (publiée par « Déterminer la
    // cible ») et l'HbA1c (reprise) suffisent à proposer la position vs objectif dès l'ouverture du nœud.
    return appliquerPreremplissage(node.criteres_entree, base, renseignes).criteria
  })
  // Critères déjà modifiés par l'utilisateur (T-009) : distingue une valeur par défaut (0, non
  // fiable cliniquement) d'une valeur réellement saisie, pour ne pas afficher un résultat basé sur
  // un âge/ancienneté resté à 0 sans que le praticien s'en rende compte.
  //
  // UNE VALEUR REPRISE COMPTE COMME SAISIE, et c'est un arbitrage à assumer plutôt qu'un raccourci : le
  // praticien A RÉPONDU à cette question, dans cette consultation, sur un autre écran. La laisser hors de
  // `touched` afficherait une valeur tout en la traitant comme indéterminée — le moteur la marquerait
  // « à confirmer » alors qu'elle est affichée remplie, c'est-à-dire exactement le défaut A du lot 1 (un
  // champ qui paraît répondu sans l'être). L'écran la SIGNALE donc comme reprise (`repris`), au lieu de la
  // faire passer pour non répondue.
  //
  // UNE VALEUR PUBLIÉE, À L'INVERSE, N'ENTRE PAS DANS `touched` (D50 : « la sémantique de `preremplissage`
  // est reprise telle quelle ») — ce n'est pas une réponse du praticien SUR CETTE consultation, c'est une
  // SUGGESTION issue d'une conclusion du moteur sur un autre nœud. Elle rejoint `preremplis` ci-dessous,
  // exactement comme un pré-remplissage de contenu.
  const [touched, setTouched] = useState<Set<string>>(() => new Set(reprises.map((r) => r.nom)))
  // Noms des champs PRÉ-REMPLIS, pour que le formulaire dise d'où vient la valeur. Figé à l'initialisation
  // et jamais mis à jour : dès que le praticien modifie un de ces champs, la mention devient fausse — d'où
  // le retrait ci-dessous dans `handleCriteriaChange`.
  const [repris, setRepris] = useState<Set<string>>(() => new Set(reprises.map((r) => r.nom)))
  // Champs remplis par une règle de CONTENU (`preremplissage`, K6) OU par une PUBLICATION (D50) plutôt que
  // par le praticien. Distincts de `repris` (valeur venue d'un autre nœud, mais SAISIE par le praticien) :
  // une valeur publiée est une CONCLUSION du moteur, jamais une saisie — même mention affichée que le
  // pré-remplissage de contenu (« · calculé, à vérifier »), enrichie de son origine via
  // `originesPublication` ci-dessous (`CriteriaForm.tsx` `renderOrigine`).
  const [preremplis, setPreremplis] = useState<Set<string>>(() => {
    if (!node) return new Set()
    const { base, renseignes, nomsPublies } = baseAvecReprisesEtPublications(node.criteres_entree, reprises, publications)
    const { preremplis: parContenu } = appliquerPreremplissage(node.criteres_entree, base, renseignes)
    return new Set([...nomsPublies, ...parContenu])
  })
  // D50/T-179 — ORIGINE (nœud + option) des noms PUBLIÉS présents dans `preremplis` (étape 5, signalement) :
  // `preremplis` seul dit QUE le champ est pré-rempli, pas D'OÙ vient la valeur. Résolue en TEXTE ici (le
  // seul endroit qui importe `getNoeudById` dans ce mécanisme) : `lib/sessionCriteres.ts`/`CriteriaForm.tsx`
  // restent génériques, sans connaissance de titre de nœud. Figée à l'initialisation comme `preremplis` —
  // une origine qui changerait sous les yeux du praticien serait plus déroutante qu'utile, et de toute façon
  // seul un champ ENCORE dans `preremplis` la consulte (`CriteriaForm.tsx` `renderOrigine`), jamais un champ
  // devenu `touched` : la garder inchangée après coup est donc sans risque.
  const [originesPublication, setOriginesPublication] = useState<Map<string, { noeudTitre: string; optionIntitule: string }>>(
    () => {
      const carte = new Map<string, { noeudTitre: string; optionIntitule: string }>()
      for (const { nom, origine } of publications) {
        const noeudOrigine = getNoeudById(origine.noeudId)
        carte.set(nom, { noeudTitre: noeudOrigine?.titre ?? origine.noeudId, optionIntitule: origine.optionIntitule })
      }
      return carte
    },
  )
  // T-134 (P12/S9) — critères DÉCISIFS que le praticien a déclarés « je ne l'aurai pas » (recette du
  // 02/08, N7 : l'albuminurie manque au dossier de l'EHPAD et n'y sera jamais). ENSEMBLE PUREMENT
  // D'ÉCRAN, JAMAIS FUSIONNÉ à `touched`/`preremplis`/`criteresRenseignes` : il n'est transmis NULLE PART
  // comme `renseignes` (`construireVueDecision`/`criteresPertinents`/`contraintesViolees` ne le reçoivent
  // jamais) — le critère reste NON DÉTERMINÉ pour le moteur exactement comme avant (R7/D20). Il n'est lu
  // QUE par `decisifsAConfirmer` (pour cesser de RÉCLAMER le champ) et par le rendu de cet écran (mention
  // de loyauté sur la reco, filtrage du cartouche EN ATTENTE, plus bas) : DÉCLARER QU'ON NE SAIT PAS NE
  // PRODUIT JAMAIS UN SAVOIR, donc aucune option ne peut bouger par ce seul geste.
  const [indisponibles, setIndisponibles] = useState<Set<string>>(() => new Set())
  const [argOpen, setArgOpen] = useState(false)
  // R4 (`docs/decision/GRAMMAIRE-NOEUD.md`) : les options NON RETENUES (faute de condition) sont une
  // information d'EXPLICATION, consultée sur demande — fermée par défaut, jamais poussée à l'écran
  // (contrairement aux options ÉCARTÉES par une exclusion, information de SÉCURITÉ, toujours visibles).
  const [nonRetenuesOpen, setNonRetenuesOpen] = useState(false)
  // T-057 (P8 · S2, 2026-07-30) — FRONTIÈRE DE RE-ENTRÉE (D28). `frontiereReprise`/`afficherChoixReprise`
  // ci-dessous (calculés plus bas, une fois `criteresRenseignes` en main) décident SI le choix « Reprendre
  // / Repartir de zéro » doit remplacer le panneau de résultats. `frontiereLevee` mémorise qu'IL A DÉJÀ ÉTÉ
  // LEVÉ pour CE montage de nœud (clic sur « Reprendre les valeurs de ce patient ») : sans cet état
  // dédié, il n'existe aucune façon de distinguer un clic d'acquiescement (qui ne touche AUCUN champ) d'une
  // frontière encore active — la condition de frontière, elle, resterait vraie indéfiniment (`repris` ne
  // change pas suite à ce clic). Local à ce composant, jamais dans `sessionCriteres.ts` (« Si bloqué »
  // T-057 : aucun nouvel état global).
  const [frontiereLevee, setFrontiereLevee] = useState(false)

  // T-143 (P13/S3, 2026-08-05) — MÉMOIRE DE RESTAURATION : une bascule d'intention ou de situation ne
  // détruit plus les saisies masquées. `useRef`, PAS `useState` — sa mutation ne doit rien re-rendre
  // (elle est lue puis appliquée AU SEIN d'un même appel de handler, jamais après coup) ; à la portée du
  // composant, jamais un module : elle « meurt avec l'écran ». Le remontage par `key` (« Nouveau patient »,
  // D33) recrée le composant, donc un nouveau `useRef` vide — VÉRIFIÉ au navigateur (S3.md "Décision
  // clé" point 3 : « vérifie-le, ne le suppose pas »), pas seulement supposé.
  //
  // TROIS PROPRIÉTÉS NON NÉGOCIABLES (S3.md) :
  //  1. le moteur ne la voit JAMAIS — elle n'entre ni dans `criteria`, ni `touched`, ni `preremplis`, ni
  //     `criteresRenseignes` ; tant qu'un champ est masqué, il vaut son défaut pour `evaluateNode`,
  //     exactement comme avant cette session (R8 intact, cf. `reinitialiserChampsMasques`) ;
  //  2. elle est restaurée quand le champ redevient visible, AVEC sa marque `touched` d'origine — une
  //     valeur restaurée est une valeur RÉPONDUE, pas une valeur suggérée (à ne pas confondre avec
  //     `preremplis`, mention différente à l'écran : « · calculé, à vérifier » n'est jamais posée par la
  //     restauration) ;
  //  3. elle meurt avec l'écran (cf. `useRef` ci-dessus).
  //
  // Deux formes, cf. `reinitialiserChampsMasques` (`lib/formLayout.ts`) :
  //  - `champs` : un critère ENTIER masqué, avec la valeur SAISIE PAR LE PRATICIEN (`touched`, jamais
  //    `preremplis`) qu'il portait juste avant (`valeursEffacees`) ;
  //  - `valeursListe` : UNE valeur retirée d'une `liste` restée visible par ailleurs (A4/F,
  //    `valeursListeRetirees`) — restaurée par RÉ-AJOUT dans la liste courante, jamais en écrasant toute
  //    la liste (un praticien qui aurait entre-temps coché autre chose ne doit pas être écrasé).
  const memoireRestauration = useRef<{
    champs: Map<string, CriteriaValue>
    valeursListe: Map<string, Set<string>>
  }>({ champs: new Map(), valeursListe: new Map() })

  // Les critères dérivés (ex. cible_atteinte = HbA1c_actuelle <= HbA1c_cible ; over_basalisation =
  // dose_basale_actuelle / poids > 0,5) sont recalculés depuis les primitives saisies AVANT l'évaluation
  // du moteur — le DSL de `conditions.ts` ne compare qu'`variable OP littéral` (engine/deriveCritere.ts).
  //
  // La reco est calculée en PERMANENCE (P3 · S7-ui Lot 3, « sans gate dur »). L'ancien gate — exiger que
  // TOUS les nombres référencés soient saisis avant d'afficher quoi que ce soit — contredisait le moteur
  // de pertinence : un champ pouvait être à la fois estompé « sans effet sur la reco » ET bloquant
  // (constaté sur `age`, référencé par le dérivé `terrain_fragile` mais non décisif pour le patient en
  // cours). Les deux notions sont désormais dérivées de la MÊME source — `criteresPertinents` — ce qui
  // rend cette contradiction impossible par construction : estompé ⟺ non pertinent, réclamé ⟺ pertinent.
  //
  // Modèle de vue UNIQUE (`lib/vueDecision.ts`) : l'écran ne calcule plus rien lui-même (ni
  // `groupesParFamille`, ni `computeBadges`, ni les doses `calculs`) — tout vient de `construireVueDecision`,
  // la même fonction pure que sérialise `engine/relevance.ts` pour la signature de pertinence.
  // FUSION `touched` ∪ `preremplis` (T-023, D-06, P4/S3) — CE QUE L'ÉCRAN ET LE MOTEUR TRAITENT COMME
  // « RENSEIGNÉ » à partir d'ici, SANS changer `touched` lui-même.
  //
  // LE DÉFAUT (D-06) : une valeur calculée par `preremplissage` (K6) était bien écrite dans `criteria`
  // (`appliquerPreremplissage`, `handleCriteriaChange` ci-dessus) mais JAMAIS ajoutée à `touched` — donc
  // invisible au formulaire (`CriteriaForm` n'allume `aria-pressed`/`data-on` que sur `touched.has(nom)`)
  // ET invisible au moteur (`construireVueDecision`/`criteresPertinents`/... ne reçoivent que `touched`
  // comme `renseignes`). L'étiquette « · calculé, à vérifier » s'affichait donc seule, sans rien qui la
  // rende vraie : exactement l'hypothèse 1 de T-023 Étape 3, vérifiée avant de corriger.
  //
  // POURQUOI PAS SIMPLEMENT AJOUTER `preremplis` DANS `touched` : `appliquerPreremplissage`
  // (`lib/formLayout.ts`) ne reconsidère JAMAIS un critère déjà dans le `renseignes` qu'on lui passe
  // (`!renseignes.has(c.nom)`, cf. sa docstring K6 : « le pré-remplissage se REJOUE à chaque saisie, tant
  // que le champ visé n'a pas été répondu »). Fusionner les deux ensembles AVANT l'appel à
  // `appliquerPreremplissage` (dans `handleCriteriaChange`) figerait la valeur suggérée à la première
  // saisie qui la déclenche — un patient dont la cible bouge ensuite ne verrait plus jamais la position
  // rebasculer (`nettement_au_dessus` → `au_dessus`), ce que T-023 Étape 3/5 exige de vérifier. `touched`
  // brut continue donc SEUL de nourrir `appliquerPreremplissage`/`reinitialiserChampsMasques`
  // (`handleCriteriaChange`/`handleCriteriaEffacer`, inchangés) ; CETTE fusion, elle, nourrit tout ce qui
  // AFFICHE ou ÉVALUE une fois la valeur posée : le formulaire (`touched` passé à `CriteriaForm`
  // ci-dessous) et les quatre calculs de `renseignes` du moteur (`vue`, `pertinents`, `violations`,
  // `decisifsManquants`).
  const criteresRenseignes = useMemo(() => new Set([...touched, ...preremplis]), [touched, preremplis])

  // T-057 (P8 · S2, 2026-07-30) — FRONTIÈRE DE RE-ENTRÉE (D28). CE N'EST PAS UN BUG DE DÉMONTAGE : c'est
  // la conjonction de deux choses correctes prises séparément — (1) une valeur REPRISE compte comme
  // SAISIE (`touched`, arbitrage assumé au-dessus, ≈ l.111-117 : la laisser hors de `touched` afficherait
  // une valeur remplie tout en la traitant comme indéterminée) ; (2) certains nœuds déclarent `partage:
  // true` sur LA TOTALITÉ de leurs critères décisifs (ex. `cible-glycemique` : `age`,
  // `anciennete_diabete_annees`, `esperance_vie`, `fragilite`). La mémoire de session suffit alors, À
  // ELLE SEULE, à reconstituer toute la réponse — un nœud RÉ-OUVERT peut afficher une recommandation
  // BADGÉE ET FINIE, calculée pour le patient PRÉCÉDENT, avec « repris de votre saisie », SANS que rien
  // n'ait été saisi SUR CET écran. Reproduit en 3 clics dans la recette du 2026-07-30 (§« DÉFAUT MAJEUR
  // découvert entre N2 et N3 ») : sortir par « ← Domaine », ré-ouvrir le même nœud, lire le résultat de la
  // patiente précédente — « en consultation de 15 minutes, on lit le résultat, pas le formulaire ».
  //
  // LE CORRECTIF EST UNE FRONTIÈRE, PAS UN RETRAIT (D28 reste vivant, la reprise elle-même n'est pas
  // défaite — cf. le formulaire, inchangé). Condition de déclenchement ÉTROITE, à respecter À LA LETTRE
  // (S2.md T-057 "Étapes" 2, citée mot pour mot) : « `repris` non vide ET aucun élément de `touched` qui
  // ne soit dans `repris` » — autrement dit, `repris` ET `touched` calculés à partir de ce que l'écran a
  // DÉJÀ en main (aucun nouvel état global, `sessionCriteres.ts` non touché). Se lit : au moins UNE valeur
  // vient de la mémoire, et RIEN d'autre n'a été touché ici — ni un nouveau champ (`touched` grossirait
  // au-delà de `repris`), ni un champ reprise ÉDITÉ (il quitterait `repris` — cf. `handleCriteriaChange`,
  // « la mention "repris" cesse dès que le praticien touche au champ » — tout en restant dans `touched`,
  // cassant l'inclusion). DÈS QU'UN SEUL CHAMP EST SAISI SUR CE NŒUD, l'une des deux branches de la
  // condition devient fausse et le comportement actuel est RIGOUREUSEMENT INCHANGÉ — c'est ce qui
  // préserve le gain salué en N3/N4 (arriver sur un nœud avec 3 champs déjà remplis). Sur un nœud sans
  // AUCUNE reprise (premier patient, ou aucun critère `partage`), `repris` est vide et la frontière ne se
  // déclenche jamais.
  //
  // `frontiereLevee` (état dédié, ci-dessus) écarte la frontière pour le RESTE de ce montage une fois
  // « Reprendre les valeurs de ce patient » cliqué — sans lui, un clic d'acquiescement qui ne touche AUCUN
  // champ laisserait la condition vraie indéfiniment.
  const frontiereReprise = repris.size > 0 && [...touched].every((nom) => repris.has(nom))
  const afficherChoixReprise = frontiereReprise && !frontiereLevee

  const vue = useMemo(() => {
    if (!node) return undefined
    // `criteresRenseignes` (D20 + T-023/D-06) : calculé sur `criteria` IMMÉDIAT, la même source
    // temporelle — les deux avancent ensemble, jamais l'un en retard sur l'autre.
    return construireVueDecision(node, criteria, criteresRenseignes)
  }, [node, criteria, criteresRenseignes])

  /**
   * D50/T-179 (P14/S10) — option EFFECTIVEMENT RETENUE d'un nœud à SORTIE UNIQUE (D11), pour la
   * publication. `undefined` tant que le nœud n'est pas `ordered-first-match`, ou que le moteur ne s'est
   * pas prononcé pour de bon :
   *  - `vue.enAttente.length > 0` ⇒ le nœud est EN ATTENTE (R7/D20, une halte quelque part dans l'ordre du
   *    nœud, cf. `evaluateOrderedFirstMatch`) — « ne rien écrire si le nœud est en attente », étape 4 ;
   *  - `applicable`/`ecartees`/etc. ne comptant qu'UNE option APPLICABLE ⇒ c'est CETTE option-là qui est la
   *    sortie du nœud (`evaluateNode` en `ordered-first-match` ne renvoie jamais plus d'une option
   *    applicable, D11) — extraite depuis `vue.familles` (déjà aplatie par `construireVueDecision`) plutôt
   *    que rappeler le moteur une seconde fois : ni un second calcul, ni une seconde source de vérité.
   *
   * IDENTITÉ STABLE, ET C'EST CE QUI ÉVITE LA BOUCLE DE RENDU (cf. "Si bloqué", `plans/P14/S10.md`) :
   * `OptionVue.option` est la RÉFÉRENCE `Option` du contenu telle quelle (`construireVueDecision`/
   * `evaluateNode` ne la clonent jamais) — donc TANT QUE la sortie retenue ne change pas, cette valeur
   * mémoïsée reste `===` d'un rendu à l'autre malgré la frappe (chaque keystroke recrée `vue`, pas
   * l'`Option` qu'il contient). L'effet ci-dessous, qui dépend de CETTE valeur, ne redéclenche donc QUE
   * quand la sortie du nœud change réellement — jamais à chaque rendu.
   */
  const optionRetenueOFM = useMemo(() => {
    if (!node || node.selection !== 'ordered-first-match' || !vue) return undefined
    if (vue.enAttente.length > 0) return undefined
    const toutes = vue.familles.flatMap((famille) => famille.groupes.flat())
    return toutes.length === 1 ? toutes[0].option : undefined
  }, [node, vue])

  /**
   * D50/T-179 (P14/S10) — ÉCRITURE DE LA PUBLICATION, étape 4. Hors du corps du composant (donc jamais
   * dans la boucle de rendu, cf. docstring `optionRetenueOFM` ci-dessus) et hors d'`evaluateNode` (il
   * tourne des centaines de fois par frappe via `engine/relevance.ts`, cf. "Si bloqué" du plan) : un
   * `useEffect`, déclenché UNIQUEMENT quand `optionRetenueOFM` change de VALEUR (voir sa docstring pour
   * pourquoi son identité reste stable tant que la sortie ne change pas réellement).
   *
   * Mutation d'un état de MODULE (`lib/sessionCriteres.ts` `publications`), jamais d'un état React : ne
   * provoque donc AUCUN second rendu de ce composant ni d'aucun autre — pas de risque de boucle par ce
   * biais non plus.
   */
  useEffect(() => {
    if (!node || !optionRetenueOFM?.publie) return
    publierCritere(optionRetenueOFM.publie.critere, optionRetenueOFM.publie.valeur, {
      noeudId: node.id,
      optionIntitule: optionRetenueOFM.intitule,
    })
  }, [node, optionRetenueOFM])

  // TEMPORISATION (tâche 6c, recette référent) : `criteresPertinents` perturbe le moteur une fois par
  // critère saisissable (plusieurs évaluations d'`evaluateNode` chacune) — recalculer à CHAQUE frappe sur
  // un `nombre` (ex. HbA1c) fait bouger l'estompage de champs plus haut dans le formulaire pendant que le
  // praticien tape encore, ce qui est déstabilisant (bug remonté : « modifier l'IMC active/désactive des
  // critères plus haut »). `useDeferredValue` laisse React prioriser la frappe (valeur affichée immédiate,
  // cf. `criteria` passé tel quel à `CriteriaForm`) et ne recalculer la pertinence qu'une fois le rythme de
  // saisie retombé — sans code de temporisation maison, sans changer `relevance.ts` (qui reste synchrone
  // et testable, la temporisation ne vit QUE dans cet écran).
  const criteriaDiffere = useDeferredValue(criteria)

  // Critères PERTINENTS pour ce patient (moteur `engine/relevance.ts`, refonte UI P3) : pilote l'estompage
  // des champs sans effet (remarque 6) et la reco « provisoire » (remarque 7). Calculé sur `criteriaDiffere`
  // (temporisé) : coût borné mais non négligeable (plusieurs évaluations du moteur déterministe par frappe).
  const pertinents = useMemo(() => {
    if (!node || node.criteres_entree.length === 0 || node.options.length === 0) return undefined
    // `criteresRenseignes` (D20 + T-023/D-06) transmis NON DIFFÉRÉ, comme `decisifsManquants` ci-dessous :
    // seul `criteria` (via `criteriaDiffere`) est temporisé (cf. commentaire au-dessus), `criteresRenseignes`
    // ne l'est jamais — sans quoi un champ tout juste répondu resterait vu « indéterminé » un instant de trop.
    return criteresPertinents(node, criteriaDiffere, criteresRenseignes)
  }, [node, criteriaDiffere, criteresRenseignes])

  // CONTRAINTES DE SAISIE violées (K3, `engine/contraintes.ts`). Sur `criteria` IMMÉDIAT et non
  // `criteriaDiffere` : c'est un signalement d'erreur de frappe, il doit disparaître dès que le praticien
  // corrige — un message qui reste affiché une seconde après la correction se lit comme un refus.
  // `criteresRenseignes` fait office de `renseignes` : une contrainte dont un opérande n'est pas encore
  // saisi n'est jamais « violée » (cf. `contraintesViolees`), sans quoi elle s'allumerait sur un
  // formulaire vierge.
  const violations = useMemo(
    () => (node ? contraintesViolees(node, criteria, criteresRenseignes) : []),
    [node, criteria, criteresRenseignes],
  )

  // Décisifs encore non confirmés → tant qu'il en reste, la reco est « provisoire » (jamais bloquée).
  // Réclamé et estompé dérivent tous deux de `pertinents` (cf. `decisifsAConfirmer`) : un champ ne peut
  // plus être simultanément « sans effet » et exigé. Calculé sur la MÊME source différée que `pertinents`
  // (`criteriaDiffere`, pas `criteria`) : sinon la visibilité (immédiate) et la pertinence (temporisée)
  // pourraient transitoirement se contredire (ex. un champ tout juste démasqué mais pas encore réévalué).
  // T-134 : `indisponibles` transmis en 5ᵉ paramètre — PUREMENT SOUSTRACTIF (cf. sa docstring dans
  // `lib/formLayout.ts`), ne change RIEN à `criteresRenseignes`/`effectifs` calculés à l'intérieur.
  const decisifsManquants = useMemo(
    () => decisifsAConfirmer(node?.criteres_entree ?? [], criteriaDiffere, criteresRenseignes, pertinents, indisponibles),
    [node, criteriaDiffere, criteresRenseignes, pertinents, indisponibles],
  )

  // T-134 (P12/S9) — phrase de loyauté (cf. `texteIndisponibles` en tête de fichier) : `undefined` tant
  // qu'aucun critère n'est déclaré indisponible sur CE nœud (repli historique implicite, rien ne change
  // pour une session qui n'utilise pas ce geste).
  const mentionIndisponibles = useMemo(
    () => texteIndisponibles([...indisponibles].map(labelForCritere)),
    [indisponibles],
  )

  // T-134 — LA MÊME liste `vue.enAttente` (le moteur, jamais touché : les options qui y figurent restent
  // EXACTEMENT celles qu'`evaluateNode` a tranchées EN ATTENTE), mais chaque `manquants` amputé des
  // critères déclarés indisponibles — c'est CE QU'ON RÉCLAME au praticien qui change, jamais ce qui est
  // proposé/écarté/en attente. `vue.enAttente.length`/`.option` restent lus sur `vue` BRUT partout ailleurs
  // (titre du cartouche, compte du dépli) : seule la liste de critères NOMMÉS dans le corps du bloc passe
  // par cette version filtrée.
  const enAttenteAffichable = useMemo(
    () => (vue ? vue.enAttente.map((e) => ({ ...e, manquants: e.manquants.filter((nom) => !indisponibles.has(nom)) })) : []),
    [vue, indisponibles],
  )

  // T-157 (P13/S8, P5) — demande d'ouverture ciblée posée sur `CriteriaForm` (cf. sa docstring `champCible`
  // et `rendreCriteresCliquables` en tête de fichier). Un NOUVEL OBJET à chaque clic, MÊME sur le même nom
  // (`{ nom }` littéral, jamais réutilisé) : `CriteriaForm` clé son effet sur l'IDENTITÉ de cette prop pour
  // relancer l'ouverture+focus même si le practicien reclique deux fois de suite sur le même critère.
  const [champCible, setChampCible] = useState<{ nom: string } | null>(null)

  // Ensemble des critères ATTEIGNABLES (visibles à l'écran) — MÊME SOURCE que `CriteriaForm` utilise pour
  // grouper ses champs (`criteriaGroupement`/`touched` transmis plus bas : `criteriaDiffere`/
  // `criteresRenseignes`), pour que « cliquable ici » et « ouvrable là-bas » ne puissent jamais diverger.
  // Un nom absent de cet ensemble reste du TEXTE SIMPLE dans le cartouche (Décision clé : un lien mort est
  // pire que pas de lien) — cf. R11, `CONSTRUIRE-UN-MODULE.md` §4.
  const champsAtteignables = useMemo(
    () => (node ? champsVisibles(node.criteres_entree, criteriaDiffere, criteresRenseignes) : new Set<string>()),
    [node, criteriaDiffere, criteresRenseignes],
  )

  // P6/SB1 — DEUX COLONNES (formulaire à gauche, résultats sticky à droite sur écran large, empilés en
  // dessous de 1200px, cf. D47). `isNarrow` PILOTE UNIQUEMENT LA MISE EN PAGE (bouton flottant, cf. plus bas) —
  // aucune des règles D30/D31/D32/D25/T-024 ne lit cet état : elles restent décidées par `vue`/
  // `violations` seuls, inchangés par cette session. `matchMedia` plutôt qu'un listener `resize` brut
  // (repris de la maquette `design/maquettes/Maquette upgrade UI.zip`, script du nœud `prescription`) :
  // ne redéclenche un rendu qu'au franchissement du seuil, pas à chaque pixel redimensionné.
  // `typeof window.matchMedia === 'function'` (pas seulement `typeof window !== 'undefined'`) : jsdom
  // (tests d'interaction, `DecisionNodeScreen.interaction.test.tsx`) fournit un objet `window` mais
  // n'implémente pas `matchMedia` — sans cette garde, CHAQUE test qui monte l'écran plantait au premier
  // rendu (`TypeError: window.matchMedia is not a function`), bien avant la moindre assertion sur
  // D30/D31/D32/D25/T-024. Repli à `false` (écran large) : c'est le comportement historique, celui que
  // ces tests vérifiaient déjà avant cette session. Seuil `LARGEUR_ETROITE_MAX` (T-114) : la constante
  // exportée en tête de fichier, plutôt que `959` (aujourd'hui `1199`, D47) en dur ici comme avant cette
  // session.
  const supportsMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  const [isNarrow, setIsNarrow] = useState(() =>
    supportsMatchMedia ? window.matchMedia(`(max-width: ${LARGEUR_ETROITE_MAX}px)`).matches : false,
  )
  useEffect(() => {
    if (!supportsMatchMedia) return
    const mql = window.matchMedia(`(max-width: ${LARGEUR_ETROITE_MAX}px)`)
    const onChange = (event: MediaQueryListEvent) => setIsNarrow(event.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [supportsMatchMedia])
  // Cible du bouton flottant mobile (« Voir les recommandations (N) ↓ ») : le DÉBUT de la colonne
  // résultats, pas un élément particulier à l'intérieur — qu'elle contienne des cartes, le bloc de
  // suspension D31 ou le registre « en attente », le point d'arrivée est toujours le même.
  const resultatsColRef = useRef<HTMLDivElement>(null)
  const scrollVersResultats = () => {
    resultatsColRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  // PARTITION D'AFFICHAGE (K5, `lib/replierAffichage.ts`) calculée UNE SEULE FOIS ici (P11/S7, T-113) —
  // c'est la MÊME partition que lit ensuite le rendu des cartes (`principales`/`repliees`, plus bas) : un
  // second appel à `plafonnerPistes(vue)` à cet endroit diverge tôt ou tard du premier (défaut d'origine
  // de cette tâche, cf. `plans/P11/S7.md` T-113 "Décision clé"). Repli sur une partition vide tant que
  // `vue` n'existe pas encore (nœud en cours de calcul) — identique au comportement de `plafonnerPistes`
  // quand rien ne dépasse le plafond.
  const partitionAffichage = useMemo<PartitionAffichage>(
    () => (vue ? plafonnerPistes(vue) : { principales: [], repliees: [], nbRepliees: 0 }),
    [vue],
  )
  // N du bouton flottant ET de l'en-tête de la colonne de résultats (T-112, même variable) : nombre
  // d'options EFFECTIVEMENT VISIBLES SANS GESTE SUPPLÉMENTAIRE, c'est-à-dire `partitionAffichage.principales`
  // aplati — PAS `vue.familles` en entier comme avant cette session (défaut corrigé par T-113 : le compte
  // incluait les cartes que le plafond K5 replie derrière « Autres pistes possibles », un nombre que le
  // praticien ne retrouvait pas à l'écran). Zéro dès qu'une contrainte suspend le panneau (D31) : dans cet
  // état, `vue.familles` n'est de toute façon jamais consulté par le rendu (Étape 2 ci-dessous). T-057 :
  // ZÉRO aussi pendant la frontière de re-entrée — même principe, aucune carte n'est réellement rendue.
  const optionsRenduesCount = useMemo(() => {
    if (violations.length > 0 || afficherChoixReprise || !vue) return 0
    return compterOptions(partitionAffichage.principales)
  }, [violations, afficherChoixReprise, vue, partitionAffichage])

  if (!node) {
    return (
      <div className="decision-node decision-node--missing">
        <p>Nœud introuvable.</p>
        <button type="button" className="decision-node__back" onClick={() => go('decisionDomains')}>
          ← Retour aux algorithmes
        </button>
      </div>
    )
  }

  /**
   * T-143 (P13/S3) — applique la mémoire de restauration (`memoireRestauration`, déclarée plus haut) à
   * un couple `(criteria, touched)` PAS ENCORE COMMIS À L'ÉTAT REACT : tout champ mémorisé qui est
   * REDEVENU VISIBLE récupère sa valeur et sa marque `touched`, puis SORT de la mémoire (jamais restauré
   * deux fois — le praticien a pu changer d'avis entre-temps, cf. S3.md Étape 3).
   *
   * NE MUTE JAMAIS `criteria`/`touched` EN PLACE : `nettoye`/`avecPrerempli` peuvent être LA MÊME
   * RÉFÉRENCE que l'état React précédent quand rien d'autre n'a changé (`reinitialiserChampsMasques`/
   * `appliquerPreremplissage` renvoient le même objet si rien ne bouge) — les muter directement romprait
   * l'immutabilité React et ferait manquer le `setState` qui suit (`Object.is` verrait la même
   * référence). Copie donc PARESSEUSEMENT (seulement si quelque chose est effectivement restauré) et
   * renvoie la paire, inchangée par référence si rien n'est restauré.
   *
   * `champsVisibles` (pas une nouvelle notion : la même fonction que celle qui décide déjà ce qui se
   * rend à l'écran, `lib/formLayout.ts`) — un champ n'est restauré QUE s'il est visible avec CE couple
   * `(criteria, touched)`, jamais en avance ni en silence.
   *
   * ITÈRE JUSQU'À STABILITÉ, comme `reinitialiserChampsMasques` : restaurer un champ peut en rendre un
   * AUTRE visible dans la MÊME passe (ex. `traitements_en_cours` restauré à `['metformine']` rend
   * aussitôt restaurable `dose_metformine`, dont le `visible_si` dépend de CETTE valeur — les deux
   * doivent réapparaître ENSEMBLE, pas au prochain geste du praticien). Recalculer `champsVisibles`
   * UNE SEULE FOIS, avant la boucle, aurait manqué cette cascade.
   *
   * `nomsRestaures` (T-142/T-143) : les noms restaurés PAR LE CAS 1 (champ entier), pour que l'appelant
   * les retire aussi de `preremplis` — UNE VALEUR RESTAURÉE N'EST JAMAIS UNE VALEUR PRÉ-REMPLIE
   * (propriété 2 de la mémoire, cf. la docstring de `memoireRestauration`). Sans ce retrait, un champ
   * masqué PENDANT qu'un `preremplissage` de contenu le vise (K6) peut ressortir marqué « · calculé, à
   * vérifier » alors qu'il vient d'être restauré avec une réponse RÉELLE du praticien — constaté au test
   * d'écran sur `traitements_en_cours` (nœud `prescription`, aller-retour Optimiser→Initier→Intensifier) :
   * masqué à l'initiation, K6 le pré-remplit à `[]` PENDANT le masquage (T-137/T-138, S1) ; démasqué à
   * l'intensification, `appliquerPreremplissage` ne le retouche plus (son `quand` ne matche plus) mais
   * `preremplis` (registre d'écran, jamais purgé par un masquage — CONTRAT T-138, `formLayout.test.ts`)
   * garde le nom. La restauration doit trancher en faveur de la réponse RÉELLE, pas du pré-remplissage
   * périmé. NE TOUCHE PAS au CAS 2 (valeurs de liste) : une `liste` avec `valeurs_visible_si` ne passe
   * jamais par `preremplis` dans ce mécanisme.
   */
  const restaurerDepuisMemoire = (
    criteriaAvant: Criteria,
    touchedAvant: Set<string>,
  ): { criteria: Criteria; touched: Set<string>; nomsRestaures: string[] } => {
    const memoire = memoireRestauration.current
    if (memoire.champs.size === 0 && memoire.valeursListe.size === 0) {
      return { criteria: criteriaAvant, touched: touchedAvant, nomsRestaures: [] }
    }
    let criteriaSuivant = criteriaAvant
    let touchedSuivant = touchedAvant
    let rienRestaure = true
    const nomsRestaures: string[] = []

    // Borne de sécurité, même esprit que `reinitialiserChampsMasques` : au pire un champ restauré par
    // tour, jamais de boucle infinie.
    for (let tour = 0; tour <= node.criteres_entree.length; tour += 1) {
      const visibles = champsVisibles(node.criteres_entree, criteriaSuivant, touchedSuivant)
      let changeCeTour = false
      const assurerCopie = () => {
        if (changeCeTour) return
        criteriaSuivant = { ...criteriaSuivant }
        touchedSuivant = new Set(touchedSuivant)
      }

      // Cas 1 — champ ENTIER masqué puis redevenu visible.
      for (const [nomMemo, valeur] of memoire.champs) {
        if (!visibles.has(nomMemo)) continue
        assurerCopie()
        criteriaSuivant[nomMemo] = valeur
        touchedSuivant.add(nomMemo)
        memoire.champs.delete(nomMemo)
        nomsRestaures.push(nomMemo)
        changeCeTour = true
        rienRestaure = false
      }

      // Cas 2 — A4/F : UNE valeur d'une `liste` restée visible redevient proposable. Ré-ajoutée à la
      // liste COURANTE (jamais en écrasant tout le champ) ; les valeurs encore indisponibles restent en
      // mémoire pour un tour (ou un appel) ultérieur.
      for (const [nomMemo, valeurs] of memoire.valeursListe) {
        if (!visibles.has(nomMemo)) continue
        const critere = node.criteres_entree.find((c) => c.nom === nomMemo)
        if (!critere) continue
        const proposees = new Set(
          valeursProposeesDepuisSaisie(node.criteres_entree, critere, criteriaSuivant, touchedSuivant),
        )
        const actuel = new Set((criteriaSuivant[nomMemo] as string[] | undefined) ?? [])
        let listeChangee = false
        for (const valeur of [...valeurs]) {
          if (!proposees.has(valeur)) continue
          if (!actuel.has(valeur)) {
            actuel.add(valeur)
            listeChangee = true
          }
          valeurs.delete(valeur)
        }
        if (listeChangee) {
          assurerCopie()
          criteriaSuivant[nomMemo] = [...actuel]
          changeCeTour = true
          rienRestaure = false
        }
        if (valeurs.size === 0) memoire.valeursListe.delete(nomMemo)
      }

      if (!changeCeTour) break
    }

    return rienRestaure
      ? { criteria: criteriaAvant, touched: touchedAvant, nomsRestaures: [] }
      : { criteria: criteriaSuivant, touched: touchedSuivant, nomsRestaures }
  }

  /**
   * T-143 — mémorise, pour un lot de champs/valeurs effacés par `reinitialiserChampsMasques` (issus de
   * CE changement), UNIQUEMENT ceux SAISIS PAR LE PRATICIEN (`touchedAvant`, le `touched` D'AVANT ce
   * changement — jamais `preremplis` : « Le sens de la restauration compte », S3.md). Un champ jamais
   * `touched` (donc à son défaut) n'a rien à mémoriser.
   */
  const memoriserEffacements = (
    touchedAvant: ReadonlySet<string>,
    valeursEffacees: Array<{ nom: string; valeur: CriteriaValue }>,
    valeursListeRetirees: Array<{ nom: string; valeur: string }>,
  ): void => {
    const memoire = memoireRestauration.current
    for (const { nom: nomEfface, valeur } of valeursEffacees) {
      if (touchedAvant.has(nomEfface)) memoire.champs.set(nomEfface, valeur)
    }
    for (const { nom: nomListe, valeur } of valeursListeRetirees) {
      if (!touchedAvant.has(nomListe)) continue
      const ensemble = memoire.valeursListe.get(nomListe) ?? new Set<string>()
      ensemble.add(valeur)
      memoire.valeursListe.set(nomListe, ensemble)
    }
  }

  // Calculé en synchrone (pas via les updaters de `setState`) : la mise à jour de `touched` dépend du
  // résultat de celle de `criteria`, et faire transiter cette information par une variable mutée entre
  // deux updaters dépendrait de leur ordre d'exécution et casserait en StrictMode (double invocation).
  const handleCriteriaChange = (nom: string, value: CriteriaValue) => {
    const next = { ...criteria, [nom]: value }
    // Suggestion auto d'`esperance_vie` (non sourcée, cf. lib/esperanceVieDefault.ts) : ne
    // s'applique que tant que le praticien n'a pas choisi cette valeur lui-même, et se recalcule
    // seulement quand un critère dont elle dépend change (pas à chaque frappe non liée).
    //
    // T-061 (P8 · S2, 2026-07-30) — LE DÉFAUT CORRIGÉ ICI : la valeur suggérée était bien écrite dans
    // `next.esperance_vie` ci-dessous, mais jamais ajoutée ni à `touched` ni à `preremplis` — donc
    // invisible au formulaire (`CriteriaForm` n'allume `aria-pressed`/`data-on` que sur
    // `criteresRenseignes.has(nom)`, cf. plus bas) ET ignorée du moteur (`criteresRenseignes` ne la
    // contenait pas non plus). Mesuré en recette sur trois patients, dont le cas d'école que la ligne
    // nomme elle-même (88 ans, fragilité ET comorbidité grave cochées) : « elle n'a jamais rien
    // proposé ».
    //
    // LE CORRECTIF N'AJOUTE PAS `esperance_vie` À `touched` : ce serait faire passer une valeur
    // CALCULÉE pour une réponse du PRATICIEN, exactement ce que D20 interdit (« une valeur par défaut
    // n'est pas une réponse ») — le coût déjà payé pour cette confusion est documenté dans
    // `CriteriaForm.tsx` autour d'`aria-pressed`/`estAConfirmer`. Le véhicule correct est celui déjà
    // éprouvé par le CONTENU pour `preremplissage` (K6, `lib/formLayout.ts` `appliquerPreremplissage`) :
    // afficher la valeur, dire d'où elle vient (`preremplis` → « · calculé, à vérifier »,
    // `CriteriaForm.tsx` `renderOrigine`), la compter comme renseignée (`criteresRenseignes` = `touched`
    // ∪ `preremplis`, cf. plus bas) et la laisser modifiable — MÊME statut, MÊME mention, MÊMES règles de
    // retrait qu'un pré-remplissage de contenu (ex. la position vs objectif). `nomsAPreremplirEsp` est
    // fusionné avec `nouveaux` (pré-remplissage de CONTENU) plus bas : une seule écriture de
    // `preremplis` par appel, pas deux mentions distinctes pour une même case.
    //
    // La mention affichée en dessous du champ (`hints`, plus bas dans le JSX) reste « à valider » —
    // inchangée par ce correctif : c'est une aide au remplissage non sourcée (docstring
    // `esperanceVieDefault.ts` : « pas un fait clinique », CLAUDE.md invariant 6), jamais une
    // affirmation.
    const espChoisieAMain = touched.has('esperance_vie') || nom === 'esperance_vie'
    const nomsAPreremplirEsp: string[] = []
    const suggestionEsp = suggestionEsperanceVieSiApplicable(node.criteres_entree, next, espChoisieAMain, [nom])
    if (suggestionEsp !== undefined) {
      next.esperance_vie = suggestionEsp
      nomsAPreremplirEsp.push('esperance_vie')
    }

    // `renseignes` APRÈS ce changement (D20) : `nom` vient d'être répondu — calculé AVANT
    // `reinitialiserChampsMasques` pour que la visibilité en cascade voie déjà ce champ comme déterminé
    // (repli « visible » de `champEstVisible` sur un `visible_si` autrement indéterminé, sinon
    // inutilement pessimiste pour le champ qu'on vient tout juste de saisir).
    const renseignesApres = new Set(touched).add(nom)

    // Un champ que ce changement vient de MASQUER (`visible_si`) est remis à sa valeur par défaut : une
    // valeur invisible ne doit jamais continuer à piloter la reco (cf. `formLayout.ts`). Il redevient
    // aussi « non renseigné », sinon il passerait pour confirmé s'il réapparaissait plus tard.
    const {
      criteria: nettoye,
      reinitialises,
      valeursEffacees,
      valeursListeRetirees,
    } = reinitialiserChampsMasques(node.criteres_entree, next, renseignesApres)
    const touchedApres = new Set(touched).add(nom)
    for (const efface of reinitialises) touchedApres.delete(efface)

    // T-143 — mémorise (AVANT tout autre calcul, sur `touched` D'AVANT ce changement, cf. sa docstring)
    // ce que le masquage ci-dessus vient d'effacer, pour une restauration future si le champ redevient
    // visible. N'entre dans AUCUN état React : le moteur ne voit jamais cette mémoire (S3.md).
    memoriserEffacements(touched, valeursEffacees, valeursListeRetirees)

    // K6 — le pré-remplissage se REJOUE à chaque saisie, tant que le champ visé n'a pas été répondu :
    // saisir l'HbA1c après avoir saisi la cible doit proposer la position, pas attendre un remontage.
    // `appliquerPreremplissage` ne touche jamais un champ déjà renseigné : la position DÉCLARÉE fait foi
    // dès que le praticien l'a donnée.
    //
    // 4ᵉ argument (`renseignesEffectifs`) : `touchedApres` SEUL ne contient jamais un critère PUBLIÉ (D50,
    // ex. `HbA1c_cible` reçu de « Déterminer la cible ») — une valeur publiée n'entre jamais dans `touched`
    // (ce n'est pas une saisie du praticien SUR CET écran). Sans cet argument, `position_vs_cible` restait
    // indéfiniment `INDETERMINE` dès que sa condition référence `HbA1c_cible` : la cible s'affichait bien
    // pré-remplie, mais la position ne se proposait jamais tant que le praticien n'avait pas retapé la
    // cible à la main. `touched ∪ preremplis` (= `criteresRenseignes`, capturé ici via l'état `preremplis`
    // D'AVANT ce changement) : SEUL ce 2ᵉ ensemble sert à déterminer les VARIABLES RÉFÉRENCÉES, jamais à
    // exclure un candidat (cf. docstring `appliquerPreremplissage`, `lib/formLayout.ts`) — un champ déjà
    // dans `preremplis` (ex. `position_vs_cible` suggéré par un tour précédent) reste donc RECONSIDÉRABLE.
    const { criteria: avecPrerempli, preremplis: nouveaux } = appliquerPreremplissage(
      node.criteres_entree,
      nettoye,
      touchedApres,
      new Set([...touchedApres, ...preremplis]),
    )
    // T-143 — restaure ce qui redevient visible à l'instant (mémorisé ci-dessus ou lors d'un appel
    // précédent) : dernière étape avant de commettre l'état, pour que la restauration voie la visibilité
    // À JOUR (après masquage ET pré-remplissage de CE changement).
    const {
      criteria: avecRestauration,
      touched: touchedAvecRestauration,
      nomsRestaures,
    } = restaurerDepuisMemoire(avecPrerempli, touchedApres)
    setCriteria(avecRestauration)
    setTouched(touchedAvecRestauration)
    // T-061 : fusion des DEUX sources de pré-remplissage — celui du CONTENU (`nouveaux`, ci-dessus) et
    // la suggestion d'ÉCRAN (`nomsAPreremplirEsp`, calculée en tête de fonction) — dans un seul appel :
    // `preremplis` ne distingue pas leur origine, seule la mention affichée le fait déjà (identique pour
    // les deux, « · calculé, à vérifier »).
    const aPreremplir = [...nouveaux, ...nomsAPreremplirEsp]
    if (aPreremplir.length > 0) {
      setPreremplis((previous) => new Set([...previous, ...aPreremplir]))
    }
    // T-142/T-143 — un champ RESTAURÉ n'est jamais « pré-rempli » (propriété 2 de la mémoire de
    // restauration, cf. `restaurerDepuisMemoire`) : sans ce retrait, un champ masqué PENDANT qu'une règle
    // `preremplissage` (K6) le vise ressort marqué « · calculé, à vérifier » après restauration alors
    // qu'il porte une réponse RÉELLE du praticien — défaut relevé par S1 sur `traitements_en_cours`
    // (nœud `prescription`), confirmé ici au test d'écran.
    if (nomsRestaures.length > 0) {
      setPreremplis((previous) => {
        if (!nomsRestaures.some((n) => previous.has(n))) return previous
        const suivant = new Set(previous)
        for (const n of nomsRestaures) suivant.delete(n)
        return suivant
      })
    }
    // Le champ que le praticien vient de saisir cesse d'être « pré-rempli ».
    if (preremplis.has(nom)) {
      setPreremplis((previous) => {
        const suivant = new Set(previous)
        suivant.delete(nom)
        return suivant
      })
    }
    // K6 : la mention « repris » cesse dès que le praticien touche au champ — elle deviendrait fausse.
    // T-159 — `reprisApres` calculé EN SYNCHRONE (comme `touchedApres`/`touchedAvecRestauration` plus
    // haut, cf. leur commentaire de tête sur `setState` vs variable mutée) : c'est CET ensemble, pas
    // `repris` (l'état d'AVANT ce changement, encore valable dans cette fermeture), qui doit nourrir
    // `memoriserCriteres` ci-dessous pour que l'ORIGINE mémorisée reflète l'état APRÈS ce clic — sinon un
    // champ tout juste édité (donc sorti de `repris`) serait mémorisé UNE DERNIÈRE FOIS comme `repris`.
    const reprisApres = repris.has(nom) ? new Set([...repris].filter((n) => n !== nom)) : repris
    if (repris.has(nom)) {
      setRepris(reprisApres)
    }
    // T-134 : une déclaration « je ne l'aurai pas » cesse d'avoir un objet dès qu'une VRAIE valeur est
    // saisie sur ce même champ — sans ce retrait, la mention « · indisponible » resterait affichée à côté
    // d'une réponse désormais réelle (contradiction visuelle, jamais rencontrée jusqu'ici).
    if (indisponibles.has(nom)) {
      setIndisponibles((previous) => {
        const suivant = new Set(previous)
        suivant.delete(nom)
        return suivant
      })
    }
    // K6 : mémoriser APRÈS coup, sur l'état déjà nettoyé — un champ que ce changement vient de masquer
    // ne doit pas partir en session avec la valeur qu'il avait juste avant d'être remis à zéro.
    // T-143 : `avecRestauration`/`touchedAvecRestauration` (pas `avecPrerempli`/`touchedApres`) — une
    // valeur RESTAURÉE est une valeur répondue (propriété 2, cf. docstring de `memoireRestauration`),
    // aussi digne de circuler vers un autre nœud `partage` qu'une saisie directe.
    // T-159 — `reprisApres` en 4ᵉ argument : origine `repris` pour tout critère ENCORE marqué repris à cet
    // instant, `saisi` pour tout le reste (cf. `memoriserCriteres`, `sessionCriteres.ts`).
    memoriserCriteres(node.criteres_entree, avecRestauration, touchedAvecRestauration, reprisApres)
  }

  /**
   * Champ `nombre` VIDÉ par le praticien (D20 R7, `CriteriaForm.tsx` `onEffacer` — défauts de recette
   * 12.2/13.3) : DISTINCT de `handleCriteriaChange` — sinon `Number('') = 0` ET `touched` marqué font
   * enregistrer un « 0 » comme une réponse confirmée (« 0 facteur de risque »), alors que le champ vient
   * précisément d'être vidé. `nom` RESSORT de `touched` (donc de `renseignes` transmis au moteur, cf.
   * `vue`/`pertinents` ci-dessus) : il redevient « jamais renseigné », jamais « réponse zéro ». La valeur
   * stockée retombe sur son défaut générique (`valeurParDefaut`, `lib/formLayout.ts`, même définition que
   * l'initialisation du formulaire et que la remise à zéro d'un champ masqué) — cohérence, même si sans
   * effet sur l'évaluation moteur tant que `nom` n'est plus dans `renseignes`.
   */
  const handleCriteriaEffacer = (nom: string) => {
    const critere = node.criteres_entree.find((c) => c.nom === nom)
    const next = critere ? { ...criteria, [nom]: valeurParDefaut(critere) } : criteria

    const renseignesApres = new Set(touched)
    renseignesApres.delete(nom)

    const {
      criteria: nettoye,
      reinitialises,
      valeursEffacees,
      valeursListeRetirees,
    } = reinitialiserChampsMasques(node.criteres_entree, next, renseignesApres)

    // T-143 — même mémorisation que `handleCriteriaChange` (sur `touched` D'AVANT ce changement) : le
    // champ qu'on efface ICI (`nom`) n'entre jamais dans cette mémoire — effacer est un geste EXPLICITE
    // de « non-réponse », pas un masquage, il ne doit rien laisser à restaurer plus tard pour CE champ.
    // Seuls les AUTRES champs, masqués en CASCADE par cet effacement, peuvent l'être.
    memoriserEffacements(touched, valeursEffacees, valeursListeRetirees)

    const touchedApres = new Set(touched)
    touchedApres.delete(nom)
    for (const efface of reinitialises) touchedApres.delete(efface)

    const {
      criteria: avecRestauration,
      touched: touchedAvecRestauration,
      nomsRestaures,
    } = restaurerDepuisMemoire(nettoye, touchedApres)
    setCriteria(avecRestauration)
    setTouched(touchedAvecRestauration)
    // T-142/T-143 — même retrait que `handleCriteriaChange` : un champ RESTAURÉ n'est jamais « pré-rempli ».
    if (nomsRestaures.length > 0) {
      setPreremplis((previous) => {
        if (!nomsRestaures.some((n) => previous.has(n))) return previous
        const suivant = new Set(previous)
        for (const n of nomsRestaures) suivant.delete(n)
        return suivant
      })
    }
  }

  // « Rien à signaler » (tâche 4) : confirme d'un coup les drapeaux (`bool`) décisifs non renseignés
  // d'une section SANS changer leur valeur — ils restent à `false`, qui EST la réponse clinique (« non »).
  // Sans ce raccourci, ces critères resteraient éternellement « non confirmés » dans le compteur de la
  // reco provisoire dès lors que le praticien n'a — légitimement — rien à cocher.
  const handleConfirmerChamps = (noms: string[]) => {
    setTouched((previous) => {
      const suivant = new Set(previous)
      for (const nom of noms) suivant.add(nom)
      return suivant
    })
    // T-134 : même retrait que `handleCriteriaChange` — un drapeau confirmé « Rien à signaler » cesse
    // d'être « déclaré indisponible » s'il l'était (cas rare : le praticien avait cliqué « Indisponible »
    // sur ce champ AVANT de solder toute la section d'un coup).
    if (noms.some((nom) => indisponibles.has(nom))) {
      setIndisponibles((previous) => {
        const suivant = new Set(previous)
        for (const nom of noms) suivant.delete(nom)
        return suivant
      })
    }

    // T-061 (Étape 5) — « Rien à signaler » ne passe PAS par `handleCriteriaChange` : sans ce relais, la
    // suggestion d'`esperance_vie` restait muette quand `fragilite`/`comorbidite_grave`/`antecedent_cv`
    // étaient soldés par ce bouton plutôt que cliqués un par un — pourtant LE geste réel du praticien
    // mesuré en recette (N2, N7). Même garde-fou qu'à la saisie directe (`espChoisieAMain` ci-dessus,
    // `suggestionEsperanceVieSiApplicable` factorise les deux) : ne recalcule rien si le praticien a déjà
    // choisi lui-même `esperance_vie`. Les drapeaux confirmés restent à leur valeur INCHANGÉE (`false`, la
    // présomption de contenu) — seul `touched` bouge — donc la suggestion se relit sur `criteria` tel
    // quel, sans fusion supplémentaire.
    const suggestion = suggestionEsperanceVieSiApplicable(node.criteres_entree, criteria, touched.has('esperance_vie'), noms)
    if (suggestion !== undefined) {
      if (criteria.esperance_vie !== suggestion) {
        setCriteria((previous) => ({ ...previous, esperance_vie: suggestion }))
      }
      setPreremplis((previous) => new Set(previous).add('esperance_vie'))
    }
  }

  /**
   * T-134 (P12/S9) — le praticien déclare qu'un critère DÉCISIF restera inconnu (« je ne l'aurai pas »,
   * recette du 02/08, N7). TOGGLE (un second clic annule) : `CriteriaForm.tsx` `renderIndisponible`
   * rappelle CE MÊME handler que le champ porte déjà la mention ou non.
   *
   * NE TOUCHE JAMAIS `criteria`/`touched`/`criteresRenseignes` : `indisponibles` est un ensemble
   * SÉPARÉ, jamais fusionné à `renseignes` nulle part dans ce fichier (cf. sa docstring de déclaration,
   * ci-dessus) — le critère reste NON DÉTERMINÉ pour `construireVueDecision`/`criteresPertinents`
   * exactement comme avant ce clic (R7/D20). Seul `decisifsAConfirmer` (banni­ère « Reco provisoire ») et
   * le rendu du cartouche EN ATTENTE, plus bas, en tiennent compte — jamais le moteur : AUCUNE option ne
   * peut donc changer par ce geste, seul ce qu'on RÉCLAME encore change.
   */
  const handleDeclarerIndisponible = (nom: string) => {
    setIndisponibles((previous) => {
      const suivant = new Set(previous)
      if (suivant.has(nom)) suivant.delete(nom)
      else suivant.add(nom)
      return suivant
    })
  }

  /**
   * « Reprendre les valeurs de ce patient » lève la frontière de re-entrée (D28) — ET NE RECALCULE PLUS
   * `esperance_vie`, VOLONTAIREMENT, depuis P12/S1 (2026-08-02).
   *
   * ⚠ CE COMMENTAIRE REMPLACE UNE VERSION ANTÉRIEURE OÙ CE CLIC RELANÇAIT LA SUGGESTION (T-057 x T-061,
   * P8 · S2, 2026-07-30) — cf. `esperanceVieDefault.ts`, docstring de `suggestionEsperanceVieSiApplicable`,
   * pour l'historique complet des DEUX défauts successifs sur ce mécanisme. En résumé : recalculer à
   * partir des drivers REPRIS peut faire changer SILENCIEUSEMENT une suggestion déjà affichée, dès qu'un
   * driver ne porte pas `partage: true` (le cas réel d'`antecedent_cv`/`comorbidite_grave` sur
   * `cible-glycemique` — ils reviennent alors à leur défaut `false` après une ré-entrée, sans qu'aucune
   * réponse n'ait changé). Une garde de complétude sur les drivers a été essayée puis retirée : elle ne
   * pouvait jamais être satisfaite sur CE nœud (`presomption_non: true` sur ces deux critères — un `bool`
   * présumé est déterminé sans jamais être `touched`) et cassait AUSSI `handleCriteriaChange`/
   * `handleConfirmerChamps`, qui n'amputent pourtant aucun dossier.
   *
   * LE REMÈDE : ne plus recalculer sur ce chemin, point. `esperance_vie` reste « à confirmer » après une
   * reprise — le champ vide, le praticien répond directement sur CE nœud (`handleCriteriaChange`/
   * `handleConfirmerChamps`, jamais touchés par ce retrait) — plutôt qu'une valeur qui pourrait avoir
   * changé sans un mot. Compromis assumé : un patient dont TOUS les drivers étaient repris ne voit plus
   * la suggestion pré-remplie automatiquement à la ré-ouverture (perte réelle par rapport à T-057 x
   * T-061) ; la sûreté (jamais de valeur qui change en silence) l'emporte sur ce confort.
   */
  const handleReprendreValeurs = () => {
    setFrontiereLevee(true)
  }

  /**
   * T-057 (P8 · S2) — « Repartir de zéro » : lève la frontière de re-entrée EN VIDANT ce qui l'a
   * déclenchée, plutôt qu'en se contentant de la masquer. Deux effets, EXACTEMENT comme « Nouveau
   * patient » (T-026/D33) :
   *  - la MÉMOIRE DE SESSION est purgée par `reinitialiserSession()` — LA MÊME fonction que le bouton du
   *    header, réutilisée telle quelle (S2.md T-057 "Étapes" 4 : « n'invente pas un second chemin de
   *    purge ») ;
   *  - le FORMULAIRE DE CE NŒUD revient à son état vierge. Le remontage par `key` que le bouton du header
   *    obtient via `App.tsx` (`resetEpoch`) n'est PAS accessible depuis cet écran (`DecisionNodeScreen` ne
   *    reçoit que `nodeId`/`go`, jamais `resetEpoch`/`setResetEpoch` — header hors périmètre de cette
   *    session, cf. "Hors périmètre") : un remontage RÉEL exigerait de faire remonter cet état jusqu'à
   *    `App.tsx`, une décision d'architecture, pas une correction d'écran. Vider directement l'état LOCAL
   *    (`criteria`/`touched`/`repris`/`preremplis`) obtient le même résultat VISIBLE pour ce nœud sans
   *    inventer un second mécanisme de purge de la SESSION (qui, lui, reste unique) — seule la manière
   *    d'obtenir un formulaire vierge diffère, pas ce qui est vidé.
   */
  const handleRepartirDeZero = () => {
    reinitialiserSession()
    setCriteria(buildDefaultCriteria(node.criteres_entree))
    setTouched(new Set())
    setRepris(new Set())
    setPreremplis(new Set())
    // D50/T-179 — vidée avec `preremplis` : une origine de publication qui survivrait n'est certes lue par
    // aucun champ (`preremplis` est vide juste au-dessus), mais la vider EN PLUS évite de garder, dans cet
    // état local, une trace d'un nom de nœud/option qui ne correspond plus à rien d'affiché.
    setOriginesPublication(new Map())
    setIndisponibles(new Set())
    setFrontiereLevee(false)
  }

  // Aucun nœud « à venir » n'existe réellement en contenu (P1 ne livre que cible-glycemique) : la
  // notion de nœud non détaillé du prototype (`detailed: false`, données figées) n'a pas
  // d'équivalent en contenu réel. Repli défensif générique (pas de connaissance d'id de nœud
  // particulier, DECISIONS.md D8) : un nœud sans critère ni option exploitable retombe sur le bloc
  // placeholder du prototype plutôt que de planter (le schéma impose `options.length >= 1`, ce cas
  // ne devrait donc jamais se produire avec un contenu valide — robustesse, pas un chemin attendu).
  const isPlaceholder = node.criteres_entree.length === 0 || node.options.length === 0

  // Fusion des 3 alertes qui se recoupaient sur un formulaire vide/incomplet (remontée UI, 2026-07-29) :
  // « Reco provisoire », « Aucune option n'est proposée » et le bloc « En attente » disaient la même
  // chose trois fois (aucune carte à montrer, faute de critères) et occupaient à eux seuls tout l'écran
  // de résultats. Quand c'est le SEUL contenu possible (zéro carte, au moins une option en attente), on
  // ne garde que le bloc « en attente » (D20 R7, ci-dessous) — le plus précis des trois, il nomme déjà
  // l'option et les critères qui lui manquent. Sans effet sur l'état mixte (des cartes ET des options en
  // attente) : les deux messages y restent, chacun utile à sa place.
  const decisionEnAttenteSeule =
    violations.length === 0 &&
    !!vue &&
    !vue.familles.some((famille) => famille.groupes.length > 0) &&
    vue.enAttente.length > 0

  // Légende des couleurs d'action (T-112) : tableau vide sur les nœuds qui n'emploient pas ce vocabulaire
  // (`vue` absent ou aucune option `action`) — l'en-tête ne rend alors aucune légende (étape 2).
  const verbesPresents = vue ? verbesActionPresents(vue.familles) : []

  return (
    <div className="decision-node">
      {/* Retour vers le MODULE quand le nœud en fait partie (D22) : sans cela, on quitterait le module
          dès le premier nœud ouvert et le second axe ne serait plus atteignable qu'en repassant par la
          liste — alors que travailler les deux axes dans la même consultation est le cas prévu. */}
      {moduleDuNoeud ? (
        <button
          type="button"
          className="decision-node__back"
          onClick={() => go('decisionModule', { moduleId: moduleDuNoeud.id })}
        >
          <Icon nom="chevron-gauche" />
          Module : {moduleDuNoeud.titre}
        </button>
      ) : (
        // CIBLE CORRIGÉE (2026-08-06, T-152) : `decisionDomainNodes` (D2b) plutôt que `decisionDomains`
        // (D2a) — même motif que `DecisionModuleScreen.tsx`.
        <button
          type="button"
          className="decision-node__back"
          onClick={() => go('decisionDomainNodes', { domaine: node.domaine })}
        >
          <Icon nom="chevron-gauche" />
          Domaine : {labelForDomaine(node.domaine)}
        </button>
      )}
      <h1 className="decision-node__title">{node.titre}</h1>
      <PopulationCible texte={node.population_cible} />

      {/* Cadrage (D24) : positions de lecture du nœud, vraies pour tous ses patients. Rendu AVANT le
          formulaire — donc avant toute saisie — parce qu'elles conditionnent la lecture des options,
          alors que les alertes (`AlertList`, sous le formulaire) dépendent de ce qui vient d'être saisi.
          Cette séparation dans la page est la contrepartie visible de la séparation des deux canaux. */}
      {node.cadrage && <CadrageList cadrage={node.cadrage} />}

      {isPlaceholder ? (
        <div className="decision-node__placeholder">
          <div className="decision-node__placeholder-title">Contenu détaillé à venir</div>
          <p className="decision-node__placeholder-text">
            Ce nœud suivra la même structure que « Cible glycémique » : formulaire de critères,
            options avec preuve et effet attendu, argumentaire déplié avec reco officielle vs
            position critique.
          </p>
        </div>
      ) : (
        <>
          {/* P6/SB1 — DEUX COLONNES génériques (formulaire à gauche, résultats sticky à droite ≥ 1200px,
              D47 ; empilées en dessous, cf. CSS). Le moteur produit `familles`/`groupes` de façon identique
              pour les 6 nœuds DT2 : une seule disposition, pas une redisposition par nœud. AUCUNE des
              conditions ci-dessous n'a été réordonnée ni dupliquée par rapport au flux vertical précédent
              — seul leur conteneur DOM change (T-036 "Hors périmètre" : ne pas toucher au comportement). */}
          <div className="decision-node__body">
            <div className="decision-node__form-col">
              <CriteriaForm
                criteresEntree={node.criteres_entree}
                criteria={criteria}
                criteriaGroupement={criteriaDiffere}
                // T-023/D-06 (P4/S3) : `criteresRenseignes` (`touched` ∪ `preremplis`), pas `touched` seul —
                // sinon un segment pré-rempli par le contenu (K6) reste affiché `aria-pressed="false"` alors
                // que sa valeur a bien été posée (cf. la fusion ci-dessus, docstring complète sur `vue`).
                touched={criteresRenseignes}
                pertinents={pertinents}
                aConfirmer={new Set(decisifsManquants)}
                indisponibles={indisponibles}
                onDeclarerIndisponible={handleDeclarerIndisponible}
                repris={repris}
                preremplis={preremplis}
                originesPubliees={originesPublication}
                hints={
                  hasEsperanceVieCritere(node.criteres_entree) && !touched.has('esperance_vie')
                    ? { esperance_vie: 'Suggestion auto (âge, fragilité, comorbidité grave, antécédent CV) — à valider' }
                    : undefined
                }
                onConfirmerChamps={handleConfirmerChamps}
                onEffacer={handleCriteriaEffacer}
                // T-022 (D31) : `contraintesViolees` n'est PLUS transmis ici — le bandeau que `CriteriaForm`
                // en tirait s'affichait en tête de formulaire, 848 px au-dessus du champ fautif (D-15), ET en
                // double avec le bloc de suspension ci-dessous (« un bloc unique », Étape 1). Une contrainte
                // violée est désormais rendue UNE SEULE fois, à la place du panneau de résultats.
                onChange={handleCriteriaChange}
                // T-157 — ouverture ciblée depuis le cartouche « en attente » (cf. `champCible` en tête de
                // composant et `rendreCriteresCliquables`, tête de fichier).
                champCible={champCible}
              />
            </div>

            <div className="decision-node__results-col" ref={resultatsColRef}>
          {/* Alertes de NŒUD (D15, faits de sécurité) : restent visibles MÊME quand une contrainte de
              saisie suspend le reste du panneau juste en dessous (T-022 "Si bloqué" : suspendre les
              résultats ne doit jamais faire disparaître un fait de sécurité qui aurait dû rester — un
              canal différent, cf. `docs/decision/GRAMMAIRE-NOEUD.md` R4/D15). */}
          {vue && <AlertList alertes={vue.alertes} />}

          {violations.length > 0 ? (
            // T-022 (D31, 2026-07-28) — UNE CONTRAINTE VIOLÉE SUSPEND TOUT LE RESTE DU PANNEAU DE
            // RÉSULTATS : ni cartes applicables, ni options écartées, ni bloc « en attente », ni
            // argumentaire (Étape 4, "rien d'autre que le message"). Recette du 2026-07-28 : sur
            // `insuline`, TBR = 1 / TBR sévère = 95 (saisie que le nœud vient de déclarer impossible)
            // laissait pourtant subsister trois cartes « Recommandée » contradictoires (D-04) — la
            // contrainte n'était qu'un canal d'affichage parallèle, jamais opposable au rendu. Elle
            // l'est désormais : ce bloc REMPLACE tout le panneau ci-dessous tant qu'une contrainte reste
            // violée.
            <div className="decision-node__contrainte-suspension" role="alert">
              <div className="decision-node__contrainte-suspension-titre">
                Saisie à corriger avant de poursuivre
              </div>
              {violations.map((contrainte) => {
                // Étape 2 : nommer les champs en cause ET permettre d'y aller. AUCUN champ de
                // `CriteriaForm` ne porte aujourd'hui d'`id` HTML (vérifié, `components/CriteriaForm.tsx`)
                // — construire une ancre cliquable aurait donc exigé un mécanisme de navigation neuf (y
                // ajouter des `id`, gérer le défilement), explicitement hors périmètre de cette tâche
                // (« ne construis pas un mécanisme de navigation »). Repli explicite, tel que prévu par la
                // tâche : le nom du champ en clair, jamais un identifiant technique (I20).
                const champs = champsEnCause(contrainte.expression, node.criteres_entree)
                return (
                  <div key={contrainte.expression} className="decision-node__contrainte-suspension-item">
                    <p className="decision-node__contrainte-suspension-message">{contrainte.message}</p>
                    {champs.length > 0 && (
                      <p className="decision-node__contrainte-suspension-champs">
                        Champ{champs.length > 1 ? 's' : ''} concerné{champs.length > 1 ? 's' : ''} :{' '}
                        {champs.map(labelForCritere).join(', ')}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : afficherChoixReprise ? (
            // T-057 (P8 · S2, 2026-07-30) — FRONTIÈRE DE RE-ENTRÉE (D28, cf. le calcul de
            // `frontiereReprise`/`afficherChoixReprise` en tête de composant pour la condition exacte et
            // sa justification). MÊME PARTI PRIS que la suspension D31 juste au-dessus : ce bloc REMPLACE
            // tout le panneau (ni cartes, ni écartées, ni en attente, ni argumentaire) — c'est le REGARD
            // PORTÉ SUR LE RÉSULTAT qu'il faut intercepter, pas le formulaire (qui continue d'afficher
            // « repris de votre saisie », inchangé). Les alertes de nœud et le cadrage restent visibles
            // (rendus hors de ce bloc, ci-dessus/en tête de page) : une information de sécurité ne se
            // cache jamais, comme pendant une suspension D31.
            <div className="decision-node__reprise-frontiere">
              <div className="decision-node__reprise-frontiere-titre">Des valeurs de cette consultation pré-remplissent cet écran</div>
              <p className="decision-node__reprise-frontiere-texte">
                Les critères déjà renseignés proviennent de votre saisie sur un autre écran de cette
                consultation (« repris de votre saisie », dans le formulaire) ; rien n'a encore été saisi
                ici. Avant d'afficher une recommandation, confirmez qu'il s'agit bien du même patient.
              </p>
              <div className="decision-node__reprise-frontiere-actions">
                <button
                  type="button"
                  className="decision-node__reprise-frontiere-bouton"
                  onClick={handleReprendreValeurs}
                >
                  Reprendre les valeurs de ce patient
                </button>
                <button
                  type="button"
                  className="decision-node__reprise-frontiere-bouton decision-node__reprise-frontiere-bouton--secondaire"
                  onClick={handleRepartirDeZero}
                >
                  Repartir de zéro
                </button>
              </div>
            </div>
          ) : (
            <>
          {/* T-112 (P11/S7) — EN-TÊTE DE COLONNE : titre de section existant + compte d'options visibles
              (`optionsRenduesCount`, PARTAGÉ avec le CTA flottant mobile, T-113 : une seule source) +
              légende des couleurs d'action. La légende elle-même reste conditionnelle (`verbesPresents`,
              défini en tête de composant) : VIDE sur les nœuds qui n'emploient pas ce vocabulaire
              (`cible-glycemique`, `statine`, `rhd-*`) — rien n'est alors rendu à sa place, jamais une
              légende à 4 items écrite en dur (cf. "Décision clé", `plans/P11/S7.md`). */}
          {!decisionEnAttenteSeule && (
          <div className="decision-node__results-header">
            <div className="decision-node__section-title">
              {decisifsManquants.length > 0 ? 'Options applicables — provisoire' : 'Options applicables'}
              {optionsRenduesCount > 0 && (
                <span className="decision-node__results-count">
                  {' '}
                  · {optionsRenduesCount} option{optionsRenduesCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {verbesPresents.length > 0 && (
              <div className="decision-node__legende">
                {verbesPresents.map((verbe) => (
                  <span key={verbe} className="decision-node__legende-item">
                    <span
                      className={`decision-node__legende-pastille decision-node__legende-pastille--${verbe}`}
                      aria-hidden="true"
                    />
                    {LEGENDE_ACTION_LABEL[verbe]}
                  </span>
                ))}
              </div>
            )}
          </div>
          )}
          {/* REPENSÉ EN BADGE (2026-08-10, recommandation ergonomie) — MÊME INFORMATION qu'avant (le
              nombre de critères décisifs non confirmés, jamais un total inventé : `decisifsManquants` est
              la seule donnée que le moteur connaît ici, son dénominateur bouge avec chaque réponse — cf.
              `lib/formLayout.ts` `decisifsAConfirmer`), mais scindée en deux : un badge court, scannable
              d'un coup d'œil (même registre visuel que le compteur « N à confirmer » d'une section de
              formulaire, `CriteriaForm.css` `criteria-form__group-compte`), et la phrase procédurale
              (« les mesures chiffrées… ») reléguée en dessous, plus petite — elle explique COMMENT
              résoudre le manque, elle n'a pas à se relire aussi fort que LE FAIT qu'il en manque. */}
          {!decisionEnAttenteSeule && decisifsManquants.length > 0 && (
            <div className="decision-node__provisional">
              <span className="decision-node__provisional-badge">
                Reco provisoire · {decisifsManquants.length} critère
                {decisifsManquants.length > 1 ? 's à confirmer' : ' à confirmer'}
              </span>
              <p className="decision-node__provisional-detail">
                Les mesures chiffrées sont marquées « à confirmer » dans le formulaire ci-dessus, les
                drapeaux se confirment d'un clic par « Rien à signaler ». La recommandation peut encore
                changer.
              </p>
            </div>
          )}
          {/* T-134 (P12/S9) — LOYAUTÉ : la reco a été rendue SANS les critères déclarés indisponibles.
              Registre NEUTRE (comme `CadrageList` — ni fond d'alerte, ni couleur de vigilance) : contrairement
              au bandeau ambre ci-dessus, rien n'est ici « à faire » — cette mention CONSTATE un manquant déjà
              résolu (le praticien a tranché « je ne l'aurai pas »), elle ne réclame plus rien. Les deux
              mentions peuvent coexister (un critère résolu ainsi, un autre encore réellement en attente). */}
          {!decisionEnAttenteSeule && mentionIndisponibles && (
            <p className="decision-node__indisponible-mention">{mentionIndisponibles}</p>
          )}
          {decisionEnAttenteSeule ? null : vue && vue.familles.some((famille) => famille.groupes.length > 0) ? (
            (() => {
              // Regroupement PAR FAMILLE (`Noeud.familles` si déclarées, sinon repli historique — cf.
              // `lib/vueDecision.ts` `construireVueDecision`, qui compose `groupesParFamille`) : une
              // section par famille, dans l'ORDRE EXPLICITE de `Noeud.familles` (plus un sous-produit de
              // l'ordre d'écriture des options), et à l'intérieur seulement, les groupes d'égalité rendus
              // côte à côte pour un rang fini partagé — jamais deux options de familles différentes, même
              // à rang égal (ce qui suggérerait à tort un choix exclusif entre deux gestes qui en réalité
              // se CUMULENT, ex. « introduire un iSGLT2 » et « réduire la posologie du sulfamide »). Repli
              // sans `famille` déclarée (les 4 autres nœuds actuels) : une unique famille sans libellé,
              // rendu identique à l'ancien comportement à plat. Le badge (« le badge, c'est le plan »,
              // 2026-07-25) et les doses calculées sont déjà résolus dans `vue` — l'écran ne calcule plus
              // rien, il assemble.
              let cle = 0
              // T-136 (P12/S10, arbitrage référent 2026-08-02 point 4) — QUI SAIT qu'il n'y a qu'une
              // carte à l'écran ? Cet écran, pas la carte : `optionsRenduesCount` (T-113, défini plus
              // haut) est déjà le compte des options EFFECTIVEMENT AFFICHÉES (`partitionAffichage
              // .principales` aplati), pas des options applicables — une carte reléguée derrière
              // « Autres pistes possibles (N) » ne rend donc jamais ce booléen vrai. Calculé UNE FOIS ici
              // et transmis à toutes les cartes de `rendreFamilles` (repliées comprises : si ce booléen
              // est vrai, `repliees` est structurellement vide, cf. `lib/replierAffichage.ts` — un total
              // affiché de 1 ne peut pas coexister avec un repli, `plafonnerPistes` ne replie qu'au-delà
              // du plafond K5).
              const carteUnique = optionsRenduesCount === 1
              // Extrait en fonction le 2026-07-27 (repli d'affichage) : le même rendu sert maintenant DEUX
              // fois — les pistes du meilleur rang, puis celles repliées derrière le bouton. Le corps est
              // rigoureusement inchangé ; seule la source des familles devient un paramètre.
              const rendreFamilles = (familles: FamilleVue[]) => familles.map((famille, indexFamille) => {
                const sectionsGroupes = famille.groupes.map((groupe) => {
                  // BADGE/BAS-RANG PARTAGÉS (2026-08-04, demande utilisateur) — QUAND TOUTES les cartes
                  // d'un groupe d'égalité (≥ 2, cf. `groupe.length < 2` plus bas) portent le MÊME `badge`
                  // (respectivement le même `bas_rang`), le chip correspondant est hoisté UNE FOIS
                  // au-dessus de la paire (`badgeMasque`/`basRangMasque` sur chaque carte) plutôt que
                  // répété carte par carte — même logique pour les deux chips, l'un n'implique pas l'autre
                  // (une paire peut partager le badge sans partager `bas_rang`, ou l'inverse). `null`/
                  // `false` dès qu'UNE carte diverge : repli sur le rendu historique, chip par carte,
                  // jamais un chip qui mentirait pour la carte qui ne le porte pas.
                  const badgeCommun =
                    groupe.length >= 2 && groupe[0].badge != null && groupe.every((ov) => ov.badge === groupe[0].badge)
                      ? groupe[0].badge
                      : null
                  const basRangCommun =
                    groupe.length >= 2 &&
                    Boolean(groupe[0].option.bas_rang) &&
                    groupe.every((ov) => Boolean(ov.option.bas_rang) === true)
                  const cartes = groupe.map((optionVue) => (
                    <OptionCard
                      // `intitule` n'est pas garanti unique (cf. commentaire `EvaluateNodeResult` dans
                      // `engine/evaluateNode.ts`) : on compose avec un compteur pour une clé React sûre.
                      key={`${cle++}-${optionVue.option.intitule}`}
                      option={optionVue.option}
                      badge={optionVue.badge}
                      actionEffective={optionVue.actionEffective}
                      reasons={optionVue.reasons}
                      calculs={optionVue.calculs}
                      calculsEnAttente={optionVue.calculsEnAttente}
                      motifRang={optionVue.motifRang}
                      alertes={optionVue.alertes}
                      contreIndications={optionVue.contreIndications}
                      // T-202 (P15/S8, 2026-08-11) : items de posologie déjà filtrés par `quand` pour ce
                      // patient (`lib/vueDecision.ts` `OptionVue.posologieDetail`) — même bloc que
                      // `contreIndications`/`bibliographie`/`citationsReco`, même pattern de câblage.
                      posologieDetail={optionVue.posologieDetail}
                      carteUnique={carteUnique}
                      badgeMasque={badgeCommun != null}
                      basRangMasque={basRangCommun}
                      // Bibliographie du nœud, pour que la carte résolve `option.references` (ids) en
                      // titres cliquables dans son panneau « État des preuves » (2026-08-04).
                      bibliographie={node.sources.references_primaires}
                      // Second registre de bibliographie (P15/S1, 2026-08-11) : textes de recommandation
                      // officielle citables depuis `option.posologie_detail[].sources`, résolus par la
                      // carte au même titre que `references_primaires` (`OptionCard.tsx`,
                      // `resoudreSourcePosologie`). Sans ce câblage, un id de `sources[]` pointant vers ce
                      // registre reste ignoré en silence — la note de source ne rendrait jamais rien pour
                      // les items migrés vers ce canal (P15/S6, P15/S7).
                      citationsReco={node.sources.reco_officielle?.references ?? []}
                    />
                  ))
                  if (groupe.length < 2) return cartes
                  return (
                    <div className="decision-node__egalite" key={`egalite-${cle}`}>
                      {(badgeCommun != null || basRangCommun) && (
                        <div className="decision-node__egalite-badges">
                          {badgeCommun != null && <OptionBadgeChip badge={badgeCommun} />}
                          {basRangCommun && <BasRangChip />}
                        </div>
                      )}
                      {/* Mention NEUTRE (correctif « priorité multi-natures ») : elle affirmait avant
                          « aucune de ces options n'est préférable à l'autre », faux pour des gestes
                          cumulables. La nuance « en choisir un » / « cumulables » est désormais portée
                          par le TITRE DE FAMILLE (mention générique dérivée de `exclusive`, ci-dessous),
                          jamais par cet encadré générique.

                          T-024 (P4/S3, 2026-07-28) : « À ÉGALITÉ — MÊME NIVEAU DE PRIORITÉ. » ne portait
                          aucun contenu de départage (recette du 2026-07-28, rencontré trois fois) — le
                          praticien prenait la première carte de la liste, un ordre qui n'a pourtant aucune
                          signification clinique à ce rang. Reformulée pour dire explicitement les trois
                          choses que l'arbitrage retient : équivalentes sur les données disponibles, l'outil
                          ne les départage pas, le choix revient au praticien — SANS rédiger de phrase de
                          départage clinique (hors périmètre, ce serait du contenu à valider par le
                          référent) ni afficher les conditions divergentes (ramènerait le DSL à l'écran,
                          famille 8). Effet d'ordre déjà neutralisé par la mise en page (vérifié, pas
                          supposé) : `.decision-node__egalite-grid` rend les cartes CÔTE À CÔTE (CSS grid,
                          `auto-fit`), et `OptionCard.tsx` ne porte aucun numéro ni rang affiché — rien ne
                          distingue la 1re carte des suivantes au-delà de l'ordre du DOM. */}
                      <p className="decision-node__egalite-mention">
                        Options équivalentes sur les données disponibles : l'outil ne les départage pas, le
                        choix revient au praticien.
                      </p>
                      <div className="decision-node__egalite-grid">{cartes}</div>
                    </div>
                  )
                })
                if (famille.libelle == null) return sectionsGroupes
                return (
                  <div className="decision-node__famille" key={`famille-${indexFamille}-${famille.libelle}`}>
                    <div className="decision-node__famille-titre">
                      {famille.libelle}
                      {/* Mention d'interface GÉNÉRIQUE dérivée de `exclusive` (correctif « libellés
                          sans redondance », 2026-07-25) : jamais un vocabulaire clinique, juste la
                          convention « on choisit un » vs « tout est à faire ». Absente si `exclusive`
                          est `undefined` (nœud sans `familles` déclarées, repli). */}
                      {famille.exclusive === true && (
                        <span className="decision-node__famille-mention"> — en choisir un</span>
                      )}
                      {famille.exclusive === false && (
                        <span className="decision-node__famille-mention"> — gestes cumulables</span>
                      )}
                    </div>
                    {sectionsGroupes}
                  </div>
                )
              })
              // PLAFOND D'AFFICHAGE — K5, décision référent : 5 pistes au maximum. RÉACTIVÉ le 2026-07-27
              // après avoir été neutralisé le matin même, où il avait caché une carte d'insuline
              // d'initiation chez un patient en état catabolique. Ce qui a changé n'est pas le réglage
              // mais le SIGNAL : `lib/replierAffichage.ts` ne replie plus « ce qui n'est pas au meilleur
              // rang » (le rang 0 du socle faisait alors de tout le reste un surplus) — il ne replie que
              // ce que le contenu DÉCLARE repliable (`Option.role`, A3), et jamais une carte portant une
              // contre-indication ou une alerte active. La question laissée ouverte ce soir-là — « quel
              // signal du contenu dit qu'une carte ne peut pas être repliée ? » — a reçu sa réponse.
              // Rien n'est retiré : `principales ∪ repliees` est exactement `vue.familles`, et le bouton
              // porte le compte exact de ce qu'il cache. RÉUTILISE `partitionAffichage` (calculée plus
              // haut, T-113) au lieu d'un second appel à `plafonnerPistes(vue)` — même partition que celle
              // qui alimente déjà le compte du CTA flottant et l'en-tête de colonne (T-112).
              const { principales, repliees, nbRepliees } = partitionAffichage
              if (nbRepliees === 0) return rendreFamilles(vue.familles)
              return (
                <>
                  {rendreFamilles(principales)}
                  <details className="decision-node__repli">
                    <summary className="decision-node__repli-resume">
                      Autres pistes possibles ({nbRepliees})
                    </summary>
                    <p className="decision-node__repli-mention">
                      {nbRepliees === 1 ? 'Cette' : 'Ces'} {nbRepliees} {nbRepliees === 1 ? 'piste' : 'pistes'} s'applique{nbRepliees === 1 ? '' : 'nt'} à ce patient : {nbRepliees === 1 ? 'elle' : 'elles'} ne {nbRepliees === 1 ? 'n\'est' : 'sont'} pas écartée{nbRepliees === 1 ? '' : 's'}. Une
                      consultation ne permet d'en négocier que deux ou trois, l'écran en déplie donc au
                      plus {PLAFOND_PISTES} — {nbRepliees === 1 ? 'celle' : 'celles'} qui répond{nbRepliees === 1 ? '' : 'ent'} au plus grand nombre des éléments que
                      vous avez déclarés (les motifs listés sous chaque carte, « proposé parce que »). Les
                      gestes de sécurité et le socle ne sont jamais repliés.
                    </p>
                    {rendreFamilles(repliees)}
                  </details>
                </>
              )
            })()
          ) : (
            // T-023 Étape 2 : `applicable` ET `enAttente` sont TOUS DEUX vides — le nœud n'a rien à
            // proposer dans son périmètre pour ce patient. Ne fabrique aucun conseil clinique : dit
            // seulement que l'outil n'a rien, et renvoie au cadrage (positions de lecture du nœud,
            // `CadrageList` en tête de page) quand le nœud en déclare un.
            <p className="decision-node__empty">
              Cet algorithme n'a aucune conduite à proposer pour ce patient, avec les critères renseignés.
              {node.cadrage ? ' Son périmètre est décrit dans le cadrage en tête de page.' : ''}
            </p>
          )}

          {/* D20 R7 (SPEC-valeur-indeterminee.md §2.5, quatrième registre distinct des trois ci-dessous) —
              EN ATTENTE : ni proposée ni écartée, un ou plusieurs critères manquent pour trancher. Poussé
              comme `ecartees` (jamais replié) : c'est une QUESTION posée au praticien, pas une erreur — sur
              formulaire vierge, c'est ce bloc qui prend le relais du panneau de résultats vide (ci-dessus),
              plutôt qu'un « Aucune option ne correspond » qui affirmerait à tort une conclusion négative. */}
          {vue && vue.enAttente.length > 0 && (
            <div className="decision-node__en-attente">
              <div className="decision-node__en-attente-titre">
                En attente — critère{vue.enAttente.length > 1 ? 's' : ''} à renseigner pour trancher
              </div>
              {(() => {
                // T-060 (P8 · S2, 2026-07-30) — le titre ci-dessus s'affichait SEUL, « rien dessous »
                // (constaté 4 fois en recette, N1/N2/N7/N13b — « un encadré coloré vide se lit comme un
                // bug »). La donnée était pourtant déjà là et EXACTE (pas une heuristique) :
                // `vue.enAttente[].manquants` vient du registre `enAttente` d'`evaluateNode`, désigné
                // comme source de vérité par `engine/relevance.ts` (« cite TOUJOURS tous les critères
                // manquants d'une option, y compris en conjonction »). `manquants` ne contient QUE des
                // primitifs de `criteres_entree` (jamais un dérivé — `engine/evaluateNode.ts`
                // `primitivesReferencees` les déroule toujours vers leurs primitifs), donc CHACUN est
                // couvert par l'invariant I20 (`engine/banc/libelles.test.ts`, qui exige un libellé
                // rédigé pour TOUT `criteres_entree` d'un nœud publié) : `labelForCritere` ne peut pas
                // laisser sortir un identifiant brut ici pour un nœud publié — un `manquants` sans
                // libellé serait une violation d'I20 en amont, pas un défaut d'affichage à intercepter.
                //
                // DEUX FORMES POSSIBLES, UNE SEULE RETENUE PAR RENDU — jamais les deux en même temps.
                // En dessous d'un petit nombre de critères DISTINCTS (≤ 3, seuil choisi en P8 parce que
                // c'est le cas dominant en recette : une ou deux questions qui reviennent sur plusieurs
                // options), une phrase unique dédoublonnée est plus lisible qu'une liste option par option
                // qui répéterait le même nom de critère sous plusieurs intitulés — du bruit, pas
                // l'information cherchée (cf. N13b : « il manque : les traitements en cours », une phrase,
                // pas un tableau).
                //
                // AU-DELÀ DE 3 — REFONTE B2 (arbitrage référent, 2026-08-01). La forme précédente
                // retombait sur la liste par option, et ce repli n'a JAMAIS été couvert pour le cas où il
                // fait le plus de dégât : le formulaire VIERGE, où tout manque, où la liste est la plus
                // longue (une vingtaine d'options sur `prescription`) et où elle est le PREMIER écran que
                // voit le praticien. Le seuil de P8 visait explicitement un formulaire déjà rempli.
                // La question qu'il se pose à ce moment-là n'est pas « quelles options attendent quoi »,
                // c'est « PAR QUOI JE COMMENCE ». `prioritesDeSaisie` y répond en classant les critères
                // manquants par le nombre d'options qu'ils débloquent (décompte exact sur le registre
                // `enAttente` du moteur, cf. `lib/prioritesSaisie.ts` — jamais un score ni un jugement
                // d'importance clinique).
                //
                // RIEN N'EST PERDU (R4/D20) : le détail option par option reste intégralement accessible,
                // d'un clic, dans le dépli ci-dessous. On change ce qui est mis EN AVANT, jamais ce qui est
                // disponible.
                // T-134 (P12/S9) : `enAttenteAffichable`, pas `vue.enAttente` brut — les critères déclarés
                // indisponibles ne sont plus RÉCLAMÉS ici (cf. sa docstring plus haut). Les OPTIONS listées
                // par `vue.enAttente.length` ci-dessus (titre, compte du dépli) restent inchangées : c'est
                // la liste de ce qu'on demande qui se réduit, jamais le fait qu'une option reste en attente.
                const priorites = prioritesDeSaisie(enAttenteAffichable)
                // T-139 (P13/S2) — le détail option par option est désormais COMMUN aux trois branches
                // ci-dessous (avant : rendu SEULEMENT dans la branche `> 3`, cf. l'historique T-060/T-134
                // au-dessus). Sous ce seuil, la phrase de tête ne nomme QUE des critères — jamais l'option
                // qu'ils débloquent : sur un formulaire où il ne reste qu'un ou deux critères, aucune ligne
                // ne nommait l'option en attente nulle part (le trou par lequel N25 est passé, cf. le
                // défaut en tête de `plans/P13/S2.md`). La hiérarchie ne change pas (une phrase courte en
                // avant, le détail d'un clic) : c'est son exhaustivité qui manquait. Le compte du `summary`
                // reste `vue.enAttente.length` (le brut, T-134) ; la liste rendue reste `enAttenteAffichable`
                // (le filtré des indisponibles).
                // RENDU EN LIGNES (2026-08-10, recommandation ergonomie) — remplace la liste de
                // paragraphes à plat (« Option — à renseigner : X, Y », un mur de texte peu scannable) par
                // de courtes lignes nom/manquants, chacune un peu plus lisible d'un coup d'œil. MÊME
                // INFORMATION, RIEN N'EST RETIRÉ : seule la mise en forme change (Option en tête, manquants
                // en dessous, plus de séparation visuelle qu'un simple retour à la ligne).
                const detailOptionParOption = (
                  <details className="decision-node__en-attente-detail">
                    <summary>Voir le détail, option par option ({vue.enAttente.length})</summary>
                    <ul className="decision-node__en-attente-liste">
                      {enAttenteAffichable.map((enAttente, index) => (
                        <li key={`${index}-${enAttente.option.intitule}`} className="decision-node__en-attente-ligne">
                          <span className="decision-node__en-attente-option">{enAttente.option.intitule}</span>
                          <span className="decision-node__en-attente-manquants">
                            {enAttente.manquants.length > 0
                              ? `À renseigner : ${enAttente.manquants.map(labelForCritere).join(', ')}`
                              : 'En attente sans les critères déclarés indisponibles ci-dessus'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )
                if (priorites.length === 0) {
                  // TOUT ce qui manquait encore a été déclaré indisponible : le T-060 cité ci-dessus a déjà
                  // montré qu'un encadré coloré sans corps se lit comme un bug — la mention de loyauté
                  // ci-dessus (`mentionIndisponibles`) explique le POURQUOI, celle-ci dit que ces options
                  // précises restent malgré tout en attente (R7 : le moteur ne peut toujours pas trancher).
                  // T-139 : le détail reste utile ici — il NOMME les options qui restent suspendues, ce que
                  // la phrase seule ne fait pas.
                  return (
                    <>
                      <p className="decision-node__en-attente-item">
                        Ces options restent en attente : le seul critère qui les distingue encore a été
                        déclaré indisponible ci-dessus.
                      </p>
                      {detailOptionParOption}
                    </>
                  )
                }
                if (priorites.length <= 3) {
                  return (
                    <>
                      <p className="decision-node__en-attente-item">
                        À renseigner pour trancher :{' '}
                        {rendreCriteresCliquables(
                          priorites.map((p) => p.nom),
                          champsAtteignables,
                          (nom) => setChampCible({ nom }),
                        )}
                        .
                      </p>
                      {detailOptionParOption}
                    </>
                  )
                }
                // Trois questions de tête : assez pour amorcer une reco provisoire, assez peu pour être
                // lues en consultation. Le reste est dénombré, jamais caché.
                const tete = priorites.slice(0, 3)
                const reste = priorites.length - tete.length
                return (
                  <>
                    <p className="decision-node__en-attente-item">
                      Commencez par :{' '}
                      {rendreCriteresCliquables(
                        tete.map((p) => p.nom),
                        champsAtteignables,
                        (nom) => setChampCible({ nom }),
                      )}
                      .
                      {' '}
                      <span className="decision-node__en-attente-note">
                        Ce sont les critères qui débloquent le plus d'options
                        {/* T-141 (P13/S2) — accord fautif corrigé : « 1 autre restent » (le verbe suivait
                            le pluriel FIXE de la phrase, jamais celui, variable, de `reste`). Le verbe
                            s'accorde désormais comme le nom qui le précède, sur le MÊME test que lui. */}
                        {reste > 0 ? ` ; ${reste} autre${reste > 1 ? 's' : ''} rest${reste > 1 ? 'ent' : 'e'} à renseigner ensuite` : ''}.
                      </span>
                    </p>
                    {detailOptionParOption}
                  </>
                )
              })()}
            </div>
          )}

          {/* R4 — ÉCARTÉES (sécurité) : l'option était indiquée, une exclusion l'a retirée. Toujours
              visible, discrètement, sous le panneau de résultats — jamais en silence (D13/R4). */}
          {vue && vue.ecartees.length > 0 && (
            <div className="decision-node__ecartees">
              {vue.ecartees.map((ecartee, index) => (
                <p key={`${index}-${ecartee.option.intitule}`} className="decision-node__ecartee">
                  {/* T-144 (P13/S4) — `ecartee.motifs` porte désormais les BRANCHES SITUATIONNELLES
                      (`lib/vueDecision.ts` `exclusionsSituationnelles`, même mécanisme que R6 pour
                      `reasons`) : la disjonction complète n'est plus rendue, seule la branche vraie pour
                      CE patient l'est. `ecartee.option.motifs` (motifs rédigés, P10/S2) était jusqu'ici
                      omis ici — jamais consommé sur les écartées alors qu'il l'est partout ailleurs. */}
                  {ecartee.option.intitule} écarté : {describeReasons(ecartee.motifs, ecartee.option.motifs)}
                </p>
              ))}
            </div>
          )}

          {/* R4 — NON RETENUES (explication) : l'option n'était pas indiquée pour ce patient. Consultée
              sur demande seulement — sur un nœud à 22 options, la pousser rendrait l'écran illisible. */}
          {vue && vue.nonRetenues.length > 0 && (
            <div className="decision-node__non-retenues">
              <button
                type="button"
                className="decision-node__non-retenues-toggle"
                aria-expanded={nonRetenuesOpen}
                onClick={() => setNonRetenuesOpen((open) => !open)}
              >
                {nonRetenuesOpen ? 'Masquer les autres options' : 'Pourquoi pas d’autres options ?'}
              </button>
              {nonRetenuesOpen && (
                <div className="decision-node__non-retenues-liste">
                  {/* P10/S2 — ÉNUMÉRATION NÉGATIVE (`describeNonApplicable`), et non plus la liste
                      positive de cas que rendait `describeReasons` : toutes les branches de cette
                      expression sont FAUSSES pour ce patient, les énoncer à l'affirmative laissait lire
                      une affirmation avant de la nier. Motifs rédigés consommés au passage. */}
                  {vue.nonRetenues.map((nonRetenue, index) => (
                    <p key={`${index}-${nonRetenue.option.intitule}`} className="decision-node__non-retenue">
                      {nonRetenue.option.intitule} — {describeNonApplicable(nonRetenue.condition, nonRetenue.option.motifs)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            className="decision-node__toggle-argument"
            onClick={() => setArgOpen((open) => !open)}
          >
            {argOpen ? "Replier l'argumentaire" : "Déplier l'argumentaire"}
          </button>

          {argOpen && <ArgumentPanel node={node} />}
            </>
          )}
            </div>
          </div>

          {/* Bouton flottant mobile (< 1200px, D47) — masqué ≥ 1200px, où la colonne résultats est `sticky`
              (toujours dans le viewport pendant la saisie, cf. CSS) : y dupliquer ce raccourci n'aurait
              aucun usage. Compte `optionsRenduesCount` dérivé de `partitionAffichage.principales` aplati
              (T-113, défini plus haut — PARTAGÉ avec l'en-tête de la colonne, T-112), jamais une valeur
              inventée — 0 pendant une suspension D31, comme le panneau qu'il cible. */}
          {isNarrow && (
            <button
              type="button"
              className="decision-node__floating-recos"
              onClick={scrollVersResultats}
            >
              Voir les recommandations ({optionsRenduesCount})
              <Icon nom="fleche-bas" className="decision-node__floating-recos-icone" />
            </button>
          )}
        </>
      )}

      {/* TEXTE REFORMULÉ (2026-08-06, T-150, 2e passe) — même texte final que `DisclaimerBar.tsx`,
          condensé sur une ligne (pied de page discret, 12px) : pas de mise en valeur ajoutée ici, la
          densité de gras/couleur des versions plus visibles (bandeau, accueil) serait hors de propos sur
          un texte déjà réduit en taille et en contraste. */}
      <div className="decision-node__footer">
        Révisé le {formatDateRevue(node.meta.date_revue)} · Aide fondée exclusivement sur des données
        probantes (EBM) — jugement clinique et relation avec le patient construisent la décision.
      </div>
    </div>
  )
}
