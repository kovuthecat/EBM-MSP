# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session. L'historique (comment on est arrivé ici) vit dans
`git log`, `DECISIONS.md`/`docs/commun/decisions/` et les changelogs de contenu — pas ici.
Plafond : 80 lignes (appliqué par hook).

> **Dernière mise à jour :** 2026-08-14

## Ce qui existe

**Module Décision, domaine DT2 — déployé et utilisé en consultation** (ebm-msp.vercel.app), mais la
branche décrite ci-dessous n'y est **pas encore**. Module Veille : code présent (`Veille : refonte
ergonomie…`, `d9f8c26`), périmètre et robustesse non réévalués depuis — à vérifier avant de s'y fier.

**6 nœuds de contenu**, tous `content/decision/noeuds/diabete-type-2/*.yaml` — versions sur la branche
`decision/panneau-posologie` (non fusionnée, cf. Chantier actif) :

| nœud | statut | version |
| --- | --- | --- |
| `cible-glycemique` | `valide` | v2.19 |
| `insuline` | `valide` | v0.62 |
| `statine` | `brouillon` | v1.31 |
| `prescription` | `brouillon` | v0.75 |
| `rhd-alimentation` | `brouillon` | v0.18 |
| `rhd-activite-physique` | `brouillon` | v0.21 |

Passage à `valide` conditionné à la relecture référent finale (`TASKS.md` §validation clinique).

**Banc de tests** (`src/features/decision/engine/banc/`) : non-régression du contenu en 5 couches
(vignettes, couverture, invariants, relation — paires co-actives + table des conditions, I25/I34).

## Chantier actif

**Plan P15 — panneau posologie, clos et commité le 2026-08-14** (10 sessions + un lot hors plan qui l'a
précédé, `plans/P15/index.md`) : sort les citations de sources du texte de posologie vers une note
structurée à deux registres de bibliographie, rend la posologie conditionnelle au patient (`quand`), et
corrige un défaut réel — un patient porteur d'une mesure continue du glucose recevait une consigne de
titration pensée pour la glycémie capillaire. **12 commits sur `decision/panneau-posologie`** (`64d1329`
→ `e32ff2b`), N0 vert sur l'arbre complet (1326 tests, 0 échec). **Branche NI fusionnée NI poussée** —
décision de Thibault en attente (`TASKS.md`). Un red-team indépendant (S9) a infirmé la conclusion
« aucun essai » d'une passe de débroussaillage initiale, revérifié via l'API ClinicalTrials.gov avant
d'accepter le contenu. Deux écarts d'exécution corrigés et tracés dans leurs commits.

**Plan P14 — clos 2026-08-07, commité** (`8f3b90e`) — la mention « non commité » ici avant le
2026-08-14 était périmée.

**Plan P13 — clos 2026-08-05**, **Plan P12 — clos 2026-08-03** : détail dans leurs `index.md`.
**Plan PV1 — Veille, cadré 2026-07-31, pas démarré.** **Plan P7** (ouvert) : manquent SA2 et S2 · **P8 —
clos.**

## Ce qui casse / n'est pas testé

- Onglet **« Veille »** : périmètre réel non revérifié depuis `d9f8c26` — à confirmer avant usage.
- CTA flottant mobile : depuis **D47**, visible jusqu'à 1199 px (contre 959) — donc sur des fenêtres de bureau non maximisées. Jugement d'usage en attente, `VALIDATION.md`.
- **I24 ne scanne que `conditions`/`prerequis`, pas `exclusions`** : 8 motifs négatifs sur `statine.yaml` en attente (P13/S7, T-152), exemptés nommément.

## Bugs connus

- Nœud `prescription` : `traitements_en_cours` en citation négative ne peut pas recevoir
  `presomption_non` (dette D30, tracée dans `engine/banc/impasse.test.ts`).

## Dette technique / recherche bloquante

- **Fusionner/pousser `decision/panneau-posologie`** vers `main` — cf. Chantier actif.
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
