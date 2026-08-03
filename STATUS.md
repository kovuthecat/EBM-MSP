# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session. L'historique (comment on est arrivé ici) vit dans
`git log`, `DECISIONS.md`/`docs/commun/decisions/` et les changelogs de contenu — pas ici.
Plafond : 80 lignes (appliqué par hook).

> **Dernière mise à jour :** 2026-08-03

## Ce qui existe

**Module Décision, domaine DT2 — déployé et utilisé en consultation** (ebm-msp.vercel.app). Module
Veille : **non commencé** (aucun code, `DECISIONS.md` D8 garde la place).

**6 nœuds de contenu**, tous `content/decision/noeuds/diabete-type-2/*.yaml` :

| nœud | statut | dernière version |
| --- | --- | --- |
| `cible-glycemique` | `valide` | v2.12 |
| `statine` | `brouillon` | v1.23 |
| `prescription` | `brouillon` | v0.57 |
| `insuline` | `brouillon` | v0.44 |
| `rhd-alimentation` | `brouillon` | v0.12 |
| `rhd-activite-physique` | `brouillon` | v0.13 |

Passage à `valide` conditionné à la relecture référent finale (`TASKS.md` §validation clinique).

**Banc de tests** (`src/features/decision/engine/banc/`) : non-régression du contenu en 3 couches
(vignettes, couverture, invariants) + **I25, aucun jargon de projet dans un champ affiché** (P12/S7).
**1048 tests, 11 skip, typecheck et build verts.**

## Chantier actif

**Plan P12 — clos le 2026-08-03** (suites de la recette praticien naïf du 2026-08-02) : S1-S10
livrées. La cible d'HbA1c ne se recalcule plus à la reprise de session ; les intitulés d'options
nomment le geste, le motif se lit dans « Proposé parce que » ; le seuil des deux colonnes passe à
1200 px (**D47**, D46 confirmé par la mesure) ; la baisse continue nocturne déclenche « Réduire la
basale », chiffrée (T-067, reprise de P8) ; les 11 cartes de déprescription portent une posologie ou
déclarent qu'aucun rythme n'est sourcé ; une alerte préventive d'acidocétose euglycémique est posée ;
les blocs repliés annoncent leur contenu ; une carte seule s'affiche dépliée ; poids/taille et CK en
UI/L remplacent l'IMC et les multiples calculés de tête (critères dérivés **numériques**, extension
du moteur) ; le praticien peut déclarer qu'un critère restera **indisponible**. Une seule tâche non
livrée, **T-120**, STOP fondé — cf. `plans/P12/index.md` §Bilan de clôture. N2 : `VALIDATION.md`.

**Plan PV1 — module Veille, cadré le 2026-07-31, pas démarré** (`plans/PV1/index.md`) : 10 sessions,
deux éditions hebdomadaires produites **à la main** (`2026-W30`, `2026-W31`, en rétrospectif) avant
tout code, puis gel du modèle et câblage V1/V2. Les plans Veille sont préfixés `PV`.

**Plan P7** (cadré 2026-07-29, toujours ouvert) : il manque SA2 (validité HbA1c) et S2 (recette).
SA2 est débloquée depuis P12/S10 (l'accroche chiffrée des blocs repliés) — détail `plans/P7/index.md`.

**Plan P8 — clos** : S1-S8 livrées et commitées ; **T-067 a été reprise et livrée par P12/S4**.

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

## Comment vérifier l'état réel

```bash
npm test          # 1048 tests attendus, 11 skip — mesurer MACHINE LIBRE (aucun serveur de dev en
                  # cours) : le banc de sécurité rend des verdicts au hasard sous charge
npm run typecheck # `npx tsc --noEmit` seul est factice (tsconfig.json en `files: []`, 0 fichier)
npm run build
```
