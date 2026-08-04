# D48 · L'écran ne cite que des sources primaires — et une divergence se présente en trois faces

**Date** : 2026-08-04
**Statut** : appliquée aux **six** nœuds du domaine DT2, et à l'écran « Méthode ».
**Amende** : D23 (modèle de sources réorganisé par nature).

## Le constat

Trois défauts distincts, relevés en recette navigateur sur le panneau d'argumentaire, tous de la même
famille : **le texte affiché ne disait pas ce sur quoi il reposait.**

1. **Les divergences étaient illisibles.** `reco_officielle.explication` portait un paragraphe de prose
   numéroté « Divergences : (1)… (2)… (3)… », rendu en bas de panneau, sous les deux colonnes. Le lecteur
   n'y pouvait ni les compter, ni voir pour chacune qui dit quoi, ni sur quelles données l'écart se fonde.
   Ce qui y était compté « (2) granularité EBM » empilait en réalité trois écarts de nature différente.
2. **Des revues secondaires tenaient lieu de preuve.** Sous la position de l'outil s'affichait
   « Réf. : Médicalement Geek · Prescrire ». D23 avait précisément sorti ces revues du sujet grammatical
   des phrases d'argument pour que ce soit la donnée qui porte l'argument ; les laisser en bibliographie
   juste sous la position les y remettait par la petite porte — on lit « Prescrire dit que ».
3. **Les incertitudes citaient qui avait tranché.** Les 16 entrées d'`incertitudes` du nœud
   `prescription` étaient devenues un journal de travail : dates d'arbitrage, « RÉSOLU le… », historique
   des PMID corrigés, attributions de décision. Rien de tout cela n'apprend quoi que ce soit au praticien
   qui lit — il ne connaît pas ces arbitrages —, et le citer transforme un argument vérifiable en argument
   d'autorité.

Deux constats de structure s'y sont ajoutés en cours de correction :

- **`Noeud.argumentaire` n'était rendu nulle part.** Champ obligatoire au schéma, rempli avec soin dans
  les six nœuds, et mort — vérifié par recherche. D'où le mélange logique du nœud / journal qui s'y était
  installé sans conséquence visible.
- **`Option.references` n'était rendu nulle part non plus.** Les essais qu'une option déclare comme
  portant ses chiffres — obligatoires par l'invariant I8 dès un niveau de preuve modéré ou élevé —
  n'apparaissaient sur aucun écran. Le contenu portait une traçabilité que le praticien ne pouvait pas
  lire.

## La décision

**1. `synthese_critique.references` est supprimé du modèle.** Plus aucune revue secondaire ne s'affiche.
La position de l'outil cite désormais les ESSAIS qui la portent (`synthese_critique.appuis`, ids de
`references_primaires`). Ce qui a été LU pour construire une position reste tracé en commentaire YAML et
dans l'argumentaire exhaustif : c'est de la méthode, pas de la preuve, et ça n'a pas sa place sur un écran
de consultation. La suppression est structurelle, pas conventionnelle — le champ n'existe plus, on ne peut
plus l'y remettre par inadvertance.

**2. Une divergence se présente en trois faces comparables** (`reco_officielle.divergences[]`) : ce que dit
la recommandation, ce que fait l'outil, **sur quelles données** l'écart se fonde. Cette troisième face est
opposable : une divergence appuyée sur « le référent a tranché » n'est pas une divergence argumentée, c'est
une préférence. « Aucun essai n'a testé ce point » est en revanche un appui parfaitement valide.
`explication` ne porte plus que les points d'accord.

**3. `reco_officielle.source` est un titre, pas un paragraphe.** Le détail vérifiable — numéros d'avis, de
recommandation, de tableau, de rubrique de RCP — descend dans `reco_officielle.references[]`, où il est
lisible et vérifiable ligne à ligne.

**4. Une incertitude se fonde sur une donnée ou sur son absence, jamais sur qui a tranché.** L'appareil de
chantier (dates, statuts, attributions, identifiants de tâche) sort de tous les champs affichés. Il reste
dans `meta.changelog`, dans les commentaires YAML et dans l'argumentaire exhaustif — ses trois places
légitimes.

**5. Deux champs morts sont rendus.** `Noeud.argumentaire` devient la section « Comment ce nœud raisonne »,
repliée par défaut. `Option.references` s'affiche dans un nouveau panneau « État des preuves », que **le
badge de niveau de preuve ouvre** : le badge était le seul élément de la rangée sans action, alors qu'il
pose exactement la question à laquelle ce panneau répond — « modérée d'après quoi ? ». Ce panneau porte
aussi `effet_attendu` et `delai_benefice`, qui quittent le panneau `--argumentaire` : ce que les essais ont
mesuré et ce que ça change en pratique sont deux registres différents.

## Ce que ça coûte

`OptionCard` passe de quatre à **cinq** panneaux. L'état initial de `carteUnique` (T-136) vise désormais
`--preuves` : ce qui est rouvert d'office reste la donnée EBM, seul le panneau qui la porte a changé.

Le découpage positionnel de `carte-affichage.test.tsx` (I12) s'est révélé piégeux à cette occasion :
l'insertion d'un panneau a décalé d'un cran tout ce qui le suivait, et le banc a continué de PASSER en
désignant, sous le nom `argumentaire`, le panneau `preuves` qui venait de prendre sa place — le vrai
panneau `--argumentaire` n'étant alors plus vérifié du tout. Un vert obtenu sans rien garantir. Les
panneaux se désignent désormais par leur modificateur, jamais par leur rang.

## Garde-fou

`engine/banc/jargon-projet.test.ts` (I25) gagne quatre marqueurs — qui-a-tranché, date de chantier, statut
de chantier en capitales, identifiant de tâche — et couvre les nouveaux champs affichés ainsi que
`Noeud.argumentaire`, qui entre dans sa portée par la règle même qui l'en excluait (« jamais rendu »).

Contrairement aux cinq marqueurs d'origine, ces quatre-là sont arrivés SUR un corpus existant. Une dette
nommée et sous cliquet a couvert les six nœuds le temps de les reprendre — quelques heures ; elle a été
vidée et son échafaudage retiré. **Le régime est de nouveau le même pour les neuf marqueurs : aucune
exemption.**

## Ce que la propagation a fait apparaître

Reprendre les cinq autres nœuds n'a pas été une simple mise en forme.

- **`rhd-alimentation` demandait lui-même ce champ.** Une de ses incertitudes expliquait porter le conflit
  HAS 2019 / USPSTF 2022 sur le dépistage des troubles du comportement alimentaire « faute d'un champ dédié
  dans le schéma ». Le champ existe désormais : le conflit y est descendu, avec ses valeurs prédictives.
- **`statine` et `insuline` cachaient des divergences dans leurs incertitudes.** La conduite au-delà de
  10 N de CK (arrêt définitif côté français, interruption temporaire ici) et le sort des cibles de temps
  dans la cible étaient enfouis dans des récits de vérification de sources. Ce sont des divergences
  argumentées : elles sont remontées en `divergences[]`.
- **Cinq notes purement techniques squattaient les `incertitudes`** — couverture du banc sur une bande de
  CK, bornes `min`/`max` d'un critère, chevauchement de rangs, affichage non livré, renommage d'un dérivé.
  Elles sont passées en commentaires YAML. L'une d'elles vaut d'être relue : `insuline` et `prescription`
  déclarent tous deux un dérivé `terrain_fragile` avec des définitions DIFFÉRENTES — ce que l'invariant I4
  interdit, mais qu'il ne peut pas voir puisqu'il est vérifié par nœud. **À arbitrer.**
- **L'écran « Méthode » affirmait le contraire de D48.** Il écrivait que Prescrire « ancre la position
  critique ». Corrigé : la page distingue désormais ce qu'on LIT pour construire un nœud de ce qu'on CITE
  à l'appui de ce qu'il affiche.
- **Deux phrases tronquées dans `rhd-alimentation`**, laissées par une édition antérieure du champ
  `argumentaire` — invisibles tant que ce champ n'était rendu nulle part.

## Reste à faire

Rendre opposable la contrainte de schéma « `divergences` non vide quand `divergence: true` », désormais
vraie sur les six nœuds.
