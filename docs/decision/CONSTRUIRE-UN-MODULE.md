# Construire un module de décision — spécification de construction, **tous domaines**

> **Statut** : proposition issue du bilan du premier domaine (DT2), écrite le 2026-07-26. **Non
> arbitrée** — les étapes et les portes de sortie sont à valider par le référent avant d'engager le
> deuxième domaine. **Complétée le 2026-08-04** (revue de conception
> `validation/revue-conception-fable-2026-08-04.md`) : items de checklist 2.1/2.4/2.5, nouvelles lignes
> de la table des pièges (§4), invariants de rendu en porte P6 — même statut de proposition.
>
> **Amendé le 2026-08-06/07** (plan P14, `validation/table-conditions-2026-08-06.md` et
> `criteres-communs-2026-08-06.md`) : **P1** ouvre le vocabulaire de sécurité du **domaine** ; **P5**
> gagne le *brouillon* de la table des conditions ; **P6** gagne sa *régénération mécanique* et le
> **diff** contre ce brouillon, plus un quatrième point de portée domaine. Ces trois inscriptions
> répondent à la lacune la plus profonde que P14 met au jour — le procédé ci-dessous était entièrement
> **par nœud**.
>
> **Portée** : ce document ne parle d'**aucun domaine clinique**. Il dit **dans quel ordre** construire
> un module et **à quelles conditions** passer à l'étape suivante. Il ne dit pas comment écrire un
> nœud — c'est `GRAMMAIRE-NOEUD.md` (règles R1→R15), consulté *pendant* l'écriture. Ce document-ci se
> suit *avant et autour*.

| document | répond à | consulté |
|---|---|---|
| `PROJECT_BRIEF.md` · `BRIEF_DECISION.md` | quoi, pour qui | au cadrage |
| **`CONSTRUIRE-UN-MODULE.md`** *(ce fichier)* | **dans quel ordre, avec quelles portes** | **du début à la fin** |
| `GRAMMAIRE-NOEUD.md` | comment écrire un nœud correct (R1→R15) | à l'écriture et à la relecture |
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

**Une troisième sortie, ajoutée le 2026-08-06 (P14, `GRAMMAIRE-NOEUD.md` R15, `DECISIONS.md` D54) —
ouvrir le vocabulaire de sécurité du domaine.**

Créer `content/decision/criteres-communs/<domaine>.yaml` **avant le premier nœud**, même quasi vide, et
poser la règle avec lui : **tout fait qui peut contre-indiquer, retirer ou alerter s'y écrit, avec son
`concerne` (les classes ou gestes qu'il rend pertinents) — jamais dans un nœud.** Les nœuds le
référencent (`{ ref: <nom> }`) et n'en surchargent que la mise en scène.

**Pourquoi ici, et pas ailleurs.** C'est la **seule étape d'où l'on regarde le domaine** et non une
question. Toutes les autres — vignettes, écran, collecte, encodage, vérification, recette — sont par
nœud, du premier mot au dernier. C'est la lacune que P14 met au jour, et elle explique un résultat qui
serait autrement inexplicable : le premier domaine a fini avec **41 faits de sécurité, dont 36
mono-nœud**, quatre d'entre eux fautifs, **sans qu'aucune étape du procédé n'ait été sautée**. Un fait de
sécurité ne se découvre pas au moment où l'on rédige le nœud qui le porte — mais il **concerne** souvent
des nœuds déjà écrits, et rien ne les rouvrait.

**Ce n'est pas un travail préalable, c'est un CLIQUET — et c'est ce qui le rend praticable.** Personne ne
peut dresser à l'avance la liste exhaustive des faits de sécurité d'un domaine : on les découvre en
écrivant. Le fichier s'ouvre donc vide ou presque, et il **grossit tout seul**, chaque fait rencontré
allant s'y écrire au lieu d'aller dans le nœud. Le champ `concerne` fait le reste : ajouter un fait rend
immédiatement **rouge** tout nœud déjà écrit qui prescrit une classe concernée et qui ne le déclare pas
(invariant I33, P14/S16 — cf. porte de sortie P6). **Le domaine se ré-interroge de lui-même à chaque
ajout**, sans que personne ait à penser à relire ce qui précède. C'est ce qui distingue cette sortie
d'une checklist : une checklist se relit quand on y pense, un cliquet mord tout seul.

Premier domaine à l'avoir : `content/decision/criteres-communs/diabete-type-2.yaml` (DT2, ouvert
rétroactivement en P14/S15 — pour un nouveau domaine, il s'ouvre ici, avant la première vignette).

**Porte de sortie P1** : le référent a écrit les intentions et l'inventaire de l'existant, les trois
questions sont tranchées par écrit, **et le fichier de critères communs du domaine existe** (même vide),
avec la règle de cliquet écrite en tête.

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

> **Skill `recherche-preuve-triangulee`** (`.claude/skills/`) encode le circuit multi-agents décrit
> ci-dessous. L'invoquer plutôt que de le redériver.

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

**Une collecte qui trouve un défaut chez nous est aussi suspecte qu'une collecte qui n'en trouve aucun.**
Le 2026-07-27, quatre collectes ont été red-teamées le même jour. **Trois des quatre sur-accusaient le
contenu existant** — et le red-team a rétabli le nœud à chaque fois :

| Ce que la collecte affirmait | Ce que le red-team a établi |
|---|---|
| « Notre incertitude TCA est fausse au sens littéral » | Elle était **exacte** : elle portait sur le corpus local, qui ne contient effectivement aucun des deux documents invoqués. Le défaut n'était pas la fausseté mais l'étroitesse. |
| « La reco française écrit sur un médicament qu'elle croit indisponible ; c'est dépassé, il est remboursé depuis février 2025 » | Le remboursement date du **12 décembre 2025**, soit après la clôture bibliographique de la reco. **La reco avait raison, la collecte se trompait de dix mois.** |
| « Le seuil de sur-basalisation majore l'hypoglycémie : affirmation démontrablement fausse » | Lecture sélective : la source porte une analyse intra-patient qui va dans l'autre sens. La phrase du nœud devait être **gardée**. |

Le mécanisme est structurel, pas accidentel : un agent de collecte est missionné pour *trouver* quelque
chose, et le contenu existant est la cible la plus commode. D'où la règle : **aucune correction issue
d'une collecte n'entre dans `content/**` avant sa passe adversariale**, y compris — surtout — quand elle
prend la forme flatteuse d'« un défaut trouvé chez vous ». Et quand une collecte accuse le nœud, la passe
adversariale doit recevoir cette accusation comme sa cible prioritaire.

**Corollaire pour le compte rendu au référent** : ce qui lui est rapporté entre les deux passes est
provisoire, et doit être présenté comme tel. Trois affirmations relayées ce jour-là ont dû être reprises
devant lui. Mieux vaut annoncer « la collecte affirme X, le red-team n'a pas encore rendu » que d'avoir à
se corriger.

#### Un QUATRIÈME cas, le soir du même jour — et il donne la règle mécanique qui manquait

La passe adversariale `prescription` affirmait : **« 432 profils sur 2 160 perdent TOUTE option *Agent à
ajouter* »** à cause d'une exclusion sur `fragilite`. Le chiffre allait être porté au référent pour qu'il
rouvre un arbitrage rendu le matin même. Mesuré avant de le faire
(`docs/decision/validation/chantier-2026-07-27/mesure-surblocage-fragilite.md`) :

- comparaison **appariée** (`genererPairesBooleennes`, le même patient fragile et non fragile, dérivés
  recalculés) : **9 patients sur 1 840**, pas 432 — et **0** se retrouve sans aucune option ;
- **une seule option est jamais perdue**, le sulfamide — celle que la source vise nommément ;
- **certain par LECTURE, pas par tirage** : `fragilite == true` n'apparaît que dans **une** `exclusions`
  de tout le nœud, ses cinq autres occurrences étant des dérivés, des rangs et une alerte, qui ne
  retirent rien (D21).

Le chiffre de 432 comptait les familles **vides**, sans contrôler la cause : la quasi-totalité l'est pour
des raisons étrangères à la fragilité. Compter l'**état** au lieu de mesurer l'**effet** gonflait le
constat d'un facteur ~40.

> **RÈGLE.** Toute affirmation de la forme « N profils perdent X » doit être produite par une
> **comparaison appariée**, jamais par un comptage d'état. Le dépôt fournit l'instrument
> (`engine/banc/profils.ts` `genererPairesBooleennes`, écrit exactement pour ça). Ne pas l'employer
> **invalide** le constat — ne l'affaiblit pas : le rend inutilisable.

Le motif est le même dans les quatre cas, et il vaut d'être nommé : **un agent mesure ce qu'il peut
mesurer facilement, pas ce que la question demande.** Un comptage brut est à portée de main ; un
contrefactuel demande de savoir que l'outil existe et pourquoi il existe.

**Porte de sortie P4** : chaque décision exigée par une vignette est adossée à une source vérifiée en
primaire, et la passe adversariale est close.

---

### P5 — Encodage

Écriture du YAML sous `GRAMMAIRE-NOEUD.md` (R1→R15) et sous les checklists du §2 ci-dessous.

**Trois principes de rédaction issus des corrections DT2. Le premier s'applique AVANT qu'aucune ligne de
YAML n'existe :**

- **Le brouillon de la table des conditions, premier geste de P5** *(ajouté le 2026-08-06, P14 —
  `GRAMMAIRE-NOEUD.md` R13)*. Avant d'écrire la première ligne de YAML, dresser dans le **dossier de
  preuve du nœud** (`docs/decision/noeuds/<fichier-du-nœud>.md`, nouvelle section) une table à **une
  ligne par option envisagée**, colonnes : `role` · `famille` (et son `exclusive`) · rang · `conditions`
  · `prerequis` · `exclusions`. Elle se rédige à partir des vignettes gelées (P2) et de la collecte (P4).

  **Pourquoi P5, et pas P2 — la question se pose, elle a été tranchée.** P2 interdit explicitement le
  DSL : « sortie attendue **en langage clinique — pas en YAML, pas en conditions** », règle apprise à la
  dure (commit `9deda1f`), et il n'est pas question de la desserrer. **P5 est la première étape où
  écrire une expression `conditions` est légitime.** Ce brouillon n'est donc pas une anticipation de P2 :
  c'est le tout premier geste de P5, avant le YAML proprement dit.

  **Ce qu'il attrape, et que rien d'autre n'attrape aussi tôt.** Écrire deux options **sur deux lignes
  d'un même tableau, leurs `conditions` côte à côte**, rend un recouvrement visible d'un coup d'œil —
  bien avant qu'il ne devienne 400 lignes de YAML réparties sur trois écrans. Cas réel : les trois voies
  d'escalade d'un même nœud, rédigées côte à côte, auraient forcé la question « *ces trois lignes
  s'excluent-elles, ou se cumulent-elles ?* ». C'est la question qui n'a jamais été posée — et le nœud a
  vécu des semaines avec une famille dont l'exclusivité n'avait jamais été tranchée. Même chose pour un
  signal mal partitionné (R13) : un déclencheur étranger greffé sur une carte saute aux yeux quand la
  colonne `conditions` de ses voisines est juste au-dessus.

- **Quand l'outil manque d'un fait pour décider, on ajoute le critère — on n'affaiblit pas la règle.**
  Face à « l'outil propose de réduire la metformine sans connaître la posologie », la réponse du
  référent a été *collecter la dose*, pas supprimer le geste : « metformine présente devrait demander
  de renseigner la dose ». Bénéfice direct de R7 : dose non renseignée ⇒ option **en attente**, « à
  renseigner : dose de metformine ». **L'outil demande, puis décide** (`906df83`).
- **Aucun contenu clinique inventé pour faire passer une règle.** Quand la situation « basale seule »
  s'est révélée dépourvue d'option d'efficacité, les deux options d'intensification de « basale +
  bolus » y ont été **réutilisées telles quelles** (`6561c53`). Les seuils viennent des alertes déjà
  sourcées du fichier (`906df83`) — jamais d'un arrondi commode.

**Porte de sortie P5** : Ajv vert, `tsc` propre, build vert — **et**, ajouté le 2026-07-28
(`DECISIONS.md` D30) : aucun critère ne porte `presomption_non: true` sans un motif écrit dans le
fichier de contenu, et aucun critère participant à une condition, une `exclusions` ou un `prerequis`
d'une option `role: securite` (D25) n'en porte, **jamais**. La liste des critères éligibles s'établit
mécaniquement (parcours des expressions du nœud), pas à la main — cf. `GRAMMAIRE-NOEUD.md` R7.

**— et**, ajouté le 2026-08-06 (P14) : **le brouillon de la table des conditions existe, et il date
d'avant le premier commit du YAML du nœud.** Vérifiable, et à vérifier :
`git log --diff-filter=A -- docs/decision/noeuds/<fichier>.md content/decision/noeuds/<domaine>/<nœud>.yaml`.
Ce n'est pas une formalité de datation : un brouillon rédigé *après* le YAML n'est plus un brouillon,
c'est une transcription — il dira exactement ce que dit le YAML, y compris ses erreurs, et le **diff** de
P6 comparera le fichier à lui-même. La valeur de l'artefact est **entièrement** dans son antériorité.

---

### P6 — **Deux** vérifications, nommées distinctement

C'est l'étape que le DT2 n'a eue qu'à moitié, et c'est ce qui explique les 19 anomalies trouvées après
un « 0 finding HAUTE ».

> **Le constat qui justifie les portes ajoutées en 2026-08-06 : la donnée était là, l'AGRÉGATION
> manquait.** Les faits qui ont fondé les neuf défauts de P14 étaient **déjà figés** dans le dépôt, dans
> `__snapshots__/caracterisation.prescription.txt` et `caracterisation.insuline.txt` — 924 Ko et 620 Ko
> au 2026-08-06 (1,0 Mo et 0,7 Mo aujourd'hui : ils grossissent). Tout y était : les profils affichant
> deux cartes de même intitulé, ceux affichant deux conduites opposées sur le même geste. **Un fichier
> de 900 Ko ne se relit pas.** Une fois agrégée dans un fichier de quelques dizaines de lignes, la même
> information a rendu le défaut immédiat : **39 profils sur 180** affichant un intitulé en double sur
> `prescription` (33 « Sulfamide », 6 « Glinide ») et **2 profils** affichant deux conduites opposées sur
> la basale, dans `insuline`.
>
> *(Ces chiffres sont ceux que la mesure a rendus, par deux chemins de code indépendants. L'estimation à
> main levée qui avait lancé le chantier parlait de « 9 profils » et « 1 profil » : même ordre de
> grandeur, même diagnostic, comptes imprécis. Cf. `engine/banc/paires.test.ts`, docstring de tête —
> et cf. §6.7 : un agent mesure, il n'estime pas.)*
>
> **Deux conséquences pour cette porte, et elles ne sont pas symétriques.** *Primo*, un artefact de
> vérification qu'aucun humain ne peut lire ne vérifie rien : produire l'agrégat fait partie du travail,
> il ne se déduit pas d'un instantané. *Secundo*, une régénération que seul un humain sait produire **à
> la main** ne se refera pas systématiquement — la table du 2026-08-06 a été extraite par cinq agents
> lisant chacun un YAML, ce qui a fonctionné **une fois**, pour un diagnostic ponctuel. Une porte de
> sortie qu'aucun humain ne peut faire tourner à chaque clôture ne vérifie rien non plus. C'est pourquoi
> la porte ci-dessous s'appuie sur un **outil committé**, pas sur une procédure de rédaction.

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
(décision, date, chantier qui la lèvera) — **et**, ajouté le 2026-07-28 (`DECISIONS.md` D30, D32 ;
`GRAMMAIRE-NOEUD.md` R10) : **I21, I22 et I23 verts**
(`engine/banc/vierge.test.ts`, `engine/banc/securite-atteignable.test.ts`). Un nœud ne se déclare pas
vérifié sans eux — ce sont, à eux seuls, les trois invariants qui auraient attrapé les défauts les plus
graves de la recette navigateur du 2026-07-28 (formulaire vierge qui recommande, option de sécurité
inatteignable, écran muet).

**Troisième porte, ajoutée le 2026-08-06 (P14) — régénérer la table des conditions, et la DIFFÉRER
contre le brouillon de P5.**

```bash
npx vitest run src/features/decision/engine/banc/tableConditions.test.ts
# → src/features/decision/engine/banc/__snapshots__/table-conditions.<nœud>.txt, un par nœud publié
```

L'outil est générique (il itère sur les nœuds publiés, aucun id en dur) et reproduit à l'identique la
convention d'abréviation posée en 2026-08-06 — bloc nommé au-delà de 100 caractères, bloc nommé pour une
expression de 40 à 100 caractères répétée dans au moins 3 options du même nœud. Il **lit** le contenu :
aucun patient n'est construit, `evaluateNode` n'est jamais appelé, un rang conditionnel (D14) est rendu
tel qu'écrit. La sortie est du Markdown, aux mêmes colonnes que le brouillon de P5 — elle se colle telle
quelle à côté de lui.

**Ce n'est pas une relecture, c'est un DIFF**, et c'est là toute la différence. Relire un bloc de
conditions, on l'a fait des dizaines de fois sans rien voir. Comparer ce qui était **prévu** à ce qui a
été **écrit** est un autre geste : chaque écart — un `role` changé, une famille reclassée, une condition
apparue ou disparue en cours d'encodage — doit être **justifié** avant de clore le nœud. Deux issues, et
une seule est bonne selon le cas :

- le brouillon **sous-estimait un cas réel** découvert en écrivant → rouvrir **P2**, mettre à jour la
  vignette, puis le brouillon. La découverte est légitime ; ce qui ne l'est pas, c'est qu'elle ne
  remonte pas jusqu'au contrat d'acceptation ;
- l'encodage a **dérivé du plan sans raison** → corriger le YAML.

**Toute divergence non expliquée bloque la clôture.** C'est ce diff, et non la lecture, qui a le plus de
chances de trouver les défauts relationnels — ceux qui ne sautent aux yeux que quand on met le prévu et
l'écrit côte à côte.

`docs/decision/validation/table-conditions-2026-08-06.md` reste cité, mais comme **exemple de sortie**
(le diagnostic DT2, historique, extrait à la main une fois) — **plus comme modèle de forme à imiter à la
main**. La forme fait désormais foi par l'outil.

**Quatrième point, de portée DOMAINE — ajouté le 2026-08-06 (P14, R15/D54).** Relire le fichier commun du
domaine (`content/decision/criteres-communs/<domaine>.yaml`) et son invariant, avec **une** question :
*le nœud qu'on clôt a-t-il introduit un fait de sécurité qui concerne un nœud **déjà écrit** ?* Si oui, le
fait s'écrit dans le fichier commun avec son `concerne`, et les nœuds concernés le déclarent (`{ ref }`)
ou le rangent dans `criteres_hors_perimetre` avec un motif clinique.

```bash
npx vitest run src/features/decision/engine/banc/invariants-contenu.test.ts -t "I33"
```

C'est le seul point de tout le procédé qui regarde en arrière. Il est mécanisé (I33, P14/S16) précisément
parce qu'un point de vigilance qui repose sur la mémoire de l'auteur ne tient pas trois nœuds : personne
ne se souvient, en clôturant le sixième nœud, que le deuxième prescrivait une classe que le fait du jour
concerne. `docs/decision/validation/criteres-communs-2026-08-06.md` est l'**exemple de sortie** de ce
point : la matrice fait × nœud du domaine, avec ses verdicts.

**Ajout du 2026-08-04 — les invariants de RENDU font partie de la piste B.** Quatre défauts de la revue
de conception (expression brute, « : non », littéral dupliqué, méta-texte de fabrication) sont des
propriétés du **texte rendu**, transversales à tous les nœuds, et chacun avait déjà été corrigé *sur un
nœud* sans être recherché sur les autres. Ils se testent par grep sur la sortie du modèle de vue —
liste exacte dans `GRAMMAIRE-NOEUD.md` R6, volet rendu. Un correctif de rendu validé sur le nœud où le
défaut a été constaté n'est **pas** clos tant que son invariant transversal n'est pas vert partout :
c'est la parade mécanique à la famille « correctif non propagé au nœud voisin ».

---

### P7 — Recette référent sur le déployé

Inchangée. Mais elle ne devrait plus révéler que du **réglage clinique**. Si elle révèle encore des
défauts de modèle, c'est que P2 ou P3 ont été abrégés.

**Passage obligé ajouté le 2026-07-28 : la recette navigateur.** Avant qu'un nœud repasse `valide`, une
passe navigateur (protocole `docs/decision/validation/PROMPT-recette-navigateur.md`) est **obligatoire**,
en plus de la recette référent sur maquette. Le fait qui la porte : les passes navigateur des 25 et 28
juillet 2026 ont, à elles seules, trouvé plus de défauts graves que cinq rapports d'audit et 769 tests
unitaires cumulés — une classe de défaut entière (l'écran qui affirme sur une donnée absente, qui se tait,
ou dont une carte contredit l'alerte qu'elle contient) n'était atteignable par **aucun** des deux
instruments existants, qui n'interrogent jamais la page telle qu'un praticien la lit réellement.

**Deux gestes à ajouter au protocole de recette navigateur** (revue du 2026-08-04 — les deux plus gros
constats hors audit y ont été trouvés ainsi) :

- **jouer les allers-retours, pas seulement les parcours** : changer l'intention ou la situation *sur un
  formulaire rempli*, revenir, et relire l'état complet (c'est ce qui a exposé la perte de saisies R12
  et l'impasse R11 — invisibles sur tout parcours linéaire, donc invisibles pour un banc de vignettes
  qui saisit toujours dans l'ordre) ;
- **relire les résumés de sections repliées après chaque geste global** (« Rien à signaler ») : c'est le
  seul contrôle dont dispose le praticien sur ce qu'il a déclaré, et le seul endroit où la portée
  instantanée du geste se voit.

**Porte de sortie P7** : recette référent **et** recette navigateur closes, sans défaut grave ouvert.

---

## 2. Checklists opposables

À passer avant de déclarer un nœud `valide`. Chaque ligne renvoie au cas réel qui l'a produite.

### 2.1 Critère d'entrée

- [ ] **`nature` déclarée** (`etat` / `intention` / `terrain` / `preference`) — R1 ; rend testable
      qu'aucun `etat` ne dérive d'une `intention`.
- [ ] **Bornes `min`/`max`** si `nombre` — P0 ci-dessus ; double motif saisie + banc.
- [ ] **`presomption_non`** posé UNIQUEMENT si ce `bool`/`liste` peut être présumé « non » sans risque
      quand il n'est pas renseigné — établi mécaniquement (aucune condition `role: securite`,
      `exclusions` ni `prerequis` ne le lit) ; jamais sur un critère de sécurité — R7/D30.
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
- [ ] **Coût de recueil déclaré**, ajouté le 2026-07-28 (recette navigateur, axe A-3). Pour ce critère,
      le praticien cible l'a-t-il *sous les yeux* (dossier ouvert, biologie récente), doit-il *aller le
      chercher* (rappeler le labo, un autre logiciel, repeser), ou ne l'a-t-il *pas du tout* (suppose un
      équipement absent, ex. un capteur) ? Un critère de la troisième catégorie exige une **voie
      alternative déclarée** dans le nœud — pas seulement un message qui explique comment faire sans,
      ajouté après coup. Cas réel : sur `insuline`, 5 champs sur 20 sont impossibles à remplir sans
      capteur de glucose (TBR, TBR sévère, coefficient de variation, profil AGP, faute de mesure
      continue) — le message qui explique comment s'en passer existe (« Sans MCG : titrer la basale sur
      la glycémie à jeun ») mais est rendu **sous** la ligne qui les réclame : un praticien sans capteur
      découvre l'impasse avant l'explication, pas après.
- [ ] **S'il est masqué (`visible_si`) sous une valeur du primer, il n'est pas décisif sous cette
      valeur — ou il est dérivé de cette valeur** (R11, 2026-08-04). Le cas N25 : *Initier* masque la
      section TRAITEMENT, le moteur continue de réclamer « Traitements en cours », et l'option de
      sécurité qui en dépend (insuline d'initiation) devient inatteignable. La forme correcte est une
      dérivation déclarée (*Initier* ⇒ traitements = ∅, statut `suggere`), pas un trou.
- [ ] **Partagé en session (`partage`) s'il est objectif et stable en cours de consultation** — jamais
      s'il est un jugement. Constaté le 2026-08-04 : le **poids** n'était pas partagé entre
      `prescription` et `insuline` alors qu'il venait d'être saisi et qu'il pilote les doses calculées
      du second nœud. À l'écriture d'un nœud, passer la liste des critères contre le catalogue et
      déclarer le partage explicitement, dans les deux sens (ce que je fournis, ce que je réutilise).

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
- [ ] **Son intitulé ne nomme qu'UNE classe ou molécule.** Une option qui en nomme deux (« réduire le
      sulfamide **/ le glinide** ») est un piège différé : le premier garde-fou qu'on lui pose vaut pour
      les deux, y compris si leur profil de sécurité est opposé. C'est arrivé exactement ainsi — une
      exclusion `DFG < 30` justifiée pour le sulfamide (contre-indication RCP) a retiré au répaglinide,
      d'élimination hépatobiliaire et sans contre-indication rénale, le geste que son propre RCP
      recommande. Le regroupement paraissait économique à l'écriture ; il a coûté un défaut de sécurité.
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
      `options[].alertes` · fait vrai quel que soit le geste **mais pas pour tous les patients** →
      `alertes` de nœud · fait vrai **pour tous les patients du nœud** → `cadrage` (D24).
- [ ] **Jamais `quand: "default"`** — elle s'afficherait pour tout le monde, donc pour personne. Si
      l'énoncé ne peut être conditionné par aucun critère, ce n'est pas une alerte mal écrite : c'est un
      **cadrage** (D24), et il change de champ, pas de formulation.
- [ ] **Jamais un libellé prohibitif sans garde-fou correspondant** — invariant I7, `exclusions` **ou**
      `prerequis`. Deux exceptions qui n'en sont pas : une injonction à **arrêter** un traitement en
      cours (R3 : c'est une option, jamais une exclusion) et une prohibition portant sur un geste d'un
      **autre nœud** (celui-ci ne l'offre pas, il ne peut pas l'exclure).
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
      hypoglycémique dans `insuline`. Le même défaut existe **entre nœuds** et se voit à la session :
      la Fragilité répondue sur `cible-glycemique` n'arrive pas sur `prescription` alors qu'elle
      circule entre les deux nœuds RHD (2026-08-04) — deux encodages du même fait cassent le partage
      sans qu'aucun écran ne le dise.
- [ ] **La bascule du primer conserve les saisies** (R12, 2026-08-04) : pour toute saisie et toute
      bascule A→B→A, l'état final égale l'état initial — et la persistance est **uniforme** entre
      sections (sur `insuline`, la bascule perdait la surveillance mais gardait le profil nocturne :
      l'état restauré déclarait un profil AGP sans capteur).
- [ ] **Si le primer et un critère encodent le même fait, ils sont synchronisés ou surveillés.**
      Constaté : `Situation = Basale seule` coexistait, sur le même écran, avec « Insuline basale »
      non cochée dans les traitements — aucune dérivation, aucune alerte d'incohérence. Déclarer la
      dérivation (dans les deux sens, statut `suggere`) ou, à défaut, une alerte de cohérence.
- [ ] **Les limites connues sont écrites dans `incertitudes`**, pas laissées tacites (`6561c53` :
      trois limites documentées au moment même de la correction).
- [ ] **La table des conditions régénérée a été diffée contre le brouillon de P5, et toute divergence
      est justifiée par écrit** (P5/P6, 2026-08-06). Régénération :
      `npx vitest run …/banc/tableConditions.test.ts`. Un rôle changé, une famille reclassée, une
      condition apparue ou disparue en cours d'encodage se justifie — soit en rouvrant P2 (le brouillon
      sous-estimait un cas réel), soit en corrigeant le YAML (l'encodage a dérivé). Le brouillon doit
      dater d'**avant** le premier commit du YAML : sans antériorité, le diff compare le fichier à
      lui-même.
- [ ] **Les faits de sécurité introduits par ce nœud sont montés au DOMAINE, et les nœuds déjà écrits
      qu'ils concernent ont été rouverts** (R15/D54, 2026-08-06). Tout fait qui contre-indique, retire ou
      alerte vit dans `content/decision/criteres-communs/<domaine>.yaml` avec son `concerne` — jamais
      dans le nœud seul. Chaque nœud qui prescrit une classe concernée le déclare (`{ ref }`) **ou** le
      range dans `criteres_hors_perimetre` avec un motif clinique ; il n'y a pas de troisième statut.
      Mécanisé par I33 (`…/banc/invariants-contenu.test.ts`) — c'est le seul contrôle du procédé qui
      regarde les nœuds **déjà clos**, et c'est ce qui l'a rendu nécessaire : l'absence silencieuse ne se
      voit jamais à la relecture, puisque rien ne manque nulle part.

### 2.5 Module (D22)

- [ ] **Cadrage partagé** — les énoncés communs sont posés une fois sur le module, pas recopiés dans le
      `population_cible` de chaque nœud (I4). C'est la duplication qui a justifié le mécanisme.
- [ ] **Primer d'orientation** vers le ou les nœuds pertinents, et **l'écran le dit explicitement :
      il oriente, il ne verrouille pas.** Deux gros boutons de choix se lisent spontanément comme un
      aiguillage exclusif — sans une phrase qui l'infirme, le praticien croit devoir choisir et n'ouvre
      jamais le second axe.
- [ ] **Chaque orientation porte des indices situationnels, pas des catégories.** Le pattern vérifié
      sur l'écran RHD (2026-08-04) : sous chaque axe, deux ou trois phrases de reconnaissance
      (« *Le patient décrit spontanément ce qu'il mange* », « *Une expérience passée négative bloque
      la reprise* ») — le praticien reconnaît sa consultation au lieu d'interpréter un intitulé. C'est
      aussi la réponse au point d'entrée manqué de N25 (« Insulinothérapie » ne désigne pas « quoi
      faire d'une cétonurie ») : les indices disent les situations, le titre dit le sujet.
- [ ] **Aucune saisie sur l'écran de module** — garde-fou R1 : un module est un *flux d'écran*, jamais un
      chaînage. Aucune valeur ne circule vers un nœud, chaque nœud reste évaluable seul. À tenir par un
      test (« l'écran de module ne contient aucun `input`/`select`/`textarea` »), sinon l'érosion est
      certaine : le premier critère « qu'on saisirait bien une fois pour les deux » fait basculer le
      module en prérequis.
- [ ] **Tout nœud du module est atteignable depuis le primer.** L'écran de module *retire* ses nœuds de
      la liste du domaine : un nœud oublié dans les orientations devient inaccessible. C'est la pire
      régression que ce mécanisme puisse produire, et elle est silencieuse — un test dédié, pas une
      relecture.
- [ ] **Un module regroupe au moins deux nœuds.** À un seul, il n'ajoute qu'un écran d'interstice et un
      clic, sans rien mutualiser.
- [ ] Charge de saisie mesurée : au-delà d'une douzaine d'items par nœud, arbitrer avant d'encoder.

> **Un champ de contenu que personne ne lit ne se signale jamais.** `module: RHD` a vécu dans le schéma
> *et* dans les deux nœuds sans qu'aucune ligne de code ne le consomme — ni l'écran, ni les tests, ni
> même le type TS `Noeud`, où il manquait purement et simplement. Tout était vert : le YAML validait, la
> suite passait. Un champ ajouté au schéma doit être, dans le même lot, **soit consommé, soit déclaré
> inerte par un test qui le dit** — faute de quoi on ne découvre son inexistence qu'en voulant s'en
> servir, des semaines plus tard.

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

**Trois questions devant un invariant rouge, dans cet ordre** — la troisième a été découverte tard :

1. le **contenu** a-t-il tort ?
2. l'invariant est-il **trop large** (faux positif) ?
3. l'invariant demande-t-il **l'inverse de ce que la grammaire impose** ? C'est une *erreur de
   catégorie*, et elle ne se corrige pas en resserrant un seuil. I7 exigeait une `exclusion` pour toute
   alerte au libellé prohibitif ; or son radical `arrêt` attrapait des **injonctions à agir**
   (« arrêter le sulfamide »), alors que R3 exige précisément que l'arrêt d'un traitement soit une
   **option** et jamais une exclusion. Six « violations » sur six étaient de cette forme : le test
   réclamait au contenu le contraire de la règle. Retirer le radical n'a rien affaibli — les deux cas
   qui avaient motivé l'invariant restent détectés.

> **Une dette qu'aucune réécriture ne peut lever signale un canal manquant dans le modèle.** Deux
> alertes en `quand: "default"` ont résisté à toutes les tentatives de correction, pour une raison qui
> n'apparaît qu'après coup : elles ne portaient pas sur le patient mais sur **l'état des preuves du
> nœud** — rien ne pouvait les rendre conditionnelles. Tant que `alertes` était le seul canal, la dette
> était insoluble *par construction*. La sortie n'a pas été de réécrire les textes (ils sont partis
> inchangés) mais d'ajouter le canal qui manquait (`cadrage`, D24). **Quand une règle juste ne peut être
> satisfaite par aucune formulation, ce n'est pas le contenu qu'il faut plier.**

**Une exception de dette se nomme au plus fin.** Dispenser un *nœud entier* d'un invariant rend invisible
toute **nouvelle** violation sur ce nœud : la dette ne protège plus un cas diagnostiqué, elle aveugle un
fichier. Les exemptions se portent sur l'objet exact (ici : l'alerte, identifiée par son `quand` — la
partie stable, qu'une reformulation éditoriale ne fera pas expirer en silence), accompagnées de leur
motif. Une liste de dette qui ne rétrécit jamais devient du papier peint.

**La caractérisation (*golden master*) n'est pas une vignette.** Elle fige le comportement pour rendre
les diffs relisibles ; elle ne dit rien de ce qui est *souhaitable*. À relire ligne à ligne avant
acceptation : le passage à R7 a changé 23 profils sur `insuline`, tous de la même cause légitime
(l'alerte de sur-basalisation ne se déclenche plus sur un poids inconnu, `dose / poids` valant
auparavant `Infinity`).

**Deux conditions pour qu'elle soit relisible, et elles ne vont pas de soi :**

- **les profils sont GELÉS** dans des fixtures versionnées, jamais régénérés à la volée. Tant qu'ils
  étaient tirés à chaque exécution, la moindre évolution du contenu les faisait **permuter** : le diff
  affichait des changements de comportement là où deux profils avaient seulement échangé leur rang. Ça a
  produit **trois diagnostics faux d'affilée**, tous dans le même sens (« cette correction a changé le
  comportement de X profils » — c'était faux à chaque fois) ;
- **les critères sont rendus en clair** dans l'instantané. Un golden master qui n'affiche que la sortie
  oblige à rouvrir le générateur pour savoir de quel patient on parle — donc, en pratique, on ne le fait
  pas.

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
| **Garde-fou à cheval sur deux classes** | `DFG < 30` posé sur « réduire le sulfamide / le glinide » | une option = une classe |
| **Dette dispensée par nœud** | une nouvelle violation sur un nœud déjà listé passe inaperçue | exempter l'objet exact, avec motif |
| **Champ de schéma non consommé** | `module: RHD` écrit partout, lu par personne, absent du type TS | consommer ou déclarer inerte, dans le même lot |
| **Statut de contenu invisible** | 5 nœuds `brouillon` en production, rien ne le dit au praticien | rendre `meta.statut` là où le contenu est lu |
| **Réponse qu'on ne peut pas défaire** | « Rien à signaler » répond à 6 drapeaux d'un coup, irréversible, sans dire lesquels (D-11, recette du 2026-07-28) | offrir un retour en arrière, ou nommer explicitement ce qui vient d'être répondu |
| **L'écran change sous les doigts** | cocher un critère fait passer une carte déjà lue derrière un repli sans signal (D-17) ; un bandeau de contrainte inséré en tête pousse tout le formulaire de 60 px pendant la frappe (D-15) | ancrer ce qui apparaît/disparaît ; ne jamais insérer un bloc au-dessus de ce que le praticien est en train de lire |
| **La réponse arrive hors de portée du regard** | 2 207 px entre « à renseigner : Espérance de vie » et son champ ; 848 px entre une contrainte et le champ qu'elle corrige — mesuré, aucun des deux renvois n'était cliquable (D-15, D-16) | mesurer la distance à l'écran avant de livrer, pas seulement relire le contenu ; un renvoi doit s'atteindre en un geste |
| **Garde répété de la mauvaise polarité** | répéter un garde en tête d'un terme (R8) protège une citation POSITIVE (`contient X`) mais, sur une citation NÉGATIVE (`ne_contient_pas X`) du même critère masqué, force le terme à `false` pour un patient qui la satisfait pourtant trivialement — huit options d'ajout de `prescription` exclues à tort pour tout patient `initier`, régression pire que le défaut d'origine, essayée puis revertée (P4/S9, T-031 ; `engine/banc/impasse.test.ts` `IMPASSES_CONNUES_T018`) | vérifier la POLARITÉ (positive/négative) du terme avant de répéter un garde mécaniquement — R8 dit qu'il faut protéger un terme, pas dans quel sens |
| **Critère décisif dans une section masquée** | « À renseigner pour trancher : Traitements en cours » sous un formulaire dont l'intention *Initier* a supprimé la section Traitements ; l'option de sécurité qui en dépendait (insuline d'initiation, patient à cétonurie) ni proposée, ni écartée, ni nommée (N25, 2026-08-04) | R11 : sous chaque valeur du primer, tout critère décisif est saisissable ou dérivé de cette valeur |
| **Bascule de primer qui efface les saisies** | Optimiser→Initier→Intensifier vide TRAITEMENT et TOLÉRANCE sans un mot ; sur `insuline`, la même bascule perd la surveillance mais garde le profil nocturne — état restauré contradictoire (AGP sans capteur), toléré en silence (2026-08-04) | R12 : séparer valeur et visibilité ; invariant A→B→A = identité, uniforme sur toutes les sections |
| **Geste global à portée instantanée** | « Rien à signaler » ne répond qu'aux drapeaux décisifs *à cet instant* : « Dénutrition », devenue décisive quand poids et taille sont arrivés, redevient « à confirmer » dans une section que le praticien croit soldée — et le résumé replié ne liste que les drapeaux explicitement répondus (D13, 2026-08-04) | un geste global vaut pour toute la section, drapeaux futurs compris, et le résumé l'affiche en entier |
| **Deux rendus de la même négation** | « Pas de MCG en place » sur une carte, « MCG disponible : non » sur la carte voisine du même écran (`insuline`, 2026-08-04) | R6 volet rendu : un seul moteur de rendu + libellés négatifs déclarés ; invariant textuel « aucun rendu ne contient “: non” » |
| **Dérivé agrégatif au motif générique** | « écarté : Signe imposant un avis (limitation, ischémie, rétinopathie, pied) » — quatre composants énumérés, deux vrais, impossible de savoir lesquels (D7, 2026-08-04) | R6 volet rendu : un dérivé agrégatif se rend par ses composants vrais |
| **Le titre survit à la bande qui le contredit** | à CK 60 fois la normale, la carte s'intitule encore « Interrompre 4 à 6 semaines et réévaluer » et son encart doit écrire « Ce n'est PLUS la séquence décrite ci-dessus » (D6, 2026-08-04) — or le test des 20 secondes ne retient que le titre | quand une bande de valeur change la conduite, elle change le TITRE de la carte, pas seulement un encart |
| **Références en registre de changelog** | un titre d'essai porte « Le nœud n'avait encodé que la montée » et « affiché par ce nœud » (`insuline`, 2026-08-04) — méta-texte de fabrication dans l'écran praticien | une référence dit ce que dit la source, jamais ce que fait le nœud ; l'auto-critique de l'outil vit en alerte ou en cadrage ; invariant textuel sur « ce nœud », « encodé » |
| **Conclusion de nœud jamais exportée** | la « Cible ≤ 7 % » rendue par `cible-glycemique` n'existe pas en session : « Par rapport à l'objectif » se re-juge à la main deux clics plus tard (D12, 2026-08-04) | R1 (précision 2026-08-04) : la conclusion s'exporte en valeur suggérée « · calculé, à vérifier », la question directe reste posée |
| **Comportement changé, texte non repropagé** | l'argumentaire exhaustif d'`insuline` affirme qu'un ratio « déclenche le relais à elle seule », alors qu'un lot du **même jour** venait de le rétrograder en simple repère d'alerte ; celui de `prescription` nie l'existence d'une carte d'arrêt créée la **veille** (T-167/T-168, T-185, 2026-08-06) | tout lot qui change `conditions`, `role`, `famille` ou l'existence d'une option liste, à côté du YAML, son `.argumentaire.md` **et** une recherche de l'ancien intitulé/comportement dans les quatre niveaux de lecture des autres nœuds du domaine |

---

## 4 bis. Corriger un défaut sans en créer un autre

Le premier domaine a été corrigé par vagues, sous pression de recette. **Deux des défauts les plus graves
de la dernière journée venaient de nos propres correctifs du matin**, pas du contenu d'origine :

- une exclusion de sécurité sur `statine` (dialyse) a fait tomber, par `ordered-first-match`, un patient
  de prévention **secondaire** dans une carte « prévention primaire, risque faible » — un mislabeling
  créé de toutes pièces par le correctif ;
- une exclusion `DFG < 30` justifiée pour le sulfamide a retiré au glinide un geste que son RCP
  recommande, parce qu'une seule option portait les deux classes.

**Un correctif est un changement de comportement comme un autre.** Il passe donc par la même porte que
du contenu neuf — piste B du §P6 — et pas seulement par la relecture de son propre diff.

**La mesure qui répond à la bonne question** n'est pas « combien de lignes ont changé » mais **combien de
profils ont gagné ou perdu une option, et lesquels**. Sur la scission sulfamide/glinide, la formulation
utile tenait en trois nombres : *28 profils à DFG < 30 récupèrent le geste · 0 profil sulfamide ne
repasse sous le garde-fou · 0 option perdue.* Le premier dit que le correctif fait ce qu'on attend, le
deuxième que le garde-fou d'origine tient toujours, le troisième qu'on n'a rien cassé ailleurs.

**Valider l'instrument de mesure avant de conclure.** Mesurer un instantané structuré à coups de `grep`
et de troncatures s'est trompé **quatre fois** dans la même journée : fins de ligne CRLF, champ retiré
des deux côtés du diff, décalage de numéros de ligne, et enfin une troncature au *premier* séparateur
d'un format qui en compte cinq — qui a produit un rassurant « zéro changement » entièrement faux. Avant
d'annoncer un chiffre tiré d'un diff : vérifier le format sur **un cas dont on connaît déjà la réponse**.

**Un lot purement éditorial doit prouver qu'il l'est.** La bonne preuve n'est pas « j'ai relu » mais le
golden master **inchangé au bit près**, accompagné de l'argument structurel qui dit *pourquoi* c'était
attendu (les champs modifiés — `avantages`, `inconvenients`, `effet_attendu` — ne sont pas rendus dans la
signature, ils sont donc hors de portée de l'instantané par construction).

**Le doute du clinicien sur un garde-fou automatique se vérifie en source primaire.** Quand le référent a
demandé « glinide sous 30 de DFG, quelle est la question ? Il faut vérifier la RCP », le réflexe naturel
était d'expliquer le correctif. La RCP a donné tort au correctif. Un garde-fou de sécurité mis en doute
par le clinicien se re-source, il ne se défend pas.

**Un garde-fou qu'aucun profil ne franchit est un garde-fou non testé** — et le golden master ne le dira
pas, puisque rien n'y change. L'exclusion « sulfamide chez le sujet fragile » n'a modifié la sortie
d'AUCUN des 180 profils du banc : les seuls profils fragiles qui atteignaient l'option en étaient déjà
retirés par le seuil rénal. Le lot semblait donc sans effet alors qu'il ajoutait une vraie
contre-indication. La conclusion n'est pas « le golden master suffit » mais : *tout garde-fou ajouté
appelle une vignette qui le franchit explicitement, et une contre-épreuve qui ne le franchit pas.*

**Un garde-fou peut aussi être INATTEIGNABLE — et l'écrire quand même est pire que ne rien écrire.** Sur
`statine`, des `exclusions` posées sur l'option de repli n'ont jamais pu se déclencher : en
`ordered-first-match`, l'option qui la précédait captait déjà exactement ces patients. L'invariant de
couverture du banc (« chaque option porteuse d'`exclusions` est exclue pour au moins un profil ») l'a
signalé immédiatement. Sans lui, le fichier aurait porté une protection décorative que personne n'aurait
relue. **Quand un ordre porte une garantie de sécurité — et non plus seulement une hiérarchie clinique —
il faut l'écrire à l'endroit qu'un futur remaniement casserait**, c'est-à-dire dans l'option qu'on croit
protégée, pas seulement dans celle qui protège.

**`visible_si` est de l'ergonomie, pas de la correction.** Il n'est lu que par la couche formulaire ; le
moteur ne le connaît pas. Un critère dont la portée clinique est conditionnelle (« CK avant initiation »)
doit porter cette condition **dans chaque expression qui le lit**, pas seulement dans son `visible_si` —
sans quoi une valeur saisie puis rendue invisible continue d'agir. La redondance entre les deux est
voulue : l'une sert la saisie, l'autre le raisonnement.

**Un lot qui change le comportement d'une carte doit repasser les quatre niveaux de lecture qui la
citent, pas seulement ses champs moteur.** Le YAML et l'argumentaire exhaustif (`.argumentaire.md`)
sont deux fichiers distincts, édités à des rythmes différents — c'est la même désynchronisation que
« deux chemins d'affichage » (§4), mais entre deux **fichiers** au lieu de deux composants de rendu.
Trois lots de comportement livrés le même jour (2026-08-06 : T-167/T-168 sur `insuline`, T-185 sur
`prescription`, T-170 sur les deux nœuds RHD) ont chacun laissé au moins un texte affirmer l'inverse du
comportement livré : l'argumentaire exhaustif d'`insuline` promettait qu'un ratio de sur-basalisation
« déclenche le relais à elle seule », alors que le même lot venait de le rétrograder en simple repère
d'alerte ; celui de `prescription` niait l'existence d'une carte d'arrêt créée la veille ; les deux
argumentaires RHD ne mentionnaient pas la carte de repli ajoutée l'avant-veille. **Aucun de ces textes
n'était faux au moment où il a été écrit** — ils sont devenus faux le lendemain, par un lot qui ne les
a pas vus. La cause structurelle : le YAML et le `.argumentaire.md` d'un même nœud sont deux fichiers,
et un red-team de contenu qui s'arrête au premier ne voit jamais la contradiction introduite dans le
second. **Parade** : la liste de fichiers d'un lot qui change `conditions`, `role`, `famille` ou
l'existence d'une option inclut, à côté du YAML, son `.argumentaire.md` **et** une recherche de
l'ancien intitulé ou de l'ancien comportement dans les quatre niveaux de lecture (badge, carte
dépliée, argumentaire du nœud, argumentaire exhaustif) de **tous** les nœuds du domaine qui pourraient
y renvoyer — un renvoi cassé ne reste pas forcément dans le fichier qu'on vient de modifier. Détail
complet : `docs/decision/validation/contre-relecture-redaction-2026-08-06.md`.

**Changer le TYPE d'un critère n'est pas ajouter un critère.** La procédure de gel des profils du banc
sait *compléter* une fixture (nouvelle colonne, colonnes existantes intactes) ; elle ne sait pas
*convertir* une colonne dont le type a changé — un `bool` figé reste `true`/`false` face à une
énumération, et le moteur lève une erreur qui ressemble à un bug de contenu. Le geste correct est de
retirer à la main la seule colonne concernée, puis de relancer la procédure : elle la retire à neuf comme
une colonne manquante, et les autres ressortent identiques — ce qui se **vérifie valeur par valeur**, pas
sur la foi du diff.

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

### Classer chaque `incertitudes` par NATURE, à l'écriture

Le DT2 en compte **55**. Question posée par le référent en fin de domaine : *« une collecte de données
en réglerait-elle une partie ? »* — question évidente, et **impossible à trancher sans relire les 55**,
parce que rien ne distingue une lacune de la preuve d'un arbitrage en attente ou d'une dette technique
rangée là faute d'un meilleur endroit. Le dépouillement a donné cinq familles très inégales :

| nature | ce qui la lève | part du DT2 |
|---|---|---|
| **Lacune irréductible de la preuve** — « non démontré », « aucun ECR » | rien, sauf un essai futur ; une collecte ne fait que **confirmer le vide** | ~15 |
| **Arbitrage référent en attente** — un choix, pas un fait | une décision, jamais une source | ~10 |
| **Choix de conception documenté** — « choix assumé », « signalé, pas inventé » | rien : c'est une trace, pas une question | ~10 |
| **Sourçage réellement manquant** — la donnée existe, on n'est pas allé la chercher | **une collecte ciblée** | ~6 |
| **Mal rangé** — dette technique ou entrée périmée | un lot de code, ou une suppression | ~7 |

Deux conséquences pratiques, l'une pour le prochain domaine, l'autre pour celui-ci :

- **déclarer la nature dans l'entrée elle-même** (un préfixe suffit : `PREUVE:` / `ARBITRAGE:` /
  `CONCEPTION:` / `SOURÇAGE:` / `TECHNIQUE:`). Le tri devient instantané, et la question « que peut-on
  encore fermer, et par quel moyen ? » se répond d'un coup d'œil au lieu d'une relecture intégrale ;
- **une entrée périmée est pire qu'absente** : elle décrit un défaut corrigé comme s'il subsistait. Le
  DT2 en portait au moins une — « le schéma ne porte aucun `min`/`max` pour un critère `nombre` » —
  restée en place après l'ajout de ces champs. Purger `incertitudes` fait partie du lot qui lève la
  limite, au même titre que le changelog.

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
6. **Des agents parallèles ne partagent jamais un fichier.** Le périmètre s'énonce en fichiers, et deux
   lots qui se recouvrent se sérialisent. Un lot éditorial et un correctif de sécurité ont visé le même
   YAML le même soir ; le second a dû attendre. C'est le bon comportement, mais il se décide **avant**
   de lancer, pas en voyant le `git status`.
7. **Un agent mesure, il n'estime pas.** « Beaucoup de changements cosmétiques » annoncé sur un lot
   `insuline` recouvrait **79 profils dont la liste d'options avait réellement changé**. La consigne
   d'un lot doit exiger le chiffre et la méthode qui le produit, pas une appréciation.
8. **Le statut du contenu est visible là où le contenu est lu.** Cinq nœuds sont `brouillon` et
   l'application déployée n'en dit rien — un praticien ne peut pas savoir qu'il lit un contenu non
   validé. Le cycle de vie éditorial n'a de valeur que s'il atteint l'écran.

---

## 7. Ce que ce document coûte, et pourquoi il faut le payer

P0 à P3 ne produisent **aucun contenu clinique**. C'est visible, c'est frustrant, et il est tentant de
les abréger « parce qu'on sait déjà faire ».

C'est exactement l'abréviation qui a produit les vagues de correction du premier domaine.
