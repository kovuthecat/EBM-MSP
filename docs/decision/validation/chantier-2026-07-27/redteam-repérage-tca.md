# Red-team — collecte de preuve « instrument de repérage des TCA » (nœud `rhd-alimentation`)

> **Cible auditée.** `docs/decision/validation/chantier-2026-07-27/preuve-repérage-tca.md`
> **Nœud concerné.** `content/noeuds/diabete-type-2/rhd-alimentation.yaml` (critère dérivé `verrou_tca`,
> ses 3 signes, l'entrée `incertitudes` n° 3).
> **Posture.** Réfutation, pas confirmation. Toute affirmation du rapport a été traitée comme douteuse
> jusqu'à ouverture de la source primaire par mes soins.
> **Écriture.** Lecture seule sur `content/**`, sur les tests et sur le rapport audité. Seul ce fichier
> a été créé. `git status` vérifié : aucune modification en attente sous `content/`.
> **Droit d'auteur.** Aucun item de questionnaire n'est reproduit ici.

---

## 1. Verdict global

**Le rapport est utilisable, mais pas tel quel : son appareil de citation est sain (aucun PMID faux,
tous les chiffres cités vérifiés à la source) et ses réserves d'honnêteté sont justes — en revanche
son tableau comparatif n'est pas exhaustif (il manque l'instrument français dont la population de
validation est la plus proche du nœud) et son chiffre le plus décisif (« VPP ≈ 21 %, 4 faux positifs
sur 5 ») n'est pas robuste, une seconde méta-analyse non recherchée donnant ≈ 38 %.**

Conséquence pratique : la **conclusion** (ne pas remplacer le verrou par un score) survit, mais **deux
de ses quatre justifications ne survivent pas** et doivent être réécrites avant que le référent ne
tranche sur cette base. Voir § 5.

---

## 2. Findings HAUTE

### H1 — Le tableau comparatif § 2, présenté comme la base de décision, omet le seul instrument français dont la population de validation ressemble à celle du nœud

**Citation contestée** — § 1 : « le **SCOFF-F** est un instrument de repérage des TCA validé en
français » ; § 3.1, titre : « **SCOFF-F — le seul candidat sérieux** » ; § 5.2-6 : « Ne rien encoder
de DEPS-R, mSCOFF, ESP ou EDE-Q. **Aucun ne franchit la barre (voir tableau § 2).** »

**Ce que dit réellement la littérature.** Il existe une **version française validée de la Binge Eating
Scale (BES)**, publiée dans une revue française indexée :

> Brunault P, Gaillard P, Ballon N, Couet C, Isnard P, Cook S, Delbachian I, Réveillère C, Courtois R.
> *Validation de la version française de la Binge Eating Scale : étude de sa structure factorielle, de
> sa consistance interne et de sa validité de construit en population clinique et non clinique.*
> **L'Encéphale 2016;42(5):426-433. PMID 27017318, DOI 10.1016/j.encep.2016.02.009.**

Et contrairement à la version française de l'EDE-Q (Carrard 2015), que le rapport écarte à juste titre
parce qu'elle ne fournit *que* une analyse factorielle, **la BES française fournit des performances
diagnostiques mesurées contre un entretien SCID** : chez 47 patients obèses,
**Se 75 % · Sp 88,4 % · VPP 37,5 % · VPN 97,4 % au seuil 18**. Populations : 553 sujets non cliniques
(hommes et femmes, adultes et âge moyen) + 63 patients obèses candidats à la chirurgie bariatrique.

**Impact sur la décision.** Trois points, dans l'ordre de gravité :

1. La BES est **spécifique de l'hyperphagie boulimique** — exactement le TCA que le rapport identifie
   lui-même comme le TCA attendu dans le DT2 (§ 3.1, § 4). Le SCOFF, lui, est taillé pour l'anorexie
   et la boulimie.
2. Sa population de validation clinique est **obèse, adulte, des deux sexes** — c'est-à-dire beaucoup
   plus proche du patient du nœud que les 400 étudiantes de Garcia 2010 ou les 226 femmes de
   Garcia 2011.
3. Le rapport **cite lui-même « BES »** au § 4, dans la liste des 9 instruments utilisés par les
   études DT2 de la revue Esmer 2025 — et ne le reprend jamais. L'instrument était sous ses yeux.

**Ce qui doit être dit honnêtement en sens inverse** (et qui explique pourquoi la conclusion finale
n'est pas renversée) : la BES fait **16 items** — ce n'est pas un outil bref à 5 questions ; le
sous-échantillon de performance diagnostique est **n = 47**, très petit ; la population clinique est
faite de **candidats à la chirurgie bariatrique** (obésité sévère), pas de DT2 tout-venant en médecine
générale ; et il n'existe **aucune validation de la BES chez le diabétique de type 2**. La BES ne
remplace donc pas le verrou — mais elle **devait figurer au tableau § 2**, et l'affirmation « le seul
candidat sérieux » n'est pas établie.

---

### H2 — Le chiffre le plus décisif du dossier repose sur une seule méta-analyse ; une seconde existe, non recherchée, et elle donne un résultat presque double

**Citation contestée** — § 4.1 : « En appliquant les performances *poolées* du SCOFF (Kutz 2020 :
Se 0,86 / Sp 0,83) à une prévalence […] de **5 %** : **VPP ≈ 21 %** → environ **4 dépistages positifs
sur 5 seraient des faux positifs** » ; puis : « **L'asymétrie VPP/VPN est le fait le plus solide et le
plus actionnable de tout ce dossier.** » Et § 5.2-1, comme motif n° 3 du refus : « VPP attendue ≈ 20 % ».

**Ce que dit réellement la source.** Kutz 2020 est correctement rapportée (voir § 4, C2 : verbatim
vérifié). Mais **ce n'est pas la seule méta-analyse de l'exactitude diagnostique du SCOFF** :

> Botella J, Sepúlveda AR, Huang H, Gambara H. *A Meta-Analysis of the Diagnostic Accuracy of the
> SCOFF.* **The Spanish Journal of Psychology 2013;16:E92. DOI 10.1017/sjp.2013.92.**
> 15 études, **882 cas et 4 350 témoins**. Estimations poolées : **Se 0,80 · Sp 0,93**. Et lorsque
> l'étalon diagnostique est un **entretien** (cas de Garcia 2010 et 2011, qui utilisent le MINI) :
> **Se 0,882 · Sp 0,925**, rapport de cotes diagnostique 92,19.

**Recalcul, même arithmétique, même prévalence de 5 %** (théorème de Bayes, vérifié à la main) :

| Source des performances poolées | Se | Sp | **VPP à 5 %** | VPN à 5 % |
|---|---|---|---|---|
| Kutz 2020 (retenue par le rapport) | 0,86 | 0,83 | **21,0 %** | 99,1 % |
| Botella 2013, global | 0,80 | 0,93 | **37,6 %** | 98,9 % |
| Botella 2013, étalon = entretien | 0,882 | 0,925 | **38,2 %** | 99,2 % |

**Impact sur la décision.** La VPP attendue du SCOFF-F dans cette population n'est pas « ≈ 20 % »
mais **comprise entre ≈ 21 % et ≈ 38 %** selon la méta-analyse retenue — soit, en langage clinique,
entre « 1 vrai positif sur 5 » et « près de 2 sur 5 ». Le motif n° 3 du refus d'adopter le SCOFF-F
(§ 5.2-1) est donc **présenté comme une donnée alors qu'il est le résultat d'un choix de source non
explicité et non discuté**. La phrase « le fait le plus solide de tout ce dossier » est, en l'état,
le contraire de ce qu'elle prétend être.

Ce que je ne conteste pas : l'arithmétique du rapport est **exacte** (j'ai recalculé : 21,0 % et
99,1 %), et l'ordre de grandeur — une VPP basse, une VPN haute — est vrai dans les trois hypothèses.
C'est la **précision revendiquée** qui est fausse, pas le sens.

---

## 3. Findings MOYENNE

### M1 — Le périmètre déclaré des deux documents HAS n'est jamais mentionné, alors qu'il exclut le patient du nœud

**Citation contestée** — § 1 : « explicitement **recommandé par la HAS** » ; § 5.2-3, texte proposé
pour insertion dans le nœud : « *pour objectiver, la HAS recommande le SCOFF-F (5 questions, moins de
3 minutes, deux réponses positives fortement prédictives)* ».

**Ce que disent réellement les sources** (PDF ouverts et lus par mes soins) :

- **HAS 2010, § 1.2 « Patients concernés »** : « Ces RBP concernent les **enfants, les préadolescents,
  les adolescents et les jeunes adultes**. Les nourrissons et **les adultes ayant une anorexie mentale
  à démarrage tardif sont exclus du champ des RBP**. » Et l'objet de la RBP est l'**anorexie mentale**,
  pas l'hyperphagie boulimique.
- **HAS 2019, Fiche outil 1, encadré « Population cible »** : « **Jeunes, en particulier les
  adolescentes et les jeunes femmes** » + mannequins, disciplines sportives à contrôle du poids,
  antécédents familiaux de TCA.

**Impact.** Le patient du nœud — adulte DT2 d'âge moyen ou avancé, en surpoids — n'appartient à la
population cible déclarée d'aucun des deux documents. La recommandation HAS 2019 reste défendable
(la section « Évaluation initiale » qui nomme le SCOFF-F n'est pas restreinte par l'âge, et la
rubrique « Situations à risque » vise explicitement le surpoids/l'obésité) — mais **le rapport doit le
dire**, sous peine de faire porter à la HAS un aval qu'elle n'a pas formellement donné pour cette
population. Le rapport passe des pages à qualifier la portée des *données* (femmes jeunes, cas-témoins)
et ne qualifie jamais la portée des *recommandations*.

**Sous-point d'attribution.** La phrase proposée pour le nœud attribue à la HAS un faisceau mixte :
« 5 questions » et « deux réponses positives fortement prédictives » viennent bien de la HAS 2010
§ 2.3 ; « **moins de 3 minutes** » vient de la **SFD 2025** (p. 367), pas de la HAS. Telle quelle,
cette phrase entrerait dans le nœud avec une attribution fausse.

---

### M2 — Le rapport déclare « fausse » une phrase du nœud qui est littéralement vraie

**Citation contestée** — § 1 : « **Conséquence pour l'incertitude actuelle du nœud :** elle est
*fausse au sens littéral* (« aucun n'a été trouvé dans les sources locales » — SCOFF-F existe et est
recommandé par la HAS) » ; repris § 5.2-2 : « La formulation actuelle […] est **réfutable en une
recherche**. »

**Ce que dit réellement le nœud** (`rhd-alimentation.yaml`, `incertitudes[2]`) : « […] ce n'est PAS un
instrument de repérage TCA validé (SCOFF, EDE-Q…) : aucun n'a été trouvé **dans les sources locales**. »

**Vérification.** `ls docs/decision/sources/` : le corpus local contient 15 fichiers (guides HAS
surpoids-obésité, stratégie DT2, SFD glucides, ebmfrance, PNNS…) et **ne contient ni la RBP anorexie
2010 ni la fiche boulimie 2019**. La phrase du nœud est donc **exacte** : elle porte sur le corpus
local, pas sur la littérature mondiale.

**Impact.** Le rapport attaque une version de la phrase qui n'est pas celle qui est écrite. Le vrai
défaut du nœud n'est pas d'être faux, c'est d'être **indexé sur un corpus local** — ce qui rend
l'affirmation vraie mais non informative pour le lecteur clinicien. Le remède est **d'enrichir**, non
de « corriger une erreur ». La différence n'est pas rhétorique : le référent qui lit « votre nœud dit
quelque chose de faux » ne prend pas la même décision que celui qui lit « votre nœud dit quelque chose
de vrai mais de trop étroit ».

---

### M3 — « Trois sources indépendantes convergent » : deux sont des recommandations, la troisième est un silence

**Citation contestée** — § 4, titre : « **Le point décisif : personne n'a validé de repérage TCA chez
l'adulte DT2** » ; puis : « **Trois sources indépendantes convergent, et deux d'entre elles sont
institutionnelles françaises.** »

**Ce que disent réellement les trois sources :**

1. **HAS 2019** dit qu'il *existe* des questionnaires « adaptés aux sujets atteints de diabète de
   **type 1** [type DEPS-R, m-EDI, m-SCOFF] » (verbatim vérifié). Elle ne dit **pas** que rien n'est
   validé pour le type 2. C'est une **recommandation** sur les outils existants.
2. **HAS 2010 § 2.2** liste le diabète de type 1 parmi les populations à risque (verbatim vérifié).
   L'absence du type 2 dans une liste est une **absence**, pas une affirmation.
3. **Esmer 2025** : j'ai ouvert la revue. Elle ne comporte **aucune phrase** disant qu'aucun
   instrument n'est validé dans cette population ; elle constate l'hétérogénéité des méthodes
   (« This shows the heterogeneity in the method used to diagnose BED and NES, which affect prevalence
   estimates ») et **recommande** que « Individuals with eating disorders and T2DM require more socially
   and psychologically sensitive diagnostic tools for early recognition ». C'est un **silence** plus un
   appel au développement d'outils.

**Impact.** La conclusion du § 4 reste, à ma connaissance, **vraie** — je n'ai trouvé aucune validation
d'un outil de repérage TCA propre à l'adulte DT2. Mais elle est **inférée**, pas sourcée, et l'étiquette
« [SOURCE] » apposée aux trois points la fait passer pour une donnée. C'est précisément la confusion
recommandation/donnée que l'invariant du projet interdit. Reformuler : *« aucune des sources examinées
ne rapporte d'instrument validé dans cette population ; les deux documents HAS réservent explicitement
les outils diabéto-spécifiques au type 1 »*.

---

### M4 — Contradiction interne sur le DEPS-10, et sur-affirmation « validé chez l'adulte DT2 »

**Citations contestées** — § 1 : « aucun instrument de repérage des TCA n'a été validé chez l'adulte
diabétique de type 2, **ni en français ni dans aucune autre langue** jusqu'en 2025 » ; § 3.4, titre :
« **DEPS-10 — le seul instrument réellement validé chez l'adulte DT2**, mais pas en français » ;
tableau § 2, colonne « Validé chez l'adulte DT2 ? » : « **Oui — le seul** ».

**Ce que dit réellement la source** (Klinker 2025, texte intégral PMC ouvert par mes soins) :
- Échantillon : **DT1 345 (50,8 %) · DT2 322 (47,4 %)**, âge moyen 53,8 ± 16,1 ans, Allemagne.
- **Les performances diagnostiques ne sont rapportées que pour l'échantillon combiné.** Le seul
  découpage du tableau 2 est *ICT / no ICT* (traitement insulinique intensifié ou non), **pas** par
  type de diabète. Il n'existe donc **aucune Se/Sp propre au DT2** dans cette publication.
- Prévalence observée de l'hyperphagie boulimique : **3,5 % (24 cas)** — 2,9 % en DT1, 4,3 % en DT2.
  La VPP de 19,6 % est donc **mesurée sur 24 cas**.
- Les auteurs eux-mêmes écrivent que « the PPV of the DEPS-10 was rather low » et recommandent que
  « Future research should evaluate the DEPS-10's screening performance for other eating disorders ».

**Impact.** Deux phrases du rapport s'annulent (§ 1 « aucun » vs § 3.4 « le seul »). La formulation
exacte est : *validé dans un échantillon adulte mixte DT1 + DT2 germanophone, sans estimation de
performance propre au DT2, sur 24 cas d'hyperphagie boulimique.* En l'état, la ligne « Oui — le seul »
du tableau § 2 est plus forte que la source.

---

### M5 — Instrument français manquant, et c'est précisément celui qui répond à l'objection centrale du rapport : Expali™

**Ce que le rapport n'a pas trouvé.** L'objection qu'il formule lui-même (§ 3.1 : le SCOFF perd en
sensibilité chez l'homme, dans l'hyperphagie boulimique et en faible prévalence) a reçu une réponse
française, par **la même équipe que celle qui a validé le SCOFF-F** :

> Tavolacci MP, Gillibert A, Zhu Soubise A, Grigioni S, Déchelotte P. *Screening four broad categories
> of eating disorders: suitability of a clinical algorithm adapted from the SCOFF questionnaire.*
> **BMC Psychiatry 2019;19:366. PMID 31752796, DOI 10.1186/s12888-019-2338-6 (PMC6868823).**

**Expali™** (*EXPert system ALImentary*) combine **≥ 2 réponses positives au SCOFF-F** et la
**catégorie d'IMC** (104 combinaisons) pour orienter vers 4 grandes catégories DSM-5 : restrictive,
boulimique, **hyperphagique**, autre. Sensibilités : restrictif 76,9 % (IC95 65,9-87,9) · boulimique
69,2 % (53,5-85,0) · **hyperphagique 79,7 % (70,6-88,9)** · autre 16,7 % (0,0-36,7). Population :
**206 patients adultes** du service de nutrition du CHU de Rouen, **âge moyen 36,1 ± 14,4 ans**,
95,6 % de femmes.

**Ce qui doit être dit en sens inverse, et qui est décisif.** L'étude **ne comporte aucun témoin sans
TCA** : elle n'évalue que la classification *à l'intérieur* d'une population déjà SCOFF-positive et
déjà diagnostiquée. Les auteurs l'écrivent : « The internal validity of Expali™ should now be assessed
in a general population (in a GP or university preventive medicine setting) », et Expali « does not
identify *new* cases beyond standard SCOFF ». Ce n'est donc **pas** un test de dépistage validé en
soins primaires, et cela ne renverse pas la recommandation du rapport.

**Impact.** Expali devait figurer au dossier pour deux raisons : (a) c'est l'outil français qui traite
explicitement la catégorie hyperphagique, celle du nœud ; (b) il utilise l'**IMC**, ce qui recoupe
directement l'arbitrage n° 5 proposé au référent (§ 5.2-5). Son absence, alors que le rapport annonce
avoir cherché « en français et en anglais », affaiblit la revendication d'exhaustivité.

---

### M6 — Position institutionnelle majeure manquante, portant exactement sur la question posée : USPSTF 2022

**Ce que le rapport n'a pas trouvé.**

> US Preventive Services Task Force. *Screening for Eating Disorders in Adolescents and Adults:
> US Preventive Services Task Force Recommendation Statement.* **JAMA 2022;327(11):1061-1067.
> PMID 35289876, DOI 10.1001/jama.2022.1806.**
> Conclusion : « the current evidence is **insufficient** to assess the balance of benefits and harms
> of screening for eating disorders in adolescents and adults » (**I statement**), chez les personnes
> de 10 ans et plus **sans signes ni symptômes**.

**Impact, dans les deux sens.**
- **En faveur du rapport** : c'est la corroboration institutionnelle la plus forte de sa recommandation
  n° 1 (ne pas transformer le verrou en dépistage systématique par score), et elle est indépendante de
  Kutz 2020. Le rapport aurait été plus solide avec elle.
- **Contre le rapport** : elle crée une **divergence explicite de recommandations** que le § 5.2-5
  arbitre sans la nommer. La HAS 2019 dit « **Rechercher systématiquement** une hyperphagie boulimique
  en cas de surpoids ou d'obésité » ; l'USPSTF dit « preuves insuffisantes pour dépister l'asymptomatique ».
  Le rapport présente l'arbitrage IMC comme un compromis entre « ce que dit la HAS » et « la charge de
  saisie ». C'est en réalité un **conflit de recommandations**, qui relève du champ `divergence` du
  schéma de nœud, pas d'un arbitrage ergonomique.

---

### M7 — L'argument de la VPP est appliqué de façon asymétrique : un instrument mesuré est refusé au profit d'un instrument non mesuré

**Citation contestée** — § 5.2-1 : « **Ne PAS remplacer le verrou par le SCOFF-F.** Motifs : […] VPP
attendue ≈ 20 %. **Un verrou qui bloque 4 patients à tort sur 5 dégraderait la décision**, alors que le
verrou actuel est un **filet à signes d'appel**, pas un test. »

**Trois objections.**

1. **Erreur de lecture de la VPP.** Avec une VPP de 21 %, ce sont 4 **positifs** sur 5 qui sont faux —
   pas 4 **patients** sur 5. La proportion de patients bloqués à tort dans l'ensemble de la population
   est (1 − Sp) × (1 − prévalence) = 0,17 × 0,95 ≈ **16 %**. La phrase, telle qu'elle est écrite,
   surestime le préjudice d'un facteur ~5.
2. **Comparaison non faite.** Le verrou actuel est un **OU logique de 3 signes HAS larges**, chacun
   `confirmation_requise: true`. C'est fonctionnellement un test : il ouvre ou ferme des options. Il a
   donc une sensibilité et une spécificité — simplement **inconnues et jamais estimées**. Rien ne
   permet d'affirmer que sa spécificité est meilleure que 0,83 ; un OU de trois signes dont l'un est
   « demande de régime amaigrissant ou habitudes alimentaires restrictives » chez un patient DT2 en
   surpoids est *a priori* très peu spécifique. Le rapport refuse un instrument **parce que ses
   défauts sont mesurés**, et conserve l'alternative **parce que les siens ne le sont pas**.
3. **« Filet à signes d'appel, pas un test »** n'est pas une propriété du verrou, c'est une description
   de l'intention. Dans le nœud, `verrou_tca == true` figure en `exclusions` de quatre options : c'est
   un blocage binaire, donc un test.

**Impact.** La conclusion peut rester la même — mais le motif n° 3 doit disparaître ou être reformulé,
et le rapport doit reconnaître explicitement que **le verrou actuel n'a pas de performance connue**,
ce qui est une raison de prudence des deux côtés, pas un argument pour le statu quo.

---

### M8 — L'argument « VPN ≈ 99 %, un SCOFF-F négatif peut lever la prudence » est mécanique, pas informatif

**Citation contestée** — § 5.2-4 : « Un SCOFF-F **négatif** est informatif (VPN ≈ 99 %) et peut
raisonnablement **lever** la prudence » ; § 3.4 : « la **VPN de 99,5 %** est excellente ».

**Ce que montre le calcul.** À une prévalence de 5 %, la probabilité *pré-test* de ne pas avoir
d'hyperphagie boulimique est déjà de **95 %**. Un test négatif la porte à **99,1 %** : gain absolu de
**4,1 points**. Une VPN de 99 % en situation de faible prévalence est donc **surtout le reflet de la
faible prévalence**, pas de la qualité du test. Le rapport le sait pour la VPP (il l'écrit
explicitement) et ne l'applique pas à la VPN.

Aggravant : la VPN dépend de la **sensibilité**, or c'est exactement la sensibilité que Kutz 2020
décrit comme abaissée chez les hommes, dans l'hyperphagie boulimique et en recrutement communautaire —
les trois conditions du nœud. Utiliser la VPN mesurée chez des femmes jeunes pour « lever la prudence »
chez un homme DT2 de 60 ans en surpoids, c'est refaire précisément l'extrapolation que le § 3.1
dénonce dix pages plus haut.

**Impact.** La recommandation n° 4 (« exploiter l'asymétrie VPP/VPN ») est présentée comme « le contenu
EBM à valeur ajoutée ». Elle est en fait le point le plus fragile de la proposition. À conserver, mais
avec le chiffre pré-test à côté du chiffre post-test, sinon le nœud affichera un faux gain d'information.

---

## 4. Findings BASSE

### B1 — La spéculation chronologique du § 5.3 n'est pas soutenue

**Citation contestée** — § 5.3 : « Chronologiquement, la RBP HAS est de **juin 2010** et la première
publication de Garcia d'**octobre 2010** — le libellé HAS pourrait donc être **antérieur à la
publication de la validation**. »

**Ce que j'ai trouvé.** Une validation francophone du SCOFF a été communiquée **en 2008**, deux ans
avant la RBP :

> Grigioni S, Garcia F, Houy-Durand E, Allais E, Déchelotte P. *O045 — Validation d'une version
> francophone d'un test de dépistage de patients à risque de troubles du comportement alimentaire.*
> **Nutrition clinique et métabolisme 2008;22(S1):45-46.** 120 femmes, ~11 % de TCA,
> **Se 92 % · Sp 91,5 %** au seuil ≥ 2.

De plus, la HAS écrit elle-même en juin 2010, verbatim : « SCOFF-F (initialement DFTCA […]
**traduction française validée du SCOFF**) ». L'hypothèse « la HAS a pu publier un libellé non validé »
n'est donc pas étayée ; c'est même le contraire qui est le plus probable. (Note de cohérence : ce
document de 2008 est un **résumé de congrès** — exactement le statut que le rapport invoque, à juste
titre, pour écarter la « validation française » de la DEPS-R. Il ne peut donc pas servir de preuve
forte non plus.)

**Ce qui reste ouvert et que je n'ai pas résolu non plus** : lequel des deux libellés français est
celui qu'ont psychométriquement validé Garcia et al. La réserve du rapport reste donc **juste** ; c'est
seulement son explication chronologique qui tombe.

### B2 — Provenance mal étiquetée des chiffres du mSCOFF

Le § 3.2 énonce sous « [SOURCE, **notice PubMed ouverte**] » : « 43 adolescentes […] âge moyen
15,8 ± 1,7 ans ; durée du diabète 7,6 ans ; IMC 25,5 ; HbA1c 8,4 % » — alors que le § 6 déclare, pour
la même référence, « **Pas d'abstract PubMed** ; texte intégral en 403 ». Une notice PubMed sans
résumé ne peut pas fournir ces chiffres : leur provenance réelle n'est pas documentée.

**Les chiffres sont exacts** (retrouvés par une voie secondaire indépendante), donc ce n'est pas une
invention — c'est un défaut de traçabilité, du type précis que l'invariant 6 vise. Deux précisions au
passage : le comparateur n'est pas l'**EDI-3** mais le **m-EDI** (EDI-3 dont on a retiré les items de
restriction « imposée par le diabète ») ; et l'item ajouté porte sur la prise volontairement réduite
d'insuline (le rapport écrit « sous-dosage volontaire », correct).

### B3 — Le m-EDI n'est jamais traité

La fiche HAS 2019 nomme **trois** outils diabéto-spécifiques : « DEPS-R, **m-EDI**, m-SCOFF ». Le
rapport écrit « les **deux** instruments diabéto-spécifiques (DEPS-R, mSCOFF) » (§ 1) et n'aborde
jamais le m-EDI, ni au tableau § 2, ni au § 3, ni au § 6. Couverture incomplète de sa propre source
institutionnelle centrale. Sans conséquence sur la décision (le m-EDI est un dérivé de l'EDI-3, long
et DT1), mais à combler.

### B4 — La DEPS-R n'est pas seulement pédiatrique

Le tableau § 2 indique « Population de validation : **DT1 pédiatrique** (Markowitz 2010) ». Or la
référence que la SFD invoque pour « sa pertinence a été validée » est sa référence **[51]** :
Embaye J, Hennekes M, Snoek FJ, et al., *Diabet Med 2024;41:e15313* — **adultes néerlandais vivant
avec un DT1**. Sans conséquence sur l'exclusion (l'instrument reste DT1 et insulino-spécifique), mais
la ligne du tableau est inexacte.

### B5 — La phrase-verdict du § 1 laisse tomber son propre qualificatif

« le SCOFF-F est un instrument de repérage des TCA **validé en français** » : les § 2 et 3.1 précisent
correctement « femmes uniquement, jeunes ». Le § 1, qui est la phrase qui sera citée et reprise dans
le nœud, ne le fait pas. Défaut mineur, mais c'est la phrase la plus exposée du document.

### B6 — Littérature grise francophone : la réserve du rapport est juste, et productive

Le § 6 note qu'« une recherche en base francophone (SUDOC, thèses d'exercice, Cairn) pourrait
compléter ». Elle le fait effectivement : plusieurs thèses d'exercice françaises ont évalué le SCOFF-F
**en médecine générale, chez des adultes des deux sexes de 15 à 45 ans** (dépôts DUMAS et Pépite —
p. ex. `dumas-00877972`, Lille `univ-lille-32289`). Elles rapportent des **taux de positivité** (≈ 25 %)
et l'acceptabilité par les médecins, **pas** de sensibilité/spécificité contre un étalon diagnostique :
elles ne constituent donc **pas** une validation, mais elles documentent la faisabilité dans le cadre
exact du nœud. À mentionner comme telles, ni plus ni moins.

### B7 — Un point de contenu manqué sur la conduite à tenir, dans l'encadré que le rapport a pourtant lu

Le rapport ouvre le guide HAS surpoids-obésité pour vérifier l'encadré 11 (§ 5.1) mais ne relève pas la
phrase qui l'introduit, § 3.6 p. 43 : « Une orientation, selon le tableau clinique, vers un
**psychologue ou un psychiatre spécialiste des TCA** peut être nécessaire pour explorer plus avant la
situation et proposer une approche thérapeutique **en complément** d'un accompagnement par un
diététicien. » Or l'unique option d'orientation déclenchée par `verrou_tca == true` dans le nœud est
« Orienter vers le **diététicien** de la structure ». Ce n'est pas l'objet du rapport, mais c'est dans
la source qu'il a ouverte et cela concerne directement la conduite à tenir qu'il propose de renforcer
(§ 5.2-3). À signaler au référent. *(Je ne modifie rien : lecture seule sur `content/**`.)*

---

## 5. La recommandation finale résiste-t-elle ? Attaque directe

**Elle résiste dans sa direction, pas dans ses motifs.**

**Ce qui tient :**
- Ne pas transformer le verrou en score calculé par le moteur — **oui**. Corroboré par une source que
  le rapport n'a pas utilisée (USPSTF 2022, *I statement*, M6) et par la conclusion verbatim de
  Kutz 2020, vérifiée mot pour mot.
- Aucune validation du SCOFF-F chez l'adulte DT2, ni chez l'homme francophone — **oui**, vérifié.

**Ce qui ne tient pas :**
- Le motif « VPP attendue ≈ 20 % » (H2 : 21 à 38 %).
- Le motif « un verrou qui bloque 4 patients à tort sur 5 » (M7 : erreur de lecture, et comparaison
  avec une alternative dont la performance est inconnue).

**Le meilleur argument POUR adopter le SCOFF-F, que le rapport ne formule ni ne réfute.** Il est
sérieux et il faut l'écrire :

> La HAS 2019 offre **exactement deux** modalités de repérage acceptables — l'évaluation clinique
> globale avec questions spécifiques, **ou** un questionnaire court adapté et validé (SCOFF-F, ESP).
> Le nœud n'a retenu **ni l'une ni l'autre** : ses 3 signes viennent d'un **troisième** document
> (le guide parcours surpoids-obésité), qui n'est **pas** une recommandation de repérage des TCA, qui
> ne cite **aucun** instrument, et dont l'encadré 11 est un aide-mémoire de signes cliniques d'appel.
> Le SCOFF-F, lui, est français, tient en 5 questions, a un seuil publié, une VPN publiée et un aval
> nominatif de la HAS dans **deux** recommandations. Un verrou construit sur lui pourrait porter
> l'argument de VPN que le rapport veut utiliser ; le verrou actuel ne le peut pas, sa VPN étant
> inconnue.

**Pourquoi la recommandation survit malgré cela** — et c'est ce que le rapport aurait dû opposer :

1. **Le SCOFF est mal formé pour ce nœud.** Ses items visent les vomissements provoqués, une perte de
   poids récente de plus de 6 kg, et la conviction d'être gros alors que l'entourage vous trouve trop
   mince. Chez un adulte DT2 en surpoids chez qui le TCA attendu est l'hyperphagie boulimique, **au
   moins un item est inversé** (la perte de poids y est un objectif thérapeutique, pas un signe
   d'alerte) et plusieurs sont hors sujet. Kutz 2020 documente exactement cette perte de sensibilité
   dans l'hyperphagie boulimique.
2. **La réponse française à cette objection (Expali™, M5) n'a jamais été évaluée avec des témoins sans
   TCA** : ses auteurs demandent eux-mêmes une validation en population de médecine générale.
3. **Un instrument non nul existe pour cette population, mais il n'est pas bref** (BES française, H1 :
   16 items). Le nœud vise un socle de 2-3 minutes ; on ne peut pas y greffer 16 items.
4. **Le nœud ne collecte pas l'IMC**, donc ni Expali ni une stratification par corpulence ne sont
   câblables sans élargir le recueil.

**Ce que je recommanderais de changer dans la proposition du rapport, en une phrase par point :**
remplacer le motif chiffré n° 3 par une fourchette honnête (21-38 %) ; supprimer la comparaison
« 4 patients sur 5 » ; ajouter que **la performance du verrou actuel est inconnue** ; ajouter la
divergence HAS/USPSTF au champ `divergence` plutôt que de l'arbitrer en silence ; ajouter la BES
française et Expali™ au tableau § 2 avec leurs limites ; et corriger l'attribution de « moins de
3 minutes » (SFD, pas HAS) dans la phrase proposée pour le nœud.

---

## 6. Points où le rapport est CONFIRMÉ

C'est une information en soi : **le contrôle n° 1 passe sans une seule anomalie.**

**C1 — Aucun PMID faux. Aucun DOI faux. Aucune référence fantôme.** J'ai ouvert et recoupé les
11 identifiants du § 7 : **10582927** (Morgan 1999, BMJ, sans résumé — confirmé), **20509759**
(Garcia 2010, World J Biol Psychiatry 11(7):888-93), **20971536** (Garcia 2011, Clin Nutr 30(2):178-81),
**31705473** (Kutz 2020, J Gen Intern Med 35(3):885-93), **12534764** (Cotton 2003, J Gen Intern Med
18(1):53-6), **24459158** (Zuijdwijk 2014, Diabetes Care 37(2):e26-7, sans résumé — confirmé),
**25194301** (Carrard 2015, Eat Weight Disord 20(1):137-44), **30410761** (Abbott 2018, J Eat Disord
6:36), **PMC2656502** (Lähteenmäki 2009), **PMC12257434** (Klinker 2025, Diabet Med 42(8):e70060),
**PMC12465268** (Esmer 2025). Titres, auteurs, revues, années, volumes, pages et populations
**correspondent tous**. Aucun ne pointe vers un sujet sans rapport.

**C2 — Kutz 2020 est rapportée mot pour mot.** Se poolée 0,86 (IC95 0,78-0,91), Sp poolée 0,83
(0,77-0,88), 25 études ; « Studies which included more men, included those diagnosed with binge eating
disorder, and recruited from large community samples tended to have lower sensitivity » ; et la
conclusion « there is not enough evidence to support utilizing the SCOFF for screening for the range of
DSM-5 eating disorders in primary care and community-based settings ». **Point 2 de la mission :
confirmé intégralement.**

**C3 — Les deux validations françaises du SCOFF existent et les chiffres sont exacts.** Garcia 2010 :
400 étudiantes, 37 TCA (9,3 %) — 8 anorexies, 29 boulimies ; MINI + DSM-IV ; **Se 94,6 % · Sp 94,8 % ·
VPP 65 % · VPN 99 % · AUC 96,2 %**. Garcia 2011 : 67 anorexies + 45 boulimies + 114 étudiantes témoins
appariées, **toutes femmes** ; **Se 94,6 % · Sp 94,7 % · AUC 97,9 % · kappa 89 %**. **Point 1
(volet données) : confirmé.**

**C4 — La HAS 2010 recommande nommément le SCOFF-F, au § 2.3 p. 7, et reproduit les 5 items.**
Verbatim vérifié : « ou d'utiliser le questionnaire SCOFF-F (initialement DFTCA : définition française
des troubles du comportement alimentaire, traduction française validée du SCOFF) en tête à tête avec le
patient, où deux réponses positives sont fortement prédictives d'un TCA ». **La recommandation est bien
non gradée** (le § 1.4 précise : « les recommandations non gradées sont celles qui sont fondées sur un
accord professionnel ») — le rapport a raison de le signaler. Et le § 2.2 liste bien « le diabète de
type 1 » parmi les pathologies à régime, **sans** le type 2.

**C5 — La HAS 2019 nomme bien le SCOFF-F et l'ESP.** Verbatim : « soit sur l'utilisation d'un
questionnaire court adapté et validé (SCOFF-F, ESP, etc.) ». **Point 1 (volet recommandation) :
confirmé** (sous réserve de M1 sur le périmètre).

**C6 — Point 5 de la mission : confirmé mot pour mot.** HAS 2019, « Situations à risque » : « variations
importantes de l'HbA1c ou du poids chez les patients diabétiques (il existe des questionnaires de
dépistage des troubles des conduites alimentaires **adaptés aux sujets atteints de diabète de type 1**
[type DEPS-R, m-EDI, m-SCOFF]) ».

**C7 — Point 6 de la mission : confirmé mot pour mot.** HAS 2019 : « **Rechercher systématiquement une
hyperphagie boulimique : en cas de situation de surpoids ou d'obésité** ». Le rapport ne cite que ce
déclencheur ; la fiche en donne trois autres (demande de chirurgie bariatrique ; échec de perte de poids
après chirurgie ; troubles bipolaires et patients sous antipsychotiques) — sans conséquence ici, mais la
citation est partielle.

**C8 — Point 4 de la mission : confirmé mot pour mot, et la référence bibliographique aussi.**
Hanaire H, Darmon P, Iceta S, Betry C, Gastaldi G, Achamrah N, et al., *Méd Mal Métab*
**2025;19(5):361-378**, DOI **10.1016/j.mmm.2025.06.002** — existe, périmètre **type 1** revendiqué dès
le titre. p. 367 : « le SCOFF est un questionnaire en cinq questions [46], validé en français [47],
largement utilisé pour détecter les TCA en population générale. Il nécessite moins de 3 min pour être
rempli » ; « (mSCOFF) [48] **mais il n'existe pas de version validée en langue française** ». p. 369 :
« bien qu'un résumé canadien mentionne une validation française (QACD […]) [52], **celle-ci reste à
confirmer dans la littérature** » ; encadré : « Les outils existent (questionnaires m-SCOFF, DEPS-R).
**Le diagnostic doit être validé.** » **Et la vérification de bibliographie du rapport est exacte** :
[46] = Morgan 1999 ; **[47] = Garcia 2011, Clin Nutr 30:178-81** ; [48] = Zuijdwijk 2014 ;
[49] = Markowitz 2010 ; **[52] = Gagnon C, Aimé A, Bélanger C, Can J Diabetes 2013;37:60**.

**C9 — Les deux libellés français concurrents du SCOFF existent bien, et la réserve est plutôt
sous-estimée que surestimée.** J'ai comparé la HAS 2010 p. 7 et le tableau II de la SFD 2025 (p. 368) :
**les cinq items diffèrent**, pas seulement un ou deux — formulation, temps verbaux, et un item dont le
cadrage temporel n'est pas le même. La mise en garde du § 5.3 (« ne pas intégrer littéralement avant
d'avoir tranché ») est **justifiée et importante**.

**C10 — La réserve sur l'ESP est juste.** L'abstract de Cotton 2003 ne donne **que** des rapports de
vraisemblance (ESP : LR 0,0 pour ≤ 1 réponse anormale, LR 11 pour ≥ 3 ; SCOFF « less sensitive than
predicted », LR 0,25). **Le couple « Se 100 % / Sp 71 % » est absent de la source primaire** — le
rapport a raison de refuser de le citer. Et je n'ai trouvé, moi non plus, **aucune validation française
de l'ESP ni de l'EDE-QS** ; comme le rapport, je le formule en « non trouvé », pas en « n'existe pas ».

**C11 — L'analyse de Carrard 2015 est correctement qualifiée.** C'est bien une **analyse factorielle
confirmatoire** (modèle bref à 7 items / 3 facteurs, α 0,714-0,953), sans Se, Sp ni seuil. Détail qui
renforce le rapport : c'est précisément cette référence que la SFD cite (sa réf. [58]) pour affirmer que
l'EDE-Q est « validé en français » — l'écart entre validation psychométrique et validation d'un outil de
repérage est donc réel jusque dans une source institutionnelle.

**C12 — Les chiffres de VPP/VPN cités sont tous exacts.** Lähteenmäki 2009 : Se 77,8 % · Sp 87,8 % ·
**VPP 9,7 %** · VPN 99,6 % (échantillon complet, 541 sujets dont 312 femmes, étalon SCID-I).
Klinker 2025 : **VPP 19,6 % · VPN 99,5 %**, mesurées et non calculées à prévalence supposée
(« With a PPV of 19.6%, five clinical interviews are needed after DEPS-10 screening to identify one BED
case »). Garcia 2010 : VPN 99 %. **Point 3 de la mission : confirmé.** *Nuance à ajouter côté
Lähteenmäki : l'estimation ne repose que sur **9 cas** de TCA actuel — elle est très imprécise, et
l'article donne aussi une VPP de 11,1 % chez les femmes seules. Le rapport cite le chiffre le plus bas
sans le dire.*

**C13 — L'arithmétique du § 4.1 est exacte.** Recalculée à la main : Se 0,86 / Sp 0,83 / prévalence
5 % → **VPP 21,0 %**, **VPN 99,1 %**. Le rapport annonce « ≈ 21 % » et « ≈ 99 % ». Correct. (Voir H2
pour la robustesse de l'hypothèse, pas du calcul.)

**C14 — La vérification de fidélité du § 5.1 est exacte.** J'ai ouvert le PDF local
`docs/decision/sources/guide HAS._parcours_surpoids-obesite_de_ladulte.pdf`, **encadré 11 p. 43** : les
trois correspondances du tableau du rapport sont **littérales**, et **l'encadré ne cite effectivement
aucun instrument**. La remarque du nœud (« ce n'est pas un score ») est donc exacte pour cette source.

**C15 — Les autres citations quantitatives sont exactes.** Abbott 2018 : 10 études, **6 527**
participants dépistés pour l'hyperphagie boulimique, prévalence **1,2-8,0 %**, syndrome d'alimentation
nocturne **3,8-8,4 %**. Esmer 2025 : **12 études**, hétérogénéité d'instruments, fourchette plus large.
Klinker 2025 : 10 items, dérivés de la DEPS-R par retrait des items insulino-spécifiques, seuil ≥ 15,
Se 87,5 % / Sp 86,9 % / AUC 0,92, âge moyen 53,8 ans, Mini-DIPS/DSM-5, Allemagne, allemand.

**C16 — La discipline « droit d'auteur » est respectée.** Le rapport ne recopie aucun item de
questionnaire et pointe les documents publics. Conforme à l'invariant 7.

**C17 — Les réserves du § 6 sont, dans l'ensemble, justes et bien calibrées.** Aucune n'est un
faux-fuyant : celles sur l'ESP (C10), sur les deux libellés (C9), sur le mSCOFF, sur Morgan 1999 et sur
la revue non indexée BAOJ sont toutes vérifiées ou raisonnables. Le seul reproche est **B2** (une
réserve du § 6 contredit un étiquetage du § 3.2).

---

## 7. Ce que je n'ai pas pu vérifier

| Point | Pourquoi | Conséquence |
|---|---|---|
| Textes intégraux de Garcia 2010 (World J Biol Psychiatry) et 2011 (Clin Nutr) | Payants | **La question « quel libellé français est le validé » reste ouverte** — je n'ai ni confirmé ni infirmé la réserve du rapport, seulement réfuté son explication chronologique (B1) |
| Texte intégral du mSCOFF (Zuijdwijk 2014) | Pas de résumé PubMed ; 403 sur `diabetesjournals.org` | Je confirme les caractéristiques de population par voie secondaire, **pas** les performances. Ne citer aucun chiffre de Se/Sp du mSCOFF, comme le dit le rapport |
| Résumé Gagnon 2013 (Can J Diabetes 37:60) et article BAOJ Diabetes 2017 | Non ouverts par moi non plus | Je ne peux pas contredire le rapport ; son traitement (les écarter) reste le plus prudent |
| Liste des 26 langues du BEDS-7 (Gewirtz-Meydan et al., Int J Eat Disord 2025;58(5):926-938, PMID 40040591) | Non détaillée dans le résumé | **Sans conséquence** : cette étude ne rapporte qu'invariance factorielle et fidélité (α > 0,80), **pas** de sensibilité/spécificité contre un entretien. Même si une version française existe, ce ne serait pas une validation diagnostique |
| Statut de droit d'auteur / redevance du SCOFF | Non investigué de mon côté | La prudence du rapport (pointer la page HAS plutôt que recopier) reste la bonne conduite |
| Rapport de preuve complet de l'USPSTF 2022 | Seule la déclaration de recommandation a été lue | Le *I statement* et son périmètre (« sans signes ni symptômes ») sont établis ; l'analyse détaillée par sous-groupe ne l'est pas |
| Validation française de l'ESP et de l'EDE-QS | Recherches PubMed + web, en français et en anglais, sans résultat | **Absence de preuve, pas preuve d'absence** — même position que le rapport |
| Performance du verrou actuel (3 signes HAS en OU) | Aucune étude ne l'a évaluée : ce n'est pas un instrument publié | C'est le cœur de M7 : **on ne peut pas la comparer au SCOFF-F, faute de chiffres** — et c'est cela qu'il faut écrire au référent |

---

## 8. Sources ouvertes pour cet audit

**Recommandations et référentiels (PDF ouverts et lus intégralement par mes soins)**

- HAS. *Anorexie mentale : prise en charge*, RBP juin 2010 — §§ 1.2, 1.4, 2.1, 2.2, 2.3 (p. 5-8).
  https://www.has-sante.fr/upload/docs/application/pdf/2010-09/reco_anorexie_mentale.pdf
- HAS. *Boulimie et hyperphagie boulimique — Repérage*, Fiche outil 1, juin 2019 (3 pages, intégral).
  https://www.has-sante.fr/upload/docs/application/pdf/2019-09/fs_boulimie_reperage_v1.pdf
- HAS. *Guide du parcours de soins : surpoids et obésité chez l'adulte*, janvier 2023 (m-à-j février
  2024) — §§ 3.5.2, 3.6, encadré 11, p. 42-44. Source locale du dépôt :
  `docs/decision/sources/guide HAS._parcours_surpoids-obesite_de_ladulte.pdf`
- Hanaire H, Darmon P, Iceta S, et al. *Troubles des conduites alimentaires et diabète de type 1 :
  prise de position de la SFD et de la SFD Paramédical.* Méd Mal Métab 2025;19(5):361-378 —
  p. 361-362 (identité), 367-368 (tableaux II et III), 369 (DEPS-R/QACD, encadré), 376-378
  (bibliographie, réf. [46]-[59]). https://www.sfdiabete.org/sites/www.sfdiabete.org/files/files/ressources/ref_tca_dt1.pdf
- US Preventive Services Task Force. *Screening for Eating Disorders in Adolescents and Adults.*
  JAMA 2022;327(11):1061-7. PMID 35289876 · DOI 10.1001/jama.2022.1806.
  https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-eating-disorders-adolescents-adults

**Références primaires vérifiées (notices ou textes intégraux ouverts par mes soins)**

| # | Référence | Identifiant | URL |
|---|---|---|---|
| 1 | Morgan JF, Reid F, Lacey JH. BMJ 1999;319(7223):1467-8 | PMID 10582927 | https://pubmed.ncbi.nlm.nih.gov/10582927/ |
| 2 | Garcia FD, et al. World J Biol Psychiatry 2010;11(7):888-93 | PMID 20509759 | https://pubmed.ncbi.nlm.nih.gov/20509759/ |
| 3 | Garcia FD, et al. Clin Nutr 2011;30(2):178-81 | PMID 20971536 | https://pubmed.ncbi.nlm.nih.gov/20971536/ |
| 4 | Kutz AM, et al. J Gen Intern Med 2020;35(3):885-93 | PMID 31705473 | https://pubmed.ncbi.nlm.nih.gov/31705473/ |
| 5 | Lähteenmäki S, et al. BMC Psychiatry 2009;9:5 | PMC2656502 | https://pmc.ncbi.nlm.nih.gov/articles/PMC2656502/ |
| 6 | Cotton MA, Ball C, Robinson P. J Gen Intern Med 2003;18(1):53-6 | PMID 12534764 | https://pubmed.ncbi.nlm.nih.gov/12534764/ |
| 7 | Zuijdwijk CS, et al. Diabetes Care 2014;37(2):e26-7 | PMID 24459158 | https://pubmed.ncbi.nlm.nih.gov/24459158/ |
| 8 | Carrard I, et al. Eat Weight Disord 2015;20(1):137-44 | PMID 25194301 | https://pubmed.ncbi.nlm.nih.gov/25194301/ |
| 9 | Klinker LY, et al. Diabet Med 2025;42(8):e70060 | PMID 40440439 · PMC12257434 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12257434/ |
| 10 | Abbott S, et al. J Eat Disord 2018;6:36 | PMID 30410761 · PMC6219003 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6219003/ |
| 11 | Celik Esmer A, Jalal Z, Guo P, Seckin M. J Eat Disord 2025 | PMID 41013791 · PMC12465268 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12465268/ |

**Références APPORTÉES par cet audit (absentes du rapport)**

| # | Référence | Identifiant | URL | Finding |
|---|---|---|---|---|
| A | Brunault P, Gaillard P, Ballon N, et al. *Validation de la version française de la Binge Eating Scale…* L'Encéphale 2016;42(5):426-33 | PMID 27017318 · DOI 10.1016/j.encep.2016.02.009 | https://pubmed.ncbi.nlm.nih.gov/27017318/ | **H1** |
| B | Botella J, Sepúlveda AR, Huang H, Gambara H. *A Meta-Analysis of the Diagnostic Accuracy of the SCOFF.* Span J Psychol 2013;16:E92 | DOI 10.1017/sjp.2013.92 | https://www.cambridge.org/core/journals/spanish-journal-of-psychology/article/abs/metaanalysis-of-the-diagnostic-accuracy-of-the-scoff/EC8D504A4C7488A1E353D76409F74735 | **H2** |
| C | Tavolacci MP, Gillibert A, Zhu Soubise A, Grigioni S, Déchelotte P. *Screening four broad categories of eating disorders… (Expali™).* BMC Psychiatry 2019;19:366 | PMID 31752796 · PMC6868823 · DOI 10.1186/s12888-019-2338-6 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6868823/ | **M5** |
| D | US Preventive Services Task Force. JAMA 2022;327(11):1061-7 | PMID 35289876 · DOI 10.1001/jama.2022.1806 | https://doi.org/10.1001/jama.2022.1806 | **M6** |
| E | Grigioni S, Garcia F, Houy-Durand E, Allais E, Déchelotte P. *O045 — Validation d'une version francophone…* Nutr Clin Métab 2008;22(S1):45-6 — **résumé de congrès** | — | https://www.em-consulte.com/article/194317 | **B1** |
| F | Embaye J, Hennekes M, Snoek FJ, et al. *Psychometric properties of the DEPS-R among Dutch adults with type 1 diabetes.* Diabet Med 2024;41:e15313 (réf. [51] de la SFD) | DOI 10.1111/dme.15313 | — | **B4** |
| G | de Lauzon B, Romon M, Deschamps V, et al. *The TFEQ-R18 is able to distinguish among different eating patterns in a general population.* J Nutr 2004;134(9):2372-80 — 887 Français, hommes et femmes ; mesure la **restriction cognitive** et l'**alimentation émotionnelle**, **pas** un dépistage diagnostique | PMID 15333731 · DOI 10.1093/jn/134.9.2372 | https://pubmed.ncbi.nlm.nih.gov/15333731/ | contexte |
| H | Gewirtz-Meydan A, et al. *Cross-Cultural Validation of the BEDS-7 Across 42 Countries.* Int J Eat Disord 2025;58(5):926-38 — invariance factorielle et fidélité, **sans** Se/Sp | PMID 40040591 · DOI 10.1002/eat.24365 | https://pubmed.ncbi.nlm.nih.gov/40040591/ | § 7 |

> **Note sur G.** Le TFEQ-R18 n'est pas un instrument de repérage des TCA et n'a donc pas sa place au
> tableau § 2. Il est signalé parce qu'il mesure, en français et chez des adultes des deux sexes, les
> deux constructions que le nœud encode par ailleurs (`signe_restriction_puis_craquage` ≈ restriction
> cognitive + désinhibition ; `alimentation_emotionnelle`). À traiter comme un repère de vocabulaire,
> jamais comme une validation du verrou.

---

*Audit adversarial — agent red-team, 2026-07-27. Aucun fichier de `content/**`, aucun test et aucun
autre document de ce chantier n'a été modifié.*
