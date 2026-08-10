# A04 — Agent B (contradicteur / red-team)

**Article** : Nicholls SJ, Ryan DH, Deanfield J, … Kahn SE, SELECT Trial Investigators.
*Semaglutide and Hospitalizations in Patients With Obesity and Established Cardiovascular Disease:
An Exploratory Analysis of the SELECT Randomized Clinical Trial.*
**JAMA Cardiol. 2026;11(2):156–164.** doi:10.1001/jamacardio.2025.4824 · PMID 41433034
Date de vérification : 2026-08-09.

## 0. Niveau d'accès à la source — à lire avant tout

- Accès **confirmé** : abstract structuré complet (PubMed + page JAMA), métadonnées, liste d'auteurs,
  déclaration de financement et de liens d'intérêt, communiqué Novo Nordisk du 03/11/2024.
- Accès **partiel** au texte intégral via la page JAMA Network : ont pu être extraits la mention
  « prespecified exploratory analysis » (protocole + SAP, Supplément 1), l'absence d'adjudication
  centrale, l'absence d'ajustement pour multiplicité, la section limites, et une répartition par
  cause. **Ces éléments de corps de texte sont de confiance moyenne** (extraction automatique, non
  relue ligne à ligne dans le PDF), à la différence des chiffres de l'abstract, de confiance haute.
- **Non consultés** : Suppléments 1 à 4 (protocole, SAP, tableaux eFigures/eTables, data sharing).
  Or c'est précisément dans le Supplément 1 que se joue l'objection n°1 (le critère est-il vraiment
  dans le SAP d'origine, et depuis quand ?).
- **Conséquence méthodologique** : les objections ci-dessous sont solides pour celles qui reposent sur
  l'abstract et les métadonnées ; celles qui reposent sur le corps de texte doivent être re-vérifiées
  sur le PDF avant toute publication d'une **appréciation critique complète**. Cf. §6.

---

## 1. Vérification chiffre par chiffre

| Annoncé (chiffres circulant) | Trouvé sur la source | Localisation | Verdict |
|---|---|---|---|
| Référence *JAMA Cardiol* 2026;11:156-64 | JAMA Cardiol. 2026;11(2):156–164 | PubMed / JAMA | ✅ **exacte** (pagination et volume confirmés) |
| Analyse de l'essai SELECT (secondaire, ≠ essai principal) | Titre : « An Exploratory Analysis of the SELECT Randomized Clinical Trial » | Titre | ✅ pas de confusion : l'essai principal est bien Lincoff et al., *NEJM* 2023;389:2221-32, HR MACE 0,80 |
| n = 17 604 | 17 604 | Abstract, Results | ✅ |
| Suivi médian 41,8 mois | médiane (IQR) 41,8 (33,0–47,0) mois | Abstract, Results | ✅ (l'essai principal rapportait un suivi **moyen** de 39,8 mois — grandeurs différentes, pas de contradiction) |
| « Hospitalisations totales −10 % » | 18,3 vs 20,4 admissions/100 patients-années | Abstract, Results | ✅ mais **formulation trompeuse** : c'est −10 % en **taux**, pas −10 % de patients hospitalisés |
| « ratio 0,90 [0,85–0,95] » | **mean ratio** (MR) 0,90 ; IC95 % 0,85–0,95 | Abstract | ⚠️ **c'est un *mean ratio* d'événements récurrents, pas un hazard ratio ni un risk ratio**. Relayer « ratio » sans qualifier laisse croire à un HR de patients. À corriger dans toute reprise. |
| p < 0,001 | P < .001 | Abstract | ✅ **mais** : aucun ajustement pour multiplicité (cf. §2.1) → ce p est nominal |
| Durée de séjour (non relayé) | 157,2 vs 176,2 jours/100 PA ; RR 0,89 [0,82–0,98] ; p = 0,01 | Abstract | ✅ IC frôlant 1 — résultat nettement plus fragile que le critère « admissions » |
| Hospitalisations pour EIG (non relayé) | 15,2 vs 17,1/100 PA ; MR 0,89 [0,84–0,94] | Abstract | ✅ |
| Nombre total d'admissions (non relayé) | 11 287 | Abstract | ✅ |
| Effet absolu (non relayé) | **Absent de tout ce qui circule** | — | ❌ **omission** — cf. §2.4 |

**Chiffres du communiqué Novo Nordisk (03/11/2024, ObesityWeek 2024)**, non repris dans l'abstract mais
utiles au calcul absolu : **première** hospitalisation 33,4 % (sémaglutide) vs 36,7 % (placebo) ;
hospitalisation pour EIG 30,3 % vs 33,4 %. Confiance moyenne (source industrielle, non re-vérifiée
dans le texte intégral).

---

## 2. Objections méthodologiques, par gravité

### 2.1 — GRAVE : « prespecified exploratory », mais sans aucun ajustement pour multiplicité

Le point le plus important, et il est à double tranchant.

- **Ce qui joue en faveur des auteurs** : le libellé n'est pas « post hoc ». L'abstract dit
  « This **prespecified exploratory** analysis was conducted from February 2024 to September 2025 »,
  et le corps de texte renvoie au protocole et au SAP (Supplément 1). Le CRF était, selon le texte,
  **spécifiquement conçu pour capturer les hospitalisations électives** — ce qui indique une intention
  de collecte planifiée en amont, pas un repêchage de base de données. L'objection « post-hoc
  déguisé » ne tient donc **pas** telle quelle, et il serait malhonnête de la présenter ainsi.
- **Ce qui reste à charge** : « exploratory » signifie précisément que le critère **n'entre dans
  aucune hiérarchie de tests**. Le corps de texte indique explicitement qu'**aucun ajustement pour
  tests multiples n'a été réalisé**. Le p < 0,001 est donc **nominal** et l'IC 0,85–0,95 est un IC
  non corrigé : il ne contrôle pas le risque alpha global. Dans un essai qui a produit une longue
  série d'analyses secondaires (MACE, glycémie, rein, mortalité/Covid, poids, éligibilité
  populationnelle, modélisation d'impact — au moins 6 publications majeures citées dans l'article
  lui-même, et davantage dans la littérature), publiées séparément et **toutes positives**, l'absence
  de correction est un problème structurel de lecture, pas un détail technique.
- **À vérifier impérativement sur le Supplément 1** : le critère figurait-il dans le SAP **d'origine**
  (2018) ou dans un amendement postérieur au déverrouillage ? L'analyse a été « conduite de février
  2024 à septembre 2025 », soit **après** la publication du résultat principal (nov. 2023). Tant que
  cette date de préspécification n'est pas vérifiée, « prespecified » reste une **affirmation des
  auteurs non contrôlée**.

### 2.2 — GRAVE : aucun critère adjudiqué

Le texte est explicite dans les limites : les données proviennent de **CRF renseignés par
l'investigateur**, **sans adjudication centrale**. C'est l'écart le plus net avec l'essai principal,
dont les MACE étaient adjudiqués en aveugle par un comité indépendant. Conséquences :

- « Hospitalisation » paraît objectif mais ne l'est pas : la **décision d'hospitaliser** est un acte
  de jugement clinique, et la **durée de séjour** l'est encore davantage. Ce sont des critères
  sensibles au comportement du soignant, donc au biais de détection/décision.
- Combiné avec 2.3 (aveugle fonctionnellement fragile), c'est le couple qui affaiblit le plus le
  résultat : un critère mou évalué par un investigateur qui peut souvent deviner le bras.
- Le résultat sur les **jours d'hospitalisation** (RR 0,89 ; IC 0,82–0,98) est le plus exposé : c'est
  le critère le plus mou, avec l'IC le plus proche de 1.

### 2.3 — GRAVE : levée d'aveugle fonctionnelle non évaluée

Aucune évaluation du maintien de l'aveugle n'apparaît dans ce qui a pu être lu — ni test de devinette
de l'allocation, ni discussion. Or dans SELECT : perte de poids ~9–10 % dans le bras actif contre
~1–2 % sous placebo, et **16,6 % d'arrêts pour effets indésirables sous sémaglutide vs 8,2 % sous
placebo** (Lincoff, *NEJM* 2023). Une perte de poids de cet ordre et un profil digestif aussi
caractéristique rendent le double aveugle **largement nominal en pratique**. Pour un critère dur et
adjudiqué (l'IDM), ça reste tolérable ; pour un critère de décision non adjudiqué (hospitaliser ou
non, garder un jour de plus ou non), c'est un biais plausible et **non quantifié**.
Le fait que les auteurs ne l'abordent pas est en soi une objection.

### 2.4 — MODÉRÉE À GRAVE : l'effet absolu est escamoté

Rien de ce qui circule ne donne de différence absolue. Reconstruction à partir des chiffres publiés
(calcul de l'agent B, à vérifier — les auteurs ne le fournissent pas) :

- **Admissions** : 20,4 − 18,3 = **2,1 admissions évitées / 100 patients-années**. Sur le suivi médian
  de 41,8 mois (3,48 ans) : **≈ 7,3 admissions évitées pour 100 patients traités ~3,5 ans**.
  ⚠️ Ce sont des **événements récurrents**, pas des patients : on ne peut pas en tirer un NNT patient.
- **NNT patient** (à partir des taux de **première** hospitalisation du communiqué, 36,7 % → 33,4 %) :
  réduction absolue **3,3 points**, soit **NNT ≈ 30 sur ~3,5 ans** pour éviter à un patient d'être
  hospitalisé au moins une fois. Confiance moyenne (chiffre issu du communiqué industriel).
- **Journées** : 176,2 − 157,2 = 19 jours/100 PA, soit **≈ 0,66 jour d'hospitalisation évité par
  patient sur 3,5 ans** — moins de 5 heures par patient et par an. Le « −11 % de temps passé à
  l'hôpital » sonne beaucoup mieux que sa traduction absolue.

Un rate ratio annoncé seul, sur un critère à événements récurrents, dans une population où
**11 287 hospitalisations pour 17 604 patients** signale une très forte charge d'événements, c'est
exactement la configuration où le relatif flatte et où l'absolu ramène à la mesure. La grille impose
l'effet absolu (§5) : **il manque**.

### 2.5 — MODÉRÉE : l'effet Covid n'est traité que par une analyse de sous-groupe faible

Randomisation d'octobre 2018 à mars 2021, suivi jusqu'en 2023 : la totalité de la période Covid est
dans l'essai, avec déprogrammation massive puis rattrapage. Ce que font les auteurs :

- ils reconnaissent dans les limites une **incertitude sur l'impact de la pandémie** sur les taux
  d'admission ;
- ils montrent que l'effet **ne diffère pas significativement** entre patients avec et sans EIG
  attribuable au Covid, et que les hospitalisations Covid (≈ 2,5 % vs 2,9 %) ne sont pas
  significativement différentes.

**Ce n'est pas une analyse par période calendaire.** Aucune stratification par phase de la pandémie
n'apparaît. Un test de sous-groupe non significatif sur un événement rare est **sous-puissant** : il
ne démontre pas l'absence d'effet Covid, il échoue à le détecter. Comme la randomisation est
équilibrée dans le temps, le biais est probablement **non différentiel** (donc plutôt dilution que
sur-estimation) — ce point est **une réserve de transposabilité, pas une réfutation**. Il l'est
d'autant plus que la réduction sur les hospitalisations **respiratoires** semble être une des plus
fortes du panel (voir 2.6) : une part de l'effet pourrait être conjoncturelle.

### 2.6 — MODÉRÉE : le passif hépatobiliaire est présent mais minoré

Selon le corps de texte (confiance moyenne, **à re-vérifier sur le PDF**) : les admissions
**hépatobiliaires sont numériquement plus nombreuses sous sémaglutide (115 vs 93, p = 0,13)** — ce
que les auteurs qualifient de « pas surprenant » au vu du lien connu entre perte de poids / agonistes
GLP-1 et pathologie biliaire. Deux remarques :

- **Point à leur crédit** : le passif n'est pas caché, et il est **inclus dans le total** — le −10 %
  est donc un solde net, pas un bénéfice trié. C'est important et honnête.
- **Point à charge** : un signal défavorable est écarté sur un p = 0,13 dans un article qui, ailleurs,
  n'a pas ajusté pour la multiplicité. On ne peut pas invoquer la non-significativité pour un signal
  de sécurité et la significativité nominale pour l'efficacité. Et l'analyse **ne compte pas les
  16,6 % d'arrêts pour effets indésirables** : les patients qui arrêtent le traitement sortent de
  l'exposition mais restent en ITT — l'effet mesuré est donc celui d'une **stratégie de traitement
  incluant ses abandons**, ce qui est correct, mais le « coût » en tolérance n'apparaît pas dans un
  critère qui ne compte que les hospitalisations.

Autres catégories rapportées (confiance moyenne) : cardiaque, infection, respiratoire, actes
chirurgicaux/procédures — toutes en faveur du sémaglutide. Aucune hétérogénéité selon IMC, âge, sexe.

### 2.7 — MINEURE : délai entre présentation et publication

Résultats présentés à **ObesityWeek le 3 novembre 2024** (communiqué Novo Nordisk), publiés en
**février 2026** : ~15 mois de circulation médiatique et de communication industrielle avant
disponibilité de la méthodologie évaluable par les pairs. Ce n'est pas une faute, mais c'est un
élément du dossier de communication.

### 2.8 — Cohérence externe : plutôt favorable, avec une réserve

L'objection « −10 % sur tout hospitalisation, c'est trop large pour un mécanisme CV » **ne tient pas**
telle quelle, et je le dis en tant que contradicteur :

- L'effet est **plus petit** que l'effet MACE (0,90 vs 0,80), donc dans le bon ordre de grandeur : un
  effet CV de −20 % dilué dans un critère dont une fraction seulement est cardiaque produit
  mécaniquement quelque chose autour de −10 %. Il n'y a pas d'inflation suspecte.
- Il est cohérent avec la direction de FLOW (rein) et avec la baisse de mortalité toutes causes de
  SELECT principal.
- **Réserve** : le titre et la conclusion affirment un bénéfice « **au-delà** de la réduction du
  risque CV » (*extending its benefits beyond CV risk reduction*). Cette affirmation-là est plus
  forte que les données montrées : elle exigerait de démontrer que le bénéfice persiste **après
  retrait** de la composante cardiaque et de ses conséquences, ce qui n'est pas établi par une
  ventilation descriptive par catégorie non adjudiquée. **C'est le point de spin principal.**

---

## 3. Spin détecté

| Élément | Nature du spin | Gravité |
|---|---|---|
| « extending its benefits **beyond** CV risk reduction » (conclusion + titre du communiqué) | Affirmation d'un mécanisme extra-CV non démontrée par le design ; ventilation descriptive ≠ décomposition causale | **Élevée** |
| « prespecified exploratory » utilisé pour tirer une conclusion affirmative | « Exploratory » impose une lecture génératrice d'hypothèses ; la conclusion est rédigée comme confirmatoire | Élevée |
| p < 0,001 mis en avant sans mention de l'absence d'ajustement | Le p nominal fait le travail rhétorique | Élevée |
| Communication exclusivement relative (−10 %, −11 %) | L'absolu (0,66 jour/patient/3,5 ans ; NNT ≈ 30) n'apparaît nulle part | Élevée |
| « mean ratio » relayé comme « ratio »/HR | Confusion événements récurrents vs patients | Modérée |
| Signal hépatobiliaire écarté sur p = 0,13 dans un article sans correction de multiplicité | Deux poids deux mesures | Modérée |

**Ce qui n'est PAS du spin, et doit être dit** : l'article s'auto-qualifie d'« exploratory » dès le
titre — pas de tentative de faire passer une analyse secondaire pour l'essai principal. Les limites
mentionnent explicitement l'absence d'adjudication et l'incertitude Covid. C'est plus honnête que la
moyenne des analyses secondaires industrielles.

---

## 4. Financement et indépendance de l'analyse

| Question | Réponse vérifiée |
|---|---|
| Financement de l'essai | **Novo Nordisk A/S** (fabricant du sémaglutide) |
| Soutien à la publication | « supported by Novo Nordisk in accordance with Good Publication Practice guidelines » |
| Auteurs employés par le promoteur | **4 sur 14** : C. Lübker, S. Rasmussen, S. Stensen (employés **et actionnaires**), P. E. Weeke (employé) |
| Qui a réalisé l'analyse statistique | **Søren Rasmussen, PhD — employé et actionnaire de Novo Nordisk**, selon la rubrique *Author Contributions* |
| Liens d'intérêt des auteurs académiques | Multiples ; déclarations avec Novo Nordisk, Amgen, AstraZeneca, Eli Lilly et autres |
| Analyse indépendante par un tiers | **Aucune mentionnée** |
| Accès aux données par des tiers | Renvoi au Supplément 4 (non consulté) — **non vérifié** |
| Protocole / SAP publics | Supplément 1 (non consulté) — **non vérifié** |

**Lecture** : ce n'est pas disqualifiant en soi — c'est la norme des grands essais de phase 3, et JAMA
impose la déclaration. Mais la conjonction **promoteur = fabricant + analyse statistique réalisée par
un actionnaire du fabricant + critère exploratoire non ajusté + critère non adjudiqué + absence
d'analyse indépendante** est un empilement qui doit être mentionné explicitement dans toute reprise.
La règle de la grille (§7, « financement industriel + résultat favorable ») est **déclenchée**.

---

## 5. Ce qui tient malgré tout

À porter au crédit de l'article, sans complaisance mais sans procès d'intention :

1. **Le socle est excellent.** SELECT est un ECR multicentrique (804 centres, 41 pays), randomisé,
   contrôlé contre placebo, en double aveugle, n = 17 604, suivi médian 41,8 mois, analyse en ITT.
   La randomisation protège la comparabilité initiale, et rien de ce qui précède ne remet en cause
   cette base — les objections portent sur le **critère** et sur son **statut inférentiel**, pas sur
   le design.
2. **Le critère est cliniquement pertinent, pas un critère de substitution.** Être hospitalisé et
   combien de temps, ce sont des choses qui comptent pour le patient et pour le système de soins.
   On est du côté « dur » de la grille §4, malgré la mollesse d'évaluation.
3. **Le critère est global et non trié.** Toutes causes, y compris les hospitalisations liées aux
   effets indésirables du produit (dont le signal hépatobiliaire défavorable). Le −10 % est un
   **solde net**, ce qui est bien plus robuste qu'un critère composite construit sur mesure.
4. **Le sens et l'amplitude sont plausibles et cohérents** avec l'essai principal (MACE 0,80) et avec
   la mortalité toutes causes de SELECT. Pas d'effet trop beau pour être vrai.
5. **Cohérence interne solide** : les quatre mesures (admissions toutes causes, admissions EIG, jours
   toutes causes, jours EIG) convergent toutes autour de 0,89–0,90, et aucune hétérogénéité selon
   IMC, âge, sexe. Un artefact produirait plus volontiers un signal isolé.
6. **Transparence relative** : titre auto-qualifié « exploratory », absence d'adjudication et
   incertitude Covid déclarées dans les limites, conflits d'intérêt détaillés.
7. **Applicabilité MSP correcte** : patients de 45 ans et plus, IMC ≥ 27, maladie CV établie, sans
   diabète — profil réellement présent en soins premiers, en prévention secondaire.

Autrement dit : **le signal est probablement réel**, mais sa **taille** est probablement surestimée
(critère mou + aveugle fragile + p non ajusté) et sa **portée** est surinterprétée par les auteurs
(« beyond CV risk reduction »).

---

## 6. Verdict

| Champ | Valeur |
|---|---|
| **niveau_preuve** | **Modéré** — ECR de grande taille, randomisé, en aveugle et en ITT (part d'« élevé »), **déclassé d'un cran** pour : critère exploratoire hors hiérarchie de tests, absence totale d'ajustement pour multiplicité dans un essai à analyses secondaires nombreuses, absence d'adjudication centrale sur un critère décisionnel, aveugle fonctionnellement fragile non évalué, analyse statistique conduite par un actionnaire du promoteur. Pas de déclassement supplémentaire : précision correcte (IC serré sur les admissions), cohérence interne et externe bonnes. **Ne pas coter « élevé ».** |
| **niveau_impact** | **Informatif** — ne modifie aucun nœud de l'algorithme DT2 (population sans diabète, prévention secondaire CV), n'ajoute pas d'indication et ne change pas de seuil. Utile comme argument de conviction/observance auprès d'un patient déjà éligible, pas comme critère de décision. |
| **Classement** | **À reclasser en `breve`** — et non en `analyse`. |

**Justification du reclassement.** Deux raisons distinctes, chacune suffisante :

1. **Raison d'accès (dirimante).** Le texte intégral et surtout les **Suppléments 1 à 4** n'ont pas été
   consultés. Or l'objection n°1 (le critère était-il dans le SAP d'origine ou dans un amendement
   post-déverrouillage ?) et la question du partage des données ne se tranchent **que** dans le
   Supplément 1 et le Supplément 4. Publier une appréciation critique complète sans les avoir lus
   reviendrait à sourcer une critique sur un abstract — exactement ce que la règle d'or de la grille
   interdit. Une `breve` factuelle, elle, ne requiert que l'abstract, qui est intégralement vérifié.
2. **Raison de fond.** Analyse exploratoire, non ajustée, non adjudiquée, à impact `informatif` : le
   format `analyse` (avec message pour la pratique) suggérerait une portée décisionnelle que le
   niveau de preuve ne soutient pas.

**Passage possible en `analyse`** si et seulement si : accès au PDF + Supplément 1 (statut et date de
préspécification du critère) + Supplément 4 (partage des données), et confirmation des données par
cause (dont hépatobiliaire 115 vs 93).

**Formulation exigée pour la `breve`** (si publiée) : mentionner obligatoirement (a) « analyse
exploratoire, non ajustée pour la multiplicité », (b) « hospitalisations non adjudiquées », (c)
**l'effet absolu** (≈ 0,66 jour d'hospitalisation évité par patient sur 3,5 ans ; NNT ≈ 30 pour éviter
une première hospitalisation), (d) le financement Novo Nordisk et l'analyse statistique réalisée par
un employé-actionnaire. Ne **pas** reprendre la formule « bénéfice au-delà du risque cardiovasculaire ».

---

### Sources
- [PubMed 41433034](https://pubmed.ncbi.nlm.nih.gov/41433034/)
- [JAMA Cardiology — article](https://jamanetwork.com/journals/jamacardiology/fullarticle/2843245)
- [Communiqué Novo Nordisk, 03/11/2024 (ObesityWeek)](https://www.prnewswire.com/news-releases/new-select-trial-analysis-with-semaglutide-2-4-mg-showed-a-significant-reduction-in-hospital-admissions-in-adults-with-known-heart-disease-and-obesity-or-overweight-302294828.html)
- [SELECT principal — Lincoff et al., NEJM 2023 (PubMed 37952131)](https://pubmed.ncbi.nlm.nih.gov/37952131/)
- [ACC journal scan](https://www.acc.org/latest-in-cardiology/journal-scans/2026/01/13/15/23/semaglutide-associated-with-reduced-hospital-admissions)
- [PACE-CME](https://pace-cme.org/news/fewer-hospitalizations-with-semaglutide-in-cvd-patients-with-overweight-or-obesity/2485910/)
