# 2026-07-26 — D21 · Canal d'un fait de sécurité : exclusion, alerte d'option, ou alerte de nœud

### Décision

- le fait rend un geste **contre-indiqué** → `options[].exclusions`, affichée avec son motif (R4) ;
- le fait **qualifie** un geste sans l'interdire → `options[].alertes` ;
- le fait est vrai **quel que soit le geste retenu** → `alertes` de nœud.

Deux interdits : **`priorite` ne porte jamais un fait de sécurité** (rétrograder n'est pas retirer) ;
**une alerte de nœud n'a jamais `quand: "default"`** (elle s'affiche alors pour tout le monde, donc
pour personne).

### Contexte

La recette a relevé 6 couples où une alerte interdit ce qu'une carte prescrit — « ne pas INITIER une
statine » au-dessus de « Statine de haute intensité », « ne pas poursuivre la titration » au-dessus
de « Titrer la basale, +2 U ». Cause mécanique : les alertes de nœud sont évaluées sur les seuls
critères, jamais sur ce que le moteur a retenu. Sept lignes `incertitudes` actaient déjà ce choix
(« modélisé en alerte plutôt qu'en gate ») dans 4 nœuds.

### Raison du choix

Levée d'un malentendu sur D3 : l'invariant interdit les **scores cachés**, pas les **règles**. Une
`exclusion` sur `dialyse == true`, affichée avec son motif, est l'exact opposé d'un arbitrage caché —
c'est un arbitrage déclaré, sourcé et rendu à l'écran. Conflater « pas de gating hors EBM dur » avec
« aucun score caché » avait fait glisser des interdits de sécurité dans un canal sans pouvoir de
retrait.

### Conséquences

Portée mesurée : sur 35 alertes de nœud, 1 passe en `exclusion`, 4 en alerte d'option, 1 est bloquée
faute de critère d'entrée. Le canal alerte n'est pas à vider, il est à discipliner. **Couplage à ne
pas casser** : sur `statine`, transformer l'alerte dialyse en exclusion sans les critères de D22
viderait le nœud entier (3 options en `ordered-first-match`). Invariant de banc I7 : une alerte au
libellé prohibitif implique une `exclusion` correspondante.
