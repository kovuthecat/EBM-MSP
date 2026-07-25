# Nœud `prescription` (fusion B+C+D) — dossier de méthode & de preuve

> **Autorité du nœud fusionné.** Consolide les dossiers déjà validés **B**
> [`B-premiere-intention.md`](B-premiere-intention.md), **C** [`C-intensification.md`](C-intensification.md),
> **D** [`D-sulfamides-gliptines.md`](D-sulfamides-gliptines.md) et documente les **règles nouvelles** du
> gel P3·S1 ([`prescription.SPEC.md`](prescription.SPEC.md), gelé 2026‑07‑24). Méthode de vérification :
> [`../VALIDATION_COHERENCE.md`](../VALIDATION_COHERENCE.md). **Le socle de preuve EBM (CVOT, switch, hypo,
> désintensification, place résiduelle) n'est PAS re‑dérivé ici : il est importé de B/C/D par référence.**
> Ce document ne détaille que (1) la réconciliation et (2) le sourcing des règles neuves.
>
> **⚠ Addendum S8 (2026‑07‑25) : modèle de saisie changé.** Le champ `position_vs_cible` décrit ci‑dessous
> (§ Frontières) a été **remplacé par le primer `intention`** (initier/intensifier/optimiser/déprescrire),
> qui déduit `cible_atteinte`. `hba1c_sous_cible` est désormais **dérivé de l'HbA1c saisie** (< 6,5 %),
> indépendant du nœud A. Voir [`prescription.SPEC-intentions.md`](prescription.SPEC-intentions.md) (autorité
> à jour du modèle de saisie et des arbitrages §7/§8) — ce document garde son autorité sur la **réconciliation
> du socle de preuve B/C/D**, non re‑dérivée par S8.

## En bref

Un seul nœud outille toute la **prescription non‑insulinique** du DT2 (metformine socle + agents à bénéfice
d'organe iSGLT2/AR GLP‑1, place résiduelle SU/gliptine, tirzépatide en obésité), et **trois gestes qui se
combinent** — *ajouter / switcher / désintensifier* — pilotés par **les traitements en cours** et **la
position de l'HbA1c vs objectif**. La hiérarchie de valeur est celle de B/C : iSGLT2 et AR GLP‑1 ont un
bénéfice d'organe démontré (CVOT vs placebo, critères durs) ; **sulfamides et gliptines n'en ont aucun**
(essais de sécurité CV neutres). La nouveauté de la fusion : un **gating négatif de terrain** (l'outil sait
désormais *ne pas* proposer une incrétine chez le maigre/dénutri, ni un iSGLT2 chez l'infecté urinaire
récidivant) et des **portes explicites** (SU/gliptine/intolérance).

## Frontières entre nœuds

**A** fixe la cible d'HbA1c individualisée (référence pour le praticien, non importée par le moteur — le
chaînage A→prescription reste hors moteur, cf. incertitudes). **Ce nœud** (depuis S8, piloté par le primer
`intention` — voir addendum ci‑dessus) recommande le traitement non‑insulinique **et** l'insuline
*d'initiation* (gate catabolique) ou *oriente* vers l'insuline. **E** ajuste finement les doses d'insuline
(chaînage → E). **F** = statine. **H** = MHD / perte de poids / rémission. Décompensation aiguë ≥ 3 mmol/L =
urgence, hors périmètre.

## 1. Réconciliation B+C+D (importée, non re‑dérivée)

| Bloc | Provenance | Ce qui est repris tel quel |
|---|---|---|
| Ajout iSGLT2 (IC/rénal/ASCVD) | B/C | HR hospit. IC ~0,61‑0,73 ; progression rénale ~0,56‑0,76 ; pas d'effet IDM/AVC ; seuil DFG ≥ 20 |
| Ajout AR GLP‑1 (ASCVD/obésité) | B/C | MACE ~0,87‑0,88 (AVC) ; molécule‑spécifique ; néphro dure = sémaglutide (FLOW) |
| Tirzépatide | B | Non‑infériorité CV au dulaglutide (SURPASS‑CVOT) ; efficacité HbA1c/poids supérieure |
| Metformine socle | B | Reco officielle FR maintenue ; bénéfice dur de preuve faible ; CI DFG < 30 |
| Gate insuline d'initiation | B | Catabolisme (HbA1c ≥ 10 + glucotoxicité, ou cétonémie) ; exclusions iSGLT2 |
| Switch gliptine→GLP‑1, non‑association | C | Nauck 2017 ; ADA §9 / KDIGO PP4.2.3 / HAS R.80 ; tête‑à‑tête PIONEER‑3/SUSTAIN‑2/AWARD‑5 |
| Switch sulfamide | C | Aucun bénéfice d'organe (CAROLINA/TOSCA.IT) ; hypo (NNT 45) ; poids ; durabilité (ADOPT) |
| Désintensification | C | HAS R.102/103/105 ; SFD Avis 5/5bis ; ADA 13.14a‑d ; Grant 2025 ; HYPOAGE ; jamais un agent protecteur |
| Sécurité rénale metformine | C | RCP/ANSM : 3 g ≥ 60 ; 2 g 45‑59 ; 1 g 30‑44 ; CI < 30 |
| Place résiduelle SU/gliptine | D | `classes_a_benefice_indisponibles` ; sitagliptine (seule FR) ; glibenclamide proscrit ; SU CI < 30 ; coût non‑critère FR |

## 2. Règles NOUVELLES (gel P3·S1) — sourcing

> Triangulation exigée ; **sources FR (HAS/SFD/RCP) lues en direct, jamais via OpenEvidence** (VALIDATION_COHERENCE §2).

- **Plancher IMC & dénutrition sur AR GLP‑1 / tirzépatide** (GLP‑1 exclu si IMC < 22 **ou** dénutrition ;
  tirzépatide réservé à l'obésité IMC ≥ 30 ; dénutrition mord même chez l'obèse). *Rationale* : les AR GLP‑1 et
  le tirzépatide induisent une perte de poids et une anorexie ; chez le sujet âgé fragile/dénutri/sarcopénique
  ils aggravent la dénutrition et la sarcopénie (perte de masse maigre). *Sources à consigner en direct* :
  ADA 2026 « Older Adults » (éviter la perte de poids non désirée / prudence incrétine chez le fragile) ;
  SFD 2025 Avis 3/5 (sujet âgé fragile) ; RCP AR GLP‑1 & tirzépatide (perte de poids, prudence dénutrition) ;
  HAS parcours obésité (indication tirzépatide = obésité). **Le seuil IMC 22 est une décision référent**
  (repère pragmatique) ; les sources bornent la *direction*, pas le chiffre exact — à tracer comme tel.
- **iSGLT2 + infections génito‑urinaires récidivantes** (rétrogradation + alerte). *Source* : RCP iSGLT2
  (ANSM) — infections génitales mycosiques et urinaires, gangrène de Fournier ; déjà en prose dans B/C, ici
  **élevé au rang de gate évalué**.
- **Intolérance → réduction OU switch** (réduction de dose comme alternative pour une intolérance non majeure,
  dose = jugement praticien). *Source* : principe de titration/retour à dose tolérée (RCP metformine &
  incrétines) ; SFD Avis 5 bis (déprescription devant effet secondaire invalidant).
- **Intolérance digestive : viser la metformine d'abord** (metformine + incrétine). *Rationale* : metformine
  **et** AR GLP‑1 partagent l'intolérance digestive ; la metformine a le bénéfice dur le plus faible (nœud B).
  **Claim FR CONFIRMÉ** (source fournie par le référent) : l'intolérance/CI à la metformine ouvre la
  **monothérapie AR GLP‑1** remboursée en France — **formulaire d'accompagnement à la prescription Assurance
  Maladie** (dulaglutide/liraglutide), Art. 61 de la convention médicale, **arrêté du 10/01/2025** :
  « en monothérapie, quand l'utilisation de la metformine est considérée comme inappropriée en raison d'une
  intolérance ou de contre‑indications ». *(Consigné comme
  incertitude tant que non vérifié ; l'alerte A5 reste prudente.)*
- **Déprescription pilotée par `hba1c_sous_cible` (< 6,5 %) à tout âge** (gel D1/D2). *Source* : sur‑contrôle
  glycémique sous agent hypoglycémiant = iatrogénie sans bénéfice (ACCORD ; HAS R.105 abstention si écart
  < 0,5 % ; SFD Avis 5). L'exception « classe à bénéfice associé » = garde‑fou ADA 13.14d (ne jamais
  déprescrire iSGLT2/AR GLP‑1), garanti par la liste‑cible d'O13 (SU/glinide/insuline).

## 3. Portes & gating

Voir [`prescription.SPEC.md`](prescription.SPEC.md) §4 (table des portes) et §5 (gating gelé) — non recopié ici.

## Incertitudes

- **Seuils de terrain** (IMC 22 ; obésité 30) = repères pragmatiques (décision référent), la preuve borne la
  direction pas le chiffre.
- **Remboursement FR « intolérance metformine → monothérapie AR GLP‑1 »** : CONFIRMÉ (formulaire Assurance Maladie, arrêté du 10/01/2025). ~~à vérifier sur source FR avant~~
  `valide` (cf. §2).
- Héritées de B/C/D : additivité iSGLT2+AR GLP‑1 sur critère dur (non démontrée, PRECIDENTD) ; bénéfice dur du
  switch lui‑même (indirect) ; désintensification (preuve faible/accord d'experts).

## Sources

Reprises des trois nœuds (dédupliquées à l'encodage S3) ; pour le détail essai‑par‑essai, se reporter aux
`references_primaires` de B/C/D et à leurs argumentaires. Sources FR nouvelles (§2) à annexer après lecture
directe.
