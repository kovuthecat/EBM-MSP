# Conception — module RHD (deux nœuds)

> **Statut** : conception en cours, décisions référent du 2026-07-26 intégrées. Aucun code, aucun YAML.
> **Origine** : refonte demandée par le référent (recette du 2026-07-25/26, § « Analyse de pertinence
> du module RHD ») ; collectes de contenu dans `rhd-collecte-alimentation.md` et
> `rhd-collecte-activite-physique.md` ; règles transverses dans `SPEC-valeur-indeterminee.md`.

---

## §1 — Le renversement

| aujourd'hui | demain |
|---|---|
| une option = **une stratégie** (le socle, la rémission) | une option = **une piste concrète, gatée sur une habitude déclarée** |
| 6 critères, 2 options, 8 alertes | 15 items de socle sur deux nœuds, 27 pistes, garde-fous en verrous |
| la cible est une recommandation affichée à tous | la cible est **l'en-tête** : le cap, avec son niveau de preuve et ses réserves |
| deux patients opposés → la même carte, mot pour mot | les pistes varient ; le cap ne varie pas |

---

## §2 — Structure retenue

```
MODULE RHD
├── En-tête (cadrage, jamais une recommandation)
│   ├── la cible EBM : se rapprocher du motif alimentaire méditerranéen + activité régulière
│   └── perte de poids & rémission — décision référent 2026-07-26 : PLUS UNE OPTION
│       fenêtre d'ancienneté, seuil IMC, orientation chirurgie ≥ 35, avec leurs réserves
│       (substitut érodable, DiRECT 46 % → 13 % à 5 ans ; Look AHEAD neutre sur les critères durs)
│
├── Préambule partagé  ← décision référent 2026-07-26
│   ├── terrain : âge, fragilité, traitements en cours   (réutilisés des nœuds A et E, jamais redéclarés)
│   ├── verrou dénutrition / sarcopénie  (HAS R.37)
│   ├── verrou TCA / restriction cognitive  (3 cases + « Rien à signaler »)
│   └── PRIMER : « sur quel levier travaillons-nous aujourd'hui ? »
│                alimentation · activité · les deux
│
├── NŒUD 1 — Alimentation           8 items socle · 11 en approfondissement · 17 pistes
│   familles : boissons · ultratransformés · restauration rapide · matières grasses ·
│              structure des repas · portions · orientation
│
└── NŒUD 2 — Activité physique      7 items socle · 10 en approfondissement · 10 pistes
    ├── verrou « contre-indications à l'effort » (checklist + « Rien à signaler »)
    └── familles : report modal · SÉDENTARITÉ · activité quotidienne ·
                   pratique structurée · orientation ressource
```

**Sédentarité** — décision référent 2026-07-26 : famille de pistes **à l'intérieur** du nœud activité
pour le pilote, avec ses propres déclencheurs et gestes. Extractible en nœud distinct plus tard si le
volume le justifie.

### Ce que le préambule partagé résout

1. **La charge de saisie**, risque n° 1 de cette refonte : 7 à 8 items par écran au lieu de 15 d'un
   bloc, et le terrain posé une seule fois pour les deux axes.
2. **La duplication de concepts**, que l'invariant I4 doit interdire : `fragilite`,
   `esperance_vie`, `age`, `traitements_en_cours` sont **réutilisés** des nœuds A et E, jamais
   réencodés — les deux agents de collecte y ont convergé indépendamment.

### Le garde-fou qui l'accompagne

> Le préambule ne doit **jamais** devenir un chaînage obligatoire entre nœuds. R1 est explicite :
> « la question directe l'emporte sur le chaînage ; le praticien peut n'ouvrir que le nœud qui
> l'intéresse ». Un préambule partagé est un **flux d'écran commun**, pas une dépendance de contenu :
> chaque nœud doit rester évaluable seul, avec ses critères posés directement.

---

## §3 — État de la preuve, par axe

C'est la particularité de ce module, et elle doit rester visible plutôt qu'être lissée.

| | pistes | *EBM dur* | *reco officielle* | *savoir-faire* | *ressource locale* |
|---|---|---|---|---|---|
| Alimentation | 17 | **1** | 12 | 2 | 1 |
| Activité physique | 10 | **0** (corpus local) | 7 | 2 | 1 |

**Une seule piste du module entier** revendiquait un bénéfice sur critère dur — et la passe red-team
du 2026-07-26 l'a invalidée en l'état (`redteam-collectes-rhd.md`, finding HAUTE n° 2) :

- **PREDIMED a randomisé l'huile d'olive vierge extra OU les noix**, jamais le colza. La piste
  « huile d'olive ou de colza » ne peut pas porter l'étiquette EBM-dur telle quelle ;
- **question ouverte, plus profonde** : le bras randomisé de PREDIMED est *un motif alimentaire
  méditerranéen supplémenté*, pas un geste isolé de changement d'huile. Attribuer l'effet à l'huile
  seule est déjà une sur-attribution. Si l'on tient cette rigueur, **le module n'a aucune piste
  isolée capable de porter l'étiquette EBM-dur** — c'est le motif d'ensemble qui la porte, ce qui
  plaide pour que l'étiquette appartienne à **l'en-tête du module** (le cap) plutôt qu'à une piste.
  **À trancher avec le référent avant l'écriture du contenu.**

Le zéro de l'axe activité est **en cours de réexamen** (décision référent 2026-07-26 : collecte de
preuve ciblée). Il ne signifie pas « aucune preuve » mais « aucune preuve **dans le corpus local**,
sur critère dur, dans la population exacte du nœud ». Look AHEAD, seul grand essai dans le DT2
établi, est neutre ; des preuves existent probablement en population adjacente (prédiabète,
post-infarctus) — à établir en source primaire avant toute revendication. Cf.
`preuve-activite-physique.md`.

**Conséquence de rédaction** : le nœud activité ne doit pas emprunter le registre du nœud
alimentation. Le précédent de rédaction du projet est le nœud `statine` (« la population PROUVÉE est
celle des ECR — CARDS 40-75 ans »).

---

## §4 — Les verrous, en blocs plutôt qu'en critères épars

Deux verrous, deux blocs, chacun refermable d'un clic via l'affordance **« Rien à signaler »** qui
existe déjà dans le formulaire dès qu'une section compte au moins 2 booléens décisifs.

| verrou | ce qu'il bloque | ce qu'il laisse passer |
|---|---|---|
| **TCA / restriction cognitive** (3 cases) | pistes de réduction et de quantification | substitutions qualitatives, régularité des repas — que la HAS cite elle-même comme mesure d'accompagnement du TCA |
| **Contre-indications à l'effort** (checklist) | montée d'intensité, pratique structurée | activité quotidienne de faible intensité, rupture de sédentarité |
| **Dénutrition / sarcopénie** (HAS R.37) | pistes restrictives | tout le reste |

Le verrou effort agrège les 7 garde-fous ancrés sur HAS R.19 / R.27 / R.28 : évaluation médicale
minimale avant intensité modérée, ischémie, hypoglycémie sous insulinosécréteur, rétinopathie
proliférante et manœuvre à glotte fermée, mal perforant plantaire, déshydratation du sujet âgé, seuil
glycémique avant l'effort. Trois d'entre eux se branchent sur des critères **déjà existants** dans le
domaine.

> **Ces verrous sont des `exclusions`, pas des alertes** — règle R8 (`SPEC-valeur-indeterminee.md`
> §3). Une contre-indication qui n'a pas le pouvoir de retirer une piste reproduirait exactement le
> défaut des 6 couples contradictoires relevés en recette.

---

## §4 bis — La cible, et la place de la culture

Décisions référent du 2026-07-26, sur constat que **la cible n'est pas définie de façon
opérationnelle dans le corpus local** : les sources n'en donnent que des fragments (« alimentation de
type méditerranéen, riche en huile d'olive », HAS Fiche 4 p. 180 ; composition de la fiche Prescrire
P10). On ne peut pas mesurer un écart à une cible non définie.

### La cible — ancrée sur le MEDAS

Le **MEDAS** (Mediterranean Diet Adherence Screener, 14 items) est l'instrument qui opérationnalise
l'adhérence dans **PREDIMED**, c'est-à-dire dans l'essai qui fournit toute la preuve dure du module.
L'ancrer sur lui est le choix le plus cohérent possible : la cible affichée devient exactement celle
dont le bénéfice a été mesuré.

**Récupéré le 2026-07-26** (`cible-mediterraneenne-medas.md`) : 14/14 items verbatim, validation
Schröder 2011 (*J Nutr*, DOI 10.3945/jn.110.135566). Nuance de provenance assumée : le texte intégral
de Schröder étant bloqué, les items proviennent de Martínez-González 2012 (*PLoS ONE*, CC-BY, mêmes
auteurs), dont le Tableau 1 reproduit l'instrument.

**Trois conséquences, dont une majeure.**

1. **Le socle actuel ne couvre que 2 des 14 axes de la cible** — huile vs beurre (S4) et boissons
   sucrées (S1) ; les pâtisseries (S2) partiellement. Non couverts : quantité d'huile d'olive,
   légumes, fruits, viande rouge/charcuterie *mesurée*, légumineuses, poisson, fruits à coque,
   préférence volaille, sofrito, vin. **Le recueil a été bâti sur « ce que les sources disent de
   collecter » (habitudes, contexte) et non sur « ce qui définit la cible ».** Les deux sont
   légitimes et différents — l'écart est maintenant chiffré, il doit être arbitré.

2. **Aucune version française validée du MEDAS.** Adaptations existantes : allemand, anglais UK,
   arabe marocain. Une cohorte française utilise un autre score (MeDi-Lite). Une traduction française
   informelle circule sur un site grand public, sans validation — à ne pas utiliser.

   > **Distinction qui lève la difficulté** : se servir du MEDAS pour **définir les axes de la
   > cible** n'est pas l'**administrer comme instrument scoré**. Le premier usage ne demande aucune
   > validation linguistique — on choisit des dimensions, on ne mesure pas un patient. Le second en
   > demanderait une. **Le module retient le premier usage.** À écrire explicitement, sous peine de
   > laisser croire à un score validé.

3. **Le vin est un item du MEDAS** (≥ 7 verres/semaine). Le socle l'avait écarté au motif
   qu'« aucune source locale ne le relie au motif méditerranéen-cible » — motif désormais faux. Son
   exclusion reste défendable, mais elle doit être **re-justifiée comme un choix délibéré** de ne pas
   proposer d'alcool dans un outil de soins primaires, et non comme une absence de la cible.
   **Arbitrage référent.**

### Décisions référent du 2026-07-26 sur ces trois points

#### 0. RÈGLE STRUCTURELLE — le module propose un MOUVEMENT, jamais une CIBLE CHIFFRÉE

Décision référent du 2026-07-26, **prioritaire sur tout le reste de cette section** : l'objectif est
de *suggérer des recommandations pour se rapprocher de l'objectif démontré*, **pas de proposer des
cibles à atteindre**.

| ce que le module ne fait pas | ce qu'il fait |
|---|---|
| « objectif : ≥ 3 fruits par jour » | « ajouter un fruit au déjeuner » |
| « vous êtes à 6 axes sur 14 » | « vous cuisinez au beurre — passer à l'huile d'olive rapproche du motif testé » |
| mesurer un écart | proposer un pas |

Quatre conséquences, toutes contraignantes :

1. **Le recueil porte sur la direction et la fréquence déclarée, jamais sur une quantité à comparer à
   un seuil.** « Mangez-vous des fruits à coque ? jamais / de temps en temps / régulièrement » — pas
   « combien de grammes par jour ? ».
2. **Aucune piste n'affiche de valeur à atteindre.** Les quantités des essais (1 L d'huile d'olive par
   semaine, 30 g/j de fruits à coque) vivent dans l'**argumentaire**, au titre de *ce qui a été testé*,
   jamais dans le geste proposé.
3. **Aucun score d'adhérence** — pas de pourcentage, pas de « x/14 », pas d'agrégation. Ce serait à la
   fois un score caché (invariant CLAUDE.md 2 / `DECISIONS.md` D3) et le registre de la cible.
4. **Le rang d'une piste ne peut donc pas être une distance calculée.** C'est un rang **déclaré dans le
   contenu**, et sa justification EBM est la **proximité au bras randomisé**, pas l'écart du patient.
   → cela tranche par avance la question §8-5 (« proximité à la cible ou faisabilité d'abord ? ») :
   « proximité » ne peut pas signifier distance mesurée.

> **Pourquoi c'est structurel et non cosmétique** : un écart mesuré appelle un score, un score est un
> arbitrage caché, et un tableau de bord d'adhérence est exactement le registre culpabilisant que la
> HAS met en garde (« la stabilisation du poids est déjà un succès », déculpabiliser, valoriser tout
> changement). La règle référent, l'invariant D3 et la non-culpabilisation convergent.

**Deux frontières à ne pas confondre avec une cible** — restent autorisées : *renvoyer au praticien ce
que le patient a déclaré* (« vous cuisinez plutôt au beurre ») n'est pas un score, c'est le
déclencheur de la piste rendu lisible ; et *l'en-tête décrivant le motif testé* n'est pas une
prescription, c'est l'ancrage de preuve.

#### 1. Socle — approche hybride, en registre de mouvement

Le socle actuel (habitudes observables) reste ce qui **déclenche les pistes** : c'est lui qui rend
l'outil actionnable, et il est sourcé sur des recommandations françaises orientées consultation. On
lui ajoute les axes les plus proches de la preuve randomisée — **posés en fréquence déclarée, jamais
en quantité mesurée** (règle 0) :

| rang | axe à ajouter | forme du recueil | pourquoi ce rang |
|---|---|---|---|
| 1 | **fruits à coque** | présence/fréquence déclarée | **l'un des deux bras randomisés de PREDIMED**, aujourd'hui totalement absent du recueil |
| 2 | huile d'olive | le socle a déjà « huile vs beurre » (S4) — **suffisant** : la quantité relèverait de la cible | l'autre bras randomisé |
| 3 | légumineuses · poisson · viande rouge/charcuterie | fréquence déclarée | composantes du motif, non randomisées isolément |

Les 14 axes du MEDAS servent à **définir la cible décrite en en-tête** ; ils ne sont ni tous
recueillis, ni jamais scorés. Le module utilise le MEDAS comme **cadre de définition**, jamais comme
instrument administré — c'est cette distinction qui rend l'absence de version française validée sans
conséquence, et c'est elle aussi qui interdit d'en dériver un score.

**2. Vin — recueilli, jamais proposé.** La consommation entre au recueil (elle appartient au tableau
clinique et interagit avec le foie, les triglycérides et l'hypoglycémie sous insulinosécréteur), mais
**aucune piste ne propose jamais d'en boire**. La cible affichée signale qu'elle s'écarte
délibérément du MEDAS sur ce point. ⚠ Vérifier à la rédaction que le recueil ne se lise pas comme une
invitation, et prévoir le renvoi vers le repérage d'un mésusage si la réponse l'appelle.

**Régime d'intervention PREDIMED, pour mémoire** : bras huile d'olive 1 L/semaine (min. 50 mL/j) ;
bras fruits à coque 30 g/j (15 noix + 7,5 amandes + 7,5 noisettes) ; contrôle = conseil pauvre en
graisses ; **aucune restriction calorique**.

**Réutilisation** : le tableau source est en CC-BY (attribution requise) ; la licence de l'article
d'origine n'a pas pu être vérifiée.

### La culture — couche d'illustration, jamais de gating

**Les pistes se déclenchent sur l'habitude mesurée** (socle S1-S7), jamais sur une tradition
déclarée. La tradition ne change que les **exemples** employés pour formuler la piste.

Raison : *l'écart au motif méditerranéen est une propriété de l'habitude, pas de l'origine*. Deux
patients de la même tradition ont des profils de matière grasse et d'ultratransformés qui peuvent
être opposés — et le socle mesure ces profils directement. Passer par la tradition serait utiliser un
proxy là où on dispose de la mesure. S'y ajoutent une liste fermée de cultures à déclarer dans le
contenu, ce qui n'est pas anodin pour une MSP du 20ᵉ, et un volume de contenu multiplié par le nombre
de traditions.

**Conséquence d'architecture — aucune évolution du moteur.** La couche d'illustration est un champ de
contenu **affiché, jamais évalué**, exactement comme l'argumentaire. Le moteur reste ignorant de toute
notion de culture (invariant CLAUDE.md 5), et le contenu croît de façon **additive** : une tradition
de plus = des exemples de plus, pas une branche de règles de plus.

**Critère de sélection des traditions illustrées** : prévalence dans la patientèle de la MSP, et
disponibilité d'une source compétente (le diététicien de la MSP). On peut donc démarrer à une ou deux
traditions et étendre, sans rien rejouer. Étiquette de provenance : *savoir-faire diététique (non
EBM)*.

**Ce qui reste collecté mais non décisif** : la question « quelle est votre cuisine habituelle ? »
(A5, texte libre) garde son intérêt pour la conversation et pour le choix des illustrations — elle ne
pilote aucune règle.

---

## §5 — Registre de formulation

Non négociable, et c'est ce qui décidera de l'utilité réelle du module.

- **Comportement observable**, pas prescription générale : « remplacer les sodas par de l'eau » et non
  « réduire les sucres ». Modèle : la fiche patient P10 de Prescrire et les objectifs concrets
  d'ebmfrance.
- **Plutôt petites que grandes** (ebmfrance) : une piste doit être négociable en consultation.
- **Non-culpabilisation**, la HAS y insiste : « la stabilisation du poids est déjà un succès ». Un
  outil qui demande la fréquence de restauration rapide puis répond « réduisez la restauration
  rapide » tombe dans le registre que la HAS met en garde. Les pistes sont **matière à négociation**,
  jamais des verdicts.
- Chaque piste porte **son étiquette de provenance**, affichée. Rien n'interdit d'afficher du
  savoir-faire diététique ; ce qui est interdit est de le faire passer pour de la preuve.

---

## §6 — Décisions prises

| date | décision |
|---|---|
| 2026-07-26 | Deux nœuds distincts (alimentation, activité), regroupés sous un module RHD commun |
| 2026-07-26 | Collecte de contenu sur les deux axes ; construction en commençant par l'alimentation |
| 2026-07-26 | Préambule partagé au module + primer de levier |
| 2026-07-26 | Sédentarité = famille de pistes du nœud activité (pilote), pas un nœud distinct |
| 2026-07-26 | Perte de poids / rémission = en-tête de module, plus une option |
| 2026-07-26 | Collecte de preuve ciblée sur l'activité physique et les critères durs |
| 2026-07-26 | **Rupture de sédentarité : seuil retenu = minimum 1 min par heure** (HAS R.16, reco DT2, grade C) — et non les « 4-5 min toutes les 1 h 30 » de la Fiche 5 du guide obésité, non gradée. Le plus bas des deux seuils, le mieux gradé, et le plus atteignable ; à vérifier par la passe red-team |
| 2026-07-26 | **Sourçage** : la position affichée s'appuie sur la donnée publiée, jamais sur le nom d'une revue (Prescrire, Médicalement Geek, Minerva). Cf. `DECISIONS.md` D23 — s'applique aux deux nœuds RHD dès leur écriture, pas en rattrapage |

---

## §7 — Ouvert

Par ordre de ce qu'elles bloquent.

1. **Règle de tri des pistes** (§8-5 de la recette, jamais tranchée) — proximité à la cible EBM
   d'abord, ou faisabilité déclarée d'abord ? Elle décide de ce que le praticien voit en premier.
   Rappel : ce ne peut pas être un score caché (invariant D3) ; ce doit être un **rang déclaré dans le
   contenu**, comme `priorite` ailleurs dans le projet.
2. **Plafond d'affichage** — combien de pistes à l'écran ? ebmfrance plaide pour 2-3 négociables. Avec
   8 questions de socle, un patient peut en déclencher dix ; afficher les dix reproduirait à l'envers
   le défaut actuel.
3. **Traditions culinaires** (§8-2) — le référent l'a lui-même désignée comme la question qui
   conditionne tout le reste : quelles traditions, décrites sur quelle base, fournies par qui
   (diététicien de la MSP ?). Aucune source du dépôt ne couvre ce corpus ; la SFD acte elle-même le
   trou.
4. **Seuil de rupture de sédentarité** — divergence entre deux sources HAS : R.16 de la reco DT2
   (« ≥ 1 min/heure », grade C) et Fiche 5 du guide obésité (« 4-5 min toutes les 1 h 30 », non
   gradée).
5. **Frontière avec l'ETP et le diététicien** (§8-6) — outil du médecin généraliste, ou support
   partagé ? La réponse change la profondeur de recueil acceptable.
6. **Nom et forme du champ de module** dans le schéma — cosmétique, à trancher à l'écriture.
7. **MEDAS** — introuvable dans les sources locales (recherche exhaustive, 0 occurrence). À récupérer
   et vérifier en source primaire si l'on veut s'en servir ; aucun item ne doit être reconstitué.
