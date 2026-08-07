# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session. L'historique (comment on est arrivé ici) vit dans
`git log`, `DECISIONS.md`/`docs/commun/decisions/` et les changelogs de contenu — pas ici.
Plafond : 80 lignes (appliqué par hook).

> **Dernière mise à jour :** 2026-08-07

## Ce qui existe

**Module Décision, domaine DT2 — déployé et utilisé en consultation** (ebm-msp.vercel.app). Module
Veille : **non commencé** (aucun code, `DECISIONS.md` D8 garde la place).

**6 nœuds de contenu**, tous `content/decision/noeuds/diabete-type-2/*.yaml` :

| nœud | statut | dernière version **committée** |
| --- | --- | --- |
| `cible-glycemique` | `valide` | v2.19 |
| `statine` | `brouillon` | v1.29 |
| `prescription` | `brouillon` | v0.64 — **P14 en attente, non commité (cf. Chantier actif)** |
| `insuline` | `valide` | v0.49 — **P14 en attente, non commité (cf. Chantier actif)** |
| `rhd-alimentation` | `brouillon` | v0.15 — **P14 en attente, non commité (cf. Chantier actif)** |
| `rhd-activite-physique` | `brouillon` | v0.17 — **P14 en attente, non commité (cf. Chantier actif)** |

Passage à `valide` conditionné à la relecture référent finale (`TASKS.md` §validation clinique).

**Banc de tests** (`src/features/decision/engine/banc/`) : non-régression du contenu en 4 couches
(vignettes, couverture, invariants, **relation** — paires co-actives + table des conditions, P14) + I25.

## Chantier actif

**Plan P14 — sessions closes le 2026-08-07, consolidation PARTIELLE** (neuf défauts relationnels + le
chantier P2, `plans/P14/index.md`) : 19 sessions + 2 arbitrages hors plan livrés, N0 vert sur l'arbre de
travail complet (1275 tests, 0 échec, aucun `it.fails` restant). **Commité** : les 7 invariants de
relation, le socle des critères communs de domaine (P2), la publication D50, le procédé/grammaire
amendés, D50/D52-D58, et le seul nœud de contenu propre (`cible-glycemique`). **NON commité** :
`insuline.yaml`, `prescription.yaml`, `rhd-alimentation.yaml`, `rhd-activite-physique.yaml` et ce qui en
dépend — découverts entrelacés, dans l'arbre de travail non commité, avec un second chantier hors P14 (la
contre-relecture des 4 niveaux d'argumentaire, cf. ligne suivante), sans séparation fiable par fichier.
Détail complet : `plans/P14/index.md` §Bilan de clôture.

**Contre-relecture des 4 niveaux d'argumentaire (hors P14, 2026-08-06/07)** : `statine` et les 5
`.argumentaire.md` commités (`f271c8c`) ; sa part sur `insuline`/`prescription`/`rhd-alimentation`/
`rhd-activite-physique` reste, elle aussi, dans l'arbre de travail — même blocage que ci-dessus.

**Plan P13 — clos 2026-08-05**, **Plan P12 — clos 2026-08-03** : détail dans leurs `index.md`.
**Plan PV1 — Veille, cadré 2026-07-31, pas démarré.** **Plan P7** (ouvert) : manquent SA2 et S2 · **P8 —
clos.**

## Ce qui casse / n'est pas testé

- Onglet **« Veille » rend une page blanche** — mécanique, non cadré (appartient à PV1/S6).
- CTA flottant mobile : depuis **D47**, visible jusqu'à 1199 px (contre 959) — donc sur des fenêtres de bureau non maximisées. Jugement d'usage en attente, `VALIDATION.md`.
- **I24 ne scanne que `conditions`/`prerequis`, pas `exclusions`** : 8 motifs négatifs sur `statine.yaml` en attente (P13/S7, T-152), exemptés nommément.

## Bugs connus

- Nœud `prescription` : `traitements_en_cours` en citation négative ne peut pas recevoir
  `presomption_non` (dette D30, tracée dans `engine/banc/impasse.test.ts`).

## Dette technique / recherche bloquante

- **Finir la consolidation P14** : séparer (ou committer ensemble, décision référent) le lot P14 et le
  lot contre-relecture sur les 4 fichiers de contenu ci-dessus, puis committer/pousser. Sans ce commit,
  les 9 défauts du diagnostic P14 restent non livrés en production malgré un arbre de travail vert.
- **Passe B — sécurité à l'effort** (`rhd-activite-physique`, `modèle: Opus, effort: high`).
- **Validation clinique référent finale** (`prescription`, RHD ×2 → `statut: valide`) : à programmer.
- **Albuminurie non convertie** : `derive` ne sait produire qu'un booléen ou un nombre, jamais un
  libellé — le praticien saisit toujours une catégorie là où son labo rend un ratio A/C.
- **Contrainte de schéma à rendre opposable** (D48) : « `divergences` non vide si `divergence: true` »
  est vraie sur les 6 nœuds, peut être posée.

## Comment vérifier l'état réel

```bash
npm test          # mesurer MACHINE LIBRE : sous charge, le banc de sécurité rend des verdicts au hasard
npm run typecheck # `npx tsc --noEmit` seul est factice (tsconfig.json en `files: []`, 0 fichier)
npm run build
```
