# 2026-08-06 — D55 · « Un drapeau rouge non coché est considéré comme absent » — portée réelle de D30 sur les expositions indirectes

### Décision

**Précise D30**, sans l'amender.

Un critère `presomption_non: true` peut être exposé **indirectement** — via un critère `derive`, à un cran
— dans les `exclusions` d'une carte `role: geste` **sans violer D30**, à une condition qui doit être
vérifiée et écrite : que cette exclusion **choisisse entre deux gestes de la même famille**, plutôt que
de **retirer un geste dangereux**. Sur une carte `role: securite`, l'interdit de D30 reste entier, direct
comme indirect.

**Le principe général que le référent a énoncé, et qui tranche — ce n'est pas une exception ad hoc :**

> **Un drapeau rouge non coché est considéré comme absent.**

C'est la doctrine de l'outil, pas une dispense accordée à un critère. `presomption_non: true` déclare
exactement cela : *l'absence de réponse vaut « non »*. Ce qui doit rester interdit, c'est qu'une telle
présomption **gouverne un canal de sécurité** — qu'un patient perde une protection parce qu'une case n'a
pas été cochée. Ce qui reste permis, c'est qu'elle **oriente un choix entre deux gestes également
disponibles**, où l'absence de réponse ne retire rien à personne.

### Contexte — le STOP qui l'a produite

L'invariant **T-165** (P14/S2) a été écrit pour mécaniser D30, qui n'était jusque-là appliquée qu'à la
main : *aucun critère `presomption_non: true` n'est cité dans une `conditions` d'option `role: securite`
ni dans une `exclusions`, en déroulant les dérivés d'un niveau*. Il devait être **vert dès l'écriture**.
Il est sorti **rouge**, de façon stable et reproductible :

```text
nœud "prescription" :: option "Glinide" (exclusions) :: expression
"isglt2_indisponible == true AND aglp1_indisponible == true" cite
"infections_uro_genitales_recidivantes" (`presomption_non: true`) — D30 interdit qu'un critère
présumé faux gouverne un canal de sécurité.
```

**La chaîne exacte**, en trois maillons : l'option « Glinide » (`role: geste`) porte
`exclusions: ["isglt2_indisponible == true AND aglp1_indisponible == true"]` ; `isglt2_indisponible` est
un **dérivé** dont la `derive` cite `infections_uro_genitales_recidivantes` ; et ce dernier porte
`presomption_non: true`, posé lors de l'audit manuel T-018 (2026-07-28) au motif qu'il « ne participe
qu'à des alertes de nœud, jamais à une condition d'option `role: securite` ni à une `exclusions` ».

Ce motif était **vrai pour une citation DIRECTE, faux pour cette citation INDIRECTE** — un niveau de
dérivé, que l'audit manuel de l'époque ne pouvait pas voir. C'est très exactement le trou que T-165 a
été écrit pour révéler : la session S2 n'a tenté **aucune** correction, ni du contenu ni de la règle,
et a rendu la main.

### Raison du choix — la lecture clinique du mécanisme

Le référent a tranché le 2026-08-06 : **garder `presomption_non: true`** sur
`infections_uro_genitales_recidivantes`, et ne pas toucher au contenu.

L'exclusion en question **ne retire pas le glinide** au patient. Elle **écarte la carte « remplacer »**
au profit de la carte « réduire la posologie » — le glinide étant le seul insulinosécréteur utilisable
sous DFG 30 (arbitrage A2 du même nœud). C'est un **choix de libellé entre deux gestes non bloquants**,
pas une exposition dangereuse : dans les deux branches, le patient repart avec une conduite sur son
glinide. L'initiation d'un iSGLT2 — le geste réellement à risque en cas d'infections uro-génitales
récidivantes — reste gouvernée ailleurs, par ses **propres gardes directs**, qui ne sont pas concernés
par cette présomption.

La distinction qui fait règle est donc celle-ci, et elle est plus fine que « exclusion = sécurité » :

| l'exclusion… | statut vis-à-vis de D30 |
| --- | --- |
| retire un geste **dangereux** pour ce patient (le patient perd une protection si la case n'est pas cochée) | **interdit** — direct comme indirect |
| choisit **entre deux gestes de la même famille**, tous deux disponibles (le patient repart avec une conduite dans les deux cas) | **permis** sur une carte `role: geste`, à documenter |
| porte sur une carte `role: securite` | **interdit**, sans exception |

### Ce qui reste interdit

1. **Une carte `role: securite` dont une `conditions` cite un critère présumé faux**, directement ou via
   un dérivé. Inchangé, c'est le cœur de D30.
2. **Une exclusion qui retire un geste dangereux** sur la foi d'une case non cochée, quel que soit le
   `role` de l'option qui la porte.
3. **Une exception non documentée.** La dispense est nominative : elle vit dans
   `EXCEPTIONS_D30_T165` (`engine/banc/invariants-contenu.test.ts`), une entrée par couple
   (nœud, critère), avec son motif écrit. Dispenser un nœud entier aveuglerait un fichier au lieu de
   protéger un cas.
4. **Une exception qui survit à la disparition de son cas.** L'entrée porte une **auto-expiration** : un
   second test échoue si la dispense ne correspond plus à aucune exposition réelle, et demande de la
   retirer. Une liste de dette qui ne rétrécit jamais devient du papier peint.

### Conséquences

- **Contenu : inchangé.** C'est le point de la décision — le contenu était juste, c'est la lecture de
  D30 qui était trop large.
- **Invariant** : `EXCEPTIONS_D30_T165` reçoit une entrée, `prescription :: infections_uro_genitales_recidivantes`,
  avec son motif (exposition indirecte via `isglt2_indisponible`, exclusion de « Glinide [remplacer] »,
  `role: geste` et non `securite`). Vérifié qu'**aucune autre** `exclusions` du nœud n'est atteinte par
  `isglt2_indisponible`/`aglp1_indisponible` — les autres citations du couple sont des
  `conditions`/`prerequis` d'options `role: geste`, hors du périmètre des expressions sensibles par
  construction. L'exception ne masque donc rien d'autre.
- **L'invariant continue de mordre** : le test « sur un cas fabriqué » reste vert, et tout **nouveau**
  cas non documenté échoue immédiatement.
- **Portée** : ce principe dépasse le critère qui l'a révélé. Il clarifie la portée réelle de D30 pour
  tout domaine à venir — un `presomption_non` s'établit toujours mécaniquement, mais le test mécanique
  distingue désormais la nature de l'exclusion, pas seulement sa présence.
