# Nœud C — Intensification / Optimisation du traitement   (dossier de preuve)

- **statut** : **VALIDÉ RÉFÉRENT + ENCODÉ + VÉRIFIÉ BI-AGENTS (2026-07-23)**. Dossier validé par le référent
  (Thibault) ; YAML `content/…/intensification.yaml` (v1.0, `meta.statut: valide`, **8 options**) + argumentaire
  niveau 3 `intensification.argumentaire.md` encodés et **vérifiés en 2 couches** : (1) **bi-agents dédiés à
  l'encodage** (Agent A fidélité × Agent B red-team moteur, 17 profils, 0 finding HAUTE, garde-fous de sécurité
  tous confirmés, **5 corrections appliquées** — cf. §7) ; (2) validation technique **Ajv + moteur : 85 tests +
  build/typecheck OK**. Tous les `[À VÉRIFIER]` **levés** (§5c, incl. 2ᵉ agent de vérification des sources).
  **Restant P2/P3** : chaînage inter-nœuds A→C (cible → `cible_atteinte`/`sur_traitement`, aujourd'hui dérivés
  par le formulaire) ; variables décompensation/cétose si besoin.
- **version** : 0.1 · **date** : 2026-07-23 · **auteur** : Opus + référent (Thibault)
- **id YAML cible** : `intensification` · domaine `diabete-type-2`
- **type de nœud** : **MULTI-OPTIONS** (plusieurs actions recommandables simultanément + `priorite` par ordre),
  comme B. Cf. `DECISIONS.md` D10. `traitements_en_cours` (multivalué, opérateur `contient`) est **central** ici.

## 0. Nature de ce dossier + ÉLARGISSEMENT du périmètre (garde-fou méthodo)

Le nœud C cadré initialement (`CADRAGE-8-noeuds.md §C`) = « **intensification** quand la cible (nœud A)
n'est pas atteinte » : *ajouter* un agent à bénéfice prouvé selon les comorbidités et ce qui manque dans
`traitements_en_cours`.

**Élargissement validé référent (2026-07-23)** — C devient **Intensification *ET* Optimisation**. Trois
leviers, pas un seul :

1. **Intensifier** — *ajouter* un agent à bénéfice prouvé (iSGLT2, AR GLP-1/tirzépatide) quand la cible
   n'est pas atteinte, selon les comorbidités et les classes déjà en place (chaînage B→C).
2. **Optimiser / substituer** — *retirer une molécule de faible valeur* (**sulfamide, gliptine/iDPP4**) et
   la *remplacer* par une molécule **plus efficace, plus protectrice, ou mieux tolérée** (iSGLT2, AR GLP-1).
   Peut s'appliquer **même à l'objectif glycémique atteint** si le régime contient un agent sans bénéfice
   d'organe alors qu'une indication de protection (IC / MRC / MCV / obésité) existe et n'est pas couverte.
3. **Désintensifier** — *retirer / alléger* un agent hypoglycémiant (sulfamide, insuline, glinide) chez le
   sujet **sur-traité** (HbA1c sous la cible du nœud A) à **risque d'hypoglycémie** (âgé, fragile, EV
   limitée), pour réduire l'iatrogénie sans perte de bénéfice.

> **Pourquoi cet élargissement est EBM-cohérent** : le socle de preuve du nœud B a établi que sulfamides
> et gliptines n'ont **aucun bénéfice d'organe** (CVOT tous en non-infériorité ; signal IC saxagliptine)
> et que les iSGLT2 / AR GLP-1 en ont un (CVOT vs placebo, effet-classe cardio-rénal). La substitution
> n'est donc **pas** une nouveauté clinique mais l'**application dynamique**, au régime *déjà en cours*, de
> la hiérarchie de valeur déjà tranchée en B. Le levier « désintensification » applique la logique de cible
> individualisée du **nœud A** (sur-traitement du sujet fragile). L'outil doit rendre ces trois gestes
> **explicites et proposables**, pas seulement « ajouter ».

Suit la pipeline `00-global.md` (Cadrer → Collecter → Apprécier → bi-agents → Distiller). Ce fichier fige
les **étapes 1-2** ; les §3-8 seront remplis par la collecte. **Aucun NNT/chiffre n'entre au YAML avant
vérification sur source primaire** ; tout élément non confirmé = `[À VÉRIFIER]`.

## 1. Question clinique & critères d'entrée (FIGÉ)

- **PICO** :
  - **P** = adulte DT2 déjà traité (metformine ± ≥1 autre classe), hors DT1/grossesse/décompensation aiguë,
    dans l'une des deux situations : (a) **cible glycémique du nœud A non atteinte** sous le traitement en
    cours ; **ou** (b) **régime sous-optimal** — présence d'un **sulfamide et/ou d'une gliptine** — pouvant
    être optimisé pour la protection d'organe et/ou la tolérance, y compris à l'objectif atteint ; **ou**
    (c) **sur-traitement** (HbA1c sous la cible individualisée) chez un sujet à risque d'hypoglycémie.
  - **I** = (1) *ajout* d'un iSGLT2 / AR GLP-1 / tirzépatide selon comorbidités et manques ; (2)
    *remplacement* d'un sulfamide ou d'une gliptine par un agent à bénéfice prouvé ; (3) *retrait / allègement*
    d'un agent hypoglycémiant.
  - **C** = poursuivre le régime en l'état / maintien du sulfamide ou de la gliptine / ajout « à l'aveugle »
    d'un agent glycémique sans logique de protection.
  - **O = critères DURS** (mortalité toutes causes et CV, IDM, AVC, hospitalisation pour IC, progression
    rénale / IRT) **+ critères de sécurité** décisionnels ici (**hypoglycémie sévère**, **poids**) vs
    **substitution** (HbA1c). ← comme en B, des bénéfices durs réels existent (CVOT) ; la nouveauté de C est
    que **l'hypoglycémie et le poids** deviennent des **moteurs de décision** (substitution/désintensification).

- **Variables d'entrée** (→ `criteres_entree`, cf. `CADRAGE-8-noeuds.md §C` + ajouts) :
  `HbA1c_actuelle` (nombre), `HbA1c_cible` (nombre — **sortie du nœud A**, chaînage), `traitements_en_cours`
  (**liste(enum)** : `metformine · iSGLT2 · aGLP1 · tirzepatide · sulfamide · gliptine · insuline · glinide ·
  pioglitazone`), `ASCVD_etablie` (bool), `insuffisance_cardiaque` (bool), `DFG` (nombre), `albuminurie`
  (normo/micro/macro), `IMC` (nombre), `risque_hypoglycemie_schema` (faible/élevé), `age` (nombre),
  `fragilite` (bool), `esperance_vie` (longue/intermediaire/limitee), `preference_injection`
  (accepte/refuse/indifferent), `contrainte_cout` (bool). Dérivées : `IRC` (de `DFG`+`albuminurie`),
  `sur_traitement` (dérivée : `HbA1c_actuelle` nettement < `HbA1c_cible`).

- **Frontières A → B → C** *(cohérent avec la décision référent #1 du nœud B, 2026-07-23)* :
  - **A** = fixe la **cible** d'HbA1c individualisée (dont relâchement du sujet fragile).
  - **B** = **initiation** de la protection cardio-rénale sur socle metformine (choix des agents selon
    comorbidités, indépendamment de l'HbA1c).
  - **C** = **dynamique du régime déjà en place** : intensifier si la cible A n'est pas atteinte, **et/ou**
    optimiser (substituer un agent de faible valeur), **et/ou** désintensifier (sur-traitement). C est le
    **seul nœud piloté par `traitements_en_cours`** ; il **ne re-propose jamais** une classe déjà présente et
    **ne propose jamais** d'associer deux agents pharmacologiquement redondants (voir garde-fous §2).

## 2. Options envisagées (esquisse FIGÉE — chiffres, seuils & CI à confirmer par collecte)

Nœud **multi-options** : plusieurs actions peuvent être recommandées ensemble (ex. « ajouter iSGLT2 » **et**
« arrêter le sulfamide »). Ordre = priorité par défaut ; préférence par critère dominant portée par les
`avantages`/l'argumentaire (comme B). Les `conditions` combinent les déclencheurs de comorbidité (repris de
B) **avec l'état de `traitements_en_cours`**.

### GARDE-FOUS DURS (contre_indications / règles transverses — à évaluer en priorité)

- **Ne jamais associer gliptine + AR GLP-1** (même voie incrétine → pas d'additivité, non recommandé) :
  quand on introduit un AR GLP-1 chez un patient sous gliptine, c'est un **remplacement**, pas un ajout.
  → règle pharmacologique dure. `[À VÉRIFIER — libellé exact SmPC / SFD / ADA-EASD]`.
- **iSGLT2** : seuil d'initiation **DFG ≥ 20** (KDIGO 2024) ; **exclu** en hyperglycémie sévère catabolique /
  cétose (acidocétose). Repris de B.
- **Ne pas désintensifier / retirer un agent PROTECTEUR** (iSGLT2, AR GLP-1) au motif de simplification :
  la désintensification vise les agents **sans bénéfice d'organe et iatrogènes** (sulfamide, glinide, excès
  d'insuline), pas les agents à bénéfice prouvé.
- **AR GLP-1** : bénéfice molécule-spécifique (exclure lixisénatide / exénatide LP — D12).

### Famille 1 — INTENSIFIER (cible A non atteinte : `HbA1c_actuelle > HbA1c_cible`)

*Mêmes déclencheurs de comorbidité que B, filtrés par ce qui MANQUE dans `traitements_en_cours`.*

- **Ajouter un iSGLT2** — `HbA1c_actuelle > HbA1c_cible AND (insuffisance_cardiaque OR DFG<60 OR
  albuminurie!=normo OR ASCVD_etablie) AND NOT (traitements_en_cours contient iSGLT2)`.
- **Ajouter un AR GLP-1** — `HbA1c_actuelle > HbA1c_cible AND (ASCVD_etablie OR IMC>=30) AND NOT
  (traitements_en_cours contient aGLP1) AND NOT (traitements_en_cours contient tirzepatide)`.
  → *si `traitements_en_cours contient gliptine`* : **remplacer la gliptine** (voir Famille 2), pas ajouter.
- **Ajouter l'autre classe protectrice (séquençage)** — cible non atteinte sous `metformine + iSGLT2` →
  ajouter AR GLP-1 si indication athéro/obésité ; sous `metformine + aGLP1` → ajouter iSGLT2 si indication
  IC/rénale. **Association iSGLT2 + AR GLP-1** : preuve d'additivité sur critère dur **faible** (cohortes /
  sous-groupes ; `[À VÉRIFIER — AMPLITUDE-O, DURATION-8, méta]`).
- **Intensification glycémique sans indication de protection forte** — cible non atteinte, pas de
  comorbidité dominante : privilégier un agent **sans hypoglycémie ni prise de poids** (AR GLP-1 si puissance
  HbA1c requise / obésité). **Sulfamide / gliptine = place résiduelle** (pas de bénéfice d'organe) → **renvoi
  nœud D** (contrainte de coût, alternatives inaccessibles).

### Famille 2 — OPTIMISER / SUBSTITUER (retirer un agent de faible valeur, le remplacer)

- **Remplacer le sulfamide par un iSGLT2 ou un AR GLP-1** — `traitements_en_cours contient sulfamide AND
  (indication de protection présente OR risque_hypoglycemie_schema==eleve OR IMC>=30 OR sur_traitement)`.
  **Rationale** : le sulfamide n'a **aucun bénéfice CV/rénal** et cause **hypoglycémie + prise de poids** ;
  le remplaçant apporte protection d'organe et/ou absence d'hypo + perte de poids. Choix du remplaçant piloté
  par la comorbidité dominante (IC/rein → iSGLT2 ; athérome/obésité → AR GLP-1). `[Effet à chiffrer :
  hypoglycémie évitée, Δ poids, Δ HbA1c — collecte]`.
- **Remplacer la gliptine par un AR GLP-1** — `traitements_en_cours contient gliptine AND (ASCVD_etablie OR
  IMC>=30 OR HbA1c_actuelle > HbA1c_cible)`. **Rationale** : voie incrétine commune (**pas d'additivité** →
  *switch, jamais add-on* — garde-fou dur) ; l'AR GLP-1 est **plus puissant sur l'HbA1c/le poids** (données
  tête-à-tête PIONEER-3 / SUSTAIN-2 / AWARD-5 `[À VÉRIFIER]`) et a un **bénéfice d'organe** que la gliptine
  n'a pas.
- **Remplacer / compléter la gliptine par un iSGLT2** — `traitements_en_cours contient gliptine AND
  (insuffisance_cardiaque OR DFG<60 OR albuminurie!=normo OR ASCVD_etablie)`. iSGLT2 + gliptine
  **pharmacologiquement compatibles** (voies distinctes) → ici *ajout* possible ; mais si simplification
  souhaitée, le switch reste préférable (la gliptine n'apporte pas de bénéfice d'organe). ⚠ **prudence
  saxagliptine si IC** (signal SAVOR) : dans ce cas, **arrêt** de la saxagliptine plutôt qu'ajout.

### Famille 3 — DÉSINTENSIFIER (sur-traitement / iatrogénie)

- **Alléger / arrêter le sulfamide, le glinide ou réduire l'insuline** — `sur_traitement==true (HbA1c_actuelle
  nettement < HbA1c_cible) AND (age élevé OR fragilite OR esperance_vie==limitee OR
  risque_hypoglycemie_schema==eleve) AND traitements_en_cours contient (sulfamide OR glinide OR insuline)`.
  **Rationale** : chez le sujet âgé/fragile, la cible A est relâchée ; un HbA1c « trop bas » sous agent
  hypoglycémiant = **sur-traitement iatrogène** (hypoglycémies, chutes). Désintensifier réduit ce risque sans
  perte de bénéfice d'organe (les agents retirés n'en ont pas). `[À VÉRIFIER — données de désintensification :
  sécurité glycémique, réduction des hypoglycémies]`. Chaînage explicite avec le nœud A (cible individualisée).

**Arbitrages de périmètre — À TRANCHER par le référent (voir §8)** :
1. Optimisation **à objectif atteint** (substituer un sulfamide/gliptine pour la protection alors que
   l'HbA1c est à la cible) : **inclus** (instruction référent 2026-07-23) — confirmer le seuil de
   déclenchement (toute présence de sulfamide/gliptine + indication de protection non couverte ?).
2. **Désintensification** : périmètre exact (variable `sur_traitement` dérivée vs seuil explicite type
   `HbA1c_actuelle < HbA1c_cible − marge`) et liste des agents allégeables.
3. Modéliser l'**association iSGLT2 + AR GLP-1** comme option à part entière (comme B) ou comme simple
   séquençage — selon la force de preuve d'additivité issue de la collecte.

## Sources en main & plan de collecte (2026-07-23)

**Déjà en main (réutilisable — pas de ré-extraction)** :
- **Base de preuve du nœud B** (`B-premiere-intention.md`) : CVOT iSGLT2 / AR GLP-1 / tirzépatide (ces essais
  sont des **essais d'*ajout* à la metformine ± SU** → directement pertinents pour l'intensification), plus
  l'**argumentation négative SU/gliptines** (pas de bénéfice d'organe) et l'**effet-classe D12**. Le « quel
  agent ajouter » de C = quasi-décalque de B.
- **Prescrire** (`sources/prescrire-dt2.md`) : **P3 « Quand la metformine ne suffit pas » (article CENTRAL de
  C)**, Tableaux 1-2 (essais 2e ligne + comparaisons tête-à-tête GRADE / TOSCA.IT / CAROLINA) ; P5-P8.
- **SFD 2025** (PDF référent) · **HAS 2024** (PDF référent).

**Ce que la collecte doit produire de NEUF (spécifique à C — non couvert par B)** — 4 thèmes bi-agents :
1. **Substitution sulfamide → iSGLT2/AR GLP-1** : quantifier hypoglycémie évitée, Δ poids, durabilité,
   protection ; désintensification du sulfamide. Ancrages : **CAROLINA** (glimépiride vs lina, neutralité CV
   mais hypo), **GRADE** (glimépiride vs sita vs lira vs glargine, add-on metformine), **ADOPT** (durabilité),
   Simpson 2015 (hiérarchie molécule).
2. **Substitution gliptine → AR GLP-1** : rationale pharmacologique de la **non-association** (voie incrétine
   commune), données tête-à-tête **PIONEER-3**, **SUSTAIN-2**, **AWARD-5** (GLP-1 > DPP4i sur HbA1c/poids) ;
   position guidelines (ADA/EASD, SmPC) sur « ne pas co-prescrire DPP4i + GLP-1 ».
3. **Désintensification / de-prescribing** (sujet âgé/fragile sur-traité) : sécurité de l'arrêt du
   sulfamide/de la réduction d'insuline, réduction des hypoglycémies (Choosing Wisely, études de
   dé-intensification en EHPAD/gériatrie, Lipska ; positions SFD/HAS « personne âgée »).
4. **Séquençage & association** (cible non atteinte sous bithérapie protectrice) : ajouter l'autre classe ;
   **preuve d'additivité iSGLT2 + AR GLP-1 sur critère dur** (DURATION-8, AMPLITUDE-O sous-groupes,
   méta-analyses, cohortes ; essai PRECIDENTD en cours) ; place de la trithérapie / de l'insuline basale.

*OpenEvidence / web = débroussaillage (référent), **jamais** source primaire. Prompts OE : voir §Annexe.*

## 3. Base de preuves (grille par étude clé) — CONSOLIDÉE (bi-agents A/B, 2026-07-23)

> **Garde-fou** : matrices bâties par Agent A (extraction, Sonnet) × Agent B (red-team, Opus, vérif. DOI/PMID
> et chiffres vs source primaire). **PMID/DOI ci-dessous vérifiés par l'Agent B** (sauf mention). Chiffres
> issus de sources secondaires ou texte intégral bloqué (paywall NEJM/Lancet/JAMA) = **`[À VÉRIFIER]`**. La
> **2ᵉ passe OpenEvidence** (prompts §Annexe, à lancer par le référent) et la curation **Prescrire/HAS/SFD**
> ne sont **pas encore intégrées**. Réutiliser les matrices iSGLT2/AR GLP-1 du **nœud B** pour le socle
> « bénéfice d'organe » (non ré-extrait ici).

### SOUS-DOSSIER 1 — Substitution sulfamide → iSGLT2 / AR GLP-1 (+ désintensification du sulfamide)

**Fait structurant** : **aucun ECR de *switch* dédié** (randomiser « poursuivre le sulfamide » vs « le
retirer/remplacer », critère dur en principal) n'existe. Les essais ci-dessous sont des essais d'**ajout** /
d'initiation → l'argument de substitution pour la *protection* est **indirect** (importé du socle nœud B :
iSGLT2/GLP-1 ont un bénéfice d'organe, le SU n'en a aucun). En revanche l'argument **hypoglycémie + poids +
durabilité** est **direct** (tête-à-tête).

| Essai (PMID) | Design / comparateur | Résultat clé | Lecture |
|---|---|---|---|
| **CAROLINA** (31506969, JAMA 2019) | ECR NI-CV, linagliptine vs **glimépiride** add-on, N=6033, 6,3 ans | CV composite **HR 0,98 [0,84–1,14]** (NI, pas de supériorité) ; **hypo sévère 0,3 % vs 2,2 %**, HR 0,15 [0,08–0,29], **NNT 45 / 6,3 ans** ; hypo ≥1 épisode 10,6 % vs 37,7 % ; **poids −1,54 kg** vs glimépiride | Confirme **absence de bénéfice d'organe du SU** ; quantifie l'hypo/poids évités. Comparateur **actif** (2 agents sans bénéfice d'organe) → n'informe **que** le compromis hypo/poids. `[texte intégral hypo/poids À VÉRIFIER]` |
| **GRADE** (36129996, NEJM 2022) | ECR pragmatique 4 bras add-on metformine : **glimépiride** vs sitagliptine vs liraglutide vs glargine, N=5047, ~5 ans | **Hypo sévère (ITT)** glimépiride **2,2 %** / glargine 1,3 % / liraglutide 1,0 % / sitagliptine 0,7 % ; poids à 1 an liraglutide **−3,5** / sita −1,07 / glargine +0,45 / **glimépiride +0,89 kg** ; durabilité glycémique liraglutide/glargine > sitagliptine ; **signal CV secondaire favorable au liraglutide** (NEJMoa2200436, exploratoire) | ⚠ **correction red-team** : retenir **2,2 % ITT** (et non 1,3 % per-protocole). Hiérarchie défavorable au SU. GRADE élevé. `[Δ HbA1c/poids à l'horizon final À VÉRIFIER]` |
| **ADOPT** (17145742, NEJM 2006) | ECR monothérapie, glyburide vs metformine vs rosiglitazone, 4 ans | Glyburide = **agent le moins durable** (HbA1c<7 % maintenue **33** vs 45 vs 60 mois) ; poids glyburide **+1,6 kg** | Renforce l'épuisement β-cellulaire du SU (durabilité médiocre) |
| **TOSCA.IT** (28917544, Lancet D&E 2017) | ECR add-on metformine, **SU** vs pioglitazone, ~57 mois | CV composite **HR 0,96 [0,74–1,26] p=0,79** (neutre) ; hypo **34 % (SU) vs 10 %** | Confirme neutralité CV + moindre tolérance hypo du SU. Comparateur = pioglitazone (pas iSGLT2/GLP-1) |
| **UKPDS 33** (9742976, Lancet 1998) | ECR intensif (SU/insuline) vs conventionnel | Micro **−25 %** ; IDM **tendance p=0,052** | Bénéfice de la **cible glycémique**, **pas** effet propre du SU. `[« 16 % » IDM À VÉRIFIER]` |
| **ADVANCE** (18539916, NEJM 2008) | ECR intensif base **gliclazide MR** vs standard | Combiné macro+micro **HR 0,90 [0,82–0,98]**, porté par néphropathie **−21 %** (dont microalbuminurie = mou) ; **aucun bénéfice macrovasculaire** (0,94 [0,84–1,06]) | Bénéfice de **cible/stratégie**, pas de la molécule. Ne PAS retourner en « le SU protège » |
| **Simpson 2015** (25466239, Lancet D&E) | Méta-**réseau bayésien** mortalité intra-classe SU (18 études, 167 327 pts, **7 ECR seulement** — reste observationnel) | **gliclazide RR 0,65 [0,53–0,79]**, glimépiride 0,83 [0,68–1,00], glipizide 0,98 vs **glibenclamide (le pire)** *(intervalles de crédibilité, vérifiés)* | **Majoritairement OBSERVATIONNEL** → certitude **basse** (confusion par indication). Si SU conservé : gliclazide/glimépiride, **jamais glibenclamide**. |

**Non-association gliptine + GLP-1** confirmée transversalement (voir sous-dossier 2).

### SOUS-DOSSIER 2 — Substitution gliptine (iDPP4) → AR GLP-1 (non-association)

**Le mieux étayé des trois leviers en tête-à-tête** — mais **uniquement sur substitution (HbA1c/poids)** ;
aucun critère dur (bénéfice d'organe importé du nœud B). Corrections d'auteur/PMID red-team appliquées.

| Essai (PMID) | Comparateur (add-on metformine) | ΔHbA1c vs gliptine | ΔPoids | Note |
|---|---|---|---|---|
| **PIONEER-3** (30903796, JAMA 2019) | séma **oral** vs sitagliptine, 26 sem | −0,3 % (7 mg) / **−0,5 %** (14 mg) | −1,6 / **−2,5 kg** | metformine ± SU |
| **SUSTAIN-2** (28385659, Ahrén B — *corr.*) | séma **SC** 0,5/1,0 vs sitagliptine, 56 sem | **−0,77 / −1,06 %** | **−2,35 / −4,20 kg** | écart le plus large |
| **AWARD-5** (24742660 à 52 sem ; 25912221 à 104 sem — *corr. appariement*) | dulaglutide vs sitagliptine | −1,10 % vs −0,39 % (52 s) ; −0,99 vs −0,32 (104 s) | −2,88 / −2,39 vs −1,75 kg | bras placebo |
| **HARMONY-3** (24898304, Ahrén B — *corr.*) | **albiglutide** vs sitagliptine vs glimépiride, 104 sem | −0,4 % vs sita ; −0,3 % vs glim | −1,21 vs −0,86 (NS) vs **+1,17 kg** (SU) | ⚠ **albiglutide RETIRÉ du marché** → preuve de **classe** only |
| **Pratley 2012** (22851600, Diabetes Care) | **SWITCH** sitagliptine→liraglutide (design le + proche du nœud C) | **−0,2 / −0,5 % additionnels** post-switch | **−1,6 / −2,5 kg** | ouvert ; démontre qu'un *switch* « marche » |
| **Méta switch Tran/Kramer** (29364587, DOM 2018) | 5 études, n=433, iDPP4→GLP-1 | **−0,69 % [−1,03 ; −0,35]** | **−2,25 kg [−3,12 ; −1,38]** | sans sur-risque hypo |

**Règle de NON-ASSOCIATION iDPP4 + AR GLP-1 — RÉSOLUE (OE + HAS, 2026-07-23)** : base mécanistique = **Nauck
2017** (27709794, DOM ; +78 % GLP-1 / +90 % GIP **sans** gain glycémique → « do not support combination »), et
**sources de recommandation verbatim** : **ADA 2026 §9** (« Use of GLP-1 RAs together with a DPP-4 inhibitor is
**not recommended**, as there is no added glucose-lowering benefit »), **KDIGO 2022 PP 4.2.3** (« GLP-1 RA
**should not be used in combination** with DPP-4 inhibitors… consideration may be given to **stopping the
gliptin** »), **HAS R.80/R.53 (AE)** (« Il n'y a pas lieu d'associer GLP1 et iDPP4 »). ⚠ **correction red-team
maintenue** : ne PAS attribuer la règle à l'ADA/EASD **2022** (aucune phrase) ni à des bulletins d'assureurs.
Reliquat mineur : libellé exact RCP/SmPC ANSM/EMA `[À VÉRIFIER, non bloquant]`.

**iSGLT2 + iDPP4 = compatibles** (voies distinctes, additivité HbA1c documentée — Cho YK 2018, PMID 29449146
[*corr. : pas Scheen*], WMD HbA1c ~−0,62 % vs iDPP4 seul `[chiffres exacts À VÉRIFIER]`). Mais la gliptine
n'ayant **aucun bénéfice d'organe**, le **switch** reste préférable à l'empilement.

### SOUS-DOSSIER 3 — Désintensification / de-prescribing (sujet âgé/fragile sur-traité)

**Niveau de preuve structurellement FAIBLE** (aucun ECR de devenirs durs « déprescrire vs poursuivre »).
Corpus = épidémiologie du sur-traitement + 1 ECR d'implémentation + accord d'experts. **À afficher comme tel**
(contraste fort avec le nœud B).

| Source (PMID) | Type | Résultat | Portée |
|---|---|---|---|
| **Lipska 2015** (25581565) | Transversal NHANES | **61,5 %** des ≥65 ans HbA1c<7 % ; **54,9 %** d'entre eux sous insuline/SU (60 % strate « très complexe »), sans diff. entre strates | **Ampleur** du sur-traitement |
| **Sussman 2015** (26502220) | Cohorte VHA | **Inertie de désescalade** (HbA1c<6 % : seulement **27 %** désintensifiés) | Écart de pratique |
| **Alexopoulos/Kahkoska 2021** (34726745) | Cohorte Medicare | Après hypo sévère, désintensif. à 100 j : **44,2 % (SU) / 24,0 % (insuline) / 48,1 %** ; aOR fragilité 1,50, IRC 1,29, chute 1,20 | < ½ des hypo sévères mènent à l'allègement |
| **Lega 2021** (33491105 — *corr. B*) | Cohorte Ontario | Contrôle intensif à agents haut risque → sur-risque composite (urgences/hospit./décès 30 j) **RR 1,49 [1,08–2,05]** | Observationnel (confusion) ; **supprimer le « ~1 % »** d'Agent A (non sourcé) |
| **HYPOAGE / Christiaens 2025** (39172937, Diabetes Care) | Cohorte CGM, n=134 ≥75 ans sous insuline | Sur-traitement **19 %** (seuil fixe) / **40 %** (individualisé) ; **sensibilité de l'HbA1c pour prédire l'hypo réelle = 20 % / 41 %** | ⚠ **l'HbA1c seule = mauvais marqueur du risque hypo** → intégrer **historique hypo/chute**, pas qu'un seuil |
| **Grant 2025** (40549370, JAMA IM) | **ECR** cluster d'implémentation, N=450 ≥75 ans HbA1c≤8 % sous insuline/SU | Déprescription 6 mois **15,8 % vs 9,0 %** (RD **+7,5 % [1,5–13,6], P=.01** — *corr. B*) ; **hypo sévère 4,7 % vs 6,5 % NS** ; **pas de dégradation glycémique** | Meilleure preuve RCT : déprescrire **plus** ≠ excès d'hypo ni perte de contrôle. ⚠ essai de **processus**, pas « déprescrire vs poursuivre » sur critères durs. **ED-visits 0 vs 4 = exploratoire, hors abstract, ne pas survendre** |

**Guidelines convergentes** (accord d'experts) : **AGS Choosing Wisely** (<7,5 % chez la plupart des >65 ans
avec comorbidités) ; **Endocrine Society** (LeRoith 2019, PMID 30903688 [*corr. auteur*] : éviter SU/glinides,
insuline prudente, **désintensifier si HbA1c sous la cible individualisée**) ; **Endocrine Society hypo** (McCall
2023, PMID 36477488) ; **ADA Older Adults** ; **HAS 2024** (règle « ne pas intensifier si HbA1c < 0,5 pt sous la
cible » `[À VÉRIFIER texte officiel]`) ; **SFD 2025** (chapitre déprescription renforcé vs 2023 `[À VÉRIFIER]`).

### SOUS-DOSSIER 4 — Séquençage & association iSGLT2 + AR GLP-1

**Gradient de preuve net** : additivité **DÉMONTRÉE sur HbA1c/poids** ; **AUCUN ECR dédié** sur critère **dur**
pour l'association.

| Source (PMID) | Ce que ça montre | Ce que ça ne montre PAS |
|---|---|---|
| **DURATION-8** (30082326, Diabetes Care 2018) | exénatide+dapa vs chacun seul : HbA1c **−1,75 % vs −1,38 vs −1,23** ; poids **−3,31/−1,51/−2,28 kg** → **additivité glycémique/pondérale** | Critère **dur** (comparateur actif ; exénatide **exclu** du socle bénéfice — nœud B) |
| **AMPLITUDE-O sous-groupe** (34775781, Lam Circulation 2022) | effet du GLP-1 **cohérent** avec/sans iSGLT2 de fond (N=618, 15,2 % ; **p interaction 0,68**) | **non-antagonisme ≠ additivité** (sous-puissant) |
| **Neves 2023** (37532422, JACC) | Harmony+AMPLITUDE-O, p interaction MACE **0,95** | ⚠ **corr. B** : HR MACE **0,77 [0,68–0,87] = strate SANS iSGLT2** ; **strate AVEC iSGLT2 = 0,78 [0,49–1,24] NON significatif** → ne jamais citer 0,78 comme preuve positive |
| **Colombijn 2025/26** (41117973, Diabetologia) | méta **18 cohortes observationnelles** (1,16 M) : RR bi vs mono MACE 0,56 / mortalité 0,50 / **mortalité CV 0,26** / hosp IC 0,67 / rénal 0,48 | **GRADE faible–très faible** ; mortalité CV 0,26 = **invraisemblable** (confusion par indication) → **jamais causal** |
| **Neuen 2024** (37952217, Circulation) | **modélisation** trithérapie : gains **projetés** +3,2 ans MACE, +5,5 rénal, +2,4 survie | **jamais observé** (projection ; toujours dire « estimé/modélisé ») |
| **PRECIDENTD** (41456635, AHJ 2026) | phase faisabilité **dual vs mono** : **arrêt 49 % (dual) vs 22 % (mono)**, délivrance 53 % vs 84 % | efficacité CV/rénale (essai principal 6000 pts **EN COURS**) → **signal de prudence observance** |

**MàJ 2ᵉ passe OpenEvidence (2026-07-23)** — le socle « chaque classe garde son bénéfice quand l'autre est
présente » est **renforcé** par deux méta-analyses collaboratives (au-delà de Neves 2023) : **SMART-C**
(Apperloo *Lancet D&E* 2024, 12 ECR iSGLT2, n=73 238 ; bénéfice iSGLT2 maintenu ± AR GLP-1, tous p-hét > 0,3) et
**Neuen** (*Circ* 2024;150:1781, 3 CVOT GLP-1, n=17 072 ; bénéfice GLP-1 maintenu ± iSGLT2, p-hét > 0,2, HHF
même numériquement meilleure 0,58). Additivité glycémique/pondérale confirmée par ECR dédiés d'ajout :
**SUSTAIN-9** (séma sur iSGLT2, ΔHbA1c −1,42 %), **AWARD-10** (dulaglutide sur iSGLT2, −0,79 %), DURATION-8.
Sur critère **dur**, la NMA d'ECR reste **neutre** (Chuang *CMAJ* 2026 : MACE NS, seule HHF significative, GRADE
très bas) ; le RR observationnel (Colombijn) est biaisé. → **arbitrage #3 tranché = séquençage** (cf. §8).

**Intensification vers insuline** (frontière C→E) — **« SIMPLE » RÉSOLU** = **Abreu 2019** (*DOM*, DOI
10.1111/dom.13794) : AR GLP-1 + insuline basale vs basal-bolus chez HbA1c ≥ 10 % (moy. ~12 %), HbA1c **−4,1 vs
−3,4 %** (ETD −1,1 %, supériorité + non-infériorité), **hypo 35 % vs 66 %**, poids **−3,7 kg**, dose d'insuline
moindre. Corroboré par **DUAL VII** (IDegLira vs basal-bolus : HbA1c équivalente, hypo RR 0,39, poids −3,6 kg) et
**BEYOND** (simplification du basal-bolus faisable/durable chez ~½). **ADA 2026** : privilégier basale + AR GLP-1
au basal-bolus. → argument de **faisabilité/simplicité**, pas de bénéfice dur. Chaînage vers le **nœud E**.

## 4. Synthèse critique (reco officielle vs position raisonnée) — INTÉGRÉE (HAS 2024 + SFD 2025 + OE)

### Reco officielle française — HAS 2024 (RBP « Stratégie thérapeutique du DT2 », grades) & SFD 2025 (avis)

**Intensifier** :
- **HAS R.64 (A)** : antécédent MCV → iSGLT2 ou aGLP1, indépendamment de l'HbA1c et de la metformine.
  **R.65 (A)** : IC → iSGLT2 « en association aux autres classes, **quitte à alléger le traitement
  anti-hyperglycémiant par ailleurs si besoin** ». **R.66 (A)** : MRC → iSGLT2. **R.70 (B)** : prévention
  primaire haut risque CV → iSGLT2/aGLP1. **R.71 (C)** : obésité IMC≥30 → aGLP1.
- **HAS R.74 (AE)** — risque CV modéré, **ordre préférentiel** : 1. iSGLT2/aGLP1 · 2. iDPP4 · 3. sulfamide ·
  4. répaglinide · 5. inhibiteur alphaglucosidase. **R.77-R.78 (C)** : trithérapie, même ordre préférentiel.
- **SFD 2025 Avis 11-15** : iSGLT2 / AR GLP-1 / AR GIP-GLP-1 si haut risque CV/athérome/IC/MRC indépendamment
  de l'HbA1c ; puis **intensifier** si l'objectif individualisé n'est pas atteint. **ADA 2026** : ajouter
  l'autre classe cardio-protectrice **avant** l'insuline.
- **Règle d'arrêt d'un non-répondeur (SFD Avis 5)** : iDPP4 / iSGLT2 / AR GLP-1 / AR GIP-GLP-1 **arrêtés si la
  baisse d'HbA1c est < 0,5 %** (et HbA1c > objectif) 3-6 mois après l'initiation, titration/adhésion correctes
  — **SAUF** indication de protection (alors **poursuivis quelle que soit l'HbA1c**).

**Substituer** :
- **HAS R.69 (AE)** : « la prescription des sulfamides en bithérapie n'est **plus la stratégie préférentielle**
  (risques d'hypoglycémies sévères + molécules à bénéfice démontré) ». **R.53 / R.80 (AE)** : **« Il n'y a pas
  lieu d'associer GLP1 et iDPP4 »** ni deux molécules de même mécanisme → *switch*, pas *add-on*.
- **SFD Avis 5** : **SU et glinides arrêtés si baisse d'HbA1c < 0,5 % OU hypoglycémies répétées**. **Avis 6
  (Tableau III)** : SU = risque hypo (surtout glibenclamide ; glimépiride préférable), prise de poids, sécurité
  CV moins démontrée ; iDPP4 = neutre pondéral, sans hypo, ↑hospit. IC (saxagliptine).
- **ADA 2026 §9** + **KDIGO 2022 (PP 4.2.3)** *(verbatim OE)* : « GLP-1 RA **should not be used in combination**
  with DPP-4 inhibitors… consideration may be given to **stopping the gliptin** to facilitate treatment with a
  GLP-1 RA instead ».

**Désintensifier** :
- **HAS R.103 (AE)** : « réévaluer les objectifs régulièrement, **éviter le surtraitement** ; une
  **désintensification peut être proposée pour réduire le risque iatrogénique**, en particulier d'hypo ».
  **R.105 (AE)** : sujet âgé fragile/malade, **écart < 0,5 % HbA1c → abstention** médicamenteuse envisageable.
  **R.102 (AE)** : SU avec précaution chez l'âgé, **jamais** le SU longue durée chez les plus âgés si
  alternative. **R.46 (AE)** : à chaque changement, envisager arrêt/désescalade.
- **SFD Avis 5 bis (Déprescription)** : « concernant les agents de l'hyperglycémie, la déprescription doit
  **systématiquement être proposée** devant un effet secondaire invalidant » (hypo/malaise hypovolémique
  SU/insuline/iSGLT2, troubles digestifs sévères metformine/GLP-1) ; acte médical → surveillance après.
  **Avis 3 / Tableau I** : chez l'âgé sous SU/glinide/insuline, cible relâchée (ne pas viser < 7 %) ; **éviter
  le SU chez le fragile, jamais chez le dépendant**. **ADA 2026 (13.14a-d)** : désintensifier
  insuline/SU/glinides ou switcher vers une classe à faible risque d'hypo (B) ; **maintenir iSGLT2/AR GLP-1
  pour le bénéfice cardio-rénal, quelle que soit la glycémie (A)**.

### Position critique (Prescrire) — affichée à côté
Prescrire P3 : quand la metformine ne suffit pas, **GLP-1 (séma/dulaglutide) 1er choix** si HbA1c > 7,5 %,
dapagliflozine si IC/IR ; **gliptines + pioglitazone « plus dangereuses qu'utiles, à écarter quelle que soit la
situation »** (plus dur que HAS/SFD, qui gardent l'iDPP4 en place résiduelle). EV faible → ne pas ajouter de
médicament tant que HbA1c ≤ 8,5-9 %.

### Divergence
**FAIBLE reco↔critique sur la direction** : tous relèguent SU/gliptines, priorisent iSGLT2/GLP-1 pilotés par
comorbidité, endossent la désintensification. **Divergences** : (1) Prescrire **écarte** l'iDPP4 là où HAS/SFD
le gardent en option ; (2) **granularité EBM (D12)** — l'outil ne durcit pas les gains hypo/poids/HbA1c en
bénéfice cardio-rénal, et nomme la molécule quand la protection est molécule-spécifique.

## 5. Vérification bi-agents (réconciliation Opus, 2026-07-23)

**Dispositif** : Agent A (extraction, Sonnet) + Agent B (red-team, Opus), contextes séparés, 4 thèmes.
**OpenEvidence (2ᵉ passe) et Prescrire/HAS/SFD non encore intégrés** → le dossier n'est **pas** au niveau de
consolidation du nœud B ; les `[À VÉRIFIER]` ci-dessous doivent être levés (OE + curation référent + texte
intégral) avant distillation YAML.

**5a. Consensus vérifié (A + B, PMID/DOI confirmés contre source primaire)** :
- Sous-dossiers 1-2 : **aucun bénéfice d'organe du SU/de la gliptine** (CAROLINA HR 0,98 ; TOSCA.IT 0,96) ;
  **hypo/poids nettement en faveur du remplaçant** (CAROLINA NNT 45 hypo sévère ; GRADE ITT 2,2 %). Switch
  gliptine→GLP-1 étayé (PIONEER-3, SUSTAIN-2, AWARD-5, **Pratley switch**, méta **Tran 29364587**). **Non-
  association gliptine+GLP-1** = Nauck 2017 (27709794).
- Sous-dossier 3 : ampleur du sur-traitement + inertie (Lipska, Sussman, Alexopoulos) ; **HYPOAGE** (l'HbA1c
  seule ne prédit pas l'hypo) ; **Grant 2025** (déprescrire plus ≠ excès d'hypo).
- Sous-dossier 4 : additivité **glycémique/pondérale** (DURATION-8) ; **non-antagonisme** CV (p interaction
  0,68–0,95) ; signal **observance défavorable** de la bithérapie (PRECIDENTD 49 % vs 22 %).

**5b. Corrections red-team appliquées (spin / erreurs d'Agent A)** :
- GRADE hypo sévère : **2,2 % ITT** (pas 1,3 % per-protocole).
- Auteurs/PMID : SUSTAIN-2 = **Ahrén** ; HARMONY-3 = **Ahrén** ; AWARD-5 **24742660** (52 s) ≠ 25912221 (104 s) ;
  iSGLT2+iDPP4 = **Cho YK** (29449146, pas Scheen) ; Endocrine 2019 = **LeRoith** ; Lega = **33491105**.
- **Non-association** : source = **Nauck 2017 / RCP**, **pas** ADA/EASD ni assureurs US.
- Neves : **0,77 = strate SANS iSGLT2** ; strate AVEC = **0,78 NS** → non-antagonisme, pas additivité.
- Grant : **RD +7,5 % [1,5–13,6], P=.01** ; **ED-visits 0 vs 4 = exploratoire hors abstract** (ne pas survendre).
- **Interdits de voix (outil)** : ✗ « le sulfamide protège » (bénéfice de cible, pas de molécule) · ✗
  substitution/désintensification présentées comme bénéfice **dur** · ✗ association présentée avec un NNT dur ·
  ✗ mortalité CV 0,26 (Colombijn) sortie de son contexte observationnel.

**5c. Statut des `[À VÉRIFIER]` après 2ᵉ passe OE + lecture HAS 2024 / SFD 2025 (2026-07-23)** :
- **LEVÉS** :
  - **Non-association gliptine+GLP-1** — sources primaires trouvées : **ADA 2026 §9** + **KDIGO 2022 PP 4.2.3**
    (verbatim « should not be used in combination… stopping the gliptin »), **HAS R.80/R.53 (AE)**, mécanisme
    Nauck 2017 (+78 % GLP-1/+90 % GIP sans gain). ✓
  - **CAROLINA hypo** — /100 patients-années confirmées : sévère **0,07 vs 0,45** (HR 0,15) ; **60,8 hypo
    évitées /100 p-a** en récurrent (Rosenstock DOM 2023) ; poids −1,54 kg. ✓
  - **GRADE** — hypo sévère **2,2 % ITT** confirmée ; signal CV secondaire liraglutide (Green *Circ* 2024 :
    MACE-5 HR 0,70, HHF 0,49 — **exploratoire**, population à faible risque). ✓
  - **« SIMPLE » RÉSOLU** = **Abreu 2019** (*DOM*, DOI 10.1111/dom.13794) : GLP-1 + basale vs basal-bolus, HbA1c
    −4,1 vs −3,4 % (ETD −1,1 %, supériorité), **hypo 35 % vs 66 %**, poids −3,7 kg. ✓ (chaînage C→E). Corroboré
    par **DUAL VII** (IDegLira, hypo RR 0,39) et **BEYOND** (simplification basal-bolus faisable chez ~½).
  - **Règle « écart < 0,5 % »** = **HAS R.105** + **SFD Avis 5** confirmées. ✓
  - **Reco officielle** (intensification / switch / déprescription) : HAS R.45-R.105 + SFD Avis 3/5/5bis/6/11-15
    + ADA 2026 + KDIGO 2022 — **intégrée §4**. ✓
- **LEVÉS par l'agent de vérification dédié (2026-07-23)** :
  - **Simpson 2015** (25466239) — RR **confirmés** (gliclazide 0,65 [0,53-0,79] · glimépiride 0,83 [0,68-1,00]
    · glipizide 0,98 vs glibenclamide), mais ce sont des **intervalles de crédibilité** (méta-réseau bayésien),
    et le design est **majoritairement OBSERVATIONNEL** (18 études, 167 327 pts ; **7 ECR seulement**,
    sous-dimensionnés, seule l'UKPDS avec critère CV prévu) → **preuve de faible niveau**, usage « moindre-mal »
    uniquement (§3 sous-dossier 1 mis à jour). ✓
  - **GRADE** — **aucune valeur ponctuelle Δ HbA1c/poids par bras à ~5 ans n'est publiée** (le NEJM ne donne que
    le chiffré à 1 an + une tendance qualitative + l'incidence cumulée d'échec /100 p-a : glargine 26,5 ·
    liraglutide 26,1 · glimépiride 30,4 · sitagliptine 38,1). → **ne rien citer « à 5 ans »** (l'outil ne le fait
    pas). ✓
  - **Diabetes Care dc25-0517** = **Shabnam 2025** (PMID **40532134**) — ⚠ **étude NÉGATIVE/rassurante** :
    HbA1c<7 % soutenue sous SU/insuline chez l'âgé → **chutes HR 1,04 [0,96-1,11]**, **fractures HR 1,07
    [0,97-1,17]** (IC croisent 1). → **ne pas** l'utiliser comme preuve que le sur-traitement « cause » des
    chutes (l'outil ne la cite pas). ✓
  - **Non-association RCP/SmPC** — **le libellé n'existe PAS** dans les RCP EMA/ANSM (Januvia/Ozempic/Victoza :
    aucune mention ; Trulicity : sitagliptine citée seulement en interaction PK 4.5). La règle vient d'**ADA
    2026 / KDIGO 2022 / HAS R.80** (+ mécanisme Nauck 2017), **pas** d'un RCP → **ne jamais attribuer à un RCP**.
    L'outil source déjà via ADA/KDIGO/HAS. ✓ **(reliquat clos)**
  - **Grant 2025** — DOI correct = **10.1001/jamainternmed.2025.2015** (PMID 40549370) ; le « .2413 » (occurrence
    OE) est **erroné**. ✓

## 6. Incertitudes

- **Bénéfice dur de la *substitution* elle-même** : jamais testé en *switch* (argument indirect = valeur
  comparée des classes). Ne le sera probablement pas (pas d'équipoise pour re-tester le SU/la gliptine).
- **Additivité iSGLT2 + AR GLP-1 sur critères durs** : non démontrée (sous-groupes sous-puissants + cohortes
  biaisées + modélisation) ; **PRECIDENTD** en cours. Additivité glycémique/pondérale, elle, acquise.
- **Désintensification** : niveau de preuve faible/accord d'experts ; pas d'ECR de devenirs durs.
- **Seuil de déclenchement de l'optimisation à objectif atteint** (arbitrage §8-1).
- **Marqueur du sur-traitement** : l'HbA1c seule est insuffisante (HYPOAGE) → faut-il une variable
  `hypoglycemie_recente`/`chute` en entrée du nœud C ? (arbitrage §8-2).

## 7. → YAML (contenu distillé) — ENCODÉ + VÉRIFIÉ BI-AGENTS (2026-07-23)

Encodé dans `content/noeuds/diabete-type-2/intensification.yaml` (nœud **multi-options**, **10 options** triées
par `priorite` : **1** sécurité (désintensifier ; **arrêter la metformine si DFG < 30**) → **2** introduire
iSGLT2 / AR GLP-1 / remplacer la gliptine / arrêter la gliptine redondante / **réduire la metformine si DFG
30-59** → **3** remplacer le sulfamide → **4** intensification glycémique résiduelle → **défaut** poursuivre) +
argumentaire niveau 3 `intensification.argumentaire.md`. **Garde-fous encodés** :
`exclusions: ["DFG < 20"]` sur l'iSGLT2 (retrait tracé, D13) ; **non-association gliptine+GLP-1 par
construction** (l'ajout GLP-1 exige `ne_contient_pas gliptine`) ; la désintensification ne cible que
sulfamide/glinide/insuline (jamais un agent protecteur, ADA 13.14d) et est **exclusive** des options de
remplacement/intensification (`sur_traitement == false` ET `hypoglycemie_recente == false` sur celles-ci).
**Critères dérivés** `cible_atteinte` / `sur_traitement` (+ `hypoglycemie_recente`) calculés par le formulaire
(D3 ; contrat : les 13 critères fournis inconditionnellement).

**Vérification d'encodage bi-agents (étape 8 dédiée — 2026-07-23)** : Agent A (fidélité, contexte isolé) ×
Agent B (red-team du moteur, contexte isolé, traçage de 17 profils sur le VRAI `evaluateNode`). **0 finding
HAUTE** ; **tous les garde-fous de sécurité confirmés** (non-association à l'introduction, exclusion DFG<20
tracée aux bornes 15/19/20, désintensification jamais d'un protecteur — testé sous pression). **5 corrections
appliquées** puis re-tracées (85 tests + build OK) :
- **A/M1** — note de sécurité **saxagliptine + IC → arrêter** (signal SAVOR) ajoutée à l'option iSGLT2 (le DSL
  ne sous-type pas `gliptine`) ; + `R.66` ajouté à un avantage.
- **B/F1** — le remplacement du sulfamide co-tirait avec la désintensification quand le déclencheur était
  `hypoglycemie_recente` → garde `hypoglycemie_recente == false` ajouté (exclusivité rétablie).
- **B/F2** — idem entre désintensification et intensification glycémique → même garde ajouté.
- **B/F3** — **combo gliptine+GLP-1 DÉJÀ en place** (patient adressé) n'était pas détecté (le *switch*
  s'auto-désactive) → **nouvelle option « arrêter la gliptine redondante »** (`contient gliptine AND (contient
  aGLP1 OR contient tirzepatide)`).
- **B/F5** — aucun fichier temporaire résiduel (vérifié).
- **B/F4** (non corrigé, documenté) : sur-traité NON âgé/fragile sous SU → repli ; cas d'**entrée incohérente**
  (un tel patient serait coté `risque_hypoglycemie_schema = eleve` → désintensification) → **contrat du
  formulaire**. **Règle d'écriture** (red-team) tenue : substitution/désintensification = `niveau_preuve`
  modéré→faible, `effet_attendu` sur hypo/poids/durabilité, jamais « bénéfice dur du retrait ».

**Ajout — sécurité rénale de la metformine (demande référent, 2026-07-23)** : 2 options actives ajoutées,
sourcées sur le **RCP metformine (ANSM, MàJ 14/04/2025)** : « **Arrêter la metformine** » si `DFG < 30`
(contre-indication, priorité 1) et « **Réduire la posologie** » si `DFG 30-59` (paliers RCP : **max 2 g/j** à
45-59, **max 1 g/j** à 30-44 ; priorité 2). **Piloté** dans le nœud C (contrairement au nœud B où la CI DFG<30
reste en prose, car la metformine y est l'option `default` — l'exclure viderait la sortie) : ici la metformine
n'est pas une option mais un `traitements_en_cours`, donc une **alerte active** est possible, à l'instar de
l'exclusion iSGLT2 DFG<20 (CI de *sécurité*, distincte du grain de dose par palier qui reste RCP/accord, non
EBM). **Re-tracé** (bornes DFG 29→arrêt / 30→réduction / 60→rien ; co-affichage cohérent avec l'iSGLT2 rénal ;
non-régression) ; **87 tests + build OK**. → **10 options**.

## 8. Arbitrages référent — TRANCHÉS (2026-07-23) & données reçues

**Arbitrages (validés par le référent Thibault, 2026-07-23)** :
1. **Optimisation à objectif atteint — OUI** : proposer le switch d'un SU/gliptine dès qu'une indication de
   protection non couverte existe, **même HbA1c à la cible**. Cohérent HAS R.64/R.65 (indépendamment de l'HbA1c)
   + SFD Avis 5 (poursuite prioritaire des agents protecteurs).
2. **Désintensification — OUI**, + **ajouter une variable `hypoglycemie_recente` / `chute`** en entrée du nœud
   (HYPOAGE : l'HbA1c seule ne prédit pas l'hypo — sensibilité 20-41 %). Périmètre : arrêt SU/glinide (SFD Avis
   5 : si baisse < 0,5 % ou hypo répétées ; HAS R.102/R.103/R.105), réduction d'insuline ; **ne jamais retirer
   iSGLT2/AR GLP-1** (ADA 13.14d grade A ; SFD Avis 5). Seuil : `HbA1c_actuelle < HbA1c_cible − 0,5` (HAS R.105).
3. **Association iSGLT2 + AR GLP-1 — RECO OPUS = SÉQUENÇAGE** (référent : « je ne sais pas » ; argumentaire dans
   ma réponse). **Pas** d'option « association » proactive présentée comme *stratégie de synergie* : sur critère
   **dur**, la NMA d'ECR est **neutre sur le MACE** (Chuang *CMAJ* 2026 ; seule l'HHF significative), le signal
   fort étant **observationnel biaisé** (Colombijn). Ce qui est solide : **chaque classe garde son bénéfice
   quand l'autre est présente** (SMART-C, 12 ECR, n=73 238 ; Neuen *Circ* 2024, 3 CVOT — tous p-hétérogénéité
   > 0,2) → la bithérapie se justifie **par la coexistence de deux indications distinctes**, pas par une synergie
   prouvée. + **observance défavorable** (PRECIDENTD : délivrance 53 % vs 84 %, arrêt 49 % vs 22 %). → encoder :
   « ajouter l'autre classe **si sa propre indication est présente** / pour le contrôle glycémique-pondéral
   résiduel », **gain dur additif NON affiché** (mention « à l'étude — PRECIDENTD »).

**Données reçues & intégrées (2026-07-23)** : rapport **OpenEvidence** (5 volets, PMID/DOI) ✓ · **HAS 2024**
(lu intégralement, R.45-R.105) ✓ · **SFD 2025** (Avis 3/5/5bis/6 + principe intensification) ✓. **Prescrire** :
**pas d'article dédié** à la déprescription (référent) → position P3 (« gliptines à écarter ») conservée. **RCP/
SmPC ANSM/EMA** : libellé exact de la non-recommandation gliptine+GLP-1 = seul reliquat mineur (ADA/KDIGO/HAS
suffisent). → **Dossier prêt pour distillation YAML** (P2).

## Annexe — Prompts OpenEvidence (débroussaillage référent, 2ᵉ passe)

5 prompts (OE-C1 à OE-C5) transmis au référent le 2026-07-23 ; **rapport OpenEvidence reçu et intégré** le
2026-07-23 (source : `Downloads/Rapport OE Noeud C.txt` — usage interne). Triangulation A × B × OE effectuée
(§5) ; `[À VÉRIFIER]` décisionnels **levés** (§5c). Apports OE clés : non-association verbatim ADA 2026/KDIGO
2022 ; hypo CAROLINA /100 p-a + GRADE ITT + signal CV liraglutide ; switch observationnel (LEGEND-T2DM HR 0,72-
0,76 ; Dave *Circ* 2021 ; NMA ACP Drake 2024 MACE iSGLT2 vs SU RR 0,57) ; désintensification (ADA 13.14a-d ;
Ling 2021 ; HypoPrevent) ; association (SMART-C, Neuen 2024, DURATION-8/SUSTAIN-9/AWARD-10) ; SIMPLE = Abreu 2019.

- **OE-C1** — Substitution sulfamide → iSGLT2/GLP-1 (hypo sévère/100 p-a, Δpoids, Δ HbA1c, durabilité ;
  CAROLINA, GRADE, ADOPT, TOSCA.IT ; existe-t-il un ECR de *switch* avec critère dur ?).
- **OE-C2** — Gliptine → GLP-1 : voie incrétine commune, non-association (ADA/EASD, SFD, RCP) ; tête-à-tête
  PIONEER-3 / SUSTAIN-2 / AWARD-5 ; iSGLT2+gliptine compatibles ?
- **OE-C3** — Désintensification chez l'âgé/fragile sur-traité (arrêt SU / réduction insuline, hypo/chutes,
  sur-risque glycémique ; Choosing Wisely, Sussman, Lipska, Abdelhafiz ; niveau de preuve).
- **OE-C4** — Séquençage & association iSGLT2 + AR GLP-1 : bénéfice additif sur critère **dur** ? (DURATION-8,
  AMPLITUDE-O, Neves, Colombijn, PRECIDENTD ; distinguer substitution vs dur).
- **OE-C5** — Place de l'insuline basale vs GLP-1 en intensification avancée (**essai SIMPLE** — PMID/DOI ;
  frontière C→E).
