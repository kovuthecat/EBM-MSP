# VALIDATION.md — jugement humain en attente (N2 uniquement) — ebm-msp

> **Ce fichier ne contient que du N2** : jugement esthétique/UX/ton/clinique. Tout ce qu'un navigateur
> peut constater seul est du **N1** — vérifié par Claude, jamais consigné ici. Cf. `WORKFLOW.md` §6.
> Plafond : 60 lignes (hook, `.claude/workflow/hooks/plafonds.json`). Légende : `[ ]` à valider ·
> `[x]` OK · `[!]` à corriger. Un bloc par écran/thème courant, état actuel uniquement — un écran
> réécrit **remplace** ses anciens critères. Le détail de chaque point vit dans le
> `plans/P<n>/S<k>.md` qui l'a produit.
>
> **Archive du 2026-08-07** (purge de plafond, P14/S12) — 3 blocs déplacés, rien de supprimé :
> `docs/decision/validation/VALIDATION-archive-2026-08-07.md`.
> **Routage du 2026-09-24** (plafond ramené à 60) — le détail du module Décision vit dans
> `docs/decision/VALIDATION.md`, déplacé tel quel ; ci-dessous, le sommaire de ce qui y reste ouvert.
> Un point tranché se supprime là-bas **et** sa ligne de sommaire se met à jour ici.

## Module Décision — 23 points en attente → [`docs/decision/VALIDATION.md`](docs/decision/VALIDATION.md)

- [ ] **Contenu clinique écrit par P12 — 5 points, la relecture la plus importante** : aperçus de
      déprescription (T-126), alerte d'acidocétose euglycémique (T-127), 17 motifs rédigés (T-125),
      carte « Réduire la basale » (T-067), coupes d'intitulés (T-121).
- [!] **À rouvrir ? L'arbitrage de descente de dose du 2026-07-30 reposait sur une prémisse fausse**
      (HAS 2024 R.87 et SFD 2025 Avis 18 chiffrent la descente) — contenu déjà corrigé.
- [ ] **Écran de décision — présentation, 5 points** : CTA flottant jusqu'à 1199 px (D47), « Ce que
      dit la preuve » (T-135), carte unique dépliée (T-136), IMC calculé (T-133), mot
      « Indisponible » (T-134).
- [!] **Carte iSGLT2 sans sa raison d'être sur la face visible** — trois pistes au backlog.
- [ ] **Plan P13 — 6 points** : classement « Commencez par… » (T-140), restauration silencieuse
      (T-143), partage de `risque_hypoglycemie_schema` (T-147), intitulé CK > 50 N (T-153),
      auto-avance (T-156), noms de critères au compteur de session (T-159).
- [ ] **Passe de rédaction des 4 niveaux — 2 points** : textes des 6 nœuds réécrits, 13 arbitrages
      en attente.
- [ ] **Plan P14 — 3 points** : règles R13/R14/R15 (T-182), amendements P1/P5/P6 du procédé (T-183),
      décisions D52 → D58 (T-184, **point le plus important** : la formulation écrite dit-elle ce qui a
      été tranché oralement ?).

## Plan P16 — refonte des skills de recherche, clos 2026-09-24 — 2 points

> Les items N2 de S2 (résultats attendus du corpus) et S3 (mémo `ARBITRAGE-construire-un-module.md`)
> sont déjà validés par le référent, commit `0a0f23f` — non repris ici.

- [ ] **S10/T19 — rapport de mesure finale (partiel)** : `docs/commun/epreuves-recherche/mesures/2026-09-24-finale/rapport.md`.
      Le référent juge si l'arrêt de coût (56,62 $, plafond atteint) et l'exclusion du circuit Veille
      (non mesuré) appellent une reprise immédiate ou une décision différée. Non bloquant.
- [ ] **S11/T21 — skill `construire-module-decision`** : le référent l'essaie sur une vraie demande de
      nouveau thème ; attendu qu'elle aiguille juste, sans produire de contenu clinique à sa place.
      Facultatif : relire les attendus des huit épreuves M01-M08 (case en bas de
      `docs/commun/epreuves-recherche/cas-module/README.md`).
