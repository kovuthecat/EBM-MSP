# 2026-07-27 — D28 · Mémoire de session inter-nœuds (amende l'invariant CLAUDE.md 1)

### Décision

**Amende l'invariant CLAUDE.md 1** (« aucune persistance, aucun réseau » côté Décision) : une **mémoire
de session en mémoire vive** (`lib/sessionCriteres.ts`, une `Map` de module) est autorisée pour
reprendre, d'un nœud à l'autre de la même consultation, les valeurs qu'un critère déclaré `partage:
true` a **saisies** — jamais une conclusion du moteur. Trois garanties : (1) seule une valeur
**touchée** par le praticien est mémorisée (une valeur par défaut n'est pas une réponse, D20/R7) ; (2)
un critère `derive` n'est **jamais** mémorisé (ce serait faire circuler une conclusion, pas une saisie
— rouvrirait R1) ; (3) la reprise est **pré-remplie, jamais imposée**, et **compatible avec le
récepteur** (mêmes bornes/type/énumération — `valeurCompatible`), sinon silencieusement ignorée. Vidée
intégralement au rechargement de la page.

### Contexte

Chaque nœud est monté à neuf (remontage React par `key`) : sans ce mécanisme, un praticien ressaisit
l'HbA1c, l'âge, le DFG à chaque écran d'une même consultation. Le référent a tranché explicitement :
*« on peut garder une persistance par session — un reload de la page reset tout »*. Complète, sur un
périmètre restreint et sûr, le *socle de critères de terrain partagé* qu'évoquait D22 sans le livrer
(le chaînage obligatoire qu'il aurait supposé restait interdit par R1 — cette mémoire n'enchaîne rien,
elle pré-remplit un champ qui reste un formulaire normal, modifiable, jamais lu par le moteur d'un
autre nœud comme un prérequis).

### Raison du choix

« Aucune persistance » protège contre une donnée patient qui **survit** à la consultation (disque,
réseau, `localStorage`) — c'est le risque nommé par l'invariant. Une `Map` de module, vidée au
rechargement, n'a jamais cette propriété : elle ne survit même pas à un F5. La distinguer de ce que
l'invariant interdit réellement évite de renoncer à une ergonomie réclamée par le seul référent
clinique du projet, pour un risque qui ne se pose pas.

### Conséquences

`CritereEntree.partage` déclaré nœud par nœud (jamais deviné par le socle générique — D8) ; un premier
lot de critères communs (`HbA1c_actuelle`, `HbA1c_cible`, `DFG`…) le porte. `preremplissage` (règles
`{quand, valeur}` sur un critère saisi) est le mécanisme frère, pour dériver un point de départ depuis
un AUTRE critère du même nœud plutôt que depuis la session — les deux se distinguent à l'écran (« repris
de votre saisie » vs « calculé, à vérifier »).
