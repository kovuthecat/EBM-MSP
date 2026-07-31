# 2026-07-27 — D25 · Rôle d'une option (`Option.role`) et plafond d'affichage par rang

### Décision

Nouveau champ **requis** sur `option` : `role: socle | securite | geste | repli`. Lu par trois
mécanismes qui, avant, devaient chacun deviner le rôle d'une carte à partir d'indices indirects
(sentinelle `toujours`, position dans la liste, présence d'alertes) : le repli d'affichage (une carte
ne se replie que si elle est un `geste` sans contre-indication ni alerte — `socle`/`securite`/`repli`
restent toujours dépliées), le badge, et « pourquoi pas d'autres options ». Au-delà de **5 pistes**
affichées (`PLAFOND_PISTES`), les gestes excédentaires passent sous « Autres pistes possibles (N) » ;
rien d'autre ne se replie jamais.

### Contexte

Recette du 2026-07-27 : un nœud à forte cardinalité de pistes (`rhd-alimentation`) pouvait afficher
jusqu'à dix cartes d'un coup à un patient chargé. Un premier plafond, posé sans connaître le rôle des
options, avait été neutralisé par précaution (rien à cette date ne garantissait qu'il ne replierait
jamais une carte de sécurité) — cf. `PLAN-CORRECTION.md`.

### Raison du choix

Décider *si* une carte peut se replier suppose de savoir ce qu'elle EST, pas seulement ce qu'elle
CONTIENT à l'instant T (une carte de sécurité peut n'avoir, pour un patient donné, ni contre-indication
ni alerte affichées — cela ne la rend pas repliable). Un champ déclaré, plutôt qu'une heuristique sur
les alertes visibles, rend la propriété vraie par construction et testable (invariants I16-I19 :
« une carte `securite` ne se replie jamais », vérifiés sur le banc, pas seulement sur les vignettes).

### Conséquences

Champ requis → les 27 options du domaine DT2 ont dû être qualifiées une à une (relecture complète,
pas d'inférence automatique). `replierAffichage.ts` reste générique (aucun nom de nœud/critère).
