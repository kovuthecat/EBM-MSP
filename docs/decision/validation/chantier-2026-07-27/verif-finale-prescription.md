# Vérification finale adversariale — nœud `prescription` (lot du 2026-07-27)

- **Posture** : réfutation. Aucune affirmation du contenu n'a été reprise sans être rouverte —
  soit en source primaire (PubMed), soit en **faisant tourner le moteur** sur le profil concerné.
- **Écriture** : ce fichier est le SEUL écrit. `content/**`, `src/**` et les rapports existants n'ont
  pas été modifiés. Le banc temporaire que j'ai utilisé pour produire les preuves d'exécution a été
  supprimé après usage.
- **Méthode d'exécution** : harnais Vitest temporaire à la racine, important le nœud réel via
  `loadNodes.ts` et appelant `evaluateNode` / `evaluateCondition` / `evaluerDerive` /
  `determinesEffectifs` / `construireVueDecision` — donc le moteur de production, pas une
  réimplémentation. Chaque chiffre marqué **[moteur]** ci-dessous vient de cette exécution.
- Date : 2026-07-27.

---

## Verdict global

**Les trois corrections que le lot revendique sont exactes là où elles agissent — la scission est
rigoureusement neutre (je l'ai prouvée sur 17 536 combinaisons, y compris ternaires), le plancher se
déclenche exactement dans la bande de la SFD et nulle part ailleurs, l'attribution KDIGO est
correctement retirée — mais le lot a laissé derrière lui un nœud qui affirme au praticien un chiffre
faux sur le profil même qui a motivé le changement, une contre-épreuve vide qui laisse survivre la
mutation qu'elle prétend interdire, et un sur-blocage dont la conséquence réelle (un patient sans
aucune option) n'a été mesurée par personne.**

Bilan : **3 HAUTE · 9 MOYENNE · 12 BASSE**. Aucune fabrication de source, aucun PMID faux.

---

## HAUTE

### HAUTE-1 — Une alerte affichée au praticien énonce un chiffre faux, exactement sur le profil-témoin du lot

**Citation contestée** — `content/noeuds/diabete-type-2/prescription.yaml:1219-1223` :

```yaml
- quand: "intention == intensifier AND hba1c_sous_cible == true"
  niveau: attention
  message: "Cohérence : HbA1c < 6,5 % alors que l'intention saisie est « intensifier »…"
```

**Ce qui se passe réellement [moteur]** — profil `HbA1c_actuelle: 6.8`, `DFG: 25`,
`traitements_en_cours: ['glinide']`, `intention: intensifier` (c'est mot pour mot le patient invoqué
par le lot pour justifier le plancher, `:193-196` et `:1611`) :

```
hba1c_sous_cible = true
ALERTE [attention] Cohérence : HbA1c < 6,5 % alors que l'intention saisie est « intensifier ».
```

Le patient est à **6,8 %**. Le message lui affirme qu'il est **sous 6,5 %**.

Le même défaut porte sur la carte réellement sélectionnée pour ce patient, `:817`, `avantages` de
« Désintensifier » — l'option dont la condition EST `hba1c_sous_cible == true` :

> « Un HbA1c **< 6,5 %** sous agent hypoglycémiant = sur-traitement iatrogène — déprescrire à TOUT ÂGE. »

Et sur `:934`, `inconvenients` de « Réduire la posologie du **glinide** » — c'est-à-dire l'option la
plus directement visée par le nouveau plancher : « En sur-contrôle franc (**< 6,5 %**) ». Idem `:908`
pour le sulfamide (sans conséquence : le sulfamide est exclu sous 30).

**Impact clinique** : la direction proposée (déprescrire) est juste ; le fait énoncé est faux, et il
est faux au regard de la donnée que le praticien vient lui-même de saisir. C'est le type d'écart qui
détruit la confiance dans un outil EBM plus sûrement qu'une erreur de conduite, parce qu'il est
vérifiable d'un coup d'œil. Le lot a modifié le seuil du moteur sans modifier aucune des quatre
phrases qui l'énoncent.

### HAUTE-2 — La contre-épreuve du plancher est VIDE : la mutation qu'elle prétend interdire survit à toute la suite

**Citation contestée** — `src/features/decision/engine/evaluateNode.prescription.test.ts:909-915`
(vignette `R6-6`), dont le commentaire `:910` la présente comme « la seconde contre-épreuve, sur
l'autre moitié de la condition ».

**Ce que la vignette fait réellement** : son profil porte `traitements_en_cours: ['metformine']`. Or
l'option « Désintensifier » a **deux** conditions (`prescription.yaml:812-813`), et la seconde est :

```
traitements_en_cours contient sulfamide OR traitements_en_cours contient glinide OR traitements_en_cours contient insuline
```

Un patient sous metformine seule échoue cette seconde condition **quoi que fasse le dérivé**.
Conséquence démontrable : si l'on retirait du `derive` (`:200`) les clauses `contient glinide` /
`contient insuline` — c'est-à-dire si le plancher de 7 % s'appliquait à **tout** patient à DFG < 30,
précisément l'erreur que `R6-6` prétend interdire — **`R6-6` passerait toujours, et aucun des
73 tests du fichier ne tomberait.**

Le test qui tuerait cette mutation est le cas miroir « HbA1c 6,8 + DFG 25 + **sulfamide seul** » (là
la seconde condition est vraie, donc l'attendu « Désintensifier absent » devient discriminant) :
**il n'existe pas**. Aucune vignette du fichier ne combine DFG < 30 et une HbA1c dans la bande
6,5-7 avec un sulfamide.

**Second trou du même point** : la valeur **7 %** n'est épinglée nulle part. Les quatre vignettes
positives (`R6-4`, `R6-5`, `R6-7`, `R6-8`) ne testent que 6,8. Relever le plancher à 7,5 ou à 8 %
laisserait les cinq tests au vert.

**Impact** : le garde-fou numérique le plus sensible du lot — celui qui décide de déprescrire chez un
insuffisant rénal sévère — est protégé par une suite qui ne détecte ni son élargissement à toutes les
classes, ni son relèvement.

### HAUTE-3 — La branche qui distingue les deux moitiés de la scission n'est exercée par aucune vignette

**Citation contestée** — `prescription.yaml:219-222` : « ZÉRO CHANGEMENT DE COMPORTEMENT ».

L'affirmation est **vraie** (je l'ai prouvée, cf. CONFIRMÉ-1). Ce qui ne l'est pas, c'est qu'elle
soit vérifiée par quoi que ce soit dans le dépôt.

La condition reconstruite (`:812`) a quatre disjonctions ; la troisième est celle que la scission a
fait apparaître :

```
… OR hypoglycemie_recente == true AND risque_hypoglycemie_schema == eleve OR …
```

**Relevé exhaustif du fichier de vignettes** : `hypoglycemie_recente: true` apparaît en `:504`,
`:515`, `:816`, `:831`, `:841` — les cinq gardent `risque_hypoglycemie_schema` au défaut `'faible'`.
`risque_hypoglycemie_schema: 'eleve'` apparaît en `:77`, `:169`, `:179`, `:185`, `:369` — les cinq
gardent `hypoglycemie_recente: false`. **Intersection vide.** Les 9 tests qui attendent
« Désintensifier » sont tous satisfaits par une AUTRE disjonction. **Supprimer entièrement la
troisième disjonction ne ferait échouer aucun des 73 tests.**

Le commentaire de `R3-4` (`:497-501`) nomme pourtant les deux branches : l'auteur les avait
identifiées, et n'a écrit la contre-épreuve positive que pour l'une (`R3-4-fragile`, `:511`, qui passe
par `fragilite: true`, donc par `terrain_cible_assouplie`).

**Impact** : la scission était censée rendre « deux motifs enfin lisibles séparément ». Le second
motif n'est couvert par rien. L'équivalence tient par l'algèbre, pas par la vérification — c'est de
la chance, pas de la preuve, et la prochaine réécriture ne bénéficiera pas de la même chance.

---

## MOYENNE

### MOYENNE-1 — Le sur-blocage prive un profil précis de TOUTE option d'ajout, et l'option de repli qui subsiste est impossible

C'est la question D de la mission. Réponse : **oui, et le cas est fréquent**.

**[moteur]** Sur 2 160 profils fragiles balayés (10 listes de traitements × 3 DFG × dispo des classes ×
2 positions × 3 intentions × 3 IMC × dénutrition), **432 perdent toute option de la famille « Agent à
ajouter »** du seul fait de l'exclusion `fragilite == true` (`:1055`). Signature invariante des 432 :

```
classes_a_benefice_indisponibles == true  ET  gliptine (ou aGLP1) déjà en cours
```

soit `tt=[gliptine]`, `tt=[metformine,gliptine]`, `tt=[metformine,gliptine,glinide]`,
`tt=[metformine,aGLP1]`. (Un fragile sous metformine seule ne perd rien : l'option gliptine reste
ouverte. Le sur-blocage ne mord que quand la niche gliptine est déjà consommée.)

**Ce que voit le praticien [moteur]** — 80 ans, fragile, metformine + gliptine, DFG 80, classes à
bénéfice déclarées indisponibles, au-dessus de l'objectif, intention « intensifier » :

```
FAMILLE Socle du traitement
   - Metformine (socle du traitement) — instaurer ou poursuivre
FAMILLE Traitement à corriger ou remplacer
   - Remplacer la gliptine (aucun bénéfice sur critère dur — préférer un agent qui en apporte)
```

Avant le 2026-07-27, ce patient recevait « Sulfamide (gliclazide MR ou glimépiride) — option
glycémique de bas rang ». Il ne reçoit plus aucun levier glycémique. Et le seul geste proposé,
« Remplacer la gliptine », dirige vers **un iSGLT2 ou un AR GLP-1 — les classes que le praticien vient
de déclarer indisponibles**.

**Pourquoi le repli ne se referme pas** : les deux options de switch (`:704`, `:756`) sont les seules
options d'action du nœud à ne PAS porter le prérequis `classes_a_benefice_indisponibles == false` que
portent toutes les options d'introduction (`:496`, `:545`, `:608`, `:648`). L'entrée `incertitudes`
`:1502` affirme pourtant que ce drapeau « supprime désormais l'introduction d'iSGLT2 / AR GLP-1 /
tirzépatide / association et l'intensification glycémique résiduelle » — le switch y échappe.
Et « Envisager l'insuline » ne peut pas prendre le relais : ses conditions (`:671`) exigent que le
patient soit **déjà sous iSGLT2**.

**Impact clinique** : un sujet âgé fragile, au-dessus de son objectif, chez qui les classes
protectrices sont inutilisables, ressort de l'outil sans aucune conduite applicable. Le sur-blocage
est assumé ; cette conséquence-là ne l'est pas — elle n'est décrite dans aucune entrée
d'`incertitudes` ni dans le changelog. À noter que la seconde voie d'accès de l'option sulfamide
(`classes_a_benefice_indisponibles == true`) n'a **aucune vignette** : seule la voie
`palette_glycemique_ouverte` est testée (`R6-1`/`R6-2`), donc rien ne pouvait le faire apparaître.

### MOYENNE-2 — L'attribution « convention KDIGO » est retirée à trois endroits et subsiste au quatrième, dans le même fichier

`prescription.yaml:875-876`, bloc de commentaire « SCISSION SULFAMIDE / GLINIDE » :

> `# prolongée »). Le seuil chiffré « DFG < 30 » reste une convention KDIGO/SFD — le RCP dit`
> `# « sévère » sans valeur, cf. incertitudes ;`

C'est exactement la phrase que le lot déclare avoir retirée (`:419-428`, `:1289`, `:1464`,
`:1534-1541`, `:1616-1618`). Le fichier d'autorité affirme donc simultanément que le seuil **est** et
**n'est pas** une convention KDIGO.

**Et l'erreur est vivante dans un nœud voisin, non touché par le lot** :
`content/noeuds/diabete-type-2/insuline.yaml:746` et `:1321` portent toujours « convention
KDIGO/SFD ». La correction a été faite nœud par nœud alors que l'erreur est de domaine.

**Impact** : commentaire, donc non rendu à l'écran — mais c'est le texte qui fait autorité pour la
prochaine modification, et `insuline.yaml` est, lui, du contenu rendu.

### MOYENNE-3 — « sitagliptine → vildagliptine » : trois endroits corrigés, au moins trois oubliés

Le changelog annonce trois endroits (`:1613-1615`) et ils sont bien corrigés (`:432`, `:1025`,
`:1198`). Restent :

1. **`prescription.yaml:683`** — `avantages` de « Envisager l'insuline » : « En insuffisance rénale
   sévère, un AR GLP-1 ou **la sitagliptine à dose adaptée** restent souvent utilisables ». « IRC
   sévère » est défini par le nœud lui-même (`:191`) comme DFG 15-29 — précisément la zone où le nœud
   dit que la sitagliptine 25 mg n'est pas dispensable.
2. **`prescription.argumentaire.md:165`** — même phrase, dans l'argumentaire **rendu à l'écran**
   (`argumentaire_exhaustif`, chargé par `content/loadArgumentaires.ts`, affiché par
   `components/ArgumentPanel.tsx`).
3. **`prescription.yaml:1188-1193`** — alerte SANS aucune condition de DFG qui recommande « la
   gliptine (**sitagliptine**, sans hypoglycémie) » ; elle peut donc s'afficher à DFG 20.
4. **`prescription.yaml:977`** — l'`intitule` de l'option reste **« Gliptine (sitagliptine) »**.
   C'est le titre de la carte, la chaîne la plus visible, affichée telle quelle à un patient à DFG 25.

**Point de fond, distinct** : le nœud justifie le choix de la sitagliptine par « seule gliptine FR à
**sécurité CV démontrée**, TECOS » (`:997`), puis lui substitue la vildagliptine sous 30 **sans dire
que cette molécule-là n'a aucun CVOT**. Le critère de sélection est abandonné en silence, dans une
population (IRC sévère) où la prévalence d'insuffisance cardiaque est élevée. Je ne me prononce pas
sur le profil CV de la vildagliptine (cf. NON VÉRIFIÉ) ; je signale que le nœud, lui, ne se prononce
pas non plus, alors qu'il en a fait son critère.

### MOYENNE-4 — Le champ neuf `option.references` adosse des chiffres DURS à des références de substitution

C'est le défaut exact que le champ était censé rendre impossible.

- **« Remplacer la gliptine »** (`:704`, `modere`) affiche en `effet_attendu` (`:724-727`) : « iSGLT2 :
  hospitalisation pour IC HR ~0,61-0,73, progression rénale HR ~0,56-0,76 ». Ses `references` (`:729`)
  sont `tecos` (essai **neutre** de gliptine), `pioneer-3` et `tran-kramer` (les deux
  `type_critere: substitution`). **Aucune ne porte ces HR.** Les essais qui les portent (`empa-reg`,
  `dapa-ckd`, `credence`, `emperor-reduced`) sont dans la bibliographie du nœud et ne sont pas cités
  par cette option.
- **« Remplacer le sulfamide »** (`:756`, `modere`) : même structure (`effet_attendu:770-772`
  « bénéfice d'organe = iSGLT2 / AR GLP-1 choisi »).
- Sur la même option `:704`, les `avantages` (`:718`) nomment « 4 CVOT neutres : TECOS, SAVOR,
  **EXAMINE**, **CARMELINA** » et les `inconvenients` (`:722`) « **Pratley 2012** » — EXAMINE,
  CARMELINA et Pratley sont **absents** de `sources.references_primaires`.
- **Références sur une autre molécule que celle de l'option** : l'option « Gliptine
  (**sitagliptine**) » (`:977`) cite `carolina` (**linagliptine**) et `savor-timi-53`
  (**saxagliptine**) — deux molécules que la même option interdit explicitement (`:1025`, « ni
  lina/alogliptine (non commercialisées FR) », « Ne pas utiliser saxagliptine »). La revendication
  soutenue (`:1001-1002`, « Face au sulfamide : absence d'hypoglycémie et de prise de poids
  (CAROLINA) ») repose donc sur une molécule indisponible en France.

**Impact** : le champ fabrique une apparence de sourçage qui pointe à côté de la source. C'est pire
qu'une absence de référence, parce que l'invariant I8 le déclare conforme.

### MOYENNE-5 — Les trois études PK versées le 2026-07-27 ne sont citées par AUCUNE option

Le motif déclaré du versement (`:1406-1408`) est : « Elles portaient déjà l'argumentaire de l'option
de réduction du glinide sans figurer dans cette bibliographie. » Or **« Réduire la posologie du
glinide » (`:911`) ne porte aucun champ `references`** — pas plus que les 17 autres options en
`niveau_preuve: faible`. `schumacher-2001`, `marbury-2000` et `hasslacher-2003` sont donc versées et
orphelines : l'option qui a motivé le lot est le seul endroit où elles auraient dû aller.

L'invariant I8-c ne peut pas le voir : il ne s'applique qu'aux options `modere`/`eleve`.

### MOYENNE-6 — Le titre de `schumacher-2001` affirme une identification que les résumés ne portent pas

`:1412` : « c'est **L'ÉTUDE DE LA RUBRIQUE 5.2 du RCP** (exposition ASC ×2 entre 20 et 39 ml/min),
identifiée par le red-team ».

**Ce que disent réellement les sources primaires** (j'ai ouvert les deux) :

- **Schumacher 2001, PMID 11417447**, *Eur J Clin Pharmacol* 2001;57(2):147-52 — identité, n = 34
  (12/12/10) et schéma (2 mg à J1, puis 2 mg préprandiaux J2-J4, dose finale J5) **exacts**. Mais son
  résumé écrit : « Patients with mild-to-moderate renal impairment showed **no significant
  differences** in the pharmacokinetics » et, pour le groupe sévère, « the main pharmacokinetic
  finding was **a longer half-life** after multiple dosing ». Il ne rapporte **aucun rapport d'ASC** et
  **aucune borne de clairance**.
- **Marbury 2000, PMID 10668848** — c'est SON résumé qui porte « Subjects with severe impairment had
  **significantly higher area under the curve** values after single and multiple doses » (sans
  chiffrer le rapport non plus).

Autrement dit, au niveau des résumés, c'est Marbury et non Schumacher qui porte le signal d'ASC.
L'identification du red-team repose sur la concordance du schéma posologique avec le libellé de la
rubrique 5.2 (« traitement de 5 jours, 2 mg × 3/jour ») — inférence raisonnable, et le red-team la
présente comme telle (`redteam-seuils-renaux.md:197-204`). Le nœud, lui, l'inscrit comme un **fait**,
dans un champ `titre` qui est rendu.

**Impact** : faible cliniquement (rien du comportement n'en dépend), non nul en méthode — c'est
exactement le genre d'attribution que le lot a passé la journée à corriger ailleurs. À reformuler en
« probablement l'étude de la rubrique 5.2 (concordance du schéma posologique) ».

### MOYENNE-7 — `niveau_preuve` : la règle du jour a été appliquée à 4 options et s'est arrêtée là

Le principe adopté est explicite (`:365-371`) : « le niveau de preuve doit refléter la CERTITUDE DE
LA PREUVE ». Sous GRADE, l'**indirectness** est un motif de déclassement. J'ai passé les 26 options :

- **`:704` « Remplacer la gliptine » = `modere`** alors que ses propres `inconvenients` (`:722`)
  disent : « Aucun ECR de switch dédié ne montre que RETIRER la gliptine réduit un critère dur […]
  argument indirect […] Le switch n'est documenté que sur critères de substitution. » Preuve indirecte
  + substitution seule = `faible` sous GRADE.
- **`:756` « Remplacer le sulfamide » = `modere`** — clause d'indirectness identique (`:768`).
- **`:735` « Arrêter la gliptine redondante » = `modere`** sur une **seule** étude de substitution
  (`nauck`).
- **Symétriquement, `:487` « Introduire un iSGLT2 » = `eleve`** avec `delai_benefice: 16-26 mois` et
  les HR/NNT des CVOT — mais l'option se déclenche sur `palette_glycemique_ouverte == true` **seul**
  (`:489`). **[moteur]** Profil 55 ans, sans ASCVD, sans IC, DFG 90, albuminurie normale, IMC 26,
  intention intensifier :

  ```
  Introduire un iSGLT2 …
    niveau_preuve = eleve
    delai_benefice = 16-26 mois
    effet_attendu = Hospit. IC HR ~0,61-0,73 (NNT ~19-31 / 16-26 mois) ; progression rénale
                    HR ~0,56-0,76 (NNT DAPA-CKD 19, CREDENCE 22). IDM/AVC non réduits.
  ```

  Le nœud écrit pourtant **deux fois**, de sa propre plume, que cette preuve n'est pas transférable à
  ce patient : `:1283-1287` et `prescription.argumentaire.md:154-161` (« les HR/NNT des CVOT viennent
  de populations enrichies […] et ne sont pas transférables sans la comorbidité »). La réserve est en
  prose ; l'étiquette la contredit.

**Impact** : la décision de principe du 2026-07-27 est la bonne. Elle n'a été appliquée qu'aux quatre
options dont l'invariant I8 avait rendu le problème visible. Les cas où elle mord le plus — une
preuve indirecte étiquetée `modere`, une preuve non transférable étiquetée `eleve` — n'ont pas été
revus.

### MOYENNE-8 — Un NNT affiché qu'aucune référence du nœud ne porte, et que la source primaire contredit

`:569-571`, `effet_attendu` de « Introduire un AR GLP-1 » : « MACE HR ~0,87-0,88 […] **NNT ~18 en
prévention secondaire**, ~60-70 en primaire ».

Les deux seules références à critère dur déclarées par cette option sont `leader` et `rewind`.
**LEADER (Marso 2016)** : 608/4 668 (13,0 %) contre 694/4 672 (14,9 %), HR 0,87 — le NNT publié est de
**66 à 3 ans** pour le MACE. REWIND donne ≈ 71, ce qui colle au « ~60-70 en primaire » du nœud. Un NNT
de 18 supposerait une réduction absolue d'environ 5,5 points, incompatible avec un HR de 0,87 à ces
taux d'événements.

**Impact** : chiffre affiché, favorable, et non soutenu. À sourcer ou à retirer.

### MOYENNE-9 — Le `delai_benefice` de l'iSGLT2 exclut le NNT rénal affiché juste à côté

`:517-521` : l'`effet_attendu` donne « NNT DAPA-CKD 19 » et le `delai_benefice` déclare « 16-26 mois ».
Mais la bibliographie du même fichier titre DAPA-CKD « **NNT 19 / 2,4 ans** » (`:1306`), soit ≈ 29
mois — hors de la fenêtre. Le commentaire `:520` assume que le délai est « extrait de l'`effet_attendu`,
non recalculé » : il a été extrait de la branche **insuffisance cardiaque**, pas de la branche rénale,
et les deux sont rendus côte à côte.

---

## BASSE

- **B-1** — `prescription.argumentaire.md:93-96` décrit encore l'état d'avant la scission du
  2026-07-26 : « un patient sous glinide **seul** à DFG < 30 perd donc son geste de réduction ». Faux
  depuis que « Réduire la posologie du glinide » (`prescription.yaml:911-937`) n'a plus d'exclusion
  rénale. Le même document se corrige 125 lignes plus bas (`:218-231`). Défaut jumeau en `:70-73`, qui
  présente au présent un correctif dont la moitié glinide a été défaite le lendemain.
- **B-2** — `prescription.argumentaire.md:118-119` : « Non-association gliptine + AR GLP-1 **par
  construction** ». Le verrou a été levé le 2026-07-25 (`prescription.yaml:14-17` ; `:542-545` ne porte
  plus `ne_contient_pas gliptine`). La garantie repose désormais sur l'alerte `:1259-1265` — **qu'aucune
  vignette ne teste** (`D4:193-209` vérifie que l'AR GLP-1 devient applicable chez un patient sous
  gliptine et n'assertionne pas l'alerte). Garde-fou déplacé de la structure vers l'affichage, affichage
  non testé.
- **B-3** — Contradiction interne dans `incertitudes` : `:1500` (« le garde-fou **< 6,5 %** reste
  absolu ») contre `:1567-1572` (« vaut désormais **7 %** »). Même liste, même fichier. Même écart entre
  l'en-tête `:14` et `:21-22`, et dans le champ `argumentaire:` entre `:1278` et `:1295`.
- **B-4** — Changelog `:1595` : « **4 options** restent sans référence ». **[moteur]** 18 des 26 n'en
  ont aucune. La phrase n'est vraie que des 4 options de sécurité rétrogradées ; telle qu'écrite elle
  laisse croire que 22 options sont adossées.
- **B-5** — **Surface d'indétermination nouvelle, non déclarée.** `hba1c_sous_cible` cite désormais
  `DFG` et `traitements_en_cours`. **[moteur]** patient à HbA1c 6,8 sous glinide, DFG **non renseigné** :
  le critère devient `INDETERMINE` (il était déterminé-faux avant le lot), donc les options qui le citent
  partent en `enAttente`. C'est défendable sous D20 — mais ce n'est écrit nulle part.
- **B-6** — La scission **change** ce qui est affiché. **[moteur]** `termesVrais` renvoie
  `["hypoglycemie_recente == true AND terrain_fragile == true"]` avant, et **deux** termes après. Le
  changelog le dit (`:1621-1622`) ; le commentaire du critère dit « ZÉRO CHANGEMENT DE COMPORTEMENT »
  (`:219`). Les deux phrases sont dans le même fichier.
- **B-7** — **[moteur]** Pour un fragile avec classes indisponibles et risque hypo élevé, les options
  applicables sont metformine + gliptine, et l'alerte `:1188-1193` s'affiche : « DÉCONSEILLER le
  sulfamide […] **Si un SU est retenu : gliclazide MR à dose basse** ». Le nœud vient de l'**exclure
  durement**. Une alerte donne une consigne de dosage pour un médicament que le moteur interdit — R8/D21
  (« un canal par fait de sécurité »). Idem `contre_indications:1076`, resté à « **Déconseillé** chez le
  sujet à risque d'hypoglycémie élevé », un cran sous « ne jamais ».
- **B-8** — `prescription.argumentaire.md:169-184`, section « Gating négatif de terrain », est le
  catalogue des exclusions de terrain du nœud et **ne mentionne pas** la nouvelle exclusion
  `fragilite == true` sur le sulfamide. La « palette » (`:162`) présente encore « insuline, sulfamide,
  gliptine » sans réserve.
- **B-9** — La parité inter-nœuds revendiquée par `:215-217` est **réelle** (vérifié :
  `insuline.yaml:111` = `fragilite OR esperance_vie == limitee OR age >= 75` ≡ `prescription.yaml:225`)
  mais les deux sont écrits **différemment** (terme booléen nu vs `== true`, ordre inverse) : même un
  invariant de comparaison textuelle ne pourrait pas la garder. Le commentaire le reconnaît (« la
  vérification est restée manuelle ») sans en tirer de garde-fou.
- **B-10** — Hygiène des vignettes (fichier `evaluateNode.prescription.test.ts`) : `idx()` (`:69`)
  renvoie **-1** quand l'option est absente, donc `D2:190`, `ORD2:408` et `R1:267` passent **vacuement**
  si l'option qu'elles prétendent ordonner disparaît. `PC1:288-289` et `RECETTE:450` assertionnent des
  critères **dérivés** (recopie de l'expression `derive`), pas une conduite. Des valeurs de profil sont
  **mortes**, écrasées par `calculerCriteresDerives` (`RT-S4:792` `hba1c_sous_cible: false` avec
  HbA1c 6.5 — le plus trompeur ; `PORTE_SULFAMIDE:869`, du lot audité). Et **aucune vignette du fichier
  n'assertionne jamais un motif d'exclusion** (`excludedTitles:66` jette les valeurs de la Map), alors
  que la recette référent demandait explicitement que le sulfamide apparaisse « avec son motif ».
- **B-11** — `src/features/decision/engine/banc/invariants.test.ts:270-276` : l'invariant 3a a été
  affaibli **sur le comportement constaté** (« constaté sur ce banc : 3 profils » ; « jamais
  co-proposés » devenu « jamais tous deux badgés `recommandee` »). C'est le seul endroit du banc où un
  oracle a été recalé sur le moteur.
- **B-12** — Hygiène de dépôt : deux artefacts non suivis à la racine, **antérieurs à cette session** —
  `zz-audit-tmp.test.ts` et `.tmp-audit/`. `vite.config.ts` ne déclare aucun `test.include`, donc
  l'`include` par défaut de Vitest ramasse `zz-audit-tmp.test.ts` : il **s'exécute avec `npm test`** et
  gonfle le décompte cité dans `VALIDATION.md`. (Mon propre harnais a été supprimé.) Par ailleurs
  `meta.date_revue` (`:1576`) est resté au 2026-07-26 alors que cinq entrées de changelog sont datées du
  2026-07-27, et l'oracle référent `docs/decision/validation/vignettes-prescription.md:38` porte encore
  la vignette `D3`, dont l'attendu a été inversé par R3 sans que le document soit corrigé.

---

## CE QUI EST CONFIRMÉ

1. **La scission EST neutre. Prouvée, pas supposée.**
   - La grammaire réelle est bien celle que la réécriture suppose : `conditions.ts` découpe d'abord sur
     `OR` (`:238`) puis sur `AND` à l'intérieur de chaque terme (`:249`) — `AND` lie donc plus fort, et
     toute expression est une disjonction de conjonctions. `deriveCritere.ts:203-210` applique le même
     ordre. Aucune parenthèse n'est nécessaire.
   - **[moteur] 1 152 combinaisons booléennes exhaustives** (âge × fragilité × espérance de vie ×
     risque hypo × hypo récente × `hba1c_sous_cible` × position) : **0 divergence** entre l'ancienne
     condition et la nouvelle.
   - **[moteur] 16 384 combinaisons TERNAIRES** (D20), balayant les 2⁹ sous-ensembles de « renseignés »
     sur les 9 critères concernés, avec reconstruction de l'ancien dérivé `terrain_fragile` et calcul
     réel de `determinesEffectifs` : **0 divergence**. La raison de fond : `ternaryAll`/`ternaryAny`
     (`conditions.ts:73-89`) sont les ET/OU de Kleene forts, et K3 est distributive — donc
     `A ∧ (B ∨ C) ≡ (A∧B) ∨ (A∧C)` survit aussi à l'état indéterminé.
   - Seule réserve : ce qui est **affiché** change (B-6).
2. **Le garde `DFG > 0` est réel et porteur.** `valeurParDefaut` (`lib/formLayout.ts:50-51`) renvoie
   bien **0** pour un `nombre` (et non `min`). **[moteur]** formulaire vierge → `hba1c_sous_cible = false`.
   Contrefactuellement, garde retiré : DFG non saisi + glinide + HbA1c 6,8 → **`true`**. Le commentaire
   `:198-199` dit exactement vrai.
3. **Le plancher se déclenche exactement où il doit, et nulle part ailleurs.** **[moteur]** Balayage
   12 HbA1c × 10 DFG × 7 listes de traitements : **45 profils changent de valeur**, et ce sont
   **exactement** les HbA1c ∈ [6,5 ; 7[ × DFG ∈ [3 ; 29] × (glinide ∨ insuline). Aucun faux positif hors
   de la bande SFD, aucun faux négatif dedans. Aucun patient à DFG non renseigné ne le déclenche.
   La forme normale disjonctive est correcte, les bornes aussi (`DFG < 30` couvre bien « IRC sévère
   15-29 » **et** « terminale < 15 »), et l'encodage `< 7` traduit fidèlement la « limite inférieure de
   7 % » de l'Avis n° 12 tel que le red-team l'a transcrit.
4. **La correction d'attribution est fondée.** Relu dans `redteam-seuils-renaux.md:135-158` : la seule
   phrase de la KDIGO 2022 reliant les sulfamides au DFG est qualitative, sa référence 349 est une revue,
   et sa Figure 23 ne chiffre que metformine et iSGLT2. La SFD, elle, met le chiffre et la
   contre-indication dans la même phrase, sur deux éditions. Le nœud dit désormais « citation », c'est
   juste (aux réserves MOYENNE-2 près).
5. **Les trois études PK existent et sont décrites exactement** (sauf MOYENNE-6). J'ai résolu les trois
   PMID : revue, année, volume, pages, effectifs concordants. Hasslacher 2003 (PMID 12610054, *Diabetes
   Care* 2003;26(3):886-91, n = 281) : **p = 0,074 sous répaglinide contre p = 0,007 en run-in — exact**,
   et la réserve « bornes de clairance non publiées » est justifiée (le résumé n'en donne aucune).
   Marbury 2000 (PMID 10668848) : le bras hémodialysé est bien « **two single doses** […] separated by a
   7- to 14-day washout period », la phrase « Hemodialysis did not significantly affect repaglinide
   clearance » est exacte, et la phrase omise par la collecte — « the elimination rate constant in the
   group with severe renal impairment **decreased after 1 week of treatment** » — est bien dans le
   résumé. **La correction du red-team était juste et le nœud la porte fidèlement** (`:1417`, `:1521-1533`).
6. **26 options** (**[moteur]**, décompte réel). **L'invariant I8-c tient** : les 8 options en
   `modere`/`eleve` sont exactement les 8 qui portent un `references`.
7. **Les paliers metformine sont cohérents** sur les quatre canaux : condition de l'option (`:385`),
   les trois alertes (`:1142`, `:1147`, `:1151`), `avantages` (`:399`) et `reco_officielle` (`:1473-1474`).
8. **L'exclusion `fragilite` est posée sur une option d'AJOUT uniquement.** Les options qui réduisent ou
   arrêtent le glinide et le sulfamide restent ouvertes : « arrêter un traitement est une OPTION, jamais
   une `exclusion` » est respecté. Le raisonnement du changelog sur le glinide (visé par la même phrase
   de la SFD, mais sans option d'ajout dans ce nœud) est exact — vérifié option par option.
9. **La parité `terrain_cible_assouplie` avec le nœud `insuline` est réelle** (`insuline.yaml:111`
   ≡ `prescription.yaml:225`), à la réserve d'écriture B-9 près.
10. **Les 26 options ont chacune au moins une vignette.** Le déficit de couverture est dans les
    **branches** et dans les **alertes** (8 alertes de nœud couvertes sur 18), pas dans les options.
11. **Aucune source fabriquée.** Aucun PMID inventé, aucun DOI faux, aucune citation forgée dans le
    périmètre audité — malgré l'historique du dépôt sur ce point.

---

## CE QUE JE N'AI PAS PU VÉRIFIER

| Point | Motif |
|---|---|
| Le PDF de la prise de position **SFD 2025** lui-même (Avis n° 12, n° 12 bis, Tableau I note 6) | Je ne l'ai pas téléchargé. Ma confirmation des verbatims repose sur `redteam-seuils-renaux.md`, qui décrit une ré-extraction indépendante (`pdftotext`) et dont j'ai vérifié la cohérence interne. J'ai en revanche vérifié la **fidélité du nœud à ce rapport**, ce qui est le maillon que j'étais chargé d'auditer. |
| **Sitagliptine 25 mg commercialisée en France ?** | Pas d'accès exploitable à la BDPM. Le red-team a explicitement laissé le point au référent (§7.6) ; le référent a tranché (`:1573`). Le fait lui-même reste hors de ma portée — je ne le conteste ni ne le confirme. |
| **Texte intégral de Hasslacher 2003** (bornes de clairance, présence de dialysés) | `diabetesjournals.org` inaccessible ; le résumé ne donne aucune borne. Même échec que le red-team. Sans conséquence : le nœud ne s'en sert que pour le signal, ce qui est la bonne portée. |
| **Profil CV de la vildagliptine** (pertinence en IRC sévère, population à forte prévalence d'IC) | Non recherché, donc **non affirmé**. Je signale seulement que le nœud a fait de la « sécurité CV démontrée » son critère de choix de molécule et ne l'applique pas à celle qu'il nomme sous DFG 30 (MOYENNE-3). |
| **Provenance des attendus des vignettes `P-38`…`P-58` et `R6-1`…`R6-8`** | Les ids `P-38` et suivants ne figurent dans aucun document versionné (`vignettes-existantes-a-valider.md` s'arrête à `P-37`) ; le commentaire les dit validés par « le tableau du mandat », non commité. Pour `R6-*`, la recette référent (`VALIDATION.md:466-479`) ne formule que **3** attentes ; les 5 autres sont d'auteur agent. Je ne peux donc pas trancher, vignette par vignette, ce qui vient du référent et ce qui vient du moteur — c'était pourtant le cœur de la question E. |
| **Prescrire** (`sources.synthese_critique`) | Sous droit d'auteur et sous paywall. Non consulté, aucune reproduction. |
| **NNT ~18 des AR GLP-1** : d'où il vient | J'ai établi qu'aucune référence déclarée par l'option ne le porte et que LEADER publie 66 à 3 ans. Je n'ai pas identifié la source d'origine du 18 — il peut s'agir d'une transcription erronée ou d'un calcul sur un horizon différent. Signalé, pas déclaré faux. |

---

## SOURCES

**Sources primaires ouvertes par moi**

| Source | Ce que j'y ai lu | URL |
|---|---|---|
| Schumacher 2001, PMID 11417447 | *Eur J Clin Pharmacol* 2001;57(2):147-52 ; n = 34 (12/12/10) ; 2 mg J1 puis préprandial J2-J4 + J5 ; « no significant differences » en léger-modéré ; « longer half-life after multiple dosing » en sévère ; **aucun rapport d'ASC, aucune borne de clairance** | https://pubmed.ncbi.nlm.nih.gov/11417447/ |
| Marbury 2000, PMID 10668848 | *Clin Pharmacol Ther* 2000 ; bras hémodialyse n = 6 en **deux doses uniques** avec washout 7-14 j ; « Hemodialysis did not significantly affect repaglinide clearance » ; « significantly higher AUC » en sévère (non chiffré) ; « elimination rate constant […] decreased after 1 week of treatment » | https://pubmed.ncbi.nlm.nih.gov/10668848/ |
| Hasslacher 2003, PMID 12610054 | *Diabetes Care* 2003;26(3):886-91 ; n = 281 (151 + 130) ; p = 0,007 (run-in), **p = 0,074 (sous répaglinide)**, p = 0,032 (dose finale plus basse en sévère/extrême) ; **bornes de clairance absentes du résumé** | https://pubmed.ncbi.nlm.nih.gov/12610054/ |
| LEADER (Marso 2016) — chiffres primaires | 608/4 668 (13,0 %) vs 694/4 672 (14,9 %), HR 0,87 (0,78-0,97) ; **NNT publié = 66 à 3 ans** pour le MACE, 98 pour la mortalité toutes causes ; suivi médian 3,8 ans | https://pmc.ncbi.nlm.nih.gov/articles/PMC5118235/ |

**Dépôt — lus, non modifiés**

- `content/noeuds/diabete-type-2/prescription.yaml` (2 082 l., intégral)
- `content/noeuds/diabete-type-2/prescription.argumentaire.md` (312 l.)
- `content/noeuds/diabete-type-2/insuline.yaml` (`:86-111`, `:746`, `:1321`)
- `src/features/decision/engine/conditions.ts` · `deriveCritere.ts` · `evaluateNode.ts`
- `src/features/decision/lib/formLayout.ts` (`:44-52`)
- `src/features/decision/engine/evaluateNode.prescription.test.ts` (930 l., 73 tests)
- `src/features/decision/engine/banc/` (`profils.ts`, `invariants.test.ts`, `caracterisation.test.ts`, `invariants-contenu.test.ts`, `__snapshots__/`)
- `docs/decision/validation/chantier-2026-07-27/redteam-seuils-renaux.md` (intégral)
- `docs/decision/validation/chantier-2026-07-27/preuve-seuils-renaux-su-glinide.md` (référencé)
- `docs/decision/validation/chantier-2026-07-26/rcp-glinide-insuffisance-renale.md` (référencé)
- `docs/decision/GRAMMAIRE-NOEUD.md` · `schema/noeud.schema.json` · `CLAUDE.md`

**Preuves d'exécution** — harnais Vitest temporaire (supprimé), important le nœud réel et le moteur de
production. Les résultats bruts sont reproductibles en rejouant les six expériences décrites :
équivalence booléenne (1 152 cas), équivalence ternaire (16 384 cas), balayage du dérivé
`hba1c_sous_cible` (840 cas), formulaire vierge + contrefactuel sans garde, cartographie du
sur-blocage fragile (2 160 profils), et rendu de la vue de décision sur les trois profils-témoins.
