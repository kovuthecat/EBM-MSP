# Grammaire de modélisation d'un nœud de décision — **générique, tous domaines**

> **Statut** : proposition issue de la recette du nœud `prescription` (2026-07-25), à valider.
> **Portée** : ce document ne parle **d'aucun domaine clinique**. Il énonce les règles que doit
> respecter l'écriture de n'importe quel nœud, DT2 ou futur domaine. Le *quoi* clinique reste dans
> `docs/decision/noeuds/` ; la *méthode de sourcing* reste dans `00-global.md` (DT2) ; le *contrat
> exécutable* reste dans `schema/noeud.schema.json`.

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
7. aucun agent **purement glycémique** ajouté chez un patient `sous_objectif`.

> ⚠ Le n° 7 a d'abord été formulé « aucun ajout chez un patient `sous_objectif` » — **faux** : un iSGLT2
> en insuffisance cardiaque reste indiqué quelle que soit la glycémie (HAS R.64‑66 grade A ; ADA 13.14d
> interdit de le retirer pour désintensifier). Un invariant trop large est pire qu'absent : il force à
> encoder une règle fausse pour le faire passer.

---

## Additions au schéma (`schema/noeud.schema.json`)

Trois champs optionnels au schéma, aucun changement de la boucle de résolution du moteur.

| champ | emplacement | type | effet moteur |
|---|---|---|---|
| `nature` | `criteres_entree[]` | enum `etat` \| `intention` \| `terrain` \| `preference` | **aucun** — sert au test R1 et au groupement |
| `delai_benefice` | `options[]` | string | **aucun** — affichage seul (R2) |
| `alertes` | `options[]` | même forme que `Noeud.alertes` | rendues **seulement si l'option est applicable** |

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

**R3.** L'option « Remplacer la gliptine par un AR GLP-1 » se scinde en « Arrêter la gliptine » (à
l'objectif) et « Remplacer la gliptine par un agent à bénéfice d'organe » (au-dessus), sur le modèle
déjà correct de l'option sulfamide. La liste de déclenchement
`ASCVD_etablie == true OR IMC >= 30 OR cible_atteinte == false` disparaît de la branche « arrêter » :
**déprescrire un agent sans bénéfice dur n'a pas à être justifié par une comorbidité.** Même traitement
pour l'option sulfamide, qui porte la même liste.

**Le profil de recette, après.** *Optimiser, metformine + gliptine, HbA1c 8 à l'objectif, ASCVD, DFG 70,
IMC 20, 70 ans, fragile, espérance de vie limitée* :

| famille | sortie |
|---|---|
| Socle | Metformine — poursuivre |
| Traitement à corriger | **Arrêter la gliptine** — aucun bénéfice sur critère dur *(R3, absent avant)* |
| Agent à ajouter | Introduire un iSGLT2 — *bénéfice attendu en 16-26 mois (NNT 19-31)* ⚠ *espérance de vie limitée : à mettre en balance* *(R2, absent avant)* |
| Écartées | « Remplacer la gliptine par un AR GLP-1 » — IMC < 22 *(R4, muet avant)* |

Avant : metformine + « Introduire un iSGLT2 » badgé Recommandée, et rien d'autre.

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
