# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session. L'historique (comment on est arrivé ici) vit dans
`git log`, `DECISIONS.md`/`docs/commun/decisions/` et les changelogs de contenu — pas ici.
Plafond : 80 lignes (appliqué par hook).

> **Dernière mise à jour :** 2026-08-14

## Ce qui existe

**Module Décision, domaine DT2 — déployé et utilisé en consultation** (ebm-msp.vercel.app). `main` fusionné
et poussé le 2026-08-14 (`2823b02`) — le déployé reflétera ce contenu au prochain build Vercel. Module
Veille : code présent (`d9f8c26`), périmètre non réévalué. Édition référent (D64, 2026-08-14) codée
mais **migration SQL non exécutée** (cf. Dette) : crayon visible, l'enregistrement échoue.

**6 nœuds de contenu**, tous `content/decision/noeuds/diabete-type-2/*.yaml`, versions sur `main` :

| nœud | statut | version |
| --- | --- | --- |
| `cible-glycemique` | `valide` | v2.19 |
| `insuline` | `valide` | v0.63 |
| `statine` | `brouillon` | v1.31 |
| `prescription` | `brouillon` | v0.76 |
| `rhd-alimentation` | `brouillon` | v0.18 |
| `rhd-activite-physique` | `brouillon` | v0.21 |

Passage à `valide` conditionné à la relecture référent finale (`TASKS.md` §validation clinique).

**Banc de tests** (`src/features/decision/engine/banc/`) : non-régression du contenu en 5 couches
(vignettes, couverture, invariants, relation — paires co-actives + table des conditions, I25/I34).

## Chantier actif

Aucun plan ouvert sur le module Décision. **Plan P15 — panneau posologie, clos le 2026-08-14, fusionné
dans `main`** (`2823b02`, `plans/P15/index.md`) : sort les citations de sources du texte de posologie vers
une note structurée à deux registres de bibliographie, rend la posologie conditionnelle au patient
(`quand`), et corrige un défaut réel (titration MCG affichant la consigne de glycémie capillaire). Un
red-team (S9) a infirmé la conclusion « aucun essai » d'une passe de débroussaillage initiale, revérifié
via l'API ClinicalTrials.gov. **Suivi le même jour d'une relecture en consultation** (6 correctifs :
metformine sourcée KDIGO/ANSM sans incise d'initiation, AR GLP‑1 réordonné via le nouveau champ
`ItemPosologie.accent`, préremplissage `insuline_basale`/`rapide` selon la situation, `preference_injection`
masqué sur `insuline.yaml` — « Insuline prémélangée » y devient inatteignable, effet de bord assumé —
posologie ajoutée à 3 options d'`insuline.yaml` qui recommandaient un AR GLP‑1 sans dose). 14 commits, N0
vert (1325 tests), vérifié au navigateur.

**Plan P14 — clos 2026-08-07**, **P13 — clos 2026-08-05**, **P12 — clos 2026-08-03** : détail dans leurs
`index.md`. **Plan PV1 — Veille, cadré 2026-07-31, pas démarré.** **Plan P7** (ouvert) : manquent SA2 et
S2 · **P8 — clos.**

## Ce qui casse / n'est pas testé

- Onglet **« Veille »** : périmètre réel non revérifié depuis `d9f8c26` — à confirmer avant usage.
- CTA flottant mobile : depuis **D47**, visible jusqu'à 1199 px (contre 959) — donc sur des fenêtres de bureau non maximisées. Jugement d'usage en attente, `VALIDATION.md`.
- **I24 ne scanne que `conditions`/`prerequis`, pas `exclusions`** : 8 motifs négatifs sur `statine.yaml` en attente (P13/S7, T-152), exemptés nommément.

## Bugs connus

- Nœud `prescription` : `traitements_en_cours` en citation négative ne peut pas recevoir
  `presomption_non` (dette D30, tracée dans `engine/banc/impasse.test.ts`).

## Dette technique / recherche bloquante

- **Exécuter le bloc `veille_entree_overrides` de `supabase/schema.sql`** (D64, 2026-08-14) — étape
  manuelle Supabase Studio, pas d'accès direct à la base. Sans elle, l'édition référent des entrées
  de veille échoue à l'enregistrement.
- **Passe B — sécurité à l'effort** (`rhd-activite-physique`, `modèle: Opus, effort: high`).
- **Validation clinique référent finale** (`prescription`, `statine`, RHD ×2 → `statut: valide`) : à programmer.
- **Albuminurie non convertie** : `derive` ne sait produire qu'un booléen ou un nombre, jamais un
  libellé — le praticien saisit toujours une catégorie là où son labo rend un ratio A/C.
- **`ContreIndication`/`Alerte` sans champ `sources`** (trouvaille P15/S7) : le paragraphe CYP3A4 de
  `statine` y est sourcé en prose libre faute de canal structuré — extension de schéma à cadrer si le
  besoin se généralise.

## Comment vérifier l'état réel

```bash
npm test          # mesurer MACHINE LIBRE : sous charge, le banc de sécurité rend des verdicts au hasard
npm run typecheck # `npx tsc --noEmit` seul est factice (tsconfig.json en `files: []`, 0 fichier)
npm run build
```
