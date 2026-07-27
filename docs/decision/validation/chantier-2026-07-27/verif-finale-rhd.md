# Vérification adversariale finale — module RHD et repli d'affichage

> Passe de réfutation, 2026-07-27. Périmètre : les deux nœuds RHD (`rhd-alimentation`,
> `rhd-activite-physique`), le module `rhd`, `lib/replierAffichage.ts` + son banc, et le branchement du
> repli dans `DecisionNodeScreen.tsx`. Lecture seule sur `content/**` et `src/**` ; ce fichier est le
> seul écrit. Tous les constats d'écran ci-dessous sont **exécutés**, pas déduits : `construireVueDecision`
> + `partitionnerAffichage` appelés sur le contenu réel du dépôt, c'est-à-dire exactement le couple que le
> JSX consomme (`DecisionNodeScreen.tsx:345`).

## Verdict

**Le travail clinique sur les deux nœuds RHD tient — mais le repli d'affichage qu'il a introduit est
générique, et sur le nœud `prescription` il cache derrière un bouton fermé les options d'urgence de la
famille « À faire d'emblée — sécurité », sous une unique carte « poursuivre la metformine ».**

---

# HAUTE

## H1. Le repli cache les gestes de sécurité du nœud `prescription`, parce que le socle metformine est au rang 0

**Citation contestée.**
`src/features/decision/lib/replierAffichage.ts:77-84`

```ts
const meilleur = Math.min(...rangs)
const estPrincipale = (rang: number | undefined) => rang === undefined || rang === meilleur
```

et `content/noeuds/diabete-type-2/prescription.yaml:327-330`

```yaml
- intitule: "Metformine (socle du traitement) — instaurer ou poursuivre"
  conditions: ["toujours"]
  priorite: 0
```

La docstring du module (`replierAffichage.ts:10-14`) affirme : « Il ne retire, ne filtre et ne réordonne
RIEN […] Le repli est une divulgation progressive, pas un plafond ». C'est vrai de la *partition*. Ce qui
est faux, c'est l'hypothèse implicite qu'être « au meilleur rang » et « être ce qu'il faut voir en premier »
sont la même chose.

**Ce que dit réellement le contenu.** `priorite` a été écrit sous D13/D14 comme un **ordre de tri**, jamais
comme une **porte d'affichage**. Le rang 0 du socle metformine voulait dire « en tête de liste » ; depuis le
2026-07-27 il veut dire « seule chose visible ». Or la famille des garde-fous d'urgence s'appelle
littéralement « À faire d'emblée — sécurité » et ses options sont au rang **1** : arrêter la metformine sous
DFG 30, arrêter le sulfamide sous DFG 30, suspendre l'iSGLT2 sur cétonémie, insuline d'initiation en
catabolisme. Toutes passent donc systématiquement **derrière** le socle.

**Contre-exemple reproduit, profil réaliste.** DT2 58 ans, metformine + iSGLT2, DFG 75, HbA1c 8,8 %,
IMC 33, ASCVD établie, **cétonémie confirmée** :

| | |
|---|---|
| **Carte(s) dépliée(s)** | « Metformine (socle du traitement) — instaurer ou poursuivre » |
| **Bouton** | « Autres pistes possibles (3) » |
| **Repliées** | « **Suspendre l'iSGLT2 (cétonémie confirmée — suspicion d'acidocétose euglycémique)** » · « Insuline d'initiation (souvent transitoire — état catabolique) » · « Introduire le tirzépatide » |

Second contre-exemple, tout aussi banal en consultation. 72 ans, metformine + sulfamide, **hypoglycémie
récente**, DFG 55, à l'objectif : une seule carte dépliée (le socle metformine), et derrière « Autres pistes
possibles (4) » : « Désintensifier : alléger / arrêter le sulfamide, le glinide ou réduire l'insuline »,
« Réduire la posologie du sulfamide », plus les deux introductions d'agents protecteurs.

**Quantification** (banc du dépôt, `genererProfils(prescription, 1200)`) :

- 955 / 1200 profils déclenchent un repli ;
- **463 (39 %) où la SEULE carte dépliée est le socle metformine** ;
- **239 (20 %) où le repli contient la famille « À faire d'emblée — sécurité »**.

Sur un tirage de 600 profils, comptage par option repliée : « Réduire la posologie de l'insuline
(sur-basalisation / hypoglycémie) » 100 fois, « Insuline d'initiation » 78, « **Suspendre l'iSGLT2
(cétonémie)** » 60, « Réduire la posologie de la metformine (fonction rénale altérée) » 40.

**Impact clinique.** L'acidocétose euglycémique sous gliflozine est précisément le tableau que le contenu
qualifie lui-même de « PRIORITÉ ABSOLUE DU LOT » (`prescription.yaml:446`), et dont l'`avantages` rappelle
que « la glycémie peut rester proche de la normale, ce qui retarde le diagnostic ». Le prescripteur voit
« poursuivre la metformine » et doit cliquer pour découvrir « suspendre l'iSGLT2 ». Le geste le moins urgent
de l'écran est le seul affiché.

**Aggravant.** Le module est générique — c'est bien —, mais aucun contenu du domaine n'a été relu à l'aune
de la nouvelle sémantique du rang. La note `incertitudes` recopiée à l'identique dans les deux nœuds RHD
(`rhd-alimentation.yaml:646`, `rhd-activite-physique.yaml:490`) énumère trois cas de non-repli et n'envisage
nulle part qu'un contenu puisse déclarer un rang **meilleur** que celui de ses propres garde-fous.

**Pistes de correction, à arbitrer par le référent** (aucune n'est appliquée ici) : ne jamais replier une
option portant une `alerte` active ou appartenant à une famille déclarée de sécurité ; ou calculer le
meilleur rang sur les options **actionnables** en excluant les sentinelles `["toujours"]` ; ou remonter le
socle metformine d'un rang. Le choix est clinique, pas technique.

## H2. Une alerte d'OPTION disparaît avec l'option repliée

**Citation contestée.** `src/features/decision/lib/vueDecision.ts:271` attache les alertes à l'`OptionVue` ;
`DecisionNodeScreen.tsx:350-360` rend les options repliées **à l'intérieur** d'un `<details>` fermé par
défaut. Les alertes de NŒUD (`AlertList`, ligne 262) sont hors du repli — elles restent visibles. Les
alertes d'OPTION, non.

**Ce que dit réellement le contenu.** Ces alertes ont été créées précisément pour porter un fait de sécurité
sur le canal correct, « puisqu'elle ne vaut que si ce geste est effectivement proposé (D21) »
(`prescription.yaml:916-919`). Le geste reste proposé ; l'alerte devient invisible.

**Mesuré** (600 profils) :

- `prescription` — « Réduire la posologie du glinide » repliée **147 fois avec son alerte active** :
  « Insuffisance rénale sévère : l'exposition au répaglinide et sa demi-vie DOUBLENT (ASC ×2 mesurée entre
  20 et 39 ml/min, RCP rubrique 5.2) […] renforcer la surveillance des hypoglycémies » (`:920-928`) ;
- `rhd-activite-physique` — « Envisager un programme d'activité physique adaptée » repliée **18 fois avec
  son alerte active** : « Une évaluation médicale minimale est recommandée avant de commencer […] glycémie
  très élevée (seuil de vigilance cité par la HAS : 2,5 g/L) » (`:267-275`) ;
- `prescription` — « Introduire un AR GLP-1 » repliée 3 fois avec son alerte « Chez un sujet fragile,
  surveiller le poids et l'état nutritionnel […] risque de sarcopénie / anorexie » (`:593-598`).

**Impact clinique.** Une information de sécurité rattachée à un geste devient invisible alors que le geste,
lui, est proposé — l'exact inverse de l'intention de D21.

---

# MOYENNE

## M1. « Une option SANS rang est traitée comme prioritaire (jamais repliée) » est faux sur contenu réel

**Citation contestée.** `replierAffichage.ts:78-81` : « Une option SANS rang est traitée comme prioritaire
(jamais repliée) : c'est le sens sûr du doute. » Et `vueDecision.ts:121-122` : « `undefined` quand l'option
n'a pas de `priorite` ».

**Ce que dit réellement le code.** `resolvePriorite` (`engine/evaluateNode.ts:545`) renvoie **`+Infinity`**,
pas `undefined`, pour une option sans `priorite` : « absente → rang le plus faible (`+Infinity`, placée en
dernier) ». `rangs.get(option)` vaut donc un `number`, qui passe le filtre `typeof r === 'number'` et échoue
sur `rang === meilleur`.

Mesuré sur 200 profils par nœud (`OptionVue.rang`) :

| nœud | `undefined` | `+Infinity` | fini |
|---|---|---|---|
| `rhd-alimentation` | **0** | 25 | 1684 |
| `rhd-activite-physique` | **0** | 24 | 1205 |
| `prescription` | **0** | 2 | 999 |
| `cible-glycemique` / `statine` (ordered-first-match) | 600 / 200 | 0 | 0 |

`undefined` n'apparaît **que** sur les nœuds `ordered-first-match`, où le repli est de toute façon désactivé
par le second cas de non-repli. Conséquence : sur un nœud `multi-options`, une option sans `priorite` n'est
pas protégée — elle est **la première repliée**. Constaté : « Continuer ce qui fonctionne déjà » repliée
65/600, « Poursuivre les habitudes actuelles… » 63/600.

**Impact.** Les deux options concernées sont cliniquement bénignes (renforcement positif), donc l'effet
observable aujourd'hui est nul. Le filet, lui, n'existe pas : le test `replierAffichage.test.ts:96-103`
(« traite une option SANS rang comme prioritaire — le doute ne cache jamais ») verrouille un état que le
pipeline réel ne produit jamais sur un nœud multi-options. Il passe pour la mauvaise raison, exactement le
défaut que le commentaire du test `:54-58` dit avoir déjà corrigé une fois.

## M2. Le champ `argumentaire` du nœud alimentation contient une phrase cassée — et n'est affiché nulle part

**Citation contestée.** `content/noeuds/diabete-type-2/rhd-alimentation.yaml:532-539` :

> « … et un seul geste chiffré depuis réécrit sur les repères de Santé publique France. **que la HAS cite
> elle-même comme mesure d'accompagnement du trouble du comportement alimentaire.** La fragilité/dénutrition
> (un IMC élevé ne l'exclut pas) bloque **les mêmes** pistes restrictives, indépendamment du repérage TCA. »

**Ce que dit réellement l'historique.** `git show 2009f18 -- …/rhd-alimentation.yaml` montre la substitution :
l'antécédent (« … et laisse passer les substitutions qualitatives et la régularité des repas, ») a été
supprimé et sa subordonnée est restée orpheline. « les mêmes pistes restrictives » ne renvoie plus à rien
non plus, le verrou TCA n'en bloquant aucune ; et c'est en outre inexact — `fragilite` n'exclut que **deux**
options sur seize.

**Atténuation, qui est elle-même un finding.** `Noeud.argumentaire` **n'est rendu par aucun composant** :
grep exhaustif sur `src/**` — les seules occurrences hors types/fixtures sont des libellés de bouton et des
commentaires. Le message du commit 2009f18 affirme pourtant « Les trois argumentaires SYNTHÉTIQUES (**ceux
que la carte affiche**) sont repris en conséquence ». La carte ne les affiche pas. Le champ est un canal
mort, obligatoire au schéma (`schema/noeud.schema.json:15,48`), jamais lu par l'écran.

## M3. L'argumentaire exhaustif — celui-là bien affiché — affirme encore, en tête, l'ancien comportement

**Citation contestée.** `content/noeuds/diabete-type-2/rhd-alimentation.argumentaire.md:24-26`, section
« En bref » :

> « **Deux garde-fous durs** : le repérage d'un trouble du comportement alimentaire (3 signes HAS) et la
> fragilité/dénutrition **bloquent les pistes de réduction et de quantification** ; l'hypoglycémie sous
> insulinosécréteur reste une alerte, jamais un blocage. »

**Ce que dit le même document 156 lignes plus bas** (`:180`) : « **CE VERROU NE BLOQUE PLUS RIEN DEPUIS LE
2026-07-27 — il ORIENTE.** » Et le titre de la section qui l'introduit (`:167`) dit encore « ### Repérage
d'un trouble du comportement alimentaire (**verrou dur**) ». « et de quantification » est également mort :
la seule piste de quantification (pesée) a été supprimée la veille.

**Impact clinique.** Ce fichier **est** rendu dans l'application (niveau de lecture 3,
`ArgumentPanel.tsx:33-35` via `getArgumentaireExhaustif`). Un lecteur qui s'arrête au « En bref » — c'est
son rôle — repart avec l'inverse du comportement réel : il croit qu'un signe d'appel de TCA protège son
patient de pistes de réduction. Il ne le protège plus.

## M4. Le tableau de provenance des pistes liste une piste supprimée et omet la piste ajoutée

**Citation contestée.** `rhd-alimentation.argumentaire.md:132` :
`| Peser 2-3 fois | Portions | Savoir-faire diététique (non EBM) | SFD/AFDN, rapport groupe de travail glucides |`

**Ce que dit le nœud.** La piste de pesée a été **supprimée** le 2026-07-27 (`rhd-alimentation.yaml:411-416`,
changelog `:730-738`). Symétriquement, le tableau **n'inclut pas** l'option ajoutée le même jour, « Proposer
aussi un avis spécialisé en trouble du comportement alimentaire » (`:467`). Le tableau compte 16 lignes et
le nœud 16 options — mais ce ne sont pas les mêmes seize.

## M5. Un renvoi « voir l'écarté correspondant » pointe vers un écarté qui n'existe plus — et la carte se contredit elle-même

**Citation contestée.** `rhd-alimentation.yaml:407`, `inconvenients` de « Repérer un moment de grignotage
récurrent et lui trouver une alternative » :

> « **C'est un geste de réduction** : le grignotage peut être le seul espace de spontanéité alimentaire d'un
> patient déjà très contrôlant — **à ne jamais proposer isolément** en cas de repérage positif de trouble du
> comportement alimentaire (**voir l'écarté correspondant**). »

**Ce que dit réellement le nœud.** Cette option n'a plus aucune exclusion (`exclusions: []`, `:402`) : elle
ne peut donc plus **jamais** figurer dans `vue.ecartees`. Le renvoi envoie le prescripteur vers un bloc vide.
Pire, la même phrase contredit frontalement la justification du retrait, dans le même fichier — changelog
`:677-681` et `incertitudes` `:642` : « (a) « repérer un moment de grignotage et lui trouver une ALTERNATIVE »
est une substitution, **rien n'y est retiré ni chiffré** ». L'un des deux énoncés est faux ; le contenu ne
tranche pas.

**Impact clinique.** C'est le seul endroit du nœud qui reconnaît qu'une piste reste délicate chez un patient
repéré positif — et il renvoie à un mécanisme démonté.

## M6. `fragilite` n'a pas été porté sur toutes les pistes qui réduisent l'apport, alors que c'est le critère explicitement retenu

**Ce que dit le nœud.** `rhd-alimentation.yaml:42-46` justifie le maintien de `fragilite` par un motif
strictement nutritionnel : « réduire la viande retire une source de protéines, déplacer la part relative de
l'assiette vers les légumes réduit l'apport énergétique ». Appliqué, ce critère devrait couvrir trois autres
options — qui n'ont pas d'exclusion `fragilite` :

| option | ce que le nœud en dit lui-même |
|---|---|
| « Repérer un moment de grignotage… » (`:394`) | `inconvenients` `:407` : « **C'est un geste de réduction** » ; `avantages` : substituts « fruit, eau, activité » |
| « En restauration rapide, choisir mieux… » (`:257`) | `effet_attendu` `:267` : « **Réduit la densité énergétique du repas** » |
| « Remplacer une boisson sucrée du quotidien par de l'eau » (`:214`) | `effet_attendu` : « Réduction de l'apport en sucres rapides » |

**Atténuation réelle, mais accidentelle.** `fragilite == true` fait passer « Orienter vers le diététicien »
au rang 1 (`:445-446`), ce qui, par l'effet du nouveau repli, replie de fait les pistes de rang 3-4. C'est
un effet de bord d'affichage, pas un garde-fou : il disparaîtrait si le repli était retiré ou si une piste
de rang 1 s'ajoutait. Et contrairement à son nœud sœur (`rhd-activite-physique.yaml:378-383`, alerte
« Sujet fragile »), le nœud alimentation ne porte **aucune alerte de nœud** sur `fragilite`.

*Note de méthode :* la formule du changelog « `fragilite` est MAINTENU **partout où il était** » est
littéralement exacte — vérifié sur `git show f6d36fe`, l'option grignotage ne portait que `verrou_tca`. Le
finding ne porte pas sur une régression, mais sur une lacune préexistante que le retrait du verrou TCA rend
visible : c'est bien un patient qui a été découvert.

## M7. Cinq options RHD portent `niveau_preuve: modere` alors qu'elles nient elles-mêmes l'existence d'un essai

**Ce que dit la décision référent** (2026-07-27, appliquée le jour même à `prescription.yaml` et à
`statine.yaml`) : « le niveau de preuve doit refléter la CERTITUDE DE LA PREUVE, c'est l'intérêt d'un outil
EBM et pas d'un listing de recos officielles ». Cinq options de `prescription` sont passées de `eleve` à
`faible` sur ce motif. Les nœuds RHD n'ont pas été repassés :

| fichier:ligne | option | ce que l'option dit d'elle-même |
|---|---|---|
| `rhd-alimentation.yaml:228` | Boisson sucrée → eau | « **Pas de bénéfice cardiovasculaire dur démontré pour ce geste isolé** » |
| `rhd-alimentation.yaml:268` | Restauration rapide, choisir mieux | ancrage = « guide EBM européen (**grade A/B**) » — force de recommandation |
| `rhd-activite-physique.yaml:229` | Mouvement dans les tâches déjà présentes | ancrage = « **grade A**, triple référence » ; bénéfice « pas sur un critère cardiovasculaire dur » |
| `rhd-activite-physique.yaml:244` | Séances courtes réparties | « Repère de composition d'un programme, **pas un essai contrôlé** » |
| `rhd-activite-physique.yaml:297` | Maintenir/diversifier la pratique | « **Pas de bénéfice cardiovasculaire dur propre à l'exercice à revendiquer** » |

Au sens GRADE, `modere` signifie « certitude modérée : l'effet vrai est probablement proche de l'estimation ».
Il n'y a pas d'estimation. Les cinq devraient être `faible`, voire `tres_faible`.

**Corollaire à signaler.** Ces cinq options sont exactement celles que I8c a forcées à déclarer des
`references` — et les références déclarées (`has-guide-ap`, `duodecim-ap`, `spf-50-astuces`,
`has-dt2-nutrition`, `has-obesite-alim`) sont toutes de `type_critere: substitution`, aucune n'est un essai.
I8c est donc **satisfait** tout en étant contourné dans son intention : citer une recommandation suffit à
adosser une revendication de certitude. L'invariant vérifie l'adossement, pas sa nature — ce qu'il déclare
d'ailleurs honnêtement (`invariants-contenu.test.ts:258-262`), mais l'effet mérite d'être nommé.

## M8. La seule guidance de proportion d'assiette du corpus du nœud dit autre chose que l'option

**Citation contestée.** `rhd-alimentation.yaml:431`, `avantages` de « Se repérer aux proportions dans
l'assiette » : « Raisonner en PART RELATIVE de l'assiette — **la place des légumes par rapport à celle des
féculents et de l'aliment protidique** ». Et `incertitudes` `:645` : « le dossier de preuve de ce nœud ne
source aucun ratio […] guides Manger-Bouger / HAS déjà au dossier du module, **non dépouillés sur ce point
précis** ».

**Ce que dit réellement la source.** `docs/decision/sources/manger bouger reco.pdf` p.20, astuce 28 — document
**déjà** cité par le nœud sous l'id `spf-50-astuces` : « Dans votre assiette, donnez la part belle aux légumes
**et aux féculents et légumes secs** par rapport à **la viande**. » SPF regroupe légumes *et* féculents d'un
côté, contre la viande. Le nœud oppose les légumes **aux** féculents. Ce n'est pas la même partition, et le
sens du geste s'inverse pour les féculents.

**Impact.** L'option est le seul « repère » du nœud qui ne s'appuie sur aucune source déclarée
(`references` absent), et le point que l'incertitude dit non dépouillé est dépouillable en une page — dans
un document déjà présent, déjà cité. C'est aussi l'option dont le garde-fou TCA a été retiré au motif qu'elle
n'était qu'un « repère qualitatif ». Un repère qualitatif reste une **règle alimentaire externe**, ce que la
littérature TCA décrit comme un facteur d'entretien de la restriction cognitive : à signaler au référent,
je ne tranche pas.

## M9. « Préférer la volaille » a été retiré sur la seule foi de l'affiche, alors que deux sources du même dossier le portent

**Citation contestée.** `rhd-alimentation.yaml:302-303` : « « préférer la volaille » disparaît aussi :
l'affiche ne la recommande **PAS** — elle se contente de ne pas la faire figurer dans la liste à réduire.
Absence d'une liste ≠ recommandation positive. »

**Ce que dit réellement le corpus.** Le raisonnement est **exact sur l'affiche** (vérifié : la volaille n'y
figure dans aucune des trois colonnes). Mais deux sources déjà au dossier du nœud portent la préférence :

- `manger bouger reco.pdf` p.24, encadré « Réduire la charcuterie » — même émetteur, source déjà déclarée
  sous `spf-50-astuces` : « Parmi ces aliments, **privilégiez le jambon blanc et le jambon de volaille**. » ;
- **MEDAS item #13**, le cadre de définition que le nœud revendique, reproduit dans son propre argumentaire
  (`rhd-alimentation.argumentaire.md:89`) : « Préférence **volaille/dinde/lapin** plutôt que
  veau/porc/bœuf/charcuterie ? ».

**Impact.** Le retrait peut rester le bon choix éditorial (l'ancien intitulé mélangeait bien deux directions).
La **justification écrite**, elle, généralise d'une source unique en ignorant deux sources du même dossier
qui disent l'inverse — et c'est cette justification qui sera relue par le référent.

---

# BASSE

**B1 — « viande rouge » est un qualificatif que la source n'emploie pas.** `rhd-alimentation.yaml:308` :
« Réduire la charcuterie et **la viande rouge** (porc, bœuf, veau, mouton, agneau, abats) ». L'affiche écrit
« **La viande** : porc, bœuf, veau, mouton, agneau, abats ». L'énumération est reprise mot pour mot — bon
point — mais l'étiquette « rouge » est ajoutée, et elle s'applique mal à deux items de la liste (veau, abats).
Les `avantages` (`:321`), eux, citent correctement « la viande ». Impact clinique nul.

**B2 — la fiche de la nouvelle source omet le quatrième bloc de l'affiche.** `rhd-alimentation.yaml:596`
décrit « **Trois colonnes** de DIRECTIONS, sans aucune quantité ». L'affiche porte un quatrième encadré,
séparé : « **L'alcool** — À réduire pour les adultes. Pour les femmes enceintes, les enfants et les ados :
zéro alcool. » Le nœud recueille bien le vin, mais son seuil d'alerte (≥ 7 verres/semaine, `:508-514`) est
repris du **score MEDAS** (adhérence méditerranéenne), pas du repère français — disponible dans le même
dossier (`manger bouger reco.pdf` p.19 : « limiter sa consommation d'alcool à 2 verres maximum par jour et
pas tous les jours »). L'alerte parle de « mésusage » en se déclenchant **en dessous** du repère officiel
français (10 verres/semaine).

**B3 — l'énumération `consommation_vin` plafonne.** `rhd-alimentation.yaml:211` : un patient à 7 verres par
semaine et un patient à 30 sont indiscernables pour le nœud et reçoivent le même message.

**B4 — `exclusions: []` est une syntaxe morte laissée comme marqueur.** `rhd-alimentation.yaml:402`. Sans
effet moteur (`.some()` sur tableau vide = `false` ; le schéma ne pose pas de `minItems`) — à ne pas
confondre avec l'exclusion vide `[""]` qui, elle, lève `ConditionError`
(`engine/evaluateNode.p2.test.ts:230`). Cosmétique, mais c'est la trace visible d'un garde-fou retiré.

**B5 — le commentaire CSS du repli affirme une capacité navigateur non universelle.**
`src/features/decision/screens/DecisionNodeScreen.css:238-241` : « Le `<details>` natif porte l'accessibilité
(clavier, lecteur d'écran, **Ctrl+F du navigateur qui déplie automatiquement**) ». L'auto-dépliage de
`<details>` à la recherche dans la page est un comportement Chromium récent ; Firefox et Safari ne
l'implémentent pas. Un praticien sous Firefox qui cherche « iSGLT2 » dans la page ne trouvera pas une carte
repliée — ce qui aggrave H1 sur ces navigateurs.

**B6 — commentaires restés au vocabulaire d'avant.** `rhd-alimentation.yaml:168` : « Verrou — repérage
**avant de proposer une réduction ou une pesée** » (la pesée n'existe plus, et le verrou ne précède plus
rien). Et `:378`, dans un `avantages` **affiché au prescripteur** : « cette piste n'est donc **PAS bloquée
par le verrou de repérage** » — littéralement vrai, mais implique par contraste que d'autres le sont, ce qui
n'est plus le cas depuis ce lot.

**B7 — aucun test d'écran ne couvre le repli.** `partitionnerAffichage` est testé à part (8 tests, sur
fixtures synthétiques) ; aucun test de `DecisionNodeScreen` ne rend le bouton « Autres pistes possibles »
avec du contenu réel (grep sur `src/features/decision/screens/*.test.tsx`). H1 et H2 sont précisément des
défauts de la composition contenu × module, pas du module seul.

---

# E — Les vignettes

**Constat : les deux nœuds RHD n'ont AUCUNE vignette exécutable.**

Le dépôt porte des bancs de vignettes cliniques pour quatre nœuds — `evaluateNode.prescription.test.ts`,
`evaluateNode.insuline.test.ts`, `evaluateNode.statine.test.ts`, et les vignettes de `cible-glycemique`
dans `evaluateNode.test.ts`. Il n'existe ni `evaluateNode.rhd-alimentation.test.ts` ni équivalent pour
l'activité physique (`ls src/features/decision/engine/`). Le document de relecture clinique
`docs/decision/validation/chantier-2026-07-26/vignettes-existantes-a-valider.md` déclare lui-même son
périmètre : « nœuds `prescription` et `cible-glycémique` ».

Ce qui couvre donc les deux nœuds RHD :

- **couverture** (`banc/couverture.test.ts`) — chaque règle se déclenche au moins une fois sur un
  échantillon stratifié. Mécanique, aucune relecture clinique.
- **invariants** génériques (`banc/invariants.test.ts`, `invariants-contenu.test.ts`).
- **caractérisation** — golden master textuel (`__snapshots__/caracterisation.rhd-*.txt`), qui verrouille
  un **texte de sortie**, jamais un **jugement clinique** : il détecte qu'une sortie a changé, jamais
  qu'elle est fausse.

Aucun profil-patient nommé, aucune assertion du type « ce patient-là doit voir cette option-là ». C'est
cohérent avec la façon dont le lot du 2026-07-27 mesure son propre impact — « 124 profils sur 180 changent »
(`rhd-alimentation.yaml:698`) —, c'est-à-dire en **volume de diff**, pas en comportement attendu. Rien
dans ce dispositif n'aurait pu détecter M5, M6 ou H1.

---

# CE QUI EST CONFIRMÉ

1. **Rien ne se perd — vérifié sur contenu réel, pas seulement sur fixtures.** 6 nœuds × 600 profils
   = 3 600 partitions : `principales ∪ repliees` redonne exactement l'entrée (mêmes intitulés, même
   cardinalité), **0 écart**. Et `nbRepliees` égale toujours le nombre exact d'options repliées : le
   compteur du bouton ne ment jamais.
2. **Les trois cas de non-repli sont corrects.** `< SEUIL_REPLI` → rien ; `rangs.length === 0` → rien
   (mesuré : seuls `cible-glycemique` et `statine`, en `ordered-first-match`, y tombent — 0 repli sur
   1 200 profils) ; toutes au même rang → `repliees` vide → retour au cas « rien », y compris son
   `principales` d'origine par référence.
3. **`replierAffichage.ts` est réellement générique** (invariant CLAUDE.md 5) : relu ligne à ligne, aucun
   id de nœud, aucun nom de domaine, aucun libellé de famille, aucun nom de critère. Le seul paramètre
   clinique est le rang, que le contenu déclare.
4. **Les trois registres de sécurité de l'écran sont hors du repli** : les alertes de NŒUD (`AlertList`,
   `DecisionNodeScreen.tsx:262`), les options ÉCARTÉES par une exclusion (`:389-397`, R4) et les options
   EN ATTENTE (`:373-385`, D20) sont rendus en dehors du `<details>`. Le repli ne peut pas les cacher.
   (H2 ne concerne que les alertes d'OPTION, qui voyagent avec leur carte.)
5. **Le verrou TCA ne conditionne plus que les deux options d'orientation.** Vérifié exhaustivement :
   `verrou_tca` n'apparaît hors commentaires qu'aux lignes 441 (condition diététicien), 443 (règle de rang)
   et 469 (condition avis spécialisé). Aucune `exclusion` du nœud ne le mentionne.
6. **Les deux orientations sont au rang 1 quand le verrou est positif — donc jamais repliées.** Profil
   exécuté (signe de craquage positif, habitudes défavorables sur tous les axes) : dépliées = huile d'olive,
   fruits à coque, « Orienter vers le diététicien », « Proposer aussi un avis spécialisé en TCA » ; 10 pistes
   repliées. Le patient repéré positif voit bien ses deux orientations en premier.
7. **`fragilite` a bien été maintenu partout où il existait.** `git show f6d36fe` : deux occurrences
   `"verrou_tca == true OR fragilite == true"` → `"fragilite == true"` (viande/charcuterie, proportions),
   et la troisième option (grignotage) ne portait que `verrou_tca`. Le changelog est littéralement exact.
   (Voir M6 pour la lacune préexistante que cela révèle.)
8. **Fidélité à Manger-Bouger — les trois points centraux sont justes.** PDF ouvert
   (`4DDK001_400x600_50PC_AFF_reco chaque petit pas compte_E2_VDEF.pdf`, DT05-177-24A) : la colonne
   « Réduire ↘ » porte bien **deux lignes distinctes** — « La charcuterie » et « La viande : porc, bœuf,
   veau, mouton, agneau, abats » ; les produits laitiers sont bien en « Aller vers ↗ » sous « Une
   consommation de produits laitiers suffisante mais limitée » ; la volaille ne figure dans **aucune**
   des trois colonnes ; et l'affiche **ne porte aucune quantité**. Les trois retraits (fromage, chiffre,
   volaille) sont chacun fondés sur l'affiche.
9. **Le retrait du fromage est même doublement fondé.** Le second document SPF du dossier
   (`manger bouger reco.pdf` p.6) va plus loin que l'affiche : « Vous aimez le fromage ? Ça tombe bien. Au
   petit déjeuner, un morceau de fromage, un yaourt ou un peu de lait font très bien l'affaire », sous le
   bandeau « Aller vers une consommation de produits laitiers suffisante mais limitée ». Le fromage était
   bien dans la mauvaise colonne.
10. **Aucune quantité chiffrée n'a été réintroduite dans les 16 options du nœud alimentation** — relu sur
    `intitule`, `avantages`, `inconvenients` et `effet_attendu` (aucun chiffre hors `priorite` et ids de
    référence). Le seul repère quantitatif cité, « une petite poignée par jour » (fruits à coque, `:339`),
    est (a) non numérique, (b) explicitement encadré comme « cité ici comme ce qui a été recommandé — pas
    comme un objectif à atteindre pour ce patient », et (c) **exact** : `manger bouger reco.pdf` p.19,
    « Il est recommandé de consommer une petite poignée par jour de fruits à coque non salés ». La seule
    mention résiduelle de pesée apparaît dans un intitulé qui la **récuse** (« plutôt qu'aux quantités
    pesées »).
11. **Aucune autre piste du nœud ne contredit l'affiche.** Fait maison, légumes secs et fruits à coque vont
    dans le sens d'« Augmenter » ; poisson gras/maigre en alternance et huiles colza-noix-olive dans celui
    d'« Aller vers » (l'option huile d'olive nomme d'ailleurs explicitement le colza comme choix légitime,
    `:280`) ; boissons sucrées dans celui de « Réduire ». Sept pistes vérifiées une à une, zéro
    contradiction.
12. **Aucun item de questionnaire de repérage n'est reproduit** (SCOFF, EDE-Q, BES) : les trois signes du
    verrou sont des reformulations en style consultation à partir de l'encadré 11 du guide HAS, et
    l'argumentaire nomme les instruments (SCOFF-F, Expali™, BES française) avec leurs métriques publiées
    sans en citer un seul item. Invariant droit d'auteur respecté.
13. **La suite est verte au moment de l'audit** : 550 tests passés, 6 ignorés, 28 fichiers, `vitest run`.
    Aucun des findings ci-dessus n'est détecté par un test existant.

---

# CE QUE JE N'AI PAS PU VÉRIFIER

- **Le rendu réel dans un navigateur.** Invariant du projet : la validation visuelle est humaine, jamais
  Playwright. Tous les constats d'écran de ce rapport sont obtenus en exécutant `construireVueDecision` +
  `partitionnerAffichage` sur le contenu réel — le couple exact que consomme le JSX
  (`DecisionNodeScreen.tsx:345`) — mais je n'ai pas monté le rendu React. **À confirmer visuellement par
  le référent** : la capture de H1 (patient cétonémique sous iSGLT2 → une seule carte « poursuivre la
  metformine »).
- **Le grade GRADE réel des recommandations HAS et EBM Guidelines/Duodecim** citées par M7. Je constate la
  confusion force-de-recommandation / certitude sur la foi des textes du dépôt (les `inconvenients` des
  options elles-mêmes, qui nient l'essai), sans avoir ouvert le texte intégral de Duodecim — sous
  abonnement, absent du dépôt.
- **L'année de l'affiche Manger-Bouger** (`annee: 2024`, `rhd-alimentation.yaml:597`) : le PDF ne porte pas
  de date, seulement la référence « DT05-177-24A ». 2024 est une déduction du suffixe, raisonnable mais non
  établie.
- **PREDIMED / CORDIOPREV et le sous-groupe diabétique** : hors périmètre de cette passe, et déjà signalés
  comme non vérifiables en primaire par l'argumentaire lui-même (`rhd-alimentation.argumentaire.md:41-43`).
- **L'arbitrage de H1 lui-même.** Je constate la collision entre une sémantique de tri et une sémantique
  d'affichage, et je la documente ; le choix de la résoudre côté contenu (rang du socle metformine) ou côté
  module (ne jamais replier une option portant une alerte active / une famille de sécurité ; ou calculer le
  meilleur rang en ignorant les sentinelles `["toujours"]`) est un arbitrage clinique qui revient au
  référent.
- **`.tmp-audit/analyse.mjs`**, non suivi par git, apparu pendant ma session (13:39) : il n'est pas de moi.
  Ni lu, ni supprimé, ni évalué.

---

# Sources

**Contenu et code du dépôt** (chemins relatifs à la racine `ebm-msp`)

- `content/noeuds/diabete-type-2/rhd-alimentation.yaml` · `.argumentaire.md`
- `content/noeuds/diabete-type-2/rhd-activite-physique.yaml` · `.argumentaire.md`
- `content/modules/diabete-type-2/rhd.yaml`
- `content/noeuds/diabete-type-2/prescription.yaml` (H1, H2)
- `schema/noeud.schema.json`
- `src/features/decision/lib/replierAffichage.ts` · `replierAffichage.test.ts`
- `src/features/decision/lib/vueDecision.ts`
- `src/features/decision/engine/evaluateNode.ts` (`resolvePriorite`, M1)
- `src/features/decision/engine/evaluateNode.p2.test.ts` (B4)
- `src/features/decision/engine/banc/profils.ts` · `couverture.test.ts` · `invariants-contenu.test.ts`
- `src/features/decision/screens/DecisionNodeScreen.tsx` · `DecisionNodeScreen.css`
- `src/features/decision/components/ArgumentPanel.tsx`
- Commits relus : `f6d36fe` (verrou TCA → orientation, piste viande, repli), `2009f18` (argumentaires,
  niveau de preuve = certitude), `9c6f273` (base consolidée, I8)

**Sources primaires ouvertes pour cette passe**

- Santé publique France / Manger-Bouger, affiche « Pour un mode de vie plus équilibré, chaque petit pas
  compte », réf. DT05-177-24A —
  `docs/decision/sources/4DDK001_400x600_50PC_AFF_reco chaque petit pas compte_E2_VDEF.pdf` (page unique,
  lue intégralement)
- Santé publique France / Manger-Bouger, « 50 petites astuces pour manger mieux et bouger plus » —
  `docs/decision/sources/manger bouger reco.pdf`, pages 1-6 et 19-24 (astuce 26 fruits à coque, astuce 28
  proportions dans l'assiette, astuce 33 ultratransformés, encadrés « Réduire l'alcool », « Augmenter les
  fruits à coque », « Réduire la charcuterie », « Aller vers une consommation de produits laitiers
  suffisante mais limitée »)

**Rapports du chantier relus (non modifiés)**

- `docs/decision/validation/chantier-2026-07-27/preuve-repérage-tca.md`
- `docs/decision/validation/chantier-2026-07-27/redteam-repérage-tca.md`
- `docs/decision/validation/chantier-2026-07-26/vignettes-existantes-a-valider.md` (périmètre, finding E)

**Méthode de mesure.** Les chiffres de H1, H2 et M1 proviennent d'un fichier de test temporaire placé à la
racine du dépôt, exécuté par `vitest`, puis **supprimé** — il importait `loadNodes`, `construireVueDecision`,
`partitionnerAffichage` et `genererProfils` sans rien modifier. `git status` est propre au terme de cette
passe, à l'exception de ce rapport et du `.tmp-audit/` qui n'est pas de moi.
