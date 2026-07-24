# Insulinothérapie du DT2 — argumentaire exhaustif

> Niveau de lecture 3 (preuve complète). Document autonome distillé du dossier de preuve
> `docs/decision/noeuds/E-insuline.md` (5 agents A × OpenEvidence 2ᵉ passe × red-team B1/B2/B3, PMID/DOI
> vérifiés et **corrigés** contre source primaire — §5b). **BROUILLON en attente de validation référent.**

## En bref

Quand une insuline devient nécessaire dans le DT2, quatre situations se présentent — **initier** une basale,
**optimiser** une basale, **ajouter un bolus** (basal-plus), **adapter** un basal-bolus. Fils directeurs :

- **La basale d'abord, en gardant les non-insulines.** Insuline basale + antidiabétiques (oraux et/ou GLP-1)
  = schéma de choix (ebmfrance niveau B). Les schémas **prandial et prémélangé systématiques ne sont pas
  fondés sur les preuves** (surcroît d'hypoglycémie et de poids).
- **Intensifier par étapes, GLP-1 avant le bolus.** Sur une basale insuffisante, ajouter un GLP-1 (ou une
  association fixe) donne le même contrôle que le basal-bolus avec **moins d'hypoglycémie et de poids** ;
  réserver le bolus (basal-plus au repas principal, puis basal-bolus) aux cas où basale + GLP-1 sont insuffisants.
- **Sécurité d'abord, pas de sur-promesse.** Molécule et cible pilotées par le **risque hypoglycémique**
  (analogues de 2ᵉ génération si risque élevé). L'insuline **améliore le contrôle et le microvasculaire mais
  n'a aucun bénéfice cardiovasculaire démontré** (ORIGIN neutre).
- **La MCG guide, elle ne décide pas.** Les cibles de Time in Range sont un **consensus**, pas un critère
  dur ; elles servent l'interprétation et les alertes. Seule la dimension **hypoglycémie** (temps sous la
  cible, variabilité) pilote des recommandations de sécurité.

## 1. Quand initier — et pourquoi la basale (argumentation négative du prandial/prémix)

**Quand.** L'insuline s'instaure lorsque la cible d'HbA1c (issue du nœud A) n'est pas atteinte malgré les
non-insulines optimisées (le GLP-1 étant préféré comme premier injectable), en cas de contre-indication /
intolérance à celles-ci, ou d'emblée en cas de **glucotoxicité symptomatique** (polyuro-polydipsie,
amaigrissement) — HAS 2024 (R.89 : HbA1c ≥ 10 % ou glycémies > 3 g/L répétées → schéma intensifié d'emblée),
ADA 2026 (rec 9.20). *Note red-team : la HAS déclenche sur des seuils glycémiques, le critère « symptômes »
est propre à l'ADA.*

**Basale = choix.** L'association agents oraux + insuline basale du soir est confirmée par méta-analyses
(ebmfrance/Duodecim, niveau B). Le bras basal a le meilleur profil de tolérance :

| Étude | Comparaison | Hypoglycémie | Poids | HbA1c |
| --- | --- | --- | --- | --- |
| **4T 1 an** (PMID 17890232) | basal détémir vs biphasique vs prandial (ajout oraux) | **2,3 vs 5,7 vs 12,0** évén./pt/an | **+1,9 vs +4,7 vs +5,7 kg** | 7,6 vs 7,3 vs 7,2 % |
| **4T 3 ans** (PMID 19850703) | idem, avec intensification | médiane **1,7 vs 3,0 vs 5,7** | basal le moindre | converge ~6,8-7,1 % ; **81,6 %** du bras basal ont dû ajouter un 2ᵉ type |
| **Bertuol NMA 2026** (58 ECR, 19 122 pts) | vs basale | hausse **limite** de l'hypo sévère | **+~1 kg** | prandial −0,38 %, biphasique −0,24 %, basal-bolus −0,31 % |

**Argumentation négative.** Le gain d'HbA1c des schémas complexes est **modeste** (0,24-0,38 %, substitut) et
se paie en hypoglycémie et en poids ; à 3 ans (4T), lorsque la plupart des patients basal ont été intensifiés,
les HbA1c convergent — l'avantage cumulé du départ en basale (moins d'hypo, moins de poids) persiste. D'où :
**prandial et prémélangé écartés de la 1ʳᵉ intention** (« ne constituent pas un traitement fondé sur les
preuves » — ebmfrance). **Niveau de preuve : modéré à élevé** (essais robustes ; critères de substitution + sécurité).

**Titration.** Dose initiale = **poids × 0,1-0,2 U/kg/j** (repli fixe 10 U le soir — ebmfrance), auto-ajustement
**+2 U** si la glycémie à jeun reste au-dessus de la cible 3 matins de suite (ou +10-20 % par paliers si dose
> 40 U), adaptation tous les 3 jours ; cible de glycémie à jeun ~0,70-1,20 g/L. Algorithme validé par
**Treat-to-Target** (PMID 14578243) : ~60 % atteignent la cible.

## 2. Choix de la molécule basale — hypoglycémie nocturne (substitut) vs sévère (dur)

Chez le patient à risque d'hypoglycémie (âgé, fragile, insuffisance rénale, hypoglycémies nocturnes),
préférer un **analogue de 2ᵉ génération** (glargine U300 ou degludec) à glargine U100 / détémir, a fortiori à
la NPH.

| Comparaison | Hypo nocturne / symptomatique (substitut) | Hypo SÉVÈRE (dur) |
| --- | --- | --- |
| Degludec vs glargine U100 — **SWITCH 2** (PMID 28672317) | RR **0,70** globale, **0,58** nocturne | 1,6 % vs 2,4 %, **p=0,35 (NS)** en maintenance |
| Degludec vs glargine U100 — **DEVOTE** (PMID 28605603) | — | **RR 0,60**, ARR 1,7 pt, **NNT ~59 / 2 ans** (population à très haut risque) |
| Glargine U300 vs U100 — **EDITION** poolée (PMID 25929311) | nocturne **−31 %** | 2,3 % vs 2,6 % (rare, NS) |
| Analogues 1ʳᵉ gén vs **NPH** — **Cochrane Semlitsch 2020** (PMID 33166419) | globale/nocturne réduites | **RR 0,68 (0,46-1,01), p=0,06 — NON significatif** |

**Points red-team (à ne pas survendre).** (1) La réduction de l'hypoglycémie **sévère** n'est démontrée que
pour **degludec vs glargine U100** (DEVOTE) ; pour la 1ʳᵉ génération vs NPH, elle n'atteint **pas** la
significativité (Cochrane 2020). (2) **Pas de supériorité** d'un analogue de 2ᵉ génération sur l'autre : BRIGHT
(PMID 30104294) conclut à l'équivalence ; **CONCLUDE** (PMID 31984443) a **manqué son critère primaire**
(RR 0,88 NS), ses résultats nocturne/sévère n'étant qu'exploratoires. (3) La donnée observationnelle est
discordante (Bradley : HR 0,71 ; Lipska : non concluante). → Recommandation au niveau de la **classe** (D12),
bénéfice affiché = hypoglycémie **nocturne**, l'hypoglycémie sévère réservée au cas degludec vs glargine U100.
**Niveau de preuve : modéré.**

## 3. Intensification — GLP-1 / association fixe avant le bolus

Sur une basale insuffisante (glycémie à jeun à la cible mais HbA1c au-dessus = écart post-prandial ;
« over-basalisation » au-delà de ~0,5 U/kg), **ne pas sur-titrer la basale**.

| Stratégie (vs basal-bolus) | HbA1c | Hypoglycémie | Poids | Injections |
| --- | --- | --- | --- | --- |
| **IDegLira — DUAL VII** (PMID 29483185, comparateur non plafonné) | non-inférieure (ETD −0,02 %) | **rate ratio 0,11** | **−3,6 kg** | **1 vs ≥ 4** |
| **GLP-1 + basale — méta Eng** (PMID 25220191) | −0,1 % | **RR 0,67** | **−5,66 kg** | — |
| **GLP-1 + insuline — méta Maiorino** (26 ECR, PMID 28325801) | similaire | **RR 0,66** | −4,7 kg | — |
| **Basal-plus par étapes — FullSTEP** (PMID 24622667) | non-inférieure | **rate ratio 0,58** | similaire | progressif |

**Hiérarchie.** (1) **GLP-1 ou association fixe** (IDegLira, iGlarLixi) — même contrôle que le basal-bolus,
moins d'hypoglycémie et de poids, une injection. (2) Si un bolus est nécessaire : **basal-plus** (un bolus au
repas principal, ≈ 10 % de la basale ou 4 U, guidé par l'excursion post-prandiale de l'AGP), n'escalader que
si besoin. (3) **Prémélangée = option dégradée** (dernier recours, uniquement si refus des injections
multiples + repas réguliers — ADA 2026), jamais avant les précédentes. **Réserve** : aucun essai de
morbi-mortalité CV pour les associations fixes → bénéfice **substitutif**. **Niveau de preuve : modéré**
(faible pour le prémix).

## 4. Adaptation du basal-bolus & désintensification

Le basal-bolus est **inclus dans le périmètre du MG** (arbitrage référent §8-5). Optimiser la répartition
(~50/50) et ajuster **à partir des doses actuelles**, guidé par le profil AGP : hypo nocturne → réduire la
basale ; phénomène de l'aube → augmenter la basale ; excursions post-prandiales → augmenter / avancer le
bolus ; hypo interprandiale → réduire le bolus. Le **calcul formel des ratios glucides-insuline et du facteur
de sensibilité n'est pas inclus** (éducation spécialisée).

**Désintensification.** Chez le sujet fragile, à espérance de vie limitée ou avec hypoglycémies sévères :
relâcher la cible, simplifier le schéma, réduire les doses, envisager un GLP-1 pour réduire les besoins —
éviter le surtraitement (HAS 2024 R.103 ; SFD 2025 Avis 21).

**Orientation.** Alerte vers le spécialiste (± pompe / boucle fermée = centres initiateurs, hors initiation
MG) si le **déséquilibre persiste malgré l'optimisation** ou en **situation particulière** (hypoglycémies
sévères récurrentes / non-perception, instabilité marquée, grossesse ou projet).

## 5. Mesure Continue du Glucose — consensus, substituts, interprétation

**Distinction fondamentale (§8-4).** Trois niveaux de preuve à ne pas confondre :

| | Statut | Source |
| --- | --- | --- |
| Cibles TIR/TBR/TAR/CV/GMI | **CONSENSUS d'experts** | Battelino / ATTD 2019 (PMID 31177185) |
| Lien TIR → complications | **OBSERVATIONNEL** | Beck 2019 (ré-analyse DCCT, **DT1**, PMID 30352896) ; Lu 2021 (cohorte **T2D**, PMID 33097560) |
| Bénéfice d'une PEC guidée par MCG | ECR à **substituts** (HbA1c, TIR) ; pas de critère dur en DT2 | MOBILE (PMID 34077499), FreeDM2 2026, Jancev 2024 (PMID 38363342) |

**Cibles (Battelino 2019).** Standard : TIR > 70 %, TBR < 4 % (< 70 mg/dL) et < 1 % (< 54), TAR < 25 % (> 180)
et < 5 % (> 250), CV ≤ 36 %, sur ≥ 14 jours / ≥ 70 % de données. **Assouplies** (âgé / haut risque) : TIR >
50 %, TBR < 1 %. Les cibles ont **évolué** (le référentiel SFD 2017 visait TIR 60 %) — à afficher comme
repères d'interprétation, non comme objectifs validés sur les complications.

**Preuve clinique.** MOBILE (DT2 sous basale seule) : HbA1c **−0,4 %**, TIR **+15 points** (substituts) ;
FreeDM2 2026 (DT2 sous basale + iSGLT2/GLP-1) : HbA1c −0,6 % / −0,5 %, hypoglycémie sévère 0 vs 2 ; méta Jancev
: HbA1c −0,31 %, **hypoglycémie sévère RR 0,66 NS**. **Aucune preuve sur les complications dures ni la
mortalité.** L'utilité forte et consensuelle = **dépistage / prévention de l'hypoglycémie** et **aide à la
titration**. La réduction d'hospitalisations pour hypoglycémie sévère est un **signal observationnel**
(Nathanson, registre suédois, RR 0,51), non confirmé en ECR.

**Deux axes dans le moteur.** *Axe CONTRÔLE* (TIR, TAR, GMI) : redondant avec l'HbA1c qui gate déjà →
interprétation + alertes seulement. *Axe SÉCURITÉ* (TBR, TBR sévère, CV > 36 %, hypo nocturnes) : critère
**dur** (EBM DEVOTE) → **gate** les recommandations de sécurité (réduire la dose, 2ᵉ génération, relâcher la
cible, désintensifier). Sans MCG : repli sur la **glycémie à jeun** (titration) et les **profils capillaires
6-7 points** (intensification).

**Interprétation → décision (lecture de l'AGP).** TBR élevé / hypo nocturne → ↓ basale, 2ᵉ génération,
relâcher la cible ; glycémie à jeun / TAR nocturne, phénomène de l'aube → titrer la basale ; glycémie à jeun à
la cible mais TAR diurne / TIR bas → écart prandial → GLP-1 puis bolus ; hypo post-prandiale → ↓ bolus ; CV >
36 % → instabilité, ne pas sur-titrer.

## 6. Doses — aide au calcul (§8-7)

Le nœud aide au **calcul** (pas seulement au conseil) à partir du **poids** et des **doses actuelles** :

- **Initiation** : poids × 0,1-0,2 U/kg/j (repli fixe 10 U). *Ratio affiché ici, calcul câblé au formulaire.*
- **Majoration** : +2 U (glycémie à jeun 3 matins au-dessus de la cible) ou +10-20 % par paliers si dose > 40 U.
- **Diminution** (hypoglycémie) : −2 à −4 U ou −10-20 % de la dose actuelle.
- **Basal-plus** : ≈ 10 % de la dose basale actuelle (ou 4 U) au repas principal.
- **Over-basalisation** : repère dose basale / poids > 0,5 U/kg (dérivé `over_basalisation`) → basculer vers
  GLP-1 / bolus plutôt que monter la basale. *Repère non validé par ECR (`[À VÉRIFIER]`).*

Périmètre : basale → basal-bolus (médecine générale) ; **hors** ratios glucides-insuline / facteur de
sensibilité formels et pompe / boucle fermée.

## 7. Sécurité cardiovasculaire & garde-fous de voix

**ORIGIN** (glargine vs soins standard, n=12 537, 6,2 ans, PMID 22686416) : MACE **HR 1,02 (0,94-1,11)**,
mortalité **HR 0,98**, **cancer HR 1,00** (aucun sur-risque) — **CV-neutre**, confirmé par l'extension
**ORIGINALE** (PMID 26681720), au prix de ~3× plus d'hypoglycémie sévère (1,00 vs 0,31/100 pers.-an) et de
~+2 kg. **Garde-fous** : ✗ ne jamais revendiquer un bénéfice CV / de mortalité pour l'insuline ; ✗ ne pas
présenter les cibles de TIR comme des critères durs ; ✗ ne pas banaliser prandial/prémix systématique ;
distinguer partout **contrôle & métriques de MCG (substituts obtenus)** vs **hypoglycémie sévère & complications
(critères durs)**.

## 8. Reco officielle vs position critique — divergences

**Reco officielle.** Toutes placent l'insuline en dernier, après les non-insulines à bénéfice cardio-rénal.
Ancrage français affiché = **SFD 2025** (Avis 18 : basale ; 18 bis : analogue lent > NPH, U300/degludec si
risque hypo ; 19 : GLP-1 préféré à l'insuline intensifiée, basal-plus > prémix ; 21 : désintensification ;
23 : MCG remboursée si insuline, primoprescription MG). ADA 2026 : GLP-1 avant l'insuline (rec 9.21), MCG grade
A (rec 7.15).

**Position critique** (ebmfrance, Prescrire, Médicalement Geek) — affichée à côté. L'objectif reste d'éviter
les complications : l'insuline corrige la glycémie et prévient le microvasculaire (extrapolé) mais n'a aucun
bénéfice CV (ORIGIN) ; prandial/prémix systématique non fondé sur les preuves ; les cibles de TIR sont un
consensus / un substitut, et **aucune métrique ne prédit fiablement l'hypoglycémie** → vigilance
surtraitement, surtout chez l'âgé.

**Divergences (deux frictions).** (1) **HAS 2024** (R.88, grade AE) admet le **prémix** à parité avec le
basal-bolus et reste **muette sur la 2ᵉ génération** et sur « le GLP-1 avant le bolus », là où ebmfrance/SFD
l'écartent ou l'énoncent. (2) **MCG / TIR** : axe **SFD 2025 / ADA 2026 technophile** (MCG grade A, délivrance
automatisée désormais proposée en DT2, **fort conflit d'intérêt dispositifs**) vs **HAS réservée** (pas de
cible TIR) et **position critique** (consensus / substitut, surtraitement). Sur le reste (basale + oraux/GLP-1,
insuline en dernier, 2ᵉ génération pour l'hypo, GLP-1 avant le bolus), **SFD 2025 converge avec l'EBM**.

*Réserves red-team (sources écartées).* La position « **Prescrire tient la NPH pour référence** » et la
« **position CMG** » attribuées par OpenEvidence sont **des inventions non sourcées** : Prescrire ne traite pas
la hiérarchie NPH / analogues dans nos sources, et il n'existe pas de prise de position CMG dédiée (la seule
source généraliste réelle est Joubert 2025, favorable à la MCG). Elles ne sont pas encodées.

## 9. Incertitudes

- MCG : cibles = consensus ; lien TIR-complications observationnel ; bénéfice en DT2 sur substituts, sans
  preuve sur critères durs ni mortalité.
- Bénéfice microvasculaire de l'insuline = extrapolé du contrôle glycémique, non démontré par un essai dédié.
- Seuil d'over-basalisation 0,5 U/kg = repère non validé par ECR.
- 2ᵉ génération : hypoglycémie sévère démontrée pour degludec vs glargine U100 seulement ; 1ʳᵉ génération vs
  NPH non significative ; pas de supériorité inter-2ᵉ-génération.
- Associations fixes : bénéfice substitutif, aucun CVOT dédié.
- Câblage formulaire (P3) : dérivés, calcul des doses, tooltips AGP, variable `hypo_severe_recurrente`.

## Sources (PMID/DOI vérifiés — red-team B1/B2/B3)

- **ORIGIN** — Gerstein HC et al., *N Engl J Med* 2012;367(4):319-28. PMID 22686416 · DOI 10.1056/NEJMoa1203858.
- **ORIGINALE** — ORIGIN Trial Investigators, *Diabetes Care* 2016;39(5):709-16. PMID 26681720.
- **DEVOTE** — Marso SP et al., *N Engl J Med* 2017;377(8):723-32. PMID 28605603 · DOI 10.1056/NEJMoa1615692.
- **SWITCH 2** — Wysham C et al., *JAMA* 2017;318(1):45-56. PMID 28672317 · DOI 10.1001/jama.2017.7117.
- **BRIGHT** — Rosenstock J et al., *Diabetes Care* 2018;41(10):2147-54. PMID 30104294 · DOI 10.2337/dc18-0559.
- **CONCLUDE** — Philis-Tsimikas A et al., *Diabetologia* 2020;63(4):698-710. PMID 31984443. (Commentaire : Del Prato, *Diabetologia* 2020.)
- **EDITION 1-2-3 poolée** — Ritzel R et al., *Diabetes Obes Metab* 2015;17(9):859-67. PMID 25929311.
- **Cochrane analogues vs NPH** — Semlitsch T et al., *Cochrane Database Syst Rev* 2020;11:CD005613.pub4. PMID 33166419.
- **Treat-to-Target** — Riddle MC, Rosenstock J, Gerich J. *Diabetes Care* 2003;26(11):3080-6. PMID 14578243.
- **Porcellati (méta poolée)** — Porcellati F et al., *Medicine (Baltimore)* 2017;96(5):e6022. PMID 28151905.
- **4T** — Holman RR et al., *N Engl J Med* 2007;357(17):1716-30 (PMID 17890232) ; 3 ans 2009;361(18):1736-47 (PMID 19850703).
- **DUAL VII** — Billings LK et al., *Diabetes Care* 2018;41(5):1009-16. PMID 29483185 · DOI 10.2337/dc17-1114.
- **Eng (méta GLP-1 + basale)** — Eng C et al., *Lancet* 2014;384(9961):2228-34. PMID 25220191.
- **Maiorino (méta)** — Maiorino MI et al., *Diabetes Care* 2017;40(4):614-24 (26 ECR). PMID 28325801.
- **FullSTEP** — Rodbard HW et al., *Lancet Diabetes Endocrinol* 2014;2(1):30-7. PMID 24622667.
- **Bertuol (NMA)** — Bertuol VC et al., *Diabetologia* 2026;69(5):1150-63. DOI 10.1007/s00125-025-06633-x.
- **Battelino / consensus TIR** — Battelino T et al., *Diabetes Care* 2019;42(8):1593-1603. PMID 31177185 · DOI 10.2337/dci19-0028.
- **Beck (validation TIR)** — Beck RW et al., *Diabetes Care* 2019;42(3):400-405. PMID 30352896.
- **Lu (TIR & mortalité, T2D)** — Lu J et al., *Diabetes Care* 2021;44(2):549-555. PMID 33097560.
- **MOBILE** — Martens T et al., *JAMA* 2021;325(22):2262-72. PMID 34077499 · DOI 10.1001/jama.2021.7444.
- **FreeDM2** — Wilmot EG et al., *Lancet Diabetes Endocrinol* 2026;14(6):463-74. DOI 10.1016/S2213-8587(26)00076-8.
- **Jancev (méta MCG DT2)** — Jancev M et al., *Diabetologia* 2024;67(5):798-810. PMID 38363342.
- **Nathanson (registre suédois)** — Nathanson D et al., *Diabetologia* 2025;68(1):41-51. PMID 39460755.
- **Reco** — SFD 2025 (Darmon P et al., *Méd. Mal. Métab.* 2025;19(8):630-662) ; HAS 2024 « Stratégie thérapeutique du DT2 » ; ADA *Standards of Care* 2026 (ch. 7 DOI 10.2337/dc26-S007 ; ch. 9 DOI 10.2337/dc26-S009) ; ADA/EASD 2022 (Davies MJ et al., PMID 36148880) ; AACE 2022 (PMID 35963508) / 2026 (Samson) ; Joubert M et al. 2025 (*Méd. Mal. Métab.* 19:331-347) ; ebmfrance/Duodecim « Insulinothérapie dans le DT2 » (ebm00491).
