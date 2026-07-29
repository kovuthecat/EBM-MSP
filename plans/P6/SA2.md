# P6 · SA2 — Qualifier `action` sur `insuline` (12 options)   (rédigé par l'orchestrateur)

> **Modèle : Sonnet · effort : medium · Vague : 2 (parallèle : oui — SA1, SB3)**
> Exécutant : UNIQUEMENT la tâche ci-dessous ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-28 · Branche : —

## Lire (commun à la session)

- `schema/noeud.schema.json` et `src/features/decision/content/node.types.ts` — le champ `Option.action`
  ajouté par S0 (5 valeurs : `ajouter`, `remplacer`, `arreter`, `reduire`, `maintenir`).
- `content/noeuds/diabete-type-2/insuline.yaml` — **en entier**, au moins une fois avant de modifier quoi
  que ce soit.
- `plans/P6/SA1.md` — la table de correspondance des synonymes et la règle « un badge absent est
  préférable à un badge faux » : même méthode, appliquée ici à `insuline`.
- `DECISIONS.md` — D5 (bump de version + changelog obligatoire).

## Hors périmètre

- **N'introduis aucune nouvelle logique clinique.** `action` décrit ce que l'option FAIT DÉJÀ — jamais
  une nouvelle condition, jamais un nouveau seuil.
- Ne touche à aucun autre nœud.
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P6/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan (`WORKFLOW.md` §4d).

---

## T-039 — Un verbe par option, quand il y en a un

### Objectif

Poser `action` sur chaque option d'`insuline` dont l'intitulé et l'effet réel désignent sans ambiguïté
l'un des 5 verbes.

### Décision clé

Même méthode que `plans/P6/SA1.md` (T-038) — reprends sa table de correspondance des synonymes. Champ
optionnel option par option : ne force aucun mappage approximatif. `insuline` est un nœud routé par
`situation_insuline` (4 situations) où « plusieurs recommandations s'empilent » (D13) — certaines options
portent des verbes d'ajustement fin (« Ajouter un bolus », « Corriger l'hypoglycémie — réduire la dose »)
qui devraient se qualifier sans difficulté particulière.

### Lire / Modifier

**Modifier** : `content/noeuds/diabete-type-2/insuline.yaml` (ajout du champ `action`, bump de version +
changelog).

### Étapes

1. Parcours les 12 options dans l'ordre du fichier. Pour chacune : lis l'`intitule` **et** les
   `conditions`/le sens clinique réel.
2. Pose `action: <verbe>` sur les options non ambiguës.
3. Pour toute option où le choix n'est pas évident : laisse `action` absent, note-la dans ton rapport de
   tâche avec le motif du doute.
4. Bump de version + changelog (D5), même forme que SA1 (nombre qualifié / nombre laissé sans `action`).
5. Valide le schéma (Ajv) et fais tourner la suite.

### Validation

- Auto (bloque le commit) : `npm test` → tout vert · `npx tsc --noEmit` → 0 erreur · `npm run build` →
  OK · validation Ajv du nœud `insuline` → OK.

### Si bloqué

Rien de bloquant à proprement parler (champ optionnel partout, repli = laisser `action` absent et
documenter). STOP uniquement si le schéma (S0) semble incohérent ou absent.

### Message de commit (appliqué en fin de plan, cf. `WORKFLOW.md` §4d)

`feat(contenu): insuline — badge action sur les options qui le portent`

### Statut

Suivi dans `plans/P6/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode vague parallèle).
