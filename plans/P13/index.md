# Plan P13 — Ce que la revue de conception du 2026-08-04 a trouvé   (rédigé par Opus)

## Objectif d'ensemble

Traiter les constats de la revue de conception
(`docs/decision/validation/revue-conception-fable-2026-08-04.md`, qui absorbe et requalifie l'audit
`recette-praticien-naif-2026-08-04.md` du même jour) dans l'ordre de ce qu'ils coûtent au praticien :
d'abord le patient le plus urgent du banc qui repart sans sa carte, puis les saisies qui disparaissent
sans un mot, puis le langage machine à l'écran, puis ce que la session sait sans le transmettre, enfin
le contenu et les finitions.

**Aucun changement de conduite clinique n'est décidé par ce plan.** Les seules décisions cliniques
qu'il sollicite sont deux équivalences de vocabulaire (§Arbitrages), portées au référent avant S1.

**Le fil rouge de P12 vaut encore, déplacé d'un cran** : P12 réduisait l'écart entre ce que l'outil
*sait* et ce qu'il *montre*. P13 réduit l'écart entre ce que l'outil *sait* et ce qu'il *se transmet
à lui-même* — d'une section masquée à l'autre, d'un nœud au suivant, d'un chemin de rendu à son
jumeau. Aucune session n'ajoute de connaissance clinique ; toutes réparent une transmission.

## Ce que ce plan a vérifié avant de se lancer

Les six points ci-dessous ont été lus dans le code, pas déduits du rapport. **Trois corrigent le
diagnostic de la revue** — et deux d'entre eux changent la nature de la tâche.

- **T1 n'est pas gratuit, et le mécanisme qu'il lui faut existe à moitié.** `preremplissage`
  (`lib/formLayout.ts:160`, `schema/decision/noeud.schema.json` → `reglePreremplissage`) fait
  exactement ce que la revue demande — poser une valeur de départ, la signaler « · calculé, à
  vérifier », s'effacer dès que le praticien répond. **Mais son champ `valeur` est
  `type: string, minLength: 1`** : « aucun traitement » (liste vide) est **inexprimable** en l'état, et
  `appliquerPreremplissage` affecte la chaîne telle quelle sans regarder le type du critère. T1 est
  donc schéma + moteur + contenu, pas « du contenu pur ».
- **`preremplis` n'est jamais purgé au masquage, alors que `touched` l'est**
  (`DecisionNodeScreen.tsx:508` retire les champs réinitialisés de `touched` — rien d'équivalent pour
  `preremplis`). C'est **précisément l'effet dont T1 a besoin** : un critère masqué mais pré-rempli
  reste déterminé pour le moteur, donc l'option cesse d'être en attente. Le plan s'appuie dessus, et
  S1 a pour première obligation de le rendre **explicite et testé** au lieu de le laisser en effet de
  bord (aujourd'hui, aucun test ne le tient).
- **L'effacement des champs masqués (T2) est un garde-fou délibéré, pas un bug.**
  `reinitialiserChampsMasques` (`lib/formLayout.ts:226`) est documenté et testé comme tel
  (`lib/formLayout.test.ts:4` « un champ masqué est remis à sa valeur par défaut — il ne pilote plus
  le moteur en douce », et `:116` « efface la valeur d'un champ que le changement vient de masquer »).
  C'est l'application de R8. **Le correctif ne doit donc jamais consister à le désarmer** : il faut une
  mémoire de restauration *hors* de `criteria`, qui ne réinjecte rien tant que le champ est masqué.
  Un correctif qui ferait repasser la valeur dans le moteur recréerait le défaut R8 d'origine — celui
  du patient « évalué comme traité alors que l'écran affirme le contraire ».
- **La ligne d'écartement a DEUX défauts, pas un** (`DecisionNodeScreen.tsx:1196`) :
  `describeReasons(ecartee.motifs)` ne filtre pas aux branches vraies (D3, connu) **et n'est pas
  appelée avec `ecartee.option.motifs`** — les motifs rédigés que le contenu déclare ne sont donc
  **jamais consommés** sur les écartées, alors qu'ils le sont partout ailleurs. Le second défaut est
  invisible dans le rapport et se corrige dans le même geste.
- **N25 s'explique par une branche de code, exactement.** Le détail option par option
  (« Insuline d'initiation — à renseigner : Traitements en cours ») n'est rendu que dans la branche
  `priorites.length > 3` (`DecisionNodeScreen.tsx:1173-1183`). En dessous du seuil — le cas de N25,
  où il ne restait qu'un ou deux critères manquants — l'écran n'affiche que « À renseigner pour
  trancher : X » et **aucune option n'est nommée nulle part**. Le composant existe ; c'est sa
  condition d'affichage qui a créé les limbes.
- **« Le profil nocturne survit à la bascule » est très probablement un défaut d'affichage, pas de
  persistance.** `profil_nocturne` est un `enum` dont la première valeur déclarée est
  `baisse_continue` (`insuline.yaml:229-239`), et `valeurParDefaut` rend la première valeur d'un
  `enum` non renseigné. Le champ *est* réinitialisé — c'est sa valeur par défaut qui s'affiche comme
  un choix. **S3 vérifie cette hypothèse avant tout correctif** : les deux issues n'ont pas le même
  remède (affichage d'un `enum` non répondu vs cascade de masquage qui s'arrête trop tôt).

## Ce que ce plan NE fait pas

- **Il ne construit pas les critères communs de domaine** (P2 de la revue : `criteres-communs.yaml`,
  vocabulaire de sécurité unique). C'est le chantier de fond, il demande une validation clinique du
  contenu déplacé, et la dette est déjà tracée (`STATUS.md` : `terrain_fragile` déclaré deux fois).
  **Un plan P14 lui sera dédié** ; P13 se contente de ne rien aggraver.
- **Il ne touche pas au moteur ternaire (D20/D30).** Aucune session ne modifie `engine/conditions.ts`
  ni la sémantique de l'indéterminé. Les tâches qui en dépendent la lisent, ne la changent pas.
- **Il ne rouvre pas D47** (seuil deux colonnes) ni D45/D46 : aucune mesure de P13 ne les conteste.
- **Il ne traite pas les deux re-cadrages d'écran du backlog** (nœud `Traiter` à 6 sections, nœud
  `Alimentation` à 15 champs jamais rempli). Ce sont des refontes, pas des correctifs ; elles
  demandent une mesure préalable et restent au backlog.
- **Il ne fusionne aucun critère clinique** (`antecedent_cv` / `ASCVD_etablie` : arbitrage référent du
  2026-08-02 déjà rendu, non rouvert).
- **Il ne prototype pas la mutualisation des blocs « D'après » entre cartes** (I4b de la revue,
  confiance faible de son auteur) : seul le repli par défaut uniforme est traité, en S8.
- **Il ne porte aucun jugement visuel.** La revue n'a pas pu produire de capture ; les tâches à
  composante visuelle (S8) prescrivent une mesure ou renvoient en N2, jamais un jugement d'esthétique.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-137, T-138 | Le patient de N25 repart avec sa carte : l'intention déclare l'absence de traitement | Sonnet | xhigh | Desktop | — | `schema/decision/noeud.schema.json`, `src/features/decision/lib/formLayout.ts`, `content/decision/noeuds/diabete-type-2/prescription.yaml`, `engine/banc/` | [x] |
| [S2](S2.md) | T-139, T-140, T-141 | Une option en attente se nomme, et la sécurité passe devant | Sonnet | high | Desktop | — | `src/features/decision/lib/prioritesSaisie.ts`, `src/features/decision/screens/DecisionNodeScreen.tsx`, `engine/banc/securite-atteignable.test.ts` | [x] |
| [S3](S3.md) | T-142, T-143 | Une bascule d'intention ne détruit plus de saisie | Sonnet | xhigh | Desktop | S1 | `src/features/decision/lib/formLayout.ts`, `src/features/decision/screens/DecisionNodeScreen.tsx`, `src/features/decision/components/CriteriaForm.tsx` | [x] |
| [S4](S4.md) | T-144, T-145, T-146 | Un seul chemin de rendu pour les conditions, et des invariants qui le tiennent | Sonnet | high | — | — | `src/features/decision/lib/conditionText.ts`, `src/features/decision/lib/vueDecision.ts`, `src/features/decision/screens/DecisionNodeScreen.tsx`, `engine/banc/invariants-contenu.test.ts` | [x] |
| [S5](S5.md) | T-147, T-148 | La session transmet ce qu'elle sait : le poids, et les réponses globales | Sonnet | high | Desktop | — | `content/decision/noeuds/diabete-type-2/*.yaml`, `src/features/decision/components/CriteriaForm.tsx`, `src/features/decision/lib/sessionCriteres.ts` | [x] |
| [S6](S6.md) | T-149, T-150 | Un nœud publie sa conclusion (`exports`) | Sonnet | xhigh | Desktop | S5 | `schema/decision/noeud.schema.json`, `src/features/decision/lib/sessionCriteres.ts`, `src/features/decision/screens/DecisionNodeScreen.tsx`, `content/decision/noeuds/diabete-type-2/cible-glycemique.yaml` | [~] STOP |
| [S7](S7.md) | T-151→T-155 | Contenu : ce que les nœuds disent d'eux-mêmes et ce qu'ils taisent | Sonnet | high | — | S4 | `content/decision/noeuds/diabete-type-2/{statine,insuline,rhd-activite-physique,prescription}.yaml`, `*.argumentaire.md` | [x] |
| [S8](S8.md) | T-156→T-159 | Finitions : un clic de moins, une preuve repliée, un accord de verbe | Sonnet | medium | Desktop | S2, S4 | `src/features/decision/components/CriteriaForm.tsx`, `src/features/decision/screens/DecisionNodeScreen.tsx`, `.css`, `src/features/shared/` | [x] |

## Ordonnancement

- **Vague 1 — parallélisable** : **S1** (schéma + `formLayout` + `prescription.yaml`) · **S2**
  (`prioritesSaisie` + le bloc « en attente » de l'écran) · **S4** (`conditionText` + `vueDecision`).
  Les trois zones sont disjointes. ⚠ S2 et S4 touchent toutes deux `DecisionNodeScreen.tsx` mais
  **des blocs différents et distants** (bloc « en attente » l.1094-1188 pour S2, bloc « écartées »
  l.1190-1200 pour S4) : parallélisables, à condition que chacune s'y tienne strictement.
- **Vague 2** : **S3** (après S1 — les deux touchent `formLayout.ts`, et S3 doit connaître le
  mécanisme de pré-remplissage étendu par S1) · **S5** (contenu + `CriteriaForm`, zone disjointe).
- **Vague 3** : **S6** (après S5, même fichier `sessionCriteres.ts`) · **S7** (après S4, dont les
  invariants de rendu décident quelles corrections de contenu sont encore nécessaires).
- **Vague 4** : **S8** (après S2 et S4 pour `DecisionNodeScreen.tsx`).
- **Vague 5 — consolidation** : commits tâche par tâche, statuts, `STATUS.md`, `TASKS.md`, points N2
  reversés dans `VALIDATION.md`, un seul push.

**S6 est droppable.** `exports` est la seule tâche du plan qui ajoute un concept au modèle de contenu
(une conclusion de nœud devient une donnée de session). Si elle dérape, le plan se clôt sans elle :
les sept autres sessions restent entières, et D12/D17 restent ouverts — coûteux en confort, jamais en
sécurité.

**S1 est la seule session dont l'échec bloquerait la clôture** : elle ferme le seul défaut du corpus
qui peut faire repartir un patient urgent sans sa recommandation.

## Arbitrages à rendre par le référent AVANT S1

> **RENDUS le 2026-08-04 par le référent.**
>
> 1. **« Intention = Initier » vaut « aucun traitement antidiabétique en cours » → OUI.** T-138
>    s'exécute dans la forme prévue (pré-remplissage signalé et modifiable). La section Traitements
>    reste masquée à l'initiation. **S1 va jusqu'au bout.**
> 2. **« Rien à signaler » vaut pour les drapeaux qui deviendraient décisifs plus tard → OUI, à une
>    condition** : ne sont couverts que les drapeaux **effectivement affichés** au moment du clic —
>    peu importe qu'ils soient décisifs ou non à cet instant. Un drapeau masqué (`visible_si` faux)
>    n'est **pas** couvert. C'est exactement la position (a) que T-148 recommandait pour son cas
>    résiduel : elle est désormais **imposée, pas au choix de l'exécutant**. Le bouton garde son
>    libellé. **S5 va jusqu'au bout.**

Deux équivalences de vocabulaire clinique. Le plan ne les tranche pas — il ne peut pas.

1. **« Intention = Initier » vaut-il « aucun traitement antidiabétique en cours » ?** C'est déjà la
   sémantique implicite du formulaire (la section Traitements disparaît à l'initiation), mais elle
   n'a jamais été énoncée. **Si oui**, T-138 l'encode en pré-remplissage signalé et modifiable (le
   praticien qui déclare un traitement change d'intention, ce que l'écran doit dire). **Si non** — par
   exemple si « initier » peut signifier « initier une insuline chez un patient déjà sous
   metformine » —, alors c'est la *visibilité* qu'il faut corriger, pas la valeur : la section
   Traitements doit rester affichée à l'initiation, et T-138 change de forme sans changer d'objet.
   **Sans cet arbitrage, S1 s'arrête après T-137.**
2. **« Rien à signaler » vaut-il pour les drapeaux d'une section qui deviendraient décisifs plus
   tard ?** Le bouton dit « rien à signaler », ce qui se lit comme un constat clinique global — mais
   il ne répond aujourd'hui qu'aux drapeaux décisifs à l'instant du clic. **Si oui** (recommandé,
   c'est la lecture spontanée du libellé), T-148 le rend durable et exhaustif. **Si non**, il faut
   *renommer le bouton*, pas changer sa portée — et T-148 devient une tâche de libellé.

Un troisième point est **signalé, non bloquant** : la revue propose de prioriser, dans « Commencez
par… », les critères qui débloquent une option `role: securite` avant ceux qui en débloquent le plus.
T-140 l'implémente ; c'est un choix d'ergonomie, pas de clinique, et il est réversible.

## Ce que P13 laisse ouvert, volontairement

- **P2 — vocabulaire de sécurité commun au domaine** → plan P14, avec relecture référent.
- **Le mode « 2 positions de lecture »** : jamais actionné par la revue (limite d'outillage), donc
  jamais évalué. À faire regarder par la prochaine passe navigateur avant d'en tirer quoi que ce soit.
- **Toute la dimension visuelle** (saillance, couleur, hiérarchie graphique) : aucune capture n'a
  fonctionné pendant les deux passes du 04/08. Une passe visuelle dédiée reste à programmer.
- **La bascule silencieuse de deux cartes vers « Autres pistes possibles »** sur
  `rhd-alimentation` : observée par l'audit, **non reproduite** par la revue sur son profil. Le
  profil exact reste à trouver — tant qu'il ne l'est pas, il n'y a rien à corriger.

## Bilan de clôture — 2026-08-05

**19 tâches livrées sur 23, une partielle, trois non livrées.** N0 final : 1155 tests passés, 11 skip,
0 échec (départ du plan : 1061), typecheck et build verts, mesuré machine libre. Exécution séquentielle
(S1 → S2 → S4 → S3 → S5 → S7 → S8), pas la vague parallèle esquissée par l'index : le banc de sécurité
rend des verdicts au hasard sous charge, et S2/S4 partagent `DecisionNodeScreen.tsx`.

**Trois tâches n'ont pas été livrées, deux STOP légitimes et un manque de source** : T-149/T-150
(`exports`, S6) — ajouter `exports` au schéma déclenche mécaniquement l'invariant G1
(`engine/expressionsNoeud.ts`), donc « ne touche pas à `engine/` » et « mandat exact : exports à la
racine » sont réellement incompatibles ; vérifié indépendamment par l'orchestrateur, confirmé. T-154
(alerte rétinopathie proliférante, S7) — aucune source du nœud ne porte de conduite à tenir, seulement
un tag de mécanisme ; écrire l'alerte aurait exigé d'inventer. **T-152 partielle** : les 18 violations
I28 sur `insuline` sont levées, les 8 sur `statine` restent bloquées — le drapeau ne vit que dans
`exclusions`, qu'I24 ne scrute pas encore (extension de logique hors mandat contenu). Les trois sont au
backlog avec leur piste de correction.

**Corrections de l'orchestrateur après revue** : une phrase du changelog de S1 affirmait l'inverse de
ce que sa propre session avait constaté (« le golden master bougera » alors que S1 venait de prouver
qu'il ne peut structurellement pas bouger) — corrigée avant que S2 ne parte du même arbre. Le reste des
divergences constatées (garde-fou 3 de T-137 implémenté par référence plutôt que par contenu, S3 ; le
retrait de deux entrées de dette I14 par S7, hors périmètre littéral d'un fichier `src/`) venaient de
l'**exécution**, pas du plan — vérifiées et acceptées, chacune documentée dans le code avec son
pourquoi. **La consolidation elle-même a dû s'écarter de « un commit par tâche »** : plusieurs sessions
dépendantes (S1→S3, S1→S5, S1→S7, S4→S7, S5→S7, S2+S3+S4+S8 sur `DecisionNodeScreen.tsx`) ont édité les
mêmes fichiers sans qu'aucun commit intermédiaire ne soit pris entre elles — la règle du plan suppose
des sessions dépendantes commitées avant que la suivante ne démarre, ce que le mode vague choisi ici
n'a pas fait. Les 8 commits finaux groupent donc les tâches par fichiers réellement imbriqués, chacun
nommant toutes les sessions contributrices. **À corriger pour le prochain plan en mode vague avec
dépendances déclarées** : soit committer à la fin de chaque session même en vague, soit accepter d'emblée
la granularité par grappe de fichiers.

**Ce qui a marché** : les deux STOP (S6, T-154) se sont arrêtés exactement au bon endroit, sans
bricoler et sans réduire eux-mêmes le périmètre du plan — la porte de sortie que l'index leur avait
explicitement ouverte a servi. La mesure différentielle de S3 (rejouer le même parcours avec une valeur
**qui ne coïncide pas** avec le défaut, en plus du cas demandé) a débusqué un bug de sûreté réel là où
une mesure littérale du plan aurait pu conclure à tort à un simple défaut d'affichage. Plusieurs
sessions ont trouvé et signalé, sans les corriger elles-mêmes, des éléments hors mandat (partage abusif
de `risque_hypoglycemie_schema`, S5 ; 5 titres de référence voisins non corrigés, S7) — la discipline
« signale, ne résous pas » a tenu sur toute l'exécution. **À surveiller la prochaine fois** : plusieurs
sessions ont lancé `npm test` en arrière-plan malgré la consigne contraire et perdu des runs de 10-12
minutes à la reprise — la consigne devrait citer l'exemple concret (« lance au premier plan, timeout
600000 ms ») dans le corps du `S<k>.md`, pas seulement dans le message de lancement de l'orchestrateur.

**Le N1 (navigateur in-app) a été indisponible sur la quasi-totalité de l'exécution** (coupure de
connexion MCP survenue avant S5, jamais rétablie) — compensé par des tests d'intégration RTL/jsdom qui
simulent le geste réel plutôt que le rendu statique, un précédent que S3 a posé et que S5/S6/S7/S8 ont
repris sans qu'on le leur redemande. **Cette compensation ne remplace pas le N1** : `TASKS.md` porte la
liste des parcours à rejouer au navigateur avant de considérer P13 visuellement clos.

Le fil rouge tient : aucune session n'a ajouté de connaissance clinique, chacune a réparé une
transmission — d'une intention à un critère (S1), d'une bascule à une saisie qui survit (S3), d'un
nœud à l'autre (S5), d'une exclusion à son texte (S4/S7). Le seul concept nouveau que le plan proposait
(`exports`, une conclusion qui devient une donnée de session) est resté à l'état de conception — signe,
peut-être, que P13 avait raison de le déclarer droppable dès le départ.
</content>
</invoke>
