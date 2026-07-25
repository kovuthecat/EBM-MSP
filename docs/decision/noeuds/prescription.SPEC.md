# Nœud `prescription` — SPEC du nœud fusionné (B+C+D)

> **Statut : GELÉ le 2026‑07‑24 par le référent** (gate humaine P3·S1 franchie ; décisions §7). Ce document
> tranche la *structure* et les *seuils* ; il ne contient ni preuve (→ S2 `prescription.md`) ni YAML (→ S3).
>
> **Fusionne** : B [`premiere-intention.yaml`](../../../content/noeuds/diabete-type-2/premiere-intention.yaml) ·
> C [`intensification.yaml`](../../../content/noeuds/diabete-type-2/intensification.yaml) ·
> D [`sulfamides-gliptines.yaml`](../../../content/noeuds/diabete-type-2/sulfamides-gliptines.yaml).
> **Décisions référent gelées (2026‑07‑24)** : cf. [`../../../plans/P3-fusion/S1.md`](../../../plans/P3-fusion/S1.md) §4.
> **Invariant** : tout s'encode en contenu (D13 `exclusions`/`liste` · D14 `priorite` conditionnelle ·
> D15 `alertes` · critères `derive`). **Aucune modif du moteur.**

## 1. Périmètre & frontières

- **Ce nœud** : toute la **prescription non‑insulinique** du DT2 — 1re intention, intensification,
  optimisation/switch, désintensification, place résiduelle SU/gliptine. Piloté par `traitements_en_cours`
  (liste vide = naïf) + `position_vs_cible`.
- **Hors nœud** : **A** = cible d'HbA1c (fournit la cible pour les dérivés) · **E** = ajustement fin de
  l'insuline (ce nœud *recommande* l'insuline d'initiation / oriente ; E *ajuste* les doses) · **F** =
  statine · **H** = MHD / perte de poids / rémission. Décompensation aiguë (cétose/hyperosmolarité ≥ 3 mmol/L)
  = urgence, hors périmètre.
- `selection: multi-options` (plusieurs gestes se combinent, tri par `priorite`).

## 2. Critères d'entrée (union B∪C∪D + nouveaux)

| Critère | Type | Origine | Notes |
|---|---|---|---|
| `traitements_en_cours` | liste | B/C/D | **primer 1**. Valeurs : `[metformine,iSGLT2,aGLP1,tirzepatide,sulfamide,gliptine,insuline,glinide]` |
| `position_vs_cible` | enum `[a_la_cible,au_dessus,en_dessous,tres_en_dessous]` | **nouveau** | **primer 2** (remarque 5) — champ UNIQUE à **4 crans** (décision référent 2026-07-24). `tres_en_dessous` = < 6,5 %. |
| `hba1c_sous_cible` | bool | **nouveau** | `derive` (< 6,5 %) — **« sous cible extrême »**, unique trigger de déprescription (gel D1) |
| `cible_atteinte` | bool | C | `derive` (`position_vs_cible != au_dessus`) — pour l'intensification |
| `terrain_fragile` | bool | E | `derive` = `age >= 75 OR fragilite OR esperance_vie == limitee OR risque_hypoglycemie_schema == eleve` |
| ~~`sur_traitement`~~ | — | — | **RETIRÉ (gel D1)** : critère relatif subjectif/difficilement interprétable |
| `hypoglycemie_recente` | bool | C | hypo et/ou chute récente (HYPOAGE) |
| `HbA1c_actuelle` | nombre | B | alimente les dérivés + le gate insuline |
| `ASCVD_etablie`, `insuffisance_cardiaque` | bool | B/C | |
| `DFG` | nombre | B/C/D | |
| `albuminurie` | enum `[normo,micro,macro]` | B/C | |
| `IMC` | nombre | B/C | plancher GLP‑1 (< 22) ; obésité tirzépatide (≥ 30) |
| `age`, `fragilite` | nombre / bool | C | |
| `denutrition` | bool | **nouveau** | garde‑fou dur incrétines — **propre, pas dérivé de l'IMC** (obèse+dénutri possible) |
| `esperance_vie` | enum `[longue,intermediaire,limitee]` | C | |
| `risque_hypoglycemie_schema` | enum `[faible,eleve]` | C/D | |
| `infections_uro_genitales_recidivantes` | bool | **nouveau** | gate iSGLT2 |
| `intolerance_traitement` | bool | **nouveau** | porte → réduction / switch |
| `symptomes_glucotoxicite`, `cetonemie` | bool | B | gate insuline d'initiation |
| `preference_injection` | enum `[accepte,refuse,indifferent]` | B | |
| `classes_a_benefice_indisponibles` | bool | D | ouvre la place résiduelle SU/gliptine |

**Primer & ordre de saisie** (remarque 4) : `traitements_en_cours` → `position_vs_cible` → drapeaux (bool) →
groupes. **Champs requis** pour une reco *définitive* (le reste = provisoire, Track UI) : à lister au gel —
a minima `traitements_en_cours`, `position_vs_cible`, et les critères que la relevance signale décisifs.

## 3. Catalogue d'options consolidé

Échelle de `priorite` (croissant = affiché en premier) : **0** socle · **1** sécurité/urgence · **2**
protecteur de 1re ligne selon comorbidité dominante · **3** protecteur de 2e choix + switch gliptine · **4**
tirzépatide + remplacer SU + association · **5** intensif. résiduelle + place résiduelle SU/gliptine · **6**
rétrogradation (iSGLT2 si infections uro) · **défaut** poursuivre.

| # | Option | Conditions (DSL) | Exclusions | `priorite` | Origine |
|---|--------|------------------|-----------|-----------|---------|
| O1 | **Insuline d'initiation** (transitoire) | `(HbA1c_actuelle >= 10 AND symptomes_glucotoxicite == true) OR cetonemie == true` | — | 1 | B |
| O2 | **Metformine (socle) — poursuivre** | `toujours` | `DFG < 30` | 0 | B (D16, badge « Reco officielle ») |
| O3 | **Arrêter la metformine** (DFG < 30) | `traitements_en_cours contient metformine AND DFG < 30` | — | 1 | C |
| O4 | **Réduire la metformine** (DFG 30‑59) | `contient metformine AND DFG >= 30 AND DFG < 60` | — | 3 | C |
| O5 | **Introduire un iSGLT2** | `(insuffisance_cardiaque == true OR DFG < 60 OR albuminurie != normo OR ASCVD_etablie == true) AND ne_contient_pas iSGLT2` | `symptomes_glucotoxicite == true` · `cetonemie == true` · `DFG < 20` | `[{infections_uro… == true → 6},{IC OR DFG<60 OR alb≠normo → 2},{défaut → 3}]` | B/C |
| O6 | **Introduire un AR GLP‑1** | `(ASCVD_etablie == true OR IMC >= 30) AND ne_contient_pas aGLP1 AND ne_contient_pas tirzepatide AND ne_contient_pas gliptine` | **`IMC < 22`** · **`denutrition == true`** | `[{IC OR DFG<60 OR alb≠normo → 3},{défaut → 2}]` | B/C |
| O7 | **Introduire le tirzépatide** (obésité ; prescription spécialisée) | **`IMC >= 30`** `AND ne_contient_pas tirzepatide AND ne_contient_pas aGLP1 AND ne_contient_pas gliptine` | **`denutrition == true`** | 4 | B (⚠ déclencheur ASCVD **retiré**, gel D3 ; noter « réservé à la prescription par spécialiste ») |
| O8 | **Association iSGLT2 + AR GLP‑1** | `(IC OR DFG<60 OR alb≠normo) AND (ASCVD_etablie == true OR IMC >= 30)` | glucotox · cetone · `DFG<20` · (`IMC<22` OR `denutrition` pour le volet GLP‑1) | 4 | B |
| O9 | **Remplacer la gliptine par un AR GLP‑1** (switch, jamais associer) | `contient gliptine AND (ASCVD_etablie == true OR IMC >= 30 OR cible_atteinte == false) AND ne_contient_pas aGLP1 AND ne_contient_pas tirzepatide` | `IMC < 22` · `denutrition == true` | 3 | C |
| O10 | **Arrêter la gliptine redondante** (combo déjà en place) | `contient gliptine AND (contient aGLP1 OR contient tirzepatide)` | — | 3 | C |
| O11 | **Remplacer le sulfamide** | `contient sulfamide AND hypoglycemie_recente == false AND hba1c_sous_cible == false AND (IC OR DFG<60 OR alb≠normo OR ASCVD OR IMC>=30 OR risque_hypoglycemie_schema == eleve OR cible_atteinte == false)` | — | 4 | C (gel D1 : `sur_traitement` retiré) |
| O12 | **Réduire la posologie de l'agent mal toléré** (intolérance non majeure) | `intolerance_traitement == true` | — | 2 | **nouveau** |
| O13 | **Désintensifier** (alléger/arrêter SU, glinide, réduire insuline) | `(hba1c_sous_cible == true OR hypoglycemie_recente == true AND terrain_fragile == true) AND (contient sulfamide OR contient glinide OR contient insuline)` | — | 1 | C (gel D1/D2 : < 6,5 % déprescrit **à tout âge** ; hypo récente → gate terrain ; **jamais** un agent protecteur = « classe à bénéfice associé ») |
| O14 | **Place résiduelle — gliptine (sitagliptine)** | `classes_a_benefice_indisponibles == true AND ne_contient_pas gliptine` | — | 5 | D |
| O15 | **Place résiduelle — sulfamide (gliclazide/glimépiride)** | `classes_a_benefice_indisponibles == true AND ne_contient_pas sulfamide` | `DFG < 30` | 5 | D |
| O16 | **Intensifier le contrôle glycémique** (pas de protection dominante) | `cible_atteinte == false AND hypoglycemie_recente == false AND IC == false AND ASCVD == false AND DFG >= 60 AND albuminurie == normo AND IMC < 30` | — | 5 | C |
| O17 | **Poursuivre et réévaluer** | `default` | — | défaut | C |

> **Fix bug 9** matérialisé dans O5/O6 : en **athérome pur** (ni IC ni rénal), O6 (GLP‑1) → rang 2 et O5
> (iSGLT2) → rang 3 ⇒ **GLP‑1 devant**. En **IC/rénal**, O5 → 2 et O6 → 3 ⇒ iSGLT2 devant.
> **Non‑association gliptine+GLP‑1 par construction** : O6/O7 exigent `ne_contient_pas gliptine` ⇒ sous
> gliptine, seul O9 (switch) ou O10 (combo) se déclenche.

## 4. Table de décision « portes » (lentille clinicien sur le catalogue)

| Porte (déclencheur) | HbA1c **en_dessous** / `hba1c_sous_cible` | HbA1c **a_la_cible** / **au_dessus** |
|---|---|---|
| **SU en cours** | **Déprescription** O13 (jamais retirer iSGLT2/GLP‑1) | **Switch** O11 → agent choisi par comorbidité + gating (O5/O6/O7) |
| **Gliptine en cours** | O13 si sécurité ; sinon simplifier | **Switch** O9 (jamais associer) ; combo → O10 |
| **Intolérance** | O12 (réduire) ou allègement | **O12 (réduire, non majeure) OU switch** (O9/O11 selon l'agent). Digestif + metformine + incrétine → **viser la metformine** (alerte A5) |
| **Protection non couverte** (comorbidité + classe protectrice absente) | O5/O6/O7 **indépendamment** de l'HbA1c | idem |
| **Cible non atteinte, sans comorbidité** | — | O16 (agent sans hypo) |
| **Classes protectrices indisponibles** | O14/O15 (place résiduelle, sitagliptine ⟩ SU) | idem |

## 5. Gating de terrain (gelé, §4 de S1)

- **GLP‑1 (O6/O9)** : **exclu** si `IMC < 22 OR denutrition == true` (dénutrition mord même chez l'obèse) ;
  **alerte** si `fragilite == true`.
- **Tirzépatide (O7)** : condition = `IMC >= 30` **uniquement** ; **exclu** si `denutrition == true`.
- **iSGLT2 (O5)** : rétrogradé (rang 6) + **alerte** si `infections_uro_genitales_recidivantes == true` ;
  `DFG < 20` = exclusion dure.

## 6. Alertes (D15)

| # | `quand` | Message (résumé) |
|---|---|---|
| A1 | `HbA1c_actuelle >= 10 OR symptomes_glucotoxicite == true` | Contrôler la cétonémie ; ≥ 0,6 → insuline ; ≥ 3 → urgence |
| A2 | `DFG < 60 AND DFG >= 45` / `DFG < 45 AND DFG >= 30` / `DFG < 30` | Dose max metformine par palier ; arrêt < 30 (RCP ANSM) |
| A3 | `fragilite == true AND (contient aGLP1 OR contient tirzepatide OR …option incrétine indiquée)` | Prudence incrétine chez le fragile (sarcopénie/anorexie) |
| A4 | `infections_uro_genitales_recidivantes == true AND (contient iSGLT2 OR …iSGLT2 indiqué)` | Ne pas initier/poursuivre l'iSGLT2 ; gangrène de Fournier |
| **A5** | `intolerance_traitement == true AND contient metformine AND (contient aGLP1 OR contient tirzepatide)` | Intolérance digestive : metformine ET incrétine en sont sources → **viser la metformine d'abord** (bénéfice moindre ; intolérance metformine = critère reconnu, remboursement FR monothérapie AR GLP‑1) |
| A6 | `classes_a_benefice_indisponibles == true AND risque_hypoglycemie_schema == eleve` | Préférer la gliptine au sulfamide (hypo) |
| A7 | `classes_a_benefice_indisponibles == true AND DFG < 45` | Dosing rénal sitagliptine ; SU CI < 30 ; jamais glibenclamide |
| A8 | `contient sulfamide OR contient glinide` (à l'ajout d'insuline) | Arrêter SU/glinide (hypo cumulée) |
| **A9** | `contient sulfamide AND hba1c_sous_cible == false AND hypoglycemie_recente == false AND (IC OR DFG<60 OR alb≠normo OR ASCVD OR IMC>=30 OR risque_hypoglycemie_schema == eleve OR cible_atteinte == false)` **ET** aucun remplaçant applicable (GLP‑1 exclu IMC<22/dénutrition **et** iSGLT2 non indiqué/exclu) | Repli O11 : pas de remplaçant protecteur pertinent sur ce terrain → **surveiller ou déprescrire le sulfamide** plutôt qu'un switch à vide (gel D5) |

## 7. Décisions référent — GELÉES (2026‑07‑24)

1. **`sur_traitement` RETIRÉ** (critère relatif subjectif/difficilement interprétable). On garde **uniquement
   `hba1c_sous_cible` (< 6,5 % = « sous cible extrême »)** comme trigger de déprescription, `cible_atteinte`
   (dérivé) pour l'intensification, et `position_vs_cible` comme primer.
2. **Déprescription O13 sur `hba1c_sous_cible` à TOUT ÂGE** (< 6,5 % sous hypoglycémiant = sur‑traitement pour
   tous). L'hypoglycémie récente reste gated par `terrain_fragile`. **Exception** : ne jamais déprescrire une
   **classe à bénéfice associé spécifique au patient** (iSGLT2/AR GLP‑1) — garanti par la liste‑cible d'O13
   (SU/glinide/insuline seulement).
3. **Tirzépatide = `IMC >= 30`** (obésité), déclencheur ASCVD retiré ; « réservé à la prescription par
   spécialiste » (note d'option).
4. **Socle metformine (O2) reste affiché**, mais A5/O12 **autorisent explicitement** sa réduction/son arrêt en
   cas d'intolérance (ligne dans les `inconvenients`/`contre_indications` d'O2 : « sauf intolérance → réduire/
   arrêter, cf. O12/A5 »).
5. **Repli O11** : alerte **A9** quand « remplacer le sulfamide » se déclenche mais qu'aucun remplaçant
   protecteur n'est applicable (GLP‑1 exclu IMC<22/dénutrition, iSGLT2 non indiqué) → « surveiller ou
   déprescrire le sulfamide, pas de remplaçant protecteur pertinent sur ce terrain ».
6. **Association O8 conservée en 2ᵉ rang** (rang 4, bénéfice additif dur non démontré) + garde‑fous
   IMC<22/dénutrition sur son volet GLP‑1.

## 8. Checklist « nuances à préserver » (pour S4)

- [ ] Non‑association gliptine+GLP‑1 (O6/O7 exigent `ne_contient_pas gliptine` ; O9 switch ; O10 combo).
- [ ] Désintensification ne cible jamais iSGLT2/GLP‑1 (ADA 13.14d) ; mutuellement exclusive des switch/ajout.
- [ ] Sécurité rénale metformine (O3 arrêt < 30 ; O4 réduction 30‑59) + alertes A2.
- [ ] Sitagliptine = seule gliptine FR ; **glibenclamide proscrit** ; SU exclu < 30 (O15) ; dosing (A7).
- [ ] Gate insuline d'initiation catabolique (O1) + exclusions glucotox/cétone sur O5/O8.
- [ ] Metformine socle `toujours` (O2), badge « Recommandation officielle » distinct du badge EBM.
- [ ] Place résiduelle SU/gliptine conditionnée à `classes_a_benefice_indisponibles` (O14/O15).
- [ ] Fix bug 9 (O5/O6 priorité conditionnelle) ; tirzépatide sans déclencheur ASCVD (O7).
- [ ] Gating terrain (§5) : GLP‑1 exclu IMC<22/dénutrition ; tirzépatide obésité only ; iSGLT2 uro.
- [ ] Portes intolérance (O12 + switch) et alerte metformine‑first (A5).
