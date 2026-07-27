# Mesure — densité des marqueurs « · à confirmer » après l'arbitrage A8

> **Objet** : mesurer la contrepartie que j'avais annoncée en présentant A8 — « marquer aussi les
> booléens décisifs dévaluerait le signal, la recette signale déjà une densité forte ».
> **Date** : 2026-07-27 (soir). **Verdict : ma réserve était mal fondée. Le surcoût de densité est
> ENTIÈREMENT TRANSITOIRE**, et il disparaît au premier geste que le marqueur sert précisément à
> provoquer.

---

## Ce que A8 change

Le marqueur « · à confirmer » ne filtre plus par TYPE : il couvre exactement les critères que le
compteur du bandeau annonce. Avant, un `bool` ORDINAIRE décisif et non confirmé était **compté sans
être marqué** — d'où le défaut relevé par la recette visuelle sur `statine` : « 1 critère décisif non
confirmé » sans aucun repère à l'écran pour le résoudre.

## La mesure, dans les deux états qui comptent

Comptage sur les six nœuds, marqueurs rapportés aux **champs visibles** du formulaire.

### État 1 — formulaire vierge

| nœud | champs | avant A8 | après A8 | part |
| --- | --- | --- | --- | --- |
| cible-glycemique | 6 | 1 | **4** | 17 % → **67 %** |
| insuline | 22 | 14 | **21** | 64 % → **95 %** |
| prescription | 21 | 6 | **13** | 29 % → **62 %** |
| rhd-activite-physique | 14 | 6 | **12** | 43 % → **86 %** |
| rhd-alimentation | 19 | 17 | **19** | 89 % → **100 %** |
| statine | 9 | 3 | **5** | 33 % → **56 %** |

Pris seul, ce tableau donne raison à ma réserve : sur `rhd-alimentation`, **100 %** des champs portent
le marqueur, et un signal porté par tout ne distingue rien.

### État 2 — après un clic « Rien à signaler » par section

C'est le premier geste réel d'une consultation, et il coûte un clic par section.

| nœud | champs | avant A8 | après A8 | part |
| --- | --- | --- | --- | --- |
| cible-glycemique | 6 | 1 | **1** | 17 % → **17 %** |
| insuline | 22 | 14 | **14** | 64 % → **64 %** |
| prescription | 21 | 6 | **6** | 29 % → **29 %** |
| rhd-activite-physique | 14 | 4 | **4** | 29 % → **29 %** |
| rhd-alimentation | 19 | 14 | **14** | 74 % → **74 %** |
| statine | 9 | 3 | **3** | 33 % → **33 %** |

**Identiques, colonne pour colonne.** Aucun surcoût ne subsiste.

## Pourquoi, et pourquoi ma réserve était mal posée

Les marqueurs qu'A8 ajoute portent **uniquement** sur des `bool`/`liste`. Or ce sont exactement les
champs que le bouton « Rien à signaler » de leur section confirme d'un seul clic. Le surcoût de densité
vit donc entre l'ouverture du nœud et ce clic — et il désigne le bouton qui le fait disparaître.

J'avais raisonné sur un ÉTAT (combien de marqueurs à l'écran) au lieu de raisonner sur un PARCOURS
(combien en reste-t-il après le geste qu'ils réclament). C'est, à l'échelle d'un conseil d'ergonomie,
la même erreur de méthode que celle relevée le même jour sur le sur-blocage `fragilite` : *mesurer ce
qui est facile à mesurer plutôt que ce que la question demande.* La règle tirée alors ne visait que les
affirmations « N profils perdent X » ; elle vaut plus largement.

## Ce que la mesure ne dit pas

Elle ne dit pas si le formulaire vierge, avec 95 % de champs marqués sur `insuline`, **décourage** à
l'ouverture. C'est un jugement humain, il est porté dans `VALIDATION.md`. La mesure établit seulement
que ce que l'on voit alors n'est pas un signal dévalué mais une **liste de travail exacte** — chaque
marqueur correspond à un critère réellement décisif et réellement non confirmé, et le compteur du
bandeau annonce désormais ce nombre-là et pas un autre.

## Effet secondaire acquis

Compteur et marqueurs ont la même définition, et c'est désormais un **invariant testé**
(`CriteriaForm.test.tsx` : « autant de marqueurs affichés que de critères réclamés, quels que soient
leurs types »). Le défaut que la recette a trouvé ne peut plus revenir sans faire échouer la suite.
