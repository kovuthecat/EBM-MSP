# Rapport Agent A (extracteur) — Seuil de DFG des sulfamides / répaglinide en IRC (DT2)

## Provenance
- Agent : extracteur-preuve (A) — consignes : `.claude/agents/extracteur-preuve.md`, dernier commit : non transmise (pas de dépôt git dans cet export)
- Modèle : sonnet (en-tête de l'agent)
- Date : 2026-09-24
- Mode : Décision
- Outils disponibles : `Read` (lecture de fichiers locaux, y compris PDF), `Grep`, `Glob`, `WebFetch`, `WebSearch` ; absents : **`Bash` n'est pas exposé dans cette session** — `node .../identite.mjs` et `node .../verifier-registre.mjs` n'ont donc pas pu être exécutés malgré la consigne de les appeler (voir note sous la table maîtresse et en fin de rapport) ; aucun connecteur MCP PubMed/ClinicalTrials/Consensus exposé (conforme au constat du 2026-09-24 de `acces-identite.md` § Anciens usages).
- Accès obtenus :
  - `docs/decision/sources/SFD 2025.pdf` — **texte intégral accessible**, voie : outil `Read` sans le paramètre `pages` (lecture directe du fichier local, 33 pages rendues intégralement en une passe). Voir § Méthode PDF ci-dessous pour la première voie qui a échoué.
  - `docs/decision/sources/prescrire-dt2.md` — texte intégral accessible, voie : `Read` (notes de synthèse déjà en clair).
  - `epreuve/entrees/OE-retour-brut-extrait.md` — texte intégral accessible, voie : `Read` (retour OE archivé, débroussaillage SQ3 uniquement, pas une source).
  - RCP ANSM gliclazide (`R0172430`), glimépiride (`R0431162`), glibenclamide (`R0296317`), répaglinide (`R0309526`) — **résumé accessible** (voie : `WebFetch`, qui convertit la page et la fait résumer par un modèle avant de me la rendre ; passages cités entre guillemets probablement verbatim mais non relus par l'agent sur la page brute — voir § SQ3).
- Accès bloqués : néant. Une voie a produit une **erreur d'identité** en cours de route (voir § SQ3 : un premier code ANSM censé être le gliclazide s'est révélé être le furosémide) — corrigée par une nouvelle recherche, pas forcée.

## Note sur `identite.mjs` (identité de la source SFD 2025)

`.claude/skills/recherche-source-primaire/references/acces-identite.md` § 6 demande d'appeler
`identite.mjs` pour toute étude qui porte une conclusion, avant d'écrire son identifiant dans le
dossier. **Cet appel n'a pas pu être fait** : aucun outil Bash n'est exposé à cet agent dans cette
session (seuls `Read`, `Grep`, `Glob`, `WebFetch`, `WebSearch`, `Write` le sont). L'identité de la
source SFD 2025 a donc été établie **manuellement, par la lecture directe de la première page du
PDF** : titre exact, liste d'auteurs, revue (*Médecine des maladies Métaboliques*, tome 19, n°8,
décembre 2025), pagination (630-662), date de mise en ligne (13 novembre 2025) et DOI
(`10.1016/j.mmm.2025.10.002`) y figurent explicitement et concordent avec la description reçue dans
le cadrage. Aucune divergence constatée. Ce DOI n'a cependant **pas été recoupé par `identite.mjs`**
(rétractation/correction Crossref non vérifiée par le script). Même limitation pour
`verifier-registre.mjs` : le registre joint n'a **pas pu passer la porte automatique** dans cette
session ; il a été rempli avec la plus grande attention au format exact, mais reste à faire vérifier
par le script dès qu'un outil Bash est disponible, avant toute consolidation.

## Méthode d'extraction du PDF SFD 2025 (avant tout verdict d'absence)

Conformément à `acces-identite.md` § 8 et à `00-global.md` § Règles de sourcing (incident du
2026-07-27) : le corpus local a été **ouvert**, pas seulement listé, et plusieurs méthodes ont été
essayées avant toute conclusion.

1. **Méthode 1 — `Read` avec `pages="1-10"`** (rendu image page à page, recommandé pour un PDF de
   plus de 10 pages) → **échec technique** : `pdftoppm is not installed. Install poppler-utils …`.
   Retesté avec `pages="1"` seul : même erreur, confirmant un défaut d'environnement (poppler absent),
   pas un défaut du fichier ni un paywall.
2. **Méthode 2 — `Read` sans le paramètre `pages`** (avec un `limit` de lignes, chemin de code
   différent, sans dépendance à `pdftoppm`) → **succès** : les 33 pages du document (`Med Mal Metab
   2025;19:630-662`) ont été rendues intégralement, texte et tableaux compris (à l'exception des
   couleurs pures des cellules de la Figure 3, voir note ci-dessous).
3. **Témoin positif** : le titre exact de la pièce (« Prise de position de la Société Francophone du
   Diabète (SFD) … 2025 »), les noms des auteurs et le DOI (`10.1016/j.mmm.2025.10.002`) sont sortis
   de l'extraction dès la première page — l'extraction fonctionne bien sur ce fichier par la méthode 2.
4. **Limite technique notée** : la Figure 3 (p. 645, « Insuffisance rénale chronique (IRC) : gestion
   des traitements de l'hyperglycémie ») est un tableau à cellules **colorées sans texte dans la
   cellule** (vert « pas de réduction », orange « réduction de la dose », rouge « non indiqué »). La
   restitution obtenue liste les en-têtes de lignes/colonnes et la légende, mais pas la couleur
   précise de chaque cellule molécule × palier de DFG. **Ce point précis (répartition fine
   molécule-par-molécule dans la Figure 3) reste `NON VÉRIFIÉ (partiel)`** — voir table maîtresse.
   Il n'affaiblit pas les réponses à SQ1/SQ2, qui reposent sur le **texte** (Avis n° 3 tableau I note
   2, Avis n° 12, Avis n° 12 bis), rédigé en prose et lu intégralement, indépendant de cette image.
5. **Pièce non « à 0 caractère extractible »** : contrairement au cas cité dans `00-global.md` (affiche
   anti-sédentarité), ce PDF cède à la méthode 2. Aucun verdict d'absence n'est donc nécessaire pour
   ce corpus : la position SFD sur le seuil de DFG des sulfamides et sur le répaglinide en IRC
   terminale **est présente et a été lue**.

## Table maîtresse des preuves

| # | Sous-question | Source (identifiant) | Population | Intervention / Comparateur | Critère | Résultat (effet absolu / seuil) | GRADE simplifié | État d'accès et voie | Localisation |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SQ1 | SFD 2025 — Prise de position, *Med Mal Metab* 2025;19:630-662, DOI 10.1016/j.mmm.2025.10.002 (identité établie manuellement, `identite.mjs` non exécutable dans cette session) | Adultes DT2, IRC tous stades | Sulfamides hypoglycémiants (classe, non distingués par molécule dans le texte prose) vs paliers de DFG | Seuil de contre-indication (sécurité/hypoglycémie) — critère de substitution (pharmacocinétique/dose), avis d'experts | **« Les sulfamides hypoglycémiants sont contre-indiqués en cas d'IRC sévère ou terminale »** = **DFG < 30 mL/min/1,73 m²** (stade 4 : 15-29 ; stade 5 : < 15). En IRC modérée (DFG 30-59) : pas de contre-indication, adaptation de posologie et vigilance hypoglycémique. | tres_faible (avis d'experts, pas d'ECR dédié au seuil) | **texte intégral accessible**, voie : `Read` sans `pages` | p. 632-633 (Avis n° 3, tableau I, note 2) ; confirmé p. 643-644 (Avis n° 12, n° 12 bis) |
| 2 | SQ1 (précision par molécule) | SFD 2025 (même source) | idem | Sulfamides — gliclazide/glimépiride/glibenclamide | Seuil différencié par molécule | Le texte prose de la SFD 2025 **ne distingue pas** de seuil de DFG propre à chaque sulfamide. La Figure 3 (image colorée) pourrait en porter un, non extrait de façon fiable. | — | **échec technique** sur cette voie précise (couleurs de cellule non rendues par `Read`) | p. 645, Figure 3 |
| 3 | SQ1 (recoupement RCP) | RCP ANSM gliclazide (GLICLAZIDE MYLAN 30 mg LP, code ecodex `R0172430`) | — | Gliclazide vs fonction rénale | Seuil de contre-indication / mise en garde | **4.3** : « Insuffisance rénale ou hépatique sévère (dans ces situations il est recommandé de recourir à l'insuline) ». **4.4/4.2** : « insuffisance rénale légère à modérée : … le même schéma posologique … pourra être utilisé, mais avec une surveillance attentive. » **Aucun seuil chiffré (mL/min) trouvé dans les passages extraits** — cohérent qualitativement avec le seuil SFD (sévère = DFG<30) mais non chiffré dans cette extraction précise. | tres_faible (RCP = information réglementaire, pas un essai) | **résumé accessible** (voie : `WebFetch` — page convertie et résumée par un modèle intermédiaire ; citations entre guillemets, non relues verbatim par l'agent sur la page brute) | Section 4.2/4.3/4.4 de la RCP citée |
| 4 | SQ1 (recoupement RCP) | RCP ANSM glimépiride (GLIMEPIRIDE EG 4 mg, code ecodex `R0431162`) | — | Glimépiride vs fonction rénale | Seuil de contre-indication | **4.3** : « insuffisance rénale ou hépatique sévère » (sans chiffre). **4.4** : « passage à l'insuline recommandé » en cas d'IRC/hépatique sévère. | tres_faible | **résumé accessible** (voie : `WebFetch`, même réserve que ci-dessus) | Sections 4.2/4.3/4.4 |
| 5 | SQ1 (recoupement RCP) | RCP ANSM glibenclamide (DAONIL 5 mg, code ecodex `R0296317`) | — | Glibenclamide vs fonction rénale | Seuil de contre-indication + seuil PK chiffré | **4.3** : « insuffisance rénale ou hépatique sévère ». **5.2 (pharmacocinétique)** : **« L'insuffisance rénale n'affecte pas son élimination aussi longtemps que la clairance de la créatinine reste supérieure à 30 ml/min »** — seul chiffre retrouvé parmi les 3 RCP de sulfamides interrogées, et il **concorde avec le seuil SFD (DFG<30 = IRC sévère/terminale)**. | tres_faible | **résumé accessible** (voie : `WebFetch`, même réserve) | Sections 4.2/4.3/4.4/5.2 |
| 6 | SQ2 | SFD 2025 (même source que #1) | Adultes DT2, IRC sévère (DFG 15-29) et terminale (DFG < 15, y compris dialyse) | Répaglinide vs paliers de DFG | Utilisabilité en IRC terminale | **« Au stade d'IRC terminale (DFG < 15 mL/min/1,73 m²), parmi les molécules commercialisées en France, seuls l'insuline, le répaglinide (avec un risque d'hypoglycémies pour ces deux traitements), la vildagliptine à la dose de 50 mg/j et la sitagliptine à la dose de 25 mg/j … peuvent être utilisés. »** Même énoncé au stade sévère (DFG 15-29). Aucune dose ni surveillance spécifique au répaglinide n'est chiffrée par la SFD dans ce passage (à la différence de vildagliptine/sitagliptine). | tres_faible | **texte intégral accessible**, voie : `Read` sans `pages` | p. 643-644 (Avis n° 12 bis) |
| 7 | SQ2 (dose/surveillance) | SFD 2025 (même source) | idem | Répaglinide — conditions d'usage | Dose / surveillance | Pas de dose de départ ni de règle de titration chiffrée pour le répaglinide en IRC terminale dans la SFD 2025. Cible d'HbA1c générale ≤ 8 % (limite basse 7 %) et ASG « très souhaitable » pour tout traitement par SU/glinide/insuline en IRC sévère-terminale. | non calculable : énoncé qualitatif, pas de chiffre à recalculer | tres_faible | **texte intégral accessible** | p. 633 (tableau I) et p. 643 (Avis n° 12) |
| 8 | SQ2 (recoupement RCP) | RCP ANSM répaglinide (code ecodex `R0309526`) | — | Répaglinide vs fonction rénale | Contre-indication / posologie / PK | **4.3** : **aucune contre-indication spécifique à l'insuffisance rénale répertoriée**. **4.2** : « il est conseillé d'être prudent lors de l'adaptation des doses » (pas de contre-indication formelle, la sensibilité à l'insuline étant par ailleurs augmentée en IRC). **5.2** : après 5 jours à 2 mg × 3/j chez des patients à **clairance de la créatinine 20-39 mL/min**, exposition (ASC) et demi-vie **doublées** vs fonction rénale normale. **Ce résumé RCP ne couvre donc, comme le retour OE archivé le signalait déjà, aucune donnée en dessous de CrCl 20 mL/min** — cohérent avec l'énoncé SFD (répaglinide « utilisable » en IRC terminale mais avec risque d'hypoglycémie, sans dose chiffrée). | tres_faible | **résumé accessible** (voie : `WebFetch`, même réserve) | Sections 4.2/4.3/5.2 |
| 9 | SQ3 (repérage) | Retour OpenEvidence archivé (`epreuve/entrees/OE-retour-brut-extrait.md`, 2026-07-27) — débroussaillage uniquement | idem PICO | RCP FDA du répaglinide (citée par OE) | Seuil PK et dosage en IRC | « pharmacokinetic studies of repaglinide were conducted only in patients with CrCl 20-40 mL/min … No studies were conducted in patients with creatinine clearances below 20 mL/min … the label recommends initiating repaglinide at 0.5 mg orally before each meal … » — cohérent avec la RCP EMA/ANSM interrogée directement (ligne 8), mais le chiffre de dose (0,5 mg) n'a pas été retrouvé verbatim dans l'extraction ANSM obtenue par l'agent A (résumé WebFetch centré sur la fonction rénale, pas sur la posologie initiale) | — | **résumé accessible** (résumé généré par OE, repris tel quel) | Retour OE, section « Drug Label » |

### Recoupement contextuel (nœud D existant, à titre de contexte — pas une preuve réutilisée telle quelle)

`docs/decision/00-global.md` (nœud D, sulfamides/gliptines) note un « garde-fou DFG<30 » et des
« seuils rénaux figés d'après les RCP » pour la place résiduelle des sulfamides/gliptines, ce qui est
cohérent avec le seuil DFG<30 trouvé ici (SFD 2025 et RCP glibenclamide) — mais ce nœud D répond à une
question différente (place résiduelle de la classe, pas le seuil précis par molécule ni le
répaglinide en IRC terminale). Cité pour mémoire, non recopié comme preuve.

## Registre des affirmations

Voir fichier séparé : `docs/decision/validation/chantier-2026-09-24/seuil-dfg-su-registre.md`.
**Non passé par `verifier-registre.mjs`** faute d'outil Bash dans cette session — à faire vérifier
avant toute consolidation.

## Journal de recherche

Voir fichier séparé : `docs/decision/validation/chantier-2026-09-24/seuil-dfg-su-journal.md`.

## Formulations graduées par sous-question

### SQ1 — Seuil de DFG à partir duquel la SFD 2025 contre-indique les sulfamides hypoglycémiants

1. **Le plus prudent** : « Selon la position SFD 2025 (avis d'experts, pas d'essai randomisé dédié à
   ce seuil), les sulfamides hypoglycémiants seraient à éviter en deçà d'un DFG de 30 mL/min/1,73 m²
   (IRC "sévère ou terminale", stades 4-5) ; la source SFD ne distingue pas de seuil propre à chaque
   molécule dans son texte, et les RCP françaises consultées (gliclazide, glimépiride) ne chiffrent
   pas non plus ce seuil dans les passages retrouvés — seule la RCP du glibenclamide donne
   explicitement 30 mL/min comme repère pharmacocinétique. »
2. **Intermédiaire** : « La SFD 2025 fixe la contre-indication des sulfamides hypoglycémiants à un
   DFG < 30 mL/min/1,73 m² (IRC sévère ou terminale), sans seuil différencié par molécule ; ce seuil
   est cohérent avec le repère pharmacocinétique de 30 mL/min retrouvé dans la RCP du glibenclamide
   (clairance de la créatinine), et avec la formule générale « insuffisance rénale sévère » des RCP
   gliclazide/glimépiride (non chiffrée dans les passages obtenus par l'agent). »
3. **Le plus affirmatif** (à ne retenir que si le référent juge le niveau de preuve suffisant) : « La
   SFD 2025 et les RCP des trois sulfamides convergent sur un seuil de DFG < 30 mL/min/1,73 m² pour la
   contre-indication, quelle que soit la molécule. » — **Attention** : cette formulation généralise à
   partir d'un seul chiffre RCP explicite (glibenclamide) et de deux formulations qualitatives non
   chiffrées (gliclazide, glimépiride) obtenues via un résumé `WebFetch`, pas une lecture verbatim
   complète des trois RCP ; et la Figure 3 de la SFD (non extraite, ligne 2 de la table) pourrait
   nuancer par molécule. Formulation à ne pas encoder telle quelle sans lever ces deux points.

### SQ2 — Répaglinide en IRC terminale selon la SFD 2025

1. **Le plus prudent** : « La SFD 2025 mentionne le répaglinide parmi les molécules utilisables en
   IRC terminale (DFG < 15 mL/min/1,73 m², y compris dialyse), en signalant un risque
   d'hypoglycémies, mais sans détailler de protocole de dose ou de surveillance spécifique à cette
   molécule dans ce document ; la RCP ANSM du répaglinide ne porte elle-même aucune contre-indication
   rénale formelle, mais ne dispose d'aucune donnée en dessous d'une clairance de la créatinine de
   20 mL/min (cohérent avec le retour OpenEvidence archivé sur le label FDA). »
2. **Intermédiaire** : « Selon la SFD 2025, le répaglinide reste utilisable en IRC sévère et terminale
   (DFG < 30, y compris dialyse), à la différence des sulfamides qui y sont contre-indiqués ; la RCP
   ANSM confirme l'absence de contre-indication rénale formelle mais documente un doublement de
   l'exposition (ASC) et de la demi-vie dès CrCl 20-39 mL/min, sans donnée en deçà — ce qui explique la
   prudence (« risque d'hypoglycémies ») affichée par la SFD plutôt qu'une dose chiffrée. »
3. **Le plus affirmatif** : « La SFD 2025 et la RCP ANSM autorisent conjointement l'usage du
   répaglinide jusqu'au stade terminal de l'IRC et en dialyse, sans restriction autre qu'une
   surveillance clinique standard. » — À nuancer : ni la SFD ni la RCP ne couvrent réellement la zone
   CrCl < 20 mL/min par des données ; l'absence de contre-indication formelle **n'équivaut pas** à une
   validation positive de cette zone, seulement à un silence des deux sources sur ce point (« absence
   de données » ≠ « résultat négatif » — cf. consigne d'agent sur les essais sans résultats publiés).
   Cette formulation ne devrait pas être retenue telle quelle.

### SQ3 — Position des RCP françaises/EMA (recoupement, non décisive)

1. **Le plus prudent** : « Les RCP ANSM des quatre molécules (gliclazide, glimépiride, glibenclamide,
   répaglinide) ont été interrogées via une recherche web puis une lecture assistée (`WebFetch`, qui
   fait passer le texte par un résumé intermédiaire avant de le rendre à l'agent) — les citations
   entre guillemets sont vraisemblablement verbatim mais n'ont pas été relues par l'agent sur la page
   HTML brute ; à ce degré de vérification, elles corroborent qualitativement le seuil SFD de
   DFG < 30 mL/min pour les sulfamides et l'absence de contre-indication formelle pour le répaglinide,
   sans permettre une citation page/tableau aussi précise que pour la SFD 2025. »
2. **Intermédiaire** : « Les RCP françaises consultées (résumé `WebFetch`) sont cohérentes avec la
   position SFD 2025 : contre-indication des sulfamides en IRC sévère (repère chiffré à 30 mL/min
   retrouvé dans la RCP du glibenclamide), absence de contre-indication rénale formelle pour le
   répaglinide mais absence de données en deçà de CrCl 20 mL/min. »
3. **Le plus affirmatif** : à éviter tant que ces citations RCP n'ont pas été relues verbatim sur la
   page source par un agent (A ou B) sans passer par le résumé intermédiaire de `WebFetch` — le
   niveau de vérification actuel est `résumé accessible`, pas `texte intégral accessible`.

## SQ3 — Recherche RCP (aboutie, avec réserve méthodologique)

Les quatre RCP ANSM ont été retrouvées et interrogées (voir journal de recherche pour le détail des
requêtes et l'incident d'identité rencontré sur le premier code gliclazide, qui pointait en réalité
vers le furosémide — corrigé par une nouvelle recherche, pas forcé). **Réserve** : l'outil `WebFetch`
fait passer la page par un modèle de résumé avant de la rendre (cf. description de l'outil) ; les
passages entre guillemets ci-dessus sont vraisemblablement verbatim (la mise en forme le suggère) mais
n'ont **pas** été vus par l'agent sur le HTML brut de la page ANSM. Ils sont donc classés `résumé
accessible`, pas `texte intégral accessible`, dans le registre et la table maîtresse — conformément à
`acces-identite.md` § 3 (« le résumé généré … reste du repérage »). Un agent B ou une relecture
ultérieure avec un accès différent (téléchargement direct du HTML, par exemple) pourrait faire passer
ces lignes à `texte intégral accessible` s'il relit lui-même la page brute.

## Proposition OE

**Aucune proposition OE n'est nécessaire pour SQ1/SQ2** : la position SFD a été trouvée et lue en
texte intégral dans le corpus local, ce qui est la seule source primaire pertinente pour ces deux
sous-questions décisives (rappel du cadrage : « OpenEvidence hors périmètre SFD »).

Pour **SQ3**, une question OE reste utile en complément pour lever la réserve méthodologique ci-dessus
(passages RCP vus seulement via un résumé `WebFetch`, pas verbatim) et pour élargir aux guidelines
internationales :

- **Prompt proposé** : « What do the EMA/FDA product labels (SmPC) for gliclazide, glimepiride,
  glibenclamide (glyburide) and repaglinide state, verbatim, about renal function thresholds (eGFR or
  CrCl in mL/min) for dose adjustment, caution, or contraindication? Quote the exact wording and cite
  the label section/version. Do not cite French sources (HAS/SFD/CMG) — restrict to EMA/FDA product
  labels and international guidelines (KDIGO, KDOQI, Endocrine Society). »
- **Modèle** : celui déjà utilisé pour le retour archivé du 2026-07-27 (à confirmer par
  l'orchestrateur selon `docs/commun/OUTIL-INTERFACE-OE.md`).
- **Motif** : recouper/actualiser le retour OE déjà archivé et fiabiliser la citation verbatim des RCP
  (l'agent A n'a pu les lire que via un résumé intermédiaire `WebFetch`, pas en texte brut). **Cette
  proposition n'engage rien : elle attend l'accord du référent, portée par l'orchestrateur.**

## Limites et points ouverts

- **Outil Bash absent de cette session** : `identite.mjs` et `verifier-registre.mjs` n'ont pas pu être
  exécutés. L'identité de la SFD 2025 a été établie manuellement (page de titre, DOI, revue,
  pagination, date) et concorde avec le cadrage ; elle n'a pas été recoupée par le script
  (rétractation/correction Crossref notamment). Le registre joint n'a pas passé la porte automatique.
- **Figure 3 du PDF SFD 2025 (p. 645)** : tableau à cellules colorées non restitué de façon fiable en
  texte par l'outil de lecture disponible dans cette session. Reste `NON VÉRIFIÉ (partiel)` pour une
  éventuelle distinction fine par molécule au-delà du texte prose.
- **RCP ANSM (SQ1/SQ2/SQ3)** : lues via `WebFetch`, qui fait passer la page par un résumé intermédiaire
  avant de la rendre à l'agent — classées `résumé accessible`, pas `texte intégral accessible`, par
  prudence. Un incident d'identité a été rencontré et corrigé (un premier code cherché pour le
  gliclazide s'est révélé être une RCP de furosémide ; nouvelle recherche effectuée, code correct
  identifié et confirmé par le contenu retourné).
- **`prescrire-dt2.md`** : ouvert et interrogé (`répaglinide|glinide|repaglinide` : aucune occurrence ;
  `sulfamide|DFG|rénal` : occurrences trouvées, aucune ne porte de seuil de DFG chiffré pour les SU —
  Prescrire y mentionne seulement le risque hypoglycémique accru « si âgé, IR » sans seuil numérique).
  Absence traitée selon `acces-identite.md` § 8 : fichier ouvert en texte intégral, recherche par
  motif normalisée (insensible à la casse), témoin positif présent (le mot « rénal » sort bien du
  fichier à d'autres endroits) — donc l'absence d'un seuil DFG chiffré pour les SU chez Prescrire dans
  cette note est une lacune constatée, pas une déduction.
