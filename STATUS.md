# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session. L'historique (comment on est arrivé ici) vit dans
`git log`, `DECISIONS.md`/`docs/commun/decisions/` et les changelogs de contenu — pas ici.
Plafond : 80 lignes (appliqué par hook).

> **Dernière mise à jour :** 2026-08-02

## Ce qui existe

**Module Décision, domaine DT2 — déployé et utilisé en consultation** (ebm-msp.vercel.app). Module
Veille : **non commencé** (aucun code, `DECISIONS.md` D8 garde la place).

**6 nœuds de contenu**, tous `content/decision/noeuds/diabete-type-2/*.yaml` :

| nœud | statut | dernière version |
| --- | --- | --- |
| `cible-glycemique` | `valide` | v2.11 |
| `statine` | `brouillon` | v1.20 |
| `prescription` | `brouillon` | v0.45 |
| `insuline` | `brouillon` | v0.37 |
| `rhd-alimentation` | `brouillon` | v0.11 |
| `rhd-activite-physique` | `brouillon` | v0.11 |

Passage à `valide` conditionné à la relecture référent finale (`TASKS.md` §validation clinique).

**Banc de tests** (`src/features/decision/engine/banc/`) : non-régression du contenu en 3 couches
(vignettes, couverture, invariants). **980 tests, 11 skip, typecheck et build verts.**

## Chantier actif

**Plan P11 — clos et poussé 2026-08-02** (langage visuel maquette, module Décision) : S1-S10 livrées
(icônes D44, carte compacte D45, largeur d'écran D46). Recette S8 sans défaut N1 mais **DOM/console
seule** (captures impossibles) : carte tient-elle sur une ligne (arrêt S6, 960-1050px) **non vérifié
au pixel**, cf. `TASKS.md`. N2 en attente, cf. `VALIDATION.md`.

**Plan P10 : clos le 2026-08-01** (S1-S11 livrées, vérifiées N0 + N1, pas encore commitées/poussées).
Les branches de condition n'affichent plus que ce qui est vrai pour le patient, un motif rédigé peut
remplacer une branche illisible, les options non retenues se lisent en énumération négative, six nœuds
portent désormais un `cadrage` disant ce qu'ils ignorent, iSGLT2/AR GLP‑1 descendent à la molécule et à
la dose (sourcé RCP), l'infobulle « Risque hypoglycémique du schéma » est posée. Deux sessions (S8, S10)
concluent par un STOP documenté plutôt qu'un changement (aucune source FR sur la vitesse de désescalade
insuline ; l'ordre des familles ne peut pas être rendu générique sans notion nouvelle de contenu) —
cf. `TASKS.md`. Relecture référent (N2) en attente, cf. `VALIDATION.md`.

**Plan PV1 — module Veille, cadré le 2026-07-31, pas démarré** (`plans/PV1/index.md`) : 10 sessions,
deux éditions hebdomadaires produites **à la main** (`2026-W30`, `2026-W31`, en rétrospectif) avant
tout code, puis gel du modèle et câblage V1/V2. Les plans Veille sont préfixés `PV`.

**Plan P7** (cadré 2026-07-29, toujours ouvert) : il manque SA2 (validité HbA1c) et S2 (recette) —
détail : `plans/P7/index.md`.

**Plan P8** : quasi clos le 2026-07-30 (S1-S8 livrées, vérifiées N0+N1, commitées). **S9/T-067
(« réduire la basale », chiffrée) reste ouverte** — aucune carte dédiée encodée, cf. `TASKS.md`.

## Ce qui casse / n'est pas testé

- Onglet **« Veille » rend une page blanche** (texte `top: 0` caché sous la nav fixe) — mécanique, non cadré.
- **`GAJ` (nœud `insuline`) reste réclamé même quand `mcg_disponible` est coché** — masquage manquant, cf. `TASKS.md`.
- CTA flottant mobile (P6) : réserve mineure résiduelle, usage ordinaire ne la déclenche pas — laissé tel quel (référent, 2026-07-29).
- **Suggestion d'espérance de vie (T-061) ne se retrigger pas après « Reprendre les valeurs de ce patient »** (T-057) : repart « en attente » au lieu de recalculer (cf. `docs/decision/validation/recette-P8-2026-07-30.md`).

## Bugs connus

- Nœud `prescription` : `traitements_en_cours` en citation négative ne peut pas recevoir
  `presomption_non` (dette D30, tracée dans `engine/banc/impasse.test.ts`).

## Dette technique / recherche bloquante

- **Passe B — sécurité à l'effort** (`rhd-activite-physique`, `modèle: Opus, effort: high`).
- **Validation clinique référent finale** (`prescription`, `insuline`, RHD ×2 → `statut: valide`) :
  session dédiée à programmer, cf. `TASKS.md`.

## Comment vérifier l'état réel

```bash
npm test          # 980 tests attendus, 11 skip
npm run typecheck # npx tsc --noEmit seul est factice (tsconfig.json en `files: []`, 0 fichier compilé)
npm run build
```
