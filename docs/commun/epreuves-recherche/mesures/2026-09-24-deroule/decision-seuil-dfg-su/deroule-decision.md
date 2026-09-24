# Déroulé du circuit `recherche-preuve-triangulee` — chantier `seuil-dfg-su` (2026-09-24)

Répétition technique à blanc, menée jusqu'au bout comme un chantier réel. Sujet : nœud
`prescription` (DT2) — seuil de DFG des sulfamides hypoglycémiants en IRC et utilisabilité du
répaglinide en IRC terminale, selon la SFD 2025.

## Agents lancés (outil Agent, `subagent_type` exact)

1. `subagent_type: "extracteur-preuve"` (Agent A) — collecte, mode Décision.
2. `subagent_type: "contradicteur-preuve"` (Agent B) — contradiction, mode Décision.
3. `subagent_type: "reconciliateur-preuve"` (Agent C) — consolidation, mode Décision.

Aucune relance (pas de tour 2) : les points ouverts après B ont tous été tranchables par C sur
pièces, sans nouvelle collecte.

## Livrables produits

Tous dans `docs/decision/validation/chantier-2026-09-24/` :

- `seuil-dfg-su-cadrage.md` — cadrage (étape 1, écrit par l'orchestrateur)
- `seuil-dfg-su-agent-A.md` — rapport de collecte (Agent A)
- `seuil-dfg-su-registre.md` — **registre des affirmations**, rempli par A puis corrigé par C
- `seuil-dfg-su-journal.md` — journal de recherche (Agent A)
- `OE-seuil-dfg-su.md` — retour OpenEvidence archivé + fiche de retour (étape 3, orchestrateur ;
  retour réutilisé tel quel, aucune requête réelle pour cette répétition)
- `seuil-dfg-su-agent-B.md` — rapport de contradiction (Agent B)
- `seuil-dfg-su-consolidation.md` — synthèse décisionnelle + annexe de traçabilité (Agent C)
- `seuil-dfg-su-synthese.md` — dossier transmis au référent (étape 8, orchestrateur)

## Registre des affirmations

Identifiant/chemin : `docs/decision/validation/chantier-2026-09-24/seuil-dfg-su-registre.md`
(13 lignes, A1-A13 ; A12 et A13 ajoutées par C lors de la consolidation).

## Point notable non résolu

La **porte automatique du registre** (`verifier-registre.mjs`) n'a pu être exécutée à aucune étape :
aucun des quatre rôles (A, B, C, orchestrateur) n'avait d'outil Bash dans cet environnement d'épreuve.
Consigné comme point bloquant plutôt que masqué — voir `seuil-dfg-su-synthese.md` § Provenance et §
Points ouverts. Le dossier est donc livré comme **état partiel** au sens strict de l'étape 7 du
circuit, malgré un contenu clinique complet et une consolidation terminée sur le fond (3
divergences trouvées entre A et B, toutes tranchées sur pièces par C).
