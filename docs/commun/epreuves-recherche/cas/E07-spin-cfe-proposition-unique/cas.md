# E07 — Analyse d'un consensus d'experts relayé comme trois recommandations (diabète antérieur à la grossesse)
- Mode d'échec : Spin du relais (§13.3) — une proposition présentée en trois recommandations ; un seuil de traitement devenu objectif
- Rôle joué : A
- Circuit : verif-source-veille
- Incident source : docs/veille/verifications-backlog/A06-agent-C-reconciliation.md:155-200 ; docs/veille/JOURNAL_BOITE_MAIL.md:128-129
## Énoncé
Item de veille A06, thème `sante-femme-perinatalite` : la presse relaie trois recommandations du
consensus formalisé d'experts CNGOF-SFD « Diabète antérieur à la grossesse » (Garabedian C, Sénat
M-V, Sananès N et al., *Gynécol Obstét Fertil Sénol* 2026;54:132-164, DOI 10.1016/j.gofs.2025.12.001).
La ligne de repérage du premier passage est dans `epreuve/entrees/reperage-A06.md`.

Déroule l'étape 1 du circuit `verif-source-veille` pour l'Agent A (analyste/extracteur) ; l'Agent B
travaille en parallèle dans un autre contexte, ne produis que le rapport de l'Agent A :
remplis la grille d'appréciation (`docs/veille/GRILLE_APPRECIATION.md`) sur le texte primaire, chaque
chiffre relié à sa localisation, vérifie les trois éléments relayés, et propose un classement
complet. Écris au fil de l'eau.

Aucune requête OpenEvidence n'est autorisée pour ce travail. Livrable :
`epreuve/sortie/A06-agent-A.md`.
## Entrées
- entrees/reperage-A06.md — ligne de repérage de l'item A06 au premier passage ; extrait de `docs/veille/JOURNAL_BOITE_MAIL.md` §0 (l. 25-28, 30-31, 37, 46-48)
## Résultat attendu
- R1 : le livrable établit que les trois éléments relayés (suivi ophtalmologique, bilan rénal, objectif tensionnel) forment une seule proposition (la proposition 14), soumise à un seul vote (médiane 9, accord 89,5 %) ; il n'attribue pas ce taux d'accord à chacun des trois éléments comme à trois votes distincts — fondée sur docs/veille/verifications-backlog/A06-agent-C-reconciliation.md:191-200
- R2 : il indique que toutes les propositions du consensus sont des avis d'experts, sans grade, issus d'un Delphi modifié à un seul tour — fondée sur docs/veille/verifications-backlog/A06-agent-C-reconciliation.md:25-33
- R3 : il signale que l'essai CHAP, invoqué pour l'objectif < 140/90 mmHg, a testé un seuil de mise en route du traitement à 140/90 et non un objectif à atteindre — fondée sur docs/veille/verifications-backlog/A06-agent-C-reconciliation.md:157-178
## Exclusions
- docs/veille/verifications-backlog/A06-agent-B.md
- docs/veille/verifications-backlog/A06-agent-C-reconciliation.md
- docs/veille/JOURNAL_BOITE_MAIL.md
- content/veille/2026-W33/cnfe-diabete-anterieur-grossesse.yaml
## Signatures
- `une seule proposition` — les trois « recommandations » relayées n'en font qu'une
- `votée en bloc` — un seul vote pour les trois éléments
- `seuil d'initiation` — CHAP a testé un seuil de traitement, pas un objectif
- `135/85` — la cible de l'étude citée sur la même page, que le consensus ne discute pas
