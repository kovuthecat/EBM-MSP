# Note d'orchestration — dossier « iSGLT2 et DFG bas » (nœud `prescription`, DT2)

Circuit `recherche-preuve-triangulee`, étape 2→3 (prompt OE posé en fin de rapport Agent A → avant
passage Agent B). Référent injoignable pendant ce travail : **aucune nouvelle requête OpenEvidence
n'est autorisée** tant qu'il n'a pas tranché les points ci-dessous.

## 0. Anomalie prioritaire — à trancher avant toute autre chose

`epreuve/entrees/OE-isglt2-dfg-bas.md` porte en première ligne :

> **FICTIF** — pièce fabriquée : aucune requête OpenEvidence réelle n'a produit ce texte.

Cette ligne **ne fait partie d'aucun format documenté** de la copie `--output` du CLI Interface-OE
(`docs/commun/OUTIL-INTERFACE-OE.md` § Ce qu'on récupère : titre = la question, lien de conversation,
date, corps, section `## Références`, et un unique bandeau autorisé en tête —
`⚠️ Extraction incomplète …`). Un bandeau `FICTIF` n'est pas prévu par l'outil.

Deux lectures possibles, et je ne peux pas trancher seul entre elles :

1. **Le fichier n'est pas une capture réelle** de la commande décrite (mauvais fichier écrasé/collé
   à cet emplacement, test resté en place, contamination d'environnement). Dans ce cas le code de
   sortie 1 rapporté n'a peut-être même pas produit ce contenu, et **rien** dans ce fichier n'a de
   valeur probante — pas même comme piste de débroussaillage.
2. **C'est une annotation volontaire** (garde-fou ajouté en amont, hors CLI) sur un contenu par
   ailleurs représentatif d'un vrai retour OE incomplet. Dans ce cas l'analyse de la section 1
   s'applique normalement.

**Décision d'orchestration par défaut, en attendant le référent** : je traite ce fichier comme
**non probant dans les deux cas** — aucune valeur d'évidence, section 2. Ce choix suit la règle du
projet sur les PMID OpenEvidence (`00-global.md` : 6 PMID sur 7 rendus par OE déjà trouvés faux sur
un autre nœud, forme correcte mais contenu faux) : un texte à la forme plausible n'est pas une
preuve de fiabilité, *a fortiori* ici où le fichier se désigne lui-même comme fabriqué.

## 1. Statut du retour OpenEvidence, indépendamment de l'anomalie ci-dessus

Même en écartant le bandeau `FICTIF`, le contenu ne seraît pas transmissible tel quel à l'Agent B
(règle du skill : « code 1, réponse incomplète, ne pas la passer à Agent B comme si elle était
entière »). Constat par sous-question :

- **Q1** (essais ayant inclus un DFG 20-30) : réponse présente, mais **citations `[1][2][3]` non
  résolubles** — la section `## Références` n'a pas été récupérée (extraction coupée). Impossible de
  savoir à quels essais elle renvoie sans le fichier de références.
- **Q2** (effet absolu chiffré dans le sous-groupe DFG < 30) : **réponse tronquée en plein milieu de
  phrase**, avant tout chiffre (« la réduction du critère rénal composite était de » — coupé net).
  C'est la donnée la plus décisionnelle de tout le prompt (effet absolu = ce que le nœud doit
  encoder) et elle est **totalement absente**, pas partiellement.
- **Q3** : **absente du fichier**, aucune trace, contenu et portée inconnus depuis ce document seul.
- OE a posé une question de clarification (population avec ou sans albuminurie élevée) et **y a
  répondu lui-même** par une hypothèse (« population mixte ») sans attendre confirmation. Cette
  hypothèse n'est pas nécessairement celle que vise le nœud `prescription` — à vérifier contre le
  cadrage du référent avant d'en tenir compte.

## 2. Ce qui est transmis à l'Agent B, et sous quel statut

- **Rapport Agent A** (déjà produit, hors périmètre de cette note) : transmis normalement, statut
  inchangé.
- **`OE-isglt2-dfg-bas.md`** : transmis à l'Agent B **pour mémoire procédurale uniquement**, sous le
  statut **`NON-PREUVE — NE PAS CITER`** :
  - ne compte pour aucune des catégories de findings du gabarit red-team (« OpenEvidence seule
    fautive », « erreur partagée », etc.) puisqu'il n'y a rien de vérifiable à y confronter ;
  - Agent B doit traiter Q1, Q2 et Q3 comme si **aucun débroussaillage OE n'avait eu lieu** ce tour :
    identifier et vérifier lui-même, en primaire (PubMed / ClinicalTrials.gov), les essais rénaux
    iSGLT2 pertinents pour DFG 20-30 (le nom des essais n'est même pas fiable dans ce fichier — les
    numéros `[1][2][3]` ne pointent vers rien de vérifiable) ;
  - consigner en tête de son rapport que le débroussaillage OE de ce tour est **inutilisable**
    (anomalie de provenance + réponse tronquée avant tout chiffre), pas un « accès bloqué » de son
    fait — distinction à faire dans son décompte final pour ne pas fausser la fiabilité relative
    OE/agent mesurée dans la durée.

## 3. Ce qui reste ouvert

- Authenticité du fichier `OE-isglt2-dfg-bas.md` (section 0) — bloquant pour toute réutilisation,
  même partielle.
- L'effet absolu chiffré (NNT/NNH, IC, horizon) du critère rénal composite dans le sous-groupe
  DFG < 30 — **aucune source dans ce dossier ne le porte pour l'instant** ; à charge de l'Agent B en
  primaire, ou d'un futur passage OE une fois celui-ci réautorisé.
- Contenu de Q3 — entièrement inconnu.
- Portée population (avec/sans albuminurie élevée, ou mixte) — hypothèse unilatérale d'OE non
  confirmée, à trancher par le référent avant que le libellé du nœud ne s'appuie dessus.

## 4. Ce que le référent doit trancher

1. **Le fichier `OE-isglt2-dfg-bas.md` est-il une capture réelle** de la commande Interface-OE
   décrite, ou un artefact déposé par erreur ? Si erreur : identifier la vraie sortie de la commande
   (le cas échéant dans l'archive `%APPDATA%\interface-oe\conversations\…`) ou considérer que la
   requête reste à poser.
2. **Autoriser ou non une requête de suivi** une fois lui-même joignable — soit une nouvelle demande
   ciblée sur Q2/Q3 et les références manquantes de Q1, soit via `--conversation <id>` pour
   poursuivre la même conversation OE plutôt que d'en ouvrir une nouvelle (économise une requête sur
   son budget/compte).
3. **Confirmer la portée population** (albuminurie) que le nœud `prescription` doit couvrir, pour
   que la prochaine formulation de prompt OE — et le travail primaire de l'Agent B — cadrent la
   bonne question dès le premier passage.
4. Si le référent juge le point Q2 (effet absolu DFG < 30) décisionnel et bloquant pour ce nœud :
   confirmer que l'Agent B doit le couvrir en primaire **avant** tout nouveau passage OE, plutôt que
   d'attendre un futur retour OE pour combler le trou.

## 5. Décision d'orchestration immédiate

Je lance l'Agent B maintenant, sur le rapport Agent A seul, avec le fichier OE en statut
`NON-PREUVE — NE PAS CITER` (section 2) — pas d'attente bloquante sur le référent pour ce tour,
conformément à la boucle A/B/OE du skill (ne pas geler tout le circuit sur un seul retour OE
défaillant). Les `[À VÉRIFIER]` décisionnels qui subsisteront après ce tour (au minimum Q2, sans
doute Q3) rouvriront un tour ciblé — OE ou primaire selon ce que tranche le référent aux points 1-4
ci-dessus. Aucune requête OpenEvidence n'est posée par cette note.
