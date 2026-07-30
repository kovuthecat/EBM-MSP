# TASKS.md — ebm-msp

Index du **backlog** : ce qu'il reste à faire. Plafond : 60 lignes (appliqué par hook).
Le dossier `plans/P<n>/` n'est créé qu'au **démarrage** du plan.

> **Frontières** — TASKS : le *quoi* qui reste · `plans/P<n>/index.md` : l'*avancement* des tâches
> planifiées · `STATUS.md` : l'état actuel · `VALIDATION.md` : jugement visuel humain en attente.

## Convention

**Non planifiée** : `- [ ] T-ID — titre · modèle: X, effort: Y`.
**Entrée dans un plan** (statut dans l'`index.md` du plan, pas ici) : `- T-ID — titre · → plans/P<n>/S<k>.md`.
Modèles/efforts : `WORKFLOW.md` §2-3. `env: Desktop` si la tâche exige le navigateur in-app (N1).

## Plan P7 — en cours (statut/détail : `plans/P7/index.md`)

- T-052/T-053 — Validité HbA1c (cadrage) + doctrine → plans/P7/SA2.md · T-054 — recette locale → S2.md

## Plan P8 — quasi clos, S9 non livrée (statut/détail : `plans/P8/index.md`)

- T-067 — La baisse continue nocturne déclenche « réduire la basale », chiffrée (B3a/b/c déjà répondus)
  · → plans/P8/S9.md · S1-S8 livrées, vérifiées (N0 + recette N1 2026-07-30), commitées.

## Backlog — mécanique, exécutable sans arbitrage clinique

- [ ] Vérifier sur le déployé (N1) : T-032/T-033/T-034 (P5, jamais confirmés hors local) · Claude + navigateur, low, env: Desktop
- [ ] Onglet **Veille** rend une page blanche (`top: 0` sous nav fixe) · modèle: Haiku, effort: low
- [ ] `GAJ` (`insuline`) : plus réclamé sous capteur (recette 2026-07-30 N11) mais toujours affiché · Haiku, low
- [ ] Banc `securite-atteignable.test.ts` (I23) timeout sur `rhd-activite-physique` (pré-existant) · Sonnet, medium
- [ ] Suggestion d'espérance de vie (T-061/P8) ne se retrigger pas après « Reprendre les valeurs de ce
      patient » (recette P8) · Sonnet, medium
- [ ] `lib/replierAffichage.ts`/`plafond-affichage.test.ts` (P9/S1) lisent le champ brut, pas l'état
      évalué — carte 100% CI levées resterait non repliable (conservateur, sans effet actuel) · Sonnet, low

## Backlog — recherche clinique / arbitrage référent

- [ ] **Passe B — sécurité à l'effort** (`rhd-activite-physique`) · modèle: Opus, effort: high
- [ ] **T-074 (P9/S7)** — `risque_hypoglycemie_schema` : un usage (prescription.yaml l.1664) doit se
      déclencher SANS agent hypoglycémiant en cours → dérivation auto impossible sans arbitrage référent
      (« Élevé » capte-t-il plus qu'une liste de traitements ?).

## Backlog — validation clinique finale (D5, passage à `statut: valide`)

- [ ] `prescription`, `insuline`, `rhd-alimentation`, `rhd-activite-physique` : relecture référent de
      bout en bout sur le déployé. Session dédiée demandée par Thibault, pas encore calée.

## Backlog (Phases suivantes — non cadré)

- [ ] Module Veille : JSON Schema entrée, écran liste filtrable (V1), détail (V2) — zéro code (D8/D2).
- [ ] Comptes Supabase (auth V5, profil V3, mémoire V4) + conformité RGPD.
- [ ] Pont couplage veille ↔ nœud (marqueur « impacte un algorithme »).
- [ ] Page Méthode (S1, SOP publiée).
- [ ] T-019 (reliquat P3) — catalogue formel des critères `partage` (en grande partie livré par D28).

## Archivage

Supprimer la ligne d'une tâche dès que son plan est clos — historique dans `git log`. Purgé 2026-07-29 :
P6 (T-035→T-047), items « sans action », lot P2 (T-013→T-017). Purgé 2026-07-30 : P7 T-048→T-051 (faits ou
obsolètes) ; P8 T-055→T-066 (livrées, vérifiées, commitées) ; P9 T-068→T-077 (livrées, vérifiées,
commitées — sauf T-074, ré-ouverte ci-dessus en arbitrage référent) — détail dans `git log`/`STATUS.md`.
