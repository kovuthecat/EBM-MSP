# Red-team (agent B) — statine chez le DT2 très âgé : initiation vs déprescription

Passe indépendante attaquant conjointement `preuve-statine-sujet-tres-age.md` (agent A, collecte du
2026-07-26) et `OE-statine-sujet-tres-age.md` (OpenEvidence, même date). Méthode : rouverture directe des
fiches PubMed/JAMA/Lancet/BMJ/JAGS et du PDF officiel de la reco SFE/SFD/NSFA/SFC 2026, PDF lu en pages
natives (pas de résumé de résumé) partout où l'accès n'était pas payant. Conformément à
`docs/decision/00-global.md` § Garde-fous : aucun `[À VÉRIFIER]` n'est levé sur une source secondaire
seule.

**Accès obtenus** : PubMed (CARDS, PROSPER, CTT 2019, Gencer 2020, Ramos 2018, Lavon 2026, CARDS
sous-groupe 65-75, Savarese 2013, Giral 2019, Kutner 2015, Aponte Ribero 2025, Xu/Hong Kong 2024, Yourman
2021), protocole STAREE en texte intégral (PMC), PDF intégral de l'evidence report USPSTF 2022 (Chou et
al., JAMA 2022;328(8):754-771) et de la recommendation statement (JAMA 2022;328(8):746-753), PDF intégral
de la reco SFE/SFD/NSFA/SFC 2026 (25 pages, y compris bibliographie numérotée jusqu'à 240).
**Accès bloqués** : Lancet (PROSPER texte intégral, CTT 2019 texte intégral, Gencer 2020 texte intégral —
403/paywall systématique), BMJ (Ramos 2018 texte intégral direct — 403, contourné partiellement par une
synthèse secondaire du Methods), ACC ten-points (bloqué par pare-feu ACC), Peixoto/EWTOPIA75 PubMed
(reCAPTCHA, contournés par recherche croisée).

---

## Findings

### HAUTE

**H1 — OpenEvidence, B1 (Kutner 2015) : chiffre de qualité de vie faux.**
- **Source** : OE seule (l'agent A a le bon chiffre au même endroit de son tableau, ligne 11).
- **Affirmé (OE)** : « Qualité de vie meilleure à l'arrêt (7,07 vs 6,74 ; p = 0,03). »
- **Ce que dit la publication** : Kutner JS et al., *JAMA Intern Med* 2015;175(5):691-700 (PMID
  25798575) — score de qualité de vie McGill : **7,11 (arrêt) vs 6,85 (poursuite), p = 0,04**. Vérifié
  par lecture directe de l'abstract PubMed. Ces chiffres correspondent exactement à ceux déjà rapportés
  par l'agent A dans son tableau (ligne 11) : « Qualité de vie McGill significativement meilleure à
  l'arrêt (7,11 vs 6,85, p=0,04) ».
- **Correction** : remplacer 7,07/6,74/p=0,03 par **7,11/6,85/p=0,04** partout où OE serait cité pour ce
  point. La conclusion qualitative (« meilleure qualité de vie à l'arrêt ») reste correcte ; c'est le
  chiffre qui est faux, pas le sens.

---

### MOYENNE

**M1 — Agent A ET OpenEvidence, PROSPER sous-groupe prévention primaire : intervalle de confiance
légèrement faux, sur les deux passes (résout la case `NON VÉRIFIÉ (partiel)`).**
- **Source** : les deux, avec le même chiffre.
- **Affirmé** : agent A (ligne 3 du tableau 1b) — « sous-groupe prévention PRIMAIRE HR 0,94
  (0,77-1,15), NON significatif ». OE (A2) — « composite NON significatif — HR 0,94 (0,77-1,15) ».
- **Ce que dit la publication** : c'est précisément le point que la mission demandait de trancher.
  L'USPSTF 2022 (*JAMA* 2022;328(8):746-753, doi:10.1001/jama.2022.13044 — cité par OE elle-même comme
  source de ce chiffre) écrit, vérifié par lecture directe à trois reprises convergentes (texte intégral
  JAMA, page recommandation de l'USPSTF, synthèse croisée indépendante) : *« The primary prevention data
  from PROSPER found no decrease in all-cause mortality (RR, 1.07 [95% CI, 0.86 to 1.35]), risk of
  stroke (RR, 1.03 [95% CI, 0.73 to 1.45]), or in a composite cardiovascular outcome (**RR, 0.94 [95% CI,
  0.78 to 1.14]**) »*. C'est un **RR**, pas un HR, et l'intervalle exact est **0,78 à 1,14**, pas
  0,77-1,15. Le point estimé (0,94) et la conclusion (non significatif) sont corrects dans les deux
  passes ; seules les deux bornes sont légèrement fausses, de façon identique dans les deux passes — signe
  probable d'une source secondaire commune (ni l'une ni l'autre n'a donc, en réalité, lu le chiffre
  depuis l'USPSTF elle-même malgré la citation).
  URL vérifiées : https://jamanetwork.com/journals/jama/fullarticle/2795521 ·
  https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/statin-use-in-adults-preventive-medication
  (section justifiant le I-statement pour les ≥ 76 ans).
- **Correction** : le sous-groupe prévention primaire de PROSPER a un **RR** de 0,94 (IC95 % **0,78 à
  1,14**) pour le critère composite et un RR de **1,07 (0,86-1,35)** pour la mortalité totale (ce dernier
  chiffre, lui, est confirmé exact dans les deux passes ET retrouvé indépendamment dans le forest plot de
  l'evidence report USPSTF, Chou et al. *JAMA* 2022;328(8):754-771, Figure 3, ligne « PROSPER,
  primary prevention population only » : 139/1585 vs 134/1653, RR 1,07 [0,86-1,35]). **Conséquence
  positive** : la case `NON VÉRIFIÉ (partiel)` de l'agent A sur ce sous-groupe est désormais **résolue** —
  la non-significativité est confirmée par une source primaire indépendante (l'evidence report USPSTF,
  qui a eu accès aux données de sous-groupe séparées de PROSPER, contrairement à l'article Lancet 2002
  seul). Non-matérialité : la borne corrigée ne change rien à l'interprétation clinique (toujours non
  significatif, toujours proche de 1).

**M2 — Agent A, Formulation C : surclassement du niveau de preuve.**
- **Source** : agent A seule.
- **Affirmé** : « il n'y a pas de raison EBM de s'abstenir d'introduire une statine à 82 ans chez un
  diabétique à risque » (Formulation C, § 3).
- **Ce que dit le propre dossier de l'agent A** : dans le même document, Ramos et al. 2018 — la
  quasi-totalité du fondement de cette phrase — est coté **GRADE faible** avec la mention explicite
  « biais d'indication/utilisateur sain probable malgré l'ajustement » (tableau 1c, ligne 7). Aucun essai
  randomisé disponible (StAREE exclut les diabétiques ; PREVENTABLE en cours ; CTT 2019/Gencer
  2020/PROSPER ne publient pas — ou publient non significatif pour — le sous-groupe prévention primaire
  seule ≥ 75 ans). Affirmer qu'il n'y a « pas de raison EBM de s'abstenir » à partir d'une seule étude
  observationnelle faible, en l'absence de toute donnée randomisée convergente, est un habillage plus
  affirmatif que ne le permet le niveau de preuve réel — exactement le type de *spin* que la vérification
  bi-agents est censée intercepter (`00-global.md`, couche 1).
- **Correction** : reformuler en « aucune raison de s'abstenir *par principe/automatisme* » (ce que
  disent en réalité la reco française IIb/B et le corps du texte de l'agent A ailleurs), sans la
  formule absolue « pas de raison EBM », qui laisse entendre un niveau de preuve que le dossier
  lui-même ne revendique pas.

**M3 — Agent A, collecte incomplète sur la déprescription : deux essais randomisés en cours absents.**
- **Source** : absence chez l'agent A, présence chez OE (B2) — cas rare où OE comble un trou de
  l'agent plutôt que l'inverse.
- **Affirmé** : le § 4 et le tableau 1d de l'agent A concluent « il n'existe **aucun essai randomisé**
  testant la déprescription » chez un patient âgé stable en prévention primaire — vrai *aujourd'hui*,
  mais sans mentionner que deux essais randomisés sont **en cours** sur exactement cette question.
- **Ce que disent les publications** : **STREAM** (Aebi PS et al., protocole *BMJ Open*
  2025;15(5):e093833, PMID 40409969 — confirmé via PMC12104904) : essai de non-infériorité, Suisse/
  Bordeaux (France)/Leiden (Pays-Bas), n=1800, adultes multimorbides sans maladie CV, recrutement en
  cours, fin estimée novembre 2026. **SITE** (Bonnet F et al., protocole *Trials* 2020;21(1):342,
  NCT02547883) : essai français, arrêt vs poursuite chez les ≥ 75 ans en prévention primaire, également
  en cours. OE cite ces deux essais et conclut correctement « aucun résultat publié » — vérifié exact.
- **Correction** : ajouter STREAM et SITE au tableau 1d de l'agent A (statut « en cours », comme
  StAREE/PREVENTABLE côté initiation) avant tout encodage ou toute clôture du dossier — ce sont les deux
  essais qui, une fois publiés, répondront directement à la question du référent sur la déprescription.

**M4 — Agent A, Xu et al. 2024 (Hong Kong) : sous-effectif non confirmé (à vérifier, pas contredit).**
- **Source** : agent A seule ; ni confirmation ni contradiction obtenue.
- **Affirmé** : « sous-groupe "équivalents coronariens" incluant le diabète analysé séparément
  (41 884 et 9457 sujets) ».
- **Ce que dit la publication** : Xu W et al., *Ann Intern Med* 2024;177(6):701-710 (DOI
  10.7326/M24-0004, PMID 38801776) — confirmé pour les résultats principaux cités par l'agent A (RRA à
  5 ans, ITT/PP, pour 75-84 ans et ≥ 85 ans : chiffres exacts, vérifiés mot pour mot). Mais les effectifs
  des bras d'âge principaux donnés par les résumés disponibles sont **42 680** (75-84 ans) et **5 390**
  (≥ 85 ans) « matched person-trials » — différents des 41 884/9 457 attribués par l'agent A à un
  sous-groupe « équivalents coronariens incluant le diabète ». Il est possible que ce soit deux
  sous-populations distinctes de l'article (l'agent A parle explicitement d'un sous-groupe différent des
  bras d'âge principaux) — je n'ai pas pu obtenir le texte intégral pour trancher.
- **Correction** : marquer ce chiffre spécifique `[À VÉRIFIER]` avant encodage — pas une contradiction
  démontrée, mais une non-confirmation qui mérite une relecture du texte intégral (Annals of Internal
  Medicine, accès non payant pour cet article a priori — à retenter).

---

### BASSE

**B1 — Erreur dans le PDF officiel de la reco SFE/SFD/NSFA/SFC 2026 elle-même, pas dans les deux passes.**
- **Source** : ni agent A ni OE — un défaut du document source qu'ils citent tous deux correctement.
- **Constat** : j'ai lu la bibliographie numérotée du PDF officiel (25 pages, jusqu'à la référence 240).
  La référence **[222]**, citée en section 8.7 pour justifier le chiffre « 2,5 ans », est imprimée ainsi :
  *« Yourman LC, Cenzer IS, Boscardin WJ, Nguyen BT, Smith AK, Schonberg MA. Evaluation of time to
  benefit for primary prevention of cardiovascular disease events **in adults aged 65 and older**: a
  meta-analysis. JAMA Intern Med. Feb.2021;181(2):179-85. »* Or le titre réel de l'article (confirmé par
  quatre sources indépendantes et concordantes : PubMed PMID 33196766, JAMA Network, page de
  publications BIDMC, résumé ACC) est *« Evaluation of Time to Benefit of Statins for the Primary
  Prevention of Cardiovascular Events **in Adults Aged 50 to 75 Years**: A Meta-analysis »*. Le corps du
  texte de la reco (section 8.7, phrase citée par l'agent A) dit correctement « subjects aged 50 to 75
  years » — seule la ligne de bibliographie est fautive, un artefact probable d'édition côté revue.
- **Conséquence** : aucune, pour notre nœud — ni l'agent A ni OE n'ont hérité de cette coquille (les
  deux donnent la bonne population, 50-75 ans). Signalé car c'est exactement le type d'erreur
  (« déplacement de citation », même titre de référence, mauvais intitulé) que ce projet a appris à
  chasser — ici dans une source qu'on ne peut pas corriger, seulement noter.

**B2 — OpenEvidence : la sous-question ADA/ESC/KDIGO du prompt reste sans réponse.**
- **Source** : OE (absence de réponse) — la question avait été posée par l'agent A dans son prompt.
- **Constat** : le prompt de la section 5 de `preuve-statine-sujet-tres-age.md` demande explicitement :
  « Recommandations internationales INDEXÉES (ADA Standards of Care, ESC/EAS, KDIGO) : quel seuil d'âge
  ou d'espérance de vie utilisent-elles pour nuancer ou déconseiller l'introduction d'une statine en
  prévention primaire chez le sujet âgé ? » Le document `OE-statine-sujet-tres-age.md` fourni ne contient
  aucune réponse à cette sous-question (ni dans la partie A, ni ailleurs).
- **Correction** : ce n'est pas un chiffre faux, c'est un trou de collecte — soit OE n'a pas répondu,
  soit la réponse a été retirée à la curation. À combler avant de considérer le dossier complet : on ne
  sait toujours pas ce que disent ADA/ESC/KDIGO sur ce point précis.

**B3 — CTT 2019, sous-groupe prévention primaire ≥ 70 ans (OE, A6) : non vérifiable dans le temps
imparti (paywall Lancet total).**
- **Source** : OE (chiffre spécifique), non contredit ni confirmé.
- **Affirmé (OE)** : « Sous-groupe prévention primaire ≥ 70 ans : NON significatif, ~1/5 des événements
  seulement, manque de puissance reconnu » ; et un RR de « 0,87 (0,77-0,97) par mmol/L » pour les ≥ 75
  ans tous confondus.
- **Ce que j'ai pu vérifier** : le Lancet a bloqué (403) toutes mes tentatives d'accès (fulltext direct,
  PDF direct, résumé ACC bloqué par pare-feu séparé). Seul confirmé, via le résumé PubMed de l'article
  (PMID 30712900) : la citation exacte « there is less direct evidence of benefit among patients older
  than 75 years who do not already have evidence of occlusive vascular disease », et le fait que la
  tendance par âge est non significative pour l'ensemble des événements vasculaires majeurs (p=0,06) mais
  significative pour les événements coronaires majeurs seuls (p=0,009) — ces deux points corroborent le
  tableau de l'agent A (ligne 1), pas directement le chiffre RR 0,87 (0,77-0,97) ni le « manque de
  puissance reconnu » d'OE, que je n'ai pu ni confirmer ni infirmer.
- **Traitement** : à marquer `[À VÉRIFIER]`, comme le fait déjà l'agent A pour le sous-groupe
  prévention-primaire-seule. Résultat honnête d'une vérification impossible, pas un finding positif.

**B4 — Gencer 2020, sous-groupe prévention primaire seule ≥ 75 ans : toujours NON VÉRIFIABLE (confirme
le flag de l'agent A, n'ajoute rien de définitif).**
- **Source** : les deux passes citent ce chiffre (RR ≈ 0,92 [0,73-1,16]) sans avoir pu le confirmer par
  lecture directe — l'agent A le dit lui-même honnêtement.
- **Constat** : Lancet bloque également l'accès à Gencer 2020 (403 sur toutes les routes tentées). Un
  compte-rendu secondaire (TCTMD, couverture de la publication) indique que les auteurs de Gencer 2020
  ont observé *« no evidence of a treatment difference in those with and without established ASCVD »*
  (pas de différence d'effet significative entre patients avec/sans maladie établie, sur test
  d'interaction) — ce qui est cohérent avec, sans confirmer directement, l'idée que le sous-groupe
  prévention primaire seule n'est pas isolément significatif, plutôt par manque de puissance que par
  absence réelle d'effet. Le chiffre exact RR≈0,92 (0,73-1,16) reste non vérifié par une source primaire.
- **Traitement** : la case `NON VÉRIFIÉ (partiel)` de l'agent A reste justifiée pour ce point précis —
  contrairement à PROSPER (M1, résolu) et Lavon (voir confirmations ci-dessous, résolu), Gencer reste
  ouvert. À retenter avec un accès Lancet (institutionnel ou fourni par le référent).

---

## Confirmations obtenues (axes explicitement demandés par la mission, résolus positivement)

Pas des « findings » au sens d'erreurs, mais des vérifications ciblées dont le résultat structure les
verdicts ci-dessous :

- **StAREE exclut bien les diabétiques.** Protocole primaire en texte intégral (PMC10083753) : critère
  d'inclusion explicite « no history of clinical CVD, diabetes or dementia ». Confirmé mot pour mot,
  aucune ambiguïté.
- **CARDS s'arrête bien à 75 ans à l'inclusion.** Colhoun HM et al., *Lancet* 2004 (PMID 15325833),
  résumé PubMed : « 2838 patients aged 40-75 years... were randomised ». Confirmé mot pour mot.
- **CARDS, sous-groupe 65-75 ans (Neil et al., *Diabetes Care* 2006;29(11):2378-84, PMID 17065671,
  cité par OE en A8) est un vrai papier**, pas une invention : n=1129, réduction 38 % des événements CV
  majeurs (IC -58 à -8, p=0,017), RAA 3,9 %, NNT 21/4 ans, mortalité totale -22 % non significative
  (IC -49 à 18, p=0,245) — tous les chiffres d'OE confirmés exacts par lecture directe de l'abstract.
- **La chaîne « 2,5 ans » est intégralement confirmée dans le PDF officiel de la reco SFE/SFD/NSFA/SFC
  2026**, section 8.7, lu en texte intégral (pas via un résumé) : citation exacte « *A meta-analysis on
  subjects aged 50 to 75 years showed that, in primary prevention, statins are used for at least 2.5
  years to prevent a major cardiovascular event and thus that life-expectancy must be at least 2.5 years
  to introduce a statin in primary prevention [222]* », suivie immédiatement de l'aveu d'extrapolation
  cité par l'agent A (« insufficient evidence to recommend LDL targets... after the age of 75 » ;
  « Randomized trials are underway... over 75 years of age »). Le maillon ajouté par l'agent A (§6 de la
  mission) est donc réel : la reco officielle 2026 relaie elle-même l'extrapolation, en la nommant comme
  telle dans la phrase suivante. Aucune fabrication.
- **Table R5 de la reco confirme mot pour mot** les deux citations de l'agent A : « Lipid-lowering
  therapy may be considered for primary cardiovascular prevention in subjects aged >75 years with high or
  very high cardiovascular risk, taking life expectancy into account » (Classe IIb, Niveau B) et « It is
  not recommended to discontinue ongoing statin therapy in individuals over 75 years of age for primary
  cardiovascular prevention, in the absence of factors that would challenge the risk/benefit ratio »
  (Classe III, Niveau B).
- **Ramos 2018 : chiffres et méthode confirmés en détail.** Tous les HR par tranche d'âge/statut
  diabétique (agent A, ligne 7) confirmés exacts. Méthode de contrôle du biais de l'utilisateur sain
  (question explicitement posée par la mission) : conception en **nouveaux utilisateurs** (« new users
  design ») pour éviter le biais de survie, **score de propension calculé séparément par tranche d'âge et
  par statut diabétique**, **exclusion délibérée** des patients avec cancer, démence, paralysie, dialyse,
  en institution ou transplantés « to reduce the healthy user bias », trois analyses de sensibilité
  (cas complets, risques compétitifs, imputation multiple) concordantes. Limite reconnue par les auteurs
  eux-mêmes, citée verbatim : « residual confounding is a possibility, especially by indication... despite
  these efforts, we acknowledge that some residual confounding might exist. » C'est un design
  observationnel notablement plus soigné que la moyenne — mais qui reste, de l'aveu même des auteurs, non
  à l'abri du biais.
- **Giral 2019, Peixoto 2024, Aponte Ribero 2025/2026 : tous confirmés avec citations verbatim exactes**
  (HR 1,33 [1,18-1,50] ; 36 études/>1,7M patients/1 seul ECR/~2× mortalité ; HR composite 1,53
  [1,14-2,06] et HR mortalité non-CV 1,56 [1,08-2,27] avec la citation exacte « clinically and
  pathophysiologically implausible, indicating probable confounding bias » et « Only RCTs can clarify the
  safety of statin discontinuation in multimorbid older adults »). Aucun écart trouvé.
- **Lavon et al. 2026 (JAGS) : le flag `NON VÉRIFIÉ (partiel)` de l'agent A est en grande partie levé.**
  Contrairement à ce qu'indique l'agent A (« paywall, HTTP 402 »), le résumé PubMed complet **est
  accessible** et confirme intégralement les chiffres utilisés : HR mortalité 0,69, HR événements
  coronariens 0,80 (0,68-0,94, p=0,008) — soit exactement les « -31 % » et « -20 % » rapportés par
  l'agent A. Le sous-groupe diabète, lui, reste non confirmé — l'abstract ne mentionne aucun critère
  diabète (ni inclusion ni sous-analyse), donc la prudence de l'agent A sur ce point précis (« sous-groupe
  diabète non confirmé ») reste justifiée : Lavon 2026 est une étude sur les ≥ 80 ans en général, **pas**
  une étude diabète-spécifique, malgré sa présence dans un tableau intitulé « spécifiquement diabétique »
  (§1c de l'agent A) — erreur de rangement mineure à corriger : cette ligne devrait être en §1b (population
  générale), pas en §1c.
- **Savarese 2013 (JACC), cité par OE en A9, confirmé exact** : n=24 674, 8 essais, IDM RR 0,606
  (0,434-0,847), AVC RR 0,762 (0,626-0,926), mortalité totale et CV non significatives — correspond
  précisément aux chiffres arrondis d'OE.

---

## Décompte

**Par sévérité** : HAUTE = 1 · MOYENNE = 4 · BASSE = 4 (dont 2 sont des non-vérifiabilités documentées,
pas des erreurs positives).

**Par source** :
- **OE seule fautive** : 1 (H1, chiffres QOL Kutner faux).
- **Agent A ET OE, erreur partagée** : 1 (M1, IC de PROSPER — même chiffre faux dans les deux passes,
  probablement hérité d'une source secondaire commune).
- **Agent A seule fautive/incomplète** : 3 (M2 spin de Formulation C, M3 STREAM/SITE absents, M4
  effectif Xu non confirmé).
- **Aucune des deux, erreur de la source elle-même** : 1 (B1, coquille bibliographique de la reco
  2026).
- **Non-vérifiabilités (ni confirmées ni infirmées, accès bloqué)** : 2 (B3 CTT 2019, B4 Gencer 2020) +
  1 trou de collecte OE (B2 ADA/ESC/KDIGO).

Aucune référence inexistante trouvée. Aucun DOI/PMID ne pointe vers la mauvaise publication — tous les
PMID/DOI vérifiés (CARDS, PROSPER, CTT 2019, Gencer 2020, Ramos 2018, Lavon 2026, Giral 2019, Kutner
2015, Aponte Ribero, Xu 2024, Yourman 2021, Savarese 2013, Neil 2006, USPSTF 2022, SFE/SFD/NSFA/SFC 2026)
pointent vers la bonne publication, avec le bon titre, la bonne année, la bonne revue. **Pas de
« déplacement de citation »** de type de celui trouvé lors de la passe red-team précédente du projet —
les erreurs trouvées ici sont des erreurs de chiffres (H1, M1) ou de complétude (M3, B2, B3, B4), pas des
erreurs d'attribution d'autorité.

---

## Verdict 1 — Initiation d'une statine à 82 ans chez un DT2 en prévention primaire

**L'intuition du référent (« bénéfice très limité ») est nuancée, pas contredite, et pas non plus
pleinement confirmée telle quelle.**

Au niveau des essais randomisés, elle est **confirmée** : aucun essai n'isole un bénéfice significatif de
l'initiation d'une statine en prévention primaire chez le sujet ≥ 75 ans (a fortiori diabétique). PROSPER
(sous-groupe primaire : RR 0,94 [0,78-1,14], non significatif — chiffre désormais vérifié en source
primaire, cf. M1), CTT 2019 (pas de RR isolé publié pour le sous-groupe primaire ≥ 75 ans), Gencer 2020
(sous-groupe primaire non isolé avec certitude, cf. B4) : trois méta-analyses, zéro signal significatif
isolable pour la prévention primaire pure chez le sujet très âgé. StAREE, le seul essai dédié en cours,
**exclut explicitement les diabétiques** (confirmé mot pour mot) — donc même quand StAREE publiera, il ne
répondra pas à la question posée. PREVENTABLE pourrait répondre, mais n'a pas encore de résultats.

Elle est **nuancée** par la seule donnée spécifiquement diabétique disponible, Ramos et al. 2018 : un
signal réel, chiffré, avec une méthode de contrôle du biais de l'utilisateur sain plus soignée que la
moyenne des études de ce type (nouveaux utilisateurs, score de propension stratifié, exclusion des
patients fragiles) — mais qui reste, de l'aveu même de ses auteurs, exposée à une confusion résiduelle
« notamment par indication ». Le signal a une plausibilité biologique (risque absolu plus élevé chez le
diabétique → bénéfice absolu plus grand à réduction relative égale) qui le rend crédible sans le rendre
probant.

**Conclusion** : à 82 ans, en l'absence d'ASCVD établie, l'absence de preuve directe solide justifie de
ne **pas** faire de l'initiation un réflexe — l'intuition du référent tient comme position par défaut.
Mais le statut diabétique n'est pas neutre : le seul signal disponible pointe vers un bénéfice
possiblement un peu plus net que chez le non-diabétique du même âge, sans atteindre le niveau de preuve
qui permettrait d'en faire une recommandation ferme. La formulation la plus défendable est la
**Formulation B** de l'agent A (intermédiaire, alignée sur la reco IIb/B) — pas la Formulation A (trop
elle occulte le signal diabète-spécifique) ni la C (surclassée, cf. M2).

## Verdict 2 — Déprescription d'une statine déjà en place à cet âge

**Pas de fondement EBM solide pour déprescrire systématiquement — mais la certitude affichée par les
deux passes sur ce point est un peu trop haute compte tenu de la qualité réelle des données.**

Le seul essai randomisé (Kutner 2015) répond à une question différente (espérance de vie 1 mois-1 an) et,
relu de façon critique (Peixoto 2024), n'atteint pas franchement sa marge de non-infériorité. Toutes les
autres données sont observationnelles et orientées dans le même sens (arrêt = risque), mais ce sens est
exactement celui qu'on attendrait d'une confusion par indication inversée (on arrête chez les patients
qui déclinent) — confirmée comme un phénomène réel et de grande ampleur dans ce type de cohorte par le
propre résultat « implausible » d'Aponte Ribero (une mortalité non cardiovasculaire ne peut pas être
causée par l'arrêt d'une statine ; un HR de 1,56 sur ce critère ne peut être qu'un artefact de confusion,
ce qui jette un doute légitime sur la magnitude — pas la direction — des autres résultats du même type de
cohorte, y compris Giral). **Verdict** : ne pas déprescrire par automatisme reste la position la plus
prudente et la mieux alignée avec la reco officielle (Classe III/B), mais elle repose sur un faisceau
d'indices biaisés convergents, pas sur une preuve ferme — à présenter au médecin comme un « signal de
prudence », pas comme un fait établi, et à réviser dès que STREAM ou SITE publieront (M3).

## Verdict 3 — Symétrie des standards (A5)

**Position** : je rejoins le point soulevé par OE (« accepter Ramos tout en écartant Giral serait un
double standard ») **sur le principe**, mais je le nuance après avoir comparé les deux méthodologies en
détail (ce qu'aucune des deux passes n'a fait explicitement).

Les deux biais gonflent bien le bénéfice apparent de la statine dans le même sens, comme le note OE. Mais
ils ne sont pas de force égale ni également corrigibles :
- **Ramos** (design nouveaux-utilisateurs) est structurellement plus proche d'une émulation d'essai
  cible : comparer des gens qui *démarrent* un traitement à des gens qui ne le démarrent pas, à un
  moment défini, avec ajustement stratifié et exclusion délibérée des patients fragiles pour réduire
  précisément ce biais. C'est une conception reconnue comme la moins mauvaise en pharmaco-épidémiologie
  pour ce type de question.
- **Giral** (design arrêt vs poursuite chez des utilisateurs prévalents) est structurellement plus
  exposé à la causalité inverse : la décision d'arrêter un traitement chronique est elle-même souvent un
  *symptôme* d'un état de santé qui se dégrade (simplification thérapeutique en fin de vie, nouvelle
  pathologie limitante, iatrogénie) — un biais beaucoup plus difficile à corriger par un simple ajustement
  sur les covariables mesurées au départ, puisque le déclencheur de l'arrêt peut être postérieur à ces
  covariables. Aponte Ribero en fournit une **démonstration directe** avec son résultat « implausible ».

**Conclusion** : ne pas écarter Giral tout en gardant Ramos sans le dire — les deux doivent rester au
niveau GRADE faible, ce que fait déjà l'agent A. Mais si un choix devait être fait entre les deux
seulement sur la qualité de conception (toutes choses égales par ailleurs), Ramos mérite un traitement
légèrement moins sévère que les cohortes de déprescription — pas parce que son signal serait plus fort,
mais parce que sa méthode est un peu mieux équipée pour lui résister. Ce n'est pas un blanc-seing : le
signal Ramos reste faible et ne doit pas fonder une recommandation ferme (cf. Verdict 1, M2).

## Proposition de libellé corrigé pour l'alerte « > 75 ans »

Le problème identifié (mission, point 5, et confirmé en B1/M1/confirmations) : le chiffre « ~2,5 ans » de
l'alerte actuelle (`statine.yaml:174-180`) est réel et bien transcrit depuis la reco française, mais
l'alerte le présente comme une mesure du sujet très âgé alors qu'il provient d'une méta-analyse portant
sur des sujets de **50 à 75 ans** (Yourman 2021), extrapolation assumée comme telle par la reco
elle-même dans la phrase suivante — jamais mesurée directement après 75 ans.

**Libellé proposé** (remplace le texte actuel du champ `message`, même ton/longueur, un ajout de
précision sur l'origine du chiffre) :

> Prévention primaire après 75 ans : preuve plus faible et moins directe (méta CTT par âge 2019 ;
> PROSPER : sous-groupe prévention primaire non significatif, pas de bénéfice de mortalité ; aucun essai
> randomisé dédié au sujet très âgé — StAREE exclut les diabétiques, PREVENTABLE en cours). Individualiser
> selon l'espérance de vie, la fragilité et les préférences : le seuil de 2,5 ans avancé par la reco
> SFE/SFD/NSFA/SFC 2026 est extrapolé d'une méta-analyse portant sur des sujets de 50 à 75 ans, faute de
> donnée directe après cet âge — à utiliser comme repère, pas comme mesure. En prévention secondaire
> (ASCVD établie), le bénéfice de la statine persiste à tout âge.

Deux points laissés à l'arbitrage du référent, non inclus dans le libellé ci-dessus pour ne pas
surcharger une alerte « attention » : (1) le signal diabète-spécifique de Ramos 2018, qui nuancerait
l'alerte dans un sens plus favorable à l'initiation mais dont le niveau de preuve (faible, observationnel)
ne justifie peut-être pas de figurer dans une alerte plutôt qu'un simple rappel court ; (2) un mot sur la
déprescription (« ne pas arrêter une statine bien tolérée sans motif clinique nouveau ») — actuellement
absent de toute alerte du nœud, alors que c'est une des deux questions posées par le référent et que la
reco officielle 2026 a une position ferme (Classe III/B) sur ce point précis.
