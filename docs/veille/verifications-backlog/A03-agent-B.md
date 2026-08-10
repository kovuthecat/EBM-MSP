# A03 — Agent B (contradicteur / red-team)

**Article passé au crible :** Lee Y-J, Hong S-J, Kang WC, et al., *on behalf of the LODESTAR
investigators*. « Rosuvastatin versus atorvastatin treatment in adults with coronary artery disease:
**secondary analysis** of the randomised LODESTAR trial. » *BMJ* 2023;383:e075837.
DOI 10.1136/bmj-2023-075837. Open access (CC BY-NC 4.0). Registre ClinicalTrials.gov NCT02579499.

**Source utilisée :** PDF intégral de l'article (10 p., mise en ligne BMJ du 18/10/2023), lu page à
page. Registre NCT02579499 lu via l'API v2 de ClinicalTrials.gov. Pas de contournement de paywall
(*BMJ* research = open access).

**Identification — RAS.** Il s'agit bien de LODESTAR : ECR ouvert, multicentrique, 12 centres sud-coréens,
**n = 4400** (2204 rosuvastatine / 2196 atorvastatine), inclusions 09/2016–11/2019, suivi médian 3 ans,
98,7 % de suivi complet. **Aucune confusion** avec la cohorte rétrospective MDPI n≈49 034 : rien dans
le document lu ne s'en approche. Une seule nuance d'intitulé, qui a son importance (cf. §2, O-1) :
le titre lui-même annonce une **« secondary analysis »**. La publication princeps de LODESTAR est
Hong SJ et al., *JAMA* 2023;329:1078-87 (treat-to-target vs haute intensité), citée en réf. 3.

---

## 1. Vérification chiffre par chiffre

Tous les chiffres proviennent du **tableau 2** (p. 4) sauf mention contraire. Les pourcentages du
tableau 2 sont des **estimations de Kaplan-Meier** (note de bas de tableau), d'où des effectifs qui ne
recalculent pas exactement les %.

| # | Annoncé (chiffres circulants) | Trouvé dans la source | Localisation | Verdict |
|---|---|---|---|---|
| 1 | Composite 3 ans **8,7 % vs 8,2 %** | 189 (8,7 %) vs 178 (8,2 %) | Tab. 2, ligne « Primary outcome » ; repris Résumé p. 1 et Résultats p. 6 | **Confirmé** |
| 2 | **HR 1,06 [0,86–1,30] p=0,58** | HR 1,06 (0,86 à 1,30) ; P=0,58 | Tab. 2 ; fig. 2 (courbe KM) ; Résumé | **Confirmé** |
| 3 | (non annoncé) différence absolue du composite | **+0,5 pp (−1,2 à 2,1)** | Tab. 2 | Complément — **manquant** dans les chiffres circulants alors que c'est le chiffre décisif (cf. O-2) |
| 4 | Nouveau diabète **7,2 % vs 5,3 %, HR 1,39 [1,03–1,87]** | 104/1479 (7,2 %) vs 74/1453 (5,3 %) ; diff. abs. **+2,0 pp (0,3 à 3,7)** ; HR 1,39 (1,03 à 1,87) ; **P=0,03** | Tab. 2, ligne *« Initiation of antidiabetics among participants without diabetes mellitus at baseline »* | **Confirmé — mais c'est la 3ᵉ de trois lignes « diabète » du tableau, et la plus favorable au message** (cf. O-3) |
| 5 | — | **Nouveau diabète (déf. principale), population totale : 152 (7,1 %) vs 119 (5,5 %) ; HR 1,29 (1,01 à 1,63) ; P=0,04** | Tab. 2 ; c'est **ce** chiffre qui ouvre la section « Clinical safety » p. 6 | **Divergence de cadrage** : dénominateur = 4400, alors que **1468 patients étaient déjà diabétiques à l'inclusion** (725/743, tab. 1) et ne sont donc pas à risque de l'événement |
| 6 | — | **Nouveau diabète chez les non-diabétiques à l'inclusion : 152/1479 (10,4 %) vs 119/1453 (8,4 %) ; diff. abs. +2,1 (−0,0 à 4,2) ; HR 1,26 (0,99 à 1,60) ; P=0,06 → NON SIGNIFICATIF** | Tab. 2, ligne intermédiaire | **Chiffre absent de tout ce qui circule.** C'est pourtant l'analyse au dénominateur correct et à la définition principale du critère. **Point le plus lourd du dossier** (cf. O-3) |
| 7 | Cataracte **2,5 % vs 1,5 %, HR 1,66 [1,07–2,58]** | Chirurgie de la cataracte : 53 (2,5 %) vs 32 (1,5 %) ; HR 1,66 (1,07 à 2,58) ; **P=0,02** | Tab. 2 ; Résumé ; p. 6 | **Confirmé** (le critère est la **chirurgie** de cataracte, pas la cataracte — à ne pas raccourcir) |
| 8 | — | Différence absolue cataracte imprimée **« 1,0 (1,4 to 1,8) »** | Tab. 2 | **Coquille de la source** : l'estimation ponctuelle (1,0) est hors de son propre IC. Lecture plausible : 1,0 pp (0,1 à 1,8). Signalé pour intégrité, et parce que la borne basse frôle 0 |
| 9 | — | LDL moyen sous traitement : **1,8 (0,5) vs 1,9 (0,5) mmol/L ; P<0,001** | Résumé p. 1 ; p. 6 ; fig. 3 | Confirmé — **écart réel = 0,1 mmol/L** (~4 mg/dL). Décisif pour O-5 |
| 10 | — | Dose moyenne à 3 ans : **rosuva 17,1 mg (SD 5,2) vs atorva 36,0 mg (SD 12,8) ; P<0,001** | Résumé p. 1 ; p. 6 | Confirmé — ratio ≈ 1:2,1, soit des doses **quasi équipotentes** |
| 11 | — | Composants du composite : décès 57 (2,6) vs 51 (2,3) HR 1,12 ; IDM 34 (1,5) vs 26 (1,2) HR 1,27 ; AVC 24 (1,1) vs 20 (0,9) HR 1,20 ; **revascularisation 115 (5,3) vs 111 (5,2) HR 1,03** | Tab. 2 | Confirmé — **la revascularisation porte 226/367 événements = 61,6 % du composite** |
| 12 | — | Ajustement pour la multiplicité | **« with no adjustment for multiple comparisons »** | Analyse statistique, p. 5 | **Confirmé explicitement par les auteurs** |
| 13 | — | Calcul d'effectif pour la comparaison rosuva/atorva | **« no a priori sample size estimation was performed on the basis of testing the different statin types »** | Limitations, p. 8 | **Confirmé** — comparaison **non dimensionnée** |
| 14 | — | Marge de non-infériorité pour rosuva vs atorva | **Aucune.** L'effectif a été calculé sur l'objectif principal de LODESTAR (treat-to-target vs haute intensité) | Analyse statistique p. 5 ; limitations p. 8 | **Introuvable, car inexistante** (cf. O-2) |
| 15 | — | Financement | **Sam Jin Pharmaceutical et Chong Kun Dang Pharmaceutical** (Séoul) + Cardiovascular Research Centre | p. 8-9 | Confirmé (cf. O-8) |

**Bilan chiffres : aucun des trois chiffres circulants n'est faux.** Le problème n'est pas
l'exactitude, c'est la **sélection** : ce qui circule est le sous-ensemble le plus démonstratif d'un
tableau qui contient aussi son propre démenti partiel (ligne 6).

---

## 2. Objections méthodologiques, par gravité

### O-1 — GRAVE : critères de sécurité **secondaires, non ajustés, sur une comparaison non dimensionnée**

Les auteurs listent **8 critères secondaires** nommés (Méthodes p. 4 : nouveau diabète ; hospitalisation
pour insuffisance cardiaque ; TVP/EP ; revascularisation endovasculaire d'AOMI ; intervention aortique ;
IRC terminale ; arrêt du traitement pour intolérance ; **chirurgie de la cataracte** ; composite
d'anomalies biologiques). Le tableau 2 en déploie **11 lignes de résultats secondaires** (+ sous-composants).

Trois faits cumulés, tous établis par la source :
1. **« no adjustment for multiple comparisons »** (p. 5, textuel).
2. **Aucun calcul d'effectif** pour la comparaison entre types de statine (p. 8, textuel).
3. Le tableau donne **deux** P « significatifs » parmi ~11 tests, à **P=0,03** et **P=0,02**.

À α=0,05 et 11 comparaisons, l'espérance de faux positifs est ≈ 0,55. Observer deux P entre 0,02 et 0,04
**n'excède pas ce que le hasard produit**. Une correction de Bonferroni (α ≈ 0,0045) n'en laisse **aucun**
survivre. Les IC à 1,03 et 1,07 ne sont pas « à un cheveu de 1 » par malchance : c'est la signature
attendue d'un dépistage multiple non corrigé.

Statut exact, à écrire tel quel : **critères secondaires de sécurité préspécifiés selon l'article, mais
non ajustés pour la multiplicité, dans une comparaison sans hypothèse dimensionnée** → **générateurs
d'hypothèses**. Les auteurs le disent eux-mêmes, deux fois : *« our findings should be interpreted with
caution, and further dedicated investigation with longer follow-up is warranted »* (p. 8) et *« the
underpinning mechanism for these relations and the possible mechanism for a drug effect still require
further investigations »* (p. 8).

**Réserve de vérification, à ne pas surjouer :** le registre **NCT02579499 ne liste qu'un critère
principal (« MACCE », 3 ans) et un unique critère secondaire fourre-tout (« numer of other adverse
clinical events », 3 ans)**. Ni le diabète ni la cataracte n'y figurent nommément. Le caractère
préspécifié de ces deux critères repose donc uniquement sur l'affirmation de l'article et sur le
protocole (réf. 3), **non corroborable par le registre**. Ce n'est pas une preuve de post-hoc — mais on
ne peut pas non plus affirmer la préspécification sur pièce. À formuler avec cette réserve.

### O-2 — GRAVE : « efficacité comparable » est une conclusion que le design ne permet pas

Le résumé et la conclusion affirment *« rosuvastatin and atorvastatin showed comparable efficacy »*.
Or il n'y a **ni marge de non-infériorité, ni calcul d'effectif, ni test d'équivalence** pour cette
comparaison. Ce qui est établi est un test de supériorité non significatif (P=0,58), **c'est-à-dire une
absence de différence démontrée, pas une équivalence démontrée**.

L'IC est explicite sur ce qui reste possible : **HR 1,06 [0,86 à 1,30]**, et en absolu
**+0,5 pp [−1,2 à +2,1]**. Autrement dit, la source **n'exclut pas jusqu'à 30 % d'excès relatif** et
**~2 pp d'excès absolu à 3 ans** sous rosuvastatine. Sur 4400 patients et 367 événements, la précision
n'est pas au rendez-vous. Le glissement « non significatif → comparable » est le défaut de raisonnement
central de l'abstract.

### O-3 — GRAVE : le chiffre « diabète » qui circule est le plus favorable de trois, et le mieux construit n'est pas significatif

Le tableau 2 empile trois estimations du même phénomène :

| Formulation | Dénominateur | Résultat |
|---|---|---|
| Nouveau diabète (déf. principale) | **4400** (inclut 1468 diabétiques préexistants, non à risque) | HR **1,29** (1,01–1,63) — P=0,04 |
| Nouveau diabète **chez les non-diabétiques à l'inclusion** | 1479 / 1453 | HR **1,26** (0,99–1,60) — **P=0,06, NS** |
| **Initiation d'antidiabétiques** chez les non-diabétiques à l'inclusion | 1479 / 1453 | HR **1,39** (1,03–1,87) — P=0,03 ← *chiffre du résumé et de la presse* |

Deux problèmes distincts :
- La ligne retenue dans le **résumé** (7,2 % vs 5,3 %) est celle qui restreint le critère à un **acte
  thérapeutique décidé par un clinicien non aveugle** (cf. O-4) — la version la plus exposée au biais et,
  simultanément, la plus significative.
- La ligne **méthodologiquement la plus propre** (bonne définition du critère **et** bon dénominateur)
  **franchit 1,00 : HR 1,26 [0,99–1,60]**. Elle n'apparaît nulle part dans ce qui circule.
- La première ligne (celle qui ouvre « Clinical safety » p. 6) met **1468 patients déjà diabétiques au
  dénominateur d'un critère de diabète incident**. Estimation Kaplan-Meier ou non, cette population n'est
  pas à risque de l'événement.

Ce n'est pas de la fraude — les trois lignes sont publiées côte à côte, ce qui est honnête. C'est un
**problème de mise en avant**, et il se propage intégralement dans la reprise secondaire.

### O-4 — GRAVE pour la cataracte, MODÉRÉE pour le diabète : essai ouvert et critères à déclenchement médical

L'essai est **open label** (registre : `masking: NONE`). Un comité d'événements cliniques **en aveugle**
a adjugé tous les critères (p. 4 et p. 8) — cela neutralise la **mauvaise classification** d'un événement
rapporté, mais **pas l'ascertainment bias** : le comité ne peut adjuger que ce qu'on lui soumet, et le
déclenchement de l'événement dépend d'un clinicien qui connaît le bras.

Il faut distinguer les deux critères, sous peine d'objection paresseuse :

- **Cataracte — objection non contrée par la source, et concédée par les auteurs.** Limitation nº 5,
  textuelle : *« regular ophthalmological examinations for the detection of cataracts were not specified
  in the protocol »* (p. 8). Il n'y a donc **aucune surveillance ophtalmologique protocolisée ni
  symétrique**. Le critère est de surcroît la **chirurgie**, c'est-à-dire une indication posée par un
  praticien, dans un contexte où la crainte « statine puissante = cataracte » est publiquement
  documentée (les auteurs citent eux-mêmes cette hypothèse, réf. 31-33). Détection différentielle
  **entièrement plausible et non mesurable**. 53 vs 32 événements : il suffit d'une poignée d'indications
  posées plus volontiers d'un côté pour produire ce HR.
- **Diabète — objection réelle mais partiellement neutralisée, et il faut le dire.** Le protocole
  imposait un **dosage sérié de la glycémie plasmatique et de l'HbA1c à 12, 24 et 36 mois dans les deux
  bras** (p. 3). La *surveillance* était donc protocolisée et symétrique, ce qui protège le critère
  biologique. En revanche, la ligne mise en avant dans le résumé — *initiation d'antidiabétiques* — est,
  elle, une **décision thérapeutique en ouvert** : c'est précisément la variante la plus vulnérable qui a
  été promue. Élément qui joue **en sens inverse** et qu'il serait malhonnête d'omettre : l'analyse post
  hoc intégrant l'HbA1c ≥ 6,5 % (critère purement biologique, insensible à la décision du prescripteur)
  donne **9,5 % vs 7,7 %, HR 1,25 [1,02–1,53], P=0,03** (p. 6) — cohérente en direction et en amplitude.
  Le signal diabète **ne s'explique pas entièrement par le biais d'ouverture**.

### O-5 — MODÉRÉE, et elle **ne va pas dans le sens attendu** : l'hypothèse « c'est un effet de dose/intensité » ne tient pas quantitativement

C'est l'objection que j'étais chargé de creuser en priorité. **Après vérification, elle ne résiste pas
aux chiffres de la source, et je le signale plutôt que de la maquiller.**

- Doses moyennes : **rosuva 17,1 mg vs atorva 36,0 mg**. La rosuvastatine étant environ deux fois plus
  puissante en mg, ces doses sont **quasi équipotentes**. Il n'y a pas de non-équivalence grossière.
- LDL atteint : **1,8 vs 1,9 mmol/L**, soit **0,1 mmol/L d'écart** (~4 mg/dL). L'écart est statistiquement
  significatif (P<0,001, grand n) mais **cliniquement minuscule**.
- Les auteurs citent eux-mêmes Swerdlow (*Lancet* 2015, réf. 29) : via l'inhibition de l'HMG-CoA réductase,
  **0,1 mmol/L de LDL en moins ≈ +2 % à +6 % de risque de diabète**. Or on observe **+26 % à +39 %**.
  **L'écart de LDL est d'un ordre de grandeur trop petit pour expliquer l'excès observé.**
- Deux données du même article enfoncent le clou, et elles vont **contre** la thèse « le bras rosuva était
  plus traité » : l'usage de statine **haute intensité était plus faible** dans le bras rosuvastatine
  (71,9 % vs 74,7 % à 2 ans, P=0,04 ; **70,9 % vs 74,0 % à 3 ans, P=0,02**) et l'**ézétimibe était moins
  utilisé** dans le bras rosuvastatine dès 3 mois (tous P<0,05). Le bras atorvastatine était donc, sur ces
  deux métriques, **plus intensivement traité** — et il a eu **moins** de diabète.

**Conclusion sur ce point, à contre-courant de l'attente :** on ne peut **pas** requalifier l'excès de
diabète en simple effet d'intensité. Ce qui reste vrai en revanche, c'est que ces déséquilibres
(intensité, ézétimibe) sont des **variables post-randomisation** : elles n'invalident pas la randomisation
mais rendent l'attribution causale à la molécule elle-même incertaine dans l'autre sens aussi. Le
mécanisme reste indéterminé, comme les auteurs le concèdent. L'objection correcte n'est donc pas
« c'est la dose », c'est **« l'imprécision et la multiplicité »** (O-1, O-3).

### O-6 — MODÉRÉE : le composite est porté par la revascularisation, donc l'« équivalence » sur critères durs est peu établie

**226 des 367 événements du critère principal (61,6 %) sont des revascularisations coronaires** — le seul
composant du composite qui soit *à la fois* mou et **décidé par un clinicien non aveugle**, sur une
angiographie dont l'indication est elle-même discrétionnaire. Le composite mêle donc un critère
« sensible au bras connu » et des critères durs peu nombreux.

Les événements durs sont trop rares pour conclure quoi que ce soit : décès 57 vs 51, IDM 34 vs 26, AVC
24 vs 20. Les auteurs le reconnaissent (limitation nº 3 : *« the comparison of individual components of
the primary outcome was hampered by the small number of events »*). À noter, sans en tirer de conclusion :
**les quatre composants vont numériquement dans le même sens, en défaveur de la rosuvastatine**
(HR 1,12 ; 1,27 ; 1,20 ; 1,03) — cohérence directionnelle qui ne prouve rien à ces effectifs, mais qui
interdit de présenter le résultat comme un match nul serein sur les critères durs.

### O-7 — FAIBLE / point qui tient : le design factoriel est correctement construit

Vérification faite, **c'est un des points solides de l'essai** :
- Randomisation **2×2 factorielle préspécifiée** (facteur 1 : stratégie treat-to-target vs haute intensité ;
  facteur 2 : rosuvastatine vs atorvastatine), par **web response interactif, blocs permutés mixtes (4 ou 6)**,
  par centre (p. 2).
- **Stratification sur le LDL de base ≥ 2,6 mmol/L, le SCA, et la présence d'un diabète à l'inclusion**
  (fig. 1, note † et p. 2-3). La stratification sur le diabète préexistant est exactement ce qu'il fallait
  pour le critère « nouveau diabète ».
- **Pas d'interaction significative** entre type de statine et stratégie d'intensité pour le critère
  principal (**P=0,77**, tab. supp. S10), ce qui valide l'analyse marginale « à la factorielle » et
  **isole correctement la comparaison rosuva/atorva**.
- Caractéristiques initiales **bien équilibrées** (tab. 1), analyse **en ITT**, **98,7 %** de suivi complet
  à 3 ans, analyses de sensibilité **per protocole** concordantes (tab. supp. S7).

Reste que la randomisation valide **l'allocation**, pas la **puissance** : le facteur 2 n'a jamais été
dimensionné (O-1).

### O-8 — FAIBLE à MODÉRÉE : financement industriel orienté dans le sens du résultat

*« This study was funded by Sam Jin Pharmaceutical, Seoul, Korea, and Chong Kun Dang Pharmaceutical,
Seoul, Korea »* (p. 8). Déclaration d'intérêts : *« the study was funded by a grant from Sam Jin
Pharmaceutical and Chong Kun Dang Pharmaceutical. M-KH has received speaker's fees from Medtronic,
Edward Lifesciences, Viatris Korea, and Daiichi Sankyo, and institutional research grants from Sam Jin
Pharmaceutical and Chong Kun Dang Pharmaceutical »* (p. 9).

Il est établi par ailleurs que **Chong Kun Dang commercialise en Corée des associations
atorvastatine + ézétimibe** (Atozet, co-commercialisé avec MSD ; Lipilouzet). Un essai financé par un
industriel présent sur l'atorvastatine et qui conclut à un **profil de sécurité plus favorable pour
l'atorvastatine** mérite d'être signalé. À pondérer, honnêtement : les auteurs déclarent que
*« the funders had no role in considering the study design; the collection, analysis, or interpretation
of data; the writing of the report; or the decision to submit the article for publication »* (p. 9) ;
il s'agit de génériqueurs coréens probablement présents sur les deux molécules ; et l'essai est
« investigator initiated ». Ce n'est **pas** l'objection principale — c'est un élément de contexte, et
la présenter comme un argument décisif serait excessif.

---

## 3. Spin détecté

**Oui, du spin, mais localisé — et il est très largement amplifié en aval.**

**Ce qui relève du spin dans l'article :**
1. **« Comparable efficacy »** dans le résumé et la conclusion, alors qu'aucune marge d'équivalence ou de
   non-infériorité n'a été définie et qu'aucun effectif n'a été calculé pour cette comparaison. C'est
   l'interprétation d'un test négatif comme une preuve de nullité, sur un IC allant jusqu'à HR 1,30. **Spin
   caractérisé.**
2. **Sélection de la ligne « diabète » la plus démonstrative** dans le résumé (7,2 % vs 5,3 %, HR 1,39)
   quand la ligne voisine, mieux construite, donne HR 1,26 [0,99–1,60] **non significative**. Le résumé ne
   mentionne pas cette dernière. **Spin par omission sélective.**
3. Le résumé énonce diabète et cataracte **sans le moindre mot** sur l'absence d'ajustement pour la
   multiplicité ni sur le caractère non dimensionné de la comparaison. Un lecteur d'abstract seul en sort
   avec deux « résultats », pas deux hypothèses.
4. La rubrique **« What this study adds »** (p. 1) affirme sans réserve : *« it incurred a higher risk of
   new onset diabetes mellitus requiring antidiabetics and cataract surgery than atorvastatin »*. Le verbe
   *incurred* est causal et non hedgé, dans l'encadré le plus lu de la revue.

**Ce qui, à l'inverse, est honnête et doit être porté au crédit des auteurs — un red-team qui l'omettrait
mentirait :**
- Les **trois** estimations du diabète sont publiées côte à côte, y compris celle qui est non significative.
- Le corps du texte est prudent : *« Further study is, however, required before any causative effect can be
  established or rebutted »* (p. 7) ; *« our findings should be interpreted with caution »* (p. 8).
- Les **six limitations sont explicites et pertinentes**, dont les deux les plus gênantes pour eux : absence
  de calcul d'effectif sur le type de statine, et absence d'examen ophtalmologique protocolisé.
- L'absence d'ajustement pour la multiplicité est **écrite noir sur blanc** (p. 5) plutôt que dissimulée.

**Le vrai spin est donc en aval.** Le communiqué du BMJ Group titre sur les deux signaux ; les reprises
transforment deux critères secondaires exploratoires en « préférer l'atorvastatine ». **Un article qui
écrit lui-même « no adjustment for multiple comparisons » et dont la presse tire une recommandation de
prescription : c'est exactement le cas de figure à documenter.**

---

## 4. Cohérence avec la totalité des preuves

**Diabète — attendu en direction, probablement surestimé en amplitude.**
Le sur-risque diabétogène des statines est établi et dose-dépendant : méta-analyse Sattar (*Lancet* 2010,
réf. 28 de l'article) → **+9 %** ; JUPITER (réf. 27) → **+0,6 pp** en absolu sous rosuvastatine 20 mg vs
placebo. La direction de LODESTAR est donc cohérente. L'**amplitude** ne l'est pas : +26 % à +39 % pour
**0,1 mmol/L** d'écart de LDL, quand la génétique HMGCR (Swerdlow, réf. 29) prédit **+2 % à +6 %** pour
cet écart. Signature classique de la **malédiction du vainqueur** sur un critère secondaire non ajusté et
sous-dimensionné : le vrai effet, s'il existe, est vraisemblablement bien plus petit que 1,39.
Deux appuis externes partiels, dans le même sens et avec la même modestie :
- **Cardiovascular Diabetology 2024** (analyse *post hoc* de LODESTAR restreinte aux patients sous haute
  intensité, n=2377) : **NODM 11,4 % vs 8,8 %, HR 1,32 [0,98–1,77], P=0,071 → non significatif**. Le signal
  **disparaît** dès qu'on le reteste sur un sous-groupe. Seul un sous-sous-groupe (LDL atteint < 70 mg/dL)
  redevient significatif — découpage post-hoc de post-hoc, à ne pas relayer.
- **Annals of Internal Medicine 2024;177:1641-51** (émulation d'essai cible, CRDS + UK Biobank, n=285 680) :
  risque de DT2 **plus élevé sous rosuvastatine dans la base UK Biobank** — mais, dans la même étude, la
  rosuvastatine fait **mieux sur la mortalité toutes causes et les MACE** dans les deux bases. Toute reprise
  qui invoque cette étude pour charger la rosuvastatine doit citer les deux moitiés.

**Cataracte — signal isolé, en contradiction avec les données randomisées. À ne pas relayer comme un résultat.**
La littérature va **contre** ce signal :
- Méta-analyse *JAHA* 2017 (Yu S et al., 10.1161/JAHA.116.004180) : sur les **ECR**, **RR 0,89 [0,72–1,10]**
  → **aucune augmentation**. Les cohortes donnent RR 1,13 [1,01–1,25], les cas-témoins rien ; conclusion des
  auteurs : pas de preuve claire d'un sur-risque, et le sur-risque des cohortes est le plus exposé au biais
  d'indication et de surveillance.
- Une autre méta-analyse conclut même à un **effet protecteur** (~20 % de cataractes en moins).
- HOPE-3, cité par les auteurs de LODESTAR eux-mêmes (réf. 33), sert de **repère de taux de base** (3,8 % de
  chirurgies sur 5,6 ans), pas de comparaison entre molécules.

Donc : un signal **unique**, sur **53 vs 32 événements**, dans un essai **ouvert**, **sans surveillance
ophtalmologique protocolisée**, sur un critère qui est un **acte chirurgical décidé en connaissance du bras**,
**non ajusté** pour ~11 comparaisons, **à P=0,02** — contre une méta-analyse d'ECR négative. La réponse à la
question posée est **non : ce signal ne doit pas être relayé comme un résultat**. Au mieux, comme une
observation à réfuter ou confirmer par une étude dédiée, ce que les auteurs demandent d'ailleurs.

---

## 5. Ce qui tient malgré tout

Obligatoire, et sincère. Après examen, plusieurs éléments **résistent** :

1. **L'identification est bonne.** Aucune trace de la confusion avec la cohorte MDPI n≈49 034. C'est bien
   l'ECR *BMJ* 2023;383:e075837.
2. **Les trois chiffres qui circulent sont exacts** et localisables au tableau 2. Le grief est la sélection,
   pas la falsification.
3. **La qualité d'exécution de l'essai est réelle** : randomisation centralisée par blocs permutés et
   stratifiée (dont sur le diabète préexistant), groupes équilibrés (tab. 1), **analyse en ITT**, **98,7 %
   de suivi complet à 3 ans** — remarquable —, **adjudication de tous les événements par un comité en
   aveugle**, analyses per protocole concordantes, pas d'arrêt précoce. Sur la grille RoB2 simplifiée, tout
   passe **sauf** l'aveugle et la sélection du résultat rapporté.
4. **Le design factoriel est propre et la comparaison rosuva/atorva est correctement isolée** (préspécifié,
   pas d'interaction, P=0,77). L'objection nº 3 du cahier des charges **ne trouve pas de faille**.
5. **L'objection « effet de dose » ne tient pas** : doses quasi équipotentes (17,1 vs 36,0 mg), écart de LDL
   de 0,1 mmol/L, et bras atorvastatine **plus** exposé à la haute intensité et à l'ézétimibe. Il faut le
   dire au lieu de recycler une objection commode.
6. **Le signal diabète n'est pas purement un artefact d'ouverture** : la surveillance glycémique était
   protocolisée à 12/24/36 mois dans les deux bras, et l'analyse post hoc fondée sur l'**HbA1c ≥ 6,5 %**
   (indépendante de la décision du prescripteur) reste concordante (HR 1,25 [1,02–1,53]). C'est cohérent
   avec un effet de classe dose-dépendant bien établi. **Direction plausible, amplitude non fiable.**
7. **La transparence des auteurs est supérieure à la moyenne** : non-ajustement déclaré, absence de calcul
   d'effectif déclarée, absence de surveillance ophtalmologique déclarée, trois estimations du diabète
   publiées ensemble, langage causal explicitement refusé dans la discussion.
8. **Un message négatif utile subsiste** : sur 4400 coronariens suivis 3 ans, **on n'a pas mis en évidence
   de supériorité clinique de l'une des deux molécules**, malgré un LDL un peu plus bas sous rosuvastatine.
   C'est une information cliniquement pertinente en soi — un LDL marginalement plus bas ne s'est pas traduit
   par un bénéfice sur les événements. À condition de l'énoncer comme « pas de différence démontrée » et non
   comme « équivalence prouvée ».

---

## 6. Verdict

### Niveau de preuve proposé (GRADE simplifié), **par question** — un niveau global unique serait trompeur

| Question | Niveau | Justification |
|---|---|---|
| **Efficacité : pas de différence démontrée sur le composite CV à 3 ans** | **MODÉRÉ** | ECR, randomisation et ITT solides, suivi 98,7 %, adjudication en aveugle. Déclassé pour **imprécision** (IC jusqu'à HR 1,30 ; +2,1 pp non exclus), **absence de marge d'équivalence**, et composite **porté à 61,6 % par la revascularisation**, critère mou en ouvert |
| **Sur-risque de diabète sous rosuvastatine** | **FAIBLE** | Critère secondaire, **non ajusté** pour ~11 comparaisons, comparaison **non dimensionnée** ; la ligne la mieux construite est **non significative** (HR 1,26 [0,99–1,60]) ; amplitude incohérente avec 0,1 mmol/L de LDL. Relevé : direction cohérente avec CTT/JUPITER et confirmée par l'analyse HbA1c → **plausible mais non quantifiable** |
| **Sur-risque de chirurgie de la cataracte** | **TRÈS FAIBLE** | Critère secondaire non ajusté, **essai ouvert sans surveillance ophtalmologique protocolisée** (concédé p. 8), critère = **acte chirurgical décidé en connaissance du bras**, 53 vs 32 événements, P=0,02, **en contradiction avec la méta-analyse d'ECR** (RR 0,89 [0,72–1,10]). **Signal isolé** |

### Effets absolus, à faire figurer obligatoirement (§5 de la grille)

- Composite : **+0,5 pp à 3 ans [−1,2 à +2,1]** → **pas de NNT/NNH interprétable**.
- Initiation d'antidiabétiques : **+2,0 pp à 3 ans [0,3 à 3,7]** → **NNH ≈ 50 sur 3 ans** (IC ≈ 27 à 333).
- Chirurgie de la cataracte : **+1,0 pp à 3 ans** → **NNH ≈ 100 sur 3 ans**, borne basse de l'IC absolu au
  ras de zéro (et coquille d'impression dans le tableau, cf. §1 ligne 8).

### Classement pour l'outil

- **Niveau d'impact : `informatif`**, pas `pratique`.
- **N'impacte aucun nœud de décision.** Deux critères secondaires exploratoires non ajustés, dont un
  contredit par la méta-analyse d'ECR, ne justifient **en aucun cas** de modifier une recommandation de
  choix de molécule. La conclusion « préférer l'atorvastatine chez le coronarien » est **une erreur
  d'interprétation** et doit être écartée explicitement.

### Décision éditoriale

**Publiable en `analyse` — mais uniquement au prix d'un recadrage complet, faute de quoi : `breve`.**

Ce n'est pas un article à écarter : la source est solide, l'essai bien conduit, et le sujet (choix de
molécule chez le coronarien) parle directement à la MSP. Ce qui est inpubliable en l'état, c'est **le
cadrage** qui circule.

Conditions non négociables pour un format `analyse` :
1. Titrer sur **« aucune différence d'efficacité démontrée »**, jamais sur « préférer l'atorvastatine ».
2. Écrire que la comparaison **n'a pas été dimensionnée** et qu'il n'y a **aucun ajustement pour la
   multiplicité** — en citant les deux phrases textuelles de l'article (p. 5 et p. 8). C'est le cœur du
   dossier et c'est vérifiable par le lecteur.
3. Donner les **trois** lignes « diabète », y compris **HR 1,26 [0,99–1,60], NS**.
4. Donner les **effets absolus et les NNH** (≈ 50 et ≈ 100 à 3 ans), pas seulement les HR.
5. Pour la cataracte : mentionner la **méta-analyse d'ECR négative** (RR 0,89 [0,72–1,10]) **dans le même
   paragraphe** que le signal, et l'absence de surveillance ophtalmologique protocolisée.
6. Mentionner le **financement industriel** (Sam Jin, Chong Kun Dang) sans en faire l'argument central.
7. Message pour la pratique : **rien ne change**. Le choix entre rosuvastatine et atorvastatine chez le
   coronarien reste guidé par l'intensité requise, les interactions et le coût. Surveillance glycémique
   sous statine de forte intensité : déjà de bonne pratique, indépendamment de cet essai.

Si le format retenu ne permet pas de porter les points 2 à 5, alors **reclasser en `breve`** avec la seule
conclusion défendable : *« pas de différence d'efficacité démontrée entre rosuvastatine et atorvastatine
chez le coronarien à 3 ans ; signaux de sécurité exploratoires, non confirmés, ne modifiant pas la
prescription »*. **Ne pas reporter** : la vérification est complète et la source ne réserve plus de surprise.
