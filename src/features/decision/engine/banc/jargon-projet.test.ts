/**
 * Banc — COUCHE 3 « invariants », I25 — LE JARGON DE PROJET NE S'AFFICHE JAMAIS AU PRATICIEN.
 *
 * POURQUOI CET INVARIANT EXISTE. Signalé le 30/07, partiellement corrigé (« → nœud E », « VÉRIFIÉ par le
 * référent » ont disparu), TOUJOURS présent le 02/08 (recette navigateur, chevron « Argumentaire complet ») :
 * « 6ᵉ série, collecte + red-team adversarial », « ÉTAT DES TROIS RÉSIDUELS au 2026-07-27 », et la consigne
 * au rédacteur « Bénéfice propre sur critère dur de preuve faible (ne pas afficher « bénéfice CV prouvé ») »
 * — une note de méthode interne à l'équipe, laissée dans un champ que l'écran affiche tel quel. C'est la
 * TROISIÈME passe consécutive qui relève ce défaut (30/07, une passe intermédiaire, 02/08) : un nettoyage
 * ponctuel ne suffit pas, il faut un garde-fou qui échoue tant qu'une trace en reste et qui empêche la
 * quatrième.
 *
 * CE QUE C'EST — ET CE QUE ÇA N'EST PAS. Le contenu YAML est plein de commentaires `#` qui documentent le
 * PROCESS (numéro de lot/série de red-team, dates d'arbitrage référent, chantiers, PMID vérifiés…) : ils
 * ne sont JAMAIS un défaut, parce qu'un commentaire YAML n'est JAMAIS chargé par `loadNodes.ts`/
 * `loadModules.ts` ni affiché où que ce soit — c'est la mémoire de chantier du dépôt, elle a sa place. Le
 * défaut ne commence QUE quand la même prose de méthode migre dans un CHAMP DE VALEUR — une chaîne que
 * `noeuds`/`modules` charge réellement et qu'un composant React rend à l'écran.
 *
 * PORTÉE — TOUT CE QUI EST AFFICHÉ, pas seulement les `*.argumentaire.md` (la 3ᵉ passe n'avait balayé
 * qu'eux) : `titre`, `population_cible`, `cadrage`, `alertes[].message`, `incertitudes`, les blocs
 * `sources.*` du panneau d'argumentaire (`ArgumentPanel.tsx`), et, par option, `intitule`, `avantages`,
 * `inconvenients`, `effet_attendu`, `delai_benefice`, `apercu`, `contre_indications`, `motifs`,
 * `alertes[].message` — la liste exacte que rend `OptionCard.tsx`/`ArgumentPanel.tsx`, croisée avec
 * `content/node.types.ts`. PLUS les fichiers `*.argumentaire.md`, l'argumentaire exhaustif (niveau de
 * lecture 3, `MiniMarkdown`) : rendus À 100 % tels quels, sans aucun tri de section — une phrase de
 * méthode n'importe où dans ce fichier s'affiche.
 *
 * ÉLARGISSEMENT DU 2026-08-04 — DEUX ENTRÉES DE PLUS DANS LA PORTÉE, parce que l'écran a changé :
 *   - `Noeud.argumentaire` (le champ COURT). Il était explicitement HORS PORTÉE avec pour motif
 *     « `ArgumentPanel.tsx` ne le lit nulle part » — c'était exact, et c'était un DÉFAUT : un champ
 *     obligatoire au schéma, rempli avec soin dans les six nœuds, et jamais rendu. La refonte du panneau
 *     l'affiche (section « Comment ce nœud raisonne »), il entre donc dans la portée par la même règle
 *     qui l'en excluait. Rien n'a été assoupli ; c'est la prémisse « jamais rendu » qui est tombée.
 *   - `sources.reco_officielle.references[].nom`/`.detail` et `sources.reco_officielle.divergences[].*`
 *     (nouveaux canaux du même jour). `synthese_critique.references` sort de la portée : le champ
 *     n'existe plus.
 *
 * CE QUI N'EST PAS DANS CETTE PORTÉE, et pourquoi. `meta`/`changelog` (jamais rendu, vérifié dans
 * `ArgumentPanel.tsx` — aucune trace de `.changelog` ni `.meta.` côté affichage) ; les commentaires `#`
 * (jamais chargés, cf. ci-dessus).
 *
 * LES MARQUEURS — calibrés sur les 4 défauts RÉELLEMENT relevés en recette (cf. citation ci-dessus), pas
 * une liste au jugé. Chacun a été vérifié à la main contre le corpus affiché réel avant d'entrer ici, pour
 * la même raison que I9 restreint ses tournures : un marqueur qui produit du bruit dévalue le rouge pour
 * tous les marqueurs suivants (cf. `invariants-contenu.test.ts`, commentaire d'I9). Notamment :
 *   - `\d+\s*[eEᵉ]\s*(série|lot)\b` (jamais `/série/` ni `/lot/` seuls) : une « série de 40 patients »
 *     (Munshi, taille d'échantillon) ou un « hors-série n° 1 » (référence bibliographique SFD) sont des
 *     usages cliniques/bibliographiques légitimes du mot — seule la forme ORDINALE « 6ᵉ série », « 4e lot »
 *     désigne une itération de chantier ;
 *   - `collecte` : MESURÉ, pas supposé — une première exécution sans restriction a trouvé 3 faux positifs
 *     RÉELS, tous de la même forme : « ce nœud ne collecte pas/que/aucun… » (`cible-glycemique`,
 *     `rhd-alimentation`), le verbe « collecter » employé pour dire ce qu'un nœud NE demande PAS comme
 *     critère — un usage fonctionnel légitime, sans rapport avec l'étape « collecte » de la veille
 *     documentaire (`docs/veille/SOP.md`). Les trois s'écrivent tous « ne collecte » (négation immédiate) ;
 *     le sens PROJET, lui, s'écrit toujours en nom (« la collecte », « cette collecte », « deux collectes »,
 *     « après collecte », « post-collecte ») ou en verbe NON négativement adjacent (« la collecte
 *     attribuait… », « une collecte affirmait… »). Le marqueur exclut donc spécifiquement la forme verbale
 *     négative directe (lookbehind `(?<!ne )`), la seule forme clinique constatée ;
 *   - `ne pas afficher` : une INSTRUCTION AU RÉDACTEUR ne peut, par construction, être un fait clinique —
 *     un praticien ne lit jamais une consigne de rédaction sur *lui-même*.
 *
 * QUATRE MARQUEURS AJOUTÉS LE 2026-08-04 (demande utilisateur, recette navigateur) : « les incertitudes
 * doivent se baser sur les données ou leur absence, pas sur les choix référent (il ne doit pas être
 * cité) ». C'est une règle de FOND, pas seulement de forme, et elle vaut au-delà des `incertitudes` :
 *   - `qui-a-tranché` (`référent`) — LE MARQUEUR CENTRAL de cette demande. Une incertitude clinique se
 *     fonde sur une donnée ou sur son absence ; « le référent a tranché » n'est ni l'une ni l'autre, et
 *     ne dit RIEN au praticien qui lit — il ne connaît pas ce référent, et le citer transforme un
 *     argument vérifiable en argument d'autorité. Le fait clinique sous-jacent reste, bien sûr : c'est
 *     l'attribution qui part. Corollaire pour `divergenceReco.appui` (`node.types.ts`) : une divergence
 *     appuyée sur « le référent a tranché » n'est pas une divergence argumentée, c'est une préférence.
 *   - `date-de-chantier` (`2026-07-27`…) — une date ISO dans une phrase affichée est, sans exception
 *     constatée sur le corpus, une date d'ARBITRAGE ou de CORRECTION, c'est-à-dire du changelog qui a
 *     fui dans un champ de valeur. Les dates cliniquement utiles s'écrivent autrement (« SFD 2025 »,
 *     « ADA Standards of Care 2026 ») : ce marqueur ne les touche pas. VÉRIFIÉ à la main sur les six
 *     nœuds avant d'entrer ici — 41 occurrences, toutes de la première espèce, zéro faux positif.
 *   - `statut-de-chantier` (`RÉSOLU`, `TRANCHÉ`, `CLOS`, `PRÉMISSE FAUSSE`…) en capitales — le vocabulaire
 *     du suivi de tâche. Restreint aux CAPITALES à dessein : « la question reste tranchée par les
 *     données » est une phrase clinique légitime, « TRANCHÉ le 2026-07-27 » est une ligne de journal.
 *   - `étape-de-projet` (`recette`, `passe A`, `capture 6`, `T-063`, `P12/S6`) — les identifiants de
 *     tâche et d'étape, qui ne désignent rien hors du dépôt.
 *
 * DETTE — VOLONTAIREMENT AUCUNE, pour les neuf marqueurs. Une trace de jargon de projet n'a JAMAIS de
 * justification clinique à attendre : c'est un défaut de FORME pur, toujours corrigible sans toucher une
 * seule `condition`. Une entrée de dette ici serait la case vide que ce fichier existe justement pour
 * empêcher de rouvrir.
 *
 * Les quatre marqueurs du 2026-08-04 sont arrivés sur un corpus existant, ce qui a justifié une dette
 * NOMMÉE et sous cliquet le temps de reprendre les six nœuds — quelques heures. Elle est vidée, et son
 * échafaudage retiré avec elle : le régime est de nouveau le même pour tous les marqueurs.
 */
import { describe, expect, it } from 'vitest'
import { getArgumentaireExhaustif } from '../../content/loadArgumentaires.ts'
import { modules } from '../../content/loadModules.ts'
import { noeuds } from '../../content/loadNodes.ts'
import type { ModuleDecision } from '../../content/module.types.ts'
import type { ContreIndication, ItemPosologie, Noeud, Option } from '../../content/node.types.ts'

/** Un fragment de texte AFFICHÉ, avec un chemin lisible pour un message d'échec exploitable. */
interface Fragment {
  chemin: string
  texte: string
}

function texteContreIndication(ci: string | ContreIndication): string {
  return typeof ci === 'string' ? ci : ci.texte
}

// T-194 (P15/S1, 2026-08-11) : `posologie_detail` accepte désormais une CHAÎNE (forme historique) ou un
// OBJET `{ texte, sources? }` (`ItemPosologie`) — même normalisation que `texteContreIndication`
// ci-dessus, pour la même raison : c'est le `texte`, jamais `sources` (des ids, pas de la prose), qui
// doit être contrôlé par I25.
function texteItemPosologie(item: string | ItemPosologie): string {
  return typeof item === 'string' ? item : item.texte
}

/** Tout ce que `OptionCard.tsx`/`ArgumentPanel.tsx` rendent d'UNE option (cf. `node.types.ts` pour le
 * détail champ par champ — `role`/`action`/`conditions`/`prerequis`/`exclusions`/`priorite`/`famille`/
 * `references`/`niveau_preuve`/`calculs` sont des jetons TECHNIQUES ou des valeurs contrôlées (DSL, enum,
 * nombre) que le praticien ne lit jamais comme PROSE — hors périmètre par construction, pas par oubli). */
function fragmentsOption(option: Option, prefixe: string): Fragment[] {
  const fragments: Fragment[] = [{ chemin: `${prefixe}.intitule`, texte: option.intitule }]
  option.avantages.forEach((texte, i) => fragments.push({ chemin: `${prefixe}.avantages[${i}]`, texte }))
  option.inconvenients.forEach((texte, i) => fragments.push({ chemin: `${prefixe}.inconvenients[${i}]`, texte }))
  fragments.push({ chemin: `${prefixe}.effet_attendu`, texte: option.effet_attendu })
  if (option.delai_benefice) fragments.push({ chemin: `${prefixe}.delai_benefice`, texte: option.delai_benefice })
  if (option.apercu) fragments.push({ chemin: `${prefixe}.apercu`, texte: option.apercu })
  // AJOUTÉ le 2026-08-07 : `posologie_detail` est rendu par `OptionCard.tsx:536` (paragraphes du panneau
  // posologie) et manquait à cette liste — un champ affiché échappait donc à I25 depuis sa création.
  // Trouvé en corrigeant l'arbitrage n°13 (harmonisation « nœud »/« cet écran ») : une occurrence de
  // « du nœud « Insulinothérapie » » dans `prescription.yaml` (posologie_detail) n'était visible par
  // AUCUN test avant cet ajout.
  ;(option.posologie_detail ?? []).forEach((item, i) =>
    fragments.push({ chemin: `${prefixe}.posologie_detail[${i}]`, texte: texteItemPosologie(item) }),
  )
  for (const [i, ci] of (option.contre_indications ?? []).entries()) {
    fragments.push({ chemin: `${prefixe}.contre_indications[${i}]`, texte: texteContreIndication(ci) })
  }
  for (const [cle, texte] of Object.entries(option.motifs ?? {})) {
    fragments.push({ chemin: `${prefixe}.motifs["${cle.slice(0, 40)}"]`, texte })
  }
  for (const [i, alerte] of (option.alertes ?? []).entries()) {
    fragments.push({ chemin: `${prefixe}.alertes[${i}].message`, texte: alerte.message })
  }
  return fragments
}

/** Tout ce que `DecisionNodeScreen.tsx`/`ArgumentPanel.tsx`/`CadrageList.tsx` rendent d'UN nœud. */
function fragmentsNoeud(node: Noeud): Fragment[] {
  const fragments: Fragment[] = [
    { chemin: 'titre', texte: node.titre },
    { chemin: 'population_cible', texte: node.population_cible },
  ]
  ;(node.cadrage ?? []).forEach((texte, i) => fragments.push({ chemin: `cadrage[${i}]`, texte }))
  ;(node.alertes ?? []).forEach((alerte, i) =>
    fragments.push({ chemin: `alertes[${i}].message`, texte: alerte.message }),
  )
  node.incertitudes.forEach((texte, i) => fragments.push({ chemin: `incertitudes[${i}]`, texte }))
  if (node.sources.reco_officielle.source) {
    fragments.push({ chemin: 'sources.reco_officielle.source', texte: node.sources.reco_officielle.source })
  }
  if (node.sources.reco_officielle.position) {
    fragments.push({ chemin: 'sources.reco_officielle.position', texte: node.sources.reco_officielle.position })
  }
  if (node.sources.reco_officielle.explication) {
    fragments.push({ chemin: 'sources.reco_officielle.explication', texte: node.sources.reco_officielle.explication })
  }
  if (node.sources.synthese_critique.donnee) {
    fragments.push({ chemin: 'sources.synthese_critique.donnee', texte: node.sources.synthese_critique.donnee })
  }
  // Rendu depuis la refonte du 2026-08-04 (« Comment ce nœud raisonne ») — cf. docstring de tête, § portée.
  if (node.argumentaire) fragments.push({ chemin: 'argumentaire', texte: node.argumentaire })
  ;(node.sources.reco_officielle.references ?? []).forEach((reference, i) => {
    fragments.push({ chemin: `sources.reco_officielle.references[${i}].nom`, texte: reference.nom })
    if (reference.detail) {
      fragments.push({ chemin: `sources.reco_officielle.references[${i}].detail`, texte: reference.detail })
    }
  })
  ;(node.sources.reco_officielle.divergences ?? []).forEach((divergence, i) => {
    fragments.push({ chemin: `sources.reco_officielle.divergences[${i}].sujet`, texte: divergence.sujet })
    fragments.push({
      chemin: `sources.reco_officielle.divergences[${i}].position_officielle`,
      texte: divergence.position_officielle,
    })
    fragments.push({
      chemin: `sources.reco_officielle.divergences[${i}].position_outil`,
      texte: divergence.position_outil,
    })
    fragments.push({ chemin: `sources.reco_officielle.divergences[${i}].appui`, texte: divergence.appui })
  })
  ;(node.sources.references_primaires ?? []).forEach((reference, i) =>
    fragments.push({ chemin: `sources.references_primaires[${i}].titre`, texte: reference.titre }),
  )
  ;(node.contraintes ?? []).forEach((contrainte, i) =>
    fragments.push({ chemin: `contraintes[${i}].message`, texte: contrainte.message }),
  )
  node.options.forEach((option, i) => fragments.push(...fragmentsOption(option, `options[${i}]`)))
  return fragments
}

/** Tout ce que `DecisionModuleScreen.tsx` rend d'UN module. */
function fragmentsModule(module: ModuleDecision): Fragment[] {
  const fragments: Fragment[] = [{ chemin: 'titre', texte: module.titre }]
  if (module.population_cible) fragments.push({ chemin: 'population_cible', texte: module.population_cible })
  module.cadrage.forEach((texte, i) => fragments.push({ chemin: `cadrage[${i}]`, texte }))
  fragments.push({ chemin: 'primer.question', texte: module.primer.question })
  module.primer.orientations.forEach((orientation, i) => {
    fragments.push({ chemin: `primer.orientations[${i}].libelle`, texte: orientation.libelle })
    ;(orientation.indices ?? []).forEach((texte, j) =>
      fragments.push({ chemin: `primer.orientations[${i}].indices[${j}]`, texte }),
    )
  })
  return fragments
}

// ---------------------------------------------------------------------------------------------------
// MARQUEURS — cf. docstring de tête pour la calibration de chacun.
// ---------------------------------------------------------------------------------------------------
const MARQUEURS_JARGON: { motif: RegExp; nom: string }[] = [
  { motif: /red[-\s]?team/i, nom: 'red-team' },
  { motif: /\d+\s*[eEᵉ]\s*(?:série|lot)\b/iu, nom: 'Nᵉ série / Nᵉ lot' },
  { motif: /RÉSIDUELS?\b/, nom: 'RÉSIDUEL(S)' },
  { motif: /ne pas afficher/i, nom: 'ne pas afficher' },
  { motif: /(?<!ne )\bcollectes?\b/i, nom: 'collecte' },
  { motif: /VÉRIFIÉ par le référent/i, nom: 'VÉRIFIÉ par le référent' },
  { motif: /→\s*nœud\s+[A-Z]\b/u, nom: '→ nœud <lettre>' },
  { motif: /\badversarial\b/i, nom: 'adversarial' },
  { motif: /\bchantier\b/i, nom: 'chantier' },
]

/**
 * Les QUATRE marqueurs ajoutés le 2026-08-04 (cf. docstring de tête) — tenus à part parce qu'eux seuls
 * sont arrivés sur un corpus existant plutôt qu'avec lui, et pour que le message d'échec dise lequel des
 * deux lots s'applique.
 */
const MARQUEURS_ARGUMENT: { motif: RegExp; nom: string }[] = [
  { motif: /\bréférents?\b/i, nom: 'qui-a-tranché (« référent »)' },
  { motif: /\b20\d{2}-\d{2}-\d{2}\b/, nom: 'date-de-chantier (AAAA-MM-JJ)' },
  {
    motif: /\b(?:RÉSOLU|TRANCHÉ|CLOS|MAINTENU|PRÉMISSE FAUSSE|RESTE NON ENCODÉ|NON TRANCHÉ)\b/,
    nom: 'statut-de-chantier (capitales)',
  },
  { motif: /\b(?:recette|passes? [A-Z]\b|capture \d|T-\d{2,3}|P\d+\/S\d+)/i, nom: 'étape-de-projet' },
]

/**
 * SEPT MARQUEURS AJOUTÉS LE 2026-08-05 — LA TUYAUTERIE NE S'AFFICHE JAMAIS, ET LE NIVEAU 3 N'EST PAS UN
 * JOURNAL DE CHANTIER.
 *
 * D'OÙ ILS VIENNENT. La relecture des quatre niveaux d'argumentaire des six nœuds DT2 (badge de preuve,
 * carte dépliée, argumentaire du nœud, argumentaire exhaustif) a trouvé la MÊME famille de défaut dans
 * les six : le contenu parlait de l'outil, du dépôt et de son propre chantier au lieu de parler du
 * patient. Les deux lots précédents ne l'attrapaient pas — ils visent le vocabulaire du PROCESS (red-team,
 * série, recette) et l'ARGUMENT D'AUTORITÉ (qui a tranché, quand). Ce lot-ci vise ce qui reste : les noms
 * de champs, les chemins de fichiers, les mentions de statut éditorial et le vocabulaire du moteur.
 *
 * POURQUOI UN INVARIANT PLUTÔT QU'UN NETTOYAGE. C'est la QUATRIÈME famille de jargon corrigée à la main
 * sur ce corpus, et la troisième fois qu'un lot de marqueurs est ajouté après coup. Le nettoyage manuel
 * ne tient pas : chaque passe d'édition en réintroduit, parce que l'auteur d'un nœud a le champ YAML sous
 * les yeux au moment où il rédige le texte que le praticien lira. Seul un test qui échoue au moment de
 * l'écriture ferme la boucle.
 *
 * CALIBRATION — MESURÉE, PAS SUPPOSÉE, et c'est la condition d'entrée dans ce fichier (cf. le commentaire
 * d'I9 et celui de « collecte » ci-dessus). Les sept motifs ont été comptés sur le corpus RÉEL après
 * correction — les 6 nœuds (tous les champs rendus par `OptionCard.tsx`/`ArgumentPanel.tsx`), le module
 * `rhd`, et les 6 argumentaires exhaustifs : **zéro occurrence pour chacun**. Aucune dette, donc, et
 * aucune exemption : un marqueur qui part de zéro n'a rien à amnistier.
 *
 * LE DÉTAIL DE CHACUN, et pourquoi il ne produit pas de bruit :
 *   - `backtick` — le motif le plus simple et le plus sûr. Un accent grave n'a AUCUN usage en prose
 *     clinique française ; sa présence signale toujours un identifiant de code cité tel quel
 *     (« `statine_deja_en_place` ne demande qu'un oui/non », « le champ `argumentaire` du nœud »). Vaut
 *     aussi pour les `.md`, qui sont du Markdown mais ne montrent jamais de code à un praticien.
 *   - `chemin-de-depot` — un chemin `docs/…`, `src/…`, ou un nom de fichier `.md`/`.yaml`/`.ts`/`.json`.
 *     Le lecteur n'a pas le dépôt : on lui désignait des documents qu'il ne peut pas ouvrir
 *     (« cf. `docs/decision/noeuds/H-rhd.md` §3 »). Les liens cliniques légitimes sont des URL et des
 *     DOI, que ce motif ne touche pas.
 *   - `statut-editorial` — « brouillon », « en attente de relecture ». Le statut de validation vit dans
 *     `meta.statut`, jamais dans un texte affiché : quatre argumentaires exhaustifs sur six s'ouvraient
 *     sur « Brouillon, en attente de relecture clinique », qu'un praticien lit comme un avertissement
 *     sur la fiabilité de ce qu'il consulte.
 *   - `donnee-manquante` — les marqueurs de rédaction `[À VÉRIFIER]` et « DONNÉE À FOURNIR ». Une
 *     incertitude réelle s'écrit en français (« ordre de grandeur, non confirmé sur la publication
 *     d'origine ») ; le marqueur, lui, est une note que l'auteur s'adresse à lui-même.
 *   - `renvoi-interne` — « dossier de preuve », « cf. changelog ». Deux artefacts du dépôt présentés au
 *     lecteur comme la source où vérifier, alors qu'ils lui sont inaccessibles.
 *   - `vocabulaire-moteur` — « sentinelle », « evaluateNode », « DSL », « golden master », « banc de
 *     test/mécanique/réaliste », « profils du banc ». Constaté : un paragraphe entier de mécanique
 *     d'échantillonnage (« 0/1120 profils ») au niveau de lecture 3.
 *   - `identifiant-de-decision` — la forme PARENTHÉSÉE `(D20)`, `(R1)`, `(I12)` seulement. Restreinte à
 *     dessein : un « (R1) » entre parenthèses est un renvoi au registre de décisions du projet, tandis
 *     qu'un « D2 » ou « R3 » nu peut être une vertèbre, une racine nerveuse ou un stade clinique.
 *
 * HUITIÈME MARQUEUR AJOUTÉ LE 2026-08-07 (arbitrage n°13 de `passe-redaction-2026-08-05.md`, laissé
 * ouvert deux passes) : `vocabulaire-architecture` (« nœud »/« noeud »). Un praticien ne sait pas ce
 * qu'est un « nœud » du dépôt ; le mot était employé en auto-référence (« ce nœud »/« le nœud » →
 * « cet écran », convention déjà adoptée sur `cible-glycemique`) et en référence à un autre écran
 * nommément (« nœud prescription » → décrire ce qui s'y passe plutôt que le nommer). MESURÉ contre le
 * corpus réel via `fragmentsNoeud`/`fragmentsOption` (pas un grep brut, qui compte aussi les 90+
 * occurrences légitimes dans `meta.changelog` et les commentaires `#`, jamais rendus) : 82 occurrences
 * trouvées et corrigées, zéro restant. Cette mesure a aussi trouvé un TROU DE COUVERTURE préexistant de
 * ce fichier : `option.posologie_detail`, rendu par `OptionCard.tsx:536`, manquait à `fragmentsOption` —
 * ajouté dans la foulée.
 */
const MARQUEURS_REDACTION: { motif: RegExp; nom: string }[] = [
  { motif: /`/, nom: 'backtick (identifiant de code cité tel quel)' },
  {
    motif: /\b(?:docs|src|content|schema)\/[\w./-]+|\b[\w-]+\.(?:md|yaml|ts|tsx|json)\b/,
    nom: 'chemin-de-depot',
  },
  { motif: /\bbrouillon\b|en attente de relecture/i, nom: 'statut-editorial' },
  { motif: /\[À VÉRIFIER\]|DONNÉE À FOURNIR/i, nom: 'donnee-manquante' },
  { motif: /cf\.?\s*changelog|dossier de preuve/i, nom: 'renvoi-interne' },
  {
    motif: /\bsentinelles?\b|evaluateNode|\bDSL\b|golden master|\bbanc (?:de test|mécanique|réaliste)\b|profils? du banc/i,
    nom: 'vocabulaire-moteur',
  },
  { motif: /\((?:D|R|I)\d{1,2}\)/, nom: 'identifiant-de-decision' },
]
// NOTE (2026-08-07) : un HUITIÈME marqueur `vocabulaire-architecture` (« nœud »/« noeud », arbitrage n°13
// de `passe-redaction-2026-08-05.md`) a été mesuré (82 occurrences, corrigées) et verrouillé en cliquet,
// puis RETIRÉ D'ICI avant commit : `insuline`, `prescription`, `rhd-alimentation`, `rhd-activite-physique`
// et `cible-glycemique` portent, dans le même arbre de travail non commité, des changements de
// comportement d'une autre session (P14) qui n'incluent pas encore cette correction textuelle sur leurs
// propres fichiers — les commiter ensemble aurait mêlé deux lots. Le marqueur revient dès que ces cinq
// nœuds sont commités avec leur correction (cf. `docs/decision/validation/contre-relecture-redaction-2026-08-06.md` §4 ter).

/** Fragments qui contiennent AU MOINS UN marqueur — chaque violation nomme le marqueur ET la chaîne. */
function violationsDeFragments(
  fragments: Fragment[],
  origine: string,
  marqueurs: { motif: RegExp; nom: string }[] = MARQUEURS_JARGON,
): string[] {
  const violations: string[] = []
  for (const { chemin, texte } of fragments) {
    for (const { motif, nom } of marqueurs) {
      if (motif.test(texte)) {
        const aPlat = texte.replace(/\s+/g, ' ').trim()
        const extrait = aPlat.length > 140 ? `${aPlat.slice(0, 140)}…` : aPlat
        violations.push(`${origine} :: ${chemin} :: marqueur "${nom}" :: "${extrait}"`)
      }
    }
  }
  return violations
}

describe('I25 — aucun jargon de projet dans un champ affiché au praticien', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))(
    'nœud %s — aucun champ de contenu affiché ne porte un marqueur de jargon de projet',
    (_id, node) => {
      const violations = violationsDeFragments(fragmentsNoeud(node), `nœud "${node.id}"`)
      expect(violations).toEqual([])
    },
  )

  it.each(modules.map((module) => [module.id, module] as const))(
    'module %s — aucun champ de contenu affiché ne porte un marqueur de jargon de projet',
    (_id, module) => {
      const violations = violationsDeFragments(fragmentsModule(module), `module "${module.id}"`)
      expect(violations).toEqual([])
    },
  )

  /**
   * MARQUEURS DU 2026-08-04 — « une incertitude se fonde sur une donnée ou sur son absence, jamais sur
   * qui a tranché ». Régime à dette, cf. docstring de tête : les nœuds de
   * Aucun nœud n'y échappe.
   */
  it.each(
    noeuds.map((node) => [node.id, node] as const),
  )(
    'nœud %s — aucun champ affiché ne cite qui a tranché, ni une date/étape de chantier',
    (_id, node) => {
      const violations = violationsDeFragments(
        fragmentsNoeud(node),
        `nœud "${node.id}"`,
        MARQUEURS_ARGUMENT,
      )
      expect(violations).toEqual([])
    },
  )

  /**
   * MARQUEURS DU 2026-08-05 — « la tuyauterie ne s'affiche jamais » (cf. docstring de `MARQUEURS_REDACTION`).
   * Aucune dette : les sept motifs ont été mesurés à zéro sur ce corpus avant d'entrer ici.
   */
  it.each(noeuds.map((node) => [node.id, node] as const))(
    'nœud %s — aucun champ affiché ne montre un nom de champ, un chemin du dépôt, un statut éditorial ni le vocabulaire du moteur',
    (_id, node) => {
      const violations = violationsDeFragments(
        fragmentsNoeud(node),
        `nœud "${node.id}"`,
        MARQUEURS_REDACTION,
      )
      expect(violations).toEqual([])
    },
  )

  it.each(modules.map((module) => [module.id, module] as const))(
    'module %s — aucun champ affiché ne montre un nom de champ, un chemin du dépôt, un statut éditorial ni le vocabulaire du moteur',
    (_id, module) => {
      const violations = violationsDeFragments(
        fragmentsModule(module),
        `module "${module.id}"`,
        MARQUEURS_REDACTION,
      )
      expect(violations).toEqual([])
    },
  )

  /**
   * MÊME LOT, SUR L'ARGUMENTAIRE EXHAUSTIF — c'est là qu'il y en avait le plus, et pour une raison de
   * structure : ce fichier est rendu SANS AUCUN TRI DE SECTION (cf. le bloc suivant), si bien qu'une note
   * de méthode écrite pour l'équipe se retrouve à l'écran au même titre qu'un résultat d'essai.
   */
  it.each(
    noeuds.filter((node) => node.argumentaire_exhaustif).map((node) => [node.id, node] as const),
  )(
    'nœud %s — son argumentaire exhaustif ne montre ni tuyauterie, ni statut éditorial, ni marqueur de rédaction',
    (_id, node) => {
      const markdown = getArgumentaireExhaustif(node.argumentaire_exhaustif)
      expect(markdown, `argumentaire_exhaustif="${node.argumentaire_exhaustif}" introuvable`).toBeTruthy()
      const occurrences = MARQUEURS_REDACTION.flatMap(({ motif, nom }) => {
        const global = new RegExp(motif.source, motif.flags.includes('g') ? motif.flags : `${motif.flags}g`)
        return [...markdown!.matchAll(global)].map((m) => `${nom} :: "${m[0]}" (position ${m.index})`)
      })
      expect(occurrences, `occurrences détaillées dans ${node.argumentaire_exhaustif}`).toEqual([])
    },
  )

  /**
   * ARGUMENTAIRE EXHAUSTIF — rendu À 100 % tel quel par `MiniMarkdown` derrière le chevron « Argumentaire
   * exhaustif » (niveau de lecture 3, D11) : AUCUNE section n'est filtrée avant affichage, donc AUCUNE
   * section du fichier `.md` n'est hors de portée pour cet invariant, contrairement à un champ YAML
   * structuré où seuls certains champs sont rendus. C'est le lot cité par la mission comme concentrant le
   * plus de traces (`insuline.argumentaire.md`).
   */
  it.each(
    noeuds
      .filter((node) => node.argumentaire_exhaustif)
      .map((node) => [node.id, node] as const),
  )('nœud %s — son argumentaire exhaustif ne porte aucun marqueur de jargon de projet', (_id, node) => {
    const markdown = getArgumentaireExhaustif(node.argumentaire_exhaustif)
    expect(markdown, `argumentaire_exhaustif="${node.argumentaire_exhaustif}" introuvable`).toBeTruthy()
    const violations = violationsDeFragments(
      [{ chemin: node.argumentaire_exhaustif!, texte: markdown! }],
      `nœud "${node.id}"`,
    )
    // Un fichier entier peut porter PLUSIEURS occurrences du même marqueur : signaler chacune plutôt que
    // dédupliquer, pour que le message d'échec serve directement de liste de correction — la fonction
    // `violationsDeFragments` traite déjà tout le texte du fichier comme UN SEUL fragment, un `.match`
    // global donne donc le compte réel de correspondances plutôt qu'un simple booléen.
    const occurrences = MARQUEURS_JARGON.flatMap(({ motif, nom }) => {
      const global = new RegExp(motif.source, motif.flags.includes('g') ? motif.flags : `${motif.flags}g`)
      return [...markdown!.matchAll(global)].map((m) => `${nom} :: "${m[0]}" (position ${m.index})`)
    })
    expect(violations.length === 0 ? [] : occurrences, `occurrences détaillées dans ${node.argumentaire_exhaustif}`).toEqual([])
  })

  /**
   * MÊME FICHIER, MARQUEURS DU 2026-08-04 : un argumentaire exhaustif est un texte de fond, pas un
   * journal de travail, et la règle « la donnée ou son absence, jamais qui a tranché » y vaut autant
   * qu'ailleurs.
   */
  it.each(
    noeuds
      .filter((node) => node.argumentaire_exhaustif)
      .map((node) => [node.id, node] as const),
  )(
    'nœud %s — son argumentaire exhaustif ne cite pas qui a tranché, ni une date/étape de chantier',
    (_id, node) => {
      const markdown = getArgumentaireExhaustif(node.argumentaire_exhaustif)
      expect(markdown, `argumentaire_exhaustif="${node.argumentaire_exhaustif}" introuvable`).toBeTruthy()
      const occurrences = MARQUEURS_ARGUMENT.flatMap(({ motif, nom }) => {
        const global = new RegExp(motif.source, motif.flags.includes('g') ? motif.flags : `${motif.flags}g`)
        return [...markdown!.matchAll(global)].map((m) => `${nom} :: "${m[0]}" (position ${m.index})`)
      })
      expect(occurrences, `occurrences détaillées dans ${node.argumentaire_exhaustif}`).toEqual([])
    },
  )
})
