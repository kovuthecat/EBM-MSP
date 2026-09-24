# Red-team (étape 2, Agent B) — négative Q1/Q2 du retour OpenEvidence, titration de basale pilotée par MCG (DT2)

Dossier : titration de l'insuline basale pilotée par la MCG, nœud `insuline`.
Pièces attaquées : `epreuve/entrees/prompt-OE-titration-mcg.md` +
`epreuve/entrees/OE-titration-mcg-brut-2026-08-11.txt` (retour du 2026-08-11).
Aucune requête OpenEvidence n'a été posée pour ce travail. Périmètre du contrôle : adulte DT2 sous
insuline basale, ambulatoire ; hors DT1, pompe, boucle fermée, hospitalisation ; littérature publiée
avant le 2026-08-11.

## Accès obtenus / accès bloqués

- **Bloqué dès le départ** : les connecteurs MCP nommés par le skill (PubMed, ClinicalTrials.gov,
  Consensus) sont refusés par la politique de permission de cette session (« don't ask mode »),
  y compris en lecture seule (`search_articles`, `get_article_metadata`, `search_trials`,
  `Consensus__search`). Je le signale explicitement plutôt que de contourner : **la vérification
  ci-dessous repose entièrement sur recherche web générique (WebSearch/WebFetch)**, pas sur les
  connecteurs structurés recommandés par `recherche-source-primaire`. C'est une limite méthodologique
  réelle, pas un choix — à corriger si une nouvelle passe est nécessaire.
- **Obtenu** : résumé structuré complet (europepmc.org, accès ouvert à l'abstract) pour l'essai
  décisif ci-dessous ; fiche ClinicalTrials.gov (API v2) pour NCT06111508 et NCT06024928 ; protocole
  DIATEC en accès libre (PMC11071255) ; communiqués institutionnels (UVA, EurekAlert) triangulés avec
  la fiche PubMed et l'abstract ADA.
- **Bloqué (paywall / rendu JS)** : texte intégral de MOBILE (JAMA), FreeDM2 (Lancet Diabetes
  Endocrinol), Jancev (Diabetologia), Martens 2025 rétrospectif (Diabetes Metab Syndr), article
  complet CGM-DTx (revue SAGE) — je me suis appuyé sur résumés secondaires concordants (communiqués,
  pages d'éditeur, ScienceDirect/Lancet abstracts) pour ces points, jamais sur une reformulation
  d'OpenEvidence elle-même. Marqué `partiel — via résumés secondaires concordants` ci-dessous, jamais
  présenté comme équivalent à une lecture primaire complète.

## Verdict global sur la négative Q1/Q2

**La négative ne tient pas telle quelle.** Il existe un essai randomisé contrôlé, publié avant le
2026-08-11, qui répond directement à la question de Q1 (titration hebdomadaire pilotée par un
algorithme sur données de MCG vs titration par autosurveillance glycémique, chez l'adulte DT2 sous
basale, en ambulatoire) et qui, de ce fait, répond aussi à Q2 (algorithme publié et évalué
prospectivement). Cet essai est absent des six sous-réponses et absent des 23 références du retour
OE. Le reste du retour (Q3 à Q6, et les citations qui ne portent pas sur cette négative) résiste bien
à la vérification indépendante — voir décompte plus bas.

## Findings

### HAUTE — OpenEvidence seule fautive

**F1. Un ECR ambulatoire pertinent pour Q1/Q2 existe et n'a pas été trouvé : CGM-DTx (El Fathi et al., NCT06111508).**

- Essai randomisé contrôlé, 2 sites, 16 semaines, DT2 adultes sous insuline dégludec (± antidiabétiques
  non insuliniques), **ambulatoire**, HbA1c 7–9 %, DT2 diagnostiqué ≥ 180 jours, sous basale ≥ 90
  jours, CGM-naïfs ; exclusion pompe à insuline, insuline rapide récente — **périmètre exactement
  celui du prompt** (hors DT1, pompe, boucle fermée, hospitalisation).
- Randomisation 2:1 : **titration hebdomadaire par algorithme sur données de MCG** (Dexcom G6, données
  des 2 semaines précédentes → recommandation hebdomadaire ; algorithme à trois composantes : « niveau
  de glucose de titration », cible personnalisée, sécurité hypoglycémie) **vs titration hebdomadaire
  par autosurveillance capillaire** avec CGM aveugle — c'est très précisément la comparaison demandée
  par Q1 (« pilotée par les métriques de MCG… plutôt que par la glycémie capillaire »).
- Résultat chiffré en effet absolu : TIR (70–180 mg/dL) +20,3 points (54,1 %→75,3 %) groupe MCG vs
  +8,3 points (50,2 %→55,3 %) groupe SMBG ; différence de traitement **+14,6 points, IC 95 %
  unilatéral 4,0–27,8, p = 0,03** ; HbA1c −0,74 % (MCG) vs −0,28 % (SMBG) ; hypoglycémie < 70 mg/dL
  médiane 0,34 % vs 0,00 %, aucun événement sévère. N = 30 (20 MCG / 10 SMBG), critères de jugement en
  **substitution** (TIR, HbA1c), pas de critère dur.
- Statut : `partiel — via résumés secondaires concordants` pour le détail fin de l'algorithme (le
  texte intégral, payant, n'a pas pu être ouvert) ; en revanche **l'existence, le design, la
  population et les résultats chiffrés principaux sont vérifiés par quatre sources indépendantes
  concordantes** : abstract ADA (« 310-OR », Diabetes 2025;74[Suppl 1]), fiche résultats
  ClinicalTrials.gov (postée le 2026-03-04), communiqué de l'University of Virginia / Center for
  Diabetes Technology (2026-03-24, repris par EurekAlert), et résumé structuré europepmc.org de
  l'article évalué par les pairs (PMID 41651803, DOI 10.1177/15209156261420193, revue à confirmer —
  voir F3).
- **Antériorité au 2026-08-11 établie à triple titre** : abstract ADA public depuis l'été 2025 (plus
  d'un an avant la requête OE), résultats ClinicalTrials.gov publics depuis mars 2026, article évalué
  par les pairs et communiqué de presse datés de mars 2026 — bien avant la requête du 2026-08-11.
- Conséquence directe : la phrase-clé du retour OE — « Aucun ECR ambulatoire trouvé pour Q1… » — est
  factuellement inexacte à la date de la requête. Et parce que cet algorithme est publié avec des
  chiffres actionnables (déclencheur hebdomadaire, cible personnalisée, garde-fou hypoglycémie) et
  évalué prospectivement en RCT, Q2 tombe avec Q1.
- Origine : **OpenEvidence seule fautive** — un essai indexé sur ClinicalTrials.gov et présenté à un
  congrès international un an plus tôt aurait dû remonter dans une recherche ciblée sur exactement
  cette question.

### MOYENNE — OpenEvidence seule fautive

**F2. Caractérisation imprécise de l'algorithme DIATEC (bras MCG) au titre de Q3.**

- Le retour OE affirme : « les algorithmes étaient IDENTIQUES pour les cibles et les pas de dose dans
  les deux bras ; seule différait la SOURCE de mesure… Ce n'est donc pas un algorithme "piloté par
  métriques MCG" (TIR/TAR/AGP) mais par une valeur glycémique nocturne obtenue via capteur. »
- Le protocole publié (PMC11071255, en accès libre) montre une nuance : le bras glycémie capillaire
  titre sur des **valeurs ponctuelles** nocturnes ; le bras MCG titre sur des **seuils de pourcentage
  de temps dans une plage** nocturne (verbatim : « If ≥5 % of glucose levels are in this range… »).
  Les cibles et les pas de dose sont bien identiques entre bras (ce point d'OE est exact), mais la
  variable de décision du bras capteur **est** une métrique de type « temps dans une plage »
  restreinte à la fenêtre nocturne — donc plus proche d'une métrique MCG (au sens Q1/Q4) que ne le
  laisse entendre la formulation catégorique d'OE.
- Portée limitée : DIATEC reste une population **hospitalière**, donc hors périmètre du nœud
  quel que soit ce point de détail — la conclusion pratique d'OE (DIATEC non transposable à
  l'ambulatoire) n'est pas affectée. C'est la justification du rejet qui est imprécise, pas le rejet
  lui-même.
- Origine : **OpenEvidence seule fautive** (simplification excessive d'un protocole accessible
  gratuitement).

### BASSE — non-vérifiable (résultat honnête, pas un manquement)

**F3. Identité exacte de la revue de publication de CGM-DTx à confirmer.**

Le résumé europepmc.org rapporte la revue « Diabetes Technology & Therapeutics » (vol. 28, n° 8,
p. 858–866, août 2026), donnée reprise du communiqué UVA/EurekAlert. Or le DOI (10.1177/…) et l'URL
d'hébergement (`journals.sagepub.com`) correspondent à l'éditeur SAGE, alors que *Diabetes Technology
& Therapeutics* est publié par Mary Ann Liebert avec un préfixe DOI 10.1089 — pas 10.1177. Le nom de
revue exact (probablement une revue SAGE comme *Journal of Diabetes Science and Technology*) doit être
revérifié à la source avant toute citation dans le nœud ; cela n'affecte ni l'identité de l'essai
(PMID 41651803, NCT06111508 confirmé par ailleurs) ni ses résultats chiffrés.

**F4. Un deuxième algorithme prospectif (Dexcom Smart Basal / BTO) publié le 2026-08-10, à la limite du raisonnable.**

Étude prospective mono-bras (N = 14 DT2, 3 en initiation + 11 en optimisation de basale), système
propriétaire Dexcom (« Basal Therapy Optimization »), publiée dans *Diabetes Therapy* le
**2026-08-10** — soit la veille de la requête OE. Elle répondrait, elle aussi, à Q2 (algorithme publié
et évalué prospectivement), mais avec un niveau de preuve plus faible que CGM-DTx (mono-bras, N = 14,
pas de comparateur randomisé). Compte tenu du délai d'indexation réel de la littérature, il n'est pas
raisonnable de reprocher à OE de ne pas l'avoir trouvée le lendemain de sa publication — **traité comme
un résultat honnête**, pas comme un manquement, mais à signaler au référent car pertinent pour une
future itération du nœud.

**F5. NCT06024928 (AID/boucle fermée) — hors périmètre, à juste titre.**

Essai pilote (N = 23) utilisant une pompe Tandem t:slim + Control-IQ pendant 10 jours pour titrer la
basale avant retour au stylo : relève de la boucle fermée, explicitement exclue du périmètre du
prompt. Son absence du retour OE n'est pas un manquement.

## Confirmations obtenues

- **MOBILE (PMID 34077499, JAMA 2021 ;325[22]:2262-2272)** : existe, correspond au design et aux
  chiffres cités par OE (TIR +15 pts IC 95 % 8–23 ; HbA1c −0,4 % IC 95 % −0,8 à −0,1 à 8 mois).
  L'affirmation « pas de différence significative de dose totale d'insuline entre bras » est
  confirmée par plusieurs résumés secondaires concordants (Healio, HealthPartners, MCT2D) — le
  bénéfice de MOBILE n'est effectivement pas attribuable à un pilotage posologique différent.
- **FreeDM2 (DOI 10.1016/S2213-8587(26)00076-8, Lancet Diabetes Endocrinol 2026 ;14[6]:463-474)** :
  DOI vérifié caractère pour caractère (thelancet.com et ScienceDirect concordent) ; design confirmé
  (303 DT2 sous basale, phase auto-gérée 16 semaines puis phase accompagnée 16 semaines) ; la citation
  d'OE sur l'absence de différence de dose d'insuline en phase 1 est confirmée quasi verbatim par les
  communiqués officiels de l'essai (« despite no between-group differences in insulin doses […]
  benefits might have been driven through lifestyle changes »).
- **Jancev et al. (PMID 38363342, Diabetologia 2024 ;67[5]:798-810)** : existe, méta-analyse de 12 ECR
  MCG vs autosurveillance chez le DT2 ; confirmé par Springer Nature Link et PMC (recherche jusqu'au
  2023-05-02, cohérent avec la description d'OE).
- **Martens et al. 2025, analyse rétrospective (Diabetes Metab Syndr 2025 ;19[6]:103266)** : existe,
  design confirmé point par point (7354 paires, 68 DT2, substitut « nadir 1 h du matin », trois
  algorithmes INSIGHT/Treat2Target/AT.LANTUS) — la caractérisation d'OE (rétrospectif, substitut de
  glycémie à jeun, pas un pilotage par métriques MCG) est fidèle.
- **DIATEC (PMID 39887698, Diabetes Care 2025 ;48[4]:569-578, DOI 10.2337/dc24-2222)** : existe,
  design confirmé (166 patients hospitalisés hors USI) ; nuance sur l'algorithme du bras MCG — voir F2.
- **AACE 2026 (Samson SL, Vellanki P, et al., Endocr Pract 2026)** : existe, auteurs principaux
  confirmés exacts, cadence de titration « tous les 2 à 5 jours » retrouvée dans les résumés publics.
- **ATTD/ICTR (PMID 31177185, Battelino et al., Diabetes Care 2019 ;42[8]:1593-1603, DOI
  10.2337/dci19-0028)** : existe, titre et référence exacts — socle correctement cité comme seuils
  d'interprétation, pas d'action posologique.

## Décompte

| Sévérité | OpenEvidence seule | Agent A + OE | Agent A seule | Source primaire | Non-vérifiable |
|---|---|---|---|---|---|
| HAUTE | 1 (F1) | – | – | – | – |
| MOYENNE | 1 (F2) | – | – | – | – |
| BASSE | – | – | – | – | 2 (F3, F4) |
| *(pour mémoire, hors périmètre)* | – | – | – | – | 1 (F5) |

7 citations centrales vérifiées indépendamment : **6 confirmées fidèles** (MOBILE, FreeDM2, Jancev,
Martens 2025, AACE 2026, ATTD/ICTR), **1 confirmée existante mais imprécisément caractérisée**
(DIATEC, F2). Pas d'Agent A dans ce circuit (contrôle direct du retour OE demandé par le référent) —
donc pas de cas « erreur partagée » possible ici.

## Verdict par sous-question

- **Q1 — NE TIENT PAS.** Un ECR ambulatoire (CGM-DTx, NCT06111508) compare directement une titration
  hebdomadaire pilotée par algorithme sur données de MCG à une titration par autosurveillance
  capillaire, chez l'adulte DT2 sous basale. Formulation prudente : « un essai randomisé de petite
  taille et de courte durée (16 semaines, n=30, critères de substitution) suggère un bénéfice sur le
  temps dans la cible, sans être suffisant pour asseoir une recommandation ferme. » Formulation plus
  affirmative : « contrairement à ce qu'affirmait la première recherche, un ECR existe ; il reste
  isolé, de faible puissance, et n'a pas encore été confirmé par réplication. » Au référent de choisir
  le degré d'affirmation.
- **Q2 — NE TIENT PAS.** CGM-DTx répond aussi à Q2 (algorithme publié, évalué prospectivement, avec
  cible personnalisée et garde-fou hypoglycémie chiffrés — le détail fin du déclencheur reste
  `NON VÉRIFIÉ` faute d'accès au texte intégral). S'y ajoute, à la limite de l'exigible temporellement,
  Dexcom Smart Basal/BTO (F4, publié la veille de la requête, preuve plus faible : mono-bras, N=14).
- **Q3 — TIENT, avec une nuance.** La synthèse d'OE (titration clinicien-dépendante dans MOBILE et
  FreeDM2, sans effet sur la dose) est confirmée. La caractérisation du bras MCG de DIATEC comme
  « pas piloté par une métrique MCG » est trop catégorique (F2) — il s'agit d'un seuil de temps-dans-
  une-plage nocturne, mais en population hospitalière, donc sans conséquence sur la conclusion
  pratique du nœud.
- **Q4 — TIENT**, dans les limites de ma vérification (pas de contre-exemple trouvé à un seuil MCG
  validé comme déclencheur posologique chiffré, hors CGM-DTx qui reste un algorithme de recherche
  publié dans un seul essai pilote et non un seuil « validé » au sens d'une recommandation).
- **Q5 — TIENT**, sans élément contraire trouvé dans le temps imparti à cette vérification.
- **Q6 — TIENT pour les recommandations examinées** (ADA, AACE, ATTD/ICTR confirmées) ; je n'ai pas
  vérifié indépendamment EASD/Endocrine Society/NICE faute de temps — à traiter comme
  `NON VÉRIFIÉ` plutôt que comme confirmé.

## Proposition de libellé pour le nœud (si le référent valide)

Remplacer une formulation d'« absence totale de preuve » par une formulation qui reflète l'état réel :

> Aucune société savante internationale (ADA, AACE, ATTD/ICTR) ne définit à ce jour un algorithme de
> titration de la basale piloté par les métriques de MCG (TIR/TAR/tendance nocturne) assorti d'un
> déclencheur et d'un pas de dose validés — seuls des seuils d'interprétation existent. Un premier
> essai randomisé pilote (CGM-DTx, 2026, n=30, 16 semaines, critères de substitution) suggère qu'une
> titration hebdomadaire pilotée par algorithme sur données de MCG améliore le temps dans la cible par
> rapport à l'autosurveillance capillaire, mais l'échantillon est réduit et le résultat n'est pas
> répliqué. En pratique, la titration de la basale reste fondée sur la glycémie à jeun (paliers type
> AACE +20 %/+10 %/+1 U, ou ADA ≤ 2 U/semaine) ; la MCG sert à détecter la sur-basalisation
> (différentiel coucher-réveil ≥ 50 mg/dL, hypoglycémies, variabilité) et à orienter, le cas échéant,
> vers l'intensification prandiale plutôt que vers une majoration de basale.

Cette proposition n'est qu'un libellé de départ pour discussion — la validation clinique reste à
l'étape 6 du pipeline (`docs/decision/00-global.md`), pas à ce circuit de red-team.

## Point ouvert à boucler (étape 3 du circuit)

Le détail exact du déclencheur/pas de dose de l'algorithme CGM-DTx (« titration glucose level »,
formule précise) reste `NON VÉRIFIÉ` faute d'accès au texte intégral payant. Si ce point devient
décisionnel pour la rédaction du nœud (ex. : vouloir citer l'algorithme lui-même, pas seulement son
existence), relancer un tour ciblé avec accès PMC/texte intégral, ou remonter la demande au référent
pour obtention de l'article complet.
