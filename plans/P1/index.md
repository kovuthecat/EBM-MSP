# Plan P1 — MVP module Décision (walking skeleton + nœud A « Cible glycémique »)   (rédigé par Opus)

## Objectif d'ensemble

Livrer le module **Décision** en application statique fonctionnelle : coquille (shell + accueil +
méthode), pipeline de contenu (JSON Schema + YAML + validation), moteur de règles générique testé, et
les écrans D2 (domaines + liste des nœuds) et D3 (nœud interrogeable) câblés sur la **maquette**, avec
le **nœud A « Cible glycémique »** comme preuve de concept. Le module Veille (V1–V5, Supabase) et les
nœuds B→H sont **hors P1** (plans ultérieurs).

Référence visuelle/interaction : `design/maquettes/prototype-ebm-msp-neuf-crans/project/MSP Menilmontant.dc.html`
(à recréer, pas à copier). Autorité du contenu clinique : `docs/decision/BRIEF_DECISION.md` §10–11.
Choix techniques verrouillés : `DECISIONS.md` **D9** ; caractère générique multi-domaine : **D8**.

## Rappels structurants (ne pas re-trancher)

- **Contenus cliniques du prototype = illustratifs.** Le nœud A s'écrit depuis le brief §11 (essais
  réels ACCORD/ADVANCE/VADT/UKPDS/Boussageon, GRADE, dur vs substitution), **jamais** copié du prototype.
- **Moteur générique** : aucun domaine ni nœud connu par son nom ; tout est piloté par le contenu.
  Le `decideTier` en dur du prototype est à **généraliser** en évaluateur de `conditions` (S3).
- **Zéro persistance, zéro réseau** dans le module Décision. Deps : cf. D9 (state-based, pas de routeur ;
  devDeps `@modyfi/vite-plugin-yaml` + `ajv` autorisées).

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-001, T-008 | Scaffold + tokens + shell + Accueil (D1) + Méthode (S1) | Sonnet | medium | — | racine (config), `src/main`, `src/App`, `src/features/shared/`, `src/styles/`, `public/` | [x] |
| [S2](S2.md) | T-002, T-004, T-007 | JSON Schema nœud + import YAML + contenu nœud A (sourcé) | Sonnet | high | S1 | `schema/`, `content/`, `src/features/decision/content/`, `vite.config.ts` | [x] |
| [S3](S3.md) | T-003 | Moteur de règles (évaluateur de `conditions`) + tests Vitest | Sonnet | high | S2 | `src/features/decision/engine/` | [x] |
| [S4](S4.md) | T-005, T-006 | UI Décision : D2 (domaines + nœuds) + D3 (form → options → argumentaire) | Sonnet | high | S1, S2, S3 | `src/features/decision/screens/`, `src/features/decision/components/` | [x] |

## Ordonnancement

- **Vague 1** : **S1** (fonde le projet — scaffold, tokens, shell). Rien ne tourne avant.
- **Vague 2** : **S2** (a besoin du scaffold pour le plugin YAML + la validation Ajv).
- **Vague 3** : **S3** (a besoin des types de contenu + du schéma fixés en S2).
- **Vague 4** : **S4** (câble les écrans sur shell + contenu + moteur).
- **Vague 5 — consolidation** (humain ou session Haiku `minimal`) : commits **tâche par tâche** (messages
  dans chaque `T<n>`), statuts (`index.md`, `TASKS.md`), `STATUS.md`, `VALIDATION.md`, puis **un seul push**.

> P1 est volontairement **linéaire** (greenfield : chaque maillon dépend du précédent). Lancement solo,
> une session à la fois, `/clear` entre chacune. Aucune session ne comm`it`/pushe pendant l'exécution
> (cf. `WORKFLOW.md` §4d) — tout est consolidé en vague 5.

## Clôture P1 (2026-07-22)

Squelette logiciel livré et validé (`npm run build` + `npm run typecheck` + `npm test` → 23/23 verts) :
scaffold, JSON Schema + import YAML + validation Ajv, moteur de règles générique + tests, écrans D2/D3
câblés. Commits atomiques par tâche (cf. `TASKS.md`).

⚠️ **Contenu du nœud A gelé, pas ré-encodé.** Pendant l'exécution de S2→S4, un chantier parallèle
(dossier de preuve `docs/decision/noeuds/A-cible-glycemique.md` + vérification indépendante 2 passes
`.verification-p2.md`) a conclu **« NON prêt à encoder »** sur la version brief §11 utilisée par T-007,
avec des corrections bloquantes (variable `age` jamais utilisée, CV établi mal routé, conditions non
disjointes — cf. `.verification-p2.md` §2/§5b) et un nouveau critère `antecedent_cv`. Décision prise avec
l'utilisateur : consolider le squelette tel quel, `content/noeuds/diabete-type-2/cible-glycemique.yaml`
reste `statut: brouillon` **explicitement périmé** — ne pas le considérer validé. Suite : **T-007bis**
(ré-encoder depuis le dossier une fois les décisions référent actées) avant tout passage à `valide`.
La question ouverte de sémantique moteur (S3 = « plusieurs options applicables, 1re gagne » ; le dossier
propose pour ce nœud un mode **« ordered-first-match » à sortie unique**, distinct des nœuds B/C
multi-options) reste à trancher au moment du ré-encodage — impact potentiel sur `evaluateNode`/schéma.

**Mise à jour — T-007bis fait (2026-07-22).** Nœud A ré-encodé depuis le dossier après validation des 3
arbitrages par le référent : bandes HAS < 9 / ≤ 8 / ~6,5 / ≤ 7, critères `antecedent_cv` + `comorbidite_grave`,
borne `age < 70` sur le strict, `divergence:true`. **Sémantique moteur tranchée** : `selection:
ordered-first-match` (sortie unique) ajouté au schéma + `evaluateNode` (les nœuds B/C restent en
`multi-options`). `content/…/cible-glycemique.yaml` **v2.0 `statut: valide`** · build + **27/27 tests verts**.

## Hors P1 (plans suivants)

- **P2** — Module Veille : V1 (liste filtrable), V2 (détail), + Supabase (auth V5, profil V3, pour
  mémoire V4), pont article↔nœud. Réévaluer le besoin d'un routeur.
- **P3+** — Nœuds B→H du DT2 (un lot par nœud), puis nouveaux domaines de décision.
