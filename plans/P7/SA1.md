# P7 · SA1 — `prescription` : seuils de position, prudence rénale AR GLP-1, garde sur l'agent mal toléré   (rédigé par l'orchestrateur)

> **Modèle : Sonnet · effort : high · Vague : 1 (parallèle : oui — SB1)**
> **Environnement : indifférent**
> Exécutant : UNIQUEMENT les tâches ci-dessous, dans l'ordre ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-29 · Branche : —

## Lire (commun à la session)

- `content/noeuds/diabete-type-2/prescription.yaml` — **en entier**, au moins une fois avant de modifier
  quoi que ce soit. C'est LE fichier de cette session ; les trois tâches y touchent, à trois endroits
  différents.
- `docs/decision/GRAMMAIRE-NOEUD.md` — R1 (état ≠ intention) et R8 (un critère doit agir), qui encadrent
  les trois modifications.
- `DECISIONS.md` — D5 (bump de version + changelog obligatoire, **une seule fois pour la session**, pas
  une par tâche), D28 (mémoire de session et pré-remplissage K6), D30 (présomption inversée).

## Hors périmètre

- **N'introduis aucune règle clinique qui ne soit pas littéralement écrite ci-dessous.** Les trois
  arbitrages ont été rendus par le référent le 2026-07-29 ; cette session les encode, elle ne les
  interprète pas au-delà de ce qui est écrit.
- Ne touche à aucun autre nœud (`insuline` est modifié par SA2, en vague 2 — pas ici).
- Ne touche à aucun composant, aucun test d'écran.
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P7/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan.

---

## T-048 — Compléter le pré-remplissage de `position_vs_cible` (les deux valeurs manquantes)

### Objectif

Le champ `position_vs_cible` se pré-remplit aujourd'hui pour « au-dessus » et « nettement au-dessus »
seulement. Le référent a donné le 2026-07-29 les deux seuils manquants — les encoder complète K6/D28.

### Décision clé

Écart = `HbA1c_actuelle − HbA1c_cible`. Les quatre bandes, telles que données :

| Écart | Valeur | Statut |
| --- | --- | --- |
| ≤ −1 point | `sous_objectif` | **nouveau** — déclenche la déprescription |
| entre −1 (exclu) et 0 (inclus) | `a_l_objectif` | **nouveau** |
| entre 0 (exclu) et 1 | `au_dessus` | existant, inchangé |
| ≥ 1 point | `nettement_au_dessus` | existant, **inchangé — voir ci-dessous** |

⚠ **UN POINT À NE PAS TRANCHER SEUL.** Le seuil du « nettement au-dessus » a été donné le 2026-07-27
comme « **supérieure ou égale** à 1 point » (`>= 1`, encodé tel quel dans
`ecart_nettement_au_dessus_cible`). La formulation du 2026-07-29 dit « **supérieur à** 1 point ». Les
deux ne diffèrent qu'à exactement +1,0. **Garde l'encodage existant (`>= 1`), ne le change pas** : il a
été donné explicitement avec « ou égale », il est en production, et les snapshots du banc en dépendent.
Signale simplement ce point dans ton rapport de tâche — la question est déjà posée au référent en
parallèle, ce n'est pas à toi de la trancher.

⚠ **Les gardes `> 0` sont obligatoires** sur tout dérivé qui lit `HbA1c_actuelle` ou `HbA1c_cible` : le
défaut d'un nombre non saisi est 0, et un écart calculé sur une cible à 0 vaudrait l'HbA1c elle-même.
Les deux dérivés existants (`ecart_nettement_au_dessus_cible`, `ecart_au_dessus_cible`) portent déjà ces
gardes — reprends-les à l'identique sur les nouveaux. C'est le banc, qui marque tous les critères comme
renseignés, que ces gardes protègent, pas l'écran.

⚠ **L'ordre des règles de `preremplissage` compte** : la première vraie l'emporte. Les nouvelles bandes
doivent s'insérer sans changer le résultat des deux existantes (« nettement » reste évalué avant
« au-dessus »).

### Lire / Modifier

**Modifier** : `content/noeuds/diabete-type-2/prescription.yaml` — les dérivés d'écart (≈ ligne 106-116)
et le bloc `preremplissage` du critère `position_vs_cible` (≈ ligne 117-143). Les numéros de ligne sont
indicatifs, ils bougent.

### Étapes

1. Ajoute les dérivés nécessaires aux deux nouvelles bandes, sur le modèle exact des deux existants
   (même style de nom, mêmes gardes `> 0`, commentaire disant d'où vient le seuil et à quelle date).
2. Ajoute les deux règles de `preremplissage` correspondantes, dans un ordre qui préserve le résultat des
   deux existantes.
3. **Remplace le gros commentaire d'avertissement** qui explique que rien n'est pré-rempli sous
   l'objectif (« ⚠ RIEN N'EST PRÉ-REMPLI SOUS L'OBJECTIF, et c'est délibéré… ») : il devient faux. Écris
   à la place ce qui est vrai maintenant — les quatre bandes, leur origine (référent, 2026-07-29), et le
   fait que la position déclarée par le praticien reste ce qui fait foi (R1) : un pré-remplissage est une
   proposition, jamais une décision.
4. Vérifie que le pré-remplissage ne peut jamais **écraser un choix manuel** du praticien (mécanisme K6
   existant — tu ne le modifies pas, tu vérifies seulement que tes ajouts s'y conforment).
5. Passe au T-049 (même fichier, autre endroit).

### Validation

- **N0 auto (bloque le commit)** : voir le bloc de validation commun en fin de session — la suite ne
  tourne qu'une fois, après les trois tâches.
- **N1 visuel** : `—` (pas de navigateur ici ; S2 vérifie à l'écran en vague 3).
- **N2 humain** : `—`.

### Si bloqué

Si l'un des snapshots du banc change **autrement** que par l'apparition des deux nouvelles valeurs
pré-remplies (par exemple une recommandation qui bascule sur un profil existant) : STOP. Décris le profil
exact et ce qui a changé — un pré-remplissage ne doit modifier aucune sortie, seulement proposer une
valeur que le praticien voit et peut corriger.

---

## T-049 — Alerte de prudence rénale sur l'AR GLP-1 (DFG < 15)

### Objectif

Signaler que l'AR GLP-1 est peu étudié sous 15 mL/min/1,73 m², sans changer les conditions de son
affichage.

### Décision clé

Le référent a vérifié les RCP des AR GLP-1 disponibles en France (2026-07-29) : **aucune
contre-indication rénale formelle**, mais **peu étudié sous 15 mL/min/1,73 m²**.

⚠ **Le seuil `DFG < 30` déjà présent dans les `conditions` de l'option ne bouge pas.** Il répond à une
question différente — il marque le point où la metformine disparaît (contre-indication RCP ANSM) et où
une classe à bénéfice doit donc pouvoir prendre le relais (c'est écrit dans le commentaire de l'option).
Ce n'est pas un seuil de sécurité de l'AR GLP-1. **Confirmé explicitement par Thibault le 2026-07-29 :
seuil de déclenchement inchangé, on ajoute une alerte.**

Ce qu'on ajoute : une **alerte d'option** (`alertes` de l'option « Introduire un AR GLP-1 »), conditionnée
à un DFG bas, disant que la classe reste utilisable mais est peu documentée à ce niveau de fonction
rénale. Formulation à toi, en français de consultation, sans jargon de variable — dis le fait, pas la
règle. **Garde `DFG > 0` obligatoire** (même motif qu'en T-048).

⚠ **Une alerte, pas une exclusion** : R4/R8 — l'option doit continuer de s'afficher normalement. Si ton
encodage la fait disparaître ou passer en « écartée » sous DFG 15, c'est une erreur.

### Lire / Modifier

**Modifier** : `content/noeuds/diabete-type-2/prescription.yaml` — l'option « Introduire un AR GLP‑1
(liraglutide, sémaglutide, dulaglutide) » (≈ ligne 657), son bloc `alertes`. Lis aussi le commentaire qui
précède ses `conditions` (≈ ligne 665-677) : il explique le seuil 30 et dit lui-même « ⚠ Ce seuil est le
point arbitrable de cette règle » — **mets ce commentaire à jour** pour dire que l'arbitrage a été rendu
(2026-07-29, seuil maintenu, motif ci-dessus), il ne doit plus se présenter comme ouvert.

### Étapes

1. Ajoute l'alerte d'option conditionnée au DFG bas, avec sa garde `DFG > 0`.
2. Mets à jour le commentaire du seuil 30 : l'arbitrage est rendu, dis lequel et pourquoi.
3. Passe au T-050.

### Validation

Bloc commun en fin de session.

### Si bloqué

Si l'option cesse de s'afficher, ou apparaît comme écartée, sur un profil à DFG bas où elle s'affichait
avant : STOP — tu as encodé une exclusion là où il fallait une alerte.

---

## T-050 — Conditionner « Optimiser l'agent mal toléré » à un traitement en cours

### Objectif

Cette carte s'affiche aujourd'hui même quand aucun traitement en cours n'est coché — elle parle
d'optimiser un agent qui n'existe pas.

### Décision clé

Tranché par le référent le 2026-07-29 : **oui, conditionner**. L'option « Optimiser l'agent mal toléré :
réduire la posologie (intolérance non majeure) ou remplacer » (≈ ligne 941, condition ≈ ligne 944 :
`"intention != initier AND intolerance_traitement == true"`) doit exiger en plus que
`traitements_en_cours` ne soit **pas vide**.

⚠ **Attention à la présomption (D30/T-018).** `traitements_en_cours` est délibérément **exclu** de
`presomption_non` sur ce nœud : un traitement non coché n'est PAS présumé absent, il est *indéterminé*.
Cette exclusion vient d'être **reconfirmée** par le référent le 2026-07-29 (« garder l'état actuel »).
Conséquence directe pour toi : la condition que tu ajoutes doit se comporter correctement quand
`traitements_en_cours` est indéterminé — l'option doit alors rester **en attente**, pas être affirmée ni
écartée. Vérifie le comportement obtenu plutôt que de le supposer : c'est exactement le genre de point
où ce projet s'est déjà trompé plusieurs fois.

### Lire / Modifier

**Modifier** : `content/noeuds/diabete-type-2/prescription.yaml` — les `conditions` (ou `prerequis`,
selon ce qui est correct ici : lis comment les autres options du fichier expriment un garde-fou de
cohérence non montré comme justification, cf. R6) de cette option.

### Étapes

1. Choisis le bon emplacement (`conditions` vs `prerequis`) en lisant comment les options voisines
   traitent un garde-fou du même genre — R6 : un garde-fou de cohérence ne doit pas apparaître comme une
   justification clinique à l'écran (« Proposé parce que : le patient a un traitement en cours » serait
   absurde).
2. Ajoute la condition de non-vacuité.
3. Vérifie le comportement sur trois cas : traitement coché (option s'affiche comme avant), aucun
   traitement et champ **renseigné vide** (option ne s'affiche pas), champ **non renseigné**
   (option en attente, pas écartée).
4. Bump de version + changelog D5 — **une seule entrée pour les trois tâches de cette session**, décrivant
   les trois changements et leur origine (arbitrages référent du 2026-07-29).
5. Fais tourner la validation N0 ci-dessous.

### Validation (commune aux trois tâches — à ne faire qu'ici, à la fin)

- **N0 auto (bloque le commit)** : `npm test` **(suite COMPLÈTE, en foreground — pas un fichier ciblé :
  une session d'un plan précédent a laissé passer une régression faute d'avoir testé l'ensemble)** → tout
  vert · `npx tsc --noEmit` → 0 erreur · `npm run build` → OK · validation Ajv du nœud `prescription` →
  OK.
- **N0 auto** : les snapshots du banc qui changent doivent être **relus**, pas régénérés à l'aveugle. Pour
  chacun, dis dans ton rapport ce qui a changé et pourquoi c'est attendu.
- **N1 visuel** : `—` (S2, vague 3).
- **N2 humain** : `—`.

### Si bloqué

Si une sortie de recommandation change sur un profil qui n'est concerné par aucune des trois tâches :
STOP, c'est un effet de bord, décris-le avant de continuer.

### Message de commit (appliqué en fin de plan)

`feat(contenu): prescription — seuils de position, prudence rénale AR GLP-1, garde agent mal toléré (P7)`

### Statut

Suivi dans `plans/P7/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode vague parallèle — SB1 tourne en parallèle sur des fichiers disjoints).
