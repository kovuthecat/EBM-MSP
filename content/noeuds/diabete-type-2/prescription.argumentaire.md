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

**Ajout 2026‑07‑26 (chantier prérequis/I7/intention, non clinique)** : les deux options d'insuline
(« Insuline d'initiation », « Envisager l'insuline ») excluent désormais explicitement le patient déjà
sous insuline (alignées sur les 6 autres options d'ajout du nœud). Une nouvelle alerte informative
(`intention == deprescrire`) explique qu'un ajout affiché malgré une intention de déprescription reflète
une indication transverse ou un switch, jamais une contradiction — le primer reste **non filtrant**
(aucune option supprimée). L'élargissement de la désintensification au socle (metformine, iSGLT2 sans
indication d'organe) reste, pour l'iSGLT2, un **arbitrage clinique non tranché**, volontairement non
encodé (cf. `incertitudes` du YAML) — pour la **metformine**, voir le lot suivant.

**Ajout 2026‑07‑26, 2e série (arbitrages référent)** : deux décisions cliniques.

1. **Déprescription de la metformine sous 3 conditions cumulatives** — arbitrage resté ouvert depuis la
   capture 6, tranché par le référent : *« on peut la déprescrire si sur-traitement chez une personne
   fragile et que les autres agents sont tous des agents à bénéfice dur. »* Encodé via le critère dérivé
   `metformine_deprescriptible` : (1) sur-traitement = état **déclaré** `position_vs_cible ==
   sous_objectif` (R1 — jamais l'intention) ; (2) fragilité = drapeau saisi `fragilite == true` ; (3)
   absence de tout agent sans bénéfice dur en cours (sulfamide, gliptine, glinide **et insuline**).
   **Lecture stricte sur l'insuline** (interprétation de l'orchestrateur, à confirmer par le référent) :
   l'insuline n'a pas de bénéfice démontré sur critère dur (ORIGIN neutre) — un patient sur-traité fragile
   *sous insuline* ne remplit donc pas la 3ᵉ condition et la metformine n'est **pas** déprescrite dans ce
   cas ; c'est cliniquement cohérent, c'est l'**insuline** qu'on allège d'abord chez ce patient (options
   « Désintensifier » / « Réduire la posologie de l'insuline », déjà applicables sur ce même profil).
   ⚠ **Divergence déclarée avec la reco officielle** : la HAS maintient la metformine en socle quelles que
   soient les comorbidités (badge « Recommandation officielle (France) » sur l'option socle). Proposer sa
   déprescription s'appuie sur l'**absence de bénéfice démontré vs placebo** (Griffin 2017, Boussageon 2012
   NS) et un `niveau_preuve` **faible** — c'est une position raisonnée de l'outil sous conditions strictes,
   **pas** un alignement HAS/SFD/ADA ; déclaré comme tel dans l'option (`inconvenients`) et dans
   `sources.reco_officielle.explication` du YAML. Garde-fou en miroir : l'option socle « Metformine —
   instaurer ou poursuivre » exclut désormais `metformine_deprescriptible == true` (même mécanique que son
   exclusion `DFG < 30`), pour ne jamais afficher « poursuivre » et « déprescrire » côte à côte sur le même
   agent.
2. **Alerte cétonémie sous insuline précisée** — le référent valide l'alerte ajoutée le même jour (message
   d'urgence qui vivait dans les `contre_indications` d'une option depuis exclue du patient déjà sous
   insuline) avec une précision clinique : *« en pratique, une cétose chez un patient sous insuline est
   très rare, sauf en cas de rupture thérapeutique. »* Le message désigne désormais la **rupture
   thérapeutique** (arrêt, oubli, défaut d'administration, panne de pompe) comme la **première chose à
   rechercher**, avant d'orienter vers un ajustement de schéma (nœud E) ; seuil 3 mmol/L, suspicion de DT1
   et renvoi au nœud E inchangés.

**Ajout 2026‑07‑26, 3e série (arbitrage référent, chantier vignettes — recette capture 1, problème 2)** :
« Réduire la posologie de la metformine » se déclenchait sur la seule fourchette de DFG, sans connaître la
dose **ACTUELLE** du patient — impossible de savoir si une réduction s'impose sans elle. Le référent :
*« Metformine présente devrait peut-être demander de renseigner la dose. »* Nouveau critère
`dose_metformine` (nombre, mg/j), visible seulement si la metformine est en cours ; l'option n'est
applicable que si cette dose dépasse le **maximum ajusté au DFG** — seuils repris tels quels des alertes
rénales déjà présentes (RCP ANSM : 45‑59 → max 2 g/j ; 30‑44 → max 1 g/j). La branche intolérance digestive
reste indépendante de la dose. Tant que la dose n'est pas renseignée alors que le DFG situe le patient dans
l'une des deux bandes, l'option passe **en attente** (D20 : « à renseigner : dose de metformine ») plutôt
que d'affirmer une réduction à l'aveugle. L'alerte rénale (paliers DFG) est inchangée — elle reste vraie
quel que soit le geste retenu.

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
- Désintensification du **socle** (2e série, 2026‑07‑26) : **partiellement tranchée** pour la metformine
  seule, sous les 3 conditions cumulatives ci‑dessus (`metformine_deprescriptible`) — **divergence déclarée**
  avec la reco officielle (HAS maintient la metformine quelles que soient les comorbidités). Reste **non
  tranché** : la désintensification de l'iSGLT2 sans indication d'organe, et le cas d'un sur‑traité qui ne
  réunit pas les 3 conditions (non fragile, ou agent sans bénéfice dur — y compris insuline — encore en
  place).

## Sources

Union dédupliquée des sources B/C/D (cf. YAML `sources`) ; détail dans les trois argumentaires historiques.
Sources FR nouvelles (garde‑fous de terrain, remboursement) à annexer après lecture directe (P3·S2/S6).
