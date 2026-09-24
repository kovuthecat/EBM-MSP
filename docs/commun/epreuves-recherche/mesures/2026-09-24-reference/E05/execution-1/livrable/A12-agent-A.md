# Item A12 — Rapport Agent A (analyste/extracteur)

**Circuit :** §7bis tri-agents (thème `sante-femme-perinatalite`, hors compétence du référent — SOP_veille.md §3bis/§7bis).
**Rôle dans cette séance :** Agent A uniquement. L'Agent B travaille en parallèle, en contexte isolé, sur un autre fil — ce rapport ne contient aucun élément de son travail et n'a pas connaissance de ses conclusions.
**Consigne reçue :** aucune requête OpenEvidence autorisée pour ce travail.
**Statut de rédaction :** terminé — rédigé au fil de l'eau, section par section.

---

## 0. Repérage de départ (rappel, non vérifié)

Ligne de repérage (`epreuve/entrees/reperage-A12.md`, premier passage) :

> Étude italienne, cohorte prospective (probable Maiorana et al. ou équivalent, *Medicine* 2024, PMID 38968535) — Diénogest seul > diénogest+œstrogène sur la dysménorrhée (chiffres presse : -2,63 vs -2,04). C1 o · C2 o · C3 o mais design cohorte, pas RCT. Verdict provisoire : brève ou analyse à niveau de preuve faible, selon lecture complète.

Ce repérage est explicitement marqué **non vérifié** par le document source lui-même. Mission de cette étape : confirmer ou infirmer l'identité de la source primaire avant toute appréciation.

---

## 1. Identification de la source primaire

### 1.1 Résultat : le repérage de premier passage désigne le **mauvais article**

Le repérage citait « probable Maiorana et al., *Medicine*, 2024, PMID 38968535 ». Vérification
(NCBI PubMed E-utilities, `esearch`/`efetch`, accès direct) :

- **PMID 38968535** existe bien, mais ce n'est pas l'étude visée : Yurtkal A. et al., *Medicine
  (Baltimore)* 2024, « Comparison of dienogest or combinations with ethinylestradiol/estradiol
  valerate on the pain score of women with endometriosis: A prospective cohort study » —
  affiliations **turques** (Kafkas University, Kars ; Istanbul University-Cerrahpaşa), **pas
  italiennes**, et aucun auteur « Maiorana ». Design proche par le sujet (dienogest seul vs
  associations œstrogéniques) mais **ce n'est pas la bonne publication** — piège de confusion
  entre deux études voisines du même champ, explicitement signalé comme un risque connu par le
  skill `recherche-source-primaire`.
- Recherche croisée (WebSearch, requêtes en français et anglais ciblant les chiffres de presse
  « -2,63 vs -2,04 ») → convergence sur une **autre** publication, italienne celle-là :

  > **Del Forno S, Orsini B, Verrelli L, Caroli M, Aru AC, Lenzi J, Raimondo D, Arena A, Borghese
  > G, Paradisi R, Meriggiola MC, Seracchioli R, Casadio P.** « Dienogest alone or dienogest
  > combined with estrogens in the treatment of ovarian endometriomas, that is the question. A
  > retrospective cohort study. » ***Archives of Gynecology and Obstetrics***, 2023 ; 308(4) :
  > 1341-1349. DOI : **10.1007/s00404-023-07125-2**. PMID **37433947**. PMCID **PMC10435622**.

  Identité **confirmée directement via NCBI E-utilities** (`esearch` puis `efetch` sur
  `eutils.ncbi.nlm.nih.gov`, interrogation de l'API PubMed elle-même, pas d'un relais) : titre,
  auteurs, revue, année, volume/pages, DOI et PMID obtenus de cette façon. Affiliation
  correspondante : **Alma Mater Studiorum – Università di Bologna** (financement de l'accès
  ouvert cité dans la notice) — c'est bien l'étude **italienne**.

- **Les chiffres de presse (-2,63 vs -2,04) sont exacts et appartiennent bien à cette étude** — ils
  sont retrouvés au Tableau 2 du texte intégral (voir §5) — mais le repérage les avait accrochés
  à la mauvaise référence bibliographique (mauvais auteurs, mauvaise revue, mauvaise année, mauvais
  PMID, et un design inexact — voir 1.2). C'est le chiffre qui était juste, pas la source à
  laquelle le premier passage l'avait rattaché.

**Conclusion identification : source primaire trouvée, mais différente de celle indiquée au
repérage.** Aucune déclaration d'échec n'est nécessaire — mais le repérage doit être corrigé, pas
seulement complété, avant toute rédaction d'entrée.

### 1.2 Fiche d'identification

| Champ | Réponse |
|---|---|
| Titre | Dienogest alone or dienogest combined with estrogens in the treatment of ovarian endometriomas, that is the question. A retrospective cohort study. |
| Auteurs | Del Forno S, Orsini B, Verrelli L, Caroli M, Aru AC, Lenzi J, Raimondo D, Arena A, Borghese G, Paradisi R, Meriggiola MC, Seracchioli R, Casadio P |
| Source (revue) | Archives of Gynecology and Obstetrics |
| DOI | 10.1007/s00404-023-07125-2 |
| PMID / PMCID | 37433947 / PMC10435622 |
| Année | 2023 (308(4):1341-1349) |
| Type de publication | **Cohorte rétrospective**, monocentrique — **pas** une cohorte prospective comme le supposait le repérage |
| Financement | Frais de publication en accès ouvert pris en charge par accord CRUI-CARE (Università di Bologna) ; **aucun financement industriel identifié** |
| Conflits d'intérêt | Déclaration explicite : « The authors declare that they have no conflict of interest » (texte intégral, section COI) |
| Registre / protocole pré-enregistré ? | **Non mentionné** dans le texte intégral extrait — pas de référence à un enregistrement prospectif (cohérent avec le caractère rétrospectif) |

**Méthode d'accès à la source** : article accessible en texte intégral via **PubMed Central**
(PMC10435622, financement open access déclaré) — texte intégral interrogé directement via l'API
NCBI E-utilities (`efetch`, `db=pmc`, `retmode=xml`), pas de contournement de paywall, pas
d'usage d'OpenEvidence (interdit pour ce travail). L'accès direct au rendu web PubMed/PMC
(`pubmed.ncbi.nlm.nih.gov`, `pmc.ncbi.nlm.nih.gov`) a échoué à plusieurs reprises (mur de cookies
côté PubMed, reCAPTCHA anti-bot côté PMC) ; l'API E-utilities a contourné ce blocage **outil**,
pas un blocage d'accès — l'article est en accès ouvert légitime, confirmé par le financement
CRUI-CARE et sa présence en PMC.

---

## 2. Question (PICO)

- **P** (population) : 297 femmes en âge de procréer (18-50 ans), adressées à un centre italien
  de référence (Bologne) entre janvier 2017 et juin 2021, avec endométriome ovarien confirmé à
  l'échographie (> 10 mm, ± endométriose infiltrante profonde ou adénomyose associée) et **au
  moins un symptôme douloureux** (dysménorrhée, douleur pelvienne chronique ou dyspareunie,
  NRS > 0). Critères d'exclusion : ménopause, grossesse en cours ou désir de grossesse actuel,
  traitement médical dans les 3 mois précédant l'inclusion.
- **I** (intervention) : diénogest 2 mg seul (groupe **D**, n = 156), pendant ≥ 12 mois.
- **C** (comparateur) : diénogest 2 mg + éthinylestradiol 0,03 mg (groupe **D+EE**, n = 58) ou
  diénogest 2 mg + valérate d'estradiol 1-3 mg (groupe **D+EV**, n = 83), pendant ≥ 12 mois.
  **Pas de bras sans traitement / placebo.**
- **O** (critères de jugement) : variation du diamètre moyen de l'endométriome (mm), variation du
  score de dysménorrhée, de douleur pelvienne chronique et de dysurie (NRS), entre l'inclusion
  (V1) et 12 mois (V3) ; tolérance (effets indésirables).
- Population ≈ patientèle MSP ? **Partiellement.** Population de **recours spécialisé** (centre
  de référence universitaire de l'endométriose), donc probablement plus sévère/sélectionnée que
  la patientèle de premiers recours ; en revanche le choix thérapeutique lui-même (diénogest seul
  vs associé à un œstrogène) est un geste de prescription que rencontrent MG et sage-femme en
  ville, notamment en renouvellement ou en orientation initiale.

---

## 3. Risque de biais (observationnel, cohorte rétrospective)

- Facteurs de confusion identifiés et ajustés : **partiellement.** L'analyse (régression linéaire,
  erreurs-types robustes à l'hétéroscédasticité) inclut le score/la taille **de base** comme
  covariable continue pour chaque critère de jugement — donc un ajustement sur la sévérité
  initiale du critère lui-même. **Aucune mention d'un ajustement sur l'âge**, alors que le
  Tableau 1 rapporte une **différence d'âge significative entre groupes** (voir plus bas) : c'est
  un facteur de confusion plausible et non contrôlé dans les résultats extraits.
- Causalité inverse : non pertinente ici (le traitement précède le critère de jugement par
  construction).
- **Groupes comparables à l'inclusion ? NON — c'est le point le plus important de ce dossier.**
  Le Tableau 1 (texte intégral) rapporte :
  - Âge : **p < 0,001** — groupe D+EE nettement plus jeune (28,9 ans) que le groupe D seul
    (35,5 ans).
  - Taille de l'endométriome à l'inclusion : **p < 0,001** — groupe D+EV plus petit (18,7 mm) que
    groupe D seul (26,3 mm).
  - Présence d'un nodule postérieur : **p = 0,033** — plus fréquent dans le groupe D seul (46,2 %)
    que D+EV (28,9 %).

  Une étude **rétrospective, non randomisée**, où le choix du traitement (D seul vs association)
  n'est jamais expliqué dans les extraits obtenus, avec des groupes qui diffèrent significativement
  sur l'âge et la sévérité initiale de la maladie, est **structurellement exposée à un biais de
  confusion par indication** : les prescripteurs ont probablement choisi le schéma thérapeutique
  en fonction de caractéristiques de la patiente (âge, désir de contraception, sévérité), ce qui
  peut expliquer une partie de l'écart observé sur la dysménorrhée **indépendamment** d'un effet
  pharmacologique propre au diénogest seul.
- Signaler : **niveau de preuve d'emblée plus faible** (association ≠ causalité) — cohorte
  rétrospective monocentrique, sans bras contrôle sans traitement, groupes déséquilibrés à
  l'inclusion.

**Synthèse risque de biais : élevé.** Justification : absence de randomisation, absence de bras
contrôle, déséquilibre significatif et non ajusté (du moins dans les extraits obtenus) sur l'âge
entre les groupes comparés, recrutement monocentrique dans un centre de recours — combinaison qui
rend l'attribution causale de l'écart de dysménorrhée au schéma thérapeutique **fragile**.

---

## 4. Critère de jugement

- Critère principal analysé ici : **variation du score de dysménorrhée (NRS)** entre inclusion et
  12 mois.
- Dur ou substitution ? **Substitution/rapporté par la patiente** — la dysménorrhée est un
  symptôme, pas un critère « dur » au sens de la grille (mortalité, événement majeur), mais c'est
  un **critère pertinent pour la patiente** (douleur vécue), à ne pas confondre avec un marqueur
  purement biologique.
- Composite ? Non — dysménorrhée, dyspareunie/douleur pelvienne chronique et dysurie sont
  rapportées séparément (pas de composite).
- Pertinent pour la patiente ? **Oui.**

> Vigilance : un score de douleur auto-rapporté dans une étude **non aveugle** (traitement
> ouvertement connu de la patiente et du clinicien) est également sensible à un biais
> d'attente/de rapport, en particulier si le choix du schéma reflète déjà une préférence de la
> patiente ou du prescripteur.

---

## 5. Résultats & taille d'effet — chaque chiffre relié à sa localisation

Source de tous les chiffres ci-dessous : **Tableau 2** du texte intégral (PMC10435622), colonne
de variation V1→V3 (inclusion → 12 mois), obtenu par requête directe de l'XML texte intégral via
l'API NCBI E-utilities (`db=pmc`, PMC10435622).

| Élément | Groupe **D seul** (n=156) | Groupe **D+EE/D+EV** (n=58+83=141) |
|---|---|---|
| Variation dysménorrhée (NRS, V1→V3) | **-2,63** (IC95 % : -3,29 ; -1,96), p ≤ 0,001 | **-2,04** (IC95 % : -2,71 ; -1,38), p ≤ 0,001 |
| Différence ajustée entre groupes (dysménorrhée) | **Adj. Δ = 0,77**, p ≤ 0,01 (D seul associé à une baisse plus marquée) | — |
| Variation dysurie (NRS, V1→V3) | **+0,08** (IC95 % : -0,05 ; 0,21) — non significatif (IC traverse 0) | **-0,30** (IC95 % : -0,53 ; -0,07), p ≤ 0,01 |
| Différence ajustée entre groupes (dysurie) | **Adj. Δ = -0,23**, p ≤ 0,05 (association favorisée pour la dysurie) | — |

> **Correspondance avec les chiffres de presse** : les valeurs -2,63 (D seul) et -2,04 (association)
> reprises dans le repérage de premier passage **correspondent exactement** à ces deux chiffres du
> Tableau 2 — c'est la seule partie du repérage qui s'est avérée exacte, alors même que la
> référence bibliographique à laquelle ils étaient rattachés était erronée (§1.1).

- Effet **relatif** : non applicable directement (scores de variation, pas de RR/HR/OR rapportés
  pour ce critère dans les extraits obtenus).
- Effet **absolu** : variation moyenne de -2,63 vs -2,04 points sur une échelle NRS 0-10 (soit un
  écart ajusté de 0,77 point entre groupes) — un écart de moins d'un point sur une échelle à 11
  niveaux, à mettre en regard de la question « cet écart change-t-il quelque chose pour la
  patiente ? » plutôt que de sa seule significativité statistique.
- **NNT/NNH** : non calculable à partir des données obtenues (l'étude rapporte des scores continus
  de variation avec IC95 %, pas de proportion de répondeurs à un seuil clinique défini, ni de
  taux d'événement binaire).
- Significativité et précision : IC95 % rapportés pour chaque variation ; les IC des deux groupes
  se chevauchent largement (-3,29 ; -1,96 vs -2,71 ; -1,38) — la significativité de la
  **différence entre groupes** repose sur le modèle ajusté (Adj. Δ = 0,77, p ≤ 0,01), pas sur une
  simple comparaison des IC des deux variations prises isolément.
- Résultat cohérent en sous-groupes / sensibilité ? **Non évalué dans les extraits obtenus** — pas
  d'analyse de sensibilité rapportée dans les sections consultées.
- Tolérance : effets indésirables chez 16,2 % des patientes (toutes causes confondues) ; le plus
  fréquent est le saignement/spotting, **significativement plus fréquent dans le groupe D+EV**
  (texte intégral, section résultats/tolérance).
- Sur le diamètre de l'endométriome : réduction significative dans les trois groupes à 12 mois,
  **sans différence significative entre les trois groupes** (résumé PubMed, confirmé par
  `efetch`) — c'est-à-dire que l'avantage du diénogest seul, s'il existe, porte sur la
  dysménorrhée, **pas** sur la taille de la lésion.

> Toujours privilégier l'effet absolu : un écart ajusté de 0,77 point sur une échelle 0-10, dans
> une cohorte rétrospective aux groupes déséquilibrés, est un signal **modeste et fragile**, pas
> une démonstration de supériorité clinique nette du diénogest seul.

---

## 6. Validité externe & applicabilité

- Transposable à la patientèle MSP ? **Partiellement.** Recrutement dans un centre universitaire
  de référence pour l'endométriose (Bologne) — population probablement plus sévère/sélectionnée
  qu'en soins premiers ; la décision de schéma thérapeutique (diénogest seul vs associé) reste en
  revanche une décision que MG et sage-femme rencontrent, en initiation ou en suivi/renouvellement.
- Comparateur réaliste en soins premiers ? Oui pour les deux bras traités (diénogest seul,
  diénogest + œstrogène) — ce sont des schémas effectivement prescrits en France. **Absence de
  bras sans traitement** limite la portée de toute comparaison à « ne rien faire ».
- Durée de suivi suffisante ? 12 mois — raisonnable pour juger un effet symptomatique sur
  dysménorrhée liée à l'endométriose, insuffisant pour juger d'un effet sur l'évolution à long
  terme de la maladie ou la fertilité.

---

## 7. Cohérence & esprit critique

- Cohérent avec la totalité des preuves antérieures ? **Non évalué de façon systématique dans ce
  rapport** — une association seule (diénogest) freinant davantage la dysménorrhée qu'une
  association œstroprogestative n'est pas a priori surprenante pharmacologiquement (effet
  antigonadotrope et hypoestrogénique plus marqué du diénogest seul), mais ce rapport n'a pas
  cherché à situer ce résultat par rapport à d'autres cohortes/essais comparant les mêmes bras —
  tâche que le circuit attribue plutôt à l'Agent B (recherche complémentaire, confrontation à la
  totalité des preuves).
- **Spin détecté ?** Le repérage de premier passage (presse) contenait un **spin de source**, pas
  un spin d'abstract : les chiffres exacts ont été rattachés à un mauvais article, avec un mauvais
  design (« cohorte prospective » au lieu de rétrospective) et de mauvais auteurs — un lecteur qui
  se serait arrêté au repérage aurait cité une référence fausse. Dans l'article réellement
  identifié, le **résumé PubMed lui-même ne mentionne pas** les valeurs chiffrées exactes
  (-2,63/-2,04) ni le déséquilibre d'âge entre groupes — ces deux éléments ne sont visibles qu'en
  texte intégral (Tableaux 1 et 2). Un lecteur qui s'arrêterait à l'abstract manquerait le
  problème de comparabilité des groupes.
- Signaux d'alerte : **groupes non comparables à l'inclusion** (voir §3) est le signal principal
  ici ; pas de financement industriel identifié ; pas d'arrêt précoce (non applicable, cohorte
  rétrospective) ; pas de mention de changement de critère principal en cours d'étude dans les
  extraits obtenus.

---

## 8. Niveau de preuve (GRADE simplifié)

**□ Élevé · □ Modéré · ☑ Faible · (frontière avec Très faible)**

Justification : cohorte **rétrospective**, monocentrique, **sans bras contrôle sans traitement**,
**groupes significativement déséquilibrés à l'inclusion** sur l'âge et la sévérité (biais de
confusion par indication plausible et non clairement contrôlé sur l'âge dans les modèles
rapportés), critère rapporté par la patiente dans un contexte non aveugle, écart absolu modeste
(0,77 point sur 10) une fois ajusté. Le design et le déséquilibre des groupes pèsent plus que la
significativité statistique obtenue : je propose **Faible**, avec un risque réel de devoir
descendre à **Très faible** si l'Agent B ne retrouve pas de contrôle de l'âge dans le texte
intégral (point que je n'ai pas pu vérifier au-delà des extraits obtenus — voir §10).

---

## 9. Classement pour l'outil (proposition complète)

| Champ | Valeur proposée |
|---|---|
| Thème(s) | `sante-femme-perinatalite` |
| Profession(s) concernée(s) | sage-femme (prescription/suivi hormonal) ; médecin généraliste (prescription/renouvellement, orientation) |
| **Niveau d'impact** | **informatif** — pas **pratique** : l'écart observé est de faible ampleur, obtenu sur un design à risque de biais élevé et des groupes non comparables ; ne justifie pas, en l'état, de recommander de préférer systématiquement le diénogest seul pour la dysménorrhée |
| Pertinence pratique | **faible à modérée** — utile pour nuancer une pratique (« le diénogest seul pourrait mieux soulager la dysménorrhée, l'association mieux la dysurie »), mais pas assez solide pour changer une prescription |
| Temps de lecture estimé (min) | 5-6 |
| Impacte un algorithme ? | **non** — aucun nœud du module Décision ne porte sur l'endométriose/la dysménorrhée (le seul domaine actif est le DT2, `CLAUDE.md`) ; `concerne_decision: non` |
| `meta.relecture_referent` | **false** — obligatoire sur ce thème (§7bis), bandeau visible requis à la publication |

---

## 10. Message pour la pratique (proposition, à discuter en réconciliation)

Chez des femmes suivies pour endométriome ovarien, une cohorte rétrospective italienne (Del Forno
et al., 2023, n=297) observe une réduction de la dysménorrhée un peu plus marquée sous diénogest
seul que sous diénogest associé à un œstrogène (variation NRS -2,63 vs -2,04 ; écart ajusté 0,77
point), et inversement une meilleure réduction de la dysurie sous association. **Niveau de preuve
faible** : cohorte rétrospective sans bras contrôle, groupes significativement différents à
l'inclusion (notamment l'âge), effet absolu modeste une fois ajusté. Aucune réduction de la taille
de l'endométriome n'est différente entre les trois schémas. **Ne change pas la pratique en l'état**
— tout au plus un élément à mentionner en discussion partagée patiente/prescripteur entre les deux
schémas, pas une hiérarchie établie.

---

## 11. Ce que ce rapport ne garantit pas / limites

- **Angle mort de compétence (§7bis)** : rédigé par un référent/agent médecin généraliste, pas
  sage-femme ni gynécologue. Rien dans ce rapport n'a été validé par une compétence de fond en
  santé de la femme — c'est précisément l'objet du circuit tri-agents et de la mention
  `meta.relecture_referent: false` à la publication.
- **Extraction par outil d'IA (WebFetch) sur du texte intégral, pas lecture humaine du PDF/HTML
  original.** Les chiffres du §5 (Tableau 2) et du §3 (Tableau 1) ont été obtenus via l'API NCBI
  E-utilities puis résumés par un modèle de résumé automatique (outil `WebFetch`) plutôt que lus
  directement par moi sur le rendu visuel de l'article (bloqué par reCAPTCHA/mur de cookies à
  chaque tentative directe). Ce sont deux extractions convergentes obtenues à des requêtes
  séparées portant sur les mêmes cellules de tableau, ce qui réduit le risque d'erreur
  d'extraction isolée, mais **ne remplace pas** une relecture humaine du tableau original.
  **L'Agent B doit revérifier ces valeurs contre le texte intégral**, idéalement en tentant un
  accès direct (PDF Springer, ou nouvelle tentative PMC) plutôt que via un résumé automatique.
- **Contrôle de l'âge dans les modèles ajustés non confirmé.** Je n'ai obtenu, dans les extraits
  fournis par l'outil, que la mention d'un ajustement sur le score/la taille de base — pas de
  confirmation explicite que l'âge (pourtant significativement différent entre groupes) est
  contrôlé dans le modèle de la dysménorrhée. Si ce n'est pas le cas, le niveau de preuve proposé
  en §8 doit être révisé à la baisse (**Très faible**) plutôt que Faible.
- **Pas de recherche de rétractation/erratum effectuée** sur cet article dans ce rapport (Retraction
  Watch non consulté) — à faire avant publication si ce n'est pas déjà couvert par l'Agent B.
- **Aucune requête OpenEvidence** n'a été effectuée, conformément à la consigne reçue pour ce
  travail.
- Ce rapport ne connaît ni le contenu ni les conclusions de l'Agent B, travaillant en parallèle
  en contexte isolé — les points listés ci-dessus sont les vérifications que je recommande qu'il
  effectue en priorité, pas des désaccords déjà constatés.

---

**Fin du rapport Agent A.**
