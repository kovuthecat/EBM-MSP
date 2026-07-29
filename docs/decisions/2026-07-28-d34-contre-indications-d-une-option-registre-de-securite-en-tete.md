# 2026-07-28 — D34 · Contre-indications d'une option : registre de sécurité en tête de carte (T-025), puis repli dans le dépli avec indicateur (amendement P6/SB3)

### Décision

**Règle initiale (T-025, P4/S4, 2026-07-28 — jamais formalisée sous un numéro `D<n>` avant cette entrée).**
Le bloc « Contre-indications » d'une `OptionCard` prend un registre visuel de sécurité (bordure et fond
`--c-disclaimer-*`, tokens repris tels quels d'`AlertList.css`) **et** remonte juste après le titre et les
badges de la carte, avant l'effet attendu et avant avantages/inconvénients — **toujours visible, sans
clic**. Arbitrage retenu à l'époque : « les deux — registre visuel et remontée. Ni l'un ni l'autre seul. »

**Amendement (P6/SB3, T-040, 2026-07-28).** Le bloc quitte le socle (visible sans clic) et rejoint le
`<details>` déjà existant de la carte (effet attendu/délai/avantages/inconvénients), en **première
position** — avant l'effet attendu — dans le **même registre visuel** `--c-disclaimer-*` (inchangé). En
contrepartie, le `<summary>` du `<details>`, seul élément lu carte fermée, **change de libellé selon la
présence de contre-indications** : « Contre-indications, effet attendu et plus » si `option.contre_
indications` est non vide, « Effet attendu, avantages et inconvénients » sinon. Aucune infobulle au survol
(`title` HTML, inaccessible au tactile et aux lecteurs d'écran) : le `<details>` natif reste utilisable au
clic, au tactile et au clavier.

### Contexte

T-025 répondait à une mesure de la recette du 2026-07-28 (Axe B, test des 20 secondes) : sur trois
vignettes, « ce que je prescris » était retenu à chaque fois, « ce que je ne dois surtout pas faire » était
vide trois fois sur trois — la contre-indication était le dernier élément que l'œil attrapait, derrière un
lien décoratif. Corrigée le jour même par la remontée en tête de carte.

P6/SB3 répond à une seconde mesure, plus tardive le même jour : la carte mesurait 232 à 463 px de hauteur
en largeur étroite, essentiellement à cause du bloc effet attendu/avantages/inconvénients — la maquette
Claude Design compacte les options dans un dépli `<details>`. Rouvrir la remontée de T-025 pour y faire
entrer les contre-indications créait une tension explicite, tranchée par Thibault le 2026-07-28 :
compactage accepté, **mais pas au prix de l'accessibilité**.

### Raison du choix

Le fait de sécurité que T-025 protégeait n'est pas la position DOM en elle-même, c'est qu'il ne soit
**jamais totalement invisible**. Le déplacer dans le dépli sans rien d'autre aurait recréé exactement le
défaut mesuré par l'Axe B (une information de sécurité qui ne s'affiche qu'après un clic qu'on ne sait pas
qu'il faut faire). Faire porter l'indicateur par le libellé du `<summary>` — plutôt qu'ouvrir la carte par
défaut, ce qui annulerait le compactage — préserve la visibilité de l'EXISTENCE du fait de sécurité (carte
fermée) sans préserver l'affichage de son CONTENU (qui, lui, redevient un clic). C'est un compromis
explicite, pas un retour en arrière sur T-025.

### Conséquences

- `OptionCard.tsx`/`OptionCard.css` : bloc de contre-indications déplacé à l'intérieur de `<details>`, en
  tête ; registre visuel inchangé. Le test DOM ajouté par T-025 (position avant `option-card__effet` et
  hors dépli) a dû être réécrit pour vérifier la nouvelle position (dans le dépli, en tête) — mis à jour,
  pas supprimé.
- `banc/carte-affichage.test.tsx` (invariant I12) vérifie désormais, sur les six nœuds réels, que toute
  contre-indication est bien présente et précède l'effet attendu **dans** le dépli.
- **Point ouvert, non tranché par cette entrée** : le test des 20 secondes de l'Axe B doit être **rejoué**
  avec ce nouvel emplacement (recette navigateur S6, vague de contrôle du plan P6) — c'est la seule mesure
  qui dira si compacter la carte a coûté ce que T-025 avait gagné. Tant que S6 n'a pas eu lieu, cette
  décision documente un arbitrage de design assumé, pas un résultat vérifié à l'écran.
