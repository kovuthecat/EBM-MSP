# Passe A — collecte A3 : que vaut l'autosurveillance glycémique capillaire (ASG/SMBG) comme instrument de pilotage ?

> **Statut : COLLECTE AGENT A — non red-teamée, non validée référent.** Écrite le 2026-07-29.
> Pipeline `00-global.md` étape 2-3 (collecter/apprécier). **Rien de ce document n'entre dans
> `content/**` avant sa passe adversariale** (agent B) — discipline `CONSTRUIRE-UN-MODULE.md` §P4.
>
> **Aucun fichier n'a été modifié** : ni `content/`, ni `src/`, ni `schema/`, ni `E-insuline.md`.
>
> **Périmètre de cet agent** : extraction/chiffrage des essais + **le cadre français**, qu'OpenEvidence
> ne sait pas couvrir (`00-global.md` §Règles de sourcing). Le pendant OE de cette question est
> [`PROMPTS-OE-passeA.md` §OE-A3](PROMPTS-OE-passeA.md) ; les deux devront être réconciliés.
>
> **Note de méthode — deux PMID de départ étaient faux.** Vérification systématique faite : le PMID
> que je portais pour STeP (21266647) pointe une analyse JDRF/DT1, celui que je portais pour MONITOR
> (28600890) une étude d'échographie obstétricale. Corrigés ci-dessous (21270183 · 28600913). Aucun
> chiffre de ce document n'a été écrit de mémoire : tous viennent d'un `efetch` PubMed, d'un texte
> intégral PMC, ou d'un PDF du corpus local, tous cités.

---

## 1. Question

**Sur quel niveau de preuve l'édifice « sans capteur » repose-t-il, et à partir de quelle densité de
mesures l'ASG devient-elle exploitable pour piloter une insuline ?**

Le nœud `insuline` fait aujourd'hui reposer **toute** sa branche `mcg_disponible == false` sur trois
objets : la **glycémie à jeun** (pivot de `gaj_a_cible`, 0,70-1,20 g/L), la **glycémie post-prandiale**
(« < 1,80 g/L à 2 h », option 3b) et les **profils capillaires 6-7 points** (alerte « Sans MCG… »).
Aucun des trois n'est adossé, dans le YAML, à une source qui le porte : les `references` de l'option 3b
sont `fullstep` / `bertuol` / `quatre-t`, trois essais d'**intensification** qui ne traitent pas du
seuil post-prandial. **C'est un constat de traçabilité, pas une accusation de fausseté** — §7 montre
que les deux seuils ont bien un ancrage français, simplement pas celui qui est écrit.

Trois questions dérivées, posées par les vignettes V-A7 (le patient qui ne mesure rien) et V-A8 (une
seule mesure, le matin) :

1. Existe-t-il une **densité minimale d'ASG** en dessous de laquelle on ne peut pas piloter une
   insuline en sécurité — fondée sur des données, ou pragmatique ?
2. Quelle proportion des **hypoglycémies nocturnes** l'ASG de routine **manque-t-elle** ?
3. Que disent les sources FR sur l'**indication** et le **remboursement** de l'ASG chez le DT2
   insulino-traité ?

**Deux populations, deux niveaux de preuve** — la distinction n'est pas cosmétique, elle est la clé de
tout ce dossier : la littérature abondante et **négative** porte sur les **non-insulinés** ; la
population du nœud (**insulinés**) est celle où l'ASG est unanimement jugée indispensable **et** celle
où presque rien n'a été essayé.

---

## 2. Sources locales consultées (`docs/decision/sources/`) — avant toute recherche web

| Fichier local | Ce qu'il donne sur l'ASG | Verdict |
|---|---|---|
| `strategie_therapeutique…_recommandations.pdf` (**HAS 2024**) | **Exclut explicitement l'ASG de la mise à jour** : « *Cette mise à jour ne concerne pas les recommandations portant sur : ‒ la redéfinition des objectifs glycémiques ou **la place de l'autosurveillance glycémique qui restent maintenues selon les recommandations de bonne pratique en cours*** » (p.5). Trois mentions opérantes, toutes **grade AE** : **R.52** (à l'introduction d'un médicament hypoglycémiant : « la mise en place d'une ASG et la prescription d'un lecteur sont **discutées** et l'utilisation de celui-ci **encouragée** »), **R.81** (l'insulinothérapie est « accompagnée et **idéalement précédée** d'une ASG »), **R.82** (elle « nécessite […] la réalisation d'une ASG, l'adaptation des doses d'insuline afin d'atteindre les objectifs »). **Aucune fréquence, aucun seuil glycémique capillaire.** | ⚠ **La doctrine ASG de la HAS n'est PAS dans ce PDF** — elle est renvoyée aux textes antérieurs (→ §7) |
| `SFD 2025.pdf` | **Partie 11 entière + Avis n°23** — le texte FR le plus complet et le plus récent (verbatim en §7). Donne les **indications** et le **remboursement**, **jamais une fréquence**. | ★ source FR de référence |
| `Insulinothérapie dans le diabète de type 2 _ ebmfrance.pdf` | **La seule source du corpus qui chiffre une densité** : « *Pendant le traitement par insuline du soir, il suffit de mesurer la glycémie à jeun le matin et lorsque les symptômes d'hypoglycémie apparaissent* » ; algorithme de montée (**+2 U si GAJ ≥ 6,0 mmol/L 3 matins consécutifs**) **et de descente** (si GAJ < 4,0 mmol/L : « *1 fois sur 3 : pas de modification ; plus fréquemment : réduire la dose de 2 unités* » ; hypo symptomatique → **−4 U**) ; **désescalade de fréquence** (« *Une fois la dose stabilisée, la mesure de la glycémie à jeun peut être effectuée moins fréquemment, par exemple **une fois par semaine*** ») ; et pour l'ajout d'un GLP-1, la décision se prend sur « *la moyenne des mesures à jeun […] **sur une période de 8 semaines*** ». | ★★ **pivot de la §5** |
| `Traitement global et suivi du diabète de type 2 _ ebmfrance.pdf` | « *les patients sous insulinothérapie sont **les principaux patients concernés** par l'autosurveillance […] **il suffit de déterminer la glycémie à jeun** lorsque le patient est sous insuline basale* » ; et une clause d'arrêt : « *Si le taux d'HbA1c est resté dans les limites de l'objectif […] pendant une longue période, **il ne sera pas nécessaire de procéder à une autosurveillance régulière entre les visites*** ». Porte un **niveau de preuve « B »** attaché à l'énoncé *Self-monitoring of blood glucose in patients with type 2 diabetes mellitus who are **not** using insulin* — c'est-à-dire que **le seul grade EBM affiché par ebmfrance sur l'ASG porte sur la population non insulinée**. | ★ + `[À VÉRIFIER]` : direction/ampleur de l'evidence summary B non lues (seul le titre est dans le PDF local) |
| `pdp_pompe_insuline_externe_mcg.pdf` (**SFD Paramédical 2022**) | ⚠ **Trouvaille non repérée jusqu'ici** : « *Chez l'adulte, **quel que soit le type de diabète**, les objectifs concernant les **glycémies postprandiales mesurées en capillaire sont < 1,80 g/L, une à deux heures après le début du repas*** » (§ objectifs glycémiques). Donne aussi les critères de remboursement MCG exprimés **en densité d'ASG** : FSL = insulinothérapie intensifiée (pompe ou ≥ 3 inj/j) **+ ASG ≥ 3/j** ; MCG « classique » (DT1) = HbA1c ≥ 8 % **+ ASG ≥ 4/j**. | ★★ **ancre le seuil post-prandial du nœud** |
| `mmm_referentielmcg_ep11.pdf` (**SFD, MCG, hors-série 2017**) | « *plusieurs études chez le patient **DT1** ont clairement établi la relation entre la fréquence quotidienne de l'ASG et le niveau d'HbA1c, avec un **plafonnement de l'effet se situant aux alentours de 10 autocontrôles par jour*** » [réf. Miller 2013] ; « *Les recommandations émises par la HAS précisent qu'au cours du **DT1**, l'ASG doit comporter **au moins 4 mesures par jour*** » [réf. **HAS, « Indications et prescription d'une ASG chez un patient diabétique », 2007**] ; et un chiffre de vraie vie française : « *seulement **29,4 %** des patients sous schéma de type basal/bolus (DT1 et DT2) effectuent un nombre de mesures d'ASG conforme aux recommandations de la HAS* » [Guerci, *Rev Santé Publique* 2017;29:229-240]. | ★ mais **DT1** — extrapolation à signaler |
| `prescrire-dt2.md` | **Lecture intégrale P1→P13 : aucune occurrence d'« autosurveillance », « ASG », « glycémie capillaire », « bandelette ».** Prescrire, dans ce qui est en notre possession, **ne traite pas l'ASG**. | ⚠ **absence dans notre corpus ≠ absence de position Prescrire** → §10 |
| `NICE 2023.pdf` | Extraction texte : **aucune occurrence** de *self-monitoring* / *SMBG* / *capillary*. Le PDF local est un extrait partiel (parcours statine), pas NG28 intégral. | ✗ inexploitable ici |

*(Pas de source **CMG** sur l'ASG — cohérent avec `E-insuline.md` §5b correction n°4 : « aucune position CMG
dédiée ». Une recherche web dédiée n'a ramené qu'un chapitre FMC du *Quotidien du Médecin*, qui n'est pas
le CMG. **Ne pas citer de position CMG.**)*

---

## 3. Grille (a) — DT2 **NON** traité par insuline : la preuve est faible et largement négative

> C'est la population où l'ASG a été **massivement** évaluée, et c'est là que le résultat est le plus
> décevant. Ce §3 existe pour une raison défensive : **empêcher le nœud de sur-vendre l'ASG** en
> important dans la population insulinée un bénéfice qui n'a jamais été démontré ailleurs.

| Essai / revue | PMID · DOI | Design · population | **Calendrier de mesure exact** | Comparateur · suivi | HbA1c (absolu + IC) | Hypoglycémie | Critères durs | GRADE |
|---|---|---|---|---|---|---|---|---|
| **ESMON** (O'Kane, *BMJ* 2008;336(7654):1174-7) | **18420662** · 10.1136/bmj.39534.571644.BE | ECR ouvert, n=184 (96 ASG / 88 témoins), DT2 **nouvellement diagnostiqués**, 1 an | **4 glycémies à jeun + 4 post-prandiales par SEMAINE** (texte intégral PMC2394643), + conseils de réaction aux valeurs hautes/basses (revoir l'alimentation, marcher) | Pas d'ASG · 12 mois | **6,9 (0,8) % vs 6,9 (1,2) %**, p=0,69 ; **IC95 de la différence −0,25 à +0,38 %** | « pas de différence significative » | aucun | **modere** (ouvert, n modeste, 1 an) |
| | | | | | | | ⚠ **effet indésirable mesuré** : score de la sous-échelle **dépression 6 % plus haut** sous ASG, p=0,01 | |
| **DiGEM** (Farmer, *BMJ* 2007;335(7611):132) | **17591623** · 10.1136/bmj.39247.447431.BE | ECR ouvert 3 bras, n=453, DT2 non insulinés, âge moyen 65,7 ans | Bras ASG : **3 valeurs par jour, 2 jours par semaine** (1 à jeun + 2 pré-prandiales ou 2 h post-prandiales) ; cibles 4-6 mmol/L à jeun / 6-8 mmol/L post-prandial ; appeler le médecin si > 15 ou < 4 mmol/L. Bras « intensif » = **même calendrier** + formation à l'interprétation | Soins usuels (HbA1c /3 mois) · 12 mois | ASG « moins intensive » vs témoin **−0,14 % (IC95 −0,35 à +0,07)** ; ASG « plus intensive » vs témoin **−0,17 % (−0,37 à +0,03)** | non rapporté dans l'abstract | aucun | **modere** |
| **STeP** (Polonsky, *Diabetes Care* 2011;34(2):262-7) | **21270183** · 10.2337/dc10-1732 | ECR **en grappes**, 34 cabinets de soins primaires, n=483, DT2 **non insulinés**, HbA1c ≥ 7,5 % | ★ **Profil 7 points sur 3 jours consécutifs**, répété **au moins tous les trimestres**, sur un support papier interprété **conjointement** par le patient et le médecin, avec **algorithme de traitement fourni au médecin** | ASG « active » non structurée · 12 mois | ITT : **−1,2 % vs −0,9 %** → **différence −0,3 %, p=0,04** · per-protocole : **−1,3 % vs −0,8 %** → **−0,5 %, p<0,003** | non rapporté | aucun | **modere↓** (grappes, per-protocole très déperditif : 130/256 vs 161/227) |
| **STeP — volet psychologique** (Fisher, *Curr Med Res Opin* 2011;27 Suppl 3:39-46) | **21916532** | même essai | idem | idem | — | — | **Contredit ESMON** : dépression et détresse **baissent** dans les deux bras, sans différence ; l'ASG structurée **ne dégrade pas** l'humeur | **faible** |
| **MONITOR** (Young, *JAMA Intern Med* 2017;177(7):920-9) | **28600913** · 10.1001/jamainternmed.2017.1233 | ECR pragmatique 3 bras, 15 cabinets, n=450, DT2 non insulinés, HbA1c 6,5-9,5 % | **1 ASG par jour** (± messages personnalisés délivrés par le lecteur) | Pas d'ASG · 52 semaines | **ASG+messages vs rien −0,09 % (IC95 −0,31 à +0,14)** ; **ASG seule vs rien −0,05 % (−0,27 à +0,17)** ; p global = 0,74 | « aucune différence notable » sur la fréquence des hypoglycémies | aucun | **modere-eleve** (pragmatique, 92,9 % de suivi) |
| **Cochrane** (Malanda, 2012, CD005060.pub3) | **22258959** · 10.1002/14651858.CD005060.pub3 | Revue systématique, **12 ECR, 3 259 patients**, DT2 **non insulinés** (insulinés **exclus par protocole**) | hétérogène | — | **6 mois : −0,3 % (IC95 −0,4 à −0,1)** (9 essais, 2 324 pts) · **12 mois : −0,1 % (−0,3 à +0,04), NON significatif** (2 essais, 493 pts) | « peu de données » | « **Aucune étude ne rapporte de données de morbidité** » ; pas d'effet sur satisfaction / bien-être / qualité de vie | **modere** |
| **Méta sur données individuelles** (Farmer, *BMJ* 2012;344:e486) | **22371867** · 10.1136/bmj.e486 | IPD-méta, **6 essais, 2 552 patients** | hétérogène | — | **6 mois −2,7 mmol/mol (IC95 −3,9 à −1,6) ≈ −0,25 %** ; 3 mois −2,0 (−3,2 à −0,8) ; 12 mois −2,5 (−4,1 à −0,9) ≈ −0,35 % | — | Aucun effet sur PA systolique (−0,2 mmHg), diastolique (−0,1), cholestérol total (−0,1 mmol/L). Conclusion des auteurs : « *not convincing for a clinically meaningful effect* » | **modere-eleve** (IPD) |
| **Allemann** (*Curr Med Res Opin* 2009;25(12):2903-13) | **19827909** | Méta, **15 ECR, 3 270 pts**, non insulinés | — | — | ASG vs pas d'ASG **−0,31 % (IC95 −0,44 à −0,17)** | ★ **ASG multiplie par 2,1 la probabilité de *détecter* une hypoglycémie (RR 2,10 ; 1,37-3,22)** — détection, pas prévention | — | **modere** |

**Message (a)** — chez le DT2 non insuliné, l'ASG produit une baisse d'HbA1c de **0,2 à 0,3 %**, qui
**s'efface à 12 mois** dans la Cochrane, **aucun bénéfice sur un critère dur** (jamais mesuré), et un
**signal d'effet indésirable psychologique** non répliqué (ESMON contre STeP). Le seul dispositif qui
fait mieux que le bruit est **structuré** (STeP : 7 points × 3 jours, **interprété avec le médecin, avec
un algorithme de décision**) — et son gain, **−0,3 % en ITT**, reste un substitut.
**NNT non calculable** : aucun essai de ce §3 ne rapporte d'événement clinique.

---

## 4. Grille (b) — DT2 **TRAITÉ par insuline** : la population du nœud, et le trou de preuve

> ⚠ **Constat central de la collecte.** La revue Cochrane de référence **exclut les insulinés de son
> protocole**. Aucune revue systématique n'a jamais évalué « ASG vs pas d'ASG » chez l'insuliné — et
> pour cause : le comparateur serait jugé non éthique. Le corpus (b) se réduit donc à **trois classes**
> d'objets, dont aucune ne répond exactement à la question posée.

### 4.1 — Le seul ECR qui randomise la **fréquence** de l'ASG chez l'insuliné

| Essai | PMID · DOI | Design · population | **Calendrier de mesure exact des bras** | Suivi | HbA1c | Hypo | Dur | GRADE |
|---|---|---|---|---|---|---|---|---|
| ★★ **Hortensius** (*BMC Res Notes* 2018;11(1):26) | **29334997** · 10.1186/s13104-018-3138-7 | ECR ouvert, multicentrique, **soins primaires** (38 MG néerlandais), **n=58**, DT2 sous **UNE injection d'insuline lente/jour**, **HbA1c ≤ 7,5 %**, contrôle **stable** | ★ **Profils 4 points (avant les 3 repas + coucher)**, à raison de : **1×/semaine (n=22)** vs **1×/2 semaines (n=16)** vs **1×/mois (n=20)** | 9 mois | **Aucune différence** : mensuel vs hebdo **−2,7 mmol/mol (IC95 −6,4 à +1,0)** ; mensuel vs bimensuel **−1,0 (−4,9 à +3,0)** | non rapporté | aucun | **tres_faible** — inclusion très inférieure à la cible prévue, **essai sous-puissant**, population sélectionnée (déjà à l'objectif, stable) |

**Lecture honnête** : c'est un essai **négatif faute de puissance**, pas un essai qui démontre
l'équivalence. Il autorise à dire *« chez un patient sous une injection, déjà à sa cible et stable,
aucun essai ne montre qu'un profil mensuel soit inférieur à un profil hebdomadaire »* — et **rien de
plus**. Il ne dit rien du patient **hors cible**, qui est celui des vignettes.

### 4.2 — Les essais qui randomisent le **nombre de mesures nécessaires pour titrer** (c'est la vraie
question de V-A8)

| Essai | PMID · DOI | Design · population | **Calendrier de mesure exact** | HbA1c | Hypo | Dose | GRADE |
|---|---|---|---|---|---|---|---|
| ★★ **BEGIN: Once Simple Use** (Philis-Tsimikas, *Adv Ther* 2013;30(6):607-22) | **23812875** · 10.1007/s12325-013-0036-1 | ECR ouvert *treat-to-target*, 26 sem, n=222, DT2 **naïfs** + metformine, dégludec 1×/j, titration **hebdomadaire** dans les 2 bras | ★ Bras **« Simple » : UNE seule glycémie pré-petit-déjeuner** (n=111) · bras **« Step-wise » : TROIS glycémies pré-petit-déjeuner consécutives** (n=111) | −1,09 % vs −0,93 % ; **différence −0,16 % (IC95 −0,39 à +0,07) → non-infériorité** | Hypo confirmée **1,60 vs 1,17 év./patient-année** ; **nocturne 0,21 vs 0,10 év./p-a** — « pas de différence significative » entre bras | ⚠ **0,61 vs 0,50 U/kg/j** : le bras à 1 mesure finit **plus dosé** | **modere** (ouvert, industrie Novo) |
| **Korean TITRATION** (Bae, *Diabetes Metab J* 2022;46(1):71-80) | **34130445** · 10.4093/dmj.2020.0274 | ECR ouvert 12 sem, n=129, DT2 non contrôlés, glargine U300 | INSIGHT : **ASG à jeun quotidienne**, +1 U/jour · EDITION : +3 U/semaine — cible ASG à jeun **4,4-5,6 mmol/L** | Critère principal (ASG à jeun ≤ 5,6 sans hypo nocturne) : **24,6 % vs 23,4 %, p=0,876** ; baisse d'HbA1c similaire, meilleure baisse du **profil 7 points** sous INSIGHT | pas de différence | dose totale **+5,8 ± 2,7 U/j** sous INSIGHT (p=0,033) | **modere** (petit, ouvert) |
| **AT.LANTUS** (Davies, *Diabetes Care* 2005;28(6):1282-8) | **15920040** · 10.2337/diacare.28.6.1282 | ECR ouvert, **n=4 961**, DT2 mal contrôlés (72 % déjà insulinés) | Algorithme 1 = **titration menée par l'investigateur** · algorithme 2 = **titration menée par le patient**. ⚠ Le calendrier exact d'ASG **n'est pas dans l'abstract** → `[À VÉRIFIER]` | HbA1c 8,9 → 7,8 % ; **−1,22 % (patient) vs −1,08 % (investigateur)**, p<0,001 | **hypo sévère 1,1 % vs 0,9 %** (NS) | 43,0 ± 25,5 U | **modere** (ouvert, industrie) |
| **Treat-to-Target** (Riddle, *Diabetes Care* 2003;26(11):3080-6) | **14578243** · 10.2337/diacare.26.11.3080 | ECR ouvert, n=756, 24 sem | Abstract : « *titrated using a simple algorithm seeking a target **fasting plasma glucose ≤ 100 mg/dL (5,5 mmol/L)*** ». ⚠ **Le calendrier d'ASG et le pas de titration ne figurent PAS dans l'abstract** ; texte intégral bloqué (403) → `[À VÉRIFIER]` | HbA1c finale 6,96 vs 6,97 % | 33,2 vs 26,7 % à ≤ 7 % **sans hypo nocturne** | — | **modere** |
| **INSIGHT canadien** (Gerstein, *Diabet Med* 2006;23(7):736-42) | **16842477** · 10.1111/j.1464-5491.2006.01881.x | ECR, n=405, 24 sem | ★ **auto-titration +1 U/jour si la glycémie à jeun > 5,5 mmol/L** → implique une **ASG à jeun quotidienne** | 7,0 vs 7,2 % (p=0,0007) | « aucune différence d'hypoglycémie » | +1,9 kg | **modere** |

★ **Ce que ce bloc établit, et qui est décisionnel pour V-A8** : **une seule glycémie à jeun par matin
suffit à titrer une basale sans excès d'hypoglycémie** (BEGIN Once Simple Use, non-infériorité). Le
prix payé n'est pas la sécurité, c'est **la dose** : **+0,11 U/kg/j** dans le bras à une mesure. C'est
exactement l'inverse de l'intuition « il faut d'abord un profil complet avant de décider ». La
**proposition** de la vignette V-A8 (« avant de décider, faites un profil à 3 points pendant 3 jours »)
n'est donc **pas** justifiée par la titration de la basale — elle l'est, si elle l'est, par la
**recherche d'un écart diurne** ou d'une **hypoglycémie masquée**, ce qui est une autre question.

### 4.3 — Les études de **profils structurés** chez l'insuliné : deux seulement, aucune contrôlée

| Étude | PMID · DOI | Design · population | **Calendrier exact** | Résultat | Limite |
|---|---|---|---|---|---|
| **COMPASS phase II** (Gao/Ji, *Diabetes Res Clin Pract* 2016;112:88-93) | **26774907** · 10.1016/j.diabres.2015.08.004 | **Bras unique, non randomisé**, n=820, Chine, DT2 sous insuline ≥ 3 mois, HbA1c > 8 % | « *structured SMBG regimen **spécifique à leur schéma insulinique*** », avec formation à l'auto-ajustement des doses. **Le contenu exact des schémas n'est pas dans l'abstract** → `[À VÉRIFIER]` | Qualité de vie SF-36 améliorée sur tous les axes ; 40,6 % se déclarent « un peu / beaucoup mieux » vs 16,5 % avant | **Aucun comparateur.** Ne peut pas fonder une recommandation d'efficacité | **tres_faible** |
| **Li** (*Diabetes Technol Ther* 2016;18(3):171-7) | **26950418** · 10.1089/dia.2015.0082 | ECR 3 bras, 36 sem, n=138 — ⚠ **NON insulinés** | **6 paires pré/post-prandiales /semaine** vs **3 paires /semaine** vs **profil 7 points sur 3 jours, 1 fois par mois** | Les 3 schémas baissent l'HbA1c ; seul le **7 points/3 jours/mois** fait mieux que le 3-paires (**−0,86 % à 24 sem, −0,80 % à 36 sem**) ; **aucune hypo sévère** | **Population non insulinée** — ne se transpose pas telle quelle | **modere↓** |

⚠ **Le « profil 6-7 points » que le nœud affiche dans son alerte « Sans MCG… » est un format
documenté — mais sa validation comme guide d'ajustement de l'insuline ne l'est pas.** Les deux ECR
qui le testent (STeP, Li) portent tous deux sur des **non-insulinés**. Chez l'insuliné, il n'existe
qu'une **série non contrôlée** (COMPASS).

### 4.4 — Ce que le comparateur ASG révèle dans les essais MCG (mesure indirecte, mais chiffrée)

| Essai | PMID · DOI | Population | ASG du bras contrôle | Résultat |
|---|---|---|---|---|
| **REPLACE** (Haak, *Diabetes Ther* 2017;8(1):55-73) | **28000140** · 10.1007/s13300-016-0223-6 | ECR ouvert, n=224, DT2 sous **insulinothérapie intensive** | ★ **3,8 ± 1,4 tests/jour** (mesuré, pas prescrit) | HbA1c : **aucune différence** (−0,29 % vs −0,31 %, p=0,82). Mais **temps < 0,70 g/L −43 %** et **temps < 0,55 g/L −53 %** sous capteur → **ce que 3,8 mesures/jour laissent passer** |
| **FreeDM2** (Wilmot, *Lancet Diab Endo* 2026;14(6):463-74) | **42035781** · 10.1016/S2213-8587(26)00076-8 | ECR ouvert, n=303, DT2 sous **basale + iSGLT2/GLP-1**, HbA1c 8,8 % | ASG (calendrier exact non précisé dans l'abstract) `[À VÉRIFIER]` | HbA1c **−0,6 % à 16 sem (IC95 −0,8 à −0,3)** et **−0,5 % à 32 sem (−0,7 à −0,2)** en faveur de la MCG ; **2 hypoglycémies sévères dans le bras ASG, 0 sous MCG**. Financement Abbott ; COI massifs déclarés |
| **Méta CGM vs ASG chez l'insuliné** (Zhu, *BMC Endocr Disord* 2026;26(1):113) | **41942969** · 10.1186/s12902-026-02167-4 | **13 ECR, n=1 550**, DT2 sous insuline | — | HbA1c **−2,78 mmol/mol (IC95 −4,68 à −0,88) ≈ −0,25 %** ; **TBR −1,30 % (−1,94 à −0,65)** ; TIR +4,04 % (NS) ; TAR −4,12 % (NS). Hétérogénéité I²=89,7 % | 

**Message (b)** — chez l'insuliné, **l'ASG n'est pas une intervention évaluée : c'est le comparateur.**
On ne sait pas ce qu'elle apporte (personne n'a randomisé son absence) ; on sait **ce qu'elle rate**,
parce que les essais MCG le mesurent contre elle.

---

## 5. Densité minimale d'ASG pour piloter une insuline : ce qui est chiffré, et sur quoi

### 5.1 — Ce qui est **démontré**

| Affirmation | Source | Force |
|---|---|---|
| **Une seule glycémie à jeun, un matin donné, suffit à titrer une basale** sans excès d'hypoglycémie — au prix d'une dose plus élevée (+0,11 U/kg/j) | BEGIN Once Simple Use, **PMID 23812875**, ECR, 1 vs 3 mesures pré-petit-déjeuner, non-infériorité | **modere** |
| **Chez le non-insuliné, augmenter la fréquence d'ASG n'améliore pas l'HbA1c** | Allemann, **PMID 19827909** : ASG fréquente vs peu intensive **WMD −0,21 % (IC95 −0,57 à +0,15), NS** | **modere** |
| Chez le non-insuliné, un seuil apparaît en méta-analyse **autour de 8 mesures/semaine** | Xu, *Int J Clin Pract* 2019, **PMID 31033116** (12 ECR, 3 350 pts) : **8-14/sem → −0,46 % à 6 mois (IC95 −0,54 à −0,39)** et **−0,20 % à 12 mois (−0,29 à −0,11)** ; **« jusqu'à 7 mesures/semaine : pas d'effet significatif »**. Répliqué par Zou, *J Gen Intern Med* 2023, **PMID 36403159** (22 études, 6 204 pts) : optimum **8-11/sem, −0,35 % (−0,51 à −0,20)** | **faible-modere** (méta-régression par sous-groupes, **population non insulinée**) |
| Chez un DT2 sous **une** injection, **déjà à l'objectif et stable**, un profil 4 points mensuel n'a pas fait moins bien qu'hebdomadaire | Hortensius, **PMID 29334997** | **tres_faible** (essai sous-puissant) |
| La relation « plus de mesures → HbA1c plus basse » est robuste **en DT1**, avec un **plafond vers 10/jour** | Miller, *Diabetes Care* 2013;36:2009-14, **PMID 23378621** (T1D Exchange, n=20 555, **observationnel**, association ajustée p<0,001) ; plafond rapporté par le référentiel SFD MCG 2017 | **tres_faible** pour la causalité, **DT1** |
| Association fréquence↔HbA1c en DT2 pharmacologiquement traité : **au moins 1 mesure/jour → −0,6 point d'HbA1c** vs moins souvent | Karter, *Am J Med* 2001;111(1):1-9, **PMID 11448654** (cohorte Kaiser, n=24 312, **observationnel**, p<0,0001) | **tres_faible** (confusion par indication non éliminable) |

### 5.2 — Ce qui est **pragmatique** (accord d'experts, énoncé comme tel par sa source)

| Densité | Source | Nature |
|---|---|---|
| **Insuline en cours : ≥ 4/jour si > 1 injection/jour ; 2 à 4/jour si une seule** | **HAS, fiche BUTS avril 2011**, colonne « Rythme d'ASG **suggéré** » | Avis CNEDiMTS — **accord d'experts** |
| **Insulinothérapie prévue à court/moyen terme : 2 à 4/jour** | idem | idem |
| **Sous basale du soir : la glycémie à jeun du matin suffit** ; **1×/semaine** une fois la dose stabilisée | **ebmfrance / Duodecim**, fiche insulinothérapie | Consensus EBM Guidelines (aucun grade attaché à *cet* énoncé) |
| **3 matins consécutifs** au-dessus de la cible avant de monter de 2 U | **ebmfrance**, fiche insulinothérapie (algorithme d'auto-ajustement) | Consensus — **et le seul énoncé du corpus qui donne une règle de descente** : GAJ < 4,0 mmol/L **1 fois sur 3 → ne rien changer** ; **plus souvent → −2 U** ; hypo symptomatique → **−4 U** |
| Moyenne des glycémies à jeun **sur 8 semaines** pour décider d'ajouter un GLP-1 | **ebmfrance**, fiche insulinothérapie | Consensus |
| **ASG ≥ 3/j** (flash) et **≥ 4/j** (MCG) comme **condition de remboursement** d'un capteur | SFD Paramédical 2022, §6.2 | **Critère administratif**, pas une donnée |

### 5.3 — Réponse directe à la question 1

> **Il n'existe aucune densité minimale d'ASG démontrée en dessous de laquelle piloter une insuline
> serait dangereux.** La question n'a jamais été posée par un essai : le seul ECR qui approche
> (Hortensius) est sous-puissant et porte sur des patients déjà à l'objectif, et le seul qui tranche
> vraiment quelque chose (BEGIN Once Simple Use) montre l'inverse de l'intuition — **une mesure suffit
> pour titrer**, et c'est la **dose finale**, non la sécurité, qui en pâtit.
>
> Les chiffres de densité qui circulent sont de **deux natures distinctes qu'il ne faut jamais
> confondre** : (i) les **seuils de méta-analyse (8-14/semaine)**, qui sont réels mais valent pour les
> **non-insulinés**, population où le bénéfice global est de toute façon marginal ; (ii) les
> **rythmes prescrits (2-4/jour, ≥ 4/jour)**, qui sont **des accords d'experts français de 2011**
> annoncés comme tels par la HAS elle-même (« rythme **suggéré** »).
>
> **Conséquence pour le nœud** : une densité peut être **affichée** (comme reco officielle FR, sourcée
> HAS 2011), elle ne peut pas **gater** une option — ce serait encoder de l'accord d'experts en règle
> de décision, ce que `00-global.md` §« Granularité si appuyée sur EBM » interdit.

---

## 6. Ce que l'ASG de routine manque en hypoglycémie nocturne

> C'est le chiffre décisif : il fixe ce que le nœud a le **droit** d'affirmer quand `mcg_disponible ==
> false`. Toutes les études ci-dessous sont **observationnelles** (comparaison intra-patient
> CGM-vs-ASG) ou des **bras contrôles d'ECR** — il n'existe aucun essai randomisé sur ce point, et il
> ne peut pas en exister.

| Étude | PMID · DOI | Population · design | ASG de référence | **Ce que l'ASG manque** |
|---|---|---|---|---|
| ★★ **Munshi** (*Arch Intern Med* 2011;171(4):362-4) | **21357814** · 10.1001/archinternmed.2010.539 | n=40, **≥ 69 ans**, HbA1c ≥ 8 % (moyenne 9,3 %), **70 % DT2, 93 % sous insuline**, CGM en aveugle 3 jours | ★ **glycémies capillaires 4 fois par jour** | ★★ **26/40 (65 %) ont ≥ 1 hypoglycémie < 0,70 g/L** ; **18/26 (69 %) ont ≥ 1 épisode nocturne (22 h-6 h)** ; ★ **sur 102 épisodes, 95 (93 %) sont passés inaperçus** des glycémies capillaires 4×/j **et** des symptômes. Durée moyenne 46 min |
| **Zick / SAFIR** (*Diabetes Technol Ther* 2007;9(6):483-92) | **18034602** · 10.1089/dia.2007.0230 | n=367 **DT2 sous multi-injections**, HbA1c 6,9 %, CGM 72 h vs profils ASG sur les mêmes 72 h | profils ASG sur 72 h | **209 (56,9 %) ont une hypoglycémie ≤ 0,60 g/L au CGM ; 97 (26,4 %) seulement l'ont documentée par les moyens conventionnels** → l'ASG en identifie **46 %**. Les glycémies **nocturnes** mesurées au CGM sont **significativement plus basses** que celles de l'ASG (1,23 vs 1,37 g/L à la fin de l'étude) |
| **Chico** (*Diabetes Care* 2003;26(4):1153-7) | **12663589** · 10.2337/diacare.26.4.1153 | n=70 (40 DT1, 30 DT2), CGM | ASG usuelle | **46,6 % des DT2** ont une hypoglycémie **non reconnue** ; ★ **73,7 % de tous les épisodes surviennent la nuit** |
| **Gehlaut** (*J Diabetes Sci Technol* 2015;9(5):999-1005) | **25917335** · 10.1177/1932296815581052 | n=108 DT2, CGM 5 jours | usuelle | **49,1 % ont ≥ 1 hypoglycémie** (1,74 épisode/patient/5 j) ; **75 % de ces patients ont ≥ 1 épisode asymptomatique** ; hypoglycémie plus fréquente sous insuline (p=0,02). ⚠ « **pas de différence significative** entre hypoglycémies diurnes et nocturnes » — **nuance Chico** ; COI dispositifs déclarés |
| **REPLACE** (bras ASG) | **28000140** | n=224 DT2 sous insuline intensive | **3,8 tests/jour, mesurés** | Le capteur retire **43 % du temps < 0,70 g/L** et **53 % du temps < 0,55 g/L** — c'est-à-dire **l'exposition que 3,8 mesures/jour laissaient en place** |
| **Méta CGM vs ASG chez l'insuliné** (Zhu 2026) | **41942969** | 13 ECR, n=1 550 | — | **TBR −1,30 % (IC95 −1,94 à −0,65)** sous capteur, soit ≈ **19 minutes/jour** d'hypoglycémie en moins qui n'étaient pas vues sous ASG |
| **FreeDM2** (bras ASG) | **42035781** | n=105 sous ASG | — | **2 hypoglycémies sévères** dans le bras ASG contre **0** sous MCG (effectifs trop faibles pour conclure) |

### Réponse directe à la question 2

> **L'ordre de grandeur défendable est : l'ASG de routine manque la moitié à la quasi-totalité des
> hypoglycémies, et la nuit est le moment où elle en manque le plus.**
>
> Deux chiffres, deux niveaux de robustesse :
> - **Chez le sujet âgé insulino-traité surveillé 4×/jour : 93 % des épisodes passent inaperçus**
>   (Munshi, n=40 — **petit, monocentrique, mixte DT1/DT2**, mais c'est la population exacte de la
>   vignette V-A5) ;
> - **Chez le DT2 sous multi-injections : l'ASG identifie 46 % des patients que le capteur identifie**
>   (Zick, n=367 — le plus grand effectif disponible, DT2 pur).
>
> **Ce que le nœud a le droit d'affirmer sans capteur** : que **l'absence d'hypoglycémie constatée à
> l'ASG n'est pas une preuve d'absence d'hypoglycémie**, en particulier nocturne. **Ce qu'il n'a pas
> le droit d'affirmer** : un pourcentage unique présenté comme établi (les chiffres vont de 46 % à
> 93 % selon la population, le seuil et la densité d'ASG), ni que la nuit domine toujours (Gehlaut ne
> retrouve pas la prédominance nocturne de Chico).
>
> **GRADE : faible** (observationnel, effectifs petits, seuils hétérogènes) — **mais concordant en
> direction dans 6 sources sur 6**.

---

## 7. Cadre français : indication et remboursement de l'ASG chez le DT2 insulino-traité

> **C'est la part que OpenEvidence ne peut pas produire** (`00-global.md` : OE hallucine sur HAS/SFD/
> CMG/Prescrire). Tout ce qui suit est cité **verbatim** de sa source, avec le PDF ou l'URL.

### 7.1 — HAS : la doctrine ASG date de 2011 et n'a pas été révisée depuis

**HAS 2024** (`sources/strategie_therapeutique…pdf`, p.5) — **exclut l'ASG de son périmètre** :

> « *Cette mise à jour ne concerne pas les recommandations portant sur : ‒ la redéfinition des
> objectifs glycémiques ou **la place de l'autosurveillance glycémique qui restent maintenues selon les
> recommandations de bonne pratique en cours*** »

Le nœud E s'appuie donc, pour tout ce qui touche l'ASG, sur un texte **antérieur** à la RBP 2024 :

**HAS, *L'autosurveillance glycémique dans le diabète de type 2 : une utilisation très ciblée*, fiche
Bon Usage des Technologies de Santé, avril 2011** (page HAS `r_1438006`, « mis à jour le 11 janv. 2013 »,
**sans mention de retrait ni de remplacement**) — extraits **verbatim** :

- **Indications** : « *L'ASG doit être réservée à certains diabétiques de type 2, dans certaines
  situations : **Patients insulinotraités** · Patients chez qui une insulinothérapie est envisagée à
  court ou moyen terme · Patients traités par insulinosécréteurs (sulfamides ou glinides) **lorsque des
  hypoglycémies sont soupçonnées** · Patients chez qui l'objectif thérapeutique n'est pas atteint,
  notamment en raison d'une maladie ou d'un traitement intercurrent.* »
- **Principe** : « *L'ASG ne doit être ni systématique ni passive. Les mesures doivent être
  susceptibles d'entraîner des conséquences thérapeutiques.* »
- ★ **Rythme suggéré** (tableau) :

  | Indication | Rythme d'ASG **suggéré** |
  |---|---|
  | **Insulinothérapie en cours** | **Au moins 4 par jour si l'insulinothérapie comprend plus d'une injection d'insuline par jour** · **2 à 4 par jour si elle n'en comprend qu'une** |
  | Insulinothérapie prévue à court ou moyen terme | 2 à 4 par jour |
  | Traitement n'atteignant pas l'objectif glycémique | De 2 par semaine à 2 par jour au maximum (outil d'éducation) |
  | Traitement par insulinosécréteurs | De 2 par semaine à 2 par jour au maximum ; « *ASG à réaliser **au moins deux jours par semaine, à des moments différents de la journée**, pour affirmer une hypoglycémie et adapter si besoin la posologie* » |

- ★★ **Objectifs glycémiques capillaires**, énoncés dans la même case que le rythme :
  > « ***avant les repas, 70 à 120 mg/dL ; en post-prandial (2 heures après le repas) : < 180 mg/dL.*** »

  ⚠ **C'est l'ancrage manquant des deux seuils du nœud.** `gaj_a_cible` (0,70-1,20 g/L) **est**
  l'objectif pré-prandial de HAS 2011 — et non la cible de Treat-to-Target, qui visait une **glycémie à
  jeun ≤ 1,00 g/L** (PMID 14578243, abstract). Le « **< 1,80 g/L à 2 h** » de l'option 3b **est**
  l'objectif post-prandial de HAS 2011, **corroboré par une seconde source française du corpus local** :
  SFD Paramédical 2022 (`pdp_pompe_insuline_externe_mcg.pdf`) — « *Chez l'adulte, quel que soit le type
  de diabète, les objectifs concernant les glycémies postprandiales mesurées en capillaire sont
  **< 1,80 g/L, une à deux heures après le début du repas*** ».
  **Statut de ces deux seuils : accord d'experts français, pas EBM.** Ni l'un ni l'autre n'est issu
  d'un essai qui aurait randomisé une stratégie ciblant ce seuil.

- **Prescription** : « *Le prescripteur d'un système d'ASG doit préciser […] **le nombre
  d'autosurveillances à réaliser par jour ou par semaine, et non le nombre de boîtes à délivrer***. »
  → **obligation réglementaire de prescrire une fréquence** ; elle intéresse directement l'exigence
  E9 des vignettes (« instaurer / densifier l'autosurveillance »).

**HAS 2024, mentions opérantes** (toutes **grade AE = accord d'experts**) : **R.52** (ASG « discutée »,
lecteur « encouragé » à l'introduction d'un hypoglycémiant) · **R.81** (l'insulinothérapie est
« accompagnée et **idéalement précédée** » d'une ASG) · **R.82** (l'insulinothérapie « nécessite […] la
réalisation d'une ASG, l'adaptation des doses d'insuline afin d'atteindre les objectifs glycémiques »).
**Aucune fréquence, aucun seuil.**

### 7.2 — SFD 2025 : Partie 11, Avis n° 23 (source FR la plus récente)

Verbatim de `SFD 2025.pdf`, Partie 11 :

- « *L'ASG **n'est recommandée que si les résultats sont susceptibles d'entraîner une modification** des
  mesures hygiéno-diététiques et/ou du traitement médicamenteux. La réalisation systématique de l'ASG,
  chez les patients sous agents anti-hyperglycémiants ne provoquant pas d'hypoglycémie, **n'est donc pas
  recommandée de principe**.* »
- « *L'ASG est **utile** : pour évaluer l'effet de modifications thérapeutiques du mode de vie […] ; en
  cas de risque de déséquilibre aigu (infections, corticothérapie, interruption de traitement…) ; **pour
  les patients avec un taux d'HbA1c ≥ 8 % dans le cadre d'un ajustement thérapeutique dont le passage à
  l'insuline** ; pour les patients dont l'HbA1c n'est pas interprétable (anémie, hémoglobinopathies,
  hémolyse chronique, IRC sévère ou terminale, cirrhose…).* »
- « *L'ASG est **très souhaitable** chez les patients […] traités par SU ou glinides afin de prévenir et
  de détecter d'éventuelles hypoglycémies.* »
- ★ « *L'ASG est **indispensable** chez les patients vivant avec un DT2 : **‒ traités par insuline, afin
  d'adapter les doses d'insuline et de prévenir les hypoglycémies** ; ‒ pour les patientes enceintes…* »
- « *Lors de la prescription d'un dispositif d'ASG, il est indispensable d'expliquer au patient les
  modalités et enjeux de cette autosurveillance : **définir les moments, la fréquence, les objectifs
  glycémiques et les décisions à prendre en fonction des résultats**. Les résultats recueillis serviront
  de support de discussion entre le patient et l'équipe soignante.* »

⚠ **La SFD 2025 ne donne AUCUNE fréquence chiffrée d'ASG** — elle prescrit de *définir* une fréquence,
sans dire laquelle. Le seul chiffre du corpus reste donc celui de HAS 2011.

**Cible capillaire chiffrée par SFD 2025**, uniquement pour deux populations bornées : **personne âgée
« dépendante / à la santé très altérée »** → « *des **glycémies capillaires préprandiales comprises entre
1 et 2 g/L** et/ou une HbA1c < 9 % sont recommandées, **en restant au-dessus de 7,5 % en cas de
traitement par insuline*** » (Avis n° 21) ; **grossesse** → < 0,95 g/L à jeun et < 1,20 g/L à 2 h
(Avis n° 22). **Rien pour le DT2 insuliné adulte tout-venant.**

### 7.3 — Remboursement (France, état 2026)

| Objet | Règle | Source |
|---|---|---|
| **Bandelettes — DT2 NON insuliné** | **200 par an**, plafond | Arrêté ministériel du **25 février 2011**, cité *verbatim* par la fiche HAS 2011 : « *la prise en charge des bandelettes d'ASG par l'Assurance maladie est **limitée à 200 par an**, à l'exception des patients pour lesquels une insulinothérapie est en cours ou prévue à court ou moyen terme* » — **confirmé, toujours en vigueur en 2025**, par SFD 2025 : « *En France, les bandelettes réactives […] sont remboursées à hauteur de **200 par an** pour les patients vivant avec un DT2 **non traités par insuline***. » |
| **Bandelettes — DT2 insuliné (ou insuline prévue à court/moyen terme)** | ★ **Aucun plafond** — exclus explicitement du contingentement | idem (les deux sources concordent) |
| **Lecteur de glycémie** | Remboursable **tous les 4 ans** ; garanti au minimum 4 ans (la garantie dispense d'une nouvelle prescription) | HAS 2011 fiche BUTS |
| **Autopiqueur** | Remboursable **tous les ans** | HAS 2011 fiche BUTS |
| **MCG — DT2 insulinothérapie intensifiée** (≥ 3 injections/j ou pompe) | Remboursée, **quel que soit le niveau d'HbA1c** | SFD 2025, Avis n° 23 |
| **MCG — DT2 insulinothérapie non intensifiée** (< 3 injections/j) | Remboursée **si l'équilibre glycémique est insuffisant** | SFD 2025, Avis n° 23 |
| **Primoprescription de la MCG** | ★ **Par le médecin généraliste** chez les patients traités par **une ou deux injections** d'insuline ; relève du spécialiste si schéma intensifié | SFD 2025, Avis n° 23 |
| **Cétonémie sous iSGLT2** | Remboursement d'un système d'autosurveillance de la cétonémie + **10 électrodes/an** | SFD 2025, Avis n° 23 bis |

⚠ **Point de portée pour le nœud, non trivial** : en France, **un DT2 sous une seule injection de
basale mal équilibré est éligible au remboursement d'un capteur, et son généraliste peut le
primoprescrire**. La branche « sans capteur » du nœud décrit donc une situation qui est très souvent
**réversible en consultation** — ce qui n'est aujourd'hui dit nulle part dans le nœud.

### 7.4 — Prescrire, CMG, ebmfrance

- **Prescrire** : **aucune position sur l'ASG dans le corpus local** (`prescrire-dt2.md`, P1→P13, lecture
  intégrale : zéro occurrence). **Ce n'est pas une absence de position de Prescrire, c'est une absence
  dans ce que nous détenons** → demande §10.
- **CMG** : **aucune position dédiée trouvée**, cohérent avec `E-insuline.md` §5b correction n° 4. **Ne
  rien citer au nom du CMG.**
- **ebmfrance** (position EBM de référence du projet) : « *les patients sous insulinothérapie sont **les
  principaux patients concernés** par l'autosurveillance* » ; sous basale, « ***il suffit de déterminer
  la glycémie à jeun*** » ; désescalade explicite (« *une fois la dose stabilisée […] par exemple **une
  fois par semaine*** ») et clause d'arrêt (« *Si le taux d'HbA1c est resté dans les limites de
  l'objectif […] il ne sera pas nécessaire de procéder à une autosurveillance régulière entre les
  visites* »). **ebmfrance est, de tout le corpus FR, la seule source qui autorise explicitement à
  *diminuer* la surveillance.**

### 7.5 — Ce que dit l'ADA (reco internationale indexée, pour situer)

**ADA, *7. Diabetes Technology: Standards of Care in Diabetes—2026*, *Diabetes Care* 2025 Dec 8;
49(Suppl 1):S150-S165, DOI 10.2337/dc26-S007** :

- **7.11 (grade B)** : « *People who are taking insulin and using BGM should be encouraged to check
  their blood glucose levels **when appropriate based on their insulin therapy*** » — la liste des
  moments (à jeun, avant repas/collations, après repas, au coucher, au milieu de la nuit, autour de
  l'exercice, si hypoglycémie suspectée, après resucrage) est fournie, **pas une fréquence**.
- ★ « *The evidence is **insufficient** regarding when to prescribe BGM and **how often monitoring is
  needed** for insulin-treated people with diabetes who do not use intensive insulin therapy* » — c'est
  **exactement notre patient**, et l'ADA dit qu'on ne sait pas.
- « *for those taking basal insulin, assessing fasting glucose with BGM to inform dose adjustments to
  achieve blood glucose goals results in lower A1C levels* » — converge avec ebmfrance.
- **7.13 (grade E)** : « *Although BGM in people on noninsulin therapies has not consistently shown
  clinically significant reductions in A1C levels…* » — converge avec le §3.

---

## 8. Réponse

### 8.1 — **Démontré** (ECR / méta-analyses, tous sur **substituts**)

1. **Chez le DT2 non insuliné, l'ASG apporte 0,2-0,3 % d'HbA1c à 6 mois, et cet effet n'est plus
   significatif à 12 mois** (Cochrane Malanda : −0,1 %, IC95 −0,3 à +0,04 ; IPD Farmer : « *not
   convincing for a clinically meaningful effect* »). **Aucun essai n'a mesuré un critère dur.**
   → *Le nœud ne doit jamais présenter l'ASG comme un bénéfice, seulement comme un instrument.*
2. **Une seule glycémie à jeun suffit à titrer une basale** aussi bien que trois matins consécutifs,
   avec la même hypoglycémie — mais **+0,11 U/kg/j de dose finale** (BEGIN Once Simple Use, PMID
   23812875, non-infériorité). **GRADE modere.**
3. **La titration auto-administrée par le patient sur glycémie à jeun est au moins aussi efficace, et
   pas plus dangereuse, que la titration menée par le médecin** (AT.LANTUS, n=4 961 : −1,22 % vs
   −1,08 %, hypo sévère 1,1 % vs 0,9 % NS). **GRADE modere.**
4. **Augmenter la fréquence d'ASG n'améliore pas l'HbA1c** — dans la seule population où on l'a testé
   (non insulinés) : WMD **−0,21 % (IC95 −0,57 à +0,15), NS** (Allemann, PMID 19827909).
5. **Le capteur fait mieux que l'ASG chez l'insuliné, sur des substituts** : HbA1c ≈ −0,25 à −0,6 % et
   **TBR −1,30 %** (méta Zhu 2026, PMID 41942969 ; FreeDM2, PMID 42035781). **Aucun critère dur.**
6. **Un format structuré fait mieux qu'un format libre — chez le non insuliné** : STeP, 7 points ×
   3 jours × trimestriel, **−0,3 % en ITT** (PMID 21270183).

### 8.2 — **Accord d'experts** (à afficher comme reco officielle, jamais à encoder en gate)

1. **Les rythmes d'ASG français** : ≥ 4/j si > 1 injection, **2 à 4/j sous une seule injection** —
   HAS 2011, colonne intitulée « rythme **suggéré** ». *Accord d'experts CNEDiMTS, non révisé depuis
   2011, non révisé par la RBP 2024 qui l'exclut de son périmètre.*
2. **Les deux seuils capillaires du nœud** : **0,70-1,20 g/L avant les repas** et **< 1,80 g/L à 2 h**
   — HAS 2011, confirmés par SFD Paramédical 2022 pour le post-prandial. *Accord d'experts. Ce sont de
   vraies sources françaises ; ce ne sont pas des données d'essai.*
3. **« L'ASG est indispensable chez le DT2 traité par insuline »** — SFD 2025, Avis n° 23. *Énoncé
   normatif, non chiffré, appuyé sur aucun essai (et pour cause : personne n'a randomisé son absence).*
4. **« Sous basale du soir, la glycémie à jeun du matin suffit »**, avec désescalade à 1×/semaine une
   fois la dose stable — ebmfrance. *Consensus EBM Guidelines.*
5. **L'algorithme de descente** (< 4,0 mmol/L une fois sur trois → ne rien changer ; plus souvent →
   −2 U ; hypo symptomatique → −4 U) — ebmfrance. *C'est le seul énoncé de descente du corpus, et il
   répond directement au `COLLECTE` de la vignette V-A1 (« faut-il une GAJ basse ou plusieurs, et de
   combien réduire ? »).*

### 8.3 — **Inexistant** (aucune donnée — le nœud ne doit rien affirmer ici)

1. **Aucun ECR ne compare « ASG » à « pas d'ASG » chez le DT2 insulino-traité.** La Cochrane de
   référence **exclut** cette population par protocole. Il n'y a donc **aucune mesure du bénéfice** de
   l'ASG dans la population du nœud.
2. **Aucune densité minimale de sécurité n'est établie.** Le seul ECR de fréquence chez l'insuliné
   (Hortensius, PMID 29334997) est **sous-puissant** et porte sur des patients **déjà à l'objectif** ;
   il n'autorise aucune extrapolation au patient hors cible.
3. **Le profil 6-7 points n'a jamais été validé comme guide d'ajustement de l'insuline.** Les deux ECR
   qui le testent (STeP, Li 2016) portent sur des **non-insulinés** ; chez l'insuliné il n'existe
   qu'une **série non contrôlée** (COMPASS, n=820, sans comparateur).
4. **Aucun essai n'a randomisé une stratégie visant un objectif post-prandial capillaire** chez le DT2
   sous basale. Le seuil « < 1,80 g/L à 2 h » est un objectif d'experts, pas un bras d'essai.
5. **Aucun critère dur, nulle part**, pour aucune stratégie d'ASG, dans aucune des deux populations.
   **Aucun NNT n'est calculable dans ce dossier** — c'est un fait, pas une omission.
6. **Aucune position Prescrire ni CMG sur l'ASG** dans nos sources.

### 8.4 — Ce que la collecte permet de dire aux vignettes V-A7 et V-A8

> **V-A7 (le patient qui ne mesure rien).** Le comportement actuel — quatre options en attente, motif
> nommé `GAJ` — reste **correct** et la collecte le renforce : sans une seule glycémie, **aucune** des
> règles de titration publiées (ebmfrance, Treat-to-Target, INSIGHT, BEGIN) n'est applicable. Le geste
> manquant relevé par la vignette (« instaurer l'autosurveillance ») est **explicitement porté par
> deux sources françaises** : HAS 2011 (« *le prescripteur doit préciser le nombre d'autosurveillances
> à réaliser par jour ou par semaine* ») et SFD 2025 (« *définir les moments, la fréquence, les
> objectifs glycémiques et les décisions à prendre* »). **La preuve ne s'oppose pas à E9 ; elle le
> soutient.** Le contenu à afficher, lui, est un accord d'experts — donc du texte, pas un gate.
>
> **V-A8 (une seule glycémie, le matin).** La `PROPOSITION` de la vignette — « avant de décider, faites
> un profil à 3 points pendant 3 jours » — **n'est pas soutenue par la preuve si le but est de titrer
> la basale** : BEGIN Once Simple Use montre qu'**une** glycémie à jeun suffit. Elle **est** soutenue
> si le but est différent, et il l'est ici : cette patiente est **sur-basalisée (0,53 U/kg)** avec une
> **GAJ hors cible** — la question n'est pas « faut-il monter ? » mais « **l'écart est-il diurne ?** »,
> et **cela**, une glycémie du matin ne peut pas y répondre. **La justification du profil à 3 points
> n'est donc pas la densité de titration : c'est la localisation de l'écart.** C'est une correction de
> motif, pas un rejet de la proposition.

---

## 9. `[À VÉRIFIER]` — à lever au red-team (agent B) ou par le référent

| # | Élément | Pourquoi il reste ouvert | Bloquant ? |
|---|---|---|---|
| V1 | **Treat-to-Target (Riddle 2003)** : calendrier d'ASG et pas de titration exacts | L'abstract ne donne que « *simple algorithm seeking a target FPG ≤ 100 mg/dL* ». Texte intégral **403** sur diabetesjournals.org. **Le « +2 U si la GAJ reste au-dessus 3 matins de suite » que le nœud attribue à Riddle 2003 vient en réalité de l'algorithme ebmfrance/Duodecim** — la ressemblance est peut-être fortuite. À trancher sur texte intégral | ⚠ **oui** : c'est la source citée par l'option « Titrer la basale » |
| V2 | **AT.LANTUS** : contenu exact des algorithmes 1 et 2 (nombre de glycémies à jeun, périodicité) | Absent de l'abstract | non |
| V3 | **ebmfrance / Duodecim** : direction et ampleur de l'*evidence summary* **niveau B** « *SMBG in patients with T2DM who are not using insulin* » | Seul le **titre** et la lettre B figurent dans le PDF local ; la conclusion n'est pas reproduite. Un niveau B **peut** documenter un effet nul | non, mais utile |
| V4 | **HAS 2011 fiche BUTS — statut en 2026** | Page HAS accessible, « mis à jour le 11 janv. 2013 », **aucun marqueur de retrait**. HAS 2024 renvoie explicitement aux « RBP en cours » sans les nommer. Confirmer qu'aucun texte HAS postérieur ne la remplace | ⚠ **oui** : c'est la source de tous les chiffres FR de densité et de seuils |
| V5 | **HAS 2007, « Indications et prescription d'une ASG chez un patient diabétique »** | Citée en réf. [5] du référentiel SFD MCG 2017 ; l'URL historique redirige vers une page HTML, PDF non récupéré | non |
| V6 | **Arrêté du 25 février 2011 — texte réglementaire** | Non lu au JO/Légifrance. Le contenu est **doublement corroboré** (HAS 2011 verbatim + SFD 2025 en 2025), mais le texte lui-même n'a pas été ouvert ; les pages ameli renvoient **403** | non |
| V7 | **COMPASS phase II** : contenu exact des « schémas d'ASG structurés spécifiques au schéma insulinique » | Absent de l'abstract ; c'est pourtant la seule étude de profils structurés chez l'insuliné | non |
| V8 | **FreeDM2** : calendrier d'ASG du bras contrôle | Absent de l'abstract | non |
| V9 | **Guerci, *Rev Santé Publique* 2017;29:229-240** (29,4 % des basal-bolus conformes) | Chiffre lu **dans** le référentiel SFD MCG 2017, **pas dans la source primaire** | non |
| V10 | **Chico 2003 vs Gehlaut 2015 — prédominance nocturne** | Chico : « 73,7 % de tous les épisodes surviennent la nuit ». Gehlaut : « **pas de différence significative** entre hypoglycémies diurnes et nocturnes ». **Discordance réelle**, non résolue. Ne pas trancher | ⚠ à signaler dans le contenu |
| V11 | **Munshi 2011** : population **mixte DT1/DT2** (70 % DT2), n=40, monocentrique | Le chiffre de **93 % d'épisodes manqués** est le plus frappant du dossier ; sa validité externe est étroite | ⚠ à encadrer si utilisé |
| V12 | **ADA SoC 2026 ch. 7** : les recommandations 7.10-7.14 ont été lues via PMC12690173 | Grades A/B/E rapportés ; **la numérotation et les grades restent à confirmer sur le texte imprimé** | non |

---

## 10. Demandes au référent

1. ★ **Prescrire et l'ASG — texte manquant.** `prescrire-dt2.md` (P1→P13) ne contient **aucune**
   occurrence d'« autosurveillance » / « ASG » / « bandelette ». Or l'ASG est exactement le genre de
   sujet où Prescrire a une position (rapport bénéfice/contrainte, sur-prescription de dispositifs).
   **Peux-tu vérifier s'il existe un article Prescrire dédié à l'autosurveillance glycémique dans le
   DT2, et le fournir ?** Sans lui, le nœud n'aura **aucune position critique indépendante** sur son
   propre instrument de mesure — et c'est un déséquilibre notable, puisque les deux sources qui portent
   les chiffres (HAS 2011, SFD 2025) sont institutionnelles et que la SFD porte des COI dispositifs
   massifs (déjà notés dans `E-insuline.md` §5).
   *(Rappel : `prescrire 12.pdf` est toujours signalé vide dans le suivi projet — même demande.)*
2. **Arbitrage de portée — le seuil post-prandial.** Le « < 1,80 g/L à 2 h » **a** une source française
   (HAS 2011 + SFD Paramédical 2022), mais c'est un **accord d'experts**, et les `references` de
   l'option 3b (`fullstep`/`bertuol`/`quatre-t`) ne le portent pas. **Veux-tu (a) rattacher le seuil à
   ses vraies sources et l'afficher comme reco officielle FR, ou (b) attendre le retour OE-A1 ?**
   Mon avis : (a) — la source existe, elle est locale, il n'y a rien à chercher ; OE-A1 servira à
   savoir si un essai a jamais ciblé ce seuil (je n'en ai trouvé aucun).
3. **Arbitrage clinique que je ne tranche pas** — **quelle densité d'ASG le nœud doit-il proposer au
   patient de V-A7 ?** Les deux candidates sont **incompatibles entre elles** : HAS 2011 dit **2 à
   4/jour** sous une injection ; ebmfrance dit **la glycémie à jeun du matin suffit**, et **1×/semaine**
   une fois la dose stable. Aucune donnée ne départage. C'est un arbitrage « reco officielle FR vs
   position EBM », exactement le schéma de `BRIEF_DECISION.md` §2 — **il te revient**.
4. **Point de périmètre non encore posé** : en France, **un DT2 sous 1-2 injections mal équilibré est
   éligible au remboursement d'un capteur, et le MG peut le primoprescrire** (SFD 2025, Avis n° 23).
   Faut-il que le nœud le **dise** quand `mcg_disponible == false` (« ce patient a droit à un capteur
   et tu peux le prescrire ») ? Ce n'est pas une question de preuve, c'est une question de portée de
   l'outil — mais c'est peut-être le geste le plus utile de toute la branche « sans capteur ».
5. **Question de sécurité, à valider explicitement** : la collecte autorise-t-elle le nœud à afficher,
   sans capteur, une phrase du type *« une ASG normale ne prouve pas l'absence d'hypoglycémie nocturne ;
   chez le sujet âgé insuliné, la majorité des épisodes ne sont vus ni par les glycémies ni par les
   symptômes »* ? Les données (§6) la soutiennent en **direction** de façon très concordante, mais
   **aucune n'est un ECR** et les proportions vont de **46 % à 93 %**. Je propose de l'afficher **sans
   chiffre**, en alerte `info`. **À valider.**

---

### Bibliographie (PMID/DOI vérifiés par `efetch` PubMed le 2026-07-29)

**Non insulinés** — ESMON 18420662 (10.1136/bmj.39534.571644.BE) · DiGEM 17591623
(10.1136/bmj.39247.447431.BE) · STeP 21270183 (10.2337/dc10-1732) · STeP-psycho 21916532 · MONITOR
28600913 (10.1001/jamainternmed.2017.1233) · Cochrane Malanda 22258959 (CD005060.pub3) · IPD Farmer
22371867 (10.1136/bmj.e486) · Allemann 19827909 · Xu 31033116 · Zou 36403159 · Li 26950418.
**Insulinés** — Hortensius 29334997 · BEGIN Once Simple Use 23812875 · Korean TITRATION 34130445 ·
AT.LANTUS 15920040 · Treat-to-Target 14578243 · INSIGHT 16842477 · COMPASS 26774907 · REPLACE 28000140 ·
FreeDM2 42035781 · méta Zhu 41942969.
**Hypoglycémie manquée** — Munshi 21357814 · Zick/SAFIR 18034602 · Chico 12663589 · Gehlaut 25917335.
**Observationnel fréquence** — Karter 11448654 · Miller (T1D Exchange) 23378621.
**Recos** — ADA SoC 2026 ch. 7, *Diabetes Care* 49(Suppl 1):S150-S165, 10.2337/dc26-S007.
**FR (non indexé)** — HAS, fiche BUTS « L'autosurveillance glycémique dans le DT2 : une utilisation très
ciblée », avril 2011 · HAS 2024 RBP (`sources/`) · SFD 2025 Avis 21/22/23 (`sources/SFD 2025.pdf`,
*Méd. Mal. Métab.* 2025;19(8):630-662) · SFD Paramédical 2022 (`sources/pdp_pompe_insuline_externe_mcg.pdf`) ·
SFD MCG hors-série 2017 (`sources/mmm_referentielmcg_ep11.pdf`) · ebmfrance ebm00491 & ebm00488 (`sources/`) ·
arrêté ministériel du 25 février 2011 (cité par HAS 2011 et SFD 2025).

**PMID à bannir (vérifiés hors-sujet, ne pas réintroduire)** : **21266647** (annoncé « STeP » — c'est une
analyse JDRF en DT1) · **28600890** (annoncé « MONITOR » — c'est une étude d'échographie obstétricale) ·
**23520370** (annoncé « Miller T1D Exchange » — c'est Taylor, *Type 2 diabetes: etiology and reversibility*).
