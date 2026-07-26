# Nœud F — Statine chez le diabétique   (dossier de preuve)

- **statut** : **VALIDÉ RÉFÉRENT + ENCODÉ + VÉRIFIÉ BI-AGENTS (2026-07-23)**. Dossier validé par le référent
  (Thibault) ; YAML `content/…/statine.yaml` **v1.0 `statut: valide`** (ordered-first-match, 3 tiers + 3 alertes)
  + argumentaire niveau 3. Preuves : agents A × **red-team B (essais + reco)** × **OpenEvidence OE-F1→F5**,
  chaque DOI/chiffre vérifié contre source primaire (discordances OE tranchées). **Vérif. encodage bi-agents
  (étape 8) : 0 finding HAUTE** (Agent A fidélité + Agent B red-team du moteur, ~35 profils tracés). **122 tests
  + build.** Restant P3 : câblage du formulaire D3 sur les critères age / anciennete_diabete_annees /
  autres_FDRCV / diabete_complique / dialyse.
- **version** : 1.0 · **date** : 2026-07-23 · **auteur** : Opus + référent (Thibault)
- **id YAML cible** : `statine` · domaine `diabete-type-2`
- **type de nœud** : **ORDERED-FIRST-MATCH** (sortie **unique** — échelle de risque, comme le nœud A) : un
  patient donné relève d'**un** tier de risque (secondaire / primaire à traiter / bas risque à discuter), la
  1re option satisfaite dans l'ordre l'emporte, le `default` en dernier. La position « pas de cible LDL
  dogmatique » et les cas particuliers (âge > 75, dialyse) ne sont **pas** des options mais des **alertes**
  (D15) / de l'argumentaire.

## 0. Nature de ce dossier & périmètre (garde-fou méthodo)

Nœud F cadré (`CADRAGE-8-noeuds.md §F`) = **« prescrire une statine, et à quelle intensité ? »** chez le DT2.
C'est le **volet lipidique** de la prévention cardiovasculaire du diabétique — **orthogonal** aux nœuds
glycémiques (A cible / B 1re intention / C intensification / D SU-gliptines / E insuline) : une statine se
décide **indépendamment de l'HbA1c et du traitement antidiabétique**. (L'aspirine — ex-nœud G — a été retirée :
pas de prévention primaire, secondaire systématique. Cf. `00-global.md`.)

**Trois messages structurants attendus** (à étayer par la collecte) :

1. **Prévention secondaire (maladie athéromateuse établie)** : bénéfice net **fort**, sur critères **durs**,
   NNT bas → **statine de haute intensité** quasi systématique. Peu discuté.
2. **Prévention primaire chez le diabétique** : bénéfice réel sur les **événements CV** (ancrage **CARDS**,
   **HPS**, méta **CTT**), mais **modeste en absolu** et surtout — point de vigilance anti-sur-traitement — la
   **réduction de la mortalité totale n'est pas clairement démontrée** en prévention primaire chez le
   diabétique `[À VÉRIFIER — collecte]`. D'où une décision **graduée par le risque absolu**, pas un réflexe.
3. **Position critique centrale = « pas de cible LDL dogmatique »** *(reformulée après collecte — sous-dossier
   3)* : le **seul** ECR de *stratégie* — **LODESTAR** (Hong 2023, JAMA, PMID 36877807) — a comparé
   *treat-to-target* LDL vs **dose fixe** de haute intensité et conclut à la **NON-INFÉRIORITÉ** (équivalence
   stratégique : viser une cible ≡ donner une dose fixe, pas de supériorité d'une cible) ; **aucun** ECR n'a
   jamais randomisé des patients entre deux **valeurs** de cible LDL (ex. < 1,4 vs < 1,8 mmol/L) sur critères
   durs. Les cibles chiffrées des recos (ESC/EAS `< 1,8 / < 1,4 mmol/L`) sont donc **extrapolées** de la
   relation continue « lower is better » de la CTT (bénéfice proportionnel à la baisse absolue de LDL),
   **non validées en tant que cibles**. → l'outil recommande une **intensité de statine calée sur le niveau de
   risque** (dose fixe), pas la poursuite d'un chiffre de LDL. `[PMID à re-vérifier au red-team]`

Suit la pipeline `00-global.md` (Cadrer → Collecter → Apprécier → bi-agents → Distiller). Ce fichier fige les
**étapes 1-2** ; les §3-8 seront remplis par la collecte + la vérification bi-agents.

## 1. Question clinique & critères d'entrée (FIGÉ)

- **PICO** :
  - **P** = adulte DT2 (hors DT1, grossesse), pour la **prévention cardiovasculaire lipidique**.
  - **I** = prescription d'une **statine**, à une **intensité** (modérée / élevée) fonction du niveau de risque.
  - **C** = pas de statine ; ou stratégie *treat-to-target* LDL (viser un chiffre de LDL).
  - **O = critères DURS** : **mortalité totale**, mortalité CV, IDM (non fatal), AVC, revascularisation
    (événements vasculaires majeurs) — **vs SUBSTITUTION** : baisse du LDL-C. La distinction **événements CV
    (bénéfice réel) vs mortalité totale (moins nette en prévention primaire)** est décisionnelle ici.

- **Variables d'entrée** (→ `criteres_entree`, cf. `CADRAGE-8-noeuds.md §F` + arbitrages) :
  - `age` (nombre) — réutilisé des nœuds A/B.
  - `anciennete_diabete_annees` (nombre) — réutilisé du nœud A (durée = proxy d'atteinte d'organe / risque).
  - `ASCVD_etablie` (bool) — **maladie athéromateuse établie** (coronaire, cérébrovasculaire, artériopathie
    périphérique symptomatique, revascularisation) = **prévention secondaire**. Réutilisé du nœud B.
  - `autres_FDRCV` (nombre) — **compte** des facteurs de risque CV additionnels (HTA, tabagisme actif,
    dyslipidémie, hérédité CV précoce, …). Seuil EBM = **≥ 1** (critère d'inclusion de **CARDS**) ; **pas** de
    gradation fine 2 vs 3 (non étayée EBM — règle de granularité `00-global.md`).
  - `[candidat, en attente collecte] DFG` (nombre) — uniquement pour l'**alerte dialyse / MRC avancée** (4D /
    AURORA : ne pas *initier* une statine chez un patient déjà en dialyse — bénéfice non démontré). Réutilisé
    du nœud B. À confirmer par le sous-dossier 3.

- **Critères ÉCARTÉS (et pourquoi)** :
  - **LDL-C de base / cible LDL** : **non** — la statine est recommandée chez le diabétique à risque
    **indépendamment du LDL de base** (HPS), et « pas de cible dogmatique » est justement la position de
    l'outil → **ne pas gater sur un chiffre de LDL** (ce serait contredire le message n°3). `[À VÉRIFIER — HPS]`
  - `contrainte_cout` : sans objet (statines génériques, peu coûteuses).
  - `SCORE2` / **SCORE2-Diabetes** : outil de **stratification du risque** (reco officielle) — utile à
    **expliquer** dans l'argumentaire, mais **pas** encodé comme entrée gating (la décision diabétique se
    joue surtout sur âge + ATCD + FDR ; l'immense majorité des DT2 ≥ 40 ans qualifient). **Arbitrage §8.**

- **Arbitrage `prevention` (enum) vs `ASCVD_etablie` (bool)** — *tranché (reco Opus, à valider référent §8)* :
  **ne pas dupliquer**. `prevention == secondaire ⟺ ASCVD_etablie == true` ; `prevention == primaire ⟺
  ASCVD_etablie == false`. On garde la **primitive** `ASCVD_etablie` (déjà utilisée en B, cohérence
  inter-nœuds) et on **dérive** la notion de prévention (`CADRAGE-8-noeuds.md §Observations 4` : éviter deux
  sources de vérité). *(NB : `ASCVD_etablie` = athérome établi ; distinct de `antecedent_cv` du nœud A, plus
  large — pour la statine c'est bien l'athérome qui impose la haute intensité.)*

## 2. Options envisagées (esquisse FIGÉE — intensités, seuils & chiffres à confirmer par collecte)

Nœud **ordered-first-match** : l'ordre EST la sémantique (le patient tombe dans **un** tier). Intensité
(Table 4 SFE/SFD/NSFA/SFC 2026) : « haute » = atorvastatine 40-80 / rosuvastatine **10-20** ; « modérée » =
atorvastatine 10-20 / simvastatine 20-40 / pravastatine 40 / rosuvastatine 5. *(NB : la Table 4 française
classe rosuva 10-20 en haute intensité et rosuva 5 en modérée — diffère de la convention ACC/AHA où la haute
= rosuva 20-40. **Tranché référent 2026-07-23 : garder rosuva 10-20**, fidèle à la reco française.)*

1. **Statine de haute intensité — prévention secondaire** — `ASCVD_etablie == true`.
   Bénéfice **dur**, NNT bas ; recommandation quasi systématique. `[effet/NNT à chiffrer — CTT secondaire]`.
2. **Discuter la statine (décision partagée) — bas risque** —
   `age < 40 AND anciennete_diabete_annees < 10 AND autres_FDRCV == 0` (et `ASCVD_etablie == false`, garanti
   par l'ordre). Bénéfice **absolu faible** → décision partagée, pas un automatisme. `[seuils à valider §8]`.
3. **Statine (prévention primaire, intensité modérée à élevée)** — `default`.
   Le cas standard : diabétique en prévention primaire (typiquement ≥ 40 ans, ou plus jeune avec FDR /
   diabète ancien). Bénéfice sur **événements CV** (ancrage **CARDS/HPS/CTT**) ; **mortalité totale moins
   nette** → l'afficher honnêtement. `[NNT événements CV à chiffrer]`.

**Alertes (D15) envisagées** (rappels, pas des options) :
- **Âge > 75 ans en prévention primaire** → *individualiser* : preuve plus faible chez le très âgé, tenir
  compte de l'espérance de vie / fragilité (chaînage esprit nœud A). `[À VÉRIFIER — méta CTT par âge]`.
- **Dialyse / MRC avancée** → **ne pas *initier*** une statine (bénéfice non démontré — **4D**, **AURORA**) ;
  poursuivre si déjà en place est une autre question. `[À VÉRIFIER — seuil DFG proxy]`.
- **« Pas de cible LDL dogmatique »** → intensité selon le risque, pas la poursuite d'un chiffre de LDL
  (aucun ECR *treat-to-target*). `[À VÉRIFIER]`.

**Garde-fous de voix (à tenir en rédaction)** : ✗ ne pas présenter la mortalité totale comme démontrée en
prévention primaire si la collecte ne le confirme pas ; ✗ ne pas transformer une cible LDL de guideline
(substitution extrapolée) en objectif dur ; distinguer partout **événement CV (bénéfice)** vs **mortalité**.

## Sources en main & plan de collecte (2026-07-23)

**Déjà en main (réutilisable)** : positions **HAS 2024** (PDF référent) et **SFD 2025** (PDF référent) — volet
lipides/risque CV ; **Prescrire** (`sources/prescrire-dt2.md`, à recouper).

**Collecte lancée — 4 sous-dossiers bi-agents (Agent A extraction + red-team ultérieur)** :
1. **Prévention secondaire + intensité** : CTT (sous-groupe diabète), 4S/CARE/LIPID/HPS secondaire,
   TNT/IDEAL/PROVE-IT/SPARCL (haute vs modérée). Effet dur, absolu/NNT, GRADE.
2. **Prévention primaire + mortalité** : **CARDS**, HPS primaire, ASCOT-LLA (diab.), ASPEN, CTT bas risque ;
   **statut de la mortalité totale** en prévention primaire diabétique.
3. **Intensité / cible LDL / populations spéciales** : absence d'ECR *treat-to-target* (fondement du « pas de
   cible ») ; cibles ESC/EAS (à documenter) ; sujet > 75 ans ; **dialyse 4D/AURORA/SHARP** ; tolérance.
4. **Reco officielle FR + divergence** : HAS 2024, SFD 2025, CMG, ESC/EAS, ADA 2026, SCORE2-Diabetes,
   Prescrire, Médicalement Geek — qui traiter, quelle intensité, cible ou non ; **divergence** reco ↔ critique.

### État de collecte (2026-07-23)

4 sous-dossiers **reçus** (agents A) + **OE-F1** reçu (référent) ; **red-team Agent B** (vérif. DOI/chiffres,
groupes 1-3) en cours. Points structurants déjà consolidés :

- **⚠ Source de la reco officielle (correction)** : la **HAS 2024** « Stratégie thérapeutique du DT2 » (PDF
  local, lue) **ne contient AUCUNE reco statine/LDL** (contrôle glycémique uniquement ; seul point lipidique
  = R.1 grade A « dépister/traiter la dyslipidémie comme FDR CV », sans modalité). La reco **statine** relève
  de la **HAS 2017 « Principales dyslipidémies »** (fiche mémo) + ESC/EAS + ADA + SFD. → `reco_officielle.source`
  du YAML **ne doit PAS citer HAS 2024** pour la statine. `[URL officielle HAS 2017 has-sante.fr — À VÉRIFIER]`
- **Prévention primaire** : bénéfice **CV net** (CARDS HR 0,63 ; HPS primaire RRR 33 %) mais **mortalité totale
  non démontrée** (CARDS p=0,059 NS ; méta essais dédiés diabète Chang OR 0,73 NS ; ASPEN nul). *(A + OE)*
- **Prévention secondaire** : bénéfice **dur**, NNT ~12-20/5 ans (CTT 2008, HPS, CARE, LIPID, 4S). *(A + OE)*
- **Intensité** : gain **incrémental** sur événements CV non fatals (TNT diab. HR 0,75 ; CTT 2010 −15 %) ; la
  **mortalité n'est PAS réduite par l'intensification seule** (TNT cohorte totale HR 1,01 ; SEARCH/IDEAL NS ;
  Ennezat 2023). *(A + OE)*
- **Cible LDL** : **LODESTAR** = *treat-to-target* non-inférieur à dose fixe ; aucun ECR de *valeur* cible →
  « pas de cible dogmatique » reformulé. *(A)*
- **Dialyse** : **ne pas initier** (4D, AURORA neutres ; SHARP porté par les non-dialysés). *(A)*
- **Âgé > 75 ans primaire** : preuve faible/incertaine (CTT par âge 2019, PROSPER porté par le secondaire). *(A)*
- **Sécurité** : diabète induit par statine = **sans objet** chez un DT2 déjà déclaré ; symptômes musculaires
  > 90 % non attribuables (CTT muscle 2022). Molécules : simva/atorva = CYP3A4 (interactions) ; prava/rosuva/
  pitava = moins d'interactions. *(A)*

## 3. Base de preuves (grille par étude clé) — CONSOLIDÉE (agents A × red-team B × OE, 2026-07-23)

> **Garde-fou** : PMID/DOI et chiffres décisionnels **vérifiés par l'Agent B (red-team) contre source
> primaire**. Les items **★** (CARDS, HPS, CTT 2008/2010/2019, TNT diab., PROVE-IT diab., LODESTAR, 4D,
> AURORA, ASPEN) **CONFIRMÉS au chiffre près**. Discordances de PMID agents ↔ OE tranchées par le red-team :
> **LODESTAR = 36877807**, **4D = 16034009**, **HPS diab. = 12814710** (valeurs des agents ; celles d'OE
> étaient fausses). `[À VÉRIFIER]` = paywall / non affiché en source primaire.

### SOUS-DOSSIER 1 — Prévention SECONDAIRE (ASCVD établie) + intensité

**Étage 1 — statine vs placebo (bénéfice DUR, non ambigu).**

| Essai (PMID) | Design / population diab. | Résultat (dur ; absolu/NNT/IC ; horizon) | GRADE |
|---|---|---|---|
| ★ **CTT méta diabète 2008** (18191683) | IPD, 14 ECR, **18 686 diabétiques**, 4,3 ans, mixte 1re/2de prév. | Par 1 mmol/L LDL : ÉVM **RR 0,79 (0,72-0,86)** ; IDM/décès coronaire 0,78 (0,69-0,87) ; AVC 0,79 (0,67-0,93) ; revasc 0,75 (0,64-0,88). **42 (30-55)/1000 à 5 ans → NNT ~24**. Effet = non-diabétiques. | **élevé** |
| ★ **HPS diabète 2003** (12814710) | 5963 diab., simva 40, ~5 ans | ÉVM **20,2 % vs 25,1 %, RR −22 % (13-30) p<0,0001 ; ARR 4,9 % → NNT ~20/5 ans**. Bénéfice même si LDL<3,0 (−27 %). | **élevé** |
| **CARE diabète 1998** (9843456) | post-IDM, n=586, prava 40, 5 ans | Événements coronaires **−25 % p=0,05 ; ARR ~8,1 % → NNT ~12/5 ans** ; revasc −32 %. | modéré |
| **LIPID diabète 2003** (14514569) | post-SCA, 1077 diab., prava 40, 6 ans | *any CV event* −21 % p<0,008, **NNT 18/6 ans** ; AVC −39 % (7-61) p=0,02. **⚠ critère 1aire (décès coronaire/IDM) = −19 % p=0,11 NS** (red-team). | modéré |
| **4S diabète 1997** (9096989) | post-IDM, **n=202** (petit), simva, 5,4 ans | Événements coronaires **RR 0,45 (0,27-0,74) p=0,002** ; mortalité 0,57 (0,30-1,08) p=0,087 NS. | faible (isolé) |

**Étage 2 — haute vs modérée intensité (bénéfice INCRÉMENTAL, plus modeste ; PAS de gain de mortalité).**

| Essai (PMID) | Comparaison | Résultat | Note |
|---|---|---|---|
| ★ **CTT more-vs-less 2010** (21067804) | méta 5 ECR intensité | ÉVM **−15 % (11-18) p<0,0001** ; par 1 mmol/L RR 0,78 (0,76-0,80) ; NNT ~25/5 ans. Mortalité 0,90 (0,87-0,93) **par mmol/L** (portée par « statine vs rien », pas par l'intensification). | dur |
| ★ **TNT diabète** (16731999) | atorva 80 vs 10, coronarien stable, 1501 diab., 4,9 ans | Critère 1aire **17,9 % vs 13,8 %, HR 0,75 (0,58-0,97) p=0,026 → NNT ~24/4,9 ans**. | dur |
| ★ **PROVE-IT diabète** (Ahmed 2006, ehl220) | atorva 80 vs prava 40, post-SCA, 978 diab., 2 ans | 21,1 % vs 26,6 %, **HR 0,75 p=0,03** (p-interaction 0,97) ; NNT ~18/2 ans. **IC95 `[À VÉRIFIER — paywall]`**. | dur |
| **IDEAL** (16287954) | atorva 80 vs simva 20-40, post-IDM | Critère 1aire **HR 0,89 (0,78-1,01) p=0,07 NS** ; sous-groupe diab. non chiffré. | dur (1aire NS) |
| **SEARCH** (21067805) | simva 80 vs 20 | ÉVM 24,5 % vs 25,7 % RR 0,94 (0,88-1,01) **p=0,10 NS** ; **myopathie 0,9 % vs 0,03 %** (restriction FDA simva 80). | intensité + risque |
| **de Vries 2014** (PLOS One, 0111247) | méta diabète, **prév. secondaire** | (a) statine vs placebo RR 0,85 (0,79-0,91) ; **(b) intensif vs standard RR 0,91 (0,84-0,98) = −9 %**. | dur |
| **TNT cohorte totale** (15755765) | atorva 80 vs 10 | **Mortalité toutes causes HR 1,01 (0,85-1,19)** — l'intensification NE réduit PAS la mortalité (confirmé Ennezat 2023, OE). | dur |

### SOUS-DOSSIER 2 — Prévention PRIMAIRE (question centrale : mortalité)

| Essai (PMID) | Design / population | Résultat (événements CV vs MORTALITÉ) | Lecture / GRADE |
|---|---|---|---|
| ★ **CARDS** (15325833) | DT2 40-75, prév. **primaire pure**, ≥1 FDR, N=2838, atorva 10, **arrêt précoce**, 3,9 ans | Composite **HR 0,63 (0,48-0,83) p=0,001 ; 5,8 % vs 9,0 % → NNT ~27-32** (fourchette selon méthode, red-team) ; AVC HR 0,52 (0,31-0,89). **Mortalité HR 0,73 (0,52-1,01) p=0,059 NS**. | CV = **élevé** ; mortalité = **faible** (NS + arrêt précoce) |
| ★ **HPS sous-groupe diab. sans maladie occlusive** (12814710) | 2912 diab. prév. primaire | ÉVM **RR −33 % (17-46) p=0,0003 → NNT ~22/5 ans** ; mortalité du sous-groupe non isolée. | CV = **modéré-élevé** |
| ★ **ASPEN** (16801565) | DT2, N=2410, atorva 10, mixte | Composite **HR 0,90 (0,73-1,12) NS** ; **sous-groupe prév. primaire HR 0,97 (0,74-1,28) NUL** (contamination placebo). Contrepoids à CARDS. | modéré (nul) |
| **ASCOT-LLA diabète** (15855581) | 2532 diab., atorva 10, 3,3 ans | **⚠ critère coronaire dur HR 0,84 (0,55-1,29) NS** ; seul le composite **élargi** (avec procédures) HR 0,77 (0,61-0,98) p=0,036 → **spin** (red-team). | faible-modéré |
| ★ **CTT diabète 2008** (18191683) | méta, mixte 1re/2de | **Mortalité totale 0,91 (IC99 0,82-1,01) p=0,02 borderline** ; portée par la prévention **secondaire** (risque de base). | mortalité modéré (non isolée en primaire) |
| **Chang 2013** (24380090) | méta **essais dédiés diabète** | Composite CV **OR 0,817 (0,649-1,029) p=0,086 NS**. **⚠ l'« OR mortalité 0,73 » = CARDS seule, PAS un pool** (red-team). | modéré |
| **Yang/NMCD 2022** (36064686) | méta diabète (partiel obs.) | Événements CV RR 0,80 (0,69-0,94) ; **AUCUNE association avec la mortalité totale** chez le diabétique. | modéré-faible |
| **Cochrane 2013** (23440795) · **Byrne 2022** (35285850) | prév. primaire **population MIXTE** | Mortalité OR 0,86 (0,79-0,94) / ARR 0,6 % — mais **non spécifique diabète** ; méta-régression LDL↔mortalité non concluante (Byrne). | signal mortalité = mixte, pas diabète isolé |

**Message sous-dossier 2 (triple-confirmé A × B × OE)** : en prévention primaire chez le diabétique, le bénéfice
sur les **événements CV majeurs** est solide (**NNT ~22-37 sur 3-5 ans**), mais **la réduction de la mortalité
toutes causes n'est PAS démontrée** dans les essais dédiés au diabète (CARDS NS ; Yang NS ; le signal mortalité
vient des métas mixtes 1re+2de prévention). L'algorithme ne doit **jamais** revendiquer un gain de mortalité en
prévention primaire du DT2.

### SOUS-DOSSIER 3 — Cible LDL & intensité (fondement du « pas de cible dogmatique »)

- ★ **LODESTAR** (36877807, JAMA 2023) : *treat-to-target* LDL 50-70 vs **dose fixe** haute intensité →
  composite 8,1 % vs 8,7 %, **NON-INFÉRIORITÉ** (borne IC < marge 3,0 pt) ; N=4400 ; sous-groupe diabète
  (Lee, EClinicalMedicine 2023) HR 0,94 (0,69-1,29). → **viser une cible ≡ donner une dose fixe** (pas de
  supériorité d'une cible).
- **Aucun ECR** n'a randomisé des patients entre deux **valeurs** de cible LDL sur critères durs en prévention
  primaire / diabète. Les cibles ESC/EAS (`< 1,4 / < 1,8 mmol/L`) sont **extrapolées** de la relation continue
  « lower is better » (CTT) + more-vs-less + add-on ézétimibe/PCSK9 + randomisation mendélienne — **pas testées
  comme cibles**.
- **⚠ Développement récent (hors périmètre du nœud statine — via add-on, à re-vérifier)** : OE remonte un ECR
  **2026** de *supériorité* d'un ciblage LDL intensif en **ASCVD** (Lee, NEJM, DOI 10.1056/NEJMoa2600283, HR
  0,67) et **VESALIUS-CV** (évolocumab, mortalité HR 0,79 chez le diab. haut risque **sans** IDM/AVC). → nuance
  le « pas de cible » **en prévention secondaire/très haut risque**, mais ce sont des essais d'**ajout**
  (ézétimibe/anti-PCSK9), pas la dose de statine. `[2026 — à re-vérifier au fil de la veille]`.

### SOUS-DOSSIER 4 — Populations spéciales & sécurité

- **Sujet > 75 ans, prévention primaire** : ★ **CTT par âge 2019** (30712900) — bénéfice ÉVM à tout âge (RR
  0,79/mmol/L) mais **atténué et moins de preuves directes en prévention primaire chez le > 75 ans** ;
  **PROSPER** (12457784) — sous-groupe prév. primaire **HR 0,94 (0,77-1,15) NS**, mortalité **HR 1,07** (pas de
  bénéfice) ; Gencer 2020 (33186535) ≥75 ans RR 0,74/mmol/L (mixte statine + non-statine). Observationnel
  favorable (Orkaby 2020, Chan 2026) mais biaisé. **Time-to-benefit ~2,5 ans**. → *individualiser* (espérance
  de vie, fragilité). GRADE prév. primaire > 75 = **faible**.
- **Dialyse / MRC terminale** : ★ **4D** (16034009) DT2 hémodialyse — critère 1aire **RR 0,92 (0,77-1,10) NS** +
  **signal AVC fatal RR 2,03 (1,05-3,93)** ; ★ **AURORA** (19332456) — **HR 0,96 (0,84-1,11) NS** malgré LDL
  −43 % ; **SHARP** (21663949) — sous-groupe dialyse non concluant (bénéfice global porté par les
  non-dialysés). → **ne pas INITIER** une statine en dialyse ; **poursuivre** si déjà en place ; **initier** en
  MRC stade 3-5 **non dialysée** (KDIGO ≥50 ans). GRADE dialyse = **modéré-élevé**.
- **Sécurité** : **diabète induit par statine** (Sattar 2010, 20167359 : OR 1,09 [1,02-1,17] ; Preiss 2011,
  21693744 : intensif OR 1,12 [1,04-1,22]) = **SANS OBJET chez un DT2 déjà déclaré** (à mentionner pour couper
  l'objection). Symptômes musculaires (CTT muscle 2022, 36049498) : excès réel **seulement la 1re année** (RR
  1,07), **> 90 % des symptômes non attribuables** à la statine. **Molécules** : simva/atorva = CYP3A4
  (interactions macrolides, azolés, amiodarone, vérapamil…) ; **prava/rosuva/pitava = moins d'interactions**
  (à préférer en co-prescription à risque). *(Pharmaco/RCP — non chiffré en NNT.)*

## 4. Synthèse critique (reco officielle vs position raisonnée)

### Reco officielle

- **⚠ HAS 2024 « Stratégie thérapeutique du DT2 » (PDF local) = AUCUNE reco statine** (contrôle glycémique
  seul ; R.1 grade A = dépister/traiter la dyslipidémie comme FDR, sans modalité). La reco statine française
  relève de la **HAS 2017 « Principales dyslipidémies »** : diabétique classé d'emblée **haut/très haut
  risque** ; *treat-to-target* mais cibles **moins strictes** (`< 0,70 g/L` très haut, `< 1,0 g/L` haut) ;
  molécules simva/atorva.
- **ESC/EAS 2019** (31504418) : DT2 + atteinte d'organe / ≥3 FDR / longue durée = **très haut risque** (`< 1,4
  mmol/L` **+ ≥50 %**) ; sinon **haut risque** (`< 1,8` + ≥50 %). Piloté par **SCORE2-Diabetes** (EHJ 2023).
- **ADA 2026** (10.2337/dc26-S010) : **40-75 ans sans ASCVD → statine modérée** ; + FDR/haut risque → haute ;
  **ASCVD → haute intensité**.
- **SFD 2025** : aligné ESC (SCORE2, cibles basses).

### Position critique (Prescrire, Minerva, EBM francophone) — affichée à côté

Prescrire (jul. 2005, ligne constante) : **prévention secondaire = bénéfice net clair** ; **prévention primaire
= seulement selon le risque absolu** (âge > 40 + autres indicateurs), **pas systématique** ; **dose modérée
fixe**, **pas de cible LDL dogmatique**, molécule préférée **simvastatine**. Minerva : *« arguments insuffisants
pour prescrire systématiquement une statine chez les DT2 sans risque additionnel »*.

### Divergence — **oui**

Deux philosophies : (1) **officiels = treat-to-target agressif** (cibles LDL de plus en plus basses, titration/
escalade ézétimibe→PCSK9, ADA « 40-75 ans → statine ») ; (2) **critique EBM = dose fixe selon le risque
absolu, pas de cible**. Fondements de la position critique, **appuyés par la preuve directe** : CARDS/HPS
testaient une **dose fixe**, bénéfice **indépendant du LDL de base** ; **LODESTAR** montre l'équivalence
cible ≡ dose fixe ; la **mortalité en prévention primaire n'est pas démontrée**. **Position raisonnée de
l'outil** : *secondaire → statine haute intensité (consensus total) ; primaire → statine (intensité modérée,
haute si risque très élevé) pilotée par le risque absolu, décision partagée au bas risque, sans dogme de cible*.

## 5. Vérification bi-agents (réconciliation Opus, 2026-07-23)

**Dispositif** : agents A (4 sous-dossiers, extraction) × **Agent B red-team** (vérif. PMID/chiffres vs source
primaire, 45 outils) × **OE-F1→F4** (débroussaillage référent). Triangulation effectuée.

**5a. Consensus vérifié** : sous-dossiers 1-4 confirmés au chiffre près sur les items ★ ; toutes les
discordances de PMID (LODESTAR, 4D, HPS diab.) tranchées vers la valeur correcte (agents), OE fautif écarté.

**5b. Corrections red-team appliquées** :
- **Chang 2013** : « OR mortalité 0,73 » = **mortalité de CARDS seule** citée en discussion, **PAS** un pool
  des essais dédiés → ne jamais l'afficher comme méta-analyse dédiée.
- **ASCOT-LLA diabète** : critère coronaire **dur NS** (HR 0,84) ; significativité seulement sur le composite
  élargi (procédures) → afficher comme tel, pas comme preuve d'efficacité coronaire.
- **LIPID diabète** : « −21 % » = *any CV event* ; **critère 1aire du sous-groupe = −19 % p=0,11 NS**.
- **NNT CARDS** : fourchette **~27-32** (deux méthodes défendables : 37/1000 sur 4 ans → ~27 ; incidence
  cumulée → ~32).
- **Mortalité en prévention primaire** : **jamais « démontrée »** (CARDS p=0,059 ; CTT IC99 franchit 1,0 ;
  essais dédiés NS).

**5c. `[À VÉRIFIER]` résiduels (non bloquants)** : IC95 de PROVE-IT diabète (paywall) ; % par bras de Preiss
2011 (l'OR suffit) ; valeurs de seuils ESC/EAS (corps du guide, pas l'abstract — correctes) ; essais 2026
(Ez-PAVE/VESALIUS — très récents, hors périmètre du nœud, veille).

**5d. Interdits de voix (outil)** : ✗ « la statine réduit la mortalité en prévention primaire du DT2 » (non
démontré — événements CV seulement) · ✗ transformer une cible LDL de guideline en objectif dur · ✗ présenter
ASCOT/LIPID diabète comme preuve coronaire dure · ✗ initier une statine en dialyse (neutre) · ✗ invoquer le
« diabète induit » chez un patient déjà diabétique.

## 6. Incertitudes

- **Mortalité toutes causes en prévention primaire du DT2** : non démontrée (essais dédiés NS ; signal des
  seules métas mixtes) — le bénéfice affiché est sur les **événements CV**, pas la survie.
- **Seuil d'âge du tier « bas risque à discuter »** (40 vs 50 ans) et rôle du compte de FDR : arbitrage §8.
- **> 75 ans en prévention primaire** : preuve faible ; STAREE (exclut les diabétiques) / PREVENTABLE en cours.
- **Cible LDL en prévention secondaire/très haut risque** : évolutive (ECR 2026 de ciblage intensif via
  add-on) — mais hors périmètre du nœud statine (ézétimibe/PCSK9).
- **Modélisation de la dialyse** : seuil DFG proxy (arbitrage §8-4) — « en dialyse » n'est pas exactement un DFG.

## 7. → YAML (contenu distillé — ENCODÉ EN BROUILLON v0.3, en attente de validation référent)

Nœud **ordered-first-match** (sortie unique, échelle de risque). **6 critères** (v0.3, « que dit l'EBM ») :
`age`, `ASCVD_etablie`, `anciennete_diabete_annees`, `autres_FDRCV`, `diabete_complique` (bool), `dialyse`
(bool). **3 options ordonnées** + **3 alertes**.

**Stratification EBM-ancrée** (pas de seuil SCORE2 — cf. §8) : le bénéfice relatif de la statine est ~constant
quel que soit le risque (CTT), **il n'existe pas de seuil-EBM** ; la frontière « discuter / traiter » suit
l'enrichissement des ECR (**CARDS = 40-75 ans + ≥ 1 FDR** ; **ASPEN nul** en-deçà), ce qui **coïncide avec la
grille française 2026** (« modéré = DT2 < 10 ans non compliqué → décision partagée »).

1. **Statine haute intensité — prévention secondaire** — `ASCVD_etablie == true`. `niveau_preuve: eleve`.
2. **Discuter (décision partagée) — diabète non compliqué à faible risque** —
   `anciennete_diabete_annees < 10 AND autres_FDRCV == 0 AND diabete_complique == false`. `niveau_preuve: faible`.
3. **Statine (prévention primaire, intensité modérée — haute si risque très élevé)** — `default`
   (≥ 1 FDR OU compliqué OU ancienneté ≥ 10 ans). `niveau_preuve: modere` (événements CV ; **mortalité NON
   revendiquée** ; ASPEN nul en contrepoids). Molécule : modérée fixe (atorva 10-20, simva/prava).
- **Alertes** : (a) `age > 75 AND ASCVD_etablie == false` → individualiser (espérance de vie ≥ 2,5 ans,
  fragilité) ; (b) `dialyse == true` → ne pas initier (4D/AURORA) ; (c) `default` (info) → risque absolu,
  **pas de cible LDL**, + SCORE2-Diabète comme AIDE (seuils fixes ESC 2023, validé 40-69).
- `reco_officielle` : réécrite sur **SFE/SFD/NSFA/SFC 2026** (Diabetes & Metabolism 2026;52:101725,
  PMID 41651737) + ESC/EAS 2019 + ADA 2026 ; **HAS 2017 supplantée** ; doses corrigées (haute = rosuva 10-20) ;
  **note CONFLITS D'INTÉRÊT** (reco cosignées avec fabricants d'anti-PCSK9 → biais sur le versant agressif).
  `divergence: true`.
- **Vérifié** : 122 tests + build ; **11 profils v0.3 tracés** au moteur ; **volet recommandations red-teamé**
  (SCORE2 PMID 37247330 ; French 2026 PMID 41651737 ; seuils SCORE2 = **fixes ESC 2023**, PAS âge-bandés —
  erreur corrigée). **Restant avant `valide`** : vérification d'encodage bi-agents dédiée (étape 8).

## 8. Arbitrages référent — TRANCHÉS (2026-07-23) & reste à faire

**Tranchés (référent Thibault)** :

1. **`prevention` dérivé de `ASCVD_etablie`** (pas de variable séparée) — **OUI**.
2-3. **Stratification du risque** — d'abord « baser sur SCORE2-Diabète » (arbitrage initial), puis
   **« que dit l'EBM ? »** (2ᵉ tour). **Réponse EBM appliquée (v0.3)** : le bénéfice relatif de la statine est
   ~constant quel que soit le risque (CTT) → **pas de seuil-EBM** ; la frontière « discuter / traiter » suit
   l'enrichissement des ECR (CARDS = 40-75 ans + ≥ 1 FDR ; ASPEN nul en-deçà), ce qui **coïncide avec la grille
   française 2026** (« modéré = DT2 < 10 ans non compliqué »). → critères `anciennete_diabete_annees`,
   `autres_FDRCV`, `diabete_complique` ; **SCORE2-Diabète repassé en AIDE** (alerte info, seuils FIXES ESC 2023,
   validé 40-69 — l'encodage âge-bandé v0.2 était une erreur méthodo, corrigée).
4. **Dialyse = alerte** (référent) — encodée sur la variable `dialyse` (bool), pas de proxy DFG.
5. **> 75 ans = alerte** « individualiser » — **OUI**.
6. **Intensités/molécules** : « je te laisse juger » → encodé sur la **Table 4 SFE/SFD/NSFA/SFC 2026** (haute =
   atorva 40-80 / rosuva **10-20** ; modérée = atorva 10-20 / simva 20-40 / prava 40 / rosuva 5). **Tranché
   référent 2026-07-23 : garder rosuva 10-20** (fidèle à la Table 4 française), malgré la divergence avec la
   convention ACC/AHA (haute = rosuva 20-40) — seul chiffre clinique où les recos divergent.

**Corrections de sourçage (PDF locaux + red-team reco + OE-F5, 2026-07-23)** :

- **SFD 2025 & HAS 2024 RETIRÉES** de la reco statine — les deux ne traitent que l'hyperglycémie (vérifié PDF).
- **Reco française à jour = SFE/SFD/NSFA/SFC 2026** (« Management of dyslipidemia in adults »,
  *Diabetes & Metabolism* 2026;52:101725, **PMID 41651737** — consensus multi-sociétés, SFD incluse ;
  fournie par le référent) ; **HAS 2017 supplantée**.
- **⚠ Conflits d'intérêt** *(point soulevé par le référent)* : cette reco (et ses homologues ESC/ADA/ACC-AHA)
  est cosignée par des experts aux liens industriels étendus (fabricants d'anti-PCSK9 / hypolipémiants :
  Amgen, Sanofi-Regeneron, Novartis…) — biais sur le versant AGRESSIF (cibles LDL basses, escalade) ; l'outil
  pondère l'EBM + les sources critiques indépendantes (Prescrire, Minerva) et le signale dans `reco_officielle`.
- **SCORE2-Diabète** : PMID **37247330** (red-team) ; validé **40-69 ans** ; seuils de catégorie **FIXES**
  ESC 2023 (faible < 5 %, modéré 5-<10 %, haut 10-<20 %, très haut ≥ 20 %), **PAS âge-bandés**.

**RESTE À FAIRE avant `meta.statut: valide`** :

- **Vérification d'encodage bi-agents dédiée** (pipeline étape 8) sur le YAML v0.3 (Agent A fidélité + Agent B
  red-team du moteur, traçage de profils patients).
- Validation clinique finale du référent (définition de `diabete_complique`, libellés d'intensité).

## 9. Arbitrages référent — 2ᵉ série (2026-07-26), issus de la recette in-app

Contexte : recette du 2026-07-25/26 (`../validation/recette-2026-07-25-prescription-intensifier.md`,
capture 13) et inventaires du chantier (`../validation/chantier-2026-07-26/`). Le nœud `statine` s'est
révélé le plus exposé des cinq — mode `ordered-first-match` (sortie unique, jamais mise en balance) et
valeurs par défaut convergeant toutes vers le même tier.

### 9.1 — Périmètre élargi : le nœud couvre l'initiation **et** la poursuite

**Décision référent (2026-07-26) : ajouter deux critères d'entrée** — `statine_deja_en_place` et
`intolerance_statine`.

**Le cas qui l'a imposée.** L'alerte dialyse (`statine.yaml:118`) se termine par « **si une statine est
déjà en place, sa poursuite est raisonnable** ». Or le nœud n'a **aucun critère** disant si le patient
est déjà traité : il ne peut donc jamais distinguer les deux situations que sa propre alerte oppose.
La nuance était structurellement inapplicable.

**Deuxième angle mort fermé** : l'**intolérance / les effets indésirables sous statine** (myalgies) —
motif d'arrêt le plus fréquent en pratique, cité dans les inconvénients du nœud (myopathie), absent
des critères d'entrée, et **non déclaré hors périmètre** dans `population_cible` (`:34-38`), qui
n'exclut explicitement que l'hypercholestérolémie familiale et l'intensification par
ézétimibe/anti-PCSK9. Ces deux cas n'étaient donc ni couverts ni annoncés.

**Couplage à ne pas casser** : ces deux critères sont un **prérequis** de la correction de la
contradiction dialyse (D21). Transformer l'alerte dialyse en `exclusion` sans eux **viderait
entièrement le nœud** (3 options en `ordered-first-match`, dont la 3ᵉ est le repli) — on remplacerait
une contradiction visible par un mutisme, ce qui est un échange perdant. **Les critères d'abord.**

### 9.2 — `diabete_complique` porte `confirmation_requise`

**Décision référent (2026-07-26) : `diabete_complique` est le seul booléen du nœud — et du domaine à
ce stade — marqué `confirmation_requise`** (cf. `DECISIONS.md` D20 et
`../validation/chantier-2026-07-26/SPEC-valeur-indeterminee.md` §2.2). Tant qu'il n'est pas confirmé,
il vaut `indetermine` et les options qui en dépendent restent **en attente**.

**Raison — deux critères convergents.**

1. *Son « non » demande un acte d'évaluation, pas un rappel.* Le nœud le dit lui-même dans ses
   `incertitudes` : « `diabete_complique` (bool) = **jugement clinique** (atteinte d'organe rétinienne
   / rénale / neurologique, ou maladie macrovasculaire) ». Cela ne se présume pas.
2. *Il casse à lui seul une convergence dangereuse.* Les trois conditions du tier le plus léger
   (`anciennete < 10`, `autres_FDRCV == 0`, `diabete_complique == false`) sont **toutes satisfaites par
   les valeurs par défaut** : le profil « diabète récent, sans facteur de risque, non compliqué » est
   littéralement l'état d'ouverture du formulaire, et il pousse vers la moindre intervention. Le
   sous-traitement par silence est le plus difficile à remarquer.

**Écartés, et pourquoi** : `ASCVD_etablie` — `anciennete_diabete_annees` et `autres_FDRCV` sont des
`nombre`, donc déjà indéterminés par D20 ; la convergence est cassée sans lui. `dialyse` — ce serait
de la friction pour la quasi-totalité des patients afin d'attraper un fait qu'un praticien ne peut pas
ignorer.

**Corollaire technique** : l'affordance « Rien à signaler » n'apparaît aujourd'hui qu'à partir de
**2** booléens décisifs dans une section. Un drapeau isolé n'aurait donc aucun moyen d'être confirmé —
seuil à descendre à 1 en même temps, sous peine de reproduire l'impasse de la capture 1 (un compteur
qu'on ne peut pas éteindre).

### 9.3 — Reste à corriger sur ce nœud (recette, non encore fait)

- **`age` est collecté et n'apparaît dans aucune condition d'option, seulement dans l'alerte > 75 ans.**
  L'inventaire du 2026-07-26 l'avait signalé comme une **règle manquante** (un DT2 de 30 ans avec 2 FDR
  reçoit « Recommandée » sans réserve, alors que l'en-tête du nœud pose que la population prouvée est
  celle des ECR — CARDS 40-75 ans). **TRANCHÉ depuis, voir §9.4 : ce n'est pas une règle manquante, c'est
  une décision référent — `age` reste délibérément non décisif.** Ne pas rouvrir sans nouvelle décision.
- **Pas de garde-fou de domaine** sur `autres_FDRCV` : la saisie accepte **−1**, ce qui bascule la
  sortie d'un tier à l'autre.
- **Le délai du bénéfice n'est jamais mis en regard de l'espérance de vie** — « 3-5 ans » s'affiche tel
  quel à 90 ans. Le nœud n'a pas de critère d'espérance de vie, contrairement aux nœuds A et E.
- **`dialyse` n'apparaît dans aucune `condition` ni `exclusion`** — uniquement dans l'alerte (cf. 9.1).

**Point correct, à ne pas « corriger »** : chez un patient de 90 ans **avec ASCVD établie**, l'alerte
> 75 ans ne se déclenche pas — c'est délibéré et conforme à son propre texte (« en prévention
secondaire, le bénéfice persiste à tout âge »). Le gate `ASCVD_etablie == false` fait exactement ce
qu'il doit.

### 9.4 — Règle d'âge : REJETÉE, `age` reste délibérément non décisif

**Décision référent (2026-07-26, 2ᵉ série).** §9.3 avait signalé `age` comme un critère collecté mais
inerte sur les options (seul l'alerte > 75 ans l'utilise) et proposé, à titre d'hypothèse, un gate
`age >= 40` calé sur la population de CARDS (40-75 ans avec ≥ 1 FDR). **Le référent l'écarte** : « tout
dépend de l'ancienneté du diabète et des atteintes d'organe. On colle à la grille. »

**Conséquence.** La décision traiter/discuter reste gouvernée **uniquement** par
`anciennete_diabete_annees`, `autres_FDRCV` et `diabete_complique` — la grille française 2026 (« modéré
= DT2 < 10 ans non compliqué »). **Aucune condition d'âge n'est ajoutée** à `options` dans ce lot. Un
DT2 de 30 ans avec 2 facteurs de risque continue, à dessein, de recevoir la même stratification qu'un
DT2 de 60 ans avec 2 facteurs de risque.

**Ce que ce choix impose de tracer, et pourquoi.** `age` reste, après cette décision, un critère
**délibérément non décisif** sur les options — il n'agit que via l'alerte `age > 75 AND ASCVD_etablie ==
false`. C'est exactement la signature que l'invariant générique R5 (« un critère qu'on demande doit
agir ; sinon on ne le demande pas », `GRAMMAIRE-NOEUD.md`) est conçu pour détecter et faire corriger. Sans
une trace explicite du caractère **volontaire** de cette inertie, une future passe de R5 verrait un
critère mort et serait tentée de le câbler dans une condition d'option — ce qui **annulerait cette
décision référent sans que personne ne s'en aperçoive**. La trace a été posée à deux endroits :
`statine.yaml` (commentaire au-dessus de `criteres_entree > age`, et entrée `incertitudes` dédiée) et ce
paragraphe. **Aucun changement de code, de condition ou d'exclusion** n'accompagne cette décision — c'est
une décision de **ne pas encoder**, purement documentaire.

### 9.5 — SCORE2-Diabète : alerte ciblée sur le tier « discuter », avec sa réserve de validation

**Décision référent (2026-07-26, 2ᵉ série).** « En l'absence de critère de la grille on pourrait
suggérer de calculer le SCORE2-Diabète, mais il serait probablement faible. » Jusqu'ici, l'alerte info
SCORE2-Diabète (portée par l'entrée `default` du nœud, cf. §7/§8) se déclenchait pour **tout patient**,
qu'il soit en prévention secondaire, à traiter d'emblée, ou dans la situation où l'estimation sert
réellement (absence de tout critère de la grille). Deux corrections appliquées :

1. **Ciblage.** L'alerte SCORE2 est extraite de `default` en une entrée dédiée, dont la condition
   reprend exactement les trois conditions de l'option « Discuter la statine » (`anciennete_diabete_annees
   < 10 AND autres_FDRCV == 0 AND diabete_complique == false`), **plus** un terme explicite
   `ASCVD_etablie == false`. Ce dernier terme est nécessaire : les alertes de nœud évaluent leur `quand`
   sur les seuls critères, jamais sur l'option effectivement résolue par l'`ordered-first-match` (rappel
   déjà noté au §7 de `GRAMMAIRE-NOEUD.md`) ; un patient avec ASCVD établie peut, par ailleurs, avoir un
   diabète récent, non compliqué et sans FDR — sans ce terme, l'alerte SCORE2 se serait déclenchée à tort
   chez un patient en prévention **secondaire**, où l'estimation du risque n'a pas d'objet (le tier haute
   intensité y est déjà acquis par `ASCVD_etablie == true`, indépendamment de tout score). Condition
   écrite en forme normale disjonctive (le DSL n'a pas de parenthèses, `AND` prime sur `OR`) : ici un
   unique terme conjonctif, aucun `OR` n'est nécessaire.
2. **Réserve de validation.** Le message ajoute que SCORE2-Diabète n'est validé que **40-69 ans**
   (formulation déjà présente dans les `incertitudes` du nœud, reprise telle quelle) : un patient qui ne
   coche aucun critère de la grille (diabète récent, non compliqué, sans FDR) est souvent **plus jeune**
   que cette plage — l'outil qu'on lui suggère de calculer peut donc être lui-même hors de son propre
   domaine de validation. Le message le dit explicitement.

**Ce qui reste inchangé.** Le rappel générique « la décision et l'intensité se gradent sur le risque
absolu, pas sur une cible LDL chiffrée » reste porté par l'entrée `default` et continue de s'afficher
pour **tout** patient — ce point n'est pas spécifique à SCORE2 et n'avait pas de raison d'être restreint
au tier « discuter ». Le nœud passe ainsi de 4 à 5 alertes.

## Annexe — Prompts OpenEvidence (débroussaillage référent, 2ᵉ passe)

5 prompts (OE-F1 à OE-F5) transmis au référent le 2026-07-23, à lancer dans OpenEvidence en parallèle des
agents A/B (triangulation A × B × OE — `00-global.md` étape 4). **OE = débroussaillage, jamais source
primaire** ; tout PMID/DOI/chiffre renvoyé sera re-vérifié contre la source primaire au red-team. Chaque
prompt demande explicitement effet **absolu/NNT**, **dur vs substitution**, GRADE.

**Périmètre OE — sources FR proscrites du prompt** : ne jamais demander à OpenEvidence d'explorer/citer
**HAS, SFD, CMG, Prescrire, Médicalement Geek/DragiWebdo, Minerva, ebmfrance** (accès non fiable → il
hallucine PMID/URL/positions). Ces sources sont curées **par les agents** (`docs/decision/sources/` + web +
référent). Cf. `00-global.md` (Règles de sourcing) et `BRIEF_DECISION.md` §14bis.

- **OE-F1** — Prévention secondaire (ASCVD établie) vs placebo (critères durs, absolu/NNT) **+ haute vs
  modérée intensité** (PROVE-IT, TNT, IDEAL, CTT 2010, méta diabète) ; l'intensification seule réduit-elle
  la mortalité ?
- **OE-F2** — Prévention **primaire** : dissocier **événements CV** (CARDS, HPS primaire, ASPEN, ASCOT-LLA,
  CTT) de la **mortalité totale** (essais dédiés diabète — Chang) ; la mortalité est-elle démontrée ?
- **OE-F3** — **Treat-to-target LDL vs dose fixe** : existe-t-il un ECR (LODESTAR/Hong 2023 ?) ; fondement
  des cibles ESC/EAS (extrapolation CTT ?) ; apport ézétimibe/PCSK9 chez le diabétique (IMPROVE-IT, FOURIER,
  ODYSSEY sous-groupes).
- **OE-F4** — Populations spéciales : **> 75 ans** en prévention primaire (PROSPER, méta CTT par âge 2019,
  STAREE) ; **dialyse / MRC avancée** (4D, AURORA, SHARP) — initier une statine en dialyse ?
- **OE-F5** — **Reco internationales indexées** (ESC/EAS dyslipidémie, ADA Standards of Care 2026 — chapitre
  risque CV/lipides) + **SCORE2-Diabetes** (Eur Heart J, indexé) : statine chez le diabétique, seuils
  d'intensité, dose fixe vs cible LDL. Axe critique **tiré des essais primaires** (CTT ; dose fixe vs
  treat-to-target ; mortalité primaire peu démontrée). PMID/DOI exigés ; si non ancrable dans un document
  indexé réel, le dire — **ne rien inventer**. **NE PAS demander à OE d'explorer/citer HAS, SFD, CMG,
  Prescrire, Minerva ou Médicalement Geek** (accès non fiable → hallucination) : sources FR curées par les
  agents (sources locales + web) et le référent.
