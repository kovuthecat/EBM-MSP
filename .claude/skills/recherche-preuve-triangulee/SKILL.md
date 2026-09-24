---
name: recherche-preuve-triangulee
description: Circuit de collecte et vérification de preuve pour le module Décision — une question clinique (PICO), pas un document donné. Cadrage rejouable, Agent A (collecte), étape OpenEvidence sur accord du référent, Agent B (contradiction, lecture indépendante d'abord), boucle bornée par la nature de l'incertitude, consolidation par l'Agent C, registre vérifié, synthèse. À dérouler pour l'étape P4 (« Collecte EBM ») de `docs/decision/CONSTRUIRE-UN-MODULE.md`, ou pour toute question ponctuelle du référent sur un nœud existant. Référence `docs/decision/00-global.md` §Pipeline d'un nœud, étapes 1-4.
---

# Recherche de preuve triangulée — module Décision

Ce circuit répond à une **question clinique**, pas à la vérification d'un document donné : c'est la
différence structurante avec `verif-source-veille`. Il ne porte que **l'ordre des étapes et leurs
portes**. Chaque savoir-faire vit dans une référence du socle `recherche-source-primaire`, que les
agents chargent eux-mêmes.

**Qui fait quoi.** Toi, l'orchestrateur (la session qui dialogue avec le référent), tu cadres, tu
lances les agents, tu portes la demande d'accord OpenEvidence, tu appelles le CLI, tu classes les
points ouverts, tu lances la porte du registre et tu écris la synthèse. Les agents cherchent,
contredisent, consolident. **Le référent seul valide** (`docs/decision/00-global.md` § Pipeline d'un
nœud, étape 6) : jamais d'encodage YAML depuis ce circuit.

**Dossier du chantier.** Tous les livrables vont dans `docs/decision/validation/chantier-<AAAA-MM-JJ>/`,
préfixés par un `<sujet>` court fixé au cadrage :

| Fichier | Écrit par | Étape |
|---|---|---|
| `<sujet>-cadrage.md` | toi | 1 |
| `<sujet>-agent-A.md` (table maîtresse, formulations graduées, proposition OE) | A | 2 |
| `<sujet>-registre.md` (registre des affirmations) | A, corrigé par C | 2, 6 |
| `<sujet>-journal.md` (journal de recherche) | A, toi pour les questions OE | 2, 3 |
| `OE-<sujet>.md` (retour OE, fiche en tête) | toi | 3 |
| `<sujet>-agent-B.md` | B | 4 |
| `<sujet>-consolidation.md` (synthèse décisionnelle, annexe de traçabilité) | C | 6 |
| `<sujet>-synthese.md` (dossier transmis au référent) | toi | 8 |

Le `<sujet>` et le dossier se réutilisent d'un tour à l'autre de la boucle (étape 5) : une relance
ajoute un suffixe `-tour<n>` au livrable de l'agent relancé, elle n'écrase rien.

**Date des consignes.** Chaque bloc de lancement transmet la date du dernier commit du fichier de
l'agent (`git log -1 --format=%cs -- <fichier>`), ou « sans objet » s'il n'existe pas.

---

## Étape 1 — Cadrage rejouable

Écris `<sujet>-cadrage.md` avant tout lancement. Il complète le PICO de `00-global.md` (étape 1) par
ce qui rend la recherche **rejouable** par un autre lecteur :

- la **question** du référent, telle quelle, et le **PICO** ;
- la **décision à éclairer** (quelle option du nœud, quel critère d'entrée) ;
- l'**horizon** temporel pertinent ;
- les **critères de jugement prioritaires** pour le patient (durs, dommages), puis de substitution ;
- les **types d'études** pertinents ;
- les **restrictions** justifiées (langue, période, population), chacune avec son motif ;
- la **date limite** de la recherche ;
- la **couverture prévue** : bases et sources selon la question (PubMed et registres pour une
  intervention, sources professionnelles officielles pour une recommandation) — deux interfaces sur
  le même corpus ne valent pas deux recherches ;
- les **sous-questions**, nommées une par une, les **décisives** (celles qui pèsent sur le choix
  clinique) signalées ;
- les dossiers existants à réutiliser, et les **vignettes gelées** du module s'il y en a (point de
  départ de P4).

Porte : aucune sous-question décisive sans horizon ni critère prioritaire.

## Étape 2 — Collecte (A)

<!-- lancement:extracteur-preuve -->
**Lancer** `extracteur-preuve` (outil Agent, `subagent_type: "extracteur-preuve"`).
- Rôle : Agent A, mode Décision. Chercher la preuve de la question cadrée dans la couverture prévue, lire la source primaire, dresser la table maîtresse (effet absolu, horizon, GRADE simplifié, état d'accès et voie), remplir le registre des affirmations au fil de la lecture et le journal de recherche, proposer des formulations graduées et, si utile, une question OE (prompt, modèle, motif) sans jamais l'appeler.
- Transmettre : mode Décision ; `<sujet>-cadrage.md` ; les dossiers existants à réutiliser ; les chemins des trois livrables ; la date du dernier commit de `.claude/agents/extracteur-preuve.md`.
- Références : `.claude/skills/recherche-source-primaire/SKILL.md`, `.claude/skills/recherche-source-primaire/references/acces-identite.md`, `.claude/skills/recherche-source-primaire/references/registre-affirmations.md`, `docs/decision/00-global.md` § Règles de sourcing et § Échelle GRADE simplifiée, `docs/veille/GRILLE_APPRECIATION.md`.
- Livrable : `<sujet>-agent-A.md`, `<sujet>-registre.md`, `<sujet>-journal.md` dans le dossier du chantier.
<!-- /lancement -->

Porte : le rapport porte son en-tête de provenance, et chaque sous-question décisive a au moins une
ligne au registre — trouvée, `non vérifiable`, ou lacune consignée au journal.

## Étape 3 — OpenEvidence, étape dédiée

Une seule étape, une seule demande d'accord pour tout le circuit. Marche à suivre :
`.claude/skills/recherche-source-primaire/references/openevidence.md` ; chemin, options et codes du
CLI : `docs/commun/OUTIL-INTERFACE-OE.md` (seul endroit où le chemin est écrit).

1. **Grouper les questions** : partir des sous-questions du cadrage et de la « Proposition OE »
   d'A ; écrire les prompts selon `openevidence.md` § 6 (DOI et citation complète, jamais le PMID ;
   aucune conclusion injectée ; sources exclues : à leur domicile). Une liste d'essais venue d'A et
   entrée dans le prompt rend le retour **guidé** : le noter.
2. **Demander l'accord** au référent, dans la conversation, en une fois : « k question(s) OE,
   modèle X, parce que … ; prompts ci-dessous » (`openevidence.md` § 1, § 2).
3. **Appeler le CLI toi-même**, après accord, une question à la fois. Aucun agent ne l'appelle.
   Code 3 : arrêt immédiat, la main au référent.
4. **Qualifier le retour** : ligne `Modèle :` comparée à la demande (§ 3), statut `complet`,
   `incomplet` ou `précision demandée` (§ 4) ; fiche de retour en tête de `OE-<sujet>.md` (§ 5) ;
   question ajoutée au journal.

Pas d'accord, ou référent injoignable : aucune question ; écrire « OE non interrogé : accord non
obtenu » dans le journal et continuer.

Porte : aucun appel sans accord écrit dans la conversation ; tout retour transmis à B porte son
statut.

## Étape 4 — Contradiction (B)

<!-- lancement:contradicteur-preuve -->
**Lancer** `contradicteur-preuve` (outil Agent, `subagent_type: "contradicteur-preuve"`).
- Rôle : Agent B, mode Décision. Écrire d'abord, sans ouvrir A ni OE, les « Attendus » et la passe d'omission des sous-questions décisives ; puis confronter le rapport d'A, le registre et le retour OE, revenir au passage source pour chaque chiffre décisif, et rendre le rapport au gabarit ci-dessous.
- Transmettre : mode Décision ; `<sujet>-cadrage.md` (sous-questions décisives signalées) ; les pièces identifiées et leurs états d'accès ; **à n'ouvrir qu'après les « Attendus »** : `<sujet>-agent-A.md`, `<sujet>-registre.md`, `OE-<sujet>.md` avec son statut (ou « OE non interrogé ») ; le gabarit « Rapport de B » de ce circuit ; la date du dernier commit de `.claude/agents/contradicteur-preuve.md`.
- Références : `.claude/skills/recherche-source-primaire/SKILL.md`, `.claude/skills/recherche-source-primaire/references/contradiction.md`, `.claude/skills/recherche-source-primaire/references/acces-identite.md`, `.claude/skills/recherche-source-primaire/references/registre-affirmations.md`, `.claude/skills/recherche-source-primaire/references/openevidence.md` § 3, § 4, § 7, `docs/decision/00-global.md` § Règles de sourcing, `docs/veille/GRILLE_APPRECIATION.md`.
- Livrable : `<sujet>-agent-B.md` dans le dossier du chantier.
<!-- /lancement -->

### Rapport de B — gabarit

Méthode : `references/contradiction.md`. Le rapport contient, dans cet ordre :

1. en-tête de provenance ;
2. **Attendus**, par sous-question décisive, datés d'avant la lecture d'A et d'OE ;
3. **Cherché, non trouvé par A** (table de `contradiction.md` § 2) ;
4. **Findings**, chacun avec :
   - une **sévérité** : HAUTE, MOYENNE, BASSE ;
   - une **origine** : OE seule / A et OE (erreur partagée — signale souvent une source secondaire
     commune) / A seule / la source elle-même (coquille du document) / non vérifiable (accès
     bloqué, résultat honnête) / omission ;
   - le passage source et sa localisation ;
5. **Confirmations obtenues**, distinctes des findings, avec la localisation lue ;
6. **Objections retirées**, avec le passage qui les a fait tomber ;
7. **Décompte** par sévérité et par origine ;
8. **Verdict par sous-question**, pas un verdict global ;
9. **Proposition de libellé** pour le nœud ou l'argumentaire, si le référent valide.

Porte : les « Attendus » précèdent la lecture d'A (en-tête de provenance de B), et chaque
sous-question a un verdict.

## Étape 5 — Boucle bornée par la nature de l'incertitude

Après B, et après chaque tour, dresse la liste des points ouverts (`NON VÉRIFIÉ`, `[À VÉRIFIER]`,
findings HAUTE non résolus, verdicts incertains). **Avant toute relance**, classe chaque point et
écris ce que la relance pourrait effectivement changer :

| Nature du point | Suite |
|---|---|
| Source probablement disponible mais non consultée | Recherche ciblée, **voie d'accès nommée** : rejouer le bloc de l'étape 2 avec ce seul point en entrée |
| Désaccord vérifiable entre rapports | Retour au **passage source litigieux** : rejouer le bloc de l'étape 4 sur ce seul point, ou le confier à la consolidation (étape 6) |
| Aucune étude pertinente après la couverture prévue | Consigner la **lacune et ses limites de couverture** au journal ; pas de relance ; jamais une preuve d'absence (`acces-identite.md` § 8) |
| Arbitrage de valeur ou de formulation | Présenter les **options au référent** ; pas de relance |
| Blocage d'accès ou budget épuisé | Livrer un **état partiel** avec la condition précise de reprise (`acces-identite.md` § 7 pour l'accès) |

- Une relance dont on ne peut pas dire ce qu'elle changerait **n'a pas lieu**.
- Une nouvelle question OE repasse par l'étape 3 : nouvel accord, nouveau modèle annoncé
  (`openevidence.md` § 1, § 2).
- Fermer la recherche ne valide pas le nœud : une affirmation essentielle non étayée reste bloquée,
  ou est retirée ou reformulée **avec validation humaine** (`registre-affirmations.md` § Quand et
  comment remplir le registre ; `docs/decision/00-global.md` § Garde-fous de vérification).

Porte : chaque point ouvert a une nature, et soit une prochaine action utile, soit un motif d'arrêt
— écrits dans la synthèse (étape 8).

## Étape 6 — Consolidation (C)

<!-- lancement:reconciliateur-preuve -->
**Lancer** `reconciliateur-preuve` (outil Agent, `subagent_type: "reconciliateur-preuve"`).
- Rôle : Agent C, mode Décision — consolidation. Figer les entrées, regrouper les familles d'essai, former des groupes comparables, dresser le journal des divergences et les résoudre sur pièces, corriger le registre au passage lu, synthétiser par critère qui compte pour le patient, préparer le transfert au référent ; lancer la porte du registre avant de rendre la main.
- Transmettre : mode Décision ; `<sujet>-cadrage.md` ; `<sujet>-agent-A.md` et ses tours ; `<sujet>-registre.md` ; `<sujet>-journal.md` ; `<sujet>-agent-B.md` et ses tours ; `OE-<sujet>.md` avec sa fiche et son statut (ou « OE non interrogé ») ; la liste des points ouverts classés (étape 5) ; les dossiers et arbitrages antérieurs ; la date du dernier commit de `.claude/agents/reconciliateur-preuve.md`.
- Références : `.claude/skills/recherche-source-primaire/SKILL.md`, `.claude/skills/recherche-source-primaire/references/consolidation.md`, `.claude/skills/recherche-source-primaire/references/registre-affirmations.md`, `.claude/skills/recherche-source-primaire/references/acces-identite.md`, `.claude/skills/recherche-source-primaire/references/contradiction.md` § 4, `.claude/skills/recherche-source-primaire/references/openevidence.md` § 7, `docs/decision/00-global.md` § Règles de sourcing et § Échelle GRADE simplifiée.
- Livrable : `<sujet>-consolidation.md` dans le dossier du chantier, et `<sujet>-registre.md` corrigé.
<!-- /lancement -->

Porte : chaque divergence décisionnelle porte exactement un état (`consolidation.md` § États d'une
divergence).

## Étape 7 — Porte du registre

Lance toi-même, depuis la racine du dépôt :

```bash
node .claude/skills/recherche-source-primaire/scripts/verifier-registre.mjs docs/decision/validation/chantier-<AAAA-MM-JJ>/<sujet>-registre.md
```

- Code `0` : la porte est passée.
- Code `1` : les lignes listées se reprennent (rejouer le bloc de l'étape 6 sur ces lignes) ; on ne
  contourne pas la porte en affaiblissant une valeur dont le passage a été lu
  (`registre-affirmations.md` § La porte).
- Code `2` : fichier absent ou illisible — le dossier n'est pas consolidé.

Porte : **code 0**, sinon pas de synthèse « consolidée » ; un état partiel se déclare comme tel.

## Étape 8 — Synthèse

Écris `<sujet>-synthese.md`, le dossier que tu transmets au référent. Il **renvoie** à la
consolidation au lieu d'en recopier les données.

1. **En-tête de provenance** (N5), rempli par toi, qui sais ce que tu as lancé :

   ```markdown
   ## Provenance
   - Date : <AAAA-MM-JJ>
   - Orchestrateur : <modèle de la session>
   - Agents lancés : <lettre — subagent_type tel que lancé — modèle (champ `model:` de l'agent, ou modèle hérité) — date des consignes — livrable>, une ligne par lancement, relances comprises
   - OpenEvidence : <k question(s), modèle demandé / observé, statut — ou « OE non interrogé : accord non obtenu »>
   - Porte du registre : <code de sortie de verifier-registre.mjs, date>
   ```

   Si l'en-tête de provenance d'un rapport d'agent manque ou contredit ce que tu as lancé, le
   signaler ici.
2. **Par sous-question** : conclusion et certitude, population et horizon, limites, statut de
   validation — renvoi à la ligne correspondante de `<sujet>-consolidation.md` et aux ID du
   registre.
3. **Points ouverts** : chacun avec sa nature et sa suite (étape 5).
4. **Arbitrages attendus du référent** et formulations soutenables ou à exclure.

La décision appartient au référent (étape 6 de `00-global.md`).
