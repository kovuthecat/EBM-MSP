# P6 · SB1 — Le shell : colonne formulaire + colonne résultats sticky   (rédigé par l'orchestrateur)

> **Modèle : Sonnet · effort : high · Vague : 1 (parallèle : oui — S0, SB2)**
> Exécutant : UNIQUEMENT la tâche ci-dessous ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-28 · Branche : —

## Lire (commun à la session)

- `src/features/decision/screens/DecisionNodeScreen.tsx` — **en entier** (681 lignes). C'est LE fichier
  de cette session.
- `design/maquettes/Maquette upgrade UI.zip` — extrais-le (c'est un export Claude Design : un `.dc.html`
  + `support.js` + captures dans `uploads/`) pour voir la disposition à deux colonnes, le seuil de largeur
  (960px), et le bouton flottant mobile « Voir les recommandations ». **Source d'inspiration pour la
  disposition uniquement** — ce fichier code un état figé pour `prescription`, il ne se câble pas tel
  quel ; la logique réelle reste celle déjà dans `DecisionNodeScreen.tsx`.
- `DECISIONS.md` — D31 (contrainte suspend TOUT le panneau), D30/D32 (zéro carte / halte), D25 (plafond
  5 pistes + repli), D24 (`cadrage`), D15 (alertes de nœud).

## Hors périmètre

- **Ne touche pas au comportement** : aucune des règles D30/D31/D32/D25/T-024 (à égalité) ne doit changer
  de résultat, seulement de conteneur visuel. Si en lisant le fichier tu identifies un endroit où le
  déplacement change un comportement observable (ex. un ordre de rendu dont dépendait un test), STOP et
  signale — ne « corrige » rien de ta propre initiative.
- Ne touche pas à `CriteriaForm.tsx` (c'est SB2 — ce composant garde exactement le même contrat d'appel,
  cette session continue de l'invoquer comme aujourd'hui).
- Ne touche pas à `OptionCard.tsx` (c'est SB3 — même principe, appel inchangé).
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P6/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan (`WORKFLOW.md` §4d).

---

## T-036 — Deux colonnes : formulaire à gauche, résultats collants à droite

### Objectif

Remplacer le flux vertical unique actuel par deux colonnes sur écran large (formulaire à gauche,
défilant ; résultats à droite, **sticky**, toujours visibles pendant qu'on remplit le formulaire) — une
seule colonne empilée sur mobile, avec un bouton flottant pour sauter aux résultats.

### Décision clé

C'est le problème mesuré par la recette du 2026-07-28 : jusqu'à 3 écrans de défilement pour voir les 5
cartes d'un nœud multi-options. La maquette Claude Design (nœud `prescription`) le résout par une colonne
de résultats collante. Le moteur produit déjà `familles`/`groupes` de façon identique pour les 6 nœuds
(`ordered-first-match` et `multi-options`) — ce n'est donc pas une redisposition par nœud, une seule
disposition générique s'applique aux 6.

**Répartition retenue** (vérifiée nécessaire en lisant le fichier — adapte les numéros de ligne à l'état
réel, ils bougent avec les sessions précédentes du projet) :
- **Au-dessus des deux colonnes, inchangé** : bouton retour, titre, population cible, `CadrageList`
  (D24 — c'est un cadrage de nœud, pas une donnée patient, il n'a pas sa place dans une colonne qui
  défile avec la saisie).
- **Colonne gauche** : `CriteriaForm` (et le bloc `isPlaceholder` de repli s'il est atteint AVANT que le
  formulaire existe — vérifie où il se déclenche exactement).
- **Colonne droite, sticky** : `AlertList` des alertes de **nœud** (D15) en tête, PUIS tout ce qui suit
  aujourd'hui `CriteriaForm` dans le flux vertical — le branchement D31 (bloc de suspension, qui remplace
  tout le reste UNIQUEMENT à l'intérieur de cette colonne, pas la colonne gauche), sinon le rendu par
  familles (D25, à égalité, plafond), le bloc « en attente », les options écartées/non retenues,
  `ArgumentPanel`. Le footer (date de révision) reste sous les deux colonnes, hors grille.
- **Largeur** : bascule à 960px (comme la maquette). Au-dessus : `display: grid`, deux colonnes
  (`minmax(420px,1fr) minmax(380px,1fr)` ou équivalent proche — ajuste aux contraintes réelles du CSS
  existant), colonne droite en `position: sticky; top: <hauteur du header sticky existant s'il y en a
  un>`. En dessous de 960px : une seule colonne empilée (formulaire puis résultats), **plus** un bouton
  flottant en bas d'écran (« Voir les recommandations (N) ↓ ») qui scrolle jusqu'au début de la colonne
  résultats — masqué si la colonne résultats est déjà dans le viewport (comme la maquette : dérive-le
  d'un état `isNarrow`/largeur de fenêtre, pas d'un scroll listener complexe si un moyen plus simple
  existe déjà dans le projet).

### Lire / Modifier

**Modifier** : `src/features/decision/screens/DecisionNodeScreen.tsx`,
`src/features/decision/screens/DecisionNodeScreen.css` (ou fichier CSS équivalent du dossier).

### Étapes

1. Repère dans le fichier actuel où finit le formulaire et où commence le premier élément à faire
   basculer dans la colonne droite (`AlertList` des alertes de nœud).
2. Introduis deux conteneurs (`<div className="decision-node__form-col">` /
   `<div className="decision-node__results-col">`) et déplace le JSX existant dedans, **sans réordonner
   ni dupliquer aucune condition** (`violations.length > 0`, `isPlaceholder`, etc. restent exactement les
   mêmes tests, seulement dans un autre conteneur).
3. CSS : grille responsive au seuil 960px, colonne droite `sticky`, comportement mobile empilé + bouton
   flottant. Réutilise les tokens existants (`--radius-*`, couleurs `--c-*`) — n'invente aucune nouvelle
   valeur brute là où un token existe déjà.
4. Le compteur du bouton flottant (« Voir les recommandations (N) ») : dérive N du nombre d'options
   réellement rendues dans la colonne droite à cet instant (`vue.familles` aplati, ou équivalent déjà
   calculé dans le fichier) — pas une valeur inventée.
5. Fais tourner la suite complète. Les tests qui interrogent le DOM par position/ordre peuvent casser
   sans qu'il s'agisse d'une régression réelle (le contenu est le même, son enveloppe a changé) —
   vérifie au cas par cas avant de conclure.

### Validation

- Auto (bloque le commit) : `npm test` → tout vert · `npx tsc --noEmit` → 0 erreur · `npm run build` →
  OK.
- N1 visuel auto : `—` (pas d'environnement Desktop dans cette session).
- N2 humain (jugement esthétique/UX) : `—` pour cette session isolée — vérifié en bloc à la vague de
  contrôle (S6), sur les 6 nœuds ensemble.

### Si bloqué

Si un comportement D30/D31/D32/D25/T-024 semble changer en changeant seulement de conteneur (et pas
seulement l'apparence) : STOP, décris exactement ce qui diffère et pourquoi le déplacement seul ne
suffit pas à l'expliquer.

### Message de commit (appliqué en fin de plan, cf. `WORKFLOW.md` §4d)

`feat(ui): deux colonnes — formulaire à gauche, résultats sticky à droite (6 nœuds)`

### Statut

Suivi dans `plans/P6/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode vague parallèle).
