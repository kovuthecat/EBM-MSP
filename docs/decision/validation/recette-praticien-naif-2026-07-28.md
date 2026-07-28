# Recette « praticien naïf » — 2026-07-28

> **Angle de la passe.** Les recettes précédentes vérifiaient que l'outil *fait ce qu'il annonce*.
> Celle-ci demande s'il *répond à ce qu'un praticien lui apporte*.
> Méthode : 8 situations cliniques écrites **à l'aveugle** avant toute ouverture de l'outil
> (fichier témoin `vignettes-praticien-naif-2026-07-28.md`, non modifié depuis), puis jouées
> dans l'application déployée `https://ebm-msp.vercel.app`.
> Aucun fichier de `content/`, `src/`, ni aucune recette antérieure n'a été lu.
> Point de vue : médecin généraliste, cabinet urbain, 15 min par consultation.
>
> **Hors périmètre de cette passe** : la justesse médicale du contenu (validée par le référent).
> Les points marqués **« question clinique »** sont signalés au référent, pas tranchés ici.

---

## 1. Première approche (avant toute saisie)

**Page d'accueil.** Deux cartes, « Aide à la décision » et « Veille hebdomadaire ». Je comprends
en 3 secondes où aller : le lien « Diabète de type 2 — voir les algorithmes disponibles » est
explicite. C'est le premier endroit que j'ai cliqué, sans hésiter. Bon point : la promesse
(« l'écart entre reco officielle et position critique ») est une proposition de valeur que je
comprends immédiatement et qui me distingue l'outil d'un simple rappel de recommandation.

**Écran des algorithmes.** Cinq lignes. Trois me parlent tout de suite :
« Fixer la cible d'HbA1c », « Traiter : initier, optimiser, intensifier », « Prescrire une statine
dans le DT2 ». Deux moins : « Règles hygiéno-diététiques » (je ne sais pas ce que l'outil peut
m'apporter là-dessus) et « Insulinothérapie du DT2 » (je pense que c'est de la diabétologie, pas
pour moi).

**Ma première déception arrive avant la première saisie** : mon patient n° 1, banal, pose deux
questions (metformine ? statine ?) et l'outil me demande de choisir **un** algorithme. Le
découpage n'est pas celui de ma consultation. J'y reviens en §4.

**Les intitulés parlent-ils ma langue ?** Les libellés de champs, oui, très majoritairement :
« Intention thérapeutique (« je souhaite… ») », « Ce qui oriente le choix », « Signaux d'alerte et
tolérance ». C'est du vocabulaire de consultation, pas de guideline. En revanche les **textes de
périmètre en haut de chaque écran** sont écrits pour l'auteur, pas pour moi. Verbatim, nœud
statine :

> « […] l'intolérance aux statines déclarée (désormais à TROIS valeurs : non / rapportée / avérée
> — **décision référent 2026-07-27**) […] et PROTOCOLE de réintroduction en aveugle (lavage,
> seuils, paliers de dose) — sa seule source détaillée n'a pas pu être ouverte, et **le red-team a
> demandé de ne pas l'encoder de seconde main (cf. Incertitudes)**. »

Et nœud alimentation :

> « **AUCUNE RESTRICTION, chiffrée ou non : ce nœud modifie des habitudes, il ne prescrit pas de
> régime (principe référent, 2026-07-27)** »

« Red-team », « décision référent », « encoder », « nœud E », « cf. changelog », « ce tier n'a pas
d'exclusion structurelle » : c'est le journal de bord du projet affiché en tête d'un écran clinique.
Je ne sais pas ce qu'est un « nœud E » ni un « red-team », et ça me fait douter de la maturité de
l'outil avant même d'avoir saisi un chiffre.

**Où je me sens perdu.** Deux endroits, immédiatement :

1. **Le bloc « EN ATTENTE — CRITÈRES À RENSEIGNER POUR TRANCHER »**, affiché avant toute saisie.
   Sur le nœud « Traiter », c'est **24 options listées** avec chacune sa liste de critères manquants.
   C'est un mur de texte qui s'ouvre sur un formulaire vide. Je ne sais pas si je dois le lire.
2. **Le bouton « Pourquoi pas d'autres options ? »**, dont le contenu est en logique machine :
   > « Arrêter la metformine (DFG < 30 — contre-indication rénale) : **Intention thérapeutique
   > (« je souhaite… ») ≠ Initier un traitement et Traitements en cours comprend Metformine** »

   C'est la règle, pas l'explication. En consultation je ne lis pas ça.

**Est-ce que je devine ce que l'outil sait faire ?** Partiellement. Je devine bien qu'il traite
le choix de la classe médicamenteuse. Je ne devine **pas** qu'il ne traite ni les doses, ni les
molécules, ni la perte de poids, ni la chirurgie bariatrique. Je l'apprends en le heurtant.

**Onglet « Veille » : page blanche.** L'accueil annonce « Veille hebdomadaire — Voir la semaine en
cours → ». Le clic donne un écran entièrement vide. Le texte « Bientôt disponible. » existe dans la
page mais est positionné à `top: 0`, c'est-à-dire **caché derrière la barre de navigation fixe**.
Pour moi, praticien, la moitié de l'outil annoncé sur l'accueil est cassée.

**Page « Méthode ».** Elle dit : *« statut : appliquée sur le domaine Diabète de type 2 (nœuds
« Cible glycémique » et « 1re intention selon les comorbidités » validés et encodés ; autres nœuds
en cours) »*. Donc **3 des 5 algorithmes que j'ai utilisés sont « en cours »**, et rien sur les
écrans de décision ne me le dit. Si je l'avais lu avant, je n'aurais pas fait confiance aux
réponses des nœuds statine, insuline et RHD.

---

## 2. Les 8 patients

> Les blocs « Histoire / Ma question / Réponse attendue » sont **recopiés du fichier témoin**,
> écrit avant ouverture de l'outil.

---

### P1 — M. B., 54 ans, diabète récent tout simple

**Histoire (témoin).** Artisan carreleur. DT2 découvert il y a 3 semaines, HbA1c 7,4 %, IMC 29,
TA 138/84, pas d'ATCD CV, DFG 92, LDL 1,42 g/L, pas d'albuminurie, aucun traitement. Motivé mais
mange sur les chantiers.

**Ma question (témoin).** Metformine tout de suite ou 3 mois de RHD seules ? Et statine d'emblée
à 54 ans sans complication ?

**Réponse attendue (témoin).** Metformine d'emblée avec les RHD. Sur la statine je pense que non,
mais je veux être conforté ou contredit avec un argument chiffré.

**Incertitude (témoin).** Faible, je le gère seul.

**Déroulé de saisie.** Deux écrans obligatoires.
*Nœud « Traiter »* : 7 actions (intention « Initier » ; HbA1c 7,4 ; position « Au-dessus » ; DFG 92 ;
IMC 29 ; « Normoalbuminurie » ; « Rien à signaler ») + 2 clics de navigation. ~1 min 15.
*Nœud « Statine »* : 6 actions (âge 54 ; « Rien à signaler » ×2 ; intolérance « Non » ;
ancienneté 0 ; autres FDR). ~1 min. **Total ≈ 2 min 30, 15 actions.**

**Réponse obtenue (verbatim).**

> **Metformine (socle du traitement) — instaurer ou poursuivre** · `Recommandation officielle (France)`
> `Preuve faible`
> « Pas de bénéfice sur critère dur démontré vs placebo (Griffin 2017, Boussageon 2012 NS). Socle par
> tolérance / sécurité / coût / recul. »
> Avantages : « Reco officielle française maintenue en 1re intention (coût, recul, tolérance, absence
> d'hypoglycémie) ; suffit SEULE sans indication d'agent à bénéfice d'organe. »
> Inconvénients : « Bénéfice propre sur critère dur de preuve faible (**ne pas afficher « bénéfice CV
> prouvé »**). »

> **Discuter la statine (décision partagée) — diabète non compliqué à faible risque absolu**
> · `Recommandée` `Preuve faible`
> Alerte : « Absence de tout critère de la grille (diabète récent, non compliqué, sans autre facteur
> de risque cardiovasculaire) : le risque absolu est probablement faible, et l'outil SCORE2-Diabète
> peut aider à l'objectiver (seuils fixes ESC 2023 : faible < 5 %, modéré 5-<10 %, haut 10-<20 %,
> très haut ≥ 20 %). Réserve : SCORE2-Diabète n'est validé que 40-69 ans […] »

**L'écart.**
- Sur la metformine : l'outil **répond, et m'apprend quelque chose**. Je prescris de la metformine
  depuis quinze ans en pensant qu'elle protège. « Preuve faible », « pas de bénéfice sur critère dur
  vs placebo », et surtout la consigne « ne pas afficher « bénéfice CV prouvé » » changent la phrase
  que je dis au patient. **C'est la meilleure chose que l'outil m'ait apportée de toute la journée.**
- Sur la statine : il me **contredit utilement**, et l'alerte SCORE2 avec ses seuils est directement
  actionnable.
- **Ce qu'il ne dit pas et que j'attendais** : (a) *3 mois de RHD d'abord ou pas ?* — jamais traité
  frontalement ; je le déduis seulement du fait que l'option « mesures hygiéno-diététiques seules »
  n'apparaît que si l'HbA1c est à la cible. (b) **Aucune dose, aucune titration.** « Instaurer la
  metformine » sans « 500 mg le soir puis augmenter sur 2 semaines » n'est pas une aide à la
  prescription, c'est un rappel d'indication.
- **Défaut grave rencontré ici** : le champ **« Autres facteurs de risque cardiovasculaire » est un
  nombre libre, sans aucune définition de ce qui compte**. HTA à 138/84 ? Tabac sevré depuis 12 ans ?
  IMC 29 ? HDL bas ? J'ai saisi 2, puis 0, pour voir. **Le résultat bascule** :
  - `2` → **« Statine (prévention primaire, intensité modérée) » — Recommandée, Preuve modérée**
  - `0` → **« Discuter la statine (décision partagée) » — Recommandée, Preuve faible**
  Deux conduites différentes selon un chiffre que je devine. Deux confrères saisiront deux valeurs
  différentes pour le même patient.
- Le champ **LDL n'existe pas**. Le raisonnement EBM est expliqué en tête d'écran et je le comprends,
  mais j'ai le bilan lipidique sous les yeux et je ne peux pas le saisir : c'est déroutant à la
  première rencontre, et rien ne me dit « le LDL n'est volontairement pas demandé ».
- Le champ **« CK, en multiples de la normale (0 = non dosé) »** est marqué obligatoire alors que je
  ne dose jamais les CK avant d'introduire une statine. J'ai dû relire deux fois le libellé pour
  comprendre la convention « 0 ».

**En vraie consultation ?** **Oui, une fois** — pour apprendre la phrase sur la metformine. Ensuite,
non : je connais la réponse, elle ne change plus.

---

### P2 — Mme C., 61 ans, déséquilibre modéré sous metformine seule

**Histoire (témoin).** DT2 depuis 6 ans, metformine 1000 ×2 depuis 4 ans. HbA1c 7,1 → 7,3 → **7,9 %**.
IMC 31,4 (+4 kg depuis le décès de son mari). DFG 78, LDL 1,05 sous atorvastatine, pas d'ATCD CV, pas
de rétinopathie, albuminurie négative. **Ne veut surtout pas de piqûres.**

**Ma question (témoin).** Deuxième ligne : quoi, et sur quel argument ? Ni MCV, ni IRC, ni IC. Le
surpoids suffit-il à justifier un aGLP1 ? Le refus des injections ferme-t-il la porte au GLP1
(Rybelsus oral ?) ?

**Réponse attendue (témoin).** Je m'attends à « iSGLT2 ou aGLP1 même sans MCV », mais je veux savoir
**sur quel niveau de preuve**, parce qu'en pratique la gliptine est plus simple. Si l'outil me dit
« gliptine acceptable », ça change ma consultation.

**Incertitude (témoin).** Moyenne. Je fais souvent ce choix « au feeling ». **C'est exactement le cas
où un outil me serait utile.**

**Déroulé de saisie.** Un seul écran. 14 actions (intention « Intensifier » ; Metformine ; dose 2000 ;
HbA1c 7,9 ; « Au-dessus » ; DFG 78 ; IMC 31,4 ; « Normoalbuminurie » ; « Rien à signaler » ;
« Refuse » l'injectable ; « Rien à signaler »). **≈ 1 min 30.**

**Réponse obtenue (verbatim).** D'abord, sans le refus d'injection, une liste hiérarchisée :
AR GLP-1 (`Recommandée` `Preuve modérée`) > iSGLT2 (`Preuve élevée`) > tirzépatide > gliptine >
sulfamide. Puis après saisie du refus :

> « **Refus des injections : privilégier une alternative ORALE (sémaglutide oral, iSGLT2, iDPP4)** —
> les options injectables (AR GLP-1 injectable, tirzépatide, association) sont reléguées en dernier.
> Si aucune alternative non injectable adaptée n'existe alors qu'un bénéfice cardio-rénal prouvé est
> requis, un injectable reste à discuter avec le patient (le refus ne doit pas priver d'un traitement
> à bénéfice démontré). »

et le classement devient : iSGLT2 (`Recommandée` `Preuve élevée`) > puis un bloc

> « **OPTIONS ÉQUIVALENTES SUR LES DONNÉES DISPONIBLES : L'OUTIL NE LES DÉPARTAGE PAS, LE CHOIX
> REVIENT AU PRATICIEN.** » — Gliptine (sitagliptine) « option glycémique orale de bas rang (place
> résiduelle) » / Sulfamide « option glycémique de bas rang, derrière la gliptine ».

**L'écart.** **C'est le meilleur patient de la série.** L'outil répond exactement à ma question,
et à la sous-question sur les injections que je n'espérais pas voir traitée. Le bloc « options
équivalentes, l'outil ne les départage pas » est une honnêteté que je n'ai vue dans aucun autre
outil : il me dit où s'arrête la preuve au lieu de trancher arbitrairement. Et il me répond sur la
gliptine : disponible, mais nommée « bas rang / place résiduelle » — ça change ma consultation, comme
je l'espérais.

**Deux réserves quand même :**
1. **Contradiction entre l'alerte et le classement.** L'alerte me dit « privilégier une alternative
   ORALE (**sémaglutide oral**…) », mais le sémaglutide oral **n'est pas une option affichable** : il
   n'existe que dans une ligne de contre-indication de la carte « AR GLP-1 », et cette carte est
   justement **reléguée tout en bas** par le refus d'injection. Un praticien qui lit le classement
   conclut « pas de GLP-1 pour elle » et rate l'option orale que l'alerte lui recommande. C'est un
   risque de **sous-traitement induit par l'outil**.
2. Le classement AR GLP-1 (`Preuve modérée`, badgé `Recommandée`) **devant** iSGLT2 (`Preuve élevée`,
   non badgé) est contre-intuitif à la lecture rapide. La ligne « Ce rang tient compte de : … ou IMC
   ≥ 30 » l'explique, mais en petit et en logique de règle.

**En vraie consultation ?** **Oui, franchement oui.** C'est le patient pour lequel j'ouvrirais
l'outil.

---

### P3 — M. D., 68 ans, maladie cardiovasculaire établie

**Histoire (témoin).** DT2 depuis 14 ans. IDM inférieur 2019, 2 stents actifs, FEVG 48 %, NYHA I.
Metformine 1000 ×2, gliclazide LM 60, aspirine, bisoprolol, ramipril, atorvastatine 80.
HbA1c 8,2 %. IMC 27,8. DFG 62. LDL 0,71. **Albuminurie 42 mg/g.** Tabac sevré. **Deux malaises
hypoglycémiques le mois dernier.**

**Ma question (témoin).** Je veux enlever le gliclazide et mettre un iSGLT2. **Lequel, à quelle dose**,
et arrêt sec ou décroissance ? L'albuminurie à 42 change-t-elle quelque chose ?

**Réponse attendue (témoin).** Empagliflozine 10 mg, arrêt/baisse du gliclazide. Je veux surtout être
conforté sur **la séquence** et sur **la surveillance à prévoir** (créat à J15 ? mycose génitale à
annoncer ?). Ce sont les choses que j'oublie de dire.

**Incertitude (témoin).** Faible-moyenne, je ne suis pas sûr de mes modalités pratiques.

**Déroulé de saisie.** 15 actions, **avec deux incidents** (voir plus bas). **≈ 3 min**, dont 1 min
perdue à comprendre pourquoi la reco ne se calculait pas.

**Réponse obtenue (verbatim).**

> **Introduire un iSGLT2 (protection cardio-rénale et/ou contrôle glycémique)** · `Recommandée`
> `Preuve élevée`
> « Hospit. IC HR ~0,61-0,73 (**NNT ~19-31 / 16-26 mois**) ; progression rénale HR ~0,56-0,76
> (NNT DAPA-CKD 19, CREDENCE 22). **IDM/AVC non réduits.** » · *Délai du bénéfice : 16-26 mois*
> « **Pas d'effet sur l'IDM ni l'AVC ; en athérome pur SANS IC ni maladie rénale, préférer un
> AR GLP-1.** »

> **Réduire la posologie du sulfamide (tolérance, hypoglycémie légère)** · `Recommandée` `Preuve faible`

et une alerte :

> « Position déclarée AU-DESSUS de l'objectif, avec une intention d'OPTIMISATION : l'outil s'en tient
> à ce qui est déclaré et ne propose donc **aucune INTENSIFICATION GLYCÉMIQUE** […] Si un renforcement
> du contrôle glycémique est visé, déclarer l'intention « intensifier » ouvre les options
> correspondantes. »

**L'écart.**
- **Il me contredit, et bien.** Je venais chercher une confirmation pour l'empagliflozine post-IDM ;
  il me dit « pas d'effet sur l'IDM ni l'AVC, en athérome pur préférer un AR GLP-1 ». C'est
  l'albuminurie à 42 qui fait basculer vers l'iSGLT2 — et il me le dit dans le « proposé parce que ».
  **Ça répond exactement à ma troisième sous-question.** Les NNT et le délai du bénéfice (16-26 mois)
  sont ce que je n'ai jamais en tête et que je peux redire au patient.
- **Ce qu'il ne dit pas et que j'attendais** : *« lequel, à quelle dose »* — **rien**. Jamais
  « empagliflozine 10 mg » ni « dapagliflozine 10 mg ». La classe, pas la molécule, pas la dose.
  Et *« arrêt sec ou décroissance du gliclazide »* — il propose « réduire la posologie », sans dire
  comment ni sur combien de temps. Et *« quelle surveillance »* — pas de créatinine de contrôle, pas
  de délai. Les infections génito-urinaires sont citées en contre-indication, pas comme « information
  à donner au patient ».
- **Mon hésitation d'intention est confirmée** : je veux à la fois retirer le gliclazide *et* ajouter
  un iSGLT2. L'outil ne permet qu'une intention à la fois. L'alerte l'explique très clairement — c'est
  honnête — mais concrètement **je dois passer le même patient deux fois**.
- **Incident 1 (grave).** J'avais coché « Metformine » et « Sulfamide » dans « Traitements en cours »,
  je les ai vus cochés à l'écran, et **quelques clics plus tard les deux cases étaient décochées**,
  sans aucun avertissement — alors que « Traitements en cours » est le champ le plus décisif de cet
  écran. La recommandation affichée entre-temps était donc calculée sur un patient sans traitement.
  Je n'ai vu le problème qu'en remontant par hasard.
- **Incident 2.** Le « proposé parce que » de la désintensification (visible en P5) est une chaîne de
  8 conditions reliées par « et », illisible en consultation.

**En vraie consultation ?** **Oui, mais une seule fois par patient** — pour l'argument « athérome pur
→ GLP-1 » et pour les NNT. Pas à chaque renouvellement.

---

### P4 — Mme E., 74 ans, insuffisance rénale chronique

**Histoire (témoin).** DT2 depuis 19 ans. **DFG 34**, A/C 380 mg/g. **Metformine 850 ×2 (!)**,
sitagliptine 50, furosémide, irbésartan, atorvastatine. HbA1c 7,6 %. IMC 24. Hb 10,8. K+ 4,9.
**Gastro-entérite il y a 3 semaines avec 2 jours de vomissements ; elle a continué la metformine.**

**Ma question (témoin).** (a) Je garde la metformine à 1700 mg/j avec un DFG à 34 ? (b) iSGLT2 malgré
le DFG bas — jusqu'à quel seuil, et le « dip » de créatinine ? (c) Est-ce que je dois écrire les
règles de jour de maladie ?

**Réponse attendue (témoin).** Réduction à 1000 mg/j max, dapagliflozine pour la néphroprotection, et
surtout **une consigne écrite d'arrêt en cas de déshydratation** — c'est le point (c) qui me manque
le plus, j'aimerais une phrase à copier-coller.

**Incertitude (témoin).** Moyenne-forte. Je vérifie systématiquement mes seuils rénaux. **C'est un cas
où je perds du temps.**

**Déroulé de saisie.** Un écran, 13 actions. **≈ 1 min 45.**

**Réponse obtenue (verbatim).**

> **Alerte : « Metformine : dose maximale 1 000 mg/j, initiation ≤ 500 mg si DFG 30-44 (RCP ANSM). »**
> **Alerte : « Non-association incrétine : si un AR GLP-1 ou le tirzépatide est introduit, la gliptine
> doit être ARRÊTÉE — même voie incrétine, aucun bénéfice additif (Nauck 2017 ; ADA §9 ; KDIGO
> PP4.2.3 ; HAS R.80). Ne jamais les associer. »**

> **À faire d'emblée — sécurité** : **Réduire la posologie de la metformine (fonction rénale altérée
> ou intolérance digestive)** · `Recommandée`
> **Introduire un iSGLT2** · `Recommandée` `Preuve élevée` — « Ne pas initier si DFG < 20 (poursuivre
> jusqu'à la dialyse si déjà en cours — KDIGO 2024). »
> **Remplacer la gliptine (aucun bénéfice sur critère dur — préférer un agent qui en apporte)** ·
> `Recommandée` `Preuve modérée`

**L'écart.** **C'est le patient pour lequel l'outil est le plus rentable de toute la série.**
- (a) **Répondu avec un chiffre exploitable en 90 secondes** : « dose maximale 1 000 mg/j ». C'est
  exactement l'information que je vais chercher dans le Vidal, et le regroupement « À faire d'emblée —
  sécurité » est bien pensé.
- (b) **Répondu** : seuil DFG ≥ 20, source KDIGO 2024. Le **« dip » initial de créatinine n'est jamais
  mentionné** — je devrai le chercher ailleurs, et c'est précisément ce qui fait paniquer un patient
  au contrôle biologique.
- (c) **Pas répondu comme je l'attendais.** Le contenu des règles de jour de maladie existe, mais
  enfoui dans une ligne de contre-indication de la carte metformine : « À suspendre : déshydratation,
  sepsis, jeûne, produit de contraste iodé, chirurgie ». Ce n'est **pas** une consigne patient, ce
  n'est pas mis en avant, et ce n'est pas copiable. Chez une femme de 74 ans qui vient d'avoir une
  gastro-entérite avec vomissements en continuant sa metformine, **c'est le point le plus important
  de la consultation**, et l'outil le range au même niveau que les autres contre-indications.
- **Ce que je n'ai pas pu renseigner** : l'épisode de déshydratation récent. Aucun champ. C'est
  pourtant le fait clinique qui m'inquiète le plus chez elle.

**En vraie consultation ?** **Oui, sans hésiter.** C'est le meilleur rapport temps/valeur de la série.

---

### P5 — M. F., 86 ans, fragile, polymédiqué, vit seul

**Histoire (témoin).** Veuf, 4e sans ascenseur, aide-ménagère 2 h/semaine. DT2 depuis 22 ans.
MMSE 24/30. IMC 20,1, **-4 kg en 1 an**. **2 chutes en 6 mois.** Metformine 500 ×2, glimépiride 2 mg,
glargine 14 UI, bisoprolol, furosémide, apixaban, oméprazole, zopiclone. **HbA1c 6,8 %.** DFG 41.
Glycémies capillaires : 0,72 g/L un matin, 1,90 un autre. Fille à 400 km.

**Ma question (témoin).** Est-ce que je **dé-prescris** ? Que j'arrête en premier : glimépiride ou
insuline ? Quelle cible d'HbA1c à 86 ans avec des chutes ?

**Réponse attendue (témoin).** Arrêt du glimépiride en premier, cible 7,5-8,5 %, allègement de
l'insuline. **J'attends surtout que l'outil reconnaisse la désescalade comme une décision légitime.**
S'il ne sait que monter les traitements, il ne me sert à rien chez ce patient — qui est un quart de
ma patientèle diabétique.

**Incertitude (témoin).** Forte sur les modalités, faible sur le principe.

**Déroulé de saisie.** Deux écrans. *Traiter* : 15 actions, ≈ 2 min. *Cible d'HbA1c* : 4 actions,
≈ 30 s. **Total ≈ 2 min 30, 19 actions.**

**Réponse obtenue (verbatim).**

> **Alerte : « Association insuline + sulfamide / glinide : risque d'hypoglycémie cumulée. Envisager
> d'arrêter le sulfamide / le glinide, surtout à l'introduction ou à l'intensification de
> l'insuline. »**
> **Alerte : « Patient sous insuline à haut risque hypoglycémique : ÉVITER d'ajouter un sécrétagogue
> (sulfamide / glinide). »**

> **OPTIONS ÉQUIVALENTES SUR LES DONNÉES DISPONIBLES : L'OUTIL NE LES DÉPARTAGE PAS, LE CHOIX REVIENT
> AU PRATICIEN.**
> — **Désintensifier : alléger / arrêter le sulfamide, le glinide ou réduire l'insuline** ·
> `Recommandée` — « **Ne JAMAIS retirer un iSGLT2 ni un AR GLP-1 pour désintensifier** : bénéfice
> cardio-rénal maintenu quelle que soit la glycémie (ADA 13.14d grade A). »
> — **Réduire la posologie de l'insuline (sur-basalisation / hypoglycémie)** · `Recommandée`
> — **Réduire la posologie du sulfamide (tolérance, hypoglycémie légère)** · `Recommandée`

> *(nœud cible)* **Cible < 9 %** · `Recommandée` `Preuve très faible`
> « Évite l'hyperglycémie symptomatique et le sur-traitement en fin de vie ; priorité à la qualité de
> vie. » / « Vise le confort, pas la prévention des complications. »

> **« Introduire un AR GLP-1 écarté : IMC (kg/m²) < 22 et Dénutrition / carence »**

**L'écart.**
- **La désescalade est bien un citoyen de première classe** : c'est ma question de principe, et la
  réponse est oui. Les deux alertes hypoglycémie sont pertinentes, et le garde-fou « ne jamais retirer
  un iSGLT2/GLP-1 pour désintensifier » est exactement le genre d'erreur que j'aurais pu faire.
  L'exclusion explicite du GLP-1 sur IMC < 22 + dénutrition est excellente.
- **Il me contredit sur la cible** : j'écrivais 7,5-8,5 %, il dit < 9 %, en assumant « preuve très
  faible » et « vise le confort, pas la prévention ». Utile.
- **Ce qu'il ne dit pas et que j'attendais** : *lequel j'arrête en premier*. Les trois gestes sont
  présentés comme **équivalents**, « l'outil ne les départage pas ». C'est honnête, mais c'était ma
  question principale, et je repars sans réponse. Aucune vitesse de décroissance de l'insuline non plus.
- **Ce que je n'ai pas pu renseigner, et qui pilote toute ma décision** : les **chutes**, le **MMSE /
  les troubles cognitifs**, le fait qu'il **vive seul**, la **polymédication** (9 lignes), et **qui
  fait l'injection**. Rien de tout cela n'a de champ. Tout doit tenir dans une seule case
  « Fragilité ». C'est très en dessous de ce que j'apporte.
- **Point le plus inquiétant de ce patient.** Avec l'intention déclarée **« Déprescrire »**, l'outil
  affiche quand même, **au-dessus** des options de désescalade dans l'ordre de lecture :
  > **Introduire un iSGLT2** · `Recommandée` `Preuve élevée` — « Proposé parce que : DFG < 60 et
  > Remplacement d'un agent sans bénéfice sur critère dur »
  Chez un homme de 86 ans, IMC 20,1, **-4 kg en un an**, dénutrition cochée, deux chutes, DFG 41, sous
  insuline. Le garde-fou de terrain (IMC < 22, dénutrition) **existe pour l'AR GLP-1 mais pas pour
  l'iSGLT2**. Une alerte explique bien que c'est une « indication transverse » et non une
  contradiction — mais le badge `Recommandée` `Preuve élevée` est ce que l'œil attrape d'abord.
  **→ question clinique** (déplétion volémique, perte de poids supplémentaire, acidocétose
  euglycémique chez un sujet dénutri) : je la laisse au référent, mais **du point de vue de
  l'interface, c'est le cas où l'outil peut me faire faire l'inverse de ce que je suis venu faire.**

**En vraie consultation ?** **Oui, pour l'ouvrir devant la famille** et montrer que la désescalade est
recommandée — c'est un argument que je n'ai pas seul. **Mais je devrais me méfier de la carte iSGLT2.**

---

### P6 — Mme G., 43 ans, obésité importante, demande sur le poids

**Histoire (témoin).** Aide à domicile, 2 enfants. DT2 depuis 3 ans. **IMC 41,2** (117 kg / 1,68 m).
Metformine 1000 ×2. HbA1c 8,4 %. TA 145/90 non traitée. DFG 104. SAOS mal observé. Gonalgies
invalidantes. **Elle vient explicitement pour maigrir** et demande « les piqûres pour maigrir ».
Budget serré.

**Ma question (témoin).** Comment j'articule sa demande (le poids) avec mon objectif ? aGLP1 ?
**Chirurgie bariatrique à 43 ans avec IMC 41 + DT2, et à quel moment ?** Et **qu'est-ce que je lui dis
qu'elle peut espérer, chiffré ?**

**Réponse attendue (témoin).** aGLP1 et **évocation explicite de la chirurgie**. J'attends surtout des
**chiffres à lui donner** : combien de kg avec quoi, en combien de temps, taux de rémission. **Si
l'outil me sort « règles hygiéno-diététiques » sans chiffre, il ne m'aide pas.**

**Incertitude (témoin).** Moyenne. La conversation dure 25 minutes et je n'ai pas les chiffres en tête.

**Déroulé de saisie.** J'ai commencé par « Règles hygiéno-diététiques » (sa demande porte sur le
mode de vie). 2 clics, **et j'ai su en 15 secondes qu'il fallait fermer** :

> **« Hors périmètre des deux nœuds : l'objectif de perte de poids et la rémission, la prescription
> diététique détaillée […] »**

et sur l'écran suivant :

> **« Hors périmètre : objectif de perte de poids et rémission (aucun nœud ne les porte à ce jour) »**

Puis nœud « Traiter » : 13 actions, ≈ 1 min 45. **Total ≈ 2 min 15.**

**Réponse obtenue (verbatim).**

> **Introduire un AR GLP-1 (liraglutide, sémaglutide, dulaglutide)** · `Recommandée` `Preuve modérée`
> « MACE HR ~0,87-0,88 ; NNT ~18 en prévention secondaire, ~60-70 en primaire. » / « forte efficacité
> HbA1c **et perte de poids** »
> **Introduire le tirzépatide (obésité — prescription spécialisée)** · `Preuve modérée`
> « Efficacité HbA1c et **perte de poids supérieures** aux AR GLP-1 ; réservé à l'OBÉSITÉ associée au
> diabète (IMC ≥ 30), **prescription par spécialiste**. »

**L'écart.** **Le plus grand écart de la série.**
- Ce que je voulais — **des kilos, un délai, un taux de rémission, et un mot sur la chirurgie** — n'est
  **nulle part**. « Perte de poids » est écrit trois fois, **jamais en kg ni en %**. La chirurgie
  bariatrique n'est mentionnée **nulle part dans tout l'outil**, alors que cette patiente (IMC 41 +
  DT2) est une indication de manuel.
- Ce que l'outil m'apprend : le tirzépatide est **de prescription spécialisée** — utile, ça m'évite de
  promettre ce que je ne peux pas prescrire.
- **Le bon point, et il est réel** : l'outil **dit qu'il ne sait pas**, en tête d'écran, en clair, et
  je l'ai su en 15 secondes. C'est très supérieur à un outil qui répondrait à côté. Mais le résultat
  net est que **la consultation qui me prend 25 minutes est celle où l'outil ne m'apporte rien.**
- **Ce que je n'ai pas pu renseigner** : sa demande explicite, sa motivation, ses gonalgies, le SAOS,
  ses horaires décalés, son budget. Le contexte social n'existe pas dans cet outil.

**En vraie consultation ?** **Non.** Pour ce type de patient, ouvrir l'outil est un **coût net**.

---

### P7 — M. H., 59 ans, sous insuline, mal équilibré, sans capteur

**Histoire (témoin).** **Chauffeur poids lourd — et c'est central.** DT2 depuis 16 ans. Glargine 42 UI +
metformine 1000 ×2 + sitagliptine 100. **HbA1c 9,1 %.** 94 kg, IMC 30,6, +6 kg en 2 ans. DFG 71.
**Pas de capteur de glucose.** Carnet quasi vide, quelques valeurs matinales 1,60-2,20 g/L, aucune
valeur en journée. Refuse les hypoglycémies (permis groupe lourd). Ne veut pas se piquer 4 fois/jour.

**Ma question (témoin).** Basale insuffisante ou hyperglycémies post-prandiales ? **Je n'ai pas les
données pour trancher.** Monter la basale, ou ajouter un aGLP1 plutôt qu'un bolus ? Quelle
surveillance minimale compatible avec son métier ?

**Réponse attendue (témoin).** aGLP1 plutôt que basal-bolus, titration prudente, et **une consigne
d'autosurveillance réaliste**. J'attends aussi que **l'outil me dise ce qu'il ne peut pas conclure
faute de données**, plutôt que de me donner une réponse ferme sur des glycémies que je n'ai pas.

**Incertitude (témoin).** Forte. C'est un patient pour qui je demanderais un avis diabéto — sauf que
le délai est de 4 mois.

**Déroulé de saisie.** **C'est ici que j'aurais abandonné.** L'écran s'ouvre sur :

> « Reco provisoire — **19 critères décisifs non confirmés** »

J'ai saisi 14 champs (situation « Basale seule », âge 59, HbA1c 9,1, cible 7,5, DFG 71, metformine,
gliptine, insuline basale, glycémie à jeun 1,9, poids 94, basale 42 U). **≈ 3 min 30.** Puis blocage.

**Réponse obtenue — et le point de rupture.**

Bonne nouvelle d'abord, une alerte **exactement** taillée pour lui :

> **« Sans MCG : titrer la basale sur la glycémie à jeun (cible ~0,70-1,20 g/L) ; utiliser des profils
> capillaires 6-7 points (avant/après les 3 repas + coucher) pour guider l'intensification
> prandiale. »**

C'est la réponse à ma troisième sous-question, et elle est parfaite.

**Mais aucune option n'est proposée :**

> « **Aucune option n'est proposée pour l'instant : la décision est suspendue, faute de critères
> renseignés.** »
> EN ATTENTE — « Titrer la basale (augmenter la dose) — à renseigner : **TBR — temps sous 70 mg/dL (%),
> TBR sévère — temps sous 54 mg/dL (%), Coefficient de variation glycémique (%), Profil glycémique
> (lecture AGP)** »

**J'ai décoché « MCG disponible ». L'outil continue à exiger quatre métriques de capteur.** Les quatre
options restantes en dépendent toutes. **Pour un patient sans capteur, ce nœud est une impasse** — et
c'est le nœud dont le périmètre annonce « Aide à la prescription **en médecine générale** ».

J'ai fait ce qu'un praticien pressé fait : j'ai tapé **0** dans les trois champs chiffrés. Il restait
« Profil glycémique (lecture AGP) ». J'ai coché **« Excursions post-prandiales »** au jugé. Et là :

> **Ajouter un GLP-1 / une association fixe d'abord** · `Recommandée` `Preuve modérée`
> **Ajouter un bolus au repas principal (basal-plus, par étapes)** · `Recommandée` `Preuve modérée` ·
> **« Doses indicatives : Bolus initial (~10 % de la basale) ≈ 4 U »**
> **Titrer la basale (augmenter la dose)** · `Recommandée` · **« Doses indicatives : Basale après
> +2 U ≈ 44 U/j »**
> *Proposé parce que : Situation = Basale seule et HbA1c à la cible : non et* **Profil nocturne à la
> cible (excursions post-prandiales au premier plan)**

**L'écart, et le danger.**
- L'aide au calcul de dose (« ≈ 4 U », « ≈ 44 U/j ») est **excellente** — c'est la chose la plus
  concrète de tout l'outil. Et la hiérarchie « GLP-1 avant le bolus » est exactement ce que
  j'attendais.
- **Mais elle repose sur une donnée que j'ai inventée.** Le moteur affiche « **Profil nocturne à la
  cible** » alors que je n'ai aucun profil nocturne, et dans la même phrase « **Glycémie à jeun à la
  cible : non** » (1,9 g/L). Les deux ne peuvent pas être vrais ensemble. **Rien à l'écran ne signale
  que le profil AGP a été déclaré alors que « MCG disponible » est décoché.** L'outil propose ensuite
  d'ajouter un bolus à un chauffeur poids lourd, sur la foi de ma case cochée au hasard.
- **Ce que je n'ai pas pu renseigner et qui commande tout** : **sa profession et son permis groupe
  lourd**. Aucun champ. C'est la contrainte n° 1 de ce patient, et l'outil ne peut pas la voir.
- **Ce qu'on m'a demandé et que je n'ai pas** : TBR, TBR sévère, coefficient de variation, lecture AGP.
  Quatre données de capteur. **La majorité de mes DT2 sous insuline n'ont pas de capteur.**

**En vraie consultation ?** **Non, en l'état.** Sauf pour lire l'alerte « sans MCG » — que je pourrais
avoir sur une fiche papier.

---

### P8 — Mme J., 71 ans, comorbidités opposées

**Histoire (témoin).** DT2 depuis 21 ans. **IC à FEVG 32 %, NYHA III**, 2 décompensations en 14 mois.
**DFG 27**, A/C 620 mg/g. **Cirrhose Child A** sur NASH, varices grade I. **Anémie 9,4 g/dL.**
**Cancer du sein 2021**, tamoxifène en cours. 68 kg, IMC 26,5, ascite → poids sec incertain.
Glargine 26 + asparte 6-6-6, furosémide 80, spironolactone 25 (**K+ 5,2**), sacubitril/valsartan,
bisoprolol, atorvastatine, apixaban. **HbA1c 7,9 % — mais avec l'anémie et la cirrhose je ne sais pas
ce qu'elle vaut.** **« Je ne veux plus qu'on m'ajoute des médicaments. »**

**Ma question (témoin).** L'iSGLT2 est indiqué trois fois et je n'ose pas le mettre : DFG 27, K+ 5,2,
cirrhose, dénutrition possible, acidocétose euglycémique. Je le mets ? **L'HbA1c à 7,9 % avec anémie
+ cirrhose, je m'en sers ou pas ?** Comment j'intègre son refus explicite ?

**Réponse attendue (témoin).** Oui à l'iSGLT2 (DFG ≥ 25 pour l'IC), surveillance du K+, et arrêt d'un
autre médicament en échange. **Sur l'HbA1c j'attends qu'on me dise qu'elle est non interprétable ici.**
Je m'attends à ce que l'outil ne sache pas répondre — **et ce serait acceptable s'il le disait.**

**Incertitude (témoin).** Très forte. En vrai j'appelle le cardiologue et le néphrologue.

**Déroulé de saisie.** 16 actions, ≈ 2 min 30, **dont une erreur de ma part** : le champ « dose de
metformine » ayant disparu (pas de metformine cochée), la mise en page a glissé et **j'ai saisi 7,9
dans « HbA1c cible » au lieu de « HbA1c actuelle »**. Le champ « cible » étant marqué « sans effet sur
la reco actuelle », **rien ne me l'a signalé** ; je ne l'ai vu qu'en relisant l'écran.

**Réponse obtenue (verbatim).**

> **Alerte : « Metformine CONTRE-INDIQUÉE si DFG < 30 (RCP ANSM) : arrêter ; sulfamide aussi. Un
> iSGLT2 reste initiable jusqu'à DFG ≥ 20 (indication rénale). Ces limites portent sur l'ÉLIMINATION
> RÉNALE des agents, pas sur leur efficacité glycémique : l'AR GLP-1 et l'insuline n'ont pas de
> contre-indication liée au DFG et restent utilisables en dessous de 20. »**

> **Introduire un iSGLT2** · `Recommandée` `Preuve élevée`
> « Proposé parce que : Insuffisance cardiaque et DFG < 60 et Albuminurie ≠ Normoalbuminurie »
> **Introduire un AR GLP-1** · `Preuve modérée` — « Chez un sujet fragile, surveiller le poids et
> l'état nutritionnel à l'instauration d'un incrétine. »
> **« Metformine (socle du traitement) écarté : DFG < 30 »**

**L'écart.**
- **Il tranche ma question principale, nettement** : oui, iSGLT2, DFG 27 ≥ 20, et l'alerte sépare
  proprement « limite d'élimination rénale » et « efficacité glycémique ». **Ça me débloque.** J'étais
  venu chercher exactement ça.
- **Mais il ne dit rien sur tout le reste, et il ne dit pas qu'il ne sait pas.** Aucun champ, aucune
  mention, nulle part, pour : la **cirrhose Child A** (alors que la metformine est écartée sur le DFG
  et que l'insuffisance hépatique est citée dans ses contre-indications), le **K+ à 5,2 sous
  spironolactone**, l'**anémie**, le **cancer du sein / tamoxifène**, l'**ascite / poids sec**, et le
  **refus explicite d'un médicament de plus**.
- **Le point le plus important de ce patient** : j'ai saisi une **HbA1c de 7,9 % chez une femme
  anémique et cirrhotique**, et l'outil l'a traitée comme une valeur fiable, sans un mot. **L'outil ne
  questionne jamais la validité de l'HbA1c qu'on lui donne.** Chez elle, c'est la donnée sur laquelle
  je suis le moins sûr, et c'est celle sur laquelle il raisonne le plus.
- L'insuffisance cardiaque est **une case à cocher oui/non** : pas de FEVG, pas de NYHA. Pour NYHA III
  à 32 % de FEVG, c'est une compression massive — sans conséquence sur la réponse ici, mais elle
  m'empêche de saisir ce que je sais.

**En vraie consultation ?** **Oui, pour la seule question du seuil rénal de l'iSGLT2** — et j'appelle
quand même le cardiologue et le néphrologue. L'outil m'a fait gagner l'appel au néphrologue sur le
seuil, pas le reste.

---

## 3. Tableau de synthèse

| # | Patient | Écrans | Actions | Temps | Ce que je n'ai pas pu renseigner | Ce qu'on m'a demandé et que je n'ai pas | Je l'ouvrirais ? |
|---|---|---|---|---|---|---|---|
| P1 | 54 ans, DT2 récent simple | 2 | 15 | ~2 min 30 | TA, tour de taille, LDL, mode de vie professionnel | Cétonémie ; CK ; « nombre de FDR CV » (indéfini) | **Une fois** — pour la phrase « preuve faible » sur la metformine |
| P2 | 61 ans, 2e ligne sous metformine | 1 | 14 | ~1 min 30 | Deuil / contexte de reprise de poids, sédentarité | — | **Oui** — le meilleur cas d'usage |
| P3 | 68 ans, IDM 2019 + hypos | 1 (×2 intentions) | 15 | ~3 min | FEVG, NYHA, ancienneté des stents, nombre d'hypos | Cétonémie | **Oui, une fois par patient** |
| P4 | 74 ans, DFG 34 | 1 | 13 | ~1 min 45 | Épisode de déshydratation récent, K+, Hb | Cétonémie | **Oui, sans hésiter** |
| P5 | 86 ans, fragile, déprescription | 2 | 19 | ~2 min 30 | **Chutes, MMSE, vit seul, polymédication, qui injecte** | Cétonémie | **Oui, avec méfiance** (carte iSGLT2) |
| P6 | 43 ans, IMC 41, demande poids | 2 | 15 | ~2 min 15 | Demande du patient, motivation, SAOS, gonalgies, budget | — | **Non — coût net** |
| P7 | 59 ans, insuline, sans capteur | 1 | 14 + blocage | ~3 min 30 | **Profession / permis poids lourd** | **TBR, TBR sévère, CV glycémique, lecture AGP** | **Non en l'état** |
| P8 | 71 ans, IC + IRC + cirrhose | 1 | 16 | ~2 min 30 | **Cirrhose, K+, anémie, cancer, ascite, refus du patient** | — | **Oui, pour une seule question** |

---

## 4. Analyse critique transversale

### 4.1 L'écart global : ce que j'apporte et qu'il ne sait pas recevoir

L'outil reçoit très bien **la biologie et la liste des classes médicamenteuses**. Il ne reçoit
quasiment rien de ce qui, dans ma consultation, fait basculer une décision :

| Ce que j'apporte | Place dans l'outil |
|---|---|
| Chutes, troubles cognitifs, isolement, polymédication | Une seule case « Fragilité » |
| Profession, permis, horaires de travail | Aucune |
| Demande explicite du patient, motivation, refus d'un traitement de plus | Uniquement « Préférence vis-à-vis de l'injectable » |
| Contexte social, budget, observance | Aucune |
| Cirrhose, anémie, cancer, dysthyroïdie | Aucune |
| Kaliémie, hémoglobine | Aucune |
| Épisode aigu récent (gastro, déshydratation) | Aucune |
| FEVG, NYHA | Case oui/non « Insuffisance cardiaque » |
| Fiabilité de l'HbA1c saisie | **Jamais questionnée** |

**Les questions de ma pratique qui n'ont aucune place :**
1. **« Combien de kilos peut-elle espérer, et faut-il parler chirurgie ? »** — déclaré hors périmètre.
2. **« Quelle dose, quelle molécule, quelle titration ? »** — présent uniquement dans le nœud insuline.
3. **« Que dois-je surveiller, et quand ? »** — aucun plan de suivi nulle part.
4. **« Que dois-je dire au patient ? »** — aucune formulation copiable, y compris pour les règles de
   jour de maladie.
5. **« Cette HbA1c est-elle interprétable chez ce patient ? »**

### 4.2 Le découpage en écrans

Il ne correspond pas à ma façon de penser un patient diabétique. **Je pense « M. B. », l'outil pense
« nœud ».** Concrètement :

- **P1 et P5 m'ont obligé à ouvrir deux écrans** pour une seule consultation, en re-saisissant.
- **P3 aurait dû être passé deux fois** dans le même écran, avec deux intentions différentes
  (« optimiser » pour retirer le gliclazide, « intensifier » pour ajouter l'iSGLT2). L'outil l'explique
  bien, mais il découpe artificiellement un raisonnement qui, chez moi, est d'un seul tenant : *« je
  remplace un mauvais médicament par un bon »*.
- Le champ **« Intention thérapeutique »** est le pivot de tout le nœud « Traiter » et il est
  ambigu à la première rencontre : « Initier un traitement » signifie « initier le traitement du
  diabète » (le patient est naïf), pas « initier un nouveau médicament » — ce que j'avais compris.
  Choisir « Initier » **fait disparaître la liste des traitements en cours**, ce qui est logique une
  fois qu'on a compris, mais déroutant avant.

**Ce qui est réussi dans le découpage** : la structure des sections du nœud « Traiter » (Intention /
Traitement actuel / Ce qui oriente le choix / Signaux d'alerte / Terrain) suit assez bien mon
raisonnement, et le bouton **« Rien à signaler »** par section est une très bonne idée — il économise
6-8 clics à chaque patient.

### 4.3 Rapport temps investi / valeur reçue

- **Gagnants nets** : **P4** (90 secondes pour un seuil de metformine que je serais allé chercher dans
  le Vidal — le meilleur ratio de la série), **P2** (2e ligne argumentée + nuance sur les injections),
  **P8** (le seuil rénal de l'iSGLT2 débloque une décision que je repoussais).
- **Gagnants une seule fois** : **P1** et **P3**. L'outil m'apprend un argument (« metformine : preuve
  faible », « athérome pur → GLP-1 ») que je retiens ensuite définitivement. La valeur est réelle mais
  **elle ne se répète pas** — ce qui est un vrai enjeu : un outil qu'on ouvre une fois par argument
  n'entre pas dans une routine.
- **Coût net** : **P6** (2 min 15 pour apprendre que la question est hors périmètre) et **P7** (3 min 30
  pour une impasse). Ce sont, ironiquement, **les deux patients pour lesquels j'avais le plus besoin
  d'aide** — les deux où mon incertitude était la plus forte.

**Le constat qui me gêne le plus** : la valeur de l'outil est **inversement proportionnelle à ma
difficulté**. Il est excellent sur les cas où je suis déjà à peu près sûr, et muet ou dangereux sur
ceux où je ne le suis pas.

### 4.4 Les cas où l'outil m'aurait fait faire une erreur

Par ordre de gravité :

1. **P7 — l'outil raisonne sur une donnée fabriquée sans le signaler.** Pour sortir de l'impasse sans
   capteur, j'ai coché un profil AGP au hasard. Il a alors affiché « Profil nocturne à la cible » et
   proposé d'ajouter un bolus (`Recommandée`) à un chauffeur poids lourd, tout en affichant dans la
   même phrase « Glycémie à jeun à la cible : non ». **Rien n'alerte sur l'incohérence, ni sur le fait
   qu'un profil AGP a été déclaré alors que le capteur est déclaré absent.**
2. **P3 — des cases décochées silencieusement.** « Traitements en cours » (metformine, sulfamide) s'est
   vidé sans avertissement en cours de saisie. La recommandation affichée entre-temps portait sur un
   patient sans traitement. **Sur le champ le plus décisif de l'écran.**
3. **Contamination entre patients.** « Nouveau patient » **ne réinitialise rien** — je l'ai cliqué deux
   fois, la valeur du patient précédent est restée. Et l'HbA1c 7,4 % de M. B. m'a suivi jusque dans le
   nœud suivant, étiquetée d'un discret « *repris de votre saisie* » en gris clair. En consultation
   d'affilée, **c'est le mécanisme par lequel on décide pour un patient avec la biologie d'un autre.**
4. **P1 — un chiffre indéfini qui inverse la conduite.** « Autres facteurs de risque cardiovasculaire »,
   nombre libre sans règle de comptage : 0 → « discuter », 2 → « statine recommandée ».
5. **P5 — une addition proposée sous une intention de déprescription**, badgée `Recommandée`
   `Preuve élevée`, sans le garde-fou de dénutrition qui existe pour la classe voisine
   (**→ question clinique**).
6. **P8 — une HbA1c non interprétable prise pour argent comptant**, sans un mot.
7. **P8 — mauvais champ rempli sans retour.** La mise en page glisse selon les cases cochées ; j'ai
   saisi l'HbA1c dans « cible » au lieu de « actuelle », et le champ « cible » étant « sans effet »,
   **rien ne l'a signalé.**

### 4.5 Ce qui m'a été utile — et il faut le dire aussi nettement

- **Le badge « niveau de preuve » sur chaque option**, et surtout le fait qu'il **contredise parfois le
  badge « Recommandée »** (« Recommandation officielle (France) » + « Preuve faible » sur la metformine).
  Je n'ai jamais vu ça ailleurs. C'est la vraie valeur ajoutée du produit.
- **Les NNT, les HR et le délai du bénéfice**, dans le pli « Effet attendu ». « NNT ~19-31 sur
  16-26 mois », « délai du bénéfice : 2 ans (sémaglutide) à 5,4 ans (dulaglutide) » : c'est ce que je
  n'ai jamais en tête et que je peux redire au patient tel quel.
- **Le bloc « OPTIONS ÉQUIVALENTES : L'OUTIL NE LES DÉPARTAGE PAS, LE CHOIX REVIENT AU PRATICIEN. »**
  Un outil qui avoue où s'arrête la preuve, au lieu de trancher pour faire joli.
- **Les alertes contextuelles** — les meilleures pièces du produit. « Metformine : dose maximale
  1 000 mg/j, initiation ≤ 500 mg si DFG 30-44 » (P4), « Sans MCG : titrer la basale sur la glycémie
  à jeun (cible ~0,70-1,20 g/L) » (P7), « Refus des injections : privilégier une alternative
  ORALE… le refus ne doit pas priver d'un traitement à bénéfice démontré » (P2), « Ne JAMAIS retirer
  un iSGLT2 ni un AR GLP-1 pour désintensifier » (P5). **Ce sont elles qui portent la valeur clinique,
  bien plus que les cartes d'options.**
- **Les exclusions explicitées** : « Metformine écarté : DFG < 30 », « AR GLP-1 écarté : IMC < 22 et
  dénutrition ». Voir ce qui a été retiré et pourquoi vaut mieux que de ne pas le voir.
- **Les aides au calcul de dose** du nœud insuline (« Bolus initial ≈ 4 U », « Basale après +2 U
  ≈ 44 U/j »). **C'est le seul endroit où l'outil descend au niveau de la prescription.** C'est ce que
  j'attends partout.
- **Le bouton « Rien à signaler »** par section : gain de temps réel.
- **La déclaration du hors-périmètre en tête d'écran** (P6) : m'a fait gagner 20 minutes en 15 secondes.

---

## 5. Les cinq choses à changer en priorité

### 1. Réparer l'isolation entre deux patients — « Nouveau patient » doit tout effacer

**Constat.** Le bouton ne réinitialise rien (testé deux fois). Les valeurs migrent d'un nœud à l'autre
sous la mention discrète « *repris de votre saisie* ». Et les cases « Traitements en cours » se sont
décochées seules en cours de saisie (P3).
**Conséquence en consultation.** Je vois 25 patients d'affilée. **Je prendrai une décision pour l'un
avec le DFG, l'HbA1c ou la liste de traitements d'un autre**, sans le voir. C'est le seul défaut de
cette passe qui peut nuire directement à un patient, et il n'a rien à voir avec le contenu clinique.
**Attendu.** « Nouveau patient » vide tout et le confirme visuellement ; aucun champ ne se vide sans
que je l'aie fait ; le report inter-nœuds est signalé de façon impossible à manquer, ou supprimé.

### 2. Rendre le nœud insuline utilisable sans capteur de glucose

**Constat.** Écran ouvert sur « 19 critères décisifs non confirmés ». Avec « MCG disponible » décoché,
l'outil réclame toujours TBR, TBR sévère, coefficient de variation **et** « Profil glycémique (lecture
AGP) ». Les quatre options restantes en dépendent toutes → **décision suspendue, impasse totale**.
**Conséquence en consultation.** Le nœud qui annonce « aide à la prescription en médecine générale »
est inutilisable pour la majorité de mes DT2 sous insuline. Pire : pour en sortir, j'ai coché un
profil AGP au hasard, et l'outil m'a répondu **avec des doses** sur cette base, en affichant « Profil
nocturne à la cible » à côté de « Glycémie à jeun à la cible : non ».
**Attendu.** Quand « MCG disponible » est décoché, les champs de capteur disparaissent (comme le champ
CK disparaît quand l'intolérance est « Non ») et une voie « glycémie capillaire » prend le relais. Et
si un profil AGP est saisi sans capteur, l'écran le dit.

### 3. Descendre au niveau de la prescription : molécule, dose, titration, surveillance

**Constat.** Hors nœud insuline, l'outil s'arrête à la classe. « Introduire un iSGLT2 » sans molécule
ni dose. « Réduire la posologie du sulfamide » sans dire de combien ni en combien de temps. Aucun plan
de surveillance (créatinine de contrôle, « dip » initial), aucune formulation à donner au patient — y
compris pour les **règles de jour de maladie**, dont le contenu existe mais est noyé dans une ligne de
contre-indication (P4).
**Conséquence en consultation.** Après avoir consulté l'outil, **je dois encore ouvrir le Vidal**. Un
outil d'aide à la décision qui ne réduit pas le nombre d'onglets ouverts ne s'installe pas dans une
routine. Et chez Mme E. (74 ans, DFG 34, gastro récente avec metformine poursuivie), l'absence de
consigne d'arrêt mise en avant est un manque directement clinique.
**Attendu.** Sur chaque carte : molécule(s) et dose de départ, palier de titration, et un encadré
« à surveiller / à dire au patient » copiable.

### 4. Supprimer le jargon de projet des écrans cliniques, et rendre lisible le « pourquoi pas »

**Constat.** Les textes de périmètre citent « décision référent 2026-07-27 », « le red-team a demandé
de ne pas l'encoder de seconde main », « cf. changelog », « nœud E », « ce tier n'a pas d'exclusion
structurelle ». Le panneau « Pourquoi pas d'autres options ? » est un dump de règles
(« Intention thérapeutique ≠ Initier un traitement et Traitements en cours comprend Metformine »), et
un « proposé parce que » peut enchaîner **8 conditions reliées par « et »** (P5). Le champ « Autres
facteurs de risque cardiovasculaire » est un nombre sans définition qui **inverse la conduite** (P1).
En parallèle, la page « Méthode » indique que seuls 2 des 5 algorithmes sont validés, sans que les
écrans de décision ne le disent.
**Conséquence en consultation.** Je perds confiance avant d'avoir saisi un chiffre ; je ne lis pas les
explications ; et je saisis un chiffre déterminant au hasard. Surtout, **je crois utiliser cinq
algorithmes validés alors que trois sont « en cours »**.
**Attendu.** Périmètre en 2 phrases de médecin ; « pourquoi pas » reformulé en clinique ; définition
(ou liste à cocher) des facteurs de risque CV ; et un statut « validé / en cours » visible sur chaque
écran d'algorithme.

### 5. Recevoir le patient, pas seulement sa biologie

**Constat.** Aucun champ pour : chutes, troubles cognitifs, isolement, polymédication, profession,
demande explicite du patient, refus d'un traitement supplémentaire, contexte social. Aucun pour :
cirrhose, anémie, kaliémie, cancer, épisode aigu récent. « Fragilité » est une case unique qui doit
tout porter. Et l'outil **ne questionne jamais la fiabilité de l'HbA1c** qu'on lui donne (P8 : 7,9 %
chez une cirrhotique anémique, prise pour argent comptant).
**Conséquence en consultation.** Sur mes deux patients les plus difficiles (P5, P8), l'outil raisonne
sur une caricature de mon patient et me répond avec assurance. Et là où je me serais contenté d'un
« je ne sais pas », il me donne un `Recommandée` `Preuve élevée`.
**Attendu, par ordre de rentabilité** : (a) un signalement quand l'HbA1c est probablement non
interprétable (anémie, hépatopathie, transfusion) ; (b) éclater « Fragilité » en 3-4 items gériatriques
concrets (chutes, cognition, isolement, nombre de lignes de traitement) ; (c) un champ « refus /
charge thérapeutique » distinct de la préférence pour l'injectable ; (d) à défaut de champs, une
mention explicite « cet outil ne prend pas en compte : … » — parce que **dire ce qu'on ne sait pas est
la chose que ce produit fait déjà le mieux ailleurs** (P6), et qu'il faut l'étendre.

---

## Réponse franche : ouvrirais-je cet outil en consultation ?

**Oui, mais pour un type de patient précis et pour un type de question précis.**

**Je l'ouvrirais** pour le patient **de complexité moyenne, chez qui la question est « quelle classe,
sur quel argument »** : la 2e ligne sous metformine seule (P2), l'ajustement rénal (P4), le seuil
d'un iSGLT2 en insuffisance rénale sévère (P8). Sur ces trois-là, l'outil m'a apporté en 90 secondes
ce que j'aurais mis 10 minutes à retrouver, avec en prime un niveau de preuve et un NNT que je n'aurais
pas cherchés. Et l'honnêteté du produit — « preuve faible » sur la metformine, « l'outil ne les
départage pas », « hors périmètre » — est réelle et rare.

**Je ne l'ouvrirais pas** pour le patient simple (je connais la réponse), ni pour le patient
franchement complexe (il ne sait pas recevoir ce qui fait sa complexité), ni pour le patient dont la
demande porte sur le poids (hors périmètre assumé), ni pour le patient sous insuline sans capteur
(impasse).

**Ce qui m'empêcherait de l'ouvrir en vrai, aujourd'hui**, ce n'est aucune de ces limites de contenu :
c'est **l'isolation entre deux patients**. Tant que « Nouveau patient » n'efface rien et que des cases
se décochent toutes seules, je ne peux pas l'utiliser en série. C'est la priorité n° 1, et c'est
purement technique.
