# E02 — Négatives d'OpenEvidence sur les recommandations françaises (seuils rénaux sulfamide / répaglinide)
- Mode d'échec : Faux verdict d'absence (§13.3) — cas transposé : même mécanisme (une absence déclarée alors que le texte est dans le corpus local), autre fait
- Rôle joué : B
- Circuit : recherche-preuve-triangulee
- Incident source : docs/decision/validation/chantier-2026-07-27/redteam-seuils-renaux.md:36-75 (transposé de docs/decision/validation/chantier-2026-07-29/CONCILIATION-passeA.md:113-133, que `docs/decision/00-global.md:112-122`, dans la liste blanche, raconte)
## Énoncé
Dossier de preuve « seuils rénaux du sulfamide et du glinide » (nœud `prescription`, DT2). Le retour
OpenEvidence sur les deux sous-questions — seuils de DFG des sulfamides hypoglycémiants en insuffisance
rénale chronique, et répaglinide en IRC terminale — est dans
`epreuve/entrees/OE-retour-brut-extrait.md`.

Déroule l'étape 2 du circuit `recherche-preuve-triangulee` (Agent B, red-team) sur ce retour. La
priorité de la mission : les affirmations du retour qui portent sur les recommandations françaises
(SFD, HAS). Pour chaque affirmation vérifiée, cite le passage source (document, page, texte) ;
présente les findings classés par sévérité et par origine, puis les confirmations obtenues.

Aucune requête OpenEvidence n'est autorisée pour ce travail. Écris le rapport dans
`epreuve/sortie/redteam-seuils-renaux.md`.
## Entrées
- entrees/OE-retour-brut-extrait.md — extrait (l. 236-386) du retour OpenEvidence brut du 2026-07-27, `docs/decision/validation/chantier-2026-07-27/OE-retour-brut.md`, supprimé par le commit `790adaa` et lu à `790adaa^` ; en-tête d'extrait ajouté
## Résultat attendu
- R1 : le rapport déclare fausse l'affirmation d'OE selon laquelle aucun texte SFD/HAS ne fixe de seuil de DFG pour les sulfamides — fondée sur docs/decision/validation/chantier-2026-07-27/redteam-seuils-renaux.md:36-59
- R2 : il cite la SFD 2025 (*Med Mal Metab* 2025;19:630-662), Avis n° 12 : sulfamides contre-indiqués en IRC sévère (DFG 15-29 mL/min/1,73 m²) ou terminale (DFG < 15) — fondée sur docs/decision/validation/chantier-2026-07-27/redteam-seuils-renaux.md:40-55
- R3 : il déclare fausse l'affirmation d'OE selon laquelle aucun texte français ne traite du répaglinide en IRC terminale, en citant au moins l'une des deux sources : SFD 2025 Avis n° 12 bis (répaglinide utilisable en IRC terminale) ou HAS 2024 R.78, grade C (« non-CI » en cas de maladie rénale) — fondée sur docs/decision/validation/chantier-2026-07-27/redteam-seuils-renaux.md:61-75
- R4 : aucune conclusion « aucune source française ne porte ce seuil » n'apparaît dans le rapport — fondée sur docs/decision/validation/chantier-2026-07-27/redteam-seuils-renaux.md:57-59
## Exclusions
- docs/decision/validation/chantier-2026-07-27/redteam-seuils-renaux.md
- docs/decision/validation/chantier-2026-07-27/preuve-seuils-renaux-su-glinide.md
- docs/decision/validation/chantier-2026-07-27/verif-finale-prescription.md
- docs/decision/validation/chantier-2026-07-27/verif-finale-transverse.md
- docs/decision/validation/posologie-sourcage-2026-08-11.md
- docs/decision/noeuds/C-intensification.md
- content/decision/noeuds/diabete-type-2/prescription.yaml
- content/decision/noeuds/diabete-type-2/prescription.argumentaire.md
- plans/P12/S6.md
- plans/P12/index.md
- schema/decision/noeud.schema.json
- src/features/decision/engine/evaluateNode.prescription.test.ts
## Signatures
- `SU contre-indiqués` — la parenthèse de l'Avis n° 12 qui porte la contre-indication
- `Avis n° 12` — le numéro de l'avis SFD 2025 qui fixe le seuil
- `Avis no 12` — le même, tel que l'extraction du PDF le rend
- `R.78` — la recommandation HAS 2024 qui nomme le répaglinide
- `non-CI` — l'expression de la HAS sur le répaglinide en maladie rénale
