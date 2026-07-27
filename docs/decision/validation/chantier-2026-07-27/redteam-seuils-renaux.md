# Red-team adversarial — seuils rénaux sulfamide / glinide (audit de `preuve-seuils-renaux-su-glinide.md`)

- **Statut** : red-team en LECTURE SEULE. Aucun fichier de `content/**`, aucun test, ni le rapport
  audité n'ont été modifiés. Ce fichier est le seul écrit.
- **Cible de l'audit** : `docs/decision/validation/chantier-2026-07-27/preuve-seuils-renaux-su-glinide.md`
- **Confrontés** : `OE-retour-brut.md` (sections « sulfonylureas in CKD » et « repaglinide »),
  `chantier-2026-07-26/rcp-glinide-insuffisance-renale.md`,
  `content/noeuds/diabete-type-2/prescription.yaml`.
- **Méthode** : re-téléchargement et ré-extraction INDÉPENDANTE de chaque source primaire
  (`curl` + `pdftotext -layout -enc UTF-8`), résolution de chaque DOI via l'API Crossref, de chaque
  PMID via `efetch` NCBI. Je n'ai repris aucune citation du rapport audité sans la relire dans le
  document source. Date : 2026-07-27.

---

## Verdict global en une phrase

**Le rapport audité tient : les 7 affirmations pivots sont VRAIES, tous ses PMID/DOI existent et
correspondent, tous ses verbatim sont exacts au caractère près — et c'est OpenEvidence qui se trompe,
deux fois, sur les deux négations françaises ; mais le rapport est INCOMPLET (il a manqué la source
que l'OE, lui, avait vue et qui est authentique), il commet exactement la faute d'identité de source
qu'il se félicite d'avoir évitée (Zanchi 2012 n'est pas une « revue secondaire »), et sa conclusion
« aucun changement de comportement du moteur n'en découle » minimise trois conséquences directes de
ses propres trouvailles.**

Bilan chiffré : **0 finding HAUTE · 4 MOYENNE · 5 BASSE**, et **4 angles morts déclarés que j'ai
réussi à ouvrir** (tous confirment le rapport).

---

## 1. La divergence OE / agent, tranchée

C'était la priorité absolue de la mission. **L'agent a raison sur les deux questions ; OpenEvidence a
tort sur les deux.** Je l'établis en ouvrant les documents, pas en arbitrant entre deux résumés.

### 1.1 « No specific SFD/HAS guideline text on sulfonylurea eGFR thresholds was identified » — FAUX

Le texte existe, il est français, il est de rang recommandation, et il est de 2025.

PDF `11-698.pdf` téléchargé depuis `sfdiabete.org` (15 360 445 octets), en-tête du document :
`Med Mal Metab 2025; 19: 630-662`, « Disponible sur internet le 13 novembre 2025 », rubrique
« Recommandations et référentiels », Darmon P, Bauduceau B, Bordier L, Detournay B, Dupuy O,
Gourdy P, et al. **Tableau I, notes de bas de page, verbatim relu par moi :**

> `1`Stade 4 : débit de filtration glomérulaire (DFG) entre 15 et 29 mL/min/1,73 m2 ; stade 5 :
> DFG < 15 mL/min/1,73 m2.
>
> `2`Les sulfamides hypoglycémiants sont contre-indiqués en cas d'IRC sévère ou terminale.

**Avis n° 12** (p. 643), verbatim :

> Chez les patients vivant avec un DT2 et présentant une IRC sévère (DFG entre 15 et
> 29 mL/min/1,73 m2) ou terminale (DFG < 15 mL/min/1,73 m2), on visera une HbA1c cible 8 %
> (64 mmol/mol), avec une limite inférieure de 7 % (53 mmol/mol) en cas de traitement par glinide ou
> insuline **(SU contre-indiqués)**, pour minimiser le risque hypoglycémique.

Le chiffre et la contre-indication sont **dans la même phrase**. Il n'y a pas de déduction à faire.
OE affirme le contraire ; OE a manifestement raisonné sur la littérature anglophone indexée et
présenté « je n'ai pas trouvé » comme « il n'existe pas ».

### 1.2 « No specific French guideline text on repaglinide in ESRD was identified » — FAUX

**SFD 2025, Avis n° 12 bis** (p. 644), verbatim :

> Au stade d'IRC terminale (DFG < 15 mL/min/1,73 m2), parmi les molécules commercialisées en France,
> seuls l'insuline, le **répaglinide** (avec un risque d'hypoglycémies pour ces deux traitements), la
> vildagliptine à la dose de 50 mg/j et la sitagliptine à la dose de 25 mg/j (forme non
> commercialisée en France) peuvent être utilisés.

**HAS 2024, R.78 (grade C)**, `strategie_therapeutique_..._-_recommandations.pdf` p. 23, verbatim :

> ‒ **répaglinide (demi-vie courte) et en raison de sa « non-CI » en cas de maladie rénale** ;

Deux sources françaises, deux niveaux de rang recommandation, nommant le répaglinide. La négation
d'OE est fausse.

### 1.3 Ce sur quoi OE, lui, a raison — et où le rapport a manqué quelque chose

OE attribue à l'**Endocrine Society 2019** des seuils chiffrés explicites. **J'ai vérifié : c'est
exact, mot pour mot.** LeRoith D, et al., *Treatment of Diabetes in Older Adults: An Endocrine
Society Clinical Practice Guideline*, JCEM 2019;104(5):1520-1574, DOI 10.1210/jc.2019-00198,
PMID 30903688 (DOI et PMID résolus, métadonnées concordantes). Texte intégral lu sur PMC7271968,
section « Chronic kidney disease in older adults with diabetes », sous la recommandation **5.16
(1|⊕⊕OO)**, verbatim :

> SUs and their metabolites are renally cleared, leading to an increased risk of hypoglycemia as GFR
> declines. **Glyburide should be avoided with an eGFR <60 mL/min/1.73 m2.** Glimepiride should be
> **used with caution if the eGFR is <60** mL/min/1.73 m2 and **should not be used with an
> eGFR <30** mL/min/1.73 m2. Less than 10% of glipizide is cleared renally, but it should still be
> used with caution with an eGFR <30 mL/min/1.73 m2.

Et, sur notre seconde question, une phrase que le rapport aurait dû trouver :

> **Repaglinide appears safe for use in CKD but should be used with caution when the eGFR is
> <30 mL/min/1.73 m2** *(référence 416)*.

Sa **référence 416 est Hasslacher 2003** — c'est-à-dire exactement l'étude que le rapport cite au
§2.4. Autrement dit : une société savante internationale a déjà fait la traduction
« Hasslacher → conduite clinique », et le rapport ne l'a pas vue.

Le même contenu figure en **Table 7** (« Medications Used to Treat Hyperglycemia and Special Concerns
With Use in Older Patients With CKD and CVD ») : *Glyburide: avoid if eGFR <60 · Glimepiride: avoid
if eGFR <30 · Glipizide: use with caution if eGFR <30 · Nateglinide: stop if eGFR <60 but can use if
patient is on dialysis · Repaglinide: use with caution if eGFR <30*.

C'est le **finding MOYENNE-2** ci-dessous. Portée : source non française, périmètre limité aux ≥ 65
ans, gliclazide absent (non commercialisé aux États-Unis) — donc elle ne renverse rien, mais elle
**converge indépendamment sur 30 pour le glimépiride**, molécule vendue en France, et elle contredit
frontalement la phrase du rapport « Deux sources différencient les molécules, mais aucune n'est
utilisable ici ».

**Verdict sur OE** : sur les deux négations françaises, OE est faux et son « was identified » masque
un simple « je n'ai pas cherché en français ». Sur les seuils Endocrine Society et sur la
rationnelle PK gliclazide/glimépiride, OE est **exact et vérifié**. C'est le premier retour OE de ce
dépôt qui apporte une source authentique que l'agent n'avait pas ; il mérite d'être noté comme tel.

---

## 2. Les 7 affirmations pivots, une par une

| # | Affirmation | Verdict | Preuve que J'AI lue |
|---|---|---|---|
| 1a | SFD 2025 Tab. I note 2 « SU contre-indiqués en IRC sévère ou terminale » | **VRAI, verbatim exact** | `sfd2025.pdf` l. 204 de l'extraction |
| 1b | note 1 définit stade 4 = 15-29, stade 5 = < 15 | **VRAI, verbatim exact** | idem l. 203 |
| 1c | Avis n° 12 contient « (SU contre-indiqués) » attaché aux plages chiffrées | **VRAI, verbatim exact** | idem p. 643 |
| 1d | Avis n° 12 bis, liste fermée sous 15, répaglinide nommément | **VRAI, verbatim exact** | idem p. 644 |
| 1 | Prise de position SFD 2025 = Méd Mal Métab 2025;19(8):630-662, DOI 10.1016/j.mmm.2025.10.002 | **VRAI** | Crossref : titre, revue, 19(8), 630-662, 2025 — concordance parfaite |
| 2 | Libellé identique en SFD 2023 (Avis n° 23/24) | **VRAI pour l'essentiel, une inexactitude** | voir BASSE-2 |
| 3 | HAS 2024 R.78 grade C, répaglinide, « non-CI » en maladie rénale | **VRAI, verbatim exact** | `has_reco.txt` l. 1303, p. 23 |
| 4 | KDIGO 2022 ne porte AUCUN chiffre sur les sulfamides | **VRAI, et même plus solide que dit** | voir §2.4 |
| 5 | Aucun seuil de DFG attaché aux sulfamides dans les 3 docs HAS 2024 | **VRAI — recherche refaite à l'aveugle** | voir §2.5 |
| 6 | Marbury 2000 : bras hémodialysé n=6, dosage du dialysat, phrase citée ; étude DISTINCTE du RCP 5.2 | **VRAI, et j'ai identifié l'autre étude** | voir §2.6 |
| 7 | Hasslacher 2003 : 281 patients, p=0,074 sous répaglinide vs p=0,007 en run-in | **VRAI, verbatim exact** | `efetch` PMID 12610054 |

### 2.4 KDIGO — confirmé, et le rapport est même en dessous de la vérité

`KDIGO-2022-...pdf` retéléchargé : **8 242 002 octets**, exactement la taille annoncée par le rapport
(indice fort qu'il a réellement ouvert le fichier). Extraction, recherche exhaustive sur
`sulfonylurea|sulphonylurea|glipizide|gliclazide|glimepiride|glyburide|glibenclamide|repaglinide|meglitinide`.

Le seul énoncé reliant les sulfamides au DFG, chapitre 4, juste avant la section 4.1 Metformin :

> All glucose-lowering medications should be selected and dosed according to eGFR.`349` For example,
> sulfonylureas that are long-acting or cleared by the kidney should be avoided at low eGFRs.`349`

**Aucun chiffre.** Référence 349 = Neumiller JJ, Alicic RZ, Tuttle KR, *Therapeutic considerations…*
— une revue, pas une norme. Confirmé.

J'ajoute une pièce que le rapport n'a pas produite et qui rend le point **irréfutable** : la
**Figure 23** de la KDIGO (« Treatment algorithm for selecting glucose-lowering drugs for patients
with T2D and CKD ») porte des seuils chiffrés uniquement pour la **metformine** (< 45 réduire, < 30
arrêter, dialyse arrêter) et l'**iSGLT2** (< 20 ne pas initier, dialyse arrêter). Le sulfamide est
relégué dans la case *« Additional drug therapy as needed for glycemic control »*, **sans le moindre
nombre**. Les Figures 27 (metformine) et 29 (AR GLP-1) sont bien les seules grilles posologiques par
DFG, comme dit.

→ **La correction d'attribution demandée par le rapport (`prescription.yaml:377`, `:382`, `:1318`,
« convention KDIGO/SFD ») est JUSTIFIÉE.** La KDIGO ne cautionne pas le 30 appliqué au sulfamide.

### 2.5 HAS 2024 — l'absence, prouvée par ma propre recherche

Une absence est difficile à prouver ; je l'ai donc cherchée moi-même, sans regarder comment le
rapport s'y était pris.

Les deux PDF re-extraits donnent **3 126 et 14 123 lignes** — exactement les chiffres annoncés par le
rapport (même chaîne d'outils, donc). Trois tests indépendants :

1. **Recherche des noms de molécules** : `grep -iE "clazide|piride|clamide|pizide"` sur les deux
   documents → **zéro occurrence**. La HAS 2024 ne nomme **jamais** un sulfamide individuel. Cela
   clôt à soi seul la question gliclazide/glimépiride côté HAS.
2. **Co-occurrence ligne à ligne** `sulfamide` × `mL/min|DFG` → **zéro**.
3. **Fenêtre de proximité ± 4 lignes** (script Python) sur les 8 occurrences de la Recommandation et
   les 54 du Rapport d'élaboration → **une seule remontée**, et c'est un **tableau comparatif des
   recommandations étrangères** (Société suisse d'endocrinologie et de diabétologie, 2020), où le
   nombre porte sur la metformine et l'iSGLT2, pas sur le sulfamide.

R.69, R.102, R.131 (grade A), R.132 (grade AE), R.133 (grade AE) relus : les citations du rapport
sont exactes, y compris l'incise de R.131 « quitte à réduire les autres hypoglycémiants pour prévenir
le risque d'hypoglycémie si besoin ». Le chapitre 12 « Personne avec une maladie rénale chronique »
existe bien (Rapport d'élaboration, l. 9481) et ne produit bien que R.131-133.

→ **Le négatif HAS est SOLIDE. La qualité de la recherche du rapport est bonne** ; je l'ai reproduite
par trois voies distinctes sans rien trouver de plus.

### 2.6 Marbury 2000 — vrai, mais lu de façon sélective (→ MOYENNE-1)

`efetch` PMID **10668848** : Clin Pharmacol Ther. 2000 Jan;67(1):7-15, DOI 10.1067/mcp.2000.103973,
Marbury TC, Ruckle JL, Hatorp V, Andersen MP, Nielsen KK, Huang WC, Strange P. **Tout concorde** :
revue, année, volume, fascicule, pages, DOI, auteurs. Les trois verbatim du rapport sont exacts.

> Subjects in the **hemodialysis group (n = 6)** received **two single doses** of 2 mg repaglinide
> separated by a 7- to 14-day washout period. […] Serum steady-state levels, urine levels, and
> **dialysate levels** were also measured.
>
> **Hemodialysis did not significantly affect repaglinide clearance.**

**Le caractère DISTINCT de l'étude du RCP 5.2 : confirmé, et je peux nommer l'autre étude.** Le
rapport dit seulement « protocole différent ». Le voici : **Schumacher S, Abbasi I, Weise D, Hatorp
V, Sattler K, Sieber J, Hasslacher C.** *Single- and multiple-dose pharmacokinetics of repaglinide in
patients with type 2 diabetes and renal impairment.* **Eur J Clin Pharmacol 2001;57(2):147-52,
PMID 11417447** — 34 patients DT2, dose unique de 2 mg à J1 puis 2 mg préprandiaux aux trois repas
J2-J4, dose finale à J5. C'est **littéralement** le « traitement de 5 jours par le répaglinide
(2 mg × 3/jour) » de la rubrique 5.2. Marbury (7 jours, phase I, avec bras dialyse) est bien une
**autre** étude. Pivot 6 pleinement confirmé.

**Mais** — et c'est ma critique de fond — le rapport tire de ce bras dialyse plus qu'il ne porte :

- Le bras hémodialysé est en **dose unique** (deux doses uniques séparées d'un washout). **Il
  n'existe aucune donnée d'état d'équilibre, donc aucune donnée d'accumulation, en dialyse.** Or
  c'est exactement la question clinique posée par une option « réduire la posologie du glinide »
  offerte sans borne inférieure : le patient dialysé prendra le répaglinide à chaque repas, pas deux
  fois en trois semaines.
- Le rapport **omet la seule phrase du résumé qui va contre sa lecture rassurante** :
  > Pharmacokinetic parameters did not show significant changes after single or multiple doses of
  > repaglinide, **although the elimination rate constant in the group with severe renal impairment
  > decreased after 1 week of treatment.**

  C'est un signal d'accumulation en administration répétée dans l'insuffisance rénale sévère. Il est
  dans le même paragraphe que les phrases citées.
- Enfin, le **RCP américain (FDA/DailyMed, rubrique 8.6, plusieurs fabricants)** affirme
  **positivement** l'inverse de l'existence de cette donnée :
  > **Studies were not conducted in patients with creatinine clearances below 20 mL/min or patients
  > with renal failure requiring hemodialysis.**

  Les deux peuvent coexister (Marbury 2000 est postérieur à l'AMM américaine de 1997 et n'a jamais
  été intégré à l'étiquetage), mais un outil clinique qui écrit « le silence du RCP est comblé » doit
  savoir qu'un texte réglementaire en vigueur **nie** l'existence de cette donnée.

### 2.7 Hasslacher 2003 — vrai, sans réserve

`efetch` PMID **12610054** : Diabetes Care. 2003 Mar;26(3):886-91, DOI 10.2337/diacare.26.3.886,
Hasslacher C; Multinational Repaglinide Renal Study Group. Concordance totale. n = 151 + 130 = 281.
Les quatre extraits cités par le rapport sont **exacts au mot près**, y compris les p (0,007 / 0,074
/ 0,032) et la catégorie « extreme renal impairment ». La réserve que le rapport porte lui-même
(bornes de clairance inconnues, présence de dialysés inconnue) est justifiée : **j'ai échoué comme
lui** à ouvrir le texte intégral (`diabetesjournals.org` refuse).

---

## 3. Le piège d'identité — et le piège symétrique

### 3.1 La disqualification du *Quotidien du Médecin* est JUSTE

Page `sfdiabete.org/mediatheque/kiosque/articles-qdm/insuffisance-renale-chronique-adapter-les-antidiabetiques`
ouverte et lue. Identité confirmée en tout point : **article du *Quotidien du Médecin* n° 9369,
jeudi 27 novembre 2014, Pr Patrice Darmon**, republié en section « Kiosque » de la médiathèque SFD,
citant la **HAS 2013** (« Stratégie médicamenteuse du contrôle glycémique du diabète de type 2 »).
Son contenu différencie bien les molécules (gliclazide/glipizide préférés ; glibenclamide et
glimépiride à éviter) mais **de rang presse, 2014, sur la base d'un référentiel abrogé**.

→ **Écartement CORRECT et bien motivé.** Le rapport ne s'est pas fait piéger.

### 3.2 Mais il s'est fait piéger dans l'autre sens — Zanchi 2012 (→ MOYENNE-3)

Le rapport qualifie Zanchi 2012 de « **revue suisse, 2012, secondaire** » (§1.4) et, au §2.5, la cite
« pour transparence et **non pour établir le fait** […] Revue suisse de 2012, **secondaire** ».

J'ai ouvert le texte intégral (galley HTML de *Swiss Medical Weekly*). **Son titre complet est :**

> Antidiabetic drugs and kidney disease — **Recommendations of the Swiss Society for Endocrinology
> and Diabetology**

et son tableau 1 s'intitule « **Clinical practice recommendations** ». C'est une **prise de position
d'une société savante nationale**, pas une revue narrative secondaire. OpenEvidence, lui, la classe
correctement (« Swiss Society for Endocrinology and Diabetology 2012 »).

C'est **le mécanisme d'erreur exact** que le rapport dénonce en tête — appliqué en sens inverse :
au lieu de promouvoir un article de presse au rang de référentiel, il a rétrogradé un référentiel de
société savante au rang de revue.

**Conséquence sur le contenu : nulle.** Le motif opérationnel d'exclusion reste entièrement valable
— juridiction réglementaire suisse, millésime 2012, seuils (40/60) qui contrediraient les RCP
français. Mais ce motif-là devient le SEUL motif recevable ; le motif « c'est secondaire » doit
disparaître de l'argumentaire.

Verbatim relus, tous exacts dans le rapport :
> In Switzerland, gliclazide is the only sulfonylurea that can be used in subjects with a GFR of
> 40–60 ml/min. However, it must be stopped once GFR falls below 40 ml/min.
>
> As with glibenclamide, the use of glimepiride is contraindicated in patients with a GFR of
> <60 ml/min.
>
> […] the use of repaglinide is not contraindicated in patients with renal impairment **or dialysis
> patients**.

Et la vérification négative du rapport tient aussi : **ni « Marbury » ni « Hasslacher » n'apparaissent
dans Zanchi 2012** (grep sur le texte intégral) — la concordance est bien indépendante.

---

## 4. La question gliclazide vs glimépiride — réponse nuancée

La mission demande : le rapport a-t-il eu tort d'écarter la distinction, ou raison de dire qu'elle
n'atteint pas le rang d'une recommandation opposable ?

**Sa conclusion opérationnelle est JUSTE ; sa justification est FAUSSE.**

- **Juste** : aucune source française de rang recommandation ne distingue les sulfamides sur le
  critère rénal. Je l'ai vérifié par trois voies indépendantes — HAS 2024 ne nomme **aucun** sulfamide
  (0 occurrence de `clazide|piride|clamide|pizide` dans 17 249 lignes) ; SFD 2023 et 2025 ne parlent
  que de « SU » / « sulfamides hypoglycémiants » en classe dans tous leurs avis rénaux ; les RCP
  français portent le même libellé. `pharmacomedicale.org` (page « Sulfamides hypoglycémiants »,
  révision 24 mai 2024) donne bien le chiffre — « jusqu'à un débit de filtration glomérulaire de
  30 ml/min », « en cas d'insuffisance rénale sévère, leur utilisation est contre indiquée » — et
  **ne différencie aucune molécule** : la caractérisation du rapport est exacte.
- **Fausse** : la phrase « **Deux sources différencient les molécules, mais aucune n'est utilisable
  ici** » est démentie. Il y en a au moins **trois**, dont deux de rang société savante :
  l'**Endocrine Society 2019** (recommandation graduée 1|⊕⊕OO + Table 7, chiffres explicites) et la
  **Société suisse d'endocrinologie et de diabétologie 2012** (que le rapport cite en la
  déclassant). Et la rationnelle PK avancée par OE — gliclazide métabolisé en métabolites
  **inactifs**, glimépiride produisant un métabolite M1 **actif** qui s'accumule — est bien
  documentée : Zanchi 2012 l'écrit noir sur blanc (« Gliclazide […] is metabolised by the liver to
  **inactive** metabolites » / « Glimepiride […] two main metabolites, **one of which has
  hypoglycaemic activity**. In patients with renal impairment, these metabolites can accumulate »).

**Ne pas introduire la distinction dans le nœud reste la bonne décision** : elle n'est portée par
aucun texte opposable en France, et les seuils étrangers (40 pour le gliclazide, 60 pour le
glimépiride) contrediraient les RCP français. Mais l'argumentaire doit dire « aucune source
**française**… », pas « aucune source ».

---

## 5. Findings

### HAUTE — aucun

Point à dire explicitement, car c'est une information : **aucun PMID inventé, aucun DOI faux, aucune
citation fabriquée, aucune source mal identifiée dans le sens dangereux, aucune affirmation clinique
non soutenue.** Tous les identifiants résolvent et correspondent (revue, année, volume, fascicule,
pages, population). Le rapport audité est, sur son cœur factuel, **fiable**. Compte tenu de
l'historique du dépôt (nœud E : 100 % des PMID d'OE faux), c'est le résultat à retenir.

### MOYENNE-1 — Marbury 2000 lu sélectivement ; le résiduel (a) ne devrait pas être clos, mais réécrit

Le rapport conclut (§2.6-1) que le résiduel « le RCP est SILENCIEUX en dessous de 20 ml/min
(dialyse) — l'option reste offerte, sans donnée pour la borner » est **« à clore »**, l'option étant
désormais « positivement soutenue » par une PK spécifique de l'hémodialysé.

Trois faits, tous dans les documents que le rapport a lui-même ouverts, l'empêchent :

1. Le bras dialyse est en **dose unique × 2 avec washout** : il n'y a **aucune donnée d'accumulation
   en administration répétée chez le dialysé**. « L'hémodialyse n'épure pas le répaglinide » et
   « le répaglinide est sûr en prise prandiale répétée chez le dialysé » sont deux affirmations
   différentes ; seule la première est établie.
2. Le rapport **omet** la phrase du même résumé qui signale un ralentissement de l'élimination après
   1 semaine dans le groupe sévère.
3. Le **RCP américain nie** l'existence de toute étude sous CrCl 20 ou en hémodialyse.

**Ce qui reste vrai** : le répaglinide n'a aucune contre-indication rénale, la SFD l'autorise
nommément sous 15, et il n'y a **pas lieu de poser une borne inférieure** dans le nœud. **Ce qui doit
changer** : l'entrée `incertitudes` ne doit pas passer de « sans donnée » à « soutenu » ; elle doit
passer à « soutenu par une recommandation (SFD < 15) mais **sans donnée PK d'état d'équilibre en
dialyse**, et avec un signal d'accumulation en IR sévère ». La formulation actuelle de l'option est
la bonne ; c'est la note d'incertitude qui doit rester ouverte, redescendue d'un cran.

### MOYENNE-2 — Source de rang recommandation manquée (Endocrine Society 2019)

Détaillée au §1.3. Le rapport n'en parle pas ; OE l'avait signalée ; elle est authentique et
vérifiée. Conséquences :

- La phrase du §1.4 « Deux sources différencient les molécules, mais aucune n'est utilisable ici »
  est **factuellement fausse**.
- Le §1.5 « ADA / international » aurait dû citer une source qui, elle, **converge sur 30** pour le
  glimépiride — molécule commercialisée en France — et renforce donc le seuil du nœud par un canal
  supplémentaire.
- Le §2.4 aurait gagné à savoir qu'une société savante a déjà transformé Hasslacher 2003 en conduite
  (« repaglinide […] used with caution when the eGFR is <30 »), ce qui est exactement le geste que le
  nœud propose.

### MOYENNE-3 — Erreur symétrique d'identité de source (Zanchi 2012)

Détaillée au §3.2. Pas de conséquence sur le contenu ; conséquence sur l'argumentaire, qui doit
cesser d'invoquer le caractère « secondaire » d'un document qui se présente comme les recommandations
d'une société savante nationale.

### MOYENNE-4 — « Aucun changement de comportement du moteur n'en découle » minimise trois choses

Le rapport écrit cette phrase deux fois (§1.6-2 et §2.6-4). Ses propres trouvailles impliquent
pourtant au moins trois arbitrages de comportement. Je ne tranche pas — je signale qu'ils ne peuvent
pas être déclarés inexistants.

**(a) Le durcissement SFD 2025 sur le sujet âgé est une interdiction DURE, pas une préférence.**
Note 6 du Tableau I 2025, verbatim :
> Il est recommandé d'éviter de prescrire un sulfamide ou un glinide chez les sujets âgés
> « fragiles » et de **ne jamais les utiliser** chez les sujets âgés « dépendants ».

contre 2023 (vérifié, note 6) :
> Il est **préférable d'éviter** de prescrire un sulfamide ou un glinide chez les sujets âgés
> « fragiles » ou « dépendants et/ou à la santé très altérée ».

Le rapport a bien vu le durcissement (§1.6-5) mais le range en « piste optionnelle, hors périmètre,
à arbitrer séparément » — dans le même document où il conclut que rien ne change. Or, dans le nœud :
l'option `Sulfamide (gliclazide MR ou glimépiride)` (`:913`) porte des `exclusions` sur
`DFG < 30`, `symptomes_glucotoxicite`, `cetonemie` — **rien sur le terrain gériatrique** ; la
prohibition n'apparaît qu'en prose dans `contre_indications` (« Déconseillé chez le sujet à risque
d'hypoglycémie élevé (âgé fragile, IR…) »), c'est-à-dire à un cran **plus faible** que « ne jamais ».
Et le nœud n'a **aucune catégorie « dépendant »** (`fragilite` est un booléen, `terrain_fragile` est
dérivé et agrège âge ≥ 75 / fragilité / espérance de vie / risque hypo). C'est un écart de garde-fou
directement documenté par la source que le rapport déclare décisive, sur les **deux** classes de la
mission.

**(b) La SFD impose un PLANCHER d'HbA1c de 7 % sous glinide ou insuline à DFG < 30 ; le nœud a un
garde-fou à 6,5 %.** L'Avis n° 12 (cité deux fois par le rapport) est explicite : cible 8 %, « avec
une limite inférieure de 7 % […] en cas de traitement par glinide ou insuline ». Le nœud dérive
`hba1c_sous_cible` de `HbA1c_actuelle > 0 AND HbA1c_actuelle < 6.5` (`:180-185`), garde-fou déclaré
« absolu ». Un patient à DFG 25 sous répaglinide et HbA1c 6,8 % est **dans la zone que la SFD
interdit** et ne déclenche aucun garde-fou numérique — il ne sera rattrapé que si le praticien
déclare lui-même `position_vs_cible == sous_objectif`. Le nœud encode déjà ailleurs un seuil
numérique conditionné au DFG (dose maximale de metformine par palier, `dose_metformine`) : la
mécanique existe. Dire « rien à changer » n'est pas soutenable **sans arbitrage explicite**.

**(c) Le nœud recommande, sous 30, un repli que sa nouvelle source décisive déclare indisponible en
France.** L'option `Arrêter le sulfamide (DFG < 30)` (`:370-382`) porte en `inconvenients` :
« en rénal sévère, l'insuline devient souvent le pivot (**± sitagliptine à dose adaptée au DFG**) ».
Or l'Avis n° 12 bis, que le rapport cite intégralement **deux fois**, écrit que la dose utilisable
sous 30 est « la sitagliptine à la dose de 25 mg/j (**forme non commercialisée en France**) » et
désigne à la place « la vildagliptine à la dose de 50 mg/j ». Le rapport a lu la phrase, l'a
recopiée, et ne l'a pas confrontée au texte du nœud qu'il auditait. **Je ne tranche pas** la question
de fait (je n'ai pas pu récupérer la liste BDPM des dosages de sitagliptine commercialisés en France
— voir §7) : soit la SFD 2025 a raison et le libellé du nœud est inapplicable sous 30, soit le nœud
a raison et la SFD 2025 se trompe. Dans les deux cas c'est un point à arbitrer, pas un non-événement.

### BASSE-1 — Erreur arithmétique au §2.1

Le rapport écrit que le répaglinide est « l'**un des deux seuls** réellement disponibles en pratique
française avec l'insuline (la sitagliptine 25 mg n'est pas commercialisée ; **reste la vildagliptine
50 mg/j**) ». La parenthèse contredit l'affirmation : quatre molécules listées, une non
commercialisée → **trois** disponibles (insuline, répaglinide, vildagliptine 50 mg/j), pas deux.

### BASSE-2 — « Libellé identique en 2023 » est inexact pour la liste de l'IRC terminale

Vérifié dans `1-s2.0-s1957255723002298-main.pdf`. La **clause répaglinide est identique** au mot près,
et les notes 1 et 2 du Tableau I sont **strictement identiques** (donc l'affirmation pivot 2 tient
pour ce qui porte la démonstration). Mais la **liste**, elle, a changé : 2023 = « seuls l'insuline, le
répaglinide […] **et** la vildagliptine à la dose de 50 mg/jour » (3 molécules) ; 2025 ajoute « la
sitagliptine à la dose de 25 mg/j (forme non commercialisée en France) » (4 molécules). « Libellé
identique » est donc à préciser en « clause répaglinide identique ; liste élargie en 2025 ».

### BASSE-3 — Le titre attribué à la Figure 3 de la SFD 2025 n'existe pas

Le §1.5 cite « Figure 3 de la SFD 2025 (« **Fonction rénale (DFG estimé) et utilisation des
traitements de l'hyperglycémie** ») ». La légende réelle de la Figure 3 dans l'édition 2025 est
« **Insuffisance rénale chronique (IRC) : gestion des traitements de l'hyperglycémie** ». Le titre
cité est un hybride de la légende de la **Figure 7 de l'édition 2023** (« Fonction rénale (DFG
estimé) et utilisation des **anti-hyperglycémiants** »). Sans conséquence — le rapport ne s'appuie
pas sur cette figure — mais c'est une légende entre guillemets qui n'existe telle quelle dans aucune
des deux éditions.

### BASSE-4 — Un guillemet « verbatim » contient un glyphe reconstruit

Le §1.1(b) cite « on visera une HbA1c cible **≤** 8 % ». Le `≤` ne survit pas à l'extraction
(`pdftotext` rend « HbA1c cible 8 % »). Le sens est évidemment correct (la phrase suivante donne la
limite inférieure), mais un bloc annoncé comme verbatim ne devrait pas contenir de caractère
restitué sans le signaler.

### BASSE-5 — Pagination SFD 2023 non retrouvable dans la version publiée

Le §1.1(d) situe les avis à « p. 22 » et « p. 23 » et les notes « p. 4 du tiré à part ». Ce sont les
pages du **tiré à part / épreuve non corrigée** (le PDF porte « Med Mal Metab 2023; xx: xxx »).
L'article publié est **Méd Mal Métab 2023;17(8):664-693** (Crossref). Un relecteur qui vérifie sur la
version de revue ne trouvera pas « p. 22 ».

---

## 6. Ce qui est CONFIRMÉ (à dire, c'est une information)

1. **La prise de position SFD 2025 existe** et est correctement citée : Méd Mal Métab
   **2025;19(8):630-662**, DOI **10.1016/j.mmm.2025.10.002**, en ligne le 13/11/2025, rubrique
   « Recommandations et référentiels ». Crossref confirme titre, revue, volume, fascicule, pages,
   année.
2. **Les quatre éléments du pivot 1 (a/b/c/d) sont présents, verbatim, dans le PDF.** Le seuil
   de 30 appliqué au sulfamide **n'est plus une convention : c'est une citation.**
3. **Le libellé de la contre-indication est stable sur deux éditions** (notes 1 et 2 identiques en
   2023 et 2025 ; « (SU contre-indiqués) » identique dans Avis n° 23/2023 et Avis n° 12/2025).
4. **HAS 2024 R.78 (grade C) existe et dit ce que le rapport dit**, verbatim.
5. **KDIGO 2022 ne porte aucun chiffre sur les sulfamides** — vérifié par recherche exhaustive et
   confirmé par l'algorithme Figure 23, qui ne chiffre que metformine et iSGLT2. **La correction
   d'attribution « convention KDIGO/SFD » est fondée.**
6. **Aucun seuil de DFG n'est attaché aux sulfamides dans la HAS 2024** — reproduit par trois
   méthodes indépendantes, dont l'absence totale de tout nom de sulfamide dans les deux documents.
7. **Marbury 2000 et Hasslacher 2003 : PMID, DOI, revue, année, volume, pages, population et
   verbatim — tout est exact.** Le bras hémodialysé (n=6) avec dosage du dialysat existe. L'étude est
   bien **distincte** de celle résumée en rubrique 5.2, laquelle est **Schumacher 2001,
   PMID 11417447** (identification que j'ajoute).
8. **La disqualification de l'article du *Quotidien du Médecin* n° 9369 (27/11/2014) est juste** :
   identité, date, auteur, section « Kiosque », renvoi à la HAS 2013 — tout vérifié sur la page.
9. **`pharmacomedicale.org` est correctement caractérisé** (chiffre de 30, aucune distinction
   inter-molécule, révision 24/05/2024).
10. **Zanchi 2012 ne cite ni Marbury ni Hasslacher** : la concordance est bien indépendante.
11. **La conduite par palier du nœud est cohérente avec la SFD** : « adapter la posologie » entre 30
    et 59, « SU contre-indiqués » sous 30. La structure à deux options en place est la bonne.
12. **La conclusion du 2026-07-26 sur le glinide est intacte et renforcée** — voir §7, j'ai pu ouvrir
    le RCP centralisé EMA que cette note n'avait pas pu exploiter.

---

## 7. Angles morts déclarés : quatre ouverts, un partagé

Le rapport liste ce qu'il n'a pas pu ouvrir. J'ai tenté de mon côté. Résultat honnête :

### 7.1 OUVERT — HAS, *Guide du parcours de soins — Maladie rénale chronique de l'adulte (MRC)*

C'était « le seul angle mort français sérieux » du rapport. **Je l'ai ouvert.** L'URL réelle est
`https://www.has-sante.fr/upload/docs/application/pdf/2021-09/guide__mrc.pdf` — le répertoire est
**2021-09**, pas 2023, ce qui explique les 404 du rapport : le document est *validé par le Collège le
1er juillet 2021, mis à jour en septembre 2023*, et c'est bien celui que la HAS 2024 cite en R.133
(Rapport d'élaboration, référence 20 : « Guide du parcours de soins – Maladie rénale chronique de
l'adulte (MRC), septembre 2023 »). Chemin d'accès : la page `jcms/p_3289324` sert un `<META Refresh>`
vers le PDF, invisible dans le HTML de la page `jcms/p_3288950`.

**Contenu (4 927 lignes extraites), recherche sur `sulfamide|glinide|répaglinide|sulfonylur`** :
**deux occurrences seulement**, et **aucun seuil de DFG**.

- §4.3.4 « Contrôle glycémique » se **récuse explicitement** :
  > Les objectifs de contrôle glycémique et traitements seront précisés dans les prochaines
  > recommandations de la HAS en cours d'actualisation.
- Seule mention en contexte diabète, purement qualitative :
  > Surveillance du risque hypoglycémique (autosurveillance, ETP). Particulièrement dans le cas de
  > traitement par **sulfamides**, insuline (surtout dans le diabète de type 1). Le risque
  > hypoglycémique est plus élevé à partir du stade 3 du fait de la diminution de la clairance de
  > l'insuline et des antidiabétiques oraux […]
- La seconde occurrence (« sulfamides — Néphropathie interstitielle aiguë, obstruction tubulaire »)
  est dans un tableau de néphrotoxicité **sous la rubrique « Antibiotiques »** : ce sont les
  sulfamides **anti-infectieux**, pas les hypoglycémiants. Piège d'homonymie à signaler.

→ **L'angle mort est levé et il CONFIRME le rapport.** Constat supplémentaire, utile au dépôt : les
deux documents HAS **se renvoient l'un à l'autre en boucle** — la HAS 2024 délègue le rénal au guide
MRC (R.133), et le guide MRC délègue le glycémique aux « prochaines recommandations » de la HAS.
**Aucun des deux ne porte de seuil de DFG pour les sulfamides. Le négatif HAS est désormais complet
et fermé.**

### 7.2 OUVERT — RCP centralisé EMA de Novonorm

Non exploité le 2026-07-26 (« PDF non extractible »), non retenté le 2026-07-27. **Je l'ai extrait
sans difficulté** (`novonorm-epar-product-information_fr.pdf`, 632 147 octets → 122 351 caractères de
texte). Il confirme intégralement les RCP génériques BDPM :

- **4.3 Contre-indications** — liste complète, cinq entrées : hypersensibilité ; diabète de type 1,
  peptide C négatif ; acidocétose diabétique ; **insuffisance hépatique sévère** ; gemfibrozil.
  **Aucune contre-indication rénale.**
- **4.2** : « Le répaglinide n'est pas affecté en cas d'altération de la fonction rénale (voir
  rubrique 5.2). Huit pour cent d'une dose de répaglinide est excrétée par les reins […] il est
  conseillé d'être prudent lors de l'adaptation des doses chez ces patients. »
- **5.2** : « Après un traitement de 5 jours par le répaglinide (2 mg × 3/jour) chez des patients
  présentant une insuffisance rénale sévère (clairance de la créatinine : 20 – 39 ml/min), les
  résultats montrent une augmentation significative de 2 fois de l'exposition (ASC) et de la demi-vie
  (t1/2) […] »

→ **Le résiduel (c) de l'entrée `incertitudes` du glinide (`prescription.yaml:1313-1315`) tombe** :
le RCP de référence a été lu, il est identique aux génériques.

### 7.3 OUVERT — ADA, Table 9.2

Le rapport dit ne pas avoir pu la lire (image `dc25S009t2.jpg`) et refuse donc de citer une source
secondaire. **Confirmé pour l'édition 2025** (PMC11635045 : la table n'est pas rendue en texte).
**Mais l'édition 2026 l'est** : ADA, *9. Pharmacologic Approaches to Glycemic Treatment: Standards of
Care in Diabetes—2026*, Diabetes Care 2026;49(Suppl 1):S183-S215, DOI 10.2337/dc26-S009, PMC12690185.
Colonne MRC de la Table 9.2, verbatim :

> Sulfonylureas (2nd generation) […] **Glyburide: generally not recommended in CKD. Glipizide and
> glimepiride: initiate conservatively to avoid hypoglycemia.**

→ La source secondaire que le rapport a eu la prudence de ne pas citer était **exacte**, et le fond
de sa conclusion est **confirmé** : l'ADA ne donne **aucun chiffre**. (Le gliclazide n'y figure pas,
non commercialisé aux États-Unis.)

### 7.4 OUVERT — L'étude derrière la rubrique 5.2

Identifiée : **Schumacher S, et al., Eur J Clin Pharmacol 2001;57(2):147-52, PMID 11417447**
(cf. §2.6). Le caractère distinct de Marbury 2000 est désormais établi positivement, plus seulement
par différence de protocole.

### 7.5 ÉCHEC PARTAGÉ — bornes de clairance de Hasslacher 2003 et de Marbury 2000

**J'ai échoué comme le rapport.** `diabetesjournals.org` refuse l'accès (403) ; le texte intégral de
*Clin Pharmacol Ther* 2000 n'est pas accessible. Les résumés PubMed ne définissent numériquement ni
« severe » ni « extreme renal impairment » ni les bornes des groupes de Marbury, et ne disent pas si
la cohorte Hasslacher comportait des dialysés. **Ce point reste ouvert et doit le rester** : Hasslacher
2003 ne peut être cité que pour son **signal de sécurité clinique**, jamais pour un seuil.
Le rapport a raison de le dire.

### 7.6 NON RÉSOLU — sitagliptine 25 mg est-elle commercialisée en France ?

Point soulevé par mon finding MOYENNE-4(c). Je n'ai **pas** réussi à récupérer la liste des dosages
commercialisés sur la BDPM (la page de résultats ne se rend pas en HTML exploitable). Ce que je peux
affirmer : la SFD 2025 écrit, deux fois, « (forme non commercialisée en France) » à propos de la
sitagliptine 25 mg. Ce que je ne peux pas affirmer : que ce soit exact. **Signalé plutôt que deviné**
(invariant CLAUDE.md 6) — à trancher par le référent avant toute modification du libellé de l'option
`Arrêter le sulfamide (DFG < 30)`.

### 7.7 NON EXPLORÉ

- **ANSM, fiche de bon usage « sulfamides + insuffisance rénale »** : je n'ai pas refait cette
  recherche indépendamment ; le négatif du rapport n'est ni confirmé ni infirmé.
- **`ebmfrance` / GPR** : accès abonné, non consultés (comme dans le rapport).

---

## 8. Récapitulatif opérationnel pour le référent

Ce que cet audit change par rapport aux conclusions du rapport audité :

| Conclusion du rapport | Verdict red-team |
|---|---|
| Le seuil 30 est confirmé, sourcé SFD | **Tenue.** Vérifiée en source primaire. |
| Corriger « convention KDIGO/SFD » → attribution SFD | **Tenue, et renforcée** (Figure 23 KDIGO). |
| Conduite par palier du nœud validée | **Tenue.** |
| Ne pas introduire de distinction gliclazide/glimépiride | **Tenue** — mais motiver par « aucune source **française** », pas « aucune source ». |
| Résiduel glinide (b) « aucune source SFD/HAS » = caduc | **Tenue.** SFD 2025 Avis n° 12 bis + HAS R.78. |
| Résiduel glinide (c) « RCP EMA non lu » | **Désormais caduc aussi** — RCP EMA lu (§7.2). |
| Résiduel glinide (a) « silence sous 20 » = à clore | **NON.** À réécrire, pas à clore (MOYENNE-1). |
| « Aucun changement de comportement du moteur n'en découle » | **NON tenable en l'état** — trois arbitrages ouverts (MOYENNE-4). |
| Zanchi 2012 = revue secondaire | **FAUX** — recommandations d'une société savante nationale (MOYENNE-3). Exclusion maintenue pour un autre motif. |
| Aucune autre source pertinente | **FAUX** — Endocrine Society 2019 (MOYENNE-2). |

---

## 9. Sources — toutes ouvertes et lues par moi, avec URL

**Rang recommandation (primaires)**

| Source | Identité vérifiée par moi | URL |
|---|---|---|
| SFD 2025 | Darmon P, et al., Méd Mal Métab **2025;19(8):630-662**, DOI 10.1016/j.mmm.2025.10.002 (Crossref OK), en ligne 13/11/2025 | `https://www.sfdiabete.org/sites/www.sfdiabete.org/files/files/ressources/11-698.pdf` |
| SFD 2023 | Darmon P, et al., DOI 10.1016/j.mmm.2023.10.007 → publié **17(8):664-693** (Crossref) | `https://www.sfdiabete.org/sites/www.sfdiabete.org/files/files/ressources/1-s2.0-s1957255723002298-main.pdf` |
| HAS 2024 — Recommandation | R.69, R.78 (grade C, p. 23), R.102, R.131-133 | `https://www.has-sante.fr/upload/docs/application/pdf/2024-06/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf` |
| HAS 2024 — Rapport d'élaboration | chap. 12 « Personne avec une maladie rénale chronique » | `https://www.has-sante.fr/upload/docs/application/pdf/2024-06/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_rapport_delaboration.pdf` |
| **HAS — Guide parcours de soins MRC** (angle mort levé) | validé Collège 01/07/2021, **mis à jour sept. 2023** ; aucun seuil SU | `https://www.has-sante.fr/upload/docs/application/pdf/2021-09/guide__mrc.pdf` |
| KDIGO 2022 | Kidney Int 2022;102(5S):S1-S127 ; 8 242 002 octets ; Figure 23 sans chiffre SU | `https://kdigo.org/wp-content/uploads/2022/10/KDIGO-2022-Clinical-Practice-Guideline-for-Diabetes-Management-in-CKD.pdf` |
| **Endocrine Society 2019** (source manquée par le rapport) | LeRoith D, et al., JCEM **2019;104(5):1520-1574**, DOI 10.1210/jc.2019-00198, **PMID 30903688** ; Rec. 5.16 + Table 7 | `https://pmc.ncbi.nlm.nih.gov/articles/PMC7271968/` |
| Société suisse d'endocrinologie et de diabétologie 2012 | Zanchi A, Lehmann R, Philippe J, Swiss Med Wkly 2012;142:w13629 — **« Recommendations of the Swiss Society for Endocrinology and Diabetology »**, Table 1 « Clinical practice recommendations » | `https://smw.ch/index.php/smw/article/view/1582` |
| ADA SOC **2026**, chap. 9 (Table 9.2 lisible) | Diabetes Care 2026;49(Suppl 1):S183-S215, DOI 10.2337/dc26-S009 | `https://pmc.ncbi.nlm.nih.gov/articles/PMC12690185/` |
| ADA SOC 2025, chap. 9 (Table 9.2 en image — confirmé) | DOI 10.2337/dc25-S009 | `https://pmc.ncbi.nlm.nih.gov/articles/PMC11635045/` |

**Étiquetage produit**

| Source | Ce que j'y ai lu | URL |
|---|---|---|
| **RCP centralisé EMA Novonorm (FR)** — angle mort levé | 4.3 : 5 CI, aucune rénale · 4.2 et 5.2 verbatim | `https://www.ema.europa.eu/fr/documents/product-information/novonorm-epar-product-information_fr.pdf` |
| Étiquetage FDA repaglinide (DailyMed) | « Studies were not conducted in patients with creatinine clearances below 20 mL/min or patients with renal failure requiring hemodialysis » | `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=68064989-47ea-4ed5-a20e-43c4ef6ec271` |

**Études**

| Source | Identité vérifiée (efetch NCBI + Crossref) | URL |
|---|---|---|
| Marbury 2000 | Clin Pharmacol Ther 2000;67(1):7-15 · **PMID 10668848** · DOI 10.1067/mcp.2000.103973 · bras hémodialyse n=6 **en dose unique ×2** | `https://pubmed.ncbi.nlm.nih.gov/10668848/` |
| Hasslacher 2003 | Diabetes Care 2003;26(3):886-91 · **PMID 12610054** · DOI 10.2337/diacare.26.3.886 · n=281 | `https://pubmed.ncbi.nlm.nih.gov/12610054/` |
| **Schumacher 2001** (étude de la rubrique 5.2, identifiée ici) | Eur J Clin Pharmacol 2001;57(2):147-52 · **PMID 11417447** · 34 patients DT2, 2 mg ×3/j, 5 jours | `https://pubmed.ncbi.nlm.nih.gov/11417447/` |

**Secondaires / écartées**

| Source | Nature réelle vérifiée | URL |
|---|---|---|
| Collège National de Pharmacologie Médicale, « Sulfamides hypoglycémiants » (rév. 24/05/2024) | ressource pédagogique ; chiffre 30 ; aucune distinction inter-molécule — caractérisation du rapport exacte | `https://pharmacomedicale.org/medicaments/par-specialites/item/sulfamides-hypoglycemiants` |
| « Insuffisance rénale chronique : adapter les antidiabétiques » | **article de presse**, *Le Quotidien du Médecin* n° 9369, 27/11/2014, Pr P. Darmon, section « Kiosque » SFD, cite la HAS **2013** — écartement du rapport CONFIRMÉ | `https://www.sfdiabete.org/mediatheque/kiosque/articles-qdm/insuffisance-renale-chronique-adapter-les-antidiabetiques` |

**Dépôt interne consulté (lecture seule, aucune modification)**

- `content/noeuds/diabete-type-2/prescription.yaml` (`:162-196`, `:180-196`, `:370-383`, `:795-845`,
  `:913-942`, `:1303-1320`)
- `docs/decision/validation/chantier-2026-07-27/preuve-seuils-renaux-su-glinide.md` (cible de l'audit)
- `docs/decision/validation/chantier-2026-07-27/OE-retour-brut.md`
- `docs/decision/validation/chantier-2026-07-26/rcp-glinide-insuffisance-renale.md`
