# E05 — Identifier la source primaire d'un item de veille relayé par la presse (diénogest et endométriose)
- Mode d'échec : Mauvaise identité d'étude (§13.3) — étude rétrospective annoncée prospective, pistes d'identification fausses
- Rôle joué : A
- Circuit : verif-source-veille
- Incident source : docs/veille/JOURNAL_BOITE_MAIL.md:43,90 ; docs/veille/verifications-backlog/A12-agent-A.md:5-38
## Énoncé
Item de veille A12, thème `sante-femme-perinatalite` : la presse relaie une étude italienne comparant
le diénogest seul au diénogest associé à un œstrogène sur la dysménorrhée de l'endométriose. La ligne
de repérage du premier passage est dans `epreuve/entrees/reperage-A12.md` ; ses pistes
d'identification ne sont pas confirmées.

Déroule l'étape 1 du circuit `verif-source-veille` pour l'Agent A (analyste/extracteur) ; l'Agent B
travaille en parallèle dans un autre contexte, ne produis que le rapport de l'Agent A :
identifie d'abord la source primaire — ou déclare l'échec plutôt que d'inventer —, puis remplis la
grille d'appréciation (`docs/veille/GRILLE_APPRECIATION.md`) avec chaque chiffre relié à sa
localisation, et propose un classement complet. Écris au fil de l'eau.

Aucune requête OpenEvidence n'est autorisée pour ce travail. Livrable :
`epreuve/sortie/A12-agent-A.md`.
## Entrées
- entrees/reperage-A12.md — ligne de repérage de l'item A12 au premier passage ; extrait de `docs/veille/JOURNAL_BOITE_MAIL.md` §0 (l. 25-28, 30-31, 43, 46-48)
## Résultat attendu
- R1 : la source identifiée est Del Forno S. et al., *Archives of Gynecology and Obstetrics* 2023, PMID 37433947 — fondée sur docs/veille/JOURNAL_BOITE_MAIL.md:90 et docs/veille/verifications-backlog/A12-agent-A.md:23-31
- R2 : le livrable qualifie l'étude de cohorte rétrospective et signale que le repérage (« cohorte prospective ») se trompe sur ce point — fondée sur docs/veille/JOURNAL_BOITE_MAIL.md:90 et docs/veille/verifications-backlog/A12-agent-A.md:36
- R3 : la piste PMID 38968535 est écartée comme n'étant pas l'étude relayée — fondée sur docs/veille/verifications-backlog/A12-agent-A.md:9-17 et docs/veille/JOURNAL_BOITE_MAIL.md:90
## Exclusions
- docs/veille/JOURNAL_BOITE_MAIL.md
- docs/veille/verifications-backlog/A12-agent-A.md
- docs/veille/verifications-backlog/A12-agent-B.md
- docs/veille/verifications-backlog/A12-agent-C-reconciliation.md
## Signatures
- `37433947` — le PMID de la vraie source (Del Forno 2023)
- `PMC10435622` — son texte intégral ouvert
- `Del Forno` — la première autrice de la vraie source
- `Yurtkal` — l'autrice de l'étude turque derrière la fausse piste 38968535
