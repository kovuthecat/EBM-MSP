# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session.

> **Dernière mise à jour :** 2026-07-25 (P3 · recette référent → grammaire de modélisation R1→R6, D19 ; 8 commits locaux **non poussés**)

## P3 · Recette référent → grammaire de modélisation — EN COURS (2026-07-25)

La recette du nœud `prescription` a produit une série de corrections qui ne convergeait pas. Le
diagnostic, obtenu en rejouant le profil de recette sur le moteur réel, est que les défauts n'étaient
pas des bugs d'affichage mais **des défauts de modélisation du raisonnement clinique** — donc
reproductibles dans tout nœud et tout domaine à venir. D'où six règles génériques hissées hors de DT2
dans `docs/decision/GRAMMAIRE-NOEUD.md` (**D19**).

**Livré et commité localement** (chaque étape typecheck + tests + build verts) :

- **R1** — `position_vs_cible` déclaré remplace `cible_atteinte` déduit de l'intention ; disparition du
  seuil absolu `HbA1c >= 8,5 %`, aveugle à l'objectif du patient.
- **R3** — le switch d'un agent sans bénéfice dur se déclenche sur sa seule présence ; nouveau dérivé
  `remplacement_agent_sans_benefice` (sulfamide seulement à ce stade, cf. dette ci-dessous).
- **R2, 1re moitié** — champ `delai_benefice`, 3 valeurs extraites d'`effet_attendu` déjà sourcés.
- **R6, mise en forme** — plus de jeton du DSL affiché au clinicien (`ne_contient_pas` était rendu brut).
- **Banc** — couches couverture et invariants (`engine/banc/`), 800 à 2000 profils par nœud, générateur
  déterministe. ~23 s, dominé par R5.
- **Docs** — `BRIEF_DECISION.md` et `00-global.md` renvoient à la grammaire ; la liste des « variables
  communes » du §6 est supprimée, quatre des variables listées n'existant dans aucun nœud.

- **Unification écran ↔ signature** sur un modèle de vue unique : tout ce qui est affiché entre dans la
  signature par construction. A révélé au passage un 5ᵉ écart jamais constaté — les doses calculées
  étaient rendues mais absentes de la signature.
- **R4** — les options écartées s'affichent avec leur motif ; les non-indiquées sur demande.
- **Six arbitrages référent** (2026-07-25) : retrait de TIR/TAR/GMI/IMC du nœud `insuline`, câblage de
  `dose_rapide_actuelle`, option de repli contre la sortie muette, suppression de l'alerte M2/A9 devenue
  fausse, reciblage de l'alerte de cohérence sur `position_vs_cible`, garde de sur-traitement sur la
  place résiduelle.

**Le banc est passé de 4 dettes à 1.** Ne reste que l'invariant 5 — la dette gliptine, qui se résorbera
à la levée de `ne_contient_pas gliptine` (autorisée par le référent une fois R4 fait, donc débloquée).

L'invariant 7 a dû être resserré **deux fois**, pour le même motif : les garde-fous d'urgence sont
orthogonaux à la position glycémique. Leçon consignée dans la grammaire — quand un invariant échoue, la
première question n'est pas « quel contenu corriger » mais « l'invariant dit-il ce que je voulais dire ».

Effet secondaire : sans critère mort nulle part, R5 sort tôt partout et **la suite tombe de 27 s à 3-6 s**.

**Rien n'est poussé.** Réservé au référent : les deux alertes de cohérence intention↔HbA1c, l'alerte
M2/A9 devenue fausse plus souvent, la prose de l'option gliptine généralisée, les `delai_benefice`
manquants, et le passage en `statut: valide`.

## P2 · Gate humaine — CLOSE, 11/11 divergences arbitrées (2026-07-24)

Décisions du référent sur les 11 divergences de `docs/decision/validation/carte-coherence.md` (détail
§5) :

- **D7 corrigé** : nœud E aligné sur le nœud D (référence documentaire sulfamides) — l'alerte `DFG < 45`
  ne proscrit plus les sulfamides en bloc, reprend la nuance dose réduite (30-44) / CI dure (< 30).
- **D6 corrigé** : `tirzepatide` ajouté à l'énumération `traitements_en_cours` du nœud E (+ exclu de
  l'option d'ajout d'un GLP-1, redondance incrétine). `pioglitazone` retirée des énumérations C/D/H —
  non commercialisée en France (AMM suspendue ANSM 11/07/2011, risque vessie) ; mentions d'essais/
  Prescrire conservées (faits historiques).
- **D1, D2, D8, D9 confirmés sans action** (contextes/design volontaires, arbitrage référent).
- **D3 vérifié sans action** : les 3 seuils d'IMC (30 obésité OMS/HAS ; 27 = borne d'inclusion de
  l'essai DiRECT/DIADEM-1 ; 35 = seuil HAS d'orientation chirurgie bariatrique) sont 3 sources EBM
  distinctes correctement citées, pas une incohérence.
- **D5** : dette de câblage déjà tracée pour P3, hors périmètre contenu clinique.
- Versions bumpées avec changelog (`intensification.yaml` 1.0→1.1 ; `sulfamides-gliptines.yaml`,
  `insuline.yaml`, `rhd.yaml` 0.1→0.2). Build + **139/139 tests verts**. Rien commité (fin de plan P2).
- **Prochaine étape** : go/no-go référent sur l'engagement du budget Opus S3-S7 (red-team données,
  vignettes, red-team contradictoire, vérification, synthèse) — plus aucun blocage de contenu identifié.

## P2 · S1+S2 — Inventaire + carte de cohérence inter-nœuds — GATE HUMAINE EN ATTENTE (2026-07-24)

Plan P2 (`plans/P2/index.md`, validation systémique cohérence inter-nœuds DT2) : **S1 et S2 exécutées**
via l'outil Workflow (orchestration multi-agents), conformément à `docs/decision/VALIDATION_COHERENCE.md`.

- **S1 (T-011, Haiku, fan-out 5 catégories)** : `docs/decision/validation/inventaire.json` — 83 seuils
  numériques, 87 mentions de molécules, 77 critères d'entrée (15 homonymes candidats), garde-fous des
  7 nœuds, 10 couplages inter-nœuds. Les 7 nœuds tous couverts, aucun avertissement.
- **S2 (T-012, Sonnet)** : `docs/decision/validation/carte-coherence.md` — 11 divergences de valeurs
  relevées (8 « clinique · à arbitrer », 3 « triviale ») + 1 cas connu conclu non-divergent (DFG<30
  metformine RCP vs sulfamide KDIGO/SFD).
- **2 divergences BLOQUENT l'engagement du budget Opus (S3-S7)** tant qu'elles ne sont pas arbitrées par
  le référent — ce sont des contradictions actives entre nœuds sur la sécurité médicamenteuse, pas des
  questions d'exactitude EBM, donc S3 (red-team données) ne les détecterait pas :
  - **D6** — l'énumération `traitements_en_cours` du nœud E (insuline) omet `tirzepatide` et
    `pioglitazone` (présents dans C/D/H) → risque de proposer à tort l'ajout d'un GLP-1 chez un patient
    déjà sous tirzépatide.
  - **D7** — contradiction directe : le nœud E affiche « sulfamides à proscrire » dès DFG < 45, alors que
    le nœud D (référence) autorise une poursuite à dose réduite entre 30-44 et ne proscrit qu'en dessous
    de 30.
- 6 autres divergences cliniques (seuils d'âge/ancienneté/IMC multiples, mécanisme `cible_atteinte`
  asymétrique C/E, garde-fou dialyse statine alerte-vs-exclusion, parité DSL/prose glucotoxicité B) sont
  réglables en remédiation, non bloquantes. 3 triviales (documentation/lexique) sans impact clinique.
- **🚦 Gate humaine (`index.md` §Ordonnancement)** : go/no-go sur l'engagement du budget Opus S3-S7,
  conditionné à l'arbitrage référent de D6/D7 au minimum. Rien commité/poussé (consolidation prévue en
  fin de plan, vague 6).

## Nœud F « Statine chez le diabétique » — VALIDÉ + ENCODÉ (2026-07-23)

Pipeline complète (`docs/decision/00-global.md`) déroulée sur le nœud F : cadrage → collecte (4 sous-dossiers
d'agents + OpenEvidence OE-F1→F5) → **red-team des essais ET des recommandations** (chaque DOI/chiffre vérifié
contre source primaire ; discordances OE tranchées) → distillation → **vérification d'encodage bi-agents
(étape 8, 0 finding HAUTE)**. `content/noeuds/diabete-type-2/statine.yaml` **v1.0 `statut: valide`** +
`statine.argumentaire.md` (niveau 3) + dossier de preuve `docs/decision/noeuds/F-statine.md`. Nœud
**ordered-first-match**, 3 tiers **EBM-ancrés** (ASCVD → statine haute intensité ; diabète récent non compliqué
sans FDR → décision partagée ; sinon → statine primaire modérée, **mortalité NON revendiquée**) + 3 alertes
(> 75 ans, dialyse, risque absolu / pas de cible LDL + SCORE2 comme aide). Points saillants : stratification
**« que dit l'EBM »** (pas de seuil SCORE2 — bénéfice proportionnel au risque, CTT) ; reco = **SFE/SFD/NSFA/SFC
2026** (PMID 41651737) avec **note conflits d'intérêt** ; rosuvastatine haute intensité **10-20** (Table 4
française) ; correction de sourçage (ni HAS 2024 ni SFD 2025 ne traitent la statine). 6 critères
(age / anciennete_diabete_annees / autres_FDRCV / diabete_complique / dialyse / ASCVD_etablie). **122 tests +
build OK.** Restant P3 : câbler le formulaire D3 sur les nouveaux critères.

## Phase actuelle

**Phase 1 — Câblage MVP module Décision : P1 exécuté et consolidé.** S1→S4 exécutées (une session Sonnet
à la fois), 8 commits atomiques tâche par tâche. Squelette logiciel du module Décision fonctionnel :
scaffold, tokens, shell, Accueil/Méthode, JSON Schema + import YAML + validation Ajv, moteur de règles
générique + tests, écrans D2/D3 câblés sur la maquette et le moteur.

**T-009 — Ergonomie du formulaire de critères (D3, 2026-07-23)** : grille de champs fixée en 2 colonnes
(plus de champ isolé/orphelin), cases à cocher regroupées à part visuellement, champs numériques vides
par défaut (plus de `0` trompeur pris pour une vraie saisie) avec message d'invite tant qu'ils ne sont
pas renseignés, libellés `antecedent_cv`/`comorbidite_grave` accentués. Ajout d'une **suggestion auto
non sourcée** (modifiable, désactivée dès choix manuel) d'`esperance_vie` d'après âge/fragilité/
comorbidité grave/antécédent CV (`lib/esperanceVieDefault.ts`) — signalé comme heuristique UI, pas un
fait clinique sourcé (CLAUDE.md invariant 6). Build + **34/34 tests verts**.

**T-010 — Disclaimer, méthode publiée, niveau 3 (2026-07-23)** : ton du disclaimer permanent réécrit
(rassurant, « fondé exclusivement sur l'EBM », praticien = lien avec le patient **et** responsable de
la décision — harmonisé sur bandeau/accueil/pied d'écran nœud). Écran Méthode : ajout d'un second
bloc « Algorithmes d'aide à la décision » (résumé fidèle de `docs/decision/00-global.md`), en regard du
bloc veille existant. **Niveau de lecture 3 (D11) enfin exposé** : `ArgumentPanel` charge l'argumentaire
exhaustif (`argumentaire_exhaustif`, Markdown brut via `loadArgumentaires.ts`) et le rend avec un petit
composant `MiniMarkdown` maison (headers/listes/tableau/gras-italique-code/liens, **zéro dépendance
runtime ajoutée**, CLAUDE.md invariant 8). Deux bugs trouvés et corrigés pendant la validation
visuelle : boucle infinie sur la branche titre (oubli d'incrémenter l'index — figeait l'onglet à
l'ouverture) et puces multi-lignes source mal rattachées (laissait fuir des `**`/`*` littéraux dans le
texte). Régression couverte par `MiniMarkdown.test.tsx`. Build + **37/37 tests verts**.

**T-010bis — Lisibilité du disclaimer + périmètre (2026-07-23)** : le disclaimer (bandeau + accueil)
passe en deux phrases distinctes (première en gras, sur sa propre ligne) avec « le lien avec le
patient » et « le seul responsable » mis en avant — plus scannable qu'un bloc de texte compact.
Le bandeau disclaimer (propre au module Décision) **ne s'affiche plus sur les écrans Veille**
(`isVeilleScreen`, `navigation.ts`), qu'il ne concernait pas ; header conservé partout. Build +
**37/37 tests verts**.

**Nœud A ré-encodé et validé (T-007bis, 2026-07-22)** : `content/noeuds/diabete-type-2/cible-glycemique.yaml`
a été ré-écrit depuis le dossier de preuve, après phase exploratoire (HAS 2024 / Prescrire / Médicalement
Geek / OpenEvidence) et **double vérification indépendante (2ᵉ passe)**, avec les corrections actées par le
référent (borne d'âge sur le strict, CV grave→≤8 via `comorbidite_grave`, conditions exclusives,
`divergence:true`, `selection: ordered-first-match`). **`meta.statut: valide`, v2.0** ; build + 27/27 tests verts.

## Ce qui fonctionne

- Contexte instancié (BRIEF, ARCHITECTURE, DECISIONS D1–D11, PROJECT_MAP, TASKS, VALIDATION, CLAUDE, AGENTS).
- Maquette Claude Design intégrée (`design/maquettes/prototype-ebm-msp-neuf-crans/`).
- **P1 livré** : `npm run build` + `npm run typecheck` + `npm test` → 23/23 tests verts. Voir
  `VALIDATION.md` pour la checklist visuelle humaine (blocs Shell, Accueil/Méthode, Décision D2, Décision D3).
- Nœud A : dossier de preuve + 2ᵉ passe + argumentaire exhaustif complets ; **ré-encodage YAML fait
  (T-007bis)**, `content/…/cible-glycemique.yaml` v2.0 `statut: valide`.
- Git : remote GitHub, `main` à jour, tous les commits P1 poussés (à confirmer avant push, cf. consolidation).

## P3 — Fusion prescription (B+C+D) + refonte par intention (S8) — POUSSÉ, validation clinique en attente

**Chronologie complète** (S1→S6 = fusion ; S8 = refonte par intention, ajoutée après coup suite à la relecture
référent des 4 situations d'usage réelles) :

- **S1-S5** : fusion de B (1re intention) + C (intensification) + D (sulfamides/gliptines) en un nœud unique
  `prescription`. Gating de terrain (GLP-1 exclu IMC<22/dénutrition, tirzépatide ⊂ obésité, iSGLT2
  rétrogradé si infections uro), portes SU/gliptine/intolérance, refus d'injection → injectables rétrogradés.
  B/C/D **supprimés** du repo. Remboursement FR (monothérapie AR GLP-1) sourcé sur le formulaire Assurance
  Maladie (Art. 61, arrêté du 10/01/2025).
- **S6** : validation référent initiale → `valide` v1.0, **D18** écrit — **puis repassé `brouillon`** (voir S8,
  la refonte par intention rouvre l'applicabilité, re-validation requise sur le contenu final).
- **S8 (2026-07-25, refonte par intention)** : le référent a reformulé le modèle de saisie autour de 4
  intentions d'usage réelles — `initier / intensifier / optimiser / déprescrire` — qui remplacent le champ
  `position_vs_cible`. Nouveau : palette glycémique (iSGLT2/GLP-1 disponibles hors comorbidité, priorisés par
  elle, séquençage HAS ≥8,5% à l'initiation) ; repli insuline explicite ; déprescription nuancée (réductions de
  dose distinctes par traitement, `nature_intolerance` ciblant l'agent en cause) ; alertes de cohérence
  intention↔HbA1c. **Vérifié par 4 agents adversariaux indépendants** (EBM+argumentaire, vignettes étendues,
  sécurité, robustesse du modèle) → 2 HAUTE trouvées et corrigées (non-association gliptine+incrétine rouverte
  par la palette ; alertes de cohérence manquantes) + plusieurs MOYENNE/BASSE. **3 arbitrages référent**
  supplémentaires tranchés et encodés (séquençage, ordre iSGLT2/GLP-1 en pur glycémique, nature d'intolérance)
  puis **re-vérifiés par une passe adversariale ciblée sur ces 3 deltas → 0 finding**.
- **Statut final** : `content/…/prescription.yaml` **`statut: brouillon` v0.9** (volontairement — la
  validation clinique se fait sur la version **déployée**, pas avant). Build + typecheck + **158 tests** verts.
- **Poussé sur `main`** (commit `a561b8b`, 2026-07-25) → déploiement Vercel déclenché. `DECISIONS.md` D18 à
  mettre à jour après validation référent finale (actuellement encore daté de la fusion S6, pas de S8).
- **UI** : `engine/relevance.ts` (moteur de pertinence, estompage + reco provisoire) livré et câblé. **Lot 4
  restant** : flux de saisie par intention (primer → traitements → drapeaux → critères positifs → affinage),
  regroupement d'affichage par intention (maquette 4a) — visuel à valider par le référent.
- **RESTE** : validation clinique référent sur le déployé → promotion `statut: valide`, mise à jour D18.

## Ce qui casse / n'est pas testé

- Validation **visuelle humaine** des écrans (Shell/Accueil/Méthode/D2/D3) pas encore faite — cf.
  `VALIDATION.md`. D3 doit être re-validé visuellement sur le **contenu nœud A v2.0** (bandes validées).

## Bugs connus

- —

## Dette technique

- ~~Sémantique moteur du nœud A~~ **tranchée (T-007bis)** : `selection: ordered-first-match` (sortie
  unique) ajouté au schéma + `evaluateNode` ; les nœuds B/C restent en `multi-options` (défaut, absence du champ).
- `docs/decision/noeuds/A-cible-glycemique.md` n'ajoute pas de champ « thème » d'affichage pour D2 ;
  S4 a utilisé `titre` par défaut (contournement de présentation, pas de contenu inventé) — à revisiter
  si plusieurs nœuds par thème apparaissent (P3+).
