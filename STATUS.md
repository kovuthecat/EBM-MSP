# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session. L'historique (comment on est arrivé ici) vit dans
`git log`, `DECISIONS.md`/`docs/decisions/` et les changelogs de contenu — pas ici.
Plafond : 80 lignes (appliqué par hook).

> **Dernière mise à jour :** 2026-07-30

## Ce qui existe

**Module Décision, domaine DT2 — déployé et utilisé en consultation** (ebm-msp.vercel.app). Module
Veille : **non commencé** (aucun code, `DECISIONS.md` D8 garde la place).

**6 nœuds de contenu**, tous `content/noeuds/diabete-type-2/*.yaml` :

| nœud | statut | dernière version |
| --- | --- | --- |
| `cible-glycemique` | `valide` | v2.7 |
| `statine` | `brouillon` | v1.17 |
| `prescription` | `brouillon` | v0.38 |
| `insuline` | `brouillon` | v0.34 |
| `rhd-alimentation` | `brouillon` | v0.9 |
| `rhd-activite-physique` | `brouillon` | v0.9 |

Passage à `valide` conditionné à la relecture référent finale (`TASKS.md` §validation clinique).

**Banc de tests** (`src/features/decision/engine/banc/`) : non-régression du contenu en 3 couches
(vignettes, couverture, invariants). **865 tests, 11 skip, typecheck et build verts.**

## Chantier actif

**Plan P9** (cadré 2026-07-30, pas démarré) : contre-indications vérifiables (schéma+moteur+ré-encodage
4 nœuds), purge du jargon de projet affiché au clinicien, titre de dépli, metformine (titration Ameli),
investigation « risque hypoglycémique du schéma ». Détail : `plans/P9/index.md`.

**Plan P7** (cadré 2026-07-29, toujours ouvert) : il manque SA2 (validité HbA1c) et S2 (recette) —
détail : `plans/P7/index.md`.

**Plan P8** : quasi clos le 2026-07-30 (S1-S8 livrées, vérifiées N0+N1, commitées). **S9/T-067
(« réduire la basale », chiffrée) reste ouverte** — aucune carte dédiée encodée, cf. `TASKS.md`.

## Ce qui casse / n'est pas testé

- Onglet **« Veille » rend une page blanche** (texte `top: 0` caché sous la nav fixe) — mécanique, non cadré.
- **`GAJ` (nœud `insuline`) reste réclamé même quand `mcg_disponible` est coché** — masquage manquant, cf. `TASKS.md`.
- CTA flottant mobile (P6) : réserve mineure résiduelle, usage ordinaire ne la déclenche pas — laissé tel quel (référent, 2026-07-29).
- **Suggestion d'espérance de vie (T-061) ne se retrigger pas après « Reprendre les valeurs de ce
  patient »** (frontière de re-entrée, T-057) : le nœud repart « en attente » sur ce seul critère au
  lieu de recalculer. Trouvé en recette P8 du 2026-07-30, non corrigé (cf. `docs/decision/validation/recette-P8-2026-07-30.md`).

## Bugs connus

- Nœud `prescription` : `traitements_en_cours` en citation négative ne peut pas recevoir
  `presomption_non` (dette D30, tracée dans `engine/banc/impasse.test.ts`).

## Dette technique / recherche bloquante

- **Passe B — sécurité à l'effort** (`rhd-activite-physique`, `modèle: Opus, effort: high`).
- **Validation clinique référent finale** (`prescription`, `insuline`, RHD ×2 → `statut: valide`) :
  session dédiée à programmer, cf. `TASKS.md`.

## Comment vérifier l'état réel

```bash
npm test          # 865 tests attendus, 11 skip
npx tsc --noEmit
npm run build
```
