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

## Backlog — clôture P4 (2026-07-28), exécutable sans arbitrage clinique

> Trouvés par la passe de contrôle P4 (S8) et la recette « praticien naïf » complémentaire — détail dans
> `docs/decision/validation/BILAN-P4-2026-07-28.md`. Candidats pour un plan P5 (à cadrer).

- [ ] **Un champ segmenté (`enum`) ne revient jamais à « non répondu » une fois touché** — tous nœuds,
      `src/features/decision/components/CriteriaForm.tsx` (le gestionnaire `onClick` du rendu segmenté
      n'a pas de chemin de retrait, contrairement au champ numérique qui a `onEffacer` depuis le
      2026-07-27). Aggravé par un reflow de page qui peut dévier un clic vers le mauvais champ, et par
      D30 (une valeur touchée est désormais décisive) — défaut classé **grave**. `BILAN-P4-2026-07-28.md`
      §2/§6 · modèle: Sonnet, effort: high · plan: —
- [ ] **`mcg_disponible == false` doit masquer les 4 champs de capteur** sur `insuline` (`TBR`,
      `TBR_severe`, `CV_glycemique`, `profil_glycemique`) — ils restent réclamés aujourd'hui sans capteur
      déclaré. `BILAN-P4-2026-07-28.md` §3bis/§6 · modèle: Sonnet, effort: medium · plan: —
- [ ] **La purge « Nouveau patient » n'a aucun retour visuel** — rien à l'écran ne distingue « annulé »
      de « exécuté ». `BILAN-P4-2026-07-28.md` §2bis/§6 · modèle: Sonnet, effort: low · plan: —
- [ ] Onglet **« Veille » rend une page blanche** (texte `top: 0`, caché sous la barre de nav fixe) —
      défaut d'affichage isolé, trouvé par la recette praticien naïf · modèle: Haiku, effort: low · plan: —

## Backlog — recherche clinique (bloque un câblage, contenu que je ne rédige pas seul)

- [ ] **Passe A — glycémie capillaire pour l'ajustement de l'insuline (nœud `insuline`, sans MCG)** —
      **reclassée bloquante pour l'usage** le 2026-07-28 (recette praticien naïf : un patient non naïf
      sans capteur est aujourd'hui une impasse, le praticien invente des chiffres que le moteur traite
      comme des mesures). Voie concrète donnée par le référent le 2026-07-28 (`BILAN-P4-2026-07-28.md`
      §3bis) : `TBR` est obtenable au lecteur capillaire, `TBR_severe` ne l'est **pas** (un lecteur ne
      distingue pas les deux seuils) ; piste de répartition horaire des hypoglycémies en 4 créneaux
      (nuit/matinée/après-midi/soir), analogue capillaire de ce que `profil_glycemique` lit déjà par AGP.
      Seuils de titration/plafonnement de la basale sur glycémie à jeun ; seuils post-prandiaux pour le
      bolus (champ à créer). Cadrage :
      `docs/decision/validation/chantier-2026-07-27/ARBITRAGES-2026-07-27-nuit.md` §1,
      `chantier-2026-07-27/diagnostic-K2-mesures-mcg.md`, `BILAN-P4-2026-07-28.md` §3bis ·
      modèle: Opus, effort: xhigh · plan: —
- [ ] **Passe B — sécurité à l'effort (nœud `rhd-activite-physique`)** : même statut, cadrage au même
      endroit (`ARBITRAGES-2026-07-27-nuit.md` §1) · modèle: Opus, effort: high · plan: —

## Backlog — arbitrages référent (attente réponse, pas de blocage technique)

- [ ] Frontière `a_l_objectif` / `sous_objectif` (nœud `prescription`) : seuil non donné, déclenche la
      déprescription — délibérément non pré-rempli par K6/D28.
- [ ] Seuil rénal de l'AR GLP-1 : 30 ou 20 mL/min/1,73 m² (`aglp1_indisponible`, `prescription.yaml`).
- [ ] `docs/decision/sources/prescrire 12.pdf` vide — à re-fournir.
- [ ] Politique de badge « Recommandée » quand la 1re option non-socle triée est une option `securite`
      plutôt qu'un choix d'agent (constat 2026-07-25, non retranché depuis D25).
- [ ] **Portée clinique de la dette `prescription`/patient naïf** (P4/S9, T-031, commit `e2c112c`) : les
      citations négatives de `traitements_en_cours` (garde-fous de non-duplication sur 8 options d'ajout —
      insuline d'initiation, iSGLT2, AR GLP-1, tirzépatide, association, gliptine, sulfamide) restent
      bloquées ; confirmé à l'écran y compris sur un profil catabolique (cétonémie + glucotoxicité + HbA1c
      11 %) qui justifierait cliniquement une insuline d'initiation. Acceptable en l'état, ou faut-il
      revenir sur l'exclusion de `traitements_en_cours` de `presomption_non` sur ce nœud (décision T-018) ?
      `BILAN-P4-2026-07-28.md` §3.
- [ ] **Asymétrie iSGLT2 / AR GLP-1 chez le sujet dénutri** (`prescription`, intention *Déprescrire*) : le
      même terrain (IMC < 22 et dénutrition) exclut l'AR GLP-1 mais pas l'iSGLT2 — trouvé par la recette
      praticien naïf (patient 86 ans, IMC 20,1, −4 kg/an, dénutri).
- [ ] **Validité de l'HbA1c non questionnée** (anémie, cirrhose, hémoglobinopathie) : l'outil raisonne sur
      une HbA1c sans jamais signaler qu'elle peut ne pas être interprétable — périmètre assumé, ou
      signalement à ajouter ?
- [ ] Carte **« Optimiser l'agent mal toléré »** affichée sans aucun traitement en cours coché — doute
      sur si `intolerance_traitement` doit être conditionné à `traitements_en_cours` non vide.
- [ ] **Descendre à la molécule et à la dose** hors du nœud `insuline` (aujourd'hui l'outil s'arrête à la
      classe partout ailleurs) — élargissement de périmètre assumé, pas un correctif ; demandé par la
      recette praticien naïf.
- [ ] Afficher le statut `brouillon` / `valide` **sur l'écran de décision**, pas seulement sur la page
      « Méthode » — le praticien croit aujourd'hui utiliser des algorithmes tous validés.

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
