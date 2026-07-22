# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session.

> **Dernière mise à jour :** 2026-07-22

## Phase actuelle

**Phase 1 — Câblage MVP module Décision : P1 exécuté et consolidé.** S1→S4 exécutées (une session Sonnet
à la fois), 8 commits atomiques tâche par tâche. Squelette logiciel du module Décision fonctionnel :
scaffold, tokens, shell, Accueil/Méthode, JSON Schema + import YAML + validation Ajv, moteur de règles
générique + tests, écrans D2/D3 câblés sur la maquette et le moteur.

**Point bloquant avant toute validation clinique** : le contenu du nœud A (`content/noeuds/
diabete-type-2/cible-glycemique.yaml`) a été encodé depuis l'ancien `BRIEF_DECISION.md §11`, mais un
chantier parallèle (dossier de preuve + vérification indépendante 2 passes) a conclu entretemps
**« NON prêt à encoder »** sur cette version — cf. `plans/P1/index.md` §Clôture pour le détail. Le
fichier reste `statut: brouillon`, **explicitement périmé**, en attente de **T-007bis** (cf. `TASKS.md`).

## Ce qui fonctionne

- Contexte instancié (BRIEF, ARCHITECTURE, DECISIONS D1–D11, PROJECT_MAP, TASKS, VALIDATION, CLAUDE, AGENTS).
- Maquette Claude Design intégrée (`design/maquettes/prototype-ebm-msp-neuf-crans/`).
- **P1 livré** : `npm run build` + `npm run typecheck` + `npm test` → 23/23 tests verts. Voir
  `VALIDATION.md` pour la checklist visuelle humaine (blocs Shell, Accueil/Méthode, Décision D2, Décision D3).
- Dossier de preuve nœud A avancé en parallèle (`docs/decision/noeuds/A-cible-glycemique.md` +
  `.verification-p2.md` + `.argumentaire.md`) — référent a validé 3 arbitrages cliniques
  (commit `1802dd9`), ré-encodage YAML restant.
- Git : remote GitHub, `main` à jour, tous les commits P1 poussés (à confirmer avant push, cf. consolidation).

## Ce qui casse / n'est pas testé

- Contenu clinique du nœud A **non fiable en l'état** (périmé, cf. ci-dessus) — ne pas s'y référer pour
  une décision réelle. Validation visuelle humaine des écrans (Shell/Accueil/Méthode/D2/D3) pas encore
  faite — cf. `VALIDATION.md`.

## Bugs connus

- —

## Dette technique

- Sémantique moteur à trancher pour le nœud A : S3 implémente « plusieurs options applicables, la 1re
  du nœud gagne » (multi-options, brief §7-8) ; le dossier de preuve propose pour ce nœud un mode
  **ordered-first-match à sortie unique**, distinct des nœuds B/C. À arbitrer avant T-007bis (impact
  potentiel schéma + `evaluateNode`).
- `docs/decision/noeuds/A-cible-glycemique.md` n'ajoute pas de champ « thème » d'affichage pour D2 ;
  S4 a utilisé `titre` par défaut (contournement de présentation, pas de contenu inventé) — à revisiter
  si plusieurs nœuds par thème apparaissent (P3+).
