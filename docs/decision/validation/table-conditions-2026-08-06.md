# Table des conditions des 6 nœuds DT2 — 2026-08-06

Ce document n'est pas un compte rendu de session : c'est une lecture systématique des 84 cartes des 6
nœuds du domaine **dont l'unité est la relation entre cartes** — ce qu'aucun artefact du procédé
(vignettes, invariants, recette, golden master) ne prend pour unité. Il est **régénérable
mécaniquement depuis les YAML** (`content/decision/noeuds/diabete-type-2/*.yaml`) et lisible sans
ouvrir le dépôt. C'est le modèle de ce que `docs/decision/CONSTRUIRE-UN-MODULE.md` exigera en porte de
sortie P6 (S12/T-183).

**Hors périmètre de ce document** : aucun correctif, aucune recommandation d'implémentation. Le
document constate ; le plan corrige — cf. `plans/P14/index.md` (§ « Ce que chaque défaut devient ») pour
le traitement des neuf défauts listés plus bas.

Produit en P14/S3 (T-166). Source : les 6 fichiers YAML de nœud, tels qu'ils existaient le 2026-08-06
(avant toute session de correction du plan P14) ; l'inventaire des paires co-actives, produit en P14/S1
(T-160/T-161).

---

## 1. Clé de lecture

### Le DSL de `conditions` / `prerequis` / `exclusions` (`src/features/decision/engine/conditions.ts`)

Les trois champs partagent **exactement la même grammaire** :

- une expression est une comparaison atomique `variable OP valeur` (`OP` ∈ `== != < <= > >=`), ou une
  appartenance à liste `variable contient valeur` / `variable ne_contient_pas valeur` (le critère doit
  être de type `liste`) ;
- une expression peut composer plusieurs atomes par `AND` / `OR` (mots-clés majuscules) — **`AND` est
  prioritaire sur `OR`** (`"a AND b OR c AND d"` = `(a ET b) OU (c ET d)`) ;
- **pas de parenthèses** dans ce DSL ;
- un champ (`conditions`, `prerequis` ou `exclusions`) est un **tableau** d'expressions : plusieurs
  items du tableau sont en **ET implicite** entre eux (`[] ⇒ vrai`) — c'est un second niveau de
  composition, au-dessus du AND/OR interne à chaque expression ;
- deux sentinelles réservées dans `conditions` : `["toujours"]` (option **socle**, systématiquement
  applicable, soumise à ses `exclusions`) et `["default"]` (option de **repli** du nœud).

### `conditions` / `prerequis` / `exclusions` : trois rôles, une seule grammaire

- **`conditions`** répond à « pourquoi propose-t-on cette option à CE patient » — une indication
  clinique, affichée comme justification (« Proposé parce que… »).
- **`prerequis`** répond à « qu'est-ce qui ne l'empêche pas » — même grammaire, même règle
  d'applicabilité (une option est applicable si **toutes** ses `conditions` **et tous** ses `prerequis`
  sont vrais), mais **jamais affiché comme justification**. Absent = comportement inchangé.
- **`exclusions`** retire une option déjà applicable dès qu'**une** de ses expressions est vraie
  (l'option part dans `excluded`, jamais silencieusement supprimée).

### `ordered-first-match` vs `multi-options` (`Noeud.selection`)

- **`ordered-first-match`** (`cible-glycemique`, `statine`) : sortie **unique** — la première option,
  dans l'**ordre d'écriture du tableau `options`**, dont les `conditions` sont vraies l'emporte ;
  l'option `["default"]` sert de repli en dernier recours. `priorite` est **ignorée** par le moteur dans
  ce mode : la colonne « rang » des tables ci-dessous porte alors la mention *ignoré (OFM)*, et c'est
  l'**ordre du tableau** (colonne `#`) qui fait foi.
- **`multi-options`** (les 4 autres nœuds) : plusieurs options peuvent être affichées ensemble. Chacune
  porte une `famille` (référence à `Noeud.familles[].libelle`) ; une famille `exclusive: true` est un
  jeu d'**alternatives** (« en choisir un », badge « recommandée » réservé au groupe de tête) ; une
  famille `exclusive: false` est un jeu de **gestes cumulables** (badge « recommandée » sur tout ce qui
  s'affiche). **L'ordre des SECTIONS à l'écran suit l'ordre du tableau `Noeud.familles[]`** (pas l'ordre
  d'écriture des options) ; à l'intérieur d'une famille, les options sont triées par `priorite` (rang
  croissant) — entier = rang fixe, tableau de règles `{quand, rang}` = rang conditionnel (1ʳᵉ règle dont
  `quand` est vraie l'emporte ; `quand: "default"` doit être en dernier, sinon les règles suivantes sont
  mortes).

### Légende des colonnes

| Colonne | Sens |
| --- | --- |
| `#` | Index de l'option dans le tableau `options:` du YAML (1-based) — **pas** un numéro de ligne. |
| `role` | Ce que l'option EST, déclaré par le contenu : `socle` (geste de fond, sentinelle `toujours`) · `securite` (à faire d'emblée, jamais replié ni plafonné) · `geste` (piste thérapeutique ordinaire) · `repli` (sentinelle `default`). |
| `famille` | `option.famille`, croisé avec `Noeud.familles[]` : **(excl.)** = famille `exclusive: true` (alternatives) · **(cumul.)** = famille `exclusive: false` (gestes cumulables) · `—` = pas de `famille` déclarée sur cette option. |
| `rang` | Valeur de `priorite` (entier, règles conditionnelles, ou absent) ; *ignoré (OFM)* si `Noeud.selection == ordered-first-match`. |
| `conditions` / `prerequis` / `exclusions` | Une ligne par item du tableau YAML, verbatim (ET implicite entre les lignes d'une même cellule). `—` = champ absent. |

### Convention d'abréviation adoptée pour ce document

Certaines cartes portent des expressions très longues ou répétées à l'identique d'une option à
l'autre. Recopier ces expressions dans chaque cellule rendrait la table illisible (et, au-delà d'une
certaine longueur, **une cellule qui tronque une expression ment** — cf. « Si bloqué » de la tâche).
Règle appliquée, uniformément sur les 6 nœuds :

1. Toute expression individuelle dépassant **~100 caractères** est extraite en **bloc nommé** sous le
   tableau de son nœud (jamais tronquée dans une cellule), quel que soit son nombre d'occurrences.
2. Toute expression de 40 à 100 caractères répétée **à l'identique** (caractère pour caractère, tous
   champs confondus) dans **au moins 3 options** du même nœud reçoit elle aussi un bloc nommé, pour
   éviter de la recopier inutilement de nombreuses fois.
3. En deçà de 40 caractères, ou répétée dans moins de 3 options : l'expression est recopiée en clair
   dans chaque cellule — un atome court comme `DFG < 30` se lit mieux tel quel qu'à travers un renvoi.

Cette règle (le choix des seuils 100 / 40 / 3 occurrences) est une convention de rédaction de ce
document, pas une règle du schéma ou du moteur — elle est documentée ici pour que la table reste
régénérable à l'identique.

---

## 2. Table par nœud

### `cible-glycemique` — Déterminer la cible d'HbA1c

`selection: ordered-first-match` · pas de `Noeud.familles[]` déclarée · 4 options.

| # | intitulé | role | famille | rang | conditions | prerequis | exclusions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Cible < 9 % | geste | — | ignoré (OFM) | `esperance_vie == limitee`<br>`fragilite == true OR comorbidite_grave == true` | — | — |
| 2 | Cible ≤ 8 % | geste | — | ignoré (OFM) | `fragilite == true OR comorbidite_grave == true OR esperance_vie == limitee OR antecedent_cv == true` | — | — |
| 3 | Cible ~6,5 % (6,5–7 %) | geste | — | ignoré (OFM) | `age < 70`<br>`anciennete_diabete_annees < 5`<br>`esperance_vie == longue`<br>`antecedent_cv == false`<br>`comorbidite_grave == false`<br>`fragilite == false` | — | — |
| 4 | Cible ≤ 7 % | repli | — | ignoré (OFM) | `default` | — | — |

Aucune expression >100 caractères, aucune répétition ≥3 occurrences : pas de bloc nommé pour ce nœud.
L'ordre du tableau ci-dessus **est** l'ordre d'évaluation (OFM) : un patient qui coche plusieurs cases
obtient la **première** ligne dont les `conditions` sont vraies.

---

### `insuline` — Initier ou optimiser une insulinothérapie

`selection: multi-options` · 15 options.

`Noeud.familles[]` (ordre déclaré = ordre d'affichage) :

| Ordre | libellé | exclusive | prioritaire_si |
| --- | --- | --- | --- |
| 1 | Avant de décider — la mesure | cumul. | — |
| 2 | Sécurité — à corriger d'abord | cumul. | — |
| 3 | Instaurer l'insuline | cumul. | — |
| 4 | Intensifier le traitement | cumul. | — |
| 5 | Ajuster le schéma en place | cumul. | — |
| 6 | Alléger le schéma | cumul. | — |
| 7 | Aucun geste — surveiller | cumul. | — |

| # | intitulé | role | famille | rang | conditions | prerequis | exclusions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Envisager d'instaurer une mesure continue du glucose | geste | Avant de décider — la mesure (cumul.) | 1 | `situation_insuline != naif`<br>`mcg_disponible == false`<br>`cible_atteinte == false` | — | — |
| 2 | Envisager un GLP-1 avant ou avec l'insuline | geste | Instaurer l'insuline (cumul.) | 1 | `situation_insuline == naif`<br>`cible_atteinte == false OR symptomes_glucotoxicite == true` | `traitements_en_cours ne_contient_pas aGLP1` | — |
| 3 | Initier une insuline basale | geste | Instaurer l'insuline (cumul.) | 2 | `situation_insuline == naif`<br>`cible_atteinte == false OR symptomes_glucotoxicite == true` | `traitements_en_cours ne_contient_pas insuline_basale` | — |
| 4 | Choisir un analogue basal de 2ᵉ génération | geste | Instaurer l'insuline (cumul.) | 3 | `situation_insuline == naif`<br>`risque_hypoglycemique_eleve == true` | — | — |
| 5 | Corriger l'hypoglycémie ou la variabilité | securite | Sécurité — à corriger d'abord (cumul.) | 1 | `situation_insuline == basale_seule OR situation_insuline == basale_plus_bolus`<br>**[INS-1]** | — | — |
| 6 | Ne pas sur-titrer la basale — intensifier autrement | securite | Sécurité — à corriger d'abord (cumul.) | 2 | `situation_insuline == basale_seule`<br>`cible_atteinte == false`<br>**[INS-2]** | — | `mcg_disponible == true AND TBR > 4`<br>`mcg_disponible == true AND CV_glycemique > 36`<br>**[INS-6]** |
| 7 | Titrer la basale (augmenter la dose) | geste | Intensifier le traitement (cumul.) | 3 | `situation_insuline == basale_seule`<br>`cible_atteinte == false`<br>**[INS-3]** | — | `mcg_disponible == true AND TBR > 4`<br>`mcg_disponible == true AND CV_glycemique > 36`<br>**[INS-6]**<br>`mcg_disponible == false AND gaj_basse == true` |
| 8 | Réduire la basale | geste | Ajuster le schéma en place (cumul.) | 1 | `situation_insuline != naif`<br>**[INS-6]** | — | — |
| 9 | Ajouter un GLP-1 / une association fixe d'abord | geste | Intensifier le traitement (cumul.) | 1 | `situation_insuline == basale_plus_bolus OR situation_insuline == basale_seule`<br>`cible_atteinte == false`<br>**[INS-4]** | `traitements_en_cours ne_contient_pas aGLP1 AND traitements_en_cours ne_contient_pas tirzepatide` | `situation_insuline == basale_plus_bolus AND mcg_disponible == true AND TBR > 4`<br>`situation_insuline == basale_plus_bolus AND mcg_disponible == true AND CV_glycemique > 36`<br>**[INS-5]** |
| 10 | Ajouter un bolus au repas principal | geste | Intensifier le traitement (cumul.) | 2 | `situation_insuline == basale_plus_bolus OR situation_insuline == basale_seule`<br>`cible_atteinte == false`<br>**[INS-4]** | `traitements_en_cours ne_contient_pas insuline_rapide` | `situation_insuline == basale_plus_bolus AND mcg_disponible == true AND TBR > 4`<br>`situation_insuline == basale_plus_bolus AND mcg_disponible == true AND CV_glycemique > 36`<br>**[INS-5]** |
| 11 | Insuline prémélangée — option dégradée, dernier recours | geste | Intensifier le traitement (cumul.) | 3 | `situation_insuline == basale_plus_bolus`<br>`preference_injection == refuse` | — | — |
| 12 | Désintensifier / alléger le schéma | geste | Alléger le schéma (cumul.) | 1 | **[INS-7]** | — | — |
| 13 | Optimiser la répartition du basal-bolus | geste | Ajuster le schéma en place (cumul.) | 2 | `situation_insuline == basal_bolus OR situation_insuline == basale_plus_bolus`<br>**[INS-8]** | — | — |
| 14 | Poursuivre le schéma d'insuline en cours et réévaluer | repli | Aucun geste — surveiller (cumul.) | non déclaré | `default` | `situation_insuline != naif` | — |
| 15 | Pas d'indication à initier une insuline aujourd'hui | repli | Aucun geste — surveiller (cumul.) | non déclaré | `default` | `situation_insuline == naif` | — |

**Expressions nommées — `insuline`** (numérotées dans l'ordre d'apparition dans le tableau ci-dessus) :

- **[INS-1]** (132 car., option 5, `conditions`) : `mcg_disponible == true AND TBR > 4 OR mcg_disponible == true AND CV_glycemique > 36 OR mcg_disponible == false AND gaj_basse == true`
- **[INS-2]** (138 car., option 6, `conditions`) : `mcg_disponible == false AND gaj_a_cible == true OR mcg_disponible == true AND profil_nocturne_a_cible == true OR over_basalisation == true`
- **[INS-3]** (116 car., option 7, `conditions`) : `mcg_disponible == false AND gaj_haute == true OR mcg_disponible == true AND profil_nocturne_permet_titration == true`
- **[INS-4]** (354 car., **répétée à l'identique** — options 9 et 10, `conditions`) : `situation_insuline == basale_plus_bolus OR mcg_disponible == true AND TBR > 4 OR mcg_disponible == true AND CV_glycemique > 36 OR mcg_disponible == true AND profil_nocturne == baisse_continue OR over_basalisation == true OR gaj_a_cible == true OR mcg_disponible == false AND gaj_basse == true OR mcg_disponible == true AND profil_nocturne_a_cible == true`
- **[INS-5]** (105 car., **répétée à l'identique** — options 9 et 10, `exclusions`) : `situation_insuline == basale_plus_bolus AND mcg_disponible == true AND profil_nocturne == baisse_continue`
- **[INS-6]** (63 car., **répétée à l'identique dans 3 options** — options 6 et 7 en `exclusions`, option 8 en `conditions`) : `mcg_disponible == true AND profil_nocturne == baisse_continue`
- **[INS-7]** (141 car., option 12, `conditions`, seul item) : `situation_insuline == basal_bolus AND risque_hypoglycemique_eleve == true OR situation_insuline != naif AND ecart_sous_objectif_cible == true`
- **[INS-8]** (273 car., option 13, `conditions`) : `cible_atteinte == false OR mcg_disponible == true AND TBR > 4 OR mcg_disponible == true AND CV_glycemique > 36 OR mcg_disponible == true AND profil_nocturne == baisse_continue OR profil_entre_repas == baisse_entre_repas OR pre_repas_haute == true OR pre_repas_basse == true`

*Note de vérification* : la citation du plan (`plans/P14/S3.md`, étape 2) « le long terme d'instabilité
partagé par les deux cartes d'intensification d'insuline » a été recherchée en texte intégral dans
`insuline.yaml` : elle n'y figure nulle part littéralement (ni commentaire ni expression DSL). Ce à quoi
elle renvoie, concrètement, ce sont **[INS-4]** et **[INS-5]** : les deux expressions que les deux cartes
d'intensification (options 9 et 10, « Ajouter un GLP-1… » et « Ajouter un bolus… ») partagent mot pour
mot.

---

### `prescription` — Initier ou optimiser un traitement non insulinique

`selection: multi-options` · 28 options — le plus gros des 6 nœuds.

`Noeud.familles[]` (ordre déclaré = ordre d'affichage) :

| Ordre | libellé | exclusive | prioritaire_si |
| --- | --- | --- | --- |
| 1 | À faire d'emblée — sécurité | cumul. | — |
| 2 | Socle du traitement | cumul. | — |
| 3 | Traitement à corriger ou remplacer | cumul. | — |
| 4 | Le choix de l'agent | **excl.** | — |
| 5 | Traitement à alléger | cumul. | `intention == deprescrire` |
| 6 | Aucun geste — surveiller | cumul. | — |

| # | intitulé | role | famille | rang | conditions | prerequis | exclusions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Metformine | socle | Socle du traitement (cumul.) | 0 | `toujours` | — | `DFG < 30`<br>`metformine_deprescriptible == true`<br>**[PRE-1]** |
| 2 | Metformine (DFG < 30) | securite | À faire d'emblée — sécurité (cumul.) | 1 | **[PRE-R1]**<br>`DFG < 30` | — | — |
| 3 | Metformine | securite | À faire d'emblée — sécurité (cumul.) | 3 | **[PRE-R1]**<br>**[PRE-2]** | — | `DFG < 30` |
| 4 | Sulfamide (DFG < 30) | securite | À faire d'emblée — sécurité (cumul.) | 1 | **[PRE-R2]**<br>`DFG < 30` | — | — |
| 5 | iSGLT2 | securite | À faire d'emblée — sécurité (cumul.) | 1 | `intention != initier AND traitements_en_cours contient iSGLT2`<br>`cetonemie == true` | — | — |
| 6 | Insuline d'initiation | securite | À faire d'emblée — sécurité (cumul.) | 1 | `symptomes_glucotoxicite == true OR cetonemie == true` | **[PRE-3]** | — |
| 7 | iSGLT2 | geste | Le choix de l'agent (excl.) | `infections_uro_genitales_recidivantes==true → 6`<br>`insuffisance_cardiaque==true OR DFG<60 OR albuminurie!=normo → 2`<br>`ASCVD_etablie==true OR IMC>=30 → 3`<br>`default → 2` | **[PRE-4]** | `traitements_en_cours ne_contient_pas iSGLT2`<br>**[PRE-R3]** | `DFG < 20`<br>`cetonemie == true` |
| 8 | AR GLP‑1 | geste | Le choix de l'agent (excl.) | `preference_injection==refuse → 7`<br>`insuffisance_cardiaque==true OR DFG<60 OR albuminurie!=normo → 3`<br>`ASCVD_etablie==true OR IMC>=30 → 2`<br>`IMC<25 → 4`<br>`default → 2` | **[PRE-5]** | **[PRE-R4]**<br>**[PRE-R5]**<br>**[PRE-R3]** | `IMC < 22`<br>`denutrition == true`<br>`cetonemie == true` |
| 9 | Tirzépatide | geste | Le choix de l'agent (excl.) | `preference_injection==refuse → 7`<br>`default → 4` | `IMC >= 30` | **[PRE-R5]**<br>**[PRE-R4]**<br>**[PRE-R6]**<br>**[PRE-R3]** | `denutrition == true` |
| 10 | Association iSGLT2 + AR GLP‑1 | geste | Le choix de l'agent (excl.) | `preference_injection==refuse → 7`<br>`default → 4` | `insuffisance_cardiaque == true OR DFG < 60 OR albuminurie != normo`<br>`ASCVD_etablie == true OR IMC >= 30` | **[PRE-R6]**<br>`traitements_en_cours ne_contient_pas iSGLT2`<br>**[PRE-R4]**<br>**[PRE-R5]**<br>**[PRE-R3]** | `DFG < 20`<br>`cetonemie == true`<br>`IMC < 22`<br>`denutrition == true` |
| 11 | Envisager l'insuline | geste | Le choix de l'agent (excl.) | 6 | `cible_atteinte == false`<br>`isglt2_indisponible == true AND aglp1_indisponible == true` | **[PRE-3]** | — |
| 12 | Gliptine | geste | Traitement à corriger ou remplacer (cumul.) | 3 | `intention != initier AND traitements_en_cours contient gliptine` | **[PRE-R4]**<br>**[PRE-R5]** | `cetonemie == true` |
| 13 | Gliptine (redondante) | geste | Traitement à corriger ou remplacer (cumul.) | 3 | `intention != initier AND traitements_en_cours contient gliptine`<br>**[PRE-6]** | — | — |
| 14 | Sulfamide | geste | Traitement à corriger ou remplacer (cumul.) | 4 | **[PRE-R2]**<br>`hba1c_sous_cible == false` | — | `DFG < 30` |
| 15 | Glinide | geste | Traitement à corriger ou remplacer (cumul.) | 4 | `intention != initier AND traitements_en_cours contient glinide`<br>`hypoglycemie_recente == false`<br>`hba1c_sous_cible == false` | — | `isglt2_indisponible == true AND aglp1_indisponible == true` |
| 16 | Optimiser l'agent mal toléré | geste | Traitement à alléger (cumul.) | 2 | `intention != initier AND intolerance_traitement == true` | **[PRE-7]** | **[PRE-8]** |
| 17 | Désintensifier : alléger la charge thérapeutique | geste | Traitement à alléger (cumul.) | 1 | **[PRE-9]**<br>**[PRE-10]** | — | — |
| 18 | Insuline | geste | Traitement à alléger (cumul.) | 1 | **[PRE-11]**<br>**[PRE-12]** | — | — |
| 19 | AR GLP‑1 | geste | Traitement à alléger (cumul.) | 2 | `intention != initier AND traitements_en_cours contient aGLP1`<br>**[PRE-13]** | — | — |
| 20 | Tirzépatide | geste | Traitement à alléger (cumul.) | 2 | `intention != initier AND traitements_en_cours contient tirzepatide`<br>**[PRE-13]** | — | — |
| 21 | Sulfamide | geste | Traitement à alléger (cumul.) | 2 | **[PRE-R2]**<br>**[PRE-14]** | — | `DFG < 30` |
| 22 | Glinide | geste | Traitement à alléger (cumul.) | 2 | `intention != initier AND traitements_en_cours contient glinide`<br>**[PRE-14]** | — | — |
| 23 | Metformine (désintensification) | geste | Traitement à alléger (cumul.) | 3 | **[PRE-R1]**<br>`metformine_deprescriptible == true` | — | — |
| 24 | Reconsidérer un agent protecteur hors indication | geste | Traitement à alléger (cumul.) | 4 | **[PRE-15]** | — | — |
| 25 | Gliptine | geste | Le choix de l'agent (excl.) | `isglt2_indisponible==true AND aglp1_indisponible==true → 3`<br>`default → 5` | `isglt2_indisponible == true AND aglp1_indisponible == true OR palette_glycemique_ouverte == true`<br>`position_vs_cible != sous_objectif` | **[PRE-R6]**<br>**[PRE-R4]**<br>**[PRE-R5]** | `symptomes_glucotoxicite == true`<br>`cetonemie == true` |
| 26 | Sulfamide | geste | Le choix de l'agent (excl.) | `isglt2_indisponible==true AND aglp1_indisponible==true → 3`<br>`default → 5` | `isglt2_indisponible == true AND aglp1_indisponible == true OR palette_glycemique_ouverte == true`<br>`position_vs_cible != sous_objectif` | `traitements_en_cours ne_contient_pas sulfamide`<br>**[PRE-3]** | `DFG < 30`<br>`symptomes_glucotoxicite == true`<br>`cetonemie == true`<br>`fragilite == true` |
| 27 | Mesures hygiéno-diététiques seules — réévaluer | repli | Aucun geste — surveiller (cumul.) | non déclaré | `default` | `intention == initier`<br>`cible_atteinte == true` | — |
| 28 | Poursuivre le traitement en cours et réévaluer | repli | Aucun geste — surveiller (cumul.) | non déclaré | `default` | `intention != initier` | — |

**Expressions nommées — `prescription`** :

- **[PRE-1]** (338 car., option 1, `exclusions`) : `traitements_en_cours contient metformine AND DFG >= 45 AND DFG < 60 AND dose_metformine > 2000 OR traitements_en_cours contient metformine AND DFG >= 30 AND DFG < 45 AND dose_metformine > 1000 OR traitements_en_cours contient metformine AND intention != initier AND intolerance_traitement == true AND nature_intolerance contient digestive`
- **[PRE-2]** (203 car., option 3, `conditions`) : `DFG >= 45 AND DFG < 60 AND dose_metformine > 2000 OR DFG >= 30 AND DFG < 45 AND dose_metformine > 1000 OR intention != initier AND intolerance_traitement == true AND nature_intolerance contient digestive`
- **[PRE-3]** (109 car., **répétée à l'identique dans 3 options** — 6, 11, 26, en `prerequis`) : `traitements_en_cours ne_contient_pas insuline_basale AND traitements_en_cours ne_contient_pas insuline_rapide`
- **[PRE-4]** (173 car., option 7, `conditions`) : `insuffisance_cardiaque == true OR DFG < 60 OR albuminurie != normo OR ASCVD_etablie == true OR palette_glycemique_ouverte == true OR remplacement_agent_sans_benefice == true`
- **[PRE-5]** (168 car., option 8, `conditions`) : `ASCVD_etablie == true OR IMC >= 30 OR palette_glycemique_ouverte == true OR remplacement_agent_sans_benefice == true OR DFG > 0 AND DFG < 30 AND cible_atteinte == false`
- **[PRE-6]** (130 car., option 13, `conditions`) : `intention != initier AND traitements_en_cours contient aGLP1 OR intention != initier AND traitements_en_cours contient tirzepatide`
- **[PRE-7]** (613 car., option 16, `prerequis`, neuf classes) : `intention != initier AND traitements_en_cours contient metformine OR intention != initier AND traitements_en_cours contient iSGLT2 OR intention != initier AND traitements_en_cours contient aGLP1 OR intention != initier AND traitements_en_cours contient tirzepatide OR intention != initier AND traitements_en_cours contient sulfamide OR intention != initier AND traitements_en_cours contient gliptine OR intention != initier AND traitements_en_cours contient insuline_basale OR intention != initier AND traitements_en_cours contient insuline_rapide OR intention != initier AND traitements_en_cours contient glinide`
- **[PRE-8]** (452 car., option 16, `exclusions`) : `metformine_seule_en_cours == true AND traitements_en_cours contient metformine AND DFG >= 45 AND DFG < 60 AND dose_metformine > 2000 OR metformine_seule_en_cours == true AND traitements_en_cours contient metformine AND DFG >= 30 AND DFG < 45 AND dose_metformine > 1000 OR metformine_seule_en_cours == true AND traitements_en_cours contient metformine AND intention != initier AND intolerance_traitement == true AND nature_intolerance contient digestive`
- **[PRE-9]** (202 car., option 17, `conditions` item 1) : `hba1c_sous_cible == true OR hypoglycemie_recente == true AND terrain_cible_assouplie == true OR hypoglycemie_recente == true AND risque_hypoglycemie_schema == eleve OR position_vs_cible == sous_objectif`
- **[PRE-10]** (278 car., option 17, `conditions` item 2) : `intention != initier AND traitements_en_cours contient sulfamide OR intention != initier AND traitements_en_cours contient glinide OR intention != initier AND traitements_en_cours contient insuline_basale OR intention != initier AND traitements_en_cours contient insuline_rapide`
- **[PRE-11]** (144 car., option 18, `conditions` item 1) : `intention != initier AND traitements_en_cours contient insuline_basale OR intention != initier AND traitements_en_cours contient insuline_rapide`
- **[PRE-12]** (153 car., option 18, `conditions` item 2) : `hba1c_sous_cible == true OR hypoglycemie_recente == true OR intention != initier AND intolerance_traitement == true OR position_vs_cible == sous_objectif`
- **[PRE-13]** (223 car., **répétée à l'identique** — options 19 et 20, `conditions`) : `denutrition == true OR intention != initier AND intolerance_traitement == true AND nature_intolerance contient perte_poids OR intention != initier AND intolerance_traitement == true AND nature_intolerance contient digestive`
- **[PRE-14]** (125 car., **répétée à l'identique** — options 21 et 22, `conditions`) : `intention != initier AND intolerance_traitement == true OR hypoglycemie_recente == true OR position_vs_cible == sous_objectif`
- **[PRE-15]** (213 car., option 24, `conditions`) : `intention != initier AND traitements_en_cours contient iSGLT2 AND ASCVD_etablie == false AND insuffisance_cardiaque == false AND DFG >= 60 AND albuminurie == normo AND infections_uro_genitales_recidivantes == true`
- **[PRE-R1]** (68 car., répétée dans 3 options — 2, 3, 23) : `intention != initier AND traitements_en_cours contient metformine`
- **[PRE-R2]** (67 car., répétée dans 3 options — 4, 14, 21) : `intention != initier AND traitements_en_cours contient sulfamide`
- **[PRE-R3]** (60 car., répétée dans 4 options — 7, 8, 9, 10, toutes en `prerequis`) : `isglt2_indisponible == false OR aglp1_indisponible == false`
- **[PRE-R4]** (43 car., répétée dans 5 options — 8, 9, 10, 12, 25, toutes en `prerequis`) : `traitements_en_cours ne_contient_pas aGLP1`
- **[PRE-R5]** (49 car., répétée dans 5 options — 8, 9, 10, 12, 25, toutes en `prerequis`) : `traitements_en_cours ne_contient_pas tirzepatide`
- **[PRE-R6]** (46 car., répétée dans 3 options — 9, 10, 25, toutes en `prerequis`) : `traitements_en_cours ne_contient_pas gliptine`

**Intitulés dupliqués** (7 intitulés, portés par 16 des 28 options — cf. défaut ②) :

| Intitulé | Occurrences | # (role / famille / action) |
| --- | --- | --- |
| Metformine | 2 | 1 (socle / Socle du traitement / ajouter) · 3 (securite / À faire d'emblée — sécurité / réduire) |
| iSGLT2 | 2 | 5 (securite / À faire d'emblée — sécurité / arrêter) · 7 (geste / Le choix de l'agent / ajouter) |
| AR GLP‑1 | 2 | 8 (geste / Le choix de l'agent / ajouter) · 19 (geste / Traitement à alléger / réduire) |
| Tirzépatide | 2 | 9 (geste / Le choix de l'agent / ajouter) · 20 (geste / Traitement à alléger / réduire) |
| Gliptine | 2 | 12 (geste / Traitement à corriger ou remplacer / remplacer) · 25 (geste / Le choix de l'agent / ajouter, bas rang) |
| **Sulfamide** | **3** | 14 (geste / Traitement à corriger ou remplacer / remplacer) · 21 (geste / Traitement à alléger / réduire) · 26 (geste / Le choix de l'agent / ajouter, bas rang) |
| Glinide | 2 | 15 (geste / Traitement à corriger ou remplacer / remplacer) · 22 (geste / Traitement à alléger / réduire) |

---

### `rhd-activite-physique` — Activité physique — se rapprocher de la régularité

`selection: multi-options` · 13 options.

`Noeud.familles[]` (ordre déclaré = ordre d'affichage) — les 6 familles sont **cumul.**, aucune ne
porte `prioritaire_si` :

Déplacements actifs · Rupture de sédentarité · Activité quotidienne · Pratique structurée · Orientation
vers une ressource · Maintien.

| # | intitulé | role | famille | rang | conditions | prerequis | exclusions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Remplacer un trajet motorisé par la marche ou le vélo, une à deux fois par semaine | geste | Déplacements actifs (cumul.) | 5 | `mode_deplacement_courts_trajets == motorise_ou_assis` | — | — |
| 2 | Pour les courses, préférer plusieurs petits déplacements actifs à un grand trajet motorisé | geste | Déplacements actifs (cumul.) | 5 | `mode_deplacement_courts_trajets == motorise_ou_assis` | — | — |
| 3 | Se lever et bouger quelques minutes à chaque heure de position assise prolongée | geste | Rupture de sédentarité (cumul.) | 2 | **[RHDA-1]** | — | — |
| 4 | S'appuyer sur un repère du quotidien pour penser à se lever | geste | Rupture de sédentarité (cumul.) | 3 | **[RHDA-1]** | — | — |
| 5 | Transformer une pause déjà prise dans la journée en occasion de bouger quelques instants | geste | Rupture de sédentarité (cumul.) | 3 | **[RHDA-1]** | — | — |
| 6 | Intégrer du mouvement dans les tâches déjà présentes dans la journée | geste | Activité quotidienne (cumul.) | 2 | **[RHDA-2]** | — | — |
| 7 | Répartir l'activité en plusieurs séances courtes dans la journée plutôt qu'une seule longue | geste | Activité quotidienne (cumul.) | 3 | `duree_seance == moins_10_min AND frequence_activite_structuree != jamais` | — | — |
| 8 | Suivre son nombre de pas et chercher à en faire un peu plus que la semaine précédente | geste | Activité quotidienne (cumul.) | 2 | **[RHDA-2]** | — | — |
| 9 | Envisager un programme d'activité physique adaptée (endurance et renforcement), avec l'accompagnement d'un professionnel | geste | Pratique structurée (cumul.) | 4 | **[RHDA-2]** | — | **[RHDA-3]** |
| 10 | Maintenir la pratique actuelle ; envisager de diversifier | geste | Pratique structurée (cumul.) | 1 | **[RHDA-4]** | — | — |
| 11 | Orienter vers une structure d'activité physique adaptée pour un bilan et un accompagnement progressif | geste | Orientation vers une ressource (cumul.) | `limitation_physique_connue==true → 1`<br>`default → 5` | **[RHDA-5]** | — | — |
| 12 | Proposer un bilan avec un enseignant en activité physique adaptée avant toute reprise | geste | Orientation vers une ressource (cumul.) | 2 | `experience_activite_negative == true` | — | — |
| 13 | Poursuivre les habitudes actuelles et rester attentif à la régularité | geste | Maintien (cumul.) | non déclaré | `frequence_activite_structuree == deux_a_trois_fois_semaine AND rupture_sedentarite_habituelle == true` | — | — |

**Expressions nommées — `rhd-activite-physique`** :

- **[RHDA-1]** (119 car., **répétée à l'identique** — options 3, 4, 5, `conditions`) : `temps_assis_quotidien == quatre_a_huit_h OR temps_assis_quotidien == plus_8h OR rupture_sedentarite_habituelle == false`
- **[RHDA-2]** (92 car., **répétée à l'identique dans 3 options** — 6, 8, 9, `conditions`) : `frequence_activite_structuree == jamais OR frequence_activite_structuree == une_fois_semaine`
- **[RHDA-3]** (176 car., option 9, `exclusions`) : `limitation_physique_connue == true OR symptomes_ischemie_effort == true OR retinopathie_non_stabilisee_ou_proliferante == true OR neuropathie_ou_mal_perforant_plantaire == true` — **textuellement identique à la définition du critère dérivé `verrou_effort` de ce nœud** (cf. défaut ⑨).
- **[RHDA-4]** (103 car., option 10, `conditions`) : `frequence_activite_structuree == quatre_fois_ou_plus_semaine AND rupture_sedentarite_habituelle == true`
- **[RHDA-5]** (106 car., option 11, `conditions`) : `limitation_physique_connue == true OR difficulte_acces_activite == true OR offre_proximite_connue == false`

Aucune option de ce nœud ne porte `role: repli` ni `conditions: ["default"]` (défaut ⑦, cf. § 4).

---

### `rhd-alimentation` — Alimentation — se rapprocher du repère méditerranéen

`selection: multi-options` · 16 options.

`Noeud.familles[]` (ordre déclaré = ordre d'affichage) — les 10 familles sont **cumul.**, aucune ne
porte `prioritaire_si` :

Boissons · Ultratransformés · Restauration rapide · Matières grasses · Viande et charcuterie · Fruits à
coque, légumineuses, poisson · Structure des repas · Portions · Orientation · Maintien.

| # | intitulé | role | famille | rang | conditions | prerequis | exclusions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Remplacer une boisson sucrée du quotidien par de l'eau | geste | Boissons (cumul.) | 3 | `frequence_boissons_sucrees == frequent OR frequence_boissons_sucrees == quotidien` | — | — |
| 2 | Ne pas remplacer une boisson sucrée par des édulcorants intenses | geste | Boissons (cumul.) | 5 | `frequence_boissons_sucrees == frequent OR frequence_boissons_sucrees == quotidien` | — | — |
| 3 | Un repas simple fait maison de plus par semaine | geste | Ultratransformés (cumul.) | 4 | `frequence_ultratransformes == frequent OR frequence_ultratransformes == quotidien` | — | — |
| 4 | En restauration rapide, choisir mieux plutôt que s'interdire d'y aller | geste | Restauration rapide (cumul.) | 4 | `frequence_restauration_rapide == frequent OR frequence_restauration_rapide == quotidien` | — | — |
| 5 | Utiliser de l'huile d'olive pour la cuisson et l'assaisonnement, à la place du beurre | geste | Matières grasses (cumul.) | 1 | `matiere_grasse_cuisson == beurre_graisses_animales OR matiere_grasse_cuisson == melange` | — | — |
| 6 | Réduire la charcuterie et la viande rouge | geste | Viande et charcuterie (cumul.) | 4 | `frequence_viande_rouge_charcuterie == regulier OR frequence_viande_rouge_charcuterie == quotidien` | — | `fragilite == true` |
| 7 | Ajouter une petite poignée de fruits à coque non salés, plusieurs fois par semaine | geste | Fruits à coque, légumineuses, poisson (cumul.) | 1 | `frequence_fruits_a_coque == jamais OR frequence_fruits_a_coque == occasionnel` | — | — |
| 8 | Ajouter un plat de légumineuses de plus par semaine | geste | Fruits à coque, légumineuses, poisson (cumul.) | 3 | `frequence_legumineuses == jamais OR frequence_legumineuses == occasionnel` | — | — |
| 9 | Ajouter un repas de poisson de plus par semaine, en alternant gras et maigre | geste | Fruits à coque, légumineuses, poisson (cumul.) | 3 | `frequence_poisson == jamais OR frequence_poisson == occasionnel` | — | — |
| 10 | Se fixer des repas à des horaires à peu près réguliers | geste | Structure des repas (cumul.) | 4 | `regularite_repas == irreguliers` | — | — |
| 11 | Manger sans se presser | geste | Structure des repas (cumul.) | 5 | `alimentation_emotionnelle == frequent` | — | — |
| 12 | Repérer un moment de grignotage récurrent et lui trouver une alternative | geste | Structure des repas (cumul.) | 4 | `frequence_grignotage == frequent OR frequence_grignotage == quotidien` | — | *(`exclusions: []` déclaré — liste vide, inerte)* |
| 13 | Se repérer aux proportions dans l'assiette plutôt qu'aux quantités pesées | geste | Portions (cumul.) | 6 | `difficulte_estimation_portions == difficile OR difficulte_estimation_portions == ne_sait_pas` | — | `fragilite == true` |
| 14 | Orienter vers le diététicien de la structure | geste | Orientation (cumul.) | `signes_appel_tca==true → 1`<br>`fragilite==true → 1`<br>`default → 6` | `acces_alimentation == difficultes_importantes OR signes_appel_tca == true OR fragilite == true` | — | — |
| 15 | Proposer aussi un avis spécialisé en trouble du comportement alimentaire | geste | Orientation (cumul.) | 1 | `signes_appel_tca == true` | — | — |
| 16 | Continuer ce qui fonctionne déjà | geste | Maintien (cumul.) | non déclaré | `matiere_grasse_cuisson == huile_olive_ou_colza AND frequence_fruits_a_coque == regulier` | — | — |

Aucune expression >100 caractères ; le seul couple répété à l'identique (`frequence_boissons_sucrees
== frequent OR frequence_boissons_sucrees == quotidien`, options 1 et 2) ne l'est que 2 fois — sous le
seuil de 3 occurrences retenu pour un bloc nommé (§ 1) : recopié en clair, pas de bloc pour ce nœud.

Aucune option de ce nœud ne porte `role: repli` ni `conditions: ["default"]` (défaut ⑦, cf. § 4) — un
commentaire du fichier source (l. 616-625) explique explicitement ce choix : un repli n'aurait de chance
réelle de se déclencher que si les 13 autres axes de recueil sont tous simultanément favorables.

---

### `statine` — Évaluer l'indication d'une statine dans le DT2

`selection: ordered-first-match` · pas de `Noeud.familles[]` déclarée · 8 options.

| # | intitulé | role | famille | rang | conditions | prerequis | exclusions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Interrompre la statine 4 à 6 semaines et réévaluer | securite | — | ignoré (OFM) | **[STA-1]** | — | — |
| 2 | Arrêter la statine — suspicion de rhabdomyolyse, avis spécialisé urgent | securite | — | ignoré (OFM) | `intolerance_statine == rapportee AND CK_x_normale > 50 AND statine_deja_en_place == true` | — | — |
| 3 | Interrompre la statine — la classe reste indisponible | securite | — | ignoré (OFM) | `intolerance_statine == averee AND CK_x_normale > 5 AND statine_deja_en_place == true` | — | — |
| 4 | Débuter la statine à dose plus faible | geste | — | ignoré (OFM) | **[STA-2]** | — | — |
| 5 | Statine de haute intensité — prévention secondaire | geste | — | ignoré (OFM) | `ASCVD_etablie == true` | — | `dialyse == true AND statine_deja_en_place == false`<br>`intolerance_statine == averee`<br>`intolerance_statine != non AND CK_x_normale > 5 AND statine_deja_en_place == false` |
| 6 | Discuter la statine | geste | — | ignoré (OFM) | `anciennete_diabete_annees < 10`<br>`autres_FDRCV == 0`<br>`diabete_complique == false` | — | `intolerance_statine == averee`<br>`intolerance_statine != non AND CK_x_normale > 5 AND statine_deja_en_place == false` |
| 7 | Statine indisponible | securite | — | ignoré (OFM) | **[STA-3]** | — | — |
| 8 | Statine — prévention primaire | repli | — | ignoré (OFM) | `default` | — | — |

**Expressions nommées — `statine`** :

- **[STA-1]** (110 car., option 1, `conditions`) : `intolerance_statine == rapportee AND CK_x_normale > 5 AND CK_x_normale <= 50 AND statine_deja_en_place == true`
- **[STA-2]** (110 car., option 4, `conditions`) : `intolerance_statine == rapportee AND CK_x_normale > 4 AND CK_x_normale <= 5 AND statine_deja_en_place == false`
- **[STA-3]** (115 car., option 7, `conditions`) : `intolerance_statine == averee OR intolerance_statine != non AND CK_x_normale > 5 AND statine_deja_en_place == false`

L'expression `intolerance_statine != non AND CK_x_normale > 5 AND statine_deja_en_place == false`
(83 car.) est répétée à l'identique dans les `exclusions` des options 5 et 6 — 2 occurrences seulement,
sous le seuil de 3 : recopiée en clair dans les deux cellules plutôt qu'abrégée. Aucune des 8 options ne
déclare de `famille` (le nœud ne déclare aucun `Noeud.familles[]`) ni de `prerequis`.

---

## 3. Inventaire des paires co-actives

Repris du snapshot produit en P14/S1 (T-160) — **non recalculé ici**. Source :
`src/features/decision/engine/banc/__snapshots__/paires.<id>.txt`, un fichier par nœud, agrégé sur les
**180 profils figés** du banc (`fixtureProfils.ts`, profil #0 = vierge). Un diff de ces fichiers n'est
**pas** une régression en soi (même convention que `caracterisation.test.ts`) : il doit être relu carte
par carte.

| Nœud | Profils évalués | Paires distinctes | dont intra-famille | Fichier |
| --- | --- | --- | --- | --- |
| `cible-glycemique` | 180 | 0 | 0 | `paires.cible-glycemique.txt` |
| `insuline` | 180 | 32 | 7 | `paires.insuline.txt` |
| `prescription` | 180 | 116 | 43 | `paires.prescription.txt` |
| `rhd-activite-physique` | 180 | 69 | 8 | `paires.rhd-activite-physique.txt` |
| `rhd-alimentation` | 180 | 118 | 8 | `paires.rhd-alimentation.txt` |
| `statine` | 180 | 0 | 0 | `paires.statine.txt` |

`cible-glycemique` et `statine` sont à 0 paire par construction (`ordered-first-match` : une seule
carte peut sortir par patient).

**Paires remarquables** (liées aux défauts numérotés au § 4 — liste non exhaustive, cf. les fichiers
pour le détail complet) :

- `insuline` : `2×  Ne pas sur-titrer la basale — intensifier autrement  ⟷  Titrer la basale (augmenter
  la dose)` — la paire qui a motivé le défaut ①.
- `insuline`, section « paires intra-famille » : la famille « Instaurer l'insuline » (déclarée
  **cumul.**) montre 3 paires internes, dont `31×  Choisir un analogue basal de 2ᵉ génération  ⟷
  Initier une insuline basale` et `21×  Envisager un GLP-1 avant ou avec l'insuline  ⟷  Initier une
  insuline basale` — la famille rend visibles, à haute fréquence, des cartes que le défaut ③ décrit
  comme des alternatives présentées comme cumulables.
- `prescription` : l'inventaire des paires ne contient **aucune** paire entre deux cartes de même
  intitulé (par construction — cf. § 2 de `paires.test.ts`, une paire relie deux intitulés
  **différents**) ; la coexistence de deux cartes « Sulfamide » ou deux cartes « Glinide » (défaut ②)
  est portée par l'invariant **T-161**, distinct de l'inventaire T-160 : 9 des 180 profils affichent
  deux cartes « Sulfamide » simultanément, 1 profil deux cartes « Glinide ».

---

## 4. Ce que la table a mis au jour

Neuf défauts, numérotés comme dans `plans/P14/index.md` (§ « Ce que chaque défaut devient »). Pour
chacun : le fait, le profil qui le reproduit (quand il en existe un), la session qui le traite. **Aucun
correctif n'est rédigé ici** — cf. `plans/P14/index.md` pour le traitement.

**① — `insuline` : « Ne pas sur-titrer la basale » et « Titrer la basale » co-actives**
- Fait : 2 des 180 profils figés affichent les deux cartes ensemble (`paires.insuline.txt`).
- Profil : patient en basale seule, sans capteur (MCG), HbA1c au-dessus de l'objectif, glycémie à jeun haute.
- Session : S4 (T-167).

**② — `prescription` : deux cartes de même intitulé, actions opposées**
- Fait : sur les 7 intitulés dupliqués du nœud (Sulfamide ×3 ; Metformine, iSGLT2, AR GLP‑1,
  Tirzépatide, Gliptine, Glinide ×2 chacun), 9 des 180 profils affichent deux cartes « Sulfamide »
  simultanément, 1 profil deux cartes « Glinide » (invariant T-161) — la coexistence rend l'homonymie
  fautive, alors que le nœud sait par ailleurs désambiguïser (« Metformine (DFG < 30) »).
- Profil : tout profil du banc où une carte « Sulfamide » de la famille « Traitement à corriger ou
  remplacer » et une carte « Sulfamide » d'une autre famille (« Traitement à alléger » ou « Le choix de
  l'agent ») sont applicables ensemble.
- Session : S6 (fond + titres) + S8/T-171 (titres restants).

**③ — `insuline` : alternatives présentées comme « gestes cumulables »**
- Fait : les 7 familles du nœud sont toutes déclarées `exclusive: false` ; la famille « Instaurer
  l'insuline » (initiation basale / GLP-1 avant insuline / analogue 2ᵉ génération) badge « recommandée »
  sur tout ce qui s'affiche alors que ce sont des voies alternatives.
- Profil : patient naïf d'insuline, cible non atteinte (profil retenu pour la vérification N1 de S5 :
  « basale + 1 bolus, cible non atteinte »).
- Session : S5 (T-168).

**④ — `cible_atteinte` : deux définitions sous un même nom**
- Fait : `insuline.cible_atteinte` = `HbA1c_actuelle <= HbA1c_cible` (calculé) ;
  `prescription.cible_atteinte` = `position_vs_cible == a_l_objectif OR sous_objectif` (déclaré) — deux
  dérivés locaux, invisibles à I19/I32 qui ne couvrent que les critères `partage: true`.
- Profil : patient à HbA1c 7,4 % pour une cible à 7 % — « non atteinte » côté `insuline`, potentiellement
  « atteinte » côté `prescription` selon la position déclarée par le praticien.
- Session : S11 (fond — `position_vs_cible` devient la définition unique) + S2 (garde, invariant T-162).

**⑤ — `presomption_non` asymétrique entre nœuds**
- Fait : `traitements_en_cours` porte `presomption_non: true` dans `insuline` mais pas dans
  `prescription` — asymétrie **correcte aujourd'hui** (dans `prescription` il alimente des `conditions`
  de cartes `role: securite` et une `exclusions`, ce que D30 interdit de présumer ; dans `insuline` il ne
  vit que dans des `prerequis`, des alertes et une contrainte), mais **non vérifiée mécaniquement**.
- Profil : aucun — ce n'est pas un cas actuellement faux, c'est un risque structurel (le jour où une
  carte de sécurité lira un critère présumé faux, rien ne le signalera).
- Session : S2 (T-165, mécanise D30).

**⑥ — `terrain_cible_assouplie` : deux écritures**
- Fait : `insuline` écrit `fragilite OR esperance_vie == limitee OR age >= 75` ; `prescription` écrit
  `age >= 75 OR fragilite == true OR esperance_vie == limitee` — logiquement équivalentes, textuellement
  différentes (dette I4).
- Profil : aucun — les deux écritures produisent le même verdict pour tout patient ; c'est l'invariant
  T-162 (comparaison **littérale**) qui détecte l'écart de texte, pas un profil.
- Session : S8 (T-173).

**⑦ — RHD sans repli**
- Fait : ni `rhd-activite-physique` ni `rhd-alimentation` ne déclarent d'option `role: repli` /
  `conditions: ["default"]` (confirmé § 2 ci-dessus) — le plancher actuel repose sur des cartes
  « maintien » à déclencheurs faits main, couverture complète « par arithmétique des énums », pas par
  construction (violation latente de R10).
- Profil : aucun aujourd'hui (couverture complète par les valeurs d'énum actuelles) — le trou s'ouvrirait
  au premier ajout d'une valeur à `frequence_activite_structuree` ou `matiere_grasse_cuisson`.
- Session : S7 (T-170).

**⑧ — `prescription` : trou dans la couverture des replis (R10)**
- Fait : les deux replis (options 27 et 28) sont gardés par `intention == initier AND cible_atteinte ==
  true` et `intention != initier` — le produit croisé laisse le cas `initier` + cible **non** atteinte
  sans plancher dédié.
- Profil : patient `initier`, DFG 25 — le socle metformine (option 1, sentinelle `toujours`) est exclu
  par sa propre exclusion `DFG < 30`, et la sortie ne survit que grâce à iSGLT2/AR GLP-1 s'ils sont
  applicables.
- Session : S8 (T-177).

**⑨ — `verrou_effort` déclaré sans lecteur**
- Fait : le critère dérivé `verrou_effort` de `rhd-activite-physique` (`limitation_physique_connue OR
  symptomes_ischemie_effort OR retinopathie_non_stabilisee_ou_proliferante OR
  neuropathie_ou_mal_perforant_plantaire`) n'est cité par aucune `conditions`/`prerequis`/`exclusions`/
  `alertes` du nœud ; l'option 9 (« Envisager un programme d'APA ») réécrit ses quatre termes en clair
  dans ses propres `exclusions` (**[RHDA-3]**, § 2 — texte identique) plutôt que de le lire.
- Profil : aucun — le remplacement est sémantiquement neutre, aucune sortie ne change ; c'est un doublon
  de logique (violation de R5), pas une divergence de comportement.
- Session : S8 (T-172) + S2 (T-164, mécanise R5).

---

## 5. Pourquoi les tests ne l'avaient pas vu

Le cœur du diagnostic : aucune des quatre couches de vérification existantes n'a **la paire** — la
relation entre deux cartes — pour unité.

| Couche | Ce qu'elle vérifie | Unité de vérification | Pourquoi elle ne voit pas une paire |
| --- | --- | --- | --- |
| **Vignettes** (`evaluateNode.<noeud>.test.ts`) | Sortie exacte attendue pour un patient réel, rédigée par le référent | **un profil** : un patient, une attente écrite à la main | Peu nombreuses par construction — « choisies pour ce qu'elles seules peuvent dire » (`docs/decision/GRAMMAIRE-NOEUD.md`) — elles ne balaient pas systématiquement l'espace des profils : une paire que personne n'a anticipée en écrivant la vignette n'est simplement jamais posée en question. |
| **Invariants** (couches « couverture » + « invariants » du banc, `engine/banc/*.test.ts`) | Une propriété vraie pour *tout* profil d'un échantillon déterministe (~800 à 2000 profils/nœud) | **une propriété nommée** (ex. « jamais gliptine et AR GLP‑1 proposés ensemble », « jamais de sortie vide ») | Chaque propriété est écrite à la main par quelqu'un qui a identifié LA relation à surveiller — ce mécanisme vérifie des paires **pensées à l'avance**, il ne les **découvre** pas. Une paire que personne n'a nommée n'a pas d'invariant qui la couvre. |
| **Recette** (`docs/decision/validation/recette-*.md`) | Parcours d'écran par une persona (référent ou praticien naïf) : DOM, console, comportement d'affichage | **un écran, une session de navigation** | Vérifie le mécanisme (accordéon, `aria-expanded`, sections conditionnelles) et la plausibilité clinique de ce qui apparaît pour les quelques profils cliqués — pas une revue systématique de toutes les combinaisons de cartes possibles. |
| **Golden master** (`caracterisation.test.ts` + `__snapshots__/caracterisation.<id>.txt`) | Fige, sans jamais juger, la sortie complète (toutes les options `applicable`) pour 180 profils figés | **un profil → sa liste complète d'options** | C'est ici que l'information existait déjà : `caracterisation.prescription.txt` (924 Ko) et `caracterisation.insuline.txt` (620 Ko) contenaient, pour chaque profil, les cartes co-actives. Mais l'unité du fichier reste LE PROFIL, jamais LA PAIRE — personne n'agrégeait, à travers les 180 profils, quelles paires d'intitulés reviennent et combien de fois. **Un fichier de 900 Ko ne se relit pas** pour y voir un motif transversal. |

Les faits étaient donc **déjà dans le dépôt**, au bon endroit (le golden master), mais dans une forme
qui ne permettait à personne de les lire : l'agrégation manquait. C'est exactement ce que P14/S1
(T-160/T-161) a ajouté — l'inventaire des paires co-actives (§ 3 ci-dessus) — et ce que ce document
verse en documentation lisible, pour que la leçon ne soit pas repayée par le prochain domaine
(`docs/decision/CONSTRUIRE-UN-MODULE.md`, porte de sortie P6).

---

## 6. Contrôle de fidélité

Effectué en fin de session : régénération indépendante, depuis les YAML, de 2 tables prises au hasard
parmi les 6 ci-dessus, comparées au document publié. Détail et résultat consignés dans le bilan de
session, en bas de `plans/P14/S3.md`.
