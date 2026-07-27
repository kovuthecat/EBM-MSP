# Recette visuelle — lot 1 (chantier 2026-07-27)

## 1. En-tête

| | |
|---|---|
| **Commit recetté** | `7a14689` — *Lot 1 — la détermination : ce que l'écran affirme, ce que le moteur croit* |
| **HEAD au moment de la passe** | `c69241e` (*docs(recette) : prompt de recette visuelle du lot 1*) |
| **Écart code entre les deux** | **aucun** — `git diff --stat 7a14689 c69241e` ne renvoie qu'un fichier, `docs/decision/validation/chantier-2026-07-27/PROMPT-recette-visuelle-lot1.md`, +182 lignes. Le code, les YAML et les tests recettés sont donc bien ceux de `7a14689`. |
| **Date de la passe** | 2026-07-27 |
| **Environnement** | serveur local Vite, `http://localhost:5174` (config `ebm-msp-dev`), **jamais** `ebm-msp.vercel.app` |
| **Navigateur** | navigateur intégré Claude Code (Chromium). Deux tailles utilisées : **966 × 910 px** (« desktop », la largeur affiche les cartes par paires) et **431 × 934 px** (« étroit », les cartes s'empilent). |
| **Console** | aucune erreur JS sur toute la passe (`read_console_messages`, filtre erreurs : vide). |

### Ce que j'ai pu faire

Les 7 scénarios ont été montés à l'écran et observés. Aucun point n'est coché
sur une supposition : chaque verdict ci-dessous s'appuie sur un état de
formulaire relevé champ par champ dans le DOM **au moment de l'observation**,
et non sur une lecture du code ou des tests.

### Ce que je n'ai pas pu faire

- **Captures : pas d'images sur disque.** Le navigateur intégré me rend les
  captures d'écran à moi, pas au système de fichiers ; je ne peux pas les
  écrire à côté de ce rapport. Chaque écart ci-dessous porte donc, en guise de
  capture, la **transcription verbatim du texte réellement affiché** (relevé
  dans le DOM rendu, pas dans le YAML source) plus la description de ce que
  montre l'écran. Le profil de saisie exact est donné à chaque fois pour que le
  référent reproduise en moins d'une minute.
- **Une manipulation ratée, signalée par honnêteté** : un premier montage du
  scénario 5 a été fait en enchaînant les clics par script dans un même bloc
  synchrone ; React a groupé les mises à jour et le formulaire s'est retrouvé
  sur « Initier » + « À l'objectif » au lieu de « Optimiser » + « Au-dessus ».
  Le scénario a été **entièrement remonté à la main**, clic par clic, et c'est
  ce second montage — état du formulaire relu et vérifié avant conclusion — qui
  est rapporté ici.
- **Aucun fichier du dépôt n'a été modifié.** Seul ce rapport est créé. Rien
  n'est commité.

---

## 2. Tableau de synthèse

| # | Scénario | Verdict |
|---|---|---|
| 1 | Statine, prévention secondaire — la carte haute intensité s'affiche ; champ CK absent tant que l'intolérance est « non » | **conforme** |
| 2 | Défaut A — aucun bouton segmenté allumé sur formulaire vierge | **conforme** |
| 2b | Cascade — bloc MCG masqué sur `insuline` **après clic « Naïf d'insuline »** | **conforme** |
| 2b′ | Cascade — bloc MCG masqué sur `insuline` **formulaire vierge** | **écart** |
| 2b″ | Cascade — « Traitements en cours » disparaît sur `Traiter…` intention « Initier » | **conforme** |
| 2c | Marqueur « · à confirmer » — mesure demandée | *mesuré, voir §4 et §6* |
| 3 | Défaut B — « Poursuivre le schéma d'insuline en cours » absent du formulaire vierge (`insuline`) | **conforme** |
| 3′ | Défaut B — « Poursuivre le traitement en cours » absent du formulaire vierge (`Traiter…`) | **conforme** |
| 4 | Défaut J — « Doses non calculées : … à renseigner : Poids » puis doses chiffrées | **conforme** |
| 5 | Défaut G — aucune option ne réclame « Nature de l'intolérance » quand l'intolérance est déclarée « non » | **écart** |
| 6 | Non-régression — aucune carte repliée, carte de sécurité visible d'emblée | **conforme** |
| 7 | Effet de bord — garde de portée visible dans le « pourquoi » | *observé, voir §4* |

**Deux écarts** : un sur le scénario 2b (volet « formulaire vierge »), un sur le
scénario 5. Le défaut de production visé par le scénario 1 est bien corrigé.

---

## 3. Détail des écarts

### Écart 1 — le bloc MCG est intégralement visible sur un formulaire `insuline` vierge (scénario 2b)

**Nœud** : `Insulinothérapie du DT2 : Initier, optimiser, intensifier`

**Ce que j'ai saisi** : rien. Formulaire vierge, obtenu en sortant du nœud
(« ← Domaine : Diabète de type 2 ») puis en y revenant. État relevé avant
observation : les 29 champs de saisie vides ou décochés, **aucun** des 12
boutons segmentés porteur de `data-on`.

**Attendu (énoncé du scénario)** : « le bloc MCG (glycémie à jeun, TBR, temps en
cible, doses en cours) doit être **masqué dans les deux cas** » — c'est-à-dire
sur le formulaire vierge **et** après clic sur « Naïf d'insuline ».

**Vu** : après clic sur « Naïf d'insuline », le bloc disparaît bien — conforme.
Mais **sur le formulaire vierge, il est intégralement affiché**. Les champs
suivants sont présents et interrogeables à l'écran :

```
MCG disponible
TBR — temps sous 70 mg/dL (%)            · à confirmer
TBR sévère — temps sous 54 mg/dL (%)     · à confirmer
Coefficient de variation glycémique (%)  · à confirmer
Profil glycémique (lecture AGP)
  Hypoglycémie nocturne · Phénomène de l'aube · Excursions post-prandiales
  Stable · Hypo interprandiale
Glycémie à jeun (g/L)                    · à confirmer
Poids (kg)                               · à confirmer
Dose de basale actuelle (U/j)            · à confirmer
Dose de rapide actuelle (U/j)            · sans effet sur la reco actuelle
```

**Capture (verbatim, pied de la section)** :

> À renseigner dans cette section : Âge, HbA1c actuelle (%), HbA1c cible (%),
> DFG (mL/min/1,73 m²), TBR — temps sous 70 mg/dL (%), TBR sévère — temps sous
> 54 mg/dL (%), Coefficient de variation glycémique (%), Glycémie à jeun (g/L),
> Poids (kg), Dose de basale actuelle (U/j)

**Comptage** : **8 des 14** mentions « · à confirmer » du formulaire vierge
appartiennent à ce bloc. Après clic sur « Naïf d'insuline », il n'en reste
que 6, et le bloc entier a disparu.

**Ce que ça change à l'écran** : à l'ouverture du nœud, le praticien voit un
formulaire qui lui réclame un TBR, un coefficient de variation et une dose de
basale — pour un patient dont il n'a pas encore dit s'il prend de l'insuline.
Un patient naïf n'a ni l'un ni l'autre.

**Nature technique, pour information** : la règle d'affichage de ces champs est
`visible_si: "situation_insuline != naif"`
(`content/noeuds/diabete-type-2/insuline.yaml`, 8 occurrences). Tant que
`situation_insuline` n'est pas répondu, la condition n'est pas « fausse » et le
champ s'affiche. Ce n'est donc pas un bug d'affichage isolé mais le
**comportement par défaut d'un `visible_si` non tranché**. Je ne me prononce
pas sur le correctif : afficher-par-défaut peut être un choix délibéré (ne rien
cacher tant qu'on ne sait pas), et l'énoncé du scénario dit l'inverse. À
trancher par le référent.

---

### Écart 2 — « Nature de l'intolérance » est réclamé alors que le champ n'existe nulle part à l'écran (scénario 5, défaut G)

**Nœud** : `Traiter : initier, optimiser, intensifier`

**Ce que j'ai saisi** (formulaire neuf, obtenu en sortant du nœud puis en y
revenant ; tous les clics faits à la souris, état relu après chaque étape) :

| Champ | Valeur |
|---|---|
| Intention thérapeutique | **Optimiser (améliorer le rapport bénéfice/risque du traitement)** |
| Traitements en cours | **Metformine** seule (les 7 autres décochés) |
| HbA1c actuelle (%) | **7,8** |
| Par rapport à l'objectif fixé pour ce patient | **Au-dessus de l'objectif** |
| DFG (mL/min/1,73 m²) | **45** |
| IMC (kg/m²) | **27** |
| Section « Signaux d'alerte et tolérance » | **« Rien à signaler » cliqué** → `Intolérance à un traitement en cours` = **non**, explicitement répondu |
| Dose metformine | **laissé vide** |

Preuve que l'intolérance est bien *répondue* et pas seulement *décochée* : le
bouton « Rien à signaler » de cette section **disparaît** après le clic (3
boutons avant, 2 après), et le compteur passe de « 10 critères décisifs non
confirmés » à « 5 ».

**Attendu** : aucune option ne réclame « Nature de l'intolérance ».

**Vu** — capture verbatim du bloc ambre, en bas de l'écran :

> **EN ATTENTE — CRITÈRE À RENSEIGNER POUR TRANCHER**
> **Réduire la posologie de la metformine (fonction rénale altérée ou
> intolérance digestive)** — à renseigner : Dose metformine, **Nature de
> l'intolérance**

Recherche du champ dans tout le formulaire (partie au-dessus de « OPTIONS
APPLICABLES ») : **« Nature de l'intolérance » n'y figure pas**, sous aucune
forme — ni `input`, ni `select`, ni groupe de boutons segmentés. Le praticien
n'a aucun moyen de satisfaire cette demande.

**Portée réelle, à connaître avant d'estimer la gravité** : l'impasse est
**transitoire**. Dès que « Dose metformine » est renseignée (j'ai saisi 2000),
l'option « Réduire la posologie de la metformine » cesse d'être candidate, le
bloc « En attente » disparaît entièrement, et « Nature de l'intolérance » n'est
plus jamais mentionné. La demande sans issue n'existe donc que dans la fenêtre
où l'autre critère de l'option — celui-là bien affiché — n'est pas encore
rempli. Elle est néanmoins visible, et elle nomme un champ que l'écran ne
montre pas : c'est exactement la famille du défaut G.

**Reproduit une seconde fois** dans le scénario 6 (profil catabolique,
intolérance non répondue) : la même ligne apparaît, avec en plus « DFG » dans
la liste. Le comportement n'est donc pas propre à un profil.

---

## 4. Détail des points conformes (et ce qu'ils montrent)

### Scénario 1 — le défaut de production est corrigé

**Saisie** : Âge **62** · Maladie cardiovasculaire athéromateuse établie
**cochée** · Ancienneté du diabète **8** · Autres facteurs de risque
cardiovasculaire **2** · Diabète compliqué **non** · Dialyse **non** (les deux
confirmés par « Rien à signaler ») · Statine déjà en place **non** ·
Intolérance aux statines **Non**.

**Vu** — l'en-tête passe de « OPTIONS APPLICABLES — PROVISOIRE » à **« OPTIONS
APPLICABLES »** (plus aucun critère décisif manquant), et une carte s'affiche :

> **Statine de haute intensité — prévention secondaire (maladie athéromateuse
> établie)**
> `Recommandée` `Preuve élevée`
> Événements vasculaires majeurs RR ~0,79 par 1 mmol/L de LDL abaissé (CTT
> diabète) ; NNT ~12-20 sur 5-6 ans en prévention secondaire […]
> *Proposé parce que : Maladie cardiovasculaire athéromateuse établie*

**Champ CK** : absent du DOM tant que l'intolérance est sur « Non » (compté :
0 occurrence). Bascule sur **« Rapportee »** → le champ **apparaît**, bordure
ambre, mention « · à confirmer », et une alerte se déploie au-dessus des
résultats (« Intolérance aux statines RAPPORTÉE, non éprouvée : plus de 90 %
des symptômes musculaires… »). Retour sur **« Non »** → le champ **disparaît**
et la carte de haute intensité reste identique, sans « provisoire ».
Le cycle a été fait deux fois. Conforme sur les trois volets.

### Scénario 2 — défaut A

Sur formulaire vierge, sur les trois nœuds à boutons segmentés, **aucun bouton
n'est allumé**. Vérifié dans le DOM et non à l'œil : le bouton sélectionné porte
un attribut `data-on="true"` et un fond distinct
(`oklch(0.93 0.025 254)`, texte `oklch(0.46 0.09 254)`, graisse 600) ; sur
formulaire vierge, **aucun** des boutons ne porte cet attribut et tous partagent
le même fond neutre `oklch(0.995 0.002 240)`. Comptage : `insuline` 0/12,
`Traiter…` 0/19, `statine` 0/3, RHD Alimentation 0/…, RHD Activité 0/….

Les champs numériques affichent tous le placeholder **`—`**.

**Il n'y a aucune liste déroulante (`<select>`) dans l'application** : 0 sur les
six nœuds. Le « — » du scénario est celui du placeholder des champs numériques,
pas d'un menu déroulant. Le point est donc conforme, mais pas sur l'objet
décrit.

*À juger — voir §5.*

### Scénario 2b — la cascade

- **`insuline`, clic « Naïf d'insuline »** : le bloc MCG disparaît (les 9 champs
  listés plus haut). **Conforme.** Volet « formulaire vierge » : voir écart 1.
- **`Traiter…`, intention « Initier un traitement »** : le champ « Traitements
  en cours » (8 cases : Metformine, iSGLT2, AR GLP-1, Tirzépatide, Sulfamide,
  Gliptine, Insuline, Glinide) **disparaît**. **Conforme.**

**Mise en page** : dans les deux cas la disparition est instantanée et sans
animation ; le contenu au-dessus (bandeau, titre, chapô) ne bouge pas, le reste
remonte d'un bloc. Aucun sautillement observé, aucune barre de défilement qui
saute. Deux réserves factuelles, sans jugement :
  1. sur `Traiter…`, le titre de section **« TRAITEMENT ACTUEL ET CONTRÔLE »
     reste affiché** alors que la liste des traitements en cours vient d'en
     disparaître — il ne subsiste sous ce titre que l'HbA1c et la position vs
     objectif ;
  2. la page raccourcit d'environ 100 px : si le praticien avait fait défiler,
     sa position relative change.

### Scénario 3 — défaut B

**`insuline`, formulaire entièrement vierge.** La carte « Poursuivre le schéma
d'insuline en cours et réévaluer » **n'apparaît nulle part** — ni comme carte,
ni dans la liste d'attente, ni dans les écartées. Seul s'affiche :

> **OPTIONS APPLICABLES — PROVISOIRE**
> *Reco provisoire* — 17 critères décisifs non confirmés dans le formulaire
> ci-dessus : les mesures chiffrées y sont marquées « à confirmer », les
> drapeaux se confirment d'un clic par « Rien à signaler ». La recommandation
> peut encore changer.
>
> **EN ATTENTE — CRITÈRES À RENSEIGNER POUR TRANCHER**
> *(11 lignes)* Envisager un GLP-1… / Initier une insuline basale… / Choisir un
> analogue basal de 2ᵉ génération… / Corriger l'hypoglycémie ou la variabilité…
> / Ne pas sur-titrer la basale… / Titrer la basale… / Ajouter un GLP-1… /
> Ajouter un bolus au repas principal… / Insuline prémélangée… / Désintensifier
> / alléger le schéma… / Optimiser la répartition du basal-bolus…

**`Traiter…`, formulaire entièrement vierge.** Même constat : « Poursuivre le
traitement en cours et réévaluer » **absent**. Bloc « EN ATTENTE » de 7 lignes.

**Conforme sur les deux nœuds.** *Question ouverte au référent : §5.*

### Scénario 4 — défaut J

**Saisie** : Situation d'insulinothérapie **Naïf d'insuline** · Âge **60** ·
HbA1c actuelle **9** · HbA1c cible **7** · DFG **80** · **Poids laissé vide**.

**Vu**, dans la carte « Initier une insuline basale (en maintenant les
antidiabétiques en cours) », juste sous le paragraphe d'effet attendu, en
ambre :

> **Doses non calculées** : Dose initiale (0,1 U/kg) — à renseigner : Poids (kg)
> · Dose initiale (0,2 U/kg) — à renseigner : Poids (kg)

Le champ « Poids (kg) » du formulaire, qui portait « · sans effet sur la reco
actuelle » avant que la carte devienne applicable, bascule au même moment sur
« · à confirmer » — les deux indications sont cohérentes entre elles.

**Poids saisi (82 kg)** : la ligne devient

> **Doses indicatives** : Dose initiale (0,1 U/kg) ≈ **8 U/j** · Dose initiale
> (0,2 U/kg) ≈ **16 U/j**

La mention « Doses non calculées » disparaît (la classe CSS passe de
`option-card__calculs--en-attente` à `option-card__calculs`). **Conforme.**
*À juger : §5.*

### Scénario 6 — non-régression, rien n'est caché

**Saisie** : Intention **Intensifier** · Traitements en cours **Metformine +
Sulfamide** · HbA1c actuelle **9** · Maladie cardiovasculaire athéromateuse
établie **cochée** · Insuffisance cardiaque **cochée** · **Cétonémie cochée** ·
Âge **58**.

**Vu** : une seule carte, en haut du panneau, sans rien à déplier —

> Sous le bandeau « **À faire d'emblée — sécurité** — gestes cumulables » :
> **Insuline d'initiation (souvent transitoire — état catabolique)**
> `Recommandée` `Preuve très faible`
> Lève la glucotoxicité ; aucun bénéfice sur critère dur démontré (accord
> d'experts). Suspecter un DT1 devant une cétose / un amaigrissement rapide
> chez un sujet non obèse.
> […]
> **Contre-indications :** Cétonémie ≥ 3 mmol/L → urgence (insuline +
> hospitalisation), hors périmètre du nœud.
> *Proposé parce que : Cétonémie*

**Bouton « Autres pistes possibles (N) » : 0 occurrence** — vérifié par
recherche dans tout le DOM, sur ce profil et sur tous les autres montés pendant
la passe. **Conforme.**

Deux blocs de repli subsistent, tous deux **distincts** du repli neutralisé :
- un bloc **toujours visible**, non repliable (`decision-node__ecartees`),
  listant les options écartées par un garde-fou dur — ici trois lignes grisées :
  « Introduire un iSGLT2 … écarté : Cétonémie », « Introduire un AR GLP-1 …
  écarté : Cétonémie », « Association iSGLT2 + AR GLP-1 … écarté : Cétonémie » ;
- un bouton **« Pourquoi pas d'autres options ? »** (bascule en « Masquer les
  autres options »), qui déplie la liste des options non applicables avec leur
  condition. Il ne masque **aucune** carte applicable — vérifié sur `statine` :
  le contenu qu'il déplie est bien la liste des non-applicables.

### Scénario 7 — le garde de portée dans le « pourquoi »

Reproduit sur `statine`. **Saisie** : le profil du scénario 1, puis Intolérance
**Rapportee** et **CK = 6**.

**Vu** — la carte affichée devient « Statine indisponible (intolérance avérée ou
contre-indication) — alternatives hypolipémiantes », et sa dernière ligne est :

> *Proposé parce que : Intolérance aux statines (non / rapportée / avérée) ≠ Non
> **et** CK, en multiples de la normale (0 = non dosé) > 4 **et** Statine deja
> en place : non*

Avec CK = 2 (sous le seuil), la carte de haute intensité revient et son
« pourquoi » se réduit à : *Proposé parce que : Maladie cardiovasculaire
athéromateuse établie* — le garde n'apparaît que là où il agit.

*Observation à juger : §5, point 5.*

---

## 5. Questions ouvertes — points « à juger »

Ces cinq points sont rendus au référent médical sans arbitrage de ma part.

**1. « — » se lit-il comme « pas encore répondu » ? Le formulaire vierge
donne-t-il envie de commencer ?**
Ce que je constate : le placeholder `—` est en gris clair, dans un champ au
cadre normal ; rien ne le distingue typographiquement d'une valeur saisie sinon
la couleur. Ce qui porte l'information « non répondu », visuellement, ce n'est
pas le `—` : c'est la **barre ambre verticale à gauche du champ** plus la
mention « · à confirmer » en ambre gras. Sur `insuline` vierge, cette barre
court le long de 14 champs sur 33, en colonnes ; sur RHD Alimentation, 17 sur
26. L'écran est lisible et ordonné, mais l'entrée en matière est un formulaire
long, entièrement neutre, dont rien ne désigne le premier champ à remplir — or
sur `insuline` et `Traiter…` ce premier champ existe et commande tout le reste
(« Situation d'insulinothérapie », « Intention thérapeutique »). Il est en haut,
mais ni mis en avant, ni distingué des 30 autres.

**2. Combien de champs portent « · à confirmer » sur formulaire vierge ? Le
signal se dévalue-t-il ?**
Mesure complète en §6, point 4. Résumé : de **1 champ sur 6** (`Fixer la cible
d'HbA1c`) à **17 sur 26** (RHD Alimentation). Sur les deux nœuds les plus
lourds, `insuline` (14/33) et Alimentation (17/26), le marqueur touche entre 4
et 7 champs sur 10. Sur `Traiter…`, il n'en touche que 6 sur 28 — et c'est là
qu'il est le plus lisible. Constat factuel, sans conclusion : le marqueur est
**restreint par conception** aux champs `nombre` et aux `bool` marqués
`confirmation_requise` ; les drapeaux booléens ordinaires décisifs et non
répondus n'en portent pas (ils se confirment par « Rien à signaler »). D'où un
cas observé sur `statine` : le bandeau annonce « **1 critère décisif non
confirmé** » alors qu'**aucun champ du formulaire ne porte de marqueur** — le
praticien lit un compteur qu'aucun repère visuel ne lui permet de résoudre,
sinon le bouton « Rien à signaler ».

**3. Un écran qui ne montre que « en attente » est-il acceptable en
consultation ?**
Description exacte, `insuline` vierge : sous le titre « OPTIONS APPLICABLES —
PROVISOIRE », un premier encadré ambre pâle d'une phrase (« Reco provisoire —
17 critères décisifs non confirmés… »), puis un **second encadré ambre de
11 lignes** occupant à lui seul ~440 px de haut, chaque ligne étant un intitulé
d'option en gras suivi de la liste de ses critères manquants — jusqu'à 9 champs
énumérés sur une même ligne (« Ajouter un GLP-1 / une association fixe
d'abord »). Le nom des critères y est répété d'une ligne à l'autre :
« Situation d'insulinothérapie » apparaît **11 fois**, « HbA1c actuelle (%) »
7 fois. Il n'y a **aucune phrase d'accueil** expliquant pourquoi rien n'est
proposé, ni aucun renvoi cliquable vers le champ à remplir. Sur `Traiter…`
vierge, même structure, 7 lignes. Sur `statine` vierge, 1 seule ligne — et là,
l'écran est immédiatement lisible.

**4. La couleur ambre de « Doses non calculées » est-elle lisible ? Faudrait-il
un lien cliquable vers le champ ?**
Constat : oui, c'est **exactement le même registre ambre** que « · à
confirmer » — le CSS le dit explicitement (`DecisionNodeScreen.css` : « Registre
AMBRE (mêmes tokens `--c-attention*` que le marqueur "à confirmer" du
formulaire »). Dans la carte, la ligne est en petit corps, immédiatement sous le
paragraphe d'effet attendu qui est lui en **teal gras** — le contraste de
saillance joue contre elle : l'œil va au bloc coloré du dessus. Elle n'est pas
cliquable ; le champ « Poids (kg) » se trouve, sur `insuline`, à environ
**deux écrans plus haut**. Je ne tranche pas ; je signale que la distance
écran entre la mention et le champ qu'elle désigne est réelle.

**5. Le garde de portée dans le « pourquoi » : information utile ou bruit ?**
Ce qui est affiché n'est pas une phrase mais **la condition, rendue presque
telle quelle** : « Intolérance aux statines (non / rapportée / avérée) ≠ Non et
CK, en multiples de la normale (0 = non dosé) > 4 et Statine deja en place :
non ». Trois observations factuelles, à l'attention du référent :
  - le libellé complet du critère est répété entre parenthèses à l'intérieur de
    la condition, ce qui l'allonge (« (non / rapportée / avérée) »,
    « (0 = non dosé) ») ;
  - la comparaison est rendue en notation symbolique (`≠`, `>`), pas en français ;
  - **le seuil affiché est « > 4 » alors que le texte de la même carte dit
    « les CK dépassent 5 fois la normale »** (voir §7, point 1).

---

## 6. Mesures (demande complémentaire)

Profil de référence pour les mesures 1 à 3 — **intensification banale**, nœud
`Traiter : initier, optimiser, intensifier` :

| Champ | Valeur |
|---|---|
| Intention thérapeutique | Intensifier (renforcer le contrôle glycémique) |
| Traitements en cours | Metformine seule |
| HbA1c actuelle (%) | 8,5 |
| Par rapport à l'objectif | Au-dessus de l'objectif |
| DFG (mL/min/1,73 m²) | 80 |
| Albuminurie | Normoalbuminurie |
| IMC (kg/m²) | 27 |
| Comorbidités | aucune (MCV non, IC non) |
| Sections « Ce qui oriente le choix » et « Signaux d'alerte » | « Rien à signaler » cliqué |

État final : « Reco provisoire — 3 critères décisifs non confirmés »
(les 3 restants sont dans « Terrain et préférences », tous marqués « sans effet
sur la reco actuelle » sauf « Préférence vis-à-vis de l'injectable »).

### Mesure 1 — nombre de cartes

**5 cartes**, réparties en trois groupes :

| Groupe | Cartes |
|---|---|
| *Socle du traitement — gestes cumulables* | Metformine (socle du traitement) — instaurer ou poursuivre |
| *Agent à ajouter — en choisir un* / « À ÉGALITÉ — MÊME NIVEAU DE PRIORITÉ » | Introduire un iSGLT2 · Introduire un AR GLP-1 |
| « À ÉGALITÉ — MÊME NIVEAU DE PRIORITÉ » | Gliptine (sitagliptine) — bas rang · Sulfamide (gliclazide MR ou glimépiride) — bas rang |

Aucun bloc « En attente », aucune option écartée affichée sur ce profil.

### Mesure 2 — hauteur d'une carte, en écrans

Mesuré par `getBoundingClientRect()` sur `.option-card`, aux deux largeurs.

| Carte | 966 × 910 px | | 431 × 934 px | |
|---|---|---|---|---|
| | hauteur | écrans | hauteur | écrans |
| Metformine (socle) | 346 px | **0,38** | 664 px | **0,71** |
| Introduire un iSGLT2 | 724 px | **0,80** | 945 px | **1,01** |
| Introduire un AR GLP-1 | 744 px | **0,82** | 993 px | **1,06** |
| Gliptine (sitagliptine) | 695 px | **0,76** | 944 px | **1,01** |
| Sulfamide | 644 px | **0,71** | 807 px | **0,86** |

**Page entière** (formulaire + résultats) : **4 241 px = 4,7 écrans** en large,
**7 922 px = 8,5 écrans** en étroit.

Lecture en langage de défilement, largeur étroite : **il faut un défilement
plein écran, parfois un peu plus, pour passer d'une carte à la suivante**
(4 cartes sur 5 entre 0,86 et 1,06 écran). En largeur `desktop`, les cartes
« agent à ajouter » se placent **côte à côte par paires** dans un cadre
« À égalité — même niveau de priorité » : on en voit deux à la fois, mais chaque
paire fait encore ~0,8 écran de haut, et les quatre cartes de choix occupent
alors ~1,7 écran à elles seules.

### Mesure 3 — les contre-indications, ce qui restera visible

**Les 5 cartes sur 5 portent un bloc « Contre-indications : ».**

| Carte | Longueur | Hauteur (966 px) | Hauteur (431 px) | Part de la carte |
|---|---|---|---|---|
| Metformine (socle) | 241 car. | 31 px | 91 px | 9 % → **14 %** |
| Introduire un iSGLT2 | 387 car. | 106 px | 151 px | 15 % → **16 %** |
| Introduire un AR GLP-1 | 333 car. | 91 px | 136 px | 12 % → **14 %** |
| Gliptine (sitagliptine) | 370 car. | 106 px | 166 px | 15 % → **18 %** |
| Sulfamide | 238 car. | 76 px | 91 px | 12 % → **11 %** |

Longueur moyenne **314 caractères**, soit 2 à 4 phrases. Exemple intégral, la
plus longue :

> **Contre-indications :** Ne pas initier si DFG < 20 (poursuivre jusqu'à la
> dialyse si déjà en cours — KDIGO 2024). · Infections génito-urinaires
> récidivantes ; antécédent de gangrène de Fournier ; prudence si artériopathie
> évoluée / amputation (signal canagliflozine). · En cas d'IC avec saxagliptine
> en cours : arrêter la saxagliptine (signal SAVOR), ne pas se contenter
> d'ajouter l'iSGLT2.

**Ce que ça dit de l'allègement prévu.** Sur ce profil, le bloc à conserver
occupe **11 à 18 % de la hauteur de carte**. Les autres éléments à conserver
sont ici **absents** : 0 alerte d'option, 0 ligne « doses non calculées » sur ce
profil. En y ajoutant ce qui reste nécessairement (titre, badges `Recommandée` /
niveau de preuve, ligne « Proposé parce que »), une carte allégée devrait tomber
autour de 25-35 % de sa hauteur actuelle — soit, en largeur étroite, d'environ
**1 écran à environ 0,3 écran** par carte. **L'allègement porte donc bien sur
l'essentiel du volume** : ce sont les blocs « Avantages » / « Inconvénients »
(3 à 6 puces longues par carte) et le paragraphe d'effet attendu qui font la
hauteur, pas les contre-indications. La crainte formulée dans la demande — « si
elles occupent déjà l'essentiel de la carte, l'allègement ne servira à rien » —
**n'est pas vérifiée sur ce profil**.

*Réserve, à ne pas négliger* : ce profil est le plus favorable au raisonnement
ci-dessus (aucune comorbidité, donc aucune alerte d'option déclenchée). Sur le
profil catabolique du scénario 6, la carte affichée porte **1 contre-indication
courte** (98 caractères) mais l'écran comporte en plus le bloc « En attente »
(9 lignes) et 3 lignes d'options écartées, qui ne sont pas dans la carte et ne
seront donc pas allégés. Le gain net à l'écran sera moindre sur ces profils-là.

### Mesure 4 — « · à confirmer » sur formulaire vierge, nœud par nœud

Comptage exact des éléments `.criteria-form__field-todo`, sur formulaire vierge
obtenu par sortie/retour dans le nœud. « Champs » = `input` + `select` + groupes
de boutons segmentés (`[role=group]`).

| Nœud | « · à confirmer » | Champs | Part |
|---|---|---|---|
| Fixer la cible d'HbA1c | **1** | 6 | 17 % |
| Traiter : initier, optimiser, intensifier | **6** | 28 | 21 % |
| RHD — Activité physique | **6** | 21 | 29 % |
| Prescrire une statine dans le DT2 | **5** | 9 | 56 % |
| Insulinothérapie du DT2 | **14** | 33 | 42 % |
| RHD — Alimentation | **17** | 26 | 65 % |

Détail des champs marqués, pour les deux nœuds les plus chargés :

- **`insuline` (14)** : Situation d'insulinothérapie, Âge, HbA1c actuelle,
  HbA1c cible, DFG, Espérance de vie, Risque hypoglycémique du schéma,
  Préférence vis-à-vis de l'injectable, TBR, TBR sévère, Coefficient de
  variation glycémique, Glycémie à jeun, Poids, Dose de basale actuelle.
  **8 de ces 14 disparaissent** dès qu'on clique « Naïf d'insuline » (cf.
  écart 1) : il n'en reste alors que 6.
- **RHD Alimentation (17)** : Frequence boissons sucrees, Frequence
  ultratransformes, Frequence restauration rapide, Matiere grasse cuisson,
  Regularite repas, Frequence grignotage, Acces alimentation, Frequence fruits a
  coque, Frequence legumineuses, Frequence poisson, Frequence viande rouge
  charcuterie, Signe restriction puis craquage, Signe manger cache ou
  culpabilite, Signe antecedent regime restrictif, Difficulte estimation
  portions, Alimentation emotionnelle, Consommation vin.

### Capture pleine page de l'écran de mesure

Le navigateur intégré ne rend pas de capture pleine page en un seul fichier et
ne peut rien écrire sur disque (cf. §1). L'écran a été parcouru et capturé en
**5 vues successives** couvrant les 4,7 écrans, dont voici le contenu dans
l'ordre :

1. bandeau + titre + chapô + section « Intention thérapeutique » (segment
   « Intensifier » allumé) + « Traitement actuel et contrôle » (Metformine
   cochée, HbA1c 8,5, « Au-dessus de l'objectif » allumé) ;
2. « Ce qui oriente le choix » (DFG 80, Normoalbuminurie, IMC 27) + « Signaux
   d'alerte et tolérance » (6 cases décochées) + « Terrain et préférences » ;
3. fin de la carte Metformine (contre-indications + « Proposé parce que ») puis
   bandeau « Agent à ajouter — en choisir un », cadre « À ÉGALITÉ — MÊME NIVEAU
   DE PRIORITÉ », **cartes iSGLT2 et AR GLP-1 côte à côte** ;
4. suite des deux mêmes cartes (Inconvénients + Contre-indications + « Proposé
   parce que ») puis second cadre « À ÉGALITÉ », cartes Gliptine et Sulfamide
   côte à côte ;
5. fin des cartes Gliptine et Sulfamide + bouton « Pourquoi pas d'autres
   options ? » + « Déplier l'argumentaire » + pied de page.

Pour reproduire la capture pleine page : le profil est intégralement donné en
tête du §6, et la page se remonte en moins d'une minute.

---

## 7. Hors périmètre — ce que j'ai remarqué en passant

**1. Le seuil de CK affiché contredit le texte de la même carte.** Sur
`statine`, la condition appliquée est `CK_x_normale > 4` (visible à l'écran :
« CK, en multiples de la normale (0 = non dosé) **> 4** », et l'option écartée
s'intitule « Interrompre la statine 4 à 6 semaines et réévaluer (**CK au-dessus
de 4 fois la normale**) »). Mais le texte de justification affiché dans la carte
« Statine indisponible » dit :

> Cette carte est atteinte parce que **les CK dépassent 5 fois la normale**
> AVANT toute initiation — ce qui, dans la recommandation française 2026, est
> une contre-indication à la statine.

… et le chapô du nœud, lui aussi affiché à l'écran, dit « la contre-indication
biologique par des **CK > 5 N** avant initiation ». Le YAML porte trace d'un
arbitrage référent du 2026-07-27 tranchant explicitement pour **4 N** (source
NHS/AAC, « seuil le plus bas donc le plus prudent »). Le seuil appliqué semble
donc être le bon, mais **deux textes visibles à l'écran annoncent encore 5 N**.
Je ne réécris rien : c'est du contenu clinique, il revient au référent.

**2. Les libellés des deux nœuds RHD sont sans accents et en style
identifiant.** À l'écran, sur Alimentation : « Frequence boissons sucrees »,
« Frequence ultratransformes », « Matiere grasse cuisson », « Regularite
repas », « Acces alimentation », « Frequence fruits a coque », « Signe manger
cache ou culpabilite », « Difficulte estimation portions » ; les valeurs de même :
« Jamais / Occasionnel / **Frequent** / Quotidien ». Sur Activité physique :
« Frequence activite structuree », « Duree seance », « Mode deplacement courts
trajets », « Temps assis quotidien ». Ce sont visiblement les noms de critères
affichés tels quels faute de libellé humain. Les cinq autres nœuds, eux, ont des
libellés rédigés et accentués.

**3. Même chose, plus ponctuellement, sur `statine`** : la case « Statine
**deja** en place » (sans accents) et les valeurs du segment
« **Rapportee** / **Averee** » — alors que le libellé du champ juste au-dessus
écrit correctement « Intolérance aux statines (non / **rapportée** /
**avérée**) ». L'incohérence est visible d'un seul coup d'œil, les deux
orthographes étant à trois lignes l'une de l'autre.

**4. Le compteur « N critères décisifs non confirmés » peut être insoluble à
l'écran.** Reproduit sur `statine`, profil du scénario 1 avant le clic « Rien à
signaler » : le bandeau annonce « **1 critère décisif non confirmé** » alors
qu'**aucun champ ne porte de marqueur « à confirmer »** (le critère restant est
un drapeau booléen ordinaire, exclu du marqueur par conception). Le praticien
lit un compteur sans repère associé. Le bandeau explique bien que « les drapeaux
se confirment d'un clic par "Rien à signaler" », mais ne dit pas **lequel**.

**5. Les boutons segmentés n'ont pas d'état accessible.** L'élément sélectionné
est marqué par un attribut `data-on="true"` et un style ; **`aria-pressed` /
`aria-checked` sont absents** (vérifié : `getAttribute('aria-pressed')` renvoie
`null` sur les trois segments d'`intolerance_statine`, sélectionné compris). Un
lecteur d'écran ne restitue donc pas quelle valeur est retenue. Le groupe porte
bien `role="group"` et son libellé. Point d'accessibilité, pas de sécurité
clinique — mais il touche le même invariant que le lot 1 : ce que l'écran
affirme doit être ce que le moteur croit, y compris pour qui ne voit pas
l'écran.

**6. Sur `statine`, une intolérance « rapportée » n'apparaît pas dans le
"pourquoi" de la carte proposée.** Profil du scénario 1 avec Intolérance
= **Rapportee** et CK = 2 : la carte « Statine de haute intensité — prévention
secondaire » s'affiche, badge `Recommandée`, et son « Proposé parce que » se
limite à « Maladie cardiovasculaire athéromateuse établie ». L'intolérance
rapportée est bien traitée — une alerte détaillée s'affiche au-dessus des
résultats, et elle est cliniquement argumentée (réintroduction, changement de
molécule) — mais elle **ne figure pas dans la justification de la carte**. Je ne
sais pas si c'est voulu (l'alerte porte l'information, la carte porte la
décision) ou si c'est une omission ; **je signale sans trancher, faute de
compétence pour juger si le rapprochement est cliniquement nécessaire à
l'écran.**
