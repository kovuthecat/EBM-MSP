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

## Plan P6 — clos (cadré 2026-07-28, clos 2026-07-29)

> Généralise le shell accordéon + colonne sticky (maquette `Traiter`) aux 6 nœuds, + badge verbe
> d'action sur `prescription`/`insuline`. Détail : `plans/P6/index.md`. Recette navigateur locale
> CONFORME (point 3 après correctif SB6 ; point 1c CONFORME avec réserve mineure, cf. ligne
> ci-dessous). Commits : `90e2849`…`7f6ff12`.

- [x] T-035 — Schéma + types : `Option.action` · modèle: Haiku, effort: low · plan: → plans/P6/S0.md
- [x] T-036 — Shell deux colonnes (formulaire + résultats sticky) · modèle: Sonnet, effort: high · plan: → plans/P6/SB1.md
- [x] T-037 — Formulaire en accordéon (générique, `groupe`) · modèle: Sonnet, effort: high · plan: → plans/P6/SB2.md
- [x] T-038 — Qualifier `action` sur `prescription` (27 options) · modèle: Sonnet, effort: high · plan: → plans/P6/SA1.md
- [x] T-039 — Qualifier `action` sur `insuline` (12 options) · modèle: Sonnet, effort: medium · plan: → plans/P6/SA2.md
- [x] T-040 — Carte compacte : bordure verbe + contre-indications dans le dépli · modèle: Sonnet, effort: high · plan: → plans/P6/SB3.md
- [x] T-041 — Vérification inter-nœuds et finition · modèle: Sonnet, effort: high · plan: → plans/P6/SB4.md
- [x] T-042 — Doctrine (ARCHITECTURE.md, DECISIONS.md, `action`) · modèle: Sonnet, effort: medium · plan: → plans/P6/SB5.md
- [x] T-044 — `insuline` : grouper les champs pour l'accordéon (ajoutée en cours, découverte SB4) · modèle: Sonnet, effort: medium · plan: → plans/P6/SA3.md
- [x] T-043 — Recette navigateur des 6 nœuds · modèle: Claude + navigateur, effort: high, env: Desktop · plan: → plans/P6/S6.md
- [x] T-045 — Défaut grave S6 (point 3) : habiller le résumé fermé des CI (icône/couleur/décompte) · modèle: Sonnet, effort: high · plan: → plans/P6/SB6.md
- [x] T-046 — Défaut mineur S6 (point 1c) : CTA flottant vs bouton « Suivant » en mobile · modèle: Sonnet, effort: medium · plan: → plans/P6/SB7.md
- [x] T-047 — Revérification ciblée SB6/SB7 (points 3 et 1c), en local · modèle: Claude + navigateur, effort: medium, env: Desktop · plan: → plans/P6/S7.md

## Backlog — clôture P4/P5 (2026-07-28), exécutable sans arbitrage clinique

> Trouvés par la passe de contrôle P4 (S8) et la recette « praticien naïf » complémentaire — détail dans
> `docs/decision/validation/BILAN-P4-2026-07-28.md`. Trois des quatre items livrés par `plans/P5/`
> (commits `bc59e2a`, `7657f4a`, `806fdb9`) : champ segmenté réversible (T-032), masquage capteur
> `insuline` (T-033), retour visuel purge (T-034).

- [ ] Onglet **« Veille » rend une page blanche** (texte `top: 0`, caché sous la barre de nav fixe) —
      défaut d'affichage isolé, trouvé par la recette praticien naïf, pas repris dans P5 · modèle: Haiku,
      effort: low · plan: —
- [ ] **CTA flottant mobile (P6) : réserve mineure résiduelle** — après correctif SB7, le chevauchement
      avec le bouton « Suivant » ne se produit plus en usage normal, mais réapparaît si l'utilisateur
      pousse volontairement le défilement au-delà du point d'arrêt naturel (marge de 9,4px seulement sur
      la section la plus chargée, `Insulinothérapie`/« Surveillance glycémique »). Aucun scénario de
      lecture ordinaire ne le déclenche — durcir la marge (`padding-bottom` 140px→~180px) si ça se
      confirme gênant en usage réel · modèle: Haiku, effort: low · plan: —
- [ ] **`GAJ` (nœud `insuline`) reste réclamé même quand `mcg_disponible` est coché** — trouvé par la
      recette navigateur P6/S6 (2026-07-29). `content/noeuds/diabete-type-2/insuline.yaml:187` ne porte
      aucun `visible_si` conditionné à `mcg_disponible`, alors que le commentaire du référent dans ce
      même fichier dit l'inverse (« la GAJ est le cas de repli quand il n'y a pas de MCG ») et que le
      pivot de décision sous MCG ne lit jamais ce champ. Masquage à ajouter, symétrique de celui déjà
      livré pour `TBR`/`TBR_severe`/`CV_glycemique`/`profil_glycemique` (P5/S2, T-033) · modèle: Haiku,
      effort: low · plan: —

## Backlog — recherche clinique (bloque un câblage, contenu que je ne rédige pas seul)

- [ ] **Passe A — glycémie capillaire pour l'ajustement de l'insuline (nœud `insuline`, sans MCG)** —
      **reclassée bloquante pour l'usage** le 2026-07-28 (recette praticien naïf : un patient non naïf
      sans capteur est aujourd'hui une impasse, le praticien invente des chiffres que le moteur traite
      comme des mesures). **Volet mécanique livré par P5/S2 (T-033, commit `7657f4a`)** : les 4 champs de
      capteur (dont `TBR_severe`) se masquent désormais sans `mcg_disponible`. Reste le volet clinique —
      voie concrète donnée par le référent le 2026-07-28 (`BILAN-P4-2026-07-28.md` §3bis) : `TBR` est
      obtenable au lecteur capillaire, `TBR_severe` ne l'est **pas** (un lecteur ne distingue pas les deux
      seuils) ; piste de répartition horaire des hypoglycémies en 4 créneaux (nuit/matinée/après-midi/
      soir), analogue capillaire de ce que `profil_glycemique` lit déjà par AGP. **Précision du référent,
      2026-07-29** : `TBR_severe` reste hors de portée en consultation même chez un patient **équipé**
      d'un capteur (`mcg_disponible = oui`) — la répartition TBR/TBR sévère ne se lit pas directement sur
      le lecteur, elle suppose de télécharger les données sur ordinateur, un geste rarement fait pendant
      la consultation. Le champ n'est donc pas seulement inatteignable *sans* capteur, il l'est aussi en
      pratique *avec* capteur au moment de la décision. Seuils de titration/
      plafonnement de la basale sur glycémie à jeun ; seuils post-prandiaux pour le bolus (champ à créer).
      Cadrage : `docs/decision/validation/chantier-2026-07-27/ARBITRAGES-2026-07-27-nuit.md` §1,
      `chantier-2026-07-27/diagnostic-K2-mesures-mcg.md`, `BILAN-P4-2026-07-28.md` §3bis.
      **Prompt de démarrage prêt** (session neuve, à lancer en parallèle de tout autre chantier) :
      `docs/decision/PROMPT-passe-A-insuline-sans-capteur.md` · modèle: Opus, effort: xhigh · plan: —
- [ ] **Passe B — sécurité à l'effort (nœud `rhd-activite-physique`)** : même statut, cadrage au même
      endroit (`ARBITRAGES-2026-07-27-nuit.md` §1) · modèle: Opus, effort: high · plan: —

## Plan P7 — en cours (cadré 2026-07-29)

> Encode les cinq arbitrages tranchés par Thibault en session dédiée le 2026-07-29. Aucune recherche
> EBM nouvelle : les décisions sont rendues, ce plan les met dans le contenu et dans l'écran. Même
> nature que P5. Détail : `plans/P7/index.md`.

- [ ] T-048 — Frontière `a_l_objectif`/`sous_objectif` : compléter le pré-remplissage K6/D28 (écart
      ≤ −1 → `sous_objectif`, qui déclenche la déprescription ; entre −1 et 0 → `a_l_objectif` ; les
      deux bandes au-dessus inchangées) · modèle: Sonnet, effort: high · plan: → plans/P7/SA1.md
- [ ] T-049 — Seuil rénal AR GLP-1 : seuil de déclenchement maintenu à `DFG < 30` (il marque la
      disparition du socle metformine, pas la sécurité de la classe — confirmé référent 2026-07-29) +
      alerte de prudence sous 15 mL/min (RCP : pas de CI formelle, peu étudié) · modèle: Sonnet,
      effort: high · plan: → plans/P7/SA1.md
- [ ] T-050 — « Optimiser l'agent mal toléré » conditionné à `traitements_en_cours` non vide ·
      modèle: Sonnet, effort: high · plan: → plans/P7/SA1.md
- [ ] T-051 — Badge distinct pour une option `role: securite` triée en tête (ne porte plus
      « Recommandée », pensé pour un choix d'agent) · modèle: Sonnet, effort: medium · plan: →
      plans/P7/SB1.md
- [ ] T-052 — Signalement de validité de l'HbA1c (anémie, cirrhose, hémoglobinopathie) via `cadrage`
      D24, sur les nœuds qui la lisent · modèle: Sonnet, effort: medium · plan: → plans/P7/SA2.md
- [ ] T-053 — Doctrine : consigner les arbitrages du 2026-07-29 dans `DECISIONS.md`, y compris ceux
      tranchés sans action · modèle: Sonnet, effort: medium · plan: → plans/P7/SA2.md
- [ ] T-054 — Recette navigateur locale des quatre changements · modèle: Claude + navigateur,
      effort: medium, env: Desktop · plan: → plans/P7/S2.md

## Backlog — arbitrages référent tranchés le 2026-07-29, sans action (clos)

- Portée clinique de la dette `prescription`/patient naïf (T-018) : **garder l'état actuel** — ne
  jamais présumer qu'un traitement n'est pas en cours reste la position de sécurité.
- Asymétrie iSGLT2/AR GLP-1 chez le sujet dénutri : **garder l'asymétrie** — différence pharmacologique
  jugée réelle par le référent.
- Statut `brouillon`/`valide` sur l'écran de décision : **non**, reste sur la page Méthode seule.
- Réserve mineure résiduelle du CTA mobile (P6) : **laisser tel quel**, aucun usage ordinaire ne la
  déclenche.
- `docs/decision/sources/prescrire 12.pdf` : **n'existe pas** — référence retirée de
  `docs/decision/sources/prescrire-dt2.md` (entrée P12).
- **Descendre à la molécule et à la dose** hors du nœud `insuline` : **doctrine, pas un chantier** — au
  cas par cas quand c'est cliniquement décisif (ex. dose d'insuline, déjà fait), jamais une extension
  systématique à tout le domaine.

## Backlog — validation clinique finale (D5, passage à `statut: valide`)

- [ ] `prescription`, `insuline`, `rhd-alimentation`, `rhd-activite-physique` : relecture référent de
      bout en bout sur le déployé, condition du passage à `valide`. Les vignettes RHD écrites le
      2026-07-27 verrouillent des arbitrages déjà rendus (statut documenté en tête de
      `evaluateNode.rhd-alimentation.test.ts`/`evaluateNode.rhd-activite-physique.test.ts`) — elles ne
      remplacent pas cette relecture patient par patient. **Thibault a demandé de programmer une
      session dédiée prochainement (2026-07-29)** — reste à caler, pas encore fait.

## Backlog (P2 — Validation systémique DT2, cohérence inter-nœuds) — couvert autrement, coché avec renvoi

> Méthode d'origine : `docs/decision/VALIDATION_COHERENCE.md`. Cadrage T-013→T-017 jamais exécuté tel
> quel — **tranché par Thibault le 2026-07-29** : coché avec renvoi plutôt que retiré, l'objet ayant été
> couvert dans les faits par les chantiers 2026-07-26/27 (red-team clinique par nœud, bancs de
> vignettes, rapports `verif-finale-*`), par un chemin différent de celui cadré dans `plans/P2/`.

- [x] T-013 — Red-team données EBM inter-nœuds → couvert par le red-team clinique nœud par nœud
      (2026-07-26/27, `docs/decision/validation/chantier-2026-07-27/`) · plan: → plans/P2/S3.md
- [x] T-014 — Banc de vignettes + confrontation des trajectoires → couvert par les bancs de vignettes
      par nœud (`engine/banc/`) · plan: → plans/P2/S4.md
- [x] T-015 — Red-team contradictoire (personas hostiles) → couvert par les passes de recette
      « praticien naïf » (2026-07-28) · plan: → plans/P2/S5.md
- [x] T-016 — Vérification adversariale des findings → couvert par les vérifications bi-agents des
      nœuds C/D/E/F/H (2026-07-23/24) · plan: → plans/P2/S6.md
- [x] T-017 — Rapport de validation + registres de défendabilité → couvert par les rapports
      `verif-finale-*`/`BILAN-*` par nœud, pas un rapport systémique unique · plan: → plans/P2/S7.md

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
