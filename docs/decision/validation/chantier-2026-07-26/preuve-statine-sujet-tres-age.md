# Statine chez le DT2 très âgé (≥ 75-80 ans) — initiation vs déprescription

Note de preuve ponctuelle, en réponse à une question du référent (2026-07-26) :
*« Pour moi le bénéfice d'introduire une statine à 82 ans est très limité. À vérifier aussi sur des
données, la question de la déprescription d'une statine à cet âge-là chez un patient en prévention
primaire. »*

**Ne modifie aucun fichier existant.** N'engage aucun changement du nœud `statine.yaml` — c'est un
apport au dossier de preuve, à trancher par le référent puis, le cas échéant, à faire vérifier par une
passe red-team avant tout encodage.

**Portée** : ce document traite deux questions séparées — (1) INITIER une statine en prévention
primaire chez le DT2 ≥ 75/80 ans, (2) DÉPRESCRIRE une statine déjà en place au même âge. Il complète,
sans le remplacer, le dossier existant `docs/decision/noeuds/F-statine.md` (§ Sous-dossier 4 et §9.3),
déjà validé référent et vérifié bi-agents le 2026-07-23 pour le reste du nœud.

**Discipline de citation appliquée** : chaque essai/méta-analyse listé ci-dessous a été récupéré via
PubMed, Lancet, BMJ, JAMA, Annals of Internal Medicine, JAGS, ou le PDF officiel de la reco
SFE/SFD/NSFA/SFC 2026 (`docs/decision/sources/` n'en disposait pas — récupéré aujourd'hui), avec un
extrait littéral cité. Deux chiffres n'ont pas pu être confirmés par une citation directe du texte
primaire (source payante) et sont marqués **NON VÉRIFIÉ (partiel)** avec l'origine probable indiquée.

---

## 1. Table maîtresse des preuves

### 1a. Rappel — socle prévention primaire DT2 général (déjà vérifié, non re-consulté aujourd'hui)

Ces essais sont déjà dans le dossier `F-statine.md` §3, vérifiés bi-agents le 2026-07-23 (PMID/DOI
contre source primaire). Rappelés ici pour mémoire, **non re-fetchés dans cette note** — inutile de
dupliquer un travail déjà fait par le projet.

| Essai | Population | Intervention | Critère | Résultat | GRADE | Récupérée | Source |
|---|---|---|---|---|---|---|---|
| CARDS (PMID 15325833) | DT2 40-75, prévention 1aire pure, ≥1 FDR, N=2838 | Atorva 10 mg | Composite dur | HR 0,63 (0,48-0,83) ; NNT ~27-32/3,9 ans ; **mortalité HR 0,73 p=0,059 NS** | élevé (CV) / faible (mortalité) | oui (dossier F-statine.md) | doi.org/10.1016/S0140-6736(04)16895-5 |
| HPS sous-groupe diabète prév. 1aire (PMID 12814710) | 2912 diab. sans maladie occlusive | Simva 40 mg | ÉVM dur | RRR 33 % (17-46), NNT ~22/5 ans | modéré-élevé | oui (dossier F-statine.md) | doi.org/10.1016/S0140-6736(03)13636-7 |
| CTT méta diabète 2008 (PMID 18191683) | 18 686 diabétiques, mixte 1re/2de prév. | méta IPD | ÉVM dur | RR 0,79 (0,72-0,86)/mmol/L | élevé | oui (dossier F-statine.md) | pubmed 18191683 |

### 1b. Sujet âgé/très âgé — population générale (prévention primaire ≥ 75 ans)

| # | Étude (PMID/DOI) | Population exacte | Diabétiques | Intervention | Critère | Résultat chiffré | GRADE | Récupérée | URL |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **CTT 2019** — méta IPD, 28 ECR (PMID 30712900) | 186 854 participants, 6 tranches d'âge ; **14 483 (8 %) ont > 75 ans**, mixte prév. 1aire/2de | Non isolés en sous-groupe propre | Statines, méta | ÉVM (dur) | Effet global RR 0,79/mmol/L ; **citation directe : « there is less direct evidence of benefit among patients older than 75 years who do not already have evidence of occlusive vascular disease »**. Le papier ne publie **pas** de RR chiffré isolé pour le sous-groupe « > 75 ans ET prévention primaire seule » (nombre d'événements insuffisant, texte confirmé). Trend global par âge non significatif (p=0,06). | faible pour ce sous-groupe (preuve indirecte, reconnue comme telle par les auteurs) | **oui** (texte intégral PMC + Lancet) | pubmed.ncbi.nlm.nih.gov/30712900 |
| 2 | **Gencer et al. 2020** — méta ECR, 29 essais statines+ézétimibe+anti-PCSK9 (PMID 33186535) | 244 090 participants, **21 442-21 492 (8,8 %) ≥ 75 ans**, mixte 1aire/2de | Non isolés | Statines/ézétimibe/PCSK9i | ÉVM (dur) | **Ensemble mixte 1aire+2de ≥75 ans : RR 0,74 (0,61-0,89) p=0,0019** ; statines seules RR 0,82 (0,73-0,91) ; mortalité CV RR 0,85 (0,74-0,98). **Sous-groupe PRÉVENTION PRIMAIRE SEULE ≥75 ans : ~8 % de réduction, NON significatif — RR ≈0,92 (0,73-1,16)**, et un résumé secondaire (AAFP) chiffre l'événement/an à 2,6 % (statine) vs 2,7 % (contrôle). | modéré (pool mixte, significatif) / **faible** (sous-groupe prévention primaire seule, NS) | **partiel** — chiffres du pool mixte confirmés par citation directe (abstract PubMed) ; le sous-groupe prévention-primaire-seule (RR ≈0,92) est **NON VÉRIFIÉ par citation directe du texte primaire** (accès payant Lancet), triangulé via 3 résumés secondaires concordants (AAFP, TCTMD, recherche croisée) | pubmed.ncbi.nlm.nih.gov/33186535 |
| 3 | **PROSPER** (PMID 12457784) | 5804, 70-82 ans, mixte risque/maladie établie | Non exclus, non isolé dans l'abstract | Pravastatine 40 mg, 3,2 ans | Composite dur | Global HR 0,85 (0,74-0,97) p=0,014 ; **sous-groupe prévention secondaire HR 0,78 (0,66-0,93) vs sous-groupe prévention PRIMAIRE HR 0,94 (0,77-1,15), NON significatif ; mortalité toutes causes du sous-groupe primaire non favorable (proche de 1)** | faible (sous-groupe 1aire, NS) | **partiel** — le résultat global et la mortalité coronaire (-24 %) confirmés par citation directe de l'abstract ; le sous-groupe 1aire (HR 0,94) confirmé par 2 sources secondaires concordantes, pas par citation directe du tableau primaire (paywall) | pubmed.ncbi.nlm.nih.gov/12457784 |
| 4 | **EWTOPIA 75** (PMID 31434507) | Japon, **≥ 75 ans**, LDL élevé, prévention 1aire STRICTE (86 % avec 1-2 FDR) | Non spécifié comme critère d'inclusion/exclusion | **Ézétimibe** 10 mg (pas une statine) vs soins usuels, ouvert | Composite dur | **HR 0,66 (0,50-0,86) p=0,002** — seul ECR positif dédié à la prévention primaire stricte ≥75 ans à ce jour, mais molécule différente (pas de statine), design ouvert (non aveugle) | modéré (ECR dédié à la tranche d'âge, mais autre molécule + design ouvert) | **oui** | pubmed.ncbi.nlm.nih.gov/31434507 |
| 5 | **StAREE** (NCT02099123) | 9971, Australie, **≥ 70 ans**, community-dwelling, **SANS ATCD CV, SANS DIABÈTE, SANS DÉMENCE** (exclusion explicite du diabète) | **EXCLUS par protocole** | Atorvastatine 40 mg vs placebo | Co-critères : survie sans handicap/démence ; ÉVM majeurs | **Essai TERMINÉ (recrutement clos 2023, suivi jusqu'à fin 2025) mais résultats principaux NON PUBLIÉS à ce jour (2026-07-26)** — seul un plan d'analyse statistique (medRxiv, févr. 2025) et des caractéristiques de base sont disponibles. Un sous-essai StAREE-HEART (biomarqueur cardiaque) a publié son protocole/baseline en 2025 mais pas de résultat d'efficacité. | — (pas de résultat) | **oui** (protocole/SAP/baseline confirmés, résultats confirmés absents) | pubmed.ncbi.nlm.nih.gov/39548016 · medrxiv.org/content/10.1101/2025.02.24.25321974v1 |
| 6 | **PREVENTABLE** (NCT04262206) | 20 000 prévus, USA, **≥ 75 ans**, sans maladie CV clinique, sans insuffisance cardiaque récente, sans démence, sans ADL dépendante. **Le diabète n'est PAS un critère d'exclusion** (à la différence de StAREE) | **PROBABLEMENT INCLUS** (absence d'exclusion identifiée sur les critères disponibles) | Atorvastatine 40 mg vs placebo | Survie sans démence/handicap persistant (1aire) ; ÉVM incidents (secondaire) | **Essai EN COURS, date de fin estimée 31/12/2026 — aucun résultat publié à ce jour.** | — (pas de résultat) | **oui** (statut confirmé) | preventabletrial.org · clinicaltrials.gov/study/NCT04262206 |

### 1c. Sujet âgé/très âgé — spécifiquement diabétique

| # | Étude (PMID/DOI) | Population exacte | Design | Intervention | Critère | Résultat chiffré | GRADE | Récupérée | URL |
|---|---|---|---|---|---|---|---|---|---|
| 7 | **Ramos et al. 2018, BMJ** (PMID 30185425) | Espagne (SIDIAP, Catalogne), **46 864 sujets ≥ 75 ans SANS maladie CV établie, stratifiés diabétiques (T2D) vs non-diabétiques**, 2006-15, âge moyen 77 ans | Cohorte rétrospective, score de propension | Nouveaux utilisateurs de statine vs non-utilisateurs | Maladie CV athéromateuse + mortalité toutes causes | **Non-diabétiques 75-84 ans : HR 0,94 (0,86-1,04) ASCVD, HR 0,98 (0,91-1,05) mortalité — NON significatif.** Non-diabétiques ≥85 : HR 0,93 (0,82-1,06) / 0,97 (0,90-1,05) — NS. **Diabétiques 75-84 ans : HR 0,76 (0,65-0,89) ASCVD, HR 0,84 (0,75-0,94) mortalité — SIGNIFICATIF, effet net plus marqué que chez le non-diabétique du même âge.** Diabétiques ≥85 ans : HR 0,82 (0,53-1,26) / 1,05 (0,86-1,28) — effet disparu. Citation verbatim des auteurs : **« This effect decreased after age 85 years and disappeared in nonagenarians. »** | **faible** (observationnel, biais d'indication/utilisateur sain probable malgré l'ajustement) | **oui** (abstract intégral, tableau de résultats) | pubmed.ncbi.nlm.nih.gov/30185425 |
| 8 | **Xu/Hong Kong 2024, Annals Intern Med** (PMID 38801776, DOI 10.7326/M24-0004) | Hong Kong, dossiers de santé publics, **75-84 ans (« old ») et ≥ 85 ans (« very old »)**, sans maladie CV établie ; sous-groupe « équivalents coronariens » incluant le diabète analysé séparément (41 884 et 9457 sujets) | *Target trial emulation* (observationnel) | Statine vs non-initiation | ÉVM incidents ; myopathie ; dysfonction hépatique | Réduction de risque standardisée à 5 ans : 75-84 ans ITT 1,20 % (0,57-1,82), per-protocol 5,00 % (1,11-8,89) ; ≥ 85 ans ITT 4,44 % (1,40-7,48), PP 12,50 % (4,33-20,66). **Pas de sur-risque significatif de myopathie/dysfonction hépatique dans les deux tranches.** Conclusion verbatim : « Reduction for CVDs after statin therapy were seen in patients aged 75 years or older without increasing risks for severe adverse effects. » | faible (observationnel, malgré le design en émulation d'essai cible qui réduit — sans l'éliminer — le biais de confusion) | **oui** | pubmed.ncbi.nlm.nih.gov/38801776 |
| 9 | **Lavon et al. 2026, JAGS** (PMID 41793188, DOI 10.1111/jgs.70375) | **≥ 80 ans**, N=15 745 (8413 utilisateurs de statine), âge moyen 84,5 ans, prévention primaire, cohorte rétrospective comparative | Observationnel rétrospective | Statine vs non-utilisateurs | Mortalité, événements coronariens | Statine associée à **-31 % de mortalité, -20 % de nouveaux événements coronariens sur 4 ans en moyenne** (chiffres de titre confirmés par 2 sources secondaires concordantes — omnicuris, recherche croisée) | **faible** — accès à l'article complet impossible (paywall, HTTP 402) ; sous-groupe diabète non confirmé ; **risque de biais d'utilisateur sain élevé et NON discuté par les résumés disponibles** | **NON VÉRIFIÉ (partiel)** — titre, N, âge moyen et chiffres de titre confirmés par 2 résumés secondaires concordants ; méthode exacte, ajustement, IC et sous-groupe diabète non confirmés (article non accessible) | pubmed.ncbi.nlm.nih.gov/41793188 · doi.org/10.1111/jgs.70375 |
| 10 | **SFE/SFD/NSFA/SFC 2026** (PMID 41651737 — déjà dans le nœud, texte complet relu aujourd'hui) | Reco française, section 8.7 « People over 75 years of age » | Consensus d'experts (pas un essai) | — | — | **« Lipid-lowering therapy may be considered for primary cardiovascular prevention in subjects aged >75 years with high or very high cardiovascular risk, taking life expectancy into account » — Classe IIb, Niveau B.** Pas de règle spécifique croisant diabète × âge > 75 (les deux grilles — diabète, et > 75 ans — s'appliquent indépendamment, à combiner par jugement clinique). | recommandation (classe IIb = faible/optionnelle ; niveau B = 1 ECR ou plusieurs études non randomisées de grande taille) | **oui** (PDF officiel intégral récupéré et lu aujourd'hui) | doi.org/10.1016/j.diabet.2026.101725 |

### 1d. Déprescription / arrêt de statine

| # | Étude (PMID/DOI) | Population exacte | Design | Comparaison | Critère | Résultat chiffré | GRADE | Récupérée | URL |
|---|---|---|---|---|---|---|---|---|---|
| 11 | **Kutner et al. 2015, JAMA Intern Med** (PMID 25798575) — **seul ECR jamais mené sur la question** | N=381, âge moyen 74,1 ans (± 11,6), **espérance de vie 1 mois-1 an**, statine ≥ 3 mois pour prévention 1aire OU 2de (mixte, non distingué), 48,8 % cancer, 22 % troubles cognitifs | ECR pragmatique, ouvert, multicentrique, **non-infériorité** | Arrêt (n=189) vs poursuite (n=192) | Mortalité à 60 jours (1aire) ; survie ; qualité de vie ; événements CV ; coût | **Mortalité à 60 j : 23,8 % (arrêt) vs 20,3 % (poursuite), IC90 -3,5 % à +10,5 %, p=0,36 — « not significantly different » selon les auteurs.** Qualité de vie McGill significativement meilleure à l'arrêt (7,11 vs 6,85, p=0,04). Économie ~716 $/patient. **Nuance (Peixoto 2024, revue systématique) : cet essai « failed to meet its non-inferiority margin due to an absolute increase in 60-day mortality of 3,5 % »** — lecture plus prudente que la conclusion des auteurs eux-mêmes. | **modéré pour sa question propre** (ECR, mais petit effectif, population fin de vie très spécifique — PAS transposable telle quelle à un DT2 de 82 ans par ailleurs en état stable) | **oui** | pubmed.ncbi.nlm.nih.gov/25798575 |
| 12 | **Giral et al. 2019, Eur Heart J** (PMID 31362307) — **population la plus proche de la question posée** | France, bases nationales, **N=120 173, tous ayant eu 75 ans en 2012-2014, SANS maladie CV, adhérents ≥ 2 ans à une statine en prévention PRIMAIRE** ; 17 204 ont arrêté ; suivi moyen 2,4 ans | Cohorte observationnelle nationale | Arrêt vs poursuite | Hospitalisation pour événement CV | **HR 1,33 (1,18-1,50) — +33 % de risque d'hospitalisation pour événement CV après arrêt.** Coronaire : HR 1,46 (1,21-1,75). Cérébrovasculaire : HR 1,26 (1,05-1,51). Citation verbatim : « Statin discontinuation was associated with a 33% increased risk of admission for cardiovascular event in 75-year-old primary prevention patients. […] Future studies, including randomized studies, are needed. » — **les auteurs eux-mêmes appellent à un ECR, reconnaissant la limite observationnelle.** | **faible** (observationnel — biais d'indication plausible : les patients qui arrêtent en pratique réelle diffèrent probablement de ceux qui poursuivent) | **oui** | pubmed.ncbi.nlm.nih.gov/31362307 |
| 13 | **Peixoto et al. 2024, JAGS** (PMID 39051828) — revue systématique | Tous âges ≥ 18 ans, **36 études, > 1,7 million de patients, dont UNE SEULE randomisée (Kutner, ligne 11) — les 35 autres observationnelles** | Revue systématique (RCT + cohortes + cas-témoins) | Arrêt vs poursuite | Mortalité toutes causes, mortalité CV, événements CV, qualité de vie | **Chez les patients PAS en fin de vie : arrêt associé à ~2× la mortalité toutes causes, +63 % de mortalité CV, +31 % d'événements CV** (données observationnelles agrégées). Éditorial concomitant (Odden & Dave, JAGS 2024) : « Many studies, but little certainty about the effects of statin discontinuation on outcomes » — **titre de l'éditorial lui-même**, qui souligne le manque de certitude malgré le volume de littérature. | **faible** (quasi-exclusivement observationnel, hétérogène ; l'ampleur même de l'effet — mortalité quasi doublée — est physiologiquement suspecte d'un biais d'indication massif) | **oui** | pubmed.ncbi.nlm.nih.gov/39051828 |
| 14 | **Aponte Ribero et al. 2025/2026, Eur J Clin Invest** (PMID 41028982, DOI 10.1111/eci.70126) — analyse secondaire de la cohorte OPERAM | Suisse/Europe, **≥ 70 ans, multimorbides (≥3 pathologies), polymédiqués (≥5 médicaments), âge moyen 78,5 ans ; 73 % en prévention SECONDAIRE, 27 % en prévention primaire (mixte, non isolé pour le sous-groupe primaire)** | *Target trial emulation* (clone-censor-weight) sur cohorte prospective | Arrêt vs poursuite, 3 essais cibles émulés | Critère composite (ÉVM + mortalité toutes causes) à 12 mois ; mortalité non-CV | **Critère composite : 27 % (arrêt) vs 18 % (poursuite), HR 1,53 (1,14-2,06).** ÉVM seuls : HR 1,36 (0,86-2,14) — NS. **Mortalité NON cardiovasculaire : HR 1,56 (1,08-2,27) — chiffre que les auteurs qualifient eux-mêmes de « clinically and pathophysiologically implausible, indicating probable confounding bias ».** Conclusion verbatim : « only RCTs can clarify the safety of statin discontinuation in multimorbid older adults. » | **très faible à faible** — méthode plus robuste que la cohorte brute (émulation d'essai cible), mais **les auteurs invalident eux-mêmes leur signal le plus fort** (mortalité non-CV) comme probablement confondu | **oui** | pmc.ncbi.nlm.nih.gov/articles/PMC12817241 |
| 15 | **SFE/SFD/NSFA/SFC 2026**, Table R5 « People over 75 years of age » | Reco française | Consensus (s'appuie explicitement sur Giral 2019, ligne 12) | — | — | **« It is not recommended to discontinue ongoing statin therapy in individuals over 75 years of age for primary cardiovascular prevention, in the absence of factors that would challenge the risk/benefit ratio » — Classe III, Niveau B.** | recommandation (classe III = déconseillé ; niveau B) | **oui** (PDF intégral lu aujourd'hui) | doi.org/10.1016/j.diabet.2026.101725 |

---

## 2. Le chiffre « ~2,5 ans » du nœud : vérifié, et son origine est plus fragile que le nœud ne le montre

Le nœud (`statine.yaml:170-174`) affiche : *« délai avant bénéfice estimé ~2,5 ans »* dans l'alerte
> 75 ans, sans le sourcer explicitement à cet endroit (le dossier `F-statine.md` §Sous-dossier 4 le
mentionne aussi sans le rattacher à une référence précise — écart de traçabilité repéré aujourd'hui).

**Origine retrouvée avec certitude** : le PDF officiel de la reco SFE/SFD/NSFA/SFC 2026 (§8.7, lu
intégralement aujourd'hui) écrit, mot pour mot :

> « A meta-analysis on subjects aged 50 to 75 years showed that, in primary prevention, statins are
> used for at least 2.5 years to prevent a major cardiovascular event and thus that life-expectancy
> must be at least 2.5 years to introduce a statin in primary prevention [ref. 222]. »

La référence [222] du PDF est : **Yourman LC, Cenzer IS, Boscardin WJ, et al. « Evaluation of time to
benefit for primary prevention of cardiovascular events with statins in adults aged 50 to 75 years: a
meta-analysis. » JAMA Intern Med. 2021;181(2):179-85 (PMID 33196766)** — récupérée et confirmée
aujourd'hui (8 essais, 65 383 participants, âge moyen des essais 55-69 ans) : *« Treating 100 adults
(aged 50-75 years) […] with a statin for 2.5 years prevented 1 MACE in 1 adult. »*

**Le point critique** : cette méta-analyse porte explicitement sur une population **50-75 ans**, pas
sur les 75 ans et plus. Le chiffre « 2,5 ans » n'est donc **pas** une mesure du délai avant bénéfice
*chez le sujet très âgé* — c'est une extrapolation, assumée comme telle par la reco française elle-même
qui, dans la phrase suivante immédiate, reconnaît : *« there is insufficient evidence to recommend LDL
targets based on cardiovascular risk after the age of 75 »* et que *« Randomized trials are underway to
determine the benefit […] in subjects over 75 years of age »* (= StAREE, PREVENTABLE — lignes 5-6 de la
table). Il n'existe, à ce jour, **aucune étude de temps-avant-bénéfice dédiée à la tranche ≥ 75/80 ans**
— *a fortiori* aucune chez le diabétique âgé. L'outil peut garder le chiffre « 2,5 ans » (il est réel et
correctement transcrit depuis la reco française), mais devrait préciser sa provenance et sa limite
(population 50-75 ans, extrapolée) plutôt que de le présenter comme une mesure directe du sujet très
âgé — ce que le texte actuel de l'alerte ne fait pas.

---

## 3. Ce qui peut être honnêtement affiché à un généraliste devant un DT2 de 82 ans

Trois formulations, de la plus prudente à la plus affirmative — le référent tranchera.

### Formulation A — la plus prudente

> « Chez un patient diabétique de 82 ans sans antécédent cardiovasculaire, la preuve directe d'un
> bénéfice de l'introduction d'une statine est faible : aucun essai randomisé dédié à cette tranche
> d'âge n'est disponible (StAREE exclut les diabétiques ; PREVENTABLE est en cours), et les rares
> analyses en sous-groupe restreintes à la prévention primaire chez les plus de 75 ans (PROSPER,
> Gencer 2020) ne montrent pas de bénéfice statistiquement significatif une fois isolées de la
> prévention secondaire. La seule donnée spécifiquement diabétique (Ramos et al. 2018) est
> observationnelle et de niveau de preuve faible. Décision individualisée : espérance de vie,
> fragilité, préférence du patient — sans automatisme dans un sens ou dans l'autre. »

### Formulation B — intermédiaire (alignée sur la position officielle 2026)

> « À 82 ans, en prévention primaire, l'introduction d'une statine est *raisonnable si le risque
> cardiovasculaire est haut ou très haut* (reco française SFE/SFD/NSFA/SFC 2026, recommandation de
> niveau optionnel — classe IIb), en tenant compte de l'espérance de vie. Chez le diabétique
> spécifiquement, la seule étude dédiée à cette tranche d'âge (cohorte espagnole, Ramos 2018) montre
> un effet plus marqué que chez le non-diabétique du même âge (réduction du risque cardiovasculaire de
> ~24 % et de la mortalité de ~16 %), mais il s'agit d'une preuve de niveau faible (observationnelle),
> à mettre en balance avec l'absence de bénéfice net démontré chez les plus de 85 ans dans la même
> étude. »

### Formulation C — la plus affirmative

> « Un DT2 de 82 ans en bon état général (non grabataire, sans démence, espérance de vie plausible
> > 5 ans) relève encore de la tranche « 75-84 ans » où le signal disponible — bien que de niveau de
> preuve faible, faute d'ECR dédié — est en faveur du traitement, pas contre : chez le diabétique de
> cet âge, Ramos et al. rapportent une réduction significative du risque cardiovasculaire (-24 %) ET
> de la mortalité toutes causes (-16 %), un effet plus net que chez le non-diabétique du même âge (non
> significatif). Ce signal disparaît après 85 ans. En l'absence de contre-indication ni de fragilité
> marquée, il n'y a pas de raison EBM de s'abstenir d'introduire une statine à 82 ans chez un
> diabétique à risque — la prudence porte sur le très grand âge (≥ 85-90 ans) et la fragilité, pas sur
> 82 ans en tant que tel. »

**Remarque transversale aux trois formulations** : aucune ne doit revendiquer un bénéfice de mortalité
« démontré » en prévention primaire du DT2 de façon générale (cf. `statine.yaml` §5d, message interdit
déjà acté) — le signal de mortalité qui apparaît en C est spécifique à l'étude observationnelle Ramos
2018 (75-84 ans, diabétiques), pas une extrapolation de CARDS/HPS.

---

## 4. La question de la déprescription, traitée à part

**Ce qu'on sait.** Un seul essai randomisé a jamais testé l'arrêt d'une statine : Kutner et al. 2015
(ligne 11), et sa population — espérance de vie de 1 mois à 1 an — n'est **pas** celle d'un DT2 de
82 ans par ailleurs stable. Sur cette population de fin de vie, l'arrêt n'augmente pas significativement
la mortalité à 60 jours et améliore la qualité de vie ; une relecture plus critique (Peixoto 2024) note
que l'essai n'atteint pas franchement sa marge de non-infériorité pré-spécifiée — donc même sur sa
propre question, la conclusion « sûr » mérite une nuance.

Toutes les autres données sur la déprescription sont **observationnelles**, et convergent dans la même
direction — l'arrêt est associé à un sur-risque :
- Giral et al. 2019 (population la plus proche de la question : 120 173 Français de 75 ans, prévention
  primaire, adhérents ≥ 2 ans) : **+33 % de risque d'hospitalisation CV après arrêt** (HR 1,33).
- Peixoto et al. 2024 (revue systématique, 36 études, 1,7 M patients, 35 études sur 36 observationnelles) :
  arrêt associé à un quasi-doublement de la mortalité toutes causes hors fin de vie.
- Aponte Ribero et al. 2025 (émulation d'essai cible, cohorte OPERAM, multimorbides) : signal similaire,
  mais **les auteurs eux-mêmes qualifient leur résultat le plus fort de « cliniquement et
  physiopathologiquement implausible », indiquant un biais de confusion probable**, et concluent que
  « seuls des ECR pourront clarifier la sécurité de l'arrêt ».

**Ce qu'on ne sait pas — et pourquoi le signal est fragile.** Aucune de ces études n'est randomisée.
Le biais d'indication (confusion par indication inversée) y est particulièrement plausible : en
pratique réelle, un patient dont l'état se dégrade est plus susceptible de voir sa statine arrêtée
(par lui-même, un soignant, ou dans le cadre d'une réévaluation de fin de vie) — ce qui produirait
exactly le signal observé (arrêt associé à plus d'événements/de décès) même si la statine elle-même
n'y était pour rien. C'est très exactement ce que l'étude méthodologiquement la plus rigoureuse du lot
(Aponte Ribero, émulation d'essai cible) documente en constatant un effet « implausible » sur la
mortalité non cardiovasculaire — un décès non-CV ne peut pas être *causé* par l'arrêt d'une statine,
donc ce signal-là ne peut être qu'un artefact de confusion résiduelle, ce qui jette un doute légitime
sur la magnitude (pas nécessairement la direction) du reste des résultats.

**Position officielle française 2026** : ne pas arrêter une statine en cours chez un patient de plus
de 75 ans en prévention primaire, en l'absence de facteur remettant en cause la balance
bénéfice/risque (Classe III, Niveau B — reco SFE/SFD/NSFA/SFC 2026, appuyée explicitement sur Giral
2019).

**Verdict honnête** : il n'existe **aucun essai randomisé** testant la déprescription chez un patient
de type « DT2 de 82 ans, stable, en prévention primaire, sans maladie limitant le pronostic vital ».
Toutes les données disponibles pour cette population précise sont observationnelles et orientées vers
un signal de risque à l'arrêt, mais ce signal est probablement en partie — sans qu'on puisse quantifier
la part exacte — gonflé par la confusion par indication. Le seul ECR disponible (Kutner) répond à une
question différente (fin de vie) et conclut, avec une réserve méthodologique, à l'absence de sur-risque
à 60 jours. Il n'y a donc pas de fondement EBM solide pour déprescrire une statine chez un DT2 de 82 ans
stable en prévention primaire ; il y a, à l'inverse, un signal (de qualité modeste) qui déconseille de
le faire hors changement de situation clinique (fragilité soudaine, espérance de vie devenue courte,
intolérance).

---

## 5. Prompt OpenEvidence prêt à coller

À exécuter par le référent lui-même dans OpenEvidence (débroussaillage complémentaire — jamais une
source primaire en soi, cf. `00-global.md`). Cadré sur essais primaires et recommandations
internationales indexées uniquement, conformément à la règle du projet.

```
Question : Chez un patient diabétique de type 2 de 82 ans, sans maladie cardiovasculaire établie
(prévention primaire), quel est le bénéfice démontré par ESSAI RANDOMISÉ CONTRÔLÉ (ECR) de
l'introduction d'une statine ?

Pour chaque essai ou méta-analyse d'essais que tu cites, donne obligatoirement :
1. La population EXACTE (tranche d'âge réellement incluse, % de diabétiques inclus ou exclusion
   explicite des diabétiques, prévention primaire ou secondaire).
2. L'intervention (molécule, dose, durée de suivi médiane).
3. Le critère de jugement, en précisant s'il s'agit d'un critère DUR (mortalité totale, mortalité
   cardiovasculaire, IDM, AVC) ou d'un critère de SUBSTITUTION (LDL).
4. Le résultat CHIFFRÉ en effet ABSOLU (réduction de risque absolu, NNT) et pas seulement en
   risque relatif, avec intervalle de confiance et horizon temporel.
5. Le PMID ou DOI exact.

Concentre-toi sur ces points précis :
- Les essais StAREE (STAtin therapy for Reducing Events in the Elderly, NCT02099123) et
  PREVENTABLE (NCT04262206) : sont-ils terminés ? Leurs résultats principaux ont-ils été publiés
  à ce jour ? Si oui, donne les chiffres exacts et le PMID/DOI. Si non, dis-le explicitement plutôt
  que de citer un résultat intermédiaire ou un protocole comme s'il s'agissait d'un résultat.
- Dans la méta-analyse Cholesterol Treatment Trialists' Collaboration (Lancet 2019, PMID 30712900)
  et dans celle de Gencer et al. (Lancet 2020, PMID 33186535) : le bénéfice du sous-groupe
  « prévention primaire ET ≥ 75 ans » est-il statistiquement significatif une fois isolé de la
  prévention secondaire ? Donne le chiffre exact si publié.
- Dans l'essai PROSPER (pravastatine, 70-82 ans) : quel est le résultat du sous-groupe prévention
  primaire spécifiquement (pas le résultat global de l'essai, qui mélange prévention primaire et
  secondaire) ?
- Existe-t-il un essai randomisé, ou une méta-analyse d'essais randomisés, qui rapporte un résultat
  SPÉCIFIQUEMENT chez des patients diabétiques de type 2 âgés de 75 à 90 ans en prévention primaire ?
  Si la réponse est non, écris explicitement « aucun ECR trouvé » — NE SUBSTITUE PAS une étude
  observationnelle à la place sans le signaler clairement comme telle et sans la présenter comme un
  niveau de preuve équivalent à un ECR.
- Recommandations internationales INDEXÉES (ADA Standards of Care, ESC/EAS, KDIGO) : quel seuil
  d'âge ou d'espérance de vie utilisent-elles pour nuancer ou déconseiller l'introduction d'une
  statine en prévention primaire chez le sujet âgé ?

Question secondaire, déprescription : existe-t-il un essai randomisé contrôlé testant l'ARRÊT d'une
statine chez un patient âgé (≥ 75 ans) EN BON ÉTAT GÉNÉRAL, en prévention primaire, PAS en fin de
vie ? Si la réponse est non, dis-le explicitement — ne substitue pas une étude observationnelle de
cohorte à la place d'un ECR sans le signaler comme telle.

Consigne impérative : si tu ne trouves pas d'essai randomisé répondant précisément à une question,
écris explicitement « aucun ECR trouvé pour cette population/ce critère » plutôt que de proposer une
étude observationnelle, une extrapolation ou un avis d'expert en la présentant comme un niveau de
preuve équivalent. Signale toute étude observationnelle comme telle (type de cohorte, biais
d'indication possible), sans lui faire porter le poids d'un essai randomisé.

Ne cite ni ne résume aucune source HAS, SFD, CMG, Prescrire, Médicalement Geek/DragiWebdo, Minerva
ou ebmfrance : limite-toi aux essais primaires et aux recommandations internationales indexées
(ADA/EASD, ESC/EAS, KDIGO).
```

---

## 6. Limites de cette note

- Deux résultats chiffrés (Gencer 2020, sous-groupe prévention primaire seule ≥75 ans, RR ≈0,92 ;
  PROSPER, sous-groupe prévention primaire, HR 0,94) n'ont pas pu être confirmés par citation directe
  du texte primaire (accès payant Lancet/PROSPER) — seulement par triangulation de résumés secondaires
  concordants (2-3 sources indépendantes par chiffre). Marqués `NON VÉRIFIÉ (partiel)` dans la table.
  À reconfirmer contre le texte primaire (ou son tableau complet) avant tout encodage.
- Lavon et al. 2026 (JAGS) n'a pas pu être ouvert en texte intégral (paywall, HTTP 402) : titre, N, âge
  moyen et chiffres de titre confirmés par 2 résumés secondaires concordants seulement. Sous-groupe
  diabète non confirmé. À traiter comme `NON VÉRIFIÉ` tant que l'article complet n'est pas obtenu.
  Risque de biais d'utilisateur sain élevé, non discuté par les résumés disponibles — motif de
  prudence supplémentaire avant toute utilisation dans le nœud.
- StAREE/PREVENTABLE : statut de « en cours, sans résultat » vérifié aujourd'hui par recherche web
  (pas d'accès à un registre interne) — à re-vérifier périodiquement en veille, ces deux essais
  peuvent publier à tout moment (StAREE avait un suivi prévu jusqu'à fin 2025).
- Le PDF de la reco SFE/SFD/NSFA/SFC 2026 a été lu intégralement (25 pages, y compris la liste de
  références complète) — c'est la première fois que ce document est consulté en texte intégral par le
  projet (jusqu'ici cité via son PMID et son résumé de position dans `statine.yaml`) ; les tables R1-R5
  (recommandations classées par classe/niveau) n'étaient pas dans le dossier existant et contiennent
  plusieurs recommandations directement actionnables (§8.7, Table R5) non reprises dans le nœud actuel.
- Cette note ne tranche aucun arbitrage clinique et ne propose aucune modification de `statine.yaml` —
  elle documente la preuve pour que le référent, puis une passe red-team, décident de la suite (rester
  en alerte informative, ajouter un critère d'espérance de vie proche du nœud A/E, nuancer le libellé
  du chiffre « 2,5 ans », etc.).
