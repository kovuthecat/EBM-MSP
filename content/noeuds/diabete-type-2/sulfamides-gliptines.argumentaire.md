# Sulfamides & gliptines : place résiduelle — argumentaire détaillé

> **Niveau 3 de lecture** (recommandation → argumentaire détaillé → *argumentaire exhaustif*). Document autonome
> tiré du dossier de preuve `docs/decision/noeuds/D-sulfamides-gliptines.md` (triangulation 5 agents A ×
> OpenEvidence × red-team B réconcilié ; chaque PMID/chiffre décisionnel vérifié contre la source primaire).
> **Dernier nœud du domaine DT2.**

## 1. Le message central : deux classes sans bénéfice dur

Ce nœud ne cherche **pas** « quel traitement pour son bénéfice » — c'est le rôle des nœuds B (1re intention) et
C (intensification), pilotés par la metformine et les classes à bénéfice cardio-rénal (iSGLT2, AR GLP-1). Il
répond à une autre question : **quand les sulfamides et les gliptines, deux classes anciennes sans bénéfice
démontré sur un critère dur, gardent-ils une justification, et à quelles conditions de sécurité ?**

Le fait structurant, concordant et de **niveau de preuve élevé** : **ni les sulfamides ni les gliptines n'ont
réduit un critère dur** (mortalité, infarctus, AVC, insuffisance cardiaque, événement rénal) dans les essais
dédiés.

- **Gliptines** — quatre essais de sécurité cardiovasculaire contre placebo, ~43 500 patients au total, tous
  **neutres sur le MACE** : SAVOR-TIMI 53 (HR 1,00), TECOS (HR 0,98), EXAMINE (HR 0,96), CARMELINA (HR 1,02).
  Ce sont des essais de **non-infériorité** : ils démontrent l'innocuité, **pas un bénéfice**.
- **Sulfamides** — aucun essai ne montre de bénéfice CV ou de mortalité. ADVANCE (contrôle intensif à base de
  gliclazide MR) ne réduit que la **néphropathie** (HR 0,79), sans effet macrovasculaire (HR 0,94, NS) ni de
  mortalité (HR 0,93, NS) ; UKPDS 33 : bénéfice **microvasculaire** (surtout photocoagulation, un substitut),
  IDM non significatif à l'époque, pas d'effet sur la mortalité liée au diabète.

Corollaire décisionnel : **quand le choix de ces classes se pose, il ne repose que sur la sécurité et la
tolérance**, jamais sur une efficacité clinique dure.

## 2. Quand ce nœud s'applique — le déclencheur

L'algorithme propose une place résiduelle **seulement si `classes_a_benefice_indisponibles` est vrai**, c'est-à-dire
si **les iSGLT2 ET les AR GLP-1 sont tous deux contre-indiqués, non tolérés ou refusés**. Tant que l'une de ces
classes à bénéfice cardio-rénal est utilisable, elle est préférée — l'outil renvoie aux nœuds B/C.

Deux précisions de modélisation :

- **Le refus des injectables ne suffit pas** à ouvrir cette place résiduelle : il retire l'AR GLP-1 (injectable),
  mais l'**iSGLT2 est oral et conserve son bénéfice cardio-rénal** — il reste préférable. Le déclencheur exige
  que l'iSGLT2 soit *aussi* écarté.
- **Le coût n'est pas un critère en France.** Les sulfamides et les gliptines y sont remboursés ; l'argument
  « bon marché » du sulfamide est propre à d'autres systèmes de santé (le flowchart Duodecim/ebmfrance le range
  d'ailleurs dans une branche « price decisive » explicitement calée sur le système de remboursement finlandais).

## 3. La hiérarchie : gliptine préférée au sulfamide

Quand la place résiduelle s'ouvre, deux options s'affichent, la **gliptine en priorité 1**, le **sulfamide en
priorité 2** — conforme à l'ordre des recommandations françaises (HAS 2024, SFD 2025 : iDPP4 avant sulfamide) et
au flowchart Duodecim/ebmfrance.

Pourquoi la gliptine devant ? À **efficacité glycémique équivalente en tête-à-tête** — l'écart n'est que de
**0,08 % d'HbA1c** (Zhou 2016, 14 essais ; le « sulfamide 1-1,5 % vs gliptine 0,5-0,8 % » reflète surtout une
différence d'HbA1c de départ entre essais anciens et récents) — la gliptine **évite l'hypoglycémie et la prise de
poids**. C'est la démonstration directe de CAROLINA (linagliptine vs glimépiride) : hypoglycémie sévère **0,3 %
vs 2,2 %**, poids **−1,54 kg** en faveur de la gliptine, MACE identique (HR 0,98).

## 4. Option « gliptine » — matrice de preuve et molécule

**Effet attendu** : baisse d'HbA1c ~0,5-0,8 % (substitution) ; **aucun bénéfice sur critère dur**. Le seul gain
face au sulfamide est l'**absence d'hypoglycémie et de prise de poids**.

**Molécule = SITAGLIPTINE.** C'est la seule gliptine orale à **sécurité cardiovasculaire démontrée** (TECOS :
MACE HR 0,98 ; insuffisance cardiaque HR 1,00), disponible et remboursée en France, avec génériques, et
utilisable jusqu'en dialyse à dose réduite.

**Contrainte française décisive (disponibilité)** — vérifiée sur les avis HAS, la base ANSM et Vidal : sur les
cinq gliptines à AMM européenne, **seules trois ont été commercialisées en France** (sitagliptine, vildagliptine,
saxagliptine).

- **Linagliptine (Trajenta)** — *idéale* sur le plan rénal (aucune adaptation de dose, 5 mg à tous les stades y
  compris dialyse) — **n'a jamais été commercialisée ni remboursée en France**. Sa qualité rénale est donc
  **inapplicable en pratique française** : en insuffisance rénale, on utilise la **sitagliptine à dose adaptée**.
- **Alogliptine (Vipidia)** — jamais commercialisée en France.
- **Saxagliptine (Onglyza)** — **en retrait** (Komboglyze arrêté le 30/01/2026, SMR faible) et porteuse du signal
  d'insuffisance cardiaque → **écartée**.

**Le signal d'insuffisance cardiaque est LIMITÉ à la saxagliptine et à l'alogliptine** (SAVOR : HR 1,27, NNH ~143
sur 2,1 ans ; EXAMINE : signal post-hoc HR 1,76 chez les patients sans antécédent d'IC ; AHA/ACC/HFSA 2022 =
Classe III, *Harm*). **Ce n'est pas un effet de classe uniforme** : sitagliptine (HR 1,00) et linagliptine
(HR 0,90) sont neutres. En pratique française, ce garde-fou est **sans objet** puisque saxagliptine et alogliptine
ne sont pas/plus sur le marché — la sitagliptine, disponible, est neutre sur l'IC.

**Le profil d'effets indésirables des gliptines, à afficher honnêtement** (il fonde la position de Prescrire) :

| Effet indésirable | Nature & ampleur | Statut |
| --- | --- | --- |
| **Pemphigoïde bulleuse** | Effet de classe **établi** (Lee 2020 : HR 1,42 ; ≥ 65 ans HR 1,62 ; méta Phan OR 2,13 ; cas-témoins Benzaquen aOR 2,64, vildagliptine 3,57) | Réel — éruption bulleuse sous gliptine → évoquer, arrêter |
| **Arthralgies sévères** | Avertissement **FDA 2015**, classe entière | Réel — test d'arrêt si arthralgies inexpliquées |
| **Pancréatite aiguë** | Signal **faible mais significatif en méta-analyse** (Tkáč & Raz 2017 OR 1,79 ; Cochrane Kanie 2021 OR 1,63) ; risque **absolu ~0,13 %** | Signal réel de faible ampleur (chaque essai isolé était non significatif) |

**Règle dure** : ne **jamais associer** une gliptine à un AR GLP-1 (même voie incrétine, aucun bénéfice additif).

## 5. Option « sulfamide » — matrice de preuve et molécule

**Effet attendu** : baisse d'HbA1c ~1-1,5 % (substitution), la plus forte des deux classes ; **aucun bénéfice sur
critère dur**. On échange ce gain glycémique contre un **risque réel d'hypoglycémie** (jusqu'à 34-42 % de toute
hypoglycémie sous sulfamide — TOSCA.IT, CAROLINA) et une **prise de poids**.

**Les sulfamides modernes ne sont pas cardio-toxiques.** La vieille controverse « surmortalité des sulfamides »
ne résiste pas aux données modernes :

- **CAROLINA** (glimépiride vs linagliptine, 6,3 ans) : MACE **neutre entre les deux** (HR 0,98).
- **TOSCA.IT** (sulfamide vs pioglitazone) : composite dur **neutre** (HR 0,96).
- **GRADE** : pas de sur-risque de MACE propre au glimépiride.
- Le signal « surmortalité » vient des essais anciens (UGDP), de l'**observationnel** (où il s'explique par le
  *confounding* — Azoulay & Suissa 2017 : RR 1,06, non significatif après retrait des biais ; Douros 2018 :
  effet porté par l'arrêt de la metformine, pas par le sulfamide) et surtout du **glibenclamide**.

**Hiérarchie intra-classe (Simpson 2015, méta-réseau)** : par rapport au glibenclamide, le **gliclazide** a la
mortalité la plus basse (RR 0,65), le glimépiride intermédiaire (RR 0,83). D'où la **molécule : gliclazide MR ou
glimépiride, JAMAIS le glibenclamide** (hypoglycémies sévères et prolongées, métabolites actifs à élimination
rénale).

**Garde-fou de sécurité (dur, encodé)** : le sulfamide est **retiré si `DFG < 30`** (exclusion tracée). Ce seuil
est une **convention KDIGO/SFD** : les RCP français (gliclazide, glimépiride, glibenclamide) mentionnent une
contre-indication en « insuffisance rénale sévère » **sans seuil chiffré** ; le « glibenclamide contre-indiqué si
DFG < 60 » qui circule **n'est pas dans le RCP Daonil** (le seul repère du RCP est une élimination non altérée
tant que la clairance reste > 30). En insuffisance rénale légère à modérée : gliclazide à même dose sous
surveillance rapprochée, glimépiride à débuter à 1 mg/j.

## 6. Adaptation à la fonction rénale (RCP)

Seuils figés d'après les **RCP/SmPC** (base ANSM). ⚠ Les RCP mélangent DFG (sitagliptine) et clairance de la
créatinine (vildagliptine, glibenclamide) ; aux seuils 30-50, l'écart est faible ; l'algorithme raisonne en `DFG`.

| Molécule | Adaptation |
| --- | --- |
| **Sitagliptine** | DFG ≥ 45 → 100 mg ; 30-44 → **50 mg** ; < 30 (**dialyse incluse**) → **25 mg** |
| **Vildagliptine** | ClCr < 50 → **50 mg ×1/j** (alternative ; prudence en dialyse) |
| **Linagliptine** | *aucune adaptation* — mais **non commercialisée en France** (inapplicable) |
| **Gliclazide / glimépiride** | IR légère-modérée : dose réduite + surveillance ; **CI si DFG < 30** (convention) |
| **Glibenclamide** | **proscrit** (hypoglycémies prolongées) |

→ **En insuffisance rénale, en France, la gliptine de choix est la sitagliptine à dose adaptée** (jusqu'en
dialyse à 25 mg/j).

## 7. Reco officielle vs position critique — la divergence

**Reco officielle (convergente)** : HAS 2024, SFD 2025 et ADA/EASD 2022 s'accordent pour placer sulfamides et
gliptines en **2e/3e ligne non préférentielle**, derrière iSGLT2 et AR GLP-1, et pour **ranger la gliptine avant
le sulfamide**. HAS 2024 : le sulfamide « n'est plus la stratégie préférentielle » (R.61/R.69) ; la gliptine est
« l'option la plus simple pour la pratique clinique ». SFD 2025 : la **sitagliptine est le seul oral à sécurité
CV démontrée** (fallback athéromateux, Avis 11) ; éviter la saxagliptine. Ne jamais associer gliptine + AR GLP-1
(HAS R.80).

**Position critique** : **Prescrire** écarte les gliptines — « médicaments plus dangereux qu'utiles, à écarter
des soins, quelle que soit la situation » — et limite le sulfamide au dépannage (glibenclamide « effet modeste,
pas d'effet démontré sur la mortalité, très faible niveau de preuve »). **Médicalement Geek / DragiWebdo** rejoint
Prescrire. **L'ACP 2024** (grande recommandation nord-américaine) recommande **fortement de ne pas ajouter d'iDPP4
à la metformine** pour réduire la morbidité/mortalité — ce qui montre que **la divergence n'est pas
franco-française**.

**Divergence de degré, pas de fond** : aucune source — officielle comprise — ne revendique de bénéfice dur pour
ces classes. Les pôles se séparent sur **l'action** : les officiels les conservent en repli (gliptine valorisée) ;
la critique les écarte (gliptines) ou les limite (sulfamide). La divergence porte **spécifiquement sur les
gliptines**.

**Position raisonnée de l'outil** : place résiduelle **étroite, jamais préférentielle** ; gliptine (sitagliptine)
préférée au sulfamide ; reco officielle affichée **à côté** de la critique, divergence signalée. L'outil **conserve
une place « tolérance » à la gliptine** (divergence assumée avec Prescrire).

## 8. Contexte aigu — hors périmètre

Aucune source vérifiée ne fonde un usage transitoire « positif » des sulfamides ou des gliptines en situation
aiguë. En **hospitalisation**, l'**insuline est le pivot** (Endocrine Society 2022) ; en péri-opératoire, les
sulfamides/glinides sont **suspendus** (hypoglycémie) et les iSGLT2 arrêtés (acidocétose). *(L'énoncé selon lequel
l'ADA 2026 endosserait un sulfamide court dans l'hyperglycémie cortico-induite ambulatoire, remonté par
OpenEvidence, n'a pas été confirmé sur source primaire par le red-team → non outillé.)* Ce nœud n'outille donc pas
le contexte aigu ; une alerte transversale le rappelle.

## 9. Incertitudes

- Le déclencheur `classes_a_benefice_indisponibles` agrège un jugement clinique composite en un booléen ; le refus
  des injectables seul ne l'active pas (l'iSGLT2 oral reste préférable).
- Le sulfamide est encodé sur le même déclencheur que la gliptine mais en priorité 2 ; à confirmer si le référent
  préfère qu'il n'apparaisse que lorsque la gliptine est elle-même inadaptée.
- Le seuil d'arrêt du sulfamide (DFG < 30) est une convention KDIGO/SFD, non un seuil chiffré des RCP.
- La pancréatite des gliptines est un signal significatif en méta-analyse mais de très faible ampleur absolue.
- La disponibilité française des molécules est évolutive (saxagliptine en retrait).

## 10. Sources (avec DOI/PMID)

**Essais & méta-analyses (vérifiés contre source primaire, red-team B)** :

- SAVOR-TIMI 53 — Scirica, *NEJM* 2013;369:1317, PMID 23992601, doi:10.1056/NEJMoa1307684.
- TECOS — Green, *NEJM* 2015;373:232, PMID 26052984, doi:10.1056/NEJMoa1501352.
- EXAMINE — White, *NEJM* 2013;369:1327, PMID 23992602, doi:10.1056/NEJMoa1305889 (IC : Zannad, *Lancet* 2015).
- CARMELINA — Rosenstock, *JAMA* 2019;321:69, PMID 30418475, doi:10.1001/jama.2018.18269.
- CAROLINA — Rosenstock, *JAMA* 2019;322:1155, PMID 31536101, doi:10.1001/jama.2019.13772.
- ADVANCE — *NEJM* 2008;358:2560, PMID 18539916, doi:10.1056/NEJMoa0802987.
- TOSCA.IT — Vaccaro, *Lancet Diab Endocrinol* 2017;5:887, PMID 28917544, doi:10.1016/S2213-8587(17)30317-0.
- GRADE (glycémie) — Nathan, *NEJM* 2022;387:1063, PMID 36129996, doi:10.1056/NEJMoa2200433 ; (micro/CV) *NEJM*
  2022;387:1075, PMID 36129997, doi:10.1056/NEJMoa2200436 ; (CV) Green, *Circulation* 2024;149:993,
  doi:10.1161/CIRCULATIONAHA.123.066604.
- Simpson (mortalité intra-sulfamides) — *Lancet Diab Endocrinol* 2015;3:43, PMID 25466239.
- Rados (méta ECR + TSA) — *PLoS Med* 2016;13:e1001992, PMID 27071029, doi:10.1371/journal.pmed.1001992.
- Azoulay & Suissa (méta-régression observationnelle) — *Diabetes Care* 2017;40:706, PMID 28428321.
- ADOPT — Kahn, *NEJM* 2006;355:2427, PMID 17145742, doi:10.1056/NEJMoa066224.
- Zhou (tête-à-tête DPP-4i vs SU) — *Int J Clin Pract* 2016;70:132, PMID 26709610, doi:10.1111/ijcp.12761.
- Tkáč & Raz (pancréatite, méta CVOT) — *Diabetes Care* 2017;40:284, PMID 27659407, doi:10.2337/dc15-1707 ;
  Kanie (Cochrane NMA) 2021, doi:10.1002/14651858.CD013650.pub2.
- Lee (pemphigoïde bulleuse) — *JAMA Dermatol* 2020;156:1107, PMID 32697283, doi:10.1001/jamadermatol.2020.2158.

**Recommandations & sources critiques** :

- HAS 2024 « Stratégie thérapeutique du DT2 » (R.61/R.69/R.74/R.78/R.80).
- SFD 2025 — Darmon et al., *Med Mal Metab* 2025;19:630, doi:10.1016/j.mmm.2025.10.002 (Avis 10/11/16-17).
- ADA/EASD 2022 — Davies, *Diabetes Care* 2022;45:2753, PMID 36148880, doi:10.2337/dci22-0034.
- ACP 2024 — Qaseem, *Ann Intern Med* 2024;177:658, PMID 38639546, doi:10.7326/M23-2788.
- ebmfrance/Duodecim « Traitement global et suivi du DT2 » (flowchart ADA/EASD contextualisé France).
- Prescrire — Rev Prescrire 2023;43(478):595-605 [P3], 597 [P7] ; Premiers Choix févr. 2026 [P1] (résumé interne
  `docs/decision/sources/prescrire-dt2.md`, droit d'auteur).
