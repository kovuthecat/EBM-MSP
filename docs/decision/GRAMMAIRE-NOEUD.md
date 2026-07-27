# Grammaire de modélisation d'un nœud de décision — **générique, tous domaines**

> **Statut** : R1→R6 issues de la recette du nœud `prescription` (2026-07-25), livrées. **R7 et R8**
> ajoutées après la recette élargie du 2026-07-26 (nœuds `insuline`, `statine`, `rhd`) — R7 livrée
> (D20), R8 à livrer (D21). **R9 est une proposition non arbitrée.**
> **Portée** : ce document ne parle **d'aucun domaine clinique**. Il énonce les **règles** que doit
> respecter l'écriture de n'importe quel nœud, DT2 ou futur domaine — il se consulte *pendant*
> l'écriture. Le **procédé** de construction d'un module (ordre des étapes, portes de sortie,
> checklists opposables) vit dans [`CONSTRUIRE-UN-MODULE.md`](CONSTRUIRE-UN-MODULE.md). Le *quoi*
> clinique reste dans `docs/decision/noeuds/` ; la *méthode de sourcing* reste dans `00-global.md`
> (DT2) ; le *contrat exécutable* reste dans `schema/noeud.schema.json`.

## Pourquoi ce document existe

La recette du nœud `prescription` a produit une série de corrections successives qui n'ont jamais
convergé. Le diagnostic, rejoué profil par profil sur le moteur réel, est que **les défauts n'étaient
pas des bugs d'affichage mais des défauts de modélisation du raisonnement clinique** — donc
reproductibles à l'identique dans tout nœud et tout domaine à venir.

Les cinq règles ci-dessous sont la contrepartie de cinq écarts constatés entre ce que fait le moteur
et ce que fait un praticien devant son patient. Chacune est accompagnée du cas réel qui l'a révélée.

---

## R1 — Un ÉTAT clinique ne se déduit jamais d'une INTENTION déclarée

**Règle.** Un critère qui décrit *où en est le patient* (état, mesure, position vs objectif) doit être
**observé ou déclaré comme tel**. Il ne doit jamais être dérivé d'un critère qui décrit *ce que le
praticien veut faire*. L'intention organise le flux et l'affichage ; elle n'affirme rien sur le patient.

**Le cas.** `cible_atteinte` était dérivé de `intention == optimiser OR intention == deprescrire`.
« Optimiser », en français clinique courant, signifie *améliorer le traitement* — ce qui suppose
généralement qu'on n'est **pas** à l'objectif. Le contenu avait donné au mot le sens inverse. Le
référent a dû écrire une phrase pour lever l'ambiguïté (« mon intention est l'optimisation **avec une
HbA1c à la cible** ») : cette phrase était le rapport de bug.

**Corollaire — la question directe l'emporte sur le chaînage.** Quand un état est calculable par un
autre nœud, on ne rend pas ce nœud obligatoire : le praticien peut n'ouvrir que le nœud qui
l'intéresse. On **pose la question** dans le nœud qui en a besoin, et l'autre nœud reste une aide
proposée, jamais un prérequis.

**Vérification.** Le champ `nature` (ci-dessous) rend la règle mécaniquement testable : aucun critère
de nature `etat` ne doit avoir un `derive` mentionnant un critère de nature `intention`.

---

## R2 — Toute option porte son DÉLAI de bénéfice ; tout patient a un HORIZON

**Règle.** Une option qui revendique un bénéfice sur critère dur doit déclarer **en combien de temps**
ce bénéfice apparaît dans les essais. L'outil affiche ce délai à côté de l'effet attendu, sans jamais
en tirer lui-même une conclusion.

**Le cas.** Le moteur a badgé « Recommandée » une option dont l'`effet_attendu` disait, en toutes
lettres, *« NNT ~19-31 / 16-26 mois »*, chez un patient à **espérance de vie limitée**. Les deux
nombres étaient dans le fichier. Rien ne les confrontait. Un praticien fait cette mise en balance en
une seconde ; l'outil possédait les deux faits et ne les rapprochait jamais.

**Pourquoi pas un calcul automatique.** Convertir « espérance de vie limitée » en mois puis comparer
produirait une fausse précision et un **arbitrage clinique caché** — interdit par l'invariant 2
(aucun score caché). L'outil met les deux faits **côte à côte** et laisse juger. Quand le référent veut
une réserve explicite, il l'écrit : c'est le rôle des alertes portées par l'option (R3/schéma).

**Conséquence de rédaction.** `delai_benefice` est obligatoire, dans la grammaire, pour toute option
dont le `niveau_preuve` est `modere` ou `eleve` sur un critère dur. Valeurs acceptables : une durée
(« 16-26 mois »), `immédiat`, ou `non établi` — jamais un vide silencieux.

---

## R3 — Modifier un traitement existant = DEUX décisions, pas une

**Règle.** Le jugement porté sur une ligne de traitement en cours (*la garder / la réduire / l'arrêter*)
et le choix de ce qui la remplace sont **deux décisions distinctes**, à écrire comme deux options. Les
conditions et exclusions de la première ne portent que sur la **ligne jugée** ; celles de la seconde
ne portent que sur le **remplaçant**.

**Le cas.** « Remplacer la gliptine par un AR GLP-1 » était une option atomique dont les exclusions
étaient celles du remplaçant (`IMC < 22`, dénutrition…). Chez un patient à IMC 20, le remplaçant était
impossible — et **le jugement sur la gliptine a disparu avec lui**. L'outil a alors proposé d'*ajouter*
un agent en *conservant* la gliptine. Aucun clinicien ne perd « cette gliptine ne sert à rien » parce
que le remplaçant n'est pas disponible.

**Forme canonique.**

| décision | déclenchée par | exclusions portées |
| --- | --- | --- |
| **le verdict sur la ligne** | la ligne elle-même : un agent au rapport bénéfice/risque défavorable est présent | **structurelles seulement** — ce qui rend tout geste électif impossible (état aigu, catabolique), jamais les garde-fous d'une destination |
| **le choix du remplaçant** | les options d'ajout, avec leurs propres indications et garde-fous | les siennes |

La comorbidité **choisit le remplaçant et son rang** ; elle n'autorise pas le geste. Un agent sans
bénéfice dur reste un agent sans bénéfice dur, que le patient ait ou non une comorbidité par ailleurs.

**Correction d'une erreur commise dans la première rédaction de ce document.** J'avais écrit « à
l'objectif → arrêter ; au-dessus → remplacer », en découpant sur la position vs objectif. C'est
cliniquement faux, et le cas de recette le montre : *patient **à l'objectif**, sous gliptine, avec
maladie athéromateuse → **remplacer**, pas arrêter*, parce qu'il existe une indication de protection
non couverte. Le déclencheur du verdict n'est pas la position glycémique, c'est la présence de la ligne.

**Ce qui ne s'encode pas, et pourquoi.** La clause de repli — « si aucun remplaçant n'est applicable sur
ce terrain, ne pas retirer à vide » — reste **en prose**. L'encoder demanderait à une option d'interroger
l'applicabilité d'une autre : le moteur ne sait pas le faire, et ne doit pas apprendre à le faire (cela
introduirait un ordre d'évaluation implicite entre options, donc un arbitrage caché). Recopier les
exclusions des destinations dans la condition du verdict serait pire encore : la duplication dériverait
à la première modification d'une exclusion.

**R4 complète R3, la prose la rend livrable seule.** Un verdict déclenché systématiquement rend *plus*
fréquent le cas « verdict proposé, aucune destination applicable ». Deux sous-cas, et c'est le second qui
compte :

- la destination est **écartée par une exclusion** (AR GLP‑1 sur `IMC < 22`) → R4 l'affiche avec son
  motif, à côté du verdict. Résolu ;
- la destination **échoue sur une condition** (ni iSGLT2 ni AR GLP‑1 indiqués faute de comorbidité) →
  elle n'entre même pas dans `excluded`. **Seule la moitié « sur demande » de R4 l'explique.**

D'où l'obligation, pour toute option de verdict, d'une **clause de repli explicite dans la prose** —
« si aucun remplaçant n'est applicable sur ce terrain, ne pas retirer à vide : poursuivre et réévaluer ».
C'est elle qui rend R3 livrable avant R4 : sans elle, R3 seul produirait une injonction sans issue.

---

## R4 — Deux silences distincts : ÉCARTÉ (poussé) vs NON INDIQUÉ (à la demande)

**Règle.** Le moteur retire une option de deux façons, qui n'ont pas la même valeur clinique et ne se
présentent donc pas de la même manière :

- **écartée par une `exclusion`** — elle était indiquée, un garde-fou l'a retirée. C'est une
  information de **sécurité** : elle s'affiche, discrètement mais toujours, avec son motif.
- **non retenue faute de `condition`** — elle n'était pas indiquée pour ce patient. C'est une
  information **d'explication** : elle se consulte **sur demande** (« pourquoi pas X ? »), jamais en
  liste poussée — sur un nœud à 22 options, une quinzaine échoue pour tout patient donné, les pousser
  rendrait l'écran illisible.

**Le cas.** Le champ `excluded` est calculé par le moteur, documenté « jamais en silence », et **aucun
composant ne l'affichait**. Plus subtil : le plan de correction prévoyait d'afficher deux options
écartées, alors qu'une seule des deux passe par `excluded` — l'autre échouait sur une *condition* et ne
laissait aucune trace. Corriger la moitié visible du problème aurait laissé l'autre moitié muette.

**Implication moteur.** `EvaluateNodeResult` doit tracer aussi les échecs de condition (quelle
condition, sur quelle option), même si l'UI ne les rend que sur sollicitation.

---

## R5 — Un critère qu'on demande doit agir ; sinon on ne le demande pas

**Règle.** Chaque critère d'entrée doit **changer quelque chose à l'écran** pour au moins un profil du
banc — la recommandation, un rang, une alerte, une dose calculée ou un texte d'interprétation. Un
critère qui ne change rien est soit inutile (le retirer), soit mal câblé (le brancher) — jamais à
laisser en l'état : il coûte du temps de consultation et donne l'illusion d'être pris en compte.

> **« Changer l'écran », pas « changer la sortie du moteur ».** La première rédaction disait « la
> sortie », ce qui est trop étroit : un critère peut ne pas déplacer une seule option et pourtant être
> utile, s'il alimente une dose calculée (`calculs`) ou le texte d'une alerte. Tant que le modèle de vue
> unique n'existe pas, le test s'exécute contre `evaluateNode` et **sous-estime** donc la portée d'un
> critère. À rebrancher sur le modèle de vue dès qu'il existe.

**Ce que la première exécution a trouvé** (nœud `insuline`, 2026-07-25) — cinq critères jamais
décisifs, et le diagnostic n'est pas le même pour tous, ce qui est précisément l'intérêt du test :

- `TIR`, `TAR`, `GMI` — **non décisifs par conception** : le nœud déclare lui-même que l'axe « contrôle »
  de la mesure continue est redondant avec l'HbA1c, qui gate déjà. Mais leurs valeurs ne sont pas
  rendues non plus : les alertes énoncent des cibles générales (« TIR > 70 % ») sans jamais utiliser le
  chiffre saisi. Collectés, donc, et véritablement inutilisés — l'intention du contenu n'a pas été
  réalisée à l'écran ;
- `IMC` — aucune règle, aucun calcul. Mort ;
- `dose_rapide_actuelle` — mort, alors que `dose_basale_actuelle`, lui, **n'a pas été signalé** : il
  alimente le dérivé `over_basalisation`. Le test discrimine donc bien les deux, il ne signale pas « tout
  ce qui ressemble à une dose ».

**Le cas.** `esperance_vie`, `age` et `fragilite` étaient collectés puis agrégés dans `terrain_fragile`,
lui-même utilisé **une seule fois**, et uniquement en conjonction avec une hypoglycémie récente. Sans
hypoglycémie récente, un patient de 85 ans fragile en fin de vie recevait **exactement la même
recommandation** qu'un patient de 55 ans en forme. Trois questions posées, un effet quasi nul.

**Vérification — elle est déjà écrite.** `engine/relevance.ts` calcule, par perturbation, l'ensemble des
critères qui changent la sortie pour un jeu de critères donné. Aujourd'hui ce calcul ne sert qu'à
estomper des champs de formulaire. Passé sur le banc de vignettes du nœud, il donne gratuitement le
test de R5 :

```text
union( criteresPertinents(node, profil) pour tout profil du banc )  ⊇  critères saisissables du nœud
```

Tout critère absent de l'union est signalé. **À ajouter au banc de tout nœud, tout domaine.**

> **Nuance ajoutée après la recette du 2026-07-26 — R5 peut passer alors que le défaut demeure.**
> Sur `statine`, `age` n'apparaît dans **aucune** condition d'option : il ne sert qu'à l'alerte
> `age > 75 AND ASCVD_etablie == false`. R5 est donc **satisfaite** (le critère change l'écran), et
> pourtant le nœud rend exactement la même carte — même titre, même badge « Recommandée », même
> « délai du bénéfice : 3-5 ans » — à **30 ans** et à **90 ans**. L'estompage ne le signale pas non
> plus, puisque l'âge *a* un effet.
>
> Le critère collecté donne donc au praticien l'illusion d'une décision individualisée sur l'âge,
> alors qu'il n'allume qu'un message. Deux conséquences de rédaction :
>
> - **distinguer la portée d'un critère** — pilote-t-il la *décision* (option, rang, exclusion) ou
>   seulement un *commentaire* (alerte, texte) ? Un critère qui ne fait que commenter ne devrait pas
>   être présenté au même niveau que ceux qui décident ;
> - **la borne manquante est un cas particulier de R9** : l'en-tête du nœud `statine` pose que la
>   population prouvée est « CARDS = 40-75 ans », et rien n'en découle — un DT2 de 30 ans reçoit
>   « Recommandée » sans réserve d'extrapolation.

---

## R6 — L'argumentaire est SITUATIONNEL, jamais encyclopédique

**Règle.** Le « pourquoi cette option » doit nommer **le ou les critères de ce patient** qui l'ont fait
proposer — pas l'ensemble des critères qui *pourraient* la faire proposer. Une règle est un objet
d'auteur ; une justification est un objet de consultation. Les deux ne se confondent pas.

**Le cas.** `EvaluateNodeResult.reasons` vaut `[...option.conditions]` : la liste **littérale** des
règles, recopiée sans tenir compte de ce qui était vrai. `describeReasons` met ensuite en forme
l'expression entière, branches `OR` comprises. Pour un patient dont seule la maladie athéromateuse est
établie, la carte iSGLT2 affiche *« Insuffisance cardiaque = Oui **ou** DFG < 60 **ou** … »* — soit une
énumération de cas, dont le premier se lit comme **une affirmation fausse sur le patient**. Défaut de
sécurité d'affichage, pas de confort de lecture.

Second défaut de la même famille : le formateur ne reconnaît que les opérateurs de comparaison ;
`contient` / `ne_contient_pas` ne matchent pas son expression régulière et sont **rendus bruts** — un
jeton du DSL présenté au clinicien, exactement le défaut déjà attrapé en red-team sur le sentinel
`toujours`, jamais recherché ailleurs.

**Ce qu'il faut renvoyer.** Le DSL n'ayant pas de parenthèses et `AND` étant prioritaire sur `OR`, toute
expression est une disjonction de conjonctions. La justification d'une option est l'ensemble des
**termes `OR` réellement vrais** — en général un seul, plusieurs quand le patient cumule les indications
(ce qui est alors une information clinique, pas du bruit). Le formateur doit **réutiliser l'évaluateur du
moteur** au lieu de retokeniser : c'est la seule façon de garantir que ce qui est affiché est ce qui a
été évalué, et cela corrige au passage la fuite `ne_contient_pas`.

**Deux couches de plus, gratuites.** Le moteur sait déjà, sans calcul supplémentaire :

- **pourquoi à ce rang** — la règle de `priorite` dont le `quand` a matché (`resolvePriorite`) explique
  pourquoi une option passe devant une autre. Décisif quand deux options se disputent la tête ;
- **ce qui la retirerait** — les `exclusions` de l'option, évaluées fausses ici. « Ce qui l'écarterait :
  DFG < 20, cétonémie » est une phrase de consultation, pas une note de bas de page.

**Corollaire de rédaction (contenu).** Dès lors que le moteur nomme le cas qui s'applique, la prose des
`avantages` cesse d'avoir à les énumérer. « À privilégier quand l'IC ou la maladie rénale prédomine »
devient redondant avec « proposé parce que : insuffisance cardiaque ». **Le contenu dit ce que fait
l'option ; le moteur dit pourquoi elle est là.** À appliquer à la relecture de chaque nœud.

> ⚠ **Même prérequis d'architecture que les alertes d'option.** Une justification situationnelle **varie
> avec les critères** : chez un patient qui devient albuminurique, la ligne « proposé parce que » gagne
> un motif alors que les options affichées, leurs rangs et leurs badges sont inchangés. La signature de
> pertinence, qui ne compare aujourd'hui qu'intitulés + badges + alertes, ne bougerait pas — et le
> critère serait **estompé comme « sans effet » alors qu'il modifie visiblement la carte**. C'est
> exactement le défaut récurrent, à sa cinquième occurrence. Deux issues, une seule est bonne : soit la
> justification entre dans la signature (automatique si l'écran et la signature dérivent d'un modèle de
> vue unique), soit on assume par écrit que la signature couvre *la décision* et non *le texte qui
> l'explique* — ce qui rouvre la contradiction estompé/affiché que la recette a déjà fait remonter une
> fois. **Livrer après l'unification, pas avant.**

**Arbitrage à trancher — indication vs prérequis.** Toutes les conditions vraies ne sont pas des
*raisons*. Sur l'option iSGLT2, `ASCVD_etablie == true` justifie ; `traitements_en_cours ne_contient_pas
iSGLT2` est un prérequis de cohérence dont l'énoncé n'apprend rien. Aucune règle mécanique ne les sépare
de façon fiable (la perturbation les rend toutes deux « décisives », et à juste titre). Deux livraisons
distinctes :

1. **mécanique, sans arbitrage** — ne renvoyer que les termes vrais. Supprime à la fois l'énumération
   des cas et l'affirmation fausse. Aucune décision clinique engagée ;
2. **schéma + contenu** — séparer `conditions` (l'indication, ce qui justifie) de `prerequis` (les
   garde-fous de cohérence, silencieux à l'écran). Migration de contenu nœud par nœud.

---

## R7 — Le moteur ne se prononce jamais sur ce qu'il ignore

**Règle.** Un critère non renseigné vaut `indetermine` — troisième état, distinct de `0`, de `false`
et de la première valeur d'énumération. Évaluation ternaire. Une option dont une `conditions`,
`prerequis` ou `exclusions` est indéterminée passe **en attente** : ni proposée, ni écartée. Alertes,
doses calculées et dérivés indéterminés ne s'affichent pas.

**Le cas.** Formulaire vierge : `statine` désignait un tier sur trois champs vides et l'affichait en
justification (« Ancienneté < 10 et Autres FDRCV = 0 et Diabète compliqué : non ») ; `prescription`
**écartait la metformine** sur un `DFG < 30` jamais saisi ; `insuline` affirmait simultanément une
insuffisance rénale (DFG vide → `< 45`) et un objectif glycémique atteint (HbA1c vide → `0 <= cible`).
Sur les 5 nœuds, 86 règles portent sur un `nombre`/`enum` : **56 penchent vers le rassurant, 16 vers
l'alarmant** sur valeur par défaut. C'est l'asymétrie — le même vide lu dans deux sens opposés — qui
fait le défaut, pas le sens choisi.

**Spécification complète** : `validation/chantier-2026-07-26/SPEC-valeur-indeterminee.md` §2.
**Décision** : D20. **Invariant de banc** : I3.

**Ce que la règle rend obligatoire pour un nouveau nœud.** Déclarer, pour chaque `bool`/`liste` dont
le « non » ne peut pas être présumé sans risque, un `confirmation_requise` — un drapeau de sécurité
non coché n'est pas une réponse. Et vérifier, avant de figer les conditions, dans quel sens penche
chaque règle sur valeur manquante : c'est un tableau à produire à l'écriture, pas un audit à faire
après.

---

## R8 — Un fait de sécurité a un canal, et un seul

**Règle.** Aiguillage selon ce que le fait *fait au geste* :

- il rend un geste **contre-indiqué** → `options[].exclusions`, affichée avec son motif (R4) ;
- il **qualifie** un geste sans l'interdire → `options[].alertes` ;
- il est vrai **quel que soit le geste retenu**, mais **pas pour tous les patients** → `alertes` de nœud ;
- il est vrai **pour tous les patients du nœud** → `cadrage` (D24), rendu en tête, sans condition.

Deux interdits : `priorite` ne porte **jamais** un fait de sécurité (rétrograder n'est pas retirer) ;
une alerte de nœud n'a **jamais** `quand: "default"` (elle s'affiche alors pour tout le monde, donc
pour personne).

> **Le quatrième canal est venu du second interdit** (2026-07-26). Deux nœuds portaient en
> `quand: "default"` un énoncé qu'aucun critère ne pouvait conditionner — il ne parlait pas du patient
> mais de l'état des preuves du nœud (« l'insuline n'a pas de bénéfice cardiovasculaire démontré » ;
> « la décision se grade sur le risque absolu, pas sur une cible LDL »). La dette était insoluble tant
> que `alertes` restait le seul canal disponible : le défaut n'était pas le texte, c'était le canal. Test
> pratique quand on hésite entre les deux — **une alerte qu'on n'arrive pas à conditionner est presque
> toujours un cadrage qui s'ignore.**

**Le cas.** Six couples où une alerte interdit ce qu'une carte prescrit. Les deux plus nets :
« **ne pas INITIER une statine** » (dialyse) au-dessus de « Statine de haute intensité — prévention
secondaire, délai du bénéfice 5-6 ans » ; « **ne pas poursuivre la titration de la basale** » au-dessus
de « Titrer la basale (augmenter la dose) — Basale après +2 U ≈ 42 U/j ». Cause mécanique : une alerte
de nœud est évaluée sur les seuls critères, jamais sur ce que le moteur a retenu — elle ne peut pas
savoir qu'elle contredit la carte affichée juste en dessous.

**Le malentendu levé.** D3 interdit les **scores cachés**, pas les **règles**. Une `exclusion` sur
`dialyse == true`, affichée avec son motif, est l'exact opposé d'un arbitrage caché : c'est un
arbitrage déclaré, sourcé et rendu à l'écran. Avoir conflaté les deux avait fait glisser des interdits
de sécurité dans un canal sans pouvoir de retrait.

**Décisions** : D21, puis D24 (le canal `cadrage`). **Invariants de banc** : I6 (aucune alerte de nœud en
`quand: "default"` — **sans exception depuis le 2026-07-26**) et I7 (une alerte au libellé prohibitif
implique un **garde-fou** correspondant — `exclusions` *ou* `prerequis`, les deux retirant réellement une
option).

**Ce que I7 ne demande pas** — deux erreurs de catégorie à ne pas commettre en le lisant. *Primo*, une
injonction à **arrêter** un traitement en cours n'est pas une interdiction : R3 exige justement qu'elle
soit une **option** à part entière, jamais une `exclusion`. *Secundo*, une alerte peut porter sur un geste
qui appartient à un **autre nœud** (« le sulfamide est contre-indiqué — cf. nœud prescription ») : le nœud
courant ne l'offre pas, il ne peut pas l'exclure. L'invariant est local par construction ; ces cas sont
recensés un par un, avec leur motif, plutôt que dispensés en bloc.

> **Couplage à ne pas casser.** Transformer une alerte prohibitive en `exclusion` peut **vider** un
> nœud en `ordered-first-match` — sur `statine`, l'exclusion dialyse sans les critères
> `statine_deja_en_place` / `intolerance_statine` supprimerait les 3 options sans repli. Le canal de
> sortie se change **après** avoir donné au nœud de quoi dire autre chose.
>
> **La suite, et sa forme générale** (2026-07-27, `statine` v1.8). Quand l'intolérance avérée a dû, à son
> tour, retirer les options de statine, la solution n'a pas été de renoncer : c'est **une option terminale
> placée juste avant le repli** qui donne au nœud de quoi dire autre chose. Trois conséquences à
> connaître avant d'en écrire une :
>
> - **Ne pas exclure le repli.** L'instinct est de poser la même `exclusion` sur le `default` ; elle est
>   **inatteignable**, l'option terminale ayant déjà gagné pour exactement ces patients. L'invariant de
>   couverture du banc le signale, mais autant ne pas l'écrire : un garde-fou décoratif se relit comme une
>   protection réelle.
> - **C'est l'ORDRE qui protège, et ça se documente dans l'option protégée.** Déplacer la terminale, ou
>   restreindre ses `conditions`, rouvre la faille sans qu'aucune `exclusion` n'ait bougé — un
>   remaniement parfaitement innocent en apparence.
> - **Les conditions de la terminale et les exclusions qu'elle relaie doivent rester exactement
>   complémentaires.** Toucher à l'une sans l'autre casse I2′ (jamais de sortie vide) dans un sens, ou
>   rend la terminale inatteignable dans l'autre.

**`visible_si` ne porte jamais un fait de sécurité.** Il n'est lu que par la couche formulaire
(`lib/formLayout.ts`) ; le moteur l'ignore. Un critère dont la portée est conditionnelle — `CK_sup_5N` ne
vaut qu'avant initiation — doit répéter cette condition **dans chaque expression qui le lit**
(`CK_sup_5N == true AND statine_deja_en_place == false`), et pas seulement dans son `visible_si`. Sinon
une valeur saisie puis masquée continue d'agir : le praticien coche la case, déclare ensuite la statine en
cours, et son patient est retiré d'une option à laquelle il a droit. La redondance est **voulue** : le
`visible_si` sert la saisie, le terme conjonctif sert le raisonnement.

---

## R9 *(proposition, non arbitrée)* — Un nœud qui recommande un geste doit savoir si le geste est déjà fait

**Règle proposée.** Toute option qui prescrit une action (introduire, initier, ajouter, majorer) doit
disposer d'un critère lui disant si cette action est **déjà en place**, ou bien le nœud doit déclarer
explicitement, dans `population_cible`, qu'il ne traite que l'initiation. Le silence sur ce point n'est
pas neutre : il produit une injonction absurde chez un patient déjà traité.

**Les cas — la même faute dans trois nœuds sur cinq :**

| nœud | ce que l'outil a dit | à qui |
|---|---|---|
| `prescription` | « Envisager l'insuline » | patient dont « Insuline » est cochée |
| `prescription` | « Metformine — **instaurer** ou poursuivre » | patient sous metformine, en même temps que « réduire la posologie de la metformine » |
| `insuline` | « **Initier** une insuline basale » + dose de départ calculée | situation « Naïf » **et** « Insuline basale » cochée, sans alerte de cohérence |
| `statine` | « Statine de haute intensité » | nœud sans aucun critère « statine déjà en cours » |

**Le corollaire qui coûte le plus cher.** Sur `statine`, l'alerte dialyse se termine par « *Si une
statine est déjà en place, sa poursuite est raisonnable* » — une nuance clinique juste, **structurellement
inapplicable**, puisque le nœud ne pose jamais la question. Une réserve écrite en prose et non
adossée à un critère n'est pas une réserve : c'est une décoration.

**D'où la forme testable de la règle** : *tout concept nommé comme réserve dans la prose d'un nœud
(« si déjà en place », « CARDS 40-75 ans », « en cas d'intolérance ») doit être **soit** un critère
d'entrée, **soit** déclaré hors périmètre dans `population_cible`.* Un troisième statut — mentionné
mais ni collecté ni exclu — n'existe pas.

Le référent a déjà tranché le premier cas d'application (ajout de `statine_deja_en_place` et
`intolerance_statine`, 2026-07-26) ; ce qui reste à arbitrer est la **généralisation** en règle
opposable à tout nouveau nœud, et l'invariant de banc correspondant.

---

## Le banc d'un nœud — trois couches (généralisation de R5)

Un banc de vignettes cliniques ne suffit pas, et l'agrandir ne suffit pas davantage. Sur les six défauts
qui ont motivé ce document, **quatre vivaient entre le moteur et l'écran** — une donnée calculée jamais
rendue, un argumentaire générique, un jeton du DSL affiché brut, un badge désaccordé des familles. Un
banc qui appelle `evaluateNode` et vérifie `applicable` n'atteint pas cette zone, quel que soit le nombre
de profils. C'est structurel, pas quantitatif.

**Sur quoi assertionner.** Dès qu'un modèle de vue unique existe (`construireVueDecision`), le banc
s'exécute contre **ce que le praticien voit**, et non contre la seule liste d'options. L'unification
écran ↔ signature n'est donc pas qu'un correctif d'architecture : c'est ce qui rend cette zone testable.

**Trois couches, dont deux ne coûtent aucune relecture clinique.** C'est le point décisif pour la
soutenabilité : valider la sortie exacte de 200 profils demande 200 relectures ; une *propriété* se
valide une fois et couvre tout l'espace.

| couche | contenu | validation |
| --- | --- | --- |
| **Vignettes** | patients réels, sortie exacte attendue | **clinique**, une par vignette — donc peu nombreuses, choisies pour ce qu'elles seules peuvent dire |
| **Couverture** | chaque option se déclenche ≥ 1 fois et est exclue ≥ 1 fois ; chaque exclusion est déclenchée ≥ 1 fois ; chaque règle de `priorite` conditionnelle matche ≥ 1 fois ; chaque critère est décisif ≥ 1 fois (R5) | **aucune** — purement mécanique |
| **Invariants** | propriétés vraies pour *tout* profil, vérifiées sur un échantillon déterministe (produit cartésien quand il reste petit, sinon tirage stratifié à graine fixe ; ~800 à 2000 profils par nœud, aucun appel externe) | **clinique, une fois par invariant** |

> **Coût réel : ~23 s pour le banc complet**, et non « moins d'une seconde » comme je l'avais estimé en
> écrivant cette section. Le coût est presque entièrement dans R5 (`criteresPertinents` perturbe chaque
> critère sur chaque valeur candidate, soit un `evaluateNode` complet par combinaison) : 12,3 s sur
> `prescription`, 8,4 s sur `insuline`, moins de 0,5 s sur tous les autres. Les couches couverture et
> invariants hors R5 restent sous 200 ms. C'est supportable en CI et à la validation d'un nœud, pas à
> chaque sauvegarde — si le confort de développement en souffre, isoler R5 dans un script à part plutôt
> que d'affaiblir l'échantillonnage.

La couche *couverture* est celle qui détecte les règles mortes — un critère collecté qui n'agit nulle
part, une exclusion qu'aucun profil ne déclenche, une branche de `priorite` inatteignable. C'est le test
de R5, généralisé aux options et aux règles.

**Invariants du domaine DT2** (validés par le référent, 2026-07-25) — modèle de ce qu'un domaine doit
déclarer :

1. jamais une option affichée dont une exclusion est vraie ;
2. jamais de sortie vide *(aurait détecté le trou « sortie muette » M3 de la fusion B+C+D)* ;
3. jamais gliptine et AR GLP‑1 proposés ou maintenus ensemble ;
4. jamais de sulfamide proposé si DFG < 30 ;
5. si un agent sans bénéfice dur est en cours **et** qu'un agent à bénéfice d'organe est proposé à
   l'ajout, alors le verdict sur le premier est proposé aussi *(le défaut de la recette référent, exprimé
   comme propriété plutôt que comme cas)* ;
6. à profil identique, `fragilite: true` ne produit jamais **plus** d'options dans la famille « Agent à
   ajouter » *(la propriété qui manquait à R5)* ;
7. aucun agent **purement glycémique** ajouté chez un patient `sous_objectif`, **hors gate catabolique**
   (glucotoxicité, cétonémie), qui relève de l'urgence métabolique et non du contrôle glycémique.

> ⚠ **Le n° 7 a dû être resserré deux fois, pour le même motif.** Première formulation : « aucun ajout
> chez un patient `sous_objectif` » — faux, un iSGLT2 en insuffisance cardiaque reste indiqué quelle que
> soit la glycémie (HAS R.64‑66 grade A ; ADA 13.14d interdit même de le retirer pour désintensifier).
> Deuxième : « aucun agent purement glycémique » — encore faux, l'insuline d'un état catabolique se
> déclenche sur la cétonémie sans regarder la position, et à raison : un patient peut être à sa cible,
> voire en dessous, **et** en cétose — c'est l'acidocétose euglycémique sous iSGLT2.
>
> **La règle générale : les garde-fous d'urgence sont orthogonaux à la position vs objectif.** Tout
> invariant formulé sur la position doit les exclure explicitement. Un invariant trop large est pire
> qu'absent — il force à encoder une règle fausse pour le faire passer, ce qui est exactement l'inverse
> du service qu'on lui demande. Quand un invariant échoue, la première question n'est donc pas « quel
> contenu corriger » mais « l'invariant dit-il vraiment ce que je voulais dire ».

---

## Additions au schéma (`schema/noeud.schema.json`)

Quatre champs optionnels au schéma, aucun changement de la boucle de résolution du moteur.

| champ | emplacement | type | effet moteur |
|---|---|---|---|
| `nature` | `criteres_entree[]` | enum `etat` \| `intention` \| `terrain` \| `preference` | **aucun** — sert au test R1 et au groupement |
| `delai_benefice` | `options[]` | string | **aucun** — affichage seul (R2) |
| `alertes` | `options[]` | même forme que `Noeud.alertes` | rendues **seulement si l'option est applicable** |
| `cadrage` | racine du nœud | `string[]` | **aucun** — positions de lecture rendues en tête, sans condition (D24) |

Les alertes portées par une option répondent à deux besoins d'un coup : la réserve
délai/horizon de R2, et le défaut constaté en recette où une alerte de nœud s'affichait à propos d'un
traitement que le moteur venait justement d'écarter (l'expression `quand` d'une alerte de nœud ne voit
que les critères, jamais ce que le moteur a retenu).

> ⚠ **Prérequis d'architecture.** Les alertes d'option ajoutent une dimension à ce qui est affiché.
> Tant que la signature de pertinence (`engine/relevance.ts`) reconstruit l'écran à la main, chaque
> dimension ajoutée doit y être répercutée manuellement — oubli déjà commis trois fois. Ce champ ne
> doit être livré qu'**après** l'unification écran/signature sur un modèle de vue unique.

---

## Ce que ça change dans les fichiers existants

| fichier | changement |
|---|---|
| `docs/decision/BRIEF_DECISION.md` | §5.1 (schéma d'un nœud), §6 (variables communes), §7 (logique décisionnelle) → renvoient ici au lieu de redécrire ; §11 (gabarit) gagne `delai_benefice` et `nature` |
| `docs/decision/00-global.md` | reste **DT2** (pipeline de preuve, sourcing, état des nœuds) ; son titre « grammaire commune » revient à ce document |
| `schema/noeud.schema.json` | les trois champs ci-dessus |
| `DECISIONS.md` | une décision D-nnn actant R1→R5 ; l'incertitude « chaînage inter-nœuds A→prescription » ([prescription.yaml](../../content/noeuds/diabete-type-2/prescription.yaml) `incertitudes`) est **close par R1** : pas de chaînage, une question directe |
| banc de vignettes de chaque nœud | ajout du test R5 |

---

## Application au nœud `prescription` (DT2)

**R1.** Nouveau critère saisi `position_vs_cible`, posé juste après l'HbA1c, libellé « par rapport à
l'objectif que vous avez fixé pour ce patient » :

```yaml
- nom: position_vs_cible
  type: enum
  nature: etat
  groupe: Traitement actuel et contrôle
  valeurs: [sous_objectif, a_l_objectif, au_dessus, nettement_au_dessus]
```

```yaml
# AND est prioritaire sur OR et le DSL n'a pas de parenthèses : forme normale disjonctive obligatoire.
cible_atteinte:              "position_vs_cible == a_l_objectif OR position_vs_cible == sous_objectif"
palette_glycemique_ouverte:  "intention == intensifier AND position_vs_cible == au_dessus
                              OR intention == intensifier AND position_vs_cible == nettement_au_dessus
                              OR intention == initier AND position_vs_cible == nettement_au_dessus"
```

`intention` est conservée : elle reste un primer légitime (elle organise le flux et pilote les
`visible_si`). Elle cesse simplement d'affirmer un état.

Deux défauts indépendants tombent avec ce changement :

- le seuil absolu `HbA1c_actuelle >= 8.5` de `palette_glycemique_ouverte` était **aveugle à la cible** :
  un patient fragile naïf à 8,7 % dont l'objectif est < 9 % déclenchait une bithérapie d'emblée. Remplacé
  par `nettement_au_dessus`, qui est relatif à l'objectif ;
- le sur-traitement n'était détecté que par le garde-fou absolu `< 6,5 %`. Un patient fragile à 6,8 %
  dont l'objectif est < 9 % ne déclenchait rien. `sous_objectif` le capte, tout en gardant
  `hba1c_sous_cible` comme garde-fou dur indépendant.

**R3.** L'option « Remplacer la gliptine par un AR GLP-1 » devient **« Remplacer la gliptine (aucun
bénéfice sur critère dur — préférer un agent qui en apporte) »** : une seule option, sur le modèle déjà
correct de l'option sulfamide, dont les **exclusions sont structurelles** (gate catabolique seulement) et
dont le texte explique le choix du remplaçant. `IMC < 22` et `denutrition` — les garde-fous de l'AR
GLP-1, pas du verdict — la quittent. Sa liste de déclenchement
`ASCVD_etablie == true OR IMC >= 30 OR cible_atteinte == false` disparaît : **le verdict sur un agent
sans bénéfice dur n'a pas à être justifié par une comorbidité** (décision référent). Même traitement pour
l'option sulfamide, qui portait la même liste.

> **Correction d'une seconde erreur de ce document.** Cette section a d'abord décrit une **scission** en
> deux options, « arrêter » (à l'objectif) et « remplacer » (au-dessus). C'est la même faute que celle
> déjà corrigée plus haut dans la forme canonique de R3, restée ici par inadvertance : le déclencheur du
> verdict est la **présence de la ligne**, pas la position glycémique. Le sulfamide n'a d'ailleurs jamais
> été scindé dans le contenu réel, et c'est lui le modèle. Signalée par l'agent chargé d'appliquer la
> levée, qui a suivi sa consigne plutôt que ce paragraphe — bon réflexe.

**La non-association gliptine + AR GLP-1** cessait d'être garantie « par construction » : la condition
`ne_contient_pas gliptine` de l'option AR GLP-1 empêchait cette classe d'être jamais la **destination**
d'un switch de gliptine. Elle est levée, et la garantie devient **d'affichage** — le verdict sur la
gliptine se déclenchant désormais sur sa seule présence, l'AR GLP-1 ne peut plus apparaître hors contexte
de switch — plus une alerte de nœud reprenant la règle dure déjà sourcée (Nauck 2017 ; ADA §9 ;
KDIGO PP4.2.3 ; HAS R.80). Échange assumé : plus juste cliniquement, plus fragile en principe.

**Le profil de recette, après** — sortie réelle du moteur, pas une projection. *Optimiser, metformine +
gliptine, HbA1c 8 à l'objectif, ASCVD, DFG 70, IMC 20, 70 ans, fragile, espérance de vie limitée* :

| famille | sortie |
| --- | --- |
| Socle | Metformine — instaurer ou poursuivre |
| Agent à ajouter | Introduire un iSGLT2 — *délai du bénéfice : 16-26 mois* *(R2, absent avant)* |
| Traitement à corriger | **Remplacer la gliptine** — aucun bénéfice sur critère dur *(R3, absent avant)* |
| Écartées | « Introduire un AR GLP-1 » — IMC < 22 *(R4, muet avant)* |
| Alerte | Non-association incrétine *(garantie qui remplace le verrou structurel)* |

Avant : metformine + « Introduire un iSGLT2 » badgé Recommandée, et rien d'autre — la gliptine
poursuivie sans le moindre verdict, un agent ajouté par-dessus.

---

## Ordre de livraison

| | règle | nature | dépend de |
| --- | --- | --- | --- |
| 1 | **R1**, **R3** | contenu pur | rien — corrigent à eux seuls l'essentiel de la recette |
| 2 | **banc — couches couverture + invariants** | test | rien ; s'exécute sur `evaluateNode` dès maintenant, à rebrancher sur le modèle de vue à l'étape 3 |
| 3 | *(unification écran ↔ signature sur un modèle de vue unique)* | architecture | — |
| 4 | **R6** livraison 1, **R2**, alertes d'option | moteur + schéma + écran | l'étape 3 |
| 5 | **R4** | moteur (tracer les échecs de condition) + affordance UI | l'étape 3 |
| 6 | **R6** livraison 2 | schéma + migration de contenu | arbitrage indication/prérequis |

L'étape 3 n'est pas une préférence de style : R2, R4 et R6 ajoutent chacune une dimension à ce qui est
affiché. Tant que la signature de pertinence reconstruit l'écran à la main, chacune rouvre le même
défaut — quatre occurrences constatées, deux de plus programmées si l'ordre n'est pas tenu.

---

# Construire un nouveau module — voir le document dédié

L'**ordre** dans lequel construire un module (cadrage par la consultation, vignettes gelées avant le
contenu, écran maquetté avant la collecte, double vérification fidélité / comportement), les
**checklists opposables** par critère / option / alerte / nœud / module, et le **tableau des pièges
constatés** vivent dans un document séparé :

> **[`CONSTRUIRE-UN-MODULE.md`](CONSTRUIRE-UN-MODULE.md)** — spécification de construction, tous
> domaines.

Séparation volontaire : **ce document-ci énonce les règles** qu'un nœud doit respecter, et se consulte
*pendant* l'écriture ; l'autre énonce le **procédé**, et se suit *avant et autour*. Les mélanger rendait
les deux moins utilisables — la grammaire cessait d'être une référence courte, le procédé se noyait
dans des règles d'écriture.
