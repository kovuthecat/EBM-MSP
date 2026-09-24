# Red-team — seuils rénaux du sulfamide et du glinide (nœud `prescription`, DT2)

## Provenance
- Agent : contradicteur-preuve (B) — consignes : `.claude/agents/contradicteur-preuve.md`, dernier commit : sans objet (dépôt non git)
- Modèle : sonnet (en-tête de l'agent)
- Date : 2026-09-24
- Mode : Décision — lancement scopé et hors circuit complet (pas de rapport d'Agent A : dossier de preuve complet non monté pour ce chantier, noté ici comme absent)
- Outils disponibles : Read, Grep, Glob, WebFetch, WebSearch, Write (fichiers locaux) ; absents : Bash (donc `identite.mjs` et `verifier-registre.mjs` non appelables — non pertinents ici : aucun DOI/PMID en jeu, uniquement des PDF de recommandations françaises) ; CLI OpenEvidence (interdit à cet agent en toute hypothèse) ; connecteurs MCP mentionnés en instructions système (Consensus, ClinicalTrials.gov, Vercel, Claude Docs) — aucun schéma d'outil correspondant exposé dans cette session, donc non appelés
- Accès obtenus : sources françaises locales — `docs/decision/sources/SFD 2025.pdf`, `docs/decision/sources/HAS 2025 - Parcours de soins DT2 - guide.pdf`, `docs/decision/sources/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf`, `docs/decision/sources/prescrire-dt2.md` — lecture directe locale (voie : outil Read), texte intégral accessible pour les quatre pièces ; accès bloqués : aucun
- Rapport d'A et retour OE ouverts : après la rédaction des « Attendus » ci-dessous (aucun rapport A dans ce chantier) ; retour OE (`epreuve/entrees/OE-retour-brut-extrait.md`) ouvert après lecture complète des quatre sources françaises

## Attendus (rédigés avant ouverture du retour OE)

### SQ1 — Sulfamides hypoglycémiants et seuil de DFG en IRC

Un texte SFD/HAS sérieux sur la stratégie thérapeutique du DT2 traite presque toujours l'adaptation
des traitements à la fonction rénale dans un **tableau dédié** (adaptation posologique / place des
traitements selon le DFG), le plus souvent structuré par paliers (DFG ≥ 60, 30-59, 15-29, < 15 /
dialyse), et non dans un chapitre narratif diffus. Sur les sulfamides, j'attends :

- une **distinction par molécule** : le glibenclamide (sulfamide à métabolites actifs, longue
  durée d'action) est classiquement le plus restreint — je m'attends à une contre-indication ou une
  déconseillance à un DFG relativement élevé (autour de 60 mL/min, voire avant les autres
  sulfamides) ; le gliclazide et le glimépiride sont habituellement tolérés plus bas, avec prudence
  renforcée et contre-indication vers un DFG bas (autour de 15-30 mL/min), en raison du risque
  d'hypoglycémie par accumulation.
- des **seuils chiffrés explicites** (mL/min/1,73m²), pas seulement une formulation qualitative
  vague, car c'est le format habituel des tableaux HAS d'adaptation posologique.
- à défaut de seuils propres SFD/HAS, un **renvoi explicite à l'AMM/RCP** serait une formulation
  possible et légitime — mais je m'attendrais à ce qu'elle soit formulée comme un choix assumé
  (« se référer au RCP »), pas comme un silence total.
- Localisation attendue : tableau d'adaptation posologique selon la fonction rénale, ou fiche par
  classe médicamenteuse, dans le document HAS 2025 (parcours de soins) et/ou SFD 2025 et/ou
  « stratégie thérapeutique... recommandations ».

L'affirmation OE à contrôler (résumée dans le mandat) : « No specific SFD/HAS guideline text on
sulfonylurea eGFR thresholds was identified in the literature. French practice generally follows
ESC/EASD and EMA labelling. » — Si un tableau HAS/SFD chiffré existe, cette affirmation est fausse (omission par OE,
pas absence réelle dans les sources françaises).

### SQ2 — Répaglinide en IRC terminale/dialyse

Le répaglinide a une particularité pharmacologique connue : élimination très majoritairement
hépatobiliaire (pas rénale), ce qui en fait souvent, dans les textes français, l'un des **rares
antidiabétiques oraux positionnés comme utilisables jusqu'aux stades sévères, voire terminaux**,
de l'IRC — parfois même sans ajustement posologique selon le RCP. J'attends donc :

- une mention **explicite et positive** du répaglinide en IRC sévère/terminale/dialyse dans le
  tableau d'adaptation posologique HAS/SFD, le distinguant des sulfamides (justement parce que
  c'est l'argument clinique qui justifie son usage en pareil contexte) — pas un silence.
- si un seuil chiffré est donné, il devrait être bas ou absent (« pas de restriction connue » ou
  « utilisable quel que soit le DFG, prudence clinique »), contrairement aux sulfamides.
- Localisation attendue : même tableau d'adaptation posologique / fiche « glinides », HAS 2025 ou
  SFD 2025 ou « stratégie thérapeutique ».

L'affirmation OE à contrôler : « No specific French guideline text on repaglinide in ESRD was
identified. French practice generally follows EMA labelling, which permits use with caution in
severe renal impairment (CrCl 20-40) but is silent below CrCl 20. » — Si un texte français dit
explicitement que le répaglinide est utilisable en IRC terminale/dialyse (ce qui est l'argument
classique de cette molécule), cette affirmation OE serait fausse par omission, et de surcroît en
tension avec la position pharmacologique bien connue du répaglinide (seul glinide, élimination
hépatique).

### Note méthodologique

Ces deux sous-questions sont **décisives** au sens de `contradiction.md` §1 : elles conditionnent
un choix clinique de prescription en IRC. La lecture ci-dessous se limite au périmètre indiqué par
le mandat (quatre sources locales), avant ouverture du retour OE.

---

## Cherché dans les sources françaises, absent du retour OE

| Voie | Source, page | Trouvé | Présent chez OE ? | Effet sur la conclusion |
| --- | --- | --- | --- | --- |
| Lecture directe (tableau chiffré) | SFD 2025 (*Med Mal Metab* 2025;19:630-662), Figure 3 « Insuffisance rénale chronique (IRC) : gestion des traitements de l'hyperglycémie », p. 645 | Tableau complet, ligne par molécule (Metformine, Répaglinide, Glimépiride, Gliclazide, Acarbose, gliptines, gliflozines, AR GLP-1/GIP-GLP-1, Insuline) × 4 paliers de DFG (60-89 ; 30-44 et 45-59 ; 15-29 ; < 15 ou dialyse), avec code couleur « pas de réduction / réduction de la dose / non indiqué » | **Absent** — OE affirme l'inverse (« No specific SFD/HAS guideline text... was identified ») | Falsifie directement l'affirmation centrale d'OE sur SQ1 (et éclaire SQ2 pour le répaglinide) |
| Lecture directe (texte narratif) | SFD 2025, Avis n° 12 et Avis n° 12 bis, p. 643-644 | Texte explicite : SU **contre-indiqués** en IRC sévère (DFG 15-29) et terminale (DFG < 15) ; à l'inverse, en IRC sévère et terminale, seuls insuline, **répaglinide**, certains iDPP4 à dose réduite, et certains AR GLP-1/iSGLT2 selon indication restent utilisables | **Absent** des deux côtés du retour OE (ni la contre-indication chiffrée des SU, ni l'autorisation explicite du répaglinide en IRC terminale ne sont mentionnées comme françaises) | Falsifie SQ1 et SQ2 simultanément |
| Lecture directe | SFD 2025, Tableau I, note de bas de page 2, p. 633 | « Les sulfamides hypoglycémiants sont contre-indiqués en cas d'IRC sévère ou terminale » — énoncé synthétique, répété à trois endroits du document | Absent | Renforce le constat : ce n'est pas une mention isolée mais une position répétée du texte |
| Lecture directe | `docs/decision/sources/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf` (HAS 2024), R.78, p. 23 | « répaglinide (demi-vie courte) et en raison de sa « non-CI » en cas de maladie rénale » — mention HAS, moins chiffrée que la SFD mais convergente | Absent | Confirme SQ2 depuis une seconde source française (HAS, pas seulement SFD) |
| Recherche de date de publication | SFD 2025 : disponible en ligne le 13 novembre 2025 (p. 630) ; HAS 2024 : juin 2024 ; HAS 2025 (parcours de soins) : juin 2025 | Les trois documents sont antérieurs de plusieurs mois à la date du retour OE (2026-07-27) | — | Écarte l'hypothèse d'un simple défaut de couverture temporelle : la lacune d'OE est une lacune de recherche/synthèse, pas une question d'antériorité de la source |
| Lecture directe (contexte, non officiel) | `docs/decision/sources/prescrire-dt2.md`, section P1=P4 | Glibenclamide « à écarter si risque d'hypoglycémie grand (âgé, IR) » — formulation qualitative, pas de seuil DFG chiffré ; Prescrire ne discute pas le répaglinide en IRC terminale | Non applicable (Prescrire n'est pas une recommandation SFD/HAS, cf. distinction imposée par le mandat) | Aucun effet direct sur SQ1/SQ2 ; confirme seulement que la prudence sur les sulfamides en IR est un point de consensus au-delà de la seule SFD |

## Findings

### Finding 1 — SQ1 — Sévérité HAUTE — Origine OE

**Passage OE contesté** (section 1, ligne « French SFD / HAS ») : « No specific SFD/HAS guideline
text on sulfonylurea eGFR thresholds was identified in the literature. French practice generally
follows ESC/EASD and EMA labelling. »

**Passage source qui le contredit** : SFD 2025, *Med Mal Metab* 2025;19:630-662 (disponible en
ligne le 13/11/2025) :
- Figure 3, p. 645 : tableau chiffré par molécule × 4 paliers de DFG (60-89 ; 30-44/45-59 ; 15-29 ;
  < 15 ou dialyse), incluant explicitement le glimépiride et le gliclazide, avec statut « pas de
  réduction / réduction de dose / non indiqué » pour chaque palier.
- Avis n° 12, p. 643 : « Chez les patients vivant avec un DT2 et présentant une IRC sévère (DFG
  entre 15 et 29 mL/min/1,73 m²) ou terminale (DFG < 15 mL/min/1,73 m²), on visera une HbA1c cible
  ≤ 8 % (64 mmol/mol), avec une limite inférieure de 7 % (53 mmol/mol) en cas de traitement par
  glinide ou insuline (**SU contre-indiqués**), pour minimiser le risque hypoglycémique. »
- Tableau I, note 2, p. 633 : « Les sulfamides hypoglycémiants sont contre-indiqués en cas d'IRC
  sévère ou terminale. »

**Analyse** : l'affirmation d'OE n'est pas une nuance ni une simplification — elle est factuellement
fausse. Un texte français (SFD), cité par son nom exact dans la propre ligne d'OE, porte un seuil
chiffré (DFG < 30 mL/min/1,73 m², avec distinction entre 15-29 et < 15) et une contre-indication
formelle des sulfamides, répétée à trois endroits du document. Ce texte est antérieur de plusieurs
mois à la date du retour OE : la lacune n'est pas un problème de couverture temporelle, c'est un
échec de recherche/synthèse sur la littérature française par langue ou par indexation.

**Sévérité** : HAUTE — l'affirmation erronée porte directement sur l'objet de la sous-question
décisive et pourrait conduire à rédiger un argumentaire de nœud qui déclare, à tort, l'absence de
position française chiffrée.

### Finding 2 — SQ2 — Sévérité HAUTE — Origine OE

**Passage OE contesté** (tableau « Comparison with Sulfonylureas... », ligne « French HAS/SFD ») :
« No specific French guideline text on repaglinide in ESRD was identified. French practice
generally follows EMA labelling, which permits use with caution in severe renal impairment
(CrCl 20-40) but is silent below CrCl 20. »

**Passage source qui le contredit** : SFD 2025, Avis n° 12 bis, p. 644 : « Au stade d'IRC terminale
(DFG < 15 mL/min/1,73 m²), parmi les molécules commercialisées en France, seuls l'insuline, **le
répaglinide** (avec un risque d'hypoglycémies pour ces deux traitements), la vildagliptine à la
dose de 50 mg/j et la sitagliptine à la dose de 25 mg/j (forme non commercialisée en France)
peuvent être utilisés. » Corroboré, avec une formulation moins chiffrée mais convergente, par HAS
2024 (« Stratégie thérapeutique du patient vivant avec un diabète de type 2 »), R.78, p. 23 :
« répaglinide (demi-vie courte) et en raison de sa « non-CI » en cas de maladie rénale ».

**Analyse** : la SFD ne se contente pas de renvoyer à l'AMM européenne — elle prend une position
propre, plus permissive que ce qu'OE prête à l'« EMA labelling » (silencieux sous CrCl 20 selon OE),
en autorisant explicitement le répaglinide jusqu'au stade DFG < 15 mL/min/1,73 m², catégorie qui
en nomenclature française recouvre l'IRC terminale (y compris les patients dialysés). C'est
exactement l'argument pharmacologique qu'OE développe par ailleurs pour les sources anglo-saxonnes
(métabolisme hépatique, absence de métabolites actifs, demi-vie courte) — mais appliqué et assumé
par une société savante française, ce qu'OE affirme à tort ne pas exister.

**Sévérité** : HAUTE — même raisonnement que le Finding 1 : la sous-question est décisive, et
l'erreur porte sur l'existence même d'une position française, pas sur un détail secondaire.

## Confirmations obtenues

- **Confirmé** : les sulfamides sont d'usage déconseillé/contre-indiqué en IRC — cohérent entre
  Prescrire (glibenclamide « à écarter si risque d'hypoglycémie grand... IR »), HAS 2024/2025
  (renvoi au chapitre iatrogénie/adaptation rénale) et SFD 2025 (contre-indication chiffrée). Lu
  directement dans `prescrire-dt2.md`, `strategie_therapeutique...pdf` et `SFD 2025.pdf` — trois
  sources concordantes, chacune lue dans son texte intégral local.
- **Confirmé, avec nuance** : le répaglinide est présenté comme mieux toléré que les sulfamides en
  IRC en raison de son métabolisme hépatique — argument identique de part et d'autre (littérature
  anglo-saxonne citée par OE, HAS 2024 et SFD 2025). Localisation : SFD 2025 Avis n° 12 bis p. 644 ;
  HAS 2024 R.61 et R.78, p. 20 et 23.
- **Non vérifié, hors périmètre** : les affirmations d'OE sur KDIGO 2022, l'Endocrine Society 2019,
  l'ADA 2026, le label FDA et l'EMA SmPC n'ont pas été contrôlées contre leurs sources primaires
  (hors périmètre du mandat, qui priorise les recommandations françaises). Elles ne sont ni
  confirmées ni infirmées par ce rapport.

## Objections retirées

Aucune. La lecture indépendante n'a fait naître aucune objection qui se soit ensuite révélée non
fondée : les deux doutes formulés dans les « Attendus » (existence d'un tableau chiffré français ;
position positive du répaglinide en IRC terminale) se sont l'un et l'autre confirmés à la lecture,
et sont devenus les Findings 1 et 2 ci-dessus plutôt que des objections écartées.

## Décompte

| | HAUTE | MOYENNE | BASSE | Total |
| --- | --- | --- | --- | --- |
| Origine OE (erreur propre au retour) | 2 | 0 | 0 | 2 |
| Origine source elle-même | 0 | 0 | 0 | 0 |
| Non vérifiable | 0 | 0 | 0 | 0 |
| Omission (présent en français, absent d'OE) | voir tableau « Cherché... » (6 lignes, dont 4 rattachées aux Findings 1-2) | | | |
| **Total findings** | **2** | **0** | **0** | **2** |

## Verdict par sous-question

**SQ1 — Sulfamides et seuil de DFG en IRC : le retour OE n'est PAS fiable sur ce point.**
L'affirmation selon laquelle aucun texte SFD/HAS ne porterait de seuil de DFG chiffré pour les
sulfamides est fausse. La SFD 2025 fournit un tableau chiffré par molécule et par palier de DFG,
avec contre-indication formelle en IRC sévère/terminale (DFG < 30 mL/min/1,73 m², affinée en deux
sous-paliers 15-29 et < 15), répétée à trois endroits du document. Ce texte était disponible plus
de huit mois avant la date du retour OE. Toute utilisation de ce retour OE pour affirmer un vide
de recommandation française serait une erreur transmise telle quelle dans l'argumentaire du nœud.

**SQ2 — Répaglinide en IRC terminale/dialyse : le retour OE n'est PAS fiable sur ce point.**
L'affirmation selon laquelle aucun texte français ne traiterait du répaglinide en IRC terminale, et
que la pratique française se limiterait à un silence de l'EMA sous CrCl 20, est fausse. La SFD 2025
autorise explicitement le répaglinide au stade DFG < 15 mL/min/1,73 m² (catégorie qui recouvre la
dialyse en nomenclature française), avec la même justification pharmacologique que celle
développée par OE pour les sources anglo-saxonnes. HAS 2024 corrobore avec une formulation moins
chiffrée mais convergente (« non-CI » en cas de maladie rénale).

## Proposition de libellé (sous réserve de validation par le référent)

Pour le nœud `prescription` (argumentaire situationnel IRC, à faire trancher par le référent) :

> **Sulfamides hypoglycémiants en IRC** : contre-indiqués en cas d'IRC sévère ou terminale
> (DFG < 30 mL/min/1,73 m²) — SFD, *Prise de position 2025*, p. 633 et 643 (Avis n° 12). Avant ce
> stade (DFG 30-59), utilisables avec prudence et adaptation de dose (glimépiride, gliclazide),
> avec surveillance accrue du risque hypoglycémique — SFD 2025, Figure 3, p. 645.
>
> **Répaglinide en IRC sévère/terminale** : reste utilisable, y compris au stade IRC terminale
> (DFG < 15 mL/min/1,73 m², dialyse incluse), en raison de son élimination hépatique et de
> l'absence de métabolites actifs — mais avec un risque d'hypoglycémie propre à surveiller
> (demi-vie courte, administration au moment des repas) — SFD 2025, Avis n° 12 bis, p. 644 ; HAS
> 2024, R.78, p. 23.

Cette proposition n'engage que la lecture des sources ; elle reste soumise à la décision du
référent et à une éventuelle vérification complémentaire de l'AMM/RCP français en vigueur avant
inscription définitive dans le nœud.
