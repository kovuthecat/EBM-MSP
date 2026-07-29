# P6 · SB6 — Habiller le résumé fermé des contre-indications (défaut grave S6, point 3)   (ajoutée en cours de plan, suite au rapport S6 du 2026-07-29)

> **Modèle : Sonnet · effort : high · Vague : 4 bis (parallèle : oui, avec SB7)**
> Exécutant : UNIQUEMENT la tâche ci-dessous ; fichiers sous « Lire » / « Modifier ».
> Design fixé par Thibault (2026-07-29, réponse directe) — ne reconçois pas au-delà de ce cadrage.
> Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-29 · Branche : —

## Contexte (pourquoi cette session existe)

`plans/P6/S6.md` a été exécutée le 2026-07-29 (rapport :
`docs/decision/validation/recette-navigateur-2026-07-29-P6.md`). Son point 3 — le test des 20 secondes
sur une carte à contre-indications repliées (mécanisme livré par SB3) — est revenu **DÉFAUT grave** :
après 20 secondes d'observation d'une carte réelle (interaction CYP3A4, exclusion dialyse), **rien n'a
été retenu** sur « ce que je ne dois surtout pas faire ». Cause identifiée dans le rapport : le
`<summary>` du `<details>` fermé porte le texte « Contre-indications, effet attendu et plus » mais
**aucune signalétique de danger** — même couleur bleu-lien (`--c-accent-decision`), même graisse qu'un
lien de confort, aucune icône. C'est exactement le défaut que T-025 (P4) avait corrigé, réintroduit par
le compactage de SB3.

Thibault a tranché (2026-07-29) : garder les contre-indications dans le dépli (pas de retour en arrière
sur le compactage), mais habiller le `<summary>` fermé d'une **affordance de danger explicite** :
**icône ⚠, couleur d'alerte dédiée, décompte du nombre de contre-indications**. Le résultat sera
revérifié par un test des 20 secondes rejoué (session de contrôle séparée, après cette session +
SB7 — pas dans le périmètre de cette session).

## Lire (commun à la session)

- `src/features/decision/components/OptionCard.tsx` — en entier, en particulier le calcul
  `aDesContreIndications` et le bloc `<summary>` (~ligne 182-186), et la docstring de tête (~ligne
  65-110) qui documente toute la trajectoire T-025 → SB3 → cette session.
- `src/features/decision/components/OptionCard.css` — `.option-card__detail-summary` (~ligne 183-195)
  et `.option-card__ci`/`.option-card__ci-label` (~ligne 206-227).
- `src/styles/tokens.css` — les tokens existants et **pourquoi ils ne conviennent pas tels quels** :
  - `--c-disclaimer-bg`/`--c-disclaimer-border` (ligne ~25-26) : `oklch(95% 0.02 230)` /
    `oklch(87% 0.03 230)` — un bleu-gris neutre, PAS un rouge/ambre d'alerte. C'est le registre déjà
    utilisé par le bloc `.option-card__ci` lui-même (contenu du dépli) — cohérent une fois déplié, mais
    ça ne donne AUCUNE affordance visuelle utile une fois **fermé**, puisque rien n'y est visible.
  - `--c-attention`/`--c-attention-border`/`--c-attention-soft` (ligne ~32-34) : ambre, **réservé par
    convention explicite du projet à un seul registre — « ce que l'outil attend de vous » (saisie
    incomplète, doses non calculées)**. Ne JAMAIS le réutiliser pour une interdiction clinique (règle
    répétée trois fois dans les commentaires d'`OptionCard.tsx`/`.css` — ce serait le score cliniquement
    codé par la couleur que l'invariant 2 interdit).
  - `--c-action-arreter` (ligne ~62) : `oklch(55% 0.18 25)`, rouge — mais **scopé au verbe « Arrêter »**
    (`option.action`). Le réutiliser tel quel pour le résumé des CI créerait une ambiguïté : une carte
    au verbe « Réduire » (bordure violette) affichant une icône CI de la même teinte que le verbe
    « Arrêter » suggérerait à tort une action d'arrêt.
  - **Conclusion attendue** : introduire un nouveau token dédié (ex. `--c-ci-warning` ou nom équivalent),
    un rouge/ambre clairement lu comme alerte de sécurité, distinct des trois usages ci-dessus — à la
    suite des tokens `--c-action-*` dans `tokens.css`, même format `oklch(...)`, avec un commentaire
    expliquant pourquoi les tokens existants ne conviennent pas (reprends le raisonnement ci-dessus, ne
    le récite pas mot pour mot).
- `src/features/decision/engine/banc/carte-affichage.test.tsx` — le test I12 (garde-fou : CI toujours
  présentes, toujours en tête du dépli) : à ne pas casser, et à étendre si le nouveau rendu du
  `<summary>` mérite sa propre assertion (ex. présence de l'icône/décompte quand CI existent, absence
  sinon).

## Hors périmètre

- Ne sors PAS les contre-indications du `<details>` (ce n'est pas l'option retenue par Thibault) — elles
  restent dans le dépli, en première position, inchangé par ailleurs.
- Ne touche pas au mécanisme d'ouverture (`<details>` natif, clic/tap uniquement, pas de survol — A5).
- Ne touche à aucun autre nœud, aucun contenu clinique, aucun autre composant.
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P6/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan.

---

## T-045 — Icône, couleur, décompte sur le `<summary>` fermé quand des contre-indications existent

### Objectif

Que le libellé du `<summary>` fermé signale, sans ambiguïté et sans ouvrir le dépli, qu'une carte porte
des contre-indications — suffisamment pour qu'un praticien pressé le remarque en un coup d'œil.

### Décision clé

Thibault (2026-07-29) : icône **⚠**, **couleur d'alerte dédiée** (nouveau token, cf. « Lire » ci-dessus),
**décompte** du nombre de contre-indications dans le libellé. Exemple de forme (à ajuster librement, le
texte exact n'est pas figé) : « ⚠ 2 contre-indications, effet attendu et plus ». Le décompte se déduit de
`contreIndications.length` (déjà calculé dans `OptionCard.tsx`) — chaque `contre_indications` du YAML
étant une phrase, `.length` du tableau donne un compte correct, pas un artefact de découpage de texte.

Quand `aDesContreIndications` est `false`, le `<summary>` garde EXACTEMENT son apparence actuelle
(« Effet attendu, avantages et inconvénients », couleur `--c-accent-decision`) — aucune icône, aucune
couleur d'alerte sur les cartes sans CI.

### Étapes

1. Ajoute le token de couleur d'alerte dans `tokens.css` (cf. « Lire » — nom, valeur `oklch(...)`,
   commentaire court sur pourquoi les tokens existants ne conviennent pas).
2. Dans `OptionCard.tsx`, enrichis le libellé conditionnel du `<summary>` : icône + décompte quand
   `aDesContreIndications`, texte actuel inchangé sinon. Ajoute si besoin une classe conditionnelle sur
   le `<summary>` (ex. `option-card__detail-summary--ci`) pour porter la couleur en CSS plutôt qu'en
   style inline.
3. Dans `OptionCard.css`, la classe conditionnelle applique la nouvelle couleur (texte et/ou icône) —
   garde le `font-weight: 600` existant, garde `cursor: pointer`/`:hover` inchangés.
4. Étends I12 (`carte-affichage.test.tsx`) si le rendu s'y prête : une assertion qui vérifie, sur au
   moins une option réelle à CI et une sans, que le résumé fermé porte (ou non) le nouveau signal —
   sans dépendre d'un texte figé si tu préfères tester la classe/l'icône plutôt que la chaîne exacte.
5. Mets à jour la docstring de tête d'`OptionCard.tsx` (la section qui raconte T-025 → SB3) : ajoute la
   suite de la trajectoire (cette session, SB6) en une ou deux phrases — pas une réécriture complète.
6. Fais tourner la suite COMPLÈTE en foreground (`npm test`, pas un sous-ensemble — une session
   précédente de ce même plan, S0, a laissé passer une régression faute d'avoir testé la suite entière ;
   ne répète pas cette erreur), `npx tsc --noEmit`, `npm run build`.

### Validation

- **N0 auto (bloque le commit)** : `npm test` (suite complète) → tout vert · `npx tsc --noEmit` → 0
  erreur · `npm run build` → OK.
- **N1 visuel** : `—` (pas de navigateur dans cette session — une session de contrôle séparée rejouera le
  test des 20 secondes sur ce rendu).
- **N2 humain** : `—`.

### Si bloqué

Si aucune couleur ne te semble suffisamment distincte des tokens existants sans en créer une qui jure
avec la palette (`tokens.css`) : propose deux options dans ton rapport de tâche plutôt que de trancher
seul — c'est un choix visuel, pas mécanique.

### Message de commit (appliqué en fin de plan)

`fix(ui): OptionCard — affordance de danger sur le résumé fermé des contre-indications (P6, défaut S6 point 3)`

### Statut

Suivi dans `plans/P6/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode parallèle : signale la fin sans bloquer, une autre session — SB7 — tourne
en parallèle sur des fichiers disjoints).

---

## Bilan de session (SB6, exécutée 2026-07-29)

**T-045 : FAITE, validée N0.**

### Fichiers modifiés

- `src/styles/tokens.css` — nouveau token `--c-ci-warning: oklch(42% 0.19 10)`, ajouté à la suite des
  `--c-action-*`, avec commentaire sur pourquoi les trois tokens existants ne conviennent pas.
- `src/features/decision/components/OptionCard.tsx` — libellé conditionnel du `<summary>` (icône ⚠ en
  `<span aria-hidden="true">`, décompte accordé singulier/pluriel, classe conditionnelle
  `option-card__detail-summary--ci`) ; docstring de tête complétée (trajectoire T-025 → SB3 → SB6).
- `src/features/decision/components/OptionCard.css` — règle `.option-card__detail-summary--ci { color:
  var(--c-ci-warning); }`, ne redéfinit ni `font-weight` ni `:hover` (hérités de la règle générale).
- `src/features/decision/components/OptionCard.test.tsx` — les deux tests qui figeaient l'ancien texte
  exact du `<summary>` (« Contre-indications, effet attendu et plus ») remplacés par trois tests sur le
  nouveau rendu (icône + décompte pluriel, décompte singulier, absence totale du registre d'alerte
  quand pas de CI) — cassure attendue et couverte par le cadrage (« texte exact non figé »).
- `src/features/decision/engine/banc/carte-affichage.test.tsx` — I12 étendu (§1b) : vérifie sur les six
  nœuds réels que le résumé fermé porte l'icône ⚠ et le décompte exact quand `contre_indications` est
  non vide, et ne porte aucune trace de ce registre sinon. Docstring de tête complétée (amendement SB6).

### Décision tranchée seul (pas de blocage, mais un choix visuel à motiver)

Le cadrage laissait le nom et la valeur exacte du token à ma main (« Si bloqué » ne s'est pas déclenché —
je n'étais pas incertain entre deux pistes qui juraient avec la palette, donc pas de proposition à deux
options). Choix fait :

- **Nom** : `--c-ci-warning` (celui suggéré en exemple dans le cadrage, gardé tel quel).
- **Valeur** : `oklch(42% 0.19 10)` — un rouge cramoisi, teinte 10 délibérément écartée de la teinte 25
  d'`--c-action-arreter` (l'ambiguïté que le cadrage signale explicitement : une carte « Réduire»,
  bordure violette, affichant une icône CI à la teinte EXACTE du verbe « Arrêter » ailleurs). Vérifié au
  calcul (conversion OKLCH → sRGB, formules Ottosson) : contraste ≥ 8,7:1 sur `--c-surface` et `--c-bg`
  (WCAG AA texte normal exige 4,5:1 — largement dépassé, marge utile puisque le texte du résumé est en
  0.85rem, sous le seuil « texte large »). Comparé à `--c-action-arreter` (`oklch(55% 0.18 25)`,
  contraste 5,25:1 sur les mêmes fonds) : notre choix est à la fois plus contrasté ET visuellement plus
  sombre/saturé, ce qui renforce la lecture « alerte plus grave qu'un simple verbe d'action ».
- Pas de variante `-border`/`-soft` créée : le token n'habille qu'un texte + une icône sur une ligne
  (pas de bloc, pas de fond) — en ajouter aurait anticipé un besoin non demandé par ce cadrage.

### Écart mineur par rapport au cadrage

Le cadrage ne mentionnait explicitement que `carte-affichage.test.tsx` (I12) dans « Lire »/« Étendre ».
`OptionCard.test.tsx` n'y figurait pas, mais deux de ses tests figeaient littéralement l'ancien texte du
`<summary>` et cassaient avec le nouveau rendu — corrigés dans le même mouvement (le cadrage précise
lui-même que le texte exact n'est pas figé, donc ce n'est pas une extension du périmètre, juste la
conséquence mécanique du changement demandé).

### Validation N0 (suite complète, foreground)

- `npm test` → **826 passed | 11 skipped (837)**, 44 fichiers passés + 1 skip, 0 échec.
- `npx tsc --noEmit` → 0 erreur.
- `npm run build` → OK (seul avertissement : taille de chunk > 500 kB, pré-existant, sans rapport avec
  cette tâche).

### N1 / N2

`—` comme prévu par le cadrage (pas de navigateur dans cette session ; test des 20 secondes à rejouer
dans une session de contrôle séparée, après SB6 + SB7).

### Hors périmètre — confirmé respecté

Contre-indications toujours dans le `<details>`, toujours en première position, registre visuel du bloc
`.option-card__ci` inchangé. Aucun autre nœud, composant ou contenu clinique touché. Aucun fichier
partagé (`STATUS.md`/`TASKS.md`/`index.md`) modifié. Aucun commit, aucun push.
