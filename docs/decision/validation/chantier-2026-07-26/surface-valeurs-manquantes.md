# Surface d'impact — absence de valeur ternaire (2026-07-26)

Cartographie de l'impact d'une future troisième valeur logique « indéterminé » sur les 5 nœuds DT2.
**Aucune implémentation, aucun choix de sémantique proposés ici** — uniquement l'inventaire qui
dimensionne le chantier, conformément à la mission. Aucun fichier existant n'a été modifié.

Sources lues intégralement pendant cette session : les 5 YAML (`content/noeuds/diabete-type-2/*.yaml`),
`src/features/decision/engine/conditions.ts`, `deriveCritere.ts`, `evaluateNode.ts`,
`src/features/decision/lib/formLayout.ts`, `components/CriteriaForm.tsx`,
`src/features/decision/engine/banc/profils.ts`, `engine/relevance.ts`, `content/node.types.ts`, et
`docs/decision/validation/recette-2026-07-25-prescription-intensifier.md` (captures 1 à 13). Tous les
numéros de ligne cités ont été vérifiés à la lecture directe des fichiers cette session.

## Méthode de classement (T2)

Pour chaque règle, on calcule la valeur de vérité de son expression **sur le vecteur de critères
100 % par défaut de son nœud** (`buildDefaultCriteria`, cf. T1), puis on lit ce que cette valeur de
vérité **affirme cliniquement** :

- **RASSURANT** : l'affirmation produite par le défaut est cliniquement neutre/normale (absence de
  facteur de risque, objectif atteint, geste non déclenché) — le vide « ne dit rien à signaler ».
- **ALARMANT** : l'affirmation produite par le défaut est cliniquement anormale et déclenche quelque
  chose de visible (une alerte qui s'affiche, une exclusion qui retire une option, une option qui
  devient applicable sur la base du défaut).
- **NEUTRE** : la règle est un **routeur catégoriel** (`situation_insuline`, primer `intention`) sans
  polarité de risque propre, ou son évaluation par défaut est **inatteignable** (une règle de priorité
  placée après une autre déjà vraie par défaut, jamais évaluée en pratique par `resolvePriorite` —
  premier-match).

Une règle composite (`OR`/`AND` de plusieurs clauses) est classée sur son résultat **global**, avec le
détail des clauses en note quand leurs polarités divergent (ex. une clause alarmante rendue muette par
une autre clause AND'ée qui reste fausse).

**Hors périmètre strict de T2** : les règles qui ne mentionnent **aucun** critère `nombre`/`enum` par
son nom littéral — notamment les conditions qui ne consomment qu'un critère `bool` **dérivé** d'un
`nombre`/`enum` (ex. `cible_atteinte == false`, `gaj_a_cible == true`). Ces critères dérivés sont
eux-mêmes recensés comme lignes T2 (ligne `derive`) puisque leur propre expression mentionne bien des
`nombre`/`enum` ; leurs consommateurs bool sont listés en note « chaîne d'indirection » à la fin de
chaque nœud plutôt que dupliqués en ligne de table, pour rester lisible sans perdre le lien de causalité.

---

## T1 — Le vecteur par défaut, nœud par nœud

### Nœud A — `cible-glycemique.yaml` (ordered-first-match)

| Critère | Type | Défaut | Ce que la valeur AFFIRME cliniquement |
|---|---|---|---|
| `age` | nombre | 0 | Âge nul (impossible) ; dans `age < 70` (l.50) lu comme « patient jeune » |
| `anciennete_diabete_annees` | nombre | 0 | Diabète diagnostiqué aujourd'hui |
| `esperance_vie` | enum | `longue` (1re valeur) | Espérance de vie longue |
| `fragilite` | bool | false | Non fragile |
| `risque_hypoglycemie_schema` | enum | `faible` (1re valeur) | Schéma à faible risque hypoglycémique |
| `antecedent_cv` | bool | false | Aucun antécédent cardiovasculaire |
| `comorbidite_grave` | bool | false | Aucune comorbidité grave |

Aucun critère `derive` dans ce nœud. **Portrait combiné** : jeune, diabète tout juste diagnostiqué,
espérance de vie longue, non fragile, pas de risque hypoglycémique, pas d'antécédent CV, pas de
comorbidité grave — exactement le profil auquel l'option « Cible ~6,5 % » (la plus stricte) est
réservée. Cf. T3.

### Nœud F — `statine.yaml` (ordered-first-match)

| Critère | Type | Défaut | Ce que la valeur AFFIRME cliniquement |
|---|---|---|---|
| `age` | nombre | 0 | Âge nul (impossible) ; dans `age > 75` (l.111) lu comme « pas de sujet âgé » |
| `ASCVD_etablie` | bool | false | Pas de maladie athéromateuse établie |
| `anciennete_diabete_annees` | nombre | 0 | Diabète diagnostiqué aujourd'hui |
| `autres_FDRCV` | nombre | 0 | Aucun facteur de risque CV additionnel |
| `diabete_complique` | bool | false | Diabète non compliqué |
| `dialyse` | bool | false | Patient non dialysé |

Aucun `derive`. **Portrait combiné** : diabète récent + non compliqué + sans FDR additionnel — très
exactement les trois critères de l'option « Discuter la statine (décision partagée) ». Point déjà
signalé par le référent (recette 13.1-13.2) ; confirmé ici par lecture directe des lignes 77-79.

### Nœud H — `rhd.yaml` (multi-options)

| Critère | Type | Défaut | Ce que la valeur AFFIRME cliniquement |
|---|---|---|---|
| `IMC` | nombre | 0 | IMC nul (impossible) ; lu « non obèse » dans `IMC >= 27` (l.70) et `IMC >= 35` (l.226) |
| `anciennete_diabete_annees` | nombre | 0 | Diabète diagnostiqué aujourd'hui |
| `motivation` | bool | false | Patient non motivé |
| `capacite_activite` | bool | false | Capacité d'activité physique réduite |
| `alimentation_equilibree` | bool | false | Alimentation non équilibrée |
| `activite_physique_reguliere` | bool | false | Pas d'activité physique régulière |
| `traitements_en_cours` | liste | `[]` | Aucun traitement en cours |

Aucun `derive`. C'est le seul des 5 nœuds sans aucun critère `derive` ni `enum`.

### Nœud E — `insuline.yaml` (multi-options)

Critères saisis :

| Critère | Type | Défaut | Ce que la valeur AFFIRME cliniquement |
|---|---|---|---|
| `situation_insuline` | enum | `naif` (1re valeur) | Patient naïf d'insuline |
| `age` | nombre | 0 | Âge nul (impossible) |
| `HbA1c_actuelle` | nombre | 0 | HbA1c nulle (impossible), lue comme un contrôle glycémique parfait |
| `HbA1c_cible` | nombre | 0 | Cible nulle (impossible) |
| `DFG` | nombre | 0 | Insuffisance rénale terminale |
| `fragilite` | bool | false | Non fragile |
| `esperance_vie` | enum | `longue` | Espérance de vie longue |
| `risque_hypoglycemie_schema` | enum | `faible` | Faible risque hypoglycémique |
| `hypo_severe_recurrente` | bool | false | Pas d'hypoglycémie sévère récurrente |
| `symptomes_glucotoxicite` | bool | false | Pas de glucotoxicité |
| `traitements_en_cours` | liste | `[]` | Aucun traitement en cours |
| `preference_injection` | enum | `accepte` (1re valeur) | Patient acceptant les injections |
| `mcg_disponible` | bool | false | Pas de MCG disponible |
| `TBR` | nombre | 0 | Aucun temps sous 70 mg/dL |
| `TBR_severe` | nombre | 0 | Aucun temps sous 54 mg/dL |
| `CV_glycemique` | nombre | 0 | Variabilité glycémique nulle (stabilité parfaite) |
| `profil_glycemique` | liste | `[]` | Aucun profil AGP signalé |
| `GAJ` | nombre | 0 | Glycémie à jeun nulle (impossible), lue « hors cible » |
| `poids` | nombre | 0 | Poids nul (impossible) — dénominateur dangereux, cf. T4 |
| `dose_basale_actuelle` | nombre | 0 | Aucune dose de basale en cours |
| `dose_rapide_actuelle` | nombre | 0 | Aucune dose de rapide en cours |

Critères `derive` recalculés sur ce vecteur (`calculerCriteresDerives`) :

| Dérivé | Expression (fichier:ligne) | Résultat | Affirmation |
|---|---|---|---|
| `cible_atteinte` | `HbA1c_actuelle <= HbA1c_cible` (insuline.yaml:52) | `0<=0` → **true** | Objectif glycémique atteint |
| `terrain_fragile` | `fragilite OR esperance_vie==limitee OR age>=75 OR risque_hypo==eleve` (insuline.yaml:65) | **false** | Terrain non fragile |
| `gaj_a_cible` | `GAJ>=0.7 AND GAJ<=1.2` (insuline.yaml:91) | `0>=0.7` → **false** | Glycémie à jeun hors cible |
| `over_basalisation` | `dose_basale_actuelle / poids > 0.5` (insuline.yaml:100) | `0/0=NaN` → **false** | Pas de sur-basalisation détectée (mais via une division `NaN`, pas un calcul réel — cf. T4) |

### Nœud P — `prescription.yaml` (multi-options)

Critères saisis (certains masqués par `visible_si` quand `intention == initier`, valeur par défaut) :

| Critère | Type | Défaut | Ce que la valeur AFFIRME cliniquement |
|---|---|---|---|
| `intention` | enum | `initier` (1re valeur) | Le praticien souhaite initier un traitement (patient naïf) |
| `traitements_en_cours` | liste | `[]` | Aucun traitement en cours *(masqué par défaut)* |
| `HbA1c_actuelle` | nombre | 0 | HbA1c nulle (impossible) |
| `position_vs_cible` | enum | `a_l_objectif` (1re valeur, **ordre délibéré** — cf. T5) | Patient à l'objectif glycémique |
| `ASCVD_etablie` | bool | false | Pas de maladie athéromateuse établie |
| `insuffisance_cardiaque` | bool | false | Pas d'insuffisance cardiaque |
| `DFG` | nombre | 0 | Insuffisance rénale terminale |
| `albuminurie` | enum | `normo` (1re valeur) | Pas d'albuminurie |
| `IMC` | nombre | 0 | IMC nul (impossible) ; lu « maigreur sévère » (`IMC<22` vrai) ET « non obèse » (`IMC>=30` faux) simultanément selon la règle |
| `symptomes_glucotoxicite` | bool | false | Pas de glucotoxicité |
| `cetonemie` | bool | false | Pas de cétonémie |
| `hypoglycemie_recente` | bool | false | Pas d'hypoglycémie récente *(masqué par défaut)* |
| `denutrition` | bool | false | Pas de dénutrition |
| `infections_uro_genitales_recidivantes` | bool | false | Pas d'infections uro récidivantes |
| `intolerance_traitement` | bool | false | Pas d'intolérance *(masqué par défaut)* |
| `nature_intolerance` | enum | `aucune` (1re valeur) | Aucune intolérance *(masqué, cascade sur `intolerance_traitement`)* |
| `age` | nombre | 0 | Âge nul (impossible) |
| `fragilite` | bool | false | Non fragile |
| `esperance_vie` | enum | `longue` | Espérance de vie longue |
| `risque_hypoglycemie_schema` | enum | `faible` | Faible risque hypoglycémique |
| `preference_injection` | enum | `indifferent` (1re valeur — **ordre différent du nœud E**, cf. T5) | Indifférent aux injections |
| `classes_a_benefice_indisponibles` | bool | false | Les classes à bénéfice restent disponibles |

Critères `derive` recalculés :

| Dérivé | Expression (fichier:ligne) | Résultat | Affirmation |
|---|---|---|---|
| `hba1c_sous_cible` | `HbA1c_actuelle > 0 AND HbA1c_actuelle < 6.5` (prescription.yaml:158) | `0>0` → **false** | Pas de sur-contrôle |
| `cible_atteinte` | `position_vs_cible==a_l_objectif OR ==sous_objectif` (prescription.yaml:166) | **true** | Objectif atteint |
| `terrain_fragile` | `age>=75 OR fragilite OR esperance_vie==limitee OR risque_hypo==eleve` (prescription.yaml:169) | **false** | Non fragile |
| `palette_glycemique_ouverte` | 3 disjonctions `intention`×`position_vs_cible` (prescription.yaml:179) | **false** | Palette glycémique fermée — rien à ajouter pour le contrôle pur |
| `remplacement_agent_sans_benefice` | `traitements_en_cours contient sulfamide OR contient gliptine` (prescription.yaml:194) | **false** (liste vide) | Aucun agent sans bénéfice en cours |

---

## T2 — Sens du défaut, règle par règle

86 règles mentionnant un critère `nombre`/`enum` recensées sur les 5 nœuds. Décompte global :
**16 ALARMANT · 56 RASSURANT · 14 NEUTRE**.

### Nœud A — `cible-glycemique.yaml` (6 règles — 0 ALARMANT / 6 RASSURANT / 0 NEUTRE)

| # | Ligne | Expression | Critère(s) nombre/enum | Classement | Note |
|---|---|---|---|---|---|
| A1 | :31 | `esperance_vie == limitee` | esperance_vie | RASSURANT | Option « Cible < 9 % » : asserte « pas d'espérance de vie limitée » |
| A2 | :41 | `fragilite==true OR comorbidite_grave==true OR esperance_vie==limitee OR anciennete_diabete_annees>10 AND risque_hypoglycemie_schema==eleve` | esperance_vie, anciennete_diabete_annees, risque_hypoglycemie_schema | RASSURANT | Option « Cible ≤ 8 % » : toutes les sous-clauses nombre/enum fausses par défaut |
| A3 | :50 | `age < 70` | age | RASSURANT | Option « Cible ~6,5 % » : `0<70` vrai, lu « jeune » |
| A4 | :51 | `anciennete_diabete_annees < 5` | anciennete_diabete_annees | RASSURANT | Même option : « diabète récent » |
| A5 | :52 | `esperance_vie == longue` | esperance_vie | RASSURANT | Même option : correspond au défaut |
| A6 | :55 | `risque_hypoglycemie_schema == faible` | risque_hypoglycemie_schema | RASSURANT | Même option : correspond au défaut |

**A3-A6 sont les quatre clauses qui, TOUTES vraies simultanément par défaut, font gagner l'option la
plus stricte du nœud — cf. T3.**

### Nœud F — `statine.yaml` (3 règles — 0 ALARMANT / 3 RASSURANT / 0 NEUTRE)

| # | Ligne | Expression | Critère(s) | Classement | Note |
|---|---|---|---|---|---|
| F1 | :77 | `anciennete_diabete_annees < 10` | anciennete_diabete_annees | RASSURANT | Option « Discuter la statine » |
| F2 | :78 | `autres_FDRCV == 0` | autres_FDRCV | RASSURANT | Même option — déjà signalé référent (13.1-13.2) |
| F3 | :111 | `age > 75 AND ASCVD_etablie == false` | age | RASSURANT | Alerte « prévention primaire après 75 ans » : `0>75` faux, n'affiche rien |

Note hors-table : `autres_FDRCV` n'a pas de borne `min` côté schéma/UI — un `-1` saisi fait basculer
la sortie de « discuter » à « traiter » (13.4, cf. `CriteriaForm.tsx` : `input type="number"` sans
attribut `min`). Ce n'est pas un défaut au sens de la mission (valeur saisie, pas absente), mais relève
de la même famille « aucun garde-fou de domaine ».

### Nœud H — `rhd.yaml` (4 règles — 0 ALARMANT / 4 RASSURANT / 0 NEUTRE)

| # | Ligne | Expression | Critère(s) | Classement | Note |
|---|---|---|---|---|---|
| H1 | :70 | `IMC >= 27` | IMC | RASSURANT | Option « Perte de poids importante visée rémission » : ne s'ajoute pas au socle |
| H2 | :226 | `IMC >= 35` | IMC | RASSURANT | Alerte « penser à la chirurgie » : ne s'affiche pas |
| H3 | :236 | `IMC >= 27 AND anciennete_diabete_annees < 6` | IMC, anciennete_diabete_annees | RASSURANT | Alerte info « fenêtre favorable rémission » : ne s'affiche pas |
| H4 | :242 | `IMC >= 27 AND anciennete_diabete_annees >= 6` | IMC, anciennete_diabete_annees | RASSURANT | Alerte info « diabète plus ancien » : ne s'affiche pas |

Seul nœud où les 4 règles nombre/enum sont RASSURANTES ET où la seule option qui s'affiche par défaut
(le socle MHD, `conditions: ["toujours"]`, sans exclusion) est cliniquement inoffensive — cf. T3.

### Nœud E — `insuline.yaml` (27 règles — 2 ALARMANT / 14 RASSURANT / 11 NEUTRE)

| # | Ligne | Expression | Critère(s) | Classement | Note |
|---|---|---|---|---|---|
| E1 (derive) | :52 | `HbA1c_actuelle <= HbA1c_cible` → `cible_atteinte` | HbA1c_actuelle, HbA1c_cible | RASSURANT | Le cas cité en mission : « 0<=0 » = objectif atteint |
| E2 (derive) | :65 | `fragilite OR esperance_vie==limitee OR age>=75 OR risque_hypo==eleve` → `terrain_fragile` | esperance_vie, age, risque_hypoglycemie_schema | RASSURANT | Terrain non fragile |
| E3 (derive) | :91 | `GAJ>=0.7 AND GAJ<=1.2` → `gaj_a_cible` | GAJ ×2 | **ALARMANT** | GAJ vide → « pas à la cible » → déclenche « Titrer la basale » (12.3, 12.8) |
| E4 (derive) | :100 | `dose_basale_actuelle / poids > 0.5` → `over_basalisation` | dose_basale_actuelle, poids | RASSURANT *(à vide complet)* | `0/0=NaN`, comparaison fausse. **Mais** si `dose_basale_actuelle` est saisie et `poids` resté vide : `X/0=Infinity>0.5=true` → alarme spuriée (12.4). Cf. T4. |
| E5 | :105,123,145,162,177,197,217,231,245,257,268 | `situation_insuline == {naif\|basale_seule\|basale_plus_bolus\|basal_bolus}` (11 occurrences, une par option) | situation_insuline | NEUTRE | Routeur catégoriel. Le défaut `naif` rend vraies les 3 conditions des options « naïf » (l.105,123,145) et fausses les 8 autres — cf. T5 |
| E6 | :146 | `risque_hypoglycemie_schema==eleve OR fragilite==true OR esperance_vie==limitee` | risque_hypoglycemie_schema, esperance_vie | RASSURANT | Option « analogue 2ᵉ génération » : ne s'affiche pas par défaut — la même incohérence que 12.6 s'applique déjà au défaut (l'âge n'entre pas dans cette clause, contrairement à `terrain_fragile`, E2) |
| E7 | :163 | `TBR>4 OR TBR_severe>1 OR CV_glycemique>36 OR profil_glycemique contient hypo_nocturne` | TBR, TBR_severe, CV_glycemique | RASSURANT | Option « Corriger l'hypoglycémie » (situation basale_seule) |
| E8 | :191 (dupl. :210) | `TBR > 4` (exclusion) | TBR | RASSURANT | N'exclut pas par défaut |
| E9 | :192 (dupl. :211) | `TBR_severe > 1` (exclusion) | TBR_severe | RASSURANT | idem |
| E10 | :193 (dupl. :212) | `CV_glycemique > 36` (exclusion) | CV_glycemique | RASSURANT | idem |
| E11 | :246 | `preference_injection == refuse` | preference_injection | RASSURANT | Option « prémélangée dégradée » : défaut `accepte` ≠ `refuse` |
| E12 | :258 | `fragilite==true OR esperance_vie==limitee OR hypo_severe_recurrente==true` | esperance_vie | RASSURANT | Option « Désintensifier » (situation basal_bolus) — même angle mort que E6/12.7 (âge absent) |
| E13 (alerte) | :290 | `hypo_severe_recurrente==true OR CV_glycemique>36 OR TBR_severe>1` | CV_glycemique, TBR_severe | RASSURANT | Alerte « orienter vers le spécialiste » : ne s'affiche pas |
| E14 (alerte) | :305 | `DFG < 45` | DFG | **ALARMANT** | Le cas cité en mission : DFG vide → alerte « insuffisance rénale » affichée (12.1) |

**Reconstitution du décompte (27 lignes réelles, table compressée à 14 lignes affichées)** : la ligne
E5 du tableau ci-dessus résume **11 occurrences** distinctes (une par option, cf. ses 11 numéros de
ligne), et les lignes E8/E9/E10 sont chacune **dupliquées deux fois** dans le fichier (lignes 191/210,
192/211, 193/212), soit 3 occurrences supplémentaires. Décompte ligne à ligne réelle :
ALARMANT = {E3, E14} → **2** ; RASSURANT = {E1, E2, E4, E6, E7, E8×2, E9×2, E10×2, E11, E12, E13} →
**14** ; NEUTRE = {E5×11} → **11**. Total 2+14+11 = **27**, conforme au décompte en tête de section.

### Nœud P — `prescription.yaml` (46 règles — 14 ALARMANT / 29 RASSURANT / 3 NEUTRE)

C'est le nœud le plus riche et celui qui recèle la découverte la plus sévère (cf. T3) : sur formulaire
vierge, l'option socle « Metformine » (`["toujours"]`) est **exclue**, aucune autre option régulière
n'est applicable, si bien que le **repli** (`["default"]`, « Poursuivre le traitement en cours et
réévaluer ») devient la seule sortie affichée — **au même écran qu'une alerte disant d'arrêter la
metformine**.

**Dérivés (4 lignes, D5 exclu — ne mentionne que le critère liste `traitements_en_cours`) :**

| # | Ligne | Expression | Critère(s) | Classement |
|---|---|---|---|---|
| P-D1 | :158 | `HbA1c_actuelle>0 AND HbA1c_actuelle<6.5` → `hba1c_sous_cible` | HbA1c_actuelle ×2 | RASSURANT |
| P-D2 | :166 | `position_vs_cible==a_l_objectif OR ==sous_objectif` → `cible_atteinte` | position_vs_cible ×2 | RASSURANT |
| P-D3 | :169 | `age>=75 OR fragilite OR esperance_vie==limitee OR risque_hypo==eleve` → `terrain_fragile` | age, esperance_vie, risque_hypoglycemie_schema | RASSURANT |
| P-D4 | :179 | `intention==intensifier AND position==au_dessus OR … OR intention==initier AND position==nettement_au_dessus` → `palette_glycemique_ouverte` | intention ×3, position_vs_cible ×3 | RASSURANT |

**Options (30 lignes) :**

| # | Ligne | Expression (résumée) | Option | Critère(s) | Classement | Note |
|---|---|---|---|---|---|---|
| P1 | :220 | `HbA1c_actuelle>=10 AND symptomes... OR cetonemie...` | Insuline d'initiation (condition) | HbA1c_actuelle | RASSURANT | Ne se déclenche pas |
| P2 | :240 | `DFG < 30` (EXCLUSION) | Metformine (socle, `toujours`) | DFG | **ALARMANT** | ⚠ **Exclut le socle « toujours » lui-même sur formulaire vierge** — nouvelle découverte, non présente dans la recette 2026-07-25 |
| P3 | :256 | `DFG < 30` | Arrêter la metformine (condition 2) | DFG | ALARMANT | Vrai par défaut, mais gaté par `traitements_en_cours contient metformine` (faux) |
| P4 | :269 | `DFG>=30 AND DFG<60 OR nature_intolerance==digestive` | Réduire posologie metformine | DFG ×2, nature_intolerance | RASSURANT | `DFG=0` échappe à la bande 30-59 (piège : `0` n'y est pas alors qu'il représente un DFG pire) |
| P5 | :283 | `DFG < 30` | Arrêter le sulfamide (condition 2) | DFG | ALARMANT | Idem P3, gaté par liste vide |
| P6 | :297 | `IC==true OR DFG<60 OR albuminurie!=normo OR ASCVD==true OR palette... OR remplacement...` | Introduire un iSGLT2 (condition) | DFG, albuminurie | **ALARMANT** | Composite VRAI par défaut (porté par `DFG<60`) : l'option se déclenche sur formulaire vierge |
| P7 | :306 | `DFG < 20` (EXCLUSION) | Introduire un iSGLT2 | DFG | ALARMANT | Vrai par défaut, exclut l'option que P6 venait de déclencher — net : n'apparaît pas dans `applicable`, mais apparaît dans `excluded` |
| P8 | :312 | `IC==true OR DFG<60 OR albuminurie!=normo` (priorité) | Introduire un iSGLT2 (rang) | DFG, albuminurie | ALARMANT | Matche en premier par défaut (rang 2) — moot, option exclue par P7 |
| P9 | :314 | `ASCVD==true OR IMC>=30` (priorité) | Introduire un iSGLT2 (rang) | IMC | NEUTRE | Jamais atteinte (P8 déjà vraie) |
| P10 | :342 | `ASCVD==true OR IMC>=30 OR palette... OR remplacement...` | Introduire un AR GLP-1 (condition) | IMC | RASSURANT | Faux par défaut (IMC=0) |
| P11 | :350 | `IMC < 22` (EXCLUSION) | Introduire un AR GLP-1 | IMC | ALARMANT | Vrai par défaut (« dénutrition/maigreur ») — moot, condition P10 déjà fausse |
| P12 | :355 | `preference_injection == refuse` (priorité) | AR GLP-1 (rang) | preference_injection | RASSURANT | Faux par défaut |
| P13 | :357 | `IC==true OR DFG<60 OR albuminurie!=normo` (priorité) | AR GLP-1 (rang) | DFG, albuminurie | **ALARMANT** | Matche en premier par défaut (rang 3) — même mécanisme que la question du référent en capture 5 (doc l.454-459), reproductible dès le formulaire vierge |
| P14 | :359 | `ASCVD==true OR IMC>=30` (priorité) | AR GLP-1 (rang) | IMC | NEUTRE | Jamais atteinte (P13 déjà vraie) |
| P15 | :361 | `IMC < 25` (priorité) | AR GLP-1 (rang) | IMC | NEUTRE | Jamais atteinte |
| P16 | :400 | `IMC >= 30` | Introduire le tirzépatide (condition) | IMC | RASSURANT | Faux par défaut |
| P17 | :411 | `preference_injection == refuse` (priorité) | Tirzépatide (rang) | preference_injection | RASSURANT | Faux par défaut |
| P18 | :436 | `IC==true OR DFG<60 OR albuminurie!=normo` | Association iSGLT2+GLP-1 (condition 1) | DFG, albuminurie | ALARMANT | Vrai par défaut |
| P19 | :437 | `ASCVD==true OR IMC>=30` | Association (condition 2) | IMC | RASSURANT | Faux par défaut — c'est cette fausseté (ANDée avec P18) qui empêche l'option de se déclencher |
| P20 | :447 | `DFG < 20` (EXCLUSION) | Association | DFG | ALARMANT | Vrai par défaut, moot (déjà bloquée par P19) |
| P21 | :450 | `IMC < 22` (EXCLUSION) | Association | IMC | ALARMANT | Vrai par défaut, moot |
| P22 | :453 | `preference_injection == refuse` (priorité) | Association (rang) | preference_injection | RASSURANT | Faux par défaut |
| P23 | :468 | `... contient iSGLT2 AND ... AND IMC<22` (composite) | Envisager l'insuline | IMC (sous-clause) | RASSURANT | Composite global faux (gaté par `traitements_en_cours contient iSGLT2` = faux) |
| P24 | :545 | `DFG < 30` (EXCLUSION) | Remplacer le sulfamide | DFG | ALARMANT | Vrai par défaut, moot (condition sulfamide-en-cours déjà fausse) |
| P25 | :607 | `denutrition==true OR nature_intolerance==perte_poids OR nature_intolerance==digestive` | Réduire posologie AR GLP-1 | nature_intolerance ×2 | RASSURANT | Faux par défaut |
| P26 | :619 | idem | Réduire posologie tirzépatide | nature_intolerance ×2 | RASSURANT | Faux par défaut |
| P27 | :642 | `... AND DFG>=60 AND albuminurie==normo AND ...` (composite) | Reconsidérer un agent protecteur | DFG, albuminurie | RASSURANT | Composite global faux (gaté par liste vide) ; `DFG>=60` faux à `DFG=0` (un des rares cas où le défaut échappe correctement à une lecture « normale ») |
| P28 | :655 | `position_vs_cible != sous_objectif` | Gliptine bas rang (condition 2) | position_vs_cible | RASSURANT | Vrai par défaut (garde ouvert, mais moot — condition 1 déjà fausse) |
| P29 | :684 | `position_vs_cible != sous_objectif` | Sulfamide bas rang (condition 2) | position_vs_cible | RASSURANT | Idem P28 |
| P30 | :691 | `DFG < 30` (EXCLUSION) | Sulfamide bas rang | DFG | ALARMANT | Vrai par défaut, moot |

**Alertes de nœud (12 lignes) :**

| # | Ligne | Expression (résumée) | Critère(s) | Classement | Note |
|---|---|---|---|---|---|
| P31 | :724 | `HbA1c_actuelle>=10 OR symptomes...` | HbA1c_actuelle | RASSURANT | Ne s'affiche pas |
| P32 | :730 | `DFG<60 AND DFG>=45` | DFG ×2 | RASSURANT | `DFG=0` échappe à cette bande (30-44 aussi, P33) |
| P33 | :735 | `DFG<45 AND DFG>=30` | DFG ×2 | RASSURANT | idem |
| P34 | :739 | `DFG < 30` | DFG | **ALARMANT** | ⚠ **S'affiche** : « Metformine CONTRE-INDIQUÉE… arrêter » — déjà signalé par un audit antérieur de cette session (`inventaire-alertes.md`, ligne P4) sur la même ligne 739, ici confirmé et complété par la découverte P2 (le socle est *simultanément* exclu, muettement) |
| P35 | :761 | composite `infections_uro... AND (contient iSGLT2 OR IC OR DFG<60 OR albuminurie!=normo OR ASCVD)` | DFG, albuminurie | RASSURANT | Gaté par `infections_uro...=false`, ne s'affiche pas malgré `DFG<60` vrai |
| P36 | :767 | composite `nature_intolerance==digestive AND ...` | nature_intolerance | RASSURANT | Ne s'affiche pas |
| P37 | :776 | `classes...==true AND risque_hypo==eleve` | risque_hypoglycemie_schema | RASSURANT | Ne s'affiche pas |
| P38 | :782 | `classes...==true AND DFG<45` | DFG | RASSURANT | Gaté par `classes...=false`, ne s'affiche pas malgré `DFG<45` vrai |
| P39 | :793 | `preference_injection==refuse AND (ASCVD OR IMC>=30)` | preference_injection, IMC | RASSURANT | Ne s'affiche pas |
| P40 | :800 | `position==a_l_objectif AND HbA1c>=9 OR position==sous_objectif AND HbA1c>=9` | position_vs_cible ×2, HbA1c_actuelle ×2 | RASSURANT | Alerte de COHÉRENCE : ne s'affiche pas (par coïncidence — `HbA1c=0` n'est pas non plus une vraie valeur « à l'objectif ») |
| P41 | :806 | `intention==intensifier AND hba1c_sous_cible==true` | intention | RASSURANT | Gaté par `intention=initier`, ne s'affiche pas |
| P42 | :811 | `contient insuline AND risque_hypo==eleve` | risque_hypoglycemie_schema | RASSURANT | Gaté par liste vide, ne s'affiche pas |

**Décompte P** : ALARMANT = P2,P3,P5,P6,P7,P8,P11,P13,P18,P20,P21,P24,P30,P34 (14) ; RASSURANT = P-D1 à
P-D4 (4) + P1,P4,P10,P12,P16,P17,P19,P22,P23,P25,P26,P27,P28,P29 (14) + P31,P32,P33,P35,P36,P37,P38,
P39,P40,P41,P42 (11) = 29 ; NEUTRE = P9,P14,P15 (3). Total 46.

### Chaînes d'indirection (bool dérivé d'un nombre/enum, consommé par des règles bool-only)

Ces règles ne sont **pas** dans le tableau ci-dessus (leur propre expression ne nomme aucun
`nombre`/`enum`), mais elles héritent du défaut ALARMANT/RASSURANT de leur critère dérivé :

- **`cible_atteinte`** (E1/P-D2, RASSURANT par défaut = « objectif atteint ») bloque : nœud E,
  « Initier une insuline basale » (l.124, `cible_atteinte==false OR ...`) — explique l'absence
  d'option d'initiation constatée en 12.1 ; « Ne pas sur-titrer la basale » (l.179) ; nœud P,
  « Envisager l'insuline » (l.467).
- **`gaj_a_cible`** (E3, ALARMANT par défaut = « hors cible ») bloque nœud E « Ne pas sur-titrer la
  basale » (l.178, exige `==true`) et **déclenche** « Titrer la basale » (l.199, exige `==false`,
  satisfait par défaut) — le mécanisme exact de 12.3/12.8.
- **`hba1c_sous_cible`** (P-D1, RASSURANT par défaut = « pas de sur-contrôle ») intervient dans
  « Remplacer le sulfamide » (l.543), « Désintensifier » (l.576), « Réduire la posologie de l'insuline »
  (l.595), l'alerte de cohérence (l.806).
- **`terrain_fragile`** (E2/P-D3, RASSURANT) intervient dans les alertes MCG du nœud E (l.317, l.323).
- **`palette_glycemique_ouverte`** et **`remplacement_agent_sans_benefice`** (P-D4/D5, RASSURANT/false)
  interviennent dans les conditions iSGLT2/AR GLP-1/gliptine/sulfamide du nœud P (l.297, l.342, l.654,
  l.683) — mais y sont toujours combinés par `OR` avec une clause `nombre`/`enum` déjà comptée
  (ex. `DFG<60` dans P6), donc sans effet classificatoire supplémentaire.

---

## T3 — Convergence des défauts

| Nœud | Sélection | Sortie sur formulaire 100 % vierge | Convergence vers un tier unique ? |
|---|---|---|---|
| A (cible-glycemique) | ordered-first-match | **« Cible ~6,5 % »** (option 3, la plus stricte) — PAS le repli `["default"]` (« Cible ≤7 % ») | **Oui.** Les 4 clauses A3-A6 (T2) sont toutes vraies par défaut ; l'évaluation en ordre s'arrête dès la 3ᵉ option, avant même d'atteindre le repli. Plus sévère que d'atteindre un repli neutre : c'est une cible ACTIVE et AGRESSIVE qui sort, présentée comme une recommandation motivée. |
| F (statine) | ordered-first-match | **« Discuter la statine (décision partagée) »** (option 2, tier le plus léger) | **Oui — déjà signalé référent (13.1-13.3).** Confirmé ici par lecture directe : F1/F2 (T2) toutes deux vraies par défaut. Le mode ordered-first-match **amplifie** le biais : une seule carte affichée, sans les deux autres tiers en regard. |
| H (rhd) | multi-options | Le socle MHD **seul** (`["toujours"]`, aucune exclusion) ; l'option « Perte de poids renforcée » ne s'ajoute pas (`IMC>=27` faux) | Convergence, mais **vers la sortie la plus anodine des 5 nœuds** : rien n'est ni affirmé à tort de façon alarmante, ni retiré à tort. Seul risque : une escalade légitime (IMC réellement ≥27 mais non saisi) resterait silencieusement absente. |
| E (insuline) | multi-options | Situation « naïf » (routage par défaut) → seule « Envisager un GLP-1 » s'affiche ; « Initier une insuline basale » ne s'affiche PAS (cible_atteinte vrai) ; **alerte DFG<45 s'affiche en parallèle** | Convergence partielle : pas un tier unique dominant comme F, mais une **combinaison incohérente répétée** — silence sur l'option la plus attendue pour un patient naïf non contrôlé, alerte rénale alarmante affichée à côté. Reproduction exacte de 12.1. |
| P (prescription) | multi-options | **Aucune option régulière applicable** (metformine socle exclue par `DFG<30`, toutes les autres bloquées par `traitements_en_cours` vide ou conditions fausses) → le **repli** `["default"]` (« Poursuivre le traitement en cours et réévaluer ») devient la SEULE carte affichée, **simultanément à l'alerte « Metformine CONTRE-INDIQUÉE… arrêter »** | **Oui, et c'est la découverte la plus sévère du présent inventaire** (non documentée dans la recette du 2026-07-25, qui n'a jamais testé un formulaire `prescription` totalement vierge). Le praticien voit : « rien à faire, poursuivre » ET « il faut arrêter la metformine » sur le même écran, sans qu'aucune trace visible n'explique que le socle a été retiré (une option exclue n'apparaît que derrière le lien replié « Pourquoi pas d'autres options ? »). |

**Nœuds ordered-first-match (A, F)** : le biais y est structurellement le plus grave, car la sélection
ne renvoie **qu'une seule** option — la sortie du formulaire vierge n'est jamais mise en balance avec
des alternatives à l'écran. Un nœud multi-options (E, H, P) laisse au moins une chance qu'une autre
carte visible contredise/nuance la première ; en `ordered-first-match`, rien ne la contredit jamais.

---

## T4 — Arithmétique et divisions

Recensement de toute expression `derive`/`calculs` (5 nœuds) comportant `/`, `*` ou `-` (l'addition `+`
n'est pas dans le périmètre demandé, mais 2 cas limitrophes sont signalés en note).

**Aucune arithmétique dans A, F, H, P.** Les seules divisions/multiplications/soustractions des 5 nœuds
sont dans **`insuline.yaml`** :

| # | Ligne | Expression | Opérateur | Valeur à défaut complet | Risque |
|---|---|---|---|---|---|
| T4-1 | :100 (derive) | `dose_basale_actuelle / poids > 0.5` | division | `0/poids` → poids aussi 0 par défaut → `0/0 = NaN`, `NaN>0.5 = false` | **⚠ Dénominateur = critère SAISI (`poids`), défaut 0.** Danger réel dès qu'UN SEUL des deux champs est renseigné et l'autre laissé vide : `dose_basale_actuelle` saisie (ex. 40) + `poids` vide → `40/0 = Infinity`, `Infinity>0.5 = true` → alerte « Dose basale élevée » affichée à tort (12.4, confirmé). **C'est la seule division de tout le contenu DT2** — et son dénominateur est exactement le cas visé par la mission. |
| T4-2 | :141 (calculs) | `poids * 0.1` | multiplication | `poids=0` → **0** | Dose affichée « Dose initiale (0,1 U/kg) ≈ 0 U/j » (12.5, confirmé) |
| T4-3 | :142 (calculs) | `poids * 0.2` | multiplication | `poids=0` → **0** | Idem, « ≈ 0 U/j » |
| T4-4 | :174 (calculs) | `dose_basale_actuelle * 0.8` | multiplication | `dose_basale_actuelle=0` → **0** | « Basale réduite (−20 %) ≈ 0 U/j » |
| T4-5 | :242 (calculs) | `dose_basale_actuelle * 0.1` | multiplication | `dose_basale_actuelle=0` → **0** | « Bolus initial (~10 % de la basale) ≈ 0 U » |

**Division à risque `Infinity`/`NaN`** : une seule (T4-1), dénominateur `poids` = critère saisi par le
praticien, jamais un dérivé — exactement le profil de risque signalé par la mission.

**Doses affichées pouvant valoir 0** : T4-2, T4-3, T4-4, T4-5 (4 calculs, tous dans le nœud E). Note
hors-périmètre strict (`+`, non demandé mais même symptôme) : `dose_basale_actuelle + 2` (insuline.yaml:208,
« Basale après +2 U ≈ 2 U/j » à défaut complet) et `dose_basale_actuelle + dose_rapide_actuelle`
(insuline.yaml:277, « Dose totale quotidienne ≈ 0 U/j ») produisent respectivement un nombre non-nul
mais fictif (2) et un nombre nul (0) à partir de primitives non saisies — le premier cas est en un sens
pire que 0, car un « 2 » a l'apparence d'un vrai calcul.

---

## T5 — Critères `enum` à défaut significatif

| Nœud | Critère | Valeurs déclarées | 1re valeur (= défaut) | Neutre ou affirmatif ? | Réordonner réduirait-il le risque ? |
|---|---|---|---|---|---|
| A | `esperance_vie` | `[longue, intermediaire, limitee]` | `longue` | Affirmatif — asserte une espérance de vie longue, alimente T3 | Oui, mais déplacerait seulement le biais vers un autre tier (`intermediaire` en tête romprait la convergence actuelle vers l'option 3 mais en créerait potentiellement une autre) |
| A | `risque_hypoglycemie_schema` | `[faible, eleve]` | `faible` | Affirmatif — asserte un schéma à faible risque | Oui, seule une inversion binaire ; à combiner avec les autres critères pour casser T3 |
| E | `situation_insuline` | `[naif, basale_seule, basale_plus_bolus, basal_bolus]` | `naif` | **Fortement affirmatif — critère ROUTEUR.** Détermine quelle des 4 branches (≈11 options) s'affiche. Un patient réellement sous basal-bolus dont le champ n'est pas rempli est traité comme naïf (cf. 12.10 : cohérence situation/traitements jamais vérifiée) | **Non** — réordonner ne fait que déplacer le biais vers une AUTRE situation par défaut, tout aussi arbitraire ; un critère routeur à 4 branches n'a structurellement pas de valeur « neutre » |
| E | `esperance_vie` | `[longue, intermediaire, limitee]` | `longue` | Affirmatif (même mécanisme que dans A) | Idem A |
| E | `risque_hypoglycemie_schema` | `[faible, eleve]` | `faible` | Affirmatif | Idem A |
| E | `preference_injection` | `[accepte, refuse, indifferent]` | `accepte` | Faible enjeu — n'affecte qu'une option dégradée (prémélangée) et des rangs de priorité, jamais une exclusion de sécurité | Faible intérêt |
| P | `intention` | `[initier, intensifier, optimiser, deprescrire]` | `initier` | **Fortement affirmatif — critère ROUTEUR.** Masque 3 champs (`traitements_en_cours`, `hypoglycemie_recente`, `intolerance_traitement`) via `visible_si`, et pilote `palette_glycemique_ouverte` | Non, même limite structurelle que `situation_insuline` |
| P | `position_vs_cible` | `[a_l_objectif, au_dessus, nettement_au_dessus, sous_objectif]` | `a_l_objectif` | **Cas unique des 5 nœuds : l'ordre est un choix DÉLIBÉRÉ documenté dans le YAML** (prescription.yaml:74-77, commentaire de l'auteur : « ORDRE DES VALEURS = SÛRETÉ… `a_l_objectif` est la seule valeur inerte sur un formulaire vierge »). Preuve que la technique « réordonner l'enum pour un défaut inerte » est déjà connue et appliquée UNE fois dans ce contenu — mais nulle part ailleurs | **Déjà fait ici** — sert de contre-exemple positif montrant que la technique marche quand elle est appliquée consciemment |
| P | `albuminurie` | `[normo, micro, macro]` | `normo` | Affirmatif mais défendable en isolation (absence de protéinurie est la valeur la plus « neutre » disponible) — reste une affirmation non vérifiée | Faible intérêt, déjà proche de l'optimal |
| P | `nature_intolerance` | `[aucune, digestive, uro_genitale, perte_poids, cutanee, autre]` | `aucune` | Faible enjeu — sous-question cascadée, visible seulement si `intolerance_traitement==true` (lui-même faux par défaut) ; `aucune` est cohérent avec ce contexte | Non nécessaire |
| P | `esperance_vie` | `[longue, intermediaire, limitee]` | `longue` | Affirmatif | Idem A |
| P | `risque_hypoglycemie_schema` | `[faible, eleve]` | `faible` | Affirmatif | Idem A |
| P | `preference_injection` | `[indifferent, accepte, refuse]` | `indifferent` | Faible enjeu | — |

**Incohérence transverse relevée** : `preference_injection` est un critère du même nom dans les nœuds E
et P, mais déclaré dans un ORDRE différent (`[accepte, refuse, indifferent]` en E vs.
`[indifferent, accepte, refuse]` en P) — donc un défaut différent (`accepte` vs `indifferent`) pour ce
qui devrait être le même concept clinique. Même famille de défaut que la « cause racine n°3 » déjà
identifiée par le référent en synthèse de capture 12 (« un même concept clinique encodé deux fois,
différemment ») — ici entre deux nœuds plutôt qu'à l'intérieur d'un seul.

**Nœuds F et H : aucun critère `enum`** — hors périmètre de T5.

---

## T6 — Ce que les tests ne peuvent pas voir

`engine/relevance.ts` (`criteresPertinents`, `champsDecisifsManquants`) et
`engine/banc/profils.ts` (`genererProfils`, `tailleBanc`, `genererPairesBooleennes`) opèrent tous deux
exclusivement sur le type `Criteria = Record<string, number | boolean | string | string[]>`
(`engine/conditions.ts:31-34`) — un type qui n'a **aucune troisième valeur** pour « non renseigné ». Un
`nombre` y est toujours un `number` JS concret ; il n'existe pas de distinction structurelle entre
« le praticien a mesuré 0 » et « le champ n'a jamais été touché ». Trois conséquences précises :

1. **`genererProfils` (profils.ts:280-290) n'assigne jamais une valeur « absente ».** Pour un critère
   `nombre`, `seuilsNumeriques` (profils.ts:106-120) construit un ensemble de candidats numériques
   (littéraux des règles ±1, plus les bornes 0 et 999) — `0` y est un candidat **parmi d'autres**,
   syntaxiquement identique à un `0` réellement mesuré. Un profil généré avec `DFG=0` par le banc est
   donc, du point de vue du type `Criteria` et de tout ce qui le consomme, **indiscernable** d'un
   formulaire vierge. Aucun invariant du banc ne peut donc écrire « ce profil-ci représente une absence
   de saisie » — cette information est perdue avant même que `genererProfils` s'exécute.
2. **`criteresPertinents` (relevance.ts:96-109) compare toujours à une référence qui EST déjà le
   défaut.** `const reference = signature(node, criteria)` (relevance.ts:97) calcule la signature à
   partir de l'objet `criteria` reçu — sur un formulaire non touché, cet objet est exactement
   `buildDefaultCriteria()`. Le moteur de pertinence peut détecter qu'un champ *ferait bouger* la
   sortie s'il changeait de valeur ; il ne peut structurellement jamais détecter que la sortie DE
   RÉFÉRENCE elle-même (celle produite par le défaut, avant toute frappe) est déjà une affirmation
   clinique chargée (« insuffisance rénale », « objectif atteint »). Le défaut n'est jamais questionné
   en tant que tel, seulement utilisé comme point de départ neutre pour la perturbation.
3. **Les invariants du banc testent des propriétés de `evaluateNode` en fonction de `Criteria`, jamais
   la construction de `Criteria` elle-même.** L'ambiguïté « 0 saisi » vs « 0 par défaut » est résolue
   **en amont**, dans `buildDefaultCriteria`/`CriteriaForm.tsx` (`lib/formLayout.ts:36-41`), avant que
   `evaluateNode` ou `genererProfils` ne voient quoi que ce soit. Un invariant écrit contre
   `evaluateNode` (ex. `genererPairesBooleennes`, profils.ts:309-327, qui compare deux profils identiques
   sauf un booléen) ne peut par construction pas exprimer « et si ce nombre n'avait PAS de valeur » —
   cette question n'a pas de représentant dans le domaine qu'il explore.

Concrètement, la synthèse de la capture 12 de la recette (ligne 1294-1300 du document lu) propose déjà
un invariant futur — « aucune option ni alerte ne se prononce sur un critère numérique non renseigné »
— et note qu'il s'agirait d'un ajout, pas d'une extension d'un contrôle existant. Cette lecture directe
du code la confirme : ni `relevance.ts` ni `profils.ts` ne peuvent aujourd'hui exprimer cet invariant,
quelle que soit la sophistication de la stratégie d'échantillonnage (produit cartésien complet ou
stratifié) — le blocage est un blocage de **type** (`Criteria` n'a pas de valeur « indéterminé »), pas
un blocage de couverture de test.

---

## Récapitulatif chiffré

| Nœud | Sélection | Lignes T2 | ALARMANT | RASSURANT | NEUTRE | Convergence T3 |
|---|---|---|---|---|---|---|
| A — cible-glycemique | ordered-first-match | 6 | 0 | 6 | 0 | Oui → option la plus stricte |
| F — statine | ordered-first-match | 3 | 0 | 3 | 0 | Oui → tier le plus léger (déjà connu) |
| H — rhd | multi-options | 4 | 0 | 4 | 0 | Oui → socle seul (bénin) |
| E — insuline | multi-options | 27 | 2 | 14 | 11 | Partielle → silence + alerte rénale |
| P — prescription | multi-options | 46 | 14 | 29 | 3 | Oui → sortie contradictoire (nouveau) |
| **Total** | | **86** | **16** | **56** | **14** | |
