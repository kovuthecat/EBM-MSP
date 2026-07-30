# Plan P7 — Les arbitrages référent du 2026-07-29, encodés   (rédigé par l'orchestrateur)

## Objectif d'ensemble

Encoder les cinq arbitrages tranchés par Thibault en session dédiée le 2026-07-29, après clôture de P6.
Aucune recherche EBM nouvelle : les décisions sont rendues, ce plan les met dans le contenu et dans
l'écran. Même nature que P5 (mécanique + contenu ciblé), pas un chantier de fond.

Source : `TASKS.md` §« Backlog — arbitrages référent tranchés le 2026-07-29 », et `STATUS.md`
§« Arbitrages du 2026-07-29 ».

## Ce que ce plan a vérifié avant de se lancer

- **Le seuil `DFG < 30` de l'AR GLP-1 ne concerne PAS la sécurité de la classe** — c'est le seuil où la
  metformine disparaît (contre-indication RCP ANSM), donc où une classe à bénéfice doit prendre le
  relais (commentaire de l'option, `prescription.yaml`). La réponse du référent (« RCP vérifiées, pas de
  contre-indication formelle, peu étudié sous 15 ») répond à une **autre** question : la sécurité propre
  de l'AR GLP-1. **Confirmé par Thibault le 2026-07-29** : le seuil de déclenchement reste `< 30`
  inchangé, on ajoute une alerte de prudence sous DFG 15.
- **Trois des cinq items touchent le même fichier** (`prescription.yaml`) — ils sont donc regroupés dans
  une seule session (SA1) plutôt que parallélisés, sinon ils se marcheraient dessus.
- **`cadrage` (D24) est le véhicule existant** pour une information neutre de tête de nœud, sans coût de
  saisie et sans être une alerte — c'est ce qui convient au signalement de validité de l'HbA1c, plutôt
  qu'un nouveau critère à cocher (la charge de saisie est le risque n°1 déclaré du projet).

## Ce que ce plan NE fait pas

- Ne rouvre aucun arbitrage déjà tranché « sans action » le 2026-07-29 (dette patient naïf T-018,
  asymétrie iSGLT2/AR GLP-1 chez le dénutri, statut `brouillon` hors écran de décision, réserve CTA
  mobile) — cf. `TASKS.md`, section dédiée.
- N'entame pas la Passe A (insuline sans capteur) : chantier de recherche séparé, lancé en parallèle
  depuis une session neuve (`docs/decision/PROMPT-passe-A-insuline-sans-capteur.md`).
- Ne descend pas à la molécule/dose hors du nœud `insuline` : tranché comme doctrine (cas par cas quand
  c'est cliniquement décisif), pas comme chantier.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [SA1](SA1.md) | T-048, T-049, T-050 | `prescription` : seuils de position, prudence rénale AR GLP-1, garde sur l'agent mal toléré | Sonnet | high | — | — | `content/noeuds/diabete-type-2/prescription.yaml` | [x] — T-048 rendu obsolète le 2026-07-29 (`position_vs_cible` retiré, cf. changelog) ; T-049/T-050 tiennent |
| [SB1](SB1.md) | T-051 | Badge dédié pour une option de sécurité triée en tête | Sonnet | medium | — | — | `src/features/decision/screens/DecisionNodeScreen.tsx`, `components/OptionCard.tsx`, `.css` | [x] |
| [SA2](SA2.md) | T-052, T-053 | Signalement de validité de l'HbA1c + doctrine | Sonnet | medium | — | SA1, SB1 | `content/noeuds/diabete-type-2/*.yaml`, `DECISIONS.md` | [ ] |
| [S2](S2.md) | T-054 | Recette navigateur locale des quatre changements | Claude + navigateur | medium | Desktop | tout ce qui précède | `docs/decision/validation/` | [ ] |

## Ordonnancement

- **Vague 1 — parallélisable** : **SA1** (contenu `prescription`) · **SB1** (écran). Zones disjointes.
- **Vague 2** : **SA2**, après SA1 (même fichier `prescription.yaml`) et après SB1 (elle documente aussi
  le badge livré par SB1 dans `DECISIONS.md`).
- **Vague 3 — contrôle** : **S2**, recette navigateur **en local** (`npm run dev`), comme P6 — le code
  n'est poussé qu'après validation, pas avant.
- **Vague 4 — consolidation** : commits tâche par tâche, statuts, `STATUS.md`, `TASKS.md`,
  `VALIDATION.md`, push.

## Le fil rouge

Ces cinq points ont en commun d'être des **décisions déjà rendues qui attendaient un encodage** — aucune
ne demande de trancher quoi que ce soit en cours de route. Toute session qui se retrouve à arbitrer une
question clinique s'est trompée de plan : elle doit s'arrêter et signaler, pas décider.
