# Plan P4 — Ce que la recette navigateur du 2026-07-28 a mis au jour   (rédigé par Opus)

## Objectif d'ensemble

Corriger les trois mécanismes qui font que l'écran **affirme ce que le moteur n'a pas conclu**, **ne
retire rien quand la sécurité l'exige**, et **peut n'afficher aucune conduite à un patient réel** — puis
inscrire les règles correspondantes dans la doctrine (`GRAMMAIRE-NOEUD.md`, `CONSTRUIRE-UN-MODULE.md`)
et dans le banc, pour que le prochain domaine ne les refasse pas.

Source : `docs/decision/validation/recette-navigateur-2026-07-28.md` (21 défauts/doutes, 6 graves).
Les sept arbitrages du plan sont tranchés — cf. `DECISIONS.md` D30→D33.

## Ce que ce plan NE fait pas

- Aucune modification de **contenu clinique** hors deux corrections rédactionnelles (T-027, T-028) : la
  carte terminale de `statine` **n'a pas besoin d'être élargie**, elle couvre déjà le patient — c'est le
  moteur qui ne l'atteignait pas (T-020).
- Les **phrases de départage** entre options à égalité (contenu clinique, référent) : hors périmètre,
  T-024 assume le choix à l'écran au lieu de l'orienter.
- Les deux **passes de recherche** encore ouvertes (glycémie capillaire sans MCG, sécurité à l'effort) :
  inchangées, cf. `STATUS.md`.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-018, T-019 | Un drapeau non répondu ne vaut plus « non » (D30) + invariant I21 | Sonnet | xhigh | — | `engine/deriveCritere.ts`, `lib/formLayout.ts`, `schema/noeud.schema.json`, `content/noeuds/diabete-type-2/*.yaml`, `engine/banc/` | [x] |
| [S2](S2.md) | T-020, T-021 | La halte `ordered-first-match` ne masque plus un filet de sécurité (D32) + invariant I22 | Sonnet | xhigh | S1 | `engine/evaluateNode.ts`, `engine/banc/` | [x] |
| [S3](S3.md) | T-022, T-023, T-024 | Écran de résultats : contrainte suspensive (D31), jamais d'écran muet, départage assumé | Sonnet | high | S1 | `screens/DecisionNodeScreen.tsx`, `screens/DecisionNodeScreen.css`, `lib/vueDecision.ts` | [x] |
| [S4](S4.md) | T-025 | La contre-indication cesse d'être l'élément le moins visible de la carte | Sonnet | medium | — | `components/OptionCard.tsx`, `components/OptionCard.css` | [x] |
| [S5](S5.md) | T-026 | « Nouveau patient » : un geste de fin de consultation (D33) | Sonnet | medium | — | `shared/layout/Header.tsx`, `shared/layout/Header.css`, `lib/sessionCriteres.ts`, `App.tsx` | [x] |
| [S6](S6.md) | T-027, T-028 | Deux libellés : le cadrage `statine` en noms de variables, « Ces 1 pistes » | Haiku | low | S1, S3 | `content/noeuds/diabete-type-2/statine.yaml`, `screens/DecisionNodeScreen.tsx` | [x] |
| [S7](S7.md) | T-029 | Doctrine : R10, portes de sortie de module, D30→D33 | Sonnet | high | S1, S2, S3 | `docs/decision/GRAMMAIRE-NOEUD.md`, `docs/decision/CONSTRUIRE-UN-MODULE.md`, `DECISIONS.md` | [x] |
| [S8](S8.md) | T-030 | Recette navigateur de contrôle + mise à jour du protocole | Claude + navigateur | high | toutes | `docs/decision/validation/` | [x] |
| [S9](S9.md) | T-031 | `prescription` : réparer l'impasse `traitements_en_cours`/`intolerance_traitement` (motif R8) — **ajoutée en cours de plan, suite à la découverte S1** | Sonnet | high | S1 | `content/noeuds/diabete-type-2/prescription.yaml`, `engine/banc/impasse.test.ts`, `engine/banc/invariants-contenu.test.ts` | [x] |

**Note de découpage (§4a).** S1 et S2 portent chacune deux tâches malgré leur effort `xhigh` : dans les
deux cas l'invariant de banc **est la preuve du correctif** (mêmes fichiers, mêmes lectures, aucune gate
humaine entre les deux). Les séparer re-paierait un démarrage froid complet pour un test qui n'a de sens
qu'écrit avec le correctif sous les yeux.

## Ordonnancement

- **Vague 1** : **S1** seule. Elle change la sémantique de détermination pour tout le moteur : toute
  session lancée en parallèle travaillerait sur des attentes de test périmées.
- **Vague 2 — parallélisable** : **S2** · **S3** · **S4** · **S5**. Zones disjointes vérifiées
  (`evaluateNode.ts` ⊥ `DecisionNodeScreen.*` ⊥ `OptionCard.*` ⊥ `shared/layout/`). Aucune ne touche
  `content/`, `STATUS.md`, `TASKS.md` ni cet index.
- **Vague 2 bis — S9** (ajoutée en cours de plan) : exécutée en parallèle de la vague 2 — zone disjointe
  (`content/noeuds/diabete-type-2/prescription.yaml` + deux fichiers de banc), aucun conflit avec S2-S5.
  Corrige un trou révélé par S1 (T-018) : cf. `S9.md` pour le contexte complet.
- **Vague 3 — séquentielle** : **S6** (les libellés, après que S1 a fini de remuer les YAML et S3 le
  rendu), puis **S7** (la doctrine décrit ce qui existe, pas ce qu'on espère).
- **Vague 4 — contrôle** : **S8**, la recette navigateur rejouée sur le déployé. Elle ne peut pas partir
  avant que la vague 3 soit poussée en production.
- **Vague 5 — consolidation** : commits tâche par tâche, statuts, `STATUS.md`, `TASKS.md`,
  `VALIDATION.md`, push — cf. `WORKFLOW.md` §4d.

## Le fil rouge, pour qui reprend ce plan à froid

Les trois défauts graves ont **une seule forme** : deux couches du produit croient des choses
différentes, et la plus affirmative gagne à l'écran.

1. Le moteur présumait « non » sur un drapeau non répondu, l'écran le disait « à confirmer » (S1).
2. Le moteur s'arrêtait sur une option indéterminée, l'écran n'en disait rien et n'affichait plus rien —
   pendant qu'une carte de sécurité attendait deux options plus loin (S2).
3. Une contrainte déclarait la saisie impossible, la sélection des options ne la lisait pas (S3).

C'est pourquoi S7 n'est pas de la documentation de confort : sans règle opposable, la forme reviendra
au domaine suivant, comme elle est revenue quatre fois sur le DT2.

## Clôture (2026-07-28)

Plan soldé — S1→S9 exécutées, S8 (recette navigateur de contrôle) confirme les six correctifs
**CONFORME** sur le déployé (`ebm-msp.vercel.app`, commit `036f4aa`). Détail :
`docs/decision/validation/recette-navigateur-2026-07-28-controle-P4.md`. Une recette complémentaire
« praticien naïf » (hors périmètre du plan, lancée dans la foulée) a trouvé un défaut plus grave que
prévu et plusieurs points cliniques — synthèse et réconciliation dans
`docs/decision/validation/BILAN-P4-2026-07-28.md`, décisions reportées dans `STATUS.md`/`TASKS.md`,
pas ici. Ce plan ne les corrige pas : ils ouvrent la suite (P5, à cadrer).
