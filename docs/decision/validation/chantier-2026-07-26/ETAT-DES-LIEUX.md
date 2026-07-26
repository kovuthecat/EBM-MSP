# État des lieux — chantier du 2026-07-26

> **Rôle de ce document** : source unique de vérité du chantier. Ce qui est fait, décidé, en cours,
> ouvert. À mettre à jour à chaque étape — l'état ne vit plus dans les échanges.
> **Origine** : recette référent du 2026-07-25/26 (`../recette-2026-07-25-prescription-intensifier.md`).

---

## Vue d'ensemble

Deux chantiers, de maturité très différente. Ils ne doivent **pas** avancer en parallèle : l'encodage
du RHD dépend des corrections systémiques.

| | chantier B — corrections systémiques | chantier A — module RHD |
|---|---|---|
| nature | moteur + grammaire, tous nœuds | contenu clinique, un module |
| maturité | **prêt à coder, 1 décision manquante** | conception faite, contenu collecté, à corriger |
| horizon | jours | semaines |
| dépendance | aucune | **attend B** (C1/C2) pour l'encodage |

**Règle de séquencement retenue** : finir B jusqu'à la livraison ; garder A en conception/collecte,
sans nouvelle collecte tant que les findings existants ne sont pas intégrés.

---

## Chantier B — corrections systémiques

### Fait

| livrable | état |
|---|---|
| Analyse systémique — 6 causes racines | ✅ |
| Caractérisation *golden master* (`banc/caracterisation.test.ts` + 5 snapshots, 180 profils/nœud) | ✅ 329 tests verts, `tsc` propre, déterminisme vérifié octet à octet |
| Inventaire des 35 alertes de nœud (`inventaire-alertes.md`) | ✅ 1 → exclusion · 4 → alerte d'option · 1 bloquée · 6 couples contradictoires |
| Inventaire existant & primer (`inventaire-existant-primer.md`) | ✅ 4 options d'ajout sans garde-fou · 5 critères manquants · 2 moitiés de primer absentes |
| Surface des valeurs manquantes (`surface-valeurs-manquantes.md`) | ✅ 86 règles · 56 rassurant / 16 alarmant / 14 neutre · 1 division à risque |
| Inventaire de sourçage (`sourcage-position-critique.md`) | ✅ 56 occurrences · 30 arguments d'autorité dont 28 affichés · 5 « donnée à fournir » |
| Spécification (`SPEC-valeur-indeterminee.md`) | ✅ |
| Décisions `DECISIONS.md` D20-D23 | ✅ |

### Décidé

- **D20** — valeur indéterminée : le moteur ne se prononce pas ; option **en attente** si une
  `conditions`, `prerequis` ou `exclusions` est indéterminée ; alertes, doses et dérivés muets.
- **D21** — canal d'un fait de sécurité : contre-indication → `exclusions` ; réserve → alerte
  d'option ; fait indépendant du geste → alerte de nœud. `priorite` jamais ; `quand: default` jamais.
- **D22** — module à préambule partagé + primer.
- **D23** — la position affichée s'appuie sur la donnée publiée, jamais sur le nom d'une revue.
- **Périmètre `statine`** : ajout de `statine_deja_en_place` et `intolerance_statine` (référent,
  2026-07-26). ⚠ **à consigner** dans `docs/decision/noeuds/F-statine.md` — décision node-specific,
  aujourd'hui tracée nulle part ailleurs qu'ici.

### Bloquant

**Aucun.** Dernier point tranché le 2026-07-26 : **`diabete_complique` seul** porte
`confirmation_requise`. Consigné en `docs/decision/noeuds/F-statine.md` §9.2.

### ✅ Vagues 1 et 2 LIVRÉES (2026-07-26) — R7 est en vigueur

| lot | livré |
|---|---|
| **R7 moteur** | logique ternaire (`conditions`, `deriveCritere`), registre `enAttente` (`evaluateNode`), porté par `VueDecision` et `signatureVue`, champ de schéma `confirmation_requise`, `visible_si` indéterminé → champ visible |
| **Câblage UI** | `renseignes` alimenté depuis `touched` ; **champ vidé retiré de `renseignes`** (corrige 12.2 / 13.3 — effacer ne vaut plus confirmation d'un zéro) ; bloc `enAttente` rendu ; seuil « Rien à signaler » descendu à **1** ; marqueur « à confirmer » étendu aux `bool` `confirmation_requise` |
| **Invariants** | **I3** (aucune prononciation sur un critère indéterminé) : **0 violation / 5 nœuds** · **I2′** reformulé · **I6/I7** (contenu) livrés, dette documentée en `it.fails` |
| **Caractérisation** | ligne de base « profils complets » **relue et ré-acceptée** ; nouvelle caractérisation « profils partiellement renseignés » dans des fichiers séparés |

**Le défaut fondateur est corrigé et démontré.** Formulaire vierge, `renseignes` vide :

- `prescription` — la metformine n'est plus **écartée** sur un `DFG < 30` jamais saisi : elle passe
  en attente, « à renseigner : DFG ». Plus aucune option écartée à tort ;
- `statine` — « Discuter la statine » n'est plus affichée comme recommandation ferme fondée sur trois
  champs vides : en attente, « à renseigner : anciennete_diabete_annees, autres_FDRCV ».

**Diff de la ligne de base, relu avant acceptation** : 0 profil changé sur `prescription`,
`statine`, `rhd`, `cible-glycemique` ; **23 sur `insuline`**, tous de même cause — l'alerte « Dose
basale élevée » ne se déclenche plus sur un poids inconnu (`dose / poids` valait `Infinity`, défaut
12.4). Effet de bord favorable : cette alerte est celle qui interdisait le geste que la carte
chiffrait (12.8) — ses déclenchements fictifs disparaissent. Le cas authentique relève de R8.

**État de la suite** : `tsc` propre · **407 tests verts, 6 échecs attendus** (dette I6/I7).

### Reste à faire — vague 3

| | quoi |
|---|---|
| 1 | **R8** — réaffectation des alertes ; `statine` en premier (ses 2 critères sont décidés, cf. F-statine §9.1) |
| 2 | prérequis manquants (`prescription:465`, `insuline:121`) — **précédé** du traitement de la préemption du repli d'`insuline` (12.11) |
| 3 | règle d'âge `statine` (CARDS 40-75, `age` aujourd'hui inerte) · borne de domaine sur `autres_FDRCV` (accepte −1) |
| 4 | `visible_si` d'`insuline` (8 champs en situation « Naïf ») |
| 5 | primer en sortie (`prescription`/`intention`) — **reléguer + expliquer**, jamais supprimer |
| 6 | **D23** — modèle de sources par nature, `ArgumentPanel`, 28 occurrences affichées |

**Reliquat technique signalé par le lot UI**, hors de son périmètre : `decisifsAConfirmer` /
`champsVisibles` (`lib/formLayout.ts`) évaluent encore la visibilité en mode repli, alors que
`CriteriaForm` applique le fail-open indéterminé. Sans conséquence clinique — un champ nouvellement
visible peut ne pas recevoir son rappel « à confirmer » — mais c'est **deux chemins en désaccord sur
ce qui est affiché**, la famille de défaut que ce projet a déjà rencontrée quatre fois. À refermer.

### À faire, dans l'ordre

| | quoi |
|---|---|
| 1 | invariants de banc I3-I7 |
| 2 | **R7** — moteur ternaire, dérivés, calculs, statut de valeur, registre `enAttente`, écran « à renseigner » |
| 3 | relecture du diff de caractérisation, nœud par nœud |
| 4 | **R8** — réaffectation des alertes, appariée aux critères manquants (`statine` d'abord) |
| 5 | prérequis manquants (`prescription:465`, `insuline:121`), règle d'âge `statine`, `visible_si` d'`insuline` |
| 6 | primer en sortie (`prescription`/`intention`) — **reléguer + expliquer**, jamais supprimer |
| 7 | **D23** — réorganisation du modèle de sources par nature, `ArgumentPanel`, 28 occurrences affichées |

**Couplages à ne pas casser** : `insuline` — traiter la préemption du repli (12.11) avant d'ajouter
un prérequis ; `statine` — les 2 critères avant de transformer l'alerte dialyse en exclusion.

---

## Chantier A — module RHD

### Fait

| livrable | état |
|---|---|
| Analyse de pertinence + pistes de refonte | ✅ (dans la recette, §1-§8) |
| Conception du module (`CONCEPTION-module-rhd.md`) | ✅ |
| Collecte alimentation (`rhd-collecte-alimentation.md`) | ✅ 8 socle + 11 · 17 pistes |
| Collecte activité (`rhd-collecte-activite-physique.md`) | ✅ 7 socle + 10 · 10 pistes · 7 garde-fous |
| Red-team des 2 collectes (`redteam-collectes-rhd.md`) | ✅ **4 HAUTE, 5 MOYENNE, 2 BASSE** |
| Collecte de preuve « AP et critères durs » (`preuve-activite-physique.md`) | ✅ 23 références |
| Passe OpenEvidence (référent) | ✅ `Downloads/Rapport OE activité physique.txt` |
| Red-team de la collecte de preuve | ⟳ **en cours** |

### Décidé

- Deux nœuds distincts — *alimentation*, *activité physique* — sous un module RHD commun.
- Préambule partagé (terrain + verrous) et primer de levier.
- Sédentarité = **famille de pistes du nœud activité**, pas un nœud distinct (pilote).
- Perte de poids et rémission = **en-tête du module**, plus une option.
- Rupture de sédentarité : **minimum 1 min/heure** (HAS R.16, grade C) — citation vérifiée en
  red-team, choix bien fondé.
- Collecte sur les deux axes ; construction en commençant par l'alimentation.

### État de la preuve — consolidé après OE

Convergence des trois sources (collecte A, OE, red-team en cours) sur le fond ; **deux chiffres
corrigés par OE**.

| population | intervention | critère dur | résultat |
|---|---|---|---|
| **DT2 établi** | exercice **isolé** (IDES, suivi 16,2 ans) | mortalité toutes causes | **HR 0,89 (0,66-1,19) — NS** |
| **DT2 établi** | combinée diète + exercice (Look AHEAD) | composite CV | **neutre** |
| **DT2 + microalbuminurie** | multifactorielle **incluant des médicaments** (Steno-2) | composite CV, mortalité | **positif** — mais l'exercice n'y est pas isolable |
| **Prédiabète** | **régime seul** (Da Qing, 30 ans) | mortalité toutes causes / CV / événements | **0,77 · 0,67 · 0,72 — tous significatifs** |
| **Prédiabète** | **exercice seul** (Da Qing, Yu 2024) | idem | **0,81 · 0,80 · 0,81 — tous NS** |
| **Prédiabète** | mode de vie intensif (DPPOS, 21 ans) | MACE / mortalité | **HR 1,14 · 1,02 — NS** |
| **Coronariens** | réadaptation à l'effort (Dibben, 85 ECR) | **mortalité CV** | **dépend de la fenêtre — voir ci-dessous** ; mortalité toutes causes RR 0,96 **NS** ; IDM RR 0,82 |

⚠ **Réadaptation cardiaque — le chiffre le plus fort est le moins gradé** (red-team, finding HAUTE F-1) :

| fenêtre | mortalité CV | cotation |
|---|---|---|
| 6-12 mois | **RR 0,88 — non significatif** | **cotée « Moderate » par Cochrane** |
| long terme | RR 0,58 (collecte A) / RR 0,74 (méta EHJ 2023, passe OE) | **jamais gradée par Cochrane** — sous-ensemble décroissant, 8/85 essais |

La collecte A affichait « GRADE élevé » sur le chiffre long terme. C'est l'inverse : **la seule fenêtre
formellement cotée est non significative sur la mortalité CV.** L'appui adjacent de l'axe activité est
donc bien plus étroit qu'annoncé — et la 5ᵉ étiquette risque de n'avoir aucun occupant solide.

**Corrections apportées par OE à la collecte A** — à confirmer par le red-team :

- réadaptation cardiaque : **RR 0,74**, non 0,58 ; et la **mortalité toutes causes n'est pas
  significative** ;
- **aucune analyse de sous-groupe DT2** dans la revue Cochrane. Les données propres au diabétique
  coronarien sont **observationnelles** (HR 0,46-0,56) — la mention « ~22 % de diabétiques
  documentés » de la collecte A n'est pas soutenue ;
- OE ne mentionne **pas IDES_2** ni la discordance annoncée par la collecte A. Point à trancher par
  le red-team.

**Deux enseignements non anticipés :**

1. **Da Qing sépare la diète de l'exercice, et seule la diète est significative.** C'est un appui
   pour l'axe *alimentation* (en population prédiabétique) et un désaveu pour l'exercice isolé, y
   compris en prévention.
2. **DPPOS est négatif sur tous les critères CV durs à 21 ans**, malgré une prévention durable du
   diabète. Contrepoids à ne pas taire.

### Ouvert — par ordre de ce qu'il bloque

1. **Corriger les 4 findings HAUTE de la collecte alimentation** — SFD 2025 mal attribuée (×3
   pistes), colza absent de PREDIMED, référence émulsifiants/édulcorants transposée, grade A/B
   recopié. Bloque toute écriture de contenu.
2. **L'étiquette « EBM dur » appartient-elle à une piste ou à l'en-tête du module ?** Le bras
   randomisé de PREDIMED est un motif alimentaire supplémenté, pas un geste isolé. Si l'on tient
   cette rigueur, aucune piste ne peut porter l'étiquette seule.
3. **5ᵉ étiquette « bénéfice dur démontré en population adjacente » ?** Recommandée par la collecte A.
   À figer après le red-team : si la réadaptation cardiaque et Da Qing tombent, l'étiquette n'a plus
   d'occupant.
4. **Intégrer `sources/HAS activité physique.pdf`** — source ajoutée par le référent le 2026-07-26,
   **lue par aucun agent à ce jour**.
5. **Règle de tri des pistes** (§8-5 de la recette, jamais tranchée) — proximité à la cible EBM
   d'abord, ou faisabilité ? Rang **déclaré dans le contenu**, jamais un score caché (D3).
6. **Plafond d'affichage** — combien de pistes à l'écran (ebmfrance plaide pour 2-3) ?
7. **Traditions culinaires** (§8-2) — désignée par le référent comme la question qui conditionne tout
   le reste : lesquelles, sur quelle base, fournies par qui.
8. **Frontière ETP / diététicien** (§8-6).
9. **Nom et forme du champ de module** dans le schéma.
10. **MEDAS** — introuvable dans les sources locales (recherche exhaustive). À récupérer en source
    primaire si l'on veut s'en servir ; aucun item ne doit être reconstitué.

---

## Clôture de la session du 2026-07-26

**Suite : 23 fichiers · 446 tests verts · 13 échecs attendus · `tsc -b` et `npm run build` verts.**

### Couverture par vignettes — avant / après

| nœud | avant | après |
|---|---|---|
| `prescription` | 37 vignettes, **13 options couvertes sur 24** | 56 vignettes, **24/24** |
| `cible-glycemique` | 13, dont 2 assertions faibles | 21, assertions de contenu |
| `insuline` | **0** | **10** |
| `statine` | **0** | **9** — aucune divergence, le contenu est conforme |

### Les 13 rouges SONT la liste de travail

Chacun porte en commentaire la décision référent qui l'a validé, sa date, ce qui manque et le chantier
qui le lèvera. Rien ne peut être oublié : l'attente est écrite et rouge.

| rouge | ce qui manque |
|---|---|
| A-15 | aucune route de `antecedent_cv` vers ≤ 8 % — le critère ne sait qu'**interdire** la cible stricte |
| A-18 | le nœud relâche sur un risque hypoglycémique élevé là où le référent veut changer le traitement ; `cible-glycemique` n'a **aucune alerte** pour le dire |
| E-02 | aucune alerte de cohérence (situation « naïf » + insuline déclarée) |
| E-03 | le pivot est encore `gaj_a_cible` ; attendu : profil nocturne, GAJ en repli sans MCG |
| E-04b · E-06 | **même cause** : la situation « basale seule » n'a aucune option d'efficacité cumulable (elle n'existe qu'en « basale + bolus ») |
| P-39 | critère `dose_metformine` absent |
| I6 · I7 | alertes `quand: default` et alertes prohibitives sans exclusion (`insuline`, `prescription`, `rhd`) |
| couverture `insuline` | défaut du générateur de profils (poids de 0,5 kg) — levée par les bornes |

### En attente d'un arbitrage du référent

1. **A-01c** — fragile *et* espérance de vie limitée : < 9 % (comportement actuel) ou ≤ 8 % ?
2. `antecedent_cv` doit-il ouvrir une route vers ≤ 8 % ? (cause d'A-15)
3. Risque hypoglycémique élevé chez un sujet jeune : relâcher, ou maintenir l'objectif avec une alerte
   désignant le traitement — ce qui suppose de donner des alertes à ce nœud ? (cause d'A-18)
4. **Étiquette « EBM dur » : piste ou en-tête ?** Deux pistes la revendiquent (huile d'olive, fruits à
   coque) sur une preuve — PREDIMED — dont l'unité randomisée est un *motif alimentaire supplémenté*,
   pas un geste isolé.
5. **Socle alimentation à 12 items** — tend la contrainte de consultation courante, le risque n° 1 de
   la refonte.
6. Seuil de rupture de sédentarité : 4 sources divergentes, dont une disant « preuves insuffisantes » →
   l'afficher en **repère**, pas en seuil ?
7. Alerte hypoglycémie sous insulinosécréteur côté activité : la passer en **blocage dur** ? Ce serait
   un changement de nature vs l'arbitrage §8-5 rendu pour la même alerte côté alimentation.
8. **Passe de preuve à lancer** : bénéfice d'introduire une statine à 82 ans en prévention primaire, et
   déprescription à cet âge.

## Capitalisation — deux documents transverses issus de ce chantier

| document | contenu | statut |
|---|---|---|
| `docs/decision/GRAMMAIRE-NOEUD.md` | **R7** (valeur indéterminée, D20) et **R8** (canal d'un fait de sécurité, D21) y sont désormais énoncées comme règles génériques, à côté de R1→R6. **R9** ajoutée en proposition : *un nœud qui recommande un geste doit savoir si le geste est déjà fait* — forme testable : tout concept nommé comme réserve dans la prose est soit un critère d'entrée, soit déclaré hors périmètre. Nuance ajoutée à R5 (un critère peut la satisfaire en n'allumant qu'une alerte, cf. `age` dans `statine`). | R7 livrée · R8 à livrer · **R9 à arbitrer** |
| `docs/decision/CONSTRUIRE-UN-MODULE.md` | **Nouveau.** Procédé de construction d'un module, tous domaines : P0→P7 avec porte de sortie par étape, 5 checklists opposables (critère / option / alerte / nœud / module), tableau des 12 pièges constatés, formes de consignation de ce qui ne s'encode pas, discipline de session. Destiné au **prochain domaine**. | **à arbitrer** (les portes de sortie engagent du temps référent) |

Référencé depuis `CLAUDE.md`, `PROJECT_MAP.md`, `BRIEF_DECISION.md` §5 et `00-global.md`.

**Deux points à arbitrer par le référent**, listés ici pour ne pas être perdus à la clôture :

1. **R9** — généraliser en règle opposable à tout nouveau nœud (le cas `statine` est déjà tranché :
   ajout de `statine_deja_en_place` et `intolerance_statine`), et écrire l'invariant de banc
   correspondant.
2. **Le procédé P0→P7** — en particulier P2 (vignettes d'acceptation **gelées avant** le contenu) et
   P3 (écran maquetté sur 3 vignettes avec contenu faux), qui déplacent l'effort référent vers
   l'amont. C'est le point qui aurait le plus changé le DT2, et c'est celui qui coûte le plus tôt.

## Discipline pour la suite

1. **Un seul document d'état** — celui-ci. Toute décision s'y consigne, puis migre vers
   `DECISIONS.md` (transverse) ou `docs/decision/noeuds/` (clinique).
2. **Pas de nouvelle collecte** tant que les findings de la précédente ne sont pas intégrés.
3. **Toute collecte de contenu clinique a sa passe adversariale** — la règle a payé : 4 HAUTE sur des
   sources locales pourtant vérifiables page par page.
4. **B avant A** pour tout ce qui touche à l'encodage.
