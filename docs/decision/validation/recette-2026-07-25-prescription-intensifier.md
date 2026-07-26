# Recette in-app — nœud `prescription` (2026-07-25)

Capture brute de l'onglet ouvert sur ebm-msp.vercel.app, nœud « Traiter : initier, optimiser,
intensifier ». Constat factuel uniquement (paramètres saisis, champs estompés, sortie de l'outil) —
pas d'analyse ni de jugement clinique dans ce document.

## Point méthodologique relevé par le référent — sourçage de la « position critique » (transverse, hors capture d'écran)

Constat (référent, 2026-07-25) : dans les sections « Reco officielle vs position critique » des
argumentaires et des champs `synthese`/notes des YAML, la position critique cite systématiquement
**Prescrire** et **Médicalement Geek / DragiWebdo** comme sources, par ex. :

- `cible-glycemique.argumentaire.md:128` — « Position critique — Prescrire … » ; `:136` — « Médicalement
  Geek / DragiWebdo (EBM francophone) »
- `insuline.argumentaire.md:177` — « Position critique (ebmfrance, Prescrire, Médicalement Geek) »
- `insuline.yaml:479` — « la position critique (Prescrire, Médicalement Geek : les cibles de TIR sont
  un consensus / un substitut… ) »
- `statine.argumentaire.md:164` — « Position critique (Prescrire, Minerva, EBM francophone) »
- `prescription.yaml:674` (option gliptine) — « Prescrire l'écarte. » ; `prescription.yaml:962` —
  « Prescrire écarte l'iDPP4 quelle que soit la situation… »

Le référent souligne que **Prescrire et Médicalement Geek n'ont aucune valeur probante par
eux-mêmes** — ce sont des publications qui interprètent des données, pas des sources primaires. Ce
qui a de la valeur, ce sont les **données EBM publiées** (essais, méta-analyses) que ces publications
invoquent pour justifier leur position. La « position critique » ne doit donc jamais être sourcée
par le simple nom de la publication (« Prescrire dit que… », « Médicalement Geek propose… ») mais
reformulée pour s'appuyer **exclusivement sur les données publiées** citées à l'appui — la
publication peut rester mentionnée en référence bibliographique, mais l'argument affiché au praticien
doit être la donnée elle-même, pas l'autorité de la source qui la relaie.

Portée : ce motif revient dans au moins 4 nœuds (`cible-glycemique`, `insuline`, `statine`,
`prescription`) — à traiter comme un point de méthode transverse (`docs/decision/`), pas un correctif
ponctuel d'un seul nœud.

## Paramètres saisis

**Intention thérapeutique** : Intensifier (renforcer le contrôle glycémique)

**Traitement actuel et contrôle**
- Traitements en cours (cochés) : Metformine, iSGLT2 (gliflozine)
- Traitements en cours (non cochés) : AR GLP-1, Tirzépatide, Sulfamide, Gliptine (iDPP4), Insuline, Glinide
- HbA1c actuelle (%) : 8
- Par rapport à l'objectif fixé pour ce patient : Au-dessus de l'objectif

**Ce qui oriente le choix**
- Maladie cardiovasculaire athéromateuse établie : coché
- Insuffisance cardiaque : non coché
- DFG (mL/min/1,73 m²) : 58
- Albuminurie : Normoalbuminurie
- IMC (kg/m²) : 25

**Signaux d'alerte et tolérance** — tout non coché : symptômes de glucotoxicité, cétonémie,
hypoglycémie récente, dénutrition/carence, infections génito-urinaires récidivantes, intolérance à
un traitement en cours

**Terrain et préférences**
- Âge : non renseigné (champ vide)
- Fragilité : non coché
- Espérance de vie : Intermédiaire
- Risque hypoglycémique du schéma : Faible
- Préférence vis-à-vis de l'injectable : Indifférent
- iSGLT2 et AR GLP-1 tous deux inutilisables : non coché

## Champs estompés par l'outil (« · sans effet sur la reco actuelle »)

- Insuffisance cardiaque
- Albuminurie
- Hypoglycémie récente
- Âge
- Risque hypoglycémique du schéma

## Bandeau de statut

> Reco provisoire — 1 critère décisif non confirmé dans le formulaire ci-dessus : les mesures
> chiffrées y sont marquées « à confirmer », les drapeaux se confirment d'un clic par « Rien à
> signaler ». La recommandation peut encore changer.

(Aucun champ n'était visuellement marqué « à confirmer » au moment de la capture — cf. divergence
notée ci-dessous.)

## Sortie de l'outil, par ordre d'affichage

**Alerte de nœud affichée** (hors sections d'options) :
> Metformine : dose maximale 2 000 mg/j si DFG 45‑59 (RCP ANSM) ; revoir au préalable les facteurs de
> risque d'acidose lactique.

### Section « À faire d'emblée — sécurité » (gestes cumulables)
1. **Réduire la posologie de la metformine (fonction rénale altérée ou intolérance digestive)**
   — Recommandée · Preuve élevée
   - Proposé parce que : Traitements en cours comprend Metformine et DFG ≥ 30 et DFG < 60

### Section « Socle du traitement » (gestes cumulables)
1. **Metformine (socle du traitement) — instaurer ou poursuivre**
   — Recommandation officielle (France) · Preuve faible
   - Proposé parce que : Socle maintenu par la recommandation officielle, quelles que soient les
     comorbidités

### Section « Agent à ajouter » (exclusive — un seul choisi)
1. **Introduire un AR GLP‑1 (liraglutide, sémaglutide, dulaglutide)** — rang le plus haut
   — Recommandée · Preuve modérée · Délai du bénéfice : 2 à 5,4 ans selon la molécule
   - Proposé parce que : Maladie cardiovasculaire athéromateuse établie et Palette glycémique
     ouverte (place pour un agent de contrôle en plus)
   - Ce rang tient compte de : Insuffisance cardiaque ou DFG < 60 ou Albuminurie ≠ Normoalbuminurie

   — **À égalité — même niveau de priorité** —

2. **Gliptine (sitagliptine) — option glycémique orale de bas rang (place résiduelle)**
   — Preuve modérée
   - Proposé parce que : Palette glycémique ouverte (place pour un agent de contrôle en plus) et Par
     rapport à l'objectif fixé pour ce patient ≠ En dessous de l'objectif (sur-traitement probable)

2. **Sulfamide (gliclazide MR ou glimépiride) — option glycémique de bas rang, derrière la gliptine**
   — Preuve modérée
   - Proposé parce que : Palette glycémique ouverte (place pour un agent de contrôle en plus) et Par
     rapport à l'objectif fixé pour ce patient ≠ En dessous de l'objectif (sur-traitement probable)

### Options écartées / non retenues
- Aucune mention d'option écartée (sécurité) visible sur l'écran capturé.
- Lien « Pourquoi pas d'autres options ? » présent mais non déplié pendant la capture.
- Lien « Déplier l'argumentaire » présent mais non déplié pendant la capture.

## Pied d'écran

> Révisé le 25/07/2026 · Aide à la décision fondée sur l'EBM — le praticien reste le lien avec le
> patient et le seul responsable de la décision.

## Problèmes relevés par le référent (recette, 2026-07-25)

1. **Bandeau « 1 critère décisif non confirmé »** sans aucun champ marqué « à confirmer » à l'écran
   — divergence entre le bandeau et le marquage visuel (cf. section précédente).

2. **« Réduire la posologie de la metformine »** proposée sans que l'outil connaisse la posologie de
   base actuelle du patient — il ne peut donc pas savoir si une réduction est réellement nécessaire.
   Cette information (seuils de dose max par palier de DFG) figure déjà par ailleurs sous forme
   d'**alerte** (« Metformine : dose maximale 2 000 mg/j si DFG 45‑59… », affichée hors options).
   Le référent juge que c'est là sa forme adaptée — une alerte informe sans affirmer un geste que
   l'outil n'est pas en mesure de statuer.

3. **Formulation contradictoire entre les deux options « Socle »** : l'outil affiche à la fois
   - « Réduire la posologie de la metformine » (sans savoir si un excès de dose existe), ET
   - « Metformine (socle du traitement) — **instaurer ou poursuivre** », alors que le patient est
     déjà sous metformine (`traitements_en_cours contient metformine`) — « instaurer » n'a pas de
     sens dans ce contexte.

   Le référent précise que le fond (maintenir la metformine + vigilance rénale) est correct ; c'est
   la **formulation simultanée des deux gestes** — réduire sans savoir si c'est nécessaire, et
   instaurer un traitement déjà en place — qui pose problème.

---

## Capture 2 — même onglet, formulaire modifié (intention → Optimiser, + Gliptine cochée)

Capture brute du même onglet après modification du formulaire par l'utilisateur (sans renavigation).
Constat factuel uniquement.

### Paramètres saisis (deltas vs capture 1)

- Intention thérapeutique : **Optimiser** (améliorer le rapport bénéfice/risque du traitement)
  — au lieu d'Intensifier
- Traitements en cours (cochés) : Metformine, iSGLT2 (gliflozine), **Gliptine (iDPP4)**
- Traitements en cours (non cochés) : AR GLP-1, Tirzépatide, Sulfamide, Insuline, Glinide
- Reste identique à la capture 1 : HbA1c 8, DFG 58, IMC 25, ASCVD coché, Insuffisance cardiaque non
  coché, Albuminurie Normo, tous les signaux d'alerte non cochés, âge vide, fragilité non cochée,
  espérance de vie Intermédiaire, risque hypo Faible, préférence injectable Indifférent

### Champs estompés (« sans effet sur la reco actuelle »)

- Insuffisance cardiaque
- Albuminurie
- Hypoglycémie récente
- Âge
- Risque hypoglycémique du schéma

(identique à la capture 1)

### Alerte de nœud supplémentaire apparue

> Non-association incrétine : si un AR GLP‑1 ou le tirzépatide est introduit, la gliptine doit être
> ARRÊTÉE — même voie incrétine, aucun bénéfice additif (Nauck 2017 ; ADA §9 ; KDIGO PP4.2.3 ; HAS
> R.80). Ne jamais les associer.

(en plus de l'alerte metformine/DFG déjà présente en capture 1)

### Bandeau de statut

Identique à la capture 1 — « Reco provisoire — 1 critère décisif non confirmé… », toujours sans
champ visuellement marqué « à confirmer ».

### Sortie de l'outil, par ordre d'affichage

**Section « À faire d'emblée — sécurité »**
1. Réduire la posologie de la metformine (fonction rénale altérée ou intolérance digestive)
   — Recommandée · Preuve élevée

**Section « Socle du traitement »**
1. Metformine (socle du traitement) — instaurer ou poursuivre
   — Recommandation officielle (France) · Preuve faible

**Section « Agent à ajouter » (en choisir un)**
1. Introduire un AR GLP‑1 (liraglutide, sémaglutide, dulaglutide) — Recommandée · Preuve modérée ·
   Délai du bénéfice 2 à 5,4 ans
   - Proposé parce que : Maladie cardiovasculaire athéromateuse établie et **Remplacement d'un agent
     sans bénéfice sur critère dur (gliptine, sulfamide)**
   - (pas de mention « à égalité » ni d'autre option dans cette section à cette capture)

**Section « Traitement à corriger ou remplacer » (gestes cumulables)**
1. Remplacer la gliptine (aucun bénéfice sur critère dur — préférer un agent qui en apporte)
   — Recommandée · Preuve modérée
   - Proposé parce que : Traitements en cours comprend Gliptine (iDPP4)
   - Contre-indications : « Ne pas maintenir la gliptine en association avec un AR GLP‑1 : la
     remplacer. »

Aucune section « Traitement à alléger » ni « Aucun geste — surveiller » affichée à cette capture.
Lien « Pourquoi pas d'autres options ? » et « Déplier l'argumentaire » présents, non dépliés.

### Problème relevé par le référent (recette, 2026-07-25)

Le fond est correct (« Introduire un AR GLP‑1 » implique l'arrêt de la gliptine, « Remplacer la
gliptine » pointe explicitement vers ce remplaçant), mais les deux options apparaissent dans deux
sections séparées et éloignées à l'écran (« Agent à ajouter » puis, plus bas, « Traitement à
corriger ou remplacer ») sans être mises en regard. Le lien entre elles n'est visible qu'en lisant le
texte de chaque carte (« implique l'ARRÊT de la gliptine » / « Traitements en cours comprend
Gliptine »), pas dans la disposition. Le référent demande que ces deux options soient rapprochées
à l'affichage (face à face) pour rendre le lien visuellement immédiat, plutôt que de compter sur la
prose pour le reconstituer.

---

## Capture 3 — même onglet, formulaire modifié (+ AR GLP-1 coché en plus)

Capture brute du même onglet après modification du formulaire par l'utilisateur (sans renavigation).
Constat factuel uniquement.

### Paramètres saisis (deltas vs capture 2)

- Traitements en cours (cochés) : Metformine, iSGLT2 (gliflozine), **AR GLP‑1**, Gliptine (iDPP4)
- Traitements en cours (non cochés) : Tirzépatide, Sulfamide, Insuline, Glinide
- Intention : Optimiser (inchangé)
- Reste identique aux captures précédentes : HbA1c 8, DFG 58, IMC 25, ASCVD coché, Insuffisance
  cardiaque non coché, Albuminurie Normo, tous les signaux d'alerte non cochés, âge vide, fragilité
  non cochée, espérance de vie Intermédiaire, risque hypo Faible, préférence injectable Indifférent

### Champs estompés (« sans effet sur la reco actuelle »)

Identique aux captures 1 et 2 : Insuffisance cardiaque, Albuminurie, Hypoglycémie récente, Âge,
Risque hypoglycémique du schéma.

### Alertes de nœud affichées (2, identiques aux précédentes)

1. Metformine : dose maximale 2 000 mg/j si DFG 45‑59 (RCP ANSM)…
2. Non-association incrétine : si un AR GLP‑1 ou le tirzépatide est introduit, la gliptine doit être
   ARRÊTÉE — même voie incrétine, aucun bénéfice additif (Nauck 2017 ; ADA §9 ; KDIGO PP4.2.3 ; HAS
   R.80). Ne jamais les associer.

### Bandeau de statut

Identique aux captures précédentes — toujours « 1 critère décisif non confirmé », toujours sans
champ marqué « à confirmer ».

### Sortie de l'outil, par ordre d'affichage

**Section « À faire d'emblée — sécurité »**
1. Réduire la posologie de la metformine (fonction rénale altérée ou intolérance digestive)
   — Recommandée · Preuve élevée

**Section « Socle du traitement »**
1. Metformine (socle du traitement) — instaurer ou poursuivre
   — Recommandation officielle (France) · Preuve faible

**Section « Agent à ajouter » (en choisir un)**
1. Envisager l'insuline (palette non‑insulinique épuisée — ajustement fin → nœud E)
   — Recommandée · Preuve faible
   - Proposé parce que : HbA1c à la cible : non et Traitements en cours comprend iSGLT2 et
     Traitements en cours comprend AR GLP-1

**Section « Traitement à corriger ou remplacer » (gestes cumulables)**
1. Arrêter la gliptine redondante (association gliptine + AR GLP‑1 / tirzépatide déjà en place)
   — Recommandée · Preuve modérée
   - Proposé parce que : Traitements en cours comprend Gliptine (iDPP4) et Traitements en cours
     comprend AR GLP-1

Aucune section « Traitement à alléger » ni « Aucun geste — surveiller » affichée à cette capture.
Lien « Pourquoi pas d'autres options ? » et « Déplier l'argumentaire » présents, non dépliés.

### Problème relevé par le référent (recette, 2026-07-25)

L'alerte de nœud « Non-association incrétine » (patient déjà sous gliptine ET AR GLP‑1, association
interdite déjà en place) fait doublon avec l'option « Arrêter la gliptine redondante », qui pointe le
même fait. Mais ici, contrairement au doublon metformine (capture 1, où l'alerte porte sur un geste
seulement CONDITIONNEL — dose à ajuster selon le DFG), l'alerte porte sur une **association
médicamenteuse réellement en place, à corriger par une action de sécurité sans condition**. Le
référent demande que ce cas soit traité différemment : soit rendre l'alerte plus visible (niveau de
sévérité supérieur), soit faire remonter l'option « Arrêter la gliptine redondante » en tête d'affichage
plutôt que la laisser dans l'ordre de famille habituel — la distinction à faire est entre une alerte
conditionnelle (metformine : dépend du DFG) et une alerte sur un fait de sécurité déjà avéré (gliptine
+ AR GLP‑1 en association interdite).

---

## Capture 4 — même onglet, formulaire modifié (+ Sulfamide et Insuline cochés, Gliptine décochée)

Capture brute du même onglet après modification du formulaire par l'utilisateur (sans renavigation).
Constat factuel uniquement.

### Paramètres saisis (deltas vs capture 3)

- Traitements en cours (cochés) : Metformine, iSGLT2 (gliflozine), AR GLP‑1, **Sulfamide**,
  **Insuline**
- Traitements en cours (non cochés) : Tirzépatide, **Gliptine (iDPP4)** (décochée), Glinide
- Intention : Optimiser (inchangé)
- Reste identique aux captures précédentes : HbA1c 8, DFG 58, IMC 25, ASCVD coché, Insuffisance
  cardiaque non coché, Albuminurie Normo, tous les signaux d'alerte non cochés, âge vide, fragilité
  non cochée, espérance de vie Intermédiaire, risque hypo Faible, préférence injectable Indifférent

### Champs estompés (« sans effet sur la reco actuelle »)

- Insuffisance cardiaque
- Albuminurie
- Âge

(delta vs captures précédentes : **Hypoglycémie récente** et **Risque hypoglycémique du schéma** ne
sont plus estompés à cette capture — ils sont redevenus pertinents.)

### Alertes de nœud affichées (2)

1. Metformine : dose maximale 2 000 mg/j si DFG 45‑59 (RCP ANSM)…
2. **Association insuline + sulfamide / glinide** : risque d'hypoglycémie cumulée. Envisager
   d'arrêter le sulfamide / le glinide, surtout à l'introduction ou à l'intensification de l'insuline.

(l'alerte « Non-association incrétine » de la capture 3 a disparu — cohérent, la gliptine est
décochée à cette capture)

### Bandeau de statut

> Reco provisoire — **3 critères décisifs non confirmés** dans le formulaire ci-dessus… (jusqu'ici
> le bandeau annonçait 1 critère ; passé à 3 à cette capture, toujours sans aucun champ marqué
> « à confirmer » à l'écran)

### Sortie de l'outil, par ordre d'affichage

**Section « À faire d'emblée — sécurité »**
1. Réduire la posologie de la metformine (fonction rénale altérée ou intolérance digestive)
   — Recommandée · Preuve élevée

**Section « Socle du traitement »**
1. Metformine (socle du traitement) — instaurer ou poursuivre
   — Recommandation officielle (France) · Preuve faible

**Section « Agent à ajouter » (en choisir un)**
1. Envisager l'insuline (palette non‑insulinique épuisée — ajustement fin → nœud E)
   — Recommandée · Preuve faible
   - Proposé parce que : HbA1c à la cible : non et Traitements en cours comprend iSGLT2 et
     Traitements en cours comprend AR GLP-1

**Section « Traitement à corriger ou remplacer » (gestes cumulables)**
1. Remplacer le sulfamide (moins d'hypoglycémie, moins de poids, plus de bénéfice)
   — Recommandée · Preuve modérée
   - Proposé parce que : Traitements en cours comprend Sulfamide et Hypoglycémie récente : non et
     HbA1c < 6,5 % (sur-contrôle) : non

Aucune section « Traitement à alléger » ni « Aucun geste — surveiller » affichée à cette capture.
Lien « Pourquoi pas d'autres options ? » et « Déplier l'argumentaire » présents, non dépliés.

### Observation

- Le patient est déjà sous Insuline ET Sulfamide simultanément (les deux cochés) — l'alerte « Association
  insuline + sulfamide / glinide » couvre exactement ce cas. L'option « Remplacer le sulfamide » est
  proposée séparément dans « Traitement à corriger ou remplacer », sans mention explicite de
  l'insuline déjà en place dans son texte de justification affiché (« Proposé parce que » ne cite que
  Sulfamide + Hypoglycémie récente + HbA1c).

### Problème relevé par le référent (recette, 2026-07-25)

L'option **« Envisager l'insuline (palette non‑insulinique épuisée — ajustement fin → nœud E) »**
est proposée dans « Agent à ajouter » alors que le patient est **déjà sous insuline** (« Insuline »
cochée dans Traitements en cours à cette capture). Le texte « Proposé parce que » ne cite que « HbA1c
à la cible : non » et « Traitements en cours comprend iSGLT2 / AR GLP‑1 » — la condition qui
déclenche cette option ne vérifie pas que l'insuline n'est pas déjà en place, contrairement aux
options d'ajout d'agent (iSGLT2, AR GLP‑1, tirzépatide) qui portent un `prerequis`
`traitements_en_cours ne_contient_pas <classe>`. L'option, censée signaler un passage à l'insuline
faute d'alternative, se retrouve donc à suggérer d'« envisager » un traitement déjà instauré — elle
devrait plutôt s'effacer (ou se reformuler en ajustement, hors périmètre de ce nœud vers le nœud E)
dès que `traitements_en_cours contient insuline`.

---

## Capture 5 — même onglet, formulaire modifié (intention → Initier)

Capture brute du même onglet après modification du formulaire par l'utilisateur (sans renavigation).
Constat factuel uniquement.

### Paramètres saisis

- Intention thérapeutique : **Initier un traitement** (patient naïf — la section « Traitement actuel
  et contrôle » masque `traitements_en_cours` par construction, cf. `visible_si` du nœud ; les champs
  `hypoglycemie_recente` et `intolerance_traitement`/`nature_intolerance` sont masqués pour la même
  raison)
- ASCVD établie : coché
- Insuffisance cardiaque : non coché
- DFG : 58
- Albuminurie : Normoalbuminurie
- IMC : 25
- Signaux d'alerte restants (glucotoxicité, cétonémie, dénutrition, infections uro) : tous non cochés
- Âge : vide, Fragilité : non coché, Espérance de vie : Intermédiaire, Risque hypo : Faible,
  Préférence injectable : Indifférent

### Champs estompés

- Âge
- Risque hypoglycémique du schéma

### Alerte de nœud affichée

- Metformine : dose maximale 2 000 mg/j si DFG 45‑59 (RCP ANSM)…

### Bandeau de statut

> Reco provisoire — 3 critères décisifs non confirmés… (identique en formulation aux captures
> précédentes)

### Sortie de l'outil, par ordre d'affichage

**Section « Socle du traitement »**
1. Metformine (socle du traitement) — instaurer ou poursuivre
   — Recommandation officielle (France) · Preuve faible

**Section « Agent à ajouter » (en choisir un)** — **aucune mention « À égalité » entre les options
de cette section à cette capture** :
1. **Introduire un iSGLT2 (protection cardio‑rénale et/ou contrôle glycémique)** — Recommandée ·
   Preuve élevée · Délai du bénéfice 16-26 mois
   - Proposé parce que : DFG < 60 et Maladie cardiovasculaire athéromateuse établie
   - Ce rang tient compte de : Insuffisance cardiaque ou DFG < 60 ou Albuminurie ≠ Normoalbuminurie
2. **Introduire un AR GLP‑1 (liraglutide, sémaglutide, dulaglutide)** — (pas de badge « Recommandée »
   affiché sur cette carte à cette capture) · Preuve modérée · Délai du bénéfice 2 à 5,4 ans
   - Proposé parce que : Maladie cardiovasculaire athéromateuse établie
   - Ce rang tient compte de : Insuffisance cardiaque ou DFG < 60 ou Albuminurie ≠ Normoalbuminurie
     (même texte de motif que l'option iSGLT2 ci-dessus)
3. **Association iSGLT2 + AR GLP‑1 (deux indications distinctes)** — Preuve faible
   - Proposé parce que : DFG < 60 et Maladie cardiovasculaire athéromateuse établie

Aucune autre section affichée. Lien « Pourquoi pas d'autres options ? » et « Déplier l'argumentaire »
présents, non dépliés.

### Question posée par le référent (recette, 2026-07-25)

« AR GLP‑1 et iSGLT2 ne sont-elles pas au même niveau ? Si oui, elles doivent être aussi
physiquement côte à côte. » — constat : contrairement à la capture 1 (gliptine/sulfamide, séparées
par la mention explicite « À égalité — même niveau de priorité »), ici les deux options n'affichent
aucune mention d'égalité, bien que leur texte « Ce rang tient compte de » soit identique mot pour mot.

Lecture du YAML (`content/noeuds/diabete-type-2/prescription.yaml`, `priorite` conditionnelle,
D14) pour ce patient (ASCVD = vrai, DFG = 58 < 60, IC = faux, albuminurie = normo) :

- **iSGLT2** — règles évaluées dans l'ordre déclaré : `IC OR DFG<60 OR albuminurie≠normo` matche en
  1er → **rang 2**.
- **AR GLP‑1** — règles évaluées dans l'ordre déclaré : `IC OR DFG<60 OR albuminurie≠normo` matche
  **en 1er** (ligne 357 du YAML) → **rang 3** — la règle suivante `ASCVD_etablie OR IMC≥30` (ligne
  359, qui donnerait rang 2) n'est jamais atteinte car la résolution retient la PREMIÈRE règle dont
  le `quand` est vrai (`resolvePriorite`, `engine/evaluateNode.ts:402-423`, confirmé à la lecture).

Donc pour CE patient (ASCVD vrai + DFG<60 vrai simultanément), iSGLT2 est classé rang 2 et AR GLP‑1
rang 3 — ils ne sont PAS à égalité, à cause de l'ordre des règles dans la liste `priorite` de
l'option AR GLP‑1 (la branche rénale, moins spécifique à ce patient que l'ASCVD établie, est listée
avant la branche ASCVD et la préempte). Le motif de rang affiché à l'écran est identique pour les
deux options (même texte de `quand`), ce qui masque visuellement que les rangs numériques sous-jacents
diffèrent — d'où la question du référent sur l'égalité apparente.

---

## Capture 6 — même onglet, formulaire modifié (intention → Déprescrire, sous_objectif)

Capture brute du même onglet après modification du formulaire par l'utilisateur (sans renavigation).
Constat factuel uniquement.

### Paramètres saisis

- Intention thérapeutique : **Déprescrire** (alléger ou retirer un traitement)
- Traitements en cours (cochés) : Metformine, iSGLT2 (gliflozine)
- Traitements en cours (non cochés) : AR GLP‑1, Tirzépatide, Sulfamide, Gliptine, Insuline, Glinide
- HbA1c actuelle (%) : 07 (champ affiche « 07 »)
- Par rapport à l'objectif fixé pour ce patient : **En dessous de l'objectif (sur-traitement
  probable)**
- ASCVD établie : coché
- Insuffisance cardiaque : non coché
- DFG : 96
- Albuminurie : Normoalbuminurie
- IMC : 25
- Signaux d'alerte : tous non cochés
- Âge : vide, Fragilité : non coché, Espérance de vie : Intermédiaire, Risque hypo : Faible,
  Préférence injectable : Indifférent

### Champs estompés

- Hypoglycémie récente
- Âge
- Risque hypoglycémique du schéma

### Alerte de nœud

Aucune alerte de nœud affichée à cette capture.

### Bandeau de statut

> Reco provisoire — 3 critères décisifs non confirmés… (identique en formulation aux captures
> précédentes)

### Sortie de l'outil, par ordre d'affichage

**Section « Socle du traitement »**
1. Metformine (socle du traitement) — instaurer ou poursuivre
   — Recommandation officielle (France) · Preuve faible
   - Proposé parce que : Socle maintenu par la recommandation officielle, quelles que soient les
     comorbidités

**Section « Agent à ajouter » (en choisir un)**
1. Introduire un AR GLP‑1 (liraglutide, sémaglutide, dulaglutide) — Recommandée · Preuve modérée ·
   Délai du bénéfice 2 à 5,4 ans
   - Proposé parce que : Maladie cardiovasculaire athéromateuse établie

Aucune autre section affichée (pas de section « Traitement à corriger ou remplacer », « Traitement à
alléger », ni « Aucun geste — surveiller » à cette capture). Lien « Pourquoi pas d'autres options ? »
et « Déplier l'argumentaire » présents, non dépliés.

### Observation relevée par le référent (recette, 2026-07-25)

Avec l'intention **Déprescrire** et la position **« en dessous de l'objectif (sur-traitement
probable) »** explicitement déclarées, l'outil ne propose **aucune option de déprescription** — ni
sur la metformine (bénéfice sur critère dur de preuve faible, cf. carte affichée elle-même :
« Pas de bénéfice sur critère dur démontré vs placebo »), ni sur l'iSGLT2 (en place, sans indication
d'organe établie dans ce jeu de critères précis : insuffisance cardiaque non cochée, DFG normal à 96,
albuminurie normale — seule l'ASCVD cochée le rattache à une indication). Le référent estime que
l'outil devrait suggérer, au moins de façon mesurée, une déprescription portant sur un agent sans
bénéfice démontré (la metformine, dans ce cadre précis) ou sur un agent à bénéfice potentiel mais sans
pathologie avérée le justifiant (l'iSGLT2, ici sans IC ni atteinte rénale ni albuminurie anormale).
Au lieu de cela, la sortie propose d'AJOUTER un AR GLP‑1, ce qui va à l'opposé de l'intention
« Déprescrire » déclarée par le praticien.

---

## Capture 7 — nœud `insuline` (différent du nœud `prescription` des captures 1-6)

Capture brute du même onglet, l'utilisateur ayant navigué vers un autre nœud du domaine DT2 :
« Insulinothérapie du DT2 : Initier, optimiser, intensifier ». Constat factuel uniquement.

### Paramètres saisis

- Situation d'insulinothérapie : **Naïf d'insuline**
- Âge : 70
- HbA1c actuelle (%) : 9
- HbA1c cible (%) : 07 (champ affiche « 07 »)
- DFG : 75
- Fragilité : non coché
- Espérance de vie : Intermédiaire
- Risque hypoglycémique du schéma : Faible
- Hypoglycémies sévères récurrentes / non-perception : non coché
- Symptômes de glucotoxicité : non coché
- Traitements en cours (cochés) : Metformine, iSGLT2 (gliflozine)
- Traitements en cours (non cochés) : AR GLP‑1, Tirzépatide, Sulfamide, Glinide, Gliptine, Insuline
  basale, Insuline rapide
- Préférence vis-à-vis de l'injectable : Accepte
- **MCG disponible : coché**
- Profil glycémique (lecture AGP) : rien coché (Hypoglycémie nocturne, Phénomène de l'aube,
  Excursions post-prandiales, Hypoglycémie interprandiale, Stable — tous non cochés)
- Champs numériques laissés vides : TBR, TBR sévère, Coefficient de variation glycémique, Glycémie à
  jeun, Poids, Dose de basale actuelle, Dose de rapide actuelle

### Champs estompés (« sans effet sur la reco actuelle »)

- Préférence vis-à-vis de l'injectable
- TBR — temps sous 70 mg/dL (%)
- Profil glycémique (lecture AGP)
- Glycémie à jeun (g/L)
- Dose de rapide actuelle (U/j)

### Champs marqués « à confirmer » (décisifs, non renseignés)

- TBR sévère — temps sous 54 mg/dL (%)
- Coefficient de variation glycémique (%)
- Poids (kg)
- **Dose de basale actuelle (U/j)**

### Bandeau de statut

> Reco provisoire — **9 critères décisifs non confirmés** dans le formulaire ci-dessus…

### Alertes de nœud affichées

1. iSGLT2 + insuline : maintenir l'iSGLT2 pour le bénéfice cardio-rénal, mais informer du risque
   d'acidocétose euglycémique — suspendre en cas de jeûne, de chirurgie ou de maladie aiguë
   intercurrente.
2. Cibles de MCG standard (consensus international Battelino 2019 — repères d'interprétation, PAS un
   critère dur validé sur les complications) : TIR > 70 %, TBR < 4 % et < 1 % (< 54 mg/dL), TAR
   < 25 % et < 5 % (> 250 mg/dL), coefficient de variation ≤ 36 %.
3. L'insuline améliore le contrôle glycémique et prévient les complications microvasculaires, mais
   N'A PAS de bénéfice cardiovasculaire démontré (ORIGIN neutre)…

### Sortie de l'outil, par ordre d'affichage

1. **Envisager un GLP-1 (ou une association fixe basale + GLP-1) avant ou avec l'insuline**
   — Recommandée · Preuve modérée
   - Proposé parce que : Situation d'insulinothérapie = Naïf d'insuline
2. **Initier une insuline basale (en maintenant les antidiabétiques en cours)** — Preuve modérée
   - Doses indicatives : Dose initiale (0,1 U/kg) ≈ 0 U/j · Dose initiale (0,2 U/kg) ≈ 0 U/j (poids
     non renseigné)
   - Proposé parce que : Situation d'insulinothérapie = Naïf d'insuline et HbA1c à la cible : non

### Problème relevé par le référent (recette, 2026-07-25)

Pour un patient **naïf d'insuline** (« Situation d'insulinothérapie = Naïf »), le formulaire continue
de demander :
- **« Dose de basale actuelle (U/j) »** — marqué décisif (« à confirmer ») — alors qu'un patient naïf
  n'a par définition **aucune** dose d'insuline actuelle ;
- « Dose de rapide actuelle (U/j) » — même remarque (estompée ici, mais présente dans le formulaire) ;
- tout un ensemble de paramètres de **MCG** (TBR, TBR sévère, coefficient de variation glycémique,
  profil glycémique/lecture AGP) — pertinents pour surveiller un patient **déjà sous insuline**, pas
  pour évaluer l'indication initiale chez un naïf.

Vérification dans le contenu (`content/noeuds/diabete-type-2/insuline.yaml:40-100`) : aucun de ces
critères (`dose_basale_actuelle`, `dose_rapide_actuelle`, `TBR`, `TBR_severe`, `CV_glycemique`,
`profil_glycemique`, `GAJ`) ne porte de `visible_si` conditionné à `situation_insuline` — contrairement
au nœud `prescription`, qui masque `traitements_en_cours` et d'autres champs sans objet selon
l'`intention` déclarée (`visible_si: "intention != initier"`). Le nœud `insuline` n'a, à ce stade,
**aucun mécanisme de masquage équivalent** pour la situation « Naïf d'insuline » : tous les champs
de suivi/titration restent affichés et certains (dose de basale actuelle) sont même comptés parmi les
critères décisifs non confirmés, alors qu'ils n'ont pas d'objet pour ce patient.

---

## Capture 8 — nœud `insuline`, situation « Basale seule »

Capture brute du même onglet, formulaire modifié par l'utilisateur (sans renavigation). Constat
factuel uniquement.

### Paramètres saisis

- Situation d'insulinothérapie : **Basale seule**
- Âge : 70
- HbA1c actuelle (%) : 08 (champ affiche « 08 »)
- HbA1c cible (%) : 7
- DFG : 70
- Fragilité : non coché · Espérance de vie : Longue · Risque hypoglycémique du schéma : Faible
- Hypoglycémies sévères récurrentes / non-perception : non coché
- Symptômes de glucotoxicité : non coché
- Traitements en cours (cochés) : Metformine, iSGLT2 (gliflozine)
- Préférence vis-à-vis de l'injectable : Accepte
- **MCG disponible : coché**
- TBR — temps sous 70 mg/dL (%) : 3
- TBR sévère — temps sous 54 mg/dL (%) : 0
- Coefficient de variation glycémique (%) : 20
- Profil glycémique (lecture AGP) : **Stable** (seule case cochée — Hypoglycémie nocturne, Phénomène
  de l'aube, Excursions post-prandiales, Hypoglycémie interprandiale non cochées)
- Glycémie à jeun (g/L) : vide
- Poids (kg) : 65
- Dose de basale actuelle (U/j) : 10
- Dose de rapide actuelle (U/j) : vide

### Champs estompés

- Symptômes de glucotoxicité
- Préférence vis-à-vis de l'injectable
- Dose de rapide actuelle

### Champ marqué « à confirmer »

- Glycémie à jeun (g/L) — seul champ décisif non renseigné à cette capture

### Bandeau de statut

> Reco provisoire — 4 critères décisifs non confirmés…

### Alertes de nœud affichées

1. iSGLT2 + insuline : maintenir l'iSGLT2 pour le bénéfice cardio-rénal, informer du risque
   d'acidocétose euglycémique…
2. Cibles de MCG standard (Battelino 2019 — repères, pas un critère dur)…
3. L'insuline améliore le contrôle glycémique et prévient les complications microvasculaires, mais
   N'A PAS de bénéfice cardiovasculaire démontré (ORIGIN neutre)…

### Sortie de l'outil, par ordre d'affichage

1. **Titrer la basale (augmenter la dose)** — Recommandée · Preuve modérée
   - Doses indicatives : Basale après +2 U ≈ 12 U/j
   - Proposé parce que : Situation d'insulinothérapie = Basale seule et HbA1c à la cible : non et
     **Glycémie à jeun à la cible : non**

(Aucune autre option affichée à cette capture.)

### Problèmes relevés par le référent (recette, 2026-07-25/26)

1. **Charge de saisie** — nombre important de paramètres à renseigner pour ce nœud, jugé compliqué
   pour un médecin généraliste en consultation courante.

2. **Titration recommandée malgré un profil déclaré « stable »**, sans proposer d'analyse de la
   courbe nocturne. Lecture du contenu (`content/noeuds/diabete-type-2/insuline.yaml:195-213`,
   option « Titrer la basale ») : les seules exclusions de sécurité sont `TBR > 4`, `TBR_severe > 1`,
   `CV_glycemique > 36` et `profil_glycemique contient hypo_nocturne` — des seuils/catégories
   globaux, pas une lecture de la tendance nocturne spécifique. `profil_glycemique` est une liste de
   catégories déclaratives grossières (dont `stable`), et aucune option du nœud ne propose
   explicitement d'« analyser la courbe nocturne » comme étape avant de titrer — alors que c'est,
   selon le référent, le paramètre qui permet réellement d'évaluer si la basale peut être augmentée
   sans risque.

3. **Glycémie à jeun demandée et comptée comme décisive** (seul champ « à confirmer » à cette
   capture, cité tel quel dans le « Proposé parce que » de l'option retenue) **alors que la MCG est
   déclarée disponible** et que ses propres métriques (TBR, TBR sévère, CV) sont déjà renseignées et
   rassurantes. Vérification dans le YAML : `mcg_disponible` n'intervient QUE dans des alertes
   informatives (`insuline.yaml:317-330` — cibles de MCG standard / assouplies), jamais pour réduire
   la pertinence de `GAJ` ou de `gaj_a_cible` dans les conditions des options — la glycémie à jeun
   reste un critère décisif de plein droit même quand une MCG est en place et documentée.

---

## Capture 9 — nœud `insuline`, situation « Basale seule » + hypoglycémie nocturne

Capture brute du même onglet, formulaire modifié (delta vs capture 8 : profil glycémique change de
« Stable » à « Hypoglycémie nocturne »). Constat factuel uniquement.

### Paramètres saisis (deltas vs capture 8)

- Profil glycémique (lecture AGP) : **Hypoglycémie nocturne** (au lieu de « Stable »)
- Reste identique : situation = Basale seule, âge 70, HbA1c 08, cible 7, DFG 70, MCG disponible,
  TBR 3 %, TBR sévère 0 %, CV 20 %, poids 65, dose de basale actuelle 10, GAJ vide

### Champ marqué « à confirmer »

- Glycémie à jeun (g/L) (identique à la capture 8)

### Bandeau de statut

> Reco provisoire — 4 critères décisifs non confirmés…

### Sortie de l'outil, par ordre d'affichage

1. **Corriger l'hypoglycémie ou la variabilité (réduire la dose, passer en 2ᵉ génération, relâcher
   la cible)** — Recommandée · Preuve modérée
   - Doses indicatives : Basale réduite (−20 %) ≈ 8 U/j
   - Proposé parce que : Situation d'insulinothérapie = Basale seule et Profil glycémique comprend
     Hypoglycémie nocturne

**Option écartée affichée** :
- « Titrer la basale (augmenter la dose) » écarté : Profil glycémique comprend Hypoglycémie nocturne

Aucune autre option affichée. Pas de proposition visant à améliorer le contrôle glycémique (HbA1c 8 %
vs cible 7 %, donc `cible_atteinte == false`) à cette capture.

### Problème relevé par le référent (recette, 2026-07-25/26)

Le geste de sécurité est correct (réduire la basale devant une hypoglycémie nocturne documentée), et
l'exclusion de « Titrer la basale » est cohérente. Mais l'outil **ne propose rien pour améliorer le
contrôle glycémique** alors que l'HbA1c (8 %) reste au-dessus de la cible déclarée (7 %) — le seul
geste affiché traite la sécurité, aucun n'adresse l'efficacité.

Lecture du contenu (`content/noeuds/diabete-type-2/insuline.yaml`, situation « Basale seule ») :
la seule option qui pourrait apporter un geste d'efficacité dans cette situation est « Ne pas
sur-titrer la basale — intensifier autrement (GLP-1 puis bolus) » (lignes 175-194), mais ses
conditions sont `situation_insuline == basale_seule AND gaj_a_cible == true AND cible_atteinte ==
false` — elle ne se déclenche QUE si la glycémie à jeun est déjà à la cible (écart isolé au
post-prandial), ce qui n'est pas le cas ici (GAJ non renseigné, donc `gaj_a_cible == false`). Aucune
autre option de la situation « Basale seule » ne couvre le cas « hypoglycémie nocturne + HbA1c non à
la cible » : le geste de sécurité (réduire/relâcher) et un geste d'efficacité complémentaire (ex.
ajouter un GLP-1, comme le fait déjà l'option de la situation « Basal-plus/bolus », ligne 215) ne
sont, à ce stade, jamais proposés ensemble.

---

## Capture 10 — nœud `insuline`, situation « Basal-bolus »

Capture brute du même onglet, formulaire modifié (situation → Basal-bolus). Constat factuel
uniquement.

### Paramètres saisis

- Situation d'insulinothérapie : **Basal-bolus**
- Âge 70, HbA1c 08, cible 7, DFG 70, Fragilité non coché, Espérance de vie Longue, Risque hypo
  Faible, Préférence injectable Accepte
- Traitements en cours (cochés) : Metformine, iSGLT2, **Insuline basale**
- MCG disponible : coché · TBR 3 % · TBR sévère 0 % · CV glycémique 20 %
- Profil glycémique (lecture AGP) : **Hypoglycémie nocturne** ET **Excursions post-prandiales**
  (les deux cochées simultanément — Phénomène de l'aube et Hypoglycémie interprandiale non cochés)
- Glycémie à jeun : vide · Poids : 65 · Dose de basale actuelle : 10 · Dose de rapide actuelle : 5

### Champs estompés

- Symptômes de glucotoxicité
- Préférence vis-à-vis de l'injectable
- Glycémie à jeun

### Champs « à confirmer »

Aucun à cette capture.

### Bandeau de statut

> Reco provisoire — 3 critères décisifs non confirmés…

### Sortie de l'outil, par ordre d'affichage

1. **Optimiser la répartition du basal-bolus (guidé par l'AGP et les doses actuelles)**
   — Recommandée · Preuve faible
   - Doses indicatives : **Dose totale quotidienne ≈ 15 U/j** (seul chiffre calculé — somme basale +
     rapide)
   - Avantages (texte intégral affiché, identique quel que soit le profil AGP coché) : « équilibrer
     basal/bolus (~50/50) et ajuster à partir des doses actuelles, guidé par le profil AGP — hypo
     nocturne → réduire la basale ; phénomène de l'aube → augmenter la basale ; excursions
     post-prandiales → augmenter le bolus / avancer le timing ; hypo interprandiale → réduire le
     bolus. »
   - Proposé parce que : Situation d'insulinothérapie = Basal-bolus

Aucune autre option affichée à cette capture.

### Problème relevé par le référent (recette, 2026-07-25/26)

« La recommandation n'a rien de concret. » Constat : pour ce patient, **deux catégories de profil
AGP sont cochées simultanément** (hypoglycémie nocturne ET excursions post-prandiales — orientations
opposées : la première invite à réduire la basale, la seconde à augmenter le bolus), mais l'unique
option affichée se contente d'un **texte générique énumérant les quatre règles possibles** (hypo
nocturne / phénomène de l'aube / excursions post-prandiales / hypo interprandiale), sans indiquer
LAQUELLE s'applique à ce patient précis ni calculer d'ajustement concret pour l'une ou l'autre. Le
seul chiffre calculé (« Dose totale quotidienne ≈ 15 U/j ») est une simple somme des doses actuelles
(`dose_basale_actuelle + dose_rapide_actuelle`, `insuline.yaml:277`), pas un ajustement dérivé du
profil déclaré. Vérification dans le
contenu : l'option « Optimiser la répartition du basal-bolus » (`insuline.yaml`, section « SITUATION 4
— BASAL-BOLUS COMPLET ») ne porte qu'une seule condition (`situation_insuline == basal_bolus`), sans
lire `profil_glycemique` pour sélectionner ou chiffrer un geste spécifique — contrairement aux options
des situations « Basale seule » ou « Ajout d'un bolus », qui, elles, conditionnent leur affichage ou
leurs exclusions sur des valeurs précises de `profil_glycemique`/MCG.

---

## Capture 11 — nœud `rhd` « Accompagner les mesures hygiéno-diététiques » — deux patients opposés, une seule recommandation

Navigation dans le module RHD (à la demande du référent). Deux jeux de critères délibérément opposés
ont été saisis pour éprouver la sensibilité du nœud.

### Profil A — obésité, diabète récent, patient ni motivé ni actif

Saisie : IMC **32** · ancienneté **3 ans** · Motivation **non** · Capacité à l'activité physique **non** ·
Alimentation déjà équilibrée **non** · Activité physique déjà régulière **non** · aucun traitement coché.

Alertes affichées (4) : fenêtre favorable à la rémission (< 6 ans) ; adapter l'activité aux capacités ;
adhésion à renforcer ; sujet âgé/fragile/dénutri (alerte `default`, affichée systématiquement).

Options :
1. **Mesures hygiéno-diététiques — socle recommandé à tous** — Recommandation officielle (France) ·
   Preuve modérée · *Proposé parce que : Socle maintenu par la recommandation officielle, quelles que
   soient les comorbidités.*
2. **Perte de poids importante visée rémission — informer, recommander, orienter** — Recommandée ·
   Preuve modérée · *Proposé parce que : IMC ≥ 27.*

### Profil B — poids normal, diabète ancien, patient motivé, déjà équilibré et actif

Saisie : IMC **24** · ancienneté **15 ans** · Motivation **oui** · Capacité à l'activité physique **oui** ·
Alimentation déjà équilibrée **oui** · Activité physique déjà régulière **oui** · aucun traitement coché.

Alertes affichées (2) : mode de vie déjà optimisé (marge de manœuvre faible) ; sujet âgé/fragile/dénutri
(`default`).

Options :
1. **Mesures hygiéno-diététiques — socle recommandé à tous** — carte **identique mot pour mot** à celle
   du profil A (même titre, mêmes avantages, mêmes inconvénients, même `effet_attendu`, même justification
   « quelles que soient les comorbidités »).

### Constat

Entre deux patients que tout oppose, la **seule** différence dans les *recommandations* est
l'apparition/disparition de la carte « rémission » sur le seul seuil `IMC >= 27`. Le contenu de la
recommandation socle — celle qui s'applique à 100 % des patients — est strictement invariant. Les six
critères saisis ne produisent, en dehors de ce seuil, que des variations d'**alertes** (messages de
cadrage), jamais de contenu de recommandation.

---

## Analyse de pertinence du module RHD — diagnostic et pistes de refonte

> Demande du référent (2026-07-26) : le module « n'apporte aucun élément pour proposer des
> recommandations pertinentes personnalisées ; il recommande systématiquement le seul régime ayant
> prouvé des bénéfices ». Il doit être **repensé entièrement** : *l'EBM donne l'objectif (régime
> méditerranéen), les recommandations doivent permettre de s'en rapprocher*. Analyse ci-dessous à
> partir de l'app et des sources déjà présentes dans `docs/decision/sources/`. **Aucun code produit.**

### 1. Diagnostic structurel — pourquoi la sortie est générique

Le nœud actuel (`content/noeuds/diabete-type-2/rhd.yaml`) tient en **6 critères d'entrée** (IMC,
ancienneté, 4 booléens) et **2 options**, dont les conditions sont `["toujours"]` et `IMC >= 27`. Tout
le reste du raisonnement clinique est porté par **8 alertes**, c'est-à-dire par des messages de
cadrage — jamais par une recommandation dont le *contenu* dépend du patient.

C'est un choix qui a été **explicitement validé** en son temps (`docs/decision/noeuds/H-rhd.md` §8-4,
2026-07-24) : `motivation`, `capacite_activite` et la « marge de manœuvre » ont été arbitrés en
**modulation d'affichage, jamais en gating**. La conséquence mécanique de cet arbitrage est exactement
ce que la recette constate : une recommandation unique, invariante, entourée de messages qui varient.
La refonte demandée **rouvre cet arbitrage** — ce n'est pas un défaut d'encodage, c'est le modèle qui
est en cause.

Second constat, plus profond : **le nœud est architecturé autour du poids et de la rémission**
(l'unique seuil décisif est `IMC >= 27`, la seconde option porte la rémission), alors que son propre
dossier de preuve établit que :

- le **seul bénéfice sur critère CV dur** de toutes les MHD est celui du **motif alimentaire
  méditerranéen** (PREDIMED, CORDIOPREV — 2 ECR, ~50 % de diabétiques) ;
- l'intervention **intensive sur le mode de vie centrée sur la perte de poids** est **neutre sur les
  critères durs** (Look AHEAD, arrêté pour futilité) ;
- la **rémission** est un substitut **érodable** (46 % → 13 % à 5 ans, DiRECT), sans bénéfice dur
  démontré.

Autrement dit : la seule variable que le nœud laisse piloter la décision (l'IMC) commande la branche
**la moins solide** de son propre corpus, tandis que la branche **la mieux étayée** (le motif
alimentaire) est réduite à une ligne de prose invariante — « alimentation type méditerranéen » — dont
le patient ne saura pas quoi faire. Le recadrage proposé par le référent (l'EBM fixe la **cible**, les
recommandations organisent le **rapprochement**) ne relève donc pas seulement de l'ergonomie : il
**réaligne le nœud sur sa propre base de preuves**.

### 2. Ce que les recommandations officielles exigent — et que l'outil ne collecte pas

La refonte n'a pas besoin d'être justifiée par le confort d'usage : **les recos officielles la
prescrivent déjà**, et l'outil ne les honore pas.

- **HAS 2024, DT2** (`sources/strategie_therapeutique…pdf`) — **R.32 (AE)** : individualiser « en
  fonction de la **situation** (âge, poids initial, **comportement alimentaire**, **niveau
  socio-économique**, **littératie en santé**) » ; **R.36 (AE)** : les ajustements alimentaires
  « doivent tenir compte des **habitudes du patient**, de son **comportement alimentaire**, de sa
  **motivation**, de ses **possibilités de changement** et de son **entourage** » ; **R.44 (AE)** :
  s'adapter « au mode de vie du patient, à ses habitudes ainsi qu'à ses **facteurs culturels et
  socio-économiques** » ; **R.22 (AE)** : l'AP est individualisée sur « le **niveau initial**
  d'activité, les **capacités physiques**, les **comportements de sédentarité** et les **préférences** ».
- Aucune de ces dimensions — comportement alimentaire, niveau socio-économique, littératie, entourage,
  culture, niveau initial d'AP, sédentarité, préférences — **n'existe comme critère d'entrée** du nœud.
  Le nœud collecte deux booléens (`alimentation_equilibree`, `activite_physique_reguliere`) là où la
  reco demande un profil.

C'est un argument défendable en l'état : **l'outil est en retrait de la recommandation officielle qu'il
affiche**, et le dit lui-même en badgeant sa carte « Recommandation officielle (France) ».

### 3. Matière déjà présente dans le dépôt pour construire la grille de recueil

Trois sources du dépôt contiennent, telles quelles, des **grilles d'évaluation structurées** qui sont
presque des maquettes de formulaire.

**a) `sources/Lifestyle education in type 2 diabetes _ ebmfrance.pdf`** (EBM Guidelines/Duodecim,
gradé A/B) — c'est le document le plus directement réutilisable : il est bâti en **3 temps** qui sont
exactement le flux demandé.

1. *Assess the patient's situation* — recueil des habitudes : ce qui est mangé **à chaque repas** et à
   quelle heure, **grignotage entre les repas**, **ce qui est bu quand on a soif** ; consommation de
   « **fast sugars** » (boissons sucrées, boissons énergisantes, sucreries, desserts sucrés, fructose)
   et d'aliments riches en **graisses saturées** ; **sel** (ajout à table, produits salés, sel de
   cuisson, teneur du pain) ; **habitudes d'exercice et intensité** (« combien de fois par semaine
   au point d'être essoufflé et de transpirer ? durée d'une séance ? au travail, dans les trajets, en
   loisir ? ») ; **sommeil** (apnées, somnolence) ; **tabac** ; **alcool** (unités/semaine).
2. *Discuss the aims* — « les objectifs doivent être **ceux du patient**, importants **pour lui**,
   **plutôt petits que grands**, **concrets et observables**, portant sur le **comportement** » ; et
   surtout une **liste d'objectifs concrets exemplaires** : arrêter les sodas sucrés et boissons
   énergisantes ; réfléchir à deux fois avant les sucreries ; passer aux laitages 0 % ; **diviser par
   deux** fromage et charcuterie ; huile en cuisson et margarine molle sur le pain ; marche ou autre
   activité plaisante qui accélère le cœur **4-5×/semaine** + renforcement musculaire. Objectifs
   **écrits, remis au patient, notés au dossier, suivis** (téléphone ou consultation).
   Point EBM notable : « **regular physical exercise predicts good long-term results (A)**, whereas
   **rapid weight loss at the beginning does not** » — ce qui va dans le sens du §1 ci-dessus.
3. *Offer guidance* — conseils de mise en œuvre (variété, féculents complets, 2-3 poignées de
   fruits/légumes, poisson 2×/sem, matières grasses avec parcimonie), **taille de portion rapportée au
   poids**, « fournir un **repas-type ou une photo** d'un repas recommandé », **manger sans se presser**,
   **horaires de repas fixes** ; et pour l'AP : « augmenter l'activité dans les **activités
   quotidiennes normales** — cela consomme autant que de l'exercice planifié », « **toutes les formes
   d'exercice que le patient aime** et qui lui sont praticables conviennent », « **plusieurs séances
   courtes** valent presque une longue », carnet d'activité comme levier de motivation.

**b) `sources/guide HAS._parcours_surpoids-obesite_de_ladulte.pdf`** §3.5 (p. 41-44) et Fiches 4-5
(p. 178-179, 188-189) — la grille de recueil la plus fine, et **en français** :

- *Alimentation* (§3.5.2) : contexte des prises alimentaires (maison, restaurant d'entreprise,
  **restauration rapide**, seul/en famille, temps consacré, **régularité** — nombre, durée, horaires —,
  **écrans pendant le repas**) ; **taille des portions**, repas/collations/**grignotage**, aliments
  **denses en énergie** ; régimes d'exclusion ; **traditions culinaires et goûts** ; perceptions (faim,
  satiété, rassasiement) ; rapport au sucré/salé/gras ; **« habitudes personnelles, familiales,
  culturelles : cuisine faite maison, consommation de produits ultratransformés »** ; **connaissances**
  (lien alimentation-santé, qualité nutritionnelle) ; TCA.
- *Fiche 4 (diététicien)* ajoute deux dimensions décisives pour une MSP du 20e : **« accès à une
  alimentation variée (géographique et financier) »** et **« accès à du matériel pour cuisiner
  (stockage, cuisson, service) »**, plus l'historique de poids et les régimes antérieurs.
- *Activité physique* (§3.5.1, Fiche 5) : habitudes, **modes de déplacement** (à pied/vélo),
  **sédentarité** (temps assis hors sommeil, écrans, **habitudes de rupture**), AP **professionnelle**
  (port de charges), **aptitudes et restrictions**, **goûts**, expériences antérieures et perceptions
  (« plaisir, sentiment de compétence, dégoût, autodépréciation, idées fausses : fatigue, peur de se
  blesser »), **crainte des moqueries / stigmatisation**, **difficultés d'accès ou financières**,
  **offre de proximité**. Un questionnaire est explicitement cité (**ONAPS**, URL donnée p. 42).
- *Principe directeur* (Fiche 4, p. 179) : les objectifs doivent être « **raisonnables, définis en
  accord avec la personne**, personnalisés, **progressifs, faciles à mettre en œuvre, culturellement
  acceptables et acceptés, révisables** ». C'est, mot pour mot, le cahier des charges du module
  demandé.

**c) `sources/rapport_gtg_glucides_sfd.pdf`** (SFD Paramédical + AFDN 2016) — jusqu'ici classé
« alimente le socle diététique de l'argumentaire », c'est-à-dire **de la prose**. Il contient pourtant
la logique qui permettrait de **classer des propositions** :

- « Les termes erronés de "**sucre lent**" ou "**sucre rapide**" doivent être **totalement abandonnés**
  et remplacés par la notion d'**index glycémique** » — la baguette, ex-« sucre lent », a un IG proche
  du glucose.
- **Le degré de transformation prime sur le groupe botanique** : « pour un même groupe d'aliments […]
  c'est le **degré de transformation qui fait sens** d'un point de vue nutritionnel, et non pas les
  céréales en tant que groupe botanique ». → fonde directement un critère « fréquence d'aliments
  ultratransformés » plutôt qu'un comptage de familles.
- **Matrice alimentaire et satiété** : « plus l'aliment est **déstructuré**, plus sa réponse glycémique
  est élevée et **moins il est satiétogène** » (pomme → compote → jus) → « favoriser les aliments
  naturels complexes aux aliments trop déstructurés ».
- **Cuisson et forme** : légumineuses en graines entières vs en soupe ; pâtes trop cuites (verbatim
  patient rapporté dans le document).
- **Sensibilité individuelle à l'IG**, testable simplement : deux petits-déjeuners à glucides égaux,
  pain blanc vs pain complet, **sans changer le traitement**, et on observe. → un **mécanisme de
  personnalisation par l'expérimentation**, transposable en « proposition à tester puis réévaluer ».
- **L'erreur dominante porte sur les quantités, pas sur les grammes** : « l'erreur vient bien plus
  souvent d'une **mauvaise appréciation des quantités** consommées que des grammes de glucides comptés
  en plus ou oubliés » ; outils proposés : peser 2-3 fois pour construire la « **balance des yeux** »,
  **repères visuels** sur la vaisselle (bol, cuillère, fraction d'assiette).
- Et, décisif pour la demande du référent : « les **habitudes culturelles** de consommation **ne
  trouvent pas toujours réponse précise dans les tables de composition** » — la SFD elle-même acte le
  trou que la « collecte de données non scientifiques » viendrait combler.

**d) `sources/prescrire-dt2.md`** (P9, P10) — apporte deux angles complémentaires : le signal
**ultratransformés/émulsifiants** (NutriNet-Santé, *Lancet Diabetes Endocrinol* 2024 — niveau
**épidémiologique**, à présenter comme prudence et non comme bénéfice démontré) et la fiche patient
P10 qui est déjà rédigée en **objectifs concrets** (« marcher à bonne allure une demi-heure chaque
jour », « éviter les édulcorants intenses », composition d'un motif méditerranéen). P10 est un modèle
de **registre de formulation** pour les propositions.

### 4. Ce que devient une « recommandation » dans le nœud refondu

Le renversement à opérer : aujourd'hui une option = **une stratégie** (le socle, la rémission) ;
demain une option = **une piste d'amélioration concrète, actionnable, gatée sur une habitude
déclarée**.

Esquisse de forme (à discuter, non figée) :

- **La cible reste unique et EBM** : se rapprocher du motif méditerranéen + activité régulière. Elle
  n'est plus une *recommandation* affichée à tous mais l'**en-tête** du nœud — le cap, avec son niveau
  de preuve et ses réserves (Look AHEAD, pas de promesse de survie).
- **Les options deviennent des pistes**, chacune avec : le **déclencheur** (l'habitude qui l'ouvre),
  le **geste proposé** (formulé en comportement observable, registre P10/ebmfrance), l'**écart comblé**
  par rapport à la cible, le **niveau de preuve/provenance**, et une **estimation d'effort** pour le
  patient. Exemples de familles :
  - *Boissons* — déclencheur : boissons sucrées ≥ x/semaine → « remplacer par eau/eau aromatisée ;
    ne pas basculer sur des édulcorants intenses » (Prescrire P1/P9/P10).
  - *Ultratransformés / plats préparés* — déclencheur : fréquence déclarée → pistes de substitution
    graduées, tenant compte de l'**accès au matériel de cuisine** et du **temps** (HAS Fiche 4).
  - *Restauration rapide* — déclencheur : fréquence → pistes de choix sur place plutôt qu'interdiction.
  - *Matières grasses* — déclencheur : beurre/charcuterie/fromage → « huile d'olive/colza en cuisson »,
    « diviser par deux » (ebmfrance) — c'est le levier le plus proche du bras PREDIMED.
  - *Structure des repas* — déclencheur : grignotage, tachyphagie, repas devant écran, horaires
    irréguliers → horaires fixes, manger sans se presser, repas-type illustré.
  - *Portions* — déclencheur : difficulté d'estimation → « balance des yeux », repères de vaisselle (SFD).
  - *Activité — déplacements* — déclencheur : trajets motorisés courts → report modal partiel.
  - *Activité — sédentarité* — déclencheur : temps assis élevé → rupture toutes les 1 h-1 h 30
    (HAS R.16 ; guide obésité p. 189 : « au moins 4 à 5 minutes toutes les heures et demie »).
  - *Activité — pratique structurée* — déclencheur : niveau initial + goûts + accès → endurance +
    renforcement, 2-3 séances/semaine (HAS R.24), orientation maison sport-santé (HAS R.25).
- **Le tri des pistes** ne peut pas être un score caché (invariant D3). Il peut en revanche être un
  **rang déclaré dans le contenu**, comme ailleurs dans le projet : rang par **proximité à la cible
  EBM** (les leviers du motif méditerranéen d'abord) puis par **faisabilité déclarée** (motivation,
  accès, capacités). La règle « pas de gating dur sur la motivation » (§8-4) reste tenable : la
  motivation **ordonne** les pistes, elle n'en supprime aucune.
- **Le nombre de pistes affichées doit être borné** (2-3 à négocier en consultation, conformément à
  « plutôt petites que grandes » — ebmfrance) : afficher 15 pistes reproduirait le défaut inverse.

### 5. Données à collecter — et comment rester dans les clous du projet

Le référent anticipe justement que cette refonte demandera des données « pas forcément exclusivement
issues de la littérature scientifique ». C'est exact, et c'est le point qui demande le plus de soin,
parce que le projet a un invariant explicite (`CLAUDE.md` n° 6 : contenu sourcé, distinction
dur/substitution ; n° 2 : aucun score caché).

Nature des données manquantes, par ordre de « distance à l'EBM » :

1. **Repères officiels non-EBM mais opposables** — repères ANSES/PNNS/Santé publique France cités par
   la HAS, Nutri-Score (HAS Fiche 4), repères d'AP de l'OMS. Statut : *recommandation officielle*,
   déjà un statut existant dans le projet.
2. **Savoir-faire diététique** — les **équivalences et substitutions par tradition culinaire**
   (maghrébine, ouest-africaine, antillaise, sud-asiatique, est-asiatique, française populaire…) :
   quel geste rapproche le plus du motif méditerranéen **sans sortir de la cuisine du patient**. Ce
   corpus n'existe pas sous forme d'essais ; il relève de la pratique diététique et, idéalement, d'un
   **apport du diététicien de la MSP**. La SFD acte elle-même le trou (§3c).
3. **Ressources locales** — maisons sport-santé, structures APA, diététiciens du territoire : la HAS
   en fait une recommandation (**R.25**) sans fournir l'annuaire. Recoupe directement le projet
   `annuaire-msp`.
4. **Supports patient** — repas-type illustré, repères visuels de portion, carnet d'activité
   (ebmfrance les recommande explicitement, sans les fournir).

Proposition de garde-fou, cohérente avec ce que le projet fait déjà (cf. la « suggestion auto non
sourcée » d'`esperance_vie`, `lib/esperanceVieDefault.ts`, signalée comme heuristique d'interface et
non comme fait clinique) : **chaque piste porte son niveau de provenance**, affiché, avec quatre
étiquettes possibles — *bénéfice EBM sur critère dur* / *recommandation officielle* / *savoir-faire
diététique (non EBM)* / *ressource locale*. Rien n'interdit d'afficher du savoir-faire ; ce qui est
interdit, c'est de le faire passer pour de la preuve. Le nœud garderait ainsi son honnêteté
épistémique tout en devenant utile.

### 6. Conséquences techniques à anticiper (sans rien coder)

- **Charge de saisie** — c'est le risque n° 1, déjà constaté sur le nœud `insuline` (capture 8). Un
  recueil à 20-30 items est impraticable en consultation. Deux parades déjà éprouvées dans le dépôt :
  le **primer par intention** du nœud `prescription` (choisir l'axe : alimentation / activité / les
  deux, puis n'afficher que ses questions, via `visible_si`), et le bouton **« Rien à signaler »** par
  section. À prévoir dès la conception, pas après.
- **Moteur de pertinence** — `engine/relevance.ts` calcule la pertinence par **perturbation** (chaque
  critère × chaque valeur candidate → reconstruction complète de la vue). Multiplier les critères
  d'entrée fait croître ce coût de façon multiplicative, et le banc R5 a déjà un budget de temps
  contraint (cf. `GRAMMAIRE-NOEUD.md`). À chiffrer avant de figer le nombre de critères.
- **Grammaire** — a priori **aucune évolution du moteur n'est nécessaire** : une piste = une `option`
  avec ses `conditions`, sa `famille` (l'axe), sa `priorite`. Le changement est de **granularité de
  contenu**, pas de mécanique. À vérifier sur un ou deux cas limites (notamment le tri par faisabilité).
- **Volume de contenu** — c'est le vrai coût : une bibliothèque de pistes × traditions culinaires,
  chacune sourcée et relue. Le nœud passerait de 2 options à plusieurs dizaines. Un **périmètre initial
  restreint** (2-3 axes, 1-2 traditions culinaires en pilote) serait plus sage qu'une couverture
  complète d'emblée — le projet a déjà procédé ainsi pour le module HE de `cosme-diy` (pilote 3 HE).

### 7. Garde-fous cliniques à ne pas perdre dans la refonte

- **Non-culpabilisation** — la HAS y insiste (« la stabilisation du poids est déjà un succès », éviter
  les régimes restrictifs rigides, valoriser tout changement, déculpabiliser). Un outil qui demande
  « à quelle fréquence mangez-vous de la restauration rapide ? » puis répond « réduisez la restauration
  rapide » tombe exactement dans le registre que la HAS met en garde. Les pistes doivent être formulées
  comme **matière à négociation en consultation**, pas comme verdicts.
- **TCA et restriction cognitive** — la HAS consacre un encadré au repérage (hyperphagie prandiale,
  tachyphagie, alimentation émotionnelle, manger en cachette, **restriction cognitive**, compulsions).
  Proposer une restriction à un patient en restriction cognitive est **contre-indiqué**. Un repérage
  minimal devrait **gater** les pistes de type restrictif — c'est le seul endroit où un gating dur me
  semble justifié.
- **Dénutrition / sarcopénie** — HAS **R.37** : régimes quantitatifs/qualitatifs **fortement
  déconseillés** en cas de risque de dénutrition ou de sarcopénie, en particulier chez la personne âgée
  fragile. L'alerte `default` actuelle du nœud le dit déjà, mais elle s'affiche pour **tout le monde**,
  donc pour personne.
- **Sécurité de l'AP** — HAS R.19/R.27/R.28 : évaluation médicale minimale avant intensité modérée,
  vigilance ischémie, hypoglycémie sous insulinosécréteur, rétinopathie proliférante et manœuvre à
  glotte fermée, mal perforant plantaire, déshydratation du sujet âgé, seuil de 2,5 g/L avant l'effort.
  Une piste « augmenter l'intensité » doit être gatée là-dessus.
- **Alerte hypoglycémie sous insuline/SU/glinide** (déjà présente, §8-5) : à conserver, et à renforcer
  si des pistes de réduction des apports deviennent concrètes.

### 8. Questions à trancher avec le référent avant toute conception

1. **Périmètre du pilote** : les deux axes (alimentation + activité) d'emblée, ou l'alimentation
   seule pour valider la forme ?
2. **Traditions culinaires** : lesquelles, et sur quelle base les décrire ? Qui fournit le contenu
   (diététicien de la MSP ? patients ?) — c'est le point qui conditionne tout le reste.
3. **Registre du recueil** : fréquences déclaratives simples (« jamais / < 1× sem / 1-3× sem /
   ≥ 4× sem ») ou instrument existant ? Deux candidats à évaluer, **à vérifier en source primaire** :
   le **MEDAS** (screener d'adhérence méditerranéenne à 14 items utilisé dans PREDIMED — l'essai qui
   fournit précisément le bénéfice dur, ce qui en ferait l'instrument le plus cohérent avec la cible)
   et le **questionnaire ONAPS** pour l'AP (explicitement cité par la HAS, p. 42). Aucun des deux n'a
   été vérifié dans le cadre de cette recette.
4. **Statut de la rémission** : reste-t-elle une option du nœud, ou bascule-t-elle en note/orientation
   (comme la chirurgie l'a été en §8-1) maintenant que le nœud se recentre sur le motif alimentaire ?
5. **Nombre de pistes affichées** et règle de tri : proximité à la cible EBM d'abord, ou faisabilité
   d'abord ?
6. **Frontière avec l'ETP et le diététicien** : le nœud reste-t-il « outil d'aide à la recommandation »
   pour le MG (§8, recadrage 2026-07-24), ou devient-il un support partagé MG/diététicien ? La réponse
   change la profondeur du recueil acceptable.

---

## Capture 12 — exploration systématique du nœud `insuline` (2026-07-26)

Six situations testées dans l'app à la demande du référent, en faisant varier les critères pour
éprouver les frontières du nœud. Chaque constat a été recoupé avec
`content/noeuds/diabete-type-2/insuline.yaml`. **Onze anomalies**, regroupées par nature.

### A. L'absence de donnée est lue comme une valeur — et pas dans le même sens selon le champ

**12.1 — Formulaire vierge.** À l'ouverture du nœud, aucun champ renseigné, l'outil affiche déjà :

- l'alerte **« Insuffisance rénale : besoins en insuline réduits et risque d'hypoglycémie majoré… »**
  → sa condition est `DFG < 45` (`insuline.yaml:305`) et un DFG vide vaut **0** ;
- et **aucune** option d'initiation d'insuline, alors que la situation est « Naïf ». Motif : le dérivé
  `cible_atteinte = HbA1c_actuelle <= HbA1c_cible` (`:52`) vaut `0 <= 0` = **vrai** → l'outil considère
  l'**objectif glycémique atteint**.

Sur un formulaire vide, le nœud affirme donc simultanément une **insuffisance rénale** et un
**objectif atteint**. Les deux champs vides sont lus dans des sens **opposés** : le DFG vide est lu
comme pathologique, l'HbA1c vide comme rassurante. Le bandeau « provisoire » ne rattrape pas cela —
il annonce des critères à confirmer, pas des affirmations à ignorer.

**12.2 — Champ saisi puis vidé.** Après avoir saisi puis effacé l'HbA1c, le champ n'affiche pas « — »
mais **« 0 »**, et perd sa mention « à confirmer » : il est désormais compté comme **renseigné**.
L'option « Initier une insuline basale » disparaît (HbA1c 0 % ≤ cible 7 % → objectif atteint). Une
HbA1c de 0 % est une valeur impossible, jamais signalée comme telle.

**12.3 — Glycémie à jeun vide (déjà vu en captures 8-9, confirmé).** `gaj_a_cible = GAJ >= 0.7 AND
GAJ <= 1.2` (`:91`) : un GAJ vide (0) donne « **pas** à la cible » → déclenche « Titrer la basale »,
avec la justification affichée « Glycémie à jeun à la cible : non » — une affirmation tirée d'un
champ vide.

**12.4 — Poids vide et division par zéro.** `over_basalisation = dose_basale_actuelle / poids > 0.5`
(`:100`). Testé avec dose basale **40 U/j** et poids **vide (0)** : `40 / 0` → `Infinity > 0.5` →
l'alerte **« Dose basale élevée (> 0,5 U/kg) »** s'affiche alors que le poids est **inconnu**. Aucun
garde-fou sur le dénominateur.

**12.5 — Doses calculées à zéro.** Poids absent ou vidé → l'outil affiche « **Doses indicatives :
Dose initiale (0,1 U/kg) ≈ 0 U/j · Dose initiale (0,2 U/kg) ≈ 0 U/j** » (déjà visible en capture 7).
Une dose d'insuline de 0 U/j est affichée comme un repère de prescription.

### B. Deux définitions incompatibles du « risque hypoglycémique » dans le même nœud

**12.6 — Patient de 80 ans, non coché fragile, EV « longue », risque du schéma « faible », HbA1c 9 %
vs cible 7 %, naïf d'insuline, MCG disponible.** L'outil affiche :

- l'alerte **« Sujet âgé / fragile / à haut risque d'hypoglycémie : cibles de MCG ASSOUPLIES »** —
  elle est gatée sur `terrain_fragile`, dérivé qui **inclut `age >= 75`** (`:65`) ;
- **mais PAS** l'option « **Choisir un analogue basal de 2ᵉ génération (glargine U300 ou degludec) si
  risque hypoglycémique** » — sa condition est `risque_hypoglycemie_schema == eleve OR fragilite ==
  true OR esperance_vie == limitee` (`:146`), qui **n'inclut pas l'âge**.

Le même patient est donc « âgé à haut risque d'hypoglycémie » pour relâcher les cibles de MCG, et
« sans risque hypoglycémique » pour le choix de l'insuline. Le texte de l'option elle-même nomme
pourtant explicitement la population visée : *« Chez le patient à risque d'hypoglycémie (**âgé**,
fragile, insuffisance rénale, hypoglycémies nocturnes), préférer glargine U300 ou degludec »* — la
prose et la règle se contredisent.

**12.7 — Même faille sur la désintensification.** Situation **basal-bolus**, **80 ans**, **HbA1c 6 %
pour une cible de 7 %** (donc en dessous de l'objectif), GAJ 1,0 g/L, pas de fragilité cochée :
l'outil ne propose **aucun allègement** — seulement « Optimiser la répartition du basal-bolus ».
L'option « Désintensifier / alléger le schéma » exige `fragilite == true OR esperance_vie == limitee
OR hypo_severe_recurrente == true` (`:258`) : l'âge seul ne l'ouvre pas. En cochant la seule case
« Fragilité », l'option apparaît immédiatement. Un sujet de 80 ans en sur-traitement sous basal-bolus
ne déclenche donc rien tant qu'une case déclarative n'est pas cochée — alors que le sur-traitement du
sujet âgé est précisément le risque autour duquel le nœud A est construit.

### C. Contradictions frontales entre une alerte et la recommandation affichée

**12.8 — Le cas le plus net.** Situation « **Basale seule** », dose basale **40 U/j**, âge 80,
HbA1c 9 % vs cible 7 %, GAJ non renseignée. L'écran affiche **en même temps** :

> **Alerte** — « Dose basale élevée (> 0,5 U/kg — repère) : **ne pas poursuivre la titration de la
> basale**, préférer l'ajout d'un GLP-1 ou d'un bolus prandial (l'excès de basale majore
> l'hypoglycémie sans corriger l'écart post-prandial). »

> **Recommandation (la seule)** — « **Titrer la basale (augmenter la dose)** » · Recommandée ·
> **Doses indicatives : Basale après +2 U ≈ 42 U/j**

L'alerte interdit exactement le geste que la recommandation chiffre. Mécanisme : l'option qui devrait
prendre le relais — « Ne pas sur-titrer la basale — intensifier autrement (GLP-1 puis bolus) »
(`:175-194`) — exige `gaj_a_cible == true`, or la GAJ est vide donc lue « pas à la cible » (cf. 12.3) ;
c'est « Titrer la basale » qui se déclenche à sa place. L'alerte `over_basalisation` et les options
sont calculées indépendamment, sans aucun arbitrage entre elles.

**12.9 — Seconde occurrence, en sens inverse.** Situation « Basale seule », dose basale 40 U/j,
poids 70 kg (donc 0,57 U/kg, alerte légitime cette fois), HbA1c 6 % vs cible 7 %, GAJ 1,0 :
l'alerte dit « préférer **l'ajout d'un GLP-1 ou d'un bolus prandial** » pendant que la recommandation
retenue est « **Poursuivre le schéma en cours et réévaluer** », dont le texte affirme « **aucun
ajustement n'est indiqué** ». Même défaut de coordination, dans l'autre sens.

### D. Cohérence non vérifiée entre la situation déclarée et les traitements déclarés

**12.10 —** Situation « **Naïf d'insuline** » **et** case « **Insuline basale** » cochée dans
« Traitements en cours » : l'outil recommande sans broncher « **Initier une insuline basale** » et
calcule une dose de départ (7-14 U/j pour 70 kg). Aucune alerte de cohérence. C'est la même famille
de défaut que le nœud `prescription` (capture 4, « Envisager l'insuline » chez un patient déjà sous
insuline), et que la capture 10 (dose de rapide 5 U/j renseignée alors que « Insuline rapide » n'est
pas cochée). Les deux déclarations — situation et traitements — ne sont jamais recoupées.

### E. Le nœud ne peut structurellement pas dire « rien à faire » hors d'une seule situation

**12.11 —** L'option de repli « Poursuivre le schéma d'insuline en cours et réévaluer »
(`conditions: ["default"]`, `:278`) ne se déclenche que si **aucune** autre option ne s'applique. Or
dans trois des quatre situations, une option a pour **unique** condition la situation elle-même :

| Situation | Option qui se déclenche toujours | Repli atteignable ? |
|---|---|---|
| Naïf | « Envisager un GLP-1… » (`:105`) | **non** |
| Basale seule | *(toutes conditionnées)* | **oui** — vérifié en 12.9 |
| Basal-plus / bolus | « Ajouter un bolus au repas principal » (`:231`) | **non** |
| Basal-bolus | « Optimiser la répartition du basal-bolus » (`:268`) | **non** |

Vérifié en 12.7 : un patient sous basal-bolus **à l'objectif, sans hypoglycémie, sans variabilité**
reçoit quand même « Optimiser la répartition du basal-bolus », justifié par le seul fait d'être sous
basal-bolus. Le nœud ne dispose d'aucun moyen de conclure à l'absence de geste dans trois situations
sur quatre.

### F. Une heuristique d'interface non sourcée devient une justification clinique

**12.12 —** En cochant « Fragilité » chez le patient de 80 ans (12.7), le champ « Espérance de vie »
bascule automatiquement de « Longue » à « **Limitée** » — c'est la suggestion automatique de T-009
(`lib/esperanceVieDefault.ts`), signalée dans le formulaire par la mention « *Suggestion auto (âge,
fragilité, comorbidité grave, antécédent CV) — à valider* » et documentée comme **heuristique
d'interface non sourcée** (CLAUDE.md invariant 6). Mais la recommandation qui en découle affiche :

> *Proposé parce que : Situation d'insulinothérapie = Basal-bolus et Fragilité et **Espérance de vie =
> Limitée***

La valeur suggérée est citée comme un **fait du patient** dans la justification clinique, sans aucune
marque rappelant qu'elle a été déduite et non déclarée. Le garde-fou posé côté formulaire ne suit pas
la donnée jusqu'à la sortie.

### Synthèse — ce que ces anomalies ont en commun

Trois causes racines, dont deux sont **génériques** (elles ne concernent pas que le nœud `insuline`) :

1. **Le moteur ne distingue pas « non renseigné » de « zéro ».** Un champ `nombre` vide vaut 0 et
   entre tel quel dans les comparaisons. Selon le sens de l'inégalité, cela produit une affirmation
   rassurante (`HbA1c <= cible`) ou alarmante (`DFG < 45`), et dans un cas une division par zéro
   (`over_basalisation`). C'est un **défaut de grammaire**, au sens de `GRAMMAIRE-NOEUD.md` : il
   appellerait une règle générale (valeur manquante ⇒ la condition ne peut être ni vraie ni fausse,
   et l'option/alerte qui en dépend ne se prononce pas), pas un correctif nœud par nœud. Le nœud
   `prescription` a le même mécanisme et n'en est probablement pas indemne.
2. **Alertes et options sont calculées indépendamment, sans arbitrage.** Une alerte peut interdire ce
   qu'une option recommande (12.8) ou proposer un geste quand l'option conclut qu'il n'y a rien à
   faire (12.9). C'est le prolongement du défaut déjà traité en R2 pour les alertes « portées par une
   option » : le mécanisme existe désormais (commit `8582676`), mais `over_basalisation` est restée
   une alerte de nœud alors qu'elle porte sur un geste précis.
3. **Un même concept clinique est encodé deux fois, différemment.** `terrain_fragile` d'un côté, le
   triplet brut de l'autre — pour dire « ce patient est à risque d'hypoglycémie ». Cette divergence
   est exactement ce que la carte de cohérence P2 cherchait entre nœuds ; ici elle est **à
   l'intérieur** d'un seul nœud, et n'a donc été détectée par aucun contrôle existant.

Les points 1 et 3 méritent d'être portés au banc (`engine/banc/`) sous forme d'invariants, plutôt que
corrigés au cas par cas : « aucune option ni alerte ne se prononce sur un critère numérique non
renseigné » et « deux règles qui nomment le même concept clinique utilisent la même expression ».

---

## Capture 13 — exploration systématique du nœud `statine` (2026-07-26)

Même méthode que la capture 12 : situations variées dans l'app, chaque constat recoupé avec
`content/noeuds/diabete-type-2/statine.yaml`. **Huit anomalies.** Rappel de structure : le nœud est
en `ordered-first-match` (`:39`) — la première option satisfaite l'emporte et constitue la sortie
**unique** ; 6 critères (`age`, `ASCVD_etablie`, `anciennete_diabete_annees`, `autres_FDRCV`,
`diabete_complique`, `dialyse`), 3 options, 3 alertes.

### A. Le formulaire vierge produit une recommandation définitive fondée sur des champs vides

**13.1 —** À l'ouverture du nœud, **aucun champ renseigné**, l'outil affiche une recommandation
unique :

> **Discuter la statine (décision partagée) — diabète non compliqué à faible risque absolu** ·
> Recommandée · Preuve faible
> *Proposé parce que : **Ancienneté du diabète (ans) < 10** et **Autres facteurs de risque
> cardiovasculaire = 0** et **Diabète compliqué : non***

Les trois faits énoncés en justification proviennent de **trois champs non renseignés** — dont deux
que le formulaire, six lignes plus haut, marque lui-même « **à confirmer** » et rappelle dans
« À renseigner dans cette section : Âge, Ancienneté du diabète, Autres facteurs de risque
cardiovasculaire ». Le nœud affirme donc en clair, sous forme de justification clinique, ce qu'il
déclare par ailleurs ne pas savoir.

C'est plus grave que l'équivalent du nœud `insuline` (12.1) pour deux raisons : le mode
`ordered-first-match` fait de cette carte la **seule** sortie affichée (pas d'autre option en regard),
et les valeurs par défaut convergent toutes vers **le même tier** — celui de moindre intervention.

**13.2 — Le vide penche systématiquement du même côté.** Les trois conditions de l'option « décision
partagée » (`:77-79`) sont `anciennete < 10`, `autres_FDRCV == 0`, `diabete_complique == false`. Or
un `nombre` vide vaut 0 et un `bool` non coché vaut `false` : **les trois valeurs par défaut
satisfont les trois conditions**. Le profil « diabète récent, sans facteur de risque, non compliqué »
est donc l'état par défaut du formulaire. Les trois critères qui feraient basculer vers « traiter »
(ancienneté ≥ 10 ans, ≥ 1 FDR, complication) sont précisément ceux qui exigent une saisie active.

**13.3 — Vider un champ vaut confirmation.** Après avoir saisi puis effacé « Ancienneté » et
« Autres FDRCV », les deux champs affichent « **0** », **perdent leur mention « à confirmer »**, et le
bandeau tombe de « 3 critères décisifs non confirmés » à « **1** ». La recommandation bascule au
passage de « Statine (prévention primaire) » à « Discuter la statine ». Effacer un champ est donc un
moyen silencieux de faire enregistrer une valeur fausse comme **confirmée** — c'est le même mécanisme
qu'en 12.2, mais ici il change directement le tier de la recommandation.

**13.4 — Aucun garde-fou de domaine sur le compteur de facteurs de risque.** Le champ « Autres
facteurs de risque cardiovasculaire » accepte **−1** (pas d'attribut `min`/`max` sur l'input) ; la
condition `autres_FDRCV == 0` devient fausse et la sortie bascule de « Discuter » à « Statine
(prévention primaire, intensité modérée) ». Un nombre négatif de facteurs de risque, cliniquement
absurde, est accepté sans signalement et change la recommandation.

### B. L'alerte dialyse interdit ce que la recommandation prescrit — dans les deux tiers

**13.5 — Prévention primaire.** Patient **en dialyse**, 65 ans, diabète 12 ans, 2 FDR, pas d'ASCVD :

> **Alerte** — « Patient en dialyse : **ne pas INITIER une statine** — bénéfice non démontré sur les
> critères durs chez le dialysé (4D : critère principal RR 0,92 NS…) »

> **Recommandation (unique)** — « **Statine (prévention primaire, intensité modérée — haute si risque
> très élevé)** » · *Proposé parce que : Option par défaut : retenue en l'absence de toute autre
> option plus spécifique applicable.*

**13.6 — Prévention secondaire.** Même patient avec ASCVD établie cochée :

> **Alerte** — identique, « ne pas INITIER une statine »
> **Recommandation (unique)** — « **Statine de haute intensité — prévention secondaire** » ·
> **Délai du bénéfice : 5-6 ans**

Cause : `dialyse` n'apparaît dans **aucune** `condition` ni `exclusion` d'option — uniquement dans
l'alerte (`:118`). Le mécanisme d'`exclusions` (R4) existe pourtant dans la grammaire et affiche les
options écartées avec leur motif ; il n'est pas utilisé ici. La mention figure bien dans les
`contre_indications` de chaque option (« Ne pas INITIER de statine chez un patient déjà en dialyse »),
mais enfouie sous un titre qui, lui, prescrit.

C'est exactement le défaut relevé en 12.8 sur le nœud `insuline` (alerte de sur-basalisation vs
« Titrer la basale ») : **alertes et options sont évaluées sans arbitrage entre elles**.

**13.7 — La nuance de l'alerte est structurellement inapplicable.** L'alerte dialyse se termine par :
« **Si une statine est déjà en place, sa poursuite est raisonnable.** » Or le nœud n'a **aucun
critère** disant si le patient prend déjà une statine — il ne peut donc jamais distinguer les deux
situations que sa propre alerte oppose. Même famille de défaut que la capture 4 (« Envisager
l'insuline » chez un patient déjà sous insuline) et la 12.10 (« Initier une basale » chez un patient
déjà sous basale) : **le nœud ne modélise que l'initiation**, jamais l'existant.

### C. L'âge ne pilote aucune décision

**13.8 —** À profil identique (diabète 12 ans, 2 FDR, pas d'ASCVD, pas de complication, pas de
dialyse), testé à **30 ans** puis à **90 ans** : **même recommandation, même badge, même chiffre** —
« Statine (prévention primaire, intensité modérée) » · Recommandée · Délai du bénéfice 3-5 ans. La
seule différence est l'apparition, à 90 ans, de l'alerte « Prévention primaire après 75 ans : preuve
plus faible… individualiser selon l'espérance de vie ».

Vérification dans le YAML : `age` (`:42`) n'apparaît dans **aucune** condition d'option ; il ne sert
qu'à l'alerte `age > 75 AND ASCVD_etablie == false` (`:111`). Deux conséquences :

- **Borne basse absente** — l'en-tête du nœud pose pourtant que « la population PROUVÉE est celle des
  ECR (**CARDS = 40-75 ans** + ≥ 1 FDR) » (`:17`). Un DT2 de 30 ans avec 2 facteurs de risque reçoit
  « Recommandée » sans aucune réserve d'extrapolation, alors que le nœud sait, et écrit ailleurs, que
  cette population n'a pas été étudiée.
- **Le délai du bénéfice n'est jamais mis en regard de l'espérance de vie** — « 3-5 ans » s'affiche
  tel quel à 90 ans, « 5-6 ans » chez le dialysé de 65 ans (13.6). Le nœud n'a pas de critère
  d'espérance de vie, contrairement aux nœuds A (`esperance_vie`) et E (`terrain_fragile`). L'alerte
  > 75 ans le dit en prose, mais rien ne relie ce texte au chiffre affiché juste au-dessus, et la
  question ne se pose jamais en dessous de 75 ans ni chez le dialysé.

**Point correct à signaler** (vérifié) : chez un patient de 90 ans **avec ASCVD établie**, l'alerte
> 75 ans ne se déclenche pas — c'est délibéré et conforme à son propre texte (« En prévention
secondaire, le bénéfice de la statine persiste à tout âge »). Le gate `ASCVD_etablie == false` fait
ici exactement ce qu'il doit.

### D. Ce que le nœud ne peut pas représenter

Absents des `criteres_entree`, donc hors d'atteinte de toute règle : **statine déjà en cours**
(cf. 13.7), **intolérance / effets indésirables sous statine** (myalgies — pourtant le motif d'arrêt
le plus fréquent en pratique, et le nœud cite la myopathie dans ses inconvénients), **espérance de
vie** (cf. 13.8). Le périmètre déclaré (`population_cible`, `:34-38`) exclut explicitement
l'hypercholestérolémie familiale et l'intensification par ézétimibe/anti-PCSK9, mais **ne dit rien**
de l'intolérance ni du patient déjà traité — ces deux cas ne sont donc ni couverts, ni annoncés comme
hors périmètre.

### Synthèse — comparaison avec le nœud `insuline`

Les trois causes racines identifiées en capture 12 se retrouvent **à l'identique**, ce qui confirme
leur caractère générique :

| Cause racine | `insuline` | `statine` |
|---|---|---|
| « non renseigné » lu comme 0 | 12.1-12.5 | **13.1-13.4** — aggravé : sortie unique, et les valeurs par défaut convergent toutes vers le même tier |
| alerte vs option sans arbitrage | 12.8, 12.9 | **13.5, 13.6** — l'alerte dit « ne pas initier », la carte prescrit |
| le nœud ne modélise que l'initiation | 12.10 | **13.7** — la nuance « si déjà en place » est inapplicable |

Deux constats propres au nœud `statine`, qui n'ont pas d'équivalent dans `insuline` :

- **Le mode `ordered-first-match` amplifie le défaut n° 1.** En `multi-options`, une valeur par défaut
  erronée ajoute ou retire une carte parmi d'autres ; ici elle **désigne un tier unique** et masque
  tout le reste. Le mode de sélection devrait être considéré comme un facteur aggravant lors de la
  correction du traitement des valeurs manquantes.
- **Un critère collecté mais inerte** (`age`) donne l'illusion d'une décision individualisée sur
  l'âge, alors qu'il ne fait qu'allumer une alerte au-delà de 75 ans. L'estompage (« sans effet sur la
  reco actuelle ») ne le signale pas, puisque l'âge **a** un effet — sur une alerte.

Les deux invariants de banc proposés en fin de capture 12 couvriraient 13.1-13.4 et 13.5-13.6. Il
faudrait y ajouter un troisième contrôle, de nature différente : **tout critère cité comme réserve
dans la prose d'un nœud (ici « CARDS 40-75 ans », « si une statine est déjà en place ») doit soit être
un critère d'entrée, soit être déclaré hors périmètre** — c'est le cas de figure qui a produit 13.7 et
la borne basse manquante de 13.8.

## Métadonnées techniques de la capture

- URL : https://ebm-msp.vercel.app/
- Bundle chargé (via l'onglet) : `/assets/index-BS2gtCMM.js`
- Version du nœud embarquée observée dans le bundle : `statut: brouillon, version: 0.15` (cohérent
  avec `content/noeuds/diabete-type-2/prescription.yaml` v0.15 en local au moment de la capture)
