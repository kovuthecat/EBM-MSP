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

- T-048/T-049/T-050 — Frontière position, seuil rénal AR GLP-1, agent mal toléré · → plans/P7/SA1.md
- T-051 — Badge dédié option `role: securite` · → plans/P7/SB1.md
- T-052/T-053 — Validité HbA1c (cadrage) + doctrine · → plans/P7/SA2.md
- T-054 — Recette navigateur locale, env: Desktop · → plans/P7/S2.md

## Backlog — mécanique, exécutable sans arbitrage clinique

- [ ] Vérifier sur le déployé (N1) : champ segmenté réversible (T-032), masquage capteur `insuline`
      (T-033), retour visuel purge (T-034) — livrés par P5, jamais confirmés en dehors du local ·
      modèle: Claude + navigateur, effort: low, env: Desktop
- [ ] Onglet **Veille** rend une page blanche (`top: 0` sous nav fixe) · modèle: Haiku, effort: low
- [ ] `GAJ` (nœud `insuline`) reste réclamé quand `mcg_disponible` est coché — masquage manquant,
      symétrique de `TBR`/`TBR_severe` (P5/S2, T-033) · modèle: Haiku, effort: low
- [ ] Banc `securite-atteignable.test.ts` (I23) timeout sur `rhd-activite-physique` (>120s, perf
      du banc, pré-existant) · modèle: Sonnet, effort: medium

## Backlog — recherche clinique (contenu que je ne rédige pas seul)

- [ ] **Passe B — sécurité à l'effort** (`rhd-activite-physique`) · modèle: Opus, effort: high
- [ ] **Contre-indications liées à des conditions vérifiables** (schéma+moteur puis ré-encodage
      prescription/statine/insuline/cible-glycemique — texte libre aujourd'hui, toujours en alerte
      même quand les critères saisis l'excluent) · modèle: Opus, effort: high
- [ ] **`insuline` — repli manquant, patient naïf déjà à la cible** (banc I2′/I23, profil #1213 :
      écran muet, texte à valider référent) · modèle: Opus, effort: medium

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

Supprimer la ligne d'une tâche dès que son plan est clos — historique dans `git log`. Purgé
2026-07-29 : P6 (T-035→T-047, clos), les items « sans action » et le lot P2 (T-013→T-017, couvert
autrement) — détail dans `git log` et `STATUS.md`.
