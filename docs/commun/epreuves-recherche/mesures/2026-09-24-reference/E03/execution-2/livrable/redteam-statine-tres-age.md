# Red-team — statine chez le DT2 très âgé (≥ 75-80 ans) : initiation et déprescription

Agent B, contexte isolé, red-team conjoint de `epreuve/entrees/preuve-statine-sujet-tres-age.md`
(Agent A, 2026-07-26) et `epreuve/entrees/OE-statine-sujet-tres-age.md` (retour OpenEvidence,
même date). **Aucune requête OpenEvidence effectuée pour ce travail** (consigne du référent).
Sources rouvertes via PubMed (eutils), Europe PMC / PMC, et recherche web pour les essais publiés
depuis la date de la collecte. Date du red-team : 2026-09-24, soit deux mois après la collecte —
un délai qui s'est avéré décisif (cf. finding H4).

---

## 0. Accès obtenus et bloqués

### Obtenus aujourd'hui (au-delà de ce qu'Agent A avait déjà consulté)

| Source | Statut | Route |
|---|---|---|
| Gencer et al. 2020 (PMID 33186535) | **Texte intégral obtenu** (Agent A n'avait que l'abstract) | PMC8015314, libre accès malgré le DOI Lancet payant |
| Lavon et al. 2026, JAGS (PMID 41793188) | **Texte intégral obtenu** (Agent A : paywall/HTTP 402) | PMC13266438, libre accès |
| Lloyd et al. 2013, PLoS One — suivi étendu PROSPER | **Texte intégral obtenu** (absent du dossier d'Agent A, cité par OE seule) | PMC3759378, libre accès |
| CTT 2019 (PMID 30712900) | Texte intégral reconfirmé | PMC6429627 (déjà utilisé par Agent A) |
| PROSPER original (PMID 12457784) | Abstract confirmé | eutils/PubMed |
| Ramos et al. 2018, BMJ (PMID 30185425) | Abstract confirmé mot pour mot | eutils/PubMed |
| Giral et al. 2019 (PMID 31362307) | Abstract confirmé mot pour mot | eutils/PubMed |
| Kutner et al. 2015 (PMID 25798575) | Abstract confirmé mot pour mot | eutils/PubMed |
| Neil et al. 2006, Diabetes Care (sous-groupe CARDS 65-75 ans, PMID 17065671) | Existence + chiffres clés confirmés (source citée par OE seule) | Recherche web croisée |
| Savarese et al. 2013, JACC | Existence confirmée, chiffres non recités par citation directe | Recherche web croisée |
| STREAM (protocole, Aebi et al. 2025, BMJ Open) | Existence + statut confirmés (en cours) | PMC12104904 |
| **SAGA/SITE — RÉSULTATS publiés** (Bonnet et al., Lancet Healthy Longevity, PMID 42580354, 2026-08) | Abstract obtenu ; texte intégral bloqué | eutils (abstract) ; presse spécialisée (TCTMD, Healio, Medical Dialogues) |
| **StAREE — RÉSULTATS publiés** (NEJM, 2026-08-28, présentés ESC 2026) | Résultats topline obtenus | Recherche web (NEJM, ESC, ACC, TCTMD) |
| Thompson et al. 2021 (Danemark, JAMA Netw Open) — cité par OE seule | Existence confirmée + erratum 2022 repéré | Recherche web |
| Rea et al. 2021 (Italie, JAMA Netw Open) — cité par OE seule | Existence confirmée | Recherche web |
| USPSTF, JAMA 2022;328(8):746-753 | Existence confirmée, contenu partiellement obtenu | Recherche web |

### Bloqués (accès payant confirmé, sans repli disponible)

| Source | Constat |
|---|---|
| PROSPER original (Shepherd 2002, Lancet) — **texte intégral** | Non indexé dans PMC (`inPMC: N`), `isOpenAccess: N`, aucun preprint ni SAP de repli identifié. Seul l'abstract est ouvert. |
| **SAGA/SITE — texte intégral** (Lancet Healthy Longevity) | `isOpenAccess: N` confirmé via Europe PMC malgré le modèle habituellement plus ouvert de la revue ; DOI renvoie vers un mur d'abonnement (HTTP 403 constaté). **Bloque la vérification du sous-groupe diabète** (cf. finding H4) — point à signaler au référent pour un accès personnel/institutionnel éventuel avant de considérer le report comme définitif. |
| Contenu exact de la déclaration ACC/AHA 2026 citée par OE (item C2) | Non retrouvée indépendamment dans le temps imparti (existence d'une reco dyslipidémie US 2026 probable, contenu exact non confirmé) |

Aucun outil MCP spécialisé (PubMed/ClinicalTrials.gov/Consensus) n'a pu être invoqué directement
dans cette session (permissions refusées) ; le red-team s'est appuyé sur l'API eutils NCBI, Europe
PMC/PMC en accès direct, et une recherche web ciblée pour les publications les plus récentes — à
noter pour le référent, ce n'est pas la voie décrite par défaut dans `recherche-source-primaire`,
mais elle a permis d'atteindre les mêmes sources primaires.

---

## 1. Findings

### HAUTE sévérité

**H1 — Origine : Agent A seule.** Le chiffre « Gencer 2020, sous-groupe prévention primaire seule
≥75 ans : RR ≈0,92 (0,73-1,16) », marqué `NON VÉRIFIÉ (partiel)` par Agent A et triangulé via 3
résumés secondaires (AAFP, TCTMD, etc.), est **introuvable dans le texte intégral de l'article**,
aujourd'hui consulté en accès libre (PMC8015314, contrairement à la situation d'Agent A qui n'avait
que l'abstract payant). Le texte donne uniquement une répartition des événements par type de
prévention (« 3519 [16,4 %] of 21 492 patients had a major vascular event […], of which 2736
[77,7%] occurred in secondary prevention patients and 783 [22,3%] in primary prevention patients »)
et reconnaît explicitement : « the data for the benefit of lipid lowering for cardiovascular risk
reduction for primary prevention in older patients are sparse » — sans fournir de RR chiffré isolé.
**Ce chiffre doit être retiré du dossier de preuve**, ou requalifié en « non retrouvé dans la source
primaire, origine exacte incertaine (probable erreur des résumés secondaires tiers) » plutôt que
« triangulé ». Sur ce point précis, OpenEvidence avait raison (item A7 : « Ne sépare PAS primaire et
secondaire »).

**H2 — Origine : OpenEvidence seule.** OE attribue à la méta-analyse CTT 2019 (item A6) un résultat
« RR 0,87 (0,77-0,97) » pour l'ensemble des ≥75 ans. Ce chiffre **n'apparaît nulle part** dans le
texte intégral de l'article (vérifié aujourd'hui, PMC6429627, libre accès). Le texte rapporte un RR
global de 0,79 (0,77-0,81) pour l'ensemble de la cohorte (tous âges), et le RR spécifique aux ≥75
ans qui existe réellement dans la littérature — 0,74 (0,61-0,89) — appartient à **Gencer 2020**, pas
à CTT 2019. OpenEvidence semble avoir confondu les deux méta-analyses ou halluciné une valeur
intermédiaire plausible. À ne pas utiliser.

**H3 — Origine : Agent A seule.** Agent A classe Lavon et al. 2026 (JAGS) dans la sous-table
« 1c. Sujet âgé/très âgé — **spécifiquement diabétique** ». Le texte intégral, désormais accessible
en libre accès (PMC13266438 — inaccessible à Agent A au moment de sa collecte, HTTP 402), montre
que l'étude porte sur une cohorte **générale** de 15 745 sujets ≥80 ans (statine vs non-utilisateurs
sans restriction diabète) ; le diabète y est analysé comme **événement incident** (nouveau
diagnostic, HR 0,89 [0,73-1,09], NS), pas comme critère de population. Titre exact : *« Statin
Therapy for Primary Prevention and Clinical Outcomes in Adults Aged 80 and Older: A Retrospective
Comparative Cohort Study »*. Cette étude **n'apporte aucune donnée spécifiquement diabétique** et
doit être reclassée en 1b (population générale ≥75/80 ans) si elle est conservée. Les chiffres eux-
mêmes (mortalité -31 %, HR 0,69 [0,34-0,74] ; événements coronariens -20 %, HR 0,80 [0,68-0,94],
p=0,008) sont en revanche confirmés exacts — c'est un problème de catégorisation, pas d'invention de
chiffre.

**H4 — Origine : ni Agent A ni OpenEvidence (calendrier), mais décisionnel.** Deux essais que les
deux retours décrivaient, à raison à leur date (2026-07-26), comme « en cours, sans résultat » ont
**publié leurs résultats principaux depuis** :

- **StAREE** (NCT02099123) — résultats publiés le 2026-08-28 (*NEJM*), présentés à l'ESC Congress
  2026. MACE majeurs : 6,0 % (atorvastatine) vs 8,3 % (placebo), **HR 0,70 (IC 0,61-0,82), p<0,001**
  — réduction de 30 %, portée principalement par des événements non fatals. Critère co-primaire
  (survie sans handicap/démence) : **pas d'effet significatif** — 12,8 % vs 13,6 %, HR 0,94
  (0,84-1,05), p=0,25. **Rappel impératif** : StAREE **exclut les diabétiques par protocole** — ce
  résultat ne s'applique donc pas directement au DT2, mais change le contexte général (premier ECR
  positif sur un critère CV dur chez le sujet ≥70 ans sans diabète en bonne santé générale).
- **SAGA/SITE** (protocole Bonnet et al. 2020, *Trials* ; résultats Bonnet et al., *Lancet Healthy
  Longevity*, PMID 42580354, fin août 2026) — **premier ECR répondant directement à la question de
  la déprescription** chez le sujet ≥75 ans en prévention primaire stable, hors fin de vie. N=1160
  (639 poursuite / 521 arrêt ; le protocole 2020 visait ~2430 inclusions — écart de recrutement à
  noter), âge médian 80 ans, **29,5 % diabétiques**, 77,2 % hypertendus. Mortalité toutes causes à 3
  ans : 7,9 % (poursuite) vs 7,2 % (arrêt), différence -0,68 % (IC95% -3,95 à +2,60) —
  **non-infériorité de l'arrêt démontrée** (marge 5 % non franchie). C'est un résultat de bien
  meilleur niveau de preuve (ECR) que toutes les données observationnelles (Giral, Peixoto, Aponte
  Ribero) qui, dans le dossier actuel, orientent vers un signal de risque à l'arrêt — et il va dans
  le sens **opposé**.
  **Nuance obtenue mais non tranchée (texte intégral bloqué, payant, HTTP 403 constaté)** : des
  relais de presse divergent sur l'existence d'une analyse en sous-groupe diabète — un résumé de
  recherche indique une non-infériorité **non établie** dans ce sous-groupe (IC trop large, borne
  supérieure dépassant la marge), tandis que deux articles de presse spécialisée détaillés
  (Healio, Medical Dialogues) ne mentionnent **aucune** stratification par diabète. Impossible de
  trancher sans le texte intégral. **Ne pas citer de conclusion par sous-groupe diabète avant
  d'avoir obtenu l'article complet** (accès personnel/institutionnel du référent à solliciter en
  priorité, cf. `recherche-source-primaire`).

Sévérité haute car ces deux essais pèsent directement sur les deux sous-questions du référent et
sont absents des deux retours simplement parce qu'ils n'étaient pas encore publiés à leur date —
c'est un trou décisionnel à combler avant toute clôture du dossier, pas une erreur d'un des deux
agents.

### MOYENNE sévérité

**M1 — Origine : Agent A et OpenEvidence (à parts égales).** Le sous-groupe PROSPER « prévention
primaire seule » (HR 0,94, IC 0,77-1,15) reste **non retrouvé dans une source primaire** : le texte
intégral de PROSPER (Shepherd 2002) est confirmé payant, non indexé dans PMC, sans repli identifié
(pas de preprint, pas de SAP public — l'essai date d'avant la politique d'enregistrement des SAP).
Cependant, la conclusion qualitative (pas d'effet significatif une fois isolé de la prévention
secondaire) est aujourd'hui **mieux triangulée** : outre les deux sources secondaires qu'Agent A
citait déjà, la déclaration USPSTF (JAMA 2022;328:746-753, confirmée existante) affirme
indépendamment : *« in a subgroup analysis limited to primary prevention in PROSPER, statin therapy
had no statistically significant effect on the primary composite outcome »* — une troisième source
concordante, de nature quasi-officielle (revue systématique gouvernementale), mais qui ne donne pas
non plus le chiffre exact 0,94 (0,77-1,15) dans les extraits obtenus. **Statut inchangé** :
`NON VÉRIFIÉ (partiel)` pour le chiffre exact ; la direction (non significatif) est désormais
solidement triangulée par 3 sources indépendantes.

**M2 — Origine : OpenEvidence seule.** Trois chiffres de qualité de vie McGill pour Kutner et al.
2015 diffèrent entre Agent A (7,11 vs 6,85, p=0,04) et OE (7,07 vs 6,74, p=0,03). Vérification
directe de l'abstract PubMed aujourd'hui : *« mean McGill QOL score, 7.11 vs 6.85; P=.04»* —
**Agent A est exact, OE s'est trompé sur les trois valeurs**. Ne change pas le sens de la
conclusion (QV meilleure à l'arrêt dans les deux versions) mais un chiffre inventé reste un chiffre
inventé — à corriger si ce passage devait être cité tel quel.

**M3 — Origine : non-vérifiable dans le temps imparti.** La déclaration « ACC/AHA 2026 » citée par
OE (item C2 : « aucune donnée équivalente n'existe pour les ≥75 ans » concernant le délai avant
bénéfice) n'a pas pu être retracée à une source précise et vérifiable dans le temps disponible pour
ce red-team (une reco de dyslipidémie US 2026 semble exister d'après une recherche croisée, mais son
contenu exact sur ce point n'a pas été confirmé). Note : la substance de l'affirmation est de toute
façon déjà couverte, et confirmée, par la reco SFE/SFD/NSFA/SFC 2026 qu'Agent A a lue intégralement
— cette lacune ne change donc rien à la conclusion pratique, mais le nom précis de la source ACC/AHA
ne doit pas être cité tel quel sans vérification supplémentaire.

### BASSE sévérité

**B1 — Origine : la source primaire elle-même (erratum), non-fautif des deux agents.** Thompson et
al. 2021 (Danemark, *JAMA Netw Open*), cité par OE seule (item B4) et absent du dossier d'Agent A, a
fait l'objet d'un erratum publié en janvier 2022 (« Data Errors in Results Section ») qui corrige
spécifiquement les chiffres de la **cohorte de prévention primaire** — exactement le sous-groupe qui
intéresse le référent. Ni Agent A ni OE ne mentionnent cet erratum (Agent A parce qu'il ne citait pas
l'étude du tout, OE parce que le retour ne va pas jusqu'à ce niveau de détail). N'invalide pas le
sens du signal (sur-risque à l'arrêt), mais toute citation future de ce chiffre doit utiliser la
version corrigée, pas le chiffre initial.

---

## 2. Confirmations obtenues

### Confirmations de la collecte existante (Agent A)

- **Gencer et al. 2020**, pool mixte ≥75 ans : RR 0,74 (0,61-0,89), p=0,0019 — confirmé exact dans
  le texte intégral (accès obtenu aujourd'hui) et concordant avec le résumé qu'utilisait déjà
  Agent A. Concordance également avec OE (item A7).
- **CTT 2019** — citation verbatim confirmée mot pour mot dans le texte intégral : *« there is less
  direct evidence of benefit among patients older than 75 years who do not already have evidence of
  occlusive vascular disease »*. Les deux valeurs de tendance par âge citées par Agent A (p=0,06
  pour la réduction globale par âge ; p=0,05 pour l'interaction âge × statut vasculaire) sont
  confirmées présentes séparément dans le texte — Agent A ne les a pas confondues.
- **Ramos et al. 2018, BMJ** — chiffres et citation confirmés **mot pour mot** : diabétiques 75-84
  ans, HR 0,76 (0,65-0,89) ASCVD, HR 0,84 (0,75-0,94) mortalité ; effet disparaissant après 85 ans.
  C'est la donnée la plus solide et la plus centrale du dossier — elle résiste entièrement au
  red-team.
- **Giral et al. 2019** — HR 1,33 (1,18-1,50) confirmé exact ; citation sur l'appel des auteurs à des
  essais randomisés confirmée.
- **Kutner et al. 2015** — mortalité à 60 jours 23,8 % vs 20,3 %, p=0,36, confirmée exacte (chiffres
  d'Agent A, pas ceux d'OE — cf. finding M2).
- **PREVENTABLE** — statut « en cours, sans résultat » confirmé toujours exact aujourd'hui (fin
  d'essai attendue décembre 2026).
- **SFE/SFD/NSFA/SFC 2026**, chiffre « 2,5 ans » et chaîne d'attribution vers Yourman et al. 2021
  (population 50-75 ans) — cohérence confirmée par recoupement : Agent A et OE tracent
  **indépendamment la même origine** et le même caveat de non-transposabilité au grand âge (item
  C1/C2 du retour OE). Convergence forte, aucun signe de confabulation partagée.

### Apports positifs d'OpenEvidence, vérifiés, absents de la collecte d'Agent A

- **Neil et al. 2006, Diabetes Care** (PMID 17065671) — analyse en sous-groupe CARDS 65-75 ans.
  Existence confirmée ; chiffres cohérents avec ce qu'avance OE (réduction 38 %, IC -58 à -8,
  p=0,017 ; RAR 3,9 % ; NNT 21 sur 4 ans). Lacune réelle de la collecte d'Agent A, qui ne citait
  CARDS que dans son ensemble (40-75 ans) sans exploiter cette analyse en sous-groupe pourtant
  spécifiquement diabétique et plus proche en âge de la question posée. **À ajouter** à la table
  maîtresse si le référent valide.
- **Lloyd et al. 2013, PLoS One** — suivi étendu de PROSPER (8,6 ans). Texte intégral obtenu
  aujourd'hui (PMC3759378) : mortalité coronarienne HR 0,80 (0,68-0,95), p=0,0091 (identique au
  chiffre donné par OE) ; mortalité totale HR 0,99 (0,91-1,07), p=0,75, « pas de bénéfice » (OE
  donne la bonne conclusion sans le chiffre). **Attention** : ces résultats portent sur la cohorte
  complète de PROSPER (prévention primaire + secondaire mélangées), pas sur un sous-groupe
  prévention primaire isolé — à ne pas présenter comme une donnée « prévention primaire pure ».
- **Savarese et al. 2013, JACC** — existence confirmée ; orientation générale confirmée par
  recoupement web (réduction IDM ~40 %, AVC ~25 %, mortalité totale/CV non significative), cohérente
  avec les RR avancés par OE (0,60 IDM / 0,76 AVC). Chiffres exacts non retrouvés par citation
  directe du texte primaire dans le temps imparti → reste `NON VÉRIFIÉ (partiel)`, mais apport
  légitime à ajouter si confirmé.
- **Thompson et al. 2021** (Danemark) et **Rea et al. 2021** (Italie) — existence confirmée pour les
  deux ; caractérisation d'OE comme « observationnels, confondus par indication » exacte. Voir
  toutefois finding B1 pour Thompson (erratum).
- **STREAM** (protocole, Aebi et al. 2025) — existence et statut « en cours, sans résultat »
  confirmés par les deux retours et par ce red-team ; complémentaire de SAGA/SITE, à surveiller.

---

## 3. Décompte final

| Sévérité | OE seule | Agent A seule | A et OE (partagé) | Source primaire elle-même | Non-vérifiable | Ni A ni OE (calendrier) | Total |
|---|---|---|---|---|---|---|---|
| HAUTE | 1 (H2) | 2 (H1, H3) | 0 | 0 | 0 | 1 (H4) | 4 |
| MOYENNE | 1 (M2) | 0 | 1 (M1) | 0 | 1 (M3) | 0 | 3 |
| BASSE | 0 | 0 | 0 | 1 (B1) | 0 | 0 | 1 |
| **Total** | **2** | **2** | **1** | **1** | **1** | **1** | **8** |

Confirmations obtenues : 6 (collecte Agent A) + 5 (apports OE vérifiés) = **11 points positifs**.

**Lecture pour la fiabilité relative dans la durée** : sur ce dossier, Agent A a produit une collecte
globalement fiable (aucun chiffre inventé de toutes pièces sur ses propres citations vérifiées — son
seul vrai défaut est une **erreur de catégorisation** [H3] et un chiffre triangulé qui ne résiste pas
à l'ouverture du texte primaire [H1]) mais **incomplète** (3 sources pertinentes manquées, toutes
apportées par OE : Neil 2006, Lloyd 2013, et dans une moindre mesure Savarese 2013/Thompson/Rea).
OpenEvidence, de son côté, a livré un vrai chiffre halluciné (H2, une valeur numérique plausible mais
absente de la source citée) et une petite série d'erreurs numériques mineures (M2) — un profil
inverse : moins complet à retenir servilement, mais utile en débroussaillage complémentaire, à
vérifier systématiquement chiffre par chiffre avant citation, exactement comme le prescrit le statut
« jamais une source primaire en soi ».

---

## 4. Verdict par sous-question

### Sous-question 1 — Initiation d'une statine chez le DT2 ≥75-80 ans en prévention primaire

Aucun ECR dédié aux DT2 ≥75-80 ans en prévention primaire pure n'existe toujours à ce jour. StAREE
vient de publier un résultat positif sur un critère CV dur (HR 0,70) chez le sujet âgé sans maladie
CV, mais **exclut les diabétiques par protocole** — inutilisable directement pour la question posée,
utile seulement comme contexte général favorable au principe. PREVENTABLE (qui n'exclut pas le
diabète) reste sans résultat, attendu fin 2026. Les sous-groupes issus des méta-analyses mixtes
(CTT, Gencer) ne permettent toujours pas d'isoler un effet propre à la prévention primaire pure chez
les >75 ans — et le chiffre le plus précis qu'Agent A avançait pour Gencer (RR≈0,92) doit être
**abandonné**, introuvable dans la source. La donnée la plus solide et la plus proche de la
population réelle reste **Ramos et al. 2018** (diabétiques 75-84 ans : -24 % ASCVD, -16 % mortalité,
effet disparaissant après 85 ans), confirmée intégralement aujourd'hui, mais de niveau de preuve
faible (observationnel). Le sous-groupe CARDS 65-75 ans (Neil 2006, apport OE vérifié) renforce,
avec un niveau de preuve modeste (post-hoc d'ECR), le signal favorable pour la tranche la plus jeune
de la fourchette. **Rien dans ce red-team ne déplace la balance vers un bénéfice plus assuré qu'au
moment de la collecte — mais rien ne l'affaiblit non plus.** La formulation B du dossier initial
(intermédiaire, alignée SFE/SFD/NSFA/SFC 2026, classe IIb) reste la mieux étayée en l'état des
preuves confirmées.

### Sous-question 2 — Déprescription d'une statine chez le DT2 ≥75-80 ans en prévention primaire

**Verdict à réviser par rapport au dossier initial.** Le dossier d'Agent A concluait, sur la seule
base de données observationnelles biaisées et d'un ECR hors sujet (Kutner, fin de vie), à un signal
de risque à l'arrêt sans fondement EBM solide pour trancher — une position prudente et
méthodologiquement défendable **à sa date**. Depuis, **SAGA/SITE** (Bonnet et al., ECR pragmatique,
N=1160, 29,5 % diabétiques, âge médian 80 ans, publié fin août 2026) démontre la **non-infériorité de
l'arrêt** sur la mortalité toutes causes à 3 ans — un résultat de bien meilleur niveau de preuve que
toutes les données observationnelles citées jusqu'ici, et qui va dans le sens **opposé** au signal de
risque. Ce résultat ne peut cependant pas être adopté tel quel pour le DT2 spécifiquement tant que le
texte intégral (bloqué, payant) n'a pas confirmé ou infirmé l'existence d'une hétérogénéité par
diabète — une indication de presse non recoupée suggère que la non-infériorité pourrait ne **pas**
être établie dans le sous-groupe diabétique. **Recommandation : suspendre toute mise à jour du nœud
sur la déprescription tant que ce point n'est pas tranché** — c'est désormais le point décisionnel le
plus urgent du dossier, prioritaire sur toute autre question ouverte de cette note.

---

## 5. Propositions de libellé (sous réserve de validation référent)

**Initiation (statu quo, formulation B du dossier initial conservée)** — aucune modification
proposée pour l'instant ; retirer uniquement, si le référent souhaite intégrer cette note au nœud, la
mention du chiffre Gencer « ≈0,92 » partout où elle apparaîtrait (elle n'apparaît pas dans les
formulations A/B/C du dossier initial, donc aucun changement de texte n'est requis de ce fait — la
correction ne concerne que la table de preuve interne).

**Déprescription — libellé provisoire proposé, à ne PAS encoder avant obtention du texte intégral
SAGA/SITE :**

> « Un essai randomisé récent (SAGA/SITE, 2026) suggère qu'un arrêt de statine à 75 ans ou plus, en
> prévention primaire stable, n'augmente pas la mortalité à 3 ans dans la population générale de
> l'essai (29,5 % de diabétiques). L'effet spécifique chez le sujet diabétique n'est pas encore
> confirmé avec certitude (analyse en sous-groupe non vérifiée à ce jour) — dans l'attente, la
> position de prudence du nœud (ne pas déprescrire hors changement de situation clinique) est
> maintenue, mais n'est plus la seule lecture possible de la littérature. »

**Action de suivi prioritaire** : demander au référent un accès personnel/institutionnel à *The
Lancet Healthy Longevity* pour lever le blocage sur SAGA/SITE (texte intégral, sous-groupe diabète)
avant toute décision d'encodage sur la déprescription — cf. `recherche-source-primaire`, réflexe
« demander au référent s'il a un accès personnel avant d'acter le report ».
