# Carte de cohérence des valeurs — DT2 (T-012)

Audit mécanique de cohérence des **valeurs** (seuils, critères homonymes, parité prose↔DSL, lexique
molécules, traces mortes) entre les 7 nœuds DT2, à partir de `inventaire.json` (T-011), avec relecture
ponctuelle des YAML/argumentaires sources pour lever les doutes de localisation.

**Hors périmètre de ce document** : re-vérification EBM (exactitude des seuils eux-mêmes, sourcing —
c'est S3), vignettes cliniques (S4), corrections de contenu (ce document ne modifie aucun YAML). Aucune
divergence listée ici n'a été tranchée cliniquement — je ne juge pas laquelle des deux valeurs en
conflit est correcte, je signale le conflit.

Légende sévérité : HAUTE (contradiction de sécurité ou de recommandation directement exposée à
l'utilisateur) · MODÉRÉE (incohérence de fond mais impact clinique indirect/atténué) · BASSE
(multiplicité de seuils vraisemblablement justifiée par des contextes cliniques différents, à faire
confirmer).

---

## 1. Synthèse (gate humaine)

- **11 divergences** relevées au total : **8 classées « clinique · à arbitrer »**, **3 classées
  « triviale »**.
- **1 cas connu (DFG < 30 metformine vs sulfamide)** examiné et conclu **« pas de divergence »**
  (justifications différentes légitimes) — non compté dans les 11.
- **2 divergences cliniques BLOQUENT** l'engagement du budget Opus S3+ tant qu'elles ne sont pas
  arbitrées par le référent, parce qu'elles sont des **contradictions actives entre nœuds** (pas de la
  simple variation contextuelle) et qu'elles portent sur la **sécurité médicamenteuse** :
  1. **D7 — Contradiction DFG < 45 sulfamide** : le nœud E (insuline) affiche « sulfamides à
     proscrire » en bloc dès DFG < 45, alors que le nœud D (référence sur le sujet) prescrit une
     poursuite à dose réduite entre 30-44 et ne proscrit qu'en dessous de 30. Un utilisateur du nœud E
     seul verrait une consigne plus restrictive et contradictoire avec le nœud D.
  2. **D6 — Enum `traitements_en_cours` incomplète dans le nœud E** : le nœud E ne peut pas détecter
     qu'un patient est déjà sous tirzépatide ou pioglitazone (absents de son énumération, présents dans
     les 3 autres nœuds qui partagent ce critère), ce qui peut faire proposer à tort l'ajout d'un
     GLP-1/agent incrétine chez un patient qui en reçoit déjà un via le tirzépatide.
- **6 divergences cliniques réglables en remédiation ultérieure** (non bloquantes pour engager S3, mais
  à corriger avant le câblage définitif / avant les vignettes S4) : D1 (seuils d'âge multiples), D2
  (seuils d'ancienneté du diabète multiples), D3 (seuils d'IMC multiples), D5 (mécanisme
  `cible_atteinte` asymétrique entre C et E — dette déjà documentée par les auteurs, relève de P3), D8
  (garde-fou dialyse statine : alerte molle vs prose impérative « ne pas initier »), D9 (parité
  DSL/prose de l'exclusion iSGLT2 « glucotoxicité » : booléens vs seuil numérique affiché).
- **3 divergences triviales** (formulation/documentation, sans conséquence clinique) : D10
  (appariement E mal relié dans l'inventaire — la vraie parité est correcte, ailleurs dans le nœud),
  D11 (« gliclazide » vs « gliclazide MR »), D12 (trace morte : `statine.argumentaire.md` §8 décrit
  encore le proxy DFG < 15 comme si actif, alors que le YAML l'a retiré au profit du booléen `dialyse`).

**Recommandation gate** : ne pas engager S3 (re-vérification EBM) tant que D6 et D7 n'ont pas été
arbitrés par le référent — ce sont des contradictions de contenu entre nœuds, pas des questions
d'exactitude de source, donc S3 ne les détectera pas et pourrait bâtir dessus. Les autres divergences
peuvent être arbitrées en parallèle de S3.

---

## 2. Matrice de cohérence (paramètre partagé × nœud)

Nœuds : **A** cible-glycemique · **B** premiere-intention · **C** intensification · **D**
sulfamides-gliptines · **E** insuline · **F** statine · **H** rhd.

### age

| Nœud | Valeur(s) | Contexte | Provenance |
|---|---|---|---|
| A | < 70 | relaxation/durcissement de cible | cible-glycemique.yaml:50 |
| C | ≥ 75 | déclencheur de désintensification | intensification.yaml:73 |
| E | ≥ 75 | composant de `terrain_fragile` (derive) | insuline.yaml:67 |
| F | > 75 | alerte individualisation prévention primaire | statine.yaml:107 |
| F | 40-69 | plage de validité de SCORE2-Diabète (prose) | statine.yaml:129 |

→ voir **D1**.

### anciennete_diabete_annees

| Nœud | Valeur(s) | Contexte | Provenance |
|---|---|---|---|
| A | < 5 | ancienneté récente, cible plus stricte | cible-glycemique.yaml:51 |
| A | > 10 | ancienneté longue, cible relâchée | cible-glycemique.yaml:41 |
| F | < 10 | tier « risque faible » (décision partagée) | statine.yaml:75 |
| H | < 6 | fenêtre de rémission (DiRECT) | rhd.yaml:236 |
| H | ≥ 6 | hors fenêtre de rémission | rhd.yaml:242 |

→ voir **D2**.

### esperance_vie (enum : longue / intermediaire / limitee)

| Nœud | Valeurs déclarées | Provenance |
|---|---|---|
| A | longue, intermediaire, limitee | cible-glycemique.yaml:16-18 |
| C | longue, intermediaire, limitee | intensification.yaml:66-68 |
| E | longue, intermediaire, limitee | insuline.yaml:59-61 |

Identiques. Pas de divergence.

### fragilite (bool)

Présent dans A, C, E — type bool partout, pas de valeurs numériques associées. Pas de divergence.

### risque_hypoglycemie_schema (enum : faible / eleve)

| Nœud | Valeurs déclarées | Provenance |
|---|---|---|
| A | faible, eleve | cible-glycemique.yaml:21-23 |
| C | faible, eleve | intensification.yaml:59-61 |
| D | faible, eleve | sulfamides-gliptines.yaml:54-56 |
| E | faible, eleve | insuline.yaml:62-64 |

Identiques. Pas de divergence.

### ASCVD_etablie (bool)

Présent dans B, C, F — type bool partout. Pas de valeur numérique à comparer. Pas de divergence
(note : F documente en tête « prevention n'est PAS une variable : prévention secondaire ⟺
ASCVD_etablie » — source unique explicitement revendiquée, statine.yaml:10, cohérent).

### insuffisance_cardiaque (bool)

Présent dans B, C — type bool. Pas de divergence.

### DFG

| Nœud | Valeur(s) | Contexte | Provenance |
|---|---|---|---|
| B | < 60 | seuil bénéfice rénal iSGLT2 (conditions + priorité conditionnelle) | premiere-intention.yaml:85,91 |
| B | < 20 | exclusion dure iSGLT2/metformine | premiere-intention.yaml:89,108 |
| B | < 30 | exclusion/CI metformine (RCP ANSM) | premiere-intention.yaml:177,189 |
| B | paliers 60/45/30 | alertes de surveillance (3 tranches) | premiere-intention.yaml:333,338,342 |
| C | < 20 | exclusion dure iSGLT2 | intensification.yaml:140,142 |
| C | < 30 | arrêt metformine (RCP ANSM acidose lactique) | intensification.yaml:12,93 (molécules) |
| C | 45-59 → max 2g/j ; 30-44 → max 1g/j | paliers posologiques metformine | intensification.yaml:11,113 |
| C | < 60 (×3) | seuils bénéfice rénal / conditions (réutilisation du seuil B) | intensification.yaml:94,110,111,123,232 |
| D | < 30 | exclusion dure sulfamide (**convention KDIGO/SFD**, pas de seuil RCP chiffré) | sulfamides-gliptines.yaml:112,114 |
| D | ≥ 45 / 30-44 / < 30 | paliers posologiques sitagliptine (100/50/25 mg) | sulfamides-gliptines.yaml:91,128 |
| D | < 45 | alerte adaptation posologique (gliptine + sulfamide) | sulfamides-gliptines.yaml:124 |
| E | < 45 | alerte générique « sulfamides à proscrire, adapter metformine » | insuline.yaml:294-298 |
| F | — (remplacé par `dialyse` bool) | ancien proxy DFG < 15 retiré (changelog) | statine.yaml:332-333 ; trace résiduelle statine.argumentaire.md:179 |

Le seuil DFG < 20 (iSGLT2/metformine sévère) et DFG < 30 (metformine, RCP ANSM) sont **cohérents entre
B et C** (même valeur, même justification). Le seuil DFG < 60 (bénéfice rénal iSGLT2) est réutilisé à
l'identique en B et C. Les paliers metformine 45-59/30-44 sont identiques en C. Les paliers
sitagliptine 100/50/25 mg sont identiques dans les deux occurrences en D. → Divergences relevées :
**D4** (DFG<30 metformine vs sulfamide — conclu non-divergent), **D7** (DFG<45 nœud E vs nœud D —
divergence réelle, bloquante), **D12** (trace morte DFG<15 dans l'argumentaire statine).

### albuminurie (enum : normo / micro / macro)

| Nœud | Valeurs déclarées | Provenance |
|---|---|---|
| B | normo, micro, macro | premiere-intention.yaml:47-49 |
| C | normo, micro, macro | intensification.yaml:54-56 |

Identiques. Pas de divergence. → traité aussi comme cas connu #3 (§4).

### IMC

| Nœud | Valeur(s) | Contexte | Provenance |
|---|---|---|---|
| B | ≥ 30 | condition (indication classe à bénéfice pondéral) | premiere-intention.yaml:114 |
| C | ≥ 30 | condition (réutilisation du seuil B) | intensification.yaml:147 |
| H | ≥ 27 | condition d'éligibilité au programme RHD | rhd.yaml:70 |
| H | ≥ 35 | alerte (probablement orientation chirurgie bariatrique) | rhd.yaml:226 |
| E | (déclaré, pas de seuil numérique propre) | critère d'entrée seul | insuline.yaml:55-56 |

→ voir **D3**.

### HbA1c_actuelle

| Nœud | Valeur(s) | Contexte | Provenance |
|---|---|---|---|
| B | ≥ 10 | condition (glucotoxicité) | premiere-intention.yaml:68 |
| E | (déclaré, pas de seuil propre — comparé à `HbA1c_cible`) | criteres_entree | insuline.yaml:46-47 |

Pas de contradiction : E ne reprend pas le seuil de B, il compare HbA1c_actuelle à HbA1c_cible
(saisie séparée). Cf. cas connu #2 (§4) pour la question de fond (cohérence de la cible A↔C↔E).

### symptomes_glucotoxicite / preference_injection

Présents dans B et E, type bool / enum [accepte, refuse, indifferent] identiques dans les deux nœuds.
Pas de divergence de déclaration. Voir toutefois **D9** pour la parité prose/DSL de l'exclusion liée à
la glucotoxicité dans B.

### cible_atteinte (bool)

| Nœud | Mécanisme | Provenance |
|---|---|---|
| C | Saisie opaque (pas de `derive` déclaré ; chaînage A→C explicitement noté « hors moteur, P3 » par les auteurs) | intensification.yaml:39-40 ; couplages_inter_noeuds |
| E | `derive: HbA1c_actuelle <= HbA1c_cible` | insuline.yaml:50-52 |

Même nom, même type déclaré (bool), **mécanisme de calcul divergent** — un est une formule explicite,
l'autre une entrée manuelle sans définition. → voir **D5** et cas connu #2 (§4).

### traitements_en_cours (liste)

| Nœud | Valeurs déclarées | Provenance |
|---|---|---|
| C | metformine, iSGLT2, aGLP1, tirzepatide, sulfamide, gliptine, insuline, glinide, pioglitazone | intensification.yaml:45-47 |
| D | metformine, iSGLT2, aGLP1, tirzepatide, sulfamide, gliptine, insuline, glinide, pioglitazone | sulfamides-gliptines.yaml:49-51 |
| H | metformine, iSGLT2, aGLP1, tirzepatide, sulfamide, gliptine, insuline, glinide, pioglitazone | rhd.yaml:46-48 |
| E | metformine, iSGLT2, aGLP1, **sulfamide, glinide, gliptine**, insuline_basale, insuline_rapide | insuline.yaml:72-74 |

E est la seule occurrence divergente : **tirzepatide et pioglitazone absents**, et `insuline` scindé
en `insuline_basale` / `insuline_rapide` (ce dernier point est cohérent avec le sujet du nœud, pas une
divergence en soi). → voir **D6**, bloquante.

### DFG (dose gliptine) — sitagliptine, comparaison D↔E

Le nœud E ne mentionne aucune posologie de sitagliptine (recherche exhaustive dans
`insuline.yaml` : seul le mot « gliptine » apparaît, comme valeur de l'énumération
`traitements_en_cours`, sans seuil DFG ni dose). → traité comme cas connu #4 (§4), conclusion : rien à
comparer, pas de divergence.

---

## 3. Liste des divergences

**D1 — Seuils d'âge multiples non harmonisés**
- Paramètre : `age`
- Nœuds concernés : A (< 70), C (≥ 75), E (≥ 75, dans `terrain_fragile`), F (> 75 ; 40-69 validité SCORE2)
- Valeurs en conflit : 70 vs 75 vs 40-69, contextes différents (relaxation de cible / désintensification
  / fragilité / validité d'un score de risque)
- Type de contrôle : 1 (seuils divergents)
- Fichier:ligne : cible-glycemique.yaml:50 ; intensification.yaml:73 ; insuline.yaml:67 ;
  statine.yaml:107,129
- Sévérité pressentie : BASSE (les contextes cliniques diffèrent réellement — probablement volontaire)
- Classe : **clinique · à arbitrer** (à faire confirmer par le référent que 70/75 ne sont pas censés
  être le même seuil)

**D2 — Seuils d'ancienneté du diabète multiples non harmonisés**
- Paramètre : `anciennete_diabete_annees`
- Nœuds concernés : A (< 5 / > 10), F (< 10), H (< 6 / ≥ 6)
- Valeurs en conflit : 5/10 (A) vs 10 (F) vs 6 (H)
- Type de contrôle : 1
- Fichier:ligne : cible-glycemique.yaml:51,41 ; statine.yaml:75 ; rhd.yaml:236,242
- Sévérité pressentie : BASSE (trois justifications distinctes : cible glycémique ACCORD/ADVANCE,
  stratification de risque statine, fenêtre de rémission DiRECT)
- Classe : **clinique · à arbitrer**

**D3 — Seuils d'IMC multiples non harmonisés**
- Paramètre : `IMC`
- Nœuds concernés : B (≥ 30), C (≥ 30), H (≥ 27 conditions, ≥ 35 alertes)
- Valeurs en conflit : 30 (B/C, indication classe à bénéfice pondéral) vs 27 (H, éligibilité RHD) vs 35
  (H, alerte — vraisemblablement chirurgie bariatrique)
- Type de contrôle : 1
- Fichier:ligne : premiere-intention.yaml:114 ; intensification.yaml:147 ; rhd.yaml:70,226
- Sévérité pressentie : MODÉRÉE (l'IMC pilote directement des choix de classe médicamenteuse en B/C ;
  la cohérence avec les seuils OMS/HAS utilisés en H mérite vérification explicite par le référent)
- Classe : **clinique · à arbitrer**

**D5 — Mécanisme `cible_atteinte` asymétrique entre C et E**
- Paramètre : `cible_atteinte`
- Nœuds concernés : C, E
- Valeurs en conflit : pas une valeur numérique — un mécanisme de calcul divergent (C : entrée opaque
  sans formule ; E : `derive HbA1c_actuelle <= HbA1c_cible`)
- Type de contrôle : 2 (critère homonyme, type identique mais définition divergente)
- Fichier:ligne : intensification.yaml:39-40 ; insuline.yaml:50-52 ; couplages_inter_noeuds
  (intensification.yaml:395, insuline.yaml:478)
- Sévérité pressentie : MODÉRÉE — déjà documentée comme dette ouverte par les auteurs eux-mêmes
  (« chaînage inter-nœuds A→C reste hors moteur, P3 »)
- Classe : **clinique · à arbitrer** — non bloquant pour S3 (ce n'est pas une question d'exactitude EBM
  mais de câblage moteur, déjà tracée pour P3) ; à garder visible pour ne pas être ré-découverte plus
  tard

**D6 — Enum `traitements_en_cours` incomplète dans le nœud E (BLOQUANT)**
- Paramètre : `traitements_en_cours`
- Nœuds concernés : C, D, H (référence) vs E (divergent)
- Valeurs en conflit : E omet `tirzepatide` et `pioglitazone`, présents dans les 3 autres nœuds partageant
  ce critère
- Type de contrôle : 2 (critère homonyme, valeurs déclarées divergentes)
- Fichier:ligne : intensification.yaml:45-47 ; sulfamides-gliptines.yaml:49-51 ; rhd.yaml:46-48 ;
  insuline.yaml:72-74
- Sévérité pressentie : HAUTE — le nœud E ne peut pas détecter qu'un patient reçoit déjà un tirzépatide
  (agoniste double GIP/GLP-1), ce qui peut conduire à proposer à tort l'ajout d'un GLP-1 (option
  « Ajouter un GLP-1... si non encore fait », condition `traitements_en_cours ne_contient_pas aGLP1`,
  insuline.yaml:223) alors que le bénéfice incrétine est déjà couvert
- Classe : **clinique · à arbitrer — BLOQUANT S3+**

**D7 — Contradiction DFG < 45 : « sulfamides à proscrire » (E) vs dose réduite tolérée (D) (BLOQUANT)**
- Paramètre : `DFG` (garde-fou sulfamide)
- Nœuds concernés : D (référence), E (contradictoire)
- Valeurs en conflit : E affiche « sulfamides à proscrire » dès DFG < 45 (insuline.yaml:294-298) ; D
  prescrit au contraire gliclazide/glimépiride à dose réduite et sous surveillance pour DFG 30-44, et ne
  proscrit (CI dure) qu'en dessous de DFG 30 (sulfamides-gliptines.yaml:111-116,124-130)
- Type de contrôle : 1 (seuil/justification divergente) et 4 (lexique molécule incohérent — la même
  classe reçoit deux consignes de sécurité contradictoires)
- Fichier:ligne : insuline.yaml:294-298 ; sulfamides-gliptines.yaml:112,114,124-130
- Sévérité pressentie : HAUTE — contradiction directe de sécurité médicamenteuse exposée à
  l'utilisateur selon le nœud consulté
- Classe : **clinique · à arbitrer — BLOQUANT S3+**

**D8 — Garde-fou dialyse (statine) : alerte molle vs prose impérative**
- Paramètre : `dialyse` / garde-fou statine
- Nœud concerné : F
- Valeurs en conflit : la prose des `contre_indications` dit « Ne pas INITIER de statine chez un
  patient déjà en dialyse » (impératif, statine.yaml:72,105) mais le DSL ne l'implémente que comme une
  `alerte` (`quand: dialyse == true`, niveau attention, statine.yaml:114-119) — aucune `exclusion`
  associée (appariement `garde_fous[].appariements` avec `exclusion_provenance` **vide**). Le moteur
  peut donc toujours proposer une option statine à un patient en dialyse, avec un simple message.
- Type de contrôle : 3 (parité prose ↔ DSL)
- Fichier:ligne : statine.yaml:72,105 (prose) vs statine.yaml:114-119 (DSL, sans exclusion) ; design
  revendiqué explicitement en commentaire statine.yaml:287 (« elle ne retire pas l'option — le clinicien
  juge la poursuite d'une statine déjà en place »)
- Sévérité pressentie : MODÉRÉE — design apparemment délibéré (distinguer initiation vs poursuite),
  mais le moteur ne fait pas cette distinction techniquement (pas de variable « statine déjà en cours »)
  donc le garde-fou « ne pas initier » n'est pas réellement appliqué pour un nouveau patient en dialyse
- Classe : **clinique · à arbitrer** — le référent doit ratifier explicitement ce choix de conception
  (alerte plutôt qu'exclusion dure) ou demander un durcissement

**D9 — Parité DSL/prose de l'exclusion iSGLT2 « glucotoxicité » (nœud B)**
- Paramètre : exclusion iSGLT2 (garde-fou B)
- Nœud concerné : B
- Valeurs en conflit : l'exclusion DSL est booléenne (`symptomes_glucotoxicite == true` OR
  `cetonemie == true`, premiere-intention.yaml:87-88) ; la contre-indication prose associée cite un
  seuil numérique précis : « HbA1c > 10 % avec cétose » (premiere-intention.yaml:107). Le DSL ne
  vérifie jamais réellement HbA1c > 10 — il dépend d'un booléen `symptomes_glucotoxicite` dont la
  définition n'est pas ancrée sur ce seuil dans le schéma de critères.
- Type de contrôle : 3 (parité prose ↔ DSL)
- Fichier:ligne : premiere-intention.yaml:87-88 (exclusion) vs premiere-intention.yaml:107 (CI prose) ;
  appariement documenté dans `garde_fous[1].appariements[1]`
- Sévérité pressentie : MODÉRÉE — risque de confusion entre ce qui est affiché et ce qui est
  réellement exécuté ; risque clinique atténué car un patient avec HbA1c > 10 % et cétose aura
  vraisemblablement aussi `symptomes_glucotoxicite` ou `cetonemie` à `true` en pratique, mais rien ne
  le garantit formellement dans le moteur
- Classe : **clinique · à arbitrer**

**D10 — Appariement E mal relié dans l'inventaire (structurel, pas de conflit de valeur réel)**
- Paramètre : garde-fou hypoglycémie sévère (nœud E)
- Nœud concerné : E
- Valeurs en conflit : l'appariement de l'inventaire relie les exclusions `TBR > 4 / TBR_severe > 1 /
  CV_glycemique > 36` (insuline.yaml:196-199, 215-218) à la contre-indication générique de l'option
  d'initiation (insuline.yaml:144, « pas de CI absolue... arrêter le sulfamide/glinide ») — ce texte ne
  restate aucun seuil TBR/CV. La vraie reprise en prose de ces seuils se trouve ailleurs, dans les
  `alertes` (TIR > 70 %, TBR < 4 %/< 1 %, TAR < 25 %/< 5 %, CV ≤ 36 % — insuline.yaml:308-309), où les
  valeurs **correspondent bien** numériquement aux exclusions (4, 1, 36).
- Type de contrôle : 3 (parité prose ↔ DSL — mais ici l'anomalie est dans le lien de l'inventaire, pas
  dans le contenu)
- Fichier:ligne : insuline.yaml:196-199, 215-218 (exclusions) ; insuline.yaml:144 (CI mal appariée) ;
  insuline.yaml:308-309 (vraie prose correspondante, cohérente)
- Sévérité pressentie : BASSE — aucun impact clinique, les valeurs réelles concordent une fois qu'on
  regarde au bon endroit
- Classe : **triviale**

**D11 — « gliclazide » vs « gliclazide MR » (nœud D)**
- Paramètre : lexique molécule
- Nœud concerné : D
- Valeurs en conflit : `sulfamides-gliptines.yaml:94,128` disent « gliclazide MR » ; `:127`
  (section alertes) dit « gliclazide » sans le qualificatif MR
- Type de contrôle : 4 (lexique molécule incohérent)
- Fichier:ligne : sulfamides-gliptines.yaml:94,127,128
- Sévérité pressentie : BASSE — formulation, la forme MR est l'usage standard sous-entendu
- Classe : **triviale**

**D12 — Trace morte : proxy DFG < 15 encore décrit dans l'argumentaire statine**
- Paramètre : `dialyse` / DFG (statine)
- Nœud concerné : F
- Valeurs en conflit : `statine.argumentaire.md` §8 « Incertitudes » (ligne 179) dit encore
  « Modélisation de la dialyse : alerte sur DFG < 15 (proxy imparfait ; une variable `dialyse` serait
  plus précise) » — au présent, comme si le proxy DFG < 15 était toujours actif. Or `statine.yaml`
  ligne 332-333 documente explicitement que ce proxy a été **retiré** et remplacé par le booléen
  `dialyse` (`criteres_entree` ligne 52, alerte ligne 114).
- Type de contrôle : 5 (trace morte)
- Fichier:ligne : statine.argumentaire.md:179 (obsolète) vs statine.yaml:52,114,332-333 (état réel)
- Sévérité pressentie : BASSE — aucun impact fonctionnel (le DSL utilise bien `dialyse`), mais un
  relecteur qui ne lit que l'argumentaire pourrait croire le proxy DFG < 15 toujours en vigueur
- Classe : **triviale** (à corriger simplement : mettre à jour §8 de l'argumentaire)

---

## 4. Traitement explicite des 4 cas connus

**Cas connu #1 — DFG < 30 metformine (RCP ANSM) vs sulfamide (KDIGO/SFD)**

Même valeur numérique (30), deux justifications différentes et délibérément distinctes :
- Metformine (nœuds B, C) : DFG < 30 = seuil du **RCP** (risque d'acidose lactique) —
  premiere-intention.yaml:189, intensification.yaml (molécules, « RCP ANSM acidose lactique »).
- Sulfamide (nœud D) : DFG < 30 = **convention KDIGO/SFD**, le RCP ne donnant qu'« IR sévère » sans
  seuil chiffré — sulfamides-gliptines.yaml:114 (« seuil d'arrêt encodé : DFG < 30 — convention
  KDIGO/SFD ; les RCP mentionnent « IR sévère » sans seuil chiffré »).

**Conclusion : pas de divergence.** Ce sont deux molécules différentes, chacune avec sa base
pharmacologique propre (RCP direct pour la metformine, convention adoptée en l'absence de seuil RCP
pour le sulfamide). Le fait que le nombre choisi (30) coïncide est probablement un choix de
simplification clinique raisonnable, pas un copier-coller erroné — mais comme les deux justifications
sont explicitement différentes et documentées comme telles dans le YAML lui-même, il n'y a rien à
arbitrer ici : la cohérence rédactionnelle est déjà bonne. Suggestion non bloquante : afficher les deux
justifications côte à côte dans la doc de validation pour éviter qu'un futur relecteur ne les
fusionne par erreur.

**Cas connu #2 — Accord cible HbA1c (nœud A) ↔ recalculs locaux dans C et E**

- Nœud A définit la cible glycémique via plusieurs options (~6,5 % ; ≤ 7 % ; ≤ 8 % ; < 9 %) déclenchées
  par âge/ancienneté/fragilité/comorbidités (cible-glycemique.yaml).
- Nœud C consomme un critère `cible_atteinte` (bool) **sans formule déclarée** — les auteurs notent
  eux-mêmes (intensification.yaml, section incertitudes, ligne 395) : « le DSL ne compare pas deux
  variables ; le chaînage inter-nœuds A→C reste hors moteur (P3) ».
- Nœud E consomme `HbA1c_cible` (nombre, saisi séparément) et calcule `cible_atteinte` via
  `derive: HbA1c_actuelle <= HbA1c_cible` (insuline.yaml:50-52), et note aussi (ligne 478) : « HbA1c_cible
  provient du nœud A et terrain_fragile reprend ses déclencheurs de relaxation — cohérence à
  maintenir ».

**Conclusion : divergence de mécanisme réelle et déjà connue des auteurs, pas encore arbitrée.** C
attend une saisie externe opaque, E calcule explicitement à partir d'une cible saisie séparément — dans
les deux cas, rien ne garantit dans le moteur actuel que la cible utilisée provient effectivement du
calcul du nœud A pour le même patient (le chaînage inter-nœuds est hors moteur, documenté P3). Ce n'est
pas une erreur de contenu EBM (S3 ne le détectera pas), c'est un manque de câblage. Voir **D5** —
recommandé pour l'arbitrage produit/moteur en P3, pas bloquant pour S3.

**Cas connu #3 — `albuminurie.valeurs` identiques entre nœuds**

Présent dans B (premiere-intention.yaml:47-49) et C (intensification.yaml:54-56), valeurs déclarées
`[normo, micro, macro]` dans les deux cas, à l'identique (confirmé dans `catalogue_canonique_criteres`
et dans les entrées `criteres_entree` détaillées).

**Conclusion : pas de divergence.** Cohérent.

**Cas connu #4 — Dose de sitagliptine selon DFG (nœud D) vs affichage dans le nœud E (insuline)**

Le nœud D détaille la posologie de sitagliptine par palier de DFG (100 mg si DFG ≥ 45 ; 50 mg si 30-44 ;
25 mg si < 30, dialyse incluse — sulfamides-gliptines.yaml:91,128). Recherche exhaustive dans
`insuline.yaml` : le terme « gliptine » n'apparaît qu'une fois, comme valeur possible de l'énumération
`traitements_en_cours` (ligne 74) — **aucune posologie de sitagliptine ni seuil DFG associé n'est
mentionné dans le nœud E**.

**Conclusion : pas de divergence, rien à comparer.** Le nœud E ne restate pas cette information ; il
n'y a donc pas de risque de contradiction sur ce point précis. (Note indirecte : ceci renforce
l'intérêt de corriger D6 — sans une énumération `traitements_en_cours` complète et cohérente entre
nœuds, le nœud E ne peut de toute façon pas raisonner finement sur les traitements oraux concurrents
d'un patient candidat à l'insuline.)

---

*Document produit mécaniquement à partir de `inventaire.json` (T-011) + relecture ciblée des sources
YAML/argumentaire. Aucun arbitrage clinique n'a été rendu ici ; toutes les classes « clinique · à
arbitrer » attendent une décision du référent.*

---

## 5. Suivi des arbitrages (gate humaine, référent)

Corrections appliquées **immédiatement** (avant S3, décision du référent — déroge à la règle générale
« P2 ne corrige pas » pour ces deux points bloquants) :

- **D7 — RÉSOLU (2026-07-24)** : arbitrage référent = aligner le nœud E sur le nœud D (base
  documentaire de référence pour les sulfamides). Message de l'alerte `DFG < 45` du nœud E corrigé :
  ne proscrit plus les sulfamides en bloc, reprend la nuance du nœud D (dose réduite + surveillance
  rapprochée 30-44, contre-indication seulement < 30). `insuline.yaml` v0.1 → v0.2.
- **D6 — RÉSOLU (2026-07-24)** : arbitrage référent = ajouter `tirzepatide` à l'énumération
  `traitements_en_cours` du nœud E. Effectué + conséquence logique traitée : la condition de l'option
  « Ajouter un GLP-1... si non encore fait » exclut désormais aussi `tirzepatide` (éviter une
  redondance incrétine). `insuline.yaml` v0.2. **Pioglitazone** (également absent de l'énumération E,
  mais présent dans C/D/H) : le référent a signalé un doute sur sa disponibilité en France, à vérifier
  — confirmé non commercialisée (AMM suspendue par l'ANSM le 11/07/2011, risque de cancer de la vessie,
  aucune levée identifiée depuis) → **retiré des énumérations `traitements_en_cours` de C, D et H**
  (mentions dans les essais cités et les positions Prescrire conservées, ce sont des faits historiques).
  `intensification.yaml` v1.0 → v1.1 (nœud validé, correction ponctuelle) ; `sulfamides-gliptines.yaml`
  et `rhd.yaml` v0.1 → v0.2. Build + 139/139 tests verts après correction.
- **D1 — CLOS, pas d'action (2026-07-24)** : référent confirme que les seuils d'âge (70/75/40-69) sont
  volontairement distincts par contexte (relaxation de cible / désintensification / fragilité / validité
  SCORE2). Pas de correction.
- **D2 — CLOS, pas d'action (2026-07-24)** : référent confirme que les seuils d'ancienneté du diabète
  (5-10 / 10 / 6) sont volontairement distincts par contexte (cible glycémique / stratification statine /
  fenêtre de rémission DiRECT). Pas de correction.
- **D3 — CLOS, pas de divergence (2026-07-24, vérifié)** : le référent a demandé une vérification express
  des seuils d'IMC contre HAS/OMS. Confirmé sourcé et volontaire, PAS une incohérence :
  - **30** (nœuds B/C, `IMC >= 30`) = seuil OMS/HAS d'obésité, pilote la préférence de classe (AR GLP-1 /
    tirzépatide / iSGLT2 en cas d'obésité) — `premiere-intention.yaml:114,137,159`.
  - **27** (nœud H, option perte de poids renforcée) = seuil d'**inclusion de l'essai DiRECT/DIADEM-1**
    lui-même (27-45 kg/m² dans DiRECT), cité comme tel dans l'argumentaire (grade A ebmfrance) —
    `rhd.yaml:70,101`. Ce n'est pas un seuil d'obésité générique, c'est la borne EBM de l'essai fondateur.
  - **35** (nœud H, alerte chirurgie) = seuil HAS parcours obésité pour orienter vers une évaluation de
    chirurgie métabolique (avec le cas 30-34,9 « au cas par cas » SFD 2025 explicitement rappelé dans le
    message) — `rhd.yaml:226-233`.
  - Conclusion : 3 seuils, 3 sources EBM distinctes et correctement citées pour 3 décisions différentes
    (préférence de classe médicamenteuse / éligibilité au programme de rémission / orientation chirurgie).
    Aucune correction nécessaire.
- **D5** : reste tel quel, dette de câblage déjà tracée pour P3 (pas une question de contenu clinique).
- **D8 — CLOS, pas d'action (2026-07-24)** : référent confirme garder l'alerte molle (design déjà
  délibéré : le clinicien juge la poursuite d'une statine déjà en place chez un patient en dialyse ;
  l'outil ne la retire pas automatiquement). Pas de correction.
- **D9 — CLOS, pas d'action (2026-07-24)** : référent confirme laisser les booléens
  (`symptomes_glucotoxicite`/`cetonemie`) comme proxys de l'exclusion iSGLT2, sans ajouter le seuil
  numérique HbA1c > 10 % explicitement au DSL. Pas de correction.

**Bilan gate humaine P2 (2026-07-24) : les 11 divergences relevées par S2 sont closes** (2 corrigées —
D6, D7 — et 9 confirmées sans action après arbitrage référent, dont D3 vérifié contre les sources HAS/OMS/
DiRECT). Le go pour engager le budget Opus (S3-S7) peut être donné.
