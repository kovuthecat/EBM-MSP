# Inventaire des alertes de nœud — 5 domaines DT2 (2026-07-26)

Recensement exhaustif des `alertes` de nœud (champ `Noeud.alertes`, distinct des `options[].alertes`)
des 5 YAML `content/noeuds/diabete-type-2/*.yaml`, avec classement en 4 catégories (A/B/C/D, cf.
mission) et trois analyses transverses. Toutes les lignes citées ont été relues dans les fichiers
source pendant cette session ; aucune n'est reconstituée de mémoire. Aucun fichier existant n'a été
modifié (ni `content/`, ni `src/`, ni le schéma) ; aucun correctif YAML n'est proposé — uniquement le
classement et les cibles.

## Rappel des catégories

- **A — rappel de contexte** : vrai indépendamment du geste retenu, informe sans interdire ni imposer.
  Légitime en alerte de nœud, rien à faire.
- **B — interdit de sécurité** : rend un geste précis contre-indiqué. Devrait devenir une `exclusion`
  sur l'option nommée (affichée avec son motif via R4).
- **C — réserve attachée à un geste** : ne vaut que si une option précise est retenue. Devrait devenir
  une alerte d'option (`options[].alertes`) sur l'option nommée.
- **D — bloqué** : le classement en B/C exigerait un critère d'entrée absent du nœud. Le critère
  manquant est nommé.

## Table — 35 alertes de nœud

### Nœud `prescription` (`content/noeuds/diabete-type-2/prescription.yaml`) — 15 alertes

| # | Ligne `quand` | Niveau | Résumé (≤10 mots) | Classe | Justification |
|---|---|---|---|---|---|
| P1 | L724 `HbA1c_actuelle >= 10 OR symptomes_glucotoxicite == true` | attention | Contrôler la cétonémie, décompensation catabolique possible | A | Rappel d'un examen à faire, vrai quel que soit le geste retenu ; n'interdit ni n'impose d'option. |
| P2 | L730 `DFG < 60 AND DFG >= 45` | attention | Metformine : dose maximale 2000 mg/j | A | Info posologique indépendante du geste ; le référent l'a explicitement validée comme « sa forme adaptée » (recette, capture 1, pt. 2). |
| P3 | L735 `DFG < 45 AND DFG >= 30` | attention | Metformine : dose maximale 1000 mg/j | A | Même nature que P2 : réserve posologique informative, non tied à un geste précis. |
| P4 | L739 `DFG < 30` | attention | Metformine et sulfamide contre-indiqués, arrêter | A | L'interdiction qu'elle énonce est **déjà encodée en exclusion** sur l'option « Metformine (socle du traitement) — instaurer ou poursuivre » (`exclusions: ["DFG < 30"]`, L239-240) et portée par l'option dédiée « Arrêter la metformine (DFG < 30 — contre‑indication rénale) » (L253-256, conditions : `traitements_en_cours contient metformine` ET `DFG < 30`). Alerte redondante, pas de gap structurel — **mais** sur un formulaire vierge, `DFG` non renseigné vaut 0 < 30 : l'alerte s'affiche alors que `traitements_en_cours` est vide (aucune metformine à arrêter). C'est le défaut générique « valeur manquante lue comme 0 » (cause racine documentée en capture 12 de la recette), pas un défaut de modélisation alerte/exclusion propre à P4 : le mécanisme d'exclusion est correct, c'est l'entrée qui ment. |
| P5 | L755 `fragilite == true AND traitements_en_cours contient aGLP1 OR fragilite == true AND traitements_en_cours contient tirzepatide` | attention | Sujet fragile déjà sous incrétine : surveiller poids/nutrition | A | Constat d'un état déjà en place (traitement en cours), vrai indépendamment de ce que le moteur recommande par ailleurs ; aucune option de « poursuite » n'existe dans ce nœud à contredire. |
| P6 | L761 `infections_uro_genitales_recidivantes == true AND traitements_en_cours contient iSGLT2 OR … AND insuffisance_cardiaque == true OR … AND DFG < 60 OR … AND albuminurie != normo OR … AND ASCVD_etablie == true` | attention | iSGLT2 (en cours ou indiqué) + infections uro : ne pas initier | C | Réserve nuancée (« réévaluer l'indication… ne pas initier / envisager l'arrêt ») sur un geste précis — introduire/poursuivre l'iSGLT2. L'option cible, « Introduire un iSGLT2 (protection cardio‑rénale et/ou contrôle glycémique) » (L295-334), porte déjà cette réserve en `contre_indications` (prose, L333 : « Infections génito‑urinaires récidivantes ; antécédent de gangrène de Fournier ») mais aucune `exclusion` DSL ni `alertes` d'option ne l'applique — ses `exclusions` réelles se limitent à `DFG < 20`, `symptomes_glucotoxicite`, `cetonemie` (L306-308). Produit une contradiction affichée constatée (cf. §1, paire 5). |
| P7 | L767 `nature_intolerance == digestive AND traitements_en_cours contient metformine AND traitements_en_cours contient aGLP1 OR … tirzepatide` | attention | Intolérance digestive : réduire la metformine en priorité | A | Conseil de préférence entre deux options « Traitement à alléger » toutes deux affichées et cumulables ; n'interdit ni n'impose. |
| P8 | L776 `classes_a_benefice_indisponibles == true AND risque_hypoglycemie_schema == eleve` | attention | Déconseiller le sulfamide, préférer la gliptine | C | Réserve nuancée (« DÉCONSEILLER… si un SU est retenu ») sur l'option « Sulfamide (gliclazide MR ou glimépiride) — option glycémique de bas rang, derrière la gliptine » (L681-709) — qui n'a aucune `exclusion` ni `alertes` propre sur `risque_hypoglycemie_schema`. Peut s'afficher « Recommandée » à égalité avec la gliptine dans ce cas exact (cf. §1, paire 6). |
| P9 | L782 `classes_a_benefice_indisponibles == true AND DFG < 45` | attention | Adapter les doses de gliptine/sulfamide en IR | A | Réserve posologique (même registre que P2/P3), pas une interdiction : le sulfamide reste par ailleurs correctement exclu si `DFG < 30` (L691) ; ici l'alerte ne fait qu'informer du palier de dose. |
| P10 | L788 `traitements_en_cours contient insuline AND traitements_en_cours contient sulfamide OR … glinide` | attention | Association insuline + sulfamide/glinide : hypoglycémie cumulée | A | Renforce, sans les contredire, les options déjà orientées vers l'arrêt/remplacement du sulfamide ; l'ajout d'un NOUVEAU sulfamide est déjà bloqué par le `prerequis` `traitements_en_cours ne_contient_pas insuline` (L689). |
| P11 | L793 `preference_injection == refuse AND ASCVD_etablie == true OR … IMC >= 30` | attention | Refus des injections : privilégier une alternative orale | A | Explicite une règle de priorité déjà encodée (`priorite` rang 7 si `preference_injection == refuse`, ex. L355-356, L411-412, L453-454) ; n'interdit rien de nouveau. |
| P12 | L800 `position_vs_cible == a_l_objectif AND HbA1c_actuelle >= 9 OR position_vs_cible == sous_objectif AND HbA1c_actuelle >= 9` | attention | Incohérence : HbA1c ≥ 9 % mais déclaré à l'objectif | A | Contrôle de cohérence de saisie (deux champs déclaratifs qui se contredisent), indépendant de toute option ; ne vise aucun geste précis. |
| P13 | L806 `intention == intensifier AND hba1c_sous_cible == true` | attention | Incohérence : HbA1c < 6,5 % mais intention « intensifier » | A | Même nature que P12 : signalement d'une saisie contradictoire, pas une interdiction de geste. |
| P14 | L811 `traitements_en_cours contient insuline AND risque_hypoglycemie_schema == eleve` | attention | Sous insuline à haut risque : éviter un sécrétagogue | A | Règle déjà garantie par le `prerequis` `traitements_en_cours ne_contient_pas insuline` de l'option Sulfamide (L689) ; il n'existe pas d'option « ajouter un glinide » dans ce nœud. Alerte redondante mais sans gap. |
| P15 | L821 `traitements_en_cours contient gliptine` | attention | Non-association gliptine + AR GLP‑1/tirzépatide : arrêter la gliptine | A | Formulée au conditionnel (« si un AR GLP‑1 ou le tirzépatide est **introduit** »), vraie indépendamment du geste retenu. Fait doublon (non contradiction, cf. recette capture 3) avec l'option « Arrêter la gliptine redondante » (L520-532) quand les deux classes sont déjà associées : les deux pointent dans le même sens. |

### Nœud `insuline` (`content/noeuds/diabete-type-2/insuline.yaml`) — 9 alertes

| # | Ligne `quand` | Niveau | Résumé (≤10 mots) | Classe | Justification |
|---|---|---|---|---|---|
| I1 | L290 `hypo_severe_recurrente == true OR CV_glycemique > 36 OR TBR_severe > 1` | attention | Orienter vers le spécialiste si déséquilibre persiste | A | Les mêmes critères excluent déjà « Titrer la basale » (`exclusions`, L209-213) et déclenchent « Corriger l'hypoglycémie ou la variabilité » (L160-163, mêmes conditions) : cohérent, sans contradiction constatée. |
| I2 | L297 `traitements_en_cours contient sulfamide OR traitements_en_cours contient glinide` | attention | Arrêter le sulfamide/glinide à l'introduction de l'insuline | A | Renvoie à un geste hors périmètre de ce nœud (géré par `prescription`) ; aucune option d'`insuline.yaml` ne gère sulfamide/glinide. |
| I3 | L300 `traitements_en_cours contient iSGLT2` | attention | Maintenir l'iSGLT2, risque d'acidocétose euglycémique | A | Information de sécurité sur un traitement déjà en cours, non liée aux options de titration de l'insuline de ce nœud. |
| I4 | L305 `DFG < 45` | attention | IR : besoins en insuline réduits, adapter les doses | A | Réserve posologique générale (insuline/sulfamide/metformine) ; aucune de ces classes n'est une option de ce nœud (sulfamide/metformine sont hors périmètre). |
| **I5** | **L312 `over_basalisation == true`** | info | Ne pas poursuivre la titration, dose basale élevée | **B** | Interdit explicitement de poursuivre « Titrer la basale (augmenter la dose) » (L195-213), qui **n'a aucune `exclusion` sur `over_basalisation`** (ses seules exclusions : `TBR`, `TBR_severe`, `CV_glycemique`, `profil_glycemique contient hypo_nocturne`, L209-213). Contradiction constatée en recette (captures 12.8 et 12.9, cf. §1). |
| I6 | L317 `mcg_disponible == true AND terrain_fragile == false` | info | Cibles de MCG standard (Battelino 2019) | A | Rappel d'interprétation d'une mesure, indépendant des options affichées. |
| I7 | L323 `mcg_disponible == true AND terrain_fragile == true` | info | Cibles de MCG assouplies chez le sujet fragile | A | Idem I6, rappel d'interprétation. |
| I8 | L328 `mcg_disponible == false` | info | Sans MCG : titrer sur la glycémie à jeun | A | Rappel méthodologique de suivi, n'interdit ni n'impose de geste. |
| I9 | L333 `default` | info | Insuline sans bénéfice CV démontré (ORIGIN neutre) | A | Message générique toujours affiché, sans lien avec une option précise. |

### Nœud `statine` (`content/noeuds/diabete-type-2/statine.yaml`) — 3 alertes

| # | Ligne `quand` | Niveau | Résumé (≤10 mots) | Classe | Justification |
|---|---|---|---|---|---|
| S1 | L111 `age > 75 AND ASCVD_etablie == false` | attention | Prévention primaire après 75 ans : individualiser | A | Nuance appliquée à toute la population non-ASCVD (2 des 3 options concernées, pas une option unique) ; langage non-interdicteur (« individualiser »). |
| **S2** | **L118 `dialyse == true`** | attention | Dialyse : ne pas initier une statine | **D** | Le classement en B exigerait un critère absent du nœud : aucune variable ne dit si une statine est **déjà en place** — l'alerte elle-même le formule (« Si une statine est déjà en place, sa poursuite est raisonnable », L123). `criteres_entree` du nœud (L42-53) ne contient que `age`, `ASCVD_etablie`, `anciennete_diabete_annees`, `autres_FDRCV`, `diabete_complique`, `dialyse` — aucun critère « statine en cours » ni « intolérance ». Critère manquant : **`statine_deja_en_place` (ou équivalent)**, distinguant initiation de poursuite. |
| S3 | L125 `default` | info | Décision sur le risque absolu, pas sur le LDL | A | Rappel méthodologique général, toujours affiché, sans lien avec un geste précis. |

### Nœud `rhd` (`content/noeuds/diabete-type-2/rhd.yaml`) — 8 alertes

| # | Ligne `quand` | Niveau | Résumé (≤10 mots) | Classe | Justification |
|---|---|---|---|---|---|
| R1 | L226 `IMC >= 35` | attention | Penser à une évaluation de chirurgie métabolique | A | Oriente vers une prise en charge hors nœud (soins spécialisés) ; la chirurgie n'est pas une `option` de ce nœud (2 options seulement : Socle, Perte de poids visée rémission), donc aucun geste **du nœud** n'est contredit ou modulé. |
| R2 | L236 `IMC >= 27 AND anciennete_diabete_annees < 6` | info | Fenêtre favorable à la rémission (< 6 ans) | C | Réserve/modulation de message qui n'a de sens que si l'option « Perte de poids importante visée rémission — informer, recommander, orienter » (L68-86) est affichée (même gate `IMC >= 27`). Choix explicitement documenté dans `incertitudes` (L220 : « elle module donc le message, pas l'éligibilité »). |
| R3 | L242 `IMC >= 27 AND anciennete_diabete_annees >= 6` | info | Diabète ancien (≥ 6 ans) : rémission moins probable | C | Même option porteuse que R2 (branche symétrique du même modulateur). |
| R4 | L248 `alimentation_equilibree == true AND activite_physique_reguliere == true` | info | Mode de vie déjà optimisé : marge de manœuvre faible | A | Modulation de message du socle, option **universelle** (`conditions: ["toujours"]`) : choix délibéré de ne pas gater (arbitrage §8-4 du dossier de preuve H-rhd.md), n'interdit ni n'impose de geste précis. |
| R5 | L254 `capacite_activite == false` | info | Adapter l'activité physique aux capacités | A | Même registre que R4 : modulation non gatée du socle universel. |
| R6 | L259 `motivation == false` | info | Renforcer l'adhésion, objectifs modestes | A | Idem R4/R5, modulation non gatée du socle universel. |
| R7 | L264 `traitements_en_cours contient insuline OR sulfamide OR glinide` | attention | Perte de poids sous insuline/SU : risque d'hypoglycémie | A | Renvoie vers d'autres nœuds (« voir nœuds C / D / E ») ; aucune option du nœud RHD n'est contredite. |
| R8 | L269 `default` | info | Sujet âgé/fragile/dénutri : pas de restriction agressive | A | Message générique toujours affiché ; structurellement non contradictoire (critiqué en recette pour son manque de ciblage — « s'affiche pour tout le monde, donc pour personne » — mais ce n'est pas une contradiction au sens de la mission). |

### Nœud `cible-glycemique` (`content/noeuds/diabete-type-2/cible-glycemique.yaml`) — 0 alerte

Aucun champ `alertes` dans ce fichier (vérifié : absent du YAML). Cohérent avec le comptage fourni
(4 options / 0 exclusions / 0 alertes / 0 alertes d'option).

## Décompte

| Nœud | Alertes de nœud | A | B | C | D |
|---|---|---|---|---|---|
| prescription | 15 | 13 | 0 | 2 (P6, P8) | 0 |
| insuline | 9 | 8 | 1 (I5) | 0 | 0 |
| statine | 3 | 2 | 0 | 0 | 1 (S2) |
| rhd | 8 | 6 | 0 | 2 (R2, R3) | 0 |
| cible-glycemique | 0 | — | — | — | — |
| **Total** | **35** | **29** | **1** | **4** | **1** |

---

## 1. Contradictions actuelles

Six couples (alerte, option) peuvent s'afficher **ensemble** en se contredisant, avec le jeu de
critères qui les produit. Chaque déduction est vérifiée sur les `conditions`/`exclusions`/`prerequis`
réels de l'option citée (pas de supposition).

### Paire 1 — `insuline` : alerte `over_basalisation` (I5, L312-316) vs option « Titrer la basale (augmenter la dose) » (L195-213)

Profil : `situation_insuline = basale_seule` ; `dose_basale_actuelle = 40` ; `poids = 70` (→
`over_basalisation = 40/70 = 0,571 > 0,5`, vrai) ; `HbA1c_actuelle = 9`, `HbA1c_cible = 7` (→
`cible_atteinte = false`) ; `GAJ` non renseigné (→ `gaj_a_cible = false`) ; `TBR ≤ 4`, `TBR_severe ≤ 1`,
`CV_glycemique ≤ 36`, `profil_glycemique` ne contient pas `hypo_nocturne`. « Titrer la basale » exige
`situation_insuline == basale_seule`, `cible_atteinte == false`, `gaj_a_cible == false` — tout est vrai
— et ses `exclusions` (`TBR > 4`, `TBR_severe > 1`, `CV_glycemique > 36`, `profil_glycemique contient
hypo_nocturne`, L209-213) ne portent pas sur `over_basalisation` : l'option s'affiche (« Basale après
+2 U ≈ 42 U/j ») pendant que l'alerte dit « ne pas poursuivre la titration ». Confirmé empiriquement
(recette, capture 12.8).

### Paire 2 — `insuline` : même alerte `over_basalisation` vs option de repli « Poursuivre le schéma d'insuline en cours et réévaluer » (L278-288, `conditions: ["default"]`)

Profil : même `dose_basale_actuelle`/`poids` (`over_basalisation` toujours vrai) mais cette fois
`HbA1c_actuelle = 6 ≤ HbA1c_cible = 7` (`cible_atteinte = true`) et `GAJ = 1,0` (`gaj_a_cible = true`)
→ « Titrer la basale » (exige `cible_atteinte == false`) et « Ne pas sur-titrer la basale… » (exige
aussi `cible_atteinte == false`) ne se déclenchent ni l'une ni l'autre → repli `default` affiché, dont
le texte affirme « Aucun ajustement n'est indiqué : objectif atteint… » — alors que l'alerte
`over_basalisation`, elle, continue de réclamer un changement (« préférer l'ajout d'un GLP-1 ou d'un
bolus prandial »). Confirmé empiriquement (recette, capture 12.9).

### Paire 3 — `statine` : alerte dialyse (S2, L118-124) vs option « Statine (prévention primaire, intensité modérée — haute si risque très élevé) » (L90-109, `conditions: ["default"]`)

Profil : `dialyse = true` ; `ASCVD_etablie = false` ; `anciennete_diabete_annees = 12` (≥ 10) ;
`autres_FDRCV = 2`. L'option « Discuter la statine » (L75-89, exige `anciennete < 10` ET
`autres_FDRCV == 0` ET `diabete_complique == false`) échoue → repli `default` (aucune `exclusion` sur
`dialyse` dans ce nœud, vérifié : `statine.yaml` n'a `exclusions` sur aucune option) → « Statine
(prévention primaire…) » s'affiche comme unique sortie, pendant que l'alerte dit « ne pas INITIER ».
Confirmé empiriquement (recette, capture 13.5).

### Paire 4 — `statine` : même alerte dialyse vs option « Statine de haute intensité — prévention secondaire (maladie athéromateuse établie) » (L55-74, `conditions: ["ASCVD_etablie == true"]`)

Même profil + `ASCVD_etablie = true` → cette option (1re dans l'ordre `ordered-first-match`) l'emporte
directement → « Statine de haute intensité — délai du bénéfice 5-6 ans » affichée comme unique sortie,
pendant que l'alerte dit « ne pas INITIER ». Confirmé empiriquement (recette, capture 13.6).

### Paire 5 — `prescription` : alerte infections uro-génitales (P6, L761-766) vs option « Introduire un iSGLT2 (protection cardio‑rénale et/ou contrôle glycémique) » (L295-334)

Profil (construit à partir des `conditions`/`exclusions` réelles, non capturé dans la recette) :
`infections_uro_genitales_recidivantes = true` ; `insuffisance_cardiaque = true` ; `ASCVD_etablie =
false` ; `DFG = 70` ; `albuminurie = normo` ; `IMC = 25` ; `traitements_en_cours = []` ;
`symptomes_glucotoxicite = false` ; `cetonemie = false` ; `classes_a_benefice_indisponibles = false`.
L'option iSGLT2 : conditions vraies via `insuffisance_cardiaque == true` (une des disjonctions L297) ;
ses `exclusions` réelles (`DFG < 20`, `symptomes_glucotoxicite`, `cetonemie`, L306-308) ne couvrent pas
les infections uro-génitales → affichée « Recommandée » (rang 2, L312-313), pendant que l'alerte
(disjonction `infections_uro AND insuffisance_cardiaque`, vraie) dit « réévaluer l'indication (ne pas
initier) ».

### Paire 6 — `prescription` : alerte classes indisponibles + risque hypo (P8, L776-781) vs option « Sulfamide (gliclazide MR ou glimépiride) — option glycémique de bas rang, derrière la gliptine » (L681-709)

Profil (construit) : `classes_a_benefice_indisponibles = true` ; `risque_hypoglycemie_schema = eleve` ;
`position_vs_cible = au_dessus` ; `traitements_en_cours = []` ; `DFG = 70` ; `IMC = 25` ;
`ASCVD_etablie = false` ; `insuffisance_cardiaque = false` ; `albuminurie = normo`. Aucune des options
iSGLT2/AR GLP‑1/tirzépatide/association/insuline ne se déclenche (leurs conditions ne dépendent pas de
`classes_a_benefice_indisponibles` seul et aucune comorbidité n'est cochée). Gliptine et Sulfamide se
déclenchent toutes deux (même 1re condition disjonctive) et sont toutes deux classées rang 3 (règle
`priorite` : « quand `classes_a_benefice_indisponibles == true`, rang 3 », L666-667 et L695-696) →
à égalité en tête de la famille exclusive « Agent à ajouter » → toutes deux affichées « Recommandée »,
dont le Sulfamide, pendant que l'alerte dit « DÉCONSEILLER le sulfamide ».

---

## 2. Risque de mutisme

*(Analyse demandée « pour chaque alerte classée B ». Une seule alerte est classée B : I5. L'alerte S2
est classée **D**, mais la mission demande une attention particulière à `statine` : la question est
donc traitée aussi pour S2, sous l'angle « que se passerait-il si on la transformait en exclusion
malgré le critère manquant ».)*

### I5 (`over_basalisation`, insuline) — pas de sortie vide, mais un déplacement de la contradiction

Le nœud `insuline` est en **multi-options** (pas `ordered-first-match`) et porte un repli universel
`["default"]` (« Poursuivre le schéma d'insuline en cours et réévaluer », L278-288) : ajouter
`over_basalisation == true` en `exclusion` sur « Titrer la basale » ne peut donc **jamais vider
entièrement** la sortie du nœud — un repli reste toujours disponible.

**Mais ce n'est pas pour autant un correctif propre.** Dans le profil de la Paire 2 (§1), exclure
« Titrer la basale » ne change rien à la sortie affichée : le repli s'active déjà (aucune autre option
de la situation « Basale seule » ne se déclenche). Son texte affirme « Aucun ajustement n'est indiqué :
objectif atteint » alors que l'alerte `over_basalisation`, elle, continue de réclamer un changement. La
contradiction visible ne disparaît pas — elle se **déplace** du couple (alerte, « Titrer la basale »)
vers le couple (alerte, repli). Corriger uniquement « Titrer la basale » est donc, sur ce second
profil, un échange à somme nulle, pas un gain net.

Le vrai trou est en amont (recette, capture 12.8) : l'option censée prendre le relais, « Ne pas
sur-titrer la basale — intensifier autrement (GLP-1 puis bolus) » (L175-194), exige `gaj_a_cible ==
true` — or un `GAJ` non renseigné est lu comme 0, donc « pas à la cible » (défaut générique « valeur
manquante lue comme 0 »). Ajouter la seule exclusion sur « Titrer la basale », sans corriger ce second
défaut de saisie, ne fait que basculer l'affichage vers le repli plutôt que vers la bonne option — le
signalement B est donc correct, mais insuffisant seul.

### S2 (`dialyse`, statine) — le cas où un correctif B naïf viderait le nœud

Classée D (le critère « statine déjà en place » manque), mais le risque à documenter est celui d'un
correctif B **prématuré**, tenté avant l'ajout de ce critère : ajouter `exclusions: ["dialyse ==
true"]` aux 3 options du nœud (aucune n'en porte actuellement — vérifié) viderait **entièrement** la
sortie pour tout patient dialysé. Le nœud est en `ordered-first-match` avec **seulement 3 options**,
dont la 3ᵉ *est elle-même* le repli (`conditions: ["default"]`) : il n'existe pas de 4ᵉ filet de
sécurité derrière elle. Exclure les 3 options simultanément viole directement l'invariant « jamais de
sortie vide » (`GRAMMAIRE-NOEUD.md`, invariant domaine DT2 n° 2).

C'est l'exemple que la mission demande explicitement de surveiller sur `statine` : un correctif B
naïf ici **remplacerait une contradiction visible (alerte + carte affichée) par un écran vide** — un
échange strictement perdant, pire que l'état actuel. La correction correcte suppose d'abord le critère
manquant (§ D ci-dessous : `statine_deja_en_place` ou équivalent), pour n'exclure que le cas
« initiation » et laisser passer le cas « poursuite », conformément au texte même de l'alerte.

---

## 3. Le champ `incertitudes` — dettes documentées « alerte plutôt que gate »

Recensement de toutes les lignes de `incertitudes:` (dans les 5 YAML) qui documentent explicitement un
choix de modélisation en alerte plutôt qu'en gate/exclusion/option. **7 lignes, dans 4 nœuds** (aucune
dans `cible-glycemique.yaml`, qui n'a d'ailleurs aucune `alertes`).

| Nœud | Ligne | Citation |
|---|---|---|
| prescription | L977 | « Repli O11 (« pas de remplaçant protecteur pertinent ») : encodé en ALERTE A9 (2 disjonctions pur-AND, causes IMC<22 / dénutrition sans indication iSGLT2) + rappel en prose dans l'option. Couvre le cas sans indication protectrice ; ne se déclenche pas si un remplaçant serait valide. » |
| insuline | L487 | « Seuil d'over-basalisation de 0,5 U/kg = repère (SFD / Médicalement Geek), non validé par un essai — à confirmer ; modélisé comme dérivé affiché, pas comme gate EBM dur. » |
| statine | L289 | « SCORE2-Diabète = aide à l'estimation du risque absolu (seuils fixes ESC 2023, validé 40-69 ans), affichée en alerte info, NON encodée comme gate (un seuil % serait un artefact de modèle, pas une donnée d'ECR — l'ancien encodage âge-bandé était une erreur méthodo corrigée). » |
| statine | L290 | « Prévention primaire après 75 ans : preuve faible/incertaine (STAREE — qui exclut les diabétiques — et PREVENTABLE en cours) ; modélisée en alerte plutôt qu'en option distincte. » |
| statine | L291 | « Exception dialyse modélisée par une alerte sur la variable `dialyse` (bool) — elle ne retire pas l'option (le clinicien juge la poursuite d'une statine déjà en place). » |
| rhd | L220 | « Fenêtre de rémission : gate sur l'IMC seul (§8-2). L'ancienneté du diabète n'EST PAS un prédicteur indépendant après ajustement sur la perte de poids (Kanbour, conclusion écologique), mais garde une plausibilité biologique (réserve β-cellulaire) — elle module donc le message, pas l'éligibilité. » |
| rhd | L222 | « Chirurgie (alerte) : le seuil 30-34,9 « au cas par cas après échec médical ≥ 12 mois » n'est PAS gaté par le moteur (le nœud H ne collecte pas d'indicateur de contrôle glycémique) ; l'alerte se déclenche sur IMC ≥ 35 et le message rappelle le cas 30-34,9. » |

Ces 7 lignes recoupent directement les classements ci-dessus : la ligne statine L291 est l'exemple
littéral de la catégorie D (S2) ; la ligne insuline L487 documente exactement le mécanisme derrière I5
(B) ; les lignes rhd L220/L222 documentent les modulations R2/R3 (C) et R1 (A, hors périmètre des
options du nœud) ; la ligne prescription L977 documente la stratégie déjà en place derrière le « repli »
de l'option « Remplacer la gliptine »/« Remplacer le sulfamide », cohérente avec le classement A des
alertes correspondantes.

---

## Note méthodologique — confirmations reçues en cours de session

Deux constats transmis en cours de route ont été utilisés en **vérification**, pas comme base de
classement (relus dans le YAML avant d'écrire, cf. P4 et S2 ci-dessus) :
- le cas « formulaire vierge → `DFG < 30` lu comme vrai → alerte P4 s'affiche alors que
  `traitements_en_cours` est vide » confirme que le mécanisme d'exclusion de P4 est correct (déjà en
  place, L239-240/L253-256) et que le défaut résiduel est le bug générique « valeur manquante = 0 »,
  pas un défaut de modélisation alerte/exclusion — n'a pas changé le classement A ;
- l'absence confirmée de tout critère « statine déjà en cours » ou « intolérance » dans
  `statine.yaml` (`criteres_entree`, L42-53) confirme le classement D de S2 et nomme précisément le
  critère manquant.
