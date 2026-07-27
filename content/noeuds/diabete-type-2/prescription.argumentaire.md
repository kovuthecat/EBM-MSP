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

**Ajout 2026‑07‑26, 4e série (deux audits red-team indépendants, sécurité + silences)** : quatre défauts
GRAVES corrigés.

1. **Sulfamide et metformine sous DFG < 30 : deux gestes contradictoires affichés ensemble.** « Arrêter »
   et « Réduire la posologie » se déclenchaient tous les deux — le premier parce que l'agent est
   **contre-indiqué** sous ce seuil, le second parce qu'une de ses branches (intolérance digestive pour la
   metformine ; l'option entière pour le sulfamide/glinide) n'était **pas bornée au DFG**. Corrigé par une
   `exclusions: ["DFG < 30"]` sur les deux options « Réduire », symétrique de celle déjà en place sur le
   socle metformine. **44 %** du sous-groupe sulfamide + DFG < 30 sévère était concerné (3,5 % pour la
   metformine, branche intolérance).
2. **iSGLT2 en place + cétonémie confirmée : aucune option ne le suspendait (25 % du sous-groupe, priorité
   absolue du lot).** Une cétonémie positive sous iSGLT2 est le tableau typique de l'**acidocétose
   euglycémique sous gliflozine** (FDA/EMA), d'autant plus piégeuse que la glycémie peut rester proche de
   la normale. Le seul rappel du dépôt vivait dans `insuline.yaml`, inatteignable depuis ce nœud, et
   l'alerte cétonémie de CE nœud ne testait même pas `cetonemie` directement (deux proxys seulement : HbA1c
   ≥ 10, symptômes de glucotoxicité). Corrigé par une nouvelle option « Suspendre l'iSGLT2 (cétonémie
   confirmée) », famille sécurité, déclenchée par la seule conjonction iSGLT2-en-cours + cétonémie —
   structurelle, indépendante de l'objectif glycémique (les garde-fous d'urgence sont orthogonaux à la
   position vs cible) — et par l'élargissement du `quand` de l'alerte cétonémie à `cetonemie == true`.
3. **Le sur-traitement DÉCLARÉ (`position_vs_cible == sous_objectif`) ne pilotait aucun allègement de
   l'insuline, du sulfamide ou du glinide seuls.** Ce critère, introduit par R1 précisément pour capter le
   sur-traitement relatif à l'objectif du patient (au-delà du seuil absolu `hba1c_sous_cible`), n'était
   référencé QUE par `metformine_deprescriptible`. Généralisé aux trois options d'allègement restantes
   (« Désintensifier », « Réduire la posologie de l'insuline », « Réduire la posologie du sulfamide / du
   glinide »), **sans** exiger la fragilité — celle-ci ne conditionne que la déprescription de la
   metformine, dernier agent réputé « sûr » à garder.

Détail des profils exacts, des règles en cause et des vignettes ajoutées :
`docs/decision/validation/chantier-2026-07-26/redteam-clinique-securite.md` (findings 1-3) et
`redteam-clinique-silences.md` (finding F1). Résiduel signalé, non corrigé faute de source : aucune option
« Arrêter le glinide » dédiée n'existe dans ce nœud (contrairement au sulfamide) — un patient sous glinide
**seul** à DFG < 30 perd donc son geste de réduction sans verdict de remplacement (cf. `incertitudes` du
YAML).

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
*Le bénéfice d'organe des iSGLT2 (mortalité CV, événements rénaux) est démontré dans des essais menés sur des
populations enrichies en insuffisance cardiaque ou maladie rénale (EMPA-REG OUTCOME ; DAPA-CKD, NNT 19/2,4 ans ;
EMPEROR-Reduced, NNT 19) — pas dans une population purement glycémique, d'où une lecture plus prudente (Prescrire)
réservant la dapagliflozine à ces indications d'organe (divergence de degré, non un désaccord sur l'usage
glycémique général).* **Agents possibles avec leurs limites** (bas rang) : insuline, sulfamide, gliptine —
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

## Insuffisance rénale — les seuils, et ce qui les porte réellement

*Section ajoutée le 2026-07-27, après une collecte de preuve et une re-vérification adversariale qui a rouvert
chaque source primaire. Elle corrige une attribution que le nœud portait depuis l'origine.*

### Le seuil de 30 des sulfamides n'est pas une convention — c'est une citation

Le nœud écrivait « DFG < 30, convention KDIGO/SFD ». Vérification en source primaire, puis re-vérification
indépendante :

- **La KDIGO 2022 ne porte AUCUN chiffre sur les sulfamides.** Sa seule phrase les reliant au DFG est
  qualitative — « *sulfonylureas that are long-acting or cleared by the kidney should be avoided at low
  eGFRs* » — et renvoie à une revue, pas à une norme. Sa Figure 23, l'algorithme de choix, ne chiffre que la
  metformine et l'iSGLT2 ; le sulfamide y est relégué sans le moindre nombre. **L'attribution KDIGO était
  fausse et a été retirée.**
- **La SFD, elle, porte le chiffre et la contre-indication dans la MÊME phrase**, et sur deux éditions (2023
  et 2025) : Tableau I note 1 (stade 4 = DFG 15-29, stade 5 = < 15), note 2 (« les sulfamides hypoglycémiants
  sont contre-indiqués en cas d'IRC sévère ou terminale »), et Avis n° 12 qui attache « (SU contre-indiqués) »
  aux plages chiffrées. Il n'y a aucune déduction à faire.
- **La HAS 2024 ne nomme jamais un sulfamide individuel** — zéro occurrence de `clazide|piride|clamide|pizide`
  dans ses 17 249 lignes — et ne porte aucun seuil de DFG pour la classe. Le guide HAS parcours maladie rénale
  chronique non plus : il se récuse explicitement sur le glycémique. Le négatif HAS est complet et fermé.

**Ce qui n'est délibérément PAS encodé** : la distinction entre molécules. Elle est réelle — le gliclazide est
métabolisé en métabolites **inactifs**, le glimépiride produit un métabolite M1 **actif** qui s'accumule — et
portée par au moins deux sociétés savantes **étrangères** : l'Endocrine Society 2019 (glimépiride « *should
not be used with an eGFR < 30* », recommandation graduée) et la Société suisse d'endocrinologie 2012
(gliclazide seul jusqu'à 40, glimépiride contre-indiqué < 60). Aucune source **française** de rang
recommandation ne la porte, et les seuils étrangers contrediraient les RCP français. Motif rectifié au
passage : « aucune source **française** », et non « aucune source » — la collecte avait écrit la seconde
formulation, qui est fausse.

### Le glinide n'est pas un sulfamide, et son RCP le dit

L'option unique « réduire le sulfamide ou le glinide » portait une exclusion `DFG < 30` héritée du sulfamide.
Elle retirait donc au patient sous répaglinide **le geste que son propre RCP recommande**. Scindée en deux le
2026-07-26 :

- **Aucune contre-indication rénale** au RCP (rubrique 4.3, cinq contre-indications, aucune rénale — vérifié
  jusque sur le RCP centralisé EMA de Novonorm) ; élimination hépatobiliaire à plus de 90 %.
- **Exposition doublée en insuffisance rénale sévère** : ASC ×2 entre 20 et 39 ml/min après cinq jours de
  traitement (rubrique 5.2). L'étude sous-jacente a été identifiée par le red-team : **Schumacher 2001**,
  34 patients. C'est très exactement ce qui justifie une **prudence posologique**, c'est-à-dire le geste que
  l'option propose. Une alerte d'option le porte à partir de DFG < 40.
- **Deux sources françaises de rang recommandation le nomment** : SFD 2025 Avis n° 12 bis (liste fermée des
  molécules utilisables sous DFG 15, répaglinide compris) et HAS 2024 R.78, grade C.

**Ce qui reste ouvert, et qu'il ne faut pas clore.** La collecte proposait de fermer le résiduel « pas de
donnée sous 20 ml/min » au motif qu'une PK spécifique de l'hémodialysé existerait — Marbury 2000, bras de six
patients avec dosage du dialysat, « *hemodialysis did not significantly affect repaglinide clearance* ». Le
red-team a montré que ce bras est en **dose unique ×2 avec washout** : il établit que l'hémodialyse n'épure
pas le répaglinide, **pas** qu'une prise prandiale répétée soit sûre chez le dialysé. Il a aussi relevé la
phrase que la collecte omettait, dans le même résumé — « *the elimination rate constant in the group with
severe renal impairment decreased after 1 week of treatment* », soit un signal d'accumulation — et le fait que
l'étiquetage FDA **nie** l'existence de toute étude sous CrCl 20 ou en hémodialyse. Formulation juste :
l'option est **soutenue par une recommandation** (SFD, sous 15) mais **sans donnée pharmacocinétique d'état
d'équilibre en dialyse**.

### Le sujet âgé : un durcissement que le nœud n'exprimait qu'en prose

La SFD a durci sa note 6 entre deux éditions. 2023 : « il est **préférable d'éviter** de prescrire un
sulfamide ou un glinide chez les sujets âgés fragiles ou dépendants ». 2025 : « il est recommandé d'**éviter**
chez les sujets âgés "fragiles" et de **ne JAMAIS les utiliser** chez les sujets âgés "dépendants" ».

La prohibition n'existait dans le nœud qu'en prose (« déconseillé chez le sujet à risque d'hypoglycémie
élevé »), c'est-à-dire à un cran plus faible que « ne jamais ». Une **exclusion** a été posée sur l'option
sulfamide. **Sur-blocage assumé** (décision référent) : le nœud n'a pas de catégorie « dépendant » —
`fragilite` est un booléen — de sorte que l'exclusion retire aussi le sulfamide au sujet **fragile**, que la
source dit seulement d'éviter. Choix délibéré, du côté sûr d'un garde-fou d'hypoglycémie. Le glinide, visé par
la même phrase, n'a pas d'option d'ajout dans ce nœud : rien à exclure de ce côté, et les options qui le
**réduisent** ou l'**arrêtent** restent ouvertes — arrêter un traitement est une option, jamais une exclusion.

### Un plancher d'HbA1c qui dépend du traitement

SFD 2025, Avis n° 12 : en IRC sévère ou terminale, « on visera une HbA1c cible ≤ 8 %, avec une **limite
inférieure de 7 %** en cas de traitement par **glinide ou insuline** (SU contre-indiqués), pour minimiser le
risque hypoglycémique ».

Le garde-fou du nœud était unique, à 6,5 %. Un patient à DFG 25 sous répaglinide et HbA1c 6,8 % était donc
**dans la zone que la SFD interdit sans déclencher aucun garde-fou numérique** — il n'était rattrapé que si le
praticien déclarait lui-même un sur-traitement. Le plancher est désormais **conditionnel** : 7 % si DFG < 30
sous glinide ou insuline, 6,5 % sinon.

**Lecture littérale assumée** : la SFD attache ce plancher au couple « IRC sévère + glinide/insuline ». Elle
ne dit rien du patient à DFG < 30 sous un autre agent, ni du patient sous glinide/insuline à DFG 30-44. Ces
deux zones restent au plancher général. C'est fidèle à la source ; ce n'est pas nécessairement la bonne
lecture clinique.

### Quelle gliptine sous DFG 30

Le nœud proposait « sitagliptine 25 mg, dialyse incluse », en trois endroits. La SFD 2025 écrit **deux fois**
que cette forme **n'est pas commercialisée en France** et désigne à sa place la **vildagliptine 50 mg/j**. Le
red-team n'avait pas pu ouvrir la base de données publique des médicaments et avait explicitement laissé le
point au référent plutôt que de le deviner — la bonne conduite, et elle a payé : **le référent a vérifié, la
sitagliptine 25 mg n'est effectivement pas disponible en France**. Les trois libellés nomment donc désormais
la vildagliptine. Le rang et les conditions de l'option gliptine sont **inchangés** : seule la molécule
nommée change, aucune exclusion rénale n'a été ajoutée, aucune source n'en porte.

Aucune contradiction avec la règle « gliptine française = sitagliptine » posée ailleurs dans le domaine :
celle-là porte sur la **classe disponible** en France, celle-ci sur le **dosage utilisable** en rénal sévère.

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
