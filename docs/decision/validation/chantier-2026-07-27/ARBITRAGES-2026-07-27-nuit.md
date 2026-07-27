# Arbitrages rendus le 2026-07-27 (nuit) — seconde recette navigateur et suites

> **Objet** : les 17 décisions prises en une session, avec pour chacune ce qu'elle engage et ce qui reste
> à faire. Elles couvrent les 10 classes de `PASSAGE-classes-et-invariants-2026-07-27.md`, les dettes
> ouvertes par les invariants I14 et I15, et les points laissés en suspens par la première recette.

---

## 1. Ce qui part en PASSE DE RECHERCHE

Deux passes distinctes, toutes deux préalables à tout câblage. Elles portent sur du contenu clinique que
je ne rédige pas.

### Passe A — la glycémie capillaire pour l'ajustement de l'insuline

**Motif référent** : *« il faut faire une passe de recherche pour câbler précisément l'utilisation de la
glycémie capillaire pour ajuster l'insuline, j'ai moins l'habitude de travailler avec, j'utilise quasi
systématiquement la MCG. »*

**Décision de fond, à instruire sur sources** : sans MCG, **la glycémie à jeun sert de critère pour la
basale, les glycémies post-prandiales pour la rapide.**

Ce que la passe doit livrer :

- les **seuils** de glycémie à jeun qui commandent titration / plafonnement de la basale ;
- les **seuils post-prandiaux** qui commandent l'introduction et l'ajustement du bolus — et le **champ
  qui n'existe pas** : le nœud n'a aujourd'hui aucune glycémie post-prandiale saisissable, son seul
  signal post-prandial (`profil_glycemique`) est une lecture AGP, donc inobtenable sans capteur ;
- le sort des **garde-fous de sécurité** (`TBR > 4`, `TBR_severe > 1`, `CV_glycemique > 36`) chez le
  patient non équipé : quel signal obtenable les remplace.

Sont VERSÉS à cette passe, décision prise :

| point | pourquoi il y atterrit |
| --- | --- |
| **K2 classe A** (4 options déclenchées par une mesure MCG) | le repli sur la glycémie à jeun est retenu, mais ses seuils relèvent de la passe |
| **K2 classe B** (exclusions de sur-titration) | idem — et c'est le cœur du sujet |
| **K2 volet basale** | ⚠ le référent a demandé d'**ATTENDRE** la passe plutôt que de débloquer tout de suite sur `gaj_a_cible`. Le défaut reste donc en ligne : un patient sous basale sans capteur n'obtient aucune conduite de titration. C'est assumé. |
| **`fragilite` sur `insuline`** (dette I14) | sa voix EXISTE — l'alerte « cibles assouplies » — mais elle est gardée par `mcg_disponible == true`. Même classe : une information indépendante du capteur, cachée derrière lui. |
| **Module `insuline` en 4 nœuds** | la passe va modifier une grande partie des conditions et exclusions ; la structure se jugera sur l'état définitif, pas sur l'actuel. |

### Passe B — sécurité à l'effort (nœud RHD Activité physique)

Ce que la passe doit livrer :

- le texte et la source de l'**alerte ischémie d'effort** — orientation cardiologique avant prescription
  d'activité (décision : alerte dédiée) ;
- le texte et la source de l'**alerte rétinopathie non stabilisée ou proliférante** (décision : alerte
  dédiée, même traitement) ;
- **K9** — la délimitation de ce que chaque contre-indication interdit RÉELLEMENT : le verrou retire
  aujourd'hui la famille « pratique structurée » alors que la contre-indication porte sur une modalité
  (l'appui en charge) qui traverse plusieurs familles. Deux cartes proposant de la marche subsistent en
  tête. La question « remplacer un trajet motorisé par la marche relève-t-il de la marche prolongée ? »
  est clinique et se tranche dans cette passe.

## 2. Ce qui est exécutable sans recherche

| # | décision | ce que ça engage |
| --- | --- | --- |
| **I15** | ⚠ Prérequis tranchés mais **NON POSÉS** — voir §7 | ils font échouer I2′ : retirer un repli, c'est retirer le filet |
| **TCA** | Fusionner les trois signes en **un seul critère**, et **ajouter un champ `aide` au schéma** pour ne pas perdre les trois items de l'encadré 11 HAS | schéma + rendu + contenu. Le champ `aide` est générique et répond aussi au constat de recette sur les libellés RHD bruts. `rhd-alimentation` perd deux champs sur les 26 les plus denses du domaine |
| **S7** | Aligner `traitements_en_cours` sur le **vocabulaire fin** : `insuline_basale` / `insuline_rapide` dans les quatre nœuds | contenu, trois nœuds à reprendre. Supprime la divergence qui rendait toute règle « contient insuline » structurellement fausse dans `insuline` |
| **K10** | **Réécrire l'alerte DFG.** Substance donnée par le référent : *« le DFG peut contre-indiquer des agents à élimination rénale, il ne porte pas sur leur aspect glycémique — l'insuline n'a par exemple aucune contre-indication sur le DFG »* | contenu, une alerte. La distinction ne tiendra plus au seul mot « glycémique » au milieu de cinq lignes |
| **A5** | Confirmer au socle les **doses calculées** et le **motif du rang** | déjà livré tel quel, la décision ratifie mes deux arbitrages |
| **K7** | **Rien** — le chapô suffit, la grossesse reste à la charge du praticien | aucune action ; l'invariant I18 proposé par le rapport n'est pas écrit |

## 3. K5 — plafond de recommandations simultanées

**Décision : 5 pistes maximum.** Aujourd'hui `rhd-alimentation` en sort **10, toutes badgées
« Recommandée »**.

⚠ **Ce plafond ne peut pas être appliqué seul.** Il suppose de savoir laquelle des dix passe devant,
donc un rang clinique sur chaque option — ce que **A3** (déclarer le rôle d'une option) apporte. Le
plafond est donc **suspendu à A3**, et c'est la raison pour laquelle A3 vient en tête du lot 3.

## 4. K6 — et une conséquence d'architecture à connaître

**Décision référent** : *« si la cible est connue (car déclarée dans le premier module), le module peut
déduire le résultat en calculant l'écart à la cible et pré-remplir la position à la cible. Sinon c'est
la position à la cible déclarée qui fait foi. »*

C'est une **troisième voie**, différente des deux que j'avais proposées, et elle préserve R1 : la
position reste déclarée et modifiable, elle est seulement **pré-remplie** quand l'information existe.

⚠ **Mais elle suppose quelque chose que l'application n'a pas.** Aujourd'hui, sortir d'un nœud et y
revenir **remet le formulaire à zéro** — chaque nœud est monté à neuf, et rien ne circule d'un nœud à
l'autre. Le chaînage entre nœuds a été délibérément exclu (garde-fou R1), et le « socle de critères
partagé » de D22 n'a jamais été livré pour cette raison.

Pré-remplir suppose donc un **état de session partagé entre nœuds**. Trois précisions qui rendent la
décision tenable :

1. ce qui circulerait est une **valeur saisie** (la cible d'HbA1c), pas une **conclusion** du moteur —
   c'est exactement la distinction que le garde-fou R1 protège, et elle est respectée ;
2. la valeur serait **pré-remplie, jamais imposée** : le praticien la voit et peut la corriger, donc
   aucune décision n'est prise à sa place ;
3. cela reste **en mémoire de session**, donc compatible avec l'invariant 1 (aucune persistance, aucun
   réseau).

**Reste à trancher avant câblage** : est-ce bien un chaînage acceptable au sens de R1, ou faut-il
d'abord réviser la règle ? Je ne le fais pas de moi-même — c'est le garde-fou que le dépôt a posé
explicitement, et le contourner sans le dire serait exactement ce que ce chantier corrige ailleurs.

## 5. Lot 3 — les trois, dans cet ordre

**Décision : les trois sont retenus.** L'ordre découle des dépendances plutôt que d'une préférence :

1. **A3 — déclarer le rôle d'une option** (socle / geste / repli / sécurité). Prérequis du plafond K5,
   et il redonne son sens au badge « Recommandée », aujourd'hui porté par dix cartes sur dix.
2. **A4 / F — `visible_si` par valeur de `liste`.** Troisième occurrence du même manque ; évolution de
   schéma générique qui servira tout domaine futur.
3. **I — la pollution du « pourquoi pas d'autres options ».** Purement ergonomique, mais c'est ce que le
   praticien lit quand il cherche pourquoi une piste n'apparaît pas.

## 7. I15 — le prérequis a découvert un trou, et je ne l'ai pas posé

Les deux prérequis ont été écrits, la suite les a refusés, et le motif vaut d'être connu : l'invariant
**I2′** (« jamais `applicable` VIDE quand tous les critères sont renseignés ») échoue sur les deux nœuds.
Retirer un repli, c'est retirer le filet.

Mesuré avant de renoncer :

- **`prescription` — 6 profils sur 1840**, tous de la même forme : `intention == initier`, aucun
  traitement en cours, **DFG entre 3 et 29**. La metformine est exclue sous 30, plus aucune autre option
  ne s'applique. **Le nœud n'a aucune conduite pour un diabète nouvellement diagnostiqué en
  insuffisance rénale sévère.** Ce trou PRÉEXISTAIT, masqué par un repli absurde qui proposait de
  « poursuivre » un traitement inexistant. Le prérequis n'a fait que le découvrir.
- **`insuline` — 7 profils sur 1760**, tous des saisies INCOHÉRENTES : situation « naïf » avec de
  l'insuline déjà cochée. Le nœud porte déjà une alerte pour ce cas. Artefacts du générateur.

**Décision prise sans vous, et je la signale** : ne pas livrer d'écran vide. Un repli qui dit une chose
fausse est moins grave qu'un écran qui ne dit rien — le second est un cul-de-sac en consultation. Les
deux prérequis attendent donc, en dette déclarée avec ce motif.

**Deux questions rouvertes** :

1. que propose-t-on à un DT2 nouvellement diagnostiqué avec un **DFG < 30** ? Une fois cette option
   écrite, le prérequis de `prescription` se pose sans rien casser ;
2. pour `insuline`, accepte-t-on un écran sans option devant une saisie contradictoire — l'alerte
   d'incohérence suffit-elle — ou faut-il un repli propre à ce cas ?

## 6. Ce qui reste ouvert, et ne dépend de personne

- La **relecture rédactionnelle des textes** : libellés RHD bruts et sans accents, « deja » / « Rapportee »
  sur `statine`. Relevé par la première recette, jamais traité.
- Les **trois vignettes manquantes** (dette S8) : `cible-glycemique`, `rhd-alimentation`,
  `rhd-activite-physique`.
- `prescrire 12.pdf` toujours **vide**, à re-fournir.
