# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session. L'historique (comment on est arrivé ici) vit dans
`git log`, `DECISIONS.md`/`docs/commun/decisions/` et les changelogs de contenu — pas ici.
Plafond : 80 lignes (appliqué par hook).

> **Dernière mise à jour :** 2026-08-05

## Ce qui existe

**Module Décision, domaine DT2 — déployé et utilisé en consultation** (ebm-msp.vercel.app). Module
Veille : **non commencé** (aucun code, `DECISIONS.md` D8 garde la place).

**6 nœuds de contenu**, tous `content/decision/noeuds/diabete-type-2/*.yaml` :

| nœud | statut | dernière version |
| --- | --- | --- |
| `cible-glycemique` | `valide` | v2.15 |
| `statine` | `brouillon` | v1.27 |
| `prescription` | `brouillon` | v0.64 |
| `insuline` | `valide` | v0.49 |
| `rhd-alimentation` | `brouillon` | v0.15 |
| `rhd-activite-physique` | `brouillon` | v0.17 |

Passage à `valide` conditionné à la relecture référent finale (`TASKS.md` §validation clinique).

**Banc de tests** (`src/features/decision/engine/banc/`) : non-régression du contenu en 3 couches
(vignettes, couverture, invariants) + **I25, aucun jargon de projet dans un champ affiché**.

## Chantier actif

**Plan P13 — clos le 2026-08-05** (suites de la revue de conception du 2026-08-04) : S1-S5, S7, S8
livrées. **S6 non livrée** (`exports`, T-149/T-150) : STOP légitime, ajouter `exports` au schéma exige
de toucher `engine/expressionsNoeud.ts` (G1), hors mandat — conception prête, `TASKS.md`. **N1 déféré**
sur la majorité des tâches (navigateur in-app indisponible pendant l'exécution), compensé par des tests
RTL/jsdom — à rejouer avant clôture visuelle. Bilan : `plans/P13/index.md` §Bilan. N2 : `VALIDATION.md`.

**Plan P12 — clos le 2026-08-03** : S1-S10 livrées ; seule **T-120** non livrée, STOP fondé (`plans/P12/index.md`).

**Plan PV1 — module Veille, cadré le 2026-07-31, pas démarré** (`plans/PV1/index.md`) : 10 sessions, deux
éditions hebdomadaires produites **à la main** avant tout code, puis gel du modèle et câblage.

**Plan P7** (cadré 2026-07-29, ouvert) : manquent SA2 (validité HbA1c) et S2. **P8 — clos** (S1-S8).

**Argumentaire — deux passes hors plan.** *2026-08-04 (D48)* : l'écran ne cite plus que des sources
primaires, dans un panneau « État des preuves ». *2026-08-05* : les 4 niveaux de lecture des 6 nœuds relus
puis corrigés — cartes sourcées 40 → 65/84, délais de bénéfice 6 → 17, panneaux posologie 16 → 34,
contradictions entre niveaux levées, I25 gagne 7 marqueurs (**D49**). Aucune dette ni exemption.
Arbitrages en attente : `docs/decision/validation/passe-redaction-2026-08-05.md`.

## Ce qui casse / n'est pas testé

- Onglet **« Veille » rend une page blanche** — mécanique, non cadré (appartient à PV1/S6).
- CTA flottant mobile : depuis **D47**, visible jusqu'à 1199 px (contre 959) — donc sur des fenêtres de bureau non maximisées. Jugement d'usage en attente, `VALIDATION.md`.
- **I24 ne scanne que `conditions`/`prerequis`, pas `exclusions`** : 8 motifs négatifs sur `statine.yaml` en attente (P13/S7, T-152), exemptés nommément.
- **2 tests rouges, aucun lié au contenu** : `couverture.test.ts`/`prescription` (angle mort du banc, diagnostic dans `engine/banc/profils.ts`) et `grammaire.test.ts` (champ `icone` de T-149 non classé).

## Bugs connus

- Nœud `prescription` : `traitements_en_cours` en citation négative ne peut pas recevoir
  `presomption_non` (dette D30, tracée dans `engine/banc/impasse.test.ts`).

## Dette technique / recherche bloquante

- **Passe B — sécurité à l'effort** (`rhd-activite-physique`, `modèle: Opus, effort: high`).
- **Validation clinique référent finale** (`prescription`, RHD ×2 → `statut: valide`) : à programmer.
- **Albuminurie non convertie** : `derive` ne sait produire qu'un booléen ou un nombre, jamais un
  libellé — le praticien saisit toujours une catégorie là où son labo rend un ratio A/C.
- **`terrain_fragile` déclaré DEUX FOIS avec des définitions différentes** (`insuline` sans
  `hypo_severe_recurrente`, `prescription` avec) — I4 ne le voit pas (vérifié par nœud). À arbitrer.
- **Contrainte de schéma à rendre opposable** (D48) : « `divergences` non vide si `divergence: true` »
  est vraie sur les 6 nœuds, peut être posée.

## Comment vérifier l'état réel

```bash
npm test          # mesurer MACHINE LIBRE : sous charge, le banc de sécurité rend des verdicts au hasard
npm run typecheck # `npx tsc --noEmit` seul est factice (tsconfig.json en `files: []`, 0 fichier)
npm run build
```
