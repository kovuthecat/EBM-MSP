# A04 — Agent A (Analyste/Extracteur)

## 1. Identification

| Champ | Réponse |
|---|---|
| Titre | Semaglutide and Hospitalizations in Patients With Obesity and Established Cardiovascular Disease: An Exploratory Analysis of the SELECT Randomized Clinical Trial |
| Auteurs | Nicholls SJ, Ryan DH, Deanfield J, et al. ; SELECT Trial Investigators (co-auteurs incluant des salariés Novo Nordisk : Lübker, Rasmussen, Stensen, Weeke) |
| Source (revue) | JAMA Cardiology |
| DOI / lien | 10.1001/jamacardio.2025.4824 — PubMed PMID 41433034 |
| Année / pagination | *JAMA Cardiol.* 2026;11(2):156-164. Publié en ligne le 23 décembre 2025 |
| **Confirmation de la référence de départ** | La référence relayée « JAMA Cardiol 2026;11:156-64 » est **exacte** (volume 11, numéro 2, pages 156-164). Il s'agit bien d'une analyse secondaire de l'essai **SELECT**, dont le résultat principal (MACE) a été publié dans le *NEJM* en 2023 (Lincoff et al., n≈17 604, HR 0,80 [0,72-0,90]) — cohérent. |
| Type de publication | ECR — analyse exploratoire préspécifiée, critère secondaire (hospitalisations) |
| Financement & conflits d'intérêt | Essai financé par **Novo Nordisk A/S** (fabricant du sémaglutide), conformément aux « Good Publication Practice guidelines ». Plusieurs co-auteurs sont **salariés de Novo Nordisk**. L'auteur principal (Nicholls) déclare des honoraires de conseil institutionnels versés par Novo Nordisk. Financement industriel + résultat favorable → signal d'alerte à documenter en rubrique 7. |
| Registre / protocole pré-enregistré ? | Oui pour l'essai SELECT (NCT03574597). Pour **cet article**, les sources consultées (JAMA Network, ACC.org) indiquent qu'il s'agit d'une **analyse exploratoire préspécifiée** — statut à retenir : critère **secondaire préspécifié**, non pas post-hoc opportuniste, mais **non pas le critère principal** de l'essai. |

---

## 2. Question (PICO)

- **P** : adultes ≥45 ans, IMC ≥27, maladie cardiovasculaire établie (IDM 67,7 %, AVC 17,9 %, artériopathie périphérique 4,3 %), **sans diabète** (HbA1c <6,5 % et pas d'antécédent de diabète), n=17 604, 804 sites.
- **I** : sémaglutide 2,4 mg SC hebdomadaire.
- **C** : placebo.
- **O** (de cet article) : hospitalisations toutes causes (nombre total, premier événement, jours d'hospitalisation), et sous-catégorie « événements indésirables graves ».
- Population ≈ patientèle MSP ? **Partiellement** — prévention secondaire cardiovasculaire stricte, population plus sélectionnée qu'une patientèle générale de MSP (cf. rubrique 6).

---

## 3. Risque de biais (ECR, RoB2 allégé)

- [x] Randomisation adéquate — SELECT est un ECR multicentrique international en **double aveugle** (confirmé par la littérature sur l'essai principal ; non re-vérifié en détail dans cette analyse secondaire faute d'accès au texte intégral).
- [~] Aveugle maintenu — plausible mais un biais de détection reste possible pour un critère aussi « mou » que l'hospitalisation (décision non standardisée, potentiellement influencée par des effets cliniquement perceptibles du traitement — perte de poids, tolérance digestive).
- [x] ITT — présumée conforme au design SELECT (non détaillé spécifiquement pour cet article dans les sources accessibles).
- [ ] **Sélection du résultat rapporté** : **ce n'est pas le critère principal de l'essai** (le critère principal était le MACE, publié en 2023). C'est une analyse exploratoire/secondaire — à traiter avec prudence même si « préspécifiée ».
- [ ] Arrêt précoce pour bénéfice : non rapporté pour cette analyse (l'essai principal SELECT n'a pas été arrêté précocement).
- **Point clé (non coché volontairement)** : les hospitalisations **n'ont pas fait l'objet d'une adjudication centrale**. Citation (JAMA Cardiology, méthodes) : les données proviennent des formulaires de rapport de cas remplis par les investigateurs, « not subject to central adjudication » — contrairement aux critères cardiovasculaires du MACE principal, qui eux étaient adjudiqués par un comité indépendant. **Ceci abaisse la fiabilité du critère** par rapport au critère principal de SELECT.
- **Arrêts de traitement sous sémaglutide** : les GLP-1 sont associés à des arrêts de traitement pour intolérance digestive (nausées, vomissements) plus fréquents que sous placebo. Le texte intégral n'était pas accessible pour vérifier le taux exact d'arrêt dans ce sous-groupe d'analyse — **non vérifiable sur la source accessible**. Un différentiel d'arrêt de traitement peut créer un biais de suivi différentiel (patients qui arrêtent le traitement peuvent aussi arrêter le suivi ou, à l'inverse, consulter davantage).

**Synthèse risque de biais : modéré.** Design ECR robuste sur le plan de la randomisation/aveugle, mais critère secondaire, non adjudiqué centralement, avec risque de biais de détection et d'attrition informative propre aux GLP-1.

---

## 4. Critère de jugement

- Critère analysé : hospitalisations totales toutes causes (comptage récurrent), + sous-catégorie « événements indésirables graves », + jours d'hospitalisation.
- **Dur ou substitution ?** → **Dur** (hospitalisation = événement clinique tangible), mais **non adjudiqué** et de nature hétérogène (une hospitalisation élective programmée n'a pas la même portée clinique qu'une hospitalisation pour événement aigu).
- Composite ? Non, mais agrégation de causes très diverses (le poids relatif de chaque cause d'hospitalisation dans la réduction n'est pas détaillé dans les sources accessibles — **non vérifiable**).
- Pertinent pour le patient ? **Oui**, c'est un critère centré patient (fardeau de soins), mais sa **non-adjudication** et son statut de critère secondaire imposent de le lire comme **hypothèse générant des données**, pas comme preuve définitive au même niveau que le MACE.
- **Modèle statistique pour événements récurrents** : les résumés obtenus mentionnent un modèle de type « mean ratio » (MR) pour le nombre d'admissions et « rate ratio » (RR) pour les jours d'hospitalisation, avec un traitement du décès comme risque compétitif évoqué dans une seule source secondaire (modèle nommé « Ghosh-Lin »). **Ce détail méthodologique fin (nom exact du modèle, gestion du décès comme compétitif) n'a été obtenu que via un résumé automatisé d'une page à accès restreint et n'a pas pu être recoupé sur une deuxième source indépendante — à considérer comme non vérifié avec certitude.**

---

## 5. Résultats & taille d'effet

| Élément | Valeur | Localisation |
|---|---|---|
| Hospitalisations toutes causes | 18,3 vs 20,4 pour 100 patients-années ; **mean ratio 0,90 [IC95% 0,85-0,95] ; p<0,001** | Résultats, confirmé de façon convergente sur 3 sources indépendantes (PubMed, JAMA Network, ACC.org) |
| Hospitalisations pour événements indésirables graves | 15,2 vs 17,1 /100 patients-années ; MR 0,89 [0,84-0,94] ; p<0,001 | idem |
| Jours d'hospitalisation (toutes causes) | 157,2 vs 176,2 /100 patients-années ; **rate ratio 0,89 [0,82-0,98] ; p=0,01** | idem |
| Jours d'hospitalisation (EIG) | 137,6 vs 153,9 /100 patients-années ; RR 0,89 [0,81-0,98] ; p=0,02 | JAMA Network (résumé), non recoupé sur 2e source — prudence |
| **Effet absolu** | Sur la base des taux ci-dessus : **différence d'incidence brute ≈ 2,1 hospitalisations évitées pour 100 patients-années** (18,3 vs 20,4) sur la durée du suivi médian (41,8 mois). Un NNT dérivé de cette seule différence de taux n'est **pas directement calculable de façon rigoureuse** à partir d'un ratio de taux récurrents (ce n'est pas un risque cumulatif à horizon fixe) — **je n'ai pas trouvé, dans les extraits accessibles, de NNT publié explicitement par les auteurs**. Un chiffre de « NNT=31 » est apparu dans un résumé automatisé d'une seule source à accès restreint : **non confirmé, à ne pas retenir sans vérification directe du texte intégral**. |
| Significativité / précision | IC 95 % relativement étroits pour le critère principal de cette analyse (0,85-0,95), plus larges pour les jours d'hospitalisation. |
| Cohérence sous-groupes | Pas d'hétérogénéité rapportée selon IMC, âge, sexe (source secondaire uniquement). |

> Point de vigilance méthodologique : un ratio de taux (MR/RR) sur des événements récurrents ne se convertit pas simplement en NNT « à la RR classique » — nécessiterait le nombre absolu d'événements par bras et l'horizon exact, non extrait avec certitude ici.

---

## 6. Validité externe & applicabilité

- Population SELECT : **prévention secondaire cardiovasculaire stricte**, ≥45 ans, IMC ≥27 (médiane 32,1), maladie CV établie, **sans diabète**. Ce n'est pas une population « obésité tout-venant » ni une population de prévention primaire.
- Transposable à une patientèle MSP ? **Partiellement.** Les patients obèses avec maladie CV établie et sans diabète existent en soins primaires mais ne représentent qu'un sous-ensemble de la patientèle obèse habituelle (souvent diabétique, ou sans CV établie — hors périmètre direct de cette preuve).
- Comparateur réaliste ? Le placebo est un comparateur d'essai ; en pratique le sémaglutide se substitue le plus souvent à « rien » (mesures hygiéno-diététiques seules) — cohérent avec le design.
- **Coût / accès en France** : le sémaglutide 2,4 mg (Wegovy) n'est, à ma connaissance générale (non vérifié spécifiquement dans les sources consultées pour cette tâche), pas largement remboursé en France pour l'indication obésité hors cas très restreints, avec un coût mensuel élevé à la charge du patient. **Ce point limite fortement l'applicabilité pratique en MSP** quel que soit le niveau de preuve scientifique — à faire figurer explicitement dans le message pratique. Je n'ai pas vérifié l'état actualisé (2026) du remboursement/accès en France sur une source officielle dans le cadre de cette tâche — **à confirmer séparément si le nœud décisionnel en dépend**.
- Durée de suivi : 41,8 mois, suffisante pour un critère d'hospitalisation.

---

## 7. Cohérence & esprit critique

- **Cohérence globale** : cohérent en direction avec le résultat principal de SELECT (NEJM 2023, MACE −20 %, HR 0,80) et avec le programme sémaglutide plus large (STEP pour la perte de poids, FLOW pour le rein). Un effet sur les hospitalisations totales est plausible si le médicament réduit à la fois les événements CV et améliore l'état métabolique général.
- **Spin détecté ?** Le titre et la présentation médiatique (communiqués, ACC.org) mettent l'accent sur « moins d'hospitalisations » sans toujours rappeler dans les résumés courts que (a) ce n'est pas le critère principal de l'essai, (b) les événements ne sont pas adjudiqués. C'est un **glissement de présentation typique** : un résultat secondaire exploratoire présenté avec la même assurance qu'un critère principal — à signaler comme prudence de lecture, même si la classification officielle reste « préspécifiée » et non post-hoc.
- **Signaux d'alerte identifiés** :
  1. **Financement industriel + auteurs salariés du fabricant + résultat favorable** — signal classique à documenter, sans que cela invalide le résultat en soi.
  2. **Critère secondaire/exploratoire, non adjudié centralement**, contrairement au critère principal de SELECT — risque de biais de mesure différentiel.
  3. **Période Covid** : le suivi de l'essai (2018-2023 selon les données connues de SELECT) chevauche la pandémie. Une source (résumé JAMA Network) indique qu'une **analyse de sensibilité a été réalisée** et que le bénéfice « ne diffère pas significativement entre patients avec et sans événement indésirable grave attribuable au Covid » — élément rassurant mais **je n'ai pas pu vérifier ce point directement dans le texte intégral** (accès payant), donc il repose sur un résumé automatisé d'une seule source non recoupée.
  4. **Effets indésirables digestifs / hospitalisations pour EIG liés au traitement** : une source indique un excès numérique d'hospitalisations pour causes hépatobiliaires dans le bras sémaglutide (chiffres évoqués : 115 vs 93, p=0,13) mais **ce chiffre n'a été vu que dans un seul résumé automatisé de page à accès restreint et n'a pas pu être recoupé** — à traiter comme non confirmé. Plus largement, je n'ai **pas pu vérifier** si l'article rapporte spécifiquement les hospitalisations pour pancréatite, lithiase biliaire ou gastroparésie, événements indésirables connus des GLP-1 forte dose. C'est un manque important pour juger si la réduction nette d'hospitalisations résiste à la prise en compte des complications propres au traitement.

---

## 8. Niveau de preuve (GRADE simplifié)

**□ Élevé** · **☒ Modéré** · **□ Faible** · **□ Très faible**

Justification : ECR de bonne qualité méthodologique globale (randomisation, double aveugle, grand effectif, IC étroits, cohérent avec le corpus SELECT), mais le critère évalué ici est **secondaire/exploratoire**, **non adjudié centralement** (contrairement au critère principal), avec des zones d'ombre non résolues à l'accès disponible (gestion du Covid en détail, décompte des hospitalisations pour effets indésirables spécifiques au traitement, financement industriel). Ces réserves déclassent la preuve d'« élevé » à **modéré**, sans l'invalider — le signal est probablement réel mais son ampleur exacte et sa robustesse restent à confirmer par une lecture du texte intégral et, idéalement, une réplication indépendante.

---

## 9. Classement pour l'outil

| Champ | Valeur |
|---|---|
| Thème(s) | Obésité, cardiovasculaire, GLP-1/agonistes du récepteur du GLP-1, prévention secondaire |
| Profession(s) concernée(s) | Médecin généraliste, cardiologue, IPA |
| **Niveau d'impact** | Informatif (à ce stade — ne modifie pas une prise en charge de routine, notamment du fait de l'accès/coût en France) |
| Pertinence pratique | Modérée |
| Temps de lecture estimé (min) | 6-8 |
| Impacte un algorithme ? | Non directement — DT2 exclut par construction les patients avec diabète (population SELECT sans diabète) ; pourrait informer un futur nœud « obésité + CV établie » si le module s'étend, mais pas d'action immédiate sur les nœuds DT2 existants |

---

## Proposition de classement

**Niveau de preuve : modéré. Niveau d'impact : informatif. Pertinence pratique : modérée.**
Signal cohérent et de bonne robustesse statistique (IC étroits, grand effectif) mais portant sur un **critère secondaire exploratoire non adjudié centralement**, avec des incertitudes non résolues (gestion précise du biais Covid, décompte des hospitalisations pour effets indésirables propres au sémaglutide, financement et implication de Novo Nordisk dans l'analyse). L'applicabilité en MSP est en outre freinée par le **coût/accès du sémaglutide en France**, indépendamment du niveau de preuve. À suivre plutôt qu'à intégrer immédiatement dans un algorithme de décision.

---

## Ce que je n'ai pas pu vérifier

- **Texte intégral de l'article** (JAMA Cardiology, paywall) : je n'ai eu accès qu'à l'abstract PubMed et à des résumés automatisés (WebFetch) de pages tierces (JAMA Network, ACC.org, EurekAlert, PACE-CME). Tout détail fin non recoupé sur au moins deux sources indépendantes doit être considéré comme fragile.
- **Nom exact du modèle statistique** pour les événements récurrents (« Ghosh-Lin » évoqué une seule fois) et la manière précise dont le décès est traité comme risque compétitif — non confirmé sur deuxième source.
- **NNT explicite publié par les auteurs** — non retrouvé de façon fiable ; le chiffre « NNT=31 » vu dans un résumé automatisé n'est pas confirmé et ne doit pas être cité comme provenant de l'article sans vérification directe.
- **Décompte détaillé des hospitalisations pour effets indésirables spécifiques au sémaglutide** (pancréatite, lithiase biliaire, gastroparésie) — non retrouvé dans les sources accessibles ; seul un chiffre isolé et non recoupé sur les causes hépatobiliaires (115 vs 93, p=0,13) est apparu, à confirmer.
- **Taux d'arrêt de traitement** dans le bras sémaglutide pour cette cohorte spécifique et son impact potentiel sur le suivi différentiel — non vérifié.
- **Détail de l'analyse de sensibilité Covid** (méthode de censure/stratification par période) — seule l'existence et la conclusion générale (« pas de différence significative ») ont été retrouvées, sans le détail méthodologique.
- **État actualisé (2026) du remboursement/accès du sémaglutide 2,4 mg en France** — non vérifié sur source officielle dans le cadre de cette tâche.
- **Détail du processus de randomisation/aveugle** spécifique à cette sous-analyse (supposé identique à l'essai principal SELECT, non re-décrit dans les sources consultées).
