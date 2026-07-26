# Construire un module de décision — spécification de construction, **tous domaines**

> **Statut** : proposition issue du bilan du premier domaine (DT2), écrite le 2026-07-26. **Non
> arbitrée** — les étapes et les portes de sortie sont à valider par le référent avant d'engager le
> deuxième domaine.
>
> **Portée** : ce document ne parle d'**aucun domaine clinique**. Il dit **dans quel ordre** construire
> un module et **à quelles conditions** passer à l'étape suivante. Il ne dit pas comment écrire un
> nœud — c'est `GRAMMAIRE-NOEUD.md` (règles R1→R9), consulté *pendant* l'écriture. Ce document-ci se
> suit *avant et autour*.

| document | répond à | consulté |
|---|---|---|
| `PROJECT_BRIEF.md` · `BRIEF_DECISION.md` | quoi, pour qui | au cadrage |
| **`CONSTRUIRE-UN-MODULE.md`** *(ce fichier)* | **dans quel ordre, avec quelles portes** | **du début à la fin** |
| `GRAMMAIRE-NOEUD.md` | comment écrire un nœud correct (R1→R9) | à l'écriture et à la relecture |
| `00-global.md` | comment sourcer et red-teamer (méthode, illustrée sur DT2) | à la collecte |
| `schema/noeud.schema.json` | le contrat exécutable | en permanence, par les tests |
| `DECISIONS.md` | les arbitrages transverses (D1→D23) | quand une règle surprend |

---

## 0. Ce que ce document existe pour ne pas refaire

**Le chiffre qui commande tout le reste.** Recette élargie des 25-26/07/2026, 5 nœuds DT2, 13 captures,
~40 anomalies relevées : **aucune n'est une erreur EBM.** Pas un chiffre faux, pas un PMID erroné, pas
un bénéfice sur-vendu, pas une reco mal citée. Toutes relèvent du **modèle** — valeur manquante, canal
d'alerte, geste déjà fait, concept encodé deux fois.

La phase de collecte a tenu. Ce sont les vagues de correction qui ont construit, écran après écran,
**la spécification du modèle de décision — celle qui n'avait jamais été écrite.** Ce document est cette
spécification, rendue disponible *avant* plutôt que découverte *pendant*.

### Les quatre raisons structurelles

1. **La littérature décrit des populations où tout est mesuré ; l'outil agit sur un individu dont on
   ignore la moitié.** Aucun essai ne dit quoi afficher quand le DFG n'est pas renseigné. La sémantique
   de l'inconnu (R7) est **entièrement hors du corpus** : aucun red-team des données ne pouvait la
   détecter. C'est la famille de défauts la plus nombreuse.
2. **La preuve s'organise par question, la consultation par situation.** Les dossiers ont été bâtis par
   nœud (une question clinique) ; un patient arrive avec une intention. D'où la fusion B+C+D en
   `prescription`, la refonte S8 par intention, puis la scission du module RHD en deux nœuds. Une
   taxonomie de la preuve n'est pas une taxonomie du travail, et l'écart ne se voit qu'au contact.
3. **La preuve produit des propositions, l'outil doit produire des actes.** « Metformine = socle » est
   vrai ; « instaurer ou poursuivre la metformine » adressé à qui en prend déjà est faux comme *acte de
   parole*. Passer de l'énoncé à la directive exige ce que la preuve ne contient jamais : l'existant,
   l'intention, ce qui a déjà échoué (R9).
4. **La vérification mesurait la fidélité de transcription, pas le comportement.** L'étape 8 demande :
   le YAML représente-t-il fidèlement le dossier ? Elle ne peut pas voir qu'une transcription fidèle
   produit une sortie absurde. `insuline` et `statine` en sont sortis à **0 finding HAUTE** ; la recette
   y a trouvé 19 anomalies. Deux procédures, deux objets — on n'en faisait qu'une.

### Le fil conducteur, en une phrase

> Chaque cause racine venait de **deux règles justes dont l'interaction n'avait jamais été testée**
> *(commit `f1e8f19`)*.

C'est pourquoi ce document insiste autant sur le **banc** et les **vignettes** : une règle se relit,
une interaction se teste.

---

## 1. Les huit étapes, avec leur porte de sortie

> **Principe directeur — inverser l'ordre d'acquisition de la certitude.** En DT2, on a été certain des
> données très tôt et du modèle très tard. Le modèle détermine quelles preuves sont nécessaires ; il
> vient donc d'abord. L'ordre collecte → encodage n'était pas fautif : c'est l'absence d'une piste
> « comportement » menée en parallèle qui l'était.

### P0 — Prérequis génériques, avant toute ligne de contenu

Un nouveau domaine hériterait sinon des défauts du premier dès sa ligne 1.

| prérequis | pourquoi |
|---|---|
| **R7 en vigueur** (valeur indéterminée, D20) | sans elle, un formulaire vierge affirme |
| **Invariants de banc I3→I7** verts sur tous les nœuds existants | ils ne servent à rien s'ils ne sont pas déjà tenus |
| **Bornes de domaine** (`min`/`max`) sur tout critère `nombre` | double motif, voir encadré |
| **Catalogue de critères canonique** (T-019) | `age`, `DFG`, `fragilite`, `esperance_vie` seront partagés entre domaines |

> **Les bornes de domaine servent deux fois, et le second usage est invisible.**
> 1. À la saisie : sans borne, `autres_FDRCV` accepte **−1**, ce qui bascule la recommandation
>    (`statine`, capture 13.4).
> 2. **Au banc** : le générateur extrait les seuils des règles qui *mentionnent* un critère. Une règle
>    citant à la fois `DFG` et les paliers de dose 1 000 / 2 000 fait entrer ces littéraux dans le
>    domaine de tirage du DFG — **le banc teste des patients à 2 000 mL/min** (commit `350da8b`).
>    « Le défaut s'aggrave à mesure que le contenu s'enrichit : toute règle associant deux critères
>    d'échelles différentes corrompt le domaine de l'un par les littéraux de l'autre. » La correction
>    est en **deux gestes indissociables** — déclarer les bornes **et** écarter à l'extraction tout
>    littéral hors bornes ; sans le second, le générateur ne sait toujours pas à quelle variable
>    appartient un littéral.

**Sans catalogue partagé, on reproduit à l'échelle inter-domaine un défaut déjà constaté *à l'intérieur*
d'un nœud** : `insuline` portait deux définitions concurrentes du risque hypoglycémique
(`terrain_fragile`, incluant `age >= 75`, pour l'alerte de cibles ; le triplet brut sans l'âge pour le
choix de l'insuline et la désintensification), de sorte qu'un patient de 80 ans était « à haut risque »
pour relâcher une cible et « sans risque » pour recevoir l'insuline la plus sûre (capture 12.6, corrigé
en `b101ae4`).

**Porte de sortie P0** : les quatre lignes du tableau sont vertes. *Tant que P0 n'est pas franchi, tout
contenu produit est de la dette.*

---

### P1 — Cadrer par la consultation, pas par la littérature

Deux livrables courts, écrits **par le référent, sans agent et sans source**.

1. **Les intentions du praticien** — l'équivalent domaine de `initier / intensifier / optimiser /
   déprescrire`. Elles **ne se transposent pas** : un domaine peut en avoir une que le DT2 n'a pas
   (*confirmer le diagnostic*, typiquement, dès que le fait clinique dépend de la méthode de mesure).
2. **L'inventaire de l'existant** (R9) — tout ce que le nœud devra savoir de ce qui est **déjà en
   place** : classes, nombre de lignes, doses, tolérance, associations. C'est le livrable que le DT2
   n'a jamais produit d'emblée et qu'il a redécouvert nœud par nœud, au prix de trois corrections.

**Trois questions de structure à trancher ici**, parce qu'elles commandent tout le reste :

- **De quelle mesure parle le nœud ?** Quand le fait clinique dépend de la méthode (cabinet /
  automesure / ambulatoire ; capillaire / continu), la méthode est un **critère de premier rang**. Le
  DT2 l'a rencontrée en périphérie — l'outil réclamait une glycémie à jeun alors qu'une mesure continue
  était en place et renseignée — et l'a subie plutôt que modélisée ; il a fallu un arbitrage référent
  tardif pour faire du profil nocturne le pivot et de la glycémie à jeun le repli (`6561c53`).
- **La cible est déclarée, jamais déduite** (R1). S'il existe un nœud « fixer l'objectif », la position
  du patient par rapport à *son* objectif est une **saisie** ; aucun seuil universel ne s'applique en
  douce.
- **Découpage en nœuds, et module ou pas.** Un module (D22) regroupe des nœuds d'un même domaine et
  porte un préambule de terrain commun + un primer d'orientation. À décider **avant** d'écrire, sur le
  critère de la charge de saisie : au-delà d'une douzaine d'items par nœud, la consultation ne suit plus.

**Porte de sortie P1** : le référent a écrit les intentions et l'inventaire de l'existant, et les trois
questions sont tranchées par écrit.

---

### P2 — Les vignettes d'acceptation, **avant** le contenu

15-25 profils de patients réels, écrits de mémoire de consultation, avec la **sortie attendue en langage
clinique** — pas en YAML, pas en conditions. Y compris les cas tordus : patient déjà traité qu'on
n'équilibre pas, sujet âgé en sur-traitement, contre-indication, refus, donnée manquante.

Ce document est **gelé** et devient le contrat : *le contenu est correct s'il produit ces sorties, pas
s'il représente fidèlement un dossier de preuve.* C'est le renversement du critère d'acceptation, et
c'est le point qui aurait le plus changé le DT2 — les vignettes y figuraient au plan (T-014) et sont
arrivées en dernier.

**Quatre règles d'écriture, apprises à la dure** *(commit `9deda1f`)* :

| règle | pourquoi |
|---|---|
| **La sortie attendue vient du référent, jamais du moteur** | figer le comportement actuel ne protège rien et **bloque les corrections** |
| **Les assertions portent sur un CONTENU** — option, badge, alerte — **jamais sur un compte** | une vignette qui vérifie « exactement une option » passe avec un moteur qui renvoie systématiquement la mauvaise |
| **Les rouges sont le livrable** | chaque `it.fails` nomme la décision référent, sa date, ce qui manque et le chantier qui le lèvera : les attentes validées mais non implémentées **deviennent la spécification du travail restant** |
| **Épingler les comportements corrects qui ressemblent à des oublis** | ex. l'absence d'alerte « > 75 ans » chez un patient avec ASCVD est **volontaire** ; la vignette le dit et interdit de la « réparer » |

**Porte de sortie P2** : les vignettes sont écrites, relues et **gelées** par le référent. Les rouges
attendus sont nommés.

---

### P3 — L'écran sur trois vignettes, avec du contenu volontairement faux

Une maquette rendue, contenu bidon, trois profils, réaction du référent. **Coût quasi nul.**

C'est là qu'on attrape gratuitement les défauts de **formulation**, invisibles dans un YAML et qui ont
tous coûté une vague en DT2 :

- « réduire la posologie de la metformine » affiché **à côté de** « metformine — **instaurer** ou
  poursuivre », chez un patient qui en prend déjà ;
- une alerte qui **interdit** ce que la carte prescrit (« ne pas INITIER une statine » au-dessus de
  « Statine de haute intensité ») ;
- deux options liées — « remplacer la gliptine » et « introduire un AR GLP-1 » — **séparées à l'écran**
  alors que l'une implique l'autre ;
- un jeton du DSL rendu brut au clinicien (`ne_contient_pas`).

**Porte de sortie P3** : le référent a vu trois écrans et validé le **registre de formulation** (ce que
l'outil dit, sur quel ton, dans quel ordre) — indépendamment du contenu clinique, encore faux.

---

### P4 — Collecte EBM, **pilotée par les vignettes**

**La méthode DT2 est conservée telle quelle** (`00-global.md`) : multi-agents, red-team des essais *et*
des recommandations, vérification en source primaire, passe OpenEvidence. Elle a tenu — zéro erreur de
données en recette, et 4 findings HAUTE trouvés sur des collectes pourtant issues de sources locales
page à page vérifiables.

**Une seule chose change** : le périmètre est déterminé par les **décisions que les vignettes exigent**,
pas par l'exhaustivité de la question. En DT2, des dossiers entiers n'ont alimenté que de la prose. Cela
allège aussi le budget, qui est une contrainte réelle du projet.

**Deux disciplines à reprendre telles quelles** *(`ETAT-DES-LIEUX.md`, « Discipline pour la suite »)* :

- **toute collecte de contenu clinique a sa passe adversariale** — la règle a payé ;
- **pas de nouvelle collecte** tant que les findings de la précédente ne sont pas intégrés.

**Porte de sortie P4** : chaque décision exigée par une vignette est adossée à une source vérifiée en
primaire, et la passe adversariale est close.

---

### P5 — Encodage

Écriture du YAML sous `GRAMMAIRE-NOEUD.md` (R1→R9) et sous les checklists du §2 ci-dessous.

**Deux principes de rédaction issus des corrections DT2 :**

- **Quand l'outil manque d'un fait pour décider, on ajoute le critère — on n'affaiblit pas la règle.**
  Face à « l'outil propose de réduire la metformine sans connaître la posologie », la réponse du
  référent a été *collecter la dose*, pas supprimer le geste : « metformine présente devrait demander
  de renseigner la dose ». Bénéfice direct de R7 : dose non renseignée ⇒ option **en attente**, « à
  renseigner : dose de metformine ». **L'outil demande, puis décide** (`906df83`).
- **Aucun contenu clinique inventé pour faire passer une règle.** Quand la situation « basale seule »
  s'est révélée dépourvue d'option d'efficacité, les deux options d'intensification de « basale +
  bolus » y ont été **réutilisées telles quelles** (`6561c53`). Les seuils viennent des alertes déjà
  sourcées du fichier (`906df83`) — jamais d'un arrondi commode.

**Porte de sortie P5** : Ajv vert, `tsc` propre, build vert.

---

### P6 — **Deux** vérifications, nommées distinctement

C'est l'étape que le DT2 n'a eue qu'à moitié, et c'est ce qui explique les 19 anomalies trouvées après
un « 0 finding HAUTE ».

| piste | question | instrument |
|---|---|---|
| **A — fidélité** | le YAML dit-il ce que dit le dossier de preuve ? | vérification bi-agents, étape 8 de `00-global.md` |
| **B — comportement** | le banc passe-t-il ? les invariants tiennent-ils ? les profils limites donnent-ils une sortie défendable ? | banc à trois couches (§3) |

**Un invariant signale des candidats, il ne dicte pas le correctif.** Sur les quatre alertes signalées
par I7, **aucune n'a été convertie** après analyse une à une : convertir la non-association
gliptine + GLP-1 en exclusion aurait recréé le bug R3/D19, l'option disparaissant alors qu'elle sert de
destination au switch. C'étaient des faux positifs de l'heuristique (`41ea008`). Un invariant rouge
ouvre une analyse ; il ne prescrit rien.

**Porte de sortie P6** : piste A close ; piste B verte **ou** ses rouges documentés comme dette nommée
(décision, date, chantier qui la lèvera).

---

### P7 — Recette référent sur le déployé

Inchangée. Mais elle ne devrait plus révéler que du **réglage clinique**. Si elle révèle encore des
défauts de modèle, c'est que P2 ou P3 ont été abrégés.

---

## 2. Checklists opposables

À passer avant de déclarer un nœud `valide`. Chaque ligne renvoie au cas réel qui l'a produite.

### 2.1 Critère d'entrée

- [ ] **`nature` déclarée** (`etat` / `intention` / `terrain` / `preference`) — R1 ; rend testable
      qu'aucun `etat` ne dérive d'une `intention`.
- [ ] **Bornes `min`/`max`** si `nombre` — P0 ci-dessus ; double motif saisie + banc.
- [ ] **`confirmation_requise`** si c'est un `bool`/`liste` dont le « non » ne peut pas être présumé
      sans risque — R7/D20.
- [ ] **Testé dans les deux sens.** Un critère qui ne sait qu'**interdire** est à moitié câblé :
      `antecedent_cv` bloquait la cible stricte sans qu'aucune option ne le teste en position
      positive — un patient de 68 ans, 15 ans de diabète et un antécédent CV recevait la cible la plus
      stricte (`47e3527`).
- [ ] **Il appartient au nœud qui peut en tirer une action.** « Le risque hypoglycémique est une
      propriété du **schéma thérapeutique**, pas du patient » : dans un nœud qui ne collecte pas les
      traitements, il produisait un relâchement de cible là où il fallait changer de traitement — donc
      retiré du nœud (`47e3527`).
- [ ] **Masqué (`visible_si`) quand il est sans objet.** On ne réclame pas une dose de basale actuelle
      à un patient déclaré naïf : huit `visible_si` ont dû être ajoutés après coup (`b101ae4`).
- [ ] **Une valeur suggérée n'est jamais citée comme un fait du patient** — statut `suggere` (D20). La
      suggestion automatique d'espérance de vie ressortait en « Proposé parce que : Espérance de
      vie = Limitée ».
- [ ] **Sur une `liste`, l'absence de coche n'est pas la valeur rassurante.** « Un profil nocturne NON
      COCHÉ n'est pas un profil STABLE » (`6561c53`).
- [ ] **Il change quelque chose à l'écran** (R5) — et on sait **quoi** : pilote-t-il la *décision*
      (option, rang, exclusion) ou seulement un *commentaire* (alerte, texte) ? `age` dans `statine`
      satisfaisait R5 en n'allumant qu'une alerte, pendant que 30 ans et 90 ans recevaient la carte
      identique.

### 2.2 Option

- [ ] **`delai_benefice`** si `niveau_preuve` `modere`/`eleve` sur critère dur — R2 ; jamais un vide
      silencieux.
- [ ] **`prerequis` « ne prend pas déjà cette classe »** — R9. « Envisager l'insuline » était proposée
      à un patient déjà sous insuline ; même lacune sur « insuline d'initiation », « initier une
      basale », « ajouter un bolus » (`41ea008`, `b101ae4`).
- [ ] **Les contre-indications sont des `exclusions`, jamais des `priorite`** — R8/D21 : rétrograder
      n'est pas retirer.
- [ ] **Verdict sur une ligne existante ≠ choix du remplaçant** — R3, deux options distinctes.
- [ ] **Clause de repli en prose** si aucune destination n'est applicable — R3 ; sinon le verdict
      produit une injonction sans issue.
- [ ] **Elle n'est pas déclenchée par la seule valeur du primer.** Sinon elle **préempte le repli** et
      le nœud ne peut plus conclure « rien à faire » : c'était le cas dans **trois situations sur
      quatre** de `insuline`, où un patient à l'objectif sous basal-bolus recevait quand même
      « optimiser la répartition » (`b101ae4`).
- [ ] **Aucun message de sécurité ne dépend d'elle seule.** Un fait logé dans les `contre_indications`
      d'une option **meurt avec l'option** : ajouter un prérequis a supprimé l'option qui portait le
      message d'urgence sur la cétonémie, laissant un patient cétonémique sans aucun signal — il a
      fallu créer une alerte de nœud dans la foulée (`41ea008`).

### 2.3 Alerte

- [ ] **Canal correct** (R8/D21) : contre-indication → `exclusions` · réserve sur un geste →
      `options[].alertes` · fait vrai quel que soit le geste → `alertes` de nœud.
- [ ] **Jamais `quand: "default"`** — elle s'afficherait pour tout le monde, donc pour personne.
- [ ] **Jamais un libellé prohibitif sans `exclusion` correspondante** — invariant I7.
- [ ] **Si elle parle d'un geste, c'est une alerte d'option.** Une alerte de nœud ne voit que les
      critères, jamais ce que le moteur a retenu : elle ne peut pas savoir qu'elle contredit la carte
      affichée juste en dessous.
- [ ] **Sa nuance est actionnable.** « Si une statine est déjà en place, sa poursuite est raisonnable »
      était juste et **inapplicable**, le nœud ne posant jamais la question (R9).

### 2.4 Nœud

- [ ] **Il peut conclure « rien à faire »** pour **chaque** valeur du primer — vérifié par couverture.
- [ ] **`population_cible` déclare ce qui est hors périmètre.** Tout concept nommé comme réserve dans
      la prose (« si déjà en place », « CARDS 40-75 ans », « en cas d'intolérance ») est **soit** un
      critère d'entrée, **soit** déclaré hors périmètre. Pas de troisième statut (R9).
- [ ] **Le mode de sélection est choisi en connaissance de cause.** En `multi-options`, une valeur par
      défaut erronée ajoute ou retire une carte parmi d'autres ; en **`ordered-first-match` elle
      désigne un tier unique et masque tout le reste** — sur `statine`, les trois valeurs par défaut
      convergeaient vers le même tier, de sorte que le formulaire vierge produisait une recommandation
      ferme, unique, entièrement fondée sur des champs non saisis.
- [ ] **Un concept clinique = un encodage** — invariant I4 ; cf. les deux définitions du risque
      hypoglycémique dans `insuline`.
- [ ] **Les limites connues sont écrites dans `incertitudes`**, pas laissées tacites (`6561c53` :
      trois limites documentées au moment même de la correction).

### 2.5 Module (D22)

- [ ] Préambule de terrain **partagé** — les critères communs ne sont pas redéclarés par nœud.
- [ ] **Primer d'orientation** vers le ou les nœuds pertinents.
- [ ] Charge de saisie mesurée : au-delà d'une douzaine d'items par nœud, arbitrer avant d'encoder.

---

## 3. Le banc, dès le premier nœud

Trois couches (détail et coût dans `GRAMMAIRE-NOEUD.md` § « Le banc d'un nœud »). Ce qui compte ici :

| couche | validation | quand l'écrire |
|---|---|---|
| **Vignettes** | clinique, une par vignette | **P2, avant le contenu** |
| **Couverture** | aucune — mécanique | à l'encodage |
| **Invariants** | clinique, une fois par invariant | à l'encodage |

**Deux couches sur trois ne coûtent aucune relecture clinique** — c'est le point décisif pour la
soutenabilité : valider la sortie exacte de 200 profils demande 200 relectures ; une *propriété* se
valide une fois et couvre tout l'espace.

**Invariants génériques à reprendre dans tout domaine** : I3 (aucune prononciation sur un critère
indéterminé) · I4 (un concept, un encodage) · I7 (alerte prohibitive ⇒ exclusion) · « jamais une option
affichée dont une exclusion est vraie » · « jamais de sortie vide lorsque tous les critères pertinents
sont renseignés » (I2′).

> **Un invariant trop large est pire qu'absent** — il force à encoder une règle fausse pour le faire
> passer. Quand un invariant échoue, la première question n'est pas « quel contenu corriger » mais
> « l'invariant dit-il vraiment ce que je voulais dire ». L'invariant n° 7 du DT2 a dû être resserré
> **deux fois**, pour le même motif : les garde-fous d'urgence sont orthogonaux à la position vs
> objectif.

**La caractérisation (*golden master*) n'est pas une vignette.** Elle fige le comportement pour rendre
les diffs relisibles ; elle ne dit rien de ce qui est *souhaitable*. À relire ligne à ligne avant
acceptation : le passage à R7 a changé 23 profils sur `insuline`, tous de la même cause légitime
(l'alerte de sur-basalisation ne se déclenche plus sur un poids inconnu, `dose / poids` valant
auparavant `Infinity`).

---

## 4. Les pièges, en un tableau

Table de relecture rapide. Chaque ligne est un défaut **constaté**, pas anticipé.

| piège | forme observée | parade |
|---|---|---|
| **Vide = 0** | formulaire vierge affirmant une insuffisance rénale *et* un objectif atteint | R7/D20 + bornes |
| **Alerte contre carte** | « ne pas INITIER » au-dessus de « statine haute intensité » | R8/D21 + I7 |
| **Geste déjà fait** | « initier une basale » à un patient sous basale | R9 + `prerequis` |
| **Deux encodages d'un concept** | risque hypoglycémique, avec et sans l'âge | catalogue + I4 |
| **Repli préempté** | option déclenchée par la seule situation ⇒ « rien à faire » impossible | couverture par valeur de primer |
| **Message de sécurité orphelin** | alerte cétonémie logée dans une option supprimée | alerte de nœud pour les faits indépendants du geste |
| **Critère à sens unique** | `antecedent_cv` sait interdire, pas ouvrir | couverture des deux sens |
| **Critère inerte déguisé** | `age` n'allume qu'une alerte, la carte ne bouge pas | distinguer décision / commentaire |
| **Heuristique devenue fait** | espérance de vie suggérée citée en justification | statut `suggere` |
| **Domaine de tirage corrompu** | banc testant un DFG à 2 000 | bornes **+** filtrage des littéraux |
| **Deux chemins d'affichage** | signature ≠ écran (5 occurrences) | tout passe par `construireVueDecision` |
| **Absence de coche = rassurant** | profil nocturne non coché lu « stable » | expliciter la valeur neutre |

---

## 5. Ce qui ne s'encode pas — et ce qu'on en fait

Toute limite n'est pas un bug. Trois formes de consignation, à utiliser plutôt que de forcer le modèle :

| forme | usage | exemple |
|---|---|---|
| **prose de l'option** | ce que le moteur ne peut pas exprimer sans introduire un ordre d'évaluation implicite entre options | clause de repli de R3 : « si aucun remplaçant n'est applicable, ne pas retirer à vide » |
| **`incertitudes`** | limite connue et assumée du contenu | « le déclencheur d'efficacité ne couvre que les deux signaux nommés par le référent » |
| **« consigné, non implémenté »** dans le message de commit + `ETAT-DES-LIEUX.md` | décision prise, réalisation différée | le pivot `gaj_a_cible`, consigné avant d'être livré deux commits plus tard |

Et une quatrième, à ne pas oublier : **« arbitrage pris par défaut, à confirmer »**. Quand une
correction laisse une branche orpheline et qu'on tranche faute de mieux, on l'écrit — le retrait du
risque hypoglycémique a laissé orpheline une branche du cran ≤ 8 %, retirée plutôt que promue, motif
donné et marqué à confirmer (`47e3527`).

---

## 6. Discipline de session

Reprise de `ETAT-DES-LIEUX.md` du chantier 2026-07-26, applicable telle quelle à tout module :

1. **Un seul document d'état** par chantier. Toute décision s'y consigne, puis migre vers
   `DECISIONS.md` (transverse) ou `docs/decision/noeuds/` (clinique). *L'état ne vit pas dans les
   échanges.*
2. **Pas de nouvelle collecte** tant que les findings de la précédente ne sont pas intégrés.
3. **Toute collecte de contenu clinique a sa passe adversariale.**
4. **Les corrections systémiques passent avant le contenu** : un module encodé sur un moteur non
   corrigé est de la dette.
5. **Une décision node-specific se consigne dans `docs/decision/noeuds/<nœud>.md`**, jamais seulement
   dans le document de chantier — sinon elle disparaît à la clôture.

---

## 7. Ce que ce document coûte, et pourquoi il faut le payer

P0 à P3 ne produisent **aucun contenu clinique**. C'est visible, c'est frustrant, et il est tentant de
les abréger « parce qu'on sait déjà faire ».

C'est exactement l'abréviation qui a produit les vagues de correction du premier domaine.
