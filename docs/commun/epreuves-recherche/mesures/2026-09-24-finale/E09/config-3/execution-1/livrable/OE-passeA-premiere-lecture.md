# Première lecture — retour OE, bloc OE-A2 (titration basale sur GAJ : monter et descendre)

## Provenance

- Date : 2026-09-24
- Lecteur : orchestrateur (session courante), aucune requête OpenEvidence effectuée pour ce travail
- Source lue : `epreuve/entrees/OE-passeA-brut-2026-07-29.txt`, section correspondant au prompt **OE-A2**
  de `epreuve/entrees/PROMPTS-OE-passeA.md` (lignes ~204-398 du brut : le fichier concatène les
  réponses aux 5 prompts sans en-tête explicite entre elles ; la bascule OE-A1→OE-A2 se repère au
  changement de sujet — de « postprandial glucose thresholds » à « self-titration algorithms based on
  fasting glucose » — et la bascule OE-A2→OE-A3 au début de « PART A — NON-INSULIN-TREATED TYPE 2
  DIABETES », l. 399)
- Objet précis de cette fiche : **Question 1** du prompt OE-A2, « The down-titration rule » — table
  rendue par OE en l. 329-332 du brut, complétée par les mentions de règle de descente disséminées
  dans le corps du texte (une par essai, avant la table de synthèse)
- Statut du retour OE : non qualifié formellement à l'étape 3 du circuit (pas de fiche `OE-<sujet>.md`
  ouverte — ce document n'est qu'une première lecture, pas la qualification du retour). Le modèle
  utilisé et le caractère complet/incomplet du retour ne sont pas connus de ce lecteur.

## Rappel du motif (cadrage, `PROMPTS-OE-passeA.md` l. 51-53)

Le nœud encode aujourd'hui la **montée** (Treat-to-Target : +2 U si GAJ > cible 3 matins de suite)
mais pas la **descente** : une GAJ basse y produit aujourd'hui une majoration de dose. L'objet de cette
lecture est donc précisément la règle de réduction — pas la règle de montée, déjà couverte ailleurs.

## Table des règles de réduction de dose rendues par OE

Reconstituée à partir de la table de synthèse « Question 1 » (brut l. 331) **et** croisée avec la
description narrative de chaque essai plus haut dans le même bloc (brut l. 210-326), quand celle-ci
apporte un détail que la table de synthèse n'a pas.

| Essai | Déclencheur de la réduction (tel que rendu) | Montant de la réduction | Référence donnée par OE |
|---|---|---|---|
| Treat-to-Target (Riddle 2003) | « Any PG » — **valeur numérique du seuil non rendue**, ni dans la table de synthèse ni dans le corps du texte (qui ne mentionne qu'une règle de *non-augmentation*, pas de réduction chiffrée) | « Fixed units (−2 to −4 U) » — **non retrouvé dans le corps du texte**, seulement dans la table de synthèse | [1] (Khunti 2020, revue narrative) et [2] (Riddle 2003, essai princeps) |
| AT.LANTUS — bras Fritsche (physician-led) | FBG — **seuil non rendu** (la ligne « <90 mg/dL » de la table de titration donnée plus haut, l. 230, est tronquée : seul le libellé « −2 U » subsiste, sans la borne chiffrée) | **−2 U** (concordant entre table de synthèse et table de titration du corps de texte) | [3] (Barnett 2007 — **revue narrative**, pas une des publications princeps AT.LANTUS déjà citées plus haut dans le même bloc : Fritsche 2003 PMID 14578243, Davies 2005 PMID 16306275, Davies 2007 PMID 17593236) |
| AT.LANTUS — bras Davies (patient-led) | FBG — **seuil non rendu** ; le corps du texte coupe juste après « in the absence of BG [6][3] », sans jamais donner la règle de descente pour ce bras | **−2 U** — **affirmé seulement dans la table de synthèse**, aucune confirmation dans le corps du texte (qui ne décrit que la règle de montée de ce bras) | [3] (même référence secondaire que la ligne précédente) |
| INSIGHT (Gerstein 2006) | Sans objet | **« Cannot be grounded »** — OE indique lui-même que la publication princeps ne publie pas de règle de descente chiffrée | [4] (Gerstein 2006, essai princeps) |
| LANMET (Yki-Järvinen 2006) | Sans objet | **« Cannot be grounded »** — idem, OE le signale explicitement | [5] (Yki-Järvinen 2006, essai princeps) |
| PREDICTIVE 303 (Meneghini 2007) | Mean aFPG — **seuil non rendu**, à la fois dans la table de titration du corps (l. 272, ligne « <80 mg/dL » tronquée) et dans la phrase « reduce by 3 U if mean aFPG [10] » (l. 274) | **−3 U** (concordant entre les deux occurrences) | [6] (Meneghini 2007, essai princeps) |
| ATLAS (Garg 2015) | **BG ≤56 mg/dL (≤3,1 mmol/L)** — seule ligne de toute la table où le seuil est intégralement rendu, et il est concordant entre la table de synthèse et le corps du texte (l. 286) | **« At physician's discretion (no fixed amount) »** — pas de montant chiffré, décision médicale au cas par cas | [7] (Garg 2015, essai princeps) |
| EDITION 3 — Gla-300 (Bolli 2015) | SMPG — **seuil non rendu**, coupé à « SMPG 60– » dans la table de synthèse et à « +3 U if SMPG >5.6 and [13] » dans le corps (l. 296), qui ne donne même pas la branche de réduction | **−3 U** — affirmé seulement dans la table de synthèse | [8] (Bolli 2015, essai princeps) |
| TAKE CONTROL — Gla-300 (Russell-Jones 2019) | SMPG — **seuil non rendu** (« −3 U if SMPG [1][14] », l. 303) | **−3 U** | Référencé **[7]** dans la table de synthèse — **incohérent** : [7] désigne ATLAS/Garg 2015 dans ce même bloc ; la référence princeps de Take Control est en réalité [14] (Russell-Jones 2019), numérotée correctement ailleurs dans le même document |
| SENIOR (Ritzel 2018) | SMPG — **seuil non rendu** (« −3 U if SMPG [1] », l. 312) ; le corps précise seulement que la cible basse est plus haute que les autres essais (90 vs 80 mg/dL) | **−3 U** | Référencé **[7]** dans la table de synthèse — **même incohérence** : [7] = ATLAS/Garg, alors que SENIOR est [15] (Ritzel 2018) ailleurs dans le document |
| Home 2015 (algorithme sensible à l'hypoglycémie) | « Any measurement » — **seuil non rendu**, coupé à « −2 U if any measurement [16] » (l. 323), le texte bascule directement sur la section suivante sans jamais donner la valeur ni un éventuel deuxième palier annoncé par le « ; if » qui suit | **−2 U** ; **une clause supplémentaire est amorcée (« ; if ») puis jamais complétée** — portée inconnue | [9] (Home 2015 — PMID lui-même noté « not retrieved directly » par OE) |

Pour mémoire, la recommandation de l'AACE 2023/2026 (réduction de **10-20 %** si FBG < seuil non rendu)
est mentionnée dans la même réponse (l. 333) mais c'est une **recommandation de guideline** (consensus
d'experts), pas une règle de protocole d'essai — elle ne doit pas être fusionnée avec les lignes du
tableau ci-dessus.

## Ce qui empêche de s'y fier, avant transmission à l'Agent B

1. **Corruption systématique des seuils chiffrés « <X » dans tout le document, pas seulement dans ce
   bloc.** Un `grep` sur l'ensemble du fichier brut (toutes réponses OE confondues) montre le même
   symptôme à répétition : une phrase s'interrompt juste avant la valeur numérique, immédiatement
   suivie d'un ou plusieurs crochets de référence — `if any plasma glucose was [5][4]`,
   `reduce by 3 U if mean aFPG [10]`, `−3 U if SMPG [1][14]`, `−2 U if any measurement [16]`, etc. Les
   deux seuils qui **survivent** intacts dans tout le bloc OE-A2 (ATLAS « ≤56 mg/dL », AT.LANTUS
   Fritsche « >110 mg/dL » côté montée) utilisent tous deux `≤` ou `>` — jamais `<`. C'est cohérent avec
   une hypothèse technique précise : un signe `<` suivi d'un chiffre (`<70`, `<80 mg/dL`...) est
   syntaxiquement indiscernable du début d'une balise HTML, et a très probablement été **avalé par un
   convertisseur HTML→texte** lors de la capture du retour OE. Or c'est *exactly* la forme que prend
   une règle de descente (« si la glycémie est **inférieure à** X ») — ce qui explique pourquoi la
   quasi-totalité des déclencheurs de réduction manquent alors que les déclencheurs de montée (souvent
   en `>`) sont préservés. **Cette table ne peut donc pas servir de source pour les valeurs de seuil** :
   il faut retourner aux publications princeps pour chaque essai, pas retenter la même requête OE.
2. **Incohérence de numérotation des références dans la table de synthèse elle-même.** TAKE CONTROL et
   SENIOR y sont tous deux rattachés à la référence **[7]**, qui désigne ATLAS/Garg 2015 partout
   ailleurs dans le même document (y compris dans la liste numérotée en fin de section, où Take Control
   = [14] et SENIOR = [15]). Une table qui attribue la même référence à trois essais différents ne peut
   pas être recopiée telle quelle : la colonne « référence » doit être reconstruite par nom d'essai, pas
   par le numéro affiché ici.
3. **Sources secondaires citées à la place des publications princeps déjà identifiées dans le même
   bloc.** Pour AT.LANTUS, la règle de −2 U s'appuie sur [3] Barnett 2007 (revue narrative), alors que
   les publications princeps d'AT.LANTUS (Fritsche 2003, Davies 2005, Davies 2007) sont citées avec
   PMID quelques paragraphes plus haut dans la même réponse. Le chiffre de réduction n'est donc pas
   tracé jusqu'à sa source primaire par OE lui-même.
4. **Deux essais où le montant de réduction n'est confirmé qu'à un seul endroit** (table de synthèse
   seule, sans écho dans la description narrative de l'essai) : AT.LANTUS bras Davies et EDITION 3. Pour
   ces deux lignes, on ne sait pas si le chiffre vient réellement du protocole ou d'une généralisation
   d'OE par analogie avec un bras/essai voisin.
5. **Deux essais où OE indique lui-même l'absence de règle chiffrée** (INSIGHT, LANMET — « Cannot be
   grounded »). C'est une information utile en soi (une lacune documentée vaut mieux qu'un chiffre
   halluciné), mais elle ferme la porte à toute réduction — la question qu'elle pose à l'Agent B est
   d'aller vérifier sur la publication princeps que la lacune est réelle, pas de la considérer comme
   acquise sur la seule foi d'OE.
6. **Une clause de dosage coupée en cours de phrase** pour Home 2015 (« −2 U if any measurement [16] »
   suivi de « ; if » qui n'est jamais complété) — portée du deuxième palier annoncé inconnue.
7. **Rappel du précédent explicite du cadrage** (`PROMPTS-OE-passeA.md` l. 6-10) : sur les nœuds H et E,
   la totalité des PMID rendus par OE se sont révélés faux. Rien dans ce bloc ne permet d'exclure la
   même chose ici — chaque PMID/DOI de la table ci-dessus (y compris ceux qui semblent complets, comme
   ATLAS [7]/Garg 2015 PMID 25297660) reste à vérifier contre la source primaire par l'Agent B, sans
   exception liée à l'apparente complétude du texte autour.
8. **Recommandation AACE (10-20 %) elle-même tronquée** (« reduce by 10–20% for FBG [17][18] ») — même
   symptôme que le point 1, et de toute façon un niveau de preuve différent (consensus, pas essai) à ne
   pas mélanger aux lignes du tableau.

## Ce qui peut être transmis à l'Agent B en l'état, avec sa réserve

- La ligne **ATLAS** (seuil ≤56 mg/dL, réduction laissée à discrétion médicale, pas de montant fixe) est
  la seule dont le texte OE est complet et interne cohérent (table de synthèse et corps de texte
  concordants) — elle reste à vérifier sur la source primaire (Garg 2015) comme les autres, mais sans le
  problème de troncature qui affecte les dix autres lignes.
- Les deux lacunes **INSIGHT** et **LANMET** (« cannot be grounded ») sont des constats, pas des
  chiffres à contredire — à confirmer sur pièce plutôt qu'à contester.
- Toutes les autres lignes (Treat-to-Target, AT.LANTUS ×2, PREDICTIVE 303, EDITION 3, Take Control,
  SENIOR, Home 2015) portent un **montant de réduction** apparemment stable d'une occurrence à l'autre
  du texte, mais **aucun déclencheur chiffré exploitable** : l'Agent B ne pourra pas les confronter à la
  source primaire sur la base de ce retour seul et devra rouvrir directement les publications listées
  dans `epreuve/entrees/PROMPTS-OE-passeA.md` (PMID donnés en Partie 1 du même bloc OE pour AT.LANTUS ;
  PMID propres à chaque essai listés dans la table de synthèse pour les autres).

## Suite proposée

Ce document n'est qu'une première lecture orchestrateur, pas le rapport d'un agent. Avant de lancer
`contradicteur-preuve` (étape 4 du circuit), il resterait à :
1. faire qualifier formellement ce retour OE (étape 3 du circuit — fiche `OE-<sujet>.md`, statut
   complet/incomplet/précision demandée) si ce n'est pas déjà fait par ailleurs ;
2. signaler au référent le problème de troncature du point 1 ci-dessus, qui touche selon toute
   vraisemblance l'ensemble des 5 réponses du brut (OE-A1 à OE-A5), pas seulement OE-A2 — cela dépasse
   le périmètre de cette fiche mais conditionne la fiabilité de tout le débroussaillage de la passe A.
