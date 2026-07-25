# Rapport de validation adversariale — nœud fusionné `prescription` (P2·S3–S7 re-pointé)

> **Contexte.** P2·S3–S7 était conçu pour valider le module DT2 à 7 nœuds. La fusion B+C+D (D18) ayant
> changé la topologie, la validation a été **re-pointée** sur le nœud unique `prescription` + la cohérence
> avec A/E/F/H. **Note d'exécution** : le workflow multi-agents initial a échoué sur une erreur réseau
> (`ENOTFOUND`, contexte sous-agent d'arrière-plan) ; la validation a été conduite (a) par un **agent
> red-team indépendant de premier plan** (qui a abouti), (b) par le **banc de vignettes exécutable**
> (`src/features/decision/engine/evaluateNode.prescription.test.ts`, 21 profils sur le moteur réel), et
> (c) par des **contrôles de cohérence inline**. Une passe multi-agents plus large reste possible si l'on
> souhaite plusieurs adversaires indépendants par dimension.

## Bilan : **0 finding HAUTE**

Aucun geste dangereux, aucune sortie totalement muette, aucun garde-fou dur contournable, aucune association
interdite (gliptine + GLP-1) réalisable. Le module est solide sur ses garde-fous et sa mécanique de tri.

## Findings (3 MOYENNE, 5 BASSE)

| # | Sévérité | Type | Statut |
|---|----------|------|--------|
| M1 | MOYENNE | bug logique | **CORRIGÉ** — `classes_a_benefice_indisponibles == true` supprime désormais O5/O6/O7/O8/O16 (on ne propose plus en tête des classes déclarées inutilisables). |
| M2 | MOYENNE | bug encodage | **CORRIGÉ** — alerte A9 (« remplacer le SU sans remplaçant protecteur valable → surveiller/déprescrire ») encodée (2 disjonctions pur-AND) au lieu de la seule prose. |
| M3 | MOYENNE | arbitrage clinique | **CONSIGNÉ** (incertitude) — obèse + dénutri + sans comorbidité + classes dispo + au-dessus → sortie [socle, poursuivre]. Conservateur défendable ; poser `classes_a_benefice_indisponibles` ouvre la niche SU/gliptine. À confirmer référent. |
| B1 | BASSE | présentation | Menu multi-options en double indication (association + ses composants affichés ensemble). Inhérent au mode menu. |
| B2 | BASSE | arbitrage | Sulfamide en CI rénale (<30) : pas d'option d'arrêt dédiée (asymétrie avec la metformine) ; message porté par l'alerte A2c. |
| B3 | BASSE | seuil assumé | Falaise du 6,5 % : `en_dessous` non extrême (6,5–cible) ne déclenche ni intensification ni déprescription. Choix gelé du champ 4 crans. |
| B4 | BASSE | déjà acté | Double message socle metformine / intolérance (atténué par la clause d'exception d'O2). |
| B5 | BASSE | doc | **CORRIGÉ** — SPEC (3→4 crans), vignettes (`sur_traitement` retiré), cross-refs E/H (→ nœud prescription). |

## Contrôles passés (traçabilité)

- **Non-association gliptine+GLP-1** par construction (sous gliptine, seuls switch O9 / arrêt combo O10).
- **Désintensification** ne cible que SU/glinide/insuline ; jamais iSGLT2/GLP-1.
- **Gate catabolique** : HbA1c 11 + glucotoxicité + cétonémie + IC → iSGLT2 exclu, insuline d'initiation + alerte.
- **Garde-fous durs** : metformine socle exclue DFG<30 ; SU exclu DFG<30 ; iSGLT2 exclu DFG<20 ;
  GLP-1/tirzépatide exclus dénutrition (mord chez l'obèse) ; association exclue sur dénutrition.
- **Fix bug 9** : athérome pur → GLP-1 devant iSGLT2 ; IC/rénal → l'inverse.
- **Refus d'injection** : incrétines reléguées (rang 7) mais non supprimées + alerte ; iSGLT2 oral devant.
- **Cohérence inter-nœuds** : `terrain_fragile` identique à E ; `cible_atteinte` sémantiquement aligné ;
  seuils DFG 20/30/45/60 cohérents prescription↔E ; frontière prescription→E nette. Aucun seuil divergent.
- **EBM / persona Prescrire** : aucun gain de substitution durci en bénéfice d'organe (O9/O11 attribuent le
  bénéfice dur à la classe de remplacement) ; association en `faible` ; tirzépatide « non-infériorité » ;
  HR/NNT cohérents avec les sources. Pas de survente.

## Suite

- **M3 + B1/B2/B3** : arbitrages référent (non bloquants) — à trancher pour une v1.1 éventuelle.
- Nœud `prescription` promu **`valide` v1.0** (D18). Re-pointage formel des fiches P2·S3–S7 : la validation
  ci-dessus en tient lieu ; les fiches `plans/P2/S3–S7.md` restent la référence de méthode.
