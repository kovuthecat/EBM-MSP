# Déroulé à blanc des circuits — configuration 3

Plan P16, session S10/T18. Commit exporté : `ece2d5eba67300f36e8435e7a66b813ba8fb6064` (HEAD au
moment du déroulé). Harnais : `docs/commun/epreuves-recherche/harnais/` (T18 : configurations 2/3,
`--prompt-file`/`--dossier-cas` pour une invite hors-corpus, cf. `lancer.mjs`). Modèle : `sonnet`
(même modèle que la mesure finale de T19).

**Amendement (arbitrage utilisateur, 2026-09-24, relayé par l'orchestrateur en cours de session)** :
seul le circuit Décision (`recherche-preuve-triangulee`) est déroulé à blanc ici. Les déroulés Veille
§7 (`verif-source-veille` bi-agents) et §7bis (tri-agents), prévus par le § Décision clé de `S10.md`,
sont **sautés** sur instruction explicite : « on SAUTE les épreuves du circuit Veille ». Conséquence
identique pour T19 (mesure finale) : seuls les cas du corpus qui exercent `recherche-preuve-triangulee`
sont mesurés en configurations 2 et 3 — voir `Écarts au plan` du bilan de session pour le détail et la
liste des cas exclus.

## Pourquoi une invite hors-corpus

Les 12 cas du corpus d'épreuve (`cas/E01`…`E12`) sont chacun bornés à **une étape** d'un circuit (rôle
« A », « B », « C » ou orchestration d'une seule étape — jamais le circuit entier, cadrage à
consolidation) : c'est ce qui les rend gradables contre des assertions fixes. Aucun ne convient donc à
la porte « circuits déroulables de bout en bout » (§14.4 du document source), qui demande un passage
complet du circuit, agents dédiés compris. Une invite a donc été écrite pour l'occasion (pas un cas du
corpus, pas mesuré, pas gradé), réutilisant un des retours OpenEvidence déjà archivés dans le corpus
(celui d'E02) comme pièce d'entrée pour éviter toute requête OE réelle.

## Décision — chantier `seuil-dfg-su`

Sujet : nœud `prescription` (DT2), seuil de DFG des sulfamides hypoglycémiants en IRC et utilisabilité
du répaglinide en IRC terminale (SFD 2025) — sujet apparenté à E02, retour OE archivé réutilisé
(`epreuve/entrees/OE-retour-brut-extrait.md`, copie de `cas/E02-.../entrees/`), aucune requête OE
réelle envoyée.

**Coût** : 5,77 $ · **Durée** : 1 733 164 ms (≈ 29 min) · **Invalidée** : non (aucune tentative
d'outil vers le dépôt ou Interface-OE, aucune URL github.com/kovuthecat, `refus` constatés = 0).

**Agents lancés** (lus dans la transcription `stream-json`, blocs `tool_use` de nom `Agent`, jamais
dans la réponse du modèle) :

| # | `subagent_type` (exact) | Rôle |
| --- | --- | --- |
| 1 | `extracteur-preuve` | Agent A — collecte, mode Décision |
| 2 | `contradicteur-preuve` | Agent B — contradiction, mode Décision |
| 3 | `reconciliateur-preuve` | Agent C — consolidation, mode Décision |

Aucune relance (les points ouverts après B ont tous été tranchés par C sur pièces).

**Livrables** — tous produits, copiés ici sous `decision-seuil-dfg-su/chantier/` :

- `seuil-dfg-su-cadrage.md` (étape 1)
- `seuil-dfg-su-agent-A.md`, `seuil-dfg-su-registre.md`, `seuil-dfg-su-journal.md` (étape 2, Agent A)
- `OE-seuil-dfg-su.md` (étape 3, orchestrateur — retour archivé réutilisé, fiche de retour rédigée)
- `seuil-dfg-su-agent-B.md` (étape 4, Agent B)
- `seuil-dfg-su-consolidation.md`, `seuil-dfg-su-registre.md` corrigé (étape 6, Agent C)
- `seuil-dfg-su-synthese.md` (étape 8, orchestrateur)
- `deroule-decision.md` (résumé écrit par la session mesurée elle-même, `epreuve/sortie/`)

**Porte du registre (`verifier-registre.mjs`)** — non lancée par le circuit lui-même : Bash est refusé
dans les trois configurations du harnais (correctif localisé, voir `Écarts au plan` du bilan), donc
`identite.mjs`/`verifier-registre.mjs` sont hors de portée d'un rôle mesuré ici. Le circuit l'a
correctement constaté et livré le dossier comme **état partiel**, sans en masquer l'absence (§ Point
notable de `deroule-decision.md`). **Lancée par la session orchestrant ce déroulé**, hors de l'export,
sur le registre produit :

```
$ node .claude/skills/recherche-source-primaire/scripts/verifier-registre.mjs <registre>
verifier-registre: …/seuil-dfg-su-registre.md — 13 ligne(s), 0 erreur
EXIT=0
```

**Verdict** : la transcription montre le lancement des trois agents dédiés par leur `subagent_type`
exact ; les livrables existent ; la porte du registre passe (code 0) une fois lancée manuellement.
Porte « circuits déroulables de bout en bout » de §14.4 : **passée** pour le circuit Décision.
