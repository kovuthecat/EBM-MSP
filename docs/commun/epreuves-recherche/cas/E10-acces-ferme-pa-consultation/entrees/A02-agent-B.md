# A02 — Agent B (contradicteur) — Desbiens et al., *Hypertension* 2023

**Article** : Desbiens LC, Nadeau-Fredette AC, Madore F, Agharazii M, Goupil R. *Impact of Successive Office Blood Pressure Measurements During a Single Visit on Cardiovascular Risk Prediction: Analysis of CARTaGENE*. Hypertension. 2023 Oct;80(10):2209-2217. DOI 10.1161/HYPERTENSIONAHA.123.21510 · PMID 37615094.

---

## 1. Accès à la source

| Ressource | Résultat |
|---|---|
| `ahajournals.org` (texte intégral) | **HTTP 403** — confirmé à nouveau ce jour. Pas de contournement tenté. |
| PMC / Europe PMC | **`isOpenAccess: N`, `inPMC: N`, `inEPMC: N`, aucun PMCID** — il n'existe pas de version déposée. |
| PubMed / Europe PMC REST | **Abstract structuré intégral obtenu** (Background/Methods/Results/Conclusions), plus « Disclosures: None ». |

**Périmètre réel de ma vérification : l'abstract seul.** Aucun tableau, aucune figure, aucune méthode statistique détaillée, aucune valeur de C statistique chiffrée, aucun écart-type de PA, aucune liste de covariables d'ajustement.

**Conséquence, et c'est un élément du verdict, pas une note de bas de page** : la règle d'or de `GRILLE_APPRECIATION.md` (« chaque chiffre est relié à sa source — page/tableau ») ne peut pas être satisfaite. Les rubriques 3 (risque de biais), 5 (taille d'effet, effet absolu, précision) et 7 (spin, analyses post-hoc) de la grille sont **non renseignables**. On ne rédige pas une appréciation critique complète sur un abstract.

---

## 2. Vérification chiffre par chiffre

Source unique de vérification : abstract structuré, section *Results* (Europe PMC, champ `abstractText`, identique au rendu PubMed).

| Annoncé (presse / brief) | Trouvé dans la source primaire | Localisation | Verdict |
|---|---|---|---|
| SBP3 : HR **1,10 [1,05-1,15]** par écart-type | « SBP₃ had the strongest association with MACE incidence (hazard ratio, 1.10 [1.05-1.15] per SD) » | Abstract, *Results* | **Exact** |
| SBP1 : HR **1,06 [1,01-1,10]** par écart-type | « and SBP₁ the weakest (hazard ratio, 1.06 [1.01-1.10]) » | Abstract, *Results* | **Exact** (le « per SD » n'est écrit qu'une fois, il porte par construction sur les deux) |
| 17 966 sujets | « In the 17 966 eligible individuals » | Abstract, *Results* | **Exact** |
| 2 378 MACE | « 2378 experienced a MACE during follow-up » | Abstract, *Results* | **Exact** |
| Suivi ~10 ans | « during a 10-year follow-up » | Abstract, *Methods* | **Exact** |
| 40-70 ans, CARTaGENE, population-based | « CARTaGENE, a population-based survey comprising individuals aged 40 to 70 years » | Abstract, *Methods* | **Exact** |
| « le risque conféré par SBP3 est 2× celui de SBP1 » | « At a given SBP value, the **excess** MACE risk conferred by SBP₃ was 2× greater than SBP₁ » | Abstract, *Results* | **Reformulation infidèle** — voir §3 |
| (non annoncé) 3 mesures à 2 min d'intervalle, appareil semi-automatisé | idem *Methods* | Abstract | Contexte utile |
| (non annoncé) PA systoliques brutes **122,5 à 126,5 mmHg** | « Crude SBP values ranged from 122.5 to 126.5 mm Hg » | Abstract, *Results* | **Chiffre décisif omis du relais** — voir §4 |
| (non annoncé) C statistique | « SBP₃ yielded the highest C statistic, significantly higher than most other SBP measures » | Abstract, *Results* | **Présente**, mais non chiffrée |
| (non annoncé) PA diastolique | « all diastolic BP readings yielded similar results » | Abstract, *Results* | **Résultat discordant, omis du relais** |

**Divergence de fond sur la construction narrative** : la conclusion des auteurs n'est pas « trois valent mieux qu'une » mais « **surtout quand la première mesure est écartée** » (« especially when the first reading is discarded »), et le gagnant du classement est **SBP₃ seule** — une mesure unique, la troisième — qui bat les moyennes SBP₁₋₂₋₃ et SBP₁₋₂. Voir §4, objection 1.

---

## 3. Le « 2× » — construction exacte et recevabilité

**Ce que dit la source** : « At a given SBP value, the excess MACE risk conferred by SBP₃ was 2× greater than SBP₁. »

Trois observations.

**a) Le facteur porte bien sur l'*excès* de risque, pas sur le HR.** Le mot `excess` est dans la phrase originale. La reprise « le risque conféré par SBP3 est 2× celui conféré par SBP1 » **supprime ce mot** et devient fausse : si on la lit comme « le risque est doublé », c'est faux d'un ordre de grandeur (les HR sont 1,10 vs 1,06 ; le risque de MACE conféré est quasi identique). C'est une distorsion de relais, pas une imprécision de style.

**b) Le facteur 2 n'est pas reconstructible depuis les chiffres publics.** L'excès de HR par écart-type est 0,10 vs 0,06, soit **1,67×, pas 2×**. Le « 2× » ne peut donc pas venir des HR par SD. La formulation « **at a given SBP value** » (à valeur de PA donnée, c.-à-d. en mmHg, pas en SD) indique une re-expression **par unité de pression** : il faut diviser chaque excès par l'écart-type correspondant, et l'écart-type de SBP₁ est vraisemblablement supérieur à celui de SBP₃ (la première mesure est la plus haute et la plus dispersée). Avec par exemple SD₁ ≈ 17 et SD₃ ≈ 15 mmHg, on obtient 0,0035 vs 0,0067 par mmHg, soit ≈ 1,9× — cohérent. **Mais ce n'est qu'une reconstruction : les écarts-types ne figurent pas dans l'abstract.** Le chiffre est donc **invérifiable en l'état**.

**c) Recevabilité de sa reprise** : **non, pas en l'état.** Trois raisons cumulatives :
1. il porte sur un **excès relatif d'un rapport de risques**, une quantité sans interprétation clinique directe ;
2. il ne dit **rien du risque absolu** — doubler un excès de 0,35 % par mmHg reste dérisoire à l'échelle d'un patient ;
3. sa construction exacte n'est **pas auditable** sans le texte intégral.

Un « 2× » cité seul, dans un titre ou une brève, laisse mécaniquement croire à un doublement de risque cardiovasculaire. **À proscrire dans notre veille sans la phrase complète et la mention « excès ».**

---

## 4. Objections méthodologiques, par gravité

### Gravité majeure

**1. Le titre de presse français dit l'inverse du résultat.** « Trois fois valent mieux qu'une » suggère qu'il faut moyenner trois mesures. Or l'article montre que **toutes les moyennes contenant la 1ʳᵉ mesure sous-performent** (« all models including SBP₁ … were underperformed »), y compris SBP₁₋₂₋₃, et que la meilleure prédiction vient de **SBP₃ seule**. Le message opérationnel de l'article est « **jeter la première mesure** », pas « en faire trois et moyenner ». C'est une distorsion de relais, et elle a un impact pratique inverse.

**2. Aucun test formel de différence entre les deux HR n'est rapporté dans l'abstract.** Les IC se chevauchent très largement ([1,05-1,15] vs [1,01-1,10] : recouvrement sur 1,05-1,10). Déclarer un prédicteur « le plus fort » et l'autre « le plus faible » sur la base de deux estimations séparées, sans test de différence ni test d'interaction, est **l'erreur de comparaison classique**. Nuance honnête : les auteurs rapportent bien une comparaison formelle **sur la C statistique** (« significantly higher than most other SBP measures »), ce qui est le bon terrain ; mais (i) la comparaison des HR entre eux reste non documentée, et (ii) « most other » signifie que **certaines comparaisons n'étaient pas significatives** — lesquelles ? invérifiable sans le tableau.

**3. Aucune donnée de reclassement.** Ni NRI, ni IDI, ni — surtout — le chiffre qui compte en consultation : **combien de patients changent de catégorie (hypertendu ↔ non hypertendu) en passant de SBP₁ à SBP₃**. Sans lui, l'article ne produit aucune conséquence actionnable au cabinet. L'amplitude du delta de C statistique n'est pas non plus chiffrée dans l'abstract : « la plus haute » peut vouloir dire +0,001. Un gain de discrimination non chiffré est un gain non évaluable.

**4. Effet absolu et NNT : totalement absents, et l'effet relatif est minuscule.** HR 1,10 par écart-type (~15 mmHg) est **très en deçà** de ce que rapporte l'épidémiologie classique de la PA (typiquement 1,2-1,4 par SD). Deux lectures possibles, indiscernables sans le texte intégral : sur-ajustement (les modèles ASCVD contiennent déjà âge, tabac, diabète, lipides, traitement antihypertenseur — ajuster la PA sur un score qui la contient est circulaire), ou cohorte à très faible gradient de risque. Dans les deux cas, **la différence 1,10 vs 1,06 est une différence entre deux signaux faibles**.

### Gravité modérée

**5. Effet blouse blanche / causalité inverse plausible et non écartable.** SBP₃ < SBP₁ par décroissance d'acclimatation. Que la 3ᵉ mesure prédise mieux peut signifier soit qu'elle estime mieux la « vraie » PA, soit que **l'amplitude de la chute SBP₁→SBP₃ est elle-même un marqueur** (réactivité au stress, rigidité artérielle, statut sympathique). L'abstract ne dit pas si le **delta** SBP₁−SBP₃ a été testé comme prédicteur indépendant — c'est pourtant l'analyse qui trancherait. Les covariables d'ajustement ne sont pas listées.

**6. Biais du volontaire sain, et validité externe faible pour une MSP du 20ᵉ.** CARTaGENE = volontaires québécois de 40-70 ans, avec les gradients socio-économiques et de santé habituels des cohortes de volontaires. **PA systoliques brutes 122,5-126,5 mmHg** : c'est une population globalement **normotendue**, où l'enjeu diagnostique « hypertendu ou non » se pose peu. Rien sur la proportion de traités, ni sur les comorbidités. La patientèle d'une MSP parisienne (plus jeune et plus âgée, plus précaire, plus comorbide, plus polymédiquée) n'est pas représentée. Bornes d'âge 40-70 ans : **exclut les >70 ans**, précisément là où la variabilité tensionnelle et l'hypotension orthostatique rendent la question des mesures répétées la plus vive.

**7. Discordance systolique/diastolique non expliquée.** « All diastolic BP readings yielded similar results » : si la 1ʳᵉ mesure était bruitée par un mécanisme physiologique général (stress, acclimatation), on l'attendrait aussi sur la diastolique. Que l'effet soit systolique-seulement est **soit une signature de mécanisme, soit un signe de fragilité du résultat** (jeu du hasard sur des différences ténues). L'abstract la constate sans l'expliquer. Ce résultat négatif est absent du relais de presse.

### Gravité mineure mais réelle

**8. Spin dans la conclusion des auteurs.** « These findings **reinforce the necessity** of using multiple office BP readings » : langage **prescriptif et causal** (« necessity ») sur une **analyse observationnelle de performance prédictive**. L'étude n'a comparé aucune stratégie de mesure en tant qu'intervention ; elle n'a pas montré qu'appliquer SBP₃ améliore un résultat de santé. De plus la conclusion ne suit pas exactement le résultat : le résultat soutient « écarter la première », la conclusion dit « en faire plusieurs ».

**9. Non pré-enregistré, analyse secondaire d'une cohorte existante.** Nombre de comparaisons élevé (6 mesures de PA × systolique/diastolique × association + C statistique) : **au moins 12 modèles**, sans mention de correction pour multiplicité dans l'abstract. Le « gagnant » d'un classement de 6 candidats aux performances proches est un candidat au **biais du gagnant**.

**Synthèse risque de biais** : **modéré à élevé** — cohorte observationnelle (association ≠ causalité, signalé d'emblée par la grille §3), covariables d'ajustement inconnues, causalité inverse non écartée, multiplicité non traitée, aucune donnée d'effet absolu. **Et ce jugement est lui-même provisoire : il repose sur un abstract.**

---

## 5. La pratique recommandée est-elle déjà celle-là ?

C'est l'objection décisive.

| Référentiel | Ce qui est recommandé pour la mesure au cabinet |
|---|---|
| **ESC 2024** — *Guidelines for the management of elevated blood pressure and hypertension* (Eur Heart J 2024) | Protocole standardisé : **5 min de repos assis, puis 3 mesures espacées de 1-2 min, et on retient la moyenne des 2 dernières**. Mesure aux deux bras à la 1ʳᵉ visite. Sources : [ACC — Key Points, 2024 ESC BP Guidelines](https://www.acc.org/Latest-in-Cardiology/ten-points-to-remember/2024/09/05/14/11/2024-esc-guidelines-for-bp-esc-2024) ; [Hypertension — What Is New and Different in the 2024 ESC Guidelines](https://www.ahajournals.org/doi/10.1161/HYPERTENSIONAHA.124.24173) ; [JACC — Navigating the 2024 ESC Hypertension Guidelines](https://www.jacc.org/doi/10.1016/j.jacc.2024.10.114) |
| **ESH 2023** (repris par ESC 2024) | Même logique de mesures répétées avec moyenne, la 1ʳᵉ mesure n'étant pas retenue seule. |
| **AHA/ACC** (2017, doctrine constante) | Mesures répétées (**≥ 2**) à ≥ 1 min d'intervalle après 5 min de repos, **moyennées**. Point de doctrine bien établi, mais **non re-vérifié sur le texte source dans cette session** — à confirmer si on le cite en publication. |
| **HAS** | **Minimum 2 mesures par consultation** (une à chaque bras à la 1ʳᵉ consultation), appareil validé, brassard adapté, patient assis/couché après plusieurs minutes de repos. Et surtout, point français structurant : **confirmation du diagnostic hors cabinet** par automesure ou MAPA (seuils ≥ 135/85) avant instauration de traitement. Sources : [HAS — Prise en charge de l'HTA de l'adulte](https://www.has-sante.fr/jcms/c_2059286/fr/) ; [HAS — synthèse HTA patient adulte (PDF)](https://www.has-sante.fr/upload/docs/application/pdf/hta_patient_adulte_synthese.pdf) ; [Ameli — HTA : confirmation du diagnostic par automesure](https://www.ameli.fr/exercice-coordonne/sante-prevention/pathologies/hypertension-arterielle-hta-confirmation-du-diagnostic-et-suivi-par-automesure-tensionnelle) |

**Le protocole étudié par Desbiens et al. — 3 mesures à 2 min d'intervalle, la première étant la moins performante — est, à la variante d'intervalle près, exactement le protocole ESC/ESH déjà en vigueur.** L'article **valide a posteriori une pratique recommandée depuis des années** ; il ne la déplace pas.

Deux nuances, à l'honneur de l'article :
- il fournit une justification sur **critère dur** (MACE à 10 ans) là où la recommandation reposait surtout sur la **concordance avec la MAPA** (critère de substitution). C'est un vrai renfort de niveau d'argumentation.
- il suggère un léger décalage : la meilleure mesure serait **SBP₃ seule**, pas la moyenne SBP₂₋₃ recommandée par l'ESC. Mais cette nuance repose sur des écarts non chiffrés entre C statistiques, sans test de différence rapporté entre SBP₃ et SBP₂₋₃, et **ne justifie pas de dévier d'une recommandation internationale**.

**Objection française supplémentaire, et elle est lourde** : en France, la mesure au cabinet **n'est pas le fondement du diagnostic**. La HAS impose une confirmation hors cabinet (automesure ou MAPA, seuils 135/85) avant d'instaurer un traitement. Optimiser le classement prédictif *interne* aux mesures de cabinet répond donc à une question qui, dans le parcours HAS, est **déjà court-circuitée par l'étape suivante**. Un patient dont SBP₁ et SBP₃ divergent verra de toute façon son diagnostic tranché par l'automesure. Cela réduit encore la portée pratique de l'article en soins premiers français.

**Conclusion de cette section : l'article ne déplace aucun nœud de décision. Il conforte l'existant.** Et le seul geste qu'il pourrait faire bouger — « prenez la 3ᵉ seule plutôt que la moyenne des 2 dernières » — est précisément celui que les données accessibles ne permettent pas d'étayer.

---

## 6. Ce qui tient malgré tout

Honnêtement, et contre mon propre rôle :

1. **Les deux HR annoncés sont exacts au chiffre près**, IC compris. Aucune fabrication, aucune troncature d'IC. Le relais est fidèle sur ce point.
2. **La C statistique existe, et une comparaison formelle a été faite.** Mon objection « pas de mesure de discrimination » — la plus prévisible du red-team — **tombe** : les auteurs ont fait le bon choix méthodologique en évaluant la performance prédictive dans le cadre des scores ASCVD à 10 ans, et pas seulement l'association. C'est méthodologiquement au-dessus de la moyenne des papiers de ce type.
3. **La taille et la puissance sont sérieuses** : 17 966 sujets, 2 378 MACE sur 10 ans, critère **dur** (mortalité CV, AVC, IDM) et non substitutif. Sur la grille §4, c'est la rubrique la mieux tenue.
4. **Le protocole de mesure est standardisé et prospectif** (appareil semi-automatisé, intervalles fixes de 2 min), ce qui écarte le bruit de mesure hétérogène qui plombe la plupart des études de PA en cohorte.
5. **La direction du résultat est physiologiquement cohérente** et concorde avec la littérature MAPA antérieure : la 1ʳᵉ mesure surestime. L'article n'est pas isolé, il s'inscrit dans le sens des preuves existantes (grille §7).
6. **Déclaration : « Disclosures: None »** — pas de conflit d'intérêt déclaré, pas de financement industriel apparent.
7. **Le résultat négatif sur la diastolique est rapporté**, y compris dans l'abstract. Les auteurs ne l'ont pas caché ; c'est le relais de presse qui l'a perdu.

---

## 7. Verdict

| Champ | Valeur |
|---|---|
| **Thème** | `cardiovasculaire-prevention` |
| **Professions** | `MG`, `IPA`, `IDEL` |
| **Type de publication** | Cohorte prospective observationnelle (analyse secondaire, CARTaGENE) |
| **Critère de jugement** | **Dur** (MACE : décès CV, AVC, IDM) — composite, composant porteur non identifiable depuis l'abstract |
| **niveau_preuve** | **Faible** — GRADE simplifié : observationnel (départ bas), non rehaussé faute d'un effet ample ; effet relatif minuscule (HR 1,10 par SD), ajustements inconnus, causalité inverse non écartée, multiplicité non traitée, aucun effet absolu ni NNT, aucun test de différence entre HR rapporté |
| **niveau_impact** | **`informatif`** |
| **Pertinence pratique** | **faible à modérée** (renfort d'argumentaire, pas de geste nouveau) |
| **Impacte un algorithme ?** | **Non** — aucun nœud de décision déplacé |
| **route** | **`reporte`** |

### Motif de la route — et distinction explicite des deux cas

Il faut séparer deux choses que la doctrine du projet demande de ne pas confondre :

- **Sur le fond, tel que je peux le juger : `informatif`.** L'article confirme le protocole ESC/ESH 2024 déjà en vigueur (3 mesures, moyenne des 2 dernières) en lui apportant un appui sur critère dur. Il ne déplace aucune décision de consultation. « On a regardé de près, ça ne change rien » est ici le résultat probable — et c'est un résultat valide.
- **Sur la procédure : `reporte`.** Le fond ne peut pas être *arrêté*, parce que la vérification est **incomplète faute d'accès** (SOP §6bis) : paywall AHA 403, aucune version PMC, travail limité à l'abstract. Trois éléments non vérifiables sont matériels au jugement — (i) la construction exacte du « 2× », non reconstructible sans les écarts-types ; (ii) l'**amplitude** du gain de C statistique et **quelles** comparaisons étaient significatives (« most other ») ; (iii) la **liste des covariables d'ajustement**, dont dépend l'objection de circularité avec le score ASCVD. Et la règle d'or de `GRILLE_APPRECIATION.md` interdit de rendre une appréciation critique complète sur un abstract.

**Recommandation opérationnelle** : ne pas publier de brève en l'état — une brève reprenant le « 2× » ou le titre « trois fois valent mieux qu'une » propagerait deux erreurs (doublement de risque apparent ; consigne de moyenner alors que le résultat dit d'écarter la 1ʳᵉ). **Reporter** en attente d'un accès au texte intégral (demande d'article à un confrère disposant d'un accès institutionnel, ou courriel à l'auteur correspondant). Si l'accès reste impossible, **clore en `informatif` sans publication**, ou publier une brève strictement limitée à : *« une cohorte de 17 966 Québécois conforte, sur critère dur à 10 ans, le protocole déjà recommandé de mesures répétées au cabinet, la première mesure étant la moins prédictive »* — sans le « 2× », sans le titre de presse.
