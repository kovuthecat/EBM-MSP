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

**Ajout 2026‑07‑26 (prérequis/I7/intention, non clinique)** : les deux options d'insuline
(« Insuline d'initiation », « Envisager l'insuline ») excluent désormais explicitement le patient déjà
sous insuline (alignées sur les 6 autres options d'ajout du nœud). Une nouvelle alerte informative
(`intention == deprescrire`) explique qu'un ajout affiché malgré une intention de déprescription reflète
une indication transverse ou un switch, jamais une contradiction — le primer reste **non filtrant**
(aucune option supprimée). L'élargissement de la désintensification au socle (metformine, iSGLT2 sans
indication d'organe) reste, pour l'iSGLT2, un **arbitrage clinique non tranché**, volontairement non
encodé (cf. `incertitudes` du YAML) — pour la **metformine**, voir le lot suivant.

**Ajout 2026‑07‑26 (arbitrages référent)** : deux décisions cliniques.

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

**Ajout 2026‑07‑26 (deux audits de sécurité indépendants, sécurité + silences)** : quatre défauts
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

Limite signalée, non corrigée faute de source : aucune option
« Arrêter le glinide » dédiée n'existe dans ce nœud (contrairement au sulfamide) — un patient sous glinide
**seul** à DFG < 30 perd donc son geste de réduction sans verdict de remplacement (cf. `incertitudes` du
YAML).

**Ajout 2026‑07‑26 (arbitrage référent, recette capture 1, problème 2)** :
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

**Ajout 2026‑07‑30 (P9/S8, T-075) — la carte metformine porte enfin un protocole de titration.** Motif :
rapport de recette N1 sur la vignette la plus simple du nœud — *« Aucune dose, aucune titration.
"Instaurer ou poursuivre" n'est pas une prescription. »* Source **unique**, fournie par le référent :
Assurance Maladie (ameli), mémo médecin *« Prescription de metformine chez le patient diabétique de type
2 »* (fichier `memometformine-medecin.pdf`, hors dépôt ; aucune date d'édition visible sur le document
lui-même — les seules dates lisibles sont celles de rapports cités en référence, 2018‑2020). Le mémo
couvre : la place de la metformine (1re intention, maintenue en intensification), son efficacité/sécurité
vs placebo (HbA1c −0,97 %, neutralité pondérale, pas d'hypoglycémie, sécurité CV — HAS 2013), une table
posologie/DFG (≥60 → 3 g/j, 45‑59 → 2 g/j, 30‑44 → 1 g/j, <30 → contre‑indiquée), les cas d'arrêt
momentané (contraste iodé, décompensation cardiaque, chirurgie sous anesthésie, déshydratation aiguë), les
contre‑indications (IRénale/IRespiratoire/IHépatique sévères), et surtout des **mesures de tolérance et un
protocole de titration** : prescrire en 2‑3 prises en milieu/fin de repas, augmenter progressivement à
partir d'une dose d'initiation par paliers d'1 semaine à 15 jours selon la tolérance digestive jusqu'à la
dose cible, avec un exemple concret (cible 2 g/j, Glucophage 1000 mg : ½ cp matin+soir 15 j → ½ cp
matin/1 cp soir 15 j → 1 cp matin+soir 1 mois, retour au palier précédent 15 jours si intolérance),
répartition des prises selon les préférences du patient en gardant la prise au repas, comprimés sécables
en cas de trouble de déglutition, Stagid® (embonate de metformine, moins de metformine base) utile pour
l'instauration.

**Vérification de non‑contradiction (étape 2 de la tâche)** : la table DFG du mémo (≥60 → 3 g/j, 45‑59 →
2 g/j, 30‑44 → 1 g/j, <30 → CI) reproduit **exactement** les seuils déjà encodés dans ce nœud (T-070, S3 :
contre‑indication DFG < 30 de l'option socle ; option « Réduire la posologie de la metformine », seuils
45‑59 → 2 g/j / 30‑44 → 1 g/j). Aucune valeur clinique modifiée, aucune contre‑indication touchée.

**Portée volontairement limitée à l'INSTAURATION** (étape 3) : l'option reste « Metformine (socle du
traitement) — instaurer ou poursuivre » (les deux cas coexistent, aucun critère du nœud ne les distingue
pour cette option). Le protocole de titration n'a de sens que pour un patient naïf ; les deux puces
ajoutées aux `avantages` sont donc explicitement préfixées « En INSTAURATION » / « Observance » plutôt que
formulées comme une instruction générale, pour ne jamais laisser croire qu'un patient déjà stabilisé doit
reprendre une titration.

**Rendu** (décision clé de S8.md) : prose sourcée dans `avantages` — le nœud n'a pas de mécanisme
`calculs` capable de porter une **séquence** de paliers dans le temps (`calculs` évalue une formule unique
depuis les critères du patient, ex. `poids * 0.15` ; le protocole d'instauration est une séquence fixe de
3 paliers de durée fixe, indépendante des critères saisis pour ce nœud) — aucun nouveau mécanisme créé,
conformément à la décision clé. Pour que ces chiffres restent lisibles **sans ouvrir le dépli**
(exigence de S8.md, directement issue de la vignette N1 lue « en 2 minutes de consultation ») : ajout d'un
`apercu` sur l'option — mécanisme générique déjà livré par T-076 (P9/S9) pour la carte statine, réutilisé
tel quel sans modification de schéma ni de composant, reprenant sans recalcul les chiffres déjà écrits
dans les `avantages` ajoutés.

**Ce que le mémo ne couvre pas** : aucun protocole alternatif pour une cible autre que 2 g/j (l'exemple du
mémo est unique), aucune indication de dose maximale au-delà de la table DFG déjà encodée, aucune
précision sur la conduite en cas d'intolérance persistante malgré le retour au palier précédent (déjà
couvert ailleurs dans ce nœud par l'option « Réduire la posologie » et son alerte). Rien de tout cela
n'était demandé par T-075 ; signalé pour mémoire, non comblé par une autre source.

**Ajout 2026-08-01 (P10/S7, T-084) — les deux cartes d'agent à bénéfice d'organe descendent à la molécule
et à la dose.** Motif : rapport de recette, quatre vignettes (N3-N6), la lacune la plus réclamée du
domaine — « je n'ai retenu aucune dose — l'outil ne m'a pas économisé la seule chose qui coûtait ».
Inventaire préalable : les molécules de l'AR GLP‑1 étaient déjà nommées dans l'**intitulé** de la carte
(liraglutide, sémaglutide, dulaglutide) et les CVOT déjà cités dans `references` des deux options — mais
aucune dose n'était encodée nulle part, et l'iSGLT2 ne nommait même pas ses trois molécules dans le corps
de la carte (seulement en garde-fou amputation, « signal canagliflozine », dans les `contre_indications`).

Six RCP lus séparément (procédure centralisée EMA — RCP identique en France, ANSM), **aucune dose déduite
par analogie d'une molécule à l'autre** (D23) :

- **iSGLT2** : dapagliflozine (Forxiga) 10 mg/j, dose unique sans titration ; empagliflozine (Jardiance)
  10 mg/j puis 25 mg/j (dose max) si DFG ≥ 60 et besoin d'un contrôle renforcé ; canagliflozine (Invokana)
  100 mg/j puis 300 mg/j (dose max), mêmes conditions de DFG. Pas de hiérarchie ajoutée entre les trois :
  la protection cardio-rénale reste un effet de classe (D12) — cohérent avec le premier `avantages` déjà
  présent, qui ne l'attribuait à aucune molécule. **Nuance de terrain ajoutée** (sans toucher l'exclusion
  `DFG < 20`, plus large et inchangée) : le plancher de DFG en dessous duquel le RCP déconseille
  D'INITIER diffère par molécule — empagliflozine < 20, dapagliflozine < 25, canagliflozine < 30 (déjà en
  cours : poursuite à 100 mg/j jusqu'à la dialyse). Entre 20 et 24 mL/min/1,73 m², seule l'empagliflozine
  est donc soutenue par son propre RCP pour une instauration.
- **AR GLP‑1** : liraglutide (Victoza) 0,6 mg/j (tolérance digestive) → 1,2 mg/j (≥ 1 sem) → 1,8 mg/j
  (dose max, ≥ 1 sem supplémentaire si besoin) ; sémaglutide injectable (Ozempic) 0,25 mg/sem (4 sem,
  PAS une dose d'entretien) → 0,5 mg/sem → 1 mg/sem (≥ 4 sem à 0,5 mg si besoin) ; dulaglutide
  (Trulicity) 0,75 mg/sem en monothérapie ou 1,5 mg/sem d'emblée en association → 3 mg/sem (≥ 4 sem) →
  4,5 mg/sem (dose max, ≥ 4 sem supplémentaires).

**Disponibilité française vérifiée molécule par molécule** (le domaine a déjà été mordu deux fois par ce
piège — linagliptine et alogliptine jamais commercialisées en France, saxagliptine en retrait) : les six
molécules encodées sont commercialisées ET remboursées en France (base de données publique des
médicaments, ANSM — canagliflozine : déclaration de commercialisation 2024, troisième gliflozine
disponible). **Une seule restriction trouvée** : le RCP européen du sémaglutide autorise un palier
supplémentaire à 2 mg/semaine (après ≥ 4 sem à 1 mg), mais **seules les présentations 0,25/0,5/1 mg
d'Ozempic sont commercialisées en France** (Vidal, gamme Ozempic ; absence du dosage 2 mg confirmée sur
la base ANSM) — dose maximale utilisable en France : 1 mg/semaine. Ni encodé ni supposé pour les doses
déjà en place : aucun changement d'`exclusions`, de `conditions`, de `priorite` ni de `contre_indications`
sur les deux options ; suite complète relancée après coup, aucune option n'a changé de statut (diff de
snapshots relu ligne à ligne).

**Deux résiduels rencontrés, signalés au référent, non corrigés (hors périmètre de cette tâche)** :

1. La `contre_indications` existante de l'option AR GLP‑1 dit : « Refus des injections : préférer le
   sémaglutide oral [Rybelsus] ou une autre classe. » Or Rybelsus a reçu un avis HAS défavorable au
   remboursement en France (SMR insuffisant, 21/07/2021 : « en l'absence de données cliniques robustes
   nouvelles, RYBELSUS... n'a pas de place dans la stratégie thérapeutique du diabète de type 2 ») et
   n'est de fait quasiment pas disponible en pharmacie française. La phrase existante est donc trompeuse
   en pratique — mais corriger un `contre_indications` était explicitement hors périmètre de T-084
   (« Ne touche à aucune condition, exclusion, priorité ou contre-indication »). À trancher par le
   référent : retirer la mention, la nuancer, ou l'assumer comme une option non remboursée mais licite.
2. La séquence des gestes (ordre d'arrêt/instauration) et la surveillance à l'introduction (créatinine
   J15, mycose génitale, jours de maladie) n'apparaissent dans aucune des sources lues pour cette tâche —
   confirmé hors périmètre P10 (`plans/P10/index.md`), non encodé, conforme à la consigne de S7.md.

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

*Section ajoutée le 2026-07-27, après une revue de preuve dédiée qui a rouvert chaque source primaire. Elle
corrige une attribution que le nœud portait depuis l'origine.*

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
passage : « aucune source **française** », et non « aucune source » — une version antérieure employait la
seconde formulation, qui est fausse.

### Le glinide n'est pas un sulfamide, et son RCP le dit

L'option unique « réduire le sulfamide ou le glinide » portait une exclusion `DFG < 30` héritée du sulfamide.
Elle retirait donc au patient sous répaglinide **le geste que son propre RCP recommande**. Scindée en deux le
2026-07-26 :

- **Aucune contre-indication rénale** au RCP (rubrique 4.3, cinq contre-indications, aucune rénale — vérifié
  jusque sur le RCP centralisé EMA de Novonorm) ; élimination hépatobiliaire à plus de 90 %.
- **Exposition doublée en insuffisance rénale sévère** : ASC ×2 entre 20 et 39 ml/min après cinq jours de
  traitement (rubrique 5.2). L'étude sous-jacente est **Schumacher 2001**,
  34 patients. C'est très exactement ce qui justifie une **prudence posologique**, c'est-à-dire le geste que
  l'option propose. Une alerte d'option le porte à partir de DFG < 40.
- **Deux sources françaises de rang recommandation le nomment** : SFD 2025 Avis n° 12 bis (liste fermée des
  molécules utilisables sous DFG 15, répaglinide compris) et HAS 2024 R.78, grade C.

**Ce qui reste ouvert, et qu'il ne faut pas clore.** Une clôture du résiduel « pas de
donnée sous 20 ml/min » a été envisagée un temps, au motif qu'une PK spécifique de l'hémodialysé existerait —
Marbury 2000, bras de six
patients avec dosage du dialysat, « *hemodialysis did not significantly affect repaglinide clearance* ». Une
vérification a montré que ce bras est en **dose unique ×2 avec washout** : il établit que l'hémodialyse n'épure
pas le répaglinide, **pas** qu'une prise prandiale répétée soit sûre chez le dialysé. Le même résumé porte
aussi une phrase omise dans un premier temps — « *the elimination rate constant in the group with
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
que cette forme **n'est pas commercialisée en France** et désigne à sa place la **vildagliptine 50 mg/j**. Une
première vérification n'avait pas pu ouvrir la base de données publique des médicaments, et le point avait
alors été explicitement laissé au référent plutôt que deviné — la bonne conduite, et elle a payé : **le référent a vérifié, la
sitagliptine 25 mg n'est effectivement pas disponible en France**. Les trois libellés nomment donc désormais
la vildagliptine. Le rang et les conditions de l'option gliptine sont **inchangés** : seule la molécule
nommée change, aucune exclusion rénale n'a été ajoutée, aucune source n'en porte.

Aucune contradiction avec la règle « gliptine française = sitagliptine » posée ailleurs dans le domaine :
celle-là porte sur la **classe disponible** en France, celle-ci sur le **dosage utilisable** en rénal sévère.

## Le glinide rejoint les agents sans bénéfice sur critère dur

*Section ajoutée le 2026-07-30 (T-063, plan P8·S5). Une première tentative s'était arrêtée bloquée : le nœud
traitait déjà le glinide comme un agent sans bénéfice dur à plusieurs endroits (désintensification, alerte de
cohérence, `metformine_deprescriptible`), mais **aucune source déjà présente ne documentait cette absence de
bénéfice spécifiquement pour le répaglinide** — les trois sources rénales du nœud (Schumacher, Marbury,
Hasslacher) portent la pharmacocinétique, pas le bénéfice/risque sur critère dur. Écrire un argumentaire par
analogie avec le sulfamide aurait été inventer une preuve (invariant 6, CLAUDE.md). La tâche a donc été
rendue en l'état, puis relancée après une revue de preuve dédiée, **vérifiée source par source contre
PubMed/le texte intégral** — plusieurs PMID renvoyés par la recherche automatisée initiale (OpenEvidence) étaient faux,
corrigés ci-dessous.*

**Ce que le fond du nœud a déjà tranché ailleurs (rappel) : le sens de la décision référent ne change pas.**
Le signal rassemblé ici **renforce** la justification clinique de vouloir remplacer le répaglinide quand une
alternative existe — il ne la contredit pas. Ce qui change, c'est l'honnêteté épistémique du texte : ne
jamais écrire « le répaglinide n'a pas de bénéfice dur » comme un fait neutre et clos. Trois preuves
distinctes, de nature et de force différentes, portent la carte « Remplacer le glinide » — et doivent être
lues séparément, pas condensées.

### (a) Aucun essai contrôlé randomisé dédié au répaglinide sur critère dur n'existe

**Grenet et al. 2019** (PMID 31237921, *PLoS One*), méta-analyse en réseau de **34 essais / 175 966
patients**, construite précisément pour chercher des essais avec mortalité ou MACE comme critère chez tous
les hypoglycémiants du DT2 : *« No trials evaluating glinides or alpha glucosidase inhibitors were found »*.
Ce n'est pas un résultat de neutralité (comme les 4 CVOT de la gliptine, ou CAROLINA/TOSCA.IT pour le
sulfamide) — c'est une **absence totale de donnée randomisée**, à la différence des deux autres classes déjà
traitées par ce nœud comme sans bénéfice dur.

### (b) Signal de classe : mortalité oui, MACE non — et il ne dit rien du répaglinide seul

**Mannucci et al. 2020** (PMID 32811736, *Nutrition, Metabolism and Cardiovascular Diseases*), méta-analyse
de **48 ECR ≥ 52 semaines** portant sur les **insulinosécréteurs poolés** (sulfamides ET glinides, jamais
distingués dans ce résultat) :

- Mortalité toute cause : **MH-OR 1,11 (IC95% 1,00-1,23, p=0,04)** — **significatif**.
- MACE : **MH-OR 1,08 (IC95% 0,96-1,22, p=0,20)** — **non significatif**.

La distinction compte et doit rester lisible séparément : il existe un signal de **surmortalité**, pas de
**MACE**, à l'échelle de la **classe** — ce résultat n'isole pas le répaglinide des sulfamides, et ne dit rien
de sa position relative à l'intérieur du groupe des sécrétagogues.

### (c) Signal répaglinide-spécifique — la pièce centrale, à lire avec ses réserves

**Huang & Yeh 2019** (PMID 31108137, *Diabetes Research and Clinical Practice*) est la donnée
repaglinide-spécifique la plus solide disponible, **texte intégral lu et vérifié** (pas seulement l'abstract) :

- **Cohorte nationale taïwanaise (NHIRD)**, 1,68 million de patients diabétiques incidents, 5 groupes en
  monothérapie initiale — glimépiride (n=66 790), gliclazide (n=97 426), glipizide (n=38 806), glyburide
  (n=92 970), **répaglinide (n=11 468)** — suivi médian **8 ans**.
- **Appariement 1:1 par score de propension** (logit, plus proche voisin, calliper 0,2 écart-type, sans
  remplacement) sur le **glimépiride comme référence** ; Cox stratifié sur la paire appariée. **8
  comparaisons pré-spécifiées, seuil de significativité corrigé Bonferroni p < 0,006** — le répaglinide reste
  significatif sous ce seuil strict.
- **Résultat répaglinide** (référence = glimépiride) : mortalité toute cause **aHR 1,88 (IC95% 1,45-2,43,
  p < 0,001)** ; événement cardiovasculaire combiné (IDM + AVC ischémique) **aHR 1,69 (IC95% 1,25-2,59,
  p = 0,001)**. Le répaglinide affiche les **deux HR les plus élevés des 5 sécrétagogues testés** — pire que
  les 4 sulfamides comparés, glibenclamide inclus.
- **Analyse de sensibilité sans appariement** (cohorte complète, Cox multivarié) : **même hiérarchie
  retrouvée** — le signal résiste au retrait de la procédure d'appariement.

**Réserves, écrites une par une, à ne pas taire :**

- **(i) Observationnel, pas un ECR.** Les auteurs eux-mêmes ne concluent pas à une preuve causale : leur
  formulation est qu'« il serait prudent d'envisager le glimépiride quand un sécrétagogue est nécessaire »,
  pas que le répaglinide cause l'excès observé.
- **(ii) Le score de propension n'inclut ni IMC, ni HbA1c, ni bilan lipidique** — limite explicitement
  reconnue par les auteurs. Une confusion par la **sévérité glycémique de base** (les patients mis sous
  répaglinide plutôt que sulfamide l'étant peut-être pour des raisons cliniques déjà associées à un
  sur-risque) reste possible et non exclue par le design.
- **(iii) La sévérité rénale n'est probablement pas contrôlée.** Les comorbidités ajustées renvoient à la
  définition d'un autre papier (Roumie et al. 2014) et reposent donc vraisemblablement sur des **codes
  diagnostiques CIM-9** (présence d'une IRC), pas sur un DFG continu. C'est précisément la **sévérité** de
  l'insuffisance rénale qui pousse à prescrire du répaglinide plutôt qu'un sulfamide (contre-indiqué sous
  DFG 30) — si cette sévérité n'est pas finement contrôlée, une partie du signal peut refléter un terrain
  plus lourd chez les patients sous répaglinide, pas la molécule elle-même.
- **(iv) Population différente du contexte d'usage de la carte.** La cohorte est une population de
  **primo-prescription en monothérapie**, pas des patients déjà multi-traités chez qui le DFG a déjà écarté
  metformine/sulfamide/gliptine — ce n'est pas exactement la population visée par la carte « Remplacer le
  glinide », qui s'adresse à des patients déjà avancés dans leur parcours thérapeutique.

**Conclusion assumée, GRADE très faible** : ce n'est pas une preuve close, c'est un signal **observationnel,
non causal, spécifique au répaglinide, cohérent en sensibilité**, qui s'ajoute à l'absence totale d'ECR dédié
(a) et au signal de mortalité de classe (b). La carte « Remplacer le glinide » porte `niveau_preuve:
tres_faible` — à dessein différent du `modere` du sulfamide et de la gliptine, qui reposent sur des CVOT
neutres **randomisés**. Les `avantages`/`inconvenients` de la carte reflètent cette nuance : le remplacement
se justifie par l'absence de preuve de bénéfice **et** un signal (non causal) d'excès de risque — **pas** par
une neutralité confirmée comme pour le sulfamide et la gliptine.

### Nuance en sens inverse : l'hypoglycémie, un axe où le répaglinide fait mieux que le sulfamide

**Leonard et al. 2018** (PMID 29108130, cohorte Medicaid, hypoglycémie sévère par molécule en monothérapie) :
répaglinide **aHR 2,03 (IC95% 1,64-2,52) vs metformine**, mais le classement du risque (glyburide >
glimépiride > glipizide > répaglinide > nateglinide) place le répaglinide **derrière les trois sulfamides
comparés** — c'est-à-dire moins à risque d'hypoglycémie sévère qu'eux. Ce n'est pas contradictoire avec (c) :
mortalité/CV et hypoglycémie sévère sont deux axes différents. C'est une contrainte réelle à mettre dans
la balance, en particulier chez un patient dont l'hypoglycémie sous sulfamide serait la préoccupation
première — c'est ce que porte, dans la carte, la mention de la « contrainte propre au glinide ».

**Deux PMID corrigés au passage** (une première recherche automatisée avait renvoyé des identifiants faux, vérifiés par
recherche croisée) : Leonard et al. 2018 est **29108130**, pas 29139156 (article de biochimie sans rapport) ;
Monami et al. 2014 (méta-analyse hypoglycémie sous sulfamides) est **24635837**, pas 25266331 (article sur le
comportement des chèvres). Monami 2014 n'est **pas** versé dans `sources.references_primaires` ni cité
ci-dessus : le sous-résultat qu'il est censé porter (« glinides moins à risque que sulfamides ») n'a **pas**
pu être confirmé dans son abstract lors de la vérification indépendante — conformément à D23, une position
affichée s'appuie sur la donnée publiée et vérifiée, jamais sur une affirmation non retrouvée à la source.

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
- Désintensification du **socle** (2026‑07‑26) : **partiellement tranchée** pour la metformine
  seule, sous les 3 conditions cumulatives ci‑dessus (`metformine_deprescriptible`) — **divergence déclarée**
  avec la reco officielle (HAS maintient la metformine quelles que soient les comorbidités). Reste **non
  tranché** : la désintensification de l'iSGLT2 sans indication d'organe, et le cas d'un sur‑traité qui ne
  réunit pas les 3 conditions (non fragile, ou agent sans bénéfice dur — y compris insuline — encore en
  place).

## Sources

Union dédupliquée des sources B/C/D (cf. YAML `sources`) ; détail dans les trois argumentaires historiques.
Sources FR nouvelles (garde‑fous de terrain, remboursement) à annexer après lecture directe (P3·S2/S6).
