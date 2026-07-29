# Preuve A1 — glycémie capillaire post-prandiale : seuil d'introduction et d'ajustement du bolus

> **Statut : collecte agent A, NON red-teamée, NON validée référent.** Rien de ce document n'entre dans
> `content/**` avant sa passe adversariale (agent B) — discipline `CONSTRUIRE-UN-MODULE.md` §P4.
>
> **Auteur** : agent A (extraction/chiffrage), 2026-07-29. **Périmètre** : exigence **E3** des
> [vignettes de la passe A](vignettes-insuline-sans-capteur.md) (V-A4, V-A8), seule exigence de la passe
> qualifiée de bloquante au sens EBM.
>
> **Aucun fichier de `content/`, `src/`, `schema/` n'a été modifié. `noeuds/E-insuline.md` n'a pas été
> touché.** Toute lecture de `insuline.yaml` a été faite en lecture seule, pour citer exactement.
>
> **Conventions d'unités** utilisées partout ci-dessous :
> 180 mg/dL = **1,80 g/L** = 10,0 mmol/L · 160 mg/dL = 1,60 g/L = 8,9 mmol/L · 140 mg/dL = 1,40 g/L =
> 7,8 mmol/L · 135 mg/dL = 1,35 g/L = 7,5 mmol/L · 126 mg/dL = 1,26 g/L = 7,0 mmol/L · 130 mg/dL =
> 1,30 g/L = 7,2 mmol/L · 120 mg/dL = 1,20 g/L = 6,7 mmol/L · 70 mg/dL = 0,70 g/L = 3,9 mmol/L.

---

## §1. La question, et pourquoi elle bloque

**Question (PICO).** Chez l'**adulte DT2 sous insuline basale, sans capteur de glucose** (P), quel **seuil
de glycémie capillaire post-prandiale** (I) commande **(a)** l'**introduction** d'un bolus prandial et
**(b)** son **ajustement de dose** (C : décider sur la glycémie à jeun / sur l'HbA1c seule), et avec quel
effet sur les critères durs et de substitution (O) ?

**Pourquoi ça bloque.** Le nœud `insuline` porte, sur l'option « Ajouter un bolus au repas principal »,
le texte suivant (`content/noeuds/diabete-type-2/insuline.yaml`, l. 841-848, **cité verbatim**) :

> ```
> effet_attendu: >-
>   Dose de bolus ≈ 10 % de la dose basale (ou 4 U), 10-15 min avant le repas ; ajuster sur la glycémie
>   post-prandiale (< 1,80 g/L à 2 h) ou le TAR post-prandial.
> niveau_preuve: modere
> references:
>   - fullstep
>   - bertuol
>   - quatre-t
> ```

Deux vignettes butent dessus :
- **V-A4** — « Ajouter un bolus » est proposé **sans qu'aucune glycémie post-prandiale n'ait été
  demandée**, et son ajustement s'appuie sur un chiffre affiché **sans source visible dans le dossier**.
- **V-A8** — sans capteur et avec une seule mesure par jour, l'outil ne dit pas **ce qu'il faudrait
  mesurer** pour trancher.

**Le point de départ était que ce chiffre serait orphelin** — sa seule trace repérée dans le dépôt étant
une ligne « Méd. Geek / DragiWebdo » de `noeuds/E-insuline.md` (l. 379). **Ce n'est pas ce que j'ai
trouvé** (cf. §2 et §5) : le chiffre a une source institutionnelle française, mais **aucun essai**. La
mission était d'établir ce qui est démontré ; la réponse est que rien ne l'est, et que le nœud dit malgré
tout la même chose que HAS et ADA.

---

## §2. Ce que disent les sources locales (`docs/decision/sources/`) — et une source FR non encore versée

### 2.1 Ce que le corpus local contient déjà, et qui n'avait pas été relié à ce chiffre

| Source locale | Ce qu'elle dit sur la post-prandiale capillaire |
|---|---|
| **`Traitement global et suivi du diabète de type 2 _ ebmfrance.pdf`** (Duodecim/EBM Guidelines, contextualisé ebmfrance) | **Tableau 1 « Objectifs du traitement du DT2 »**, colonne « Objectifs généraux **à adapter individuellement** » : « Glycémie plasmatique — **4 à 7 mmol/l avant les repas** ; **< 10 mmol/l après les repas** ; **Augmentation postprandiale ne dépassant pas 2 à 3 mmol/l** ». **< 10 mmol/L = < 1,80 g/L.** ⚠ Aucune référence ni niveau de preuve n'est attaché à cette ligne du tableau (les niveaux B de la fiche portent sur les analogues lents et l'ajout d'insuline à la metformine, pas sur ce tableau). |
| **`Insulinothérapie dans le diabète de type 2 _ ebmfrance.pdf`** (fiche du nœud E) | **Ne donne aucun objectif post-prandial.** Elle dit l'inverse : « L'autosurveillance de la glycémie (**uniquement la glycémie à jeun en cas d'utilisation d'insuline basale**) et l'auto-ajustement simple de la dose d'insuline sont essentiels à la réussite » ; « Pendant le traitement par insuline du soir, **il suffit de mesurer la glycémie à jeun le matin** et lorsque les symptômes d'hypoglycémie apparaissent » ; et surtout « **Les insulines prandiales ne devraient pas être incluses dans l'insulinothérapie moderne du diabète de type 2** ». Cible GAJ **4,0-6,0 mmol/L** (0,72-1,08 g/L). Déclencheur d'intensification énoncé : « **Si la glycémie à jeun du patient est dans la plage cible** (moyenne des mesures à jeun comprise entre 4,0 et 6,0 mmol/l sur une période de 8 semaines), **mais que l'HbA1c est supérieure à la valeur cible**… un analogue du GLP-1 peut être ajouté » — c'est-à-dire le **raisonnement par élimination**, pas un seuil post-prandial. |
| **`strategie_therapeutique…_recommandations.pdf`** (HAS 2024) | **Aucune cible capillaire post-prandiale hors grossesse.** La RBP dit explicitement (§champ) : « Cette mise à jour **ne concerne pas** les recommandations portant sur : ‒ la **redéfinition des objectifs glycémiques** ou la **place de l'autosurveillance glycémique** qui restent **maintenues selon les recommandations de bonne pratique en cours** ». Titration : « définition d'un objectif pour la **glycémie à jeun au réveil** selon l'objectif d'HbA1c personnalisé ; **adaptation des doses tous les 3 jours** en fonction des **glycémies au réveil**, la dose pouvant être **augmentée ou réduite de 1 ou 2 UI** » (R.87, grade **AE**). Intensification (R.88, **AE**) : basal-bolus « préférentiellement » ou 1-2 prémix — **sans aucun seuil glycémique déclencheur**. ⚠ **Piège** : les seuls chiffres post-prandiaux de la RBP (« glycémies à jeun < 0,95 g/L et postprandiales < 1,20 g/L », R.139-140, Annexe 3) concernent **la grossesse** — ils ne doivent en aucun cas être repris pour le DT2 hors grossesse. |
| **`SFD 2025.pdf`** | **Aucune cible capillaire post-prandiale hors grossesse.** Avis n°18 : « pour obtenir une HbA1c < 7 %, il faudra viser une **glycémie au réveil entre 0,80 g/L et 1,30 g/L** et "titrer" l'insuline basale dans ce sens (adaptation des doses tous les **trois jours** en fonction des **glycémies au réveil**, la dose pouvant être **augmentée ou réduite de 2 U** — ou de **10 %** chez les patients traités par de fortes doses, par exemple **supérieures à 40 U/j**) ». Avis n°19 — déclencheur d'intensification énoncé **en HbA1c et en GAJ, jamais en post-prandial** : « HbA1c > objectif **malgré des glycémies à jeun dans la cible**, ou HbA1c > objectif et glycémie à jeun au-dessus de la cible malgré de fortes doses d'insuline basale, c'est-à-dire **plus de 0,5 U/kg/j** ». Avis n°23 (ASG) : impose de « définir les moments, la fréquence, **les objectifs glycémiques** » — **sans les chiffrer** pour le capillaire. La seule borne 1,80 g/L de la SFD est le **haut du TIR MCG** (« temps passé dans la cible **0,70-1,80 g/L** »), pas une cible capillaire post-prandiale. Post-prandial 2 h < 1,20 g/L = **grossesse uniquement**. |
| **`prescrire-dt2.md`** | **Ne traite pas la question.** Aucun des articles P1→P13 ne donne de cible glycémique capillaire ni de seuil d'introduction d'un bolus. Prescrire s'arrête à « insuline **en ajout** si HbA1c très élevé » et ne discute pas le schéma prandial. → **demande de texte au référent, §7.** |
| **`mmm_referentielmcg_ep11.pdf`** (⚠ = SFD 2017 sur la **Mesure Continue du Glucose**, pas le Collège de Médecine Générale — erreur d'étiquetage déjà actée) | Raisonne en AGP, pas en capillaire. Une seule borne chiffrée utile, et **elle porte sur l'écart, pas sur la valeur** : « Il existe une tendance à un **gradient hyperglycémique postprandial (> 1 g/L)**, avec peu d'hypoglycémies. Dans ce cas, la **dose d'insuline prandiale est probablement insuffisante** — mais il peut s'agir également de bolus prandiaux réalisés trop tardivement… voire de bolus non réalisés. » Et en miroir : « Il existe une nette tendance aux **hypoglycémies postprandiales** → la dose d'insuline prandiale est probablement **surestimée**. » |
| **`NICE 2023.pdf`** | **Hors sujet** : ce fichier est **NG238 « Cardiovascular disease: risk assessment and reduction, including lipid modification »** (14 déc. 2023), pas la reco diabète NG28. Il ne contient ni « postprandial », ni « bolus », ni « mmol/l ». → §7. |

### 2.2 La source française qui porte réellement le chiffre — et qui n'est pas dans le dépôt

**HAS, « L'autosurveillance glycémique dans le diabète de type 2 : une utilisation très ciblée »**, fiche
*Bon usage des technologies de santé*, **avril 2011**, réf. **FBUTSGLYCEM2**, validée par la CNEDiMTS.
Tableau « Rythme d'ASG suggéré », ligne « Insulinothérapie en cours » — **cité verbatim** :

> « Au moins **4 par jour** si l'insulinothérapie comprend plus d'une injection d'insuline par jour ;
> **2 à 4 par jour** si elle n'en comprend qu'une.
> **Objectifs glycémiques : avant les repas, 70 à 120 mg/dL ; en post-prandial (2 heures après le repas) :
> < 180 mg/dL.** »

C'est-à-dire **exactement** « avant les repas **0,70-1,20 g/L** » et « post-prandial à **2 h < 1,80 g/L** » —
soit **les deux chiffres du nœud**, dans une publication officielle française, et dans les unités et le
timing exacts qu'il emploie. Et cette fiche est **toujours la référence en vigueur** au sens de la RBP
2024, qui déclare ne pas rouvrir « les objectifs glycémiques » ni « la place de l'autosurveillance
glycémique ».

> ⚠ **Ce que cette fiche n'est pas** : ce n'est **pas** une RBP graduée. C'est une fiche de bon usage de
> **dispositif médical** (CNEDiMTS/CEPP), de **2011**, **sans niveau de preuve ni référence** attachés à
> ces deux nombres, et elle donne des **cibles de surveillance**, pas un **seuil de décision**
> (« au-dessus de X, ajouter un bolus »).

**URL** : `https://www.has-sante.fr/upload/docs/application/pdf/2011-04/autosurveillance_glycemique_diabete_type_2_fiche_de_bon_usage.pdf`
(page HAS : `jcms/c_1045159`). → **À verser dans `docs/decision/sources/`, §7.**

### 2.3 Provenance exacte de la ligne « Méd. Geek » de `E-insuline.md`

Chaîne reconstituée et vérifiée maillon par maillon :

1. **Médicalement Geek, *Dragi Webdo* n°300, 14 février 2021** — verbatim : « Il faut penser à introduire
   des doses d'insuline rapide si le **dosage d'insuline basale est > 0,5 UI/kg**, les **glycémies post
   prandiales sont > 1,80 g/L**, la **différence entre glycémie au coucher et celle au réveil est
   > 0,5 g/L** ou que les cibles glycémiques ne sont pas atteintes. »
   Le billet **ne cite pas les Standards ADA 2020** : il renvoie à **un seul article**, lié en clair.
2. Cet article est **Cowart K. « Overbasalization: Addressing Hesitancy in Treatment Intensification
   Beyond Basal Insulin ». *Clinical Diabetes* 2020;38(3):304-310 · PMID 32699482 · PMCID PMC7364465 ·
   DOI 10.2337/cd19-0061** — **revue narrative / commentaire de pratique**, pas un essai. Son **Tableau 1**
   (« How to identify overbasalization ») liste : « Basal insulin dose **>0.5 units/kg/day** · **Postmeal
   blood glucose >180 mg/dL** · A1C not at goal despite target fasting blood glucose level being achieved ·
   **BeAM differential ≥50 mg/dL** ».
3. **Dans cet article, la ligne « Postmeal blood glucose >180 mg/dL » ne porte AUCUNE référence.** Les deux
   autres en portent : le seuil 0,5 U/kg (réf. 17-21, avec la réserve explicite de l'auteur — « **this
   recommendation is based on expert opinion**; no prospective studies to date have investigated the maximum
   dose of basal insulin at which additional drug therapy should be initiated ») et le BeAM ≥ 50 mg/dL
   (réf. 39-40 = Zisman 2016 et Zisman 2018, cf. §3).

**Conclusion de traçabilité** : le 1,80 g/L du nœud **n'est pas un chiffre inventé ni un relais isolé** —
il coïncide au nombre près avec la cible **HAS 2011** et avec la cible **ADA (Table 6.3)**. Mais dans
**aucune** de ces sources il ne provient d'un essai, et dans **aucune** il n'est présenté comme le
**déclencheur** d'un bolus.

---

## §3. Grille par étude

### 3.1 Le seul essai qui a randomisé « cibler la post-prandiale » contre « cibler le jeûne »

| Essai (PMID/DOI) | Design / population | Intervention / comparateur | Résultat — **effet absolu, NNT, horizon** — **DUR vs SUBSTITUT** | GRADE |
|---|---|---|---|---|
| ★ **HEART2D** — Raz I, Wilson PW, Strojek K, Kowalska I, Bozikov V, Gitt AK, Jermendy G, Campaigne BN, Kerr L, Milicevic Z, Jacober SJ. *Diabetes Care* 2009;**32(3):381-386** · **PMID 19246588** · **DOI 10.2337/dc08-1671** | ECR ouvert multinational, n = **1 115** (PRANDIAL 557 / BASAL 558), DT2 30-75 ans randomisés **dans les 21 j suivant un IDM**. Durée de participation moyenne **963 j** (étendue 1-1 687), soit ~**2,6 ans** | **PRANDIAL** = 3 doses préprandiales de lispro **ciblant la glycémie post-prandiale à 2 h < 7,5 mmol/L (1,35 g/L)** ; **BASAL** = NPH ×2/j ou glargine ×1/j **ciblant la glycémie à jeun/préprandiale < 6,7 mmol/L (1,20 g/L)**. HbA1c cible < 7,0 % **dans les deux bras** | ★ **DUR** — critère principal composite (mort CV, IDM non fatal, AVC non fatal, revascularisation coronaire, hospitalisation pour SCA) : **174 (31,2 %) vs 181 (32,4 %)** ; **HR 0,98 (IC95 0,80-1,21)**. **Différence absolue 1,2 pp, non significative → aucun NNT calculable.** **Essai arrêté pour futilité.** **SUBSTITUT** : HbA1c **7,7 ± 0,1 vs 7,8 ± 0,1 %** (p = 0,4) ; glycémie post-prandiale moyenne **7,8 vs 8,6 mmol/L** (p < 0,01) ; excursion post-prandiale à 2 h **0,1 vs 1,3 mmol/L** (p < 0,001) ; GAJ **8,1 ± 0,2 vs 7,0 ± 0,2 mmol/L** (p < 0,001) | **modéré↓** — ECR à critère dur, mais **la séparation prévue n'a pas été obtenue** : l'écart post-prandial visé était **2,5 mmol/L**, l'écart observé **0,8 mmol/L** (moins du tiers) ; essai en outre **sous-puissant** (faible taux d'événements). ⇒ **« pas de bénéfice démontré », PAS « bénéfice réfuté »** |

> **Analyse post hoc (à ne pas survendre)** — *Post Hoc Subgroup Analysis of the HEART2D Trial Demonstrates
> Lower Cardiovascular Risk in Older Patients Targeting Postprandial Versus Fasting/Premeal Glycemia*,
> *Diabetes Care* 2011;34(7):1511 · **PMID 21593301** : un moindre risque chez les sujets **âgés**.
> **Post hoc, sur un essai principal négatif** → **générateur d'hypothèse**, rien de plus. *(Chiffres du
> sous-groupe non extraits — cf. §6.)*

### 3.2 Les molécules qui abaissent préférentiellement la post-prandiale : critères durs

| Essai (PMID/DOI) | Design / population | Intervention | Résultat — **absolu, NNT, horizon — DUR vs SUBSTITUT** | GRADE |
|---|---|---|---|---|
| **ACE** — Holman RR et al., ACE Study Group. *Lancet Diabetes Endocrinol* 2017;**5(11):877-886** · **PMID 28917545** · DOI 10.1016/S2213-8587(17)30309-1 | ECR **double aveugle** vs placebo, n = **6 522**, patients chinois **coronariens + intolérance au glucose**, suivi médian **5,0 ans** | **Acarbose** (agent à action essentiellement post-prandiale) vs placebo | ★ **DUR** — composite CV à 5 points : **470/3 272 (14 % ; 3,33/100 pers.-an) vs 479/3 250 (15 % ; 3,41/100 pers.-an)** ; **HR 0,98 (IC95 0,86-1,11), p = 0,73** → **aucun bénéfice, pas de NNT**. **SUBSTITUT** — survenue d'un diabète : **436 (13 %) vs 513 (16 %)** ; **rate ratio 0,82 (0,71-0,94), p = 0,005** → ARR ≈ **3 pp sur 5 ans, NNT ≈ 33/5 ans** *(sur un critère de substitution)* | **modéré-élevé** pour l'absence de bénéfice CV ; **validité externe limitée** (IGT chinois, pas DT2 insuliné) |
| **NAVIGATOR** — NAVIGATOR Study Group (Holman RR, Haffner SM, McMurray JJ, Bethel MA et al.). *N Engl J Med* 2010;**362(16):1463-1476** · **PMID 20228402** · DOI 10.1056/NEJMoa1001122 | ECR double aveugle factoriel 2×2, n = **9 306**, intolérance au glucose + maladie CV ou FDR CV, suivi médian **5 ans** | **Natéglinide** (sécrétagogue d'action courte, ciblant la post-prandiale) vs placebo | ★ **DUR** — composite CV « core » **7,9 % vs 8,3 %** ; **HR 0,94 (0,82-1,09), p = 0,43** · composite étendu **14,2 % vs 15,2 %** ; **HR 0,93 (0,83-1,03), p = 0,16** → **aucun bénéfice**. Incidence du diabète **36 % vs 34 %** ; HR **1,07 (1,00-1,15)**, p = 0,05 → **pas de réduction**. ★ **augmentation du risque d'hypoglycémie** | **modéré** ; **caveat majeur** relevé par l'IDF : le natéglinide **n'a même pas abaissé** la glycémie à 2 h de l'HGPO annuelle (elle était **plus haute** que sous placebo) → **l'essai ne teste pas vraiment l'hypothèse post-prandiale** |

### 3.3 Essais de basal-plus / prandial par étapes — **quel seuil leur protocole a-t-il réellement utilisé ?**

C'est le cœur de la question (b). Réponse résumée : **aucun ne déclenche l'ajout d'un bolus sur un seuil
post-prandial ; presque tous titrent le bolus sur le PRÉ-prandial du repas suivant.**

| Essai (PMID/DOI) | Design / population | Ce qui déclenche l'**AJOUT** d'un bolus | Ce sur quoi la **DOSE** est titrée, et avec quelle cible | Résultat — **absolu / horizon — DUR vs SUBSTITUT** | GRADE |
|---|---|---|---|---|---|
| ★ **FullSTEP** — Rodbard HW, Visco VE, Andersen H, Hiort LC, Shu DHW. *Lancet Diabetes Endocrinol* 2014;**2(1):30-37** · **PMID 24622667** · DOI 10.1016/S2213-8587(13)70090-1 | ECR phase 4 ouvert, treat-to-target, non-infériorité, **n = 401**, 150 sites / 7 pays, DT2 sous basale + ADO, HbA1c 7,9 %, diabète 12,6 ans · **32 sem** | **L'HbA1c, pas la post-prandiale** : 1 bolus au **plus gros repas** ; bolus supplémentaires **aux semaines 11 et 22 si HbA1c ≥ 7,0 %** | **Glycémie capillaire PRÉ-prandiale de la veille**, cible **4,0-7,2 mmol/L (71-130 mg/dL = 0,71-1,30 g/L)** ; > 7,2 → **+1 U** ; ≤ 3,9 → **−1 U** `[À VÉRIFIER — extrait d'une revue narrative (PMC5983081), pas du texte primaire]` | **SUBSTITUT** : HbA1c **−0,98 % vs −1,12 %** (non-inf.). ★ **hypoglycémies : rate ratio 0,58 (0,45-0,75)**, p < 0,0001, en faveur du pas-à-pas ; poids similaire ; satisfaction ↑. **Aucun critère dur.** Financement **Novo Nordisk** | **modéré** |
| **STEP-Wise** — Meneghini L, Mersebach H, Kumar S, Svendsen AL, Hermansen K. *Endocr Pract* 2011;**17(5):727-736** · **PMID 21550957** · DOI 10.4158/EP10367.OR | ECR, **n = 296**, DT2 mal contrôlés sous détémir ×1/j + ADO, après 12 sem d'optimisation de la basale · **48 sem** | **L'HbA1c** : intensification de 1 à 3 injections **à dates fixes toutes les 12 semaines si HbA1c ≥ 7,0 %** | ★ **Les deux stratégies ont été RANDOMISÉES l'une contre l'autre** : **SimpleSTEP** = bolus au repas jugé le plus gros **par le patient**, titré sur les **glycémies PRÉ-prandiales** ; **ExtraSTEP** = bolus au repas à **plus forte excursion**, titré sur les **glycémies POST-prandiales** | **SUBSTITUT** : HbA1c **−1,2 % environ dans les deux bras** ; HbA1c < 7 % à 36 sem : **31 % vs 27 %, p = 0,74** ; hypoglycémies comparables. ★ **Conclusion directement utile : choisir le repas et titrer sur la post-prandiale n'apporte RIEN de plus que choisir le plus gros repas et titrer sur le pré-prandial.** **Aucun critère dur.** | **modéré** |
| **OPAL** — Lankisch MR, Ferlinz KC, Leahy JL, Scherbaum WA; OPAL study group. *Diabetes Obes Metab* 2008;**10(12):1178-1185** · **PMID 19040645** · DOI 10.1111/j.1463-1326.2008.00967.x | ECR ouvert, national, groupes parallèles, **n = 393** DT2 sous glargine + ADO insuffisamment contrôlés | **Non testé** : tous les patients recevaient **un** bolus ; la randomisation portait sur **l'horaire** (petit-déjeuner vs repas principal) | **Non renseigné dans l'abstract** `[À VÉRIFIER]` | **SUBSTITUT** : HbA1c améliorée dans les deux bras, **indépendamment de l'horaire** ; ≤ 6,5 % : **27,8 % (petit-déj.) vs 33,8 % (repas principal)** ; ≤ 7,0 % : **36,5 % vs 52,2 %**. Hypoglycémies rares. **Aucun critère dur.** | **modéré↓** (ouvert, substitut, industrie) |
| **Étude « 1-2-3 »** — ★ **Garber AJ**, Wahlen J, Wahl T, Bressler P, Braceras R, Allen E, Jain R. *Diabetes Obes Metab* 2006;**8(1):58-66** · **PMID 16367883** · DOI 10.1111/j.1463-1326.2005.00563.x. ⚠ **Ce n'est PAS « Lankisch »** — Lankisch = OPAL (ligne ci-dessus). *(Variante japonaise : « Sapporo 1-2-3 », Yoshioka N et al., Diabetes Res Clin Pract 2009;85(1):47-52 · PMID 19427051.)* | **Observationnel, un seul bras**, n = **100**, DT2 HbA1c 7,5-10 % sous ADO ou basale · 3 paliers de 16 sem | **L'HbA1c** : 2ᵉ injection à S16 **si HbA1c de S15 > 6,5 %** ; 3ᵉ après 16 sem de plus **si HbA1c > 6,5 %** | Auto-titration hebdomadaire de l'insuline aspart biphasique 70/30 sur : GAJ et pré-dîner **80-110 mg/dL (0,80-1,10 g/L)** ; **post-prandial 2 h après le déjeuner 100-140 mg/dL (1,00-1,40 g/L)** `[À VÉRIFIER — lecture d'abstract]` | **SUBSTITUT** : HbA1c ≤ 6,5 % chez **21 % / 52 % / 60 %** (1, 2, 3 injections) ; < 7,0 % chez **41 % / 70 % / 77 %**. **Pas de comparateur, pas de critère dur.** | **faible** (pas d'ECR, pas de bras témoin) |
| **AT.LANTUS** — Davies M, Storms F, Shutler S, Bianchi-Biscay M, Gomis R; ATLANTUS Study Group. *Diabetes Care* 2005;**28(6):1282-1288** · **PMID 15920040** · DOI 10.2337/diacare.28.6.1282 | ECR, **n = 4 961**, 611 centres, 59 pays, DT2 mal contrôlés · **24 sem** | **Sans objet** : essai de **titration de la basale**, aucun bolus | ★ **Deux algorithmes, tous deux fondés sur la seule GLYCÉMIE À JEUN** (titration par le médecin vs par le patient). **Aucune composante post-prandiale.** | **SUBSTITUT** : HbA1c **−1,22 % vs −1,08 %** (p < 0,001) en faveur de l'auto-titration ; GAJ **−62 vs −57 mg/dL** (p < 0,001) ; **hypoglycémie sévère < 1,2 %** dans les deux bras. **Aucun critère dur.** | **modéré** |
| **4T (Treating To Target in Type 2 Diabetes)** — Holman RR et al. *NEJM* 2007;**357(17):1716-1730** · **PMID 17890232** · DOI 10.1056/NEJMoa075392 ; suivi 3 ans *NEJM* 2009;361:1736-1747 · **PMID 19850703** | ECR ouvert, **n = 708**, HbA1c 7,0-10,0 % sous metformine + sulfamide à dose maximale tolérée · 1 an puis 3 ans | **L'HbA1c**, pas la post-prandiale : ajout d'une 2ᵉ insuline autorisé sur contrôle insuffisant *(règle exacte `[À VÉRIFIER]`)* | ★ **Cibles de titration identiques dans les 3 bras**, pilotées par un **algorithme informatisé** sur profils capillaires : **glycémie à jeun 99 mg/dL (0,99 g/L)** et **post-prandiale à 2 h 126 mg/dL (1,26 g/L)** `[À VÉRIFIER — texte primaire NEJM non accessible ; chiffres repris d'une source secondaire]`. ⇒ **le seuil post-prandial de 4T est 1,26 g/L, PAS 1,80 g/L** | **SUBSTITUT** (1 an) : HbA1c biphasique 7,3 / prandial 7,2 / **basal 7,6 %** ; ≤ 6,5 % : 17,0 / 23,9 / **8,1 %**. **Sécurité** : hypoglycémies **2,3 (basal) vs 5,7 (biphasique) vs 12,0 (prandial)** évén./pt/an ; poids **+1,9 / +4,7 / +5,7 kg**. À 3 ans : **81,6 %** du bras basal ont dû ajouter une 2ᵉ insuline. **Aucun critère dur.** | **modéré-élevé** |

### 3.4 Le seul critère opérationnel « sans capteur » qui a été étudié comme tel : le **BeAM**

*(BeAM = bedtime-to-morning : glycémie au coucher **moins** glycémie au réveil. C'est le troisième
critère de la ligne Dragi Webdo, celui de l'« écart coucher-réveil > 0,5 g/L ».)*

| Étude (PMID/DOI) | Design / population | Critère testé | Résultat — **DUR vs SUBSTITUT** | GRADE |
|---|---|---|---|---|
| **Zisman A, Morales F, Stewart J, Stuhr A, Vlajnic A, Zhou R.** « BeAM value: an indicator of the need to initiate and intensify prandial therapy in patients with T2DM receiving basal insulin ». *BMJ Open Diabetes Res Care* 2016;**4(1):e000171** · **PMID 27110368** · DOI 10.1136/bmjdrc-2015-000171 | **Analyses post hoc** de données d'essais de phase 3 (Sanofi), 3 étapes analytiques | Valeur du BeAM et son lien avec la contribution post-prandiale à l'hyperglycémie | **SUBSTITUT** : BeAM **27,8-61,7 → 32,6-71,2 mg/dL** sur 24 sem sous basale ; corrélation BeAM ↔ contribution post-prandiale **r = 0,375 et r = 0,396** (p < 0,001) — **corrélation faible à modérée** ; sous traitement prandial, BeAM **77,0 → 40,4 mg/dL** (n = 299). **Aucun critère dur.** | **faible** (post hoc, industrie, corrélatif) |
| **Zisman A, Dex T, Roberts M, Saremi A, Chao J, Aroda VR.** « Bedtime-to-Morning Glucose Difference and iGlarLixi in T2D: Post Hoc Analysis of LixiLan-L ». *Diabetes Ther* 2018;**9(5):2155-2162** · **PMID 30218434** · DOI 10.1007/s13300-018-0507-0 | **Post hoc** de LixiLan-L, n = 517 | Stratification par **BeAM < 55 vs ≥ 55 mg/dL** | **SUBSTITUT** : un BeAM < 55 mg/dL s'associe à un meilleur contrôle et à moins d'hypoglycémies ; iGlarLixi réduit plus le BeAM que la glargine seule. **Aucun critère dur.** ⚠ **Le seuil est ici 55 mg/dL, pas 50** | **faible** |
| **Siegmund T, Borck A, Zisman A, Bramlage P, Kress S.** « A higher blood glucose level pre-breakfast in comparison to bedtime is a contraindication for intensification of prandial insulin therapy… the impact of a negative BeAM value ». *J Clin Transl Endocrinol* 2018;**14:34-38** · **PMID 30416973** · DOI 10.1016/j.jcte.2018.10.002 | **Rétrospectif**, données poolées **OPAL + POC**, n = **358** (31 BeAM négatif, 182 BeAM élevé) | BeAM **négatif** (réveil > coucher) | **SUBSTITUT** : **aucune association** entre BeAM négatif et atteinte d'HbA1c < 7 % ; GAJ plus hautes dans ce groupe. Conclusion des auteurs : l'ajout d'un bolus **n'est pas bénéfique** quand la glycémie du matin dépasse celle du coucher. **Aucun critère dur.** | **faible** |
| **Kress S, Borck A, Zisman A, Bramlage P, Siegmund T.** « A Difference Between Bedtime and Pre-Breakfast Plasma Glucose Levels Indicates the Need for Prandial Insulin in Basal Insulin-Treated T2D Patients with Normal Fasting Glucose ». *Diabetes Metab Syndr Obes* 2021;**14:1215-1222** · **PMID 33776458** · DOI 10.2147/DMSO.S267882 | **Rétrospectif** (mêmes données OPAL + POC), n = 358, dont **182 avec BeAM > 50 mg/dL** | Seuil **> 50 mg/dL (0,50 g/L)** | **SUBSTITUT** : HbA1c **7,5 → 7,2 %** (59 → 55 mmol/mol, p < 0,0001) ; **glycémie post-prandiale 202 → 143 mg/dL** (2,02 → 1,43 g/L, p < 0,0001) après ajout d'un bolus. ⚠ Les patients à BeAM **élevé atteignaient MOINS souvent la cible** que ceux à BeAM moyen — ce qui **affaiblit** l'usage du seuil comme critère de sélection. **Aucun critère dur.** | **faible-très faible** (rétrospectif, industrie, seuil non validé prospectivement) |

### 3.5 Le raisonnement physiopathologique sous-jacent (à ne pas confondre avec une preuve d'action)

| Étude (PMID/DOI) | Design | Résultat | Portée |
|---|---|---|---|
| **Monnier L, Lapinski H, Colette C.** *Diabetes Care* 2003;**26(3):881-885** · **PMID 12610053** · DOI 10.2337/diacare.26.3.881 | **Observationnel**, n = 290 DT2 **non insulinés**, ni acarbose | Contribution de la post-prandiale à l'hyperglycémie globale : **69,7 % au quintile d'HbA1c le plus bas → 30,5 % au plus haut** (p < 0,001) ; la contribution du jeûne fait l'inverse | Fonde l'idée « quand l'HbA1c s'approche de la cible, ce qui reste est post-prandial ». **Observationnel, population non insulinée** ⇒ **`tres_faible` comme fondement d'un seuil d'action** |
| **Riddle M, Umpierrez G, DiGenio A, Zhou R, Rosenstock J.** *Diabetes Care* 2011;**34(12):2508-2514** · **PMID 22028279** · DOI 10.2337/dc11-0632 | **Analyse poolée post hoc** de 6 essais, n = **1 699** | **Avant** intensification, l'hyperglycémie **basale** contribue pour **76-80 %** ; **après ajout d'une insuline basale**, elle tombe à **32-41 %** (contre 64-71 % avec d'autres approches) | ★ **C'est la justification chiffrée la plus solide du basal-plus** : une fois la basale titrée, **la part post-prandiale devient dominante**. Mais elle justifie **le geste**, **pas un seuil numérique**. **`modere` comme fondement du geste, `tres_faible` comme fondement d'un seuil** |

---

## §4. Ce que disent les recommandations

### 4.1 Sources françaises et francophones — **c'est la partie qu'OpenEvidence est incapable de faire**

| Source | Cible **post-prandiale capillaire** | **Seuil déclenchant** un bolus | **Ce sur quoi le bolus se titre** | Statut de preuve affiché |
|---|---|---|---|---|
| **HAS 2011**, fiche BUTS ASG (FBUTSGLYCEM2, avril 2011) — *toujours en vigueur, la RBP 2024 ne la rouvre pas* | ★ **« en post-prandial (2 heures après le repas) : < 180 mg/dL »** (= **< 1,80 g/L**), avec « avant les repas, **70 à 120 mg/dL** ». Rythme sous insuline : **≥ 4/j si > 1 injection**, **2-4/j si 1 injection** | **Aucun** — la fiche donne des **cibles de surveillance**, pas une règle de décision | **Non traité** | **Aucun niveau de preuve, aucune référence** attachés à ces nombres. Avis CNEDiMTS (dispositif médical) |
| **HAS 2024** (RBP, `sources/`) | **Aucune hors grossesse.** *(Grossesse R.139 : < 0,95 g/L à jeun, **< 1,20 g/L en post-prandial à 2 h** — ne jamais transposer.)* Annexe 3 : chez le sujet âgé « malade », HbA1c ≤ 9 % « **et/ou glycémies capillaires préprandiales entre 1 et 2 g/L** » | **Aucun** (R.88 : intensifier « si l'objectif glycémique n'est pas atteint », sans chiffre) | **La glycémie au réveil**, adaptation **tous les 3 jours**, **± 1 à 2 UI** (R.87) | **Grade AE** (accord d'experts) pour R.87-R.89 |
| **SFD 2025** (`sources/`) | **Aucune hors grossesse.** *(Grossesse : < 0,95 / < 1,20 g/L à 2 h.)* Le 1,80 g/L de la SFD est **le haut du TIR MCG (0,70-1,80 g/L)** | **Aucun en post-prandial.** Avis 19 : intensifier si **HbA1c > objectif malgré une GAJ dans la cible**, ou HbA1c > objectif + GAJ hors cible **malgré > 0,5 U/kg/j** | **La glycémie au réveil**, cible **0,80-1,30 g/L**, tous les **3 jours**, **± 2 U** ou **± 10 % si > 40 U/j** (Avis 18) | Prise de position d'experts. ⚠ **COI massifs** déjà actés au nœud E |
| **ebmfrance / Duodecim — fiche « Insulinothérapie DT2 »** (`sources/`) | **Aucune, et volontairement** : « **uniquement la glycémie à jeun** en cas d'utilisation d'insuline basale » | **Aucun** ; et « **les insulines prandiales ne devraient pas être incluses dans l'insulinothérapie moderne du DT2** » | GAJ **4,0-6,0 mmol/L** ; **+2 U** si GAJ ≥ 6,0 mmol/L **3 matins de suite** ; **−2 U** si GAJ < 4,0 mmol/L de façon répétée ; **−4 U** si hypoglycémie symptomatique | Niveau **B** pour le schéma basale + oraux ; **rien** sur le post-prandial |
| **ebmfrance / Duodecim — fiche « Traitement global et suivi du DT2 »** (`sources/`) | **« < 10 mmol/l après les repas » (= < 1,80 g/L)** ; « 4 à 7 mmol/l avant les repas » ; « augmentation postprandiale ne dépassant pas **2 à 3 mmol/l** » | **Aucun** | **Non traité** | **Aucun** — tableau « objectifs généraux **à adapter individuellement** », sans référence |
| **Prescrire** (`sources/prescrire-dt2.md`) | **Non traité** | **Non traité** | **Non traité** | — → **§7** |
| **SFD 2017, référentiel MCG** (`sources/mmm_referentielmcg_ep11.pdf`) | Raisonne en **gradient** : « gradient hyperglycémique postprandial **> 1 g/L** ⇒ dose prandiale probablement insuffisante » (avec 3 causes concurrentes explicitement listées : bolus trop tardif, bolus oublié, dose insuffisante) | **Aucun** | Interprétation de l'AGP | Consensus d'experts |
| **CMG (Collège de la Médecine Générale)** | **Aucune position insuline/ASG identifiée** *(constat déjà acté au nœud E ; le fichier `mmm_referentielmcg_ep11.pdf` est mal étiqueté et n'est pas du CMG)* | — | — | — |

### 4.2 Sources internationales indexées

| Source | Cible post-prandiale | Timing | Statut de preuve affiché **dans la source** |
|---|---|---|---|
| **ADA, *Standards of Care in Diabetes* — ch. 6 « Glycemic Goals »** (éd. 2026 : *Diabetes Care* 2026;49(Suppl. 1):S132 · PMC12690178 ; identique dans l'éd. 2025, 48(Suppl. 1):S128) | **Table 6.3** : « Peak postprandial capillary plasma glucose **< 180 mg/dL (< 10,0 mmol/L)** » ; préprandial **80-130 mg/dL (4,4-7,2 mmol/L)** | ★ **« Postprandial glucose measurements should be made 1-2 h after the beginning of the meal »** — **1 à 2 h**, pas « à 2 h » | ★ **Aucune lettre de grade** : c'est une **note de bas de tableau**, pas une recommandation graduée. La seule phrase de conduite est : « **Postprandial glucose may warrant special attention if A1C goals are not met despite reaching preprandial glucose goals** » — c'est-à-dire **le raisonnement par élimination**, pas un seuil déclencheur |
| **IDF, *2011 Guideline for Management of PostMeal Glucose in Diabetes*** | **« The target for postmeal glucose is 9.0 mmol/l (160 mg/dl) as long as hypoglycaemia is avoided »** (= **1,60 g/L**) | **« Postmeal plasma glucose should be measured 1-2 hours after a meal »** | ★ **Le choix du chiffre est explicitement de sécurité, pas de preuve** : « glucose levels in healthy people are often difficult to achieve in people with diabetes without an undue risk of hypoglycaemia. **Therefore, for reasons of safety, the IDF sets a glycaemic target slightly above the normal levels** ». Et surtout, l'énoncé de preuve de la Question 2 : ★ **« There is currently a lack of direct randomised clinical trial evidence that correcting postmeal hyperglycaemia improves clinical outcomes [Level 1-] »** — l'IDF discute HEART2D et NAVIGATOR et conclut : « **neither the HEART2D Study nor the NAVIGATOR Study help in answering the question of whether lowering postprandial hyperglycaemia reduces cardiovascular disease** » |
| **AACE**, *Comprehensive Type 2 Diabetes Management Algorithm* | **Post-prandial à 2 h < 140 mg/dL (< 1,40 g/L)** ; préprandial < 110 mg/dL ; HbA1c ≤ 6,5 % chez le patient sans comorbidité grave et à faible risque hypoglycémique | 2 h | `[À VÉRIFIER]` — chiffre lu sur une **source secondaire** (synthèse universitaire), pas sur le texte AACE. Cf. §6 |

> ★ **Le fait le plus parlant du §4 : les trois grandes recommandations internationales donnent trois
> nombres différents pour la même mesure — 1,40 (AACE) · 1,60 (IDF) · 1,80 g/L (ADA) — et deux fenêtres
> de mesure différentes (« 2 h » vs « 1-2 h »). Un seuil issu de données ne se disperse pas ainsi. Cette
> dispersion est, à elle seule, la démonstration que le chiffre est un accord d'experts.**

---

## §5. Réponse à la question posée

### 5.1 Ce qui est **DÉMONTRÉ** (essais, critères durs ou substituts solides)

1. **Cibler la glycémie post-prandiale plutôt que la glycémie à jeun n'a jamais amélioré un critère
   dur.** Le seul essai qui ait randomisé les deux stratégies l'une contre l'autre — **HEART2D**
   (PMID 19246588) — est **négatif et a été arrêté pour futilité** : **31,2 % vs 32,4 %** d'événements CV,
   **HR 0,98 (0,80-1,21)** sur ~2,6 ans. **GRADE : modéré↓** — avec la réserve capitale que **la
   séparation glycémique visée n'a pas été obtenue** (0,8 mmol/L au lieu de 2,5) et que l'essai était
   sous-puissant. **Formulation correcte : « aucun bénéfice démontré », pas « bénéfice réfuté ».**
   Cohérent : **ACE** (acarbose, PMID 28917545, HR 0,98) et **NAVIGATOR** (natéglinide, PMID 20228402,
   HR 0,94) — deux ECR de plus de 6 000 patients sur des molécules à action post-prandiale — sont eux
   aussi négatifs sur le CV.
2. **L'ajout d'un bolus par étapes est supérieur au basal-bolus d'emblée sur la sécurité, à contrôle
   égal** — **FullSTEP** (PMID 24622667), hypoglycémies **rate ratio 0,58 (0,45-0,75)** sur 32 sem.
   **GRADE : modéré.** *(Déjà encodé et correctement sourcé dans le nœud.)*
3. **Une fois la basale titrée, la part post-prandiale de l'hyperglycémie devient dominante** —
   **Riddle 2011** (PMID 22028279) : la contribution basale passe de **76-80 %** à **32-41 %** après ajout
   d'une insuline basale. **GRADE : modéré** (analyse poolée post hoc de 6 essais). **C'est ce qui fonde
   le geste** « GAJ à la cible + HbA1c haute ⇒ traiter le diurne », **et rien d'autre** : ça ne fonde
   **aucun** nombre.
4. ★ **Choisir le repas et titrer le bolus sur la glycémie POST-prandiale n'apporte rien de plus que
   choisir le plus gros repas et titrer sur la PRÉ-prandiale.** **STEP-Wise** (PMID 21550957) a randomisé
   exactement cette question : HbA1c **−1,2 % dans les deux bras**, cible atteinte **31 % vs 27 %
   (p = 0,74)**, hypoglycémies comparables. **GRADE : modéré.** **C'est la réponse la plus directe et la
   plus utile de toute cette collecte à l'exigence E3.**
5. **Ce que les protocoles ont réellement utilisé pour titrer le bolus** : la **glycémie pré-prandiale du
   repas suivant** (FullSTEP, cible **0,71-1,30 g/L** `[À VÉRIFIER]` ; SimpleSTEP). Le seul protocole
   affichant un vrai seuil post-prandial à 2 h est **4T**, et il vaut **1,26 g/L**, pas 1,80
   `[À VÉRIFIER]`. Le 1-2-3 (Garber) : post-prandial 2 h après le déjeuner **1,00-1,40 g/L**
   `[À VÉRIFIER]`. **Aucun essai n'a utilisé 1,80 g/L comme cible de titration.**
6. **Ce qui a réellement déclenché l'ajout d'un bolus dans tous ces essais : l'HbA1c au-dessus de la
   cible**, à date fixe (FullSTEP S11/S22 si HbA1c ≥ 7 % ; STEP-Wise toutes les 12 sem si HbA1c ≥ 7 % ;
   1-2-3 à S16/S32 si HbA1c > 6,5 %). **Jamais un seuil de glycémie post-prandiale.** **GRADE : élevé**
   pour ce constat descriptif — il s'agit de la lecture directe de protocoles concordants.

### 5.2 Ce qui est **ACCORD D'EXPERTS** (et doit être affiché comme tel)

7. ★ **Le seuil « post-prandial < 1,80 g/L à 2 h » est un accord d'experts, sans aucun essai derrière.**
   Il est **réel** et **institutionnel** — **HAS 2011** (« en post-prandial (2 heures après le repas) :
   **< 180 mg/dL** »), **ADA Table 6.3** (« peak postprandial < 180 mg/dL », **1-2 h**), **ebmfrance/
   Duodecim** (« < 10 mmol/l après les repas ») — mais dans les trois cas **sans référence, sans grade et
   sans essai**. L'IDF, qui a consacré une recommandation entière au sujet, retient un **autre** nombre
   (**1,60 g/L**) et écrit que son choix est fait « **for reasons of safety** ». L'AACE en retient un
   **troisième** (**1,40 g/L**). **GRADE : `tres_faible`.**
8. **Le seuil « basale > 0,5 U/kg/j » est lui aussi un accord d'experts** — l'auteur qui le popularise
   l'écrit noir sur blanc : « **this recommendation is based on expert opinion; no prospective studies to
   date have investigated the maximum dose** » (Cowart 2020, PMID 32699482). *(Ce point était déjà acté au
   dépôt — cf. `chantier-2026-07-27/preuve-sur-basalisation.md`. Rien de nouveau ici, je le confirme.)*
9. **Le seuil BeAM « écart coucher-réveil > 0,50 g/L » est le mieux étudié des trois — et c'est peu :**
   deux analyses **post hoc** d'essais industriels (Zisman 2016 PMID 27110368, corrélation **r ≈ 0,4** ;
   Zisman 2018 PMID 30218434, avec un seuil **différent, 55 mg/dL**) et deux analyses **rétrospectives**
   sur les mêmes données OPAL + POC (Siegmund 2018 PMID 30416973 ; Kress 2021 PMID 33776458). **Aucune
   validation prospective, aucun critère dur. GRADE : `faible`.** À noter que Kress rapporte que les
   patients à BeAM **élevé atteignaient moins souvent la cible** — ce qui affaiblit son usage comme
   critère de sélection.

### 5.3 Ce qui **N'EXISTE PAS**

10. **Il n'existe aucun essai — et aucune recommandation, française ou internationale — qui définisse un
    seuil de glycémie capillaire post-prandiale au-dessus duquel introduire un bolus prandial.** La
    recherche a couvert : HEART2D, FullSTEP, STEP-Wise, OPAL, 1-2-3 (Garber + Sapporo), AT.LANTUS, 4T,
    ACE, NAVIGATOR, la littérature BeAM, HAS 2011/2024, SFD 2025, ebmfrance ×2, SFD MCG 2017, ADA
    Standards ch. 6, IDF 2011, AACE. **Toutes les règles d'introduction publiées sont en HbA1c.**
11. **Il n'existe aucune règle publiée d'ajustement de la dose d'un bolus sur la glycémie post-prandiale à
    2 h en soins primaires** — les algorithmes publiés titrent sur le **pré-prandial du repas suivant**, et
    la seule comparaison randomisée des deux approches (**STEP-Wise**) ne départage pas.
12. **Il n'existe aucune donnée sur la densité minimale d'autosurveillance capillaire nécessaire pour
    piloter un bolus** (question de V-A8). Les recommandations donnent des **rythmes** (HAS 2011 :
    « ≥ 4/j si > 1 injection » ; ADA : profils appariés), jamais un **plancher d'exploitabilité**.

### 5.4 Traduction opérationnelle proposée (à trancher par le référent, **je ne tranche pas**)

Ce que la preuve autorise à dire, et ce qu'elle interdit :

- **Autorisé (démontré)** — *« Sous basale bien titrée (GAJ à la cible) et HbA1c au-dessus de la cible,
  l'écart restant est post-prandial : ajouter un GLP-1, puis un bolus au repas principal. »*
  (Riddle 2011 + FullSTEP + le raisonnement par élimination d'ebmfrance et d'ADA Table 6.3.)
- **Autorisé (démontré)** — *« Le repas à couvrir peut simplement être le plus gros ; le mesurer ne fait
  pas mieux. »* (STEP-Wise.)
- **Autorisé (accord d'experts, à afficher comme tel)** — *« Cible de surveillance : post-prandial
  < 1,80 g/L 1 à 2 h après le début du repas (HAS 2011, ADA — accord d'experts, aucun essai). »*
- **Interdit** — présenter 1,80 g/L comme le **déclencheur** de l'introduction d'un bolus, ou comme la
  variable sur laquelle **la dose se titre**. Aucune source ne le fait ; les essais titrent sur le
  pré-prandial suivant.
- **Interdit** — laisser entendre qu'abaisser la post-prandiale prévient les événements
  cardiovasculaires. HEART2D, ACE et NAVIGATOR disent le contraire ou ne disent rien.

### 5.5 Deux hypothèses pour le red-team — **formulées comme hypothèses, pas comme constats**

> ⚠ **Garde-fou explicite.** Le 2026-07-27, trois collectes sur quatre ont accusé le nœud à tort
> (`CONSTRUIRE-UN-MODULE.md` §P4). Les deux points ci-dessous sont **à red-teamer**, pas à appliquer.
> Le premier va **dans le sens du nœud**.

**H1 — Le cadrage de la passe était trop sévère envers le contenu existant *(hypothèse en faveur du
nœud)*.** Le prompt de la passe A et `PROMPTS-OE-passeA.md` affirment que le chiffre « n'a aucune
référence primaire » et que « **sa seule trace est un relais francophone des Standards ADA 2020** ». Deux
corrections factuelles :
- le chiffre est dans **le corpus local du dépôt lui-même** — `sources/Traitement global et suivi du
  diabète de type 2 _ ebmfrance.pdf`, Tableau 1 : « **< 10 mmol/l après les repas** » ;
- et surtout dans une **source officielle française toujours en vigueur** — **HAS 2011, fiche BUTS ASG**,
  qui donne **les deux** bornes du nœud (« avant les repas, **70 à 120 mg/dL** ; en post-prandial
  (2 heures après le repas) : **< 180 mg/dL** »).
Le billet Dragi Webdo, lui, ne renvoie **pas** aux Standards ADA 2020 mais à **Cowart 2020** (*Clin
Diabetes*). **Conséquence si H1 est confirmée** : il n'y a **rien à retirer** du nœud sur ce point ; il y
a une **source à ajouter** et un **statut de preuve à corriger** (`niveau_preuve` de l'énoncé du seuil =
accord d'experts, pas `modere`). **Ce n'est pas un défaut du contenu, c'est un défaut de traçabilité.**

**H2 — Il y a en revanche un vrai désalignement entre la phrase et ses références *(hypothèse
défavorable, à vérifier)*.** L'option porte, littéralement :

> `effet_attendu` : « … ajuster sur la glycémie **post-prandiale (< 1,80 g/L à 2 h)** ou le TAR
> post-prandial. » · `references: [fullstep, bertuol, quatre-t]` · `niveau_preuve: modere`

Or, d'après le §3.3 : **FullSTEP titre sur le PRÉ-prandial** (cible 0,71-1,30 g/L `[À VÉRIFIER]`) ; **4T
titre sur un post-prandial à 2 h de 1,26 g/L**, pas 1,80 `[À VÉRIFIER]` ; **Bertuol** est une méta-analyse
en réseau de schémas, qui ne porte aucun seuil de titration. **Aucune des trois références citées ne
porte le nombre affiché à côté d'elles**, et le nombre lui-même vient d'ailleurs (HAS 2011 / ADA). Ce que
je soumets au red-team, et **rien de plus** : (i) le nombre est bon mais **mal attribué** ; (ii) le verbe
« ajuster sur » est **plus fort que ce que la preuve autorise** — STEP-Wise a montré que titrer sur la
post-prandiale n'est pas supérieur ; (iii) `niveau_preuve: modere` couvre correctement le **geste**
(basal-plus, FullSTEP) mais **pas le seuil** (accord d'experts). **Je ne propose aucune rédaction de
remplacement : c'est un arbitrage référent + red-team.**

---

## §6. `[À VÉRIFIER]` restants

| # | Élément | Pourquoi il n'est pas confirmé | Décisionnel ? |
|---|---|---|---|
| V1 | **4T** : cibles de titration « GAJ 99 mg/dL et post-prandial 2 h **126 mg/dL** » | Texte intégral NEJM inaccessible (403). Chiffres lus sur **source secondaire**. Le point décisionnel — « 4T ne visait pas 1,80 g/L » — tient quel que soit le nombre exact, mais le nombre lui-même doit être vérifié sur le protocole | **Oui** (H2) |
| V2 | **FullSTEP** : algorithme de titration du bolus « pré-prandial de la veille, cible **4,0-7,2 mmol/L** ; +1 U / −1 U » | Lu dans une **revue narrative** (PMC5983081), pas dans le Lancet ni le protocole. Le fait structurant — titration sur le **pré-prandial**, ajout de bolus sur **HbA1c ≥ 7 %** — est corroboré par deux sources indépendantes | **Oui** (H2) |
| V3 | **1-2-3 (Garber 2006)** : « post-prandial 2 h après le déjeuner **100-140 mg/dL** » | Lecture d'abstract via un intermédiaire, pas du texte intégral | Non (secondaire) |
| V4 | **OPAL** : algorithme de titration du bolus | Non renseigné dans l'abstract ; texte intégral non consulté | Non |
| V5 | **AACE** : post-prandial 2 h **< 140 mg/dL** | Lu sur une **synthèse universitaire secondaire** (UIC Drug Information Group), pas sur le texte AACE. **Doit être vérifié sur l'*Endocrine Practice* primaire avant toute citation** | Oui, si on cite la dispersion 1,40/1,60/1,80 |
| V6 | **HEART2D post hoc « sujets âgés »** (PMID 21593301) | Titre et référence vérifiés ; **chiffres du sous-groupe non extraits** | Non (post hoc sur essai négatif — ne doit rien piloter) |
| V7 | **NAVIGATOR** : durée de suivi pour les critères **CV** (médiane 5 ans annoncée pour le diabète incident ; le suivi CV pourrait être plus long) | Abstract lu via intermédiaire | Non |
| V8 | **Statut actuel de la fiche HAS 2011** (FBUTSGLYCEM2) : toujours en ligne, mais **archivée ?** superseded ? | PDF récupéré et lu intégralement sur `has-sante.fr` ; le statut administratif (en vigueur / archivé) n'a pas été vérifié sur la fiche `jcms/c_1045159` | **Oui** — c'est le maillon qui rend le 1,80 g/L citable comme reco FR |
| V9 | **Observation adjacente, hors périmètre de ma question — à ne PAS traiter ici.** Le nœud encode la cible de GAJ **0,70-1,20 g/L** ; elle correspond exactement à HAS 2011 (« avant les repas, 70 à 120 mg/dL ») mais **SFD 2025 Avis 18 écrit 0,80-1,30 g/L** et ebmfrance 4,0-6,0 mmol/L (0,72-1,08 g/L) | Les trois citations sont vérifiées verbatim (§2). **Ce n'est pas ma question** : je signale, **je ne tranche pas** (00-global §Règles de sourcing) | À arbitrer hors passe A1 |

---

## §7. Demandes au référent

1. ★ **Verser `docs/decision/sources/` la fiche HAS 2011 « L'autosurveillance glycémique dans le DT2 »**
   (FBUTSGLYCEM2, avril 2011) — c'est **la** source française du couple « pré-prandial 0,70-1,20 g/L /
   post-prandial 2 h < 1,80 g/L » et du **rythme d'ASG sous insuline** (≥ 4/j si > 1 injection ; 2-4/j si
   1 injection), qui est aussi la seule réponse trouvée à V-A8. URL en §2.2. **Et confirmer son statut
   (en vigueur ou archivée)** — V8.
2. **Textes Prescrire** : aucun des articles P1→P13 du fichier `prescrire-dt2.md` ne traite les **cibles
   glycémiques capillaires**, l'**autosurveillance** ni le **schéma prandial**. S'il existe un article
   Prescrire sur l'**autosurveillance glycémique dans le DT2** ou sur les **insulines rapides / le
   schéma basal-bolus**, il manque au dossier et changerait la « position critique » de ce point.
3. **`NICE 2023.pdf` de `sources/` est NG238 (risque cardiovasculaire / lipides), pas la reco diabète.**
   Si l'intention était **NG28 « Type 2 diabetes in adults: management »**, le bon PDF est à fournir —
   NICE est la seule grande reco internationale non couverte ici.
4. **`prescrire 12.pdf` vide** — demande déjà ouverte au nœud E, toujours pendante.
5. **Arbitrage à rendre (E3)**, une fois le red-team passé : le nœud doit-il (a) demander une glycémie
   post-prandiale, (b) demander plutôt la **glycémie pré-prandiale du repas suivant** — ce que font les
   essais —, (c) demander le **BeAM** (coucher − réveil), ou (d) ne rien demander de plus et continuer à
   raisonner par élimination (GAJ à la cible + HbA1c haute) comme il le fait déjà et comme le font
   ebmfrance, ADA et la SFD ? **La preuve ne tranche pas entre (a), (b) et (d) ; elle exclut seulement
   que (a) soit supérieur** (STEP-Wise).
6. **Rappel de discipline** : ce document n'a **rien modifié** sous `content/`, `src/`, `schema/`, ni
   `noeuds/E-insuline.md`. Les hypothèses **H1** et **H2** du §5.5 doivent passer le red-team **avant**
   toute écriture.

---

## Annexe — toutes les références citées, avec identifiants vérifiés

| Clé | Référence complète | Identifiant |
|---|---|---|
| HEART2D | Raz I, Wilson PW, Strojek K, et al. Effects of prandial versus fasting glycemia on cardiovascular outcomes in type 2 diabetes: the HEART2D trial. *Diabetes Care* 2009;32(3):381-386 | PMID **19246588** · DOI 10.2337/dc08-1671 |
| HEART2D post hoc | Post Hoc Subgroup Analysis of the HEART2D Trial… *Diabetes Care* 2011;34(7):1511 | PMID **21593301** |
| FullSTEP | Rodbard HW, Visco VE, Andersen H, Hiort LC, Shu DHW. *Lancet Diabetes Endocrinol* 2014;2(1):30-37 | PMID **24622667** · DOI 10.1016/S2213-8587(13)70090-1 |
| STEP-Wise | Meneghini L, Mersebach H, Kumar S, Svendsen AL, Hermansen K. *Endocr Pract* 2011;17(5):727-736 | PMID **21550957** · DOI 10.4158/EP10367.OR |
| OPAL | Lankisch MR, Ferlinz KC, Leahy JL, Scherbaum WA. *Diabetes Obes Metab* 2008;10(12):1178-1185 | PMID **19040645** · DOI 10.1111/j.1463-1326.2008.00967.x |
| 1-2-3 | Garber AJ, Wahlen J, Wahl T, et al. *Diabetes Obes Metab* 2006;8(1):58-66 | PMID **16367883** · DOI 10.1111/j.1463-1326.2005.00563.x |
| Sapporo 1-2-3 | Yoshioka N, Kurihara Y, Manda N, et al. *Diabetes Res Clin Pract* 2009;85(1):47-52 | PMID **19427051** · DOI 10.1016/j.diabres.2009.04.012 |
| AT.LANTUS | Davies M, Storms F, Shutler S, Bianchi-Biscay M, Gomis R. *Diabetes Care* 2005;28(6):1282-1288 | PMID **15920040** · DOI 10.2337/diacare.28.6.1282 |
| 4T 1 an | Holman RR, et al. *N Engl J Med* 2007;357(17):1716-1730 | PMID **17890232** · DOI 10.1056/NEJMoa075392 |
| 4T 3 ans | Holman RR, et al. *N Engl J Med* 2009;361:1736-1747 | PMID **19850703** |
| ACE | Holman RR, Coleman RL, Chan JCN, et al. *Lancet Diabetes Endocrinol* 2017;5(11):877-886 | PMID **28917545** · DOI 10.1016/S2213-8587(17)30309-1 |
| NAVIGATOR | NAVIGATOR Study Group. *N Engl J Med* 2010;362(16):1463-1476 | PMID **20228402** · DOI 10.1056/NEJMoa1001122 |
| BeAM 2016 | Zisman A, Morales F, Stewart J, Stuhr A, Vlajnic A, Zhou R. *BMJ Open Diabetes Res Care* 2016;4(1):e000171 | PMID **27110368** · DOI 10.1136/bmjdrc-2015-000171 |
| BeAM LixiLan-L | Zisman A, Dex T, Roberts M, Saremi A, Chao J, Aroda VR. *Diabetes Ther* 2018;9(5):2155-2162 | PMID **30218434** · DOI 10.1007/s13300-018-0507-0 |
| BeAM négatif | Siegmund T, Borck A, Zisman A, Bramlage P, Kress S. *J Clin Transl Endocrinol* 2018;14:34-38 | PMID **30416973** · DOI 10.1016/j.jcte.2018.10.002 |
| BeAM 2021 | Kress S, Borck A, Zisman A, Bramlage P, Siegmund T. *Diabetes Metab Syndr Obes* 2021;14:1215-1222 | PMID **33776458** · DOI 10.2147/DMSO.S267882 |
| Overbasalization | Cowart K. Overbasalization: Addressing Hesitancy in Treatment Intensification Beyond Basal Insulin. *Clin Diabetes* 2020;38(3):304-310 | PMID **32699482** · PMC7364465 · DOI 10.2337/cd19-0061 |
| Monnier | Monnier L, Lapinski H, Colette C. *Diabetes Care* 2003;26(3):881-885 | PMID **12610053** · DOI 10.2337/diacare.26.3.881 |
| Riddle 2011 | Riddle M, Umpierrez G, DiGenio A, Zhou R, Rosenstock J. *Diabetes Care* 2011;34(12):2508-2514 | PMID **22028279** · DOI 10.2337/dc11-0632 |
| ADA ch. 6 | 6. Glycemic Goals, Hypoglycemia, and Hyperglycemic Crises: *Standards of Care in Diabetes—2026*. *Diabetes Care* 2026;49(Suppl. 1):S132 | PMC**12690178** · DOI 10.2337/dc26-S006 `[à vérifier — DOI reconstruit]` |
| IDF 2011 | International Diabetes Federation. *2011 Guideline for Management of PostMeal Glucose in Diabetes*. Bruxelles : IDF, 2011 | PDF IDF, lu intégralement |
| HAS 2011 ASG | HAS. *L'autosurveillance glycémique dans le diabète de type 2 : une utilisation très ciblée*. Fiche BUTS, avril 2011, réf. FBUTSGLYCEM2 | `has-sante.fr` — **à verser dans `sources/`** |
| HAS 2024 | HAS. *Stratégie thérapeutique du patient vivant avec un DT2*, mai 2024 | `sources/` (local) |
| SFD 2025 | Darmon P, et al. Prise de position de la SFD… 2025. *Méd. Mal. Métab.* 2025;19(8):630-662 | DOI 10.1016/j.mmm.2025.10.002 — `sources/` (local) |
| ebmfrance insuline | *Insulinothérapie dans le diabète de type 2*, ebm00491, Duodecim 27/05/2022, contextualisation ebmfrance 26/06/2024 | `sources/` (local) |
| ebmfrance global | *Traitement global et suivi du diabète de type 2*, ebm00488 | `sources/` (local) |
| Dragi Webdo n°300 | Médicalement Geek, *Dragi Webdo n°300*, 14 février 2021 | `medicalement-geek.com/2021/02/dragi-webdo-n300.html` |
</content>
</invoke>
