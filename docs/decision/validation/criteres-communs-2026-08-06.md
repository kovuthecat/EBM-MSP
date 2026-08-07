# Critères communs de sécurité — matrice et verdicts (P14/S14, 2026-08-06)

> Diagnostic uniquement. Produit pour S15 (fichier `criteres-communs.yaml`, hors périmètre ici) et pour
> S17/S18/S19 (correction des « défaut »), qui ne modifient du contenu clinique qu'après relecture
> référent de ce document (N2). Aucune modification de contenu, moteur, schéma ou test dans cette session.

## 0. Méthode

**Régénérée depuis les 6 YAML de `content/decision/noeuds/diabete-type-2/`, pas recopiée du plan.**
Un critère « sert un canal de sécurité » sur un nœud s'il apparaît dans au moins une des trois positions
que R8 (`GRAMMAIRE-NOEUD.md`) reconnaît comme un canal de fait de sécurité :

1. la `conditions` d'une option `role: securite` ;
2. une `exclusions` (de n'importe quelle option — R8 : un fait qui retire un geste est un canal de
   sécurité que l'option qui le porte soit étiquetée `securite` ou non, cf. les nœuds RHD qui n'ont
   **aucune** option `role: securite` et portent pourtant des `exclusions`) ;
3. le `quand` d'une alerte **`niveau: attention`** (de nœud ou d'option) — les alertes `niveau: info`
   sont exclues : elles ne qualifient pas un geste, elles informent (cadrage, cibles MCG, etc.).

**Cinq critères mécaniquement écartés du décompte**, parce qu'ils apparaissent bien dans un de ces trois
canaux mais ne sont pas des *faits de sécurité* au sens de R8 (un fait *sur le patient*) — ce sont des
critères de flux ou de bookkeeping interne :

- `intention`, `situation_insuline` — des **primers** (R11/R12 : « ce que le praticien veut faire »,
  jamais un fait sur le patient) : ils apparaissent dans presque toutes les conditions comme garde
  technique (`intention != initier AND …`), sans être eux-mêmes le fait de sécurité ;
- `preference_injection` — une **préférence** du patient, pas un fait de sécurité ;
- `metformine_deprescriptible`, `metformine_seule_en_cours` — deux dérivés **anti-doublon d'affichage**
  (« une seule carte metformine reste à l'écran »), qui ne recombinent que des faits déjà comptés
  ailleurs (DFG, dose, intolérance) sans en ajouter.

Avec cette exclusion, le total tombe exactement sur **41** — la mesure de cadrage du 2026-08-06 est donc
confirmée sur ce chiffre. Sans cette exclusion (lecture strictement littérale, sans jugement sur la
nature du critère), le total est de 46. Les deux méthodes sont documentées ; celle retenue pour la suite
du document est celle à 41, qui isole les faits réellement cliniques.

**Contrôle de fidélité — 3 lignes reprises au hasard et vérifiées à la main dans les YAML** (au sens de
la validation prescrite) :

- `DFG` : `prescription.yaml:829-834` (option « Metformine (DFG < 30) », `role: securite`,
  `conditions: ["…", "DFG < 30"]`) et `insuline.yaml:1824-1825` (alerte de nœud
  `quand: "DFG < 45", niveau: attention`) → CANAL confirmé sur les deux nœuds.
- `retinopathie_non_stabilisee_ou_proliferante` : `rhd-activite-physique.yaml:390-391`, `exclusions`
  d'une option `role: geste` (« Envisager un programme d'activité physique adaptée… »),
  `"limitation_physique_connue == true OR symptomes_ischemie_effort == true OR
  retinopathie_non_stabilisee_ou_proliferante == true OR neuropathie_ou_mal_perforant_plantaire == true"`
  → CANAL confirmé, mono-nœud (absent des 5 autres YAML — vérifié par recherche du nom exact).
- `consommation_vin` : `rhd-alimentation.yaml:661-662`, alerte de nœud
  `quand: "consommation_vin == sept_verres_ou_plus_semaine", niveau: attention` → CANAL confirmé,
  mono-nœud.

**Écart au chiffre « 30 mono-nœuds » du cadrage** : cette régénération trouve **36 faits mono-nœud** (et
5 faits multi-nœuds : `traitements_en_cours`, `DFG`, `fragilite`, `ASCVD_etablie`,
`insuline_ou_insulinosecreteur`). L'écart (36 contre « ~30 ») n'est pas franc au sens du garde-fou de
cette tâche (même ordre de grandeur, même total de 41, et **les 3 exemples nommément cités par le plan
— `hypo_severe_recurrente`, `cetonemie`, `fragilite` — sont reproduits par cette régénération avec
exactement les mêmes nœuds porteurs et absents** que ceux du plan, preuve croisée que la méthode est
correcte). L'écart vient vraisemblablement d'un curseur légèrement différent sur deux critères
frontière (`position_vs_cible`, `hba1c_sous_cible` — des alertes de *cohérence de saisie* plutôt que de
*danger patient* au sens strict) : les inclure ou les exclure ne change qu'eux-mêmes (mono-nœud dans les
deux cas), donc ne change jamais un verdict. Signalé à la relecture référent (N2), pas bloquant.

## 1. La matrice (41 faits × 6 nœuds)

États : **∅** absent · **d** déclaré (dans `criteres_entree`, hors canal de sécurité) · **●** déclaré ET
canal de sécurité.

| Fait | prescription | insuline | statine | cible-glycémique | rhd-activité | rhd-aliment. |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| `traitements_en_cours` | ● | ● | ∅ | ∅ | ∅ | ∅ |
| `DFG` | ● | ● | ∅ | ∅ | ∅ | ∅ |
| `dose_metformine` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `intolerance_traitement` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `nature_intolerance` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `cetonemie` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `symptomes_glucotoxicite` | ● | d | ∅ | ∅ | ∅ | ∅ |
| `IMC` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `denutrition` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `isglt2_indisponible` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `aglp1_indisponible` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `HbA1c_actuelle` | ● | d | ∅ | ∅ | ∅ | ∅ |
| `fragilite` | ● | d | d | d | ● | ● |
| `infections_uro_genitales_recidivantes` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `insuffisance_cardiaque` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `albuminurie` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `ASCVD_etablie` | ● | ∅ | ● | ∅* | ∅ | ∅ |
| `risque_hypoglycemie_schema` | ● | d | ∅ | ∅ | ∅ | ∅ |
| `position_vs_cible` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `hba1c_sous_cible` | ● | ∅ | ∅ | ∅ | ∅ | ∅ |
| `mcg_disponible` | ∅ | ● | ∅ | ∅ | ∅ | ∅ |
| `TBR` | ∅ | ● | ∅ | ∅ | ∅ | ∅ |
| `CV_glycemique` | ∅ | ● | ∅ | ∅ | ∅ | ∅ |
| `gaj_basse` | ∅ | ● | ∅ | ∅ | ∅ | ∅ |
| `cible_atteinte` | d | ● | ∅ | ∅ | ∅ | ∅ |
| `gaj_a_cible` | ∅ | ● | ∅ | ∅ | ∅ | ∅ |
| `profil_nocturne_a_cible` | ∅ | ● | ∅ | ∅ | ∅ | ∅ |
| `over_basalisation` | ∅ | ● | ∅ | ∅ | ∅ | ∅ |
| `profil_nocturne` | ∅ | ● | ∅ | ∅ | ∅ | ∅ |
| `hypo_severe_recurrente` | ∅ | ● | ∅ | ∅ | ∅ | ∅ |
| `intolerance_statine` | ∅ | ∅ | ● | ∅ | ∅ | ∅ |
| `CK_x_normale` | ∅ | ∅ | ● | ∅ | ∅ | ∅ |
| `statine_deja_en_place` | ∅ | ∅ | ● | ∅ | ∅ | ∅ |
| `dialyse` | ∅ | ∅ | ● | ∅ | ∅ | ∅ |
| `age` | d | d | ● | d | ∅ | ∅ |
| `limitation_physique_connue` | ∅ | ∅ | ∅ | ∅ | ● | ∅ |
| `symptomes_ischemie_effort` | ∅ | ∅ | ∅ | ∅ | ● | ∅ |
| `retinopathie_non_stabilisee_ou_proliferante` | ∅ | ∅ | ∅ | ∅ | ● | ∅ |
| `neuropathie_ou_mal_perforant_plantaire` | ∅ | ∅ | ∅ | ∅ | ● | ∅ |
| `insuline_ou_insulinosecreteur` | ∅ | ∅ | ∅ | ∅ | ● | ● |
| `consommation_vin` | ∅ | ∅ | ∅ | ∅ | ∅ | ● |

\* `cible-glycemique` ne déclare pas `ASCVD_etablie` : il déclare `antecedent_cv`, un nom distinct pour
un fait voisin non identique — cf. §5, arbitrage 1. Il n'apparaît donc pas comme « déclaré » dans cette
ligne, volontairement : la ligne parle du fait nommé `ASCVD_etablie`, pas de son cousin.

**Total : 41 faits, 36 mono-nœud** (à l'exclusion des 5 multi-nœuds `traitements_en_cours`, `DFG`,
`fragilite`, `ASCVD_etablie`, `insuline_ou_insulinosecreteur`) — contre « ~30 » au cadrage du
2026-08-06 ; écart signalé et expliqué ci-dessus, non franc (cf. §0).

## 2. Verdicts — les 5 faits multi-nœuds

Ce ne sont pas des faits « mono-nœud » (étape 2 ne les couvre pas au sens strict), mais deux d'entre eux
appellent un mot :

- **`traitements_en_cours`** (prescription, insuline) et **`DFG`** (prescription, insuline) — encodage
  identique, `partage: true`, canal de sécurité symétrique sur les deux nœuds qui prescrivent des
  classes. **Légitime**, rien à signaler.
- **`insuline_ou_insulinosecreteur`** (rhd-activité, rhd-alimentation) — encodage identique,
  `partage: true`, vérifié par I32 selon les commentaires du contenu. **Légitime.**
- **`ASCVD_etablie`** (prescription, statine) — encodage identique. **Légitime en tant que tel** ; son
  problème n'est pas la symétrie entre ces deux nœuds mais son rapport à `antecedent_cv` (cible-
  glycémique) — cf. arbitrage 1, §5.
- **`fragilite`** (5 nœuds déclarés, canal dans 3) — **à arbitrer**, cf. §5, arbitrage 2. C'est le seul
  des 5 faits multi-nœuds où le nombre de nœuds « canal » (3) est strictement inférieur au nombre de
  nœuds « déclaré » (5) : une asymétrie de rôle, pas de définition (l'encodage est identique partout).

## 3. Verdicts — les 36 faits mono-nœud

### 3.1 Défauts (2)

| Fait | Vit dans | Nœud concerné | Classe/geste concerné | Ce que le patient perd |
| --- | --- | --- | --- | --- |
| `hypo_severe_recurrente` | `insuline` (alertes de nœud, `insuline.yaml:1778`, `:1793`) | `prescription` | Sulfamide, glinide — les deux classes qui exposent à l'hypoglycémie sévère, prescrites ou poursuivies par ce nœud | `prescription` ne voit jamais cet antécédent : l'`aide` de `risque_hypoglycemie_schema` en parle en prose (« Élevé si… hypoglycémie sévère antérieure »), mais rien ne le transforme en critère saisi — la traduction est laissée au praticien |
| `cetonemie` | `prescription` (2 options `role: securite` : « iSGLT2 » `:961`, « Insuline d'initiation » `:1020`) | `insuline` | Tout ajustement de schéma (titration, ajout de bolus, choix de molécule) | Un patient en cétonémie confirmée, vu sur le nœud Insulinothérapie (par exemple pour un ajustement de dose), n'obtient aucune alerte d'urgence catabolique — le seul texte qui en parle sur ce nœud est la mention iSGLT2/acidocétose euglycémique (`insuline.yaml:1815`), qui ne lit pas `cetonemie` elle-même |

Ces deux lignes reproduisent exactement D9 et D5 de la revue de conception du 2026-08-04 — cette
régénération les confirme, elle ne les découvre pas.

### 3.2 Légitimes (34)

Regroupés par nœud, avec le motif commun à la famille plutôt que 34 paragraphes individuels — chacun
vérifiable en une ligne dans la matrice ci-dessus.

- **`prescription` (14 faits restants, hors les 2 défauts et hors `ASCVD_etablie`/`fragilite`/
  `position_vs_cible`/`hba1c_sous_cible` déjà traités)** — `dose_metformine`, `intolerance_traitement`,
  `nature_intolerance` : spécifiques au geste « ajuster/arrêter la metformine », qu'aucun autre nœud ne
  fait. `IMC`, `denutrition`, `isglt2_indisponible`, `aglp1_indisponible`, `infections_uro_genitales_
  recidivantes`, `insuffisance_cardiaque`, `albuminurie` : gates d'indication d'une classe (iSGLT2,
  AR GLP-1) que seul `prescription` choisit — `insuline` gère la poursuite d'un iSGLT2 déjà en place
  (sa propre alerte acidocétose, `insuline.yaml:1815`) mais pas son *indication initiale*, qui reste le
  périmètre de `prescription`. `risque_hypoglycemie_schema` : `insuline` le déclare aussi et l'utilise
  réellement (`derive` de `risque_hypoglycemique_eleve`, `insuline.yaml:563`) — pas absent, seulement
  consommé par un canal différent (un `role: geste`, pas un canal de sécurité au sens strict) ; cette
  différence de mécanisme n'a pas d'équivalent en perte pour le patient, donc légitime. `HbA1c_actuelle`,
  `symptomes_glucotoxicite` : même situation — `insuline` les déclare et les utilise (options d'initiation
  chez le patient naïf, `insuline.yaml:708,742`), par une voie qui n'est pas un canal de sécurité au sens
  de cette matrice, mais qui n'est pas un silence non plus.
- **`insuline` (10 faits)** — `mcg_disponible`, `TBR`, `CV_glycemique`, `gaj_basse`, `gaj_a_cible`,
  `profil_nocturne_a_cible`, `over_basalisation`, `profil_nocturne` : vocabulaire de titration de
  l'insulinothérapie (mesure continue du glucose, courbe nocturne, sur-basalisation) sans objet hors de
  ce nœud — aucun autre nœud n'ajuste une dose d'insuline. `cible_atteinte` (version insuline, dérivé
  propre `HbA1c_actuelle <= HbA1c_cible`) : local à la logique de titration de ce nœud (`prescription`
  a son propre dérivé du même nom, décliné différemment — cf. remarque en §4, pas une divergence à
  arbitrer, les deux nœuds l'ont chacun résolu sans collision de nom).
- **`statine` (5 faits)** — `intolerance_statine`, `CK_x_normale`, `statine_deja_en_place`, `dialyse`,
  `age` (via l'alerte > 75 ans) : vocabulaire de tolérance/contre-indication propre à la statine (seuils
  de CK, dialyse, âge en prévention primaire) — sans objet pour un autre nœud, qui ne prescrit pas de
  statine.
- **`rhd-activite-physique` (4 faits)** — `limitation_physique_connue`, `symptomes_ischemie_effort`,
  `retinopathie_non_stabilisee_ou_proliferante`, `neuropathie_ou_mal_perforant_plantaire` : les quatre
  composants du verrou de sécurité à l'effort (HAS R.19/R.27/R.28), qui n'ont de sens que pour juger si
  une pratique structurée est sûre — aucun nœud de prescription médicamenteuse n'en a l'usage.
- **`rhd-alimentation` (1 fait)** — `consommation_vin` : repérage de mésusage alcoolique propre au
  recueil alimentaire, sans objet ailleurs.

## 4. Liste candidate au fichier commun (S15)

Les faits qui doivent être définis au domaine (au sens de P2, `docs/decision/validation/
revue-conception-fable-2026-08-04.md` §7), avec la définition retenue :

| Fait | Définition retenue | Nœuds à faire pointer dessus |
| --- | --- | --- |
| `hypo_severe_recurrente` | type `bool`, tel que défini aujourd'hui dans `insuline.yaml` (aucune définition concurrente à arbitrer — le fait n'existe que là) | `insuline` (déjà) + `prescription` (à ajouter, S17/S18/S19) |
| `cetonemie` | type `bool`, tel que défini aujourd'hui dans `prescription.yaml` (aucune définition concurrente — le fait n'existe que là) | `prescription` (déjà) + `insuline` (à ajouter, S17/S18/S19) |

Deux candidats seulement, et c'est le point à retenir pour S15 : la matrice ne montre **aucun cas de
définitions divergentes** à trancher pour ces deux faits (contrairement à `antecedent_cv`/`ASCVD_etablie`,
§5) — un seul nœud a jamais défini chacun, l'autre ne le voit pas du tout. Le fichier commun n'a donc,
pour ces deux entrées, qu'à *copier* une définition existante, pas à en arbitrer une nouvelle.

`fragilite` **n'est pas candidate à ce fichier** au sens strict : elle y est déjà (`partage: true`,
définition identique sur les 5 nœuds qui la déclarent, condition de l'invariant I19). Ce qui reste ouvert
la concernant est un choix de *rôle* par nœud (canal de sécurité ou simple critère), pas de définition —
hors périmètre d'un fichier de définitions communes ; c'est une décision de contenu par nœud, à la charge
de S17/S18/S19 après lecture de l'arbitrage 2 (§5).

## 5. Liste de ce qui reste local

Les 34 faits « légitimes » du §3.2 restent déclarés nœud par nœud, chacun avec son motif propre — décrit
en détail au §3.2, pas répété ici. Le principe qui les unit : un fichier commun qui absorbe un vocabulaire
de titration insulinique (MCG, TBR, courbe nocturne), un vocabulaire de tolérance aux statines (CK,
dialyse) et un vocabulaire de sécurité à l'effort (rétinopathie, ischémie) transformerait
`criteres-communs.yaml` en second endroit où tout est déclaré — l'écueil que l'étape 4 de T-186 demande
explicitement d'éviter. Seuls les faits qu'*un autre nœud prescrivant une classe concernée* ne voit pas
(le test du §3.1) justifient la mutualisation.

## 6. Arbitrages ouverts — posés, pas tranchés

### Arbitrage 1 — `antecedent_cv` (cible-glycémique) et `ASCVD_etablie` (prescription, statine) désignent-ils le même fait ?

**Ce que dit le contenu aujourd'hui.** Deux noms, deux nœuds d'origine, deux `criteres_entree`
indépendants — aucun `derive` ne relie l'un à l'autre, aucun commentaire du dépôt n'affirme
l'équivalence. `ASCVD_etablie` porte `presomption_non: true` sur `statine` et `prescription` (éligible
mécaniquement, D30/T-018) ; `antecedent_cv` porte la même mention sur `cible-glycemique`. Les deux sont
donc traités par le moteur de la même façon technique (indéterminé jusqu'à réponse, présumé « non »
faute de réponse) — ce qui ne dit rien de leur définition clinique.

**Ce qui est mesuré, si on les traite comme le même fait.** Sur `cible-glycemique`,
`antecedent_cv == true` — **seul**, sans fragilité, sans comorbidité grave, sans espérance de vie
limitée — fait passer la cible de 7 % (repli) à 8 % (`cible-glycemique.yaml:76`, condition
`"fragilite == true OR comorbidite_grave == true OR esperance_vie == limitee OR antecedent_cv == true"`).
La SFD (citée dans l'argumentaire du nœud) réserve ce relâchement à la maladie cardiovasculaire
**évoluée**, pas à un antécédent au sens large. Si `antecedent_cv` est lu au sens large (tout antécédent,
y compris un événement ancien et stabilisé) alors qu'`ASCVD_etablie` — utilisé par `prescription` pour
indiquer un iSGLT2/AR GLP-1 et par `statine` pour la prévention secondaire — est défini plus
restrictivement (maladie établie, au sens des essais CTT/HPS), les deux noms ne se recouvrent pas et le
relâchement de cible à 8 % pourrait s'appliquer à des patients pour lesquels ni `prescription` ni
`statine` ne considéreraient la même chose comme « établie ».

**Ce qui manque pour trancher.** Une définition écrite, comparable, des deux critères — aujourd'hui
aucun des deux fichiers ne définit précisément ce qui compte comme « antécédent cardiovasculaire » vs
« maladie cardiovasculaire établie » (infarctus ancien ? AVC ? artériopathie asymptomatique détectée par
imagerie ? angor stable ?). Sans cette définition posée par le référent, impossible de dire si la fusion
des deux noms est une clarification sans risque ou un changement de seuil clinique déguisé en
renommage.

### Arbitrage 2 — `fragilite` : canal de sécurité sur 3 nœuds, simple critère sur 2 — faut-il uniformiser le rôle ?

**Ce que dit le contenu aujourd'hui.** `fragilite` est déclarée à l'identique (`partage: true`, même
type, même absence de `presomption_non`) sur `prescription`, `insuline`, `cible-glycemique`,
`rhd-activite-physique`, `rhd-alimentation`. Elle sert de canal de sécurité (alerte `niveau: attention`
ou `exclusions`) sur 3 de ces 5 nœuds : `prescription` (alerte incrétine + dénutrition,
`prescription.yaml:2434`), `rhd-activite-physique` (alerte, `:549`), `rhd-alimentation` (exclusions sur
deux options, `:392`, `:546`). Sur `insuline` et `cible-glycemique`, elle est lue mais seulement par des
options `role: geste` — jamais un canal de sécurité au sens de R8.

**Ce qui manque pour trancher.** Est-ce une différence *voulue* — `insuline`/`cible-glycemique`
n'ont-ils vraiment aucun geste dont la fragilité change la sécurité (par opposition à la seule cible ou
au seul dosage) — ou un oubli, du même ordre que `hypo_severe_recurrente`/`cetonemie` (§3.1), mais que
la matrice ne classe pas « défaut » ici faute d'un geste concret identifié et d'une perte patient nommée
(les deux éléments que l'étape 2 de T-186 exige pour un verdict « défaut », et qu'on ne peut pas écrire
sans un jugement clinique sur ce que la fragilité *devrait* changer sur ces deux nœuds).

## 7. Renvoi

`PROJECT_MAP.md` § « Contenu (autorité) » pointe désormais vers ce document (T-186, étape 6).
