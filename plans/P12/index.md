# Plan P12 — Ce que la recette praticien naïf du 2026-08-02 a trouvé   (rédigé par Opus)

## Objectif d'ensemble

Traiter les constats de la passe du 2026-08-02 (`docs/decision/validation/recette-praticien-naif-2026-08-02.md`)
dans l'ordre de ce qu'ils coûtent au praticien : d'abord la seule chose qui peut produire une décision
fausse, puis la régression de lisibilité que P11 a introduite, puis ce que l'outil sait sans le dire,
puis la charge de saisie. **Aucun changement de conduite clinique** n'est décidé par ce plan : les
aperçus de déprescription encodent un rapport de preuve déjà rendu, ils n'en produisent pas.

## Préalable — à faire avant S1

`main` ne porte **ni P11 ni les deux correctifs du 02/08**. Trois branches divergent :
`main` (3e5d63e) · `p11-s9-consolidation` (16 commits, poussée) · `fix-defauts-avant-recette`
(3 commits de plus, **c'est elle qui a été recettée**, commit `e7eec71`). Consolider vers `main`
avant d'ouvrir P12, sinon le plan s'empile sur une base que personne ne sert.

## Ce que ce plan a vérifié avant de se lancer

- **La carte d'option ne tient sur une ligne à AUCUNE largeur en deux colonnes.** Mesuré au navigateur
  sur le nœud `prescription` (coronarien sous metformine + gliptine, 4 cartes) : 959 px empilé →
  colonne de 911 px, **4/4 cartes sur une ligne** ; 1000 px deux colonnes → colonne de 460 px, **0/4**,
  bloc 61 % plus haut ; 1920 px → colonne de 760 px (gelée par le plafond de 1600 px, D46), **2/4**.
  Le rapport concluait « ça ne tient qu'au-dessus de ~1500 px » : il était optimiste, ayant mesuré
  1280 et 1400 « à chaud ». **Élargir l'écran ne rattrape rien — c'est le plafond qui décide.**
- **65 intitulés sur 82 dépassent 55 caractères**, mais en deux familles irréductibles l'une à
  l'autre : sur `prescription`/`insuline`/`statine`, le titre est un **geste** suivi d'une parenthèse
  qui redit le motif (déjà porté par « Proposé parce que ») — elle peut sortir. Sur les deux nœuds
  RHD, le titre **EST le conseil** (« Se lever et bouger quelques minutes à chaque heure de position
  assise prolongée ») : le raccourcir le détruirait. **S2 ne touche donc pas aux nœuds RHD**, et la
  carte doit assumer d'y tenir sur deux lignes.
- **La cible qui change toute seule est un composé de trois faits**, tous vérifiés en source :
  `antecedent_cv` n'a pas `partage: true` (`cible-glycemique.yaml`) · la mémoire de session ne retient
  que les valeurs `touched` (`lib/sessionCriteres.ts:73`) · `suggestionEsperanceVieSiApplicable` ne se
  garde que d'un choix **manuel** (`lib/esperanceVieDefault.ts:61`). Au retour sur le nœud, la
  suggestion se recalcule sur un dossier amputé de son driver.
- **Le seuil sulfamide `DFG < 30` n'est PAS contredit** par le rapport OpenEvidence du 2026-08-02.
  OE constate que ni la KDIGO ni l'ADA ne portent ce chiffre — ce que `prescription.yaml:683-691`
  documente déjà depuis le 2026-07-27, l'attribution KDIGO ayant été retirée. Le seuil est une
  **citation de la SFD** (2023 et 2025, Tableau I notes 1-2 + Avis n° 12), source française qu'OE ne
  consulte pas. Contenu confirmé par contrôle adverse externe : **ne pas rouvrir**.
- **T-067 existe déjà** (`plans/P8/S9.md`, jamais exécutée) et couvre exactement le point N11 de la
  recette. Elle est **reprise ici en S4**, pas dupliquée ; P8 se clôt en la renvoyant à P12.
- **`LARGEUR_ETROITE_MAX` n'est référencé que dans 3 fichiers** (`DecisionNodeScreen.css`, `.tsx`, et
  un snapshot) : le changement de seuil est mécaniquement bon marché.

## Ce que ce plan NE fait pas

- **Ne fusionne pas `antecedent_cv` et `ASCVD_etablie`** : arbitrage référent rendu le 2026-08-02 —
  une cardiopathie rythmique et une maladie athéromateuse sont deux faits distincts. Seule
  l'implication à sens unique (athéromateuse ⇒ antécédent CV) est encodée, en pré-remplissage.
- **N'extrapole aucun rythme de désescalade** vers la déprescription gériatrique. Le rapport OE est
  formel : les chiffres n'existent qu'en contexte de relais thérapeutique. La carte qui dit déjà
  « au jugement clinique, aucun rythme chiffré sourcé » (`insuline.yaml`) **a raison** et devient le
  gabarit des cas sans donnée.
- **Ne rouvre pas D46** (plafond 1600 px) tant que S3 n'a pas remesuré après S2. Si les intitulés
  raccourcis suffisent, D46 reste intact.
- **Ne traite pas le goulot du nœud « Traiter »** (6 sections, 5 « Suivant », > 50 % des actions de la
  passe) ni les 15 champs du nœud « Alimentation », jamais rempli en deux recettes successives. Ce
  sont des re-cadrages d'écran, pas des correctifs — et le premier demande une mesure préalable
  (combien de champs réellement visibles par section). Portés au backlog, à cadrer à part.
- Ne traite pas l'usage tactile (cibles de 32 px) : arbitré « probablement très rare, pas la
  priorité » par le référent le 2026-08-02.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-119, T-120 | Sûreté : la cible d'HbA1c cesse de changer toute seule | Sonnet | high | — | — | `src/features/decision/lib/esperanceVieDefault.ts`, `src/features/decision/screens/DecisionNodeScreen.tsx`, `content/decision/noeuds/diabete-type-2/cible-glycemique.yaml` | [x] — 2026-08-03 |
| [S2](S2.md) | T-121 | Intitulés : le motif sort du titre (3 nœuds de prescription) | Sonnet | high | — | — | `content/decision/noeuds/diabete-type-2/{prescription,insuline,statine}.yaml`, `src/features/decision/engine/banc/__snapshots__/` | [x] — 2026-08-03 |
| [S3](S3.md) | T-122, T-123 | Mise en page : le seuil des deux colonnes et leur équilibre | Sonnet | medium | Desktop | S1, S2 | `src/features/decision/screens/DecisionNodeScreen.css`, `.tsx`, `DECISIONS.md` | [x] — 2026-08-03 |
| [S4](S4.md) | T-067 | La branche AGP appariée : dire quoi baisser, pas la table | Sonnet | high | — | S2 | `content/decision/noeuds/diabete-type-2/insuline.yaml` | [x] — 2026-08-03 |
| [S5](S5.md) | T-124, T-125 | Titres de groupe et motifs restés bruts | Sonnet | medium | — | S2, S3, S4 | `content/decision/noeuds/diabete-type-2/*.yaml`, `src/features/decision/screens/DecisionNodeScreen.tsx` | [x] — 2026-08-03 |
| [S6](S6.md) | T-126, T-127 | Déprescription : onze aperçus muets et une alerte manquante | Sonnet | high | — | S2, S5 | `content/decision/noeuds/diabete-type-2/prescription.yaml` | [x] — 2026-08-03 |
| [S7](S7.md) | T-128→T-132 | Propreté : cinq défauts qui coûtent de la confiance | Sonnet | medium | Desktop | S3, S6 | `src/features/shared/ui/PastilleInfo.css`, `src/features/decision/screens/DecisionNodeScreen.tsx`, `content/decision/modules/diabete-type-2/rhd.yaml`, `content/decision/noeuds/diabete-type-2/*.argumentaire.md`, `statine.yaml`, `engine/banc/` | [x] — 2026-08-03 |
| [S8](S8.md) | T-133 | Conversions d'unités : le critère dérivé numérique | Sonnet | high | — | S6 | `src/features/decision/engine/deriveCritere.ts`, `schema/noeud.schema.json`, `content/decision/noeuds/diabete-type-2/{prescription,statine}.yaml` | [x] — 2026-08-03 |
| [S9](S9.md) | T-134 | « Je ne l'ai pas » : la valeur *indisponible* | Sonnet | xhigh | — | S8 | `src/features/decision/engine/`, `src/features/decision/lib/formLayout.ts`, `src/features/decision/components/CriteriaForm.tsx`, `content/` | [x] — 2026-08-03 |
| [S10](S10.md) | T-135, T-136 | Ce qui se voit sans un clic : accroche chiffrée, carte unique dépliée | Sonnet | medium | Desktop | S3 | `src/features/decision/screens/DecisionNodeScreen.tsx`, `.css`, `src/features/decision/components/OptionCard.tsx` | [x] — 2026-08-03 |

## Ordonnancement

- **Vague 1 — parallélisable** : **S1** (code + `cible-glycemique.yaml`) · **S2** (contenu des 3 autres
  nœuds + snapshots). Zones disjointes, aucune dépendance.
- **Vague 2 — parallélisable** : **S3** (mise en page, après S1 qui touche le même `.tsx`, et après S2
  dont dépend la remesure) · **S4** (`insuline.yaml`, après S2 qui touche le même fichier).
- **Vague 3** : **S5**, puis **S6** — les deux touchent `prescription.yaml`, elles ne se parallélisent pas.
- **Vague 4** : **S10** (présentation, après S3 qui touche le même `.tsx`), puis **S7** (après S10
  pour le `.tsx` et après S6 pour `prescription`/`statine`).
- **Vague 5** : **S8**, puis **S9** (S9 consomme le dérivé numérique de S8).
- **Vague 6 — consolidation** : commits tâche par tâche, statuts, `STATUS.md`, `TASKS.md`,
  points N2 des `S<k>.md` reversés dans `VALIDATION.md`, un seul push.

**S9 est droppable.** Elle touche la logique ternaire du moteur (D20) au plus profond ; si elle
dérape, le plan se clôt sans elle sans rien perdre des huit autres.

## Arbitrages rendus par le référent le 2026-08-02

Les six points ouverts au cadrage ont été tranchés. **Aucune session n'a à les rouvrir.**

1. **Le socle visible → accroche chiffrée.** Les blocs de contexte restent **repliés**, mais leur
   libellé visible annonce ce qu'ils contiennent (« 5 éléments non évalués — voir ») au lieu d'un
   titre générique. Le budget du socle reste réservé à la recommandation ; ce qui change, c'est que
   le praticien a désormais une raison d'ouvrir. → **S10/T-135**.
2. **P7/SA2 est débloquée.** Le signalement de validité de l'HbA1c vivra dans un `cadrage` dont
   l'accroche dit ce qu'il porte. La séquencer **après S10**, plus après un arbitrage.
3. **iSGLT2 chez le dénutri → une alerte préventive à canal unique.** Pas d'exclusion : le garde-fou
   des incrétines repose sur leur effet **anorexigène** (`prescription.yaml:946`, « aggravation de la
   dénutrition / sarcopénie »), que l'iSGLT2 ne partage pas — sa perte de poids est glycosurique.
   L'arbitrage du 2026-07-29 tient. **Mais le risque réel de cette patiente n'est pas son poids,
   c'est ce qu'elle mange** : l'acidocétose euglycémique est précipitée par le jeûne et les apports
   glucidiques insuffisants, et l'outil ne connaît ce risque que **rétrospectivement** (la carte se
   déclenche sur `cetonemie == true`, une cétonémie déjà confirmée). Une seule alerte couvre le jeûne,
   les apports insuffisants et la chirurgie programmée. → **S6/T-127**, qui absorbe l'item chirurgie.
4. **L'argument EBM du nœud cible → carte unique = carte dépliée.** Quand un écran ne porte qu'une
   seule option, sa carte s'affiche ouverte. → **S10/T-136**.
5. **« STATINE EN COURS » → renommer la section.** Le périmètre du nœud ne change pas ; la molécule
   et la dose restent hors périmètre. → **S7/T-132**, option (a).
6. **Plafond 1600 px (D46) → repli autorisé : plafonner la prose, pas les cartes.** Si S3 mesure
   qu'aucun seuil ne suffit, la colonne des recommandations peut dépasser 1600 px ; la colonne
   formulaire et les blocs de texte gardent leur plafond. Motif : D46 visait la longueur de ligne
   d'un paragraphe, sans objet pour une rangée de carte. → **S3/T-123**.
7. **S9 reste dans P12, en dernier**, avec sa condition d'arrêt inchangée.

## Bilan de clôture — 2026-08-03

**Dix sessions livrées. N0 : 1048 tests passés, 11 skip, 0 échec** (départ du plan : 982), typecheck
et build verts, mesuré machine libre.

**Une seule tâche n'a pas été livrée : T-120** (implication athérome ⇒ antécédent cardiovasculaire).
STOP fondé, vérifié des deux côtés : `cible-glycemique.yaml` ne déclare pas `ASCVD_etablie`, donc une
règle `preremplissage` qui le lit ne s'évaluerait jamais. La sûreté visée est de toute façon acquise
par T-119. Arbitrage porté dans `VALIDATION.md` — recommandation : abandonner.

**Six corrections après revue de l'orchestrateur**, aucune détectée par la suite de tests : garde
d'espérance de vie trop stricte (S1, le nœud le plus utilisé ne rendait plus rien) · trois intitulés
vidés de leur sens clinique (S2) · une provenance fausse contredite par le nœud lui-même (S4) · un nom
de famille cliniquement faux (S5) · une exigence de validation dont le fichier n'était pas dans le
périmètre de modification (S8). **Quatre de ces six venaient d'une erreur de ce plan, pas de
l'exécution** : une intention juste accompagnée d'une contrainte qui la contredit. Un `S<k>.md` dont
la section « Validation » exige ce que la section « Modifier » interdit est un piège que seul
l'orchestrateur peut voir.

**Ce qui a marché** : rejouer les vignettes de la recette au navigateur à chaque vague plutôt qu'à la
fin, et exiger qu'un garde-fou soit vu **rouge** avant d'être vert. Les trois dernières sessions
(S7 : invariant 11/13 rouge · S8 : 14 tests de propagation rouges · S9 : filtre désactivé pour voir
le test critique échouer) l'ont appliqué d'elles-mêmes, la pratique s'étant propagée de brief en brief.

## Le fil rouge

Les neuf sessions ont un point commun : **elles réduisent l'écart entre ce que l'outil sait et ce
qu'il montre.** Il sait dans quelle branche AGP se trouve le patient et affiche la table (S4). Il
possède le motif de chaque carte et le laisse en expression brute (S5). Il connaît la dose maximale de
metformine en insuffisance rénale et la met dans un bandeau, pas sur la carte qui dit « réduire »
(S6). Il calcule un IMC qu'il fait calculer de tête au praticien (S8). Aucune de ces sessions n'ajoute
de connaissance : toutes déplacent celle qui est déjà là.
