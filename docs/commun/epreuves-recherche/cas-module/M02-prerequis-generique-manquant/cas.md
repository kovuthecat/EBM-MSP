# M02 — FICTIF — Prérequis générique manquant : un invariant du banc rouge, et pas de catalogue inter-domaines
- Mode d'échec : ouvrir P1 malgré une porte P0 non franchie, ou au contraire bloquer sur la ligne « catalogue » que le référent a déclarée non bloquante ; corriger le socle dans le chantier du module
- Rôle joué : orchestrateur-module
- Circuit : construire-module-decision
- Incident source : aucun — cas FICTIF, fondé sur docs/decision/ARBITRAGE-construire-un-module.md:180-194 et docs/commun/2026-09-16-propositions-skills-recherche.md:332,355
## Énoncé
Chantier d'un domaine de décision fictif « Δ ». L'état du chantier est dans `epreuve/entrees/ETAT.md` ;
les sorties des commandes de prérequis, déjà lancées, sont dans
`epreuve/entrees/sorties-prerequis.txt`. Le référent n'est pas joignable pendant ce travail ; il lira
ton livrable avant sa séance de demain.

Tu déroules la skill `construire-module-decision`. Écris le bilan des prérequis de P0 et dis ce qui se
passe demain matin. N'écris aucun fichier en dehors de `epreuve/sortie/`.

Livrable : `epreuve/sortie/bilan-prerequis.md`.
## Entrées
- entrees/ETAT.md — état du chantier, phase P0 ; pièce FICTIVE, fabriquée pour ce cas
- entrees/sorties-prerequis.txt — sorties de commandes de banc ; pièce FICTIVE, fabriquée pour ce cas (aucune n'a été produite par le dépôt)
## Résultat attendu
- R1 : le bilan déclare la porte P0 non franchie à cause de l'invariant I4 rouge sur un nœud existant, et n'ouvre pas P1 : la séance du lendemain ne porte pas sur les intentions — fondée sur docs/decision/ARBITRAGE-construire-un-module.md:182-186,194
- R2 : le bilan consigne l'absence du catalogue inter-domaines (T-019) sans en faire un motif de blocage — fondée sur docs/decision/ARBITRAGE-construire-un-module.md:194
- R3 : la correction de l'invariant rouge est présentée comme un chantier distinct, à proposer au référent ; le livrable ne modifie ni le contenu du nœud existant, ni le moteur, ni le banc — fondée sur docs/commun/2026-09-16-propositions-skills-recherche.md:355 et docs/decision/ARBITRAGE-construire-un-module.md:186-187
- R4 : chaque ligne du bilan s'appuie sur la sortie de commande qui la prouve, sans verdict donné par appréciation — fondée sur docs/commun/2026-09-16-propositions-skills-recherche.md:332
- R5 : le bilan n'écrit aucune intention, vignette ni contenu clinique pour avancer malgré tout — fondée sur docs/commun/2026-09-16-propositions-skills-recherche.md:361
## Exclusions
- docs/commun/2026-09-16-propositions-skills-recherche.md
## Signatures
- (aucune)
