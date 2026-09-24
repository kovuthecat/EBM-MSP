# Contradiction — négative OpenEvidence sur la titration de basale pilotée par MCG (DT2, nœud `insuline`)

## Provenance
- Agent : contradicteur-preuve (B) — consignes : `.claude/agents/contradicteur-preuve.md`, dernier commit : sans objet, dépôt non versionné (pas de git dans cet export).
- Modèle : sonnet (en-tête de l'agent)
- Date : 2026-09-24
- Mode : Décision — **circuit allégé** : pas de rapport Agent A ni de registre d'affirmations préexistants pour ce chantier ; ce rapport contredit directement le retour OpenEvidence du 2026-08-11 comme s'il était la « collecte » à mettre à l'épreuve.
- Outils disponibles : `WebSearch`, `WebFetch`, `Read`, `Grep`, `Glob`, `Write` (natifs) ; **absents** : `Bash`/`node` — `identite.mjs` et `verifier-registre.mjs` n'ont pas pu être invoqués dans cette session (aucun outil Bash exposé), substitués par les voies ouvertes manuelles d'`acces-identite.md` § 5 (PubMed E-utilities `efetch`, Crossref API, Unpaywall API, ClinicalTrials.gov API v2) ; des instructions système mentionnent des serveurs MCP « Clinical Trials », « Consensus », « Vercel », « Claude Docs », mais **aucun outil correspondant n'apparaît dans la liste des fonctions réellement exposées à cet agent** — donc non appelés, conformément à `acces-identite.md` § 1 (« un outil absent n'est jamais appelé »).
- Accès obtenus : PubMed E-utilities (`efetch`, abstract) — voie API, résumé accessible, pour PMID 38363342 (Jancev), 42035781 (FreeDM2/Wilmot), 40683222 (Martens nadir 1 h AM), 41651803 (El Fathi) ; Crossref API — identité confirmée pour DOI 10.2337/dc24-2222 (DIATEC) et 10.1177/15209156261420193 (El Fathi) ; ClinicalTrials.gov API v2 — fiche de registre lue (texte du registre, `armsInterventionsModule`/`descriptionModule`) pour NCT06111508 et NCT07681375 ; WebSearch — synthèses secondaires (protocoles publics, communiqués, résumés de revues) pour DIATEC, FreeDM2, Steno2tech, MOBILE, Oser 2026.
- Accès bloqués : texte intégral de l'article El Fathi et al. 2026 (*Diabetes Technology & Therapeutics*, DOI 10.1177/15209156261420193) — `paywall constaté sur cette voie` (page éditeur SAGE, HTTP 403) ; Unpaywall interrogé sur ce DOI — `oa_status: closed`, aucune copie ouverte connue (ne ferme pas les autres voies, mais aucune n'a abouti) ; PubMed plein texte — `échec technique` (mur de cookies constaté sur `pubmed.ncbi.nlm.nih.gov`, jamais un paywall constaté) ; page ClinicalTrials.gov rendue en HTML (non-API) — `échec technique` (contenu générique non rendu, JS côté client) ; SAGE Journals (methods complets) — `paywall constaté sur cette voie`. **Conséquence** : la définition exacte de la métrique « titration glucose level » de l'algorithme El Fathi (moyenne ? percentile ? proche TIR/TAR ?) reste `accès restant à vérifier` — voir F1 et le verdict Q1.
- Rapport d'A et retour OE ouverts : le retour OE (`OE-titration-mcg-brut-2026-08-11.txt`) a été ouvert **après** la rédaction complète de la section « Attendus » ci-dessous et après une première vague de recherche indépendante (point de contrôle) ; aucun rapport Agent A n'existe pour ce chantier. **Réserve méthodologique à noter honnêtement** : la mission transmise à cet agent (avant écriture des Attendus) contenait déjà le résumé de la conclusion négative d'OE sur Q1/Q2 et le nom des quatre essais qu'OE écarte (MOBILE, FreeDM2, Jancev, DIATEC) — cette information ne provient pas du fichier de retour OE brut lui-même (non ouvert avant les Attendus), mais de la consigne de lancement. Les Attendus ci-dessous ne sont donc pas complètement « aveugles » à la conclusion d'OE ; ils le sont au contenu détaillé (citations, chiffres, PMID/DOI) du retour brut.

---

## 1. Attendus (rédigés avant ouverture du retour OE brut)

*Fondés sur le prompt OE (périmètre, Q1-Q6) et la connaissance générale du domaine (littérature MCG/DT2), sans lecture du fichier de retour OE brut.*

**Q1 (décisive).** Un ECR ambulatoire comparant strictement deux **algorithmes de titration** (l'un piloté par métriques MCG — TIR/TAR/tendance AGP —, l'autre par glycémie capillaire à jeun), chez le DT2 sous basale, est **peu probable** dans la littérature à cette date : la plupart des grands essais MCG en DT2 basal (type MOBILE) comparent la **modalité de monitorage** (capteur vs autosurveillance), avec le **même** algorithme de titration fondé sur la glycémie (à jeun ou pré-prandiale) dans les deux bras — le capteur ne fait alors que remplacer la source de la valeur glycémique, sans faire intervenir de métrique composite (TIR/TAR/tendance) comme déclencheur chiffré. Réserve attendue : il faut vérifier le protocole exact de chaque essai cité (Méthodes, pas l'abstract) avant d'accepter une caractérisation « pas de pilotage par métriques ». Critères de jugement attendus : HbA1c et TIR (substitution), hypoglycémies (sécurité) ; horizon 3 à 8 mois ; échantillons modestes (centaines de patients) ; risque de biais lié au design ouvert mais critère de jugement objectif (labo, capteur). Si la négative tient, elle doit être assortie de cette réserve de vérification protocole par protocole, pas d'une affirmation brute.

**Q2 (décisive).** Il est plausible que des **propositions d'algorithme** MCG-piloté existent (position d'experts, petites études pilotes/faisabilité), mais je m'attends à ce qu'**aucune évaluation prospective solide** en ambulatoire DT2 pur (basal seul, hors DT1/pompe/boucle fermée) ne soit disponible à grande échelle. Point de vigilance : des algorithmes conçus pour la boucle fermée ou le DT1 pourraient être cités par erreur ou par extrapolation — à signaler comme non transposables si c'est le cas. Une petite étude pilote monocentrique (n < 50), même sans comparateur solide, resterait une réponse valide à Q2 si elle donne des valeurs chiffrées actionnables (déclencheur, pas de dose, rythme) — la barre de Q2 est plus basse que celle de Q1.

**Q3.** Je m'attends à ce que **MOBILE** utilise un algorithme de titration standard fondé sur la glycémie à jeun, appliqué de façon identique dans les deux bras (seule la source — capteur ou glucomètre — diffère), donc pas un pilotage par métriques. **FreeDM2** et **DIATEC** me sont moins familiers à ce niveau de détail (FreeDM2 pourrait être un essai très récent, à la limite de ma connaissance) — je m'attends à devoir les vérifier entièrement par recherche indépendante. Pour la méta-analyse **Jancev**, j'attends une hétérogénéité forte des protocoles de titration entre les 12 essais inclus, et une méta-analyse qui porte sur la modalité de monitorage plutôt que sur un algorithme de titration unique.

**Q4.** Je m'attends à ce qu'il n'existe **aucun seuil MCG validé comme déclencheur chiffré de majoration de dose** (distinct des cibles d'interprétation ATTD/Battelino 2019, TIR > 70 %, etc.) — les algorithmes de titration publiés et validés restent, à ma connaissance, fondés sur la glycémie à jeun ou une valeur ponctuelle.

**Q5.** Je m'attends à des données **qualitatives et de faible niveau de preuve** (avis d'experts, séries descriptives) sur la lecture du profil nocturne AGP comme signal de sur-basalisation, sans étude comparative quantifiée en ambulatoire DT2 isolant cet usage de la titration de basale elle-même (plutôt orienté vers la décision d'intensifier vers le bolus que vers la dose de basale).

**Q6.** Je m'attends à ce que les recommandations internationales post-2019 (ADA, EASD, ATTD, Endocrine Society, NICE) ne définissent que des **cibles d'interprétation** MCG (TIR/TAR/TBR/GMI), sans algorithme de titration de basale chiffré piloté par ces métriques — cohérent avec ce que le nœud `insuline` affiche déjà (« MCG = 2 axes : contrôle vs sécurité », `docs/decision/00-global.md`, ligne du nœud E).

*Aucune correction n'a été nécessaire sur ces Attendus après lecture — voir en revanche les findings F1/F2 ci-dessous, qui infirment l'attendu implicite selon lequel « la négative de Q1/Q2 tiendra probablement », sur la base de données trouvées après leur rédaction.*

---

## 2. Point de contrôle — recherche indépendante sur Q1/Q2

### 2.1 Un essai omis, potentiellement décisif : El Fathi et al. 2026 (NCT06111508)

**« Safety and Feasibility of Algorithmic Continuous Glucose Monitoring-Based Titration in People with Type 2 Diabetes Using Insulin Degludec, With or Without Noninsulin Glucose-Lowering Drugs: A 16-Week Randomized Controlled Trial »**, El Fathi A, Nass R, Levy CJ, et al., *Diabetes Technology & Therapeutics*, publié en ligne le 6 février 2026. PMID 41651803 ; DOI 10.1177/15209156261420193 (identité confirmée via Crossref API — container-title « Diabetes Technology & Therapeutics », éditeur SAGE Publications, date 2026-02-06 — et via PubMed `efetch`, titre/auteurs/revue concordants). Essai enregistré NCT06111508, « An Exploratory 16-Week Pilot Study of the Effect and Safety of a Novel CGM-Based Titration Algorithm for Basal Insulin », statut « Completed », novembre 2023 – septembre 2024 (fiche ClinicalTrials.gov API v2, lue directement — `texte intégral accessible` pour la fiche de registre elle-même).

Caractéristiques établies via le registre (voie ouverte, `acces-identite.md` § 5) :
- **Design** : ECR à deux sites, 30 participants randomisés (28 compléteurs), bras expérimental n=20 / bras contrôle n=10.
- **Population** : adultes ≥ 18 ans, DT2 ≥ 180 jours, HbA1c 7-9 %, **insuline basale seule** depuis ≥ 90 jours (pas de pompe, pas d'insuline rapide — exclusion explicite), traitement médicamenteux stable. Correspond exactement au périmètre du prompt OE (ambulatoire, basal seul, hors DT1/pompe/boucle fermée).
- **Bras expérimental** : « algorithme de titration basé sur la MCG », plateforme DiAs-Cloud, **trois composantes déclarées** : *titration glucose level*, *personalized target*, *safety hypoglycemia feature* — recommandation hebdomadaire calculée sur les deux semaines précédentes de données MCG (texte du registre, `descriptionModule`/`armsInterventionsModule`, lu verbatim via l'API).
- **Bras comparateur** : titration standard par autosurveillance glycémique (SMBG), révision hebdomadaire par le médecin, capteur MCG masqué porté en aveugle — comparateur strictement conforme à celui demandé par Q1 (« glycémie capillaire à jeun »).
- **Critère de jugement principal** : variation du temps dans la cible (TIR 70-180 mg/dL) entre l'inclusion et les semaines 14-16, testée pour la **non-infériorité** (seuil -5 points de %) — critère de substitution.
- **Résultat** : TIR +20,3 ± 18,1 points de % (bras algorithme) vs +8,3 ± 20,0 points de % (bras SMBG), p = 0,001 ; différence de traitement estimée +14,6 points de % (résumé ADA 310-OR). Hypoglycémies rares dans les deux bras (< 70 mg/dL : 0,34 % vs 0,00 % en médiane), aucune hypoglycémie sévère, aucun événement indésirable grave.

**Ce que je n'ai pas pu vérifier** : la définition mathématique exacte du « titration glucose level » (moyenne pondérée sur deux semaines ? proche d'un TIR/TAR seuillé ? ou valeur unique proche d'un substitut de glycémie à jeun, comme le « nadir 1 h AM » de Martens et al. 2025 qu'OE écarte à juste titre en Q1/Q2) — accès au texte intégral **bloqué sur toutes les voies essayées** (page éditeur SAGE : HTTP 403 ; Unpaywall : `closed`, aucune copie ouverte connue ; PubMed plein texte : mur de cookies, `échec technique`). Le registre confirme seulement que la décision de dose s'appuie sur trois composantes distinctes (dont une cible personnalisée et une garde-fou hypoglycémie), et non sur une simple lecture ponctuelle de glycémie — ce qui le distingue structurellement de MOBILE/FreeDM2 (où la source de la mesure change, mais pas l'algorithme de décision).

**Effet sur la conclusion.** Que le « titration glucose level » soit ou non une métrique composite au sens strict de TIR/TAR/tendance AGP, ce point ne change pas le constat central : **un ECR ambulatoire existe**, comparant explicitement un *algorithme de titration piloté par capteur* à un *algorithme de titration piloté par autosurveillance capillaire*, chez le DT2 sous basale seule — ce que Q1 cherche mot pour mot, et ce que les essais qu'OE cite (MOBILE, FreeDM2, Steno2tech) ne font pas (ils comparent une modalité de monitorage, algorithme de décision identique des deux côtés). Cet essai était publié six mois avant la date de la requête OE (2026-08-11) et indexé sur PubMed. **Il n'apparaît nulle part dans le retour OE — ni dans les six réponses, ni dans la liste de 23 références.**

### 2.2 Un second algorithme MCG-piloté publié et évalué prospectivement, omis pour Q2

**« Continuous Glucose Monitoring-Informed Basal Insulin Optimization System in Adults with Type 2 Diabetes: Initial Evaluation of Efficacy, Safety, and Impact on Patient-Reported Outcomes »**, Oser SM, Crystal C, Hames KC, et al., *Diabetes Therapy*, publié en ligne le **10 août 2026** (veille de la requête OE). PMID 42573729 ; DOI 10.1007/s13300-026-01901-4 (identité établie via PubMed `efetch`, résumé lu).

- **Design** : étude prospective monocentrique, **sans groupe témoin** (n=14 adultes DT2, 3 en instauration de basale, 11 en optimisation) — répond au format « algorithme publié et évalué prospectivement » explicitement prévu par Q2, y compris pour un algorithme sans comparateur.
- **Intervention** : système « Basal Therapy Optimization » (BTO), prototype Dexcom Smart Basal — trois phases (10 j baseline, jusqu'à 35 j de titration active, 20 j de suivi).
- **Critères de jugement et résultats chiffrés (résumé PubMed lu)** : glycémie moyenne −26,3 mg/dL (médiane, IQR ; p = 0,0031), TIR 70-180 mg/dL +16,0 points de % (p = 0,0017), 96,5 % des recommandations de dose acceptées par les prescripteurs, aucun événement indésirable grave, satisfaction améliorée (questionnaire DTSQ).

**Effet sur la conclusion.** Publié la veille de la date de la requête OE — un délai d'indexation explique en partie l'absence, et je le note avec cette réserve de sévérité atténuée (voir décompte). Il reste que la réponse d'OE à Q2 (« aucun ECR ambulatoire prospectif… les éléments les plus proches sont une analyse rétrospective et un essai hospitalier ») était déjà **fausse indépendamment de cet article**, à cause de 2.1.

### 2.3 Essai enregistré, non encore publié : NCT07681375 (omission mineure)

« Evaluation of Basal Insulin Initialization and Titration in People With Type 2 Diabetes Wearing a Dexcom G6 Sensor » (système « DexBasal »), enregistré le 2 juillet 2026, statut « Active, not recruiting » (fiche ClinicalTrials.gov API v2, lue directement). Étude à un bras (pas de comparateur), critères de jugement = sécurité, génération de recommandations de dose, taux d'approbation médicale des recommandations. Aucun résultat déposé à ce jour. Registré avant la date de la requête OE, mais sans résultat publié — je le classe en omission mineure : un « aucun ECR trouvé, mais un essai est en cours (NCT07681375) » aurait été la formulation attendue par la passe d'omission, et ne figure pas dans le retour OE.

### 2.4 Vérification des quatre essais cités comme non pertinents

| Essai | Caractérisation d'OE | Ma vérification indépendante | Verdict |
|---|---|---|---|
| **MOBILE** (Martens, PMID 34077499, JAMA 2021) | Titration à la discrétion du clinicien de soins primaires, pas d'algorithme sur métriques MCG ; TIR +15 % (IC95 % 8-23), HbA1c −0,4 % (IC95 % −0,8 à −0,1) à 8 mois | Chiffres HbA1c corroborés par une synthèse indépendante (Healio/JAMA) : « adjusted difference of 0.4 percentage points (95% CI, 0.8 to 0.1) » — concordant en valeur absolue. **Je n'ai pas pu ouvrir le texte intégral JAMA** (accès non tenté avec succès dans le temps imparti) pour vérifier verbatim la phrase sur la discrétion clinique — reste **non vérifié en primaire**, corroboré par un relais indépendant. |
| **FreeDM2** (Wilmot, PMID 42035781, Lancet Diabetes Endocrinol 2026) | Auto-titration identique dans les deux bras (seule la source de mesure diffère), pas de différence de dose d'insuline entre groupes | **Confirmé indépendamment** : le protocole d'essai publié (Cambridge repository / PMID 40233956) décrit « the two arms use identical insulin titration algorithms… the primary difference being whether they use CGM… or SMBG ». Concordant avec OE, via une source différente de celle qu'OE cite. |
| **Méta-analyse Jancev** (PMID 38363342, Diabetologia 2024) | HbA1c −0,31 % (IC95 % −0,43 à −0,19), TIR +6,36 % (IC95 % 2,48-10,24), TAR −5,86 %, TBR −0,66 % | **Confirmé sur le résumé PubMed** lu directement : HbA1c −3,43 mmol/mol (IC95 % −4,75 à −2,11 mmol/mol). Conversion mmol/mol → % (÷10,929, conforme à la conversion IFCC/NGSP) : −4,75/10,929 ≈ −0,43 % ; −2,11/10,929 ≈ −0,19 %. **Concordance exacte** avec les bornes % citées par OE — l'écart apparent (mmol/mol vs %) n'est pas une erreur d'OE mais une unité différente correctement convertie. TIR/TAR/TBR : chiffres identiques au résumé (+6,36 % [2,48-10,24], −5,86 %, −0,66 %). |
| **DIATEC** (Olsen, PMID 39887698, Diabetes Care 2025) | Essai hospitalier, algorithmes de titration identiques dans les deux bras (cible et pas de dose), seule la source de mesure diffère | **Confirmé** : Crossref (DOI 10.2337/dc24-2222) et le protocole publié (BMC Endocrine Disorders, PMC11071255/PMC11977621) désignent bien une population « non-critically ill hospitalised » — hospitalisation, hors périmètre ambulatoire du prompt. Cohérent avec la caractérisation d'OE. Je n'ai pas pu confirmer verbatim la phrase « cibles et pas de dose identiques dans les deux bras » sur le texte intégral (non ouvert) — reste `non vérifié en primaire` sur ce point précis, mais rien ne le contredit. |

### 2.5 Steno2tech — essai mentionné par OE sans référence numérotée

OE cite « Steno2tech » en Q1 aux côtés de MOBILE et FreeDM2, sans PMID/DOI ni numéro de référence associé — alors que la consigne 4 du prompt exige une source précise pour toute donnée avancée. Vérification indépendante : essai réel (Comparing Continuous Glucose Monitoring and Blood Glucose Monitoring in Adults With Inadequately Controlled, Insulin-Treated Type 2 Diabetes, PMID 38489032, NCT04331444, *Diabetes Care* 2024;47(5):881), 77 % des participants sous basale seule, essai de modalité de monitorage (CGM vs SMBG) à 12 mois — la caractérisation implicite d'OE (essai de modalité, pas d'algorithme de titration comparé) est plausible et cohérente avec le design réel, mais **OE ne fournit pas les moyens de la vérifier** (pas de PMID/DOI ni de numéro dans la liste de références).

---

## 3. Cherché, non trouvé par OE

| Voie | Requête ou source, date | Trouvé | Chez OE ? | Effet sur la conclusion |
|---|---|---|---|---|
| WebSearch + PubMed `efetch` + Crossref + ClinicalTrials.gov API | « CGM-based titration algorithm type 2 diabetes RCT basal insulin degludec », 2026-09-24 | El Fathi et al. 2026 (PMID 41651803, NCT06111508) | Non — absent des 6 réponses et des 23 références | **Renverse ou affaiblit fortement Q1 et Q2** (F1, HAUTE) |
| WebSearch + PubMed `efetch` | « CGM-informed basal insulin optimization system type 2 diabetes », 2026-09-24 | Oser et al. 2026 (PMID 42573729, Diabetes Ther, BTO/Dexcom Smart Basal) | Non | Affaiblit Q2 (F2, MOYENNE — publié la veille de la requête, délai d'indexation plausible) |
| ClinicalTrials.gov API v2 | Recherche registre « type 2 diabetes basal insulin CGM titration algorithm », 2026-09-24 | NCT07681375 (DexBasal Study System), actif non recrutant, sans résultat déposé | Non | Omission mineure Q2 (F3, BASSE — aucun résultat à ce jour, mais un essai en cours aurait dû être signalé) |
| WebSearch | « Steno2tech trial CGM basal insulin type 2 diabetes », 2026-09-24 | PMID 38489032, NCT04331444 — essai réel, correctement catégorisable comme essai de modalité | Mentionné par OE sans PMID/DOI/n° de référence | Sourcing incomplet côté OE, pas une erreur de fond (F4, BASSE) |
| PubMed `efetch` (résultat de sens contraire, essai plus récent citant les essais clés) | recherche de suivi/réanalyse de MOBILE et FreeDM2 postérieurs, budget limité, 2026-09-24 | Rien de plus trouvé dans le temps imparti au-delà des éléments ci-dessus | — | Recherche non exhaustive : à rejouer si le nœud est révisé — limite de couverture explicitement notée, pas une preuve d'absence supplémentaire |

---

## 4. Findings

**F1 — HAUTE — origine : omission (recherche indépendante, non guidée par un rapport A puisqu'il n'y en a pas).**
Le retour OE conclut « Aucun ECR ambulatoire trouvé pour Q1 » et, pour Q2, ne retient comme « éléments les plus proches » qu'une analyse rétrospective (Martens 2025, PMID 40683222) et un essai hospitalier (DIATEC). Un ECR ambulatoire existe, publié six mois avant la requête OE, comparant explicitement un algorithme de titration piloté par capteur à un algorithme piloté par autosurveillance capillaire, chez le DT2 sous basale seule (El Fathi et al. 2026, PMID 41651803, DOI 10.1177/15209156261420193, NCT06111508). Passage source et localisation : fiche de registre ClinicalTrials.gov NCT06111508 (`descriptionModule`, `armsInterventionsModule`, lue via l'API v2) ; identité confirmée par Crossref (container-title, éditeur, date) et PubMed `efetch` (titre, auteurs, revue). **Réserve non levée** : le texte intégral (méthodes précises de calcul du « titration glucose level ») n'a pas pu être ouvert (paywall SAGE, Unpaywall `closed`, PubMed plein texte en échec technique) — donc `non vérifié` au sens strict de la colonne Vérification, pas `vérifiée`, mais suffisant pour invalider l'affirmation catégorique « aucun ECR trouvé ».

**F2 — MOYENNE — origine : omission.**
Un second algorithme MCG-piloté, publié et évalué prospectivement en ambulatoire chez le DT2 (basal seul et en optimisation), avec valeurs chiffrées actionnables (recommandations hebdomadaires, taux d'acceptation 96,5 %), existe et répond directement à Q2 (Oser et al. 2026, PMID 42573729, DOI 10.1007/s13300-026-01901-4). Sévérité atténuée par rapport à F1 : publié la veille de la date de la requête OE (2026-08-10 vs requête du 2026-08-11), un délai d'indexation est une explication plausible et non fautive.

**F3 — BASSE — origine : omission.**
Un essai enregistré et actif (NCT07681375, « DexBasal Study System »), dans le périmètre exact de Q2 (ambulatoire, DT2, basal seul), n'est pas mentionné alors que la consigne 1 du prompt demande d'écrire explicitement « aucun ECR trouvé » plutôt que de rester silencieux — une mention « essai en cours, résultats non disponibles » aurait été la sortie attendue.

**F4 — BASSE — origine : OE seule (défaut de sourcing, pas d'erreur de fond).**
« Steno2tech » est cité en Q1 sans PMID/DOI ni numéro de référence, en violation de la consigne 4 du prompt (« pour tout chiffre avancé, donne la source précise… un chiffre que tu ne peux pas rattacher à une source précise doit être signalé comme tel »). Vérification indépendante : l'essai est réel et la caractérisation implicite d'OE est plausible, mais rien dans le retour OE ne permettait de le vérifier sans recherche externe.

---

## 5. Confirmations obtenues

- **C1** — Les quatre chiffres de la méta-analyse Jancev (HbA1c, TIR, TAR, TBR) cités par OE en Q3 sont exacts, vérifiés sur le résumé PubMed (PMID 38363342) lu directement : HbA1c −3,43 mmol/mol (IC95 % −4,75 à −2,11 mmol/mol), converti en % (÷10,929) = −0,43 à −0,19 %, concordant avec les bornes qu'OE donne en %. TIR +6,36 % (IC95 % 2,48-10,24), TAR −5,86 %, TBR −0,66 % : identiques au résumé source. Localisation : résumé PubMed, *Diabetologia* 2024;67:798-810.
- **C2** — DIATEC est bien un essai en population hospitalisée, non transposable par défaut à l'ambulatoire, comme l'affirme OE : confirmé par Crossref (DOI 10.2337/dc24-2222) et le protocole publié (BMC Endocrine Disorders, *Diabetes Care* 2025;48(4):569-578).
- **C3** — FreeDM2 utilise des algorithmes de titration identiques dans les deux bras (seule la source de mesure diffère), comme l'affirme OE : confirmé indépendamment via le protocole d'essai publié (dépôt Cambridge, PMID 40233956), sans passer par la citation d'OE.
- **C4** — Les PMID que OE associe à FreeDM2 (42035781) et à l'analyse rétrospective de Martens 2025 (40683222) sont exacts — vérifiés via PubMed `efetch` indépendamment (titre, auteurs, revue, année concordants), malgré la règle de méfiance générale envers les PMID rendus par OE (`00-global.md` § Règles de sourcing).
- **C5** — Steno2tech est un essai réel (PMID 38489032, NCT04331444), avec 77 % de participants sous basale seule ; la caractérisation implicite d'OE (essai de modalité de monitorage, pas de titration comparée) est cohérente avec le design réel de l'essai.

---

## 6. Objections retirées

- **Objection initiale** : le DOI d'El Fathi et al. 2026 (10.1177/…) semblait incohérent avec l'éditeur attendu pour *Diabetes Technology & Therapeutics* (habituellement Mary Ann Liebert, DOI en 10.1089), suggérant une possible confusion ou un artefact de recherche. **Retirée** après vérification Crossref (API `api.crossref.org/works/10.1177/15209156261420193`) : container-title « Diabetes Technology & Therapeutics », éditeur SAGE Publications, date 2026-02-06 — cohérent et confirmé par une source indépendante d'OE et du moteur de recherche.
- **Objection initiale** : les intervalles de confiance HbA1c de la méta-analyse Jancev semblaient contredire ceux cités par OE (mmol/mol vs %, bornes numériquement différentes). **Retirée** après conversion manuelle (÷10,929, conforme à la relation IFCC/NGSP) : les bornes correspondent exactement une fois l'unité harmonisée — passage : résumé PubMed PMID 38363342.

---

## 7. Décompte

| | Nombre |
|---|---|
| **Par sévérité** | |
| HAUTE | 1 (F1) |
| MOYENNE | 1 (F2) |
| BASSE | 2 (F3, F4) |
| **Par origine** | |
| Omission | 3 (F1, F2, F3) |
| OE seule | 1 (F4) |
| Source elle-même | 0 |
| Non vérifiable | 0 |
| **Confirmations obtenues** | 5 (C1-C5) |
| **Objections retirées** | 2 |

---

## 8. Verdict par sous-question

- **Q1 (décisive) — La négative ne tient pas telle quelle.** Un ECR ambulatoire DT2 sous basale seule (El Fathi et al. 2026, n=30) compare explicitement un algorithme de titration piloté par capteur à un algorithme piloté par autosurveillance capillaire — c'est exactement le design que Q1 recherche, et un design structurellement différent de MOBILE/FreeDM2/Steno2tech (qui ne varient que la source de mesure sous un algorithme identique). **Réserve majeure non levée** : je n'ai pas pu vérifier sur texte intégral si le « titration glucose level » de cet algorithme constitue une métrique composite proche de TIR/TAR/tendance, ou une valeur ponctuelle dérivée du capteur analogue au « nadir 1 h AM » que Martens et al. 2025 proposent comme simple substitut de la glycémie à jeun (et qu'OE écarte à juste titre de Q1/Q2 pour ce motif). **Le point ne doit pas rester tranché sur cette recherche** : l'affirmation catégorique « aucun ECR trouvé » est factuellement fausse en l'état (un essai existe et n'a pas été identifié par OE) ; la question de savoir s'il répond au critère strict « piloté par métriques » plutôt qu'« piloté par une valeur dérivée du capteur » reste à trancher sur le texte intégral avant toute reformulation du nœud.

- **Q2 (décisive) — La négative ne tient pas.** Deux algorithmes de titration de basale MCG-pilotés, publiés et évalués prospectivement chez le DT2 ambulatoire, avec valeurs chiffrées actionnables, existaient avant la date de la requête OE (El Fathi et al. 2026, publié six mois avant ; Oser et al. 2026, publié la veille). L'un des deux (El Fathi) était indexé sur PubMed depuis février 2026 et aurait dû être trouvé. La réponse d'OE, qui ne retient que des éléments rétrospectifs ou hospitaliers comme « les plus proches », est incomplète.

- **Q3 — Tient globalement, avec une réserve mineure.** La caractérisation de Jancev est intégralement confirmée (C1). Celle de FreeDM2 est confirmée par une source indépendante (C3). Celle de MOBILE est corroborée en valeur numérique par un relais indépendant, mais **non vérifiée en primaire** par cet agent (texte intégral JAMA non ouvert dans le temps imparti) — à vérifier avant toute utilisation ferme dans le nœud.

- **Q4 — Tient, avec une nuance à instruire.** Aucun élément trouvé ne contredit l'absence de seuil MCG validé comme déclencheur chiffré de majoration de dose au sens strict demandé (seuil % → n unités). Nuance : l'algorithme El Fathi 2026, s'il était pleinement caractérisé, pourrait constituer une première ébauche de règle actionnable (trois composantes chiffrables) — à réexaminer lors d'une mise à jour du dossier une fois le texte intégral obtenu.

- **Q5 — Tient, non contredit par ma recherche.** Aucune donnée trouvée dans le temps imparti (budget de la passe d'omission concentré sur Q1/Q2) ne contredit la réponse d'OE ; ce n'est pas une confirmation forte, faute de recherche indépendante dédiée sur ce point précis — à noter comme limite de couverture.

- **Q6 — Non vérifié en primaire par cet agent.** Aucune vérification directe des textes ADA 2026 / AACE 2026 / ATTD n'a été faite (budget consacré à Q1/Q2) ; accepté provisoirement, statut « non vérifié » et non « confirmé ».

---

## 9. Proposition — alerte motivée (la négative de Q1/Q2 ne tient pas en l'état)

**Ne pas encoder dans le nœud `insuline` une absence catégorique de type** « aucun essai ne compare une titration de basale pilotée par MCG à une titration par glycémie capillaire chez le DT2 » (Q1) ni « aucun algorithme MCG-piloté n'a été évalué prospectivement en ambulatoire » (Q2) : ces deux formulations sont contredites par une recherche indépendante de moins d'une heure, sur des sources indexées avant la date de la requête OE.

**Libellé alternatif proposé, sous réserve de validation référent et de lecture du texte intégral El Fathi et al. 2026** (à marquer `[À VÉRIFIER]` tant que ce texte intégral n'est pas ouvert, conformément à `docs/decision/00-global.md` § Règles de sourcing) :

> « Un essai pilote randomisé ambulatoire (El Fathi et al. 2026, n = 30, DT2 sous basale seule) montre la faisabilité et un signal favorable d'un algorithme de titration de la basale piloté par la mesure continue du glucose, comparé à une titration par autosurveillance capillaire (gain de temps dans la cible de +14,6 points de %, p = 0,001, à 16 semaines) — sans hypoglycémie sévère ni événement indésirable grave rapportés. Il s'agit d'un essai de faisabilité de petite taille (n = 30), à confirmer par des essais de plus grande ampleur avant toute intégration dans un algorithme décisionnel ; le détail exact de la métrique MCG utilisée comme déclencheur de dose (« niveau glycémique de titration ») n'a pas pu être vérifié sur texte intégral à ce jour `[À VÉRIFIER]`. En dehors de cet essai pilote et d'une étude prospective monocentrique sans comparateur (Oser et al. 2026, n = 14), aucun essai comparatif de plus grande taille ni aucune recommandation internationale indexée post-2019 ne définit à ce jour un algorithme de titration de basale chiffré piloté par les métriques MCG (temps dans la cible, temps au-dessus de la cible, tendance du profil AGP) : les recommandations (ADA, ATTD/ICTR, AACE) ne fixent que des cibles d'interprétation, et les algorithmes posologiques publiés restent fondés sur la glycémie à jeun. »

**Ce que ce libellé change par rapport à une négative brute** : il ne prétend plus qu'« aucun essai n'existe », mais situe la preuve disponible (un essai pilote positif, de petite taille, avec un point de méthode non éclairci) en dessous du seuil nécessaire pour piloter le moteur — ce qui reste compatible avec la granularité « si appuyée sur EBM » du nœud E, sans fermer la porte par une affirmation d'absence qui ne résiste pas à la vérification.

**Action attendue avant toute décision du référent** : obtenir le texte intégral d'El Fathi et al. 2026 (DOI 10.1177/15209156261420193) par une voie non essayée ici (dépôt institutionnel des auteurs, demande directe, accès personnel/institutionnel du référent — `acces-identite.md` § 7, étape 7) pour trancher si le « titration glucose level » constitue une métrique composite (TIR/TAR-like) ou une valeur ponctuelle dérivée du capteur ; sans cette lecture, le statut de Q1 reste `non vérifiée`, ni confirmé ni infirmé au sens strict du registre.
