# Banc de vignettes — nœud fusionné `prescription` (oracle de test)

> **Rôle** : cas de test exécutables pour (1) le red‑team bi‑agents **P3·S4**, (2) les tests de non‑régression
> **P3·S5**, (3) les vignettes re‑pointées de **P2·S4**. Chaque vignette cible **une règle**. « Attendu » =
> comportement du nœud fusionné **après** correctifs gelés ; « Aujourd'hui » = comportement des nœuds B/C
> actuels (le défaut à corriger), pour référence.
>
> **Règles gelées (réf. [`../../../plans/P3-fusion/S1.md`](../../../plans/P3-fusion/S1.md) §4) :**
> GLP‑1 **exclu** si `IMC < 22` **ou** `denutrition == true` ; **alerte** si `fragilite`. Tirzépatide **réservé
> à l'obésité** (`IMC ≥ 30`), même exclusion `denutrition`. iSGLT2 rétrogradé + alerte si `infections_uro…`.
> Préférence : IC/rénal → iSGLT2 devant ; athérome pur → GLP‑1 devant. Portes SU/gliptine/intolérance →
> **switch** si HbA1c à/au‑dessus de la cible, **déprescription** si en dessous. Garde‑fous durs : jamais
> gliptine+GLP‑1 ; jamais retrait iSGLT2/GLP‑1 en désintensification ; metformine CI < 30 ; SU exclu < 30 ;
> iSGLT2 exclu < 20.
>
> Critères non cités = valeurs neutres (DFG 80, normo, pas de comorbidité, `denutrition`/`fragilite`/`intol`
> = false, `classes_a_benefice_indisponibles` = false).

## Synthèse

| # | Profil | Règle testée | Attendu clé | Aujourd'hui |
|---|--------|--------------|-------------|-------------|
| F1 | 82a fragile, **IMC 21**, ASCVD | Plancher IMC GLP‑1 | GLP‑1 **exclu**, tirzépatide absent | GLP‑1 recommandé ❌ |
| F2 | 78a **obèse (34) + dénutri**, ASCVD | Dénutrition ≠ IMC | GLP‑1 **et** tirzépatide **exclus** | Les deux recommandés ❌ |
| F3 | 74a **fragile eutrophe (27)**, ASCVD | Fragilité = alerte | GLP‑1 proposé **+ alerte**, rang 1 | GLP‑1 proposé, iSGLT2 rang 1, pas d'alerte ❌ |
| P1 | 60a **ASCVD pur** (26) | Préférence athérome | **GLP‑1 rang 1**, iSGLT2 rang 2 | iSGLT2 rang 1 ❌ |
| P2 | 62a **IC + rénal** (28) | Préférence IC/rénal | **iSGLT2 rang 1**, GLP‑1 absent | ✅ (garde de non‑régression) |
| T1 | 68a ASCVD, **IMC 24** | Tirzépatide ⊂ obésité | Tirzépatide **absent** | Tirzépatide proposé ❌ |
| T2 | 55a **obèse (33)** sans CV/rénal | Obésité → incrétines | GLP‑1 r1, tirzépatide r2, iSGLT2 absent | ✅ (garde) |
| D1 | 72a metf+**SU**, **HbA1c 6,2** | Porte + sous‑cible | **Déprescription** SU, pas de switch | Désintensif. via dérivé, flag < 6,5 % non montré ⚠ |
| D2 | 64a metf+**SU**, HbA1c 7,8, ASCVD | Porte + au‑dessus | **Switch** SU→GLP‑1 (r1) | Switch OK mais iSGLT2 devant ❌ |
| D3 | 58a metf+SU, **à la cible**, sans comorb. | Pas d'indication | Pas d'incrétine poussée | iSGLT2/GLP‑1 non déclenchés ✅ |
| D4 | 60a metf+**gliptine**, obèse, au‑dessus | Switch gliptine | **Remplacer** gliptine→GLP‑1, jamais associer | ✅ |
| D5 | metf+**gliptine+GLP‑1** | Combo interdit | **Arrêter la gliptine** redondante | ✅ |
| I1 | metf+GLP‑1, **intolérance** | Porte intolérance | **Proposer des choix** de switch | Pas de porte intolérance ❌ |
| I2 | metf+iSGLT2, **infections uro** | Gate uro | iSGLT2 **rétrogradé + alerte** | CI en prose, non évaluée ❌ |
| S1 | metf+SU, **DFG 25** | CI rénale metformine | Arrêter metf ; SU exclu ; iSGLT2 initiable | ✅ (metf) |
| S2 | metf+SU, **DFG 18**, sans comorb. | Bord rénal / sortie vide | Metf+SU+iSGLT2 exclus → **renvoi nœud E** | ✅ |
| S3 | **HbA1c 11 + glucotox. + cétone** | Gate catabolique | **Insuline d'initiation** ; iSGLT2 exclu | ✅ |

---

## A · Terrain fragile / nutrition (remarques 2/3/10/11)

### F1 — Vieillard fragile maigre, ASCVD  *(flagship)*
`age=82, fragilite=true, IMC=21, denutrition=false, ASCVD_etablie=true, IC=false, DFG=70, traitements=[metformine,sulfamide], HbA1c_actuelle=7.8, cible≈8 (a_la_cible)`
- **Attendu** : option GLP‑1 **exclue** avec trace `exclusions: IMC < 22` ; tirzépatide **non proposé**
  (IMC < 30) ; **alerte fragilité** ; iSGLT2 non prioritaire (pas d'IC/rénal ; ASCVD seul = bénéfice faible).
  L'outil **ne recommande aucune incrétine**. Metformine socle. Surveiller le sulfamide (hypo).
- **Aujourd'hui** : GLP‑1 recommandé (déclencheur `ASCVD`), aucun frein IMC/dénutrition. ❌

### F2 — Obèse dénutri/sarcopénique, ASCVD  *(flagship — nuance « dénutri ≠ maigre »)*
`age=78, IMC=34, denutrition=true, fragilite=true, ASCVD_etablie=true, traitements=[metformine], HbA1c_actuelle=8.0`
- **Attendu** : GLP‑1 **exclu** (`denutrition == true`, **malgré IMC 34**) ; tirzépatide **exclu**
  (`denutrition`, bien qu'obèse) ; alerte fragilité. → **l'exclusion `denutrition` mord même chez l'obèse**.
- **Aujourd'hui** : GLP‑1 **et** tirzépatide recommandés (IMC ≥ 30). ❌ *Le cas que la remarque 3 vise.*

### F3 — Âgé fragile mais eutrophe, ASCVD  *(fragilité = alerte, pas exclusion)*
`age=74, fragilite=true, IMC=27, denutrition=false, ASCVD_etablie=true, traitements=[metformine], HbA1c_actuelle=8.0`
- **Attendu** : GLP‑1 **proposé** (IMC ≥ 22, pas de dénutrition), **rang 1** (athérome), **+ alerte fragilité** ;
  iSGLT2 rang 2 ; tirzépatide absent (IMC < 30).
- **Aujourd'hui** : GLP‑1 proposé mais **iSGLT2 en premier** (bug 9), **pas d'alerte** fragilité. ❌

## B · Moteur de préférence (remarque 9)

### P1 — ASCVD pur
`age=60, ASCVD_etablie=true, IC=false, DFG=80, albuminurie=normo, IMC=26, traitements=[metformine], HbA1c_actuelle=8.2 (au_dessus)`
- **Attendu** : **GLP‑1 rang 1**, iSGLT2 rang 2 (ASCVD, bénéfice faible), tirzépatide absent (IMC < 30).
- **Aujourd'hui** : iSGLT2 **rang 1** (priorité fixe, ordre du fichier). ❌

### P2 — IC + maladie rénale, non obèse  *(garde de non‑régression)*
`age=62, IC=true, DFG=50, albuminurie=micro, ASCVD_etablie=false, IMC=28, traitements=[metformine], HbA1c_actuelle=7.8`
- **Attendu** : **iSGLT2 rang 1** ; **GLP‑1 absent** (pas d'ASCVD, IMC < 30 → aucune indication) ;
  tirzépatide absent. → confirme que l'outil **n'ajoute pas d'incrétine sans indication** (remarque 2). ✅

## C · Tirzépatide réservé à l'obésité (remarque 10 · décision 1)

### T1 — ASCVD maigre
`age=68, ASCVD_etablie=true, IMC=24, denutrition=false, traitements=[metformine], HbA1c_actuelle=8.0`
- **Attendu** : tirzépatide **absent** (IMC < 30) ; GLP‑1 proposé (IMC ≥ 22) rang 1.
- **Aujourd'hui** : tirzépatide proposé (déclencheur `ASCVD`). ❌

### T2 — Obèse sans comorbidité CV/rénale  *(garde)*
`age=55, IMC=33, denutrition=false, ASCVD=false, IC=false, DFG=90, normo, traitements=[metformine], HbA1c_actuelle=8.0`
- **Attendu** : GLP‑1 rang 1 (obésité), tirzépatide rang 2 (obésité), **iSGLT2 absent** (pas d'IC/rénal/ASCVD). ✅

## D · Portes SU/gliptine × position d'HbA1c (décision référent · remarque 5)

### D1 — SU + sous la cible → déprescription
`age=72, traitements=[metformine,sulfamide], HbA1c_actuelle=6.2, cible≈7.5 (en_dessous), hba1c_sous_cible=true, risque_hypoglycemie_schema=eleve`
- **Attendu** : **déprescription du sulfamide** (porte SU + `en_dessous`) ; **jamais** de switch vers un agent
  plus puissant ; flag « HbA1c < 6,5 % » **affiché** ; jamais retrait iSGLT2/GLP‑1.
- **Aujourd'hui** : la désintensification se déclenche via `sur_traitement` dérivé (souvent OK) mais le flag
  < 6,5 % n'est pas surfacé et le déclenchement dépend d'un calcul invisible. ⚠

### D2 — SU + au‑dessus + comorbidité → switch
`age=64, traitements=[metformine,sulfamide], HbA1c_actuelle=7.8, cible≈7 (au_dessus), ASCVD_etablie=true, IMC=29, denutrition=false, fragilite=false`
- **Attendu** : **switch — remplacer le sulfamide par un GLP‑1** (ASCVD/athérome, **rang 1**) ; désintensification
  **non** déclenchée (pas de sur‑traitement/hypo) ; tirzépatide absent (IMC < 30).
- **Aujourd'hui** : switch proposé mais **iSGLT2 présenté avant** le GLP‑1 (bug 9). ❌

### D3 — SU + à la cible, sans comorbidité
`age=58, traitements=[metformine,sulfamide], HbA1c_actuelle=6.9, cible≈7 (a_la_cible), IMC=26, aucune comorbidité`
- **Attendu** : **aucune incrétine poussée** (pas d'indication) ; option de simplification/switch SU→gliptine
  (place résiduelle, anti‑hypoglycémie) **disponible mais non impérative** ; poursuite possible.
- **Aujourd'hui** : iSGLT2/GLP‑1 correctement non déclenchés ✅ ; mais pas de cadrage « porte au repos ».

### D4 — Gliptine + au‑dessus + obésité → switch (jamais associer)
`age=60, traitements=[metformine,gliptine], HbA1c_actuelle=7.5 (au_dessus), IMC=31, denutrition=false`
- **Attendu** : **remplacer la gliptine par un GLP‑1** (switch) ; tirzépatide proposé (obésité) ; **jamais
  association** gliptine+incrétine ; iSGLT2 absent (pas d'IC/rénal/ASCVD). ✅

### D5 — Combo gliptine + GLP‑1 déjà en place
`traitements=[metformine,gliptine,aGLP1]`
- **Attendu** : **arrêter la gliptine redondante** (association interdite déjà en place). ✅

## E · Intolérance (décision 3)

### I1 — Intolérance digestive sous metformine + GLP‑1
`traitements=[metformine,aGLP1], intolerance_traitement=true, HbA1c position=a_la_cible, ASCVD_etablie=true, IMC=28, denutrition=false`
- **Attendu** : **alerte** « metformine ET AR GLP‑1 sont deux sources d'intolérance digestive → privilégier la
  réduction/l'arrêt de la **metformine** (bénéfice moindre) ; intolérance metformine = critère reconnu pour la
  monothérapie AR GLP‑1 (recos + remboursement FR) ». Le GLP‑1 (bénéfice d'organe, ASCVD) est **conservé**.
  Voies proposées : **réduire/arrêter la metformine**, sans jamais imposer l'arrêt du GLP‑1.
- **Aujourd'hui** : aucun critère d'intolérance, aucune porte. ❌

### I3 — Intolérance non majeure à l'agent en cause → réduction de dose
`traitements=[metformine,sulfamide], intolerance_traitement=true, HbA1c position=a_la_cible, aucune comorbidité, IMC=26`
- **Attendu** : la porte propose, **en alternative au switch**, de **réduire la posologie de la molécule en
  cause** (intolérance non majeure — sévérité et dose = **jugement du praticien**, aucun dosage saisi) ; le
  switch reste offert en parallèle. Si l'agent en cause est le sulfamide (faible valeur), l'allègement/arrêt
  est privilégié.
- **Aujourd'hui** : aucune porte intolérance. ❌

### I2 — iSGLT2 + infections génito‑urinaires récidivantes
`traitements=[metformine,iSGLT2], infections_uro_genitales_recidivantes=true, DFG=55, HbA1c position=a_la_cible`
- **Attendu** : **alerte** iSGLT2 (infections uro) + **rétrogradation** ; envisager une alternative /
  la déprescription de l'iSGLT2 selon l'indication.
- **Aujourd'hui** : contre‑indication présente **en prose** seulement, non évaluée par le moteur. ❌

## F · Garde‑fous de sécurité (non‑régression)

### S1 — DFG 25 (CI rénale metformine)
`traitements=[metformine,sulfamide], DFG=25, HbA1c_actuelle=8.0`
- **Attendu** : **arrêter la metformine** (CI < 30, trace) ; **sulfamide exclu** (< 30) ; iSGLT2 reste
  initiable (≥ 20) si indication rénale ; alerte metformine. ✅ (metformine)

### S2 — DFG 18, sans comorbidité CV/obésité
`traitements=[metformine,sulfamide], DFG=18, ASCVD=false, IC=false, IMC=26`
- **Attendu** : metformine exclue (< 30), sulfamide exclu (< 30), **iSGLT2 exclu (< 20)** → sortie in‑scope
  quasi vide → **renvoi explicite au nœud E (insuline) / autre classe**. Tester qu'il n'y a pas d'écran vide muet.

### S3 — Décompensation catabolique
`HbA1c_actuelle=11, symptomes_glucotoxicite=true, cetonemie=true, traitements=[metformine]`
- **Attendu** : **gate insuline d'initiation** ; iSGLT2 **exclu** (cétonémie/glucotoxicité) ; alerte cétonémie
  (≥ 3 mmol/L = urgence, hors périmètre). ✅

---

## Notes d'exécution (S4/S5)

- Feeder ces `criteres` via `calculerCriteresDerives(node.criteres_entree, criteria)` puis
  `evaluateNode(node, ...)` (compléter les critères non cités aux valeurs neutres). `position_vs_cible` est
  SAISI (champ à 4 crans) ; les dérivés `cible_atteinte`, `hba1c_sous_cible` (= `position_vs_cible ==
  tres_en_dessous`, < 6,5 %) et `terrain_fragile` sont recalculés. `sur_traitement` a été RETIRÉ (gel D1).
- Un « Attendu » se vérifie sur : présence/absence d'une option (par `intitule`), son **rang** (`applicable`
  est trié), les `excluded` (traces d'exclusion), les `alertes`.
- Ajouter au fil de S4 tout profil hostile trouvé par le red‑team (banc vivant, versionné).
