# Plan de correction consolidé — chantier 2026-07-27

> **Rôle** : source unique de vérité pour la suite du chantier. Agrège les **cinq** rapports du jour en
> un inventaire **par cause racine**, et en tire un plan de livraison.
> **Ne remplace aucun rapport** : chacun reste la référence de son propre détail. Ce document décide
> seulement de **ce qu'on corrige, dans quel ordre, et à quel niveau**.
>
> **Sources agrégées** (38 constats)
> | rapport | constats |
> |---|---|
> | `recette-ui.md` — recette référent sur le déployé | 16 (A→P) |
> | `verif-finale-statine.md` — passe adversariale | 4 (H1→H4) |
> | `verif-finale-prescription.md` — passe adversariale | 8 |
> | `verif-finale-rhd.md` — passe adversariale | 5 |
> | `verif-finale-transverse.md` — passe adversariale | 5 |
>
> **Principe directeur, posé par le référent** : *pas de correctif atomique quand il ne ferait que
> masquer un défaut.* Appliqué ici sous une forme opposable — pour chaque constat, la question n'est pas
> « comment le faire disparaître » mais **« quel mécanisme aurait dû l'attraper, et pourquoi ne l'a-t-il
> pas fait ? »**. Quand ce mécanisme n'existe pas, c'est lui le livrable ; le constat n'en est que le
> premier cas de test.

---

## 0. Ce que la consolidation change

Pris séparément, les cinq rapports donnent 38 corrections à faire. Regroupés par **mécanisme
défaillant**, ils donnent **huit causes**, dont trois expliquent à elles seules 21 constats.

Deux conséquences immédiates, qu'aucun rapport ne pouvait voir seul :

1. **L'ordre proposé par la recette doit être inversé sur un point.** Elle place l'outillage
   (défaut J, invariant de G) en lot 4. Or les correctifs de contenu des lots 2‑3 se mesurent **sur le
   banc et le golden master** — c'est-à-dire sur des instruments dont on sait maintenant qu'ils sont
   **aveugles à une partie de la grammaire**. Corriger le contenu d'abord, ce serait figer des fixtures
   que l'instrument corrigé fera bouger juste après : **deux régénérations, deux relectures valeur par
   valeur** (§4bis) au lieu d'une, et une fenêtre où le vert ne prouve rien.

2. **Le trou de sécurité `statine` H4 et le défaut de recette K sont le même défaut.** Une alerte
   portée par une option n'est **ni engendrée ni vérifiée** par le banc. Les traiter séparément, c'est
   écrire deux fixtures ; les traiter ensemble, c'est fermer la classe entière.

---

## 1. Inventaire par cause racine

### S1 — « Où une expression peut-elle vivre dans un nœud ? » est recopié trois fois, et les trois copies divergent

**Vérifié en source.** Deux fonctions **portant le même nom**, dans deux fichiers, avec **deux corps
différents** :

| | `engine/relevance.ts:74` | `engine/banc/profils.ts:109` |
|---|---|---|
| `option.conditions` | ✅ | ✅ |
| `option.prerequis` | ✅ (ajouté le 26/07 « par cohérence ») | ❌ |
| `option.exclusions` | ✅ | ✅ |
| `option.priorite[].quand` | ✅ | ✅ |
| `node.alertes[].quand` | ✅ | ✅ |
| **`option.alertes[].quand`** | ❌ | ❌ |
| `criteres_entree[].derive` | ✅ | ✅ |

Une troisième variante existe (`engine/deriveCritere.ts:314` `criteresReferences`), qui délègue la
question à son appelant.

Chaque docstring affirme être le miroir de l'autre — « *les deux extracteurs ne doivent jamais diverger*
» (`profils.ts`, 26/07). **Ils divergeaient déjà en l'écrivant.**

Le schéma, lui, ne fait aucune différence : `node.alertes` et `option.alertes` partagent **la même
définition** `#alerte`. La distinction n'existe que dans le code, et de façon incohérente.

**Conséquence mécanique** : tout seuil numérique qui ne vit que dans une alerte d'option n'entre dans le
domaine de tirage d'**aucun** des deux moteurs. Le critère n'est jamais engendré à cette valeur (banc),
et jamais perturbé à cette valeur (pertinence).

| constat fermé | rapport |
|---|---|
| Le trou CK 10‑50 est un **bug de générateur**, pas un aléa de tirage | transverse |
| **H4** — CK > 50 N sans statine en place ne déclenche aucune alerte de rhabdomyolyse ; 11 profils du golden master figent le trou | statine |
| **K** — TBR > 4 % ne déclenche aucune alerte | recette |
| *(classe entière)* tout seuil futur écrit dans une alerte d'option | — |

**Ce qu'il ne faut PAS faire** : les 3 lignes que propose le rapport transverse. Elles ferment le cas CK
et **laissent la divergence en place** — le prochain champ ajouté au schéma sera oublié dans une copie
sur deux, exactement comme `prerequis` l'a été.

**Correctif systémique** : **un seul** collecteur exporté, `expressionsDuNoeud(node)`, consommé par
`relevance.ts`, `banc/profils.ts` et les invariants ; les deux copies locales supprimées. Plus un
invariant qui **relit `schema/noeud.schema.json`**, y énumère les champs déclarés porteurs d'expression
DSL, et **échoue si l'un d'eux n'est pas visité par le collecteur**. Le schéma en déclare huit
aujourd'hui (`alerte.quand`, `critereEntree.derive`, `critereEntree.visible_si`, `option.conditions`,
`option.prerequis`, `option.exclusions`, `option.priorite`, `option.calculs`) — l'invariant rend
l'oubli du neuvième impossible.

---

### S2 — Un canal de sécurité (D21) sans obligation de couverture

**Vérifié en source** (`banc/couverture.test.ts`). Le banc exige aujourd'hui :

- chaque option applicable ≥ 1 profil ;
- chaque option porteuse d'`exclusions` exclue ≥ 1 profil ;
- chaque **expression** d'`exclusions` vraie ≥ 1 profil ;
- chaque règle de `priorite` conditionnelle matchée ≥ 1 profil ;
- chaque **alerte de NŒUD** déclenchée ≥ 1 profil.

Il n'exige **rien** sur les **alertes d'OPTION** ni sur les expressions de `prerequis`.

Or D21 pose quatre canaux de sécurité et l'alerte d'option en est un. Un canal sans obligation de
couverture est un canal dont on ne saura jamais qu'il est mort — c'est très exactement ce qui s'est
produit : le golden master a figé 11 profils portant un trou de sécurité, en vert.

**Correctif systémique** : étendre `couverture.test.ts` **symétriquement à tous les canaux que le schéma
déclare**, en s'appuyant sur le même registre que S1. La règle devient : *tout fragment de contenu
porteur d'une expression doit être exercé au moins une fois par le banc.*

⚠ **Effet attendu et voulu : le banc va passer au rouge.** H4 et K sont de vraies alertes mortes. Ce
rouge est le livrable du lot, pas un accident à contourner.

---

### S3 — « Ce que le praticien a répondu » n'a pas de définition unique

C'est la cause la plus prolifique : **7 constats**, dont les quatre symptômes en cascade du défaut A.

La notion existe sous **quatre formes**, qui ne se parlent pas :

| forme | fichier | comportement |
|---|---|---|
| `touched` | état d'écran | la vérité |
| `data-on` / valeur du `<select>` | `components/CriteriaForm.tsx` | **ne consulte pas `touched`** — allume le primer sans clic (**défaut A**) |
| `determinesEffectifs` | `engine/deriveCritere.ts:291` | consulte `touched`, replie `bool`/`liste` sur « déterminé » (**défaut C**) |
| `decisifsAConfirmer` | `lib/formLayout.ts:184` | consulte `touched` + `pertinents` + visibilité — mais **ne voit ni `enAttente` ni les `calculs`** (**défauts B, J**) |

**L'écran affirme une chose, le moteur en croit une autre** — la formule est de la recette, elle est
exacte, et elle vaut pour les quatre formes.

| constat | mécanisme en cause |
|---|---|
| **A** (+ A1 à A4) | le rendu affiche « répondu » sans consulter `touched` |
| **C** | une `liste` vide est déterminée par repli de type |
| **G** | un `visible_si` non répété laisse un critère masqué rendre une option indéterminée |
| **J** | un `calculs` non calculable disparaît sans entrer dans le registre des critères réclamés |
| **O** (réserve) | `pertinents` a des faux négatifs documentés — d'où « estomper, jamais masquer » |

**Deux corrections à apporter aux rapports, vérifiées en source :**

1. **`confirmation_requise` fonctionne DÉJÀ sur les `liste`.** `deriveCritere.ts:271` :
   `if (critere.type === 'bool' || critere.type === 'liste') return critere.confirmation_requise !== true`.
   Le prérequis technique n° 1 de l'arbitrage C (« étendre `confirmation_requise` au type `liste` ») ne
   concerne donc **que** la description du schéma et le marqueur `estAConfirmer` du formulaire — **pas le
   moteur**. C est notablement moins coûteux qu'annoncé.
2. **Le prérequis technique n° 2 de C est déjà tenu.** « Vérifier qu'un champ masqué ne compte pas comme
   manquant » : `decisifsAConfirmer` filtre déjà par `champsVisibles` (`formLayout.ts:191`), et c'est
   documenté comme le correctif d'un défaut de recette antérieur. Reste à en faire un **test**, pas une
   implémentation.

**Constat que j'ajoute, absent des cinq rapports** : `decisifsAConfirmer` appelle
`champsVisibles(criteresEntree, criteria)` **sans passer `renseignes`** (`formLayout.ts:191`) — donc en
repli « tout est renseigné », alors que le reste de la chaîne évalue en ternaire. Un `visible_si` qui
serait INDÉTERMINÉ y est traité comme déterminé. À instruire dans le lot 1 : soit c'est délibéré et il
faut l'écrire, soit c'est la même divergence que S1, une couche plus haut.

**Correctif systémique** : un **accesseur unique** de l'état de réponse, consommé par le rendu ; et le
registre des critères réclamés **alimenté par tous les consommateurs qui peuvent être bloqués par une
réponse manquante** — `enAttente` et `calculs` compris. Pas quatre correctifs séparés.

Pour **G** en particulier : l'invariant d'abord, les quatre expressions ensuite. *« Tout critère porteur
d'un `visible_si` voit ce garde répété dans chaque expression qui le lit »* — mécaniquement vérifiable,
il **nomme** les quatre occurrences au lieu qu'on les cherche. C'est la règle R8 déjà écrite, jamais
outillée.

---

### S4 — Le repli conclut, alors qu'il devrait se taire

**B et D sont le même défaut vu des deux côtés.**

**Côté moteur (B).** `evaluateNode.ts:683` : `if (!anyNonDefaultApplicable)`, et
`anyNonDefaultApplicable` ne passe à vrai que sur une option **applicable**. Une option `enAttente` ne
compte pas.

⚠ **Ce n'est pas un oubli : c'est une décision documentée**, et la docstring en donne le motif —
« *rester silencieux sur une option ne doit pas priver le patient d'un repli par ailleurs sûr* » (D20).
La corriger, c'est **réviser une sous-décision de D20**, pas réparer un bug. À tracer comme telle
(changelog + `DECISIONS.md`).

Le motif d'origine reste valable dans un cas (une option indéterminée sans rapport avec le patient ne
devrait pas vider l'écran) ; il ne l'est pas dans celui de la recette (le moteur suspend son jugement et
l'écran conclut quand même — violation frontale de R7). **La règle précise à écrire** : `enAttente` non
vide ⇒ ni repli `["default"]`, ni badge « Recommandée » ; le bloc EN ATTENTE devient la sortie unique.
**I2′ (jamais de sortie vide) reste tenu** : dans cette branche, `enAttente` est non vide par
construction.

**Côté contenu (D).** `insuline.yaml:700` — le repli affirme « *objectif atteint, sans hypoglycémie ni
variabilité* » sans qu'aucune condition ne teste la cible. C'est un **fait faux sur le patient**, et il
le reste à chaque nouveau trou de couverture.

**Correctif systémique** : la révision moteur **plus** la règle de contenu *« une option de repli ne
prononce aucun fait sur le patient »*. Recommandation de la recette suivie (voie 1, réécriture de prose
seule). À vérifier sur `prescription`, qui porte son propre repli. Mécanisation partielle possible — un
invariant interdisant qu'une option `["default"]` **nomme** dans sa prose un critère du nœud qu'elle ne
teste pas — **à instruire, pas à promettre** : le taux de faux positifs n'est pas connu.

---

### S5 — `priorite` porte trois sens incompatibles

Écrit comme un ordre de **tri** (D13/D14), lu comme une porte d'**affichage** (repli), et utilisé pour
marquer un **socle** (rang 0, condition « toujours »).

| constat | rapport |
|---|---|
| **H** — le socle metformine préempte tout l'écran (3 volets : affichage, contenu, intitulé R9) | recette |
| Le repli d'affichage cachait une carte de sécurité (rang 0 = meilleur rang) — **neutralisé le 27/07**, question de fond ouverte | ce chantier |
| L'option terminale de `statine` n'est protégée que par sa **POSITION**, faute de pouvoir déclarer sa nature | statine |
| **I** — « pourquoi pas d'autres options » pollué : voie (c) = « nouveau champ déclarant l'objet du geste » | recette |
| Deux options `["default"]` sur `prescription` (socle + repli) demandent un arbitrage explicite | recette |

Cinq constats, une seule question : **le contenu n'a aucun moyen de déclarer ce qu'une option EST.**
C'est la réponse à la question laissée ouverte ce matin — *« quel signal du contenu dit qu'une carte ne
peut pas être repliée ? »* : aujourd'hui, aucun.

**Correctif systémique** : déclarer le **rôle** d'une option dans le contenu (socle / geste / repli /
sécurité), lu par le repli d'affichage, par « pourquoi pas », et par le badge — au lieu de faire porter
trois sémantiques à un entier de tri.

**⚠ Arbitrage référent requis, et à ne pas prendre sous pression de recette** (§4bis : « deux des défauts
les plus graves de la dernière journée venaient de nos propres correctifs du matin »). Le repli
d'affichage est **neutralisé** : il n'y a aucune urgence.

---

### S6 — Le même fait clinique, écrit à plusieurs endroits, dérive

Le groupe le plus nombreux, et celui où le correctif atomique est le plus tentant et le moins utile.

| constat | rapport |
|---|---|
| **H2** — l'alerte dit « 5 fois la normale » sous un déclencheur `> 4` ; **les vignettes F‑15/F‑18 verrouillent la mauvaise chaîne** | statine |
| **H1** — « rien de plus récent ne remplace le parcours » écrit **4 fois**, rendu faux par NG238 | statine |
| Seuil HbA1c « < 6,5 % » faux en **4 endroits**, dont l'alerte et la carte retenue | prescription |
| « convention KDIGO » survit dans **3 fichiers** (`prescription:875`, `insuline:746`, `insuline:1321`) | prescription |
| « sitagliptine » subsiste en **≥ 3 endroits**, dont un **intitulé d'option** | prescription |
| En-tête « bloquent les pistes de réduction » ; table des pistes listant une piste supprimée ; phrase cassée | rhd |
| **M** — libellés AGP non parlants, descriptions cachées dans un `title` natif | recette |

**Ce qui est mécanisable, et vaut d'être livré** : *tout nombre figurant dans le `message` d'une alerte
doit figurer dans le `quand` de cette même alerte.* Cinq lignes, aucun faux positif plausible, et cela
attrape **H2** immédiatement — ainsi que le « < 6,5 % » de `prescription`, porté par une alerte.

**Ce qui ne l'est pas, et qu'il ne faut pas prétendre outiller** : la prose d'argumentaire à travers
trois fichiers. Un invariant par grep produirait un bruit qui ferait apprendre à ignorer le rouge — le
défaut exact décrit dans `couverture.test.ts` à propos des budgets de temps. **Remède honnête** : un
arbitrage numérique ne change **qu'un seul endroit — l'expression** ; la prose est relue derrière, et la
liste des endroits à relire est **produite par le grep, pas par la mémoire**.

⚠ **H2 ne se corrige pas seul** : quel nombre est le bon est précisément ce qui est en arbitrage (§4).

---

### S7 — L'invariant « un concept, un encodage » ne voit qu'un nœud à la fois

I4 est per-node **par construction** — il ne peut pas voir deux nœuds à la fois. Le contrôle inter-nœuds
n'existe pas.

| constat | rapport |
|---|---|
| **4 divergences** parmi 14 critères partagés | transverse |
| `terrain_fragile` scindé dans `prescription`, pas dans `insuline` ; incertitude n° 1 devenue caduque | transverse |
| **F** — `traitements_en_cours` partagé entre nœuds : la scission en critère propre « ne passe pas à l'échelle » | recette |
| **§5** — `insuline` doit-il devenir un module ? La recette exige **un comptage sur pièces** avant de trancher | recette |

**Correctif systémique** : un invariant **inter-nœuds** — un nom de critère présent dans ≥ 2 nœuds doit y
porter le même `type`, les mêmes `valeurs` et le même `derive`, ou figurer dans une table d'exceptions
**nommées et motivées** (l'idiome du dépôt : `ALERTES_PROHIBITIVES_HORS_PERIMETRE`,
`OPTIONS_A_FONDEMENT_NON_EXPERIMENTAL`).

**Effet de bord précieux** : cet invariant **produit** l'inventaire factuel que la recette §5 pose comme
condition préalable à la décision « module ». Il transforme une question d'architecture en un comptage.

---

### S8 — L'obligation de vignettes est déclarative, pas structurelle

| constat | rapport |
|---|---|
| Les **deux nœuds RHD n'ont aucune vignette exécutable** | rhd |
| **I8** est contournable : `references_primaires[].id` est **optionnel** | transverse |
| `cible-glycemique` est **entièrement hors de portée** de I8 | transverse |
| Le troisième disjoint de la scission `terrain_cible_assouplie` n'est **testé par rien** | prescription |
| Le contre-exemple `R6-6` est **vacant** (il passe pour la mauvaise raison) | prescription |

Même forme que S2 : une obligation qu'aucun mécanisme ne rend exigible n'est pas une obligation.

**Correctif systémique** : rendre `id` **obligatoire** (avec migration du contenu existant), et poser un
invariant *« tout nœud publié possède un fichier de vignettes »*. Un test vacant est un test qui ment :
`R6-6` est à réécrire, pas à supprimer.

---

## 2. Arbitrages

### 2.0 — Rendus le 2026-07-27 (soir)

| # | question | décision référent | application |
|---|---|---|---|
| **A1** | `statine`, CK dans la bande basse | **Aligner sur NG238** : seuil **5 N** avec re-dosage à 7 j ; sous traitement, CK < 5 N → **rassurer** ; à l'initiation, 4-5 N → **débuter à dose plus faible**. Bandes 10 N et 50 N inchangées (le parcours NHS en reste seule source — NG238 ne les couvre pas). | lot 2, en **un seul passage** sur `statine.yaml` |
| **A2** | option « Interrompre » chez l'intolérant avéré | **Scinder en deux options** : « Interrompre et réévaluer » (intolérance non avérée) / « Interrompre — la classe reste indisponible » (avérée). Le geste d'arrêt est couvert dans les deux cas, la suite diffère. ⚠ Nœud en `ordered-first-match` : un point d'ordre de plus à garantir. | lot 2, même passage que A1 |
| **A3** | `priorite` à trois sens | **Déclarer le RÔLE de l'option dans le contenu** (socle / geste / repli / sécurité), lu par le repli d'affichage, par « pourquoi pas d'autres options » et par le badge. | lot 3 — évolution de schéma + relecture de toutes les options du domaine |
| **A4** | `visible_si` par valeur de `liste` | **Faire l'évolution de schéma.** Générique, sert le cas AGP et tout futur domaine, évite de dupliquer un critère partagé. | lot 3 |

**A1 et A2 sont indissociables** et se posent sur le même fichier : les appliquer séparément
laisserait le nœud dans un état intermédiaire incohérent (l'option « Interrompre » se déclenchant
encore à 4 quand le reste du nœud parle de 5). La dette I9 posée au lot 0 le dit explicitement et
expirera d'elle-même quand ce passage sera fait.

### 2.1 — Encore ouvert : `statine`, le reste du dossier CK

J'ai fait arbitrer « 4 N » sur une prémisse fausse : je n'avais pas ouvert `NICE 2023.pdf`, que vous
m'aviez fourni. Lu depuis en source primaire — c'est bien **NG238**, publiée le 14/12/2023, « *This
guideline replaces CG181* ».

| point | ce que le nœud fait | ce que NG238 dit |
|---|---|---|
| **(a)** seuil | 4 N | **5 N, avec re-dosage à 7 jours** (§1.5.7) |
| **(b)** bande 4‑5 N à l'initiation | « statine indisponible » | « *raised but < 5× ULN* → **débuter la statine à dose plus faible** » |
| **(c)** CK < 5 N sous traitement | interrompre | **rassurer** (§1.11.4) ; ne pas doser les CK chez l'asymptomatique traité (§1.11.5) |
| **(d)** option « Interrompre » | aucune exclusion sur `intolerance_statine == averee` | — (question de cohérence interne : le nœud propose de réintroduire une statine à un intolérant avéré, contre son propre `population_cible`) |

NG238 porte en outre **son propre protocole de réintroduction** (§1.9.2‑1.9.4) et une section
« *Treatment if statins are contraindicated or not tolerated* » (§1.10). Le nœud écrit **quatre fois**
que « rien de plus récent ne remplace le parcours » : c'est faux.

**(e) L'alerte de rhabdomyolyse manquante (H4) est la seule que je peux corriger sans vous** — trou de
sécurité sans contrepartie clinique. Elle est traitée par S1+S2 au lot 0.

### 2.2 — Autres arbitrages ouverts

| # | question | source |
|---|---|---|
| **S5** | déclarer le **rôle** d'une option dans le contenu (ferme H, I, le repli d'affichage, les deux `default`) | recette H/I |
| **F** | `visible_si` par valeur de `liste` — évolution de schéma. Recommandation recette : **oui**, 3ᵉ occurrence du même manque | recette F |
| **I** | (a) `prerequis` silencieux / (b) masquer les `contient` sur `liste` / (c) champ de contenu. Recommandation recette : **(b)** pour livrer, **(a)** à terme | recette I |
| **§5** | `insuline` en module de 4 nœuds — **après** le comptage produit par S7 | recette §5 |
| **N/O/P** | ergonomie (argumentaire, repli par section, code couleur, réorganisation) | recette |
| — | sur-blocage `fragilite` : **432 profils sur 2 160** perdent **toute** option d'ajout. Le sur-blocage a été assumé ; son ampleur n'était pas connue au moment de l'arbitrage | prescription |

---

## 3. Le plan

### Lot 0 — Réparer les instruments — ✅ **LIVRÉ le 2026-07-27**

**Pourquoi en premier** : ces mécanismes **changent ce que le banc peut voir**. Tout correctif de
contenu livré avant serait mesuré à l'aveugle, puis re-mesuré après — deux régénérations du golden
master, deux relectures valeur par valeur. *(Le golden master, lui, n'a finalement pas bougé : il lit
des fixtures FIGÉES, `banc/fixtureProfils.ts`, que le générateur ne touche plus depuis le 26/07.)*

**Résultat : 552 → 594 tests, typecheck et build verts.**

#### Ce qui a été livré

| # | livrable | fichier |
|---|---|---|
| **S1** | `expressionsDuNoeud` / `reglesDeDecision` — collecteur UNIQUE, remplaçant les deux `reglesDuNoeud` homonymes et divergents | `engine/expressionsNoeud.ts` (nouveau) |
| **S1** | **G1** schéma ↔ classification · **G2** complétude du collecteur (nœud synthétique à marqueurs) · **G3** régime de banc déclaré | `banc/grammaire.test.ts` (nouveau) |
| **S2** | couverture des **alertes d'OPTION** (affichée ≥ 1 profil) et des **`prerequis`** (faux ≥ 1 profil) | `banc/couverture.test.ts` |
| **S6** | **I9** — le seuil annoncé par une alerte est celui qui la déclenche | `banc/invariants-contenu.test.ts` |
| **S7** | invariant **inter-nœuds** sur les critères partagés | `banc/coherence-inter-noeuds.test.ts` (nouveau) |
| **S8** | `references_primaires[].id` **obligatoire** + 8 ids posés sur `cible-glycemique` | `schema/`, `node.types.ts`, `cible-glycemique.yaml` |
| **S8** | obligation de **vignettes exécutables** par nœud | `banc/coherence-inter-noeuds.test.ts` |

#### Ce que le lot a trouvé — trois défauts d'instrument qu'aucun rapport n'avait vus

1. **Le générateur sous-échantillonnait les critères `liste` de façon exponentielle.** Chaque valeur
   était tirée à pile ou face indépendamment : sur `traitements_en_cours` (8 valeurs), la liste vide
   sortait **11 fois sur 1840**. Or l'idiome du dépôt pour « ne prend pas déjà cette classe » est un
   `prerequis` en `ne_contient_pas` répété par classe — une option gardée par 4 clauses exigeait donc un
   événement à 2⁻⁴. **Le coût croissait avec le nombre de valeurs DÉCLARÉES**, sans rapport clinique
   avec la rareté du patient. Corrigé par une stratification de la **cardinalité** : liste vide
   11 → **204**, « aucune des 4 classes » 126 → **366**, fréquence marginale par valeur inchangée
   (~50 %). *Sans ce correctif, l'option « Association iSGLT2 + AR GLP‑1 » de `prescription` passait de
   couverte à jamais-applicable au moindre changement de graine — et le diagnostic partait sur le
   contenu.*

2. **Le banc était passé de la couverture PROUVÉE à la couverture PROBABLE, en silence.** L'ajout du
   critère `CK_x_normale` à `statine` le matin même a multiplié son produit cartésien par 11 (47 520),
   franchissant `PLAFOND_ENUMERATION_EXHAUSTIVE` (20 000) : le nœud est tombé de la stratégie 1
   (énumération exhaustive) à la stratégie 2 (échantillonnage) **sans qu'aucun test ne puisse le dire**,
   la stratégie n'étant exposée nulle part. Une alerte de sécurité ajoutée la veille pour fermer un
   HAUTE-4 de red-team (ASCVD + dialyse sans statine) avait cessé d'être couverte. Plafond relevé à
   **60 000** — mesuré, pas au jugé : deux nœuds étaient à un facteur 2-3 près (`statine` 47 520,
   `rhd-activite-physique` 55 296), les trois autres à 8-12 ordres de grandeur. **G3** exige désormais
   qu'un nœud en stratégie 2 soit DÉCLARÉ.

3. **Coût assumé** : suite complète **7,6 s → 41 s**. `statine` et `rhd-activite-physique` parcourent
   50 fois plus de patients (720 → 47 520 ; 1 120 → 55 296). Cher en proportion, dérisoire en absolu,
   payé pour transformer une couverture probable en couverture prouvée sur deux nœuds. Délais de test
   déclarés explicitement (`DELAI_BANC_MS`), jamais un défaut global qui masquerait un test lent.

#### Ce que le lot a mis au jour dans le CONTENU (à corriger au lot 2)

- **I9 → 1 violation, la vraie.** L'alerte de `statine` déclenchée sur `CK_x_normale > 4` annonce
  « 5 fois la normale ». Mise en dette **auto-expirante** plutôt que corrigée isolément : le nombre
  juste est l'objet de l'arbitrage **A1**, et le corriger seul laisserait le nœud incohérent.
- **S7 → 4 divergences sur 13 critères partagés**, toutes déclarées et motivées. Deux demandent un
  arbitrage (`traitements_en_cours` : `insuline` vs `insuline_basale`/`insuline_rapide` — une règle
  `contient insuline` est structurellement fausse dans le nœud `insuline` ; `cible_atteinte` : deux
  encodages du même concept). Deux sont de forme (`terrain_cible_assouplie`, introduite le matin même ;
  `preference_injection`, dont l'ordre différent change le primer affiché — aggravé par le défaut A).
- **S8 → 3 nœuds sans vignettes exécutables** (`cible-glycemique`, `rhd-alimentation`,
  `rhd-activite-physique`), déclarés.

#### Un invariant que j'ai dû resserrer, et pourquoi c'est consigné

La première rédaction de **I9** examinait tout nombre introduit par une tournure comparative. Mesurée
sur le contenu réel : **12 violations, 1 vraie**. Les onze autres étaient des messages citant
légitimement un seuil qui n'est pas le leur (une posologie en mg sous un déclencheur en DFG, une cible
de MCG, un DFG voisin, un pourcentage SCORE2). **Un test à 92 % de faux positifs n'aurait rien
protégé : il aurait appris à ignorer le rouge.** Resserré aux tournures dont l'unité est portée par la
tournure elle-même (« N fois la normale ») : zéro faux positif, le défaut attrapé. La forme générale
demande une déclaration d'**unité** sur les critères `nombre` — candidate pour le lot 3.

**Les trois invariants de `grammaire.test.ts` ont été vérifiés en ÉCHEC** (classification retirée,
récolte d'alerte d'option retirée, plafond remis à 20 000) : chacun tombe, avec un message qui dit quoi
faire.

### Lot 1 — La détermination — ✅ **LIVRÉ le 2026-07-27**

**Résultat : 594 → 604 tests, typecheck et build verts.** Recette visuelle consignée dans `VALIDATION.md`.

| # | livré | où |
|---|---|---|
| **A** | le rendu consulte `touched` (segments **et** `<select>`, avec une option vide « — » qui rend l'état « pas encore répondu » représentable) ; `estAConfirmer` étendu aux `enum` **et** aux `liste` `confirmation_requise` | `components/CriteriaForm.tsx` |
| **B** | **révision tracée de la sous-décision D20** : `enAttente` non vide ⇒ ni repli `["default"]`, ni badge | `engine/evaluateNode.ts` |
| **J** | `OptionVue.calculsEnAttente` — la carte nomme la dose manquante et le champ qui la débloque | `lib/vueDecision.ts`, `components/OptionCard.tsx` |
| **G** | **I10** (invariant R8) + les expressions qu'il nomme, sur 3 nœuds | `banc/invariants-contenu.test.ts`, 3 YAML |
| **S3** | `decisifsAConfirmer` transmet enfin `touched` à `champsVisibles` | `lib/formLayout.ts` |

⚠ **A conditionne tout flux par étapes** (piège de séquencement de la recette §P) — donc avant N/O/P.

#### Le défaut de production que le lot a trouvé

**Un patient de prévention secondaire sans intolérance déclarée ne recevait AUCUNE recommandation du
nœud `statine`.** ASCVD établie, pas de statine en cours, aucun symptôme musculaire : le cas le plus
banal du nœud. Le champ `CK_x_normale` est masqué chez lui (`visible_si: intolerance_statine != non`),
donc jamais renseigné, donc **indéterminé** — et l'exclusion de l'option de haute intensité le lit sans
répéter ce garde. En `ordered-first-match`, une option indéterminée **arrête le nœud** : sortie vide.

Introduit le matin même par le critère `CK_x_normale` (commit `3bf372e`), **déployé**, et invisible aux
cinq rapports du jour. Trouvé par I10, écrit deux heures plus tôt. C'est l'argument le plus net en
faveur de l'ordre du plan : réparer les instruments avant le contenu.

#### Correction à apporter au rapport de recette

**Le défaut J n'en était pas un côté moteur.** La recette proposait de faire entrer les critères d'un
`calculs` non résoluble dans le registre `enAttente`. Vérifié avant de coder : `poids` **est** déjà
pertinent (la perturbation de `relevance.ts` ajoute le critère à `renseignes` avant de comparer, donc le
calcul redevient calculable et la signature change) et **est** déjà réclamé par `decisifsAConfirmer`. Ce
qui manquait était le **lien** — le champ était marqué « à confirmer » dans le formulaire, à plusieurs
sections de la carte qui restait muette. Correctif d'affichage, sans toucher à la sémantique de
`enAttente` (« ni proposée, ni écartée »), qui ne décrit pas ce cas : l'option **est** proposée, c'est sa
dose qui manque.

#### Trois tests encodaient le comportement révisé

Ils n'ont pas été supprimés mais **inversés, avec leur motif** : la vignette référent E-09 d'`insuline`
(« le repli reste actif »), le test moteur de D20 (« un non-default en attente ne bloque pas le repli »),
et le test de formulaire (« ne marque pas un `enum` non renseigné »). Deux énoncés du référent se
contredisaient ; le plus récent — la recette sur le déployé, qui décrit ce que l'écran a réellement
montré — tranche.

#### Golden master — mesure §4bis

| nœud | profils modifiés (rendus en clair) |
|---|---|
| `statine` | **4 / 10** — dont 2 qui recevaient une *interruption de statine fantôme* |
| `prescription` | **3 / 10** |
| `insuline` | **2 / 10** |

Sur les snapshots d'indétermination : `insuline` **8 / 15** et `prescription` **1 / 15** profils ne
concluent plus à tort. Chaque diff a été lu ligne à ligne, jamais accepté en bloc.

#### Deux invariants calibrés sur le contenu réel, pas au jugé

**I10** est passé par trois rédactions. La première (garde exigé dans le même terme `OR`) sortait 16
violations sur `insuline`, **toutes fausses** : le garde vivait dans une entrée `conditions` voisine, et
les entrées de `conditions` se combinent en ET. La deuxième (voisines non disjonctives seulement)
en gardait 12, encore fausses : la forme dominante du contenu est
`situation_insuline == A OR situation_insuline == B`, qui contraint bel et bien le critère puisque
**chacun** de ses termes le cite. La troisième ajoute le filtre décisif — **seuls les critères dont le
masquage produit une INDÉTERMINATION** sont concernés (`nombre`/`enum`, ou `bool`/`liste`
`confirmation_requise`) : une `liste` masquée vaut `[]`, déterminée, et ne met rien en attente.

Ce filtre est **dynamique**, et c'est voulu : le jour où l'arbitrage C posera `confirmation_requise` sur
`profil_glycemique`, ce critère entrera dans le périmètre et l'invariant réclamera ses gardes. Rendre
visible ce que la décision d'hier ne pouvait pas prévoir.

### Lot 2 — Contenu, un seul passage par fichier

Sérialisé — deux agents ne partagent jamais un fichier (§6), et les lots 2‑3 de la recette touchaient
tous deux `insuline.yaml`.

| fichier | contenu du passage |
|---|---|
| `prescription.yaml` | traces résiduelles (KDIGO, sitagliptine, « < 6,5 % ») · `option.references` mal attachées · 3 études PK non citées · `R6-6` réécrit · 3ᵉ disjoint testé · **sur-blocage `fragilite` après arbitrage** |
| `insuline.yaml` | **C** (`confirmation_requise` sur `profil_glycemique`) · **D** (repli muet) · **E** (scission basale/bolus) · **K** · **L** (`hypo_nocturne`) · **M** (libellés AGP) · KDIGO ×2 |
| `rhd-alimentation.yaml` + `rhd-activite.yaml` | `fragilite` sur les 3 pistes · en-tête · table des pistes · phrase cassée · **vignettes exécutables** (S8) |
| `statine.yaml` | **rien avant l'arbitrage §2.1** |

### Lot 3 — Arbitrages structurels

**S5** (rôle d'une option) · **F** · **I** · **§5** module · **N/O/P**. Après le lot 0, qui fournit le
comptage sur lequel §5 doit se décider.

---

## 4. Mesure et portes de sortie

- **Chaque lot passe par la piste B du §P6** (banc + invariants), correctifs compris : *« un correctif
  est un changement de comportement comme un autre »* (§4bis).
- **La mesure n'est pas le nombre de lignes changées** mais **combien de profils gagnent ou perdent une
  option, et lesquels**.
- **Régénération du golden master** : procédure §4bis, retrait manuel de la seule colonne dont le TYPE
  change, relecture **valeur par valeur**.
- **Validation visuelle = humaine** : aucun navigateur, aucun Playwright. Claude livre
  build + typecheck + tests ; le visuel est consigné dans `VALIDATION.md` — dont la recette d'aujourd'hui
  a montré qu'une **case cochée sur une supposition** y coûte un défaut de sécurité en production.

---

## 5. Reste dû, hors périmètre de ce plan

- **Validation clinique** des cinq nœuds en `brouillon` (`prescription` v0.9, `insuline`, `statine`,
  `rhd-alimentation`, `sulfamides-gliptines`).
- Le **nœud perte de poids / rémission** (ex-`rhd`, supprimé le 26/07) — dossier de preuve
  `docs/decision/noeuds/H-rhd.md` intact.
- `prescrire 12.pdf` toujours **vide**, à re-fournir.
