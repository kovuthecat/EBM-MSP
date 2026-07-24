# Nœud E — Insuline (initiation, optimisation, intensification, adaptation)   (dossier de preuve)

- **statut** : **ENCODÉ (brouillon v0.1) + VÉRIFIÉ BI-AGENTS ÉTAPE 8 (0 HAUTE après correction) — 2026-07-24**.
  Pipeline complète : cadrage (§0-2) → collecte 5 agents A (§3) → OE 2ᵉ passe (§5a) → red-team B réconcilié
  (§5b, 10 corrections de fond dont « Prescrire=NPH » & « position CMG » = inventions OE écartées, hypo sévère
  analogue-vs-NPH NON significative) → arbitrages §8-1→8-7 tranchés → **distillation §7 → encodage
  `content/noeuds/diabete-type-2/insuline.yaml` + `insuline.argumentaire.md` → vérif. encodage étape 8 (§5c)**.
  Ajv 7/7, **128 tests + build OK**. Labels câblés (`labels.ts`). **RESTE : validation clinique du référent
  option par option → `meta.statut: valide` ; câblage formulaire complet (dérivés calculés + nombres
  optionnels + calcul de dose + tooltips AGP) = P3 (proposé).** Statut YAML encore `brouillon`.
- **version** : 0.1 · **date** : 2026-07-24 · **auteur** : Opus + référent (Thibault)
- **id YAML cible** : `insuline` · domaine `diabete-type-2`
- **type de nœud** : **MULTI-OPTIONS routé par la SITUATION**. Le patient relève d'**une** des 4 situations
  d'insulinothérapie (mutuellement exclusives) ; **dans** chaque situation, plusieurs recommandations peuvent
  s'empiler (titration + choix de molécule + garde-fous). Le gate `situation_insuline` préfixe chaque option.
  **Design à trancher (§8-1)** : un seul nœud E avec gate de situation, **ou** 4 sous-nœuds (E1-E4).

## 0. Nature de ce dossier & périmètre (garde-fou méthodo)

Nœud E cadré (`CADRAGE-8-noeuds.md §E`) = **« quand et comment initier l'insulinothérapie ? »**. Le référent
étend explicitement le périmètre (2026-07-24) à **tout le cycle de vie de l'insuline en médecine générale**,
en **4 situations distinctes** :

1. **Introduction d'une insuline basale** (patient naïf d'insuline).
2. **Optimisation d'une insuline basale** (titration ; gestion de l'échec de titration / « over-basalisation »).
3. **Ajout d'une insuline rapide sur une basale** (basal-plus → basal-bolus).
4. **Adaptation d'un schéma basal-bolus complet** (répartition, désintensification, garde-fous).

**Nature du nœud : OUTIL D'AIDE À LA PRESCRIPTION en médecine générale.** Le MG **initie et titre** la basale
(consensus : réalisable en soins primaires — ebmfrance), **intensifie** par étapes, et **adapte** un
basal-bolus ; il **oriente** vers le spécialiste au-delà. Le nœud produit, à partir des **critères cliniques
+ des données de MCG (ou de glycémie capillaire) + l'EBM**, une **conduite à tenir adaptée** (initier / choisir
la molécule / titrer / intensifier / sécuriser), en affichant **bénéfices attendus et garde-fous**.

**Périmètre — inclus / exclu :**

- **INCLUS** : (a) **décision d'initier** une basale (échec des non-insulines à dose optimisée, ou
  glucotoxicité symptomatique) ; (b) **choix de la molécule basale** (analogue de 2ᵉ génération vs 1ʳᵉ vs NPH,
  piloté par le risque hypo) ; (c) **schéma de titration** et gestion de l'hypo ; (d) **intensification par
  étapes** (privilégier GLP-1 / combo fixe, puis basal-plus, puis basal-bolus) ; (e) **adaptation** d'un
  basal-bolus + **désintensification** chez le fragile ; (f) **lecture des métriques de MCG** (TIR/TBR/TAR/CV/
  GMI, forme des courbes/AGP) pour orienter l'ajustement, avec repli **glycémie capillaire** si pas de MCG.
- **PÉRIMÈTRE À TRANCHER (§8)** : (i) le **basal-bolus complet** est à la frontière MG/spécialiste — l'outil
  aide à l'**adapter** mais l'instauration d'un schéma lourd peut relever d'un avis spécialisé ; (ii) place des
  **insulines prémélangées / prandiales systématiques** — l'EBM (ebmfrance) les **écarte** de l'insulinothérapie
  moderne du DT2, mais elles existent en vraie vie (à cadrer : les proscrire, ou les afficher en option
  dégradée ?).
- **EXCLU (soins spécialisés)** : **pompe à insuline externe** et **insulinothérapie automatisée en boucle
  fermée** — relèvent des **centres initiateurs** (SFD Paramédical 2022 : instauration hospitalière /
  spécialisée), donc **hors initiation MG**. L'outil peut **orienter** vers ces recours (alerte), sans les
  piloter. **DT1, grossesse, diabètes secondaires/pancréatiques** : hors nœud.
- **EXCLU (autres nœuds)** : le **choix des non-insulines** (metformine, iSGLT2, GLP-1, SU/gliptines) relève
  de B/C/D ; E ne traite l'insuline **qu'en interaction** avec eux (maintenir/associer/arrêter à l'introduction).

**Trois messages structurants attendus** (à étayer par la collecte) :

1. **La basale d'abord, en gardant les non-insulines.** L'insuline **basale du soir associée aux
   antidiabétiques (oraux et/ou GLP-1)** est l'insulinothérapie **de choix** du DT2 (ebmfrance, grade B) ;
   les schémas **prandiaux et prémélangés** augmentent hypoglycémies et prise de poids et **ne sont pas un
   traitement fondé sur les preuves** en 1ʳᵉ intention. `[À VÉRIFIER — collecte]`.
2. **Intensifier par étapes, GLP-1 avant le bolus.** Si la **glycémie à jeun est à la cible mais l'HbA1c
   reste haute** (écart post-prandial), **ne pas sur-titrer la basale** (« over-basalisation ») : ajouter un
   **GLP-1** (ou passer à un **combo fixe** basale+GLP-1), qui **réduit l'HbA1c avec moins d'hypo et un
   bénéfice pondéral** vs un bolus prandial ; réserver le **bolus** (basal-plus au repas principal, puis
   basal-bolus) quand basale+GLP-1 restent insuffisants. `[À VÉRIFIER — collecte]`.
3. **Sécurité d'abord, pas de sur-promesse CV.** Le choix de molécule et de cible se pilote sur le **risque
   hypoglycémique** (analogues de **2ᵉ génération** — glargine U300 / degludec — si risque élevé / fragilité /
   hypo nocturnes) ; l'insuline **améliore le contrôle et prévient les complications microvasculaires** mais
   **n'a pas démontré de bénéfice sur les événements CV ni la mortalité** (ORIGIN neutre) — ne pas la
   survendre, et **surveiller poids + hypo**. `[À VÉRIFIER — collecte]`.

Suit la pipeline `00-global.md` (Cadrer → Collecter → Apprécier → bi-agents → Distiller). Ce fichier fige les
**étapes 1-2** ; les §3-8 seront remplis par la collecte + la vérification bi-agents.

## 1. Question clinique & critères d'entrée (FIGÉ)

- **PICO** :
  - **P** = adulte **DT2** dont le contrôle glycémique justifie une insulinothérapie (échec des non-insulines
    à dose optimisée, ou glucotoxicité symptomatique), **à l'un des 4 stades** d'insulinothérapie (naïf →
    basale → basal-plus → basal-bolus). Hors DT1, grossesse, diabètes secondaires.
  - **I** = **conduite insulinique adaptée** : initier / choisir la molécule / titrer / intensifier (GLP-1 →
    bolus) / adapter / désintensifier / sécuriser, **guidée par les métriques de MCG** (ou la glycémie
    capillaire) et le terrain.
  - **C** = poursuite du traitement en cours sans insuline ; schéma insulinique non optimisé ;
    intensification prandiale d'emblée ; molécule basale de 1ʳᵉ génération / NPH.
  - **O = critères DURS** : mortalité toutes causes / CV, événements CV majeurs, **hypoglycémie sévère**
    (critère dur de sécurité), complications microvasculaires — **vs SUBSTITUTION** : HbA1c, glycémie à jeun,
    **TIR / TBR / TAR / CV / GMI**, poids, doses d'insuline. La distinction **contrôle glycémique &
    métriques de MCG (obtenus, substituts) vs événements CV/mortalité (non démontrés pour l'insuline —
    ORIGIN)** est décisionnelle (message n°3) ; l'**hypoglycémie sévère** est le principal critère **dur**
    qui départage les molécules basales (message n°3).

- **Variables d'entrée** (→ `criteres_entree`) :

  **A. Situation d'insulinothérapie (gate, NOUVELLE variable)**
  - `situation_insuline` (enum : `naif` · `basale_seule` · `basale_plus_bolus` · `basal_bolus`) — **routeur**
    du nœud. *Alternative de modélisation (§8-1) : dériver de `traitements_en_cours` (contient
    `insuline_basale` / `insuline_rapide`).*

  **B. Données cliniques réutilisées des autres nœuds**
  - `HbA1c_actuelle` (nombre, %) — B/C/E. Écart à la cible = moteur de l'intensification.
  - `HbA1c_cible` (nombre, %) — **sortie du nœud A** (chaînage inter-nœuds) : borne l'objectif.
  - `DFG` (nombre, mL/min/1,73 m²) — B/C/D/E. Besoins insuliniques ↓ et risque hypo ↑ si bas ; SU à proscrire.
  - `IMC` (nombre, kg/m²) — poids = enjeu de l'insuline (favoriser GLP-1/iSGLT2 associés).
  - `fragilite` (bool) · `esperance_vie` (enum : `longue`/`intermediaire`/`limitee`) — A/E : relâchent la
    cible, orientent vers la 2ᵉ génération et la **désintensification**.
  - `risque_hypoglycemie_schema` (enum : `faible`/`eleve`) — A/C/D/E : pilote le **choix de molécule** et la cible.
  - `traitements_en_cours` (liste) — B/C/D/E : contient-il `aGLP1` (→ combo/priorité bolus), `metformine`,
    `iSGLT2` (→ alerte acidocétose euglycémique), `sulfamide`/`glinide` (→ **arrêter** à l'introduction),
    `insuline_basale`, `insuline_rapide` ?
  - `preference_injection` (enum : `accepte`/`refuse`/`indifferent`) — B/C/E.
  - `symptomes_glucotoxicite` (bool, **NOUVELLE** — validée en cadrage §5 pour E) — polyurie/polydipsie/
    amaigrissement/asthénie : **déclencheur d'initiation d'emblée** (± transitoire), indépendamment de l'HbA1c.

  **C. Données de MCG (NOUVELLE dimension) — ou glycémie capillaire en repli**
  - `mcg_disponible` (bool) — bascule MCG ↔ capillaire.
  - `TIR` (nombre, % ; temps dans la cible 70-180 mg/dL / 3,9-10 mmol/L) — cible consensus **> 70 %**.
  - `TBR` (nombre, % < 70 mg/dL / < 3,9 mmol/L, « time below range » niveau 1) — cible **< 4 %**.
  - `TBR_severe` (nombre, % < 54 mg/dL / < 3,0 mmol/L, niveau 2) — cible **< 1 %** ; **priorité sécurité**.
  - `TAR` (nombre, % > 180 mg/dL / > 10 mmol/L) — cible **< 25 %** (+ TAR niv. 2 > 250 mg/dL **< 5 %**).
  - `CV_glycemique` (nombre, % ; variabilité, coefficient de variation) — cible **≤ 36 %** (> 36 % = instable,
    risque hypo).
  - `GMI` (nombre, % ; « glucose management indicator », estimation de l'HbA1c) — recoupe l'HbA1c mesurée.
  - `profil_glycemique` (**`liste` à choix MULTIPLE** — §8-3 tranché : `hypo_nocturne` · `phenomene_aube` ·
    `excursions_postprandiales` · `hypo_interprandiale` · `stable`) — **forme des courbes / AGP** ; oriente
    **quelle** insuline ajuster. Le MG peut cocher **plusieurs** motifs ; **chaque motif porte un tooltip de
    lecture de la courbe** (pédagogie AGP). Pilote le **texte de conduite à tenir**, ne gate pas les options
    (sauf via l'axe sécurité TBR/CV, §8-4).
  - `GAJ` (nombre, glycémie à jeun) — **repli capillaire** (si `mcg_disponible == false`) : pilote la
    titration de la basale (ebmfrance : cible GAJ 4-7 mmol/L env.).

  **D. Doses — aide au CALCUL (NOUVELLES variables, §8-7 tranché : le poids + les doses actuelles permettent
  de calculer les doses proposées ; le RATIO vit dans l'argumentaire ; le calcul est fait au niveau du
  FORMULAIRE — précédent nœud C `cible_atteinte`/`sur_traitement` —, le moteur ne gate que des booléens)**
  - `poids` (nombre, kg) — **dose d'initiation calculée** = poids × **0,1-0,2 U/kg/j** (HAS R.87 / SFD Avis 18 /
    ADA ; ratio affiché en argumentaire). Alternative sans poids : **10 U le soir** (ebmfrance, fixe).
  - `dose_basale_actuelle` (nombre, U/j) — base des **majorations** (+2 U ou +10-20 %/paliers si > 40 U),
    **diminutions** (−2 à −4 U ou −10-20 %), **amorce basal-plus** (≈ 10 % de la basale au repas principal), et
    du **repère d'over-basalisation** (dose/`poids` > 0,5 U/kg).
  - `dose_rapide_actuelle` (nombre, U/j — total prandial) — base des **ajustements du bolus** (situation 4 /
    basal-plus).
  - `over_basalisation` (bool **DÉRIVÉ** — calculé par le formulaire : `dose_basale_actuelle / poids > 0,5`,
    comme les critères dérivés du nœud C) — **déclenche une alerte info** « ne pas poursuivre la titration,
    préférer GLP-1/bolus » (l'option 2c est gatée sur `gaj_a_cible + cible_atteinte==false`, l'over-basalisation
    étant un signal corroborant affiché en alerte, pas le gate — corrigé étape 8). Seuil 0,5 U/kg `[À VÉRIFIER]`
    (repère SFD/Méd. Geek, §6).

- **Cibles de MCG — standard vs personnes âgées/fragiles** (consensus international, à confirmer collecte) :
  standard (TIR > 70 %, TBR < 4 %, TBR sévère < 1 %, TAR < 25 %, CV ≤ 36 %) ; **assouplies** si âgé/fragile /
  risque hypo élevé (**TIR > 50 %, TBR < 1 %**, priorité à la réduction de l'hypo). `[À VÉRIFIER — collecte]`.

- **⚠ Point méthodologique majeur (règle « granularité si EBM », `00-global.md`)** : les **cibles de MCG**
  (TIR > 70 % etc.) sont un **CONSENSUS D'EXPERTS internationaux** (Battelino 2019) ; le lien **TIR ↔
  complications** est **OBSERVATIONNEL** (Beck 2019), et la preuve à **critère dur** d'une gestion **guidée par
  la MCG** en DT2 non intensif est **limitée** (bénéfice surtout sur l'HbA1c — substitut — et sur l'hypo).
  → **Conséquence à trancher (§8-4)** : les métriques de MCG doivent-elles **piloter** des options (gates
  durs) ou surtout **guider l'interprétation/titration et les alertes de sécurité** (affichées comme
  consensus), les **gates durs** restant l'HbA1c, la glucotoxicité et l'**hypoglycémie** ? *Reco a priori :
  gate dur = hypo + HbA1c/symptômes ; MCG = interprétation + alertes (consensus affiché).*

## 2. Options envisagées (esquisse FIGÉE — intitulés & gates ; seuils/chiffres à confirmer par collecte)

Nœud **multi-options routé par `situation_insuline`**. Chaque option porte le gate de sa situation. Les
métriques de MCG et le terrain **modulent** le libellé, le choix de molécule et les alertes.

### Situation 1 — Naïf d'insuline (`situation_insuline == naif`)

- **1a. Initier une insuline basale** — `HbA1c_actuelle > HbA1c_cible` malgré non-insulines optimisées (dont
  GLP-1 si indiqué/toléré) **OR** `symptomes_glucotoxicite == true`. Schéma : basale du soir 10 U, titration
  par auto-ajustement (GAJ), **maintien** metformine ± iSGLT2 ± GLP-1, **arrêt du sulfamide/glinide**.
  Bénéfice : contrôle glycémique, prévention microvasculaire ; garde-fous : hypo, poids. `niveau_preuve` :
  **modéré** (efficacité glycémique établie ; pas de bénéfice CV — ORIGIN).
- **1b. Choix de la molécule basale — 2ᵉ génération** — `risque_hypoglycemie_schema == eleve OR fragilite ==
  true OR esperance_vie == limitee` → glargine **U300** ou **degludec** (moins d'hypo, notamment nocturnes —
  DEVOTE/SWITCH). Sinon glargine U100 acceptable ; **NPH à éviter** (plus d'hypo). `niveau_preuve` : **modéré**.
- **1c. GLP-1 avant / avec l'insuline** — `traitements_en_cours ne contient pas aGLP1` et pas de CI → envisager
  un **GLP-1** (CV, poids) **avant** ou **associé** à la basale ; **combo fixe** (degludec+liraglutide /
  glargine+lixisénatide) une option pour simplifier. `niveau_preuve` : **modéré** (renvoi nœud B/C pour le GLP-1).

### Situation 2 — Basale seule à optimiser (`situation_insuline == basale_seule`)

- **2a. Titrer la basale** — GAJ / TIR pas à la cible **ET** pas d'hypo (TBR bas) → **monter** la dose
  (algorithme d'auto-ajustement). `niveau_preuve` : **modéré**.
- **2b. Corriger l'hypoglycémie / la variabilité** — `TBR` élevé **OR** `profil == hypo_nocturne` **OR**
  `CV_glycemique > 36` **OR** hypo sévères → **réduire** la dose, **passer en 2ᵉ génération**, **relâcher** la
  cible. **Sécurité prioritaire.** `niveau_preuve` : **modéré**.
- **2c. Ne pas sur-titrer → intensifier autrement (« over-basalisation »)** — **GAJ à la cible MAIS
  `HbA1c_actuelle > HbA1c_cible`** (écart post-prandial : TAR diurne élevé, TIR bas malgré GAJ correcte),
  dose basale élevée (> 0,5 U/kg `[À VÉRIFIER]`) → **ne pas augmenter la basale** ; **ajouter un GLP-1**
  (ou combo fixe) de préférence, ou passer à la situation 3 (bolus). `niveau_preuve` : **modéré**.

### Situation 3 — Ajout d'une insuline rapide / basal-plus (`situation_insuline == basale_plus_bolus`, ou 2c non résolu)

- **3a. GLP-1 / combo fixe d'abord (si non fait)** — priorité au GLP-1 avant le bolus (moins d'hypo, poids). 
- **3b. Ajouter UN bolus au repas principal (basal-plus)** — après échec de basale+GLP-1 : **1 injection**
  d'analogue rapide au repas le plus hyperglycémiant (guidé par MCG : plus grosse excursion post-prandiale),
  plutôt qu'un basal-bolus complet d'emblée (approche progressive — 4T, FullSTEP). `niveau_preuve` : **modéré**.
- **3c. Éviter les prémélangées / le prandial systématique** — non fondé sur les preuves en 1ʳᵉ intention
  (ebmfrance) : plus d'hypo et de poids. *(À cadrer §8-2 : proscrire ou option dégradée.)*

### Situation 4 — Basal-bolus complet à adapter (`situation_insuline == basal_bolus`)

- **4a. Optimiser la répartition** — équilibrer basal/bolus (~50/50), ajuster ratios glucides / facteur de
  sensibilité / corrections, **guidés par le profil AGP** (hypo nocturne → ↓ basale ; excursions
  post-prandiales → ↑ bolus / timing ; hypo interprandiale → ↓ bolus). `niveau_preuve` : **faible-modéré**.
- **4b. Désintensifier / alléger** — `fragilite == true OR esperance_vie == limitee OR` hypo sévères
  récurrentes → **relâcher la cible**, **simplifier** le schéma, envisager GLP-1 pour réduire les besoins.
  `niveau_preuve` : **modéré** (sécurité).
- **4c. Orienter vers le spécialiste / pompe-boucle fermée** — instabilité majeure, `CV_glycemique` très
  élevé, hypo sévères non maîtrisées → **avis spécialisé** (hors initiation MG — SFD Paramédical 2022).

### Alertes (D15) envisagées (rappels transverses, pas des options)

- **Hypoglycémie sévère récurrente / non-perception** → priorité absolue : ↓ objectif, 2ᵉ génération,
  éducation, envisager MCG / avis spécialisé. `[À VÉRIFIER]`.
- **Arrêter/adapter sulfamide & glinide** à l'introduction de l'insuline (hypoglycémie cumulée). `[À VÉRIFIER]`.
- **iSGLT2 + insuline** : bénéfice mais **acidocétose euglycémique** possible (surveiller, éduquer,
  arrêter si jeûne/chirurgie/maladie aiguë). `[À VÉRIFIER]`.
- **DFG bas** : besoins en insuline ↓, risque hypo ↑ (adapter) ; **sulfamides à proscrire**. `[À VÉRIFIER]`.
- **Prise de poids sous insuline** → réévaluer, associer GLP-1 / iSGLT2, ne pas sur-doser. `[À VÉRIFIER]`.
- **Cibles de MCG** : standard (TIR > 70 %, TBR < 4 %, TBR sévère < 1 %, TAR < 25 %, CV ≤ 36 %) **vs
  assouplies** (âgé/fragile : TIR > 50 %, TBR < 1 %) — **consensus d'experts**, pas critère dur. `[À VÉRIFIER]`.
- **Pas de bénéfice CV démontré de l'insuline** (ORIGIN neutre) → bénéfice = microvasculaire / levée de
  glucotoxicité ; ne pas survendre. `[À VÉRIFIER]`.
- **Glucotoxicité aiguë / cétose / décompensation** → insuline **sans délai** ± avis spécialisé. `[À VÉRIFIER]`.

**Garde-fous de voix (à tenir en rédaction)** : ✗ ne pas revendiquer un bénéfice CV/mortalité pour l'insuline ;
✗ ne pas présenter les cibles de MCG comme des critères durs (consensus) ; ✗ ne pas banaliser prémix/prandial
systématique ; distinguer partout **contrôle & métriques de MCG (substituts obtenus)** vs **hypoglycémie
sévère & complications (critères durs)**.

## Sources en main & plan de collecte (2026-07-24)

**Déjà en main (réutilisable — `docs/decision/sources/`)** :
- **ebmfrance — « Insulinothérapie dans le DT2 »** (Duodecim/EBM Guidelines, contextualisé HAS 2024) :
  basale du soir + oraux/GLP-1 = **choix (grade B)** ; **prandial/prémix non EBM** ; titration 10 U + auto-
  ajustement ; **glargine U300 / degludec < glargine U100 / détémir < NPH** pour l'hypo (grade B) ; GLP-1 si
  GAJ à cible mais HbA1c haute ; réf. **DEVOTE, SWITCH 2, BRIGHT, 4T (Yki-Järvinen 1992), Trujillo**.
- **Prescrire** (`sources/prescrire-dt2.md`) : **P1=P4** (insuline en ajout si HbA1c très élevé / prise de
  poids non prioritaire ; GLP-1 « le plus souvent 1er choix » avant) ; **P3** (2ᵉ ligne, effets indésirables
  insulines : hypo, poids, aggravation rétinopathie si baisse rapide d'HbA1c) ; **P5** (liraglutide) ;
  **P8** (FLOW/sémaglutide rénal). Ligne : objectif = complications, EV faible → ne pas ajouter tant que
  HbA1c ≤ 8,5-9 %.
- **Référentiel MCG SFD 2017** (`mmm_referentielmcg_ep11.pdf`, *Méd. Mal. Métab.* Hors-série, position
  d'experts français) : **éducation + interprétation de l'AGP** (usage pratique de la MCG). *NB : antérieur au
  consensus international TIR 2019 → les cibles chiffrées viennent surtout de Battelino 2019.*
- **Position SFD Paramédical 2022** (`pdp_pompe_insuline_externe_mcg.pdf`) : pompe externe + **MCG** + **boucle
  fermée** ; **objectifs glycémiques & réduction des hypo sous MCG** (§4), **indications MCG / flash** (§6),
  **évaluation MCG à l'initiation et à 3 mois** (§6.8) ; **borne de périmètre** : pompe/boucle fermée =
  **centres initiateurs** (spécialisé, hors MG).
- **HAS 2024** (`strategie_therapeutique…pdf`) + **SFD 2025** (`SFD 2025.pdf`) : place de l'insuline, schémas,
  remboursement de la MCG chez le DT2 insuliné — à recouper au red-team (lecture primaire).

**Collecte lancée — 5 sous-dossiers bi-agents (Agent A extraction ; red-team Agent B ultérieur)** :

1. **E1 — Initiation & choix de la basale** : quand initier (échec non-insulines / HbA1c > cible /
   glucotoxicité) ; basale = choix (prandial/prémix écartés) ; **Treat-to-Target** (Riddle 2003), **4T**
   (Holman 2007/2009 : basal vs prandial vs biphasique en ajout aux oraux), **ORIGIN** (glargine, CV neutre,
   initiation précoce), glargine/détémir **vs NPH** (métas Cochrane), maintien des oraux/GLP-1, algorithme de
   titration.
2. **E2 — Sécurité hypoglycémique & analogues de 2ᵉ génération** : **DEVOTE** (degludec vs glargine U100 : MACE
   non-inf + hypo sévère), **SWITCH 1/2** (Lane/Wysham), **BRIGHT** (glargine U300 vs degludec), **CONCLUDE** ;
   hypo nocturne, variabilité, poids. Message : 2ᵉ génération si risque hypo élevé / fragilité / hypo nocturnes.
3. **E3 — Intensification : basale+GLP-1 vs bolus vs basal-bolus** : **basal-plus/basal-bolus** (4T, **FullSTEP**
   Rodbard) ; **combos fixes** — **Xultophy** (DUAL, dont **DUAL VII** vs basal-bolus), **Suliqua** (LixiLan-L/O) ;
   **GLP-1 add-on à la basale** ; prémélangées (non recommandées). Message : **GLP-1/combo fixe avant le bolus** ;
   bolus au repas principal puis full basal-bolus si insuffisant.
4. **E4 — MCG : métriques, cibles & interprétation (TIR/TBR/TAR/CV/GMI/AGP)** : **consensus international TIR**
   (**Battelino, *Diabetes Care* 2019**), **SFD 2017** (interprétation AGP), **SFD Paramédical 2022** (objectifs,
   évaluation) ; cibles **standard vs âgé/fragile** ; **TIR ↔ complications** (**Beck 2019**, observationnel) ;
   **MOBILE** (Martens, *JAMA* 2021 : MCG en basale seule, ↓ HbA1c — substitut) ; comment les métriques orientent
   l'ajustement ; **glycémie capillaire** si pas de MCG (schémas d'auto-surveillance).
5. **E5 — Recommandations officielles & divergence** : **HAS 2024**, **SFD 2025**, **CMG**, **ADA/EASD 2022**
   (insuline après GLP-1 ; basal-plus ; place de la MCG), **ADA Standards 2026**, **Prescrire** (P1/P3/P5/P8),
   **ebmfrance** (basal-only ; prandial/prémix non EBM). Divergences : place de la **MCG** en DT2 (surtout
   insuliné), **prandial/prémix**, **cibles TIR**, GLP-1 vs bolus.

### État de collecte (2026-07-24)

- Agents A (sous-dossiers E1-E5) : **REÇUS** ce jour → **§3 consolidé** ci-dessous (grilles par étude, PMID/DOI,
  flags `[À VÉRIFIER]` conservés ; ★ = décisionnel, à red-teamer).
- **OE 2ᵉ passe (référent)** : **REÇUE** ce jour (rapport unique E1-E5) → **consolidée en §5a** (confirmations,
  nouveaux essais `[à vérif. primaire]`, discordances A×OE).
- Red-team Agent B (vérif. PMID/DOI/chiffres vs source primaire) : **LANCÉ** (3 sous-agents B1 E1+E2 · B2 E3 ·
  B3 E4+E5) — cible prioritaire : discordances A×OE (§5a) + chiffres décisionnels ★ + flags `[À VÉRIFIER]`.

## 3. Base de preuves (grille par étude clé) — CONSOLIDÉE (agents A, 2026-07-24 ; ★ = décisionnel, à red-teamer)

> **Garde-fou** : contenu = **extractions agents A** (source primaire annoncée mais **non encore re-vérifiée
> par le red-team Agent B**). Aucun chiffre ne passe en « confirmé » ni n'entre au YAML avant vérification B
> contre la source primaire. Les `[À VÉRIFIER]` sont recensés en fin de §3. NB méthode agents A : plusieurs
> chiffres NEJM/Lancet extraits d'**abstracts PubMed** (fetch texte intégral bloqué) → statut secondaire flagué.

### SOUS-DOSSIER E1 — Initiation de la basale & choix du schéma de départ

| Essai (PMID/DOI) | Design / population | Intervention / comparateur / durée | Résultats (absolu + relatif ; **DUR vs SUBSTITUT**) | GRADE |
|---|---|---|---|---|
| **Treat-to-Target** (Riddle, *Diabetes Care* 2003 · **PMID 14578243** · 10.2337/diacare.26.11.3080) | RCT ouvert, n=756, DT2 surpoids HbA1c 7,5-10 % sur 1-2 oraux | Glargine U100 vs **NPH** le soir, titration sur GAJ ≤100 mg/dL · 24 sem | **SUBSTITUT** : HbA1c finale **6,96 % vs 6,97 %** (~60 % ≤7 % 2 bras). ★ **33,2 % vs 26,7 %** atteignent ≤7 % **sans hypo nocturne** ; hypo nocturne/sympt. −21-48 % sous glargine. Prouve la faisabilité de la titration sur GAJ. | **modéré** (RCT unique, ouvert, industrie) |
| **4T — 1 an** (Holman, *NEJM* 2007 · **PMID 17890232** · 10.1056/NEJMoa075392) | RCT n=708, HbA1c 7-10 %, sous **metformine + sulfamide** | 3 bras en ajout : **biphasique** ×2 / **prandial** ×3 / **basal** (détémir) ×1(-2) · 1 an | **SUBSTITUT** HbA1c : biph 7,3 / prand 7,2 / **basal 7,6 %** ; ≤6,5 % : 17,0/23,9/**8,1 %**. ★ **Sécurité** : hypo **2,3 (basal) vs 5,7 (biph) vs 12,0 (prandial)** évén./pt/an ; poids **+1,9 / +4,7 / +5,7 kg** → **basal = moins d'hypo & de poids**. | **modéré-élevé** |
| **4T — 3 ans** (Holman, *NEJM* 2009 · **PMID 19850703** · 10.1056/NEJMoa0905479 `[à vérif. primaire]`) | Suivi 3 ans (ajout d'une 2ᵉ insuline permis) | idem + intensification | HbA1c médiane converge : biph 7,1 / prand 6,8 / **basal 6,9 %** ; ≤6,5 % 31,9/44,7/**43,2 %**. Hypo médiane **1,7 (basal) < 3,0 (biph) < 5,7 (prandial)**. ★ **81,6 %** du bras basal ont **dû ajouter une 2ᵉ insuline** (→ intensification = situations 3-4). | **modéré** (extension, abstract) |
| ★ **ORIGIN** (Gerstein, *NEJM* 2012 · **PMID 22686416** · 10.1056/NEJMoa1203858) | RCT 2×2, n=12 537, dysglycémie/DT2 précoce + haut risque CV · médiane **6,2 ans** | **Glargine** titrée (normoglycémie à jeun) vs soins standard | ★ **DUR** : MACE **HR 1,02 (0,94-1,11)** ; mortalité toutes causes NS ; **cancers HR 1,00** → **CV-neutre, pas de bénéfice dur, pas de sur-risque cancer**. Hypo sévère **1,00 vs 0,31/100 pers.-an** (≈ ×3) ; poids **+1,6 vs −0,5 kg**. | **élevé** (grand RCT, long, critères durs) |
| **Cochrane analogues vs NPH** (Horvath, 2007 · **PMID 17443605** · CD005613) | Méta 8 RCT (glargine/détémir vs NPH) · 24-52 sem | Analogue 1ʳᵉ gén vs **NPH** | **SUBSTITUT** : pas de différence d'HbA1c ; ★ **hypo sympt. & nocturne moindres** sous analogues ; **hypo SÉVÈRE : pas de différence** (dur) ; **aucun bénéfice mortalité/morbidité/QdV/coûts** → bénéfice « mineur », prudence. | **modéré** |
| **GRADE Study** (Nathan, *NEJM* 2022 · **PMID 36129996** `[à vérif. primaire]`) | RCT n=5047, DT2 <10 ans, HbA1c 6,8-8,5 %, sous metformine · ~5 ans | Ajout **glargine U100** vs glimépiride vs sitagliptine vs **liraglutide** | **SUBSTITUT** (primaire = HbA1c ≥7 % confirmée) : glargine 26,5 ≈ lira 26,1 < glimépiride 30,4 < sitagliptine 38,1 /100 p-a → **glargine parmi les plus durables**. Hypo sévère % : glimé 2,2 / **glargine 1,3** / lira 1,0 / sita 0,7. **iSGLT2 non testé.** | **modéré** |

**Ancrages primaires de l'affirmation « prandial/prémix hors 1ʳᵉ intention »** : **Yki-Järvinen 1992** (*NEJM*, PMID 1406860, insuline du soir + oral) et **Yki-Järvinen & Kotronen 2013** (*Diabetes Care* Suppl, PMID 23882047, revue anti-prémix/prandial) — cités par ebmfrance, à verser au dossier.

**Message E1** : initier quand HbA1c **> cible** malgré non-insulines optimisées / CI-intolérance / **glucotoxicité symptomatique**. **Basale du soir + antidiabétiques (oraux/GLP-1) = choix (ebmfrance grade B)** ; meilleur profil hypo/poids (4T). **Prandial & prémix/biphasique = HORS 1ʳᵉ intention EBM** (plus d'hypo & de poids, pas de gain durable — 4T + Yki-Järvinen 2013). **Analogue vs NPH** = avantage sur l'hypo nocturne (substitut), **pas** sur l'hypo sévère ni de critère dur → ne pas survendre. **ORIGIN** : la basale titrée est **CV-neutre**, sans sur-risque de cancer, au prix de ~3× plus d'hypo sévère et +~2 kg. Bénéfice de l'insuline = contrôle glycémique / prévention microvasculaire (**extrapolé** du contrôle glycémique, pas d'un RCT insuline à critère dur). Titration : 10 U le soir, +2 U si GAJ ≥6 mmol/L ×3 j, cible GAJ 4-6 (à 7) mmol/L.

### SOUS-DOSSIER E2 — Sécurité hypoglycémique : analogues basaux de 2ᵉ génération

| Essai (PMID/DOI) | Design / population | Comparateur / durée | Hypo (sévère + nocturne, absolu/arm + RR/NNT) · HbA1c · MACE — **dur vs substitut** | GRADE |
|---|---|---|---|---|
| ★ **DEVOTE** (Marso, *NEJM* 2017 · **PMID 28605603**) | RCT **double-aveugle**, event-driven CV, n=7637, DT2 16 ans, HbA1c 8,4 %, **85 % MCV/IRC** (très haut risque) | **Degludec vs glargine U100** · ~2 ans | ★ **DUR — MACE (non-inf)** 8,5 vs 9,3 %, **HR 0,91 (0,78-1,06)** (pas de supériorité). ★ **DUR — hypo SÉVÈRE 4,9 % (187) vs 6,6 % (252), RR 0,60 (−40 %), p<0,001 ; ARR 1,7 % → NNT ≈ 59/2 ans.** HbA1c 7,5 % 2 bras (équivalent). Financé Novo. | **modéré** (severe = 2ᵉ pré-spécifié adjudiqué ; MACE non-inf = élevé) |
| **DEVOTE 3** (Pieber, *Diabetologia* 2018 · PMID 28913543) | Analyse secondaire (association temporelle) | — | **L'hypo sévère prédit la mortalité : HR 2,51 (1,79-3,50)** → justifie qu'elle est un critère **dur** (association, non causale). | modéré (obs. intra-ECR) |
| ★ **SWITCH 2** (Wysham, *JAMA* 2017 · **PMID 28672317**) | RCT double-aveugle **cross-over**, n=721, ≥1 FDR hypo, déjà sous basale | Degludec vs glargine U100 · 2×32 sem | ★ **SUBSTITUT** hypo sympt. globale (maintenance) **185,6 vs 265,4/100 p-a, RR 0,70** ; nocturne **RR 0,58**. **DUR — hypo SÉVÈRE 1,6 % vs 2,4 %, p=0,35 → NON significatif.** HbA1c équivalent (treat-to-target). Financé Novo. | **modéré** (le critère dur n'est pas atteint) |
| **BRIGHT** (Rosenstock, *Diabetes Care* 2018 · **PMID 30104294**) | RCT **ouvert**, non-inf, n=929, insulino-naïfs, HbA1c 8,6-8,7 % · 24 sem | **Glargine U300 vs degludec** (tête-à-tête 2ᵉ gén) | **Équivalence HbA1c** (7,0 % ; Δ −0,05 %). **Hypo comparable sur 24 sem** ; seul signal : période de **titration (0-12 sem)** moindre sous U300. Severe/nocturne/poids non détaillés (abstract). Financé Sanofi. | **modéré** (équivalence — pas de gain d'un 2ᵉ gén sur l'autre) |
| **CONCLUDE** (Philis-Tsimikas, *Diabetologia* 2020 · **PMID 31984443**) | RCT **ouvert**, n=1609, basale insuffisante | **Degludec U200 vs glargine U300** | ★ **PRIMAIRE (hypo sympt. globale, maintenance) NÉGATIF : RR 0,88 (0,73-1,06), NS.** Test hiérarchique rompu → nocturne (RR 0,63) & sévère (RR 0,20) = **hypothèse-générateurs seulement**. Controverse méthodo (lecteur glycémique). Financé Novo. | **faible** (primaire manqué ; ouvert) |
| **Méta EDITION 1-2-3** (Ritzel, *DOM* 2015 · **PMID 25929311**) | Méta patient-level, n=2496 · 6 mois | **Glargine U300 vs U100** | HbA1c Δ **−1,02 % 2 bras** (équivalent). **SUBSTITUT** nocturne confirmée **−31 %** ; toute heure −14 %. **DUR — hypo SÉVÈRE rare & non différente : 2,3 % vs 2,6 %.** Poids −0,28 kg (marginal). Financé Sanofi. | **modéré** |

**Message E2** : le bénéfice des 2ᵉ générations porte **massivement sur un substitut (hypo nocturne/symptomatique)** — SWITCH 2 RR 0,70/0,58 ; EDITION U300 −31 % nocturne ; Cochrane (1ʳᵉ gén vs NPH) idem. **Sur le critère DUR (hypo sévère), une seule démonstration solide : DEVOTE** (degludec vs glargine U100, RR 0,60, **NNT ≈ 59/2 ans**), et en population **très haut risque**. Ailleurs l'hypo sévère n'est **pas** significativement réduite (SWITCH 2 p=0,35 ; CONCLUDE primaire négatif). **Aucun bénéfice de morbi-mortalité** (DEVOTE = non-infériorité MACE). **Entre 2ᵉ gén (degludec vs U300) : pas de différence robuste** (BRIGHT équivalence ; CONCLUDE primaire manqué). **COI systématiques** (fabricant = financeur du produit avantagé). **→ Encodage** : préférer un analogue de 2ᵉ génération **si risque hypo élevé / fragilité / hypo nocturnes** (bénéfice principal = hypo nocturne, substitut ; + hypo sévère pour degludec vs U100 uniquement). Pas de bénéfice CV revendiqué ; pas de supériorité d'un 2ᵉ gén sur l'autre. NPH/U100 par défaut, surcoût des 2ᵉ gén à peser.

### SOUS-DOSSIER E3 — Intensification : basale + GLP-1 (combo fixe) vs bolus / basal-bolus

| Essai (PMID/DOI) | Design / population | Comparateur / durée | HbA1c · hypo (sévère) · poids · injections — **absolu + relatif** | GRADE |
|---|---|---|---|---|
| ★ **DUAL VII** (Billings, *Diabetes Care* 2018 · **PMID 29483185** · 10.2337/dc17-1114) | RCT ouvert, sous glargine U100 20-50 U + metformine, HbA1c 8,2 %, n≈506 | **IDegLira (Xultophy, 1 inj)** vs **basal-bolus** (glargine + aspart, **non plafonné**) · 26 sem | **HbA1c 6,7 % vs 6,7 %** (ETD −0,02, **non-inf**). ★ hypo (sévère-ou-BG) **1,07 vs 8,17 évén./pt-an, rate ratio 0,11** ; ★ **poids −0,92 vs +2,64 kg (ETD −3,6 kg)** ; ★ **1 inj vs ≥4** ; dose 40 vs 84 U. **= essai le plus propre** (comparateur non plafonné). | **modéré** (substitut ; ouvert ; Novo) |
| **DUAL II** (Buse, *Diabetes Care* 2014 · **PMID 25114296**) | RCT double-aveugle, basale 20-40 U + metformine, HbA1c 8,8 %, n=413 | IDegLira vs **dégludec seul** (**2 bras plafonnés 50 U** → biais pro-combo) · 26 sem | HbA1c −1,9 vs −0,9 % (ETD −1,1) ; poids −2,7 vs 0 kg ; hypo **comparable 24 vs 25 %**. Montre l'apport du liraglutide, **comparateur bridé**. | modéré↓ (spin comparateur) |
| **LixiLan-L** (Aroda, *Diabetes Care* 2016 · **PMID 27650977**) | RCT ouvert, basale + metformine, HbA1c 8,5 %, n=736 | **iGlarLixi (Suliqua)** vs glargine (**plafond 60 U**) · 30 sem | HbA1c 6,9 vs 7,5 % (−0,6) ; <7 % : 55 vs 30 % ; poids −0,7 vs +0,7 kg (−1,4) ; **hypo comparable** (comparateur = basale, pas bolus). | modéré↓ |
| ★ **FullSTEP** (Rodbard, *Lancet Diab Endo* 2014 · **PMID 24622667**) | RCT ouvert phase 4, basale + ADO, HbA1c 7,9 %, diab. 12,6 ans, n=401 | **Basal-plus par étapes** (1 bolus au plus gros repas, +bolus si HbA1c≥7) vs **basal-bolus d'emblée** · 32 sem | HbA1c −0,98 vs −1,12 % (**non-inf**). ★ **hypo rate ratio 0,58 (0,45-0,75)** (moins sous basal-plus) ; **poids similaire** ; satisfaction ↑. | **modéré** → basal-plus d'abord |
| ★ **Eng (méta indépendante)** (*Lancet* 2014 · **PMID 25220191**) | Méta 15 RCT, n=4348, **sans lien industriel** | GLP-1 + basale vs comparateurs (dont **vs basal-bolus**) | Global HbA1c −0,44 %, poids −3,22 kg. ★ **vs basal-bolus : HbA1c −0,1 % (≥ équivalent), hypo RR 0,67, poids −5,66 kg** (IC large). | **modéré** (pilier du message) |
| **Maiorino** (*Diabetes Care* 2017 · PMID `[à vérif.]`) | Méta 36 RCT, n=14 636 | GLP-1 + insuline vs insuline intensifiée | Global HbA1c −0,49 %, à la cible **RR 1,77**, poids −2,5 kg. **vs intensifié : contrôle similaire, moins d'hypo, meilleur poids.** | modéré (corrobore Eng) |
| **4T** (voir E1) | — | prémix vs prandial vs basal | **biphasique le pire** pour ≤6,5 % ; **prandial = le plus d'hypo (5,7/pt/an) & de poids.** | modéré |

**Message E3** : **GLP-1 / combo fixe AVANT le bolus** — sur une basale insuffisante, ajouter un GLP-1 (ou basculer en **IDegLira/iGlarLixi**) donne **la même HbA1c que le basal-bolus** avec **moins d'hypo, une perte de poids, 1 injection au lieu de ≥4** (★ DUAL VII ; ★ Eng vs basal-bolus : hypo RR 0,67, poids −5,7 kg ; Maiorino concordant). Le **GLP-1 libre hebdo (séma/dula) ≈ combo fixe** pour la « trifecta » substitutive, avec en plus la meilleure preuve CV (le combo apporte la simplicité mais contient lixisénatide/liraglutide et ses essais plafonnent souvent le comparateur). **Si bolus nécessaire** (hypercatabolisme, HbA1c très haute) : **basal-plus d'abord** (★ FullSTEP hypo RR 0,58) plutôt que basal-bolus d'emblée. **Prémix/biphasique = bas / non EBM** (4T : le pire ; ebmfrance/SFD : moins flexible, plus d'hypo & de poids). **Aucun critère dur** pour les combos fixes (pas de CVOT).

### SOUS-DOSSIER E4 — MCG : métriques, cibles & interprétation (TIR/TBR/TAR/CV/GMI/AGP)

**Distinction fondamentale** : (a) **cibles** = **CONSENSUS d'experts** (Battelino/ATTD 2019, non gradable comme preuve d'intervention) ; (b) **lien TIR → complications** = **OBSERVATIONNEL, dérivé en DT1** (Beck 2019, ré-analyse DCCT) ; (c) **bénéfice d'une PEC guidée par MCG** = ECR à **substituts** (HbA1c, TIR, temps en hypo), **pas** de critère dur en DT2. *(Le TIR est un substitut encore plus en amont que l'HbA1c.)*

**Cibles Battelino 2019 (adulte DT2 non enceinte) — triangulées Battelino + SFD Paramédical 2022 (Fig. 2) + SFD 2025 (Tab. II)** :

| Métrique | Cible standard | Assouplie (âgé / haut risque hypo) |
|---|---|---|
| **TIR** 70-180 mg/dL (3,9-10 mmol/L) | ★ **> 70 %** | ★ **> 50 %** |
| **TBR** < 70 mg/dL (niv. 1) | ★ **< 4 %** | ★ **< 1 %** |
| **TBR** < 54 mg/dL (niv. 2) | **< 1 %** | ~0 % |
| **TAR** > 180 mg/dL | **< 25 %** | < 50 % |
| **TAR** > 250 mg/dL | **< 5 %** | < 10 % |
| **CV** (coefficient de variation) | ★ **≤ 36 %** (> 36 % = instable) | ≤ 36 % |
| **GMI** | GMI(%) = 3,31 + 0,02392 × glucose moyen (mg/dL) — *estimation d'HbA1c* | — |
| **Durée d'enregistrement** | ★ **≥ 14 j, ≥ 70 % de données actives** | idem |

> Réf. cibles : **Battelino, *Diabetes Care* 2019;42(8):1593-1603 · PMID 31177185 · 10.2337/dci19-0028** (texte intégral non accédé — CV/14 j confirmés par sources secondaires, `[à vérif. primaire]`) ; **GMI** : Bergenstal *Diabetes Care* 2018 · PMID 30224348. **⚠ Nuance historique** : le référentiel SFD **2017** (pré-consensus) visait **TIR 60 %** et notait l'absence de seuils consensuels internationaux → les cibles ci-dessus **datent de 2019** et **ont évolué** ; à afficher comme consensus, pas comme critère dur.

**Études d'intervention / validation** :

| Étude (PMID/DOI) | Design / population | Résultat (absolu) — **dur vs substitut** | GRADE |
|---|---|---|---|
| **MOBILE** (Martens, *JAMA* 2021 · 10.1001/jama.2021.7444 · PMID `[à vérif.]`) | RCT ouvert, **175 DT2 sous insuline BASALE seule**, soins primaires, HbA1c 9,0 % · 8 mois | ★ **SUBSTITUT** : HbA1c ajustée **−0,4 % (−0,8 à −0,1)** ; **TIR +15 pp** (59 vs 43 %) ; TAR>250 −16 pp. TBR non significatif. **Pas de critère dur.** | modéré |
| **REPLACE** (Haak, *Diabetes Ther* 2017) | RCT ouvert, ~224 DT2 sous insulinothérapie intensive | **Temps en hypo −43 % (−54 % la nuit)** ; **HbA1c : pas de différence** (non-inf). Substitut (mesure partiellement circulaire). | modéré-faible |
| **DIAMOND-DT2** (Beck, *Ann Intern Med* 2017 · `[à vérif.]`) | RCT, DT2 sous multi-injections | HbA1c ≈ −0,3 % ; substitut. | modéré |
| **Métas DT2 2024** (JCEM 2024;109(4):1119 `[1er auteur à vérif.]` ; Jancev, *Diabetologia* 2024 `[à vérif.]`) | 14 ECR CGM en DT2 | HbA1c ★ **−0,32 %** (certitude modérée) ; substitut. | modéré |
| ★ **Validation TIR (association, PAS intervention)** (Beck, *Diabetes Care* 2019 · **PMID 30352896** · 10.2337/dc18-1444) | **OBSERVATIONNEL** : ré-analyse **DCCT** (7 pts capillaires/j, **DT1**) | Par **−10 pp de TIR** : rétinopathie **HR 1,64 (1,51-1,78)** ; microalbuminurie **HR 1,40**. **Association substitut→dur, non causale, dérivée en DT1.** | **très faible** pour la causalité |

**Interprétation → décision (mapping AGP → ajustement)** : **TBR élevé / hypo nocturne** → ↓ basale, envisager 2ᵉ génération, relâcher la cible ; **GAJ / TAR nocturne, phénomène de l'aube** → titrer la basale (cible GAJ 0,70-1,20 g/L) ; **GAJ à cible mais TAR diurne/post-prandial, TIR bas** → écart prandial → **GLP-1 puis bolus** (bolus 10-15 min avant le repas) ; **hypo post-prandiale** → ↓ bolus ; **CV > 36 %** → instabilité/risque hypo, ne pas sur-titrer, chercher hypo cachées. **Repli capillaire (pas de MCG)** : GAJ/préprandial (0,70-1,20 g/L) pour la basale ; post-prandial < 1,80 g/L et **profils 6-7 points** pour l'intensification ; ASG « indispensable » sous insuline (SFD 2025). **Caveats fiabilité** (SFD 2017 §9) : décalage interstitiel ~10 min (lire les flèches, pas la valeur isolée), artéfacts de pression nocturnes, interférences (vit. C, **paracétamol** sur capteurs glucose-oxydase).

**Message E4** : les **cibles de MCG sont un CONSENSUS** (Battelino 2019), pas des critères durs, et ont évolué depuis 2017. Le **lien TIR↔complications est observationnel et dérivé du DT1** (Beck 2019/DCCT). Le bénéfice d'une PEC guidée par MCG en DT2 est **modeste et sur substituts** (HbA1c −0,3 à −0,4 %, TIR +15 pp, temps en hypo −43 %) — **aucun critère dur**. L'utilité **forte et consensuelle** = **dépistage/prévention des hypoglycémies** + **aide à la titration**. **Statut FR** : MCG recommandée (SFD 2025 Avis 23) & **remboursée uniquement chez le DT2 traité par insuline** ; évaluation à l'initiation & à 3 mois (SFD Paramédical §6.8 : port > 60 %, absence d'hypo sévère, TIR, HbA1c). → **conforte l'arbitrage §8-4** : MCG = interprétation/titration + alertes, gates durs = hypo + HbA1c/symptômes.

### SOUS-DOSSIER E5 — Recommandations officielles & divergence

| Source (réf.) | Quand initier | Schéma de départ / prandial-prémix | 2ᵉ génération ? | Intensification : GLP-1 avant bolus ? | MCG / TIR & remboursement | Désintensification |
|---|---|---|---|---|---|---|
| **HAS 2024** (RBP, grades A-C/AE ; **lu primaire**) | Après échec ; **d'emblée** si symptômes / glycémies >3 g/L / **HbA1c >10 %** (R.57, R.89, AE) | Basale 1 inj **0,1 U/kg**, cible GAJ, adaptation /3 j (R.87). ⚠ Intensification (R.88, AE) : **« préférentiellement basal-bolus » OU 1-2 prémix** — **prémix sans réserve EBM** | **Non spécifié** (R.87 cite « analogue lent / intermédiaire selon risque d'hypo nocturne ») — **lacune** | **Non énoncé** comme étape (R.88 va basale→basal-bolus/prémix) | R.84 (AE) : MCG **« encouragée »** sous insuline ; **pas de cible TIR** (objectifs 2013 maintenus) ; remb. intensifié tout HbA1c / non intensifié si HbA1c ≥8 % | R.103/R.105 (AE) : réévaluer, **éviter le surtraitement** ; âgé fragile → absence de médicament envisageable |
| **SFD 2025** (Darmon, *Méd. Mal. Métab.* 2025;19(8):630-662 · 10.1016/j.mmm.2025.10.002 ; **lu primaire**) | Basale « moins appropriée à ce stade », **GLP-1 préféré** (Avis 16-17) ; intensifiée si hypercatabolisme / HbA1c ≥10 % (Avis 8bis) | Basale **6-10 U ou 0,1-0,2 U/kg**, titration /3 j (Avis 18). **Prémix = dernier recours** ; **basal-plus préféré** (Avis 19) | **OUI explicite** (Avis 18bis) : **analogue lent > NPH** ; **glargine U300 / degludec si risque hypo** (nocturne, âgé, ATCD, IRC) | **OUI explicite** (Avis 19) : après basale+MET, **ajout GLP-1/GIP-GLP-1 préféré à l'insuline intensifiée** | **Cibles TIR chiffrées** (Tab. II, d'après Battelino 2019) ; MCG **remboursée si insuline** ; **primoprescription MG** (Avis 23) | Avis 5/21 : **déprescription** ; âgés cibles relâchées ; **interruption MCG si futilité** |
| **ebmfrance/Duodecim** (**position EBM de référence**) | HbA1c >7 % malgré autres médicaments ou CI | **Basale du soir + oraux/GLP-1 = choix (niveau B)** ; **« prandial ne devrait pas être inclus dans l'insulinothérapie moderne » ; prémix « pas fondé sur les preuves »** (le plus tranché) | **OUI, hiérarchie (niveau B)** : glargine U300/degludec < glargine U100/détémir < NPH | **OUI** : GLP-1 ajouté à la basale (GAJ à cible, HbA1c haute), ou **avant** l'insuline ; **jamais de prandial** | Basale : seule la GAJ à surveiller ; **pas de cible TIR** | Cible plus élevée si hypo sévères, EV limitée, cognitif, complications |
| **Prescrire** (P1/P3/P5/P8 ; **indépendant**) | Insuline **en ajout si HbA1c très élevé** ; **GLP-1 « le plus souvent 1er choix » AVANT** ; EV faible → rien tant que HbA1c ≤8,5-9 % | Insuline **en dernier** (schéma prandial non traité) `[à vérif.]` | `[non traité dans P1/P3/P5/P8]` | Cohérent : **GLP-1 avant** | `[non traité]` | EV faible → contrôle moins strict ; EI : hypo, poids, **rétinopathie si baisse rapide** |
| **ADA/EASD 2022** (Davies, *Diabetes Care* 2022;45(11):2753 · 10.2337/dci22-0034) | **GLP-1 préféré AVANT l'insuline** ; insuline 1ère si HbA1c ≥10 %, catabolisme, suspicion DT1 | Basale 0,1-0,2 U/kg ; **basal-plus** pour intensifier | **OUI** (analogues < NPH : ↓ hypo totale/nocturne) | **OUI** : **basale + GLP-1 (dont combos fixes) > schémas intensifiés** | CGM « peut être utile » en DT2 sous insuline (prudent) | centrée patient |
| **ADA Standards 2026** (ch. 7 Technology · 10.2337/dc26-S007) | (ch. 9, `[non lu]`) | (ch. 9) | (ch. 9) | (ch. 9) | **MCG Grade A sous insuline** ; **AID = méthode préférée aussi en DT2** (technophile) ; cibles TIR au ch. 6 `[à vérif.]` | — |
| **Méd. Geek / DragiWebdo** (MG indépendant) | anti-surtraitement | basal-plus si basale >0,5 U/kg, post-prandial >1,80 g/L, écart coucher-réveil >0,5 g/L | — | GLP-1 puis insuline | **surtraitement âgés** : 15-40 % (HbA1c) / quasi tous (MCG) ; **aucune métrique (HbA1c/MCG) ne prédit fiablement le risque d'hypo** → relativise le TIR | dépister/corriger le **surtraitement** |

**COI (à afficher)** : **SFD 2025 = COI massifs** (auteurs liés Novo/Sanofi/Lilly **et** Abbott/Dexcom/Medtronic/Insulet/Tandem) → pèse sur l'enthousiasme MCG/TIR/analogues ; **ADA 2026** (AID préférée = sensible) ; **HAS = COI faible** (agence publique) ; **ebmfrance & Prescrire = indépendants** (références d'indépendance). *(CMG : aucune position insuline/MCG dédiée trouvée `[à vérif.]`.)*

## 4. Synthèse critique (reco officielle vs position raisonnée)

### Reco officielle
Toutes les recos placent l'insuline **en dernier**, après les non-insulines (GLP-1/iSGLT2 à bénéfice CV/rénal). **Schéma de départ = basale + antidiabétiques** (unanime), dose 0,1-0,2 U/kg, titration sur GAJ. **Point d'ancrage FR à afficher = SFD 2025** (Avis 18-19-23), qui **converge avec l'EBM** : analogue lent > NPH, **2ᵉ génération si risque hypo**, **GLP-1 préféré à l'insuline intensifiée**, basal-plus > prémix, désintensification, cibles TIR (Battelino) et MCG remboursée si insuline (primoprescription MG).

### Position critique (ebmfrance, Prescrire, Médicalement Geek) — affichée à côté
L'objectif reste **d'éviter les complications** : l'insuline **corrige la glycémie et prévient le microvasculaire** (extrapolé du contrôle glycémique) mais **n'a AUCUN bénéfice CV/mortalité** (ORIGIN neutre) — d'où sa place en dernier. **Prandial/prémix systématique = non fondé sur les preuves** (surcroît d'hypo & de poids sans gain dur). Les **cibles de MCG/TIR sont un consensus/substitut** ; **aucune métrique ne prédit fiablement le risque d'hypo** → vigilance **surtraitement**, surtout chez l'âgé.

### Divergences — **oui** (deux frictions officielles)
1. **Prémix** : ebmfrance/SFD 2025 l'**écartent** (non EBM, dernier recours) ; **HAS 2024 (R.88) l'admet sans réserve**, à parité avec le basal-bolus (grade AE) — **et reste muette sur la préférence 2ᵉ génération**.
2. **MCG/TIR** : axe **SFD/ADA technophile** (cibles chiffrées, MCG Grade A, AID préférée en DT2, **fort COI dispositifs**) **vs HAS réservée** (MCG « encouragée », pas de cible TIR) **et position critique** (consensus/substitut, risque de surtraitement guidé par la technologie).
3. **Nuance convergente** : sur **basale + oraux/GLP-1**, l'**insuline en dernier**, les **2ᵉ générations pour l'hypo** et le **GLP-1 avant le bolus**, SFD 2025 **rejoint** la position critique — la divergence est ciblée (prémix + statut de la MCG), pas globale.

**Position raisonnée de l'outil** (à valider référent) : *initier une **basale + antidiabétiques** quand la cible n'est pas atteinte malgré les non-insulines optimisées (ou glucotoxicité) ; **2ᵉ génération si risque hypo/fragilité/hypo nocturnes** (bénéfice = hypo nocturne ; hypo sévère seulement degludec vs U100, NNT ~59) ; **intensifier par GLP-1/combo fixe avant le bolus**, puis **basal-plus** avant le basal-bolus ; **prémix/prandial systématique écartés** ; **désintensifier** chez le fragile ; **MCG = interprétation/titration + alertes de sécurité** (cibles = consensus affiché, pas gate dur) ; **jamais de promesse CV** pour l'insuline.*

## 5. Vérification bi-agents (état 2026-07-24)

**Dispositif** : **Agent A (extraction) — 5 sous-dossiers reçus** (E1-E5, §3 consolidé) ; **OE 2ᵉ passe (référent) — REÇUE 2026-07-24** (rapport unique couvrant E1-E5 ; consolidée en §5a) ; **Agent B (red-team, vérif. PMID/DOI/chiffres vs source primaire) — À LANCER** (cibles précisées ci-dessous, augmentées des discordances A×OE). Réconciliation Opus après B.

**Consensus provisoire (agents A × OE, non encore red-teamé)** : (a) basale + antidiabétiques = schéma de choix ; prandial/prémix hors 1ʳᵉ intention ; (b) 2ᵉ génération = bénéfice sur l'hypo **nocturne** (substitut), hypo **sévère** seulement DEVOTE (degludec vs U100, NNT ~59/2 ans) ; (c) intensification : **GLP-1/combo fixe ≈ basal-bolus** avec moins d'hypo & de poids (DUAL VII, Eng) → GLP-1 avant le bolus, basal-plus avant le basal-bolus ; (d) **insuline CV-neutre** (ORIGIN + ORIGINALE) ; (e) **cibles MCG = consensus** (Battelino 2019), lien TIR↔complications **observationnel** (Beck 2019/DCCT en DT1 ; **Lu 2021 cohorte T2D**), bénéfice MCG **sur substituts**.

### 5a. OE 2ᵉ passe (référent) — reçue 2026-07-24 : confirmations, nouveaux essais `[à vérif. primaire]`, discordances

> OE = débroussaillage (`00-global.md` étape 4), **jamais source primaire**. Corrobore largement les agents A sur
> tous les messages décisionnels. Nouveaux essais & discordances ci-dessous à **vérifier au red-team B**.

**Confirmations (A × OE)** : basale + oraux/GLP-1 = départ préféré, prandial/prémix = gain d'HbA1c modeste au prix d'hypo & de poids ; **ORIGIN CV-neutre** (+ extension **ORIGINALE**, PMID 26681720, et **pas de signal cancer**) ; **DEVOTE** hypo sévère RR 0,60 (NNT ~59/2 ans), nocturne sévère **RR 0,47** ; **DUAL VII** IDegLira non-inf. au basal-bolus, hypo rate ratio 0,11, −3,6 kg, 1 vs ≤5 inj ; **FullSTEP** basal-plus RR 0,58 ; **cibles MCG = consensus**, TIR↔complications observationnel, bénéfice MCG = substituts. **SFD/ADA convergent** avec l'EBM (GLP-1 avant bolus, 2ᵉ gén si hypo, insuline CV-neutre).

**Nouveaux essais surfacés par OE (haute valeur, `[à vérif. primaire]`)** :
- *E1/intensif.* — **Bertuol NMA** (*Diabetologia* 2026, **PMID 41436667**, 58 RCT/19 122 pts) : vs basale, **basal-bolus −0,31 %**, biphasique −0,24 %, prandial −0,38 % d'HbA1c, **+~1 kg** et **↑ limite de l'hypo sévère** → étaye « gain modeste au prix d'hypo/poids » (NMA récente la plus complète). **Lasserson NMA** (*Diabetologia* 2009, PMID 19644668) concorde (−0,45 %).
- *E2* — **McCall / Endocrine Society** (*JCEM* 2023, PMID 36477488 — **⚠ OE l'annonce comme méta 41 RCT analogues vs NPH ; c'est en réalité la CPG hypo de l'Endocrine Society** → source à re-attribuer) : analogues vs NPH **hypo sévère OR 0,71 (27/1000 en moins)**, mild-mod OR 0,79, **TIR +7,1 %**. **Cochrane MÀJ = Semlitsch 2020, CD005613.pub4** (remplace Horvath 2007). **Bradley** (*JAMA Intern Med* 2021, PMID 33587107, Medicare) : glargine/détémir vs NPH **HR 0,71/0,72** hypo (ED/hospit.), **absent si insuline prandiale** — **⚠ en TENSION avec Lipska** (*JAMA* 2018, PMID 29971399 : **aucune différence** en vraie vie) → red-team à trancher. Métas **Dehghani** (Front Endocrinol 2024, 1286827), **Zhang** (Acta Diabetol 2018, PMID 29423761 : nocturne/sévère ERR 0,65), **Alhmoud** (Front Endocrinol 2023, PMID 38313835 : degludec vs U300 = **aucune différence**, confirme l'équivalence inter-2ᵉ-gén), **Madenidou** (Ann Intern Med 2018, M18-0443). **DEVOTE 7** (Pratley, DOM 2019, PMID via 10.1111/dom.13699 : bénéfice hypo sévère constant selon l'âge). **SWITCH 2 sur la période complète** : hypo sévère **RR 0,51 (significatif)** vs NS en maintenance.
- *E3* — **DUAL V** (Lingvay, *JAMA* 2016, PMID 26928464 : IDegLira vs glargine non plafonnée, **HbA1c supérieure** malgré cap 50 U, hypo RR 0,43, −3,2 kg) ; **DUAL HIGH** (Galindo, *Diabetes Care* 2023, PMID 37459574 : **HbA1c 9-15 %**, IDegLira vs basal-bolus = HbA1c équivalente, moitié d'hypo, −4,6 kg) ; **Home NMA** (DOM 2020, PMID 32700442 : iGlarLixi vs **prémix −0,50 %**, vs basal-plus −0,68 %, vs basal-bolus −0,35 %) ; **Huthmacher** (Diabetes Care 2020, PMID 32910778 : GLP-1 longue action > courte sur basale).
- *E4* — **FreeDM2** (Wilmot, *Lancet Diab Endo* 2026, **PMID 42035781**, n=303 DT2 sous **basale + iSGLT2/GLP-1** = thérapie moderne) : rtCGM vs ASG, **HbA1c −0,6 % (16 sem) / −0,5 % (32 sem)**, hypo sévère **0 vs 2**, **initiation d'insuline prandiale ×4** sous MCG → étend MOBILE à la combothérapie moderne. **Lu** (*Diabetes Care* 2021, **PMID 33097560**, cohorte T2D, n=6 225, 6,9 ans) : **TIR ≤50 % → mortalité toutes causes HR 1,83 / CV HR 1,85** (obs. T2D — plus proche que Beck/DCCT-DT1). **DEVOTE post-hoc dTIR** (Bergenstal, DTT 2023, PMID 37017470 : TIR dérivé associé au MACE/hypo sévère). **Karter** (JAMA 2021, PMID 34077502 — ⚠ **corrigé red-team** : diff-in-diff hypo **−2,7 %**, PAS de RR 0,51 ; **observationnel**) ; le **RR 0,51 d'hospit. pour hypo sévère appartient à Nathanson** (registre suédois NDR, Diabetologia 2025, PMID 39460755, isCGM vs BGM — **observationnel**), à ne pas fusionner avec Karter. **Jancev** (Diabetologia 2024, **PMID 38363342** : 12 RCT, HbA1c −0,31 %, TIR +6,4 %, TBR −0,66 %, **hypo sévère RR 0,66 NS**) ; **Uhl** (JCEM 2024, **PMID 37987208** : 14 RCT, −0,32 %). **DIAMOND-DT2 = PMID 28828487** ; **MOBILE = PMID 34077499** (JAMA 2021;325(22):2262). Battelino = **PMID 31177185**.
- *E5* — **AACE 2026** (Samson, Endocr Pract 2026, PMID via 10.1016/j.eprac.2026.01.006) ; **ADA 2026** rec précises (7.15 MCG Grade A ; 9.20-9.22 initiation) ; **Bolli/Home 2025** « Modern role of basal insulin » (*Diabetes Care* 2025, PMID via 10.2337/dci24-0104) + « overview for the non-specialist » (Home, DOM 2025) = schémas pour le MG.

**Discordances à trancher (red-team primaire — priorité PMID/chiffres décisionnels)** :
- **PMID DEVOTE** : agents/ebmfrance **28605603** vs OE **28854752** (DOI 10.1056/NEJMoa1615692) → résoudre (un seul correct).
- **PMID 4T** : agents **17890232 (2007) / 19850703 (2009)** vs OE inline **17960012 / 19876164** (les DOI de la biblio OE = ceux des agents) → agents probablement corrects, PMID inline OE douteux.
- **PMID SWITCH 2** : agents **28672317** vs OE **28672318** (28672318 = probablement SWITCH 1 Lane) → trancher.
- **PMID Eng méta** : agent E3 **25220191** vs OE **25131977** → trancher.
- **Maiorino** : agent E3 « 36 RCT » vs OE « **26 RCT** » (PMID 28325801, DOI dc16-1957) → nombre d'essais & effet vs basal-bolus.
- **Ampleur bénéfice MCG** : agents −0,3 à −0,4 % vs OE **−0,3 à −0,6 %** (FreeDM2 rehausse la borne).
- **Prescrire & NPH** : OE (§8) affirme que **Prescrire tient la NPH pour référence** et juge le surcoût des analogues non justifié — **⚠ ABSENT des notes Prescrire locales** (P1/P3/P5/P8, agent E5) → à vérifier sur article Prescrire dédié, **ne pas encoder sans source**.
- **CMG** : la « position pragmatique CMG » d'OE **n'est PAS sourcée** (agent E5 : aucune position CMG dédiée trouvée) → traiter comme **non confirmé**, ne pas citer comme reco CMG.
- **HAS 2024** : la section HAS d'OE (seuil « HbA1c >8 % », URL avec coquille) est **moins précise que la lecture primaire de l'agent E5** (R.87-89) → **prévaloir l'agent E5**.

**Cibles prioritaires du red-team B** (chiffres décisionnels ★ à confirmer en primaire) :
- E1 : Treat-to-Target (33,2 vs 26,7 %) ; 4T 1 an (hypo 2,3/5,7/12,0 ; poids 1,9/4,7/5,7) & 3 ans (81,6 % 2ᵉ insuline) ; ORIGIN (hypo sévère 1,00 vs 0,31/100 p-a ; MACE HR 1,02) ; Cochrane Horvath (hypo sévère NS) ; GRADE (26,5/26,1/30,4/38,1) + confirmer que l'affirmation microvasculaire est un **substitut extrapolé**, pas un bénéfice insuline-spécifique dur.
- E2 : DEVOTE (hypo sévère 4,9 vs 6,6 %, RR 0,60, NNT ~59, horizon ~2 ans ; RR nocturne sévère) ; SWITCH 2 (RR 0,70/0,58 ; sévère p=0,35) ; CONCLUDE (primaire NÉGATIF RR 0,88) ; EDITION (−31 % nocturne) ; ajouter **BEGIN** (Zinman 2012) en réplication éventuelle.
- E3 : DUAL VII (rate ratio 0,11 ; −3,6 kg ; n exact ; hypo **sévère vraie** par bras) ; Eng (sous-groupe vs basal-bolus : hypo RR 0,67, poids −5,66 kg, nb d'essais) ; FullSTEP (rate ratio 0,58) ; 4T poids exacts ; confirmer **aucun CVOT** pour IDegLira/iGlarLixi.
- E4 : Battelino (CV ≤36 %, 14 j/70 % — **texte intégral non accédé**) ; MOBILE (PMID, TBR exacts) ; Beck 2019 validation (HR 1,64/1,40, **observationnel DT1**) ; métas 2024 (auteurs/effets) ; **remboursement FR post-2022** (nomenclature LPPR exacte, extension MCG au DT2 basale).
- E5 : PMID *Diabetes Care* d'ADA/EASD 2022 (36148880 vs 36151309) ; ORIGIN (lu de mémoire) ; ADA 2026 ch. 6/9 (non lus) ; réf. primaire de l'étude surtraitement DragiWebdo n°452 ; position Joubert 2025 (secondaire).

### 5b. Red-team Agent B (B1 E1+E2 · B2 E3 · B3 E4+E5) — REÇU & RÉCONCILIÉ 2026-07-24

> Chaque PMID/DOI/chiffre décisionnel re-résolu contre PubMed/Europe PMC + PDF locaux. **Constat transverse :
> ni les agents A ni OpenEvidence ne sont fiables en aveugle sur les PMID** — plusieurs PMID « sources »
> pointaient des articles hors-sujet (le « DEVOTE » d'OE = un article de zootechnie…). Chiffres décisionnels
> majoritairement **confirmés en direction/valeur** ; **IC exacts NEJM/Lancet à sourcer sur texte intégral**.

**PMID/DOI corrigés (liste utilisable au YAML)** : DEVOTE **28605603** · 4T **17890232** (2007) / **19850703** (2009) · SWITCH 2 **28672317** · ORIGIN **22686416** + ORIGINALE **26681720** · Treat-to-Target **14578243** · Porcellati (méta poolée) **28151905** · GRADE **36129996** · **Cochrane à jour = Semlitsch 2020 `33166419`** (remplace Horvath 2007 `17443605`) · SR Endocrine Society (OR 0,71) **36477885** (≠ CPG McCall `36477488`) · Bradley **33646277** · Lipska **29936529** · EDITION poolée **25929311** · BRIGHT **30104294** · CONCLUDE **31984443** · Eng **25220191** · Maiorino **28325801** (**26 RCT**, pas 36) · DUAL VII **29483185** · **DUAL V `26934259`** (les 2 sources avaient un faux PMID) · DUAL HIGH **37459574** · DUAL I **25190523** · LixiLan-L **27650977** · LixiLan-O **27527848** · FullSTEP **24622667** · Home NMA **32700442** · Bertuol NMA **41436667** (réel) · Battelino **31177185** · Beck valid. **30352896** · Lu **33097560** · MOBILE **34077499** · DIAMOND-DT2 **28828487** · FreeDM2 **42035781** · Jancev **38363342** · Uhl **37987208** · Karter **34077502** · Nathanson **39460755** · GMI Bergenstal **30224348** · ADA/EASD 2022 **36148880** · AACE 2022 **35963508** · AACE 2026 Samson (DOI 10.1016/j.eprac.2026.01.006).
**PMID à bannir (faux, prouvés hors-sujet)** : 28854752 · 17960012 · 19876164 · 28672318 · 33587107 · 29971399 · 25131977 · 25443857 · 26928464.

**Corrections de FOND (impact décisionnel — à répercuter à la distillation)** :
1. **⚠ Analogue 1ʳᵉ génération vs NPH — l'hypo SÉVÈRE n'est PAS réduite de façon significative** (Cochrane **Semlitsch 2020** : glargine RR 0,68 [0,46-1,01] **p=0,06**, détémir 0,45 [0,17-1,20], **très faible certitude** ; Lipska real-world HR 1,16 NS). La réduction **robuste** porte sur l'hypo **globale/nocturne**. → **NE PAS reprendre le « nettement moins d'hypo » d'ebmfrance pour l'hypo *sévère*** : distinguer globale/nocturne (robuste) vs sévère (signal, IC franchit 1). *(La SR Endocrine Society `36477885` donne OR 0,71 significatif sur 41 RCT, certitude modérée — coexiste avec la Cochrane NS ; à présenter comme signal, pas certitude.)*
2. **⚠ Tension real-world Bradley (HR 0,71/0,72) vs Lipska (HR 1,16 NS)** : NON contradictoire — Lipska est **sous-puissante** (IC 0,71-1,78, compatible avec Bradley). À présenter comme « Lipska non concluante », pas « Bradley réfuté ».
3. **⚠ Prescrire « NPH = référence / surcoût analogues non justifié » = INVENTION d'OpenEvidence — NON SOURCÉ, NE PAS ENCODER.** Lecture intégrale de `prescrire-dt2.md` (P1-P13) : aucune occurrence de « NPH », aucune hiérarchie NPH/analogues. Prescrire ne traite l'insuline que comme ajout « si HbA1c très élevé / prise de poids non prioritaire ».
4. **⚠ « Position CMG » (NPH valide, prudence MCG) = INVENTION d'OpenEvidence — NON SOURCÉ.** Aucune position CMG dédiée. La vraie source FR GP-inclusive = **Joubert 2025** (*Méd. Mal. Métab.* 2025;19:331-347, cité par SFD Avis 23) : groupe multidisciplinaire (dont MG) **FAVORABLE à la MCG**, primoprescription au MG — **contredit** la description d'OE. Utiliser Joubert 2025 sans lui prêter de réserve sur la MCG.
5. **⚠ Karter ≠ Nathanson** : le **RR 0,51** (hospit. hypo sévère) = **Nathanson** (`39460755`, registre suédois, observationnel) ; **Karter** (`34077502`) = diff-in-diff HbA1c/hypo −2,7 %, **pas** de RR 0,51/AVC/IDM (§5a corrigé).
6. **MOBILE** : citer pour HbA1c −0,4 % & TIR +15 pp, **PAS comme preuve d'un bénéfice sur le TBR** (extraction non fiable).
7. **SWITCH 2 « RR 0,51 sur la période complète » = NON-VÉRIFIABLE → NE PAS ENCODER** ; seul **0,70 (0,61-0,80)** en maintenance est sourcé. **CONCLUDE** exploratoires : nocturne 0,63 (0,48-0,84), sévère 0,20 (0,07-0,57) — mais **primaire NÉGATIF** ; controverse glucomètre non levée → ne pas hiérarchiser CONCLUDE au-dessus de BRIGHT.
8. **⚠ HAS déclenche l'insuline sur des SEUILS GLYCÉMIQUES** (échec de cible R.87 ; **HbA1c ≥10 % / glycémies >3 g/L répétées** R.89), **PAS sur « symptômes »** — le critère « symptômes » est **ADA (rec 9.20)**, à ne pas attribuer à la HAS.
9. **SFD Avis 19 dit « AR GLP-1 / AR GIP-GLP-1 »**, pas « combinaison fixe » verbatim — ne pas guillemeter « combo fixe » comme citation SFD (les combos fixes restent une modalité EBM valide, mais non nommée telle quelle par la SFD ici).
10. **IC exacts à sourcer sur texte intégral** (direction/valeur ponctuelle confirmées) : DEVOTE hypo sévère **RR 0,60 (0,48-0,76)** & nocturne sévère **0,47 (0,31-0,73)** ; ORIGIN mortalité **HR 0,98 (0,90-1,08)** ; 4T poids à 3 ans. **Home NMA vs basal-bolus −0,35 % = NON significatif** (ne pas présenter en supériorité). **LixiLan-L −0,5 %/−1,4 kg = différences inter-groupes** (variations absolues iGlarLixi −1,1 % / −0,7 kg).

**Confirmés sans réserve** (direction + valeur ponctuelle) : Treat-to-Target (33,2 vs 26,7 %) ; 4T 1 an (hypo 2,3/5,7/12,0 ; poids 1,9/4,7/5,7 kg) & 3 ans (81,6 % 2ᵉ insuline ; biphasique le pire ≤6,5 %) ; ORIGIN (MACE HR 1,02, cancer HR 1,00, hypo sévère 1,00 vs 0,31/100 p-a) + ORIGINALE ; DEVOTE (MACE non-inf HR 0,91 ; NNT ~59) ; **DUAL VII** (rate ratio 0,11 ; −3,6 kg ; comparateur non plafonné) ; **FullSTEP** (RR 0,58) ; Eng vs basal-bolus (hypo RR 0,67, poids −5,66 kg) ; Maiorino vs basal-bolus (hypo RR 0,66, −4,7 kg) ; **Bertuol NMA** (basal-bolus −0,31 %/biphasique −0,24 %/prandial −0,38 % vs basale, +~1 kg) ; **Battelino** (toutes cibles, Table 3) ; Beck (HR 1,64/1,40, **DCCT/DT1/capillaire**) ; Lu (HR 1,83/1,85, **T2D obs.**) ; FreeDM2 (−0,6 %/−0,5 %, hypo sévère 0 vs 2) ; Jancev (−0,31 %, **hypo sévère RR 0,66 NS**) ; Uhl (−0,32 %) ; **HAS/SFD/ADA vérifiés verbatim** (cf. corrections 3/4/8/9).

**Statut MCG (verrouillé red-team, à afficher tel quel)** : cibles = **consensus** (Battelino/ATTD 2019) ; lien TIR↔complications = **observationnel** (Beck DCCT/DT1 ; Lu/Karter/Nathanson cohortes T2D obs.) ; bénéfice MCG en DT2 = **substituts** (HbA1c −0,3 à −0,6 %, TIR, TBR) ; **aucune preuve sur complications dures ni mortalité** ; réduction d'hypo sévère hospitalisée = **signal observationnel** (Nathanson RR 0,51), **NS en méta-RCT** (Jancev RR 0,66). → **conforte §8-4** : MCG = interprétation/titration + alertes ; gate dur = hypo (axe sécurité) + HbA1c/symptômes.

### 5c. Vérification d'ENCODAGE bi-agents (étape 8) — REÇUE & CORRIGÉE 2026-07-24

> Étape distincte de §5/§5b (qui vérifiaient le *dossier de preuve*) : ici on vérifie que le **YAML encodé**
> (`content/…/insuline.yaml` + `.argumentaire.md`) reflète fidèlement le dossier et que son **comportement dans
> le moteur réel** est cliniquement sûr. Validation technique : **Ajv 7/7, 128 tests, build OK**.

- **Agent A (fidélité) — FEU VERT, 0 HAUTE.** Les 6 garde-fous critiques respectés (aucun bénéfice CV de
  l'insuline ; TIR jamais gate dur ; hypo sévère analogue-1ʳᵉ-gén-vs-NPH signalée NON significative ; DEVOTE
  NNT ~59 circonscrit à degludec vs U100 ; inventions OE écartées ; PMID conformes, aucun banni). **4
  corrections de traçabilité appliquées** : (1) source Porcellati assortie des p (0,04 / 0,002) + note
  « discordant de la Cochrane 2020 NS » ; (2) retrait de « LEADER/SUSTAIN-6 » et du « ≈ −1 % » de l'option
  GLP-1 (hors périmètre E → renvoi B/C) ; (3) PMID 17890232 (4T 1 an) ajouté ; (4) PMID Bertuol/FreeDM2 ajoutés.
- **Agent B (red-team moteur, 27 profils tracés sur le vrai `evaluateNode`) — 1 HAUTE, CORRIGÉE & RE-TRACÉE.**
  Cloisonnement des 4 situations **parfait** ; précédence des alertes MCG (`terrain_fragile`) **correcte** ;
  aucun mélange `AND`/`OR` dans une même chaîne (pas de piège de précédence).
  - **[HAUTE corrigée]** l'option 2a « titrer la basale » se co-déclenchait avec 2b « corriger l'hypo » quand le
    seul signal était `profil_glycemique contient hypo_nocturne` (exclusions 2a couvraient TBR/TBR_severe/CV mais
    pas l'hypo nocturne AGP) → **ajout de `profil_glycemique contient hypo_nocturne` aux exclusions de 2a**.
  - **[MOYENNE appliquée]** 2c « ne pas sur-titrer » n'avait pas de garde-fou sécurité → **mêmes 4 exclusions
    ajoutées** (sécurité prioritaire ; sous signal d'hypo, seule 2b s'affiche). *À confirmer référent.*
  - **[BASSE]** `over_basalisation` était une variable morte (doc §1-D disait qu'elle gate 2c) → **usage réel
    donné : alerte info** ; §1-D corrigé.
  - **[BASSE]** pas d'option de repli → sortie possible « alertes seules » (patient à la cible sans hypo) —
    **voulu** (rien à changer, les alertes portent la surveillance).
  - **Re-traçage du correctif** (test jetable, supprimé) : 4/4 — 2a exclue sous hypo nocturne, non-régression OK,
    2c exclue sous signal de sécurité, alerte over_basalisation active.

**Verdict étape 8 : FEU VERT après correction.** Reste : validation clinique du référent (option par option) →
`meta.statut: valide`.

## 6. Incertitudes (consolidées — à lever au red-team B + OE + référent)

- **Place réelle de la MCG en DT2** (surtout non intensifié) : preuve à critère **dur** **absente** (bénéfice sur HbA1c/TIR/temps en hypo = substituts) ; cibles TIR = **consensus** (Battelino 2019) ; lien TIR↔complications **observationnel & dérivé du DT1** (Beck/DCCT). *(→ arbitrage §8-4.)*
- **Bénéfice microvasculaire de l'insuline** : **extrapolé** du contrôle glycémique (UKPDS), **pas** démontré par un RCT insuline à critère dur → à encoder comme substitut/indirect, jamais comme bénéfice dur prouvé.
- **Seuil d'over-basalisation** (dose/kg — repère 0,5 U/kg côté Méd. Geek/SFD) et bascule basale→GLP-1/bolus : à confirmer/chiffrer.
- **Prémix** : proscrire (ebmfrance/SFD) ou option dégradée (HAS l'admet) → **arbitrage §8-2**.
- **Modélisation AGP/forme des courbes** : enum de profil vs dérivé des métriques → **arbitrage §8-3**.
- **Combos fixes (IDegLira/iGlarLixi)** : bénéfice **purement substitutif** (aucun CVOT) — à ne pas survendre.
- **Remboursement/accès MCG FR** : nomenclature exacte et périmètre (DT2 sous basale non intensifiée) évolutifs → à suivre en veille.
- **2ᵉ génération** : bénéfice sur l'hypo **sévère** limité à degludec vs glargine U100 (DEVOTE, haut risque) ; pas de supériorité inter-2ᵉ-gén ; **surcoût** à peser vs NPH/U100.

## 7. → YAML (contenu distillé — BROUILLON pour validation référent, 2026-07-24)

> Nœud **multi-options routé par `situation_insuline`**. Chiffres = red-teamés (§5b). **Dérivés formulaire**
> (précédent nœud C) : `cible_atteinte` (HbA1c ≤ cible), `gaj_a_cible`, `over_basalisation` (dose_basale/poids
> > 0,5). DSL : array de `conditions` = AND ; `AND` prioritaire sur `OR` DANS une chaîne, pas de parenthèses →
> les groupes « OR » tiennent en **une** chaîne. Prose ci-dessous concise (sera étoffée à l'encodage + argumentaire niveau 3).

```yaml
id: insuline
domaine: diabete-type-2
titre: "Insulinothérapie du DT2 : initier, optimiser une basale, ajouter un bolus, adapter un basal-bolus"
selection: multi-options
argumentaire_exhaustif: "insuline.argumentaire.md"
population_cible: >-
  Adulte DT2 (hors DT1, grossesse, diabètes secondaires) chez qui une insulinothérapie est justifiée.
  Aide à la prescription en médecine générale : initiation/titration de la basale, intensification par étapes
  (GLP-1 avant le bolus), adaptation d'un basal-bolus. HORS PÉRIMÈTRE : pompe & boucle fermée (centres
  initiateurs) ; calcul des ratios glucides/facteur de sensibilité (éducation spécialisée).
criteres_entree:
  # Routeur
  - { nom: situation_insuline, type: enum, valeurs: [naif, basale_seule, basale_plus_bolus, basal_bolus] }
  # Cliniques (réutilisés)
  - { nom: age, type: nombre }
  - { nom: HbA1c_actuelle, type: nombre }
  - { nom: HbA1c_cible, type: nombre }          # ← sortie nœud A
  - { nom: cible_atteinte, type: bool }          # DÉRIVÉ formulaire : HbA1c_actuelle <= HbA1c_cible
  - { nom: DFG, type: nombre }
  - { nom: IMC, type: nombre }
  - { nom: fragilite, type: bool }
  - { nom: esperance_vie, type: enum, valeurs: [longue, intermediaire, limitee] }
  - { nom: risque_hypoglycemie_schema, type: enum, valeurs: [faible, eleve] }
  - { nom: terrain_fragile, type: bool }         # DÉRIVÉ formulaire : fragilite OR esperance_vie==limitee OR age>=75 OR risque_hypoglycemie_schema==eleve (= relaxation cible, cohérent nœud A)
  - { nom: hypo_severe_recurrente, type: bool }  # NOUVELLE : ATCD hypo sévère / non-perception (orientation)
  - { nom: symptomes_glucotoxicite, type: bool }
  - { nom: traitements_en_cours, type: liste, valeurs: [metformine, iSGLT2, aGLP1, sulfamide, glinide, gliptine, insuline_basale, insuline_rapide] }
  - { nom: preference_injection, type: enum, valeurs: [accepte, refuse, indifferent] }
  # MCG (contrôle + sécurité) / capillaire
  - { nom: mcg_disponible, type: bool }
  - { nom: TIR, type: nombre }
  - { nom: TBR, type: nombre }
  - { nom: TBR_severe, type: nombre }
  - { nom: TAR, type: nombre }
  - { nom: CV_glycemique, type: nombre }
  - { nom: GMI, type: nombre }
  - { nom: profil_glycemique, type: liste, valeurs: [hypo_nocturne, phenomene_aube, excursions_postprandiales, hypo_interprandiale, stable] }
  - { nom: GAJ, type: nombre }
  - { nom: gaj_a_cible, type: bool }             # DÉRIVÉ formulaire : GAJ dans la cible
  # Doses (aide au calcul — §8-7)
  - { nom: poids, type: nombre }
  - { nom: dose_basale_actuelle, type: nombre }
  - { nom: dose_rapide_actuelle, type: nombre }
  - { nom: over_basalisation, type: bool }       # DÉRIVÉ formulaire : dose_basale_actuelle / poids > 0,5

options:
  # ───────── SITUATION 1 — NAÏF D'INSULINE ─────────
  - intitule: "Envisager un GLP-1 (ou combo fixe) avant/avec l'insuline"
    conditions: ["situation_insuline == naif", "traitements_en_cours ne_contient_pas aGLP1"]
    priorite: 1
    niveau_preuve: modere
    effet_attendu: "GLP-1 = 1er injectable préféré à l'insuline (ADA 9.21 ; SFD Avis 19) : moins d'hypo, perte de poids, bénéfice CV propre (contrairement à l'insuline, CV-neutre — ORIGIN). Renvoi nœuds B/C pour le choix."
    avantages: ["Moins d'hypoglycémie et perte de poids vs insuline ; combos fixes IDegLira/iGlarLixi = 1 injection."]
    inconvenients: ["Effets digestifs ; ne remplace pas l'insuline en cas de glucotoxicité sévère/cétose."]
  - intitule: "Initier une insuline basale (+ maintien des antidiabétiques)"
    conditions: ["situation_insuline == naif", "cible_atteinte == false OR symptomes_glucotoxicite == true"]
    priorite: 2
    niveau_preuve: modere
    effet_attendu: >-
      Dose initiale = poids × 0,1-0,2 U/kg/j (repli fixe 10 U le soir — ebmfrance). Titration : +2 U si GAJ
      au-dessus de la cible 3 matins de suite (ou +10-20 %/paliers si > 40 U), tous les 3 j ; cible GAJ ~0,70-1,20 g/L
      (individualisée). Maintenir metformine ± iSGLT2 ± GLP-1. Bénéfice = contrôle glycémique / microvasculaire
      (extrapolé, pas de RCT insuline à critère dur) ; PAS de bénéfice CV (ORIGIN HR 1,02).
    avantages: ["Basale + antidiabétiques = schéma de choix (ebmfrance grade B) ; meilleur profil hypo/poids que prandial/prémix (4T)."]
    inconvenients: ["Hypoglycémie (ORIGIN : 1,00 vs 0,31/100 pers.-an) ; prise de poids (~+1,6 kg) ; ne prévient pas les événements CV."]
    contre_indications: ["Arrêter sulfamide/glinide à l'introduction (hypo cumulée — voir alerte). Pas de CI absolue à l'insuline."]
  - intitule: "Choisir un analogue basal de 2ᵉ génération (glargine U300 ou degludec)"
    conditions: ["situation_insuline == naif", "risque_hypoglycemie_schema == eleve OR fragilite == true OR esperance_vie == limitee"]
    priorite: 3
    niveau_preuve: modere
    effet_attendu: >-
      Préférer glargine U300 ou degludec (vs glargine U100/détémir, a fortiori NPH) si risque hypo élevé /
      fragilité. Bénéfice DÉMONTRÉ sur l'hypo NOCTURNE/symptomatique (substitut) ; sur l'hypo SÉVÈRE, démontré
      pour degludec vs glargine U100 (DEVOTE : RR 0,60, NNT ~59/2 ans en haut risque) — PAS entre les 2 analogues
      de 2ᵉ gén (BRIGHT équivalence). Reco au niveau CLASSE (D12). Aucun bénéfice CV.
    avantages: ["Moins d'hypoglycémie nocturne (SWITCH 2 RR 0,58 ; EDITION U300 −31 %)."]
    inconvenients: ["Surcoût vs NPH/U100 ; bénéfice sur l'hypo SÉVÈRE non significatif pour la 1ʳᵉ génération vs NPH (Cochrane Semlitsch 2020)."]

  # ───────── SITUATION 2 — BASALE SEULE À OPTIMISER ─────────
  - intitule: "Corriger l'hypoglycémie / la variabilité (réduire, 2ᵉ génération, relâcher la cible)"
    conditions: ["situation_insuline == basale_seule", "TBR > 4 OR TBR_severe > 1 OR CV_glycemique > 36 OR profil_glycemique contient hypo_nocturne"]
    priorite: 1
    niveau_preuve: modere
    effet_attendu: "Réduire la basale de −2 à −4 U (ou −10-20 % de dose_basale_actuelle) ; passer en 2ᵉ génération ; relâcher la cible. Sécurité prioritaire (hypo = critère DUR)."
    avantages: ["Cible l'hypo (TBR/nocturne) et l'instabilité (CV > 36 %)."]
    inconvenients: ["Peut relâcher transitoirement le contrôle."]
  - intitule: "Ne pas sur-titrer la basale → intensifier autrement (GLP-1 puis bolus)"
    conditions: ["situation_insuline == basale_seule", "gaj_a_cible == true", "cible_atteinte == false"]
    priorite: 2
    niveau_preuve: modere
    effet_attendu: >-
      GAJ à la cible mais HbA1c au-dessus = écart POST-PRANDIAL (over-basalisation, repère dose > 0,5 U/kg) :
      ne pas augmenter la basale ; ajouter un GLP-1 (ou combo fixe) de préférence, sinon passer au bolus.
      GLP-1/combo fixe ≈ basal-bolus à HbA1c égale avec MOINS d'hypo & de poids (DUAL VII rate ratio 0,11, −3,6 kg ; Eng RR 0,67).
    avantages: ["Évite l'empilement de basale inefficace sur l'hyperglycémie post-prandiale."]
    inconvenients: ["Nécessite d'ajouter une classe (GLP-1) ou une injection prandiale."]
  - intitule: "Titrer la basale (monter la dose)"
    conditions: ["situation_insuline == basale_seule", "cible_atteinte == false", "gaj_a_cible == false", "TBR <= 4"]
    priorite: 3
    niveau_preuve: modere
    effet_attendu: "+2 U si GAJ au-dessus de la cible 3 matins de suite (ou +10-20 %/paliers si dose_basale_actuelle > 40 U), adapter tous les 3 j. Algorithme validé (Treat-to-Target)."
    avantages: ["Titration simple, réalisable en soins primaires ; ~60 % atteignent la cible (Treat-to-Target)."]
    inconvenients: ["Risque d'hypo si sur-titration → surveiller le TBR/GAJ bas."]
    exclusions: ["TBR > 4", "TBR_severe > 1"]   # ne pas monter la dose si hypo

  # ───────── SITUATION 3 — AJOUT D'UN BOLUS / BASAL-PLUS ─────────
  - intitule: "GLP-1 / combo fixe d'abord (si non encore fait)"
    conditions: ["situation_insuline == basale_plus_bolus", "traitements_en_cours ne_contient_pas aGLP1"]
    priorite: 1
    niveau_preuve: modere
    effet_attendu: "Avant tout bolus : ajouter un GLP-1 ou passer à un combo fixe (IDegLira/iGlarLixi) — même HbA1c que le basal-bolus, moins d'hypo & de poids, 1 injection (DUAL VII, Eng, Maiorino)."
    avantages: ["Épargne d'insuline prandiale ; bénéfice pondéral."]
    inconvenients: ["Digestifs ; pas de CVOT dédié aux combos fixes (bénéfice substitutif)."]
  - intitule: "Ajouter un bolus au repas principal (basal-plus, par étapes)"
    conditions: ["situation_insuline == basale_plus_bolus"]
    priorite: 2
    niveau_preuve: modere
    effet_attendu: >-
      Basal-plus : 1 bolus d'analogue rapide au repas le plus hyperglycémiant (guidé par le profil AGP :
      excursions_postprandiales), dose ≈ 10 % de dose_basale_actuelle (ou 4 U), 10-15 min avant le repas ;
      n'escalader vers 2ᵉ/3ᵉ bolus que si besoin. Non-inférieur au basal-bolus d'emblée, avec moins d'hypo (FullSTEP RR 0,58).
    avantages: ["Progressif : moins d'hypo, meilleure satisfaction que le basal-bolus d'emblée."]
    inconvenients: ["Ajoute une injection et une autosurveillance (profils 6-7 points si pas de MCG)."]
  - intitule: "Insuline prémélangée — option dégradée (dernier recours)"
    conditions: ["situation_insuline == basale_plus_bolus", "preference_injection == refuse"]
    priorite: 3
    niveau_preuve: faible
    effet_attendu: "À NE proposer QUE si le patient refuse les injections multiples et a des repas réguliers (ADA 2026) : 1-2 prémix/j, plus simple qu'un basal-bolus mais MOINS flexible, plus d'hypo & de poids (Bertuol : biphasique −0,24 % seulement ; 4T : le pire pour la cible). JAMAIS avant GLP-1/basal-plus."
    avantages: ["Moins d'injections (2/j) pour un patient réticent."]
    inconvenients: ["Non fondé sur les preuves en 1ʳᵉ intention (ebmfrance) ; plus d'hypo et de poids ; peu souple."]

  # ───────── SITUATION 4 — BASAL-BOLUS COMPLET ─────────
  - intitule: "Désintensifier / alléger le schéma"
    conditions: ["situation_insuline == basal_bolus", "fragilite == true OR esperance_vie == limitee OR hypo_severe_recurrente == true"]
    priorite: 1
    niveau_preuve: modere
    effet_attendu: "Relâcher la cible, simplifier le schéma, réduire les doses (basale/bolus à partir de dose_basale_actuelle/dose_rapide_actuelle), envisager un GLP-1 pour réduire les besoins. Éviter le surtraitement (HAS R.103 ; SFD Avis 21)."
    avantages: ["Réduit le risque d'hypo chez l'âgé/fragile."]
    inconvenients: ["Contrôle glycémique volontairement moins strict."]
  - intitule: "Optimiser la répartition du basal-bolus (guidé par l'AGP et les doses actuelles)"
    conditions: ["situation_insuline == basal_bolus"]
    priorite: 2
    niveau_preuve: faible
    effet_attendu: >-
      Équilibrer basal/bolus (~50/50) et ajuster à partir des doses actuelles (dose_basale_actuelle /
      dose_rapide_actuelle), guidé par le profil AGP : hypo_nocturne → ↓ basale ; phenomene_aube → ↑ basale ;
      excursions_postprandiales → ↑ bolus / avancer le timing ; hypo_interprandiale → ↓ bolus. Ajuster aussi les
      doses de correction. Le calcul FORMEL des ratios glucides-insuline / facteur de sensibilité n'est pas
      inclus (extension possible). Si le déséquilibre PERSISTE malgré l'optimisation → orienter (voir alerte).
    avantages: ["Prise en charge du basal-bolus par le MG, pilotée par la forme des courbes et les doses en cours."]
    inconvenients: ["Déséquilibre persistant / situation particulière → avis spécialisé (alerte)."]

alertes:
  - quand: "hypo_severe_recurrente == true OR CV_glycemique > 36 OR TBR_severe > 1"
    niveau: attention
    message: "Orienter vers le spécialiste (± pompe / boucle fermée = centres initiateurs) si le déséquilibre PERSISTE malgré l'optimisation, ou en situation particulière : hypoglycémies sévères récurrentes / non-perception, instabilité marquée (CV élevé / TBR sévère), grossesse ou projet. En attendant : ↓ objectif, 2ᵉ génération, éducation, envisager une MCG."
  - quand: "traitements_en_cours contient sulfamide OR traitements_en_cours contient glinide"
    niveau: attention
    message: "À l'introduction/intensification de l'insuline : arrêter le sulfamide / glinide (hypoglycémie cumulée)."
  - quand: "traitements_en_cours contient iSGLT2"
    niveau: attention
    message: "iSGLT2 + insuline : maintenir pour le bénéfice cardio-rénal, mais risque d'acidocétose euglycémique — éduquer, suspendre en cas de jeûne / chirurgie / maladie aiguë."
  - quand: "DFG < 45"
    niveau: attention
    message: "DFG bas : besoins en insuline réduits et risque d'hypoglycémie majoré (adapter les doses) ; sulfamides à proscrire ; adapter/arrêter la metformine selon le DFG."
  - quand: "mcg_disponible == true AND terrain_fragile == false"
    niveau: info
    message: "Cibles MCG standard (consensus Battelino 2019, PAS un critère dur) : TIR > 70 %, TBR < 4 % & < 1 %, TAR < 25 % & < 5 %, CV ≤ 36 %."
  - quand: "mcg_disponible == true AND terrain_fragile == true"
    niveau: info
    message: "Sujet âgé/fragile/à haut risque d'hypo : cibles MCG ASSOUPLIES — TIR > 50 %, TBR < 1 %, TAR plus permissif (cohérent avec la cible d'HbA1c relâchée du nœud A)."
  - quand: "mcg_disponible == false"
    niveau: info
    message: "Sans MCG : titrer la basale sur la glycémie à jeun (cible ~0,70-1,20 g/L) ; profils capillaires 6-7 points (pré/post 3 repas + coucher) pour guider l'intensification."
  - quand: "default"
    niveau: info
    message: "L'insuline améliore le contrôle glycémique et prévient les complications microvasculaires, mais N'A PAS de bénéfice cardiovasculaire démontré (ORIGIN neutre) — ne pas la survendre ; surveiller poids et hypoglycémie."

argumentaire: >
  (Résumé — l'argumentaire niveau 3 est dans insuline.argumentaire.md.) Quand une insuline est nécessaire dans
  le DT2, le schéma de choix est une BASALE ajoutée aux antidiabétiques (oraux et/ou GLP-1), le GLP-1 étant
  préféré comme 1er injectable ; les schémas prandial et prémélangé systématiques ne sont pas fondés sur les
  preuves (surcroît d'hypoglycémie et de poids sans gain durable). L'intensification privilégie le GLP-1 / combo
  fixe AVANT le bolus (même contrôle que le basal-bolus, moins d'hypo & de poids — DUAL VII, Eng), puis le
  basal-plus par étapes avant le basal-bolus (FullSTEP). Le choix de molécule et de cible se pilote sur le RISQUE
  hypoglycémique (analogues de 2ᵉ génération si risque élevé/fragilité/hypo nocturnes ; hypo sévère démontrée
  pour degludec vs glargine U100 — DEVOTE, NNT ~59). L'insuline est CV-neutre (ORIGIN) : bénéfice microvasculaire
  (extrapolé), jamais de promesse de survie. Les métriques de MCG servent l'INTERPRÉTATION et les ALERTES de
  sécurité (cibles = consensus, pas critère dur) ; seule l'hypoglycémie (TBR, CV, hypo nocturnes) pilote des
  recommandations de sécurité. Doses d'initiation et d'ajustement calculées à partir du poids et des doses
  actuelles (ratios en argumentaire) ; périmètre MG (pas de ratios glucides/FS, pas de pompe/boucle fermée).
sources:
  references_primaires:
    - { titre: "ORIGIN (glargine vs soins standard) — MACE HR 1,02 (0,94-1,11), mortalité HR 0,98, cancer HR 1,00 ; CV-neutre", annee: 2012, type_critere: dur, lien: "https://pubmed.ncbi.nlm.nih.gov/22686416/" }
    - { titre: "ORIGINALE (extension) — neutralité CV/mortalité/cancer maintenue", annee: 2016, type_critere: dur, lien: "https://pubmed.ncbi.nlm.nih.gov/26681720/" }
    - { titre: "DEVOTE (degludec vs glargine U100) — MACE non-inf HR 0,91 ; hypo sévère RR 0,60, NNT ~59/2 ans", annee: 2017, type_critere: dur, lien: "https://pubmed.ncbi.nlm.nih.gov/28605603/" }
    - { titre: "SWITCH 2 (degludec vs glargine U100) — hypo sympt. RR 0,70, nocturne 0,58 ; sévère NS", annee: 2017, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/28672317/" }
    - { titre: "BRIGHT (glargine U300 vs degludec) — équivalence HbA1c & hypo (moindre U300 en titration)", annee: 2018, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/30104294/" }
    - { titre: "CONCLUDE (degludec U200 vs glargine U300) — primaire hypo NÉGATIF RR 0,88 NS", annee: 2020, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/31984443/" }
    - { titre: "EDITION 1-2-3 poolée (glargine U300 vs U100) — nocturne −31 % ; sévère NS", annee: 2015, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/25929311/" }
    - { titre: "Cochrane Semlitsch (analogues lents vs NPH) — hypo globale/nocturne ↓ ; SÉVÈRE NON significative ; pas de bénéfice dur", annee: 2020, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/33166419/" }
    - { titre: "Treat-to-Target (Riddle, glargine vs NPH, titration sur GAJ) — 33,2 vs 26,7 % ≤7 % sans hypo nocturne", annee: 2003, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/14578243/" }
    - { titre: "4T (basal vs prandial vs biphasique, 1 & 3 ans) — basal = moins d'hypo/poids ; biphasique le pire", annee: 2009, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/19850703/" }
    - { titre: "DUAL VII (IDegLira vs basal-bolus) — HbA1c non-inf ; hypo rate ratio 0,11 ; −3,6 kg ; 1 vs ≥4 inj", annee: 2018, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/29483185/" }
    - { titre: "Eng (méta GLP-1+basale vs basal-bolus) — HbA1c −0,1 % ; hypo RR 0,67 ; poids −5,66 kg", annee: 2014, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/25220191/" }
    - { titre: "Maiorino (méta, 26 RCT — GLP-1+insuline) — vs basal-bolus : hypo RR 0,66, poids −4,7 kg", annee: 2017, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/28325801/" }
    - { titre: "FullSTEP (basal-plus par étapes vs basal-bolus) — non-inf ; hypo rate ratio 0,58", annee: 2014, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/24622667/" }
    - { titre: "Bertuol (NMA 58 RCT, 19 122 pts) — vs basale : prandial −0,38 %/biphasique −0,24 %, +~1 kg, ↑ hypo sévère limite", annee: 2026, type_critere: substitution, lien: "https://doi.org/10.1007/s00125-025-06633-x" }
    - { titre: "Battelino / ATTD (consensus international Time in Range) — cibles TIR/TBR/TAR/CV (CONSENSUS)", annee: 2019, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/31177185/" }
    - { titre: "Beck (validation TIR, ré-analyse DCCT, DT1) — rétinopathie HR 1,64 / microalb. 1,40 par −10 pp (OBSERVATIONNEL)", annee: 2019, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/30352896/" }
    - { titre: "Lu (cohorte T2D) — TIR ≤50 % : mortalité HR 1,83 / CV 1,85 (OBSERVATIONNEL)", annee: 2021, type_critere: dur, lien: "https://pubmed.ncbi.nlm.nih.gov/33097560/" }
    - { titre: "MOBILE (MCG en DT2 sous basale seule) — HbA1c −0,4 % ; TIR +15 pp (substituts)", annee: 2021, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/34077499/" }
    - { titre: "FreeDM2 (MCG en DT2 sous basale + iSGLT2/GLP-1) — HbA1c −0,6 %/−0,5 % ; hypo sévère 0 vs 2", annee: 2026, type_critere: substitution, lien: "https://doi.org/10.1016/S2213-8587(26)00076-8" }
    - { titre: "Jancev (méta 12 RCT, MCG en DT2) — HbA1c −0,31 % ; hypo sévère RR 0,66 NS", annee: 2024, type_critere: substitution, lien: "https://pubmed.ncbi.nlm.nih.gov/38363342/" }
  medicalement_geek:
    synthese: >-
      Ligne EBM francophone (ebmfrance, Médicalement Geek/DragiWebdo) : basale + oraux/GLP-1 ; prandial/prémix
      hors 1ʳᵉ intention ; GLP-1 avant le bolus ; vigilance surtraitement de l'âgé (aucune métrique, HbA1c ni
      MCG, ne prédit fiablement le risque d'hypoglycémie).
    lien: "https://www.ebmfrance.net/Guidelines/Details/ebm00491"
  prescrire:
    synthese: >-
      Insuline en AJOUT si HbA1c très élevé ou si éviter la prise de poids n'est pas prioritaire ; GLP-1
      (séma/dulaglutide) le plus souvent préféré AVANT l'insuline. EI : hypoglycémie, poids, aggravation de la
      rétinopathie si baisse rapide d'HbA1c. (Résumé — droit d'auteur ; réf. prescrire-dt2.md P1/P3/P5/P8.
      NB : Prescrire ne traite PAS la hiérarchie NPH/analogues 2ᵉ génération dans ces sources.)
  reco_officielle:
    source: >-
      SFD 2025 (Darmon, Méd. Mal. Métab. 2025;19(8):630-662) — reco FR de référence à afficher ; HAS 2024
      (« Stratégie thérapeutique du DT2 ») ; ADA Standards of Care 2026 (ch. 7 & 9) ; ADA/EASD 2022 (PMID
      36148880) ; AACE 2022/2026. Position d'experts MCG FR : Joubert 2025 (Méd. Mal. Métab. 19:331-347).
    position: >-
      Consensus : basale + antidiabétiques ; GLP-1 préféré comme 1er injectable / avant le bolus (SFD Avis 19,
      ADA 9.21) ; analogues de 2ᵉ génération si risque hypo (SFD Avis 18bis) ; désintensification de l'âgé
      (SFD Avis 21, HAS R.103) ; MCG recommandée & remboursée si insuline (SFD Avis 23, ADA 7.15 Grade A),
      cibles TIR de Battelino 2019.
    divergence: true
    explication: >-
      Deux frictions officielles : (1) HAS 2024 (R.88, grade AE) admet le PRÉMIX à parité avec le basal-bolus
      et reste MUETTE sur la préférence 2ᵉ génération et sur « GLP-1 avant le bolus », là où ebmfrance/SFD
      l'écartent/l'énoncent ; (2) MCG/TIR : axe SFD/ADA technophile (MCG Grade A, AID préférée en DT2, fort
      conflit d'intérêt dispositifs) vs HAS réservée (« encouragée », pas de cible TIR) et position critique
      (Prescrire/Méd. Geek : cibles = consensus/substitut, aucune métrique ne prédit fiablement l'hypo →
      surtraitement). L'outil affiche la reco FR (SFD, convergente avec l'EBM sur l'essentiel) et signale ces
      divergences ; il ne revendique jamais de bénéfice CV pour l'insuline (ORIGIN).
incertitudes:
  - "MCG : cibles = consensus (Battelino 2019) ; lien TIR↔complications observationnel (Beck DCCT/DT1 ; Lu T2D) ; bénéfice en DT2 sur substituts (HbA1c, TIR) — aucune preuve sur critères durs ni mortalité (Jancev)."
  - "Bénéfice microvasculaire de l'insuline = extrapolé du contrôle glycémique, non démontré par un RCT insuline à critère dur."
  - "Seuil d'over-basalisation 0,5 U/kg = repère (SFD/Méd. Geek), non validé par ECR — `[À VÉRIFIER]`."
  - "2ᵉ génération : hypo SÉVÈRE démontrée pour degludec vs glargine U100 seulement (DEVOTE) ; analogues 1ʳᵉ gén vs NPH = hypo sévère NON significative (Cochrane 2020) ; pas de supériorité inter-2ᵉ-gén (BRIGHT/CONCLUDE)."
  - "Combos fixes (IDegLira/iGlarLixi) : bénéfice substitutif, aucun CVOT dédié."
  - "Cibles capillaires (GAJ) et calcul des doses = câblage formulaire (P3) ; `hypo_severe_recurrente`, dérivés `cible_atteinte`/`gaj_a_cible`/`over_basalisation` à câbler."
veille_liee: []
meta:
  date_revue: "2026-07-24"
  auteur: "référent DT2 (Thibault) + Opus"
  statut: brouillon
  version: "0.1"
  changelog:
    - { date: "2026-07-24", auteur: "Opus + référent", resume: "Brouillon de distillation depuis E-insuline.md (agents A × OE × red-team B, PMID red-teamés). Multi-options routé par situation_insuline (4 situations, 11 options) ; MCG axe contrôle (interprétation/alertes) vs sécurité (gate) ; prémix option dégradée ; doses calculées (poids + doses actuelles) ; cibles MCG relâchées sur fragilité. À valider référent puis encoder." }
```

**Restant avant `valide`** : validation clinique du référent (option par option) → écriture de `content/noeuds/diabete-type-2/insuline.yaml` + `insuline.argumentaire.md` (niveau 3) → Ajv + vitest + build → vérification d'encodage bi-agents (étape 8). Câblage formulaire (dérivés + calcul de doses + tooltips AGP) = P3.

## 8. Demandes au référent (arbitrages de cadrage — à trancher AVANT distillation)

- **§8-1 — Un nœud E ou 4 sous-nœuds ?** → **TRANCHÉ (référent, 2026-07-24) : UN SEUL NŒUD** multi-options
  routé par `situation_insuline`.
- **§8-2 — Insulines prémélangées / prandial systématique** → **TRANCHÉ (référent, 2026-07-24) : OPTION
  DÉGRADÉE / dernier recours, justifiée par l'EBM ou un consensus fort** (« oui si basé sur EBM ou consensus
  fort »). Ne pas proscrire absolument : le prémix garde une niche (ADA 2026 : patient refusant les injections
  multiples, repas réguliers → 2 inj/j plutôt que basal-bolus), affichée **explicitement dépriorisée** avec le
  motif EBM (Bertuol : prémix le moins performant pour la cible ; 4T : biphasique le pire ; ebmfrance « non
  fondé sur les preuves » ; SFD « dernier recours ») ; **jamais** proposée avant GLP-1/combo fixe ni basal-plus.
- **§8-3 — Modélisation de la forme des courbes / AGP** → **TRANCHÉ (référent, 2026-07-24) : MENU
  `profil_glycemique` À CHOIX MULTIPLE** (type `liste` : le MG peut cocher **plusieurs** motifs — hypo
  nocturne / phénomène de l'aube / excursions post-prandiales / hypo interprandiale / stable), **chaque motif
  assorti d'un tooltip de lecture de la courbe** (pédagogie AGP), **+ les métriques de sécurité** (`TBR`,
  `TBR_severe`, `CV_glycemique`) pour les alertes. Le `profil_glycemique` pilote le **texte de conduite à
  tenir** (quelle insuline ajuster) ; il ne gate pas les options (sauf via l'axe sécurité, §8-4).
- **§8-4 — Statut décisionnel des métriques de MCG** → **TRANCHÉ (référent, 2026-07-24) : MCG =
  interprétation/titration + alertes** (pas de gate « contrôle »). **Détail validé** : **axe CONTRÔLE**
  (TIR/TAR/GMI = redondants avec l'HbA1c qui gate déjà → interprétation + alertes seulement) ; **axe SÉCURITÉ**
  (TBR/TBR_severe/hypo nocturnes/CV>36 % = critère **dur**, EBM DEVOTE → **gate les recommandations de
  sécurité** : réduire la dose, passer 2ᵉ génération, relâcher la cible, désintensifier).
- **§8-5 — Frontière MG / spécialiste** → **TRANCHÉ (référent, 2026-07-24 — ÉLARGI) : le schéma BASAL-BOLUS
  est INCLUS dans le périmètre.** Situation 4 = optimiser la répartition basal/bolus **à partir des doses
  actuelles** (`dose_basale_actuelle`/`dose_rapide_actuelle`) + profil AGP, ajuster bolus/corrections,
  désintensifier, ajouter un GLP-1 pour réduire les besoins. **Alerte d'orientation** vers le spécialiste
  (± pompe / boucle fermée) si **déséquilibre persistant malgré optimisation** OU **situation particulière**
  (hypo sévère récurrente, non-perception de l'hypo, instabilité marquée `CV`/`TBR_severe`, grossesse/projet…).
  *(Le calcul FORMEL des ratios glucides-insuline (ICR) et du facteur de sensibilité reste optionnel — extension
  possible à confirmer ; non inclus dans le brouillon v0.1.)*
- **§8-6 — Cibles de MCG assouplies** → **TRANCHÉ (référent, 2026-07-24) : OUI.** Basculer en cibles relâchées
  **TIR > 50 %, TBR < 1 %** (TAR plus permissif) quand `fragilite == true OR esperance_vie == limitee OR
  age >= 75 OR risque_hypoglycemie_schema == eleve` (mêmes déclencheurs que la relaxation de cible du nœud A →
  cohérence inter-nœuds ; `HbA1c_cible` issue de A).
- **§8-7 — Granularité des doses** → **TRANCHÉ (référent, 2026-07-24) : l'outil AIDE AU CALCUL des doses.**
  Ajout de `poids`, `dose_basale_actuelle`, `dose_rapide_actuelle` en entrée. **Initiation** = poids × 0,1-0,2
  U/kg (ratio en argumentaire ; repli fixe 10 U). **Majorations/diminutions** calculées à partir des **doses
  actuelles** (+2 U ou +10-20 %/paliers ; −2 à −4 U ou −10-20 %) ; **basal-plus** ≈ 10 % de la basale.
  Calcul **au niveau du formulaire** (moteur = booléens ; précédent nœud C). **Scope basal/basal-plus** (pas de
  ratios glucides/FS = §8-5). *(Restant P3 : câblage du calcul dans le formulaire.)*
- **Textes Prescrire souhaités** : article dédié **insuline dans le DT2** (schémas, 2ᵉ génération) si disponible,
  au-delà de P1/P3/P5/P8 déjà en main.

## Annexe — Prompts OpenEvidence (débroussaillage référent, 2ᵉ passe)

5 prompts (OE-E1 à OE-E5) à lancer dans OpenEvidence **en parallèle** des agents A (triangulation A × B × OE,
`00-global.md` étape 4). **OE = débroussaillage, jamais source primaire** ; tout PMID/DOI/chiffre renvoyé sera
re-vérifié contre la source primaire au red-team. Chaque prompt exige explicitement l'effet **absolu / NNT-NNH
(+ horizon)**, la distinction **critère dur vs substitution**, et une appréciation **GRADE**.

**Périmètre OE — sources FR proscrites du prompt** : ne jamais demander à OpenEvidence d'explorer/citer
**HAS, SFD, CMG, Prescrire, Médicalement Geek/DragiWebdo, Minerva, ebmfrance** (accès non fiable → il
hallucine PMID/URL/positions ; OE-E5 avait ainsi fabriqué une position « Prescrire = NPH » et une « position
CMG », cf. §5). Ces sources sont curées **par les agents** (`docs/decision/sources/` + web + référent). Cf.
`00-global.md` (Règles de sourcing) et `BRIEF_DECISION.md` §14bis.

### OE-E1 — Initiation de l'insuline basale & choix vs prandial/prémélangé

> In adults with **type 2 diabetes** inadequately controlled on non-insulin therapy, when should **insulin**
> be started and which **initial regimen** is best? Compare **basal insulin added to oral agents / GLP-1
> receptor agonists** vs **prandial (bolus)** vs **premixed / biphasic** insulin as the **starting** regimen.
> Cover **Treat-to-Target** (Riddle 2003), the **4T study** (Holman, *NEJM* 2007 and 3-year 2009: basal vs
> prandial vs biphasic add-on to orals), and **ORIGIN** (Gerstein, *NEJM* 2012: basal glargine, cardiovascular
> outcomes and progression to diabetes). For each trial give **PMID/DOI, year, journal**, design, population,
> comparator, follow-up, and report **HbA1c change**, **hypoglycaemia** (rate + severe), **weight change**,
> and any **hard cardiovascular / mortality outcome** as **absolute effect / NNT-NNH (with horizon)**.
> Explicitly separate **hard outcomes (CV events, mortality, severe hypoglycaemia)** from **surrogates (HbA1c,
> fasting glucose, weight)**. Does starting with **prandial or premixed** insulin outperform basal, or does it
> only add hypoglycaemia and weight? Give a **GRADE** appraisal. Flag any figure not sourced to a primary trial.

### OE-E2 — Sécurité hypoglycémique : analogues basaux de 2ᵉ génération vs 1ʳᵉ génération / NPH

> In adults with **type 2 diabetes** on **basal insulin**, do **second-generation basal analogues** (insulin
> **degludec**, insulin **glargine U300**) reduce **hypoglycaemia** — especially **severe** and **nocturnal** —
> compared with **glargine U100 / detemir** and with **NPH**, at equivalent glycaemic control? Cover **DEVOTE**
> (Marso, *NEJM* 2017: degludec vs glargine U100 — MACE non-inferiority and severe hypoglycaemia), **SWITCH 2**
> (Wysham, *JAMA* 2017), **BRIGHT** (Rosenstock, *Diabetes Care* 2018: glargine U300 vs degludec head-to-head),
> **CONCLUDE**, and meta-analyses of **analogue vs NPH**. For each: **PMID/DOI, year**, design, population,
> comparator, follow-up; report **HbA1c** (non-inferiority?), **severe hypoglycaemia** and **nocturnal
> hypoglycaemia** as **absolute rates per arm + relative reduction / NNT**, **weight**, and any **CV /
> mortality** outcome. Separate the **hard outcome (severe hypoglycaemia, MACE)** from the **surrogate (HbA1c,
> glucose variability)**. Give a **GRADE** appraisal per comparison. Flag any unsourced figure.

### OE-E3 — Intensification : basale + GLP-1 (ou combo fixe) vs bolus / basal-bolus

> In adults with **type 2 diabetes** not at target on **basal insulin**, how should therapy be **intensified**?
> Compare (a) **adding a GLP-1 receptor agonist** to basal insulin (or a **fixed-ratio combination** — insulin
> **degludec/liraglutide (IDegLira, Xultophy)**, insulin **glargine/lixisenatide (iGlarLixi, Suliqua)**) vs
> (b) **adding prandial insulin** (basal-plus one injection, or full **basal-bolus**) vs (c) **premixed**
> insulin. Cover the **DUAL** programme (esp. **DUAL VII**: IDegLira vs basal-bolus), the **LixiLan** programme
> (**LixiLan-L / LixiLan-O**), **4T** and **FullSTEP** (Rodbard: stepwise basal-plus). For each: **PMID/DOI,
> year**, design, population, comparator, follow-up; report **HbA1c change**, **hypoglycaemia** (rate + severe),
> **weight change**, injection burden, as **absolute effect / NNT-NNH**. Is **GLP-1 / fixed-ratio** superior or
> non-inferior to **basal-bolus** with **less hypoglycaemia and weight gain**? Separate **hard outcomes
> (severe hypoglycaemia)** from **surrogates (HbA1c, weight)**. Are **prandial/premixed** regimens
> evidence-based first-line, or do they mainly add hypoglycaemia and weight? Give a **GRADE** appraisal. Flag
> any unsourced figure.

### OE-E4 — Mesure continue du glucose : métriques, cibles et bénéfice clinique

> In adults with **type 2 diabetes on insulin**, what are the standardised **continuous glucose monitoring
> (CGM)** metrics and their **targets**, and what is the **evidence that CGM-guided management improves
> outcomes**? Report the **international consensus targets** (**Battelino et al., *Diabetes Care* 2019**):
> **Time in Range (TIR) > 70 %**, **Time Below Range (TBR) < 4 %** (level 1 < 70 mg/dL) and **< 1 %** (level 2
> < 54 mg/dL), **Time Above Range (TAR) < 25 %** (and < 5 % > 250 mg/dL), **coefficient of variation ≤ 36 %**,
> **GMI**; and the **relaxed targets** for **older / high-risk** patients (TIR > 50 %, TBR < 1 %). Give **PMID/
> DOI** for the consensus. Then report the **outcome evidence**: the **association between TIR and microvascular
> complications** (**Beck 2019** — is it observational or from an RCT?), and **randomised trials of CGM in
> type 2 diabetes** including **MOBILE** (Martens, *JAMA* 2021: CGM in basal-only insulin-treated T2D) and
> **DIAMOND**/others — reporting **HbA1c change**, **hypoglycaemia / TBR**, as **absolute effect**. Be explicit:
> which outcomes are **hard** (severe hypoglycaemia, complications) vs **surrogate (HbA1c, TIR)**, and whether
> the **TIR targets themselves rest on expert consensus rather than hard-outcome RCTs**. Give a **GRADE**
> appraisal. Flag any unsourced figure.

### OE-E5 — Recommandations internationales indexées (insuline + MCG en DT2) — FR sources exclus

> What do **international clinical guidelines indexed in the peer-reviewed literature** recommend for **insulin
> therapy** and **CGM use** in type 2 diabetes? Cover the **ADA/EASD 2022 consensus report** (insulin after
> GLP-1, basal-plus stepwise, CGM) and the **ADA Standards of Care 2026** (Pharmacologic therapy & Diabetes
> Technology chapters: CGM targets, when CGM is indicated in insulin-treated T2D). Report, for each: **when to
> start insulin**, **preferred starting regimen (basal + orals/GLP-1 vs prandial/premixed)**, **second-generation
> basal analogues** (are they preferred for hypoglycaemia?), **intensification path (GLP-1/fixed-ratio before
> bolus?)**, and **CGM/TIR targets and indications** in insulin-treated T2D. Then state the **critical caveats
> straight from the primary trials**: insulin has **no demonstrated CV benefit** (ORIGIN neutral);
> prandial/premixed regimens are **not evidence-based first-line**; CGM targets are **consensus/surrogate**.
> Give **PMID/DOI** for each guideline and trial; **if you cannot ground a claim in a real indexed document, say
> so — do not invent a reference.** **Do NOT attempt to cover, summarise or cite French / independent-EBM
> sources (HAS, SFD, CMG/Collège de la Médecine Générale, Prescrire, Médicalement Geek/DragiWebdo, ebmfrance):
> the analysts curate those separately from the local corpus and the référent.** Flag anything unsourced.
