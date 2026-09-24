# Mesure de référence — configuration 1 (skills actuelles)

Plan P16, session S4/T6. Commit mesuré : `7681ceefaa180d8154e8ff32bddbd38a2067faed` (`plan(P16):
refonte des skills de recherche (D65, option C)`) — les skills sont dans leur état d'avant P16, quoi
que fasse S5 en parallèle. Harnais : `docs/commun/epreuves-recherche/harnais/` (S4/T5). Modèle des
exécutions : `sonnet` (même modèle que les configurations 2 et 3 à venir, décision clé T5).

Chaque cas a tourné 2 fois ; E05 a demandé une 3ᵉ exécution (1/2). Toutes les exécutions retenues
sont **valides** (aucune invalidée : ni tentative d'outil vers le dépôt ou Interface-OE, ni URL
github.com/kovuthecat — cf. § Invalidations). Dix exécutions du lot initial (E08-E12) ont échoué
techniquement (limite de débit de l'API, 429) et ont été rejouées une fois avec succès ; elles ne
comptent pas dans les 25 exécutions retenues ci-dessous.

## Table des verdicts

| Cas | Exécutions (score / assertions) | Verdict | grading.json |
| --- | --- | --- | --- |
| E01 — accès PMC (sur-basalisation) | 1: 4/4 · 2: 4/4 | **réussi** | `E01/execution-{1,2}/grading.json` |
| E02 — absence SFD (seuil rénal) | 1: 4/4 · 2: 4/4 | **réussi** | `E02/execution-{1,2}/grading.json` |
| E03 — erreur partagée (PROSPER) | 1: 1/4 · 2: 1/4 | **échoué** | `E03/execution-{1,2}/grading.json` |
| E04 — mésattribution (cibles MCG) | 1: 3/4 · 2: 2/4 | **échoué** | `E04/execution-{1,2}/grading.json` |
| E05 — identité (diénogest) | 1: 3/3 · 2: 0/3 · 3: 2/3 | **échoué** (1/3) | `E05/execution-{1,2,3}/grading.json` |
| E06 — réconciliation §7bis (KIDS) | 1: 2/4 · 2: 3/4 | **échoué** | `E06/execution-{1,2}/grading.json` |
| E07 — spin du relais (CFE) | 1: 2/3 · 2: 2/3 | **échoué** | `E07/execution-{1,2}/grading.json` |
| E08 — faux « aucun ECR » (titration MCG) | 1: 4/4 · 2: 4/4 | **réussi** | `E08/execution-{1,2}/grading.json` |
| E09 — capture du signe « < » | 1: 2/3 · 2: 2/3 | **échoué** | `E09/execution-{1,2}/grading.json` |
| E10 — accès mal qualifié (PA, consultation) | 1: 3/4 · 2: 3/4 | **échoué** | `E10/execution-{1,2}/grading.json` |
| E11 — OR seul, NNT (antisepsie) | 1: 3/4 · 2: 3/4 | **échoué** | `E11/execution-{1,2}/grading.json` |
| E12 — OE incomplet (FICTIF) | 1: 3/4 · 2: 3/4 | **échoué** | `E12/execution-{1,2}/grading.json` |

**Réussis : 3/12** (E01, E02, E08). **Échoués : 9/12** (E03, E04, E05, E06, E07, E09, E10, E11, E12).
Non mesurés : 0. Un cas est réussi seulement si TOUTES ses assertions R* passent sur une exécution
(règle skill-creator, appliquée par chaque correcteur) ; « réussi » cas = 2/2 exécutions ainsi
pleinement conformes (README § Règle de verdict).

**Corpus discriminant : oui** (9 cas échoués ≥ 3, index.md § Risques « Corpus plat »). Le risque
« corpus plat » est réfuté : la mesure de gain par couche (S10) reste pleinement interprétable.

## Invalidations

**0 exécution invalidée** parmi les 25 retenues (0 tentative de lecture du dépôt/`Interface-OE`,
0 URL `github.com/kovuthecat`). Un correctif localisé a été nécessaire en cours de mesure : les 14
premières exécutions avaient d'abord été invalidées à tort par un motif d'invalidation trop large
(`Interface-OE` nu, qui matchait le nom même du fichier whitelisté `OUTIL-INTERFACE-OE.md` et un
chemin d'exemple qu'il documente) — corrigé dans `transcription.mjs` (commit `fb96bc4`,
`Plan: P16/S4/T5`), puis les transcriptions déjà enregistrées ont été ré-analysées avec la version
corrigée (aucune donnée perdue, aucune exécution rejouée pour cette cause).

## Coût et durée

- **Coût moyen par exécution : 1,48 $** (min 0,39 $, max 4,54 $ — le maximum reste très sous le seuil
  de 5 $/exécution en moyenne sur les 4 premières qui aurait déclenché le repli « Si bloqué » de T6 ;
  moyenne réelle des 4 premières : 1,50 $).
- **Coût total : 37,12 $** pour 25 exécutions retenues (hors les 10 exécutions E08-E12 du premier lot,
  rejouées après échec technique 429, coût non compté car non abouties).
- **Durée cumulée : 7 807 s** (≈ 2 h 10, exécutions en concurrence 2 → durée d'horloge réelle
  inférieure). Durée par exécution : de 106 s (E12/2) à 656 s (E03/1).

## Omissions observées

Oui — plusieurs, toutes du même type : une étude, un fait ou une nuance que l'exécution n'a pas
trouvé ou pas relié à l'assertion attendue, d'après les assertions échouées :

- **E03** (les deux exécutions) — le rapport qualifie systématiquement le chiffre PROSPER de
  « HR » (hazard ratio) et ne relève jamais qu'il s'agit d'un RR (risque relatif) ; les deux
  exécutions nient explicitement qu'il s'agisse d'une erreur partagée entre Agent A et OpenEvidence,
  alors que c'est l'attendu (R2, R3).
- **E04** — les deux exécutions ratent au moins une des deux références mésattribuées ([6] ou [7]) :
  l'une déclare [7] « NON VÉRIFIABLE » sans conclure qu'elle ne soutient pas l'affirmation, l'autre
  déclare [6] ET [7] « CONFIRMÉE / SOUTENU » alors que les deux devraient être identifiées comme ne
  soutenant pas la cible numérique citée.
- **E05** — exécution 2 : identité inversée, retient PMID 38968535 (la fausse piste) comme l'étude
  source au lieu de Del Forno et al. ; exécution 3 : qualifie bien la cohorte de rétrospective mais
  ne relie jamais ce fait au repérage erroné (« cohorte prospective ») de la pièce d'entrée.
- **E06** (les deux exécutions) — aucune ne relève que l'hypothèse H1 (test unilatéral) était
  directionnelle et pré-enregistrée : le choix du test unilatéral reste implicitement présenté comme
  suspect plutôt que justifié a priori.
- **E07** — exécution 1 : rapporte l'essai CHAP fidèlement mais ne signale pas le seuil de mise en
  route (< 140/90) comme le point contesté ; exécution 2 : l'essai CHAP n'apparaît nulle part dans le
  livrable — omission complète d'une pièce centrale de l'argumentaire.
- **E09** — exécution 1 : sur les quatre essais à vérifier, un seul (AT.LANTUS) n'est pas traité
  correctement ; exécution 2 : ne relève pas explicitement l'anomalie de capture du signe « < » comme
  cause probable de l'absence de seuils.
- **E10** (les deux exécutions) — aucune ne consulte Unpaywall ni ne trouve la version bronze en accès
  libre chez l'éditeur : les deux déclarent l'accès définitivement fermé, alors que R1 attend un
  accès correctement qualifié (bronze/partiel).
- **E11** (les deux exécutions) — la qualification de l'accès et l'absence de contournement sont
  correctes, mais aucune ne relève le NNT non calculable à partir d'un OR seul (R4).
- **E12** (les deux exécutions) — aucune ne consigne explicitement que le modèle OpenEvidence n'est
  pas identifié (R2), alors que le reste de l'orchestration (statut incomplet, absence de nouvelle
  requête) est correctement traité.

Aucune `signature_suspecte` n'a été relevée par les correcteurs sur les 25 exécutions : rien
n'indique de fuite de la réponse cachée vers un livrable.

## Ce que S7, S10 et S11 en tirent

- **S7** (passe d'omission, §13.4) : le motif dominant des échecs est une omission ou une
  mésinterprétation ponctuelle (un HR pris pour un RR, une étude non reliée à son repérage, un essai
  central absent du livrable), pas une défaillance de méthode générale — cohérent avec l'hypothèse
  d'une passe d'omission utile.
- **S10** : plafond de dépense à fixer sur la base de 1,48 $/exécution en moyenne (S4 mesure le coût
  réel, comme prévu).
- Le risque « corpus plat » (index.md) est réfuté : 9 cas échoués sur 12.
