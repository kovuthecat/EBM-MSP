# Red-team — retour OpenEvidence brut, seuils rénaux sulfamide/glinide (nœud `prescription`, DT2)

## Provenance
- Agent : contradicteur-preuve (B) — consignes : `.claude/agents/contradicteur-preuve.md`, dernier commit : non transmise
- Modèle : sonnet (en-tête de l'agent)
- Date : 2026-09-24
- Mode : Décision — invocation adaptée (red-team direct d'un retour OE, hors chantier complet)
- Outils disponibles : Read, Grep, Glob, WebFetch, WebSearch, Write ; absents : Bash (donc `identite.mjs` et
  `verifier-registre.mjs` non exécutables dans cette session — leurs sorties ne sont pas reconstituées de
  mémoire), tout connecteur MCP listé dans les instructions d'environnement (ClinicalTrials.gov, Consensus,
  Claude Docs, Vercel) — mentionnés par des blocs d'instructions système mais **non exposés comme outils
  appelables** dans cette session ; ni Interface-OE (interdit par mission explicite, de toute façon hors
  périmètre de cet agent).
- Accès obtenus : corpus local `docs/decision/sources/` — voie : lecture directe des fichiers (PDF/MD),
  texte intégral accessible pour `SFD 2025.pdf`, `strategie_therapeutique_..._recommandations.pdf` (HAS RBP
  2024) et `HAS 2025 - Parcours de soins DT2 - guide.pdf` ; web public (RCP ANSM/EMA, kiosque SFD) — voie :
  WebSearch/WebFetch. Accès bloqués : néant constaté — l'extraction directe (Grep) a échoué sur les PDF
  binaires (`échec technique`, non un verdict d'accès), levée par la seconde méthode (Read/OCR intégré).
- Rapport d'A et retour OE ouverts : le retour OE (`epreuve/entrees/OE-retour-brut-extrait.md`) est l'objet
  même de la mission — ouvert **après** la section « Attendus » ci-dessous, conformément à la méthode ; aucun
  rapport d'Agent A n'existe sur ce chantier (entrée manquante, notée ci-dessous).

## Entrées manquantes (déclarées, non reconstituées)
- **Cadrage écrit** de la question clinique (PICO complet, sous-questions formalisées au-delà des deux citées
  dans l'invocation) : absent — je travaille sur les deux sous-questions telles que formulées par le
  référent dans l'invocation de ce chantier.
- **Rapport d'Agent A** : absent — aucune extraction préalable à contredire ; ce rapport red-team porte
  directement sur le retour OE brut.
- **Consolidation** : sans objet — aucune prévue pour ce chantier ponctuel.
- **Date du dernier commit du fichier agent `.claude/agents/contradicteur-preuve.md`** : non transmise par le
  circuit qui m'a invoqué.
- **Registre des affirmations (`registre-affirmations.md` au format dédié)** : non fourni comme pièce de ce
  chantier ; ce rapport tient lieu de trace des affirmations vérifiées, avec localisation.

---

## Attendus (écrits avant toute lecture du corpus local ou du web pour ce chantier ; le retour OE
n'a pas encore été ouvert au moment où ces lignes sont écrites — seules les deux citations reprises
par le référent dans son invocation, ci-dessus, sont connues)

### Sous-question 1 — seuils de DFG/eGFR des sulfamides (gliclazide, glimépiride, glibenclamide) en IRC

- **Critères de jugement attendus** : sécurité, pas efficacité — le risque dominant est l'hypoglycémie
  sévère par accumulation du principe actif et/ou de métabolites actifs à élimination rénale. Une réponse
  sérieuse doit distinguer les molécules : le glibenclamide (metabolites actifs, longue demi-vie) a un
  profil de risque nettement plus défavorable que le gliclazide ou le glimépiride en IRC.
- **Chiffres attendus et où ils devraient se trouver** : un seuil d'eGFR/DFG (probablement 60, 30, 15
  mL/min/1,73m² selon la molécule) apparaissant soit (a) dans un tableau d'adaptation posologique par classe
  thérapeutique en annexe d'une RBP HAS (pratique fréquente des RBP HAS pour les classes à risque rénal),
  soit (b) dans le corps du texte SFD 2025 au chapitre insuffisance rénale / sécurité d'emploi, soit (c)
  dans les notes Prescrire (position habituellement plus restrictive, susceptible d'écarter les sulfamides
  plus tôt que la RCP). Le format attendu : un chiffre associé à une conduite (« éviter », « réduire de
  moitié », « contre-indiqué »).
- **Réserves attendues** : à défaut d'essais cliniques dédiés au seuil rénal (peu probable qu'un ECR ait
  testé spécifiquement un cut-off de DFG), la source attendue est un **RCP/AMM** ou un **avis d'experts**
  (SFD), donc niveau de preuve GRADE **très faible/faible** — accord d'expert plutôt qu'EBM dure. Une
  réponse sérieuse doit le signaler, pas présenter un chiffre KDIGO/RCP comme une méta-analyse.
- **Études attendues et passe d'omission** : pas d'ECR dédié attendu. Voies attendues : RCP ANSM/Vidal
  (gliclazide, glimépiride, glibenclamide), KDIGO 2022 Diabetes in CKD (tableau des seuils par classe),
  ADA Standards of Care (chapitre CKD), littérature de pharmacovigilance sur le glibenclamide en IRC
  (nombreux signalements d'hypoglycémies sévères ayant motivé son retrait de plusieurs listes officielles,
  y compris WHO EML — déjà noté au nœud D du présent projet). Une recherche de sens contraire porterait sur
  un article défendant l'usage du glibenclamide à faible DFG sous surveillance — peu probable d'exister en
  2026, mais à vérifier pour ne pas sur-affirmer une unanimité.

### Sous-question 2 — répaglinide (glinide) en IRC terminale / dialyse

- **Critères de jugement attendus** : sécurité (hypoglycémie), pharmacocinétique (métabolisme hépatique
  prédominant du répaglinide via CYP2C8/3A4, élimination rénale minoritaire) — c'est le point qui distingue
  structurellement le répaglinide des sulfamides et pourrait justifier une position plus permissive de la
  RCP/des sociétés savantes en IRC sévère/dialyse.
- **Chiffres attendus et où ils devraient se trouver** : possiblement **pas de seuil chiffré de DFG propre**
  au répaglinide (contrairement aux sulfamides), mais une position qualitative de la RCP (« pas d'ajustement
  posologique nécessaire », « prudence recommandée », voire mention explicite de la dialyse) reprise, le cas
  échéant, dans le même tableau HAS/SFD que la sous-question 1. Si un chiffre existe, il serait probablement
  un compte-rendu de données pharmacocinétiques (étude de population IRC légère à sévère, éventuellement
  dialysés) plutôt qu'un essai d'efficacité clinique.
- **Réserves attendues** : population IRC terminale/dialyse historiquement exclue des essais pivots du
  répaglinide ; toute affirmation d'utilisation « en dialyse » doit distinguer usage réel documenté d'un
  simple silence de contre-indication (absence de CI ≠ preuve d'innocuité en dialyse).
- **Études attendues** : RCP répaglinide (Novonorm/Prandin, ANSM/EMA), étude de pharmacocinétique en
  insuffisance rénale (type Marbury et al. 2000, souvent citée pour le répaglinide en IRC), position
  SFD/HAS si elle existe dans le corpus local. Recherche de sens contraire : signalements de pharmacovigilance
  d'hypoglycémies sévères sous répaglinide en dialyse qui nuanceraient une position trop rassurante.

### Réserve méthodologique commune aux deux sous-questions (posée avant lecture)

Le référent signale un précédent (2026-07-27, `00-global.md` § Règles de sourcing) où un verdict d'absence
sur une position SFD s'est révélé faux : le chiffre existait, verbatim, dans l'Avis n° 19 SFD 2025, mais
n'a pas été vu faute d'avoir ouvert le fichier local. Mon attendu méthodologique est donc : **toute
affirmation d'absence de position SFD/HAS que je m'apprête à examiner dans le retour OE doit être
contre-vérifiée par une ouverture réelle du corpus local**, avec au moins deux méthodes d'extraction sur
les PDF volumineux (`SFD 2025.pdf` en particulier), avant d'être confirmée ou infirmée.

---

## Cherché dans le corpus / sur le web — résultat (tient lieu de « Cherché, non trouvé par A »,
sans objet ici faute de rapport A)

| Voie | Requête / source, date | Trouvé | Effet sur la conclusion |
| --- | --- | --- | --- |
| Grep (extraction texte directe) | `sulfamide`, `répaglinide`, `DFG`, `eGFR` sur `SFD 2025.pdf`, RBP HAS 2024, Parcours HAS 2025 — 2026-09-24 | **Échec technique** : 0 occurrence sur les 3 PDF (flux binaires non indexables tels quels par ripgrep) ; 1 occurrence sur `prescrire-dt2.md` (texte natif) | N'établit rien seul — conforme à `acces-identite.md` § 2 : un échec d'extraction n'est jamais un verdict d'absence. Deuxième méthode requise. |
| Read (rendu intégré du PDF, page par page) | Lecture intégrale de `SFD 2025.pdf` (33 pages), de la RBP HAS 2024 (56 pages) et du guide Parcours de soins HAS 2025 (113 pages) — 2026-09-24 | **Trouvé** : SFD 2025 p.633 (Tableau I, note 2), p.643 (Avis n°12), p.644 (Avis n°12 bis) ; HAS RBP 2024 p.20-21 (R.61, R.69), p.22-23 (R.78), p.28 (R.102) — voir Findings ci-dessous | Contredit directement les deux affirmations d'absence de l'OE (voir Findings 1 et 2). |
| WebSearch/WebFetch | RCP ANSM gliclazide, RCP EMA/ANSM répaglinide, article SFD relayé par *Le Quotidien du Médecin* (kiosque SFD, 2014) — 2026-09-24 | **Trouvé** : gliclazide CI en IR sévère (RCP ANSM) ; répaglinide utilisable à tous les stades d'IRC dont dialyse, sans ajustement posologique de base, du fait de l'élimination hépatobiliaire (RCP EMA/ANSM ; article SFD 2014 signé Patrice Darmon, auteur principal de la SFD 2025) | Corrobore les Findings 1 et 2 par une voie indépendante du corpus local ; ne les contredit pas. |
| Read (2ᵉ méthode, corpus texte natif) | `prescrire-dt2.md`, lecture intégrale — 2026-09-24 | Pas de seuil de DFG chiffré pour les sulfamides comme classe (seulement « écarter si risque d'hypoglycémie grand [âgé, IR] », qualitatif) ; pas de mention du répaglinide | N'apporte ni ne retire rien aux Findings 1-2 ; confirme que Prescrire n'est pas la source du chiffre. |

---

## Findings

### Finding 1 — HAUTE — origine : **OE seule, contredite par la source primaire elle-même**
**Sous-question 1 (sulfamides).** Le retour OE affirme : *« No specific SFD/HAS guideline text on
sulfonylurea eGFR thresholds was identified in the literature. »* Cette affirmation d'absence est
**fausse pour la SFD**.

Passage source exact : SFD 2025 (Darmon et al., *Med Mal Metab* 2025;19:630-662, DOI
10.1016/j.mmm.2025.10.002), **Tableau I, note de bas de page n° 2, p. 633** : *« Les sulfamides
hypoglycémiants sont contre-indiqués en cas d'IRC sévère ou terminale. »* La note n° 1 de la même page
chiffre ces stades : *« Stade 4 : débit de filtration glomérulaire (DFG) entre 15 et 29 mL/min/1,73 m² ;
stade 5 : DFG < 15 mL/min/1,73 m². »* Confirmé et développé dans le corps de texte, **Avis n° 12, p. 643** :
*« Chez les patients vivant avec un DT2 et présentant une IRC sévère (DFG entre 15 et 29 mL/min/1,73 m²)
ou terminale (DFG < 15 mL/min/1,73 m²)... (SU contre-indiqués) »*. C'est un seuil de DFG chiffré et
verbatim (contre-indication en dessous de 30 mL/min/1,73 m²), présent dans le corpus local dès la
troisième page utile du document — exactement le type de pièce que le précédent du 2026-07-27 (Avis n° 19
SFD, seuil 0,5 U/kg) avait manqué faute d'avoir réellement ouvert le fichier local.

**Nuance nécessaire** : pour la HAS RBP 2024, l'affirmation d'OE se révèle en revanche **globalement
exacte** — le document (Recommandations R.61 et R.69, p. 20-21, et R.102, p. 28) écarte les sulfamides en
1re ligne par prudence mais **ne cite aucun seuil de DFG chiffré** pour cette classe, seulement des
formulations qualitatives (« risque d'hypoglycémies sévères », « à utiliser avec précaution », « n'est plus
la stratégie préférentielle »). OE a donc eu raison pour la HAS et tort pour la SFD, mais formule un
verdict global (« No specific SFD/HAS... ») qui gomme cette distinction et se révèle faux dans son
ensemble, puisqu'une des deux sources qu'il prétend muettes porte bien un chiffre nommé.

### Finding 2 — HAUTE — origine : **OE seule, contredite par la source primaire elle-même**
**Sous-question 2 (répaglinide).** Le retour OE affirme : *« No specific French guideline text on
repaglinide in ESRD was identified. »* Cette affirmation est **fausse**, et pas seulement par une nuance
d'interprétation.

Passage source exact : SFD 2025, **Avis n° 12 bis, p. 644** : *« Au stade d'IRC terminale (DFG
< 15 mL/min/1,73 m²), parmi les molécules commercialisées en France, seuls l'insuline, le répaglinide
(avec un risque d'hypoglycémies pour ces deux traitements), la vildagliptine à la dose de 50 mg/j et la
sitagliptine à la dose de 25 mg/j... peuvent être utilisés. »* Le même Avis couvre le stade sévère (DFG
15-29) dans les mêmes termes, même page. C'est une position française **explicite et positive** — le
répaglinide *est* utilisable jusqu'à l'IRC terminale, ce n'est pas une simple absence de contre-indication
tacite déduite d'un silence.

Confirmé indépendamment par la HAS RBP 2024, **Avis n° 78 (trithérapie), p. 22-23** : *« répaglinide
(demi-vie courte) et en raison de sa « non-CI » en cas de maladie rénale »* — le texte HAS emploie
lui-même les guillemets pour souligner l'absence de contre-indication rénale du répaglinide, dans un
document de méthode dont OE affirme qu'il ne dit rien sur le sujet.

### Finding 3 — MOYENNE — origine : **OE seule, angle Spin/Portée**
Le retour OE, pour la sous-question 2, cadre l'absence supposée de position française comme une simple
conséquence du silence des données réglementaires (*« French practice generally follows EMA labelling,
which permits use with caution in severe renal impairment (CrCl 20-40) but is silent below CrCl 20 »*) —
une formulation qui laisse entendre que la France n'a « rien à dire de propre » et se contente de suivre le
silence de l'EMA. Or le corpus local montre l'inverse : la SFD adopte une position **plus affirmative et
plus étendue** que le RCP européen lui-même. Le RCP EMA/ANSM du répaglinide s'arrête aux données de
pharmacocinétique disponibles (CrCl 20-39 mL/min) et reste silencieux en deçà ; la SFD, elle, **autorise
explicitement** l'usage jusqu'au stade d'IRC terminale (DFG < 15) et jusqu'en dialyse, en le nommant
directement dans son tableau de gestion des traitements (Figure 3, p. 645) aux côtés de l'insuline comme
seules options disponibles à ce stade. Le retour OE sous-estime donc l'autonomie de la position française
par rapport au silence réglementaire européen qu'il présente comme la seule explication.

### Finding 4 — BASSE — origine : **qualité de l'artefact transmis (angle Accès)**
Plusieurs passages du retour OE brut sont manifestement tronqués ou mal formatés dans l'extrait fourni
(par ex. « Use with caution if eGFR ** », « glycémies répétées supérieures à... » avec valeurs numériques
disparues dans le rendu tableau→texte). Cela limite la vérifiabilité de plusieurs affirmations secondaires
du retour (seuils Endocrine Society 2019, KDOQI 2012, cohorte CPRD, sous-analyse ADVANCE) qui n'ont **pas
pu être confrontées à leur article source primaire** dans le périmètre de cette mission — le référent ayant
explicitement placé ce volet en second plan derrière le volet France. Ce point se signale comme une limite
du support transmis et du périmètre de la mission, pas comme un jugement sur l'exactitude réelle de ces
affirmations secondaires d'OE, qui restent **non vérifiées** (ni confirmées ni infirmées) à l'issue de ce
chantier.

---

## Confirmations obtenues

- **HAS RBP 2024 ne porte effectivement aucun seuil de DFG chiffré pour les sulfamides** (contrairement à
  la SFD) — confirmé par lecture intégrale des sections médicamenteuses de la RBP (p. 17-29 : R.60 à R.102).
  Sur ce point précis, le retour OE n'est pas fautif ; c'est une confirmation partielle de son contenu.
  Localisation : HAS RBP 2024, R.61 (p. 20), R.69 (p. 21), R.102 (p. 28).
- **Metformine contre-indiquée si DFG < 30 mL/min/1,73 m²** — cohérence transverse retrouvée aussi bien dans
  `prescrire-dt2.md` que dans HAS RBP 2024 (§ IRC) et SFD 2025 (Avis n° 12 ter, p. 644) — hors périmètre de
  la mission mais confirme la fiabilité générale des sources ouvertes.
- **Le seuil « 0,5 U/kg/j » (précédent du 00-global.md, Avis n° 19 SFD)** est effectivement verbatim dans le
  corpus, retrouvé par une lecture indépendante au fil de ce chantier (SFD 2025, Avis n° 19, p. 654 :
  *« malgré de fortes doses d'insuline basale, c'est-à-dire plus de 0,5 U/kg/j »*) — sans lien direct avec la
  mission, mais confirmation supplémentaire que l'ouverture réelle du fichier local est la voie qui fonctionne,
  conformément à la leçon méthodologique citée par le référent.
- **RCP français (ANSM) du gliclazide** : contre-indication en insuffisance rénale sévère confirmée par une
  voie indépendante (web, base ANSM ecodex) — corrobore la position SFD.
- **RCP EMA/ANSM du répaglinide** : utilisable à tous les stades d'IRC sans contre-indication rénale de
  principe (élimination hépatobiliaire prédominante, ~92-98 % de métabolisme hépatique) — confirmé par une
  voie indépendante (EMA product information, ANSM ecodex) — corrobore SFD et HAS.

## Objections retirées

- **Hypothèse d'Attendus retirée** : j'envisageais, avant lecture, que la HAS RBP 2024 puisse elle aussi
  porter un chiffre de DFG distinct pour les sulfamides (dans un tableau d'annexe dédié à l'adaptation
  posologique). Cette hypothèse tombe après lecture intégrale des sections pertinentes de la RBP
  (p. 17-29) : aucun tableau d'adaptation posologique par classe n'y figure pour les sulfamides — seule la
  metformine et les gliptines y sont chiffrées par le DFG (p. 21). Le chiffre sur les sulfamides est propre
  à la SFD. Passage qui fait tomber l'objection : absence de toute mention numérique de DFG associée aux
  sulfamides dans l'intégralité du texte des Recommandations 55 à 105 de la RBP HAS 2024.

## Décompte

| Sévérité | Nombre | Origine |
| --- | --- | --- |
| HAUTE | 2 | OE seule, contredite par la source primaire (SFD 2025) |
| MOYENNE | 1 | OE seule, spin/portée |
| BASSE | 1 | Qualité de l'artefact transmis, pas du contenu OE |
| **Confirmations** | 5 | dont 1 confirmation partielle du contenu même d'OE (HAS muette sur le chiffre SU) |
| **Objections retirées** | 1 | Hypothèse d'un chiffre HAS distinct pour les SU |

## Verdict par sous-question

**Sous-question 1 (seuils de DFG des sulfamides).** Le retour OE se trompe sur l'ensemble de son
affirmation. La SFD 2025 porte un seuil chiffré explicite et verbatim — DFG < 30 mL/min/1,73 m² (stades 4-5)
= IRC sévère ou terminale = sulfamides contre-indiqués — présent dans le corpus local dès la p. 633 (note
de tableau) et développé p. 643 (Avis n° 12). En revanche, pour la HAS seule, l'affirmation d'OE tient : la
RBP 2024 ne porte aucun seuil de DFG chiffré pour cette classe, uniquement une prudence qualitative. Le
nœud/l'argumentaire devrait donc s'appuyer sur la SFD 2025 pour le chiffre, et signaler que la HAS reste
qualitative sur ce point — sans reprendre la formulation d'OE qui efface la position SFD.

**Sous-question 2 (répaglinide en IRC terminale/dialyse).** Le retour OE se trompe clairement et sans
nuance possible. La SFD 2025 (Avis n° 12 bis) autorise explicitement le répaglinide jusqu'au stade d'IRC
terminale (DFG < 15) ; la HAS RBP 2024 (Avis n° 78) confirme sa « non-CI » rénale dans les mêmes termes.
La France ne se limite pas à suivre un silence européen : sa position est affirmative et va, sur le stade
terminal, au-delà de ce que documente le RCP EMA lui-même (silencieux sous CrCl 20).

## Proposition de libellé (nœud/argumentaire `prescription`, volet sulfamides/glinide et IRC)

- **Sulfamides** : « Contre-indiqués en IRC sévère ou terminale (DFG < 30 mL/min/1,73 m²) — SFD 2025,
  tableau I (note 2) et Avis n° 12. La HAS (RBP 2024) ne fixe pas de seuil de DFG propre mais déconseille la
  prescription en 1re/2e intention par prudence, en raison du risque d'hypoglycémies sévères (R.61, R.69).
  Niveau de preuve : avis d'experts (`tres_faible`), pas d'essai contrôlé randomisé dédié au seuil rénal. »
- **Répaglinide** : « Peut être utilisé à tous les stades d'IRC, y compris IRC terminale (DFG
  < 15 mL/min/1,73 m²) et en dialyse, du fait d'un métabolisme hépatique prédominant, sous réserve d'une
  surveillance du risque hypoglycémique — SFD 2025, Avis n° 12 bis. La HAS (RBP 2024, Avis n° 78) confirme
  l'absence de contre-indication rénale. Niveau de preuve : avis d'experts (`tres_faible`) fondé sur la
  pharmacocinétique et l'expérience clinique, pas sur des essais dédiés en IRC terminale (population
  historiquement exclue des essais pivots — silence des RCP américain et européen en deçà de CrCl 20). »

---

*Rapport clos sur les deux sous-questions prioritaires de la mission ; le volet secondaire (KDOQI,
Endocrine Society, cohorte CPRD, sous-analyse ADVANCE) reste explicitement non vérifié, conformément à la
priorité donnée par le référent au volet français.*
