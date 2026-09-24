# Contradiction — statine chez le DT2 très âgé (initiation / déprescription)

## Provenance
- Agent : contradicteur-preuve (B) — consignes : `.claude/agents/contradicteur-preuve.md`, dernier commit : **sans objet** (pas de dépôt git dans cet environnement — « Is a git repository: false »)
- Modèle : sonnet (en-tête de l'agent)
- Date : 2026-09-24
- Mode : Décision — circuit `recherche-preuve-triangulee`, chantier ponctuel hors dossier `docs/decision/validation/...` (pas de registre séparé pour ce chantier)
- Outils disponibles : `Read`, `Grep`, `Glob`, `WebFetch`, `WebSearch`, `Write` (natifs, constatés dans cette session) ;
  **absents** : `Bash` — non exposé dans cette session. Conséquence : `identite.mjs` et `verifier-registre.mjs` n'ont pas pu être appelés. Faute d'appel possible, j'ai reproduit **manuellement, par simple lecture web (WebFetch)**, les mêmes points d'accès publics que le script interroge : E-utilities PubMed (`efetch`, résumé/identité), Europe PMC REST (PMCID, accès ouvert), Unpaywall API (statut OA, meilleure copie). C'est une voie ouverte de `acces-identite.md` §5, pas un contournement du script — mais aucune vérification de rétractation Crossref n'a été faite (le script l'aurait fait automatiquement), à noter comme limite.
  Des instructions de serveurs MCP (Consensus, ClinicalTrials.gov, Claude Docs, Vercel) apparaissent dans l'environnement système, mais **aucun outil correspondant n'a été mis à ma disposition dans la liste des fonctions appelables de cette session** : conformément à `acces-identite.md` §1 (« un outil absent n'est jamais appelé »), je ne les ai pas utilisés et n'ai reconstitué aucun résultat de mémoire à leur sujet.
  **Interdiction respectée** : aucune requête OpenEvidence, sous aucune forme, à aucun moment de ce travail.
- Accès obtenus (voie précisée) :
  - Gencer et al. 2020 (Lancet, PMID 33186535) — **texte intégral accessible** via PMC (PMC8015314, version soumise, dépôt NIH), ouvert par WebFetch.
  - Lavon et al. 2026 (JAGS, PMID 41793188, DOI 10.1111/jgs.70375) — **résumé accessible** via E-utilities (abstract PubMed) ; **accès restant à vérifier → tenté** : Unpaywall signale `hybrid`/OA et Europe PMC signale un PMCID open access (PMC13266438) ; la page Wiley et la lecture Europe PMC ont toutes deux renvoyé un blocage technique (403 / vérification anti-robot) au moment de la tentative — voir « accès bloqués ».
  - PROSPER (Shepherd et al. 2002, Lancet, PMID 12457784) — **résumé accessible** via E-utilities (abstract PubMed).
  - SAGA/SITE (Bonnet et al. 2026, Lancet Healthy Longevity, PMID 42580354, DOI 10.1016/j.lanhl.2026.100884) — **résumé accessible** (citation et chiffres clés obtenus par WebFetch, relais qui cite l'abstract ; à confirmer par une lecture directe de l'abstract PubMed si le temps le permet).
  - Chan et al. 2026 (PLoS Medicine, PMID 42340940, DOI 10.1371/journal.pmed.1005136) — **résumé accessible** via Europe PMC REST.
  - STAREE (NEJM, DOI 10.1056/NEJMoa2607314) — **non récupéré en primaire** : page NEJM en 403 ; chiffres obtenus seulement par relais secondaires concordants (ACC, Medscape, HCPLive, communiqué ESC) — traité comme `NON VÉRIFIÉ (partiel)`, jamais comme confirmé.
  - Savarese et al. 2013 (JACC) — identité confirmée par titre/résumé indexé (recherche web), **résumé accessible** seulement (abstract non ouvert en primaire ici, chiffres de relais).
  - Giral et al. 2019 (Eur Heart J, PMID 31362307), Ramos et al. 2018 (BMJ, PMID probable 30185425), Thompson et al. 2021 (JAMA Netw Open), Rea et al. 2021 (JAMA Netw Open) — identité confirmée par recherche web, **résumé accessible** seulement à ce stade (chiffres de relais secondaires concordants, pas de lecture directe de l'abstract PubMed encore faite pour tous).
- Accès bloqués (voie précisée) :
  - PROSPER, page éditeur Lancet (DOI résolu) — **paywall constaté sur cette voie** (HTTP 403 avec page de connexion, pas une erreur réseau ambiguë).
  - PROSPER, Unpaywall — `closed`, aucune copie ouverte connue (ne ferme pas les autres voies, mais aucune n'a été trouvée : ni PMC, ni dépôt).
  - Lavon et al. 2026, page Wiley (agsjournals.onlinelibrary.wiley.com) — **échec technique** (403, probable barrière anti-robot du fournisseur, pas un paywall constaté puisqu'Unpaywall et Europe PMC signalent tous deux un accès ouvert existant) ; Europe PMC (lecture directe de PMC13266438) — également bloqué par une page de vérification anti-robot au moment de la tentative, donc **échec technique** aussi sur cette voie.
  - STAREE, page NEJM — **paywall constaté sur cette voie** (403).
- Rapport d'A et retour OE ouverts : **après** la section « Attendus » ci-dessous et la passe d'omission (recherches web documentées avant toute ouverture de `preuve-statine-sujet-tres-age.md` et `OE-statine-sujet-tres-age.md`).

---

## Attendus (écrits avant l'ouverture du rapport d'A et du retour OE)

### Q1 — Initiation d'une statine en prévention primaire chez le DT2 ≥75-80 ans, critère dur ?

- **Critères de jugement attendus** : mortalité toutes causes, mortalité CV, événements CV majeurs (IDM, AVC) — durs. LDL seulement en substitution, à mentionner sans le faire porter la conclusion.
- **Chiffres attendus, et où ils devraient se trouver** :
  - Une méta-analyse d'ECR par sous-groupe d'âge (famille CTT : au moins deux publications distinctes possibles — une centrée statines seules, une centrée LDL toute molécule confondue — à ne pas confondre l'une avec l'autre) : effet chiffré (RR/HR) par tranche d'âge, avec le test d'interaction par tranche d'âge, dans le corps de l'article ou son appendice (pas dans un relais).
  - Un ou plusieurs essais/cohortes spécifiquement chez le diabétique âgé (au moins un essai ancien type CARDS/HPS avec sous-groupe d'âge, et au moins une étude de cohorte plus récente spécifique au DT2 très âgé) : HR pour mortalité et événements CV, avec IC95%, population et durée de suivi précisées.
  - PROSPER (population mixte prévention 1aire/2daire, 70-82 ans) : l'endpoint composite global existe certainement ; un chiffre isolé pour le sous-groupe prévention primaire seule est **à vérifier comme existant réellement dans la publication princeps** avant d'être cité comme tel (l'expérience montre que ce genre de sous-groupe post-hoc vit souvent dans une méta-analyse secondaire, pas dans l'article de 2002 lui-même).
  - Un essai randomisé récent et spécifiquement centré sur le sujet très âgé sans maladie CV établie serait la pièce la plus décisive pour Q1 si elle existe et si elle inclut ou peut être extrapolée à des diabétiques — à chercher activement (omission).
- **Réserves attendues** : la plupart des essais historiques (PROSPER, HPS, CARDS, ASCOT) ont un âge moyen très inférieur à 80 ans, avec seulement une queue de distribution ≥75-80 ans, donc une puissance statistique faible sur ce sous-groupe précis ; mélange fréquent prévention primaire/secondaire dans le même essai ; le diabète est rarement isolé comme sous-groupe d'âge croisé (double stratification âge × diabète = effectifs réduits) ; espérance de vie et délai avant bénéfice (un essai de 3-5 ans ne capture pas un bénéfice qui met plus longtemps à apparaître, ou au contraire un patient à espérance de vie courte n'a pas le temps d'en bénéficier) ; risque compétitif de décès par cause non cardiovasculaire à cet âge.
- **Études attendues (passe d'omission faite avant lecture d'A, par recherche web)** : au moins un essai randomisé récent chez le sujet âgé sans maladie CV connue en prévention primaire pure — **attendu et trouvé** : **STAREE** (NEJM, 2026, Australie, ≥70 ans, N=9971, atorvastatine 40 mg vs placebo). Point de vigilance majeur si retenu par A : STAREE **exclut explicitement le diabète** au recrutement selon les relais consultés (« no history of clinical cardiovascular disease, diabetes or dementia ») — à confirmer en primaire, car si exclusion confirmée, l'essai est une pièce de contexte sur le sujet âgé en général mais **ne s'applique pas telle quelle à la population DT2** du cadrage, ce qui doit être dit explicitement plutôt que d'en extrapoler le chiffre au DT2.
  Également attendue : une étude en émulation d'essai cible ou une cohorte de grande taille **spécifique au DT2 ≥75-80 ans** en prévention primaire — **attendu et trouvé** : Chan et al. 2026 (PLoS Medicine, cible directement le DT2 ≥75 ans, target trial emulation).

### Q2 — Déprescription d'une statine déjà en place, même population, effet sur le risque ?

- **Critères de jugement attendus** : mortalité toutes causes, événements CV majeurs, éventuellement qualité de vie/effets indésirables évités. LDL en substitution seulement (attendu : hausse du LDL à l'arrêt, sans valeur décisionnelle isolée).
- **Chiffres attendus, et où ils devraient se trouver** :
  - Des cohortes observationnelles françaises et étrangères comparant poursuite vs arrêt (au moins : une cohorte française, une cohorte scandinave, une cohorte d'Europe du Sud), avec HR pour événements CV et/ou mortalité, IC95%, horizon de suivi.
  - **Point décisif attendu et à vérifier en priorité** : un essai randomisé de déprescription avec critère dur, terminé ou en cours — le cadrage n'indique pas si un tel essai existe déjà ; son existence changerait la force de la réponse à Q2 de « observationnel seul » à « ECR disponible ». À chercher activement dans la passe d'omission.
- **Réserves attendues** : toutes les cohortes observationnelles de poursuite/arrêt sont exposées à un **biais de confusion par indication inversée** (on arrête plus souvent la statine chez les patients dont le pronostic vital est déjà engagé — fin de vie, cancer, démence terminale — ce qui fait paraître l'arrêt plus délétère qu'il ne l'est) ; à l'inverse, les cohortes de poursuite sont exposées à un **biais de l'utilisateur en bonne santé** (« healthy adherer effect » — celui qui continue est plus observant, plus suivi, en meilleur état général). Les deux biais plausibles jouent **dans le même sens** (favoriser la statine), ce qui doit être discuté explicitement (angle Biais), et non traité comme si un seul des deux biais existait.
- **Études attendues (passe d'omission)** : Ramos et al. 2018 (BMJ, cohorte espagnole, sous-groupe DT2), Giral et al. 2019 (Eur Heart J, cohorte française), une cohorte danoise et une cohorte italienne sur la déprescription — **attendues et trouvées** : Thompson et al. 2021 (JAMA Netw Open, Danemark) et Rea et al. 2021 (JAMA Netw Open, Lombardie, Italie). Un essai randomisé de déprescription en cours ou publié — **attendu, et une pièce majeure trouvée** : **SITE/SAGA** (Bonnet et al., *Lancet Healthy Longevity*, 2026) apparaît, d'après la recherche web faite avant ouverture d'A et d'OE, être **un essai randomisé déjà publié avec résultats** (N=1160, ≥75 ans, prévention primaire, non-infériorité sur la mortalité à 3 ans), et non plus seulement un protocole en cours comme le cadrage le laissait supposer — à vérifier en primaire et à confronter à ce qu'en disent A et OE : si absent des deux, c'est une omission majeure sur la pièce la plus forte disponible pour Q2 (un ECR prime sur toute cohorte observationnelle sur ce point précis). Un second essai de déprescription, **STREAM** (Suisse/France/Pays-Bas), est en cours (protocole 2025, résultats non attendus).

### Q3 — Le chiffre « délai avant bénéfice ~2,5 ans » : sourcé correctement, champ d'application fidèle ?

- **Chiffre attendu et sa source la plus probable** : une méta-analyse de type « time-to-benefit » sur les statines en prévention primaire. La recherche web indépendante, faite avant ouverture d'A, converge fortement vers **Yourman et al., JAMA Internal Medicine, 2021** (« Evaluation of Time to Benefit of Statins for the Primary Prevention of Cardiovascular Events in Adults Aged 50 to 75 Years ») : 8 essais, 65 383 adultes, âge moyen 55-69 ans, **2,5 ans (IC95% 1,7-3,4)** de traitement nécessaires pour éviter 1 évènement CV majeur pour 100 patients traités.
- **Réserve attendue, décisive pour Q3** : le titre même de cette méta-analyse borne la population à **50-75 ans** — pas ≥75 ans. Si le nœud `statine.yaml` affiche ce chiffre dans une **alerte pour les patients >75 ans**, cela reprend un chiffre calculé sur une population qui s'arrête pile à la borne de l'alerte (75 ans), et qui **exclut par construction** la tranche d'âge que l'alerte cible. C'est exactement le type d'erreur de **Portée** que `contradiction.md` §3 demande de vérifier : un chiffre réel, correctement recopié, mais appliqué à une population qu'il ne couvre pas.
- **Étude attendue pour trancher** : lire directement l'article de Yourman et al. (2021) pour confirmer la borne d'âge exacte (50-75 ans, et non 50-80 ou autre), le protocole d'inclusion des essais (probablement CTT-like), et si les auteurs eux-mêmes mettent en garde contre une extrapolation au-delà de 75 ans.

---

*(Passe d'omission : recherches web menées avant l'ouverture d'A et d'OE, résumées ci-dessus dans chaque attendu concerné. La rubrique « Cherché, non trouvé par A » ci-dessous reprend ces mêmes recherches une fois le rapport d'A confronté.)*

---

## Cherché, non trouvé par A

*(section à compléter après ouverture du rapport d'A — en cours de rédaction)*
