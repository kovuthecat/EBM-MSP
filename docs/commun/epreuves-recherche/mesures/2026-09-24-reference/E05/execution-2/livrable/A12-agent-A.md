# A12 — Rapport Agent A (analyste/extracteur)

**Circuit :** §7bis tri-agents (thème `sante-femme-perinatalite`, hors compétence du référent — SOP_veille.md §3bis/§7bis).
**Rôle :** Agent A seul, contexte isolé. Aucune requête OpenEvidence pour ce travail.
**Statut du document :** rédigé au fil de l'eau — **complet**.

---

## 0. Repérage de départ (non vérifié, premier passage)

D'après `epreuve/entrees/reperage-A12.md` :
- Étude italienne, cohorte prospective, hypothèse « probable Maiorana et al. ou équivalent, *Medicine* 2024, PMID 38968535 ».
- Chiffres presse : diénogest seul > diénogest + œstrogène sur la dysménorrhée de l'endométriose (-2,63 vs -2,04).
- Avis provisoire : C1 oui / C2 oui (effet chiffré) / C3 oui mais **design cohorte, pas RCT** → brève ou analyse à niveau de preuve faible, selon lecture complète.

Rappel doctrine : la presse est une source de **repérage**, jamais une source d'analyse (`SOP_veille.md` §9, `TRI_BOITE_MAIL.md`). La suite de ce rapport ne s'appuie sur ces chiffres que pour les vérifier, pas pour les reprendre tels quels.

---

## 1. Identification de la source primaire

**Correction par rapport au repérage** : l'hypothèse « probable Maiorana et al. » du premier
passage est **écartée**. PMID 38968535 correspond à un autre article que celui de Maiorana et al.
(*Arch Gynecol Obstet* 2024, PMID 38019280 — sécurité au long cours du diénogest seul, question
différente). C'est exactement le piège « confusion entre deux études de la même équipe/du même
sujet » signalé par le skill `recherche-source-primaire` — la vérification du PMID plutôt que du
nom d'auteur pressenti l'a évité.

**Article confirmé** (recherche PubMed/PMC par PMID, titre concordant avec le résumé de presse) :

| Champ | Valeur | Source |
|---|---|---|
| Titre | *Comparison of dienogest or combinations with ethinylestradiol/estradiol valerate on the pain score of women with endometriosis: A prospective cohort study* | PubMed (titre), PMC11224878 |
| Auteurs | Aslihan Yurtkal (Kafkas University, Turquie) ; Mahmut Oncul (İstanbul University Cerrahpaşa, Turquie) | PMC11224878, en-tête |
| Revue | *Medicine (Baltimore)* | PMC11224878 |
| Volume / n° / article | Vol. 103, n° 27, article e38585 | PMC11224878 |
| Date de publication | 5 juillet 2024 | PMC11224878 |
| DOI | 10.1097/MD.0000000000038585 | doi.org (résultat de recherche), concordant avec PMC11224878 |
| PMID | 38968535 | reperage-A12.md, concordant (titre identique sur la fiche PubMed) |
| Accès | Open access, texte intégral disponible via PMC (PMC11224878) | PMC11224878 — pas de paywall, pas de motif de report |
| Financement / conflits d'intérêt | « The authors have no funding and conflicts of interest to disclose. » | PMC11224878, section Financement/COI |
| Registre / protocole pré-enregistré | Non mentionné dans l'article (aucune référence à un enregistrement de protocole trouvée) | PMC11224878 |
| Comité d'éthique | Approbation mentionnée, réf. 80576354-050-99/04 | PMC11224878, section Méthodes |

**Méthode de vérification** : `WebSearch` (confirmation titre ↔ PMID 38968535 sur la fiche PubMed
elle-même, et DOI via un second résultat de recherche indépendant) puis `WebFetch` sur la page PMC
en accès libre (PMC11224878) pour l'extraction du texte intégral. `WebFetch` sur la fiche PubMed
elle-même a échoué (bandeau cookies, aucun contenu exploitable) — ça n'indique pas une
inaccessibilité réelle, l'open access via PMC le confirme. Aucune requête OpenEvidence, conformément
à la consigne.

**Limite de la vérification** : l'extraction du texte intégral passe par `WebFetch`, qui résume via
un modèle intermédiaire plutôt que de donner le HTML brut — deux passes séparées ont été faites pour
faire ressortir les chiffres bruts et les citations verbatim (§5-6 ci-dessous), avec triangulation
interne (une même donnée redemandée sous deux formulations n'a pas varié), mais un Agent B qui
revérifie chaque chiffre directement reste nécessaire avant publication — c'est précisément l'objet
du circuit tri-agents.

---

## ⚠ Signal prioritaire pour Agent B / Agent C

**Les chiffres de presse (« -2,63 vs -2,04 ») ne figurent nulle part dans l'article**, sous aucune
forme (VAS, delta, autre variable) — recherche ciblée sur ces deux valeurs et leurs signes dans le
texte intégral, réponse négative (PMC11224878). Les seules valeurs numériquement proches trouvées
sont des dosages d'AMH (2,563 / 2,544 ng/mL, secondaires, sans rapport avec la douleur) — hypothèse
non confirmée d'une confusion de variable par le relais de presse, à traiter comme telle (hypothèse,
pas un fait établi).

**Plus grave que le chiffre introuvable : le cadrage de presse contredit la conclusion de l'étude.**
Le repérage annonce « diénogest seul > diénogest+œstrogène ». L'étude conclut l'inverse d'une
supériorité : **aucune différence significative entre les 3 bras** à 6 mois (ANOVA, *P* = .257,
Tableau 3), et les auteurs recommandent explicitement les **contraceptifs oraux combinés
(diénogest+œstrogène), moins coûteux**, plutôt que le diénogest seul, à efficacité égale (citation
verbatim §6). C'est le piège nommé par `SOP_veille.md` §9 et `TRI_BOITE_MAIL.md` — « une source de
repérage ne détermine jamais la route » — dans sa forme la plus nette rencontrée sur ce lot : non
pas un chiffre déformé, mais un **sens du résultat inversé**.

---

## Grille d'appréciation (`GRILLE_APPRECIATION.md`)

### 1. Identification

| Champ | Réponse |
|---|---|
| Titre | *Comparison of dienogest or combinations with ethinylestradiol/estradiol valerate on the pain score of women with endometriosis: A prospective cohort study* |
| Source (revue/site) | *Medicine (Baltimore)*, vol. 103, n° 27, article e38585 |
| DOI / lien | 10.1097/MD.0000000000038585 — PMC11224878 |
| Année | 2024 (5 juillet) |
| Type de publication | **Cohorte prospective**, 3 bras, non randomisée |
| Financement & conflits d'intérêt | Aucun déclaré (« no funding and conflicts of interest to disclose ») |
| Registre / protocole pré-enregistré ? | **Non mentionné** dans l'article — pas de référence à un enregistrement trouvée |

### 2. Question (PICO)

- **P** (population) : femmes 18-45 ans, endométriose confirmée (pathologie ou imagerie) ou
  endométriome ; exclusions : maladie systémique grave, agonistes GnRH < 6 mois, COC < 3 mois,
  suspicion de malignité. 78 patientes recrutées, **60 analysées** (20/groupe) — écart de 18 non
  documenté dans le texte extrait (Figure 1 du flow probablement, non restituée par l'extraction ;
  **NON VÉRIFIÉ** — à confirmer par Agent B sur la figure elle-même).
- **I** (intervention) : diénogest 2 mg cyclique seul (Visanne, n=20).
- **C** (comparateur) : diénogest 2 mg + éthinylestradiol 0,03 mg (Dienille, n=20) ; diénogest 2 mg
  + valérate d'estradiol (Qlarista, n=20). Trois bras actifs, **pas de bras placebo/sans traitement**.
- **O** (critère de jugement) : douleur pelvienne (échelle visuelle analogique, VAS), à l'inclusion
  et à 6 mois. Secondaires : CA-125, AMH, taille de l'endométriome.
- Population ≈ patientèle MSP ? **Partiellement** — endométriose confirmée par imagerie/pathologie,
  suivi probablement spécialisé (gynécologie) plutôt que soins premiers stricts ; pertinent pour la
  décision de prescription initiale/relais, y compris par une sage-femme, mais le diagnostic et le
  suivi de l'endométriome sortent du soin premier isolé.

### 3. Risque de biais (observationnel — cohorte)

- [ ] Facteurs de confusion identifiés et **ajustés** — **non** : l'affectation aux groupes se fait
  « according to the given medication » sans mécanisme précisé (pas de randomisation), et les
  auteurs reconnaissent eux-mêmes : « the lack of complete randomization in the assignment of
  patients to treatment groups based on social-demographic matching poses a potential weakness in
  our study design » (Discussion, verbatim).
- [x] Groupes comparables à l'inclusion — Tableau 2 : âge moyen 29,8 / 30,6 / 31,8 ans (*P* = .732),
  IMC comparable (*P* = .792), « no significant discrepancy between drug factions (*P* > .05) ».
- [ ] Causalité inverse envisagée — non discutée (peu pertinent ici, mais non abordée explicitement).
- **Signaler : niveau de preuve d'emblée plus faible** — cohorte non randomisée, **critère
  subjectif (VAS) sans mention d'aveugle** nulle part dans le texte extrait (ni patient ni
  évaluateur) : sur un critère auto-rapporté de douleur, l'absence d'aveugle est un facteur de biais
  significatif, pas un détail — d'autant que le prix et la lourdeur perçue des traitements diffèrent
  entre bras (attente différenciée plausible).

**Synthèse risque de biais : élevé.** Justification : pas de randomisation (limite reconnue par les
auteurs eux-mêmes), pas d'aveugle sur un critère subjectif, méthode d'affectation aux groupes non
précisée, échantillon petit (n=20/bras), attrition de 18/78 patientes non documentée dans le texte
disponible.

### 4. Critère de jugement

- Critère principal : douleur pelvienne (VAS), à 6 mois vs inclusion.
- **Substitution** au sens strict non, la douleur est un critère **patient-important**, mais c'est
  un critère **subjectif et auto-rapporté**, non un critère dur (mortalité, complication objective) —
  particulièrement sensible à l'absence d'aveugle relevée ci-dessus.
- Composite ? Non.
- Le critère est-il pertinent pour la patiente ? **Oui** — la dysménorrhée/douleur pelvienne est le
  symptôme qui motive la consultation et le choix thérapeutique en pratique.

### 5. Résultats & taille d'effet

| Élément | Valeur | Localisation |
|---|---|---|
| VAS inclusion → 6 mois, Visanne (DNG seul) | 7,2 ± 2,46 → 3,3 ± 2,00 (*P* < .001, intra-groupe) | Tableau 3 |
| VAS inclusion → 6 mois, Dienille (DNG+EE) | 7,85 ± 2,21 → 4,0 ± 2,58 (*P* < .001, intra-groupe) | Tableau 3 |
| VAS inclusion → 6 mois, Qlarista (DNG+E2V) | 7,65 ± 2,23 → 4,6 ± 2,76 (*P* < .001, intra-groupe) | Tableau 3 |
| **Comparaison inter-groupes à 6 mois** | ANOVA à un facteur, ***P* = .257 — non significatif** | Tableau 3 + citation verbatim Discussion : « There was no significant incongruity between the drug factions regarding the visual analog scale (VAS) at the initial examination and VAS scores in the 6th month after drug utilization (*P* > .05). » |
| Effet **absolu** inter-groupes | **Non chiffré comme significatif par les auteurs** — delta brut (inclusion→6 mois) Visanne -3,9 / Dienille -3,85 / Qlarista -3,05 points de VAS ; ces deltas ne sont **pas** ceux de la presse (-2,63/-2,04) et ne sont **pas** eux-mêmes le résultat statistique rapporté (les auteurs comparent les scores à 6 mois entre groupes, pas les deltas entre eux) — calcul de vérification par Agent A, **à confirmer par Agent B**, pas une citation de l'article |
| NNT/NNH | Non applicable / non rapporté — design non comparatif à un bras de référence unique |
| Sous-groupes / sensibilité | Non rapportés dans le texte extrait |

> Chaque groupe s'améliore significativement **par rapport à lui-même** (intra-groupe, *P* < .001) —
> attendu même sans traitement efficace en 6 mois sur une échelle subjective (régression à la
> moyenne, effet contextuel de la prise en charge). C'est la comparaison **inter-groupes** qui
> répond à la question posée par le repérage (diénogest seul vs diénogest+œstrogène), et elle est
> **non significative**.

### 6. Validité externe & applicabilité

- Transposable à la patientèle MSP ? Partielle — patientes avec diagnostic d'endométriose déjà posé
  (imagerie/pathologie), donc en aval d'un premier recours ; le soin premier / la sage-femme
  interviennent sur l'orientation et potentiellement le relais de prescription, pas sur le diagnostic
  initial de ce design.
- Comparateur réaliste en soins premiers ? Oui — les 3 traitements comparés (DNG seul, DNG+EE,
  DNG+E2V) sont des options de prescription courantes, y compris en relais après diagnostic
  spécialisé.
- Durée de suivi suffisante ? 6 mois — correct pour un premier jugement symptomatique, court pour
  juger d'un maintien d'effet ou d'effets indésirables à plus long terme.

### 7. Cohérence & esprit critique

- Cohérent avec la littérature antérieure ? D'après le texte extrait, les auteurs situent leur
  résultat dans une littérature où diénogest seul et COC combinés sont généralement présentés comme
  d'efficacité comparable sur la douleur — cohérence à confirmer par Agent B via une recherche
  complémentaire (hors mandat Agent A pour ce rapport).
- **Spin détecté** : **oui, mais pas dans l'article — dans son relais de presse.** L'article
  lui-même est prudent (conclut à une équivalence, recommande l'option la moins coûteuse). C'est la
  ligne de repérage/presse qui inverse le sens du résultat (cf. § « Signal prioritaire » plus haut).
- Signaux d'alerte propres à l'article : absence de randomisation reconnue par les auteurs, absence
  de mention d'aveugle, petit échantillon, attrition non documentée dans le texte disponible. Pas de
  financement industriel déclaré, pas d'arrêt précoce, pas de changement de critère principal
  détecté.

### 8. Niveau de preuve (GRADE simplifié)

**☐ Élevé · ☐ Modéré · ☒ Faible · (limite avec Très faible)**

Justification : cohorte prospective non randomisée (les auteurs reconnaissent eux-mêmes l'absence de
randomisation complète), critère subjectif sans mention d'aveugle, échantillon petit (20/bras),
attrition de 18/78 patientes non documentée dans le texte disponible, résultat principal **non
significatif** (donc precision faible, IC implicitement larges pour un n aussi petit). Le design et
le manque d'aveugle sur un critère auto-rapporté tirent vers **très faible** ; retenu à **faible**
plutôt que très faible parce que la comparabilité initiale des groupes est vérifiée (Tableau 2) et
que le résultat rapporté (absence de différence) est celui qui demande le moins d'extrapolation.

### 9. Classement pour l'outil — **proposition Agent A, non arbitrale**

| Champ | Valeur proposée | Statut |
|---|---|---|
| Thème(s) | `sante-femme-perinatalite` | confirmé (thème repéré, §3bis `SOP_veille.md` — circuit §7bis) |
| Profession(s) concernée(s) | sage-femme (prescription/relais) ; MG en second rang (prescripteur possible de DNG/COC) | proposition |
| **Niveau d'impact** | **informatif** | proposition — voir justification ci-dessous |
| Pertinence pratique | faible à modérée | proposition |
| Temps de lecture estimé | 4-5 min | proposition |
| Impacte un algorithme ? | **non** — hors périmètre DT2 (seul domaine du module Décision à ce jour, `CLAUDE.md` invariant 5) ; `concerne_decision: non` | proposition |
| Route | `analyse` (déjà engagée par le screening du repérage — C1/C2/C3 jugés atteints sur la base du cadrage presse) — **la lecture complète en confirme la pertinence du questionnement, pas le sens annoncé** | rappel, non modifiable par Agent A |
| `meta.relecture_referent` | `false` obligatoire (§7bis, thème hors compétence du référent) | rappel SOP, non négociable |

**Justification `niveau_impact: informatif`** : le résultat vérifiable de l'étude est une
**absence de différence significative** entre diénogest seul et diénogest+œstrogène sur la douleur à
6 mois, sur une preuve de faible niveau. Ce n'est pas un « geste qui change » nommable avec
confiance (C1 fragilisé une fois la lecture faite : rien ne « déplace » une décision sur la base
d'une preuve aussi faible et non significative) — mais c'est un résultat utile à publier tel quel,
notamment pour **corriger** le cadrage inverse de la presse plutôt que pour recommander un
changement de pratique. Conforme à `SOP_veille.md` §5bis : « une analyse peut conclure informatif,
et c'est fréquent : c'est même souvent le résultat le plus utile ».

### 10. Message pour la pratique (proposition, 2-3 lignes)

Une cohorte prospective turque de faible niveau de preuve (non randomisée, sans aveugle, n=60) ne
retrouve **aucune différence significative** entre diénogest seul et diénogest associé à un
œstrogène (éthinylestradiol ou valérate d'estradiol) sur la douleur pelvienne à 6 mois chez des
femmes avec endométriose confirmée — les trois options s'améliorent de façon comparable. **Ceci
contredit le cadrage de la presse relayant cette étude**, qui annonçait une supériorité du diénogest
seul non retrouvée dans l'article lui-même ; les auteurs recommandent au contraire les associations
œstroprogestatives, moins coûteuses, à efficacité égale.

---

## Ce que ce rapport ne garantit pas

- **Angle mort de compétence** (rappel §7bis, `SOP_veille.md` §3bis) : Agent A n'est ni sage-femme
  ni gynécologue. L'appréciation de la pertinence clinique du choix diénogest seul vs associé
  (tolérance, profil de risque thromboembolique différent entre éthinylestradiol et valérate
  d'estradiol, préférence de la patiente) reste hors de la portée de ce rapport — un point que
  seul un professionnel du domaine pourrait évaluer, et que ni Agent B ni Agent C ne pourront
  combler davantage.
- **Extraction via `WebFetch`** : la lecture du texte intégral est passée par un résumé intermédiaire,
  pas par le HTML/PDF brut consulté directement page par page. Les citations verbatim rapportées
  ici (Tableau 2, Tableau 3, Discussion) ont été redemandées sous deux formulations différentes sans
  divergence constatée, ce qui réduit mais n'élimine pas le risque d'erreur d'extraction — c'est
  précisément ce que la vérification par Agent B doit couvrir.
- **Attrition non documentée** : 78 patientes recrutées, 60 analysées ; le motif et la répartition
  des 18 sorties d'étude n'ont pas pu être confirmés dans le texte extrait (probablement en Figure 1,
  non restituée). Marqué `NON VÉRIFIÉ` ci-dessus, pas présenté comme confirmé.
- **Cohérence avec le reste de la littérature** : non recherchée pour ce rapport (hors mandat de
  l'étape 1 tel que cadré) — à couvrir par Agent B (rôle contradicteur/red-team, recherche
  complémentaire prévue au §7bis).
- **Hypothèse de confusion de variable (AMH ↔ VAS) côté presse** : plausible au vu de la proximité
  numérique (2,563/2,544 vs -2,63/-2,04), mais **non confirmée** — l'article source de presse
  lui-même n'a pas été consulté par Agent A (hors mandat : mission = source primaire, pas la
  relecture du relais). À signaler si Agent B ou Agent C y ont accès.

**Statut du document : rapport Agent A complet.** Prêt pour confrontation avec le rapport Agent B et
réconciliation par Agent C (§7bis, contextes isolés, décision finale hors de la portée d'Agent A).


