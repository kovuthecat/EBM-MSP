# Note d'orchestration — dossier « iSGLT2 et DFG bas » (nœud `prescription`)

Circuit `recherche-preuve-triangulee`, étape 1→2 (transmission à Agent B). Rédigée en l'absence du
référent — **aucune nouvelle requête OpenEvidence n'est autorisée tant qu'il n'a pas tranché** les
points de la section finale.

## État des lieux

**Agent A** — rapport de collecte rendu. Non repris ici (hors objet de cette note) ; transmis à
Agent B sous son statut habituel, pièce de travail principale du red-team.

**OpenEvidence (CLI Interface-OE)** — commande sortie en **code 1**. D'après
`docs/commun/OUTIL-INTERFACE-OE.md` : « réponse incomplète ou erreur d'écriture […] ne pas s'appuyer
dessus sans vérifier ». Le fichier écrit, `epreuve/entrees/OE-isglt2-dfg-bas.md`, le confirme et le
signale lui-même en tête (`⚠️ Extraction incomplète`), conformément à ce que prévoit le skill pour ce
code de sortie : « la réponse est incomplète et le dit en tête — ne pas la passer à Agent B comme si
elle était entière. »

Détail de ce qui a été récupéré :

- **Q1** (essais ayant inclus un DFG 20-30) — réponse présente mais **purement qualitative** : aucun
  effet absolu chiffré, aucun NNT/IC/horizon, et les appels `[1][2][3]` ne renvoient à **aucune**
  section Références (non récupérée). Même complète en apparence, Q1 ne satisfait donc pas le
  gabarit exigé de l'agent A/skill (chiffre + PMID/DOI) et reste **non vérifiable en l'état** — un
  simple repérage de piste, pas un résultat.
- **Q2** (effet absolu chiffré dans le sous-groupe DFG < 30) — **tronquée en pleine phrase**, avant
  l'apparition d'un seul chiffre. Rien d'exploitable, y compris comme piste.
- **Q3** — **absente** : la réponse s'arrête avant de l'atteindre. Aucun contenu à évaluer.
- OpenEvidence a posé une **question de clarification** (population avec ou sans albuminurie élevée)
  restée sans réponse de notre part, et a **répondu quand même** en insérant de lui-même l'hypothèse
  « population mixte », jamais validée côté projet. C'est une hypothèse silencieuse embarquée dans le
  texte, pas un paramètre de la question posée — à traiter comme telle, pas comme un fait acquis.
- Aucun PMID n'est listé (pas de section Références) : rien à recopier, donc rien à écarter ici. Pour
  mémoire, si des PMID étaient réapparus lors d'une éventuelle reprise, la règle projet reste
  qu'**aucun PMID rendu par OpenEvidence ne se recopie tel quel** (`docs/decision/00-global.md` —
  6/7 faux constatés sur un dossier antérieur).

## Ce qui est transmis à Agent B, et sous quel statut

1. **Rapport Agent A** — transmis intégralement, statut normal (source de travail principale du
   red-team, comme prévu par le circuit).
2. **`OE-isglt2-dfg-bas.md`** — transmis, mais sous statut explicite **« débroussaillage partiel, non
   exploitable en l'état »**, pas comme un des deux retours combinés à parité avec Agent A :
   - **Q1** : à traiter comme une **piste à vérifier indépendamment** sur les connecteurs primaires
     (PubMed, ClinicalTrials.gov — cf. `recherche-source-primaire`), jamais comme un résultat déjà
     établi. Si Agent B ne retrouve pas la même chose en primaire, ce n'est pas une divergence à
     escalader au même titre qu'une erreur d'un retour complet — c'est l'issue attendue d'une piste
     non sourcée.
   - **Q2 et Q3** : à noter **« non traité par OpenEvidence — absent »**, pas à deviner ni à
     compléter en cherchant « ce qu'OE aurait probablement répondu ». Le vide se comble par la
     recherche primaire d'Agent B, pas par une reconstruction du retour manquant.
   - **Hypothèse « population mixte »** : à ne pas hériter silencieusement. Agent B la reformule
     comme point ouvert (« stratification albuminurie non tranchée par le projet ») plutôt que de
     l'accepter comme cadrage de la question.
3. Gabarit de sortie d'Agent B inchangé par ailleurs (findings par sévérité/origine, confirmations
   obtenues, verdict par sous-question, proposition de libellé) — avec un verdict explicite pour Q2 et
   Q3 du type « non évaluable sur cette passe, aucune donnée OE disponible », distinct d'un verdict de
   fond.

## Ce qui reste ouvert

- **Q2 et Q3** n'ont, à ce stade, aucune couverture OpenEvidence. Si elles portent un point
  décisionnel pour le nœud (probable : l'effet absolu chiffré en DFG < 30 est le cœur de la question
  clinique), le dossier ne peut pas boucler sur elles sans soit une recherche primaire directe
  suffisante par Agent B, soit une reprise d'OpenEvidence — cette deuxième option est bloquée (cf.
  section suivante).
- **Statut de la requête OE côté quota** : `OUTIL-INTERFACE-OE.md` précise que le code 2 (arguments
  invalides) ne consomme aucune requête, mais ne dit rien d'équivalent pour le code 1. Il faut
  considérer par prudence que la requête a été **consommée** (elle a tourné et produit du texte,
  contrairement à un rejet avant exécution) — donc qu'une reprise est une nouvelle sollicitation du
  budget/compte de Thibault, pas une opération neutre.
- **Pertinence d'une reprise de conversation** (`--conversation <id>`) une fois l'accord obtenu : la
  question porte sur des essais rénaux internationaux indexés (pas des sources FR), donc a priori
  hors du problème de périmètre connu d'OE sur HAS/SFD/CMG/Prescrire — mais ça reste au référent de
  juger si la reprise vaut la sollicitation, vu l'incident déjà en cours sur cette conversation.

## Ce que le référent doit trancher

1. **Autoriser ou non une reprise OpenEvidence** sur cette même conversation pour obtenir Q2, Q3 et la
   section Références — **aucun appel CLI ne sera passé avant son accord explicite**, conformément à
   la consigne reçue et à la règle de politesse du budget (`OUTIL-INTERFACE-OE.md` §Le coût : jamais
   de rafale décidée seule).
2. Si la reprise n'est pas possible à court terme (référent injoignable) : **accepte-t-il que le
   circuit avance sans donnée OE sur Q2/Q3**, en s'appuyant uniquement sur la recherche primaire
   directe d'Agent B, quitte à rouvrir un tour OE plus tard si des `[À VÉRIFIER]` décisionnels
   subsistent ?
3. **Stratification albuminurie** : le nœud doit-il distinguer les patients avec/sans albuminurie
   élevée pour la question DFG bas + iSGLT2, ou une population mixte est-elle acceptable pour ce
   nœud ? Ce choix cadre la suite de la collecte indépendamment du sort d'OpenEvidence.
4. Faut-il conserver `OE-isglt2-dfg-bas.md` tel quel comme trace de l'incident (échec partiel
   documenté), ou le remplacer une fois une reprise obtenue ?

## Garde-fous rappelés pour cette étape

- Aucune nouvelle requête OpenEvidence sans accord explicite du référent (consigne de la tâche +
  règle de coût du projet).
- Le retour OE, complet ou non, reste du débroussaillage — jamais une source primaire
  (`docs/decision/00-global.md` §2, invariant 6 de `CLAUDE.md`).
- Aucun PMID/DOI éventuel issu d'OpenEvidence ne se recopie sans vérification en primaire, quelle que
  soit la passe.
