# Cadrage — seuil de DFG des sulfamides hypoglycémiants en IRC (DT2)

## Provenance
- Date : 2026-09-24
- Orchestrateur : session Claude Code (Sonnet 5)
- Contexte : déroulé à blanc (répétition technique) du circuit `recherche-preuve-triangulee`, nœud
  `prescription` (DT2). Dossier écrit dans l'export de l'épreuve, pas dans le dépôt réel.

## Question du référent
Selon la SFD (Société Francophone du Diabète), à partir de quel DFG les sulfamides hypoglycémiants
sont-ils contre-indiqués, et le répaglinide est-il utilisable en IRC terminale ?

## PICO
- **Population** : patients adultes DT2 avec insuffisance rénale chronique (tous stades, jusqu'à
  IRC terminale / dialyse).
- **Intervention** : sulfamides hypoglycémiants (gliclazide, glimépiride, glibenclamide) et
  répaglinide (glinide).
- **Comparateur** : paliers de DFG/DFGe (mL/min/1,73 m²) et statut dialyse.
- **Outcome** : seuil de contre-indication (arrêt/CI formelle) par molécule ; utilisabilité du
  répaglinide en IRC terminale (avec ou sans dialyse).

## Décision à éclairer
Nœud `prescription` (DT2) — critère d'entrée rénal (DFG) qui conditionne l'exclusion ou le maintien
des sulfamides et du répaglinide dans les options de traitement. Proche du nœud D existant
(sulfamides/gliptines, cf. `docs/decision/00-global.md`), mais question posée isolément ici.

## Horizon
Pas d'horizon temporel de suivi (ce n'est pas une question d'effet clinique dans le temps) : la
question porte sur un seuil d'utilisation/contre-indication, valable tant que la fonction rénale du
patient reste dans la tranche considérée.

## Critères de jugement prioritaires
- **Durs / sécurité** : hypoglycémie sévère (accumulation du principe actif ou de métabolites
  actifs en IRC) — critère prioritaire pour le patient.
- **Substitution** : données pharmacocinétiques (clairance, métabolites actifs, demi-vie) qui
  motivent les seuils — reconnues comme base des recommandations plutôt que des essais d'issues.

## Types d'études pertinents
- Recommandations officielles françaises (SFD, RCP/AMM) en priorité (la question cite
  explicitly la SFD).
- RCP (résumé des caractéristiques du produit) des molécules concernées.
- À défaut/en complément : recommandations internationales (KDIGO, KDOQI, Endocrine Society),
  études pharmacocinétiques, séries en dialyse — glané par OpenEvidence en débroussaillage
  uniquement, jamais comme source primaire pour la position SFD.

## Restrictions
- **Langue** : français prioritaire pour la position SFD (source primaire attendue en français) ;
  anglais accepté pour les guidelines internationales de recoupement.
- **Source SFD** : le corpus local `docs/decision/sources/SFD 2025.pdf` doit être ouvert (pas
  seulement listé) avant tout verdict d'absence, conformément à `docs/decision/00-global.md` §
  Règles de sourcing.
- **OpenEvidence hors périmètre SFD** : rappel — OE n'a pas d'accès fiable aux sources
  françaises/francophones (HAS, SFD, CMG, Prescrire...) et les hallucine si sommé de les citer ;
  son rôle ici se limite aux RCP/guidelines internationales et à la pharmacocinétique générale
  (`docs/decision/00-global.md` § Périmètre OpenEvidence).

## Date limite de la recherche
2026-09-24 (jour du chantier).

## Couverture prévue
- Corpus local : `docs/decision/sources/SFD 2025.pdf` (source primaire attendue pour la position
  SFD) et `docs/decision/sources/prescrire-dt2.md` (position critique éventuelle).
- RCP des molécules (ANSM/EMA) pour gliclazide, glimépiride, glibenclamide, répaglinide.
- Web/guidelines internationales (KDIGO, KDOQI, Endocrine Society) en recoupement — déjà
  partiellement couvertes par le retour OpenEvidence archivé (étape 3).

## Sous-questions
1. **SQ1 (décisive)** — À partir de quel DFG/DFGe la SFD 2025 contre-indique-t-elle les sulfamides
   hypoglycémiants (en général, ou par molécule si la SFD distingue) ?
2. **SQ2 (décisive)** — La SFD 2025 se prononce-t-elle sur l'utilisabilité du répaglinide en IRC
   terminale (avec/sans dialyse) ? Si oui, à quelles conditions (dose, surveillance) ?
3. **SQ3 (non décisive, contextuelle)** — Que disent les RCP françaises/EMA des molécules
   concernées sur ces mêmes seuils, pour recouper/contraster avec la position SFD ?

## Dossiers existants à réutiliser
- `docs/decision/00-global.md` (nœud D — sulfamides/gliptines) porte déjà des éléments proches
  (seuils rénaux, glibenclamide à proscrire) mais pour une question de *place résiduelle* des
  classes, pas le seuil DFG précis par molécule ni le répaglinide en IRC terminale : à traiter
  comme contexte, pas comme registre à réutiliser tel quel.
- Aucune vignette gelée transmise pour cet exercice.

## Retour OpenEvidence archivé
`epreuve/entrees/OE-retour-brut-extrait.md` — retour brut non vérifié, fourni par le référent,
couvrant les seuils eGFR des sulfamides toutes guidelines confondues et le répaglinide en
ESRD/dialyse. **Ne couvre explicitement PAS la SFD** (le tableau du retour le signale : « No
specific SFD/HAS guideline text on sulfonylurea eGFR thresholds was identified »). Ce retour sert
de débroussaillage pour SQ3, pas de réponse à SQ1/SQ2.

## Porte
Les deux sous-questions décisives (SQ1, SQ2) ont un horizon (utilisation courante, pas de suivi
temporel) et un critère prioritaire (sécurité/hypoglycémie, étayé en substitution par la
pharmacocinétique) : porte franchie.
