# 2026-07-31 — D40 · Périmètre de production = **9 thèmes MG** ; les 4 autres thèmes restent au modèle de données

### Décision

Le **modèle de données** couvre les **13 thèmes** de la taxonomie (`BRIEF_VEILLE.md` §4) et les
5 professions. La **production hebdomadaire** de veille couvre **9 thèmes**, tous de médecine
générale :

`soins-premiers` · `diabete-metabolisme` · `cardiovasculaire-prevention` · `bpco-pneumo` ·
`infectiologie-antibiotherapie` · `geriatrie-deprescription` · `prevention-depistage-vaccination` ·
`sante-mentale-addictologie` · `douleur-soins-palliatifs`

Les **4 thèmes restants** — `ETP`, `sante-femme-perinatalite`, `orthophonie`, `soins-infirmiers` —
existent au modèle de données, aux filtres et à la taxonomie partagée, mais **ne font l'objet
d'aucune production** tant qu'un référent de profession ne les prend pas en charge (SOP §2).

Le périmètre était de **8 thèmes** avant l'ajout de `infectiologie-antibiotherapie` le même jour
(D43). Cette décision **précise `BRIEF_VEILLE.md` §3**, qui posait « tous les profils dès le départ »
en recommandant déjà une montée en charge progressive de la production : elle nomme le périmètre de
départ au lieu de le laisser implicite.

### Contexte

Le brief avait validé « tous les profils MVP », en assortissant ce choix d'une réserve explicite : le
sourcing et la charge hebdomadaire sont conséquents, il faut un **référent par profession** pour
tenir la cadence. Il y a aujourd'hui **un référent, médecin généraliste** (SOP §2). Personne, dans
l'équipe actuelle, n'est en mesure d'apprécier la littérature en orthophonie ou en soins infirmiers.

La question n'est donc pas de savoir si ces thèmes méritent d'être couverts — ils le méritent — mais
ce que produirait leur couverture aujourd'hui : une appréciation critique hors compétence, sur un
champ où le niveau de preuve est souvent bas et où il faut précisément une expertise pour ne pas
survendre une rééducation. C'est le contraire du service que la veille prétend rendre.

### Alternatives envisagées

- **Produire sur les 13 thèmes** — écartée : sur 4 d'entre eux, la production serait hors compétence.
  Une entrée mal appréciée sur un champ qu'on ne maîtrise pas ne se rattrape pas par une mention de
  prudence : elle a déjà été lue.
- **Retirer les 4 thèmes de la taxonomie** — écartée : le coût de les remettre plus tard est élevé
  (schéma, contenu, filtres, éventuellement contenu déjà publié à re-tagger), et le signal envoyé
  aux futures référentes serait qu'il faut d'abord modifier le modèle pour exister.
- **Masquer les thèmes vides dans l'interface** — écartée : c'est présenter une couverture complète.
  Un filtre qui renvoie « aucune entrée pour ce thème » dit la vérité.

### Ce que cette décision sacrifie

- **Quatre professions de la MSP n'ont pas de veille.** Sage-femme, orthophoniste, IDEL et le champ
  ETP sont dans l'outil pour la décision et la taxonomie, pas pour la veille. L'outil s'annonce
  pluriprofessionnel et ne l'est, sur ce module, qu'à moitié — il faut que la page Méthode et
  l'interface le disent, pas qu'elles le laissent découvrir.
- **Le risque d'un module qui n'intéresse qu'une profession** est réel : moins de lecteurs, moins de
  retours, et une boucle de rétroaction qui se referme sur le seul point de vue du référent.
- **`professions_concernees[]` risque de valoir toujours `MG` (+ `IPA`)** pendant les premières
  semaines. Un filtre par profession qui ne discrimine rien est un filtre décoratif — à réévaluer
  au gel du schéma plutôt qu'à câbler par principe.

### Conséquences

- SOP §3bis déclare le périmètre ; §2 lie l'ouverture des 4 thèmes au recrutement d'un référent de
  profession. Le lecteur voit **pourquoi** son thème est vide, et **à quelle condition** il ne le
  sera plus.
- Au screening, un candidat hors des 9 thèmes est `exclu` avec le motif « hors périmètre de
  production » — motif d'organisation, pas de qualité, et à ce titre distinct des exclusions du §6.
- Ce périmètre est le **premier levier de charge** en cas de dérapage de cadence, avant de toucher au
  seuil : réduire à 6 thèmes est réversible et sans effet sur le modèle.
- **À revoir au bilan de S4**, avec le temps mesuré des deux premières éditions.
