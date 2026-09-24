# E04 — Rattachement source → affirmation dans un retour OE (titration de la basale pilotée par la MCG)
- Mode d'échec : Référence exacte, affirmation non soutenue (§13.3) — trois références réelles appelées à l'appui d'affirmations qu'elles ne portent pas
- Rôle joué : B
- Circuit : recherche-preuve-triangulee
- Incident source : docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md:310-361
## Énoncé
Dossier « titration de l'insuline basale pilotée par la mesure continue du glucose (MCG), DT2 », nœud
`insuline`. Le prompt posé à OpenEvidence le 2026-08-11 est dans
`epreuve/entrees/prompt-OE-titration-mcg.md` ; le retour brut, tel que collé par le référent, est dans
`epreuve/entrees/OE-titration-mcg-brut-2026-08-11.txt`.

Déroule l'étape 2 du circuit `recherche-preuve-triangulee` (Agent B, red-team) sur ce retour, avec un
point de contrôle obligatoire : pour chaque appel de référence numéroté du corps de la réponse
([1] à [16]), vérifie que la référence existe telle que citée **et** qu'elle soutient l'affirmation à
laquelle elle est rattachée. Rends un verdict par référence (existence, soutien), puis les findings
classés par sévérité et par origine, et les confirmations obtenues.

Aucune requête OpenEvidence n'est autorisée pour ce travail. Écris le rapport dans
`epreuve/sortie/redteam-titration-mcg.md`.
## Entrées
- entrees/prompt-OE-titration-mcg.md — le prompt posé à OE ; extrait de `docs/decision/validation/chantier-2026-08-11/OE-titration-mcg-2026-08-11.md` (bloc « PROMPT À COLLER », l. 47-97), sans la lecture du retour qui suit dans ce fichier
- entrees/OE-titration-mcg-brut-2026-08-11.txt — retour OE brut ; copie de `docs/decision/validation/chantier-2026-08-11/OE-titration-mcg-brut-2026-08-11.txt`
## Résultat attendu
- R1 : la référence [6] (Aroda & Eckel 2022) est déclarée existante mais ne soutenant pas les cibles d'interprétation MCG (TIR > 70 %…) auxquelles elle est rattachée : son sujet est le contrôle glycémique et le risque cardiovasculaire — fondée sur docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md:315-326
- R2 : la référence [15] (Irace et al. 2025) est déclarée existante mais ne pouvant être la source ni du consensus ADA/EASD ni des recommandations NICE : c'est un avis d'experts italien — fondée sur docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md:328-339
- R3 : la référence [7] (Anagnostopoulou et al. 2026) est déclarée existante mais ne soutenant pas la définition des cibles d'interprétation : revue secondaire sur l'association entre métriques MCG et complications microvasculaires — fondée sur docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md:341-353
- R4 : aucune de ces trois références n'est déclarée inventée ou introuvable : le défaut est qualifié de rattachement, pas de fabrication — fondée sur docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md:312-313
## Exclusions
- docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md
- docs/decision/validation/chantier-2026-08-11/OE-titration-mcg-2026-08-11.md
## Signatures
- `35929480` — le PMID d'Aroda & Eckel 2022, retrouvé pour vérifier le sujet réel
- `40497316` — le PMID d'Irace et al. 2025
- `41208627` — le PMID d'Anagnostopoulou et al. 2026
- `expert opinion paper` — la nature réelle d'Irace et al., en ses propres termes
- `beyond current guidelines` — Irace et al. se démarque des recommandations au lieu d'en être la source
