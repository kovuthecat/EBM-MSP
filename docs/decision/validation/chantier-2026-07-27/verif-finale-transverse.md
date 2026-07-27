# Vérification finale — passe TRANSVERSE (cohérence croisée, vignettes, dispositif, incertitudes)

Agent adversarial transverse · 2026-07-27 · lecture seule sur `content/**`, `src/**` et les rapports
existants. Périmètre : ce qui se passe **entre** les nœuds, et la qualité du dispositif de vérification
lui-même. Les trois autres agents auditent chacun un nœud ; rien de ce qui suit n'est un jugement sur
un nœud pris isolément.

Base : `main` à `2009f18`. Suite exécutée pendant l'audit : **553 tests passés, 6 ignorés, 0 échec**.

---

## Verdict

Le banc est honnête et bien construit — il documente ses propres angles morts mieux que la plupart des
dispositifs que j'ai à auditer — mais la couche croisée reste sans garde-fou, et elle laisse passer
**une attribution de source que le dépôt a lui-même établie comme fausse et qui reste affichée au
prescripteur dans `insuline`**, plus deux `incertitudes` qui déclarent ouvert un travail déjà fait ;
j'ajoute la cause racine, jusqu'ici non identifiée, du trou de couverture CK 10-50 N — ce n'est pas un
hasard de tirage, c'est le générateur de profils qui ne lit pas les alertes d'option.

---

## Mission 1 — Cohérence croisée entre nœuds

### 1.1 Tableau exhaustif des critères partagés (livrable)

14 critères sont déclarés par au moins deux des six nœuds. Comparaison sur `type`, `valeurs`, `min`,
`max`, `derive`, `visible_si`, `confirmation_requise` (le `groupe`, pure présentation, est exclu).

| critère | nœuds | définition par nœud | verdict |
|---|---|---|---|
| `age` | cible-glycemique, insuline, prescription, statine | `nombre` 18-105 dans les 4 | **identique** |
| `fragilite` | cible-glycemique, insuline, prescription, rhd-activite-physique, rhd-alimentation | `bool` dans les 5 | **identique** |
| `esperance_vie` | cible-glycemique, insuline, prescription | `enum [longue, intermediaire, limitee]` dans les 3 | **identique** |
| `anciennete_diabete_annees` | cible-glycemique, statine | `nombre` 0-60 dans les 2 | **identique** |
| `HbA1c_actuelle` | insuline, prescription | `nombre` 4-18 dans les 2 | **identique** |
| `DFG` | insuline, prescription | `nombre` 3-150 dans les 2 | **identique** |
| `risque_hypoglycemie_schema` | insuline, prescription | `enum [faible, eleve]` dans les 2 | **identique** |
| `symptomes_glucotoxicite` | insuline, prescription | `bool` dans les 2 | **identique** |
| `ASCVD_etablie` | prescription, statine | `bool` dans les 2 | **identique** (mais cf. M1-4 : le même concept s'appelle `antecedent_cv` sur `cible-glycemique`) |
| `terrain_cible_assouplie` | insuline, prescription | ins. : `fragilite OR esperance_vie == limitee OR age >= 75` · pres. : `age >= 75 OR fragilite == true OR esperance_vie == limitee` | **équivalent** (OR commutatif ; `fragilite` nu ≡ `fragilite == true` pour `deriveCritere.ts`) — cf. M1-6 |
| `cible_atteinte` | insuline, prescription | ins. : `derive "HbA1c_actuelle <= HbA1c_cible"` · pres. : `derive "position_vs_cible == a_l_objectif OR position_vs_cible == sous_objectif"` | **ÉCART** — cf. M1-2 |
| `preference_injection` | insuline, prescription | ins. : `enum [accepte, refuse, indifferent]` · pres. : `enum [indifferent, accepte, refuse]` | **ÉCART** (ordre ⇒ défaut) — cf. M1-3 |
| `traitements_en_cours` | insuline, prescription, rhd-activite-physique, rhd-alimentation | ins. : `[metformine, iSGLT2, aGLP1, tirzepatide, sulfamide, glinide, gliptine, insuline_basale, insuline_rapide]` · les 3 autres : `[metformine, iSGLT2, aGLP1, tirzepatide, sulfamide, gliptine, insuline, glinide]` (+ `visible_si: intention != initier` sur `prescription` seul) | **ÉCART** — cf. M1-5 |
| `intolerance_statine` / `intolerance_traitement` | statine / prescription | noms et périmètres différents (classe vs traitement quelconque) | pas un écart : deux concepts |

Les 74 critères restants sont propres à un seul nœud (liste vérifiée, non reproduite ici).

Sur les 4 écarts, deux ont une conséquence de comportement (`cible_atteinte`, `preference_injection`),
un a une conséquence de saisie (`traitements_en_cours`), un est purement rédactionnel.

`visible_si` : le seul cas où un critère partagé en porte un est `traitements_en_cours` sur
`prescription` (`intention != initier`) — `intention` n'existe nulle part ailleurs, l'asymétrie est
donc forcée, pas incohérente. `confirmation_requise` : aucun critère partagé n'en porte — c'est
précisément le problème M1-7.

---

### 1.2 Findings

#### HAUTE — M1-1 · Une attribution de source établie FAUSSE, corrigée sur un nœud, toujours affichée sur l'autre

`content/noeuds/diabete-type-2/insuline.yaml:746` (alerte de nœud, `quand: DFG < 45`, message rendu à
l'écran) :

> « … sulfamide (s'il est encore utilisé) : gliclazide/glimépiride à dose réduite et surveillance
> rapprochée si DFG 30-44, **contre-indiqué si DFG < 30 (convention KDIGO/SFD** — cf. nœud
> prescription, place résiduelle SU/gliptine) … »

Or `prescription` a établi le 2026-07-27, sur source primaire puis re-vérification adversariale
(`incertitudes` #12, `prescription.yaml:420-424`, `:1458-1464`, `prescription.argumentaire.md:193-199`) :

> « la KDIGO 2022 ne porte AUCUN chiffre sur les sulfamides … **L'attribution KDIGO était fausse et a
> été retirée du nœud.** »

La correction n'a été appliquée qu'à `prescription`. `insuline` continue d'afficher au prescripteur
une conduite juste sous une **caution bibliographique inexistante** — et l'alerte le renvoie
explicitement au nœud qui, lui, a corrigé. C'est la classe d'erreur que `statine.yaml:169` et `:885`
citent nommément comme précédent (« même classe d'erreur que le « convention KDIGO » corrigé le matin
sur `prescription` »), reproduite au même moment dans un troisième endroit sans que personne ne le voie.

Le fait clinique reste vrai (le seuil de 30 est bien porté par la SFD 2025, Tableau I note 2 et
Avis n° 12) : **seul le crédit de source est faux**. Correctif : remplacer « convention KDIGO/SFD » par
« SFD 2025 » dans `insuline.yaml:746`, et annoter le changelog `insuline.yaml:1321` qui reproduit la
même formule.

Trace résiduelle secondaire, dans le nœud pourtant corrigé : `prescription.yaml:875` porte encore, en
commentaire, « Le seuil chiffré « DFG < 30 » **reste une convention KDIGO/SFD** » — contredit par
quatre autres passages du même fichier. C'est le genre de trace qui réintroduit l'erreur au prochain lot.

Aucun invariant ne peut voir cela : I7 est strictement local au nœud (son exception
`insuline :: DFG < 45` est d'ailleurs toujours nécessaire — vérifié), et rien ne compare les
attributions de source entre nœuds.

---

#### MOYENNE — M1-2 · `cible_atteinte` : un nom, deux mécanismes, et une violation de R1

- `insuline.yaml:66-68` : `derive: "HbA1c_actuelle <= HbA1c_cible"` — l'état est **déduit** de deux nombres.
- `prescription.yaml:203-208` : `derive: "position_vs_cible == a_l_objectif OR position_vs_cible == sous_objectif"` — l'état est **déclaré** par le praticien.

`prescription` documente longuement pourquoi il a abandonné la déduction (R1, `GRAMMAIRE-NOEUD.md` :
« l'ÉTAT du contrôle est DÉCLARÉ par le praticien, jamais déduit ») ; `insuline` porte encore la forme
que R1 récuse, sous le même nom. Deux conséquences distinctes :

1. **Sémantique** : sur `insuline`, `cible_atteinte` est vrai dès que `HbA1c_actuelle <= HbA1c_cible`,
   y compris très en dessous (sur-traitement) ; sur `prescription`, `sous_objectif` est distingué et
   ouvre la déprescription. Le même patient sur-traité est « à la cible » d'un côté et « sur-traité »
   de l'autre.
2. **Valeurs par défaut** : sur `insuline`, formulaire vierge ⇒ `HbA1c_actuelle = 0` et
   `HbA1c_cible = 0` ⇒ `cible_atteinte = true`. Le mécanisme D20/`renseignes` neutralise ce cas à
   l'écran, mais la valeur stockée reste « atteinte » par défaut.

Déjà signalé comme D5 dans `docs/decision/validation/carte-coherence.md` (« relève de P3 ») ; jamais
tranché depuis, et le document en question décrit la structure à 7 nœuds A-H, périmée.

---

#### MOYENNE — M1-3 · `preference_injection` : même énumération, ordre différent, **défaut différent**

- `insuline.yaml:119-121` : `valeurs: [accepte, refuse, indifferent]` ⇒ défaut = **`accepte`**
- `prescription.yaml:175-178` : `valeurs: [indifferent, accepte, refuse]` ⇒ défaut = **`indifferent`**

`lib/formLayout.ts:50-55` (`valeurParDefaut`) : `return critere.valeurs?.[0]`. L'ordre de déclaration
**est** la valeur par défaut, et `prescription` le sait — il porte un commentaire explicite
(`:170-174`) : « ORDRE DES VALEURS = SÛRETÉ : `valeurParDefaut` prend la 1re valeur déclarée ». Ce
raisonnement n'a pas été porté à `insuline`, dont le formulaire vierge présume donc que le patient
**accepte** les injections — sur le nœud qui propose précisément des injections.

Impact réel limité : la seule règle qui lit ce critère (`insuline.yaml:619`) teste `== refuse`, donc
`accepte` et `indifferent` sont opérationnellement équivalents aujourd'hui. C'est une bombe à
retardement, pas un défaut actif : toute future règle testant `== accepte` hériterait d'un
consentement présumé.

---

#### MOYENNE — M1-4 · `antecedent_cv` et `ASCVD_etablie` : un concept, deux noms — avec une conséquence mesurable

`cible-glycemique` déclare `antecedent_cv` (libellé `labels.ts:91` : « Antécédent cardiovasculaire » ;
option « ≤ 8 % » : « antécédent cardiovasculaire établi »). `prescription` et `statine` déclarent
`ASCVD_etablie` (libellé : « Maladie cardiovasculaire athéromateuse établie » ; `statine.yaml:18` :
« prévention secondaire ⟺ ASCVD_etablie »). Aucun des deux n'est défini plus précisément ; à la
lecture ils désignent la même chose.

La conséquence n'est pas seulement cosmétique. `lib/esperanceVieDefault.ts:40` déclare
`ESPERANCE_VIE_DRIVERS = ['age', 'fragilite', 'comorbidite_grave', 'antecedent_cv']`, et
`suggestEsperanceVie` lit `antecedent_cv` **et** `comorbidite_grave` — deux critères qui n'existent que
sur `cible-glycemique`. Or `DecisionNodeScreen.tsx:138` applique cette suggestion sur **tout nœud
portant `esperance_vie`**, donc aussi sur `insuline` et `prescription`, où les deux drivers valent
silencieusement `false`.

Effet vérifié : un patient de 70 ans avec comorbidité grave reçoit `esperance_vie = limitee` suggérée
sur `cible-glycemique`, et `longue` sur `prescription` — où `esperance_vie == limitee` alimente
`terrain_cible_assouplie`, donc l'option « Désintensifier ». Deux nœuds, un patient, deux terrains.

Le fichier se défend d'être spécifique (« générique, pas d'id de nœud en dur, D8 ») : c'est vrai des
**ids de nœud**, pas des **noms de critère**, dont il code cinq en dur. Ce n'est pas une violation de
l'invariant CLAUDE.md 5 (`src/features/decision/lib/` n'est ni `shared` ni le moteur), mais c'est le
seul endroit du code où une divergence de vocabulaire du contenu produit un comportement divergent.

---

#### MOYENNE — M1-5 · `traitements_en_cours` : `insuline` scinde l'insuline, les trois autres non

`insuline` : `[…, insuline_basale, insuline_rapide]` · `prescription`, `rhd-activite-physique`,
`rhd-alimentation` : `[…, insuline]`.

La granularité supplémentaire d'`insuline` est cliniquement justifiée (il faut savoir s'il y a déjà un
bolus). Elle est aussi **nécessaire à une alerte de sécurité** : `insuline.yaml` détecte l'incohérence
« naïf + insuline basale cochée » (vignette E-02) — impossible avec la valeur agrégée.

Ce qu'il faut savoir, et qui n'est écrit nulle part : il n'existe **aucune traduction** entre les deux
vocabulaires. Aujourd'hui c'est sans conséquence, `DecisionModuleScreen.tsx:19-24` posant explicitement
qu'aucune valeur ne circule d'un nœud à l'autre. Le jour où un chaînage prescription→insuline est
envisagé (`prescription` incertitude #6 : « hors moteur (P3+) »), ce champ est le point de rupture :
`insuline` ⇄ {`insuline_basale`, `insuline_rapide`} n'est pas une bijection. À noter dans DECISIONS
avant, pas après.

Écart mineur associé : `glinide` et `gliptine` sont permutés entre les deux énumérations — sans effet
(l'ordre d'une `liste` ne détermine aucun défaut, `valeurParDefaut` renvoyant `[]`), mais un diff
inutile pour l'œil.

---

#### MOYENNE — M1-6 · `confirmation_requise` : la règle est écrite, elle n'est appliquée qu'à la moitié des cas

Le dépôt énonce le critère d'application (`rhd-alimentation.yaml:184-186`) : « un « non » qui n'a jamais
été demandé ne peut pas être présumé sans risque (même famille de défaut que `diabete_complique` sur le
nœud statine) ».

État réel : 8 déclarations, toutes sur des drapeaux qui **ouvrent** une option (les 4 signes de sécurité
à l'effort de `rhd-activite-physique`, les 3 signes de repérage de `rhd-alimentation`, `diabete_complique`
sur `statine` — ce dernier étant dans les `conditions` de « Discuter »).

Et voici les critères `bool` saisis dont un `false` non demandé **désarme un garde-fou** (`exclusions`
ou `prerequis`), aucun ne portant le drapeau :

| nœud | critère | nb de garde-fous désarmés |
|---|---|---|
| statine | `dialyse` | 1 (l'exclusion structurelle D21 de la haute intensité) |
| prescription | `cetonemie` | 6 |
| prescription | `symptomes_glucotoxicite` | 6 |
| prescription | `denutrition` | 3 |
| prescription | `fragilite` | 1 (l'exclusion sulfamide SFD 2025, ajoutée le 2026-07-27) |
| rhd-alimentation | `fragilite` | 2 |
| insuline | `hypo_severe_recurrente` | 2 |

Le drapeau est donc posé là où l'omission fait **manquer une proposition**, et absent là où elle fait
**passer un garde-fou**. Je ne tranche pas — c'est une décision référent, et D20 pose délibérément que
`bool = false` est « une réponse clinique réelle ». Mais l'asymétrie est l'inverse de ce que la règle
citée laisse attendre, et `dialyse` mérite au minimum d'être posé : un patient dialysé dont la case n'a
jamais été demandée reçoit aujourd'hui une statine de haute intensité, sans que rien ne signale que la
question n'a pas été posée.

---

#### BASSE — M1-7 · Écarts de forme sans conséquence, listés pour mémoire

- `terrain_cible_assouplie` : ordre des termes différent, `fragilite` (insuline) vs `fragilite == true`
  (prescription). Sémantiquement identique (`deriveCritere.ts:184-188` accepte le terme booléen nu).
  Un futur invariant textuel « un concept, un encodage » lèverait un faux positif ici : à écrire sur
  l'AST, pas sur la chaîne.
- `age >= 75` (insuline `terrain_cible_assouplie`, prescription idem) vs `age > 75` (alerte statine).
  À 75 ans pile, deux nœuds basculent et le troisième non.
- `insuline.yaml:106-110` affirme que `terrain_cible_assouplie` est « **le miroir exact** des
  déclencheurs de relaxation du nœud A ». C'est faux : le nœud A relâche sur
  `fragilite OR comorbidite_grave OR esperance_vie == limitee OR antecedent_cv`, sans aucun terme d'âge ;
  `terrain_cible_assouplie` relâche sur `fragilite OR esperance_vie == limitee OR age >= 75`. Un
  octogénaire robuste sans comorbidité voit ses cibles MCG assouplies sur `insuline` et garde ≤ 7 % sur
  `cible-glycemique`. Divergence peut-être voulue ; l'affirmation d'exactitude, elle, ne l'est pas.

---

## Mission 2 — Les vignettes viennent-elles du référent ?

**Réponse globale : oui, autant que le dépôt peut le prouver.** Aucune vignette n'est tautologique au
sens strict, et j'ai trouvé la trace explicite d'un audit antérieur ayant supprimé les deux vignettes
qui l'étaient (`evaluateNode.test.ts:51-69` — A-01, « drapeau ASSERTION FAIBLE : un moteur qui
renverrait systématiquement la mauvaise cible passait ce test »). C'est bon signe : le dépôt s'est déjà
posé la question, et a agi.

### Le motif « attente changée dans le commit du contenu qu'elle surveille »

Recherché sur les 25 derniers commits. **Trois occurrences**, toutes assumées :

| commit | ce qui a bougé | verdict |
|---|---|---|
| `3bf372e` | suppression de `expect(excluded.get(OPT_HAUTE)).toContain('CK_sup_5N == true …')` en même temps que le critère `CK_sup_5N` (bool) devient `CK_x_normale` (nombre) | légitime : le critère n'existe plus |
| `423b5ef` | `intolerance_statine: true` → `'rapportee'`, et l'assertion de message `'Intolérance aux statines rapportée'` → `'… RAPPORTÉE'` | légitime : bool → enum |
| `fec1be1` | E-04a passe de « `Titrer la basale` EXCLUE » à « les deux coexistent » ; E-05 change d'option cible | **le cas fort** — mais le commit l'annonce en titre (« VIGNETTES. E-04a et E-05 révisées : leur attente venait du référent et il l'a changée ») et documente la décision clinique sur 20 lignes |

Je n'ai donc trouvé aucun ajustement clandestin. **Mais** : rien dans le dépôt ne distingue
mécaniquement « le référent a changé l'attente » de « on a ajusté l'attente au comportement » — la seule
preuve est le texte du message de commit, écrit par la même passe qui a fait le changement. Le point
faible n'est pas une vignette en particulier, c'est qu'il n'existe pas de trace opposable côté référent
(les vignettes ne portent pas de champ « validé par / le »).

### MOYENNE — M2-1 · Deux vignettes verrouillent un message que la règle contredit

`statine.yaml:420-423` — alerte d'option portée par la carte terminale :

```
quand:   "CK_x_normale > 4 AND statine_deja_en_place == false"
message: "Cette carte est atteinte parce que les CK dépassent 5 fois la normale AVANT toute initiation…"
```

La règle se déclenche **au-delà de 4 N**, le message annonce **5 N**. C'est le résidu de l'arbitrage
référent du soir (`statine.yaml:181-184` : « SEUIL À L'INITIATION — 4 N, pas 5 … Le référent a retenu le
seuil le PLUS BAS ») : l'expression, le titre de l'option (« CK au-dessus de 4 fois la normale ») et
l'exclusion ont été repris, le message d'alerte et la prose de `population_cible` (`statine.yaml:94` :
« la contre-indication biologique par des CK > 5 N ») ne l'ont pas été. Un patient à 4,5 N lit sur sa
carte une affirmation fausse **sur sa propre biologie**.

Ce qui en fait un finding de mission 2 plutôt que de simple contenu :

- **F-15** (`evaluateNode.statine.test.ts:334`) et **F-18** (`:367`) assertent sur la sous-chaîne
  `'5 fois la normale'`. Les vignettes **fixent** le libellé erroné : corriger le message en « 4 fois »
  fait rougir deux tests. C'est exactement l'assertion « très précise sur un détail secondaire » que la
  mission demandait de chercher.
- **Aucune vignette n'exerce la bande 4 < CK ≤ 5** : F-19 et F-22 posent 3, tout le reste pose 6, 20 ou
  60. Le seul endroit où le décalage se voit est le golden master — **21 des 180 profils figés** ont
  `CK_x_normale = 5` et `statine_deja_en_place = false`, et affichent donc « dépassent 5 fois la
  normale » à un patient dont les CK valent exactement 5. C'est déjà commité dans
  `__snapshots__/caracterisation.statine.txt`, non relu.

### BASSE — M2-2 · Trois assertions trop lâches pour ce qu'elles prétendent vérifier

- `evaluateNode.insuline.test.ts:231` (E-06) : `expect(t.some((i) => /GLP-1|bolus/i.test(i))).toBe(true)`.
  L'énoncé de la vignette dit « un geste d'efficacité cumulé (traitement non insulinique OU ajout d'un
  bolus) ». Le motif matche aussi « **Optimiser la répartition du basal-bolus** », qui n'est pas un geste
  d'efficacité mais un réglage — la vignette peut passer pour la mauvaise raison. Une assertion sur les
  constantes déjà déclarées dans le fichier (`AJOUTER_GLP1_BB`, `AJOUTER_BOLUS`) dirait la même chose sans
  l'ambiguïté.
- `evaluateNode.insuline.test.ts:171` (E-02) : `/incohéren/i` sur l'ensemble des alertes du nœud — passe
  dès qu'une alerte quelconque contient le mot.
- `evaluateNode.statine.test.ts:180` (F-08) : `.includes('Intolérance aux statines RAPPORTÉE')` — teste
  la casse d'un libellé, pas une conduite.

### BASSE — M2-3 · Des critères DÉRIVÉS posés dans les profils de test, silencieusement recalculés

`evaluateNode.prescription.test.ts` (`BASE:35,55,56` ; `:169` ; `:792` ; `:869`) et
`evaluateNode.insuline.test.ts` (`BASE:81,82,86,87,88` ; `:520`) fixent des valeurs pour
`hba1c_sous_cible`, `cible_atteinte`, `terrain_cible_assouplie`, `gaj_a_cible`, `over_basalisation`,
`risque_hypoglycemique_eleve`. Toutes sont écrasées par `calculerCriteresDerives`
(`deriveCritere.ts:252-260`) avant l'évaluation.

**J'ai vérifié les 11 occurrences une par une : toutes coïncident aujourd'hui avec la valeur recalculée**
— aucune vignette ne teste autre chose que ce qu'elle annonce. Mais un lecteur croit contrôler ces
valeurs, et le jour où un `derive` change, une vignette qui « pose » explicitement `cible_atteinte: false`
ne le posera plus, sans le dire. À supprimer, ou à commenter comme inertes.

### Comportements cliniquement importants NON couverts

- **Bande CK 10-50 N** : couverte par la seule vignette F-24. Le golden master ne peut structurellement
  pas la voir (cf. M3-1). Déjà signalé par `statine` incertitude #11 — **entrée exacte, vérifiée** : les
  valeurs figées de `CK_x_normale` sont bien {0, 3, 4, 5, 60}, et « FONCTION RÉNALE » n'apparaît
  **0 fois** dans `caracterisation.statine.txt` (contre 20 pour « RHABDOMYOLYSE »).
- **Bande 4 < CK ≤ 5** : aucune vignette (cf. M2-1).
- **Les 10 alertes d'OPTION du domaine** (statine 6, prescription 3, rhd-activite-physique 1) ne sont
  couvertes que par des vignettes — le banc mécanique ne les regarde pas (cf. M3-2).

---

## Mission 3 — Le dispositif de vérification lui-même

### HAUTE (méthode) — M3-1 · Le générateur de profils ne lit ni `prerequis` ni les alertes d'option — et c'est la cause racine du trou CK 10-50

`engine/banc/profils.ts:109-119` (`reglesDuNoeud`) collecte : `option.conditions`, `option.exclusions`,
`option.priorite[].quand`, `node.alertes[].quand`, `critere.derive`.

`engine/relevance.ts:74-90` (même nom, même rôle) collecte **la même chose plus `option.prerequis`**, et
porte le commentaire (`:78-82`) : « un seuil numérique qui n'existerait que dans un `prerequis` doit être
trouvé ici au même titre, sous peine de sous-échantillonner ses valeurs candidates ». Le module
`profils.ts` déclare pourtant (`:38-43`) que les deux extracteurs « ne doivent jamais diverger ». **Ils
divergent.**

Et **ni l'un ni l'autre** ne lit `option.alertes[].quand`. Conséquence démontrée :

- les seuils **10** et **50** de `CK_x_normale` n'existent que dans les deux alertes d'option de
  « Interrompre la statine » (`statine.yaml:258`, `:267`) ;
- ils ne sont donc jamais des valeurs candidates ; le seul seuil harvesté pour ce critère est le `4` de
  `conditions`/`exclusions` ;
- valeurs tirées = {4−1, 4, 4+1} ∪ {min 0, max 60} = **{0, 3, 4, 5, 60}** — exactement la liste observée
  dans `fixtures/profils.statine.json` ;
- la bande 10-50 est donc **inatteignable par construction**, dans le golden master *comme* dans le banc
  dynamique de `couverture.test.ts`.

L'incertitude #11 de `statine` décrit le symptôme (« le générateur a tiré 0, 3, 4, 5 et 60 ») et le
présente comme un aléa de couverture. C'est un défaut générique, qui se reproduira sur **tout** nœud qui
posera un seuil dans une alerte d'option ou dans un `prerequis`. Le même mécanisme touche déjà
`prescription` (`DFG < 40` sur l'alerte d'option du glinide : le littéral 40 n'est jamais candidat ; la
bande est franchie par accident, entre les profils à DFG 31 et 44, mais jamais à sa frontière).

Correctif : trois lignes dans `profils.ts:109-119` (ajouter `option.prerequis` et
`option.alertes[].quand`), suivies d'une complétion délibérée des fixtures.

### MOYENNE — M3-2 · `couverture.test.ts` ne vérifie jamais qu'une alerte d'OPTION se déclenche

`banc/couverture.test.ts:114-124` itère `node.alertes` et rien d'autre. Les **10 alertes d'option** du
domaine échappent donc en bloc à la couche 2. C'est le canal que D21 désigne pourtant comme le plus
subtil (« le fait qualifie un geste sans l'interdire ») et celui qui a servi à corriger deux findings
HAUTE de red-team (statine F-10/F-12, prescription F3). Une alerte d'option morte — condition jamais
satisfiable, ou option jamais atteinte quand elle l'est — passerait inaperçue.

Autres angles morts de la même couche, listés sans les surévaluer :

- `couverture` vérifie que chaque **option** est applicable au moins une fois, et que chaque **expression
  d'`exclusions`** se déclenche. Elle ne vérifie pas que chaque **disjonction de `conditions`** est
  satisfiable : une option à cinq branches dont quatre sont mortes passe au vert.
- `option.prerequis` n'a pas d'équivalent du test « chaque expression d'exclusions est déclenchée ».
- `option.calculs` n'est couvert par rien (aucun test ne vérifie qu'une dose calculée est finie et
  plausible).

### MOYENNE — M3-3 · I8 a un plancher qu'on peut passer sous silence, dans les deux sens

**(a) `id` est facultatif au schéma** (`schema/noeud.schema.json:276-279`). `cible-glycemique` déclare
8 références primaires, **aucune avec `id`**, aucune option ne cite quoi que ce soit, et aucune option
n'est au-dessus de `faible`. Le nœud est donc **intégralement hors de portée de I8a, I8b et I8c** — les
trois passent à vide. C'est le nœud qui produit la sortie la plus directement prescriptive du domaine
(une cible chiffrée).

**(b) I8c ne mord que sur `modere`/`eleve`.** Combiné à la décision référent du 2026-07-27
(« le niveau de preuve doit refléter la CERTITUDE DE LA PREUVE »), qui a fait passer cinq options en
`faible`, la voie de sortie de l'invariant est désormais : rétrograder l'étiquette. Le décompte actuel
montre que le contenu est **exactement** à la limite — le nombre de blocs `references` par nœud égale
presque partout le nombre d'options `modere`/`eleve`, et **aucune** option `faible` de `insuline`,
`prescription` ou `cible-glycemique` ne porte de référence.

Le cas concret qui échappe : `cible-glycemique.yaml:42-50`, option « Cible ≤ 8 % », `niveau_preuve: faible`,
dont l'`effet_attendu` affiché au prescripteur cite nommément un essai — « **ACCORD** : surmortalité sous
contrôle intensif dans une population à ~35 % de maladie CV ». Aucune `references`, et ACCORD n'a pas
d'`id` dans la bibliographie du nœud. C'est *précisément* le défaut qui a motivé la création de I8 (une
carte affichant un chiffre tiré d'un essai que rien ne relie à elle), et I8 ne le voit pas.

Piste minimale, sans toucher au contenu clinique : rendre `id` obligatoire sur
`references_primaires`, et étendre I8c aux options dont `effet_attendu`/`avantages`/`inconvenients`
contiennent un marqueur chiffré (`HR`, `RR`, `NNT`, `OR`, `%`) quel que soit le `niveau_preuve`.

### MOYENNE — M3-4 · Rien ne vérifie le sens inverse : 23 références déclarées ne sont citées par aucune option

| nœud | références orphelines |
|---|---|
| insuline (6) | battelino, beck, lu, mobile, freedm2, jancev |
| prescription (6) | hypoage, grant, griffin-metformine, schumacher-2001, marbury-2000, hasslacher-2003 |
| rhd-alimentation (5) | **predimed, cordioprev**, medas-schroder, medas-martinez, sfd-glucides |
| statine (4) | ascot-lla, chang, ctt-age, prosper |
| rhd-activite-physique (2) | look-ahead, has-obesite-ap |

Certaines sont légitimes (une référence peut soutenir l'`argumentaire` global ou une `incertitude` sans
porter d'option). Une paire mérite quand même l'œil du référent : **PREDIMED et CORDIOPREV** sont, de
l'aveu même du nœud (`rhd-alimentation` incertitude #1), les deux seuls ECR portant le bénéfice sur
critère dur du motif méditerranéen — et ils ne sont accrochés à **aucune** des options qui poussent ce
motif (fruits à coque, légumineuses, poisson, huile d'olive), toutes en `faible` sans références. La
preuve la plus forte du nœud est la seule qui ne soit reliée à rien.

### BASSE — M3-5 · État des listes de dettes nommées

Toutes vérifiées, aucune dette non déclarée, **une seule affirmation périmée** :

| liste | fichier | état | verdict |
|---|---|---|---|
| `NOEUDS_AVEC_SORTIE_VIDE_CONNUE` | `invariants.test.ts:88` | vide | correct — I2′ passe sur les 6 nœuds |
| `NOEUDS_AVEC_CRITERES_MORTS_CONNUS` | `couverture.test.ts:27` | vide | correct |
| `NOEUDS_AVEC_OPTION_INATTEIGNABLE_PAR_LE_GENERATEUR` | `couverture.test.ts:53` | vide | correct |
| `NOEUDS_AVEC_ALERTE_DEFAULT_CONNUE` | `invariants-contenu.test.ts:121` | vide | correct |
| `OPTIONS_A_FONDEMENT_NON_EXPERIMENTAL` | `invariants-contenu.test.ts:320` | vide | correct |
| `ALERTES_PROHIBITIVES_HORS_PERIMETRE` | `invariants-contenu.test.ts:141` | 1 entrée (`insuline :: DFG < 45`) | **toujours nécessaire** — vérifié : le message matche `/contre-indiqu/i` et aucun garde-fou d'`insuline` ne cite `DFG` |

**Affirmation périmée** — `invariants.test.ts:174-178` : « `bool`/`liste` seulement s'ils déclarent
`confirmation_requise` (**absent de tout le contenu actuel**, cf. `content/noeuds/`) ». Il y en a
aujourd'hui **8** (statine 1, rhd-activite-physique 4, rhd-alimentation 3). Le code, lui, est correct : il
filtre bien sur `c.confirmation_requise === true`, donc I3 exerce réellement cette branche. Seul le
commentaire ment — et il ment dans le sens qui invite un futur lot à retirer une branche « morte » qui
ne l'est plus.

### BASSE — M3-6 · `labels.ts` : 11 entrées mortes, et un tooltip clinique perdu au passage

`lib/labels.ts:71-155` (`CRITERE_LABELS`) catalogue 11 critères qui n'existent dans aucun nœud :
`IRC`, `prevention`, `SCORE2`, `contrainte_cout`, `motivation`, `capacite_activite`,
`alimentation_equilibree`, `activite_physique_reguliere`, `TIR`, `TAR`, `GMI`. Inoffensif en soi
(dictionnaire à repli), mais il donne à lire une liste de variables qui n'existent plus.

Le cas qui a une conséquence : **`hypo_interprandiale`**. Promu le 2026-07-27 de valeur de la liste
`profil_glycemique` à critère `bool` propre. Ses deux anciennes entrées survivent —
`ENUM_VALUE_LABELS:186` et surtout `ENUM_VALUE_DESCRIPTIONS:238` (« Hypoglycémies entre les repas →
réduire le bolus correspondant ») — et sont désormais **mortes** : `CriteriaForm.tsx` n'appelle
`describeEnumValue` que sur les rendus `liste` (`:167`) et `enum` (`:235`), jamais sur un `bool`. Le
nouveau critère n'a par ailleurs **aucune** entrée dans `CRITERE_LABELS` : il s'affiche via `humanize`.
Net : le champ a perdu son libellé métier et son infobulle de lecture AGP en changeant de type.

### Vérifié, RAS

- **`lib/replierAffichage.ts`** (créé le 2026-07-27) : relu intégralement. **Aucun** nom de nœud, de
  domaine, de famille ni de critère. Le seul paramètre clinique est le rang, lu depuis le contenu. Les
  trois cas de non-repli sont motivés et le sens du doute est le bon (« une option sans rang est traitée
  comme prioritaire »). Conforme à l'invariant CLAUDE.md 5.
- **`src/features/shared/**` et `engine/*.ts`** : aucun id de nœud ni slug de domaine en dur (recherche
  exhaustive). Les deux seuls fichiers qui nomment le domaine sont `lib/labels.ts` (dictionnaire de
  présentation, repli générique documenté) et `banc/invariants.test.ts` (qui le déclare en tête et
  confine les constantes). Ni l'un ni l'autre n'est le socle générique ni le moteur.
- **`niveau_preuve` = certitude de la preuve** : la règle du 2026-07-27 est appliquée de façon cohérente
  sur les 6 nœuds (aucune option ne revendique `eleve`/`modere` sur un fondement réglementaire ; les deux
  `eleve` restants — iSGLT2 sur `prescription`, haute intensité sur `statine` — sont adossés à 4 et 9 ECR).

---

## Mission 4 — Incertitudes périmées ou à prémisse fausse

J'ai passé les **67 entrées** des six nœuds et vérifié chaque affirmation contre le fichier courant,
jamais contre le texte de l'entrée. Trois sont fausses aujourd'hui.

### HAUTE — M4-1 · `insuline` #1 : déclare « à arbitrer » une dette soldée le jour même

L'entrée dit :

> « TROUVAILLE au passage, **à trancher** : le nœud `prescription` déclare LUI AUSSI un dérivé nommé
> `terrain_fragile`, avec une définition DIFFÉRENTE … **À arbitrer.** »

État réel : `prescription` **ne déclare plus** `terrain_fragile`. La scission a été faite le 2026-07-27
(commit `423b5ef`, `prescription.yaml:209-224`), et `terrain_cible_assouplie` y porte désormais la même
définition que sur `insuline`. `lib/labels.ts:114` écrit d'ailleurs, noir sur blanc : « **Dette I4 SOLDÉE
le 2026-07-27** ».

C'est l'entrée la plus lue du dossier — la mission de cet audit la cite comme l'exemple canonique de
divergence croisée. Elle envoie un futur lecteur arbitrer un arbitrage déjà rendu. À reformuler en
« RÉSOLU le 2026-07-27 » avec le renvoi au commit, comme les autres entrées closes du même fichier.

### MOYENNE — M4-2 · `insuline` #11 : l'entrée qui dénonce les entrées périmées est elle-même périmée sur son résidu

L'entrée corrige à juste titre une version antérieure, puis conclut :

> « **RESTE RÉELLEMENT OUVERT, et rien d'autre** : l'AFFICHAGE du nombre de dose calculé (le moteur le
> calcule, l'écran ne le rend pas encore) — P3+. »

L'écran le rend. `components/OptionCard.tsx:77-85` affiche « Doses indicatives : … », alimenté par
`DecisionNodeScreen.tsx:302` (`calculs={optionVue.calculs}`). Le bloc a été ajouté par le commit
`25ec53c` — **le lot de câblage générique du 2026-07-24 que l'entrée cite elle-même comme fait**. Et le
golden master le montre : « calculs : » apparaît 11 fois dans `caracterisation.insuline.txt`.

L'entrée n'a donc plus aucun résidu ouvert et devrait être close.

### MOYENNE — M4-3 · `insuline` #12 : nomme le mauvais dérivé depuis la scission

> « Intégration inter-nœuds : HbA1c_cible provient du nœud A et **`risque_hypoglycemique_eleve` reprend
> ses déclencheurs de relaxation** — cohérence à maintenir. »

Depuis la scission du 2026-07-27, `risque_hypoglycemique_eleve` inclut délibérément deux signaux
d'hypoglycémie que le nœud A n'a jamais portés, et c'est `terrain_cible_assouplie` qui joue le rôle
décrit — l'entrée #8 du même fichier l'explique longuement, sans que #12 soit mise à jour. Deux
incertitudes du même nœud se contredisent.

Et la version corrigée resterait imprécise, cf. M1-7 : `terrain_cible_assouplie` n'est pas non plus le
miroir exact des déclencheurs du nœud A (`age >= 75` d'un côté ; `comorbidite_grave` et `antecedent_cv`
de l'autre).

### Entrées vérifiées EXACTES (contrôle positif)

Pour que la liste ci-dessus soit lisible comme un résultat et non comme un échantillon :

- `statine` #11 (bande CK 10-50 non couverte) — **reproduit** : valeurs figées {0, 3, 4, 5, 60},
  0 occurrence de « FONCTION RÉNALE » dans le golden master. J'ajoute la cause (M3-1).
- `statine` #6 (dialyse : « discuter »/repli non exclus, I2′ interdit d'exclure le repli) — exact,
  l'option de repli ne porte toujours aucune `exclusions`.
- `statine` #16 (`age` non décisif, seulement dans l'alerte `> 75`) — exact, vérifié règle par règle.
- `prescription` #7 (prémisse fausse déjà corrigée), #12, #13, #14, #15 — exactes, y compris le
  négatif KDIGO qui fonde M1-1.
- `rhd-alimentation` #3 (le verrou TCA ne porte plus aucune `exclusion`) — exact : `verrou_tca`
  n'apparaît plus que dans les `conditions` des deux options d'orientation.
- `rhd-alimentation` #6 (pesée supprimée, `inconvenients` du reliquat réécrits) — exact.
- `rhd-activite-physique` #3 (alerte de nœud dédiée à la neuropathie) — exacte, `rhd-activite-physique.yaml:361`.
- `rhd-*` #6/#7 (plafond d'affichage résolu par `replierAffichage.ts`) — exactes, description conforme
  au module.
- `cible-glycemique` #4 (ancienneté seule ne relâche plus la cible) — exacte, `anciennete_diabete_annees`
  n'apparaît plus que dans `< 5`.
- `insuline` #4 (`over_basalisation` n'est plus une exclusion de « Titrer la basale ») — exacte.

---

## Ce que je n'ai PAS pu vérifier

- **L'exactitude clinique des seuils et des chiffres.** Hors périmètre de cette passe, et hors de ma
  portée : plusieurs sources décisives sont des PDF locaux (`docs/decision/sources/`) que je n'ai pas
  ouverts, et plusieurs autres sont sous droit d'auteur ou paywall. M1-1 porte sur l'**attribution** d'un
  seuil, pas sur sa valeur — je ne me prononce pas sur « DFG < 30 ».
- **Si les attentes des trois vignettes révisées venaient réellement du référent.** Les messages de
  commit l'affirment ; rien d'opposable ne le corrobore. C'est le point structurel signalé en mission 2,
  pas une accusation.
- **Le rendu visuel.** Règle du dépôt (validation visuelle = humaine) : je n'ouvre pas de navigateur.
  Les conséquences d'affichage que je décris (M1-3 défaut de formulaire, M2-1 message affiché,
  M3-6 tooltip perdu) sont déduites de la lecture du code de rendu, pas constatées à l'écran.
- **`docs/decision/` au-delà de ce que j'ai échantillonné.** Je signale au passage que
  `docs/decision/validation/carte-coherence.md` décrit la structure à **7 nœuds A-H** (fichiers
  `premiere-intention.yaml`, `intensification.yaml`, `sulfamides-gliptines.yaml`, `rhd.yaml`) qui
  n'existe plus depuis les fusions/scissions des 26-27 juillet. Le tableau de la mission 1 ci-dessus le
  remplace pour ce qui est des critères partagés ; le reste du document (seuils, lexique molécules) n'a
  pas été réaudité et devrait porter un bandeau de péremption.
- **Les autres domaines** (cardiovasculaire, BPCO, gériatrie) : aucun contenu, rien à vérifier.

---

## Récapitulatif ordonné

| # | sévérité | où | quoi |
|---|---|---|---|
| M1-1 | **HAUTE** | `insuline.yaml:746` (+ `:1321`, `prescription.yaml:875`) | Attribution « convention KDIGO » établie fausse, corrigée sur `prescription`, toujours affichée sur `insuline` |
| M4-1 | **HAUTE** | `insuline.yaml` incertitude #1 | Déclare « à arbitrer » la dette I4 soldée le même jour |
| M3-1 | **HAUTE (méthode)** | `banc/profils.ts:109-119` | Le générateur ignore `prerequis` et les alertes d'option ⇒ bande CK 10-50 inatteignable par construction ; diverge de `relevance.ts` qui inclut `prerequis` |
| M1-2 | MOYENNE | `insuline.yaml:66` vs `prescription.yaml:203` | `cible_atteinte` : un nom, deux mécanismes ; `insuline` déduit l'état que R1 veut déclaré |
| M1-3 | MOYENNE | `insuline.yaml:119` vs `prescription.yaml:175` | `preference_injection` : ordre différent ⇒ défaut `accepte` vs `indifferent` |
| M1-4 | MOYENNE | `cible-glycemique.yaml:27` vs `prescription/statine` + `lib/esperanceVieDefault.ts:40` | `antecedent_cv` ≡ `ASCVD_etablie` ; la suggestion d'espérance de vie diverge d'un nœud à l'autre |
| M1-5 | MOYENNE | `insuline.yaml:121` vs 3 autres nœuds | `traitements_en_cours` : `insuline` vs `insuline_basale`/`insuline_rapide`, sans table de correspondance |
| M1-6 | MOYENNE | 7 critères, 4 nœuds | `confirmation_requise` posé sur les drapeaux qui ouvrent, absent de ceux qui ferment (dont `dialyse`) |
| M2-1 | MOYENNE | `statine.yaml:420-423`, `:94` ; tests `:334`, `:367` | Alerte « 5 fois la normale » sur une règle à `> 4` ; deux vignettes verrouillent le libellé erroné ; 21 profils figés concernés |
| M3-2 | MOYENNE | `banc/couverture.test.ts:114-124` | Aucune couverture des 10 alertes d'option du domaine |
| M3-3 | MOYENNE | `schema/noeud.schema.json:276` ; `invariants-contenu.test.ts:322` | I8 hors de portée sur `cible-glycemique` (aucun `id`) ; I8c muet sur `faible`, y compris quand l'option cite un essai |
| M3-4 | MOYENNE | 5 nœuds | 23 références déclarées jamais citées, dont PREDIMED et CORDIOPREV sur `rhd-alimentation` |
| M4-2 | MOYENNE | `insuline.yaml` incertitude #11 | Le résidu déclaré ouvert (affichage des doses) est livré depuis `25ec53c` |
| M4-3 | MOYENNE | `insuline.yaml` incertitude #12 | Nomme `risque_hypoglycemique_eleve` là où la scission a mis `terrain_cible_assouplie` |
| M1-7 | BASSE | 3 points | Ordre des termes ; `age >= 75` vs `> 75` ; « miroir exact du nœud A » inexact |
| M2-2 | BASSE | `insuline.test.ts:231`, `:171` ; `statine.test.ts:180` | Trois assertions plus lâches que leur énoncé |
| M2-3 | BASSE | `prescription.test.ts`, `insuline.test.ts` (11 occurrences) | Critères dérivés posés dans les profils de test, silencieusement recalculés (toutes cohérentes aujourd'hui) |
| M3-5 | BASSE | `invariants.test.ts:174-178` | « `confirmation_requise` absent de tout le contenu » — il y en a 8 |
| M3-6 | BASSE | `lib/labels.ts` | 11 entrées mortes ; `hypo_interprandiale` a perdu libellé et tooltip en changeant de type |

Aucune des 19 entrées n'est un défaut clinique de contenu : ce sont des défauts de **cohérence entre
nœuds**, de **traçabilité de source** et de **portée du dispositif**. Le contenu clinique lui-même,
pour ce que cette passe transverse en voit, tient.
