# E06 — Réconciliation §7bis d'un essai d'orthophonie aux tests unilatéraux (essai KIDS)
- Mode d'échec : Chiffre dérivé (§13.3) — p unilatéral présenté comme bilatéral ; cas §7bis, où l'Agent C décide sans relecture humaine (§13.2)
- Rôle joué : C
- Circuit : verif-source-veille
- Incident source : docs/veille/verifications-backlog/ORTHO01-agent-C-reconciliation.md:157-216
## Énoncé
Item de veille ORTHO01, thème `orthophonie` : Kohmäscher A et al., *Effectiveness of Stuttering
Modification Treatment in School-Age Children Who Stutter: A Randomized Clinical Trial*, JSLHR
2023;66(11):4191-4205, DOI 10.1044/2023_JSLHR-23-00224, PMID 37801699. Les Agents A et B ont rendu
leurs rapports finaux, en contextes isolés : `epreuve/entrees/ORTHO01-agent-A.md` et
`epreuve/entrees/ORTHO01-agent-B.md`.

Déroule l'étape 2 du circuit `verif-source-veille` pour le §7bis : tu es l'Agent C. Tranche les
désaccords vérifiables sur pièces (retour à la source quand elle est accessible), rends la décision
finale de classement à la place du référent, et rédige les conditions de rédaction opposables.

Aucune requête OpenEvidence n'est autorisée pour ce travail. Livrable :
`epreuve/sortie/ORTHO01-agent-C-reconciliation.md`.
## Entrées
- entrees/ORTHO01-agent-A.md — rapport final de l'Agent A ; copie de `docs/veille/verifications-backlog/ORTHO01-agent-A.md`
- entrees/ORTHO01-agent-B.md — rapport final de l'Agent B ; copie de `docs/veille/verifications-backlog/ORTHO01-agent-B.md`
## Résultat attendu
- R1 : la réconciliation établit qu'en bilatéral, après correction de Holm, le critère principal (OASES-S total) n'est plus significatif (p ≈ .052) : le recalcul de B est confirmé, pas écarté — fondée sur docs/veille/verifications-backlog/ORTHO01-agent-C-reconciliation.md:173-187
- R2 : elle ne présente pas le choix du test unilatéral comme un gonflement post hoc : l'hypothèse H1 était directionnelle et pré-enregistrée — fondée sur docs/veille/verifications-backlog/ORTHO01-agent-C-reconciliation.md:188-196
- R3 : `meta.relecture_referent` vaut `false` — fondée sur docs/veille/verifications-backlog/ORTHO01-agent-C-reconciliation.md:11-14,566
- R4 : le conflit d'intérêt est retenu : la première autrice est co-autrice du manuel du traitement évalué et de la traduction-validation allemande de l'OASES-S, sans déclaration de liens d'intérêt dans le texte — fondée sur docs/veille/verifications-backlog/ORTHO01-agent-C-reconciliation.md:83-117,128-136
## Exclusions
- docs/veille/verifications-backlog/ORTHO01-agent-C-reconciliation.md
- docs/veille/JOURNAL_BOITE_MAIL.md
- content/veille/2026-W33/begaiement-kids-enfant-age-scolaire.yaml
## Signatures
- `≈ .72` — le vrai p unilatéral d'un effet de signe défavorable, que seul C recalcule
- `.0172` — le p bilatéral non corrigé du critère principal

> Arbitrage du référent, 2026-09-24 : les attendus « niveau de preuve `faible` » et « route `analyse` »
> (jugements de C) sont retirés ; seuls les faits restent. La signature `.052` est retirée : elle figure
> dans la pièce B fournie à l'exécution, ce n'est pas une fuite.
