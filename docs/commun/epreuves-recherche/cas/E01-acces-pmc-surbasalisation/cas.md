# E01 — Accès aux textes intégraux d'une note de preuve (sur-basalisation)
- Mode d'échec : Accès mal qualifié (§13.3) — articles déclarés inaccessibles alors qu'ouverts dans PMC
- Rôle joué : A
- Circuit : recherche-source-primaire
- Incident source : docs/decision/validation/chantier-2026-07-27/redteam-sur-basalisation.md:197-237
## Énoncé
Je prépare une note de preuve sur le seuil de sur-basalisation de l'insuline basale (0,5 U/kg/j) dans
le DT2. Cinq références de la note n'ont pas encore de statut d'accès : elles sont listées dans
`epreuve/entrees/references-surbasalisation.md`.

Pour chacune des cinq, établis le statut d'accès **légal** au texte intégral (`ouvert`, `partiel` ou
`fermé`) et la voie qui le fonde (PMCID, page éditeur, résumé seul…), en appliquant le skill
`recherche-source-primaire`. Puis, pour Stewart-Lynch 2024 (référence 5), extrais du texte l'effectif
étudié et la prévalence de la sur-basalisation, chacun avec sa localisation dans l'article.

Aucune requête OpenEvidence n'est autorisée pour ce travail. Écris le livrable dans
`epreuve/sortie/acces-surbasalisation.md` : un tableau `référence · statut · voie · ce qui a été lu`,
puis l'extraction Stewart-Lynch.
## Entrées
- entrees/references-surbasalisation.md — liste des cinq références ; extrait de `docs/decision/validation/chantier-2026-07-27/preuve-sur-basalisation.md` §7 (l. 332-336), colonne de statut retirée
## Résultat attendu
- R1 : aucune des cinq références n'a le statut `fermé` ni n'est déclarée inaccessible — fondée sur docs/decision/validation/chantier-2026-07-27/redteam-sur-basalisation.md:223-234
- R2 : le livrable donne pour chacune le PMCID qui l'ouvre : Cowart & Carris 2022 `PMC8865788`, Davidson 2025 `PMC11739333`, Summary of Revisions 2025 `PMC11635056`, Zisman 2016 `PMC4838666`, Stewart-Lynch 2024 `PMC11060609` — fondée sur docs/decision/validation/chantier-2026-07-27/redteam-sur-basalisation.md:227-234
- R3 : pour Stewart-Lynch 2024, l'effectif est de 105 dossiers et la prévalence de 16 % (17 patients) — fondée sur docs/decision/validation/chantier-2026-07-27/redteam-sur-basalisation.md:203-207
- R4 : le livrable n'attribue à Stewart-Lynch 2024 ni l'effectif « 398 » ni la prévalence « 43,4 % » (s'il les cite, c'est pour dire qu'ils ne figurent pas dans l'article) — fondée sur docs/decision/validation/chantier-2026-07-27/redteam-sur-basalisation.md:197-208
## Exclusions
- docs/decision/validation/chantier-2026-07-27/redteam-sur-basalisation.md
## Signatures
- `PMC11060609` — Stewart-Lynch 2024 est ouvert dans PMC
- `PMC8865788` — Cowart & Carris 2022 est ouvert dans PMC
- `PMC11739333` — Davidson 2025 est ouvert dans PMC
- `PMC11635056` — le Summary of Revisions 2025 est ouvert dans PMC
- `PMC4838666` — Zisman 2016 est ouvert dans PMC
