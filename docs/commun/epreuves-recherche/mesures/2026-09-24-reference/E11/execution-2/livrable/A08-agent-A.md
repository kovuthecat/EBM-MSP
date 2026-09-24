# Vérification veille — item A08 — Rapport Agent A (analyste/extracteur)

**Circuit :** `verif-source-veille` §7bis (tri-agents) — thème `sante-femme-perinatalite`.
**Rôle :** Agent A, contexte isolé, n'a pas vu le travail de l'Agent B.
**OpenEvidence :** non interrogé (consigne explicite de la mission).
**Rédaction :** au fil de l'eau, au fur et à mesure de la vérification.

> Rappel de doctrine (skill) : `route` et `niveau_impact` sont des champs **distincts** — un
> classement qui conclut `informatif` est un résultat valide de ce travail, pas un échec.

---

## 0. Résumé exécutif (à lire en premier)

La source primaire est identifiée avec un fort degré de confiance (PMID 41485838). Les 4 chiffres
d'effet **globaux** (tous OR, tous critères) cités dans l'abstract structuré PubMed sont
**vérifiés**. En revanche, **les deux chiffres de sous-groupe repris par le repérage**
(OR 3,53 césarienne avant travail ; OR 2,79 en cours de travail) **sont introuvables dans
l'abstract** malgré une recherche ciblée — ils proviennent forcément du texte intégral (verrouillé,
403 confirmé sur `ajog.org` et `sciencedirect.com`, absent de PMC). Statut : **NON VÉRIFIÉ
(partiel)**, pas confirmé ni infirmé. Aucun effet absolu ni NNT n'est rapporté dans l'abstract — je
l'ai vérifié explicitement, ce n'est pas un oubli de ma part. Proposition de classement provisoire
en fin de rapport, avec `route: analyse` et forte réserve sur le niveau de preuve tant que le texte
intégral n'a pas été consulté par quelqu'un ayant un accès (institutionnel/personnel) — question à
poser au référent.

---

## 1. Identification

| Champ | Réponse |
|---|---|
| Titre | *Chlorhexidine is the preferred agent for vaginal antisepsis prior to cesarean delivery: a systematic review and network meta-analysis* |
| Auteurs | McKinney JA, Sanchez-Ramos L, Duncan J, Lin L, Rhoades C, Mateus J, Dussan LE, Nino G, Hansen A, Messiah C, Pomputius A — liste MEDLINE indique 12 auteurs au total ; seuls 11 noms individualisés ont pu être extraits du rendu du fetch, **à recompter sur le texte intégral** |
| Source (revue/site) | *American Journal of Obstetrics and Gynecology* (Am J Obstet Gynecol) |
| Volume/Numéro/Pages | 233(6S):S504.e1–S504.e41 |
| DOI | 10.1016/j.ajog.2025.09.046 |
| PMID | 41485838 |
| PII | S0002-9378(25)00719-7 |
| Date indexée MEDLINE | 2026 Jan (`DP`), `DCOM` 2026-01-04 — **écart avec le « 2025 » du repérage** : le PII contient « 25 » (dépôt/online-first 2025) mais la citation formelle NLM est « 2026 Jan ». Les deux sont défendables (online-ahead-of-print 2025 → parution en numéro 2026) ; **à trancher avant publication d'entrée** : citer l'année comme « 2025 (en ligne) / 2026 (parution) » plutôt qu'un seul millésime |
| Type de publication (NLM) | Journal Article · Network Meta-Analysis · Systematic Review — **ce n'est pas un résumé de congrès** : vérifié que SMFM a cessé de publier ses abstracts de congrès dans AJOG à partir de 2026 (bascule vers la revue *Pregnancy*), donc le suffixe « 6S » de ce numéro ne signale pas un supplément de congrès |
| Financement & conflits d'intérêt | **Non trouvé** dans les métadonnées PubMed/MEDLINE accessibles (champ `CI` = mention de copyright Elsevier uniquement ; aucun champ `GR`/financement). Nécessite le texte intégral — inaccessible à ce stade. |
| Registre / protocole pré-enregistré | PROSPERO **CRD42025649677**, retrouvé via recherche web tierce — **non confirmé en direct** : le fetch de la fiche CRD (`crd.york.ac.uk`) n'a renvoyé aucun contenu exploitable |

**Chemin d'accès tenté et statut :**
- `pubmed.ncbi.nlm.nih.gov/41485838/` (interface web) → bloqué par exigence de cookies, contourné via l'API publique NCBI E-utilities (`eutils.ncbi.nlm.nih.gov/.../efetch.fcgi`, contenu MEDLINE/abstract public, pas un contournement de paywall).
- `ajog.org/article/S0002-9378(25)00719-7/fulltext` → **403 Forbidden** (paywall confirmé).
- `sciencedirect.com/science/article/pii/S0002937825007197` → **403 Forbidden** (paywall confirmé).
- PMC : aucun `pmc_id` retrouvé (pas d'accès libre identifié).
- Preprint (medRxiv/bioRxiv) : recherche effectuée, **aucun retrouvé**.
- PROSPERO CRD42025649677 : fiche non chargée au fetch.
- → Texte intégral **non consulté**. Avant d'accepter un report pour inaccessibilité, il reste à
  demander au référent un accès personnel/institutionnel — je ne tranche pas ce point, je le signale.

---

## 2. Question (PICO)

- **P** : femmes enceintes subissant une césarienne, toutes sous antibioprophylaxie systémique (essais randomisés/quasi-randomisés inclus).
- **I** : préparation antiseptique vaginale — majoritairement chlorhexidine, plusieurs concentrations (repérées : 0,2 % ; plage « faible à moyenne » 0,12–0,5 % ; concentration non précisée dans certains bras).
- **C** : **réseau** de comparateurs — absence de préparation vaginale, povidone-iodine, autres concentrations de chlorhexidine. **Important pour la rédaction** : ce n'est pas une simple comparaison « chlorhexidine vs rien », c'est un classement en réseau (NMA) entre plusieurs agents/concentrations, dont la comparaison « chlorhexidine vs aucune préparation » n'est qu'un sous-résultat.
- **O** : endométrite, infection de plaie, complications de plaie, fièvre postopératoire. Pas de critère unique identifié comme « principal » dans l'abstract — 4 critères rapportés en parallèle.
- Population ≈ patientèle MSP ? **Partiellement.** Acte de bloc opératoire (préparation avant geste chirurgical en maternité), pas un geste ni une décision prise en MSP par le MG/la SF. Pertinence MSP = information/orientation de la patiente, pas protocole applicable en cabinet.

---

## 3. Risque de biais (méta-analyse/revue systématique, inspiré AMSTAR-2)

- [x] Question et critères d'inclusion pré-établis — PROSPERO CRD42025649677 (non confirmé en direct, cf. §1)
- [x] Recherche exhaustive — PubMed/MEDLINE, Embase, Web of Science, Scopus, Cochrane CDSR, CENTRAL + littérature grise, du 01/01/1990 au 24/01/2025 (confirmé dans l'abstract, section DATA SOURCES)
- [x] Évaluation du risque de biais des études incluses — **Cochrane Risk of Bias 2.0**, explicitement mentionné dans METHODS
- [~] Élément supplémentaire notable, absent de la grille standard : outil **TRACT** (*Trustworthiness in RAndomized Controlled Trials* checklist) utilisé pour évaluer l'intégrité des essais inclus — point positif à signaler, pertinent dans un champ (obstétrique) où plusieurs essais anciens ont posé question ailleurs
- [ ] Hétérogénéité (I²) — **non rapportée dans l'abstract** ; le texte mentionne une évaluation de « l'incohérence globale et locale » du réseau (network inconsistency), sans valeur chiffrée accessible
- [ ] Biais de publication (funnel plot etc.) — **non retrouvé** dans l'abstract, nécessite texte intégral

**Synthèse risque de biais : NON DÉTERMINABLE avec certitude sur les seules métadonnées accessibles.**
Éléments méthodologiques positifs et vérifiés (RoB2, TRACT, recherche multi-bases sur 35 ans,
approche bayésienne à effets aléatoires) mais des points structurants (I², biais de publication,
liste complète des 50 essais, financement/COI) restent hors de portée sans le texte intégral.

---

## 4. Critère de jugement

- Critère principal : non identifié comme unique — 4 critères cliniques rapportés en parallèle (endométrite, infection de plaie, complications de plaie, fièvre postopératoire).
- Dur ou substitution ? Critères cliniques directs (pas des marqueurs biologiques/imagerie), donc plus proches du **dur** que de la substitution, sans être des critères de mortalité/morbidité sévère (pas de sepsis grave ni de décès maternel rapporté dans les chiffres retrouvés).
- Composite ? Non — 4 critères séparés, chacun avec son propre OR.
- Pertinent pour la patiente ? Oui (infection post-partum, hospitalisation, antibiothérapie).

---

## 5. Résultats et taille d'effet

> Localisation : abstract structuré PubMed/MEDLINE, section **RESULTS** (PMID 41485838, consulté
> via NCBI E-utilities le 2026-09-24). **Pas de numéro de page/table** — le texte intégral paginé
> (S504.e1–S504.e41) n'a pas été consulté, donc aucune localisation plus précise qu'« abstract,
> section RESULTS » n'est possible à ce stade.

### Chiffres confirmés (abstract, comparaison réseau « aucune préparation vaginale » vs
### « chlorhexidine », concentration non spécifiée, modèle bayésien à effets aléatoires)

| Critère | OR | IC95 % (crédibilité, bayésien) | Statut |
|---|---|---|---|
| Endométrite | 3,65 | 2,36–5,90 | **VÉRIFIÉ** (abstract, RESULTS) |
| Infection de plaie | 2,34 | 1,66–3,36 | **VÉRIFIÉ** (abstract, RESULTS) |
| Complications de plaie | 2,28 | 1,65–3,32 | **VÉRIFIÉ** (abstract, RESULTS) |
| Fièvre postopératoire | 3,60 | 2,27–5,86 | **VÉRIFIÉ** (abstract, RESULTS) |
| Nombre d'essais / participantes | 50 essais / 14 515 participantes | — | **VÉRIFIÉ** (abstract) |
| Fenêtre de recherche bibliographique | 01/01/1990 → 24/01/2025 | — | **VÉRIFIÉ** (abstract, DATA SOURCES) |

Classement en sous-analyse par concentration (mentionné dans l'abstract, sans localisation plus
précise) : chlorhexidine 0,2 % — SUCRA 0,995 pour l'infection de plaie ; chlorhexidine
(concentration non précisée) — SUCRA 0,918 pour la fièvre. **Rappel méthodologique** : un SUCRA
élevé indique un bon rang probable dans le classement du réseau, ce n'est pas un intervalle de
confiance sur une comparaison pairwise — à ne pas présenter comme équivalent à une supériorité
statistique démontrée face à chaque comparateur pris isolément.

### Chiffres du repérage — NON RETROUVÉS dans l'abstract

| Chiffre repéré | Recherche effectuée | Résultat |
|---|---|---|
| OR 3,53 [2,09–6,57], endométrite, césarienne **avant travail** | Recherche des termes « prelabor », « 3.53 », « 2.09 », « 6.57 » dans le texte intégral de l'abstract MEDLINE | **Absents** du texte indexé par PubMed |
| OR 2,79 [1,32–5,88], endométrite, **en cours de travail** (intrapartum) | Recherche des termes « intrapartum », « 2.79 », « 1.32 », « 5.88 » | **Absents** du texte indexé par PubMed |

Ce que l'abstract confirme en revanche : « *labor status* » (statut du travail) fait bien partie
des **analyses de sous-groupe pré-spécifiées** (« Prespecified subgroup analyses examined labor
status, membrane rupture, and geographic setting »). Donc le sujet du sous-groupe existe belle et
bien dans l'étude — seules les **valeurs numériques** de ce sous-groupe échappent à ce qui est
indexé dans l'abstract PubMed.

**Statut : NON VÉRIFIÉ (partiel).** Je ne peux ni confirmer ni infirmer ces deux chiffres avec les
moyens d'accès légitimes épuisés à ce stade (PubMed, ScienceDirect, AJOG, PMC, preprint — tous
tentés, cf. §1). Une pondération grossière (3,53 et 2,79 vers un OR global 3,65 pour l'ensemble)
n'est pas mathématiquement incohérente avec les valeurs globales confirmées, ce qui rend ces deux
chiffres **plausibles** sans être vérifiés — à ne surtout pas confondre les deux statuts dans
l'entrée finale.

### Effet absolu et NNT

**Non rapportés dans l'abstract — vérifié explicitement** (question ciblée posée sur la présence
d'un risque absolu/différence de risque/NNT dans RESULTS : réponse négative). Une méta-analyse en
réseau bayésienne sur OR ne fournit pas nécessairement un risque absolu par bras dans son résumé ;
cela nécessiterait soit un tableau du texte intégral donnant les risques de base observés, soit un
calcul a posteriori — impossible sans ces données. **C'est un manque réel de cette vérification**,
pas un oubli de remplissage de la grille : la case « effet absolu / NNT » reste à vide tant que le
texte intégral n'est pas consulté.

### Correction au repérage

Le repérage provisoire notait *« C2 o (effet absolu marqué) »*. **Cette appréciation n'est pas
soutenue par les données accessibles** : aucun effet absolu n'est rapporté ni retrouvé à ce stade,
seulement des rapports de cotes (OR). Elle est probablement issue d'une lecture rapide confondant
« OR élevé » et « effet absolu marqué » — exactement l'écart que la grille (§5, note) met en garde
d'éviter (« un grand RR sur un petit risque de base = bénéfice absolu minime » ; ici on ne sait même
pas quel est le risque de base). À corriger dans le classement final.

---

## 6. Validité externe & applicabilité

- Transposable à la patientèle MSP ? **Partiellement.** Acte chirurgical hospitalier (bloc
  obstétrical), décision qui relève de l'équipe de la maternité, pas d'un protocole MSP.
- Comparateur et prise en charge réalistes en soins premiers ? **Non applicable** — la décision
  « quel antiseptique vaginal avant césarienne » n'est pas une décision de MG/SF en MSP.
- Durée de suivi suffisante pour le critère ? **Non retrouvée** dans l'abstract (fenêtre de suivi
  post-partum pour endométrite/fièvre non précisée dans le texte indexé) — à vérifier sur texte
  intégral.

---

## 7. Cohérence & esprit critique

- **Cohérence avec les preuves antérieures** : le champ est déjà dense — au moins deux NMA
  antérieures sur le même sujet retrouvées en recherche web (une AJOG ~2019-2020 concluant à la
  **povidone-iodine 1 %** comme agent préféré ; une AJOG MFM 2023 et un Journal of Hospital
  Infection 2024 sur la même question). **Le classement de l'agent « préféré » a donc varié d'une
  NMA à l'autre au fil du temps** — signal de prudence : ne pas présenter le résultat 2025/2026
  comme un point final définitif, mais comme la mise à jour la plus récente d'une littérature qui a
  déjà changé de conclusion au moins une fois.
- **Spin détecté** : le titre affirmatif (« Chlorhexidine **is** the preferred agent ») est une
  formulation catégorique pour un résultat de classement de réseau (SUCRA), alors que le réseau
  compare plusieurs agents/concentrations avec des intervalles parfois larges. Risque de survente
  du caractère définitif du classement — **condition de rédaction** : ne pas reprendre « l'agent
  préféré » comme un fait clos, le présenter comme le résultat d'un classement probabiliste (NMA +
  SUCRA), avec la réserve de cohérence historique ci-dessus.
- **Signaux d'alerte** : aucun signal classique retrouvé (pas de financement industriel détecté,
  pas d'arrêt précoce pertinent pour une NMA) — mais l'information financement/COI est simplement
  **non vérifiable en l'état** (cf. §1), pas confirmée « propre ».

---

## 8. Niveau de preuve (GRADE simplifié)

**□ Élevé · ☒ Modéré · □ Faible · □ Très faible** — **provisoire, sous réserve forte**

Justification : design méthodologique solide et vérifié (NMA bayésienne à effets aléatoires,
RoB 2.0, contrôle d'intégrité TRACT, recherche multi-bases sur 35 ans, 50 essais / 14 515
participantes, PROSPERO) — ce qui justifierait normalement un niveau élevé pour ce type de design.
Mais je maintiens **modéré** et non élevé tant que restent non vérifiés : (a) les deux chiffres de
sous-groupe travail/pas-travail repris par le repérage, (b) l'existence ou non d'un effet
absolu/NNT en table, (c) l'hétérogénéité (I²) et le biais de publication, (d) le financement/COI,
(e) l'historique d'instabilité du « agent préféré » selon les NMA successives sur le même sujet.
**Ne pas monter au-dessus de modéré avant consultation du texte intégral.**

---

## 9. Classement pour l'outil — proposition provisoire Agent A

| Champ | Valeur proposée |
|---|---|
| Thème(s) | `sante-femme-perinatalite` |
| Profession(s) concernée(s) | sage-femme, médecin généraliste (rôle d'information/orientation prénatale et post-natale) — pas de geste MSP direct concerné |
| **Route** | `analyse` — sujet cliniquement significatif (prévention de l'infection post-césarienne), mais nécessite la levée du doute sur les chiffres de sous-groupe et l'accès au texte intégral avant rédaction définitive |
| **Niveau d'impact** | `informatif` (et non `pratique`) — décision de bloc opératoire hors du périmètre d'action direct du MG/de la SF en MSP ; utile pour le dialogue avec la patiente, n'impacte aucun nœud identifié à ce stade |
| Pertinence pratique | modérée |
| Niveau de preuve | modéré (provisoire, cf. §8) |
| Temps de lecture estimé | 3–4 min |
| Impacte un algorithme ? | Non identifié à ce stade — sujet hors du périmètre ambulatoire DT2 actuellement couvert par le module Décision ; **à confirmer par le référent si un nœud périnatalité existe déjà ou est prévu** |
| `concerne_decision` | non (provisoire) |
| `meta.relecture_referent` | `false` — circuit §7bis, décision finale à l'Agent C (le référent n'a pas la compétence de fond validée sur ce thème) |

---

## 10. Message pour la pratique (2–3 lignes, provisoire — à revalider par Agent C)

Une méta-analyse en réseau récente (AJOG, 50 essais, 14 515 femmes) confirme qu'une préparation
antiseptique vaginale avant césarienne — la chlorhexidine ressortant en tête du classement —
réduit nettement le risque relatif d'endométrite, d'infection de plaie, de complications de plaie
et de fièvre du post-partum par rapport à l'absence de préparation. Décision de bloc opératoire,
hors du champ d'action direct du MSP — pertinent surtout pour l'information de la patiente.
**Ampleur réelle du bénéfice (effet absolu, NNT) et chiffres par sous-groupe travail/pas-travail
non vérifiés à ce stade** faute d'accès au texte intégral.

---

## 11. Ce que cette vérification ne garantit pas (angle mort)

- Je n'ai vu **que l'abstract structuré** (PubMed/MEDLINE), jamais le texte intégral, les tables ni
  les figures. Tout ce qui n'est pas dans l'abstract (sous-groupes chiffrés, effet absolu, I²,
  biais de publication, liste des 50 essais inclus, financement/COI, durée de suivi) reste une
  zone aveugle de ce rapport, pas une absence réelle dans l'article.
- Je travaille seul, en contexte isolé, sans avoir vu le travail de l'Agent B : mes propres erreurs
  de lecture de l'abstract (mauvaise attribution d'un chiffre à un critère, par exemple) ne sont
  pas encore croisées.
- Le doute sur l'année de publication (2025 en ligne vs 2026 en citation formelle) n'est pas
  tranché — les deux mentions coexistent légitimement dans le circuit éditorial d'AJOG, mais
  l'entrée finale doit choisir une formulation cohérente.
- Aucune tentative de contournement de paywall n'a été faite (invariant 7, `CLAUDE.md`) — les 403
  confirmés sur AJOG et ScienceDirect sont acceptés comme une limite réelle d'accès, pas contournés.

**Recommandation explicite à l'orchestrateur / au référent** : avant que l'Agent C tranche, vérifier
si quelqu'un (référent, Agent B, autre) dispose d'un accès personnel ou institutionnel à l'article
complet — c'est le point qui débloquerait le plus de doutes de ce rapport (chiffres de sous-groupe,
effet absolu/NNT, financement, I², biais de publication).
