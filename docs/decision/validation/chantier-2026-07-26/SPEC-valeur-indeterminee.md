# Spécification — valeur indéterminée, canaux de sécurité, invariants

> **Statut** : proposition, à valider par le référent. Écrite le 2026-07-26 à partir de la recette
> `recette-2026-07-25-prescription-intensifier.md` et des cinq inventaires du présent dossier.
> **Portée** : générique, tous domaines. Aucun contenu clinique ici — le *quoi* reste dans
> `docs/decision/noeuds/`, la grammaire d'écriture dans `docs/decision/GRAMMAIRE-NOEUD.md`.
> **Décisions référent déjà prises** (2026-07-26) : cf. §0.

---

## §0 — Décisions actées

| # | question posée | réponse du référent |
|---|---|---|
| Q1 | Un critère décisif n'est pas renseigné : que fait l'outil de la recommandation qui en dépend ? | **Ne pas se prononcer** — l'option n'est ni proposée ni écartée, l'écran demande le champ |
| Q2 | Un garde-fou (`exclusion`) porte sur un critère non renseigné : que fait-on ? | **Mettre l'option en attente** — ni proposée, ni écartée : « contre-indication à vérifier » |
| Q3 | `statine` n'a aucun critère « déjà traité » ni « intolérance » | **Ajouter les deux critères** |
| Q4 | Périmètre du pilote RHD | Collecte sur les deux axes ; construction en commençant par l'alimentation ; **deux nœuds distincts regroupés sous un module commun RHD** |

Q1 et Q2 convergent : **l'outil cesse d'affirmer ce qu'il ne sait pas, dans les deux sens.** C'est le
choix qui ne penche ni vers le rassurant ni vers l'alarmant, et c'est ce qui écarte le seul scénario
où ce chantier produirait pire que l'existant (suspendre un garde-fou sur donnée manquante).

---

## §1 — Le problème, en une phrase et trois chiffres

Une valeur de critère est nue : rien n'y distingue « saisi par le praticien » de « valeur par défaut
jamais touchée ». `touched` existe, mais vit dans l'écran (`DecisionNodeScreen.tsx`) et ne franchit
jamais la frontière du moteur.

- **86 règles** mentionnent un critère `nombre` ou `enum` dans les 5 nœuds ; sur valeur par défaut,
  **56 penchent vers le rassurant, 16 vers l'alarmant, 14 sont neutres** ;
- **5 nœuds sur 5** produisent une sortie sur formulaire entièrement vierge, dont trois franchement
  fausses : `cible-glycemique` → la cible la plus stricte (~6,5 %) ; `statine` → un tier désigné par
  trois champs vides ; `prescription` → la metformine, socle du DT2, **écartée** sur un `DFG < 30`
  jamais saisi ;
- **1 division** dont le dénominateur est un critère saisi (`insuline.yaml:100`) et **4 calculs** de
  dose pouvant afficher `0 U/j`.

Cette famille de défauts est aujourd'hui **structurellement intestable** : le banc engendre des
profils à partir de *valeurs* (`banc/profils.ts`), `relevance.ts` perturbe des *valeurs*, Ajv valide
le *contenu*. « Inconnu » n'existe dans aucun de ces espaces.

---

## §2 — R7 · Sémantique de la valeur indéterminée

### 2.1 Définition

Un critère vaut `indetermine` lorsque le praticien n'a pas fourni sa valeur. C'est un **troisième
état**, distinct de `0`, de `false` et de la première valeur d'énumération.

### 2.2 Quels types peuvent être indéterminés — et pourquoi pas tous

Le point délicat : rendre *tout* indéterminé par défaut rendrait tout nœud muet à l'ouverture. La
règle se calque donc sur la question « la valeur par défaut est-elle une réponse clinique ? ».

| type | défaut actuel | est-ce une réponse ? | statut proposé |
|---|---|---|---|
| `nombre` | `0` | **non** — aucun âge, DFG, HbA1c ou poids ne vaut 0 | **indéterminé** tant que non saisi |
| `enum` | 1ʳᵉ valeur déclarée | **non** — l'ordre de déclaration est un choix d'auteur, pas un fait | **indéterminé**, sauf si le contenu déclare explicitement un `defaut` |
| `bool` | `false` | **oui** — une case non cochée EST « non » (parti pris déjà acté, `CriteriaForm.tsx:88`) | reste `false`, **sauf** `confirmation_requise: true` déclaré par le contenu |
| `liste` | `[]` | **oui** — liste vide = « aucun » | reste `[]`, même réserve |

> ⚠ **Seul point de cette spécification qui reste à arbitrer.** Q1 a été posée sur un `nombre` (le
> DFG). L'extension aux `bool` ne va pas de soi : `diabete_complique == false` non coché a contribué
> à désigner le mauvais tier de `statine` (13.2), mais rendre tout booléen indéterminé rendrait tout
> nœud muet. Le compromis proposé est l'opt-in `confirmation_requise`, à poser par l'auteur du
> contenu sur les seuls booléens dont le « non » ne peut pas être présumé sans risque. **Trois
> candidats identifiés** : `diabete_complique` (statine), `ASCVD_etablie` (statine, prescription),
> `dialyse` (statine). À confirmer nœud par nœud.

### 2.3 Évaluation — logique ternaire

Comparaison dont un opérande est indéterminé → `indetermine`. Composition :

| | `AND` | `OR` |
|---|---|---|
| `faux` ∘ `indet.` | **faux** | `indet.` |
| `vrai` ∘ `indet.` | `indet.` | **vrai** |
| `indet.` ∘ `indet.` | `indet.` | `indet.` |

**Propriété décisive, qui limite fortement le risque de mutisme** : une disjonction dont une branche
est vraie reste vraie. `DFG < 60 OR ASCVD_etablie == true`, DFG inconnu mais ASCVD cochée → **vrai**,
l'option reste proposée. Le DSL n'ayant pas de parenthèses et `AND` primant sur `OR`, toute
expression est une disjonction de conjonctions : il suffit qu'une conjonction soit pleinement vraie
pour que la règle se prononce.

### 2.4 Effet selon la position de la règle

| position | indéterminé ⇒ | motif |
|---|---|---|
| `conditions` | option **en attente** | Q1 |
| `prerequis` | option **en attente** | même nature que `conditions` |
| `exclusions` | option **en attente** | Q2 — ni écartée (affirmerait la CI), ni proposée (la masquerait) |
| `priorite[].quand` | la règle ne matche pas ; on passe à la suivante ; si aucune ne matche, aucun rang ni motif de rang | un rang n'est pas un fait clinique |
| `alertes[].quand` | **alerte non affichée** | une alerte qui affirme sur donnée absente EST le défaut 12.1 |
| `derive` (comparaison) | le dérivé vaut `indetermine` et se propage | `cible_atteinte` sur HbA1c vide ne doit pas valoir « objectif atteint » |
| `derive` (arithmétique) | `indetermine`, **jamais `Infinity` ni `NaN`** | tue `dose_basale_actuelle / poids` (12.4) |
| `calculs` | dose **non affichée** | tue les « ≈ 0 U/j » (12.5) |

### 2.5 Ce que voit le praticien

Un **quatrième registre** d'options, distinct des trois existants :

| registre | sens | affichage |
|---|---|---|
| applicable | proposé | carte, badge, rang |
| `ecartees` (R4) | garde-fou déclenché | poussé, avec motif — sécurité |
| `nonRetenues` (R4) | non indiqué pour ce patient | sur demande — explication |
| **`enAttente`** (R7) | **ne peut pas se prononcer** | poussé, avec la liste des champs à renseigner |

Sur formulaire vierge, l'écran doit donc afficher **« à renseigner : … »** plutôt qu'une
recommandation. C'est un état d'interface nouveau, à concevoir.

### 2.6 Provenance d'une valeur

`touched` remonte de l'écran vers le modèle de critères. Trois statuts, portés par la donnée :
`saisi` · `suggere` (heuristique d'interface non sourcée, cf. `lib/esperanceVieDefault.ts`) ·
`indetermine`. Toute justification affichée citant une valeur `suggere` doit la marquer comme telle
— aujourd'hui « Espérance de vie = Limitée » est cité comme un fait du patient alors qu'il a été
déduit (12.12).

### 2.7 Effets de bord à absorber

- **Invariant de banc n° 2 (« jamais `applicable` vide ») devient faux tel quel** : une sortie vide
  est désormais *correcte* sur formulaire vierge. Reformulation : *jamais `applicable` vide lorsque
  tous les critères pertinents sont renseignés*.
- **Coût de `relevance.ts`** : ajouter `indetermine` aux valeurs candidates augmente l'espace de
  perturbation, déjà à ~12,3 s sur `prescription`. Parade déjà prévue par la grammaire : isoler R5
  dans un script hors suite courante.
- **Caractérisation** : `banc/caracterisation.test.ts` produira un diff massif. **C'est l'objet du
  fichier**, pas une régression — chaque écart doit être relu.

---

## §3 — R8 · Où loger un fait de sécurité

La recette a montré 6 couples où une alerte interdit ce qu'une carte prescrit. Cause : les alertes de
nœud sont évaluées sur les seuls critères, **jamais sur ce que le moteur a retenu**. La contradiction
est garantie dès que le même fait est exprimé des deux côtés.

### 3.1 Règle d'aiguillage

| le fait… | canal | visibilité |
|---|---|---|
| rend un geste **contre-indiqué** | `options[].exclusions` | poussée avec motif (R4) |
| **qualifie** un geste sans l'interdire | `options[].alertes` | seulement si l'option est retenue |
| est vrai **quel que soit** le geste retenu | `alertes` de nœud | toujours |

### 3.2 Deux interdits

- **`priorite` ne porte jamais un fait de sécurité.** Rétrograder n'est pas retirer. Cas réel :
  `prescription`, option iSGLT2 — `infections_uro_genitales_recidivantes == true` donne le rang 6,
  pendant que l'alerte `:761` dit « ne pas initier ; risque de gangrène de Fournier ». Le réflexe
  rétrogradation est le frère du réflexe alerte.
- **Une alerte de nœud n'a jamais `quand: "default"`.** Elle s'affiche alors pour tout le monde, donc
  pour personne. Cas réel : `rhd.yaml:269` (« sujet âgé / fragile / dénutri »).

### 3.3 Portée mesurée

Sur 35 alertes de nœud : 1 à passer en `exclusion`, 4 en alerte d'option, 1 bloquée faute de critère
(dialyse, débloquée par Q3), plus les deux cas ci-dessus. **Le canal alerte n'est donc pas à vider —
il est à discipliner.** Les 7 lignes `incertitudes` actant « modélisé en alerte plutôt qu'en gate »
(prescription:977, insuline:487, statine:289-291, rhd:220/222) sont à rejuger une par une sous R8.

### 3.4 Le malentendu à lever

L'invariant D3 interdit les **scores cachés**, pas les **règles**. Une `exclusion` sur `dialyse ==
true`, affichée avec son motif, est l'exact opposé d'un arbitrage caché : c'est un arbitrage déclaré,
sourcé et rendu à l'écran. Conflater « pas de gating hors EBM dur » avec « aucun score caché » est ce
qui a fait glisser des interdits de sécurité dans un canal sans pouvoir de retrait.

---

## §4 — Invariants de banc à ajouter

Portés par le banc (`engine/banc/`), génériques, tous nœuds.

| # | invariant | couvre |
|---|---|---|
| I3 | aucune option ni alerte ne se prononce sur un critère indéterminé | 12.1-12.5, 13.1-13.4 |
| I4 | deux règles nommant le même concept clinique utilisent la même expression | 12.6, 12.7 (`terrain_fragile` vs triplet brut) |
| I5 | toute réserve énoncée en prose est soit un critère d'entrée, soit déclarée hors périmètre | 13.7, 13.8 (borne CARDS 40-75) |
| I6 | aucune alerte de nœud avec `quand: "default"` | rhd:269 |
| I7 | une alerte au libellé prohibitif (« ne pas », « contre-indiqué », « arrêter ») implique une `exclusion` correspondante | les 6 couples contradictoires |
| I2′ | jamais `applicable` vide **lorsque tous les critères pertinents sont renseignés** | remplace I2 |

> ⚠ Rappel de la grammaire : *un invariant trop large est pire qu'absent* — il force à encoder une
> règle fausse pour le faire passer. Quand un invariant échoue, la première question est « dit-il
> vraiment ce que je voulais dire ».

---

## §5 — Ordre de livraison

| | quoi | dépend de |
|---|---|---|
| 0 | ✅ caractérisation (`banc/caracterisation.test.ts`) | — |
| 1 | validation de cette spec + arbitrage §2.2 (booléens `confirmation_requise`) | référent |
| 2 | invariants I3-I7 au banc | 1 |
| 3 | **R7** — moteur, dérivés, calculs, modèle de critères, registre `enAttente`, écran « à renseigner » | 2 |
| 4 | relecture du diff de caractérisation, nœud par nœud | 3 |
| 5 | **R8** — réaffectation des alertes, appariée aux critères manquants là où elle en dépend (`statine`) | 4 |
| 6 | prérequis manquants (`prescription:465`, `insuline:121`), règle d'âge `statine`, `visible_si` de `insuline` | 3 |
| 7 | primer en sortie (`prescription`/`intention`), reléguer + expliquer — jamais supprimer | 3 |

**Deux couplages à ne pas casser :**

- `insuline` — ajouter un prérequis avant d'avoir traité la préemption du repli (12.11) peut produire
  une sortie vide dans 3 situations sur 4. **12.11 d'abord.**
- `statine` — transformer l'alerte dialyse en `exclusion` sans les critères de Q3 viderait le nœud
  (3 options en `ordered-first-match`, dont la 3ᵉ est le repli). **Q3 d'abord.**

---

## §6 — Entrées à porter dans `DECISIONS.md`

Rédigées ici, **non appliquées** — `DECISIONS.md` est un fichier existant, à modifier sur accord.

- **D-nn — Valeur indéterminée.** Un critère non renseigné vaut `indetermine`, troisième état
  distinct de `0`/`false`/1ʳᵉ valeur. Évaluation ternaire. Une option dont une `conditions`,
  `prerequis` ou `exclusions` est indéterminée passe **en attente** : ni proposée, ni écartée. Une
  alerte, une dose calculée ou un dérivé indéterminé ne s'affichent pas. Motif : l'outil ne doit
  jamais affirmer ce qu'il ne sait pas, ni dans le sens rassurant ni dans le sens alarmant.
- **D-nn — Canal d'un fait de sécurité.** Contre-indication ⇒ `exclusions` ; réserve attachée à un
  geste ⇒ alerte d'option ; fait indépendant du geste ⇒ alerte de nœud. `priorite` ne porte jamais un
  fait de sécurité ; une alerte de nœud n'a jamais `quand: "default"`.
- **D-nn — Périmètre `statine`.** Ajout de `statine_deja_en_place` et `intolerance_statine` : le nœud
  couvre l'initiation **et** la poursuite.
- **D-nn — Module RHD.** Deux nœuds distincts (alimentation, activité physique) regroupés par un
  champ de module optionnel, générique, piloté par le contenu — même motif que `groupe` sur les
  critères et `famille` sur les options. Aucun impact moteur.
