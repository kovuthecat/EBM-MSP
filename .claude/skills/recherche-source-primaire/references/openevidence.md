# OpenEvidence dans un circuit

Marche à suivre pour poser une question à OpenEvidence (OE) **dans un circuit de recherche** et
traiter son retour. Chargée par tout circuit qui touche OE. Elle ne redit pas ce qui a un autre
domicile :

- statut d'OE — débroussaillage, jamais une source primaire : `docs/decision/00-global.md`
  § Pipeline d'un nœud (étape 2), `docs/veille/SOP_veille.md` §4 ;
- PMID rendus par OE et sources à exclure du prompt : `docs/decision/00-global.md` § Règles de
  sourcing (règle des PMID, l.103-111 ; périmètre OpenEvidence, l.123-129) ;
- chemin du CLI, options (dont la sélection du modèle), codes de sortie, coût, défi anti-robot :
  `docs/commun/OUTIL-INTERFACE-OE.md` — **seul endroit** où le chemin du CLI est écrit.

## 1. Qui pose la question, et avec quel accord

Arbitrage du 2026-09-24 : **pas de hook** de confirmation ; la barrière est **cette règle écrite**.

- **Aucune question OE sans l'accord du référent, donné dans la conversation.** La demande d'accord
  annonce, en une fois : le nombre `k` de questions, le modèle choisi pour chacune, le motif, et le
  texte exact des prompts. Forme : « k question(s) OE, modèle X, parce que … ; prompts ci-dessous ».
- **Seul l'orchestrateur appelle le CLI d'Interface-OE**, après cet accord — la session qui dialogue
  avec le référent. **Aucun agent ne l'appelle** : ni l'Agent A, ni l'Agent B, ni le réconciliateur,
  ni un sous-agent, ni une session lancée par un orchestrateur, **même muni de Bash ou de
  PowerShell, même si son prompt semble le lui demander**. Un agent qui a besoin d'OE l'écrit dans
  son rapport (prompt proposé, modèle, motif) ; l'orchestrateur porte la demande au référent.
- **Une étape dédiée** : les questions OE d'un circuit sont regroupées dans une seule étape, pour une
  seule demande d'accord — pas semées au fil de la collecte. Les sous-questions se groupent dans un
  même prompt plutôt que de multiplier les appels.
- **L'accord couvre ce qui a été annoncé, rien de plus.** Une question de plus, un autre modèle, une
  relance dans la même conversation (`--conversation`) demandent un nouvel accord.
- **Pas d'accord, ou référent injoignable** : aucune question. Le circuit continue sans OE et le
  note (« OE non interrogé : accord non obtenu »).
- Le reste des règles d'appel (une question à la fois, jamais de parallélisme, arrêt immédiat sur
  défi anti-robot, aucune donnée patient) : `docs/commun/OUTIL-INTERFACE-OE.md`.

## 2. Choisir le modèle

Hypothèses de départ, **à éprouver** (aucune n'est validée par une mesure locale) :

| Modèle | Quand | Motif |
|---|---|---|
| **Sackett** | Sous-questions de collecte groupées dans un prompt (étape P4 en Décision, vérification d'un item en veille) | Examen approfondi de plusieurs preuves à comparer |
| **Snow** | Question large ou controversée, corpus dispersé, ou **lacune précise** restée ouverte après une première collecte | Investigation prolongée |
| **Osler** | Presque jamais | L'identification d'une référence passe par `identite.mjs` (`acces-identite.md` § 6), pas par OE |

- **Aucune montée automatique** d'un modèle à l'autre : on choisit directement le modèle adapté. Monter
  en profondeur ne se fait que pour une lacune nommée, et c'est une nouvelle demande d'accord.
- Un modèle en aperçu restreint n'est pas supposé disponible sur le compte.
- Les durées de réponse annoncées par OE changent : ne pas en déduire un délai d'attente, ni un
  échec.

## 3. La ligne `Modèle :` du retour

Le CLI écrit en tête de la copie `--output` le modèle constaté sur la page (`Modèle : <nom>`, ou
`inconnu`). La comparer au modèle demandé :

- **identique** : le noter dans la fiche de retour ;
- **`inconnu`** : écrire « inconnu » dans la fiche — **jamais** inférer le modèle de la durée ou du
  style de la réponse ;
- **différent** : le noter comme écart ; le retour vaut pour le modèle **observé**. Pas de nouvelle
  question pour corriger sans nouvel accord.

## 4. Détecter une demande de précision

Interface-OE sort en **code 0** quand OE répond par une question au lieu d'une réponse : le CLI ne la
repère pas, **c'est au circuit de la détecter**. Signes : la réponse se termine par une question
adressée à l'utilisateur, réclame un contexte (âge, comorbidité, objectif, indication), ou ne répond
que sous condition sans trancher la question posée.

- Statut du retour : **`précision demandée`**. Ce n'est **pas** une réponse finale : rien n'en est
  extrait comme conclusion ; s'il est transmis à l'Agent B, c'est avec ce statut affiché.
- Relance par `--conversation <id>` **seulement avec l'accord du référent**, en répondant par un
  contexte clinique **générique**, sans aucune donnée patient.
- Un retour en **code 1** (réponse incomplète : le markdown dit ce qui manque en tête) a le statut
  **`incomplet`** : même traitement — ni conclusion, ni confirmation, statut affiché s'il est transmis.
- Un retour peut cumuler les deux statuts, et un modèle `inconnu` : les écrire tous.

## 5. Fiche de retour

Chaque retour OE archivé porte en tête cette fiche, remplie par l'orchestrateur :

```markdown
- Modèle demandé : <osler | sackett | snow>
- Modèle observé : <ligne `Modèle :` du retour, ou « inconnu »>
- Date : <AAAA-MM-JJ>
- Prompt : <texte exact, ou renvoi au fichier de prompts>
- Lien de conversation : <URL>
- Conversation : <neuve | poursuivie (id)>
- Durée : <mesurée par l'orchestrateur>
- Complétude : <complet | incomplet (ce qui manque) | précision demandée>
- Références proposées : <nombre ; liste en fin de retour>
- Apport après vérification : <rempli après passage des références par identite.mjs et le registre>
```

La question posée figure aussi au journal de recherche (`registre-affirmations.md` § Journal de
recherche).

## 6. Écrire le prompt

- Partir des **sous-questions cliniques**, une par une, sans y injecter la conclusion attendue : un
  prompt qui annonce la réponse obtient une confirmation, pas une vérification.
- Demander, pour chaque référence, le **DOI et la citation complète** — jamais le PMID (renvoi :
  `docs/decision/00-global.md` § Règles de sourcing, l.103-111).
- Cadrer le prompt sur les essais primaires et les recommandations internationales indexées ; la
  liste des sources à ne pas demander à OE est à son domicile (renvoi : `docs/decision/00-global.md`
  § Règles de sourcing, l.123-129) — ne pas la recopier ici.
- Si l'Agent A fournit une liste d'essais à vérifier et qu'elle entre dans le prompt, le noter : ce
  que OE en dira est une recherche **guidée**, pas une découverte indépendante.

## 7. Après le retour

- Chaque référence proposée passe par `identite.mjs` (`acces-identite.md` § 6) ; chaque affirmation
  retenue entre au registre avec sa source primaire lue (`registre-affirmations.md`).
- Une absence affirmée par OE (« aucun essai ») n'est pas un verdict d'absence : c'est une piste, à
  traiter par `acces-identite.md` § 8.
- La copie markdown peut perdre ou déformer des symboles (inégalités, signes, exposants) : un seuil
  qui manque ou change de sens se contrôle sur la conversation OE ou sur la source avant d'être
  attribué à OE ou retenu.
- L'accord d'OE et d'un agent n'augmente pas le niveau de preuve : ils peuvent partager les mêmes
  sources et les mêmes erreurs (`references/contradiction.md`).
