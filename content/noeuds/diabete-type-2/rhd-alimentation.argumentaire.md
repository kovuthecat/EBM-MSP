# Alimentation — module RHD — argumentaire exhaustif

> Niveau de lecture 3 (preuve complète). Document autonome distillé de
> `docs/decision/validation/chantier-2026-07-26/rhd-collecte-alimentation.md` (grille + bibliothèque de
> pistes, révisée après red-team — 4 findings HAUTE corrigés), `redteam-collectes-rhd.md`,
> `cible-mediterraneenne-medas.md` (MEDAS en source primaire) et `docs/decision/noeuds/H-rhd.md` §3
> (sous-dossier H3, PREDIMED/CORDIOPREV). **BROUILLON en attente de validation référent.**

## En bref

Ce nœud ne propose pas de cible chiffrée : il recueille des habitudes en fréquence déclarée et suggère des
pistes concrètes, négociables, pour se rapprocher du motif alimentaire méditerranéen — le seul motif
alimentaire à bénéfice cardiovasculaire **dur** démontré. Trois points structurants :

- **Le bénéfice dur appartient au motif dans son ensemble, jamais à un geste isolé.** PREDIMED et
  CORDIOPREV randomisent un régime méditerranéen supplémenté (huile d'olive ou fruits à coque), pas un
  changement isolé d'huile ou l'ajout de quelques noix. Aucune piste de ce nœud ne revendique donc
  l'étiquette « bénéfice EBM sur critère dur » — cette étiquette est portée par ce document et par le champ
  `argumentaire` du YAML (le « cap » du module), décision du référent qui va au-delà de ce que la collecte
  de contenu avait elle-même tranché.
- **Aucun score.** Le score MEDAS (14 items, l'instrument qui mesure l'adhérence dans PREDIMED) sert
  uniquement à choisir QUELS axes recueillir (fruits à coque, légumineuses, poisson, viande rouge, vin) —
  jamais à calculer un score administré au patient.
- **Deux garde-fous durs** : le repérage d'un trouble du comportement alimentaire (3 signes HAS) et la
  fragilité/dénutrition bloquent les pistes de réduction et de quantification ; l'hypoglycémie sous
  insulinosécréteur reste une alerte, jamais un blocage.

## 1. Le motif méditerranéen — ce qui a été testé

### PREDIMED (republication 2018, après rétractation pour irrégularités de randomisation sur certains centres, correction méthodologique publiée en 2018)

RCT ouvert, n=7447, prévention primaire cardiovasculaire (≈ 52 % de diabétiques, proportion déduite),
médiane 4,8 ans. Trois bras :

| Bras | Intervention | Composite CV majeur (IDM + AVC + décès CV) |
| --- | --- | --- |
| Huile d'olive | Régime méditerranéen + huile d'olive vierge extra (1 L/semaine, min. 50 mL/j) | **HR 0,69 (IC 0,53-0,91)** |
| Fruits à coque | Régime méditerranéen + fruits à coque (30 g/j : 15 g noix, 7,5 g amandes, 7,5 g noisettes) | **HR 0,72 (IC 0,54-0,95)** |
| Contrôle | Conseil pauvre en graisses, sans restriction calorique | référence |

Sous-groupe diabétique (HR + intervalle de confiance) **non vérifiable en primaire** (forest plot derrière
paywall). Régime **sans restriction calorique** dans les 3 bras ; aucune promotion d'activité physique
accrue n'était intégrée au protocole (elle n'est pas un facteur de confusion de cet essai).

### CORDIOPREV (2022)

RCT monocentrique, n=1002, **prévention secondaire** (coronariens), ~50 % de diabétiques, suivi 7 ans.
Composite CV dur (adjugé) : **HR 0,72 (IC 0,54-0,96)**, NNT ~20/7 ans ; effet significatif chez l'homme,
non significatif chez la femme (n=175, sous-effectif). Deuxième essai contrôlé randomisé démontrant un
bénéfice cardiovasculaire dur du régime méditerranéen.

### Composition qualitative du régime testé (littérature secondaire sur PREDIMED)

« Usage abondant d'huile d'olive, consommation élevée de fruits, légumes, légumineuses, céréales et fruits
à coque, consommation régulière mais modérée de vin (surtout rouge) au cours des repas, consommation
modérée de poisson, fruits de mer, produits laitiers fermentés, volaille et œufs, consommation limitée de
viande rouge/transformée et de sucreries. »

**Ce que ce corpus n'a pas permis de récupérer** : un tableau formel « aliments à augmenter / aliments à
diminuer » distinct du questionnaire MEDAS lui-même. Le MEDAS (§2 ci-dessous) est de fait la formulation la
plus précise et la plus vérifiable disponible de la cible alimentaire du régime testé.

## 2. MEDAS — cadre de définition, jamais instrument administré

### La publication de validation

Schröder H, Fitó M, Estruch R, et al. « A short screener is valid for assessing Mediterranean diet
adherence among older Spanish men and women. » *J Nutr* 2011;141(6):1140-1145. DOI 10.3945/jn.110.135566,
PMID 21508208. Instrument validé sur 7146 participants de PREDIMED. Texte intégral bloqué (paywall) : le
tableau ci-dessous provient de la reproduction en accès libre par les mêmes auteurs (Martínez-González et
al., *PLoS ONE* 2012;7(8):e43134, DOI 10.1371/journal.pone.0043134, CC-BY).

### Les 14 items (score 0-14, un point par item si le critère est atteint)

| # | Question | Critère pour 1 point |
| --- | --- | --- |
| 1 | Huile d'olive comme matière grasse principale de cuisson ? | Oui |
| 2 | Quantité d'huile d'olive consommée par jour | ≥ 4 cuillères à soupe |
| 3 | Portions de légumes par jour | ≥ 2 (dont ≥ 1 crue/en salade) |
| 4 | Fruits par jour (jus naturels compris) | ≥ 3 |
| 5 | Portions de viande rouge/charcuterie par jour | < 1 |
| 6 | Portions de beurre/margarine/crème par jour | < 1 |
| 7 | Boissons sucrées/gazeuses par jour | < 1 |
| 8 | Verres de vin par semaine | ≥ 7 |
| 9 | Portions de légumineuses par semaine | ≥ 3 |
| 10 | Portions de poisson/fruits de mer par semaine | ≥ 3 |
| 11 | Pâtisseries/sucreries industrielles par semaine | < 3 |
| 12 | Portions de fruits à coque par semaine | ≥ 3 |
| 13 | Préférence volaille/dinde/lapin plutôt que veau/porc/bœuf/charcuterie ? | Oui |
| 14 | Plats au sofrito (tomate, oignon/poireau, ail, huile d'olive) par semaine | ≥ 2 |

**Aucune version française validée n'a été identifiée** (recherche documentée dans
`cible-mediterraneenne-medas.md` §4 : adaptations confirmées en allemand, anglais UK, arabe marocain, et
dans une étude transnationale à 7 pays sans la France ; la recherche française sur l'adhérence
méditerranéenne utilise un autre score, le MeDi-Lite, dérivé d'un questionnaire de fréquence à 148 items).
**Ce constat est sans conséquence pour ce nœud** : le MEDAS n'y est utilisé QUE comme cadre pour choisir
quels axes recueillir (fruits à coque, légumineuses, poisson, vin — items #12, #9, #10, #8), jamais comme
instrument scoré nécessitant une validation linguistique.

### Ce que le socle de ce nœud couvre du MEDAS

| Item MEDAS | Couvert par ce nœud | Nature |
| --- | --- | --- |
| #1/#6 huile d'olive vs beurre | `matiere_grasse_cuisson` | Qualitatif (pas de seuil de quantité) |
| #7 boissons sucrées | `frequence_boissons_sucrees` | Fréquence déclarée (pas de seuil « < 1/jour ») |
| #9 légumineuses | `frequence_legumineuses` | Fréquence déclarée |
| #10 poisson | `frequence_poisson` | Fréquence déclarée |
| #12 fruits à coque | `frequence_fruits_a_coque` | Fréquence déclarée |
| #5/#13 viande rouge/volaille | `frequence_viande_rouge_charcuterie` | Fréquence déclarée |
| #8 vin | `consommation_vin` (approfondissement) | Recueilli, jamais proposé |
| #2 quantité d'huile, #3 légumes, #4 fruits, #11 pâtisseries, #14 sofrito | Non couverts | Hors socle retenu (charge de saisie) |

Le socle ne couvre donc qu'une partie des 14 axes — c'est délibéré (charge de saisie, priorité aux axes les
plus proches de la preuve randomisée) et documenté comme limite dans `incertitudes` du YAML.

## 3. Provenance des pistes — tableau complet

| Piste | Famille | Étiquette | Ancrage principal |
| --- | --- | --- | --- |
| Boisson sucrée → eau | Boissons | Recommandation officielle | EBM Guidelines (grade A, intervention globale) + Santé publique France |
| Pas d'édulcorants intenses | Boissons | Savoir-faire diététique (non EBM) | Prescrire, signal de prudence sans référence bibliographique précise pour ce point |
| Repas maison de plus | Ultratransformés | Savoir-faire diététique (non EBM) | HAS (item de recueil, pas une reco d'action formulée) + Santé publique France |
| Restauration rapide, choisir mieux | Restauration rapide | Recommandation officielle | EBM Guidelines (tips list, grade A/B, mention explicite hamburgers/pizzas) |
| Huile d'olive en cuisson | Matières grasses | Savoir-faire diététique (non EBM)* | Santé publique France (repère non gradé) + HAS Fiche 4 |
| Réduire charcuterie et viande rouge | Viande et charcuterie | Recommandation officielle | Santé publique France / Manger-Bouger, colonne « Réduire » (repères non gradés) |
| Fruits à coque | Fruits à coque, légumineuses, poisson | Savoir-faire diététique (non EBM)* | Santé publique France (repère non gradé) |
| Légumineuses | Fruits à coque, légumineuses, poisson | Savoir-faire diététique (non EBM) | Santé publique France (repère non gradé) |
| Poisson | Fruits à coque, légumineuses, poisson | Savoir-faire diététique (non EBM) | Santé publique France (repère non gradé) |
| Repas à heures régulières | Structure des repas | Savoir-faire diététique (non EBM) | EBM Guidelines, sous-section non gradée (correction red-team A-4) |
| Manger sans se presser | Structure des repas | Savoir-faire diététique (non EBM) | EBM Guidelines + HAS, sous-section non gradée |
| Réduire le grignotage | Structure des repas | Savoir-faire diététique (non EBM) | HAS + EBM Guidelines (item de recueil) |
| Peser 2-3 fois | Portions | Savoir-faire diététique (non EBM) | SFD/AFDN, rapport groupe de travail glucides |
| Repères visuels de portion | Portions | Savoir-faire diététique (non EBM) | SFD/AFDN, idem |
| Orientation diététicien | Orientation | Ressource locale | HAS (situations qui appellent l'expertise diététique) |
| Continuer ce qui fonctionne déjà | Maintien | Recommandation officielle | HAS (non-culpabilisation, « la stabilisation d'une bonne habitude est déjà un résultat ») |

**Note sur « Continuer ce qui fonctionne déjà »** : ce n'est volontairement pas un sentinel `["default"]`
(le repli technique du DSL). Le cas réellement muet — les 13 axes de recueil simultanément favorables —
existe cliniquement (c'est le profil « B » de la recette : patient déjà proche du motif méditerranéen) mais
sa conjonction complète échappe à l'échantillonnage stratifié indépendant du banc mécanique (vérifié : 0/1520
profils générés l'atteignent). La condition retenue (huile d'olive **et** fruits à coque réguliers — les deux
composantes réellement randomisées de PREDIMED) est un SOUS-ENSEMBLE NÉCESSAIRE du cas muet complet — elle le
couvre donc toujours — tout en étant, prise seule, bien plus fréquente et cumulable avec d'autres pistes.
Vérifié directement contre `evaluateNode` (pas seulement par le banc) : sur un profil construit à la main
reproduisant le profil B (toutes les habitudes déjà proches du motif méditerranéen, aucun repérage TCA,
aucune fragilité), seule cette piste s'affiche.

\* Piste ancrée sur le composant réellement randomisé de PREDIMED (huile d'olive, fruits à coque) — la plus
proche du bras testé, mais l'étiquette reste « savoir-faire diététique » car AUCUNE piste isolée ne porte
l'étiquette « bénéfice EBM sur critère dur » (décision référent, §1 ci-dessus). La proximité au bras
randomisé justifie leur RANG (priorité d'affichage 1), pas leur étiquette de preuve.

**Note sur B1/U1/M2 (correction red-team A-1) :** la citation SFD 2025 initialement attachée à ces trois
pistes (« en évitant… la consommation d'aliments ultra-transformés et de boissons sucrées », p.21) a été
retirée : vérifiée, cette phrase appartient à la section consacrée aux patients DT2 avec stéatose hépatique
associée (§8.7/Avis n°15), pas à une recommandation générale DT2 (Avis n°14, p.17, qui ne mentionne ni les
boissons sucrées ni les ultratransformés). Recherche exhaustive confirmée : 0 autre occurrence dans les 32
pages du document. Ces pistes restent sourcées par ailleurs (EBM Guidelines, HAS, Santé publique France).

**Note sur B2 (correction red-team A-3) :** la référence Salame et al. (*Lancet Diabetes Endocrinol* 2024,
cohorte NutriNet-Santé) initialement citée à l'appui documente en réalité les ÉMULSIFIANTS, pas les
édulcorants — un signal distinct dans la même note de la revue source. Retirée ; le signal sur les
édulcorants reste cité sans référence bibliographique précise, comme la source elle-même le présente.

## 4. Les garde-fous, en détail

### Repérage d'un trouble du comportement alimentaire (verrou dur)

Trois signes, reformulés en style consultation à partir des signes d'appel de l'encadré 11 du guide HAS
parcours surpoids-obésité (p.43) :

1. Restriction volontaire en quantité, avec épisodes de « craquage » — liste « perturbations de
   l'alimentation » de la source (pas la liste DSM-5).
2. Manger seul ou en cachette, se sentir coupable après avoir mangé — même liste, pas DSM-5 non plus
   (correction red-team A-6 : les deux premiers signes de la source précédente les attribuaient à tort à
   la liste DSM-5).
3. Antécédent de demande de régime amaigrissant ou habitudes alimentaires très restrictives — seul signe
   appartenant littéralement à la liste DSM-5 de la source.

**CE VERROU NE BLOQUE PLUS RIEN DEPUIS LE 2026-07-27 — il ORIENTE.** Décision référent, prise sur un
principe qui recadre tout le nœud : « dans le cadre des RHD en médecine générale on ne propose pas de
restriction calorique, en tout cas pas chiffrée ; on propose des modifications d'habitudes alimentaires,
jamais de régime. » Un verrou anti-restriction n'a alors plus d'objet, et l'inventaire de ce qu'il bloquait
réellement le confirme — aucune des trois exclusions n'était à sa place :

| ce que le verrou bloquait | ce que c'était vraiment |
|---|---|
| « Repérer un moment de grignotage et lui trouver une **alternative** » | une **substitution** : rien n'y est retiré ni chiffré |
| « Se repérer aux **proportions** dans l'assiette » | un **reliquat** : ce blocage protégeait de la piste de PESÉE, supprimée la veille. La piste avait été réécrite en repère qualitatif, l'exclusion était restée — et son propre `inconvenients` décrivait encore une piste disparue |
| « Diviser par deux la portion de fromage et de charcuterie » | le **seul** geste réellement chiffré. Il a été réécrit sans chiffre (voir plus bas) |

Le verrou conditionne désormais les **deux options d'orientation** — diététicien, et avis spécialisé en TCA —
et rien d'autre. Ce déplacement change aussi le poids d'une objection connue : sa sensibilité et sa
spécificité sont **inconnues**, aucune étude ne l'ayant évalué. Tant qu'il servait de test bloquant, c'était
un vrai problème — un blocage binaire fondé sur une spécificité inconnue. En déclencheur d'orientation, un
faux positif propose une orientation de plus, là où il retirait auparavant des pistes au patient.

**Ce que la littérature contient réellement**, et que la formulation d'origine (« aucun instrument trouvé
dans les sources locales ») était trop étroite pour dire — elle était **exacte**, le corpus local ne contenant
effectivement ni la RBP anorexie 2010 ni la fiche boulimie 2019, mais non informative :

- le **SCOFF-F** existe, il est validé en français et la HAS le nomme dans **deux** recommandations. Il reste
  écarté pour quatre motifs qui tiennent : il est **mal formé pour ce patient** — ses items visent les
  vomissements provoqués, une perte de poids récente de plus de 6 kg et la conviction d'être gros quand
  l'entourage vous trouve trop mince ; chez un adulte DT2 en surpoids dont le TCA attendu est l'hyperphagie
  boulimique, **au moins un item est inversé** (la perte de poids y est un objectif thérapeutique, pas un
  signe d'alerte), et Kutz 2020 documente précisément cette perte de sensibilité dans l'hyperphagie
  boulimique, chez les hommes et en recrutement communautaire — les trois conditions de ce nœud. Ses
  validations françaises (Garcia 2010, 2011) ne portent en outre que sur des **femmes jeunes**.
- **Expali™** (Tavolacci 2019) est l'outil français qui traite explicitement la catégorie hyperphagique, mais
  il n'a **jamais été évalué contre des témoins sans TCA** : ses auteurs demandent eux-mêmes une validation en
  médecine générale.
- la **Binge Eating Scale française** (Brunault 2016) est le seul instrument validé chez l'adulte obèse des
  deux sexes contre un entretien diagnostique (Se 75 %, Sp 88,4 %, VPP 37,5 % sur n = 47) — mais elle fait
  **seize items**, incompatible avec le socle de 2-3 minutes que vise ce nœud.

**Une divergence de recommandations, portée et non arbitrée.** La HAS 2019 écrit « rechercher
SYSTÉMATIQUEMENT une hyperphagie boulimique en cas de surpoids ou d'obésité » ; l'USPSTF 2022 conclut que
« les preuves actuelles sont insuffisantes » pour dépister l'adulte asymptomatique (*I statement*). Le nœud se
tient entre les deux — trois signes d'appel, pas de dépistage systématique — et le lot du 2026-07-27 en réduit
l'enjeu, puisque le repérage ne ferme plus aucune piste. Réserve de périmètre à connaître : le patient de ce
nœud, adulte DT2 d'âge moyen ou avancé en surpoids, n'appartient à la population cible **déclarée** d'aucun
des deux documents HAS invoqués.

Chaque signe porte `confirmation_requise: true` (D20) : un « non » qui n'a jamais été demandé au patient ne
peut pas être présumé sans risque — même famille de garde-fou que `diabete_complique` sur le nœud statine.

### Dénutrition / sarcopénie (HAS R.37)

« Les régimes de restriction quantitative ou qualitative sont fortement déconseillés chez les personnes à
risque de dénutrition et de sarcopénie, en particulier chez les personnes âgées en situation de
fragilité. » Point souvent oublié : « Un IMC ≥ 30 kg/m² n'exclut pas une dénutrition. Une personne en
surpoids ou en obésité de tout âge peut être dénutrie » (guide HAS parcours obésité §3.4). Le filtre ne
peut donc pas être « IMC bas » — d'où la réutilisation de `fragilite` (variable de jugement clinique
partagée par tout le domaine), pas un seuil d'IMC.

### Hypoglycémie sous insulinosécréteur (alerte, pas blocage)

Toute piste qui réduit l'apport en sucres/glucides rapides ou l'apport calorique global majore le risque
d'hypoglycémie chez un patient sous insuline, sulfamide ou glinide — alerte de nœud, cohérente avec
l'arbitrage déjà tranché côté nœud `rhd` (§8-5 du dossier de preuve H) : alerte conservée, pas d'exclusion.

**Ce qui est demandé au praticien pour la déclencher (2026-07-29).** Un booléen,
`insuline_ou_insulinosecreteur`, et non plus la liste `traitements_en_cours` à neuf classes réutilisée du
reste du domaine. Motif : cette alerte est la SEULE règle de ce nœud qui lisait ce critère, et elle n'y
lisait que quatre valeurs (insuline basale, insuline rapide, sulfamide, glinide), toujours ensemble. Les
cinq autres cases — metformine, iSGLT2, AR GLP-1, tirzépatide, gliptine — n'apparaissaient dans aucune
condition : cliniquement inertes ICI (elles restent décisives dans `prescription`/`insuline`, qui gardent
la liste complète). R5 demande qu'un critère qu'on demande agisse ; cinq cases sur neuf n'agissaient pas.
Le nom retenu écarte « hypoglycémiant », ambigu en français : metformine et gliptine sont des
antihyperglycémiants, ils n'exposent pas à l'hypoglycémie en monothérapie. Aucun changement de
conduite — à patient identique, l'alerte se déclenche exactement dans les mêmes cas.

## 5. Ce qui n'a pas été repris, et pourquoi

- **R2 (« explorer le contexte avant de juger »)** — le red-team l'a reclassée savoir-faire (elle
  transforme un item de RECUEIL de la HAS en recommandation d'action, inférence raisonnable mais non
  littérale) ; c'est aussi une consigne de posture de consultation pour le praticien, pas un geste
  patient-facing. Omise pour garder la bibliothèque de pistes centrée sur des gestes négociables.
- **M3 (laitages allégés)** — déclencheur non capturé par le socle retenu (consommation de laitages
  entiers, jamais recueillie ici) ; ajouter un item dédié pour cette seule piste aurait gonflé le socle
  contre la consigne de charge de saisie.
- **P3' (taille du repas suivant le poids)** — repose sur un suivi longitudinal du poids, hors périmètre
  d'un nœud sans état ni historique.
- **T3 (repas-type illustré)** — le support concret (photo, repas-type) n'existe pas dans le dépôt ; la
  source le signale elle-même comme « à produire ».
- **Traditions culinaires** — le référent l'a lui-même désignée comme la question qui conditionne tout le
  reste (quelles traditions, sur quelle base, fournies par qui — le diététicien de la MSP). Aucune source
  du dépôt ne couvre ce corpus : rien n'a été inventé. La question « quelle est votre cuisine habituelle ? »
  garde son intérêt pour la conversation, mais n'entre pas dans ce nœud comme critère décisif (R5) : les
  pistes se déclenchent sur l'habitude mesurée, jamais sur une tradition déclarée — deux patients de la
  même tradition peuvent avoir des profils opposés, que le socle mesure directement.

## 6. Sources

- PREDIMED (republication), *NEJM* 2018 — [doi:10.1056/NEJMoa1800389](https://doi.org/10.1056/NEJMoa1800389)
- CORDIOPREV, *Lancet* 2022 — [doi:10.1016/S0140-6736(22)00122-2](https://doi.org/10.1016/S0140-6736(22)00122-2)
- Schröder et al. (validation MEDAS), *J Nutr* 2011 — [PMID 21508208](https://pubmed.ncbi.nlm.nih.gov/21508208/)
- Martínez-González et al. (tableau MEDAS, CC-BY), *PLoS ONE* 2012 — [doi:10.1371/journal.pone.0043134](https://doi.org/10.1371/journal.pone.0043134)
- Lifestyle education in type 2 diabetes, EBM Guidelines/Duodecim (2021) — source locale, accès abonnement
- HAS — Stratégie thérapeutique du patient vivant avec un diabète de type 2 (mai 2024), R.30-R.38
- HAS — Parcours de soins Surpoids et obésité de l'adulte (2023), §3.4-3.6, Fiche 4, encadré 11
- Santé publique France/PNNS — « 50 petites astuces pour manger mieux et bouger plus » (2023)
- SFD — Regard nouveau sur les glucides (rapport groupe de travail paramédical + AFDN, 2016)
- SFD 2025 — prise de position (Darmon et al., *Méd. Mal. Métab.* 2025;19(8):630-662)
- Prescrire — fiche DT2 (résumé critique interne, `docs/decision/sources/prescrire-dt2.md`, P9/P10)

Traçabilité complète des citations page par page, et l'ensemble des findings red-team (4 HAUTE, 4 MOYENNE)
avec leur correction : `docs/decision/validation/chantier-2026-07-26/rhd-collecte-alimentation.md` et
`redteam-collectes-rhd.md`.
