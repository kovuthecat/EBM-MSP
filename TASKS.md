# TASKS.md — ebm-msp

Index unique des tâches : backlog **et** tâches actives. Une ligne par tâche.
Le dossier de plan `plans/P<n>/` n'est créé qu'au **démarrage** du plan.

> **Frontières** — TASKS : le *quoi* · `STATUS.md` : l'état actuel · `plans/` : le *comment* d'une
> tâche en cours · `VALIDATION.md` : checklist visuelle.

## Convention de ligne

`- [statut] T-ID — titre · modèle: X, effort: Y · plan: <lien ou —>`
statut : ` ` à faire · `~` en cours · `x` fait · modèles/efforts : `WORKFLOW.md` §2-3.

## Étape en cours (hors backlog code)

- [x] **Maquette Claude Design** — 9 écrans reçus (handoff dans `design/maquettes/prototype-ebm-msp-neuf-crans/`),
  `ARCHITECTURE.md §Maquette` mis à jour. *(fait 2026-07-22)*
- [x] **Exécuter le plan P1** (câblage MVP module Décision) — cf. [plans/P1/index.md](plans/P1/index.md).
  S1 → S2 → S3 → S4 exécutées et consolidées *(fait 2026-07-22)*.
- [x] **T-007bis — Ré-encoder le nœud A « Cible glycémique »** depuis le dossier réconcilié + 2ᵉ passe,
  décisions référent actées, sémantique moteur **`ordered-first-match` (sortie unique)** ajoutée au
  schéma + `evaluateNode`. `content/…/cible-glycemique.yaml` **v2.0 `meta.statut: valide`** · build +
  **27/27 tests verts** *(fait 2026-07-22 · Opus)*.
- [x] **T-009 — Ergonomie du formulaire de critères (D3)** : grille fixe 2 colonnes (plus de champ
  orphelin), cases à cocher regroupées visuellement à part, champs numériques vides (placeholder
  `—`) au lieu d'un `0` trompeur pris pour une valeur saisie, message d'invite tant que les champs
  numériques requis ne sont pas renseignés (plus de recommandation calculée sur des `0` par défaut),
  libellés `antecedent_cv`/`comorbidite_grave` accentués. Ajout d'une **suggestion auto (non sourcée,
  modifiable) d'`esperance_vie`** dérivée de l'âge/fragilité/comorbidité grave/antécédent CV
  (`lib/esperanceVieDefault.ts`), désactivée dès que le champ est choisi manuellement · build +
  **34/34 tests verts** *(fait 2026-07-23 · Sonnet)*.
- [x] **T-010 — Ton du disclaimer, méthode des algorithmes publiée, niveau de lecture 3** : disclaimer
  permanent (+ accueil + pied d'écran nœud) réécrit sur un ton rassurant (« fondé exclusivement sur
  l'EBM », praticien = lien avec le patient et responsable de la décision). Écran Méthode : ajout du
  bloc « Algorithmes d'aide à la décision » (résumé de `docs/decision/00-global.md`), à côté du bloc
  veille déjà publié. Niveau 3 (D11, « argumentaire exhaustif ») enfin exposé dans `ArgumentPanel` via
  un lien dépliant, rendu par un petit composant Markdown maison `MiniMarkdown` (zéro dépendance
  ajoutée, CLAUDE.md invariant 8) — 2 bugs de rendu trouvés et corrigés en validation (boucle infinie
  sur les titres, puces multi-lignes mal rattachées) · build + **37/37 tests verts**
  *(fait 2026-07-23 · Sonnet)*.
- [x] **T-010bis — Lisibilité du disclaimer + hors périmètre Veille** : disclaimer (bandeau + accueil)
  reformaté en 2 phrases (1re en gras sur sa propre ligne, expressions clés en gras dans la 2e).
  Bandeau disclaimer masqué sur les écrans Veille (`isVeilleScreen`, `navigation.ts`) — ne concernait
  que le module Décision · build + **37/37 tests verts** *(fait 2026-07-23 · Sonnet)*.

## Backlog (Phase 1 — MVP module Décision) — cadré dans `plans/P1/`

- [x] T-001 — Scaffold Vite + React + TS + Vitest + tokens + shell · modèle: Sonnet, effort: medium · plan: → plans/P1/S1.md
- [x] T-008 — Accueil (D1) + Méthode (S1) + disclaimer permanent · modèle: Sonnet, effort: medium · plan: → plans/P1/S1.md
- [x] T-002 — JSON Schema du nœud de décision + types TS · modèle: Sonnet, effort: high · plan: → plans/P1/S2.md
- [x] T-004 — Import YAML (plugin Vite) + validation Ajv en test · modèle: Sonnet, effort: high · plan: → plans/P1/S2.md
- [x] T-007 — Contenu nœud A « Cible glycémique » (YAML sourcé, brief §11) · modèle: Sonnet, effort: high · plan: → plans/P1/S2.md *(périmé, cf. T-007bis)*
- [x] T-003 — Moteur de règles déterministe (évaluateur de conditions, TS pur) + tests Vitest · modèle: Sonnet, effort: high · plan: → plans/P1/S3.md
- [x] T-005 — UI Décision D2 (domaines + liste nœuds) · modèle: Sonnet, effort: high · plan: → plans/P1/S4.md
- [x] T-006 — UI Décision D3 (form → options → argumentaire, câblé moteur) · modèle: Sonnet, effort: high · plan: → plans/P1/S4.md

## Backlog (P2 — Validation systémique DT2, cohérence inter-nœuds) — cadré dans `plans/P2/`

> Méthode : `docs/decision/VALIDATION_COHERENCE.md`. Exécution = workflow multi-agents (1 session = 1 phase).

- [x] T-011 — Inventaire mécanique des éléments partagés inter-nœuds · modèle: Haiku, effort: low · plan: → plans/P2/S1.md
- [x] T-012 — Carte de cohérence des valeurs + relevé des divergences · modèle: Sonnet, effort: medium · plan: → plans/P2/S2.md
- [ ] T-013 — Red-team données EBM inter-nœuds (validité globale) · modèle: Opus, effort: max · plan: → plans/P2/S3.md
- [ ] T-014 — Banc de vignettes + confrontation des trajectoires · modèle: Opus, effort: xhigh · plan: → plans/P2/S4.md
- [ ] T-015 — Red-team contradictoire (personas hostiles) · modèle: Opus, effort: high · plan: → plans/P2/S5.md
- [ ] T-016 — Vérification adversariale des findings (anti-faux-positif) · modèle: Opus, effort: xhigh · plan: → plans/P2/S6.md
- [ ] T-017 — Rapport de validation + registres de défendabilité + spec tests · modèle: Opus, effort: xhigh · plan: → plans/P2/S7.md

## P3 — Fusion prescription (plans/P3-fusion/) — en cours

- [x] T-020 — SPEC nœud unifié (gelé référent 2026-07-24) · plan: → plans/P3-fusion/S1.md
- [x] T-021 — Dossier de preuve consolidé (prescription.md) · plan: → plans/P3-fusion/S2.md
- [x] T-022 — Encodage prescription.yaml + argumentaire (brouillon v0.1), Ajv OK · plan: → plans/P3-fusion/S3.md
- [x] T-023 — Vérification S4 (banc exécutable 17 profils + red-team, 0 HAUTE) · plan: → plans/P3-fusion/S4.md
- [x] T-024 — Câblage app 3 onglets→1 + retrait B/C/D (148 tests + build OK) · plan: → plans/P3-fusion/S5.md
- [x] Validation adversariale P2·S3–S7 (red-team indépendant + banc exécutable, 0 HAUTE, M1/M2 corrigés) · → RAPPORT-prescription-S3-S7.md
- [x] T-025 — Validation référent initiale → `valide` v1.0 + D18 · plan: → plans/P3-fusion/S6.md *(voir T-027 : repassé brouillon pour la refonte S8, D18 à mettre à jour)*
- [~] T-026 — Refonte UI : Lots 1-3 faits (relevance + estompage + reco provisoire) ; **Lot 4 restant** (primer par intention/rail/argumentaires, visuel référent) · plan: → plans/P3-fusion/S7-ui.md
- [x] T-027 — Refonte « par intention » (S8) : 4 intentions (initier/intensifier/optimiser/déprescrire) remplacent `position_vs_cible` ; palette glycémique + séquençage HAS ; repli insuline ; déprescription nuancée (réductions distinctes, `nature_intolerance`) ; alertes de cohérence. Vérifié 4 agents adversariaux (2 HAUTE corrigées) + passe ciblée sur 3 arbitrages référent (0 finding). 158 tests + build verts. **Poussé sur `main` (a561b8b)**, `statut: brouillon` v0.9 en attente de validation clinique sur le déployé · plan: → docs/decision/noeuds/prescription.SPEC-intentions.md

## Backlog (P3 — suites de la grammaire R1→R6, D19)

> Les quatre premières lignes correspondent à des `it.fails` du banc
> (`src/features/decision/engine/banc/`) : elles passent au vert d'elles-mêmes une fois corrigées, il
> n'y a donc rien à penser à décocher.

- [ ] **RÉFÉRENT** — `insuline` : `TIR`/`TAR`/`GMI` ne changent rien à l'écran. Non décisifs par
      conception (axe « contrôle » jugé redondant avec l'HbA1c), mais leurs valeurs ne sont pas rendues
      non plus — les alertes énoncent des cibles sans utiliser le chiffre saisi. Les brancher (afficher
      la valeur vs la cible) ou les retirer du formulaire ? · plan: —
- [ ] `insuline` : `IMC` et `dose_rapide_actuelle` morts (aucune règle, aucun calcul) — retirer ·
      modèle: Sonnet, effort: low · plan: —
- [ ] **RÉFÉRENT** — `insuline` : sortie vide possible (branche « basale seule », ni clause de sécurité
      ni objectif manqué). Ce nœud n'a pas d'option de repli `["default"]`, contrairement à
      `prescription` où le même trou (M3) a été corrigé · plan: —
- [ ] **RÉFÉRENT** — jonction manquante : la place résiduelle gliptine/sulfamide est ouverte par
      `classes_a_benefice_indisponibles`, drapeau indépendant de `position_vs_cible` — un patient en
      sur-traitement peut donc se voir proposer un agent purement glycémique · plan: —
- [ ] **R4** — tracer les échecs de condition dans `EvaluateNodeResult` ; afficher les options écartées
      avec leur motif (poussé) et les non-retenues sur demande. **Bloque la levée de
      `ne_contient_pas gliptine`** et donc la dette de la recette · modèle: Sonnet, effort: high · plan: —
- [ ] **R6 fond** — `termesVrais` : ne renvoyer que les termes `OR` réellement vrais, motif de rang
      (`resolvePriorite`). Après l'unification écran ↔ signature · modèle: Sonnet, effort: high · plan: —
- [ ] **R6 liv. 2** — champ `prerequis` (schéma + moteur + migration de contenu) : séparer l'indication
      qui justifie des garde-fous de cohérence qui n'apprennent rien · modèle: Sonnet, effort: high · plan: —
- [ ] **R2, 2e moitié** — alertes portées par une option (affichées seulement si l'option est
      applicable). Résout aussi l'alerte fragilité qui s'affiche pour une option écartée. Après
      l'unification · modèle: Sonnet, effort: high · plan: —
- [ ] **RÉFÉRENT** — lever `ne_contient_pas gliptine` de l'option AR GLP‑1, généraliser l'option de
      switch de la gliptine (prose déjà rédigée et validée, en attente) et ajouter la gliptine à
      `remplacement_agent_sans_benefice`. **Après R4**, séquencement tranché le 2026-07-25 · plan: —
- [ ] **RÉFÉRENT** — alerte M2/A9 : elle affirme « aucun remplaçant protecteur pertinent » alors que
      R3 rend l'iSGLT2 applicable par la voie du remplacement, y compris chez le patient à IMC < 22
      qu'elle visait. Son test reste vert : il ne vérifie que la présence du message, pas sa justesse · plan: —
- [ ] **RÉFÉRENT** — les deux alertes de cohérence intention↔HbA1c conseillent « rebasculer
      l'intention » ; depuis R1 le bon geste serait de corriger `position_vs_cible` · plan: —
- [ ] **RÉFÉRENT** — `delai_benefice` manquants : AR GLP‑1 (aucune durée écrite dans son
      `effet_attendu`), insuline (le « ~2 ans » de DEVOTE ne vaut que pour degludec vs glargine U100,
      l'option portant sur la classe), rhd (les chiffres DiRECT décrivent l'érosion d'un substitut) · plan: —
- [ ] Rebrancher le test R5 du banc sur le modèle de vue une fois l'unification faite : contre
      `evaluateNode` il sous-estime la portée d'un critère (une dose calculée, un texte d'alerte) ·
      modèle: Sonnet, effort: medium · plan: —

## Backlog (P3 — reste avant `valide` final)

- [ ] Validation clinique référent sur ebm-msp.vercel.app (post-S8) → `prescription.yaml` `statut: valide`, bump version, mise à jour `DECISIONS.md` D18 (actuellement daté de la fusion S6, à réaligner sur S8)
- [ ] T-026 Lot 4 — flux de saisie par intention (maquette 4a) + affichage groupé par intention, visuel référent

## Backlog (P3 — Remédiation & robustesse, alimenté par P2) — non cadré

- [ ] T-018 — Coder les tests de non-régression inter-nœuds (spec = P2/S7) · modèle: Sonnet, effort: high · plan: —
- [ ] T-019 — Catalogue de critères canonique + persistance de session **partagée** des critères (store en mémoire, invariant 1 ; entrée `DECISIONS.md`) · modèle: Opus/Sonnet, effort: high · plan: —
- [ ] Corrections YAML issues du RAPPORT + validation référent finale de D et E → `valide`

## Backlog (Phases suivantes — non cadré)

- [ ] Nœuds B→H : contenu **déjà encodé** (A–F, H) ; reste la validation référent de D et E (→ T-019 zone P3)
- [ ] **P4** — JSON Schema entrée de veille + module Veille (liste filtrable V1, détail V2)
- [ ] Comptes Supabase (auth V5, profil V3, pour mémoire V4) + conformité RGPD
- [ ] Pont couplage veille ↔ nœud (marqueur « impacte un algorithme »)
- [ ] Page Méthode (S1, SOP publiée)

## Archivage

Purger les lignes `[x]` une fois leur plan clos — l'historique git suffit.
