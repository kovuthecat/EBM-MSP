# Traitement de 1re intention piloté par les comorbidités (DT2) — Argumentaire exhaustif

> **Niveau 3 — lecture exhaustive.** Destiné au professionnel qui veut le détail complet et toutes les
> sources. Les niveaux 1 (recommandation + avantages/inconvénients) et 2 (argumentaire détaillé) sont dans
> l'écran du nœud. Domaine : diabète de type 2 de l'adulte (hors DT1, grossesse). **Décompensation aiguë
> (cétose / hyperosmolarité) = hors périmètre → insuline + hospitalisation en urgence.** Dossier de méthode
> et de réconciliation : `docs/decision/noeuds/B-premiere-intention.md` (bi-agents + OpenEvidence + curation
> HAS / Médicalement Geek / SFD 2025 + Prescrire, avec passes de vérification).

## En bref

Sur un **socle de metformine + mesures d'hygiène de vie**, le choix des agents à ajouter est **piloté par
les comorbidités cardio-rénales-métaboliques**, car le bénéfice des **iSGLT2** et des **agonistes du GLP-1**
est démontré sur des **critères durs indépendamment de l'HbA1c**. Points-clés vérifiés :

- **iSGLT2** = **insuffisance cardiaque + néphroprotection**, **PAS athérome** (IDM et AVC non réduits). La
  mortalité n'est solidement démontrée que pour l'**empagliflozine en prévention secondaire** ; l'effet
  **HHF + rénal est un effet de classe** (retrouvé même avec l'ertugliflozine, neutre par ailleurs sur le
  MACE — VERTIS CV). Bénéfice concentré chez les patients avec **IC, MRC ou maladie CV établie** ; **faible
  ou nul** en prévention primaire à bas risque sans IC ni MRC.
- **AR GLP-1** = bénéfice **vasculaire/athéromateux** (surtout **AVC**, puis mort CV, puis IDM), hétérogène
  selon la molécule ; **quasi nul sur l'insuffisance cardiaque**. Bénéfice **prouvé molécule par molécule**
  (liraglutide, sémaglutide, dulaglutide) — le **lixisénatide et l'exénatide LP sont neutres** et exclus.
  Néphroprotection **dure** = **sémaglutide** en maladie rénale (FLOW).
- **Tirzépatide** (AR GIP/GLP-1) : bénéfice CV par **non-infériorité au dulaglutide** (SURPASS-CVOT), pas de
  supériorité ni de CVOT contre placebo ; atout propre = efficacité **HbA1c + poids** supérieure.
- **Metformine** : **base par défaut** (tolérance, absence d'hypoglycémie, coût, recul), mais **bénéfice sur
  critères durs de niveau de preuve faible / non concluant** (à ne pas afficher comme « bénéfice CV prouvé »).
- **Sulfamides et gliptines** : **pas de bénéfice d'organe** → place résiduelle (nœud D), pas de 1re intention.

## La question (PICO)

- **P** — adulte DT2 sous metformine + mesures d'hygiène de vie.
- **I** — ajout d'un iSGLT2 / d'un AR GLP-1 / d'un AR GIP-GLP-1 (tirzépatide) ; ou insuline d'initiation.
- **C** — placebo / *standard care* (la plupart des essais), ou comparateur actif (SURPASS-CVOT).
- **O** — critères **DURS** : mortalité toutes causes et CV, IDM, AVC, hospitalisation pour insuffisance
  cardiaque, progression rénale / insuffisance rénale terminale ; vs substitution (HbA1c, poids).

## Gate d'initiation — insuline d'emblée

- **Décompensation** (hyperosmolarité **ou** cétose : cétonurie/cétonémie pathologique, pouvant révéler un
  DT1) → **insuline indispensable + hospitalisation** ; hors algorithme ambulatoire. L'**iSGLT2 est
  contre-indiqué** (risque d'acidocétose).
- **HbA1c ≥ 10 % avec catabolisme** (amaigrissement involontaire, cétose) → traitement incluant l'**insuline**
  (souvent **transitoire**, relais secondaire) + avis spécialisé. **Sans catabolisme**, l'insuline n'est
  **pas obligatoire** : un **AR GLP-1 / tirzépatide (± insuline basale)** est de plus en plus préféré (ADA
  2026, NEJM 2025 ; essai SIMPLE : AR GLP-1 + basale **supérieur** au basal-bolus).
- **Niveau de preuve du gate** : la **nécessité en cas de décompensation/cétose** est un **accord d'experts
  (Grade E)** — un ECR contre placebo y serait non éthique. L'**insulinothérapie intensive initiale
  transitoire** (visée rémission) a des ECR (Weng 2008, méta Kramer 2013) **mais sur critères intermédiaires
  seulement** (rémission sans médicament, fonction bêta-cellulaire), **non durables** (~42 % à 2 ans, ~10 % à
  5 ans), en **populations est-asiatiques maigres** peu transposables, sans comparaison à un AR GLP-1/iSGLT2
  d'emblée. → **option à preuve faible** ; la rémission par **perte de poids** (DiRECT, population européenne,
  ~46 %/36 % à 1/2 ans sans insuline ni hypoglycémie) est **mieux validée** pour ce phénotype (voir nœud H).

## iSGLT2 — bénéfice sur l'insuffisance cardiaque et le rein

**Matrice (HR [IC95 %], sources primaires vérifiées)** :

| Essai (molécule) | Population | Mort. tot. | Mort CV | MACE-3 | IDM | AVC | Hosp. IC | Rénal | NNT publié |
|---|---|---|---|---|---|---|---|---|---|
| EMPA-REG (empa) | 100 % MCV établie | 0,68 [0,57–0,82] | 0,62 [0,49–0,77] | 0,86 [0,74–0,99] | 0,87 ns | 1,24 ns | 0,65 [0,50–0,85] | 0,61 [0,53–0,70] | — (ARR) |
| CANVAS (cana) | 66 % 2de | 0,87 ns | 0,87 ns | 0,86 [0,75–0,97] | 0,85 ns | 0,90 ns | 0,67 [0,52–0,87] | 0,60 [0,47–0,77] | — |
| DECLARE (dapa) | 59 % prév. 1re | 0,93 ns | 0,98 ns | **0,93 [0,84–1,03] NS** | 0,89 ns | 1,01 ns | 0,73 [0,61–0,88] | 0,76 [0,67–0,87] | — |
| CREDENCE (cana) | DT2 + macroalb. | 0,83 ns | 0,78 [0,61–1,00] | 0,80 [0,67–0,95] | — | — | 0,61 [0,47–0,80] | **0,70 [0,59–0,82]** | 22 [15–38] / 2,5 a |
| DAPA-CKD (dapa) | MRC (67 % DT2) | 0,69 [0,53–0,88] | 0,81 ns | — | — | — | 0,71 [0,55–0,92] | **0,61 [0,51–0,72]** | **19 [15–27]** / 2,4 a |
| EMPA-KIDNEY (empa) | MRC (46 % DT2), DFG 20–90 | 0,87 ns | 0,84 ns | — | — | — | 0,84 ns | **0,72 [0,64–0,82]** | — (ARR) |
| DAPA-HF (dapa) | IC FE réduite | 0,83 [0,71–0,97] | 0,82 [0,69–0,98] | — | — | — | 0,70 [0,59–0,83] | 0,71 ns | ~21 / 18 mois |
| EMPEROR-Reduced (empa) | IC FE réduite | 0,92 ns | 0,92 ns | — | — | — | 0,69 [0,59–0,81] | ~0,50 | **19 [13–37]** / 16 mois |
| EMPEROR-Preserved (empa) | IC FE préservée | 1,00 | 0,91 ns | — | — | — | 0,71 [0,60–0,83] | 0,95 ns | **31 [20–69]** / 26 mois |
| **VERTIS CV (ertu)** | 100 % MCV établie | 0,93 | 0,92 | **0,97 [0,85–1,11]** | ~1,0 | ~1,0 | **0,70 [0,54–0,90]** | 0,81 ns | — |

**Lecture.** (1) Le bénéfice ne porte **jamais** sur l'IDM ni l'AVC isolés — c'est un bénéfice
d'**hospitalisation pour insuffisance cardiaque** (HR 0,61–0,73 dans les 9 essais) et de **néphroprotection**
(HR 0,56–0,76), pas d'anti-athérothrombose. (2) La **mortalité** n'est significative isolément que pour
l'**empagliflozine** (EMPA-REG, prévention secondaire), la dapagliflozine (DAPA-CKD, DAPA-HF) — **pas** pour
la canagliflozine ni en HFpEF ; **VERTIS CV (ertugliflozine) est neutre sur MACE et mortalité** tout en
réduisant l'HHF → **HHF/rénal = effet de classe ; mortalité/MACE = molécule-spécifique** (règle D12 :
nommer la molécule). (3) En **prévention primaire à bas risque** (DECLARE, sous-groupe sans MCV : MACE 1,01),
**pas de bénéfice MACE** ; le bénéfice IC/rénal, lui, **existe indépendamment du statut athérothrombotique**
(effet identique chez diabétiques et non-diabétiques). (4) **Seuil d'initiation DFG ≥ 20** (KDIGO 2024 :
initier ≥ 20, ne pas initier en dessous, **poursuivre jusqu'à dialyse** si déjà en cours). **Effets
indésirables** : mycoses génitales, déplétion volémique, **acidocétose euglycémique** (suspendre en
jeûne/chirurgie/sepsis) ; **amputations = signal canagliflozine/CANVAS** isolé, non répliqué.

## AR GLP-1 et tirzépatide — bénéfice vasculaire/athéromateux

| Essai (molécule) | Population | MACE-3 | Composante motrice | Mort. tot. | Rénal | NNT |
|---|---|---|---|---|---|---|
| LEADER (liraglutide) | 81 % MCV établie | 0,87 [0,78–0,97] | **mort CV 0,78** (IDM/AVC NS) | 0,85 [0,74–0,97] | albuminurie (0,78) | ~53 / 3,8 a |
| SUSTAIN-6 (séma SC) | ~83 % haut risque | 0,74 [0,58–0,95] | **AVC 0,61** | 1,05 ns | albuminurie 0,64 | ~43 |
| REWIND (dulaglutide) | 31 % MCV / 69 % prév. 1re | 0,88 [0,79–0,99] | **AVC 0,76** | 0,90 ns | albuminurie 0,77 | ~18 (MCV) / ~60–70 (1re) |
| PIONEER-6 (séma oral) | 85 % | 0,79 [0,57–1,11] NS | — (non-infériorité) | 0,51 (exploratoire) | — | — |
| SOUL (séma oral) | 100 % ASCVD/IRC | 0,86 [0,77–0,96] | **IDM 0,74** | 0,91 [0,80–1,02] ns | composite rénal ns | ~50 |
| FLOW (séma SC, rénal) | DT2 + IRC | 0,82 (secondaire) | rénal + mort CV 0,71 | 0,80 [0,67–0,95] | **0,76 [0,66–0,88] (critère principal DUR)** | ~22 rénal |
| SURPASS-CVOT (tirzé vs dulaglutide) | 100 % ASCVD | **0,92 [0,83–1,01] NI, PAS supériorité (p=0,09)** | — | 0,84 [0,75–0,94] | rénal 0,77 [0,68–0,88] | — |

**Lecture.** (1) Le bénéfice est **vasculaire mais hétérogène par composante** : AVC (SUSTAIN-6, REWIND),
mort CV (LEADER), IDM (SOUL) — jamais les trois ensemble ; au niveau de la classe, l'effet le plus fort est
sur l'**AVC (−17 %)**, puis la mort CV, puis l'IDM (Sattar 2021). **Complémentaire des iSGLT2** : les AR GLP-1
sont **quasi nuls sur l'insuffisance cardiaque** (sauf FLOW, population IRC). (2) **Effet de classe pour les
molécules à longue durée d'action** (liraglutide, sémaglutide SC/oral, dulaglutide), **hors lixisénatide
(ELIXA neutre) et exénatide LP (EXSCEL non supérieur)**. (3) **Rénal dur = seulement FLOW** (sémaglutide,
population IRC) ; LEADER/REWIND réduisent la **macroalbuminurie** (substitution), pas les critères rénaux
durs. (4) **Tirzépatide** : bénéfice CV par **non-infériorité au dulaglutide**, pas de supériorité (p=0,09)
ni de CVOT contre placebo ; sa mortalité toutes causes (0,84) est un critère secondaire soumis à une
hiérarchie de test compromise par l'échec de la supériorité du principal. Atout = **HbA1c + poids**.
(5) **Prévention primaire vs secondaire** : REWIND montre un bénéfice relatif même en prévention primaire,
mais l'**ampleur absolue** y est faible (NNT ~60–70 vs ~18 en prévention secondaire). **Effets indésirables**
(Prescrire) : digestifs, lithiases biliaires, pancréatites, **cancers thyroïde/pancréas non tranchés**,
signal de **gestes suicidaires** (revue EMA), **NAION** avec le sémaglutide, aggravation d'une rétinopathie
si baisse rapide de l'HbA1c.

## Metformine — socle, mais preuve dure faible

Le bénéfice de la metformine sur des **critères cliniques durs** repose quasi exclusivement sur un **unique
sous-groupe ECR ouvert** (UKPDS 34, n = 342, surpoids), avec un « effet legacy » persistant à 24 ans (UKPDS
91 : mortalité RRR 20 % / ARR 4,9 %, IDM RRR 31 % / ARR 6,2 %) mais issu d'un **suivi observationnel**
post-essai. Les **méta-analyses restreintes aux comparaisons contre placebo** ne trouvent **aucun** bénéfice
significatif : **Griffin 2017** (mortalité 0,96 ; mort CV 0,97 ; IDM 0,89 ; AVC 1,04) et **Boussageon 2012**
(tous non significatifs ; hors UKPDS l'effet disparaît). En **prédiabète**, le DPP/DPPOS (21 ans) ne montre
**aucun bénéfice CV** (MACE 1,03). Les méta « favorables » (Monami 2021, MACE 0,52) reposent sur **2 essais**
dont un contre sulfamide. **Verdict : niveau de preuve FAIBLE / non concluant** — la 1re intention se justifie
par la **tolérance, l'absence d'hypoglycémie, la neutralité pondérale, le coût et le recul**, **pas** par une
réduction d'événements durs. Un CVOT metformine vs placebo est aujourd'hui **éthiquement impossible** dans le
DT2 (standard of care). **Position Prescrire** : metformine « **semble** prévenir certaines complications et
diminuer la mortalité », mais **preuves fragiles**. CI : **DFG < 30** (+ IC décompensée, IDM récent) ;
intolérance digestive ~15 %.

## Pourquoi PAS de sulfamides ni de gliptines en 1re intention

Distinction sémantique officielle **SFD** (Tableau III) : iSGLT2/GLP-1 = « **bénéfices démontrés** »
(supériorité, critère dur) ; metformine/SU/gliptines = « **sécurité démontrée** » (non-infériorité, **pas de
bénéfice d'organe**). C'est ce qui **relègue** SU et gliptines.

- **Gliptines (iDPP4)** : les 5 CVOT (SAVOR, TECOS, EXAMINE, CARMELINA, CAROLINA) sont tous en
  **non-infériorité** — MACE neutre, **rénal neutre** (CARMELINA 1,04). Le **signal d'hospitalisation pour
  insuffisance cardiaque est propre à la saxagliptine** (SAVOR HR 1,27) ; la sitagliptine (TECOS) et la
  linagliptine (CARMELINA) sont **neutres**. Poids-neutres, faible risque hypoglycémique, bien tolérées.
  → L'argument n'est **pas** la dangerosité mais le **coût d'opportunité** : pourquoi un agent **sans
  bénéfice d'organe** quand iSGLT2/GLP-1 en ont un ? La **sitagliptine** garde une place (innocuité CV
  démontrée) quand iSGLT2/GLP-1 ne sont pas souhaitables.
- **Sulfamides** : **aucun bénéfice CV/rénal propre** (UKPDS 33 : IDM p = 0,052 ; ADVANCE : bénéfice rénal via
  la **cible glycémique**, pas la molécule). **Hypoglycémie sévère** (CAROLINA : 0,45 vs 0,07 / 100
  patients-années sous linagliptine ; cumul 17,9 %), **prise de poids ~+1,5 kg**, **durabilité médiocre**.
  La thèse de **surmortalité est contestée** : l'ECR **CAROLINA** (glimépiride vs linagliptine) est **neutre**
  (MACE 0,98) ; les données **observationnelles** sont défavorables (Roumie 2012 composite CV **HR 1,21** ;
  décès CV **1,76**) mais sujettes à confusion par indication, et le signal se concentre sur le
  **glibenclamide** (à ne plus utiliser). Hiérarchie : **glibenclamide le pire**, **gliclazide le meilleur**.
- **Position critique Prescrire** (plus dure que la SFD/HAS) : « les gliptines et la pioglitazone sont des
  médicaments **plus dangereux qu'utiles, à écarter des soins, quelle que soit la situation** » — à afficher
  à côté de la place résiduelle SFD (désaccord reco ↔ critique). Développement complet : **nœud D**.

## Priorité iSGLT2 vs AR GLP-1, et association

Il n'existe **aucun ECR tête-à-tête** sur critères durs. La différenciation repose sur des **méta-analyses en
réseau** concordantes (Zelniker Circ 2019, Palmer BMJ 2021, Drake ACP 2024) : **iSGLT2 supérieur pour l'IC et
le rénal**, **AR GLP-1 supérieur pour l'AVC/athérome**. D'où un **affichage par critère dominant** (décision
référent, pas une hiérarchie prouvée) : **IC / maladie rénale → iSGLT2** en tête ; **maladie athéromateuse /
obésité → AR GLP-1** en tête. L'**association iSGLT2 + AR GLP-1** a un signal **additif** (Neuen Circ 2024,
absence d'interaction ; cohortes Simms-Williams, Colombijn) mais de **preuve faible** (observationnel +
sous-groupes) ; l'essai **PRECIDENTD** (en cours) la testera directement.

## Recommandation officielle vs position critique

- **Reco officielle** — **SFD 2025** (Avis n° 1) et **HAS 2024 (grade A)** : sur un socle metformine + mode de
  vie, en cas de **maladie CV établie, insuffisance cardiaque ou maladie rénale chronique**, prescrire
  d'emblée un **iSGLT2 ou un AR GLP-1 (ou tirzépatide) ayant fait la preuve du bénéfice, quel que soit
  l'HbA1c** ; en cas d'**obésité (IMC ≥ 30) / MASLD-MASH**, un AR GLP-1 ou tirzépatide. La HAS raisonne **par
  classe** (sans nommer de molécule ni fixer de seuil DFG dans la RBP).
- **Position critique** — **Prescrire** : quand la metformine ne suffit pas, ajouter un **AR GLP-1**
  (sémaglutide/dulaglutide 1er choix) est « le plus souvent le premier choix », surtout si risque CV élevé ;
  la **dapagliflozine** (voire empagliflozine) si IC ou insuffisance rénale modérée avec protéinurie ; le
  bénéfice des GLP-1 est jugé **« peut-être »** et **fragile** (LEADER), la balance grevée d'effets
  indésirables ; le **tirzépatide n'est pas supérieur au dulaglutide** (SURPASS-CVOT).
- **Divergence** : **faible sur le ciblage** (IC/MRC/MCV/obésité = consensus), **modérée sur le discours** —
  le « bénéfice cardiovasculaire » des iSGLT2 recouvre surtout de l'**IC et du rénal**, pas de
  l'athérothrombose ; en **prévention primaire à bas risque sans IC ni MRC**, le bénéfice dur est faible/nul,
  d'où la prudence face au sur-traitement.

## Incertitudes

- Priorité iSGLT2 vs AR GLP-1 quand les deux sont indiqués (pas d'ECR tête-à-tête ; méta-analyses en réseau).
- Bénéfice de l'**association** iSGLT2 + AR GLP-1 : observationnel + sous-groupes (PRECIDENTD en cours).
- Effet-classe vs molécule de la mortalité (iSGLT2) et du signal d'IC (gliptines).
- Tirzépatide : pas de CVOT contre placebo ; bénéfice CV par non-infériorité au dulaglutide seulement.
- Insuline initiale « rémission » : critère intermédiaire, non durable, peu transposable au patient européen.
- Innocuité CV des sulfamides modernes (un seul CVOT dédié, glimépiride) ; observationnel discordant.
- Composite cardio-rénal élargi de SURPASS-CVOT : libellé / IC à confirmer sur le texte intégral (NEJM).

## Sources (liste complète)

**iSGLT2** — EMPA-REG OUTCOME (NEJM 2015, DOI 10.1056/NEJMoa1504720) · CANVAS (NEJM 2017, 10.1056/NEJMoa1611925)
· DECLARE-TIMI 58 (NEJM 2019, 10.1056/NEJMoa1812389) · CREDENCE (NEJM 2019, 10.1056/NEJMoa1811744) · DAPA-CKD
(NEJM 2020, 10.1056/NEJMoa2024816) · EMPA-KIDNEY (NEJM 2023, 10.1056/NEJMoa2204233) · DAPA-HF (NEJM 2019,
10.1056/NEJMoa1911303) · EMPEROR-Reduced (NEJM 2020, 10.1056/NEJMoa2022190) · EMPEROR-Preserved (NEJM 2021,
10.1056/NEJMoa2107038) · VERTIS CV (NEJM 2020, 10.1056/NEJMoa2004967).

**AR GLP-1 / tirzépatide** — LEADER (NEJM 2016, 10.1056/NEJMoa1603827) · SUSTAIN-6 (NEJM 2016,
10.1056/NEJMoa1607141) · REWIND (Lancet 2019, 10.1016/S0140-6736(19)31149-3) · PIONEER-6 (NEJM 2019,
10.1056/NEJMoa1901118) · SOUL (NEJM 2025, 10.1056/NEJMoa2501006) · FLOW (NEJM 2024, 10.1056/NEJMoa2403347) ·
SURPASS-CVOT (NEJM 2025, 10.1056/NEJMoa2505928 ; volet rénal Zoungas, Lancet Diabetes Endocrinol 2026) ·
Sattar (méta, Lancet Diabetes Endocrinol 2021, 10.1016/S2213-8587(21)00203-5) · ELIXA (lixisénatide, NEJM
2015) · EXSCEL (exénatide LP, NEJM 2017).

**Metformine** — UKPDS 34 (Lancet 1998) · UKPDS 91 (Lancet 2024, 10.1016/S0140-6736(24)00537-3) · Griffin 2017
(Diabetologia, 10.1007/s00125-017-4337-9) · Boussageon 2012 (PLoS Med, 10.1371/journal.pmed.1001204) · Monami
2021 (NMCD, 10.1016/j.numecd.2020.11.031) · DPP/DPPOS 2022 (Circulation, 10.1161/CIRCULATIONAHA.121.056756).

**Sulfamides / gliptines** — SAVOR-TIMI 53 (NEJM 2013, 10.1056/NEJMoa1307684) · TECOS (NEJM 2015,
10.1056/NEJMoa1501352) · CARMELINA (JAMA 2019, 10.1001/jama.2018.18269) · CAROLINA (JAMA 2019,
10.1001/jama.2019.13772) · Simpson (méta NMA, Lancet Diabetes Endocrinol 2015, 10.1016/S2213-8587(14)70213-X)
· Roumie (Ann Intern Med 2012 ; JAHA 2017).

**Insuline initiale** — Weng 2008 (Lancet, 10.1016/S0140-6736(08)60762-X) · Kramer 2013 (méta, Lancet Diabetes
Endocrinol, 10.1016/S2213-8587(13)70006-8) · RESET-IT (Diabetes Obes Metab 2021, 10.1111/dom.14421) · SIMPLE
(Diabetes Obes Metab 2019, 10.1111/dom.13794) · DiRECT (Lancet 2018, 10.1016/S0140-6736(17)33102-1).

**Recommandations** — **SFD 2025** (Prise de position, *Med Mal Metab* 2025;19:630-662, 10.1016/j.mmm.2025.10.002)
· **HAS 2024** (Stratégie thérapeutique du DT2, RBP) · ADA *Standards of Care* 2026 · KDIGO 2022/2024 ·
ADA/EASD 2022.

**Position critique** — **Prescrire** (résumé uniquement, droit d'auteur) : « Diabète de type 2 chez un adulte »
(Premiers Choix, févr. 2026) ; « Quand la metformine ne suffit pas » (Rev Prescrire 2023;43(478):595-605) ;
liraglutide (2026;46(512):429) ; tirzépatide/SURPASS-CVOT (2026;46(512):455) ; FLOW (2025;45(500):455).
Synthèses dans `docs/decision/sources/prescrire-dt2.md`. **Médicalement Geek / DragiWebdo** (EBM francophone).

---

*Contenu VALIDÉ par le référent (2026-07-23) après dossier de preuve bi-agents + OpenEvidence + vérifications
(triangulation). Certains chiffres (NNT, composites secondaires) sont des ordres de grandeur ; un `[À VÉRIFIER]`
résiduel non décisionnel subsiste sur le composite élargi de SURPASS-CVOT (texte intégral NEJM).*
