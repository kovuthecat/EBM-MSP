# TASKS.md — ebm-msp

Index du **backlog** : ce qu'il reste à faire. Plafond : 60 lignes (hook). `plans/P<n>/` (Décision) ou
`plans/PV<n>/` (Veille) n'est créé qu'au **démarrage** du plan. **Frontières** — TASKS : le *quoi* qui
reste · `plans/…/index.md` : l'*avancement* · `STATUS.md` : l'état actuel · `VALIDATION.md` : le
jugement visuel en attente. **Non planifiée** : `- [ ] T-ID — titre · modèle: X, effort: Y` ; **dans un
plan** (statut dans son `index.md`) : `- T-ID — titre · → plans/…/S<k>.md`. Modèles/efforts :
`WORKFLOW.md` §2-3 ; `env: Desktop` si le navigateur in-app est requis (N1).

## Plan P7 — ouvert (statut/détail : `plans/P7/index.md`)

- T-052/T-053 — Validité HbA1c (cadrage) → plans/P7/SA2.md · T-054 — recette locale → S2.md
  **Débloquée** : l'accroche chiffrée des blocs repliés est livrée (P12/S10).

## Backlog — né de P12 (2026-08-03), non cadré

- [ ] **T-120** — implication athérome ⇒ antécédent CV : STOP fondé, **abandonner ?** cf. `VALIDATION.md`.
- [ ] Alerte d'acidocétose euglycémique chez le patient **déjà** sous iSGLT2 qui devient dénutri
      (aujourd'hui elle ne se déclenche que si l'iSGLT2 est *proposé*) · Sonnet, low — arbitrage d'abord.
- [ ] Face visible de la carte iSGLT2 : elle porte `Preuve élevée` sans dire qu'elle est cardio-rénale
      (effet croisé S2×S5) · 3 pistes dans `VALIDATION.md` · Sonnet, low — arbitrage d'abord.
- [ ] Titre court par entrée de `cadrage` (schéma + 6 nœuds) : l'accroche compterait les contenus, pas les contenants · Sonnet, medium.
- [ ] Au retour sur un nœud, nommer les champs non repris (l'antécédent CV revient décoché en silence) · Sonnet, low.

## Plan PV1 — Veille, cadré 2026-07-31, pas démarré (statut/détail : `plans/PV1/index.md`)

- T-101 — Réorganiser l'arborescence : commun / décision / veille · → plans/PV1/S0.md
- T-089→T-093 — Doctrine (seuil, SOP v1.1, gabarits, D37-D43) + sources · → plans/PV1/S1-S2.md
- T-094/T-095 — Éditions `2026-W30` et `2026-W31` à la main + bilan de cadrage · → plans/PV1/S3-S4.md
- T-096→T-098 — Gel du modèle, écrans V1/V2, pont veille ↔ nœud · → plans/PV1/S5-S7.md
- T-099/T-100 — Page Méthode réalignée sur la SOP, consolidation · → plans/PV1/S8-S9.md

## Backlog — mécanique, exécutable sans arbitrage clinique

- [ ] Vérifier sur le déployé (N1) : T-032/T-033/T-034 (P5, jamais confirmés hors local) · Claude + navigateur, low, env: Desktop
- [ ] `lib/replierAffichage.ts` (P9/S1) lit le champ brut, pas l'état évalué (sans effet) · `PastilleInfo` : ton `attention` natif, puis retirer la surcharge CSS d'`OptionCard` · Sonnet, low
- [ ] Nœud `Traiter` : 6 sections, 5 « Suivant », >50 % des actions — re-cadrage (mesurer d'abord les champs visibles/section) · Opus, high
- [ ] Nœud `Alimentation` : 15 champs, jamais rempli en 2 recettes — re-cadrage · Opus, high

## Backlog — recherche clinique / arbitrage référent

- [ ] **Passe B — sécurité à l'effort** (`rhd-activite-physique`) · modèle: Opus, effort: high
- [ ] Motif du repli statine : ASCVD peut l'atteindre via l'exclusion dialyse (HAUTE-4) — arbitrage référent avant d'écrire un texte (P10, non traité).
- [ ] `prescription.yaml` AR GLP-1 : « préférer le sémaglutide oral » (Rybelsus, avis HAS défavorable 2021, quasi indisponible) — phrase trompeuse (P10/S7), non corrigée.

## Backlog — validation clinique finale (D5, passage à `statut: valide`)

- [ ] `prescription`, `insuline`, `rhd-alimentation`, `rhd-activite-physique` : relecture référent de bout
      en bout sur le déployé. Session dédiée demandée, pas encore calée.

## Backlog (Phases suivantes — non cadré)

- [ ] Veille V3 (profil) / V4 (« pour mémoire ») en `localStorage`, puis comptes Supabase + RGPD (D37).
- [ ] Première édition **live** `2026-W32` (lundi 03/08), après PV1 — cadence fixée par la SOP.
- [ ] T-019 (reliquat P3) — catalogue formel des critères `partage` (en grande partie livré par D28).

## Archivage

Supprimer la ligne d'une tâche dès que son plan est clos (historique : `git log`/`STATUS.md`). Purgé 2026-07-30 : P7 T-048→T-051, P8 T-055→T-066, P9 T-068→T-077 · 2026-07-31 : items Veille + « Veille page blanche » (→ PV1/S6) · 2026-08-01 : P10 T-078→T-088 · 2026-08-02 : P11 T-102→T-118 · 2026-08-03 : P12 T-067 + T-119→T-136 (T-120 non livrée, remontée en backlog), clôture de P8.
