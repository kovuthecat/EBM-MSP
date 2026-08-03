# 2026-08-02 — D47 · Seuil deux colonnes remonté à 1200 px (amende D45/D46, D46 confirmé)

### Décision

`LARGEUR_ETROITE_MAX` (`DecisionNodeScreen.tsx`) et les deux `@media` synchronisés
(`DecisionNodeScreen.css`) passent de 959/960 à **1199/1200**. Les trois copies restent tenues en
phase (T-114). **Aucun rééquilibrage des colonnes** : la grille garde
`minmax(420px, 1fr) minmax(380px, 1fr)` — évalué et écarté, cf. « Raison du choix ».

### Contexte

T-122 (même session) a remesuré, sur les intitulés raccourcis par S2 (nœud `prescription`,
coronarien sous metformine + gliptine, 4 cartes), par navigation fraîche à chaque largeur :

| largeur | colonne résultats | cartes sur une ligne | hauteur du bloc |
| --- | --- | --- | --- |
| 959 px *(empilé)* | 911 px | 4/4 | 284 px |
| 1000 px *(2 col.)* | 460 px | 0/4 | 284 px |
| 1100 px | 510 px | 2/4 | 284 px |
| 1280 px | 600 px | 4/4 | 284 px |
| 1366 px | 643 px | 4/4 | 284 px |
| 1440 px | 680 px | 4/4 | 284 px |
| 1600 px | 760 px | 4/4 | 284 px |
| 1920 px | 760 px *(plafonné)* | 4/4 | 284 px |

L'ancien seuil (960) plaçait la bascule à deux colonnes exactement dans la seule zone qui reste
mauvaise : 1000-1100 px, où la grille comprime la colonne résultats à 460-510 px et force un
intitulé de carte sur deux lignes. Partout ailleurs (959 empilé, et ≥ 1280 en deux colonnes),
S2 avait déjà réglé le défaut : 4/4 sur une ligne, 284 px de hauteur constante — y compris à
1366 px, la largeur de cabinet la plus courante.

### Raison du choix

1200 (arrondi à la dizaine supérieure, comme demandé) fait basculer toute la zone 1000-1199 px
dans le régime empilé, où la colonne résultats prend la largeur pleine du contenu plutôt que la
moitié d'une grille — largement suffisant pour 4/4 (911 px à 959, 952 px à 1000, 1052 px à 1100
mesurés après le changement). Vérifié directement à la frontière (1199 vs 1200, plus 1210/1250) :
aucun trou, 4/4 des deux côtés, aucun débordement horizontal, console propre.

**D46 (plafond 1600 px) est CONFIRMÉ par la mesure, pas amendé** : 4/4 à chaque largeur en deux
colonnes de 1200 à 1920 px, y compris au plateau de 760 px (1600-1920). Le troisième levier
autorisé par l'arbitrage du 2026-08-02 (« plafonner la prose, pas les cartes ») n'était donc pas
nécessaire et n'a pas été appliqué — les deux premiers leviers du brief suffisaient déjà, et même
un seul (le seuil) a suffi.

**Le rééquilibrage des colonnes n'a pas été appliqué** après évaluation : à la largeur deux-colonnes
la plus étroite désormais atteignable (1200 px), la colonne résultats mesure 560 px — au-dessus du
plancher qui donnait déjà 4/4 dans le tableau de T-122 (600 px à 1280 px), et vérifié 4/4 en
pratique à 1200/1210/1250 px. Rééquilibrer aurait seulement rétréci la colonne formulaire (aucune
plainte n'existe à son sujet) pour un gain nul et mesuré nulle part sur la colonne résultats. Une
modification sans effet mesurable est une dette, pas un progrès (brief de session) : non appliquée.

### Conséquences

- Fichiers touchés : `DecisionNodeScreen.tsx` (constante + commentaires) et
  `DecisionNodeScreen.css` (2 `@media` + commentaires). Proportions de grille inchangées.
- Vérifié : aucun troisième endroit ne porte encore `959`/`960` comme seuil fonctionnel. Les seules
  occurrences restantes sont des mentions historiques volontaires (l'ancien seuil de la maquette,
  conservé en commentaire) et un faux positif dans un instantané de test (`caracterisation.insuline.txt`
  — coïncidence numérique sur des valeurs cliniques, sans rapport avec un seuil de mise en page).
- Le CTA flottant mobile et la colonne `sticky` restent strictement synchronisés avec le nouveau
  seuil (vérifié : `display: block`/CTA visible à 1199 px, `display: grid`/`position: sticky`/CTA
  masqué dès 1200 px). Effet secondaire attendu et déjà anticipé par le brief de session : le CTA
  apparaît désormais sur des fenêtres de bureau jusqu'à ~1199 px (auparavant coupé à 959 px). Non
  corrigé ici (hors périmètre de cette session, CTA non supprimé) — signalé en point N2.
- N0 : 984 tests passés, 11 skip, 0 échec (identique à l'état avant session) · `npm run typecheck`
  0 erreur · `npm run build` OK.
- Remesure après le changement (mêmes largeurs que T-122, plus la frontière 1199/1200/1210/1250) :
  4/4 partout, aucune largeur en dessous de 4/4, aucun débordement horizontal, console propre.
