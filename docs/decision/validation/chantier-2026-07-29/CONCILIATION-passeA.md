# Passe A — conciliation A × OpenEvidence × red-team B

> Rédigé le 2026-07-29, après retour des **5 agents A** (A1→A5), du **retour OpenEvidence** fourni par le
> référent, et des **3 red-teams** (B1 attributions · B2 chiffres et identifiants · B3 corpus français).
>
> **Ce document ne remplace aucun des neuf rapports** ; il dit ce qui, de tout cela, **tient**. Il est la
> base de la consignation demandée par le référent le 2026-07-29 : *« toute nouvelle donnée utilisée devra
> être consignée dans la base de données consolidée et ajoutée dans les argumentaires spécifiques et dans
> l'argumentaire exhaustif ».* Cette consignation n'est **pas encore faite** — elle attend les arbitrages
> du §5.
>
> **Rien de ce document n'est entré dans `content/**`.** Les seules modifications de contenu de la journée
> sont les quatre arbitrages référent encodés en `insuline.yaml` v0.27, antérieurs à la collecte.

---

## 1. Ce qui est ÉTABLI (vérifié en source primaire)

### 1.1 Les deux seuils du nœud sont de la doctrine HAS — et ils ont une source de 2025

`0,70-1,20 g/L` avant les repas et `< 1,80 g/L` en post-prandial à 2 h figurent :

- **fiche HAS « BUTS » d'avril 2011** (FBUTSGLYCEM2, CNEDiMTS), en mg/dL — téléchargée et lue par B1 et B3 ;
- ★ **guide HAS *Parcours de soins du patient adulte vivant avec un DT2*, 26 juin 2025, §5.2 pp. 38-40**,
  **en g/L, dans l'unité exacte du nœud** — trouvé par B3, **absent du corpus, cité par aucune collecte** ;
- **ADA Standards Table 6.3** (« Peak postprandial capillary plasma glucose < 180 mg/dL ») ;
- `sources/Traitement global… ebmfrance.pdf`, déjà dans le corpus.

**Aucune de ces sources n'imprime de grade ni ne cite d'essai.** Force forte, **certitude très faible**.

⚠ **Réserve trouvée par B1, qu'aucune collecte n'avait vue** : HAS écrit « **avant les repas** ». Le nœud
applique ces bornes à la **glycémie à jeun**. Voir §5-B.

### 1.2 La règle de descente est écrite, symétrique, et française

- **HAS 2024 R.87**, p. 25, **grade AE** : « adaptation des doses tous les 3 jours […] augmentée **ou
  réduite** de 1 ou 2 UI ». Le nœud n'avait encodé que la montée.
- **SFD 2025 Avis 18** : ± 2 U, ou ± 10 % au-delà de 40 U/j ; cible 0,80-1,30 g/L.
- **ebmfrance** : règle graduée — mais B3 corrige la présentation d'A2/A5, elle est **en deux morceaux**
  (le −4 U dépend de l'hypoglycémie **symptomatique**, pas d'une GAJ basse) et la fiche imprime **deux
  bornes basses différentes** (4,0 et 5,0 mmol/L).
- **Aucun essai n'a jamais randomisé une règle de descente** → accord d'experts, GRADE très faible.

### 1.3 Cibler la post-prandiale n'améliore aucun critère dur

- **HEART2D** : nul, arrêté pour futilité. ⚠ Nuance vérifiée par B2 : la **séparation glycémique visée n'a
  pas été obtenue** (0,8 au lieu de 2,5 mmol/L) — établi par deux commentaires ouverts, **pas** par les
  Méthodes. Donc « **pas démontré** », jamais « réfuté ».
- **ACE** et **NAVIGATOR** concordants, nuls. (PMID à reprendre : ceux d'OE sont faux, cf. §2.4.)
- **IDF**, verbatim : *« lack of direct randomised clinical trial evidence that correcting postmeal
  hyperglycaemia improves clinical outcomes [Level 1-] »*.

### 1.4 Les essais titrent le bolus sur le PRÉ-prandial du repas suivant

- **FullSTEP** : cible de titration **pré-prandiale 4,0-7,2 mmol/L, ± 1 U** (B1, vérifié).
- **STEP-Wise** a randomisé la question — titrer sur la post-prandiale vs sur le plus gros repas et le
  pré-prandial. **Design randomisé et −1,2 % verbatim** ; le « 31 % vs 27 %, p = 0,74 » d'A1 est
  **invérifiable** (absent de l'abstract, pas de PMC, 403). B2 propose de porter la conclusion par l'ETD
  publié : **−0,06 % [−0,29 ; +0,17]** — plus solide que le chiffre invérifiable.
- **4T** vise 1,26 g/L à 2 h — **`[À VÉRIFIER]`**, texte intégral en 403.
- **A4** : tout ce qui *décide* dans la littérature est **ancré sur les repas**, jamais sur l'horloge.

### 1.5 L'autosurveillance manque la nuit, et sa propre valeur n'est pas démontrée

- **Munshi** : 95/102 = **93 %** des épisodes non détectés, avec 4 mesures/jour (verbatim, vérifié).
- **Zick** : 209/97 vérifié ; le « 46 % » est un **calcul d'agent non signalé**.
- ★ **Nauck 2014 (PMID 24445534, n = 300)** — trouvé par B2 : l'ECR d'ASG chez l'insulino-traité **existe**,
  et il est **négatif** (différence 0,0 % [−0,2 ; +0,2]). **OE l'avait nommé ; aucun des cinq agents A ne
  l'a repris.** C'est le fait le plus inconfortable de la passe, cf. §5-F.

### 1.6 Le créneau horaire est un raisonnement, pas une donnée

- Aucun essai n'a randomisé l'attribution « heure → composant ». **Bergenstal 2008** l'*instrumente dans
  ses deux bras*, donc la présuppose.
- **Le découpage en quatre périodes fixes n'existe nulle part.** Les découpages attestés sont binaires
  (jour/nuit) et servent à **décrire**, jamais à décider.
- **Bolli 2019** : pic d'hypoglycémies **06:00-08:00**, juste après la fenêtre nocturne standard (vérifié).
  ⚠ Le « doublement » des événements par extension de fenêtre **n'est pas publié**.
- Fenêtres nocturnes divergentes et vérifiées : 00:00-06:00 (HAT) · 00:00-05:59 (DEVOTE, SWITCH 2,
  CONCLUDE, EDITION) · 22:00-06:00 (Munshi) · aucune heure chez Battelino ni ADA.

### 1.7 Le sujet âgé : la preuve porte sur la CIBLE, pas sur la vitesse

- **SENIOR** (seul ECR ≥ 65 ans) : cible relevée 90-130 mg/dL ; sous-groupe ≥ 75 ans RR **0,45
  [0,25-0,83]** (vérifié). Mais il **n'a pas testé** un pas ni un intervalle différents.
- Aucun essai, aucun sous-groupe pré-spécifié ne module le pas ou le rythme par l'âge.
- → **« Titrer plus lentement chez l'âgé » n'aurait aucune source. « Relever la cible » en a plusieurs** :
  ADA 2026 Table 13.2 (grade C), SFD Avis 21, HAS R.103.

### 1.8 Le parcours sans capteur est souvent réversible

**SFD 2025 Avis 23**, vérifié : la MCG est remboursée et **primo-prescriptible par le médecin généraliste**
chez un DT2 sous 1-2 injections mal équilibré. Le plafond de 200 bandelettes/an **exclut** les
insulino-traités (3 sources concordantes). L'obstacle à densifier la surveillance est clinique, pas
économique — et le nœud ne dit nulle part que la branche « sans capteur » peut se refermer en consultation.

---

## 2. Ce qui est RÉFUTÉ

### 2.1 Sur-accusations de collecte (le motif du §P4, cinquième occurrence)

| Affirmation | Auteur | Verdict |
|---|---|---|
| « 0,70-1,20 g/L ne figure dans aucune source » | A2 | **RÉFUTÉE** — recherche négative sur un périmètre incomplet (la fiche HAS 2011 n'est pas dans `sources/`) |
| « HAS 2024 maintient la fiche 2011 par renvoi explicite » | A3, A5 | **RÉFUTÉE** — l'exclusion de périmètre est verbatim (p. 5), le renvoi est **générique** ; la fiche 2011 n'est nommée nulle part. Inférence d'agent |
| « Le pas de titration est mot pour mot la SFD » | A2 | **PARTIELLE** — « 3 matins de suite » vient d'**ebmfrance** (verbatim) |
| « Aucun ECR n'a comparé ASG vs pas d'ASG chez l'insuliné » | A3 | **RÉFUTÉE** — **Nauck 2014**, n = 300, et il est négatif |
| « BEGIN Once montre qu'une seule mesure suffit » | A3 | **RÉFUTÉE** — confondu avec une simplification du pas (+4 U forfaitaires vs gradué) ; les 0,61 vs 0,50 U/kg ne s'imputent pas à la densité |
| « SFD 2017 §8.6.3 porte une table complète et se contredit » | A4 | **RÉFUTÉE** — prose sans table, **réserve assumée** et non contradiction, instruction « avancer **ou** réduire », contexte DT1/pompe. *La conclusion d'A4 tient, par un chemin plus propre* |
| « Le PDF SFD non extractible explique le faux négatif de 2026-07-27 » | A2 | **RÉFUTÉE** — trois outils l'extraient. Cf. §2.3 |

### 2.2 Erreurs du dépôt, corrigées

- ★ **`chantier-2026-07-27/preuve-sur-basalisation.md` : « aucune source SFD ne porte le seuil de
  0,5 U/kg/j » est FAUX.** Il est **verbatim, SFD 2025 Avis n° 19** (B1 et B3, indépendamment).
  **L'arbitrage ne se rouvre pas** — il portait sur le canal (déclencheur, pas exclusion), et il tient ;
  c'est le **texte affiché** par le nœud qui doit cesser d'omettre la société savante française.
- **`sources/NICE 2023.pdf` est NG238 (lipides / risque CV), pas NG28 (diabète)** — 52 occurrences de
  « NG238 », zéro de « insulin ». Confirmé par métadonnées.
- **`00-global.md` ne recense que 7 pièces sur 15** présentes dans `sources/` ; une pièce a **0 caractère
  extractible**.

### 2.3 La cause réelle de l'échec du 2026-07-27 — et c'est un défaut de procédé

Le red-team d'alors avait travaillé sur un **téléchargement web illisible** ; **le corpus local n'a jamais
été ouvert**, contre l'instruction explicite de `00-global.md` (« *avant de chercher une source sur le web,
vérifier ce dossier* »). B1 relève l'aggravant : **le même chantier avait déjà renversé un verdict « PDF
non extractible »** quelques jours plus tôt (`redteam-seuils-renaux.md` §7.2).

> **Règle à ajouter au procédé** : un verdict d'absence (« aucune source ne porte X ») n'est recevable que
> si le **corpus local a été ouvert** et si **au moins deux méthodes d'extraction** ont été essayées. Une
> recherche négative est une affirmation, et elle se source comme les autres.

### 2.4 OpenEvidence — le motif est net, et il est exploitable

**Six des sept PMID rendus par OE sont faux** : ACE `28711407` = neuro-imagerie · NAVIGATOR `20228404` =
ACCORD Lipid · 4T `17881754` = gynécomastie et `19861578` = histiocytose · STOP-NIDDM `12876093` =
portefeuille diététique · « Lankisch 1-2-3 » `19211396` = non-adhésion à l'insuline.

**Mais ses DOI sont justes (3/3) et ses chaînes de citation aussi (6/7).**

> **Règle à ajouter aux prompts OE** : ne jamais recopier un **PMID** d'OpenEvidence. Reprendre le **DOI**
> ou la **citation complète**, et retrouver le PMID soi-même. *(À reporter dans
> [`PROMPTS-OE-passeA.md`](PROMPTS-OE-passeA.md) et dans `00-global.md`.)*

Autre erreur d'OE tranchée par B2 : **Umpierrez 2019 = N 458 / 3 essais**, et non « n = 3 014 / 12 RCT ».
Le sens compte — le nombre d'OE rendait ce post-hoc bien plus solide qu'il n'est.

**Zéro identifiant faux chez les cinq agents A**, et trois auto-détectés par eux.

---

## 3. Ce qui reste NON VÉRIFIABLE

| Élément | Motif | Conséquence |
|---|---|---|
| Seuil post-prandial de protocole de **4T (1,26 g/L)** | 403 NEJM | reste `[À VÉRIFIER]` — ne pas l'encoder |
| **STEP-Wise** « 31 % vs 27 %, p = 0,74 » | absent de l'abstract, pas de PMC, 403 | remplacer par l'**ETD −0,06 % [−0,29 ; +0,17]** |
| Cadence hebdomadaire de **Riddle 2003** | 403 diabetesjournals | n'affecte aucun verdict |
| Textes intégraux **FullSTEP**, **Bertuol** | paywall | les données d'abstract suffisent |
| **Bolli 2025** (position ADA, ≤ 2 U/semaine, cible 100-120 mg/dL) | jamais ouvert | **bloquant si on veut encoder la prudence du sujet âgé** |
| **Boonpattharatthiti 2025** (NMA des stratégies de titration) | non ouvert | bloquant pour toute revendication comparative |
| « Doublement » des événements par extension de fenêtre (**Bolli 2019**) | non publié | ne pas l'écrire |
| « 46 % » de **Zick** | calcul d'agent | recalculer ou retirer |

---

## 4. Défauts ÉTABLIS du contenu publié — à corriger après arbitrage

| # | Où | Défaut | Nature |
|---|---|---|---|
| **D1** | `insuline.yaml`, `effet_attendu` de « Ajouter un bolus… » | « ajuster **sur** la glycémie post-prandiale (< 1,80 g/L à 2 h) » adossé à `fullstep`/`bertuol`/`quatre-t` — **aucune ne porte ce nombre**, et FullSTEP a fait **l'inverse** (titration pré-prandiale) | mésattribution **+** verbe plus fort que la preuve |
| **D2** | même endroit, et « Titrer la basale » | « **+10-20 %** » : la borne haute **n'a aucune source** (SFD dit 10 %, ADA 10-15 %) | chiffre orphelin |
| **D3** | « Titrer la basale », `references` | l'algorithme affiché est attribué à **Treat-to-Target** ; Riddle 2003 est **+2/+4/+6/+8 U par bande, hebdomadaire, cible ≤ 1,00 g/L**. Seul le « ~60 % » est de Riddle | mésattribution |
| **D4** | `incertitudes`, sur-basalisation | « aucune source SFD ne porte ce seuil » — **faux** (Avis 19) | fait faux |
| **D5** | commentaires ajoutés le 2026-07-29 (moi) | attribution des bornes 0,70-1,20 à Treat-to-Target — **déjà marquée contestée**, à trancher maintenant | mésattribution |
| **D6** | `gaj_basse` | `GAJ < 0,70` est **exactement** le seuil international d'hypoglycémie (Battelino / SFD Tableau II) : la cible commence là où l'hypoglycémie finit | modélisation — cf. §5-C |
| **D7** | `GAJ`, libellé et dérivés | le nœud applique à la **glycémie à jeun** une cible que HAS définit « **avant les repas** » | sémantique — cf. §5-B |

---

## 5. Ce qui revient au référent

**A — `hypo_severe_recurrente`** *(en attente depuis le 2026-07-29)*. Proposition : l'antécédent **oriente,
il ne retire ni ne commande** — retirer des `exclusions` d'escalade, déplacer vers une **alerte**, garder
dans `risque_hypoglycemique_eleve`. ⚠ Tension avec l'arbitrage du 2026-07-27 à lever.

**B — Le pivot de conception, et c'est la décision la plus structurante.** Si la cible 0,70-1,20 g/L est
« avant les repas » et non « à jeun », alors **le même champ posé avant le déjeuner et avant le dîner donne
le critère du bolus** — sans créer de champ post-prandial. Convergent avec FullSTEP (pré-prandial suivant),
STEP-Wise (pas de différence entre les deux stratégies) et A4 (ancrage sur les repas). Répond à E3, V-A4 et
une partie de V-A9 d'un seul geste.

**C — La borne basse.** `gaj_basse < 0,70` coïncide avec le seuil d'hypoglycémie. Garder 0,70-1,20 (HAS,
et c'est ce qu'affiche le nœud), ou basculer sur **0,80-1,30** (SFD 2025 **et** ADA 2026, qui laisse une
marge entre la cible et l'hypoglycémie) ?

**D — Une seule valeur, ou plusieurs ?** Aucune preuve ne départage : FPG GOAL / Riddle agissent sur une
mesure, ebmfrance demande « plus d'une fois sur trois ». Aujourd'hui `gaj_basse` agit sur **une seule**.

**E — Le déclencheur de sur-traitement de HAS 2025** (§8.1 p. 66) : *« la baisse de l'HbA1c survenant en
l'absence d'intensification évoque un surtraitement »*. Concept **différent** de l'écart à la cible : il
porte sur une **trajectoire**, donc suppose de connaître l'HbA1c précédente — un critère de plus.

**F — Que dit le nœud de son propre instrument ?** Nauck 2014 est négatif, Prescrire est muet, et les deux
sources chiffrantes sont institutionnelles avec des conflits d'intérêts dispositifs côté SFD. Le nœud
doit-il énoncer que l'autosurveillance n'a pas fait la preuve de son bénéfice propre chez l'insulino-traité ?

**G — La réversibilité** (SFD Avis 23) : le nœud doit-il proposer d'**instaurer une MCG** plutôt que de
raisonner à l'aveugle ?

**H — Corpus** : verser **fiche HAS BUTS 2011**, **guide HAS 2025 Parcours de soins**, **ADA Standards
ch. 6 (Table 6.3)**. Renommer `NICE 2023.pdf` en NG238.

> ⚠ **Correction, 2026-07-29** : la première rédaction de ce paragraphe demandait de « re-fournir
> `prescrire 12.pdf` (vide, 4ᵉ signalement) ». **C'était une erreur de ma part.** Ce fichier **n'a jamais
> existé dans le dépôt** — `sources/` ne contient que `prescrire-dt2.md` — et `TASKS.md` comme `STATUS.md`
> portent déjà, noir sur blanc, « *n'existe pas — référence retirée* ». J'ai relayé la demande des cinq
> agents A sans vérifier le backlog, qui l'avait close. Décision référent du 2026-07-29 : **la demande est
> supprimée, définitivement.** Les rapports d'agents de ce chantier la mentionnent encore : ce sont des
> archives, elles ne se réécrivent pas — c'est ce paragraphe qui fait foi.

---

## 6. Consignation — ✅ FAITE le 2026-07-29 (`insuline.yaml` v0.30)

Consigne du référent, 2026-07-29. Les huit arbitrages du §5 ont été tranchés puis encodés (lots 1 à 3,
v0.27 → v0.29) ; la consignation ci-dessous constitue le **lot 4**, qui ne change **aucun comportement du
moteur** (aucune `conditions`, `exclusions` ni `derive` touchée).

| Destination | Contenu | État |
|---|---|---|
| `docs/decision/noeuds/E-insuline.md` §3 | grille par étude des essais **retenus** : PMID/DOI **vérifiés B2**, design, population, effet absolu + NNT + horizon, **dur vs substitution**, GRADE | ✅ **SOUS-DOSSIER E6** ajouté (8 blocs a→h) |
| `insuline.yaml` → `sources.references_primaires` | un `id` par essai réellement cité ; **corriger D1/D3** | ✅ **12 références ajoutées** ; D3 corrigé (l'algorithme n'est pas celui de Riddle — seul le « ~60 % » l'est) ; D1 l'avait été au lot 3 |
| `insuline.yaml` → `options[].references` | lien option → sources (**invariant I8**) | ✅ 4 options recollées, dont « Ajouter un bolus » qui nommait STEP-Wise et HAS 2025 sans les déclarer |
| `insuline.yaml` → `avantages`/`inconvenients`/`effet_attendu` | argumentaires spécifiques ; **corriger D2** (borne orpheline) et le verbe de D1 | ✅ D2 corrigé **en 4 endroits**, dont un `calculs` qui **affichait** une dose à −20 % : le chiffre sans source était arrivé à l'écran |
| `insuline.yaml` → `incertitudes` | **corriger D4** ; classer par nature ; purger le périmé | ✅ D4 corrigé (le seuil de 0,5 U/kg **est** verbatim SFD Avis 19) + **2 entrées ajoutées** (post-prandial sans critère dur ; créneaux horaires sans socle) |
| `insuline.argumentaire.md` | argumentaire exhaustif : matrices par option, argumentation négative, reco officielle **vs** position critique (⚠ Prescrire est **muet** ici — à écrire), incertitudes, toutes sources avec DOI | ✅ **§ 5 bis** neuf (la branche capillaire) ; §1/§6/§8/§9 corrigés ; le **silence de Prescrire** écrit comme un trou du corpus critique, pas comme une divergence ; **5 mentions périmées** par les lots 1-3 rattrapées (TBR sévère, pivot `gaj_a_cible`) |
| `00-global.md` | les **deux règles de procédé** du §2.3 et §2.4 ; compléter le tableau du corpus (7/15) | ✅ 2 règles versées ; tableau porté de **10 à 18 pièces** — deux des manquantes (SFD Paramédical 2022, SFD MCG 2017) étaient déjà **utilisées** par le nœud E |

**Validation technique du lot 4** : `tsc` 0 erreur · `npm run build` 0 erreur · **839 tests passés, 2 échecs**
— les deux préexistants du nœud `prescription` (#1576, I2′/I23), inchangés depuis le début du chantier.
Le golden master a bougé de **54 lignes, toutes attribuées à la seule substitution −20 % → −10 %** dans la
dose calculée (vérifié en régénérant le snapshot avec la valeur inversée : **0 ligne non attribuée**).

**Deux invariants ont rattrapé des défauts pendant ce lot**, et les deux avaient raison : **I12** (le glyphe
⚠ est réservé au registre de sécurité des cartes — mes textes l'employaient comme ponctuation éditoriale)
et **I8** (une option nommait des preuves absentes de la bibliographie du nœud).

**Reste ouvert** : ~~validation clinique finale du référent → `meta.statut: valide`~~ — **FAIT le 2026-07-29**,
`insuline.yaml` v0.31. Le nœud E (Insuline) est clos.
