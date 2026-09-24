# Arbitrage du statut de `CONSTRUIRE-UN-MODULE.md` — mémo à cocher

> **Pour qui décide, en cinq lignes.**
> 1. Ce que l'arbitrage débloque : la skill `construire-module-decision` (P16/S11), qui guidera l'ouverture
>    d'un deuxième domaine de décision. Elle ne pourra rendre obligatoire que ce que vous aurez validé ici.
> 2. Combien de cases : **12 points** (A1 à A12) et **1 question de statut**, soit 13 réponses. Chacune se
>    coche d'un trait ; comptez une séance.
> 3. Ce qui est déjà décidé ne vous est pas redemandé : le tableau du §1 le cite, décision par décision.
> 4. Ne rien cocher : S11 s'arrête avant d'écrire la skill (geste humain manquant) et le plan P16 se
>    termine sans elle. Le document reste « Non arbitré », comme aujourd'hui.
> 5. Ce mémo présente, il ne tranche pas : chaque point porte son revers, et aucune case n'est pré-cochée.

**Mode d'emploi.** Chaque point à arbitrer porte trois cases. « valider » : S11 garde le texte et le date
« arbitré le AAAA-MM-JJ ». « valider en amendant » : S11 recopie votre amendement mot pour mot. « rejeter » :
par défaut, S11 **marque** le passage « rejeté » et le garde comme trace ; écrivez « retirer » à côté de la
case si vous voulez qu'il disparaisse. Un classement du §1 vous paraît faux : notez-le en bas du §1.

**Trois classes, rien d'autre.**

- **Déjà acté** : une décision du registre (`DECISIONS.md`, `Dxx`) ou un texte qui fait autorité le couvre.
  Il se cite, il ne se rediscute pas.
- **À arbitrer** : proposition écrite dans le procédé, qu'aucune décision ne couvre. Renvoi au point `Ax`.
- **Historique** : constat daté du premier domaine (DT2), qui explique une règle mais ne prescrit plus rien.

Vocabulaire employé une fois pour toutes : une **porte de sortie** est la condition à remplir pour passer à
l'étape suivante ; une **vignette** est un profil de patient fictif accompagné de la sortie que vous en
attendez ; le **banc** est l'ensemble des tests automatiques qui rejouent chaque nœud sur des centaines de
profils ; le **YAML** est le fichier de contenu d'un nœud.

---

## 1. Classement, section par section

Les numéros de ligne sont ceux de `CONSTRUIRE-UN-MODULE.md` au 2026-09-24 (942 lignes).

### En-tête, §0 et principe directeur

| Section (ligne) | Classe | Fondement |
|---|---|---|
| Statut « Non arbitrée » (l.3) | à arbitrer | question de statut, §3 ci-dessous |
| Tableau des documents (l.21) | historique | à jour pour la grammaire (R1→R16), **périmé** pour le registre : « D1→D23 » (l.28) alors que le registre va jusqu'à D65 |
| §0 — ce que le document existe pour ne pas refaire (l.32) | historique | constat de la recette des 25-26/07/2026 ; ne prescrit rien |
| §1 — principe directeur « inverser l'ordre d'acquisition de la certitude » (l.74) | à arbitrer | c'est l'ordre P0→P7 lui-même ; tranché par A1-A10 et la question de statut |

### P0 — Prérequis génériques (l.79)

| Section (ligne) | Classe | Fondement |
|---|---|---|
| R7 en vigueur (l.85) | déjà acté | **D20**, amendée par **D30** |
| Invariants de banc I3→I7 (l.86) | déjà acté (les invariants) | **D19** : banc en trois couches, invariants validés par vous le 2026-07-25 |
| Bornes `min`/`max` sur tout `nombre`, et leur encadré (l.87, l.90) | déjà acté | table validée par vous le 2026-07-26 (`src/features/decision/engine/banc/couverture.test.ts` l.88-99, `schema/noeud.schema.json`) ; les bornes font partie de la définition d'un critère (**D54**) |
| Catalogue de critères canonique inter-domaines, T-019 (l.88, l.102) | à arbitrer → **A1** | aucune décision : `TASKS.md` l.56 garde T-019 ouvert ; **D28** et **D54** ne couvrent que le partage *dans* un domaine |
| Porte de sortie P0 « tout contenu produit avant est de la dette » (l.109) | à arbitrer → **A1** | aucune décision ne fait de ces prérequis une condition bloquante |

### P1 — Cadrer par la consultation (l.114)

| Section (ligne) | Classe | Fondement |
|---|---|---|
| Livrables « écrits par le référent, sans agent et sans source » (l.116) | à arbitrer → **A2** | aucune décision sur le rôle d'un agent en P1 |
| Intentions du praticien, inventaire de l'existant (l.118-123) | à arbitrer → **A3** | l'inventaire est la règle **R9**, que `GRAMMAIRE-NOEUD.md` (l.5, l.492) dit « proposition non arbitrée » |
| Question « de quelle mesure parle le nœud » (l.127) | à arbitrer → **A3** | aucune décision ; le cas cité (`6561c53`) est historique |
| « La cible est déclarée, jamais déduite » (l.132) | déjà acté | **D19** (R1) |
| Découpage en nœuds, module ou pas, charge de saisie (l.135) | déjà acté | **D22** |
| Fichier de critères communs du domaine, règle du cliquet (l.139-165) | déjà acté | **D54**, qui l'inscrit elle-même en P1 |
| Porte de sortie P1 (l.167) | mixte | fichier commun : **D54** ; intentions, inventaire, trois questions : **A3** |

### P2 — Vignettes d'acceptation (l.173)

| Section (ligne) | Classe | Fondement |
|---|---|---|
| « profils de patients réels, écrits de mémoire de consultation » (l.175) | correction imposée → **A4** | **D4** et invariant 1 de `CLAUDE.md` (zéro donnée patient) priment |
| Vignettes avant le contenu, gelées, contrat d'acceptation (l.175-182) | à arbitrer → **A5** | **D19** fait des vignettes une couche du banc, pas un préalable gelé au contenu |
| Quatre règles d'écriture (l.184) | à arbitrer → **A5** | issues d'un commit (`9deda1f`), jamais portées au registre |
| Porte de sortie P2 (l.193) | à arbitrer → **A5** | idem |

### P3 — L'écran sur trois vignettes (l.198)

| Section (ligne) | Classe | Fondement |
|---|---|---|
| Maquette à contenu faux, porte P3 (l.200, l.213) | à arbitrer → **A6** | aucune décision |
| Les quatre défauts de formulation cités (l.205-211) | historique | constats DT2 |

### P4 — Collecte EBM (l.218)

| Section (ligne) | Classe | Fondement |
|---|---|---|
| Encadré « invoquer la skill » (l.220) | déjà acté | `CLAUDE.md` (« les invoquer plutôt que de redériver ») et **D65** ; texte réécrit par S9 |
| Méthode DT2 conservée : multi-agents, red-team, source primaire (l.223) | déjà acté | **D6** (vérification bi-agents = processus de production) ; `00-global.md` étapes 2-4 |
| Enchaînement proposé pour la skill : circuit trianguler puis consolider | à arbitrer → **A7** | **D65** acte la refonte des circuits, pas leur place dans P4 |
| Périmètre piloté par les vignettes (l.228) | à arbitrer → **A8** | aucune décision |
| « Toute collecte a sa passe adversariale » (l.234) | déjà acté | **D6** |
| « Pas de nouvelle collecte tant que… » (l.235) | à arbitrer → **A8** | aucune décision |
| Les trois collectes qui sur-accusaient (l.237-246) et le quatrième cas (l.258-274) | historique | constats du 2026-07-27 |
| Règles qu'on en tire : correction de collecte après sa passe adversariale (l.248), comparaison appariée (l.276) | à arbitrer → **A8** | aucune décision ; D6 ne dit rien de la mesure |
| Porte de sortie P4 (l.285) | à arbitrer → **A8** | idem |

### P5 — Encodage (l.290)

| Section (ligne) | Classe | Fondement |
|---|---|---|
| Brouillon de la table des conditions, comme instrument (l.297-316) | déjà acté | `GRAMMAIRE-NOEUD.md` **R13** (« livrée », adossée à **D52** et **D53**) |
| Son antériorité vérifiée par `git log`, comme porte (l.334) | à arbitrer → **A9** | R13 dit l'instrument, aucune décision n'en fait une porte |
| « On ajoute le critère, on n'affaiblit pas la règle » (l.318) | déjà acté | **D20** (option « en attente, à renseigner ») |
| « Aucun contenu clinique inventé » (l.323) | déjà acté | invariant 6 de `CLAUDE.md` |
| Porte P5 : validation du schéma, typecheck, build, `presomption_non` (l.328) | déjà acté | N0 du workflow ; **D30**, précisée par **D55** |

### P6 — Deux vérifications (l.343)

| Section (ligne) | Classe | Fondement |
|---|---|---|
| Encadré « la donnée était là, l'agrégation manquait » (l.348) | historique | constat P14 du 2026-08-06 ; il motive A9 |
| Piste A fidélité, piste B comportement (l.371) | déjà acté | A : **D6** et `00-global.md` étape 8 ; B : **D19** |
| « Un invariant signale des candidats, il ne dicte pas le correctif » (l.376) | à arbitrer → **A12** | aucune décision |
| I21, I22, I23 verts (l.382) | déjà acté | **D30** (I21), **D32** (I22, I23) |
| Régénérer la table et la comparer au brouillon, divergence bloquante (l.390) | à arbitrer → **A9** | l'outil existe (`engine/banc/tableConditions.test.ts`), la porte n'est pas décidée |
| Quatrième point, portée domaine, I33 (l.424) | déjà acté | **D54** |
| Invariants de rendu (l.440) | déjà acté | **D49** (I25) ; `engine/banc/rendu-textuel.test.ts` (I28-I31, P13/S4) |

### P7 — Recette (l.450)

| Section (ligne) | Classe | Fondement |
|---|---|---|
| Recette référent (l.452) | déjà acté | `00-global.md` étape 6 (validation référent) |
| Recette navigateur obligatoire avant `valide` (l.455) | à arbitrer → **A10** | aucune décision ; D30 et D48 citent des recettes navigateur sans les rendre obligatoires |
| Deux gestes : allers-retours, résumés repliés (l.463) | à arbitrer → **A10** | aucune décision |
| Porte de sortie P7 (l.474) | à arbitrer → **A10** | idem |

### §2 — Checklists opposables (l.478)

| Section (ligne) | Classe | Fondement |
|---|---|---|
| 2.1 critère d'entrée : `nature`, bornes, `presomption_non`, valeur suggérée, liste non cochée, « change quelque chose à l'écran », `partage`, même concept (l.484-532) | déjà acté | **D19** (R1, R5), **D20**, **D30** et **D55**, **D28** et **D36**, `GRAMMAIRE-NOEUD.md` **R14** (livrée) — ⚠ contradiction n° 2 |
| 2.1 autres items : testé dans les deux sens, appartient au nœud qui agit, masqué quand sans objet, coût de recueil, critère masqué (R11), préremplissage testé deux fois (l.490-537) | à arbitrer → **A11** | aucune décision ; R11 est « proposition non arbitrée » |
| 2.2 option : délai de bénéfice, exclusion ≠ priorité, verdict ≠ remplaçant, clause de repli, message de sécurité, posologie et `accent` (l.541-571) | déjà acté | **D19** (R2, R3), **D21**, `GRAMMAIRE-NOEUD.md` **R16** (livrée, P15) |
| 2.2 « ne prend pas déjà cette classe » (l.543) | à arbitrer → **A3** | R9 |
| 2.2 une classe par option, pas déclenchée par le seul primer (l.551, l.557) | à arbitrer → **A11** | aucune décision |
| 2.3 alerte : canal, jamais `default`, libellé prohibitif, alerte d'option (l.575-587) | déjà acté | **D21**, **D24** |
| 2.3 nuance actionnable (l.588) | à arbitrer → **A3** | R9 |
| 2.4 nœud : un concept un encodage, faits de sécurité au domaine (l.602, l.624) | déjà acté | **D19** (I4), **D54**, **D56** |
| 2.4 `population_cible` déclare le hors-périmètre (l.594) | à arbitrer → **A3** | R9 |
| 2.4 table diffée contre le brouillon (l.617) | à arbitrer → **A9** | idem P6 |
| 2.4 autres items : « rien à faire » par valeur de primer, mode de sélection, bascule du primer (R12), primer et critère synchronisés, limites dans `incertitudes` (l.593-616) | à arbitrer → **A11** | aucune décision ; R12 est « proposition non arbitrée » |
| 2.5 module : cadrage partagé, primer qui oriente sans verrouiller, aucune saisie, tout nœud atteignable, au moins deux nœuds (l.635-657) | déjà acté | **D22** (et ses deux tests) |
| 2.5 indices situationnels, charge de saisie mesurée (l.641, l.658) | à arbitrer → **A11** | aucune décision ; D22 cite la charge comme risque, sans seuil |
| Encadré « un champ que personne ne lit » (l.660) | à arbitrer → **A12** | le constat est dans D22 ; la règle « consommer ou déclarer inerte dans le même lot » n'est décidée nulle part |

### §3 à §7

| Section (ligne) | Classe | Fondement |
|---|---|---|
| §3 banc en trois couches (l.671) | déjà acté | **D19** |
| §3 invariants génériques à reprendre dans tout domaine (l.683) | à arbitrer → **A1** | D19 valide les invariants DT2 ; les exiger d'un autre domaine relève de P0 |
| §3 invariant trop large, trois questions devant un rouge (l.688, l.694) | à arbitrer → **A12** | aucune décision |
| §3 dette insoluble = canal manquant (l.706) | historique | l'histoire de **D24** |
| §3 exception de dette nommée au plus fin (l.714) | déjà acté pour I33 | **D54** (« ce qui reste interdit », 5) ; sa généralisation à tout invariant → **A12** |
| §3 caractérisation : profils gelés, critères en clair (l.720) | déjà acté | **D58** |
| §4 table des pièges (l.739) | historique | chaque ligne est un constat daté ; ses parades renvoient à une décision (dont **D49**, **D50**) ou relèvent de A11/A12 |
| §4 bis correctif = piste B, lot éditorial prouvé, garde-fou franchi par une vignette, quatre niveaux de lecture repassés (l.791, l.806, l.816, l.838) | à arbitrer → **A12** | aucune décision |
| §4 bis mesure des profils gagnés et perdus, valider l'instrument (l.794, l.800) | à arbitrer → **A8** | aucune décision |
| §4 bis doute du clinicien re-sourcé (l.811) | déjà acté | invariant 6 de `CLAUDE.md` |
| §4 bis garde-fou inatteignable (l.823) | déjà acté | **D19** (couverture : chaque exclusion déclenchée au moins une fois) |
| §4 bis `visible_si` est de l'ergonomie (l.832) | à arbitrer → **A11** | c'est R11 |
| §4 bis changer le type d'un critère (l.858) | déjà acté | **D58** (« ce qui reste interdit », 5, qui cite ce passage) |
| §5 quatre formes de consignation (l.870) | historique | pratique DT2 décrite, sans obligation |
| §5 préfixe de nature dans `incertitudes` (l.883) | à arbitrer → **A12** | aucune décision |
| §6 items 3, 5, 6 (l.918, l.921, l.923) | déjà acté | 3 : **D6** ; 5 : en-tête de `DECISIONS.md` (l.3-4) ; 6 : `WORKFLOW.md` §4b (parallélisme) |
| §6 items 2 et 7 (l.917, l.927) | à arbitrer → **A8** | aucune décision |
| §6 item 4 « corrections systémiques avant le contenu » (l.919) | à arbitrer → **A1** | aucune décision |
| §6 items 1 et 8 (l.914, l.930) | à arbitrer → **A12** | aucune décision |
| §7 ce que le document coûte (l.936) | historique | plaidoyer ; il éclaire la question de statut |

**Un classement vous paraît faux ?** Notez-le ici (section, classe voulue) : ____

---

## 2. Les points à arbitrer

### P0

#### A1 — Les prérequis de P0 sont-ils une porte bloquante, catalogue inter-domaines compris ?

- **Ce que le procédé prescrit.** Aucun contenu d'un nouveau domaine ne s'écrit tant que quatre prérequis
  ne sont pas tenus, dont les invariants génériques du banc (§3) et un catalogue de critères partagés
  *entre domaines* (âge, DFG, fragilité, espérance de vie) qui n'existe pas (T-019, ouvert) ; §6 item 4 dit
  la même chose des corrections du moteur.
- **Si vous validez.** La skill refuse d'ouvrir P1 tant que P0 n'est pas vert. Le premier chantier d'un
  deuxième domaine devient technique : construire le catalogue, sans aucun contenu clinique.
- **Revers.** T-019 n'est planifié nulle part : le deuxième domaine l'attend. Et un catalogue commun à
  plusieurs domaines tire à l'inverse de deux décisions : **D36** (un nœud réduit un critère partagé à ce
  qu'il en consomme) et **D22** (le socle de critères partagé du module n'a pas été livré, pour ne pas créer
  de chaînage). Le valider demande de dire comment il s'articule avec elles. Amendement possible : valider
  la porte sans la ligne « catalogue ».

`[ ] valider · [x] valider en amendant : porte bloquante, sauf la ligne « catalogue inter-domaines » (T-019), qui ne bloque pas et reste à cadrer avec D22 et D36 · [ ] rejeter`

### P1

#### A2 — En P1, la skill présente et signale, ou elle aide à rédiger ? *(point imposé n° 1)*

- **Ce que le procédé prescrit.** Les intentions du praticien et l'inventaire de l'existant sont écrits
  « par le référent, sans agent et sans source ». Lecture actuelle : la skill montre les champs à remplir et
  détecte ce qui manque. Amendement possible : elle assiste activement la rédaction (propose des intentions,
  questionne, reformule).
- **Si vous validez (lecture actuelle).** La skill n'écrit aucune ligne de P1. Elle présente le gabarit,
  relit votre texte et nomme les trous. Le contenu clinique de P1 reste entièrement le vôtre.
- **Revers.** P1 prend votre temps, seul, sans aide à la formulation ; sur un domaine loin de votre
  pratique, la page peut rester blanche. L'amendement gagne ce temps, mais une intention proposée par un
  agent et acceptée d'un clic devient la vôtre sans que vous l'ayez pensée : c'est ce que « sans agent »
  voulait empêcher.

`[ ] valider · [x] valider en amendant : la skill interroge le référent (situations, décisions, cas limites) pour faire émerger ses intentions, sans jamais en proposer ; elle présente le gabarit, relit et nomme les manques · [ ] rejeter`

#### A3 — Les livrables de P1, dont l'inventaire de l'existant (règle R9), deviennent-ils obligatoires ?

- **Ce que le procédé prescrit.** Avant toute vignette, le référent écrit les intentions propres au domaine
  et l'inventaire de ce qui est déjà en place chez le patient (classes, doses, tolérance), puis tranche par
  écrit la question « de quelle méthode de mesure parle le nœud ».
- **Si vous validez.** L'inventaire de l'existant généralise **R9** (« savoir si le geste est déjà fait »),
  que la grammaire dit encore « proposition non arbitrée ». Les items de checklist qui en découlent
  deviennent opposables : « ne prend pas déjà cette classe » (2.2), « nuance actionnable » (2.3),
  « hors-périmètre déclaré dans `population_cible` » (2.4). Une partie est déjà mécanisée (invariant I15).
- **Revers.** Un livrable écrit de plus avant tout contenu. Et `GRAMMAIRE-NOEUD.md` continuera d'écrire
  « R9 non arbitrée » : ce fichier n'est pas dans la zone de S11, il faudra le reprendre ailleurs.

`[x] valider · [ ] valider en amendant : ____ · [ ] rejeter`

### P2

#### A4 — « Patients réels » devient « situations synthétiques, non identifiantes » *(point imposé n° 2 — correction)*

- **Ce que le procédé prescrit.** « 15-25 profils de patients réels, écrits de mémoire de consultation »
  (l.175). Formulation corrigée : **15-25 situations synthétiques, non identifiantes** — elles peuvent
  s'inspirer de situations habituelles, aucune ne reproduit un patient.
- **Ce n'est pas une option.** L'invariant « zéro donnée patient » (**D4**, invariant 1 de `CLAUDE.md`)
  prime sur le texte du procédé. S11 applique la correction quelle que soit la case ; vos cases portent sur
  la **formulation**, pas sur le principe.
- **Si vous validez.** S11 remplace la formulation ; la skill écarte toute vignette qui décrirait un patient
  reconnaissable (date, lieu, histoire singulière).
- **Revers.** Une vignette trop lisse manque les cas tordus que P2 exige (patient qu'on n'équilibre pas,
  refus, donnée manquante) : la liste des cas tordus reste obligatoire. La même formulation « patients
  réels » figure aussi dans `GRAMMAIRE-NOEUD.md` l.891, hors de la zone de S11.

`[x] valider · [ ] valider en amendant : ____ · [ ] rejeter`

#### A5 — Les vignettes sont-elles écrites et gelées avant tout contenu, et deviennent-elles le contrat ?

- **Ce que le procédé prescrit.** Vous écrivez, relisez et gelez les vignettes avant la collecte ; le
  contenu est jugé correct s'il produit leurs sorties, pas s'il recopie fidèlement un dossier. Quatre règles
  d'écriture : la sortie attendue vient de vous ; une vignette vérifie un contenu (option, alerte), jamais
  un nombre de cartes ; les attentes non encore satisfaites sont nommées et deviennent la liste du travail
  restant ; un comportement correct qui ressemble à un oubli est épinglé.
- **Si vous validez.** La skill n'ouvre ni la collecte (P4) ni l'encodage (P5) avant votre gel.
- **Revers.** 15 à 25 vignettes à écrire et relire avant le moindre résultat : plusieurs séances. Une
  vignette gelée tôt peut être contredite par la preuve ; il faut alors la rouvrir, et c'est vous qui la
  rouvrez.

`[ ] valider · [x] valider en amendant : la skill propose des vignettes (situation synthétique et sortie attendue) ; le référent les valide, les corrige et en ajoute d'autres ; elles sont gelées après sa validation et deviennent le contrat · [ ] rejeter`

### P3

#### A6 — Une maquette à contenu volontairement faux, montrée avant la collecte ?

- **Ce que le procédé prescrit.** Avant la collecte, vous voyez trois écrans rendus sur trois vignettes,
  avec un contenu clinique volontairement faux, et vous validez le registre de formulation : ce que l'outil
  dit, sur quel ton, dans quel ordre.
- **Si vous validez.** Les défauts de formulation (alerte qui contredit la carte, verbe « instaurer »
  adressé à qui prend déjà le traitement, jeton technique affiché brut) sont attrapés avant d'avoir coûté
  une collecte ; en DT2, chacun a coûté une vague de correction.
- **Revers.** Un arrêt de plus pour vous avant tout contenu clinique. Et une capture d'écran de contenu faux
  qui circule peut tromper : la maquette doit être marquée « contenu fictif » partout.

`[x] valider · [ ] valider en amendant : ____ · [ ] rejeter`

### P4

#### A7 — En P4, la skill appelle le circuit de recherche puis la consolidation ? *(point imposé n° 3)*

- **Ce que le procédé prescrit.** Proposition du rapport (§11.3), pas du document : en P4, la skill dérive
  les sous-questions des vignettes, lance `recherche-preuve-triangulee`, puis la consolidation
  (`.claude/skills/recherche-source-primaire/references/consolidation.md`, écrite en S7, qui remplace la
  skill `consolider-preuves` envisagée).
- **Si vous validez.** P4 passe par un circuit unique, celui que le corpus d'épreuve mesure (S10). Le dossier
  consolidé arrive devant vous pour validation clinique avant l'encodage.
- **Revers.** La skill dépend de deux circuits réécrits dans ce même plan (S7, S8) : si S10 y mesure une
  régression, P4 en hérite. Chaque passage peut demander des questions OpenEvidence, avec votre accord, sur
  votre compte.

`[x] valider · [ ] valider en amendant : ____ · [ ] rejeter`

#### A8 — Discipline de collecte et de mesure (P4, §4 bis, §6)

- **Ce que le procédé prescrit.** La collecte se borne aux décisions qu'exigent les vignettes ; pas de
  nouvelle collecte tant que les constats de la précédente ne sont pas intégrés ; aucune correction issue
  d'une collecte n'entre dans le contenu avant sa passe adversariale ; toute affirmation « N profils
  perdent X » vient d'une comparaison appariée (le même patient, avec et sans le facteur), mesurée avec un
  instrument d'abord vérifié sur un cas dont on connaît la réponse.
- **Si vous validez.** Les chiffres qu'on vous rapporte arrivent avec leur méthode. Une collecte qui accuse
  un nœud existant est traitée comme suspecte d'abord : en DT2, trois sur quatre avaient tort.
- **Revers.** Moins de collecte, donc des zones restées en prose. La comparaison appariée suppose un banc
  déjà en place pour le domaine, ce qui lie ce point à A1.

`[x] valider · [ ] valider en amendant : ____ · [ ] rejeter`

### P5-P6

#### A9 — La table des conditions : brouillon daté avant le YAML, comparaison bloquante à la clôture

- **Ce que le procédé prescrit.** Avant la première ligne de YAML, un brouillon de table (une ligne par
  option, conditions côte à côte) s'écrit dans le dossier du nœud, et sa date doit précéder le premier
  commit du YAML ; à la clôture, la table régénérée par l'outil est comparée au brouillon, et toute
  divergence non justifiée bloque.
- **Si vous validez.** La skill contrôle la date par `git log` et refuse de clore un nœud sans
  comparaison justifiée. L'instrument est déjà acté (R13) ; c'est la porte qui devient obligatoire.
- **Revers.** L'ordre devient rigide : un brouillon écrit après coup ne vaut rien et ne se rattrape pas.
  Toute découverte légitime pendant l'encodage oblige à rouvrir la vignette concernée (P2), donc à vous
  solliciter.

`[x] valider · [ ] valider en amendant : ____ · [ ] rejeter`

### P7

#### A10 — Recette navigateur obligatoire avant qu'un nœud passe `valide`

- **Ce que le procédé prescrit.** En plus de votre recette, une passe dans le navigateur suivant
  `docs/decision/validation/PROMPT-recette-navigateur.md` est obligatoire ; elle joue les allers-retours
  (changer l'intention sur un formulaire rempli, revenir, relire) et relit les résumés de sections repliées
  après chaque geste global.
- **Si vous validez.** Aucun nœud ne passe `valide` sans elle. En DT2, deux passes de ce type ont trouvé
  plus de défauts graves que cinq audits et 769 tests réunis.
- **Revers.** Du temps par nœud, et une passe qui ne s'automatise pas : le workflow interdit toute
  automatisation de navigateur hors du navigateur intégré à Claude Code Desktop.

`[x] valider · [ ] valider en amendant : ____ · [ ] rejeter`

### Checklists

#### A11 — Les items de checklist qu'aucune décision ne porte deviennent-ils opposables ?

- **Ce que le procédé prescrit.** Les checklists du §2 se passent avant de déclarer un nœud `valide`. La
  plupart des items reposent déjà sur une décision (tableau du §1). Restent : ceux qui reposent sur **R11**
  (un critère décisif n'est jamais caché) et **R12** (changer d'intention ne perd pas la saisie), que la
  grammaire dit « non arbitrées » bien que R11 soit en partie mécanisée (I26) ; et ceux nés d'un cas
  unique : critère testé dans les deux sens, coût de recueil déclaré, préremplissage testé deux fois, une
  classe par option, option jamais déclenchée par le seul primer, « rien à faire » possible pour chaque
  intention, mode de sélection choisi, primer et critère synchronisés, limites écrites dans `incertitudes`,
  indices situationnels du module, charge de saisie mesurée.
- **Si vous validez.** Chaque item devient une case que la skill fait cocher avant `valide`, R11 et R12
  comprises.
- **Revers.** Une quinzaine de cases de plus par nœud. Un item tiré d'un seul cas peut être trop large :
  l'invariant I7 a dû être resserré deux fois pour cette raison. L'amendement vous laisse rayer des items.

`[ ] valider · [x] valider en amendant : R11 et R12 deviennent opposables ; les items nés d'un cas unique restent un aide-mémoire · [ ] rejeter`

### Banc, pièges, consignation

#### A12 — Les règles de métier du §3 au §6 sont-elles opposables, ou un aide-mémoire ?

- **Ce que le procédé prescrit.** Écrits comme retours d'expérience, les §3 à §6 contiennent des règles :
  devant un invariant rouge, poser trois questions dans l'ordre ; un invariant ouvre une analyse, il ne
  dicte pas le correctif ; une exception de dette se nomme au plus fin, pour tout invariant ; tout
  garde-fou ajouté a sa vignette qui le franchit et sa contre-épreuve ; un lot éditorial prouve qu'il l'est
  par un instantané inchangé ; un correctif repasse la vérification de comportement ; un lot qui change une
  carte repasse les quatre niveaux de lecture de tout le domaine ; un champ de schéma est lu ou déclaré
  inerte dans le même lot ; chaque entrée `incertitudes` porte un préfixe de nature (`PREUVE:`,
  `ARBITRAGE:`, `CONCEPTION:`, `SOURÇAGE:`, `TECHNIQUE:`) ; un seul document d'état par chantier ; le statut
  du contenu est visible là où il est lu.
- **Si vous validez.** La skill les fait appliquer. Le préfixe de nature devient la convention des nouveaux
  domaines (les 55 entrées DT2 ne sont reprises que si vous l'écrivez).
- **Revers.** Des portes de plus à chaque lot. Le préfixe n'est contrôlé par aucun test tant qu'on n'en
  écrit pas. « Statut visible à l'écran » est un chantier de code, planifié nulle part. Rejeter garde ces
  sections comme aide-mémoire, sans obligation.

`[ ] valider · [x] valider en amendant : aide-mémoire, sauf deux règles opposables pour les nouveaux domaines : le préfixe de nature de chaque entrée `incertitudes` et un seul document d'état par chantier · [ ] rejeter`

---

## 3. Question de statut (obligatoire)

Quel statut donner à `CONSTRUIRE-UN-MODULE.md` ?

`[ ] procédé arbitré (la skill le rend prescriptif) · [x] arbitré en partie (la skill ne prescrit que les points validés) · [ ] reste une proposition (la skill oriente sans prescrire)`

**Arbitré par le référent le 2026-09-24** (séance de validation de la vague 2 de P16).

---

## 4. Contradictions relevées entre le procédé et le registre

La décision prime dans chaque cas ; aucune n'arrête l'arbitrage.

1. **P2, « patients réels » (l.175) contre D4.** Traitée comme correction en A4. Même formulation dans
   `GRAMMAIRE-NOEUD.md` l.891, hors zone de S11.
2. **Checklist 2.1, `presomption_non` (l.487-489) contre D30 et D55.** L'item l'interdit dès qu'une
   `exclusions` ou un `prerequis` quelconque lit le critère. **D30** ne l'interdit que sur les options
   `role: securite`, comme la porte P5 du même document (l.330). **D55** l'autorise même, indirectement, dans
   l'exclusion d'une carte `role: geste` qui choisit entre deux gestes d'une même famille. Classé « déjà
   acté » ; S11 aligne la formulation de l'item sur D30 et D55.
3. **Tableau des documents (l.28) : « D1→D23 ».** Le registre va jusqu'à D65. Mise à jour mécanique, pas
   un arbitrage.
4. **Catalogue inter-domaines de P0 (l.88) face à D22 et D36.** Pas une contradiction franche, une
   tension ; elle figure dans le revers d'A1.
5. **Hors du document, pour mémoire.** L'en-tête de `GRAMMAIRE-NOEUD.md` (l.5-8) dit R9, R11 et R12
   « non arbitrées », alors que le banc en mécanise déjà une partie (I15 pour R9, I26 pour R11). Si vous
   validez A3 ou A11, cet en-tête devient faux ; il n'est pas dans la zone de S11.
