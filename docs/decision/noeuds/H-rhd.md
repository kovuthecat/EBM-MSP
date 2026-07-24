# Nœud H — RHD / perte de poids / rémission   (dossier de preuve)

- **statut** : **NŒUD ENCODÉ (brouillon v0.1) + VÉRIFIÉ BI-AGENTS ÉTAPE 8 — 0 finding HAUTE (2026-07-24)**.
  Dossier de preuve complet (collecte + triangulation A × B × OE + red-team primaire) ; **recadré « outil d'aide
  à la recommandation »** (§0-2) ; **arbitrages §8-1→8-7 tranchés** ; SFD 2025 + HAS parcours obésité + Prescrire
  P9-P13 intégrés. **Encodage** : `content/…/rhd.yaml` (brouillon) + `rhd.argumentaire.md` (niveau 3) ; Ajv 6/6,
  123 tests, build OK ; **vérif. encodage bi-agents (A fidélité + B red-team moteur, 18 profils tracés) : 0 HAUTE**,
  findings MOYENNE/BASSE corrigés (cf. §5h). **RESTE : validation clinique finale du référent → `valide` + commit.**
  Non couvert en primaire : position CMG (SFD 2025 obtenue) ; câblage du formulaire (nouvelles variables) = P3.
- **version** : 0.1 · **date** : 2026-07-23 · **auteur** : Opus + référent (Thibault)
- **id YAML cible** : `rhd` · domaine `diabete-type-2`
- **type de nœud** : **MULTI-OPTIONS** (plusieurs recommandations simultanées). Un **socle RHD** vaut
  **pour tous** (sentinel `["toujours"]`, cf. `DECISIONS.md` D16 — comme la metformine du nœud B) ;
  les interventions ciblées (programme intensif de perte de poids visant la rémission, discussion
  chirurgie métabolique) s'ajoutent selon des `conditions`. Champ `priorite` non pertinent a priori
  (les options ne sont pas concurrentes mais empilées). À reconfirmer à la distillation.

## 0. Nature de ce dossier & périmètre (garde-fou méthodo)

Nœud H cadré (`CADRAGE-8-noeuds.md §H`) = **« quelle place pour les mesures hygiéno-diététiques (MHD),
la perte de poids et la rémission ? »** chez l'adulte **DT2 déjà déclaré**. C'est le **volet
non-médicamenteux de fond** du DT2, **transversal** aux nœuds médicamenteux (A cible / B 1re intention /
C intensification / D SU-gliptines / E insuline) : les MHD ne remplacent pas ces nœuds, elles les
**sous-tendent** (socle recommandé à tous), et ouvrent en plus une voie propre — la **rémission** par
perte de poids importante chez un sous-groupe.

**Nature du nœud (recadrage référent 2026-07-24) : OUTIL D'AIDE À LA RECOMMANDATION en médecine générale.**
Le MG **recommande, informe et oriente** — il ne *délivre* pas de programme intensif (celui-ci relève de soins
spécialisés / coordonnés). Le nœud produit, à partir des **critères cliniques + l'EBM**, des **recommandations
MHD adaptées au patient** et **présente les bénéfices attendus** ; il ne prescrit pas une prestation. La
« rémission » y est une **information et un objectif à proposer** (grade A, ebmfrance : *« informer le patient
qu'une rémission est possible en modifiant durablement le mode de vie »*), assortie d'une **orientation** vers
un accompagnement structuré (diététicien / programme), pas un acte du MG.

**Périmètre — inclus / exclu :**

- **INCLUS** : (a) **recommandation** d'un socle MHD = alimentation (type **méditerranéen**) + **activité
  physique adaptée** + objectif de **perte de poids** ; (b) **recommandation d'une perte de poids importante
  (visée rémission) + information + orientation** vers un accompagnement structuré (ancrage **DiRECT** ; le MG
  oriente, ne délivre pas le TDR) ; (c) **honnêteté sur le devenir CV dur** (ancrage **Look AHEAD**, 1aire NS).
- **PÉRIMÈTRE À TRANCHER (§8)** : **chirurgie métabolique / bariatrique** — c'est l'intervention de
  **perte de poids / rémission** la plus efficace (STAMPEDE, Mingrone, SOS), donc légitime sous
  l'intitulé « perte de poids / rémission », mais ce n'est pas une **MHD** et elle relève d'un parcours
  spécialisé. → à cadrer : **option « à discuter/orienter »** dans H, **note statique**, ou **hors nœud**.
- **EXCLU (autre problématique)** : la **prévention** du DT2 chez le sujet à risque / prédiabétique
  (DPP, DPS, Da Qing, Prescrire **P2**) — le nœud porte sur le patient **déjà diabétique**. Les données
  de prévention seront **mentionnées** en argumentaire (continuité MHD) mais ne **pilotent pas** le nœud.
- **EXCLU (médicaments de la perte de poids)** : les AR GLP-1 / AR GIP-GLP-1 comme agents d'amaigrissement
  relèvent des nœuds **B/C** (choix de l'hypoglycémiant à bénéfice pondéral), pas de H. H ne traite que le
  **non-médicamenteux** + l'objectif de rémission.

**Trois messages structurants attendus** (à étayer par la collecte) :

1. **Socle pour tous** : MHD (alimentation méditerranéenne, activité physique, objectif de perte de poids
   **5-10 %** — Prescrire P1) = **1er temps thérapeutique** et **fond permanent**, quel que soit le
   traitement médicamenteux. Bénéfice le mieux établi = **régime méditerranéen sur les événements CV**
   (ancrage **PREDIMED**) et **contrôle glycémique** (HbA1c, substitut). `[À VÉRIFIER — collecte]`.
2. **Rémission possible mais bornée** : une **perte de poids importante et précoce** (programme intensif,
   **DiRECT**) permet une **rémission** (HbA1c normale **sans** hypoglycémiant) chez une **fraction
   substantielle** des patients, **d'autant plus que le diabète est récent** ; mais la rémission **n'est
   pas une guérison** (rechutes, surveillance à vie), sa **définition** doit être stricte (consensus
   ADA/EASD/… — HbA1c < 6,5 % ≥ 3 mois après arrêt du médicament) et son **bénéfice sur critères durs
   (CV, mortalité) reste à démontrer**. `[À VÉRIFIER — collecte]`.
3. **Anti-sur-promesse (point critique central)** : l'intervention **intensive** sur le mode de vie
   **n'a PAS réduit les événements cardiovasculaires** dans le seul grand ECR à critère dur (**Look
   AHEAD**, arrêté pour futilité) ; elle améliore poids, HbA1c, rémission, apnée du sommeil, mobilité,
   qualité de vie (critères **secondaires / substituts**). → présenter la perte de poids comme un
   objectif **de qualité de vie et de contrôle**, sans **survendre** un bénéfice de survie non démontré.
   `[À VÉRIFIER — collecte]`.

Suit la pipeline `00-global.md` (Cadrer → Collecter → Apprécier → bi-agents → Distiller). Ce fichier fige
les **étapes 1-2** ; les §3-8 seront remplis par la collecte + la vérification bi-agents.

## 1. Question clinique & critères d'entrée (FIGÉ)

- **PICO** :
  - **P** = adulte **DT2 déjà déclaré** (hors DT1, grossesse ; hors prédiabète/prévention — cf. §0).
  - **I** = **recommandations MHD adaptées** (alimentation type méditerranéen, activité physique adaptée,
    objectif de perte de poids), **information** sur le potentiel de rémission + **orientation** vers un
    accompagnement structuré / la chirurgie métabolique. **Le MG recommande / informe / oriente — il ne
    délivre pas le programme intensif** (recadrage §0).
  - **C** = soins usuels / conseils standard non structurés ; ou pas d'intervention sur le mode de vie.
  - **O = critères DURS** : mortalité toutes causes, mortalité/événements CV majeurs (IDM, AVC), —
    **vs SUBSTITUTION / états intermédiaires** : **rémission** (HbA1c sans médicament), HbA1c, poids,
    besoin en médicaments, facteurs de risque, qualité de vie. La distinction **rémission / contrôle
    (obtenus) vs événements CV & survie (non démontrés par la seule intervention intensive)** est
    **décisionnelle** ici (message n°3).

- **Variables d'entrée** (→ `criteres_entree`, cf. `CADRAGE-8-noeuds.md §H` + §Observations 5) :
  - `IMC` (nombre, kg/m²) — réutilisé des nœuds B/C. Déclencheur des interventions ciblées (fenêtre
    DiRECT ~**27-45** ; seuils chirurgie ~**35** / **30-34,9** mal contrôlé). Seuils `[À VÉRIFIER §8]`.
  - `anciennete_diabete_annees` (nombre) — réutilisé des nœuds A/F. **Proxy de réversibilité** : la
    probabilité de rémission décroît avec l'ancienneté (fenêtre DiRECT **< 6 ans**). Seuil `[À VÉRIFIER]`.
  - `motivation` (bool) — nouvelle variable. **§8-4 tranché : MODULATEUR d'affichage** (n'exclut jamais une
    recommandation ; adapte le libellé — adhésion faible → « négocier des objectifs modestes, entretien motivationnel »).
  - `capacite_activite` (bool) — nouvelle variable. **MODULATEUR** de la recommandation d'activité physique
    (co-morbidités limitant l'effort → « activité **adaptée** : fractionnée / assise / supervisée »).
  - `alimentation_equilibree` (bool) + `activite_physique_reguliere` (bool) — **nouvelles variables (« marge de
    manœuvre », ajout référent 2026-07-24)** : capturent ce que le patient **fait déjà**. **MODULATEURS** : si
    l'alimentation est déjà équilibrée et/ou l'activité déjà importante, la **marge de manœuvre MHD est faible**
    → la recommandation passe de « améliorer » à « **maintenir / renforcer** » et le **bénéfice additionnel
    attendu est plus faible** (éviter le conseil condescendant « mangez mieux, bougez plus » à qui le fait déjà ;
    réorienter vers d'autres leviers si le contrôle reste insuffisant).

- **Critères ÉCARTÉS (et pourquoi)** — *à confirmer collecte/§8* :
  - `HbA1c_actuelle` : le socle MHD s'applique **indépendamment** du niveau d'HbA1c (fond permanent) →
    ne pas gater le socle dessus. *(La rémission suppose un contrôle atteignable, mais c'est un résultat,
    pas un critère d'entrée.)* `[À confirmer]`.
  - `traitements_en_cours` : n'entre pas dans le **choix** des MHD ; en revanche une **perte de poids
    rapide sous insuline/sulfamide** impose d'**adapter/alléger** le traitement (risque hypo) → traité en
    **alerte** (renvoi nœuds C/D/E), pas en critère d'entrée. `[À confirmer]`.
  - `esperance_vie` / `fragilite` : pertinents pour **pondérer l'intensité** d'un objectif de perte de
    poids chez l'âgé (ne pas imposer une restriction calorique agressive à un sujet fragile/sarcopénique)
    → candidat **alerte**, pas critère d'entrée principal. `[À VÉRIFIER §8]`.

## 2. Options envisagées (esquisse FIGÉE — intitulés & conditions ; seuils/chiffres à confirmer par collecte)

Nœud **multi-options** = **jeu de recommandations empilées** (pas concurrentes). Le **socle** vaut pour tous ;
la recommandation renforcée s'ajoute selon `IMC`. **Chaque option porte ses bénéfices attendus** ; les variables
`motivation` / `capacite_activite` / `alimentation_equilibree` / `activite_physique_reguliere` **modulent le
libellé et le bénéfice affiché**, elles n'excluent jamais (§8-4).

1. **Recommandation socle — POUR TOUS** — `conditions: ["toujours"]` (sentinel D16).
   Recommander une alimentation de type **méditerranéen** + une **activité physique adaptée** (selon
   `capacite_activite`) + un **objectif de perte de poids ≥ 5-10 %** chez le patient en surpoids/obèse. 1er
   temps thérapeutique et fond permanent. **Bénéfices attendus** : CV (régime méditerranéen — PREDIMED +
   CORDIOPREV) ; HbA1c ~−0,6 % (activité) ; contrôle / allègement médicamenteux. Modulé par la **marge de
   manœuvre** (déjà équilibré/actif → « maintenir / renforcer », bénéfice additionnel moindre).
2. **Recommandation renforcée de perte de poids (visée rémission)** — `conditions: IMC >= 27` **(§8-2 : PAS
   de gate sur l'ancienneté)**. **Informer** du potentiel de rémission (grade A) + recommander une **perte de
   poids importante ≥ 10-15 % / ≥ 10-15 kg** + **orienter** vers un accompagnement structuré (diététicien /
   programme type DiRECT — hors MG). **Bénéfice attendu = rémission**, modulé par l'**ancienneté** (~46-61 % si
   < 6 ans, décroissant ensuite ; déterminant = ampleur de perte de poids — Kanbour) ; au-delà de la fenêtre,
   reframer en « amélioration du contrôle ». **Ne JAMAIS présenter comme un gain de survie/CV** (Look AHEAD).
   `niveau_preuve` : rémission = **modéré** (DiRECT/DIADEM-1, substitut).
3. **Alerte « penser à la chirurgie métabolique »** *(§8-1 : NOTE conditionnée par l'IMC, pas une option
   interrogeable)* — `IMC >= 35 OR (IMC >= 30 AND diabète mal contrôlé)` → orienter vers une évaluation en
   soins spécialisés (grade A ebmfrance : IMC 30-35 après échec du traitement conservateur). Décision hors outil.

**Alertes (D15) envisagées** (rappels, pas des options) :
- **La rémission n'est pas une guérison** → surveillance métabolique **à vie** (rechute fréquente ;
  bénéfice micro/macrovasculaire à long terme non établi). `[À VÉRIFIER]`.
- **Perte de poids rapide sous insuline / sulfamide** → **risque d'hypoglycémie** : anticiper
  l'allègement du traitement (renvoi nœuds C/D/E). `[À VÉRIFIER]`.
- **Sujet âgé / fragile / dénutri** → viser le **maintien musculaire**, pas une restriction agressive
  (risque de sarcopénie) ; individualiser l'objectif de poids. `[À VÉRIFIER]`.
- **L'intervention intensive sur le mode de vie n'a pas réduit les événements CV** (Look AHEAD) → objectif
  = contrôle, poids, comorbidités, qualité de vie ; pas une promesse de survie. `[À VÉRIFIER]`.

**Garde-fous de voix (à tenir en rédaction)** : ✗ ne pas présenter la rémission comme définitive/guérison ;
✗ ne pas revendiquer un bénéfice de **mortalité / événements CV** pour l'intervention intensive de perte de
poids (Look AHEAD primaire NS) ; distinguer partout **rémission & contrôle (obtenus)** vs **critères durs
(non démontrés par le seul mode de vie, hors régime méditerranéen sur le CV — PREDIMED)**.

## Sources en main & plan de collecte (2026-07-23)

**Déjà en main (réutilisable)** :
- **Prescrire** (`sources/prescrire-dt2.md`) : **P1 = P4** (« DT2 chez un adulte », févr. 2026) → 1er choix
  = diététique + activité physique, **perte 5-10 %** ; **P2** (« Prévenir ou retarder le DT2 », oct. 2006)
  → MHD **↓ incidence ~30-58 %**, **pas d'effet démontré sur la mortalité**, priorité au mode de vie sur les
  médicaments (**périmètre prévention** — à mobiliser en argumentaire, pas comme pilote du nœud). Ligne
  transverse Prescrire : objectif = **éviter les complications**, pas l'HbA1c en soi.
- **Positions HAS 2024** (PDF référent) — RHD = socle ; **SFD 2025** (PDF référent) ; à recouper au red-team.

**Collecte lancée — 5 sous-dossiers bi-agents (Agent A extraction ; red-team Agent B ultérieur)** :
1. **Rémission par perte de poids (interventions non chirurgicales)** — **DiRECT** (Lean, primary-care,
   rémission à 1 an / 2 ans + extension), **DROPLET**, **ReTUNE** (IMC « normal »), Virta/keto (obs.),
   POWER-Remission / DiRECT-Aus le cas échéant. **Définition** consensuelle de la rémission (ADA/EASD/…,
   Riddle 2021). Ampleur, **durabilité**, prédicteurs (ancienneté, perte de poids atteinte). Critère dur ?
2. **Intervention intensive sur le mode de vie & critères DURS** — **Look AHEAD** (critère 1aire CV **NS**,
   arrêt pour futilité) ; **post-hoc perte ≥ 10 %** (Gregg 2016) ; **rémission dans Look AHEAD** (Gregg 2012) ;
   effets secondaires favorables (apnée, mobilité, QoL, rétinopathie, néphropathie, dépression). Message
   anti-sur-promesse.
3. **Régime méditerranéen & activité physique** — **PREDIMED** (CV, sous-groupe/diabétiques ; ré-analyse
   2018) ; **PREDIMED-Plus** (perte de poids + Med hypocalorique) ; **Esposito** (Med diet retarde le
   recours aux médicaments) ; **exercice** (métas **Boulé**, **Umpierre** ; **Sigal** résistance) → effet
   **HbA1c (substitut)** vs **CV (dur, PREDIMED)**. Bénéfices non glycémiques.
4. **[périmètre §8] Chirurgie métabolique & rémission** — **STAMPEDE** (5 ans), **Mingrone** (10 ans),
   **Schauer**, **SOS-diabetes** (Sjöström), **Diabetes Surgery Summit** (seuils IMC). Rémission,
   critères durs (CV/mortalité — SOS observationnel), sécurité, durabilité. Sert à trancher le périmètre.
5. **Reco officielle FR & internationale + divergence** — **HAS 2024**, **SFD 2025**, **CMG**,
   **ADA/EASD 2022** (consensus, weight management + remission), **Prescrire P1/P2**, **Médicalement Geek /
   DragiWebdo** : place du socle MHD, objectif de perte de poids (**5-10 % vs ≥ 15 %**), **rémission comme
   objectif** ou non, chirurgie. **Divergence** reco ↔ position critique EBM.

### État de collecte (2026-07-23)

- Agents A (sous-dossiers 1-5) : **REÇUS** ce jour → **§3 consolidé** ci-dessous (grilles par étude, PMID/DOI,
  flags `[À VÉRIFIER]` conservés).
- **OE-H1→OE-H5** : **transmis au référent** (annexe) — à lancer dans OpenEvidence en parallèle
  (triangulation A × B × OE, `00-global.md` étape 4).
- Red-team Agent B (vérif. PMID/DOI/chiffres contre source primaire) : **à lancer** (prochaine étape) —
  cible prioritaire : chiffres décisionnels ★ + flags `[À VÉRIFIER]` recensés en fin de §3.

## 3. Base de preuves (grille par étude clé) — CONSOLIDÉE (agents A, 2026-07-23 ; ★ = décisionnel, à red-teamer)

> **Garde-fou** : contenu = **extractions agents A** (source primaire annoncée mais **non encore
> re-vérifiée par le red-team Agent B**). Aucun chiffre ne passe en « confirmé » ni n'entre au YAML avant
> vérification B contre la source primaire. Les `[À VÉRIFIER]` sont recensés en fin de §3.

**Définition de référence de la rémission** — consensus ADA/EASD/Endocrine Society/Diabetes UK, Riddle ME
et al., *Diabetes Care* 2021;44(10):2438-2444 (**PMID 34462270** version *Diabetes Care*, DOI 10.2337/dci21-0034 ;
34459898 = version JCEM du même consensus) : **HbA1c < 6,5 %
mesurée ≥ 3 mois après l'arrêt de tout hypoglycémiant**. Les essais ci-dessous sont souvent antérieurs et
emploient des définitions **proches mais non identiques** (délai d'arrêt variable, metformine parfois
tolérée — cf. Virta) : écart à surveiller au red-team.

### SOUS-DOSSIER H1 — Rémission par perte de poids (interventions NON chirurgicales)

| Essai (PMID / DOI) | Design / population (IMC, ancienneté) | Intervention / durée | Rémission (% par bras, Δ absolu, horizon) + poids/HbA1c | GRADE |
|---|---|---|---|---|
| ★ **DiRECT 1 an** (29221645 · 10.1016/S0140-6736(17)33102-1, *Lancet* 2018) | RCT **en grappes**, ouvert, soins primaires UK. DT2 **≤ 6 ans**, IMC 27-45, **sans insuline**. n=298 | Substituts de repas totaux ~825-853 kcal/j 3-5 mois + réintro + maintien, **arrêt des antidiabétiques** vs soins usuels. 12 mois | **46 % (68/149) vs 4 % (6/149)**, Δ ≈ **+42 pts** (OR 19,7 ; IC 7,8-49,8). Perte ≥ 15 kg : 24 % vs 0 %. | **modéré** (effet majeur ; ouvert + substitut) |
| ★ **DiRECT 2 ans** (30852132 · 10.1016/S2213-8587(19)30068-3, *Lancet Diab Endo* 2019) | suivi du RCT | idem, maintien | **36 % (53/149) vs 3 % (5/149)**, Δ ≈ **+33 pts** (aOR 25,8). **Dose-réponse : 64 % (29/45) si ≥ 10 kg maintenus**. | **modéré** |
| ★ **DiRECT 5 ans** (38423026 · 10.1016/S2213-8587(23)00385-6, 2024) | extension (soutien allégé) | idem + soutien allégé | **13 % (11/85) extension vs 5 % (5/93) contrôle**. Parmi rémittents à 2 ans, **seuls ~26 % le restent à 5 ans**. EIG **4,8 vs 10,2 /100 pers.-années (p=0,008)**. | **modéré→faible** (attrition, effet érodé) |
| **DiRECT-Aus** (37840461, *Diabetes Care* 2024) | **mono-bras** (implémentation), soins primaires Australie, DT2 précoce | substituts totaux 12 sem. + programme ≤ 52 sem. | **56 % (86/155) à 12 mois** (55 % avec déf. 3 mois), perte ajustée ~8,1 %. Pas de comparateur → pas de Δ causal. | **faible** (mono-bras) |
| ★ **DIADEM-1** (**32445735** · 10.1016/S2213-8587(20)30117-0, *Lancet Diab Endo* 2020) | **RCT ouvert**, n=158, DT2 **≤ 3 ans**, 18-50 ans, MENA | TDR ~800 kcal/j 12 sem. + réintro/maintien vs soins usuels | rémission **61 % vs 12 %** (p<0,0001), **NNT ~2** ; perte **−12,0 vs −4,0 kg**. **2ᵉ ECR de rémission** (réplique DiRECT chez sujets jeunes non-blancs). | **modéré** (RCT ouvert, 12 mois, substitut) |
| **U-TURN** (JAMA 2017 **28810024** ; rémission Ried-Larsen 2019 **31168922** · 10.1111/dom.13802) | RCT **monocentrique** n=98, exercice intensif + diète vs standard | critère 1aire = contrôle glycémique (↓ médoc 73,5 % vs 26,4 %) | rémission **soutenue 23 % vs 7 %** (24 mois) — **⚠ critère primaire NON significatif en complete-case (OR 4,4 ; p=0,08)** ; « 37 % à 12 mois » **non vérifiable**. | **faible-très faible** (n=98, mono, primaire NS) |
| ReTUNE (37593846 · 10.1042/CS20230586, *Clin Sci* 2023) | **mécanistique mono-bras**, n=**20** DT2 à **IMC « normal » (moy. 24,8)** | cycles perte 5 % (~800 kcal) jusqu'à normalisation | **70 % (14/20)** rémission ; perte médiane **6,5 %** ; maintien 12 mois. **Pas de comparateur.** | **faible** (n=20, mono-bras) |
| Virta / cétose 2 ans (31231311 · 10.3389/fendo.2019.00348) | **non randomisé, auto-sélection**, télésuivi. DT2 ~8 ans, insuline autorisée. n=262/87 | régime cétogène + coaching vs soins usuels. 2 ans | « reversal » 53,5 % ; **rémission 17,6 % vs 2,4 %** (déf. **maison, metformine tolérée** ≠ Riddle). Poids −11,9 kg. | **très faible** (non randomisé, financé Virta) |
| DROPLET (30257983 · 10.1136/bmj.k3760) | RCT, **obèses tout-venant (~15 % DT2)** — **PAS une cohorte DT2** | substituts totaux vs soins usuels. 12 mois | **N'a PAS rapporté la rémission.** Poids −7,2 kg (IC −9,4 à −4,9). → **hors-cible rémission.** | modéré (poids) / n.a. rémission |

**Prédicteurs** : ampleur **et maintien** de la perte de poids (dose-réponse la + robuste ; **Kanbour 2025**,
méta-régression, PMID 40023186 : **la perte de poids est le prédicteur DOMINANT — l'ancienneté n'est plus
indépendante après ajustement** ; conclusion **écologique**, mais réserve β-cellulaire biologiquement plausible)
→ **input §8-2**. **Durabilité** : érosion nette (46 → 36 → 13 % à 5 ans, DiRECT ; vie réelle **Wu 2024** :
6,1 % de rémission, **67 % de rechute** à ~3,1 ans). **Critère dur ?** rémission = **substitut** ; **aucun ECR
non chirurgical dimensionné sur CV/mortalité** — signaux **observationnels seulement** (moins d'EIG hospitalisés,
DiRECT 5 ans ; **Gregg 2024** intra-Look AHEAD : rémission → CVD HR 0,60 / CKD HR 0,67, **non causal**, confusion
par indication). **Message** : chez le **DT2 récent non insuliné**, ~40-61 % de rémission à 1 an (DiRECT +
DIADEM-1, solide), mais état **fragile, dépendant du maintien pondéral**, sans preuve sur critères durs →
objectif **réaliste mais exigeant, non garanti, pas une « guérison »**.

### SOUS-DOSSIER H2 — Intervention intensive sur le mode de vie & critères DURS (Look AHEAD)

| Item (PMID / DOI) | Design / critère | Résultat (absolu / HR-IC, horizon) | Type + GRADE |
|---|---|---|---|
| ★ **Look AHEAD — critère CV 1aire** (23796131 · 10.1056/NEJMoa1212914, *NEJM* 2013) | RCT, 5145 DT2 surpoids/obésité ; ILI vs Diabetes Support & Education ; suivi médian **9,6 ans** ; composite CV **dur** (mort CV + IDM non fatal + AVC non fatal + hospit. angor) | **NON significatif : 1,83 vs 1,92 /100 pers.-années ; HR 0,95 (IC 0,83-1,09) ; p=0,51. Arrêt pour FUTILITÉ.** | **DUR — élevé** (preuve solide d'**absence** de bénéfice CV) |
| ★ Mortalité (Look AHEAD) | idem | **Non réduite** : toutes causes **HR 0,91 (0,81-1,02 ; p=0,11)** (ext. 16,7 ans, *Diabetes Care* 2022 — donnée définitive ; intérim NEJM 2013 ~0,85) ; CV **HR 0,88 (0,61-1,29 ; p=0,52)**. | DUR — élevé (absence) |
| Gregg 2012 rémission (23288372 · 10.1001/jama.2012.67929, *JAMA*) | ancillaire, n=4503 | Toute rémission **an 1 : 11,5 % vs 2,0 %** ; **an 4 : 7,3 % vs 2,0 %** (p<0,001) ; soutenue ≥ 4 ans **3,5 %**. Modeste, décroissante. | **substitut — modéré-élevé** |
| Gregg 2016 ≥ 10 % poids (27595918 · 10.1016/S2213-8587(16)30162-0) | **post-hoc / observationnel** | Composite CV **HR 0,79 (0,64-0,98 ; p=0,034)**. | **POST-HOC — faible/très faible** (confusion, causalité inverse ; **pas causal**) |
| Sleep AHEAD apnée (**PMID 19786682** · 10.1001/archinternmed.2009.266) | sous-étude, 264 SAOS | IAH ajusté **−9,7 /h (IC −13,6 à −5,7 ; p<0,001)** ; rémission SAOS 13,6 % vs 3,5 %. | substitut — modéré-élevé |
| Rejeski 2012 mobilité (22455415 · 10.1056/NEJMoa1110294, *NEJM*) | secondaire préspécifié | Perte de mobilité **OR 0,52 (0,44-0,63 ; p<0,001)**. | substitut fonctionnel — modéré |
| Néphropathie (25127483 · 10.1016/S2213-8587(14)70156-1) | secondaire | IRC très haut risque **0,63 vs 0,91 /100 p-a ; HR 0,69 (0,55-0,87 ; p=0,0016)**. | substitut rénal — modéré |

**Message** : l'ILI améliore poids, HbA1c, rémission (modeste/transitoire), apnée, mobilité, rein — **mais le
critère CV dur de Look AHEAD est NEUTRE (HR 0,95, arrêt pour futilité) et la mortalité n'est pas réduite**. Le
signal « ≥ 10 % » (Gregg 2016) est **post-hoc**, non causal. → **ne jamais revendiquer un gain de survie ou
d'événements CV** ; positionner sur contrôle / comorbidités / qualité de vie.

### SOUS-DOSSIER H3 — Régime méditerranéen & activité physique

| Étude (PMID / DOI) | Design / population | Résultat (dur : CV ; ou substitut : ΔHbA1c) | Type + GRADE |
|---|---|---|---|
| ★ **PREDIMED** (article republié **PMID 29897866** · 10.1056/NEJMoa1800389, *NEJM* 2018;378:e34 ; orig. 23432189 **rétracté** ; avis 29897867) | RCT ouvert, n=7447 haut risque CV **prévention primaire**, **≈ 52 % DT2** (déduit ; Table 1 `[À VÉRIFIER]`) ; médiane **4,8 ans**. MedDiet + huile d'olive VE *ou* noix vs conseil pauvre en graisses | Composite **dur** IDM+AVC+décès CV (verbatim abstract) : **HR 0,69 (0,53-0,91)** huile d'olive ; **0,72 (0,54-0,95)** noix. HR **combiné 0,70-0,71 = HORS abstract** `[À VÉRIFIER — corps, paywall]` ; **ARR ≈ 1,3-2,1/1000 p-a** ; **NNT ≈ 120/5 ans**. **Sous-groupe diab. : HR/IC + P-int. NON-VÉRIFIABLES** (forest plot paywall). | **DUR — modéré** (rétract./republ., ouvert) |
| ★ **CORDIOPREV** (**35525255** · 10.1016/S0140-6736(22)00122-2, *Lancet* 2022) | RCT monocentr., n=1002 **coronariens (prévention 2aire)**, ~50 % DT2 ; 7 ans ; MedDiet vs pauvre en graisses | Composite CV **dur** (adjugé, 87 vs 111) : **HR 0,72 (0,54-0,96)** ; ARR ~4,9 pts, **NNT ~20/7 ans** ; ♂ HR 0,67 sig., **♀ (n=175) NS**. **2ᵉ ECR MedDiet → CV dur.** | **DUR — modéré-élevé** (RCT adjugé ; monocentr., effet sexe-dépendant) |
| PREDIMED-Plus (1 an **30389673** ; incidence diabète **40854218**, *Ann Intern Med* 2025) | RCT n≈6874, 55-75 ans surpoids + synd. métab. ; MedDiet **hypocalorique + AP** vs MedDiet ad libitum | **Substituts** : perte **−2,5 kg (−3,1 à −1,9)** à 1 an, ≥ 5 % 33,7 % vs 11,9 % ; **incidence de diabète HR 0,69 (0,59-0,82)** à 6 ans (**prévention**, non-diab.). **Critère CV dur toujours NON PUBLIÉ.** | substitut — modéré ; **CV dur en attente** |
| Esposito (19721018, *Ann Intern Med* 2009) | RCT monocentr., **n=215 DT2 nouv. diagnostiqués**, **4 ans**. MedDiet pauvre en glucides vs pauvre en graisses | **Recours à un antidiabétique 44 % vs 70 %** ; Δ **−26 pts (−31,1 à −20,1)** ; HR 0,63 (0,51-0,86). ΔHbA1c chiffrée `[À VÉRIFIER]`. | substitut / prise en charge — modéré→faible |
| Boulé (11559268 · 10.1001/jama.286.10.1218, *JAMA* 2001) | méta 14 essais DT2, exercice | **ΔHbA1c WMD −0,66 % ; p<0,001** (IC `[À VÉRIFIER]`). | substitut — modéré |
| Umpierre (**21540423** · 10.1001/jama.2011.576, *JAMA* 2011) | méta 47 études (n=8538) | exercice structuré **ΔHbA1c −0,67 % (−0,84 à −0,49)** ; **> 150 min/sem −0,89 %** ; conseil seul −0,43 %. | substitut — modéré (I²=91 %) |
| Sigal (17876019, *Ann Intern Med* 2007) | RCT n=251 DT2, 22 sem. | aérobie **−0,51 %**, résistance **−0,38 %** vs contrôle ; **combiné supérieur** à chaque modalité. | substitut — modéré |

**Message** : le bénéfice **dur** le mieux établi des MHD = **régime méditerranéen sur le CV — DEUX ECR** :
PREDIMED (primaire, HR 0,69/0,72 par bras ; **sous-groupe diab. non vérifiable en primaire**) **et CORDIOPREV**
(secondaire, ~50 % DT2, HR 0,72, NNT ~20/7 ans — OE, à red-teamer primaire). Exercice + interventions
diététiques (Esposito, PREDIMED-Plus 1 an) = **substituts uniquement** (ΔHbA1c ~−0,5 à −0,7 % ; poids ; report
du traitement). **Aucun bénéfice CV dur propre à l'exercice** démontré ; **PREDIMED-Plus : critère CV dur non publié**.

### SOUS-DOSSIER H4 — Chirurgie métabolique & rémission (cadrage de périmètre)

| Étude (PMID / DOI) | Design / population (IMC) | Rémission / critères durs (horizon) | Type + GRADE |
|---|---|---|---|
| ★ **STAMPEDE 5 ans** (28199805 · 10.1056/NEJMoa1600869, *NEJM* 2017) | ECR ouvert monocentr., n=150, IMC 27-43 ; médical vs RYGB vs sleeve | **HbA1c ≤ 6,0 % (avec/sans médoc — contrôle, pas rémission stricte)** : **5 % vs RYGB 29 % vs sleeve 23 %** ; ARR RYGB **NNT ≈ 4**. | substitut, ECR — **modéré** |
| ★ **Mingrone 10 ans** (33485454 · 10.1016/S0140-6736(20)32649-0, *Lancet* 2021) | ECR ouvert monocentr., n=60 ; médical vs RYGB vs BPD | **Rémission STRICTE (sans médoc)** : médical **5,5 %** vs RYGB **25 %** vs BPD **50 %** ; NNT 2-5. Rechute partielle ~50-67 % mais contrôle maintenu. | substitut durable, ECR — **modéré** |
| Ikramuddin 5 ans (29340678 · 10.1001/jama.2017.20813, *JAMA* 2018) | ECR, n=120, IMC 30-39,9 ; ± RYGB | composite ADA **23 % vs 4 %** (Δ 19 %, NNT ≈ 5). EIG chirurgie ↑ (66 vs 38). | substitut composite — modéré-faible |
| ★ **ARMMS-T2D** (pool 4 ECR US ; Kirwan 2022 **35320365** ; Courcoulas 2024 **38411644**, *JAMA* 331(8):654) | pool prospectif, n=316 (195 chir./121 méd.), suivi **jusqu'à 12 ans** | **Rémission (sans médoc ≥3 mois) 37,5 % vs 2,6 % (3 ans) → 18,2 % vs 6,2 % (7 ans) → 12,7 % vs 0 % (12 ans)** ; ΔHbA1c 12 ans −1,1 % (p=0,002). **Décès : 4 au total (2/bras), NS ; MACE NS (sous-puissancés)**. = **plus long suivi RANDOMISÉ**, critère **substitut** ; extension de facto observationnelle. | rémission ECR — **modéré** ; dur = **non évaluable** |
| ★ SOS mortalité (17715408 · 10.1056/NEJMoa066254, *NEJM* 2007) | **cohorte NON randomisée**, n=4047 obèses (pas seulement DT2), ~10,9 ans | mortalité toutes causes **5,0 % vs 6,3 % ; HR ajusté 0,71 (p=0,01)** ; NNT ~76/11 ans. | **DUR mais OBSERVATIONNEL — faible** |
| ★ SOS événements CV (22215166 · 10.1001/jama.2011.1914, *JAMA* 2012) | idem, médiane 14,7 ans | décès CV **HR 0,47 (0,29-0,76)** ; IDM/AVC **HR 0,67 (0,54-0,83 ; p<0,001)**. | DUR OBSERVATIONNEL — faible |
| SOS espérance de vie (33053284 · 10.1056/NEJMoa2002449, *NEJM* 2020) | idem | **+3,0 ans (IC 1,8-4,2)** ; mortalité HR 0,77 (0,68-0,87) ; mort. 90 j **0,2 %**. | DUR OBSERVATIONNEL — faible |
| Méta survie Syn (33965067 · 10.1016/S0140-6736(21)00591-2, *Lancet* 2021) | **méta de cohortes (PAS d'ECR)**, 174 772 sujets | mortalité **↓ 49,2 % (IC 46,3-51,9) ≈ HR 0,51** (red-team B2 ; **PAS 0,53/0,61**) ; **+6,1 ans (5,2-6,9)** ; **DT2 +9,3 ans (7,1-11,8)** (confirmé, attribué à Syn). | DUR pooled OBSERVATIONNEL — faible-modéré |

**Seuils IMC (consensus DSS-II, Rubino, *Diabetes Care* 2016, PMID 27222544, co-endossé ADA)** : recommandée
si **IMC ≥ 40** ; **35-39,9** si hyperglycémie mal contrôlée ; **à considérer 30-34,9** si mal contrôlé malgré
traitement optimal (−2,5 pour populations asiatiques). **Sécurité** : mortalité périop ~0,2 % mais morbidité
durable (carences, réinterventions, dumping, hyperparathyroïdie). **Ligne de fracture EBM** : **rémission =
vrais ECR** (STAMPEDE/Mingrone/ARMMS-T2D, NNT 2-6 ; **ARMMS = plus long suivi randomisé mais substitut,
décès/MACE NS sous-puissancés**) ; **critères durs = OBSERVATIONNEL uniquement** (SOS + Syn + **Aminian** MACE
HR 0,61 + **Fisher** macrovasc. HR 0,60 + **SOS-DT2** microvasc. HR 0,44) — **aucun ECR de mortalité/CV**.
**Reco périmètre (agent)** : option **« orientation, à discuter » bornée par l'IMC** +
note statique (rémission ECR vs dur observationnel ; seuils DSS-II ; sécurité). → **arbitrage §8-1**.

### SOUS-DOSSIER H5 — Recommandations officielles & divergence

| Source | MHD 1re ligne / socle ? | Objectif perte de poids | Rémission = objectif ? | Chirurgie (IMC) |
|---|---|---|---|---|
| **HAS 2024** (fiche mémo, validée 30/05/2024 ; **B3 lu en primaire**) | **OUI** (socle indispensable, 1re intention, maintenu — **grade B/C**) | **« au moins 5 % » au diagnostic (grade AE)** + « toute perte au-delà bénéfique » | **Mentionnée** (R.123, AE) mais **NON posée en objectif** (citée pour prévenir : rémissions « seulement transitoires » → surveillance) | **Abordée** (§4.2, R.122-123, AE) : « discuté individuellement », renvoi RBP FR ; **métabolique IMC 30-<35 chez le diab.**, bariatrique ≥35 avec complications / ≥40 |
| **SFD 2025** (Darmon, *Méd. Mal. Métab.* 2025;19(8):630-662 ; **lu en primaire** ; avis d'experts, **sans grade**) | **OUI** (Avis n°8/14, socle ; réf. HAS 2024) ; **méditerranéen recommandé** | **≥ 5 %** (obésité, Avis 14) ; **> 10 %** (hépatique MASLD, Avis 15) — *pas* de « 7 %/IMC<25 » (erreur secondaire corrigée) | **OUI mais CHIRURGICALE seulement** (Avis 14bis) — **pas** de rémission par diète/TDR (régime sévère = préop. « sans niveau de preuve ») | **≥ 40 ; ≥ 35 + comorbidité (dont DT2) ; 30-34,9 au cas par cas après échec médical ≥ 12 mois** (Avis 14bis, per HAS 2024) |
| **CMG** | **OUI** (socle, MG coordinateur) | `[À VÉRIFIER]` (align. HAS) | `[À VÉRIFIER]` | Non traité |
| **ADA/EASD 2022** (Davies, *Diabetes Care* 2022;45(11):2753 ; PMID `[À VÉR. 36148880]`) | **OUI** (weight management central) | **5-15 % « primary target »** ; 10-15 % = « disease-modifying » | **OUI, explicite** (diète type DiRECT + chirurgie) | **≥ 40**, ou **35-39,9** (−2,5 asiat.) |
| **ADA SoC 2026** (Chap. 8, *Diabetes Care* 2026;49(S1):S166) | **OUI** | **5-7 %** ; viser toute magnitude | via chirurgie surtout | **≥ 30** (≥ 27,5 Asian Am.) `[À VÉR.]` |
| **Prescrire P1** (févr. 2026) | **OUI** (avant metformine) | **5-10 %** | **Non** | Non centrale ; objectif = complications CV |
| **Prescrire P2** (oct. 2006) | ⚠ **PRÉVENTION (prédiabète), hors nœud** | — | — | — |

**Reco officielle (synthèse — corrigée red-team B3)** : **consensus universel sur le socle MHD** (1re ligne,
permanent). Partage sur l'**ambition** : France **sobre** (HAS objectif « au moins 5 % », grade AE ; **aborde**
rémission & chirurgie mais **sans en faire des objectifs** — chirurgie « discutée individuellement », rémission
« possiblement transitoire → surveillance ») ; axe anglo-saxon (ADA/EASD 2022, ADA 2026) **perte de poids
5-15 %**, **rémission comme objectif explicite**, **chirurgie élargie** (IMC ≥ 30 en 2026). SFD ~7 %
(intermédiaire, **non confirmé en primaire**). **Position critique** (Prescrire / Minerva / Méd. Geek) :
objectif = **complications CV**, pas HbA1c/poids en soi ; rémission = **substitut** dont le bénéfice sur les
complications n'est **pas démontré** (Minerva sur DiRECT ; neutralité CV de Look AHEAD). **Nuance B3** : la
divergence est autant de **cadre** (obésité-maladie vs contrôle glycémique) que de chiffre — le chapitre
*diabète* de l'ADA 2026 converge lui-même vers **5-7 %** ; le récit ≥ 10-15 % domine surtout côté médicaments
anti-obésité.

## 4. Synthèse critique (reco officielle vs position raisonnée)

### Reco officielle

Socle MHD = **1re ligne et fond permanent** dans **tous** les référentiels (HAS 2024, SFD 2025, CMG, ADA/EASD
2022, ADA 2026, Prescrire). Objectif de perte de poids : **« au moins 5 % » (HAS, grade AE)** → **~7 %** (SFD,
non confirmé primaire) → **5-10 %** (Prescrire) → **5-15 %** (ADA/EASD 2022). **HAS 2024 aborde** la rémission
(R.123, pour la relativiser) et la chirurgie (R.122 ; métabolique IMC 30-<35 chez le diabétique) **mais sans en
faire des objectifs** ; **ADA/EASD 2022 érige la rémission en objectif** (dans les 6 ans du diagnostic) et
l'ADA 2026 **abaisse le seuil chirurgie à IMC ≥ 30**.

### Position critique (Prescrire, Minerva, Médicalement Geek) — affichée à côté

L'objectif thérapeutique reste **d'éviter les complications (surtout CV)**, pas la baisse d'HbA1c, du poids ni
l'atteinte d'une rémission *en soi*. Rémission, normalisation glycémique et perte de poids sont des **critères
de substitution** : le seul grand ECR à critère CV dur d'une intervention intensive sur le mode de vie
(**Look AHEAD**) est **neutre** ; **aucun ECR** ne démontre qu'atteindre une rémission (non chirurgicale) réduit
IDM/AVC/décès. Le **bénéfice CV dur** documenté se limite au **régime méditerranéen** (PREDIMED + **CORDIOPREV** — 2 ECR).

### Divergence — **oui** (partielle)

1. **Aucune divergence sur le principe** : socle MHD = consensus total (recos + EBM critique alignés).
2. **Ampleur cible de perte de poids** : 5 % (HAS) / ~7 % (SFD) / 5-10 % (Prescrire) **vs 5-15 % (ADA/EASD)**.
3. **Statut & VOIE de la rémission** : **objectif thérapeutique** (ADA/EASD 2022 ; **SFD 2025 mais par la
   CHIRURGIE seulement**) **vs substitut non validé sur critères durs** (Prescrire/Minerva). **⚠ Divergence sur
   la voie diététique** : l'**EBM (DiRECT/DIADEM-1, ebmfrance grade A) + ADA/EASD** soutiennent la **rémission
   par diète intensive**, que **SFD 2025 n'endosse PAS** (rémission confinée à la chirurgie ; TDR cité seulement
   en préop.). L'enthousiasme anglo-saxon **dépasse le niveau de preuve dur** ; HAS 2024 + Prescrire (objectif
   « complications ») restent proches de l'EBM critique. → **L'outil présente la voie diététique (EBM) à côté de
   la reco officielle FR (chirurgie), divergence signalée** (raison d'être de l'outil).
**Position raisonnée de l'outil** : *socle MHD (alimentation méditerranéenne + activité physique + perte 5-10 %)
recommandé à tous ; programme intensif de perte de poids visant la rémission proposé au DT2 récent motivé
(bénéfice réel mais substitut, non garanti, à ne pas survendre) ; chirurgie métabolique = orientation à
discuter selon l'IMC ; jamais de promesse de survie/événements CV pour la perte de poids (Look AHEAD).*

## 5. Vérification bi-agents (état 2026-07-23)

**Dispositif** : **Agent A (extraction) — 5 sous-dossiers reçus** (H1-H5, §3 consolidé) ; **Agent B (red-team,
vérif. PMID/DOI/chiffres vs source primaire) — B1 (H1+H2) REÇU**, B2 (H3+H4) & B3 (H5) en cours ; **OE 2ᵉ passe
(référent) — OE-H1/H2/H3 REÇUS**, OE-H4/H5 en attente. Réconciliation Opus finale après B2/B3 + OE-H4/H5.

**Consensus (A × B1 × OE, confirmé)** : (a) rémission non chir. réelle mais **substitut, érodable, sans preuve
dure RANDOMISÉE** ; (b) intervention intensive mode de vie **neutre sur le CV dur ET la mortalité** (Look AHEAD) ;
(c) bénéfice CV dur = **régime méditerranéen** (PREDIMED + **CORDIOPREV** — 2 ECR) ; (d) chirurgie = rémission
ECR + dur observationnel seulement.

### 5a. Red-team Agent B1 (H1+H2) — corrections appliquées / à appliquer

- **10/15 confirmés au chiffre près** ; aucun chiffre décisionnel majeur d'Agent A faux (problèmes = traçabilité
  PMID + prévention du spin).
- **Corrections PMID** : **Sleep AHEAD = 19786682** (le 19858109 pointait un article sans rapport) ; **déf.
  rémission version *Diabetes Care* = 34462270** (34459898 = version JCEM du même consensus, contenu identique).
- **DiRECT 2 ans, sous-groupe ≥ 15 kg** : « > 80 % » (communications DiRECT, **hors abstract**), **pas ~70 %** —
  chiffre de sous-groupe conditionnel, à contextualiser (pas ITT).
- **DiRECT-Aus** : **86/155** (dénominateur) ; variante déf. 3 mois = 55 % (85/155).
- **DiRECT 5 ans** : distinguer **13 % (11/85) vs 5 % (5/93)** (rémission transversale à 5 ans, extension vs
  contrôle) de **34 % vs 12 %** (proportion de *visites* en rémission, extension vs **non-extension**).
- **Look AHEAD mortalité (nouvellement sourcé)** : toutes causes **HR 0,85 (0,69-1,04 ; p=0,11)** [NEJM 2013,
  ~9,6 ans] ; CV **HR 0,88 (0,61-1,29 ; p=0,52)** — **non significatives** → verrouille le message anti-survie.
- **Spin confirmé** : Gregg 2016 (post-hoc, non causal) ; Virta « reversal 53,5 % » tolère la metformine (≠ Riddle,
  ne pas agréger) ; seul le 17,6 % Virta approche la déf. consensus.

### 5b. OE 2ᵉ passe (référent, OE-H1/H2/H3) — débroussaillage, à vérifier PRIMAIRE avant YAML

> OE = débroussaillage (`00-global.md` étape 4), **jamais source primaire**. Nouveaux essais & discordances
> ci-dessous marqués `[à vérifier primaire]` — red-team dédié requis avant encodage.

- **Nouveaux essais surfacés par OE (haute valeur, `[à vérifier primaire]`)** :
  - *H1* — **DIADEM-1** (Taheri, *Lancet Diab Endo* 2020, DT2 ≤ 3 ans, jeunes MENA) rémission **61 % vs 12 %** à
    1 an, NNT ~2 [PMID à confirmer] → **2ᵉ ECR de rémission** ; **U-TURN** (Ried-Larsen 2019, DOM ; exercice+diète,
    n=98) rémission **37 % vs 10 %** à 1 an, soutenue 23 % vs 7 % [PMID à confirmer] → levier **exercice** ;
    **Gregg 2024** (*Diabetologia*, PMID ~38233592) — *dans* Look AHEAD, rémission → CVD **HR 0,60 (0,47-0,79)** /
    CKD 0,67 mais **ASSOCIATION OBSERVATIONNELLE** (confusion par indication) — nuance « aucune donnée dure » sans
    l'infirmer (non causal) ; **Kanbour 2025** (méta-régression, *Lancet Diab Endo*) — **perte de poids =
    prédicteur dominant** ; après ajustement, **ancienneté PLUS indépendamment associée** (→ input §8-2) ;
    **Wu 2024** (Hong Kong, réel, PMID ~38261560) — 6,1 % rémission en vie réelle, **67 % de rechute** à ~3,1 ans.
  - *H3* — **CORDIOPREV** (Delgado-Lista, *Lancet* 2022, PMID ~35525255 ; n=1002, ~50 % DT2, prévention
    **secondaire**) composite CV **HR 0,72 (0,54-0,96), NNT ~20/7 ans** → **2ᵉ ECR** de bénéfice CV dur du régime
    méditerranéen (renforce fortement le socle) ; **Basterra-Gortari 2019** (sous-groupe diab. PREDIMED, PMID
    ~31182491) MedDiet+EVOO retarde le 1er hypoglycémiant **HR 0,78 (0,62-0,98)** ; **PREDIMED-Plus** — critère
    CV dur **toujours non publié** (confirme le flag) mais **incidence de diabète HR 0,69 (0,59-0,82)** à 6 ans
    (Ruiz-Canela 2025, PMID ~40854218) ; réseau exercice (**Liang 2024**, *Sports Med*, HIIT ΔHbA1c −0,78 %).
- **Discordances à trancher (red-team primaire)** :
  - **Look AHEAD mortalité toutes causes** : B1 **0,85 (0,69-1,04)** [NEJM 2013, ~9,6 ans] vs OE **0,91
    (0,81-1,02) p=0,11** [*Diabetes Care* 2022, **16,7 ans**] → **deux horizons** ; citer l'extension 16,7 ans
    (0,91) comme définitive, intérim noté. (Non significatif dans les deux cas.)
  - **PREDIMED PMID republication 2018** : OE = **29897866** (article) vs 29897867 (avis) — B2 confirme.
  - **DiRECT 5 ans PMID** : garder **38423026** (A + B1) ; inline OE « 38309740 » douteux.
  - **PREDIMED HR combiné** : 0,70 (0,55-0,89) [OE] vs 0,71 (0,56-0,90) [A] — B2 tranche (écart mineur).

### 5c. Red-team Agent B3 (H5 recos) — REÇU (⚠ correction majeure)

- **⚠ HAS 2024 n'est PAS muette sur rémission/chirurgie** (lue en primaire, fiche mémo 30/05/2024) : elle
  **aborde les deux sans en faire des objectifs** — §4.2 chirurgie bariatrique/métabolique (R.122-123, AE :
  « discuté individuellement », renvoi RBP FR ; **métabolique IMC 30-<35 chez le diab.**, bariatrique ≥ 35 avec
  complications / ≥ 40) ; **rémission nommée** (R.123) mais **pour la relativiser** (« seulement transitoires »).
  → **INTERDIT au YAML** : « HAS ne parle pas de rémission/chirurgie ». §3/§4 corrigés.
- **Objectif poids HAS** = « **au moins 5 %** » (grade AE) + « toute perte au-delà bénéfique » ; **socle grade B/C**.
- **ADA/EASD 2022 confirmé verbatim** (PMC10008140, **PMID 36148880** — *OE cite 36202527, écarté*) : 5-15 % ;
  10-15 % « disease-modifying » → rémission (DiRECT + chirurgie) ; chirurgie ≥ 40 / 35-39,9. **ADA SoC 2026** :
  5-7 % glycémie ; **chirurgie IMC ≥ 30** (≥ 27,5 Asian Am.).
- **NON-ATTEINT en primaire (à demander au référent)** : **SFD 2025** (payant, *Méd. Mal. Métab.* 2025;19(8):630-662 ;
  secondaires discordants « IMC < 25 et/ou > 7 % » vs « 5-15 % ») ; **CMG** (pas de position chiffrée autonome).
- Nuance : divergence de **cadre** (obésité-maladie vs contrôle glycémique) autant que de chiffre.

### 5d. Red-team Agent B2 (H3+H4) — REÇU (corrections chiffrées, appliquées §3)

- **Méta Syn (mortalité)** : PAS « HR 0,53 (0,46-0,61) » → **↓ 49,2 % (IC 46,3-51,9) ≈ HR 0,51** ; +6,1 ans
  (5,2-6,9) ; **DT2 +9,3 ans (7,1-11,8)** confirmé (attribué à Syn).
- **PREDIMED** : **PMID article republié = 29897866** (29897867 = avis) ; **HR noix 0,72 (0,54-0,95)** (pas 0,96) ;
  **HR combiné 0,70/0,71 HORS abstract** → `[À VÉRIFIER — corps, paywall]` ; **ARR ≈ 1,3-2,1/1000 p-a** → **NNT
  ≈ 120/5 ans** (écarter ~67) ; **sous-groupe diabétiques (HR + P-int 0,63) NON-VÉRIFIABLE** (paywall) ; % diab.
  ≈ 52 % (déduit). *(À ne pas confondre avec la sous-étude prévention du diabète incident, PMID 24573661, HR 0,60.)*
- **Umpierre : PMID = 21540423** (21525503 = Chudyk & Petrella). **SOS espérance de vie +3,0 ans (IC 1,8-4,2)**.
- **PREDIMED-Plus** : critère CV dur **NON PUBLIÉ** (confirmé). **Confirmés verbatim** : STAMPEDE, Mingrone,
  Ikramuddin, SOS mortalité/CV, DSS-II, Esposito (HR ajusté 0,70), Boulé, Sigal.

### 5e. OE 2ᵉ passe complète (OE-H1→H5 reçus) — triangulation & nouveaux essais `[à vérifier primaire]`

- **OE-H4/H5 reçus** corroborent A × B (STAMPEDE, Mingrone, SOS, HAS / ADA-EASD / ADA 2026). **Nouveaux essais
  chirurgie à red-teamer en primaire** : **ARMMS-T2D** (pool d'ECR — Kirwan 2022 *Diabetes Care* ~35320365 ;
  Courcoulas 2024 *JAMA* ~38319329) rémission **37,5 % vs 2,6 % (3 ans) → 12,7 % vs 0 % (12 ans)** = plus long
  suivi randomisé ; **Aminian 2019** (*JAMA* ~31475297, obs.) MACE **HR 0,61** ; **Fisher 2018** (*JAMA* ~30326125,
  obs.) macrovasc. **HR 0,60** ; **SOS sous-groupe DT2** rémission 72,3 % (2 ans) / 30,4 % (15 ans), microvasc.
  **HR 0,44**, macrovasc. **HR 0,68**, +2,1 ans d'espérance de vie. Seuils : **AACE 2025**, **ASMBS/IFSO** (≥ 30 si
  cardiométabolique) — tendance à l'abaissement.
- **Nouveaux essais H1/H3** (OE-H1/H2/H3, déjà listés 5b) : DIADEM-1, U-TURN, Gregg 2024 (obs. HR 0,60), Kanbour
  2025 (perte de poids = prédicteur dominant ; ancienneté non indépendante → **§8-2**), Wu 2024 (réel : 6,1 % ;
  67 % rechute), CORDIOPREV (2ᵉ ECR MedDiet, HR 0,72), Basterra-Gortari 2019, PREDIMED-Plus (incidence diab. HR 0,69).
- **Discordance Look AHEAD mortalité tranchée** : donnée définitive = **extension 16,7 ans HR 0,91 (0,81-1,02)
  p=0,11** (*Diabetes Care* 2022, PMID ~35312758) ; intérim NEJM 2013 (~0,85) noté. **NS dans les deux cas** →
  message anti-survie inchangé. (§3 H2 corrigé.)
- **⚠ RÈGLE** : ces essais OE = **débroussaillage** ; PMID/chiffres **non figés** tant que non vérifiés en
  primaire (red-team dédié). N'entrent au YAML qu'après ça + arbitrages §8.

### 5g. Red-team PRIMAIRE des nouveaux essais OE (B4/B5) — REÇU ✅

Tous vérifiés en primaire (Europe PMC verbatim). **PMID corrigés (essais confirmés au chiffre)** :

- **Chirurgie (B5)** : Courcoulas ARMMS-T2D **38411644** (≠ 38319329) · Fisher **30326126** (≠ 30326125) ·
  Sjöström SOS-DT2 **24915261** (≠ 24915262) — OE citait des **articles adjacents du même numéro** (vol/pages
  corrects). Confirmés : Kirwan 35320365, Aminian 31475297, Carlsson 37438611, ASMBS/IFSO 36280539, AACE 40956256.
- **Rémission/diète (B4)** : DIADEM-1 **32445735** · U-TURN JAMA **28810024** & rémission Ried-Larsen **31168922**
  (≠ 31182491) · Gregg 2024 **38233592** · Kanbour **40023186** · Wu **38261560** · CORDIOPREV **35525255** ·
  Basterra-Gortari **31182491** · PREDIMED-Plus incidence **40854218**.
- **⚠ U-TURN — caveat décisionnel** : la rémission soutenue **23 % vs 7 %** repose sur un **critère primaire NON
  significatif** en complete-case (OR 4,4 ; **p=0,08**), significatif seulement sous imputation (p=0,048, IC inf.
  =1,0). Le « 37 % vs 10 % à 12 mois » d'OE est **NON-VÉRIFIABLE** (retiré). → signal **fragile** (n=98, mono).
- **Kanbour → §8-2** : « ancienneté non indépendante » **confirmé verbatim**, MAIS conclusion **écologique**
  (méta-régression inter-essais) — l'ancienneté garde une plausibilité biologique (réserve β-cellulaire).
- **Durs (Gregg/Wu/Aminian/Fisher/SOS-DT2) = observationnels** ; **CORDIOPREV = 2ᵉ preuve DIÈTE→CV dur
  randomisée** (avec PREDIMED). §3 mis à jour (rows DIADEM-1, U-TURN, CORDIOPREV, ARMMS-T2D + message H4).

### 5f. Restes à obtenir

- **SFD 2025** : ✅ **obtenue et lue en primaire** (`sources/SFD 2025.pdf` — Darmon et al., *Méd. Mal. Métab.*
  2025;19(8):630-662, DOI 10.1016/j.mmm.2025.10.002) → intégrée §3/§4/§7. **Correction** : « ~7 %/IMC<25 »
  (synthèse secondaire) était faux → réel = **≥ 5 % (obésité) / > 10 % (hépatique)** ; **rémission = chirurgie
  seulement** (pas de voie diète/TDR). Conflits d'intérêt déclarés (comme nœud F).
- **Encore à obtenir (mineur, non bloquant)** : position **CMG** (si elle existe) ; texte intégral **PREDIMED**
  (sous-groupe diabétiques CV + HR combiné — paywall).
- **Arbitrages §8** : **8-1/2/3/4 TRANCHÉS** ; **8-5/6/7** = défauts Opus proposés (à confirmer) — dont **8-6
  (voie diète-rémission EBM vs SFD chirurgie-seule)**. → puis §7 YAML réel + encodage.

### 5h. Vérification d'encodage bi-agents (étape 8, 2026-07-24) — 0 finding HAUTE

Encodage : `content/noeuds/diabete-type-2/rhd.yaml` (brouillon v0.1) + `rhd.argumentaire.md` (niveau 3).
Validation technique : Ajv 6/6, suite 123/123, build OK, traçage jetable de 4 profils + red-team 18 profils sur
le **vrai** `evaluateNode`.

- **Agent A (fidélité)** : 0 HAUTE, 3 MOYENNE + 3 BASSE. **Corrigés** : M1 (PREDIMED → HR par bras **0,69/0,72**,
  sous-groupe diabétique **non vérifiable** en primaire, plus « ~0,70 cohérent ») ; M2 (Esposito **HR 0,63** brut
  / **0,70** ajusté poids) ; M3 (chirurgie : **« exclusivement »** et non « surtout » observationnel) ; B2
  (références ajoutées : DiRECT 2 ans, Mingrone, ARMMS-T2D, Gregg 2024) ; B3 (nuance **HAS 2024 R.122/R.123** dans
  `reco_officielle`). **B1** (chirurgie `IMC≥35` sans branche 30-34,9 « mal contrôlé ») = limitation documentée,
  sans correction (H ne collecte pas d'indicateur de contrôle glycémique).
- **Agent B (red-team moteur)** : 18 profils (10 exigés + 8 frontières), **0 `ConditionError`**, **0 HAUTE /
  0 MOYENNE / 2 BASSE** (documentées). Confirmé : socle toujours présent (bug metformine évité, D16) ; perte de
  poids ssi `IMC≥27` (frontière 26,9/27) ; alertes rémission `<6`/`≥6` **exclusives et couvrantes** (frontière
  6,0) ; hypo = OR déclenché isolément pour insuline/SU/glinide, **pas** gliptine (match exact de liste) ;
  modulateurs n'excluent **jamais** d'option ; aucun gain de survie/CV promis.
- **Post-correction** : 123 tests + build OK. **RESTE : validation clinique finale du référent → `meta.statut:
  valide` + commit.**

## 6. Incertitudes

- **Rémission = substitut** : bénéfice micro/macrovasculaire et sur la mortalité **non établi** pour la
  rémission **non chirurgicale** (seul signal exploratoire : moins d'EIG hospitalisés, DiRECT 5 ans).
- **Durabilité** : la rémission s'érode fortement (46 → 13 % à 5 ans, DiRECT) — dépendante du maintien pondéral.
- **Seuils** de la fenêtre rémission : DiRECT = IMC 27-45 / ancienneté < 6 ans ; **ReTUNE** montre une rémission
  à IMC « normal » → généralisation des seuils à trancher (§8-2).
- **Périmètre chirurgie métabolique** (option d'orientation / note / hors nœud) — §8-1.
- **Sémantique de `motivation` / `capacite_activite`** — gating vs modulation d'affichage (§8-4).
- **Objectif de perte de poids** : 5-10 % (socle HAS/Prescrire) vs ≥ 15 % (« disease-modifying » / rémission
  ADA/EASD) — deux paliers à articuler (§8-3).
- **PREDIMED-Plus** : critère CV dur en attente ; robustesse de PREDIMED entamée par la rétractation 2018.

## 7. → YAML (contenu distillé — brouillon v0.1, à ENCODER après validation référent)

Nœud **multi-options** = **recommandations empilées** (outil d'aide à la recommandation, §0). Décisions §8
appliquées ; chiffres red-teamés (§3/§5).

**Critères d'entrée** : `IMC` (nombre). **Modulateurs** (n'excluent jamais — §8-4) : `motivation` (bool),
`capacite_activite` (bool), `alimentation_equilibree` (bool), `activite_physique_reguliere` (bool).
`anciennete_diabete_annees` (nombre) = **NON gating** — sert au message d'`effet_attendu` de l'option 2 (§8-2).

- **Option 1 — Recommandation socle (POUR TOUS)** — `conditions: ["toujours"]` (D16).
  *Recommander* alimentation méditerranéenne + activité physique adaptée + objectif **≥ 5-10 %** de perte si
  surpoids/obèse. `effet_attendu` : **CV — régime méditerranéen** (PREDIMED HR 0,69/0,72 ; CORDIOPREV HR 0,72,
  NNT ~20/7 ans) ; **HbA1c ~−0,6 %** (activité, Umpierre/Boulé) ; report du 1er hypoglycémiant (Esposito HR 0,63).
  `niveau_preuve` : CV méditerranéen = **modéré** ; HbA1c/activité = **modéré** (substitut). **Modulation** :
  `capacite_activite==false` → activité *adaptée* ; `alimentation_equilibree`/`activite_physique_reguliere==true`
  → « maintenir/renforcer », bénéfice additionnel moindre ; `motivation==false` → objectifs modestes négociés.
- **Option 2 — Recommandation renforcée de perte de poids (visée rémission)** — `conditions: IMC >= 27`.
  *Informer* du potentiel de rémission + recommander **≥ 10-15 % / ≥ 10-15 kg** de perte + **orienter** vers un
  accompagnement structuré (hors MG). `effet_attendu` : **rémission** ~46 % (1 an) / ~36 % (2 ans) / ~13 %
  (5 ans) DiRECT ; 61 % (1 an) DIADEM-1 ; **dose-dépendante du maintien** (64 % si ≥ 10 kg). **Modulé par
  `anciennete_diabete_annees`** : élevé si < 6 ans (fenêtre DiRECT/DIADEM-1), décroissant ensuite → au-delà,
  reframer « amélioration du contrôle ». `niveau_preuve` : **modéré** (substitut). **Contre-message obligatoire** :
  rémission ≠ guérison ; **pas de gain de survie/CV** (Look AHEAD HR 0,95 ; mortalité 0,91 NS).
- **Alertes (D15)** :
  - (a) **Chirurgie métabolique — « y penser »** (§8-1) : `IMC >= 35 OR (IMC >= 30 AND diabète mal contrôlé)`
    → orienter en soins spécialisés (ebmfrance **grade A** ; rémission ECR STAMPEDE/Mingrone/ARMMS-T2D ;
    bénéfice dur **observationnel seul** — SOS/Aminian/Fisher).
  - (b) **Rémission ≠ guérison** → surveillance à vie (rechute : Wu 67 % à 3 ans ; DiRECT 46→13 %).
  - (c) **Perte de poids sous insuline/SU** → risque hypo, anticiper l'allègement (renvoi C/D/E) *[§8-5, défaut Opus]*.
  - (d) **Sujet âgé/fragile/dénutri** → maintien musculaire, pas de restriction agressive.
  - (e) **Look AHEAD** → l'intervention intensive n'a pas réduit CV/mortalité : pas de promesse de survie.
- `reco_officielle` : socle MHD = **consensus** (HAS 2024 grade B/C ; **SFD 2025 [extraction en cours]** ;
  ADA/EASD 2022 ; ebmfrance grade A ; Prescrire P1). **`divergence: true`** sur (1) l'ampleur de perte de poids
  (5 % HAS vs 5-15 % ADA/EASD) et (2) le statut « objectif » de la rémission (ADA/EASD = objectif ;
  Prescrire/Minerva = substitut non validé sur critères durs). HAS 2024 aborde rémission (R.123, pour la
  relativiser) + chirurgie (R.122, IMC 30-<35).
- **`argumentaire.md`** (niveau 3) : reprendra §3 (matrices par option) + §4 (divergence) + garde-fous de voix §5.

*(Reste avant encodage réel : intégrer l'extraction SFD 2025 dans `reco_officielle` ; confirmer §8-5/6/7
[défauts Opus proposés] ; puis écrire `content/noeuds/diabete-type-2/rhd.yaml` + `.argumentaire.md`, valider
Ajv + vitest + build, et vérif. encodage bi-agents étape 8.)*

## 8. Arbitrages référent (état 2026-07-24)

> **Recadrage structurant (référent 2026-07-24)** : en **médecine générale**, le nœud H est un **outil d'aide
> à la RECOMMANDATION** (le MG recommande / informe / oriente ; il ne délivre pas de programme intensif). Les
> « options » sont des **recommandations adaptées présentant les bénéfices attendus**, pas des prestations.
> Répercuté dans §0 / §1 / §2 / §7.

1. **Périmètre chirurgie métabolique** — **TRANCHÉ (référent 2026-07-24) : NOTE conditionnée par l'IMC (« y
   penser »)**, PAS une option interrogeable ni une prescription. Encodage = **alerte (D15)** :
   `IMC >= 35 OR (IMC >= 30 AND diabète mal contrôlé malgré traitement optimal)` → message « penser à discuter
   une évaluation de chirurgie métabolique en soins spécialisés ». **Base EBM** : ebmfrance/Duodecim **grade A**
   (« chirurgie envisageable dès IMC 30-35 après échec du traitement conservateur »,
   `sources/Traitement global…pdf` p. 6, 8) + DSS-II/ASMBS-IFSO/ADA 2026 (seuils). Décision finale = soins
   spécialisés (hors outil).
2. **Seuils de la fenêtre rémission** — **VALIDÉ RÉFÉRENT (2026-07-24)** : **ne PAS faire de
   `anciennete < 6` un gate dur.** L'EBM (Kanbour 2025, confirmé red-team) : après ajustement sur la perte de
   poids, **l'ancienneté n'est plus un prédicteur indépendant** ; ReTUNE montre une rémission hors fenêtre. →
   **gater l'option `programme intensif` sur le seul levier actionnable `IMC >= 27`** ; porter l'ancienneté
   dans le **message d'`effet_attendu`** comme **modulateur de probabilité** (rémission ~46-61 % si < 6 ans,
   décroissante ensuite, déterminant = ampleur de perte de poids) ; au-delà de la fenêtre, reframer
   « rémission » → « amélioration du contrôle / allègement médicamenteux ». *(Cohérent avec la règle
   « granularité si EBM » : pas de seuil d'ancienneté EBM-validé → ne pilote pas le moteur.)*
3. **Objectif de perte de poids** — **VALIDÉ RÉFÉRENT (2026-07-24)** : **pas un critère d'entrée**
   (c'est un objectif de sortie). Deux paliers rattachés chacun à son option (couche `effet_attendu`) :
   **socle → ≥ 5-10 %** (contrôle glycémique/FDR) ; **programme intensif → ≥ 10-15 % / ≥ 10-15 kg** (magnitude
   associée à la rémission, DiRECT/Kanbour). Nuance : bénéfice diète/activité **même sans atteindre la cible**
   (ebmfrance grade A) ; ~6 % (Look AHEAD) = contrôle, pas bénéfice dur.
4. **`motivation` / `capacite_activite` / marge de manœuvre** — **VALIDÉ RÉFÉRENT (2026-07-24) : (B) MODULATION
   d'affichage** (jamais de gating dur — une recommandation n'est pas retirée, son libellé/bénéfice s'adapte).
   **+ AJOUT « marge de manœuvre »** (`alimentation_equilibree`, `activite_physique_reguliere`) : un patient qui
   a **déjà** une alimentation équilibrée et une activité importante a une **marge de manœuvre MHD faible** →
   recommandation « maintenir/renforcer » + **bénéfice additionnel moindre** ; réorienter vers d'autres leviers
   si le contrôle reste insuffisant. Toutes ces variables **modulent le message**, aucune n'exclut d'option.
5. **Alerte hypoglycémie** (perte de poids sous insuline/SU) — **TRANCHÉ (2026-07-24) : conservée dans H**
   (alerte D15), avec renvoi aux nœuds C/D/E pour l'allègement.
6. **Objectif « rémission » — ligne de voix** — **TRANCHÉ (2026-07-24) : on garde l'option EBM (rémission par
   la diète, DiRECT/DIADEM-1) et on SIGNALE la divergence** avec la SFD 2025 (qui confine la rémission à la
   chirurgie). Voix : rémission = **objectif réaliste mais non garanti** (substitut ; jamais de promesse de
   survie/CV — Look AHEAD) ; voie diététique **affichée** (EBM + ebmfrance grade A + ADA/EASD), reco officielle
   FR (chirurgie) présentée à côté, `divergence: true`.
7. **Textes Prescrire** — **TRANCHÉ (2026-07-24)** : 5 articles supplémentaires fournis par le référent
   (`Downloads/prescrire 9-13.pdf`) → **résumés critiques ajoutés à `sources/prescrire-dt2.md`** (P9-P13),
   dans le respect du droit d'auteur (résumé + réf., jamais l'intégral).

**Sources ajoutées le 2026-07-24 (fournies par le référent, dans `sources/`)** :
- `Traitement global et suivi du diabète de type 2 _ ebmfrance.pdf` — guide EBM **européen (Duodecim)**
  contextualisé (⚠ **pas** une reco française : renvoie à HAS 2024). Ancrages **grade A** : MHD 1re ligne/socle
  permanent, médicament interruptible si le mode de vie suffit ; **rémission par mode de vie permanent (grade A,
  à annoncer au patient)** ; **chirurgie bariatrique dès IMC 30-35 après échec conservateur (grade A)**. **Aucun
  objectif chiffré de perte de poids** ; régime méditerranéen non cité ; activité physique ~30 min × 5/sem.
- `rapport_gtg_glucides_sfd.pdf` — **SFD Paramédical + AFDN, 2016**, « Regard nouveau sur les glucides » :
  **strictement nutritionnel** (index glycémique vs « sucre lent/rapide », matrice/NOVA, « diversifier +
  réduire les graisses » chez le DT2 sous traitement oral). **Ne traite ni perte de poids, ni rémission, ni
  chirurgie** ; non gradé, pas de recommandations numérotées. → alimente le **socle diététique** de l'argumentaire.
- **⚠ Trou persistant** : la reco **SFD 2025** (stratégie poids/rémission/chirurgie) reste **non couverte en
  primaire** ; ni ce rapport glucides 2016 ni le guide européen ne la remplacent. `sources/…insulinothérapie…pdf`
  archivé pour le **nœud E**.

## Annexe — Prompts OpenEvidence (débroussaillage référent, 2ᵉ passe)

5 prompts (OE-H1 à OE-H5) à lancer dans OpenEvidence **en parallèle** des agents A (triangulation A × B × OE,
`00-global.md` étape 4). **OE = débroussaillage, jamais source primaire** ; tout PMID/DOI/chiffre renvoyé sera
re-vérifié contre la source primaire au red-team. Chaque prompt exige explicitement l'effet **absolu / NNT-NNH
(+ horizon)**, la distinction **critère dur vs substitution**, et une appréciation **GRADE**.

### OE-H1 — Rémission du DT2 par perte de poids (interventions non chirurgicales)

> In adults with **established type 2 diabetes**, does an **intensive non-surgical weight-loss programme**
> (structured low-calorie / total diet replacement + weight-loss maintenance, e.g. **DiRECT**, **DROPLET**,
> **ReTUNE**) induce **diabetes remission**? Report, per trial (with **PMID/DOI, year, journal**):
> randomised design, population (BMI range, **diabetes duration**), intervention, comparator, follow-up.
> Give the **remission rate** at **12 and 24 months (and beyond)** as an **absolute proportion per arm**
> and **absolute difference / NNT** — using the **consensus definition of remission** (HbA1c < 6.5 % ≥ 3
> months after stopping glucose-lowering drugs; state the definition each trial used). Report **durability**
> and **predictors** (baseline weight loss achieved, diabetes duration). Explicitly separate **remission
> (a surrogate/intermediate state)** from **hard outcomes** (CV events, mortality, microvascular): is there
> any hard-outcome evidence for remission itself? Note weight change, HbA1c, medication withdrawal, and
> **adverse effects**. Give a **GRADE** appraisal. Flag any figure you cannot source to a primary trial.

### OE-H2 — Intervention intensive sur le mode de vie & critères DURS (Look AHEAD)

> In adults with type 2 diabetes, does an **intensive lifestyle intervention** for weight loss reduce
> **hard cardiovascular outcomes** and **all-cause mortality**? Focus on **Look AHEAD** (**PMID/DOI, year**):
> primary composite CV endpoint result (was it significant? was the trial **stopped for futility**?),
> all-cause and CV mortality, absolute event rates per arm, HR/IC, follow-up. Then report the **secondary /
> post-hoc** findings: weight loss, HbA1c, **remission** (Gregg 2012, *JAMA*), the **post-hoc ≥ 10 % weight
> loss** analysis (Gregg 2016, *Lancet Diabetes Endocrinol*) and non-CV benefits (sleep apnoea, mobility,
> quality of life, retinopathy, nephropathy, depression, healthcare costs). Be explicit that the **primary
> hard CV endpoint was neutral** and clearly label which outcomes are **hard** vs **surrogate/post-hoc**.
> Give a **GRADE** appraisal. Flag any unsourced figure.

### OE-H3 — Régime méditerranéen & activité physique (CV vs HbA1c)

> In adults with type 2 diabetes (or including a diabetic subgroup), what is the effect of a **Mediterranean
> diet** and of **structured physical activity** on **cardiovascular events** and on **glycaemic control**?
> Cover **PREDIMED** (Estruch, *NEJM* — the **2018 re-analysis**; report the diabetic subgroup if available:
> major CV events, absolute rates, HR/IC, NNT, follow-up), **PREDIMED-Plus** (energy-restricted Med diet +
> activity: weight, glycaemia, CV), **Esposito** (Med diet delaying need for glucose-lowering drugs), and
> **exercise meta-analyses** (**Boulé**, **Umpierre**; resistance training **Sigal**) for the **HbA1c**
> effect (absolute %, IC). For each item give **PMID/DOI, year**, design, and clearly separate the **hard CV
> endpoint (PREDIMED)** from **surrogate endpoints (HbA1c, weight)**. Report adverse effects/feasibility.
> Give a **GRADE** appraisal per body of evidence. Flag any unsourced figure.

### OE-H4 — Chirurgie métabolique & rémission (cadrage de périmètre)

> In adults with type 2 diabetes and obesity, does **metabolic / bariatric surgery** induce **diabetes
> remission** and improve **hard outcomes**? Cover **STAMPEDE** (Schauer, *NEJM*; 1/3/5-year remission,
> glycaemic endpoints), **Mingrone** (*Lancet* 2021, 10-year), and the **SOS** study (Sjöström: long-term
> CV events and mortality — note it is **non-randomised/observational**). For each: **PMID/DOI, year**,
> design (RCT vs cohort), population (BMI thresholds), remission definition and **rate per arm (absolute +
> difference/NNT)**, durability, **hard CV / mortality outcomes**, and safety/complications. State the **BMI
> thresholds** used in guidelines/consensus (e.g. Diabetes Surgery Summit). Separate **RCT surrogate/remission
> evidence** from **observational hard-outcome evidence**. Give a **GRADE** appraisal. Flag unsourced figures.

### OE-H5 — Recommandations officielles & divergence critique

> What do **clinical guidelines** recommend for **lifestyle / weight management / remission** in established
> type 2 diabetes? Cover **HAS 2024** (France), **SFD 2025**, **Collège de la Médecine Générale (CMG)**, the
> **ADA/EASD 2022 consensus report** (weight management, remission targets, ≥ 15 % weight-loss goal), **ADA
> Standards of Care 2026** (Lifestyle/Obesity chapters), and **Prescrire** (positions P1 févr. 2026 and P2
> oct. 2006). Report, for each: is lifestyle the **first-line / permanent foundation**? what **weight-loss
> target** (5-10 % vs ≥ 15 %)? is **remission an explicit goal**, and by which means (diet, surgery)? place of
> **metabolic surgery** (BMI thresholds)? Then articulate the **divergence** between guideline enthusiasm for
> remission/aggressive weight loss and the **critical EBM view** (Prescrire, Médicalement Geek/DragiWebdo,
> Minerva): what is actually demonstrated on **hard outcomes** vs surrogates (recall **Look AHEAD** neutral on
> CV; remission = surrogate). Give **PMID/DOI or official URL** for each source. Flag anything unsourced.
