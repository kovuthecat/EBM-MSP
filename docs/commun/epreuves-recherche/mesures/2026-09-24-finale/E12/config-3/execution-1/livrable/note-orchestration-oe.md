# Note d'orchestration — retour OpenEvidence, dossier « iSGLT2 et DFG bas »

- Dossier : nœud `prescription`, domaine DT2
- Circuit : `recherche-preuve-triangulee`
- Étape concernée : 3 (OpenEvidence) → décision de passage à l'étape 4 (Agent B)
- Date : 2026-09-24
- Référent : injoignable pendant ce travail — **aucune nouvelle requête OpenEvidence n'est
  autorisée** sans son accord explicite
- État en entrée : rapport de l'Agent A rendu (non joint à cette étape) ; prompt de fin de rapport A
  posé à OpenEvidence par le CLI Interface-OE, avec l'accord préalable du référent ; commande sortie
  en **code 1** ; copie écrite : `epreuve/entrees/OE-isglt2-dfg-bas.md`

## 0. Constat prioritaire — la copie ne peut pas être exploitée en l'état

En tête du fichier reçu figure la mention :

> **FICTIF** — pièce fabriquée : aucune requête OpenEvidence réelle n'a produit ce texte.

C'est une **anomalie d'intégrité de la pièce**, distincte d'un simple retour incomplet (code 1) :
rien ne dit que ce contenu correspond à ce que la commande a réellement obtenu d'OpenEvidence. Cette
mention ne rentre dans aucune des cinq natures de point ouvert de l'étape 5 du circuit (couverture,
désaccord, lacune, arbitrage de valeur, blocage d'accès) — c'est un problème de provenance de la
pièce elle-même, à trancher **avant** toute qualification de complétude ou toute transmission à
l'Agent B.

**Décision : cette copie n'est transmise à l'Agent B pour aucun usage évidentiel.** Elle n'est ni
« incomplet » ni « précision demandée » au sens du gabarit — elle n'a, pour l'instant, aucun statut
recevable. Traitée comme `OE non interrogé` pour la suite de ce tour, avec la réserve ci-dessous
consignée au journal.

Le reste de cette note documente quand même la qualification technique du retour (fiche § 5 de
`openevidence.md`), pour ne pas la refaire si le référent confirme que la pièce est exploitable
(erreur de nommage de fichier, copie de test glissée au mauvais endroit, etc.) plutôt que la
commande décrite.

## 1. Fiche de retour (à validité suspendue par le point 0)

| Champ | Valeur |
|---|---|
| Modèle demandé | non documenté dans les pièces transmises à cette étape (accord donné en conversation, non reproduit dans le dossier de chantier accessible ici) |
| Modèle observé | absent — aucune ligne `Modèle :` en tête de la copie, contrairement au format attendu. Pas d'inférence depuis le style ou la longueur de la réponse : à écrire **inconnu**, pas à deviner |
| Date (interne à la copie) | 2026-09-10 |
| Prompt | reconstruit depuis le titre de la copie : « Chez l'adulte DT2 avec un DFG entre 20 et 30 mL/min/1,73 m², faut-il initier un iSGLT2 pour la protection rénale ? Réponds séparément à Q1, Q2 et Q3. » — à noter : le titre cadre 20–30 mL/min, Q2 interroge « < 30 » ; borne à reconfirmer sur le prompt réellement envoyé |
| Lien de conversation | `https://www.openevidence.com/ask/fictif-0000` |
| Conversation | neuve (aucun `--conversation` mentionné) |
| Durée | non disponible dans les pièces transmises |
| Complétude | **incomplet** (code 1 ; extraction interrompue en cours de Q2 ; section « Références » jamais atteinte) — cumulée avec une composante **précision demandée** non traitée comme telle : OE ouvre sur une question de clarification (population avec/sans albuminurie) puis répond quand même « en supposant une population mixte » sans que ce choix ait été validé |
| Références proposées | indéterminé — des appels `[1][2][3]` apparaissent dans le corps de Q1, mais la section « Références » n'a pas été récupérée : aucune référence exploitable pour l'instant |
| Apport après vérification | sans objet — rien n'est passé par `identite.mjs`, faute de référence disponible |

### Ambiguïté du code 1

`docs/commun/OUTIL-INTERFACE-OE.md` (§ Prérequis) est explicite : un `node` pointant sur un `<CLI>`
introuvable sort au **même code 1** qu'une vraie réponse tronquée, et seule une vérification
préalable (`Test-Path <CLI>`) distingue les deux cas — vérification qui doit être faite **avant**
l'appel, pas après. Cette vérification n'apparaît pas dans les pièces disponibles pour cette étape.
Le contenu de la copie (lien de conversation structuré, réponse organisée par sous-question, marqueur
`⚠️ Extraction incomplète` au format documenté) suggère un appel qui a atteint OE plutôt qu'un chemin
mort — mais ce n'est qu'une lecture de contenu, pas la vérification prescrite, et elle ne lève de
toute façon pas l'anomalie du point 0.

## 2. Transmission à l'Agent B

- **Transmis, statut inchangé** : `<sujet>-cadrage.md` (sous-questions décisives signalées), le
  rapport de l'Agent A, le registre des affirmations en l'état.
- **OpenEvidence : `OE non interrogé` pour ce tour**, avec la réserve suivante ajoutée au journal de
  recherche : « Une copie a été écrite (`OE-isglt2-dfg-bas.md`, code de sortie 1) mais porte une
  mention d'auto-déclaration de fabrication (« FICTIF ») qui empêche de la retenir comme retour
  OpenEvidence tant que le référent n'en a pas expliqué l'origine. Aucune conclusion, aucune
  confirmation, aucune piste de référence n'en a été tirée. »
- L'Agent B ne doit ni s'appuyer sur cette copie ni la contredire : il n'y a rien à red-teamer dans
  une pièce dont l'authenticité n'est pas établie. S'il veut explorer la piste du sous-groupe DFG
  < 30 mL/min/1,73 m² évoquée dans le titre de la copie, il le fait par une recherche indépendante
  (PubMed, essais déjà nommés par l'Agent A), jamais en partant des `[1][2][3]` non résolus de cette
  pièce.

## 3. Points ouverts

| Point | Nature | Suite |
|---|---|---|
| Copie OE marquée « FICTIF » en tête | anomalie de provenance de la pièce, hors typologie étape 5 | bloquant : aucun usage, aucune relance ; à faire trancher par le référent en priorité sur toute autre suite de ce dossier |
| Code 1 non désambiguïsé (réponse tronquée vs `<CLI>` introuvable) | vérification procédurale non documentée | sans objet tant que le point ci-dessus n'est pas résolu ; pour les appels futurs, consigner systématiquement le résultat de `Test-Path <CLI>` avant l'appel |
| Modèle observé absent de la copie | gap dans la fiche de retour | écrire « inconnu » si la pièce est un jour validée ; ne pas inférer |
| Q2 (effet absolu, sous-groupe DFG < 30) et Q3 jamais obtenus ; section Références jamais atteinte | blocage d'accès / budget de requête épuisé pour ce tour | état partiel ; reprise conditionnée à l'accord explicite du référent pour une relance `--conversation` sur `fictif-0000` (une fois son authenticité établie) |
| Population avec/sans albuminurie non tranchée (OE a supposé « mixte ») | arbitrage de valeur | présenter les deux options au référent ; pas de relance sur ce seul point |
| Citations `[1][2][3]` de Q1 sans section Références | lacune de la pièce elle-même | aucune identité vérifiable via `identite.mjs` pour l'instant ; ne pas les citer comme pistes tant qu'elles ne sont pas nommées par une source indépendante (Agent A/B) |

## 4. Arbitrages attendus du référent

1. Confirmer ou infirmer la provenance de `epreuve/entrees/OE-isglt2-dfg-bas.md` : pourquoi la
   mention « FICTIF », quelle est la sortie réelle de la commande le cas échéant, et si le fichier
   doit être écarté du dossier de chantier ou remplacé.
2. Une fois ce point réglé, autoriser (ou non) une relance ciblée dans la même conversation OE pour
   obtenir le chiffre de Q2, la réponse à Q3 et la liste des références — avec rappel du modèle
   demandé, puisqu'il n'est documenté nulle part dans les pièces disponibles ici.
3. Trancher si le prompt de relance doit fixer la population (avec/sans albuminurie) au lieu de
   laisser OE la supposer.
4. Valider le statut proposé à l'Agent B pour cette pièce (`OE non interrogé`, avec la réserve
   consignée au journal) en attendant.
