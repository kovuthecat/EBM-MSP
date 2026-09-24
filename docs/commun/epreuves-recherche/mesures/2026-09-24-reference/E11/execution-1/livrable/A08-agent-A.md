# A08 — Rapport Agent A (analyste/extracteur) — circuit tri-agents §7bis

**Thème :** `sante-femme-perinatalite` → circuit §7bis (tri-agents, réconciliation par Agent C,
`meta.relecture_referent: false`). **Ce rapport ne couvre que l'étape 1 (Agent A)**, en contexte
isolé de l'Agent B. Rédigé au fil de l'eau.

**Garde-fou rappelé** : la ligne de repérage (`epreuve/entrees/reperage-A08.md`) est un relais de
recherche web, pas la source primaire — elle ne détermine pas le classement. Aucune requête
OpenEvidence utilisée (interdit pour ce travail).

**Statut : rapport complet.** Source primaire identifiée avec un niveau de confiance élevé
(métadonnées officielles Europe PMC) ; texte intégral **non consultable** (paywall Elsevier, aucune
voie légitime trouvée) — la grille est remplie au maximum de ce que permet le résumé structuré
officiel, et **chaque point qui exigerait le texte intégral est marqué explicitement comme non
disponible**, plutôt que déduit ou deviné. Point le plus important remonté à la réconciliation :
les deux chiffres de sous-groupe (avant/pendant travail) de la ligne de repérage ne sont **pas**
vérifiés sur source officielle (§5.2).

---

## 0. Identification de la source primaire

Recherche web (`WebSearch`, pas de connecteur PubMed — refusé par la politique de permissions de
cette session ; contournement non tenté, cf. note méthodologique en fin de rapport) :

- **Titre exact** : *Chlorhexidine is the preferred agent for vaginal antisepsis prior to cesarean
  delivery: a systematic review and network meta-analysis*
- **Revue** : *American Journal of Obstetrics & Gynecology* (AJOG)
- **PMID** : 41485838 — https://pubmed.ncbi.nlm.nih.gov/41485838/
- **Texte intégral éditeur** : https://www.ajog.org/article/S0002-9378(25)00719-7/fulltext
  (miroir ScienceDirect : https://www.sciencedirect.com/science/article/pii/S0002937825007197)
- **Fenêtre de recherche des essais inclus** : 1er janvier 1990 → 24 janvier 2025 (cohérent avec la
  ligne de repérage « recherche jusqu'à 01/2025 »).

**Correspondance avec la ligne de repérage** (`epreuve/entrees/reperage-A08.md`) : confirmée sur le
fond (méta-analyse en réseau, AJOG 2025, antisepsie vaginale chlorhexidine avant césarienne, OR
endométrite proches — 3,53 vs 3,65 selon la source consultée, à trancher au §1 ci-dessous par
lecture du texte intégral, pas du résumé de recherche web). **Piège de confusion à surveiller** :
une méta-analyse en réseau proche existe pour la povidone iodée sur le même sujet (AJOG 2019,
Caissutti et al., *"Povidone-iodine 1% is the most effective..."*) — ce n'est **pas** l'article
visé ici ; vérifié par le titre exact et le DOI/PMID ci-dessus, pas par le sujet seul.

---

## Note méthodologique (à lire avant la grille)

Le connecteur PubMed est **refusé par la politique de permissions de cette session** (« don't ask
mode ») — indisponible pour ce travail, pas seulement pour OpenEvidence. Aucune tentative de
contournement (pas de requête directe à l'éditeur pour du texte payant, pas de miroir non
autorisé). Sources effectivement utilisées, par ordre de fiabilité décroissante :

1. **Europe PMC (API REST publique, `ebi.ac.uk/europepmc`)** — métadonnées structurées officielles
   (titre, auteurs, revue, DOI, résumé structuré complet). C'est la source la plus fiable obtenue :
   un export direct de la notice bibliographique, pas une synthèse.
2. **`WebSearch`** — plusieurs requêtes, avec un problème constaté et documenté ci-dessous (§5) :
   l'outil renvoie une **synthèse générée**, pas le texte brut de la page, et cette synthèse s'est
   avérée **au moins une fois incohérente avec elle-même** (nombre d'essais inclus différent d'un
   appel à l'autre pour la « même » étude). Traité comme un résumé secondaire, jamais comme
   confirmation d'un chiffre.
3. **`WebFetch`** direct sur AJOG/ScienceDirect/PubMed/EuropePMC (page rendue)/ResearchGate :
   **échec systématique** (403, ou page bloquée par un mur de cookies). **Texte intégral non
   consultable** avec les outils disponibles dans cette session — paywall Elsevier confirmé
   (`Access: Subscription required`, champ `fullTextUrlList` d'Europe PMC vide de tout accès libre,
   pas de PMCID). Pas de version preprint retrouvée (medRxiv/bioRxiv), pas de dépôt auteur en accès
   libre trouvé (ResearchGate également bloqué).

**Conséquence directe pour la grille ci-dessous** : tout ce qui vient du résumé structuré (§1-2,
une partie de §5) est solide. Tout ce qui nécessiterait le texte intégral (tableaux détaillés,
risque de biais étude par étude, funnel plot, GRADE/CINeMA si présent, financement, N par bras) est
**marqué non disponible**, pas deviné. Recommandation : avant publication, demander au référent un
accès personnel/institutionnel à AJOG (Elsevier) — c'est l'étape prévue par
`recherche-source-primaire` avant d'accepter un report, et elle n'a pas encore été faite ici.

---

## 1. Identification

| Champ | Réponse |
|---|---|
| Titre | *Chlorhexidine is the preferred agent for vaginal antisepsis prior to cesarean delivery: a systematic review and network meta-analysis* |
| Auteurs | McKinney JA, Sanchez-Ramos L, Duncan J, Lin L, Rhoades C, Mateus J, Dussan LE, Nino G, Hansen A, Messiah C, Pomputius A |
| Source (revue/site) | *American Journal of Obstetrics & Gynecology* (AJOG) |
| DOI / lien | 10.1016/j.ajog.2025.09.046 — https://doi.org/10.1016/j.ajog.2025.09.046 · PMID 41485838 |
| Année | Volume 233, issue 6S (2026 selon la notice Europe PMC — parution en ligne fin 2025 : DOI actif, item de veille daté 2025). **À vérifier au screening** : le numéro « 6S » suggère un lien avec un supplément de congrès (SMFM) — non confirmé, non bloquant pour l'appréciation. |
| Type de publication | Revue systématique + méta-analyse en réseau (network meta-analysis), cadre bayésien |
| Financement & conflits d'intérêt | **NON DISPONIBLE** — absent du résumé structuré, section correspondante du texte intégral non consultable (paywall, cf. note méthodologique). À obtenir avant publication. |
| Registre / protocole pré-enregistré ? | **Probable, non confirmé indépendamment** : un numéro PROSPERO (`CRD42025649677`) est ressorti d'une synthèse `WebSearch`, mais la tentative de vérification directe sur le site PROSPERO (`crd.york.ac.uk`) a échoué (page non exploitable par `WebFetch`, contenu insuffisant). **Marqué `NON VÉRIFIÉ`** — ne pas citer ce numéro comme confirmé dans une entrée publiée sans second contrôle. |

**Correspondance avec la ligne de repérage** (`epreuve/entrees/reperage-A08.md`) : le nombre
d'essais (**50**) et le sujet (NMA chlorhexidine vs alternatives, avant césarienne) coïncident
exactement avec la notice Europe PMC. Identité de la source confirmée avec un niveau de confiance
élevé — **mais voir §5 pour un point de vigilance sur les chiffres de sous-groupe repris dans la
ligne de repérage**, qui ne proviennent pas de cette notice officielle.

---

## 2. Question (PICO)

- **P** (population) : femmes enceintes bénéficiant d'une césarienne, sous antibioprophylaxie
  systémique (critère d'inclusion des essais) — césarienne avant travail ou en cours de travail.
- **I** (intervention) : antisepsie vaginale préopératoire — chlorhexidine (0,05 % à 5 %, plusieurs
  concentrations comparées), povidone iodée, cétrimide, métronidazole, clindamycine, sérum
  physiologique, eau.
- **C** (comparateur) : absence de préparation vaginale (comparateur pivot du chiffre le plus cité :
  « pas d'antisepsie vs chlorhexidine ») ; comparaisons croisées entre agents via le réseau.
- **O** (critères de jugement) : endométrite, infection de paroi (wound infection), complications de
  paroi (wound complications), fièvre du post-partum.
- Population ≈ patientèle MSP ? **Partiellement, avec réserve importante.** Le geste évalué
  (antisepsie vaginale peropératoire avant césarienne) est un acte réalisé **au bloc/en salle de
  naissance, décidé par l'équipe obstétricale/anesthésique**, pas une décision prise en consultation
  ambulatoire par un professionnel de MSP. La profession la plus proche dans le périmètre MSP
  (sage-femme) accompagne l'accouchement mais ne choisit typiquement pas seule le protocole
  d'antisepsie chirurgicale d'un bloc. **Point à trancher par Agent C**, pas par moi seul : c'est
  précisément le type de jugement « organisation des soins en maternité » où l'angle mort du §7bis
  peut jouer.

---

## 3. Risque de biais

### Grille méta-analyse / revue systématique (inspirée AMSTAR-2)

- [x] Question et critères d'inclusion pré-établis — protocole probable (PROSPERO cité, **non
  vérifié indépendamment**, cf. §1)
- [x] Recherche exhaustive — **oui, au-delà du minimum** : PubMed/MEDLINE, Embase, Web of Science,
  Scopus, Cochrane CDSR, Cochrane CENTRAL, **et littérature grise**, fenêtre 01/1990-24/01/2025
  (Europe PMC, section « Data sources »)
- [x] Évaluation du risque de biais des études incluses — **oui** : Cochrane Risk of Bias 2.0,
  **par deux relecteurs indépendants** (Europe PMC, section « Methods »)
- [ ] Hétérogénéité analysée et discutée (I²) — méthodes de diagnostic d'incohérence globale/locale
  du réseau **mentionnées** dans le résumé, mais **valeurs I² non disponibles** (texte intégral
  requis)
- [ ] Biais de publication évalué (funnel plot, etc.) — **non mentionné dans le résumé structuré,
  NON DISPONIBLE** sans texte intégral

**Point positif méthodologique notable, absent de la grille standard mais à signaler** : les auteurs
ont en plus appliqué la checklist **TRACT** (*Trustworthiness in RAndomized Controlled Trials*) pour
dépister l'intégrité des essais inclus, avec une **analyse de sensibilité excluant les études jugées
« untrustworthy »**. C'est un signal de rigueur au-dessus de la moyenne du genre, pertinent dans un
champ (anesthésie/obstétrique) qui a connu des scandales de fraude de données sur des essais
contrôlés.

**Limite de design à noter pour C3/cohérence** : les essais **quasi-randomisés** sont inclus aux
côtés des ECR stricts (critère d'éligibilité du résumé), ce qui abaisse en principe la robustesse
par rapport à un pool 100 % ECR — direction et ampleur de cet effet non quantifiables sans le texte
intégral.

**Synthèse risque de biais : NON DISPONIBLE de façon assurée — élément partiels favorables**
(RoB2 en double lecture, TRACT, recherche exhaustive + littérature grise, sensibilité sur la
fiabilité des essais), **éléments manquants pour trancher** (I², funnel plot, répartition du risque
de biais par étude). Provisoire : **modéré**, à confirmer/infirmer par Agent B et par lecture du
texte intégral.

---

## 4. Critère de jugement

- Critères principaux (co-primaires de fait) : **endométrite**, infection de paroi, complications de
  paroi, fièvre du post-partum.
- **Dur** (critère clinique d'issue infectieuse, pas un marqueur biologique/d'imagerie) — **pas un
  critère de substitution**. Les quatre critères sont pertinents pour la patiente (morbidité
  infectieuse du post-partum, y compris ses conséquences pratiques : ré-hospitalisation, antibiotiques
  supplémentaires, allongement du séjour).
- Composite ? **Non** — quatre critères rapportés séparément, pas de score composite déclaré.
- Critère pertinent pour la patiente ? **Oui.**

---

## 5. Résultats & taille d'effet

### 5.1 — Chiffres confirmés sur la notice officielle Europe PMC (résumé structuré, section « Results »)

Comparaison **chlorhexidine vs absence de préparation vaginale**, toutes concentrations confondues
(« unspecified concentration ») :

| Critère | OR | IC crédible à 95 % | Localisation |
|---|---|---|---|
| Endométrite | **3,65** | 2,36–5,90 | Résumé structuré Europe PMC, section Results, 1ʳᵉ phrase |
| Infection de paroi | **2,34** | 1,66–3,36 | idem |
| Complications de paroi | **2,28** | 1,65–3,32 | idem |
| Fièvre du post-partum | **3,60** | 2,27–5,86 | idem |

Analyses stratifiées par concentration (résumé Europe PMC) : chlorhexidine 0,2 % = SUCRA le plus
élevé pour l'infection de paroi (0,995) ; chlorhexidine de concentration non précisée = SUCRA le
plus élevé pour la fièvre. Clindamycine et cétrimide classés parfois haut mais **« supported by
few, small trials »** — mise en garde explicite des auteurs eux-mêmes contre la sur-interprétation
de ces deux bras, à reprendre telle quelle dans toute entrée rédigée.

**Conclusion des auteurs, telle que rapportée** : à la différence des NMA antérieures qui
plaçaient la povidone iodée 1 % en tête (cf. Caissutti et al., AJOG 2019 — même revue, même
question, comparateur direct identifié et non confondu avec l'étude cible, cf. §0), cette analyse
élargie (50 essais, contre un nombre inférieur pour la NMA de 2019) place la **chlorhexidine à
concentration faible à moyenne** en tête, de façon cohérente sur plusieurs critères.

### 5.2 — Point de vigilance majeur : chiffres de sous-groupe **non vérifiés**

La ligne de repérage cite deux valeurs différentes des chiffres ci-dessus, présentées comme un
sous-groupe par **moment de la césarienne** :
- Avant travail : OR 3,53 [2,09–6,57]
- En cours de travail : OR 2,79 [1,32–5,88]

**Je n'ai pas pu confirmer ces deux valeurs sur une source officielle.** Elles ne figurent pas dans
le résumé structuré Europe PMC (qui ne donne que l'estimation globale, non désagrégée par moment de
césarienne, même si le résumé confirme que ce sous-groupe a bien été prévu : *« Prespecified
subgroup analyses examined labor status... »*). Je les ai retrouvées **deux fois identiques** via
`WebSearch`, mais dans un contexte qui m'alerte plutôt que me rassure : la **même** synthèse
`WebSearch` a associé une fois ces deux OR à un effectif **« 47 essais, 13 289 participantes, 8
interventions »** — un chiffre que j'ai testé contre les deux publications les plus proches
possibles (l'AJOG MFM 2023 de Liu et al. : 23 essais/10 026 participantes ; une revue PMC apparentée :
32 essais/13 853 participantes) et qui **ne correspond à aucune des deux**. Ce n'est donc
vraisemblablement **pas** un vrai chiffre d'une publication distincte confondue avec la cible (le
piège habituel), mais un signe que **la synthèse générée par l'outil de recherche n'est pas fiable
chiffre par chiffre** — elle peut recombiner ou approximer du texte sans le signaler.

**Traitement retenu, conforme à la discipline de citation** (`recherche-source-primaire`) : ces deux
valeurs de sous-groupe sont marquées **`NON VÉRIFIÉ`**, pas reprises comme confirmées dans une
entrée publiée en l'état. Elles restent plausibles (même ordre de grandeur, même sens, cohérentes
avec l'estimation globale confirmée à 3,65 pour l'endométrite tous sous-groupes confondus) mais
n'ont pas été vues dans une source primaire ou une notice officielle. **Recommandation** :
confirmation sur le texte intégral (accès référent) avant toute publication qui les citerait
nommément — sinon, se limiter à l'estimation globale confirmée (3,65 [2,36–5,90]).

### 5.3 — Effet absolu et NNT : **non disponibles**

Le résumé structuré ne donne que des **odds ratios**, pas de taux d'événements bruts par bras
(ex. « X % vs Y % »), donc **aucun effet absolu ni NNT ne peut être calculé ou vérifié** sans les
tableaux du texte intégral (paywall, cf. note méthodologique). C'est une **lacune reconnue de ce
rapport**, pas un oubli : la règle d'or du projet (« toujours privilégier l'effet absolu et le
NNT ») ne peut pas être honorée sur la seule base du résumé. À la différence, la NMA de comparaison
(Liu 2023, AJOG MFM) donne des taux bruts (endométrite 3,4 % vs 8,1 % globalement, toutes
préparations confondues vs aucune) — utilisable comme **ordre de grandeur indicatif** pour juger si
l'effet est cliniquement non trivial (il l'est : un écart de plusieurs points de pourcentage sur un
critère infectieux), mais **ce n'est pas le chiffre de l'étude cible** et il ne doit pas lui être
substitué dans une entrée publiée.

### 5.4 — Cohérence entre sous-groupes/sensibilité

Résumé structuré : *« Subgroup and sensitivity analyses yielded consistent findings »* — cohérence
déclarée par les auteurs entre les sous-groupes prévus (statut du travail, rupture des membranes,
zone géographique) et les analyses de sensibilité (exclusion des préparations non liquides, exclusion
des essais jugés non fiables). Affirmation des auteurs, non vérifiable chiffre par chiffre sans le
texte intégral.

---

## 6. Validité externe & applicabilité

- Transposable à la patientèle MSP : **partiellement, avec la réserve posée au §2** — le geste est
  hospitalier/peropératoire, décidé par l'équipe obstétricale, pas par un acte ambulatoire MSP
  direct. Cohérent avec l'avis provisoire déjà porté sur la ligne de repérage (« C3 o avec réserve »).
- Comparateur et prise en charge réalistes en soins premiers : **sans objet direct** — le
  comparateur (« pas d'antisepsie vaginale ») est une pratique de bloc obstétrical, pas un choix
  fait en cabinet.
- Durée de suivi suffisante pour le critère : critères mesurés en post-partum immédiat/précoce
  (fenêtre standard pour endométrite/infection de paroi) — cohérent avec la littérature du domaine,
  pas de signal d'alerte identifié dans le résumé.

---

## 7. Cohérence & esprit critique

- Cohérent avec la totalité des preuves antérieures ? **Non isolé, mais pas non plus une simple
  confirmation** — c'est une **mise à jour du classement** entre agents (chlorhexidine devant
  povidone iodée), qui **contredit le rang établi par la NMA de référence de 2019** (Caissutti et
  al., même revue) sur la base d'un corpus élargi. C'est le point qui justifie potentiellement le
  franchissement du seuil C1 (§6bis SOP) — pas l'effet « antisepsie vs rien », déjà bien établi et
  non nouveau en soi.
- Spin détecté ? **Aucun signe dans le résumé** — au contraire, les auteurs eux-mêmes relativisent
  leurs résultats les plus flatteurs (clindamycine/cétrimide « few, small trials »), signalent le
  changement de conclusion par rapport à la littérature antérieure sans le maquiller, et ont ajouté
  un contrôle d'intégrité des essais (TRACT) rarement vu dans ce type de publication.
- Signaux d'alerte (arrêt précoce, financement industriel + résultat favorable, critère modifié,
  post-hoc présenté comme principal) : **financement non disponible** (§1) — à vérifier avant
  publication ; aucun autre signal identifié dans le résumé structuré.

---

## 8. Niveau de preuve (GRADE simplifié)

**Provisoire : Modéré** (pas de case cochée définitivement — élément décisif manquant : texte
intégral).

Justification : design robuste sur le papier (RCT + quasi-RCT, RoB2 en double lecture, TRACT,
recherche exhaustive incluant littérature grise, cadre bayésien avec diagnostics d'incohérence
prévus) ; grand effectif (50 essais, 14 515 participantes) ; critères cliniques pertinents, pas de
substitution ; **mais** limites inhérentes à toute NMA (comparaisons indirectes, incohérence non
quantifiée ici), inclusion de quasi-randomisés, biais de publication non évalué dans ce qui est
accessible, et les bras les moins bien representés (clindamycine, cétrimide) explicitement fragiles
selon les auteurs eux-mêmes. **Ne pas monter à « élevé » avant lecture du texte intégral** (I²,
funnel plot, répartition du RoB par étude).

---

## 9. Classement pour l'outil (proposition Agent A — à réconcilier avec Agent B, tranché par Agent C)

| Champ | Valeur proposée | Confiance |
|---|---|---|
| Thème(s) | `sante-femme-perinatalite` (donné) | — |
| Profession(s) concernée(s) | `sage-femme` (proximité la plus directe) — **réserve** : le choix du protocole d'antisepsie de bloc n'est typiquement pas une décision de sage-femme seule ; aucune des 4 autres professions MSP (MG, IPA, orthophoniste, IDEL) n'est concernée par ce geste. **Point à trancher par Agent C** : est-ce même pertinent de publier ce sujet comme « concernant » une profession MSP au sens où l'outil l'entend ? | Faible — nécessite un jugement d'organisation des soins hors de ma compétence de contenu |
| **Niveau d'impact** | **Informatif**, proposition — le sujet est solide et le classement agent-vs-agent est un déplacement réel de littérature, mais le geste évalué n'est pas une décision prise en consultation MSP (C1/C3 fragiles, cf. §2 et §6) | Modérée |
| Pertinence pratique | Faible à modérée pour un lecteur de MSP directement ; plus pertinente pour qui participe à des protocoles de maternité | — |
| Temps de lecture estimé (min) | 4–5 min pour une entrée « analyse » standard | — |
| Impacte un algorithme ? | **Non** — le module Décision ne couvre à ce jour que le domaine DT2 (`CLAUDE.md`, D8) ; `sante-femme-perinatalite` n'a pas encore de nœud de décision. `concerne_decision: non` | Élevée |

**Route** : l'item est déjà en route `analyse` (critère d'entrée dans ce circuit, §7bis). Je note
pour Agent C, sans le trancher moi-même, que le franchissement du seuil C1/C3 (§6bis SOP) me
paraît **plus faible que la formulation provisoire de la ligne de repérage** ne le suggère — la
réserve C3 déjà posée au repérage me semble sous-estimée plutôt que sur-estimée, une fois le geste
resitué comme hospitalier/peropératoire.

`meta.relecture_referent` : `false` (imposé par le circuit §7bis, indépendamment de ce qui précède).

---

## 10. Message pour la pratique (proposition, 2-3 lignes — à valider après réconciliation)

Chez les femmes césarisées sous antibioprophylaxie, une antisepsie vaginale (vs aucune) réduit
nettement le risque d'endométrite, d'infection/complication de paroi et de fièvre du post-partum —
ce n'est pas le message nouveau de cette étude. Ce qui est nouveau : sur un corpus élargi à 50
essais, la **chlorhexidine à concentration faible à moyenne** ressort devant la povidone iodée
1 % (référence antérieure), une inversion de classement à répercuter dans les protocoles de
maternité plutôt que dans la pratique individuelle en MSP. **Incertitude résiduelle** : effet
absolu et NNT non vérifiés faute d'accès au texte intégral ; chiffres de sous-groupe par moment de
césarienne (avant/pendant le travail) non confirmés en l'état — ne pas les citer nommément avant
vérification.

---

## 11. Ce que ce rapport ne garantit pas (angle mort assumé, §7bis)

- **Compétence clinique de fond sage-femme/obstétrique** : je n'ai pas la compétence pour juger si
  la conduite à tenir décrite (choix d'antiseptique, concentration) est déjà standard dans les
  maternités françaises ou représente un vrai changement de pratique locale — jugement hors de
  portée des trois agents du circuit §7bis, à traiter comme tel dans l'entrée publiée.
- **Texte intégral non lu** : risque de biais étude par étude, I², funnel plot, financement,
  tableaux d'effet absolu — tout ce qui exigerait l'accès Elsevier reste non vérifié par ce rapport.
  Je recommande de solliciter le référent pour un accès personnel/institutionnel avant publication,
  conformément à `recherche-source-primaire`.
- **Fiabilité de `WebSearch` pour des chiffres précis** : documentée comme défaillante sur ce
  dossier précis (§5.2) — à garder en mémoire pour les prochains items vérifiés dans les mêmes
  conditions (pas de connecteur PubMed disponible).
