# SOP — Procédure de veille clinique (MSP)

**Version :** 1.1 (2026-07-31) · **Statut :** en vigueur, validée par le **référent veille** · **Prochaine revue :** +12 mois
**Destinée à être publiée dans l'outil (page « Méthode »)** — la transparence de la méthode est un gage de fiabilité.

> **Ce document décrit ce qui est réellement fait, avec les moyens réellement disponibles.** Là où une ressource n'existe pas encore (second relecteur, référents de profession, comité éditorial), la procédure le **dit** et décrit le dispositif de remplacement, plutôt que de promettre un contrôle qui n'a pas lieu. C'est le même principe de transparence que le projet applique au niveau de preuve : mieux vaut une méthode plus modeste et vraie qu'une méthode ambitieuse et non suivie.

---

## 1. Objet & champ d'application

Décrire la procédure **reproductible** de production de la veille hebdomadaire : de la collecte à la publication, jusqu'à l'éventuel impact sur les algorithmes d'aide à la décision. Elle **vaut** pour tous les thèmes et profils (MG, IPA maladies chroniques, sage-femme, orthophoniste, IDEL) ; elle n'est aujourd'hui **appliquée** qu'au périmètre de production du §3bis.

**Objectif de fiabilité :** deux référents appliquant cette SOP doivent produire des résultats comparables ; chaque semaine doit être auditable. *Cet objectif est vérifiable le jour où il y a deux référents (§2) ; il commande dès maintenant la forme de la procédure — critères écrits, seuil opposable, journal tenu — pour qu'elle soit reproductible par quelqu'un d'autre que son auteur.*

---

## 2. Rôles & responsabilités

**État réel au 2026-07-31 : un référent unique.** Une seule personne assure aujourd'hui la collecte, la présélection, l'analyse, le classement, la rédaction et la publication, sur un périmètre de **9 thèmes** de médecine générale (§3bis). Les autres rôles sont des **cibles** : ils sont décrits ici pour ce qu'ils devront être, pas comme des contrôles en place.

| Rôle | Responsabilité | Statut |
|---|---|---|
| **Référent veille** | Collecte, présélection, analyse, classement, rédaction, publication, tenue du journal. | **tenu** — un seul, tous thèmes |
| **Référent algorithme** | Analyse, avec Claude Code, des items pouvant modifier un nœud de décision. | **tenu par le référent veille** |
| **Référent(s) de profession** | Collecte, présélection, analyse, classement pour leur domaine et leur profession. | **cible** — conditionne l'ouverture des 4 thèmes hors production (§3bis) |
| **Relecteur (2ᵉ lecture indépendante)** | Validation indépendante des items à impact pratique. | **cible** — remplacé aujourd'hui par le dispositif de l'étape 5 (§5) |
| **Comité éditorial** | Validation finale des modifications d'algorithme ; revue de la SOP. | **cible** — en son absence, aucune modification d'algorithme n'est appliquée (§5, étape 7) |

Déclaration de **liens d'intérêt** obligatoire pour tout contributeur.

> **Ce que cette configuration ne permet pas**, et qu'il faut lire comme une limite de la veille, pas comme un détail d'organisation : il n'y a **aucun regard humain indépendant** sur les items à impact pratique. Le dispositif de l'étape 5 (vérification bi-agents + relecture différée) réduit l'erreur d'extraction et l'emballement, il ne corrige pas un angle mort partagé par le référent et ses agents. Un second relecteur reste la première ressource à recruter.

---

## 3. Cadence & convention de semaine

Cycle **hebdomadaire** fixe. Revue de fond de la SOP et des sources : **annuelle**.

La convention ci-dessous est **arbitraire mais déclarée** : non écrite, elle dériverait d'une semaine à l'autre et l'archive deviendrait inexploitable.

| | Règle |
|---|---|
| **Jour de publication** | **Lundi.** |
| **`date_semaine`** | La **semaine ISO du lundi de publication** — format `AAAA-Www` (ex. `2026-W32`). C'est l'identifiant de l'édition et le nom du dossier d'archive. |
| **Fenêtre de collecte** | Les **7 jours précédant** la publication, soit lundi → dimanche inclus de la semaine ISO précédente. Une édition ne contient donc jamais un item paru le jour même. |
| **Première édition** | **`2026-W32`** — lundi 03/08, couvrant 27/07 → 02/08. |

> Les deux éditions de cadrage `2026-W30` et `2026-W31` ont été produites **rétrospectivement**, hors cycle, pour fixer la méthode avant le premier lundi. Elles suivent la même convention de fenêtre, mais leur collecte s'est faite sur archives datées et non sur alertes poussées : leur journal de semaine le mentionne, et les temps qu'elles ont mesurés ne valent pas pour un cycle normal.

### 3bis. Périmètre de production

Le **modèle de données** couvre les 13 thèmes de la taxonomie et les 5 professions (`BRIEF_VEILLE.md` §3 et §4). La **production hebdomadaire**, elle, couvre aujourd'hui **9 thèmes** de médecine générale : `soins-premiers`, `diabete-metabolisme`, `cardiovasculaire-prevention`, `bpco-pneumo`, `infectiologie-antibiotherapie`, `geriatrie-deprescription`, `prevention-depistage-vaccination`, `sante-mentale-addictologie`, `douleur-soins-palliatifs`.

Les 4 thèmes restants — `ETP`, `sante-femme-perinatalite`, `orthophonie`, `soins-infirmiers` — existent au modèle de données mais **ne font l'objet d'aucune production** tant qu'un référent de profession ne les prend pas en charge (§2). Un filtre qui ne renverrait rien est préférable à un contenu produit hors compétence : l'absence est déclarée, elle n'est pas masquée.

---

## 4. Hiérarchie des sources (modèle 6S)

Priorité aux sources **pré-évaluées** (haut rendement / temps maîtrisé). On ne descend aux études brutes que pour un signal à fort impact.

- **Tier 1 — EBM secondaire pré-appréciée :** Minerva, Prescrire, Cochrane, NNT.com, McMaster EvidenceAlerts, BMJ EBM, Médicalement Geek/DragiWebdo, Exercer.
- **Tier 2 — Recommandations & agences :** HAS, **Collège de la Médecine Générale (CMG)**, sociétés savantes par thème, ANSM.
- **Tier 3 — Sommaires de grandes revues (alertes TOC) :** NEJM, Lancet, JAMA, BMJ, Annals + revues spécialisées par profil.
- **Tier 4 — Études primaires :** en **vérification/approfondissement** d'un signal déjà repéré uniquement.

> OpenEvidence / web-fetch IA = **débroussaillage complémentaire**, jamais source primaire. Toute sortie IA est re-vérifiée sur l'article original (référence réelle, chiffres exacts).

### Règle de balayage — ce qui rend 9 thèmes tenables

La hiérarchie ci-dessus classe les sources ; elle ne dit pas lesquelles on ouvre chaque lundi. La règle est celle-ci :

- **Tier 1 et Tier 2 sont balayés en routine**, chaque semaine, intégralement. Ce sont des sources qui ont **déjà filtré et apprécié** la littérature : c'est là que se trouve le signal utile pour un coût de lecture borné.
- **Tier 3 et Tier 4 ne sont ouverts que pour vérifier ou approfondir un signal déjà repéré** en Tier 1-2 — jamais en balayage systématique. Ouvrir les sommaires de cinq grandes revues et les études primaires chaque semaine est la façon la plus sûre de rendre la veille intenable au bout d'un mois, pour un rendement marginal : ce que ces sources contiennent d'important remonte en Tier 1-2 en quelques semaines.

**Conséquence assumée** : la veille a un **délai** sur les études primaires. Un item majeur peut être signalé une ou deux semaines après sa parution, quand une source pré-appréciée s'en saisit. C'est le prix d'une veille soutenable par une personne, et c'est préférable à une veille exhaustive qui s'arrête au bout de six semaines.

**La liste détaillée des sources**, par tier et par profil, avec pour chacune son type, son accès (libre / abstract / paywall) et les professions couvertes, est maintenue dans **`docs/veille/SOURCES.md`** — versionnée, révisée à chaque bilan d'édition et en revue annuelle.

---

## 5. Procédure hebdomadaire (étapes)

### Étape 1 — Collecte
Relever les nouveautés des sources **Tier 1-2** (§4) sur la fenêtre de la semaine (§3), via **alertes automatisées** quand elles existent (PubMed *saved searches*/RSS, alertes TOC, EvidenceAlerts, flux des sociétés savantes) et consultation directe pour les sources sans flux. Normaliser chaque candidat dans le **journal de moisson** de la semaine. Consigner aussi les **sources balayées sans nouveauté** : sans cette trace, on ne peut pas distinguer une source vide d'une source oubliée.

### Étape 2 — Présélection (screening)
Appliquer les **critères d'inclusion/exclusion** (§6), puis le **seuil de classement** (§6bis) à chaque candidat inclus. Décider pour chacun : `retenu` (avec sa **route** — brève ou analyse, §5bis), `exclu` + motif, ou `reporte` + date. Tenir le **journal de screening** au fil du tri — mini-flux type PRISMA hebdomadaire.

> Le journal de screening se remplit **pendant** le tri, jamais reconstitué après coup. Reconstitué, il ne prouve plus rien : il ne fait que justifier les choix déjà faits.

### Étape 3 — Analyse critique
Pour chaque article en route **analyse** : remplir la **grille d'appréciation critique** (`GRILLE_APPRECIATION.md`), intégralement. L'analyse est fiabilisée par la **vérification bi-agents** (§7). Les brèves ne passent pas par la grille — elles ne portent aucune appréciation critique propre (§5bis).

### Étape 4 — Classement
Renseigner : `themes[]`, `professions_concernees[]`, `niveau_preuve` (GRADE simplifié), **`niveau_impact` (pratique / informatif)**, `temps_lecture_min`, `impact_algorithme`. `niveau_impact` est le **verdict** de l'analyse, distinct de la `route` décidée à l'étape 2 (§5bis).

### Étape 5 — Vérification et relecture différée
Il n'y a **pas de second lecteur humain** aujourd'hui (§2). Ce que la double lecture visait — l'erreur d'extraction et l'emballement du lecteur unique — est traité par deux dispositifs, et la page « Méthode » les publie tels quels :

1. **Vérification bi-agents** (§7) sur **tout item en route analyse** : deux agents à rôles distincts, contextes séparés, ancrés sur la source primaire, puis réconciliation qui **escalade** au lieu de lisser. Le référent tranche.
2. **Relecture différée à J+3** par le **même** référent : l'entrée rédigée n'est jamais publiée le jour où elle est écrite. En cycle normal, la rédaction est close au plus tard le **vendredi** et relue le **lundi** avant publication, avec un regard neuf. Toute correction apportée à la relecture est tracée.

**Ce n'est pas une double lecture indépendante**, et ce document ne la présente pas comme telle. Un délai et deux agents réduisent l'erreur d'extraction, la surinterprétation et le *spin* non détecté ; ils ne corrigent pas un **angle mort partagé** — une lecture erronée que le référent et ses agents feraient de la même façon, faute d'expertise sur le champ concerné. Ce point est la limite connue de la méthode, et il est levé le jour où un second relecteur rejoint la veille (§2).

Désaccord non résolu à la réconciliation → l'item **ne se publie pas en analyse** : il est reporté (§6bis) ou reclassé en brève avec le désaccord mentionné.

### Étape 6 — Mise en forme & publication
Rédiger l'**entrée de veille** (schéma du brief §5), **résumé + lien** (jamais de copie intégrale — §8), puis **push** git → relecture différée (étape 5) → publication le lundi. Archiver la semaine : moisson, screening et entrées restent consultables.

### Étape 7 — Impact sur les algorithmes
Pour les items `concerne_decision`, le référent algorithme, avec Claude Code, rédige un **diff proposé** du/des nœud(s) → **validation comité** → mise à jour **versionnée et tracée** (changelog). Aucune modification automatique (cf. brief décision §13).

> **Tant que le comité éditorial n'existe pas** (§2), aucune modification d'algorithme n'est appliquée. L'item est enregistré avec ses `noeuds_impactes` et `proposition_maj: candidate`, et il en reste là. C'est un blocage assumé : une mise à jour de nœud sans validation collégiale contredirait la règle qui interdit toute modification automatique.

---

## 5bis. Routes de production — brève ou analyse

Chaque item retenu suit **une** des deux routes, décidée au screening (étape 2) par le seuil du §6bis.

| | **Brève** | **Analyse** |
|---|---|---|
| Ce qu'elle fait | **Signale, situe, lie.** Dit ce qui a paru, où, sur quel sujet, et pointe la source. | Appréciation critique complète : grille (`GRILLE_APPRECIATION.md`), effets absolus, validité externe, cohérence, conflits d'intérêt. |
| Ce qu'elle ne fait **pas** | **Aucune appréciation critique propre.** Une brève ne conclut pas sur la solidité d'un résultat, ne recommande rien, n'estime pas de niveau de preuve. | — |
| Grille d'appréciation | non | **oui, intégrale** |
| Vérification bi-agents (§7) | non | **oui** |
| Coût indicatif | quelques minutes | l'essentiel du temps de la semaine |

**Règle qui lie les deux champs** — `route` et `niveau_impact` sont **deux champs distincts** et ils ne coïncident pas :

- **`route`** est décidée **avant** de savoir, au screening, sur le *potentiel* de l'item.
- **`niveau_impact`** est le **verdict**, arrêté **après** l'analyse.
- **Une brève est toujours `informatif`** — faute d'appréciation critique, elle ne peut pas prétendre qu'un item change la pratique.
- **Une analyse peut conclure `informatif`**, et c'est fréquent : c'est même souvent le résultat le plus utile au lecteur (« on a regardé de près, et non, ça ne change rien »). Ce n'est **pas** un échec de screening ni du temps perdu.
- Donc : **analyse ⊇ pratique**. Tout item classé `pratique` a suivi la route analyse ; l'inverse n'est pas vrai.

**Une semaine peut ne rien contenir de pratique.** « Cette semaine, rien qui change la pratique » est une **publication valide**, et une information en soi. La veille ne fabrique pas de la nouveauté pour remplir une page : c'est précisément ce que font les sources qu'elle est censée filtrer.

---

## 6. Critères d'inclusion / exclusion

**Inclure :** design pertinent (ECR, méta-analyse, recommandation, cohorte de qualité) ; question pertinente pour les soins premiers / le profil ; **critère de jugement important pour le patient**.

**Exclure :** études précliniques/animales ; très petits effectifs non répliqués ; critères **purement intermédiaires** sans portée clinique ; communiqués de presse sans article ; doublons ; contenu déjà couvert.

### 6bis. Seuil de classement « potentiellement à impact pratique »

Ces critères disent ce qui **entre** en veille. Le seuil ci-dessous dit ce qui, parmi les items entrés, part en **route `analyse`** (grille complète de `GRILLE_APPRECIATION.md` + vérification bi-agents §7) plutôt qu'en **brève** (§5bis). Il est appliqué au screening (§5, étape 2), sur le titre et l'abstract, avant toute lecture approfondie — donc sur le **potentiel** d'un item, pas sur son verdict. Le verdict, lui, est le champ `niveau_impact`, et il n'est arrêté qu'après l'analyse.

Ce seuil n'est pas un confort de lecture : c'est le **régulateur de charge de la semaine**. Chaque franchissement engage une grille complète et deux agents. Une définition qui ne rejette rien fait tomber la veille, pas la semaine d'après mais la quatrième.

#### Les trois conditions — cumulatives

Un item est « potentiellement à impact pratique » **si et seulement si les trois** sont vraies. Une seule réponse « non » suffit à le classer en brève ; une réponse « je ne sais pas » sur C2 ou C3 vaut « oui » pour la seule condition C1 déjà acquise, et déclenche une **lecture de 5 minutes de l'abstract complet** pour trancher — jamais un franchissement par défaut.

| | Condition | Question que se pose le screener |
|---|---|---|
| **C1** | L'item **déplace une décision fréquente en soins premiers** — indication, molécule, cible, durée, dépistage, arrêt. | *« Puis-je nommer le geste qui changerait en consultation, et dire à peu près combien de patients de ma semaine sont concernés ? »* Si je ne sais pas nommer le geste, la réponse est non. |
| **C2** | L'effet porte sur un **critère important pour le patient** et son ampleur **absolue** est non triviale. | *« L'effet est-il donné (ou reconstituable) en absolu — différence de risque, NNT/NNH, sur quel horizon ? Vaut-il d'être dit à un patient ? »* Un critère de substitution seul ne franchit jamais C2 à lui seul. |
| **C3** | La **population et le comparateur** sont transposables à la patientèle de la MSP. | *« Ces patients ressemblent-ils aux miens (âge, comorbidités, prévention primaire/secondaire) ? Le bras contrôle ressemble-t-il à ce que je fais aujourd'hui ? »* |

**Clause de non-nouveauté, rattachée à C1.** Un item **cohérent avec un corpus déjà établi et déjà appliqué** ne déplace aucune décision : il la confirme. Il est **informatif**, même si le sujet est éminemment pratique. Ce qui compte n'est pas l'importance du thème, c'est le **déplacement**.

#### Trois exemples au-dessus du seuil

1. **ECR de non-infériorité, antibiothérapie courte vs longue dans l'infection urinaire simple de la femme en ambulatoire**, critère = échec clinique à 30 jours. C1 : la durée d'ordonnance change. C2 : critère patient, différence absolue bornée par la marge de non-infériorité, exprimée en %. C3 : population de ville, comparateur = la pratique actuelle. → **analyse**.
2. **Méta-analyse d'ECR de dépistage d'un cancer fréquent**, mortalité spécifique **et** toutes causes, avec effet absolu par tranche d'âge. C1 : l'indication et l'âge de début du dépistage sont des décisions hebdomadaires. C2 : critère dur, absolu chiffré. C3 : population générale. → **analyse**, même si la conclusion s'avère « pas de bénéfice sur la mortalité totale » — c'est justement ce résultat-là qui vaut d'être apprécié.
3. **Restriction d'usage ou retrait d'indication décidé par l'ANSM/l'EMA sur une molécule courante** (AINS, antidiabétique, psychotrope), sur signal de sécurité. C1 : la prescription change du jour au lendemain. C2 : événement indésirable = critère patient par construction. C3 : la mesure vise la population qui reçoit la molécule. → **analyse** (ici la grille porte sur la solidité du signal, pas sur un bénéfice).

#### Trois exemples en dessous — et le quatrième, le plus fréquent

1. **ECR d'un nouvel antidiabétique montrant −0,4 % d'HbA1c de plus que le comparateur, sans critère dur.** C1 oui (le choix de molécule est fréquent), **C2 non** : substitution seule. → **brève**. Le sujet est central, l'item ne l'est pas.
2. **Cohorte associant un médicament très prescrit à un cancer rare, HR 1,8 (IC 1,2–2,6).** C1 oui, **C2 non** : effet relatif fort sur un risque de base de l'ordre de 2/100 000 — l'excès absolu est de quelques cas par million de patients-années, et le design est observationnel. → **brève** (à re-signaler si une agence s'en saisit : ce serait alors l'exemple 3 ci-dessus).
3. **ECR positif d'une stratégie de prise en charge conduit en réanimation ou en centre expert, chez des patients sélectionnés.** C1 et C2 oui, **C3 non** : ni la population ni le comparateur n'existent en soins premiers. → **brève**.
4. **La confirmation** — quatrième méta-analyse concordante sur un bénéfice déjà recommandé, déjà appliqué, déjà encodé dans un nœud. Les trois conditions semblent vraies une par une ; la clause de non-nouveauté les annule : rien ne se déplace. → **brève**, en disant explicitement *« confirme, ne change rien »*, qui est une information utile au lecteur.

#### Règle de file d'attente

Le seuil dit ce qui **mérite** une analyse. Il ne dit pas ce que la semaine **peut** produire. Quand plus d'items le franchissent que la semaine ne peut en absorber :

- On **reporte**, on ne bâcle pas. L'item prend le statut `reporte` dans le journal de screening (§10), **avec la date de report** ; il est réexaminé la semaine suivante avec les nouveaux candidats.
- **Une demi-analyse ne se publie jamais.** Ni grille partielle, ni appréciation critique rédigée sans vérification bi-agents, ni « analyse » qui serait en fait une brève déguisée. Un item est traité entièrement ou reporté.
- **Ordre de priorité** : (1) items `concerne_decision` — ils bloquent la mise à jour d'un nœud ; (2) à défaut, l'item dont l'effet absolu est le plus grand sur la décision la plus fréquente ; (3) à égalité, l'item **déjà reporté une fois** — sans quoi un item reporté ne sort jamais de la file.
- **Deux reports maximum.** Au troisième passage, l'item est soit analysé, soit reclassé en brève avec le motif écrit au journal. Un report indéfini est une exclusion qui n'ose pas dire son nom.
- Les items reportés sont visibles dans le journal de la semaine : **la file d'attente est publique**, comme le reste du screening.

**Calibration du seuil.** Si, semaine après semaine, une large part des candidats franchit le seuil — l'ordre de grandeur attendu sur 9 thèmes MG est de quelques candidats retenus pour une à deux analyses —, **c'est le seuil qui est mal réglé, pas la semaine qui est exceptionnelle**. Le constat est porté au bilan et le seuil est resserré en revue de SOP (§11), jamais compensé en silence par des analyses écourtées.

---

## 7. Vérification bi-agents

Pour **tout item en route `analyse`** (§5bis) — donc pour tout item susceptible d'être classé à impact pratique : **Claude Code (Opus) orchestre deux agents indépendants puis réconcilie** (détail : brief décision §13bis). Les brèves en sont dispensées : elles ne portent aucune appréciation critique à vérifier.
- **Agent A (Analyste/Extracteur)** vs **Agent B (Contradicteur/Red-team)** ; contextes séparés ; hétérogénéité de modèle si possible.
- Ancrage sur la **source primaire** (accord ≠ vérité).
- Réconciliation → rapport : consensus vérifié / divergences à escalader / non-vérifiable.
- Escalade humaine obligatoire ; journalisation des deux analyses + réconciliation.

---

## 8. Droit d'auteur & accès

- **Résumé critique + lien** vers la source ; **jamais** de reproduction du texte intégral (Prescrire, journaux).
- **Pas de contournement de paywall** : on exploite abstract / open access / communiqués ; le référent complète s'il a un accès légitime.

---

## 9. Garde-fous de fiabilité

- Ne pas sur-réagir à une **étude isolée** ; la replacer dans la totalité des preuves.
- **Remonter à la source primaire** (jamais communiqué / réseau social).
- Lire **résultats absolus** et critères **pré-enregistrés** (déjouer le spin et les critères changés en cours de route).
- Éviter « absence de preuve = preuve d'absence » et la surinterprétation de l'observationnel.
- **Rétractations / errata** : vérifier (Retraction Watch, alertes revue) avant toute intégration, surtout si l'item modifie un algorithme.
- **Vérifier chaque sortie IA** (DOI réel, chiffres exacts).

---

## 10. Traçabilité, archivage & corrections

- **Journal de screening** hebdomadaire conservé — c'est un **livrable au même titre que les entrées** : c'est lui qui distingue cette veille d'un fil de liens, et il est publié.
- **Archivage** des semaines passées (consultables/filtrables). Une semaine archivée sous `docs/veille/semaines/AAAA-Www/` contient : `moisson.md` (candidats bruts), `screening.md` (le journal, une ligne par candidat) et `entrees/` (les entrées publiées). Gabarits versionnés sous `docs/veille/semaines/_gabarit/`.
- **Changelog** des impacts sur les algorithmes (lien veille → nœud).
- **Corrections** : erratum daté si un item publié est corrigé/rétracté en amont ; boucle de retour utilisateurs.

---

## 11. Gestion documentaire de la SOP

- SOP **versionnée** (git) ; toute modification = nouvelle version + note de changement.
- Revue au moins **annuelle** ou dès qu'un incident/retour le justifie.
- **À vérifier** : statut de dispositif médical (règlement UE 2017/745) pour le volet couplé aux algorithmes.

### Notes de changement

**v1.1 — 2026-07-31** · *Alignement sur les moyens réels, avant publication de la SOP dans l'application.* Trois promesses de la v1.0 supposaient des ressources humaines qui n'existent pas encore ; publier une procédure qu'on ne suit pas serait contraire au principe de transparence que le projet applique partout ailleurs.

| § | Changement | Décision |
|---|---|---|
| en-tête | Statut « à valider par le comité éditorial » → **en vigueur, validée par le référent veille** ; ajout du principe « la SOP décrit ce qui est réellement fait ». | — |
| §2 | Table des rôles refaite : **un référent unique** déclaré comme état réel ; référents de profession, relecteur et comité éditorial marqués **cible**. Limite du dispositif (angle mort partagé) explicitée. | D39, D40 |
| §3 | Titre → « Cadence & convention de semaine ». **Jour fixé au lundi**, `date_semaine` = semaine ISO du lundi, fenêtre = 7 jours précédents, première édition `2026-W32`. Statut hors cycle des éditions de cadrage `2026-W30`/`2026-W31`. | D41 |
| §3bis | **Nouveau.** Périmètre de production = **9 thèmes MG** ; les 4 autres thèmes restent au modèle de données sans production. | D40, D43 |
| §4 | « Annexe versionnée » (inexistante) → pointeur vers **`docs/veille/SOURCES.md`**. Ajout de la **règle de balayage** : Tier 1-2 en routine, Tier 3-4 seulement pour vérifier un signal déjà repéré ; délai assumé sur les études primaires. | — |
| §5 étapes 1-2 | Collecte bornée aux Tier 1-2 + traces des sources sans nouveauté ; screening = seuil §6bis + décision de **route**. Journal rempli **pendant** le tri. | D38 |
| §5 étape 5 | « Double validation par un second contributeur » → **vérification bi-agents + relecture différée à J+3 par le même référent**, avec mention explicite que ce n'est **pas** une double lecture indépendante et pourquoi. | **D39** |
| §5 étape 7 | Ajout : tant que le comité éditorial n'existe pas, aucune modification d'algorithme n'est appliquée (`proposition_maj: candidate`). | — |
| §5bis | **Nouveau.** Deux **routes de production** (brève / analyse), règle `analyse ⊇ pratique`, brève ⟹ `informatif`, et « une semaine peut ne rien contenir de pratique ». | **D38** |
| §6bis | **Nouveau.** **Seuil de classement « potentiellement à impact pratique »** : trois conditions cumulatives, trois exemples au-dessus et quatre en dessous, **règle de file d'attente** (report daté, jamais de demi-analyse) et clause de calibration. | — |
| §10 | Journal de screening qualifié de **livrable publié** ; arborescence d'archive d'une semaine explicitée. | — |

**v1.0 — 2026-07-22** · Version initiale (rédigée avec le brief de veille).
