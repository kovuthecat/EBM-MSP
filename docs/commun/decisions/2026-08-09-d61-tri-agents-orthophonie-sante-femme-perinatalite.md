# 2026-08-09 — D61 · Route analyse ouverte sur orthophonie/santé-femme-périnatalité via vérification tri-agents

### Décision

Amende D60 : le périmètre de production passe de 10 à **11 thèmes**, `sante-femme-perinatalite`
rejoignant `orthophonie`. Sur ces deux thèmes, la restriction posée par D60 (« route brève
uniquement ») est levée, mais pas remplacée par un traitement identique aux 9 thèmes MG. Un nouveau
**§7bis** dans `SOP_veille.md` définit une vérification **tri-agents** :

- **Agent A (Analyste)** et **Agent B (Contradicteur)** : mêmes rôles que la vérification bi-agents
  standard du §7, ancrés sur la source primaire.
- **Agent C (Réconciliateur)**, rôle nouveau : contextes séparés de A et B, compare leurs sorties,
  tranche les désaccords vérifiables sur pièces, et **rend la décision finale de classement**
  (`route`, `niveau_impact`, `niveau_preuve`) — à la place du référent, qui joue ce rôle sur les 9
  thèmes MG (§5 étape 5) mais n'a pas la compétence de fond ici.
- **Garde-fou de publication obligatoire** : `meta.relecture_referent: false` sur toute entrée produite
  par ce circuit (`true` par défaut ailleurs). Affiché en **bandeau visible sur la carte**, jamais
  relégué au détail déplié — cf. `src/features/veille/screens/VeilleListScreen.tsx`.

`SOURCES.md` complété d'une section « Santé de la femme et périnatalité » (CNGOF, HAS maternité —
statut repérage informel, non vérifiées en ligne, même remarque que Glossa/unadreo en D60).

### Contexte

Immédiatement après D60 (qui avait retenu « route brève uniquement » comme façon de contenir l'angle
mort de compétence), le référent a demandé explicitement d'ouvrir la route analyse sur ces deux thèmes
via un circuit multi-agents avec réconciliation par un 3ᵉ agent, à condition que l'absence de relecture
par un référent de profession soit dite. C'est un changement de moyen, pas de constat : l'écart de
compétence clinique de fond entre le référent (MG) et ces deux domaines n'a pas changé entre D60 et
D61 — ce qui change, c'est le choix d'accepter une appréciation critique produite sans validation
humaine compétente, du moment que ce fait est visible pour le lecteur professionnel du domaine
concerné, seul à même de la soupeser correctement.

### Alternatives envisagées

- **Garder D60 tel quel (brève uniquement)** — c'était la position de départ ; écartée sur demande
  explicite du référent, qui préfère un contenu analysé-mais-marqué à une absence d'analyse.
- **Traiter ces deux thèmes exactement comme les 9 thèmes MG** (bi-agents + référent tranche) — écartée :
  masquerait l'angle mort de compétence en donnant l'apparence d'une validation de fond équivalente à
  celle des thèmes où le référent est effectivement compétent.
- **Un 3ᵉ agent qui vérifie mais ne tranche pas** (l'item resterait toujours en attente d'un humain) —
  écartée : reviendrait à réintroduire une dépendance à un référent de profession qui n'existe pas,
  soit une impasse identique à D40. Le 3ᵉ agent doit trancher pour que le circuit produise quelque
  chose ; c'est justement pour ça que le résultat doit être marqué.
- **Marquer l'absence de relecture uniquement dans le journal interne (screening.md), pas sur la carte
  publiée** — écartée explicitement par le référent (« préciser qu'il n'y a pas eu de relecture de
  référent ») : l'information doit atteindre le lecteur, pas seulement l'archive de production.

### Conséquences

- `entree.types.ts` (`MetaEntree`) et les 14 entrées `content/veille/2026-W33/*.yaml` déjà publiées
  reçoivent `relecture_referent: true` (elles sont toutes sur des thèmes MG, aucune n'est concernée par
  le §7bis) — le champ est **obligatoire**, pas optionnel avec défaut implicite : cohérent avec la
  pratique du projet (D20/D30) de ne jamais laisser un champ silencieusement absent porter une
  signification.
- Pas de fichier JSON Schema existant pour la veille (`schema/veille/` est vide à ce jour) : la
  contrainte est portée par le seul type TypeScript. À faire si `schema/veille/entree.schema.json` est
  créé plus tard : y répercuter `relecture_referent`.
- **À revoir** : dès qu'un référent orthophoniste ou sage-femme rejoint la veille, le §7bis devient
  optionnel pour ce thème (le référent de profession peut trancher directement, comme au §7 standard) —
  nouvelle décision à ce moment-là, pas une bascule silencieuse.
