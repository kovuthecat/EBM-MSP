# Note d'orchestration — retour OpenEvidence, dossier « iSGLT2 et DFG bas » (nœud `prescription`)

## Contexte

Circuit `recherche-preuve-triangulee`. L'Agent A a rendu sa collecte (non rouverte ici, hors objet de
cette étape). Avec l'accord du référent, le prompt de fin de rapport d'A a été posé à OpenEvidence par
le CLI Interface-OE (étape 3 du circuit). La commande est sortie en **code 1** et a écrit
`epreuve/entrees/OE-isglt2-dfg-bas.md`. Le référent n'est pas joignable pendant ce travail :
**aucune nouvelle requête OE** n'est envoyée sans son accord ; le circuit continue sans en attendant
(`openevidence.md` §1). Rappel de cadre : OE reste du débroussaillage, jamais une source citable ; tout
chiffre repasse par la source primaire avant classement.

## Qualification du retour OE

D'après `docs/commun/OUTIL-INTERFACE-OE.md` (codes de sortie) et
`.claude/skills/recherche-source-primaire/references/openevidence.md` §3-4, un retour code 1 porte le
statut `incomplet` (« ni conclusion, ni confirmation ») et peut cumuler d'autres statuts. Ici, deux se
cumulent :

- **`incomplet`** : l'extraction s'interrompt en cours de Q2 (aucune valeur chiffrée livrée), Q3
  n'est pas atteinte du tout, la section « Références » n'a pas été récupérée. Le fichier le signale
  lui-même en tête (« ⚠️ Extraction incomplète »), conformément à ce que le CLI écrit quand la
  commande a pu tourner.
- **`précision demandée`, non tranchée** : avant de répondre, OE a demandé si la question visait une
  population avec ou sans albuminurie élevée, puis a répondu quand même « en supposant une population
  mixte » — une hypothèse **auto-choisie par OE, non validée**. Rien de ce qui suit dans le texte ne
  vaut réponse tranchée à la question posée (`openevidence.md` §4).

Fiche de retour (à reporter en tête de `OE-isglt2-dfg-bas.md` avant transmission) :

```markdown
- Modèle demandé : non retrouvé dans ce qui m'a été transmis à cette étape — à relever dans le
  journal/la demande d'accord avant de clore la fiche
- Modèle observé : absent de la copie (pas de ligne « Modèle : ») → traité comme inconnu ; ne pas
  l'inférer du style ou de la durée de la réponse (interdit explicitement)
- Date : 2026-09-10
- Prompt : question groupée Q1/Q2/Q3 de fin de rapport A (DT2, DFG 20-30 mL/min/1,73 m², iSGLT2,
  protection rénale)
- Lien de conversation : https://www.openevidence.com/ask/fictif-0000
- Conversation : neuve
- Durée : non mesurée à cette étape
- Complétude : incomplet (Q2 tronquée, Q3 absente, Références absentes) + précision demandée non
  tranchée (population)
- Références proposées : [1][2][3] cités dans le corps, liste non récupérée — nombre et DOI inconnus
- Apport après vérification : nul pour l'instant — rien n'est passé par `identite.mjs` ni le registre
```

### Sur le code 1 lui-même

Le mode d'emploi prévient que le code 1 recouvre deux cas indistinguables sans contrôle préalable :
une vraie réponse tronquée, ou `<CLI>` introuvable (un `node` sur un chemin mort sort au même code).
Le contenu récupéré — question de clarification contextuelle, début de réponse cliniquement situé,
lien de conversation, avertissement d'extraction écrit par l'outil lui-même — penche fortement pour
une réponse réellement tronquée plutôt qu'un chemin mort, qui n'aurait rien produit de tel. Mais je
n'ai pas trace que `Test-Path <CLI>` ait été fait **avant** l'appel : je retiens l'hypothèse « réponse
tronquée » par faisceau d'indices, pas par certitude, et je garde le doute en point ouvert (§ ci-dessous)
plutôt que de le trancher ici.

## Ce que je transmets à l'Agent B, et sous quel statut

Je transmets `OE-isglt2-dfg-bas.md` tel quel, fiche de qualification ci-dessus en tête, **statut
INCOMPLET + PRÉCISION DEMANDÉE (non tranchée) + modèle inconnu** affiché explicitement — comme pour
tout retour OE, B l'ouvre seulement après avoir écrit ses « Attendus » sur A seul.

Consigne par sous-question, pour éviter que B hérite sans le savoir des trous ou de l'hypothèse d'OE :

- **Q1** (essais ayant inclus un DFG 20-30) : fragment présent, mais les appels [1][2][3] ne mènent
  nulle part (pas de liste Références) → B ne présume pas des essais visés par ces numéros ; il les
  identifie et vérifie lui-même parmi les essais rénaux iSGLT2 connus, sans hériter la numérotation
  d'OE.
- **Q2** (effet absolu, sous-groupe DFG < 30) : coupé avant toute valeur chiffrée → il n'y a rien à
  confirmer ni à contredire ; B consigne « non vérifiable — OE n'a produit aucune valeur », pas un
  verdict sur un chiffre absent.
- **Q3** : absente du texte → B consigne « non traité par OE » et couvre la sous-question uniquement
  par voie primaire.
- **Hypothèse de population « mixte »** : non validée par le référent → B ne la traite pas comme un
  cadrage acquis ; il le signale comme non tranché dans son verdict par sous-question plutôt que de
  raisonner dessus comme si elle était donnée.

## Points ouverts

| # | Point | Nature | Suite |
|---|---|---|---|
| 1 | Q2 sans valeur chiffrée | Lacune de couverture côté OE, pas une absence de preuve | Recherche ciblée sur la source primaire par A/B (essais rénaux iSGLT2, sous-groupe DFG < 30) ; pas une relance OE |
| 2 | Q3 non traitée | Idem | Idem — voie primaire uniquement |
| 3 | Section Références absente | Blocage d'accès (extraction) | État partiel assumé ; pas de relance OE sans accord référent ; B travaille sans ces références |
| 4 | Population (albuminurie) non tranchée | Arbitrage de cadrage, pas une question de preuve | À soumettre au référent — pas de relance, pas de choix pris à sa place |
| 5 | Ligne « Modèle : » absente de la copie | Écart de forme vs. gabarit attendu (§5 openevidence.md) | Retrouver le modèle demandé au journal/à la demande d'accord ; sinon consigner « inconnu » formellement, jamais l'inférer |
| 6 | Ambiguïté code 1 (réponse tronquée vs `<CLI>` introuvable) | Contrôle procédural non tracé | Confirmer si `Test-Path <CLI>` a été fait avant l'appel et le journaliser ; point gardé ouvert malgré le faisceau d'indices en faveur d'une réponse tronquée |
| 7 | Archive locale de l'application non consultée (`%APPDATA%\interface-oe\conversations\<date-heure-slug>\conversation.md`) | Action à coût nul : ce n'est pas une nouvelle requête OE, aucun accord référent requis | À vérifier avant toute autre démarche côté OE — si la troncature vient d'un bug d'extraction du CLI plutôt que d'une réponse OE réellement écourtée, Q2, Q3 et les Références peuvent s'y trouver déjà complètes |

## Ce que le référent doit trancher

1. **Population cible** de la sous-question DFG bas (avec albuminurie, sans, ou les deux distinguées)
   — sans quoi Q1 à Q3 restent posées sur un cadrage non confirmé.
2. **Autoriser ou non une nouvelle question OE** (reprise de Q2/Q3, demande explicite de la liste
   Références et confirmation du modèle) — non autorisée pour l'instant, référent injoignable ; le
   circuit continue sans elle.
3. Si le point ouvert n°7 (archive locale) ne suffit pas à récupérer la matière manquante : valider le
   repli — dossier fondé sur preuve primaire directe pour Q2/Q3, OE cantonné à Q1 en débroussaillage
   non vérifié, jamais cité comme tel.

## Provenance

- Date : 2026-09-24
- Orchestrateur : Claude (Sonnet 5)
- Agents lancés à cette étape : aucun — note de décision précédant le lancement de l'Agent B
- OpenEvidence : 1 question groupée (Q1/Q2/Q3), modèle demandé non retrouvé dans les éléments transmis
  à cette étape, modèle observé absent de la copie (→ inconnu) ; statut **incomplet + précision
  demandée (non tranchée)**
- Porte du registre : sans objet à ce stade (pas de consolidation avant retour du référent sur les
  points ci-dessus)
