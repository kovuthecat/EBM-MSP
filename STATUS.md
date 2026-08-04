# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session. L'historique (comment on est arrivé ici) vit dans
`git log`, `DECISIONS.md`/`docs/commun/decisions/` et les changelogs de contenu — pas ici.
Plafond : 80 lignes (appliqué par hook).

> **Dernière mise à jour :** 2026-08-04

## Ce qui existe

**Module Décision, domaine DT2 — déployé et utilisé en consultation** (ebm-msp.vercel.app). Module
Veille : **non commencé** (aucun code, `DECISIONS.md` D8 garde la place).

**6 nœuds de contenu**, tous `content/decision/noeuds/diabete-type-2/*.yaml` :

| nœud | statut | dernière version |
| --- | --- | --- |
| `cible-glycemique` | `valide` | v2.12 |
| `statine` | `brouillon` | v1.23 |
| `prescription` | `brouillon` | v0.60 |
| `insuline` | `brouillon` | v0.44 |
| `rhd-alimentation` | `brouillon` | v0.12 |
| `rhd-activite-physique` | `brouillon` | v0.13 |

Passage à `valide` conditionné à la relecture référent finale (`TASKS.md` §validation clinique).

**Banc de tests** (`src/features/decision/engine/banc/`) : non-régression du contenu en 3 couches
(vignettes, couverture, invariants) + **I25, aucun jargon de projet dans un champ affiché**.

## Chantier actif

**Plan P12 — clos le 2026-08-03** (suites de la recette praticien naïf du 2026-08-02) : S1-S10 livrées.
Une seule tâche non livrée, **T-120**, STOP fondé — cf. `plans/P12/index.md` §Bilan de clôture.
N2 : `VALIDATION.md`.

**Plan PV1 — module Veille, cadré le 2026-07-31, pas démarré** (`plans/PV1/index.md`) : 10 sessions, deux
éditions hebdomadaires produites **à la main** avant tout code, puis gel du modèle et câblage.

**Plan P7** (cadré 2026-07-29, ouvert) : manquent SA2 (validité HbA1c) et S2. **P8 — clos** (S1-S8).

**Refonte de l'argumentaire (2026-08-04, hors plan — retour de recette navigateur, **D48**)** : l'écran
ne cite plus que des sources primaires (les revues secondaires sortent du modèle) ; les divergences avec
la recommandation officielle se lisent en trois faces comparables ; les incertitudes se fondent sur la
donnée ou son absence, jamais sur qui a tranché ; deux champs jusque-là **jamais rendus** le sont —
`Noeud.argumentaire` (« Comment ce nœud raisonne ») et `Option.references`, dans un panneau « État des
preuves » que le badge de niveau de preuve ouvre. **Propagé aux 6 nœuds** et à l'écran « Méthode » ;
aucune dette, I25 (`jargon-projet.test.ts`) porte 9 marqueurs sans exemption.

## Ce qui casse / n'est pas testé

- Onglet **« Veille » rend une page blanche** — mécanique, non cadré (appartient à PV1/S6).
- CTA flottant mobile : depuis **D47** il apparaît jusqu'à 1199 px de large (contre 959 px avant),
  donc sur des fenêtres de bureau non maximisées. Jugement d'usage en attente, cf. `VALIDATION.md`.

## Bugs connus

- Nœud `prescription` : `traitements_en_cours` en citation négative ne peut pas recevoir
  `presomption_non` (dette D30, tracée dans `engine/banc/impasse.test.ts`).

## Dette technique / recherche bloquante

- **Passe B — sécurité à l'effort** (`rhd-activite-physique`, `modèle: Opus, effort: high`).
- **Validation clinique référent finale** (`prescription`, `insuline`, RHD ×2 → `statut: valide`) :
  session dédiée à programmer, cf. `TASKS.md`.
- **Albuminurie non convertie** : `derive` ne sait produire qu'un booléen ou un nombre, jamais un
  libellé d'énumération — le praticien saisit toujours une catégorie là où son labo rend un ratio A/C.
- **`terrain_fragile` déclaré DEUX FOIS avec des définitions différentes** (`insuline` sans
  `hypo_severe_recurrente`, `prescription` avec) — ce que l'invariant I4 interdit, mais qu'il ne peut pas
  voir puisqu'il est vérifié par nœud. Trouvé pendant la propagation de D48. **À arbitrer** : soit
  `prescription` recueille l'antécédent et les deux convergent, soit son dérivé est renommé.
- **Contrainte de schéma à rendre opposable** (D48) : « `divergences` non vide quand `divergence: true` »
  est désormais vraie sur les 6 nœuds, la contrainte peut être posée.

## Comment vérifier l'état réel

```bash
npm test          # 1048 tests attendus, 11 skip — mesurer MACHINE LIBRE (aucun serveur de dev en
                  # cours) : le banc de sécurité rend des verdicts au hasard sous charge
npm run typecheck # `npx tsc --noEmit` seul est factice (tsconfig.json en `files: []`, 0 fichier)
npm run build
```
