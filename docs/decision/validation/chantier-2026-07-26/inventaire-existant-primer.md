# Inventaire — état existant non modélisé & primer incomplet (5 nœuds DT2)

> Lecture seule. Aucun fichier de `content/` ni `src/` modifié. Ce document est un inventaire des
> cibles à corriger, pas un encodage — aucun YAML rédigé.
>
> Sources lues intégralement : les 5 nœuds (`content/noeuds/diabete-type-2/*.yaml`),
> `schema/noeud.schema.json`, `docs/decision/GRAMMAIRE-NOEUD.md`,
> `docs/decision/validation/recette-2026-07-25-prescription-intensifier.md` (captures 1-13),
> `src/features/decision/lib/formLayout.ts`, `src/features/decision/engine/evaluateNode.ts`.

---

## Méthode

Les deux défauts du brief sont traités nœud par nœud, avec citation systématique fichier + ligne.
Quand une affirmation ne peut pas être vérifiée avec certitude par lecture statique (ex. interaction
fine entre deux dérivés), le document dit « incertain » plutôt que de trancher.

Rappel des deux pièges à signaler partout où ils se posent (mécanique confirmée dans
`lib/formLayout.ts:36-41` et `:101-131`) :

- **P1 — masquer ≠ effacer.** `reinitialiserChampsMasques` remet un champ masqué à sa
  `valeurParDefaut` (`nombre`→0, `bool`→false, `enum`→1re valeur déclarée, `liste`→`[]`). Un
  `visible_si` proposé qui masquerait un champ encore lu par une règle ou un `calculs` non filtrée par
  la même situation ferait entrer une valeur par défaut dans cette règle — signalé à chaque occurrence
  trouvée.
- **P2 — filtrer un primer déclaratif est irréversible en silence.** Si le praticien se trompe de
  primer (mauvaise `intention`, mauvaise `situation_insuline`), une famille d'options **supprimée**
  disparaît sans trace ; une famille **reléguée + expliquée** reste consultable. Chaque proposition de
  filtrage de sortie (T4b) est qualifiée de l'une ou l'autre forme.

---

## T1 — Inventaire de l'existant

| Nœud | Critères « déjà en place » présents | Gestes qui supposent l'existant sans le lire | Verdict |
|---|---|---|---|
| `prescription` | `traitements_en_cours` (liste, `:56-62`, masqué si `intention==initier`) ; `intolerance_traitement`+`nature_intolerance` (`:117-129`, masqués si `intention==initier`). **Aucune dose** pour aucune molécule. | « Metformine (socle) — instaurer ou poursuivre » (`:234`) — intitulé conflate 2 états sans les distinguer (R3, confirmé recette capture 1, pb 3, `recette:139-147`) ; « Réduire la posologie de la metformine » (`:266`) — vérifie la présence (`:268`) mais pas la dose (recette capture 1, pb 2, `recette:132-137`) ; « Envisager l'insuline » (`:465`) et « Insuline d'initiation » (`:218`) — aucun des deux ne vérifie l'absence d'insuline dans `traitements_en_cours` (confirmé recette capture 4, `recette:372-384`). | **Partiel** |
| `insuline` | `situation_insuline` (primer déclaratif, `:41-43`) ; `traitements_en_cours` (liste incl. `insuline_basale`/`insuline_rapide`, `:70-72`) ; `dose_basale_actuelle`/`dose_rapide_actuelle` (`:94-97`, la dose EXISTE ici, contrairement à `prescription`). Mais **`situation_insuline` et `traitements_en_cours` ne sont jamais recoupés** — aucune expression du fichier ne compare les deux. | « Initier une insuline basale » (`:121`) ne vérifie pas `ne_contient_pas insuline_basale` ; plus largement, TOUTES les options des situations 2 à 4 (basale seule/basal-plus/basal-bolus) gatent uniquement sur `situation_insuline`, jamais sur `traitements_en_cours`, alors que le mécanisme de réduction/titration suppose implicitement qu'une dose d'insuline existe déjà. Confirmé recette 12.10 (`recette:1250-1255`). | **Partiel** (inventaire plus riche que `prescription` sur la dose, mais le primer et l'inventaire vivent dans deux canaux jamais recoupés — défaut plus structurel) |
| `statine` | **Aucun.** `criteres_entree` (`:42-53`) : `age`, `ASCVD_etablie`, `anciennete_diabete_annees`, `autres_FDRCV`, `diabete_complique`, `dialyse` — zéro champ sur un traitement statine en cours ou une intolérance. | Les 3 options (`:55`, `:75`, `:90`) sont toutes formulées en INITIER/DISCUTER ; l'alerte dialyse (`:118-124`) énonce « Si une statine est déjà en place, sa poursuite est raisonnable » sans aucun moyen de le savoir (confirmé recette 13.7, `recette:1391-1396`). | **Aucun** |
| `cible-glycemique` | Sans objet — le nœud ne prescrit aucun traitement (il fixe une bande cible d'HbA1c) ; `criteres_entree` (`:11-27`) ne comporte aucun champ de traitement. Aucune des 4 options (`:29-75`) ne propose de geste médicamenteux. | Aucun. | **N/A** (nature du nœud, pas un défaut) |
| `rhd` | `traitements_en_cours` (liste, `:46-48`) ; `alimentation_equilibree`/`activite_physique_reguliere` (`:42-44`, état d'hygiène de vie déjà en place). | `traitements_en_cours` n'alimente qu'UNE alerte (hypoglycémie, `:264-268`), jamais une condition d'option. `alimentation_equilibree`/`activite_physique_reguliere` n'alimentent qu'UNE alerte (« mode de vie déjà optimisé », `:248-253`), jamais le contenu de l'option socle elle-même — confirmé recette capture 11 : un patient déjà optimisé (profil B) reçoit une carte socle **identique mot pour mot** à un patient qui ne l'est pas du tout (profil A) (`recette:830-869`). | **Partiel** (état collecté, jamais branché sur le contenu des options — seulement sur des alertes) |

**Décompte T1 : 5 nœuds traités — 1 aucun (`statine`), 3 partiel (`prescription`, `insuline`, `rhd`), 1 N/A (`cible-glycemique`).**

---

## T2 — Options sans prérequis de cohérence

### `prescription.yaml`

| Intitulé | Lignes | Type d'écart | Prérequis manquant |
|---|---|---|---|
| « Envisager l'insuline (palette non-insulinique épuisée…) » | `:465-480` (conditions `:466-468`, pas de champ `prerequis`) | INITIE sans vérifier l'absence | `traitements_en_cours ne_contient_pas insuline` — confirmé recette capture 4 (`recette:372-384`) |
| « Insuline d'initiation (souvent transitoire — état catabolique) » | `:218-233` (conditions `:219-220`, pas de champ `prerequis`) | INITIE sans vérifier l'absence | `traitements_en_cours ne_contient_pas insuline` — non observé en recette mais même lacune structurelle : rien n'empêche ce libellé « d'initiation » de s'afficher chez un patient déjà sous insuline en décompensation |
| « Metformine (socle du traitement) — instaurer ou poursuivre » | `:234-251` (`conditions: ["toujours"]`) | Défaut de formulation (pas un défaut de prérequis — l'option est volontairement `toujours` donc un prérequis d'absence casserait le socle) | Aucun prérequis à ajouter ; le défaut est l'intitulé lui-même, qui affirme « instaurer » même quand `traitements_en_cours contient metformine` — confirmé recette capture 1, problème 3 (`recette:139-147`) |

**Options correctement gardées (contrôle négatif, pour mémoire) :** « Introduire un iSGLT2 » (`:295`, prerequis `:302-304`), « Introduire un AR GLP‑1 » (`:335`, prerequis `:344-347`), « Introduire le tirzépatide » (`:398`, prerequis `:404-408`), « Association iSGLT2 + AR GLP‑1 » (`:434`, prerequis `:441-446`), « Gliptine (sitagliptine) » (`:652`, prerequis `:658-661`), « Sulfamide » (`:681`, prerequis `:687-689`) — 6 des 8 options « ajouter/initier » de la famille « Agent à ajouter » sont bien gardées ; seules les 2 citées en tête de tableau ne le sont pas.

**Cas inverse (arrêter/réduire sans vérifier la présence)** : aucun trouvé dans `prescription.yaml`. Les 11 options d'arrêt/réduction/switch (`:253`, `:266`, `:280`, `:493`, `:520`, `:539`, `:592`, `:604`, `:616`, `:628`, `:640`) vérifient toutes `traitements_en_cours contient <classe>` en 1re condition. La lacune de ce nœud sur ce versant est ailleurs (T1/T3) : la présence est vérifiée, mais jamais la **dose**.

### `insuline.yaml`

| Intitulé | Lignes | Type d'écart | Prérequis manquant |
|---|---|---|---|
| « Initier une insuline basale (en maintenant les antidiabétiques en cours) » | `:121-142` (conditions `:122-124`, pas de champ `prerequis`) | INITIE sans vérifier l'absence | `traitements_en_cours ne_contient_pas insuline_basale` — confirmé recette 12.10 (`recette:1250-1255`) : « Naïf » déclaré + « Insuline basale » cochée → « Initier une insuline basale » recommandée et dose calculée sans alerte |
| « Ajouter un bolus au repas principal (basal-plus, par étapes) » | `:229-242` (conditions `:230-231`, pas de champ `prerequis`) | INITIE sans vérifier l'absence, ET condition unique = situation (cf. T4c) | `traitements_en_cours ne_contient_pas insuline_rapide` — non observé en recette, incertain si l'omission est délibérée (la situation « basale_plus_bolus » suppose déjà l'absence de bolus par construction du parcours séquentiel), mais rien dans le moteur ne l'impose |

**Incohérence secondaire notée (pas un manque de prérequis, une asymétrie) :** « Envisager un GLP-1… avant ou avec l'insuline » (situation naïf, `:103-120`) ne garde que `ne_contient_pas aGLP1` (`:108-109`), alors que son équivalent en situation 3 « Ajouter un GLP-1 / une association fixe d'abord » (`:215-228`) garde `ne_contient_pas aGLP1 AND ne_contient_pas tirzepatide` (`:220-221`) — la version « naïf » n'exclut pas le tirzépatide déjà en cours. Incertain si ceci reflète un choix clinique (le nœud E autoriserait le tirzépatide au patient naïf d'insuline même si déjà là, ce qui serait absurde) ou un oubli symétrique au précédent.

**Cas inverse (réduire/titrer sans vérifier la présence)** : ici la réponse diffère de `prescription`. Aucune des options des situations 2-4 (« Corriger l'hypoglycémie… » `:160-174`, « Titrer la basale » `:195-213`, « Désintensifier… » `:255-265`, « Optimiser la répartition du basal-bolus » `:266-277`) ne vérifie `traitements_en_cours contient insuline_basale` (ou `insuline_rapide`) : elles s'appuient **uniquement** sur `situation_insuline`, jamais sur l'inventaire déclaré des traitements en cours. C'est le pendant exact du problème T1 : le primer et l'inventaire ne sont jamais recoupés, dans les deux sens.

### `statine.yaml`

Les 3 options (`:55-74`, `:75-89`, `:90-109`) sont toutes des options d'INITIATION/DISCUSSION — aucune ne propose d'arrêter/poursuivre une statine existante, donc le test « option d'ajout sans vérification d'absence » ne s'applique même pas littéralement : **le prérequis qui manquerait n'a pas de critère à évaluer**, puisque `statine_deja_en_cours` n'existe pas du tout (cf. T1/T3). C'est plus grave qu'un prérequis oublié : c'est l'absence totale de la DEUXIÈME décision que R3 exige (« modifier un traitement existant = deux décisions, pas une », `GRAMMAIRE-NOEUD.md:65-70`) — ici il n'y a même pas de PREMIÈRE décision sur la ligne existante, seulement une décision d'instauration.

**Cas inverse** : aucune option d'arrêt/réduction n'existe dans ce nœud — rien à vérifier, la lacune est en amont (absence de la fonctionnalité elle-même).

### `rhd.yaml` et `cible-glycemique.yaml`

Aucune option de ces deux nœuds ne propose d'initier, ajouter, arrêter ou réduire un traitement
médicamenteux (`rhd` : mesures hygiéno-diététiques uniquement, options `:50-86` ; `cible-glycemique` :
fixation d'une cible, options `:29-75`). T2 est **sans objet** pour les deux, par construction du
nœud.

**Décompte T2 : 4 options avec prérequis manquant identifiées formellement (2 dans `prescription`, 2 dans `insuline`) + 1 défaut de formulation (`prescription:234`) + 1 asymétrie de prérequis (`insuline:108-109` vs `:220-221`) + 1 lacune structurelle totale (`statine`, aucune option de gestion de l'existant) + 4 options d'`insuline` (situations 2-4) qui réduisent/titrent sans jamais lire `traitements_en_cours`.**

---

## T3 — Critères manquants

| # | Nœud | Critère manquant | Phrase exacte qui le rend nécessaire (fichier:ligne) | Type probable | `population_cible` le déclare-t-il hors périmètre ? |
|---|---|---|---|---|---|
| 1 | `statine` | « statine déjà en cours » | `statine.yaml:123` — « Si une statine est déjà en place, sa poursuite est raisonnable. » (dans l'alerte dialyse, `:118-124`) | `bool` (`statine_en_cours`) | **Non.** `population_cible` (`:34-38`) exclut seulement l'hypercholestérolémie familiale et l'escalade ézétimibe/anti-PCSK9 ; il ne mentionne ni l'existant ni l'intolérance. |
| 2 | `statine` | « intolérance à la statine » | `statine.yaml:63` — « Surcroît de myopathie à très haute dose (simvastatine 80 mg — à éviter, restriction FDA). » (inconvénients de l'option haute intensité) ; renforcé par la source déjà citée dans le nœud, `statine.yaml:229-232` (« CTT — symptômes musculaires… > 90 % non attribuables à la statine », 2022) qui montre que le sujet est documenté dans le corpus sans être opérationnalisé en critère. | `bool` (`intolerance_statine`), éventuellement `enum nature_intolerance_statine` (myalgies/hépatique/autre), sur le modèle de `prescription.yaml:124-129` (`nature_intolerance`) | **Non**, cf. ligne 1 — confirmé aussi par la synthèse de la recette (`recette:1428-1432` : « ne dit rien de l'intolérance ni du patient déjà traité — ces deux cas ne sont donc ni couverts, ni annoncés comme hors périmètre »). |
| 3 | `statine` | Borne d'âge basse (CARDS 40-75 ans) | `statine.yaml:17` (commentaire d'en-tête) — « la population PROUVÉE est celle des ECR (CARDS = 40-75 ans + ≥ 1 FDR ; ASPEN, plus bas risque, est nul). » | **Nuance : ce n'est pas un critère manquant** — `age` EST un critère d'entrée (`:42`) — mais aucune RÈGLE n'utilise la borne basse (40 ans). `age` n'apparaît que dans l'alerte `age > 75 AND ASCVD_etablie == false` (`:111`) ; aucune condition d'option, aucune exclusion, aucune alerte ne teste `age < 40`. Un DT2 de 30 ans avec 2 FDR reçoit « Recommandée » sans réserve d'extrapolation (confirmé recette 13.8, `recette:1400-1417`). | `population_cible` (`:34-38`) ne mentionne aucune borne d'âge. |
| 4 | `prescription` | « dose de metformine (posologie actuelle) » | `prescription.yaml:273` — « Adapter la dose au DFG (RCP ANSM : 45‑59 → max 2 g/j ; 30‑44 → max 1 g/j) » (avantages de l'option « Réduire la posologie de la metformine ») ; explicité par le référent en recette (`recette:132-137`) : « il ne peut donc pas savoir si une réduction est réellement nécessaire ». | `nombre` (`dose_metformine_actuelle_mg`) | **Non** — `population_cible` (`:29-35`) couvre explicitement le patient « déjà traité à optimiser », donc le suivi de dose est dans le périmètre revendiqué, pas hors champ. |
| 5 | `statine` | Espérance de vie / horizon de bénéfice (cohérence R2) | `statine.yaml:116` — « Individualiser selon l'espérance de vie, la fragilité et les préférences (délai avant bénéfice estimé ~2,5 ans). » (alerte `> 75 ans`, `:111-117`) | `enum` (`esperance_vie`, sur le modèle de `cible-glycemique.yaml:16-18` et `insuline.yaml:57-59`) | Non déclaré hors périmètre ; confirmé recette 13.8 (`recette:1413-1417`) : « Le nœud n'a pas de critère d'espérance de vie, contrairement aux nœuds A (`esperance_vie`) et E (`terrain_fragile`)… rien ne relie ce texte au chiffre affiché juste au-dessus. » |

**Cas particulier `insuline` — pas de critère manquant identifié pour T3.** Le défaut capturé en recette (12.10, patient naïf déclaré + `insuline_basale` cochée) ne tient pas à une donnée non collectée : `traitements_en_cours` (liste, `:70-72`) contient déjà `insuline_basale`/`insuline_rapide`. Le défaut relève de T2 (prérequis absent) et de T1 (primer/inventaire non recoupés), pas d'une collecte manquante.

**Décompte T3 : 5 lignes (4 nœud `statine`, 1 nœud `prescription`), dont 1 nuancée (borne d'âge : critère présent, règle absente plutôt que critère manquant).**

---

## T4 — Primer : les deux moitiés

Seuls deux nœuds ont un critère primer au sens du brief : `prescription` (`intention`, `:45-53`) et
`insuline` (`situation_insuline`, `:41-43`). `rhd` a des champs modulateurs (`motivation`,
`capacite_activite`) mais aucun n'organise le flux de saisie ni la sortie de la même façon (ils
alimentent uniquement des alertes, cf. T1) — pas un primer au sens de la grammaire. `statine` et
`cible-glycemique` n'ont aucun champ de ce type. T4 est donc traité pour `prescription` et `insuline`
uniquement.

### (a) `visible_si` — champs qui devraient être masqués et ne le sont pas

**`prescription.yaml`** — 4 `visible_si` existent déjà, tous corrects : `traitements_en_cours`
(`:61`, `intention != initier`), `hypoglycemie_recente` (`:110`, idem), `intolerance_traitement`
(`:123`, idem), `nature_intolerance` (`:128`, `intolerance_traitement == true`). Relecture des 30
critères restants (`:81-194`) : aucun autre champ n'est structurellement sans objet pour une valeur
d'`intention` donnée — `position_vs_cible`, `ASCVD_etablie`, `DFG`, etc. restent pertinents quelle que
soit l'intention (y compris « initier », où la position vs objectif module directement
`palette_glycemique_ouverte`, `:179`). **Ce côté (a) est essentiellement complet pour `prescription`**
— cohérent avec le fait que le brief situe le défaut de ce nœud du côté (b), pas (a).

**`insuline.yaml`** — **0 `visible_si` dans tout le fichier** (vérifié sur les 30 lignes de
`criteres_entree`, `:41-100`). Exhaustif pour la situation « Naïf » (confirmé recette capture 7,
`recette:540-626`) :

| Champ | Ligne | Devrait être masqué quand | Piège P1 si masqué (reset à la valeur par défaut) |
|---|---|---|---|
| `dose_basale_actuelle` | `:94` | `situation_insuline == naif` | Sûr : aucune option de la situation « naïf » ne lit ce champ ; `over_basalisation` (`:98-100`) resterait à 0 (faux), ce qui est le comportement voulu pour un naïf. |
| `dose_rapide_actuelle` | `:96` | `situation_insuline != basal_bolus` (seul `calculs` qui le lit, `:277`, est propre à cette situation) | Sûr, même raisonnement. |
| `mcg_disponible` | `:76` | `situation_insuline != naif` (incertain au-delà — aucune option n'exige `mcg_disponible`, mais 3 alertes le lisent, cf. piège ci-dessous) | **Piège actif** : les alertes `:317`, `:323`, `:328` ne sont PAS filtrées par situation. Masquer `mcg_disponible` à `false` pour un naïf ferait afficher l'alerte info « Sans MCG : titrer sur la glycémie à jeun… » (`:328-332`), message prématuré pour un patient qui n'a pas encore d'insuline à titrer — bas risque (niveau `info`) mais réel. |
| `TBR` | `:78` | `situation_insuline != naif` | Sûr — lu seulement dans les conditions/exclusions de la situation « basale seule » (`:163`, `:191`, `:210`). |
| `TBR_severe` | `:80` | `situation_insuline != naif` | **Piège actif** : lu aussi dans l'alerte non filtrée `:290` (« orienter vers le spécialiste… `TBR_severe > 1` »). Masqué à 0 pour un naïf, ce terme de l'alerte devient toujours faux — probablement sans conséquence clinique (un naïf n'a pas de MCG interprétable pour ce motif) mais c'est une valeur par défaut qui entre dans une règle, à signaler explicitement comme demandé. |
| `CV_glycemique` | `:82` | `situation_insuline != naif` | **Même piège** : alerte `:290` (`CV_glycemique > 36`) et dérivé implicite — masqué à 0, le terme devient toujours faux. |
| `profil_glycemique` | `:84` | `situation_insuline != naif` | Sûr — lu seulement en `:163`, `:194`, `:213` (situation « basale seule »). |
| `GAJ` | `:87` | `situation_insuline != naif` | Sûr — `gaj_a_cible` (`:89-91`) n'est lu que par les 2 options de la situation « basale seule » (`:178`, `:199`). |

`hypo_severe_recurrente` (`:66`) est **volontairement exclu** de cette proposition : bien que lu
uniquement par la situation « basal-bolus » (`:258`) et par l'alerte non filtrée `:290`, un antécédent
d'hypoglycémie sévère peut être antérieur à toute insulinothérapie (ex. sous sulfamide) — masquer ce
champ pour un « naïf » supprimerait une information cliniquement valide. **Incertain**, laissé de
côté à dessein plutôt que de trancher.

### (b) sortie — familles/options qui devraient être filtrées ou reléguées et ne le sont pas

**Exhaustif sur `prescription`, intention « Déprescrire »** (cas exact de la recette capture 6,
`recette:470-537`). Les 7 options de la famille exclusive « Agent à ajouter » (schéma des familles,
`:203-215`) sont : « Introduire un iSGLT2 » (`:295`), « Introduire un AR GLP‑1 » (`:335`), « Introduire
le tirzépatide » (`:398`), « Association iSGLT2 + AR GLP‑1 » (`:434`), « Envisager l'insuline »
(`:465`), « Gliptine (sitagliptine) » (`:652`), « Sulfamide » (`:681`). **Aucune des 7** ne référence
`intention` dans ses `conditions` ou `prerequis** (vérifié champ par champ : `:297`/`:302-304` ;
`:342`/`:344-347` ; `:400`/`:404-408` ; `:436-437`/`:441-446` ; `:467-468` (pas de `prerequis`) ;
`:654-655`/`:658-661` ; `:683-684`/`:687-689`). Seule `palette_glycemique_ouverte` (dérivé, `:170-179`)
dépend indirectement de `intention`, et seulement pour EXCLURE la voie « palette glycémique pure » en
`optimiser`/`deprescrire` (`intention == intensifier OR intention == initier` uniquement, `:179`) — ce
qui ferme UNE des 4 à 6 voies de déclenchement de chaque option, pas les autres (`ASCVD_etablie`,
`DFG`, `IMC`, `remplacement_agent_sans_benefice`, `cible_atteinte`). C'est exactement ce qui laisse
passer le cas de la capture 6 : ASCVD seule suffit à déclencher « Introduire un AR GLP‑1 »
(`:342` — `ASCVD_etablie == true OR …`), intention ignorée.

Symétriquement, la famille « Traitement à alléger » ne contient **aucune option assez large** pour
couvrir « agent protecteur sans indication forte, position sous l'objectif » : la seule option de ce
type, « Reconsidérer un agent protecteur prescrit hors indication… » (`:640-650`), exige EN PLUS
`infections_uro_genitales_recidivantes == true` (`:642`) — un iSGLT2 sans IC/rein/ASCVD mais SANS
infection urinaire récidivante (le cas exact de la capture 6) ne matche aucune option de la famille
« Traitement à alléger ». C'est un manque de CONTENU (proche de T3), distinct du manque de filtrage.

**Piège P2 — forme sûre.** Pour les 7 options ci-dessus : la forme sûre est **reléguer + expliquer**,
pas supprimer. Deux raisons convergentes :
1. Le commentaire d'architecture du nœud le dit lui-même : « [intention] ORGANISE le flux et
   l'affichage… **ne filtre jamais durement (non-étanche : les gestes transverses restent
   affichés)** » (`prescription.yaml:48-49`) — un filtrage dur romprait un choix de conception déjà
   documenté.
2. Cliniquement, une indication d'organe (ASCVD, IC, DFG) reste un fait vrai sur le patient
   indépendamment de l'intention du jour de consultation ; la supprimer purement fait perdre en
   silence une indication réelle si le praticien s'est trompé de valeur d'`intention` (exactement
   l'avertissement du brief). La correction proportionnée est donc d'afficher ces options sous un
   intitulé de section différent en `deprescrire` (ex. « indication transverse détectée — hors du
   geste demandé ») plutôt que de les faire disparaître.

**`insuline`** — la logique inverse s'applique : `situation_insuline` gate DÉJÀ durement toutes les
options (chaque option porte `situation_insuline == X` en 1re condition), donc il n'y a pas de familles
« non filtrées » à signaler côté (b) pour ce nœud — c'est l'inverse de `prescription`, cohérent avec le
constat du brief (« situation_insuline pilote TOUTES les conditions »).

### (c) accessibilité du repli — table valeur du primer × repli atteignable

**`insuline.yaml`** — un seul repli existe, « Poursuivre le schéma d'insuline en cours et réévaluer »
(`conditions: ["default"]`, `:278-280`), non gaté par situation. En mode `multi-options`, il s'active
seulement si **aucune** option non-`toujours` de la situation courante n'est applicable
(`evaluateNode.ts:499-517`).

| Situation | Repli atteignable | Option(s) fautive(s) — condition UNIQUE = la situation |
|---|---|---|
| `naif` | **Non** | « Envisager un GLP-1… avant ou avec l'insuline » (`:103-105`) — seule condition `situation_insuline == naif` ; le `prerequis` `ne_contient_pas aGLP1` (`:108-109`) ne bloque que le patient déjà sous aGLP1, cas marginal. |
| `basale_seule` | **Oui** | Aucune des 3 options n'a la situation comme condition unique : « Corriger l'hypoglycémie… » ajoute `TBR>4 OR TBR_severe>1 OR CV_glycemique>36 OR profil_glycemique contient hypo_nocturne` (`:162-163`) ; « Ne pas sur-titrer… » ajoute `gaj_a_cible==true AND cible_atteinte==false` (`:177-179`) ; « Titrer la basale » ajoute `cible_atteinte==false AND gaj_a_cible==false` (`:197-199`). Un patient à l'objectif, sans hypoglycémie ni variabilité, ne déclenche aucune des 3 → repli atteint. |
| `basale_plus_bolus` | **Non** | **Deux** options à condition unique = la situation : « Ajouter un GLP-1 / une association fixe d'abord » (`:216-217`, le `prerequis` `:220-221` ne bloque que si aGLP1 ET tirzépatide sont déjà tous deux en cours) ET « Ajouter un bolus au repas principal » (`:230-231`, **aucun** `prerequis`). La table du brief (`recette:1263-1268`) n'en cite qu'une (« Ajouter un bolus au repas principal ») ; la vérification directe du YAML en révèle une seconde. |
| `basal_bolus` | **Non** | « Optimiser la répartition du basal-bolus » (`:267-268`) — seule condition `situation_insuline == basal_bolus`, aucun `prerequis`. |

**Décompte : 4 valeurs de primer testées, repli atteignable pour 1 seule (`basale_seule`) ; 4 options
fautives identifiées au total** (contre 3 dans la table de la recette — la 4ᵉ, « Ajouter un GLP-1 /
une association fixe d'abord » en `basale_plus_bolus`, n'y figurait pas).

**`prescription.yaml`** — cas structurellement différent : `intention` n'apparaît **dans aucune
condition d'option** du fichier (recherche exhaustive des 24 options, `:218` à `:722` — `intention`
n'est utilisée que dans des `derive` de critères, `:166`, `:179`, jamais en clair dans `conditions`
ou `prerequis` d'une option). Le mécanisme « valeur du primer = condition unique qui préempte le repli
» ne peut donc pas se produire de la même façon pour `intention` : le repli
« Poursuivre le traitement en cours et réévaluer » (`conditions: ["default"]`, `:711-722`) est
préempté ou non par les conditions de fond (ASCVD, DFG, IMC, `cible_atteinte`, `traitements_en_cours`
…), jamais par la seule valeur d'`intention`. **Table valeur-par-valeur non pertinente pour ce nœud** —
conclusion positive à l'inverse d'`insuline`, distincte du défaut (b) documenté ci-dessus (qui porte
sur le FILTRAGE de sortie, pas sur l'ACCESSIBILITÉ du repli). Vérifié par recherche exhaustive :
`intention ==` n'apparaît (`grep`) que dans deux `derive` de critères (`:179`, sur
`palette_glycemique_ouverte`) et dans une alerte de nœud (`:806`), jamais dans les `conditions`/
`prerequis` des 23 options du fichier.

**Décompte T4 : (a) 8 champs cibles sur `insuline` (dont 3 avec piège P1 actif) + 0 lacune
résiduelle sur `prescription` ; (b) 7 options + 1 famille de contenu manquante sur `prescription`
(intention « Déprescrire »), 0 sur `insuline` ; (c) 4/4 valeurs de primer vérifiées sur `insuline`
(1 atteignable, 4 options fautives), primer non gatant sur `prescription` (table non pertinente,
confirmé par recherche exhaustive).**

---

## Synthèse des pièges rencontrés

- **P1 (masquage = valeur par défaut affirmée)** : actif sur 3 des 8 champs proposés pour `insuline`
  (`mcg_disponible`, `TBR_severe`, `CV_glycemique` — alertes `:290`, `:317-332` non filtrées par
  situation) ; sans conséquence identifiée sur les 5 autres (`dose_basale_actuelle`,
  `dose_rapide_actuelle`, `TBR`, `profil_glycemique`, `GAJ`), dont les seuls lecteurs sont déjà
  cantonnés à la situation ciblée.
- **P2 (filtrage silencieux)** : concerne les 7 options de la famille « Agent à ajouter » de
  `prescription` sous intention « Déprescrire ». Forme sûre retenue : **reléguer + expliquer**, jamais
  supprimer — justifié à la fois par le commentaire d'architecture du nœud lui-même
  (`prescription.yaml:48-49`, « ne filtre jamais durement ») et par le risque clinique d'une intention
  mal renseignée.

---

## Décompte global

- **T1** : 5 nœuds — 1 aucun, 3 partiel, 1 N/A.
- **T2** : 4 options à prérequis manquant formellement identifiées, 1 défaut de formulation, 1
  asymétrie de prérequis, 1 lacune structurelle totale (`statine`), 4 options d'`insuline`
  (situations 2-4) qui ne recoupent jamais `traitements_en_cours`.
- **T3** : 5 lignes (4 `statine`, 1 `prescription`), dont 1 nuancée (règle absente plutôt que critère
  manquant).
- **T4** : (a) 8 champs cibles + 3 pièges actifs ; (b) 7 options + 1 famille de contenu manquante ;
  (c) table 4×4 sur `insuline` (1 valeur seulement avec repli atteignable, 4 options fautives),
  non pertinente par construction sur `prescription`.
