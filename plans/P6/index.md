# Plan P6 — Généraliser la maquette « accordéon + colonne sticky » aux 6 nœuds DT2   (rédigé par l'orchestrateur)

## Objectif d'ensemble

Adopter le langage visuel de la maquette Claude Design (`design/maquettes/Maquette upgrade UI.zip`,
dessinée pour le seul nœud `prescription`/« Traiter ») sur l'ensemble des 6 nœuds du domaine DT2 :
formulaire en sections accordéon (une à la fois, chips de navigation avec compteur de champs manquants)
+ panneau de résultats en colonne sticky (toujours visible, cartes compactes). Plus un badge couleur par
verbe d'action (Ajouter/Remplacer/Arrêter/Réduire/Maintenir), sur les deux nœuds où ce vocabulaire est
réellement celui du contenu.

Source : investigation du 2026-07-28 (cf. rapport dans la conversation qui a précédé ce plan — pas de
fichier dédié, décisions reprises ci-dessous). Aucun nouveau `DECISIONS.md` avant ce plan : les
arbitrages de design ont été rendus directement par Thibault dans l'échange qui a précédé ce cadrage,
et sont consignés comme « Décision clé » de chaque session concernée. **S8 (doctrine) les couche dans
`DECISIONS.md` en toute fin de plan.**

## Ce que ce plan a vérifié avant de se lancer (pour qui le reprend à froid)

- Le moteur généralise déjà l'essentiel : `vueDecision.ts` produit `familles`/`groupes` de façon
  identique pour les nœuds `ordered-first-match` (`cible-glycemique`, `statine`) et `multi-options`
  (`prescription`, `insuline`, `rhd-alimentation`, `rhd-activite-physique`) — le champ `selection` du
  YAML est la seule différence, `rang` vaut simplement `undefined` en `ordered-first-match` (D11).
- Le formulaire groupe déjà les champs par `groupe` (contenu, invariant 5, aucun nom de section en dur)
  — les 5 sections de la maquette (« Intention thérapeutique », « Traitement actuel et contrôle »…) SONT
  les valeurs de `groupe` de `prescription.yaml`, pas un découpage inventé pour la maquette.
- **Le vocabulaire à 5 verbes (Ajouter/Remplacer/Arrêter/Réduire/Maintenir) ne s'applique QUE sur
  `prescription` (27 options) et `insuline` (12 options)**, où la quasi-totalité des intitulés
  commencent déjà par ce verbe. `statine` (7 options) est un mélange (Interrompre/Débuter collent,
  « Discuter la statine », « Statine (prévention primaire…) » non). `cible-glycemique` (4 options, des
  valeurs cibles) et `rhd-alimentation`/`rhd-activite-physique` (29 pistes comportementales) n'ont pas ce
  vocabulaire. **Décision** : le badge verbe n'est câblé QUE sur `prescription`/`insuline` ; les 4 autres
  nœuds gardent les badges existants (Recommandée / niveau de preuve / `role`), sans verbe forcé.
- **Contre-indications** : Thibault a tranché pour les mettre en infobulle (pas toujours visibles),
  malgré la tension avec T-025 (P4) qui venait de les remonter en tête de carte. **Résolution retenue** :
  pas d'infobulle au survol natif (`title`, inaccessible au tactile et aux lecteurs d'écran) — les
  contre-indications rejoignent le `<details>` déjà existant sur la carte (effet attendu/avantages/
  inconvénients), en première position, avec un indicateur visible dans la ligne compacte fermée (« ⚠
  Contre-indications » ou équivalent) pour que leur existence ne soit jamais totalement invisible.
- **Résumés génériques** (sections repliées) : `label : valeur` des champs renseignés du groupe, jamais
  une phrase rédigée par nœud (violerait l'invariant 5) — accepté par Thibault « pour commencer ».

## Ce que ce plan NE fait pas

- N'invente pas un badge verbe sur `statine`/`cible-glycemique`/`rhd-*` : aucune classification forcée
  là où le contenu ne le porte pas.
- Ne touche à aucun contenu clinique au-delà de la déclaration du champ `action` (un verbe descriptif,
  pas une nouvelle règle de décision) sur `prescription`/`insuline`.
- Ne remplace pas `window.confirm`, ni aucun autre mécanisme déjà livré par P4/P5.
- N'introduit aucune dépendance de librairie (popover/tooltip) : le `<details>` natif existant suffit.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S0](S0.md) | T-035 | Schéma + types : nouveau champ `Option.action` | Haiku | low | — | — | `schema/noeud.schema.json`, `src/features/decision/content/node.types.ts` | [x] |
| [SB1](SB1.md) | T-036 | Le shell : colonne formulaire + colonne résultats sticky | Sonnet | high | — | — | `src/features/decision/screens/DecisionNodeScreen.tsx`, `.css` | [x] |
| [SB2](SB2.md) | T-037 | Le formulaire en accordéon (générique, piloté par `groupe`) | Sonnet | high | — | — | `src/features/decision/components/CriteriaForm.tsx`, `.css`, `src/features/decision/lib/formLayout.ts` | [x] |
| [SA1](SA1.md) | T-038 | Qualifier `action` sur `prescription` (27 options) | Sonnet | high | — | S0 | `content/noeuds/diabete-type-2/prescription.yaml` | [x] |
| [SA2](SA2.md) | T-039 | Qualifier `action` sur `insuline` (12 options) | Sonnet | medium | — | S0 | `content/noeuds/diabete-type-2/insuline.yaml` | [x] |
| [SB3](SB3.md) | T-040 | La carte compacte : badge verbe + contre-indications dans le dépli | Sonnet | high | — | S0 | `src/features/decision/components/OptionCard.tsx`, `.css` | [x] |
| [SB4](SB4.md) | T-041 | Vérification inter-nœuds et finition | Sonnet | high | — | SB1, SB2, SB3, SA1, SA2 | `src/features/decision/screens/*.css`, ajustements ciblés | [x] |
| [SB5](SB5.md) | T-042 | Doctrine : `ARCHITECTURE.md`, `DECISIONS.md` (nouvelle décision), convention `action` | Sonnet | medium | — | SB1, SB2, SB3, SA1, SA2 | `ARCHITECTURE.md`, `DECISIONS.md`, `docs/decision/GRAMMAIRE-NOEUD.md` | [x] |
| [SA3](SA3.md) | T-044 | `insuline` : grouper les champs pour l'accordéon — **ajoutée en cours de plan, suite à la découverte SB4** | Sonnet | medium | — | SB2 (comportement `grouperChamps`) | `content/noeuds/diabete-type-2/insuline.yaml` | [x] |
| [S6](S6.md) | T-043 | Recette navigateur des 6 nœuds (nouveau shell) | Claude + navigateur | high | Desktop | tout ce qui précède, y compris SA3 | `docs/decision/validation/` | [x] |
| [SB6](SB6.md) | T-045 | Défaut grave S6 (point 3) : habiller le résumé fermé des contre-indications (icône, couleur, décompte) — **ajoutée suite au rapport S6** | Sonnet | high | — | S6 | `src/features/decision/components/OptionCard.tsx`, `.css`, `src/styles/tokens.css` | [x] |
| [SB7](SB7.md) | T-046 | Défaut mineur S6 (point 1c) : le CTA flottant ne doit plus recouvrir le bouton « Suivant » en mobile — **ajoutée suite au rapport S6** | Sonnet | medium | — | S6 | `src/features/decision/screens/DecisionNodeScreen.css`, `src/features/decision/components/CriteriaForm.css` | [x] |
| [S7](S7.md) | T-047 | Recette navigateur ciblée : revérifier point 3 (test des 20 secondes) et point 1c, en local — **ajoutée suite au rapport S6** | Claude + navigateur | medium | Desktop | SB6, SB7 | `docs/decision/validation/` | [x] |

## Clôture (2026-07-29)

Plan clos. Point 3 (contre-indications) revérifié CONFORME après SB6. Point 1c (CTA mobile) CONFORME
en usage normal avec une réserve mineure documentée (défilement forcé au-delà du point d'arrêt naturel
— cf. `TASKS.md`, backlog clôture P4/P5). Recette faite en LOCAL (`npm run dev`), pas encore sur le
déployé — à confirmer sur `ebm-msp.vercel.app` à la prochaine occasion, sans repasse obligatoire du
protocole complet (S6/S7 ont déjà couvert le shell en détail). 826 tests passés, 11 skip, tsc et build
verts, vérifié indépendamment après chaque vague.

## Ordonnancement

- **Vague 1 — parallélisable** : **S0** · **SB1** · **SB2**. Zones disjointes (schéma/types ⊥
  `DecisionNodeScreen.*` ⊥ `CriteriaForm.*`). SB1/SB2 ne dépendent pas de S0 (ils ne touchent pas au
  champ `action`).
- **Vague 2 — parallélisable** : **SA1** · **SA2** · **SB3**, après S0 (le champ `action` doit exister,
  typé, avant que SA1/SA2 le renseignent et que SB3 le lise). Zones disjointes
  (`prescription.yaml` ⊥ `insuline.yaml` ⊥ `OptionCard.*`). **Contrat d'interface verrouillé** : `OptionCard`
  garde exactement sa signature de props actuelle — SB3 ne fait QUE changer son rendu interne, donc SB1
  (qui l'appelle depuis `DecisionNodeScreen.tsx`) n'a rien à coordonner avec SB3.
- **Vague 3 — parallélisable** : **SB4** (vérification/finition, a besoin de tout le code) · **SB5**
  (doctrine, docs seules — disjoint de SB4 et exécutable dès que le comportement final est stabilisé).
- **Vague 4 — contrôle** : **S6**, recette navigateur sur les 6 nœuds. Exécutée par Thibault via Claude
  Code Desktop (environnement `Desktop` requis pour N1, cf. `verif-visuelle`) — cette session n'est pas
  lancée depuis VSCode. Comme pour P4/S8, prérequis dur : le code doit être poussé (au moins en local
  `npm run dev` suffit cette fois, pas besoin du déployé — aucune session de ce plan ne dépend d'un état
  serveur externe). **Exécutée le 2026-07-29** — rapport :
  `docs/decision/validation/recette-navigateur-2026-07-29-P6.md`. Verdict : défaut grave au point 3
  (contre-indications repliées, plus retenues au test des 20 secondes) et défaut mineur au point 1c (CTA
  flottant recouvrant le bouton « Suivant » en mobile) → **SB6, SB7, S7 ajoutées ci-dessus**.
- **Vague 4 bis — correctifs, parallélisable** : **SB6** · **SB7**, après S6. Zones disjointes
  (`OptionCard.*`/`tokens.css` ⊥ `DecisionNodeScreen.css`/`CriteriaForm.css`).
- **Vague 5 — contrôle ciblé** : **S7**, revérifie seulement les points 3 et 1c (pas les 6 nœuds), en
  local, après SB6 + SB7. Bloquant pour la consolidation si le point 3 est encore en défaut.
- **Vague 6 — consolidation** : commits tâche par tâche, statuts, `STATUS.md`, `TASKS.md`,
  `VALIDATION.md`, push — cf. `WORKFLOW.md` §4d.

## Le fil rouge

Le moteur et le formulaire sont déjà génériques (`familles`, `groupes` pilotés par le contenu) — ce plan
change l'**habillage**, pas la logique de décision. Les trois sessions qui touchent le rendu (SB1, SB2,
SB3) ne doivent RIEN changer au comportement déjà vérifié par P4/P5 (D30, D31, D32, D25, T-024, le champ
segmenté réversible, `mcg_disponible`) : elles le réhabillent dans un nouveau conteneur visuel, elles ne
le réécrivent pas.
