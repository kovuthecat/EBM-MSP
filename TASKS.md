# TASKS.md — ebm-msp

Index unique des tâches : backlog **et** tâches actives. Une ligne par tâche.
Le dossier de plan `plans/P<n>/` n'est créé qu'au **démarrage** du plan.

> **Frontières** — TASKS : le *quoi* · `STATUS.md` : l'état actuel · `plans/` : le *comment* d'une
> tâche en cours · `VALIDATION.md` : checklist visuelle.

## Convention de ligne

`- [statut] T-ID — titre · modèle: X, effort: Y · plan: <lien ou —>`
statut : ` ` à faire · `~` en cours · `x` fait · modèles/efforts : `WORKFLOW.md` §2-3.

## Archivage (2026-07-28)

Ce fichier avait accumulé, sans purge, le détail complet de P1, de P2·S1-S2 et de la fusion
`prescription` (P3) depuis 2026-07-22 — alors que sa propre règle (§Archivage ci-dessous) demande de
purger une ligne `[x]` une fois son plan clos. Purgé : **P1 (T-001 à T-008, T-007), P2·S1-S2 (T-011,
T-012), la fusion `prescription` T-020 à T-027**, et les six règles de la grammaire R1→R6 (D19,
résolues le 2026-07-25). Le détail de tout cela reste entier dans `git log` et dans les décisions
correspondantes de `DECISIONS.md`. Ce qui suit est le backlog **réel et actuel**.

## Backlog — recherche clinique (bloque un câblage, contenu que je ne rédige pas seul)

- [ ] **Passe A — glycémie capillaire pour l'ajustement de l'insuline (nœud `insuline`, sans MCG)** :
      seuils de titration/plafonnement de la basale sur glycémie à jeun ; seuils post-prandiaux pour le
      bolus (champ à créer, `profil_glycemique` actuel suppose un capteur) ; sort des garde-fous
      `TBR`/`TBR_severe`/`CV_glycemique` chez le patient non équipé. Cadrage :
      `docs/decision/validation/chantier-2026-07-27/ARBITRAGES-2026-07-27-nuit.md` §1,
      `chantier-2026-07-27/diagnostic-K2-mesures-mcg.md` · modèle: Opus, effort: xhigh · plan: —
- [ ] **Passe B — sécurité à l'effort (nœud `rhd-activite-physique`)** : même statut, cadrage au même
      endroit (`ARBITRAGES-2026-07-27-nuit.md` §1) · modèle: Opus, effort: high · plan: —

## Backlog — arbitrages référent (attente réponse, pas de blocage technique)

- [ ] Frontière `a_l_objectif` / `sous_objectif` (nœud `prescription`) : seuil non donné, déclenche la
      déprescription — délibérément non pré-rempli par K6/D28.
- [ ] Seuil rénal de l'AR GLP-1 : 30 ou 20 mL/min/1,73 m² (`aglp1_indisponible`, `prescription.yaml`).
- [ ] `docs/decision/sources/prescrire 12.pdf` vide — à re-fournir.
- [ ] Politique de badge « Recommandée » quand la 1re option non-socle triée est une option `securite`
      plutôt qu'un choix d'agent (constat 2026-07-25, non retranché depuis D25).

## Backlog — validation clinique finale (D5, passage à `statut: valide`)

- [ ] `prescription`, `insuline`, `rhd-alimentation`, `rhd-activite-physique` : relecture référent de
      bout en bout sur le déployé, condition du passage à `valide`. Les vignettes RHD écrites le
      2026-07-27 verrouillent des arbitrages déjà rendus (statut documenté en tête de
      `evaluateNode.rhd-alimentation.test.ts`/`evaluateNode.rhd-activite-physique.test.ts`) — elles ne
      remplacent pas cette relecture patient par patient.

## Dette de réconciliation (constat 2026-07-28, pas un chantier)

- [ ] `TASKS.md` §Backlog (P2 — validation systémique, ci-dessous) porte encore T-013 à T-017 non
      cochées alors que leur objet (red-team données, vignettes, red-team contradictoire, vérification,
      rapport) a été couvert dans les faits par les chantiers 2026-07-26/27, nœud par nœud, par un chemin
      différent de celui cadré dans `plans/P2/`. À trancher : cocher avec renvoi, ou retirer.

## Backlog (P2 — Validation systémique DT2, cohérence inter-nœuds) — cadré dans `plans/P2/`

> Méthode : `docs/decision/VALIDATION_COHERENCE.md`. S1/S2 exécutées (2026-07-24) ; S3-S7 non exécutées
> **selon ce cadrage précis** — leur objet a été couvert autrement, cf. dette de réconciliation ci-dessus.

- [ ] T-013 — Red-team données EBM inter-nœuds (validité globale) · modèle: Opus, effort: max · plan: → plans/P2/S3.md
- [ ] T-014 — Banc de vignettes + confrontation des trajectoires · modèle: Opus, effort: xhigh · plan: → plans/P2/S4.md
- [ ] T-015 — Red-team contradictoire (personas hostiles) · modèle: Opus, effort: high · plan: → plans/P2/S5.md
- [ ] T-016 — Vérification adversariale des findings (anti-faux-positif) · modèle: Opus, effort: xhigh · plan: → plans/P2/S6.md
- [ ] T-017 — Rapport de validation + registres de défendabilité + spec tests · modèle: Opus, effort: xhigh · plan: → plans/P2/S7.md

## Backlog (Phases suivantes — non cadré)

- [ ] **P4** — module Veille : JSON Schema entrée de veille, écran liste filtrable (V1), détail (V2).
      Zéro code à ce jour (`DECISIONS.md` D8/D2) — reste une ligne de roadmap, pas un chantier entamé.
- [ ] Comptes Supabase (auth V5, profil V3, pour mémoire V4) + conformité RGPD
- [ ] Pont couplage veille ↔ nœud (marqueur « impacte un algorithme »)
- [ ] Page Méthode (S1, SOP publiée)
- [ ] T-019 (reliquat P3) — catalogue de critères canonique — **en grande partie livré par D28** (mémoire
      de session sur les critères `partage`) ; ce qui reste : un catalogue formel documentant quels
      critères DOIVENT être `partage` par convention plutôt que déclarés au coup par coup.

## Archivage

Purger les lignes `[x]` une fois leur plan clos — l'historique git suffit.
