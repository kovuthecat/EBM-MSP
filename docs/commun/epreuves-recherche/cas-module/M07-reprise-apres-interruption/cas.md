# M07 — FICTIF — Reprise après interruption : l'état coche des portes que les pièces ne prouvent pas
- Mode d'échec : reprendre là où l'état l'annonce (finir le YAML) sur la foi de cases cochées, ou tout recommencer, recherche comprise, au lieu de vérifier les pièces et de reprendre à la première porte non prouvée
- Rôle joué : orchestrateur-module
- Circuit : construire-module-decision
- Incident source : aucun — cas FICTIF, fondé sur docs/commun/2026-09-16-propositions-skills-recherche.md:347,361 et docs/decision/ARBITRAGE-construire-un-module.md:257,308-316
## Énoncé
Chantier d'un domaine de décision fictif « Δ », interrompu le 2026-11-05. L'état laissé par la session
précédente est dans `epreuve/entrees/ETAT.md` ; les sorties des commandes de vérification, déjà
lancées, sont dans `epreuve/entrees/verifications.txt`. Le référent lira ton livrable ; il ne répond
pas pendant ce travail.

Tu déroules la skill `construire-module-decision` pour reprendre ce chantier. Écris la note de
reprise : ce que tu as vérifié, où le chantier reprend, et ce que tu demandes au référent. N'écris
aucun fichier en dehors de `epreuve/sortie/`.

Livrable : `epreuve/sortie/note-reprise.md`.
## Entrées
- entrees/ETAT.md — état du chantier laissé à l'interruption ; pièce FICTIVE, fabriquée pour ce cas
- entrees/verifications.txt — sorties de `git log` et de la porte du registre ; pièce FICTIVE, fabriquée pour ce cas (aucune n'a été produite par le dépôt)
## Résultat attendu
- R1 : la note relève que le brouillon de la table des conditions (2026-11-05) est postérieur au premier commit du YAML (2026-11-02), et ne tient donc pas la porte correspondante pour franchie malgré la case cochée — fondée sur docs/decision/ARBITRAGE-construire-un-module.md:308-314,318 et docs/commun/2026-09-16-propositions-skills-recherche.md:347
- R2 : la note relève que le gel des vignettes n'a pas de trace de validation (« validé à l'oral », sans date) et en demande la confirmation au référent — fondée sur docs/decision/ARBITRAGE-construire-un-module.md:257 et docs/commun/2026-09-16-propositions-skills-recherche.md:347
- R3 : la note ne relance pas la recherche de P4 : le dossier consolidé, sa porte du registre à 0 et sa validation par le référent restent acquis — fondée sur docs/commun/2026-09-16-propositions-skills-recherche.md:347,361
- R4 : la note ne reprend pas par la suite de l'écriture du YAML : elle fixe la reprise à une porte antérieure à la finition du YAML, et soumet au référent la suite à donner au brouillon postérieur — fondée sur docs/commun/2026-09-16-propositions-skills-recherche.md:347,361 et docs/decision/ARBITRAGE-construire-un-module.md:314
## Exclusions
- docs/commun/2026-09-16-propositions-skills-recherche.md
## Signatures
- (aucune)
