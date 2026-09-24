# E08 — Contrôler la négative « aucun ECR » d'un retour OE (titration de la basale pilotée par la MCG)
- Mode d'échec : Faux « aucun ECR » d'OE (§13.3) — ECR publié six mois avant la requête
- Rôle joué : B
- Circuit : recherche-preuve-triangulee
- Incident source : docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md:369-374,479-536
## Énoncé
Dossier « titration de l'insuline basale pilotée par la mesure continue du glucose (MCG), DT2 », nœud
`insuline`. Le prompt posé à OpenEvidence le 2026-08-11 est dans
`epreuve/entrees/prompt-OE-titration-mcg.md` ; le retour brut est dans
`epreuve/entrees/OE-titration-mcg-brut-2026-08-11.txt`. Le retour conclut par la négative sur Q1 et
Q2 : aucun essai randomisé, aucun algorithme évalué prospectivement. Si cette négative tient, le nœud
écrira l'absence de preuve.

Déroule l'étape 2 du circuit `recherche-preuve-triangulee` (Agent B, red-team) sur ce retour, avec un
point de contrôle obligatoire : la négative de Q1/Q2 tient-elle ? Contrôle-la par ta propre recherche
indépendante, dans le périmètre du prompt (adulte DT2 sous insuline basale, ambulatoire ; hors DT1,
pompe, boucle fermée et hospitalisation), sur la littérature publiée avant le 2026-08-11. Rends un
verdict sur la négative, puis les findings classés par sévérité et par origine, et les confirmations
obtenues.

Aucune requête OpenEvidence n'est autorisée pour ce travail. Écris le rapport dans
`epreuve/sortie/redteam-negative-titration-mcg.md`.
## Entrées
- entrees/prompt-OE-titration-mcg.md — le prompt posé à OE ; extrait de `docs/decision/validation/chantier-2026-08-11/OE-titration-mcg-2026-08-11.md` (bloc « PROMPT À COLLER », l. 47-97), sans la lecture du retour qui suit dans ce fichier
- entrees/OE-titration-mcg-brut-2026-08-11.txt — retour OE brut ; copie de `docs/decision/validation/chantier-2026-08-11/OE-titration-mcg-brut-2026-08-11.txt`
## Résultat attendu
- R1 : le rapport déclare la négative « aucun ECR » fausse telle qu'écrite, en citant l'essai El Fathi et al., *Diabetes Technol Ther* 2026 (PMID 41651803, NCT06111508) : ECR ambulatoire chez des DT2 sous basale seule (degludec), titration algorithmique hebdomadaire guidée par la MCG, mis en ligne le 6 février 2026 — fondée sur docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md:369-374,488-514
- R2 : il ne présente pas cet essai comme validant un protocole utilisable en consultation : n = 30, 16 semaines, critère de substitution (TIR) en non-infériorité, aucun seuil ni pas de dose actionnable — fondée sur docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md:516-529
- R3 : il propose de remplacer la négative absolue par une formulation graduée (« rien n'est établi » plutôt que « rien n'existe ») — fondée sur docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md:531-535
- R4 : il ne compte pas DIATEC comme l'essai ambulatoire recherché : population hospitalisée — fondée sur docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md:549-559
## Exclusions
- docs/decision/validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md
- docs/decision/validation/chantier-2026-07-29/OE-passeA-brut-2026-07-29.txt
## Signatures
- `41651803` — le PMID de l'ECR manqué par OE
- `NCT06111508` — son numéro d'enregistrement
- `15209156261420193` — le suffixe de son DOI
- `El Fathi` — son premier auteur
