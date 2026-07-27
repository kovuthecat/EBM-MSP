# Red-team — collecte « intolérance aux statines » (nœud F `statine`)

**Domaine** : diabète de type 2 · **Nœud** : `statine` · **Date** : 2026-07-27
**Document audité** : `docs/decision/validation/chantier-2026-07-27/preuve-intolerance-statine.md`
**Contre-source archivée** : `OE-retour-brut.md`, section « statin intolerance »
**Méthode** : re-vérification indépendante en source primaire (PDF intégraux de la reco française 2026
et de l'avis HAS NILEMDO téléchargés et extraits ; PubMed/PMC ; ClinicalTrials.gov ; JORF via presse
professionnelle). Paywalls NON contournés (NEJM, JAMA, Lancet D&E, EHJ, NICE, Prescrire) : les
affirmations qui en dépendent sont marquées comme telles.

**Ce document ne modifie aucun fichier de `content/`, aucun test, ni le rapport audité.**

---

## 1. Verdict global

**Le rapport est suivable sur sa bibliographie (26/26 PMID conformes) et sur son seul fait
opérationnel de sécurité (le garde-fou CK, verbatim exact), mais il ne l'est pas sur ses trois
conclusions de tête : le « rééquilibrage nocebo » repose sur un unique essai financé par Amgen lu à
l'envers et compté deux fois, et l'accusation la plus lourde — « la reco française écrit sur un
médicament qu'elle croit indisponible, alors qu'il est remboursé depuis février 2025 » — est
factuellement fausse dans ses deux moitiés : le remboursement date du 12 décembre 2025, soit APRÈS
la clôture bibliographique de la reco (septembre 2025), qui avait donc raison.**

---

## 2. Findings HAUTE

### HAUTE-1 — Le « rééquilibrage nocebo » compte deux fois le même essai

**Citation contestée** (§ affirmation pivot 1, repris en §2 étape 0 et §8.3-A1) :
> « Nuance qui manque à la lecture "c'est du nocebo à 90 %" […] **GAUSS-3, phase A** […] **Kraut
> 2023** […] »

Le rapport présente GAUSS-3 et Kraut 2023 comme **deux** contrepoids indépendants à la CTT 2022.

**Ce que dit réellement la source** : **GAUSS-3 (Nissen 2016) EST l'un des 8 ECR de Kraut 2023.**
Les 8 essais inclus sont Herrett 2021, Howard 2021, Joy 2014, Kennedy 2011, Kristiansen 2021,
**Nissen 2016**, Stein 2008, Taylor 2015. Et c'est de loin le plus gros : **491 patients sur ~1 114
patients uniques, soit 44 % du corpus**.

**Impact sur la décision** : les « deux sources » du rééquilibrage sont **un seul essai financé par
Amgen** (NCT01984424, lead sponsor Amgen, aucun collaborateur), compté une fois seul et une fois
dans la méta-analyse. Le poids de preuve affiché est surévalué d'un facteur ~2. Toute rédaction
d'alerte qui les juxtapose (« RR 1,40 […] **et** 42,6 % […] ») induit le lecteur en erreur sur
l'indépendance des données.

---

### HAUTE-2 — Le 42,6 % de GAUSS-3 est lu à l'envers ; « reproductibles » est faux

**Citation contestée** (§2 étape 0, reprise mot pour mot dans la proposition d'alerte §8.3-A1) :
> « **209/491 (42,6 %) ont eu des symptômes musculaires sous atorvastatine et pas sous placebo.**
> Autrement dit, même un protocole rigoureux identifie une minorité substantielle d'intolérances
> **réelles et reproductibles**. »

**Ce que dit réellement la source** (JAMA 2016;315(15):1580-1590, abstract + design NCT01984424) :

| Catégorie, phase A | n / 491 | % |
|---|---|---|
| Symptômes sous atorvastatine **seulement** | 209 | **42,6 %** |
| Symptômes sous **placebo seulement** | 130 | **26,5 %** |
| Symptômes sous **les deux** | 48 | 9,8 % |
| Symptômes sous **aucun** | 85 | 17,3 % |

Deux erreurs, pas une :

1. **L'excès NET attribuable à la statine est 42,6 − 26,5 ≈ 16 points**, pas 42,6 %. Le quasi-parallélisme
   des deux bras est précisément ce que GAUSS-3 a démontré : une large part de l'attribution
   « c'est la statine » est du bruit. Le rapport connaît le 26,5 % — il le relègue en parenthèse et
   le disqualifie (« provient d'un communiqué de la Cleveland Clinic, pas de l'abstract »). Ce choix
   de présentation **inverse le message de l'essai**.
2. **« reproductibles » est factuellement faux.** La phase A donne chaque traitement **une seule
   fois** (atorvastatine 20 mg ou placebo 10 semaines, wash-out 2 semaines, crossover 10 semaines).
   Rien n'y est reproduit. Un patient symptomatique sur une seule exposition n'a pas de symptôme
   « reproductible ».

**Impact sur la décision** : le libellé proposé en §8.3-A1 — « 42,6 % des patients d'un protocole
rigoureux ont des symptômes reproductibles sous statine seule » — mettrait **une affirmation fausse
sous les yeux d'un prescripteur**. À ne pas encoder en l'état. Le seul chiffre défendable de GAUSS-3
phase A pour un message clinique est l'excès net (~16 points), et il doit être donné avec son
symétrique placebo.

---

### HAUTE-3 — « Remboursé depuis février 2025 » est FAUX ; la reco française avait raison

**Citations contestées** (§4, §8.6) :
> « (a) la reco française écrit sur un médicament qu'elle croit encore non disponible en France —
> **factuellement dépassé, il est remboursé depuis février 2025** »
> « **Corriger un fait daté** : la reco française 2026 écrit que l'acide bempédoïque "n'est pas
> encore commercialisé en France". Il est **remboursé depuis février 2025**. Si le nœud reprend
> cette recommandation, il doit porter la correction. »

**Moitié (a) — ce qu'écrit exactement la reco : CONFIRMÉ, deux fois, verbatim.**
- §5.4 : « Bempedoic acid is thus a potential alternative for patients who are intolerant to
  statins, but **it is not yet commercially available in France**. »
- §6.1 : « Bempedoic acid is **a last-resort treatment option, which should soon be available** for
  people with high cardiovascular risk or established ASCVD, particularly in case of statin
  intolerance [97]. »

**Moitié (b) — la date réelle : le rapport se trompe.**

| Étape | Date réelle | Source |
|---|---|---|
| AMM européenne (centralisée) | 1er avril 2020 | avis HAS, p. 5 |
| **Avis de la Commission de la transparence** (avis *favorable au remboursement*) | **12 février 2025** | avis HAS, page de garde |
| Arrêté d'inscription sur la liste des spécialités remboursables | **9 décembre 2025** | JORF |
| **Publication au Journal officiel → remboursement effectif (65 %)** | **12 décembre 2025** | JORF, presse pro. |
| Disponibilité effective en officine | début 2026 (« désormais disponible », mars 2026) | Le Moniteur des pharmacies, 22/03/2026 |

Le 12 février 2025 est la date d'un **avis** recommandant le remboursement, pas du remboursement. Il
y a dix mois d'écart.

**Et surtout** : la reco française déclare sa clôture bibliographique — « an account of the main
publications indexed in PubMed **up to September 2025** ». À cette date, l'acide bempédoïque n'était
ni remboursé ni disponible en France. **La reco disait vrai au moment où elle a été écrite, et elle
l'a même écrit au futur proche (« which should soon be available »), donc en toute connaissance de
l'imminence.**

**Impact sur la décision** : triple.
1. L'explication (a) de la divergence française/ESC — « elle écrit sur un médicament qu'elle croit
   indisponible, c'est factuellement dépassé » — **tombe**. La reco n'a pas commis d'erreur de fait.
2. L'instruction §8.6 « le nœud doit porter la correction » **introduirait une date fausse dans le
   contenu clinique**. À ne pas exécuter.
3. Le §3 du rapport écrit « Remboursé depuis 2025 (HAS 12/02/2025) » — vrai par accident (décembre
   est dans 2025), faux par sa parenthèse. À reformuler : « avis HAS favorable 12/02/2025 ;
   remboursement effectif depuis le 12/12/2025 ».

---

### HAUTE-4 — L'accusation de conflit d'intérêt vise la mauvaise société ; l'« asymétrie » n'existe pas

**Citation contestée** (§5, reprise en §4) :
> « **10 des 11 auteurs déclarent des liens avec Amgen** […] **Aucun lien avec Esperion** (acide
> bempédoïque) n'est déclaré — et c'est précisément l'acide bempédoïque que cette recommandation
> classe en "dernier recours", quand l'ESC le classe I. »

**Le décompte est exact — vérifié nom par nom sur la section « Declaration of competing interest ».**
11 auteurs (Bouillet, **Boulestreau**, Aboyans, Béliard, Boccara, Cariou, Charrière, Moulin, Vergès,
Valero, Gallo). **10 déclarent Amgen** ; le seul qui ne le déclare pas est **R. Boulestreau**, et le
rapport l'exclut correctement de sa liste de dix. 9 relecteurs ✔. « This research received no
specific grant from any funding agency in the public, commercial or not-for-profit sectors » ✔.

**Mais l'inférence est fausse.** Esperion **ne commercialise pas l'acide bempédoïque en France ni en
Europe**. L'avis HAS nomme l'exploitant français, p. 5 :

> « **Laboratoire : DAIICHI SANKYO FRANCE SAS (Exploitant)** »

et à la mise sur le marché, l'exploitant est **Organon** (Vidal, 13/01/2026 ; Le Moniteur,
22/03/2026 : « Organon (commercialisation) ; développé par Daiichi Sankyo »).

Or, dans la même déclaration de liens :
- **R. Valero déclare Daiichi Sankyo** (« Adelia Médical, Akcea, Amarin, Amgen, Arrowhead,
  AstraZeneca, Boehringer-Ingelheim, **Daiichi Sankyo**, Dinno Santé, Ionis, Janssen, Lilly, MSD,
  Nestlé, Novartis, Novo Nordisk, Orkyn, Pfizer, Sanofi-Regeneron, Servier ») ;
- **V. Aboyans déclare Organon** (« Amarin, Amgen, AstraZeneca, Boehringer Ingelheim, **Organon**,
  Novo Nordisk ») — de même que le relecteur C. Bergerot.

**Impact sur la décision** : l'asymétrie sur laquelle repose l'insinuation — « des liens avec le
fabricant du médicament promu, aucun avec le fabricant du médicament rétrogradé » — **se dissout** :
deux des onze auteurs déclarent des liens avec les sociétés qui vendent effectivement l'acide
bempédoïque en France. Chercher « Esperion » dans une déclaration française revient à chercher une
société sans présence commerciale en France. Le rapport se couvre (« Observation, pas
démonstration »), mais il inscrit malgré tout la conclusion en §4 comme explication (a) et en §8.6
comme instruction : la réserve ne neutralise pas un argument bâti sur la mauvaise société.

*Ce qui reste vrai et mérite d'être porté* : la reco est cosignée par des experts aux liens
industriels très étendus, dont 10/11 avec Amgen — c'est déjà la position du nœud
(`sources.reco_officielle.explication`), et elle n'a pas besoin de l'argument Esperion.

---

### HAUTE-5 — La hiérarchie que le rapport veut encoder n'est celle d'aucune source, et contredit la reco française qu'il invoque

**Citation contestée** (§2 étape 4, reprise en proposition d'alerte §8.3-A2) :
> « **ézétimibe d'abord** (position française, HAS et SFE/SFD/NSFA/SFC 2026), **acide bempédoïque
> ensuite et en association à l'ézétimibe** […], **anti-PCSK9 en dernier** »

**Ce que dit réellement la reco française** (§6.1, verbatim) :
> « The second-line treatment for isolated hypercholesterolemia is ezetimibe. In case of formal
> contraindication to statins or proven intolerance, treatment with ezetimibe alone may be
> considered. **Third-line treatment for hypercholesterolemia is based on PCSK9 inhibitors**
> (alirocumab and evolocumab) […] or in cases of intolerance or formal contraindication to statins
> and/or ezetimibe. »

puis, séparément :
> « Bempedoic acid is **a last-resort treatment option** […] »

La séquence française est donc **statine → ézétimibe → anti-PCSK9 → acide bempédoïque**, soit
**l'inverse** de ce que le rapport propose d'encoder tout en l'attribuant à la « position
française ». Le §4 du rapport écrit d'ailleurs correctement « Anti-PCSK9 : 3ᵉ ligne » et bempédoïque
« dernier recours » : **le document se contredit entre son §2/§8.3 et son §4.**

La HAS, elle, fait de l'ézétimibe un **prérequis de remboursement** de l'acide bempédoïque
(« en association à un traitement hypolipémiant optimisé **incluant au moins l'ézétimibe** ») — ce
qui n'est pas la même chose qu'un rang devant l'anti-PCSK9.

**Impact sur la décision** : encoder A2 tel quel afficherait à un prescripteur français une séquence
qu'aucune source française n'énonce. À reprendre : soit on affiche la séquence française réelle,
soit on affiche la divergence (France vs ESC vs ACC/AHA), mais on ne fabrique pas une synthèse en
l'attribuant à une source.

---

## 3. Findings MOYENNE

### MOYENNE-1 — « Kraut 2023 (8 ECR, n = 1 817) » : l'effectif est faux (double comptage)

906 + 911 = 1 817 additionne des **expositions**, pas des patients. **7 des 8 essais sont croisés ou
N-of-1** : les mêmes personnes alimentent les deux dénominateurs. Effectif réel ≈ **1 114 patients
uniques** (983 dans les 7 essais contribuant à l'issue d'intolérance). Le chiffre apparaît deux fois
(§2 étape 0 « 906 vs 911 » — exact ; §3 tableau « 8 ECR, 1 817 pts » — faux).
Accessoirement : le **RR 1,40 provient de 7 essais**, pas 8 (Taylor 2015 ne rapporte pas l'issue).

### MOYENNE-2 — La conclusion de Kraut est amputée de moitié, et l'opposition avec la CTT est une erreur de catégorie

Le rapport cite : « seul un tiers sera réellement intolérant lors d'une réintroduction en aveugle ».
La conclusion publiée est bicéphale : « only **one-third** […] will be intolerant of statins when
introduced in a blinded, placebo-controlled rechallenge, **and one-quarter of such individuals will
be intolerant of placebo** ». Et l'autre résultat de Kraut est **nul** : différence moyenne des
scores symptomatiques 1,08/100 (IC95 −1,51 à 3,67, NS).

De plus, **CTT 2022 et Kraut 2023 ne se contredisent pas** : populations différentes (non
sélectionnée vs présélectionnée pour intolérance) et issues différentes (déclaration de symptôme vs
intolérance/arrêt). Les présenter en opposition (« le rapport oppose à la méta-analyse CTT 2022 […]
deux sources ») est une erreur de catégorie.

**Ce qui survit et constitue un vrai finding** — à conserver, mais recadré : chez des patients
**déjà étiquetés intolérants** et réintroduits en aveugle, il existe un excès réel **d'ARRÊT de
traitement**, pas de symptômes : Kraut RR 1,40 (1,23-1,60), **NNH 10 — chiffre publié dans l'abstract,
pas une dérivation du rapport** ; Aebi 2025 (13 ECR, 1 868 participants) symptômes **OR 1,19
(0,86-1,64) NS** mais **arrêt OR 1,48 (1,03-2,12) significatif**. Le nœud ne porte pas cette nuance,
et il gagnerait à la porter. Mais c'est un finding beaucoup plus étroit que « le nœud penche du seul
côté du nocebo ».

### MOYENNE-3 — Le rapport a manqué le seul vrai seuil de CONTRE-INDICATION de sa propre source

Le rapport propose en §8.3-A3 : CK > 10 N → arrêt définitif ; CK 4-10 N → suspension puis
réintroduction à dose réduite ; transaminases > 3 N → réduction/arrêt. **Les trois sont verbatim
exacts** (voir §4 « Confirmé »). Mais le même paragraphe §6.1, trois phrases plus haut, contient
celle que le rapport ne cite pas :

> « Before starting statin treatment, it is necessary to perform […] CK tests to rule out muscle
> disease in subjects at risk of myopathy […] **The presence of progressive liver disease or CK
> levels >5-fold higher than normal are contraindications for statin therapy.** »

C'est la **seule** phrase de la reco qui emploie le mot *contraindication* — donc, au sens de R8/D21,
**la seule qui relève d'`options[].exclusions`**. Les trois autres faits ne sont pas de même grade :
- CK > 5 N **avant initiation** → contre-indication → `exclusions` ;
- CK > 10 N **sous traitement** → règle d'arrêt d'un traitement déjà en place (interagit avec
  `statine_deja_en_place`) ;
- CK 4-10 N → **qualifie** le geste (suspendre puis réintroduire plus bas) → `options[].alertes` ;
- transaminases > 3 N persistantes → idem.

Le rapport agrège quatre faits de trois grades D21 différents en un seul candidat « exclusion », et
en omet un. **Aucun encodage ne doit être fait sans les séparer.**
À signaler tel quel (invariant 6) : la source elle-même est en tension — > 5 N contre-indique
l'initiation, mais 4-10 N sous traitement conduit à réintroduire à dose plus faible. Ne pas trancher
à sa place.

### MOYENNE-4 — La « divergence de rang » compare un rang à un non-rang

- **ESC 2025 : classe I / niveau B — CONFIRMÉ.** « Bempedoic acid is specifically recommended in
  patients who cannot take statin therapy to achieve LDL-C goal » (Classe I, Niveau B) ; et l'ajout
  à la statine maximale tolérée est IIa/C. Source : escardio.org (site de la société savante
  elle-même — meilleure que la chaîne PACE-CME/*Atherosclerosis* utilisée par le rapport).
- **ESC 2024 (SCC + AOMI) : classe I / niveau B pour bempédoïque + ézétimibe chez l'intolérant** —
  **CONFIRMÉ verbatim dans l'avis HAS, p. 9**, exactement comme le rapport l'annonce.
- **« Dernier recours » français : CONFIRMÉ verbatim** — mais c'est **une phrase de texte courant,
  non graduée**. La table des recommandations graduées de la reco (**Table R3**, « Recommendations
  for the management of isolated hypercholesterolemia ») gradue la statine, l'ézétimibe (2ᵉ ligne)
  et les anti-PCSK9 (prévention secondaire) — et **ne contient aucune recommandation sur l'acide
  bempédoïque**, donc ni classe, ni niveau.

**Impact** : la divergence de *position* est réelle et vaut d'être portée. La divergence de *rang*
(« dernier recours contre classe I », « l'écart est maximal ») est une figure de style : le texte
français n'attribue aucun rang. Et la reco française rapporte CLEAR Outcomes **fidèlement** —
« reduced MACEs by 13 % and myocardial infarction by 23 %, **with no effect on the risk of stroke or
death** at a median follow-up of 40.6 months » — soit une lecture EBM-cohérente, pas manifestement
biaisée. L'explication (b) du rapport (« la lecture du même essai diverge ») suffit à elle seule ;
l'explication (a) est fausse (HAUTE-3) et l'argument COI vise la mauvaise société (HAUTE-4).

### MOYENNE-5 — Un faux aveu : deux chiffres déclarés « non revérifiés » sont verbatim dans les publications

§6 range parmi les « chiffres rapportés mais non vérifiés sur la source primaire » :
> « **CLEAR Outcomes, sous-groupe diabète** : […] la **réduction absolue de 2,4 %** provient d'un
> résumé de l'abstract et n'a **pas** été revérifiée […] Le NNT ≈ 42 qui en découle est donc
> **provisoire**. »

C'est **littéralement dans les *Findings*** du *Lancet Diabetes Endocrinol* 2024;12(1):19-28 :
« (HR 0·83; 95% CI 0·72-0·95; **absolute risk reduction of 2·4%**) ». De même, le JAMA 2023
(CLEAR prévention primaire) écrit explicitement « **2.3% absolute risk reduction** » et « **The
number needed to treat (NNT)… was 43 patients** » — c'est le **seul NNT réellement publié de tout le
dossier**, et le rapport ne le mentionne pas.

**Impact** : sur-déclarer l'incertitude est moins grave que la sous-déclarer, mais ce n'est pas
neutre — cela a conduit le rapport à écarter un chiffre correctement publié, et cela dévalue par
contagion les autres réserves de son §6, qui sont, elles, justifiées. Ici, OpenEvidence a raison
contre le rapport.

### MOYENNE-6 — Un chiffre non vérifiable présenté sans réserve

§3, lecture critique 2 : « ~22-23 % prenaient encore une statine à très faible dose […] et **38 % un
hypolipémiant quelconque (dont ézétimibe 12 %)** ».
- 22,7 % (n = 3 174) ✔ et les seuils protocolaires ✔ (rosuva < 5, atorva < 10, simva < 10, lova < 20,
  prava < 40, fluva < 40, pitava < 2 mg) ;
- ézétimibe = **11,5 %** (n = 1 612), pas 12 % ;
- **le « 38 % » est INTROUVABLE** dans toutes les sources accessibles (Table 1 NEJM sous paywall ;
  absent de PMC, ACC, TCTMD, ConsultQD). Il figure dans la partie **non réservée** du rapport, pas
  dans son §6.

### MOYENNE-7 — Un essai majeur, récent et directement pertinent est absent du dossier

**VESALIUS-CV** (évolocumab ; NEJM, présenté à l'AHA nov. 2025 ; **n = 12 257** ; **59 % de
diabétiques** ; 67 % d'athérosclérose documentée ; sans IDM ni AVC antérieur ; suivi médian
**4,6 ans** ; MACE-3 **−25 %**, MACE-4 **−19 %**) n'apparaît nulle part dans le rapport.

Il **ne réfute pas** l'affirmation d'absence (pivot 6) : l'essai a été mené sur fond de traitement
hypolipémiant optimisé (68 % statine haute intensité, 19 % ézétimibe), et n'a été **ni conçu, ni
stratifié, ni rapporté** dans une population d'intolérants. Mais c'est le plus grand et le plus
récent essai de critère dur d'un anti-PCSK9 dans une population majoritairement diabétique en
prévention primaire : un dossier qui inventorie la preuve dure des anti-PCSK9 pour ce nœud et qui
l'omet est incomplet. À verser aussi à `veille_liee`.

### MOYENNE-8 — Horizons temporels et NNT dérivés

- « FOURIER sous-groupe diabète : RRA 2,7 % → NNT ≈ 37 **/ 2,2 ans** » : la RRA 2,7 % (IC95 0,7-4,8)
  est une estimation **Kaplan-Meier à 3 ans** ; 2,2 ans est le **suivi médian**. Écrire « RRA 2,7 % à
  3 ans, suivi médian 2,2 ans ».
- **NNT 63 (CLEAR), 18 (IMPROVE-IT diabète), 37 (FOURIER diabète), 43 (ODYSSEY OUTCOMES diabète)
  sont tous des divisions dérivées**, arithmétiquement justes mais absentes des publications. Le
  rapport le dit pour FOURIER/ODYSSEY (§6) mais **pas pour le NNT ≈ 63**, qu'il place dans son
  verdict §1 et dans son alerte proposée §8.3-A2. R2 impose de distinguer publié et dérivé.

### MOYENNE-9 — « Neutre » est trop doux pour la mortalité dans CLEAR Outcomes

Le rapport écrit « AUCUN effet significatif sur AVC, mortalité CV, mortalité totale ». Exact, mais
les estimations ponctuelles sont **défavorables** : décès CV **HR 1,04 (0,88-1,24)**, décès toutes
causes **HR 1,03 (0,90-1,18)** (AVC HR 0,85 [0,67-1,07]). Combiné au sous-groupe prévention primaire
(HR 0,61 et 0,73), cela renforce — et non affaiblit — la prudence que le rapport s'impose déjà
(« signal fragile : à ne pas revendiquer »). À écrire explicitement si le nœud reprend CLEAR.

---

## 4. Findings BASSE

| # | Point | Ce que dit la source |
|---|---|---|
| BASSE-1 | Awad 2017 : « 12 ECR + 1 quasi-ECR » | **Le rapport a raison, OpenEvidence a tort** (« 13 RCTs »). Verbatim : « Twelve RCTs and 1 quasi-RCT (n = 1023) ». |
| BASSE-2 | SAMSON, nocebo ratio 0,90 sans IC | Confirmé : aucun IC n'est publié. Le rapport le déclare en §6 — correct. Ne jamais lui donner un air de précision. |
| BASSE-3 | Kennedy 2011 | Les myalgies « 20 % vs 11,8 % » reposent sur des **dénominateurs différents** (3/15 vs 2/17) ; la dose est **rosuvastatine 5 mg/sem titrée à 10 mg**, pas une dose fixe. n = 17 ✔, croisé double aveugle contre placebo ✔, LDL −12,2 % vs −0,4 % p = 0,002 ✔. |
| BASSE-4 | Goldberg 2013 | La comparaison des concentrations plasmatiques porte sur un **sous-groupe de 12 vs 11 patients**, pas sur les 58. Le reste (58 pts, 29,4 mg/sem, −34,4 ± 21,3 %) ✔. |
| BASSE-5 | EWTOPIA 75 | 3 796 = **inclus** ; population analysée **3 411** (~10 % d'attrition). Composite tiré par la revascularisation. Design ouvert (PROBE) ✔, comparateur = conseils diététiques ✔, japonais ≥ 75 ans ✔, HR 0,66 (0,50-0,86) p = 0,002 ✔, neutre sur AVC et mortalité ✔. |
| BASSE-6 | Le CYP3A4 « §5.1.3 » | Verbatim exact (« it is recommended to favor statins that do not interact with CYP3A4 (rosuvastatin, pravastatin, fluvastatin). It is recommended to start with a low dose and increase gradually, monitoring for muscular side-effects »), **mais dans la sous-section des interactions médicamenteuses** (VIH, transplantation), pas dans un protocole d'intolérance. Utilisable, à condition de dire le contexte. |
| BASSE-7 | Hygiène de citation | Douze entrées du §7 citent un acronyme d'essai ou un titre abrégé au lieu du titre publié (sans impact de traçabilité : PMID/DOI corrects). À noter : le consensus SFE/SFD/NSFA/SFC est **co-publié à l'identique dans trois revues** (Annales d'Endocrinologie, Diabetes & Metabolism, Archives of Cardiovascular Diseases), avec un DOI différent selon la revue. |

---

## 5. Ce qui est CONFIRMÉ

C'est la partie la plus lourde de cet audit : le rapport a très majoritairement raison sur les faits.

**Bibliographie — 26/26 conformes.** Chaque PMID résout vers l'article annoncé (auteurs, revue,
année, volume, pages, DOI). Les **trois références signalées comme potentiellement inventées sont
authentiques** : Aebi 2025 (PMID 41379822, PLoS One 2025;20(12):e0338575, publié le 11/12/2025) ;
le consensus français (PMID 41651737, 11 auteurs) ; ACC/AHA 2026 (PMID 41824590, vol. 87(19),
2624-2757, DOI exact). **Aucune référence fabriquée** — contraste net avec le nœud E.

**L'avis HAS — les quatre valeurs, re-vérifiées indépendamment sur le PDF :**
« Adopté par la Commission de la transparence le **12 février 2025** » ✔ · SMR **IMPORTANT** dans le
périmètre restreint / **INSUFFISANT** ailleurs ✔ · **ASMR V** ✔ · « La population cible dans le
périmètre retenu est estimée à **203 200 patients** » ✔. Le récit que fait le rapport de sa propre
défaillance d'outillage, et de sa correction, est exact.

**La motivation de l'ASMR V, verbatim** : incertitude sur la mortalité CV « du fait de l'absence de
démonstration d'une différence statistiquement significative versus placebo sur la réduction des
accidents vasculaires cérébraux, des décès d'origine cardiovasculaire et des décès toutes causes » ;
« absence de comparaison versus un comparateur actif, **alors que celle-ci était possible** » ;
« absence de données d'observance ou de qualité de vie ». Exactement comme le rapport le rend.

**Le garde-fou CK, verbatim (§6.1)** — le fait le plus opérationnel du dossier :
> « Persistent transaminase elevation, >3-fold higher than the normal level, should lead to a dose
> reduction or discontinuation. CK levels are measured in case of muscle symptoms. **If CK levels
> are >10-fold higher than the normal level, statin treatment is stopped permanently. If CK levels
> are between 4 and 10 times the normal level, statin treatment is suspended until CK levels return
> to normal, and is then reintroduced at a lower dose.** »
Numéro de section correct. (Voir MOYENNE-3 pour ce qui manque autour.)

**L'épidémiologie de la myopathie, verbatim** : myopathie définie par CK > 10 N, causalité
« proven », « annual incidence estimated at 1 case per 10,000 patients treated » ; rhabdomyolyse
« 2 to 3 cases per 100,000 patients treated » ; troubles musculaires non myopathiques « 10 to 20
cases per year per 10,000 subjects treated ». Tous exacts.

**La justification de la titration, verbatim** : « **This dose titration allows the threshold for
onset of adverse muscular effects to be identified.** » L'étape 4 du rapport est exacte.

**L'ézétimibe comme alternative française de 1re ligne, verbatim** : « In case of formal
contraindication to statins or proven intolerance, treatment with ezetimibe alone may be
considered. »

**« Une autre statine peut être utilisée en cas d'intolérance »** — verbatim dans l'avis HAS
(reprenant l'ESC/EAS 2019), exactement comme le rapport l'attribue.

**Le décompte des conflits d'intérêt** : 11 auteurs, 10 avec Amgen (les dix noms sont les bons),
9 relecteurs, « This research received no specific grant… » verbatim. (Voir HAUTE-4 pour
l'inférence.)

**SAMSON et StatinWISE sont bien non industriels, et tous leurs chiffres sont exacts.**
SAMSON = British Heart Foundation (PG/15/7/31235) + NIHR Imperial BRC ; StatinWISE = NIHR HTA
(14/49/159), promoteur LSHTM. Chiffres : EVA 8,0 / 15,4 / 16,3, p = 0,388, p < 0,001, nocebo ratio
0,90, 46/213 (21,6 %) vs 38/221 (17,2 %) OR 1,48 (0,85-2,62) p = 0,173, 30/60 (50 %) à 6 mois ;
StatinWISE −0,11 (−0,36 à 0,14) p = 0,40, 18 (9 %) vs 13 (7 %), deux tiers ayant repris (74/113).
**Et GAUSS-3 est bien financé par Amgen** (NCT01984424, lead sponsor Amgen, aucun collaborateur).

**GAUSS-3 phase A est bien un rechallenge croisé EN DOUBLE AVEUGLE** (masquage quadruple ;
atorvastatine 20 mg ou placebo 10 semaines, wash-out 2 semaines, crossover 10 semaines ; 491 entrés
en phase A sur 511 randomisés ; inclusion = antécédent d'intolérance à ≥ 2 statines). Phase B
−54,5 % vs −16,7 % ✔. **La description du design par le rapport est correcte ; seule son
interprétation ne l'est pas** (HAUTE-2).

**Kraut 2023** : 36 % (325/906) vs 26 % (233/911) ✔ ; RR 1,40 (1,23-1,60) ✔ ; **NNH 10 figure dans
l'abstract publié** (ce n'est pas une dérivation du rapport) ✔ ; MD 1,08 (−1,51 à 3,67) ✔.

**Aebi 2025** : 13 ECR, 1 868 participants, symptômes OR 1,19 (0,86-1,64) NS, arrêt OR 1,48
(1,03-2,12) ✔ — tous exacts.

**Observationnel** : Zhang 2017 (28 266 ; 19 989 [70,7 %] ; 12,2 % vs 13,9 %, différence 1,7 %
[0,8-2,7] p < 0,001 ; 7 604 switchés, 2 014 [26,5 %], 1 696 [84,2 %]) ✔ ; Mampuya 2013 (1 605 ;
72,5 % ; 149 en intermittent, −21,3 % vs −27,7 %) ✔.

**CLEAR Outcomes, en entier** : 13 970 ; 40,6 mois ; 11,7 % vs 13,3 %, HR 0,87 (0,79-0,96)
p = 0,004 ; IDM 3,7 % vs 4,8 % HR 0,77 ; revascularisation 6,2 % vs 7,6 % HR 0,81 ; AVC HR 0,85 ;
décès CV HR 1,04 ; décès toutes causes HR 1,03 ; goutte 3,1 % vs 2,1 % ; lithiase biliaire 2,2 % vs
1,2 % ; LDL −29,2 mg/dL soit −21,1 points ; 22,7 % encore sous statine à très faible dose avec les
seuils protocolaires exacts.
**CLEAR diabète** : 6 373 (45,6 %), HR 0,83 (0,72-0,95), p interaction 0,42, diabète incident 11,1 %
vs 11,5 % HR 0,95 ✔.
**CLEAR prévention primaire** : n = 4 206, décès CV HR 0,61 (0,41-0,92), décès toutes causes HR 0,73
(0,54-0,98) ✔.

**IMPROVE-IT diabète** : 4 933 (27 %), HR 0,85 (0,78-0,94), 5,5 % absolus à 7 ans, non-diabétiques
HR 0,98 / 0,7 %, p interaction 0,02 ✔.
**ODYSSEY ALTERNATIVE** : n = 361, −45,0 % vs −14,6 %, événements musculo-squelettiques HR 0,61
(0,38-0,99) p = 0,042, trois bras dont un bras de rechallenge atorvastatine 20 mg ; **critère = LDL à
24 semaines, aucun critère dur** ✔.
**FOURIER diabète** : HR 0,83 (0,75-0,93), RRA 2,7 % (0,7-4,8) ✔.
**ODYSSEY OUTCOMES diabète** : RRA 2,3 % (0,4-4,2) vs 1,2 % (prédiabète) et 1,2 % (normoglycémie) —
« ≈ le double » ✔ (1,9×). *Note* : l'abstract ne publie **pas** de HR propre au strate diabète — ne
pas en inventer un.

**L'affirmation d'absence (pivot 6) TIENT.** Elle a été activement attaquée sans succès : ODYSSEY
ALTERNATIVE (LDL seul), GAUSS-1 à -4 (critères lipidiques), FOURIER / ODYSSEY OUTCOMES (sous
statine), **VESALIUS-CV** (sur fond de statine optimalement tolérée, aucun sous-groupe intolérant
publié), **ORION-4** (inclisiran, non publié, population définie par l'ASCVD), VICTORION-2P (2027).
**Recommandation de rédaction** : écrire « aucun essai de morbi-mortalité **conduit dans une
population définie par l'intolérance aux statines** » plutôt que « chez des patients intolérants » —
VESALIUS-CV et ORION-4 contiennent certainement des intolérants sans être des essais d'intolérance.
Et **H2 tient** : CLEAR Outcomes reste le seul essai de morbi-mortalité mené dans cette population —
avec la nuance, que le rapport porte déjà, que l'intolérance y est **déclarative** (« unable or
unwilling ») et que 22,7 % prenaient encore une statine à très faible dose.

**La discipline dur / substitution est, dans l'ensemble, respectée** — c'est la meilleure qualité du
rapport. Il marque EWTOPIA 75 comme preuve faible (ouvert, comparateur non traité), il refuse
explicitement le schéma alterné sur critère dur (« vrai sur le LDL, non démontré sur les
événements »), il refuse de revendiquer le signal de mortalité du sous-groupe de CLEAR, et il
signale qu'IMPROVE-IT est un add-on chez des patients **tolérant** la statine. Les manquements sont
locaux (MOYENNE-8, MOYENNE-9), pas structurels.

---

## 6. Divergences avec OpenEvidence — tranchées

| # | Divergence | Tranchage |
|---|---|---|
| 1 | **ACC/AHA 2026 n'exige plus l'ézétimibe avant un anti-PCSK9.** OE l'affirme ; le rapport déclare tout le contenu ACC/AHA 2026 non vérifié. | **OE a raison, et c'est vérifiable sans le texte payant.** Confirmé par une source secondaire indépendante (EBM Focus / DynaMed : « ezetimibe is no longer required to precede PCSK9 inhibitors when therapy intensification is needed »), corroborée par AJMC. Le §6 du rapport est **trop large** : des ressources ACC/JACC gratuites existent (page ACC de publication, « 2026 Dyslipidemia Guideline-at-a-Glance », JACC doi:10.1016/j.jacc.2026.02.4872) et n'ont pas été utilisées. **Mais** l'algorithme en 5 étapes d'OE avec « Class I, LOE B-R » reste non vérifié, et la citation qu'OE attribue verbatim au guideline (« the efficacy of intermittent statin dosing on ASCVD outcomes has not been established ») n'a pas pu être contrôlée. → Retenir le seul point ézétimibe/PCSK9i, comme fait de source secondaire ; écarter le reste. |
| 2 | **Awad 2017 : 13 ECR (OE) vs 12 ECR + 1 quasi-ECR (rapport).** | **Le rapport a raison, OE a tort.** |
| 3 | **CLEAR-diabète, RRA 2,4 %.** OE l'affirme ; le rapport la déclare non revérifiée et en tire un NNT « provisoire ». | **OE a raison, le rapport a tort de douter** — le chiffre est verbatim dans les *Findings*. |
| 4 | **CLEAR prévention primaire : « ARR 2,3 %, NNT 43 ».** OE l'affirme ; le rapport ne le mentionne pas. | **OE a raison** : les deux figurent explicitement dans le JAMA, et c'est le **seul NNT réellement publié** du dossier. |
| 5 | **SAMSON / StatinWISE non industriels et centraux.** | **Aucune divergence : OE et le rapport concordent, et les deux ont raison.** Financements vérifiés. |
| 6 | **OE : « > 90 % des patients tolèrent finalement une statine à 1 an » (rechallenge non aveugle, rétrospectif).** Le rapport donne 72,5 % (Mampuya) et 73,5 % (Zhang). | **Non tranchable.** OE l'attribue à du matériel VA/DoD (Reston 2020, Heidenreich 2026), non vérifié. Les chiffres ne sont pas contradictoires (dénominateurs et définitions différents). **N'encoder ni l'un ni l'autre comme « le » chiffre.** |
| 7 | **OE : l'acide bempédoïque est une prodrogue activée uniquement dans le foie, pas dans le muscle → pas d'excès d'événements musculaires.** Le rapport ne porte pas ce point. | **OE a raison, et la reco française le dit verbatim** : « it is a prodrug that is activated only in the liver and not in the muscles, which reduces the risk of myopathy » ; « The tolerance profile is generally good, **with no significant muscle pain, even in patients intolerant to statins** ». C'est sans doute la propriété la plus décisive de la molécule dans ce nœud précis, et **elle manque au rapport**. |
| 8 | **OE : FOURIER, ARR 3,5 % / NNT ~35 chez le très haut risque.** | **Non vérifié. Ne pas utiliser.** |

---

## 7. Ce qui reste invérifiable

- **ACC/AHA 2026, texte intégral** : les classes et niveaux exacts de l'algorithme d'intolérance. Les
  synthèses ACC/JACC gratuites confirment la direction (ézétimibe non exigé avant PCSK9i ; acide
  bempédoïque reconnu chez l'intolérant) mais pas les grades. Le **communiqué Esperion du 16 mars
  2026 existe bien** et revendique « multiple Class 1 recommendations », spécifiquement « for
  patients with clinical ASCVD experiencing statin-attributed muscle symptoms **and for adults with
  diabetes who have statin-attributed side effects** » — affirmation d'un fabricant sur un texte
  payant. **Le rapport a raison de la traiter comme un indice d'alerte et non comme un fait.**
- **NICE NG238** : toujours en 403 (re-testé). Le lavage 4-6 semaines, les seuils ALAT < 3 N /
  CK < 5 N et la réintroduction atorvastatine 20 → 40 mg restent de source secondaire.
  **⚠ Conséquence sous-estimée par le rapport** : ses étapes 1 à 3 — c'est-à-dire l'essentiel du
  « protocole » qu'il propose d'écrire en alerte (§8.3-A1, point 3) — reposent presque entièrement
  sur cette source non lue. **Ne pas encoder ces chiffres.**
- **ESC/EAS 2025, texte intégral** : EHJ en 403 ; la co-publication *Atherosclerosis* est également
  en 403 (re-testée). La classe I/B est confirmée par le site de l'ESC elle-même — meilleur que la
  chaîne secondaire utilisée par le rapport — mais ce n'est pas la table des recommandations.
- **ADA Standards of Care 2026, chap. 10** : payant. OE affirme que l'ADA recommande « ezetimibe
  and/or bempedoic acid » chez le diabétique intolérant ; grade non vérifié.
- **Prescrire** : paywall respecté, aucune position consultée, rien deviné. Conforme à l'invariant 7.
- **Minerva** : non lu.
- **CLEAR Outcomes, « 38 % sous hypolipémiant quelconque »** : introuvable dans toute source
  accessible (MOYENNE-6).
- **Ventilation complète de GAUSS-3 phase A** (26,5 % / 9,8 % / 17,3 %) : le texte intégral JAMA est
  payant ; ces trois chiffres proviennent d'une revue en accès libre (PMC5761646) recoupée par la
  couverture ACC/Medscape. Seul le 42,6 % est verbatim dans l'abstract. **La conclusion de HAUTE-2
  ne dépend pas de la précision de ces trois chiffres** : elle tient dès lors que le bras placebo
  produit un taux de symptômes du même ordre de grandeur, ce qui est établi.

---

## 8. Sa proposition finale (§8.2) — le meilleur argument CONTRE

**Sa conclusion** : ne PAS créer d'option ; l'intolérance est orthogonale à la stratification du
risque ; une option reproduirait le mislabeling HAUTE-4 ; préférer prose + alertes + garde-fou CK +
un critère distinguant intolérance rapportée et avérée.

**Verdict** : les prémisses sont justes, la conclusion est sous-argumentée, et le repli qu'il
préfère (Voie A) laisse le nœud **exactement dans la configuration que D21 existe pour interdire**.

**(a) Le titre de la première option est une prescription que l'intolérance avérée falsifie.**
En `ordered-first-match`, un patient `ASCVD_etablie == true` reçoit d'abord et uniquement « Statine
de haute intensité — prévention secondaire », dont les `contre_indications` précisent
« atorvastatine 40-80 mg ou rosuvastatine 10-20 mg ». Pour un intolérant avéré, cette carte
**recommande un geste que le dossier dit indisponible**. Au sens de R8/D21 ce n'est pas un fait qui
« qualifie » un geste, c'est un fait qui le rend contre-indiqué — la configuration même pour
laquelle D21 a été écrite, et le défaut exact (« l'alerte dialyse interdisait ce que rien ne
retirait ») corrigé sur **ce nœud** six semaines plus tôt. Le §8.1 du rapport — « l'alerte
`intolerance_statine == true` existante est **exacte** » — est vrai du *texte* de l'alerte et faux du
*couple* (carte + alerte) que voit le prescripteur.

**(b) L'orthogonalité est vraie mais ne prouve pas ce qu'il lui fait prouver.** Elle interdit de
faire de l'intolérance un critère de *routage* dans la chaîne ordonnée — correct : un intolérant en
prévention secondaire reste un patient de prévention secondaire. Elle n'interdit ni une `exclusion`,
ni une `options[].alertes`, ni un nœud distinct. D21 a déjà démontré **sur ce fichier** qu'on peut
retirer une option sans toucher à l'ordre.

**(c) Mais une `exclusion` nue serait bien dangereuse — et c'est là que le rapport a raison.**
Exclure « haute intensité » sur intolérance avérée laisserait la chaîne tomber sur « discuter »
(faible risque) ou sur le `default` (primaire modérée), reproduisant HAUTE-4 à l'identique — un
patient de prévention secondaire affiché comme à faible risque — et, en prime, lui proposant une
statine d'intensité **modérée** qu'il ne peut pas davantage prendre. Et I2′ interdit d'exclure le
repli. La crainte du rapport est donc légitime. **Ce qui n'en découle pas, c'est sa conclusion.**
L'inférence correcte de (a) + (c) est que **le nœud manque d'une option terminale** — une 4ᵉ option
toujours atteignable, « statine non disponible → alternatives » — et non qu'il ne faut rien créer.
C'est la Voie B (ou une 4ᵉ option interne), que le rapport écarte en une ligne sur un argument de
comptabilité : « cela crée un 8ᵉ nœud DT2 alors que le domaine vient d'être déclaré complet ». La
complétude d'un domaine n'est ni un argument clinique ni un argument de sécurité, et c'est le seul
qu'il oppose à la Voie B.

**(d) La Voie A coûte au projet sa discipline centrale.** Une alerte porte un `niveau`
(info/attention) et une chaîne de caractères. Une option porte `type_critere` via `sources`,
`niveau_preuve` (GRADE), `effet_attendu`, `delai_benefice` — **obligatoire par le schéma pour toute
option revendiquant un bénéfice sur critère dur en preuve modérée ou élevée** —, `avantages`,
`inconvenients`, `contre_indications`. Or le fait le plus important de tout ce dossier — l'acide
bempédoïque est le seul agent disposant d'un essai de critère dur dans cette population, NNT ≈ 63
sur 3,4 ans, **neutre sur la mortalité et l'AVC**, NNH ≈ 100 pour la goutte et pour la lithiase
biliaire — est très exactement un objet `type_critere: dur` / `niveau_preuve` / `effet_attendu` /
`delai_benefice`. Le mettre dans une chaîne d'alerte le dépouille de tous les champs structurés que
le projet a construits pour faire respecter la distinction dur/substitution, et le rend
inauditable par le banc. Le §8.6 du rapport demande d'ailleurs d'ajouter ces références **avec
`type_critere`** à `sources` — pendant que son §8.2 supprime la seule structure qui les consomme.

**(e) Deux points annexes, en faveur du rapport cette fois.** R5 est bien satisfait par des alertes
A1/A2 différenciées : le nouveau critère est défendable dans les deux voies. Et sa forme préférée
(critère `liste` à 3 valeurs) est **techniquement propre** : le schéma accepte `liste`
(`enum: ["nombre","bool","enum","liste"]`) et `confirmation_requise` est disponible pour
`bool`/`liste`. Mieux : la distinction rapportée / avérée a une **conséquence administrative
concrète en France** — la HAS conditionne le remboursement de l'acide bempédoïque à une
« intolérance **avérée** » ET à un traitement « incluant au moins l'ézétimibe ». Cela renforce
l'argument de faire piloter par ce critère une vraie option plutôt qu'un paragraphe.

**Net.** Le §8.2 est une réponse *intérimaire* défendable et le §8.4 est le bon geste. Mais il doit
être présenté au référent comme un **arbitrage ouvert** entre (A) prose + alertes et (B) une 4ᵉ
option terminale / un nœud distinct — avec l'énoncé honnête que (A) laisse à l'écran une carte
recommandant une statine à un patient qui ne peut pas en prendre, contredite par une seule alerte,
c'est-à-dire la configuration D21. Le rapport présente (A) comme « recommandée » et (B) comme
coûteuse ; l'argument de sécurité court en sens inverse.

**⚠ Et si quoi que ce soit est encodé** : ne pas reprendre le libellé A1 (« 42,6 % […]
reproductibles », HAUTE-2), ni la correction « remboursé depuis février 2025 » (HAUTE-3), ni la
hiérarchie ézétimibe → bempédoïque → anti-PCSK9 attribuée à la reco française (HAUTE-5), ni
« 8 ECR, 1 817 pts » (MOYENNE-1), ni le protocole NICE non lu (§7).

---

## 9. Sources

**Documents primaires téléchargés et extraits intégralement pour cet audit**

| Source | Lien |
|---|---|
| SFE/SFD/NSFA/SFC 2026, « Management of dyslipidemia in adults », *Diabetes Metab* 2026;52(2):101725, PMID 41651737 — **PDF intégral lu** (§5.1.2, §5.4, §6.1, Tables R1-R5, Declaration of competing interest) | https://www.sfdiabete.org/sites/www.sfdiabete.org/files/files/ressources/management_of_dyslipidemia_in_adults._guidelines_sfe_sfd_nsfa_sfc_2026.pdf |
| HAS, Commission de la transparence, avis NILEMDO 180 mg (acide bempédoïque), adopté le 12/02/2025 — **PDF intégral lu** (p. 1-2, 5-6, 8-9, 38, 44) | https://www.has-sante.fr/upload/docs/evamed/CT-20960_NILEMDO_PIC_INS_AvisDef_CT20960.pdf |

**Essais et méta-analyses (PubMed / PMC / ClinicalTrials.gov)**

| Réf. | Lien |
|---|---|
| GAUSS-3 — Nissen SE et al., *JAMA* 2016;315(15):1580-1590, PMID 27039291 | https://pubmed.ncbi.nlm.nih.gov/27039291/ |
| GAUSS-3, design et financement — NCT01984424 | https://clinicaltrials.gov/study/NCT01984424 |
| Kraut R et al., *PLoS One* 2023;18(12):e0295857, PMID 38128013 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10735036/ |
| Aebi PS et al., *PLoS One* 2025;20(12):e0338575, PMID 41379822 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12698018/ |
| SAMSON — Wood FA et al., *NEJM* 2020;383(22):2182-2184, PMID 33196154 | https://pubmed.ncbi.nlm.nih.gov/33196154/ |
| SAMSON, analyse étendue — Howard JP et al., *JACC* 2021;78(12):1210-1222, PMID 34531021 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8453640/ |
| StatinWISE — Herrett E et al., *BMJ* 2021;372:n135, PMID 33627334 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7903384/ |
| Awad K et al., *Cardiovasc Drugs Ther* 2017;31(4):419-431, PMID 28741244 | https://pubmed.ncbi.nlm.nih.gov/28741244/ |
| Kennedy SP et al., *J Clin Lipidol* 2011;5(4):308-315, PMID 21784377 | https://pubmed.ncbi.nlm.nih.gov/21784377/ |
| Goldberg AS et al., *Can J Cardiol* 2013;29(8):915-919, PMID 23465343 | https://pubmed.ncbi.nlm.nih.gov/23465343/ |
| Zhang H et al., *Ann Intern Med* 2017;167(4):221-227, PMID 28738423 | https://pubmed.ncbi.nlm.nih.gov/28738423/ |
| Mampuya WM et al., *Am Heart J* 2013;166(3):597-603, PMID 24016512 | https://pubmed.ncbi.nlm.nih.gov/24016512/ |
| CLEAR Outcomes — Nissen SE et al., *NEJM* 2023;388(15):1353-1364, PMID 36876740 | https://pubmed.ncbi.nlm.nih.gov/36876740/ |
| CLEAR diabète — Ray KK et al., *Lancet Diabetes Endocrinol* 2024;12(1):19-28, PMID 38061370 | https://pubmed.ncbi.nlm.nih.gov/38061370/ |
| CLEAR prévention primaire — Nissen SE et al., *JAMA* 2023;330(2):131-140, PMID 37354546 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10336623/ |
| IMPROVE-IT diabète — Giugliano RP et al., *Circulation* 2018;137(15):1571-1582, PMID 29263150 | https://pubmed.ncbi.nlm.nih.gov/29263150/ |
| EWTOPIA 75 — Ouchi Y et al., *Circulation* 2019;140(12):992-1003, PMID 31434507 | https://pubmed.ncbi.nlm.nih.gov/31434507/ |
| ODYSSEY ALTERNATIVE — Moriarty PM et al., *J Clin Lipidol* 2015;9(6):758-769, PMID 26687696 | https://pubmed.ncbi.nlm.nih.gov/26687696/ |
| FOURIER diabète — Sabatine MS et al., *Lancet Diabetes Endocrinol* 2017;5(12):941-950, PMID 28927706 | https://pubmed.ncbi.nlm.nih.gov/28927706/ |
| ODYSSEY OUTCOMES diabète — Ray KK et al., *Lancet Diabetes Endocrinol* 2019;7(8):618-628, PMID 31272931 | https://pubmed.ncbi.nlm.nih.gov/31272931/ |
| CTT 2022 — *Lancet* 2022;400(10355):832-845, PMID 36049498 | https://pubmed.ncbi.nlm.nih.gov/36049498/ |
| VESALIUS-CV (évolocumab, AHA 2025 / NEJM) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12862970/ |
| ORION-4 (inclisiran, critères d'éligibilité) | https://www.orion4trial.org/for-healthcare-professionals/eligibility-criteria |

**Recommandations et statut réglementaire**

| Source | Lien |
|---|---|
| ESC/EAS 2025 focused update, PMID 40878289 — texte intégral 403 (EHJ **et** *Atherosclerosis*) | https://pubmed.ncbi.nlm.nih.gov/40878289/ |
| ESC — « Bempedoic acid: mechanism, evidence, safety, and guideline role in 2025 » (classe I/B confirmée sur le site de la société savante) | https://www.escardio.org/communities/councils/cardiology-practice/education/cardiopractice/bempedoic-acid-mechanism-evidence-safety-and-guideline-role-in-2025/ |
| ACC/AHA 2026, PMID 41824590 — texte intégral non lu | https://www.jacc.org/doi/10.1016/j.jacc.2025.11.016 · miroir *Circulation* doi:10.1161/CIR.0000000000001423 |
| ACC — annonce de publication de la reco 2026 (accès libre) | https://www.acc.org/latest-in-cardiology/journal-scans/2026/03/13/15/20/acc-aha-release-new-clinical-guideline-for-managing-dyslipidemia |
| EBM Focus / DynaMed — « Top Takeaways From the Updated ACC/AHA Guideline » (source du point « ézétimibe non exigé avant PCSK9i ») | https://about.ebsco.com/clinical-decisions/dynamed-solutions/about/ebm-focus/top-takeaways-updated-accaha-guideline |
| Esperion — communiqué du 16/03/2026, « multiple Class 1 recommendations » (affirmation de fabricant, non un fait) | https://www.esperion.com/news-releases/news-release-details/esperions-bempedoic-acid-receives-multiple-class-1 |
| NICE NG238 — **403, non lu** | https://www.nice.org.uk/guidance/ng238 |
| Vidal — mise à disposition de NILEMDO (JO du 12/12/2025, 65 %, exploitant Organon), 13/01/2026 | https://www.vidal.fr/actualites/37300-nilemdo-nouvelle-option-therapeutique-en-cas-de-contre-indication-ou-d-intolerance-aux-statines.html |
| La Veille Acteurs de Santé — JORF du 8 au 14 décembre 2025 (arrêté du 09/12/2025, publication 12/12/2025) | https://www.veille-acteurs-sante.fr/2025/12/15/la-semaine-la-sante-dans-le-jorf-du-8-au-14-decembre/ |
| Le Moniteur des pharmacies — NILEMDO « désormais disponible en France », Organon (commercialisation), 22/03/2026 | https://www.lemoniteurdespharmacies.fr/therapeutique/medicaments/fiches-medicaments/intolerance-aux-statines-nilemdo-nouvel-allie-contre-la-maladie-cardiovasculaire-atherosclereuse |

---

*Red-team B — aucun fichier de `content/`, aucun test et aucun rapport audité n'a été modifié.*
