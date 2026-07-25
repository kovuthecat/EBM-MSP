# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session.

> **Dernière mise à jour :** 2026-07-24 (P2 gate humaine CLOSE — 11/11 divergences arbitrées, go S3 possible)

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

## P3 — Fusion prescription (B+C+D) — EN COURS (2026-07-24)

- **S1 gelé** : `docs/decision/noeuds/prescription.SPEC.md` (6 décisions référent : `sur_traitement` retiré ;
  déprescription < 6,5 % à tout âge ; GLP-1 exclu IMC<22/dénutrition ; tirzépatide ⊂ obésité ; portes
  SU/gliptine/intolérance ; alerte metformine-first).
- **S2/S3 faits** : `docs/decision/noeuds/prescription.md` + `content/…/prescription.yaml` (v0.1 **brouillon**)
  + argumentaire. Ajv OK. Fusionne B/C/D ; **aucune modif moteur** (tout en contenu D13/D14/D15 + `derive`).
- **S4 fait** : banc de vignettes exécutable (17 profils, `engine/evaluateNode.prescription.test.ts`) +
  red-team agent → **0 finding HAUTE résiduel** (H1 alerte iSGLT2/uro + M1 alerte insuline+SU corrigés).
- **UI (S7-ui Lots 1-3)** : `engine/relevance.ts` (moteur de pertinence, testé) + estompage des champs +
  bandeau reco provisoire (`CriteriaForm`, `DecisionNodeScreen`). Visuel à valider (VALIDATION.md).
- `npm run build` + `npx tsc --noEmit` + `npm test` → **163/163 verts**. **Rien committé** (WIP, référent non validé).
- **MISE À JOUR 2026-07-25 — fusion terminée** : affinements référent (position_vs_cible à 4 crans ; refus
  d'injection → injectables rétrogradés + alerte ; remboursement FR monothérapie AR GLP-1 sourcé sur le
  formulaire Assurance Maladie). **S5 fait** (B/C/D **supprimés**, `prescription` seule voie non-insulinique,
  labels UI, cross-refs E/H). **P2·S3–S7 fait** (red-team indépendant + banc exécutable → **0 HAUTE** ; M1
  gating `classes_a_benefice_indisponibles` + M2 alerte A9 corrigés ; `RAPPORT-prescription-S3-S7.md`).
  **S6 fait** : `prescription.yaml` **`valide` v1.0**, **D18** écrit. Build + typecheck + **148 tests** verts.
  **RESTE** : UI Lot 4 (primer/rail/argumentaires courts, visuel référent) ; arbitrages BAS M3/B1-B3
  (non bloquants) ; **rien committé** (à faire à ta main ou sur demande).

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
