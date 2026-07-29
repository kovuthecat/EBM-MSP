# P7 · SB1 — Badge dédié pour une option de sécurité triée en tête   (rédigé par l'orchestrateur)

> **Modèle : Sonnet · effort : medium · Vague : 1 (parallèle : oui — SA1)**
> **Environnement : indifférent**
> Exécutant : UNIQUEMENT la tâche ci-dessous ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-29 · Branche : —

## Lire (commun à la session)

- `src/features/decision/screens/DecisionNodeScreen.tsx` — l'endroit où la valeur de la prop `badge` est
  calculée avant d'être passée à `OptionCard` (cherche `'recommandee'` / `'reco-officielle'`). C'est là
  que se prend la décision de badge, pas dans la carte.
- `src/features/decision/components/OptionCard.tsx` — la docstring de la prop `badge` (≈ ligne 11-19),
  qui documente les trois valeurs actuelles et pourquoi `reco-officielle` a été distingué de
  `recommandee` (D16) : **c'est le précédent exact à suivre**, même problème, même solution.
- `src/features/decision/components/OptionCard.css` — `.option-card__recommended-badge` et
  `.option-card__official-badge` : deux registres visuels déjà distincts (accent plein vs pastille
  neutre), modèle de forme pour le troisième.
- `DECISIONS.md` — D25 (rôle d'option : `geste` / `securite`, et le plafond d'affichage), D16 (la
  distinction de badge déjà faite une fois).

## Hors périmètre

- **Ne change pas l'ordre de tri des options**, ni le plafond des 5 pistes, ni le repli d'affichage
  (D25) : seule l'étiquette change, pas ce qui est affiché ni dans quel ordre.
- Ne touche à aucun contenu clinique, aucun YAML.
- N'introduis aucune dépendance.
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P7/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan.

---

## T-051 — Une option `role: securite` en tête ne porte plus le badge « Recommandée »

### Objectif

Quand la première option non-socle triée est une option de **sécurité** (`role: securite`) et non un
choix d'agent, elle porte aujourd'hui le badge « Recommandée » — pensé pour dire « c'est l'option la plus
indiquée par les données parmi plusieurs ». Sur une carte de sécurité, ce badge dit autre chose que ce
qui est vrai.

### Décision clé

Tranché par le référent le 2026-07-29 : **badge différent pour la sécurité**, pas de suppression du
badge. Motif : éviter de confondre « recommandé cliniquement en 1re intention » avec « seule option
restante par mesure de sécurité » — deux situations très différentes pour le praticien.

Le libellé exact n'est pas figé ; il doit dire que c'est une **mesure de sécurité**, pas un choix parmi
d'autres. Suis le précédent D16 à la lettre : une **quatrième valeur** de la prop `badge` (ex.
`'securite'`), calculée dans `DecisionNodeScreen.tsx` là où les trois autres le sont, rendue par
`OptionCard` avec son propre style — **pas** un `if` supplémentaire greffé dans la carte, qui devrait
alors connaître `option.role` pour décider seule.

Registre visuel : ni l'accent plein de « Recommandée » (qui dirait « choix préférentiel »), ni la
pastille neutre de « Recommandation officielle ». Réutilise un token existant plutôt que d'en inventer
un — `--c-ci-warning` (ajouté par P6/SB6 pour le registre de sécurité des contre-indications) est le
candidat naturel ; vérifie qu'il rend correctement en pastille avant de le retenir.

### Lire / Modifier

**Modifier** : `src/features/decision/screens/DecisionNodeScreen.tsx`,
`src/features/decision/components/OptionCard.tsx`, `src/features/decision/components/OptionCard.css`.

### Étapes

1. Trouve le calcul du badge dans `DecisionNodeScreen.tsx`. Identifie précisément la condition qui
   attribue aujourd'hui `'recommandee'`, et à quel moment `option.role === 'securite'` peut être vrai
   pour cette même option.
2. Ajoute la quatrième valeur de badge, en préservant exactement le comportement des trois autres
   (une option `geste` en tête garde `'recommandee'` ; le socle garde `'reco-officielle'`).
3. Rends-la dans `OptionCard.tsx`, sur le modèle des deux pastilles existantes ; style dans
   `OptionCard.css`.
4. Mets à jour la docstring de la prop `badge` (`OptionCard.tsx`) : quatre valeurs, ce que chacune veut
   dire, et l'arbitrage du 2026-07-29 qui a ajouté la quatrième.
5. Ajoute un test : sur un profil où une option `role: securite` arrive en tête, le badge rendu est le
   nouveau et **pas** « Recommandée » ; sur un profil ordinaire, « Recommandée » est inchangé. Le profil
   D32 de `statine` (maladie CV établie + intolérance avérée → carte « Statine indisponible —
   alternatives hypolipémiantes ») est un cas réel de ce genre : regarde s'il convient avant d'en
   fabriquer un.

### Validation

- **N0 auto (bloque le commit)** : `npm test` **(suite COMPLÈTE, en foreground — pas un fichier ciblé :
  une session d'un plan précédent a laissé passer une régression faute d'avoir testé l'ensemble)** → tout
  vert · `npx tsc --noEmit` → 0 erreur · `npm run build` → OK.
- **N1 visuel** : `—` (S2, vague 3, vérifiera la lisibilité réelle de la pastille).
- **N2 humain** : `—`.

### Si bloqué

Si aucune option `role: securite` ne peut, en pratique, se retrouver en tête avec le badge
« Recommandée » (autrement dit : si le cas décrit par le référent le 2026-07-25 n'est plus atteignable
depuis D25) : **STOP, ne fabrique pas un cas artificiel pour justifier le changement.** Rapporte-le —
ce serait une bonne nouvelle, pas un échec, et le badge n'aurait alors pas lieu d'être ajouté.

### Message de commit (appliqué en fin de plan)

`feat(ui): badge distinct pour une option de sécurité triée en tête (P7)`

### Statut

Suivi dans `plans/P7/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode vague parallèle — SA1 tourne en parallèle sur des fichiers disjoints).
