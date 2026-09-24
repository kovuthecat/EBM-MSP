# A12 — Rapport Agent A (analyste/extracteur)

**Circuit** : §7bis tri-agents (thème `sante-femme-perinatalite`) — ce rapport ne couvre que
l'étape 1, côté Agent A. Réconciliation par un Agent C à faire séparément.
**Statut** : terminé côté Agent A — rédigé au fil de l'eau. Source primaire identifiée (§2), fausse
piste du premier passage écartée et documentée, grille remplie (§3), classement proposé (§4).

---

## 0. Rappel de la mission et de la doctrine

- Identifier la source primaire de l'item A12 (presse : étude italienne, diénogest seul vs
  diénogest + œstrogène, dysménorrhée de l'endométriose) — ou déclarer l'échec plutôt que
  d'inventer une correspondance.
- `route` et `niveau_impact` sont des champs **distincts** : une conclusion `informatif` est un
  résultat valide, pas un échec de la vérification.
- Aucune requête OpenEvidence pour ce travail (contrainte de la mission).
- Aucun relecteur du domaine (santé-femme-périnatalité) ne validera derrière ce circuit tri-agents :
  rigueur maximale exigée, et légitimité à conclure « non publiable en l'état » si besoin.

## 1. Piste de repérage (premier passage, non confirmée)

D'après `epreuve/entrees/reperage-A12.md` :

> Étude italienne, cohorte prospective (probable Maiorana et al. ou équivalent, *Medicine* 2024,
> pubmed 38968535). Diénogest seul > diénogest+œstrogène sur la dysménorrhée (chiffres presse :
> -2,63 vs -2,04). C1 o · C2 o · C3 o mais design cohorte, pas RCT.

Cette piste est explicitement non confirmée — à vérifier avant tout usage.

## 2. Identification de la source primaire

**Outils utilisés** : `WebSearch` / `WebFetch` uniquement. Les connecteurs PubMed MCP
(`get_article_metadata`, `search_articles`, etc.) étaient listés comme disponibles mais **refusés
par la politique de permission de la session** (« don't ask mode ») à chaque tentative — signalé
ici pour traçabilité, pas contourné. Aucune requête OpenEvidence (contrainte de la mission).

### 2.1 La piste PMID 38968535 est une fausse piste — piège de confusion confirmé

Vérification directe (WebSearch + WebFetch sur `pubmed.ncbi.nlm.nih.gov/38968535` puis sur le PMC
associé, PMC11224878) :

- Titre réel : *« Comparison of dienogest or combinations with ethinylestradiol/estradiol valerate
  on the pain score of women with endometriosis: A prospective cohort study »*.
- Auteurs/affiliations : **Aslihan Yurtkal (Kafkas University, Kars, Turquie)** et Mahmut Oncul
  (Istanbul University-Cerrahpaşa, Turquie) — **étude turque, pas italienne.**
- Revue *Medicine (Baltimore)*, 2024, DOI 10.1097/MD.0000000000038585.
- Design : cohorte prospective, **3 bras** (Visanne = DNG seul 2 mg ; Dienille = DNG+éthinylestradiol ;
  Qlarista = DNG+estradiol valérate), n=20/bras.
- Résultat central (Table 3, cité par le fetch) : à 6 mois, scores VAS moyens Visanne 3300±2003,
  Dienille 4000±2575, Qlarista 4600±2761, **p=.257 — aucune différence significative entre les 3
  groupes**. (Chiffres transmis avec une échelle suspecte — `3300` au lieu d'un score VAS attendu
  sur 0-10 ou 0-100 — possible artefact d'extraction du tableau par l'outil de résumé ; à corriger
  si cette étude devait être réutilisée, mais **sans conséquence ici puisque cette étude n'est pas
  la source retenue**, voir 2.2.)

**Conclusion sur cette piste : à écarter.** Ni le pays (Turquie ≠ Italie), ni le résultat (pas de
différence significative entre bras, contredit la « supériorité » relayée par la presse), ni les
chiffres (aucune trace de -2,63/-2,04) ne correspondent à l'item de presse. C'est exactement le
piège de confusion que `recherche-source-primaire` signale (deux études proches du même sujet,
même année de publication, mauvaise correspondance forcée au premier passage).

### 2.2 Source primaire identifiée et confirmée par les chiffres exacts

**Del Forno S, Orsini B, Verrelli L, Aru AC, Raimondo D, Arena A, Caroli M, Paradisi R, Lenzi J,
Meriggiola MC, Seracchioli R, Casadio P.** *« Dienogest alone or dienogest combined with estrogens
in the treatment of ovarian endometriomas, that is the question. A retrospective cohort study »*.
**Archives of Gynecology and Obstetrics**, **2023** (pas 2024). **PMID 37433947**, DOI
10.1007/s00404-023-07125-2, PMC10435622.

**Correspondance vérifiée avec les chiffres de presse**, citation **verbatim** obtenue par un second
passage `WebFetch` ciblé sur PMC10435622, section *« Effects on symptoms »* (Results) :

> « the reduction of the dysmenorrhea was more significative in D group (**− 2.63 vs − 2.04** in
> D + EE/EV groups) »

Et Table 2, ligne « Dysmenorrhea » (citation verbatim) :

> « Dysmenorrhea: Dienogest + EE/EV Mean (95% CI) **− 2.04***** (− 2.71, − 1.38); Dienogest Alone
> Mean (95% CI) **− 2.63***** (− 3.29, − 1.96); Δ 0.59; Adj. Δ 0.77** »

Correspondance exacte des deux chiffres (-2,63 et -2,04) à l'item de presse, affiliation
**italienne confirmée** (IRCCS Azienda Ospedaliero-Universitaria di Bologna + Univ. Modena et
Reggio Emilia + Univ. Bologna), et thématique identique (diénogest seul vs diénogest+œstrogène,
dysménorrhée, endométriose). **C'est la source primaire retenue pour la suite de la grille.**

> **Limite de méthode à signaler honnêtement** : les citations ci-dessus proviennent de deux passages
> `WebFetch` (modèle de résumé tiers, pas une lecture directe du HTML/PDF brut par l'agent), faute
> d'accès aux outils PubMed MCP dans cette session. La citation verbatim du second passage réduit le
> risque par rapport à un simple résumé, mais reste **`NON VÉRIFIÉ (partiel)`** au sens strict de la
> discipline de citation — un accès direct au texte (PMC, HTML brut) permettrait de lever ce doute
> entièrement. Recommandation : si cet item passe en écriture d'entrée, faire relire au moins une
> fois de plus les chiffres de la Table 2 avec un outil de lecture directe avant publication.

---

## 3. Grille d'appréciation (`docs/veille/GRILLE_APPRECIATION.md`)

### 1. Identification

| Champ | Réponse |
|---|---|
| Titre | Dienogest alone or dienogest combined with estrogens in the treatment of ovarian endometriomas, that is the question. A retrospective cohort study |
| Source (revue/site) | Archives of Gynecology and Obstetrics |
| DOI / lien | 10.1007/s00404-023-07125-2 · PMID 37433947 · PMC10435622 |
| Année | 2023 |
| Type de publication | **Cohorte rétrospective** (mono-centrique, IRCCS Bologne) |
| Financement & conflits d'intérêt | Pas de financement industriel identifié ; publication couverte par l'accord CRUI-CARE (Univ. Bologne, frais de publication en open access). « The authors declare that they have no conflict of interest » (section Funding/COI). Signal positif (pas de biais de financement pharma détecté), mais source = passage `WebFetch`, pas lecture directe. |
| Registre / protocole pré-enregistré ? | **Non** — étude rétrospective, pas de pré-enregistrement. Approbation du comité d'éthique de Bologne (n°149/2014/O/Oss), conforme Déclaration d'Helsinki — ce n'est pas un enregistrement de protocole d'analyse. |

### 2. Question (PICO)

- **P** : femmes 18-50 ans (âge moyen 33,6 ± 7,9 ans) avec endométriome ovarien, suivies au moins 12 mois sous traitement médical continu (n=297 au total).
- **I** : diénogest 2 mg/j **seul**.
- **C** : diénogest 2 mg/j **+ œstrogène** (éthinylestradiol 0,03 mg ou estradiol valérate 1-3 mg, formulations cycliques ou continues) — pas de bras placebo/sans traitement.
- **O** : dysménorrhée, dysurie, dyspareunie, douleur pelvienne chronique, dyschésie (NRS 0-10) ; variation du diamètre de l'endométriome (mm) — mesurés à V1 (baseline), V2 (6 mois), V3 (12 mois).
- Population ≈ patientèle MSP ? **Partiellement** — dysménorrhée/endométriose est un motif de consultation en soins premiers, mais le suivi (imagerie, ajustement thérapeutique fin) est typiquement partagé avec la gynécologie ; prescription initiale et renouvellement peuvent relever du MG/de la sage-femme.

### 3. Risque de biais — observationnel (cohorte rétrospective)

- [ ] Facteurs de confusion identifiés et **ajustés** — **partiellement**. Le modèle de régression linéaire inclut les scores de baseline (douleur, taille du kyste) comme covariables continues, mais **pas explicitement l'âge ni la présence de nodules postérieurs**, alors que ces deux variables diffèrent significativement entre groupes à l'inclusion (Tableau 1 : âge p<0,001, diamètre du kyste p<0,001, nodules postérieurs p=0,033 — le groupe D+EE est notamment plus jeune, 28,9 ± 6,6 ans vs 33,6 ans en moyenne globale).
- [ ] Causalité inverse envisagée — non documentée dans ce qui a été récupéré ; peu probable ici vu le design (traitement précède la mesure de suivi).
- [ ] Groupes comparables à l'inclusion — **non** : déséquilibres significatifs (âge, taille du kyste, nodules), reconnus par les auteurs eux-mêmes en limites.
- [x] Signalé : **niveau de preuve d'emblée plus faible** (cohorte rétrospective, association, pas d'essai randomisé).

**Autres signaux de risque de biais** :
- Pas de groupe contrôle sans traitement (limite reconnue explicitement par les auteurs : « retrospective nature and the absence of a control group »).
- Pas de confirmation histologique systématique de l'endométriose (limite reconnue par les auteurs).
- **Comparaisons multiples non corrigées** : au moins 4 comparaisons pairées rapportées sur la dysménorrhée (D vs D+EE/EV cyclique, D vs D+EE/EV continu, D+EV vs D+EE, cyclique vs continu) sans mention de correction pour tests multiples — augmente le risque de faux positif sur un résultat isolé.
- Effectifs non documentés à chaque visite de suivi (perdus de vue à V2/V3 non chiffrés dans ce qui a été récupéré) — biais d'attrition non quantifiable en l'état.

**Synthèse risque de biais : élevé.** Justification : cohorte rétrospective mono-centrique, groupes non comparables à l'inclusion sur plusieurs caractéristiques cliniquement pertinentes, ajustement statistique partiel (covariables de baseline seulement), absence de groupe contrôle, comparaisons multiples non corrigées.

### 4. Critère de jugement

- Critère principal (pour cet item) : **dysménorrhée**, mesurée par NRS (0-10), variation V1→V3 (12 mois).
- **Substitution** (auto-questionnaire de douleur, pas un critère « dur ») — pertinent pour la patiente (qualité de vie, symptôme invalidant), mais reste une mesure subjective non aveugle (rétrospectif : ni patientes ni évaluateurs aveugles au traitement reçu).
- Composite ? Non — dysménorrhée rapportée séparément des autres symptômes (dysurie, dyspareunie…).
- Pertinent pour la patiente ? **Oui.**

> Vigilance : amélioration mesurée en ouvert (non aveugle), sur un critère auto-rapporté — majore le risque de biais de mesure/rapport en défaveur du bras jugé a priori « standard » (add-back œstrogénique), qui n'est pas neutralisable ici.

### 5. Résultats & taille d'effet

| Élément | Valeur |
|---|---|
| Effet **relatif** | Non applicable directement (pas de RR/HR/OR — comparaison de deltas de scores NRS entre deux cohortes traitées) |
| Effet **absolu** (différence de réduction NRS, V1→V3, Table 2) | D seul : **-2,63** (IC95% -3,29 ; -1,96) · D+EE/EV : **-2,04** (IC95% -2,71 ; -1,38) · Δ brut 0,59 · **Δ ajusté 0,77** (p≤0,01) |
| **NNT/NNH** | Non calculable à partir des données rapportées (scores continus, pas de seuil de réponse dichotomisé publié) |
| Significativité (p) et précision (largeur IC) | p≤0,01 sur le Δ ajusté ; IC assez larges (~1,3 à 1,4 point sur une échelle 0-10) — précision modeste |
| Cohérence sous-groupes/sensibilité | Analyse de sensibilité en continu (Supplément S1) : D seul -2,63 vs D+EE/EV continu -1,73, Δ ajusté 0,96 (p≤0,05) — **même sens, cohérent** |

> Effet absolu modeste en valeur clinique (≈0,6-0,8 point d'écart sur une échelle NRS 0-10) même si statistiquement significatif — à ne pas présenter comme un écart majeur.

### 6. Validité externe & applicabilité

- Transposable à la patientèle MSP ? **Partiellement** — femmes en âge de procréer suivies pour endométriome ovarien ; la prescription initiale de diénogest en 1ʳᵉ intention pour la dysménorrhée liée à l'endométriose est déjà une pratique courante et recommandée indépendamment de cette étude (cf. `Prescrire`, HAS) ; ce résultat concerne surtout le choix de **rajouter ou non un œstrogène** (add-back), décision généralement partagée avec/prise par la gynécologie.
- Comparateur réaliste en soins premiers ? Oui, les deux bras sont des pratiques réellement utilisées.
- Durée de suivi suffisante ? 12 mois — raisonnable pour ce symptôme, mais pas de données à plus long terme dans cette étude.

### 7. Cohérence & esprit critique

- Cohérent avec la totalité des preuves antérieures ? **Partiellement documenté** — la littérature existante montre plutôt une efficacité comparable entre diénogest seul et diénogest+add-back sur la douleur globale (cf. par ex. la piste écartée PMID 38968535, qui ne trouve **aucune** différence significative entre 3 bras similaires, à p=.257) ; l'étude retenue ici est donc **relativement isolée** sur la significativité de cet écart spécifique à la dysménorrhée — élément de prudence à ne pas passer sous silence.
- **Spin détecté** : la phrase de conclusion des auteurs (« benefit more from progestin-only therapy ») est correcte sur le sens du résultat, mais le relais presse en formule de supériorité binaire simple gomme trois nuances importantes : (1) design rétrospectif à risque de biais élevé, pas un ECR ; (2) groupes déséquilibrés à l'inclusion ; (3) absence de correction pour comparaisons multiples. Aucun signe de spin dans l'article source lui-même (les auteurs listent honnêtement leurs limites) — le risque de spin est **en aval, dans le relais de presse**, pas dans la publication.
- Signaux d'alerte : pas d'arrêt précoce, pas de financement industriel détecté, pas de changement de critère principal identifié ; en revanche, comparaisons multiples non corrigées (déjà signalé) et groupes déséquilibrés à relever explicitement dans toute rédaction.

### 8. Niveau de preuve (GRADE simplifié)

**☒ Faible**

Justification : cohorte rétrospective (point de départ GRADE bas pour l'observationnel) + risque de biais élevé (groupes non comparables, ajustement partiel, pas de groupe contrôle, comparaisons multiples non corrigées) + critère substitutif auto-rapporté non aveugle + résultat relativement isolé par rapport au reste de la littérature disponible (cf. §7). Pas rétrogradé jusqu'à « très faible » car : cohérence interne (résultat confirmé par l'analyse de sensibilité en continu), taille d'échantillon correcte (n=297), IC qui n'incluent pas 0, et effet plausible sur le plan pharmacologique (l'ajout d'œstrogène peut théoriquement contrebalancer partiellement l'effet anti-prolifératif/anti-inflammatoire du progestatif seul sur l'endomètre ectopique).

### 9. Classement pour l'outil

| Champ | Valeur |
|---|---|
| Thème(s) | `sante-femme-perinatalite` |
| Profession(s) concernée(s) | Médecins généralistes, gynécologues, sages-femmes (prescription/renouvellement diénogest ± add-back œstrogénique) |
| **Niveau d'impact** | **informatif** *(proposition Agent A — à confirmer par Agent C)* |
| Pertinence pratique | modérée |
| Temps de lecture estimé (min) | 4-5 |
| Impacte un algorithme ? | **non** — aucun nœud de décision existant ne couvre ce sujet (DT2 = seul domaine de décision actif à ce jour, `CLAUDE.md` invariant 5) |

**Justification `niveau_impact: informatif` plutôt que `pratique`** : le diénogest seul est déjà la
première intention usuelle pour la dysménorrhée liée à l'endométriose indépendamment de cette
étude ; le résultat nuance surtout la décision secondaire d'ajouter un œstrogène (add-back, souvent
motivé par la tolérance/le profil de saignement, pas par l'efficacité sur la douleur) — et le fait
sur la base d'une preuve de niveau faible, isolée, à confirmer. Ce n'est pas un signal suffisant
pour recommander un changement de conduite immédiat.

### 10. Message pour la pratique (proposition, 2-3 lignes)

Dans une cohorte rétrospective italienne (n=297, biais de sélection et groupes déséquilibrés à
l'inclusion), la réduction de la dysménorrhée à 12 mois était un peu plus marquée sous diénogest
seul que sous diénogest+œstrogène (-2,63 vs -2,04 sur une échelle de douleur 0-10 ; écart ajusté
0,77 point, p≤0,01) — sans que cela remette en cause le diénogest seul comme option de 1ʳᵉ
intention déjà établie. Preuve de niveau **faible** : à ne pas présenter comme motif de changer une
association œstrogénique déjà en place pour un autre motif (tolérance, saignements) sans avis
spécialisé.

---

## 4. Proposition de classement complet (synthèse, à trancher par Agent C)

| Champ | Proposition Agent A |
|---|---|
| `route` | **analyse** (pas `brève`) — le sujet exige de restituer les nuances méthodologiques (rétrospectif, groupes déséquilibrés, comparaisons multiples) sous peine de reproduire le raccourci du relais de presse ; **pas non plus `reporte`**, la source primaire est identifiée et accessible (WebFetch/PMC), aucun blocage d'accès. |
| `niveau_impact` | **informatif** |
| `niveau_preuve` | **Faible** (GRADE simplifié) |
| `themes[]` | `sante-femme-perinatalite` |
| `professions_concernees[]` | médecins généralistes, gynécologues, sages-femmes |
| `concerne_decision` | **non** (aucun nœud DT2 concerné, seul domaine de décision actif) |
| `meta.relecture_referent` | **false** — circuit §7bis, bandeau visible obligatoire (thème `sante-femme-perinatalite`), décision finale à un Agent C tiers, pas au référent |

### Conditions de rédaction opposables (proposition)

- **Toujours nommer le design** (cohorte rétrospective, pas ECR) dans le corps de l'entrée, pas
  seulement en métadonnée.
- **Ne jamais reprendre** une formulation de supériorité non qualifiée type « le diénogest seul est
  plus efficace » sans mentionner le niveau de preuve faible et le déséquilibre des groupes à
  l'inclusion.
- **Ne pas présenter** ce résultat comme justifiant un changement de conduite pour les patientes
  déjà sous diénogest+œstrogène pour un autre motif (tolérance) — l'étude ne compare pas cet
  arbitrage.
- **Signaler explicitement** la fausse piste écartée (PMID 38968535, étude turque à 3 bras, aucune
  différence significative) si l'entrée mentionne des travaux comparables, pour ne pas laisser
  penser que la littérature est unanime.

## 5. Ce que cette vérification ne garantit pas (angle mort de l'Agent A seul)

- Un seul agent a travaillé sur cette source : aucun red-team indépendant n'a encore contesté cette
  lecture (Agent B en cours, en parallèle, contexte isolé — non vu ici par construction).
- L'extraction des chiffres s'appuie sur `WebFetch` (modèle de résumé tiers), pas sur une lecture
  directe du PDF/HTML par l'agent lui-même, faute d'accès aux outils PubMed MCP dans cette session
  (refusés par la politique de permission) — cf. §2.2, limite déjà signalée avec citation verbatim
  en atténuation partielle.
- Les effectifs par visite de suivi (perdus de vue V2/V3) n'ont pas pu être confirmés avec les
  outils disponibles — le biais d'attrition reste non quantifié.
- Aucun relecteur du domaine (santé-femme-périnatalité) ne validera ce circuit tri-agents derrière
  Agent C — la rigueur de cette vérification est la seule garantie avant publication.

---

**Statut final de ce rapport : complet côté Agent A.** Source primaire identifiée et distinguée
d'une fausse piste ; grille remplie avec chiffres localisés (Table 2 + section Results, citations
verbatim) ; classement complet proposé, en attente de réconciliation par Agent C avec le rapport de
l'Agent B.

