# Passe A — vignettes « insuline sans capteur » (nœud `insuline`)

> **Statut : PROPOSITION, non gelée.** Écrit le 2026-07-29 par Claude Code à la demande du référent
> (« je gère rarement le pilotage de l'insuline sans capteur et je ne sais pas bien faire, peux-tu
> proposer des vignettes toi-même »).
>
> ⚠ **Renversement assumé de la règle P2** de [`CONSTRUIRE-UN-MODULE.md`](../../CONSTRUIRE-UN-MODULE.md)
> (« la sortie attendue vient du référent, jamais de l'agent »). Ici, **les situations** sont proposées par
> l'agent ; **les sorties attendues ne sont PAS validées**. Chacune porte donc une étiquette explicite :
>
> | Étiquette | Ce que ça veut dire |
> |---|---|
> | `ACQUIS` | découle d'un arbitrage référent déjà rendu et daté — rien à trancher |
> | `PROPOSITION` | avis de l'agent, **à valider ou corriger par le référent** — c'est le travail attendu de toi |
> | `COLLECTE` | ne peut pas être tranché sans preuve : alimente un prompt OE / une question d'agent A |
>
> **Ce document n'est gelé qu'une fois les `PROPOSITION` tranchées.** Tant qu'il ne l'est pas, il ne vaut
> pas contrat et rien ne s'encode (invariant 6 : signaler plutôt qu'inventer).
>
> **« Ce que l'outil dit aujourd'hui » n'est pas une projection** : c'est la sortie réelle de
> `evaluateNode` sur [`insuline.yaml`](../../../../content/noeuds/diabete-type-2/insuline.yaml) au
> commit courant. **Les 12 vignettes ont été rejouées une à une avec leurs chiffres exacts** (sondes
> jetables du 2026-07-29, supprimées après lecture) : poids, doses et glycémies ci-dessous sont ceux qui
> produisent la sortie décrite, pas des ordres de grandeur. Si tu changes un chiffre en relisant, la
> sortie peut changer — notamment autour de **0,5 U/kg** (`over_basalisation`) et de **0,70 / 1,20 g/L**
> (`gaj_a_cible`).

---

## 0 bis. État au 2026-07-29 après les arbitrages du référent

Le référent a rendu **quatre décisions** sur ce document ; elles sont encodées dans `insuline.yaml`
**v0.27** (changelog D5 de ce jour), sauf la quatrième qui attend le champ qu'elle décrit.

| Décision | Vignette | Encodé ? |
|---|---|---|
| `TBR_severe` **retiré du nœud** | — | ✅ 9 emplacements + contrainte D31 + libellé |
| `TBR` **reste masqué** sans capteur | — | ✅ rien à faire, T-033 confirmé |
| **GAJ au-dessus ET en dessous** | V-A1, V-A3 | ✅ `gaj_basse` / `gaj_haute`, pivot de titration + exclusion de sécurité |
| Le nœud doit porter le **« sous la cible »** | V-A5, V-A6 | ✅ `ecart_sous_objectif_cible`, ouvre l'allègement hors `basal_bolus` |
| Les **créneaux** conditionnés à l'insuline rapide | V-A9 | ⏸ décision consignée — le champ n'existe pas encore, il dépend de la collecte |
| Le **garde-fou de sur-titration** | — | ⏸ **reporté par le référent**, attend les créneaux et la collecte |

**Restent des `PROPOSITION` non tranchées** (donc non encodées, délibérément) : V-A2 (faire de l'antécédent
d'hypoglycémie sévère une `exclusions` de « Titrer la basale » — aujourd'hui les deux cartes coexistent) ;
V-A5 second volet (les alertes de cibles restent gardées par `mcg_disponible`, donc muettes chez le patient
fragile sans capteur — dette I14) ; V-A7 et V-A8 (geste « instaurer / densifier l'autosurveillance ») ;
V-A10 (table d'ajustement du basal-bolus en capillaire).

---

## 0. Arbitrages référent déjà rendus dans cette passe (2026-07-29)

| # | Décision | Portée mécanique |
|---|---|---|
| **A-1** | **`TBR_severe` est RETIRÉ du nœud** (pas seulement masqué) — motif : la répartition TBR / TBR sévère ne se lit pas sur le lecteur ni sur le récepteur en consultation ; elle suppose un téléchargement sur ordinateur, geste rarement fait. Le champ est donc inatteignable **même chez un patient équipé**, au moment où la décision se prend. | 11 emplacements vivants dans `insuline.yaml` : 1 déclaration (l. 137), **1 `contraintes` — D31 `TBR_severe <= TBR` disparaît avec lui** (l. 320), 4 termes de `conditions` (l. 481, 658, 719, 837), 4 `exclusions` (l. 550, 582, 695, 751), 1 alerte d'orientation spécialiste (l. 879). Plus les 180 profils gelés (`fixtures/profils.insuline.json`) et les 2 snapshots de caractérisation → **golden master à re-geler**. |
| **A-2** | **`TBR` reste masqué sans capteur** — on ne le ré-affiche pas, malgré la phrase de [`BILAN-P4` §3bis](../BILAN-P4-2026-07-28.md) (« TBR existe — calculable depuis les relevés »). | Aucun changement : T-033 est confirmé tel quel. **Lève la contradiction interne du §3bis** (son paragraphe disait 3 champs, son tableau disait 4 ; T-033 avait suivi le tableau). |
| **A-3** | **Le garde-fou de sur-titration attend la suite** — on ne le remet pas en place maintenant. | Le nœud reste donc, en connaissance de cause, sans aucune `exclusions` active sur « Titrer la basale » chez un patient sans capteur. |

> ⚠ **Une réserve sur A-3, et elle porte sur autre chose que le garde-fou.** Deux défauts distincts ont été
> confondus dans ma restitution d'hier, et seul le premier est légitimement reportable :
>
> - **le garde-fou de sur-titration** (l'équivalent capillaire de `TBR > 4` / `CV > 36`) — il demande de
>   savoir *quoi* mesurer sans capteur, donc il dépend des créneaux et de la collecte. **Reporter est juste.**
> - **`gaj_a_cible` confond « au-dessus » et « en dessous »** (V-A1 ci-dessous) — c'est un défaut de
>   modélisation, pas un manque de preuve. **Le seuil bas existe déjà dans le nœud** (0,70 g/L, borne
>   inférieure de `gaj_a_cible`, sourcée Treat-to-Target/Riddle 2003) et **le geste existe déjà**
>   (« Corriger l'hypoglycémie… », −2 à −4 U ou −10-20 %, sourcé). Il n'y a rien à chercher : il y a un
>   fil à brancher. Aujourd'hui, une glycémie à jeun à 0,55 g/L produit **« Titrer la basale, +2 U »** comme
>   seule carte de l'écran.
>
> **Question au référent** : est-ce que A-3 couvre aussi ce second point, ou peut-on le corriger sans
> attendre la collecte ? Mon avis : à corriger sans attendre — c'est le seul défaut de cette passe qui
> puisse produire une majoration de dose chez un patient en hypoglycémie.

---

## 1. Les vignettes

Toutes en **médecine générale française**, patient DT2 adulte, **sans capteur de glucose**
(`mcg_disponible = non`), sauf mention contraire. La glycémie à jeun est notée GAJ, en g/L.

---

### V-A1 — Sur-basalisation masquée : la nuit est basse, l'HbA1c est haute ⚠ *la plus grave*

**Situation.** Homme 64 ans, DT2 depuis 14 ans. Basale seule **30 U** le soir + metformine, **82 kg**.
Pas de capteur. HbA1c **8,4 %** pour une cible de 7 %. Il fait sa glycémie le matin : elle tourne **autour
de 0,58 g/L**, il se réveille parfois « mal », transpirant.

**Ce que l'outil dit aujourd'hui.** Une seule carte : **« Titrer la basale (augmenter la dose) — Basale
après +2 U ≈ 32 U/j »**. Aucune exclusion, aucune option en attente, aucune alerte de prudence.

⚠ **Et rien ne peut le rattraper** : à 0,37 U/kg, ce patient n'est même pas « sur-basalisé » au sens du
repère 0,5 U/kg — la carte « Ne pas sur-titrer » ne se déclenche donc pas non plus. Le seul signal
disponible sans capteur est sa glycémie du matin, et le nœud la lit à l'envers.

**Ce qu'il devrait dire.**
- `PROPOSITION` — **aucune titration à la hausse.** Le tableau est celui d'une sur-basalisation : la basale
  est trop forte la nuit (hypoglycémies nocturnes/matinales) et l'HbA1c élevée vient du **jour**. La
  conduite est de **réduire la basale** (−10 à −20 %, soit ~−4 à −8 U ici) et de traiter l'écart diurne
  autrement (GLP-1 / association fixe, puis bolus) — c'est déjà exactement ce que porte la carte
  « Ne pas sur-titrer la basale — intensifier autrement ».
- `ACQUIS` — le geste correctif existe déjà et est sourcé : « Corriger l'hypoglycémie ou la variabilité
  (réduire la dose…) », −2 à −4 U ou −10-20 %.

**Ce que ça exige du contenu.** Scinder `gaj_a_cible` (booléen d'appartenance à un intervalle) en **trois
états** : `gaj_basse` (< 0,70) · `gaj_a_cible` (0,70-1,20) · `gaj_haute` (> 1,20). Aujourd'hui « basse » et
« haute » produisent tous deux `gaj_a_cible == false`, et la titration lit ce `false`.

**Ce qui reste à la collecte.** `COLLECTE` — faut-il **une** GAJ basse ou **plusieurs** pour agir, et de
combien réduire ? Le seuil (0,70) ne demande rien ; la règle de descente, si.

---

### V-A2 — L'outil prescrit une chose et son contraire

**Situation.** Femme 71 ans, basale seule 30 U, pas de capteur. HbA1c **8,5 %** (cible 7,5 %). GAJ
habituelle **1,90 g/L**. Elle a fait **deux malaises hypoglycémiques sévères** dans l'année (l'un avec
resucrage par un tiers) — cases « hypoglycémie sévère récurrente » cochée.

**Ce que l'outil dit aujourd'hui.** Deux cartes, dans deux familles :
« **Corriger l'hypoglycémie ou la variabilité — réduire la basale de −2 à −4 U** » (Sécurité) **et**
« **Titrer la basale (augmenter la dose) — +2 U** » (Intensifier). Sur le même écran.

**Ce qu'il devrait dire.**
- `PROPOSITION` — le geste de sécurité **retire** la titration, il ne se met pas à côté d'elle. Un
  antécédent d'hypoglycémie sévère récurrente doit être une **`exclusions` de « Titrer la basale »**, pas
  seulement le déclencheur d'une carte concurrente. C'est le canal R8 : un fait qui rend un geste
  contre-indiqué va dans `exclusions`, pas dans une carte voisine.
- `ACQUIS` — sécurité et efficacité restent **cumulables** au sens d'E-06 : « réduire la basale » +
  « ajouter un GLP-1 / un bolus » est le bon couple. Ce qui n'est pas cumulable, c'est « réduire la
  basale » + « augmenter la basale ».

**Note.** Avant T-033, ce couple ne pouvait pas apparaître (`TBR` indéterminé faisait partir « Titrer » en
attente). C'est le masquage qui l'a ouvert — c'est le prix de A-3, et il est chiffrable : ce profil est
banal.

---

### V-A3 — Le cas banal, celui pour lequel la passe existe

**Situation.** Homme 58 ans, DT2 12 ans, basale seule **26 U** + metformine. Pas de capteur, pas
d'antécédent d'hypoglycémie. HbA1c **8,2 %** (cible 7 %). GAJ du matin **1,80 à 2,10 g/L**. Poids 92 kg.

**Ce que l'outil dit aujourd'hui.** « **Titrer la basale — +2 U ≈ 28 U/j** », seule carte, plus l'alerte
« Sans MCG : titrer la basale sur la glycémie à jeun (cible ~0,70-1,20 g/L) ; profils capillaires 6-7
points ».

**Ce qu'il devrait dire.**
- `ACQUIS` — **c'est la bonne réponse.** Seuil (0,70-1,20 g/L), pas (+2 U si au-dessus 3 matins de suite,
  ou +10-20 % si dose > 40 U), rythme (tous les 3 jours) : tout est déjà encodé et sourcé
  (Treat-to-Target, Riddle 2003, PMID 14578243). **Cette vignette épingle un comportement correct** —
  règle 4 de P2 — pour interdire de le « réparer » en corrigeant V-A1 et V-A2.
- `PROPOSITION` — il manque une chose : **jusqu'où titrer**. La carte ne dit rien du moment où l'on cesse
  de monter. Aujourd'hui c'est « Ne pas sur-titrer » qui le dit, et elle ne se déclenche que sur
  `over_basalisation` (0,5 U/kg) ou GAJ à la cible.

---

### V-A4 — La nuit est bonne, la journée ne l'est pas : le champ qui manque

**Situation.** Femme 62 ans, **78 kg**, basale seule 34 U + metformine, pas de capteur. HbA1c **8,3 %**
(cible 7 %). GAJ **1,00 g/L**, régulièrement — la nuit est manifestement bonne. Elle ne fait pas d'autre
glycémie.

**Ce que l'outil dit aujourd'hui.** Trois cartes, correctes dans leur principe : « Ajouter un GLP-1 / une
association fixe d'abord », « Ne pas sur-titrer la basale — intensifier autrement », « Ajouter un bolus au
repas principal ».

**Ce qu'il devrait dire.**
- `ACQUIS` — le raisonnement par élimination (jeûne à la cible + HbA1c haute ⇒ l'écart est diurne) est
  déjà tranché (arbitrage 2026-07-27) et il fonctionne **sans capteur**. C'est le point fort actuel du nœud.
- `PROPOSITION` — mais **« Ajouter un bolus » est proposé sans qu'aucune glycémie post-prandiale n'ait été
  demandée**, et sa dose de départ (≈ 10 % de la basale) puis son ajustement s'appuient sur un chiffre
  (« < 1,80 g/L à 2 h ») **affiché sans source**. Il faut un champ post-prandial saisissable, et il faut
  qu'il commande le **repas** ciblé.
- `COLLECTE` — **c'est LA question de preuve de cette passe.** Le seul chiffre présent dans le dépôt
  (`1,80 g/L à 2 h`) n'a aucune référence primaire ; sa seule trace est une ligne « Méd. Geek /
  DragiWebdo » dans [`E-insuline.md`](../../noeuds/E-insuline.md), soit un relais francophone des
  Standards ADA 2020. → **OE-A1**.

---

### V-A5 — Le sujet âgé sur-traité : le trou le plus silencieux ⚠

**Situation.** Homme **84 ans**, fragile, vit seul, DT2 ancien. **70 kg**, basale seule **24 U**. Pas de
capteur. **HbA1c 6,3 %** pour une cible fixée à **8 %**. GAJ 0,90 g/L. Aucune hypoglycémie sévère déclarée
(il n'en parle pas ; il « a des coups de fatigue l'après-midi »).

**Ce que l'outil dit aujourd'hui.** Une seule carte : « **Poursuivre le schéma d'insuline en cours et
réévaluer** ». Aucune alerte de cible assouplie.

**Pourquoi.** Trois mécanismes se conjuguent, et aucun n'est visible :
1. `cible_atteinte` = « HbA1c ≤ cible » — donc 6,3 % pour une cible de 8 % se lit « objectif atteint ». Le
   nœud n'a **aucun concept de « nettement sous la cible »** (contrairement à `prescription`, qui porte
   `hba1c_sous_cible` et `sous_objectif`) ;
2. « **Désintensifier / alléger le schéma** » n'existe **qu'en situation `basal_bolus`**. Sous basale
   seule, le nœud n'a aucune option de désintensification ;
3. les deux alertes de cibles (standard / assouplies) sont gardées par `mcg_disponible == true` : sans
   capteur, **le patient fragile ne reçoit aucune indication de cible**. C'est la dette **I14** versée à
   cette passe par [`ARBITRAGES §1`](../chantier-2026-07-27/ARBITRAGES-2026-07-27-nuit.md).

**Ce qu'il devrait dire.**
- `PROPOSITION` — « **Alléger le schéma** » : réduire la basale, relâcher la cible, réévaluer. C'est le
  risque autour duquel tout le nœud A est construit ; ici il passe entièrement au travers.
- `PROPOSITION` — l'alerte de cibles assouplies doit être **dégagée du garde `mcg_disponible`** : un
  patient fragile a droit à une cible assouplie qu'il porte un capteur ou non. Version capillaire de
  l'énoncé à écrire.
- `COLLECTE` — non. C'est de la modélisation et un arbitrage de portée, pas un manque de preuve
  (HAS 2024 R.103 et SFD 2025 Avis 21 sont déjà cités par le nœud).

---

### V-A6 — Le sujet âgé au-dessus de sa cible : titre-t-on pareil ?

**Situation.** Même patient qu'en V-A5, mais **HbA1c 9,1 %** pour une cible de 8 %. GAJ **1,95 g/L**.

**Ce que l'outil dit aujourd'hui.** « **Titrer la basale — +2 U** », seule carte, **exactement la même que
chez l'homme de 58 ans de V-A3** : même pas, même rythme, même absence de réserve. Le critère
`risque_hypoglycemique_eleve` (qui vaut `true` ici, par l'âge ≥ 75) **ne gate rien en situation basale
seule** — il ne sert qu'au choix de molécule chez le naïf et à la désintensification en basal-bolus.

**Ce qu'il devrait dire.**
- `PROPOSITION` — même geste, **mais pas la même prudence** : pas de titration plus lent (+2 U tous les
  7 jours plutôt que tous les 3 ?), cible de GAJ relevée, et mention explicite de l'analogue de 2ᵉ
  génération. À défaut, au moins une **alerte** portée par l'option.
- `COLLECTE` — `COLLECTE` léger : existe-t-il des données sur un schéma de titration ralenti chez le
  sujet âgé, ou est-ce un accord d'experts ? → **OE-A2**, question 3.
- **Diagnostic R5** : c'est le cas d'école de la nuance de R5 relevée sur `statine` — un critère collecté
  (`age`, `fragilite`) qui donne l'illusion d'individualiser et ne change pas une ligne de la carte.

---

### V-A7 — Le patient qui ne fait aucune glycémie *(comportement correct, à épingler)*

**Situation.** Homme 55 ans, basale seule 20 U, pas de capteur, **ne fait aucune autosurveillance** (il a
un lecteur dans un tiroir). HbA1c 8,7 %.

**Ce que l'outil dit aujourd'hui.** **Aucune carte applicable**, et **quatre options en attente**, toutes
avec le même motif nommé : `GAJ`. L'écran dit donc ce qui manque pour trancher.

**Ce qu'il devrait dire.**
- `ACQUIS` — **c'est correct, et il ne faut pas le « réparer »** : R7 (le moteur ne se prononce jamais sur
  ce qu'il ignore) et R10 (tout patient repart avec quelque chose — ici, une attente nommée). Vignette
  d'épinglage.
- `PROPOSITION` — une chose manque quand même : **rien ne propose d'instaurer l'autosurveillance**. Le
  seul geste utile pour ce patient (« faites 3 glycémies à jeun cette semaine et on décide ») n'est pas
  dans le nœud. Faut-il une carte, une alerte, ou est-ce hors périmètre ?

---

### V-A8 — Une seule glycémie par jour, le matin : jusqu'où peut-on aller ?

**Situation.** Femme 67 ans, basale seule 38 U, pas de capteur. Elle fait **une** glycémie, le matin à
jeun, tous les jours : **1,30 à 1,50 g/L**. HbA1c **8,8 %** (cible 7,5 %). Poids 71 kg (0,53 U/kg → juste
au-dessus du repère de sur-basalisation).

**Ce que l'outil dit aujourd'hui.** Quatre cartes : « Ajouter un GLP-1 », « Ne pas sur-titrer »,
« Ajouter un bolus », **et** « Titrer la basale ». La GAJ étant hors cible **et** le patient sur-basalisé,
les deux lectures coexistent — comportement voulu depuis l'arbitrage du 2026-07-27.

**Ce qu'il devrait dire.**
- `ACQUIS` — la coexistence est voulue : le seuil de 0,5 U/kg n'est ni consensuel ni abandonné
  ([`preuve-sur-basalisation.md`](../chantier-2026-07-27/preuve-sur-basalisation.md)), c'est au praticien
  d'arbitrer, et le rang hiérarchise.
- `PROPOSITION` — mais 4 cartes pour une patiente qui n'a qu'une mesure, c'est le plafond K5 (5 pistes)
  frôlé sans qu'aucune ne dise **de quoi on aurait besoin pour choisir**. La conduite réaliste est :
  « avant de décider, faites un profil à 3 points pendant 3 jours ». **C'est le vrai geste de la
  consultation, et le nœud ne l'a pas.**
- `COLLECTE` — quelle densité minimale d'autosurveillance permet de piloter une basale, et une rapide ?
  → **OE-A3** et **OE-A5**.

---

### V-A9 — Répartition horaire : le cas qui commande le design des 4 créneaux

**Situation A.** Femme 59 ans, **75 kg**, **basale seule** 40 U le soir + metformine + **gliclazide
toujours en cours**. Pas de capteur. GAJ 1,10 g/L. Malaises hypoglycémiques **en fin de matinée et en
début d'après-midi**, jamais la nuit. HbA1c 7,8 % (cible 7 %).

**Situation B.** Même patiente, mais sous **basale 40 U + bolus du midi 6 U**, hypoglycémie
interprandiale cochée.

**Ce que l'outil dit aujourd'hui.** Aucun champ ne permet de saisir « hypoglycémies de fin de matinée » :
`hypo_interprandiale` existe mais n'est visible qu'en `basale_plus_bolus`/`basal_bolus` — donc pas dans la
situation A, où la patiente n'a **rien** à cocher.

- **Situation A** → « Ajouter un GLP-1 », « Ne pas sur-titrer », « Ajouter un bolus » (elle est
  sur-basalisée, 0,53 U/kg), plus l'alerte « arrêter le sulfamide / le glinide ». **Aucune des trois
  cartes ne parle des hypoglycémies** — le nœud raisonne comme s'il ne s'en produisait pas.
- **Situation B** → « Ajouter un GLP-1 » et « Optimiser la répartition du basal-bolus », même alerte
  sulfamide. Le signal d'hypoglycémie est cette fois reçu, mais uniquement parce qu'un bolus existe.

**Ce qu'il devrait dire — et c'est ici que se joue l'encodage des créneaux.**
- `PROPOSITION` — **le créneau seul ne suffit pas : c'est le couple (créneau × schéma) qui accuse.**
  C'est le point de design que je te soumets, parce qu'il change la forme du champ :

  | Créneau | Sous **basale seule** | Sous **basale + bolus** |
  |---|---|---|
  | Nuit 0-6 h | la basale | la basale |
  | Matinée 6-12 h | la basale (ou un **sulfamide/glinide résiduel**) | le bolus du petit-déjeuner |
  | Après-midi 12-18 h | la basale (ou un sulfamide résiduel) | le bolus du midi |
  | Soir 18-24 h | la basale (ou un sulfamide résiduel) | le bolus du soir |

  Autrement dit : **sous basale seule, tous les créneaux accusent la même chose** — la basale, ou un
  sulfamide que le nœud dit déjà d'arrêter. Le découpage en 4 n'y sert qu'à *documenter*, pas à *décider*.
  **C'est sous basal-bolus qu'il localise l'injection coupable**, et là il est décisif. Si tu valides
  cette lecture, le champ doit être `visible_si` un bolus existe — sauf pour le créneau **nuit**, qui
  reste utile partout.
- `PROPOSITION` — l'alerte « arrêter le sulfamide / le glinide » existe déjà mais se déclenche sur la
  seule présence du produit. Ici elle devrait être **la première réponse**.
- `COLLECTE` — la répartition horaire capillaire a-t-elle été étudiée comme guide d'ajustement, ou
  n'est-ce qu'un raisonnement physiopathologique ? → **OE-A4**.

---

### V-A10 — Basal-bolus sans capteur : une carte qui parle d'une donnée absente

**Situation.** Homme 61 ans, **85 kg**, **basal-bolus** (basale 32 U + 22 U de rapide répartis sur 3
repas, total 54 U/j), pas de capteur. HbA1c **8,6 %** (cible 7 %). Il fait 2 glycémies/jour,
irrégulièrement ; celle du matin est à **1,60 g/L**.

**Ce que l'outil dit aujourd'hui.** Une seule carte : « **Optimiser la répartition du basal-bolus (guidé
par l'AGP et les doses actuelles)** », dont tout le contenu utile est une table de lecture d'AGP (« hypo
nocturne → réduire la basale ; phénomène de l'aube → augmenter la basale ; excursions post-prandiales →
augmenter le bolus »). Le patient n'a pas d'AGP.

**Ce qu'il devrait dire.**
- `PROPOSITION` — la même table, **exprimée en glycémies capillaires** : à jeun → basale ; avant le repas
  suivant / 2 h après → bolus du repas précédent. C'est le même raisonnement, sur une autre mesure. Le
  titre « guidé par l'AGP » doit devenir conditionnel au capteur.
- **C'est exactement le défaut corrigé au formulaire par T-033, déplacé dans le texte de la carte** : on
  ne réclame plus une donnée absente dans un champ, on la réclame dans une phrase.

---

### V-A11 — Tout va bien *(comportement correct, à épingler)*

**Situation.** Femme 66 ans, basale seule 22 U, pas de capteur. HbA1c **6,9 %** (cible 7 %). GAJ 1,00 g/L.
Pas d'hypoglycémie.

**Ce que l'outil dit aujourd'hui.** « **Poursuivre le schéma d'insuline en cours et réévaluer** ».

**Ce qu'il devrait dire.** `ACQUIS` — c'est juste. Vignette d'épinglage : la correction de V-A5 (le trou
du sur-traitement) ne doit pas transformer ce patient-ci en candidat à l'allègement. La frontière entre
les deux est **l'écart à la cible**, pas la valeur absolue d'HbA1c.

---

### V-A12 — Initiation sans capteur *(comportement correct, à épingler)*

**Situation.** Homme 57 ans, **naïf d'insuline**, metformine + iSGLT2, HbA1c **9,5 %** (cible 7 %),
polyurie et perte de 3 kg. Pas de capteur — et il ne peut pas en avoir, il n'est pas encore sous insuline.

**Ce que l'outil dit aujourd'hui.** « Envisager un GLP-1 (ou une association fixe) avant ou avec
l'insuline » puis « Initier une insuline basale », avec la dose calculée, plus l'alerte acidocétose
euglycémique liée à l'iSGLT2. **Aucune alerte « sans MCG »** — et c'est voulu.

**Ce qu'il devrait dire.** `ACQUIS` — correct, y compris l'absence d'alerte capteur (le garde
`!= naif` est bon, cf. [`BILAN-P4` §3bis](../BILAN-P4-2026-07-28.md)). **Épinglage** : la passe A ne doit
rien changer à la situation « naïf ».

---

## 2. Ce que les vignettes exigent, regroupé

| # | Exigence | Nature | Vignettes |
|---|---|---|---|
| E1 | `gaj_a_cible` scindé en **basse / à la cible / haute** ; l'état bas **bloque** la titration et **déclenche** la correction | Modélisation — **aucune preuve nouvelle requise** | V-A1 |
| E2 | `hypo_severe_recurrente` devient une **`exclusions`** de « Titrer la basale », pas seulement une carte voisine | Modélisation (canal R8) | V-A2 |
| E3 | **Champ de glycémie post-prandiale** saisissable + seuil d'introduction et d'ajustement du bolus | **Collecte** | V-A4, V-A8 |
| E4 | Option **« Alléger le schéma »** étendue à `basale_seule` + concept de « nettement sous la cible » | Modélisation + arbitrage de portée | V-A5 |
| E5 | Alertes de **cibles** dégagées du garde `mcg_disponible` (version capillaire à écrire) | Modélisation — dette **I14** | V-A5 |
| E6 | Titration **modulée par le terrain** (âge, fragilité) en situation basale seule | Modélisation + collecte légère | V-A6 |
| E7 | **Créneaux horaires** : champ conditionné au schéma, sauf le créneau nuit | Modélisation — **design à valider** | V-A9 |
| E8 | Table d'ajustement du basal-bolus **en capillaire** | Rédaction de contenu | V-A10 |
| E9 | Geste « instaurer / densifier l'autosurveillance » | Arbitrage de périmètre | V-A7, V-A8 |
| E10 | Garde-fou de sur-titration sans capteur | **Reporté (A-3)** | — |

**Six exigences sur dix ne demandent aucune preuve nouvelle.** C'est le principal enseignement de
l'exercice : la passe A a été cadrée comme une passe de recherche, elle est en réalité **aux trois quarts
une passe de modélisation**. Seule E3 est bloquante au sens EBM.

---

## 3. Ce qu'il te reste à faire sur ce document

1. Corriger / valider les **13 `PROPOSITION`** ci-dessus — c'est le seul travail qui ne peut pas être
   délégué.
2. Trancher la **question ouverte du §0** (le défaut `gaj_a_cible` est-il couvert par le report A-3 ?).
3. Trancher **E7** (le design des créneaux) : ma lecture « le créneau n'est décisif que sous bolus » est
   la seule proposition de ce document qui change la **forme** d'un champ. Si elle est fausse, tout le
   reste du design des créneaux change.
4. Une fois ces trois points rendus, le document se gèle et devient le contrat de la passe.
