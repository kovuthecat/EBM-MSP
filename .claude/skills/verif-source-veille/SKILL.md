---
name: verif-source-veille
description: Circuit de vérification bi-agents (§7) ou tri-agents (§7bis) d'un item de veille dont la source primaire est identifiée (ou à identifier en premier lieu) — Agents A et B en parallèle et isolés, réconciliation par l'orchestrateur (§7) ou par l'Agent C (§7bis), accès vérifié par identite.mjs avant tout report. À dérouler pour tout item candidat à la route `analyse`, avant toute rédaction d'entrée. Référence `docs/veille/SOP_veille.md` §7/§7bis et `docs/veille/GRILLE_APPRECIATION.md`.
---

# Vérification bi-/tri-agents — veille

Ce circuit vérifie **un article** : c'est la différence structurante avec
`recherche-preuve-triangulee`, qui part d'une question clinique. Il ne porte que **l'ordre des
étapes, leurs portes et le gabarit de la réconciliation**. Les règles ont leur domicile ailleurs et
ne sont pas reformulées ici :

- choix du circuit, rôle de chaque agent, réconciliation, rôle et limites de l'Agent C,
  `meta.relecture_referent`, journalisation : `docs/veille/SOP_veille.md` §7 et §7bis,
  `DECISIONS.md` D61 ;
- report et file d'attente : `docs/veille/SOP_veille.md` §6bis (règle de file d'attente) ;
- accès, identité, avant un report : `.claude/skills/recherche-source-primaire/references/acces-identite.md` ;
- méthode de contradiction et de consolidation : `references/contradiction.md` § 7,
  `references/consolidation.md`.

Les agents chargent eux-mêmes les références du socle `recherche-source-primaire`.

**Livrables** dans `docs/veille/verifications-backlog/`, préfixés par l'`<ID>` de l'item :
`<ID>-agent-A.md`, `<ID>-agent-B.md`, puis `<ID>-reconciliation.md` (§7, écrit par toi) ou
`<ID>-agent-C-reconciliation.md` (§7bis, écrit par C).

**Date des consignes.** Chaque bloc de lancement transmet la date du dernier commit du fichier de
l'agent (`git log -1 --format=%cs -- <fichier>`), ou « sans objet » s'il n'existe pas.

---

## Étape 1 — Choisir le circuit

1. Lis le **cas d'application** en tête de `SOP_veille.md` §7bis, et confirme les `themes[]` de
   l'item contre la liste de `docs/veille/BRIEF_VEILLE.md` §4 — elle a changé plusieurs fois (D43,
   D60, D61, D63) et peut avoir bougé depuis l'écriture de ce circuit.
2. L'item relève du §7bis : circuit **tri-agents**, l'Agent C réconcilie. Sinon : circuit
   **bi-agents** §7, tu réconcilies toi-même.

Porte : le circuit choisi et le thème qui le fonde sont écrits avant tout lancement.

## Étape 2 — Identité de la source

Si l'item porte un DOI ou un PMID, lance toi-même, depuis la racine du dépôt :

```bash
node .claude/skills/recherche-source-primaire/scripts/identite.mjs <DOI|PMID>
```

La sortie (identifiants recoupés, divergences, accès ouvert légal, rétractation, famille d'essai)
est transmise **à l'identique** aux deux agents. Sans identifiant, ou si la source primaire n'est pas
encore identifiée (item repéré par un relais), la mission de l'établir en premier est transmise aux
deux — une source de repérage ne détermine jamais la route (`SOP_veille.md` §9).

## Étape 3 — A et B, en parallèle et isolés

Lance les deux blocs **dans un même message**, pour qu'ils tournent en même temps. **Toujours par
paire**, jamais A puis B en différé : une interruption (quota, erreur) doit laisser des paires
complètes, pas des moitiés — leçon d'un incident réel de ce projet. A et B lisent la **même** source
primaire, **sans se voir** : aucun des deux ne reçoit le livrable de l'autre.

<!-- lancement:extracteur-preuve -->
**Lancer** `extracteur-preuve` (outil Agent, `subagent_type: "extracteur-preuve"`).
- Rôle : Agent A, mode Veille. Lire la source primaire de l'item, remplir la grille d'appréciation avec chaque chiffre relié à sa localisation exacte, proposer un classement complet (`themes[]`, `professions_concernees[]`, `route`, `niveau_impact`, `niveau_preuve`, `concerne_decision`) ; `route` et `niveau_impact` sont deux champs distincts, et `informatif` est un résultat valide. Écrire le fichier au fil de l'eau.
- Transmettre : mode Veille ; le circuit (§7 ou §7bis — en §7bis, aucun relecteur du domaine ne validera derrière) ; l'`<ID>` de l'item ; l'identité de la source et la sortie d'`identite.mjs`, ou la mission d'identifier la source primaire et de déclarer l'échec plutôt que d'inventer ; la date du dernier commit de `.claude/agents/extracteur-preuve.md`.
- Références : `.claude/skills/recherche-source-primaire/SKILL.md`, `.claude/skills/recherche-source-primaire/references/acces-identite.md`, `docs/veille/GRILLE_APPRECIATION.md`, `docs/veille/SOP_veille.md` §5bis, §9 (et §7bis en tri-agents).
- Livrable : `docs/veille/verifications-backlog/<ID>-agent-A.md`.
<!-- /lancement -->

<!-- lancement:contradicteur-preuve -->
**Lancer** `contradicteur-preuve` (outil Agent, `subagent_type: "contradicteur-preuve"`).
- Rôle : Agent B, mode Veille. Lire la même source primaire que A, indépendamment et sans voir son travail ; traquer le spin, vérifier chaque chiffre et chaque référence contre la source (jamais contre un relais), confronter aux autres preuves disponibles ; retirer une objection qui ne tient pas après vérification. Écrire le fichier au fil de l'eau.
- Transmettre : mode Veille ; le circuit (§7 ou §7bis — en §7bis, aucun relecteur du domaine ne validera derrière) ; l'`<ID>` de l'item ; l'identité de la source et la sortie d'`identite.mjs`, ou la mission d'identifier la source primaire et de déclarer l'échec plutôt que d'inventer ; la date du dernier commit de `.claude/agents/contradicteur-preuve.md`. Rien d'autre : ni rapport ni fichier de A.
- Références : `.claude/skills/recherche-source-primaire/SKILL.md`, `.claude/skills/recherche-source-primaire/references/contradiction.md` § 3 à § 7, `.claude/skills/recherche-source-primaire/references/acces-identite.md`, `docs/veille/GRILLE_APPRECIATION.md`, `docs/veille/SOP_veille.md` §7 ou §7bis, §9.
- Livrable : `docs/veille/verifications-backlog/<ID>-agent-B.md`.
<!-- /lancement -->

Porte : les deux livrables existent, chacun avec son en-tête de provenance. Si un seul a abouti,
relancer la paire manquante avant toute réconciliation.

## Étape 4 — Avant de reporter pour inaccessibilité

Un item ne se reporte pas pour une question d'accès tant que les voies de
`references/acces-identite.md` § 7 n'ont pas été essayées dans l'ordre, et l'état de chacune écrit
(vocabulaire du § 2). **`identite.mjs` est obligatoire** : si l'étape 2 ne l'a pas lancé (identifiant
trouvé en cours de route), le lancer maintenant. Un fetch qui a échoué est un `échec technique`,
jamais un paywall. Le report lui-même suit `SOP_veille.md` §6bis.

## Étape 5 — Réconciliation

### §7 (bi-agents) — tu réconcilies toi-même

Lis les deux rapports ; tranche **sur pièces** (retour au passage source, pas à l'intuition), selon
`SOP_veille.md` §7 et la méthode de `references/consolidation.md` (typologie des divergences,
états d'une divergence). Le sort d'une divergence non tranchable sur pièces est celui que fixe la
SOP. Écris `docs/veille/verifications-backlog/<ID>-reconciliation.md` au gabarit de l'étape 6.

### §7bis (tri-agents) — l'Agent C réconcilie

<!-- lancement:reconciliateur-preuve -->
**Lancer** `reconciliateur-preuve` (outil Agent, `subagent_type: "reconciliateur-preuve"`).
- Rôle : Agent C, mode Veille §7bis, en contexte isolé : il n'a vu que les rapports finaux de A et B. Il compare les deux analyses, tranche sur pièces les désaccords vérifiables, teste chaque point porteur contre « faut-il être du métier pour l'affirmer ? » (ce qui l'exige est retiré du contenu publiable), rend la décision de classement dans le rôle que lui donnent la SOP §7bis et D61, et rédige au gabarit de l'étape 6.
- Transmettre : mode Veille §7bis ; l'`<ID>` de l'item ; l'identité de la source et la sortie d'`identite.mjs` ; `<ID>-agent-A.md` et `<ID>-agent-B.md` (rapports finaux seulement) ; le gabarit de l'étape 6 de ce circuit ; la date du dernier commit de `.claude/agents/reconciliateur-preuve.md`.
- Références : `.claude/skills/recherche-source-primaire/SKILL.md`, `.claude/skills/recherche-source-primaire/references/consolidation.md`, `.claude/skills/recherche-source-primaire/references/acces-identite.md`, `docs/veille/SOP_veille.md` §6bis, §7bis, §9, `DECISIONS.md` D61, `docs/veille/GRILLE_APPRECIATION.md`.
- Livrable : `docs/veille/verifications-backlog/<ID>-agent-C-reconciliation.md`.
<!-- /lancement -->

**Une zone de compétence hors de portée des trois agents, déclarée identiquement par A et B, n'est
pas un désaccord** : elle se traite par retrait du contenu concerné, pas par report indéfini d'un
item qu'aucun agent du métier ne viendra jamais compléter.

## Étape 6 — Gabarit de toute réconciliation (§7 et §7bis)

1. **Provenance du circuit** (N5), remplie par toi — en §7 en tête de ton fichier, en §7bis ajoutée
   en fin du fichier de C à son retour :

   ```markdown
   ## Provenance du circuit
   - Date : <AAAA-MM-JJ>
   - Circuit : <§7 bi-agents | §7bis tri-agents> — thème qui le fonde : <…>
   - Orchestrateur : <modèle de la session>
   - Agents lancés : <lettre — subagent_type tel que lancé — modèle (champ `model:` de l'agent, ou modèle hérité) — date des consignes — livrable>, une ligne par lancement
   - identite.mjs : <identifiant, date, ou « non lancé : motif »>
   ```

   Un en-tête de provenance d'agent manquant, ou qui contredit ce que tu as lancé, se signale ici.
2. **Tableau de classement complet** : `route`, `niveau_impact`, `niveau_preuve`, `themes[]`,
   `professions_concernees[]`, `concerne_decision`, `meta.relecture_referent` (valeur fixée par la
   SOP selon le circuit).
3. **Divergences** : chacune avec les deux affirmations, le passage source qui tranche, et son état
   (`consolidation.md` § États d'une divergence) — rapport au sens de `SOP_veille.md` §7 : consensus
   vérifié, divergences à escalader, non vérifiable.
4. **Conditions de rédaction opposables** : ce que l'entrée devra dire, et ce qu'elle ne devra
   jamais reprendre (formulations de spin repérées dans la source ou son relais).
5. **Ce que la procédure ne garantit pas** : l'angle mort partagé par les agents, dit honnêtement.

Puis mets à jour le tableau de suivi de `docs/veille/JOURNAL_BOITE_MAIL.md` §2bis (ou l'équivalent en
cours) au fil des items, pas en bloc à la fin.
