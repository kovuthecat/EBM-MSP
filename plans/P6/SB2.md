# P6 · SB2 — Le formulaire en accordéon (générique, piloté par `groupe`)   (rédigé par l'orchestrateur)

> **Modèle : Sonnet · effort : high · Vague : 1 (parallèle : oui — S0, SB1)**
> Exécutant : UNIQUEMENT la tâche ci-dessous ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-28 · Branche : —

## Lire (commun à la session)

- `src/features/decision/components/CriteriaForm.tsx` — **en entier**. En particulier : la docstring
  ligne 108-111 (« Ordonné par le CONTENU : sections `groupe` dans l'ordre de première apparition »),
  `grouperChamps` (≈ ligne 134) et le rendu `groupes.map(...)` (≈ ligne 436-465) — c'est ce bloc qui
  devient un accordéon, la logique de regroupement elle-même ne change pas.
- `src/features/decision/lib/formLayout.ts` — `grouperChamps`, `decisifsAConfirmer` (l'ensemble
  `aConfirmer` déjà généré, D20) : tu vas devoir le répartir par `groupe` pour les compteurs des chips,
  pas le recalculer.
- `src/features/decision/lib/labels.ts` — `labelForCritere`, `labelForEnumValue`, `describeEnumValue` :
  les mêmes fonctions que le formulaire utilise déjà pour afficher un libellé/une valeur — c'est ce qui
  doit produire les résumés de section, pas une nouvelle logique de formatage.
- `design/maquettes/Maquette upgrade UI.zip` — extrais-le pour voir la disposition (chips de navigation,
  un seul champ déplié à la fois, bouton « Suivant : X → » en bas de chaque section ouverte, résumé
  d'une ligne quand une section est repliée). **Source d'inspiration pour l'INTERACTION uniquement** —
  les résumés du fichier sont écrits à la main pour `prescription` (« Metformine, HbA1c 9%→8%… ») :
  **ne reproduis pas ce texte rédigé**, cf. Décision clé ci-dessous.

## Hors périmètre

- Ne touche pas à la logique de groupement elle-même (`grouperChamps`) au-delà de ce qui est nécessaire
  pour exposer, en plus, un compteur `aConfirmer` par groupe — le regroupement par contenu reste
  invariant 5 (aucun nom de section en dur).
- Ne touche pas à `DecisionNodeScreen.tsx` (c'est SB1 — le contrat d'appel de `CriteriaForm` ne change
  pas : mêmes props en entrée, cette session ne fait que changer son rendu interne).
- Ne touche pas à `OptionCard.tsx` (SB3).
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P6/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan (`WORKFLOW.md` §4d).

---

## T-037 — Sections repliables, une ouverte à la fois, résumé générique

### Objectif

Les sections du formulaire (`groupe`) deviennent des accordéons : une seule ouverte à la fois, une barre
de chips en tête pour naviguer (avec un badge de compteur « à confirmer » par section), un résumé d'une
ligne quand une section est repliée.

### Décision clé

**Résumé générique, pas rédigé** (accepté par Thibault « pour commencer », 2026-07-28) : la ligne de
résumé d'une section repliée liste les champs **renseignés** de ce groupe sous la forme
`Libellé : valeur affichée` (séparés par une ponctuation simple, ex. « · »), en réutilisant
`labelForCritere`/`labelForEnumValue`/`describeEnumValue` — jamais une phrase composée à la main par
nœud (ce serait un texte spécifique à `prescription`, contraire à l'invariant 5 : le composant ne connaît
aucun nom de nœud ni de champ). Si aucun champ du groupe n'est renseigné : un texte fixe générique
(« Aucun champ renseigné » ou équivalent), le même quel que soit le nœud.

**Une seule section ouverte à la fois** (« un seul champ déplié à la fois », bandeau de la maquette) :
ouvrir une section referme les autres. La première section (première `groupe` dans l'ordre de première
apparition) est ouverte par défaut — c'est le « repère de départ » du nœud (cf. commentaire A7 existant
dans le fichier).

**Nœud à une seule section** : si `grouperChamps` ne produit qu'un seul groupe, pas d'accordéon ni de
barre de chips — la section reste simplement toujours ouverte (rien à replier).

### Lire / Modifier

**Modifier** : `src/features/decision/components/CriteriaForm.tsx`, `CriteriaForm.css`,
`src/features/decision/lib/formLayout.ts` (uniquement pour exposer un compteur `aConfirmer` par groupe
si ce n'est pas déjà trivial à calculer côté composant à partir de ce qui existe).

### Étapes

1. Ajoute un état local (`useState`) pour la section actuellement ouverte (index ou libellé de groupe).
   Initialise sur le premier groupe.
2. Rends une barre de chips en tête du formulaire (une par groupe, dans l'ordre) : clic sur un chip ouvre
   ce groupe (referme les autres) et y scrolle. Chaque chip porte le libellé du groupe et, s'il y a des
   champs `aConfirmer` dans ce groupe, un badge de compteur (même registre visuel ambre que l'existant
   « à confirmer », tokens `--c-attention*`).
3. Pour le groupe actuellement ouvert : rendu inchangé (le `<div className="criteria-form__grid">`
   existant). Pour un groupe replié : la ligne de résumé générique (étape ci-dessus) à la place de la
   grille de champs, plus un bouton pour l'ouvrir si ce n'est pas déjà couvert par le clic sur le chip.
4. Ajoute un bouton « Suivant : <groupe suivant> → » en bas de la section ouverte (sauf sur la dernière),
   qui ouvre le groupe suivant dans l'ordre. Absent si un seul groupe.
5. Vérifie qu'aucun champ ne devient invisible par erreur : un champ masqué par `visible_si` reste masqué
   **dans son groupe**, qu'il soit ouvert ou replié — l'accordéon ne doit pas interférer avec la logique
   de visibilité existante (D30, R7/R8).
6. Fais tourner la suite. Les tests qui comptent des éléments DOM par groupe peuvent devoir être adaptés
   pour ouvrir le bon groupe avant d'interroger ses champs — adapte-les, ne les supprime pas.

### Validation

- Auto (bloque le commit) : un test vérifie qu'un groupe replié affiche le résumé générique attendu pour
  un profil donné (au moins un champ renseigné, au moins un groupe vide) ; qu'un seul groupe est ouvert
  à la fois ; qu'un champ masqué par `visible_si` reste absent même dans le groupe ouvert · `npm test` →
  tout vert · `npx tsc --noEmit` → 0 erreur · `npm run build` → OK.
- N1 visuel auto : `—`.
- N2 humain : `—` pour cette session isolée — vérifié à la vague de contrôle (S6).

### Si bloqué

Si un nœud produit un résumé générique manifestement inexploitable (ex. un groupe où tous les champs
renseignés sont des listes très longues, résumé illisible) : ne le corrige pas au jugé — signale le nœud
et le groupe concernés, laisse le résumé générique tel quel (c'est un défaut connu et accepté « pour
commencer », pas une raison de réintroduire du texte par nœud).

### Message de commit (appliqué en fin de plan, cf. `WORKFLOW.md` §4d)

`feat(ui): formulaire en accordéon, sections pilotées par groupe (générique, 6 nœuds)`

### Statut

Suivi dans `plans/P6/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode vague parallèle).
