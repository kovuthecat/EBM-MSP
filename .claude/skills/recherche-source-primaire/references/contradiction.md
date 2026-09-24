# Contradiction — comment contredire un dossier de preuve

La méthode de l'agent contradicteur (B), stable d'un lancement à l'autre. Elle dit **comment**
contredire ; elle ne dit ni quand lancer B, ni qui valide, ni le gabarit exact du rapport. Ces
points appartiennent aux circuits (`recherche-preuve-triangulee`, `verif-source-veille`) et à leurs
domiciles.

**Domiciles des principes, auxquels cette page renvoie sans les recopier** :

- Décision : `docs/decision/00-global.md` § Pipeline d'un nœud (étape 4) et § Règles de sourcing.
- Veille : `docs/veille/SOP_veille.md` §7 (bi-agents) et §7bis (tri-agents), `DECISIONS.md` D61.

**Qui valide ne change pas.** En Décision, c'est le référent (étape 6 de `00-global.md`). En veille
§7, l'orchestrateur réconcilie. En §7bis, l'agent C tranche selon la SOP et D61. Un rapport de
contradiction est une pièce du dossier, jamais une décision.

**Pourquoi cette page** (`docs/commun/2026-09-16-propositions-skills-recherche.md` P1, §13.2,
§13.3) : un contradicteur qui lit d'abord les conclusions d'A les attaque, mais il n'attaque que ce
qu'A a trouvé. Deux sources qui partagent leurs erreurs finissent par se confirmer l'une l'autre.
Le dépôt compte quatre erreurs partagées entre A et OpenEvidence sur un même chantier. Et les essais
manqués par A ont été rattrapés par OpenEvidence **par chance, pas par construction**.

---

## 1. D'abord une lecture indépendante (Décision)

B reçoit la question, ses sous-questions, le périmètre clinique et les pièces : sources
identifiées, fichiers locaux, état d'accès. Il reçoit les conclusions d'A et le retour
OpenEvidence **dans un second temps seulement**.

1. **Avant d'ouvrir A ou OE**, B écrit dans son rapport une section « Attendus », une ligne par
   sous-question décisive :
   - les **critères de jugement** qu'une réponse sérieuse devrait traiter (durs, de substitution,
     dommages) ;
   - les **chiffres attendus** et l'endroit où ils devraient se trouver (tableau principal,
     annexe, registre) ;
   - les **réserves attendues** : population, horizon, comparateur, biais prévisibles du design ;
   - les **études attendues**, et ce qu'en rapporte la passe d'omission (§2).
2. **Puis** B lit A et OE, et confronte chaque conclusion à ses attendus. Un attendu absent des deux
   rapports est un finding au même titre qu'un chiffre faux.
3. Les « Attendus » ne se réécrivent pas après lecture. Une correction se note à la suite, datée et
   motivée : c'est la trace de ce que B pensait avant d'être influencé.

**Coût.** La lecture indépendante peut se limiter aux **sous-questions décisives**, celles qui pèsent
sur le choix clinique. Les autres sont contredites directement sur le rapport d'A.

**Provenance.** Si A a fourni une liste d'essais à vérifier, les trouvailles faites à partir de
cette liste sont une **recherche complémentaire guidée**, pas une découverte indépendante. Le
rapport le dit.

## 2. Passe d'omission (N6) — adoptée le 2026-09-24

**Motif de l'adoption.** La mesure de référence
(`docs/commun/epreuves-recherche/mesures/2026-09-24-reference/rapport.md` § Omissions observées) a
mesuré des omissions sur le corpus d'épreuve : une pièce centrale absente d'un livrable, des études
et des faits non reliés à l'affirmation qu'ils éclairent. La proposition N6
(`2026-09-16-propositions-skills-recherche.md` §13.4) ne devait entrer que dans ce cas.

**Quand.** Sur les sous-questions décisives uniquement, pendant la lecture indépendante (§1), donc
**sans lire A**.

**Quoi.** Une recherche courte et bornée, sur trois voies :

| Voie | Ce qu'on cherche |
| --- | --- |
| **Études citantes des essais clés** | Suivi prolongé, réanalyse, critique publiée, essai plus récent qui cite l'essai clé. Publications du même essai : `scripts/identite.mjs` (voir `SKILL.md`). |
| **Registres** (ClinicalTrials.gov, registres d'essais) | Essais terminés sans publication, résultats déposés, protocole et plan d'analyse (critère préspécifié ou non). |
| **Résultat de sens contraire** | Une requête formulée pour trouver l'essai neutre ou négatif, la correction ou la rétractation, pas pour confirmer. |

**Budget.** Quelques requêtes par sous-question, pas une revue systématique. Aucune requête
OpenEvidence n'est consommée par cette passe : la règle d'accord préalable du référent s'applique à
toute question OE (voir `openevidence.md`).

**Sortie : la rubrique « Cherché, non trouvé par A ».** Elle se remplit après lecture d'A, en
comparant. Une ligne par recherche :

| Voie | Requête ou source, date | Trouvé | Présent chez A ? | Chez OE ? | Effet sur la conclusion |
| --- | --- | --- | --- | --- | --- |

- Une pièce trouvée qu'A n'a pas devient un finding d'origine **omission** (A seule, ou A et OE si
  aucun des deux ne l'a).
- « Cherché, rien trouvé » est une sortie valide, à condition d'avoir noté les voies et les
  requêtes. Un verdict d'absence reste une affirmation qui se source (`00-global.md` § Règles de
  sourcing : corpus local ouvert, deux méthodes d'extraction).

**Ce que la passe ne couvre pas.** Plusieurs échecs de la mesure de référence sont des lectures
fausses (mauvaise mesure d'effet, fait mal relié), pas des pièces manquantes. Ils relèvent des
angles d'attaque (§3), pas de cette passe.

## 3. Angles d'attaque

Ces angles organisent l'attaque. Ils **ne remplacent pas la grille**
`docs/veille/GRILLE_APPRECIATION.md`, qui reste l'instrument d'appréciation d'une étude. B vérifie
aussi comment A l'a remplie.

| Angle | Questions à poser au dossier |
| --- | --- |
| **Identité** | Le DOI, le PMID et l'essai sont-ils bien ceux de la phrase ? (`scripts/identite.mjs`, `acces-identite.md`) Un PMID recopié d'OE ne vaut rien (`00-global.md` § Règles de sourcing). |
| **Attribution** | La référence, exacte, **soutient-elle la phrase** ? Rouvrir le passage : une référence réelle qui ne dit pas ce qu'on lui fait dire est l'erreur la plus fréquente (§14.2). |
| **Méthodes** | Design réel (prospectif, rétrospectif, randomisé), critère préspécifié ou exploratoire (protocole, plan d'analyse, registre), durée, perdus de vue. |
| **Biais** | Risque de biais selon le design (sections de la grille), conflits d'intérêts, arrêt précoce, sous-groupes. |
| **Statistiques** | Mesure d'effet d'origine (HR, RR, OR : non interchangeables), risque cumulé ou taux d'événements, ITT ou per-protocole, test et seuil prévus au protocole, intervalle de confiance, signe et sens des bornes recopiés sans perte. |
| **Portée** | Population, comparateur, horizon, critère : l'affirmation dépasse-t-elle ce que l'étude a mesuré ? Applicabilité au périmètre du nœud. |
| **Accès** | L'état d'accès déclaré est-il le bon ? (vocabulaire et voies : `acces-identite.md`) Un accès « fermé » non éprouvé sur les voies légales est un finding. |
| **Spin** | Le relais (abstract, presse, résumé d'OE) dit-il plus que la source ? Chaque chiffre se vérifie contre la source, **jamais contre un relais**. |

**Retirer une objection qui ne tient pas.** Un contradicteur qui maintient un défaut par principe
est aussi inutile qu'un analyste complaisant (`verif-source-veille` SKILL.md). Une objection
retirée n'est pas effacée (§5).

## 4. Erreurs partagées : l'accord n'est pas une preuve

Plusieurs modèles peuvent partager les mêmes sources et les mêmes erreurs. **Leur accord n'augmente
pas le niveau de preuve.**

- Quand A et OE donnent le **même** chiffre décisif, B revient au **passage source**. L'accord ne
  dispense pas de cette lecture : il la rend prioritaire, car une erreur commune signale souvent une
  source secondaire commune.
- Une affirmation n'est « confirmée » que si B a lu le passage (localisation, mode d'accès). Sinon
  elle reste non vérifiée, même si A et OE concordent.
- Les publications d'un même essai (princeps, sous-groupe, suivi, préprint) ne sont pas des
  confirmations indépendantes. On les relie par l'identifiant de registre (`scripts/identite.mjs`).
- Les modèles d'OE ne sont pas trois votes. Ce sont trois relais à contrôler (`openevidence.md`).

## 5. Ce que le rapport conserve

- **Confirmations obtenues** : section distincte des findings. Ce qui a été vérifié et tient, avec
  la localisation du passage.
- **Objections retirées** : chacune avec le passage qui l'a fait tomber. Elles montrent ce qui a été
  éprouvé, et évitent qu'un tour suivant la relance.
- **Provenance de chaque conclusion** : lecture indépendante (§1), passe d'omission (§2),
  recherche guidée par A, reprise d'A ou d'OE. Les origines des findings (OE seule, A et OE, A
  seule, source elle-même, non vérifiable, omission) et le gabarit du rapport sont fixés par le
  circuit.

## 6. Chiffres dérivés

Le statut d'un chiffre dérivé (NNT, différence absolue, conversion) suit le **Format du registre**
(`registre-affirmations.md` § Format, « Syntaxe du Calcul ») : `publié`, `recalculé : …` avec ses
données d'entrée, ou `non calculable : <motif>`. Le domicile de cette syntaxe est cette section,
pas ici.

B vérifie les points suivants :

- tout chiffre dérivé porte l'un des trois statuts ;
- un recalcul donne ses données d'entrée, son horizon et sa méthode ;
- aucun chiffre recalculé n'est présenté comme extrait de l'article ;
- la mesure d'effet d'origine est conservée : pas de conversion improvisée d'une mesure relative en
  NNT sans risque de base publié.

**« Non calculable » est une sortie valide.** Un NNT inventé pour remplir la case est un finding.

## 7. En veille (§7 et §7bis)

La lecture est **parallèle et isolée** dès le départ : A et B lisent la même source primaire sans se
voir. Les règles sont celles de `docs/veille/SOP_veille.md` §7 et §7bis (réconciliation, C,
`meta.relecture_referent`, report) et de `DECISIONS.md` D61. Le déroulé est dans
`verif-source-veille`. Cette page ne les reformule pas.

Ce qui s'y applique d'ici :

- les angles d'attaque (§3) ;
- l'accord n'est pas une preuve (§4) ;
- la conservation des confirmations et des objections retirées (§5) ;
- les chiffres dérivés (§6).

La lecture indépendante (§1) y est acquise par construction. La passe d'omission (§2) n'y est pas
ajoutée : la recherche complémentaire de B y reste celle que prévoit la SOP.
