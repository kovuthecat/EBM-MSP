# Preuve — instrument de repérage des TCA pour le nœud `rhd-alimentation`

> **Mission.** Collecte de preuve, domaine diabète de type 2, module RHD. Répond à la question posée par
> l'incertitude du nœud `content/noeuds/diabete-type-2/rhd-alimentation.yaml` : le « verrou de repérage »
> (`verrou_tca`, 3 signes reformulés de la HAS) devrait-il être remplacé ou adossé à un instrument validé ?
>
> **Statut.** Collecte agent (A). Contre-partie de triangulation : `OE-prompts.md` § OE-1.
> Aucun fichier de `content/**` n'a été modifié.
>
> **Convention de lecture.** Tout ce qui suit distingue explicitement **[SOURCE]** (ce que la source dit) de
> **[DÉDUCTION]** (ce que j'en tire) et de **[NON VÉRIFIÉ]** (ce que je n'ai pas pu ouvrir).

---

## 1. Verdict en une phrase

**Oui pour (a)(b)(c), non pour (d)** : le **SCOFF-F** est un instrument de repérage des TCA validé en
français, à 5 questions, remplissable en moins de 3 minutes, et explicitement recommandé par la HAS —
mais **aucun instrument de repérage des TCA n'a été validé chez l'adulte diabétique de type 2**, ni en
français ni dans aucune autre langue jusqu'en 2025, et les deux instruments diabéto-spécifiques (DEPS-R,
mSCOFF) sont des outils de **diabète de type 1** dont la HAS et la SFD disent elles-mêmes qu'ils n'ont
pas de version française validée.

**Conséquence pour l'incertitude actuelle du nœud :** elle est *fausse au sens littéral* (« aucun n'a été
trouvé dans les sources locales » — SCOFF-F existe et est recommandé par la HAS) mais *juste au sens
utile* (aucun instrument n'est validé dans la population du nœud). Elle doit être **corrigée, pas
supprimée**.

---

## 2. Tableau comparatif

| Instrument | Items | Passation | Validé en **français** ? | Population de validation | Validé chez l'**adulte DT2** ? | Accès / droit |
|---|---|---|---|---|---|---|
| **SCOFF-F** | 5 (oui/non), seuil ≥ 2 | **< 3 min** [SOURCE SFD 2025] | **Oui** — 2 études (Garcia 2010, Garcia 2011) | **Femmes uniquement** : 400 étudiantes ; 226 femmes (112 patientes TCA + 114 témoins) | **Non** | Publié BMJ 1999 ; les 5 items en français sont reproduits par la **HAS elle-même** (RBP 2010, §2.3 p. 7), document public |
| **mSCOFF** | 5 (5ᵉ item = omission d'insuline) | ≈ SCOFF | **Non** — « il n'existe pas de version validée en langue française » [SOURCE SFD 2025] | 43 **adolescentes** DT1 (15,8 ans), comparateur = EDI-3 | **Non** (DT1 pédiatrique) ; 5ᵉ item sans objet hors insuline | Diabetes Care 2014, texte payant |
| **DEPS-R** | 16 (Likert 0-5), seuil ≥ 20 | < 10 min [SOURCE SFD 2025] | **Non confirmé** — seule trace = un **résumé de congrès** (Can J Diabetes 2013;37:60) ; la SFD écrit que la validation FR « reste à confirmer dans la littérature » | DT1 pédiatrique (Markowitz 2010) | **Non** — « 6 des 16 items sont spécifiques de l'insulinothérapie intensifiée » [SOURCE Klinker 2025] | 16 items FR reproduits par la SFD (tableau III, 2025) |
| **DEPS-10** | 10, seuil ≥ 15 | non précisé | **Non** (allemand) | **679 adultes DT1 *et* DT2**, âge moyen 53,8 ans, Allemagne ; référence = entretien Mini-DIPS DSM-5 | **Oui — le seul**, mais en allemand, publié en 2025 | Diabet Med 2025 |
| **ESP** | 5 questions | très brève | **Aucune validation FR trouvée** (bien que la HAS 2019 le cite) | 104 patients de soins primaires + 129 étudiants, 12 % de TCA | **Non** | J Gen Intern Med 2003 |
| **EDE-Q** | 28 | long | Version FR étudiée, mais **analyse factorielle seulement** (Carrard 2015) — aucune Se/Sp, aucun seuil de repérage | 116 femmes hyperphagie boulimique + 161 sans TCA | **Non** | © Fairburn & Beglin |
| **EDE-QS** | 12 | brève | **Aucune validation FR trouvée** | — | **Non** | — |

---

## 3. Ce qui est établi, instrument par instrument

### 3.1. SCOFF / SCOFF-F — le seul candidat sérieux

**Instrument d'origine** [SOURCE, vérifié sur PubMed]
Morgan JF, Reid F, Lacey JH. *The SCOFF questionnaire: assessment of a new screening tool for eating
disorders.* BMJ 1999;319(7223):1467-8. **PMID 10582927**, DOI 10.1136/bmj.319.7223.1467.
⚠️ La notice PubMed ne comporte **pas d'abstract** : j'ai vérifié auteurs / titre / revue / année, **pas**
les performances originales.

**Validation française nº 1** [SOURCE, notice PubMed ouverte et lue]
Garcia FD, Grigioni S, Chelali S, Meyrignac G, Thibaut F, Dechelotte P. *Validation of the French version
of SCOFF questionnaire for screening of eating disorders among adults.* World J Biol Psychiatry
2010;11(7):888-93. **PMID 20509759**, DOI 10.3109/15622975.2010.483251.
- Population : **400 étudiantes** (médecine préventive universitaire, France), **37 TCA (9,3 %)** — 8 anorexies, 29 boulimies.
- Référence : **MINI (version française validée) + critères DSM-IV**, évaluateur en aveugle du questionnaire.
- Seuil ≥ 2 réponses positives : **Se 94,6 % · Sp 94,8 % · VPP 65 % · VPN 99 % · AUC 96,2 %**.

**Validation française nº 2** [SOURCE, notice PubMed ouverte et lue]
Garcia FD, Grigioni S, Allais E, Houy-Durand E, Thibaut F, Déchelotte P. *Detection of eating disorders in
patients: validity and reliability of the French version of the SCOFF questionnaire.* Clin Nutr
2011;30(2):178-81. **PMID 20971536**, DOI 10.1016/j.clnu.2010.09.007.
- Population : **226 femmes** — 67 anorexies, 45 boulimies, 114 étudiantes témoins appariées sur l'âge (unité de nutrition clinique, CHU de Rouen). **Design cas-témoins.**
- Référence : MINI + DSM-IV, évaluateur en aveugle.
- Seuil ≥ 2 : **Se 94,6 % · Sp 94,7 % · AUC 97,9 %**, kappa de Cohen 89 %.

**Le contrepoids, et il est lourd** [SOURCE, notice PubMed ouverte et lue]
Kutz AM, Marsh AG, Gunderson CG, Maguen S, Masheb RM. *Eating Disorder Screening: a Systematic Review and
Meta-analysis of Diagnostic Test Characteristics of the SCOFF.* J Gen Intern Med 2020;35(3):885-93.
**PMID 31705473**, DOI 10.1007/s11606-019-05478-6.
- 25 études de validation. **Se poolée 0,86 (IC95 0,78-0,91) · Sp poolée 0,83 (IC95 0,77-0,88).**
- Citations : les études à sensibilité la plus élevée « tended to be case-control studies of young women
  with anorexia nervosa and bulimia nervosa » ; celles incluant **plus d'hommes**, incluant
  l'**hyperphagie boulimique**, et recrutant en **population communautaire** « tended to have lower
  sensitivity ».
- Conclusion des auteurs : « there is **not enough evidence to support utilizing the SCOFF for screening
  for the range of DSM-5 eating disorders in primary care and community-based settings** ».

**Illustration de l'effondrement de la VPP hors population à risque** [SOURCE, PMC ouvert et lu]
Lähteenmäki S, Aalto-Setälä T, Suokas JT, et al. *Validation of the Finnish version of the SCOFF
questionnaire among young adults aged 20 to 35 years.* BMC Psychiatry 2009;9:5. DOI 10.1186/1471-244X-9-5
(PMC2656502). n = 541 (312 femmes), population générale, référence SCID-I.
Seuil ≥ 2 : **Se 77,8 % · Sp 87,8 % · VPP 9,7 % · VPN 99,6 %**.

**Statut institutionnel français** [SOURCE, PDF HAS ouverts et lus intégralement]
- **HAS, *Anorexie mentale : prise en charge*, RBP juin 2010, §2.3 p. 7.** Il est recommandé, pour les
  populations à risque, « de poser systématiquement une ou deux questions simples sur l'existence de TCA »
  **ou** « d'utiliser le questionnaire **SCOFF-F** (initialement DFTCA : définition française des troubles
  du comportement alimentaire, traduction française validée du SCOFF) **en tête à tête avec le patient, où
  deux réponses positives sont fortement prédictives d'un TCA** ». La HAS **reproduit intégralement les
  5 items en français** à cette page. Recommandation **non gradée** (accord professionnel) : la gradation
  A/B/C du §1.4 n'est pas apposée à ce paragraphe.
- **HAS, *Boulimie et hyperphagie boulimique — Repérage*, Fiche outil 1, juin 2019.** Section « Évaluation
  initiale » : le repérage repose « **soit** sur une évaluation clinique globale qui peut inclure des
  questions spécifiques » (5 questions listées) « **soit** sur l'utilisation d'un **questionnaire court
  adapté et validé (SCOFF-F, ESP, etc.)** ».
- **SFD / SFD Paramédical 2025** (cf. § 3.7) : « le SCOFF est un questionnaire en cinq questions, **validé
  en français**, largement utilisé pour détecter les TCA en population générale. Il nécessite **moins de
  3 min** pour être rempli. » La référence [47] de la SFD pour « validé en français » est **Garcia 2011,
  Clin Nutr** — c'est-à-dire exactement la source vérifiée ci-dessus.

**Ce qui manque, et c'est central pour ce nœud** [DÉDUCTION]
Les deux validations françaises portent **exclusivement sur des femmes jeunes** (étudiantes, patientes
d'une unité de nutrition clinique) avec une **prévalence de TCA de 9,3 % à 50 %**. Le patient type du nœud
`rhd-alimentation` est un adulte des deux sexes, d'âge moyen ou avancé, en surpoids, chez qui le TCA
attendu est l'**hyperphagie boulimique** — soit précisément les trois conditions (hommes, hyperphagie
boulimique, faible prévalence) où Kutz 2020 documente une chute de performance. **Utiliser le SCOFF-F ici,
c'est faire une extrapolation, et il faut le dire.**

### 3.2. mSCOFF — écarté

[SOURCE, notice PubMed ouverte] Zuijdwijk CS, Pardy SA, Dowden JJ, Dominic AM, Bridger T, Newhook LA.
*The mSCOFF for screening disordered eating in pediatric type 1 diabetes.* Diabetes Care 2014;37(2):e26-7.
**PMID 24459158**, DOI 10.2337/dc13-1637. **Pas d'abstract sur PubMed.**

- Établi : **43 adolescentes** vivant avec un DT1 (âge moyen 15,8 ± 1,7 ans ; durée du diabète 7,6 ans ;
  IMC 25,5 ; HbA1c 8,4 %). Comparateur = **EDI-3**, c'est-à-dire un **auto-questionnaire, pas un entretien
  diagnostique** — ce n'est donc pas une étude de performance diagnostique au sens strict.
- Modification : le 5ᵉ item du SCOFF est remplacé par une question sur la **sous-dosage volontaire
  d'insuline**.
- [SOURCE SFD 2025] « Le SCOFF a été adapté pour les patients vivant avec un DT1 en modifiant le cinquième
  item afin d'aborder la notion d'omission d'insuline (mSCOFF) **mais il n'existe pas de version validée en
  langue française**. »
- [DÉDUCTION] Doublement hors périmètre : population (adolescentes DT1), et item-clé sans objet chez un
  patient DT2 non insuliné — c'est-à-dire la quasi-totalité des patients de ce nœud.

### 3.3. DEPS-R — écarté, et la « validation française » n'en est pas une

- Instrument original : Markowitz JT, Butler DA, Volkening LK, et al., Diabetes Care 2010;33:495-500 —
  16 items, DT1 pédiatrique. [NON VÉRIFIÉ directement : référence lue dans la bibliographie SFD 2025 [49],
  notice non ouverte.]
- [SOURCE SFD 2025, § « Facteurs de risque et repérage »] : « **bien qu'un résumé canadien mentionne une
  validation française (QACD, Questionnaire des attitudes et des comportements liés à la gestion du
  diabète), celle-ci reste à confirmer dans la littérature.** » Le résumé en question est la référence
  [52] de la SFD : **Gagnon C, Aimé A, Bélanger C. *French validation of the Diabetes Eating Problem
  Survey-Revised (DEPS-R)*. Can J Diabetes 2013;37:60** — un **résumé de congrès d'une page**.
- Un article complet de 2017 (*Psychometric properties of the French DEPS-R*, Gagnon, Aimé, Bélanger) est
  visible en ligne, publié dans **BAOJ Diabetes** (éditeur BioAccent). [NON VÉRIFIÉ] : revue **non indexée
  dans PubMed** (une recherche PubMed « Diabetes Eating Problem Survey » + French ne renvoie **aucun**
  résultat), éditeur cité dans la littérature sur les revues prédatrices, texte intégral non ouvrable
  (403). **Je ne le retiens pas comme validation.** Il est notable que la SFD 2025, qui a passé la
  littérature en revue, ne le cite pas non plus.
- [SOURCE Klinker 2025] La DEPS-R « was developed for use among individuals with type 1 diabetes » et
  « **six of the 16 items are specific to intensified insulin therapy** ».
- [DÉDUCTION] Écarté sur trois motifs cumulés : pas de validation française confirmée, instrument DT1,
  et plus d'un tiers des items inapplicables au DT2 non insuliné.

### 3.4. DEPS-10 — le seul instrument réellement validé chez l'adulte DT2, mais pas en français

[SOURCE, texte intégral PMC ouvert et lu] Klinker LY, Schmitt A, Ehrmann D, Kulzer B, Hermanns N.
*Detecting clinical cases of binge eating in diabetes care: Introducing the Diabetes Eating Problem
Survey-10 (DEPS-10) for type 1 and type 2 diabetes.* Diabet Med 2025;42(8):e70060.
DOI 10.1111/dme.70060 (PMC12257434).

- **10 items**, dérivés de la DEPS-R par retrait des items insulino-spécifiques, précisément pour être
  utilisable quel que soit le traitement.
- **n = 679 adultes vivant avec un DT1 ou un DT2**, âge moyen **53,8 ans**, Allemagne, **en allemand**.
- Référence : **entretien clinique structuré Mini-DIPS Open Access, critères DSM-5**.
- Repérage de l'hyperphagie boulimique, seuil ≥ 15 : **Se 87,5 % · Sp 86,9 % · AUC 0,92 · VPP 19,6 % ·
  VPN 99,5 %**.
- [DÉDUCTION] Deux enseignements. (1) C'est la démonstration qu'un tel instrument *peut* exister pour
  l'adulte DT2 — et qu'il n'existait pas avant 2025. (2) La **VPP mesurée de 19,6 %** dans la population
  cible est la donnée la plus instructive de tout ce dossier : même un instrument conçu et validé pour
  cette population donne **4 faux positifs pour 1 vrai** — tandis que la **VPN de 99,5 %** est excellente.
  Aucune version française n'existe.

### 3.5. ESP — cité par la HAS, mais aucune validation française trouvée

[SOURCE, notice PubMed ouverte] Cotton MA, Ball C, Robinson P. *Four simple questions can help screen for
eating disorders.* J Gen Intern Med 2003;18(1):53-6. **PMID 12534764**.
- Population : **104 patients de soins primaires + 129 étudiants**, 12 % de TCA.
- Résultat tel qu'énoncé par l'abstract : « One or no abnormal responses to the ESP ruled out an eating
  disorder (**LR 0,0**), whereas 3 or more abnormal responses ruled one in (**LR 11**) ». L'abstract
  précise que le SCOFF s'est révélé **moins sensible qu'attendu** dans cette étude.
- ⚠️ Le couple « **Se 100 % / Sp 71 %** » très largement recopié dans la littérature secondaire n'a **pas**
  été retrouvé dans la source primaire. **[NON VÉRIFIÉ]** — ne pas le citer.
- **Aucune validation française trouvée** (recherches PubMed et web, en français et en anglais).
  [DÉDUCTION] La fiche HAS 2019 range pourtant l'ESP parmi les « questionnaire[s] court[s] **adapté[s] et
  validé[s]** » : c'est, à ma connaissance, **inexact pour l'usage en français**. À signaler au référent.

### 3.6. EDE-Q / EDE-QS — écartés (outils d'évaluation, pas de repérage bref)

- **EDE-Q** : 28 items. Version française [SOURCE, notice PubMed ouverte] : Carrard I, Rebetez MML, Mobbs O,
  Van der Linden M. *Factor structure of a French version of the Eating Disorder Examination-Questionnaire
  among women with and without binge eating disorder symptoms.* Eat Weight Disord 2015;20(1):137-44.
  **PMID 25194301**, DOI 10.1007/s40519-014-0148-x. 116 femmes avec hyperphagie boulimique (seuil ou
  sous-seuil) + 161 sans TCA. **C'est une analyse factorielle confirmatoire** : elle compare des modèles
  structurels, elle ne fournit **ni sensibilité, ni spécificité, ni seuil de repérage**. Ce n'est donc pas
  une validation d'un outil de repérage.
- **EDE-QS** (12 items, Gideon et al., PLoS One 2016 — [NON VÉRIFIÉ dans le détail : notice repérée mais
  non ouverte]) : **aucune validation française trouvée**.
- [SOURCE SFD 2025] La SFD range EDE-Q, EDI et DEBQ non pas dans le repérage mais dans ce qui « permet[]
  d'évaluer plus finement les différentes dimensions des TCA, et d'élaborer un plan de soins », en
  deuxième temps après un dépistage positif.

### 3.7. La source française la plus récente et la plus proche du sujet — et elle est explicitement DT1

[SOURCE, PDF ouvert et lu, p. 361-378] Hanaire H, Darmon P, Iceta S, Betry C, Gastaldi G, Achamrah N,
et al. ***Troubles des conduites alimentaires et diabète de type 1 : prise de position de la SFD et de la
SFD Paramédical.*** Médecine des maladies Métaboliques 2025;19(5):361-378. DOI 10.1016/j.mmm.2025.06.002.

Groupe de travail francophone (France, Belgique, Suisse, Canada, Algérie), sous l'égide de la SFD.
C'est **le** document français de référence sur TCA + diabète — et son périmètre est le **type 1**.
Ses positions utiles ici :
- SCOFF **validé en français**, 5 questions, **< 3 min** ;
- mSCOFF : **pas de version française validée** ;
- DEPS-R : validation française **à confirmer** ;
- encadré de synthèse : « Un dépistage “systématique” des TCA et des CAP est souhaitable […] Les outils
  existent (questionnaires m-SCOFF, DEPS-R). **Le diagnostic doit être validé.** »
- La SFD reproduit les items en français : **tableau II** (SCOFF et sa modification mSCOFF) et
  **tableau III** (QACD / DEPS-R 16 items, seuil ≥ 20).

---

## 4. Le point décisif : personne n'a validé de repérage TCA chez l'adulte DT2

Trois sources indépendantes convergent, et deux d'entre elles sont institutionnelles françaises :

1. **[SOURCE HAS 2019, Fiche outil 1, « Situations à risque »]** — « variations importantes de l'HbA1c ou
   du poids chez les patients diabétiques (**il existe des questionnaires de dépistage des troubles des
   conduites alimentaires adaptés aux sujets atteints de diabète de type 1** [type DEPS-R, m-EDI,
   m-SCOFF]) ». La HAS **cantonne elle-même ces outils au type 1**.
2. **[SOURCE HAS 2010, §2.2]** — les populations à risque incluent les « sujets atteints de pathologies
   impliquant des régimes telles que **le diabète de type 1**, l'hypercholestérolémie familiale etc. ».
   Le type 2 n'est pas listé.
3. **[SOURCE, PMC ouvert et lu]** Esmer AC, Jalal Z, Guo P, Seckin M. *Prevalence and associated factors of
   eating disorders in adults with type 2 diabetes: a systematic review.* J Eat Disord 2025.
   DOI 10.1186/s40337-025-01391-y (PMC12465268). **12 études, 9 instruments différents** (EAT-26, EDE-Q,
   NEQ, QEWP-R, BES, QEWP-26, TFEQ, EDE-12.0D, SCOFF) — aucune homogénéité, et la revue **ne rapporte
   aucun instrument validé pour cette population**.

**Prévalence dans le DT2, pour cadrer l'enjeu** [SOURCE, PMC ouvert et lu]
Abbott S, Dindol N, Tahrani AA, Piya MK. *Binge eating disorder and night eating syndrome in adults with
type 2 diabetes: a systematic review.* J Eat Disord 2018;6:36. **PMID 30410761**,
DOI 10.1186/s40337-018-0223-1. 10 études, 6 527 participants dépistés pour l'hyperphagie boulimique :
**prévalence ponctuelle 1,2-8,0 %** (jusqu'à 25,6 % dans une petite étude sur questionnaire seul) ;
syndrome d'alimentation nocturne 3,8-8,4 %. La revue 2025 donne une fourchette plus large encore
(**2,5-29,6 %**), reflet de l'hétérogénéité des instruments.

### 4.1. Calcul illustratif — **[DÉDUCTION, arithmétique de l'auteur, pas une source]**

En appliquant les performances *poolées* du SCOFF (Kutz 2020 : Se 0,86 / Sp 0,83) à une prévalence
d'hyperphagie boulimique de **5 %** (milieu de la fourchette Abbott 2018) :

- **VPP ≈ 21 %** → environ **4 dépistages positifs sur 5 seraient des faux positifs** ;
- **VPN ≈ 99 %** → un dépistage négatif est très informatif.

Ce résultat est cohérent avec les deux VPP réellement mesurées dans des populations à faible prévalence :
**9,7 %** (SCOFF, population générale finlandaise) et **19,6 %** (DEPS-10, adultes DT1+DT2). L'asymétrie
VPP/VPN est le fait le plus solide et le plus actionnable de tout ce dossier.

---

## 5. Ce que ça changerait concrètement pour le nœud

### 5.1. D'abord, une bonne nouvelle : la reformulation actuelle est fidèle

Vérification faite sur la source locale (`docs/decision/sources/guide HAS._parcours_surpoids-obesite_de_ladulte.pdf`,
**Encadré 11 p. 43**, HAS *Guide du parcours de soins : surpoids et obésité chez l'adulte*, janvier 2023,
mise à jour février 2024), les 3 signes du nœud correspondent bien au texte HAS :

| Critère du nœud | Texte de l'encadré 11 |
|---|---|
| `signe_restriction_puis_craquage` | « restriction cognitive ou contrôle de l'alimentation […] avec, parfois, une **alternance avec des épisodes de désinhibition** » |
| `signe_manger_cache_ou_culpabilite` | « **manger seul ou en cachette** […] se sentir **dégoûté de soi-même, triste ou coupable** après avoir mangé » |
| `signe_antecedent_regime_restrictif` | « **demande de régime amaigrissant** ou de perte de poids ; **habitudes alimentaires restrictives**, exclusions alimentaires » |

Et l'encadré 11 **ne cite aucun instrument** — la mention actuelle du nœud (« ce n'est pas un score ») est
donc exacte pour cette source. Le problème n'est pas la fidélité, c'est le **statut** revendiqué.

### 5.2. Recommandation — **garder le verrou, ne pas le remplacer par un score, mais le ré-adosser**

**[DÉDUCTION — proposition soumise à l'arbitrage du référent]**

1. **Ne PAS remplacer le verrou par le SCOFF-F.** Motifs : jamais validé chez l'adulte DT2 ni chez
   l'homme en français ; Kutz 2020 déconseille explicitement l'usage en soins primaires pour l'ensemble
   des TCA du DSM-5 ; VPP attendue ≈ 20 %. Un verrou qui bloque 4 patients à tort sur 5 dégraderait la
   décision, alors que le verrou actuel est un **filet à signes d'appel**, pas un test.
2. **Corriger l'incertitude** — c'est le changement le plus important et le plus sûr. La formulation
   actuelle (« aucun n'a été trouvé dans les sources locales ») est réfutable en une recherche. Remplacer
   par la version exacte : *un instrument bref validé en français existe (SCOFF-F, 5 questions, < 3 min,
   recommandé par la HAS 2010 et 2019) ; mais il n'a été validé que chez des femmes jeunes, jamais chez
   l'adulte diabétique de type 2, et sa sensibilité baisse précisément là où ce nœud opère (hommes,
   hyperphagie boulimique, faible prévalence). Aucun instrument diabéto-spécifique n'a de version
   française validée : la HAS et la SFD réservent explicitement DEPS-R et mSCOFF au diabète de type 1.*
3. **Nommer le SCOFF-F comme option d'approfondissement**, dans le texte d'orientation d'une option de
   repérage positif — pas comme critère, pas comme score calculé par le moteur. Formulation possible :
   *« pour objectiver, la HAS recommande le SCOFF-F (5 questions, moins de 3 minutes, deux réponses
   positives fortement prédictives) — validé en français mais pas chez l'adulte diabétique de type 2. »*
   Cela transforme une incertitude passive en une **conduite à tenir**.
4. **Exploiter l'asymétrie VPP/VPN** — c'est le contenu EBM à valeur ajoutée. Un SCOFF-F **négatif** est
   informatif (VPN ≈ 99 %) et peut raisonnablement **lever** la prudence ; un SCOFF-F **positif** n'est
   **pas** un diagnostic et n'ouvre qu'une orientation. Le nœud dit déjà cela en substance
   (« il ouvre une orientation, pas un verdict ») — il peut désormais le dire **avec un chiffre et une
   source**.
5. **Point à arbitrer — un déclencheur que le nœud n'a pas.** [SOURCE HAS 2019, Fiche outil 1] :
   « **Rechercher systématiquement une hyperphagie boulimique : en cas de situation de surpoids ou
   d'obésité** ». La majorité des patients de ce nœud sont en surpoids ou obèses. La HAS recommande donc
   pour eux une recherche **systématique** — plus large que le déclenchement sur 3 signes d'appel. Faut-il
   que le verrou s'active aussi sur l'IMC ? **Argument contre** : cela ferait basculer une part majoritaire
   des patients dans le verrou et bloquerait le cœur utile du nœud. **Argument pour** : c'est ce que dit la
   HAS, et l'hyperphagie boulimique est justement le TCA prévalent en DT2. **Piste médiane** : ne pas
   étendre le *verrou* (qui bloque), mais ajouter une **alerte** (D15/`AlertList`, déjà câblée depuis le
   nœud H) rappelant cette recommandation HAS quand `imc` est en zone surpoids/obésité. Décision référent.
6. **Ne rien encoder de DEPS-R, mSCOFF, ESP ou EDE-Q.** Aucun ne franchit la barre (voir tableau § 2).

### 5.3. Sur la reproduction des items — ce qui est permis

- **SCOFF-F** : publié dans le BMJ (© BMJ Publishing Group). Je n'ai **trouvé aucune mention de licence
  commerciale ou de redevance**. Fait vérifié et directement exploitable : **la HAS reproduit intégralement
  les 5 items en français dans sa RBP *Anorexie mentale* (juin 2010, §2.3, p. 7)**, document public en
  téléchargement libre ; la **SFD** en reproduit une version dans le tableau II de sa prise de position
  2025. **Conformément à la règle du dépôt, je ne recopie pas les items ici** : si le référent souhaite les
  intégrer, le pointeur exact est donné ci-dessus, et l'ancrage à privilégier est le document HAS.
- ⚠️ **Deux libellés français différents circulent** et ils ne sont **pas mot pour mot identiques** : celui
  de la HAS 2010 (§2.3 p. 7) et celui de la SFD 2025 (tableau II). Je n'ai **pas pu déterminer lequel
  correspond à la version psychométriquement validée par Garcia et al.**, les textes intégraux (World J
  Biol Psychiatry, Clinical Nutrition) n'ayant pas pu être ouverts. Chronologiquement, la RBP HAS est de
  **juin 2010** et la première publication de Garcia d'**octobre 2010** — le libellé HAS pourrait donc être
  antérieur à la publication de la validation. **À trancher avant toute intégration littérale.**
- **DEPS-R / QACD** : 16 items en français reproduits par la SFD (tableau III, 2025) — sans objet ici,
  l'instrument étant écarté.

---

## 6. Ce qui n'a PAS pu être vérifié

| Point | Pourquoi | Conséquence |
|---|---|---|
| **Se/Sp exactes du mSCOFF** | Pas d'abstract PubMed ; texte intégral en 403 sur `diabetesjournals.org` et ResearchGate | Ne citer aucun chiffre de performance du mSCOFF. Établis : n = 43 adolescentes DT1, comparateur EDI-3 |
| **Performances originales du SCOFF (Morgan 1999)** | Notice PubMed sans abstract | Ne pas citer les chiffres de 1999 ; utiliser Garcia 2010/2011 et Kutz 2020 |
| **Article BAOJ Diabetes 2017 (DEPS-R français)** | Revue non indexée PubMed, ResearchGate en 403 | Ne pas le citer comme validation. La SFD 2025 ne le cite pas non plus |
| **Résumé Can J Diabetes 2013;37:60** | Référence lue dans la bibliographie SFD [52], notice non ouverte directement | Statut « résumé de congrès » établi par la SFD elle-même, suffisant pour l'écarter |
| **« Se 100 % / Sp 71 % » de l'ESP** | Chiffres absents de l'abstract primaire ; issus de littérature secondaire | **Ne pas citer.** L'abstract ne donne que des rapports de vraisemblance |
| **Absence de validation française de l'ESP et de l'EDE-QS** | Recherches PubMed + web, en français et en anglais, sans résultat | **Absence de preuve, pas preuve d'absence.** Une recherche en base francophone (SUDOC, thèses d'exercice, Cairn) pourrait compléter |
| **Quel libellé français correspond au SCOFF-F validé** | Textes intégraux Garcia non ouvrables | Voir § 5.3 — à trancher avant intégration littérale |
| **Statut de droit d'auteur / redevance du SCOFF** | Aucune page de licence trouvée ; raisonnement par la reproduction HAS et SFD | Prudence : le nœud peut **pointer** la page HAS plutôt que recopier |
| **DEPS-R original (Markowitz 2010)** | Référence lue dans la bibliographie SFD [49], notice non ouverte | Sans conséquence : instrument écarté sur d'autres motifs, tous vérifiés |
| **EDE-QS (Gideon 2016, PLoS One)** | Notice repérée dans les résultats de recherche, non ouverte | Sans conséquence : pas de version française, instrument écarté |

---

## 7. Sources

### Recommandations et référentiels français (PDF ouverts et lus intégralement)

- **HAS. *Anorexie mentale : prise en charge*. Recommandation de bonne pratique, juin 2010.** §2.2 (populations à risque) et §2.3 (SCOFF-F), p. 7. → https://www.has-sante.fr/upload/docs/application/pdf/2010-09/reco_anorexie_mentale.pdf
- **HAS. *Boulimie et hyperphagie boulimique : repérage et éléments généraux de prise en charge*. RBP juin 2019 — Fiche outil 1 « Repérage ».** → https://www.has-sante.fr/upload/docs/application/pdf/2019-09/fs_boulimie_reperage_v1.pdf
  - Page de la recommandation : https://www.has-sante.fr/jcms/c_2581436/fr/boulimie-et-hyperphagie-boulimique-reperage-et-elements-generaux-de-prise-en-charge
- **HAS. *Guide du parcours de soins : surpoids et obésité chez l'adulte*, janvier 2023, mise à jour février 2024.** Encadré 11, p. 43. → source locale du dépôt : `docs/decision/sources/guide HAS._parcours_surpoids-obesite_de_ladulte.pdf`
- **Hanaire H, Darmon P, Iceta S, et al. *Troubles des conduites alimentaires et diabète de type 1 : prise de position de la SFD et de la SFD Paramédical.* Médecine des maladies Métaboliques 2025;19(5):361-378.** DOI 10.1016/j.mmm.2025.06.002 → https://www.sfdiabete.org/sites/www.sfdiabete.org/files/files/ressources/ref_tca_dt1.pdf

### Références primaires vérifiées sur PubMed / PMC

| # | Référence | Identifiant | URL |
|---|---|---|---|
| 1 | Morgan JF, Reid F, Lacey JH. The SCOFF questionnaire. BMJ 1999;319(7223):1467-8 | PMID 10582927 | https://pubmed.ncbi.nlm.nih.gov/10582927/ |
| 2 | Garcia FD, et al. Validation of the French version of SCOFF questionnaire… World J Biol Psychiatry 2010;11(7):888-93 | PMID 20509759 | https://pubmed.ncbi.nlm.nih.gov/20509759/ |
| 3 | Garcia FD, et al. Detection of eating disorders in patients: validity and reliability of the French version of the SCOFF questionnaire. Clin Nutr 2011;30(2):178-81 | PMID 20971536 | https://pubmed.ncbi.nlm.nih.gov/20971536/ |
| 4 | Kutz AM, et al. Eating Disorder Screening: a Systematic Review and Meta-analysis of Diagnostic Test Characteristics of the SCOFF. J Gen Intern Med 2020;35(3):885-93 | PMID 31705473 | https://pubmed.ncbi.nlm.nih.gov/31705473/ |
| 5 | Lähteenmäki S, et al. Validation of the Finnish version of the SCOFF questionnaire… BMC Psychiatry 2009;9:5 | PMC2656502 | https://pmc.ncbi.nlm.nih.gov/articles/PMC2656502/ |
| 6 | Cotton MA, Ball C, Robinson P. Four simple questions can help screen for eating disorders. J Gen Intern Med 2003;18(1):53-6 | PMID 12534764 | https://pubmed.ncbi.nlm.nih.gov/12534764/ |
| 7 | Zuijdwijk CS, et al. The mSCOFF for screening disordered eating in pediatric type 1 diabetes. Diabetes Care 2014;37(2):e26-7 | PMID 24459158 | https://pubmed.ncbi.nlm.nih.gov/24459158/ |
| 8 | Carrard I, et al. Factor structure of a French version of the EDE-Q… Eat Weight Disord 2015;20(1):137-44 | PMID 25194301 | https://pubmed.ncbi.nlm.nih.gov/25194301/ |
| 9 | Klinker LY, et al. Detecting clinical cases of binge eating in diabetes care: Introducing the DEPS-10… Diabet Med 2025;42(8):e70060 | PMC12257434 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12257434/ |
| 10 | Abbott S, et al. Binge eating disorder and night eating syndrome in adults with type 2 diabetes: a systematic review. J Eat Disord 2018;6:36 | PMID 30410761 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6219003/ |
| 11 | Esmer AC, et al. Prevalence and associated factors of eating disorders in adults with type 2 diabetes: a systematic review. J Eat Disord 2025 | PMC12465268 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12465268/ |

### Références citées mais NON ouvertes (à ne pas utiliser telles quelles)

- Gagnon C, Aimé A, Bélanger C. *French validation of the Diabetes Eating Problem Survey-Revised (DEPS-R).* Can J Diabetes 2013;37:60. — **résumé de congrès** ; référence [52] de la SFD 2025.
- Gagnon C, Aimé A, Bélanger C. *Psychometric properties of the French DEPS-R.* BAOJ Diabetes 2017. — **revue non indexée PubMed**, texte non ouvert.
- Markowitz JT, et al. Diabetes Care 2010;33:495-500 (DEPS-R original) — référence [49] de la SFD 2025.
- Gideon N, et al. Development and Psychometric Validation of the EDE-QS… PLoS One 2016. PMID 27138364 — notice non ouverte.
