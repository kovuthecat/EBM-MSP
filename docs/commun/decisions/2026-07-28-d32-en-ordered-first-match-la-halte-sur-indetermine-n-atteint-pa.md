# 2026-07-28 — D32 · En `ordered-first-match`, la halte sur indéterminé n'atteint pas les options `role: securite` (amende D11)

### Décision

Dans `evaluateOrderedFirstMatch` (`src/features/decision/engine/evaluateNode.ts`), quand une option
rencontrée dans l'ordre du nœud est **indéterminée** (`conditions`/`prerequis`/`exclusions`), le
parcours mémorise la halte (le nœud reste `enAttente` sur cette option) mais **n'arrête plus**
l'évaluation : il continue, en ne considérant plus, parmi les options restantes, que celles portant
**`role: securite`** (D25) — le repli `default` y compris, lui-même retesté seulement s'il porte ce
rôle. Toute option **ordinaire** placée après une halte reste hors d'atteinte, sans être évaluée ni
tracée : l'ordre du nœud continue de faire foi (D11) en dehors du filet de sécurité. Si une option de
sécurité matche après la halte, elle est retenue **et** la halte reste rapportée dans `enAttente` :
l'écran peut dire à la fois « voici le filet » et « la décision principale reste suspendue à tels
critères ».

Cette décision lève la réserve que portait la docstring de `evaluateOrderedFirstMatch` (« ce choix n'est
pas explicitement tranché par la spec ») : il l'est désormais, explicitement, par D32.

### Contexte

Recette du 2026-07-28 (D-03) : nœud `statine`, patient en prévention **secondaire** (maladie
cardiovasculaire athéromateuse établie), intolérance **avérée**, statine jamais en place, deux critères
non renseignés (`anciennete_diabete_annees`, `autres_FDRCV`). Le parcours atteignait « Discuter la
statine (décision partagée) », dont les conditions testaient ces deux critères → indéterminé → **halte**
→ écran muet. La carte suivante dans l'ordre, « Statine indisponible — alternatives hypolipémiantes »
(`role: securite`), aurait matché sur `intolerance_statine == averee` et couvrait déjà ce patient : le
seul patient à qui l'outil ne disait **rien du tout** était celui pour qui la question était la plus
urgente.

### Raison du choix

La halte reste nécessaire : elle empêche de retenir une option plus loin dans l'ordre alors qu'une
option antérieure était peut-être la bonne, ce que D20 interdit (sauter un indéterminé pour en retenir
un autre reviendrait à décider tacitement qu'il ne matche pas). Mais un fait de sécurité ne se négocie
pas contre une indétermination plus tôt dans l'ordre — même principe que D25 (« un `role: securite` est
à faire d'emblée, jamais replié ni plafonné »), appliqué ici à la halte plutôt qu'à l'affichage.

### Conséquences

- Nouveaux invariants de banc **I22** (`engine/banc/securite-atteignable.test.ts` : aucune option
  `role: securite` d'un nœud publié n'est rendue inatteignable par l'ordre du nœud) et **I23** (même
  fichier : jamais `applicable` vide **et** `enAttente` vide en même temps, sur aucun nœud publié).
- `enAttente` peut désormais porter **plusieurs** entrées en `ordered-first-match` (une par halte
  rencontrée), alors qu'une seule était possible avant cette décision.
- Aucun contenu clinique modifié : le défaut était dans le moteur, pas dans l'ordre ni les conditions de
  `statine`.
