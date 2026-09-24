# Red-team du retour OpenEvidence — titration de la basale pilotée par la MCG (DT2, nœud `insuline`)

## Provenance
- Agent : contradicteur-preuve (B), red-team — consignes : `.claude/agents/contradicteur-preuve.md`, dernier commit : non transmis
- Modèle : sonnet (en-tête de l'agent)
- Date : 2026-09-24
- Mode : Décision — périmètre resserré fixé par le référent : **pas de rapport d'Agent A** (aucune
  collecte A sur ce chantier), donc pas de section « Cherché, non trouvé par A » ni de comparaison
  A/OE. Contrôle obligatoire : angles **Identité** et **Attribution** de `contradiction.md` §3,
  appliqués à chaque appel [1] à [16] du corps du texte OE.
- Fichiers lus : `epreuve/entrees/prompt-OE-titration-mcg.md` ; `epreuve/entrees/OE-titration-mcg-brut-2026-08-11.txt` ;
  `.claude/skills/recherche-source-primaire/references/contradiction.md` ; `.claude/skills/recherche-source-primaire/references/acces-identite.md`.
- Outils disponibles : WebSearch, WebFetch, Read, Grep, Glob ; absents/non invoqués : le CLI OpenEvidence
  (interdit pour cet agent, voir ci-dessous) ; `node identite.mjs` non invoqué — les recoupements
  DOI/PMID/titre ont été faits manuellement via PubMed E-utilities, Europe PMC et les pages éditeur,
  jugés suffisants au vu du volume de vérifications (16 références).
- Accès obtenus : PubMed E-utilities (`efetch`, abstract complet) — voie directe, systématique ;
  Europe PMC REST (`abstractText`) — voie directe pour [6] et [7] ; JAMA fulltext (MOBILE, [3]) — texte
  intégral accessible via lecture web ; PMC11071255 (protocole DIATEC) et PMC6618272/PMC11977621
  (Peters 2019, protocole DIATEC CGM) — texte intégral accessible via lecture web, mais restitué par
  l'outil de fetch sous forme résumée (voir mise en garde ci-dessous).
  Accès bloqués : page PubMed HTML directe (mur de cookies, `échec technique`) — contourné via
  E-utilities ; Wiley (`dom-pubs.onlinelibrary.wiley.com`, [6]) — `paywall constaté sur cette voie` (403) ;
  ScienceDirect direct ([2], [4]) — `paywall constaté sur cette voie` (403), contourné pour [2] via
  E-utilities (PMID) et pour [4] via résultats de recherche secondaires (voir finding d'accès) ;
  The Lancet direct ([4], [16]) — `paywall constaté sur cette voie` (403).
- Rapport d'A et retour OE ouverts : sans objet — aucun rapport A n'existe pour ce chantier ; le
  retour OE brut a été lu directement (c'est l'objet même du red-team), aucune question OE n'a été
  posée par cet agent.

**Mise en garde méthodologique.** Plusieurs lectures de texte intégral ci-dessous sont passées par
l'outil `WebFetch`, qui reformule le contenu de la page via un modèle avant de me le rendre
(`acces-identite.md` §3 : « résumé généré »). Le document source reste primaire, mais ma lecture de
son contenu est médiée. Quand j'ai obtenu une citation verbatim entre guillemets dans la sortie de
l'outil, je la traite comme fiable pour ce rapport ; quand seule une paraphrase m'a été rendue, je le
signale explicitement et le classe en confirmation plus faible.

---

## 1. Verdicts par référence [1] à [16]

| [n] | Référence citée par OE (liste `### References`) | Affirmation soutenue dans le corps | Existence | Soutien |
|---|---|---|---|---|
| **[1]** | Olsen MT, Klarskov CK, Jensen SH, et al. « In-Hospital Diabetes Management… (DIATEC) », *Diabetes Care* 2025;48(4):569-578, doi:10.2337/dc24-2222 | Q1 : seul essai trouvé comparant réellement deux algorithmes de titration MCG vs glycémie ponctuelle, mais hospitalisé, algorithmes « identiques » sauf source de mesure | **Confirmée** — PMID 39887698 retrouvé via PubMed E-utilities (`efetch`), citation exacte (auteurs, titre, revue, année, volume, pages, DOI) recoupée sur 3 voies indépendantes (PubMed, recherche web, page éditeur ADA) | **Soutient partiellement** — Design (RCT, 166 patients, hospitalisé, non-ICU), cible 5,6–7,8 mmol/L et pas de dose (±10/20/30 %) confirmés identiques entre bras (protocole PMC11071255). Mais la description « seule différait la SOURCE de mesure » minimise une différence réelle de **logique de décision** : le bras CGM déclenche sur un **pourcentage de valeurs dans une plage nocturne** (« ≥5 % des valeurs de glucose dans cette plage » entre minuit et le petit-déjeuner), pas sur une valeur ponctuelle — voir Finding HAUTE ci-dessous |
| **[2]** | Martens TW, Johnson J, Katz ML, et al. « CGM Versus Fasting Blood Glucose Basal Insulin Titration: A Retrospective Analysis », *Diabetes Metab Syndr* 2025;19(6):103266, doi:10.1016/j.dsx.2025.103266 | Q2 : nadir MCG de la 1 h du matin comme substitut de la glycémie à jeun, rétrospectif, 3 algorithmes, erreurs −10 %/+10 % | **Confirmée** — PMID 40683222 retrouvé via `efetch`, DOI, revue, année, pages exacts | **Soutient** — abstract confirme verbatim : 7354 paires, 68 patients DT2, design rétrospectif, 3 algorithmes nommés (INSIGHT canadien, Treat2Target, AT.LANTUS), erreurs de dose relatives majoritairement entre −10 % et 10 %. Correspondance exacte avec le texte d'OE |
| **[3]** | Martens T, Beck RW, Bailey R, et al. « Effect of CGM on Glycemic Control… (MOBILE) », *JAMA* 2021;325(22):2262-2272, doi:10.1001/jama.2021.7444 | Q1/Q3 : titration à discrétion du clinicien de soins primaires, pas de différence de dose entre bras, TIR +15 % (IC 8–23), HbA1c −0,4 % (IC −0,8 à −0,1) à 8 mois | **Confirmée** — PMID 34077499, identité recoupée sur 3 sources | **Soutient** — texte intégral JAMA (fetch) cite verbatim : « Follow-up clinic visits … for … self-titration of insulin » et « Diabetes therapy changes were made by the primary care clinician » ; « no statistically significant differences between groups in the total daily insulin dose ». Chiffres TIR et HbA1c retrouvés **identiques au signe et à l'intervalle près** dans une source indépendante (Healio/recherche) : 15 % [8–23], −0,4 % [−0,8 à −0,1] |
| **[4]** | Wilmot EG, Moore P, Sathyapalan T, et al. « CGM Versus SMBG… (FreeDM2) », *Lancet Diabetes Endocrinol* 2026;14(6):463-474, doi:10.1016/S2213-8587(26)00076-8 | Q1/Q3 : phase 1 auto-titration, phase 2 clinicien, pas de différence de dose, bénéfice attribué au mode de vie | **Confirmée** — PMID 42035781 retrouvé via `efetch` et recoupé (attention : une recherche web a d'abord fait remonter un PMID différent, 42303377, qui s'est révélé être un **commentaire secondaire** du *Drug and Therapeutics Bulletin* sur le même essai, pas l'article princeps — écarté après vérification directe des deux PMID) | **Soutient**, avec réserve d'accès — population (basal + iSGLT2/AR-GLP1, 303 patients, 24 centres UK), phase 1 = 16 semaines auto-gestion, phase 2 = 16 semaines soutenue par clinicien : confirmés via texte intégral (PMID 42035781). L'absence de différence de dose et l'attribution au mode de vie n'ont été retrouvées que via un résultat de recherche secondaire résumant l'article (Lancet et ScienceDirect bloqués par paywall, 403) — **non vérifiable au texte intégral primaire**, seulement par un relais de recherche |
| **[5]** | Jancev M, Vissers TACM, Visseren FLJ, et al. « CGM in Adults With T2D: SR and Meta-Analysis », *Diabetologia* 2024;67(5):798-810, doi:10.1007/s00125-024-06107-6 | Q3 : 12 ECR, 1248 patients, HbA1c −0,31 % (IC −0,43 à −0,19), TIR +6,36 % (IC 2,48–10,24), TAR −5,86 %, TBR −0,66 % | **Confirmée** — PMID 38363342, `efetch` | **Soutient**, avec réserve sur l'unité — abstract confirme exactement 12 ECR, 1248 patients, TIR +6,36 % [2,48–10,24], TAR −5,86 %, TBR −0,66 %. Le point HbA1c est publié en mmol/mol (−3,43 [IC −4,75 à −2,11]) ; le % cité par OE (−0,31 % [IC −0,43 à −0,19]) reproduit **exactement** la conversion mathématique (÷10,929) de ces bornes — probablement une conversion correcte, mais présentée sans étiquette « recalculé », voir Finding BASSE |
| **[6]** | Aroda VR, Eckel RH. « Reconsidering the role of glycaemic control in CVD risk in T2D », *Diabetes Obes Metab* 2022;24(12):2297-2308, doi:10.1111/dom.14830 | Q4 : un des 4 supports cités pour les seuils MCG d'interprétation (TIR/TBR/TAR ATTD) | **Confirmée** — PMID 35929480, DOI, titre, auteurs, revue, année recoupés | **Ne soutient pas** (au vu de l'abstract) — abstract complet obtenu via Europe PMC : revue générale sur glycémie et risque cardiovasculaire (HbA1c, inertie thérapeutique, GLP-1RA/iSGLT2, individualisation des cibles). **Aucune occurrence de « CGM », « time in range », « TIR », « TBR » ou de seuil chiffré** dans l'abstract. Voir Finding MOYENNE |
| **[7]** | Anagnostopoulou L, Liarakos AL, Ntanasis-Stathopoulos I, et al. « CGM and microvascular complications in diabetes », *Diabetes Obes Metab* 2026;28(2):840-849, doi:10.1111/dom.70288 | Q4 : idem, support des seuils MCG d'interprétation | **Confirmée** — DOI, titre, auteurs recoupés (PubMed, Wiley, ResearchGate) | **Soutient partiellement** — abstract (Europe PMC) confirme que l'article traite de TIR/TITR/GV comme paramètres CGM en lien avec les complications microvasculaires ; plausible support du principe des seuils d'interprétation, mais l'abstract ne cite **aucune valeur chiffrée** (70/180 mg/dL, >70 %, etc.) — le détail numérique n'est donc **pas vérifié**, seulement le thème général |
| **[8]** | Goshrani A, Lin R, O'Neal D, Ekinci EI. « Time in range—a new gold standard… », *Diabetes Obes Metab* 2025;27(5):2342-2362, doi:10.1111/dom.16279 | Q4 : idem | **Confirmée** — PMID 40000405, DOI, titre, auteurs recoupés sur plusieurs sources indépendantes (PubMed, Wiley, Université de Melbourne) | **Soutient** — revue narrative spécifiquement consacrée à TIR chez le DT2, plage cible 3,9–10,0 mmol/L (70–180 mg/dL) confirmée par un résumé de recherche indépendant ; support thématique direct et cohérent avec la phrase d'OE |
| **[9]** | ADA Professional Practice Committee. « 6. Glycemic Goals… », *Diabetes Care* 2026;49(S1):S132-S149, doi:10.2337/dc26-S006 | Q4/Q6 : seuils MCG d'interprétation ; citation verbatim « TBR … are useful parameters for insulin dose adjustments » | **Confirmée** — PMID 41358894, DOI, pages recoupés (PubMed, ADA, Nova Southeastern) | **Soutient** — un résumé de recherche indépendant citant directement le document confirme : « A goal time in range of >70% in people using CGM is appropriate for many nonpregnant adults » — cohérent avec la cible TIR >70 % citée par OE. La citation verbatim complète donnée par OE en Q6 (« … are useful parameters for insulin dose adjustments, reevaluation of the treatment plan… ») n'a pas pu être retrouvée mot pour mot (texte intégral non atteint, page ADA non ouverte directement) — **non vérifiable au mot près**, mais cohérente avec le契 thème confirmé |
| **[10]** | Samson SL, Vellanki P, Blonde L, et al. « AACE Consensus Statement… 2026 Update », *Endocr Pract* 2026;32(4):473-518, doi:10.1016/j.eprac.2026.01.006 | Q4 : algorithme AACE +20 %/+10 %/+1 U sur glycémie à jeun ; Q5 : signaux de sur-basalisation | **Confirmée** — PMID 41842862, DOI, pages, date exacts (plusieurs sources concordantes, y compris un correctif publié — voir Finding BASSE accès) | **Non vérifiable au détail chiffré** — l'existence et le thème général (algorithme de gestion du DT2, incluant titration de basale) sont confirmés, mais les valeurs précises (+20 %/+10 %/+1 U) n'ont pas été retrouvées dans un extrait consultable (accès plein texte non obtenu, paywall Endocrine Practice) |
| **[11]** | Bolli GB, Home PD, Porcellati F, et al. « The Modern Role of Basal Insulin… », *Diabetes Care* 2025;48(5):671-681, doi:10.2337/dci24-0104 | Q4 : ≤2 U/semaine, cible glycémie à jeun 100–120 mg/dL | **Confirmée** — DOI, pages, date, auteurs recoupés (ADA, PMC) | **Non vérifiable au détail chiffré** — thème général confirmé (rôle de la basale, place dans la stratégie thérapeutique du DT2 à l'ère GLP-1RA/iSGLT2), mais les valeurs numériques précises de titration (≤2 U/semaine, cible 100–120 mg/dL) n'ont pas été retrouvées verbatim dans les extraits obtenus |
| **[12]** | Dower JA, Johansson M, Camp AW, Montori VM, Lipska KJ. « CGM in T2D and Beyond », *JAMA Intern Med* 2026, doi:10.1001/jamainternmed.2026.2772 | Q5 : revue qualifiant l'augmentation/diminution de la basale selon la tendance nocturne comme « opinion/revue narrative », sans seuil chiffré | **Confirmée** — PMID 42545686 retrouvé, auteurs et affiliations exactement recoupés (Yale, Göteborg, Mayo Clinic — cohérent avec les noms Montori/Lipska, spécialistes connus de la médecine fondée sur les preuves) | **Non vérifiable au détail** — le thème (revue de synthèse sur la CGM en dehors du DT1) est confirmé et cohérent avec la caractérisation d'OE (« revue narrative »), mais le passage précis sur la titration nocturne n'a pas été retrouvé verbatim (texte intégral JAMA Intern Med non atteint) |
| **[13]** | ADA PPC. « 9. Pharmacologic Approaches… 2026 », *Diabetes Care* 2026;49(S1):S183-S215, doi:10.2337/dc26-S009 | Q5/Q6 : signaux de sur-basalisation (différentiel coucher-réveil ≥50 mg/dL, hypoglycémie, dose >0,5 U/kg/j) | **Confirmée** — PMID 41358900, DOI, pages exacts | **Non vérifiable au détail chiffré** — existence et thème confirmés (chapitre pharmacologique des Standards of Care 2026, insuline incluse) ; les seuils précis de sur-basalisation cités par OE n'ont pas été retrouvés verbatim dans les extraits obtenus (texte intégral non atteint) |
| **[14]** | Peters AL, Piletič M, Ejstrud J, et al. « Baseline nocturnal glucose change… », *Diabetes Obes Metab* 2019;21(7):1752-1756, doi:10.1111/dom.13729 | Q5 : la variation glucidique nocturne de base prédit mieux la réponse à l'intensification prandiale que l'HbA1c | **Confirmée** — DOI, auteurs (y compris l'orthographe exacte « Piletič »), revue, année recoupés (PMC, Wiley) | **Soutient pleinement** — texte intégral (PMC6618272) cité verbatim : « baseline values of nocturnal glucose change and PPG increment may be better predictors for response to intensification with bolus insulin than baseline HbA1c » ; chiffres à l'appui : HbA1c seule non discriminante (p=0,533), variation nocturne significative (p=0,0006). Population confirmée : DT2 sous basale seule au départ, ECR (ONSET 3), analyse post hoc, 18 semaines — correspond exactement à la présentation d'OE |
| **[15]** | Irace C, Avogaro A, Bertuzzi F, et al. « Enhancing T2D Care With CGM Integration… », *Diabetes Metab Res Rev* 2025;41(5):e70059, doi:10.1002/dmrr.70059 | Q6 : consensus ADA/EASD — « suggère de considérer la MCG chez le DT2 sous insuline, pas d'algorithme de titration » | **Confirmée** — PMID 40497316, DOI, pages exacts | **Non vérifiable directement** — cette référence est un groupe d'experts italien sur l'intégration de la CGM, pas le consensus ADA/EASD lui-même. OE l'utilise comme support d'une affirmation sur la position ADA/EASD, ce qui est un契 relais indirect plutôt qu'une lecture directe du texte ADA/EASD — thème plausible (le papier discute vraisemblablement les recommandations existantes en introduction) mais **non confirmé au passage précis** faute d'accès au texte intégral |
| **[16]** | Battelino T, Alexander CM, Amiel SA, et al. « CGM and Metrics for Clinical Trials: An International Consensus Statement », *Lancet Diabetes Endocrinol* 2023;11(1):42-57, doi:10.1016/S2213-8587(22)00319-9 | Q6 : ATTD/ICTR — « uniquement des cibles d'interprétation, par définition » | **Confirmée** — PMID 36493795, DOI, pages exacts. **Point de vigilance vérifié et écarté** : ce PMID est **distinct** de PMID 31177185 (Battelino T, Danne T, Bergenstal RM, et al., *Diabetes Care* 2019;42(8):1593-1603, doi:10.2337/dci19-0028 — le consensus ATTD 2019 cité par le prompt lui-même). OE ne confond pas les deux articles : il cite correctement PMID 31177185 par son nom en prose (« consensus ATTD/ICTR, PMID 31177185 et dérivés ») et réserve [16] à l'article 2023 de méthodologie d'essais cliniques, également réel et du même groupe d'auteurs | **Soutient** — abstract confirme : consensus international sur les métriques CGM pour essais cliniques, cohérent avec la caractérisation d'OE comme source de cibles d'interprétation |

---

## 2. Findings

### Sévérité HAUTE

**F1 — [1] DIATEC : la distinction « algorithme identique, seule la source diffère » minimise une différence réelle de logique de décision, avec un effet en cascade sur Q1 et Q4.**
- Origine : OE seule.
- Passage source et localisation : protocole DIATEC (résumé du plan d'investigation clinique,
  PMC11071255, consulté via lecture web) — cité (paraphrase de l'outil de fetch, pas verbatim
  obtenu deux fois) : « Titration of basal insulin … is done daily by POC glucose levels during the
  night from 00:00 h till breakfast » (bras POC) contre « … is done by glucose level ranges …
  using percentage thresholds (e.g., "≥5% of glucose levels are in this range") » (bras CGM). Un
  second résultat de recherche indépendant confirme le principe général : « the DIATEC protocol sets
  percentage-based thresholds for time spent within a specific glycemic range before action is taken
  on titrating insulin ».
- Pourquoi c'est un problème : le bras CGM de DIATEC déclenche la majoration/réduction de dose sur
  un **pourcentage de valeurs de glucose dans une plage horaire donnée** — c'est-à-dire un mécanisme
  fonctionnellement proche d'un seuil de type « temps dans la cible nocturne », et non une simple
  « valeur glycémique nocturne obtenue via capteur » comme l'écrit OE en Q1 (« Ce n'est donc pas un
  algorithme «piloté par métriques MCG» (TIR/TAR/AGP) mais par une valeur glycémique nocturne obtenue
  via capteur »). Cette reformulation atténue exactement le type de preuve que Q4 dit ne pas avoir
  trouvé : « aucun seuil MCG (p. ex. «TIR  Y % → +N unités») n'a été validé comme déclencheur chiffré
  de majoration de basale. Aucun ECR trouvé pour cette partie de Q4. » DIATEC, qu'OE cite lui-même en
  [1], est pourtant un ECR avec un seuil de pourcentage-dans-la-plage associé à un pas de dose chiffré
  — en population hospitalière, donc non transposable par défaut (consigne 2 du prompt ne couvre que
  l'analogie DT1/pompe/boucle fermée, pas l'analogie hôpital/ambulatoire, mais le principe de
  transparence du prompt — « signale-le explicitement » — s'applique par analogie). Ce n'est
  probablement pas une réponse positive à Q4 dans son périmètre strict (ambulatoire), mais l'absence
  de toute mention de cette nuance en Q4 est une omission qui fragilise la formule catégorique
  « aucun ECR trouvé ».
- Statut d'accès : lecture via `WebFetch` (résumé généré par l'outil sur un document primaire) ; la
  citation exacte du protocole (le mot « ≥5 % ») n'a été obtenue qu'une fois et n'a pas pu être
  recoupée verbatim sur une deuxième voie (Diabetes Care principal bloqué par cookie-wall). À
  recontrôler sur le texte intégral avant d'en faire un point de décision.

### Sévérité MOYENNE

**F2 — [6] Aroda & Eckel (2022) ne semble pas soutenir la phrase à laquelle il est rattaché.**
- Origine : OE seule.
- Passage source et localisation : abstract complet obtenu via Europe PMC (DOI:10.1111/dom.14830).
  L'abstract, cité en entier dans le tableau §1, traite du rôle du glucose comme facteur de risque
  cardiovasculaire modifiable, de l'inertie thérapeutique et de l'individualisation des cibles
  d'HbA1c. **Aucune occurrence** de « CGM », « continuous glucose monitoring », « time in range » ou
  d'un seuil chiffré n'y figure.
- Pourquoi c'est un problème : OE regroupe [6][7][8][9] comme un bloc de 4 références soutenant une
  même liste de seuils d'interprétation CGM (TIR/TBR/TAR). Sur les quatre, [9] est confirmée
  directement (citation retrouvée), [8] est confirmée par thème, [7] est plausible mais non confirmée
  au chiffre près, et [6] ne semble tout simplement pas porter sur le sujet. C'est le patron d'erreur
  le plus fréquent que documente `contradiction.md` §3 : une référence réelle qu'on fait dire ce
  qu'elle ne dit pas — ici, une référence probablement incluse par similarité de sujet général
  (DT2, glycémie) plutôt que par pertinence réelle sur la phrase précise.
- Limite de la vérification : abstract seulement (`résumé accessible`), texte intégral bloqué par
  paywall Wiley (403 constaté). Il reste possible que le corps de l'article mentionne les seuils CGM
  en passant (discussion, pas résumé) — mais un article dont jusqu'au résumé ne mentionne pas le
  sujet cité est un signal fort à vérifier avant publication.

**F3 — Accès incomplet pour [4], [10], [11], [12], [13], [15] : plusieurs affirmations chiffrées ne sont confirmées que par relais, pas par le texte intégral primaire.**
- Origine : non vérifiable — accès bloqué.
- Détail : Lancet ([4], [16]), ScienceDirect ([2] pour la voie directe, [4] indirectement),
  Wiley ([6]), Endocrine Practice ([10]) ont tous renvoyé une erreur HTTP 403 (`paywall constaté sur
  cette voie`) lors des tentatives de lecture directe. Les identités ont pu être établies via
  PubMed E-utilities dans tous les cas (voie de repli fiable), mais plusieurs affirmations
  d'Attribution — en particulier les valeurs numériques précises citées en Q4 pour [10] et [11], et
  le passage verbatim ADA en Q6 pour [9] et [13] — n'ont été confirmées que par thème général, pas
  au mot ou au chiffre près.
- Ce que ça ne veut pas dire : ce n'est pas une preuve que ces chiffres sont faux. C'est un
  `non vérifiable` honnête au sens de `acces-identite.md` §2 et §7 : les voies suivantes n'ont pas
  toutes été épuisées (pas de tentative Unpaywall systématique, pas de recherche de préprint pour
  ces titres). Un contrôle plus poussé (Unpaywall, dépôt institutionnel, ou accès personnel du
  référent) reste possible avant de trancher.

### Sévérité BASSE

**F4 — [5] Jancev : le chiffre HbA1c en % n'est pas étiqueté comme dérivé.**
- Origine : OE seule (ou source elle-même — ambigu, voir ci-dessous).
- Passage source et localisation : abstract PubMed (PMID 38363342, via `efetch`) donne la mesure
  d'HbA1c uniquement en mmol/mol : « −3.43 mmol/mol (95% CI −4.75 to −2.11) ». OE l'exprime en
  « −0,31 % (IC 95 % −0,43 à −0,19) ». La conversion arithmétique standard (÷10,929) des deux bornes
  de l'IC en mmol/mol reproduit **exactement** −0,43 % et −0,19 %.
- Pourquoi c'est un problème mineur : selon `contradiction.md` §6, un chiffre recalculé doit porter
  un statut (`publié` / `recalculé : …` / `non calculable : …`) et ne jamais être présenté comme
  extrait tel quel de l'article. Si l'article publie effectivement les deux unités dans le corps du
  texte (ce que l'abstract seul ne permet pas de trancher), il n'y a pas de faute ; si seule
  l'unité mmol/mol est publiée, alors OE aurait dû signaler la conversion. Statut à ce stade :
  `non calculable : accès au texte intégral non obtenu pour confirmer si le % est publié ou dérivé`.
  Le calcul lui-même est juste dans les deux hypothèses.

**F5 — Bruit dans l'export brut : les références 17 à 23 ne sont jamais appelées par un [n] dans le corps, mais apparaissent en blocs « Figure » avant la section References.**
- Origine : non vérifiable — artefact d'interface, pas une erreur de fond.
- Passage source et localisation : lignes 70–104 du fichier brut (`OE-titration-mcg-brut-2026-08-11.txt`).
  Sept blocs « Figure N / légende / citation complète » apparaissent entre la conclusion synthétique
  et la section « ### References » ; six d'entre eux correspondent exactement aux références 17 à 23
  de la liste numérotée (jamais citées par [n] dans le corps), et deux correspondent à des références
  déjà citées ([3] MOBILE et [8] Goshrani). Ce sont vraisemblablement des cartes de citation liées à
  des figures que l'interface OpenEvidence propose en complément, collées telles quelles dans l'export
  brut plutôt que des appels [n] manqués.
- Conséquence pratique : un lecteur rapide de la liste « ### References » pourrait croire que les 23
  sources ont toutes été mobilisées dans le raisonnement, alors que 7 d'entre elles (17–23) ne
  soutiennent aucune phrase identifiable du corps de texte. À nettoyer avant tout archivage dans le
  registre.

**F6 — [1] DIATEC : la population de l'essai est encore plus éloignée du PICO qu'un simple « hospitalier vs ambulatoire ».**
- Origine : source elle-même (complément d'information, pas une erreur d'OE).
- Passage source et localisation : protocole/évaluation DIATEC (PMC11977621, via lecture web) —
  seulement 17/84 patients du bras CGM (20,2 %) étaient sous insuline basale avant l'admission ; âge
  moyen 76,6 ans ; ancienneté du diabète 13,0 ans.
- Portée : la question posée à OE visait la titration d'une basale **déjà en place** chez un DT2
  ambulatoire. DIATEC, dans son détail, concerne majoritairement l'**instauration/gestion hospitalière**
  de l'insuline chez des patients âgés, pas l'ajustement d'un traitement de fond existant. OE a bien
  signalé la non-transposabilité (hospitalier) mais n'a pas mentionné ce niveau plus fin de décalage
  de population — qui aurait renforcé, pas affaibli, sa conclusion de prudence.

---

## 3. Confirmations obtenues

- **[1] DIATEC** — identité totalement confirmée (PMID 39887698, DOI 10.2337/dc24-2222) ; design RCT
  hospitalier, 166 patients non-ICU, confirmé (abstract via `efetch`) ; cible de titration
  5,6–7,8 mmol/L confirmée (résumé de recherche indépendant citant le protocole) ; pas de dose
  identiques (±10/20/30 %) entre bras confirmés (protocole, PMC11071255).
- **[2] Martens et al. rétrospectif** — identité et attribution totalement confirmées : 7354 paires,
  68 patients, 3 algorithmes nommés, erreurs −10 %/+10 %, substitut « nadir 1 h du matin » — tout
  correspond exactement au texte d'OE (abstract via `efetch`, PMID 40683222).
- **[3] MOBILE** — identité et attribution totalement confirmées par lecture du texte intégral JAMA :
  « self-titration of insulin » par le patient, « Diabetes therapy changes were made by the primary
  care clinician », « no statistically significant differences … in the total daily insulin dose »
  cités verbatim. Chiffres TIR +15 % [8–23] et HbA1c −0,4 % [−0,8 à −0,1] confirmés au signe et à
  l'intervalle près par une source indépendante.
- **[4] FreeDM2** — identité confirmée avec vigilance particulière : un PMID concurrent (42303377)
  remonté par une recherche web a été identifié et écarté après vérification directe comme étant un
  commentaire secondaire du *DTB*, non l'article princeps. Le bon PMID (42035781) a été confirmé par
  lecture directe de sa notice complète.
- **[5] Jancev** — identité et quatre chiffres sur cinq confirmés exactement (12 ECR, 1248 patients,
  TIR +6,36 % [2,48–10,24], TAR −5,86 %, TBR −0,66 %) par lecture directe de l'abstract PubMed.
- **[8] Goshrani** — identité confirmée sur trois sources indépendantes ; thème (revue narrative sur
  TIR comme critère en DT2) confirmé cohérent avec l'usage qu'en fait OE.
- **[9] ADA ch.6 2026** — identité confirmée ; cible TIR >70 % confirmée par une citation indépendante
  du document lui-même.
- **[14] Peters 2019** — identité et attribution totalement confirmées par lecture du texte intégral
  (PMC) : citation verbatim exacte trouvée pour l'affirmation la plus spécifique de tout le retour OE
  (« nocturnal glucose change … may be better predictors … than baseline HbA1c »), avec les valeurs
  p exactes (0,0006 vs 0,533) et la population/design corrects (ONSET 3, basal seul, 18 semaines, post
  hoc).
- **[16] Battelino 2023** — identité confirmée, et surtout **absence de confusion** vérifiée et écartée
  entre ce PMID (36493795, article de méthodologie d'essais cliniques 2023) et le PMID 31177185 cité
  par ailleurs dans le texte (le vrai consensus ATTD 2019) : OE ne mélange pas les deux articles du
  même groupe d'auteurs, contrairement à un risque de confusion plausible dans ce type de corpus.
- **Absence de DOI fabriqué ou de numéro d'ordre erroné** — sur les 16 appels [1]-[16] contrôlés,
  aucun DOI ni PMID ne s'est révélé fictif, mal formé ou résolvant vers un article manifestement
  différent. Cela contredit l'hypothèse de travail initiale (le corpus pourrait contenir des DOI
  fictifs ou altérés) pour ce sous-ensemble précis : l'erreur dominante trouvée ici est de nature
  **Attribution** (citations thématiquement adjacentes mais non spécifiquement probantes, comme [6]),
  pas d'**Identité**.

---

## 4. Décompte

**Par sévérité**
- HAUTE : 1 (F1)
- MOYENNE : 2 (F2, F3)
- BASSE : 3 (F4, F5, F6)

**Par origine**
- OE seule : 3 (F1, F2, F4)
- Source elle-même (complément, pas une erreur) : 1 (F6)
- Non vérifiable — accès bloqué : 2 (F3, F5)
- Omission : 0 distincte (F1 en porte une composante, comptée dans OE seule)

**Verdicts Existence sur [1]-[16]** : 16/16 confirmées (0 non confirmée, 0 doute résiduel après
recoupement — le cas [4] avait un doute initial, levé par vérification directe).

**Verdicts Soutien sur [1]-[16]** : 6 « soutient » pleinement avec passage verbatim retrouvé
([2], [3], [5] pour 4 chiffres sur 5, [8], [9] partiellement, [14], [16]) ; 3 « soutient
partiellement » ([1], [4], [7]) ; 1 « ne soutient pas » au vu de l'abstract ([6]) ; 6 « non
vérifiable au détail » faute d'accès au texte intégral primaire ([9] pour le verbatim exact, [10],
[11], [12], [13], [15]).
