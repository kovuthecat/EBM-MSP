# Plan P16 — Refonte des skills de recherche (D65, option C)   (rédigé par Opus)

Workflow : v0.43.0

## Objectif d'ensemble

Aujourd'hui, les circuits de recherche de preuve tranchent au jugement des questions qu'un appel
d'API règle en une seconde : l'accès à un article, l'identité d'un PMID, une rétractation. Leurs
règles divergent aussi de `00-global.md`, et leur chemin vers OpenEvidence est mort. À la fin de ce
plan :

- les skills s'appuient sur des **scripts déterministes** et sur **trois agents dédiés** ;
- chaque règle a **un seul domicile** ;
- une nouvelle skill **`construire-module-decision`** existe ;
- un **corpus d'épreuve** tiré de vrais incidents mesure les anciennes et les nouvelles skills.
  Tu sauras ce que chaque couche a apporté, et qu'aucun cas qui passait ne casse.

Entrée : `docs/commun/2026-09-16-propositions-skills-recherche.md` §14, §13.3, §8, §10 et §11.
Arbitrages du 2026-09-24 :

- **pas de hook OE** : la règle reste écrite ;
- **configuration 2 à invite recomposée** ;
- **on continue** si le corpus ne discrimine pas ;
- **mesure complète**.

**Aucune requête OpenEvidence n'est consommée par ce plan.**

**Règle de verdict des épreuves** (appliquée par le harnais, S4) :

- chaque cas tourne 2 fois par configuration ;
- **réussi** = 2/2 ;
- **échoué** = 0/2 ;
- 1/2 impose une 3e exécution : 2/3 réussi, 1/3 échoué ;
- **régression** = réussi avec les skills actuelles (configuration 1), puis échoué avec les
  nouvelles skills et agents dédiés (configuration 3) ;
- une exécution qui a tenté une lecture interdite, ou atteint github.com, est **invalidée** et
  rejouée ; elle ne compte ni pour ni contre.

**Risques du plan** :

- *Corpus plat* — les skills actuelles réussissent presque tout. Arbitré : on continue, et la mesure
  ne vaut plus que comme non-régression. Le gain par couche est alors déclaré « non mesurable sur ce
  corpus ». Réfuté par la mesure de référence S4, si au moins 3 cas échouent en configuration 1.
- *Épreuves non aveugles* — les rapports correcteurs sont dans le dépôt, et le dépôt est public sur
  GitHub. Deux gardes : le canari du harnais (S4) et l'analyse des transcriptions. Réfuté si une
  exécution valide cite une valeur-signature sans l'avoir lue dans une pièce de l'export. Le
  correcteur le signale ; la mesure est alors reprise sur ce cas, isolé.
- *Sous-agents dans `claude -p`* — un agent lancé par un circuit doit hériter des refus de l'export.
  Le canari de S4 le teste explicitement. S'il échoue, le harnais ne mesure pas, et S4 rend un
  `FAIL` de nature prémisse.
- *Coût* — environ 75 à 90 exécutions `claude -p`. S4 mesure le coût réel par exécution. S10
  s'arrête sur question si la dépense dépasse le double de l'estimation.

## Sessions
| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut | Message de commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T1 | Rendre N0 exécutable | Haiku | low | — | — | `.claude/n0.json` | [x] | `chore(n0): déclarer les commandes N0 du projet` |
| [S2](S2.md) | T2-T3 | Corpus d'épreuve tiré des incidents | Opus | high | — | S1 | `docs/commun/epreuves-recherche/README.md`, `docs/commun/epreuves-recherche/cas/` | [ ] | voir Ordonnancement |
| [S3](S3.md) | T4 | Mémo d'arbitrage du statut de `CONSTRUIRE-UN-MODULE.md` | Opus | high | — | S1 | `docs/decision/ARBITRAGE-construire-un-module.md` | [ ] | voir Ordonnancement |
| [S4](S4.md) | T5-T6 | Harnais d'épreuve isolé et mesure de référence | Sonnet | high | — | S2 | `docs/commun/epreuves-recherche/harnais/`, `docs/commun/epreuves-recherche/mesures/` | [ ] | voir Ordonnancement |
| [S5](S5.md) | T7-T8 | Scripts `identite.mjs` et `verifier-registre.mjs` | Sonnet | high | — | S1 | `.claude/skills/recherche-source-primaire/scripts/`, `.claude/skills/recherche-source-primaire/references/registre-affirmations.md` | [ ] | voir Ordonnancement |
| [S6](S6.md) | T9-T11 | Socle : accès, registre, OpenEvidence, leçons, SKILL.md | Opus | high | — | S4, S5 | `.claude/skills/recherche-source-primaire/SKILL.md`, `.claude/skills/recherche-source-primaire/references/{acces-identite,registre-affirmations,openevidence,lecons}.md`, `DECISIONS.md`, `docs/commun/2026-09-16-propositions-skills-recherche.md` | [ ] | voir Ordonnancement |
| [S7](S7.md) | T12 | Socle : contradiction et consolidation | Opus | high | — | S4, S5 | `.claude/skills/recherche-source-primaire/references/{contradiction,consolidation}.md` | [ ] | voir Ordonnancement |
| [S8](S8.md) | T13-T15 | Agents dédiés et réécriture des deux circuits | Opus | high | — | S6, S7 | `.claude/agents/{extracteur,contradicteur,reconciliateur}-preuve.md`, `.claude/skills/recherche-preuve-triangulee/SKILL.md`, `.claude/skills/verif-source-veille/SKILL.md` | [ ] | — |
| [S9](S9.md) | T16-T17 | Mode d'emploi OE, renvois, tri-boite-mail | Sonnet | medium | — | S8 | `docs/commun/OUTIL-INTERFACE-OE.md`, `.claude/skills/tri-boite-mail/SKILL.md`, `CLAUDE.md`, `docs/decision/00-global.md`, `docs/decision/CONSTRUIRE-UN-MODULE.md` (l.218-222), `docs/veille/SOP_veille.md`, `docs/veille/TRI_BOITE_MAIL.md`, `PROJECT_MAP.md` | [ ] | — |
| [S10](S10.md) | T18-T19 | Mesure finale à trois configurations | Sonnet | high | — | S4, S9 | `docs/commun/epreuves-recherche/harnais/`, `docs/commun/epreuves-recherche/mesures/` | [ ] | voir Ordonnancement |
| [S11](S11.md) | T20-T21 | Arbitrage appliqué et skill `construire-module-decision` | Opus | high | — | S3, S9 | `docs/decision/CONSTRUIRE-UN-MODULE.md` (statut et sections arbitrées), `DECISIONS.md`, `.claude/skills/construire-module-decision/`, `docs/commun/epreuves-recherche/cas-module/`, `CLAUDE.md`, `PROJECT_MAP.md` | [ ] | voir Ordonnancement |
| [S12](S12.md) | T22 | Épreuves de la skill module | Sonnet | high | — | S10, S11 | `docs/commun/epreuves-recherche/mesures/` | [ ] | — |

<!-- Statut : [ ] à faire · [x] fait, revue sans bloquant · [x]! fait, revue à bloquant non trié -->
<!-- Vocabulaire complet : WORKFLOW.md §4a — ne pas inventer d'autre marque ici. -->

## Ordonnancement

- **Vague 1** : S1.
  *Pourquoi maintenant* : sans `.claude/n0.json`, le contrôle N0 sort en erreur. Aucun commit des
  onze sessions suivantes ne pourrait alors passer sa porte.
  - **S1** — Le contrôle automatique (build, typecheck, tests) devient lançable d'une commande. Tu
    le verras dans le bilan de S1 : `n0.mjs` sort en vert, avec la durée de chaque étape.

- **Vague 2 — parallélisable · validation-humaine** : S2 · S3 (zones disjointes, aucune dépendance
  entre elles).
  *Pourquoi maintenant* : les deux produisent ce que toi seul peux valider. En les menant de front,
  tes deux jugements tombent au même arrêt au lieu de deux, et on gagne la durée du mémo (environ
  une heure). Sans résultats attendus validés, la mesure de S4 noterait contre une référence non
  relue.
  - **S2** — Une douzaine de cas d'épreuve, tirés des incidents réels du dépôt (§13.3). Chacun a
    son énoncé, son résultat attendu, les fichiers qui en contiennent la réponse (cachés pendant
    l'épreuve) et ses « mots-signatures ». À l'arrêt, tu relis les résultats attendus dans
    `docs/commun/epreuves-recherche/README.md` et tu coches « validé ».
  - **S3** — Un mémo qui trie `CONSTRUIRE-UN-MODULE.md` en trois colonnes : obligations déjà actées,
    procédé encore à arbitrer, passages devenus historiques. À l'arrêt, tu coches ton arbitrage
    dans le mémo ; S11 l'appliquera.
  - Messages de commit :
    - S2/T2 `docs(epreuves): corpus d'épreuve des skills de recherche` + `Plan: P16/S2/T2`
    - S2/T3 `docs(epreuves): admissibilité des cas et index de validation` + `Plan: P16/S2/T3`
    - S3/T4 `docs(decision): mémo d'arbitrage du statut de CONSTRUIRE-UN-MODULE` + `Plan: P16/S3/T4`

- **Vague 3 — parallélisable** : S4 · S5 (zones disjointes).
  *Pourquoi maintenant* : la mesure de référence doit porter sur les skills **avant** toute
  réécriture. Elle dure plusieurs heures d'exécutions `claude -p`, et les scripts de S5 n'en
  dépendent pas. En parallèle, on gagne toute la durée de S5.
  - **S4** — Un harnais lance chaque épreuve dans une copie isolée du dépôt. Il interdit lecture du
    dépôt, GitHub, PowerShell et OpenEvidence, et le prouve par un test canari avant de mesurer.
    Puis il mesure les skills actuelles. Tu le verras dans
    `docs/commun/epreuves-recherche/mesures/` : verdict par cas, coût et durée.
  - **S5** — Deux commandes. Pour un DOI ou un PMID, `identite.mjs` rend les identifiants recoupés,
    l'accès ouvert légal, une rétractation éventuelle, les publications du même essai et le préprint
    lié. `verifier-registre.mjs` refuse un registre d'affirmations incomplet ou un NNT sans statut.
    Tu les verras dans leurs tests, verts dans N0.
  - Messages de commit :
    - S4/T5 `feat(epreuves): harnais claude -p isolé, canari et verdicts` + `Plan: P16/S4/T5`
    - S4/T6 `docs(epreuves): mesure de référence des skills actuelles` + `Plan: P16/S4/T6`
    - S5/T7 `feat(recherche): script identite.mjs et ses tests` + `Plan: P16/S5/T7`
    - S5/T8 `feat(recherche): script verifier-registre.mjs et format du registre` + `Plan: P16/S5/T8`

- **Vague 4 — parallélisable** : S6 · S7 (fichiers disjoints du même socle).
  *Pourquoi maintenant* : le socle s'écrit sur les scripts (S5) et sur ce que la référence a montré
  (S4). Par exemple, la passe d'omission n'entre que si S4 a mesuré des omissions. Deux sessions de
  rédaction longues en parallèle : environ la moitié du temps de la vague.
  - **S6** — La marche à suivre de l'accès et de l'identité, du registre, d'OpenEvidence et des
    leçons tirées des incidents, chacune à son seul domicile. D65 est amendée : pas de hook, règle
    écrite. Tu le verras en ouvrant `recherche-source-primaire` : une page d'entrée courte, qui
    renvoie à ses références.
  - **S7** — Comment contredire (lecture indépendante d'abord), et comment consolider plusieurs
    rapports (§10) : les deux références que les agents chargeront.
  - Messages de commit :
    - S6/T9 `docs(recherche): références accès-identité et registre du socle` + `Plan: P16/S6/T9`
    - S6/T10 `docs(recherche): référence OpenEvidence, leçons, amendement D65` + `Plan: P16/S6/T10`
    - S6/T11 `docs(recherche): SKILL.md du socle recherche-source-primaire` + `Plan: P16/S6/T11`
    - S7/T12 `docs(recherche): références contradiction et consolidation` + `Plan: P16/S7/T12`

- **Vague 5** : S8.
  *Pourquoi maintenant* : les agents chargent le socle, qui doit donc exister avant eux.
  - **S8** — Trois agents dédiés : extraction, contradiction, réconciliation. Chacun a ses consignes
    stables et son modèle fixé. Les circuits Décision et Veille sont réécrits pour les lancer. Tu le
    verras dans `.claude/agents/` et dans les deux skills, plus courtes.

- **Vague 6** : S9.
  *Pourquoi maintenant* : les renvois décrivent les circuits réécrits ; les écrire avant
  décrirait l'ancien fonctionnement.
  - **S9** — Le mode d'emploi OE donne le bon chemin et documente `--modele`. Les documents qui
    citent les skills décrivent le nouveau fonctionnement. `tri-boite-mail` relève DOI et numéro
    d'essai.

- **Vague 7 — parallélisable** : S10 · S11 (zones disjointes).
  *Pourquoi maintenant* : la mesure finale et la skill module ne dépendent l'une de l'autre que par
  le nom des circuits, déjà figé. La mesure dure plusieurs heures ; la mener de front avec la
  rédaction de la skill économise toute la durée de S11.
  - **S10** — Chaque circuit est déroulé une fois à blanc, puis le corpus est mesuré sur les
    nouvelles skills avec agents génériques, et avec agents dédiés. Tu le verras dans
    `docs/commun/epreuves-recherche/mesures/` : les régressions éventuelles, et le gain attribué au
    contenu d'une part, aux agents dédiés d'autre part.
  - **S11** — Ton arbitrage du mémo S3 est appliqué à `CONSTRUIRE-UN-MODULE.md`. Puis la skill
    `construire-module-decision` est écrite : elle aiguille une demande de nouveau module, respecte
    les portes P0→P7 et appelle les circuits au bon moment. Ses épreuves sont prêtes.
  - Messages de commit :
    - S10/T18 `feat(epreuves): configurations 2 et 3, déroulé à blanc des circuits` + `Plan: P16/S10/T18`
    - S10/T19 `docs(epreuves): mesure finale à trois configurations` + `Plan: P16/S10/T19`
    - S11/T20 `docs(decision): statut de CONSTRUIRE-UN-MODULE arbitré` + `Plan: P16/S11/T20`
    - S11/T21 `feat(skills): construire-module-decision et ses épreuves` + `Plan: P16/S11/T21`

- **Vague 8** : S12.
  *Pourquoi maintenant* : les épreuves portent sur la skill écrite en S11 et réutilisent le
  harnais complété en S10.
  - **S12** — Les huit épreuves de §11.5 sont jouées sur la skill module. Exemples : demande
    ambiguë, référent absent, tentation de lancer OE trop tôt, reprise après interruption. Tu le
    verras dans un rapport d'épreuves.

- **Vague 9 — clôture** : contexte (`STATUS.md`, `TASKS.md`, `VALIDATION.md` — dont les items N2
  restés dans les bilans des vagues verrouillées : S2, S3, S10, S11) et push. Pas de commits de code
  à rattraper : chaque session a commité les siens, ou l'orchestrateur en fin de vague verrouillée.
