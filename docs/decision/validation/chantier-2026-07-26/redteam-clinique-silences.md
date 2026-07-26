# Red-team clinique — angle SILENCE ET OMISSION (module DT2, 5 nœuds)

Date : 2026-07-26. Périmètre : `prescription`, `insuline`, `statine`, `cible-glycemique`, `rhd`
(`content/noeuds/diabete-type-2/*.yaml`). Contexte : le banc de profils (`engine/banc/profils.ts`)
vient d'être corrigé (bornes `min`/`max` sur les critères numériques, commit `aa51a6e`) — c'est la
première fois qu'il engendre des patients plausibles. Ce document cherche exclusivement le **silence**
(patient sans réponse, réponse incomplète, critère qui n'agit pas là où il devrait) — pas les gestes
dangereux (angle traité en parallèle par un autre red-team).

**Lecture seule.** Aucun contenu, test ni code modifié. Un script temporaire
(`src/features/decision/engine/banc/__redteam_silence_temp__.test.ts`) a servi à l'exploration ; il
est supprimé après la remise de ce rapport (cf. dernière section).

## Méthode

Pour chaque nœud : `genererProfils(node, tailleBanc(node))` (profils COMPLETS, réalistes, à graine
fixe) puis `evaluateNode`/`construireVueDecision` sur chaque profil. Trois familles de test :

1. filtrage ciblé sur un schéma clinique précis (ex. « sur-traitement déclaré + agent hypoglycémiant
   seul ») puis vérification que le geste attendu est bien présent dans `applicable`/`familles` ;
2. balayage large d'une famille de sortie (« Agent à ajouter » jamais vide quand une indication
   d'organe est réunie ») sur tout l'échantillon réaliste ;
3. lecture directe du contenu YAML (`grep` sur le nom d'un critère) pour vérifier, indépendamment du
   moteur, que la règle attendue existe ou non — c'est cette lecture qui a confirmé chaque finding
   HAUTE, les comptages sur le banc n'étant qu'une illustration chiffrée.

**Limite méthodologique constatée en cours de route (F7 ci-dessous) : `genererProfils` garantit le
domaine PAR CHAMP (post-correctif 2026-07-26) mais ne garantit AUCUNE cohérence CROISÉE entre deux
champs liés** (ex. `position_vs_cible == nettement_au_dessus` avec `HbA1c_actuelle = 4 %`,
`situation_insuline == naif` avec `traitements_en_cours` contenant de l'insuline). Un premier balayage
brut (« intention d'escalade + famille "Agent à ajouter" vide » → 314/448) s'est révélé, à l'examen,
majoritairement composé de tels profils incohérents ou de cas structurellement corrects (initiation +
`au_dessus` sans `nettement_au_dessus` = monothérapie voulue, HAS). Il n'est **pas repris** comme
finding : chaque finding retenu ci-dessous a été revérifié sur un profil interne cohérent ET confirmé
par lecture du YAML, pas seulement par un comptage brut.

---

## Décompte

| sévérité | nombre |
|---|---|
| HAUTE | 4 |
| MOYENNE | 1 |
| BASSE | 2 |
| **Total** | **7** |

---

## HAUTE — F1. `prescription` : le sur-traitement DÉCLARÉ (`position_vs_cible == sous_objectif`) ne pilote aucun allègement de l'insuline ou du glinide seuls

**Le profil exact** (issu du banc, `genererProfils('prescription', 1520)`, profil réel du banc) :

```json
{
  "intention": "optimiser", "HbA1c_actuelle": 6.5, "position_vs_cible": "sous_objectif",
  "ASCVD_etablie": true, "DFG": 46, "albuminurie": "micro", "IMC": 23,
  "fragilite": false, "hypoglycemie_recente": false,
  "traitements_en_cours": ["metformine", "insuline"],
  "hba1c_sous_cible": false
}
```

Le praticien a **déclaré explicitement** que ce patient est sous son objectif individualisé
(`position_vs_cible == sous_objectif`, le critère R1 conçu précisément pour capter le sur-traitement
sans dépendre d'un seuil absolu). Le patient est sous insuline seule, non fragile, sans hypoglycémie
récente ; son HbA1c actuelle (6,5 %) n'est pas sous le seuil absolu de 6,5 % (`hba1c_sous_cible ==
false` — la comparaison est stricte `< 6.5`).

**Sortie observée** : `applicable` = « Metformine — instaurer ou poursuivre » + « Introduire un iSGLT2
(protection cardio-rénale et/ou contrôle glycémique) ». Aucune mention de l'insuline. Aucune option
dans la famille « Traitement à alléger ».

**Ce qui aurait dû être proposé, et sur quelle base.** Un geste d'allègement de l'insuline (réduction
de dose, désintensification) — exactement le geste que `docs/decision/GRAMMAIRE-NOEUD.md` (§ « R1 »)
décrit comme l'apport spécifique de `position_vs_cible` : *« le sur-traitement n'était détecté que par
le garde-fou absolu `hba1c_sous_cible` […] `sous_objectif` le capte ici »*. C'est vrai pour la
metformine (`metformine_deprescriptible`, ligne 249) mais **faux pour l'insuline et le glinide**. C'est
aussi le défaut exact remonté par le référent en capture 6 de la recette du 2026-07-25
(`docs/decision/validation/recette-2026-07-25-prescription-intensifier.md`, « Déprescrire » +
sous-objectif → l'outil propose un AJOUT, pas de retrait) : le correctif appliqué depuis (alerte de
cohérence + `metformine_deprescriptible`) n'a couvert **qu'un seul agent parmi quatre**
(metformine ; ni insuline, ni sulfamide seul en l'absence de comorbidité, ni glinide).

**La règle en cause** (lecture directe, confirmée par `grep position_vs_cible` sur tout le fichier —
zéro occurrence dans les trois blocs ci-dessous) :

- `content/noeuds/diabete-type-2/prescription.yaml:662-665` — « Désintensifier… » :
  `conditions: ["hba1c_sous_cible == true OR hypoglycemie_recente == true AND terrain_fragile ==
  true", "traitements_en_cours contient sulfamide OR … glinide OR … insuline"]` — jamais
  `position_vs_cible`.
- `prescription.yaml:680-683` — « Réduire la posologie de l'insuline » :
  `conditions: ["traitements_en_cours contient insuline", "hba1c_sous_cible == true OR
  hypoglycemie_recente == true OR intolerance_traitement == true"]` — jamais `position_vs_cible`.
- `prescription.yaml:716-719` — « Réduire la posologie du sulfamide / du glinide » : même schéma,
  jamais `position_vs_cible`.

À l'inverse, `metformine_deprescriptible` (`prescription.yaml:249`) référence bien
`position_vs_cible == sous_objectif` — c'est la SEULE des quatre voies d'allègement à le faire, et
elle exige EN PLUS `fragilite == true`, ce que ce profil ne satisfait pas.

**Quantification sur le banc réaliste.** Parmi les profils `sous_objectif`, non fragiles, sans
hypoglycémie récente, HbA1c ≥ 6,5 % et sous **insuline seule** (sans sulfamide ni glinide) :
**7 / 14** ne reçoivent AUCUNE option d'allègement de l'insuline. Sur le même schéma avec **glinide
seul** (hors cétonémie/glucotoxicité pour isoler le cas pur) : 1/2 — échantillon trop petit pour
peser, mais la lecture du code (ci-dessus) est catégorique et indépendante du tirage.

**Correction suggérée.** Ajouter `OR position_vs_cible == sous_objectif` au premier `conditions` des
trois options citées (comme cela a été fait pour `metformine_deprescriptible`), sans exiger la
fragilité pour l'insuline/le glinide/le sulfamide isolé — la fragilité n'est une condition
supplémentaire que pour la metformine (dernier agent réputé « sûr » à garder). Revérifier ensuite que
l'invariant 7 du banc (aucun agent purement glycémique ajouté si `sous_objectif`) et ce nouveau
comportement (retrait autorisé si `sous_objectif`) ne se contredisent pas — ils ne devraient pas,
puisque l'un porte sur l'AJOUT et l'autre sur le RETRAIT.

---

## HAUTE — F2. `insuline`, situation « basale_plus_bolus » : silence total une fois le régime maximal atteint, malgré une cible non atteinte

**Le profil exact** (banc réaliste, situation `basale_plus_bolus`) :

```json
{
  "situation_insuline": "basale_plus_bolus", "age": 75, "HbA1c_actuelle": 4, "HbA1c_cible": 8.12,
  "fragilite": false, "esperance_vie": "longue",
  "traitements_en_cours": ["metformine", "sulfamide", "insuline_basale", "insuline_rapide"],
  "cible_atteinte": true
}
```
(profil illustratif proche — voir aussi, pour `cible_atteinte == false`, tout profil
`basale_plus_bolus` où `traitements_en_cours` contient déjà un GLP-1/tirzépatide **et** de
l'insuline rapide, ex. un patient déjà sous metformine + aGLP1 + insuline basale + insuline rapide,
HbA1c 9 % pour une cible à 7 %, sans hypoglycémie).

**Sortie observée** : `applicable` = « Poursuivre le schéma d'insuline en cours et réévaluer »
(le seul repli du nœud), quel que soit le contrôle glycémique.

**Ce qui aurait dû être proposé, et sur quelle base.** La situation « basale_plus_bolus »
(SITUATION 3, basal + un bolus) ne porte que DEUX options d'escalade — « Ajouter un GLP-1… » et
« Ajouter un bolus… » — chacune gardée par un `prerequis` qui l'annule dès que la classe visée est
déjà en place. Une fois les deux gestes faits (GLP-1/tirzépatide en place ET bolus en place), **il
n'existe aucune troisième option** pour cette situation : ni titration de dose (contrairement à
« Titrer la basale » en situation « basale seule »), ni option d'optimisation des doses
(contrairement à « Optimiser la répartition du basal-bolus » en situation « basal_bolus », qui existe
justement pour ce cas). Un patient sur ce palier, cible non atteinte, se retrouve donc dans un
angle mort du nœud : le régime « intermédiaire » (3 situations sur 4 en ont une option de suivi/
titration propre à la situation ; celle-ci n'en a aucune une fois ses deux gestes d'ajout épuisés).

**La règle en cause** : `content/noeuds/diabete-type-2/insuline.yaml` — options de la situation 3,
lignes 369-412 (« Ajouter un GLP-1… », « Ajouter un bolus… »), et lignes 413-423 (« Insuline
prémélangée », gardée par `preference_injection == refuse`, seule alternative si le patient refuse
les injections). Aucune quatrième option couvrant « les deux gestes précédents sont déjà faits, la
cible n'est toujours pas atteinte » — à comparer à la situation 4 (`basal_bolus`, ligne 447), qui a
précisément une option pour ce cas (« Optimiser la répartition »).

**Quantification** : parmi les profils du banc en situation `basale_plus_bolus`, `cible_atteinte ==
false`, avec un GLP-1/tirzépatide ET une insuline rapide déjà en place (les deux gestes d'ajout
épuisés) : **60 / 92 (65 %)** réduits au seul repli « Poursuivre… ».

**Correction suggérée.** Ajouter à la situation `basale_plus_bolus` une option de repli active de type
« optimiser les doses actuelles / envisager le passage à un basal-bolus complet », symétrique de
l'option déjà écrite pour `basal_bolus` — ou, plus simplement, élargir les conditions de « Optimiser la
répartition du basal-bolus » (situation 4) pour qu'elle couvre aussi `basale_plus_bolus` quand les deux
options d'ajout sont épuisées (le calcul `dose_basale_actuelle + dose_rapide_actuelle` fonctionne déjà
pour ce cas).

---

## HAUTE — F3. `insuline`, situation « basale_plus_bolus » : aucune option de sécurité contre une hypoglycémie documentée — structurel, 100 % de l'échantillon

**Le profil exact** :

```json
{
  "situation_insuline": "basale_plus_bolus", "age": 105, "HbA1c_actuelle": 6.86, "HbA1c_cible": 6,
  "fragilite": false, "hypo_severe_recurrente": true,
  "TBR": 1, "TBR_severe": 0,
  "traitements_en_cours": ["iSGLT2", "tirzepatide", "sulfamide"]
}
```
(`hypo_severe_recurrente == true` — antécédent direct d'hypoglycémie sévère.)

**Sortie observée** : `applicable` = « Ajouter un bolus au repas principal » — une escalade, alors que
le patient a un antécédent d'hypoglycémie sévère récurrente. Sur d'autres profils du même filtre
(TBR = 36-37 %, très au-dessus de la cible de sécurité « < 4 % » rappelée par l'alerte de nœud MCG),
la sortie est soit la même escalade, soit « Poursuivre… » seul (cf. F2) — **jamais** une option de
réduction/sécurité.

**Ce qui aurait dû être proposé, et sur quelle base.** Les situations « basale_seule » (« Corriger
l'hypoglycémie ou la variabilité… », `insuline.yaml:252-264`) et « basal_bolus »
(« Désintensifier / alléger le schéma », `insuline.yaml:425-446`, gardée par `terrain_fragile == true
OR hypo_severe_recurrente == true`) ont CHACUNE une option dédiée à la correction de sécurité. La
situation « basale_plus_bolus » n'en a **aucune** — ni exclusion sur ses deux options d'escalade (voir
ci-dessous), ni option de repli sécuritaire. C'est exactement le principe que la mission demande de
vérifier ailleurs : le référent a tranché, pour `insuline`, que sécurité et efficacité doivent être
CUMULABLES (E-04b/E-06, cf. commentaire `insuline.yaml:348-368`) — ici, pour cette seule situation, le
volet SÉCURITÉ est absent PAR CONSTRUCTION, ce qui rend la cumulabilité vide de sens (rien à cumuler).

**La règle en cause** : « Ajouter un GLP-1… » (`insuline.yaml:369-389`) et « Ajouter un bolus…»
(`insuline.yaml:390-412`) n'ont **aucun champ `exclusions`** — à comparer à « Titrer la basale »
(`insuline.yaml:330-335`), qui exclut explicitement sur `TBR > 4`, `TBR_severe > 1`, `CV_glycemique >
36`, `profil_glycemique contient hypo_nocturne`, `over_basalisation == true`. Rien n'empêche donc ces
deux options de escalade de rester actives — ou d'être la SEULE chose affichée — chez un patient dont
le TBR est à 36 % ou l'antécédent d'hypoglycémie sévère coché.

**Quantification** : sur tous les profils du banc en situation `basale_plus_bolus` avec un signal de
risque hypoglycémique documenté (`TBR > 4` OU `TBR_severe > 1` OU `hypo_severe_recurrente == true`) :
**401 / 401 (100 %)** sans aucune option de sécurité applicable — un résultat structurel (vérifiable
par simple lecture du contenu, indépendant du tirage) et non un artefact d'échantillonnage.

**Correction suggérée.** Deux volets, cumulables l'un avec l'autre : (1) ajouter les mêmes
`exclusions` que « Titrer la basale » aux deux options d'escalade de `basale_plus_bolus` (empêche au
moins l'escalade non gardée) ; (2) ajouter une option de sécurité propre à `basale_plus_bolus`
(réduction de dose / relâchement de cible), sur le modèle de « Corriger l'hypoglycémie… ».

---

## HAUTE — F4. `insuline` : `hypo_severe_recurrente` — le signal de sécurité le plus direct collecté par le nœud — n'oriente jamais le choix de la molécule à l'initiation

**Le profil exact** :

```json
{
  "situation_insuline": "naif", "age": 74, "HbA1c_actuelle": 14.27, "HbA1c_cible": 8.25,
  "fragilite": false, "esperance_vie": "longue", "risque_hypoglycemie_schema": "faible",
  "hypo_severe_recurrente": true,
  "traitements_en_cours": ["aGLP1", "sulfamide", "gliptine"]
}
```
(aucun marqueur de `terrain_fragile` — non fragile, EV longue, âge < 75, risque du schéma faible —
SAUF `hypo_severe_recurrente`, qui n'entre pas dans ce dérivé.)

**Sortie observée** : `applicable` = « Initier une insuline basale (en maintenant les antidiabétiques
en cours) », sans aucune orientation vers un analogue de 2ᵉ génération.

**Ce qui aurait dû être proposé, et sur quelle base.** L'option « Choisir un analogue basal de 2ᵉ
génération (glargine U300 ou degludec) si risque hypoglycémique » (`insuline.yaml:229-250`) existe
précisément pour ce cas — son propre texte nomme *« le patient à risque d'hypoglycémie (âgé, fragile,
insuffisance rénale, **hypoglycémies nocturnes**) »* et cite SWITCH 2/EDITION comme preuve d'une
réduction de l'hypoglycémie nocturne. Mais sa condition (`insuline.yaml:238`,
`"terrain_fragile == true"`) ne teste QUE le dérivé `terrain_fragile`
(`fragilite OR esperance_vie == limitee OR age >= 75 OR risque_hypoglycemie_schema == eleve`,
`insuline.yaml:75-77`), qui **n'inclut pas** `hypo_severe_recurrente`. Un patient dont le SEUL
signal de risque est un antécédent RÉEL et OBSERVÉ d'hypoglycémie sévère récurrente — le signal le
plus dur du nœud, plus direct qu'un simple drapeau déclaratif de fragilité — reçoit la même
recommandation de molécule qu'un patient sans aucun facteur de risque. C'est d'autant plus net que
`hypo_severe_recurrente` EST utilisé, plus loin dans le même nœud, comme déclencheur indépendant de
« Désintensifier / alléger le schéma » (`insuline.yaml:439`, `"terrain_fragile == true OR
hypo_severe_recurrente == true"`) — le critère est donc décisif quelque part (R5 passe formellement)
mais silencieux exactement là où l'argumentaire du nœud dit qu'il devrait compter le plus : le choix
initial de la molécule.

**Quantification** : parmi les profils `naif` avec `hypo_severe_recurrente == true` et
`terrain_fragile == false` (aucun autre marqueur de risque) : **17 / 17 (100 %)** ne reçoivent jamais
la recommandation d'un analogue de 2ᵉ génération.

**Correction suggérée.** Ajouter `OR hypo_severe_recurrente == true` à la condition de l'option
« Choisir un analogue basal de 2ᵉ génération » (`insuline.yaml:238`), symétrique de ce qui a déjà été
fait pour « Désintensifier… » le 2026-07-26 (cf. commentaire `insuline.yaml:426-436`, qui documente
explicitement cette même hésitation pour une AUTRE option du même nœud sans la généraliser à
celle-ci).

---

## MOYENNE — F5. `prescription` : glucotoxicité symptomatique + HbA1c < 10 % + aucune indication d'organe → fenêtre de silence sur l'escalade

**Le profil exact** :

```json
{
  "intention": "optimiser", "HbA1c_actuelle": 7.5, "position_vs_cible": "nettement_au_dessus",
  "ASCVD_etablie": false, "insuffisance_cardiaque": false, "DFG": 21, "albuminurie": "micro",
  "IMC": 22, "symptomes_glucotoxicite": true, "cetonemie": false,
  "traitements_en_cours": ["iSGLT2", "tirzepatide", "sulfamide", "insuline"]
}
```
(profil illustratif du filtre ; le cas le plus pur — patient NAÏF, sans aucune indication d'organe, ni
palette ouverte faute de `nettement_au_dessus` en initiation — se rencontre plus rarement sur le banc
mais suit la même règle de code, vérifiée indépendamment ci-dessous.)

**Sortie observée** : sur l'échantillon ciblé (glucotoxicité vraie, cétonémie fausse, HbA1c < 10 %),
**8 / 300 (2,7 %)** profils n'ont AUCUNE option dans la famille « Agent à ajouter » — seule la
metformine (et, selon le cas, un allègement d'un agent déjà en place) reste affichée.

**Ce qui aurait dû être proposé, et sur quelle base.** Les quatre options d'escalade non-insulinique
(iSGLT2, AR GLP-1, tirzépatide, association) portent TOUTES l'exclusion
`symptomes_glucotoxicite == true` (`prescription.yaml:387,432,489,528`) — cohérent avec l'idée qu'un
patient symptomatique ne doit pas attendre l'effet lent de ces classes. Mais « Insuline d'initiation »
ne se déclenche QUE si `HbA1c_actuelle >= 10 AND symptomes_glucotoxicite == true OR cetonemie == true`
(`prescription.yaml:274-275`) — la glucotoxicité symptomatique SEULE, avec une HbA1c encore sous 10 %,
n'ouvre PAS l'insuline. Un patient réellement symptomatique (polyurie/polydipsie/amaigrissement —
`symptomes_glucotoxicite` n'est pas un critère anodin) avec une HbA1c entre son objectif et 10 %, sans
indication d'organe et sans palette ouverte (donc hors `intention == initier AND
position_vs_cible == nettement_au_dessus` ou `intention == intensifier`), tombe dans un intervalle où
**aucune classe n'est disponible** : exclu des quatre classes protectrices par le symptôme, pas encore
éligible à l'insuline par le seuil. Le seul geste affiché est la poursuite de la metformine.

**La règle en cause** : `prescription.yaml:274-275` (seuil `HbA1c_actuelle >= 10` conjoint à
`symptomes_glucotoxicite`) et les quatre exclusions `symptomes_glucotoxicite == true` citées
ci-dessus.

**Correction suggérée.** Signaler ce cas par une ALERTE dédiée (pas une option, le nœud n'a pas de
preuve pour trancher un geste précis dans cette zone grise) : *« Glucotoxicité symptomatique
rapportée avec HbA1c < 10 % : les classes iSGLT2/AR GLP-1/tirzépatide sont écartées par le symptôme et
le seuil d'insuline d'initiation n'est pas atteint — reconsidérer HbA1c_actuelle (fiabilité du
prélèvement) ou orienter vers une réévaluation rapprochée. »* — cohérent avec R7/R8 de
`GRAMMAIRE-NOEUD.md` (le moteur ne se prononce pas sur ce qu'il ignore, mais le dit).

---

## BASSE (confirmation, déjà documentée) — F6. `statine` : dialyse + naïf + non-ASCVD, la carte reste affichée sans réserve structurelle — quantifié

Déjà signalé dans `statine.yaml` lui-même (`incertitudes`, entrée « Dialyse (2026-07-26, D21,
F-statine §9.1) ») : l'exclusion structurelle ajoutée pour la dialyse ne porte QUE sur l'option « haute
intensité — prévention secondaire ». Sur le banc réaliste (profils `dialyse == true`,
`statine_deja_en_place == false`, `ASCVD_etablie == false`, n = 360) : **330 reçoivent « Statine
(prévention primaire, intensité modérée) »**, **30 reçoivent « Discuter la statine »** — 100 % de
l'échantillon reçoit une carte de statine active, sans qu'aucune `exclusion` structurelle ne s'y
applique (le texte de la carte est nuancé en prose, mais rien ne retient l'option). Pas une découverte
neuve — signalée pour compléter le décompte demandé par la mission et confirmer, par la mesure, que la
limite documentée est réellement massive (100 % et non un cas marginal).

Correction déjà esquissée dans le fichier lui-même (`incertitudes`) : une option dédiée « statine non
recommandée en dialyse naïve » ou une révision de l'invariant I2′ pour permettre un repli sans carte
active dans ce cas précis — hors périmètre de ce red-team (déjà arbitré comme non traité dans ce lot).

---

## BASSE (méthode) — F7. Le générateur de profils réalistes ne garantit aucune cohérence CROISÉE entre champs liés

Constatée en cours d'exploration (cf. « Méthode » en tête de document). `genererProfils` respecte
désormais le domaine de CHAQUE champ pris isolément (le correctif du 2026-07-26), mais deux champs
logiquement dépendants (`situation_insuline` / `traitements_en_cours` ; `position_vs_cible` /
`HbA1c_actuelle` ; `intention` / le reste du formulaire) sont tirés INDÉPENDAMMENT — un profil
« `situation_insuline: naif`, `traitements_en_cours: [insuline_basale]` » ou « `position_vs_cible:
nettement_au_dessus`, `HbA1c_actuelle: 4` » est cliniquement impossible mais parfaitement valide pour
le générateur. Le nœud `insuline` détecte PARTIELLEMENT ce cas précis (alerte
`situation_insuline == naif AND traitements_en_cours contient insuline_basale`,
`insuline.yaml:483-488`) mais pas ses variantes (`insuline_rapide` au lieu de `insuline_basale`,
`basale_seule` déjà porteuse d'`insuline_rapide`, etc.) ni l'équivalent sur `prescription`. Sans
filtrage manuel, un balayage brut du banc surestime largement le nombre de « silences » (mon premier
essai sur `prescription` en donnait 314/448, dont la quasi-totalité s'est avérée soit incohérente soit
correcte par construction une fois vérifiée). **Conséquence pour toute red-team future basée sur ce
générateur : ne jamais citer un comptage brut sans vérifier, sur l'échantillon d'exemples, la
cohérence interne du profil — et de préférence croiser avec une lecture directe du YAML, comme fait
ici pour F1-F4.**

---

## Zones explorées, sans trouvaille

- **`prescription` — routage vers la famille « Agent à ajouter » pour une indication d'organe**
  (ASCVD, IC, DFG < 60, albuminurie anormale) chez un patient naïf de toute classe protectrice, classes
  disponibles, sans exclusion d'urgence (DFG ≥ 20, pas de glucotoxicité/cétonémie) : **28 / 28 (100 %)**
  profils réalistes correspondants ont bien une option d'ajout applicable. La disjonction très large
  des conditions d'iSGLT2/AR GLP-1 (`insuffisance_cardiaque OR DFG<60 OR albuminurie!=normo OR
  ASCVD_etablie OR palette… OR remplacement…`) rend ce trou structurellement improbable — recherché
  spécifiquement, non trouvé.
- **`cible-glycemique`** : **600 / 600 (100 %)** profils réalistes produisent une sortie non vide
  (`ordered-first-match` à repli inconditionnel `["default"]`) — nœud petit, peu de surface pour un
  silence.
- **`insuline` — cumulabilité sécurité/efficacité** dans les situations `naif`, `basale_seule` et
  `basal_bolus` : conforme au principe tranché par le référent (E-04b/E-06) — vérifié sur le banc, la
  brèche identifiée (F2/F3) est spécifique à `basale_plus_bolus`.
- **`statine` — âge inerte sur la décision** (30 ans vs 90 ans, même profil de risque par ailleurs :
  même carte, mot pour mot) : reproduit, mais déjà documenté et arbitré comme décision assumée du
  référent dans `GRAMMAIRE-NOEUD.md` (§ R5, nuance statine) — pas recompté comme finding neuf.
- **`rhd`** : le nœud n'a que 2 options et une seule variable décisive sur leur contenu (`IMC >= 27`) —
  déjà intégralement diagnostiqué par le référent lui-même (« Capture 11 » et l'analyse dédiée du
  2026-07-26 dans `recette-2026-07-25-prescription-intensifier.md`, refonte actée mais non
  implémentée). Reproduit pour confirmation (profil obèse non motivé vs profil sain motivé et actif →
  contenu des OPTIONS identique hors alertes) mais **non recompté** comme découverte neuve : le
  diagnostic et le plan de refonte préexistent à ce red-team.

## Non couvert / hors de portée de cet exercice

- Aucun test n'a porté sur les **profils PARTIELS** (`genererProfilsPartiels`, R7/D20) : ce chantier a
  volontairement écarté l'indétermination, réservée à l'angle sécurité et déjà largement couverte par
  la recette du 2026-07-25/26 (captures 12-13) et par `banc/caracterisation.test.ts`. Un silence
  spécifique aux VALEURS MANQUANTES (distinct de celui étudié ici, propre aux valeurs COMPLÈTES) reste
  possible et n'a pas été cherché.
- Les **argumentaires niveau 3** (`*.argumentaire.md`) n'ont pas été relus pour un silence de contenu
  (ex. une réserve promise en prose mais jamais encodée) au-delà de ce que `GRAMMAIRE-NOEUD.md` (R9)
  documente déjà.
- Aucune vérification croisée entre nœuds (ex. cohérence `terrain_fragile` de `prescription` vs celui
  d'`insuline`, déjà signalée comme piste dans la capture 12 de la recette) n'a été reprise ici.

## Verdict

Le module répond, dans l'ensemble, aux patients qui ont une **indication d'organe** ou qui **démarrent**
un traitement (couverture solide, confirmée sur `prescription`/`cible-glycemique`). Il répond moins
bien aux patients déjà loin dans leur parcours thérapeutique et à ceux dont le problème est un **excès**
plutôt qu'un manque : le sur-traitement déclaré sur l'insuline/le glinide (F1), la situation
intermédiaire de l'insulinothérapie (« basale_plus_bolus », F2/F3), et le choix de la molécule la plus
sûre pour un patient au passé d'hypoglycémie sévère (F4) sont quatre angles morts distincts, tous
vérifiés indépendamment sur le contenu YAML — pas de simples artefacts du banc. Trois d'entre eux
touchent directement à la sécurité du patient déjà traité (hypoglycémie), ce qui est le défaut le plus
grave visé par cette mission : un patient qui a BESOIN d'un geste et qui reçoit un silence, ou pire, une
poursuite d'escalade sans aucun contrepoids de sécurité (F3). Le module `insuline`, en particulier, a
un point aveugle structurel (« basale_plus_bolus ») qui n'a pas bénéficié des corrections apportées aux
trois autres situations lors du lot du 2026-07-26.

## Nettoyage

Fichier temporaire supprimé après remise de ce rapport :
`src/features/decision/engine/banc/__redteam_silence_temp__.test.ts`.
