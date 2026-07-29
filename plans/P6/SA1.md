# P6 · SA1 — Qualifier `action` sur `prescription` (27 options)   (rédigé par l'orchestrateur)

> **Modèle : Sonnet · effort : high · Vague : 2 (parallèle : oui — SA2, SB3)**
> Exécutant : UNIQUEMENT la tâche ci-dessous ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-28 · Branche : —

## Lire (commun à la session)

- `schema/noeud.schema.json` et `src/features/decision/content/node.types.ts` — le champ `Option.action`
  ajouté par S0 (5 valeurs : `ajouter`, `remplacer`, `arreter`, `reduire`, `maintenir`), et sa
  `description` (elle précise le périmètre du champ).
- `content/noeuds/diabete-type-2/prescription.yaml` — **en entier**, au moins une fois avant de modifier
  quoi que ce soit.
- `DECISIONS.md` — D5 (bump de version + changelog obligatoire sur toute modif de nœud).

## Hors périmètre

- **N'introduis aucune nouvelle logique clinique.** `action` est une étiquette descriptive de ce que
  l'option FAIT DÉJÀ (son `intitule`, ses `conditions`, son effet réel) — jamais une nouvelle condition,
  jamais un nouveau seuil, jamais une reformulation du texte existant.
- Ne touche à aucun autre nœud.
- Ne touche pas au moteur ni aux composants.
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P6/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan (`WORKFLOW.md` §4d).

---

## T-038 — Un verbe par option, quand il y en a un

### Objectif

Poser `action` sur chaque option de `prescription` dont l'`intitule` et l'effet réel désignent sans
ambiguïté l'un des 5 verbes.

### Décision clé

Vérifié le 2026-07-28 (avant ce plan) : la quasi-totalité des 27 options de ce nœud commencent déjà par
un verbe reconnaissable — « Arrêter… », « Réduire la posologie… », « Introduire… », « Remplacer… »,
« Suspendre… ». **Ce champ est optionnel option par option, pas seulement nœud par nœud** : une option
dont l'action réelle ne se résume pas proprement à un seul des 5 verbes **reste sans `action`** — ne
force jamais un mappage approximatif, un badge absent est préférable à un badge faux.

**Table de correspondance des synonymes rencontrés dans ce fichier** (base-toi sur le SENS de l'option,
cette table n'est qu'un point de départ, pas une règle mécanique à appliquer sans lire) :
- `arreter` : Arrêter, Suspendre, Interrompre.
- `ajouter` : Introduire, Ajouter, Instaurer (un traitement absent).
- `remplacer` : Remplacer (un traitement par un autre).
- `reduire` : Réduire la posologie, Diminuer, Désintensifier (allègement, pas arrêt).
- `maintenir` : Poursuivre, Continuer (un traitement déjà en place, sans le modifier).

**Cas prévisible à ne PAS forcer** : l'option socle (« Metformine (socle du traitement) — instaurer ou
poursuivre » ou libellé proche) couvre à la fois « initier » et « poursuivre » selon l'intention du
patient — un seul verbe statique ne peut pas être fidèle aux deux à la fois. **Laisse `action` absent sur
cette option précise** plutôt que de choisir arbitrairement entre `ajouter` et `maintenir` ; documente ce
choix dans ton rapport de tâche, ne le signale pas comme un blocage (c'est prévu).

### Lire / Modifier

**Modifier** : `content/noeuds/diabete-type-2/prescription.yaml` (ajout du champ `action` sur les options
concernées, bump de version + changelog).

### Étapes

1. Parcours les 27 options dans l'ordre du fichier. Pour chacune : lis l'`intitule` **et** les
   `conditions`/le sens clinique réel (pas seulement le premier mot du titre — « Optimiser l'agent mal
   toléré : réduire la posologie… ou remplacer » mélange deux verbes possibles dans le même intitulé,
   lis la suite du texte et les `conditions` pour trancher, ou laisse `action` absent si le texte
   lui-même hésite entre deux verbes).
2. Pose `action: <verbe>` sur les options non ambiguës.
3. Pour toute option où le choix n'est pas évident après lecture complète (pas seulement le cas socle
   déjà prévu ci-dessus) : laisse `action` absent, note-la dans ton rapport de tâche avec le motif du
   doute — ce sera reporté au référent (Thibault) plutôt que tranché ici.
4. Bump de version + changelog (D5) : décris l'ajout comme une qualification descriptive (pas une
   décision clinique nouvelle), liste dans le changelog le nombre d'options qualifiées et le nombre
   laissées sans `action` (avec renvoi à ton rapport de tâche pour le détail).
5. Valide le schéma (Ajv) et fais tourner la suite.

### Validation

- Auto (bloque le commit) : `npm test` → tout vert · `npx tsc --noEmit` → 0 erreur · `npm run build` →
  OK · validation Ajv du nœud `prescription` → OK.
- Auto : un test (nouveau ou étendu) vérifie que toute `action` posée est cohérente avec le vocabulaire
  attendu (les 5 valeurs), et peut lister les options sans `action` pour visibilité — pas un échec, une
  information.

### Si bloqué

Rien de bloquant à proprement parler pour cette tâche (le champ est optionnel partout) — le mécanisme de
repli est « laisse `action` absent et documente », pas un STOP. N'arrête la session que si le schéma
lui-même (S0) semble incohérent ou absent — dans ce cas seulement, STOP et signale.

### Message de commit (appliqué en fin de plan, cf. `WORKFLOW.md` §4d)

`feat(contenu): prescription — badge action sur les options qui le portent`

### Statut

Suivi dans `plans/P6/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode vague parallèle).
