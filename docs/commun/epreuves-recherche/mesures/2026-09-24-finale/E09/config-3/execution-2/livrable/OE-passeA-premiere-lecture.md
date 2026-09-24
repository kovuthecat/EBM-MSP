# OE-A2 — Première lecture du retour OpenEvidence (titration de la basale, descente)

## Provenance

- Bloc lu : **OE-A2** — « Titration de la basale sur glycémie à jeun capillaire : monter et descendre »
  (prompt dans `epreuve/entrees/PROMPTS-OE-passeA.md`, question 1 de ce bloc : « le down-titration rule »).
- Retour lu : `epreuve/entrees/OE-passeA-brut-2026-07-29.txt` (archive brute fournie par le référent,
  non re-formatée), lignes ~205–398 pour le corps de la réponse OE-A2 et ligne 329–335 pour la table
  de synthèse « Question 1 » qu'OE a lui-même produite.
- **Aucune requête OpenEvidence n'a été passée pour ce travail** — lecture seule du texte déjà archivé,
  conformément à la consigne.
- Cette note est une **première lecture d'orchestrateur**, pas le rapport de l'Agent B. Elle sert à
  cadrer ce que B devra vérifier ; elle ne préjuge d'aucun verdict et ne doit pas être citée comme
  preuve dans `content/**` (`PROMPTS-OE-passeA.md`, « Après OE — ce qui se passe », points 1–3).
- Rappel du précédent le plus coûteux, écrit noir sur blanc dans le prompt lui-même : sur les nœuds H
  et E, **la totalité des PMID rendus par OE étaient faux**. OE n'a été mandaté ici que pour le
  périmètre et les essais à ne pas manquer, jamais pour les chiffres — cette réserve s'applique à
  tout ce qui suit.

---

## Table des règles de réduction de dose (telles que rendues par OE, non vérifiées)

| Essai | Déclencheur de la réduction (tel que rendu) | Montant de la réduction | Référence OE | Fiabilité de l'extraction |
|---|---|---|---|---|
| **Treat-to-Target** (Riddle 2003) | Texte narratif tronqué : « no dose increase was made if any plasma glucose was **[coupé]** » — ne dit pas explicitly qu'il s'agit d'une réduction (pourrait être un simple gel de dose). Table de synthèse d'OE (« Question 1 ») donne pourtant un déclencheur générique **« Any PG »** | **Fixed units (−2 à −4 U)**, selon la table de synthèse | [5][4] puis [1][2] (table) | ⚠️ Basse — le mécanisme (gel vs réduction réelle) et le seuil numérique sont absents du texte ; la table de synthèse et le paragraphe narratif ne se recoupent pas |
| **AT.LANTUS — bras « Fritsche » (physician-managed)** | Table à seuils imbriquée et effondrée ; la ligne du seuil déclenchant −2 U n'apparaît plus comme telle — seule la ligne « 90–110 mg/dL : pas de changement » est suivie immédiatement de « **−2 U** » sans borne indiquée. Seuil **< 90 mg/dL (< 5,0 mmol/L) déduit par symétrie du reste du tableau**, non confirmé textuellement | **−2 U** | [1] (paragraphe) / [3] (table Question 1) | ⚠️ Basse — seuil inféré, pas lu |
| **AT.LANTUS — bras « Davies » (patient-managed / auto-titration)** | Le paragraphe ne décrit **que la montée** (+2 U/3 j si FBG > 110 mg/dL) et coupe sur « in the absence of BG **[coupé]** » sans jamais énoncer de règle de descente | **−2 U** — chiffre qui n'apparaît **que** dans la table de synthèse « Question 1 », introuvable dans le corps de la réponse pour ce bras précis | [3] (table Question 1 seulement) | 🔴 Très basse — affirmation présente uniquement dans le tableau récapitulatif, absente du développement correspondant ; possible confusion avec le bras Fritsche |
| **INSIGHT** (Gerstein 2006) | — | **Non applicable** : OE indique explicitement que la publication princeps **ne publie pas** de règle de réduction à pas fixe. « Cannot be grounded » | [7] / [4] (table) | ✅ Complet et cohérent (absence documentée, pas une lacune de lecture) |
| **LANMET** (Yki-Järvinen 2006) | — | **Non applicable**, même constat qu'INSIGHT : « cannot be grounded in the primary LANMET publication » | [9] / [5] (table) | ✅ Complet et cohérent |
| **PREDICTIVE 303** (Meneghini 2007) | Table effondrée : « >110 mg/dL : +3 U » puis « 80–110 mg/dL : pas de changement » puis directement « **−3 U** » sans seuil affiché. Seuil **< 80 mg/dL (< 4,4 mmol/L) déduit par symétrie**, non confirmé. Le paragraphe narratif annonce pourtant une règle « explicitly defined » puis coupe avant de donner le chiffre : « reduce by 3 U if mean aFPG **[coupé]** » | **−3 U** | [10] (paragraphe) / [6] (table) | ⚠️ Basse — seuil inféré, le texte se targue d'être « explicite » mais le chiffre manque à l'endroit même où il devrait apparaître |
| **ATLAS** (Garg 2015) | **BG ≤ 56 mg/dL (≤ 3,1 mmol/L)** | **À la discrétion du médecin, aucun montant fixe précisé dans le protocole** | [1] (paragraphe et table) | ✅ Seul essai dont le déclencheur ET l'absence de montant fixe sont énoncés de façon complète et cohérente entre paragraphe et table |
| **EDITION 3** (Bolli 2015, Gla-300) | Coupé avant tout seuil de descente : « SMPG 60– **[coupé]** » | **−3 U** (valeur reprise de la table Question 1 uniquement) | [8] (table) | 🔴 Très basse — ni seuil ni contexte, fragment de phrase inexploitable |
| **TAKE CONTROL** (Russell-Jones 2019, Gla-300) | Coupé : « −3 U if SMPG **[coupé]** » | **−3 U** | [1][14] (paragraphe) / [7] (table) | 🔴 Basse — montant présent, seuil totalement absent |
| **SENIOR** (Ritzel 2018, ≥ 65 ans) | Coupé : « −3 U if SMPG **[coupé]** » — la section « Question 3 » (patient âgé) mentionne aussi un « lower down-titration trigger of **[coupé]** » sans jamais donner la valeur | **−3 U** | [1] (paragraphe) / [7] (table) / [15] (Q3) | 🔴 Basse — c'est le seul essai spécifiquement gériatrique du corpus, et c'est justement là que le seuil manque, deux fois de suite |
| **Home et al. 2015** (algorithme « hypo-sensible ») | Coupé, et apparemment tronqué **deux fois** (deux seuils attendus) : « −2 U if any measurement **[coupé]** » puis la table Question 1 ajoute « ; if **[coupé]** » | **−2 U** (au moins un palier ; un second palier semble exister mais n'est pas récupérable) | [16] (paragraphe) / [9] (table) | 🔴 Très basse |
| **AACE 2022–2026** (non un essai — recommandation) | Rappel hors-essai apporté par OE en synthèse : approche **en pourcentage** plutôt qu'en unités fixes | **Réduire de 10–20 % si FBG [coupé]** | [17][18] | ⚠️ À isoler du tableau ci-dessus : c'est une recommandation d'expert (AACE), pas une règle de protocole d'essai — et le seuil est de nouveau coupé |

---

## Ce qui empêche de s'y fier avant transmission à l'Agent B

1. **Troncature systématique, pas isolée.** Sur les 11 lignes de la table, **8 ont leur valeur de seuil
   numérique coupée en plein milieu de phrase** (Treat-to-Target, AT.LANTUS-Davies, PREDICTIVE 303,
   EDITION 3, TAKE CONTROL, SENIOR ×2, Home 2015, AACE). Le motif est constant : la phrase s'arrête
   juste avant le chiffre attendu, ce qui ressemble à une perte de contenu à la capture (copie
   incomplète de l'écran OE, ou tableau HTML dont les colonnes ont fusionné en texte continu — cf.
   point 2) plutôt qu'à une réponse réellement lacunaire d'OE. **Impossible de trancher entre les deux
   sans rejouer ou consulter l'original.** Tant que ce n'est pas résolu, la moitié du tableau ci-dessus
   n'est pas une donnée manquante « d'OE », c'est une donnée manquante « de cette archive ».
2. **Les tableaux Markdown source sont effondrés.** Plusieurs tableaux à seuils (AT.LANTUS-Fritsche,
   PREDICTIVE 303, Treat-to-Target up-titration) sont rendus comme une seule ligne de texte sans
   séparateurs (`Mean FBGDose changeReferences≥180…+8 U[1]…`), ce qui a fait sauter au moins une
   ligne (celle du seuil de réduction) dans deux tableaux. Les valeurs que j'ai indiquées comme
   « déduites par symétrie » (AT.LANTUS-Fritsche < 90 mg/dL, PREDICTIVE 303 < 80 mg/dL) sont ma
   reconstruction, **pas une lecture** — l'Agent B doit les vérifier sur le protocole publié et ne pas
   les hériter de cette note sans re-source.
3. **Incohérence interne sur l'identité de la publication princeps d'AT.LANTUS**, qui porte
   directement sur la ligne « bras Fritsche » du tableau ci-dessus :
   - Dans le retour OE pour **OE-A1** (même archive, plus haut dans le fichier) : « original : PMID
     **14578243**, *Diabetes Care* 2003, Fritsche et al. ».
   - Dans le retour OE pour **OE-A2** : « PMID **16306275** (primary, *Diabetes Res Clin Pract* 2005),
     Davies et al. 2005 ».
   Même essai, même n (4 961 patients), **deux PMID différents, deux années différentes, deux
   premiers auteurs différents** donnés comme « la » publication princeps selon la question posée à
   OE. Un seul peut être le bon (ou aucun) — l'Agent B doit établir l'identité de la source primaire
   d'AT.LANTUS avant toute chose, indépendamment de la règle de titration elle-même.
4. **Le tableau de synthèse « Question 1 » d'OE contredit ou déborde son propre développement
   narratif** :
   - Pour **AT.LANTUS-Davies**, le tableau affirme « −2 U » alors que le paragraphe correspondant ne
     décrit que la montée et ne mentionne aucune règle de descente pour ce bras — la valeur du
     tableau n'est étayée nulle part ailleurs dans le document.
   - Pour **Treat-to-Target**, le paragraphe suggère un mécanisme de **gel de dose** (« no dose
     increase was made if... ») tandis que le tableau de synthèse le reformule en **réduction
     chiffrée** (« Fixed units, −2 à −4 U »). Un gel et une réduction ne sont pas le même geste
     clinique : c'est exactement la distinction que la Grammaire du nœud (R1, état ≠ intention)
     demande de ne pas confondre, et le retour OE la brouille lui-même entre deux endroits du même
     document.
5. **Seul un essai est exploitable tel quel : ATLAS.** Seuil (BG ≤ 56 mg/dL / ≤ 3,1 mmol/L), montant
   (« à la discrétion du médecin, pas de chiffre fixe ») et référence sont cohérents entre le
   paragraphe et la table. C'est aussi le seul essai du bloc où l'absence de règle chiffrée est
   elle-même l'information utile — encore faut-il que B vérifie le PMID (25297660) contre la source
   avant de le retenir, conformément à la réserve générale sur les PMID d'OE.
6. **INSIGHT et LANMET sont les deux seuls cas où l'absence de règle de descente est présentée comme
   une conclusion complète et non comme une troncature** (« cannot be grounded in the primary
   publication »). Ce sont, avec ATLAS, les trois lignes de la table qu'on peut transmettre à B comme
   des affirmations testables en l'état — les huit autres ne sont pas des affirmations, ce sont des
   trous à combler avant tout jugement de fiabilité.
7. **Aucun PMID de ce bloc n'a été vérifié.** Conformément au motif même de l'étape OE (périmètre et
   essais manqués, jamais les chiffres) et au précédent H/E rappelé dans le prompt, chaque PMID cité
   ci-dessus (dont ceux qui semblent complets, ATLAS y compris) reste à confirmer par B contre la
   source primaire avant d'entrer dans un dossier de preuve.
8. **Ce que le tableau ne couvre pas mais que B devra garder en tête** : la ligne AACE (recommandation
   à 10–20 %, non un essai) montre qu'il existe une position d'expert alternative — en pourcentage —
   à toutes les règles en unités fixes trouvées dans les essais. Le nœud actuel encode des paliers en
   unités fixes (+2 U) ; si B confirme que les essais eux-mêmes utilisent presque tous des paliers en
   unités fixes pour la descente (quand ils en publient une), c'est cohérent avec l'existant, mais
   l'écart avec la recommandation AACE en pourcentage doit être signalé comme un arbitrage à soumettre
   au référent, pas tranché ici.

---

## Recommandation avant transmission à l'Agent B

- Transmettre cette table telle quelle, avec sa colonne « Fiabilité de l'extraction » : B doit traiter
  les huit lignes tronquées comme *à re-sourcer entièrement* (retour au protocole publié de chaque
  essai), pas comme des affirmations à confirmer ou infirmer sur la seule base de ce texte.
- Signaler en priorité à B l'incohérence AT.LANTUS (point 3) : elle doit se résoudre **avant** toute
  lecture de la règle de titration de ce bras, sans quoi B contredirait un PMID qui n'est peut-être
  déjà pas le bon essai.
- Ne pas transmettre à B la valeur « AT.LANTUS-Davies −2 U » comme un fait d'OE à vérifier : elle
  n'est nulle part sourcée dans le développement, seulement dans un tableau récapitulatif qu'OE a
  lui-même généré — c'est un candidat à l'omission pure plutôt qu'à la contradiction.
- Demander si l'archive brute peut être recapturée (copier-coller intégral, ou export) pour les huit
  lignes tronquées avant de lancer B sur ce point précis : une bonne partie du travail de B pourrait
  se réduire à néant si les seuils manquants sont simplement récupérables dans la conversation OE
  d'origine, sans repasser par un essai à interroger de nouveau.
