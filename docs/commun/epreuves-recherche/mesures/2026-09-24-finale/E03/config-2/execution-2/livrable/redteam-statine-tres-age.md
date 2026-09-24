# Red-team (Agent B) — statine chez le DT2 très âgé (≥ 75-80 ans), initiation vs déprescription

## 1. En-tête de provenance

**Outils disponibles** (constatés par appel, pas supposés) : `WebFetch`, `WebSearch`, `Read`, `Write`,
`Edit`, `Grep`, `Glob`, `Artifact*`, `Agent`, `Skill`, `ToolSearch`.

**Absents, malgré leur présence dans la liste des outils différés** : `Bash` n'apparaît dans aucune
recherche d'outil (`identite.mjs` n'a donc **pas pu être exécuté** — aucun `node` disponible). Tous
les outils MCP listés comme différés (`mcp__claude_ai_PubMed__*`, `mcp__claude_ai_Clinical_Trials__*`,
`mcp__claude_ai_Consensus__*`, `mcp__claude_ai_Exa__*`, etc.) ont été **testés et refusés** : deux
appels de sonde (`PubMed:get_article_metadata`, `Clinical_Trials:search_trials`) ont retourné
`Permission ... denied ... don't ask mode`. Conclusion : cette session n'a **aucun accès PubMed/
ClinicalTrials.gov/Consensus en direct**, contrairement à ce que la liste d'outils différés laissait
espérer.

**Palliatif adopté** : les « voies ouvertes » d'`acces-identite.md` §5 ont été interrogées **directement
par leurs API publiques via `WebFetch`** plutôt que par `identite.mjs` : `api.unpaywall.org`,
`pmc.ncbi.nlm.nih.gov/tools/idconv` (PMID→PMCID), `www.ebi.ac.uk/europepmc/webservices/rest` (texte
intégral XML des copies ouvertes), `api.crossref.org` (rétractation/correction). C'est un substitut
fonctionnellement proche mais **non identique** à `identite.mjs` (pas de recoupement automatique
multi-source en un seul rapport, pas de détection de divergence intégrée) — à signaler au référent
comme une limite technique de cette passe, pas une impossibilité de principe.

**Mode** : Décision (module DT2, nœud `statine.yaml`).
**Date** : 2026-09-24.

**Ce qui a été lu, dans l'ordre** :
1. `contradiction.md` et `acces-identite.md` (méthode) — en entier, avant tout le reste.
2. Rédaction de la section « Attendus » (ci-dessous), **avant** ouverture des deux dossiers d'entrée.
3. Passe d'omission (§2 de `contradiction.md`) : recherches web bornées sur StAREE, PREVENTABLE,
   PROSPER, CTT 2019, Gencer 2020, registres d'essais de déprescription — **sans avoir lu A ni OE**.
4. `epreuve/entrees/preuve-statine-sujet-tres-age.md` (collecte Agent A).
5. `epreuve/entrees/OE-statine-sujet-tres-age.md` (retour OpenEvidence).
6. Re-vérifications ciblées (étapes 4-6 de la consigne) : Unpaywall/PMC/Europe PMC/Crossref sur
   Gencer 2020, PROSPER, Lavon 2026, CTT 2019, Lavon, Savarese 2013, Neil 2006, SAGA/SITE, STREAM,
   Thompson 2021, Rea 2021, Kutner 2015, PREVENTABLE (statut).

---

## 2. Attendus (rédigés avant ouverture d'A et d'OE)

### SQ1 — initiation chez le DT2 ≥ 75-80 ans, prévention primaire

- **Critères attendus** : un critère dur (mortalité totale, mortalité CV, IDM, AVC), pas seulement le
  LDL. Je m'attends à ce qu'aucun essai ne soit *dédié* à la population exacte (DT2 ET ≥ 75-80 ans ET
  prévention primaire pure) — c'est une intersection rare.
- **Chiffres attendus et où ils devraient se trouver** : sous-groupes d'âge dans les méta-analyses
  d'IPD (CTT, Gencer) — généralement en figure/tableau de forest plot par tranche d'âge, rarement
  isolés en primaire pure ; tableau de sous-groupe dans PROSPER (comparateur prévention 1aire vs
  établie) ; sous-groupe d'âge de CARDS (le seul essai diabète-spécifique de prévention primaire).
- **Réserves attendues** : (a) CARDS et HPS plafonnent probablement autour de 75-80 ans en âge
  maximal d'inclusion, donc n'atteignent pas vraiment la tranche visée ; (b) toute cohorte
  observationnelle d'initiation est exposée au **biais de l'utilisateur sain** (« healthy-user/
  healthy-adherer bias ») qui gonfle le bénéfice apparent ; (c) horizon : les essais anciens ont des
  suivis courts (3-5 ans), insuffisants pour juger un délai avant bénéfice chez le très âgé si celui-ci
  est plus long qu'en population générale ; (d) risque compétitif de mortalité non-CV élevé à cet âge,
  diluant l'effet relatif d'un traitement CV.
- **Études attendues** : StAREE, PREVENTABLE, PROSPER (sous-groupe 1aire), CTT 2019, Gencer 2020,
  CARDS (sous-groupe d'âge s'il existe), HOPE-3/JUPITER (non diabète-spécifiques, probablement hors
  périmètre). Je ne m'attends *pas* à trouver un essai positif dédié — je m'attends à un verdict
  « absence de preuve directe, extrapolation de sous-groupes ».

### SQ2 — déprescription chez le même patient

- **Critères attendus** : mortalité toutes causes (critère de sécurité prioritaire pour une question de
  retrait), événements CV, qualité de vie (pertinente si horizon de vie court).
- **Chiffres attendus** : je m'attends à ce que le **seul ECR existant** soit Kutner 2015 — population
  de fin de vie, donc **non transposable** à un DT2 stable de 82 ans. Je m'attends à ce que tout le
  reste soit observationnel.
- **Réserves attendues** : le design « cohorte de patients qui arrêtent en pratique réelle » est
  structurellement exposé au **biais d'indication inversée** (« sick-stopper bias ») — un patient dont
  l'état se dégrade est plus susceptible de voir son traitement arrêté, ce qui fait apparaître un
  surrisque à l'arrêt même si le médicament n'y est pour rien. Je m'attends à ce que ce biais soit
  reconnu par les auteurs eux-mêmes dans au moins une étude.
- **Études attendues** : Kutner 2015 (ECR, fin de vie), Giral 2019 (cohorte française), Peixoto 2024
  (revue systématique). Je ne connais pas a priori d'ECR de déprescription dédié à une population
  générale ≥ 75 ans en bon état — **si un tel essai existe et a publié des résultats, ce serait le fait
  le plus important de toute cette passe**, à chercher activement dans la passe d'omission.

### SQ3 — le chiffre « ~2,5 ans » (délai avant bénéfice)

- **Critère attendu** : un chiffre de type « time to benefit » (nombre d'années de traitement avant
  qu'un événement soit évité), méthode de type Yourman/Lee (bornes de survie).
- **Chiffre attendu et où il devrait se trouver** : une méta-analyse de type Yourman et al. — je
  m'attends à ce qu'elle porte sur une population **plus jeune que 75-80 ans** (ces méta-analyses de
  temps-avant-bénéfice sont généralement construites à partir des grands essais historiques, dont l'âge
  moyen est souvent 55-70 ans), ce qui rendrait la transposition au ≥ 75-80 ans une **extrapolation**, à
  moins qu'une méta-analyse spécifique au grand âge n'existe (je ne m'attends pas à en trouver une).
- **Réserve attendue** : le nœud devrait le signaler comme une extrapolation plutôt que comme une mesure
  directe.

### SQ4 — symétrie Ramos/Giral (point de méthode)

- **Attendu méthodologique** : le biais de l'utilisateur sain (cohortes d'initiation, type Ramos) et le
  biais d'indication inversée / « sick-stopper » (cohortes de déprescription, type Giral) sont deux
  manifestations d'un **même phénomène de fond** — l'état de santé sous-jacent pilote à la fois la
  probabilité de *rester/démarrer* un traitement préventif et la probabilité de *l'arrêter* — et les
  deux biais **poussent dans le même sens** (statine = paraît bénéfique). Je m'attends donc à ce
  qu'un contradicteur rigoureux ne puisse pas accepter l'un sans appliquer le même degré de méfiance à
  l'autre. Je m'attends aussi à ce qu'il existe une nuance légitime : les deux biais n'ont pas
  nécessairement la **même magnitude** (l'indication inversée à l'arrêt est souvent plus brutale/
  proximale — un arrêt déclenché par une dégradation aiguë — que le biais de sélection à l'entrée), donc
  un traitement « également sceptique mais pas forcément identique en poids » pourrait se défendre s'il
  est justifié par une preuve interne de la magnitude du biais (par exemple un résultat implausible dans
  l'étude elle-même). Je m'attends à devoir trancher au cas par cas, pas par principe général.

---

## 3. Accès obtenus et bloqués

| Étude / source | Voie(s) tentée(s) | État d'accès obtenu | Lu ou non |
|---|---|---|---|
| **Gencer et al. 2020** (PMID 33186535, DOI 10.1016/S0140-6736(20)32332-1) | Unpaywall → PMC idconv → Europe PMC fullTextXML (PMC8015314) | **texte intégral accessible** (copie NIH manuscript, `oa_status: green`) | **Lu** : le texte ne fournit **aucun** RR isolé pour le sous-groupe « > 75 ans ET prévention primaire seule » (voir Finding H1). RR mortalité CV ≥75 = 0,85 (0,74-0,98) confirmé mot pour mot. |
| **PROSPER** (PMID 12457784, DOI 10.1016/S0140-6736(02)11600-X) | Unpaywall (`closed`) → page éditeur Lancet (non tentée séparément, DOI fermé confirmé) → Lloyd et al. 2013 PLoS One (suivi étendu, PMC3759378, texte intégral libre) | `paywall constaté` sur Unpaywall pour le texte princeps (`oa_status: closed`, aucune copie légale connue) ; **texte intégral accessible** pour le suivi étendu (PLOS, en libre accès total) | Suivi étendu **lu** : ne fournit **pas non plus** de HR de mortalité isolé pour le sous-groupe prévention primaire (le papier stratifie par « antécédent vasculaire » seulement sur le critère coronaire composite, pas sur la mortalité). Le chiffre HR 0,94 (0,77-1,15) et le RR mortalité 1,07 (0,86-1,35) restent **non retrouvés dans un texte primaire ouvert** — `accès restant à vérifier` sur le tableau supplémentaire du princeps (payant, non tenté au-delà d'Unpaywall faute de budget). |
| **Lavon et al. 2026** (PMID 41793188, DOI 10.1111/jgs.70375) | Unpaywall (`hybrid`, ouvert depuis 2026-03-07) → PMC idconv (PMC13266438) → Europe PMC fullTextXML | **texte intégral accessible** (CC-BY-NC-ND, Wiley hybrid + copie PMC) | **Lu** : chiffres de titre confirmés (mortalité HR 0,69 [0,64-0,98] = -31 % ; événements coronariens HR 0,80 [0,68-0,94] = -20 %). Diabète 25,2 % (statine) vs 7,7 % (témoins) — **déséquilibre marqué**, pas de sous-groupe diabète rapporté (voir Finding H2). **Contredit le report d'A** (« paywall HTTP 402 constaté ») — l'article est en réalité ouvert depuis mars 2026, avant la date de la collecte d'A (2026-07-26). |
| **CTT 2019** (PMID 30712900, DOI 10.1016/S0140-6736(18)31942-1) | PMC direct (bloqué par reCAPTCHA, `échec technique`) → page éditeur Lancet PDF (`HTTP 403`, `échec technique` — pas de paywall vu, juste un blocage serveur) → Europe PMC fullTextXML (PMC6429627) | **texte intégral accessible** via Europe PMC (prose complète) mais **extraction de tableaux/figures incomplète** — les valeurs de forest plot par tranche d'âge ne sont pas rendues en texte par cette voie | **Lu** (prose) : confirme la citation d'A mot pour mot (« there is less direct evidence of benefit among patients older than 75 years... », « only around a fifth of the major vascular events occurred in those with no history of vascular disease »). **Aucun RR isolé chiffré retrouvé dans le texte pour le sous-groupe primaire-seul >75** avec cette méthode d'extraction — cohérent avec A, mais je n'ai pas pu lire le tableau/figure lui-même (limite d'outil, pas verdict d'absence certain). |
| **SAGA/SITE** (PMID 42580354, DOI 10.1016/j.lanhl.2026.100884, *Lancet Healthy Longevity*) | Page éditeur Lancet (`HTTP 403`, `échec technique`) → 4 résumés de presse indépendants et concordants (Healio, STAT News, Medical Xpress, MedicalDialogues) | `résumé accessible` uniquement (texte primaire non ouvert malgré la tentative) | **Non lu en texte intégral** — chiffres obtenus par triangulation de 4 relais concordants (voir §5, finding majeur). % diabète (~30 %) rapporté par **un seul** des quatre relais (Healio) — `non confirmé` par les trois autres, qui ne mentionnent pas le diabète. |
| **STREAM** (protocole, PMID 40409969, PMC12104904) | PMC/PubMed (repéré par recherche web) | **résumé et protocole accessibles** | Lu : protocole seul, N=1800 prévus, Suisse/France/Pays-Bas, recrutement débuté nov. 2021, suivi jusqu'à 2026. **Aucun résultat publié à ce jour** — confirme OE, pas d'omission ici. |
| **Savarese et al. 2013** (JACC 62(22):2090-9) | Recherche web (identifiant PMID divergent selon les sources : 23994398 / 23994397 / 23954343 vus dans des résultats successifs) | **identité non stabilisée** — ambiguïté d'identifiant non résolue faute d'accès E-utilities direct | Contenu de l'étude confirmé réel et cohérent avec la description d'OE (8 ECR, ≥65 ans, IDM RR 0,60, AVC RR 0,76) via résumés multiples concordants, mais le **PMID exact reste à confirmer** par le référent ou par `identite.mjs` quand disponible. |
| **Neil et al. 2006** (Diabetes Care, sous-groupe CARDS 65-75 ans) | Recherche web → confirmation croisée (diabetesjournals.org, PubMed) | **résumé accessible**, identité confirmée : PMID 17065671 | Lu (résumé) : chiffres d'OE (38 %, NNT 21, RAR 3,9 %) confirmés à l'identique. |
| **Thompson et al. 2021** (JAMA Netw Open, DOI 10.1001/jamanetworkopen.2021.36802) | Recherche web | **résumé accessible** + **correction publiée retrouvée** (PMC8800071, DOI 10.1001/jamanetworkopen.2022.0010, « Data Errors in Results Section ») | Identité confirmée réelle ; **correction non mentionnée par OE** (voir Finding M1). |
| **Rea et al. 2021** (JAMA Netw Open, PMC8204202) | Recherche web | **résumé accessible** | Identité confirmée réelle, sens cohérent avec Giral/Peixoto (défavorable à l'arrêt). |
| **Kutner et al. 2015** (PMID 25798575) | Recherche web (citations multiples, dont WikiJournalClub reprenant l'article) | **résumé accessible** (texte intégral JAMA Intern Med non tenté, probable abonnement) | Chiffres de qualité de vie retrouvés : **7,11 vs 6,85, p=0,04** — confirme A, contredit OE (voir Finding M2). |
| **PREVENTABLE** (NCT04262206) | ClinicalTrials.gov (échec technique sur le rendu de la fiche) → page officielle DCRI | **texte intégral accessible** (page institutionnelle officielle) | Lu : « ongoing and actively recruiting... expected to conclude in December 2026 » — **confirme A et OE**, et **infirme** une fausse piste rencontrée en cours de recherche web (un résumé généré affirmant à tort des « résultats en février 2026 » — écarté après vérification à la source, voir §4). |
| **StAREE — résultats principaux** (NEJM, DOI 10.1056/NEJMoa2607314) | Page éditeur NEJM (`HTTP 403`, `échec technique`) → Unpaywall (`closed`, aucune copie légale connue) → 6 résumés de presse indépendants et concordants (Medscape, HCPLive, ESC press release, ACC, TCTMD, Solaci) + annonce officielle NEJM/ESC | `résumé accessible` uniquement pour le texte primaire ; convergence forte de 6 relais indépendants sur les chiffres centraux | **Non lu en texte intégral** — voir §4 et §5, fait central de la passe d'omission : **publié le 28-29 août 2026, soit après la date des deux dossiers (2026-07-26)**. |

---

## 4. Cherché, non trouvé par A (et par OE)

| Voie | Requête / source, date | Trouvé | Présent chez A ? | Chez OE ? | Effet sur la conclusion |
|---|---|---|---|---|---|
| Études citantes / statut essai | « StAREE trial results 2026 », 2026-09-24 | **StAREE a publié ses résultats principaux le 28-29/08/2026** (NEJM, DOI 10.1056/NEJMoa2607314) : 9971 sujets ≥70 ans, **diabète explicitement exclu**, MACE 6,0 % (atorvastatine) vs 8,3 % (placebo) sur suivi médian 5,9 ans, soit une réduction relative ~30 % ; critère principal (survie sans handicap/démence) **non amélioré significativement** | **Non** — A écrit explicitement « résultats NON PUBLIÉS à ce jour (2026-07-26) », exact à sa date | **Non** — OE écrit « Aucun résultat publié », exact à sa date | **Fort, mais indirect pour SQ1** : c'est le premier ECR dédié positif sur un critère CV dur chez le ≥70 ans en prévention primaire — mais il **exclut le diabète**, donc ne répond pas à SQ1 pour le DT2. Change le paysage probatoire général (le nœud devra en tenir compte pour la population non diabétique), sans lever l'absence de preuve directe chez le DT2. |
| Registres / essais de déprescription | « SITE trial statin discontinuation results », 2026-09-24 | **L'essai SITE (rebaptisé SAGA/SITE dans la publication) a publié ses résultats** (*Lancet Healthy Longevity*, 2026;7(7):100884, épub 11/08/2026, PMID 42580354) : N≈1088-1160 (selon les relais, source primaire non ouverte), ≥75 ans, prévention primaire, arrêt vs poursuite de statine, mortalité à 3 ans **7,2 % (arrêt) vs 7,9 % (poursuite)**, **non-infériorité de l'arrêt démontrée** sur ce critère dur ; pas de différence significative sur les événements CV majeurs ni sur la qualité de vie | **Non** — absent de la collecte A | **Partiellement** — OE cite « SITE » (B2) mais avec la référence du **protocole 2020** (Bonnet, *Trials*), en affirmant « aucun résultat publié » — **exact à la date d'OE (2026-07-26), mais dépassé un mois avant l'écriture de cette passe (juillet vs publication mi-août 2026)** | **DÉCISIF pour SQ2** : c'est exactement l'ECR que A et OE disent tous deux ne pas exister (« hors fin de vie »). Il existe désormais, et son sens (non-infériorité de l'arrêt) va à l'encontre du signal observationnel (Giral, Peixoto) sur lequel A et OE s'appuyaient pour déconseiller la déprescription. |
| Résultat de sens contraire / correction | « Thompson 2021 JAMA Netw Open correction data errors », 2026-09-24 | Une **correction publiée** existe pour Thompson et al. 2021 (« Data Errors in Results Section », JAMA Netw Open 2022;5(1):e220010) : les effectifs de la cohorte prévention primaire ayant arrêté la statine étaient erronés dans la publication initiale (8311/27463 et non 89311/279463 comme initialement imprimé) | Non applicable — A ne cite pas Thompson 2021 | **Non signalé par OE**, qui cite Thompson 2021 sans mentionner la correction | Modéré : ne change pas le sens de l'étude, mais une correction non signalée est un défaut de vigilance sur une référence qu'OE introduit lui-même. |
| Registre | ClinicalTrials.gov / page officielle DCRI, « PREVENTABLE status 2026 », 2026-09-24 | **Toujours en cours**, recrutement actif, fin prévue décembre 2026 — confirme A et OE. Un résumé web de recherche (source tierce non fiable, « cprclassnow.net ») affirmait à tort des « résultats en février 2026 » : **vérifié et écarté** à la source officielle DCRI | Confirmé exact chez A | Confirmé exact chez OE | Aucun — sert de garde-fou méthodologique : une affirmation IA non sourcée a été trouvée, testée, et rejetée avant d'entrer dans ce rapport. |
| Étude citante | « Savarese 2013 JACC statins elderly meta-analysis », 2026-09-24 | Étude réelle, confirmée par plusieurs sources indépendantes, mais **identifiant PMID instable** selon la source interrogée | Absente chez A | Introduite par OE (A9) | Voir Finding B1 (accès). |

---

## 5. Findings

### F1 — HAUTE — origine : omission structurelle (postérieure aux deux dossiers)
**Résumé** : un ECR répondant précisément à SQ2 (« existe-t-il un ECR de déprescription hors fin de
vie ? ») existe désormais et n'était pas connu d'A ni d'OE.
**Scénario d'échec** : si le nœud ou le référent s'appuient sur la conclusion d'A (« pas de fondement
EBM solide pour déprescrire... signal qui déconseille de le faire ») ou sur celle d'OE (« aucun ECR
publié »), la décision clinique reposera sur une lecture **périmée d'un mois** au moment de la
rédaction de cette passe. L'essai SAGA/SITE (Bonnet et al., *Lancet Healthy Longevity* 2026;7(7):100884,
PMID 42580354, publié le 11/08/2026) est un ECR pragmatique, multicentrique (297 centres de soins
primaires français), N≈1088 analysés (604 poursuite / 484 arrêt), ≥75 ans (âge médian ~80),
prévention primaire pure, sans antécédent CV, statine ≥1 an. Résultat : mortalité à 3 ans 7,9 %
(poursuite) vs 7,2 % (arrêt) — **non-infériorité de l'arrêt démontrée sur un critère dur**. Pas de
différence significative sur les événements CV majeurs ni sur la qualité de vie (physique et mentale).
**Localisation** : *Lancet Healthy Longevity* 2026;7(7):100884 — texte primaire **non ouvert** par
cette passe (HTTP 403 sur la page éditeur, échec technique, pas un paywall vu) ; chiffres triangulés
sur 4 relais indépendants et concordants (Healio 24/08/2026, STAT News 11/08/2026, Medical Xpress,
MedicalDialogues). **Ce n'est pas une faute d'A ni d'OE** — la publication est postérieure de ~2-4
semaines à leur travail (2026-07-26) — mais c'est l'omission la plus lourde de conséquence de tout ce
dossier, et son sens **va à l'encontre** du signal observationnel qui fondait la prudence sur la
déprescription.
**Réserve à porter au dossier** : le texte primaire n'a pas été lu (accès restant à vérifier — page
éditeur, PMC, dépôt d'auteur non tentés au-delà du 403 initial faute de budget) ; le sous-groupe
diabète (~30 % selon un seul relais sur quatre) n'est pas confirmé ; design ouvert (non aveugle),
risque de biais de performance sur les critères subjectifs (qualité de vie) même si le critère
principal (mortalité) y est peu sensible. Avant tout encodage, **lire le texte primaire**.

### F2 — HAUTE — origine : A et un résumé secondaire tiers (ACC), non OE
**Résumé** : le chiffre RR ≈ 0,92 (0,73-1,16) qu'A attribue au sous-groupe « Gencer 2020, prévention
primaire seule ≥75 ans » **n'apparaît pas** dans le texte primaire de Gencer 2020, que j'ai pourtant lu
en intégral (copie ouverte PMC8015314, `oa_status: green`, non identifiée par A qui l'a marqué
« accès payant »). Le texte dit seulement : « 3519 (16,4 %) des 21 492 patients ont eu un événement
vasculaire majeur, dont 2736 (77,7 %) en prévention secondaire et 783 (22,3 %) en prévention primaire »
— une répartition d'événements, pas un RR isolé. Or, de façon troublante, un résumé secondaire de la
méta-analyse **CTT 2019** (ACC, « Ten Points to Remember ») utilise presque le même chiffre pour un
sous-groupe différent : « RR 0,87 (0,77-0,99) pour >75 ans tous confondus, **0,92 (0,73-1,16)** chez
ceux sans maladie vasculaire préexistante ». Je n'ai pas pu confirmer ce dernier chiffre dans le texte
primaire de CTT 2019 non plus (extraction de tableau/figure hors de portée de l'outil de lecture web
disponible ici — échec technique, pas un verdict d'absence).
**Scénario d'échec** : le même nombre à trois décimales circule, via des résumés secondaires, entre
deux méta-analyses distinctes (CTT 2019 et Gencer 2020) sans qu'aucun des deux textes primaires
accessibles ne le confirme pour la population exacte revendiquée. C'est très exactement le
« syndrome de la source secondaire commune » décrit par `contradiction.md` §4 : un chiffre décisif qui
« flotte » entre deux études voisines est un signal d'erreur de recopiage, pas une confirmation croisée.
**Localisation** : Gencer et al. 2020, *Lancet* 396(10263):1637-43, texte intégral PMC8015314, section
Résultats (répartition primaire/secondaire) — chiffre RR 0,92 absent de cette section et de la
Discussion. Comparateur : ACC, « Efficacy and Safety of Statin Therapy in Older People: Meta-Analysis »
(ten points, en ligne), résumé de CTT 2019.
**Conséquence pour le nœud** : **ne pas utiliser** le chiffre « RR 0,92 (0,73-1,16), prévention
primaire seule ≥75 ans » tant que sa source exacte n'est pas retrouvée dans un tableau ou une figure
primaire précisément identifiée (numéro de figure/tableau, pas un résumé).

### F3 — MOYENNE — origine : A seule (mais découverte en re-vérifiant l'accès qu'A avait déclaré fermé)
**Résumé** : Lavon et al. 2026 (JAGS, DOI 10.1111/jgs.70375) n'est **pas** derrière un paywall — il est
en libre accès hybride (CC-BY-NC-ND) depuis le 7 mars 2026, avec une copie PMC (PMC13266438), alors
que la collecte d'A affirme « paywall HTTP 402 constaté » et marque toute la ligne « NON VÉRIFIÉ
(partiel) ». Ayant ouvert le texte intégral, je confirme les deux chiffres de titre (mortalité HR 0,69
[0,64-0,74], -31 % ; événements coronariens HR 0,80 [0,68-0,94], -20 %) **exacts**. Mais le texte révèle
un élément qu'A n'a pas pu voir faute d'accès : la prévalence du diabète est **fortement déséquilibrée
entre les deux bras** — 25,2 % chez les utilisateurs de statine contre 7,7 % chez les non-utilisateurs
— soit un rapport de plus de 3 pour 1, sans qu'aucune analyse en sous-groupe diabète ne soit rapportée.
Les auteurs reconnaissent eux-mêmes que « la confusion par indication... ne peut être exclue ».
**Scénario d'échec** : lire les chiffres de titre (-31 %, -20 %) comme un effet propre à la statine
sans voir que la population traitée est structurellement différente (beaucoup plus souvent diabétique,
donc probablement plus souvent suivie médicalement, avec un accès aux soins différent) — un biais de
l'utilisateur sain particulièrement plausible ici et non neutralisé par le simple ajustement Cox
mentionné.
**Localisation** : Lavon et al. 2026, *J Am Geriatr Soc*, texte intégral PMC13266438, section
Méthodes/Résultats (tableau des caractéristiques de base, ligne diabète) et section Limites.
**Conséquence** : la ligne 9 du tableau d'A doit être corrigée de « NON VÉRIFIÉ (partiel), accès
fermé » à « vérifié, accès ouvert — chiffres confirmés mais déséquilibre diabète 25,2 % vs 7,7 % non
discuté par A faute d'accès, aggravant le motif de prudence déjà noté par A (biais de l'utilisateur
sain) ».

### F4 — MOYENNE — origine : OE seule
**Résumé** : OE cite Neil et al. 2006 (A8, CARDS sous-groupe 65-75 ans) et Savarese et al. 2013 (A9,
méta-analyse ≥65 ans) comme éléments de réponse à une question posée sur la tranche **≥75-80 ans**,
sans jamais signaler que ces deux populations **plafonnent à 75 ans (Neil) ou partent de 65 ans
(Savarese)** — aucune des deux n'atteint réellement le cœur de la tranche visée (75-80 ans et plus).
**Scénario d'échec** : lire le tableau d'OE comme si CARDS 65-75 ans et Savarese ≥65 ans
« couvraient » la tranche ≥75-80 ans, alors qu'ils l'effleurent tout au plus à leur extrémité
supérieure (CARDS) ou l'incluent sans l'isoler (Savarese, qui ne fournit pas de sous-groupe
diabète ni de sous-groupe ≥75 spécifique).
**Localisation** : Neil et al. 2006, *Diabetes Care* 29(11):2378-84 (PMID 17065671) — population
« aged 65-75 years at randomization » explicite dans le titre lui-même ; Savarese et al. 2013, *JACC*
62(22):2090-9 — population « ≥65 years », confirmée par recherche croisée.
**Nuance statistique additionnelle (angle « spin »)** : OE écrit pour Savarese « Aucune réduction de la
mortalité totale ni CV », alors que les résumés secondaires disponibles indiquent une réduction
**non significative mais présente** (mortalité toutes causes -6 %, CV -9 %) — « aucune réduction » est
une formulation plus catégorique que ce que dit l'étude (absence de significativité ≠ absence d'effet).
Sévérité de cette sous-partie : BASSE.

### F5 — MOYENNE — origine : A et OE (erreur partagée par convergence, pas par recopiage direct)
**Résumé** : ni A ni OE ne signalent le résultat pourtant disponible depuis fin août 2026 de StAREE,
mais ceci n'est pas fautif (cf. F1/§4) — en revanche, aucun des deux dossiers ne porte de note de
péremption (« à re-vérifier après telle date ») alors que A note explicitement en fin de dossier que
« StAREE/PREVENTABLE... peuvent publier à tout moment ». Le risque d'un résultat publié entre la
rédaction et l'utilisation du dossier était donc **anticipé par A lui-même**, sans mécanisme de
re-vérification déclenché.
**Scénario d'échec** : le nœud encode une formulation basée sur « StAREE : résultats non publiés »
sans date de péremption, et cette formulation reste affichée après la publication réelle, sans
qu'aucun processus ne la révise.
**Localisation** : `preuve-statine-sujet-tres-age.md` §6, avant-dernier point.
**Sévérité** : MOYENNE — pas une erreur de fait au moment de l'écriture, mais une lacune de processus
(pas de mécanisme de veille automatique déclenché sur un essai connu comme « à paraître »).

### F6 — BASSE — origine : source elle-même (transcription par OE)
**Résumé** : les chiffres de qualité de vie de Kutner et al. 2015 diffèrent entre A (7,11 vs 6,85,
p=0,04) et OE (7,07 vs 6,74, p=0,03). La recherche croisée (WikiJournalClub, citant directement
l'article) confirme **7,11 vs 6,85, p=0,04** — les chiffres d'A sont corrects, ceux d'OE sont une
légère déformation (transposition de chiffres ou hallucination partielle typique d'un résumé généré).
**Scénario d'échec** : un chiffre secondaire (p=0,03 au lieu de 0,04) ne change pas la conclusion
(non-significatif dans les deux cas pour le critère principal, qualité de vie meilleure à l'arrêt dans
les deux versions), mais illustre pourquoi « un PMID recopié d'OE ne vaut rien » doit s'étendre aux
chiffres eux-mêmes.
**Localisation** : Kutner et al. 2015, *JAMA Intern Med* 175(5):691-700 (PMID 25798575), résultats
secondaires (qualité de vie McGill).

### F7 — BASSE — origine : OE seule (référence non vérifiée sur un point secondaire)
**Résumé** : OE cite Thompson et al. 2021 (B4) sans mentionner qu'une correction publiée existe
(« Data Errors in Results Section », *JAMA Netw Open* 2022;5(1):e220010, PMC8800071) portant sur les
effectifs de la cohorte de prévention primaire. La correction ne change pas le sens de l'étude
(toujours défavorable à l'arrêt) mais aurait dû être signalée par la discipline de vérification que le
projet impose (rétractation/correction Crossref, `acces-identite.md` §6).
**Localisation** : correction PMC8800071, DOI 10.1001/jamanetworkopen.2022.0010.

### F8 — BASSE — origine : A seule (identité non résolue, sans conséquence sur le fond)
**Résumé** : le PMID exact de Savarese et al. 2013 (JACC) n'a pas pu être stabilisé dans cette passe
(23994398 / 23994397 / 23954343 selon la source), faute d'accès E-utilities direct. Le contenu de
l'étude est confirmé réel par ailleurs (titre, revue, année, chiffres cohérents entre sources), donc ce
n'est pas un doute sur l'existence de l'étude, seulement sur l'identifiant exact à inscrire au dossier.
**Conséquence** : ne pas inscrire de PMID pour cette référence tant qu'il n'est pas confirmé par
`identite.mjs` (à exécuter par le référent, ou par un agent disposant de `Bash`) ou par une recherche
PubMed directe.

---

## 6. Confirmations obtenues

- **CARDS princeps** (PMID 15325833) et **HPS sous-groupe diabète** (PMID 12814710) — non re-testés
  dans cette passe (hors périmètre de la re-vérification demandée), mais aucune contradiction relevée
  entre A et OE, aucun signal d'alerte trouvé lors de la passe d'omission.
- **CTT 2019, citation verbatim d'A** — confirmée mot pour mot dans le texte intégral (Europe PMC,
  PMC6429627) : « there is less direct evidence of benefit among patients older than 75 years who do
  not already have evidence of occlusive vascular disease » et « only around a fifth of the major
  vascular events occurred in those with no history of vascular disease ». **A a lu correctement ce
  passage.**
- **CTT 2019, mortalité CV ≥75** — RR 0,85 (0,74-0,98), confirmé mot pour mot par lecture du texte
  intégral de **Gencer 2020** qui le cite lui-même en le reprenant de CTT (les deux méta-analyses se
  recoupent en partie sur les données sources, cf. F2 — à garder en tête comme rappel que l'accord entre
  deux méta-analyses voisines n'est pas une confirmation indépendante, `contradiction.md` §4).
- **Yourman et al. 2021** (PMID 33196766) — population 50-75 ans, chiffre « 2,5 ans (IC 1,7-3,4) pour
  éviter 1 MACE / 100 traités » — A et OE convergent exactement, et A a lu le texte primaire (citation
  verbatim reproduite). **Aucune raison de douter de cette lecture.**
- **STREAM** — confirmé comme protocole seul (PMID 40409969, PMC12104904), aucun résultat publié à ce
  jour, multi-pays (Suisse/France/Pays-Bas, N=1800 prévus) — OE avait correctement identifié le statut
  « en cours », seule la localisation géographique était incomplète (« Suisse » seule chez OE, alors que
  l'essai est trinational).
- **PREVENTABLE** — statut « en cours, fin prévue décembre 2026, aucun résultat » confirmé à la source
  officielle (page DCRI), identique entre A, OE, et cette passe.
- **Giral et al. 2019, Peixoto et al. 2024, Aponte Ribero et al. 2025/2026** — identités, chiffres et
  citations verbatim tels que rapportés par A n'ont soulevé aucune anomalie lors de la recherche croisée
  (Thompson et Rea, introduits par OE, sont cohérents en sens avec ces trois études).
- **Neil et al. 2006** — chiffres d'OE (38 %, RAR 3,9 %, NNT 21/4 ans) confirmés à l'identique par
  recherche croisée indépendante ; identité confirmée (PMID 17065671), cohérente avec le CARDS
  princeps (même essai, sous-groupe d'âge).
- **Lavon et al. 2026** — chiffres de titre d'A (-31 % mortalité, -20 % événements coronariens)
  confirmés **exacts** par lecture du texte intégral (voir aussi F3 pour la nuance non vue par A).

---

## 7. Objections retirées

- **Objection initiale (moi-même, avant lecture) : « le chiffre 2,5 ans pourrait être mal transcrit »**
  — retirée. A l'a lu et cité verbatim depuis la reco SFE/SFD/NSFA/SFC 2026, qui elle-même cite
  correctement Yourman et al. 2021. La chaîne d'attribution est propre ; le seul point à corriger est
  le libellé du nœud (le préciser comme extrapolation), ce qu'A recommande déjà lui-même.
- **Objection initiale : « A n'a peut-être pas vraiment lu le texte intégral de CTT 2019 malgré la
  mention "oui" dans sa colonne Récupérée »** — retirée. La citation verbatim d'A a été retrouvée mot
  pour mot dans le texte intégral (Europe PMC). A a bien lu le passage qu'il cite.
- **Objection initiale : « le chiffre de PREVENTABLE pourrait être obsolète, l'essai a pu se terminer
  plus tôt que prévu »** — retirée après vérification à la source officielle DCRI (toujours en cours,
  recrutement actif) — une fausse piste rencontrée en cours de recherche web (source tierce peu fiable
  affirmant des « résultats en février 2026 ») a été testée et écartée.

---

## 8. Décompte final

**Par sévérité** : HAUTE = 2 (F1, F2) · MOYENNE = 3 (F3, F4, F5) · BASSE = 3 (F6, F7, F8).

**Par origine** :
- Omission structurelle (postérieure aux deux dossiers, non fautive) : 1 (F1)
- A et un résumé secondaire tiers (non OE) : 1 (F2)
- A seule : 3 (F3, F5 partiellement, F8)
- OE seule : 2 (F4, F7)
- Source elle-même (transcription/coquille dans le relais) : 1 (F6)
- Non vérifiable dans le temps imparti : composante identité de F8.

---

## 9. Verdict par sous-question

### SQ1 — initiation chez le DT2 ≥ 75-80 ans, prévention primaire

**Conclusion** : il n'existe, à ce jour (2026-09-24), **aucun essai randomisé dédié** à l'intersection
exacte « DT2 ET ≥ 75-80 ans ET prévention primaire pure ». StAREE, le premier ECR positif sur un
critère CV dur chez le ≥ 70 ans en prévention primaire (réduction relative ~30 % des événements CV
majeurs, 6,0 % vs 8,3 % sur 5,9 ans médians), **exclut explicitement le diabète** et ne peut donc pas
servir de preuve directe pour le DT2 — il ne fait que changer le paysage probatoire pour le sujet âgé
non diabétique. PREVENTABLE, qui n'exclurait pas le diabète, est toujours en cours (fin prévue
12/2026). Les deux grandes méta-analyses d'IPD (CTT 2019, Gencer 2020) confirment, texte primaire à
l'appui, qu'**aucune des deux ne publie de RR isolé pour le sous-groupe prévention-primaire-seule
≥75 ans** — le chiffre « RR ≈0,92 (0,73-1,16) » qui circule pour cette case précise dans les résumés
secondaires n'a été retrouvé dans aucun des deux textes primaires accessibles (Finding F2, HAUTE) et ne
doit pas être utilisé. CARDS (le seul essai diabète-spécifique de prévention primaire) plafonne à
75 ans. Les seules données spécifiquement diabétiques dans la tranche visée sont observationnelles
(Ramos 2018, Xu Hong Kong 2024, Lavon 2026), de niveau de preuve faible, avec un biais de l'utilisateur
sain plausible et, pour Lavon, un déséquilibre diabète marqué entre bras non discuté par les auteurs.

**Certitude** : faible sur le bénéfice direct chez le DT2 très âgé ; modérée sur l'absence de preuve
directe elle-même (bien établie par triangulation de sources primaires concordantes).

**Population/horizon couverts** : les données couvrent bien 75-90 ans en population générale
(observationnel) et 70-82 ans en essais mixtes (PROSPER), mais **aucune donnée d'essai randomisé
diabète-spécifique** au-delà de 75 ans.

**Reste ouvert** : PREVENTABLE (résultats attendus fin 2026-2027, inclurait potentiellement les
diabétiques) ; confirmation ou infirmation du chiffre RR 0,92 cité pour Gencer/CTT (à retrouver dans
un tableau/figure primaire précisément identifié, pas dans un résumé).

### SQ2 — déprescription chez le même patient

**Conclusion** : **ce verdict change matériellement par rapport aux deux dossiers d'entrée.** Un ECR
répondant précisément à la question (≥75 ans, prévention primaire, bon état général, hors fin de vie)
existe désormais : **SAGA/SITE** (Bonnet et al., *Lancet Healthy Longevity* 2026), non-infériorité de
l'arrêt sur la mortalité à 3 ans (7,2 % vs 7,9 %), pas de sur-risque significatif d'événements CV ni de
perte de qualité de vie. Ce résultat va **à l'encontre** du signal observationnel (Giral 2019, Peixoto
2024, Aponte Ribero 2025) sur lequel A et OE s'appuyaient tous deux pour déconseiller la
déprescription — et confirme, a posteriori, l'hypothèse d'A et de l'analyse d'Aponte Ribero selon
laquelle ce signal observationnel était probablement gonflé par la confusion par indication inversée.
Kutner 2015 (seul ECR antérieur, population de fin de vie) reste hors sujet pour le DT2 stable.

**Certitude** : modérée à faible — un seul ECR, texte primaire non encore lu par cette passe
(accès restant à vérifier), design ouvert, sous-groupe diabète non confirmé, effectif modeste pour un
essai de non-infériorité sur les événements CV (probablement sous-dimensionné sur ce critère
secondaire, bien dimensionné sur la mortalité).

**Population/horizon couverts** : ≥75 ans (âge médian ~80), prévention primaire, statine ≥1 an,
horizon 3 ans — c'est la population la plus proche de la question posée parmi toutes les preuves
disponibles à ce jour, mais pas spécifiquement diabétique (population mixte, ~30 % de diabétiques selon
un seul relais non confirmé).

**Reste ouvert** : lecture du texte primaire de SAGA/SITE avant tout encodage (priorité absolue) ;
sous-groupe diabète à l'intérieur de cet essai (peut-être disponible en annexe/supplément) ; résultats
de STREAM (multi-pays, N=1800, en cours, pourrait fournir une deuxième source ECR sur un critère
composite différent).

### SQ3 — le chiffre « ~2,5 ans » est-il applicable aux ≥75-80 ans ?

**Conclusion** : non, c'est une extrapolation, et A l'a déjà correctement établi et signalé. La
méta-analyse Yourman et al. 2021 porte sur une population 50-75 ans ; il n'existe, à ce jour, aucune
étude de temps-avant-bénéfice dédiée à la tranche ≥75-80 ans. Cette passe ne trouve rien qui change ce
constat (aucune étude de temps-avant-bénéfice spécifique au grand âge trouvée en passe d'omission).
StAREE fournit un élément de contexte compatible (bénéfice CV détectable sur un suivi médian de
5,9 ans chez le ≥70 ans) mais ne constitue pas, en soi, une mesure formelle de délai avant bénéfice, et
exclut le diabète.

**Certitude** : élevée sur le constat d'extrapolation lui-même (bien documenté, verbatim vérifié dans
le texte primaire de Yourman et dans la reco SFE/SFD/NSFA/SFC 2026, qui reconnaît elle-même la limite).

**Reste ouvert** : rien de neuf à trancher ; le nœud devrait simplement expliciter la limite de
population (50-75 ans) à côté du chiffre, comme A le recommande déjà.

### SQ4 — la symétrie Ramos/Giral tient-elle ?

**Conclusion** : l'objection de méthode d'OE est **globalement fondée mais pas absolue**. Le biais de
l'utilisateur sain (Ramos, cohortes d'initiation) et le biais d'indication inversée (Giral et les
cohortes de déprescription) sont deux expressions d'un même phénomène de fond — l'état de santé
sous-jacent influence à la fois la probabilité de commencer/poursuivre un traitement préventif et celle
de l'arrêter — et les deux biais orientent le signal observé dans le **même sens** (statine
= bénéfique). Il serait donc effectivement incohérent de traiter Ramos comme un argument solide
en faveur de l'initiation tout en écartant Giral comme sans valeur pour la déprescription : **les deux
doivent être escomptés avec la même méfiance de principe**, et le tableau d'A applique d'ailleurs déjà
cette symétrie au niveau du GRADE (« faible » pour les deux). En revanche, une nuance légitime existe :
le dossier contient une **preuve interne et directe** de la magnitude du biais côté déprescription —
Aponte Ribero et al. documentent eux-mêmes un effet sur la mortalité non-cardiovasculaire qu'ils
qualifient de « cliniquement et physiopathologiquement implausible », signant une confusion résiduelle
sévère — alors qu'aucun signal comparable d'implausibilité n'a été relevé côté initiation (Ramos). Ce
n'est pas une preuve que le biais d'indication inversée est nécessairement plus fort en général, mais
c'est un élément *dans ce dossier précis* qui justifie une prudence au moins égale, sinon légèrement
supérieure, côté déprescription — pas un « double standard » en sens inverse de celui qu'OE dénonce,
mais pas non plus une raison de traiter les deux signaux comme équivalents en confiance. **Point de
vigilance supplémentaire, indépendant de ce débat** : l'existence désormais d'un ECR (SAGA/SITE, F1)
qui va dans le sens opposé au signal observationnel de déprescription rend la discussion en partie
théorique pour la déprescription — un ECR, même seul et à confirmer, prime sur la triangulation de
cohortes biaisées des deux côtés.

**Certitude** : modérée — raisonnement méthodologique clair, mais reste un jugement d'appréciation, pas
un fait vérifiable par une source primaire unique.

---

## 10. Proposition de libellé (à trancher par le référent)

Deux mises à jour concrètes découlent de cette passe, indépendamment du fond clinique :

1. **Ne pas figer** de libellé sur la déprescription tant que le texte primaire de SAGA/SITE n'a pas
   été lu par un agent avec la question posée (sous-groupe diabète en particulier). Si le référent
   souhaite une formulation provisoire en attendant : *« Un essai randomisé récent (SAGA/SITE, 2026,
   Lancet Healthy Longevity) suggère que l'arrêt d'une statine chez un sujet ≥75 ans stable, en
   prévention primaire, n'augmente pas la mortalité à 3 ans — résultat encore isolé, à confirmer par la
   lecture du texte complet et par l'essai STREAM (résultats attendus), avant toute généralisation au
   patient diabétique. »*
2. **Retirer** ou requalifier tout usage futur du chiffre « RR 0,92 (0,73-1,16) » pour le sous-groupe
   prévention-primaire-seule ≥75 ans (Gencer 2020 ou CTT 2019) tant que sa source exacte (numéro de
   tableau/figure) n'est pas retrouvée dans l'un des deux textes primaires — c'est un chiffre qui
   « flotte » entre deux méta-analyses voisines sans ancrage retrouvé dans l'une ou l'autre (Finding F2).

Ces deux points ne préjugent d'aucun arbitrage clinique sur le nœud `statine.yaml` — c'est au référent
de trancher la suite, y compris l'opportunité d'une nouvelle passe de collecte ciblée sur le texte
intégral de SAGA/SITE avant toute décision d'encodage.
