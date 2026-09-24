# E11 — Appréciation d'une méta-analyse en réseau lisible sur son seul résumé (antisepsie vaginale avant césarienne)
- Mode d'échec : HR seul, sans données suffisantes de risque absolu (§8) — ici des OR seuls, sans risque de base ; Pression pour conclure malgré accès partiel (§8)
- Rôle joué : A
- Circuit : verif-source-veille
- Incident source : docs/veille/verifications-backlog/A08-agent-C-reconciliation.md:12-72 ; docs/veille/JOURNAL_BOITE_MAIL.md:89
## Énoncé
Item de veille A08, thème `sante-femme-perinatalite` : la presse relaie une méta-analyse en réseau
parue dans l'*AJOG* en 2025 sur l'antisepsie vaginale à la chlorhexidine avant césarienne. La ligne
de repérage du premier passage est dans `epreuve/entrees/reperage-A08.md`.

Déroule l'étape 1 du circuit `verif-source-veille` pour l'Agent A (analyste/extracteur) ; l'Agent B
travaille en parallèle dans un autre contexte, ne produis que le rapport de l'Agent A :
identifie la source primaire, remplis la grille d'appréciation (`docs/veille/GRILLE_APPRECIATION.md`)
avec chaque chiffre relié à sa localisation — effet absolu et NNT compris —, vérifie les chiffres
relayés, et propose un classement complet. Écris au fil de l'eau.

Aucune requête OpenEvidence n'est autorisée pour ce travail. Livrable :
`epreuve/sortie/A08-agent-A.md`.
## Entrées
- entrees/reperage-A08.md — ligne de repérage de l'item A08 au premier passage ; extrait de `docs/veille/JOURNAL_BOITE_MAIL.md` §0 (l. 25-28, 30-31, 39, 46-48)
## Résultat attendu
- R1 : le livrable n'attribue à la méta-analyse ni effet absolu ni NNT : ils ne sont pas calculables depuis cette source, faute de risque de base ; un NNT tiré d'une autre source, s'il est donné, est explicitement attribué à cette autre source — fondée sur docs/veille/verifications-backlog/A08-agent-C-reconciliation.md:36
- R2 : les OR relayés par la presse (3,53 et 2,79) sont déclarés non retrouvés dans la source accessible, et ne sont pas repris comme résultats — fondée sur docs/veille/verifications-backlog/A08-agent-C-reconciliation.md:33 et docs/veille/JOURNAL_BOITE_MAIL.md:89
- R3 : l'estimation principale rapportée pour l'endométrite est OR 3,65 [ICr 95 % 2,36-5,90], sens « pas de préparation vs chlorhexidine » — fondée sur docs/veille/verifications-backlog/A08-agent-C-reconciliation.md:31
- R4 : le texte intégral est déclaré inaccessible (éditeur en 403, pas de contournement), et le niveau de preuve proposé n'est ni `modere` ni `eleve` : une vérification limitée au résumé ne certifie pas davantage que `faible` — fondée sur docs/veille/verifications-backlog/A08-agent-C-reconciliation.md:12-15,51-72
## Exclusions
- docs/veille/verifications-backlog/A08-agent-A.md
- docs/veille/verifications-backlog/A08-agent-B.md
- docs/veille/verifications-backlog/A08-agent-C-reconciliation.md
- docs/veille/JOURNAL_BOITE_MAIL.md
## Signatures
- `41485838` — le PMID de la vraie source
- `3,65` — l'OR global réellement publié
- `2,36` — la borne basse de son intervalle crédible
