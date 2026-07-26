# RCP répaglinide (glinide) et insuffisance rénale — vérification ciblée

- **Statut** : vérification en lecture seule, sources primaires récupérées le 2026-07-26. Aucune
  modification de contenu apportée par cette note — décision à prendre par le référent.
- **Question posée** : le correctif de sécurité `exclusions: ["DFG < 30"]` ajouté aujourd'hui à l'option
  *« Réduire la posologie du sulfamide / du glinide »* (`content/noeuds/diabete-type-2/prescription.yaml:774-796`,
  red-team sécurité HAUTE-1) exclut-il à tort le glinide, dont le référent soupçonne un métabolisme
  hépatique préservant son usage en insuffisance rénale sévère ?

## Verdict en une phrase

**Le doute du référent est fondé et vérifié en source primaire : le répaglinide n'a AUCUNE contre-indication
rénale dans son RCP** (contrairement au sulfamide) ; l'exclusion `DFG < 30` posée aujourd'hui, correcte pour
le sulfamide, est **injustifiée pour le glinide** et lui retire à tort un geste de réduction de dose légitime.

## 1. RCP du répaglinide — ce qu'il dit sur le rein (source primaire)

Deux RCP consultées sur la Base de données publique des médicaments (BDPM, ANSM) :

- **REPAGLINIDE EG 2 mg** — `https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid=66773421&typedoc=R`
- **REPAGLINIDE ARROW GENERIQUES 1 mg** — même base, specid 66773421 (redirection vers
  `http://base-donnees-publique.medicaments.gouv.fr/medicament/66773421/extrait#tab-rcp`)

**Rubrique 4.2 (Posologie), verbatim** :
> « Le répaglinide n'est pas affecté en cas d'altération de la fonction rénale » [excrétion]. « Huit pour
> cent de la dose de répaglinide subit une excrétion rénale, et la clairance plasmatique totale diminue chez
> les patients présentant une insuffisance rénale. » « La sensibilité à l'insuline étant par ailleurs
> augmentée chez les patients diabétiques présentant une insuffisance rénale, il est conseillé d'être
> prudent lors de l'adaptation des doses chez ces patients. »

**Rubrique 4.3 (Contre-indications), constat direct** : **aucune mention de l'insuffisance rénale**. Les
deux RCP consultées (specid 66773421, deux fabricants distincts) ne portent pas de contre-indication rénale
dans cette rubrique.

**Rubrique 4.4 (Mises en garde)** : **pas de mention explicite de l'insuffisance rénale** dans les extraits
consultés.

**Rubrique 5.2 (Pharmacocinétique), verbatim** :
> « Après cinq jours de traitement par le répaglinide (2 mg x 3/jour) chez des patients présentant une
> insuffisance rénale sévère (clairance de la créatinine : 20-39 ml/min), les résultats montrent une
> augmentation significative de deux fois de l'exposition (ASC) et de la demi-vie (t1/2) par rapport aux
> sujets présentant une fonction rénale normale. »

**Conclusion factuelle du RCP** : le répaglinide est éliminé **à plus de 90 % par voie hépatobiliaire**
(métabolisme CYP2C8 + sécrétion biliaire — donnée confirmée par une source secondaire de pharmacologie,
`pharmacomedicale.org`, cf. §2) ; seuls 8 % passent par le rein. En insuffisance rénale sévère, l'exposition
double (ASC x2) — ce n'est **pas un phénomène négligeable** — mais le RCP en tire une conclusion de
**prudence posologique**, jamais de **contre-indication**. Aucun seuil de DFG n'est donné comme limite
absolue dans les rubriques consultées.

**Tentative complémentaire** : le PDF EMA du RCP centralisé de Novonorm
(`https://www.ema.europa.eu/fr/documents/product-information/novonorm-epar-product-information_fr.pdf`) a
été récupéré mais n'a pas pu être extrait en texte exploitable par l'outil de lecture (PDF non
translittéré) — **non exploité**, signalé plutôt que deviné son contenu. Les deux RCP BDPM (deux fabricants
différents, même substance) sont concordants et suffisent à établir l'absence de CI rénale ; ils sont
harmonisés sur le RCP de référence (Novonorm) par les règles de générique.

## 2. Glinides commercialisés en France

**Une seule molécule** : le **répaglinide** (Novonorm + génériques : Biogaran, Arrow, EG, Teva…).

Le **natéglinide** (Starlix) n'est **plus commercialisé nulle part dans l'UE**, France comprise : l'AMM a
été **retirée à l'échelle européenne le 29 avril 2022**, à la demande de Novartis Europharm Limited, pour
motif commercial (page officielle EMA) :
> « This medicine's authorisation has been withdrawn » — date : 29 April 2022.
> Source : `https://www.ema.europa.eu/en/medicines/human/EPAR/starlix`

Une source secondaire de pharmacologie universitaire (`pharmacomedicale.org/medicaments/par-specialites/item/glinides`,
qualifiée ici comme secondaire) confirme : « Une seule molécule est commercialisée en France, le
répaglinide » et ajoute — hors RCP mais cohérent avec lui — que le répaglinide « peut être donné en cas
d'insuffisance rénale sévère (15-30 ml/min) », contrairement à la metformine ou aux sulfamides.

**Conséquence pour le nœud** : la question « faut-il un seuil rénal propre au glinide » se réduit
concrètement à **une seule molécule, le répaglinide** — pas de risque d'hétérogénéité intra-classe (pas de
2e glinide en France à traiter différemment).

## 3. Sulfamides — confirmation de la contre-indication, seuil et mécanisme

Deux RCP consultées (BDPM) :

- **Gliclazide** (GLICLAZIDE MYLAN PHARMA 60 mg LM) — specid 65571438
- **Glimépiride** (GLIMEPIRIDE EG) — medicament/66017203

**Rubrique 4.3 (Contre-indications), gliclazide, verbatim** :
> « insuffisance rénale ou hépatique sévère (dans ces situations, il est recommandé de recourir à
> l'insuline) »

**Rubrique 4.3, glimépiride** : contre-indiqué en cas d'« insuffisance rénale ou hépatique sévère » ; « En
cas de troubles fonctionnels sévères rénaux ou hépatiques, il est recommandé de passer à
l'insulinothérapie. »

**Mécanisme (rubrique 4.4, gliclazide, verbatim)** :
> « chez ces patients, l'hypoglycémie pouvant être prolongée, une prise en charge appropriée doit être
> instituée. »

Le mécanisme documenté par le RCP est donc explicitement **la prolongation de l'hypoglycémie** en
insuffisance rénale/hépatique sévère (cohérent avec l'accumulation du principe actif et/ou de métabolites
actifs faiblement épurés par un rein défaillant).

**Point important — pas de seuil numérique dans le RCP** : ni le RCP du gliclazide ni celui du glimépiride
ne donnent de valeur chiffrée de clairance de la créatinine ou de DFG pour définir « sévère » — le terme
reste qualitatif. Le seuil « DFG < 30 » utilisé dans le dépôt (`prescription.yaml:377`, « convention
KDIGO/SFD ») est donc **une convention clinique usuelle** (DFG < 30 = stades KDIGO G4-G5, seuil couramment
retenu en pratique française pour « insuffisance rénale sévère »), **pas une citation littérale du RCP** —
le dépôt le déclare d'ailleurs lui-même comme une convention et non comme un chiffre de RCP. Ce n'est pas une
invention, mais une transposition raisonnable ; à garder en tête si le référent veut un sourçage plus dur
(ex. HAS/SFD grille DFG).

**Différence gliclazide/glimépiride** : les deux sont contre-indiqués dans les mêmes termes RCP
(« insuffisance rénale ou hépatique sévère », sans distinction de seuil entre les deux molécules dans les
extraits consultés) — pas de divergence de libellé trouvée entre les deux.

## 4. Ce que le dossier de preuve du dépôt dit déjà (et qu'il faut lire avant de trancher)

Le dépôt a **déjà repéré et documenté ce trou lui-même**, avant même cette vérification externe :

- `content/noeuds/diabete-type-2/prescription.yaml:1238-1247` (bloc `incertitudes`, verbatim) :
  > « GLINIDE SEUL (sans sulfamide) + DFG < 30 : l'exclusion `DFG < 30` ajoutée (4e série, 2026-07-26,
  > red-team sécurité HAUTE-1) à « Réduire la posologie du sulfamide / du glinide » protège contre la
  > contradiction avec « Arrêter le sulfamide » — mais ce nœud n'a PAS d'option « Arrêter le glinide »
  > dédiée (seul le sulfamide en a une). Un patient sous glinide SEUL (aucun sulfamide) à DFG < 30 avec
  > intolérance ou hypoglycémie récente perd donc son seul geste de réduction/allègement ciblé sur cette
  > molécule sans qu'aucun verdict de remplacement ne le couvre [...] Le dossier de preuve de ce nœud ne
  > documente pas de seuil rénal spécifique au glinide (contrairement au sulfamide, sourcé `:367`) : signalé
  > plutôt qu'inventé (invariant CLAUDE.md 6), à trancher par le référent (seuil propre au glinide, ou
  > verdict dédié sur le modèle du sulfamide). »

- `content/noeuds/diabete-type-2/prescription.argumentaire.md:93-96` (verbatim) :
  > « Résiduel signalé, non corrigé faute de source : aucune option « Arrêter le glinide » dédiée n'existe
  > dans ce nœud (contrairement au sulfamide) — un patient sous glinide seul à DFG < 30 perd donc son geste
  > de réduction sans verdict de remplacement (cf. `incertitudes` du YAML). »

- `docs/decision/validation/chantier-2026-07-26/redteam-clinique-securite.md:31-73` (finding HAUTE-1) :
  la correction proposée et appliquée cible **nommément le sulfamide** (« Sulfamide en insuffisance rénale
  sévère ») ; le glinide n'apparaît dans le finding que par **effet de bord syntaxique**, parce que
  l'option porte les deux classes dans un seul intitulé (`:45`, `:61-73`) — le red-team ne prétend à aucun
  moment que le glinide partage la contre-indication rénale du sulfamide.

- Le dossier de preuve historique `docs/decision/noeuds/D-sulfamides-gliptines.md` (nœud D,
  sulfamides/gliptines, vérifié bi-agents 2026-07-24, 802 lignes lues en totalité pour cette vérification)
  **ne traite jamais du glinide** — c'est un nœud « sulfamides + gliptines » au périmètre PICO figé
  explicitement sur ces deux classes (§0-1). Le glinide n'a donc **aucun dossier de preuve dédié** dans ce
  dépôt : sa présence dans `prescription.yaml` (option combinée, critère `traitements_en_cours`) a été
  ajoutée sans collecte D-like propre. C'est cohérent avec ce que documente `incertitudes:1245` : « le
  dossier de preuve de ce nœud ne documente pas de seuil rénal spécifique au glinide ».

**Synthèse de ce point** : le seuil « DFG < 30 » de l'option combinée n'a **jamais été pensé comme
s'appliquant aux deux classes** par les auteurs du correctif — il vise le sulfamide, et son application
mécanique au glinide (parce que l'option est unique) est un **effet de bord non voulu**, déjà repéré et
consigné par le dépôt lui-même le jour même.

## 5. Réponse aux trois issues possibles

- **Garder en l'état** (l'exclusion vaut pour les deux classes) : **non soutenu par les sources**. Le RCP du
  répaglinide ne contient aucune contre-indication rénale ; à DFG < 30, il expose seulement à une exposition
  doublée (ASC x2, source RCP §5.2) justifiant une prudence posologique — c'est-à-dire très exactement ce
  que fait l'option « Réduire la posologie », pas ce qui la contre-indique. Maintenir l'exclusion prive un
  patient sous glinide en IRC sévère d'un geste de réduction que le RCP recommande explicitement (« prudence
  lors de l'adaptation des doses »).
- **Garder une seule option et affiner l'exclusion** : possible techniquement (remplacer
  `exclusions: ["DFG < 30"]` par une condition qui ne porte que sur la présence du sulfamide, p. ex.
  `"traitements_en_cours contient sulfamide AND DFG < 30"`), mais cela **rétablirait la contradiction
  HAUTE-1** que le correctif visait à corriger pour le sulfamide seul si un patient est sous les DEUX
  molécules à la fois (cas rare mais non nul, la porte d'entrée `traitements_en_cours` est une liste) : il
  faudrait alors une exclusion **conditionnelle à la présence du sulfamide dans le mélange**, pas une
  exclusion globale sur l'option.
- **Scinder l'option en deux** (une par classe) : **c'est l'issue la mieux soutenue par les sources** et
  celle qui suit le modèle déjà appliqué au sulfamide dans ce même nœud (qui a sa propre option « Arrêter le
  sulfamide (DFG < 30) » distincte de la carte générique). Elle permet de :
  1. porter l'exclusion `DFG < 30` **uniquement** sur l'option sulfamide (contre-indication RCP réelle,
     `gliclazide`/`glimépiride`) ;
  2. laisser l'option glinide **sans exclusion rénale**, avec un libellé qui reflète le RCP réel : réduction
     de dose et surveillance renforcée en IRC sévère (prudence posologique, pas arrêt) — éventuellement en
     signalant l'ASC x2 en < 40 ml/min comme repère de prudence, sans en faire un seuil dur puisque le RCP
     n'en fixe pas.

## 6. La question ouverte : faut-il une option « Arrêter le glinide » en miroir du sulfamide ?

**Non, pas sur le seul critère rénal — les sources ne le soutiennent pas.** Le sulfamide a une option
« Arrêter » dédiée précisément parce que le RCP prononce une **contre-indication formelle** au-delà d'un
seuil de sévérité rénale. Le répaglinide n'a **aucune contre-indication rénale** dans son RCP : il n'y a donc
pas de fondement RCP pour un geste d'**arrêt** motivé par le seul DFG. Le geste RCP-cohérent pour le glinide
en IRC sévère est une **réduction de dose avec surveillance renforcée** (prudence posologique), pas un arrêt
— ce qui est d'ailleurs déjà la nature de l'option existante (« Réduire la posologie »), simplement mal
bornée aujourd'hui par une exclusion qui ne le concerne pas.

Un motif d'arrêt du glinide resterait pertinent pour d'autres raisons déjà couvertes ailleurs dans le nœud —
intolérance, hypoglycémie répétée, sur-contrôle (`hba1c_sous_cible`), désintensification — mais **pas**
comme un geste calqué sur la contre-indication rénale du sulfamide.

## 7. Ce qui n'a pas pu être vérifié

- Le RCP centralisé EMA de Novonorm (PDF) n'a pas pu être lu en texte exploitable par l'outil disponible ;
  seules les rubriques 4.2/4.3/4.4/5.2 des RCP BDPM de deux génériques (specid 66773421) ont été citées
  verbatim — jugées suffisantes car harmonisées sur le RCP de référence par construction réglementaire, mais
  signalé pour transparence.
- Aucune source SFD/HAS spécifique au répaglinide en insuffisance rénale n'a été récupérée dans cette
  vérification (hors périmètre de la mission, qui demandait la RCP en priorité) — si le référent veut un
  sourçage société savante en plus du RCP (par ex. pour choisir une dose de départ précise en IRC sévère),
  une collecte complémentaire serait nécessaire.
- Le seuil « ASC x2 » du RCP porte sur la tranche 20-39 ml/min (étude PK à 5 jours) ; le RCP ne dit rien
  d'explicite en deçà de 20 ml/min (dialyse) — silence RCP, non comblé ici, à signaler si le nœud doit
  couvrir aussi ce palier.
- La source secondaire `pharmacomedicale.org` (utilisée uniquement pour corroborer le nombre de glinides
  commercialisés et le mécanisme d'élimination hépatique, non pour la contre-indication elle-même qui vient
  du RCP direct) est un site de pharmacologie universitaire, qualifiée ici explicitement comme **secondaire**
  — pas une source réglementaire.

## Sources consultées (URLs)

- RCP répaglinide (BDPM, ANSM) : `https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid=66773421&typedoc=R`
  et `http://base-donnees-publique.medicaments.gouv.fr/medicament/66773421/extrait#tab-rcp`
- RCP gliclazide (BDPM, ANSM) : `https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid=65571438&typedoc=R`
  et `http://base-donnees-publique.medicaments.gouv.fr/medicament/65571438/extrait#tab-rcp`
- RCP glimépiride (BDPM, ANSM) : `https://base-donnees-publique.medicaments.gouv.fr/medicament/66017203/extrait`
- Statut Starlix (natéglinide), EMA : `https://www.ema.europa.eu/en/medicines/human/EPAR/starlix`
- RCP Novonorm (EMA, PDF non exploité — voir §5f) : `https://www.ema.europa.eu/fr/documents/product-information/novonorm-epar-product-information_fr.pdf`
- Secondaire (glinides, mécanisme, corroboration) : `https://pharmacomedicale.org/medicaments/par-specialites/item/glinides`
- Dépôt interne : `content/noeuds/diabete-type-2/prescription.yaml`,
  `content/noeuds/diabete-type-2/prescription.argumentaire.md`,
  `docs/decision/validation/chantier-2026-07-26/redteam-clinique-securite.md`,
  `docs/decision/noeuds/D-sulfamides-gliptines.md`
