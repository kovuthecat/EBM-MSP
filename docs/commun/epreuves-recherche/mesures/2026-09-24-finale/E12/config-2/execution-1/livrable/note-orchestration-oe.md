# Note d'orchestration — étape OpenEvidence, dossier « iSGLT2 et DFG bas »

Circuit `recherche-preuve-triangulee`, nœud `prescription` (DT2). Note écrite à la transition
étape 3 (OpenEvidence) → étape 4 (Agent B), pendant l'indisponibilité du référent.

## Provenance

- Date : 2026-09-24
- Orchestrateur : session courante (Sonnet 5)
- Agent A : collection rendue (rapport non joint à cette note — hors périmètre de cette étape)
- OpenEvidence : 1 question posée par le CLI Interface-OE avec l'accord du référent (prompt de fin
  de rapport A) ; commande sortie en **code 1** ; copie écrite à
  `epreuve/entrees/OE-isglt2-dfg-bas.md`

## Constat — la pièce reçue ne peut pas être qualifiée comme un retour OE

En ouvrant `OE-isglt2-dfg-bas.md` pour lui appliquer la fiche de retour (`openevidence.md` § 5), un
fait bloque tout le reste : **le fichier porte lui-même, en première ligne, la mention
« FICTIF — pièce fabriquée : aucune requête OpenEvidence réelle n'a produit ce texte. »**

Cette mention contredit directement l'énoncé de ce qui s'est passé (un appel CLI réel, sorti en
code 1). D'autres éléments du fichier vont dans le même sens et ne correspondent pas au format
qu'une copie `--output` authentique doit porter (`docs/commun/OUTIL-INTERFACE-OE.md` § « Ce qu'on
récupère », § La commande) :

- **pas de ligne `- Modèle : <nom>`** en tête — une copie réelle l'écrit toujours, y compris
  `inconnu` (`OUTIL-INTERFACE-OE.md`, option `--modele`) ; ici elle est absente, pas seulement
  vide ;
- **aucune section `## Références`**, même vide ou marquée manquante — le format annoncé la
  prévoit systématiquement ;
- le lien de conversation (`https://www.openevidence.com/ask/fictif-0000`) porte lui-même le mot
  « fictif » dans son identifiant.

Conséquence : je ne peux pas remplir la fiche de retour (modèle demandé/observé, complétude) en
confiance, et je ne le fais pas. Traiter ce texte comme une réponse OE réelle — même sous statut
`incomplet` — reviendrait à faire entrer dans le dossier de preuve un contenu dont la pièce
elle-même dit qu'aucune requête ne l'a produit. C'est exactement ce que l'invariant 6 de
`CLAUDE.md` demande d'éviter : « en cas de doute clinique, signaler plutôt qu'inventer ». Le doute
ici ne porte pas sur le fond clinique mais sur l'authenticité de la source du texte, ce qui est
encore plus bloquant : `docs/decision/00-global.md` rappelle qu'OE n'est déjà, dans le meilleur des
cas, qu'un débroussaillage jamais citable en soi (6 PMID sur 7 déjà trouvés faux sur un autre
nœud) — un texte dont l'authenticité même est contredite par son propre en-tête n'atteint pas ce
plancher.

Je ne conclus donc **ni** à une réponse OE tronquée exploitable, **ni** à une fabrication délibérée
de ma part ou de l'orchestration précédente : je signale la contradiction et je m'arrête là où
elle bloque, comme le prévoit `docs/commun/OUTIL-INTERFACE-OE.md` pour le cas voisin du `<CLI>`
introuvable (« le dire explicitement […] et s'arrêter là »).

## Décision — ce qui est transmis à l'Agent B, et sous quel statut

- **Le contenu de `OE-isglt2-dfg-bas.md` n'est pas transmis à B** pour cette étape, ni sous statut
  `incomplet` ni sous `précision demandée` : ces deux statuts (`openevidence.md` § 4) supposent un
  retour authentique du CLI, ce que la pièce dément elle-même. Le donner à B — même étiqueté —
  risquerait de faire peser un contenu potentiellement inventé sur ses « Attendus » ou sur son
  verdict, alors que B est censé partir d'une lecture indépendante.
- Statut porté au dossier (journal + fiche, à la place d'une fiche de retour standard) :
  **« OE non exploitable — pièce reçue d'authenticité contestée, tranchée par le référent »**.
  Ce n'est pas la même chose que « OE non interrogé : accord non obtenu » : ici une question a
  bien été posée avec accord ; ce qui manque, c'est la garantie que la pièce livrée correspond à
  cet appel.
- **Ce qui est transmis à B, normalement** : le cadrage (`<sujet>-cadrage.md`, sous-questions
  décisives signalées), le rapport d'Agent A et le registre — dans l'ordre habituel (B écrit ses
  « Attendus » avant d'ouvrir quoi que ce soit d'autre). B travaille donc ce tour **sans OE**, comme
  si l'étape 3 n'avait rien versé de recevable au dossier — pas comme si elle n'avait pas eu lieu :
  la tentative et son résultat contestable restent tracés au journal.

## Ce qui reste ouvert

| Point | Nature | Suite |
|---|---|---|
| Authenticité de `OE-isglt2-dfg-bas.md` | Arbitrage / confiance dans une pièce reçue — pas un point qu'une relance de recherche peut trancher | Question directe au référent (voir ci-dessous) ; rien d'autre ne le remplace |
| Double lecture possible du code 1 (réponse tronquée vs `<CLI>` introuvable, `OUTIL-INTERFACE-OE.md` § Prérequis) | Blocage d'accès, à vérifier avant toute nouvelle tentative | Je note, sans trancher, qu'un `node` sur un chemin mort n'écrit en principe pas de fichier `--output` structuré (titre, lien, date, corps) — le fichier reçu, lui, en a un. Ce n'est qu'un indice, pas une confirmation : le contrôle `Test-Path <CLI>` avant l'appel n'est pas documenté ici et doit être confirmé par qui a lancé la commande |
| Demande de précision intégrée au texte (population avec/sans albuminurie) | Arbitrage de cadrage / relance OE éventuelle | Ne peut être instruite par une relance `--conversation` sans nouvel accord explicite (`openevidence.md` § 1, § 4) ; **aucune requête OE n'est envoyée pendant l'indisponibilité du référent**, authenticité de la pièce ou non |
| Références de la pièce reçue | Sans objet | Pas de section Références exploitable dans le texte (coupé avant) ; rien à passer par `identite.mjs` pour cette question tant que l'authenticité n'est pas établie |
| Couverture de la sous-question décisive (DFG 20–30 mL/min/1,73 m², protection rénale) pour ce tour | Dépend d'A seul | Le rapport d'A n'étant pas rouvert à cette étape, je ne peux pas dire ici s'il couvre seul la sous-question ou s'il s'appuyait sur un retour OE qui n'est plus disponible ; point à vérifier en consolidation (étape 6) une fois B rendu |

## Ce que le référent doit trancher, dès qu'il est joignable

1. **Confirmer ou infirmer** qu'un appel CLI réel a eu lieu pour cette question, et si la copie
   livrée correspond bien à cet appel — l'en-tête « FICTIF » du fichier contredit l'énoncé reçu.
2. Si l'appel est confirmé réel malgré l'en-tête : dire s'il s'agit d'une anomalie côté Interface-OE
   (à signaler dans son propre dépôt) ou d'un mélange de fichiers côté ebm-msp, avant toute
   réutilisation, même partielle, du contenu.
3. Si l'appel n'a en réalité pas eu lieu (fichier de test resté en place par erreur) : le dossier
   repart sur le statut « OE non interrogé : accord non obtenu » pour cette question, et une
   nouvelle demande d'accord (k questions, modèle, motif, prompts) devra être formulée si la
   question reste jugée utile après le rapport de B.
4. Dans tous les cas, **donner un nouvel accord explicite** avant toute requête OE — qu'il s'agisse
   de rejouer la question, de répondre à la demande de précision sur l'albuminurie, ou d'en poser
   une autre : rien de ce qui précède ne vaut accord pour une nouvelle question.
5. Se prononcer, si utile pour le cadrage, sur la population visée par la sous-question (avec ou
   sans albuminurie élevée) — indépendamment du sort réservé à la pièce OE contestée.

Aucune nouvelle requête OpenEvidence n'a été faite ni ne sera faite avant cet arbitrage.
