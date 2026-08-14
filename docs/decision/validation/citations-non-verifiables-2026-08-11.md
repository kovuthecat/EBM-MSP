# Citations affichées au praticien mais absentes de la bibliographie du nœud — dossier d'instruction

> **Date** : 2026-08-11 · **Plan** : P15 / S4 (T-198) · **Nature** : **instruction, aucune décision**.
> **Aucun fichier de contenu, de schéma ni de code n'a été modifié** — ce document est le seul écrit
> produit par la session.
> **Objet** : les **11 points** relevés par `posologie-sourcage-2026-08-11.md` (§1.2, §1.3, §6.2, §6.3,
> §6.4) où le texte affiché cite une autorité que le nœud ne porte pas, ou porte une affirmation
> actionnable sans aucune source. Pour chacun : où il s'affiche, ce qu'il est censé appuyer, la source
> réelle identifiée, et **une issue proposée**.
> **Ce document ne tranche rien.** La section « Arbitrage » est vide, à remplir par le référent. Toute
> modification de nœud impose de toute façon bump de version + changelog + validation humaine
> (`DECISIONS.md` D5). L'application se fera en **S6** (`prescription`) et **S7** (`statine`).

---

## 0. Ce qui est en cause, et pourquoi c'est indépendant du reste de P15

Le praticien lit « (ACC 2020) », « (JAMA Cardiol 2020) », « (RCP, rubrique 4.4) » et tient
l'affirmation pour sourcée. Or **rien dans le nœud ne lui permet de remonter à la source** : ces
citations n'existent ni en `sources.references_primaires`, ni en `sources.reco_officielle.references`.
C'est un écart à l'**invariant 6** de `CLAUDE.md` (« contenu sourcé… re-vérifier toute sortie IA sur la
source primaire ») — pas un défaut de forme, et il resterait vrai même si P15 n'existait pas.

**Résultat principal de l'instruction : sur les 11 points, 10 sources sont identifiées avec certitude,
1 ne l'est pas.** Le point non identifié (`AAFP 2026`) est aussi le seul qui adosse **un chiffre de
conduite** — c'est donc celui à arbitrer en premier.

### Le registre d'accueil est contraint par le schéma, pas par le goût

`references_primaires` (`schema/decision/noeud.schema.json`, `definitions.referencePrimaire`) **exige**
un `type_critere` ∈ `{dur, mixte, substitution}` — « nature du **critère évalué par la référence** ».
C'est un registre conçu pour des **essais et méta-analyses qui mesurent un critère**.

**Aucune des sources instruites ici n'a de critère évalué** : ce sont un pathway de consensus (ACC),
une revue narrative avec encadré de conduite (JAMA Cardiol), une prise de position de société savante
(SFD), deux RCP, deux sources institutionnelles françaises (ameli, base de données publique des
médicaments), un texte de recommandation européen (ESC/EAS). L'issue *(a)* — « versée en
`references_primaires` » — **est donc structurellement fermée pour les 11 points**, sauf à faire entrer
dans ce registre des objets sans `type_critere`, c'est-à-dire à répéter sur `prescription` ce que le
nœud `insuline` a fait de facto (§6.1 du rapport) et que l'arbitrage de doctrine du 2026-08-11 vient
justement de trancher dans l'autre sens.

Toutes les issues proposées ci-dessous sont donc *(b)* ou *(c)*. **Ce n'est pas un choix rédactionnel,
c'est une lecture du schéma** — et si le référent veut malgré tout *(a)* quelque part, il faut d'abord
décider ce que `type_critere` vaudrait pour un RCP.

### Méthode et niveau de certitude

- Point de départ : **le rapport d'instruction**, citation par citation, jamais une reconstitution.
  Emplacements re-vérifiés ligne à ligne sur les YAML à l'état de la branche `decision/panneau-posologie`.
- Identification : recherche web + PubMed + lecture de la source quand elle est accessible en texte.
  **Chaque « ce que la source dit » ci-dessous a été lu, pas inféré** ; quand seule une partie de
  l'affirmation a pu être confrontée, c'est écrit.
- **Discipline** : une source non identifiée avec certitude est notée `NON IDENTIFIÉE`. Aucune
  correspondance approchante n'est présentée comme trouvée. Aucun DOI, PMID ni lien n'est reconstitué
  de mémoire.

---

## 1. Les 8 citations orphelines — `prescription.yaml` (v0.74)

### 1.1 `ACC 2020` — option « iSGLT2 » (sécurité · `arreter`)

| | |
| --- | --- |
| **Où** | `prescription.yaml` l. 1060 (option), champ `apercu` l. 1112 |
| **Phrase affichée** | « arrêt net, sans demi-dose : aucune relation dose-effet démontrée sur le bénéfice cardio-rénal (ACC 2020). » |
| **Ce qu'elle appuie** | Qu'il n'y a pas lieu de descendre en demi-dose : la molécule s'arrête franchement. |
| **Trace interne** | Changelog l. 3775 uniquement (« rapport OpenEvidence du 2026-08-02 »). Jamais versée en bibliographie. |

**Source réelle identifiée.** Das SR, Everett BM, Birtcher KK, Brown JM, Januzzi JL, Kalyani RR,
Kosiborod M, Magwire M, Morris PB, Neumiller JJ, Sperling LS. *2020 Expert Consensus Decision Pathway
on Novel Therapies for Cardiovascular Risk Reduction in Patients With Type 2 Diabetes: A Report of the
American College of Cardiology Solution Set Oversight Committee.* **J Am Coll Cardiol
2020;76(9):1117-1145.** PMID **32771263** · DOI **10.1016/j.jacc.2020.05.037** · PMC7545583.
Type de document : *Practice Guideline / Consensus Statement* d'une société savante — **un texte de
recommandation**, pas un essai.

**Ce que la source dit, vérifié sur le texte intégral (PMC7545583)** :

> « Because there is no evidence of a graded dose response regarding CV and renal effects, SGLT2
> inhibitors with CV benefit should be initiated at the lowest dose tested in CV and renal outcomes
> trials. »

**Réserve à porter à l'arbitrage.** La source porte **la prémisse** (« aucune relation dose-effet
démontrée sur le bénéfice cardio-rénal ») — dans un contexte d'**instauration**. Elle ne porte **pas la
conclusion** affichée (« arrêt net, sans demi-dose ») : aucune phrase du pathway ne dit qu'il faut
arrêter plutôt que réduire de moitié. C'est une **inférence du nœud**, légitime mais qui est
aujourd'hui présentée au praticien comme citée.

**Issue proposée : *(b)*** — entrée `sources.reco_officielle.references` avec `id` (p. ex.
`acc-2020`), `detail` mentionnant la Section 4 / Table 2 du pathway. **Et** signaler à S6 que la
phrase gagne à distinguer ce que la source dit de ce que le nœud en déduit (R7). *Sans cette
distinction, l'issue (b) rend la citation traçable mais laisse l'inférence non signalée.*

---

### 1.2 à 1.5 `JAMA Cardiol 2020` — 4 occurrences, **une seule et même source**

**Source réelle identifiée, commune aux quatre.** Honigberg MC, Chang LS, McGuire DK, Plutzky J,
Aroda VR, Vaduganathan M. *Use of Glucagon-Like Peptide-1 Receptor Agonists in Patients With Type 2
Diabetes and Cardiovascular Disease: A Review.* **JAMA Cardiol 2020;5(10):1182-1190.**
PMID **32584928** · DOI **10.1001/jamacardio.2020.1966** · PMC7744318.
Type de document : **revue narrative** avec un encadré de conduite pratique — *« Adjusting Other
Antihyperglycemic Therapies at Initiation »*.

**Ce que la source dit, vérifié sur le texte intégral (PMC7744318)** — les trois règles affichées par
le nœud y figurent, aux mêmes seuils :

| Règle affichée par le nœud | Texte de la source |
| --- | --- |
| Sulfamide : arrêt si HbA1c ≤ 7,5 % | « HbA1c ≤7.5% or hypoglycemic episodes: stop sulfonylurea medication » |
| Sulfamide : −50 % si 7,6-8,5 % · maintien si > 8,5 % | « HbA1c 7.6%−8.5%: decrease sulfonylurea medication by 50% » · « HbA1c >8.5%: continue sulfonylurea medication with possibility of future weaning » |
| Insuline : −20 à −30 % si à l'objectif ou hypoglycémie | « decrease basal insulin dose by 20% to 30% if the baseline HbA1c level is at or below target before GLP-1RA initiation or if the patient is experiencing hypoglycemic episodes » |
| Gliptine : arrêt franc, sans chevauchement | « Dipeptidyl peptidase 4 inhibitors should be discontinued before initiating GLP-1RA therapy, given the lack of anticipated additive efficacy owing to overlapping mechanisms of action » (aucune décroissance mentionnée) |

**Les 4 emplacements :**

| # | Option (l.) | Champ (l.) | Phrase affichée |
| --- | --- | --- | --- |
| 1.2 | « Gliptine (redondante) » · `arreter` (1660) | `apercu` (1683) | « arrêt franc, sans fenêtre de chevauchement ni décroissance (JAMA Cardiol 2020). » |
| 1.3 | « Sulfamide » · Traitement à alléger · `arreter` (1934) | `apercu` (1980) | « … à l'introduction d'un AR GLP‑1, arrêt si HbA1c ≤ 7,5 % (avis d'experts, JAMA Cardiol 2020). » |
| 1.4 | « Insuline » · `reduire` (2092) | `apercu` (2120) | « … −10 à −20 %, ou −20 à −30 % si à l'objectif ou hypoglycémie — jamais d'arrêt brutal sans relais (avis d'experts, AAFP 2026 / JAMA Cardiol 2020) … » |
| 1.5 | « Sulfamide — réduire la posologie » (2196) | `apercu` (2252) | « à l'introduction d'un AR GLP‑1 : −50 % si HbA1c 7,6-8,5 % · maintien de la dose si > 8,5 % (avis d'experts, JAMA Cardiol 2020) … » |

**Deux réserves à porter à l'arbitrage.**

1. **Le registre est un cas limite.** Le schéma décrit `reco_officielle.references` comme des
   « citations PRÉCISES des **textes officiels** ». Une revue de *JAMA Cardiology* n'est pas un texte
   officiel — c'est un **avis d'experts**, ce que le nœud écrit d'ailleurs lui-même en toutes lettres
   trois fois sur quatre. Mais *(a)* lui est fermé (pas de `type_critere`), et *(c)* ferait perdre la
   traçabilité de trois chiffres de conduite. **Le seul registre praticable est *(b)***, au prix d'une
   `description` de champ légèrement extensive.
2. **« Jamais d'arrêt brutal sans relais » (1.4) n'a pas été retrouvé dans la source.** Les chiffres
   l'ont été ; cette clause-là, non. Elle est probablement vraie et prudente, mais elle n'est pas
   couverte par la citation qui la suit.

**Issue proposée pour les quatre : *(b)*** — une **seule** entrée
`sources.reco_officielle.references` (p. ex. `id: jama-cardiol-2020`), `nom` « JAMA Cardiol 2020 »,
`lien` le DOI, `detail` nommant l'encadré et **la nature du document** (« revue narrative, encadré de
conduite pratique — avis d'experts, pas une recommandation de société savante »). Les quatre notes de
posologie pointent le même `id`.

---

### 1.6 `AAFP 2026` — option « Insuline » (Traitement à alléger · `reduire`)

| | |
| --- | --- |
| **Où** | `prescription.yaml` l. 2092 (option), champ `apercu` l. 2120 |
| **Phrase affichée** | « en relais thérapeutique (introduction d'un autre agent) : **−10 à −20 %**, ou −20 à −30 % si à l'objectif ou hypoglycémie — jamais d'arrêt brutal sans relais (avis d'experts, AAFP 2026 / JAMA Cardiol 2020) ; en allègement isolé hors relais : au jugement clinique, aucun rythme chiffré sourcé. » |
| **Ce qu'elle appuie** | Le palier **« −10 à −20 % »** — le seul chiffre de cette phrase que Honigberg 2020 ne couvre pas (celui-ci ne donne que le −20 à −30 %). |

**Recherche menée.** Le seul article d'*American Family Physician* de 2026 portant sur ce sujet est :
Marrison ST, Bragg S, Tran E. *Type 2 Diabetes: Outpatient Insulin Management.* **Am Fam Physician
2026;113(6):542-550.** Deux lectures ciblées du texte (recherche explicite de « 10 % », « 20 % »,
« 30 % », « reduce », « decrease », « taper », « deintensify », et de toute table d'ajustement à
l'introduction d'un AR GLP‑1) **n'y trouvent aucune consigne chiffrée de réduction d'insuline**. La
seule phrase pertinente est : « *Insulin doses may need to be decreased when starting these
medications to avoid hypoglycemia* » — sans pourcentage. Recherches complémentaires (site `aafp.org`,
autres numéros 2026, articles AFP de déprescription) : rien d'autre.

**Verdict : `NON IDENTIFIÉE`.** Une référence bibliographique **candidate** existe (Am Fam Physician
2026;113(6):542-550) mais **elle ne porte pas l'affirmation qu'elle est censée appuyer**. Verser ce
candidat en bibliographie créerait exactement la mésattribution que D3 a corrigée sur `insuline` le
2026-07-29 : une citation vérifiable pointant vers un texte qui ne dit pas ce qu'on lui fait dire.

**Issue proposée : *(c)*, avec conséquence sur le contenu affiché.** Retirer la mention « AAFP 2026 »
**et** le palier « −10 à −20 % » qu'elle seule adossait, en ne conservant que ce qui est sourcé :
« −20 à −30 % si à l'objectif ou hypoglycémie (avis d'experts, JAMA Cardiol 2020) ». Le nœud dispose
déjà du gabarit exact pour le reste — « au jugement clinique, aucun rythme chiffré sourcé » — qu'il
emploie dans la seconde moitié de la même phrase.

> **C'est le seul des 11 points dont l'issue modifie un chiffre lu par le praticien.** Il est
> d'un autre ordre que les dix autres : ceux-là déplacent une citation, celui-ci retire une conduite
> chiffrée dont la source n'a pas été retrouvée. **À arbitrer en premier**, et à ne pas régler par
> défaut. Si le référent connaît la source réelle du « −10 à −20 % », l'issue bascule en *(b)* et
> aucun chiffre ne bouge.

---

### 1.7 `Assurance Maladie (ameli)` — option « Metformine » (Socle · `ajouter`)

| | |
| --- | --- |
| **Où** | `prescription.yaml` l. 841 (option), champ `posologie_detail[5]` l. 915 |
| **Phrase affichée** | « Source des cinq points ci-dessus : Assurance Maladie (ameli), mémo médecin « Prescription de metformine chez le patient diabétique de type 2 ». » |
| **Ce qu'elle appuie** | Les **cinq items précédents** du même panneau : dose de départ, paliers de 15 jours, exemple à 2 g/j, conduite en cas d'intolérance digestive, répartition des prises / Stagid®. C'est une **ligne de source globale**, déjà exactement ce que P15 veut transformer en note. |

**Source réelle identifiée.** Assurance Maladie — ameli.fr, espace Médecin, mémo
**« Diabète de type 2 : la metformine en points clés »**, qui met à disposition le mémo imprimable
« Prescription de metformine chez le patient diabétique de type 2 ».
Lien : `https://www.ameli.fr/medecin/exercice-liberal/memos/troubles-endocriniens/diabete/prise-en-charge-et-suivi-du-patient/prise-en-charge/memo-metformine`
(page miroir : `.../medecin/sante-prevention/pathologies/diabete-type-2/memo-metformine`).
**Aucune date d'édition n'est affichée** — ce que le commentaire YAML du nœud (l. 904-905) avait déjà
constaté, et qui se confirme.

**Ce que la source dit** : le contenu du mémo (paliers de 15 jours, « ½ cp matin + 1 cp soir en milieu
de repas », retour au palier précédent en cas de nausées ou de diarrhées) **correspond aux cinq items**
tels qu'ils sont rédigés dans le nœud. *Le PDF n'a pas pu être ouvert en texte depuis cette session
(ameli.fr répond `403` aux requêtes automatisées) : la concordance est établie sur la page publique et
sur les extraits qu'elle expose, pas sur une lecture intégrale du PDF.*

**Issue proposée : *(b)*** — entrée `sources.reco_officielle.references` avec `id` (p. ex.
`ameli-memo-metformine`), `nom` « Assurance Maladie (ameli) », `lien` l'URL ci-dessus, `detail` le
titre exact du mémo **et** la mention « aucune date d'édition affichée ». Source institutionnelle
française : c'est précisément le cas que l'arbitrage de doctrine du 2026-08-11 a ouvert.

---

### 1.8 `base de données publique des médicaments` — option « AR GLP‑1 » (Le choix de l'agent · `ajouter`)

| | |
| --- | --- |
| **Où** | `prescription.yaml` l. 1298 (option), champ `posologie_detail[4]` l. 1451 |
| **Phrase affichée** | « Sources : RCP EMA/ANSM Victoza, Ozempic et Trulicity, rubrique 4.2 ; **disponibilité France vérifiée sur la base de données publique des médicaments**. » |
| **Ce qu'elle appuie** | La **commercialisation effective en France** des présentations citées — c'est ce contrôle, et lui seul, qui a fait écarter le palier 2 mg/semaine du sémaglutide (commentaire YAML l. 1374-1376). Ce n'est pas une source de posologie, c'est une source de **disponibilité**. |

**Source réelle identifiée.** **Base de données publique des médicaments**,
`https://base-donnees-publique.medicaments.gouv.fr` — « mise en œuvre par l'Agence nationale de
sécurité du médicament et des produits de santé (ANSM), en liaison avec la Haute Autorité de santé
(HAS) et l'Union nationale des caisses d'assurance maladie (UNCAM), sous l'égide du ministère des
Affaires sociales et de la santé ». Périmètre : médicaments commercialisés, ou l'ayant été, au cours
des trois dernières années en France.

**Issue proposée : *(b)*** — entrée `sources.reco_officielle.references` avec `id` (p. ex. `bdpm`),
`nom` « Base de données publique des médicaments (ANSM) », `lien` l'URL, `detail` précisant l'usage
qui en est fait dans ce nœud (**vérification de commercialisation France**, pas de posologie). La même
entrée sert alors aux autres endroits où le nœud s'appuie sur ce contrôle.

> **Variante à considérer, *(c)*** : la mention est un **contrôle de méthode**, pas une autorité
> clinique. Si le référent juge que « disponibilité France vérifiée » n'a pas à figurer sur l'écran de
> consultation, elle peut sortir sans que l'affirmation perde quoi que ce soit — les doses affichées
> restent celles des RCP. Je propose *(b)* parce que ce contrôle est ce qui distingue ce nœud d'une
> simple recopie de RCP européen, et que le perdre de vue est précisément le piège que le commentaire
> YAML signale.

---

## 2. Les 2 citations douteuses — option « Sulfamide (DFG < 30) » (sécurité · `arreter`)

Les deux vivent dans la **même phrase**, `prescription.yaml` l. 1017 (option), `apercu` l. 1058 :

> « arrêt, sans décroissance ; l'hypoglycémie peut persister après la dernière prise, par accumulation
> **(RCP, rubrique 4.4)** — seuil DFG < 30 cité par **la SFD (2023/2025)**. »

### 2.1 « RCP, rubrique 4.4 » — **quel RCP de sulfamide ?**

**Ce que le rapport signalait.** L'entrée RECO « RCP ANSM » du nœud énumère metformine, iSGLT2,
incrétines, répaglinide — **ni les sulfamides, ni la rubrique 4.4** n'y figurent. Et le nœud ne nomme
aucune molécule de sulfamide.

**Sources réelles identifiées — les deux RCP français de la classe, lus l'un et l'autre :**

- **Gliclazide** — *GLICLAZIDE MYLAN PHARMA 60 mg, comprimé à libération modifiée*, base de données
  publique des médicaments (`specid=65571438`). **Rubrique 4.4, verbatim** :
  > « La pharmacocinétique et/ou la pharmacodynamie du gliclazide peuvent être modifiées chez les
  > patients présentant une insuffisance hépatique ou une insuffisance rénale sévère. Chez ces
  > patients, **l'hypoglycémie pouvant être prolongée**, une prise en charge appropriée doit être
  > instituée. »
  Rubrique 4.3 : « insuffisance rénale ou hépatique sévère (dans ces situations, il est recommandé de
  recourir à l'insuline) ».
- **Glimépiride** — *AMAREL 4 mg, comprimé*, RCP ANSM (ecodex `R0215307`). **Rubrique 4.4, verbatim** :
  > « En cas d'hypoglycémie sévère ou **prolongée**, même si elle est temporairement contrôlée par une
  > absorption de sucre, un traitement médical immédiat voire une hospitalisation peuvent s'imposer. »

**Ce que ça règle.** L'affirmation affichée **est exacte et vérifiable** : la persistance de
l'hypoglycémie après la dernière prise, par modification pharmacocinétique en insuffisance rénale
sévère, est le libellé même de la rubrique 4.4 du gliclazide. Ce qui manquait n'était pas la source,
c'était **son adresse**.

**Ce que ça ne rouvre pas.** Le dossier `chantier-2026-07-27/preuve-seuils-renaux-su-glinide.md` §1.4
a établi que **gliclazide et glimépiride portent le même libellé de contre-indication** et qu'**aucune
source de rang recommandation ne différencie les molécules** sur le critère rénal — la conclusion 4 de
ce dossier étant explicitement « ne pas introduire de distinction gliclazide / glimépiride ». Citer
« RCP » au niveau de la classe est donc **conforme à la doctrine déjà arrêtée**, et nommer une molécule
serait une régression.

**Issue proposée : *(b)*** — une entrée `sources.reco_officielle.references` avec `id` (p. ex.
`rcp-sulfamides`), `nom` « RCP sulfamides (ANSM) », `detail` nommant **les deux** RCP lus et la
rubrique : « gliclazide (rubrique 4.4 : hypoglycémie pouvant être prolongée en insuffisance rénale
sévère ; 4.3 : contre-indication) et glimépiride (rubrique 4.4) — libellé de classe, aucune distinction
inter-molécule (cf. `preuve-seuils-renaux-su-glinide.md` §1.4) ». **Pas** `À ARBITRER` : la source est
identifiée.

### 2.2 « la SFD (2023/2025) » — **le millésime 2023 est-il un reliquat ?**

**Réponse : non. C'est une concordance délibérée, et elle est déjà documentée dans le projet.**

`docs/decision/validation/chantier-2026-07-27/preuve-seuils-renaux-su-glinide.md` porte la référence
complète en annexe : **Darmon P, et al., prise de position de la SFD, *Méd Mal Métab* 2023;17(8):664-693,
DOI 10.1016/j.mmm.2023.10.007** (PDF hébergé par la SFD). Le §1.4 du même dossier en fait un usage
explicite : « **SFD 2023 et 2025** : parlent uniquement de “SU” / “sulfamides hypoglycémiants” **en
classe** ». Le millésime 2023 dit donc quelque chose de précis : **le seuil est stable d'une prise de
position à l'autre** — il n'a pas été introduit par la version 2025.

Ce que le rapport constatait est exact : « SFD 2025 » existe en `reco_officielle.references` du nœud,
« SFD 2023 » **n'y existe pas**. Le défaut n'est pas la mention, c'est son absence de registre.

**Issue proposée : *(b)*** — ajouter une entrée `sources.reco_officielle.references` avec `id`
(p. ex. `sfd-2023`), `nom` « SFD 2023 », `lien` le DOI ci-dessus, `detail` : « prise de position SFD
2023, Méd Mal Métab 2023;17(8):664-693 — porte le même seuil de DFG 30 pour les sulfamides en classe
que la prise de position 2025 ; citée pour la **concordance** entre les deux millésimes ». La note de
source de la posologie pointe alors `sfd-2023` **et** `sfd-2025`.

> **Variante à considérer, *(c)*** : n'afficher que « SFD » et laisser les deux millésimes à la
> bibliographie. La conduite est identique dans les deux textes ; le double millésime dans la ligne de
> lecture est précisément le genre d'incise que P15 cherche à en sortir. Je propose *(b)* parce que la
> concordance 2023/2025 est une **information de solidité**, pas un ornement — mais elle appartient à
> la note, pas à la phrase.

---

## 3. Le paragraphe CYP3A4 — `statine.yaml` (v1.30)

| | |
| --- | --- |
| **Où** | `statine.yaml` l. 804 (option « Statine — prévention primaire », repli), champ `posologie_detail[1]` l. 853 |
| **Texte affiché** | « Choix de molécule : pravastatine, rosuvastatine et pitavastatine sont moins sujettes aux interactions par le CYP3A4 que simvastatine et atorvastatine — à préférer en cas de co-prescription à risque (macrolides, azolés, amiodarone, vérapamil et diltiazem, inhibiteurs de protéase, pamplemousse). » |
| **Statut de départ** | **Aucune citation, d'aucune sorte.** Affirmation pharmacologique **actionnable** (elle dit quelle molécule prescrire) et entièrement non sourcée. Le même contenu apparaît en `contre_indications` (l. 625) et dans une alerte de nœud (l. 934). |

**Source réelle identifiée — et elle est déjà dans la bibliographie du nœud.** Mach F, et al.
*2019 ESC/EAS Guidelines for the management of dyslipidaemias.* **Eur Heart J 2020;41(1):111-188.**
Le nœud la porte déjà en `sources.reco_officielle.references` sous le `nom` « ESC/EAS 2019 ».

**Ce que la source dit, lu sur le texte (p. 138-139)** — les deux moitiés de l'affirmation y sont :

- **§8.1.4 / §8.1.4.6** : « All currently available statins — **except pravastatin, rosuvastatin, and
  pitavastatin** — undergo major hepatic metabolism via the CYPs… Pravastatin does not undergo
  metabolism through the CYP system, but is metabolized by sulfation and conjugation. **CYP3A4
  isoenzymes are the most abundant** ».
- **Table 10** (« Drugs potentially interacting with statins metabolized by cytochrome P450 3A4 leading
  to increased risk of myopathy and rhabdomyolysis »), contenu intégral :
  *Anti-infective agents* — itraconazole, kétoconazole, posaconazole, érythromycine, clarithromycine,
  télithromycine, inhibiteurs de protéase du VIH ; *Calcium antagonists* — vérapamil, diltiazem,
  amlodipine ; *Other* — ciclosporine, danazol, amiodarone, ranolazine, **jus de pamplemousse**,
  néfazodone, gemfibrozil.

**La correspondance est exacte, terme à terme.** Le trio « pravastatine, rosuvastatine, pitavastatine »
du nœud est **la liste d'exception de l'ESC/EAS, mot pour mot**, et les six familles citées
(macrolides, azolés, amiodarone, vérapamil/diltiazem, inhibiteurs de protéase, pamplemousse) sont
toutes dans la Table 10. Le nœud **omet** amlodipine, ciclosporine, danazol, ranolazine, néfazodone,
gemfibrozil et fluvastatine — omissions, aucune erreur, aucune affirmation en trop.

**Issue proposée : *(b)*, sans aucune réécriture clinique.** Le paragraphe est **juste** ; il lui
manquait uniquement son adresse. Note de source pointant l'entrée `ESC/EAS 2019` de
`sources.reco_officielle.references` une fois qu'elle porte un `id` (p. ex. `esc-eas-2019`), avec
`detail` enrichi : « §8.1.4.6 et **Table 10** (médicaments interagissant avec les statines
métabolisées par le CYP3A4) ». **Ni reformulation R7 ni retrait ne sont nécessaires** — c'était
l'issue de repli prévue par le brief si aucune source n'était trouvée ; elle ne s'applique pas.

> Les deux autres emplacements du même contenu (`contre_indications` l. 625, alerte l. 934) sortent du
> périmètre des 11 points. **Ils tombent sous le même sourçage** : à traiter dans le même geste en S7
> si le référent le souhaite, plutôt que de laisser le nœud sourcé à un endroit sur trois.

---

## 4. Tableau récapitulatif — une ligne par point

| # | Citation affichée | Nœud · option · champ | Source identifiée | Issue proposée |
| --- | --- | --- | --- | --- |
| 1 | `ACC 2020` | `prescription` · iSGLT2 (sécurité·arrêter) · `apercu` | **OUI** — Das SR et al., ACC Expert Consensus Decision Pathway, J Am Coll Cardiol 2020;76(9):1117-1145, PMID 32771263 | **(b)** `reco_officielle.references` + `id` · **et** signaler que « arrêt net, sans demi-dose » est une inférence du nœud, pas une phrase de la source |
| 2 | `JAMA Cardiol 2020` | `prescription` · Gliptine (redondante) · `apercu` | **OUI** — Honigberg MC et al., JAMA Cardiol 2020;5(10):1182-1190, PMID 32584928 | **(b)** — entrée unique partagée par les points 2 à 5 |
| 3 | `JAMA Cardiol 2020` | `prescription` · Sulfamide (alléger·arrêter) · `apercu` | **OUI** — idem (seuil 7,5 % vérifié verbatim) | **(b)** — même `id` |
| 4 | `JAMA Cardiol 2020` | `prescription` · Insuline (alléger·réduire) · `apercu` | **OUI** — idem (−20 à −30 % vérifié verbatim ; « jamais d'arrêt brutal sans relais » **non retrouvé** dans la source) | **(b)** — même `id` |
| 5 | `JAMA Cardiol 2020` | `prescription` · Sulfamide — réduire la posologie · `apercu` | **OUI** — idem (−50 % / maintien vérifiés verbatim) | **(b)** — même `id` |
| 6 | `AAFP 2026` | `prescription` · Insuline (alléger·réduire) · `apercu` | **`NON IDENTIFIÉE`** — candidat unique (Am Fam Physician 2026;113(6):542-550) **ne portant pas** le chiffre « −10 à −20 % » | **(c)** — retirer la citation **et** le palier « −10 à −20 % » qu'elle seule adossait ⚠ **seul point qui touche un chiffre affiché** |
| 7 | `Assurance Maladie (ameli)` | `prescription` · Metformine (socle·ajouter) · `posologie_detail[5]` | **OUI** — mémo ameli.fr « Prescription de metformine chez le patient diabétique de type 2 » (aucune date d'édition affichée) | **(b)** `reco_officielle.references` + `id` |
| 8 | `base de données publique des médicaments` | `prescription` · AR GLP‑1 (choix·ajouter) · `posologie_detail[4]` | **OUI** — BDPM, ANSM/HAS/UNCAM, `base-donnees-publique.medicaments.gouv.fr` | **(b)** `reco_officielle.references` + `id` · *variante (c) : contrôle de méthode, peut sortir de l'écran* |
| 9 | `RCP, rubrique 4.4` | `prescription` · Sulfamide (DFG < 30) · `apercu` | **OUI** — RCP gliclazide (Mylan 60 mg LM, rub. 4.4) **et** glimépiride (Amarel 4 mg, rub. 4.4), verbatim | **(b)** entrée de **classe**, sans distinction inter-molécule (conforme au dossier 2026-07-27 §1.4) |
| 10 | `la SFD (2023/2025)` | `prescription` · Sulfamide (DFG < 30) · `apercu` | **OUI** — 2023 **n'est pas un reliquat** : Darmon P et al., Méd Mal Métab 2023;17(8):664-693, DOI 10.1016/j.mmm.2023.10.007 | **(b)** ajouter l'entrée `SFD 2023` (la 2025 existe déjà) · *variante (c) : n'afficher que « SFD »* |
| 11 | *(aucune citation)* — paragraphe CYP3A4 | `statine` · Statine — prévention primaire · `posologie_detail[1]` | **OUI** — ESC/EAS 2019 (Mach F et al., Eur Heart J 2020;41:111-188), §8.1.4.6 + **Table 10** — **déjà dans la biblio du nœud** | **(b)** note de source vers `ESC/EAS 2019` · **aucune réécriture clinique nécessaire** |

**Lecture d'ensemble : 10 sources identifiées sur 11, 9 issues *(b)*, 1 issue *(c)*, 1 non identifiée.**
Aucune issue *(a)* n'est proposée — `references_primaires` exige un `type_critere`, qu'aucune de ces
sources ne possède (§0).

---

## 5. Trois constats trouvés en chemin — **hors des 11 points**, signalés sans être instruits

1. **`ACC 2020` a une seconde occurrence affichée**, dans le message d'une alerte d'option
   (`prescription.yaml` l. 1284) : « … au moins 3 jours avant une chirurgie programmée (**4 jours pour
   l'ertugliflozine** — ACC 2020) ». Le pathway ACC 2020 porte bien « *Discontinue at least 3 days
   before a planned surgery to prevent postoperative ketoacidosis* » (Table 2), **mais le délai de
   4 jours propre à l'ertugliflozine n'y a pas été retrouvé**. Ce délai existe par ailleurs, mais dans
   un autre registre documentaire que celui cité. **À vérifier avant que l'entrée `acc-2020` ne serve
   aussi à cette alerte** — sinon le point 1 est réglé et un second, identique, reste ouvert.
2. **La pitavastatine est bien commercialisée en France** (spécialité **LIPPIZA**, pitavastatine
   calcique) — la recommandation de molécule du point 11 est donc actionnable dans le contexte
   français. Vérification secondaire, non bloquante, faite parce que le nœud `prescription` applique
   ailleurs ce contrôle de disponibilité de façon systématique (§1.8).
3. **Le paragraphe CYP3A4 vit à trois endroits** de `statine.yaml` (l. 625, 853, 934) et n'est sourcé
   à aucun. Le point 11 n'en couvre qu'un.

---

## 6. Arbitrage — tranché par Thibault le 2026-08-11

| # | Point | Décision du référent | Remarque |
| --- | --- | --- | --- |
| 1 | ACC 2020 — iSGLT2 (sécurité) | **(b)** appliquée telle que proposée | `reco_officielle.references` + `id acc-2020` ; signaler l'inférence (arrêt vs demi-dose) |
| 2 | JAMA Cardiol 2020 — Gliptine redondante | **Ni (b) ni (c) — voir Q1 ci-dessous** | pas d'entrée `sources[]` structurée |
| 3 | JAMA Cardiol 2020 — Sulfamide (arrêter) | idem 2 | idem |
| 4 | JAMA Cardiol 2020 — Insuline (réduire) | idem 2 | idem |
| 5 | JAMA Cardiol 2020 — Sulfamide (réduire) | idem 2 | idem |
| 6 | AAFP 2026 — Insuline (réduire) | **Garder en l'état** | ni la citation ni le chiffre « −10 à −20 % » ne bougent en S6 ; recherche de la source réelle **hors P15**, remontée au backlog |
| 7 | ameli — Metformine (socle) | **(b)** appliquée telle que proposée | `reco_officielle.references` + `id ameli-memo-metformine` |
| 8 | Base de données publique des médicaments — AR GLP‑1 | **(b)** appliquée telle que proposée | `reco_officielle.references` + `id bdpm` |
| 9 | RCP rubrique 4.4 — Sulfamide (DFG < 30) | **(b)** appliquée telle que proposée | `id rcp-sulfamides`, entrée de classe |
| 10 | SFD 2023/2025 — Sulfamide (DFG < 30) | **(b)** appliquée telle que proposée | ajouter l'entrée `sfd-2023` |
| 11 | CYP3A4 — Statine prévention primaire | **(b)** appliquée telle que proposée | `id esc-eas-2019`, déjà en bibliographie |

### Q1 — JAMA Cardiol 2020 (points 2 à 5) : **pas de 3ᵉ registre, doctrine D48 inchangée**

**Trouvaille faite après la question initiale, avant toute exécution** : `sources.reco_officielle`
n'est pas un registre ouvert à toute autorité — sa `description` au schéma exclut nommément « une revue
secondaire indépendante (Prescrire, Médicalement Geek, ebmfrance…) ». Et **D48** (2026-08-04, amende
D23) a **supprimé** le canal `synthese_critique.references` qui accueillait précisément ce type de
source, pour ce motif écrit dans le schéma : *« ces revues restaient affichées à l'écran comme
référence d'une position, ce qui laissait le nom d'une revue tenir lieu de preuve là où D23 voulait
précisément l'inverse. »* JAMA Cardiol 2020 est une revue narrative avec encadré de conduite — le cas
exact que D48 exclut.

**Décision (2026-08-11, après relecture de D48)** : **pas de 3ᵉ registre, doctrine D48 inchangée.**
Les points 2 à 5 ne reçoivent **aucune entrée `sources[]` structurée**. Le texte garde sa mention
« avis d'experts » en prose libre (déjà écrite 3 fois sur 4 dans le nœud actuel) — l'attribution reste
lisible par le praticien, mais ne prend pas la forme d'une citation résolue vers un id de bibliographie.
**Conséquence pour S6** : sur ces 4 items, ne pas créer d'entrée `reco_officielle`, ne pas remplir
`sources[]` de l'item de posologie migré ; conserver « avis d'experts » (sans nommer la revue comme
preuve) dans le `texte`, au même registre que le reste du nœud.

### Q2 — Périmètre : **inclus dans S6/S7**

- **ACC 2020, seconde occurrence** (`prescription.yaml` l. 1284, alerte : « … 4 jours pour
  l'ertugliflozine — ACC 2020 »). Le délai de 3 jours est bien dans le pathway (Table 2) ; **le délai
  spécifique de 4 jours pour l'ertugliflozine n'y a pas été retrouvé**. À vérifier par S6 avant de
  faire pointer `acc-2020` vers cette seconde occurrence — si la source ne le porte pas, même
  traitement que le point 6 (garder le chiffre, ne pas le sourcer faussement).
- **CYP3A4, 2 occurrences supplémentaires** (`statine.yaml` l. 625 `contre_indications`, l. 934
  alerte de nœud) — même contenu que le point 11, sourcé à un seul endroit sur trois aujourd'hui. À
  traiter par **S7** dans le même geste : les trois occurrences pointent vers `esc-eas-2019`.
