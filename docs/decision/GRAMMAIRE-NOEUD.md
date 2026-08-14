# Grammaire de modélisation d'un nœud de décision — **générique, tous domaines**

> **Statut** : R1→R6 issues de la recette du nœud `prescription` (2026-07-25), livrées. **R7 et R8**
> ajoutées après la recette élargie du 2026-07-26 (nœuds `insuline`, `statine`, `rhd`) — R7 livrée
> (D20), R8 livrée (D21). **R9 est une proposition non arbitrée.** **R7 amendée et R10 ajoutée** après
> la recette navigateur du 2026-07-28 (D30, D32 ; `docs/decision/validation/recette-navigateur-2026-07-28.md`).
> **R6 amendée (volet rendu), R11 et R12 ajoutées (propositions non arbitrées)** après la revue de
> conception du 2026-08-04 (`docs/decision/validation/revue-conception-fable-2026-08-04.md`), qui a
> confronté l'audit du même jour au comportement réel des cinq nœuds.
> **R13, R14 et R15 ajoutées, R1/R5/R8/R10 enrichies** après le plan P14 (2026-08-06/07,
> `docs/decision/validation/table-conditions-2026-08-06.md` et
> `criteres-communs-2026-08-06.md`) — livrées, chacune adossée à un invariant de banc vert.
> **R16 ajoutée, R14 enrichie d'un corollaire**, après le plan P15 (panneau posologie, 2026-08-11/14) et
> la relecture en consultation du 2026-08-14 — livrées, adossées à I8b/I12/I34.
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

> **Précision ajoutée le 2026-08-04 — la question directe peut être pré-remplie, jamais escamotée.**
> La revue de conception a montré le coût du corollaire pris sans nuance : le praticien qui vient de
> faire fixer « Cible ≤ 7 % » par le nœud voisin doit re-juger à la main « Par rapport à l'objectif »
> deux clics plus tard — la conclusion que l'outil vient de rendre n'existe nulle part comme valeur de
> session. La forme compatible avec R1 : un nœud peut **exporter sa conclusion vers la mémoire de
> session** (D28), et le nœud qui pose la question directe la pré-remplit en valeur **suggérée**
> (« · calculé, à vérifier », statut `suggere` — D20 : jamais citée comme un fait du patient). Le nœud
> reste évaluable seul, la question reste posée, le praticien confirme — mais il ne recalcule pas de
> tête ce que l'outil vient d'afficher. Proposition non arbitrée, détail dans
> `validation/revue-conception-fable-2026-08-04.md` (P1).
>
> **Arbitrée le 2026-08-06 — `DECISIONS.md` D50** (amende D28), et la précision ci-dessus cesse d'être
> une proposition. Ce que D50 **autorise** : sur un nœud `ordered-first-match` et sur lui seul, l'option
> retenue **publie** en mémoire de session une valeur littérale déclarée par le contenu
> (`Option.publie: { critere, valeur }`) ; le **seul lecteur autorisé** de cette valeur est un
> `preremplissage` — elle ne fait donc que proposer un point de départ dans un champ que le praticien
> voit, confirme ou écrase. Ce que D50 **continue d'interdire**, et c'est le garde-fou qui rend
> l'amendement compatible avec R1 : qu'une valeur publiée atteigne une **règle** —
> `conditions`, `prerequis`, `exclusions`, `alertes[].quand`, `calculs[].expression`, le `derive` d'un
> autre critère, `visible_si`, `valeurs_visible_si`, `contraintes[].expression`,
> `familles[].prioritaire_si`. Aucune règle d'un nœud ne peut se chaîner sur la conclusion d'un autre.
> **Vérification** : invariant D50/T-179 (`engine/banc/invariants-contenu.test.ts`) — « un critère publié
> n'a aucun lecteur hors préremplissage », vert sur le contenu réel depuis P14/S11. Corollaire assumé,
> écrit dans D50 : un critère publié **sort définitivement du jeu de règles**, partout et pour tout
> domaine à venir.

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

**Ce qui compte comme LECTEUR — la liste est close, et elle est mécanisée** (ajouté le 2026-08-06,
P14/S2, T-164). La vérification par perturbation ci-dessus est *dynamique* : elle ne voit un critère que
s'il déplace une sortie sur un profil tiré. Elle sous-estime donc les critères qui n'agissent que par un
canal d'affichage — d'où un second contrôle, *statique*, qui lit le contenu au lieu de l'exécuter. Un
critère est lu s'il est cité dans au moins une de ces expressions du nœud :

`options[].conditions` · `options[].prerequis` · `options[].exclusions` · `options[].calculs[].expression` ·
`options[].alertes[].quand` · `Noeud.alertes[].quand` · `Noeud.contraintes[].expression` ·
`Noeud.familles[].prioritaire_si` · le `derive` d'un **autre** critère · le `visible_si` d'un **autre**
critère · `valeurs_visible_si` · **`preremplissage[].quand`**.

`preremplissage` compte comme lecteur — c'est le point qui a rendu `HbA1c_cible` légitime à nouveau sous
D50 : *proposer une valeur de départ est déjà « faire quelque chose »*. Ne comptent **pas** comme
lecteurs, délibérément : `priorite[].quand`, `action_si[].quand`, `contre_indications[].condition` — ils
nuancent un affichage sans jamais rendre ni retirer une option.

**Corollaire mesuré en P14 — une consigne dans une `aide` de saisie n'est PAS un lecteur.** Un fait peut
être *écrit* dans un nœud sans y être *lu* : `prescription` portait « Élevé si … hypoglycémie sévère
antérieure » dans l'`aide` d'un **autre** critère (`risque_hypoglycemie_schema`). Le fait apparaissait
donc à l'écran, mais aucune expression du nœud ne l'évaluait — l'outil demandait au praticien de faire
lui-même la traduction, puis raisonnait sur sa traduction. C'est la forme la plus trompeuse du critère
mort : elle passe la relecture humaine (« le fait est bien mentionné ») et échappe au contrôle dynamique
(il n'y a aucun critère à perturber). La forme correcte est un critère à part entière ; la clause
d'`aide` se retire **dans le même lot**, sans quoi la même question est posée deux fois, une en clair et
une noyée dans une case de synthèse. Résorbé le 2026-08-07 (P14/S19, T-192) — cf. **R15**, qui
généralise le cas.

**Vérification** : invariant T-164 (`engine/banc/invariants-contenu.test.ts`) — « tout critère déclaré a
au moins un lecteur », **vert**, qui complète la mesure dynamique de `couverture.test.ts` sans la
remplacer : la première dit qu'un critère est *cité*, la seconde qu'il *déplace une sortie*. Les deux
sont nécessaires.

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

**Volet rendu, ajouté le 2026-08-04 — R6 vaut pour TOUT texte de condition rendu, par UN SEUL chemin.**
La revue de conception du 2026-08-04 a montré R6 appliquée et violée **sur le même écran** : le motif de
carte disait « *Proposé parce que : Metformine déjà en cours et Dose de metformine excessive pour ce DFG
(30-44)* » (branche vraie, libellés nommés — R6 respectée) pendant que la ligne d'écartement, deux
centimètres plus bas, affichait la disjonction brute complète (« *Metformine écarté : Traitements en
cours comprend Metformine et DFG ≥ 45 et DFG < 60 et Dose > 2000 ou … ou …* » — trois branches, une
seule vraie). Même dédoublement sur `insuline` : « *Pas de MCG en place* » (libellé négatif déclaré) sur
une carte, « *MCG disponible : non* » sur la carte voisine. Le correctif de R6 avait été validé sur le
chemin « motif » et jamais porté sur le chemin « écartement » — c'est la famille « correctif non propagé
au nœud voisin », version rendu. Quatre conséquences :

- **un seul moteur de rendu de conditions**, partagé par les motifs de carte, les lignes d'écartement et
  le panneau « pourquoi pas » — deux implémentations divergent toujours, la question n'est que quand ;
- **les littéraux identiques d'une conjonction se dédupliquent** (constaté : « …et MCG disponible et
  TBR > 4 **et MCG disponible** et CV > 36 » — chaque sous-condition apportait son propre préfixe) ;
- **une citation négative passe par un libellé négatif déclaré dans le contenu** (« Pas de MCG en
  place »), jamais par le suffixe « : non » accolé au libellé positif, qui se lit à l'envers ;
- **un dérivé agrégatif se rend par ses composants vrais, jamais par son libellé générique.** Constaté
  sur `rhd-activite-physique` : « écarté : Signe imposant un avis avant la pratique structurée
  (limitation, ischémie d'effort, rétinopathie, pied) » énumère les quatre composants possibles sans
  dire lesquels sont vrais chez ce patient — réduire aux branches vraies ne suffit pas si l'agrégation
  a déjà effacé l'information.

**Les invariants de recette qui ferment la famille**, à exécuter sur le texte rendu de **tous** les
nœuds (c'est leur transversalité qui empêche le correctif local non propagé) : aucun texte rendu ne
contient « : non » ; aucun motif rendu ne contient une disjonction (« ou » suivi d'une conjonction) ;
aucun motif rendu ne répète un littéral ; aucune référence rendue ne parle du nœud lui-même (« ce
nœud », « encodé », « verbatim » — registre du changelog constaté dans deux titres d'essais du nœud
`insuline`).

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

**Volet écran, ajouté le 2026-07-28 (recette navigateur du 2026-07-28).** La règle ci-dessus est vraie du
**moteur** ; elle ne suffisait pas à empêcher l'**écran** de se prononcer sur ce qu'il ignore, par un
autre chemin. Complément : *une propriété affichée ne se recalcule jamais — elle se lit à la source qui
fait autorité pour le moteur.* Tout marqueur, compteur ou badge dérivé de l'état de saisie (« à
confirmer », « N critères non confirmés », un pourcentage de complétude) doit lire **la même fonction**
que celle qui décide côté moteur — jamais une reconstruction locale de l'écran (`touched` brut, un
filtre dupliqué, une liste recopiée).

**Le cas (volet écran).** `decisifsAConfirmer` (`lib/formLayout.ts`) marquait « à confirmer » et comptait
les « critères décisifs non confirmés » sur `!touched.has(nom)` — vrai pour tout `bool`/`liste` jamais
touché, y compris quand le contenu déclare `presomption_non: true` (le moteur, lui, le tient alors pour
DÉTERMINÉ et ne réclame plus rien). Sur `Fixer la cible d'HbA1c`, formulaire vierge, l'écran affichait
« Reco provisoire — 3 critères décisifs non confirmés » **sur la même page** que la carte « Cible
~6,5 % … Proposé parce que : … Fragilité : non » : le moteur avait tranché, l'écran continuait de dire
que rien n'était tranché. Corrigé (`DECISIONS.md` D30) en faisant lire à `decisifsAConfirmer` la
**même** fonction que le moteur (`determinesEffectifs`) plutôt qu'un filtre local — les deux couches ne
peuvent plus diverger, parce qu'elles interrogent la même source.

**Spécification complète** : `validation/chantier-2026-07-26/SPEC-valeur-indeterminee.md` §2.
**Décisions** : D20 (le moteur) ; D30 (le volet écran). **Invariant de banc** : I3.

**Ce que la règle rend obligatoire pour un nouveau nœud.** Depuis D30, un `bool`/`liste` non renseigné
est indéterminé par défaut, comme un `nombre`/`enum` — il n'y a plus de présomption de « non » à
couvrir par un drapeau de sécurité. Le champ de contenu est `presomption_non` : ne le déclarer que
pour les critères dont l'absence de réponse ne peut PAS nuire, établi **mécaniquement** (aucune
condition d'option `role: securite`, aucune `exclusions`, aucun `prerequis` ne le lit) — jamais sur un
critère qui participe, même indirectement, à une règle de sécurité. Et vérifier, avant de figer les
conditions, dans quel sens penche chaque règle sur valeur manquante : c'est un tableau à produire à
l'écriture, pas un audit à faire après.

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

**Portée exacte, et ce qui la complète — ajouté le 2026-08-06 (P14).** R8 est une règle **de nœud** :
elle dit *un canal, et un seul, à l'intérieur du nœud qui porte le fait*. Elle ne dit rien du nœud voisin
qui prescrit la même classe et ne déclare pas le fait du tout — c'est **R15** (« un fait de sécurité
appartient au DOMAINE, pas au nœud ») qui ferme ce second trou, en exigeant une déclaration **unique pour
le domaine** et un `concerne` qui désigne les nœuds à qui elle s'impose. Les deux ensemble seulement
ferment la question ; séparées, chacune laisse passer ce que l'autre attrape — R8 seule laisse passer
l'**absence**, R15 seule laisse passer le **mauvais canal**.

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

## R10 — Tout patient repart avec quelque chose

**Règle.** Un nœud ne doit jamais pouvoir produire un écran sans **conduite à tenir** ni **attente
explicite**. Pour tout patient, à tout instant de la saisie, l'écran affiche soit au moins une option
`applicable`, soit au moins une entrée `enAttente` qui nomme ce qui manque pour trancher — jamais les
deux vides à la fois.

**Pourquoi.** Un écran qui n'affiche rien n'est pas un écran neutre : le praticien qui l'obtient ne peut
pas distinguer « ce nœud n'a rien à dire pour ce patient » de « quelque chose s'est tu ». C'est la forme
la plus discrète des trois défauts les plus graves de la recette du 2026-07-28 — elle ne casse aucun
test tant qu'aucun test ne pose explicitement la question « et si rien n'est applicable ? », et elle a
donc survécu à cinq rapports d'audit et 769 tests unitaires.

**Ce que ça interdit — trois manières d'y arriver, toutes rencontrées :**

- une option `role: securite` rendue **inatteignable par l'ordre** du nœud (D-03 : intolérance avérée +
  prévention secondaire → zéro carte, alors qu'une option de sécurité plus loin dans l'ordre couvrait
  déjà ce patient — cause corrigée par D32) ;
- une **combinaison de critères non couverte** par aucune option ni aucun repli ;
- une **halte silencieuse** : le moteur suspend une décision (indétermination, R7/D20) sans que l'écran
  ne le dise (l'écran rendait `null` à l'emplacement des cartes ; corrigé côté écran par P4/S3, T-023 —
  le panneau de résultats nomme désormais explicitement ce qui est suspendu, ou, à défaut de toute
  option et de toute attente, dit que le nœud n'a rien à proposer dans son périmètre) ;
- **un repli dont les `prerequis` ne couvrent pas le domaine** (mesuré le 2026-08-06, P14/S2). Sur
  `prescription`, les deux options `role: repli` se partagent le domaine par `intention == initier` +
  `cible_atteinte == true` d'un côté, `intention != initier` de l'autre : la combinaison
  `intention == initier` **et** cible non atteinte n'a **aucun plancher**. Un nœud à 28 options pouvait
  donc rendre un écran vide, et c'est *l'arithmétique des `prerequis`* qui le disait — pas un profil.
  Les deux nœuds RHD portaient la forme extrême du même défaut : **aucune** option de repli du tout
  (résorbé par P14/S7, T-170, qui leur a donné à chacun un repli neutre).

**Comment on le vérifie.** Mécaniquement, sur tout nœud publié, sans aucune relecture clinique répétée :

- **I22** (`engine/banc/securite-atteignable.test.ts`) — toute option `role: securite` est
  `applicable` pour au moins un profil du banc ;
- **I23** (même fichier) — sur aucun profil valide du banc, `applicable` et `enAttente` ne sont vides en
  même temps ;
- **T-163** (`engine/banc/invariants-contenu.test.ts`, ajouté le 2026-08-06) — **la couverture
  STRUCTURELLE des replis** : la disjonction des `prerequis` des options `role: repli` couvre le domaine
  du nœud, vérifiée par **énumération finie** du produit des valeurs d'énumération (plafonné, avec repli
  sur « au moins un `default` inconditionnel » quand un critère n'est pas énumérable).

**Pourquoi la quatrième ne fait pas double emploi avec les trois autres, et pourquoi elle manquait.**
I22/I23 testent des **profils tirés** ; elles ne peuvent voir un trou de couverture que si le tirage
tombe dedans. La combinaison fautive de `prescription` n'a jamais été tirée — le nœud portait donc un
écran vide atteignable, invisible à ~770 tests, cinq rapports d'audit et une douzaine de recettes.
T-163 ne tire rien : elle **lit les `prerequis`** et démontre la couverture, ou nomme la combinaison qui
manque. Une propriété de couverture ne se vérifie pas par échantillonnage.

Un nœud ne se déclare pas vérifié (`CONSTRUIRE-UN-MODULE.md`, porte de sortie P6) tant que ces
invariants ne sont pas verts.

---

## R11 *(proposition, non arbitrée — 2026-08-04)* — La visibilité d'un critère ne gouverne jamais sa décisivité

**Règle proposée.** Pour toute valeur du primer (intention, situation), tout critère **décisif** sous
cette valeur doit être **soit saisissable** (sa section est affichée), **soit dérivé** de cette valeur
(valeur calculée, affichée « · déduit de …, à vérifier », modifiable). Masquer la section d'un critère
que le moteur continue de réclamer produit une impasse : l'écran demande l'impossible.

**Le cas — le défaut le plus grave de la recette du 2026-08-04 (N25).** L'intention *Initier* masque la
section TRAITEMENT (élégant : on ne déclare pas « aucun traitement » pour un patient naïf), mais le
critère `traitements_en_cours` reste décisif — l'option « Insuline d'initiation », dont ce patient à
cétonurie avait un besoin urgent, en dépend. Résultat, verbatim : « *À renseigner pour trancher :
Traitements en cours* » sous un formulaire qui n'a plus de section Traitements. L'option existait, était
bien écrite (motif, contre-indication, mise en garde DT1) et s'est rendue parfaitement dès que le
critère a été fourni par un autre chemin : **rien ne manquait au contenu, c'est le modèle
visibilité/décisivité qui était incohérent.**

**La forme correcte** est une **dérivation déclarée** : `intention == initier` ⇒ `traitements_en_cours
= ∅` — même mécanisme que la suggestion d'espérance de vie, même statut (`suggere`, jamais cité comme un
fait — R1 et D20 restent entiers : la dérivation remplit la question, elle ne l'escamote pas ; le
praticien la voit et peut la corriger en changeant d'intention).

**Complément à R8 §`visible_si`.** R8 couvrait déjà le sens « une valeur saisie puis masquée continue
d'agir » ; R11 couvre le sens inverse — « une valeur jamais saisissable continue d'être exigée ». Les
deux disent la même chose : `visible_si` est de l'ergonomie ; le moteur, lui, doit recevoir soit une
valeur, soit une dérivation, jamais un trou.

**Invariant de banc proposé.** Pour chaque valeur de primer : l'ensemble des critères décisifs
(`determinesEffectifs`) est inclus dans l'union {critères dont la section est visible} ∪ {critères
dérivés sous cette valeur}. Vérifiable mécaniquement, aucune relecture clinique.

---

## R12 *(proposition, non arbitrée — 2026-08-04)* — Une bascule de primer ne détruit jamais une saisie

**Règle proposée.** Changer la valeur du primer (intention, situation) change ce qui est **visible** et
ce qui **alimente le moteur** — jamais ce qui est **mémorisé**. Les valeurs des sections masquées sont
conservées et restaurées si la section réapparaît. Invariant : *pour toute saisie S et toute bascule
A→B→A, l'état final égale S*.

**Le cas.** Sur `prescription` : Optimiser → Initier → Intensifier fait revenir les sections TRAITEMENT
et TOLÉRANCE **vides** — metformine, dose et intolérance digestive détruites sans un mot. Sur
`insuline`, pire, parce qu'incohérent : Basale → Naïf → Basale perd MCG, TBR, CV, glycémie à jeun et la
dose de basale, mais **conserve** le profil nocturne — l'état restauré est alors contradictoire (un
profil AGP déclaré, aucun capteur déclaré) et le nœud le tolère en silence. Le praticien qui corrige sa
situation en cours d'entretien — cas réel et fréquent — perd des saisies sans le savoir, ou hérite d'un
état mixte qu'aucun écran ne signale.

**Pourquoi c'est une règle de grammaire et pas un bug d'écran.** La perte vient d'une confusion de
modèle : l'état du formulaire et sa visibilité vivent dans la même structure, si bien que démonter une
section démonte ses valeurs. La séparation état/visibilité est la même exigence que le volet écran de
R7 (« une propriété affichée se lit à la source qui fait autorité ») appliquée à l'écriture : la source
qui fait autorité pour une saisie est la mémoire de saisie, pas l'arbre des sections montées.

**Articulation avec R11.** Pendant qu'une section est masquée, ses valeurs mémorisées n'alimentent pas
le moteur (sinon une valeur invisible agirait — l'interdit de R8) ; c'est la **dérivation** de R11 qui
alimente le moteur sous cette valeur de primer. Les deux règles se livrent ensemble.

---

> ### R13 → R15 — les règles de la RELATION *(livrées, plan P14, 2026-08-06/07)*
>
> **Ce qui les motive, et qui vaut plus que chacune d'elles prise isolément.** Une lecture systématique
> des 84 cartes des 6 nœuds DT2 sous forme de **table des conditions**
> (`docs/decision/validation/table-conditions-2026-08-06.md`) a mis au jour neuf défauts. Ils ont
> survécu à ~770 tests unitaires, à une douzaine de recettes et à cinq rapports d'audit — **non par
> négligence, mais parce que rien ne les regardait** : les neuf sont **relationnels** (entre deux
> cartes, entre deux nœuds, entre un jeu de cartes et le domaine), alors qu'aucun artefact du procédé
> n'avait pour unité la relation. Les vignettes portent sur *un* patient, les invariants sur *une*
> propriété d'*une* carte, la recette sur *un* écran, le golden master sur *un* profil. Le seul
> instrument dont l'unité soit la relation était la table — et elle n'existait pas.
>
> D'où trois règles, une par échelle de relation : **R13** entre deux cartes d'un même nœud, **R14**
> entre deux nœuds, **R15** entre un nœud et son domaine.

## R13 — Un signal se partitionne : une valeur, une carte

**Règle.** Quand plusieurs cartes d'un nœud dépendent d'un même **signal clinique** — un profil, une
intention, une position, une situation —, les valeurs de ce signal doivent être réparties entre elles
**sans recouvrement**. Greffer sur une de ces cartes un déclencheur **étranger** au signal qui structure
ses voisines, c'est fabriquer une co-activation contradictoire : les deux cartes ne se disputent plus la
même partition, elles répondent à deux questions différentes tout en s'affichant côte à côte.

**Pourquoi.** Une partition est une garantie *par construction* : si les conditions couvrent le domaine
du signal sans se recouvrir, deux cartes de la partition ne peuvent pas être vraies ensemble, quel que
soit le patient. Un déclencheur étranger annule cette garantie sans que rien ne le signale — la carte
reste juste prise isolément, ses conditions restent vraies, sa source reste bonne. Le défaut n'est dans
aucune des deux cartes : il est **entre** elles.

**Ce que ça interdit — le cas réel.** Sur `insuline`, les conduites sur la basale sont structurées par
le **profil nocturne** (la courbe : à la cible, permet la titration, baisse continue). La carte « Ne pas
sur-titrer la basale — intensifier autrement » portait, en plus de sa branche de profil, un
`over_basalisation == true` — un **ratio dose/poids**, qui n'appartient pas à ce signal. Résultat mesuré
sur les 180 profils figés du banc : « Ne pas sur-titrer » et « Titrer la basale » **co-actives sur
2 profils**, c'est-à-dire deux conduites opposées sur le même geste, affichées ensemble. Les deux cartes
étaient individuellement sourcées et correctement écrites.

**Comment on le vérifie — deux instruments, à deux moments, et aucun ne remplace l'autre.**

- **À la conception, avant tout YAML** : le **brouillon de la table des conditions** (P5,
  `CONSTRUIRE-UN-MODULE.md`). Écrire deux options sur deux lignes d'un tableau, avec leurs `conditions`
  côte à côte, rend un recouvrement visible d'un coup d'œil — bien avant qu'il ne devienne 400 lignes de
  YAML. C'est le seul moment où corriger ne coûte rien.
- **Après coup, en cliquet, pour toujours** : l'**inventaire des paires co-actives**
  (`engine/banc/paires.test.ts`, **vert**), qui fige, nœud par nœud, quels intitulés s'affichent ensemble
  et sur combien de profils du banc — avec une section dédiée aux paires **intra-famille**, qui rend
  visible une famille `exclusive` dont deux alternatives coexistent. Un diff n'y est jamais une
  régression en soi : c'est un fait à relire carte par carte.

Le premier attrape ce qu'on s'apprête à écrire, le second ce qu'on a écrit ailleurs sans y penser. Le
défaut ci-dessus a été introduit par un lot qui ne touchait qu'**une** des deux cartes.

**Décisions** : **D52** (le cas mesuré — le ratio redevient une alerte, la courbe reste le signal qui
partitionne) et **D53** (son corollaire : dans un nœud, des voies d'escalade sont des *alternatives*,
pas des gestes cumulables — avec sa limite explicite, qui ne vaut pas pour les nœuds RHD).

---

## R14 — Un nom de critère porte une seule définition dans tout le domaine

**Règle.** Deux nœuds d'un même domaine ne peuvent pas définir différemment un critère qui porte le même
nom — `partage: true` ou non. La définition, c'est le `type`, les `valeurs`, le `derive`, les bornes :
tout ce qui dit *quel fait clinique ce nom désigne*. La **mise en scène** (le `groupe`, le
`visible_si`, l'ordre, le `preremplissage`) reste libre, nœud par nœud : elle ne change pas le fait.

**Pourquoi ça échappait.** Les invariants existants (I19, I32) ne couvrent que les critères déclarés
`partage: true` — précisément ceux dont l'auteur a *déjà* pensé qu'ils circulaient. Un critère qu'on a
recopié d'un nœud à l'autre sans le déclarer partagé n'était surveillé par rien, et c'est exactement le
cas où l'on diverge : on recopie de mémoire.

**Ce que ça interdit — les cas réels.** `cible_atteinte`, **calculé** dans un nœud (`derive`) et
**déclaré** dans l'autre : le même nom désignait tantôt une conclusion du moteur, tantôt une réponse du
praticien — la frontière que R1 protège, franchie sous un nom commun.
`terrain_cible_assouplie`, deux écritures distinctes du même terrain. Un praticien qui répond à la
question dans un nœud et la retrouve dans le voisin n'a aucun moyen de savoir qu'elle n'y veut pas dire
la même chose.

**Comment on le vérifie.** Invariant **T-162** (`engine/banc/coherence-inter-noeuds.test.ts`, **vert**) —
« un même nom de critère porte une même définition, au-delà de `partage: true` ». La signature comparée
exclut explicitement la mise en scène (`groupe`, `presomption_non`), pour ne mordre que sur la
définition.

**Ce que R14 ne dit pas, et c'est la moitié du sujet** : elle compare deux déclarations. Elle ne voit
donc jamais un nœud qui **ne déclare rien du tout** — cf. **R15**.

> **Corollaire ajouté le 2026-08-14 — quand le CONCEPT diverge, on cesse de le partager ; on ne force
> jamais la convergence.** R14 suppose que deux nœuds qui déclarent le même nom désignent le même fait,
> avec au plus une divergence d'**encodage** (type, valeurs, bornes) à corriger. Un troisième cas existe,
> plus profond qu'un encodage à réparer : le nom désigne **deux concepts voisins mais réellement
> différents** selon le nœud, et aucun encodage commun ne peut les représenter tous les deux sans en
> trahir un.
>
> **Le cas.** `preference_injection` — sur `prescription`, « refuse » signifie *refuse la voie
> injectable* (arbitre entre un AR GLP‑1 et une classe orale). Sur `insuline`, où tout traitement du nœud
> est déjà injectable par construction, cette lecture n'a plus d'objet ; la seule qui reste cohérente avec
> l'usage réel du nom dans ce nœud est *refuse plusieurs injections par jour* (arbitre entre un
> basal-bolus et une insuline prémélangée). Le même `type: enum` / mêmes `valeurs` masquait deux
> questions, et `partage: true` faisait circuler entre elles une réponse qui n'a le même sens nulle part.
>
> **La correction n'est pas de réconcilier la définition — c'est de cesser le partage.** Retirer
> `partage: true` du nœud où le concept a divergé. Si, en plus, la question n'a plus d'objet à poser au
> praticien sur ce nœud (ici : tout le nœud est déjà injectable), la masquer **inconditionnellement**
> (`cache: true`, cf. `content/node.types.ts`) plutôt que de la laisser vivante sous un sens qu'elle n'a
> plus — un `preremplissage` toujours vrai lui donne alors une valeur neutre, jamais lue par aucune règle
> de sécurité.
>
> **Piège à ne pas laisser rouvert : `cache` sans retrait de `partage` ne suffit pas.**
> `lib/sessionCriteres.ts` `valeursReprises` ne regarde pas `cache` — un champ masqué mais toujours
> `partage: true` continue de pouvoir **recevoir** une vraie réponse saisie sur l'autre nœud (via
> « Reprendre les valeurs de ce patient »), rouvrant exactement l'ambiguïté que le masquage visait à
> fermer. Les deux gestes vont ensemble, jamais l'un sans l'autre.

---

## R15 — Un fait de sécurité appartient au DOMAINE, pas au nœud

**Règle.** Généralisation de **R8**, qui ne valait jusqu'ici qu'à l'intérieur d'un nœud. Un fait qui peut
**contre-indiquer, retirer ou alerter** se déclare **une fois pour le domaine**
(`content/decision/criteres-communs/<domaine>.yaml`) et se réfère depuis les nœuds (`{ ref: <nom> }`). La
déclaration de domaine porte `concerne` : la liste des classes ou gestes qui rendent ce fait pertinent.
**Tout nœud qui prescrit une de ces classes déclare le fait, ou le range dans `criteres_hors_perimetre`
avec un motif écrit.** Il n'existe pas de troisième statut.

**Pourquoi — et c'est exactement la moitié que R14 ne dit pas : l'ABSENCE SILENCIEUSE.** Une divergence
de définition finit par se voir, parce qu'il y a **deux choses à comparer**. Une absence, elle, ne se
voit jamais : rien ne manque nulle part, le nœud est simplement **muet**. Aucun test ne peut réclamer un
critère dont il ignore qu'il devrait exister — sauf si quelqu'un, quelque part, a écrit que ce fait
concerne cette classe. C'est tout le rôle de `concerne` : il transforme une omission en contradiction
mécanique.

**Ce que ça interdit — les deux cas mesurés le 2026-08-06** (résorbés depuis, cf. ci-dessous) :

- `cetonemie` était déclarée dans `prescription` (elle y portait **deux** cartes de sécurité) et
  **absente d'`insuline`** — un nœud qui prescrit précisément l'insuline basale et l'insuline rapide,
  les deux classes que ce fait concerne. Le second nœud ne se contredisait pas : il ne disait rien ;
- `hypo_severe_recurrente` était déclarée dans `insuline` et, dans `prescription`, **repliée dans
  l'`aide` de saisie d'un autre critère** (« Élevé si … hypoglycémie sévère antérieure »). L'outil
  demandait au praticien de faire la traduction, puis raisonnait sur sa traduction. Une absence déguisée
  en présence — la pire des deux, parce qu'elle passe la relecture humaine (cf. R5, corollaire de
  l'`aide`).

Ordre de grandeur du terrain que la règle couvre : sur le premier domaine, **41 faits de sécurité, dont
36 mono-nœud** (`docs/decision/validation/criteres-communs-2026-08-06.md`). Quatre d'entre eux étaient
fautifs — et **aucune étape du procédé n'avait été sautée** : le procédé P0→P7 est entièrement *par
nœud*, aucune de ses huit étapes ne posait jamais une question au niveau du domaine.

**Comment on le vérifie.** Invariant **I33** (`engine/banc/invariants-contenu.test.ts`, P14/S16,
**vert** depuis le 2026-08-07) — « un fait de sécurité concerné par une classe prescrite est évalué, ou
déclaré hors périmètre ». Il porte **trois** garde-fous, pas un : l'absence silencieuse (le nœud
prescrit une classe concernée et ne déclare rien), la contradiction (le nœud déclare le fait **et** le
range hors périmètre), et la **déclaration morte** (un `criteres_hors_perimetre` qu'aucune classe
prescrite ne concerne — une dispense qui ne dispense de rien, et qui aveuglerait un ajout futur).

**Ce que la règle rend praticable, et qui n'allait pas de soi.** Le vocabulaire de sécurité d'un domaine
**ne peut pas être dressé exhaustivement à l'avance** — on découvre des faits en écrivant les nœuds. Ce
n'est donc pas un travail préalable, **c'est un cliquet** : le fichier commun s'ouvre avant le premier
nœud, même quasi vide, et tout fait de sécurité rencontré ensuite s'y écrit, **jamais dans le nœud**.
`concerne` fait le reste — ajouter un fait rend immédiatement rouge tout nœud **déjà écrit** qui prescrit
une classe concernée. Le domaine se ré-interroge tout seul à chaque ajout, sans que personne ait à
penser à relire les nœuds précédents. Procédé correspondant : `CONSTRUIRE-UN-MODULE.md`, **P1** (ouvrir
le fichier commun) et **P6** (quatrième point de la porte de sortie). Décision : `DECISIONS.md` **D54**.

**Une limite à connaître avant d'y ranger un champ.** Le partage porte sur la **définition**, jamais sur
la mise en scène — et `presomption_non` reste **local au nœud**, malgré les apparences : D30 fait
dépendre son éligibilité de l'usage du critère **dans ce nœud** (canal de sécurité ou non), jamais de la
nature du fait. Le rendre global le rendrait impossible à poser.

---

## R16 — La posologie affichée est un fait de sécurité : sourcée item par item, jamais en incise, conditionnable au patient

**Règle.** Le panneau posologie est le seul bloc de la carte qui **se recopie mot à mot sur une
ordonnance**. Trois conséquences de rédaction, mécanisées :

- chaque affirmation posologique porte sa **source**, résolue contre la bibliographie du nœud (un essai
  **ou** un texte de recommandation officielle — D16, une posologie vient légitimement d'un RCP ou d'une
  table de reco, pas seulement d'un essai) — **jamais une citation en incise** dans la phrase (« … dose
  maximale ajustée au DFG (KDIGO 2022 / RCP ANSM) ») ;
- une posologie qui dépend d'un **fait du patient** (présence d'un capteur, dose déjà en cours) se déclare
  **conditionnelle** (`quand`, même grammaire DSL qu'`exclusions`), jamais un seul texte générique qui
  suppose le cas le plus fréquent et se tait sur les autres ;
- la migration d'une citation en incise vers `sources` se fait **item par item, jamais par expression
  régulière** — une parenthèse n'est pas toujours une citation (trois faux positifs mesurés : la glose
  HAS R.87 « dans les deux sens », le protocole réel de FullSTEP, « BRIGHT, CONCLUDE » sujet de phrase).

**Le cas qui a fait la règle.** `insuline` recommandait une titration pilotée par la **glycémie
capillaire** (« glycémie à jeun 3 matins de suite ») à un patient porteur d'une **mesure continue du
glucose** — le texte de posologie contredisait le mode de surveillance que le même patient venait de
déclarer une section plus haut. Corrigé par le plan P15 (S9) : le texte se scinde selon
`mcg_disponible`, chaque branche sourcée séparément, l'absence d'algorithme piloté par MCG **dite**
plutôt qu'un protocole inventé (R7).

**Forme de contenu — `Option.posologie_detail`.** Tableau de **chaînes** (forme historique, prose seule)
ou d'objets `{ texte, sources?, quand?, accent? }` — les deux formes cohabitent dans le même tableau ; une
chaîne équivaut exactement à un objet sans les trois champs optionnels.

- **`sources`** — ids résolus contre **les deux registres** de bibliographie du nœud
  (`sources.references_primaires[].id` et `sources.reco_officielle.references[].id`, ce second registre
  ayant reçu un champ `id` à cette occasion). Un id absent des deux est ignoré **en silence** par la
  carte, par politique — le signaler est le travail d'un invariant de contenu (I8b), jamais d'un
  composant de rendu au milieu d'une consultation.
- **`quand`** — expression DSL sous laquelle l'item est affiché. FAUSSE au sens strict (jamais
  `INDETERMINE`, D20) **retire l'item de la liste rendue** — pas seulement son état visuel, à la
  différence de `contre_indications[].condition`, qui reste montrée « levée ».
- **`accent`** *(ajouté le 2026-08-14)* — registre visuel gras (« geste ») plutôt que muet (« modalité »).
  La règle historique (`index === 0` = gras, vérifiée sur 17 options) tient pour une option à **un seul
  geste** titré par paliers ; elle casse pour une option à **plusieurs molécules alternatives**, où le
  rang de déclaration — arbitraire — décide seul quelle molécule paraît en avant. Cas réel : `prescription`,
  option « AR GLP‑1 » — liraglutide en `posologie_detail[0]`, donc seul en gras, alors que c'est la
  molécule la **moins** prescrite des trois (injection quotidienne contre hebdomadaire pour les deux
  autres). Sans item `accent`, la règle historique s'applique **inchangée** — rétrocompatible par
  construction, aucune des options existantes n'a besoin d'être touchée.

> ⚠ **Même prérequis d'architecture que les alertes d'option, l'argumentaire situationnel et les
> contre-indications conditionnelles** (encadré de R6, sixième occurrence documentée du même défaut). Un
> critère qui ne pilote **que** la posologie affichée — aucune autre dimension de l'écran ne varie — doit
> tout de même entrer dans `signatureVue`/`criteresPertinents` : sans quoi il serait estompé à tort dans
> le formulaire de saisie (« sans effet »), alors qu'il change visiblement la carte.

**Vérification.**

- **I8b** (`engine/banc/invariants-contenu.test.ts`) — tout id cité dans `posologie_detail[].sources`
  existe dans l'un des deux registres du nœud qui le porte.
- **I34** (`engine/banc/citations-inlinees.test.ts`) — aucune incise de citation ne survit dans `apercu`
  ni `posologie_detail[].texte` ; les rares exceptions restantes sont **nommées, avec un motif tiré du
  changelog du nœud** (jamais une exemption générique) et **auto-expirent** : une exemption dont le texte
  cité a changé fait échouer le test, forçant à la retirer plutôt qu'à l'oublier.
- **I12** (`engine/banc/carte-affichage.test.tsx`) — le nombre de blocs « geste » rendus égale le nombre
  d'items `accent: true` du tableau, ou **1** par repli sur la règle historique en leur absence.

**Décision/plan** : arbitrage de doctrine du 2026-08-11 (`plans/P15/index.md` §Arbitrage — le choix des
deux registres). Livrée : plan P15 (S1→S10, 2026-08-11/14) puis relecture en consultation (2026-08-14, le
champ `accent`).

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

Champs optionnels au schéma listés ici (liste non exhaustive des additions depuis — `role`, requis,
D25 ; `presomption_non`, cf. R7 ci-dessus, D30 ; `posologie_detail`/`ItemPosologie`, cf. R16 — vivent
ailleurs dans ce document), aucun changement de la boucle de résolution du moteur.

| champ | emplacement | type | effet moteur |
|---|---|---|---|
| `nature` | `criteres_entree[]` | enum `etat` \| `intention` \| `terrain` \| `preference` | **aucun** — sert au test R1 et au groupement |
| `delai_benefice` | `options[]` | string | **aucun** — affichage seul (R2) |
| `alertes` | `options[]` | même forme que `Noeud.alertes` | rendues **seulement si l'option est applicable** |
| `cadrage` | racine du nœud | `string[]` | **aucun** — positions de lecture rendues en tête, sans condition (D24) |
| `action` | `options[]` | enum `ajouter`\|`remplacer`\|`arreter`\|`reduire`\|`maintenir` | **aucun** — pilote une bordure colorée sur la carte (badge verbe, D35) ; réservé aux nœuds dont le contenu porte déjà ce vocabulaire (`prescription`, `insuline`), jamais posé de force ailleurs |
| `posologie_detail[].sources` | `itemPosologie` | `string[]` | **aucun** — résolu par l'écran contre la bibliographie du nœud (R16) |
| `posologie_detail[].quand` | `itemPosologie` | string (DSL) | retire l'item de la liste rendue si faux/indéterminé (R16) |
| `posologie_detail[].accent` | `itemPosologie` | bool | **aucun** — registre visuel gras/muet (R16) |
| `cache` | `criteres_entree[]` | bool | masque le champ **inconditionnellement** ; sa valeur ne peut alors venir que d'une reprise (`partage`), d'une publication (D50) ou d'un `preremplissage` — jamais d'une saisie directe (corollaire R14) |

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
