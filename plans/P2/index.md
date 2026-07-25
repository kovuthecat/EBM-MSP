# Plan P2 — Validation systémique du module DT2 (couche 7 : cohérence & robustesse inter-nœuds)   (rédigé par Opus)

## Objectif d'ensemble

Éprouver le module `diabete-type-2` **comme un système**, là où les 6 couches de vérification
existantes ne regardent qu'un nœud isolé. Trois questions d'un contradicteur, trois vérifications :
cohérence des **valeurs** (seuils/molécules identiques partout), validité + cohérence des **données EBM**
d'un nœud à l'autre (red-team globale, jamais faite), et cohérence **clinique de parcours** (vignettes
traversant les coutures). Sortie : findings confirmés triés + carte de cohérence + banc de vignettes
versionné + squelettes des registres de défendabilité + spec des tests de non-régression.

> **Méthode (le *pourquoi*, à lire avant d'exécuter) : [`docs/decision/VALIDATION_COHERENCE.md`](../../docs/decision/VALIDATION_COHERENCE.md).**
> Ce plan porte le *comment*. Autorité contenu : [`docs/decision/00-global.md`](../../docs/decision/00-global.md).
> Garde-fou sources FR (HAS/SFD/CMG/Prescrire jamais via OpenEvidence/web) : `VALIDATION_COHERENCE.md` §2.

## Vecteur d'exécution

Ce plan s'exécute via l'outil **Workflow** (orchestration multi-agents) : **une session = une phase du
workflow**, un modèle, un effort, exécutée comme un **fan-out d'agents** (red-team volontairement
critique en phases S3–S6). Le découpage en sessions suit `WORKFLOW.md` §4a (chaque tâche `high`+ seule ;
changement de modèle/effort = séparation ; une **gate humaine** après S2 avant d'engager le budget Opus).

## Rappels structurants (ne pas re-trancher)

- **Périmètre = cohérence système**, pas re-vérification *ab initio* d'un nœud (couches 1–4 déjà passées).
  On ne re-challenge que les données **partagées / aux coutures** (`VALIDATION_COHERENCE.md` §7).
- **Red-team = mandat de réfuter** ; doute ⇒ « problème » par défaut ; triangulation obligatoire ;
  jamais conclure sur OpenEvidence seul (`VALIDATION_COHERENCE.md` §2).
- **Aucune correction de contenu ici.** Ce plan *produit un rapport* ; les corrections YAML et la
  validation clinique finale (dont D et E, encore brouillon v0.1) sont un plan suivant, alimenté par la
  synthèse S7.
- Sorties écrites sous `docs/decision/validation/` (créé par S1). Aucune n'est du code sauf la **spec**
  de tests produite en S7 (leur codage = suite, cf. TASKS `T-018`).

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée (sortie) | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-011 | Inventaire mécanique (extraction) | Haiku | low | — | `docs/decision/validation/inventaire.json` | [x] |
| [S2](S2.md) | T-012 | Audit de cohérence des **valeurs** + carte | Sonnet | medium | S1 | `docs/decision/validation/carte-coherence.md` | [x] |
| [S3](S3.md) | T-013 | Red-team **données inter-nœuds** (validité EBM globale) | Opus | max | S1, S2 | `docs/decision/validation/findings-donnees.md` | [ ] |
| [S4](S4.md) | T-014 | Vignettes cliniques (génération + confrontation) | Opus | xhigh | S1, S2 | `docs/decision/validation/vignettes/`, `findings-parcours.md` | [ ] |
| [S5](S5.md) | T-015 | Red-team contradictoire (personas hostiles) | Opus | high | S1, S2 | `docs/decision/validation/findings-contradictoire.md` | [ ] |
| [S6](S6.md) | T-016 | Vérification adversariale des findings (anti-faux-positif) | Opus | xhigh | S3, S4, S5 | `docs/decision/validation/findings-confirmes.md` | [ ] |
| [S7](S7.md) | T-017 | Synthèse, priorisation + squelettes de défendabilité | Opus | xhigh | S6 | `docs/decision/validation/RAPPORT.md`, `registres/` | [ ] |

## Ordonnancement

- **Vague 1** : **S1** (inventaire — fonde tout, bon marché).
- **Vague 2** : **S2** (cohérence des valeurs, sur l'inventaire).
- **🚦 Gate humaine (bloquante)** : relire la carte de cohérence S2 ; arbitrer les divergences de valeurs
  triviales vs cliniques ; **go/no-go** sur l'engagement du budget Opus (S3–S7). Décidé avec l'utilisateur.
- **Vague 3 — parallélisable** : **S3 · S4 · S5** (toutes Opus, dépendent de S1/S2, **zones de sortie
  disjointes** : `findings-donnees` / `vignettes`+`findings-parcours` / `findings-contradictoire`).
- **Vague 4 — barrière** : **S6** (vérifie adversarialement l'union des findings S3+S4+S5 ; dédup avant).
- **Vague 5** : **S7** (synthèse + registres).
- **Vague 6 — consolidation** (humain ou Haiku `minimal`, cf. `WORKFLOW.md` §4d) : commit **tâche par
  tâche** des artefacts produits, statuts (`index.md`, `TASKS.md`), `STATUS.md`, puis **un seul push**.

> Deux modes possibles au lancement : **séquentiel** (recommandé au 1er passage — s'arrête à la gate
> après S2) ou **run complet** S1→S7. Le mode conditionne la construction du script Workflow.

## Suite (hors P2)

- **P3 — Remédiation & robustesse** :
  - appliquer les corrections YAML issues de `RAPPORT.md` ; finaliser la validation clinique référent de
    D et E → `valide` ;
  - **coder les tests de non-régression inter-nœuds** (`T-018`, spec produite en S7) ;
  - **catalogue de critères canonique** + **persistance de session partagée des critères** (`T-019`) —
    un seul jeu de valeurs (DFG, HbA1c, poids…) saisi une fois et **partagé entre nœuds**, pour ne pas
    resaisir et **éliminer le risque d'erreur humaine** au passage d'un nœud à l'autre. Bénéfice double :
    UX **et** cohérence (des critères partagés *forcent* l'accord des homonymes révélés en S1/S2).
    ⚠ **Contrainte invariant 1 (`CLAUDE.md`)** : « saisie volatile, aucune persistance, aucun réseau » →
    store **en mémoire de session uniquement** (React/contexte), effacé au rechargement. `sessionStorage`/
    disque = donnée patient au repos → **interdit sans entrée `DECISIONS.md` dédiée**. Décision à acter en P3.
- Module **Veille** (anciennement pressenti « P2 » dans `plans/P1/index.md` §Hors P1) → replanifié **P4**.
