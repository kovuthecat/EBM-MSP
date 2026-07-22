# TASKS.md — ebm-msp

Index unique des tâches : backlog **et** tâches actives. Une ligne par tâche.
Le dossier de plan `plans/P<n>/` n'est créé qu'au **démarrage** du plan.

> **Frontières** — TASKS : le *quoi* · `STATUS.md` : l'état actuel · `plans/` : le *comment* d'une
> tâche en cours · `VALIDATION.md` : checklist visuelle.

## Convention de ligne

`- [statut] T-ID — titre · modèle: X, effort: Y · plan: <lien ou —>`
statut : ` ` à faire · `~` en cours · `x` fait · modèles/efforts : `WORKFLOW.md` §2-3.

## Étape en cours (hors backlog code)

- [ ] **Maquette Claude Design** — envoyer `ARCHITECTURE.md` tel quel, dessiner les écrans
  (D1, D2, D3, V1, V2, V3, V4, V5, S1), exporter dans `design/maquettes/`, mettre à jour
  `ARCHITECTURE.md §Maquette`. *(étape humaine — préalable au câblage)*

## Backlog (Phase 1 — MVP module Décision, cadré en plan après la maquette)

- [ ] T-001 — Scaffold Vite + React + TS + Vitest (structure feature-first, config) · modèle: Sonnet, effort: medium · plan: —
- [ ] T-002 — JSON Schema du nœud de décision + validation · modèle: Sonnet, effort: high · plan: —
- [ ] T-003 — Moteur de règles déterministe (filtrage options par conditions, TS pur) + tests Vitest · modèle: Sonnet, effort: high · plan: —
- [ ] T-004 — Loader de contenu YAML→JSON (build-time) · modèle: Sonnet, effort: medium · plan: —
- [ ] T-005 — UI module Décision : formulaire critères → options (badges preuve, effet absolu) · modèle: Sonnet, effort: high · plan: —
- [ ] T-006 — UI argumentaire dépliable (reco officielle vs position critique, divergence, sources) · modèle: Sonnet, effort: medium · plan: —
- [ ] T-007 — Contenu nœud A « Cible glycémique » (YAML sourcé, cf. gabarit BRIEF_DECISION §11) · modèle: Sonnet, effort: high · plan: —
- [ ] T-008 — Layout/navigation + accueil (D1) + disclaimer permanent · modèle: Haiku, effort: low · plan: —

## Backlog (Phases 2–3 — non cadré)

- [ ] Nœuds B→H (contenu clinique DT2) — un lot par nœud
- [ ] JSON Schema entrée de veille + module Veille (liste filtrable V1, détail V2)
- [ ] Comptes Supabase (auth V5, profil V3, pour mémoire V4) + conformité RGPD
- [ ] Pont couplage veille ↔ nœud (marqueur « impacte un algorithme »)
- [ ] Page Méthode (S1, SOP publiée)

## Archivage

Purger les lignes `[x]` une fois leur plan clos — l'historique git suffit.
