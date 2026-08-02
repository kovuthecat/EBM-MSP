# TASKS.md — ebm-msp

Index du **backlog** : ce qu'il reste à faire. Plafond : 60 lignes (hook). `plans/P<n>/` (Décision) ou
`plans/PV<n>/` (Veille) n'est créé qu'au **démarrage** du plan. **Frontières** — TASKS : le *quoi* qui
reste · `plans/…/index.md` : l'*avancement* · `STATUS.md` : l'état actuel · `VALIDATION.md` : le
jugement visuel en attente. **Non planifiée** : `- [ ] T-ID — titre · modèle: X, effort: Y` ; **dans un
plan** (statut dans son `index.md`) : `- T-ID — titre · → plans/…/S<k>.md`. Modèles/efforts :
`WORKFLOW.md` §2-3 ; `env: Desktop` si le navigateur in-app est requis (N1).

## Plan P12 — suites de la recette praticien naïf du 2026-08-02 (statut : `plans/P12/index.md`)

- T-119/T-120 — La cible d'HbA1c cesse de changer toute seule · → plans/P12/S1.md
- T-121 — Intitulés : le motif sort du titre · → S2.md · T-122/T-123 — Seuil deux colonnes · → S3.md
- T-067 — Branche AGP appariée (reprise de P8/S9) · → S4.md · T-124/T-125 — Groupes, motifs · → S5.md
- T-126/T-127 — 11 aperçus de déprescription + alerte préventive acidocétose iSGLT2 · → S6.md
- T-128→T-132 — Propreté (bulle, garde-fou, RHD, jargon, statine) · → S7.md
- T-133 — Dérivés numériques (IMC, CK, A/C) · → S8.md · T-134 — « Indisponible » · → S9.md
- T-135/T-136 — Accroche chiffrée sur les blocs repliés, carte unique dépliée · → S10.md

## Plans P7 et P8 — ouverts (statut/détail : `plans/P7/index.md`, `plans/P8/index.md`)

- T-052/T-053 — Validité HbA1c (cadrage, **après P12/S10**) → plans/P7/SA2.md · T-054 → S2.md
- P8 : S1-S8 livrées ; **T-067 reprise par P12/S4** — clore P8 à la consolidation de P12

## Plan PV1 — Veille, cadré 2026-07-31, pas démarré (statut/détail : `plans/PV1/index.md`)

- T-101 — Réorganiser l'arborescence : commun / décision / veille · → plans/PV1/S0.md
- T-089→T-093 — Doctrine (seuil, SOP v1.1, gabarits, D37-D43) + sources · → plans/PV1/S1-S2.md
- T-094/T-095 — Éditions `2026-W30` et `2026-W31` à la main + bilan de cadrage · → plans/PV1/S3-S4.md
- T-096→T-098 — Gel du modèle, écrans V1/V2, pont veille ↔ nœud · → plans/PV1/S5-S7.md
- T-099/T-100 — Page Méthode réalignée sur la SOP, consolidation · → plans/PV1/S8-S9.md

## Backlog — mécanique, exécutable sans arbitrage clinique

- [ ] Vérifier sur le déployé (N1) : T-032/T-033/T-034 (P5, jamais confirmés hors local) · Claude + navigateur, low, env: Desktop
- [ ] `lib/replierAffichage.ts` (P9/S1) lit le champ brut, pas l'état évalué — sans effet actuel · Sonnet, low
- [ ] `PastilleInfo` : ton `attention` natif à ajouter, puis retirer la surcharge CSS d'`OptionCard` · Sonnet, low
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

Supprimer la ligne d'une tâche dès que son plan est clos (historique : `git log`/`STATUS.md`). Purgé 2026-07-30 : P7 T-048→T-051, P8 T-055→T-066, P9 T-068→T-077 · 2026-07-31 : items Veille + « onglet Veille page blanche » (→ PV1/S6) · 2026-08-01 : P10 T-078→T-088 · 2026-08-02 : P11 T-102→T-118.
