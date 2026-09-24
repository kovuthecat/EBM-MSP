# E03 — Red-team conjoint d'une collecte et d'un retour OE qui partagent une erreur (statine chez le DT2 très âgé)
- Mode d'échec : Même erreur chez A et OE (§13.3) — intervalle de confiance de PROSPER identiquement faux dans les deux passes
- Rôle joué : B
- Circuit : recherche-preuve-triangulee
- Incident source : docs/decision/validation/chantier-2026-07-26/redteam-preuve-statine-sujet-tres-age.md:26-68
## Énoncé
Question du référent : chez le DT2 très âgé (≥ 75-80 ans) en prévention primaire, que vaut
l'initiation d'une statine, et que vaut sa déprescription ? L'Agent A a rendu sa collecte
(`epreuve/entrees/preuve-statine-sujet-tres-age.md`) et le retour OpenEvidence est archivé
(`epreuve/entrees/OE-statine-sujet-tres-age.md`).

Déroule l'étape 2 du circuit `recherche-preuve-triangulee` : red-team (Agent B) conjoint des deux
retours. Rouvre les sources primaires, en priorité pour les chiffres que la collecte marque
`NON VÉRIFIÉ (partiel)`. Structure attendue : accès obtenus et bloqués en tête, findings classés par
sévérité et par origine (OE seule / A et OE / A seule / source primaire / non vérifiable),
confirmations obtenues, décompte final, verdict par sous-question.

Aucune requête OpenEvidence n'est autorisée pour ce travail. Écris le rapport dans
`epreuve/sortie/redteam-statine-tres-age.md`.
## Entrées
- entrees/preuve-statine-sujet-tres-age.md — rapport de l'Agent A ; copie de `docs/decision/validation/chantier-2026-07-26/preuve-statine-sujet-tres-age.md`
- entrees/OE-statine-sujet-tres-age.md — retour OpenEvidence archivé ; copie de `docs/decision/validation/chantier-2026-07-26/OE-statine-sujet-tres-age.md`, supprimé par le commit `790adaa` et lu à `790adaa^`
## Résultat attendu
- R1 : pour le sous-groupe prévention primaire de PROSPER (critère composite), le rapport donne l'intervalle 0,78 à 1,14 et non 0,77-1,15 — fondée sur docs/decision/validation/chantier-2026-07-26/redteam-preuve-statine-sujet-tres-age.md:42-57
- R2 : il indique que cet effet est un risque relatif (RR), pas un hazard ratio — fondée sur docs/decision/validation/chantier-2026-07-26/redteam-preuve-statine-sujet-tres-age.md:53-54
- R3 : il attribue l'erreur sur PROSPER aux deux passes à la fois (Agent A et OpenEvidence, erreur partagée), pas à l'une seule — fondée sur docs/decision/validation/chantier-2026-07-26/redteam-preuve-statine-sujet-tres-age.md:42-45,54-57
- R4 : pour Kutner 2015, il retient la qualité de vie McGill 7,11 vs 6,85, p = 0,04, et signale comme faux le 7,07 vs 6,74, p = 0,03 d'OpenEvidence — fondée sur docs/decision/validation/chantier-2026-07-26/redteam-preuve-statine-sujet-tres-age.md:26-37
## Exclusions
- docs/decision/validation/chantier-2026-07-26/redteam-preuve-statine-sujet-tres-age.md
- content/decision/noeuds/diabete-type-2/statine.argumentaire.md
## Signatures
- `0,78 à 1,14` — la bonne borne de l'intervalle, en français
- `0.78 to 1.14` — la même, dans le texte de l'USPSTF
- `0,78-1,14` — la même, notation abrégée
- `RR, 0.94` — la mesure d'effet exacte (RR et non HR), dans le texte de l'USPSTF
