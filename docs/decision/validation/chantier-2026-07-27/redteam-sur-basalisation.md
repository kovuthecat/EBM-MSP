# Red-team adversarial — seuil de sur-basalisation (0,5 U/kg/j)

Audit contradictoire de `preuve-sur-basalisation.md`, chantier 2026-07-27, nœud `insuline` (DT2).
Confronté au retour OpenEvidence archivé (`OE-retour-brut.md`, dernière section) et au nœud
`content/noeuds/diabete-type-2/insuline.yaml`.

**Aucun fichier de contenu, test ou rapport audité n'a été modifié.** Lecture seule ; ce document est
le seul écrit.

**Mandat** : réfuter, pas confirmer. Toute affirmation ci-dessous a été rouverte à la source primaire,
indépendamment du rapport audité.

---

## 0. Verdict global en une phrase

**La recommandation est suivable pour trois de ses quatre points (P1, P2, P4), dont le point pivot est
confirmé mot pour mot à la source primaire ; mais P3 doit être REJETÉ en l'état — la prémisse « pas
d'excès d'hypoglycémie » repose sur une lecture sélective d'un article que le rapport n'a pas ouvert
alors qu'il est en accès libre, et dont l'analyse intra-patient dit exactement le contraire — et le
rapport contient par ailleurs un jeu de chiffres faux (Stewart-Lynch) et une section §6 « non
vérifiable » majoritairement erronée.**

---

## 1. LE POINT PIVOT : tranché — le retrait ADA est ÉTABLI

Vérifié directement sur les trois éditions, à la source (PMC), plus le *Summary of Revisions* que le
rapport déclarait inaccessible.

### 1.1 ADA 2023 — le seuil EST là (rec 9.14, grade E)

> « Clinicians should be aware of the potential for overbasalization with insulin therapy. **Clinical
> signals that may prompt evaluation of overbasalization include basal dose more than ∼0.5
> units/kg/day**, high bedtime–morning or postpreprandial glucose differential, hypoglycemia (aware or
> unaware), and high glycemic variability. Indication of overbasalization should prompt reevaluation to
> further individualize therapy. » — **rec 9.14, grade E**
> (*Diabetes Care* 2023;46(Suppl 1):S140-S157, PMC9810476)

### 1.2 ADA 2025 — le seuil N'Y EST PLUS (rec 9.27, grade E)

Recommandation :

> « Monitor for signs of overbasalization during insulin therapy, such as significant
> bedtime-to-morning or postprandial-to-preprandial glucose differential, occurrences of hypoglycemia
> (aware or unaware), and high glycemic variability. When overbasalization is suspected, a thorough
> reevaluation should occur promptly to further tailor therapy to the individual's needs. » — **E**

Et le corps de texte 2025, vérifié séparément (c'est le contrôle décisif : un retrait de la
recommandation avec maintien dans la prose ne serait pas un retrait) :

> « Clinical signals that should prompt evaluation for overbasalization include high bedtime-to-morning
> or preprandial-to-postprandial glucose differential (e.g., bedtime-to-morning glucose differential
> ≥50 mg/dL [≥2.8 mmol/L]), hypoglycemia (aware or unaware), and high glucose variability. »
> → **le seuil pondéral est absent de la prose aussi.** (PMC11635045)

### 1.3 Le *Summary of Revisions* 2025 — phrase officielle, OUVERTE et LUE

Le rapport audité écrit (§6-4, §7-15) que cette page est en 403 et que la formulation vient « de deux
sources secondaires concordantes ». **C'est faux : elle est en accès libre sur PMC (PMC11635056).**
Texte exact :

> « **Recommendation 9.27 was revised to remove consideration of basal insulin doses exceeding 0.5
> units/kg/day as evidence of overbasalization.** Instead, signs of overbasalization including
> significant bedtime-to-morning or postprandial-to-preprandial glucose differential, occurrences of
> hypoglycemia (aware or unaware), and high glycemic variability should be used. »

### 1.4 ADA 2026 — toujours absent (rec 9.26, grade E)

> « Clinical signals that should prompt evaluation for overbasalization include high bedtime-to-morning
> or postprandial-to-preprandial glucose differential (e.g., bedtime-to-morning glucose differential
> ≥50 mg/dL [≥2.8 mmol/L]), hypoglycemia (aware or unaware), and high glucose variability. »
> Rec 9.26 : identique à 9.27/2025. **« 0.5 units/kg » n'apparaît qu'une fois dans tout le document, et
> dans un contexte sans rapport : dose de départ typique chez l'adulte DT1 métaboliquement stable.**
> (PMC12690185)

### 1.5 Verdict du pivot

**Le retrait est établi, par comparaison directe des trois textes ET par la phrase officielle du
*Summary of Revisions*.** Le rapport audité a raison sur le fait, et il l'était même davantage qu'il ne
le croyait (il tenait la formulation officielle pour non vérifiée).

**MAIS — et c'est une correction de fond au rapport :**

1. **Retiré ≠ réfuté.** L'ADA n'écrit nulle part que le seuil est faux, ni qu'un essai l'a démenti.
   Elle change un instrument de repérage pour un autre, au **même grade E**, c'est-à-dire au même
   niveau de preuve (consensus d'experts). Le rapport emploie « **désavoué** » (§2.1 tableau, §4
   tableau, §8.2-1) : le mot est plus fort que le fait. Sur les marqueurs de remplacement, l'ADA n'a pas
   plus de preuve qu'elle n'en avait sur celui qu'elle retire — le rapport le reconnaît lui-même au §5
   (« ils ne sont pas mieux *prouvés* »), puis l'oublie dans sa conclusion.
2. **L'ADA n'a pas retiré le CONCEPT, ni l'hypoglycémie.** Elle conserve « overbasalization » comme
   objet clinique, et conserve **l'hypoglycémie (ressentie ou non)** comme signal. Cela pèse
   directement sur P3 (voir H1).

---

## 2. LA DIVERGENCE OE / AGENT : tranchée

**Question (a) — le seuil figure-t-il dans l'ADA 2026 ? NON.** Vérifié ci-dessus, texte intégral,
recommandation et prose. **OE a tort** quand il écrit que le seuil est « referenced in ADA Standards of
Care 2026 », et **OE se contredit** : sa propre énumération des signaux ADA 2026 (§3 de sa réponse)
n'inclut pas le seuil pondéral. Son tableau §4 attribue pourtant le « >0.5 U/kg/day » à
« Umpierrez 2019; AACE 2023/2026; **ADA 2026** ». C'est une erreur d'attribution, pas une nuance.

**Question (b) — le seuil figure-t-il chez l'AACE ? OUI, et depuis bien avant 2023.**

- **Source primaire décisive**, dans l'article que le rapport audité a lu (Umpierrez 2019, PMC6594069) :
  > « The **0.5-IU/kg/d basal insulin threshold dose cited in the ADA and AACE/ACE 2018 guidelines**
  > appears to be mainly based on expert opinion rather than analysis of clinical data. »
  → l'AACE portait le seuil **dès 2018**. OE, qui date sa première apparition AACE de 2023, **a tort**.
- **Corroboration primaire indépendante** (Chun J, Strong J, Urquhart S, *Diabetes Spectrum*
  2019;32(2):104-111, PMC6528396), qui cite les *Standards of Medical Care in Diabetes—2018* :
  > « A basal insulin dose >0.5 units/kg, a >50 mg/dL difference between bedtime (Be) and the next
  > morning's (AM) SMBG value (known as the "BeAM value"), or an absolute morning glucose level
  > <70 mg/dL should be recognized as potential overbasalization. »
- **AACE 2023 et 2026** : *Endocrine Practice* renvoie un **403** sur les deux articles
  (S1530-891X(23)00034-4 et S1530-891X(26)00022-4), et la page AACE grand public ne contient aucun
  seuil. Les sources secondaires consultées (recherches indexant le texte des deux algorithmes)
  décrivent de façon concordante un maintien du seuil >0,5 U/kg à côté de la GPP > 180 mg/dL et du BeAM
  ≥ 50 mg/dL. **Statut : concordant mais NON OUVERT à la source primaire — je ne l'affirme pas.**

**Conséquence — l'hypothèse suggérée par la mission est la bonne, et elle change le vocabulaire de la
conclusion :** ADA et AACE **divergent**. Un seuil retiré par l'un et maintenu par l'autre n'est pas
« désavoué » ; c'est un **point de désaccord entre deux consensus d'experts**, tous deux de niveau E.
Le rapport, qui n'a pas ouvert l'AACE et l'a classé « hypothèse plausible non démontrée » (§6-9),
présente le retrait ADA comme un abandon général. **Ce n'en est pas un.** C'est un argument
supplémentaire pour ne pas encoder le seuil en dur — mais pas pour la raison que le rapport donne : ce
n'est pas « la source a retiré son critère », c'est « les sources ne s'accordent pas », ce qui est
précisément le cas que le projet traite en **affichant la divergence**.

---

## 3. Findings HAUTE

### H1 — §3.4 et P3 : la « prémisse de sécurité démentie » repose sur une lecture SÉLECTIVE, et la source primaire dit l'inverse sur la comparaison pertinente

C'est le finding le plus lourd de cet audit.

Le rapport bâtit son §3.4 (« la prémisse de sécurité est démentie ») et sa proposition **P3** (retirer
« majore l'hypoglycémie » du texte affiché) sur deux jambes :

- Umpierrez 2019 : au-delà de 0,5 U/kg, prise de poids **sans** excès d'hypoglycémie ;
- « Analyse des 15 essais glargine citée par Davidson (n = 2 837) : hypoglycémie, y compris nocturne,
  **significativement plus basse** au-dessus de 0,5 U/kg (0,60 vs 0,85 év./patient-année) » — que le
  rapport classe explicitement en **seconde main, source non ouverte** (§6-7).

**L'article existe, il est identifiable, et il est en accès libre sur PMC** : Reid T, Gao L, Gill J,
et al. *How much is too much? Outcomes in patients using high-dose insulin glargine.* Int J Clin Pract
2016;70(1):56-65. **PMID 26566714 / PMC4738456.** Le rapport ne le nomme jamais ; Davidson le cite
pourtant en référence, dans un article que le rapport dit avoir lu.

Ouvert et lu ici, Reid 2016 contient **deux analyses différentes**, et le rapport n'en rapporte qu'une :

| Analyse | Résultat | Direction |
|---|---|---|
| **Inter-groupes** (≤0,5 vs >0,5 U/kg, n = 1 762 vs 1 075) | Hypo globale 4,70 vs **3,40** év./pt-an ; nocturne 0,85 vs **0,60** (p < 0,05) ; sévère 0,09 vs 0,07 (NS) | Hypo **plus BASSE** au-dessus du seuil |
| **Intra-patient, avant/après franchissement** | « **In patients who exceeded the dose cut-offs, the overall and nocturnal hypoglycaemia event rates prior to exceeding the dose cut-off were LOWER than AFTER exceeding the cut-off at all three cut-off levels.** » Et : « **once a patient had exceeded the dose cut-off, there was a higher likelihood of hypoglycaemia.** » | Hypo **plus HAUTE** après franchissement |

Les deux sont vraies : ce ne sont pas les mêmes comparaisons. La comparaison **inter-groupes** est
confondue exactement comme Davidson le dit lui-même par ailleurs (les patients à forte dose sont plus
insulinorésistants, donc structurellement moins hypoglycémiants). La comparaison **intra-patient** est
celle qui répond à la question clinique posée par le nœud : *« si je monte encore la basale de CE
patient au-delà de 0,5 U/kg, que se passe-t-il ? »* — et elle répond : **plus d'hypoglycémies, globales
et nocturnes, aux trois seuils.**

**Le rapport a lu Umpierrez 2019 sur PMC. Umpierrez y décrit Reid, noir sur blanc, dans sa Discussion :**

> « At week 24, participants with insulin titrated beyond the three thresholds had significantly higher
> mean HbA1c and FPG levels compared with participants at or below each threshold, with smaller changes
> in HbA1c from baseline. In addition, participants who exceeded the thresholds also had greater weight
> gain and **a higher likelihood of hypoglycaemia once the threshold was exceeded**. »

Le rapport a donc, dans un document qu'il a ouvert, la contradiction de sa propre thèse — et ne la
mentionne pas. C'est une **omission déterminante**, pas une divergence d'interprétation.

**Trois conséquences opposables :**

1. **L'affirmation du rapport « le motif affiché est factuellement faux » n'est pas établie.** Elle est
   au mieux « contestée », au pire fausse pour la comparaison qui compte.
2. **P3 doit être rejeté en l'état.** Supprimer « majore l'hypoglycémie » **introduirait une nouvelle
   erreur** dans le nœud, et contredirait trois sources que le rapport invoque par ailleurs : Reid 2016
   (intra-patient), l'ADA 2025/2026 (qui **maintient l'hypoglycémie** comme signal de sur-basalisation)
   et **Davidson lui-même**, dont la définition clinique est *« basal insulin doses that are increased
   even further after FPG targets have been achieved, leading to hypoglycemia with persistent
   postprandial hyperglycemia »* (PMC8603322), reprise en 2025 : la sur-titration au-delà de la cible
   « increases overnight hypoglycemia risk » (PMC11739333).
3. **Le contenu correct est plus nuancé que les deux versions en présence** : au-delà de ~0,5 U/kg on a
   (i) rendement décroissant, (ii) prise de poids (+1,8 kg), (iii) une **augmentation intra-patient** du
   taux d'hypoglycémie après franchissement, alors même que ces patients ont, en coupe, **moins**
   d'hypoglycémies que les patients à faible dose. Les trois sont soutenus par des données ; aucun n'est
   un essai de stratégie.

*(Note : OE avait raison sur ce point précis — « higher likelihood of hypoglycemia » — mais pour une
mauvaise raison : il le tire de la paraphrase d'Umpierrez, référencée [1], sans jamais citer Reid ni
distinguer les deux analyses. Sa conclusion se trouve juste ; son traçage ne l'est pas.)*

### H2 — Stewart-Lynch 2024 : chiffres FAUX (n et prévalence)

Le rapport écrit, deux fois (§6-8 et §8.1-2, où il en fait un argument POUR le maintien du gate) :
« prévalence **43,4 %** sur **398 dossiers** », statut « partiel (reCAPTCHA), données via résumés
concordants ».

**L'article est en accès libre sur PMC (PMC11060609). Lu ici, il dit :**

- **N = 105 dossiers** (« A total of 105 charts were included for review »), pas 398 ;
- **prévalence 16 %** (« Seventeen patients (16%) met the criteria for the OB category (basal insulin
  dose >0.5 units/kg/day) »), pas 43,4 % ;
- **ni « 398 » ni « 43,4 % » n'apparaissent nulle part dans l'article.**

Les chiffres du rapport ne proviennent donc pas de cette étude. C'est le type d'erreur (chiffre
plausible, non tracé, obtenu par « résumés concordants ») que ce dépôt a déjà rencontré en série. Effet
sur l'argumentaire : **l'argument §8.1-2 du rapport — « deux séries indépendantes (n = 655 et n = 398)
trouvent 38 % et 43 % » — s'effondre à moitié.** La vraie paire est 38,1 % (n = 655, définition
**composite** A1c > 8 % ET dose > 0,5) et 16 % (n = 105, définition **pondérale seule**).

*(À décharge : la donnée réelle de Stewart-Lynch contient un signal que le rapport n'a pas vu et qui va
CONTRE lui — **0 sur 17** des patients sur-basalisés atteignaient une HbA1c < 7 %, contre 25 % des non
sur-basalisés. Confondu par l'insulinorésistance comme tout le reste, mais c'est un fait qui manquait.)*

### H3 — La section §6 « ce qui n'a pas pu être vérifié » est majoritairement fausse

Le rapport se réclame d'une discipline de traçage explicite (« signaler plutôt qu'inventer », §« Discipline
appliquée »). Cette discipline a échoué sur sa mise en œuvre : **six des dix items déclarés
inaccessibles sont librement ouverts sur PubMed Central.** Résolution PMID→PMCID (API NCBI ID
Converter) :

| Item §6 du rapport | Statut déclaré | Statut réel |
|---|---|---|
| §6-2 Cowart & Carris 2022 (PMID 35221475) | « non ouvert, 403 HTML + PDF » | **PMC8865788, ouvert** |
| §6-3 Davidson 2025 (PMID 39829708) | « contenu inaccessible » | **PMC11739333, ouvert** |
| §6-4 *Summary of Revisions* 2025 (PMID 39651984) | « 403, phrase non lue » | **PMC11635056, ouvert** |
| §6-6 Zisman 2016 (PMID 27110368) | « reCAPTCHA, non lu » | **PMC4838666, ouvert** |
| §6-7 Analyse des 15 essais glargine | « non ouverte », jamais nommée | **Reid 2016, PMID 26566714, PMC4738456, ouvert** |
| §6-8 Stewart-Lynch 2024 (PMID 38694250) | « partiel, reCAPTCHA » | **PMC11060609, ouvert** |

Restent réellement fermés : **Cowart 2020** (Clin Diabetes 38(3):304-310 — 403, pas de PMC trouvé) et
**AACE 2023/2026** (Endocrine Practice, 403 sur les deux). Le réflexe manquant est trivial : quand
`diabetesjournals.org` renvoie 403, interroger l'ID Converter NCBI plutôt que conclure. Cette défaillance
n'est pas cosmétique : **c'est elle qui a produit H1 et H2.**

---

## 4. Findings MOYENNE

**M1 — Confusion recommandation / donnée, et « retiré » traité comme « réfuté ».** Le rapport distingue
correctement les deux au §3.1 et au §5, puis les fusionne dans sa conclusion (§8.2-1 : « ce n'est pas un
repère orphelin de preuve, c'est un repère **retiré** » ; §8.3 : « ici la preuve ne manque pas seulement,
elle a été **retirée** »). Un consensus d'experts qui en remplace un autre au même grade E ne
« retire » aucune preuve : il n'y en avait pas, et il n'y en a pas davantage après. Le vrai argument
disponible est plus modeste et suffit : *un critère de grade E, non validé, sur lequel deux sociétés
savantes divergent, n'a pas le rang requis pour retirer un geste au praticien.*

**M2 — Chronologie ADA fausse.** Le tableau §2.1 fait entrer le seuil dans l'ADA en « 2022 → 2024 », et
classe la période « avant 2019 » comme « le chiffre circule dans les algorithmes de pratique ». Or la
source primaire que le rapport a lue (Umpierrez 2019) écrit que le seuil est **cité dans les
recommandations ADA et AACE/ACE de 2018**, et l'article de *Diabetes Spectrum* 2019 le cite en
référençant les *Standards of Medical Care—2018*. Le seuil était donc dans l'ADA au moins **quatre ans
plus tôt** que ne le dit le rapport — ce qui, incidemment, rend le relais Médicalement Geek de 2020
parfaitement exact quant à sa source.

**M3 — L'attribution AACE était démontrable et a été classée « non démontrée ».** §6-9 : « l'attribution
du 0,5 U/kg à l'AACE pré-2019 reste une hypothèse plausible non démontrée ». La phrase d'Umpierrez citée
ci-dessus la démontre, dans l'article que le rapport a ouvert. Conséquence directe : le rapport ne pouvait
pas voir la divergence ADA/AACE, qui est le fait central du dossier.

**M4 — §3.2 « aucun essai n'a testé la stratégie » : trop absolu, et le contre-exemple joue contre le
rapport.** Le rapport ne retient que LixiLan-L, où la basale est plafonnée à 60 U **dans les deux bras**
(donc pas un test du plafond). Mais **DUAL V** (Lingvay et al., *JAMA* 2016;315(9):898-907, PMID
26934259) est précisément l'essai qui manque : IDegLira **plafonnée à 50 U** de degludec vs glargine
U100 **sans dose maximale**, chez des patients non contrôlés sous glargine 20-50 U + metformine.
Résultats : HbA1c −1,81 % vs −1,13 % (ETD −0,59 % [−0,74 ; −0,45]) ; poids −1,4 kg vs +1,8 kg (ETD
−3,20 kg) ; **hypoglycémie 2,23 vs 5,05 épisodes/patient-année (rate ratio 0,43 [0,30 ; 0,61])**.
Ce n'est pas un test du **seuil pondéral** (le plafond y est absolu, et le bras comparateur reçoit un
GLP-1 en plus, pas seulement un plafond) — mais c'est le test randomisé le plus proche de
« plafonner-et-intensifier vs continuer à titrer », et **il tranche contre la titration illimitée sur
les trois critères, hypoglycémie comprise**. Le rapport aurait dû le trouver ; OE l'avait.

**M5 — §5 « les trois marqueurs ADA sont déjà encodés » : inexact pour le premier.** Le marqueur n° 1 de
l'ADA 2025/2026 est le **différentiel coucher-réveil ≥ 50 mg/dL**, une mesure ponctuelle de deux
glycémies. Le nœud encode `profil_nocturne_a_cible` / `profil_nocturne_permet_titration`, dérivés de
cases cochées sur un profil AGP. C'est un **proxy voisin, pas le marqueur**, et le rapport le concède
lui-même en fin de §8.3 (« Option alternative… coût : un recueil supplémentaire »). L'affirmation
« le nœud a déjà la version 2026 de la définition ADA » est donc plus forte que les faits.

**M6 — La contestation de Davidson commence en 2019, pas en 2021.** Davidson MB, *Response to Umpierrez
et al.*, *Diabetes Obes Metab* 2019;21(10):2344-2345, **PMID 31210017**, DOI 10.1111/dom.13815 (existence
et métadonnées vérifiées sur PubMed ; pas de PMC). Le rapport recense « trois reprises (2021, 2022,
2025) » : il y en a **quatre**, dont la première dans la revue même où le post hoc a paru — ce qui
renforce son propre argument, mais montre que la recherche bibliographique n'a pas été exhaustive.
*(Réponse à la question 5 de la mission : oui, Davidson a bien publié une contestation répétée, et même
plus répétée que le rapport ne le dit ; 4 publications, dont 3 dans *Clin Diabetes* — PMID 34866782,
35983420, 39829708 — et 1 dans *Diabetes Obes Metab*.)*

---

## 5. Findings BASSE

- **B1 — ACCORD, intervalle de confiance recopié faux.** Rapport §3.3 : « pas d'insuline ORa 0,62
  (0,47-0,81) ». Source (PMC10115611) : **0,62 (0,46-0,83)**. Les deux autres OR sont exacts.
- **B2 — Zisman 2016, effectifs et périmètre inexacts.** Rapport : « n = 1 188 / **553** / 299 »,
  « post hoc poolé d'essais de phase 3 **glargine** ». Source (PMC4838666) : 1 188 / **492** / 299,
  post hoc de **six** essais de phase 3 de **glargine ou NPH**. Le seuil proposé par les auteurs est
  **45-55 mg/dL** (« BeAM values in the range between 45 and 55 mg/dL should trigger the consideration
  of additional intervention »), et non ≥ 50 mg/dL, qui est la valeur de l'ADA. Financement Sanofi US et
  deux auteurs salariés Sanofi : **confirmé**.
- **B3 — Reid 2016 n'est jamais nommé** dans le rapport, alors qu'il porte le chiffre le plus lourd du
  §3.4 et qu'il est cité en référence par Davidson (que le rapport dit avoir lu). Défaut de traçabilité.
- **B4 — Citation ADA 2023 très légèrement retouchée** : « post-preprandial » dans le rapport,
  « postpreprandial » dans la source ; dernière phrase tronquée sans marque d'ellipse. Sans conséquence.
- **B5 — Le rapport dit que Cowart & Carris 2022 n'est connu que par « un extrait de résumé
  éditorial »** ; l'article étant ouvert (PMC8865788), la formulation réelle est disponible et **plus
  favorable au rapport** qu'il ne l'a écrit : « a basal insulin dose of 0.5 units/kg/day can be best
  viewed as **a landmark highlighting a need to reassess insulin therapy overall, rather than as a
  "line in the sand"** », et « no prospective studies have investigated the maximum dose of basal
  insulin at which alternative drug therapy should be initiated ». Les promoteurs du seuil récusent
  eux-mêmes l'usage en couperet.

---

## 6. Ce qui est CONFIRMÉ

Sauf mention contraire, vérifié à la source primaire ouverte dans cet audit.

**Intégrité bibliographique — 13 PMID sur 13 exacts.** Titre, revue, année, volume, pagination
recoupés en masse via l'API NCBI ESummary pour : 30724009, 33986570, 34866782, 35983420, 39829708,
35221475, 37092152, 36148880, 37038616, 41358900, 39651984, 27110368, 38694250. **Aucun PMID faux, aucun
appariement erroné.** C'est une différence nette avec les passes précédentes du dépôt et avec OE (dont
la réponse ne fournit d'ailleurs aucun PMID sur ce sujet, uniquement des DOI).

**Question 1 de la mission — Umpierrez 2019 : entièrement confirmé.** Post hoc poolé de **trois** ECR
treat-to-target de glargine U100, **N = 458**, DT2 sous metformine ± sulfamide ; **financement Sanofi
US, Inc.**, trois auteurs sur cinq affiliés Sanofi ; seuil **non préspécifié** ; et la phrase que le
rapport paraphrasait, ici mot pour mot : « The 0.5-IU/kg/d basal insulin threshold dose cited in the ADA
and AACE/ACE 2018 guidelines appears to be mainly based on expert opinion rather than analysis of
clinical data. » Plus : « no prospective clinical studies to date have evaluated the maximum insulin
dose that should be used before intensifying beyond basal insulin treatment. »

**Question 2 (volet Umpierrez) — confirmé.** « An additional weight increase of **1.8 kg** was seen in
these participants when their dose was increased above 0.5 IU/kg/d » ; et « The incidence of
hypoglycaemia was broadly similar across insulin doses… **with no significant differences between
insulin doses ≤0.5 IU/kg/d compared with >0.5 IU/kg/d** ». *(Volet 15 essais : voir H1 — chiffres
exacts, lecture incomplète.)*

**Question 3 — Luo 2023 : confirmé, y compris la citation verbatim.** La phrase du rapport
(« There is no eligible evidence to investigate the optimal maintenance dose for basal insulins »)
figure **littéralement dans l'abstract** ; le corps la reformule (« There is no eligible RCT
investigating the optimal end point dose for any basal insulin to maintain satisfactory control of
FPG »). Aucune fabrication. Plages de doses d'entretien atteintes en fin d'ECR : glargine U300
**0,34-0,62**, degludec **0,28-0,59**, détémir **0,19-0,78**, NPH **0,19-0,66** U/kg/j — **exactement
les chiffres du rapport**. Le constat qui en découle tient : atteindre la cible au-delà de 0,5 U/kg est
courant dans les essais qui fondent la titration.

**Question 4 — post hoc ACCORD : confirmé sur tous les points, y compris les plus défavorables au
seuil.** ACCORD, N = 9 321 ; « Overbasalization was defined as a basal insulin dose >0.5 units/kg/day » ;
ΔHbA1c ajustée : sur-basalisé basale seule −0,67 % [−0,80 ; −0,55] **vs pas d'insuline −1,28 %
[−1,30 ; −1,25]** ; **critère composite CV primaire : aucune association significative** (« no
association was found between insulin use strategy and the composite outcomes of cardiovascular death,
nonfatal myocardial infarction, or nonfatal stroke ») ; critère macrovasculaire élargi exploratoire.
Section Limites lue intégralement : elle reconnaît le design post hoc, l'absence de randomisation sur
ce découpage et un « residual confounding » — **et ne traite effectivement PAS la confusion par
insulinorésistance / par indication**, comme le rapport l'affirme.

**Question 5 — contestation Davidson : confirmée** (et sous-estimée, cf. M6). Citation « self-fulfilling
prophecy » exacte. Variations absolues exactes (le rapport omet la strate intermédiaire −70,6 mg/dL /
−1,59 %, sans conséquence).

**Question 6 — attribution « SFD / Médicalement Geek » : inexacte, confirmé.**
- **Médicalement Geek / DragiWebdo n°280 (13/09/2020)** — page ouverte et lue. Phrase exacte : « L'ajout
  d'une post prandiale se fait quand on atteint **0,5UI/kg/j** », dans une section introduite par « les
  recommandations de la **société américaine de diabétologie 2020** ont été publiées ». **Aucune mention
  de la SFD dans le billet.** C'est bien un relais francophone de l'ADA.
- **SFD** — recherche négative confirmée. Le résumé de la prise de position SFD 2025 (Darmon et al.)
  donne l'initiation à **6-10 UI/j ou 0,1-0,2 UI/kg/j** et **aucun seuil de 0,5 UI/kg**, aucune notion de
  sur-basalisation. *(Le PDF long officiel de la SFD n'a pas pu être extrait en texte par l'outil — voir
  §7 ; la recherche reste donc négative, ce qui n'est pas une preuve d'absence, mais l'attribution
  « SFD » du dépôt n'est appuyée par aucune source produite à ce jour.)*
- **ADA/EASD 2022 (Davies et al., PMC10008140)** — texte intégral fouillé : ni « overbasalization », ni
  « over-basalization », ni « 0.5 units/kg », ni « 0.5 U/kg ». Seule dose pondérale citée : « Starting
  doses of basal insulin (NPH or analog) are estimated based on body weight (0.1–0.2 units/kg per day) ».
  **Confirmé : le consensus conjoint n'a jamais porté ce seuil.**

**Cowart 2021 (PMC8061546) : confirmé.** N = 655 ; définition **composite** verbatim : « uncontrolled
A1C (>8%) plus a basal insulin dose >0.5 units/kg/day » ; prévalence **38,1 %**.

---

## 7. Ce qui reste INVÉRIFIABLE (et ne doit pas être conclu)

1. **AACE 2023 (*Endocr Pract* 2023;29(5):305-340) et AACE 2026 (2026;32(4):473-518)** — **403** sur
   endocrinepractice.org pour les deux ; pas de version PMC ; la page AACE grand public ne contient
   aucun seuil. Le maintien du seuil dans ces deux éditions est **concordant sur sources secondaires,
   non lu à la source**. Ce qui EST établi à la source primaire, c'est l'AACE/ACE **2018** (via
   Umpierrez 2019).
2. **Cowart K, *Overbasalization: Addressing Hesitancy…*, Clin Diabetes 2020;38(3):304-310** — 403,
   aucun PMC. Article fondateur du terme, non lu ; on ne peut donc toujours pas dire sur quoi il
   s'appuyait pour le 0,5 en 2020.
3. **Reid 2016, texte intégral hors PMC** — la version PMC a suffi pour les résultats d'hypoglycémie,
   d'HbA1c, de GAJ, de poids et la conclusion. Le PDF Wiley renvoie **402 Payment Required** ; aucun
   contournement n'a été tenté (invariant 7).
4. **Prise de position SFD 2025, PDF officiel** — téléchargé (1,6 Mo) mais **flux PDF compressé non
   extractible** par l'outil de lecture. La recherche « SFD ne porte pas ce seuil » repose donc sur le
   résumé structuré de la prise de position 2025 et sur une recherche négative, pas sur une lecture
   intégrale du référentiel.
5. **Protocole LixiLan-L** (plafond 60 U dans les deux bras) — non ouvert à la source primaire, comme le
   rapport l'indiquait. Sans conséquence, DUAL V (M4) étant ouvert et plus pertinent.
6. **Références citées par l'ADA à l'appui de la rec 9.14/2023** — non élucidées ; la prudence du
   rapport (§6-5, ne rien affirmer) est justifiée et maintenue.

---

## 8. Le meilleur argument CONTRE la recommandation, construit à charge

Mandat explicite de la mission. Voici l'argumentaire le plus fort en faveur du **maintien de l'exclusion
dure**, tel qu'un opposant sérieux le poserait — puis pourquoi il échoue tout de même, et où il gagne.

**C1 — Le cas où le gate mord n'est pas celui que le rapport décrit.** Le rapport dit (§8.2-4) que
l'effet propre du gate est « un patient dont la physiologie dit que la basale est encore insuffisante,
et à qui on interdit de la monter ». Mais c'est précisément le profil de Reid : un patient qu'on
continue à titrer au-delà de 0,5 U/kg, et chez qui **le taux d'hypoglycémie observé après franchissement
est supérieur à son propre taux avant franchissement**, aux trois seuils. La « physiologie » invoquée
n'est pas neutre : elle est mesurée par une nuit hors cible, laquelle n'exclut pas que la dose
supplémentaire produise des hypoglycémies ailleurs dans le nycthémère.

**C2 — Le seul essai randomisé proche tranche contre la titration illimitée.** DUAL V (M4) : glargine
**sans plafond** perd contre une basale **plafonnée** + GLP-1 sur l'HbA1c (−1,13 % vs −1,81 %), sur le
poids (+1,8 vs −1,4 kg) et sur l'**hypoglycémie** (5,05 vs 2,23 év./pt-an, RR 0,43). Le rapport écrit
qu'« aucun essai n'a testé la stratégie » ; le plus proche existe, et il va dans le sens du gate.

**C3 — Le retrait ADA n'est pas un consensus international.** L'AACE maintient le seuil (§2). Retirer le
gate au motif que « la source de référence l'a retiré » suppose que l'ADA soit LA source ; le dépôt ne
l'a jamais posé.

**C4 — Le coût d'une exclusion à tort est borné, et il l'est plus qu'au moment où le rapport a été
écrit.** Depuis l'arbitrage référent du 2026-07-27, `over_basalisation == true` **ouvre** en
« basale seule » les deux gestes concrets « Ajouter un GLP-1 / association fixe » et « Ajouter un bolus »
(3ᵉ item des `conditions` des deux options). Le patient exclu de la titration ne reçoit plus de la prose :
il reçoit deux cartes actionnables, dont la première est celle que DUAL V soutient.

**C5 — P2 dégrade l'ergonomie plutôt qu'elle ne la répare.** Appliquer P1+P2 dans le cas litigieux fait
coexister sur le même écran **quatre** cartes, dont deux qui se contredisent frontalement (« Titrer la
basale, +2 U » et « Ne pas sur-titrer la basale »), plus les deux gestes d'intensification. C'est la
contradiction que l'arbitrage du 2026-07-26 avait justement voulu supprimer. Le levier `priorite`
proposé par le rapport ordonne l'affichage ; il ne supprime pas la contradiction, il la hiérarchise.

**Pourquoi cet argumentaire échoue quand même à sauver l'EXCLUSION DURE.** C1 et C2 établissent qu'il
est **raisonnable** de ne pas titrer davantage ; ils n'établissent pas qu'il soit **illégitime** de le
faire. Or une exclusion dure ne dit pas « c'est discutable », elle dit « ce geste n'est pas une option ».
Pour cela il faudrait au minimum : un seuil validé (il ne l'est pas), stable entre sociétés savantes
(il ne l'est pas), et testé comme règle de décision (aucun essai). DUAL V compare une **stratégie
complète** (plafond + GLP-1) à une monothérapie basale poussée — il soutient « proposer l'alternative
en premier », pas « interdire de titrer ». Et Reid intra-patient reste une analyse observationnelle
post hoc au sein d'essais, exposée à la confusion temps/dose (les patients qui franchissent le seuil
sont plus loin dans leur titration).

**Où l'argumentaire gagne : sur P3, entièrement, et sur la formulation de P1-P2.**

---

## 9. Synthèse opposable au référent

| Point | Verdict red-team |
|---|---|
| **Pivot : retrait ADA 2025, absence 2026** | **CONFIRMÉ**, source primaire, citation exacte, plus la phrase officielle du *Summary of Revisions* que le rapport croyait inaccessible |
| **P1 — retirer `over_basalisation` des `exclusions` de « Titrer la basale »** | **Suivable.** Un repère grade E, non validé, sur lequel ADA et AACE divergent, ne peut pas retirer un geste au praticien. Motivation à reformuler : « divergence entre consensus », pas « désavoué » |
| **P2 — le garder comme déclencheur de « Ne pas sur-titrer »** | **Suivable**, avec la réserve C5 : le référent doit accepter d'afficher jusqu'à 4 cartes dont 2 opposées. Le levier `priorite` est le bon outil |
| **P3 — retirer « majore l'hypoglycémie »** | **À REJETER en l'état (H1).** Introduirait une erreur. Reid 2016 intra-patient, l'ADA 2025/2026 et Davidson lui-même maintiennent l'hypoglycémie. Formulation défendable : rendement décroissant + prise de poids (+1,8 kg) + **risque d'hypoglycémie accru quand on titre au-delà de la cible** — en signalant que les comparaisons inter-groupes montrent l'inverse (confusion par insulinorésistance) |
| **P4 — corriger l'attribution (« SFD / Médicalement Geek »)** | **Suivable, confirmé sur les deux termes.** La formulation proposée par le rapport doit toutefois être corrigée : le seuil était dans l'ADA **dès 2018** (pas « 2022-2024 »), et il est **maintenu par l'AACE** — ne pas écrire « retiré » sans dire « par l'ADA » |
| **Variante « exclusion conditionnée au pivot nocturne »** | Reste, comme le rapport le dit, quasi redondante avec le pivot existant. Sans intérêt |
| **Chiffres à ne pas reprendre du rapport** | Stewart-Lynch (n = 398 / 43,4 % → **n = 105 / 16 %**), OR ACCORD « pas d'insuline » (0,47-0,81 → **0,46-0,83**), Zisman (553 → **492** ; glargine → **glargine ou NPH**, 6 essais) |

**Une phrase pour le référent** : le rapport a raison sur le fait central et sur trois de ses quatre
propositions, mais il a construit sa proposition la plus visible pour l'utilisateur (P3) sur la moitié
d'une source qu'il n'a pas ouverte — et cette source, ouverte ici, dit le contraire sur la comparaison
qui compte.

---

## 10. Sources (URL)

**Ouvertes et lues dans cet audit**

| # | Référence | URL |
|---|---|---|
| 1 | ADA Prof. Practice Committee. *9. Pharmacologic Approaches… Standards of Care in Diabetes—2023.* Diabetes Care 2023;46(Suppl 1):S140-S157. **Rec 9.14 grade E, seuil présent** | https://pmc.ncbi.nlm.nih.gov/articles/PMC9810476/ |
| 2 | Idem **—2025.** Diabetes Care 2025;48(Suppl 1):S181-… **Rec 9.27 grade E, seuil absent (recommandation ET prose)** | https://pmc.ncbi.nlm.nih.gov/articles/PMC11635045/ |
| 3 | Idem **—2026.** Diabetes Care 2026;49(Suppl 1):S183-S215. PMID 41358900. **Rec 9.26 grade E, seuil absent ; BeAM ≥ 50 mg/dL** | https://pmc.ncbi.nlm.nih.gov/articles/PMC12690185/ |
| 4 | ADA. ***Summary of Revisions: Standards of Care in Diabetes—2025.*** Diabetes Care 2025;48(Suppl 1):S6-S13. PMID 39651984. **Phrase officielle du retrait** | https://pmc.ncbi.nlm.nih.gov/articles/PMC11635056/ |
| 5 | Umpierrez GE, et al. *When basal insulin is not enough…* Diabetes Obes Metab 2019;21(6):1305-1310. PMID 30724009. **N=458, Sanofi US, seuil non préspécifié ; décrit Reid** | https://pmc.ncbi.nlm.nih.gov/articles/PMC6594069/ |
| 6 | **Reid T, Gao L, Gill J, et al. *How much is too much? Outcomes in patients using high-dose insulin glargine.* Int J Clin Pract 2016;70(1):56-65. PMID 26566714. Les 15 essais, n=2 837 — les DEUX analyses** | https://pmc.ncbi.nlm.nih.gov/articles/PMC4738456/ |
| 7 | Davidson MB. *The Clinical Definition of Overbasalization.* Clin Diabetes 2021;39(4):411-414. PMID 34866782 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8603322/ |
| 8 | Davidson MB. *Definition of Overbasalization.* Clin Diabetes 2025;43(1):123-124. PMID 39829708 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11739333/ |
| 9 | Cowart K, Carris NW. *Practicable Measurement and Identification of Overbasalization.* Clin Diabetes 2022;40(1):75-77. PMID 35221475. **« landmark… rather than a "line in the sand" »** | https://pmc.ncbi.nlm.nih.gov/articles/PMC8865788/ |
| 10 | Cowart K, et al. *Impact of Overbasalization on Clinical Outcomes… Post Hoc Analysis of ACCORD.* Clin Diabetes 2023;41(2):147-153. PMID 37092152 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10115611/ |
| 11 | Cowart K, Updike WH, Pathak R. Clin Diabetes 2021;39(2):173-175. PMID 33986570. **n=655, 38,1 %, définition composite** | https://pmc.ncbi.nlm.nih.gov/articles/PMC8061546/ |
| 12 | **Stewart-Lynch A, et al.** Clin Diabetes 2024;42(2):266-273. PMID 38694250. **n=105, 16 % — contredit le rapport** | https://pmc.ncbi.nlm.nih.gov/articles/PMC11060609/ |
| 13 | Luo Y, et al. J Diabetes 2023;15(5):419-435. PMID 37038616. **« no eligible evidence » (abstract) ; plages de doses** | https://pmc.ncbi.nlm.nih.gov/articles/PMC10172019/ |
| 14 | Davies MJ, et al. *ADA/EASD Consensus Report 2022.* Diabetes Care 2022;45(11):2753-2786. PMID 36148880. **Seuil absent** | https://pmc.ncbi.nlm.nih.gov/articles/PMC10008140/ |
| 15 | Zisman A, et al. *BeAM value…* BMJ Open Diabetes Res Care 2016;4:e000171. PMID 27110368. **6 essais, 1188/492/299, Sanofi, seuil 45-55 mg/dL** | https://pmc.ncbi.nlm.nih.gov/articles/PMC4838666/ |
| 16 | Chun J, Strong J, Urquhart S. *Insulin Initiation and Titration in Patients With Type 2 Diabetes.* Diabetes Spectr 2019;32(2):104-111. **Cite le seuil en référençant les ADA Standards 2018** | https://pmc.ncbi.nlm.nih.gov/articles/PMC6528396/ |
| 17 | Lingvay I, et al. **DUAL V**, JAMA 2016;315(9):898-907. PMID 26934259. **Glargine sans plafond vs IDegLira plafonnée 50 U** | https://pubmed.ncbi.nlm.nih.gov/26934259/ |
| 18 | Davidson MB. *Response to Umpierrez et al.* Diabetes Obes Metab 2019;21(10):2344-2345. **PMID 31210017** (métadonnées ; pas de PMC) | https://pubmed.ncbi.nlm.nih.gov/31210017/ |
| 19 | Médicalement Geek — DragiWebdo n°280, 13/09/2020. **Relais explicite ADA 2020 ; aucune mention SFD** | https://www.medicalement-geek.com/2020/09/dragi-webdo-n280.html |
| 20 | Prise de position SFD 2025 (Darmon P, et al.), résumé structuré. **Initiation 6-10 UI/j ou 0,1-0,2 UI/kg/j ; aucun seuil de 0,5** | https://pro.campus.sanofi/fr/diabete-de-type-2/articles/prise-de-position-sfd-2025 |
| 21 | NCBI ESummary (contrôle de masse des 13 PMID) / ID Converter (résolution PMCID) | https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi · https://pmc.ncbi.nlm.nih.gov/tools/idconv/ |

**Non ouvertes (statut explicite)**

| # | Référence | Statut |
|---|---|---|
| 22 | AACE. *Comprehensive T2D Management Algorithm — 2023 Update.* Endocr Pract 2023;29(5):305-340 | **403**, pas de PMC — maintien du seuil concordant sur sources secondaires, **non lu** |
| 23 | AACE. *Algorithm for Management of Adults With T2D — 2026 Update.* Endocr Pract 2026;32(4):473-518 | **403**, pas de PMC — idem |
| 24 | Cowart K. *Overbasalization: Addressing Hesitancy…* Clin Diabetes 2020;38(3):304-310 | **403**, pas de PMC — **non lu** |
| 25 | SFD, prise de position DT2 version longue (PDF) | Téléchargé, **flux PDF non extractible** par l'outil |
| 26 | Reid 2016, PDF éditeur Wiley | **402 Payment Required** — aucun contournement tenté (invariant 7) ; version PMC suffisante |
