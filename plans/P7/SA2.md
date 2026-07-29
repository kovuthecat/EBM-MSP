# P7 · SA2 — Signalement de validité de l'HbA1c + doctrine   (rédigé par l'orchestrateur)

> **Modèle : Sonnet · effort : medium · Vague : 2 (parallèle : non — après SA1 et SB1)**
> **Environnement : indifférent**
> Exécutant : UNIQUEMENT les tâches ci-dessous, dans l'ordre ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-29 · Branche : —

## Lire (commun à la session)

- `DECISIONS.md` — le format du fichier (Décision / Contexte / Raison du choix / Conséquences), le
  dernier numéro attribué (D35 au 2026-07-29), et D24 (`cadrage` : bloc neutre de tête de nœud, sans
  couleur ni bordure de vigilance — délibérément **pas** une alerte).
- `docs/decision/GRAMMAIRE-NOEUD.md` — R7 (jamais se prononcer sur ce qu'on ignore) et R8.
- Les deux nœuds qui lisent l'HbA1c : `content/noeuds/diabete-type-2/prescription.yaml` et
  `content/noeuds/diabete-type-2/insuline.yaml` — leurs blocs `cadrage` existants. **Vérifie toi-même
  quels nœuds lisent réellement `HbA1c_actuelle`** plutôt que de faire confiance à cette liste (un
  troisième nœud pourrait la lire indirectement).
- Le résultat de SA1 et SB1 (code final, ou leurs rapports de tâche s'ils sont accessibles) : la tâche
  T-053 documente **ce qui a été fait**, vérifié dans le code, pas ce qui était prévu.

## Hors périmètre

- **N'ajoute aucun critère de saisie.** La charge de saisie est le risque n°1 déclaré du projet ; un
  champ « l'HbA1c est-elle interprétable ? » à cocher sur chaque patient serait une régression, pas un
  progrès. Cf. Décision clé de T-052.
- Ne change aucune règle de décision : le signalement est informatif, il n'entre dans aucune condition.
- Ne rouvre aucun arbitrage tranché « sans action » le 2026-07-29 (`TASKS.md`).
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P7/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan.

---

## T-052 — Signaler que l'HbA1c peut ne pas être interprétable

### Objectif

L'outil raisonne sur une HbA1c sans jamais signaler qu'elle peut être faussée (anémie, cirrhose,
hémoglobinopathie). Un praticien pressé peut ne pas y penser — un rappel passif coûte peu et évite une
erreur d'interprétation silencieuse.

### Décision clé

Tranché par le référent le 2026-07-29 : **ajouter un signalement**. Périmètre à cadrer par cette
session, dans les limites suivantes :

- **Véhicule : `cadrage` (D24)**, le bloc neutre de tête de nœud — pas une alerte (ce n'est pas un fait
  de sécurité déclenché par ce patient-ci), pas un nouveau critère à cocher (coût de saisie), pas un
  texte dans chaque carte (bruit répété). Le `cadrage` est exactement fait pour ça : une information de
  contexte que le praticien lit une fois en ouvrant le nœud.
- **Sur les nœuds qui lisent l'HbA1c**, et eux seuls — vérifie lesquels.
- **Contenu** : les trois situations nommées par le référent (anémie, cirrhose, hémoglobinopathie) sont
  des exemples, pas une liste fermée ; formule-le comme tel. Français de consultation, une à deux
  phrases, pas de jargon de variable. Le texte doit dire *quoi faire* implicitement (se méfier du
  chiffre), pas seulement énoncer un fait de biologie.

⚠ **Ne va pas plus loin que le signalement.** Le référent n'a pas demandé de conduite à tenir, de seuil,
ni de méthode alternative (fructosamine, glycémies moyennes) : proposer l'un des trois serait inventer du
contenu clinique. Si tu penses qu'il en faudrait une, signale-le dans ton rapport — ne l'écris pas.

### Lire / Modifier

**Modifier** : le bloc `cadrage` des nœuds concernés (`content/noeuds/diabete-type-2/*.yaml`), bump de
version + changelog D5 sur chacun.

### Étapes

1. Établis la liste réelle des nœuds qui lisent `HbA1c_actuelle` (grep + lecture, pas supposition).
2. Rédige le texte, une fois, et pose-le sur chacun. Le texte doit être **le même** partout — s'il devait
   différer d'un nœud à l'autre, dis pourquoi dans ton rapport.
3. Vérifie à la lecture du rendu (test ou fonction existante) que le signalement apparaît bien comme
   cadrage neutre et **jamais** comme une alerte : le protocole de recette du projet dit explicitement
   qu'un cadrage qui ressemble à une alerte est un défaut.
4. Bump de version + changelog D5 sur chaque nœud modifié.

### Validation

Bloc commun en fin de session.

### Si bloqué

Si un nœud n'a pas de bloc `cadrage` du tout : ne le crée pas au jugé — vérifie d'abord comment les
autres nœuds le déclarent, et si le nœud sans cadrage a une raison documentée de ne pas en avoir.

---

## T-053 — Doctrine : consigner les arbitrages du 2026-07-29

### Objectif

Que les décisions rendues le 2026-07-29 soient dans `DECISIONS.md`, au format du fichier, et pas
seulement dans un backlog qui sera purgé.

### Décision clé

Une décision `D<n>` (numéro suivant le dernier attribué) qui couvre **les quatre arbitrages encodés par
ce plan**, ou plusieurs décisions séparées si tu juges qu'ils n'ont rien à voir entre eux — à toi de
voir, mais ne fabrique pas quatre décisions pour quatre lignes. Ce qui doit y figurer :

1. **Les quatre bandes de `position_vs_cible`** et leur origine (référent, 2026-07-29) — c'est ce qui
   complète K6/D28, qui disait explicitement que la frontière `sous_objectif` n'avait pas été donnée.
   Mentionne que cette frontière **déclenche la déprescription**, c'est ce qui la rend sensible.
2. **Le seuil rénal de l'AR GLP-1 : arbitrage rendu, seuil de déclenchement maintenu à 30**, avec le
   motif (il marque la disparition du socle metformine, pas la sécurité de la classe) + l'alerte de
   prudence sous 15 (RCP vérifiées par le référent : pas de contre-indication formelle, peu étudié).
   Le commentaire du YAML se présentait jusqu'ici comme « le point arbitrable de cette règle » — dis que
   c'est clos.
3. **Le badge distinct pour une option de sécurité** (livré par SB1) — même famille que D16, dis-le.
4. **Le signalement de validité de l'HbA1c** (T-052) et son véhicule (cadrage, pas alerte ni critère),
   avec le motif du choix : coût de saisie nul.

Consigne aussi, en une ligne chacun, **ce qui a été tranché SANS action** le même jour (dette patient
naïf T-018 reconfirmée, asymétrie iSGLT2/AR GLP-1 chez le dénutri maintenue, statut `brouillon` hors
écran de décision, molécule/dose au cas par cas) : une décision de ne rien changer est une décision, et
c'est elle qui évite qu'on rouvre la question dans trois semaines.

### Lire / Modifier

**Modifier** : `DECISIONS.md`. **N'écris aucun code, ne touche à aucun test.**

### Étapes

1. Relis ce que SA1 et SB1 ont réellement livré (code, pas plan) avant d'écrire.
2. Rédige la ou les décisions au format du fichier.
3. Relis-toi contre le reste des documents : si une addition contredit une règle existante, **ne tranche
   pas** — signale-la dans ton rapport.

### Validation (commune aux deux tâches)

- **N0 auto (bloque le commit)** : `npm test` **(suite COMPLÈTE, en foreground — pas un fichier ciblé :
  une session d'un plan précédent a laissé passer une régression faute d'avoir testé l'ensemble)** → tout
  vert · `npx tsc --noEmit` → 0 erreur · `npm run build` → OK · validation Ajv des nœuds modifiés → OK.
- **N1 visuel** : `—` (S2, vague 3).
- **N2 humain (bloquant pour la consolidation, pas pour le commit)** : relecture par Thibault du texte de
  signalement HbA1c — c'est du contenu clinique affiché au praticien.

### Si bloqué

Si tu dois écrire une décision dont le code ne fait pas ce qui est décrit (SA1 ou SB1 auraient livré
autre chose que prévu) : STOP, signale l'écart avec le fichier et la ligne.

### Message de commit (appliqué en fin de plan)

`docs(doctrine): arbitrages référent du 2026-07-29 + signalement de validité de l'HbA1c (P7)`

### Statut

Suivi dans `plans/P7/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode solo).
