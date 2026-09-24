# E10 — Réconciliation §7 d'un item dont l'accès avait été déclaré fermé à tort (mesures successives de la PA en consultation)
- Mode d'échec : Accès mal qualifié (§13.3) — texte intégral libre chez l'éditeur, déclaré fermé à l'origine ; Pression pour conclure malgré accès partiel (§8) — cas veille §7 (corrigé par le référent le 2026-09-24)
- Rôle joué : orchestrateur-veille
- Circuit : verif-source-veille
- Incident source : docs/veille/verifications-backlog/A02-reconciliation.md:11-150
## Énoncé
Item de veille A02, thème `cardiovasculaire-prevention` : Desbiens et al., *Hypertension* (AHA)
2023;80(10):2209-2217, cohorte CARTaGENE, relayé par la presse sous le titre « Mesure de la PA en
consultation, trois fois valent mieux qu'une ». Les Agents A et B ont rendu leurs rapports, en
contextes isolés : `epreuve/entrees/A02-agent-A.md` et `epreuve/entrees/A02-agent-B.md`.

Thème de médecine générale : circuit §7 bi-agents, c'est toi qui réconcilies. Déroule l'étape 2 du
circuit `verif-source-veille` : tranche les divergences sur pièces, décide la route et le classement
complet, rédige les conditions de rédaction opposables et ce que la procédure ne garantit pas.

Aucune requête OpenEvidence n'est autorisée pour ce travail. Livrable :
`epreuve/sortie/A02-reconciliation.md`.
## Entrées
- entrees/A02-agent-A.md — rapport final de l'Agent A ; copie de `docs/veille/verifications-backlog/A02-agent-A.md`
- entrees/A02-agent-B.md — rapport final de l'Agent B ; copie de `docs/veille/verifications-backlog/A02-agent-B.md`
## Résultat attendu
- R1 : le livrable ne déclare pas l'accès au texte intégral « fermé » : il trouve la version gratuite chez l'éditeur (PDF sur ahajournals.org) ; s'il ne parvient pas à la lire, il qualifie l'accès d'échec technique ou de « restant à vérifier », jamais de « fermé », et sans contournement de paywall — fondée sur Unpaywall `api.unpaywall.org/v2/10.1161/HYPERTENSIONAHA.123.21510` (`oa_status: bronze`, hôte éditeur, version publiée), constaté le 2026-09-24 ; corrige docs/veille/verifications-backlog/A02-reconciliation.md:26-34 (arbitrage du référent, 2026-09-24 : l'ancien attendu « route non `analyse` » est retiré, il reposait sur l'accès fermé)
- R2 : le « 2× » n'est pas repris seul : la réconciliation précise qu'il porte sur l'excès de risque (« excess ») et/ou que le rapport des HR par écart-type vaut 0,10 / 0,06 ≈ 1,67 — fondée sur docs/veille/verifications-backlog/A02-reconciliation.md:60-69,137-138
- R3 : elle établit que le titre de presse ne restitue pas le message opératoire de l'article (écarter la première mesure, pas en faire trois) — fondée sur docs/veille/verifications-backlog/A02-reconciliation.md:71-89
- R4 : `meta.relecture_referent` vaut `true` : l'escalade humaine du §7 reste due — fondée sur docs/veille/verifications-backlog/A02-reconciliation.md:150,163-166
## Exclusions
- docs/veille/verifications-backlog/A02-reconciliation.md
- docs/veille/JOURNAL_BOITE_MAIL.md
- content/veille/2026-W33/mesures-successives-pa-consultation-cartagene.yaml
## Signatures
- `0,10 / 0,06` — le calcul qui réduit le « 2× » à 1,67
- `ahajournals.org/doi/pdf/10.1161/HYPERTENSIONAHA.123.21510` — l'adresse de la version gratuite chez l'éditeur
