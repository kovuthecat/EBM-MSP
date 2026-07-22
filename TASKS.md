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
