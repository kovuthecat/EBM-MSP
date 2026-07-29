# P6 · SB3 — La carte compacte : badge verbe + contre-indications dans le dépli   (rédigé par l'orchestrateur)

> **Modèle : Sonnet · effort : high · Vague : 2 (parallèle : oui — SA1, SA2)**
> Exécutant : UNIQUEMENT la tâche ci-dessous ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-28 · Branche : —

## Lire (commun à la session)

- `src/features/decision/components/OptionCard.tsx` — **en entier** (191 lignes). Ordre actuel du
  rendu, fixé par T-025 (P4) : titre+badges → **contre-indications** → doses → alertes d'option →
  « proposé parce que » → motif de rang → `<details>` (effet attendu, délai, avantages/inconvénients).
- `src/features/decision/components/OptionCard.css`, `AlertList.css` (registre visuel de sécurité,
  tokens `--c-disclaimer-*`).
- `src/styles/tokens.css` — **en entier** (60 lignes). Note l'en-tête : les valeurs sont reprises du
  prototype Claude Design, à ne pas modifier « sans repasser par le prototype ». `design/maquettes/
  Maquette upgrade UI.zip` **fait office de ce prototype** pour les couleurs d'action ci-dessous — les
  valeurs `oklch(...)` qu'il contient pour vert/orange/rouge/bleu sont la source, ne les réinvente pas.
- `content/node.types.ts` (`ActionOption`, ajouté par S0).

## Hors périmètre

- Ne touche pas à `DecisionNodeScreen.tsx` (SB1) — `OptionCard` garde EXACTEMENT sa signature de props
  actuelle (aucune nouvelle prop requise) : cette session ne change que le rendu interne.
- Ne touche à aucun contenu clinique.
- N'introduis aucune dépendance de librairie (popover, tooltip). Le `<details>` natif existant suffit.
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P6/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan (`WORKFLOW.md` §4d).

---

## T-040 — Bordure couleur par verbe + contre-indications dans le dépli existant

### Objectif

Deux changements sur `OptionCard` : (a) une bordure gauche colorée selon `option.action` quand ce champ
est présent (sinon comportement actuel, inchangé) ; (b) les contre-indications rejoignent le `<details>`
déjà existant, en première position, avec un indicateur visible même carte fermée.

### Décision clé

**(a) Couleurs, reprises du prototype Claude Design** (`Maquette upgrade UI.zip`, valeurs déjà validées
visuellement par Thibault dans cette maquette) :
- `ajouter` → vert `oklch(55% 0.15 145)`
- `remplacer` → orange `oklch(60% 0.16 55)`
- `arreter` → rouge `oklch(55% 0.18 25)`
- `maintenir` → réutilise le token existant `--c-accent-decision` (déjà `oklch(46% 0.09 254)`, même
  teinte que celle du prototype pour « Maintenir » — pas une nouvelle couleur).
- `reduire` → **absent du prototype** (il ne portait que 4 verbes) : choisis une 5ᵉ teinte OKLCH
  distincte des 4 précédentes, même luminosité/chroma approximative (`L≈55-60%`, `C≈0.12-0.18`), à une
  teinte clairement séparée (ex. violet/magenta, `H≈320-340`) pour rester discriminable en clignotement
  périphérique (registre déjà exigé ailleurs dans l'app, cf. badges de preuve).
- Ajoute ces 5 valeurs comme nouveaux tokens `--c-action-ajouter`, `--c-action-remplacer`,
  `--c-action-arreter`, `--c-action-reduire` dans `tokens.css` (`--c-action-maintenir` n'est pas
  nécessaire, réutilise `--c-accent-decision` directement). **Sans `action`** (les 4 autres nœuds, et les
  options de `prescription`/`insuline` volontairement laissées sans verbe) : bordure inchangée
  (comportement actuel de la carte, pas de couleur ajoutée).

**(b) Contre-indications** (tension avec T-025 tranchée par Thibault le 2026-07-28 : compactage accepté,
mais pas au prix de l'accessibilité) : retire le bloc contre-indications de sa position actuelle
(juste sous le titre) et place-le **en première position à l'intérieur du `<details>` existant**, dans
le même registre visuel de sécurité qu'aujourd'hui (bordure/fond `--c-disclaimer-*`, pas fondu dans le
reste du dépli). Le `<summary>` du `<details>` **change de libellé selon la présence de
contre-indications** : par exemple « Contre-indications, effet attendu et plus » quand elles existent,
« Effet attendu, avantages et inconvénients » sinon — c'est le seul indicateur requis en carte fermée,
du texte natif du `<summary>`, aucun nouveau composant. Pas d'infobulle au survol (`title` HTML) : le
`<details>` natif est déjà utilisable au clic, au tactile et au clavier.

### Lire / Modifier

**Modifier** : `src/features/decision/components/OptionCard.tsx`, `OptionCard.css`,
`src/styles/tokens.css`.

### Étapes

1. `tokens.css` : ajoute les 4 nouveaux tokens `--c-action-*` (valeurs ci-dessus).
2. `OptionCard.tsx` : calcule la couleur de bordure à partir de `option.action` (`maintenir` →
   `--c-accent-decision`, les 4 autres → leur token dédié, absent → comportement actuel inchangé — ne
   change pas la bordure des cartes sans `action`).
3. Déplace le bloc contre-indications de sa position actuelle (après titre/badges) vers l'intérieur du
   `<details>`, en tête, avant l'effet attendu. Conserve son registre visuel (`--c-disclaimer-*`).
4. Calcule le libellé du `<summary>` selon la présence de `option.contre_indications` (non vide).
5. Vérifie que le repli d'affichage existant (`replierAffichage.ts`, invariants I16-I19 — une carte
   `role: securite` n'est jamais repliée) n'est pas affecté : ce mécanisme concerne le repli de la carte
   ENTIÈRE dans « Autres pistes possibles », pas le `<details>` interne — les deux sont indépendants,
   vérifie-le plutôt que de le supposer.
6. Fais tourner la suite. Les tests qui vérifient la position DOM des contre-indications (T-025, P4)
   vont casser — c'est attendu, mets à jour leurs attentes pour refléter le nouvel emplacement (dans le
   `<details>`), ne les supprime pas et ne les affaiblis pas silencieusement.

### Validation

- Auto (bloque le commit) : un test vérifie que le libellé du `<summary>` change selon la présence de
  contre-indications, qu'elles sont bien rendues en premier dans le contenu du `<details>` avec leur
  registre visuel, et que la bordure colorée reflète `option.action` (les 5 cas + le cas absent) ·
  `npm test` → tout vert · `npx tsc --noEmit` → 0 erreur · `npm run build` → OK.
- N1 visuel auto : `—`.
- N2 humain : `—` pour cette session isolée — vérifié à la vague de contrôle (S6). Point d'attention à
  transmettre explicitement pour S6 dans ton rapport de tâche : le test des 20 secondes (T-025) doit être
  **rejoué** avec ce nouvel emplacement — c'est exactement la mesure qui dira si compacter les
  contre-indications a coûté ce que T-025 avait gagné.

### Si bloqué

Si le repli d'affichage (étape 5) s'avère réellement coupler carte-entière et `<details>` interne d'une
façon qui n'était pas documentée : STOP, décris le couplage trouvé.

### Message de commit (appliqué en fin de plan, cf. `WORKFLOW.md` §4d)

`feat(ui): carte compacte — bordure par verbe d'action, contre-indications dans le dépli`

### Statut

Suivi dans `plans/P6/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode vague parallèle).
