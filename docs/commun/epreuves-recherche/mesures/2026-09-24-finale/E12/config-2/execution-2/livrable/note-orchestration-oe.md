# Note d'orchestration — retour OpenEvidence, dossier « iSGLT2 et DFG bas »

## Provenance

- Nœud : `prescription`, domaine DT2 — sous-question « iSGLT2 et DFG bas ».
- Circuit : `recherche-preuve-triangulee`, étape 3 (OpenEvidence) venant de se clore, étape 4
  (Agent B) à décider par cette note.
- Agent A : rapport rendu (non joint à cette étape — hors objet).
- OpenEvidence : accord du référent obtenu en amont pour la question de fin de rapport A ; CLI
  Interface-OE appelé ; **code de sortie 1** ; copie écrite à `epreuve/entrees/OE-isglt2-dfg-bas.md`.
- Référent injoignable pendant ce travail. **Aucune nouvelle requête OpenEvidence n'est lancée
  ici** — ni relance dans la conversation existante, ni question nouvelle.

## 1. Qualification du retour

Code 1 = « réponse incomplète, erreur d'écriture — ou `<CLI>` introuvable »
(`docs/commun/OUTIL-INTERFACE-OE.md` § Codes de sortie), deux cas que rien ne distingue au seul vu
du code. Je retiens ici **réponse incomplète**, pas `<CLI>` introuvable : la copie contient un lien
de conversation daté, un corps de réponse réel (Q1 traitée, Q2 entamée), et une auto-signalisation
« ⚠️ Extraction incomplète » — un `node` sur un chemin mort n'aurait produit aucun de ces éléments.
Cette lecture s'appuie sur le contenu de la copie, pas sur un contrôle `Test-Path` que je n'ai pas
vu tracé avant l'appel ; je le signale en point ouvert (§3) plutôt que de le donner pour acquis.

Fiche de retour (gabarit `openevidence.md` § 5), remplie avec ce qui est disponible :

```markdown
- Modèle demandé : non communiqué à cette étape (absent des éléments transmis)
- Modèle observé : absent — la copie ne porte aucune ligne « Modèle : », alors que le CLI est
  censé toujours l'écrire (« <nom> » ou « inconnu »). Anomalie d'outillage à signaler, distincte
  d'un modèle « inconnu ».
- Date : 2026-09-10 (antérieure à aujourd'hui, 2026-09-24 — écart non expliqué à ce stade)
- Prompt : titre de la copie, « Chez l'adulte DT2 avec un DFG entre 20 et 30 mL/min/1,73 m²,
  faut-il initier un iSGLT2 pour la protection rénale ? Réponds séparément à Q1, Q2 et Q3. » —
  le texte intégral (consignes DOI/citation, sources exclues) n'est pas reproduit par la copie ;
  sa conformité à `openevidence.md` § 6 n'est donc pas vérifiable depuis ce seul fichier.
- Lien de conversation : https://www.openevidence.com/ask/fictif-0000
- Conversation : neuve
- Durée : non mesurée à cette étape
- Complétude : **incomplet** ET **précision demandée** (statuts cumulés) — voir détail §2
- Références proposées : indéterminé — appels [1][2][3] dans le corps, section « Références »
  jamais récupérée
- Apport après vérification : sans objet — rien n'est encore passé par `identite.mjs` ni entré au
  registre
```

Statut « précision demandée » : OE ouvre sur une question à l'utilisateur (stratification par
albuminurie) puis répond **sans trancher**, « en supposant une population mixte ». C'est exactement
le signe décrit par `openevidence.md` § 4 (« ne répond que sous condition sans trancher la question
posée ») — même si la question arrive en tête de réponse et non en fin.

## 2. Contenu par sous-question

| Sous-question | Contenu | État |
|---|---|---|
| Préambule (population) | OE demande une précision albuminurie, répond sous hypothèse « population mixte » | Precision non obtenue — toute lecture de Q1 hérite de cette réserve de population |
| Q1 — essais ayant inclus un DFG 20–30 | 3 affirmations, citées [1][2][3] | Contenu présent mais **non vérifiable en l'état** : pas de section Références, donc aucune des trois affirmations ne peut être rattachée à une source primaire ni entrer au registre |
| Q2 — effet absolu du sous-groupe DFG < 30 | Phrase interrompue avant toute valeur chiffrée (« la réduction du critère rénal composite était de » — rien ensuite) | **Aucune donnée exploitable** |
| Q3 | Jamais atteinte | **Absente** — le prompt en demandait trois, la copie s'arrête en cours de Q2 |

## 3. Ce que je transmets à l'Agent B, et sous quel statut

Je transmets `epreuve/entrees/OE-isglt2-dfg-bas.md` à l'Agent B, avec le rapport d'Agent A et le
registre, comme prévu à l'étape 4. Mais avec ce statut explicite, à afficher tel quel dans le
rapport de B (`openevidence.md` § 4 : un retour `incomplet` ou `précision demandée` ne vaut ni
conclusion ni confirmation) :

- **Rien de ce retour ne confirme ni n'infirme quoi que ce soit.** B ne doit pas compter le
  chevauchement apparent entre une affirmation d'A et une phrase de Q1 comme une confirmation
  indépendante : sans la section Références, on ne sait même pas si Q1 cite les mêmes essais qu'A
  (risque de source secondaire commune, `contradiction.md` § pertinent) ou des essais différents.
- **Q1** : transmis comme trois pistes non sourcées ([1][2][3] sans cible), à traiter comme
  « cherché, non trouvé par A » si A ne les couvre pas, ou comme point de recoupement prudent si A
  les couvre déjà — jamais comme un chiffre ou une conclusion citable.
- **Q2 et Q3** : rien à transmettre. Les « Attendus » de B sur ces sous-questions (s'il y en a de
  décisives dans le cadrage) se confrontent au seul rapport d'A ; OE n'apporte rien ici.
- **Réserve de population** (albuminurie non tranchée) : à porter explicitement si une
  sous-question décisive du cadrage distingue les patients par albuminurie — sinon sans effet.
- **Modèle observé absent** : B ne doit pas supposer un modèle par défaut ni inférer le modèle du
  style de réponse (interdit explicitement par `openevidence.md` § 3).

## 4. Ce qui reste ouvert

| Point | Nature | Suite |
|---|---|---|
| Q2 sans valeur, Q3 absente, section Références jamais récupérée | Source (la conversation OE) probablement disponible mais incomplètement consultée | Relance possible dans la même conversation (`--conversation`), **mais nouvel accord du référent obligatoire** — pas engagée ici |
| Ligne « Modèle : » absente de la copie | Anomalie d'outillage, pas un point de contenu | À signaler au référent / à Interface-OE ; ne bloque pas B mais prive la fiche d'un contrôle attendu |
| Modèle effectivement demandé au départ | Information non transmise à cette étape | À retrouver dans le journal de recherche du chantier avant la synthèse — je ne le devine pas |
| Écart de date (copie datée du 2026-09-10, aujourd'hui le 2026-09-24) | Incohérence non expliquée | À vérifier avant d'exploiter la copie dans la synthèse ; ne bloque pas le lancement de B |
| Albuminurie non tranchée par OE | Arbitrage de portée clinique, pas un manque de recherche | Options à présenter au référent ; pas de relance sur ce seul motif |
| Ambiguïté « réponse tronquée » vs « `<CLI>` introuvable » sur le code 1 | Résolue par lecture du contenu (§1), non par un contrôle `Test-Path` tracé | Signaler au référent comme rappel de procédure pour le prochain appel, pas une action à mener maintenant |

Aucun de ces points ne se résout par une nouvelle requête OE décidée ici : pas d'accord du
référent obtenu pour cela, et il est injoignable.

## 5. Ce que le référent doit trancher

1. **Autoriser ou non une relance** dans la conversation `fictif-0000` (`--conversation`) pour
   obtenir Q2, Q3 et la section Références — avec quel modèle (même modèle, ou motif de
   changement), et quel contexte générique donner pour lever l'ambiguïté albuminurie, sans donnée
   patient.
2. **Se prononcer sur le périmètre de population** : le nœud vise-t-il une population mixte, ou
   faut-il distinguer haute albuminurie / pas d'albuminurie — ce choix cadre aussi bien une
   éventuelle relance OE que la lecture du rapport de B.
3. **Confirmer le modèle demandé à l'origine** (absent de la copie), pour trancher si l'anomalie
   d'outillage (ligne « Modèle : » manquante) est à traiter comme un simple oubli de cette
   requête ou un défaut à corriger dans Interface-OE.
4. **Décider si B démarre maintenant** sur la base d'A seul + OE au statut dégradé (ma
   recommandation, §6), ou si le chantier attend une relance OE avant de lancer B.

## 6. Recommandation

Je lance l'Agent B maintenant plutôt que d'attendre le référent : le circuit prévoit déjà le cas
d'un retour OE dégradé (« incomplet », « précision demandée ») transmis avec son statut affiché —
ce n'est pas un blocage, seulement une note qui vaut moins qu'un « OE non interrogé ». Attendre
n'apporte rien tant que le référent n'est pas joignable et qu'aucune nouvelle requête n'est
autorisée. Les points du §4 restent en tête de dossier pour la boucle (étape 5) et la synthèse
finale, une fois le référent de retour.
