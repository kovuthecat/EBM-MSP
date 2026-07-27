# Passage — 10 classes de défaut trouvées à l'écran, et les invariants à écrire

**Pour la session qui outille le banc.** Ce fichier est autoportant : tout ce qu'il faut
pour écrire les tests est ici, sans avoir à lire la recette ni le banc de profils.

| | |
|---|---|
| **Origine** | Passe navigateur (app réelle, `localhost:5174`), 12 profils de consultation joués à la main |
| **Commit recetté** | `def7cc1` — `HEAD` vérifié **identique avant et après** chaque passe, arbre de travail propre |
| **Date** | 2026-07-27 |
| **Documents longs** | `banc-profils-consultation.md` (§11 et §12) — profils complets, captures décrites, questions au référent |

> **Avertissement.** Votre lot était en cours pendant la passe. J'ai délibérément **écarté**
> tout ce qui touchait à vos fichiers du moment : compteur de critères, repères
> « à confirmer », état accessible des boutons, bandes CK de `statine`, et la famille
> « champ réclamé mais invisible » (déjà couverte par `banc/impasse.test.ts`). **Si l'une des
> classes ci-dessous est déjà traitée chez vous, ignorez-la** — je n'ai pas pu voir votre
> travail non commité.

---

## 1. Tableau de tête — par rapport valeur / effort

| # | Classe | Invariant | Effort | Dépendance |
|---|---|---|---|---|
| **K8** | Drapeaux de sécurité indiscernables en aval | **I19** | **faible** — la mécanique existe déjà | marquage `securite: true` |
| **K1** | Option de continuation applicable sans l'état qu'elle continue | **I12** | faible | `prerequis` (champ existant) |
| **K2** | Critère réclamé que le contexte rend impossible à fournir | **I13** | faible | `obtenable_si` (nouveau) |
| **K4** | Rang des cartes indépendant de l'intention déclarée | **I15** | faible | rien |
| **K6** | Position déclarative jamais confrontée aux nombres disponibles | **I17** | moyen | `derive` (existant) |
| **K3** | Aucune validation croisée entre critères | **I14** | moyen | `contraintes` (nouveau) |
| **K7** | Périmètre revendiqué mais non saisissable | **I18** | moyen | `hors_perimetre` structuré |
| **K9** | Portée d'un garde-fou = famille, pas modalité | **I20** | moyen | `modalite` (nouveau) |
| **K5** | Aucune priorisation quand tout est recommandable | **I16** | faible | **⛔ décision référent d'abord** |
| **K10** | Alerte que les cartes voisines semblent démentir | *aucun* | — | rédaction, `?REF` |

**Si vous ne faites qu'une chose : I19.** C'est le meilleur rapport de la journée, et le
seul dont un cas concret montre qu'un signal de sécurité est aujourd'hui silencieux.

---

## 2. Les fiches

### K8 → I19 — Distinguabilité des drapeaux de sécurité ⭐

**Reproduction.** Nœud RHD Activité physique.
`Frequence activite structuree = Jamais` · `Duree seance = Moins 10 min` ·
`Mode deplacement courts trajets = Motorise ou assis` · `Temps assis quotidien = Plus 8h` ·
`Fragilité` ✔ · `Limitation physique connue` ✔ · `Neuropathie ou mal perforant plantaire` ✔ ·
`Retinopathie non stabilisee ou proliferante` ✔.

**Observé.** 9 cartes, **9 badgées « Recommandée »**, en tête « Remplacer un trajet motorisé
par la marche ou le vélo » et « Suivre son nombre de pas et chercher à en faire un peu plus ».
Puis, toutes choses égales par ailleurs :

- décocher / recocher `Retinopathie non stabilisee ou proliferante` → **aucun changement**
  (mêmes 9 cartes, mêmes 2 alertes) ;
- cocher `Symptomes ischemie effort` → **aucun changement** non plus.

Un patient qui déclare des symptômes d'ischémie à l'effort reçoit exactement le même écran,
sans qu'aucune alerte ne mentionne l'ischémie.

**Pourquoi le banc est vert, et il a raison de l'être.** Vérifié dans
`content/noeuds/diabete-type-2/rhd-activite-physique.yaml`, l. 139-148 : les quatre drapeaux
alimentent un dérivé unique —

```yaml
- nom: verrou_effort
  derive: >-
    limitation_physique_connue == true OR symptomes_ischemie_effort == true
    OR retinopathie_non_stabilisee_ou_proliferante == true OR neuropathie_ou_mal_perforant_plantaire == true
```

— donc les critères **ne sont pas morts** et R5 / `couverture.test.ts` passe légitimement.
Une fois l'un des quatre vrai, les autres n'ont plus d'effet observable. Le contenu **assume
la limite** : l'alerte neuropathie écrit « L'outil retire ici la famille "pratique structurée"
dans son ensemble, faute de recueillir de quoi distinguer les pistes par segment corporel ».
Rien, dans le banc, n'affirme qu'un drapeau de sécurité doive produire une conduite **ou une
alerte** qui lui soit propre.

**Invariant I19.** Pour tout critère marqué `securite: true`, il doit exister **deux profils
identiques à ce seul critère près** dont les cartes **ou** les alertes diffèrent.

**Où l'écrire.** `src/features/decision/engine/banc/invariants.test.ts`. **La mécanique y est
déjà** : le test #6 (« à `fragilite` près, toutes choses égales par ailleurs, `fragilite=true`
ne produit jamais PLUS d'options "Agent à ajouter" ») fait exactement ce balayage
« toutes choses égales sauf un critère ». Il suffit de le généraliser et d'inverser
l'assertion (différence **exigée** au lieu de monotonie).

**Attention à la formulation.** Un dérivé en `OR` rend les drapeaux indiscernables **dès
qu'un autre est vrai**. L'invariant doit donc tester chaque drapeau **sur un profil où les
autres sont faux**, sinon il sera trivialement vert.

⚠ La conduite à tenir (faut-il trois écrans distincts ?) est une **question clinique posée
au référent** — cf. `banc-profils-consultation.md` §12. N'écrivez pas de contenu avant la
réponse ; l'invariant, lui, peut être écrit tout de suite (il échouera, c'est le but).

---

### K1 → I12 — Mécaniser R9, « savoir si le geste est déjà fait »

**Reproduction.** Nœud `Traiter : initier, optimiser, intensifier`.
`Intention = Initier un traitement` · `HbA1c actuelle = 8,1` · `Au-dessus de l'objectif` ·
`DFG = 88` · `Albuminurie = Normoalbuminurie` · `IMC = 27` · les deux sections de drapeaux
confirmées par « Rien à signaler ». **Aucun traitement coché** — et le champ « Traitements en
cours » n'est **pas affiché**, l'intention « Initier » le masque.

**Observé.** La carte **« Poursuivre le traitement en cours et réévaluer »** sort avec le
badge **« Recommandée »**, motif « Option par défaut : retenue en l'absence de toute autre
option plus spécifique applicable ». Son argumentaire affirme *« objectif atteint sans agent
iatrogène à optimiser »* — alors que « Au-dessus de l'objectif » vient d'être saisi.

**Pourquoi le banc passe.** `couverture.test.ts` exige que chaque règle **se déclenche** ; ici
elle se déclenche, c'est un succès. `invariants.test.ts` #1 ne contrôle que les `exclusions`.
Rien n'interdit à une option de repli de s'appliquer quand son présupposé est faux.

**Invariant I12.** Toute option dont l'intitulé porte un **verbe de continuation**
(`poursuivre`, `maintenir`, `continuer`, `réévaluer` employé seul) **doit déclarer un
`prerequis`** — le champ existe déjà, `couverture.test.ts` teste même que chaque expression de
`prerequis` mord sur au moins un profil.

**Où l'écrire.** `banc/grammaire.test.ts` (c'est une règle de forme sur le contenu) ou
`invariants-contenu.test.ts`. Liste de verbes en constante ; **aucun id de nœud codé en dur**
(CLAUDE.md invariant 5).

**Correctif de contenu attendu** : `prerequis` non vide sur l'option « Poursuivre le traitement
en cours et réévaluer » de `prescription.yaml`.

---

### K2 → I13 — Répondabilité : un champ visible mais inobtenable

**Reproduction A.** Nœud `Insulinothérapie`. `Situation = Basale seule` · `Âge = 64` ·
`HbA1c = 8,4` · `cible = 7` · `DFG = 70` · `Espérance = Longue` · `Risque hypo = Faible` ·
`Metformine` ✔ · `Insuline basale` ✔ · **`MCG disponible` décoché** · `Glycémie à jeun = 1,05` ·
`Poids = 95` · `Dose de basale = 60`.

**Reproduction B** (même classe, terrain plus grave). `Situation = Basal-bolus` · `Âge = 84` ·
`HbA1c = 6,8` · `cible = 8` · `DFG = 45` · `Fragilité` ✔ ·
`Hypoglycémies sévères récurrentes / non-perception` ✔ · `Espérance = Limitée` ·
`Risque hypo = Élevé` · `Insuline basale` + `Insuline rapide` ✔ · **`MCG disponible` décoché**.

**Observé.** Dans les deux cas, des options restent **en attente permanente** de `TBR`,
`TBR sévère` et `Coefficient de variation`. Le compteur « Reco provisoire » ne retombe jamais
à zéro. Un patient sans capteur ne produira jamais ces mesures.

**Pourquoi I11 passe — le point important.** `impasse.test.ts` ne flague que les critères
`enAttente` **non rendus** par `champsVisibles`. Or, dans `insuline.yaml`, `TBR`, `TBR_severe`
et `CV_glycemique` sont gardés par `visible_si: "situation_insuline != naif"`, **sans aucune
mention de `mcg_disponible`** (vérifié). Les champs *sont* affichés. I11 est donc vert et
l'impasse survit. Ce n'est pas la classe du défaut G (« champ invisible ») mais une classe
voisine : **« champ visible mais inobtenable »**.

**Invariant I13.** Introduire sur un critère une déclaration `obtenable_si` (expression),
distincte de `visible_si`. *Aucune option en attente ne réclame un critère dont `obtenable_si`
est faux dans l'état courant.*

**Où l'écrire.** `banc/impasse.test.ts` — mêmes profils partiels, même message d'échec
(nœud / option / critère / garde fautif). Contenu : `obtenable_si: "mcg_disponible == true"`
sur les trois critères d'`insuline.yaml`.

---

### K4 → I15 — Le rang des cartes ignore l'intention déclarée

**Reproduction.** Nœud `Traiter…`. `Intention = Déprescrire` · `Metformine` + `Sulfamide` ✔ ·
`HbA1c = 6,3` · `En dessous de l'objectif (sur-traitement probable)` · `DFG = 50` ·
`Normoalbuminurie` · `IMC = 24` · `Hypoglycémie récente` ✔ · `Âge = 82` · `Fragilité` ✔.

**Observé**, dans l'ordre :
1. Metformine (socle) — 2. **[Recommandée] Introduire un iSGLT2** — 3. Introduire un AR GLP-1 —
4. [Recommandée] Désintensifier… — 5. [Recommandée] Réduire la posologie du sulfamide.
**Distance mesurée : 1,51 écran** avant le premier geste de retrait. Le nœud affiche bien un
avertissement expliquant qu'un ajout peut apparaître malgré l'intention, mais il est **au-dessus**
des cartes et l'ordre reste inchangé.

**Portée exacte — à ne pas sur-généraliser.** Le rang **est** sécurité-conscient ailleurs :
à `DFG = 26` avec metformine + sulfamide, les deux cartes **« Arrêter… »** arrivent bien en tête.
Le défaut est donc **propre au chemin « Déprescrire »**, pas général.

**Pourquoi le banc passe.** Aucun test n'affirme quoi que ce soit sur l'ordre ; toutes les
assertions portent sur l'appartenance à un ensemble.

**Invariant I15.** Là où le nœud porte un critère d'intention (générique : critère `enum`
déclaré `pilote_le_rang: true`), *la première option applicable appartient à la famille
correspondant à l'intention déclarée*. La correspondance est portée par le contenu — les
familles ont déjà des libellés exploitables (« Traitement à alléger », « Agent à ajouter »).
Testable sur le moteur seul, sans DOM.

---

### K6 → I17 — Position déclarative jamais confrontée aux nombres

**Reproduction, en deux temps.**
Nœud `Fixer la cible d'HbA1c` : `Âge = 77` · `Ancienneté = 15` · `Espérance = Intermédiaire` ·
`Fragilité` ✔ → l'outil recommande **« Cible ≤ 8 % »**.
Puis nœud `Traiter…`, même patient : `Intensifier` · `Metformine` ✔ · **`HbA1c actuelle = 7,6`** ·
je déclare **« Au-dessus de l'objectif »** · `DFG = 62` · `Normoalbuminurie` · `IMC = 26` ·
`Âge = 77` · `Fragilité` ✔.

**Observé.** L'outil intensifie : **iSGLT2 et AR GLP-1 tous deux « Recommandée »**. Or 7,6 %
est *sous* la cible de 8 % qu'il vient lui-même de recommander. Il détient les deux nombres et
ne les rapproche jamais.

**Pourquoi le banc passe.** `position_vs_objectif` est un critère d'entrée comme un autre.
`coherence-inter-noeuds.test.ts` (S7) vérifie qu'un critère partagé a un **encodage** unique,
pas que les valeurs saisies soient **compatibles**.

**Invariant I17.** Quand un nœud porte à la fois une mesure et une position déclarée sur cette
mesure, la position doit être **dérivable** (`derive` existe déjà,
`src/features/decision/engine/deriveCritere.ts`) — ou l'écran doit signaler la discordance.
*Aucun profil ne porte une position déclarée contredite par la mesure et la cible disponibles.*

`?REF` **Décision référent avant implémentation** : calculer la position, ou seulement alerter ?

---

### K3 → I14 — Aucune validation croisée entre critères

**Reproduction.** Nœud `Insulinothérapie`, `Situation = Basale seule`, `MCG disponible` ✔,
puis `TBR = 1` · **`TBR sévère = 95`** · `Coefficient de variation = 60`.

**Observé.** Le temps sous 54 mg/dL est par définition **inclus** dans le temps sous 70 mg/dL :
95 % contre 1 % est impossible. L'écran l'accepte sans un mot et en tire **trois cartes
« Recommandée »**, dont « Ajouter un bolus au repas principal » — chez un patient que la saisie
décrit comme passant 95 % du temps en hypoglycémie sévère.

**Pourquoi le banc passe.** `banc/profils.ts` tire chaque critère **indépendamment** dans ses
bornes `min`/`max`. Aucune contrainte n'existe *entre* critères, ni au schéma, ni à la saisie.
Un auteur de vignettes n'écrit que des profils plausibles : la combinaison ne peut venir que de
l'écran, ou de vrais doigts en consultation.

**Invariant I14.** Ajouter au schéma de nœud une liste `contraintes` (expressions devant rester
vraies, ex. `TBR_severe <= TBR`) et l'appliquer aux **deux** bouts : refus ou alerte à la saisie,
**et** filtrage dans `genererProfils` pour que le banc ne dépense pas ses profils sur des états
impossibles. *Toute `contrainte` déclarée est violable par au moins un profil* (sinon elle est
morte) *et aucune option n'est applicable sur un profil qui la viole.*

**Où.** `schema/noeud.schema.json` + `banc/profils.ts` + `banc/invariants-contenu.test.ts`.

---

### K7 → I18 — Périmètre revendiqué mais non saisissable

**Reproduction.** Les quatre nœuds testés annoncent « hors grossesse » dans leur chapô, et
`statine` précise « statines contre-indiquées pendant la grossesse ». **Aucun n'offre de champ
pour la déclarer** — vérifié sur le formulaire rendu de `Fixer la cible`, `Insulinothérapie`,
`Prescrire une statine` : le mot n'apparaît que dans le chapô.

**Pourquoi le banc passe.** Le périmètre est du texte libre, jamais confronté aux critères
d'entrée.

**Invariant I18.** Structurer le périmètre (`hors_perimetre` en liste d'items) et vérifier que
chaque item est **soit** adossé à un critère d'entrée qui le rend saisissable, **soit**
explicitement marqué `a_la_charge_du_praticien: true`. L'invariant ne tranche pas : il rend la
décision visible au lieu de la laisser implicite.

`?REF` : la grossesse relève-t-elle du garde-fou outil ou du praticien ?

---

### K9 → I20 — La portée d'un garde-fou est la famille, pas la modalité

**Reproduction.** Même profil que K8.

**Observé.** Le verrou retire la famille **« pratique structurée »** — et le dit explicitement.
Mais deux cartes proposant de la **marche en charge** subsistent, recommandées et en première et
deuxième position, parce qu'elles appartiennent à d'autres familles (« Déplacements actifs »,
activité informelle). L'alerte, elle, restreint « marche prolongée, course ».

**Ce que je ne tranche pas** : « remplacer un trajet motorisé par la marche » relève-t-il de la
« marche prolongée » ? C'est un jugement clinique. **Ce qui est structurel** : le retrait opère
par **famille**, alors que la contre-indication porte sur une **modalité** (l'appui en charge)
qui traverse plusieurs familles.

**Invariant I20.** Introduire une `modalite` sur les options (ex. `appui_en_charge`) et permettre
à un verrou de retirer par modalité et non seulement par famille. *Aucune option ne porte une
modalité que le verrou actif retire.*

---

### K5 → I16 — Aucune priorisation quand tout est recommandable ⛔

**Reproduction.** Nœud RHD Alimentation, profil réaliste : `Metformine` ✔ ·
`boissons sucrees = Quotidien` · `ultratransformes = Frequent` ·
`restauration rapide = Occasionnel` · `Matiere grasse = Melange` · `Regularite repas = Irreguliers` ·
`grignotage = Frequent` · `Acces alimentation = Sans difficulte` · `fruits a coque = Jamais` ·
`legumineuses = Occasionnel` · `poisson = Occasionnel` · `viande rouge charcuterie = Regulier` ·
`portions = Facile` · `Alimentation emotionnelle = Jamais` · `vin = Un a six verres semaine`.

**Observé.** **10 cartes, 10 badges « Recommandée »**, sans hiérarchie — alors que le chapô du
nœud annonce un recueil bref et des pistes « négociables ».

**Invariant I16.** Déclarer par nœud un `max_recommandations_simultanees` ; vérifier qu'aucun
profil du banc ne le dépasse.

⛔ **Ne pas implémenter avant la réponse du référent** : le seuil est une décision de contenu
(combien de pistes en une consultation, et laquelle en premier ?). L'invariant ne fait que la
rendre opposable.

---

### K10 — Alerte que les cartes voisines semblent démentir (pas d'invariant)

Profil `DFG = 26` : l'alerte affiche « … l'outil s'en tient à ce qui est déclaré et **ne propose
donc pas d'ajout d'agent glycémique** », et deux cartes « Introduire… » suivent immédiatement.

**Vérifié : ce n'est PAS une contradiction logique.** Le « pourquoi » de l'iSGLT2 est
« DFG < 60 et Albuminurie ≠ Normoalbuminurie et Remplacement d'un agent sans bénéfice » — c'est
un ajout **protecteur**, pas glycémique. L'alerte dit vrai. Le constat est de **forme** : la
distinction tient au seul mot « glycémique », au milieu de cinq lignes, à un écran de deux cartes
« Introduire… ». Rien à outiller ; question de rédaction, `?REF`.

---

## 3. Ce que j'ai vérifié et qui TIENT — ne cherchez pas là

- **`prescription`, DFG 26** (85 ans, metformine + gliclazide) : « Arrêter la metformine » et
  « Arrêter le sulfamide » **en tête**, toutes deux Recommandée, avant les ajouts.
- **`prescription`, saturation** (DFG 22, insuffisance cardiaque, macroalbuminurie, infections
  génito-urinaires récidivantes, metformine + gliptine) : arrêt en tête ; iSGLT2 **affiché sans
  badge** avec son alerte ; non-association incrétine déclenchée. Trois alertes, toutes justes.
  Le principe « écarté ≠ non indiqué » est respecté.
- **`insuline`, hypoglycémies sévères** (84 ans, basal-bolus, HbA1c 6,8 pour cible 8) : **une
  seule carte**, « Désintensifier / alléger le schéma ». Aucune intensification.
- **`statine`, seuils CK** : la carte « Statine indisponible » affiche bien `CK > 5`, cohérente
  avec son texte ; les conditions en `> 4` appartiennent aux options de la bande 4-5 N. *(J'avais
  signalé une contradiction dans la recette du matin — elle était fausse, le constat a été retiré.)*

---

## 4. Deux pièges de méthode, si vous rejouez à l'écran

1. **Ne pas enchaîner plusieurs clics dans un même bloc de script.** React groupe les mises à
   jour et les sélections atterrissent sur la mauvaise valeur. Espacer d'au moins ~60 ms, ou
   cliquer un par un.
2. **Relire l'état du formulaire avant de conclure.** Les champs apparaissent et disparaissent
   selon les réponses déjà données : un repère capturé avant une case cochée peut désigner un
   autre champ après. J'ai ainsi envoyé trois valeurs dans `TBR / TBR sévère / CV` au lieu de
   `Glycémie à jeun / Poids / Dose de basale`. **Toujours relever la liste champ = valeur avant
   de lire le résultat.**

Et, plus généralement : **ne rapporter un écart qu'après l'avoir reproduit à l'écran**. Les deux
seules erreurs de ma journée viennent d'avoir transcrit une condition voisine au lieu de relire
la carte elle-même.

---

## 5. Numérotation

Les invariants existants vont jusqu'à **I11** (`banc/impasse.test.ts`). Les numéros **I12 → I20**
proposés ici sont donc libres et n'entrent en collision avec rien. Si vous en écrivez d'autres
entre-temps, prévenez : je réalignerai le banc de profils.
