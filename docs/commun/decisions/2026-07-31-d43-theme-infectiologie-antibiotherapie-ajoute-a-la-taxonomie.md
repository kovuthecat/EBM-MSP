# 2026-07-31 — D43 · 13ᵉ thème `infectiologie-antibiotherapie` ajouté à la taxonomie partagée

### Décision

La taxonomie de thèmes partagée entre le module Décision et le module Veille passe de **12 à
13 thèmes**, par ajout de **`infectiologie-antibiotherapie`** (durées de traitement, résistance,
antibiothérapie courante), inséré après `bpco-pneumo`.

La liste est portée par **deux** fichiers — `docs/veille/BRIEF_VEILLE.md` §4 et `ARCHITECTURE.md`
§ « Données affichées » → *Taxonomie de thèmes*. Ils doivent rester **rigoureusement identiques** :
c'est la seule propriété mécaniquement vérifiable de cette décision, et elle a déjà divergé ailleurs
dans ce projet. Les deux fichiers portent désormais un rappel explicite de cette contrainte.

Le thème entre au **périmètre de production** (D40), qui passe de 8 à **9 thèmes MG**.

### Contexte

`BRIEF_VEILLE.md` §8bis liste, dans la grille de veille du médecin généraliste, « **Infectiologie
courante & antibiothérapie** (durées, résistance) » — une priorité de médecine générale au même titre
que le cardiovasculaire ou le diabète. Aucun des 12 thèmes de la taxonomie ne la couvrait : ni
`bpco-pneumo` (qui ne prend l'infection respiratoire que par le versant pneumologique), ni
`prevention-depistage-vaccination` (qui prend la prévention, pas le traitement).

Le sujet n'est pas marginal pour une MSP : les durées d'antibiothérapie, les stratégies de
non-prescription et la résistance sont des décisions **hebdomadaires**, et un champ où la
littérature bouge — les essais de non-infériorité sur les durées courtes sortent régulièrement, et
franchissent le seuil d'impact pratique de la SOP §6bis sans difficulté.

**Le moment compte autant que la décision.** La taxonomie n'existe encore dans **aucun code ni
aucun contenu** : ni schéma JSON, ni fichier YAML, ni type TypeScript, ni entrée de veille. Ajouter
un thème aujourd'hui coûte deux lignes de documentation. Après S5 (gel du schéma) et surtout après
les premières éditions, il coûte une migration de schéma, un re-tagging des entrées déjà publiées et
un correctif d'affichage. C'est la fenêtre où la décision est gratuite, et elle se referme.

### Alternatives envisagées

- **Loger l'infectiologie dans `soins-premiers`** — écartée. `soins-premiers` est déjà le thème le
  plus large de la taxonomie ; y verser l'antibiothérapie en ferait un fourre-tout, et le **filtre par
  thème de la V1 perdrait sa valeur sur un sujet fréquent** : le lecteur qui cherche « les durées
  d'antibiothérapie » devrait parcourir tout ce qui n'entre nulle part ailleurs.
- **L'ajouter à `bpco-pneumo`** — écartée : l'infection urinaire, la dermohypodermite et l'otite n'y
  ont pas leur place, et le thème deviendrait illisible sous son propre nom.
- **Attendre de voir si le besoin se confirme sur les premières éditions** — écartée précisément
  parce que c'est aujourd'hui que le coût est nul. Attendre, c'est décider de payer plus tard une
  décision déjà tranchée.

### Conséquences

- Taxonomie à **13 thèmes**, périmètre de production à **9 thèmes MG** (D40).
- Les deux porteurs de la liste doivent rester identiques ; toute session qui touche à la taxonomie
  vérifie les deux fichiers. *(Le fichier `design/maquettes/…/uploads/ARCHITECTURE.md` est une copie
  figée d'un envoi à l'outil de maquettage : il n'est pas mis à jour et ne fait pas foi.)*
- **S5** (gel du schéma) reprend la liste à 13 valeurs pour l'énumération `themes[]` du JSON Schema.
- **S3** peut classer un item d'antibiothérapie dès la première édition — ce qui était bloqué tant
  que l'arbitrage n'était pas fermé.
