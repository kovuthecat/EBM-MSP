# A12 — Agent B (contradicteur / red-team)

**Item** : diénogest seul vs diénogest + œstrogène, endométriomes ovariens.
**Thème** : `sante-femme-perinatalite` · **Date** : 2026-08-10 · contexte isolé (pas d'accès au travail de l'agent A).
**Source vérifiée** : PMC10435622 (accès libre, texte intégral consulté — pas de `reporte` justifiable ici).

---

## 1. Contrôle d'identification et de design

**Identification : CONFIRMÉE.** PMID 37433947 / PMC10435622 correspond bien au sujet décrit.

> Titre exact : « Dienogest alone or dienogest combined with estrogens in the treatment of ovarian endometriomas, that is the question. **A retrospective cohort study** » — Del Forno S. *et al.*, *Arch Gynecol Obstet* 2023, IRCCS S. Orsola / Università di Bologna.

Concordance vérifiée : n = 297 (D 156 / D+EE 58 / D+EV 83), diénogest 2 mg, EE 0,03 mg, EV 1–3 mg, endométriomes ovariens diagnostiqués en échographie, suivi V1/V2 (6 mois)/V3 (12 mois). **Pas de confusion d'article** — contrairement à un autre item du lot.

**Design réel : cohorte rétrospective monocentrique.** Le titre le dit lui-même. Aucune randomisation, aucun aveugle, aucun protocole pré-enregistré mentionné. Toute présentation en « essai » ou en « comparaison de stratégies » serait une surqualification.

### Trois écarts entre le relais et l'article

**(a) Critère d'inclusion filtrant.** L'étude exige « medical therapy **for at least 12 months** ». Les patientes n'ayant pas tenu 12 mois — précisément celles ayant arrêté pour métrorragies, intolérance ou inefficacité — sont **exclues par construction**. Ce n'est pas une perte de vue survenue en cours de route, c'est un filtre de survie appliqué à l'entrée de la cohorte. Il n'y a donc pas de « perdues de vue » à analyser : le biais d'attrition différentiel a été absorbé en amont, invisible et non quantifiable.

**(b) Ce n'est pas « une échelle de douleur ».** L'étude mesure **sept scores de douleur** sur **NRS 0–10** (dysménorrhée ; dyspareunie ; douleur pelvienne chronique ; dyschésie avec et hors règles ; dysurie avec et hors règles). Le chiffre relayé (−2,63 vs −2,04) est **la dysménorrhée seule**, pas un score global.

**(c) Le résultat n'est pas unidirectionnel — omission grave du relais.** L'abstract des auteurs conclut aussi que **la dysurie s'améliore davantage sous association** que sous diénogest seul. Le relais ne retient que la moitié favorable au diénogest seul. Deux résultats significatifs **en sens opposés** ne soutiennent pas « D seul est supérieur » ; ils suggèrent du bruit.

---

## 2. Vérification chiffre par chiffre

| Annoncé (relais) | Trouvé dans l'article | Localisation | Verdict |
|---|---|---|---|
| n = 297 (156 / 58 / 83) | 297 (D 156, D+EE 58, D+EV 83) | Abstract, Résultats | ✅ exact |
| « échelle de douleur » | **NRS 0–10**, 7 items distincts | Méthodes | ⚠️ imprécis — échelle NRS, pas EVA ; et 7 critères |
| −2,63 (D) | −2,63 · **IC95 % [−3,29 ; −1,96]** | Tableau 2, ligne dysménorrhée | ✅ exact, IC retrouvé |
| −2,04 (D+EE/EV) | −2,04 · **IC95 % [−2,71 ; −1,38]** | Tableau 2 | ✅ exact, IC retrouvé |
| écart ajusté 0,77 ; p ≤ 0,01 | Δ brut 0,59 ; **Δ ajusté 0,77 ; p ≤ 0,01** | Tableau 2 | ✅ exact — **mais aucun IC95 % n'est fourni pour l'écart ajusté** |
| « pas de différence sur la taille » | Δ ajusté **−1,13 mm, NS** (D −6,11 [−7,75 ; −4,47] vs D+EE/EV −5,16 [−7,02 ; −3,30]) | Tableau 2 | ✅ exact |
| *(non relayé)* | **Dysurie : Δ ajusté −0,23 ; p ≤ 0,05 en faveur de l'ASSOCIATION** | Tableau 2 | ❌ **omis par le relais** |
| *(non relayé)* | Effets indésirables 16,2 % ; spotting 4,7 %, **significativement plus fréquent sous D+EV (9,6 %, p = 0,04 ; 14,3 % en continu)** | Tableau 5 | ❌ omis |
| *(non relayé)* | Déséquilibres à l'inclusion : âge 35,5 vs 28,9 vs 33,5 ans (p < 0,001) ; kyste 26,3 vs 22,7 vs 18,7 mm (p < 0,001) ; nodule postérieur 46,2 vs 37,9 vs 28,9 % (p = 0,033) | Tableau 1 | ❌ omis |
| Financement | Open access Univ. Bologne (accord CRUI-CARE). **« The authors declare that they have no conflict of interest. »** | Déclarations | ✅ pas de financement industriel Bayer déclaré — point à décharge |

**Deux points d'imprécision matérielle du relais** : l'écart ajusté est donné **sans intervalle de confiance** (seulement un p), et il porte sur la dysménorrhée, pas sur « la douleur ».

---

## 3. La question de la DMCI — section dédiée

**Échelle : NRS 0–10** (« 0 = absence of pain » à « 10 = the maximum pain you could imagine »), recommandée par l'ASRM pour l'endométriose.

**Seuils publiés, du plus permissif au plus exigeant :**

| Référence | Population / critère | Seuil |
|---|---|---|
| Gerlinger *et al.*, *Health Qual Life Outcomes* 2010 (PMC3002916) — analyse de 2 ECR contre placebo, 281 patientes avec endométriose confirmée par cœlioscopie | Douleur pelvienne liée à l'endométriose, EVA | marge de non-infériorité empiriquement validée à **10 mm ≈ 1,0 point/10** |
| Littérature générale sur la douleur chronique | NRS, douleur chronique | **1 à 2,5 points** |
| Études sur la douleur menstruelle (hors USA) | Douleur menstruelle / pelvienne | **≈ 3 points** |
| Endométriose modérée à sévère | **Douleur menstruelle** (= dysménorrhée, le critère précis en jeu ici) | **4 points** |

**Verdict honnête : l'écart est franchement SOUS le seuil, et ce n'est pas une zone grise.**

L'écart ajusté de **0,77 point** est inférieur à *toutes* les valeurs publiées, y compris la plus permissive (1,0 point, et encore s'agit-il d'une **marge de non-infériorité**, pas d'un seuil de bénéfice perceptible). Rapporté au seuil le plus spécifique du critère effectivement mesuré — la dysménorrhée en endométriose modérée à sévère, **4 points** — l'écart est **environ cinq fois trop petit**.

Deux aggravations :
- **Aucun IC95 % n'est publié pour cet écart ajusté.** On ne peut donc même pas vérifier si la borne supérieure de l'intervalle atteindrait un seuil cliniquement pertinent. C'est un p sans mesure de précision : exactement ce que la grille §5 proscrit.
- Le second résultat significatif, la dysurie, affiche un écart ajusté de **0,23 point** sur 10. Qu'un écart d'un cinquième de point atteigne la significativité illustre que, sur cet effectif, le test détecte des différences dont la magnitude est cliniquement nulle par construction. Cela ne renforce pas le résultat sur la dysménorrhée — cela discrédite la lecture clinique des p de ce tableau.

**Conclusion de la section : les deux bras sont, en pratique, équivalents sur la douleur.** Le résultat « significatif » est un artefact de puissance sur un écart imperceptible pour la patiente.

---

## 4. Objections méthodologiques, par gravité

### Gravité majeure — rédhibitoires pour tout usage prescriptif

**M1 — Confusion par indication, non contrôlée.** Les groupes diffèrent massivement à l'inclusion (âge, taille du kyste, nodule postérieur, tous p significatifs). Surtout : **l'ajustement se limite à la valeur initiale du critère lui-même**. Citation des méthodes : « *including treatment as a binary covariate in the models. To control for potential differences in baseline scores and sizes, baseline figures were also included in the models as continuous covariates.* » **Pas de score de propension. Pas d'ajustement sur l'âge**, alors que l'écart d'âge atteint 6,6 ans entre D et D+EE. Les auteurs le reconnaissent en limites sans y remédier : « *women treated with D + EE therapy were younger than the rest of the study population. This may be due to the fact that EPs are usually prescribed to adolescents and younger patients rather than progestogen alone.* »

Et surtout, la discussion **n'aborde jamais le déterminant principal de l'allocation** : les contre-indications aux œstrogènes (antécédent thrombo-embolique, migraine avec aura, tabagisme après 35 ans), la sévérité, l'échec de première ligne, le désir de grossesse. Le groupe D seul est plus âgé, avec des kystes plus gros et davantage de nodules postérieurs — c'est un groupe **plus sévère et à profil de risque différent**. Attribuer au médicament une différence de 0,77 point entre populations aussi dissemblables, avec un modèle ajusté sur un seul covariable, n'est pas défendable.

**M2 — Filtre de survie à l'inclusion (cf. §1a).** Exiger 12 mois de traitement complets exclut d'emblée les échecs et les intolérances, et probablement pas dans la même proportion selon le bras. Aucun dénominateur des patientes screenées n'est donné. C'est le biais le plus insidieux, parce qu'il rend la population analysée non identifiable.

**M3 — Multiplicité non corrigée.** **10 comparaisons ajustées** rapportées au tableau 2 (dysménorrhée, dyspareunie, douleur pelvienne chronique, dysurie ×2, dyschésie ×2, taille du kyste, nodule postérieur), **aucune correction** pour comparaisons multiples ; seuil laissé à 5 %. Trois résultats significatifs sur dix, **dont deux de sens opposés**, avec des magnitudes de 0,77 et 0,23 point : c'est le profil statistique attendu du hasard, pas d'un effet pharmacologique.

**M4 — Profil de résultat évocateur d'un biais de mesure.** L'étude est **négative sur le seul critère objectif et mesurable en aveugle** (taille de l'endométriome : Δ ajusté −1,13 mm, NS ; réduction comparable dans les trois bras) et positive sur des critères **subjectifs, auto-rapportés, en ouvert, dans une cohorte non aveugle où prescripteur et patiente connaissent le traitement**. C'est la signature classique d'un biais de mesure/d'attente plutôt que d'un effet biologique. Si le diénogest seul agissait réellement mieux sur la dysménorrhée, on attendrait au minimum une tendance concordante sur la charge lésionnelle — elle est absente.

### Gravité modérée

**m5 — Absence d'IC pour tous les écarts ajustés** (cf. §3). Résultat impossible à interpréter en précision.

**m6 — Régression vers la moyenne mal neutralisée.** Le groupe D partait avec des lésions plus grosses et une maladie plus étendue ; une amélioration absolue supérieure est en partie mécanique. L'inclusion linéaire du score initial ne neutralise pas complètement ce phénomène sur une NRS bornée.

**m7 — Recueil des scores.** Point à décharge relative : les scores étaient **consignés lors de consultations réelles** (« *We retrospectively reviewed data from our clinical records. As in our daily practice, women were evaluated at baseline visit (V1)… and after 6 and 12 months* »), pas reconstitués rétrospectivement de mémoire. C'est nettement mieux qu'une reconstitution, mais reste un recueil non standardisé pour la recherche, sans contrôle de qualité ni évaluateur indépendant.

**m8 — Monocentrique, centre tertiaire de référence** (IRCCS Bologne). Population plus sévère que la patientèle de soins premiers ; validité externe limitée pour une MSP.

---

## 5. Bénéfice-risque : ce que l'étude ne dit pas

Point central, et il joue **contre** la lecture du relais.

**Ce que l'étude rapporte** : effets indésirables globaux 16,2 % (D 13,5 % · D+EE 12,1 % · **D+EV 24,1 %**) ; spotting 4,7 % au total, **significativement plus fréquent sous D+EV (9,6 %, p = 0,04**, et 14,3 % en schéma continu). C'est déjà une nuance à porter au dossier : la tolérance affichée est **meilleure sous diénogest seul** que sous D+EV dans cette cohorte.

**Mais ce chiffre est ininterprétable**, pour deux raisons :
1. **Filtre des 12 mois** (M2) : les patientes ayant arrêté pour saignements ne sont pas dans le dénominateur. Un taux de spotting de 4,7 % sous diénogest est très inférieur à ce que rapporte la littérature d'exposition réelle ; l'écart mesure le filtre, pas la molécule.
2. **Aucune donnée d'arrêt de traitement, d'observance ou de satisfaction n'est rapportée.** Or, dans cette classe, le motif d'arrêt est le critère décisionnel principal en pratique.

**Ce qui manque totalement** :
- **Arrêts de traitement / observance** : non rapportés. C'est l'information qui manque le plus.
- **Densité minérale osseuse** : **aucune mesure**. La DMO n'apparaît que dans la discussion, comme argument théorique — les auteurs écrivent que l'effet du diénogest sur la DMO « *is still controversial in the Literature and, according to some studies, it may reduce BMD, therefore especially in adolescent patients the choice of combining dienogest with an estrogen seems reasonable.* » Autrement dit, **les auteurs eux-mêmes avancent un argument osseux en faveur de l'association**, que le relais ignore.
- **Risque thrombo-embolique de l'association** : non évalué (12 mois, effectif insuffisant pour un événement rare).
- **Satisfaction, qualité de vie, retentissement fonctionnel** : rien.

**Arbitrage réel** : mettre 0,77 point de NRS — sous le seuil de perception clinique — en balance avec un profil de saignements, un signal osseux non mesuré et un risque thrombotique non évalué, n'est pas un arbitrage neutre. **Le relais transforme un résultat d'équivalence pratique en argument de préférence, en escamotant la totalité du versant tolérance.**

---

## 6. Cohérence avec les recommandations, et existence d'ECR

**Recommandations.** ESHRE 2022 (*Endometriosis guideline*), NICE (NG73) et HAS/CNGOF 2017 proposent en première intention **soit** un contraceptif œstroprogestatif, **soit** un progestatif, **sans hiérarchie forte**, le choix étant guidé par les contre-indications, la tolérance et la préférence de la patiente. Rien dans cette cohorte ne justifie de déplacer cet ordre.

**Et surtout : des ECR existent sur cette comparaison précise.** C'est l'objection la plus décisive, et elle rend la question presque sans objet :

- **Techatraisak *et al.*, *Eur J Obstet Gynecol Reprod Biol* 2021** — ECR, 70 femmes, diénogest 2 mg vs OP monophasique (EE 0,03 mg + drospirénone 3 mg), 24 semaines, critère principal douleur pelvienne non cyclique et dysménorrhée sur EVA.
- **ECR randomisé en double aveugle contre placebo**, *Int J Gynaecol Obstet* 2022 (PMID 34816682) — diénogest vs OP, douleur et qualité de vie.
- **PRE-EMPT, *BMJ* 2024** (PMC11094611) — ECR pragmatique, parallèle, en ouvert : progestatifs longue durée vs OP pour la prévention de la récidive douloureuse liée à l'endométriose. Essai de grande envergure, directement pertinent.

**Conséquence méthodologique nette** : quand des essais randomisés existent sur exactement la même comparaison, une **cohorte rétrospective monocentrique avec confusion par indication non contrôlée n'apporte aucune information supplémentaire** et ne peut en aucun cas les contredire. Sa place dans la hiérarchie de preuve est nulle dès lors que les ECR sont disponibles. Toute publication de cet article sans mentionner l'existence de ces ECR serait trompeuse.

**Financement / conflits d'intérêt** : point à décharge. Financement institutionnel universitaire (accord CRUI-CARE, Université de Bologne), et déclaration explicite d'absence de conflit d'intérêt. Aucun lien Bayer/Visanne déclaré. Le biais commercial n'est pas l'explication ici — les défauts sont méthodologiques, pas mercantiles.

---

## 7. Ce qui tient malgré tout

Honnêteté du red-team : plusieurs points résistent à l'examen.

1. **L'identification est bonne.** PMID, PMC, effectifs, bras, chiffres : tout concorde. Aucune confusion d'article, contrairement à ce qui s'est produit ailleurs dans le lot.
2. **Les chiffres relayés sont exacts.** −2,63, −2,04, 0,77, p ≤ 0,01, absence de différence sur la taille : tous vérifiés au tableau 2. Le problème n'est pas la fidélité des nombres, c'est leur interprétation et leur sélection.
3. **L'article ne survend pas.** Le titre annonce « retrospective cohort study », la conclusion des auteurs dit « **seems to be equally effective** » et rapporte honnêtement le résultat inverse sur la dysurie. Le **spin vient du relais, pas des auteurs**. La discussion mentionne d'elle-même l'argument osseux en faveur de l'association. C'est un article modeste ; c'est sa restitution qui déforme.
4. **Le recueil des scores est prospectif dans le dossier**, pas reconstitué (m7). C'est une différence de fiabilité réelle par rapport au pire cas.
5. **L'effectif est honorable pour une cohorte monocentrique** (297) avec 12 mois de suivi structuré à trois temps, et les IC des variations intra-groupe sont fournis.
6. **Le message de fond est valide et utile** — mais c'est un message d'**équivalence**, pas de supériorité : les deux stratégies réduisent comparablement la taille des endométriomes et la douleur, avec des profils de tolérance différents. Cela **conforte** la position ESHRE/HAS d'un choix guidé par les contre-indications et la préférence, plutôt que par une hiérarchie d'efficacité.

---

## 8. Verdict

| Champ | Valeur |
|---|---|
| **Thème** | `sante-femme-perinatalite` |
| **Professions** | `MG`, `sage-femme` |
| **Design** | Cohorte rétrospective monocentrique, non randomisée, non aveugle |
| **Critère** | Subjectif auto-rapporté (NRS 0–10), non aveugle ; critère objectif (taille) négatif |
| **`niveau_preuve`** | **Très faible** |
| **`niveau_impact`** | **`informatif`** |
| **`route`** | **`breve`** — sous condition de reformulation (voir motif) ; **`analyse` exclue** |

### Justification du `niveau_preuve` : très faible

Observationnel rétrospectif (plancher bas d'emblée), **plus** trois dégradations cumulatives : confusion par indication non contrôlée (ajustement sur la seule valeur initiale, pas de score de propension, âge non ajusté) ; filtre de survie à l'inclusion non quantifiable ; multiplicité non corrigée avec résultats contradictoires. Le critère est subjectif et non aveugle tandis que le critère objectif est négatif. Et des ECR existent sur la même comparaison, ce qui prive cette cohorte de toute valeur incrémentale.

### Justification du `niveau_impact` : informatif

Rien ici ne modifie une conduite. L'écart de 0,77 point de NRS est **sous toutes les DMCI publiées**, d'un facteur ~5 par rapport au seuil spécifique de la dysménorrhée en endométriose. Aucun nœud d'algorithme n'est impacté. « On a regardé de près et ça ne change rien » est le résultat, et c'est un résultat valide.

### Motif de la route, et réserve explicite

**`analyse` est exclue** : cadrer une analyse détaillée autour de ce papier reviendrait à lui accorder un poids que son design ne supporte pas, sur un thème où le référent est sans compétence de fond et sans relecture par un gynécologue ou une sage-femme (`meta.relecture_referent: false`).

**`breve` est acceptable, mais seulement si la brève est écrite à rebours du relais**, c'est-à-dire :
- présentée comme une **cohorte rétrospective**, jamais comme un essai ;
- portant le message d'**équivalence pratique** (« pas de différence cliniquement perceptible »), jamais de supériorité du diénogest seul ;
- mentionnant obligatoirement (a) que l'écart est sous la DMCI, (b) le résultat inverse sur la dysurie, (c) l'existence d'ECR sur la même question, (d) l'absence de données d'arrêt de traitement et de DMO ;
- ne formulant **aucune recommandation de prescription**.

**Si ces quatre conditions ne peuvent pas être tenues dans le format bref**, alors la position de repli est de **ne pas publier** : sur ce thème, sans relecture spécialisée, une brève tronquée qui laisserait entendre une supériorité du diénogest seul serait plus nuisible que l'absence de publication. Ce n'est **pas** un cas de `reporte` — la vérification est complète, PMC étant ouvert et le texte intégral consulté ; c'est un arbitrage éditorial assumé.

**Recommandation de l'agent B** : si l'arbitre C hésite, préférer la non-publication. Le seul message défendable (« les deux options se valent, choisissez selon les contre-indications ») est déjà celui des recommandations en vigueur, et n'a pas besoin de cet article pour être vrai.
