# 2026-07-22 — D6 · Vérification bi-agents = process de production, hors runtime

### Décision

La « double lecture » bi-agents (Agent A analyste vs Agent B contradicteur, orchestrés par Claude Code,
puis réconciliation) est un **processus de production de contenu**, exécuté au moment de rédiger/mettre
à jour une entrée de veille ou un nœud — **pas une fonctionnalité de l'application web**. Documenté dans
`docs/veille/` (référence : briefs §13bis / §7ter + SOP §7).

### Raison du choix

Éviter de confondre méthodologie éditoriale et surface applicative. L'app affiche le résultat (entrées,
nœuds), pas l'orchestration.

### Conséquences

Aucune dépendance runtime liée aux agents. Les journaux d'analyse + réconciliation sont archivés hors
app (auditabilité MDR).
