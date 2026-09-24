# Red-team (Agent B) — négative Q1/Q2 du retour OpenEvidence, titration de basale pilotée par MCG (DT2)

- **Dossier / nœud** : titration de l'insuline basale pilotée par la MCG, DT2 — nœud `insuline`
- **Pièce attaquée** : `epreuve/entrees/OE-titration-mcg-brut-2026-08-11.txt` (retour OpenEvidence du 2026-08-11
  sur `epreuve/entrees/prompt-OE-titration-mcg.md`). Pas de rapport Agent A distinct dans ce dossier —
  le red-team porte donc uniquement sur le retour OE, pas sur un croisement A+OE.
- **Étape** : étape 2 (`recherche-preuve-triangulee`), point de contrôle demandé par le référent : la
  négative de Q1 et Q2 tient-elle ? Périmètre : adulte DT2 sous insuline basale, ambulatoire (hors DT1,
  pompe, boucle fermée, hospitalisation), littérature publiée avant le 2026-08-11.
- **Consigne respectée** : aucune requête OpenEvidence posée pour ce travail.

## Accès obtenus / bloqués

- **Déviation de méthode à signaler** : les connecteurs MCP prescrits par `recherche-source-primaire`
  (PubMed, ClinicalTrials.gov, Consensus) ont tous été **refusés par la politique de permissions de la
  session** (« don't ask mode »), avant toute tentative de requête réelle — refus systémique, pas un
  échec d'accès à une source précise. Repli sur `WebSearch`/`WebFetch` génériques, plus l'API publique
  `clinicaltrials.gov/api/v2/studies/<NCT>` (équivalent fonctionnel du connecteur ClinicalTrials.gov
  pour la lecture d'une fiche d'essai). Les chiffres obtenus via cette API sont des données de registre
  publiques, au même titre que via le connecteur MCP — pas une dégradation de fiabilité, seulement un
  changement d'outil.
- **Accès obtenus** : PubMed (pages web publiques), ClinicalTrials.gov (fiche complète NCT06111508 via
  API), pages éditeur (JAMA, Diabetes Care, Diabetologia via PMC, communiqués institutionnels UVA/Dexcom).
- **Accès bloqués** : texte intégral de l'article princeps El Fathi et al. (`journals.sagepub.com`,
  403 ; page PubMed elle-même chargée sans le corps de l'abstract, cache-cookie). Les paramètres exacts
  de l'algorithme (seuil de déclenchement, pas de dose en unités) n'ont donc **pas** pu être vérifiés sur
  la source primaire elle-même — repli sur la fiche de résultats ClinicalTrials.gov (données chiffrées
  posted results, complètes pour les critères de jugement, mais silencieuses sur la mécanique interne de
  l'algorithme).

## Verdict par sous-question

### Q1 — Existe-t-il un ECR comparant titration de basale pilotée par MCG vs pilotée par glycémie capillaire à jeun, chez le DT2 ?

**La négative ne tient pas.** Un ECR ambulatoire répondant précisément à la question existe et a été
manqué par OpenEvidence : **El Fathi A, Nass R, Levy CJ, et al. « Safety and Feasibility of Algorithmic
Continuous Glucose Monitoring-Based Titration in People with Type 2 Diabetes Using Insulin Degludec,
With or Without Noninsulin Glucose-Lowering Drugs: A 16-Week Randomized Controlled Trial »**, *Diabetes
Technology & Therapeutics*, 2026, doi 10.1177/15209156261420193, PMID 41651803 — essai
**NCT06111508** (« CGM-DTx »), University of Virginia + Icahn School of Medicine at Mount Sinai,
financement Novo Nordisk (subvention), sponsor académique UVA.

Voir finding HAUTE ci-dessous pour le détail (population, bras, résultats). La formulation correcte
n'est pas « aucun ECR trouvé pour Q1 » mais **« un seul ECR ambulatoire identifié, effectif réduit
(n=30), significatif sur le critère principal »**.

### Q2 — À défaut d'ECR, existe-t-il un algorithme de titration guidé par la MCG publié et évalué prospectivement chez le DT2, avec valeurs chiffrées actionnables ?

**La négative ne tient pas non plus, mais de façon plus nuancée.** Deux éléments manqués par OpenEvidence :

1. Le même essai NCT06111508 constitue justement un algorithme **publié et évalué prospectivement**
   (au sens fort : par un ECR, pas seulement une étude prospective non comparative). Ses paramètres
   internes exacts (seuil déclencheur, pas de dose) n'ont cependant pas pu être vérifiés sur le texte
   intégral (accès bloqué) — voir finding BASSE / non-vérifiable.
2. **Dexcom Smart Basal**, système commercial d'aide à la titration de basale piloté par MCG, a obtenu
   un **marquage FDA le 19/11/2025** — donc avant le 2026-08-11 — spécifiquement pour le DT2 sous
   insuline basale seule (glargine U-100), ambulatoire, hors DT1/pompe/boucle fermée. Voir finding
   MOYENNE.

La formulation la plus prudente reste défendable : aucun **algorithme MCG-piloté avec seuil et pas de
dose publiquement documentés dans une source ouverte** n'a pu être confirmé de façon vérifiée dans ce
tour. Mais l'affirmation telle qu'écrite par OE (« aucun algorithme... évalué prospectivement ») est
**factuellement fausse** : un tel algorithme existe, a été évalué prospectivement par ECR, et un
second est commercialisé sous clairance FDA.

## Findings classés par sévérité et par origine

### HAUTE — OpenEvidence seule fautive

**Finding 1 — ECR manqué qui répond directement à Q1 (et en grande partie à Q2)**

- **Résumé** : OpenEvidence conclut « Aucun ECR ambulatoire trouvé pour Q1 » et « Aucun ECR ambulatoire
  prospectif trouvé pour Q2 ». Un ECR existe : NCT06111508 / PMID 41651803 (El Fathi et al., *Diabetes
  Technology & Therapeutics*, 2026), déjà présenté en abstract à l'ADA Scientific Sessions 2025
  (« 310-OR », *Diabetes* 2025;74(Suppl 1)) — donc visible dans la littérature indexée **plus d'un an**
  avant la requête OE du 2026-08-11.
- **Population vérifiée (registre ClinicalTrials.gov, champ Eligibility, cité verbatim)** : adultes
  ≥18 ans, DT2 diagnostiqué depuis ≥180 jours, HbA1c 7–9 %, **sous insuline basale quotidienne depuis
  ≥90 jours**, dose stable de traitements non insuliniques associés. Exclusions explicites : usage de
  **pompe à insuline**, usage d'insuline rapide/prandiale (donc basale pure, pas basal-bolus), grossesse,
  utilisation de MCG dans les 30 jours précédents. Deux sites (Mount Sinai NY, UVA Charlottesville) —
  population strictement ambulatoire, aucune mention d'hospitalisation. Le périmètre du prompt (DT2 sous
  basale, ambulatoire, hors DT1/pompe/boucle fermée) est donc respecté par construction de l'essai.
- **Intervention vérifiée** : randomisation 2:1, algorithme « DiAs-Cloud » analysant les données MCG des
  2 semaines précédentes pour générer une recommandation hebdomadaire de dose de basale (degludec), avec
  MCG ouverte dans le bras expérimental (n=20) vs titration hebdomadaire sur autosurveillance glycémique
  (SMBG) avec MCG aveugle dans le bras contrôle (n=10). C'est exactement l'opposition « pilotage par
  métriques MCG » vs « pilotage par glycémie capillaire » que Q1 demande.
- **Résultats vérifiés (fiche de résultats postée ClinicalTrials.gov, NCT06111508)** : critère principal
  — variation du temps dans la cible (3,9–10,0 mmol/L) de la semaine 0 aux semaines 14–16 : bras MCG
  +20,3 points (ET 18,1) vs bras SMBG +8,3 points (ET 20,0) ; **différence de traitement estimée +14,6
  points, IC 95 % ≥ 4 (unilatéral), p = 0,001**. Critères secondaires cohérents : HbA1c −0,74 % (ET 0,60)
  vs −0,28 % (ET 1,16) ; temps en zone étroite (70–140 mg/dL) +21,2 vs +5,3 points ; 0 décès, 0 EIG dans
  les deux bras sur 17 semaines de suivi.
- **Limite honnête à porter dans le nœud** : effectif très réduit (30 randomisés, 28 terminés — 19/9 par
  bras), étude explicitement qualifiée par les auteurs de « Safety and Feasibility » — un essai de
  faisabilité, pas un essai de confirmation de phase 3. Le niveau de preuve GRADE doit rester bas
  (imprécision majeure, essai unique, financement industriel Novo Nordisk).
- **Sévérité** : HAUTE — c'est le point de contrôle demandé par le référent, et il est tranché : la
  négative de Q1 ne tient pas.
- **Origine** : OpenEvidence seule fautive — aucun rapport Agent A ne préexiste dans ce dossier pour
  partager la faute, et rien n'indique que cet essai relève d'un domaine (DT1/pompe/boucle fermée) que
  le prompt demandait explicitement d'exclure ou d'ignorer.

### MOYENNE — OpenEvidence seule fautive

**Finding 2 — Système commercial d'aide à la titration MCG-pilotée, clairance FDA antérieure au 2026-08-11, pertinent pour Q2**

- **Résumé** : Dexcom Smart Basal, décrit par Dexcom comme « the first and only CGM-integrated basal
  insulin dosing optimizer » pour le DT2, a reçu une **clairance FDA le 19 novembre 2025** (communiqué
  officiel Dexcom Investors, daté). Le dispositif analyse les données du capteur Dexcom G7 pour produire
  une recommandation quotidienne de dose de basale (glargine U-100), explicitement réservé au DT2 sous
  insuline basale, en ambulatoire — le communiqué exclut nommément DT1, pompe et boucle fermée du champ
  d'indication.
- **Étude d'appui repérée mais datation incertaine par rapport au 2026-08-11** : Olson et al., «
  Continuous Glucose Monitoring-Informed Basal Insulin Optimization System in Adults with Type 2
  Diabetes… », *Diabetes Therapy*, PMID 42573729 — étude prospective **monobras** (n=14), pas un ECR,
  avec amélioration du TIR (+16,0 points) et de la satisfaction de traitement. Le mois de publication
  exact (« août 2026 » selon un relais secondaire) n'a pas pu être confirmé avec certitude suffisante
  pour trancher s'il précède ou suit le 2026-08-11 — **marqué NON VÉRIFIÉ**, à traiter avec prudence, ne
  pas citer comme antérieur au 2026-08-11 sans confirmation de date exacte sur la source primaire.
- **Ce qui est solide indépendamment de cette date** : la clairance FDA elle-même (19/11/2025) est
  antérieure et suffit à établir qu'un algorithme MCG-piloté de titration de basale, pour le DT2
  ambulatoire hors DT1/pompe/boucle fermée, avait déjà atteint un stade de validation réglementaire
  avant la question posée à OE. Une clairance FDA n'est pas un essai randomisé et ne doit pas être
  présentée comme telle dans le nœud — mais c'est une forme de validation distincte que Q2, formulée
  largement (« publié et évalué prospectivement »), aurait dû, à tout le moins, mentionner et qualifier.
- **Sévérité** : MOYENNE — ça ne renverse pas la conclusion générale (pas de titration MCG-pilotée
  validée par ECR de confirmation à large échelle) mais ça affaiblit le tableau « rien n'existe » dressé
  par OE pour Q2, et un référent clinique doit savoir qu'un produit avec ce positionnement précis est
  déjà sur le marché.
- **Origine** : OpenEvidence seule fautive.

### BASSE — non-vérifiable (accès bloqué, à traiter comme un résultat honnête)

**Finding 3 — Paramètres exacts de l'algorithme El Fathi (Finding 1) non vérifiables sur source primaire ouverte**

- Le texte intégral de l'article (*Diabetes Technology & Therapeutics*, sagepub.com) a renvoyé une
  erreur 403 ; la page PubMed n'a chargé qu'un bandeau cookies sans le corps de l'abstract. La fiche
  ClinicalTrials.gov ne détaille pas non plus le seuil de déclenchement ni le pas de dose en unités —
  seulement « titration glucose level, personalized target, and safety hypoglycemia feature »,
  calculés une fois par semaine par le logiciel DiAs-Cloud.
- Conséquence pratique pour le nœud : l'**existence** de l'essai et ses **résultats chiffrés sur les
  critères de jugement** (finding 1) sont vérifiés sur le registre public (données de résultats postées,
  juridiquement contraignantes pour le sponsor). Les **mécanismes internes de l'algorithme** (seuil,
  pas de dose) restent `NON VÉRIFIÉ` — ne pas les citer dans l'argumentaire avant accès au texte intégral
  (bibliothèque institutionnelle ou abonnement personnel à demander au référent, cf. discipline
  `recherche-source-primaire`).
- **Sévérité** : BASSE. **Origine** : non-vérifiable / accès bloqué — pas un manquement d'OpenEvidence
  ni de ce red-team.

**Finding 4 — Affirmation OE sur DIATEC (« algorithmes identiques dans les deux bras, seule la source de mesure diffère ») non confirmée indépendamment**

- OE affirme, à propos de DIATEC (hors périmètre du prompt : population hospitalisée, exclue par la
  consigne 2 du prompt), que les cibles et pas de dose étaient strictement identiques entre bras. Les
  sources secondaires accessibles confirment seulement que « les équipes diabéto ont des algorithmes
  opérationnels de titration dans les deux bras » et que le critère principal est le TIR — sans confirmer
  ni infirmer l'identité stricte des deux algorithmes. Le texte intégral (Diabetes Care) n'a pas été
  consulté (hors périmètre de la vérification prioritaire, puisque DIATEC ne pèse de toute façon pas sur
  le verdict Q1/Q2 ambulatoire).
- **Sévérité** : BASSE — sans incidence sur le verdict Q1/Q2 puisque DIATEC est de toute façon hors
  périmètre (hospitalisation). Signalé pour mémoire, pas pour action immédiate.
- **Origine** : non-vérifiable / accès non consulté dans ce tour (priorité donnée à Q1/Q2 ambulatoire).

## Confirmations obtenues

Ce qui a été rouvert indépendamment et qui **tient** :

- **MOBILE** (PMID 34077499) : essai réel, JAMA 2021;325(22):2262-2272, DT2 sous basale sans prandiale,
  soins primaires — confirmé conforme à la description d'OE (collaboration spécialiste/soins primaires,
  pas d'algorithme MCG-piloté à proprement parler).
- **FreeDM2** (Wilmot et al., *Lancet Diabetes Endocrinol* 2026;14(6):463-474, doi
  10.1016/S2213-8587(26)00076-8 ; protocole PMID 40233956) : essai réel confirmé, 303 participants,
  24 centres UK, conception en 2 phases (16 sem. auto-gestion + 16 sem. accompagnement clinicien) —
  conforme à la description d'OE. Le PMID de l'article de résultats cité par OE (42035781) n'a pas pu
  être confirmé caractère pour caractère faute d'accès à la fiche PubMed elle-même (bandeau cookies) —
  à revérifier ponctuellement, mais l'identité de l'essai et son contenu sont, eux, confirmés par
  d'autres voies (Lancet, communiqués Imperial/UVA de presse).
- **DIATEC** (Olsen et al., *Diabetes Care* 2025;48(4):569-578, PMID 39887698) : essai réel confirmé,
  population hospitalière non-USI (166 patients, 2 centres, PROBE), critère principal TIR — conforme à
  la description d'OE, y compris le caractère non-ambulatoire qui justifie son exclusion du périmètre.
- **Méta-analyse Jancev** (PMID 38363342, *Diabetologia* 2024;67:798-810) : **tous les chiffres cités
  par OE recoupés exactement sur le texte intégral** — 12 ECR, 1248 participants (706 MCG / 542 SMBG) ;
  HbA1c −3,43 mmol/mol soit −0,31 % (IC 95 % −4,75 à −2,11 mmol/mol, converti ≈ −0,43 à −0,19 % — la
  conversion mmol/mol→% que fait implicitement OE est correcte) ; TIR +6,36 % (IC 95 % +2,48 à +10,24) ;
  TAR −5,86 % ; TBR −0,66 %. Le cadrage d'OE (comparaison de modalité de monitorage, pas d'algorithme de
  titration harmonisé) est également confirmé par le texte intégral.
- **Martens et al. 2025** (nadir MCG de la 1 h du matin, PMID 40683222, *Diabetes Metab Syndr*) : étude
  réelle confirmée, correctement qualifiée par OE de rétrospective (donc non répondante à Q2 au sens
  strict), substitut de la glycémie à jeun et non un pilotage par métriques MCG.
- **ATTD/ICTR** (Battelino et al., PMID 31177185, *Diabetes Care* 2019;42(8):1593-1603) : confirmé
  comme consensus de cibles d'**interprétation** (TIR/TAR/TBR), sans algorithme posologique — la
  distinction que fait OE entre seuil d'interprétation et seuil d'action posologique est correcte sur
  cette source.

## Décompte final

| Sévérité | Origine OE seule | Origine A+OE partagée | Origine A seule | Origine source primaire | Non-vérifiable |
|---|---|---|---|---|---|
| HAUTE | 1 | – | – | – | – |
| MOYENNE | 1 | – | – | – | – |
| BASSE | – | – | – | – | 2 |
| **Total** | **2** | **0** | **0** | **0** | **2** |

Pas de rapport Agent A dans ce dossier : la colonne « A+OE partagée » et « A seule » sont donc
structurellement vides ici, pas un signe de qualité particulière d'un Agent A absent.

**Confirmations obtenues** : 6 (MOBILE, FreeDM2, DIATEC, Jancev, Martens 2025, ATTD/ICTR) — la
discipline de citation d'OE (PMID/DOI exacts, chiffres, distinction dur/substitution) est bonne sur tout
ce qui a été vérifié. Le problème n'est pas la fidélité aux sources citées, c'est un **rappel
incomplet** : au moins un ECR pertinent et un dispositif à clairance FDA pertinents n'ont pas été
trouvés du tout.

## Proposition de libellé pour le nœud (formulations graduées, à valider par le référent)

**Formulation prudente** :
> Un essai randomisé ambulatoire de faible effectif (n=30, El Fathi et al. 2026, NCT06111508) suggère
> qu'une titration hebdomadaire de la basale pilotée par un algorithme utilisant les données de mesure
> continue du glucose améliore le temps dans la cible par rapport à une titration par autosurveillance
> glycémique, chez le DT2 sous basale seule. Preuve de faisabilité, pas de confirmation : effectif
> réduit, essai unique, niveau de preuve GRADE bas. Aucun algorithme MCG-piloté avec seuil de
> déclenchement et pas de dose publiquement documentés n'est à ce jour identifiable en source ouverte.

**Formulation intermédiaire** :
> Contrairement à une lecture initiale de la littérature, un ECR ambulatoire existe bien pour la
> titration de basale pilotée par MCG chez le DT2 (El Fathi et al., *Diabetes Technology & Therapeutics*
> 2026 ; NCT06111508 ; n=30) : bénéfice significatif en temps dans la cible (+14,6 points, p=0,001) et en
> HbA1c à 16 semaines. Un dispositif commercial pilotant la titration de basale par MCG (Dexcom Smart
> Basal) a par ailleurs obtenu une clairance FDA en novembre 2025 pour cette même population. La preuve
> reste de faible volume (un seul essai, petit effectif) et ne justifie pas encore un algorithme
> posologique chiffré dans le nœud, mais la case « aucune preuve » doit être retirée.

**Formulation la plus affirmative (à ne retenir que si le référent juge l'essai de faisabilité
suffisant pour peser sur la décision clinique)** :
> La titration de basale pilotée par MCG dispose désormais d'une première preuve randomisée positive en
> ambulatoire chez le DT2 (TIR +14,6 points à 16 semaines, IC 95 % ≥4, p=0,001) et d'un dispositif à
> clairance FDA. Ce n'est pas encore un niveau de preuve suffisant pour remplacer la glycémie à jeun
> comme paramètre de titration par défaut, mais l'argumentaire ne peut plus affirmer une absence totale
> de preuve.

**Point à trancher par le référent avant toute rédaction** : accès au texte intégral d'El Fathi et al.
(bibliothèque institutionnelle/personnelle ?) pour confirmer les paramètres exacts de l'algorithme
(seuil, pas de dose) avant de les citer chiffrés dans le nœud — sans quoi seul le résultat clinique
global (TIR, HbA1c) peut être repris, pas le mécanisme.
