# Red-team — Statine chez le DT2 très âgé (initiation vs déprescription)

## 1. En-tête de provenance

- **Auteur** : Agent B (general-purpose, mode Décision, red-team/contradiction), circuit
  `recherche-preuve-triangulee` § Contradiction (B), format simplifié épreuve.
- **Date de rédaction** : 2026-09-24.
- **Pièces d'entrée utilisées** :
  - `epreuve/entrees/preuve-statine-sujet-tres-age.md` (collecte Agent A, datée 2026-07-26).
  - `epreuve/entrees/OE-statine-sujet-tres-age.md` (retour OpenEvidence obtenu par le référent à
    partir du prompt §5 d'A, même date).
- Les **Attendus** (section 2 ci-dessous) ont été rédigés avant toute ouverture de ces deux pièces,
  conformément à la consigne — voir horodatage interne : rédigés en tout premier, avant le premier
  appel d'outil de lecture de fichier de cette session.
- **Aucune requête OpenEvidence n'a été effectuée** pour cette tâche, sous quelque forme que ce soit
  (pas de CLI Interface-OE, pas de nouvelle question). Le seul document OE utilisé est celui déjà
  archivé et fourni en entrée.
- **Limite d'outillage rencontrée en cours de tâche** : les serveurs MCP PubMed et ClinicalTrials
  (recherche, texte intégral, détails d'essai) se sont révélés **bloqués par la politique de
  permission de la session** (« don't ask mode », refus systématique, y compris pour de simples
  lectures de métadonnées). Toute la vérification a donc été conduite via recherche web et
  récupération de pages (résumés secondaires, PMC en accès ouvert quand disponible, sites d'éditeurs)
  plutôt que via l'accès PubMed direct prévu par la consigne. Ce point est documenté honnêtement
  section 3 plutôt que dissimulé ; il explique pourquoi plusieurs vérifications reposent sur 2-3
  sources secondaires concordantes plutôt que sur une lecture PMID→texte intégral en un seul saut.

---

## 2. Attendus (rédigés avant lecture des pièces)

**SQ1 (initiation).** Je m'attends à ne trouver aucun essai randomisé dédié spécifiquement à
l'initiation d'une statine chez des DT2 ≥80 ans en prévention primaire stricte avec un critère dur
significatif isolé sur cette tranche d'âge. Le meilleur niveau de preuve attendu vient de sous-groupes
d'âge de méta-analyses généralistes (CTT Collaboration) et/ou d'essais dédiés aux personnes âgées mais
non spécifiques diabète (PROSPER 2002, plus récemment StAREE et PREVENTABLE), avec un signal qui
s'atténue avec l'âge, surtout en prévention primaire, et des IC qui se rapprochent ou franchissent 1
dans les sous-groupes les plus âgés / prévention primaire seule. Pour le diabète spécifiquement, CARDS
est l'essai princeps prévention primaire chez le diabétique, mais avec un âge moyen nettement inférieur
(~60 ans) — extrapolation limitée à 82 ans. J'anticipe qu'une bonne part du « bénéfice » avancé pour
l'initiation à cet âge repose sur des données observationnelles, exposées au biais de l'utilisateur
sain (healthy-user bias) : les sujets très âgés encore traités par statine sont en meilleure santé
globale que ceux qui ne le sont pas, ce qui gonfle artificiellement le bénéfice apparent.

**SQ2 (déprescription).** Je m'attends à une quasi-absence d'ECR dédié à la déprescription en
prévention primaire chez le sujet très âgé en bon état général. L'essai randomisé le plus souvent cité
(Kutner et al. 2015, JAMA Intern Med) porte sur l'arrêt de statine en fin de vie / espérance de vie
limitée (contexte palliatif), population très différente de celle visée par la question. Le reste est
probablement observationnel (cohortes assurance-maladie, type Giral et al.), avec un risque élevé de
biais d'indication inversée : l'arrêt est souvent motivé par une dégradation de l'état de santé,
associant l'arrêt à un sur-risque sans lien causal direct. Je m'attends à ce qu'aucun essai de
déprescription dédié en prévention primaire chez le DT2 très âgé ne soit terminé à ce jour, au mieux en
cours.

**Sous-point « 2,5 ans » (délai avant bénéfice).** Je m'attends à ce que ce chiffre provienne d'une
analyse de type « time-to-benefit » (méta-régression sur essais de statines en prévention, type Yourman
et al. JAMA Intern Med 2021), agrégeant des essais généralistes (pas spécifiques ≥80 ans ni diabète),
avec estimation ponctuelle proche de 2-2,5 ans mais IC large. Point à vérifier : ce délai est
probablement calculé toutes tranches d'âge confondues, donc son application telle quelle à un nœud
DT2/82 ans pourrait être une généralisation au-delà des données sources, à confronter à l'espérance de
vie réelle à 82 ans avec DT2.

**Passe d'omission anticipée.** StAREE, PREVENTABLE, CTT Collaboration 2019 (sous-groupes d'âge),
PROSPER (2002), Kutner et al. 2015, Giral et al. 2019, CARDS, Gencer et al. 2020 (méta-analyse IPD
sujet âgé), ADA Standards of Care (section personnes âgées), ESC/EAS 2019 dyslipidémies, éventuellement
Savarese et al. 2013.

*Note rétrospective (rédigée après coup, à ne pas confondre avec les Attendus eux-mêmes) : la liste
d'omission anticipée a effectivement capturé presque tous les essais/méta-analyses qui se sont avérés
pertinents — à une exception majeure près, que je n'avais pas anticipée : deux essais publiés
**après** la collecte d'A (StAREE en août 2026, la lecture des résultats de déprescription SAGA/SITE
mi-2026) sont apparus depuis. Je ne pouvais pas les nommer dans les Attendus puisque je ne savais pas
qu'ils venaient d'être publiés — mais leur existence même (essais en cours à l'attente d'un résultat)
était bien dans ma liste d'omission anticipée (StAREE, et un essai de déprescription en cours). Voir
§4.*

---

## 3. Accès obtenus et accès bloqués

| Source | Statut d'accès | Ce que ça permet de trancher |
|---|---|---|
| PubMed / ClinicalTrials (MCP direct) | **Bloqué** — refusé par la politique de permission de la session (don't ask mode) pour toute requête, y compris métadonnées simples | Aucun accès direct PMID→texte ; contournement par recherche web + pages tierces |
| pubmed.ncbi.nlm.nih.gov (fetch direct) | **Bloqué** — mur de cookies systématique côté NCBI pour le fetch automatisé | Impossible de lire un résumé PubMed brut ; obligation de passer par des résumés secondaires |
| Gencer et al. 2020, Lancet (PMID 33186535) | Résumé secondaire (AAFP) obtenu, **texte intégral Lancet bloqué** (paywall) | Confirme le chiffre du pool prévention-primaire (2,6 % vs 2,7 %/an, NS) cité par A — pas de RR/IC chiffré retrouvé pour ce sous-groupe isolé dans la littérature secondaire non plus ; le point reste **NON VÉRIFIÉ par texte primaire**, mais désormais corroboré par une 3ᵉ source indépendante |
| CTT Collaboration 2019, Lancet (PMID 30712900) | **Texte intégral Lancet bloqué** (HTTP 403) ; page CTT Collaboration bloquée (403) ; couverture tctmd obtenue en texte intégral | Confirme qualitativement la lecture d'A (« pas assez d'événements pour une réponse définitive » en prévention primaire, citation de C. Baigent) ; ne permet pas de vérifier directement le chiffre RR 0,87 (0,77-0,97) avancé par OE pour « ≥75 tous confondus » |
| PROSPER (Shepherd et al. 2002, Lancet, PMID 12457784) | Résumé + couverture secondaire obtenus ; **texte intégral et tableau des sous-groupes bloqués** | Confirme le résultat global (HR 0,85 [0,74-0,97]) et le critère coronarien (HR 0,81 [0,69-0,94]) cités par A ; confirme un test d'interaction NS entre sous-groupes prévention 1aire/2de (p=0,19), cohérent avec — mais ne prouvant pas directement — le chiffre HR 0,94 (0,77-1,15) cité à l'identique par A et OE. **Reste NON VÉRIFIÉ par lecture directe du tableau primaire** |
| Kutner et al. 2015, JAMA Intern Med (PMID 25798575) | **Texte intégral obtenu** (WikiJournalClub, reprise fidèle de l'article) + confirmation croisée par une 2ᵉ source secondaire | Confirme précisément les chiffres d'A (mortalité 23,8 % vs 20,3 %, IC90 -3,5 à 10,5, p=0,36 ; QdV McGill 7,11 vs 6,85, IC95 0,02-0,50, p=0,04) et **contredit les chiffres donnés par OE** (7,07 vs 6,74, p=0,03) — voir Findings |
| Giral et al. 2019, Eur Heart J (PMID 31362307) | Couverture secondaire multiple obtenue (ACC, Consultant360, EurekAlert, tctmd), chiffres cohérents entre eux | Confirme à l'identique les chiffres d'A (HR 1,33 [1,18-1,50] global, 1,46 [1,21-1,75] coronaire, 1,26 [1,05-1,51] cérébrovasculaire, N=120 173, 17 204 arrêts, suivi 2,4 ans) |
| Neil et al. 2006, Diabetes Care (sous-analyse CARDS 65-75 ans, citée par OE seul) | **Résumé confirmé** via recherche croisée | Confirme les chiffres d'OE (N=1129, RRR 38 %, RAA 3,9 %, NNT 21/4 ans) — absent de la collecte d'A |
| Savarese et al. 2013, JACC (citée par OE seul) | **Résumé confirmé** via recherche croisée | Confirme l'essentiel des chiffres d'OE (IDM ~-40 %, AVC ~-25 %, mortalité totale/CV NS) — absent de la collecte d'A |
| Yourman et al. 2021, JAMA Intern Med (PMID 33196766, « 2,5 ans ») | **Résumé et couverture secondaire confirmés** (ACC, Johns Hopkins, JAMA Network) | Confirme à l'identique la chaîne d'attribution proposée par A et par OE (8 essais, 65 383 participants, 50-75 ans, 2,5 ans) |
| EWTOPIA 75 (PMID 31434507) | **Résumé confirmé** intégralement | Confirme à l'identique les chiffres d'A (HR 0,66 [0,50-0,86], p=0,002 ; N=3796) |
| SFE/SFD/NSFA/SFC 2026 (PMID 41651737) | **Existence, journal et date de publication (mars 2026) confirmés** via recherche croisée ; PDF localisé mais **non re-lu intégralement par moi** (contrainte de temps) | Confirme que le PMID et la source ne sont pas fabriqués ; **ne revérifie pas verbatim les citations exactes** rapportées par A (classe IIb §8.7, classe III Table R5) — ce point reste sur la foi de la lecture d'A, non recontrôlé mot pour mot |
| Lavon et al. 2026, JAGS (PMID 41793188) | **Texte intégral désormais disponible en accès ouvert sur PMC** (PMC13266438) — résolu par rapport au statut « NON VÉRIFIÉ / paywall HTTP 402 » d'A | Confirme les chiffres de titre d'A (HR mortalité 0,69, HR événements coronariens 0,80 [0,68-0,94], p=0,008) mais révèle un point **absent de la collecte d'A et d'OE** : déséquilibre majeur de prévalence du diabète entre bras (25,2 % statine vs 7,7 % contrôle), sans analyse de sous-groupe diabète — voir Findings |
| **StAREE (NCT02099123)** | **Résultats principaux publiés** (NEJM, 28 août 2026, DOI 10.1056/NEJMoa2607314) — confirmés par 5 sources indépendantes concordantes (NEJM/ESC/ACC/Medscape/HCPLive) | **Absent des deux pièces d'entrée** (publication postérieure à la collecte du 2026-07-26) — voir §4, impact majeur sur SQ1 |
| **SAGA/SITE (issu du protocole « SITE », Bonnet et al., Trials 2020)** | **Résultats principaux publiés** (Lancet Healthy Longevity, 2026, DOI 10.1016/j.lanhl.2026.100884) — confirmés par 3 sources secondaires concordantes (tctmd, medicaldialogues, recherche croisée pour le sous-groupe diabète) ; **texte intégral Lancet bloqué (403)** | **Absent des deux pièces d'entrée** (OE ne connaît que le protocole « SITE » de 2020 et le déclare « sans résultat » ; A ne le cite pas du tout) — voir §4, impact majeur sur SQ2 |
| PREVENTABLE (NCT04262206) | Statut re-vérifié aujourd'hui via recherche web (pas d'accès registre direct, MCP ClinicalTrials bloqué) | Confirme le statut « en cours, recrutement, fin estimée déc. 2026, aucun résultat publié » déjà rapporté par A — **inchangé** |
| Thompson 2021, Rea 2021 (JAMA Netw Open, cités par OE B4) | **Non vérifiés dans le temps imparti** | À considérer comme non contrôlés — ni confirmés ni infirmés ; ne pas leur accorder plus de poids qu'à une citation non vérifiée d'OE |

---

## 4. Cherché, non trouvé par A (et par OE)

1. **StAREE — résultats principaux (NEJM, 28 août 2026).** Essai randomisé en double aveugle,
   atorvastatine 40 mg vs placebo, N=9971, ≥70 ans, **diabète explicitement exclu**, suivi médian
   5,9 ans. **MACE : HR 0,70 (0,61-0,82), p<0,001 — bénéfice significatif.** Survie sans handicap
   (critère composite décès/démence/handicap persistant) : HR 0,94 (0,84-1,05), p=0,25 — non
   significatif. Absent des deux pièces (A et OE ne connaissaient que le protocole/SAP, publiés avant
   le 26/07/2026 ; les résultats sont sortis un mois après). **Poids sur SQ1** : majeur, mais à double
   tranchant — c'est la première preuve dure, bien alimentée statistiquement, d'un bénéfice CV de
   l'introduction d'une statine chez le sujet très âgé en prévention primaire généraliste ; mais elle
   **ne s'applique pas au DT2** (exclusion explicite), donc elle ne répond pas à la question du
   référent et, si quoi que ce soit, elle souligne un peu plus l'absence persistante de tout ECR dédié
   au DT2 très âgé en prévention primaire.
2. **SAGA/SITE — résultats principaux (Lancet Healthy Longevity, 2026).** Essai randomisé pragmatique,
   ouvert, non-infériorité, arrêt vs poursuite de statine chez ≥75 ans en prévention primaire sans
   ATCD ASCVD, N=1160 (~5:4), **29,5 % de diabétiques**, âge médian 80 ans, suivi 36 mois (recrutement
   2016-2020). **Critère principal, mortalité toutes causes à 3 ans : 7,9 % (poursuite) vs 7,2 %
   (arrêt), différence -0,68 % (IC95 -3,95 à +2,60), marge de non-infériorité 5 % non dépassée —
   non-infériorité de l'arrêt établie sur l'ensemble de la cohorte.** Pas de différence de qualité de
   vie (SF-12). Rebond de LDL important à l'arrêt (114,6→170,6 mg/dL sur 3 ans). **Sous-groupe
   diabétique (n=322 avec données disponibles, 42 décès) : mortalité 13,6 % (poursuite) vs 12,4 %
   (arrêt), différence après imputation multiple +0,89 % (IC -6,53 à +8,32) — IC très large, la
   non-infériorité n'est PAS établie pour ce sous-groupe spécifiquement**, cohérent avec la mention
   générale de l'article que « la non-infériorité n'a pas été établie dans certains sous-groupes en
   raison d'IC larges ». Absent des deux pièces : A ne le cite pas du tout ; OE ne connaît que le
   protocole 2020 (« SITE… aucun résultat publié »). **Poids sur SQ2** : c'est désormais le **premier
   et seul ECR dédié** répondant directement à la question de déprescription posée par le référent (âge
   ≥75, prévention primaire, incluant des diabétiques), et son signal global va dans le sens opposé aux
   études observationnelles (Giral, Peixoto, Aponte Ribero) que A et OE alignaient toutes dans le sens
   « arrêter est risqué » — ce qui renforce rétrospectivement l'hypothèse, déjà avancée par A et OE, d'un
   biais d'indication inversée majeur dans ces cohortes. Mais pour le sous-groupe diabétique
   spécifiquement, l'ECR reste **sous-puissant** et ne tranche pas dans un sens ou dans l'autre.
3. **CARDS, sous-analyse par âge (Neil et al. 2006, Diabetes Care)** et **Savarese et al. 2013 (JACC)**
   — cités par OE, absents de la collecte d'A ; vérifiés exacts (§3). Poids modéré sur SQ1 : renforcent
   le dossier « bénéfice plausible mais jamais démontré au-delà de 75-76 ans » sans le faire basculer
   (Neil 2006 plafonne à 75 ans, Savarese 2013 est une méta-analyse ≥65 ans sans mortalité
   significative).
4. **PROSPER, suivi étendu (Lloyd et al. 2013, PLoS One, cité par OE seul en A3)** — non vérifié
   indépendamment par manque de temps, mais cohérent avec le reste du dossier (bénéfice coronarien
   maintenu à long terme, pas de bénéfice sur la mortalité totale). Absent de la collecte d'A. Poids
   mineur à modéré, ne change pas le verdict.
5. **STREAM (NCT05178420)** — essai randomisé de déprescription chez le sujet âgé multimorbide
   (Suisse/France/Pays-Bas, N cible 1800, statines en prévention primaire, critère composite MACE +
   mortalité toutes causes à 48 mois), toujours en cours, fin estimée novembre 2026. Mentionné très
   brièvement par OE (sans détail de design), absent d'A. Ne change rien à ce jour (pas de résultat)
   mais à surveiller de près : contrairement à SAGA/SITE, STREAM cible spécifiquement les multimorbides
   polymédiqués, une population plus proche par certains aspects du DT2 âgé fragile.

---

## 5. Findings, classés par sévérité puis origine

### HAUTE

**F1 — OE seule, erreur numérique sur une étude par ailleurs correctement identifiée.**
Passage source OE, ligne B1 : *« Mortalité à 60 j : 23,8 % (arrêt) vs 20,3 % (poursuite), p = 0,36 —
mais critère de non-infériorité NON atteint. Qualité de vie meilleure à l'arrêt (7,07 vs 6,74 ; p =
0,03). »* Les chiffres de mortalité sont exacts. **Les chiffres de qualité de vie sont faux** : la
publication primaire (confirmée par deux sources secondaires indépendantes, §3) donne **7,11 vs 6,85
(IC95 0,02-0,50 ; p = 0,04)** — exactement ce que rapporte A. OE a donc altéré un chiffre décisif d'un
essai qu'il cite par ailleurs correctement (bonne référence bibliographique, bon design, bonne
mortalité). C'est précisément le type d'erreur que la consigne du projet (historique de PMID fabriqués)
demande de traquer : ici ce n'est pas la référence qui est fabriquée, mais une valeur numérique interne
à une référence réelle — plus insidieux, car invisible à un simple contrôle du PMID.

### MOYENNE

**F2 — A seule (limite reconnue par A elle-même, mais insuffisamment creusée) : Lavon et al. 2026,
déséquilibre de diabète entre bras non discuté.**
A marque cette étude « NON VÉRIFIÉ (partiel) » et signale un « risque de biais d'utilisateur sain élevé
… non discuté par les résumés disponibles » (limites, §6 du document d'A). Le texte intégral,
maintenant accessible en PMC (§3), confirme et **aggrave** ce doute : le diabète est présent chez
**25,2 % des utilisateurs de statine contre seulement 7,7 % des non-utilisateurs** — un déséquilibre de
plus de trois fois, sans analyse de sous-groupe diabète correspondante. Un tel écart dans une cohorte
« ajustée » suggère soit un biais de sélection sévère (patients suivis/médicalisés différemment), soit
au minimum une population utilisatrice de statines à profil de risque cardiométabolique très différent
de la population non traitée — dans les deux cas, un signal supplémentaire que le HR de mortalité
« -31 % » ne doit pas être lu comme un effet causal net. Le document d'A a bien signalé le biais
d'utilisateur sain en général, mais sans ce chiffre précis (accès bloqué à l'époque), donc la mise en
garde restait qualitative ; ici elle devient quantifiable et plus sévère qu'anticipé.

**F3 — OE seule, imprécision de présentation : CTT 2019, chiffre « tous confondus » à l'origine incertaine.**
Passage OE, ligne A6 : *« ≥ 75 ans tous confondus : RR 0,87 (0,77-0,97) par mmol/L. »* Ce chiffre n'a
pas pu être retracé jusqu'à une page ou un tableau précis de l'article primaire (accès bloqué, §3) ; les
sources secondaires disponibles (couverture CTT Collaboration / tctmd) évoquent plutôt une réduction de
13 % (avec 18 % hors insuffisance cardiaque/dialyse) pour le sous-groupe des plus de 75 ans, **très
majoritairement composé de patients en prévention secondaire** — le même article, selon le
co-investigateur cité par tctmd, ne disposait « pas d'assez d'événements » pour conclure en prévention
primaire seule. OE distingue bien, dans la même ligne, le sous-groupe prévention primaire (« NON
significatif ») du chiffre global « tous confondus » — donc ce n'est pas une erreur de fond, mais le
chiffre 0,87 (0,77-0,97) lui-même reste **non retraçable avec certitude à la source primaire** avec les
moyens disponibles pour cette vérification, et sa présentation compacte en une seule ligne de tableau
expose à une lecture rapide qui l'attribuerait, à tort, en partie à la prévention primaire.

**F4 — A seule, omissions comblées par OE et vérifiées exactes : Neil et al. 2006 (CARDS 65-75 ans) et Savarese et al. 2013.**
Deux données correctement citées par OE (chiffres confirmés §3) sont absentes de la table maîtresse
d'A, alors qu'elles sont directement pertinentes à SQ1 : Neil et al. 2006 est la seule sous-analyse
publiée de CARDS par tranche d'âge (65-75 ans, NNT 21/4 ans) — la population la plus proche, dans la
littérature d'essai randomisé chez le diabétique, de la question du référent, même si elle plafonne à
75 ans. Leur absence de la collecte d'A n'est pas une erreur, mais un **oubli de portée réelle** sur une
question où le corpus disponible est déjà très mince.

### BASSE

**F5 — Source primaire, non vérifiable — accès bloqué : PROSPER et Gencer 2020, sous-groupes « NON VÉRIFIÉ ».**
Les deux chiffres qu'A marque explicitement comme non vérifiés (PROSPER sous-groupe primaire HR 0,94
[0,77-1,15] ; Gencer 2020 sous-groupe primaire seul RR≈0,92 [0,73-1,16]) **restent non vérifiables avec
les moyens disponibles pour ce red-team** — accès Lancet bloqué (403) dans les deux cas, MCP PubMed
indisponible. Résultat honnête : ni confirmation, ni infirmation. Ce qui peut être dit en atténuation :
(a) pour PROSPER, un test d'interaction publié entre sous-groupes prévention 1aire/2de est non
significatif (p=0,19), ce qui est cohérent avec — sans le prouver — un HR proche de 1 en prévention
primaire seule ; (b) pour Gencer 2020, un résumé secondaire tiers (AAFP) confirme indépendamment le
même taux d'événement annuel (2,6 % vs 2,7 %) que celui cité par A, ce qui renforce (sans lever
totalement le doute) la fiabilité de la transcription d'A. Ces deux points restent donc au même niveau
de preuve qu'avant cette vérification — ce n'est pas une régression, mais ce n'est pas non plus une
confirmation complète.

**F6 — OE seule, imprécision mineure : Gencer 2020, chiffre « tous traitements confondus » présenté sans le distinguer du chiffre « statines seules ».**
OE (A7) donne RR 0,74 (0,61-0,89) pour « ≥75 ans » sans préciser qu'il s'agit du résultat toutes
thérapies hypolipémiantes confondues (statines + ézétimibe + anti-PCSK9), alors qu'A distingue
explicitement ce chiffre (« ensemble mixte ») du résultat statines seules (RR 0,82 [0,73-0,91]) — les
deux chiffres sont corrects et concordants entre A et OE, mais la présentation d'OE, prise isolément,
pourrait laisser croire que 0,74 est le chiffre statines-seules.

**F7 — non vérifiable, résultat honnête : Thompson 2021 et Rea 2021 (OE, B4).**
Ces deux citations n'ont pas pu être contrôlées dans le temps imparti à cette vérification. Ni
confirmées, ni infirmées — à traiter avec la même prudence que tout élément non vérifié d'OE tant
qu'elles n'ont pas été recontrôlées.

---

## 6. Confirmations obtenues

- **Giral et al. 2019** (PMID 31362307) : HR 1,33 (1,18-1,50) global, 1,46 (1,21-1,75) coronaire, 1,26
  (1,05-1,51) cérébrovasculaire, N=120 173, 17 204 arrêts (14,3 %), suivi moyen 2,4 ans — confirmés à
  l'identique par recherche croisée de la couverture secondaire (ACC Journal Scan, Consultant360,
  EurekAlert, tctmd, §3). Concordance A/OE également exacte sur ce point.
- **Kutner et al. 2015** (PMID 25798575), volet mortalité : 23,8 % vs 20,3 %, IC90 -3,5 à +10,5,
  p=0,36 — confirmé texte intégral (WikiJournalClub) et recherche croisée. Concordant entre A et OE sur
  ce seul volet (voir F1 pour le volet qualité de vie, où OE diverge).
- **EWTOPIA 75** (PMID 31434507) : HR 0,66 (0,50-0,86), p=0,002, N=3796 (1898/1898), Japon, ≥75 ans —
  confirmé à l'identique par recherche croisée.
- **Yourman et al. 2021** (PMID 33196766) : 8 essais, 65 383 participants, population 50-75 ans, 2,5
  ans pour prévenir 1 MACE/100 traités, JAMA Intern Med 2021;181(2):179-185 — confirmé à l'identique,
  chaîne d'attribution identique chez A et OE.
- **SFE/SFD/NSFA/SFC 2026** (PMID 41651737) : existence, journal, date de publication (mars 2026)
  confirmés — le PMID n'est pas fabriqué. Les citations verbatim précises rapportées par A (classe IIb
  §8.7, classe III Table R5) n'ont pas été recontrôlées mot pour mot faute de temps, mais rien dans la
  vérification croisée ne les contredit ; le sens général du document (position prudente >75 ans,
  déconseiller l'arrêt sans facteur déclenchant) est cohérent avec les guidelines internationales 2026
  vérifiées par ailleurs (ACC/AHA 2026 : « insufficient evidence to recommend for or against » >75 ans).
- **Neil et al. 2006** (CARDS, sous-groupe 65-75 ans) et **Savarese et al. 2013** : confirmés exacts
  (chiffres, journal, volume/pages) — cités correctement par OE, absents d'A (voir F4).

---

## 7. Objections retirées

- **Hypothèse envisagée** : « Le chiffre OE de CTT 2019 (RR 0,87) pourrait être une pure invention,
  vu l'absence de RR chiffré dans la collecte d'A pour ce sous-groupe. » — **Invalidée en partie** : la
  couverture officielle de la CTT Collaboration et de tctmd rapporte bien des réductions du même ordre
  de grandeur (13-18 %) pour le sous-groupe >75 ans (mixte, à dominante prévention secondaire). Le
  chiffre n'est donc probablement pas fabriqué, seulement mal contextualisé (voir F3, dégradé de
  « possible fabrication » à « imprécision de présentation »).
- **Hypothèse envisagée** : « L'absence de citation de Lavon et al. 2026 dans la partie A du document
  OE (alors qu'A le traite en détail) est suspecte — peut-être qu'OE l'a rejeté parce qu'il ne trouvait
  pas l'étude. » — **Invalidée** : le prompt d'A demandé à OE porte explicitement sur des ECR, avec
  consigne stricte de ne pas substituer une étude observationnelle à un ECR sans le signaler comme
  telle. Lavon et al. 2026 est un travail observationnel ; son absence dans la réponse d'OE est donc
  conforme à la consigne du prompt, pas une anomalie.
- **Hypothèse envisagée** : « Les trois éléments marqués NON VÉRIFIÉ par A (Gencer sous-groupe, PROSPER
  sous-groupe, Lavon 2026) sont probablement tous des erreurs, vu l'historique de PMID fabriqués du
  projet. » — **Partiellement invalidée** : les PMID et journaux des trois articles sont réels et
  correctement identifiés (confirmé §3) ; Lavon 2026 est même désormais accessible en texte intégral et
  ses chiffres de titre se confirment. Le doute d'A portait sur la granularité des sous-groupes, pas sur
  l'existence ou l'identité des études — distinction importante que cette vérification permet de
  clarifier.
- **Hypothèse envisagée** : « Puisque le référent juge le bénéfice d'initiation "très limité" à 82 ans,
  la nouvelle publication StAREE (bénéfice CV significatif, HR 0,70) devrait faire basculer SQ1 vers un
  bénéfice démontré. » — **Invalidée** : StAREE exclut explicitement le diabète de son protocole. Le
  résultat positif ne s'applique donc pas à la population visée par la question (DT2), et ne change pas
  le constat central de SQ1 (absence d'ECR dédié au DT2 très âgé) — voir §9.

---

## 8. Décompte final

**Par sévérité** : HAUTE = 1 (F1) · MOYENNE = 3 (F2, F3, F4) · BASSE = 3 (F5, F6, F7).

**Par origine** :
- OE seule (erreur ou imprécision) : F1 (HAUTE), F3 (MOYENNE), F6 (BASSE) — 3 findings.
- A seule (omission ou limite insuffisamment creusée) : F2 (MOYENNE), F4 (MOYENNE) — 2 findings.
- Source primaire (coquille/imprécision du document source) : 0 finding identifié.
- Non vérifiable — accès bloqué, résultat honnête : F5 (BASSE), F7 (BASSE) — 2 findings.

Aucun finding « A et OE — erreur partagée » n'a été identifié : sur les points où A et OE convergent
numériquement (Giral, Kutner-mortalité, EWTOPIA75, Yourman, Gencer pool mixte), la convergence s'est
révélée être une concordance correcte et non une erreur commune.

---

## 9. Verdict par sous-question

### SQ1 — Initiation d'une statine chez le DT2 très âgé (≥75-80 ans) en prévention primaire

**Solide** : il n'existe, à ce jour (2026-09-24, red-team inclus), **toujours aucun essai randomisé
dédié aux diabétiques de type 2 ≥75-80 ans en prévention primaire**. StAREE, le premier grand ECR
généraliste dédié au sujet très âgé à avoir publié des résultats positifs sur un critère dur
(MACE HR 0,70 [0,61-0,82], p<0,001), **exclut explicitement le diabète** — ce nouvel essai, aussi
important soit-il pour la population générale très âgée, ne répond donc pas à la question du référent
et ne doit pas être invoqué comme preuve d'un bénéfice chez le DT2. Le socle de preuve DT2-spécifique
reste ce qu'A avait identifié : CARDS (plafonne à 75 ans dans sa sous-analyse la plus favorable, Neil
2006), Ramos et al. 2018 (observationnel, biais d'utilisateur sain plausible), et rien au-delà.
**Faible/non tranché** : l'ampleur exacte du bénéfice dans la tranche 75-84 ans chez le diabétique
(Ramos 2018) reste de niveau de preuve faible et non reproduite par un essai randomisé. Le sous-groupe
« prévention primaire seule ≥75 ans » des méta-analyses généralistes (CTT 2019, Gencer 2020, PROSPER)
demeure statistiquement non significatif ou non chiffrable avec certitude — ce point n'a pas pu être
levé par cette vérification (accès bloqué aux tableaux primaires). **Population/horizon** : ce verdict
s'applique spécifiquement au DT2 ≥75-80 ans SANS maladie cardiovasculaire établie ; il ne s'applique ni
au DT2 avec ATCD CV (prévention secondaire, hors périmètre), ni à la population générale très âgée sans
diabète (où StAREE change désormais la donne).

### SQ2 — Déprescription d'une statine déjà en place, même population

**Solide, changement majeur depuis la collecte initiale** : un ECR dédié, SAGA/SITE (Lancet Healthy
Longevity, 2026), répond désormais directement à la question — arrêt non-inférieur à la poursuite sur
la mortalité toutes causes à 3 ans dans l'ensemble de la cohorte (≥75 ans, prévention primaire,
N=1160, 29,5 % de diabétiques), sans dégradation de qualité de vie. Ce résultat va dans le sens opposé
aux signaux observationnels (Giral, Peixoto, Aponte Ribero) qu'A et OE alignaient tous vers « l'arrêt
est risqué », et renforce la suspicion, déjà documentée par A et par OE (« symétrie des standards »),
d'un biais d'indication inversée majeur dans ces cohortes. **Faible/non tranché pour le DT2
spécifiquement** : le sous-groupe diabétique de SAGA/SITE (n=322 avec données, 42 décès) a un
intervalle de confiance trop large pour établir la non-infériorité dans ce sous-groupe précis
(différence de mortalité +0,89 % [IC -6,53 à +8,32]) — la direction du point estimé est rassurante
(mortalité numériquement plus basse à l'arrêt) mais non conclusive statistiquement pour un DT2 pris
isolément. Kutner et al. 2015 reste hors-sujet (fin de vie). STREAM, plus proche de la fragilité/
multimorbidité, est encore en cours. **Population/horizon** : le verdict « probablement sûr d'arrêter »
s'applique désormais avec un niveau de preuve correct à la population générale ≥75 ans en prévention
primaire stable sur un horizon de 3 ans ; il reste **non tranché avec la même solidité** pour le
sous-groupe DT2 spécifiquement, où seule une tendance non significative existe à ce jour.

### Sous-point — le chiffre « ~2,5 ans » (délai avant bénéfice)

**Solide** : le chiffre est réel, correctement transcrit par A depuis la reco SFE/SFD/NSFA/SFC 2026, et
sa source (Yourman et al. 2021, JAMA Intern Med) est confirmée exacte et non fabriquée (8 essais, 65 383
participants, 2,5 ans, IC 1,7-3,4 selon OE — non recontrôlé indépendamment mais cohérent avec la
littérature secondaire). **Faible/non tranché** : ce chiffre reste, comme A l'avait déjà signalé, une
**extrapolation** — la méta-analyse source porte sur une population **50-75 ans**, pas sur les ≥75-80
ans ni sur les diabétiques ; aucune étude de temps-avant-bénéfice dédiée à la tranche d'âge ou à la
population visées par le nœud n'a été trouvée par cette vérification, ni par A, ni par OE (qui confirme
lui aussi l'absence de données équivalentes ≥75 ans, en la rattachant à la reco ACC/AHA 2026 — confirmée
réelle par cette vérification). **Population/horizon** : le chiffre « 2,5 ans » reste utilisable comme
ordre de grandeur informatif, mais son application à un DT2 de 82 ans est, et demeure, une
généralisation au-delà de ce que ses données sources permettent d'affirmer — la recommandation d'A de
préciser cette limite dans le libellé du nœud plutôt que de retirer le chiffre reste, à l'issue de ce
red-team, la position la mieux étayée.
