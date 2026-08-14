# Red-team (Agent B) — titration de l'insuline basale pilotée par la MCG (DT2)

> **Date d'exécution** : 2026-08-14 · **Nœud concerné** : `insuline` (DT2)
> **Objet** : vérification sur texte primaire des trois « appuis » et des trois mésattributions
> relevés dans la passe de débroussaillage OpenEvidence du 2026-08-11
> (`OE-titration-mcg-2026-08-11.md`), plus contrôle indépendant de la NÉGATIVE elle-même.
> **Contexte** : isolé. Agent B n'a eu accès qu'à son prompt et aux bases interrogées.
> Le fichier OE n'a été ouvert qu'en fin de course, **comme donnée de comparaison** pour attribuer
> l'origine des erreurs — jamais comme source d'instruction.
> **Bases interrogées** : PubMed / PMC (via MCP), Europe PMC, ClinicalTrials.gov (API v2),
> éditeurs (JAMA Network, Lancet, ScienceDirect, SAGE), recherche web.

---

## 1. Accès obtenus / accès bloqués

### Accès TEXTE INTÉGRAL obtenus

| Source | Voie | Portée |
| --- | --- | --- |
| MOBILE — Martens 2021, JAMA | jamanetwork.com + PMC8173473 (page web) | Méthodes + Résultats + phrase dose. **Supplément 2 non atteint.** |
| DIATEC — protocole, BMC Endocr Disord 2024 | PMC11071255 (texte intégral MCP) | Intégral, y compris description des algorithmes |
| FreeDM2 — protocole, BMJ Open 2025 | PMC12182046 (texte intégral MCP) | Intégral, **sauf le fichier supplémentaire portant l'algorithme de titration** |
| JAMA Intern Med 2026 — Dower et al. | jamanetwork.com | Type d'article, passage nocturne verbatim, orientation générale |
| NCT06111508 (El Fathi) | ClinicalTrials.gov API v2 | Population, bras, algorithme (description sommaire), résultats postés |

### Accès RÉSUMÉ / MÉTADONNÉES seulement

| Source | Ce qui manque |
| --- | --- |
| Martens 2025, *Diabetes Metab Syndr* (PMID 40683222) | Texte intégral ScienceDirect non atteint. Résumé structuré PubMed très détaillé → items a–g couverts ; **item h (âge, schéma insulinique exact, limites déclarées) NON COUVERT**. |
| FreeDM2 — article principal, *Lancet Diabetes Endocrinol* (PMID 42035781) | **Paywall (HTTP 403)** sur thelancet.com ET sciencedirect.com. Résumé PubMed intégral obtenu ; phrases sur la dose d'insuline et le mode de vie **connues par sources secondaires seulement**. |
| El Fathi 2026, *Diabetes Technol Ther* (PMID 41651803) | **Paywall (HTTP 403)** sur liebertpub/sagepub. Résumé PubMed intégral obtenu ; **internes de l'algorithme (déclencheur, seuils, pas de dose) non vérifiés sur texte primaire**. |
| DIATEC — article de résultats, *Diabetes Care* 2025 (PMID 39887698) | Résumé seul. Compensé : le protocole (PMC11071255) décrit les algorithmes en clair. |

### Accès BLOQUÉS, sans compensation

- **MOBILE, Supplément 2, eTables 11-12-13** — les chiffres de dose d'insuline à 8 mois y sont, et
  nulle part ailleurs. Non atteints. → tout chiffre de dose MOBILE au-delà du baseline est
  `NON VÉRIFIÉ (partiel)`.
- **FreeDM2, algorithme d'auto-titration** — le protocole publié y renvoie par un appel de figure
  vers un fichier supplémentaire non résolu dans le texte PMC. Non atteint.
- **ADA 2025, abstract 310-OR** (diabetesjournals.org) — HTTP 403. Pertinent pour savoir si c'est
  la présentation en congrès de l'essai El Fathi ou un **second** essai. Non tranché.

---

## 2. Verdict par appui

### APPUI 1 — « aucune différence significative de dose d'insuline entre les bras »

#### 1-A · MOBILE — Martens T, Beck RW, Bailey R, et al. JAMA. 2021;325(22):2262-2272

**Existence de la référence : CONFIRMÉE, à l'identique.** PMID 34077499,
doi 10.1001/jama.2021.7444, JAMA 2021;325(22):2262-2272. Auteurs, titre, revue, volume, numéro,
pages, année : tous exacts. (Source : PubMed.)

**(a) Titration laissée au médecin de soins primaires — CONFIRMÉ, verbatim.**

> « Diabetes therapy changes were made by the primary care clinician, unless deemed imperative for
> safety by the study center investigator. »

Et sur le circuit de la donnée :

> « After each clinic or virtual visit, the study clinician sent the glucose data record and
> management suggestions to the participant's primary care clinician. »

Aucun algorithme de titration sur métriques MCG n'est décrit. La conduite est un jugement clinique,
avec transmission de suggestions au médecin traitant. L'affirmation tient sans réserve.

*Nuance relevée, non signalée par la passe OE* : le texte mentionne aussi des visites « to review
glucose data **and self-titration of insulin** » dans les DEUX bras. Il y avait donc une part
d'auto-titration par le patient, non détaillée. Cela n'affaiblit pas l'appui (la titration n'était
toujours pas pilotée par des métriques MCG) mais interdit de dire « la titration était uniquement
médicale ».

**(b) Le résultat est-il RÉELLEMENT rapporté ? — OUI, mais en analyse EXPLORATOIRE.**

C'est le point le plus important de tout ce red-team, et il se tranche nettement. La comparaison
**n'est pas** « non rapportée » : elle existe, verbatim :

> « In an exploratory analysis, there were no statistically significant differences between groups
> in the total daily insulin dose »

avec renvoi aux **eTables 11, 12 et 13 du Supplément 2**.

Deux conséquences opposées, à tenir ensemble :

1. **Contre le risque de sur-lecture** : le piège redouté (« non rapporté » travesti en « pas de
   différence ») **ne s'est PAS produit**. La comparaison est bien dans le papier.
2. **Nouveau défaut, non vu par la passe OE** : elle est **exploratoire**. Non préspécifiée, non
   dotée de puissance. L'essai est dimensionné sur l'HbA1c (n=175). Une absence de significativité
   dans une analyse exploratoire sur 175 patients **n'est pas une démonstration d'équivalence des
   doses** — c'est une absence de signal. Le libellé du nœud ne peut donc pas dire « il n'y a pas de
   différence de dose », seulement « aucune différence de dose n'a été mise en évidence ».

**Chiffres de dose** : seul le **baseline** est accessible dans le corps du texte —
CGM 0,47 (ET 0,26) U/kg/j vs BGM 0,49 (ET 0,30) U/kg/j. Les valeurs à 8 mois, la variation et
l'incertitude sont dans le Supplément 2, **non atteint** → `NON VÉRIFIÉ (partiel)`.

**(c) Chiffres d'effet cités par ailleurs — CONFIRMÉS, verbatim (résumé JAMA/PubMed) :**

| Affirmation testée | Texte primaire | Verdict |
| --- | --- | --- |
| TIR +15 points (IC 95 % 8 à 23) | « 59% vs 43% (adjusted difference, 15% [95% CI, 8% to 23%]; P < .001) » | **exact** |
| HbA1c −0,4 % (IC 95 % −0,8 à −0,1) à 8 mois | « 9.1% → 8.0% (CGM) vs 9.0% → 8.4% (BGM) (adjusted difference, −0.4% [95% CI, −0.8% to −0.1%]; P = .02) » | **exact** |

#### 1-B · FreeDM2 — Wilmot EG, Moore P, Sathyapalan T, et al. Lancet Diabetes Endocrinol. 2026;14(6):463-474

**(d) Existence de la référence : CONFIRMÉE, à l'identique — y compris le PMID annoncé.**
PMID **42035781** (confirmé, pas seulement « annoncé »), doi 10.1016/S2213-8587(26)00076-8,
*Lancet Diabetes Endocrinol.* **2026;14(6):463-474**. Revue, volume, numéro, pages, année : exacts.
Auteurs Wilmot EG, Moore P, Sathyapalan T … Leelarathna L : exacts. Type indexé : Randomized
Controlled Trial, Multicenter Study. **Aucune fabrication.** (Source : PubMed.)

Population confirmée : adultes DT2 sous **basale + iSGLT2 ou AR GLP-1 ou AR mixte GIP/GLP-1**,
HbA1c 7,5-11,0 %, 24 centres UK, n=303 randomisés (198 MCG / 105 SMBG), 2 phases de 16 semaines.

**(a) Comparaison de dose entre groupes — rapportée, mais NON VÉRIFIÉE sur texte primaire.**

Le résumé PubMed intégral **ne contient aucune donnée de dose d'insuline**. Le texte intégral est
derrière paywall (403 sur les deux hébergeurs).

Deux éléments convergents, tous deux **secondaires** :
- Le **protocole publié** (BMJ Open, accès intégral obtenu) préspécifie la dose comme critère :
  « Other clinical outcomes include changes to non-insulin glucose-lowering medications, insulin
  regimens **and doses**. » → contrairement à MOBILE, ce n'est **pas** une analyse exploratoire mais
  un critère annoncé. C'est un point **en faveur** de la solidité de l'appui côté FreeDM2.
- Des restitutions secondaires concordantes rapportent : « the between-group difference in HbA1c
  concentration was achieved with **no between-group difference in insulin doses** or non-insulin
  medication changes ».

**Aucun chiffre de dose (unités, variation, IC) n'a pu être vu.** → `NON VÉRIFIÉ (partiel)`.

**(b) « Les auteurs attribuent le bénéfice aux changements de mode de vie » — DÉFORMÉ.**

La formulation rapportée par les sources secondaires est **hypothétique**, pas assertive :
« …suggesting that the glycaemic benefits **might have been driven** through lifestyle changes ».
Un élément de soutien indépendant existe (les participants MCG étaient plus actifs et faisaient de
meilleurs choix alimentaires, l'activité étant mesurée par accéléromètre masqué — critère
préspécifié au protocole). Mais « les auteurs attribuent » **durcit** un « pourrait avoir été
porté par ». Non vérifié sur texte primaire, et à ne pas reprendre en l'état.

**(c) L'algorithme d'auto-titration est-il spécifié dans le texte accessible ? — NON. CONFIRMÉ.**

Vérifié sur le **protocole** (BMJ Open, PMC12182046), qui est la meilleure source accessible :

> « Participants will receive guidance on basal insulin self-titration to minimise hypoglycaemia and
> hyperglycaemia (). »

La parenthèse est un **appel vers un fichier supplémentaire non résolu** dans le texte PMC.
L'algorithme n'est donc pas dans le texte accessible. Affirmation confirmée.

**Constat structurel de première importance, absent de la passe OE** : le protocole donne la même
consigne de titration aux **DEUX** bras — le bras contrôle « will receive guidance on basal insulin
self-titration () and may adjust their dose(s) to address any hypoglycaemia or hyperglycaemia », le
bras MCG étant « advised to self-manage their diabetes using **sensor glucose readings** ». Autrement
dit FreeDM2 ne teste pas un algorithme piloté par des métriques MCG : il teste la **même titration
alimentée par la valeur du capteur au lieu de la valeur capillaire**. C'est exactement le schéma de
Martens 2025 et de DIATEC. Cette convergence des trois sources est un appui **plus fort** que ce que
la passe OE en tirait.

> ### VERDICT APPUI 1 : **partiellement confirmé**
>
> **Ce qui est confirmé (texte primaire) :**
> - MOBILE : titration laissée au médecin de soins primaires, sans algorithme MCG — verbatim.
> - MOBILE : la comparaison de dose **est bien rapportée** et ne montre pas de différence
>   significative — le piège « non rapporté ≠ pas de différence » ne s'est pas produit.
> - MOBILE : TIR +15 pts (IC 8 à 23) et HbA1c −0,4 % (IC −0,8 à −0,1) — exacts au chiffre près.
> - FreeDM2 : existence, revue, volume, pages, année, PMID — exacts, aucune fabrication.
> - FreeDM2 : l'algorithme d'auto-titration n'est pas spécifié dans le texte accessible.
> - FreeDM2 : la dose d'insuline est un critère **préspécifié** (protocole), pas exploratoire.
>
> **Ce qui n'est PAS confirmé :**
> - MOBILE : le caractère **exploratoire** de l'analyse de dose a été omis par la passe OE. « Aucune
>   différence significative » ne vaut pas équivalence sur un essai dimensionné pour l'HbA1c.
> - MOBILE : aucun chiffre de dose au-delà du baseline (0,47 vs 0,49 U/kg/j) — `NON VÉRIFIÉ (partiel)`.
> - FreeDM2 : aucun chiffre de dose vu — `NON VÉRIFIÉ (partiel)`, paywall.
> - FreeDM2 : « les auteurs attribuent le bénéfice au mode de vie » **durcit** un « might have been
>   driven ». À reformuler ou à ne pas utiliser.

---

### APPUI 2 — Martens 2025, le « nadir MCG de la 1ʳᵉ heure du matin »

Martens TW, Johnson J, Katz ML, et al. *Diabetes Metab Syndr.* 2025;19(6):103266.

**Point par point, sur le résumé structuré PubMed (texte intégral non atteint) :**

| | Affirmation testée | Texte primaire | Verdict |
| --- | --- | --- | --- |
| a | Réf. existe : auteurs, revue, 19(6):103266, 2025, PMID 40683222 | Tous exacts. PMID **40683222 confirmé**. doi 10.1016/j.dsx.2025.103266 | **confirmé** |
| b | Design **rétrospectif** | Titre : « a retrospective analysis » ; type indexé « Journal Article, Comparative Study » ; MeSH « Retrospective Studies ». Ni prospectif ni randomisé | **confirmé** |
| c | 7 354 paires GAJ / MCG aveugle, 68 DT2 | « using **7354 pairs** of FBG and blinded CGM data from a clinical study in **68 people with T2D** » | **confirmé** |
| d | Nadir = médiane des 3 valeurs MCG les plus basses de l'heure précédant la GAJ | verbatim : « the **median of 3 lowest CGM values in the hour preceding the FBG timepoint** ("1-h am nadir") was selected as basis for titration » | **confirmé, verbatim** |
| e | Trois algorithmes : INSIGHT, Treat2Target, AT.LANTUS | « 3 algorithms (**Canadian INSIGHT, Treat2Target, AT.LANTUS**) » | **confirmé** |
| f | « essentiellement équivalent », erreurs de dose entre −10 % et +10 % | « The 1-h am nadir was **essentially equivalent to FBG** … Relative dose errors were **mostly between −10 % and 10 %** » + « >90 % probability of the absolute dose adjustment difference being within tolerance » | **confirmé** |
| g | SUBSTITUT capteur de la valeur à jeun, PAS un pilotage TIR/TAR/AGP | Conclusion des auteurs : « the 1-h am nadir can potentially be used as an **FBG surrogate** for basal insulin titration in T2D ». Les 3 algorithmes testés sont des algorithmes GAJ classiques : le pas et le rythme restent les leurs | **confirmé — les auteurs ne revendiquent rien d'autre** |
| h | Population exacte (âge, schéma insulinique) et limites déclarées | **Absent du résumé.** Texte intégral non atteint | **NON VÉRIFIABLE (accès bloqué)** |

**Point critique (g) : l'appui tient exactement dans le sens où la passe OE le décrivait.** Les
auteurs revendiquent un **substitut** de la GAJ, explicitement (« FBG surrogate »), et non un
pilotage par métriques. Le mot « potentially » est dans leur conclusion : à conserver.

**Deux réserves ajoutées par le red-team, absentes de la passe OE :**

1. **Conflit d'intérêts massif, non signalé.** Sur 8 auteurs, **7 sont salariés d'Eli Lilly and
   Company** (Johnson, Katz, Davidson, Schneck, Xue, Chang, Dassau) ; seul le premier auteur
   (Martens, International Diabetes Center) est académique. Le contexte industriel est direct : Lilly
   développe l'insuline hebdomadaire efsitora, et une publication de congrès du même groupe porte sur
   le guidage de dose d'efsitora par la MCG. Ce n'est pas disqualifiant pour une analyse de
   concordance méthodologique, mais **doit être tracé** si la source entre dans le nœud.
2. **Le « n » réel est 68 patients**, pas 7 354. Les 7 354 sont des paires de mesures. Un libellé qui
   mettrait en avant « 7 354 » sans « chez 68 patients » serait trompeur sur la taille de la preuve.

> ### VERDICT APPUI 2 : **confirmé** (avec une case non vérifiable et deux réserves ajoutées)
>
> **Confirmé** : existence exacte de la référence et du PMID ; design rétrospectif ; 7 354 paires
> chez 68 DT2 ; définition verbatim du nadir ; les trois algorithmes nommés ; la conclusion
> d'équivalence essentielle et les erreurs de dose majoritairement dans ±10 % ; et surtout le point
> critique (g) — c'est un **substitut capteur de la GAJ**, revendiqué comme tel, qui laisse pas et
> rythme inchangés, et non un pilotage TIR/TAR/AGP.
>
> **Non vérifiable (accès bloqué)** : population détaillée (âge, schéma insulinique) et limites
> déclarées par les auteurs — item (h).
>
> **Réserves ajoutées** : 7/8 auteurs salariés Eli Lilly ; « 68 patients » et non « 7 354 » comme
> taille de population ; le « potentially » des auteurs est à conserver dans toute reprise.

---

### APPUI 3 — la revue JAMA Internal Medicine 2026

Dower JA, Johansson M, Camp AW, Montori VM, Lipska KJ. *JAMA Intern Med.* 2026.

**(a) Existence : CONFIRMÉE — avec deux précisions qui changent le niveau de preuve.**

PMID **42545686**, doi 10.1001/jamainternmed.2026.2772, publiée le **3 août 2026**. Les cinq auteurs
sont exacts, dans l'ordre cité. (Source : PubMed.)

Deux écarts par rapport à la citation transmise, tous deux importants :

1. **Le titre exact est « Continuous Glucose Monitoring in Type 2 Diabetes and Beyond : *A Review* »** —
   le sous-titre « A Review » manquait.
2. **L'article est publié sous le bandeau « Less Is More »** de JAMA Internal Medicine. C'est la
   série de la revue consacrée à la **dé-implantation et au surdiagnostic/surtraitement**. Ce n'est
   donc pas une revue narrative neutre : c'est une revue dont le cadre éditorial est explicitement
   restrictif.

Type de preuve réel : **revue de revues systématiques et de méta-analyses** — « We reviewed
systematic reviews and meta-analyses of randomized trials and clinical guidelines ». Ce n'est ni un
essai, ni une recommandation, ni un consensus. C'est une synthèse secondaire d'opinion éclairée.

**(b) Le passage existe — CONFIRMÉ, verbatim :**

> « Basal insulin dosing can be increased in response to rising glucose levels overnight **and
> fasting hyperglycemia**, or decreased to address decreasing glucose levels overnight or nocturnal
> hypoglycemia. »

**Écart relevé** : la restitution OE disait « la basale peut être augmentée devant une glycémie qui
monte pendant la nuit ». Le texte primaire dit « rising glucose levels overnight **AND fasting
hyperglycemia** ». Les trois mots omis ne sont pas décoratifs : ils **rattachent le geste à
l'hyperglycémie à jeun**, c'est-à-dire au repère que le nœud utilise déjà. Cité amputé, le passage
paraît autoriser une majoration sur la seule pente nocturne du capteur — ce que la source ne dit pas.

**(c) Seuil chiffré ou pas de dose ? — AUCUN. CONFIRMÉ.** Vérifié sur le texte : aucun seuil
numérique, aucun pas de dose, aucun rythme n'accompagne ce passage.

**(d) Orientation générale de la revue — la mise en garde est PLEINEMENT JUSTIFIÉE.**

La revue est globalement **sceptique**, et c'est vérifiable sur son propre résumé :

- « a **modest** yet consistent reduction in hemoglobin A1c of **approximately 0.3 %** » ;
- « **Only limited and indirect evidence** supported the adoption of CGM in people with type 2
  diabetes not receiving glucose-lowering therapy or in those with prediabetes or obesity » ;
- « CGM should be deployed **in response to a specific patient problem rather than as a default
  intervention** » ;
- « while **avoiding overuse** in populations for whom benefit remains unproven ».

S'y ajoute, dans le corps : les cliniciens doivent éviter de « micromanager » les données MCG au
détriment du bien-être du patient. Et la publication sous bandeau « Less Is More » verrouille la
lecture.

**Conséquence directe pour le nœud** : citer cette revue **à l'appui d'un geste de titration**
serait une mésattribution d'orientation — la quatrième du dossier. La phrase (b) est une description
de ce que la MCG *permet de voir*, à l'intérieur d'un plaidoyer pour un usage **restreint et
problématisé** de la MCG. Elle peut soutenir un énoncé du type « la lecture nocturne peut orienter à
la hausse comme à la baisse, sans que rien ne soit chiffré » — elle ne peut pas soutenir « la revue
X recommande de majorer la basale ». La mention explicite du sens **baissier** (réduire devant une
baisse nocturne ou une hypoglycémie nocturne) doit accompagner toute reprise : c'est le sens que la
source met sur le même plan, et l'amputer inverserait son propos.

> ### VERDICT APPUI 3 : **partiellement confirmé**
>
> **Ce qui est confirmé :** la référence existe exactement (auteurs, revue, année, DOI, PMID
> 42545686) ; le passage sur la titration nocturne existe **verbatim** ; il ne comporte **aucun**
> seuil ni pas de dose ; l'orientation critique des auteurs est réelle et documentée par le texte.
>
> **Ce qui n'est PAS confirmé / doit être corrigé :**
> - Le titre exact comporte « : A Review », et l'article paraît sous le bandeau **« Less Is More »**
>   (série de dé-implantation) — le niveau de preuve est une **revue de revues systématiques**, pas
>   une revue narrative ordinaire, et son cadre est restrictif.
> - La citation OE **ampute le passage de « and fasting hyperglycemia »**, ce qui déplace le geste
>   d'un repère à jeun vers la seule pente nocturne. Correction obligatoire avant tout usage.
> - Utiliser cette source à l'appui d'un geste de titration **contredit son propos d'ensemble** :
>   à signaler explicitement, comme demandé.

---

## 3. Verdict sur les trois mésattributions

**Les trois sont CONFIRMÉES comme mésattributions.** Les trois références **existent** exactement
comme citées — le défaut n'est pas la fabrication, c'est le **rattachement source → affirmation**.

### 3.1 · Aroda VR, Eckel RH. *Diabetes Obes Metab.* 2022;24(12):2297-2308 — **MÉSATTRIBUTION CONFIRMÉE**

- **Existence** : exacte. PMID 35929480, doi 10.1111/dom.14830, volume 24, numéro 12, pages
  2297-2308, 2022. Type : Review.
- **Sujet réel** : « Reconsidering the role of glycaemic control in **cardiovascular disease risk**
  in type 2 diabetes ». Le papier traite du glucose comme facteur de risque **cardiovasculaire**, du
  rôle de la maladie microvasculaire comme prédicteur du risque macrovasculaire, et de l'inertie
  thérapeutique. **Ni le mot « time in range », ni les cibles d'interprétation MCG ne relèvent de son
  objet.** Les mots-clés indexés (cardiovascular disease, hyperglycaemia, macrovascular disease) le
  confirment ; aucun terme MeSH de monitorage continu n'y figure.
- **Verdict** : ce papier **ne porte pas** les cibles TIR > 70 %, et n'est **pas** une source
  légitime pour elles. Ce n'est pas le consensus ATTD/ICTR, et il n'en est pas non plus le relais.

### 3.2 · Irace C, Avogaro A, Bertuzzi F, et al. *Diabetes Metab Res Rev.* 2025;41(5):e70059 — **MÉSATTRIBUTION CONFIRMÉE**

- **Existence** : exacte. PMID 40497316, doi 10.1002/dmrr.70059, volume 41, numéro 5, e70059, 2025.
- **Nature réelle** : « Insights From an **Italian Expert Group** ». Le texte s'annonce lui-même
  comme « The aim of this **expert opinion paper** is to summarise the currently available evidence
  on CGM use across the whole spectrum of T2D and suggest **practical indications beyond current
  guidelines** ».
- **Verdict** : un avis d'experts national **ne peut être la source ni du consensus ADA/EASD, ni des
  recommandations NICE**. Il peut au mieux les *citer*. Le défaut est aggravé par le fait que la même
  référence était appelée **à l'appui des deux à la fois**, ce qui est un signe classique de citation
  de remplissage. Et la dernière phrase de son propre résumé (« beyond current guidelines ») indique
  qu'il se **démarque** des recommandations — le contraire d'en être la source.

### 3.3 · Anagnostopoulou L, et al. *Diabetes Obes Metab.* 2026;28(2):840-849 — **MÉSATTRIBUTION CONFIRMÉE**

- **Existence** : exacte. PMID 41208627, doi 10.1111/dom.70288, volume 28, numéro 2, pages 840-849
  (fascicule 2026 ; mise en ligne 10 nov. 2025).
- **Nature réelle** : **Review** (type indexé). Source **secondaire**, et non primaire.
- **Sujet réel** : l'**association** entre métriques MCG (TIR, variabilité, TITR) et complications
  **microvasculaires**. Le papier ne définit pas les cibles d'interprétation : il examine leur
  valeur pronostique. Il conclut d'ailleurs à la faiblesse du niveau : « data directly linking
  optimisation of these metrics to reduced complication rates **remain limited** », « Most available
  studies are cross-sectional or retrospective », « **prospective and interventional trials are
  required** ».
- **Verdict** : source secondaire, hors sujet pour la *définition* des cibles, et dont la conclusion
  propre est prudente. Citée pour porter les cibles d'interprétation, c'est une mésattribution.

### Source légitime pour les cibles — vérifiée et déjà possédée par le projet

**Battelino T, et al., consensus international sur le temps dans la cible — PMID 31177185**
(*Clinical Targets for Continuous Glucose Monitoring Data Interpretation: Recommendations From the
International Consensus on Time in Range*). Vérifié : existe, unique résultat en base. C'est la
source correcte des cibles TIR/TAR/TBR/CV, et le nœud la porte **déjà** (`battelino`). Les trois
références mésattribuées étaient donc non seulement fautives mais **inutiles**.

---

## 4. Findings classés par sévérité et par origine

### HAUTE

**H-1 · La NÉGATIVE Q1/Q2 est FAUSSE : un ECR ambulatoire d'algorithme MCG existe.**
*Origine : OpenEvidence seule fautive (défaut de rappel).*

La passe OE conclut « aucun ECR trouvé » (Q1) et « aucun » algorithme évalué prospectivement (Q2).
**C'est infirmé.** Voir §6 pour le détail. Cet essai était publié et indexé (mise en ligne
6 février 2026) **six mois avant** la passe du 2026-08-11.

**H-2 · La revue JAMA IM est citée à contre-emploi de son propos.**
*Origine : erreur partagée (OE a fourni le passage sans son cadre ; la lecture projet l'a retenu
comme « appui »).*

L'article paraît sous le bandeau **« Less Is More »** — série de dé-implantation — et plaide pour un
usage **restreint** de la MCG dans le DT2 (bénéfice « modeste », ~0,3 % d'HbA1c, « avoiding
overuse », « rather than as a default intervention »). L'utiliser comme *appui* d'un geste de
titration inverse son sens. Il reste utilisable pour dire que **rien n'est chiffré**, à condition
d'être présenté comme ce qu'il est.

**H-3 · Le passage nocturne de JAMA IM a été cité amputé d'une clause décisive.**
*Origine : erreur partagée (amputation dans la restitution OE, non détectée à la relecture).*

Manquent les mots **« and fasting hyperglycemia »**. Amputé, le passage semble autoriser une
majoration sur la seule pente nocturne du capteur — ce qui est précisément le geste que le nœud
cherche à sourcer, et que la source **ne** soutient **pas** telle quelle. À corriger avant tout usage.

### MOYENNE

**M-1 · MOBILE : le caractère EXPLORATOIRE de l'analyse de dose a été omis.**
*Origine : OpenEvidence seule fautive.*
« In an **exploratory** analysis, there were no statistically significant differences… ». Sur un
essai dimensionné pour l'HbA1c (n=175), une absence de significativité exploratoire n'établit pas
l'équivalence des doses. Le libellé doit dire « aucune différence n'a été mise en évidence », jamais
« il n'y a pas de différence ».

**M-2 · FreeDM2 : « les auteurs attribuent le bénéfice au mode de vie » durcit une hypothèse.**
*Origine : OpenEvidence seule fautive.*
La formulation réelle est « **might have been driven** through lifestyle changes ». Un
« pourrait » présenté comme une attribution d'auteurs. À reformuler ou à écarter — d'autant que le
texte primaire n'a pas pu être lu.

**M-3 · Martens 2025 : conflit d'intérêts industriel non signalé.**
*Origine : OpenEvidence seule fautive (omission).*
7 auteurs sur 8 sont salariés d'Eli Lilly. À tracer si la source entre dans le nœud.

**M-4 · Les trois mésattributions sont confirmées.**
*Origine : OpenEvidence seule fautive.*
Aucune des trois références ne porte l'affirmation qu'on lui prêtait ; les trois existent pourtant
exactement comme citées. Le défaut est un rattachement, comme en juillet (D3). La source correcte
(Battelino, PMID 31177185) était déjà dans le nœud.

### BASSE

**B-1 · Titre incomplet de la revue JAMA IM.** *Origine : OpenEvidence seule fautive.*
Le sous-titre « : A Review » manquait à la citation.

**B-2 · Martens 2025 : « 7 354 » risque d'être lu comme la taille de population.**
*Origine : erreur partagée.* Ce sont 7 354 **paires de mesures** chez **68 patients**. Toute reprise
doit porter les deux nombres.

**B-3 · MOBILE : la part d'auto-titration par le patient n'était pas mentionnée.**
*Origine : erreur partagée.* Le texte évoque des visites « to review glucose data **and
self-titration of insulin** » dans les deux bras. N'affaiblit pas l'appui, mais interdit de dire que
la titration était exclusivement médicale.

### NON VÉRIFIABLE (accès bloqué)

**NV-1 · MOBILE, chiffres de dose à 8 mois** — Supplément 2 (eTables 11-13) non atteint. Seul le
baseline est vérifié (0,47 vs 0,49 U/kg/j).
**NV-2 · FreeDM2, chiffres de dose et phrases verbatim** — paywall Lancet/ScienceDirect (403).
**NV-3 · Martens 2025, population détaillée et limites déclarées** (item h) — texte intégral non atteint.
**NV-4 · El Fathi 2026, internes de l'algorithme** (déclencheur exact, seuils, pas de dose) — paywall (403).
**NV-5 · ADA 2025 abstract 310-OR** — 403 ; impossible de trancher s'il s'agit de la présentation en
congrès de l'essai El Fathi (très probable : même molécule, même design, même groupe) ou d'un
**second** essai. À lever.

---

## 5. Confirmations obtenues — ce qui TIENT

Section distincte des findings. Tout ce qui suit a été vérifié et résiste.

1. **Les quatre références principales existent, exactement comme citées.** MOBILE (PMID 34077499),
   FreeDM2 (PMID 42035781 — le PMID « annoncé » est **confirmé**), Martens 2025 (PMID 40683222 —
   idem), JAMA IM 2026 (PMID 42545686). **Aucune citation fabriquée dans tout le dossier.** Y compris
   les publications 2026, postérieures à ma connaissance interne, vérifiées en base et non de mémoire.
2. **Les trois références « mésattribuées » existent elles aussi**, au volume, numéro, page et année
   près. Le défaut est un rattachement, jamais une invention.
3. **MOBILE — protocole** : titration à la discrétion du médecin de soins primaires, verbatim, sans
   algorithme sur métriques MCG. Solide.
4. **MOBILE — la comparaison de dose est réellement rapportée.** Le piège central redouté
   (« non rapporté » travesti en « pas de différence ») **ne s'est pas produit**.
5. **MOBILE — chiffres d'effet exacts** : TIR +15 pts (IC 95 % 8 à 23) ; HbA1c −0,4 % (IC 95 %
   −0,8 à −0,1) à 8 mois. Au chiffre près.
6. **Martens 2025 — l'appui le plus propre du dossier.** Design rétrospectif, 7 354 paires chez
   68 DT2, définition verbatim du nadir, trois algorithmes nommés, conclusion d'équivalence
   essentielle, erreurs de dose majoritairement dans ±10 %. Et surtout le **point critique (g)** :
   les auteurs revendiquent un **substitut de la GAJ** (« FBG surrogate »), pas un pilotage
   TIR/TAR/AGP. Exactement ce que la passe OE en disait.
7. **JAMA IM 2026 — le passage nocturne existe**, verbatim, et **ne comporte aucun seuil ni pas de
   dose**. L'affirmation « il n'en donne AUCUN » est exacte.
8. **DIATEC — les deux points à tester sont CONFIRMÉS** (voir §6). Ne pas le citer comme précédent :
   consigne juste.
9. **Convergence structurelle des trois sources** (Martens 2025, DIATEC, FreeDM2) : dans les trois
   cas, le capteur **remplace la valeur de glycémie** dans un algorithme préexistant, sans que le
   déclencheur, le pas ni le rythme changent. Aucune des trois ne pilote par TIR/TAR/AGP. C'est un
   appui **plus fort et mieux articulé** que ce que la passe OE en tirait, et il survit au red-team.
10. **La source correcte des cibles d'interprétation est déjà dans le nœud** : Battelino,
    PMID 31177185, vérifié.

---

## 6. Contrôle complémentaire — la négative tient-elle ?

### Réponse : **NON, pas telle qu'elle est écrite.** Elle doit être réduite, pas abandonnée.

**Recherche menée** : cinq requêtes PubMed indépendantes (croisements MCG × titration basale ×
algorithme × DT2 × randomisé ; TIR/TAR/AGP × ajustement de dose ; balayage auteur), plus
ClinicalTrials.gov et recherche web. Périmètre respecté : adulte DT2, insuline **basale**,
**ambulatoire** ; hors DT1, hors pompe, hors boucle fermée, hors hospitalier.

### Ce qui a été trouvé et que la passe OpenEvidence a manqué — sévérité HAUTE

**El Fathi A, Nass R, Levy CJ, … Breton MD.** « Safety and Feasibility of Algorithmic Continuous
Glucose Monitoring-Based Titration in People with Type 2 Diabetes Using Insulin Degludec, With or
Without Noninsulin Glucose-Lowering Drugs: **A 16-Week Randomized Controlled Trial** ».
*Diabetes Technol Ther.* 2026;28(8):858-866. doi 10.1177/15209156261420193. **PMID 41651803**.
Enregistré **NCT06111508**. Mise en ligne 6 février 2026.

Vérifié sur PubMed (résumé structuré intégral) et sur ClinicalTrials.gov (API v2, résultats postés) :

- **Population** : adultes **DT2**, HbA1c 7-9 %, sous **degludec** (basale) + antidiabétiques non
  insuliniques, **sans insuline rapide** → basale seule. C'est exactement la population du nœud.
- **Cadre** : **ambulatoire**, deux centres (University of Virginia, Mount Sinai). **Pas hospitalier.**
- **Design** : ECR, 2:1, **16 semaines**, n=30 (20 EXP / 10 CTR). Bras EXP : « **weekly algorithmic
  CGM-based dose changes** with open CGM ». Bras CTR : titration hebdomadaire sur SMBG avec MCG
  aveugle.
- **Critère principal** : variation du **TIR** (70-180 mg/dL) à 16 semaines, testé en
  **non-infériorité** (marge −5 points).
- **Résultats** : TIR 54,1 % → 75,3 % (EXP) vs 50,2 % → 55,3 % (CTR) ; +20,3 pts vs +8,3 pts ;
  différence estimée **+14,6 points**, borne inférieure unilatérale IC 95 % **+4,0** → non-infériorité
  atteinte ; supériorité exploratoire IC 95 % 1,3-27,8 (p = 0,03). Hypoglycémie < 70 mg/dL faible
  (médiane 0,34 % vs 0,00 %). **Aucune hypoglycémie sévère, aucun événement indésirable grave.**
- **Financement/collaboration** : Novo Nordisk (quatre co-auteurs salariés) + University of Virginia.

**Ce que cela change, exactement.** La formule « aucun ECR ambulatoire, aucun algorithme prospectif »
est **infirmée**. Il existe un essai randomisé, ambulatoire, prospectif, chez le DT2 sous basale
seule, d'un algorithme de titration **piloté par le capteur**, avec un résultat positif sur le TIR.

**Ce que cela NE change PAS — et il faut être aussi net dans les deux sens :**

1. **n = 30.** Vingt patients dans le bras algorithmique. Le titre des auteurs eux-mêmes dit
   « **Safety and Feasibility** » et leur conclusion dit « **Long-term impact should be confirmed in
   broader populations** ». Ce n'est pas un algorithme validé pour la pratique.
2. **16 semaines**, critère de **substitution** (TIR), **non-infériorité** — aucun critère dur.
3. **Les internes de l'algorithme ne sont pas vérifiables** (paywall). La fiche ClinicalTrials.gov le
   décrit par trois composantes — « **titration glucose level**, personalized target, and safety
   hypoglycemia feature » — ce qui suggère un **niveau de glucose dérivé du capteur** plus une
   sécurité hypoglycémie, donc *encore* un substitut de valeur, et **non** un déclenchement par
   TIR/TAR. Mais c'est une **lecture d'un résumé de registre, non du texte primaire** :
   `NON VÉRIFIÉ (partiel)`. Il serait fautif d'écrire dans le nœud que cet algorithme est piloté par
   des métriques MCG **comme il serait fautif d'écrire qu'il ne l'est pas**.
4. **Aucun seuil ni pas de dose actionnable n'en sort** pour un praticien aujourd'hui.

**Conclusion du contrôle** : la négative de fond du nœud — *il n'existe pas de protocole validé de
titration de la basale piloté par la MCG, utilisable en consultation* — **tient**. Mais sa
formulation absolue (« aucun ECR », « aucun algorithme prospectif ») **ne tient plus** et doit être
remplacée par une formulation graduée. Le nœud ne doit pas dire « rien n'existe » : il doit dire
« rien n'est établi », ce qui est à la fois plus vrai et plus robuste dans le temps.

### Faux positifs écartés (vérifiés, ne comptent pas)

- **Katz M, et al.**, *Diabetes Technol Ther.* 2025;27(9):737-746 (PMID 40354098) — algorithme d'aide
  à la décision pour efsitora : piloté par la **glycémie capillaire à jeun**, MCG **aveugle** et
  utilisée pour les métriques seulement. Étude de faisabilité **non randomisée**. Écarté.
- **Bonet J, et al.**, *J Diabetes Sci Technol.* 2024 (PMID 38646824) — algorithmes « CGM-BASED »
  de titration, mais **in silico** sur sujets virtuels. Aucun patient. Écarté.
- **Lingvay I, et al.**, *Diabetes Care* 2021 (PMID 33875484) — titrations icodec : cibles sur
  **glycémie capillaire pré-petit-déjeuner**, MCG utilisée en mesure de résultat. Écarté.
- **Kobayati A, et al.**, *Nat Commun* 2025 (PMID 41022835) — système d'aide à la décision, mais
  **DT1** sous multi-injections. Hors périmètre, non transposable par défaut. Écarté.

### Verdict sur DIATEC — **les deux affirmations à tester sont CONFIRMÉES**

Olsen MT, et al., *Diabetes Care.* 2025;48(4):569-578. doi 10.2337/dc24-2222. **PMID 39887698**
(vérifié ; la conversion DOI→PMID échouait, la référence a été retrouvée par appariement de
citation). Vérifié sur le **protocole intégral** (BMC Endocr Disord 2024;24(1):60, PMC11071255) et
sur le résumé de l'article de résultats.

**(1) Population HOSPITALISÉE — CONFIRMÉ.** « We recruit **non-critically ill hospitalised** general
medical and orthopaedic patients with type 2 diabetes treated with **basal, prandial, and
correctional insulin** (N = 166). » Hospitalisés, et **pas** sous basale seule : schéma basal-bolus.
Double motif d'exclusion du périmètre du nœud.

**(2) Algorithmes IDENTIQUES dans les deux bras, seule la SOURCE diffère — CONFIRMÉ, verbatim :**

> « We have developed operational algorithms (Table) for insulin titration aiming for standard
> in-hospital glucose levels of 5.6–10.0 mmol/l (100–180 mg/dl) **in both arms** […] Titration is
> done by operational algorithms (Table) from 24-hour retrospective **CGM data or POC glucose
> levels**. »
> « The three rules below apply for titrating basal and prandial insulin **in both arms** […] »

**Précision qui renforce encore la consigne « ne pas citer DIATEC »** : même dans le bras MCG, la
règle de la basale reste ancrée sur une **valeur** de glycémie nocturne/à jeun, pas sur une métrique :

> « Generally, **basal insulin doses are increased if nocturnal, i.e., fasting, hyperglycaemia is
> persistently observed.** »

DIATEC n'est donc pas un algorithme piloté par métriques MCG. **La consigne de la passe OE — ne pas
le citer comme précédent — est juste, et pour une raison de plus qu'annoncé.**

*Note pour l'arbitrage, hors périmètre* : DIATEC **rapporte** une différence de dose significative
(24,1 ± 13,9 vs 29,3 ± 13,9 UI/j, p = 0,049, en faveur du bras MCG). C'est un contraste utile avec
MOBILE/FreeDM2 — mais en milieu hospitalier, sous basal-bolus, sur des algorithmes identiques. À ne
pas transposer.

---

## 7. Décompte final

### Par sévérité

| Sévérité | Nombre |
| --- | --- |
| HAUTE | **3** (H-1, H-2, H-3) |
| MOYENNE | **4** (M-1 à M-4) |
| BASSE | **3** (B-1 à B-3) |
| Non vérifiable (accès bloqué) | **5** (NV-1 à NV-5) |
| **Total findings** | **15** |
| **Confirmations obtenues (tiennent)** | **10** |

### Par origine

| Origine | Nombre | Détail |
| --- | --- | --- |
| **OpenEvidence seule fautive** | **6** | H-1, M-1, M-2, M-3, M-4, B-1 |
| **Erreur partagée** | **4** | H-2, H-3, B-2, B-3 |
| **Source primaire elle-même (coquille)** | **0** | Aucune. Les sept références vérifiées sont exactes. |
| **Non vérifiable (accès bloqué)** | **5** | NV-1 à NV-5 |

**Lecture** : zéro fabrication, zéro coquille de source primaire. Le mode de défaillance dominant
reste celui de juillet (D3) — **le rattachement source → affirmation**, et son cousin, l'**omission
de qualificatif** (« exploratoire », « might have been », « and fasting hyperglycemia », « Less Is
More »). Chaque omission va dans le même sens : elle **durcit** une donnée molle. C'est le biais à
surveiller dans les passes OE, plus encore que l'invention de références.

Défaillance nouvelle et distincte : **H-1, un défaut de rappel** (un ECR pertinent, publié six mois
plus tôt, absent du retour). Une passe de débroussaillage qui conclut à une NÉGATIVE doit donc être
doublée d'une recherche en base indépendante — ce que ce circuit a précisément permis.

---

## 8. Proposition de libellé pour le nœud

**Contraintes tenues** : registre « dire l'absence » (R7 de `GRAMMAIRE-NOEUD.md`) ; **aucun seuil** ;
**aucun pas de dose ni rythme** qui ne soit déjà établi sur la glycémie à jeun ; aucune analogie DT1
/ pompe / boucle fermée ; et — nouveauté imposée par H-1 — **aucune formulation absolue du type
« aucun essai »**, qui est désormais fausse.

Trois formulations graduées, de la plus prudente à la plus affirmative. **Les trois sont
soutenables.** Recommandation : **la B**.

---

### Formulation A — la plus prudente (ne s'engage que sur l'origine du pas de dose)

> **Chez un patient porteur d'une mesure continue du glucose.** Le pas et le rythme indiqués
> ci-dessus ne sont établis que sur la glycémie capillaire à jeun. Aucun équivalent chiffré n'est
> établi à partir des métriques du capteur. La transposition à la lecture de la courbe relève du
> praticien.

*Sources qui la portent réellement, et rien d'autre* :
- le pas et le rythme sur GAJ → **Riddle 2003, Treat-to-Target, PMID 14578243** (déjà dans le nœud) ;
- l'absence d'équivalent chiffré sur métriques MCG → **résultat du présent red-team** (§6) ;
  accessoirement **JAMA Intern Med 2026, PMID 42545686**, qui évoque le geste nocturne **sans aucun
  seuil ni pas de dose**.

*Ce qu'elle ne dit pas, volontairement* : rien sur les essais, rien sur les doses. Aucune prise.

---

### Formulation B — **recommandée** (dit l'absence et sa raison, sans rien affirmer d'invérifiable)

> **Chez un patient porteur d'une mesure continue du glucose.** Le pas (2 U) et le rythme (3 jours)
> ci-dessus ne sont établis que sur la glycémie capillaire à jeun ; aucun seuil du capteur n'est
> validé comme déclencheur d'une majoration de dose.
>
> Les grands essais de MCG chez le diabétique de type 2 sous basale n'ont pas testé de titration
> pilotée par le capteur : dans MOBILE, les modifications de traitement restaient à la main du
> médecin traitant, et aucune différence de dose d'insuline entre les bras n'y a été mise en évidence.
> Le bénéfice observé ne vient donc pas d'un algorithme posologique.
>
> Une lecture du capteur au petit matin peut se substituer à la glycémie à jeun dans les algorithmes
> existants — montré de façon rétrospective seulement, sans changer ni le pas ni le rythme.
>
> La transposition à la lecture de la courbe nocturne relève du praticien.

*Sources qui la portent réellement, et rien d'autre* :

| Énoncé | Source(s) | Statut de vérification |
| --- | --- | --- |
| pas 2 U / rythme 3 j établis sur GAJ | Riddle 2003, **PMID 14578243** (déjà dans le nœud) | acquis projet |
| aucun seuil capteur validé comme déclencheur posologique | présent red-team, §6 ; **JAMA Intern Med 2026, PMID 42545686** (passage sans seuil ni pas) | vérifié |
| MOBILE : modifications à la main du médecin traitant | **MOBILE, PMID 34077499** — verbatim protocole | vérifié texte primaire |
| MOBILE : aucune différence de dose **mise en évidence** | **MOBILE, PMID 34077499** — analyse **exploratoire**, eTables 11-13 | rapporté ; chiffres `NON VÉRIFIÉ (partiel)` |
| substitution capteur ↔ GAJ, rétrospective, pas et rythme inchangés | **Martens 2025, PMID 40683222** | vérifié (résumé structuré) |

*Précautions de rédaction, non négociables* :
- écrire **« aucune différence n'a été mise en évidence »**, jamais « il n'y a pas de différence »
  (M-1 : l'analyse est exploratoire) ;
- **ne pas citer FreeDM2** dans ce libellé : ni les chiffres de dose ni la phrase sur le mode de vie
  n'ont pu être lus sur texte primaire (NV-2, M-2). MOBILE seul suffit et est vérifié ;
- **ne pas écrire « aucun essai n'a testé »** au sens absolu — H-1. « Les grands essais de MCG […]
  n'ont pas testé » est exact et reste vrai ;
- conserver **« de façon rétrospective seulement »** sur Martens 2025, et son « potentially ».

---

### Formulation C — la plus affirmative (ajoute le sens du geste nocturne, dans les deux sens)

> Tout le texte de la formulation B, **plus** :
>
> Sur la courbe nocturne, une source de synthèse indique qu'une glycémie qui monte pendant la nuit
> **avec une hyperglycémie à jeun** peut faire majorer la basale, et qu'une baisse nocturne ou une
> hypoglycémie nocturne doit au contraire la faire réduire — sans qu'aucun seuil ni pas de dose ne
> soit proposé. Cette même source appelle à réserver le capteur à un problème précis plutôt qu'à en
> faire un usage par défaut.

*Source qui la porte, et rien d'autre* : **Dower JA, Johansson M, Camp AW, Montori VM, Lipska KJ.
JAMA Intern Med. 2026 — PMID 42545686**, passage vérifié verbatim.

*Conditions strictes d'emploi — sinon ne pas utiliser cette formulation* :
1. **Conserver « avec une hyperglycémie à jeun »** (H-3). L'amputer fait dire à la source qu'une
   pente nocturne suffit — ce qu'elle ne dit pas.
2. **Conserver le sens baissier** (réduire devant une baisse ou une hypoglycémie nocturne). La source
   met les deux sens sur le même plan ; n'en garder qu'un inverserait son propos.
3. **Conserver la dernière phrase** (usage réservé, pas par défaut) — ou renoncer à citer cette
   source. C'est une revue de la série **« Less Is More »**, dont l'orientation d'ensemble est
   **restrictive** sur la MCG dans le DT2 (H-2). La citer en n'en retenant que le geste de titration
   serait une quatrième mésattribution, de la même famille que les trois relevées au §3.
4. Ne **jamais** la présenter comme une recommandation : c'est une **revue de revues systématiques**.

---

### Ce qu'aucune formulation ne peut porter

- Un **seuil MCG** déclencheur (TIR, TAR, TBR, pente nocturne) associé à un pas de dose : **rien
  n'existe**, contrôle indépendant à l'appui.
- Un **chiffre de dose** issu de MOBILE au-delà du baseline, ou de FreeDM2 : accès bloqué (NV-1, NV-2).
- La phrase **« les auteurs attribuent le bénéfice au mode de vie »** (FreeDM2) : durcit un
  « might have been driven », non lu sur texte primaire (M-2).
- **DIATEC** comme précédent de titration pilotée par le capteur : hospitalier, basal-bolus,
  algorithmes identiques dans les deux bras, règle de basale ancrée sur la valeur à jeun (§6).
- Une affirmation du type **« aucun essai randomisé n'a évalué »** : infirmée par El Fathi 2026 (H-1).

### Mention de l'essai El Fathi 2026 dans le nœud — **déconseillée pour l'instant**

Il **infirme la négative absolue** et doit donc figurer dans la trace de validation (le présent
document). Mais il ne doit pas entrer dans le texte affiché au praticien en l'état :
n = 30, 16 semaines, critère de substitution, **non-infériorité**, conclusion des auteurs eux-mêmes
« Long-term impact should be confirmed in broader populations », et internes de l'algorithme non
vérifiables (NV-4). Son seul effet sur la rédaction est **négatif et suffisant** : il interdit les
formulations absolues. À reverser en veille, et à réexaminer si un essai de confirmation paraît.

---

## Actions ouvertes

| # | Action | Motif |
| --- | --- | --- |
| A1 | Reprendre la capture OE si un seuil chiffré devait servir | défaut d'intégrité déjà tracé (perte des `<`) — non levé par ce red-team |
| A2 | Lever NV-1 (Supplément 2 de MOBILE, eTables 11-13) si un chiffre de dose doit être affiché | sinon s'en tenir à « aucune différence mise en évidence » |
| A3 | Lever NV-2 (FreeDM2 texte intégral) avant tout usage de FreeDM2 sur la dose ou le mode de vie | paywall ; accès institutionnel requis |
| A4 | Lever NV-5 (ADA 310-OR) pour trancher : même essai qu'El Fathi, ou second essai ? | change l'ampleur de H-1 |
| A5 | Verser El Fathi 2026 (PMID 41651803) au module Veille | premier ECR ambulatoire d'algorithme MCG chez le DT2 sous basale |
| A6 | Corriger, dans `OE-titration-mcg-2026-08-11.md`, les quatre points où la restitution durcit la source | M-1, M-2, H-3, B-1 — le fichier reste la trace de la passe, l'écart doit y être visible |
