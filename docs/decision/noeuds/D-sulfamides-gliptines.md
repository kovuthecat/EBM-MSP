# Nœud D — Sulfamides / gliptines : place résiduelle   (dossier de preuve)

- **statut** : **ENCODÉ (brouillon v0.1) + VÉRIFIÉ BI-AGENTS ÉTAPE 8 (0 HAUTE / 0 MOYENNE) + CÂBLÉ DANS L'APP,
  2026-07-24**. Preuve triangulée A × OE × red-team B (§5c) ; décisions référent Q1-Q5 + disponibilité FR
  appliquées ; `content/…/sulfamides-gliptines.yaml` + argumentaire (Ajv + 137 tests + build OK, §5f) ; câblé
  (1 libellé `classes_a_benefice_indisponibles`, checklist `VALIDATION.md`). **Point hypo tranché référent
  (2026-07-24) : SU gardé en ALERTE MOLLE** (pas de gate dur). **Reste : validation clinique FINALE du référent
  → `meta.statut: valide`.**
- **version** : 0.1 · **date** : 2026-07-24 · **auteur** : Opus + référent (Thibault)
- **id YAML cible** : `sulfamides-gliptines` · domaine `diabete-type-2`
- **ordre pipeline** : dernier nœud du domaine DT2 (A → B → C → F → H → E → **D**). Cf. `CADRAGE-8-noeuds.md`.

## 0. Nature de ce dossier & périmètre (garde-fou méthodo)

Nœud D cadré (`CADRAGE-8-noeuds.md §D`) = **« quelle place RÉSIDUELLE reste-t-il pour les sulfamides (SU) et
les gliptines (inhibiteurs DPP-4) ? »**. Ces deux classes anciennes partagent un trait décisif : **aucun
bénéfice démontré sur un critère dur** (mortalité, événements CV, complications). Le nœud n'est donc **pas** un
nœud « quel traitement choisir pour son bénéfice » (c'est le rôle de B/C, pilotés par metformine + iSGLT2/aGLP1
à bénéfice prouvé), mais un nœud **« quand ces classes sans bénéfice gardent-elles une justification, et à
quelles conditions de sécurité »**. Il se lit en **aval** de B (1re intention) et C (intensification), qui
renvoient explicitement ici pour ne pas re-proposer une classe à bénéfice quand SU/gliptine sont en jeu.

**Quatre messages structurants attendus** (à étayer par la collecte) :

1. **Aucun bénéfice sur critère dur** pour les deux classes : les gliptines n'ont que des **CVOT de sécurité**
   (neutralité MACE, aucun gain) ; les SU n'ont **jamais** démontré de bénéfice CV ou de mortalité.
   `[À VÉRIFIER — collecte D1/D2]`
2. **Signal de danger propre aux gliptines** : la **saxagliptine augmente les hospitalisations pour
   insuffisance cardiaque** (SAVOR-TIMI 53), signal partiellement partagé par l'alogliptine — garde-fou dur
   « **jamais saxagliptine si IC** ». `[À VÉRIFIER — collecte D1]`
3. **Le vrai risque des SU = hypoglycémie + prise de poids**, **modulé par la molécule** (glibenclamide = pire ;
   gliclazide/glimépiride mieux) et par le **terrain** (âgé, insuffisance rénale). Rassurant côté CV vs
   comparateurs modernes (CAROLINA, ADVANCE, TOSCA.IT). `[À VÉRIFIER — collecte D2/D5]`
4. **Place résiduelle étroite** : SU = argument de **coût/accès** ; gliptine = niche de **tolérance**
   (orale, neutre sur le poids, très peu d'hypo, sans injection) quand les classes à bénéfice CV sont
   contre-indiquées / non tolérées / refusées / inaccessibles. **Jamais en choix préférentiel.** Divergence
   forte avec Prescrire, qui **écarte les gliptines quelle que soit la situation**. `[À VÉRIFIER — collecte D3/D4]`

Suit la pipeline `00-global.md` (Cadrer → Collecter → Apprécier → bi-agents → Distiller). Ce fichier fige les
**étapes 1-2** ; les §3-8 seront remplis par la collecte (5 agents A) + la vérification bi-agents (red-team B)
+ le débroussaillage OpenEvidence (annexe, prompts transmis au référent).

## 1. Question clinique & critères d'entrée (FIGÉ)

- **PICO** :
  - **P** = adulte DT2 (hors DT1, grossesse) chez qui se pose la question d'un **sulfamide** ou d'une **gliptine**
    (typiquement : metformine insuffisante et classes à bénéfice CV indisponibles/CI/refusées/coût ; ou
    déjà sous SU/gliptine à réévaluer).
  - **I** = prescrire (ou maintenir) un **sulfamide** ou une **gliptine**, à la bonne molécule et aux bonnes
    conditions de sécurité.
  - **C** = préférer une classe à bénéfice CV démontré (iSGLT2/aGLP1 — renvoi B/C) ; ou s'en abstenir.
  - **O = critères DURS** : mortalité totale, événements CV majeurs, **hospitalisation pour insuffisance
    cardiaque** (signal saxa), **hypoglycémie sévère** (risque SU) — **vs SUBSTITUTION** : baisse d'HbA1c.
    Le message central est que le **bénéfice dur est nul** pour les deux classes ; la décision se joue donc
    sur **sécurité + coût/accès + tolérance**, pas sur une efficacité clinique dure.

- **Variables d'entrée** (→ `criteres_entree`, cf. `CADRAGE-8-noeuds.md §D` + décisions référent §8, 2026-07-24) :
  - `traitements_en_cours` (liste enum) — pour ne pas re-proposer une classe en place et repérer un combo à
    risque (réutilisé de B/C).
  - **`classes_a_benefice_indisponibles` (bool) — NOUVEAU (décision référent Q2)** : les classes à bénéfice
    cardio-rénal (**iSGLT2 ET AR GLP-1**) sont **toutes deux contre-indiquées, non tolérées ou refusées**
    (le refus des injectables pour le GLP-1 est un motif possible ; l'iSGLT2 étant oral doit aussi être écarté).
    **C'est le déclencheur de la place résiduelle** : sans lui, on reste sur metformine + iSGLT2/aGLP1 (nœuds B/C).
  - `preference_injection` (enum accepte · refuse · indifferent) — **modulateur** (renforce la préférence orale
    → gliptine) ; réutilisé B/C/E. *(Ne déclenche pas D à lui seul : refus injectable + iSGLT2 disponible → iSGLT2.)*
  - `DFG` (nombre) — pilote l'adaptation rénale (SU : éviter glibenclamide, réduire dose, CI si DFG<30 ;
    **sitagliptine 100→50→25**). Seuils **figés d'après les RCP (§5d)** ; linagliptine « sans adaptation » =
    **indisponible FR (§5e)** (réutilisé B/C/E).
  - `risque_hypoglycemie_schema` (enum faible · eleve) — module fortement l'acceptabilité d'un SU
    (réutilisé A/C/E).
  - `insuffisance_cardiaque` (bool) — **garde-fou dur** « jamais saxagliptine **ni alogliptine** si IC »
    (AHA/ACC/HFSA 2022 Classe III ; corroboré ebmfrance « DPP4i not saxagliptin ») (réutilisé B/C).
  - **`contrainte_cout` RETIRÉ (décision référent Q1)** : le coût **n'est pas un critère en France** (SU et
    gliptines remboursés) — l'argument « coût/accès » du SU est **propre au système** (le flowchart Duodecim/
    ebmfrance le range en branche « price decisive » avec la mention explicite « Finnish reimbursement system »).
  - **`contexte_aigu` NON créé (décision §8-2)** : pas de base EBM sourcée pour un usage « positif » en aigu
    (l'énoncé ADA cortico-induit n'a pas été vérifié) ; au plus une alerte transversale.

- **Critères ÉCARTÉS (provisoire — à confirmer collecte/arbitrage)** :
  - `HbA1c_actuelle` : la décision D ne dépend pas d'un seuil d'HbA1c (l'intensification pilotée par l'HbA1c
    est le rôle de C ; D dit seulement *avec quoi* quand on tombe sur SU/gliptine). À confirmer §8.
  - `IMC` : pas de gating (les SU font prendre du poids — c'est un inconvénient affiché, pas un critère
    d'entrée).

## 2. Options envisagées (esquisse FIGÉE — molécules, seuils & chiffres à confirmer par collecte)

Structure **FIGÉE (décisions référent Q1-Q3, 2026-07-24)** : **multi-options** — un **socle de fond** `["toujours"]`
(« préférer metformine + iSGLT2/aGLP1 ») + **deux options résiduelles** déclenchées par le **même** critère
`classes_a_benefice_indisponibles == true`, **triées par `priorite`** : **gliptine avant sulfamide** (ordre
HAS/SFD iDPP4 > SU ; corroboré flowchart ebmfrance). Le coût n'entre plus (Q1). Elles ne sont **pas** exclusives :
les deux niches peuvent s'afficher, la gliptine en tête.

1. **Position de fond — ne pas privilégier SU ni gliptine** — `conditions: ["toujours"]` (socle, rang 0).
   Pas de bénéfice CV démontré → préférer metformine + classe à bénéfice (iSGLT2/aGLP1, renvoi B/C).
   `niveau_preuve` du *non-bénéfice* : élevé (CVOT concordants).
2. **Gliptine — place résiduelle « tolérance / anti-hypo, orale » (préférée, rang 1)** —
   `conditions: ["classes_a_benefice_indisponibles == true"]` (iSGLT2 ET GLP-1 tous deux CI/non tolérés/refusés).
   Niche : **pas d'hypo, neutre sur le poids, orale** (renforcée si `preference_injection == refuse`).
   **Molécule : sitagliptine** (seule à sécurité CV démontrée — TECOS ; génériques ; **remboursée FR**) — gliptine
   par défaut. **⚠ Disponibilité FR figée (§5e)** : **linagliptine et alogliptine JAMAIS commercialisées en France**
   (à retirer des options) ; **saxagliptine en retrait** (Komboglyze arrêté 30/01/2026) + signal IC → écartée.
   Garde-fou IC saxa/alo = **moot en pratique FR**. **`DFG` bas → sitagliptine à dose adaptée** (100→50 à DFG 30-44
   →25 <30, jusqu'en dialyse ; §5d) — **PAS linagliptine (indisponible FR)** ; alternative vildagliptine 50 mg/j.
   `niveau_preuve` du bénéfice : nul (neutralité) ; profil d'EI chargé à afficher (pemphigoïde, arthralgies FDA,
   pancréatite = signal significatif en méta).
3. **Sulfamide (gliclazide ou glimépiride) — place résiduelle « sécrétagogue oral » (derrière la gliptine, rang 2)** —
   `conditions: ["classes_a_benefice_indisponibles == true"]` — proposé **en aval** de la gliptine (quand celle-ci
   ne convient pas / effet glycémique plus fort recherché), en **assumant le risque d'hypo + prise de poids**.
   **Molécule : gliclazide MR ou glimépiride ; jamais glibenclamide.** Garde-fous : `risque_hypoglycemie_schema
   == eleve` (âgé/IRC) → prudence/déconseillé ; `DFG` bas → dose réduite, jamais glibenclamide. **Plus de gate
   `contrainte_cout`** (Q1). `niveau_preuve` du bénéfice : nul ; efficacité glycémique (substitution) nette.

**Alertes (D15) envisagées** (rappels/garde-fous, pas des options) :
- **Saxagliptine ET alogliptine + insuffisance cardiaque** → **contre-indication de prudence** (SAVOR-TIMI 53 :
  saxa HR 1,27 ; EXAMINE : alo post-hoc HHF **HR 1,76 [1,07-2,90]** chez les sans-IC ; **AHA/ACC/HFSA 2022 =
  Classe III Harm** pour les deux ; **sitagliptine & linagliptine neutres** — préférées).
  `[À VÉRIFIER — D1]`
- **Glibenclamide** → à éviter (hypo sévères/prolongées, surtout âgé/IRC) — préférer gliclazide/glimépiride.
  `[À VÉRIFIER — D2/D5]`
- **SU + sujet âgé / IRC / risque hypo élevé** → risque d'hypoglycémie sévère majoré : dose réduite, éducation.
  `[À VÉRIFIER — D5]`
- **Gliptine + IRC** → adapter la dose (sitagliptine/vildagliptine/saxagliptine) ; **linagliptine = pas
  d'adaptation** (préférée en IRC avancée). `[À VÉRIFIER — D5]`
- **Profil d'effets indésirables des gliptines** (pemphigoïde bulleuse, arthralgies sévères [FDA], pancréatite
  discutée…) → à afficher honnêtement (fondement de la position Prescrire « à écarter »). `[À VÉRIFIER — D5]`

**Garde-fous de voix (à tenir en rédaction)** : ✗ ne jamais présenter SU ou gliptine comme apportant un
bénéfice CV ou de mortalité (aucun démontré) ; ✗ ne pas présenter les SU comme dangereux **en CV** (les
données modernes sont rassurantes — le danger est l'**hypoglycémie**) ; ✗ ne pas confondre le signal IC de la
**saxagliptine** avec un effet de toute la classe (sitagliptine/linagliptine neutres) ; distinguer partout
**bénéfice dur (nul) vs substitution (HbA1c)**.

## Sources en main & plan de collecte (2026-07-24)

**Déjà en main (réutilisable, `docs/decision/sources/`)** : **Prescrire** (`prescrire-dt2.md` — **P3** « quand la
metformine ne suffit pas », août 2023 = article central pour SU/gliptines, tableaux ; **P7** « alternative à la
metformine » ; **P1=P4** encadré « à écarter : gliptines »). **HAS 2024** (PDF stratégie DT2). **SFD 2025** (PDF).
**Référentiel CMG** (`mmm_referentielmcg_ep11.pdf`).

**Collecte lancée — 5 sous-dossiers (agents A, 2026-07-24 ; red-team B + OE en 2ᵉ passe)** :
- **D1** — Gliptines : CVOT de sécurité CV/rénale & **signal IC** (SAVOR-TIMI 53, TECOS, EXAMINE, CARMELINA).
- **D2** — Sulfamides : sécurité CV & comparateurs actifs (CAROLINA, ADVANCE, TOSCA.IT, UKPDS 33, GRADE study,
  métas surmortalité) + **hypoglycémie/poids** + hiérarchie intra-classe.
- **D3** — Efficacité glycémique, **durabilité** (ADOPT, GRADE) & **place résiduelle** réelle (coût des SU ;
  tolérance/anti-hypo/poids-neutre des gliptines) ; rappel de l'absence de bénéfice dur.
- **D4** — **Recommandations officielles** (HAS 2024, SFD 2025, CMG, ADA/EASD) **vs position critique**
  (Prescrire, Méd. Geek, Minerva) → **divergence** + question du **« contexte aigu »**.
- **D5** — **Sécurité non-CV** (gliptines : pemphigoïde, arthralgies FDA, pancréatite… ; SU : hypo/poids…) +
  **adaptation rénale** (linagliptine = avantage) + interactions.

### État de collecte (2026-07-24)

> **TRIANGULATION COMPLÈTE — A × OE × red-team B réconcilié (2026-07-24)**. 5/5 sous-dossiers agents A
> consolidés (§3) ; OE 2ᵉ passe intégrée (§5b) ; **red-team B a vérifié chaque PMID/chiffre décisionnel contre
> source primaire et tranché les discordances OE↔agents (§5c)**. Les `[À VÉRIFIER]` décisionnels sont **levés**
> (sauf points « non vérifié » du §5c : ADA cortico-induit, source CMG, quelques valeurs hors-abstract).
> **Les chiffres du §3 restent tels que fournis par les agents A ; les corrections du red-team sont portées en
> §5c** (méthodo : on ne réécrit pas l'extraction A, on la réconcilie).
>
> **2 corrections déjà surgies pendant la collecte** : (1) **GRADE durabilité** — le glimépiride (SU) tient
> mieux que la sitagliptine (gliptine = la moins durable), la « mauvaise durabilité du SU » est un artefact du
> glibenclamide (ADOPT) ; (2) **source CMG erronée** — `mmm_referentielmcg_ep11.pdf` = hors-série SFD 2017 sur
> la Mesure Continue du Glucose, pas le référentiel du Collège de la Médecine Générale (§8-7).

**Points structurants déjà consolidés (agents A)** :
- **Gliptines (D1)** : les 4 CVOT vs placebo (~43 500 pts) = **neutralité MACE, zéro bénéfice dur** ;
  **saxagliptine ↑ hospit. IC** (SAVOR HR 1,27, NNH ~140/2 ans) + signal alogliptine (EXAMINE, NS) ;
  **sitagliptine & linagliptine neutres sur l'IC** → **pas un effet de classe uniforme**. CARMELINA : **aucune
  néphroprotection sur critère dur** (bénéfice limité à l'albuminurie = substitut).
- **Sulfamides (D2)** : SU **modernes non délétères en CV** (CAROLINA neutre vs lina ; TOSCA.IT neutre vs pio ;
  glimépiride sans sur-risque MACE propre dans GRADE) — le procès de « surmortalité » vient des vieux essais,
  de l'observationnel et du **glibenclamide** (Simpson : gliclazide RR 0,65 vs glibenclamide). **Aucun bénéfice
  dur** (ADVANCE/UKPDS = gain micro seulement). Vrais inconvénients = **hypoglycémie + poids**.
- **Efficacité/durabilité (D3)** : SU ~**1–1,5 %** d'HbA1c (le plus fort), gliptines ~**0,5–0,8 %**.
  **⚠ Correction du brief** : dans **GRADE**, le **glimépiride (SU) est PLUS durable que la sitagliptine**
  (gliptine = la moins durable des 4) ; la « mauvaise durabilité du SU » est un artefact du **glibenclamide en
  monothérapie** (ADOPT), à ne pas généraliser. **iSGLT2 oraux** occupent la même niche que les gliptines
  **mais avec bénéfice dur** → la gliptine perd son argument dès qu'un iSGLT2 est possible.
- **Sécurité non-CV / rénal (D5)** : gliptines = **profil d'EI chargé** (pemphigoïde bulleuse = classe établie ;
  arthralgies = warning **FDA 2015** ; pancréatite = **signal non confirmé** par les CVOT) ; **linagliptine =
  aucune adaptation rénale** (avantage IRC). SU = hypo/poids **modulés par molécule + DFG** : **glibenclamide à
  proscrire**, **gliclazide** préféré (métabolites inactifs, seul raisonnable en IRC à dose réduite).

## 3. Base de preuves (grille par étude clé) — À CONSOLIDER (agents A × red-team B × OE)

> _Section à remplir par la consolidation des sous-dossiers D1→D5 (agents A), puis vérifiée au red-team B._

### SOUS-DOSSIER D1 — Gliptines : CVOT de sécurité & signal insuffisance cardiaque

| Essai (PMID) | Design / population | Résultat (critère dur ; absolu / HR / IC95 ; horizon) | GRADE |
|---|---|---|---|
| **SAVOR-TIMI 53** — saxagliptine (Scirica, NEJM 2013 ; PMID **23992601**) | ECR vs **placebo**, n=16 492, DT2 ATCD/haut risque CV, fond standard. Médiane **2,1 ans**. | **MACE NEUTRE** 7,3 % vs 7,2 % ; **HR 1,00 (0,89-1,12)**. **★ Signal-phare : ↑ hospit. IC** 3,5 % (289) vs 2,8 % (228) ; **HR 1,27 (1,07-1,51) p=0,007 → NNH ≈ 140 / 2 ans**. Mortalité totale HR 1,11 (0,96-1,27) NS (direction défavorable). Pancréatite 0,3 % vs 0,2 % NS. | MACE neutre : **élevé**. Signal IC : **modéré** (secondaire prédéfini, significatif). |
| **TECOS** — sitagliptine (Green, NEJM 2015 ; PMID **26052984**) | ECR vs **placebo**, n=14 671, DT2 + maladie CV établie. Médiane **3,0 ans**. | **MACE (4 pts) NEUTRE** 11,4 % vs 11,6 % ; **HR 0,98 (0,88-1,09)**. **IC NEUTRE** 3,1 % vs 3,1 % ; **HR 1,00 (0,83-1,20)** (contraste avec saxa). Mortalité HR 1,01 (0,90-1,14). Pancréatite 0,3 % vs 0,2 % (p≈0,07). | MACE + IC neutres : **élevé**. |
| **EXAMINE** — alogliptine (White, NEJM 2013 ; PMID **23992602**) | ECR vs **placebo**, n=5 380, DT2 **post-SCA (15-90 j)**. Médiane ~**18 mois**. | **MACE NEUTRE** 11,3 % vs 11,8 % ; **HR 0,96** (non-inf.). **Sous-analyse IC (Zannad, Lancet 2015, PMID 25765696)** : hospit. IC 3,1 % (85) vs 2,9 % (79) ; **HR 1,07 (0,79-1,46) — signal NON significatif** (population post-SCA). Mortalité HR 0,88 (0,71-1,09). | MACE neutre : **élevé**. Signal IC : **faible** (post-hoc NS). |
| **CARMELINA** — linagliptine (Rosenstock, JAMA 2019 ; PMID **30418475**) | ECR vs **placebo**, n=6 979, DT2 haut risque **CV ET rénal** (albuminurie). Médiane **2,2 ans**. | **MACE NEUTRE** 12,4 % vs 12,1 % ; **HR 1,02 (0,89-1,17)**. **IC NEUTRE HR 0,90 (0,74-1,08)**. **★ Critère rénal dur composite NEUTRE HR 1,04 (0,89-1,22)** (bénéfice limité à l'albuminurie = substitut → **aucune néphroprotection dure**). Mortalité HR 0,98 (0,84-1,13). | MACE + IC neutres : **élevé**. Rénal dur : **modéré**. |

_CAROLINA (linagliptine vs glimépiride, comparateur actif) → sous-dossier D2._

**Message D1** : les 4 CVOT vs placebo (~43 500 pts, preuve **élevée**) établissent que les gliptines sont
**CV-neutres — aucun bénéfice sur critère dur** (elles n'agissent que sur l'HbA1c). Le signal négatif
structurant = **insuffisance cardiaque** : **saxagliptine ↑ hospit. IC significativement** (HR 1,27, NNH ~140),
**alogliptine** signal concordant NS ; **sitagliptine & linagliptine neutres** → **pas un effet de classe
uniforme**, ce qui **disqualifie préférentiellement la saxagliptine** (prudence alogliptine) si risque d'IC.
CARMELINA ferme l'argument rénal (pas de bénéfice dur). Mise en garde **FDA 2016** sur saxa + alo.

**`[À VÉRIFIER — red-team]`** : PMID (SAVOR 23992601, TECOS 26052984, EXAMINE 23992602, Zannad 25765696,
CARMELINA 30418475 ; SAVOR-HF Scirica 25189213 ; CARMELINA-HF McGuire 30586723) ; SAVOR absolus IC/HR/NNH,
mortalité HR 1,11 ; TECOS composition MACE + IC HR 1,00 ; EXAMINE borne de non-inf. + Zannad total-events vs
1er événement ; CARMELINA rénal dur (vérifier limitation à l'albuminurie) ; libellé/date exacte du warning FDA IC.

### SOUS-DOSSIER D2 — Sulfamides : sécurité CV, comparateurs actifs, hypoglycémie & poids

| Essai (PMID) | Design / population | Résultat (dur ; absolu / HR / IC95 ; horizon) | GRADE |
|---|---|---|---|
| **CAROLINA** — Rosenstock, JAMA 2019 (PMID **31536101**) | ECR comparateur **actif** : linagliptine vs **glimépiride**, fond metformine, n=6 033, DT2 à risque CV. Médiane ~**6,3 ans**. 1er CVOT SU vs gliptine. | **3P-MACE NEUTRE entre les 2 bras** 11,8 % vs 12,0 % ; **HR 0,98 (0,84-1,14)** → *un SU moderne n'est pas plus délétère qu'une gliptine sur le CV dur*. **Hypo sévère 0,3 % (lina) vs 2,2 % (glim)** ; hospit. hypo 0,1 % vs 0,9 % ; toute hypo 13,1 % vs 42,1 % (HR 0,25). **Poids** ~ −1,5 kg (Δ ~3 kg en faveur lina). | **élevé** (ECR large, long, comparateur actif, critère dur). |
| **ADVANCE** — NEJM 2008 (PMID **18539916**) | Stratégie **contrôle intensif à base de gliclazide MR** (cible ≤6,5 %) vs standard, n=11 140. Médiane **5 ans**. *(effet-stratégie, pas la molécule seule)* | Composite macro+micro **HR 0,90 (0,82-0,98) p=0,01, porté par le micro**. **Néphropathie HR 0,79 (0,66-0,93)**. **Macro NON réduit** (HR 0,94 NS) ; **mortalité totale NON réduite** (HR 0,93 NS) ; mort CV HR 0,88 NS. **Hypo sévère ↑ 2,7 % vs 1,5 %**. | **modéré-élevé** (néphropathie) ; message « pas de bénéfice macro/mortalité, +hypo » robuste. |
| **TOSCA.IT** — Vaccaro, Lancet D&E 2017 (PMID **28917544**) | ECR pragmatique ouvert : **SU** (≈2/3 glimépiride, ≈1/3 gliclazide) **vs pioglitazone** add-on metformine, n=3 028. Médiane ~**4,75 ans**. Arrêté pour **futilité**. | **Composite dur NEUTRE** 1,5 vs 1,5 /100 pt-an ; **HR 0,96 (0,74-1,26) p=0,79** → *SU pas plus délétère qu'une glitazone*. **Hypo 34 % (SU) vs 10 % (pio)**. | **modéré** (ouvert, arrêt précoce, imprécision). |
| **UKPDS 33** — Lancet 1998 (PMID **9742976**) | ECR historique : contrôle intensif **SU (chlorpropamide, glibenclamide) ou insuline** vs conventionnel, n=3 867, DT2 récent. ~**10 ans**. | Composite « any diabetes endpoint » **HR 0,88 (0,79-0,99)**, **porté par le micro** (−25 %, surtout photocoagulation = substitut). **IDM −16 % p=0,052 (NS à l'époque)**. **Mort liée au diabète / mortalité totale NON réduites**. Poids ↑ + hypo ↑. | **modéré** (ancien, critère micro substitut). |
| **GRADE** — NEJM 2022 (glycémie PMID **36129996** ; volet micro/CV PMID **36129998** `[À VÉRIFIER]`) | ECR 4 bras add-on metformine : **glimépiride** vs sitagliptine vs liraglutide vs glargine, n=5 047. ~**5 ans**. Critère 1aire = **durabilité** (substitution). | **Durabilité** : glargine ≈ liraglutide > **glimépiride** > sitagliptine. **Hypo sévère : glimépiride 2,2 % = le plus élevé** (vs glargine 1,3 %, lira 1,0 %, sita 0,7 %). **CV** : pas de diff. MACE hormis liraglutide (« any CVD »). Poids : glim ↑. | **élevé** (hypo/durabilité) ; **faible-modéré** (CV, sous-puissance). |
| **Simpson 2015** — Lancet D&E (PMID **25466239**) | Méta-analyse en réseau, 18 études, 167 327 pts (majorité **observationnelle**). Mortalité, hiérarchie intra-SU. | **vs glibenclamide** : **gliclazide RR 0,65 (0,53-0,79)**, glimépiride RR 0,83 (0,68-1,00) → **glibenclamide = le plus mortel**. | **faible** (observationnel, confusion). Utile pour la **hiérarchie**, pas l'effet absolu. |
| **Rados 2016** — PLoS Med (PMID **27071029**) | Méta-analyse **d'ECR** + TSA. SU vs autres, mortalité. | SU **NON associés** à un excès de mortalité en ECR (RR toutes causes ~1,12 [0,96-1,30] NS ; CV ~1,12 NS) ; **TSA non concluante**. | **modéré** (ECR mais imprécis). Contrepoids « rassurant » à l'observationnel. |
| Métas « signal » — Monami 2013 `[À VÉRIFIER PMID]`, Bain 2017 `[À VÉRIFIER PMID]` ; origine du signal = **UGDP 1970** (tolbutamide) | Méta-analyses sécurité CV/mortalité des SU. | **Contradiction** : Monami suggère un léger sur-risque (RR ~1,2) ; Bain/Rados ne confirment pas en ECR. La controverse tient aux **vieux essais + observationnel + glibenclamide**. | **faible-modéré** (hétérogénéité). |

**Message D2** : les SU **modernes (gliclazide, glimépiride) ne montrent aucun excès CV** face aux comparateurs
récents (CAROLINA, TOSCA.IT, GRADE) — la « surmortalité des SU » vient des vieux essais (UGDP), de
l'observationnel et du **glibenclamide** (Simpson : gliclazide RR 0,65). En contrepartie, **aucun bénéfice
dur** (ADVANCE/UKPDS = micro seulement). Vrais inconvénients = **hypoglycémie** (jusqu'à 42 % sous glimépiride,
le plus d'hypo sévère après l'insuline dans GRADE) et **prise de poids**. → place résiduelle défendable d'un SU
**bon marché** quand le coût prime, à condition de **privilégier gliclazide/glimépiride, proscrire le
glibenclamide**, et d'informer : gain glycémique (substitut) contre risque d'hypo + poids, **zéro bénéfice CV**.

**`[À VÉRIFIER — red-team]`** : chiffres CAROLINA (HR MACE, hypo, poids), ADVANCE (néphropathie HR 0,79,
hypo sévère HR ~1,86), TOSCA.IT (HR 0,96, hypo 34/10), UKPDS 33 (IDM p=0,052, neutralité mortalité), GRADE
(hypo par bras, PMID volet CV **36129998** incertain — DOI NEJMoa2200433/2200436 à apparier), Simpson (RR
intra-classe), Rados (RR exacts), Monami/Bain (PMID + existence du signal), UGDP 1970. **Nuance** : ADVANCE/UKPDS
= stratégie intensive, pas le SU seul — ne pas sur-attribuer ; présenter la **divergence méthodologique**
Rados (ECR, rassurant) vs Monami (signal) vs Simpson (hiérarchie, observationnel).

### SOUS-DOSSIER D3 — Efficacité glycémique, durabilité & place résiduelle (coût, tolérance)

> **Garde-fou dur/substitution** : tout ce sous-dossier est de la **substitution** (HbA1c, durabilité).
> **Aucun bénéfice dur** des deux classes (renvoi D1/D2).

| Essai / source (PMID) | Design / population | Résultat (HbA1c / durabilité ; absolu ; horizon) | GRADE |
|---|---|---|---|
| **ADOPT** — Kahn 2006 (PMID **17145742**) | ECR **monothérapie** initiale, DT2 récent, n=4 360, médiane 4 ans ; glyburide (glibenclamide) vs metformine vs rosiglitazone. Critère = échec de monothérapie. | SU = baisse initiale **la plus rapide mais la moins durable** : **échec à 5 ans 34 % (glyburide) vs 21 % (met) vs 15 % (rosi)** ; maintien HbA1c<7 % ~33 vs 45 vs 60 mois. Hypo ~38,7 % ; poids +1,6 kg. | **élevé** (durabilité relative) ; substitution. |
| **GRADE — Glycemic Outcomes 2022** (PMID **36129996** `[À VÉRIFIER]`) | ECR 4 bras **add-on metformine**, DT2 <10 ans, n=5 047, ~5 ans ; glargine vs **glimépiride** vs liraglutide vs **sitagliptine**. | Durabilité (/100 pt-an) : glargine **26,5** ≈ lira **26,1** < **glimépiride 30,4** < **sitagliptine 38,1**. **⚠ CORRECTION : le SU (glimépiride) est PLUS durable que la gliptine (sitagliptine = la moins durable)**, pas « intermédiaire ». | **élevé** ; substitution. |
| **SU — méta Hirst 2013** (PMID **23494446**) | Revue systématique + méta, 31 ECR. | Monothérapie SU : **−1,51 % HbA1c (1,25-1,78)** ; add-on ~−1,62 %. Confirme l'ampleur **~1-1,5 %**. Hypo RR 2,41 (1,41-4,10). | **modéré-élevé** ; substitution. |
| **Gliptines — efficacité** (métas/RCP) | DPP-4i vs placebo, add-on metformine. | **~0,5-0,8 %** d'HbA1c (moindre que les SU). Neutre sur le poids, très faible hypo. | **modéré** ; substitution. |
| **CAROLINA** — (PMID **31536101**, renvoi D2) | Lina vs glimépiride, head-to-head. | Efficacité glycémique **équivalente** ; avantage gliptine sur **tolérance** (hypo ~10-11 % vs ~37 %, poids Δ ~3 kg). CV neutre. | **élevé** ; dur (CV) + substitution. |

**Place résiduelle — arguments pondérés** :
- **Sulfamides** (gliclazide/glimépiride ; éviter glibenclamide) : **coût très faible** (génériques, quelques €/mois `[prix FR À VÉRIFIER]`, liste OMS essentiels) → argument **fort en contrainte de coût/accès** ; **efficacité glycémique la plus forte** (~1-1,5 %) ; **CV neutre** vs gliptine (CAROLINA). Contre : **hypo + poids**, durabilité moindre en monothérapie (glibenclamide). Zéro bénéfice dur.
- **Gliptines** : **niche de tolérance** — orales 1×/j, **neutres sur le poids, très peu d'hypo, bien tolérées digestivement** (vs GLP-1) → éviter hypo + poids **sans injection**. Contre : **coût modéré** (remboursement FR abaissé — sita 30 %, saxa/vilda 15 % `[À VÉRIFIER]`), efficacité moindre (~0,5-0,8 %), **profil d'EI chargé** (cf. D5), **signal IC saxa/alo** (cf. D1). Position **Prescrire = à écarter**. **Concurrence des iSGLT2 oraux** (même niche « oral, sans hypo, sans poids » **mais avec bénéfice dur**) → la gliptine perd son argument dès qu'un iSGLT2 est possible.
- **Commun** : **aucun bénéfice dur** ; place = **uniquement quand iSGLT2/aGLP1 sont CI/non tolérés/refusés/inaccessibles**. Non-association gliptine + GLP-1 (redondance incrétine, cf. C).

**Message D3** : à bénéfice dur nul des deux côtés, la décision se joue sur substitution, tolérance, coût,
accès. **SU** = baisse d'HbA1c la plus forte pour un coût dérisoire, au prix d'**hypo + poids** ; sa réputation
de durabilité médiocre vient du **glibenclamide** (ADOPT) — dans GRADE le **glimépiride tient mieux que la
gliptine**. **Gliptine** = baisse plus modeste mais **sans hypo/poids ni injection** (niche de tolérance),
contrebalancée par coût, EI chargés et **concurrence des iSGLT2 (qui, eux, ont un bénéfice dur)**. → place
résiduelle : SU pour le **coût/accès**, gliptine pour la **tolérance (éviter hypo+poids sans injecter)**,
**seulement en aval** des iSGLT2/aGLP1.

**`[À VÉRIFIER — red-team]`** : ADOPT (34/21/15 %, mois de maintien, hypo 38,7 %, poids) ; GRADE PMID **36129996**
+ incidences /100 pt-an (26,5/26,1/30,4/38,1) ; Hirst (−1,51 %, RR hypo 2,41) ; fourchette gliptines −0,5/−0,8 %
(PMID méta princeps) ; CAROLINA (hypo, poids) ; **prix FR** génériques SU vs sitagliptine + **taux de
remboursement** gliptines (statut post-générication sitagliptine) ; position Prescrire « à éviter » (réf. exacte).

### SOUS-DOSSIER D4 — Recommandations officielles vs position critique (divergence) + contexte aigu

> **⚠ Correction de sourcing (agent D4)** : le fichier `sources/mmm_referentielmcg_ep11.pdf` **n'est PAS** le
> référentiel du Collège de la Médecine Générale — c'est un **hors-série SFD 2017** (*Médecine des maladies
> Métaboliques*, vol. 11, HS n°1) sur la **Mesure Continue du Glucose** (« referentielMCG » = *Mesure Continue
> du Glucose*, pas *Médecine Générale*). Il ne traite ni SU ni gliptines → **aucune source CMG « soins
> premiers » exploitable localement** (angle CMG laissé `[À VÉRIFIER]`, fichier à re-fournir). **La note
> mémoire projet + l'inventaire de sources `00-global.md` doivent être corrigés.**

**Place accordée à SU et gliptines — reco officielle (extraits directs des PDF locaux)** :

| Source | Sulfamides (SU) | Gliptines (DPP-4i) | Rang |
|---|---|---|---|
| **HAS 2024** (RBP stratégie DT2, validée 30/05/2024) | Option **remboursable résiduelle** (bi/trithérapie) ; « **n'est plus la stratégie préférentielle** » (R.61/R.69, hypo sévères + existence de molécules à bénéfice CV/rénal) | **« Option la plus simple pour la pratique clinique »** en l'absence d'IC/MCV/néphropathie/haut risque CV ; placée **avant** le SU | iSGLT2/aGLP1 ≫ **iDPP4 > SU** |
| **SFD 2025** (Darmon et al., Med Mal Metab 2025;19:630-662 ; DOI 10.1016/j.mmm.2025.10.002) | « **possible mais pas un choix privilégié** » (Avis 10) ; **à éviter** si risque hypo (âgé fragile/dépendant, IRC, métier à risque…) ; **glibenclamide « à ne plus utiliser »** | Meilleure tolérance/simplicité ; **sitagliptine = seul oral à sécurité CV démontrée** (Avis 11, fallback athéromateux — TECOS) ; éviter saxagliptine (IC — SAVOR) | iSGLT2/GLP1/GIP-GLP1 > **iDPP4 > SU** |
| **CMG** | `[À VÉRIFIER]` — pas de source locale | `[À VÉRIFIER]` — pas de source locale | — |
| **ADA/EASD 2022** (Davies et al., Diabetes Care 2022;45:2753-86, PMID **36148880**) + Standards ADA | **Forte efficacité glycémique à bas coût** — **« when cost is a major consideration »** ; éviter glibenclamide | **Orale, poids-neutre, sans hypo** — **« to minimize hypoglycemia »** sans injection ; **ne pas associer à un aGLP1** | iSGLT2/GLP1 (bénéfice cardio-rénal) prioritaires ; SU/DPP-4i = leviers « coût / anti-hypo » |

**Convergence officielle forte** : SU et gliptines **derrière iSGLT2/aGLP1** (seules classes à bénéfice
cardio-rénal), et **gliptine rangée avant le sulfamide** (pas d'hypo, tolérance). Points saillants HAS/SFD :
HAS **R.80/R.53 = ne pas associer aGLP1 + iDPP4** ; SFD = **quadrithérapie MET+iDPP4+iSGLT2+SU non validée** ;
en IRC, gliptines utilisables (adaptation, sauf lina) et SU restreints.

**Position critique (indépendante)** :
- **Prescrire** (`prescrire-dt2.md` P3/P7/P1) : **asymétrie nette** — **gliptines « médicaments plus dangereux
  qu'utiles, à écarter des soins quelle que soit la situation »** ; **SU en dépannage seulement** (metformine
  mal tolérée), « effet modeste, pas d'effet démontré sur la mortalité, très faible niveau de preuve ».
- **Médicalement Geek / DragiWebdo** (web, débroussaillage) : proche de Prescrire — gliptines « n'ont jamais
  montré leur efficacité clinique » ; SU à éviter, réservés au seul obstacle financier « non pertinent en
  France ». `[À VÉRIFIER verbatim]`
- **Minerva** (web) : position **intermédiaire** — confirme l'**absence de bénéfice CV** des gliptines + signal
  IC saxa, mais **ne va pas jusqu'à « écarter »**. `[À VÉRIFIER réf. FR exacte]`

**Divergence — OUI, de *degré* pas de *fond*** : socle commun total (aucune source, officielle comprise, ne
revendique de bénéfice dur pour SU/gliptines). Les pôles se séparent sur l'action : **(a) officiels = conservent
en 2e/3e ligne non préférentielle, gliptine valorisée (sitagliptine en fallback)** ; **(b) Prescrire = écarter
les gliptines entièrement** (point de friction majeur), **SU en dépannage**. → **La divergence porte
spécifiquement sur les gliptines.** Convergence exploitable : **si gliptine → sitagliptine (TECOS), éviter
saxagliptine (SAVOR)** ; **si SU → gliclazide/glimépiride, jamais glibenclamide**.

**Contexte aigu (corticothérapie/hospitalisation/péri-op)** : **aucune source ne fonde un usage transitoire
« positif » des SU/gliptines en aigu**. Au contraire — HAS R.8 classe la corticothérapie en **question de
recherche** (non couverte) ; en hyperglycémie aiguë symptomatique la réponse est **insuline (transitoire)** ;
**SFD Avis 14 ter = arrêter SU/glinides (hypo) et iSGLT2 (acidocétose) en péri-op**. → **Arbitrage proposé :
NE PAS créer de variable `contexte_aigu` dédiée** (hors périmètre, pas de base EBM, sur-complexité) ; au plus
une **alerte transversale** brève « en aigu : suspendre SU/glinides + iSGLT2, recourir à l'insuline — hors
périmètre de ce nœud ». **À trancher référent (§8).**

**Position raisonnée de l'outil** : place résiduelle **étroite, jamais préférentielle** ; afficher **reco
officielle (2e/3e ligne, gliptine avant SU) + critique Prescrire (« écarter les gliptines » / « SU en
dépannage »), divergence signalée (spécifiquement sur les gliptines)**.

**`[À VÉRIFIER — red-team]`** : **source CMG absente** (re-fournir) ; ADA/EASD pagination Diabetologia + Standards
2025/2026 ; Minerva réf. FR ; Médicalement Geek verbatim exacts. HAS 2024 (R.59/61/69/74/78/80/53) et SFD 2025
(Avis 6/10/11/14/16/17, Tableau III) **vérifiés page à page sur les PDF** — OK.

### SOUS-DOSSIER D5 — Sécurité non-CV, adaptation rénale & interactions

**Gliptines (DPP-4i) — sécurité & rénal**

| Signal / point | Nature & source | Ampleur / preuve | Portée algorithme |
|---|---|---|---|
| **Pancréatite aiguë** | Signal historique (FDA ~2013) **largement non confirmé** par les CVOT. | SAVOR HR 1,13 NS (PMID 24914244) ; TECOS HR 1,93 (0,96-3,88) p=0,065 (PMID 27630212) ; CARMELINA numérique ↑ faibles effectifs. | **Non établi** → pas un critère d'exclusion ; prudence si ATCD pancréatite. |
| **Pemphigoïde bulleuse** | **Effet de classe établi** (FAERS + cas-témoins + méta ; RCP EU). | Méta OR ~2,1 (1,59-2,86) (PMID 31215644) ; cas-témoins FR/CH aOR 2,64 (1,19-5,85) ; **vildagliptine aOR 3,57** (PMID 29274348). Gradient vilda > sita ≈ lina. | **Alerte dermato réelle** ; argument de tolérance en défaveur (surtout vilda/lina). |
| **Arthralgies sévères** | **Warning FDA août 2015**, **effet de classe** (sita, saxa, lina, alo). | 33 cas FAERS (2006-13), rechallenge positif ; incidence faible, signal robuste. | Arthralgies inexpliquées sous gliptine → test d'arrêt. |
| **SJS/DRESS, angiœdème** (Prescrire) | Notifications rares ; angiœdème **majoré par IEC** (bradykinine). | Bas niveau pour SJS ; angiœdème pharmacologiquement cohérent. `[À VÉRIFIER]` fréquences. | Vigilance en co-prescription IEC (fréquente chez DT2). |
| **Occlusion intestinale / infections** (Prescrire) | Faisceau « profil chargé ». | Preuve **faible/incertaine** ; excès d'infections souvent NS. `[À VÉRIFIER]`. | Ne pas surestimer chaque item isolé. |
| **Insuffisance cardiaque** *(rappel — cf. D1)* | Signal de classe **partiel** (saxa/alo oui ; sita/lina non). | SAVOR HR ~1,27. | Éviter saxa/alo si IC ; sita/lina neutres. |
| **Adaptation rénale** | RCP par molécule. | **Sitagliptine** 100→50 (DFG 30-44)→25 (<30/dialyse) ; **vildagliptine** 50×2→50×1 si DFG<50 ; **saxagliptine** 5→2,5 si DFG<45, éviter en IRC terminale ; **LINAGLIPTINE = aucune adaptation, 5 mg/j tous stades y compris dialyse** (élim. biliaire). | **Linagliptine = avantage décisif en IRC** (gliptine de choix si DPP-4i retenu chez l'IR). |

**Sulfamides (SU) — sécurité & rénal**

| Signal / point | Nature & source | Ampleur / preuve | Portée algorithme |
|---|---|---|---|
| **Hypoglycémie (EI majeur)** | Sévère/prolongée surtout **glibenclamide**, en **IRC** et chez l'**âgé**. | SU longs/non spécifiques vs courts/spécifiques **HR 2,83** hypo sévère (PMID 28864502). | Facteur limitant central ; pondérer par molécule + terrain. |
| **Hiérarchie intra-classe** | Gradient. | **Glibenclamide > glimépiride > gliclazide MR**. Gliclazide RR hypo ~0,47 (0,27-0,79). **Nuance** : 1 étude âgés = gliclazide MR > glimépiride (PMC9126741, observationnel). | Si SU retenu → **gliclazide MR = 1er choix** ; glibenclamide à proscrire. |
| **Prise de poids** | Effet de classe. | Quelques kg ; moindre gliclazide MR. | Défavorable si surpoids. |
| **Hyponatrémie / effet antabuse** | Surtout **chlorpropamide** (molécules anciennes). | Case reports ; marginal pour gliclazide/glimépiride. | Signaux mineurs, ne pas surpondérer. |
| **Allergie croisée sulfamides** | **Théorique** (parenté structurale). | Réactivité croisée clinique **faible/discutée**. `[À VÉRIFIER]`. | Prudence si allergie documentée, pas une CI absolue. |
| **SU en IRC** | Selon molécule. | **Glibenclamide à proscrire** (métabolites actifs rénaux) ; **glimépiride** métabolite actif → dose réduite (début 1 mg/j) ; **gliclazide** métabolites inactifs (~4 % rénal) → **SU préféré en IRC** à dose basse. `[À VÉRIFIER]` seuils DFG. | En IRC : si SU → **gliclazide** dose réduite, **jamais glibenclamide**. |

**Encadré adaptation rénale — synthèse pratique** : en IRC, si DPP-4i → **linagliptine** (zéro contrainte de
dose, y compris dialyse) ; si SU → **gliclazide** à dose réduite, **jamais glibenclamide**.

**Message D5** : gliptines = **profil d'EI chargé** (pemphigoïde bulleuse = classe **établie** ; arthralgies =
**FDA 2015** ; angiœdème majoré par IEC) fondant l'argument Prescrire, mais **pancréatite non confirmée** et IC
partielle (saxa/alo) → niche de tolérance réelle mais étroite, **linagliptine** en IRC. SU = **hypo + poids**
modulés par molécule + fonction rénale : **glibenclamide à proscrire**, **gliclazide** le mieux toléré et seul
raisonnable en IRC à dose réduite.

**`[À VÉRIFIER — red-team]`** : seuils DFG exacts (vilda <50 ?, saxa <45 vs ≤50 + statut dialyse, sita 45/30) ;
glimépiride/gliclazide seuils IRC (« CI <60 » vs « prudence dose réduite ») ; fréquences SJS/DRESS/angiœdème +
sur-risque IEC ; sources primaires « occlusion/infections » Prescrire ; allergie croisée (niveau de preuve) ;
hiérarchie hypo intra-SU (étude discordante PMC9126741) ; PMID (31215644, 29274348, 24914244, 27630212, 28864502).

## 4. Synthèse critique (reco officielle vs position raisonnée) — provisoire (agents A, avant red-team B)

### Reco officielle

**HAS 2024**, **SFD 2025** et **ADA/EASD 2022** convergent : SU et gliptines sont des **options de 2e/3e ligne
non préférentielles**, systématiquement **derrière iSGLT2/aGLP1** (seules classes à bénéfice cardio-rénal
démontré), et la **gliptine est rangée avant le sulfamide** (pas d'hypoglycémie, tolérance). Le **coût** est le
levier assumé du SU (« when cost is a major consideration », ADA) ; la **gliptine** est le levier « éviter
l'hypo sans injection ». Points de sécurité partagés : **glibenclamide « à ne plus utiliser »** (SFD) ;
**sitagliptine = seul oral à sécurité CV démontrée** (SFD Avis 11, fallback athéromateux) ; **éviter
saxagliptine si IC** ; **ne pas associer gliptine + aGLP1** (HAS R.80/R.53, ADA/EASD).

### Position critique (Prescrire, Médicalement Geek, Minerva) — affichée à côté

**Prescrire** : **asymétrie forte** — **gliptines à écarter entièrement** (« plus dangereuses qu'utiles, quelle
que soit la situation ») ; **SU en dépannage** seulement (metformine mal tolérée), preuves très faibles, pas
d'effet sur la mortalité. **Médicalement Geek** rejoint Prescrire. **Minerva** = position intermédiaire
(absence de bénéfice CV confirmée, sans injonction d'écarter).

### Divergence — **oui** (de degré, pas de fond)

**Socle commun total** : aucune source — officielle comprise — ne revendique de bénéfice dur pour SU/gliptines.
La divergence est sur **l'action** et **porte spécifiquement sur les gliptines** : les officiels les
**conservent et les valorisent** (sitagliptine en fallback), Prescrire les **écarte**. **⚠ La divergence n'est
PAS franco-française** (précision OE, red-team §5c) : l'**ACP 2024** (American College of Physicians, PMID
**38639546**) recommande **fortement** (haute certitude) de **ne pas ajouter d'iDPP4 à la metformine** pour
réduire morbidité/mortalité (et d'ajouter plutôt un iSGLT2/GLP-1) → 1re grande reco anglophone qui **converge
avec Prescrire**. Le paysage international va
d'un pôle « fallback » (ADA/EASD, HAS, NICE, WHO — SU 2e ligne coût, gliptine anti-hypo) à un pôle « éliminer/
reléguer » (ACP 2024, panel européen Consoli 2020 « SU = dernière option », Prescrire/CMG/Minerva) ; l'outil se
place au milieu, place résiduelle étroite. **Position raisonnée de l'outil** : *place résiduelle étroite, jamais préférentielle face aux iSGLT2/aGLP1 ; afficher la reco officielle
(2e/3e ligne, gliptine avant SU) à côté de la critique Prescrire (« écarter les gliptines » / « SU en
dépannage »), divergence signalée. Si gliptine retenue → **sitagliptine** (jamais saxagliptine si IC) ; si SU
retenu → **gliclazide/glimépiride** (jamais glibenclamide), à éviter chez l'âgé fragile / IRC / risque hypo.*

## 5. Vérification bi-agents (état 2026-07-24)

**Dispositif** : 5 agents A (sous-dossiers D1→D5, extraction) **REÇUS et consolidés (§3)**. Prochaines couches
(pipeline `00-global.md` étape 4) : **red-team Agent B** (vérif. **chaque PMID/DOI/chiffre décisionnel vs source
primaire**) + triangulation **OpenEvidence** (prompts **OE-D1→D5** transmis au référent, annexe). Réconciliation
Opus à suivre. **Aucun `[À VÉRIFIER]` décisionnel n'est encore levé** : les chiffres du §3 restent « agent A ».

**Corrections déjà surgies pendant la collecte** (avant même le red-team) :
- **⚠ GRADE — durabilité** : le brief supposait la sitagliptine « intermédiaire » ; la donnée réelle est que le
  **glimépiride (SU) tient MIEUX que la sitagliptine** (gliptine = la moins durable des 4). La « mauvaise
  durabilité du SU » est un **artefact du glibenclamide en monothérapie (ADOPT)**, à ne pas généraliser.
- **⚠ Source CMG** : `mmm_referentielmcg_ep11.pdf` = hors-série SFD 2017 sur la **Mesure Continue du Glucose**,
  **pas** le référentiel du **Collège de la Médecine Générale** → pas de source CMG locale (à re-fournir).

**`[À VÉRIFIER]` prioritaires à lever au red-team B** (liste complète en fin de chaque sous-dossier §3) :
- **D1** : SAVOR IC (HR 1,27 / NNH ~140) et mortalité (HR 1,11) ; CARMELINA rénal dur (limitation à
  l'albuminurie) ; date/libellé warning FDA IC.
- **D2** : CAROLINA (HR MACE, hypo par bras) ; ADVANCE (néphropathie 0,79, hypo HR ~1,86) ; **PMID volet CV de
  GRADE (36129998 incertain)** ; Simpson (RR intra-classe) ; Monami/Bain/UGDP.
- **D3** : ADOPT (34/21/15 %) ; **GRADE PMID 36129996** ; **prix + remboursement FR** SU vs gliptines.
- **D5** : seuils DFG exacts (vilda/saxa/sita) ; glimépiride/gliclazide seuils IRC ; solidité SJS/angiœdème/
  occlusion ; hiérarchie hypo intra-SU (étude discordante).
- **D4** : **source CMG** ; ADA pagination ; Minerva réf. FR ; Médicalement Geek verbatim.

### 5b. OE 2ᵉ passe (débroussaillage référent, reçue 2026-07-24) — triangulation A × OE

Rapport OE reçu (`Downloads/rapport OE gliptine SU.txt`, couvre OE-D1→D5). **Concordance forte** avec les
agents A sur tout le socle décisionnel ; l'OE **confirme** : 4 CVOT gliptines neutres/zéro bénéfice dur (saxa
HHF HR 1,27, **NNH ~143/2,1 ans** — précisé) ; **sita/lina neutres HHF** (TECOS ré-adjudiqué HR 0,94 ; pooled
excluant SAVOR ≈ nul) ; SU modernes CV-neutres (CAROLINA HR 0,98 ; **Rados TSA exclut un excès ≥0,5 %** ;
**Azoulay-Suissa meta-régression : RR 1,06 NS après retrait des biais** — le « signal SU » est du *confounding*
+ glibenclamide) ; sitagliptine = pire durabilité (GRADE), SU intermédiaire ; place résiduelle SU=coût
($4-10/mois, **gliclazide sur la liste OMS** dès 2019, glibenclamide **restreint/remplacé — déconseillé ≥60 ans
— en 2021** [red-team : pas « retiré 2019 »]) / gliptine=tolérance, les deux derrière
iSGLT2/aGLP1.

**Refinements / corrections que l'OE apporte (à répercuter, red-team B à confirmer)** :
1. **⚠ Pancréatite = signal de CLASSE *significatif* en méta-analyse** (Tkáč & Raz 2017 **OR 1,79** [1,13-2,82] ;
   Cochrane NMA Kanie 2021 **OR 1,63** [1,12-2,37], certitude modérée) — chaque CVOT isolé était NS, mais le
   **pooled est significatif** (ARR minime ~**0,13 %**). → **corriger « non confirmé » (D1/D5) en « signal de
   faible ampleur mais statistiquement significatif en méta-analyse »**.
2. **Alogliptine — signal HHF renforcé** dans le sous-groupe **sans IC de base** (post-hoc EXAMINE **HR 1,76**
   [1,07-2,90]) → conforte « éviter aussi l'alogliptine » ; **AHA/ACC/HFSA 2022 = Classe III (Harm)** pour saxa
   **et** alo en IC.
3. **Efficacité glycémique = ÉQUIVALENCE en tête-à-tête** : le « SU 1-1,5 % vs gliptine 0,5-0,8 % » est un
   **artefact de baseline** (essais SU plus anciens, HbA1c de départ plus haute) ; en tête-à-tête, **WMD 0,08 %**
   (Zhou 2016, 14 ECR) = négligeable. → nuance à porter dans D3.
4. **ACP 2024** (Ann Intern Med, PMID **38639546** [red-team : le 38639547 = compagnon coût-efficacité de
   Schousboe]) : recommandation **FORTE** (haute certitude) « **ne pas ajouter d'iDPP4 à la metformine** pour
   réduire morbidité/mortalité » + « **ajouter un iSGLT2/GLP-1** ». [red-team : « arrêter SU/insuline » **n'est
   PAS** une reco formelle de l'ACP → retiré.] → **1re grande reco anglophone convergeant avec Prescrire** : la
   divergence **n'est pas franco-française**.
5. **Panel européen (Consoli 2020, PMID 32476244)** : SU = **usage limité/prudent**, 2e ligne encore acceptable
   chez des profils sélectionnés [red-team : requalifié — PAS « dernière option » stricte]. **WHO 2018 / IDF 2025** : SU 2e ligne en contexte bas-ressources (coût).
6. **⚠ Contexte aigu — CORRIGE la conclusion D4** : contrairement au « aucune source ne fonde un usage positif »,
   **l'ADA 2026 endosse les SU/glinides à courte durée d'action dans l'hyperglycémie CORTICO-INDUITE** (calage
   sur les excursions post-prandiales du corticoïde ; revue *Lancet D&E* 2026 concordante) ; **hospitalisation =
   insuline** (Endocrine Society 2022 déconseille les SU en hospit., hypo ~1/5). → **§8-2 révisé** (il existe une
   base ciblée ; reste à décider de la modéliser).
7. **Pemphigoïde bulleuse** : source primaire OE = **Lee 2020 JAMA Dermatol** (DPP-4i vs SU 2ᵉ gén, cohorte,
   PMID **32697283**, DOI 10.1001/jamadermatol.2020.2158) — **HR = 1,42 (1,17-1,72)** [red-team : PAS ~2,2 ;
   ≥65 ans HR 1,62]. Le ~2,1 = méta **Phan** (OR 2,13, PMID 31215644) ; cas-témoins **Benzaquen** aOR 2,64
   (vilda 3,57, PMID 29274348). — à ajouter à D5 (effet de classe maintenu, ampleur corrigée).

**⚠ Discordances de PMID OE ↔ agents A (à TRANCHER au red-team B contre PubMed — ne rien encoder avant)** :
- **SAVOR-TIMI 53** : agents A = **23992601** · OE = **24003177** (et OE attribue 23992601 à EXAMINE !). Les deux
  sont incompatibles. *(SAVOR & EXAMINE = même n° NEJM 2013;369(14), PMID probablement consécutifs 23992601 /
  23992602 — à confirmer.)* DOI concordants (SAVOR 10.1056/NEJMoa1307684 ; EXAMINE 10.1056/NEJMoa1305889).
- **Simpson 2015** : agents A = **25466239** · OE = **25466723**.
- **TOSCA.IT** : agents A = **28917544** · OE = **28918975** (DOI 10.1016/S2213-8587(17)30317-0).
- **GRADE micro/CV** : agents A = **36129998** · OE = **36129997** (NEJMoa2200436) ; + OE ajoute un 3ᵉ papier
  **GRADE-CV : Circulation 2024** (Green, 10.1161/CIRCULATIONAHA.123.066604).
- **Piège CARMELINA vs CAROLINA** (bien distinguer) : **CARMELINA** (lina vs *placebo*) = JAMA 2019;**321**:69,
  DOI 10.1001/jama.2018.18269 ; **CAROLINA** (lina vs *glimépiride*) = JAMA 2019;**322**:1155, DOI
  10.1001/jama.2019.13772. Les deux agents ont géré correctement.

**Nouvelles sources primaires surfacées par l'OE (à vérifier au red-team)** : Azoulay & Suissa 2017 (28428321),
Douros 2018 BMJ (SU 2e ligne, confondu par indication), Zhou 2016 (tête-à-tête), Deacon & Lebovitz 2016
(explication de l'équivalence), Lee 2020 JAMA Dermatol (pemphigoïde), Kanie 2021 Cochrane NMA (pancréatite),
ACP 2024 (38639547), Consoli 2020 (panel européen), UKPDS 91 (Adler 2024 Lancet, legacy 24 ans).

**⚠ Autorité des sources françaises** : l'OE résume HAS/SFD/CMG **depuis des documents publics NON indexés** et
cite une **« SFD 2023 »** — c'est le **sous-dossier D4 (lecture directe des PDF HAS 2024 & SFD 2025, R-numéros /
Avis)** qui fait autorité, pas l'OE. La position CMG donnée par l'OE (Prescrire-alignée, metformine → gliclazide
→ insuline, iDPP4 « étape inutile ») est **plausible mais non vérifiée** → conforte le besoin d'une **vraie
source CMG** (§8-7).

### 5c. Réconciliation red-team B (Opus, 2026-07-24) — PMID & chiffres vérifiés contre source primaire

**Dispositif** : 2 agents B (B1 = gliptines D1/D5 ; B2 = sulfamides + recos D2/D3/D4) ont vérifié chaque
PMID/chiffre décisionnel contre PubMed/éditeur (~65 vérifications). Résultat : **le socle décisionnel est
CONFIRMÉ aux chiffres près** ; plusieurs **faux PMID** (côté OE ET côté agents) écartés ; 4 corrections
factuelles ; 1 affirmation retirée (non vérifiée).

**PMID tranchés (faux PMID écartés — tous pointaient vers un article sans rapport)** :

| Item | PMID CORRECT | Faux PMID écarté |
|---|---|---|
| SAVOR-TIMI 53 | **23992601** *(agents)* | OE 24003177 = parasitologie |
| EXAMINE | **23992602** *(agents)* | OE 23992601 (mal attribué) |
| TOSCA.IT | **28917544** *(agents)* | OE 28918975 = physique nucléaire (67Ga) |
| Simpson 2015 | **25466239** *(agents)* | OE 25466723 = chirurgie bariatrique |
| GRADE micro/CV | **36129997** *(OE)* | agent 36129998 = tofersen/SLA |
| ACP 2024 (Qaseem) | **38639546** | dossier 38639547 = Schousboe (coût-eff.) |
| Tkáč & Raz (pancréatite) | **27659407** | 28108536 = éditorial DeVries |

PMID ajoutés (items sans PMID au dossier) : Lee 2020 pemphigoïde **32697283**, Phan méta **31215644**,
Benzaquen **29274348**, Monami 2013 **23594109**, Zhou 2016 **26709610**, Douros 2018 **30021781**, Azoulay-Suissa
2017 **28428321**, Consoli 2020 **32476244**, Endocrine Society 2022 **35690958**, AHA/ACC/HFSA 2022 **35363499**,
GRADE glycémie **36129996**.

**Bilan des discordances OE↔agents** : sur 4 conflits de PMID, **agents corrects 3 fois** (SAVOR/EXAMINE,
TOSCA.IT, Simpson), **OE correct 1 fois** (GRADE micro/CV). → confirme la règle projet : *ni agents ni OE
fiables en aveugle sur les PMID ; la vérif. primaire du red-team est indispensable* (même leçon qu'au nœud E).

**4 corrections factuelles (appliquées §3/§5b)** :
1. **Pemphigoïde — Lee 2020** : HR = **1,42 (1,17-1,72)** (≥65 ans 1,62), **PAS ~2,2**. Le ~2,1 = **méta Phan**
   (OR 2,13) ; cas-témoins **Benzaquen** aOR 2,64 (vilda 3,57). Effet de classe **maintenu**, ampleur corrigée.
2. **WHO EML** : gliclazide ajouté 2019 ; **glibenclamide restreint/remplacé (déconseillé ≥60 ans) en 2021**
   (22e liste), **pas « retiré en 2019 »**.
3. **ACP 2024** : reco **FORTE contre l'ajout d'iDPP4** + **pour iSGLT2/GLP-1** = **exacte** (haute certitude) ;
   mais **« arrêter SU/insuline si possible » n'est PAS une recommandation formelle** de l'ACP → **retirée**.
4. **Consoli 2020** : requalifié — « usage **limité/prudent**, 2e ligne encore acceptable chez profils
   sélectionnés », **pas « dernière option »** stricte.

**⚠ Retiré / NON vérifié (ne pas encoder tel quel)** :
- **ADA 2026 — SU/glinides courts en hyperglycémie CORTICO-INDUITE** : l'énoncé de l'OE **n'a PAS été retrouvé
  explicitement** par le red-team dans l'ADA 2026 → **à sourcer sur le texte intégral (section 9/16) avant de
  l'affirmer**. En revanche **insuline = pivot hospitalier CONFIRMÉ** (Endocrine Society 2022, PMID 35690958).
  → **§8-2 re-révisé** (ne pas s'appuyer sur cette niche tant qu'elle n'est pas sourcée).
- Non ré-extraits de la primaire (cohérents, non bloquants) : mortalité SAVOR (1,11), TECOS (1,01), CARMELINA HF
  (0,90)/albuminurie (0,86), ré-adjudication TIMI TECOS 2022, IC exacte Tkáč&Raz (bloquée reCAPTCHA), Deacon &
  Lebovitz 2016 (argument confirmé par Zhou).

**Confirmés aux chiffres près (aucune action)** : SAVOR (MACE 1,00 ; HHF 1,27 ; **NNH 143**) ; TECOS ; EXAMINE
(MACE 0,96 ; **post-hoc HHF 1,76 [1,07-2,90] chez les sans-IC**) ; CARMELINA (MACE 1,02 ; rénal dur 1,04) ;
CAROLINA (MACE 0,98 ; hypo sévère 0,3 % vs 2,2 % ; poids −1,54 kg) ; ADVANCE (néphropathie 0,79 ; hypo 1,86) ;
TOSCA.IT (0,96) ; GRADE (hypo glimépiride 2,2 % ; **sitagliptine la moins durable**) ; Simpson (gliclazide RR
0,65) ; Rados (OR 1,12 NS + TSA, 47 ECR/37 650 pts) ; **signal observationnel SU = confounding** (Azoulay RR 1,06
NS ; Douros porté par le *switch* metformine) ; **équivalence glycémique tête-à-tête** (Zhou WMD 0,08 %) ;
**pancréatite = signal significatif en méta** (OR 1,63-1,79, ARR ~0,13 %) ; FDA 2016 (saxa+alo) ; AHA/ACC/HFSA
2022 Classe III Harm (saxa+alo) ; arthralgies FDA 2015 ; linagliptine sans adaptation rénale.

**→ Statut du dossier** : dossier de preuve **triangulé (A × OE × red-team B) et réconcilié**. Les `[À VÉRIFIER]`
décisionnels sont **levés** (PMID/chiffres confirmés contre source primaire), sauf les points « NON vérifié »
ci-dessus (ADA cortico-induit ; quelques valeurs hors-abstract non bloquantes ; source CMG absente).
**Prêt pour la validation clinique référent (étape 6)** puis encodage YAML (étape 7).

### 5d. Seuils rénaux figés d'après les RCP (décision référent Q4, 2026-07-24)

Vérification directe des **RCP/SmPC** (base ANSM `base-donnees-publique.medicaments.gouv.fr` + EMA). ⚠ **Unités
hétérogènes** entre RCP (DFG mL/min/1,73m² pour sita/saxa ; ClCr mL/min pour vilda/glibenclamide ; sulfamides FR
= CI « sévère » **non chiffrée**) — aux seuils 30-50 l'écart DFG↔ClCr est faible ; l'algorithme n'a qu'une
entrée `DFG`, à documenter.

| Molécule | Pleine dose | Réduction | Palier bas / arrêt | Source |
|---|---|---|---|---|
| **Sitagliptine** | DFG ≥ 45 → 100 mg | DFG 30-44 → **50 mg** | DFG < 30 (**incl. dialyse**) → **25 mg** | RCP FR + EMA |
| **Vildagliptine** | ClCr ≥ 50 → 50 mg ×2 (×1 si + SU) | — | ClCr < 50 → **50 mg ×1/j** (seuil unique) ; prudence dialyse | SmPC |
| **Saxagliptine** | GFR ≥ 45 → 5 mg | GFR < 45 → 2,5 mg | **IRT/hémodialyse → NON recommandé** | SmPC *(révisé : < 45, pas ≤ 50)* |
| **Linagliptine** | **5 mg à TOUS les DFG, dialyse incluse — aucune borne rénale** | — | — | SmPC + EMA ✔ |
| **Gliclazide** | IR légère-modérée : **même dose + surveillance** | — | **CI en IR sévère** (qualitatif) | RCP FR |
| **Glimépiride** | démarrer **1 mg/j** | titration | **CI en IR sévère** → insuline recommandée | RCP FR |
| **Glibenclamide** | dose la plus faible | — | **CI en IR sévère** ; PK : élimination non altérée si ClCr > 30 | RCP FR |

**À encoder** : gliptines = paliers ci-dessus (linagliptine **si disponible en France** = pas d'adaptation, cf.
§8-5 & disponibilité en cours de vérif.) ; **SU = CI si `DFG < 30`** (borne d'arrêt) — ⚠ **convention KDIGO/SFD
`[secondaire]`, PAS chiffrée dans les RCP** (les 3 RCP disent « sévère » sans nombre). **⚠ Le « glibenclamide CI
si DFG < 60 » n'est PAS dans le RCP Daonil** (seul repère : ClCr 30) — le « < 60 » relève d'une prudence de bonne
pratique (SFD/OMEDIT), à marquer `[secondaire]` si retenu. Glibenclamide de toute façon **proscrit** (hypo).

### 5e. Disponibilité française des molécules (RCP/HAS/ameli, 2026-07-24) — DÉCISIVE pour le choix

**Fait structurant vérifié (HAS/Vidal/base ANSM)** : sur les 5 gliptines à AMM européenne, **seules 3 ont été
commercialisées en France — sitagliptine, vildagliptine, saxagliptine**. La **linagliptine (Trajenta) et
l'alogliptine (Vipidia) n'ont JAMAIS été commercialisées ni remboursées en France** (le doute du référent était
fondé).

| Molécule | Dispo FR | Remboursement | Note |
|---|---|---|---|
| **Sitagliptine** (+ génériques) | **OUI** | 30 % (bi/tri ; pas en monoth.) | **gliptine de choix FR** (TECOS, génériques) |
| **Vildagliptine** (+ génériques) | OUI | 15 % | alternative |
| **Saxagliptine** | OUI mais **en retrait** | 15 % | Komboglyze arrêté 30/01/2026, SMR faible → **ne pas s'appuyer dessus** |
| **Linagliptine (Trajenta)** | **NON** ⚠ | jamais | **inapplicable en France** |
| **Alogliptine (Vipidia)** | **NON** | — | non commercialisée |
| Gliclazide / glimépiride / glibenclamide (+ génér.) | OUI | 65 % | SU disponibles |

**⚠ CONSÉQUENCE MAJEURE (corrige §2/§5b/§7/§8-5)** : la reco « **linagliptine en IRC (pas d'adaptation
rénale)** » est **INAPPLICABLE en France** (molécule non commercialisée). → **En IRC, la gliptine de choix en
France = SITAGLIPTINE à dose adaptée au DFG** (100 → 50 → 25 mg, jusqu'en dialyse ; §5d) ; alternative
vildagliptine 50 mg/j (prudence dialyse). **Retirer linagliptine et alogliptine des options prescriptibles.**
Le garde-fou « pas de saxa/alo si IC » reste vrai mais **moot en pratique FR** (alo hors marché ; saxa en retrait).
Gliptine par défaut (toute situation) = **sitagliptine**.

### 5f. Vérification d'encodage bi-agents (étape 8, 2026-07-24) — 0 HAUTE / 0 MOYENNE

YAML encodé (`content/…/sulfamides-gliptines.yaml` v0.1 `statut: brouillon`) + argumentaire niveau 3 ; **Ajv +
137 tests Vitest + build/typecheck OK**. Vérification dédiée à l'encodage :
- **Agent A (fidélité)** : **0 HAUTE, 0 MOYENNE**, 3 BASSE (documentaires). Chiffres réconciliés (§5c) exacts
  (CAROLINA 0,3/2,2 % & −1,54 kg ; SAVOR NNH 143 ; pancréatite OR 1,63-1,79 ARR 0,13 % ; pemphigoïde Lee 1,42 ;
  Zhou 0,08 % ; Simpson 0,65) ; **aucun faux PMID écarté (24003177, 28918975, 25466723, 36129998, 38639547,
  28108536) n'a fui** ; décisions référent §8 respectées (coût retiré, gliptine=sitagliptine, saxa/alo/lina
  exclues, SU CI DFG<30 = convention KDIGO/SFD non-RCP) ; **discipline anti-spin tenue** (aucun bénéfice dur
  revendiqué ; SU non « cardio-toxiques » ; énoncé ADA cortico-induit explicitement marqué non étayé). BASSE :
  `preference_injection` non encodé → **incertitude ajoutée** documentant le retrait volontaire.
- **Agent B (red-team du moteur réel)** : **0 HAUTE, 0 MOYENNE**, 4 BASSE (câblage P3 / choix cliniques à
  confirmer). 10 profils tracés via le vrai `evaluateNode` (test temporaire jetable, supprimé) : socle toujours
  présent ; gliptine (rang 1) avant sulfamide (rang 2) ; déclencheur `classes_a_benefice_indisponibles` bien
  gaté ; **exclusion SU DFG<30 appliquée ET tracée** dans `excluded` (D13) ; `ne_contient_pas` empêche la
  re-proposition d'une classe en place ; alertes hypo/rénale/info firent exactement quand attendu ; **zéro OR
  dans tout le nœud → aucun piège de précédence AND/OR**.
- **Point clinique — TRANCHÉ référent (2026-07-24)** : `risque_hypoglycemie_schema == eleve` → le sulfamide
  reste **proposé mais déconseillé par alerte** (reco molle, conforme SFD « à éviter »), **PAS de gate dur**
  (« on garde comme ça »).

### 5g. Câblage dans l'app (2026-07-24)

Nœud auto-chargé (glob Vite `content/noeuds/**`, `loadNodes.ts` — aucun code par nœud) : il apparaît dans les
écrans D2/D3 sans câblage dédié (formulaire, cartes d'options, badges, `AlertList` déjà génériques — D8). **Seul
ajout de code** : le libellé du nouveau critère `classes_a_benefice_indisponibles` dans `lib/labels.ts`. Aucun
critère dérivé ni nombre optionnel (4 critères simples). **Ajv + 137 tests + build/typecheck OK.** Checklist de
validation visuelle (passe humaine) consignée dans `VALIDATION.md` (§ nœud D).

## 6. Incertitudes

- **Structure du nœud** : ordered-first-match (une sortie « éviter » + garde-fous) vs **multi-options par niche**
  (SU-coût / gliptine-tolérance) — SU et gliptine ne sont pas interchangeables → **multi-options pressenti**
  (arbitrage §8-1).
- **Déclencheur de la « place résiduelle »** : « intolérance/CI aux classes à bénéfice CV » n'est pas une
  primitive propre du dictionnaire de variables — à modéliser (dérivée de `traitements_en_cours` + CI, ou
  nouvelle variable ?). **Question de modélisation ouverte** (§8-1).
- **`contexte_aigu`** : aucune base EBM pour un usage « positif » en aigu → **ne pas créer de variable dédiée**
  (arbitrage §8-2, reco : alerte transversale au plus).
- **Position éditoriale vis-à-vis de Prescrire** : conserver une place « tolérance » à la gliptine (divergence
  assumée) ou s'aligner sur l'exclusion Prescrire ? — décision référent (§8-4).
- **Seuils de DFG** d'adaptation rénale (SU et gliptines) : valeurs à figer depuis D5 après red-team (§8-5).
- **Coût/remboursement FR** : chiffres exacts (prix génériques SU, taux de remboursement gliptines
  post-générication sitagliptine) non confirmés — impactent la force de l'argument « coût ».
- **Source CMG** absente (soins premiers) — à re-fournir pour compléter le volet reco.

## 7. → YAML (brouillon d'orientation — PRÉ-validation référent, PRÉ-red-team ; NON encodé)

> ⚠️ **Ceci est une esquisse de distillation**, pas un YAML à encoder : la collecte n'est pas red-teamée et le
> référent n'a pas tranché les arbitrages §8. Ne pas écrire `content/…/sulfamides-gliptines.yaml` avant.

Structure pressentie : **multi-options par niche** (cf. §8-1) — un **socle de fond** (message « ces classes
n'ont pas de bénéfice dur ; préférer iSGLT2/aGLP1 ») + **deux options résiduelles conditionnelles** (SU-coût,
gliptine-tolérance) + **garde-fous durs** (alertes D15). Sémantique DSL : `AND` prioritaire sur `OR`, pas de
parenthèses, `contient` pour `traitements_en_cours`.

```yaml
# ESQUISSE — à retravailler après red-team B + arbitrages §8
criteres_entree:                    # coût RETIRÉ (Q1) ; classes_a_benefice_indisponibles AJOUTÉ (Q2)
  - traitements_en_cours (liste) ; classes_a_benefice_indisponibles (bool) ; preference_injection (enum, modulateur)
  - DFG (nombre) ; risque_hypoglycemie_schema (enum) ; insuffisance_cardiaque (bool)
options:
  - intitule: "Ne pas privilégier sulfamide ni gliptine — préférer metformine + iSGLT2/aGLP1"
    conditions: ["toujours"]          # socle de fond, priorite 0 (D16)
    niveau_preuve: eleve              # le NON-bénéfice dur est solidement établi (CVOT concordants)
  - intitule: "Gliptine (sitagliptine) — place résiduelle « tolérance / anti-hypo, orale »"
    conditions: ["classes_a_benefice_indisponibles == true"]   # Q2/Q3 (iSGLT2 ET GLP-1 CI/non tolérés/refusés)
    priorite: 1                       # PRÉFÉRÉE au SU (ordre HAS/SFD iDPP4 > SU)
    niveau_preuve: modere             # substitution ; zéro bénéfice dur ; profil EI chargé à afficher
    molecule: "sitagliptine (TECOS ; remboursée FR ; DFG bas → 100→50→25). ⚠ linagliptine & alogliptine JAMAIS
               commercialisées FR (§5e, exclues) ; saxagliptine en retrait (Komboglyze arrêté 01/2026) → écartée"
  - intitule: "Sulfamide (gliclazide MR ou glimépiride) — place résiduelle « sécrétagogue oral »"
    conditions: ["classes_a_benefice_indisponibles == true"]
    priorite: 2                       # DERRIÈRE la gliptine ; coût N'EST PLUS un gate (Q1)
    niveau_preuve: modere             # efficacité glycémique (substitution) ; zéro bénéfice dur ; hypo + poids assumés
    molecule: "gliclazide MR ou glimépiride ; JAMAIS glibenclamide"
exclusions / garde-fous durs (alertes D15):
  - "insuffisance_cardiaque == true → PAS de saxagliptine NI alogliptine (AHA/ACC/HFSA Classe III) — moot en FR (hors marché) ; sitagliptine OK"
  - "glibenclamide → à proscrire (hypo sévères/prolongées, surtout âgé/IRC)"
  - "risque_hypoglycemie_schema == eleve OU âgé/IRC → SU déconseillé (hypo sévère)"
  - "DFG < 30 → SU CI (borne KDIGO/SFD [secondaire], pas RCP-chiffrée) ; gliptine : sitagliptine 100→50 (DFG 30-44)→25 (<30, dialyse incl.), vilda <50→50×1 (§5d ; linagliptine indisponible FR)"
  - "ne jamais associer gliptine + aGLP1 (redondance incrétine — cf. nœud C ; corroboré ebmfrance « DPP4i if GLP1a not taken »)"
reco_officielle:
  source: "HAS 2024 (R.61/69/74/78) ; SFD 2025 (Avis 10/11/16-17) ; ADA/EASD 2022 (PMID 36148880) ; ebmfrance/Duodecim (soins premiers) ; ACP 2024 (PMID 38639546)"
  position: "2e/3e ligne non préférentielle ; gliptine avant SU ; sitagliptine (fallback athéromateux)"
  divergence: true   # Prescrire écarte les gliptines « quelle que soit la situation » ; ACP 2024 = ne pas ajouter d'iDPP4
```

## 8. Arbitrages référent — TRANCHÉS (référent Thibault, 2026-07-24) + reste

1. **Structure du nœud — TRANCHÉ (Q1)** : **multi-options** — socle `["toujours"]` + gliptine (priorité 1) +
   sulfamide (priorité 2), déclenchées par `classes_a_benefice_indisponibles`. **⚠ Le coût N'EST PAS un critère
   en France** (SU et gliptines remboursés) → `contrainte_cout` **retiré** ; l'argument « coût » du SU est
   propre au système (flowchart Duodecim/ebmfrance : branche « price decisive » = « Finnish reimbursement »).
2. **`contexte_aigu` (corticothérapie/hospitalisation)** : variable d'entrée dédiée **ou** hors périmètre ?
   **⚠ ÉTAT APRÈS RED-TEAM (§5c)** — nuance mais **prudence** : l'OE affirmait que l'**ADA 2026 endosse les
   SU/glinides courts dans l'hyperglycémie cortico-induite**, **mais le red-team n'a PAS retrouvé cet énoncé
   explicite** dans l'ADA 2026 → **NON sourcé, ne pas s'en prévaloir tel quel**. Ce qui **est** confirmé :
   l'**insuline = pivot en hospitalisation** (Endocrine Society 2022, PMID 35690958) ; en aigu SU/glinides +
   iSGLT2 sont **suspendus**. → **Reco maintenue : NE PAS créer de variable `contexte_aigu`** ; au plus une
   **alerte transversale** « en situation aiguë (cortico, chirurgie, sepsis, jeûne) : insuline, suspendre
   SU/glinides + iSGLT2 — hors périmètre de ce nœud ». *(Si le référent veut outiller la corticothérapie
   ambulatoire, re-sourcer d'abord l'énoncé ADA sur le texte intégral section 9/16.)* **À confirmer référent.**
3. **Déclencheur de la place résiduelle — TRANCHÉ (Q2/Q3)** : nouvelle variable **`classes_a_benefice_indisponibles`
   (bool)** = iSGLT2 **ET** GLP-1 tous deux CI/non tolérés/refusés (le refus des injectables est un motif possible
   pour le GLP-1). **Gliptine = niche tolérance** dans cette situation (Q3) ; `preference_injection == refuse` =
   modulateur renforçant l'oral. **Granularité molécule** (D12) confirmée par l'EBM : sitagliptine / gliclazide-glimépiride.
4. **Position vis-à-vis de Prescrire — TRANCHÉ (Q3)** : l'outil **conserve une place résiduelle « tolérance » à
   la gliptine** (déclenchée par `classes_a_benefice_indisponibles`), **divergence assumée** avec Prescrire (qui
   l'écarte) — la reco officielle + ACP 2024 sont affichées à côté.
5. **Seuils de DFG + molécules disponibles — TRANCHÉ (Q4 + vérif. dispo, §5d/§5e)** : seuils figés d'après les
   **RCP**. **⚠ Disponibilité France CONFIRMÉE** : **linagliptine (Trajenta) et alogliptine (Vipidia) n'ont
   JAMAIS été commercialisées en France → exclues des options** ; **saxagliptine en retrait** (Komboglyze arrêté
   30/01/2026) + signal IC → écartée. **Gliptine par défaut et en IRC = SITAGLIPTINE à dose adaptée**
   (100→50→25, jusqu'en dialyse) ; alternative vildagliptine 50 mg/j. La reco initiale « linagliptine en IRC »
   est **abandonnée** (inapplicable FR). Garde-fou IC saxa/alo = **moot en pratique FR**.
6. **Textes Prescrire** : P3 (août 2023) déjà distillé dans `prescrire-dt2.md` ; aucun autre requis pour D.
7. **Source CMG — TRANCHÉ (Q5)** : **il n'existe pas de source CMG** ; ancrage soins premiers = fiche **ebmfrance
   « Traitement global et suivi du DT2 »** (`sources/…ebmfrance.pdf`, Duodecim contextualisé FR — flowchart
   ADA/EASD). Le fichier `mmm_referentielmcg_ep11.pdf` = hors-série SFD 2017 sur la **Mesure Continue du Glucose**
   (PAS le Collège de la Médecine Générale) — **inventaire `00-global.md` + note mémoire à corriger**. *(Le
   fichier `pdp_pompe_insuline_externe_mcg.pdf` concerne les pompes → nœud E.)*

## Annexe — Prompts OpenEvidence (débroussaillage référent, 2ᵉ passe)

5 prompts (OE-D1 à OE-D5) à lancer dans OpenEvidence **en parallèle** des agents A (triangulation A × B × OE,
`00-global.md` étape 4). **OE = débroussaillage, jamais source primaire** ; tout PMID/DOI/chiffre renvoyé sera
re-vérifié contre la source primaire au red-team. Chaque prompt exige explicitement l'effet **absolu / NNT-NNH
(+ horizon)**, la distinction **critère dur vs substitution**, et une appréciation **GRADE**.

**Périmètre OE — sources FR proscrites du prompt** : ne jamais demander à OpenEvidence d'explorer/citer
**HAS, SFD, CMG, Prescrire, Médicalement Geek/DragiWebdo, Minerva, ebmfrance** (accès non fiable → il
hallucine PMID/URL/positions). Ces sources sont curées **par les agents** (`docs/decision/sources/` + web +
référent). Cf. `00-global.md` (Règles de sourcing) et `BRIEF_DECISION.md` §14bis.

### OE-D1 — DPP-4 inhibitor cardiovascular outcome trials & heart-failure signal

> In adults with **type 2 diabetes**, what is the effect of **DPP-4 inhibitors (gliptins)** on **hard
> cardiovascular outcomes** when added to standard care versus placebo? Cover the four dedicated CVOTs —
> **SAVOR-TIMI 53** (saxagliptin), **TECOS** (sitagliptin), **EXAMINE** (alogliptin, post-ACS) and
> **CARMELINA** (linagliptin). For each give **PMID/DOI, year, journal, design, population (n, background
> therapy), comparator, follow-up**. Report the **primary MACE result as absolute event rates per arm +
> HR/CI**, and specifically the **hospitalisation-for-heart-failure result** (absolute rates per arm, HR/CI,
> and **NNH** where increased — the saxagliptin signal, and the EXAMINE/alogliptin post-hoc analysis). Report
> **all-cause mortality**, renal outcomes (CARMELINA), and pancreatitis. Make explicit that these are
> **non-inferiority safety trials showing NO cardiovascular benefit** on hard outcomes, and clearly separate
> **hard endpoints from HbA1c**. Which gliptins carry a **heart-failure class signal** (saxagliptin,
> alogliptin) and which appear neutral (sitagliptin, linagliptin)? Give a **GRADE** appraisal. Flag any figure
> you cannot source to a primary trial.

### OE-D2 — Sulfonylurea cardiovascular safety & active-comparator trials

> In adults with **type 2 diabetes**, are **sulfonylureas (SU)** associated with increased **cardiovascular
> events or mortality**, and how do modern SU compare with active comparators? Cover **CAROLINA** (linagliptin
> vs **glimepiride** — the first active-comparator CVOT: MACE result, and **severe hypoglycaemia + weight** per
> arm), **ADVANCE** (gliclazide MR intensive control: micro- vs macrovascular and mortality outcomes, severe
> hypoglycaemia), **TOSCA.IT** (SU vs pioglitazone add-on: MACE), the **GRADE study** (glimepiride vs
> sitagliptin vs liraglutide vs insulin glargine on metformin — glycaemic durability + CV + hypoglycaemia per
> arm) and the **older SU–mortality meta-analyses / observational data** (e.g. **Simpson 2015** *Lancet
> Diabetes Endocrinol*, **Rados 2016** *PLoS Med*, **Monami**), distinguishing **glibenclamide/glyburide
> (worse) vs gliclazide/glimepiride**. For each give **PMID/DOI, year, design, absolute rates / HR / CI,
> follow-up**. Separate **hard outcomes** from HbA1c. Is there robust **randomised** evidence that modern SU
> **increase** CV events? Give a **GRADE** appraisal. Flag any unsourced figure.

### OE-D3 — Glycaemic efficacy, durability & residual place (cost, tolerability) of SU and gliptins

> In adults with **type 2 diabetes**, compare the **glycaemic efficacy and durability** of **sulfonylureas**
> and **DPP-4 inhibitors**. Report the typical **HbA1c reduction (absolute %)** for each class (SU ~1–1.5 %,
> DPP-4i ~0.5–0.8 % — confirm) and the **durability of glycaemic control / secondary failure**, citing
> **ADOPT** (glyburide vs metformin vs rosiglitazone monotherapy durability — Kahn, *NEJM* 2006), **UKPDS**,
> and the durability findings of the **GRADE study**. Give **PMID/DOI, design, follow-up**. Be explicit that
> the meaningful endpoint here is a **surrogate (HbA1c/durability)** and that **neither class has demonstrated
> a hard-outcome (CV/mortality) benefit**. Then summarise the **evidence-based case for their residual place**:
> for SU, **low cost / global access**; for DPP-4i, **oral, weight-neutral, very low hypoglycaemia risk, good
> GI tolerability** but moderate cost and a loaded adverse-effect profile — i.e. their role when the classes
> with proven CV benefit (**SGLT2 inhibitors, GLP-1 receptor agonists**) are contraindicated, not tolerated,
> refused, or inaccessible. Give a **GRADE** appraisal. Flag any unsourced figure.

### OE-D4 — International guideline positioning + acute context (FR sources exclus)

> In adults with **type 2 diabetes**, what place do **international clinical guidelines indexed in the
> peer-reviewed literature** give to **sulfonylureas** and **DPP-4 inhibitors**? Cover the **ADA/EASD 2022
> consensus report** and recent **ADA Standards of Care**: at which treatment line are SU/DPP-4i placed, and
> under what conditions (**cost** as a decisive factor → SU; need to **avoid hypoglycaemia without injection**
> → DPP-4i)? Then give the **evidence-based critical caveat straight from the primary trials** (no hard-outcome
> benefit for either class; SU hypoglycaemia + weight gain; the gliptin heart-failure signal) showing both
> classes sit **below** SGLT2 inhibitors and GLP-1 receptor agonists. Finally: do any **indexed** sources
> address **transient use in acute contexts** (corticosteroid-induced hyperglycaemia, hospitalisation)? Give
> **PMID/DOI** for each guideline and trial; **if you cannot ground a claim in a real indexed document, say so
> — do not invent a reference.** **Do NOT attempt to cover, summarise or cite French / independent-EBM sources
> (HAS, SFD, CMG/Collège de la Médecine Générale, Prescrire, Médicalement Geek/DragiWebdo, Minerva): the
> analysts curate those separately from the local corpus and the référent.** Flag anything unsourced.

### OE-D5 — Non-CV safety, renal dosing & interactions of gliptins and SU

> In adults with **type 2 diabetes**, detail the **non-cardiovascular safety** and **renal dosing** of
> **DPP-4 inhibitors** and **sulfonylureas**. For **gliptins**: **acute pancreatitis** (signal largely **not
> confirmed** in the CVOTs — state the evidence), **bullous pemphigoid** (established class effect — level of
> evidence, which molecules e.g. vildagliptin, linagliptin), **severe arthralgia** (**FDA 2015 warning**),
> Stevens-Johnson / angio-oedema and intestinal obstruction (as claimed by Prescrire — verify their solidity),
> and **renal dose adjustment** (sitagliptin / vildagliptin / saxagliptin require dose reduction by eGFR;
> **linagliptin requires no renal adjustment** — biliary excretion — an advantage in advanced CKD; give
> indicative eGFR thresholds). For **sulfonylureas**: **severe / prolonged hypoglycaemia** (worst with
> **glibenclamide / glyburide**, and in renal impairment / the elderly; intra-class hierarchy glibenclamide >
> glimepiride > gliclazide MR), **weight gain**, hyponatraemia, disulfiram-like reaction, and **use in renal
> impairment** (avoid glibenclamide; gliclazide / glimepiride with caution and dose reduction; indicative eGFR
> thresholds). Give **PMID/DOI and agency / SmPC source** where possible, and separate **established** from
> **hypothetical** signals. Give a **GRADE** / level-of-evidence appraisal. Flag any unsourced figure.
