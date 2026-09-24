# Contradiction — seuil DFG sulfamides / répaglinide en IRC (DT2)

## Provenance
- Agent : contradicteur-preuve (B) — consignes : `.claude/agents/contradicteur-preuve.md`, dernier commit : non transmise (pas de dépôt git dans cet export — constat explicite du circuit)
- Modèle : sonnet (en-tête de l'agent)
- Date : 2026-09-24
- Mode : Décision
- Outils disponibles : `Read`, `Grep`, `Glob`, `WebFetch`, `WebSearch`, `Write` (natifs). **`Bash` n'est
  pas exposé dans cette session** malgré la consigne de n'utiliser que `identite.mjs` et
  `verifier-registre.mjs` par ce biais — tenté (lecture du script confirmée possible via `Read`,
  mais aucune fonction d'exécution shell disponible) puis abandonné, conformément à la règle « un
  outil absent n'est jamais appelé » (`acces-identite.md` § 1). **Constat identique à celui d'A**
  dans son propre rapport (même session type). Aucun connecteur MCP biomédical (PubMed,
  ClinicalTrials.gov, Consensus) exposé comme fonction appelable ; les instructions système
  mentionnant des serveurs MCP (Docs, Clinical Trials, Consensus, Vercel) ne correspondent à aucune
  fonction listée dans mes outils — non utilisés.
- Accès obtenus :
  - `docs/decision/sources/SFD 2025.pdf` — **texte intégral accessible**, voie : `Read` sans le
    paramètre `pages` (33 pages rendues en une passe, y compris les en-têtes de lignes/colonnes de
    la Figure 3 p. 645, mais pas la couleur de ses cellules — même limite que celle notée par A).
  - `docs/decision/sources/prescrire-dt2.md` — texte intégral accessible, voie : `Grep` ciblé
    (`sulfamide|glinide|répaglinide|repaglinide|rénal|DFG|glibenclamide|gliclazide|glimépiride`,
    insensible à la casse, contexte ±2 lignes).
  - RCP ANSM glibenclamide (`R0296317`) et répaglinide (`R0309526`) — **résumé accessible** (voie :
    `WebFetch`, invocation indépendante de celle d'A, prompt différent, à seule fin de recoupement).
  - Web ouvert (`WebSearch`) — passe d'omission uniquement, avant lecture d'A (voir § Attendus) ;
    aucune de ces sources tierces n'est traitée comme primaire.
- Accès bloqués : néant de nouveau ; les limites déjà notées par A (Figure 3 en couleurs, RCP en
  `résumé accessible` faute d'accès HTML brut) sont confirmées, pas levées, par cette relecture.
- Rapport d'A, registre, journal et retour OE ouverts : **après** la clôture de la section
  « Attendus » ci-dessous (ordre respecté).

---

## Attendus (écrits avant toute lecture du rapport d'A, du registre, du journal ou du retour OE)

### SQ1 — Seuil DFG/DFGe de contre-indication des sulfamides selon la SFD 2025

**Critères de jugement attendus**
- Critère dur / sécurité (prioritaire) : risque d'hypoglycémie sévère et prolongée par accumulation
  du principe actif ou de ses métabolites actifs en cas d'IRC.
- Critère de substitution justifiant le seuil : données pharmacocinétiques — voie d'élimination
  (rénale vs hépatique), présence ou non de métabolites actifs, demi-vie allongée en IRC.

**Chiffres attendus et où ils devraient se trouver**
- Un ou plusieurs seuils de DFG/DFGe en mL/min/1,73 m², vraisemblablement présentés dans un tableau
  récapitulatif par classe ou par molécule antidiabétique selon le stade d'IRC (format habituel des
  documents SFD/HAS sur l'adaptation des traitements en IRC).
- Hypothèse concurrente A : un seuil global unique pour « les sulfamides » (ex. CI en dessous de
  30 mL/min/1,73 m²) sans détail par molécule.
- Hypothèse concurrente B : un seuil différencié — glibenclamide (et éventuellement glimépiride)
  proscrit plus précocement (métabolites actifs éliminés par le rein) vs gliclazide utilisable plus
  longtemps avec prudence avant CI à un palier inférieur.

**Réserves attendues**
1. Distinction **DFGe** (formule CKD-EPI, utilisée par la SFD et KDIGO) vs **clairance de la
   créatinine** (formule de Cockcroft-Gault, CrCl) — encore présente dans certaines RCP françaises
   anciennes. Un chiffre « CrCl < 30 » et un chiffre « DFGe < 30 » ne désignent pas rigoureusement
   la même population (écart notable chez le sujet âgé ou de poids extrême). À vérifier : quelle
   grandeur la SFD 2025 emploie réellement.
2. Distinction **contre-indication formelle** vs **prudence / à éviter / non recommandé** — la SFD
   pourrait graduer par palier (prudence à un seuil, CI à un seuil inférieur) plutôt que poser un
   seuil binaire unique.
3. Le **glibenclamide** a une réputation pharmacologique de sulfamide à proscrire précocement du
   fait de métabolites actifs à élimination rénale ; si la SFD traite « les sulfamides » en bloc
   sans le distinguer, c'est un point à signaler explicitement (spécificité par molécule attendue
   par le cadrage lui-même).
4. Le seuil pourrait être énoncé par **stade IRC KDIGO** (stade 4 = DFG 15-29, stade 5 < 15) plutôt
   qu'en valeur continue, ou par les deux à la fois.
5. Risque de confusion entre une **position propre à la SFD** et un tableau que la SFD reprendrait
   d'une autre source (RCP, KDIGO) sans le signaler comme sa position autonome — à distinguer dans
   la lecture du PDF (qui cite qui).

**Études/sources attendues**
- Ce n'est pas une question d'essai contrôlé : la SFD s'appuie normalement sur les RCP/AMM et sur
  des données pharmacocinétiques, pas sur un essai d'issues cliniques. Aucun essai princeps n'est
  donc attendu comme fondement du seuil.
- Guidelines de recoupement attendues pour SQ3 seulement (non décisive) : KDIGO Diabetes in CKD,
  RCP françaises des molécules citées.

### SQ2 — Répaglinide utilisable en IRC terminale selon la SFD 2025 ?

**Critères de jugement attendus**
- Argument pharmacocinétique central attendu : le répaglinide est un glinide à métabolisme
  hépatique majoritaire (CYP2C8) et élimination biliaire, ce qui le distingue des sulfamides à
  élimination rénale — c'est l'argument attendu pour justifier une utilisation possible même en IRC
  terminale/dialyse.

**Chiffres attendus et où ils devraient se trouver**
- Pas nécessairement un seuil de DFG pour le répaglinide, puisque le rationnel pharmacologique est
  justement qu'il n'est pas éliminé par le rein — j'attends soit « utilisable sans seuil de DFG,
  prudence/titration », soit une mention spécifique de la dialyse (avant/après séance), soit un
  ajustement de dose (ex. dose initiale réduite).
- Une valeur numérique alternative est possible si la SFD cite une donnée pharmacocinétique
  publiée (ex. exposition multipliée en IRC sévère) — à distinguer d'un seuil d'usage.

**Réserves attendues**
1. Distinguer **« utilisable en IRC terminale »** de **« utilisable en dialyse »** : deux notions
   proches mais non identiques (une IRC terminale peut être non dialysée).
2. La SFD pourrait rester prudente ou ne pas trancher explicitement, et renvoyer au RCP du
   répaglinide plutôt que de donner sa propre position — à vérifier que le rapport d'A ne prête pas
   à la SFD une affirmation qui vient en réalité du RCP.
3. Peu de données en dialyse pour le répaglinide dans la littérature généraliste (souvent signalé
   comme littérature limitée) — si la SFD affirme une utilisabilité sans réserve, vérifier qu'elle
   ne dépasse pas ce que la littérature pharmacocinétique permet réellement d'affirmer.

### Passe d'omission (N6) — avant lecture d'A, budget : quelques requêtes web par sous-question

Recherche courte, sur le web ouvert (aucun outil MCP de recherche biomédicale exposé dans cette
session — seul WebSearch natif disponible), à seule fin de repérer des pistes candidates ; aucune
de ces sources web tierces n'est traitée comme primaire, et aucune n'a valeur de vérification pour
la SFD elle-même (seul le PDF local fait foi pour SQ1/SQ2).

| Voie | Requête, date | Trouvé | Effet attendu sur la conclusion |
| --- | --- | --- | --- |
| Résultat de sens contraire / recoupement | « SFD 2025 sulfamides hypoglycémiants insuffisance rénale DFG contre-indication seuil », 2026-09-24 | Résumé web (non primaire, sourcé sfdiabete.org sans passage cité) : « contre-indiqués en cas d'IRC sévère ou terminale » — sans chiffre précis extrait. | Candidat à vérifier contre le PDF : la formulation qualitative (« IRC sévère/terminale ») pourrait masquer un seuil chiffré réellement présent dans le document. |
| Recoupement pharmaco | « clairance sulfamides glibenclamide gliclazide glimépiride seuil 30/45/60 contre-indication RCP », 2026-09-24 | Page tierce (pharmacomedicale.org, relais non primaire) : gliclazide et glipizide « n'ont pas de métabolites actifs éliminés par le rein », préférés au glibenclamide/glimépiride en IRC modérée ; CI formelle en IRC sévère. | Candidat de spécificité par molécule (glibenclamide/glimépiride vs gliclazide) à confronter au texte SFD — si A a traité les sulfamides en bloc, c'est une omission possible. |
| Résultat de sens contraire | « Prescrire sulfamides hypoglycémiants insuffisance rénale répaglinide critique », 2026-09-24 | Page tierce (pharmacomedicale.org à nouveau) : répaglinide « utilisable en IRC sévère 15-30 mL/min » (chiffre non confirmé primaire), « non contre-indiqué même en IRC sévère ». | Chiffre « 15-30 mL/min » à traiter comme non vérifié tant qu'il n'est pas retrouvé dans le PDF SFD ou le RCP Novonorm® — ne pas le recopier sans passage source. |

Aucune de ces trois recherches ne constitue une lecture de la SFD elle-même ; elles ne servent qu'à
détecter des angles qu'A pourrait avoir manqués. Effet réel sur la conclusion établi ci-dessous après
lecture directe du PDF et confrontation au rapport d'A.

*(Fin de la section Attendus, close avant toute ouverture du rapport d'A, du registre, du journal ou
du retour OE — lecture indépendante ensuite du PDF SFD 2025 en texte intégral, puis des pièces
d'A.)*

---

## Lecture indépendante du PDF SFD 2025 (avant ouverture du rapport d'A)

Lecture intégrale des 33 pages (`Read` sans `pages`, comme A). Passages retenus pour SQ1/SQ2,
localisés avant toute confrontation :

- p. 633, Tableau I, notes 1-2 : « Les sulfamides hypoglycémiants sont contre-indiqués en cas d'IRC
  sévère ou terminale » ; stade 4 = DFG 15-29, stade 5 = DFG < 15.
- p. 635, Avis n° 6 (avantages/inconvénients, colonne SU) : « risque d'hypoglycémie (en particulier
  avec le glibenclamide, **qu'il est préférable de ne plus utiliser**) ».
- p. 643-644, Avis n° 12 et 12 bis : IRC modérée (DFG 30-59) = précaution/adaptation posologique,
  pas de CI ; IRC sévère (15-29) et terminale (<15) = SU contre-indiqués, seuls insuline,
  répaglinide, vildagliptine 50 mg/j, sitagliptine 25 mg/j (et certains iSGLT2/AR GLP-1) restent
  utilisables ; répaglinide cité aux deux stades « avec un risque d'hypoglycémies », sans dose
  chiffrée propre.
- p. 645, Figure 3 (tableau IRC) : colonnes DFG 60-89 / 30-44 et 45-59 / 15-29 / **« < 15 ou
  dialyse »** (IRC terminale) ; lignes molécules incluant **Glimépiride** et **Gliclazide**
  séparément, **Répaglinide**, mais **aucune ligne « Glibenclamide »**. Couleurs de cellule non
  restituées en texte par l'outil de lecture (même limite qu'A).

Ces passages répondent directement à mes Attendus : le seuil DFG < 30 est confirmé (attendu),
l'unité est bien le **DFG** (pas la clairance de la créatinine — réserve 1 tranchée pour la SFD
elle-même), et la SFD **ne donne pas de seuil chiffré différent par molécule** — mais elle fait une
**distinction qualitative claire** pour le glibenclamide (réserve 3, partiellement confirmée : pas
de seuil DFG propre, mais bien une mise à l'écart affirmée, indépendante du stade rénal).

---

## Cherché, non trouvé par A

| Voie | Requête ou source, date | Trouvé | Présent chez A ? | Chez OE ? | Effet sur la conclusion |
| --- | --- | --- | --- | --- | --- |
| Lecture complète du texte prose (Avis n° 6, p. 635) | Relecture systématique des 33 pages, 2026-09-24 | « [glibenclamide] qu'il est préférable de ne plus utiliser » — mise à l'écart qualitative, indépendante du DFG | Non — le rapport d'A (A3, table ligne 2) conclut seulement « le texte prose ne distingue pas de seuil de DFG propre à chaque sulfamide », sans mentionner cette phrase | Non (hors périmètre OE pour la SFD) | Nuance le verdict SQ1 : absence de seuil *chiffré* par molécule confirmée, mais absence de distinction *qualitative* infirmée — voir Finding 1 |
| Relecture des en-têtes de Figure 3 (p. 645) | Relecture systématique, 2026-09-24 | Lignes « Glimépiride » et « Gliclazide » séparées, **aucune ligne « Glibenclamide »** | Partiellement — A note que « les en-têtes de lignes/colonnes » ont été extraits (§ Méthode), mais ne rapporte ni la liste des lignes ni l'absence de glibenclamide dans le corps du rapport ou le registre | — | Corrobore Finding 1 : la structure même du tableau pratique de la SFD exclut le glibenclamide, cohérent avec Avis n° 6 |
| Section 1 du retour OE archivé (tableau comparatif des seuils eGFR par guideline/molécule) | Relecture intégrale du retour archivé, 2026-09-24 | Tableau riche (KDIGO, ADA, Endocrine Society, KDOQI, AHA/HFSA, NICE, European Consensus Panel) avec seuils différenciés par molécule (ex. Endocrine Society : glimépiride CI < eGFR 30, glyburide à éviter < eGFR 60) | Non — la table maîtresse d'A (ligne 9) ne reprend que la section répaglinide/ESRD du retour OE (« Drug Label »), pas cette section 1 sur les seuils SU | Oui (déjà dans le retour archivé, section 1) | Finding 3 (SQ3, non décisive) : contraste utile entre seuils internationaux différenciés par molécule et seuil SFD non différencié, que le cadrage demandait explicitement de faire ressortir |

---

## Findings

### Finding 1 — HAUTE — omission (lecture indépendante de B, avant ouverture du rapport d'A)

**SQ1.** La SFD 2025 ne donne pas de seuil de DFG chiffré différent par molécule (A3 est correct sur
ce point précis), mais elle fait une **distinction qualitative claire et non ambiguë** pour le
glibenclamide, absente du rapport et du registre d'A :

> « pour les SU : longue expérience d'utilisation ; bonne efficacité anti-hyperglycémiante ; risque
> d'hypoglycémie (en particulier avec le glibenclamide, **qu'il est préférable de ne plus
> utiliser**) nécessitant une ASG […] » — SFD 2025, p. 635, Avis n° 6.

Cette mise à l'écart est corroborée structurellement par la Figure 3 (p. 645, tableau pratique de
gestion des traitements en IRC) : les lignes **Glimépiride** et **Gliclazide** y figurent
séparément, mais **aucune ligne « Glibenclamide »** n'existe dans ce tableau — cohérent avec une
molécule que la SFD recommande de ne plus utiliser *du tout*, plutôt que de seuiller par palier de
DFG.

Le cadrage du chantier nommait explicitement ce piège (« spécificité par molécule
[glibenclamide/glimépiride/glibenclamide] vs sulfamides en bloc ») et la sous-question SQ1 demandait
« en général, ou par molécule si la SFD distingue ». Le rapport d'A répond « la SFD ne distingue
pas », ce qui est vrai au sens strict (pas de chiffre différent), mais laisse croire par omission
que les trois sulfamides sont traités à parfaite égalité — ce que le document dément explicitement
ailleurs (Avis n° 6) et implicitement dans son tableau pratique (Figure 3).

**Origine** : omission, trouvée par lecture indépendante de B (avant ouverture du rapport d'A —
consignée dans la section Attendus/lecture indépendante ci-dessus, réserve 3).
**Passage source** : SFD 2025, p. 635 (Avis n° 6, colonne SU) et p. 645 (Figure 3, en-têtes de
lignes).

### Finding 2 — MOYENNE — A seule (conflation de grandeur)

**SQ1 (recoupement RCP).** Le registre d'A (ligne A5) rapporte la citation de la RCP du
glibenclamide — « L'insuffisance rénale n'affecte pas son élimination aussi longtemps que la
**clairance de la créatinine** reste supérieure à 30 ml/min » (RCP DAONIL, section 5.2) — et note en
colonne Contradiction : « Concorde avec A1 (SFD, DFG < 30) — pas une contradiction ».

Cette RCP emploie la **clairance de la créatinine** (grandeur non normalisée à la surface
corporelle, historiquement calculée par la formule de Cockcroft-Gault), tandis que la SFD 2025
emploie systématiquement le **DFG** exprimé en mL/min/**1,73 m²** (grandeur normalisée, cohérente
avec une estimation de type CKD-EPI). Ce sont deux mesures apparentées mais **non strictement
interchangeables** : chez un sujet âgé ou de poids extrême, un même patient peut avoir une clairance
de la créatinine et un DFGe sensiblement différents. Traiter les deux seuils comme « concordants »
sans le signaler est exactement le piège nommé dans le cadrage de ce chantier
(« confusion DFG/DFGe vs clairance de la créatinine (CrCl) »).

Ceci ne renverse pas la conclusion d'A (les deux seuils sont proches, ~30, et pointent dans le même
sens clinique), mais la présentation comme simple concordance masque une hétérogénéité de mesure
qui mériterait d'être signalée dans le nœud, en particulier si le futur outil de décision demande au
clinicien un DFG et non une clairance de la créatinine.

**Vérification indépendante par B** : citation de la RCP glibenclamide (section 5.2) recoupée par
une invocation `WebFetch` indépendante de celle d'A (prompt différent, 2026-09-24) : texte identique
au mot près (« L'insuffisance rénale n'affecte pas son élimination aussi longtemps que la clairance
de la créatinine reste supérieure à 30 ml/min. »). Statut d'accès inchangé (`résumé accessible` —
`WebFetch` passe toujours par un résumé intermédiaire, cf. `acces-identite.md` § 3), mais la
concordance entre deux invocations indépendantes réduit le risque d'altération du chiffre par le
modèle intermédiaire.

**Origine** : A seule (citation exacte, mais absence de signalement de la conflation de grandeur).
**Passage source** : RCP ANSM DAONIL 5 mg (glibenclamide), section 5.2, et SFD 2025 p. 633 (Tableau
I, notes 1-2) pour le DFG.

### Finding 3 — BASSE — omission, SQ3 (non décisive)

La table maîtresse d'A (ligne 9) ne reprend, du retour OpenEvidence archivé, que la section
« Drug Label » (répaglinide/FDA). Elle laisse de côté la **section 1** du même retour, qui compare
les seuils eGFR par guideline **et par molécule** (KDIGO 2022, ADA 2026, Endocrine Society 2019,
KDOQI 2012, AHA/HFSA 2019, NICE NG28, European Consensus Panel 2020) et donne des chiffres
différenciés — par exemple, selon l'Endocrine Society citée par OE : glimépiride contre-indiqué sous
eGFR 30, glyburide à éviter sous eGFR 60. Cette section aurait directement servi le contraste que le
cadrage demande pour SQ3 (« recouper/contraster avec la position SFD ») : les guidelines
internationales rapportées par OE **différencient** par molécule avec des seuils chiffrés propres,
alors que la SFD pose un seuil unique non différencié (DFG < 30 pour « les sulfamides »). C'est un
contraste utile à faire remonter dans l'argumentaire du nœud, absent du rapport d'A.

**Origine** : omission (A seule — la donnée était disponible dans une pièce qu'A avait pourtant
ouverte et citée pour une autre section du même document).
**Passage source** : retour OE archivé, section « 1. Guideline-Specific eGFR Thresholds for
Sulfonylureas in CKD » et « Summary for Clinical Practice » (glibenclamide/glyburide : éviter sous
eGFR 60 ; glimépiride : CI sous eGFR 30, Endocrine Society 2019).

---

## Confirmations obtenues

- **A1, A2** (SQ1 — seuil DFG < 30 pour la contre-indication des sulfamides, définition des stades
  4/5, exclusion implicite des SU de la liste des molécules utilisables en IRC sévère) : confirmées
  par ma propre lecture intégrale et indépendante du PDF, mêmes pages (p. 633 note 2 ; p. 643-644,
  Avis n° 12/12 bis).
- **A6, A7** (SQ2 — répaglinide listé comme utilisable en IRC sévère et terminale, avec risque
  d'hypoglycémies signalé mais sans dose chiffrée propre) : confirmées par lecture directe du même
  passage (p. 643-644, Avis n° 12 bis).
- **Précision supplémentaire sur A6** (« y compris dialyse ») : la formulation d'A dans la colonne
  Population de sa table maîtresse (« DFG < 15, y compris dialyse ») n'était pas explicitement
  ancrée à une citation précise dans son propre rapport. Je la confirme et la source plus
  précisément : Figure 3 (p. 645), en-tête de colonne **« < 15 ou dialyse (IRC terminale) »** —
  la SFD traite explicitement les deux situations (DFG < 15 non dialysé, et dialyse) comme une seule
  catégorie pour le choix des traitements.
- **A5, A9** (citations RCP glibenclamide 5.2 et répaglinide 5.2) : confirmées verbatim par une
  invocation `WebFetch` indépendante (voir Finding 2 pour le détail et la réserve sur le statut
  d'accès).
- **A11** (absence de seuil DFG chiffré pour les sulfamides dans `prescrire-dt2.md`) : confirmée par
  ma propre recherche `Grep` directe sur le fichier (motif large, insensible à la casse). Constat :
  seul un seuil DFG < 30 chiffré existe dans ce fichier, et il concerne la **metformine** (l. 27,
  128), pas les sulfamides ; le glibenclamide n'est mentionné qu'avec une réserve qualitative
  (« à écarter si risque d'hypoglycémie grand (âgé, IR) », l. 38-39) et les SU en général avec
  « gare aux hypoglycémies ! » (l. 91) — jamais de chiffre.
- **Caractérisation du retour OE comme « complet »** (note de l'orchestrateur en tête du fichier
  `OE-seuil-dfg-su.md`, à confirmer par B) : confirmée par ma lecture intégrale de l'extrait archivé
  — chaque section se conclut effectivement par une synthèse tranchée (« Summary for Clinical
  Practice ») suivie d'une question de relance optionnelle (« Would you like to explore… »), qui est
  bien une offre d'approfondissement et non une réponse conditionnée à un contexte manquant.
- **Absence de couverture SFD par OE** : confirmée par lecture directe des deux passages cités par
  A/l'orchestrateur (« No specific SFD/HAS guideline text on sulfonylurea eGFR thresholds… » et
  « No specific French guideline text on repaglinide in ESRD… ») — le retour OE ne pouvait
  effectivement pas répondre à SQ1/SQ2, seulement les recouper indirectement via les guidelines
  internationales et RCP EMA/FDA (usage correct qu'en a fait A, limité à SQ3).

## Objections retirées

- **Mon attendu SQ1** envisageait un seuil DFG **chiffré** différent par molécule (ex. glibenclamide
  proscrit à un DFG plus élevé que le gliclazide). **Retiré** : la SFD 2025 ne donne aucun seuil DFG
  chiffré différencié par molécule — sa distinction pour le glibenclamide est qualitative
  (« à ne plus utiliser »), pas un seuil rénal propre. Passage qui fait tomber l'objection : p. 635,
  Avis n° 6, et absence confirmée dans l'ensemble du texte prose (Avis n° 3, 12, 12 bis).
- **Mon attendu SQ2** envisageait une distinction explicite, dans la position SFD, entre « IRC
  terminale non dialysée » et « dialysée ». **Retiré** : la SFD regroupe les deux dans une seule
  catégorie de traitement (Figure 3, en-tête de colonne « < 15 ou dialyse »), sans règle
  différenciée entre les deux situations pour le choix des molécules. Passage : p. 645, Figure 3.
- **Doute initial sur la fiabilité des citations RCP d'A** (obtenues par A via un résumé `WebFetch`,
  non relu verbatim par A elle-même sur la page brute). **Largement retiré** pour les deux passages
  testés par B (glibenclamide 5.2, répaglinide 5.2) : une invocation indépendante, avec un prompt
  différent, rend un texte identique au mot près à celui rapporté par A. Le statut d'accès reste
  formellement `résumé accessible` (l'outil passe toujours par un résumé intermédiaire), mais le
  risque d'altération du chiffre par ce résumé est réduit par cette double confirmation
  indépendante. Les trois autres citations RCP d'A (gliclazide 4.3, glimépiride 4.3/4.4,
  répaglinide 4.2/4.3) n'ont pas été retestées par B faute de temps — restent `non vérifiée` comme A
  les avait elle-même classées, ce qui est le bon statut par prudence.

## Décompte

Par sévérité : HAUTE = 1 ; MOYENNE = 1 ; BASSE = 1.
Par origine : omission (trouvée par B, lecture indépendante) = 1 (Finding 1) ; A seule = 2
(Findings 2 et 3) ; A et OE = 0 ; OE seule = 0 ; source elle-même = 0 (aucun défaut de la SFD 2025
constaté, seulement des défauts de restitution/complétude côté A) ; non vérifiable = 0 (les deux
citations RCP retestées ont pu être recoupées).

## Verdict par sous-question

**SQ1 — Confirmé pour l'essentiel, à compléter.** Le seuil central rapporté par A (DFG < 30
mL/min/1,73 m² pour la contre-indication des sulfamides, stades IRC 4-5, source SFD 2025 en texte
intégral) est exact et directement vérifié par B sur le passage source (p. 633, 643-644). La réponse
d'A à la nuance « par molécule » demandée par la sous-question est correcte au sens strict (pas de
chiffre différencié) mais **incomplète** : elle omet la mise à l'écart qualitative explicite du
glibenclamide (Finding 1), corroborée par la structure même du tableau pratique de la SFD (aucune
ligne glibenclamide en Figure 3). Un nœud construit sur le seul rapport d'A risquerait de traiter les
trois sulfamides à égalité, contrairement à la position réelle de la SFD.

**SQ2 — Confirmé.** Le répaglinide est explicitement listé par la SFD 2025 comme utilisable en IRC
sévère et terminale, dialyse comprise (Figure 3, en-tête de colonne « < 15 ou dialyse » — précision
apportée par B, Finding absent mais confirmation renforcée), avec un risque d'hypoglycémies signalé
mais sans dose ni protocole de titration chiffrés par la SFD elle-même. Le niveau de preuve est un
avis d'experts, pas un essai dédié — cohérent avec le préambule de la Partie 6 du document lui-même
(« relèvent de l'avis d'experts »). Le rapport d'A est fiable sur ce point central ; aucune correction
n'est nécessaire au-delà de la précision de sourcing ci-dessus.

**SQ3 (non décisive) — Globalement cohérent, sous-exploité.** Le recoupement RCP d'A est cohérent
avec SQ1/SQ2 et partiellement revérifié par B (2 citations sur 5 confirmées verbatim par une voie
indépendante). Le retour OE archivé contient toutefois une comparaison internationale par molécule
(section 1) qu'A n'a pas exploitée dans sa table maîtresse (Finding 3), alors qu'elle éclairerait
directement le contraste demandé par le cadrage entre seuils internationaux différenciés par
molécule et seuil SFD non différencié.

## Proposition de libellé (nœud `prescription`, critère DFG)

**Sulfamides hypoglycémiants (gliclazide, glimépiride)** : contre-indiqués si DFG < 30
mL/min/1,73 m² (IRC sévère ou terminale, stades 4-5 KDIGO) ; prudence et adaptation de posologie en
cas de DFG entre 30 et 59 mL/min/1,73 m² (source : SFD 2025, avis d'experts, pas d'essai dédié à ce
seuil). **Le glibenclamide n'est pas recommandé par la SFD, quel que soit le stade rénal** (risque
d'hypoglycémie particulièrement élevé, métabolites actifs) et n'apparaît plus dans son tableau
pratique de gestion des traitements en IRC — à traiter comme une molécule à proscrire en pratique,
pas seulement à seuiller par palier de DFG.

**Répaglinide** : reste utilisable en IRC sévère et terminale, y compris en dialyse, avec un risque
d'hypoglycémies signalé mais sans dose ni protocole de titration chiffrés par la SFD elle-même
(source : SFD 2025, avis d'experts). Pour la conduite pratique (adaptation de dose), se référer à la
RCP (Novonorm®) : prudence à l'adaptation des doses, silence de la RCP en deçà d'une clairance de la
créatinine de 20 mL/min (donnée pharmacocinétique, pas un seuil d'usage SFD).

Cette proposition reste à valider par le référent (Décision — étape 6 de `00-global.md`) ; elle n'est
qu'une pièce du dossier.
