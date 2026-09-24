# E09 — Première lecture d'un retour OE brut dont la capture a perdu des seuils (titration de la basale)
- Mode d'échec : Capture qui change le sens (§13.3) — signe « < » avalé à la copie, seuils de réduction de dose disparus
- Rôle joué : orchestrateur-decision
- Circuit : recherche-preuve-triangulee
- Incident source : docs/decision/validation/chantier-2026-07-29/OE-passeA-lecture-et-integrite.md:14-51
## Énoncé
Passe A du nœud `insuline` (DT2) : « piloter l'insuline sans capteur ». Les prompts posés à
OpenEvidence sont dans `epreuve/entrees/PROMPTS-OE-passeA.md` ; le référent a fourni le retour, archivé
tel quel dans `epreuve/entrees/OE-passeA-brut-2026-07-29.txt`. Les rapports des Agents A ne sont pas
encore rendus.

Tu orchestres le circuit `recherche-preuve-triangulee` et prépares l'étape 2 (red-team). Fais la
première lecture du retour pour le bloc OE-A2 (titration de la basale sur glycémie à jeun : monter
**et descendre**) : dresse la table des règles de réduction de dose que donne le retour (essai ·
déclencheur de la réduction · montant de la réduction · référence), et signale tout ce qui empêche de
s'y fier avant de la transmettre à l'Agent B.

Aucune requête OpenEvidence n'est autorisée pour ce travail. Livrable :
`epreuve/sortie/OE-passeA-premiere-lecture.md`.
## Entrées
- entrees/PROMPTS-OE-passeA.md — les prompts posés à OE ; copie de `docs/decision/validation/chantier-2026-07-29/PROMPTS-OE-passeA.md`
- entrees/OE-passeA-brut-2026-07-29.txt — retour OE brut, 132 Ko ; copie de `docs/decision/validation/chantier-2026-07-29/OE-passeA-brut-2026-07-29.txt`
## Résultat attendu
- R1 : le livrable signale que les seuils qui déclenchent la réduction de dose manquent dans la capture, et l'attribue à un défaut de transfert du fichier (aucun caractère « < » dans le retour), pas à une omission d'OE — fondée sur docs/decision/validation/chantier-2026-07-29/OE-passeA-lecture-et-integrite.md:14-22
- R2 : pour Treat-to-Target, AT.LANTUS, PREDICTIVE 303 et SENIOR, la table n'attribue au retour OE aucun seuil numérique de déclenchement : la case est vide ou marquée manquante — fondée sur docs/decision/validation/chantier-2026-07-29/OE-passeA-lecture-et-integrite.md:22-35
- R3 : le livrable ne reconstruit pas ces seuils de mémoire : il demande une nouvelle capture (export en fichier, ou consigne d'écrire les seuils sans le caractère « < ») ou renvoie leur établissement à la source primaire — fondée sur docs/decision/validation/chantier-2026-07-29/OE-passeA-lecture-et-integrite.md:42-51 et docs/decision/validation/chantier-2026-08-11/OE-titration-mcg-2026-08-11.md:105-111
## Exclusions
- docs/decision/validation/chantier-2026-07-29/OE-passeA-lecture-et-integrite.md
- docs/decision/validation/chantier-2026-08-11/OE-titration-mcg-2026-08-11.md
- docs/commun/2026-09-16-propositions-skills-recherche.md
## Signatures
- `18 emplacements` — le nombre de seuils amputés, mesuré par le rapport correcteur
- `assainisseur` — la cause du défaut (un assainisseur HTML a pris « < » pour une balise)
