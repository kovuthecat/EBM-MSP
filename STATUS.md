# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session. L'historique (comment on est arrivé ici) vit dans
`git log`, `DECISIONS.md`/`docs/decisions/` et les changelogs de contenu — pas ici.
Plafond : 80 lignes (appliqué par hook).

> **Dernière mise à jour :** 2026-07-29

## Ce qui existe

**Module Décision, domaine DT2 — déployé et utilisé en consultation** (ebm-msp.vercel.app). Module
Veille : **non commencé** (aucun code, `DECISIONS.md` D8 garde la place).

**6 nœuds de contenu**, tous `content/noeuds/diabete-type-2/*.yaml` :

| nœud | statut | dernière version |
| --- | --- | --- |
| `cible-glycemique` | `valide` | v2.6 |
| `statine` | `brouillon` | v1.15 |
| `prescription` | `brouillon` | v0.35 |
| `insuline` | `brouillon` | v0.26 |
| `rhd-alimentation` | `brouillon` | v0.8 |
| `rhd-activite-physique` | `brouillon` | v0.7 |

Passage à `valide` conditionné à la relecture référent finale (`TASKS.md` §validation clinique).

**Banc de tests** (`src/features/decision/engine/banc/`) : non-régression du contenu en 3 couches
(vignettes, couverture, invariants). **826 tests, 11 skip, typecheck et build verts.**

## Chantier actif

**Plan P7** (cadré 2026-07-29) : encode 5 arbitrages référent déjà tranchés (seuils
`a_l_objectif`/`sous_objectif`, seuil rénal AR GLP-1, badge sécurité, validité HbA1c,
« optimiser l'agent mal toléré »). Aucune recherche EBM nouvelle. Détail : `plans/P7/index.md`.

## Ce qui casse / n'est pas testé

- Onglet **« Veille » rend une page blanche** (texte `top: 0` caché sous la nav fixe) — mécanique, non cadré.
- **`GAJ` (nœud `insuline`) reste réclamé même quand `mcg_disponible` est coché** — masquage manquant, cf. `TASKS.md`.
- CTA flottant mobile (P6) : réserve mineure résiduelle, usage ordinaire ne la déclenche pas — laissé tel quel (référent, 2026-07-29).

## Bugs connus

- Nœud `prescription` : `traitements_en_cours` en citation négative ne peut pas recevoir
  `presomption_non` (dette D30, tracée dans `engine/banc/impasse.test.ts`).

## Dette technique / recherche bloquante

- **Passe A — insuline sans capteur** (bloquant l'usage, `modèle: Opus, effort: xhigh`) : prompt de
  démarrage prêt, `docs/decision/PROMPT-passe-A-insuline-sans-capteur.md`.
- **Passe B — sécurité à l'effort** (`rhd-activite-physique`, `modèle: Opus, effort: high`).
- **Validation clinique référent finale** (`prescription`, `insuline`, RHD ×2 → `statut: valide`) :
  session dédiée à programmer, cf. `TASKS.md`.

## Comment vérifier l'état réel

```bash
npm test          # 826 tests attendus, 11 skip
npx tsc --noEmit
npm run build
```
