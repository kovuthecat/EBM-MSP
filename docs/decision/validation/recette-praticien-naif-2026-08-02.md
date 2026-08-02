# Recette « praticien naïf » — passe du 2026-08-02 (serveur de dev local)

> Fichier témoin (non modifié, écrit à l'aveugle le 2026-07-30) :
> [`vignettes-praticien-naif-2026-07-30.md`](vignettes-praticien-naif-2026-07-30.md).
> Passe précédente comparée : [`recette-praticien-naif-2026-07-30.md`](recette-praticien-naif-2026-07-30.md).

| | |
| --- | --- |
| **URL** | `http://localhost:5174` (dev Vite ; le port 5173 de `.claude/launch.json` était occupé, autoPort a assigné **5174**) |
| **Commit** | `e7eec71` — *docs: deux défauts connus corrigés, sortis de STATUS et du backlog* (2026-08-02 11:39 +0200), branche `fix-defauts-avant-recette`, **arbre propre** (vérifié `git status` avant le premier clic) |
| **Heure de début** | 2026-08-02, 12h05 |
| **Auteur** | médecin généraliste, cabinet de groupe urbain, ~25 patients/jour, 15 min/consultation, pas de diabétologue à moins de 4 mois |
| **État des plans** | **P10 livré** (contenu enrichi : cadrages « ce que ce nœud ne prend pas en compte », molécules/doses, options écartées en énumération). **P11 livré** (icônes SVG, tons sémantiques, carte compacte à pastilles, largeur 1600 px). **P7/SA2 (validité HbA1c) toujours non livrée.** |

**Convention de comptage.** Une « action » = un clic OU un champ saisi. Le geste « Nouveau patient »
entre deux patients n'est pas compté (comme le F5 de la passe précédente ne l'était pas). Les clics de
navigation entre écrans **sont** comptés, ainsi que le clic « Reprendre les valeurs de ce patient » du
nouveau garde-fou de ré-entrée. Les actions purement exploratoires (ouvrir une pastille, « Pourquoi pas
d'autres options ? », déplier l'argumentaire) sont comptées à part.

**Note de méthode, à lire avant les chiffres.** Trois limites d'outillage, honnêtement séparées de ce
que fait le produit :

1. Les **captures d'écran ont échoué** pendant la première moitié de la passe (« Browser pane is not
   displayed »), puis ont fonctionné en fin de passe — les deux captures de contrôle (1000 px et
   1700 px) ont bien été prises et sont décrites plus bas.
2. Après plusieurs redimensionnements de la fenêtre, **les clics de synthèse du navigateur d'audit se
   sont désynchronisés** des coordonnées réelles (le piège n° 1 du cadrage). J'ai basculé, à partir de
   la vignette N4, sur des clics programmatiques (`element.click()`) pour piloter le formulaire. Cela
   **ne change ni les comptages** (je compte les gestes qu'un praticien ferait) **ni les mesures**
   (géométrie, couleurs, textes lus dans le DOM rendu). J'ai vérifié deux fois qu'un comportement qui
   me paraissait cassé (« Rien à signaler » sans effet) était en réalité un artefact de mon outillage :
   **il n'est donc PAS reporté comme défaut.**
3. Les mesures de largeur marquées « *à chaud* » ont été prises après redimensionnement sans
   remontage ; celles marquées « **navigation fraîche** » ont été prises après un rechargement complet
   à la largeur voulue, comme demandé.

---

# ⚠ À LIRE D'ABORD — deux constats qui ne doivent pas être noyés dans le déroulé

## 1. ⚠⚠ La carte d'option **ne tient pas sur une ligne** — et pas seulement dans la zone tendue

**C'est le point que le cadrage signale comme jamais vérifié par personne. Il est vérifié, et il est
mauvais.**

Mesure faite **par navigation fraîche à 1000 px**, nœud `prescription`, cinq options (M. Kervarec, N4) :
la colonne des recommandations fait 453 px, et l'intitulé de chaque carte est comprimé dans une boîte
de **75 à 160 px de large**, où il s'enroule sur **2,5 à 5,8 lignes**. Les cartes mesurent 91 à 151 px
de haut au lieu d'une ligne.

| Viewport | Colonne résultats | Lignes de l'intitulé (min → max) | Méthode |
| --- | --- | --- | --- |
| 966 px | 436 px | **2,5 → 6,6** | à chaud |
| **1000 px** | **453 px** | **2,5 → 5,8** | **navigation fraîche** |
| 1100 px | 503 px | 2,0 → 4,0 | à chaud |
| 1280 px | 593 px | 1,6 → 2,0 | à chaud |
| 1400 px | 653 px | 2,0 | à chaud |
| **1700 px** (nœud plafonné à 1600) | **760 px** | **1,0** (2,0 pour deux cartes sur cinq) | **navigation fraîche** |

Cas extrême mesuré à 966 px : « **Introduire un AR GLP‑1 (liraglutide, sémaglutide, dulaglutide)** »
reçoit une boîte de titre de **24 px de large** — soit une colonne verticale de deux ou trois caractères
par ligne sur six lignes.

**Cause visible.** La rangée porte, sur une seule ligne flex : le chip de verbe (« Ajouter »),
l'intitulé, le badge de preuve (« Preuve modérée », 88 px), puis **quatre déclencheurs de 32 px**
(trois pastilles + le chevron), soit ~240 px incompressibles. L'intitulé est le seul élément flexible :
c'est lui qui absorbe tout le manque de place, jusqu'à disparaître en colonne de syllabes.

**Capture de contrôle à 1000 px** (prise en fin de passe) : les cinq cartes du nœud `prescription`
s'affichent avec un intitulé sur 4 à 5 lignes étroites à gauche, pendant que le badge de preuve et les
quatre pastilles conservent leur pleine largeur à droite. **Ce n'est pas un détail de rendu : c'est le
principe même de la carte « une ligne » qui ne tient qu'au-dessus de ~1500 px.**

**Ce que ça coûte au praticien.** Un ordinateur de cabinet en 1366×768 ou une fenêtre non maximisée sur
un 1080p tombent exactement dans la plage où c'est le pire. Sur ces écrans, la refonte « carte
compacte » produit une carte **plus haute** et **moins lisible** que la carte haute qu'elle remplace.

## 2. ⚠⚠ La cible d'HbA1c change toute seule quand on revient sur le nœud, pour le même patient

**Reproduction exacte (mesurée sur M. Kervarec, N4) :**

1. Nœud « Fixer la cible » : Âge 67, Ancienneté 13, **☑ Antécédent cardiovasculaire**, Fragilité non.
   → espérance de vie calculée « **Intermédiaire** », réponse « **Cible ≤ 8 %** » `Recommandée`.
2. « Domaine » → « Traiter » → « Reprendre les valeurs de ce patient » → je remplis le nœud
   « Traiter » (parcours normal de la consultation à trois écrans).
3. « Domaine » → « Fixer la cible » → « Reprendre les valeurs de ce patient ».
4. **Résultat : « Antécédent cardiovasculaire » est revenu décoché**, l'espérance de vie est
   recalculée « **Longue** », et l'écran affiche « **Cible ≤ 7 %** » badgée `Recommandée`.

**Pourquoi.** « Antécédent cardiovasculaire » (nœud cible) et « Maladie cardiovasculaire athéromateuse
établie » (nœud Traiter) sont **deux critères distincts pour un seul fait clinique** — le défaut n° 5
de la passe du 30/07, inchangé. Seul le second circule entre les nœuds. En revenant sur le nœud cible,
le critère qui portait la réponse a disparu, et la suggestion automatique d'espérance de vie — qui
**dépend** de l'antécédent CV — s'est recalculée sur un dossier amputé.

**Conséquence clinique.** Chez un coronarien pontagé, la cible passe de ≤ 8 % à ≤ 7 % **entre deux
moments de la même consultation**, sans un mot, avec le même badge `Recommandée`. Rien à l'écran ne
signale que la réponse a changé. Le seul indice est la mention « · calculé, à vérifier » sur un champ
que je viens précisément de valider dix minutes plus tôt.

Vérifié en négatif : re-cocher « Antécédent cardiovasculaire » ramène immédiatement « Intermédiaire »
et « Cible ≤ 8 % ». Le mécanisme est donc bien celui-là.

---

# N1 — Le diabète tout neuf, sans rien autour (M. Ferreira, 46 ans)

### Rappel du témoin

**Ma question.** Metformine tout de suite, ou trois mois de RHD seules ? Et si metformine : quelle
dose, quelle titration ?
**Réponse attendue.** Metformine d'emblée **avec** les RHD, titration progressive, pas de statine, et
une phrase disant que les RHD ne sont pas une alternative.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1 (« Traiter »).
- **Actions jusqu'à une réponse définitive** : **11** — Traiter · Initier · Suivant · HbA1c 7.3 ·
  Au-dessus · Suivant · DFG 96 · Normoalbuminurie · IMC 28.4 · Suivant · **Rien à signaler**.
- **Actions exploratoires** : 3 (pastille « Posologie », « Pourquoi pas d'autres options ? »,
  « Déplier l'argumentaire »).
- **Temps** : ~2 min.

**Gain immédiat n° 1 — l'écran d'accueil du domaine a perdu un clic.** « Aide à la décision » ouvre
directement le domaine DT2 avec ses cinq nœuds listés. Un clic économisé sur **chaque** patient.

**Gain immédiat n° 2 — le cartouche « EN ATTENTE » n'est plus vide.** À l'ouverture, il dit :
« **Commencez par : Traitements en cours, Intention thérapeutique, DFG. Ce sont les critères qui
débloquent le plus d'options ; 11 autres restent à renseigner ensuite.** » Le défaut n° 8 de la passe
précédente (encadré coloré vide, lu comme un bug) est **corrigé, et bien** : il ne se contente pas de
nommer ce qui manque, il me dit par quoi commencer.

**Champs encore absents** : poids/taille (je saisis un IMC que je calcule de tête), âge sur ce nœud,
TA, LDL, tabac, horaires postés. Inchangé.

### Réponse obtenue, verbatim

Socle visible de la carte — **c'est tout ce que je vois sans cliquer** :

> **Socle du traitement — gestes cumulables**
> `Recommandation officielle (France)` **Metformine (socle du traitement) — instaurer ou poursuivre**
> `Preuve faible`  ⓘ 💊 ⚠ ⌄

Derrière la pastille 💊 « **Posologie** » (1 clic, ou un simple survol à la souris) :

> **instauration : paliers de 15 j jusqu'à dose cible (ex. 2 g/j en 1 mois), 2-3 prises au repas**

**C'est la réponse exacte à la moitié de ma question qui manquait le 30/07.** La carte metformine
donnait « instaurer ou poursuivre » et rien d'autre ; elle donne maintenant un schéma de titration
chiffré.

Derrière « Pourquoi pas d'autres options ? », en français lisible cette fois :

> Aucun traitement médicamenteux — mesures hygiéno‑diététiques seules, réévaluer — **ne s'applique
> pas : il faudrait HbA1c à la cible**

### Test des 20 secondes

> « Metformine, je monte par paliers de 15 jours jusqu'à 2 g par jour, 2 à 3 prises aux repas. Pas si
> le DFG est sous 30, à suspendre si déshydratation ou scanner iodé. Preuve faible. »

**Écart** : j'ai cette fois retenu **la dose et la titration** — c'était l'échec principal du 30/07.
Je n'ai toujours rien retenu sur les RHD (l'écran n'en parle pas) ni sur la statine.

### L'écart

**Ce qui s'est amélioré.** La posologie est là. La logique brute (« → nœud E », « DFG > 0 et DFG < 30 »,
« Palette glycémique ouverte ») a **disparu** du panneau des options écartées, remplacée par des
phrases du type « ne s'applique pas : il faudrait Metformine déjà en cours » ou « ni insuffisance
cardiaque, ni DFG < 60, ni albuminurie ≠ Normoalbuminurie ». Les noms de variables internes sont
devenus des libellés cliniques (« Aucune classe protectrice disponible (iSGLT2, AR GLP‑1) »,
« Contrôle glycémique à renforcer »).

**Ce qui reste.**
1. Ma question « RHD seules 3 mois ? » **n'a toujours pas de réponse sur l'écran principal** — elle est
   lisible, mais seulement après avoir ouvert « Pourquoi pas d'autres options ? » et cherché la
   28ᵉ ligne.
2. **Aucun lien vers le module RHD**, qui existe pourtant à deux clics.
3. Une consigne au rédacteur reste affichée dans les inconvénients de la carte metformine :
   « Bénéfice propre sur critère dur de preuve faible (**ne pas afficher « bénéfice CV prouvé »**) ».
   Elle a seulement changé de cachette : elle est maintenant derrière le chevron « Argumentaire
   complet ».
4. L'argumentaire du nœud contient encore les notes de travail du projet :
   « **6ᵉ série, collecte + red-team adversarial** », « **ÉTAT DES TROIS RÉSIDUELS au 2026-07-27** »,
   « l'attribution KDIGO était fausse et **a été retirée du nœud** ». En revanche « **→ nœud E** » et
   « **VÉRIFIÉ par le référent** » ont disparu.

**Défaut de rendu constaté ici (mineur, mais visible).** Cliquer une pastille ouvre **deux fois** le
même texte : l'info-bulle de survol (fond sombre, `pastille-info__bulle`) reste affichée par le focus
**par-dessus** le panneau dépliant qui affiche le même contenu juste en dessous. Mesuré : bulle de
y 477 à 529, panneau à y 504 — ils se chevauchent sur 25 px.

### En vraie consultation ?

**Oui, et cette fois plus d'une fois** — parce qu'il me donne maintenant quelque chose que je n'ai pas
en tête (le rythme de titration). C'est le changement de statut le plus net de cette passe sur le
patient banal.

---

# N2 — La cible, et rien que la cible (Mme Lantier, 59 ans)

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1.
- **Actions** : **5** — Domaine · Fixer la cible · Âge 59 · Ancienneté 7 · **Rien à signaler**.
  (6 le 30/07 : le clic « Longue » n'est plus nécessaire.)
- **Actions exploratoires** : 2.
- **Temps** : ~35 secondes. **Reste le nœud le plus rapide de la passe.**

**Correctif vérifié — la suggestion automatique d'espérance de vie fonctionne.** Après « Rien à
signaler », le champ passe à « **Espérance de vie · calculé, à vérifier** » avec « Longue »
sélectionné, et la recommandation s'affiche. Le 30/07, le libellé « Suggestion auto… » promettait sans
rien produire. **Défaut corrigé.**

**Deuxième correctif — les définitions sont dans les libellés.** Les trois boutons portent maintenant
leur définition (« Espérance de vie estimée supérieure à 15 ans (HAS) — avec un diagnostic récent et
l'absence de… », « … inférieure à 5 ans — un facteur d'assouplissement de la cible jusqu'à 8-9 % »),
doublées d'une pastille « Valeurs de Espérance de vie ». **C'était la seule réserve que j'avais posée
sur ce nœud le 30/07 : elle est levée.**

**Troisième correctif — « Âge » et « Ancienneté » ne sont plus étiquetés « sans effet ».** À vide, ils
n'affichent plus rien. Le défaut n° 3 de la passe précédente (« les champs annoncés sans effet sont
ceux qui décident ») **n'est plus reproductible sur ce nœud.**

**Quatrième correctif — le nœud dit ce qu'il ne fait pas.** Un bloc « Ce que dit la preuve pour ce
nœud » (replié par défaut) contient, verbatim :

> Ce nœud fixe la cible d'HbA1c à viser ; **il ne confronte jamais cette cible à l'HbA1c réelle du
> patient** (l'écart à l'objectif, le constat d'échec ou de réussite du traitement en cours) — cette
> lecture relève du nœud « Traiter ». **Il ne dit rien non plus du délai auquel réévaluer la cible
> fixée.**

C'est **exactement** les deux manques que j'avais listés le 30/07. Ils ne sont pas comblés, ils sont
**déclarés**. Pour un praticien, c'est presque aussi utile : je sais où ne pas chercher.

### Réponse obtenue, verbatim

> **OPTIONS APPLICABLES · 1 option**
> `Recommandée` **Cible ≤ 7 %** `Preuve faible`  ⓘ ⌄

Derrière la pastille « Proposé parce que » :

> **ni fragilité, ni comorbidité grave, ni antécédent cardiovasculaire, ni espérance de vie limitée :
> situation intermédiaire, en dehors des critères qui feraient basculer vers une cible plus prudente
> (< 9 % ou ≤ 8 %) ou plus stricte (~6,5 %)**

**Le « Option par défaut : retenue en l'absence de toute autre option plus spécifique applicable » —
la phrase de moteur que je pointais le 30/07 — a disparu.** C'est maintenant une phrase que je peux
répéter à Mme Lantier.

### Test des 20 secondes

> « Cible 7 %. Preuve faible. Elle n'a ni fragilité, ni antécédent cardiaque, ni comorbidité grave,
> donc on est dans le cas intermédiaire. »

**Écart, et il compte** : je n'ai **rien** retenu de l'argument EBM que j'avais parfaitement retenu le
30/07 (« ça réduit l'infarctus non fatal mais pas la mortalité, le bénéfice absolu est modeste »).
**Pourquoi : cette phrase est passée derrière le chevron « Argumentaire complet ».** Le 30/07 elle
était visible sur la carte. C'est un **échange** : j'ai gagné le motif clinique, j'ai perdu l'argument
à donner au patient — qui était précisément ce que je venais chercher pour désamorcer le « moins de
6,5 % » du confrère.

### En vraie consultation ?

**Oui, sans hésiter, plusieurs fois par semaine.** 5 actions, 35 secondes. Mais je devrai ouvrir le
chevron à chaque fois pour retrouver l'argument, soit une action de plus que le 30/07.

---

# N3 — Pile sur la cible : est-ce que je touche à quelque chose ? (M. Abadie, 64 ans)

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : **2**.
- **Actions** : **25** (identique au 30/07).
  - « Fixer la cible » : **3** (Âge 64 · Ancienneté 11 · Rien à signaler) — 5 le 30/07.
  - Navigation + garde-fou : **3** (Domaine · Traiter · **Reprendre les valeurs de ce patient**).
  - « Traiter » : **19**.
- **Temps** : ~4 min 30.

**Le garde-fou de ré-entrée coûte une action et en vaut la peine — voir la section dédiée ci-dessous.**

**Correctif majeur vérifié — « Risque hypoglycémique du schéma » a enfin une définition.** Sous les
deux boutons :

> **Un jugement clinique, pas une simple case du dossier** : « Élevé » si le schéma en cours expose
> (sécrétagogue — sulfamide, glinide — ou insuline, dose élevée, prises irrégulières ou repas sautés),
> ou si le terrain exposerait un futur traitement même sans hypoglycémiant actuel (âge avancé,
> insuffisance rénale, fragilité, hypoglycémie sévère antérieure). « Faible » sinon.

**C'est le champ sur lequel je décrochais le plus franchement le 30/07.** La phrase répond exactement à
la question que je me posais, et le « pas une simple case du dossier » désamorce le malaise : on
m'annonce que c'est mon jugement qu'on demande. **Le meilleur correctif de contenu de cette passe.**

**Nouveauté utile — la mention « · détermine la suite ».** Le champ « Intolérance à un traitement en
cours » porte « · détermine la suite · à confirmer ». C'est le pendant positif de « sans effet sur la
reco actuelle » : l'outil me dit non seulement quoi ne pas remplir, mais **quoi remplir en priorité**.

**Champ toujours absent** : le type de sulfamide (gliclazide vs glimépiride vs glibenclamide).

### Réponse obtenue, verbatim

> **OPTIONS APPLICABLES · 5 options**  ● Ajouter ● Remplacer ● Réduire
>
> **Socle du traitement — gestes cumulables**
> `Recommandation officielle (France)` **Metformine — instaurer ou poursuivre** `Preuve faible`
>
> **Traitement à corriger ou remplacer — gestes cumulables**
> `Recommandée` **Remplacer** · **Remplacer le sulfamide (moins d'hypoglycémie, moins de poids, plus
> de bénéfice)** `Preuve modérée`
>
> **Agent à ajouter — en choisir un**
> *OPTIONS ÉQUIVALENTES SUR LES DONNÉES DISPONIBLES : L'OUTIL NE LES DÉPARTAGE PAS, LE CHOIX REVIENT
> AU PRATICIEN.*
> `Recommandée` **Ajouter** · **Introduire un iSGLT2** `Preuve élevée`
> `Recommandée` **Ajouter** · **Introduire un AR GLP‑1** `Preuve modérée`
>
> **Traitement à alléger — gestes cumulables**
> `Recommandée` **Désintensifier : alléger la charge thérapeutique globale (relâcher la cible)**
> `Preuve faible`
>
> **Autres pistes possibles (1)**

**Deux progrès de mise en ordre.**
1. Le doublon du 30/07 (« Désintensifier » **et** « Réduire la posologie du sulfamide » côte à côte,
   mêmes badges) **n'existe plus** : « Réduire la posologie du sulfamide » est descendue dans un
   repli « **Autres pistes possibles (1)** ». Une hiérarchie a remplacé une redondance.
2. Chaque carte porte un **chip de verbe** (Ajouter / Remplacer / Réduire) et la colonne s'ouvre par
   une **légende** de ces trois verbes. Sur cet écran, où trois verbes coexistent, la légende sert.

### Posologies obtenues (pastille « Posologie », 1 clic chacune)

> **iSGLT2** : dapagliflozine 10 mg/j (fixe) ; empagliflozine 10→25 mg/j ; canagliflozine 100→300 mg/j
> (DFG ≥ 60)
> **AR GLP‑1** : liraglutide 0,6→1,8 mg/j ; sémaglutide 0,25→1 mg/sem (FR) ; dulaglutide
> 0,75/1,5→4,5 mg/sem

**C'est la réponse exacte au « quelle gliflozine, à quelle dose » que je réclamais le 30/07** et que le
bilan de cette passe déclarait « toujours absent ». **Livré.**

### Test des 20 secondes

> « Je garde la metformine. Je remplace le gliclazide. À la place, gliflozine (preuve élevée) ou
> GLP‑1, au choix, l'outil ne tranche pas. Et je peux alléger globalement puisqu'il est à 7,0 % avec
> une hypo. Dapagliflozine 10, dose fixe. »

**Écart** : bon score, et il inclut cette fois **une molécule et une dose**. La bannière « L'OUTIL NE
LES DÉPARTAGE PAS » reste la phrase la mieux conçue du produit.

### L'écart

**Défauts persistants.**
1. **« Agent à ajouter — en choisir un » au-dessus de cartes dont le motif est un remplacement.** Le
   groupe « Traitement à corriger ou remplacer » existe désormais séparément, ce qui atténue
   l'ambiguïté, mais le titre « ajouter » subsiste au-dessus d'options qui, chez ce patient, sont bien
   des remplaçants du sulfamide.
2. **Un « Proposé parce que » se lit encore comme une expression brute**, avec un « : non » final
   déroutant : « Sulfamide déjà en cours **et HbA1c < 6,5 % (sur-contrôle) : non** ». Les autres
   cartes de l'écran ont des motifs lisibles ; le contraste au sein d'un même écran subsiste, atténué.
3. Toujours rien sur la **séquence** (j'arrête le gliclazide avant ou après ?) ni sur la surveillance
   à J15.

### En vraie consultation ?

**Oui, et la frontière a bougé.** 25 actions restent hors budget d'une consultation de 15 minutes,
mais je ne décroche plus au champ « Risque hypoglycémique » — je sais quoi répondre.

---

# Intermède — le garde-fou de ré-entrée et « Nouveau patient » (défaut n° 1 du 30/07)

**Le défaut le plus grave de la passe précédente est corrigé, et je l'ai reproduit dans les deux
sens.**

**Ce qui se passe maintenant.** Sortir d'un nœud et le rouvrir (ou ouvrir un second nœud alimenté par
la session) affiche, **à la place de toute recommandation** :

> **CE NŒUD A DÉJÀ ÉTÉ OUVERT DANS CETTE CONSULTATION**
> Les critères déjà renseignés proviennent de votre saisie sur un autre écran de cette consultation
> (« repris de votre saisie », dans le formulaire) ; rien n'a encore été saisi ici. **Avant d'afficher
> une recommandation, confirmez qu'il s'agit bien du même patient.**
> [ Reprendre les valeurs de ce patient ]  [ Repartir de zéro ]

**Aucune carte n'est calculée tant qu'on n'a pas tranché.** C'est exactement le verrou qui manquait :
le 30/07, l'écran affichait la recommandation du patient précédent, badgée `Recommandée`, sans un mot.

**Deux réserves d'usage, pas des défauts :**
- Le **titre est faux dans le cas le plus fréquent**. Quand j'enchaîne « Fixer la cible » puis
  « Traiter », le nœud « Traiter » n'a **jamais** été ouvert — et le bandeau annonce « CE NŒUD A DÉJÀ
  ÉTÉ OUVERT DANS CETTE CONSULTATION ». Le corps du message dit juste (« proviennent de votre saisie
  sur un autre écran »), mais le titre en capitales est lu en premier et il est contredit par le
  paragraphe qu'il coiffe.
- Il coûte **une action par transition entre nœuds**, soit +2 sur la consultation à trois écrans (N4).
  Le prix est acceptable ; il vaut la peine d'être su.

**« Nouveau patient » : câblé, confirmé en deux temps, et vérifié.**
Le `window.confirm()` natif a disparu — c'était l'aggravant du 30/07 (« le navigateur peut le
désactiver en silence »). Le bouton passe maintenant par un état intermédiaire **dans le bouton
lui-même** : « Confirmer : Vider la session en cours et repartir avec un nouveau patient ? Les valeurs
saisies non enregistrées seront perdues. » + un bouton « Annuler, garder la session en cours ». Après
confirmation, le bouton affiche brièvement « **Session vidée** » et **le formulaire est réellement
vide** (vérifié : plus aucune valeur, plus de bandeau de ré-entrée).

**Le point de recette resté ouvert le 30/07 (« comportement de remise à zéro NON REPRODUIT ») est donc
clos : la purge fonctionne.**

**Une remarque d'usage sur cette confirmation.** La fenêtre de confirmation dure **2,6 secondes**
(constante `CONFIRMATION_DURATION_MS`) puis revient seule à « Nouveau patient ». C'est court pour lire
une phrase de 130 caractères et cliquer — mon outillage, plus lent que 2,6 s par aller-retour, n'y est
arrivé qu'en double-clic. Surtout : **une confirmation expirée et une purge réussie se ressemblent
2 secondes plus tard** (le bouton est revenu à « Nouveau patient » dans les deux cas). Un praticien
qui clique, regarde son patient, puis revient à l'écran ne peut pas savoir s'il a vidé ou non. Le
compteur « **Session : N valeurs** » affiché dans l'en-tête est le seul témoin fiable — il faudrait
peut-être qu'il soit le témoin *lu*.

---

# N4 — Coronarien pontagé : la consultation qui traverse TROIS écrans (M. Kervarec, 67 ans)

> Navigation fraîche à **1000 px** — c'est aussi la vignette qui sert de banc de mesure à la carte
> compacte (cf. tête de rapport).

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : **3**.
- **Actions** : **35** (35 le 30/07).
  - « Fixer la cible » : **4** (Âge 67 · Ancienneté 13 · ☑ Antécédent cardiovasculaire · Rien à
    signaler) — 6 le 30/07.
  - Navigation + garde-fous : **7** (Fixer la cible · Domaine · Traiter · Reprendre · Domaine ·
    Statine · Reprendre).
  - « Traiter » : **17**.
  - « Prescrire une statine » : **7**.
- **Temps** : **~7 minutes.** Toujours impossible en consultation de 15 minutes.

**Le partage inter-nœuds s'est élargi.** Le nœud Statine s'ouvre avec **trois champs repris** (Âge,
Maladie cardiovasculaire athéromateuse établie, Ancienneté). Le nœud Traiter reprend Âge et Espérance
de vie. Le compteur d'en-tête « **Session : 2 valeurs** » rend ce partage visible, ce qui est nouveau
et rassurant.

**Correctif vérifié — « Autres facteurs de risque cardiovasculaire » est défini.** Sous le champ :

> Facteurs de risque cardiovasculaire additionnels à compter, au-delà du diabète lui-même :
> **hypertension artérielle, tabac, dyslipidémie, antécédent familial cardiovasculaire précoce.**

**Défaut signalé le 28/07 puis le 30/07 comme « INCHANGÉ » : corrigé.** Je sais maintenant quoi
compter.

**Resaisie qui subsiste.** Le nœud « Fixer la cible » demande « Antécédent cardiovasculaire » ; le nœud
« Traiter » redemande, à vide, « Maladie cardiovasculaire athéromateuse établie ». **Deux noms, un
fait, deux saisies** — et cette fois, la conséquence est chiffrable (cf. constat n° 2 en tête).

**Champ toujours absent, et il me manque vraiment** : la **statine actuelle** (molécule + dose). La
section s'appelle pourtant « **STATINE EN COURS** » — mais elle ne contient que l'intolérance et les
CK. Le titre promet ce qu'il ne demande pas.

### Réponse obtenue, verbatim

**Nœud « Fixer la cible »** : `Recommandée` **Cible ≤ 8 %** `Preuve faible` — espérance de vie
calculée « Intermédiaire ».

**Nœud « Traiter »** :

> **Socle** — Metformine `Recommandation officielle (France)` `Preuve faible`
> **Traitement à corriger ou remplacer** — **Remplacer** · **Remplacer la gliptine (aucun bénéfice sur
> critère dur — préférer un agent qui en apporte)** `Recommandée` `Preuve modérée`
> **Agent à ajouter — en choisir un**
> `Recommandée` **Ajouter** · **Introduire un iSGLT2** `Preuve élevée`
> **Ajouter** · **Introduire un AR GLP‑1** `Preuve modérée`
> **Ajouter** · **Sulfamide (gliclazide MR ou glimépiride) — option glycémique de bas rang, derrière
> la gliptine** `Preuve modérée`

Deux alertes contextuelles rendues **pendant** la saisie, toujours au bon moment :

> Metformine : dose maximale 2 000 mg/j si DFG 45‑59 (RCP ANSM) ; revoir au préalable les facteurs de
> risque d'acidose lactique.
> Non-association incrétine : si un AR GLP‑1 ou le tirzépatide est introduit, la gliptine doit être
> ARRÊTÉE — même voie incrétine, aucun bénéfice additif (Nauck 2017 ; ADA §9 ; KDIGO PP4.2.3 ; HAS
> R.80). **Ne jamais les associer.**

**Nœud « Prescrire une statine »** :

> `Recommandée` **Statine de haute intensité — prévention secondaire (maladie athéromateuse établie)**
> `Preuve élevée`  ⓘ 💊 ⚠ ⌄

Derrière la pastille 💊 « **Posologie** » :

> **atorvastatine 40-80 mg / rosuvastatine 10-20 mg**

**C'est le correctif d'ergonomie le plus précieux de cette passe.** Le 30/07, cette information —
**la réponse exacte à ma question (c)** — était enfouie derrière un lien intitulé « ⚠ 2
contre-indications, effet attendu et plus », et j'avais failli augmenter la rosuvastatine pour rien.
Elle est maintenant sous une pastille qui s'appelle « Posologie », c'est-à-dire sous le mot que je
cherche. Un survol suffit.

### Test des 20 secondes

> « Cible 8 %. Je vire la sitagliptine, je mets une gliflozine, preuve élevée. Et la statine : haute
> intensité = atorva 40-80 ou rosuva 10-20, **donc il y est déjà**, je ne touche à rien. »

**Écart, et c'est le renversement de la passe** : là où le 30/07 je me trompais de conduite, je conclus
juste du premier coup d'œil. Une pastille bien nommée a suffi.

### L'écart

**Ce qu'il ne dit toujours pas** : aucune séquence (j'arrête la gliptine avant, après, en même
temps ?), aucune modalité pratique d'introduction de l'iSGLT2 à DFG 58 (créatinine à J15 ? mycose ?
sick-day rules ?), aucune confrontation « statine actuelle vs statine recommandée » faute d'avoir
demandé la molécule.

**Incohérence persistante** : le **sulfamide** figure toujours dans le groupe « Agent à ajouter — en
choisir un » chez un coronarien, dans le même cadre visuel que l'iSGLT2 à preuve élevée. Le rang est
correct (il est dernier, sans badge `Recommandée`), le regroupement reste trompeur.

### En vraie consultation ?

**Le nœud statine : oui, immédiatement, et il est maintenant lisible en 10 secondes.** Les deux
autres : toujours du travail de préparation. Et — voir le constat n° 2 en tête — **je ne rouvrirais pas
le nœud cible en fin de consultation**, parce qu'il me rendrait une autre cible.

---

# N5 — Insuffisance rénale modérée : jusqu'où je garde la metformine (M. Traoré, 71 ans)

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1.
- **Actions** : **19** (18 le 30/07 ; +1 de navigation).
- **Temps** : ~3 min.

**Les mentions « · sans effet sur la reco actuelle » fonctionnent toujours** : sur la dernière section,
Âge, Espérance de vie et Risque hypoglycémique sont neutralisés — trois champs que je peux sauter.

**Champs voulus, toujours absents** : kaliémie, type de sulfamide, **pente d'évolution du DFG**
(31 aujourd'hui, 44 il y a 3 ans — ce n'est pas la même conduite qu'un 31 stable).

### Réponse obtenue, verbatim

Deux bandeaux au-dessus des cartes, dont le pavé de cadrage « Position déclarée AU-DESSUS … intention
d'OPTIMISATION » (8 lignes, inchangé) et :

> Metformine : **dose maximale 1 000 mg/j, initiation ≤ 500 mg si DFG 30‑44 (RCP ANSM).**

Puis :

> **À faire d'emblée — sécurité — gestes cumulables**
> `Mesure de sécurité` **Réduire** · **Réduire la posologie de la metformine (fonction rénale altérée
> ou intolérance digestive)** `Preuve faible`
> **Socle** — Metformine `Recommandation officielle (France)` `Preuve faible`
> **Traitement à corriger ou remplacer** — **Remplacer le sulfamide** `Recommandée` `Preuve modérée`
> **Agent à ajouter — en choisir un** — **Introduire un iSGLT2** `Preuve élevée` · **AR GLP‑1**
> `Preuve modérée`

### Le défaut que cette vignette révèle sur la refonte

**La carte « Réduire la posologie de la metformine » n'a AUCUNE pastille « Posologie ».** Elle porte
seulement « Proposé parce que » et le chevron. **La carte dont le titre est un changement de dose est
la seule à ne pas donner de dose.** Le chiffre (max 1 g/j) existe — dans le bandeau d'alerte au-dessus
et dans l'argumentaire — mais pas là où le geste est nommé.

C'est le point aveugle de la mécanique de pastille : elle n'apparaît que si le contenu porte un
`apercu` ou un calcul. Une carte « réduire » sans champ de posologie n'affiche **ni dose, ni pastille
ambre disant qu'une dose manque**. Elle est silencieuse.

### Test des 20 secondes

> « Je descends la metformine à 1 g/j parce que le DFG est entre 30 et 44. Je remplace le glimépiride.
> J'ajoute une gliflozine, preuve élevée. Suspendre si diarrhée, vomissements, iode. »

Bon score, inchangé — mais je l'ai retenu **du bandeau d'alerte**, pas de la carte.

### En vraie consultation ?

**Oui, sans hésiter.** C'est un des trois nœuds où l'outil me donne un seuil réglementaire que je n'ai
pas en tête.

---

# N6 — Insuffisance rénale sévère : là où les seuils se croisent (Mme Nowak, 79 ans)

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1. **Actions** : **18** (17 le 30/07). **Temps** : ~3 min.

### Réponse obtenue, verbatim

> **À faire d'emblée — sécurité** — `Mesure de sécurité` **Arrêter** · **Arrêter la metformine
> (DFG < 30 — contre‑indication rénale)** `Preuve faible`
> **Traitement à corriger ou remplacer** — **Remplacer la gliptine** `Recommandée` `Preuve modérée`
> **Agent à ajouter** — **Introduire un AR GLP‑1** `Recommandée` `Preuve modérée`
>
> *Fonction rénale très altérée (DFG < 15) : les AR GLP‑1 commercialisés en France restent utilisables
> à ce stade … mais ils y ont été PEU ÉTUDIÉS. **Le recul manque, pas l'autorisation** …*
>
> Metformine (socle) **écarté : DFG < 30**
> Introduire un iSGLT2 **écarté : DFG < 20**

Et l'alerte de nœud :

> Metformine CONTRE‑INDIQUÉE si DFG < 30 (RCP ANSM) : arrêter ; sulfamide aussi. Un iSGLT2 reste
> initiable jusqu'à DFG ≥ 20 (indication rénale). Ces limites portent sur l'ÉLIMINATION RÉNALE des
> agents, pas sur leur efficacité glycémique : **l'AR GLP‑1 et l'insuline n'ont pas de
> contre‑indication liée au** rein.

**Ma question (« alors quoi ? ») reçoit une réponse complète, avec les seuils qui se croisent posés
côte à côte, et le signal clair que je demandais sur l'AR GLP‑1.** Les options écartées, avec leur
motif en une ligne, restent la meilleure trouvaille de lisibilité du produit. **Inchangé et excellent.**

### En vraie consultation ?

**Oui, franchement** — c'est le cas où j'appellerais le néphrologue si je pouvais, et l'outil me tient
lieu de premier avis.

---

# N7 — La désescalade chez la très âgée : le chiffre trop bon (Mme Chevallier, 88 ans)

> Vignette prioritaire (les correctifs la touchent).

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 2.
- **Actions** : **25** (27 le 30/07).
  - « Fixer la cible » : **3** (Âge 88 · Ancienneté 26 · ☑ Fragilité) → espérance de vie calculée
    « **Limitée** », réponse immédiate.
  - Navigation + garde-fou : **3**.
  - « Traiter » : **19**.
- **Temps** : ~5 min.

**Correctif vérifié.** La suggestion d'espérance de vie se calcule bien (« Limitée » chez une femme de
88 ans fragile), **et elle se propage correctement au nœud « Traiter »** via le partage de « Fragilité »
— je n'ai pas eu à la re-déclarer. Le correctif annoncé fonctionne sur cette vignette.

### Réponse obtenue, verbatim

**Nœud « Fixer la cible »** : `Recommandée` **Cible < 9 %** `Preuve très faible`.

**Nœud « Traiter »** — et **l'ordre a changé, dans le bon sens** :

> **Traitement à alléger — gestes cumulables**
> *OPTIONS ÉQUIVALENTES SUR LES DONNÉES DISPONIBLES : L'OUTIL NE LES DÉPARTAGE PAS, LE CHOIX REVIENT
> AU PRATICIEN.*
> `Recommandée` **Désintensifier : alléger la charge thérapeutique globale (relâcher la cible)**
> `Preuve faible`
> `Recommandée` **Réduire** · **Réduire la posologie de l'insuline (sur‑basalisation / hypoglycémie)**
> `Preuve faible`
> `Recommandée` **Réduire** · **Réduire la posologie du sulfamide** `Preuve faible`
>
> **Socle du traitement** — Metformine `Recommandation officielle (France)` `Preuve faible`
>
> **Agent à ajouter — en choisir un**
> `Recommandée` **Ajouter** · **Introduire un iSGLT2** `Preuve élevée`
>
> Introduire un AR GLP‑1 **écarté : IMC < 22 et Dénutrition / carence**

**Progrès net : le groupe « Traitement à alléger » est passé EN TÊTE.** Le 30/07, « Agent à ajouter :
Introduire un iSGLT2 », `Recommandée` `Preuve élevée`, s'affichait **au-dessus** du groupe
d'allègement chez une patiente qu'on déprescrit — c'était le défaut n° 9. L'ordre correspond
maintenant à l'intention déclarée.

**L'asymétrie de fond persiste** (elle est tranchée « sans action » depuis le 29/07, je ne fais que
constater l'effet à l'écran) : l'AR GLP‑1 est correctement écarté par « IMC < 22 et Dénutrition »,
**l'iSGLT2 n'est filtré par aucun des deux** et reste proposé, badgé `Preuve élevée`, à une femme de
88 ans à 49 kg qui saute des repas.

### Ce que la refonte coûte ici

**Aucune des trois cartes d'allègement ne porte de pastille « Posologie ».** Vérifié une à une : elles
n'ont que « Proposé parce que » (et une contre-indication pour la première). **Ma question — « je
baisse les 12 UI de combien, et à quelle vitesse ? » — n'a donc aucune réponse chiffrée sur l'écran.**
La bannière « L'OUTIL NE LES DÉPARTAGE PAS » me dit honnêtement qu'il ne choisira pas entre le
glimépiride et l'insuline, ce qui est loyal mais laisse ma question ouverte.

**Détail qui grince.** La carte metformine, chez cette patiente qu'on déprescrit à DFG 38, affiche sous
« Posologie » : « **instauration** : paliers de 15 j jusqu'à dose cible (ex. 2 g/j en 1 mois) ». Un
texte d'instauration sur une carte de poursuite, chez quelqu'un qu'on allège.

### Friction bloquante mineure

Le champ **Albuminurie** est réclamé et je ne l'ai pas dans le dossier de l'EHPAD. Résultat : la
recommandation reste **PROVISOIRE** jusqu'au bout, avec le bandeau « Reco provisoire — 1 critère
décisif non confirmé ». Il n'existe aucun moyen de dire « je ne l'ai pas » : le formulaire ne distingue
pas « non renseigné » de « inconnu ».

### En vraie consultation ?

**La cible : oui, en 3 actions et 20 secondes.** Le traitement : oui pour le raisonnement (l'outil
propose bien d'enlever, ce qui répondait à mon inquiétude de départ), **non pour les modalités**.

---

# N8 — L'obésité, la demande porte sur le poids (Mme Sissoko, 41 ans)

### Déroulé de saisie, chiffré

- **Écrans ouverts** : **2** (« Traiter » · écran d'aiguillage du module RHD). **Le nœud
  « Alimentation » n'a pas été rempli** (voir ci-dessous).
- **Actions** : **16** sur « Traiter » + 2 de navigation vers le module RHD.
- **Temps** : ~4 min.

### Réponse obtenue, verbatim (nœud « Traiter »)

> **Socle** — Metformine `Recommandation officielle (France)` `Preuve faible`
> **Agent à ajouter — en choisir un**
> `Recommandée` **Ajouter** · **Introduire un AR GLP‑1** `Preuve modérée`
> **Ajouter** · **Introduire un iSGLT2** `Preuve élevée`
> **Ajouter** · **Introduire le tirzépatide (obésité — prescription spécialisée)** `Preuve modérée`
> *OPTIONS ÉQUIVALENTES SUR LES DONNÉES DISPONIBLES…*
> **Ajouter** · **Gliptine (sitagliptine) — option glycémique orale de bas rang** `Preuve modérée`
> **Ajouter** · **Sulfamide (gliclazide MR ou glimépiride)** `Preuve modérée`

Posologies obtenues d'un clic : AR GLP‑1 (liraglutide 0,6→1,8 mg/j ; sémaglutide 0,25→1 mg/sem ;
dulaglutide 0,75/1,5→4,5 mg/sem) — **le tirzépatide, lui, n'a pas de pastille Posologie.**

**Ce que je cherchais et que je n'ai toujours pas : un chiffre de perte de poids.** Recherche
exhaustive dans le texte complet des cartes AR GLP‑1 et tirzépatide : **aucune occurrence de « kg »,
aucun pourcentage de perte de poids.** Le tirzépatide dit « Efficacité HbA1c et perte de poids
supérieures aux AR GLP‑1 » — un comparatif sans nombre. **Inchangé depuis le 30/07.** Je ne peux
toujours rien promettre de chiffré à Mme Sissoko.

**Rien non plus sur la chirurgie bariatrique** à IMC 39,8 avec DT2.

**Placement discutable de la bannière.** « OPTIONS ÉQUIVALENTES … LE CHOIX REVIENT AU PRATICIEN »
apparaît **après** les trois premières cartes, au milieu du groupe. Sa portée est ambiguë : équivalence
des cinq, ou des deux dernières seulement ? Sur l'écran N3 elle coiffait le groupe entier, ici non.

### Module RHD — le hors-périmètre est déclaré, et c'est bien écrit

L'écran d'aiguillage pose toujours la bonne question (« **Quel levier travailler avec ce patient
aujourd'hui ?** ») avec trois puces descriptives par axe. Son bloc « Ce que dit la preuve » précise :

> Hors périmètre des deux nœuds : **l'objectif de perte de poids et la rémission**, la prescription
> diététique détaillée (orientation vers le diététicien de la structure) et le bilan d'aptitude
> physique.

**La demande de la patiente reste donc sans écran** — mais l'outil le dit, ce qui vaut mieux que de me
laisser chercher.

**Nœud « Alimentation » : toujours 15 champs** (7 + 4 + 1 + 3 selon les compteurs des quatre sections).
Je me suis arrêté là, comme le 30/07 : un interrogatoire alimentaire de cette longueur n'entre pas dans
une consultation de 15 minutes.

**Contradiction relevée en passant.** L'écran d'aiguillage affirme deux fois que les axes sont
étanches : « rien de ce qui est saisi dans l'un n'est repris dans l'autre », « **aucune valeur ne
circule de l'un à l'autre** ». Or, après avoir rempli « Activité physique » (N9), l'ouverture
d'« Alimentation » affiche « **Fragilité · repris de votre saisie** » et déclenche le bandeau de
ré-entrée. Le partage fonctionne ; c'est le texte qui dit le contraire.

### En vraie consultation ?

**Non pour sa demande.** L'outil me donne le bon médicament (AR GLP‑1 en tête) mais rien de ce qu'il me
faut pour tenir cette patiente six mois.

---

# N9 — Le patient motivé qui veut « faire du sport » (M. Ould-Amara, 53 ans)

### Déroulé de saisie, chiffré

- **Écrans ouverts** : 2 (aiguillage + nœud « Activité physique »).
- **Actions** : **10** (14 le 30/07) — Règles hygiéno-diététiques · Activité physique · Rien à signaler ·
  Suivant · Jamais · En voiture · Plus de 8 h · Rien à signaler · Suivant · Rien à signaler.
- **Temps** : ~2 min. **Formulaire entièrement complété.**

**Correctif vérifié — le défaut n° 7 du 30/07 est corrigé.** Après avoir répondu « **Jamais** » à
« Séances d'activité physique structurée », le champ « **Durée d'une séance** » **disparaît**. Le
30/07 il restait réclamé « · à confirmer » et j'avais dû saisir une valeur fausse ; j'écrivais que
c'était « le moment où je cesse de faire confiance à l'écran ». **Ce moment n'existe plus.** Le
compteur passe de 5 à 3 champs à confirmer dans la foulée.

**Bonne définition trouvée en tête de nœud** : le champ « Insuline, sulfamide ou glinide en cours »
porte sa liste (« les seules classes qui exposent à l'hypoglycémie à l'effort. Metformine, iSGLT2,
AR GLP‑1, tirzépatide et gliptine n'y exposent pas en monothérapie »).

### Réponse obtenue, verbatim

> **Rupture de sédentarité** — Se lever et bouger quelques minutes à chaque heure de position assise
> prolongée `Recommandée` `Preuve faible`
> *(+ 2 variantes équivalentes : repère du quotidien, transformer une pause existante)*
> **Activité quotidienne** — Intégrer du mouvement dans les tâches déjà présentes (escaliers, ménage,
> jardinage, courses portées) `Recommandée` `Preuve modérée`
> **Pratique structurée** — Envisager un programme d'activité physique adaptée (endurance et
> renforcement), avec l'accompagnement d'un professionnel `Recommandée` `Preuve faible`
> **Autres pistes possibles (3)**
>
> *Une **évaluation médicale minimale** est recommandée avant de commencer ou d'augmenter une activité
> physique d'intensité au moins modérée, en particulier si le patient est actuellement inactif ou
> porteur d'un facteur de risque cardiovasculaire (HAS R.19). Avant l'effort, une glycémie très élevée
> (seuil de vigilance HAS : 2,5 g/L) expose à une instabilité glycémique.*

**Ma question (a) — « épreuve d'effort ou pas ? » — reçoit une demi-réponse.** « Une évaluation
médicale minimale » avec la référence HAS R.19, c'est le bon cadre, mais « minimale » n'est pas défini :
je ne sais pas si mon ECG de repos d'il y a 6 mois suffit. **Ce que je cherchais — minutes par semaine,
mélange endurance/renforcement, progressivité — n'est chiffré nulle part** sur les faces de carte.

### En vraie consultation ?

**Oui.** 10 actions, 2 minutes, et un contenu que je peux dire tel quel (« se lever quelques minutes à
chaque heure », « escaliers, ménage, courses portées »). C'est la vignette qui a le plus gagné en
fluidité.

---

# N10 — Sous insuline basale, mal équilibré, SANS capteur (M. Pereira, 62 ans)

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1. **Actions** : **18** (18 le 30/07). **Temps** : ~4 min.
  **Aucune impasse.**

**Le masquage conditionnel reste excellent.** Décocher « MCG disponible » retire d'un coup TBR,
coefficient de variation et la section « Profil glycémique nocturne » entière — et **fait apparaître**
« Glycémie à jeun habituelle (g/L) », qui est exactement ce que j'ai. Le nœud passe de 8 à 7 sections.

**La phrase d'aide reste la meilleure du produit** : « Reportez la valeur HABITUELLE des 3 derniers
matins, pas la dernière mesure. Une seule glycémie basse isolée ne justifie pas de réduire la dose ;
c'est sa répétition qui compte. »

### Réponse obtenue, verbatim

> **Avant de décider — la mesure — gestes cumulables**
> `Recommandée` **Envisager d'instaurer une mesure continue du glucose** `Preuve modérée`
> **Intensifier le traitement — gestes cumulables**
> `Recommandée` **Titrer la basale (augmenter la dose)** `Preuve modérée`

Pastille « Posologie » de la seconde carte, 1 clic : « **Basale après +2 U ≈ 40 U/j** ».

Alertes de nœud :

> À l'introduction ou l'intensification de l'insuline : **arrêter le sulfamide / le glinide** (risque
> d'hypoglycémie cumulée).
> Sans MCG : **titrer la basale sur la glycémie à jeun (cible ~0,70-1,30 g/L)** ; utiliser des profils
> capillaires **6-7 points** (avant/après les 3 repas + coucher) pour guider l'intensification
> prandiale.

Et, derrière le chevron, le protocole complet : « +2 U si elle reste au-dessus de la cible **3 matins
de suite** (ebmfrance), ou **+10 % par paliers si la dose dépasse 40 U/j** (SFD 2025, Avis 18) ;
**réévaluer tous les 3 jours** (HAS 2024, R.87) ».

### Test des 20 secondes

> « J'augmente la glargine de 2 unités, ça fait 40. Je titre sur la glycémie du matin, cible 0,70 à
> 1,30. Je lui demande un profil capillaire 6-7 points. Et j'arrête le gliclazide. »

**Le meilleur score de la passe, comme le 30/07.** C'est toujours le seul écran qui produit une phrase
que je peux recopier sur une ordonnance — et la refonte ne l'a pas abîmé : le chiffre est à un survol.

### L'écart

Ce que la refonte change ici : le protocole (« 3 matins de suite », « réévaluer tous les 3 jours ») est
passé derrière le chevron. Le chiffre d'action (+2 U → 40 U/j) est resté accessible. **Le bon arbitrage
a été fait sur cette carte.**

### En vraie consultation ?

**Oui, sans réserve.** C'est le nœud qui justifie l'outil à lui seul.

---

# N11 — Sous insuline AVEC capteur, hypoglycémies nocturnes (Mme Renard, 68 ans)

> Vignette prioritaire : elle porte le correctif « GAJ n'est plus réclamée quand un capteur est
> déclaré », et c'est le seul endroit où la **pastille ambre** existe.

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1.
- **Actions** : **26**, dont **1 aller-retour** vers la section « Traitement actuel » pour saisir les
  deux doses (25 et 2 allers-retours le 30/07).
- **Temps** : ~5 min.

**Correctif n° 1 vérifié — la glycémie à jeun n'est plus réclamée sous capteur.** Avec « MCG
disponible » coché, la section « Surveillance glycémique » contient **exactement** TBR et coefficient
de variation. Le champ « Glycémie à jeun habituelle » **n'existe plus à l'écran** — il n'est pas
« marqué sans effet », il a disparu. **C'est le correctif annoncé, et il est propre.**

**Correctif n° 2 vérifié — la contradiction d'étiquette (défaut n° 5 du 30/07) est levée.** Tant
qu'aucune carte n'a besoin des doses, les deux champs portent « · sans effet sur la reco actuelle ».
**Dès que la carte « Optimiser la répartition du basal-bolus » apparaît**, les mêmes champs passent à
« · à confirmer » et la section affiche « À renseigner dans cette section : Dose de basale actuelle
(U/j), Dose de rapide actuelle (U/j) ». Les deux étiquettes ne se contredisent plus : elles se
succèdent.

### La pastille ambre — réponse à la question T-111 (b)

**Rendu observé, doses non saisies :**
- l'icône de la pastille « Posologie » passe du gris (`oklch(0.62 0.015 245)`) à **l'ambre**
  (`oklch(0.48 0.09 85)`) — **la couleur du glyphe seulement**, sans fond, sans bordure, sur 14 px de
  pictogramme dans un bouton de 32 px ;
- le **texte de survol** devient : « **Doses non calculées — voir le détail** » ;
- le **panneau ouvert** nomme précisément : « **Doses non calculées : Dose totale quotidienne — à
  renseigner : Dose de basale actuelle (U/j), Dose de rapide actuelle (U/j)** » ;
- dès les deux doses saisies (34 et 24), l'ambre disparaît et la pastille affiche « **Dose totale
  quotidienne ≈ 58 U/j** ».

**Mon jugement d'usage, sans ouvrir le panneau.** L'ambre me dit « quelque chose cloche sur la
posologie » — pas « une dose manque à renseigner ». La différence compte : mon premier réflexe devant
un pictogramme ambre dans une carte de traitement est « attention, précaution », pas « il te manque une
saisie ». **Le survol rattrape en partie** (« Doses non calculées ») mais reste incomplet : il ne dit
pas **lesquelles**, alors que le panneau, lui, le dit parfaitement. Et sur un écran à cinq cartes,
distinguer une pastille ambre de quatre pastilles grises de 32 px, en consultation, entre deux
phrases — je n'y compterais pas.

**Réserve d'accessibilité, constatée :** l'ambre est le **seul** porteur de l'information dans le socle
visible (même icône, même position, même taille). Il n'y a ni point, ni astérisque, ni changement de
forme.

### Réponse obtenue, verbatim

> **Ajuster le schéma en place — gestes cumulables**
> `Recommandée` **Optimiser la répartition du basal-bolus (guidé par l'AGP et les doses actuelles)**
> `Preuve faible` — *Doses indicatives : Dose totale quotidienne ≈ 58 U/j*
> **Alléger le schéma — gestes cumulables**
> `Recommandée` **Réduire** · **Désintensifier / alléger le schéma** `Preuve faible`

Pastille « Posologie » de la seconde : « **réduire au jugement clinique — aucun rythme chiffré sourcé
pour la déprescription programmée** (voir « Corriger l'hypoglycémie » si signal actif) ».

Alerte de nœud, qui répond à ma question de seuil :

> Cibles de MCG standard (consensus Battelino 2019 — repères d'interprétation, PAS un critère dur
> validé sur les complications) : **TIR > 70 %, TBR < 4 %** et < 1 % (< 54 mg/dL), TAR < 25 % …

### L'écart — et c'est le point le plus frustrant de la passe

**L'outil connaît ma réponse et ne me la donne pas.** Le « Proposé parce que » de la première carte
énonce ma situation exacte : « … et **Profil glycémique nocturne (lecture AGP) = Baisse continue de la
glycémie nocturne** ». Et son argumentaire contient la règle :

> AVEC capteur, guidé par le profil AGP — **baisse continue nocturne → réduire la basale** ; hausse
> continue nocturne → augmenter la basale ; courbe nocturne plate → la basale n'est pas en cause ;
> hausse entre les repas → augmenter le bolus / avancer le timing ; baisse entre les repas → réduire
> le bolus.

**Donc : l'outil sait que je suis dans la branche « baisse continue nocturne », il possède la règle qui
dit « réduire la basale », et il m'affiche à la place un titre générique (« Optimiser la répartition »)
en me laissant faire l'appariement moi-même, dans une table à cinq branches, derrière un chevron.**
Ma question était « qu'est-ce que je baisse en premier, la basale du soir ou l'asparte du dîner ? » :
la réponse est dans la machine, elle n'est pas sur l'écran.

**En revanche, la sécurité passe bien devant le chiffre d'HbA1c** — ce que je demandais explicitement.
L'HbA1c à 7,0 % « à la cible » ne bloque rien : les cartes proposées sont un ajustement et un
allègement, jamais une intensification. **Bon point de fond.**

### En vraie consultation ?

**Oui, avec réserve.** Pour le seuil (TBR < 4 %) et la confirmation que la variabilité à 41 % est
excessive : immédiatement. Pour la conduite : je devrai ouvrir l'argumentaire et lire cinq branches.

---

# N12 — L'HbA1c à laquelle je ne crois pas (Mme Diallo, 57 ans)

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1. **Actions** : **19**. **Temps** : ~4 min.

### Le fix du Plan P7 que je viens chercher : toujours pas livré

Aucun signalement de validité de l'HbA1c. J'ai déclaré « **En dessous de l'objectif (sur-traitement
probable)** » sur un 6,4 % chez une patiente drépanocytaire AS, anémique à 9,8 g/dL, transfusée il y a
six semaines, dont les glycémies capillaires sont à 1,90 et 2,60 g/L. **L'outil accepte sans un mot** et
construit sa réponse là-dessus. `plans/P7` marque SA2 `[ ]` : ce n'est pas une régression, c'est un
correctif non posé. **Une ligne, comme convenu, et je passe.**

**Nuance nouvelle, à créditer.** Le bloc « Ce que dit la preuve pour ce nœud » (P10) dit maintenant :

> Ce nœud n'a aucun critère de fonction hépatique …, ni de kaliémie …, **ni d'hémoglobine**, ni de
> poids sec / état volémique, ni de refus global de traitement du patient … : **une option
> « Recommandée » ne les a pas évalués, c'est au praticien de le faire.**

Ce n'est pas l'avertissement que j'attendais (« l'HbA1c peut être ininterprétable »), mais c'est la
première fois que l'outil me dit qu'il ne regarde pas l'hémoglobine. **Réserve d'usage : ce bloc est
un `<details>` replié par défaut.** En consultation, je ne l'ouvrirai jamais spontanément.

### Réponse obtenue, verbatim

> **Socle** — Metformine `Recommandation officielle (France)` `Preuve faible`
> **Traitement à corriger ou remplacer** — **Remplacer la gliptine** `Recommandée` `Preuve modérée`
> **Agent à ajouter — en choisir un** — *OPTIONS ÉQUIVALENTES…* — **iSGLT2** `Preuve élevée` ·
> **AR GLP‑1** `Preuve modérée`

**À décharge** : malgré ma déclaration « En dessous (sur-traitement probable) », l'outil **ne propose
aucune désintensification** (elle est conditionnée à une hypoglycémie ou à un terrain gériatrique,
absents ici). Il ne fait donc pas de mal — il ne prévient simplement pas.

### En vraie consultation ?

**Non.** C'est la seule vignette où je referme l'outil : je sais qu'il raisonne sur un chiffre faux et
je n'ai aucun moyen de le lui dire.

---

# N13 — L'agent mal toléré, et la patiente qui n'a rien (M. Vasseur 50 ans / Mme Petit 44 ans)

### 13a — M. Vasseur (metformine mal tolérée)

- **Actions** : **19** (19 le 30/07). **Temps** : ~4 min.

Cocher « Intolérance à un traitement en cours » (marqué « · **détermine la suite** ») fait apparaître
« Nature de l'intolérance » (Digestive / Génito-urinaire / Perte de poids excessive / Cutanée / Autre).
Avec « Digestive » :

> **À faire d'emblée — sécurité** — `Mesure de sécurité` **Réduire** · **Réduire la posologie de la
> metformine (fonction rénale altérée ou intolérance digestive)** `Preuve faible`
> **Socle** — Metformine `Recommandation officielle (France)` `Preuve faible`
> **Agent à ajouter — en choisir un** — **AR GLP‑1** `Recommandée` `Preuve modérée` · **tirzépatide**
> `Preuve modérée`
> **Traitement à alléger** — **Optimiser l'agent mal toléré : réduire la posologie (intolérance non
> majeure) ou remplacer** `Recommandée` `Preuve faible`

**L'intolérance est bien reconnue comme un motif de changement à part entière**, et la mesure de
sécurité est en tête. **Défaut persistant : trois cartes parlent de la metformine** (« Réduire »,
« instaurer ou poursuivre », « Optimiser l'agent mal toléré ») et je ne sais toujours pas, de mémoire,
laquelle appliquer.

### 13b — Mme Petit (test négatif)

- **Actions** : **13**.
- Intention **Optimiser**, **aucun traitement coché**, Intolérance = **oui**, nature = Digestive.

**Résultat : la carte « Optimiser l'agent mal toléré » N'APPARAÎT PAS.** L'écran affiche uniquement le
socle metformine et :

> **EN ATTENTE — CRITÈRES À RENSEIGNER POUR TRANCHER**
> **À renseigner pour trancher : Traitements en cours.**

**Le comportement voulu est intact, et l'attente est maintenant nommée** (elle était muette le 30/07).
Le test en négatif passe.

### En vraie consultation ?

**Oui pour 13a**, avec la réserve de la redondance. **13b n'appelle pas l'outil**, mais il ne raconte
plus n'importe quoi.

---

# N14 — La statine chez celui qui n'en veut plus (M. Lombard, 58 ans)

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1. **Actions** : **11** (13 le 30/07). **Temps** : ~2 min 30.

**La conversion mentale des CK subsiste** : le champ demande « CK, en multiples de la normale (0 = non
dosé) » et mon labo me rend 210 UI/L. J'ai saisi « 1 » au jugé. Inchangé.

### Réponse obtenue, verbatim

> `Mesure de sécurité` **Statine indisponible (intolérance avérée ou contre-indication) — alternatives
> hypolipémiantes** `Preuve modérée`
>
> *Ce patient a une maladie cardiovasculaire ÉTABLIE : il relève de la prévention SECONDAIRE, où le
> bénéfice de l'abaissement du LDL est le mieux démontré et le NNT le plus bas. **L'indisponibilité de
> la statine ne diminue en rien son risque absolu — elle rend seulement plus difficile de le
> réduire.***

Et, derrière une pastille :

> **SÉQUENCE FRANÇAISE, telle que l'écrit la recommandation 2026 : statine → ézétimibe (2ᵉ ligne) →
> anti-PCSK9 (3ᵉ ligne) → acide bempédoïque, qualifié de « traitement de dernier recours ».** ⚠ Cette
> place de dernier recours e…

**L'outil ne me réaffirme pas « mettez une statine haute intensité » — exactement ce que je
demandais.** Le badge `Mesure de sécurité` et la phrase de cadrage font le travail.

### Le défaut d'ergonomie du 30/07 s'est déplacé, il n'a pas disparu

**La séquence française — LA réponse à ma question — est derrière la pastille « Contre-indications ».**
La carte n'a **pas** de pastille « Posologie ». Le 30/07, sur N4, la bonne réponse était cachée derrière
« ⚠ 2 contre-indications, effet attendu et plus » ; ce cas-là est corrigé (la pastille « Posologie » a
été créée), mais **la même mécanique se reproduit ici** : quand une carte n'a pas de champ posologie,
son contenu actionnable retombe sous le mot « Contre-indications », c'est-à-dire sous le mot qui me
donne le moins envie de cliquer quand je cherche une conduite.

### En vraie consultation ?

**Oui, immédiatement.** 11 actions, 2 min 30, et sur ce patient l'outil fait mieux que moi et mieux que
20 minutes de recherche. C'est, avec l'insuline, le nœud qui justifie le produit.

---

# N15 — Le cas où tout se contredit (Mme Aguilar, 77 ans)

### Déroulé de saisie, chiffré

- **Écrans/nœuds ouverts** : 1. **Actions** : **22** (19 le 30/07). **Temps** : ~5 min.

### Réponse obtenue, verbatim

> **À faire d'emblée — sécurité — gestes cumulables**
> `Mesure de sécurité` **Arrêter** · **Arrêter le sulfamide (DFG < 30 — contre‑indication rénale)**
> `Preuve faible`
> **Agent à ajouter — en choisir un**
> `Recommandée` **Ajouter** · **Introduire un iSGLT2** `Preuve élevée`
> **Ajouter** · **Introduire un AR GLP‑1** `Preuve modérée`
> *Chez un sujet fragile, surveiller le poids et l'état nutritionnel à l'instauration d'un incrétine
> (risque de sarcopénie / anorexie).*
>
> Metformine **écarté : DFG < 30** · Remplacer le sulfamide **écarté : DFG < 30**

**Ma question « le gliclazide, je l'arrête ? » reçoit une réponse ferme et juste, badgée mesure de
sécurité.** Très bien.

**Ma question centrale — « l'iSGLT2, est-ce que je le mets ? » — reçoit un `Recommandée` `Preuve
élevée` chez une patiente dont l'outil ignore la cirrhose Child B, la kaliémie à 5,3, l'anémie à
9,1 g/dL, le poids sec inconnu et le refus explicite.** C'est ce que je voulais mesurer : **il
affirme.**

**Mais — et c'est le progrès de P10 — il déclare désormais ce qu'il n'a pas regardé** : le bloc
« Ce que dit la preuve pour ce nœud » énumère précisément fonction hépatique, kaliémie, hémoglobine,
poids sec/état volémique et **refus global de traitement**, en concluant « une option “Recommandée” ne
les a pas évalués, c'est au praticien de le faire ». Sur cette patiente, la liste est **exactement**
celle de ce qui me fait hésiter. C'est un vrai progrès de loyauté.

**Réserve, et elle est décisive :** ce bloc est **replié par défaut**. La réponse ferme est visible, la
réserve est à un clic que rien ne pousse à faire. En consultation, on lit le résultat, pas les
préliminaires.

### Le champ « Refuse » — réponse à la question T-107 (b)

J'ai déclaré « Refuse » (« je ne veux pas d'un médicament de plus, j'en prends déjà treize »). Mesuré :
le bouton sélectionné prend le **bleu d'accent neutre** (`oklch(0.93 0.025 254)`), sans ton sémantique
— alors que sur le même écran « Risque hypoglycémique = Élevé » est **rouge** (`data-ton="danger"`).

**Mon avis de praticien : ne colorez pas « Refuse ».** Le refus n'est pas une anomalie du patient,
c'est une donnée de la relation. Le voir passer en rouge à côté d'un DFG et d'une albuminurie ferait de
la parole de Mme Aguilar un facteur de risque de plus. Le neutre est le bon choix, et il se lit très
bien : je vois que la valeur est retenue, je ne vois pas de jugement.

### En vraie consultation ?

**Le sulfamide : oui.** L'iSGLT2 : **non** — et je vois maintenant, écrit noir sur blanc, pourquoi je
ne dois pas suivre l'outil sur ce point. C'est mieux que le 30/07, où rien ne le disait.

---
---

# Tableau de synthèse

| # | Patient | Écrans | Actions | Temps | Δ vs 30/07 | Je l'ouvrirais ? |
| --- | --- | --- | --- | --- | --- | --- |
| N1 | Ferreira 46 ans, DT2 tout neuf | 1 | **11** | ~2 min | = | **Oui, et plusieurs fois** (était « une fois ») |
| N2 | Lantier 59 ans, cible seule | 1 | **5** | ~35 s | **−1** | **Oui, souvent** |
| N3 | Abadie 64 ans, à la cible + hypo | 2 | **25** | ~4 min 30 | = | **Oui, hors consultation** |
| N4 | Kervarec 67 ans, coronarien × 3 écrans | **3** | **35** | ~7 min | = | **Statine oui ; le reste non** |
| N5 | Traoré 71 ans, DFG 31 | 1 | **19** | ~3 min | +1 | **Oui, sans hésiter** |
| N6 | Nowak 79 ans, DFG 13 | 1 | **18** | ~3 min | +1 | **Oui, franchement** |
| N7 | Chevallier 88 ans, déprescription | 2 | **25** | ~5 min | **−2** | **Cible oui ; modalités non** |
| N8 | Sissoko 41 ans, demande = poids | **2** | **16** (+2 nav) | ~4 min | −10 (nœud Alimentation non rempli) | **Non pour sa demande** |
| N9 | Ould‑Amara 53 ans, veut courir | 2 | **10** | ~2 min | **−4** | **Oui** |
| N10 | Pereira 62 ans, insuline **sans capteur** | 1 | **18** | ~4 min | = | **Oui, sans réserve** |
| N11 | Renard 68 ans, insuline **avec capteur** | 1 | **26** | ~5 min | +1, mais **1 aller-retour au lieu de 2** | **Oui, avec réserve** |
| N12 | Diallo 57 ans, **HbA1c non fiable** | 1 | **19** | ~4 min | +1 | **Non** |
| N13a | Vasseur 50 ans, metformine mal tolérée | 1 | **19** | ~4 min | = | **Oui** |
| N13b | Petit 44 ans, naïve (test négatif) | 1 | **13** | ~2 min 30 | +2 | **Comportement correct** |
| N14 | Lombard 58 ans, intolérance statine | 1 | **11** | ~2 min 30 | **−2** | **Oui, immédiatement** |
| N15 | Aguilar 77 ans, tout se contredit | 1 | **22** | ~5 min | +3 | **Sulfamide oui ; iSGLT2 non** |
| | **Total** | **22** | **292** | **~1 h 00** | **−12 actions, −10 min** | |

---

# (A) Ergonomie de saisie en consultation

**Le chiffre : 292 actions pour 15 patients (contre 304), soit 19,5 actions par patient et une heure
pour 15 consultations.** Le gain global est modeste (−4 %) mais il est **mal réparti, et c'est une
bonne nouvelle** : il se concentre là où l'outil est réellement ouvert en consultation (cible : −1,
activité physique : −4, statine : −2, déprescription : −2) et se paie là où le raisonnement est long
(N15 : +3, N11 : +1) — c'est-à-dire là où j'accepte de payer.

**Ce qui a nettement progressé.**
1. **Un clic d'entrée économisé sur chaque patient** : l'écran « Aide à la décision » liste directement
   les cinq nœuds du domaine DT2.
2. **La suggestion automatique d'espérance de vie fonctionne** : elle supprime un clic sur chacun des
   cinq nœuds qui portent ce champ, et surtout elle supprime une hésitation (je n'ai plus à trancher
   « Longue ou Intermédiaire ? » sans définition).
3. **Les définitions sont arrivées là où je décrochais** : « Risque hypoglycémique du schéma » (la
   phrase « un jugement clinique, pas une simple case du dossier » règle le problème), « Autres
   facteurs de risque cardiovasculaire », les trois crans d'espérance de vie, « Insuline/sulfamide/
   glinide en cours ». **Les deux champs sur lesquels j'écrivais « je décroche » le 30/07 sont traités.**
4. **Le masquage conditionnel s'est étendu au bon endroit** : « Durée d'une séance » disparaît après
   « Jamais » (N9) ; la glycémie à jeun disparaît sous capteur (N11) ; la section « Traitement »
   disparaît en intention « Initier » (N1).
5. **Le cartouche d'attente ne se contente plus de nommer, il priorise** : « Commencez par : … Ce sont
   les critères qui débloquent le plus d'options ; 11 autres restent à renseigner ensuite. » Pour un
   praticien pressé, c'est mieux qu'une liste.
6. **Le compteur « Session : N valeurs »** rend enfin visible ce que l'outil retient d'un patient.

**Ce qui prend toujours trop de temps.**
- **Le nœud « Traiter » reste le goulot** : six sections, cinq boutons « Suivant », 17 à 19 actions
  minimum. Il pèse à lui seul plus de la moitié des actions de la passe.
- **Le nœud « Alimentation » : toujours 15 champs.** Je m'arrête toujours avant la fin.
- **Les conversions mentales subsistent** : IMC à calculer, CK « en multiples de la normale »,
  albuminurie en catégories quand le labo rend un ratio A/C.
- **Le garde-fou de ré-entrée ajoute une action par transition entre nœuds** (+2 sur N4). Il les vaut,
  mais il faut le compter.

**Ce qui reste impossible à dire à l'outil.** « Je ne l'ai pas. » En N7, l'albuminurie manque au
dossier de l'EHPAD, et la recommandation reste PROVISOIRE indéfiniment. Le formulaire ne distingue pas
« non renseigné » de « inconnu, et il ne le sera pas ».

**Les pastilles sont-elles des cibles confortables ?** Mesuré : **32 × 32 px CSS**, avec un pas de
42 px (10 px de marge entre deux), un glyphe SVG de 14 px, sans fond ni bordure au repos. À la souris,
c'est utilisable — et le survol suffit à lire le contenu, donc le clic n'est même pas nécessaire. **Au
doigt, sur une tablette de consultation, 32 px est en dessous des seuils usuels (44–48 px) et quatre
cibles se suivent à 10 px d'écart** : je ne m'y fierais pas entre deux phrases. Comme la bulle de
survol est explicitement désactivée en tactile (`@media (hover: hover) and (pointer: fine)`), l'usage
tactile perd le raccourci **et** hérite de la petite cible. **C'est le scénario tactile qu'il faut
regarder, pas le scénario souris.**

# (B) Lisibilité et compréhension immédiate de la réponse

**Test des 20 secondes : 12 restitutions sur 15 sont fidèles** (11/15 le 30/07), et deux sont
franchement meilleures qu'avant : N1 (j'ai retenu la titration, absente le 30/07) et **N4, où je
conclus juste là où je me trompais**. Une a régressé : **N2**, où j'ai perdu l'argument EBM qui était
tout l'intérêt du nœud.

**La question centrale : la posologie derrière un clic, est-ce tenable ?**

**Décompte exact sur les 15 vignettes.** J'ai ouvert la pastille « Posologie » **8 fois** :
N1 (metformine), N3 (iSGLT2 puis AR GLP‑1), N4 (statine — décisif), N8 (AR GLP‑1), N10 (titration
basale — décisif), N11 (deux fois : doses non calculées, puis dose totale). **Sur 22 écrans ouverts,
c'est un clic supplémentaire dans un peu plus d'un tiers des cas.**

**Ma réponse, en tant que praticien : oui, c'est tenable — mais pour trois raisons dont deux sont
fragiles.**

1. **À la souris, ce n'est pas un clic, c'est un survol.** La bulle affiche le texte complet au
   passage. C'est la raison principale pour laquelle le coût est indolore. **Cette raison disparaît en
   tactile.**
2. **La pastille s'appelle « Posologie ».** C'est ce qui a sauvé N4 : je cherchais une dose, j'ai vu le
   mot « Posologie », j'ai su où aller. Le contraste avec le 30/07 (« ⚠ 2 contre-indications, effet
   attendu et plus ») est saisissant. **Un bon nom vaut mieux qu'une bonne visibilité.**
3. **Mais la pastille manque précisément là où elle manquerait le plus.** Vérifié carte par carte :
   **aucune carte « Réduire / Arrêter / Désintensifier » ne porte de pastille Posologie** —
   « Réduire la posologie de la metformine » (N5, N13a), les trois cartes d'allègement de N7,
   « Réduire la posologie du sulfamide » (N3). Ce sont les cartes dont le titre **contient le mot
   posologie** et qui n'en donnent aucune. Et comme il n'y a pas de contenu, il n'y a **même pas** la
   pastille ambre pour signaler le manque : la carte est muette.

**Conclusion sur la question centrale, telle que je la remonterais au référent :** *le clic n'est pas
le problème ; le silence l'est.* La refonte est acceptable si trois conditions sont tenues — le nom
« Posologie », le survol en desktop, et **une pastille présente sur toute carte qui prescrit un
changement de dose, fût-ce pour dire « au jugement clinique »* (ce que la carte « Désintensifier /
alléger le schéma » de N11 fait très bien, et qui devrait être la règle).

**La pastille ambre se comprend-elle sans l'ouvrir ?** **Partiellement — je la lirais « attention »,
pas « il manque une saisie ».** Le survol (« Doses non calculées — voir le détail ») rattrape à moitié :
il dit qu'il manque quelque chose, pas quoi. Le panneau, lui, est parfait (« à renseigner : Dose de
basale actuelle, Dose de rapide actuelle »). **Le maillon faible est l'étage intermédiaire.** Une
mention courte dans le socle visible — un simple « (dose à renseigner) » à côté du badge de preuve —
rendrait l'esprit du défaut J sans rouvrir l'arbitrage sur la carte compacte.

**La légende des couleurs d'action en tête de colonne : utile ou bruit ?**
**Utile, mais pas comme légende.** Observée sur N3 (trois verbes : Ajouter / Remplacer / Réduire),
N7 (Ajouter / Réduire), N15 (Ajouter / Arrêter), N5 (trois verbes). Mon usage réel : je ne l'ai jamais
lue pour décoder une couleur — le chip de verbe est **écrit en toutes lettres sur chaque carte**, donc
la couleur n'a rien à décoder. **En revanche je l'ai lue comme un sommaire** : « sur cet écran, il y a
de l'ajout, du remplacement et de la réduction » — c'est-à-dire la nature de l'ordonnance avant même
de lire les cartes. Sur N7, voir « Ajouter · Réduire » en tête m'a immédiatement dit que l'outil
proposait les deux gestes, ce qui était ma question. **Recommandation d'usage : la garder, mais
assumer que c'est un résumé de l'écran, pas une légende ; et ne pas s'inquiéter qu'elle « ne rende
rien » sur les nœuds à un seul verbe — elle y disparaît toute seule.**

**Ce qui fait qu'une réponse ne passe toujours pas.**
1. **Des « Proposé parce que » encore bruts, et l'un d'eux se termine par « : non »** — « Sulfamide
   déjà en cours et HbA1c < 6,5 % (sur-contrôle) **: non** » (N3, N5). Le progrès est réel (la plupart
   des motifs sont devenus lisibles), le contraste au sein d'un même écran subsiste.
2. **Le titre de groupe qui contredit la carte** : « Agent à ajouter — en choisir un » au-dessus
   d'options qui remplacent (N3, N4, N12, N15). Atténué par l'existence d'un groupe « Traitement à
   corriger ou remplacer », pas résolu.
3. **La règle connue mais non appliquée** (N11) : l'outil sait dans quelle branche je suis et me
   renvoie la table des cinq branches.
4. **L'information actionnable sous « Contre-indications »** quand la carte n'a pas de posologie (N14).
5. **Le pavé « Position déclarée AU-DESSUS … intention d'OPTIMISATION »** fait toujours huit lignes
   denses (N5, N7, N13a). Précieux, jamais lu en consultation.
6. **Le double affichage bulle + panneau** qui se superposent au clic (N1).

# (C) Fidélité au raisonnement de consultation

**Là où l'outil pense comme moi — et c'est plus vrai qu'il y a trois jours.**
- **Il dit maintenant ce qu'il ne regarde pas.** Les blocs « Ce que dit la preuve pour ce nœud »
  (P10) sont, sur les six écrans, l'apport de fond le plus utile de cette version : le nœud cible
  déclare qu'il ne confronte jamais la cible à l'HbA1c réelle et ne dit rien du délai de réévaluation ;
  le nœud Traiter énumère fonction hépatique, kaliémie, hémoglobine, poids sec et refus global. **Sur
  N15, cette liste est exactement celle de ce qui me fait hésiter.** Un outil qui nomme son angle mort
  est un outil avec lequel je peux travailler.
- **La hiérarchie suit enfin l'intention déclarée** (N7 : allègement en tête chez la patiente qu'on
  déprescrit). C'est l'ordre dans lequel je pense.
- **« Déprescrire » reste une intention de plein droit**, et la sécurité passe devant le chiffre
  d'HbA1c (N11).
- **Les phrases de médecin sont plus nombreuses** : « L'indisponibilité de la statine ne diminue en
  rien son risque absolu » (N14), « Le recul manque, pas l'autorisation » (N6), « un jugement clinique,
  pas une simple case du dossier » (N3), « une piste refusée n'est pas un échec, c'est une
  information » (RHD).

**Là où l'outil pense encore en machine.**
- **Le même fait clinique porte deux noms et la réponse en dépend.** C'est le constat n° 2 en tête de
  ce rapport : « Antécédent cardiovasculaire » ≠ « Maladie cardiovasculaire athéromateuse établie »,
  et cette différence fait passer une cible de ≤ 8 % à ≤ 7 % au milieu de la consultation.
- **La réserve est repliée, l'affirmation est ouverte.** Sur N15, le `Recommandée` `Preuve élevée` est
  visible et le « je n'ai évalué ni la kaliémie ni l'hémoglobine » est derrière un `<details>` fermé.
  L'ordre d'importance est inversé par rapport à ce que le contenu dit lui-même.
- **Le patient n'entre toujours presque pas.** Une case « Fragilité », un champ « Préférence vis-à-vis
  de l'injectable ». Rien pour : ce que le patient demande (N8 : maigrir), ses chutes (N7 : trois en
  8 mois, la raison même de ma consultation), son métier (N10 : maçon), son isolement (N11 : elle vit
  seule et fait des hypos nocturnes). Le refus global (N15) est maintenant **nommé comme hors
  périmètre**, ce qui est un progrès de franchise, pas de couverture.
- **Le découpage en nœuds correspond toujours à des objets de contenu.** N4 : trois écrans, 35 actions,
  7 minutes, une resaisie franche. N8 : la demande de la patiente tombe dans l'interstice entre le nœud
  Traiter et un module RHD qui déclare le poids hors périmètre.
- **Une contradiction entre un texte et le comportement** : le module RHD affirme deux fois que ses
  deux axes sont étanches (« aucune valeur ne circule de l'un à l'autre ») alors que « Fragilité »
  circule bien de l'un à l'autre.

**La couleur sur un champ de SAISIE : information ou jugement ?**
Relevé exhaustif du catalogue effectivement appliqué : **trois critères seulement** — l'écart à
l'objectif (à l'objectif = vert, au-dessus = ambre, nettement au-dessus = rouge, en dessous = bleu),
l'albuminurie (normo/micro/macro) et le risque hypoglycémique du schéma (faible = vert, élevé = rouge).
Tout le reste — espérance de vie (y compris « Limitée »), fragilité, préférence vis-à-vis de
l'injectable, intention thérapeutique — reste **neutre**.

**Mon jugement d'usage : c'est bien calibré, à une réserve près.**
- Sur **l'écart à l'objectif** et **l'albuminurie**, la couleur se lit comme une **information** : ce
  sont des mesures, la gravité est dans le chiffre, pas dans mon appréciation. Utile : je repère
  l'état du patient en balayant le formulaire replié.
- Sur **« Risque hypoglycémique du schéma = Élevé »**, c'est différent : c'est **mon** jugement qu'on
  me renvoie en rouge. Ce n'est pas un jugement sur le patient, c'est un écho du mien — je l'ai trouvé
  plutôt confortant (« l'outil a bien pris ma déclaration au sérieux »), mais c'est le seul endroit où
  la couleur porte sur un avis et non sur une mesure. À surveiller.
- **Le fait que « Limitée » (espérance de vie) reste bleu est le meilleur détail de ce lot.** Une
  espérance de vie limitée en rouge, sur l'écran d'une patiente de 88 ans, aurait été insupportable.
- **Sur « Refuse » : ne pas colorer.** Voir N15. Le refus d'un patient n'est pas un facteur de risque.

**La largeur de l'écran est-elle bonne ?**
**Oui sur grand écran, non dans la plage la plus courante.** À 1700 px (nœud plafonné à 1600), les deux
colonnes occupent bien la largeur, les cartes tiennent sur une ligne, et **la page ne paraît pas vide
au centre** — elle paraît vide **en bas**, le contenu s'arrêtant vers 55 % de la hauteur. Le rapport
1fr/1fr tient : la colonne formulaire respire, la colonne résultats aussi.
En dessous de ~1280 px, le rapport se retourne : la colonne des recommandations devient trop étroite
pour ce qu'on lui demande de porter sur une ligne, et **c'est la mise en page à deux colonnes qui
devient le problème**, pas le plafond de 1600. Le seuil de bascule à 960 px est trop bas : entre 960 et
~1200 px, l'empilement mobile serait plus lisible que deux colonnes serrées.

---

# Comparaison avec la passe du 2026-07-30

| Point signalé le 30/07 | État au 02/08 (`e7eec71`) | Verdict |
| --- | --- | --- |
| **⚠⚠⚠ Sortir d'un nœud et y revenir ne réinitialise rien — contamination inter-patients** | **RÉSOLU.** Un garde-fou « CE NŒUD A DÉJÀ ÉTÉ OUVERT … confirmez qu'il s'agit bien du même patient » bloque **tout affichage de recommandation** jusqu'au choix « Reprendre / Repartir de zéro ». | **Corrigé — le défaut bloquant du 30/07 est levé** |
| **« Nouveau patient » : `window.confirm()` natif, comportement non reproduit** | **RÉSOLU et vérifié.** Confirmation en deux temps dans le bouton, avec « Annuler », puis « Session vidée » ; le formulaire repart réellement vierge. Réserve : la fenêtre de confirmation dure 2,6 s et une confirmation expirée ressemble à une purge réussie. | **Corrigé ; point de recette clos** |
| **⚠⚠ Champs annoncés « sans effet » qui sont ceux qui décident** | **RÉSOLU sur le nœud cible** (Âge/Ancienneté ne portent plus la mention à vide) et **enrichi ailleurs** : la mention inverse « · **détermine la suite** » signale les champs décisifs. | **Corrigé** |
| **⚠⚠ Deux étiquettes contradictoires pour le même champ (doses d'insuline, N11)** | **RÉSOLU.** Les doses passent de « sans effet » à « à confirmer » au moment exact où une carte en a besoin, et la pastille ambre le signale sur la carte. | **Corrigé** |
| **⚠ Le cartouche « EN ATTENTE » vide** | **RÉSOLU, et au-delà** : il nomme les critères manquants et les priorise (« Commencez par : … ; 11 autres restent à renseigner ensuite »). | **Corrigé** |
| **⚠ « Durée d'une séance » réclamé après « Jamais » (N9)** | **RÉSOLU.** Le champ disparaît. | **Corrigé** |
| **⚠⚠ « Pourquoi pas d'autres options ? » déverse de la logique brute** | **RÉSOLU.** « → nœud E », « DFG > 0 et DFG < 30 », « Palette glycémique ouverte » ont disparu, remplacés par « ne s'applique pas : il faudrait Metformine déjà en cours », « ni X, ni Y ». | **Corrigé** |
| **⚠ Jargon de projet dans l'argumentaire** | **PARTIELLEMENT.** « → nœud E », « VÉRIFIÉ par le référent », « DÉRIVATION absente des publications » ont disparu. **Restent** : « 6ᵉ série, collecte + red-team adversarial », « ÉTAT DES TROIS RÉSIDUELS au 2026-07-27 », « a été retirée du nœud », et la consigne au rédacteur « (ne pas afficher « bénéfice CV prouvé ») ». | **Nettement mieux, pas fini** |
| **Les cartes s'arrêtent à la classe : quelle gliflozine, quel GLP‑1, à quelle dose** | **RÉSOLU.** dapagliflozine 10 mg/j · empagliflozine 10→25 · canagliflozine 100→300 ; liraglutide 0,6→1,8 · sémaglutide 0,25→1/sem · dulaglutide 0,75/1,5→4,5/sem. Et metformine : paliers de 15 j jusqu'à 2 g/j. | **Corrigé — c'était le manque n° 1 du contenu** |
| **⚠ Information décisive rangée sous un mauvais titre (N4, statine)** | **RÉSOLU sur ce cas** (pastille « Posologie » : atorvastatine 40-80 / rosuvastatine 10-20) — **mais la mécanique se reproduit en N14**, où la séquence française est sous « Contre-indications ». | **Corrigé au cas par cas, pas en principe** |
| **⚠ Cartes redondantes** | **AMÉLIORÉ.** Le doublon de N3 est résolu par un repli « Autres pistes possibles (1) ». **Reste** : trois cartes metformine en N13a, trois cartes d'allègement en N7 (mais désormais coiffées de « L'OUTIL NE LES DÉPARTAGE PAS »). | **Mieux** |
| **⚠ Hiérarchie inversée par rapport à l'intention (N7)** | **RÉSOLU pour l'ordre** : « Traitement à alléger » est passé en tête. **L'asymétrie de fond** (iSGLT2 non filtré par IMC < 22 / dénutrition alors que l'AR GLP‑1 l'est) subsiste — tranchée « sans action » le 29/07. | **Ordre corrigé, fond inchangé (décision)** |
| **⚠ « Autres facteurs de risque CV » : nombre libre sans définition** | **RÉSOLU.** La liste est écrite sous le champ. | **Corrigé** |
| **⚠ Absence de signal sur le périmètre du nœud « Traiter » (N15)** | **RÉSOLU sur le fond** (bloc « Ce que dit la preuve » énumérant fonction hépatique, kaliémie, hémoglobine, poids sec, refus global). **Réserve** : replié par défaut. | **Corrigé, mais peu visible** |
| **⚠⚠⚠ Aucun signalement de validité de l'HbA1c (P7/SA2)** | **INCHANGÉ** (SA2 non livrée). Atténué indirectement par la mention « ni d'hémoglobine » du cadrage. | **Inchangé** |
| **Seuils de position (`a_l_objectif`) non pré-remplis** | **INCHANGÉ et attendu** (T‑048 obsolète). Vérifié deux fois : cible ≤ 7 % + HbA1c 7,0 (N3), cible ≤ 8 % + HbA1c 8,3 (N4) → position « à confirmer » dans les deux cas. | **Inchangé (décision)** |
| **Resaisie du même fait sous deux noms (N4)** | **INCHANGÉ, et aggravé en conséquence** : combiné au garde-fou de ré-entrée et à la suggestion auto, il fait maintenant **changer la cible du patient** (constat n° 2). | **Inchangé à pire** |
| **Chiffre de perte de poids (N8)** | **INCHANGÉ.** Aucun « kg », aucun pourcentage, nulle part. | **Inchangé** |
| **Nœud « Alimentation » : 15 champs** | **INCHANGÉ.** | **Inchangé** |
| **Conversion des unités (IMC, CK en multiples de la normale)** | **INCHANGÉ.** | **Inchangé** |

**Ce qui a régressé.**
1. **N2 — l'argument EBM a quitté la carte.** « Réduction de l'IDM non fatal, pas de la mortalité ;
   bénéfice absolu modeste » était visible le 30/07 et je l'avais retenu mot pour mot ; il est
   maintenant derrière le chevron. Sur le nœud le plus rapide et le plus utilisé du produit, la refonte
   a coûté la seule phrase que je venais chercher pour parler au patient.
2. **La carte compacte n'est compacte qu'au-dessus de ~1500 px.** Entre 960 et 1100, elle est plus
   haute et bien moins lisible que la carte haute qu'elle remplace (constat n° 1).
3. **Les cartes « réduire / arrêter » ont perdu leur seul emplacement de dose** sans rien recevoir en
   échange : pas de pastille, pas d'ambre, rien.

**Ce qui n'a pas bougé du tout.** La validité de l'HbA1c, le chiffre de perte de poids, les 15 champs
du questionnaire alimentaire, les conversions d'unités, la double saisie de l'antécédent
cardiovasculaire, et le fait que le patient (sa demande, ses chutes, son métier, son isolement) n'entre
toujours pas dans le formulaire.

---

# Réponse franche de clôture

**Ouvrirais-je cet outil en consultation ? Oui — pour quatre nœuds sur six maintenant, et sans
condition bloquante.**

**La condition bloquante du 30/07 est levée.** L'isolation entre deux patients était « la priorité
n° 1, purement technique ». Elle est traitée deux fois : le garde-fou de ré-entrée et « Nouveau
patient » sans dialogue natif. **Je peux enchaîner une matinée de consultations.** C'est le fait le
plus important de cette passe.

**Les quatre nœuds que j'ouvrirais, souvent :**
1. **« Fixer la cible d'HbA1c »** — 5 actions, 35 secondes, avec un motif clinique nommé. Il faut
   ouvrir le chevron pour l'argument à dire au patient.
2. **« Prescrire une statine »** — 11 actions, et la pastille « Posologie » place la réponse là où je
   la cherche.
3. **« Insulinothérapie »** — inchangé et excellent, avec ou sans capteur.
4. **« Activité physique »** — 10 actions, deux minutes, et il ne me demande plus de mentir.

**Ce que je remonterais en premier au référent, dans l'ordre :**
1. **La carte d'option ne tient pas sur une ligne entre 960 et ~1400 px** — c'est un défaut de
   conception, pas un détail, et il touche la largeur d'écran la plus courante en cabinet.
2. **La cible d'HbA1c change toute seule quand on rouvre le nœud** (antécédent CV non partagé +
   recalcul silencieux de l'espérance de vie). C'est le seul point de cette passe qui peut produire une
   décision fausse chez un patient réel.
3. **Aucune carte « réduire / arrêter » ne porte de posologie ni de signal ambre.** La déprescription
   est la moitié de ma patientèle âgée ; c'est là que l'outil se tait le plus.
4. **La validité de l'HbA1c** (P7/SA2), toujours devant moi.

*Fin de passe : 2026-08-02, 13h50. 15 vignettes, 22 écrans, 292 actions, ~1 h 00 de saisie.
Serveur de dev local (`http://localhost:5174`), commit `e7eec71`, branche `fix-defauts-avant-recette`.
Aucun fichier du produit modifié ; aucun commit.*
