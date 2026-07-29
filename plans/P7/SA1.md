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

### Bilan de session (2026-07-29) — à reverser à la consolidation

**Fichiers modifiés** : `content/noeuds/diabete-type-2/prescription.yaml` (v0.35 → **v0.36**, une seule
entrée de changelog D5 pour les trois tâches) · `src/features/decision/lib/labels.ts` (2 libellés, exigés
par l'invariant I20 sur les 2 nouveaux dérivés) · `banc/__snapshots__/caracterisation.prescription.txt` et
`caracterisation-indetermine.prescription.txt`.

**T-048 — les quatre bandes, vérifiées sur le moteur réel** (cible 7,0) : 9,0 et 8,0 →
`nettement_au_dessus` ; 7,9 et 7,1 → `au_dessus` ; 7,0 · 6,9 · 6,01 → `a_l_objectif` ; 6,0 et 5,5 →
`sous_objectif`. Cible non saisie → **rien** n'est pré-rempli (gardes `> 0` + indétermination R7).
Position déjà déclarée → valeur conservée, `preremplis` vide : **aucun écrasement d'un choix manuel**.
Deux dérivés ajoutés (`ecart_sous_objectif_cible`, `ecart_a_l_objectif_cible`), écrits comme les deux
existants et sans littéral négatif (`HbA1c_cible - HbA1c_actuelle`), donc **aucun littéral nouveau** dans
le domaine de tirage du banc pour l'HbA1c. Le gros avertissement « ⚠ RIEN N'EST PRÉ-REMPLI SOUS
L'OBJECTIF » est remplacé par ce qui est vrai (les 4 bandes, leur origine, R1).
*Nuance observée, pas un défaut* : dans la bande `a_l_objectif`, la valeur proposée coïncide avec la
valeur par défaut du champ (1re valeur de l'énumération, choisie « inerte ») — `appliquerPreremplissage`
ne signale alors rien, puisqu'il ne rapporte que les changements réels. L'écran ne montre donc pas de
marqueur « pré-rempli » sur cette bande. Comportement existant du mécanisme K6, non modifié.

**⚠ POINT D'AMBIGUÏTÉ SIGNALÉ, NON TRANCHÉ (comme demandé)** : « nettement au-dessus » vaut `>= 1` dans
le contenu (formulation du 2026-07-27, « supérieure OU ÉGALE à 1 point ») ; la formulation du 2026-07-29
dit « supérieur À 1 point ». Écart exact : une HbA1c à 8,0 pour un objectif à 7,0 — aujourd'hui
`nettement_au_dessus`, `au_dessus` avec l'autre lecture. **Encodage existant conservé**, et l'ambiguïté est
écrite noir sur blanc dans le YAML (commentaire du dérivé + changelog) pour ne pas se perdre. À trancher
par le référent.

**T-049 — alerte, pas exclusion, vérifié à l'écran (modèle de vue)** : DFG 12 → option AR GLP‑1
**affichée**, badge « recommandee », **non écartée**, alerte présente. DFG 15 → affichée, pas d'alerte
(borne stricte). DFG 25 → affichée, pas d'alerte (inchangé). DFG 0 → pas d'alerte (garde `DFG > 0`).
Le commentaire du seuil `DFG < 30` ne se présente plus comme ouvert : l'arbitrage est écrit (seuil
maintenu, motif metformine, ce n'est pas un seuil de sécurité de l'AR GLP‑1).

**T-050 — les trois cas + un quatrième, vérifiés sur le moteur, pas supposés** : traitement coché →
option **applicable** ; liste renseignée **vide** → **non retenue** ; champ **non renseigné** → **EN
ATTENTE** (« à renseigner : traitements_en_cours »), ni affirmée ni écartée ; et — cas ajouté parce que
c'est là que D30/T-018 s'est déjà fait piéger — patient **`initier`** → **non retenue**, jamais en
attente (la `conditions` `intention != initier` est évaluée avant le prérequis et court-circuite).
Posé en `prerequis` (R6) et non en `conditions` : « le patient a un traitement en cours » ne s'affiche
pas comme justification. Garde `intention != initier` répété en tête des 9 termes (motif R8/T-031).

**Validation N0 — suite COMPLÈTE en foreground** : `npx tsc --noEmit` → 0 erreur · `npm run build` → OK ·
Ajv (`content.test.ts`) → 18/18 · `npm test` → **838 passés, 2 échecs**, tous deux le MÊME profil, et
**pas une régression de cette session** (cf. ci-dessous).

**Snapshots du banc — relus, pas régénérés à l'aveugle.** Delta propre à cette session isolé du travail de
SB1 (référence prise après la régénération de SB1, avant toute modification de contenu) : **seuls les deux
fichiers `*.prescription.txt` bougent** — `insuline`, `statine`, `cible-glycemique`, `rhd-*` sont
inchangés par SA1.

- `caracterisation.prescription.txt` : **5 profils sur 180** (#3, #8, #75, #132, #167), **un seul et même
  changement** — retrait de « Optimiser l'agent mal toléré », rien d'ajouté nulle part. Attendu : c'est
  exactement T-050. Quatre de ces profils ont `traitements_en_cours=[]`. Le cinquième (#3) porte
  `traitements_en_cours=[insuline]` — **valeur périmée de la fixture figée** : `insuline` n'est plus une
  valeur déclarée du critère depuis la fusion (le nœud distingue `insuline_basale`/`insuline_rapide`, et
  `libelles.test.ts` recense déjà `insuline` comme libellé mort). Pour toutes les règles du nœud, cette
  liste est indiscernable d'une liste vide ; le retrait est donc correct. Les 5 profils conservent des
  options (aucun ne devient muet).
- `caracterisation-indetermine.prescription.txt` : la même option passe **en attente** au lieu d'être
  affirmée sur des profils où `traitements_en_cours` est masqué/non renseigné — c'est le défaut que T-050
  corrige. Un profil (#9) passe à « aucune option applicable », mais avec un registre **EN ATTENTE** bien
  fourni : R10/I23 tenu, l'écran dit ce qui manque au lieu d'affirmer sur un champ jamais rempli.

### ⚠ Trou de couverture PRÉ-EXISTANT révélé (pas causé) par cette session — arbitrage clinique requis

`npm test` finit **ROUGE** sur deux invariants, tous deux sur le **profil #1576** du banc dynamique de
`prescription` : **I2′** (`banc/invariants.test.ts`, jamais `applicable` vide quand tout est renseigné) et
**I23** (`banc/securite-atteignable.test.ts`, jamais `applicable` et `enAttente` vides ensemble).

**Ce n'est pas une régression de contenu, c'est un rééchantillonnage du banc.** Preuve mesurée, pas
déduite : (a) ce patient exact, évalué contre le contenu **HEAD** (avant mes trois changements), est
**également muet** — `applicable: []`, `enAttente: 0` ; (b) il **n'existait pas** dans le banc engendré par
le contenu HEAD (recherche par signature : index −1), qui comptait **0 profil muet** ; (c) la cause du
déplacement est mécanique et connue — `seuilsNumeriques` (`banc/profils.ts`) extrait les littéraux des
règles, donc le `15` de la nouvelle alerte T-049 ajoute {14, 15, 16} au domaine de tirage du DFG
(23 → 26 valeurs distinctes) et redistribue les séquences stratifiées. Aucune des trois règles encodées ne
retire d'option à ce patient : « Optimiser l'agent mal toléré » y échoue sur sa **`conditions`**
(`intolerance_traitement == false`), pas sur le prérequis ajouté.

**Le trou lui-même** (conjonction, mesurée par balayage ciblé — **108 combinaisons muettes sur 3 840** du
sous-espace exploré, soit ~2,8 %) : `intention == initier` (le repli « Poursuivre le traitement en cours »
est fermé par son prérequis) **ET** position au-dessus / nettement au-dessus (le repli « Aucun traitement
médicamenteux — MHD seules » est fermé par `cible_atteinte == true`) **ET** `symptomes_glucotoxicite ==
true` avec `HbA1c < 10` et `cetonemie == false` — **l'asymétrie décisive** : le gate catabolique EXCLUT les
places résiduelles gliptine/sulfamide sur la seule glucotoxicité, alors que « Insuline d'initiation »
EXIGE `HbA1c >= 10 AND glucotoxicité OR cétonémie` — **ET** `DFG < 30` (socle metformine exclu) **ET**
`classes_a_benefice_indisponibles == true` (les 4 options « Introduire… » fermées par prérequis), l'AR
GLP‑1 restant par ailleurs disponible au sens du dérivé (IMC ≥ 22, pas de dénutrition), ce qui ferme aussi
« Envisager l'insuline ». Basculer **un seul** de ces critères rend le patient non muet (vérifié terme à
terme) ; `infections_uro_genitales_recidivantes` n'en fait pas partie.

**Non corrigé, délibérément** : boucher ce trou demande de décider **ce qu'on propose** à ce patient
(naïf, symptômes de glucotoxicité à HbA1c < 10, DFG < 30, classes à bénéfice déclarées indisponibles) —
c'est un arbitrage clinique, hors du périmètre explicite de cette session (« n'introduis aucune règle
clinique qui ne soit pas littéralement écrite ci-dessous »). Et il n'a pas été **silencié** :
`NOEUDS_AVEC_SORTIE_VIDE_CONNUE` (`banc/invariants.test.ts`) bascule le test en `it.fails` pour le nœud
**entier** — l'y inscrire aveuglerait I2′ sur tout `prescription`, ce qui coûterait plus que le trou.
**À router vers le référent avant le commit du plan.**

### N1 / N2 à faire (reversés à la consolidation)

- **N1** : `—` pour SA1 (aucun navigateur ici). L'effet à l'écran des 3 changements — champ
  `position_vs_cible` pré-rempli et signalé comme tel sur les 4 bandes, alerte rénale rendue sous la carte
  AR GLP‑1, disparition de « Optimiser l'agent mal toléré » sans traitement en cours — est à vérifier par
  **S2, vague 3**, comme prévu par le cadrage.
- **N2 (jugement humain, à porter dans `VALIDATION.md` à la consolidation)** : le texte de l'alerte rénale
  AR GLP‑1 dit-il « utilisable, mais peu documenté » sans se lire comme un feu rouge ? C'est le seul point
  du lot qu'aucun test ne peut trancher — l'encodage garantit que l'option reste affichée, pas que le
  praticien le comprenne ainsi.
- **Décision de périmètre, signalée** : aucune vignette permanente n'a été ajoutée à
  `evaluateNode.prescription.test.ts` (la section « Modifier » de cette session ne listait que le YAML).
  Les trois comportements ont été vérifiés par une sonde temporaire, supprimée. L'usage du dépôt veut
  qu'un arbitrage encodé reçoive sa vignette : **à ouvrir en tâche de suite** si l'orchestrateur le
  souhaite (T-050 en particulier — le cas « champ non renseigné ⇒ en attente » n'est verrouillé
  aujourd'hui que par le snapshot d'indétermination).
- **Couplage inter-sessions, pour information** : les snapshots de caractérisation sont partagés avec SB1.
  Ma régénération finale porte **les deux** deltas (badge `securite` de SB1 + retrait d'option de SA1) ;
  c'est l'état correct pour le commit de fin de plan, mais aucune des deux sessions ne peut produire son
  delta seule.
