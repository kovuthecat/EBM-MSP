# Nœud B — Traitement de 1re intention piloté par les comorbidités   (dossier de preuve)

- **statut** : **DOSSIER VALIDÉ + ENCODÉ (2026-07-23)** — YAML `content/…/premiere-intention.yaml` +
  argumentaire niveau 3, vérifiés bi-agent (38/38 tests, build OK) ; cf. §7. Base de preuve complète et
  vérifiée — 3 classes (iSGLT2 · AR GLP-1/tirzépatide · metformine) + **gate insuline** + **argumentation
  négative SU/gliptines** + **priorité**, via **bi-agents A/B (7 passes) + 5 rapports OpenEvidence + 2 passes
  de vérification (triangulation)** + curation HAS/Méd. Geek/SFD 2025 + Prescrire (`sources/prescrire-dt2.md`).
  **Tous les arbitrages VALIDÉS référent** ; **`[À VÉRIFIER]` levés** (restes mineurs non décisionnels : grade
  C HAS à sourcer, composite élargi SURPASS). **Prochaine étape = encodage YAML (P2)**.
- **version** : 0.1 · **date** : 2026-07-23 · **auteur** : Opus + référent (Thibault)
- **id YAML cible** : `premiere-intention` · domaine `diabete-type-2`
- **type de nœud** : **MULTI-OPTIONS** (plusieurs recommandations simultanées + champ `priorite`),
  à distinguer du `selection: ordered-first-match` du nœud A. Cf. `DECISIONS.md` D10.

## 0. Nature de ce dossier (garde-fou méthodo)

Suit la pipeline `00-global.md` (Cadrer → Collecter → Apprécier → Vérifier bi-agents → Distiller). Ce
fichier fige les **étapes 1-2 de cadrage** ; les §3-8 (preuves, chiffres, YAML) seront remplis par la
collecte + réconciliation bi-agents, puis validés par le référent. **Aucun NNT/chiffre n'entre au YAML
avant vérification sur source primaire** ; tout élément non confirmé = `[À VÉRIFIER]`.

## 1. Question clinique & critères d'entrée (FIGÉ)

- **PICO** : P = adulte DT2 sous MTMV + metformine (hors DT1/grossesse) ; I = iSGLT2 / AR GLP-1 /
  (AR GIP-GLP-1) / metformine socle ; C = placebo / standard care (le plus souvent) ou entre classes ;
  **O = critères DURS** (mortalité toutes causes et CV, IDM, AVC, hospitalisation pour insuffisance
  cardiaque, progression rénale / IRT) vs substitution (HbA1c, poids). ← **Contraste fort avec le
  nœud A : ici des bénéfices durs existent réellement** (CVOT iSGLT2/GLP-1).

- **Variables d'entrée** (→ `criteres_entree`, cf. `CADRAGE-8-noeuds.md` §B) :
  `ASCVD_etablie` (bool), `insuffisance_cardiaque` (bool), `DFG` (nombre), `albuminurie`
  (normo/micro/macro), `IMC` (nombre), `age` (nombre), `preference_injection`
  (accepte/refuse/indifferent), `contrainte_cout` (bool), `HbA1c_actuelle` (nombre).
  Dérivées : `IRC` (de `DFG`+`albuminurie`), `risque_cv` (élevé/très élevé — mapping SFD Avis n°7, à
  intégrer en collecte).

- **Frontière B / C** *(décision référent #1, 2026-07-23)* : **B = INITIATION de la protection
  cardio-rénale** (choix du/des agent(s) selon comorbidités, indépendamment de l'HbA1c). **C =
  intensification quand la cible glycémique n'est pas atteinte, ET renforcement possible d'une
  protection** en tenant compte des comorbidités + des **traitements protecteurs déjà en place**.
  → Chaînage B→C à noter ; `traitements_en_cours` (multivalué) est central en C, pas en B.

## 2. Options envisagées (esquisse FIGÉE — chiffres, seuils & CI à confirmer par collecte)

Nœud **multi-options** : plusieurs propositions peuvent être recommandées simultanément, avec une
`priorite` par critère dominant (affichage, pas hiérarchie prouvée — décision #4).

**Gate d'initiation — insuline d'emblée** *(SFD 2025 Avis 8 bis · HAS « en l'absence de symptômes
d'hyperglycémie majeure » ; PROPOSÉ, à valider référent)* : **porte de sécurité en tête du nœud** (comme le
périmètre « décompensation aiguë » du nœud A), qui **précède** l'algorithme piloté par comorbidités :

- **Décompensation** — hyperosmolarité **OU** cétose (cétonurie/cétonémie pathologique, peut révéler un
  **DT1**) → **insuline indispensable + hospitalisation**. Sort de l'algorithme standard. ⚠ **iSGLT2 exclus**
  (risque d'acidocétose).
- **HbA1c ≥ 10 % avec catabolisme** (amaigrissement involontaire, cétose) → **insuline** (souvent
  **transitoire**, relais secondaire) + avis endocrino.
- **HbA1c ≥ 10 % symptomatique SANS catabolisme** → l'insuline **n'est PAS obligatoire** : un agent puissant
  **aGLP1 / tirzépatide (± insuline basale)** est de plus en plus **préféré** (ADA 2026, NEJM 2025 ; essai
  **SIMPLE** : aGLP1 + basale **> basal-bolus**, moins d'hypo, perte de poids). ⚠ **éviter iSGLT2 si
  HbA1c > 10 %** (risque d'acidocétose — AACE).
- *(modulation)* **HbA1c ≥ 8,5 %** → bithérapie d'emblée ; **aGLP1/tirzépatide privilégiés si HbA1c > cible
  de 1 %** (plus puissants sur l'HbA1c, SFD).

Niveau de preuve du gate (**vérifié par bi-agents, 2026-07-23** — cf. §3 sous-dossier 4) : versant
*sécurité* (décompensation/cétose) = **accord d'experts ADA Grade E, nécessité clinique** (ECR impossible).
Versant *rémission* (insuline transitoire au diagnostic) = **ECR sur critères intermédiaires seulement, non
durable, peu transposable (cohortes est-asiatiques maigres)** → **option à preuve faible** ; **DiRECT /
perte de poids (nœud H) au moins à parité** pour le phénotype européen. Encodé comme **gate de sécurité**
(affiché reco SFD/HAS), **sans survendre la rémission**. **Nouvelles variables (P2)** :
`symptomes_glucotoxicite` (bool ; déjà prévu pour le nœud E), `decompensation`/`cetose` (bool). Modalités et
relais de l'insuline = **nœud E** (chaînage B→E).

> **Affinement d'encodage (v1.3, référent 2026-07-23)** : l'HbA1c reflétant les ~3 derniers mois **décroche
> en cas de hausse glycémique récente** ; un SPUPD avec **cétonémie positive** justifie l'insuline quel que
> soit l'HbA1c. Gate encodé : `(HbA1c ≥ 10 ET symptomes_glucotoxicite) OU cetonemie`, avec une variable
> **`cetonemie` (bool)**. **Seuil de positivité retenu : β-hydroxybutyrate capillaire ≥ 0,6 mmol/L** (seuil
> d'action bas en contexte hyperglycémique ; ≥ 3 mmol/L → urgence/hospitalisation) — sources : ADA *Diabetes
> Care* 2025 (capillary ketone) ; *Plasma β-OHB for DKA* (PMC7394730). **À confirmer contre le protocole
> local.** iSGLT2/association sont exclus sur `cetonemie` en plus de `symptomes_glucotoxicite` (acidocétose).
> Une **alerte** (D15) invite à contrôler la cétonémie si HbA1c ≥ 10 ou signes de glucotoxicité.

- **Metformine — option `base`** *(décision référent #2, 2026-07-23)* : proposée en 1re intention pour
  **tous** (reco FR maintenue, coût, recul, tolérance, **absence d'hypoglycémie**), en **argumentant
  explicitement** que sa preuve de bénéfice clinique *dur* est **faible/non concluante** (UKPDS 34 =
  sous-groupe ouvert n=342 ; métas vs placebo NS — Boussageon, Griffin). **Ne pas afficher « bénéfice CV
  prouvé »** (réservé iSGLT2/GLP-1). Les autres 1res lignes viennent **en parallèle si le contexte
  clinique les justifie**, pas « contre » la metformine. CI/écart : `DFG < 30` (+ IC décompensée,
  IDM récent, intolérance digestive ~15 %).

  > **Correctif d'encodage (v1.4, 2026-07-23, signalé par un utilisateur)** : la décision référent #2
  > ci-dessus (« proposée en base... les autres 1res lignes viennent en parallèle ») avait été encodée par
  > erreur comme un **repli** (`conditions: ["default"]`) — la metformine **disparaissait entièrement** dès
  > qu'un ajout (ex. iSGLT2) matchait, au lieu d'être montrée EN PARALLÈLE comme prescrit. Corrigé via le
  > nouveau sentinel moteur **`["toujours"]`** (DECISIONS.md D16) : la metformine est désormais **toujours**
  > affichée (rang 0), avec un badge distinct **« Recommandation officielle (France) »** — le badge EBM
  > « Recommandée » reste réservé à la 1re option d'ajout la plus indiquée (iSGLT2 ou AR GLP-1 selon le
  > profil), qui apparaît donc en 2e position. Arbitrage référent explicite sur ce point (position +
  > sémantique des 2 badges).
  >
  > **Adaptation rénale (v1.3, RCP ANSM — Base de données publique des médicaments, METFORMINE, MàJ
  > 14/04/2025)** : metformine **contre-indiquée si DFG < 30** (encodée en `exclusions`) ; **dose maximale
  > 2 g/j à DFG 45–59**, **1 g/j (initiation ≤ 500 mg) à DFG 30–44**, 3 g/j à DFG 60–89 (diminution possible
  > selon dégradation). Doses encodées en **alertes** (D15) conditionnées au DFG, plus une alerte d'**arrêt**
  > si DFG < 30. Attention au seuil : entre **DFG 20 et 30**, l'iSGLT2 reste **proposé** (initiable ≥ 20,
  > KDIGO) — donc **pas** de sortie vide ; le nœud n'a d'option in-scope à épuiser (→ **sortie vide tracée**)
  > qu'à **DFG < 20 sans athérome/obésité** (iSGLT2 alors aussi contre-indiqué ; metformine déjà exclue).

- **iSGLT2** — `insuffisance_cardiaque == true OR IRC (DFG<60 OR albuminurie != normo) OR
  ASCVD_etablie == true`. Bénéfice **insuffisance cardiaque + néphroprotection** — **PAS athérome**
  (IDM/AVC jamais réduits isolément ; cf. §3 lecture transversale). Rationale par déclencheur :
  `insuffisance_cardiaque`/`IRC` → bénéfice HHF/rénal **même sans MCV établie** ; `ASCVD_etablie` →
  bénéfice MACE **modeste, prévention secondaire seulement**. **Seuil DFG d'initiation ≥ 20** (KDIGO
  2024 : initier si DFG≥20 ; ne pas initier <20 ; **poursuivre** si déjà en cours jusqu'à dialyse).
  Effets indésirables : mycoses génitales, déplétion volémique, acidocétose euglycémique rare
  (amputations = signal **canagliflozine/CANVAS** isolé, non effet-classe).

- **AR GLP-1** — `ASCVD_etablie == true OR IMC >= 30` (bénéfice **vasculaire/athéromateux** — au niveau
  classe surtout **AVC** > mort CV > IDM, hétérogène par molécule — + poids). **Quasi nul sur l'HHF**
  (≠ iSGLT2). **Effet-classe des longue-durée** (liraglutide, séma SC/oral, dulaglutide) ; **exclure
  lixisénatide/exénatide** (neutres — D12). Rénal **dur = sémaglutide en IRC** (FLOW) ; sinon albuminurie.
  `preference_injection` module (injectable, sauf séma oral). Position critique Prescrire : bénéfice
  « peut-être », fragilité LEADER, effets indésirables lourds (dont NAION, signal suicidaire).

- **AR GIP/GLP-1 (tirzépatide)** — `ASCVD_etablie == true OR IMC >= 30`. **Remboursé en France depuis
  juillet 2026** *(MAJ référent 2026-07-23)*. Efficacité HbA1c et perte de poids **supérieures** aux
  AR GLP-1 ; IC à FE préservée (SUMMIT). ⚠ **Niveau de preuve CV = non-infériorité au dulaglutide**
  (SURPASS-CVOT, Nicholls NEJM 2025), **pas** de CVOT placebo dédié → à pondérer vs iSGLT2/AR GLP-1
  (règle granularité EBM). Placement final (option distincte vs axe GLP-1) tranché à la distillation.

- **iSGLT2 + AR GLP-1** — si plusieurs indications fortes (preuve d'association plus **faible**, cohorte).

- **`priorite` iSGLT2 vs AR GLP-1** *(décision #4)* : **affichage + priorité par critère dominant**
  (IC/rénal → iSGLT2 ; athérome/obésité → AR GLP-1), **pas** une hiérarchie prouvée — peu/pas d'essais
  tête-à-tête. À reconfirmer après collecte selon ce que l'EBM directe permet.

**Arbitrages de périmètre — TRANCHÉS (référent, 2026-07-23)** :
- **tirzépatide** : **inclus** dans B (remboursé FR juillet 2026), avec pondération du niveau de preuve
  (non-infériorité, cf. option ci-dessus).
- **iDPP4** : **renvoi au nœud D** (place résiduelle). Décision **fondée EBM** (pas seulement reco) :
  les gliptines n'ont **aucun bénéfice d'organe** (SAVOR / TECOS / EXAMINE / CARMELINA toutes
  CV-neutres ; signal ↑hospitalisations IC saxagliptine — SAVOR). B étant piloté par la protection,
  elles n'y sont **pas un driver** → simple **note « CV-neutre »** en B. Pas de collecte des CVOT DPP4
  dans ce dossier.

## Sources en main & plan de collecte (2026-07-23)

**Reco officielle (colonne « reco »)** :
- **SFD 2025** — « Prise de position sur les stratégies d'utilisation des traitements de
  l'hyperglycémie dans le DT2 », *Med Mal Metab* 2025;19:630-662 (DOI 10.1016/j.mmm.2025.10.002).
  Avis n°1 (stratégie), n°6/6bis + **Tableau III** (bénéfice CV/IC/rénal par molécule), n°7 (risque CV),
  n°11-15 (iSGLT2 / GLP-1 / GIP-GLP-1). PDF fourni par le référent (usage interne).
- **HAS 2024** — RBP « Stratégie thérapeutique du patient vivant avec un DT2 ».
- Compléments : ADA/EASD 2022, CMG.

**Position critique (colonne « critique »)** — Prescrire (RÉSUMÉ + lien uniquement, droit d'auteur) :
- **Prescrire 5** (Rev Prescrire juin 2026, 46(512):429) — « Liraglutide : une option chez certains
  patients diabétiques » (mortalité CV « peut-être » ; fragilité LEADER ; effets indésirables).
- **Prescrire 6** (juin 2026, 46(512):455) — « Tirzépatide et DT2 : pas plus efficace que le
  dulaglutide » (SURPASS-CVOT, Nicholls NEJM 2025). Table noms commerciaux FR.
- **Prescrire 7** (Rev Prescrire août 2023, 43(478):597) — « Alternative à la metformine : pas
  d'évaluation clinique probante » (metformine 1re ligne ; écarter si DFG<30/IC/IDM récent).
- **Prescrire 8** (juin 2025, 45(500):455) — « Diabète et atteinte rénale : mortalité moindre avec le
  sémaglutide » (FLOW, Perkovic NEJM 2024 ; IEC/sartan 1er choix).
- **Prescrire 1-3 ajoutés (2026-07-23)** : P1 « Diabète de type 2 chez un adulte » (Premiers Choix févr.
  2026) · P2 « Prévenir/retarder le DT2 » (2006, → nœud H) · **P3 « Quand la metformine ne suffit pas »**
  (Stratégies août 2023 — **article central nœud B**, Tableaux 1-2).
- **→ Tous les articles Prescrire sont archivés (synthèse critique + réfs + citations) dans
  [`sources/prescrire-dt2.md`](../sources/prescrire-dt2.md)** — réutilisable pour les nœuds C/D/E/F/H
  (évite la ré-extraction des PDF scannés).

**Découpage de la collecte** *(décision référent #3)* — 3 sous-dossiers de classe → matrice consolidée
`classe × critère dur × essai × effet absolu/NNT × population (prév. 1re/2de) × GRADE` :
1. **iSGLT2** — EMPA-REG OUTCOME, CANVAS, DECLARE-TIMI 58 (CV) ; CREDENCE, DAPA-CKD, EMPA-KIDNEY (rénal) ;
   DAPA-HF, EMPEROR-Reduced/Preserved (IC).
2. **AR GLP-1** — LEADER, SUSTAIN-6, REWIND, PIONEER-6 (± FLOW rénal, SURPASS-CVOT pour tirzépatide).
3. **metformine** — UKPDS 34 (sous-groupe surpoids ; preuve faible/legacy, à traiter de façon critique).

*OpenEvidence / web = débroussaillage, jamais source primaire.*

## 3. Base de preuves (grille par étude clé)

### SOUS-DOSSIER 1 — iSGLT2 (consolidé 2026-07-23 : 4 sources)

**Garde-fou** : matrice bâtie sur les **publications primaires** (PMID vérifiés par Agent A) et croisée
Agent B (red-team) × OpenEvidence (débroussaillage référent) × curation reco. **2 PMID erronés
interceptés** (CANVAS → 28605608 ; EMPA-REG → 26378978). **Discordance résolue** : mortalité toutes
causes **CREDENCE = 0,83 [0,68–1,02]** (et non 0,87, source secondaire). NNT non publiés = « ~approx. » ;
tout non confirmé = `[À VÉRIFIER]`.

| Essai (molécule, PMID) | Population | Mort. tot. | Mort CV | MACE-3 | IDM | AVC | Hosp. IC | Rénal comp. | NNT (horizon) | GRADE |
|---|---|---|---|---|---|---|---|---|---|---|
| **EMPA-REG** (empa, 26378978) | ~100 % prév. 2de | **0,68** [0,57–0,82] | **0,62** [0,49–0,77] | 0,86 [0,74–0,99] | 0,87 ns | 1,24 ns | 0,65 [0,50–0,85] | 0,61 [0,53–0,70] | ~38 mortalité/3,1a | Modéré |
| **CANVAS** (cana, 28605608) | 66 % 2de/34 % 1re | 0,87 ns | 0,87 ns | **0,86** [0,75–0,97] | 0,85 ns | 0,90 ns | 0,67 [0,52–0,87] | 0,60 [0,47–0,77] expl. | ~60 approx. | Modéré-faible |
| **DECLARE** (dapa, 30415602) | 41 % 2de/**59 % 1re** | 0,93 ns | 0,98 ns | **0,93 [0,84–1,03] NS** | 0,89 ns | 1,01 ns | 0,73 [0,61–0,88] | 0,76 [0,67–0,87] | ~111 (CVd/HHF)/4,2a | Élevé (absence effet MACE) |
| **CREDENCE** (cana, 30990260) | 100 % DT2 + macroalb. | 0,83 [0,68–1,02] ns | 0,78 [0,61–1,00] | 0,80 [0,67–0,95] | 0,81 ns | 0,80 ns | 0,61 [0,47–0,80] | **0,70** [0,59–0,82] | ~23 approx./2,6a | Élevé |
| **DAPA-CKD** (dapa, 32970396) | 67 % DT2, UACR 200-5000 | **0,69** [0,53–0,88] | 0,81 ns | — | — | — | 0,71 [0,55–0,92] | **0,61** [0,51–0,72] | **19 [15–27]/2,4a (publié)** | Élevé |
| **EMPA-KIDNEY** (empa, 36331190) | 46 % DT2, **DFG 20–90** | 0,87 ns | 0,84 ns | 0,93 ns expl. | — | — | 0,84 ns | **0,72** [0,64–0,82] | ~26 approx./2,0a | Modéré |
| **DAPA-HF** (dapa, 31535829) | 42 % DT2, FEVG≤40 % | **0,83** [0,71–0,97] | **0,82** [0,69–0,98] | — | — | — | 0,70 [0,59–0,83] | 0,71 ns | ~21/18 mois | Élevé / Modéré (mortalité) |
| **EMPEROR-Red** (empa, 32865377) | 50 % DT2, FEVG≤40 % | 0,92 ns | 0,92 ns | — | — | — | 0,69 [0,59–0,81] | ~0,50 [0,33–0,79] | ~19 approx./16 mois | Élevé / Faible (mortalité) |
| **EMPEROR-Pres** (empa, 34449189) | 49 % DT2, FEVG>40 % | **1,00** [0,87–1,15] | 0,91 ns | — | — | — | 0,71 [0,60–0,83] | 0,95 ns | ~30 approx./26 mois | Élevé / **Très faible (mortalité)** |

*Composite principal des 3 essais IC : 0,74 (DAPA-HF) · 0,75 (EMPEROR-Red) · 0,79 (EMPEROR-Pres).*

**Lecture transversale** (concordante A × B × OpenEvidence, vérifiée sur sources primaires) :

1. **Bénéfice = insuffisance cardiaque + néphroprotection, PAS athérothrombose.** IDM et AVC **jamais**
   réduits isolément dans les 3 CVOT (IC95 % chevauchent 1 ; AVC non réduit — EMPA-REG non fatal 1,24 [0,92–1,67], total 1,18, NS). HHF
   réduite dans **les 9 essais** (0,61–0,73) ; rénal partout (0,56–0,76). → les iSGLT2 ne sont **pas**
   des agents anti-athérothrombose (contrairement aux statines/antiagrégants) : agents anti-décompensation
   cardiaque + néphroprotecteurs (mécanisme hémodynamique/natriurétique probable).
2. **Prévention primaire à bas risque : pas de bénéfice MACE prouvé** (DECLARE sous-groupe MRF sans MCV :
   HR 1,01 [0,86–1,20]). MAIS bénéfice **IC + rénal indépendant du statut athérothrombotique** (HR
   ~identiques diabétiques/non-diabétiques : DAPA-CKD, EMPA-KIDNEY, DAPA-HF, EMPEROR). → un patient à bas
   risque athéro **mais avec IC ou MRC** garde le bénéfice sur ces critères.
3. **Seuil DFG d'initiation ≥ 20 mL/min** (EMPA-KIDNEY/EMPEROR les plus permissifs ; **KDIGO 2024** :
   initier ≥20, ne pas initier <20, **poursuivre jusqu'à dialyse** si déjà en cours). Découplage clé :
   l'effet glycémique s'atténue <45, l'effet cardio-rénal persiste bien plus bas → justifie l'indication
   cardio-rénale **indépendamment de la glycémie**.

**Effets absolus / NNT & risques** (OpenEvidence + méta-analyses, à confirmer sur source primaire) :
NNT rénaux 19–43 (2–2,5 ans) ; NNT IC 19–31 (16–26 mois), poolé IC 8–10/3 ans. Risques : ~2 acidocétoses
+ ~36 infections génitales /1000/3,5 ans. **Amputations = signal CANVAS seul** (1,97), non répliqué
(CREDENCE/DECLARE) → propre à la canagliflozine/design CANVAS, pas effet-classe.

### SOUS-DOSSIER 2 — AR GLP-1 + tirzépatide (consolidé 2026-07-23 : 4 sources)

**Garde-fou** : extraction (A2) **confirme intégralement** le débroussaillage OpenEvidence + red-team (B2) ;
DOI vérifiés (NEJM/Lancet bloquent le fetch direct → tableaux repris de sources secondaires fiables, PMID
cités). `[À VÉRIFIER]` maintenus où le texte intégral manque.

| Essai (molécule) | Population | MACE-3 | **Composante motrice** | Mort. tot. | Rénal | NNT | Note |
|---|---|---|---|---|---|---|---|
| **LEADER** (liraglutide) | 81 % MCV établie | 0,87 [0,78–0,97] | **mort CV 0,78** (IDM/AVC NS) | 0,85 [0,74–0,97] | albuminurie (comp. 0,78) | ~53/3,8a | mono non évaluée |
| **SUSTAIN-6** (séma SC) | ~83 % haut risque | 0,74 [0,58–0,95] | **AVC 0,61** (mort CV/IDM NS) | 1,05 NS | albuminurie 0,64 | ~43 | NI ; ⚠ **rétinopathie 1,76** |
| **REWIND** (dulaglutide) | **31 % MCV / 69 % prév. 1re** | 0,88 [0,79–0,99] | **AVC 0,76** | 0,90 NS (limite) | albuminurie 0,77 | ~18 (MCV) / ~60-70 (prév.1re) | suivi le + long (5,4a) |
| **PIONEER-6** (séma oral) | 85 % | 0,79 [0,57–1,11] **NS** | — (non-infériorité seule) | 0,51 exploratoire | — | — | sous-dimensionné |
| **SOUL** (séma oral) | 100 % ASCVD/IRC | 0,86 [0,77–0,96] | **IDM 0,74** (exception classe) | 0,91 [0,80–1,02] NS | composite 5-pts **NS** ; HHF 0,90 NS | ~50 | supériorité atteinte |
| **FLOW** (séma SC, rénal) | DT2 + **IRC** | rénal **0,76** (dur) | rénal + mort CV 0,71 | **0,80** [0,67–0,95] | **0,76 DUR (critère principal)** | ~22 rénal | arrêt précoce ; pop. IRC |
| **SURPASS-CVOT** (tirzépatide vs **dulaglutide**) | 100 % ASCVD | 0,92 [0,83–1,01] **NI, PAS supériorité (p=0,09)** | — | 0,84 [0,75–0,94] (2ndaire, gatekeeping) | rénal primaire **0,77 [0,68–0,88]** (Zoungas 2026) ; composite élargi 0,88 `[À VÉRIFIER]` | — | **comparateur actif, pas placebo** |

**Lecture transversale** :

1. **Bénéfice vasculaire/athéromateux, mais HÉTÉROGÈNE par composante** : AVC (SUSTAIN-6, REWIND), mort CV
   (LEADER), IDM (SOUL) — **jamais les 3 ensemble**. Au niveau classe (Sattar *Lancet D&E* 2021) : **AVC
   −17 % > mort CV −13 % > IDM −10 %**. **Complémentaire aux iSGLT2** : les GLP-1 sont quasi **nuls sur
   l'HHF** (LEADER/SUSTAIN-6/REWIND NS), sauf FLOW (population IRC). Mécanisme anti-athérogène (≠
   hémodynamique des iSGLT2).
2. **Rénal dur = seulement FLOW** (sémaglutide, population IRC ± sévère) ; LEADER/REWIND = **albuminurie**
   (substitution). → pour la **néphroprotection dure**, l'iSGLT2 reste la référence ; le **sémaglutide**
   est l'option rénale dure **en IRC** (FLOW), non extrapolable au DT2 sans IRC avancée.
3. **Effet-classe NON uniforme (D12)** : **lixisénatide (ELIXA) neutre**, **exénatide LP (EXSCEL) non
   supérieur** → **exclus** des allégations de bénéfice CV. Bénéfice prouvé = liraglutide, séma SC/oral,
   dulaglutide (+ tirzépatide via non-infériorité). → recommandation « AR GLP-1 » **au niveau classe pour
   le versant vasculaire** (effet-classe des longue-durée), en **nommant la molécule** quand la
   composante compte (ex. rénal dur = sémaglutide).
4. **Tirzépatide** : bénéfice CV **par non-infériorité au dulaglutide seulement** (pas de CVOT placebo) ;
   atout propre = **HbA1c + poids supérieurs** ; mortalité 0,84 = critère secondaire (hiérarchie de test
   compromise par l'échec de supériorité du principal).
5. **Prévention 1re vs 2de** : REWIND montre un bénéfice relatif **même en prévention primaire** (69 % de
   la cohorte), mais l'ampleur **absolue** y est faible (NNT ~60-70) vs prévention secondaire (NNT ~18).

**Effets indésirables (à restituer honnêtement, position Prescrire)** : digestifs très fréquents,
lithiases biliaires/cholécystites, pancréatite aiguë rare, **cancers thyroïde/pancréas non tranchés**
(signal, ni rassurer ni alarmer), **idées/gestes suicidaires** (revue EMA en cours, non conclu), **NAION**
avec sémaglutide (EMA : très rare confirmé), aggravation rétinopathie si baisse rapide d'HbA1c (SUSTAIN-6
HR 1,76).

**Note GRADE (méthodo)** : le niveau GRADE par essai **n'est pas** dans les publications princeps (c'est un
jugement de recommandation) → à assigner depuis SFD/HAS/ADA au moment de l'encodage, pas depuis les essais.

### SOUS-DOSSIER 3 — metformine (consolidé 2026-07-23 : vérification EBM)

**Question centrale — existe-t-il une preuve de haut niveau (ECR vs placebo) que la metformine réduit des
critères DURS en 1re ligne ? → NON.**

| Source | Type | Résultat dur | Lecture critique |
|---|---|---|---|
| **UKPDS 34** (Lancet 1998, PMID 9742977) | ECR **ouvert**, sous-groupe obèses **n=342** | Mortalité RRR **36 %**, IDM **39 %** ; AVC NS | Sous-groupe unique, non aveugle, tests multiples — signal isolé |
| **UKPDS 80** (NEJM 2008) | Legacy 10 ans **post-essai** | Mortalité 27 %, IDM 33 % | **Observationnel** (post-randomisation) |
| **UKPDS 91** (Lancet 2024) | Monitoring 24 ans | Mortalité RRR **20 % (ARR 4,9 %)**, IDM RRR **31 % (ARR 6,2 %)** ; micro non maintenu, AVC NS | Même sous-groupe de 342 ; observationnel |
| **Griffin 2017** (Diabetologia) | **Méta vs placebo/diète** (13 ECR) | Mortalité 0,96 · mort CV 0,97 · IDM 0,89 · **AVC 1,04** — **TOUS NS** | UKPDS = **52-70 %** du poids ; aucun essai à faible risque de biais |
| **Boussageon 2012** (PLoS Med, 13 110 pts) | Méta 13 ECR | Mortalité 0,99 · mort CV 1,05 · IDM 0,90 · AVC 0,76 — **TOUS NS** | **Hors UKPDS : effet disparaît + hétérogénéité disparaît** |
| **DPP/DPPOS 2022** (Circulation, prédiabète 21 ans) | ECR vs placebo | **MACE 1,03 (0,78–1,37) NS** | Pas de bénéfice CV malgré prévention du diabète |
| **Monami 2021** (métas comparateurs actifs) | Méta | MACE **0,52** (2 ECR : UKPDS + SPREAD *vs glipizide*) ; mortalité 0,80 **NS** | « Bénéfice » possible = **nocivité du comparateur sulfamide** |
| **HOME 2009** · **SPREAD 2013** | ECR add-on / vs glipizide | HOME : **principal NS (0,92)** ; SPREAD : MACE 0,54 *vs sulfamide* | Outcome-switching (HOME) ; comparateur actif (SPREAD) |
| **VA-IMPACT** (NCT02915198) | ECR vs placebo, **prédiabète + MCV** | En cours (≈2029) | Seul contexte où l'équipoise existe |

**Lecture transversale** :

1. **Un seul sous-groupe ECR ouvert (UKPDS 34, n=342), non répliqué** ; toutes les métas **vs placebo**
   (Griffin, Boussageon) sont **NS**, et l'effet **disparaît** quand on retire UKPDS.
2. Le **« legacy » UKPDS 80/91** = **observationnel post-essai** sur ce même sous-groupe → n'augmente
   **pas** le niveau de preuve de la randomisation.
3. En **prédiabète** (DPPOS, 21 ans) : **aucun bénéfice CV**.
4. Les métas « favorables » reposent sur des **comparateurs actifs** (sulfamide) → biais du comparateur.
5. **Un CVOT metformine vs placebo est éthiquement impossible dans le DT2** (standard of care → rupture
   d'équipoise) ; UKPDS 34 est un essai historique irreproductible.

**Verdict — niveau de preuve du bénéfice DUR = FAIBLE / non concluant.** → **Ne pas afficher metformine
comme « bénéfice cardiovasculaire prouvé »** (label réservé iSGLT2/GLP-1 en prévention 2de, appuyés sur
CVOT vs placebo). La **1re intention se justifie par tolérance / absence d'hypoglycémie / neutralité
pondérale / coût / recul** — pas par une réduction d'événements durs. → **conforte le cadrage #2**
(metformine base, argumentée, non dogmatique).

**⚠ Correction (red-team)** : le titre Prescrire « pas d'évaluation clinique probante » (Prescrire 7, août
2023) vise les **alternatives** à la metformine, pas la metformine elle-même. Position Prescrire réelle :
metformine = référence **par défaut** (tolérance, coût, recul), **pas** par supériorité prouvée sur
critères durs. Ne pas sur-citer.

### SOUS-DOSSIER 4 — insuline en 1re intention (consolidé 2026-07-23 : bi-agents ; OpenEvidence à intégrer)

Deux questions distinctes (la question du référent).

**(A) Insulinothérapie intensive initiale TRANSITOIRE (SIIT) au diagnostic** (visée rémission / fonction β) :

| Étude | Design | Population | Résultat | Critère dur ? |
|---|---|---|---|---|
| **Weng 2008** (Lancet, PMID 18502299) | ECR n=382, Chine | DT2 nouv. dx | Rémission 1 an : CSII **51 %** / MDI 45 % / OAD **27 %** | **Non** |
| **Kramer 2013** (méta, Lancet D&E) | 7 études (**2 ECR**) n=839 | DT2 précoce, asiat. | Rémission **66→59→46→42 %** (3→24 mois) — décroissante | **Non** |
| **Chon 2018** (ECR Corée n=97) | IIT vs bithérapie orale | naïfs | **−52 %** risque d'échec de rémission | **Non** |
| **RESET-IT 2021** (ECR Canada n=108) | cures répétées vs metformine | HbA1c 6,6 % | **NÉGATIF** : cures répétées n'ajoutent rien | **Non** |
| **Harrison/Lingvay 2014** (ECR USA n=58, **6 ans**) | insuline vs trithérapie orale ; **non-asiat.**, HbA1c 10,8 % | fonction β **stable identique** ; insuline **NON supérieure** | **Non** |
| **Liu 2024** (BMJ, ECR n=412) | SIIT puis 4 stratégies ; hyperglycémie sévère (HbA1c 11 %) | bras **mode de vie seul : 60 %** HbA1c<7 % à 48 sem | **Non** |
| **LIBRA 2014 / Shi 2017** | GLP-1 add-on post-SIIT | bénéfice **perdu à l'arrêt** | **Non** |

**Verdict (A)** : ECR de qualité modérée **mais critères intermédiaires uniquement** (rémission, HOMA-B) —
**aucun critère dur**. **Rémission non durable** (42 % à 2 ans, pente descendante) ; **RESET-IT négatif** ;
**Harrison 2014 : insuline non supérieure au contrôle oral intensif** → déterminant = **intensité/précocité
du contrôle, pas l'insuline en soi**. **Validité externe faible** (cohortes est-asiatiques maigres, IMC ~25).
**Aucune comparaison vs aGLP1/iSGLT2 d'emblée**. → **option à preuve faible**, pas une reco forte. **DiRECT**
(perte de poids, population européenne, ~46 %/36 % rémission à 1/2 ans **sans insuline ni hypo**) = voie de
rémission **mieux validée** pour le phénotype MSP → **nœud H, au moins à parité**.

**(B) Insuline en hyperglycémie sévère symptomatique / cétose au diagnostic** : **aucun ECR** ne randomise
« insuline vs alternative » en phase aiguë (Chen 2008, Liu 2024 : insuline donnée **universellement** ; seule
l'entretien est randomisé). → **accord d'experts ADA Grade E** (insuline si glycémie ≥300 mg/dL OU HbA1c
>10 % OU cétose/symptômes cataboliques), **nécessité clinique** (glucotoxicité, risque acidocétose), **pas
de l'EBM comparative**. iSGLT2 **contre-indiqué** (acidocétose).

→ **Conséquence pour le gate (§2)** : le gate reste une **porte de sécurité** (décompensation/cétose = Grade
E, nécessité) ; le versant « insuline pour rémission » = **option faible**, à ne pas survendre — DiRECT
(nœud H) devant pour le phénotype européen.

### SOUS-DOSSIER 3 — metformine : à consolider (bi-agents à lancer)

## 4. Synthèse critique (reco officielle vs position raisonnée)

### iSGLT2

- **Reco officielle** : **SFD 2025** (Avis 1) + **HAS 2024 grade A** → iSGLT2 en cas de **MCV établie,
  insuffisance cardiaque, maladie rénale chronique**, *indépendamment de l'HbA1c*. La HAS raisonne **par
  classe**, sans nommer de molécule ni fixer de seuil DFG (seuils uniquement dans l'avis produit Forxiga :
  DFG 25-75, RAC ≥200). Reco « pousse » l'iSGLT2 comme **protection cardiovasculaire et rénale**.
- **Position raisonnée / critique** (Prescrire, Médicalement Geek + lecture EBM des essais) : bénéfice
  **réel mais borné** — insuffisance cardiaque + néphroprotection, **pas athérome** ; mortalité surtout
  démontrée pour l'**empagliflozine en prévention secondaire** ; **en prévention primaire sans IC ni MRC,
  bénéfice dur faible/nul** → ne pas sur-recommander chez le patient à bas risque. Médicalement Geek
  approuve l'usage en comorbidité mais critique le raccourci « protection CV » global.
- **Divergence** : **FAIBLE sur le principe** (cibler IC/MRC/MCV établie = consensus reco ↔ critique),
  **MODÉRÉE sur le discours** — le mot « cardiovasculaire » de la reco recouvre surtout de l'**IC et du
  rénal**, pas de l'athérothrombose. L'outil doit préciser *quel* bénéfice, par déclencheur.

### AR GLP-1 / tirzépatide

- **Reco officielle** : SFD 2025 + HAS 2024 **grade A** en cas de **MCV établie** ; **obésité (IMC≥30)**
  → AR GLP-1 ou tirzépatide (grade C HAS). Bénéfice reconnu **molécule-spécifique** (SFD nomme
  liraglutide/dulaglutide/sémaglutide).
- **Position critique** (Prescrire) : bénéfice CV « **peut-être** », **fragilité de LEADER** (porté par la
  seule mort CV ; IDM/AVC NS) ; effets indésirables **lourds** (digestifs, lithiases, NAION, signal
  suicidaire, cancers thyroïde/pancréas non tranchés). **Tirzépatide non supérieur au dulaglutide**
  (SURPASS-CVOT). En prévention primaire, bénéfice absolu **modeste**.
- **Divergence** : **FAIBLE sur le ciblage** (MCV/obésité = consensus) ; **MODÉRÉE** sur l'enthousiasme et
  la balance bénéfice/effets indésirables — l'outil doit afficher le versant risque.

### metformine

- **Reco officielle** : HAS 2024 (grade **C**) + SFD → **1re intention** (« sécurité CV démontrée et
  possible bénéfice »), coût, recul.
- **Position critique** : **Prescrire** (P1/P3) — metformine « **semble** prévenir certaines complications
  et diminuer la mortalité », mais sur **preuves fragiles** (pas « aucun bénéfice », nuance) ;
  **Boussageon/Griffin** — métas vs placebo **NS** ; **Médicalement Geek** — grade C « malgré l'absence de
  bénéfice clinique » démontré.
- **Divergence : FAIBLE** — tous convergent : metformine base **par défaut** (tolérance, coût, recul,
  absence d'hypo), **pas** « bénéfice CV prouvé ». À encoder ainsi (conforte cadrage #2).

### Argumentation NÉGATIVE — pourquoi PAS de sulfamides / gliptines en 1re intention *(consolidé 2026-07-23 : bi-agents + OpenEvidence, A × B × OE concordants)*

Justifier les **absences** (directive référent), **EBM-honnête** (spin corrigé **dans les deux sens**).

**Fait structurant — distinction sémantique SFD** (Tableau III) : iSGLT2/GLP-1 = « **bénéfices démontrés** »
(supériorité, critère dur) ; metformine/SU/iDPP4 = « **sécurité démontrée** » (non-infériorité, **pas de
bénéfice d'organe**). C'est ce qui **relègue** SU/gliptines derrière — pas une nocivité.

**Gliptines (iDPP4)** :
- **Aucun bénéfice d'organe** : 5 CVOT (SAVOR, TECOS, EXAMINE, CARMELINA, CAROLINA) tous en
  **non-infériorité**, MACE neutre (HR ~0,96–1,02) ; **rénal neutre** (CARMELINA 1,04).
- **Signal IC = saxagliptine** (SAVOR HR 1,27 ; ± alogliptine post-hoc) ; **sitagliptine (TECOS 1,00) et
  linagliptine (CARMELINA 0,90) neutres**. Méta de classe **borderline** (+13–19 %) — non tranché (classe
  modeste vs saxa + bruit). → **NE PAS écrire « les gliptines majorent l'IC »** ; écrire « la
  **saxagliptine** majore l'HHF » (D12).
- **Argument = coût d'opportunité** (« pourquoi un agent **sans bénéfice** quand iSGLT2/GLP-1 en ont un »),
  **pas** dangerosité. Poids-neutre, faible hypo, bien tolérées.

**Sulfamides (SU)** :
- **Aucun bénéfice CV/rénal propre** (UKPDS 33 IDM **p=0,052** ; ADVANCE macro neutre — bénéfice rénal via
  la **cible glycémique**, pas le médicament).
- **Iatrogénie quantifiée** : hypoglycémie sévère (CAROLINA **0,45 vs 0,07/100 p-a**, HR 0,15 ; GRADE
  2,2 % ; cumul 17,9 %), **prise de poids ~+1,5 kg**, **durabilité médiocre** (GRADE pire composite ; ADOPT
  échec 34 % à 5 ans).
- **« Surmortalité » = CONTESTÉE (ECR neutre, observationnel défavorable)** : ECR **CAROLINA neutre**
  (glimépiride) + méta ECR Rados 2016 OR 1,12 (0,96–1,30) **NS** ; MAIS **observationnel défavorable et
  chiffré** (Roumie 2012 composite CV **HR 1,21** ; JAHA 2017 **décès CV 1,76**), concentré sur le
  **glibenclamide** (KATP haute affinité → abolit le préconditionnement ischémique) — confusion par
  indication probable. → **NE PAS écrire « les SU tuent »** (ECR neutre) ni « totalement sûrs »
  (observationnel défavorable) ; écrire « pas de bénéfice + iatrogénie + **innocuité CV incertaine** ».
- **Hiérarchie molécule** (Simpson 2015) : **glibenclamide le pire**, **gliclazide le meilleur**, glimépiride
  intermédiaire.

**Place résiduelle légitime (→ nœud D)** : **sitagliptine** = alternative orale sûre si iSGLT2/GLP-1 non
souhaitables ; **SU gliclazide/glimépiride** (jamais **glibenclamide**) si contrainte de coût, sous ASG +
éducation au risque hypoglycémique.

**Position critique Prescrire (plus dure que SFD/HAS — à afficher À CÔTÉ de la place résiduelle)** : gliptines
**et** pioglitazone = « **plus dangereuses qu'utiles, à écarter des soins quelle que soit la situation** »
(P3), au motif du profil d'effets indésirables (Stevens-Johnson, pancréatites, obstructions ; IC
saxa/alogliptine). **Désaccord reco↔critique à signaler** : la SFD garde la sitagliptine en option (place
résiduelle), **Prescrire l'écarte**.

**Pièges bannis (voix de l'outil)** : ✗ « les gliptines → IC » (c'est la saxa) ✗ « les SU → surmortalité »
(ECR neutre) ✗ affirmer « gliptines inutiles » comme un fait (l'écartement est une **position Prescrire**
attribuée, pas un fait EBM).

## 5. Vérification bi-agents (réconciliation Opus, 2026-07-23)

**Dispositif** (par sous-dossier) : Agent A (extraction, Sonnet) + Agent B (red-team, Opus), **contextes
séparés** ; + débroussaillage **OpenEvidence** (fourni par le référent) ; + curation reco **HAS /
Médicalement Geek**. Ancrage : accord des agents ≠ vérité → vérification sur article primaire.

### iSGLT2

### 5a. Consensus vérifié (A + B + OpenEvidence concordent + sources primaires)

- Bénéfice **IC + rénal, pas athérome** (IDM/AVC non réduits) — triple concordance.
- **MACE significatif en prévention secondaire seulement** ; **DECLARE MACE NS** (0,93).
- **HHF + néphroprotection robustes et cohérents** sur les 9 essais.
- **Amputations = signal CANVAS isolé** (canagliflozine), non effet-classe.
- Seuil d'initiation **DFG ≥ 20** (KDIGO 2024).

### 5b. Divergences escaladées (référent)

- **Effet-classe — RÉSOLU (référent, 2026-07-23 → règle transverse `DECISIONS.md` D12)** : OpenEvidence
  conclut « effet de classe » cardio-rénal (SMART-C I²=0 ; Shin *JAMA IM* 2025) ; extraction + red-team
  montrent que la **mortalité isolée n'est significative que dans EMPA-REG, DAPA-CKD, DAPA-HF** (NS
  ailleurs ; EMPEROR-Preserved 1,00) et que **VERTIS CV (ertugliflozine) est neutre**. **Résolution
  validée** : HHF + néphroprotection = **effet-classe** → recommandation au niveau **classe** « iSGLT2 » ;
  mortalité/MACE = **démontré molécule par molécule (empagliflozine ++)** → si mis en avant, **nommer la
  molécule**, sans généraliser. (Grain de recommandation piloté par l'EBM disponible — D12.)
- **EMPEROR-Preserved** : ne **jamais** présenter comme bénéfice de mortalité (HR 1,00) ni rénal (0,95 NS)
  — bénéfice = hospitalisation pour IC uniquement.

### 5c. Non-vérifiable en ligne → `[À VÉRIFIER]`

**RÉSOLU (triangulation OpenEvidence × agent V1 [lecture directe des primaires] × Prescrire, 2026-07-23)**
— ⚠ **V1 corrige 3 erreurs de l'OpenEvidence** (leçon : trianguler, ne pas se fier à une seule source) :
- **EMPA-REG** : **100 % MCV établie**, **74 % metformine** ; AVC — **les DEUX valeurs sont réelles** :
  **non fatal 1,24 [0,92–1,67]** et total (fatal + non fatal) **1,18 [0,89–1,56]** (V1 a lu la Table 1 NEJM ;
  l'OE affirmait à tort que 1,24 « n'y était pas »). IDM non fatal 0,87.
- **VERTIS CV** (Cannon NEJM 2020, 10.1056/NEJMoa2004967, lu en primaire) : MACE **0,97 [0,85–1,11]**,
  mortalité **0,93**, mort CV **0,92**, IDM/AVC ~1,0 = **neutres** ; **HHF 0,70 [0,54–0,90]** réduite (hors
  hiérarchie). → **double validation** : anti-effet-classe (MACE/mortalité) **ET** effet-classe HHF.
- **SURPASS** : MACE 0,92 (NI, non supérieur) ; mortalité 0,84 ; **rénal primaire 0,77 [0,68–0,88]** (Zoungas
  *Lancet D&E* 2026, publié à part). ⚠ **Composite élargi « 0,88 » : OE et V1 DIVERGENT** (OE : rénal-4
  [0,78–0,99] ; V1 : CV élargi MACE+revasc [0,81–0,96]) → **`[À VÉRIFIER]` plein-texte NEJM**, **non
  décisionnel**. **SOUL** : mortalité **0,91 [0,80–1,02]**, HHF composite **0,90**, IDM 0,74 — NS,
  exploratoires (hiérarchie arrêtée au rénal NS).
- **NNT iSGLT2 — PUBLIÉS** (V1, lecture directe ; l'OE se trompait en disant « aucun ») : **CREDENCE 22
  [15-38]**, **DAPA-CKD 19 [15-27]**, **EMPEROR-Reduced 19 [13-37]**, **EMPEROR-Preserved 31 [20-69]** ; les
  CVOT-MACE (EMPA-REG/CANVAS/DECLARE) rapportent l'ARR, sans NNT.
- Références datées 2026 (ADA/JACC 2026, SURPASS, SOUL) **vérifiées réelles** (DOI/PMID confirmés).

### AR GLP-1 / tirzépatide

**Consensus vérifié (A2 + B2 + OpenEvidence)** : l'extraction confirme **intégralement** le débroussaillage
(aucune valeur inventée). Bénéfice vasculaire **hétérogène par composante** ; complémentaire iSGLT2 ;
rénal dur = FLOW seulement (cf. §3 sous-dossier 2).

**Divergences escaladées** :

- **SURPASS-CVOT = non-infériorité, PAS supériorité (p=0,09)** ; mortalité 0,84 = secondaire (gatekeeping
  compromis). Tirzépatide non supérieur au dulaglutide.
- **Effet-classe non uniforme** : lixisénatide (ELIXA) neutre, exénatide LP (EXSCEL) non supérieur →
  **exclus** des allégations CV (application D12).
- Rénal : LEADER/REWIND = **albuminurie** (substitution) ; seul **FLOW** (sémaglutide, pop. IRC) = dur.

**Non-vérifiable `[À VÉRIFIER]`** : IC du composite élargi SURPASS-CVOT corrompu dans les sources
secondaires (« 0,88–0,96 » impossible) → texte NEJM · DOI SURPASS ambigu (PMID 41406444 confirmé) · SOUL
mortalité/HHF isolées · composite rénal SURPASS ~21 % · **GRADE par essai = jugement de guideline** (à
assigner depuis SFD/HAS/ADA, pas depuis les essais).

### metformine

**Consensus vérifié** : UKPDS 34/80/91, Griffin 2017, Boussageon 2012, DPPOS confirmés sur sources
primaires. **Verdict : bénéfice dur = niveau de preuve FAIBLE / non concluant** (cf. §3 sous-dossier 3).

**Divergences / corrections** : OpenEvidence « MACE ~0,60 » → réalité **Monami 0,52 sur 2 ECR** (dont un
vs sulfamide) ; mortalité 0,80 **NS** · HOME « favorable » = **critère principal NS** (outcome-switching)
· Mannucci 2023 « bénéfice CV prouvé » = raisonnement **circulaire** · **Prescrire 7** vise les
**alternatives**, pas la metformine.

**`[À VÉRIFIER]` — RÉSOLU (vérif. 2026-07-23)** : DOI **HOME** (Kooy, *Arch Intern Med* 2009,
10.1001/archinternmed.2009.20 ; principal **NS**, macro 2ndaire HR 0,61) ✓ · **SPREAD-DIMCAD** (Hong,
*Diabetes Care* 2013, 10.2337/dc12-0719 ; HR 0,54) ✓ · **Monami 2021** (10.1016/j.numecd.2020.11.031 ; MACE
OR 0,52 **sur 2 ECR seulement**, mortalité 0,80 **NS**) ✓. Formulation Prescrire **vérifiée** (cf.
`sources/prescrire-dt2.md`). Restant : grade C HAS à sourcer sur la RBP.

### insuline initiale

**Consensus vérifié (extraction A + red-team B, concordance totale)** : (A) SIIT au diagnostic = ECR (Weng,
Chon) sur **critères intermédiaires seulement**, **non durable** (Kramer 42 %/2 ans ; RESET-IT négatif ;
bénéfice perdu à l'arrêt — LIBRA/Shi) ; **Harrison 2014 (non-asiatique) : insuline non supérieure à l'oral
intensif** → c'est l'intensité/précocité du contrôle, pas l'insuline ; pas de comparaison vs GLP-1/iSGLT2
d'emblée. (B) hyperglycémie sévère/cétose = **pas d'ECR** → ADA **Grade E**, nécessité clinique.

**À arbitrer (référent)** : positionner la SIIT comme **option à preuve faible** et **DiRECT / perte de
poids (nœud H) au moins à parité** pour le phénotype européen.

**`[À VÉRIFIER]` — RÉSOLU (vérif. 2026-07-23)** : DOI **RESET-IT** 10.1111/dom.14421 ✓ · **LIBRA**
10.2337/dc14-0893 ✓ · HbA1c d'entrée **Weng ~9,5 %** (OE) ✓ · **aucun ECR insuline-vs-aGLP1/iSGLT2 d'emblée**
confirmé (SIMPLE = insuline dans **les 2 bras**) ✓. Étude CV « real-world » 2024 = **observationnelle**, ne
pas utiliser comme preuve ECR.

### SU / gliptines (argumentation négative)

**Consensus vérifié (A + B + OpenEvidence, concordance forte)** : ni SU ni gliptines n'ont de **bénéfice
d'organe** (CVOT en non-infériorité ; CARMELINA rénal 1,04). Signal IC = **saxagliptine** (SAVOR 1,27) ;
sitagliptine/linagliptine neutres. SU : hypo + poids quantifiés ; « surmortalité » **non prouvée en ECR**
(Rados OR 1,12 NS ; CAROLINA neutre) ; hiérarchie glibenclamide > glimépiride > gliclazide.

**Corrections (spin dans les 2 sens)** : ✗ « gliptines → IC » (c'est la saxa) · ✗ « SU → surmortalité »
(contesté, CAROLINA) · ✗ « gliptines inutiles » (sûres, place résiduelle légitime).

**`[À VÉRIFIER]` — RÉSOLU sauf 1 (vérif. 2026-07-23)** : **Roumie 2012** SU vs metformine, composite CV
**HR 1,21 [1,13-1,30]** ✓ ; **JAHA 2017** (Roumie) IC **1,30 [1,20-1,42]**, **décès CV 1,76 [1,14-2,71]** ✓
→ le signal observationnel SU **existe et est chiffré** (mais confusion par indication ; **ECR CAROLINA
neutre**). **TECOS** hypo sévère **2,2 vs 1,9 % (NS)** ✓. **Poids** : SAVOR **−0,10 kg** / TECOS **−0,05 kg**
(méta Ghosh-Swaby ; le texte primaire ne le chiffre pas) = **poids-neutre** ✓. **SFD 2025 vs 2023 :
RÉSOLU** (même distinction « bénéfices » vs « sécurité » démontrés). ✓

## 6. Incertitudes

**iSGLT2** :
- Mécanisme exact du bénéfice (hémodynamique / natriurétique / métabolique — pas anti-athéromateux).
- Transposabilité du bénéfice IC/rénal (essais à forte proportion de non-diabétiques) au DT2 de
  1re intention **sans** IC ni MRC constituée : bénéfice dur non démontré dans ce sous-groupe.
- Effet-classe pour mortalité/MACE (cf. §5b) ; VERTIS CV à confirmer.
- Additivité iSGLT2 + AR GLP-1 : signal favorable mais **observationnel + sous-groupes** (essai
  PRECIDENTD en cours) — preuve faible.

**AR GLP-1 / tirzépatide** :
- Bénéfice vasculaire hétérogène (mécanisme, composante motrice variable par molécule).
- Tirzépatide : pas de CVOT placebo ; bénéfice CV = non-infériorité au dulaglutide seulement.
- Rénal dur limité à FLOW (population IRC) — transposabilité au DT2 sans IRC non établie.
- Balance bénéfice / effets indésirables (signal suicidaire, cancers thyroïde/pancréas) non tranchée.

**metformine** :
- Bénéfice dur jamais confirmé vs placebo ; ne le sera probablement jamais (équipoise impossible).
- Legacy = observationnel sur un seul sous-groupe de 342 patients.

**insuline initiale** :
- Rémission = critère intermédiaire, non durable (~10 % à 5 ans) ; pas de comparaison vs aGLP1/iSGLT2 d'emblée.
- Place de l'aGLP1/tirzépatide vs insuline à HbA1c très élevée (SIMPLE + guidelines 2025-2026 les préfèrent hors catabolisme) — à confirmer.

**SU / gliptines** :
- Effet-classe vs molécule du signal IC des gliptines non tranché (saxa clair, classe borderline).
- Innocuité CV des SU modernes (gliclazide) : un seul CVOT dédié (CAROLINA, glimépiride) ; observationnel discordant.

## 7. → YAML (contenu distillé) — ENCODÉ + VÉRIFIÉ (2026-07-23)

Encodé dans `content/noeuds/diabete-type-2/premiere-intention.yaml` (nœud **multi-options** : gate insuline
→ iSGLT2 → AR GLP-1 → tirzépatide → association → metformine seule/défaut ; priorité par **ordre** des
options) + argumentaire niveau 3 `premiere-intention.argumentaire.md`. **Validation** : 38/38 tests Vitest
(Ajv schéma + moteur) + build/typecheck OK ; **vérification bi-agent du YAML vs ce dossier** (fidélité =
conforme ; red-team). **Corrections red-team appliquées** : garde-fou de sécurité — **iSGLT2 et association
supprimés en hyperglycémie catabolique** (`symptomes_glucotoxicite == false` en `conditions`, + CI HbA1c>10 ;
finding A/acidocétose) ; l'**association** ne se déclenche plus sur ASCVD seul (retrait de l'ASCVD de sa
branche iSGLT2 ; finding C) ; **préférence par critère dominant** portée par les `avantages` (finding B) ;
renvoi nœud C ; refs CANVAS/EMPEROR-Reduced ajoutées ; SURPASS ancré sur **PMID 41406444**. Traçage moteur de
6 profils patients validé (test temporaire). **Restant P2 (moteur)** : champ `priorite` conditionnel,
évaluation des `contre_indications` comme exclusions dures, variables `decompensation`/`cetose`.

## 8. Demandes au référent

- Sources fournies (2026-07-23) : SFD 2025 ✓ · Prescrire 5-8 ✓ · **rapport OpenEvidence (4 questions)** ✓.
- Arbitrages **résolus** (2026-07-23) : tirzépatide **inclus** (remboursé FR juillet 2026) · iDPP4 **→ D**
  (EBM : pas de bénéfice d'organe). Cf. §2.
- **Validation référent — sous-dossier iSGLT2 (2026-07-23)** :
  1. **Résolution « effet-classe »** (§5b) — ✓ **VALIDÉ**, érigé en règle transverse `DECISIONS.md` D12
     (recommandation par molécule uniquement si EBM).
  2. Rationale des `conditions` iSGLT2 par déclencheur + seuil **DFG ≥ 20** (KDIGO 2024) — ✓ **VALIDÉ pour
     encodage**.
- **Validation référent — GLP-1 & metformine (2026-07-23)** :
  3. **GLP-1** : bénéfice vasculaire (AVC > mort CV > IDM), effet-classe hors lixisénatide/exénatide ;
     tirzépatide = non-infériorité ; rénal dur = sémaglutide/FLOW — ✓ **VALIDÉ**.
  4. **metformine** : base sans label « bénéfice CV prouvé » — ✓ **VALIDÉ**.
- **Validation référent — VALIDÉ (2026-07-23)** :
  5. **Gate insuline** (§2) : porte de sécurité (décompensation/cétose = nécessité, Grade E) ; HbA1c≥10 %
     **catabolique** → insuline ; **sans catabolisme** → aGLP1/tirzépatide préférés ; iSGLT2 évité si
     HbA1c>10 % ; SIIT « rémission » = option faible, DiRECT (nœud H) à parité — ✓ **VALIDÉ**. Variables à
     ajouter (P2) : `symptomes_glucotoxicite`, `decompensation`/`cetose`.
  6. **Argumentation négative SU/gliptines** (§4) : reléguées (pas de bénéfice d'organe), sans les 3 pièges,
     position critique Prescrire « à écarter » affichée à côté ; place résiduelle → nœud D — ✓ **VALIDÉ**.
  7. **Priorité** iSGLT2 (IC/rénal) vs GLP-1 (athérome/obésité), affichage par critère dominant — ✓ **VALIDÉ**.
- **`[À VÉRIFIER]` LEVÉS (2026-07-23)** via bi-agents + OpenEvidence + Prescrire (cf. §5) : EMPA-REG
  (100 % MCV / 74 % metformine / AVC 1,18), **VERTIS** (0,97 ; HHF 0,70), **SURPASS** (rénal 0,77 ;
  cardio-rénal 0,84), **SOUL** (0,91 ; HHF 0,90), NNT (tous calculés secondairement), poids gliptines
  (poids-neutre), DOI metformine/SU/insuline, citations Prescrire (fragilité LEADER, « à écarter ») ✓.
  **Restant mineur** : grade C HAS à sourcer sur la RBP. → **BON À ENCODER** (YAML = P2).
</content>
</invoke>
