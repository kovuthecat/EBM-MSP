# Red-team B2 — vérification des identifiants et des chiffres (passe A, 2026-07-29)

> **Rôle** : agent B2 (red-team). Je ne collecte pas ; je **vérifie chaque PMID, chaque DOI et chaque
> chiffre décisionnel contre la source primaire**, et je dis à chaque fois **sur quoi** j'ai vérifié.
>
> **Discipline appliquée.** Aucune référence inventée. Quand la source primaire n'a pas pu être
> ouverte, le verdict est **NON VÉRIFIABLE** — jamais « probablement correct ». Un abstract n'est pas
> le texte intégral : la colonne « vérifié sur » le dit systématiquement.
>
> **Aucun fichier de `content/`, `src/`, `schema/` n'a été modifié ; ni les `preuve-A*.md`, ni
> `noeuds/E-insuline.md`.** Ce fichier est le seul écrit.
>
> **Périmètre vérifié** : les cinq collectes `preuve-A1` → `preuve-A5`, plus les identifiants du
> retour OpenEvidence (`OE-passeA-lecture-et-integrite.md` et `OE-passeA-brut-2026-07-29.txt`) qui
> portent une affirmation reprise ailleurs.

---

## §0. Résultat en une page

| | Nombre |
|---|---|
| Identifiants vérifiés contre PubMed / Europe PMC / PMC | **77** |
| **Identifiants FAUX émis par les agents A** | **0** |
| **Identifiants FAUX émis par OpenEvidence** | **6** (sur 7 PMID qu'OE volontairement propose) |
| Identifiants faux **déjà écartés par les agents eux-mêmes**, et que je confirme comme faux | **3** |
| `[À VÉRIFIER]` des collectes **levés** par cette passe | **6** |
| Chiffres décisionnels **confirmés verbatim** en primaire | **~95 %** de ceux testés |
| Chiffres décisionnels qui **ne tiennent pas** ou tiennent mal | **3 HAUTE + 3 MOYENNE + 6 MINEURE** |

**Le fait le plus important de cette passe n'est pas une erreur de chiffre : c'est un essai manquant.**
`Nauck 2014` (PMID **24445534**, *Diabetologia*, n = 300) a **randomisé « ASG » contre « pas d'ASG »
chez le DT2 insuliné**, et il est **négatif**. La collecte A3 écrit exactement le contraire — que
personne n'a jamais randomisé l'absence d'ASG chez l'insuliné parce que ce serait non éthique. OE
avait nommé cet essai ; aucun agent A ne l'a repris. Voir §4, finding **H1**.

**Diagnostic sur OpenEvidence, et il est actionnable.** Sur les 7 PMID qu'OE propose de lui-même,
**6 sont faux**. Mais — et c'est nouveau par rapport aux nœuds E et H — **ses chaînes de citation
(auteur, revue, volume, pages, DOI) sont exactes dans 6 cas sur 7**, et **ses 3 DOI sont exacts sur
3**. Le défaut n'est donc plus « OE hallucine des références » : c'est **« OE hallucine des
numéros PMID sur des références réelles »**. Règle à adopter : **accepter les DOI d'OE, jamais ses
PMID** — et résoudre systématiquement le PMID depuis le DOI.

---

## §1. Tableau maître des identifiants

Colonne « vérifié sur » : `esummary` / `efetch` = métadonnées PubMed (NCBI eutils) · `PMC` = texte
intégral PubMed Central · `EPMC` = Europe PMC REST · `secondaire` = source secondaire ouverte.

### 1.1 Identifiants des collectes A1–A5 — **tous corrects**

| Clé annoncée | PMID / DOI annoncé | Ce à quoi il correspond réellement | Verdict | Vérifié sur |
|---|---|---|---|---|
| HEART2D | 19246588 | Raz I, *Diabetes Care* 2009;32(3):381-6 — HEART2D | **CORRECT** | efetch |
| HEART2D post hoc | 21593301 | Raz I, *Diabetes Care* 2011;34(7):1511-3 — post hoc sujets âgés | **CORRECT** | esummary |
| ACE | 28917545 | Holman RR, *Lancet Diab Endo* 2017;5(11):877-86 — acarbose ACE | **CORRECT** | efetch |
| NAVIGATOR | 20228402 | Holman RR, *NEJM* 2010;362(16):1463-76 — natéglinide | **CORRECT** | efetch |
| FullSTEP | 24622667 | Rodbard HW, *Lancet Diab Endo* 2014;2(1):30-7 | **CORRECT** | efetch |
| STEP-Wise | 21550957 | Meneghini L, *Endocr Pract* 2011;17(5):727-36 | **CORRECT** | efetch |
| OPAL | 19040645 | Lankisch MR, *Diabetes Obes Metab* 2008;10(12):1178-85 | **CORRECT** | esummary |
| 1-2-3 (Garber) | 16367883 | Garber AJ, *Diabetes Obes Metab* 2006;8(1):58-66 | **CORRECT** | esummary |
| Sapporo 1-2-3 | 19427051 | Yoshioka N, *Diabetes Res Clin Pract* 2009;85(1):47-52 | **CORRECT** | esummary |
| AT.LANTUS | 15920040 | Davies M, *Diabetes Care* 2005;28(6):1282-8 | **CORRECT** | esummary |
| **4T — 1 an** | **17890232** | Holman RR, *NEJM* 2007;357(17):1716-30 | **CORRECT** | efetch |
| **4T — 3 ans** | **19850703** | Holman RR, *NEJM* 2009;361(18):1736-47 | **CORRECT** | efetch |
| BeAM 2016 | 27110368 | Zisman A, *BMJ Open Diab Res Care* 2016;4(1):e000171 | **CORRECT** | esummary |
| BeAM LixiLan-L | 30218434 | Zisman A, *Diabetes Ther* 2018;9(5):2155-62 | **CORRECT** | esummary |
| BeAM négatif | 30416973 | Siegmund T, *J Clin Transl Endocrinol* 2018;14:34-8 | **CORRECT** | esummary |
| BeAM 2021 | 33776458 | Kress S, *Diabetes Metab Syndr Obes* 2021;14:1215-22 | **CORRECT** | esummary |
| Overbasalization | 32699482 | Cowart K, *Clin Diabetes* 2020;38(3):304-10 | **CORRECT** | esummary |
| Monnier 2003 | 12610053 | Monnier L, *Diabetes Care* 2003;26(3):881-5 | **CORRECT** | esummary |
| Riddle 2011 | 22028279 | Riddle M, *Diabetes Care* 2011;34(12):2508-14 | **CORRECT** | esummary |
| Treat-to-Target | 14578243 | Riddle MC, *Diabetes Care* 2003;26(11):3080-6 | **CORRECT** | esummary |
| INSIGHT | 16842477 | Gerstein HC, *Diabet Med* 2006;23(7):736-42 | **CORRECT** | esummary |
| LANMET | 16456680 | Yki-Järvinen H, *Diabetologia* 2006;49(3):442-51 | **CORRECT** | esummary |
| **PREDICTIVE 303** | **17924873** | Meneghini L, *Diabetes Obes Metab* 2007;9(6):902-13 | **CORRECT** — correction A2 confirmée | esummary |
| ATLAS | 25297660 | Garg SK, *Endocr Pract* 2015;21(2):143-57 | **CORRECT** | esummary |
| Patel 2019 | 30900198 | Patel D, *Adv Ther* 2019;36(5):1031-51 | **CORRECT** | esummary |
| Chun 2019 | 31168280 | Chun J, *Diabetes Spectr* 2019;32(2):104-11 | **CORRECT** | esummary |
| Mehta 2021 | 34165382 | Mehta R, *Ann Med* 2021;53(1):998-1009 | **CORRECT** | esummary |
| FPG GOAL | 30938035 | Yang W, *Diabetes Obes Metab* 2019;21(8):1973-7 | **CORRECT** | efetch + PMC6772047 |
| Yuan 2021 | 34337072 | Yuan L, *J Diabetes Res* 2021;2021:5524313 | **CORRECT** | esummary |
| Wolters 2022 | 35942330 | Wolters J, *J Diabetes Res* 2022;2022:4758042 | **CORRECT** | esummary |
| Li 2024 | 38524199 | Li L, *Patient Prefer Adherence* 2024;18:687-94 | **CORRECT** | esummary |
| Strange 2007 | 19885117 | Strange P, *J Diabetes Sci Technol* 2007;1(4):540-8 | **CORRECT** | esummary |
| Luo 2023 | 37038616 | Luo Y, *J Diabetes* 2023;15(5):419-35 | **CORRECT** | esummary |
| Home 2025 | 40035222 | Home PD, *Diabetes Obes Metab* 2025;27 Suppl 5:3-15 | **CORRECT** | esummary |
| **SENIOR** | **29895556** | Ritzel R, *Diabetes Care* 2018;41(8):1672-80 | **CORRECT** | efetch |
| TOP | 31423316 | Fritsche A, *BMJ Open Diab Res Care* 2019;7(1):e000668 | **CORRECT** | esummary |
| Munshi 2016 | 27273335 | Munshi MN, *JAMA Intern Med* 2016;176(7):1023-5 | **CORRECT** | esummary |
| Rosenstock 2024 | 38749508 | Rosenstock J, *BMJ Open Diab Res Care* 2024;12(3):e003930 | **CORRECT** | esummary |
| ESMON | 18420662 | O'Kane MJ, *BMJ* 2008;336(7654):1174-7 | **CORRECT** | efetch |
| DiGEM | 17591623 | Farmer A, *BMJ* 2007;335(7611):132 | **CORRECT** | efetch |
| **STeP** | **21270183** | Polonsky WH, *Diabetes Care* 2011;34(2):262-7 | **CORRECT** — correction A3 confirmée | efetch |
| STeP psycho | 21916532 | Fisher L, *Curr Med Res Opin* 2011;27 Suppl 3:39-46 | **CORRECT** | esummary |
| **MONITOR** | **28600913** | Young LA, *JAMA Intern Med* 2017;177(7):920-9 | **CORRECT** — correction A3 confirmée | efetch |
| Cochrane Malanda | 22258959 | Malanda UL, *Cochrane Database Syst Rev* 2012;1:CD005060 | **CORRECT** | efetch |
| Farmer IPD 2012 | 22371867 | Farmer AJ, *BMJ* 2012;344:e486 | **CORRECT** | esummary |
| Allemann 2009 | 19827909 | Allemann S, *Curr Med Res Opin* 2009;25(12):2903-13 | **CORRECT** | esummary |
| Hortensius | 29334997 | Hortensius J, *BMC Res Notes* 2018;11(1):26 | **CORRECT** | efetch |
| BEGIN: Once Simple Use | 23812875 | Philis-Tsimikas A, *Adv Ther* 2013;30(6):607-22 | **CORRECT** | efetch (MEDLINE) |
| Korean TITRATION | 34130445 | Bae JH, *Diabetes Metab J* 2022;46(1):71-80 | **CORRECT** | esummary |
| COMPASS | 26774907 | Gao L, *Diabetes Res Clin Pract* 2016;112:88-93 | **CORRECT** | esummary |
| Li 2016 | 26950418 | Li CL, *Diabetes Technol Ther* 2016;18(3):171-7 | **CORRECT** | esummary |
| REPLACE | 28000140 | Haak T, *Diabetes Ther* 2017;8(1):55-73 | **CORRECT** | efetch |
| FreeDM2 | 42035781 | Wilmot EG, *Lancet Diab Endo* 2026;14(6):463-74 | **CORRECT** | esummary |
| Zhu 2026 (méta CGM) | 41942969 | Zhu J, *BMC Endocr Disord* 2026;26(1) | **CORRECT** | esummary |
| Chico 2003 | 12663589 | Chico A, *Diabetes Care* 2003;26(4):1153-7 | **CORRECT** | esummary |
| Gehlaut | 25917335 | Gehlaut RR, *J Diabetes Sci Technol* 2015;9(5):999-1005 | **CORRECT** | efetch |
| Xu 2019 | 31033116 | Xu Y, *Int J Clin Pract* 2019;73(7):e13357 | **CORRECT** | esummary |
| Zou 2023 | 36403159 | Zou Y, *J Gen Intern Med* 2023;38(3):755-64 | **CORRECT** | esummary |
| Miller 2013 | 23378621 | Miller KM, *Diabetes Care* 2013;36(7):2009-14 | **CORRECT** | esummary |
| Karter 2001 | 11448654 | Karter AJ, *Am J Med* 2001;111(1):1-9 | **CORRECT** | esummary |
| ADA SOC 2026 ch. 9 | 41358900 | ADA PPC, *Diabetes Care* 2026;49(Suppl 1):S183-S215 | **CORRECT** | esummary |
| ADA SOC 2026 ch. 6 | 41358894 | ADA PPC, *Diabetes Care* 2026;49(Suppl 1):S132-S149 | **CORRECT** | esummary |
| Battelino 2019 | 31177185 | Battelino T, *Diabetes Care* 2019;42(8):1593-1603 | **CORRECT** | esummary |
| Bergenstal 2008 | 18364392 | Bergenstal RM, *Diabetes Care* 2008;31(7):1305-10 | **CORRECT** | efetch |
| UK Hypoglycaemia SG | 17415551 | UK Hypoglycaemia Study Group, *Diabetologia* 2007;50(6):1140-7 | **CORRECT** | esummary |
| DEVOTE 7 | 30850995 | Pratley RE, *Diabetes Obes Metab* 2019;21(7):1625-33 | **CORRECT** | esummary |
| SWITCH 2 (post hoc) | 30705500 | Chaykin L, *Clin Diabetes* 2019;37(1):73-81 | **CORRECT** | esummary |
| CONCLUDE | 31984443 | Philis-Tsimikas A, *Diabetologia* 2020;63(4):698-710 | **CORRECT** | esummary |
| SWITCH PRO | 34322967 | Goldenberg RM, *Diabetes Obes Metab* 2021;23(11):2572-81 | **CORRECT** | esummary |
| EDITION 1-2-3 poolée | 25929311 | Ritzel R, *Diabetes Obes Metab* 2015;17(9):859-67 | **CORRECT** | efetch |
| **Aleppo 2021** (A5, « PMID non résolu ») | DOI 10.2337/dc21-1304 | **PMID 34588210** — Aleppo G, *Diabetes Care* 2021;44(12):2729-37 | **CORRECT — PMID résolu** | EPMC |

### 1.2 Identifiants d'OpenEvidence — **6 faux sur 7**

| Ce qu'OE annonce | PMID annoncé | Ce à quoi il correspond réellement | Verdict | **Bon identifiant** |
|---|---|---|---|---|
| **ACE** (acarbose, *Lancet Diab Endo* 2017;5(11):877-86) | **28711407** | Dangouloff-Ros V, *Mol Genet Metab* 2017;122(3):140-4 — **neuro-imagerie / inactivation de l'X** | **FAUX** | **28917545** |
| **NAVIGATOR** (natéglinide, *NEJM* 2010;362(16):1463-76) | **20228404** | Ginsberg HN, *NEJM* 2010;362(17):1563-74 — **ACCORD Lipid**, fénofibrate + statine | **FAUX** | **20228402** |
| **4T — 1 an** (*NEJM* 2007) | **17881754** | Braunstein GD, *NEJM* 2007;357(12):1229-37 — **gynécomastie** | **FAUX** | **17890232** |
| **4T — 3 ans** (*NEJM* 2009) | **19861578** | Derenzini E, *Ann Oncol* 2010;21(6):1173-8 — **MACOP-B / histiocytose langerhansienne** | **FAUX** | **19850703** |
| **STOP-NIDDM** (Chiasson, *JAMA* 2003;290(4):486-94) | **12876093** | Jenkins DJ, *JAMA* 2003;290(4):502-10 — **portefeuille diététique vs lovastatine** | **FAUX** | **12876091** |
| **« Lankisch 1-2-3 (Davidson 2009) »**, *Endocr Pract* 2009;15(1):41-9 | **19211396** | Lerman I, *Endocr Pract* 2009;15(1):41-**6** — **non-adhésion à l'insuline chez des patients à bas revenus** | **FAUX**, et la **chaîne de citation est fausse aussi** (double confusion : « Lankisch » = OPAL ; l'essai décrit — 343 patients, glargine + ADO, 1/2/3 injections de glulisine, 24 sem — est **Davidson MB, *Endocr Pract* 2011;17(3):395-403**) | **21324825** |
| Simon 2008 (coût-efficacité DiGEM) | 18420663 | Simon J, *BMJ* 2008;336(7654):1177-80 | **CORRECT** | — |

**DOI proposés par OE — 3 sur 3 corrects** :

| DOI OE | Résolution | Verdict |
|---|---|---|
| 10.1111/dom.13515 | **PMID 30160030** — Bolli GB, *Diabetes Obes Metab* 2019;21(2):402-7 | **CORRECT** |
| 10.1111/dom.13653 | **PMID 30724009** — Umpierrez GE, *Diabetes Obes Metab* 2019;21(6):1305-10 | **CORRECT** |
| 10.2337/dc24-2661 | **PMID 40273351** — Boonpattharatthiti K, *Diabetes Care* 2025;48(5):837-45 | **CORRECT** |

Autres identifiants OE recoupés au passage, tous corrects : **39207738** (Hypo-METRICS, Divilly,
*Diabetes Care* 2024;47(10):1769-77) · **32641372** (Galindo, *Diabetes Care* 2020;43(11):2730-5) ·
**34962151** (Davis, MOBILE sous-groupes, *Diabetes Technol Ther* 2022;24(5):324-31).
**NON VÉRIFIÉ** : Bolli GB, *Diabetes Care* 2025;48(5):671-81, DOI 10.2337/dci24-0104 — c'est la
source unique du « pas plus de 2 U/semaine » et de la « cible 100-120 mg/dL » d'OE (§2.4 du retour) ;
je ne l'ai pas ouverte. **Ne rien écrire sur cette base tant qu'elle n'est pas ouverte.**

### 1.3 Identifiants déjà écartés par les agents — **je confirme les trois**

| Identifiant | Annoncé pour | Réalité | Écarté par |
|---|---|---|---|
| **17924872** | PREDICTIVE 303 | Solomon TP, *Diabetes Obes Metab* 2007;9(6):895-901 — **cannelle et tolérance au glucose** | A2 ✔ |
| **21266647** | STeP | Wilson DM, *Diabetes Care* 2011;34(3):540-4 — **HbA1c et glycémie moyenne en DT1 (JDRF)** | A3 ✔ |
| **28600890** | MONITOR | Bultez T, *J Ultrasound Med* 2017;36(11):2279-85 — **échographie obstétricale du 2ᵉ trimestre** | A3 ✔ |

---

## §2. Chiffres décisionnels, essai par essai

Convention : **DUR** = critère clinique dur · **SUB** = substitution. « Effet absolu » et NNT/NNH ne
sont donnés **qu'avec leur horizon**.

### 2.1 STEP-Wise — PMID 21550957 *(vérifié sur : abstract PubMed intégral ; texte intégral non ouvert — Endocrine Practice, pas de PMC, 403)*

| Élément | Annoncé (A1) | Trouvé en primaire | Verdict |
|---|---|---|---|
| Design | « Les deux stratégies ont été **RANDOMISÉES** l'une contre l'autre » | « This **randomized**, controlled, parallel-group, open-label, 48-week trial compared the stepwise addition of insulin aspart to either the largest meal (**titration based on premeal glucose values [SimpleSTEP]**) or to the meal with the largest prandial glucose increment (**titration based on postmeal glucose values [ExtraSTEP]**) » | **CORRECT — verbatim** |
| n | 296 | 296 (SimpleSTEP n = 150 ; ExtraSTEP n = 146) | **CORRECT** |
| Déclencheur d'intensification | HbA1c ≥ 7 % toutes les 12 sem | « if hemoglobin A1c remained at 7% or greater after 12 and 24 weeks » | **CORRECT** |
| Critère primaire | HbA1c | « Endpoints included hemoglobin A1c (**primary endpoint**) » | **CORRECT** |
| « −1,2 % des deux côtés » | −1,2 % | « decreased by **approximately 1.2%** in both groups », vers 7,5 ± 1,1 % vs 7,7 ± 1,2 % | **CORRECT** |
| **Non-différence publiée** | *(non citée par A1)* | ★ **ETD (SimpleSTEP − ExtraSTEP) = −0,06 % [IC 95 % −0,29 ; +0,17]** | **À SUBSTITUER aux 31/27** |
| **« cible 31 % vs 27 % ; p = 0,74 »** | 31 % vs 27 %, p = 0,74 | **Absent de l'abstract.** Pas de PMC. `endocrinepractice.org` en 403. Aucune source secondaire n'a été produite par A1 pour ce couple | ★ **NON VÉRIFIABLE** |
| Hypoglycémies | « comparables » | « The frequency of adverse events and hypoglycemia was **low and similar between groups** » | **CORRECT** |
| Critère dur | aucun | aucun — **SUB** intégral | **CORRECT** |

**Effet absolu / NNT** : aucun NNT n'est calculable — la différence sur le critère primaire est nulle
(**ETD −0,06 %**, IC compatible avec ±0,3 % dans les deux sens), horizon **48 semaines**, sur un
**substitut**.

**Conclusion.** *L'affirmation la plus structurante de la passe tient — mais pas sur le chiffre
qu'A1 lui donne.* Le design randomisé « titrer sur la post-prandiale vs titrer sur le pré-prandial »
est **confirmé verbatim**, la nullité aussi. Le couple « 31 % vs 27 %, p = 0,74 » est
**invérifiable en l'état** et doit être **remplacé par l'ETD −0,06 % [−0,29 ; +0,17]**, qui dit la
même chose en mieux et qui, elle, est publiée. Réserve de puissance à conserver : avec n = 296 et un
IC de ±0,23 point, l'essai **n'exclut pas** un avantage de 0,29 point pour ExtraSTEP.

### 2.2 HEART2D — PMID 19246588 *(vérifié sur : abstract PubMed intégral ; méthodes/discussion non ouvertes — 403 diabetesjournals.org ; hypothèse de séparation vérifiée sur deux commentaires ouverts)*

| Élément | Annoncé (A1) | Trouvé en primaire | Verdict |
|---|---|---|---|
| n / bras | 1 115 (557 / 558) | 1 115 (PRANDIAL 557 ; BASAL 558) | **CORRECT** |
| Durée | ~2,6 ans | « mean patient participation after randomization was **963 days** (range 1-1 687) » = 2,64 ans | **CORRECT** |
| Arrêt | « pour futilité » | « The trial was **stopped for lack of efficacy** » | **CORRECT** (formulation équivalente) |
| Critère primaire (**DUR**) | 174 (31,2 %) vs 181 (32,4 %) ; HR 0,98 [0,80-1,21] | « 174, **31.2%** » vs « 181, **32.4%** » ; « hazard ratio **0.98 [95% CI 0.8-1.21]** » | **CORRECT** |
| Cibles des bras | PPG 2 h < 7,5 mmol/L (1,35 g/L) vs GAJ/préprandial < 6,7 mmol/L (1,20 g/L) | verbatim identique | **CORRECT** |
| HbA1c (**SUB**) | 7,7 ± 0,1 vs 7,8 ± 0,1 %, p = 0,4 | idem | **CORRECT** |
| PPG moyenne (**SUB**) | 7,8 vs 8,6 mmol/L, p < 0,01 | idem | **CORRECT** |
| Excursion 2 h (**SUB**) | 0,1 vs 1,3 mmol/L, p < 0,001 | idem | **CORRECT** |
| GAJ (**SUB**) | 8,1 vs 7,0 mmol/L (PRANDIAL vs BASAL), p < 0,001 | « BASAL group showed lower mean fasting blood glucose (**7.0 vs 8.1** mmol/l ; P < 0.001) » | **CORRECT** (ordre de colonnes cohérent) |
| ★ **« séparation visée 2,5 mmol/L, obtenue 0,8 »** | 0,8 au lieu de 2,5 | (a) **0,8 mmol/L** = 8,6 − 7,8, **calculable depuis l'abstract** ; (b) **2,5 mmol/L** : hypothèse de dimensionnement (une séparation de 2,5 mmol/L devait produire 19-23 % de réduction relative sur 18-36 mois) — **retrouvée sur deux commentaires ouverts** (éditorial d'accompagnement *Diabetes Care* 2009;32(3):521 ; commentaire *Nat Rev Endocrinol* 2009), **pas sur la section Méthodes** ; (c) l'abstract lui-même conclut « achieved… **less-than-expected differences in postprandial blood glucose** » | ★ **CORRECT en substance ; le nombre 2,5 = secondaire concordant, pas primaire** |

**Effet absolu / NNT** : différence absolue **1,2 point de pourcentage**, **non significative** →
**aucun NNT ni NNH calculable**, horizon **~2,6 ans**, critère **DUR** (composite CV).
**À ajouter, et ce n'est pas cosmétique** : la borne haute de l'IC (**HR 1,21**) laisse ouvert un
**excès de risque de 21 %** dans le bras prandial. L'essai n'a donc démontré ni bénéfice ni innocuité.

**Conclusion sur le point que le prompt signale comme changeant ce que le nœud a le droit d'écrire.**
**A1 a raison, et sa prudence est justifiée par la source primaire elle-même** : la conclusion de
l'abstract mentionne explicitement les différences post-prandiales **inférieures à l'attendu**. La
formulation autorisée est **« aucun bénéfice démontré »**, pas **« bénéfice réfuté »** — et pas non
plus « stratégie sûre ». Le nombre « 2,5 mmol/L » reste **`[À VÉRIFIER]` en primaire** : il peut être
écrit dans l'argumentaire avec sa source secondaire, **pas** dans un `effet_attendu`.

### 2.3 FPG GOAL — PMID 30938035 *(vérifié sur : abstract intégral + texte intégral PMC6772047 + protocole PMC5037905)*

| Élément | Annoncé (A2) | Trouvé en primaire | Verdict |
|---|---|---|---|
| n | 947 | 947 randomisés ; **885 complétés** ; Groupes **136 / 405 / 406** ; ratio **1:3:3** | **CORRECT** |
| Durée | 24 sem | 24 semaines | **CORRECT** |
| Cibles randomisées | ≤ 5,6 / ≤ 6,1 / ≤ 7,0 mmol/L, plancher 3,9 | verbatim identique | **CORRECT** |
| Primaire (**SUB**) | 44,4 / 46,1 / 37,7 % à HbA1c < 7 % | idem ; **P = 0,017 pour Groupe 2 vs Groupe 3** | **CORRECT** |
| **NNT ≈ 12** | ARD +8,4 pp, NNT ≈ 12 | 46,1 − 37,7 = **8,4 pp** → NNT = **11,9** | ★ **CORRECT** — **SUB**, horizon **24 sem** |
| Hypo d'alerte (≤ 3,9), **SUB** | 38,9 / 27,5 / 23,3 % | idem. **Contrastes publiés : G1 vs G3 P < 0,001 ; G2 vs G3 P = 0,177 (NS)** | **CORRECT sur les valeurs** |
| **NNH ≈ 9** (serrer à 1,01 g/L) | ARD +11,4 pp, NNH ≈ 9 | 38,9 − 27,5 = 11,4 pp → NNH = **8,8**. ⚠ **Mais le contraste G1 vs G2 n'est pas testé dans la publication** — aucun p n'y est attaché | ⚠ **Arithmétique correcte, contraste non publié** |
| NNH ≈ 24 (G2 vs G3) | ARD +4,2 pp, NNH ≈ 24 | 27,5 − 23,3 = 4,2 pp → 23,8. ⚠ **Différence NON significative (P = 0,177)** | ⚠ **NNH tiré d'une différence non significative — à retirer ou à flaguer** |
| Hypo cliniquement importante (≤ 3,0) | 4,8 / 2,0 / 3,8 %, « pas de gradient » | idem | **CORRECT** |
| **Hypo SÉVÈRE (DUR)** | 0 / 1 patient / 1 patient | **« Severe hypoglycaemia occurred in only one patient each in Groups 2 and 3 »** (PMC) | **CORRECT** |
| Conclusion des auteurs | « optimale 3,9-6,1 mmol/L » | verbatim identique | **CORRECT** |

**Dur vs substitution — le point à ne pas laisser passer.** *Tout* ce qui porte le NNT et les NNH est
**substitutif** : le primaire est « proportion à HbA1c < 7 % », l'hypoglycémie d'alerte est un seuil
biologique (≤ 3,9 mmol/L), pas un événement clinique. Le **seul critère dur** de l'essai —
l'hypoglycémie sévère — compte **2 événements sur 947 patients** : il n'arbitre rien. A2 le dit
correctement (« essai non dimensionné pour ce critère ») ; il faut que le YAML le dise aussi.
Validité externe : population **chinoise**, insulino-naïve, essai **ouvert**, 24 semaines.

### 2.4 BEGIN: ONCE SIMPLE USE — PMID 23812875 *(vérifié sur : abstract MEDLINE intégral)*

| Élément | Annoncé (A3) | Trouvé en primaire | Verdict |
|---|---|---|---|
| Design | ECR ouvert treat-to-target, 26 sem, n = 222, DT2 naïfs + metformine, dégludec, titration hebdo dans les 2 bras | verbatim identique ; **n = 111 + 111** | **CORRECT** |
| Bras | Simple = **1** GAJ pré-petit-déjeuner ; Step-wise = **3** consécutives | « a "Simple" algorithm, with dose adjustments based on **one** pre-breakfast SMBG measurement (n = 111) versus a "Step-wise" algorithm, with adjustments based on **three consecutive** pre-breakfast SMBG values (n = 111) » | **CORRECT — verbatim** |
| HbA1c (**SUB**) | −1,09 % vs −0,93 % ; ETD −0,16 % [−0,39 ; +0,07], non-infériorité | verbatim identique | **CORRECT** |
| GAJ (**SUB**) | *(non cité par A3)* | −3,27 vs −2,68 mmol/L, **pas de différence significative** | complément |
| Hypo confirmée | 1,60 vs 1,17 év./patient-année | verbatim identique, « **no significant differences between groups** » | **CORRECT** |
| Hypo nocturne | 0,21 vs 0,10 év./p-a | verbatim identique | **CORRECT** |
| ★ **Dose** | **0,61 vs 0,50 U/kg/j** | « Daily insulin dose after 26 weeks was **0.61 U/kg (IDegSimple)** and **0.50 U/kg (IDegStep-wise)** » | **CORRECT** |
| Poids | *(non cité)* | +1,6 vs +1,1 kg, NS | complément |
| Critère dur | aucun | aucun — **SUB** intégral | **CORRECT** |

⚠ **Ce que l'essai n'établit pas, et qu'A3 en tire.** L'introduction de l'abstract énonce elle-même
le confondant : l'algorithme simplifié permet « **less frequent SMBG measurements AND more simplified
titration steps** ». Le tableau §3.2 d'A2 (repris de Patel 2019, PMC6824379, ouvert) le chiffre :
**Simple = +4 U forfaitaires** sur une valeur ; **Step-wise = +2/+4/+6/+8 U gradués** sur la plus
basse de trois. **Les deux bras diffèrent donc sur deux choses à la fois.** L'essai autorise
« *cet algorithme simplifié dans son ensemble est non inférieur* » ; il **n'autorise pas**
« *une mesure au lieu de trois coûte +0,11 U/kg/j* » — la surdose est au moins autant imputable au
**pas forfaitaire de +4 U** qu'à la densité de mesure. Voir finding **H3**.

⚠ Second point : « **sans excès d'hypoglycémie** » (A3 §5.1) lit une non-significativité comme une
équivalence. En valeur brute, le bras à une mesure fait **+37 % d'hypoglycémies confirmées**
(1,60 vs 1,17) et **le double d'hypoglycémies nocturnes** (0,21 vs 0,10), sur **n = 222** et
26 semaines — un effectif où l'absence de significativité ne démontre rien. Formulation autorisée :
« *aucune différence significative d'hypoglycémie n'a été mise en évidence, sur un essai non
dimensionné pour ce critère* ».

Validité externe : DT2 **insulino-naïfs**, **dégludec**, **metformine seule**. Le nœud parle de
patients **déjà sous basale**, souvent sous plusieurs ADO, rarement sous dégludec en France.

### 2.5 SENIOR — PMID 29895556 *(vérifié sur : abstract intégral Europe PMC / PubMed ; texte intégral 403)*

| Élément | Annoncé (A2 / OE) | Trouvé en primaire | Verdict |
|---|---|---|---|
| Design | ECR dédié ≥ 65 ans, ouvert, 2 bras, n = 1 014, âge moyen 71 ans | confirmé : n = **1 014**, âge moyen **71 ans** | **CORRECT** |
| ★ **Cible de titration** | GAJ auto-mesurée **5,0-7,2 mmol/L = 0,90-1,30 g/L** | « **5.0-7.2 mmol/L (90-130 mg/dL)** » | **CORRECT — verbatim** |
| HbA1c (**SUB**) | contrôle comparable | Gla-300 **−0,89 %** ; Gla-100 **−0,91 %** | **CORRECT** |
| ★ **Sous-groupe ≥ 75 ans** | hypo symptomatique documentée **1,12 vs 2,71 év./patient-an, RR 0,45 [0,25-0,83]** | verbatim identique (« documented symptomatic (≤3.9 mmol/L [≤70 mg/dL]) hypoglycemia… Gla-300: 1.12; Gla-100: 2.71 … rate ratio 0.45 [95% CI 0.25-0.83] ») | **CORRECT** |
| **Effet absolu manquant** | *(non donné)* | ★ **1,59 événement/patient-année évité** dans le sous-groupe ≥ 75 ans — **SUB**, horizon 26 semaines. NNT non applicable (taux, pas proportion) | **à ajouter** |
| « ~20 % de ≥ 75 ans » | 20 % | **absent de l'abstract** | **NON VÉRIFIABLE** |
| « alignée sur la cible ADA du sujet âgé en bonne santé » | oui | ADA Table 13.2 « healthy » = **80-130 mg/dL** ; SENIOR = **90-130** | ⚠ **INEXACT** — la borne basse de SENIOR est **au-dessus** de celle de l'ADA |
| ★ **Affirmation NÉGATIVE d'A2** : SENIOR **n'a pas testé** un pas ni un intervalle différents | — | **CONFIRMÉE.** La randomisation porte sur **deux insulines** (Gla-300 vs Gla-100) avec **une cible commune** ; aucune randomisation d'un pas ni d'un rythme n'apparaît. Le détail « même schéma hebdomadaire que les autres EDITION » (OE) **n'est pas dans l'abstract** — mais il n'est pas nécessaire à la négation | ★ **CORRECT** |
| Statut du sous-groupe ≥ 75 ans (pré-spécifié ou post hoc) | non dit | **non déterminable sur l'abstract** | **`[À VÉRIFIER]` — décisionnel** |

**Le point de méthode à ne pas perdre.** SENIOR est le **seul appui randomisé** d'une cible relevée
chez l'âgé — mais il l'**emploie** sans la **comparer**. Il ne dit donc rien de « 0,90-1,30 vaut mieux
que 0,80-1,30 » ; il dit « 0,90-1,30 est praticable ». Financement Sanofi. Le RR 0,45 porte sur une
**comparaison de molécules**, pas de cibles : il ne peut pas servir d'argument pour la cible.

### 2.6 Bolli 2019 — PMID 30160030, DOI 10.1111/dom.13515 *(vérifié sur : abstract intégral ; texte intégral non ouvert — Wiley, pas de PMC)*

| Élément | Annoncé (OE, repris en §2.3 du fichier de lecture) | Trouvé en primaire | Verdict |
|---|---|---|---|
| Nature | analyse poolée post hoc EDITION | « patient-level, 6-month data pooled from **EDITION 2, EDITION 3 et EDITION JP 2** », **N = 1 922**, **régime basal seul**, DT2 | **CORRECT** |
| Quatre fenêtres | 00:00-05:59 ; 22:00-05:59 ; 00:00-07:59 ; 22:00 → SMPG pré-petit-déjeuner | verbatim identique | **CORRECT** |
| ★ **Pic 06:00-08:00** | « les hypoglycémies culminent entre 06:00 et 08:00 » | « Confirmed (≤3.9 mmol/L [≤70 mg/dL]) or severe hypoglycaemic events were **reported most frequently between 6:00 AM and 8:00 AM** » | ★ **CORRECT — verbatim** |
| ★ **« étendre à 07:59 DOUBLE environ les événements »** | « double environ » | L'abstract dit seulement : « windows **expanded beyond 6:00 AM included more events** than other windows ». **Aucun facteur 2 n'est publié dans l'abstract** ; texte intégral non ouvert | ★ **NON VÉRIFIABLE — le mot « double » ne doit pas être écrit** |

**Substitution vs dur** : critère = hypoglycémie **confirmée ou sévère déclarée par l'investigateur** —
majoritairement **SUB**. Post hoc, promoteur **Sanofi**, finalité première = montrer Gla-300 < Gla-100.
Le pic horaire en est un **sous-produit descriptif** : **GRADE faible**.

**Portée décisionnelle, et elle est réelle malgré tout.** La population (**DT2 sous basale seule**)
est exactement celle du nœud, et le constat est robuste dans sa direction : **une case « nuit
0-6 h » rate le pic**. Cela **corrobore indépendamment** la recommandation d'A4 (§5) d'un repère
**ancré sur les repas** plutôt qu'un créneau d'horloge fixe. Formulation autorisée : *« les
hypoglycémies culminent entre 06:00 et 08:00, juste après la fenêtre nocturne conventionnelle ; les
fenêtres étendues au-delà de 06:00 en captent davantage »* — **sans le facteur 2**.

### 2.7 Munshi 2011 (21357814) et Zick 2007 / « SAFIR » (18034602)

**Munshi** *(vérifié sur : abstract intégral + texte intégral PMC4123960)*

| Élément | Annoncé (A3, A4) | Trouvé en primaire | Verdict |
|---|---|---|---|
| Population | n = 40, ≥ 69 ans, HbA1c ≥ 8 % (moy. 9,3 %), **70 % DT2**, **93 % sous insuline** | verbatim identique (âge moyen **75 ± 5** ans, diabète 22 ± 14 ans) | **CORRECT** |
| Densité d'ASG | **4 glycémies capillaires/jour** | ★ **« Patients measured finger-stick glucose 4 times a day while wearing CGM »** (texte intégral) | ★ **CORRECT** |
| ★ **93 %** | **95 des 102 épisodes (93 %) non reconnus** par l'ASG **ni** par les symptômes | ★ **« Of a total of 102 hypoglycemic episodes, 95 (93%) were unrecognized, either by finger-stick monitoring or by symptoms »** | ★ **CORRECT — verbatim, y compris l'attribution « 4×/jour »** |
| Patients concernés | 26/40 (65 %) ; 18/26 (69 %) ≥ 1 épisode nocturne | verbatim identique | **CORRECT** |
| Fenêtre nocturne | 22:00-06:00 | « nocturnal hypoglycemic episodes (**10PM-6AM**) » | **CORRECT** |
| Durée / critère | 3 jours, MCG aveugle | idem — **SUB** (glucose interstitiel) | **CORRECT** |

Réserves à conserver : **n = 40**, **3 jours**, monocentrique, population **sélectionnée** (HbA1c ≥ 8 %),
**mixte DT1/DT2** (70 % DT2). Et **93 % est une proportion d'épisodes, pas de patients**.

**Zick / SAFIR** *(vérifié sur : abstract intégral)*

| Élément | Annoncé (A3, A4) | Trouvé en primaire | Verdict |
|---|---|---|---|
| Population | n = 367 DT2 sous multi-injections, HbA1c 6,9 %, CGMS 72 h | « full analysis set contained **367 patients** … mean HbA1c **6.9%** » ; multicentrique (**125 centres**), **ouvert, bras unique** | **CORRECT** |
| Seuil | ≤ 0,60 g/L | « ≤ 60 mg/dL (≤ 3.3 mmol/L) » | **CORRECT** |
| Détection | **209 (56,9 %)** au CGMS vs **97 (26,4 %)** par les méthodes conventionnelles | verbatim identique | **CORRECT** |
| ★ **« l'ASG ne voit que 46 % »** | 46 % | **97 / 209 = 46,4 %** — **arithmétiquement exact, mais c'est un calcul de l'agent, pas une valeur publiée** ; et ce n'est **pas une sensibilité** (deux dénombrements de patients, pas un test index contre une référence par épisode) | ⚠ **CALCUL, à flaguer comme tel** |
| Glycémies nocturnes | CGMS < ASG (1,23 vs 1,37 g/L en fin d'étude) | « 123.3 vs 137.3 mg/dL » | **CORRECT** |
| **Sigle « SAFIR »** | Zick / SAFIR | **absent du titre et de l'abstract** | ⚠ **NON VÉRIFIABLE — ne pas étiqueter « SAFIR » sans source** |

Réserve de conception : **bras unique**, chaque patient est son propre comparateur, et la MCG est à la
fois **test index et référence** — biais de vérification inhérent. Financement industriel.

### 2.8 HAT / Global HAT — PMID 27161418 *(vérifié sur : abstract intégral + texte intégral PMC5031206)*

| Élément | Annoncé (A4) | Trouvé en primaire | Verdict |
|---|---|---|---|
| Population | 27 585 patients, **DT2 n = 19 563**, 2 004 sites, 24 pays | verbatim identique | **CORRECT** |
| Design / horizon | 6 mois rétrospectifs + 4 semaines prospectives, auto-questionnaire + carnet | verbatim identique | **CORRECT** |
| **46,5 %** ≥ 1 épisode (DT2, prospectif) | 46,5 % | « **46.5%** of patients with T2D reported hypoglycaemia » | **CORRECT** |
| Taux toute hypo (DT2) | 19,3 [19,1-19,6] év./patient-an | verbatim identique | **CORRECT** |
| Taux nocturne (DT2) | 3,7 [3,6-3,8] év./patient-an | verbatim identique | **CORRECT** |
| Taux sévère (DT2) | 2,5 [2,4-2,5] év./patient-an | verbatim identique | **CORRECT** |
| ★ **Nocturne : 15,9 % des patients** | 2 800 ; IC 95 15,4-16,5 | ★ **« 2 800 / 18 435 = 15,9 % (IC 95 % 15,4-16,5) »** (texte intégral) | ★ **CORRECT** |
| Sévère : 8,9 % des patients | 1 635 | ★ **« 1 635 = 8,9 % (IC 95 % 8,5-9,3) »** (texte intégral) | **CORRECT** |
| Fenêtre nocturne | minuit-06:00 | « any event occurring **between midnight and 06:00 hours** » | **CORRECT** |
| HbA1c non prédictive | oui | « Glycated haemoglobin level was **not a significant predictor** of hypoglycaemia » | **CORRECT** |
| ★ **« ~19 % des événements »** | **A4 le déclare comme son propre calcul** | **CONFIRMÉ : c'est bien un calcul, non publié.** 3,7 / 19,3 = **19,2 %**. Le ratio est **méthodologiquement légitime** (deux taux de la même population sur la même période) | ★ **A4 a raison de le flaguer — flag à CONSERVER** |

**Réserve qui doit accompagner le 19 % partout où il est cité.** HAT est **déclaratif**
(auto-questionnaire + carnet, 4 semaines) : un épisode nocturne **non ressenti n'est pas déclaré**.
Le 19 % est donc un **plancher**, pas une estimation — et c'est exactement ce que montre le miroir
MCG (Gehlaut : **aucune** différence jour/nuit). Promoteur **Novo Nordisk**. Hypo sévère = **DUR** ;
hypo non sévère auto-déclarée = **SUB**.

### 2.9 Umpierrez 2019 — PMID 30724009, DOI 10.1111/dom.13653 — **la divergence est tranchée**

*(vérifié sur : abstract intégral Europe PMC + PubMed)*

> **« RESEARCH DESIGN AND METHODS: … A total of *458 participants* from *three* eligible trials were
> included. »**

| Version | Valeur | Verdict |
|---|---|---|
| **Dossier du dépôt** (`chantier-2026-07-27/preuve-sur-basalisation.md`) | **N = 458**, post hoc non pré-spécifié | ★ **CORRECT** |
| **OpenEvidence** (§2.6 du fichier de lecture) | « n = 3 014 », « 12 RCTs of glargine U-100 » | ★ **FAUX sur les deux nombres** |

Substance confirmée par ailleurs : relation **non linéaire**, réductions décroissantes de GAJ et
d'HbA1c au-delà de **0,3 UI/kg/j**, **plateau à 0,5** ; au-delà de 0,5 UI/kg/j → **plus de prise de
poids sans excès d'hypoglycémie** ; les auteurs invitent à intensifier « at doses approaching
0,5 IU/kg/d ». **Tout est SUB** ; aucun critère dur ; population étroite (échec metformine +
sulfamide, glargine U100, ≥ 6 GAJ disponibles).

**Conséquence** : l'arbitrage du 2026-07-27 sur le repère de 0,5 U/kg/j **n'est pas rouvert** — il
reposait sur le **niveau de preuve**, pas sur l'effectif. Mais **le chiffre « 3 014 » ne doit
apparaître nulle part**, et la note de lecture OE §2.6 doit être corrigée : elle affirme aujourd'hui
une « convergence indépendante » avec le red-team du 2026-07-27, alors qu'elle en diverge sur
l'effectif d'un facteur 6,6.

### 2.10 4T — PMID **17890232** (1 an) et **19850703** (3 ans) *(vérifié sur : abstracts intégraux ; texte intégral NEJM non ouvert)*

**Les bons identifiants sont ceux du dépôt.** La paire qui circule côté OE (17881754 / 19861578)
pointe sur la gynécomastie et sur une série d'histiocytose langerhansienne — voir §1.2.

| Élément (1 an) | Annoncé (A1) | Trouvé | Verdict |
|---|---|---|---|
| n / population | 708, HbA1c 7,0-10,0 % sous metformine + sulfamide | verbatim identique | **CORRECT** |
| HbA1c à 1 an (**SUB**) | biphasique 7,3 / prandial 7,2 / basal 7,6 % | verbatim identique (P = 0,08 et P < 0,001 vs biphasique) | **CORRECT** |
| ≤ 6,5 % | 17,0 / 23,9 / 8,1 % | verbatim identique | **CORRECT** |
| Hypoglycémies | 5,7 / 12,0 / 2,3 év./patient/an | verbatim identique | **CORRECT** |
| Poids | +4,7 / +5,7 / +1,9 kg | verbatim identique | **CORRECT** |
| À 3 ans : 2ᵉ insuline dans le bras basal | 81,6 % | « **81.6%** » (biphasique 67,7 ; prandial 73,6 ; P = 0,002) | **CORRECT** |
| ★ **Cibles de protocole : GAJ 99 mg/dL, PPG 2 h 126 mg/dL** | `[À VÉRIFIER]` chez A1 | **Absent des deux abstracts.** NEJM en 403. **Deux secondaires indépendantes concordent** : A1 (99 / 126) et OE (pré-repas **72-99**, post-repas 2 h **90-126**) — **les bornes hautes coïncident exactement** | ⚠ **NON VÉRIFIÉ EN PRIMAIRE ; corroboré par 2 secondaires indépendantes.** Le point décisionnel — « **la cible post-prandiale de 4T est 1,26 g/L, pas 1,80** » — **tient**, mais le nombre reste `[À VÉRIFIER]` |

**Complément que le nœud gagnerait à connaître, et qui n'est dans aucune collecte.** À **3 ans**, le
bras **basal** atteint la même HbA1c médiane que le bras prandial (**6,9 vs 6,8 %**, P = 0,28 sur les
trois bras), avec **le taux d'hypoglycémie le plus bas** (médianes 1,7 vs 5,7 év./an). 4T n'est donc
**pas** un argument en faveur d'une insuline prandiale précoce : il documente qu'on y arrive aussi
bien par la basale, plus lentement et plus sûrement.

### 2.11 FullSTEP — PMID 24622667 *(vérifié sur : abstract intégral ; texte intégral Lancet D&E non ouvert)*

| Élément | Annoncé (A1) | Trouvé | Verdict |
|---|---|---|---|
| Design / n | phase 4 ouvert, non-infériorité, 32 sem, n = 401, 150 sites, 7 pays | verbatim identique ; **marge de non-infériorité 0,4 %** | **CORRECT** |
| Population | âge 59,8 ; HbA1c 7,9 % ; diabète 12,6 ans | verbatim identique | **CORRECT** |
| HbA1c (**SUB**) | −0,98 % vs −1,12 % | **−0,98 % [−1,09 ; −0,87]** vs **−1,12 % [−1,23 ; −1,00]** ; différence **0,14 [−0,02 ; 0,30], p = 0,0876** | **CORRECT** (A1 omet l'IC et le p) |
| ★ **Hypo rate ratio 0,58** | 0,58 [0,45-0,75], p < 0,0001 | verbatim identique | ★ **CORRECT** |
| Financement | Novo Nordisk | confirmé | **CORRECT** |
| ★ **Cible de titration PRÉ-prandiale 72-130 mg/dL** | `[À VÉRIFIER]` chez A1 | **Absent de l'abstract.** Deux secondaires indépendantes concordent (revue narrative PMC5983081 lue par A1 ; retour OE) | ⚠ **NON VÉRIFIÉ EN PRIMAIRE ; corroboré par 2 secondaires** |

**Précision de gravité à ajouter** : l'abstract ne qualifie pas la sévérité des hypoglycémies
comptées. Le rate ratio 0,58 porte donc sur des **hypoglycémies de protocole (non sévères pour
l'essentiel)** — c'est un critère de **sécurité substitutif**, pas un critère dur. A1 le présente
comme « supérieur sur la sécurité » sans le dire.

### 2.12 Les autres identifiants nommés par le prompt — vérification rapide des chiffres

| Essai | Chiffres annoncés | Vérification (abstract intégral sauf mention) | Verdict |
|---|---|---|---|
| **ESMON** 18420662 | n = 184 (96/88) ; 6,9 (0,8) vs 6,9 (1,2) %, p = 0,69, IC −0,25 à +0,38 ; dépression **+6 %**, p = 0,01 | tout verbatim | **CORRECT** |
| **DiGEM** 17591623 | n = 453 ; −0,14 [−0,35 ; +0,07] et −0,17 [−0,37 ; +0,03] | verbatim. **A3 omet le p global = 0,12** | **CORRECT** (à compléter) |
| **STeP** 21270183 | ITT −1,2 vs −0,9, Δ −0,3, p = 0,04 ; PP −1,3 vs −0,8, Δ −0,5, p < 0,003 ; PP 130/256 vs 161/227 | tout verbatim | **CORRECT** |
| **MONITOR** 28600913 | −0,09 [−0,31 ; +0,14] et −0,05 [−0,27 ; +0,17] ; p = 0,74 ; suivi 92,9 % | verbatim (418/450) | **CORRECT** |
| **Cochrane Malanda** 22258959 | 12 ECR / 3 259 ; 6 mois −0,3 [−0,4 ; −0,1] (n = 2 324, 9 essais) ; 12 mois −0,1 [−0,3 ; +0,04] (n = 493, 2 essais) | tout verbatim | **CORRECT** |
| **Hortensius** 29334997 | n = 58 (22/16/20) ; −2,7 [−6,4 ; +1,0] et −1,0 [−4,9 ; +3,0] mmol/mol | tout verbatim | **CORRECT** |
| **REPLACE** 28000140 | n = 224 ; −0,29 vs −0,31 %, p = 0,82 ; ASG **3,8 ± 1,4 tests/j** ; temps < 0,70 g/L **−43 %**, < **0,55** g/L **−53 %** | n, HbA1c, 3,8 tests/j : **verbatim**. ★ **Les pourcentages −43 %/−53 % ne sont PAS dans l'abstract** ; ce qui l'est : **−0,47 ± 0,13 h/j sous 3,9 mmol/L (p = 0,0006)** et **−0,22 ± 0,07 h/j sous 3,1 mmol/L (p = 0,0014)**. Et **3,1 mmol/L = 0,56 g/L**, pas 0,55 | ⚠ **CORRECT sur le reste ; préférer les absolus publiés ; corriger 0,55 → 0,56** |
| **Gehlaut** 25917335 | 49,1 % ; 1,74 ép./patient/5 j ; 75 % asymptomatiques ; « pas de différence jour/nuit » ; **1,78 vs 1,81, p = 0,95** | les quatre premiers **verbatim** (« No significant daytime versus nocturnal difference »). ★ **« 1,78 vs 1,81, p = 0,95 » absent de l'abstract** (texte intégral PMC4667336 non ouvert) | **CORRECT** sauf le couple chiffré → `[À VÉRIFIER]` |
| **Bergenstal 2008** 18364392 | ECR ouvert, n = 273, 24 sem | verbatim (A1C 6,70 vs 6,54 ; Δ −1,46 vs −1,59, P = 0,24 ; < 7 % 73,2 vs 69,2 %, P = 0,70) | **CORRECT** |
| **EDITION poolée** 25929311 | « 31 % de différence de rate ratio sur 6 mois » la nuit, « 14 % » sur 24 h | verbatim (Gla-300 n = 1 247 / Gla-100 n = 1 249) | **CORRECT** |
| **PREDICTIVE 303** 17924873 | descente −3 U si moyenne des 3 GAJ < 80 mg/dL | identifiant **CORRECT** ; l'**algorithme** reste `[À VÉRIFIER]` (primaire payant, 2 secondaires concordantes) | identifiant **CORRECT** |
| **ACE** 28917545 | 470 (14 % ; 3,33/100 p-a) vs 479 (15 % ; 3,41) ; HR 0,98 [0,86-1,11] p = 0,73 ; diabète 436 (13 %) vs 513 (16 %), RR 0,82 [0,71-0,94] p = 0,005 ; suivi 5,0 ans | tout **verbatim**. ⚠ **NNT** : A1 annonce « ARR ≈ 3 pp → NNT ≈ 33/5 ans » ; les effectifs exacts donnent **13,3 % vs 15,8 %, ARR 2,5 pp, NNT ≈ 40** | **CORRECT** ; **NNT à corriger 33 → ~40** |
| **NAVIGATOR** 20228402 | core 7,9 vs 8,3 %, HR 0,94 [0,82-1,09] p = 0,43 ; étendu 14,2 vs 15,2 %, HR 0,93 [0,83-1,03] p = 0,16 ; diabète 36 vs 34 %, HR 1,07 [1,00-1,15] p = 0,05 ; excès d'hypoglycémie | tout **verbatim**. ★ **`[À VÉRIFIER]` V7 d'A1 levé** : suivi médian **5,0 ans pour le diabète**, **6,5 ans pour la mortalité** | **CORRECT** |
| **Boonpattharatthiti 2025** | PMID absent chez OE ; « −1,19 % [−1,67 ; −0,72] » | identifiant résolu : **PMID 40273351**, *Diabetes Care* 2025;48(5):837-45. ★ **Le chiffre −1,19 % n'est pas dans l'abstract** | identifiant **CORRECT** ; chiffre **NON VÉRIFIABLE** |
| **Aleppo 2021** (A5) | « PMID non résolu » | **PMID 34588210**, *Diabetes Care* 2021;44(12):2729-37. TIR **62 % → 50 %** après arrêt de la MCG | ★ **`[À VÉRIFIER]` n° 5 d'A5 levé** |

---

## §3. `[À VÉRIFIER]` des collectes que cette passe **lève**

| Origine | Point | Résolution |
|---|---|---|
| A1 · V7 | NAVIGATOR — durée de suivi des critères CV | **5,0 ans (diabète) / 6,5 ans (mortalité)** — abstract primaire |
| A4 · EDITION 1-2-3 | fenêtre nocturne d'EDITION non établie | **00:00-05:59** — établi par **Bolli 2019** (PMID 30160030), qui nomme la fenêtre « predefined » d'EDITION |
| A5 · n° 5 | Aleppo 2021, PMID non résolu | **34588210** |
| A2 · préambule | PREDICTIVE 303 = 17924873 et non 17924872 | **confirmé** : 17924872 = Solomon, cannelle |
| A3 · note de méthode | 21266647 ≠ STeP ; 28600890 ≠ MONITOR | **confirmé** : Wilson (DT1) et Bultez (échographie obstétricale) |
| dépôt vs OE | Umpierrez 2019 — N = 458 ou N = 3 014 ? | **N = 458, 3 essais** — verbatim primaire. Le dépôt a raison, OE a tort |

---

## §4. Findings — ce qui ne tient pas

### HAUTE

**H1 — L'affirmation centrale d'A3 sur l'absence d'essai « ASG vs pas d'ASG » chez l'insuliné est
fausse. Il en existe un, il est cinq fois plus grand qu'Hortensius, et il est négatif.**

A3 §4 écrit : *« Aucune revue systématique n'a jamais évalué "ASG vs pas d'ASG" chez l'insuliné — et
pour cause : le comparateur serait jugé non éthique. »* et §4.1 présente Hortensius (**n = 58**) comme
*« le seul ECR qui randomise la fréquence de l'ASG chez l'insuliné »*.

> **Nauck M, et al.** *A randomised, controlled trial of self-monitoring of blood glucose in patients
> with type 2 diabetes receiving conventional insulin treatment.* ***Diabetologia* 2014 · PMID
> 24445534.** ECR prospectif ouvert, plan factoriel 2 × 2, DT2 sous **schéma insulinique conventionnel**
> (basale ou prémix ± ADO), recrutement par les centres de la Société allemande de diabétologie.
> **SMBG + : profils 4 points une fois par semaine (n = 151) · SMBG − : pas d'ASG (n = 149)** ;
> 56 sorties d'étude. **Résultat : HbA1c 7,3 → 7,0 % dans les DEUX bras ; différence 0,0 %
> [−0,2 ; +0,2], p = 0,93.** Conclusion des auteurs : *« SMBG profiles once weekly or the disclosure
> of HbA1c results did not improve glycaemic control in patients with type 2 diabetes on conventional
> insulin treatment. »*

**Pourquoi ça compte.** (i) La phrase « personne n'a randomisé l'absence d'ASG chez l'insuliné » est
**réfutée** ; (ii) A3 fonde sur cette absence son message (b) — *« chez l'insuliné, l'ASG n'est pas
une intervention évaluée : c'est le comparateur »* — qui devient inexact ; (iii) l'essai est
**directement dans la population du nœud** (DT2 sous basale ou prémix, soins courants), il porte sur
la **densité** que le nœud envisage d'exiger, et il est **négatif** sur un profil hebdomadaire à
4 points. **OE avait nommé Nauck 2014** (§2.5 du fichier de lecture) ; aucune collecte ne l'a repris.
**À verser en §4 d'A3 avant tout encodage**, avec ses limites (schéma conventionnel, patients déjà
proches de la cible à 7,3 %, ouvert, sorties d'étude).

**H2 — « 31 % vs 27 %, p = 0,74 » (STEP-Wise) n'est pas vérifiable, et le nœud n'en a pas besoin.**
Absent de l'abstract, pas de PMC, *Endocrine Practice* en 403, aucune source secondaire produite par
A1. Or la conclusion qu'A1 en tire — « choisir le repas et titrer sur la post-prandiale n'apporte
rien de plus » — est portée par un chiffre **publié et plus fort** : **ETD −0,06 % [−0,29 ; +0,17]**
sur le critère **primaire**. **Remplacer**, et ajouter la réserve de puissance (n = 296 ; l'essai
n'exclut pas 0,29 point en faveur d'ExtraSTEP).

**H3 — BEGIN: ONCE SIMPLE USE n'isole pas « une mesure contre trois ».**
L'abstract énonce lui-même les **deux** variations simultanées (« less frequent SMBG measurements
**and** more simplified titration steps ») ; le tableau §3.2 d'A2, tiré de Patel 2019, les chiffre
(**+4 U forfaitaires** vs **+2/+4/+6/+8 U gradués**). La phrase d'A3 — *« le prix payé n'est pas la
sécurité, c'est la dose : +0,11 U/kg/j dans le bras à une mesure »* — **impute à la densité de mesure
un écart confondu avec le pas de titration**. Ce que l'essai autorise : *« un algorithme simplifié
— une seule GAJ, pas forfaitaire — est non inférieur sur l'HbA1c, au prix d'une dose finale plus
élevée »*. Corollaire : « **sans excès d'hypoglycémie** » lit une non-significativité (1,60 vs 1,17 ;
nocturne 0,21 vs 0,10 ; n = 222) comme une équivalence — à reformuler.

### MOYENNE

**M4 — Les deux NNH de FPG GOAL reposent sur des contrastes que l'essai ne teste pas.**
Le **NNT ≈ 12** est **juste et publié** (G2 vs G3, P = 0,017). Le **NNH ≈ 9** est le contraste
**G1 vs G2**, auquel la publication n'attache **aucun p**. Le **NNH ≈ 24** est le contraste
**G2 vs G3**, **non significatif** (P = 0,177) — un NNH tiré d'une différence non significative
n'est pas défendable. Les deux portent sur un **substitut** (hypoglycémie d'alerte ≤ 3,9 mmol/L),
à **24 semaines**, en population **chinoise insulino-naïve**. Le **seul critère dur** de l'essai
compte **2 événements sur 947**.

**M5 — Le mot « double » (Bolli 2019) doit être retiré.** Le pic **06:00-08:00** est **verbatim** ;
les quatre fenêtres aussi ; le facteur 2 **n'est pas publié dans l'abstract** et le texte intégral
n'a pas été ouvert. Écrire : « les fenêtres étendues au-delà de 06:00 captent **davantage**
d'événements ».

**M6 — Deux ratios d'agent circulent comme s'ils étaient publiés.** Le **19 %** de HAT (3,7/19,3) est
**correctement flagué par A4** — flag à conserver. Le **46 %** de Zick (97/209) **ne l'est pas** par
A3, et il n'est pas une sensibilité : publier le couple **26,4 % vs 56,9 % de patients**, et dériver
ensuite. Ajouter, pour HAT, que le déclaratif **biaise contre la nuit** : 19 % est un **plancher**.

### MINEURE

| # | Point |
|---|---|
| m7 | **SENIOR** : 90-130 mg/dL n'est **pas** la cible ADA du sujet âgé en bonne santé (80-130). « ~20 % de ≥ 75 ans » non vérifié. Statut pré-spécifié/post hoc du sous-groupe ≥ 75 ans **non déterminable** — **décisionnel**, puisque c'est ce sous-groupe qui porte le RR 0,45. Effet absolu à ajouter : **1,59 év./patient-année évité**. |
| m8 | **REPLACE** : préférer les absolus publiés (**−0,47 h/j** sous 3,9 mmol/L, p = 0,0006 ; **−0,22 h/j** sous 3,1 mmol/L, p = 0,0014) aux −43 %/−53 % non retrouvés ; et **3,1 mmol/L = 0,56 g/L**, pas 0,55. |
| m9 | **ACE** : NNT sur le diabète incident = **~40 sur 5 ans** (ARR 2,5 pp), pas 33 — et c'est un **substitut**. |
| m10 | **Zick** : le sigle **« SAFIR »** n'apparaît ni au titre ni à l'abstract. Le retirer ou le sourcer. |
| m11 | **Gehlaut** : « 1,78 vs 1,81, p = 0,95 » absent de l'abstract (le constat qualitatif, lui, est publié). |
| m12 | **FullSTEP** : dire que le rate ratio 0,58 porte sur des hypoglycémies **de protocole, non sévères pour l'essentiel** — c'est un critère de sécurité **substitutif**. **DiGEM** : ajouter le p global 0,12. **4T** : ajouter les données à 3 ans (basal = même HbA1c que prandial, moins d'hypoglycémie), qui nuancent la lecture pro-prandiale du résultat à 1 an. |

---

## §5. Identifiants **à bannir**

Annoncés pour un essai, correspondant à un autre. À ne réintroduire nulle part — ni dans un
`preuve-A*.md`, ni dans `E-insuline.md`, ni dans `insuline.yaml`.

| Identifiant à bannir | Annoncé pour | Article réel | Bon identifiant |
|---|---|---|---|
| **28711407** | ACE (acarbose) | Dangouloff-Ros V — anomalies de neuro-imagerie / inactivation de l'X, *Mol Genet Metab* 2017;122(3):140-4 | **28917545** |
| **20228404** | NAVIGATOR (natéglinide) | Ginsberg HN — ACCORD Lipid, *NEJM* 2010;362(17):1563-74 | **20228402** |
| **17881754** | 4T à 1 an | Braunstein GD — gynécomastie, *NEJM* 2007;357(12):1229-37 | **17890232** |
| **19861578** | 4T à 3 ans | Derenzini E — MACOP-B, histiocytose langerhansienne, *Ann Oncol* 2010;21(6):1173-8 | **19850703** |
| **12876093** | STOP-NIDDM | Jenkins DJ — portefeuille diététique vs lovastatine, *JAMA* 2003;290(4):502-10 | **12876091** |
| **19211396** | « Lankisch 1-2-3 / Davidson 2009 » | Lerman I — non-adhésion à l'insuline chez des patients à bas revenus, *Endocr Pract* 2009;15(1):41-6 | **21324825** (Davidson MB, *Endocr Pract* 2011;17(3):395-403) — et **ne jamais appeler cet essai « Lankisch »** : Lankisch = OPAL (19040645) |
| **17924872** | PREDICTIVE 303 | Solomon TP — cannelle et tolérance au glucose, *Diabetes Obes Metab* 2007;9(6):895-901 | **17924873** *(déjà écarté par A2)* |
| **21266647** | STeP | Wilson DM — HbA1c et glycémie moyenne en DT1, *Diabetes Care* 2011;34(3):540-4 | **21270183** *(déjà écarté par A3)* |
| **28600890** | MONITOR | Bultez T — échographie obstétricale du 2ᵉ trimestre, *J Ultrasound Med* 2017;36(11):2279-85 | **28600913** *(déjà écarté par A3)* |

---

## §6. `[À VÉRIFIER]` restants après cette passe

Classés par caractère décisionnel. « Décisionnel » = un encodage en dépend.

| # | Élément | Pourquoi non levé | Décisionnel ? |
|---|---|---|---|
| B1 | **STEP-Wise** — « HbA1c < 7 % : 31 % vs 27 %, p = 0,74 » | Absent de l'abstract ; pas de PMC ; *Endocr Pract* 403. **Recommandation : ne pas chercher à le lever — utiliser l'ETD −0,06 % [−0,29 ; +0,17], qui est publié** | **Oui**, mais **contournable** |
| B2 | **HEART2D** — hypothèse de séparation **2,5 mmol/L** | Vérifiée sur **deux commentaires ouverts**, pas sur la section Méthodes (403). L'abstract corrobore qualitativement (« less-than-expected differences ») | **Oui** — citable en argumentaire avec la source secondaire, **pas** en `effet_attendu` |
| B3 | **Bolli 2019** — « ×2 » en étendant à 07:59 | Wiley, pas de PMC. **Le pic 06:00-08:00, lui, est vérifié verbatim** | **Oui** — bloque le mot « double », pas le constat |
| B4 | **4T** — cibles de protocole GAJ 99 / PPG 2 h 126 mg/dL | NEJM 403. **Deux secondaires indépendantes concordantes** (bornes hautes identiques) | **Oui** (H2 d'A1) |
| B5 | **FullSTEP** — cible de titration pré-prandiale 72-130 mg/dL | *Lancet D&E* non ouvert. **Deux secondaires indépendantes concordantes** | **Oui** (H2 d'A1) |
| B6 | **SENIOR** — sous-groupe ≥ 75 ans : **pré-spécifié ou post hoc ?** ; proportion réelle de ≥ 75 ans | Texte intégral 403 | **Oui** — c'est ce sous-groupe qui porte le RR 0,45 |
| B7 | **Gehlaut** — « 1,78 vs 1,81 ép./personne, p = 0,95 » | PMC4667336 non ouvert dans cette passe | Non (le constat qualitatif est publié) |
| B8 | **REPLACE** — les pourcentages **−43 % / −53 %** | Non retrouvés dans l'abstract ; les absolus publiés suffisent | Non — **utiliser les absolus** |
| B9 | **Boonpattharatthiti 2025** (PMID 40273351) — « −1,19 % [−1,67 ; −0,72] » pour l'auto-titration ≥ 2×/sem | Absent de l'abstract | **Oui si OE-A3 est repris** — le seuil « ≥ 3 GAJ/semaine » d'OE en dépend entièrement |
| B10 | **Bolli 2025**, *Diabetes Care* 2025;48(5):671-81, DOI 10.2337/dci24-0104 | **Source non ouverte du tout dans cette passe.** Porte le « pas plus de 2 U/semaine » et la « cible 100-120 mg/dL » d'OE §2.4 | **Oui** — rien de ce bloc ne doit être écrit avant ouverture |
| B11 | **Riddle 2003** — règle de descente exacte ; **AT.LANTUS** — inversion Algo 1 / Algo 2 ; **PREDICTIVE 303** — −3 U si moyenne des 3 GAJ < 80 mg/dL | `[À VÉRIFIER]` 1, 2 et 4 d'A2 — primaires en 403/payants. **Cette passe ne les lève pas** et ne les infirme pas | **Oui** (A2 §9-1) |
| B12 | **Munshi 2016** (27273335) ; **UK Hypoglycaemia Study Group** (17415551) — répartition horaire | Textes intégraux non ouverts | Non |

---

## §7. Une remarque de méthode, pour la conciliation

Le contrôle a trouvé **zéro identifiant faux chez les agents A** et **six chez OpenEvidence**. Ce
n'est pas un hasard de tirage : les agents A ont **résolu leurs identifiants** (Europe PMC, `efetch`)
et **corrigé trois faux d'eux-mêmes** en cours de route. OE, lui, produit des **chaînes de citation
exactes** (auteur, revue, volume, pages, DOI — 6/7 justes, 3/3 DOI justes) accompagnées de **PMID
inventés** (6/7 faux). C'est un progrès net par rapport aux nœuds E et H, où la référence entière
était fabriquée — et c'est un défaut d'une autre nature, qui appelle une parade différente et simple :

> **Consigne opposable pour la conciliation : d'un retour OpenEvidence, on ne recopie jamais un PMID.
> On recopie le DOI (ou la chaîne auteur/revue/volume/pages), et on résout le PMID soi-même.**

Le second enseignement est moins confortable et ne concerne pas OE : **les deux findings les plus
lourds de cette passe ne sont pas des chiffres faux, ce sont des chiffres invérifiables (H2) et un
essai manquant (H1)**. La vérification d'identifiants ne les aurait pas attrapés. Ce qui les a
attrapés, c'est d'avoir demandé, pour chaque nombre, *« où est-il publié, exactement ? »* — et, pour
chaque affirmation négative (« aucun essai n'a… »), *« qui l'a cherché, et où ? »*.
