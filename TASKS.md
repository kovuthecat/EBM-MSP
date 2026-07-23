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

## Backlog (Phases 2–3 — non cadré)

- [ ] Nœuds B→H (contenu clinique DT2) — un lot par nœud
- [ ] JSON Schema entrée de veille + module Veille (liste filtrable V1, détail V2)
- [ ] Comptes Supabase (auth V5, profil V3, pour mémoire V4) + conformité RGPD
- [ ] Pont couplage veille ↔ nœud (marqueur « impacte un algorithme »)
- [ ] Page Méthode (S1, SOP publiée)

## Archivage

Purger les lignes `[x]` une fois leur plan clos — l'historique git suffit.
