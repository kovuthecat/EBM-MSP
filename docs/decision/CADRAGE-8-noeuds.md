# Cadrage large des 8 nœuds DT2 (§1-2 : question · critères · options)

**But** : figer le jeu de variables d'entrée et les patrons de `conditions` sur A→H **avant** que le
schéma (S2) et le moteur (S3) ne se figent. 1re passe (Opus) à partir du brief §10 + connaissances
établies ; **tout chiffre / DOI reste à vérifier** en phase dossier (bi-agents + Prescrire). Statut : `cadrage`.

> Les essais nommés sont réels et servent d'**ancrage** ; les effets chiffrés (NNT, %) seront extraits
> et vérifiés par nœud. Ici on ne fige que **structure** (critères, options, conditions), pas les chiffres.

---

## 0. Dictionnaire consolidé des variables d'entrée (→ `criteres_entree`)

| Variable | Type | Valeurs / unité | Utilisée par (nœuds) |
| --- | --- | --- | --- |
| `age` | nombre | années | A, B, F, (H) |
| `anciennete_diabete_annees` | nombre | années | A, F, H |
| `esperance_vie` | enum | longue · intermediaire · limitee | A, (E) |
| `fragilite` | bool | — | A, (E) |
| `risque_hypoglycemie_schema` | enum | faible · eleve | A, C, D, E |
| `HbA1c_actuelle` | nombre | % | B, C, E |
| `HbA1c_cible` | nombre | % (issue du nœud A) | C, E |
| `DFG` | nombre | mL/min/1,73m² | B, C, D, E |
| `albuminurie` | enum | normo · micro · macro | B, C |
| `ASCVD_etablie` | bool | (mal. CV athéromateuse avérée) | B, C, F |
| `insuffisance_cardiaque` | bool | — | B, C |
| `IRC` | bool | (dérivable de DFG/albuminurie) | B, C |
| `IMC` | nombre | kg/m² | B, C, H |
| `prevention` | enum | primaire · secondaire | F |
| `autres_FDRCV` | nombre | compte de FDR (HTA, tabac, dyslip., hérédité…) | F |
| `SCORE2` (option.) | nombre | % risque à 10 ans | F |
| `preference_injection` | enum | accepte · refuse · indifferent | B, C, E |
| `contrainte_cout` | bool | (accès/coût déterminant) | B, C, D |
| `traitements_en_cours` | liste(enum) | metformine · iSGLT2 · aGLP1 · sulfamide · gliptine · insuline… | B, C, D, E |

> **Constat 1** : 3 types suffisent (`nombre`, `bool`, `enum`) **+ un type `liste(enum)`** pour
> `traitements_en_cours` (à décider : le schéma S2 doit-il gérer un critère multivalué ? cf. §Observations).
> **Constat 2** : redondance `IRC` ⟺ (`DFG`, `albuminurie`) — préférer les primitives `DFG`+`albuminurie`
> et dériver `IRC` (éviter deux sources de vérité).

---

## A. Cible glycémique individualisée  *(déjà gabarité, brief §11)*

- **Question** : quelle cible d'HbA1c individualiser selon le terrain ?
- **Critères** : `age`, `anciennete_diabete_annees`, `esperance_vie`, `fragilite`, `risque_hypoglycemie_schema`.
- **Options / conditions** (cf. §11) :
  - ~6,5 % — `age<60 AND anciennete<10 AND risque_hypo==faible AND esperance==longue AND fragilite==false`
  - ~7 % — `default`
  - 7,5–8 % — `age>=75 OR fragilite==true OR risque_hypo==eleve OR esperance==limitee`
  - 8–8,5 % — `fragilite==true AND esperance==limitee`
- **Ancrage** : ACCORD, ADVANCE, VADT, UKPDS 33/80 (legacy), Boussageon 2011, UKPDS 35 (Stratton).
- **À trancher** : chevauchement des conditions (un patient peut matcher 7,5–8 **et** 8–8,5) → **priorité**
  (le plus prudent l'emporte) — cf. §Observations « ordonnancement ».

---

## B. 1re intention pilotée par les comorbidités

- **Question** : quel(s) traitement(s) initier selon le profil cardio-rénal-métabolique (le bénéfice
  cardio-rénal des iSGLT2/aGLP1 est ~**indépendant de l'HbA1c**, démontré sur fond de metformine) ?
- **Critères** : `ASCVD_etablie`, `insuffisance_cardiaque`, `DFG`, `albuminurie`, `IMC`, `age`,
  `preference_injection`, `contrainte_cout`, `HbA1c_actuelle`.
- **Options / conditions** (esquisse — souvent **plusieurs recommandables simultanément**) :
  - **iSGLT2** — `insuffisance_cardiaque==true OR (DFG<60 OR albuminurie!=normo) OR ASCVD_etablie==true`
    (bénéfice IC + néphroprotection ; ASCVD aussi). CI/prudence si `DFG` très bas (seuil `[À VÉRIFIER]`).
  - **aGLP1** — `ASCVD_etablie==true OR IMC>=30` (bénéfice athéromateux + poids). `preference_injection`
    module (aGLP1 injectable, sauf oral).
  - **Metformine** — socle glycémique quasi systématique sauf `DFG<30` (CI) ou intolérance.
  - **iSGLT2 + aGLP1** — si plusieurs indications fortes (preuve d'association plus faible).
- **Ancrage** : iSGLT2 — EMPA-REG OUTCOME, CANVAS, DECLARE-TIMI 58, CREDENCE, DAPA-CKD, EMPA-KIDNEY,
  DAPA-HF, EMPEROR ; aGLP1 — LEADER, SUSTAIN-6, REWIND, PIONEER-6 ; metformine — UKPDS 34.
- **À trancher** : **priorité iSGLT2 vs aGLP1** quand les deux sont indiqués (IC/rénal → iSGLT2 ;
  athérome/obésité → aGLP1) → logique multi-facteurs, pas une simple échelle (cf. §Observations).

---

## C. Intensification (cible non atteinte)

- **Question** : comment intensifier quand la cible (nœud A) n'est pas atteinte sous traitement en cours ?
- **Critères** : `HbA1c_actuelle`, `HbA1c_cible`, `traitements_en_cours`, `ASCVD_etablie`,
  `insuffisance_cardiaque`, `DFG`, `albuminurie`, `IMC`, `risque_hypoglycemie_schema`, `contrainte_cout`.
- **Options / conditions** :
  - Ajouter **iSGLT2** ou **aGLP1** à bénéfice prouvé (mêmes déclencheurs que B, selon ce qui manque
    dans `traitements_en_cours`).
  - **iSGLT2 + aGLP1** (cohorte, preuve faible).
  - **Éviter** sulfamide / gliptine en intensification préférentielle (→ renvoi nœud D).
- **Ancrage** : idem B + données d'association.
- **À trancher** : dépend de `traitements_en_cours` (ne pas re-proposer une classe déjà en place) →
  **le critère multivalué est central ici**.

---

## D. Sulfamides / gliptines (place résiduelle)

- **Question** : quelle place résiduelle pour sulfamides et gliptines ?
- **Critères** : `contrainte_cout`, `traitements_en_cours`, `DFG`, `risque_hypoglycemie_schema`,
  (contexte aigu — cf. à trancher).
- **Options / conditions** :
  - **Éviter au long cours** — `default` (pas de bénéfice CV démontré ; sulfamide : hypo + poids).
  - **Sulfamide** — usage résiduel si `contrainte_cout==true` et alternatives inaccessibles.
  - **Gliptine** — si intolérance/CI aux classes à bénéfice ; **prudence saxagliptine si IC** (signal SAVOR).
- **Ancrage** : gliptines — SAVOR-TIMI 53 (saxa, ↑hospit. IC `[À VÉRIFIER]`), TECOS (sita, neutre),
  EXAMINE, CARMELINA/CAROLINA (lina). Sulfamides — absence de bénéfice CV, comparateurs anciens.
- **À trancher** : modéliser « contexte aigu » (hospitalisation, corticoïdes) — variable dédiée ou hors périmètre ?

---

## E. Insuline

- **Question** : quand et comment initier l'insulinothérapie ?
- **Critères** : `HbA1c_actuelle` (vs `HbA1c_cible`), `traitements_en_cours` (déjà aGLP1 ?),
  `risque_hypoglycemie_schema`, `fragilite`, `esperance_vie`, symptômes de glucotoxicité (bool à ajouter ?).
- **Options / conditions** :
  - **Basale** (glargine / degludec) — `default` d'initiation.
  - **Degludec** préféré — `risque_hypoglycemie_schema==eleve OR fragilite==true` (moins d'hypo nocturnes).
  - **Xultophy** (degludec+liraglutide) — `traitements_en_cours contient aGLP1`.
- **Ancrage** : DEVOTE (degludec vs glargine, hypo), ORIGIN (glargine).
- **À trancher** : « symptômes / glucotoxicité » comme déclencheur d'initiation (nouvelle variable bool ?).

---

## F. Statine chez le diabétique

- **Question** : prescrire une statine, et à quelle intensité ?
- **Critères** : `age`, `anciennete_diabete_annees`, `autres_FDRCV`, `ASCVD_etablie`, `prevention`,
  `SCORE2` (option.).
- **Options / conditions** :
  - **Statine (prévention secondaire)** — `prevention==secondaire OR ASCVD_etablie==true` (bénéfice net fort).
  - **Statine (prévention primaire)** — `age>=40 AND autres_FDRCV>=1` (bénéfice = événements CV,
    **NNT ~43 `[À VÉRIFIER]`** ; mortalité globale non démontrée chez le diabétique).
  - **Discuter l'abstention** — `age<50 AND anciennete_diabete_annees<10 AND autres_FDRCV==0` (SCORE2 bas).
  - **Pas de cible LDL dogmatique** (position critique vs certaines recos).
- **Ancrage** : CTT (méta-analyses), CARDS (atorvastatine DT2), HPS. `[À VÉRIFIER]` : NNT, sous-groupes.
- **À trancher** : `prevention` (enum primaire/secondaire) recoupe `ASCVD_etablie` — garder les deux ou dériver ?

---

## ~~G. Aspirine~~ — RETIRÉ

Pas de nœud d'algorithme : pas d'aspirine en prévention primaire (ASCEND) ; en prévention secondaire,
l'indication est systématique (pas une décision à outiller). L'info pourra être une **note statique**
du contexte prévention CV, pas un nœud interrogeable. Référent : Thibault, 2026-07-22.

---

## H. RHD / perte de poids / rémission

- **Question** : quelle place pour les mesures hygiéno-diététiques, la perte de poids, la rémission ?
- **Critères** : `IMC`, `anciennete_diabete_annees` (rémission plus probable si récent), motivation (bool ?),
  capacité à l'activité physique (bool ?).
- **Options / conditions** (traitement **de fond pour tous**, en plus) :
  - **Intervention intensive de perte de poids** — `IMC>=27 AND anciennete_diabete_annees<6`
    (potentiel de **rémission ~50 % `[À VÉRIFIER]`**, DiRECT).
  - **Régime méditerranéen** — bénéfice CV (PREDIMED) — recommandé largement.
  - **Activité physique adaptée** — pour tous, selon capacité.
- **Ancrage** : DiRECT (rémission), Look AHEAD (lifestyle intensif), PREDIMED (méditerranéen, CV), DPP.
- **À trancher** : « rémission » comme sortie/objectif spécifique ; seuils IMC et ancienneté `[À VÉRIFIER]`.

---

## Observations pour le schéma (S2) & le moteur (S3)  ← livrable de dé-risquage

1. **Types de critères** : `nombre` · `bool` · `enum` couvrent tout, **sauf** `traitements_en_cours`
   qui est **multivalué** (liste d'enums) et central pour C/D/E. → **Décision à prendre en S2** : ajouter
   un type `liste` + un opérateur `contient` dans le DSL de conditions (S3), ou modéliser chaque
   traitement comme un `bool` (`a_metformine`, `a_isglt2`…). *Reco : `liste` + `contient` (plus lisible).*
2. **Ordonnancement / priorité** : A, D, G suivent une **échelle** (default + garde-fous) → l'ordre des
   options suffit. Mais **B et C sont multi-facteurs** : plusieurs options peuvent être *recommandables
   simultanément* (ex. iSGLT2 **et** aGLP1), avec une **préférence contextuelle** (IC/rénal→iSGLT2,
   athérome/obésité→aGLP1). → **Décision** : prévoir sur `option` un champ optionnel `priorite`/`rang`
   (ou permettre plusieurs « recommandée ») plutôt qu'une simple 1re-applicable. *À répercuter en S3.*
3. **`conditions` vs `contre_indications`** : les CI (ex. metformine si `DFG<30`, prudence iSGLT2/DFG,
   saxagliptine si IC) sont des **exclusions dures**, distinctes des conditions d'applicabilité. →
   **Décision S3** : le moteur doit aussi évaluer `contre_indications` (retirer/avertir), pas seulement
   `conditions`. Le schéma a déjà le champ ; préciser sa sémantique.
4. **Variables dérivées** : `IRC` (de `DFG`+`albuminurie`), `prevention` (recoupe `ASCVD_etablie`),
   `HbA1c_cible` (sortie du nœud A → entrée de C/E). → Garder des **primitives** et documenter les
   dérivations ; éviter deux sources de vérité. Le **chaînage inter-nœuds** (cible A → intensification C)
   est un patron à noter (hors MVP, mais le schéma ne doit pas l'interdire).
5. **Variables candidates à ajouter** (validées par le référent, à intégrer en P2) :
   `symptomes_glucotoxicite` (E), `contexte_aigu` (D), `motivation`/`capacite_activite` (H).
6. **DSL de conditions (S3)** confirmé nécessaire : comparaisons numériques (`< <= > >=`), égalité sur
   enums/bools (`== !=`), `AND`/`OR`, `default`, **+ `contient` pour le multivalué** (cf. point 1).

---

## Prochaines étapes

- Tu valides/ajustes ce cadrage (surtout §0 dictionnaire, §Observations, variables à ajouter).
- On répercute les décisions 1-3 dans `DECISIONS.md` + les sessions S2/S3 (avant qu'elles tournent).
- Puis **dossiers de preuve par nœud** (`_TEMPLATE.md`) avec collecte + grille + **bi-agents** + Prescrire,
  dans l'ordre **A → B → C → F → H → E → D** (G retiré ; **A repasse par la phase exploratoire** — en cours).
- **Décisions actées** (validées par le référent) : type `liste` + `contient` (multivalué), `priorite`
  optionnelle sur les options, `contre_indications` = exclusions dures évaluées par le moteur → `DECISIONS.md` D10.
