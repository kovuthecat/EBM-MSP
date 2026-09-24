# Estimation de coût — mesure finale (T19), avant lancement

Plan P16, session S10/T19. Écrite avant tout lancement (Étape 1 de T19).

## Amendement (arbitrage utilisateur, 2026-09-24, relayé par l'orchestrateur en cours de session)

Seuls les cas du corpus qui exercent le circuit Décision (`recherche-preuve-triangulee`) sont
mesurés en configurations 2 et 3 : **E02, E03, E04, E08, E09, E12** (6 cas — `Circuit` = à
`recherche-preuve-triangulee` dans leur `cas.md`). Les 6 cas restants sont **exclus** de cette mesure :
E01 (`recherche-source-primaire`, le socle seul, pas le circuit triangulé), E05, E06, E07, E10, E11
(`verif-source-veille`, circuit Veille). Motif : instruction explicite de l'utilisateur — « on SAUTE
les épreuves du circuit Veille ». La comparaison à la référence (configuration 1, S4) se fait sur ce
même sous-ensemble de 6 cas (voir « Écarts au plan » du bilan de session pour le détail complet).

## Calcul

- Coût moyen par exécution (S4, configuration 1, `mesures/2026-09-24-reference/resultats.json`) :
  **1,4848925560000006 $**.
- Exécutions prévues ici : 6 cas × 2 configurations (2, 3) × 2 exécutions = **24**.
- **Estimation = 1,48489… × 24 ≈ 35,64 $.**
- **Plafond de dépense (le double, décision clé de T19) ≈ 71,27 $.**

Ce plafond ne compte pas les exécutions du déroulé à blanc (T18, dépense déjà consommée et rapportée
séparément dans `mesures/2026-09-24-deroule/rapport.md`), ni les 3e exécutions ou les reprises
d'exécutions invalidées (couvertes par la même marge du double, suivies au fil de la mesure).

## Sous-ensemble de référence (configuration 1, S4, pour comparaison)

| Cas | Verdict configuration 1 |
| --- | --- |
| E02 | réussi |
| E03 | échoué |
| E04 | échoué |
| E08 | réussi |
| E09 | échoué |
| E12 | échoué |

2 réussis, 4 échoués sur ce sous-ensemble de 6 (corpus discriminant sur ce sous-ensemble aussi : ≥ 3
échecs).
