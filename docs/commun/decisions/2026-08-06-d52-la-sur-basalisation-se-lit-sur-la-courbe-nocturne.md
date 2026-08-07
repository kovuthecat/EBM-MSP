# 2026-08-06 — D52 · La sur-basalisation se lit sur la courbe nocturne, pas sur le ratio dose/poids

### Décision

**Révise la décision du 2026-07-27** consignée dans `content/decision/noeuds/diabete-type-2/insuline.yaml`.
La sur-basalisation se détermine **sur la courbe de mesure continue du glucose (MCG) nocturne**. Le ratio
dose/poids de 0,5 U/kg **cesse de sélectionner quoi que ce soit** : il redevient une **alerte**, avec son
argumentaire, **en l'absence de capteur uniquement**.

Les trois cartes de conduite sur la basale forment désormais une **partition du signal nocturne** — une
valeur de la courbe, une carte, sans recouvrement (`GRAMMAIRE-NOEUD.md` **R13**).

**Conséquence clinique confirmée par le référent, à ne pas rouvrir** : chez un patient en basale seule,
**sans capteur**, HbA1c au-dessus de l'objectif et glycémie à jeun haute → **on titre la basale**, et on
suggère la mesure continue du glucose. Le patient ne perd pas la suggestion de capteur : la carte
« Envisager d'instaurer une mesure continue du glucose » se déclenche **déjà** pour exactement ce profil
(`situation_insuline != naif` ET `mcg_disponible == false` ET `cible_atteinte == false`), en tête
d'affichage, famille « Avant de décider — la mesure ». Ce qu'il perd, ce sont **deux cartes
d'intensification latérale qu'aucun signal lisible sans capteur ne justifiait**.

### Contexte

La décision du 2026-07-27 était écrite en toutes lettres dans le YAML : « les deux options coexistent
désormais, et c'est le **RANG** qui hiérarchise ». Elle acceptait donc que « Ne pas sur-titrer la basale
— intensifier autrement » et « Titrer la basale (augmenter la dose) » soient toutes deux applicables,
en comptant sur le rang pour les départager à l'écran.

**Le mécanisme invoqué n'opérait pas.** C'est le motif de révision, et il n'a rien de clinique :

- `priorite` ne trie qu'**à l'intérieur d'une famille** (`engine/evaluateNode.ts`, `groupesParFamille` /
  `groupesExAequo`). Or les deux cartes vivent dans **deux familles différentes** (« Sécurité — à
  corriger d'abord » et « Intensifier le traitement ») : aucun rang ne les compare jamais ;
- une famille `exclusive: false` badge « recommandée » **toutes** ses cartes affichées. Les deux
  arrivaient donc à l'écran avec le même badge, chacune dans sa section.

**Mesuré, pas supposé** : **2 des 180 profils figés** du banc affichaient les deux cartes simultanément
— deux conduites opposées sur le même geste, recommandées ensemble. Le fait était déjà présent dans
`__snapshots__/caracterisation.insuline.txt` (620 Ko au 2026-08-06) ; il n'était lisible nulle part.

### Ce qui a rendu le défaut invisible — et ce que ça a coûté à la grammaire

Les deux cartes étaient **individuellement justes** : conditions correctes, sources correctes, textes
relus. Le défaut n'était dans aucune des deux, il était **entre** elles — un déclencheur (`over_basalisation`,
un ratio dose/poids) greffé sur des cartes structurées par un **autre** signal (le profil nocturne).
Aucun artefact du procédé n'avait pour unité la relation entre deux cartes ; c'est le constat qui a
produit **R13** et l'inventaire des paires co-actives (`engine/banc/paires.test.ts`).

### La preuve n'a pas changé — c'est sa traduction en contenu qui change

Le dossier collecté le 2026-07-27 est repris tel quel, et **il doit vivre dans l'alerte** :

- seuil issu d'un **post-hoc non pré-spécifié** (Umpierrez 2019, N = 458, financé par le fabricant) ;
- porté par l'**ADA de 2018 à 2023**, **explicitement retiré en 2025**, toujours absent en 2026 ;
- **maintenu par l'AACE** depuis 2018 ;
- doses d'entretien réellement atteintes à la cible dans les essais : **0,34 à 0,78 U/kg** — un seuil à
  0,5 coupe **au milieu** de la plage normale.

C'est ce dernier point qui rend le ratio impropre à *sélectionner* : un repère qui classe comme
sur-basalisé un patient au centre de la plage d'entretien documentée ne peut pas piloter une conduite. Il
reste **informatif** — un praticien sans capteur n'a rien de mieux, et il vaut mieux le lui dire que se
taire.

### Ce qui reste interdit

1. **Faire hiérarchiser deux cartes de familles différentes par le rang.** Le rang ne franchit pas la
   frontière de famille ; s'appuyer dessus pour arbitrer entre deux familles est une erreur de mécanisme,
   pas une préférence de rédaction.
2. **Greffer sur une carte un déclencheur étranger au signal qui structure ses voisines** — R13. Si un
   second signal doit agir, il structure sa propre partition, ou il devient une alerte.
3. **Faire sélectionner une option par un repère dont la plage normale chevauche le seuil.** Un repère de
   ce type informe ; il ne décide pas.

### Conséquences

- **Contenu (P14/S4, T-167)** : `over_basalisation` quitte les `conditions` des cartes basales ; l'alerte
  correspondante est conditionnée à `mcg_disponible == false` et porte l'argumentaire ci-dessus.
- **Banc** : les 2 profils co-actifs disparaissent de `__snapshots__/paires.insuline.txt` ; le cliquet
  empêche leur réapparition silencieuse.
- **Grammaire** : **R13** (« un signal se partitionne : une valeur, une carte ») est écrite à partir de ce
  cas.
- **N2 humain** : la conduite « sans capteur, GAJ haute ⇒ on titre » est un arbitrage clinique rendu par
  le référent le 2026-08-06 ; sa **formulation** dans l'alerte reste à relire à l'écran (`VALIDATION.md`).
