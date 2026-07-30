# Recette « praticien naïf » — passe du 2026-07-30 (serveur de dev local)

> Fichier témoin (non modifié depuis le premier clic) :
> [`vignettes-praticien-naif-2026-07-30.md`](vignettes-praticien-naif-2026-07-30.md).
> Passe précédente comparée : `recette-praticien-naif-2026-07-28.md`.

| | |
| --- | --- |
| **URL** | `http://localhost:50375` (dev Vite ; le port 5174 de `.claude/launch.json` était occupé, autoPort a assigné 50375) |
| **Commit** | `cf1c780` — *docs: consolide P7 (SA1/SB1 faits, T-048 obsolète) + purge TASKS.md* (2026-07-30 08:40 +0200) |
| **Heure de début** | 2026-07-30, 09h40 |
| **Auteur** | médecin généraliste, cabinet de groupe urbain, ~25 patients/jour, 15 min/consultation, pas de diabétologue à moins de 4 mois |
| **État du plan P7 au moment de la passe** | SA1 `[x]`, SB1 `[x]`, **SA2 `[ ]` (validité HbA1c — non livrée)**, S2 `[ ]` |

**Convention de comptage.** Une « action » = un clic OU un champ tapé. Le compte part de l'écran
« Aide à la décision → Diabète de type 2 » déjà ouvert (2 clics d'entrée depuis l'accueil, comptés
une fois ici et pas dans chaque vignette). Les actions purement exploratoires (déplier
l'argumentaire, « Pourquoi pas d'autres options ? ») sont comptées à part.

---

## N1 — Le diabète tout neuf, sans rien autour (M. Ferreira, 46 ans)

### Rappel du témoin

**Histoire.** M. Ferreira, 46 ans, technicien de maintenance ascenseurs. Découverte sur bilan
systématique : HbA1c 7,2 % puis 7,3 %. IMC 28,4, tour de taille 101 cm. TA 134/82 non traitée.
Non-fumeur. DFG 96. LDL 1,18. A/C 6 mg/g. **Aucun traitement en cours.** Horaires postés,
mange à la cantine.

**Ma question.** Metformine tout de suite, ou trois mois de RHD seules et je recontrôle ? Et si
metformine : quelle dose, quelle titration ?

**Réponse que j'attends.** Metformine d'emblée **avec** les RHD, titration progressive. Pas de
statine à 46 ans avec ce profil. Et une phrase disant que les RHD ne sont pas une alternative à
la metformine mais un socle qui l'accompagne.

**Incertitude.** Très faible. Le patient le plus banal de ma journée.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1 (« Traiter : initier, optimiser, intensifier »).
- **Actions jusqu'à une réponse définitive** : **11**.
  1. clic « Traiter : initier, optimiser, intensifier »
  2. clic « Initier un traitement »
  3. clic « Suivant : Traitement actuel et contrôle → »
  4. saisie « HbA1c actuelle (%) » = 7.3
  5. clic « Au-dessus de l'objectif »
  6. clic « Suivant : Ce qui oriente le choix → »
  7. saisie « DFG » = 96
  8. clic « Normoalbuminurie »
  9. saisie « IMC » = 28.4
  10. clic « Suivant : Signaux d'alerte et tolérance → »
  11. clic « **Rien à signaler** »
- **Actions exploratoires supplémentaires** : 3 (déplier « ⚠ 1 contre-indication… », « Pourquoi
  pas d'autres options ? », « Déplier l'argumentaire »).
- **Temps** : ~2 min 30 avec le dossier sous les yeux.

**Bon point immédiat.** Le bouton « **Rien à signaler** » solde d'un clic les quatre drapeaux de la
section « Signaux d'alerte » et fait passer la reco de PROVISOIRE à définitive. C'est exactement le
geste d'un généraliste pressé ; c'est le meilleur détail d'ergonomie que j'aie vu de la passe.

**Bon point n°2.** Le formulaire **rétrécit quand on répond** : dès « Initier un traitement » coché,
la section « Terrain et préférences » passe de « 1 à confirmer » à rien du tout, et « Signaux
d'alerte » de 4 à 3. On ne me demande pas ce qui ne sert pas à ce patient.

**Champs que je voulais renseigner et qui n'existent pas** :
- **le poids et la taille** (je n'ai que l'IMC calculé à saisir — donc je le calcule de tête ou
  j'ouvre une calculette : c'est du travail rendu au praticien) ;
- **l'âge** — nulle part sur ce nœud, alors que je l'aurais donné spontanément ;
- **le tour de taille**, **la TA**, **le LDL**, **le tabac** : absents. Acceptable pour ce nœud-ci,
  mais ça veut dire que rien de ce que je viens de lire dans le dossier ne sert.

**Surprises.**
- Le bloc jaune « **EN ATTENTE — CRITÈRES À RENSEIGNER POUR TRANCHER** » s'affiche en haut à droite
  **complètement vide** tant qu'aucune option n'est en attente : un cartouche de couleur, un titre,
  et rien dessous. Sur un écran clinique un encadré coloré vide se lit comme un bug.
- La page **ne défile pas toute seule** vers la réponse quand elle apparaît : la carte
  « OPTIONS APPLICABLES » se construit dans la colonne de droite, hors du champ de vision si on est
  descendu dans le formulaire. J'ai dû aller la chercher.

### Réponse obtenue, verbatim

> **OPTIONS APPLICABLES**
> **Socle du traitement — gestes cumulables**
> **Metformine (socle du traitement) — instaurer ou poursuivre**
> `Recommandation officielle (France)` · `Preuve faible`
> Proposé parce que : Socle maintenu par la recommandation officielle, quelles que soient les
> comorbidités.
> ⚠ 1 contre-indication, effet attendu et plus

Déplié :

> Contre-indications : CONTRE‑INDIQUÉE si DFG < 30 (RCP ANSM) ; à écarter en insuffisance cardiaque
> décompensée, IDM récent, insuffisance hépatique, alcoolisme. À suspendre : déshydratation, sepsis,
> jeûne, produit de contraste iodé, chirurgie.
> Pas de bénéfice sur critère dur démontré vs placebo (Griffin 2017, Boussageon 2012 NS). Socle par
> tolérance / sécurité / coût / recul.
> **Avantages** • Reco officielle française maintenue en 1re intention (coût, recul, tolérance,
> absence d'hypoglycémie) ; suffit SEULE sans indication d'agent à bénéfice d'organe.
> **Inconvénients** • Bénéfice propre sur critère dur de preuve faible (ne pas afficher « bénéfice CV
> prouvé »). • EXCEPTION à la poursuite — intolérance digestive (surtout si un AR GLP‑1 est aussi en
> cours) : la metformine étant l'agent au bénéfice le plus faible, sa réduction / son arrêt est à
> privilégier (cf. option « réduire l'agent mal toléré » et alerte).

**Une seule carte.** Rien d'autre.

### Test des 20 secondes

Écrit sans relire l'écran :

> « Je prescris de la metformine. Je surveille… la fonction rénale je suppose. Je ne dois pas la
> donner si le DFG est sous 30 et je dois l'arrêter s'il se déshydrate ou s'il passe un scanner
> avec iode. Preuve faible. »

**Écart avec l'écran réel** : je n'ai retenu **aucune dose** (l'écran n'en donne aucune), aucune
notion de titration, et je n'ai rien retenu sur les RHD (l'écran n'en parle pas non plus). J'ai en
revanche bien retenu la liste des situations de suspension — elle est bien écrite. Le « ne pas
afficher « bénéfice CV prouvé » » que j'ai lu en diagonale m'a fait tiquer : c'est une consigne
adressée au rédacteur du contenu, pas au médecin, et elle est affichée telle quelle dans les
inconvénients.

### L'écart

**Ce que l'outil m'apporte réellement.** Une confirmation nette et rapide : metformine, seule,
sans ajouter d'agent à bénéfice d'organe chez ce patient sans comorbidité — avec la phrase qui me
manquait (« suffit SEULE sans indication d'agent à bénéfice d'organe »). Et la liste de suspension
(iode, jeûne, sepsis) que j'oublie de dire une fois sur deux.

**Ce qu'il ne dit pas et que j'attendais.**
1. **Aucune dose, aucune titration.** « Instaurer ou poursuivre » n'est pas une prescription. Je
   sais faire, mais alors l'outil ne m'a pas économisé la seule chose qui coûtait.
2. **Ma question « RHD seules 3 mois ? » n'a pas de réponse à l'écran.** La réponse existe dans le
   moteur (l'option « Aucun traitement médicamenteux — mesures hygiéno-diététiques seules » est
   conditionnée à « HbA1c à la cible ») mais il faut ouvrir « Pourquoi pas d'autres options ? » et
   lire une expression booléenne pour la trouver. À l'écran principal, l'outil ne dit ni oui ni non.
3. **Aucun lien vers le module RHD** alors qu'il existe et qu'il est à deux clics. Le socle
   « mesures d'hygiène de vie » est cité dans le périmètre du nœud et nulle part ailleurs.
4. Rien sur la statine — normal, c'est un autre nœud, mais personne ne me le dit.

**Défaut n°1 rencontré — « Pourquoi pas d'autres options ? » déverse de la logique brute.**
Reproduction exacte : N1, écran « Traiter », clic sur « Pourquoi pas d'autres options ? ».
On obtient **27 lignes** de ce type, verbatim :

> Envisager l'insuline (palette non‑insulinique épuisée — **ajustement fin → nœud E**) : iSGLT2
> inutilisable (déjà en cours, DFG < 20 ou infections génito-urinaires récidivantes) **et** AR GLP-1
> inutilisable (déjà en cours, dénutrition ou IMC < 22)

> Introduire un AR GLP‑1 (…) : Maladie cardiovasculaire athéromateuse établie **ou** IMC (kg/m²) ≥ 30
> **ou** **Palette glycémique ouverte (place pour un agent de contrôle en plus)** **ou** Remplacement
> d'un agent sans bénéfice sur critère dur (gliptine, sulfamide) **ou** **DFG (mL/min/1,73 m²) > 0 et
> DFG (mL/min/1,73 m²) < 30** et HbA1c à la cible : non

« **→ nœud E** » est du jargon de projet affiché à un médecin. « **DFG > 0 et DFG < 30** » est une
garde technique interne (protection contre un champ non saisi) exposée telle quelle comme si c'était
un critère clinique. « **Palette glycémique ouverte** » est un nom de variable interne. C'est
illisible et, pire, ça donne l'impression que l'outil raisonne sur des choses qui n'existent pas
en clinique.

**Défaut n°2 — l'argumentaire contient les notes de travail du projet.**
Reproduction : clic « Déplier l'argumentaire », premier paragraphe :

> …AJOUTÉ le 2026-07-27, volet RÉNAL (**collecte + red-team**, sources primaires rouvertes une à une)
> … la sitagliptine 25 mg n'étant pas commercialisée en France, **VÉRIFIÉ par le référent le
> 2026-07-27** … ⚠ KDIGO 2022 : NE PORTE AUCUN chiffre sur les sulfamides (**vérifié deux fois, dont
> la Figure 23**) — l'attribution « convention KDIGO » a été **retirée du nœud**.

« red-team », « le référent », « retirée du nœud », les dates de session : c'est **exactement** le
défaut de jargon signalé le 2026-07-28, et il est intact, mot pour mot, au 2026-07-30.

### En vraie consultation ?

**Oui, une fois** — pour le confort d'être conforté en 2 minutes sur un patient où j'hésitais entre
« RHD 3 mois » et « metformine tout de suite ». Mais **pas deux fois** : la deuxième fois je saurai
déjà que la réponse est « metformine seule » et l'outil ne m'apportera plus rien, puisqu'il ne
descend pas à la dose. Je ne déplierais **jamais** « Pourquoi pas d'autres options ? » devant un
patient : c'est de la logique de programme.

---

## Intermède — test du bouton « Nouveau patient » (défaut phare du 2026-07-28)

Testé **immédiatement après N1**, formulaire « Traiter » entièrement rempli (HbA1c 7.3, DFG 96,
IMC 28.4, intention « Initier », drapeaux soldés).

**Ce qui se passe.** Clic sur « Nouveau patient » (2 fois, pour être sûr) : **rien ne bouge à
l'écran**. Le formulaire reste intégralement rempli, la carte metformine reste affichée.

**Cause identifiée.** La console du navigateur montre que le bouton déclenche une boîte de dialogue
**native** `confirm()` :

> `Page dialog suppressed (confirm): "Vider la session en cours et repartir avec un nouveau patient ?
> Les valeurs saisies non enregistrées seront perdues."`

Mon navigateur d'audit désactive les dialogues natifs et a renvoyé `false` — d'où le non-effet.

**Conclusions, honnêtement séparées :**

1. **Progrès réel depuis le 2026-07-28** : le bouton n'est plus inerte, il est câblé et il **demande
   confirmation** avant de vider. Le libellé de la question est correct et compréhensible.
2. **Le comportement de remise à zéro lui-même : NON REPRODUIT.** Je n'ai pas pu confirmer le
   dialogue dans cet environnement (tentative de neutralisation du `confirm()` refusée par ma propre
   politique d'outillage). **Je ne peux donc ni confirmer ni infirmer que le formulaire se vide
   réellement, ni que la mémoire de session partagée est purgée.** À vérifier par un humain devant
   l'écran — point de recette resté ouvert.
3. **Défaut de conception, lui bien constaté** : utiliser un `window.confirm()` natif pour un geste
   central d'une app clinique est fragile. Chrome propose « Empêcher cette page de créer des boîtes
   de dialogue supplémentaires » dès la 2e occurrence ; à partir de là le bouton redevient
   **silencieusement inerte**, exactement le bug du 2026-07-28, sans aucun signal pour l'utilisateur.
   Un médecin qui coche cette case entre deux patients contaminera le suivant sans le savoir.

**Contamination inter-patients, mesurée autrement.** J'ai enchaîné N1 (nœud « Traiter », HbA1c 7,3)
puis N2 (nœud « Fixer la cible ») par « ← Domaine », **sans** passer par « Nouveau patient » :
le nœud « Fixer la cible » s'est ouvert **entièrement vierge**. Aucune fuite observée sur ce
couple de nœuds. (Le partage voulu HbA1c actuelle/cible entre « Traiter » et « Insulinothérapie »
est testé en N10/N11.)

---

## N2 — La cible, et rien que la cible (Mme Lantier, 59 ans)

### Rappel du témoin

**Histoire.** Mme Lantier, 59 ans, professeure des écoles. DT2 depuis 7 ans, metformine 1000×2,
HbA1c 7,4 % stable. IMC 27,1. DFG 84. Pas d'ATCD CV, pas de rétinopathie, pas d'albuminurie.
Jamais d'hypoglycémie. Autonome, active, court 5 km le dimanche.

**Ma question.** Quelle cible d'HbA1c ? Le confrère précédent visait « moins de 6,5 % » et elle a
compris que 7,4 % était un échec.

**Réponse que j'attends.** Une cible ≤ 7 %, et une phrase disant que 7,4 % n'est pas un désastre.

**Incertitude.** Faible sur le fond, moyenne sur le chiffre à annoncer.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1 (« Fixer la cible d'HbA1c ») + 1 clic de sortie du nœud précédent.
- **Actions** : **6** au total, dont 1 de navigation.
  1. clic « ← Domaine : Diabète de type 2 » (sortie de N1)
  2. clic « Fixer la cible d'HbA1c »
  3. saisie « Âge » = 59
  4. saisie « Ancienneté du diabète (ans) » = 7
  5. clic « Rien à signaler » (solde Fragilité + Antécédent CV + Comorbidité grave)
  6. clic « Longue » (Espérance de vie)
- **Actions exploratoires** : 2.
- **Temps** : ~45 secondes. **C'est le nœud le plus rapide de la passe.**

**Champs voulus et absents** : **l'HbA1c actuelle n'est pas demandée**. Ce nœud fixe une cible dans
l'absolu et ne la confronte jamais au chiffre du patient. C'est cohérent avec son titre, mais
**la moitié de ma question reste sans réponse** : je repars avec « ≤ 7 % » et toujours pas de quoi
dire à Mme Lantier si 7,4 % est un échec.

**Surprise n°1 — un champ décisif annoncé comme sans effet.** À l'ouverture du nœud, avant toute
saisie :

> Âge **· sans effet sur la reco actuelle**
> Ancienneté du diabète (ans) **· sans effet sur la reco actuelle**

Or la liste des options écartées montre : « **Cible ~6,5 % (6,5–7 %) : Ancienneté du diabète (ans)
< 5** ». L'ancienneté est **le seul critère** qui fait basculer vers la cible serrée — et l'écran
me dit, à vide, qu'elle est sans effet. Un praticien pressé saute le champ et perd l'option.
Reproduction : ouvrir « Fixer la cible d'HbA1c », ne rien saisir, lire les deux mentions.
(Confirmé en négatif plus loin, vignette N13b.)

**Surprise n°2 — la mention « Suggestion auto » ne suggère rien.** Sous les trois boutons
d'espérance de vie, une ligne en italique : « Suggestion auto (âge, fragilité, comorbidité grave,
antécédent CV) — à valider ». Avec âge = 59 et les trois drapeaux soldés, **aucune valeur n'est
proposée** : les trois boutons restent gris, le bandeau « à confirmer » reste jaune. Le libellé
promet plus que l'écran ne fait.

**Surprise n°3 — le bloc « EN ATTENTE — CRITÈRE À RENSEIGNER POUR TRANCHER » est vide.** Encadré
jaune, titre en capitales, **rien dessous** : il ne nomme pas le critère manquant (ici l'espérance
de vie). Même cartouche vide qu'en N1. Sur le nœud « Traiter », il sait pourtant nommer le champ
manquant (« À renseigner dans cette section : … ») ; ici non.

### Réponse obtenue, verbatim

> **OPTIONS APPLICABLES**
> **Cible ≤ 7 %**
> `Recommandée` · `Preuve faible`
> Proposé parce que : Option par défaut : retenue en l'absence de toute autre option plus spécifique
> applicable.
>
> **Effet attendu, avantages et inconvénients** (déplié)
> Réduction de l'IDM non fatal (méta-analyses), pas de la mortalité ; bénéfice absolu modeste.
> **Avantages** • Compromis pour la majorité des patients.
> **Inconvénients** • Bénéfice macrovasculaire/mortalité non démontré par le seul serrage glycémique.

Et, dans « Pourquoi pas d'autres options ? » (3 lignes seulement, lisibles celles-là) :

> Cible < 9 % : Espérance de vie = Limitée
> Cible ≤ 8 % : Fragilité ou Comorbidité grave ou Espérance de vie = Limitée ou Antécédent cardiovasculaire
> Cible ~6,5 % (6,5–7 %) : Ancienneté du diabète (ans) < 5

### Test des 20 secondes

Écrit sans relire :

> « Cible 7 %. Preuve faible. Ça réduit l'infarctus non fatal mais pas la mortalité, et le bénéfice
> absolu est petit. »

**Écart** : j'ai retenu l'essentiel, et surtout **le bon argument à donner à la patiente** (« on
baisse l'infarctus, pas la mortalité, le gain est modeste ») — précisément ce qu'il me fallait pour
désamorcer le « moins de 6,5 % » du confrère. Bon score. En revanche je n'ai **rien** retenu du
*pourquoi elle* : la justification affichée est « Option par défaut : retenue en l'absence de toute
autre option plus spécifique applicable », qui est une phrase de moteur, pas une phrase de médecin.
Elle ne me dit pas « parce qu'elle est autonome, sans antécédent CV, espérance de vie longue » — ce
que j'aurais pu répéter au patient.

### L'écart

**Ce que l'outil m'apporte.** En 45 secondes, une cible chiffrée **et son argument EBM**, avec la
nuance honnête (« pas de bénéfice sur la mortalité »). Meilleur rapport temps/valeur de la passe.
Les cibles alternatives, affichées avec leur condition en une ligne chacune, sont lisibles et je
vois d'un coup d'œil **ce qui ferait bouger la cible** — c'est exactement le raisonnement que je
fais en tête.

**Ce qu'il ne dit pas.**
- Pas de confrontation avec l'HbA1c réelle : « ≤ 7 % » sans dire ce qu'on fait à 7,4 %.
- La justification est générique (« option par défaut ») là où les trois options écartées ont, elles,
  une condition explicite. **La carte retenue est la seule sans motif clinique nommé.**
- Rien sur le délai de réévaluation.
- Aucune définition de « Longue / Intermédiaire / Limitée » pour l'espérance de vie.

### En vraie consultation ?

**Oui, sans hésiter, et de façon répétée.** C'est le seul nœud que j'ouvrirais spontanément
plusieurs fois par semaine. Le seul champ où je bute est « Espérance de vie » : la question est
brutale et rien ne dit ce qui sépare « Longue » d'« Intermédiaire ».

---

## ⚠ DÉFAUT MAJEUR découvert entre N2 et N3 — sortir d'un nœud et y revenir NE réinitialise PAS

**C'est le défaut le plus grave de la passe, et il contredit le comportement supposé.**

**Reproduction exacte** (3 clics, reproductible à volonté) :

1. Ouvrir « Fixer la cible d'HbA1c », saisir Âge = 59, Ancienneté = 7, cliquer « Rien à signaler »,
   cliquer « Longue ». → l'écran affiche « **Cible ≤ 7 %** ».
2. Cliquer « **← Domaine : Diabète de type 2** » (je change de patient).
3. Re-cliquer « Fixer la cible d'HbA1c ».

**Résultat observé.** Le formulaire revient **intégralement pré-rempli** avec les valeurs du patient
précédent, et **la recommandation du patient précédent est déjà affichée** avant que j'aie tapé
quoi que ce soit :

- champ « Âge » = **59** (relu directement dans le DOM : `[{type:"number",val:"59"},{type:"number",val:"7"},…]`)
- champ « Ancienneté du diabète (ans) » = **7**
- « Espérance de vie » : bouton **« Longue » sélectionné**
- mentions affichées : « Âge **· repris de votre saisie** », « Ancienneté **· repris de votre
  saisie** », « Espérance de vie **· repris de votre saisie** », « Fragilité **· repris de votre
  saisie** »
- colonne de droite : « **OPTIONS APPLICABLES — Cible ≤ 7 %** `Recommandée` », déjà calculée.

**Conséquence clinique concrète.** J'appelle M. Abadie (64 ans, diabète depuis 11 ans). J'ouvre
« Fixer la cible ». L'écran m'affiche **une cible finie, badgée « Recommandée »**, calculée pour la
patiente précédente. Si je jette un œil et que je repars — ce que je fais dix fois par jour — je
donne à M. Abadie la cible de Mme Lantier. **Rien à l'écran ne dit « ceci concerne un autre
patient »** : la mention « repris de votre saisie » suggère au contraire que c'est bien *ma* saisie,
donc *mon* patient.

**Aggravant.** Le seul geste prévu pour couper ça — « Nouveau patient » — passe par un
`window.confirm()` natif (cf. intermède ci-dessus), que je n'ai pas pu déclencher. Les deux seuls
mécanismes d'isolation entre patients sont donc : (a) un bouton dont le fonctionnement n'a pas pu
être vérifié, (b) le rechargement complet de la page (F5), que rien à l'écran n'indique.

**Écart avec l'attendu.** Le cadrage de cette passe indiquait « sortir d'un nœud et y revenir remet
son formulaire à zéro ». **Ce n'est pas le comportement au commit `cf1c780`.** Soit la mémoire de
session (D28) s'est étendue au-delà des critères `partage`, soit le rebond par « ← Domaine » ne
démonte pas l'état du nœud. Dans les deux cas, le résultat à l'écran est le même : **contamination
inter-patients silencieuse**, exactement la famille de défaut signalée le 2026-07-28.

**Méthode retenue pour la suite de cette recette.** À partir d'ici, je **recharge la page (F5)**
entre deux vignettes, et je le signale quand je ne le fais pas (tests de partage inter-nœuds).

---

## N3 — Pile sur la cible : est-ce que je touche à quelque chose ? (M. Abadie, 64 ans)

> Page rechargée avant cette vignette. **Deux nœuds enchaînés volontairement** (« Fixer la cible »
> puis « Traiter ») pour tester le partage de session ET le pré-remplissage `a_l_objectif` du Plan P7.

### Rappel du témoin

**Histoire.** M. Abadie, 64 ans, retraité. DT2 depuis 11 ans. Metformine 1000×2 + gliclazide LM 30.
**HbA1c 7,0 %**, stable depuis un an. IMC 29,3. DFG 71. Pas d'ATCD CV, pas de complication
microvasculaire. **Une hypoglycémie ressentie** il y a deux mois, la première.

**Ma question.** Il est exactement à sa cible. Est-ce que je ne fais **rien** ? Ou est-ce que
l'hypoglycémie sous gliclazide justifie de bouger quelque chose alors que le chiffre est bon ?

**Réponse que j'attends.** Que l'outil reconnaisse « à l'objectif » comme une situation à part
entière, et propose éventuellement de remplacer le gliclazide **sans intensifier**. J'attends **de
ne pas** recevoir une liste de médicaments à ajouter.

**Incertitude.** Moyenne.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : **2** (« Fixer la cible d'HbA1c », puis « Traiter »).
- **Actions** : **25**.
  - Nœud « Fixer la cible » (7 actions) : Aide à la décision · Fixer la cible · Âge 64 ·
    Ancienneté 11 · Rien à signaler · Longue · ← Domaine.
  - Nœud « Traiter » (18 actions) : Traiter · Optimiser · Suivant · ☑Metformine · ☑Sulfamide ·
    Dose metformine 2000 · HbA1c 7.0 · À l'objectif · Suivant · DFG 71 · Normoalbuminurie ·
    IMC 29.3 · Suivant · Rien à signaler · ☑Hypoglycémie récente · Suivant · Élevé · Indifférent.
- **Temps** : ~5 minutes. **Au-delà du budget d'une consultation de 15 minutes** si je dois aussi
  examiner et parler au patient.

**Ce qui marche vraiment bien — le partage inter-nœuds.** En arrivant sur « Traiter », la section
« TERRAIN ET PRÉFÉRENCES » était **déjà remplie** : « Âge : 64 · Fragilité : Non · Espérance de vie :
Longue », avec la mention « **· repris de votre saisie** ». **3 champs économisés**, correctement
étiquetés. C'est exactement ce qu'il fallait faire.

**Ce qui apparaît intelligemment.** Cocher « Metformine » fait apparaître un champ « **Dose de
metformine (mg/j)** » (liste 500 → 3000). L'outil sait donc descendre à la dose quand elle est
décisionnelle — ce qui rend d'autant plus frappant qu'il ne la donne jamais en sortie.

**Champ que je voulais et qui n'existe pas** : le **type** de sulfamide (gliclazide vs glimépiride
vs glibenclamide). L'outil raisonne sur « Sulfamide » en bloc alors que ses propres textes
distinguent le glibenclamide (proscrit) des deux autres.

**Champ que je ne sais pas remplir** : « **Risque hypoglycémique du schéma : Faible / Élevé** ».
Aucune définition, aucune infobulle. C'est un jugement que l'outil me demande **et qui change la
réponse** : j'ai vu la carte « Désintensifier » apparaître au moment précis où j'ai cliqué
« Élevé ». C'est le même défaut de forme que le champ « autres facteurs de risque CV » signalé le
2026-07-28 : **un critère non défini qui bascule la conduite**.

### Réponse obtenue, verbatim

> **OPTIONS APPLICABLES**
>
> **Socle du traitement — gestes cumulables**
> **Metformine (socle du traitement) — instaurer ou poursuivre** `Recommandation officielle (France)`
> `Preuve faible` — Proposé parce que : Socle maintenu par la recommandation officielle, quelles que
> soient les comorbidités.
>
> **Agent à ajouter — en choisir un**
> *OPTIONS ÉQUIVALENTES SUR LES DONNÉES DISPONIBLES : L'OUTIL NE LES DÉPARTAGE PAS, LE CHOIX REVIENT
> AU PRATICIEN.*
> **Introduire un iSGLT2 (protection cardio‑rénale et/ou contrôle glycémique)** `Recommandée`
> `Preuve élevée` — Proposé parce que : Remplacement d'un agent sans bénéfice sur critère dur
> (gliptine, sulfamide)
> **Introduire un AR GLP‑1 (liraglutide, sémaglutide, dulaglutide)** `Recommandée` `Preuve modérée`
> — Proposé parce que : Remplacement d'un agent sans bénéfice sur critère dur (gliptine, sulfamide)
>
> **Traitement à alléger — gestes cumulables**
> **Désintensifier : alléger / arrêter le sulfamide, le glinide ou réduire l'insuline** `Recommandée`
> `Preuve faible` — Proposé parce que : Hypoglycémie récente et Risque hypoglycémique du schéma =
> Élevé et Intention thérapeutique (« je souhaite… ») ≠ Initier un traitement et Traitements en cours
> comprend Sulfamide
> **Réduire la posologie du sulfamide (tolérance, hypoglycémie légère)** `Recommandée` `Preuve faible`
> — Proposé parce que : Intention thérapeutique (« je souhaite… ») ≠ Initier un traitement et
> Traitements en cours comprend Sulfamide et Hypoglycémie récente

### Test des 20 secondes

Écrit sans relire :

> « Je garde la metformine. J'enlève ou je baisse le gliclazide à cause de l'hypo. Et je mets à la
> place soit une gliflozine soit un GLP-1, au choix, l'outil ne tranche pas. »

**Écart** : le message principal est bien passé, et c'est un vrai succès — **la bannière « OPTIONS
ÉQUIVALENTES … LE CHOIX REVIENT AU PRATICIEN » est la phrase la mieux conçue de tout l'outil**, je
l'ai retenue mot pour mot. En revanche je n'ai **pas** su dire, de mémoire, la différence entre les
deux cartes « Désintensifier » et « Réduire la posologie du sulfamide » — je les ai fusionnées en
« j'enlève ou je baisse ». Elles se ressemblent trop.

### L'écart

**Ce que l'outil m'apporte.** Il **a compris la situation** : il ne m'a pas proposé d'intensifier.
Il a mis l'allègement du sulfamide en avant à cause de l'hypo, et présenté le remplacement comme un
échange, pas un ajout. C'est exactement le raisonnement que j'attendais, et c'est mieux que ce que
j'aurais fait seul (je n'aurais pas pensé à « preuve élevée » pour l'iSGLT2).

**Défauts et incohérences rencontrés.**

1. **Contradiction d'intitulé.** Le groupe s'appelle « **Agent à ajouter** — en choisir un », et la
   justification des deux cartes dit « **Remplacement** d'un agent sans bénéfice ». Ajouter ou
   remplacer, ce n'est pas la même ordonnance. Chez un patient à 7,0 %, l'ambiguïté est décisive :
   si j'ajoute une gliflozine **sans** retirer le gliclazide, je l'expose à plus d'hypoglycémies.
2. **Deux cartes redondantes.** « Désintensifier : alléger / arrêter le sulfamide… » et « Réduire
   la posologie du sulfamide » sont dans le même groupe, avec le même badge `Recommandée`, la même
   `Preuve faible`, et disent presque la même chose. Je ne sais pas laquelle appliquer.
3. **« Proposé parce que » = expression booléenne brute sur 3 cartes sur 4.** Verbatim :
   « Proposé parce que : Intention thérapeutique (« je souhaite… ») **≠** Initier un traitement
   **et** Traitements en cours comprend Sulfamide **et** Hypoglycémie récente ». Seule la carte
   metformine a une phrase de médecin. Le contraste est violent au sein du **même écran**.
4. **Incohérence observée pendant la saisie, avant que je coche l'hypo** : tant que
   « Hypoglycémie récente » était à *non*, la carte « **Remplacer le sulfamide** (moins
   d'hypoglycémie, moins de poids, plus de bénéfice) » s'affichait. Dès que j'ai coché
   « Hypoglycémie récente = oui », **cette carte a disparu** (sa condition affichée contient
   « Hypoglycémie récente : non »). Autrement dit : le patient qui fait des hypos sous sulfamide
   perd la carte dont l'argument est « moins d'hypoglycémie ». C'est contre-intuitif à l'écran ;
   je ne juge pas le fond — **question clinique** — mais l'effet visible mérite un regard.

**Ce qu'il ne dit pas et que j'attendais.** Quelle gliflozine, quelle dose, quelle surveillance à
J15, quoi annoncer au patient (mycose génitale). Et surtout : **rien sur la séquence** — j'arrête le
gliclazide d'abord ou j'introduis d'abord ?

### En vraie consultation ?

**Oui, mais pas pendant la consultation** — 5 minutes et 25 actions, c'est un travail de fin de
journée ou de préparation. En revanche le raisonnement produit est bon et m'aurait fait changer
d'avis (je serais parti sur une gliptine). Je décrocherais au champ « **Risque hypoglycémique du
schéma** » : je ne sais pas ce qu'on me demande, et je vois qu'il change la réponse.

---

## N4 — Coronarien pontagé : la consultation qui traverse TROIS écrans (M. Kervarec, 67 ans)

> Page rechargée avant cette vignette. **C'est la vignette de mesure du coût de resaisie.**

### Rappel du témoin

**Histoire.** M. Kervarec, 67 ans. DT2 depuis 13 ans. **Triple pontage en 2021**, **AOMI**
(claudication à 300 m), FEVG 54 %, pas d'IC. Metformine 1000×2, sitagliptine 100, aspirine,
bisoprolol, périndopril, **rosuvastatine 10**. HbA1c 8,3 %. IMC 27,1. **DFG 58.** LDL 0,91.
Albuminurie 55 mg/g. Tabac 40 PA sevré.

**Ma question.** (a) quelle cible à 67 ans chez un coronarien à 8,3 % ; (b) quel médicament
j'ajoute ou j'échange ; (c) **rosuvastatine 10 + LDL 0,91, ça suffit ?**

**Réponse que j'attends.** Cible 7-7,5 %. Remplacement de la gliptine par iSGLT2 ou AR GLP-1.
Statine haute intensité.

**Incertitude.** Faible sur le principe, forte sur le temps que ça va me coûter.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : **3** (« Fixer la cible » → « Traiter » → « Prescrire une statine »).
- **Actions** : **35** au total.
  - « Fixer la cible » : **8** (Aide à la décision · Fixer la cible · Âge 67 · Ancienneté 13 ·
    ☑Antécédent cardiovasculaire · Rien à signaler · Intermédiaire · ← Domaine)
  - « Traiter » : **19** (Traiter · Intensifier · Suivant · ☑Metformine · ☑Gliptine ·
    Dose 2000 · HbA1c 8.3 · Au-dessus de l'objectif · Suivant · ☑MCV athéromateuse · DFG 58 ·
    Microalbuminurie · IMC 27.1 · Suivant · Rien à signaler · Suivant · Faible · Indifférent ·
    ← Domaine)
  - « Prescrire une statine » : **8** (Statine · Autres FRCV = 2 · ☑Diabète compliqué ·
    Rien à signaler · Suivant · ☑Statine déjà en place · Suivant · Intolérance = Non)
- **Temps** : **~8 minutes.** Impossible en consultation de 15 minutes.

**Le partage fonctionne, et bien.** Le nœud « Statine » s'est ouvert avec **trois champs déjà
remplis** — « Âge · *repris de votre saisie* », « Maladie cardiovasculaire athéromateuse établie ·
*repris de votre saisie* », « Ancienneté du diabète (ans) · *repris de votre saisie* ». Sur les
8 actions du nœud statine, 3 champs m'ont été épargnés. C'est le vrai progrès de cette version.

**Mais une resaisie subsiste, et c'est la plus bête.** Le nœud « Fixer la cible » demande
« **Antécédent cardiovasculaire** ». Le nœud « Traiter » redemande, à vide, « **Maladie
cardiovasculaire athéromateuse établie** ». **Deux noms pour le même fait**, à saisir deux fois.
Et c'est le second qui alimente ensuite le nœud statine — le premier ne sert qu'au nœud cible.

**Champs voulus, absents (nœud statine)** :
- **la statine actuelle** (molécule + dose) — le nœud demande « Statine déjà en place : oui/non »
  mais **jamais laquelle ni à quelle dose** ;
- **le LDL** — pas demandé (cohérent avec la doctrine affichée « pas de cible LDL chiffrée », mais
  ça veut dire que je ne peux pas poser ma question telle que je l'ai en tête) ;
- **le type de gliptine / de sulfamide** (nœud « Traiter »).

**Le champ « Autres facteurs de risque cardiovasculaire » n'a pas changé.** C'est toujours un
**champ numérique libre**, sans définition, sans infobulle, sans liste de ce qui compte. J'y ai
mis « 2 » au jugé (tabac sevré, HTA). L'écran le marque « · sans effet sur la reco actuelle » —
ce qui est vrai ici (la MCV établie tranche seule) mais ne dit pas quand il en aurait un.
**Défaut du 2026-07-28 : inchangé.**

**Alertes rendues à l'écran, et elles sont bonnes.** Deux bandeaux sont apparus au fil de la
saisie, verbatim :

> Metformine : dose maximale 2 000 mg/j si DFG 45‑59 (RCP ANSM) ; revoir au préalable les facteurs
> de risque d'acidose lactique.

> Non-association incrétine : si un AR GLP‑1 ou le tirzépatide est introduit, la gliptine doit être
> ARRÊTÉE — même voie incrétine, aucun bénéfice additif (Nauck 2017 ; ADA §9 ; KDIGO PP4.2.3 ;
> HAS R.80). Ne jamais les associer.

La seconde est apparue **dès que j'ai coché « Gliptine »**, avant même de connaître la
recommandation. C'est exactement le bon moment. Rien de tel n'existait dans mes souvenirs de la
passe précédente.

### Réponse obtenue, verbatim

**Nœud « Fixer la cible » :**

> **Cible ≤ 8 %** `Recommandée` `Preuve faible` — Proposé parce que : Antécédent cardiovasculaire

**Nœud « Traiter » :**

> **Socle** — **Metformine (socle du traitement) — instaurer ou poursuivre** `Recommandation
> officielle (France)` `Preuve faible`
>
> **Traitement à corriger ou remplacer** — **Remplacer la gliptine (aucun bénéfice sur critère dur
> — préférer un agent qui en apporte)** `Recommandée` `Preuve modérée`
>
> **Agent à ajouter — en choisir un**
> **Introduire un iSGLT2 (protection cardio‑rénale et/ou contrôle glycémique)** `Recommandée`
> `Preuve élevée` — Proposé parce que : DFG (mL/min/1,73 m²) < 60 et Albuminurie ≠ Normoalbuminurie
> et Maladie cardiovasculaire athéromateuse établie et Palette glycémique ouverte (place pour un
> agent de contrôle en plus) et Remplacement d'un agent sans bénéfice sur critère dur (gliptine,
> sulfamide) — *Ce rang tient compte de : Insuffisance cardiaque ou DFG < 60 ou Albuminurie ≠
> Normoalbuminurie*
> **Introduire un AR GLP‑1 (liraglutide, sémaglutide, dulaglutide)** `Preuve modérée`
> **Sulfamide (gliclazide MR ou glimépiride) — option glycémique de bas rang, derrière la gliptine**
> `Preuve modérée`

**Nœud « Prescrire une statine » :**

> **Statine de haute intensité — prévention secondaire (maladie athéromateuse établie)**
> `Recommandée` `Preuve élevée` — Proposé parce que : Maladie cardiovasculaire athéromateuse établie
>
> (déplié) **Contre-indications** : Molécules de haute intensité (baisse de LDL ≥ 50 %,
> SFE/SFD/NSFA/SFC 2026 Table 4) : **atorvastatine 40-80 mg ou rosuvastatine 10-20 mg**. Prudence
> d'interaction via le CYP3A4 avec l'atorvastatine (macrolides, azolés, amiodarone,
> vérapamil/diltiazem, inhibiteurs de protéase) ; préférer la rosuvastatine en cas de
> co-prescription à risque. · Ne pas INITIER de statine chez un patient déjà en dialyse sans statine
> en cours ; grossesse.
> Événements vasculaires majeurs RR ~0,79 par 1 mmol/L de LDL abaissé (CTT diabète) ; NNT ~12-20 sur
> 5-6 ans en prévention secondaire… Intensification haute vs modérée : −15 % d'événements
> supplémentaires (NNT ~25 sur 5 ans). Mortalité : réduite par la statine elle-même, PAS par
> l'intensification seule (TNT HR 1,01).
> **Délai du bénéfice : 5-6 ans**

### Test des 20 secondes

Écrit sans relire :

> « Cible 8 %. Je vire la sitagliptine, je mets une gliflozine — preuve élevée, il a du rein, de
> l'albuminurie et une maladie coronaire. Et statine haute intensité. Le bénéfice met 5-6 ans à
> arriver. »

**Écart, et il est important** : de mémoire, j'aurais **augmenté la rosuvastatine**, parce que la
carte s'appelle « Statine de haute **intensité** » et que je n'ai pas retenu la liste des molécules.
Or elle est écrite noir sur blanc — **rosuvastatine 10-20 mg EST de haute intensité**, donc mon
patient est **déjà** au bon niveau et je n'ai rien à changer. **Cette information, qui est la
réponse exacte à ma question (c), est enfouie derrière un lien replié intitulé « ⚠ 2
contre-indications, effet attendu et plus ».** Un libellé qui annonce des contre-indications ne me
donne aucune raison de l'ouvrir quand je cherche une posologie. **C'est le défaut d'ergonomie le
plus coûteux de cette vignette** : la bonne réponse est là, et l'écran me la cache derrière un
mauvais titre.

### L'écart

**Ce que l'outil m'apporte.** Beaucoup, sur ce patient. Le nœud statine est de loin le meilleur des
six : molécules **nommées**, doses **chiffrées**, NNT, **délai du bénéfice (5-6 ans)**, et surtout
la distinction que je n'aurais pas su formuler seul — *la statine réduit la mortalité,
l'intensification non*. C'est le seul endroit de l'outil qui me donne une phrase que je peux
répéter mot pour mot à un patient qui doute de son traitement.

**Ce qu'il ne dit pas et que j'attendais.**
- Aucune séquence : j'arrête la sitagliptine avant, après, ou en même temps que j'introduis la
  gliflozine ?
- Aucune modalité pratique d'introduction de l'iSGLT2 (créatinine à J15 ? mycose ? sick-day rules ?)
  alors que le DFG est à 58.
- Aucune confrontation « statine actuelle vs statine recommandée », faute d'avoir demandé la
  molécule en cours.

**Incohérences relevées.**
1. Le même fait clinique porte **deux noms** dans deux nœuds (« Antécédent cardiovasculaire » /
   « Maladie cardiovasculaire athéromateuse établie ») et se saisit deux fois.
2. Un **sulfamide** figure dans le groupe « Agent à ajouter — en choisir un » chez un coronarien
   sous gliptine, sans badge et en dernier — mais dans le même cadre visuel que l'iSGLT2 à preuve
   élevée. Le rang est correct, le regroupement induit en erreur.
3. « **Ce rang tient compte de : Insuffisance cardiaque ou DFG (mL/min/1,73 m²) < 60 ou Albuminurie
   ≠ Normoalbuminurie** » — encore de la logique brute affichée sous une carte.

### En vraie consultation ?

**Le nœud statine : oui, immédiatement et souvent.** Les deux autres : **non pendant la
consultation**. 35 actions et 8 minutes pour un patient, c'est du temps de préparation ou de fin de
journée. Je décrocherais sur le nœud « Traiter », à l'étape « Suivant : Terrain et préférences » —
à ce stade j'ai déjà donné 15 informations et l'écran m'en redemande trois de plus dont une
(« Risque hypoglycémique du schéma ») que je ne sais pas définir.

---

## N5 — Insuffisance rénale modérée : jusqu'où je garde la metformine (M. Traoré, 71 ans)

> Page rechargée. Un seul nœud ouvert (« Traiter ») — je n'ai pas ouvert « Fixer la cible »,
> comme je ferais en vrai quand la question porte sur le médicament.

### Rappel du témoin

**Histoire.** M. Traoré, 71 ans. DT2 depuis 17 ans. **DFG 31** (en baisse : 38 il y a 18 mois).
A/C 410 mg/g. **Metformine 1000 matin et soir**, glimépiride 3, irbésartan, furosémide,
atorvastatine. HbA1c 7,7 %. IMC 25,8. K+ 4,7. Diarrhée aiguë de 3 jours le mois dernier sans
rien arrêter.

**Ma question.** (a) metformine 2 g/j à DFG 31 : je garde, je réduis, j'arrête ? (b) iSGLT2 pour
le rein à ce DFG ? (c) glimépiride à 71 ans avec DFG 31 ?

**Réponse que j'attends.** Réduction de la metformine à 1 g/j, iSGLT2 pour la néphroprotection,
glimépiride à remettre en question, et une consigne écrite de suspension en cas de déshydratation.

**Incertitude.** Moyenne-forte. C'est là que je perds le plus de temps.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1.
- **Actions** : **18** (Aide à la décision · Traiter · Optimiser · Suivant · ☑Metformine ·
  ☑Sulfamide · Dose 2000 · HbA1c 7.7 · Au-dessus de l'objectif · Suivant · DFG 31 ·
  Macroalbuminurie · IMC 25.8 · Suivant · Rien à signaler · Suivant · Rien à signaler · Indifférent).
- **Temps** : ~3 minutes.

**Excellent point d'ergonomie, nouveau pour moi.** Dans la dernière section, trois champs sont
marqués « **· sans effet sur la reco actuelle** » — Âge, Espérance de vie, Risque hypoglycémique du
schéma. **L'outil me dit quoi ne pas remplir.** Sur un patient où j'ai déjà donné 12 informations,
c'est exactement ce qu'il faut. (Le revers de cette mécanique est le défaut relevé en N2 : à vide,
elle affiche « sans effet » sur des champs qui, une fois remplis, décident.)

**Champs voulus et absents** : la **kaliémie** (K+ 4,7 chez un patient sous IEC/ARA2 + rein), le
**type de sulfamide**, la **pente d'évolution du DFG** (31 aujourd'hui mais 44 il y a 3 ans — ce
n'est pas la même conduite qu'un DFG 31 stable depuis 10 ans).

### Réponse obtenue, verbatim

Deux bandeaux au-dessus des cartes :

> Position déclarée AU-DESSUS de l'objectif, avec une intention d'OPTIMISATION : l'outil s'en tient
> à ce qui est déclaré et ne propose donc aucune INTENSIFICATION GLYCÉMIQUE (la palette
> d'intensification est commandée par l'intention, pas par la position). En revanche, les options de
> PROTECTION cardio-rénale continuent d'être proposées si elles sont indiquées : une carte
> « Introduire… » peut donc apparaître ci-dessous sans contredire ce message — elle est là pour le
> bénéfice cardiaque ou rénal, et le « proposé parce que » de chaque carte le nomme. C'est le
> comportement attendu si vous travaillez d'abord la tolérance, l'observance ou la simplification du
> schéma. Si un renforcement du contrôle glycémique est visé, déclarer l'intention « intensifier »
> ouvre les options correspondantes.

> Metformine : dose maximale 1 000 mg/j, initiation ≤ 500 mg si DFG 30‑44 (RCP ANSM).

Puis :

> **À faire d'emblée — sécurité — gestes cumulables**
> **Réduire la posologie de la metformine (fonction rénale altérée ou intolérance digestive)**
> `Mesure de sécurité` `Preuve faible`
> (déplié) Réduit le risque d'accumulation en maintenant le bénéfice de la metformine dans la plage
> utilisable (sécurité — RCP/ANSM). **Avantages** • Réduire quand la dose ACTUELLE dépasse le maximum
> ajusté au DFG (RCP ANSM : 45‑59 → max 2 g/j ; 30‑44 → max 1 g/j)… Le praticien ajuste la dose
> exacte. **Inconvénients** • Revoir les facteurs de risque d'acidose lactique ; **suspendre en cas
> de déshydratation, contraste iodé, jeûne**…
>
> **Socle du traitement** — **Metformine (socle du traitement) — instaurer ou poursuivre**
> `Recommandation officielle (France)` `Preuve faible`
>
> **Traitement à corriger ou remplacer** — **Remplacer le sulfamide (moins d'hypoglycémie, moins de
> poids, plus de bénéfice)** `Recommandée` `Preuve modérée`
>
> **Agent à ajouter — en choisir un**
> **Introduire un iSGLT2 (protection cardio‑rénale et/ou contrôle glycémique)** `Recommandée`
> `Preuve élevée`
> **Introduire un AR GLP‑1** `Preuve modérée`

### Test des 20 secondes

Écrit sans relire :

> « Je descends la metformine à 1 g par jour parce que le DFG est entre 30 et 44. Je remplace le
> glimépiride. J'ajoute une gliflozine, preuve élevée. Et je lui dis d'arrêter la metformine s'il
> vomit ou s'il a la diarrhée. »

**Écart : quasi nul.** C'est la meilleure restitution de toute la passe. Le chiffre exact
(1 000 mg/j) et la règle de suspension sont passés d'un coup. **Ce sont mes trois questions,
répondues.** La seule chose que je n'ai pas retenue : quelle gliflozine et à quelle dose — l'outil
ne le dit pas ici (alors qu'il le fait pour la statine).

### L'écart

**Ce que l'outil m'apporte.** Beaucoup, et vite. **C'est la vignette où l'outil m'a le plus servi.**
Il a répondu aux trois questions, dans le bon ordre de priorité (sécurité d'abord), avec le seuil
réglementaire exact que j'aurais dû aller chercher dans le Vidal.

**Le badge « Mesure de sécurité » fonctionne.** Pastille **rouge à contour**, à côté de la pastille
grise « Preuve faible », dans un groupe intitulé « **À faire d'emblée — sécurité** ». Je l'ai
distinguée immédiatement du bleu plein de « Recommandée » sur les autres cartes du même écran.
Une réserve honnête : à la seconde où je la vois, le rouge me fait d'abord penser « attention,
danger » — c'est le **groupe** (« À faire d'emblée — sécurité ») qui rétablit le sens, pas la
pastille seule. Sans le titre de groupe, je l'aurais lue comme une mise en garde contre la carte.

**Incohérence à l'écran.** Deux cartes parlent de la metformine à 40 lignes d'écart :
« **Réduire la posologie de la metformine** » (sécurité, en tête) puis « **Metformine — instaurer ou
poursuivre** » (socle). Prises isolément elles se contredisent. Les titres de groupe les
réconcilient, mais un praticien qui balaie l'écran en dix secondes peut retenir « poursuivre ».

**Le pavé explicatif « Position déclarée AU-DESSUS… » : bon fond, mauvais format.** Six lignes de
texte dense, en majuscules internes, au-dessus des cartes. Le contenu est précieux (il m'explique
pourquoi il ne me propose pas d'intensifier), mais **je ne le lirai jamais en consultation**. Il
mériterait deux lignes, pas huit.

**Ce qu'il ne dit pas.** Quelle gliflozine, à quelle dose, avec quelle surveillance de créatinine.
Rien sur la kaliémie. Et pas de « phrase à copier-coller » pour le patient sur les jours de
maladie — l'information y est, mais rédigée pour moi, pas pour lui.

### En vraie consultation ?

**Oui, et c'est le premier cas où je répondrais franchement oui pour le nœud « Traiter ».**
3 minutes, 18 actions, et je repars avec un seuil réglementaire que je n'avais pas en tête. Je ne
décrocherais nulle part sur ce patient.

---

## N6 — Insuffisance rénale sévère : là où les seuils se croisent (Mme Nowak, 79 ans)

> Page rechargée. Un seul nœud. **Vignette ciblée sur l'arbitrage P7 n°2 (prudence rénale
> AR GLP-1 sous DFG 15).**

### Rappel du témoin

**Histoire.** Mme Nowak, 79 ans, vit chez sa fille. DT2 depuis 24 ans. **DFG 13**, albuminurie
massive, dialyse envisagée « dans l'année ». **Metformine 500×2 jamais arrêtée**, sitagliptine 25,
furosémide, amlodipine, atorvastatine, EPO. HbA1c 8,1 %. IMC 24,4. Hb 10,2 sous EPO. K+ 5,1.

**Ma question.** La metformine à DFG 13, c'est non — ça je sais. **Mais alors quoi ?** Un AR GLP-1
est-il utilisable à ce niveau ? Une gliptine adaptée ? De l'insuline ? **Je veux savoir ce qui
reste sur la table.**

**Réponse que j'attends.** Arrêt de la metformine, mis en avant comme mesure de sécurité. Puis une
conduite. Sur l'AR GLP-1 : un signal clair, utilisable ou pas, et avec quelle réserve.

**Incertitude.** Forte.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1.
- **Actions** : **17** (Aide à la décision · Traiter · Optimiser · Suivant · ☑Metformine ·
  ☑Gliptine · Dose 1000 · HbA1c 8.1 · Au-dessus · Suivant · DFG 13 · Macroalbuminurie · IMC 24.4 ·
  Suivant · Rien à signaler · Suivant · Rien à signaler).
- **Temps** : ~3 minutes.

**Champs voulus et absents** : l'**hémoglobine** et le fait qu'elle soit **sous EPO** (ça compte
pour interpréter son HbA1c à 8,1 % — voir N12), la **kaliémie**, et le fait qu'une **dialyse soit
programmée** (le nœud statine a un champ « Dialyse », pas le nœud « Traiter »).

### Réponse obtenue, verbatim

Bandeau d'alerte, au-dessus des cartes :

> Metformine CONTRE‑INDIQUÉE si DFG < 30 (RCP ANSM) : arrêter ; sulfamide aussi. Un iSGLT2 reste
> initiable jusqu'à DFG ≥ 20 (indication rénale). Ces limites portent sur l'ÉLIMINATION RÉNALE des
> agents, pas sur leur efficacité glycémique : l'AR GLP‑1 et l'insuline n'ont pas de
> contre‑indication liée au DFG et restent utilisables en dessous de 20.

Cartes :

> **À faire d'emblée — sécurité — gestes cumulables**
> **Arrêter la metformine (DFG < 30 — contre‑indication rénale)** `Mesure de sécurité` `Preuve faible`
>
> **Traitement à corriger ou remplacer**
> **Remplacer la gliptine (aucun bénéfice sur critère dur — préférer un agent qui en apporte)**
> `Recommandée` `Preuve modérée`
>
> **Agent à ajouter — en choisir un**
> **Introduire un AR GLP‑1 (liraglutide, sémaglutide, dulaglutide)** `Recommandée` `Preuve modérée`
> *(encadré bleu clair dans la carte)* **Fonction rénale très altérée (DFG < 15 mL/min/1,73 m²) : les
> AR GLP‑1 commercialisés en France restent utilisables à ce stade — leur résumé des caractéristiques
> du produit ne pose aucune limite rénale —, mais ils y ont été PEU ÉTUDIÉS. Le recul manque, pas
> l'autorisation : proposer la classe reste licite, en surveillant de près la tolérance (digestive,
> poids, état nutritionnel) et en réévaluant tôt.**

Et, en bas, en gris, les options écartées **avec leur motif** :

> Metformine (socle du traitement) — instaurer ou poursuivre **écarté : DFG < 30**
> Introduire un iSGLT2 (protection cardio‑rénale et/ou contrôle glycémique) **écarté : DFG < 20**

### Test des 20 secondes

Écrit sans relire :

> « J'arrête la metformine, c'est contre-indiqué sous 30. La gliflozine, non plus, elle s'arrête à
> 20. Il me reste le GLP-1 — utilisable mais peu étudié à ce niveau de rein, à surveiller
> nutritionnellement. Et je vire la sitagliptine. »

**Écart : nul.** C'est la restitution la plus complète de la passe, y compris la nuance
« utilisable mais peu étudié ». **L'écran a répondu exactement à ma question — « ce qui reste sur
la table » — parce qu'il montre aussi ce qui n'y est plus, et pourquoi.**

### L'écart

**Ce que l'outil m'apporte.** Il fait ici ce qu'aucun de mes réflexes ne fait : il me donne les
**trois seuils d'un coup** (metformine 30, iSGLT2 20, AR GLP-1 pas de limite) et il **distingue
explicitement** une limite d'élimination rénale d'une limite d'efficacité. C'est le genre de
phrase que je n'ai jamais lue nulle part et que je vais retenir.

**Le bloc des options écartées avec motif est excellent.** « Introduire un iSGLT2 … **écarté :
DFG < 20** » en une ligne, en gris, sous les cartes retenues. C'est ce qu'il faudrait faire partout
— et ça contraste avec le pavé illisible de « Pourquoi pas d'autres options ? » vu en N1.

**Ce qu'il ne dit pas.** Quel AR GLP-1 (elle a 79 ans, IMC 24,4, elle est en pré-dialyse : le choix
de la molécule n'est pas neutre), à quelle dose, et surtout **rien sur l'insuline** — que l'alerte
mentionne pourtant comme utilisable sans limite rénale. Elle est citée dans le bandeau et ne
revient jamais sous forme de carte. Chez une patiente à HbA1c 8,1 % en pré-dialyse, c'est une
option que j'attendais de voir nommée.

**Rien d'incohérent à signaler sur cet écran.** C'est le seul de la passe dans ce cas.

### En vraie consultation ?

**Oui, franchement oui.** C'est exactement le patient pour lequel un outil sert : des seuils que je
ne retiens pas, qui se croisent, et qui décident. 3 minutes bien employées.

---

## N7 — La désescalade chez la très âgée : le chiffre trop bon (Mme Chevallier, 88 ans)

> Page rechargée. Deux nœuds (« Fixer la cible » → « Traiter »).

### Rappel du témoin

**Histoire.** Mme Chevallier, 88 ans, EHPAD. DT2 depuis 26 ans. **HbA1c 6,2 %.** Glimépiride 4,
metformine 500×2, **glargine 12 UI**, + bisoprolol, furosémide, apixaban, donépézil.
Poids 49 kg / 1,54 m (**IMC 20,7**), **−5 kg en 14 mois**. MMSE 18/30. **3 chutes en 8 mois.**
Glycémies EHPAD : **0,58 et 0,64 g/L** le matin. DFG 38. Saute souvent le dîner.

**Ma question.** Je veux **dé-prescrire**. Par quoi je commence — glimépiride ou insuline ? Et quelle
cible à 88 ans en EHPAD ? Est-ce que l'outil sait qu'à 6,2 % on est **trop bas** ?

**Réponse que j'attends.** Cible relevée, arrêt du glimépiride en premier, allègement de l'insuline.
**Je veux voir l'outil proposer d'enlever quelque chose.**

**Incertitude.** Faible sur le principe, forte sur les modalités.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 2.
- **Actions** : **27**.
  - « Fixer la cible » : 8 (Aide à la décision · Fixer la cible · Âge 88 · Ancienneté 26 ·
    ☑Fragilité · ☑Comorbidité grave · Limitée · ← Domaine)
  - « Traiter » : 19 (Traiter · Déprescrire · Suivant · ☑Metformine · ☑Sulfamide ·
    ☑Insuline basale · Dose 1000 · HbA1c 6.2 · En dessous de l'objectif · Suivant · DFG 38 ·
    Normoalbuminurie · IMC 20.7 · Suivant · Rien à signaler · ☑Hypoglycémie récente ·
    ☑Dénutrition · Suivant · Élevé)
- **Temps** : ~6 minutes.

**Champs voulus, absents** : les **chutes** (nulle part — c'est pourtant l'argument n°1 de ma
déprescription), le **MMSE / les troubles cognitifs**, la **dose d'insuline** (12 UI — le nœud
demande la dose de metformine mais pas celle de l'insuline), la **perte de poids récente** (seule
la case « Dénutrition » existe, sans quantification), et le fait qu'elle **saute des repas**.

**Confirmation d'un défaut vu en N2 : la « Suggestion auto » ne suggère toujours rien.** Testée ici
dans le cas d'école qu'elle nomme elle-même — âge 88, Fragilité cochée, Comorbidité grave cochée —
les trois boutons d'espérance de vie sont **restés gris**, le bandeau « à confirmer » est resté
jaune. Sur trois patients (59 ans sans rien, 67 ans avec ATCD CV, 88 ans fragile et comorbide),
**elle n'a jamais rien proposé**.

### Réponse obtenue, verbatim

**Nœud « Fixer la cible » :**

> **Cible < 9 %** `Recommandée` `Preuve très faible` — Proposé parce que : Espérance de vie = Limitée
> et Fragilité et Comorbidité grave

**Nœud « Traiter » — alertes rendues (3, dont une qui répond à ma question) :**

> Association insuline + sulfamide / glinide : risque d'hypoglycémie cumulée. **Envisager d'arrêter
> le sulfamide / le glinide**, surtout à l'introduction ou à l'intensification de l'insuline.

> Patient sous insuline à haut risque hypoglycémique : ÉVITER d'ajouter un sécrétagogue (sulfamide /
> glinide). Privilégier un agent sans hypoglycémie (iSGLT2 / AR GLP‑1) ou l'ajustement de l'insuline
> (**nœud E**).

**Cartes :**

> **Socle du traitement** — **Metformine (socle du traitement) — instaurer ou poursuivre**
> `Recommandation officielle (France)` `Preuve faible`
>
> **Agent à ajouter — en choisir un**
> **Introduire un iSGLT2 (protection cardio‑rénale et/ou contrôle glycémique)** `Recommandée`
> `Preuve élevée` — Proposé parce que : DFG < 60 et Remplacement d'un agent sans bénéfice sur critère
> dur (gliptine, sulfamide)
>
> **Traitement à alléger — gestes cumulables**
> *OPTIONS ÉQUIVALENTES SUR LES DONNÉES DISPONIBLES : L'OUTIL NE LES DÉPARTAGE PAS, LE CHOIX REVIENT
> AU PRATICIEN.*
> **Désintensifier : alléger / arrêter le sulfamide, le glinide ou réduire l'insuline** `Recommandée`
> `Preuve faible`
> **Réduire la posologie de l'insuline (sur‑basalisation / hypoglycémie)** `Recommandée` `Preuve faible`
> **Réduire la posologie du sulfamide (tolérance, hypoglycémie légère)** `Recommandée` `Preuve faible`
>
> Introduire un AR GLP‑1 **écarté : IMC (kg/m²) < 22 et Dénutrition / carence**

### Test des 20 secondes

Écrit sans relire :

> « Cible sous 9 %. J'allège : sulfamide et/ou insuline, l'outil ne tranche pas entre les deux. Il y
> a trois cartes qui disent à peu près la même chose. Et il me propose quand même d'ajouter une
> gliflozine, ce qui m'a fait tiquer. Le GLP-1 est exclu parce qu'elle est maigre. »

**Écart** : je n'ai **pas** retenu l'alerte qui répond exactement à ma question — « **Envisager
d'arrêter le sulfamide** … surtout à l'introduction ou à l'intensification de l'insuline ». Elle
est au-dessus des cartes, dans un bandeau bleu clair parmi trois autres bandeaux, et elle s'est
noyée. **La seule phrase de l'écran qui tranche mon dilemme est celle que je n'ai pas retenue.**

### L'écart

**Ce que l'outil m'apporte.** Il **reconnaît la désescalade** : « Déprescrire » est une intention de
plein droit, et l'écran produit bien trois gestes d'allègement. Sur le point de principe qui
m'inquiétait le plus (« si l'outil ne sait que monter, il est inutile chez un quart de ma
patientèle »), **la réponse est rassurante**. La cible relevée à < 9 % est produite proprement,
avec son motif nommé.

**Défauts et incohérences, par gravité.**

1. **⚠ Le plus grave de la vignette — « Agent à ajouter : Introduire un iSGLT2 » chez une patiente de
   88 ans dénutrie, IMC 20,7, qui saute des repas, en cours de déprescription.** La carte porte
   `Recommandée` + `Preuve élevée`, **les badges les plus forts de l'écran**, et elle est placée
   **au-dessus** du groupe « Traitement à alléger ». Deux points visibles à l'écran :
   - **asymétrie de terrain** : l'AR GLP‑1 est explicitement écarté (« IMC < 22 **et** Dénutrition »)
     tandis que l'iSGLT2 n'est filtré par **aucun** de ces deux critères, alors que je le crains
     davantage chez elle (jeûne + acidocétose euglycémique) ;
   - **hiérarchie visuelle inversée** : sur une consultation dont j'ai *déclaré* que l'intention est
     de déprescrire, le geste d'ajout s'affiche avant les gestes de retrait.
   L'outil s'en explique d'avance dans un pavé (« Si un geste d'ajout s'affiche malgré tout… jamais
   une contradiction ») — mais un pavé de six lignes ne compense pas un badge « Recommandée ».
   *Note : d'après `plans/P7/index.md`, l'asymétrie iSGLT2/AR GLP-1 chez le dénutri a été tranchée
   « sans action » le 2026-07-29. Je signale donc ce que l'écran produit, sans rouvrir le fond
   — **question clinique**.*
2. **« Metformine — instaurer ou poursuivre » chez une patiente qu'on déprescrit**, sans nuance
   d'âge, avec le badge `Recommandation officielle (France)`. Là encore la carte est correcte en
   soi, mais son voisinage dit le contraire de la consultation.
3. **Trois cartes d'allègement qui se recouvrent** (« Désintensifier : alléger/arrêter le sulfamide,
   le glinide ou réduire l'insuline » + « Réduire la posologie de l'insuline » + « Réduire la
   posologie du sulfamide »), toutes `Recommandée` `Preuve faible`, sous une bannière disant que
   l'outil ne les départage pas. Trois formulations pour deux gestes.
4. **Jargon de projet dans une alerte clinique** : « …ou l'ajustement de l'insuline (**nœud E**) ».
   C'est la première fois que je vois « nœud E » **hors** du panneau technique — dans un bandeau
   d'alerte, à hauteur d'œil. Un médecin ne sait pas ce qu'est un « nœud E ».

**Ce qu'il ne dit pas.** À quelle vitesse baisser les 12 UI. Combien d'unités. Quand recontrôler.
Et rien sur les chutes, qui sont la raison même de ma démarche.

### En vraie consultation ?

**Oui pour la cible, non pour le traitement.** Le nœud « Fixer la cible » m'aurait donné en
45 secondes l'argument à écrire dans le dossier et à dire à la famille. Le nœud « Traiter » me
donne le bon principe mais dans un ordre qui me met mal à l'aise, et sans les modalités. Je
décrocherais à la carte « **Introduire un iSGLT2** » : à ce moment précis, je me demanderais si
l'outil a compris que je voulais **enlever** des médicaments à une femme de 88 ans qui a maigri de
5 kg.

---

## N8 — L'obésité, la demande porte sur le poids (Mme Sissoko, 41 ans)

> Page rechargée. Deux nœuds + un écran de module (« Traiter », puis module RHD → « Alimentation »).

### Rappel du témoin

**Histoire.** Mme Sissoko, 41 ans, ASH en horaires décalés, 3 enfants. DT2 depuis 4 ans.
**IMC 39,8** (109 kg / 1,66 m). Metformine 1000×2. **HbA1c 8,6 %.** TA 148/92 non traitée.
DFG 111. SAOS suspecté. Gonalgies. Budget très serré. Elle vient en disant : « je veux perdre du
poids, on m'a parlé des piqûres ».

**Ma question.** Comment j'articule sa demande avec la mienne ? **Qu'est-ce que je lui promets,
chiffré ?** Et à quel moment je parle de chirurgie à IMC 39,8 ?

**Réponse que j'attends.** AR GLP-1 avec un ordre de grandeur de perte de poids et de baisse
d'HbA1c, un programme structuré côté RHD, et au minimum une phrase sur la chirurgie.

**Incertitude.** Moyenne.

### Déroulé de saisie, chiffré

- **Écrans ouverts** : **3** (« Traiter » · écran d'aiguillage du module RHD · « Alimentation »).
- **Actions** : **28**, et **je me suis arrêté avant la fin** du questionnaire alimentaire.
  - « Traiter » : 18 (jusqu'à « Accepte » pour l'injectable, + ← Domaine)
  - Module RHD : 2 (Règles hygiéno-diététiques · Alimentation)
  - « Alimentation » : 8 (Suivant · les **7 questions** de la section « Habitudes alimentaires »)
- **Temps** : ~7 minutes, dont 3 sur le seul questionnaire alimentaire.
- **Je n'ai pas fini** : il restait **8 champs** (« Vers le motif méditerranéen » ×4, « Repérage »
  ×1, « Approfondissement » ×3). Le nœud Alimentation compte **15 champs au total**. En consultation
  je m'arrête là où je me suis arrêté.

**Champs voulus, absents** : le **poids et la taille en kg/cm** (je saisis un IMC calculé),
le **tour de taille**, la **TA** (148/92 non traitée, c'est un vrai sujet chez elle), le **SAOS**,
et surtout — **aucun champ ne permet de dire que la demande du patient porte sur le poids**.

### Réponse obtenue, verbatim

**Nœud « Traiter » :**

> **Socle** — Metformine (socle du traitement) — instaurer ou poursuivre
>
> **Agent à ajouter — en choisir un**
> **Introduire un AR GLP‑1 (liraglutide, sémaglutide, dulaglutide)** `Recommandée` `Preuve modérée`
> — Proposé parce que : IMC (kg/m²) ≥ 30 et Palette glycémique ouverte…
> (déplié) MACE HR ~0,87‑0,88 ; NNT ~18 en prévention secondaire, ~60‑70 en primaire. Rénal dur =
> sémaglutide (FLOW, HR 0,76). **Délai du bénéfice : 2 ans (sémaglutide) à 5,4 ans (dulaglutide)**
> … « forte efficacité HbA1c et **perte de poids** » …
> **Introduire un iSGLT2** `Preuve élevée`
> **Introduire le tirzépatide (obésité — prescription spécialisée)** `Preuve modérée`
> *OPTIONS ÉQUIVALENTES SUR LES DONNÉES DISPONIBLES…*
> **Gliptine (sitagliptine) — option glycémique orale de bas rang (place résiduelle)** `Preuve modérée`
> **Sulfamide (gliclazide MR ou glimépiride) — option de bas rang, derrière la gliptine** `Preuve modérée`

**Module RHD — écran d'aiguillage** (texte de cadrage, verbatim partiel) :

> Ces deux nœuds suggèrent des pistes de RAPPROCHEMENT d'un repère démontré ; ils ne fixent jamais un
> objectif chiffré à atteindre… **Hors périmètre des deux nœuds : l'objectif de perte de poids et la
> rémission**, la prescription diététique détaillée (orientation vers le diététicien de la structure)
> et le bilan d'aptitude physique.
> **Quel levier travailler avec ce patient aujourd'hui ?**

**Nœud « Alimentation » :**

> **Boissons** — **Remplacer une boisson sucrée du quotidien par de l'eau** `Recommandée` `Preuve modérée`
> **Ultratransformés** — **Un repas simple fait maison de plus par semaine** `Recommandée` `Preuve faible`
> **Restauration rapide** — **En restauration rapide, choisir mieux plutôt que s'interdire d'y aller**
> `Recommandée` `Preuve modérée`
> **Matières grasses** — **Utiliser de l'huile d'olive pour la cuisson et l'assaisonnement, à la place
> du beurre** `Recommandée` `Preuve faible`
> **Structure des repas** — **Se fixer des repas à des horaires à peu près réguliers** `Recommandée`
> `Preuve faible`
> **Autres pistes possibles (2)** → « Ne pas remplacer une boisson sucrée par des édulcorants
> intenses » · « Repérer un moment de grignotage récurrent et lui trouver une alternative »

### Test des 20 secondes

Écrit sans relire :

> « GLP-1, recommandé, parce qu'elle a un IMC au-dessus de 30. Le tirzépatide existe aussi mais c'est
> une prescription spécialisée. Côté alimentation : remplacer une boisson sucrée par de l'eau, un
> repas fait maison de plus par semaine, huile d'olive, horaires réguliers. »

**Écart** : j'ai bien retenu la conduite, et **les phrases alimentaires sont mémorisables telles
quelles — je peux les redire au patient mot pour mot**, ce qui est exactement ce que je demandais.
Mais je n'ai retenu **aucun chiffre de perte de poids**, parce qu'il n'y en a aucun : la carte
AR GLP-1 dit « forte efficacité HbA1c et perte de poids », qualitatif. Sur le seul point qui fait
tenir cette patiente six mois, l'outil ne donne rien.

### L'écart

**Ce que l'outil m'apporte.** Le nœud **Alimentation est une vraie réussite** : cinq gestes
**négociables, concrets, formulés du côté du patient**, chacun rattaché à ce que j'ai déclaré
(« Proposé parce que : Restauration rapide = Fréquent »). « Choisir mieux **plutôt que** s'interdire
d'y aller » est une phrase que je vais reprendre. Et le plafond d'affichage est **expliqué** :
« Une consultation ne permet d'en négocier que deux ou trois, l'écran en déplie donc au plus 5 ».
C'est la meilleure page de tout l'outil du point de vue de la conduite de consultation.

**L'écran d'aiguillage du module RHD est le seul endroit de l'application qui me dit par où
commencer.** « Quel levier travailler avec ce patient aujourd'hui ? », suivi de trois puces
descriptives par axe (« Le patient décrit spontanément ce qu'il mange, ou vous demande "quoi
manger" »). C'est exactement ce qui manque à l'écran d'accueil du domaine DT2, qui aligne cinq
entrées sans dire laquelle ouvrir.

**Ce qu'il ne dit pas, et c'est le cœur de ma consultation.**
1. **Aucun chiffre de perte de poids**, nulle part. Ni kg, ni %, ni délai.
2. **Aucune mention de chirurgie bariatrique** à IMC 39,8 avec DT2 — et le module RHD dit
   explicitement que « l'objectif de perte de poids et la rémission » sont **hors périmètre**.
   L'outil est donc honnête, mais **muet sur la question posée par la patiente**. Aucun des six
   écrans ne traite du poids en tant que tel.
3. Rien sur sa TA à 148/92 non traitée (hors domaine, mais personne ne me le signale).

**Défauts d'affichage.**
- **Cinq cartes « Recommandée » de rang égal côté alimentation**, sans ordre de priorité. En
  15 minutes j'en négocie une. L'outil sait qu'il ne peut en négocier « que deux ou trois » — il le
  dit — mais il ne me dit pas **laquelle**.
- **Un sulfamide et une gliptine sont proposés à une femme de 41 ans obèse** dans le même groupe
  « Agent à ajouter » que le GLP-1, sous la bannière « options équivalentes ». Elles sont bien
  marquées « de bas rang », mais la bannière « OPTIONS ÉQUIVALENTES … L'OUTIL NE LES DÉPARTAGE PAS »
  s'insère **au milieu** du groupe, de sorte qu'on ne voit pas immédiatement à quelles cartes elle
  s'applique.

### En vraie consultation ?

**Oui pour le nœud Alimentation, oui une fois pour « Traiter », non pour répondre à sa question.**
Je rouvrirais le nœud Alimentation régulièrement — c'est du matériel de consultation directement
utilisable. Mais Mme Sissoko est venue pour maigrir, et je repars sans un seul chiffre à lui
donner. Je décrocherais au questionnaire alimentaire : **7 questions d'affilée sur ce qu'elle mange,
c'est un temps d'interrogatoire que je n'ai pas** — et il en restait 8 après.

---

## N9 — Le patient motivé qui veut « faire du sport » (M. Ould-Amara, 53 ans)

> Page rechargée. Nœud « Activité physique » du module RHD. (Le nœud « Alimentation », deuxième
> volet de ma question, a été couvert en N8 — je ne l'ai pas rejoué.)

### Rappel du témoin

**Histoire.** M. Ould-Amara, 53 ans, comptable, **sédentaire complet**. DT2 depuis 2 ans,
metformine 850×2. HbA1c 7,6 %. IMC 31,0. DFG 92. Pas d'ATCD CV, ECG de repos normal il y a 6 mois.
Pas de neuropathie, pas de rétinopathie, pouls périphériques présents. Sa femme s'est mise à la
course, **il me demande une ordonnance de sport sur ordonnance**. Tabac arrêté il y a 3 mois, +4 kg.

**Ma question.** (a) qu'est-ce que je lui prescris — **quel type, quelle durée, quelle fréquence**,
et **est-ce que je dois faire une épreuve d'effort avant de le laisser courir** ? (b) côté
alimentation, quelque chose qui ne soit pas « mangez équilibré ».

**Réponse que j'attends.** Minutes par semaine, mélange endurance/renforcement, progressivité, et
un critère clair pour l'avis cardiologique préalable.

**Incertitude.** Moyenne — c'est le domaine où je suis le moins outillé.

### Déroulé de saisie, chiffré

- **Écrans ouverts** : 2 (aiguillage du module + nœud « Activité physique »).
- **Actions** : **14** (Aide à la décision · Règles hygiéno-diététiques · Activité physique ·
  Rien à signaler · Suivant · Jamais · Moins de 10 minutes · En voiture ou transport assis ·
  Plus de 8 h · Rien à signaler · Suivant · Rien à signaler · Suivant · Rien à signaler).
- **Temps** : ~3 minutes. **Formulaire entièrement complété**, contrairement au nœud Alimentation.

**Défaut de formulaire rencontré, net.** J'ai répondu « **Jamais** » à « Séances d'activité physique
structurée ». L'écran m'a **quand même réclamé** « **Durée d'une séance** » en la marquant
« · à confirmer », avec les choix « Moins de 10 minutes / 10 à 30 / Plus de 30 ». **Un patient qui
ne fait jamais de séance n'a pas de durée de séance.** J'ai été obligé de saisir une valeur fausse
(« Moins de 10 minutes ») pour faire disparaître le « à confirmer ». Reproduction : ouvrir
« Activité physique », section « Habitudes », cliquer « Jamais », regarder le champ suivant.
*(À comparer avec le nœud « Traiter », qui lui masque bien « Dose de metformine » tant que la
metformine n'est pas cochée : le masquage conditionnel existe dans le produit, il n'est simplement
pas appliqué ici.)*

**Champs voulus, absents** : l'**ECG déjà fait il y a 6 mois** (aucun moyen de le déclarer, alors
que c'est ce qui détermine si j'ai besoin d'un examen de plus), le **sevrage tabagique récent**,
et **ce que le patient veut faire** (courir) — le nœud ne demande jamais le projet du patient.

### Réponse obtenue, verbatim

> **Rupture de sédentarité — gestes cumulables**
> **Se lever et bouger quelques minutes à chaque heure de position assise prolongée** `Recommandée`
> `Preuve faible`
> *OPTIONS ÉQUIVALENTES…*
> **S'appuyer sur un repère du quotidien pour penser à se lever (téléphone hors de portée, appel
> pris en marchant)** `Recommandée` `Preuve faible`
> **Transformer une pause déjà prise dans la journée en occasion de bouger quelques instants**
> `Recommandée` `Preuve faible`
>
> **Activité quotidienne** — **Intégrer du mouvement dans les tâches déjà présentes dans la journée
> (escaliers, ménage, jardinage, courses portées)** `Recommandée` `Preuve modérée`
>
> **Pratique structurée — gestes cumulables**
> **Envisager un programme d'activité physique adaptée (endurance et renforcement), avec
> l'accompagnement d'un professionnel** `Recommandée` `Preuve faible`
> *(encadré)* **Une évaluation médicale minimale est recommandée avant de commencer ou d'augmenter
> une activité physique d'intensité au moins modérée, en particulier si le patient est actuellement
> inactif ou porteur d'un facteur de risque cardiovasculaire (HAS R.19). Avant l'effort, une glycémie
> très élevée (seuil de vigilance cité par la HAS : 2,5 g/L) expose à une instabilité glycémique — à
> vérifier par le patient lui-même, pas une donnée à recueillir dans ce nœud (HAS R.28).**
> (déplié) …**L'activité physique adaptée est une prise en charge réglementée (article D. 1172-1 du
> code de la santé publique)**, dispensée par un professionnel formé.
>
> **Autres pistes possibles (5)** → dont « Remplacer un trajet motorisé par la marche ou le vélo,
> **une à deux fois par semaine** »

### Test des 20 secondes

Écrit sans relire :

> « Se lever toutes les heures. Bouger dans les gestes du quotidien, escaliers. Et l'orienter vers
> un programme d'activité physique adaptée avec un pro — c'est encadré par la loi. Avant, il faut
> une évaluation médicale minimale parce qu'il est inactif. Et ne pas faire d'effort si la glycémie
> est au-dessus de 2,5. »

**Écart** : bonne restitution, et **j'ai retenu la référence à l'article D. 1172-1**, qui est
exactement ce dont j'ai besoin pour rédiger le « sport sur ordonnance » qu'il me demande. En
revanche je n'ai retenu **aucune durée ni fréquence** — parce qu'il n'y en a aucune : le mot
« minutes par semaine » n'apparaît nulle part dans le nœud.

### L'écart

**Ce que l'outil m'apporte.** Il répond à ma question (a) sur la sécurité — « évaluation médicale
minimale … si le patient est actuellement inactif ou porteur d'un facteur de risque
cardiovasculaire » — et il me donne le cadre réglementaire de l'APA, que je n'aurais pas su citer.
Les gestes de rupture de sédentarité sont concrets et directement dicibles (« téléphone hors de
portée », « appel pris en marchant »).

**Ce qu'il ne dit pas et que j'attendais.**
1. **Aucun volume chiffré.** Ni 150 min/semaine, ni nombre de séances, ni progression. Le seul
   chiffre du nœud est un seuil de sécurité (2,5 g/L) et une fréquence de trajet (« une à deux fois
   par semaine »).
2. **« Une évaluation médicale minimale » n'est pas définie.** Un ECG ? Une épreuve d'effort ? Un
   avis cardiologique ? C'est précisément ma question, et j'ai la moitié de la réponse — je sais
   *qu'il en faut une*, pas *laquelle*.
3. Rien sur la course à pied en particulier, alors que c'est son projet.

**Références internes non résolvables à l'écran.** Dans la carte « Pratique structurée » :
« …effet propre de ce geste isolé sur un critère dur non démontré (**voir la réserve majeure de ce
nœud**) » et « Réservée par construction aux patients sans contre-indication à l'effort connue
(**voir le verrou de sécurité**) ». Ni « la réserve majeure » ni « le verrou de sécurité » ne sont
des éléments identifiables sur l'écran ; ce sont des renvois de rédaction interne.

**Cinq cartes « Recommandée » + 5 repliées = 10 pistes.** Même remarque qu'en N8 : le plafond est
expliqué, l'ordre ne l'est pas.

### En vraie consultation ?

**Oui.** 3 minutes, formulaire complet, et je repars avec le cadre réglementaire de l'APA et un
critère de sécurité. C'est le domaine où je suis le plus faible, donc le gain relatif est important.
Je décrocherais au champ « **Durée d'une séance** » demandé après avoir répondu « Jamais » : à cet
endroit, l'écran me fait perdre confiance en lui.

---

## N10 — Sous insuline basale, mal équilibré, SANS capteur (M. Pereira, 62 ans)

> Page rechargée. Nœud « Insulinothérapie du DT2 ».
> **C'est le test de non-régression du défaut phare du 2026-07-28 : l'impasse sans capteur.**

### Rappel du témoin

**Histoire.** M. Pereira, 62 ans, maçon à son compte. DT2 depuis 18 ans. **Glargine 38 UI le soir**
+ metformine 1000×2 + gliclazide LM 60. HbA1c 9,3 %. Poids 91 kg / 1,72 m, +5 kg en 18 mois.
DFG 68. **Aucun capteur de glucose**, il n'en veut pas. Carnet : 6 valeurs sur le mois, **toutes le
matin, 1,70 à 2,40 g/L**. Aucune valeur en journée. Pas d'hypoglycémie ressentie.

**Ma question.** Basale insuffisante ou hyperglycémies post-prandiales ? **Je n'ai pas les données
pour trancher.** Je monte la glargine ? J'ajoute un AR GLP-1 plutôt qu'un bolus ? **Quelle
surveillance minimale compatible avec un chantier ?**

**Réponse que j'attends.** Une conduite qui accepte l'absence de capteur, une titration sur la
glycémie du matin, une autosurveillance réaliste, et que l'outil **dise ce qu'il ne peut pas
conclure**.

**Incertitude.** Forte.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1.
- **Actions** : **18** (Aide à la décision · Insulinothérapie · Basale seule · Suivant · HbA1c 9.3 ·
  **HbA1c cible 7** · DFG 68 · Poids 91 · Suivant · ☑Metformine · ☑Sulfamide · ☑Insuline basale ·
  Dose de basale 38 · Suivant · Rien à signaler · GAJ 1.95 · Suivant · Rien à signaler).
- **Temps** : ~4 minutes. **Formulaire complet, aucune impasse.**

**Masquage exemplaire.** Le nœud annonce **19 champs** à l'ouverture. Décocher « MCG disponible »
(qui reste à non) **a fait disparaître d'un coup** « TBR — temps sous 70 mg/dL », « Coefficient de
variation glycémique » et « Profil glycémique (lecture AGP) ». Je suis descendu à **12 champs
effectivement demandés**. C'est le meilleur masquage conditionnel de l'application.

**Aide à la saisie remarquable.** Sous le champ « Glycémie à jeun habituelle (g/L) » :

> Reportez la valeur **HABITUELLE des 3 derniers matins**, pas la dernière mesure. Une seule
> glycémie basse isolée ne justifie pas de réduire la dose ; c'est sa **répétition** qui compte.

C'est la seule aide de saisie de tout l'outil qui m'explique **comment** répondre. Il en faudrait
partout (cf. « Risque hypoglycémique du schéma », N3).

**Incohérence entre nœuds relevée** : ce nœud demande **« HbA1c cible (%) » en chiffre** et
**« Poids (kg) »** ; le nœud « Traiter » demande la **position** par rapport à la cible (pas la
cible chiffrée) et l'**IMC** (pas le poids). Deux nœuds qui parlent de la même chose avec deux
unités différentes, sans conversion entre eux.

**Champs voulus, absents** : son **métier** (chauffeur/maçon — le risque d'hypoglycémie
professionnelle ne se déclare nulle part), la **prise de poids récente** (+5 kg), et le fait qu'il
**refuse** le capteur (il n'y a qu'un « MCG disponible » oui/non, pas de « refusé par le patient »).

### Réponse obtenue, verbatim

Alertes rendues :

> À l'introduction ou l'intensification de l'insuline : arrêter le sulfamide / le glinide (risque
> d'hypoglycémie cumulée).

> **Sans MCG : titrer la basale sur la glycémie à jeun (cible ~0,70-1,30 g/L) ; utiliser des profils
> capillaires 6-7 points (avant/après les 3 repas + coucher) pour guider l'intensification
> prandiale.**

Cartes :

> **Avant de décider — la mesure — gestes cumulables**
> **Envisager d'instaurer une mesure continue du glucose** `Recommandée` `Preuve modérée`
>
> **Intensifier le traitement — gestes cumulables**
> **Titrer la basale (augmenter la dose)** `Recommandée` `Preuve modérée`
> **Doses indicatives : Basale après +2 U ≈ 40 U/j**
> Proposé parce que : Situation d'insulinothérapie = Basale seule et HbA1c à la cible : non et MCG
> disponible : non et **Glycémie à jeun au-dessus de la cible (> 1,30 g/L)**
> (déplié) **Avantages** • Glycémie à jeun au-dessus de la cible sans hypoglycémie : **+2 U si elle
> reste au-dessus de la cible 3 matins de suite** (ebmfrance), ou **+10 % par paliers si la dose
> dépasse 40 U/j** (SFD 2025, Avis 18) ; **réévaluer tous les 3 jours** (HAS 2024, R.87 — accord
> d'experts). • …~60 % des patients atteignent la cible d'HbA1c (Treat-to-Target).
> **Inconvénients** • Risque d'hypoglycémie si sur-titration… • **Sans capteur, une part importante
> des hypoglycémies reste invisible : dans une étude dédiée, 93 % des épisodes n'étaient pas détectés
> par une autosurveillance à 4 mesures par jour (Munshi). Titrer sans capteur se fait donc sur une
> information incomplète — c'est une raison de prudence, pas de renoncement.**

### Test des 20 secondes

Écrit sans relire :

> « Je monte la glargine de 2 unités, à 40. Je recontrôle tous les 3 jours, et je remonte de 2 si la
> glycémie du matin reste au-dessus de la cible trois matins de suite. La cible du matin c'est
> 0,70-1,30. J'arrête le gliclazide. Et je lui propose quand même un capteur. Sans capteur je rate
> la plupart des hypos. »

**Écart : nul, et c'est la meilleure restitution de la passe avec N5 et N6.** Chiffre de dose,
protocole de titration, rythme de réévaluation, cible de glycémie du matin, geste de sécurité sur
le sulfamide, et la réserve honnête sur ce que je ne vois pas. **Tout est passé en 20 secondes.**

### L'écart

**Ce que l'outil m'apporte — et c'est le retournement de la passe.**
**L'impasse du 2026-07-28 n'existe plus.** Non seulement l'outil ne bloque plus sans capteur, mais
il produit **une conduite complète et chiffrée** dans ce cas précis :
- il **répond à ma question** (« basale ou post-prandial ? ») en tranchant sur la donnée que j'ai :
  GAJ 1,95 > 1,30 → **c'est la basale** ;
- il **calcule la dose suivante** (« Basale après +2 U ≈ 40 U/j ») — la seule aide au calcul de tout
  l'outil ;
- il **donne le protocole** (+2 U si ≥ cible 3 matins de suite, +10 % au-delà de 40 U/j, réévaluer
  tous les 3 jours) ;
- il **dit ce qu'il ne peut pas voir** (93 % des hypos non détectées par 4 mesures/jour) **sans en
  faire un motif de renoncement** — exactement la formulation que je réclamais ;
- et il propose le capteur **en premier groupe** (« Avant de décider — la mesure ») sans en faire un
  prérequis bloquant.

**Ce qu'il ne dit pas et que j'attendais.**
1. **L'AR GLP-1 n'apparaît pas** — ni en carte, ni comme option écartée lisible. Il est bien dans le
   moteur (« Ajouter un GLP-1 / une association fixe d'abord ») mais ses conditions ne sont pas
   remplies (GAJ pas encore à la cible, dose 38 U pour 91 kg = 0,42 U/kg, sous le seuil de
   sur-basalisation à 0,5). C'est cohérent — mais chez un patient qui a pris 5 kg, j'aurais aimé
   qu'on me le dise en une ligne plutôt que d'avoir à ouvrir le panneau booléen pour le comprendre.
2. **Le « profil capillaire 6-7 points » n'est pas prescriptible tel quel** : combien de jours ?
   Une fois ? Toutes les semaines ? Ma question était « une surveillance compatible avec un
   chantier », et l'information est là mais pas cadrée dans le temps.

**Défaut de forme.** « Pourquoi pas d'autres options ? » est ici encore plus illisible qu'ailleurs :
une seule option (« Ajouter un GLP-1 / une association fixe d'abord ») affiche **une expression de
neuf termes** enchaînant `ou` et `et` sans parenthèses, occupant six lignes.

### En vraie consultation ?

**Oui, sans réserve, et c'est le nœud que j'ouvrirais le plus volontiers après « Fixer la cible ».**
4 minutes, une dose calculée, un protocole. C'est le seul écran de l'outil qui produit quelque chose
que je peux **recopier directement sur une ordonnance**. Je ne décroche nulle part.

---

## N11 — Sous insuline AVEC capteur, hypoglycémies nocturnes (Mme Renard, 68 ans)

> Page rechargée. Nœud « Insulinothérapie du DT2 ». Contrepoint de N10.

### Rappel du témoin

**Histoire.** Mme Renard, 68 ans. DT2 depuis 21 ans. **Glargine 34 UI + asparte 8‑8‑8**, metformine
arrêtée pour intolérance. **HbA1c 7,0 % — exactement sa cible.** IMC 26,4 (72 kg). DFG 63.
**Capteur depuis 8 mois** : TIR 61 %, **TBR 9 %** essentiellement entre 2 h et 5 h, **CV 41 %**.
Sueurs nocturnes, réveils « vaseux » 2‑3 fois/semaine. Vit seule.

**Ma question.** HbA1c parfaite, 9 % du temps en hypoglycémie nocturne. **Qu'est-ce que je baisse
en premier — la basale du soir ou l'asparte du dîner ? Et de combien ?** Est-ce que l'outil sait
lire un capteur ou ne raisonne-t-il que sur l'HbA1c ?

**Réponse que j'attends.** Que 9 % soit signalé comme très au-dessus du seuil, que 41 % de CV soit
excessif, et que la basale baisse en priorité. **Je veux voir la sécurité passer devant le chiffre
d'HbA1c.**

**Incertitude.** Moyenne.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1.
- **Actions** : **25**, dont **2 allers-retours** entre sections pour trouver un champ (voir défaut
  ci-dessous).
- **Temps** : ~6 minutes.

**Défaut net — deux étiquettes contradictoires sur le même écran, pour le même champ.**
La carte de recommandation affichait :

> **Doses non calculées : Dose totale quotidienne — à renseigner : Dose de basale actuelle (U/j),
> Dose de rapide actuelle (U/j)**

… tandis que le formulaire, section « Traitement actuel », étiquetait ces deux mêmes champs :

> Dose de basale actuelle (U/j) **· sans effet sur la reco actuelle**
> Dose de rapide actuelle (U/j) **· sans effet sur la reco actuelle**

**La carte me demande de renseigner ce que le formulaire me dit inutile.** J'ai suivi le formulaire
d'abord, puis j'ai fait demi-tour parce que la carte insistait. Et **les remplir a bien changé
l'affichage** (« Doses indicatives : Dose totale quotidienne ≈ 58 U/j »), donc c'est l'étiquette
« sans effet » qui est fausse. Reproduction : nœud Insuline, situation « Basal-bolus », MCG coché,
TBR 9, CV 41, AGP = Hypoglycémie nocturne → comparer la mention sous la carte et la mention sous les
deux champs de dose.

**Aggravant** : dans le parcours « Suivant → » la section « Traitement actuel » s'affichait
« **Aucun champ renseigné** » **sans badge « à confirmer »**, donc sans aucun signal qu'elle
contenait quoi que ce soit d'utile. J'ai dû cliquer sur son titre pour découvrir les champs.

**Bug connu du projet, apparemment corrigé** : `STATUS.md` liste « GAJ reste réclamé même quand
`mcg_disponible` est coché ». Ici, capteur coché, le champ « Glycémie à jeun habituelle » est bien
présent mais marqué « **· sans effet sur la reco actuelle** » et **ne compte pas** dans les
« à confirmer ». Il n'est donc plus réclamé. (Il reste affiché, ce qui est discutable, mais il ne
bloque plus.)

**Champs voulus, absents** : le **temps dans la cible (TIR 61 %)** — l'outil demande le TBR et le CV
mais pas le TIR, alors que c'est la première ligne du rapport de capteur que je regarde ; l'**heure**
des hypoglycémies au-delà de la case « nocturne » ; et le fait qu'elle **vive seule** (majeur pour
une hypo nocturne).

### Réponse obtenue, verbatim

Alerte :

> Orienter vers le spécialiste (± pompe à insuline / boucle fermée = centres initiateurs) si le
> déséquilibre PERSISTE malgré l'optimisation, ou en situation particulière : hypoglycémies sévères
> récurrentes / non-perception, instabilité marquée (CV élevé, temps en hypoglycémie sévère),
> grossesse ou projet de grossesse. En attendant : relâcher l'objectif, envisager une 2ᵉ génération,
> éduquer, envisager une MCG.

Cartes :

> **Ajuster le schéma en place — gestes cumulables**
> **Optimiser la répartition du basal-bolus (guidé par l'AGP et les doses actuelles)** `Recommandée`
> `Preuve faible` — **Doses indicatives : Dose totale quotidienne ≈ 58 U/j**
> (déplié) **Avantages** • …équilibrer basal/bolus (~50/50) et ajuster à partir des doses actuelles.
> AVEC capteur, guidé par le profil AGP — **hypo nocturne → réduire la basale** ; phénomène de l'aube
> → augmenter la basale ; excursions post-prandiales → augmenter le bolus / avancer le timing ; hypo
> interprandiale → réduire le bolus…
> **Inconvénients** • Le calcul formel des ratios glucides-insuline et du facteur de sensibilité
> n'est pas inclus (éducation spécialisée)…
>
> **Alléger le schéma — gestes cumulables**
> **Désintensifier / alléger le schéma** `Recommandée` `Preuve faible` — Proposé parce que :
> Situation d'insulinothérapie = Basal-bolus et Risque hypoglycémique élevé…

### Test des 20 secondes

Écrit sans relire :

> « Hypo nocturne au capteur → je baisse la basale. Elle est à 58 unités par jour au total, il faut
> viser à peu près 50/50 entre basale et bolus. Et je peux alléger le schéma parce que le risque
> hypoglycémique est élevé. Si ça persiste, avis spécialisé, éventuellement pompe. »

**Écart** : la **règle de lecture de l'AGP** (« hypo nocturne → réduire la basale ; aube → augmenter
la basale ; post-prandial → augmenter le bolus ») est passée intégralement et c'est la meilleure
chose de cette page — c'est un mini-abaque que je vais retenir. Mais **je n'ai retenu aucune
quantité**, parce qu'il n'y en a pas : « réduire la basale », sans % ni unités, alors que le nœud
sait donner « +2 U » dans le cas basale seule (N10). **L'asymétrie est frappante : le tool calcule
une dose quand il faut monter, pas quand il faut descendre.**

### L'écart

**Ce que l'outil m'apporte.** Il **lit le capteur** : TBR et CV entrent réellement dans la décision
(les deux figurent dans le « Proposé parce que »). Il fait bien **passer la sécurité devant le
chiffre d'HbA1c** — à 7,0 %, pile sur sa cible, il ne me félicite pas, il me propose d'alléger.
C'est exactement ce que je voulais vérifier, et c'est réussi.

**Ce qu'il ne dit pas.**
1. **Aucune quantité de baisse.** « Réduire la basale » : de 10 % ? de 4 U ? Sur un patient qui vit
   seul et fait des hypos nocturnes, c'est la seule chose qui compte.
2. **Aucun commentaire sur les seuils du capteur eux-mêmes.** Je m'attendais à lire quelque part que
   9 % de TBR est très au-dessus de la limite habituelle (< 4 %) et que 41 % de CV dépasse 36 %.
   Les seuils sont dans le moteur (ils apparaissent dans le « Proposé parce que » sous forme
   `TBR > 4`, `CV > 36`) mais **jamais commentés en français** : je dois déduire la norme d'une
   expression booléenne.
3. La « **Dose totale quotidienne ≈ 58 U/j** » est simplement la somme de ce que je viens de taper
   (34 + 24). Présentée comme « Doses indicatives », elle promet un calcul et rend une addition.

**Observation, sans jugement de fond (question clinique).** La carte de l'outil intitulée
« **Corriger l'hypoglycémie ou la variabilité (réduire la dose, passer en 2ᵉ génération, relâcher la
cible)** » — celle dont le titre correspond mot pour mot à ma situation — **n'est pas disponible en
basal-bolus** : son motif d'exclusion affiché est « Situation d'insulinothérapie = Basale seule ou
Basal-plus / bolus ». Autrement dit, la carte qui parle de corriger l'hypoglycémie est fermée
précisément dans le schéma qui en fait le plus.

### En vraie consultation ?

**Oui, mais avec une réserve.** J'ouvrirais ce nœud pour la règle de lecture de l'AGP, qui vaut à
elle seule le détour. Mais je repartirais sans savoir de combien baisser, donc je le ferais « au
jugé » comme avant. Je décrocherais aux **deux champs de dose étiquetés « sans effet sur la reco
actuelle »** alors que la carte les réclame : à ce moment-là je ne sais plus qui croire de l'écran
ou de l'écran.

---

## N12 — L'HbA1c à laquelle je ne crois pas (Mme Diallo, 57 ans)

> Page rechargée. Nœud « Traiter ».
> **Vignette ciblée sur l'arbitrage P7 n°4 (signalement de validité de l'HbA1c).**

### Rappel du témoin

**Histoire.** Mme Diallo, 57 ans, aide à domicile. DT2 depuis 9 ans, metformine 1000×2 +
sitagliptine 100. **HbA1c 6,4 %**, rendue telle quelle par le laboratoire. Mais :
**drépanocytose hétérozygote AS**, **anémie ferriprive à 9,8 g/dL** (ferritine 11, ménorragies),
et **transfusion de 2 culots il y a 6 semaines**. IMC 26,7. DFG 88. Pas d'ATCD CV.
**Glycémies capillaires : 1,90 g/L à jeun, 2,60 g/L en post-prandial.**

**Ma question.** Son HbA1c dit 6,4 % et ses glycémies disent tout autre chose. **Est-ce que l'outil
me met en garde ?** Et si je ne peux pas me servir de l'HbA1c, sur quoi je décide ?

**Réponse que j'attends.** Un signalement visible, dès l'ouverture du nœud, disant que l'HbA1c peut
être ininterprétable (anémie, hémoglobinopathie, transfusion récente).

**Incertitude.** Faible sur le fait que le chiffre est faux, forte sur ce que je fais ensuite.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1.
- **Actions** : **18** (Aide à la décision · Traiter · Optimiser · Suivant · ☑Metformine ·
  ☑Gliptine · HbA1c 6.4 · **En dessous de l'objectif (sur-traitement probable)** · Dose 2000 ·
  Suivant · DFG 88 · Normoalbuminurie · IMC 26.7 · Suivant · Rien à signaler · Suivant ·
  Rien à signaler · Indifférent).
- **Temps** : ~4 minutes.

**Champs voulus, absents — et ils sont le cœur de la vignette** : **aucun moyen de déclarer une
anémie**, une **hémoglobinopathie**, une **transfusion récente**, une **hépatopathie**. Et **aucun
champ pour les glycémies capillaires** dans ce nœud (le nœud Insuline en a un, pas celui-ci).
Autrement dit : **la seule donnée fiable que j'ai sur cette patiente — ses glycémies — ne peut être
saisie nulle part sur l'écran qui décide de son traitement.**

### Réponse obtenue, verbatim

En tête de nœud : **rien**. Le nœud « Traiter » n'a **aucun bloc de cadrage** (à la différence du
nœud « Statine », qui en a un sur les cibles de LDL, et du nœud « Insuline », qui en a un sur
ORIGIN). Le seul texte de tête est la description du périmètre.

> **OPTIONS APPLICABLES**
> **Socle** — Metformine (socle du traitement) — instaurer ou poursuivre
> **Traitement à corriger ou remplacer** — **Remplacer la gliptine (aucun bénéfice sur critère dur —
> préférer un agent qui en apporte)** `Recommandée` `Preuve modérée`
> **Agent à ajouter — en choisir un**
> *OPTIONS ÉQUIVALENTES SUR LES DONNÉES DISPONIBLES…*
> **Introduire un iSGLT2** `Recommandée` `Preuve élevée`
> **Introduire un AR GLP‑1** `Recommandée` `Preuve modérée`

**Vérification textuelle de l'écran complet** (recherche sur le texte rendu, après saisie complète) :
les mots « **anémie** », « **cirrhose** », « **hémoglobin…** », « **transfusion** »,
« **interprétation / interprétable** », « **fiabilité** » — **aucun n'apparaît**. La seule occurrence
de « valid… » est « Suggestion auto … — à **valid**er ».

### Test des 20 secondes

Écrit sans relire :

> « Je garde la metformine, je remplace la sitagliptine par une gliflozine ou un GLP-1. Rien ne m'a
> parlé de son anémie ni de sa drépanocytose. »

**Écart** : la conduite est claire, et **c'est justement le problème** : l'outil m'a donné une
recommandation ferme sur une HbA1c que je sais fausse, sans l'ombre d'une réserve, et il a accepté
sans broncher que je déclare « **sur-traitement probable** » chez une patiente dont les glycémies
sont à 1,90 et 2,60 g/L.

### L'écart

**Arbitrage P7 n°4 — NON RENCONTRÉ À L'ÉCRAN.** Aucun signalement de validité de l'HbA1c n'apparaît,
ni sur le nœud « Traiter », ni sur le nœud « Insulinothérapie » (dont le cadrage porte sur ORIGIN),
ni sur le nœud « Fixer la cible » (qui n'a pas de cadrage du tout), ni sur le nœud « Statine » (dont
le cadrage porte sur les cibles de LDL). **C'est cohérent avec l'état du plan** : `plans/P7/index.md`
donne la session **SA2 (T-052/T-053) au statut `[ ]`, non livrée**. Le défaut du 2026-07-28 est donc
**inchangé au commit `cf1c780`** — non par régression, mais parce que le correctif n'est pas encore
posé.

**Conséquence clinique concrète, et elle est sérieuse.** Sur ce dossier, l'enchaînement produit par
l'outil est :
1. je saisis 6,4 % ;
2. je clique « En dessous de l'objectif (**sur-traitement probable**) » — c'est le libellé que
   l'outil me propose lui-même pour ce cas ;
3. l'outil accepte, et construit toute sa réponse sur ce socle.

Chez une patiente drépanocytaire AS, anémique et transfusée il y a six semaines, dont les glycémies
réelles sont à 2,60 g/L en post-prandial, **« sur-traitement probable » est exactement le contraire
de la vérité**. Rien à l'écran ne m'arrête.

**Deuxième incohérence, indépendante du P7.** J'ai déclaré la position « **En dessous de
l'objectif (sur-traitement probable)** » et l'outil m'affiche un groupe « **Agent à ajouter — en
choisir un** » avec deux cartes `Recommandée`. La justification dit « Remplacement d'un agent sans
bénéfice » — donc un échange, pas un ajout — mais **le titre du groupe dit « ajouter »** chez une
patiente déclarée sur-traitée. C'est la même ambiguïté ajouter/remplacer relevée en N3, et elle est
ici encore plus visible parce que la position saisie la contredit frontalement.

**Ce que je voudrais, a minima.** Une phrase neutre en tête de nœud, du type : « L'HbA1c peut être
faussée (anémie, hémoglobinopathie, transfusion récente, hépatopathie…) : en cas de doute, se fier
aux glycémies. » Zéro champ à saisir, zéro coût — et cette patiente ne repart pas avec une décision
bâtie sur un chiffre faux.

### En vraie consultation ?

**Non, pas pour cette patiente.** L'outil me donnerait une réponse assurée sur une donnée que je sais
fausse, et il n'offre aucun moyen de lui dire pourquoi. Je décrocherais au champ « **HbA1c
actuelle (%)** » — c'est là, à la première saisie, que j'aurais voulu voir un mot de prudence.

---

## N13 — L'agent mal toléré, et la patiente qui n'a rien (M. Vasseur 50 ans / Mme Petit 44 ans)

> Page rechargée entre 13a et 13b.
> **Vignette ciblée sur l'arbitrage P7 n°5 (« optimiser un agent mal toléré » conditionné à un
> traitement en cours), en positif puis en négatif.**

### Rappel du témoin

**13a — M. Vasseur, 50 ans**, chauffeur-livreur. DT2 depuis 3 ans. **Metformine 1000×2 mal
supportée** : diarrhées quotidiennes, 2 arrêts spontanés, LP essayée sans gain. HbA1c 8,0 %.
IMC 30,2. DFG 89. Pas d'ATCD CV. Il arrêtera si ça continue.

**13b — Mme Petit, 44 ans**, diagnostic la semaine dernière, HbA1c 7,1 %, **aucun traitement**,
IMC 26,2, DFG 101, aucun antécédent.

**Ma question.** 13a : je baisse la dose, je passe à la LP, ou je change de classe ?
13b : je veux vérifier que **l'outil ne me propose pas « optimiser le traitement mal toléré » chez
une patiente qui n'a aucun traitement**.

**Réponse attendue.** 13a : une proposition qui reconnaisse l'intolérance comme motif de changement
à part entière. 13b : une conduite d'initiation propre, sans carte parlant d'optimiser un traitement
existant.

### Déroulé de saisie, chiffré

- **13a** : 1 nœud, **19 actions**, ~4 min.
- **13b** : 2 nœuds (« Fixer la cible » puis « Traiter »), **11 actions**, ~2 min 30.

**Champ conditionnel bien fait.** Cocher « Intolérance à un traitement en cours » fait apparaître un
sous-champ « **Nature de l'intolérance** » (Digestive / Génito-urinaire / Perte de poids excessive /
Cutanée / Autre). Il n'existe pas tant que le drapeau n'est pas coché. C'est le bon comportement —
et c'est exactement ce qui manque au champ « Durée d'une séance » du nœud Activité physique (N9).

### Réponse obtenue, verbatim

**13a**, après « Intolérance = oui » + « Nature = Digestive » :

> **À faire d'emblée — sécurité — gestes cumulables**
> **Réduire la posologie de la metformine (fonction rénale altérée ou intolérance digestive)**
> `Mesure de sécurité` `Preuve faible`
> Proposé parce que : … Traitements en cours comprend Metformine et … Intolérance à un traitement en
> cours et **Nature de l'intolérance comprend Digestive**
> (déplié) **Inconvénients** • … Si l'intolérance persiste malgré la réduction : arrêt
> (**l'intolérance/CI metformine ouvre le remboursement d'une monothérapie AR GLP‑1**).
>
> **Socle du traitement** — **Metformine (socle du traitement) — instaurer ou poursuivre**
>
> **Agent à ajouter — en choisir un**
> **Introduire un AR GLP‑1** `Recommandée` `Preuve modérée` — Proposé parce que : IMC ≥ 30
> **Introduire le tirzépatide (obésité — prescription spécialisée)** `Preuve modérée`
>
> **Traitement à alléger — gestes cumulables**
> **Optimiser l'agent mal toléré : réduire la posologie (intolérance non majeure) ou remplacer**
> `Recommandée` `Preuve faible`

**13b — le test négatif.** Nœud « Traiter », intention « **Optimiser** », « Intolérance à un
traitement en cours » **cochée oui**, section « Traitement actuel et contrôle » laissée **vide**
(« 3 à confirmer · Aucun champ renseigné ») :

> **EN ATTENTE — CRITÈRES À RENSEIGNER POUR TRANCHER**
> *(aucune carte affichée)*

**La carte « Optimiser l'agent mal toléré » n'apparaît pas.** ✅

**13b — nœud « Fixer la cible »**, Âge 44 · Ancienneté 1 · rien à signaler · Espérance de vie
Longue :

> **Cible ~6,5 % (6,5–7 %)** `Recommandée` `Preuve faible`
> Proposé parce que : **Âge < 70 et Ancienneté du diabète (ans) < 5** et Espérance de vie = Longue et
> Antécédent cardiovasculaire : non et Comorbidité grave : non et Fragilité : non

### Test des 20 secondes

**13a**, écrit sans relire :

> « Je baisse la metformine à cause de l'intolérance digestive — c'est une mesure de sécurité, c'est
> en tête. Si ça ne suffit pas j'arrête, et l'intolérance metformine ouvre le remboursement d'un
> GLP-1 en monothérapie. Et comme il a un IMC à 30, le GLP-1 est recommandé de toute façon. »

**Écart : nul.** Et le détail qui compte — « **l'intolérance/CI metformine ouvre le remboursement
d'une monothérapie AR GLP‑1** » — est le genre d'information administrative que je n'ai jamais en
tête et qui change une prescription. C'est le seul endroit de l'outil qui parle remboursement.

### L'écart

**Arbitrage P7 n°5 — VU, et il fonctionne dans les deux sens.** En positif (13a, traitement coché)
la carte s'affiche ; en négatif (13b, aucun traitement déclaré) elle ne s'affiche pas et l'écran
passe en attente au lieu d'affirmer. **Défaut du 2026-07-28 corrigé.**

**Confirmation ferme du défaut relevé en N2 — « sans effet sur la reco actuelle » sur les champs
qui décident.** Reproduction complète :
- à l'ouverture du nœud « Fixer la cible », **Âge** et **Ancienneté du diabète** sont tous deux
  étiquetés « **· sans effet sur la reco actuelle** » ;
- une fois remplis (44 et 1), la recommandation **bascule** de « Cible ≤ 7 % » à « **Cible ~6,5 %
  (6,5–7 %)** », et la justification affichée nomme explicitement **« Âge < 70 et Ancienneté du
  diabète (ans) < 5 »**.

**Les deux champs annoncés « sans effet » sont exactement les deux champs qui déterminent la
réponse.** Un praticien qui prend l'étiquette au mot les saute et repart avec la mauvaise cible chez
tous ses diabétiques récents — c'est-à-dire chez les patients les plus fréquents.

**Incohérence de voisinage, troisième occurrence.** Sur le même écran 13a : « **Réduire la
posologie de la metformine** » (en tête, `Mesure de sécurité`) puis « **Metformine — instaurer ou
poursuivre** » (socle) puis « **Optimiser l'agent mal toléré : réduire la posologie … ou
remplacer** » (à alléger). **Trois cartes sur la metformine, dont deux qui disent « réduire » et une
qui dit « poursuivre »**, dans trois groupes différents. La logique de groupes est correcte ; la
lecture en dix secondes ne l'est pas.

**Le bloc « EN ATTENTE » toujours vide.** En 13b, l'écran affiche « EN ATTENTE — CRITÈRES À
RENSEIGNER POUR TRANCHER » **sans nommer un seul critère**. Or c'est précisément le moment où
j'aurais besoin qu'on me dise « il manque : les traitements en cours ». Quatrième occurrence du même
cartouche vide (N1, N2, N7, N13b).

### En vraie consultation ?

**13a : oui.** C'est un cas fréquent, la réponse est nette et elle m'apporte un élément pratique
(remboursement) que je n'ai pas. **13b : oui pour la cible** — 6 actions, 40 secondes — mais
uniquement si je sais que je dois remplir « Ancienneté du diabète » malgré l'étiquette qui me dit
le contraire. Je décrocherais exactement là.

---

## N14 — La statine chez celui qui n'en veut plus (M. Lombard, 58 ans)

> Page rechargée. Nœud « Prescrire une statine dans le DT2 ».
> **Deuxième vérification du badge « Mesure de sécurité » (arbitrage P7 n°3), sur la carte terminale.**

### Rappel du témoin

**Histoire.** M. Lombard, 58 ans, menuisier. DT2 depuis 8 ans, metformine, HbA1c 7,3 %.
**AVC ischémique sylvien gauche en 2023**, séquelles motrices discrètes, clopidogrel. IMC 28,6.
DFG 76. **LDL 1,52 g/L.** Atorvastatine 40 pendant 4 mois puis rosuvastatine 10 pendant 3 mois :
**myalgies invalidantes des deux cuisses à chaque fois**, CPK 210 puis 180 UI/L (normales),
disparition à l'arrêt, réapparition à la réintroduction. **Il refuse d'en reprendre une troisième.**

**Ma question.** Prévention secondaire lourde, LDL 1,52, intolérance documentée par deux
réintroductions. **Qu'est-ce que je fais ?** Ézétimibe seul ? Anti-PCSK9, et est-ce que je peux le
prescrire ? Retenter une statine à faible dose un jour sur deux ?

**Réponse attendue.** Que l'outil reconnaisse l'intolérance avérée comme une situation distincte et
me sorte les alternatives, en disant ce qui est de mon ressort. Et **qu'il ne me réaffirme pas
« mettez une statine haute intensité »**.

**Incertitude.** Forte.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1.
- **Actions** : **13** (Aide à la décision · Prescrire une statine · Âge 58 · ☑MCV athéromateuse ·
  Ancienneté 8 · Autres FRCV = 1 · ☑Diabète compliqué · Rien à signaler · Suivant ·
  Rien à signaler [= Statine déjà en place : Non] · Suivant · **Avérée** · CK = 1).
- **Temps** : ~3 minutes.

**Champs voulus, absents** : le **LDL** (1,52 g/L — non demandé, ce qui est cohérent avec la doctrine
affichée mais me laisse sans repère chiffré) ; **quelles statines ont été essayées et à quelle dose**
(deux molécules, deux réintroductions — l'outil ne demande que « avérée / rapportée / non ») ;
**l'ézétimibe éventuellement déjà en cours** (le champ « Statine déjà en place » ne couvre pas les
autres hypolipémiants, alors que le remboursement de la suite en dépend).

**Champ un peu piégeux** : « **CK, en multiples de la normale (0 = non dosé)** ». J'avais 210 puis
180 UI/L, donc « 1 ». Le libellé est clair mais m'oblige à convertir de tête.

### Réponse obtenue, verbatim

> **OPTIONS APPLICABLES**
> **Statine indisponible (intolérance avérée ou contre-indication) — alternatives hypolipémiantes**
> `Mesure de sécurité` `Preuve modérée`
> *(alerte dans la carte)* **Ce patient a une maladie cardiovasculaire ÉTABLIE : il relève de la
> prévention SECONDAIRE, où le bénéfice de l'abaissement du LDL est le mieux démontré et le NNT le
> plus bas. L'indisponibilité de la statine ne diminue en rien son risque absolu — elle rend
> seulement plus difficile de le réduire. Ne pas laisser ce patient sans traitement hypolipémiant au
> motif que la statine est écartée.**
> Proposé parce que : Intolérance aux statines (non / rapportée / avérée) = Avérée
>
> (déplié) **SÉQUENCE FRANÇAISE, telle que l'écrit la recommandation 2026 : statine → ézétimibe
> (2e ligne) → anti-PCSK9 (3e ligne) → acide bempédoïque, qualifié de « traitement de dernier
> recours »** … **REMBOURSEMENT FR de l'acide bempédoïque : effectif depuis le 12/12/2025 …, à 65 %,
> dans un périmètre RESTREINT — intolérance AVÉRÉE et traitement hypolipémiant optimisé « incluant au
> moins l'ézétimibe »** … **Délai du bénéfice : 3-4 ans**
> **Avantages** • **ÉZÉTIMIBE SEUL = la conduite que nomme explicitement la recommandation
> française** : « en cas de contre-indication formelle aux statines ou d'intolérance avérée, un
> traitement par ézétimibe seul peut être envisagé » (SFE/SFD/NSFA/SFC 2026, §6.1). **C'est aussi le
> prérequis de remboursement de tout ce qui vient après.** • ACIDE BEMPÉDOÏQUE = … prodrogue activée
> UNIQUEMENT dans le foie et non dans le muscle… **Inconvénients** • ÉZÉTIMIBE : aucun essai de
> critère dur ne l'a testé chez l'intolérant… • ACIDE BEMPÉDOÏQUE — ce que CLEAR Outcomes NE montre
> PAS : aucun effet sur l'AVC (HR 0,85) et les estimations de mortalité sont DÉFAVORABLES… **Ne jamais
> présenter cet agent comme réduisant la mortalité.** • Effets indésirables … goutte 3,1 % vs 2,1 %,
> lithiase biliaire 2,2 % vs 1,2 %…
>
> Statine de haute intensité — prévention secondaire (maladie athéromateuse établie) **écarté :
> Intolérance aux statines = Avérée**

### Test des 20 secondes

Écrit sans relire :

> « La statine est écartée mais il ne faut pas le laisser sans hypolipémiant : c'est de la prévention
> secondaire, le NNT est le plus bas. Séquence française : ézétimibe d'abord, puis anti-PCSK9, puis
> acide bempédoïque en dernier recours — et l'ézétimibe est le prérequis pour rembourser la suite.
> Le bempédoïque ne réduit pas la mortalité et donne de la goutte. »

**Écart : nul, et c'est spectaculaire.** C'est la restitution la plus dense de la passe. La phrase
« **L'indisponibilité de la statine ne diminue en rien son risque absolu — elle rend seulement plus
difficile de le réduire** » est la meilleure phrase de tout l'outil : elle est exactement l'argument
que je cherche depuis un an avec ce patient, et je peux la lui répéter mot pour mot.

### L'écart

**Arbitrage P7 n°3 — VU une seconde fois, sur le cas de référence.** La carte terminale
« Statine indisponible… » porte bien `Mesure de sécurité` et **non** `Recommandée`. C'est le cas
exact que la session SB1 visait, et le badge y est juste : cette carte **est** ce qui reste quand le
traitement habituel est écarté, ce n'est pas un choix préférentiel parmi plusieurs.

**Ce que l'outil m'apporte.** Tout ce que je demandais, sauf un point. Il **nomme la séquence**, il
donne **le cadre de remboursement français avec sa date d'arrêté**, il **écarte explicitement** la
statine haute intensité en nommant le motif, et il **quantifie honnêtement** ce que chaque
alternative ne fait pas. Sur ce patient, l'outil fait mieux que moi et mieux que ce que je trouverais
en 20 minutes de recherche.

**Ce qu'il ne dit pas.**
1. **Rien sur ma troisième question** : retenter une statine à très faible dose, ou un jour sur deux.
   Le sujet apparaît obliquement (« 22,7 % des participants [de CLEAR] prenaient encore une statine à
   très faible dose ») mais jamais comme conduite proposée ou écartée.
2. **Rien sur qui prescrit quoi.** L'anti-PCSK9 est cité en 3e ligne sans dire si c'est de mon
   ressort en médecine générale ou s'il faut un avis spécialisé — c'était explicitement ma question.

**Défaut de registre — du commentaire éditorial adressé au rédacteur, pas au médecin.** Dans le même
bloc, verbatim :

> ⚠ Cette place de dernier recours est une phrase de TEXTE COURANT, non graduée : la table des
> recommandations graduées de la reco ne contient AUCUNE recommandation sur l'acide bempédoïque — ni
> classe, ni niveau.

> La recommandation française, dont la clôture bibliographique est de septembre 2025, écrivait donc
> **à juste titre** qu'il n'était « pas encore commercialisé en France » — **ce n'était pas une
> erreur de sa part**.

> Le NNT d'environ 42 qui en découle est une **DÉRIVATION, absente des publications**…

Ces trois phrases sont de la critique de source destinée à celui qui écrit le contenu. En
consultation elles allongent un bloc déjà très long et m'obligent à trier ce qui m'est adressé de ce
qui ne l'est pas. Le fond est excellent, le destinataire est mal choisi.

**Longueur.** Le bloc déplié fait, à vue d'œil, **plus de 2 000 caractères** d'un seul tenant, avec
des majuscules internes toutes les deux lignes. C'est de la lecture de soirée, pas de consultation.

### En vraie consultation ?

**Oui — et c'est, avec N10, le meilleur usage de l'outil de toute la passe.** 13 actions, 3 minutes,
et je repars avec une conduite, un argument à dire au patient, et le cadre de remboursement. Je ne
décroche nulle part sur la saisie ; je décroche à la **lecture** du bloc déplié, que je ne lirais
qu'une fois — mais une fois suffit.

---

## N15 — Le cas où tout se contredit (Mme Aguilar, 77 ans) — vignette volontairement à la limite

> Page rechargée. Nœud « Traiter ».

### Rappel du témoin

**Histoire.** Mme Aguilar, 77 ans, aidante de son fils handicapé. DT2 depuis 23 ans.
**IC à FEVG 30 %, NYHA III**, 2 hospitalisations en 11 mois, sacubitril/valsartan, bisoprolol,
spironolactone, furosémide 120. **DFG 24**, albuminurie 780 mg/g. **Cirrhose Child B** sur NASH,
ascite, plaquettes 88 G/L. **Anémie 9,1 g/dL. K+ 5,3.** **Glargine 22 UI + asparte 4‑4‑4**,
gliclazide 30 jamais arrêté. HbA1c 7,8 % — dont je ne sais que penser. Poids sec inconnu (ascite).
**Pas de capteur.** « Je ne veux pas d'un médicament de plus, j'en prends déjà treize. »

**Ma question.** L'iSGLT2 est indiqué trois fois et je n'ose pas : DFG 24, K+ 5,3, cirrhose Child B,
dénutrition possible, acidocétose euglycémique. **Est-ce que je le mets ?** Le gliclazide à DFG 24,
j'arrête tout de suite ? Et l'HbA1c à 7,8 % dans ce contexte, je m'en sers ou pas ?

**Réponse attendue.** Je m'attends à ce que l'outil ne sache pas répondre — **et ce serait
acceptable s'il le disait**. Ce que je mesure : est-ce qu'il se tait quand il doit se taire, ou
est-ce qu'il affirme.

**Incertitude.** Maximale.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1.
- **Actions** : **19**.
- **Temps** : ~5 minutes.

**Champs voulus, absents — et ils sont nombreux sur ce patient** : la **kaliémie** (5,3 sous
spironolactone), la **cirrhose / la fonction hépatique** (Child B — nulle part), l'**anémie**,
la **classe NYHA** (le champ est un simple booléen « Insuffisance cardiaque »), les
**hospitalisations récentes**, le **refus explicite du patient** d'un traitement de plus, et le
**poids sec incertain** (l'IMC demandé est faux chez une patiente ascitique — je l'ai saisi quand
même, à 26, en sachant qu'il ne veut rien dire).

### Réponse obtenue, verbatim

Alertes :

> Metformine CONTRE‑INDIQUÉE si DFG < 30 (RCP ANSM) : arrêter ; **sulfamide aussi**. Un iSGLT2 reste
> initiable jusqu'à DFG ≥ 20 (indication rénale)…

> Association insuline + sulfamide / glinide : risque d'hypoglycémie cumulée. Envisager d'arrêter le
> sulfamide / le glinide…

Cartes :

> **À faire d'emblée — sécurité — gestes cumulables**
> **Arrêter le sulfamide (DFG < 30 — contre‑indication rénale)** `Mesure de sécurité` `Preuve faible`
> (déplié) • Sulfamide CONTRE‑INDIQUÉ en insuffisance rénale sévère (DFG < 30) : risque
> d'hypoglycémie sévère et prolongée par accumulation… Seuil CITÉ par la SFD… • **Inconvénients** :
> Réévaluer le contrôle glycémique ; **en rénal sévère, l'insuline devient souvent le pivot**
> (± vildagliptine 50 mg/j…)
>
> **Agent à ajouter — en choisir un**
> **Introduire un iSGLT2 (protection cardio‑rénale et/ou contrôle glycémique)** `Recommandée`
> `Preuve élevée` — Proposé parce que : Insuffisance cardiaque et DFG < 60 et Albuminurie ≠
> Normoalbuminurie et Remplacement d'un agent sans bénéfice sur critère dur
> (déplié) **Ne pas initier si DFG < 20** (poursuivre jusqu'à la dialyse si déjà en cours — KDIGO
> 2024) · Infections génito‑urinaires récidivantes ; gangrène de Fournier ; prudence si artériopathie…
> Hospit. IC HR ~0,61‑0,73 (**NNT ~19‑31 / 16‑26 mois**) ; progression rénale HR ~0,56‑0,76
> (NNT DAPA‑CKD 19, CREDENCE 22). IDM/AVC non réduits. **Délai du bénéfice : 16‑26 mois**
> • Pas d'effet sur l'IDM ni l'AVC… • **risque d'acidocétose (suspendre si jeûne, chirurgie, sepsis)**
>
> Metformine (socle du traitement) **écarté : DFG < 30**
> Introduire un AR GLP‑1 **écarté : Dénutrition / carence (possible même chez l'obèse)**
> Remplacer le sulfamide **écarté : DFG < 30**

### Test des 20 secondes

Écrit sans relire :

> « J'arrête le gliclazide, c'est contre-indiqué sous 30 et il s'accumule. Je peux mettre une
> gliflozine : elle est indiquée pour l'IC et le rein, on peut l'initier jusqu'à 20 et elle est à 24.
> Bénéfice sur les hospitalisations d'insuffisance cardiaque, NNT autour de 20, mais il faut 16 à
> 26 mois. Suspendre si elle jeûne ou si elle est septique, à cause de l'acidocétose. Le GLP-1 est
> exclu parce qu'elle est dénutrie. »

**Écart : nul sur ce qui est affiché.** L'outil m'a donné exactement l'autorisation dont j'avais
besoin (DFG 24 > 20) et le garde-fou pratique (suspendre si jeûne). **Ce que je n'ai pas retenu, ce
sont les choses dont il n'a pas parlé** — et elles sont au cœur de mon hésitation.

### L'écart

**Ce que l'outil m'apporte, et c'est déjà beaucoup.** Il tranche ma question principale avec un
seuil chiffré (« ne pas initier si DFG < 20 », elle est à 24) et il met **l'arrêt du gliclazide en
tête, badgé « Mesure de sécurité »** — ce que je n'avais pas fait depuis des mois. Il **nomme les
trois options écartées avec leur motif**, en une ligne chacune : c'est exactement ce que je voulais
(« ce qui reste sur la table »). Et il me donne le délai de bénéfice — 16 à 26 mois — que je peux
confronter mentalement au pronostic de cette patiente.

**Il ne se tait pas quand il devrait se taire, et c'est ma réserve principale.** Sur les cinq
éléments qui font que je n'osais pas, **aucun n'est pris en compte ni même mentionné** :
1. **la cirrhose Child B** — aucun champ, aucune alerte, alors que c'est une raison majeure de
   prudence (acidocétose, dénutrition, hypoalbuminémie) ;
2. **la kaliémie à 5,3 sous spironolactone** — aucun champ ;
3. **l'anémie à 9,1 g/dL** — aucun champ, et par conséquent **aucune réserve sur son HbA1c à
   7,8 %**, sur laquelle j'ai pourtant déclaré la position « À l'objectif » ;
4. **son refus explicite d'un traitement de plus** — aucun champ (le seul champ de préférence porte
   sur l'injectable) ;
5. **le poids sec incertain** — j'ai été obligé de saisir un IMC que je sais faux.

**Le résultat, c'est une réponse ferme et badgée `Recommandée` / `Preuve élevée` sur un patient dont
l'outil ignore la moitié du dossier — sans le dire.** Ce n'est pas une erreur de l'outil (chacune de
ses phrases est correcte), c'est une **absence de signal sur son propre périmètre**. Ce que
j'attendais, et que le module RHD sait faire (« Hors périmètre des deux nœuds : … »), c'est une
phrase du type « ce nœud ne prend en compte ni la fonction hépatique, ni la kaliémie, ni les
préférences du patient ». Sur les vignettes simples cette absence ne coûte rien ; ici elle transforme
une aide en fausse assurance.

**Incohérence de hiérarchie, quatrième occurrence.** Le groupe « **Agent à ajouter** » s'affiche
chez une patiente qui vient de me dire qu'elle refuse un médicament de plus, et dont l'écran affiche
par ailleurs « Risque hypoglycémique du schéma = Élevé ». Rien ne contredit factuellement la carte —
mais rien ne dit non plus « et alors qu'est-ce qu'on enlève en échange ? », qui est la seule question
négociable avec elle.

### En vraie consultation ?

**Oui pour l'arrêt du gliclazide, non pour la décision iSGLT2.** L'outil m'a rendu un service réel
(le seuil rénal du sulfamide, que j'avais laissé filer) mais il me donnerait une réponse trop assurée
sur l'iSGLT2 pour que je m'en serve seul. Je décrocherais au moment de saisir l'**IMC** : à cet
instant, en tapant un chiffre que je sais faussé par l'ascite, je comprends que l'outil et moi ne
parlons pas de la même patiente. Et je continue d'appeler le cardiologue.

---
---

# Tableau de synthèse

| # | Patient | Écrans | Actions | Temps | Ce que je n'ai pas pu renseigner | Ce qu'on m'a demandé et que je n'ai pas | Je l'ouvrirais ? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N1 | Ferreira 46 ans, DT2 tout neuf | 1 | **11** | ~2 min 30 | poids/taille, âge, TA, LDL, tabac, horaires postés | — | **Oui, une fois** |
| N2 | Lantier 59 ans, cible seule | 1 | **6** | ~45 s | **HbA1c actuelle** (non demandée) | définition de « espérance de vie longue » | **Oui, souvent** |
| N3 | Abadie 64 ans, pile à la cible + hypo | 2 | **25** | ~5 min | type de sulfamide | **« Risque hypoglycémique du schéma »** (non défini) | **Oui, hors consultation** |
| N4 | Kervarec 67 ans, coronarien × 3 écrans | **3** | **35** | ~8 min | statine actuelle (molécule/dose), LDL, type de gliptine | « Autres FDR CV » (nombre non défini) | **Statine oui ; le reste non** |
| N5 | Traoré 71 ans, DFG 31 | 1 | **18** | ~3 min | K+, pente du DFG, type de sulfamide | — | **Oui, sans hésiter** |
| N6 | Nowak 79 ans, DFG 13 | 1 | **17** | ~3 min | Hb, EPO, dialyse programmée, K+ | — | **Oui, franchement** |
| N7 | Chevallier 88 ans, déprescription | 2 | **27** | ~6 min | **chutes, MMSE, dose d'insuline, saute des repas, perte de poids chiffrée** | — | **Cible oui ; traitement non** |
| N8 | Sissoko 41 ans, demande = poids | **3** | **28** | ~7 min | **poids/taille, TA, SAOS, demande du patient** | 15 champs alimentaires (arrêté à 7) | **Alimentation oui ; réponse non** |
| N9 | Ould‑Amara 53 ans, veut courir | 2 | **14** | ~3 min | **ECG déjà fait, projet du patient**, tabac récent | **« Durée d'une séance » après avoir dit « Jamais »** | **Oui** |
| N10 | Pereira 62 ans, insuline **sans capteur** | 1 | **18** | ~4 min | métier, +5 kg, refus du capteur | — (aucune impasse) | **Oui, sans réserve** |
| N11 | Renard 68 ans, insuline **avec capteur** | 1 | **25** | ~6 min | **TIR**, vit seule, horaire précis des hypos | doses étiquetées « sans effet » puis réclamées | **Oui, avec réserve** |
| N12 | Diallo 57 ans, **HbA1c non fiable** | 1 | **18** | ~4 min | **anémie, drépanocytose, transfusion, glycémies capillaires** | — | **Non** |
| N13a | Vasseur 50 ans, metformine mal tolérée | 1 | **19** | ~4 min | — | — | **Oui** |
| N13b | Petit 44 ans, naïve (test négatif) | 2 | **11** | ~2 min 30 | — | **« Ancienneté » annoncée sans effet alors qu'elle décide** | **Oui pour la cible** |
| N14 | Lombard 58 ans, intolérance statine | 1 | **13** | ~3 min | LDL, statines déjà essayées, ézétimibe en cours | CK « en multiples de la normale » (à convertir) | **Oui, immédiatement** |
| N15 | Aguilar 77 ans, tout se contredit | 1 | **19** | ~5 min | **cirrhose, K+, anémie, NYHA, refus du patient, poids sec** | IMC (que je sais faux) | **Sulfamide oui ; iSGLT2 non** |
| | **Total** | **24** | **304** | **~1 h 10** | | | |

Six écrans sur six couverts : Cible (N2, N3, N4, N7, N13b) · Traiter (N1, N3, N4, N5, N6, N7, N8,
N12, N13, N15) · Insulinothérapie (N10, N11) · Statine (N4, N14) · RHD Alimentation (N8) ·
RHD Activité physique (N9).

---

# Vérification ciblée des cinq arbitrages du Plan P7

| Arbitrage | Vu à l'écran ? | Où |
| --- | --- | --- |
| 1. Seuils `a_l_objectif` / `sous_objectif` (pré-remplissage de la position) | **NON — jamais rencontré** | N3, N4, N7 |
| 2. Prudence rénale AR GLP‑1 sous DFG 15 | **OUI** | N6 |
| 3. Badge distinct pour une option de sécurité | **OUI, deux fois** | N5, N14 (aussi N6, N15) |
| 4. Signalement de validité de l'HbA1c | **NON — non livré** | N12 |
| 5. « Optimiser un agent mal toléré » conditionné à un traitement en cours | **OUI, en positif et en négatif** | N13a / N13b |

### 1. Seuils de position (`a_l_objectif`, `sous_objectif`) — NON RENCONTRÉ

**Reproduction, trois fois, sur trois patients différents.** Dans chaque cas j'ai d'abord fixé la
cible dans le nœud « Fixer la cible d'HbA1c », **dans la même session**, puis ouvert « Traiter » et
saisi l'HbA1c actuelle :

| Vignette | Cible fixée juste avant | HbA1c saisie | Écart | État du champ « Par rapport à l'objectif » |
| --- | --- | --- | --- | --- |
| N3 | Cible ≤ 7 % | 7,0 | 0 | **« · à confirmer », rien de pré-rempli** |
| N4 | Cible ≤ 8 % | 8,3 | +0,3 | **« · à confirmer », rien de pré-rempli** |
| N7 | Cible < 9 % | 6,2 | −2,8 | **« · à confirmer », rien de pré-rempli** |

**J'ai dû cliquer moi-même la position à chaque fois.** Cause visible à l'écran : le nœud « Traiter »
**n'a pas de champ « HbA1c cible »** — il demande directement la *position*, jamais la cible chiffrée.
Le nœud « Fixer la cible » rend une **catégorie** (« Cible ≤ 7 % »), pas un nombre partagé. Le nœud
« Insulinothérapie » a lui un champ « **HbA1c cible (%)** » chiffré (N10, N11), mais il n'alimente
pas « Traiter ».

**Ce n'est probablement pas une régression** : `plans/P7/index.md` marque **T‑048 « rendu obsolète le
2026-07-29 (`position_vs_cible` retiré) »**. Mon constat est cohérent avec cette note. Je le
consigne comme **non rencontré**, sans en conclure que quelque chose est cassé.

**Ce que ça coûte au praticien** : rien de grave (un clic), sauf que le clic est un **jugement** que
l'outil pourrait faire à ma place, et que l'énoncé « En dessous de l'objectif (**sur-traitement
probable**) » me fait déclarer une conclusion, pas un fait — voir N12, où j'ai déclaré
« sur-traitement probable » chez une patiente en réalité très hyperglycémique.

### 2. Prudence rénale AR GLP‑1 (DFG < 15) — VU, et bien calibré

**Reproduction (N6)** : nœud « Traiter », intention Optimiser, traitements = metformine + gliptine,
HbA1c 8,1, position au-dessus, **DFG 13**, macroalbuminurie, IMC 24,4, pas de dénutrition.
La carte « Introduire un AR GLP‑1 » **s'affiche**, **badge `Recommandée`**, **non écartée**, avec un
encadré bleu clair à l'intérieur :

> Fonction rénale très altérée (DFG < 15 mL/min/1,73 m²) : les AR GLP‑1 commercialisés en France
> restent utilisables à ce stade — leur résumé des caractéristiques du produit ne pose aucune limite
> rénale —, mais ils y ont été PEU ÉTUDIÉS. Le recul manque, pas l'autorisation : proposer la classe
> reste licite, en surveillant de près la tolérance (digestive, poids, état nutritionnel) et en
> réévaluant tôt.

**Réponse au point N2 laissé ouvert par la session SA1** (« le texte dit-il "utilisable, mais peu
documenté" sans se lire comme un feu rouge ? ») : **oui, sans ambiguïté**. « Le recul manque, pas
l'autorisation » est la formulation exacte qu'il fallait ; en la lisant je ne me suis pas senti
interdit, je me suis senti prévenu. Le registre visuel (encadré d'information bleu, pas rouge, badge
`Recommandée` maintenu) va dans le même sens.

### 3. Badge « Mesure de sécurité » — VU, deux fois, et il fonctionne

**Reproductions** :
- **N5** (DFG 31, metformine 2 g) → « **Réduire la posologie de la metformine** » `Mesure de sécurité`,
  dans un groupe « **À faire d'emblée — sécurité — gestes cumulables** ».
- **N14** (intolérance statine avérée + MCV établie) → « **Statine indisponible … alternatives
  hypolipémiantes** » `Mesure de sécurité` — le cas D32 que la session SB1 visait explicitement.
- Aussi **N6** (« Arrêter la metformine, DFG < 30 ») et **N15** (« Arrêter le sulfamide, DFG < 30 »).

**Rendu** : pastille **à contour rouge**, texte rouge, à côté de la pastille grise « Preuve … », sur
une carte à liseré coloré. **Distinction immédiate** d'avec l'aplat bleu de `Recommandée` et la
pastille grise de `Recommandation officielle (France)` — les trois coexistaient sur le même écran en
N5 et je les ai séparées du premier coup d'œil.

**Réponse au point N2 laissé ouvert par la session SB1** (« le libellé dit-il "c'est ce qui reste
quand le traitement habituel est écarté" sans se lire comme une mise en garde CONTRE la carte ? ») :
**oui, mais grâce au titre de groupe, pas grâce à la pastille seule.** Mon premier réflexe devant le
rouge est « attention danger » ; c'est « **À faire d'emblée — sécurité** » au-dessus qui rétablit le
sens en une demi-seconde. Sur la carte N14, où le titre de groupe est absent, c'est le **texte** de
l'alerte (« Ne pas laisser ce patient sans traitement hypolipémiant… ») qui joue ce rôle. **La
pastille n'est jamais autoportante** — c'est acceptable ici, mais ça mérite d'être su.

**Réserve résiduelle signalée par SB1 (bordure bleue conservée)** : je n'ai **pas** été gêné. La
liseré coloré à gauche de la carte et le titre de groupe suffisent à la distinguer.

### 4. Signalement de validité de l'HbA1c — NON RENCONTRÉ (non livré)

**Vérifié sur les quatre nœuds**, avec la recherche textuelle du rendu (N12) :
- « **Traiter** » : **aucun bloc de cadrage du tout**. Aucune occurrence de « anémie », « cirrhose »,
  « hémoglobin… », « transfusion », « interprétable », « fiabilité ».
- « **Insulinothérapie** » : le cadrage existe mais porte sur ORIGIN (« L'insuline améliore le
  contrôle glycémique … mais N'A PAS de bénéfice cardiovasculaire démontré »).
- « **Prescrire une statine** » : cadrage sur les cibles de LDL.
- « **Fixer la cible d'HbA1c** » : aucun cadrage.

**Cohérent avec l'état du plan** : `plans/P7/index.md` donne **SA2 (T‑052 / T‑053) au statut `[ ]`**.
Le correctif n'est pas posé ; le défaut du 2026-07-28 est donc **intact**, sans être une régression.
**C'est, de mes 15 vignettes, celui dont la conséquence patient est la plus directe** (cf. N12).

### 5. « Optimiser l'agent mal toléré » — VU, dans les deux sens

- **Positif (N13a)** : intention Optimiser + Metformine cochée + Intolérance = oui → la carte
  « **Optimiser l'agent mal toléré : réduire la posologie (intolérance non majeure) ou remplacer** »
  s'affiche (`Recommandée`, `Preuve faible`).
- **Négatif (N13b)** : intention Optimiser + **aucun traitement coché** + Intolérance = oui → **la
  carte n'apparaît pas**, et l'écran affiche « EN ATTENTE — CRITÈRES À RENSEIGNER POUR TRANCHER »
  sans affirmer quoi que ce soit. C'est le comportement décrit par T‑050 (« en attente, pas
  écartée »).

**Bonus non demandé, mais utile** : cocher « Intolérance à un traitement en cours » fait apparaître
un sous-champ « **Nature de l'intolérance** » (Digestive / Génito-urinaire / Perte de poids
excessive / Cutanée / Autre) qui **change la réponse** : avec « Digestive », la carte
« Réduire la posologie de la metformine » remonte en tête avec le badge `Mesure de sécurité`.
C'est du bon travail de granularité.

---

# Analyse transversale des trois axes

## (A) Ergonomie de saisie en consultation

**Le chiffre qui résume tout : 304 actions pour 15 patients, soit une moyenne de 20 actions par
patient, et 1 h 10 pour ce qui représenterait 15 consultations.** Sur mon rythme réel
(25 patients/jour, 15 min chacun), ça signifie **2 à 8 minutes d'outil par patient** — c'est-à-dire
entre 15 % et 50 % du temps de la consultation.

**Ce qui a nettement progressé et qu'il faut dire.**
1. **Le bouton « Rien à signaler »** solde d'un clic 4 à 6 drapeaux et fait basculer la reco de
   PROVISOIRE à définitive. Sans lui, chaque patient coûterait 4 à 6 clics de plus. Il ne **détruit
   pas** un drapeau déjà coché (vérifié en N4 : « Antécédent cardiovasculaire » coché est resté coché
   après « Rien à signaler »). C'est le meilleur détail de la version.
2. **Le masquage conditionnel** est réel et efficace. Meilleur exemple : nœud Insuline, décocher
   « MCG disponible » retire d'un coup TBR, CV et lecture AGP — de 19 champs annoncés je suis descendu
   à 12 demandés (N10). Cocher « Metformine » fait apparaître « Dose de metformine » (N3) ; cocher
   « Intolérance » fait apparaître « Nature de l'intolérance » (N13a).
3. **Les mentions « · sans effet sur la reco actuelle »** me disent quoi ne pas remplir. Sur un
   patient où j'ai déjà donné 12 informations, c'est précieux (N5 : trois champs neutralisés).
4. **Le partage inter-nœuds** (« · repris de votre saisie ») fonctionne et économise réellement :
   3 champs offerts au nœud Statine en N4, 3 au nœud Traiter en N3/N7, la Fragilité au nœud
   Alimentation en N8.

**Ce qui prend trop de temps.**
- **Le nœud « Traiter » est le goulot** : 5 sections, 4 boutons « Suivant », 17 à 19 actions
  minimum. Il représente à lui seul plus de la moitié des actions de la passe.
- **Le nœud « Alimentation » : 15 champs.** Sept questions d'affilée sur ce que mange le patient,
  avec 3 à 4 modalités chacune. J'ai arrêté à 7 (N8). Un interrogatoire alimentaire de 3 minutes n'a
  pas sa place dans une consultation de 15 minutes — alors que la sortie, elle, est excellente.
- **La saisie d'unités converties.** L'IMC (que je dois calculer), les CK « en multiples de la
  normale » (que je dois convertir), l'albuminurie en catégories quand mon labo me rend un ratio
  A/C en mg/g. Trois conversions mentales, trois occasions de se tromper.

**Ce qui nécessite des allers-retours pour une information unique.**
- **N11, le pire cas** : la carte réclame « Dose de basale actuelle » / « Dose de rapide actuelle »
  pendant que le formulaire les étiquette « sans effet sur la reco actuelle », dans une section qui
  s'affiche « Aucun champ renseigné » **sans badge**. J'ai fait deux allers-retours.
- **N4** : le même fait clinique se saisit deux fois sous deux noms (« Antécédent cardiovasculaire »
  au nœud Cible, « Maladie cardiovasculaire athéromateuse établie » au nœud Traiter).

**Est-ce que l'écran désigne par où commencer ?**
**Non, sauf à un seul endroit.** L'écran du domaine DT2 aligne cinq entrées — RHD, Cible, Traiter,
Insulinothérapie, Statine — **sans un mot** sur laquelle ouvrir, dans quel ordre, ni pour quelle
question. L'ordre affiché (RHD en premier, Cible en deuxième) n'est ni alphabétique ni clinique.
**L'exception est l'écran d'aiguillage du module RHD**, qui pose la bonne question — « **Quel levier
travailler avec ce patient aujourd'hui ?** » — et donne trois puces descriptives par axe (« Le
patient décrit spontanément ce qu'il mange, ou vous demande "quoi manger" »). **C'est le modèle qui
manque à l'écran d'accueil du domaine.**

## (B) Lisibilité et compréhension immédiate de la réponse

**Le test des 20 secondes, résultat global : 11 restitutions sur 15 sont fidèles**, et trois sont
excellentes (N5, N6, N10, N14 — chiffre de dose, seuils, protocole, séquence de traitement retenus
intégralement). C'est un bon score, meilleur que ce que j'attendais.

**Ce qui fait qu'une réponse passe en 20 secondes** — et l'outil le fait bien quand il le fait :
- un **chiffre** dans le titre ou juste sous le badge (« +2 U ≈ 40 U/j », « max 1 g/j », « ne pas
  initier si DFG < 20 », « atorvastatine 40‑80 ou rosuvastatine 10‑20 ») ;
- une **phrase de médecin** que je peux répéter au patient (« L'indisponibilité de la statine ne
  diminue en rien son risque absolu — elle rend seulement plus difficile de le réduire » ;
  « choisir mieux plutôt que s'interdire d'y aller » ; « Le recul manque, pas l'autorisation ») ;
- les **options écartées avec leur motif en une ligne** (« iSGLT2 écarté : DFG < 20 »).

**Ce qui fait qu'une réponse ne passe pas :**
1. **Le « Proposé parce que » en expression booléenne brute.** Sur les 15 vignettes, **la majorité
   des cartes** affiche une justification du type « Intention thérapeutique (« je souhaite… ») **≠**
   Initier un traitement **et** Traitements en cours comprend Sulfamide **et** Hypoglycémie récente ».
   Certaines dépassent neuf termes sur six lignes (N10). Le contraste est brutal **à l'intérieur du
   même écran** : la carte metformine a une phrase de médecin, ses voisines une formule de moteur.
2. **Les cartes redondantes.** N3 : « Désintensifier : alléger/arrêter le sulfamide… » **et**
   « Réduire la posologie du sulfamide », même groupe, mêmes badges. N7 : trois cartes d'allègement
   pour deux gestes. N13a : trois cartes sur la metformine dont deux « réduire » et une
   « poursuivre ». **Je n'arrive pas à dire, de mémoire, laquelle appliquer.**
3. **Le titre de groupe qui contredit la carte.** « **Agent à ajouter** — en choisir un » au-dessus
   de cartes dont la justification dit « **Remplacement** d'un agent sans bénéfice » : vu en N3, N4,
   N12, N15. Ajouter ou remplacer, ce n'est pas la même ordonnance — et chez un patient sous
   sulfamide, ajouter sans retirer expose à l'hypoglycémie.
4. **L'information décisive rangée sous un mauvais titre.** En N4, la seule chose qui répondait à ma
   question (« rosuvastatine 10‑20 mg **EST** de haute intensité ») était derrière un lien replié
   intitulé « ⚠ 2 contre-indications, effet attendu et plus ». J'ai failli augmenter la dose pour
   rien.
5. **Le cartouche « EN ATTENTE — CRITÈRES À RENSEIGNER POUR TRANCHER » vide.** Quatre occurrences
   (N1, N2, N7, N13b) : un encadré jaune, un titre en capitales, **rien dessous**. Sur le nœud
   « Traiter » l'outil sait pourtant nommer le champ manquant (« À renseigner dans cette section :
   Dose de metformine (mg/j) ») — mais pas dans ce bloc-là, ni sur le nœud Cible.
6. **Les blocs trop longs.** Le pavé « Position déclarée AU-DESSUS de l'objectif, avec une intention
   d'OPTIMISATION… » fait huit lignes de texte dense avec des majuscules internes (N5, N7, N13a). Son
   contenu est précieux ; je ne le lirai jamais en consultation.

## (C) Fidélité au raisonnement de consultation

**Là où l'outil pense comme moi.**
- **« Intention thérapeutique » en premier champ est juste.** C'est bien la première chose que je me
  dis en ouvrant un dossier (« je veux initier / renforcer / alléger »). Et le fait que l'intention
  **commande la palette** — au point que l'outil me l'explique quand ça surprend — correspond à ma
  façon de travailler.
- **« Déprescrire » comme intention de plein droit** (N7). C'est la moitié de ma patientèle
  diabétique âgée, et l'outil ne me force pas à intensifier. La réponse à mon inquiétude de départ
  est rassurante.
- **La hiérarchie « sécurité d'abord »** : le groupe « À faire d'emblée — sécurité » avant le socle et
  avant les agents (N5, N6, N13a, N15). C'est l'ordre dans lequel je pense un patient à risque.
- **« L'OUTIL NE LES DÉPARTAGE PAS, LE CHOIX REVIENT AU PRATICIEN »** : la meilleure phrase du
  produit, et la plus fidèle à ce qu'est une consultation. Idem « Une consultation ne permet d'en
  négocier que deux ou trois » (module RHD) : c'est écrit par quelqu'un qui a déjà consulté.

**Là où l'outil pense en machine.**
- **L'ordre des sections est celui du moteur, pas de la consultation.** Je pense « qui est ce
  patient » (âge, fragilité, ce qu'il veut) **avant** « quel est son chiffre ». L'outil me demande
  l'intention, puis l'HbA1c, puis la biologie, puis les drapeaux, et **le terrain en dernier**. Le
  résultat est que sur le nœud « Traiter » j'arrive au champ « Risque hypoglycémique du schéma » —
  un jugement — après avoir saisi 15 données objectives. C'est l'inverse de mon fil.
- **Le patient n'entre presque pas.** Une seule case « Fragilité », un seul champ de préférence
  (« vis-à-vis de l'injectable »). Pas de champ pour : ce que le patient demande (N8 : elle vient pour
  maigrir), ce qu'il refuse (N15 : « pas un médicament de plus »), son métier (N10 : maçon ; le
  permis groupe lourd), ses chutes (N7 : trois en 8 mois, c'est la raison même de ma consultation),
  son isolement (N11 : elle vit seule et fait des hypos nocturnes). **Ces cinq éléments sont, dans
  mes cinq vignettes les plus difficiles, l'élément qui fait basculer ma décision.**
- **Le découpage en nœuds correspond à des objets de contenu, pas à des consultations.** Chez
  M. Kervarec (N4), une seule consultation a exigé **trois écrans, 35 actions et 8 minutes**, avec
  une resaisie franche (l'antécédent CV, sous deux noms). Chez Mme Sissoko (N8), la question du poids
  tombe dans l'interstice : le nœud « Traiter » donne le médicament, le module RHD **déclare le poids
  hors périmètre**, et **aucun écran ne traite sa demande**.
- **Un champ non défini qui bascule la conduite.** « Risque hypoglycémique du schéma :
  Faible / Élevé », sans définition ni infobulle, alors que j'ai vu la carte « Désintensifier »
  apparaître au moment exact où j'ai cliqué « Élevé » (N3). Même famille que le champ « Autres
  facteurs de risque cardiovasculaire », toujours un nombre libre sans définition (N4). À l'inverse,
  le nœud Insuline **montre qu'on sait faire** : « Reportez la valeur HABITUELLE des 3 derniers
  matins, pas la dernière mesure. Une seule glycémie basse isolée ne justifie pas de réduire la
  dose ; c'est sa répétition qui compte. » **Il faudrait cette phrase-là partout.**

---

# Les défauts les plus graves, classés

### 1. ⚠⚠⚠ Sortir d'un nœud et y revenir ne réinitialise rien — contamination inter-patients

**Reproduction** : remplir « Fixer la cible » (Âge 59, Ancienneté 7, Longue) → « ← Domaine » →
re-cliquer « Fixer la cible ». Tous les champs reviennent remplis (**relu dans le DOM : `["59","7"]`**),
étiquetés « **· repris de votre saisie** », et **la recommandation du patient précédent est déjà
affichée** (« Cible ≤ 7 % », badge `Recommandée`).

**Conséquence patient.** J'appelle le patient suivant, j'ouvre le nœud, et l'écran m'affiche une
cible finie badgée « Recommandée » calculée pour quelqu'un d'autre. Rien ne dit qu'elle ne le concerne
pas — « repris de **votre** saisie » suggère au contraire que c'est bien mon patient. En consultation
de 15 minutes, on lit le résultat, pas le formulaire.

**Aggravant** : le seul geste de coupure, « Nouveau patient », passe par un `window.confirm()`
**natif**. Chrome propose « Empêcher cette page de créer des boîtes de dialogue supplémentaires » dès
la 2ᵉ occurrence ; à partir de là le bouton redevient **silencieusement inerte** — exactement le bug
du 2026-07-28, sans aucun signal. **Je n'ai pas pu vérifier le comportement de remise à zéro
lui-même : NON REPRODUIT** (le dialogue natif est désactivé dans mon navigateur d'audit). À vérifier
par un humain devant l'écran.

### 2. ⚠⚠⚠ Aucun signalement de validité de l'HbA1c (P7 n°4 non livré)

Conséquence mesurée en N12 : chez une patiente drépanocytaire AS, anémique, transfusée il y a six
semaines, dont les glycémies réelles sont à 1,90 et 2,60 g/L, l'outil accepte sans un mot que je
déclare « **En dessous de l'objectif (sur-traitement probable)** » sur une HbA1c à 6,4 %, et construit
toute sa réponse là-dessus. **Une phrase de cadrage, zéro champ à saisir, suffirait.**

### 3. ⚠⚠ Des champs annoncés « sans effet sur la reco actuelle » qui sont ceux qui décident

Reproduction complète en N13b : à vide, « **Âge** » et « **Ancienneté du diabète** » sont tous deux
étiquetés « · sans effet sur la reco actuelle » sur le nœud « Fixer la cible ». Remplis (44 et 1), la
recommandation **bascule** de « Cible ≤ 7 % » à « **Cible ~6,5 %** », justification affichée :
« **Âge < 70 et Ancienneté du diabète (ans) < 5** ». **Le praticien qui prend l'étiquette au mot
saute les deux champs et repart avec la mauvaise cible chez ses diabétiques récents** — la population
la plus fréquente.

### 4. ⚠⚠ « Agent à ajouter » alors que la justification dit « remplacement »

Quatre occurrences (N3, N4, N12, N15). Chez un patient sous sulfamide (N3), suivre le titre du groupe
plutôt que la justification revient à **ajouter** un agent au lieu de **remplacer** le sulfamide —
donc à laisser en place la cause des hypoglycémies qu'on vient de corriger.

### 5. ⚠⚠ Deux étiquettes contradictoires pour le même champ, sur le même écran

N11 : la carte affiche « Doses non calculées — **à renseigner** : Dose de basale actuelle, Dose de
rapide actuelle » pendant que le formulaire étiquette ces deux champs « **· sans effet sur la reco
actuelle** ». Et les remplir change bien l'affichage. Deux allers-retours pour comprendre qui croire.

### 6. ⚠ Jargon de projet et de moteur sur des écrans cliniques

- « **→ nœud E** » dans une alerte affichée au médecin (N7) et dans le panneau des options (N1).
- « **Palette glycémique ouverte** », « **DFG > 0 et DFG < 30** » (une garde technique interne),
  « **Ce rang tient compte de :** » — exposés comme s'ils étaient des critères cliniques (N1, N4, N5).
- L'argumentaire du nœud « Traiter » contient les **notes de travail du projet**, mot pour mot :
  « AJOUTÉ le 2026-07-27, volet RÉNAL (**collecte + red-team**…) », « **VÉRIFIÉ par le référent** le
  2026-07-27 », « l'attribution … a été **retirée du nœud** ».
- Le nœud « Statine » contient de la **critique de source adressée au rédacteur** : « … écrivait donc
  à juste titre … **ce n'était pas une erreur de sa part** », « Le NNT … est une **DÉRIVATION, absente
  des publications** ».
- Une carte dit « ne pas afficher « bénéfice CV prouvé » » — une consigne au rédacteur, affichée dans
  les inconvénients (N1).

### 7. ⚠ Un champ réclamé qui n'a pas de sens après la réponse précédente

N9 : « **Durée d'une séance** · à confirmer » réclamé après avoir répondu « **Jamais** » à
« Séances d'activité physique structurée ». J'ai dû saisir une valeur fausse. Le masquage conditionnel
existe ailleurs dans le produit (dose de metformine, nature de l'intolérance, champs MCG) : il n'est
simplement pas appliqué ici.

### 8. ⚠ Le cartouche « EN ATTENTE » vide

Quatre occurrences. Un encadré jaune avec un titre et rien dessous se lit comme un bug, et prive du
seul renseignement utile : **quel** critère manque.

### 9. ⚠ Cartes redondantes ou hiérarchie inversée par rapport à l'intention déclarée

N7 : intention **déprescrire** chez une patiente de 88 ans dénutrie (IMC 20,7) qui saute des repas →
« **Agent à ajouter : Introduire un iSGLT2** », `Recommandée` + `Preuve élevée`, **au-dessus** du
groupe « Traitement à alléger ». L'AR GLP‑1 est bien exclu par « IMC < 22 et Dénutrition » ;
**l'iSGLT2 n'est filtré par aucun des deux**. (Asymétrie tranchée « sans action » le 2026-07-29 selon
`plans/P7/index.md` — je signale l'effet à l'écran, pas le fond : **question clinique**.)

### 10. Absence de signal sur le périmètre du nœud « Traiter »

N15 : réponse ferme `Recommandée` / `Preuve élevée` sur une patiente dont l'outil ignore la cirrhose
Child B, la kaliémie, l'anémie et le refus explicite — **sans le dire**. Le module RHD sait pourtant
énoncer son hors-périmètre en une phrase. Le nœud « Traiter » ne le fait pas.

---

# Comparaison avec la passe du 2026-07-28

| Point signalé le 2026-07-28 | État au 2026-07-30 (`cf1c780`) | Verdict |
| --- | --- | --- |
| **« Nouveau patient » n'efface rien / contamination** | Le bouton est **câblé** et demande confirmation (`window.confirm` natif). **Mais** sortir d'un nœud et y revenir **restaure tout l'état du patient précédent, recommandation incluse** — nouveau chemin de contamination, plus insidieux que l'ancien. Comportement du reset **non reproduit**. | **Mi-figue : progrès sur le bouton, régression pratique sur le rebond** |
| **Nœud insuline = impasse sans capteur** | **RÉSOLU, et bien.** Sans MCG : les champs de capteur disparaissent, une alerte donne la stratégie (« titrer la basale sur la glycémie à jeun, cible ~0,70‑1,30 g/L ; profils capillaires 6‑7 points »), une carte calcule la dose (« +2 U ≈ 40 U/j »), le protocole est chiffré (+2 U si ≥ cible 3 matins de suite, +10 % au-delà de 40 U/j, réévaluer tous les 3 jours), et la limite est nommée sans renoncement (93 % des hypos non détectées, Munshi). | **Nettement mieux — le meilleur progrès de la version** |
| **« Autres facteurs de risque CV » : nombre libre sans définition** | **INCHANGÉ.** Toujours un `input[type=number]`, sans définition, sans infobulle, sans liste. Seul ajout : la mention contextuelle « · sans effet sur la reco actuelle » — qui, elle, pose son propre problème (défaut n°3). En revanche « Diabète compliqué » est maintenant **défini dans son libellé** (« atteinte d'organe : rétinopathie, néphropathie, neuropathie, macrovasculaire »). | **Inchangé** |
| **Validité de l'HbA1c jamais questionnée** | **INCHANGÉ** (SA2 non livrée). | **Inchangé** |
| **Jargon de projet à l'écran (« red-team », « décision référent », noms de variables)** | **INCHANGÉ, mot pour mot** dans l'argumentaire du nœud « Traiter ». **Aggravé sur un point** : « → nœud E » apparaît maintenant dans une **alerte clinique**, pas seulement dans un panneau technique. | **Inchangé à légèrement pire** |
| **Les cartes s'arrêtent à la classe, sans molécule/dose/surveillance** | **Partiellement résolu, de façon inégale.** Molécules **et** doses nommées sur : statine (« atorvastatine 40‑80 ou rosuvastatine 10‑20 »), metformine (« max 2 g/j si DFG 45‑59 ; max 1 g/j si 30‑44 »), insuline (dose calculée + protocole de titration), sulfamide (« gliclazide MR ou glimépiride »), gliptine (« sitagliptine »), alternatives à la statine (séquence + remboursement daté). **Toujours absent** : quelle gliflozine, quel AR GLP‑1, à quelle dose, avec quelle surveillance à J15 ; et **aucun chiffre de perte de poids** nulle part. | **Mieux là où c'est décisif, inchangé ailleurs** |

**Progrès non signalés le 07-28 et acquis depuis, qu'il faut créditer :**
- le bouton « **Rien à signaler** » (soldé de section) ;
- le **partage inter-nœuds** avec l'étiquette « repris de votre saisie » ;
- les mentions « **sans effet sur la reco actuelle** » (bonne idée, mauvaise implémentation à vide) ;
- l'affichage des **options écartées avec leur motif en une ligne** (« iSGLT2 écarté : DFG < 20 ») —
  infiniment plus lisible que le panneau « Pourquoi pas d'autres options ? » ;
- les **alertes contextuelles rendues en direct** pendant la saisie (non-association incrétine,
  insuline + sulfamide, dose max de metformine selon le DFG, orientation spécialisée) — je n'en avais
  aucun souvenir de la passe précédente et ce sont elles qui m'ont le plus servi ;
- le **plafond des 5 pistes expliqué** dans les nœuds RHD ;
- le bug connu « GAJ réclamé malgré le capteur » (`STATUS.md`) : **apparemment corrigé** — le champ
  est marqué « sans effet » et ne compte plus dans les « à confirmer » (N11).

**Point qui s'est franchement dégradé, ou que je n'avais pas vu :** le **rebond par « ← Domaine » qui
restaure l'état complet du patient précédent**. Le 07-28 dénonçait un bouton inerte ; aujourd'hui
c'est la navigation ordinaire qui contamine.

---

# Réponse franche de clôture

**Ouvrirais-je cet outil en consultation ? Oui — pour trois nœuds sur six, et à une condition
bloquante.**

**Les trois que j'ouvrirais, souvent, et sans hésiter :**
1. **« Fixer la cible d'HbA1c »** — 6 actions, 45 secondes, une cible chiffrée **et l'argument à dire
   au patient** (« on baisse l'infarctus, pas la mortalité, le gain est modeste »). C'est le meilleur
   rapport temps/valeur du produit. Réserve : il faut savoir remplir « Ancienneté du diabète » malgré
   l'étiquette qui dit qu'elle ne sert à rien.
2. **« Prescrire une statine dans le DT2 »** — le nœud le plus abouti. Molécules, doses, NNT, délai de
   bénéfice, et sur l'intolérance avérée : la séquence française complète avec le cadre de
   remboursement daté. Sur M. Lombard (N14), l'outil fait mieux que moi et mieux que 20 minutes de
   recherche.
3. **« Insulinothérapie du DT2 »** — le retournement de cette passe. C'est le seul écran qui produit
   quelque chose que je peux **recopier sur une ordonnance** (« +2 U, soit 40 U/j, réévaluer à
   3 jours »), et il le fait **sans capteur**, ce qui était l'impasse du 07-28.

**Pour quel type de patient, précisément.** Le patient dont la question est « **quel seuil, quelle
dose, dans quel ordre** » : l'ajustement rénal (N5, N6), l'intolérance documentée (N13a, N14), la
titration d'insuline (N10). Sur ces cas l'outil me donne en 3 minutes un seuil réglementaire ou un
protocole chiffré que je n'ai pas en tête, avec son niveau de preuve. **Pas** le patient simple (je
connais la réponse et l'outil ne descend pas à la dose : N1), **pas** le patient dont la demande est
le poids (N8 : déclaré hors périmètre, aucun chiffre), **pas** le patient dont la complexité vient de
ce que l'outil ne sait pas recevoir (N15 : cirrhose, kaliémie, refus).

**Sur quel nœud ai-je décroché, et à quel champ exactement.**
- **Nœud « Traiter », champ « Risque hypoglycémique du schéma » (Faible / Élevé)** — c'est là que je
  décroche le plus franchement. On me demande un jugement non défini, après 15 saisies objectives, et
  je vois la réponse basculer selon ce que je clique. Aucune infobulle, aucun exemple.
- **Nœud « Traiter », champ « HbA1c actuelle »** chez Mme Diallo (N12) — j'ai su à cette seconde que
  l'outil allait raisonner sur un chiffre faux et qu'il n'y avait aucun moyen de le lui dire.
- **Nœud « Activité physique », champ « Durée d'une séance »** après avoir répondu « Jamais » (N9) —
  petit défaut, gros effet : c'est le moment où je cesse de faire confiance à l'écran.
- **Nœud « Alimentation », 7ᵉ question sur l'alimentation** (N8) — je m'arrête, et il en restait huit.

**La condition bloquante, et c'est la même qu'il y a deux jours.** Ce n'est aucune limite de contenu :
**c'est l'isolation entre deux patients.** Tant que sortir d'un nœud et y revenir me réaffiche le
patient précédent avec sa recommandation badgée « Recommandée », et que le seul geste de coupure
dépend d'une boîte de dialogue native que le navigateur peut désactiver en silence, **je ne peux pas
l'utiliser en série sur une matinée de consultations.** C'est purement technique, c'est la priorité
n°1, et c'est exactement ce que disait la passe du 2026-07-28.

---

*Fin de passe : 2026-07-30, 11h17. 15 vignettes, 24 écrans, 304 actions, ~1 h 10 de saisie.
Serveur de dev local (`http://localhost:50375`), commit `cf1c780`. Aucun fichier du produit modifié.*
