# 2026-08-01 — D44 · Kit d'icônes SVG partagé, amende D9

### Décision

Introduction de `src/features/shared/icons/` (`Icon.tsx`, `paths.ts`, `Icon.css`) : un composant `Icon`
générique et un dictionnaire fermé de 17 tracés SVG (`NomIcone`, union TypeScript fermée), recopiés à la
main depuis la maquette Claude Design « Traiter — Refonte ergonomie » v2 (2026-08-01). `viewBox="0 0
24 24"`, couleur toujours héritée via `currentColor` (jamais en dur dans un tracé), `aria-hidden="true"`
par défaut sauf `libelle` explicite. Aucune dépendance runtime ajoutée (`lucide-react`, `react-icons`…) :
la pile reste figée (`CLAUDE.md`, invariant 8), les tracés sont inline.

**Amende D9** (2026-07-22, « Choix techniques du câblage P1 ») qui posait « zéro icône MVP » parmi les
choix techniques du premier câblage du module Décision.

### Contexte

Au moment de D9, le module Décision n'avait ni contenu multi-facteurs ni recette visuelle : l'absence
d'icône était un choix d'économie, pas un principe. Treize emoji et quelques caractères ASCII en ont
tenu lieu depuis (`lib/labels.ts` `ENUM_VALUE_ICONS`, `OptionCard.tsx` `ACTION_ICON`), sans jamais être
comparés à un rendu de référence.

La recette visuelle de P11 (portage du langage visuel de la maquette sur les 6 nœuds) a mesuré ce que
D9 ne pouvait pas anticiper : le rendu d'un emoji varie d'une plateforme à l'autre (police système,
version d'OS), et aucun emoji ne porte de couleur pilotable par un token — impossible de le faire suivre
les tons sémantiques OKLCH introduits par P11 (S1, tokens `--c-ton-*`). Un pictogramme en `currentColor`
n'a pas ce défaut.

### Raison du choix

Un dictionnaire fermé sur une union TypeScript (`Record<NomIcone, ReactNode>`), plutôt qu'un
`Record<string, …>` ou une bibliothèque tierce : le compilateur signale toute valeur manquante, comme le
motif déjà retenu pour `ACTION_ICON`. Composant à tracés inline plutôt que sprite `.svg` séparé : cohérent
avec l'invariant « module Décision 100 % statique », aucune requête réseau supplémentaire. `Icon` reste
décoratif par défaut (`aria-hidden`), exactement le rôle que jouaient les emoji qu'il remplace — pas de
changement du contrat d'accessibilité, seulement du rendu.

### Conséquences

- Nouveau module partagé `src/features/shared/icons/`, consommé par `CriteriaForm`, `OptionCard`,
  `AlertList`, `ArgumentPanel`, `DecisionNodeScreen` (P11, S4/S5/S6/S7).
- `ENUM_VALUE_ICONS` (`lib/labels.ts`) et `ACTION_ICON` (`OptionCard.tsx`) migrent vers `NomIcone` ; les
  emoji correspondants sortent du code source du module Décision.
- Une future extension du kit suit le même principe qu'un ajout de token : un tracé de plus dans
  `paths.ts`, jamais une icône approximée à l'aveugle en l'absence de source dans une maquette.
- D9 reste valide pour le reste de son périmètre (navigation state-based sans routeur, YAML via plugin
  Vite, Ajv, CSS OKLCH) : seul le volet « zéro icône MVP » est levé.
