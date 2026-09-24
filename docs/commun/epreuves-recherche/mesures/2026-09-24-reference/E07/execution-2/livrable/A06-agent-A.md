# A06 — Rapport Agent A (analyste/extracteur) — Vérification bi-/tri-agents §7bis

**Statut du document :** en cours de rédaction, écrit au fil de l'eau (§7bis, `verif-source-veille`).
**Thème :** `sante-femme-perinatalite` → circuit tri-agents. Un Agent C tranchera les désaccords
avec le rapport de l'Agent B (travail parallèle, non vu par le présent agent). `meta.relecture_referent: false` in fine —
la décision de fond revient à l'Agent C, pas au référent (pas de compétence obstétricale de fond côté référent).
**Contrainte de séance :** aucune requête OpenEvidence autorisée pour ce travail (respect strict de l'instruction).

---

## 0. Identité de la source — à confirmer avant toute appréciation

Source annoncée par la ligne de repérage (`epreuve/entrees/reperage-A06.md`) et par la mission :

- Garabedian C, Sénat M-V, Sananès N, et al. « [Titre à confirmer — vraisemblablement : Diabète
  antérieur à la grossesse. Consensus formalisé d'experts CNGOF-SFD] ». *Gynécologie Obstétrique
  Fertilité & Sénologie*. 2026;54:132-164. DOI: 10.1016/j.gofs.2025.12.001.

Recherche d'accès en cours (PubMed → DOI direct → PMC → preprint si verrouillé). Section mise à
jour dès confirmation.

**Note d'outillage** : les outils PubMed MCP (`lookup_article_by_citation`, `search_articles`) sont
refusés dans cette session (permission « don't ask mode »). Bascule sur `WebSearch`/`WebFetch` pour
la confirmation d'identité et l'accès au texte — pas une requête OpenEvidence, autorisé.

**Confirmation d'identité (WebSearch)** : titre exact retrouvé — « Diabète antérieur à la grossesse :
consensus formalisé d'experts du collège national des gynécologues et obstétriciens français et de
la société française de diabétologie ». Version accessible en texte intégral, publiée en libre accès
par le CNGOF lui-même (pas un contournement de paywall — publication ouverte de la société savante) :
`https://cngof.fr/app/uploads/2026/05/CFE-diabete-anterieur-2026.pdf`. Version éditeur (résumé/accès
payant probable) repérée sur ScienceDirect : `https://www.sciencedirect.com/science/article/abs/pii/S2468718925004088`
et EM-Consulte : `https://www.em-consulte.com/article/1783532/`. Récupération du PDF CNGOF en cours
pour lecture intégrale.

**Identité confirmée.** Titre exact : « Diabète antérieur à la grossesse : consensus formalisé
d'experts du collège national des gynécologues et obstétriciens français et de la société française
de diabétologie » (titre anglais : *Preexisting diabetes: Expert consensus from the College of
French Gynecologists and Obstetricians and from the French Society of Diabetology*). Auteurs (au
moins 4 confirmés + « et al. ») : Garabedian C, Sénat M-V, Sananès N, Berveiller P, et al. Revue :
*Gynécologie Obstétrique Fertilité & Sénologie*, 2026;54:132-164. Concorde avec la ligne de repérage.

### ⚠️ Avertissement méthodologique sur le canal de lecture utilisé

Le `Read` natif ne peut pas rendre ce PDF dans cette session (`pdftoppm`/poppler absent, pas d'outil
Bash disponible pour un `pdftotext` de secours) et deux tentatives de `WebFetch` directes sur le PDF
brut échouent (« PDF corrompu/encodé », le petit modèle de conversion ne décompresse pas les flux
FlateDecode). **Solution de repli retenue** : passage par un proxy de lecture (`r.jina.ai`, lecture
du même PDF, hébergé en accès libre par le CNGOF — pas un contournement de paywall) puis extraction
par le modèle de `WebFetch`. Ce canal n'est **pas équivalent à une lecture directe du PDF** : un
premier essai a produit une incohérence interne (trois propositions numérotées identiquement
« 2.7.2 » vs., à la requête suivante, une proposition unique 2.7.2 regroupant les trois éléments) —
corrigée en reformulant la question, mais qui démontre que le canal peut reformuler/halluciner sans
signal d'alerte visible. **Toute citation ci-dessous reliée à ce canal est donc triangulée sur au
moins deux extractions indépendantes (deux appels `r.jina.ai` + un appel `WebFetch` direct sur la
page éditeur EM-Consulte) avant d'être retenue comme fiable** ; les points qui n'ont pu être
confirmés que par ce canal seul sont marqués `NON VÉRIFIÉ (partiel)`, conformément à la discipline de
citation de `recherche-source-primaire`. Aucun de ces trois chiffres n'a pu être confirmé par une
lecture humaine ou un extracteur PDF déterministe dans cette session — **à signaler à l'Agent C**
comme limite de la présente vérification, indépendamment de son verdict de fond.

---

## 1. Identification

| Champ | Réponse |
|---|---|
| Titre | Diabète antérieur à la grossesse : consensus formalisé d'experts du CNGOF et de la SFD |
| Source (revue/site) | *Gynécologie Obstétrique Fertilité & Sénologie* (GOFS, Elsevier) ; texte intégral en accès libre chez l'éditeur méthodologique CNGOF (cngof.fr) |
| DOI / lien | 10.1016/j.gofs.2025.12.001 · éditeur : sciencedirect.com/science/article/abs/pii/S2468718925004088 · texte intégral CNGOF : cngof.fr/app/uploads/2026/05/CFE-diabete-anterieur-2026.pdf |
| Année | 2026 (vol. 54, p. 132-164) |
| Type de publication | **Recommandation** — Consensus Formalisé d'Experts (CFE), méthode Delphi. Ni ECR, ni méta-analyse, ni cohorte : pas d'étude primaire, un corpus de propositions de bonne pratique votées par un panel d'experts. |
| Financement & conflits d'intérêt | **Non trouvés dans le texte extrait** par le canal de lecture disponible (aucune section financement/COI retournée sur trois interrogations ciblées). Ne pas conclure à une absence réelle — le document en fait probablement mention dans une section non capturée par l'extraction (fin de document, remerciements) : **à vérifier par un accès natif au PDF** avant classement définitif. |
| Registre / protocole pré-enregistré ? | Sans objet au sens RoB2 (pas un essai) — **méthode déclarée** : Delphi à un seul tour, 65 relecteurs externes, 25 items, critère de validation ≥ 75 % des réponses dans la même section + médiane ≥ 7 ; les 25 items validés dès le tour unique. |

---

## 2. Question (PICO) — adapté (document de recommandation, pas d'étude comparative)

- **P** (population) : femmes avec diabète préexistant à la grossesse (type 1 et type 2), en
  période préconceptionnelle, pendant la grossesse, l'accouchement et le post-partum ; volet
  nouveau-né inclus. Cinq domaines couverts : préconception, grossesse, naissance, post-partum,
  nouveau-né.
- **I** / **C** : sans objet (pas d'intervention comparée — propositions de bonne pratique)
- **O** : dépistage/surveillance des complications microangiopathiques (rétinopathie, néphropathie)
  et macroangiopathiques, cibles tensionnelles, organisation du suivi.
- Population ≈ patientèle MSP ? **Partiellement.** Le suivi de grossesse chez une diabétique
  préexistante n'est pas un premier recours MG isolé (filière spécialisée gynéco-obstétrique/
  diabétologique), mais la **période préconceptionnelle** (bilan, orientation, objectifs à annoncer)
  et la **coordination** avec les correspondants sont directement du ressort du MG/IPA.

---

## 3. Risque de biais — adapté (pas de grille RoB2/AMSTAR-2/observationnel applicable telle quelle)

Aucune des trois grilles standard ne s'applique à un document de recommandation par consensus formel.
Évaluation adaptée sur la rigueur du **processus de consensus** (proche de l'esprit AGREE-II, sans
prétendre à une évaluation AGREE-II complète) :

- [x] Méthode de consensus explicitée et reproductible (Delphi à tour unique, seuil de validation
  quantifié : ≥ 75 % réponses même section + médiane ≥ 7)
- [x] Taille du panel de relecture externe précisée (65 relecteurs)
- [ ] **Revue systématique de la littérature en amont du vote non confirmée dans l'extrait lu** — un
  CFE peut être soit adossé à une synthèse formelle de preuve par item, soit un pur avis d'expert
  sans revue systématique documentée par proposition ; le texte disponible ne permet pas de trancher
  ce point pour la proposition 2.7.2 spécifiquement.
- [ ] Composition du panel de cotation (nombre, pluridisciplinarité au-delà des 65 relecteurs
  externes) non confirmée dans l'extrait lu
- Financement/COI : voir §1, non confirmé

**Synthèse risque de biais :** **non évaluable au sens RoB2/AMSTAR-2** (nature du document). Sur le
plan de la rigueur procédurale du consensus, éléments favorables mais incomplets — **modéré à
prudent**, faute de confirmation sur la revue de preuve amont et les COI.

---

## 4. Critère de jugement

- Critère principal : sans objet — ce sont des **propositions de pratique**, pas un critère de
  jugement d'étude.
- Dur / substitution : sans objet.
- Composite ? Non.
- Pertinent pour le patient/praticien ? Oui — les trois propositions relayées sont directement
  actionnables (fréquence d'examen, seuil thérapeutique).

---

## 5. Résultats & taille d'effet — sans objet

Pas d'estimation d'effet (RR/HR/OR, NNT) : un CFE énonce des propositions de bonne pratique, il ne
quantifie pas un effet clinique. Champ non applicable au sens strict de la grille ; le niveau de
preuve sous-jacent (voir §8) reste néanmoins évaluable.

---

## 6. Validité externe & applicabilité

- Transposable à la patientèle MSP ? **Oui pour le repérage/l'orientation** (le MG est en première
  ligne pour le bilan préconceptionnel et l'annonce des objectifs), **non pour l'exécution du
  suivi spécialisé** (fond d'œil trimestriel, bilan rénal mensuel = filière spécialisée).
- Comparateur / prise en charge réalistes en soins premiers ? Oui — rien dans les 3 propositions
  n'exige un plateau technique hors filière ville-hôpital existante (ophtalmo, labo, mesure de TA).
- Durée de suivi suffisante ? Sans objet (pas un critère de suivi d'étude, mais une fréquence de
  surveillance récurrente pour toute la grossesse).

---

## 7. Cohérence & esprit critique

- Cohérent avec les repères usuels de suivi du diabète préexistant en grossesse (fond d'œil
  trimestriel, bilan rénal rapproché, cible TA <140/90 alignée sur les seuils habituels de
  l'HTA gravidique) — cohérence externe plausible, non vérifiée ici par comparaison formelle à
  d'autres CFE/RPC (hors périmètre de la présente vérification, réservé à l'Agent C si jugé utile).
- **Spin détecté ? Non identifié** dans le texte disponible ni dans la ligne de repérage — les trois
  chiffres relayés par la presse correspondent au texte de la Proposition 2.7.2 sans reformulation
  suspecte, et j'ai spécifiquement recherché (requête dédiée) une contre-indication ou une nuance de
  sévérité qui aurait pu être omise par le relais presse : **aucune n'apparaît dans le texte
  extrait** — le document énonce une surveillance intensifiée, pas de seuil d'exclusion de grossesse.
  Point à traiter avec prudence : cette recherche de nuance omise repose sur le même canal
  d'extraction limité (voir avertissement méthodologique) — une absence de mention n'est pas une
  preuve d'absence au même niveau de certitude qu'une lecture native.
- Signaux d'alerte (arrêt précoce, financement industriel, critère modifié, post-hoc présenté comme
  principal) : **sans objet** (pas un essai) ; financement/COI non confirmé (voir §1) — seul point
  à garder en réserve.

---

## 8. Niveau de preuve (GRADE simplifié)

**☒ Faible** (à discuter avec l'Agent C — voir justification)

Justification : le document est explicitement un **avis d'experts** structuré par consensus formalisé
(Delphi), **sans grade GRADE** — exemple retrouvé pour une autre proposition du même document :
« AVIS D'EXPERTS (Delphi : médiane 9, Accord 90,2 %) ». La proposition 2.7.2 (rétinopathie +
néphropathie + TA) partage un score unique (médiane 9, accord 89,3 %), ce qui indique un **vote
groupé des trois éléments**, pas trois votes indépendants — nuance absente du relais presse (qui les
présente comme trois recommandations distinctes ; elles le sont sur le fond mais pas sur le
processus de validation, ce qui n'invalide rien mais mérite d'être noté). Un CFE/avis d'experts se
situe structurellement au niveau **faible** de la hiérarchie GRADE (pas une synthèse de preuve
primaire graduée étude par étude) — sans que cela disqualifie sa valeur pratique : un consensus
formalisé de sociétés savantes reste une référence de pratique de haut niveau d'autorité
professionnelle, mais ce n'est pas la même chose qu'un niveau de preuve élevé au sens GRADE. **Ce
point de vocabulaire (autorité professionnelle ≠ niveau de preuve GRADE) doit figurer dans les
conditions de rédaction.**

---

## 9. Classement pour l'outil (proposition Agent A)

| Champ | Valeur |
|---|---|
| Thème(s) | `sante-femme-perinatalite` (confirmé) ; secondaire possible : `diabete-metabolisme` si ce thème existe encore dans la liste courante (à vérifier dans `BRIEF_VEILLE.md` §4, non present dans cet export réduit — signal à l'Agent C/référent) |
| Profession(s) concernée(s) | MG, sages-femmes (suivi préconceptionnel/coordination), gynécologues-obstétriciens, diabétologues/endocrinologues. IPA si périmètre le permet. |
| **Niveau d'impact** | **pratique** — les 3 éléments sont actionnables (déclenchent une orientation/un rythme de surveillance/une cible chiffrée) |
| Pertinence pratique | **forte** pour le repérage préconceptionnel et l'annonce des objectifs en MG ; **modérée** pour l'exécution du suivi (délégué à la filière spécialisée) |
| Temps de lecture estimé (min) | 3-4 min pour une entrée de veille (les 3 éléments + contexte méthodo) |
| Impacte un algorithme ? | **Non, en l'état** — aucun nœud/domaine périnatalité n'existe encore dans `/content` du module Décision (non scaffoldé dans cet export ; DT2 actuel = diabète de type 2 hors grossesse). **À signaler au référent** comme candidat possible à l'ouverture d'un futur domaine périnatalité (`DECISIONS.md` D8, multi-domaine par conception) plutôt qu'à la modification d'un nœud existant — ce n'est pas à Agent A de trancher l'opportunité. |

---

## 10. Message pour la pratique (2-3 lignes)

Consensus formalisé CNGOF-SFD (avis d'experts, Delphi 1 tour, 25/25 items validés) : chez la femme
avec diabète préexistant, proposer fond d'œil trimestriel (mensualisable si progression), bilan
rénal en préconception puis mensuel si néphropathie diagnostiquée, et cible tensionnelle <140/90
mmHg en cas d'HTA associée. Degré de certitude : **avis d'experts, pas une preuve GRADE élevée** —
autorité de société savante forte, mais à ne pas présenter comme un niveau de preuve fort. Aucune
contre-indication de grossesse liée à la sévérité des complications n'est énoncée dans le texte
disponible.

---

## Vérification des trois éléments relayés par la presse

| # | Élément relayé (repérage) | Concordance avec le texte source | Nuance / réserve |
|---|---|---|---|
| 1 | Dépistage rétinopathie — ophtalmo trimestriel | **Confirmé**, texte quasi-identique : « suivi ophtalmologique trimestriel pendant la grossesse pouvant être mensualisé en cas de facteurs de progression » (Proposition 2.7.2) | Aucune contre-indication de sévérité mentionnée dans le texte disponible |
| 2 | Dépistage néphropathie — bilan rénal préconception puis mensuel si atteinte | **Confirmé** : « évaluation initiale de la fonction rénale avant la grossesse ou au premier trimestre […] puis un suivi mensuel pendant la grossesse en cas de diagnostic de néphropathie diabétique » (Proposition 2.7.2) | Bilan initial détaillé (créatinine, DFG, micro/macroalbuminurie) — le relais presse résume sans dénaturer |
| 3 | Objectif TA <140/90 | **Confirmé** : « En cas d'hypertension artérielle chez une femme diabétique, il est proposé d'avoir comme objectif une pression artérielle inférieure à 140/90 mmHg » (Proposition 2.7.2) | Cible conditionnée à la présence d'une HTA (le relais presse ne le précise pas explicitement mais ne le contredit pas non plus) |

**Verdict global sur le relais presse** : les trois chiffres sont fidèles au texte source, sans
cadrage trompeur détecté (pas de titre inversant le message, pas de comparateur travesti, pas de
transformation d'une équivalence en supériorité — pièges déjà rencontrés sur ce projet). La seule
nuance non explicitée par la presse est que les trois éléments relèvent d'un **vote Delphi unique et
groupé**, pas de trois évaluations indépendantes.

---

## Ce que cette vérification ne garantit pas (angle mort)

1. **Le canal de lecture** (proxy `r.jina.ai` + résumé `WebFetch`, faute d'extracteur PDF natif
   disponible dans cette session) n'est **pas un accès direct fiable à 100 %** au texte source — un
   incident de reformulation interne a été détecté et corrigé en cours de vérification, mais rien ne
   garantit qu'une autre partie du texte n'a pas subi la même dérive sans être détectée. Une relecture
   native du PDF (ou par l'Agent B/C, si outillage différent) reste souhaitable avant publication
   finale.
2. **Financement et conflits d'intérêt** non confirmés — absence dans l'extrait ≠ absence réelle.
3. Pas de vérification de la **méthode de revue de littérature amont** par item (le CFE est-il
   adossé à une synthèse de preuve formelle par proposition, ou un pur vote d'opinion sans revue
   systématique documentée ?) — non tranché par le texte disponible.
4. Aucune requête OpenEvidence n'a été effectuée (consigne de la mission), donc pas de
  triangulation via cet outil — seulement PubMed (outil refusé en session), WebSearch et WebFetch.
5. Compétence de fond obstétricale/diabétologique hors de portée de cet agent (thème
   `sante-femme-perinatalite` → circuit §7bis, tranché par l'Agent C, pas par le référent).

---

**Fin du rapport Agent A.** Prêt pour réconciliation par l'Agent C avec le rapport de l'Agent B.
