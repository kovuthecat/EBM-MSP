# Plan P5 — Ce que la clôture de P4 a mis au jour, volet mécanique   (rédigé par l'orchestrateur, 2026-07-28)

## Objectif d'ensemble

Corriger les trois défauts trouvés par la passe de contrôle P4 (S8) et la recette « praticien naïf »
complémentaire, classés par Thibault comme **exécutables sans arbitrage clinique** — cf.
`docs/decision/validation/BILAN-P4-2026-07-28.md` §6 « Exécutable sans arbitrage clinique ». Aucun des
trois ne touche au contenu clinique des nœuds DT2 hors une seule ligne `visible_si` (S2).

Source : `docs/decision/validation/BILAN-P4-2026-07-28.md` §2, §2bis, §3bis, §6.

## Ce que ce plan NE fait pas

- Ne traite **aucune** des décisions référent encore ouvertes (`TASKS.md` §Backlog — arbitrages référent :
  dette `prescription`/naïf, asymétrie iSGLT2/AR GLP-1, validité HbA1c, carte « Optimiser l'agent mal
  toléré », granularité molécule/dose, statut brouillon/valide à l'écran).
- Ne traite **pas** la passe de recherche A (nœud `insuline` sans capteur, pivot de décision + 4 créneaux
  horaires) au-delà de son volet strictement mécanique (S2 ci-dessous) — le pivot clinique et les seuils
  restent `TASKS.md`.
- N'adopte **pas** la maquette `design/maquettes/Maquette upgrade UI.zip` : elle reste un chantier à part,
  à discuter (elle déplace les contre-indications en infobulle au survol, en tension avec T-025 tout juste
  livré).
- Ne réinitialise **pas** silencieusement un champ masqué (D-12/`reinitialiserChampsMasques`, requalifié
  par la recette praticien naïf) : le mécanisme existant est intentionnel (D9/R8), le rendre plus visible
  est un sujet de design non tranché, hors périmètre de ce plan.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-032 | Un champ segmenté peut revenir à « non répondu » (tous nœuds) | Sonnet | medium | — | `src/features/decision/components/CriteriaForm.tsx` | [x] |
| [S2](S2.md) | T-033 | `mcg_disponible == false` masque les 4 champs de capteur (`insuline`) | Sonnet | medium | — | `content/noeuds/diabete-type-2/insuline.yaml` | [x] |
| [S3](S3.md) | T-034 | Retour visuel après la purge « Nouveau patient » | Sonnet | low | — | `src/features/shared/layout/Header.tsx`, `Header.css` | [x] |

## Ordonnancement

- **Vague 1 — parallélisable** : **S1** · **S2** · **S3**. Zones disjointes (`CriteriaForm.tsx` ⊥
  `insuline.yaml` ⊥ `Header.*`), aucune dépendance entre elles.
- **Vague 2 — contrôle** : recette navigateur ciblée sur les trois correctifs (pas un protocole complet
  comme P4/S8 — trois scénarios précis, cf. chaque `S<k>.md` §Validation). À exécuter par Thibault via
  Claude Code Desktop, comme pour P4/S8.
- **Vague 3 — consolidation** : commits tâche par tâche, statuts, `STATUS.md`, `TASKS.md`, `VALIDATION.md`,
  push — cf. `WORKFLOW.md` §4d.

## Le fil rouge

Les trois défauts ont la même origine : un geste que le praticien croit réversible ou visible ne l'est
pas. Une valeur cliniquement fausse posée par erreur ne peut pas être retirée (S1). Un champ impossible à
renseigner reste réclamé (S2). Un geste destructif ne dit pas s'il a agi (S3).

## Clôture (2026-07-28)

Plan soldé — S1→S3 exécutées, tout vert (802 tests, tsc, build), commits `bc59e2a`, `7657f4a`,
`806fdb9`. S2 a trouvé et corrigé une régression de second ordre non anticipée par le cadrage (trois
options d'`insuline` lisaient encore les 4 champs de capteur sans le garde composé) — motif R8, même
travail que P4/S9. **Vague 2 (contrôle navigateur) volontairement sautée** sur décision de Thibault
(chantier plus contenu que P4, poussé directement) : à vérifier après coup sur le déployé si besoin,
scénarios listés dans `VALIDATION.md`.
