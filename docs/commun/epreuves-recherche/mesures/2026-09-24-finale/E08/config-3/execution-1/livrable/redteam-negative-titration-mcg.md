# Red-team — négative Q1/Q2 du retour OpenEvidence, titration MCG de la basale (DT2)

## Provenance
- Agent : contradicteur-preuve (B) — consignes : `.claude/agents/contradicteur-preuve.md`, dernier commit : non transmis (dépôt local hors git pour cette épreuve)
- Modèle : sonnet (en-tête de l'agent)
- Date : 2026-09-24
- Mode : Décision — format allégé (épreuve). Rapport d'A : **sans objet** (aucun Agent A sur ce tour). Registre : **sans objet pour ce tour** (aucun `registre.md` fourni ; les identifiants vérifiés sont tracés dans ce rapport, section « Confirmations »).
- Outils disponibles : `Read`, `Grep`, `Glob`, `WebSearch`, `WebFetch`, `Write` ; absents : `Bash` — donc `identite.mjs` et `verifier-registre.mjs` **non exécutables cette session**. Substitution assumée : les mêmes voies que le script (PubMed E-utilities `esummary`, Crossref API, Europe PMC API, Unpaywall API, ClinicalTrials.gov API v2) ont été interrogées directement par `WebFetch`, à la main, pour chaque identifiant décisif — démarche équivalente mais non outillée par le script, donc pas de code de sortie standard à rapporter.
- Accès obtenus : PubMed (E-utilities esummary) — texte de notice — voie : WebFetch direct ; Crossref API — texte de notice — voie : WebFetch direct ; Europe PMC API — résumé — voie : WebFetch direct ; ClinicalTrials.gov API v2 — fiche de registre — voie : WebFetch direct ; JAMA (MOBILE, DOI 10.1001/jama.2021.7444) — **texte intégral accessible** (bronze OA via Unpaywall, PDF éditeur) — voie : WebFetch sur le PDF ; Diabetologia (Jancev, DOI 10.1007/s00125-024-06107-6) — **résumé accessible** (via Europe PMC, texte intégral bloqué par identifiant Springer) ; DIATEC (Olsen, DOI 10.2337/dc24-2222 / PMID 39887698) — **résumé accessible** (agrégateurs de recherche ; page Diabetes Care bloquée par reCAPTCHA, BMC/Springer bloqué par connexion).
- Accès bloqués : SAGE (El Fathi et al., DOI 10.1177/15209156261420193) — **paywall constaté sur cette voie** (page éditeur, HTTP 403) — texte intégral non lu, algorithme exact (déclencheur/pas de dose) non vérifié par moi, seulement le résumé et la fiche de registre ClinicalTrials.gov ; ADA abstract 310-OR (El Fathi, même essai) — **échec technique** (HTTP 403) ; Diabetes Care (DIATEC, page principale) — **échec technique** (reCAPTCHA) ; BMC Endocrine Disorders / Springer (protocole DIATEC) — **échec technique** (redirection de connexion, non aboutie).
- Rapport d'A et retour OE ouverts : le retour OE (`epreuve/entrees/OE-titration-mcg-brut-2026-08-11.txt`) a été ouvert **après** la rédaction des « Attendus » et **après** la recherche indépendante complète (passe d'omission Q1/Q2). Aucun rapport d'A n'existe sur ce tour.
- **Aucun appel au CLI OpenEvidence n'a été fait** par cet agent, à aucun moment.

---

## Verdict sur la négative Q1/Q2 (réponse au point de contrôle)

**La négative NE TIENT PAS telle quelle.** Une recherche indépendante bornée (PubMed, Crossref, Europe PMC, ClinicalTrials.gov, recherche web) a retrouvé, publié **avant** le 2026-08-11 (date de la question OE) :

- **Q1** : un essai randomisé contrôlé ambulatoire, El Fathi et al., *Diabetes Technology & Therapeutics* (mis en ligne le **2026-02-06**, ~6 mois avant la question OE), NCT06111508, PMID 41651803, DOI 10.1177/15209156261420193 — « Safety and Feasibility of Algorithmic Continuous Glucose Monitoring-Based Titration in People with Type 2 Diabetes Using Insulin Degludec… A 16-Week Randomized Controlled Trial ». Il compare précisément une **titration algorithmique pilotée par les données du capteur** (plateforme DiAs-Cloud, changements de dose hebdomadaires générés par l'algorithme et revus par un clinicien) à une **titration standard par autosurveillance capillaire (SMBG)**, chez le DT2 sous insuline degludec (± traitements non insuliniques), 30 participants (20 CGM / 10 SMBG). C'est très exactement la catégorie d'essai que Q1 demande et que le retour OE affirme introuvable.
- **Q2** : ce même essai constitue aussi un algorithme de titration guidé par MCG **publié et évalué prospectivement** (par construction, un essai randomisé est une évaluation prospective) — la négative de Q2 ne tient donc pas non plus sur ce point. Une seconde candidate plus faible et plus tardive existe : Oser et al. 2026, *Diabetes Therapy*, publié le **2026-08-10** (la veille de la question OE), PMID 42573729, DOI 10.1007/s13300-026-01901-4, NCT07681375 — évaluation prospective mono-bras (N=14) d'un système d'optimisation de la basale piloté par MCG (prototype Dexcom « Smart Basal »).

Ce verdict porte sur l'**existence** de l'essai et sa pertinence de périmètre (DT2, basal, vraisemblablement ambulatoire — voir réserve ci-dessous) ; il ne porte pas sur la force de la preuve, qui reste faible (petit effectif, essai pilote de faisabilité, un seul essai). Voir « Proposition de libellé » en fin de rapport.

**Réserve non levée** : je n'ai pas pu confirmer par un passage explicite que l'essai El Fathi est strictement **ambulatoire** (aucune mention d'hospitalisation dans les sources ouvertes ; plateforme cloud/smartphone, suivi à distance, sponsor University of Virginia — Center for Diabetes Technology, tout concourt à un cadre ambulatoire, mais je n'ai pas lu la phrase qui le dit noir sur blanc, l'article étant sous paywall). Ce point reste `[À VÉRIFIER]` avant toute reformulation du nœud.

---

## Attendus (écrits avant ouverture du retour OE, sans A dans ce tour)

### Q1 — ECR titration pilotée par métriques MCG vs glycémie capillaire à jeun

Une réponse sérieuse devrait couvrir :
- **Critère de jugement** : au minimum un substitut chiffré (TIR, HbA1c) avec IC95 % et horizon ; un critère dur (hypoglycémie sévère, événement CV) serait un bonus rarement disponible dans ce champ jeune.
- **Réserve de design attendue, la plus probable** : la plupart des grands essais MCG en DT2 (MOBILE, FreeDM2, et les essais poolés dans une méta-analyse comme celle de Jancev) comparent la **modalité de monitorage** (avoir un capteur affiché vs autosurveillance capillaire), avec un protocole de titration le plus souvent laissé à la discrétion clinique ou auto-géré de façon identique dans les deux bras — ce n'est PAS la même chose qu'un essai qui ferait varier la **règle de décision posologique** elle-même (métrique MCG vs glycémie à jeun comme déclencheur). C'est la distinction centrale attendue, et le risque principal d'une réponse insuffisante est de confondre les deux.
- **Essais nommables de mémoire, à vérifier en priorité** : MOBILE (Martens, JAMA 2021), FreeDM2 (Wilmot, Lancet Diabetes Endocrinol 2026), la méta-analyse de Jancev (Diabetologia 2024) — tous trois susceptibles d'être écartés pour la raison ci-dessus, à vérifier et non à supposer. Réserve : il existe une littérature plus confidentielle (essais pilotes, monocentriques, souvent nord-américains, financés par les fabricants de capteurs ou de stylos connectés) qui teste de véritables algorithmes CGM-pilotés — zone où un outil de repérage généraliste peut avoir une couverture incomplète (biais de nouveauté, faible nombre de citations).
- **Populations à exclure d'emblée** : DT1, grossesse, pompe, boucle fermée, hospitalisation — conformément au périmètre transmis.

### Q2 — Algorithme MCG publié et évalué prospectivement

- Attendu : un algorithme **actionnable** (déclencheur chiffré, pas de dose, palier, rythme de réévaluation), distinct d'un simple consensus d'interprétation (type ATTD/Battelino 2019, qui définit des cibles de TIR/TBR/TAR mais pas une règle de dose).
- Réserve attendue : beaucoup de publications dans ce champ sont des **avis d'experts ou des reviews narratives** (« la basale peut être augmentée si la courbe nocturne monte »), sans seuil ni pas de dose — à distinguer d'un algorithme réellement publié et testé, même en mono-bras ou en petite cohorte pilote.
- Étude nommable de mémoire à soupçonner : littérature autour des « connected pens » et systèmes d'optimisation de basale informés par MCG (type Dexcom, Medtronic, ou publications universitaires pilotes) — champ en évolution rapide en 2025-2026, donc probablement sous-représenté dans un corpus figé.

---

## Cherché, non trouvé (par OE) — passe d'omission Q1/Q2

| Voie | Requête ou source, date | Trouvé | Présent chez OE ? | Effet sur la conclusion |
| --- | --- | --- | --- | --- |
| Études citantes / recherche web ciblée | WebSearch « MOBILE trial CGM basal insulin type 2 diabetes titration algorithm Martens JAMA », 2026-09-24 | Fait remonter, en 2ᵉ résultat, El Fathi et al. (algorithmic CGM-based titration RCT) | Non | Amorce du finding HAUTE Q1/Q2 |
| Études citantes / recherche web ciblée | WebSearch « randomized trial CGM-guided basal insulin titration algorithm vs fasting capillary glucose type 2 diabetes », 2026-09-24 | Confirme El Fathi (RCT, +20,3 vs +8,3 points TIR, diff. +14,6 pts) et signale la comparaison indirecte via le nadir MCG (Martens 2025) | Martens 2025 oui (cité en Q2), El Fathi non | Corrobore le finding HAUTE |
| Registre | ClinicalTrials.gov API v2, `NCT06111508`, 2026-09-24 | Fiche complète : essai terminé (13/09/2024), 16 semaines, CGM-titration algorithmique (n=20) vs SMBG (n=10), publication liée El Fathi 2026 | Non | Confirme un ECR ambulatoire existant, périmètre DT2/basal/degludec conforme |
| Registre | ClinicalTrials.gov, recherche libre « CGM-based titration algorithm type 2 diabetes basal insulin randomized », 2026-09-24 | Fait remonter aussi `NCT07681375` (Oser et al., système Dexcom Smart Basal, prospectif mono-bras) | Non | Finding MOYENNE Q2 (candidat plus faible, daté du 2026-08-10, veille de la question OE) |
| Résultat de sens contraire | WebSearch « CGM-guided basal insulin titration no benefit negative neutral trial type 2 diabetes », 2026-09-24 | Aucun essai négatif/neutre trouvé sur la question précise ; le résultat le plus proche d'un « sens contraire » est Martens 2025 (équivalence, pas supériorité, du nadir MCG vs glycémie à jeun) | Martens 2025 oui, cadré par OE comme rétrospectif et non un pilotage MCG | Cohérent avec OE sur ce point (pas de contradiction) |
| Identifiants | PubMed E-utilities `esummary` sur PMID 41651803, Crossref sur le DOI correspondant, Europe PMC sur le même PMID, 2026-09-24 | Titre, journal (*Diabetes Technology & Therapeutics*), dates (en ligne 2026-02-06, imprimé août 2026), auteurs, DOI — cohérents entre les trois sources | — | Établit l'identité de la source du finding HAUTE, indépendamment du script indisponible |

**Budget** : environ 10 requêtes web + 6 vérifications d'identifiant, sur les deux sous-questions décisives uniquement. Aucune question OE consommée.

---

## Findings

| # | Sévérité | Origine | Description |
| --- | --- | --- | --- |
| F1 | **HAUTE** | omission | La négative de Q1 (« Aucun ECR ambulatoire trouvé ») est fausse en l'état : El Fathi et al. 2026 (PMID 41651803, DOI 10.1177/15209156261420193, NCT06111508) est un ECR comparant explicitement une titration pilotée par algorithme MCG à une titration SMBG, chez le DT2 sous basale (degludec), publié en ligne le 2026-02-06 — six mois avant la question OE. Il n'apparaît nulle part dans le retour (ni corps, ni 23 références numérotées). |
| F2 | **HAUTE** (même essai) | omission | Par construction, F1 répond aussi à Q2 (« algorithme publié et évalué prospectivement ») : la négative de Q2 ne tient pas non plus sur ce point précis, indépendamment de F3. |
| F3 | MOYENNE | omission | Une deuxième candidate pour Q2 existe : Oser et al. 2026 (PMID 42573729, DOI 10.1007/s13300-026-01901-4, NCT07681375), évaluation prospective mono-bras (N=14) d'un système d'optimisation de basale piloté par MCG (Dexcom « Smart Basal »), publiée le 2026-08-10 — la veille de la question OE. Sévérité limitée par la proximité extrême de la date de publication avec la date de cadrage (lag d'indexation plausible, contrairement à F1 dont la fenêtre était de six mois). |
| F4 | MOYENNE | omission (procédural) | Le retour OE transmis ne porte aucune fiche de qualification standard (pas de ligne `Modèle :`, pas de statut `complet/incomplet/précision demandée` déclaré par un orchestrateur). Ce vide n'a pas été comblé par une supposition de ma part ; il reste un point à signaler au référent avant toute exploitation du retour. |
| F5 | BASSE | non vérifiable | Les paramètres numériques exacts de l'algorithme El Fathi (déclencheur, pas de dose, palier) n'ont pas pu être vérifiés : page SAGE en paywall (HTTP 403), résumé conférence ADA 310-OR également bloqué (HTTP 403). Le registre ClinicalTrials.gov confirme trois composantes (« titration glucose level, personalized target, safety hypoglycemia feature ») sans détail chiffré. `[À VÉRIFIER]` avant toute reprise de ce chiffre dans le nœud. |
| F6 | BASSE | non vérifiable | L'affirmation d'OE en Q3 selon laquelle « il n'y a eu aucune différence significative de dose totale d'insuline entre bras » dans MOBILE n'a pas pu être confirmée ni infirmée dans le temps imparti (le PDF ouvert donne les résultats de TIR/HbA1c, pas la comparaison des doses). Ne pas la recopier comme vérifiée sans relecture complémentaire. |

---

## Confirmations obtenues (avec localisation)

- **MOBILE, chiffres Q3** : « adjusted difference, 15% [95% CI, 8% to 23%] » (TIR) et « adjusted difference, −0.4% [95% CI, −0.8% to −0.1%]; P = .02 » (HbA1c) — lus dans le texte intégral du PDF JAMA (DOI 10.1001/jama.2021.7444, bronze OA via Unpaywall), section Résultats/Abstract. **Exactement conformes** aux chiffres cités par OE.
- **Jancev, chiffres Q3** : résumé structuré lu via Europe PMC (PMID 38363342) — HbA1c MD −3,43 mmol/mol (−0,31 %), IC95 % −4,75 à −2,11 mmol/mol (≈ −0,43 % à −0,19 % une fois convertis) ; TIR +6,36 %, IC95 % +2,48 à +10,24 %. **Conformes** aux chiffres cités par OE, y compris la conversion mmol/mol → %.
- **DIATEC, classement hors-périmètre (population hospitalière)** : confirmé indépendamment — titre de la notice PubMed elle-même (« In-Hospital Diabetes Management… », PMID 39887698, DOI 10.2337/dc24-2222), et résumé du protocole (« 166 non-critically ill patients », essai bicentrique PROBE) lu via Europe PMC. L'exclusion de DIATEC du périmètre ambulatoire par OE **tient**.
- **DIATEC, algorithme identique dans les deux bras (cible 5,6–7,8 mmol/L)** : confirmé par recherche agrégée (résumé accessible, pas le texte intégral — accès direct à Diabetes Care bloqué par reCAPTCHA, à BMC/Springer bloqué par une redirection de connexion). Cohérent avec l'affirmation d'OE que seule la source de mesure diffère, pas le pas de dose.
- **Identité des identifiants cités par OE** : MOBILE PMID 34077499, FreeDM2 PMID 42035781 (DOI 10.1016/S2213-8587(26)00076-8), Jancev PMID 38363342, ATTD/ICTR PMID 31177185 (Battelino et al., *Diabetes Care* 2019, « Clinical Targets for Continuous Glucose Monitoring Data Interpretation »), Martens 2025 rétrospectif PMID 40683222 (DOI 10.1016/j.dsx.2025.103266), DIATEC PMID 39887698 / DOI 10.2337/dc24-2222 — **tous vérifiés via PubMed E-utilities et/ou Crossref et/ou Europe PMC, tous corrects** (titre, journal, date, DOI cohérents entre les identifiants annoncés par OE et les sources recoupées). Contrairement au précédent du 2026-07-29 (6 PMID sur 7 faux), **aucun PMID discordant n'a été trouvé sur ce retour**, sur l'échantillon vérifié.
- **Remarque sur la PMID de FreeDM2 « absente de la liste numérotée »** : en réalité, la référence [4] du retour OE donne bien le DOI de Wilmot et al. (10.1016/S2213-8587(26)00076-8) ; c'est la liste numérotée dans son ensemble qui ne porte **aucun** PMID pour **aucune** référence (seulement des DOI) — ce n'est donc pas une anomalie propre à FreeDM2, mais un choix de format constant du retour. **Objection retirée** : ce n'est pas, en soi, un signe d'un PMID fabriqué (le PMID en corps de texte a été vérifié indépendamment et est correct).

## Objections retirées

- **Objection initiale** : le classement de DIATEC comme hors-périmètre pourrait être une extrapolation d'OE. **Retirée** après lecture de la notice PubMed et du résumé du protocole (population hospitalière confirmée, cf. « Confirmations »).
- **Objection initiale** : l'absence de PMID dans la référence [4] pour FreeDM2 pourrait signaler une invention. **Retirée** : aucune référence de la liste numérotée ne porte de PMID (format constant), et le PMID donné en corps de texte est correct.

---

## Décompte

**Par sévérité** : HAUTE = 2 (F1, F2 — même essai, deux sous-questions) ; MOYENNE = 2 (F3, F4) ; BASSE = 2 (F5, F6).

**Par origine** : omission = 4 (F1, F2, F3, F4) ; non vérifiable = 2 (F5, F6) ; OE seule = 0 ; A et OE = sans objet ; A seule = sans objet ; source elle-même = 0.

---

## Verdict par sous-question

- **Q1** : **NE TIENT PAS**. Un ECR ambulatoire répondant précisément à la question existe (El Fathi et al. 2026), publié six mois avant la question OE, absent du retour (F1).
- **Q2** : **NE TIENT PAS**. Le même essai constitue un algorithme publié et évalué prospectivement (F2) ; une seconde candidate plus faible existe (F3, Oser et al., publiée la veille de la question OE — recevabilité plus fragile).
- **Q3** : **Tient globalement**, avec une réserve. Les chiffres cités (MOBILE, Jancev) sont exacts et vérifiés en primaire. L'attribution « la titration n'était pas pilotée par les métriques MCG » est confirmée pour DIATEC (algorithme identique aux deux bras) et plausible pour MOBILE (le texte intégral ne détaille pas d'algorithme MCG-spécifique, mais ne l'exclut pas non plus explicitement). L'affirmation sur l'absence de différence de dose totale dans MOBILE reste non vérifiée par moi (F6).
- **Q4** : Non contredit par ma recherche indépendante (budget non consacré à une vérification approfondie sur cette sous-question contextuelle) ; cohérent avec les éléments Q1/Q2 (les seuils d'action posologique chiffrés restent, à ma connaissance indépendante, ancrés sur la glycémie à jeun plutôt que sur des métriques MCG — sous réserve que l'algorithme El Fathi, une fois ses paramètres exacts obtenus, ne vienne pas nuancer ce point, cf. F5).
- **Q5** : Non contredit ; non vérifié en primaire dans le temps imparti (sous-question contextuelle, budget non consacré).
- **Q6** : Non contredit ; non vérifié en primaire dans le temps imparti (sous-question contextuelle, budget non consacré).

---

## Proposition de libellé pour le nœud (sous réserve de validation du référent)

Ne pas écrire une absence totale de preuve pour Q1/Q2. Proposition :

> « Aucun essai de grande envergure n'a validé, en ambulatoire chez le DT2 sous basale, un algorithme de titration piloté par les métriques MCG (TIR/TAR/tendance AGP) face à la glycémie capillaire à jeun. Un signal émergent existe : un essai randomisé pilote (El Fathi et al., *Diabetes Technology & Therapeutics*, 2026, PMID 41651803, N=30) a comparé une titration algorithmique pilotée par capteur à une titration par autosurveillance chez le DT2 sous insuline degludec, avec un gain de temps dans la cible (+14,6 points, p=0,001) sur 16 semaines — effectif restreint, essai de faisabilité, partenaire industriel (Novo Nordisk), à ne pas présenter comme une preuve suffisante pour piloter l'algorithme du nœud, mais à citer comme littérature la plus proche de la question posée. »

Ce libellé reste `[À VÉRIFIER]` sur deux points avant tout encodage : (a) confirmation que l'essai est bien ambulatoire (paywall non levé, cf. Verdict), (b) paramètres numériques exacts de l'algorithme (F5).
