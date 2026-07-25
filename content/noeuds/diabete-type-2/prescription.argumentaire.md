# Prescription non‑insulinique du DT2 — Argumentaire exhaustif (fusion B+C+D)

> **Niveau 3 — lecture exhaustive.** Nœud unique issu de la fusion de **B (1re intention)**, **C
> (intensification/optimisation)** et **D (sulfamides/gliptines)** — plan P3, gel S1. Le **détail
> essai‑par‑essai** (matrices CVOT, tête‑à‑tête, méta) reste dans les **dossiers de méthode historiques**
> (les nœuds de contenu B/C/D ont été fusionnés puis retirés ; leurs dossiers de preuve persistent) :
> [`B-premiere-intention.md`](../../../docs/decision/noeuds/B-premiere-intention.md),
> [`C-intensification.md`](../../../docs/decision/noeuds/C-intensification.md) et
> [`D-sulfamides-gliptines.md`](../../../docs/decision/noeuds/D-sulfamides-gliptines.md) : on ne le reproduit pas ici.
> Ce document donne la **logique du nœud fusionné** et les **règles nouvelles** du gel. Dossier de méthode :
> [`../../docs/decision/noeuds/prescription.md`](../../../docs/decision/noeuds/prescription.md). **Statut :
> brouillon v0.1 — à valider par le référent (P3·S6).**

## En bref

Un seul nœud pilote toute la prescription non‑insulinique. **Refonte S8 (2026‑07‑25)** : l'interrogation
part de **l'intention du praticien** — `initier / intensifier / optimiser / déprescrire` — qui **organise** le
flux de saisie et l'affichage et **déduit** la position vs objectif (`cible_atteinte`), l'HbA1c seule ne
donnant pas le « vs cible » sans le nœud A. **Principe non‑étanche** : l'intention n'est jamais un filtre dur —
les gestes transverses (un switch révélé pendant une intensification, un switch issu d'une déprescription pour
risque…) restent affichés. Les gestes se combinent — **ajouter / switcher / réduire / arrêter** — sur un socle
metformine, avec une **palette glycémique** (cf. ci‑dessous), une place résiduelle SU/gliptine et un **gate
insuline d'initiation** (catabolisme).

Points‑clés :

1. **Hiérarchie de valeur** (importée de B/C) : iSGLT2 et AR GLP‑1 ont un bénéfice d'organe démontré (CVOT vs
   placebo, critères durs) ; **sulfamides et gliptines n'en ont aucun** (essais de sécurité CV neutres).
2. **Ajout piloté par la comorbidité** — iSGLT2 si IC / maladie rénale ; AR GLP‑1 si athérome / obésité —
   **indépendamment de l'HbA1c**. **Fix de préférence (bug 9)** : en **athérome pur** (ni IC ni rénal), le
   **GLP‑1 passe devant l'iSGLT2** (qui n'a pas d'effet démontré sur l'IDM/l'AVC), via des priorités
   conditionnelles (D14).
3. **Non‑association gliptine + AR GLP‑1** par construction (même voie incrétine) : c'est un **switch**, jamais
   un ajout (Nauck 2017 ; ADA §9 ; KDIGO PP4.2.3 ; HAS R.80).
4. **Désintensification** chez le sur‑traité : un **HbA1c < 6,5 % sous agent hypoglycémiant** est une
   iatrogénie à corriger **à tout âge** ; l'hypoglycémie/chute récente déclenche aussi chez le sujet fragile
   (HYPOAGE). **Jamais** un agent protecteur (ADA 13.14d).
5. **Gating négatif de terrain** (nouveauté de la fusion) : voir ci‑dessous.

## Les 4 intentions — la logique de décision (S8)

Le clinicien renseigne d'abord **l'intention** (« je souhaite… »), puis — pour les 3 situations avec
traitement — les **traitements en cours**, les **drapeaux**, les **critères positifs** (ASCVD, IC, rein…)
et l'**affinage**. L'intention déduit la position et met en avant le geste principal, sans masquer les autres :

- **Initier** (naïf, objectif non atteint) → metformine socle + agent protecteur selon la comorbidité/le
  terrain ; sinon **palette glycémique** (ci‑dessous). Insuline d'initiation si catabolisme.
- **Intensifier** (objectif **non atteint**) → ajout d'un levier glycémique de la **palette** (priorisé par la
  comorbidité), insuline en repli si la palette non‑insulinique est épuisée.
- **Optimiser** (objectif **atteint** mais traitement sous‑optimal / intolérance / risque) → **switch**
  (SU/gliptine → agent protecteur), ajout d'un protecteur manquant (comorbidité à objectif atteint),
  réduction/arrêt d'un agent mal toléré. Le switch se justifie **même à l'objectif** quand une protection
  n'est pas couverte.
- **Déprescrire** (objectif **dépassé** ou **risque**) → **fort sur les hypoglycémiants** (SU, glinide,
  insuline ; jamais un agent protecteur) ; sinon ciblé, par priorité, sur les agents **sans autre bénéfice que
  le glycémique** (gliptine) puis à **bénéfice associé mais sans le terrain** (iSGLT2/GLP‑1 hors indication +
  risque) → peut aboutir à un **switch**. Déprescrire = **réduire OU arrêter** (réductions distinctes ciblées
  par traitement : insuline, AR GLP‑1, tirzépatide, sulfamide/glinide ; le praticien juge la dose).

**Intolérance** (transversale) : réduire la posologie de la molécule en cause si non majeure, **ou** switcher.
Intolérance **digestive** : metformine **et** AR GLP‑1 en sont deux sources → **viser la metformine d'abord**
(bénéfice le plus faible ; l'intolérance/CI à la metformine ouvre le **remboursement FR** d'une monothérapie
AR GLP‑1 — formulaire Assurance Maladie, Art. 61 conv. médicale, arrêté du 10/01/2025).

## Palette glycémique (S8) — quel levier quand l'objectif n'est pas atteint

iSGLT2 et AR GLP‑1 sont des leviers **glycémiques à part entière**, disponibles **même sans comorbidité** ; la
comorbidité (IC/rein → iSGLT2 ; athérome/obésité → GLP‑1) **priorise** le versant protecteur, elle ne
conditionne pas la disponibilité. **1re ligne** : iSGLT2 + AR GLP‑1 — l'ordre préférentiel (HAS R.74 :
iSGLT2/AR GLP‑1 > iDPP4 > sulfamide) tient à **l'absence d'hypoglycémie et à la perte de poids**, PAS à un
bénéfice d'organe chez le patient purement glycémique (les HR/NNT des CVOT viennent de populations enrichies —
IC, macroalbuminurie — et ne sont pas transférables sans la comorbidité) ; garde‑fou terrain sur les incrétines.
*Divergence Prescrire* : réserve la dapagliflozine à l'IC / l'insuffisance rénale (divergence de degré, non un
usage glycémique général). **Agents possibles avec leurs limites** (bas rang) : insuline, sulfamide, gliptine —
le flag « classes à bénéfice indisponibles » remonte SU/gliptine en rang. **Repli insuline** quand la palette
non‑insulinique est épuisée (metformine + iSGLT2 + AR GLP‑1 toujours déséquilibré ; incrétines exclues par le
terrain chez un patient déjà sous iSGLT2 — en rénal sévère, AR GLP‑1 et sitagliptine restent souvent
utilisables). *(L'ancienne option « intensifier le contrôle glycémique » a été supprimée — absorbée par la
palette.)*

## Gating négatif de terrain (règles NOUVELLES du gel S1)

Le nœud sait désormais **ne pas** proposer un agent malgré une indication positive, quand le terrain le
contre‑indique — la lacune la plus visible des nœuds B/C historiques :

- **AR GLP‑1** : **exclu** si `IMC < 22` **ou** `dénutrition` (perte de poids / sarcopénie délétères).
  L'exclusion `dénutrition` **mord même chez l'obèse** (on peut être obèse **et** dénutri/carencé : l'incrétine
  aggraverait la dénutrition). **Alerte** (sans exclusion) chez le sujet **fragile** (fragilité ≠ dénutrition).
- **Tirzépatide** : **réservé à l'obésité** (`IMC ≥ 30`) associée au diabète, prescription spécialisée ;
  **exclu** si dénutrition. (Le déclencheur ASCVD‑sans‑obésité de B a été **retiré** : plus de tirzépatide chez
  le sujet maigre à haut risque CV.)
- **iSGLT2** : **rétrogradé** (rang 6) et **alerté** si `infections génito‑urinaires récidivantes` (risque de
  gangrène de Fournier) ; `DFG < 20` = exclusion dure (KDIGO).

Ces garde‑fous sont des **décisions référent** (seuils pragmatiques) : la preuve borne la *direction*
(prudence incrétine chez le fragile/dénutri — ADA « Older Adults », SFD Avis 3/5, RCP), pas le chiffre exact.

## Méthode & frontières

Fusion de trois dossiers **déjà validés** ; le socle EBM n'est **pas re‑dérivé** (voir B/C/D). Seules les
règles nouvelles sont sourcées (dossier `prescription.md` §2). **Frontières** : **A** = cible d'HbA1c ; **E** =
ajustement fin de l'insuline (ce nœud recommande l'insuline d'*initiation* ou oriente) ; **F** = statine ;
**H** = MHD / rémission. Décompensation aiguë ≥ 3 mmol/L = urgence, hors périmètre.

## Incertitudes

- Seuils de terrain (IMC 22 / 30) = repères pragmatiques.
- Remboursement FR (intolérance/CI metformine → monothérapie AR GLP‑1 dulaglutide/liraglutide) : **CONFIRMÉ**
  (formulaire Assurance Maladie, Art. 61 convention médicale, arrêté du 10/01/2025). Sémaglutide/autres =
  formulaires propres (même logique).
- Bénéfice dur du switch lui‑même : indirect (valeur comparée des classes) ; additivité iSGLT2+AR GLP‑1 :
  non démontrée sur critère dur (PRECIDENTD) ; désintensification : preuve faible / accord d'experts.

## Sources

Union dédupliquée des sources B/C/D (cf. YAML `sources`) ; détail dans les trois argumentaires historiques.
Sources FR nouvelles (garde‑fous de terrain, remboursement) à annexer après lecture directe (P3·S2/S6).
