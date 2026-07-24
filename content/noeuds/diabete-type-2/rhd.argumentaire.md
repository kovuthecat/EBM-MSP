# RHD, perte de poids et rémission — argumentaire exhaustif (niveau 3)

> Nœud **H** du domaine `diabete-type-2`. **Outil d'aide à la recommandation en médecine générale** : il aide
> à formuler des recommandations hygiéno-diététiques adaptées au patient et à en **présenter les bénéfices
> attendus** ; il ne prescrit pas une prestation. Le médecin **recommande, informe et oriente** — le programme
> intensif relève de soins spécialisés / coordonnés. Dossier de preuve : `docs/decision/noeuds/H-rhd.md`
> (5 agents A + red-team B1→B5 + OpenEvidence OE-H1→H5 + red-team primaire des essais OE + lecture directe
> HAS 2024 / HAS parcours obésité / SFD 2025 / EBM Guidelines-ebmfrance / Prescrire).

## Message central

Trois idées structurent ce nœud :

1. **Le socle hygiéno-diététique se recommande à tous**, quel que soit le traitement médicamenteux — mais son
   **seul bénéfice sur critère cardiovasculaire dur** démontré est celui du **régime méditerranéen**.
2. **La rémission par perte de poids est réelle mais bornée** : substantielle à 1 an, elle **s'érode fortement**
   et **n'a jamais démontré de bénéfice sur les critères durs** (CV, mortalité). C'est un objectif **réaliste
   mais non garanti**, à proposer surtout au diabète récent, jamais à survendre.
3. **Anti-sur-promesse** : le seul grand essai à critère dur d'une intervention intensive sur le mode de vie
   (**Look AHEAD**) est **neutre** sur les événements cardiovasculaires et la mortalité. La perte de poids est
   un objectif de contrôle, de comorbidités et de qualité de vie — pas une promesse de survie.

## Option 1 — Socle hygiéno-diététique (recommandé à tous)

Alimentation de type **méditerranéen**, **activité physique adaptée**, objectif de perte de poids **≥ 5-10 %**
en cas de surpoids/obésité. Approche **personnalisée, réaliste et non culpabilisante** (HAS parcours obésité :
objectif de poids individualisé, « la stabilisation du poids est déjà un succès », éviter les régimes restrictifs
rigides ; éducation thérapeutique dès le diagnostic, grade B USPSTF).

| Levier | Effet | Critère | Preuve |
|---|---|---|---|
| Régime méditerranéen | Événements CV majeurs **HR 0,69/0,72 par bras** (PREDIMED ; sous-groupe diab. non vérifiable en primaire) ; **HR 0,72, NNT ~20/7 ans** (CORDIOPREV) | **DUR** | 2 ECR (primaire + secondaire, ~50 % de diabétiques) — GRADE modéré |
| Activité physique structurée | **HbA1c −0,5 à −0,7 %** | substitution | métas Umpierre/Boulé — GRADE modéré |
| Régime méditerranéen (DT2 récent) | Retarde la 1re médication **HR 0,63** (0,70 ajusté sur la perte de poids) | substitution | Esposito (monocentrique) |
| Perte de poids 5-10 % | Amélioration glycémie + FDR CV | substitution | SFD/HAS/RBP FFN 2022 |

**Honnêteté** : le bénéfice **dur** se limite au régime méditerranéen. L'exercice et la restriction diététique
n'ont montré qu'un effet sur des **substituts**. L'**intervention intensive** sur le mode de vie **n'a pas réduit
les événements cardiovasculaires ni la mortalité** (Look AHEAD : critère 1aire **HR 0,95 [0,83-1,09]**, arrêté
pour futilité ; mortalité toutes causes **HR 0,91 [0,81-1,02]** à 16,7 ans, NS). Bénéfices secondaires réels de
Look AHEAD (apnée du sommeil, mobilité, néphropathie **HR 0,69**, qualité de vie) = substituts / critères
secondaires. Le régime méditerranéen hypocalorique + activité (**PREDIMED-Plus**) n'a **pas encore** de critère
CV dur publié. À noter : l'alimentation et l'activité physique sont bénéfiques **même sans perte de poids**
(grade A, ebmfrance).

## Option 2 — Perte de poids importante visée rémission (informer, recommander, orienter) — si IMC ≥ 27

**En médecine générale : informer** le patient de la possibilité d'une rémission (grade A, ebmfrance) et
**l'orienter** vers un accompagnement structuré (diététicien, programme type substituts de repas / DiRECT). Le
généraliste ne délivre pas le programme.

| Essai | Population | Rémission | Durabilité |
|---|---|---|---|
| **DiRECT** (Lean) | DT2 ≤ 6 ans, IMC 27-45 | **46 %** (1 an) vs 4 % ; **36 %** (2 ans) | **13 %** à 5 ans ; dose-dépendante : **64 %** si ≥ 10 kg maintenus |
| **DIADEM-1** (Taheri) | DT2 ≤ 3 ans, MENA | **61 %** (1 an) vs 12 % | (12 mois) |
| Vie réelle (Wu, HK) | routine | 6,1 % | **67 % de rechute** (~3,1 ans) |

**La rémission est un critère de SUBSTITUTION.** Définition consensuelle (ADA/EASD/Diabetes UK/Endocrine
Society 2021) : HbA1c < 6,5 % ≥ 3 mois après arrêt des hypoglycémiants. **Aucun essai** ne démontre qu'atteindre
une rémission (non chirurgicale) réduise les événements CV ou la mortalité ; l'association rémission → événements
(Gregg 2024, dans Look AHEAD : CVD **HR 0,60**) est **observationnelle**, confondue par indication (les
rémitteurs sont plus jeunes, à diabète plus récent, en meilleure santé). Ce n'est **pas une guérison** :
surveillance métabolique à vie, rechute fréquente si reprise de poids.

**Modulateur `anciennete_diabete_annees`** (message, pas éligibilité — §8-2) : la probabilité de rémission est
plus élevée si le diabète est récent (fenêtre DiRECT/DIADEM-1 < 6 ans). **Kanbour 2025** (méta-régression) : le
**prédicteur dominant est l'ampleur de la perte de poids** — après ajustement, l'ancienneté n'est plus
indépendamment associée (conclusion écologique ; la réserve β-cellulaire garde une plausibilité biologique).
D'où le gate sur l'IMC seul, l'ancienneté modulant le **message** : au-delà de la fenêtre, viser
« l'amélioration du contrôle », pas la rémission.

**Objectif de perte de poids** (§8-3, porté par l'effet attendu, pas un critère d'entrée) : **≥ 5-10 %** pour le
socle (contrôle/FDR) ; **≥ 10-15 % / ≥ 10-15 kg** pour la visée rémission (magnitude associée à la rémission —
DiRECT, Kanbour).

## Alertes

- **Chirurgie métabolique — « y penser »** (IMC ≥ 35) : orienter vers une évaluation en soins spécialisés
  (IMC ≥ 40, ou ≥ 35 + comorbidité sévère améliorable — le DT2 qualifie — après 6-12 mois de PEC médicale sans
  bénéfice suffisant, préparation ≥ 6 mois, CSO, suivi à vie ; HAS parcours obésité). La SFD 2025 ouvre en outre
  l'indication à IMC 30-34,9 au cas par cas. Preuve de **rémission par ECR** (STAMPEDE : HbA1c ≤ 6,0 % 29 % vs
  5 % ; Mingrone : rémission 25-50 % vs 5,5 % à 10 ans ; ARMMS-T2D : 12,7 % vs 0 % à 12 ans) ; bénéfice sur
  **critères durs exclusivement observationnel** (SOS : mortalité HR 0,71 ; Aminian MACE HR 0,61 ; Fisher HR
  0,60) — **aucun ECR de mortalité/CV**. Décision hors outil.
- **Modulation de la probabilité de rémission** par l'ancienneté (fenêtre favorable < 6 ans vs moins probable
  au-delà).
- **Marge de manœuvre** : mode de vie déjà optimisé → « maintenir/renforcer », bénéfice additionnel limité,
  envisager d'autres leviers (nœuds B/C) si le contrôle reste insuffisant.
- **Activité adaptée** (capacité limitée) ; **adhésion à renforcer** (objectifs modestes négociés).
- **Hypoglycémie** : sous insuline, sulfamide ou glinide, la perte de poids majore le risque d'hypoglycémie →
  anticiper l'allègement / la déprescription (nœuds C/D/E).
- **Sujet âgé/fragile/dénutri** : maintien de la masse musculaire, pas de restriction agressive (sarcopénie).

## Reco officielle vs position critique — divergence

**Consensus complet sur le socle hygiéno-diététique** (1re ligne, socle permanent) : HAS 2024, HAS parcours
obésité, SFD 2025, ADA/EASD 2022, ebmfrance (grade A), Prescrire. **Divergences** :

1. **Ampleur de perte de poids** : ≥ 5 % (HAS/SFD ; 3-5 % pour le risque métabolique, 5-10 % pour PA/lipides —
   RBP FFN 2022) vs **5-15 % « primary target »** (ADA/EASD).
2. **Voie de la rémission** *(divergence de conception centrale)* : l'**EBM** (DiRECT/DIADEM-1, ebmfrance grade A)
   et **ADA/EASD** soutiennent la **rémission par la diète intensive** ; la **SFD 2025 confine la rémission à la
   chirurgie** et **n'endosse pas** le remplacement total de l'alimentation (TDR cité seulement en préopératoire,
   « sans réel niveau de preuve »). La HAS parcours obésité n'évoque la rémission qu'en contexte post-bariatrique.
   → **L'outil affiche la voie diététique (EBM) à côté de la reco officielle française (chirurgie), divergence
   signalée** (décision référent §8-6 : garder l'option EBM et signaler la divergence).
3. **Statut « objectif »** de la rémission (ADA/EASD/SFD-chirurgie) vs **critère de substitution non validé sur
   critères durs** (Prescrire, Minerva ; Look AHEAD neutre). Position raisonnée de l'outil : rémission = objectif
   **réaliste mais non garanti**, jamais de promesse de survie.

**Note conflits d'intérêt** : les recos SFD 2025 et ADA/EASD sont cosignées avec des liens d'intérêt industriels
étendus (comme relevé pour le nœud statine) ; l'outil pondère avec les sources critiques indépendantes.

## Incertitudes

- Rémission = **substitut** ; pas de preuve dure ; associations rémission → événements observationnelles (Gregg
  2024), confondues.
- **Durabilité** faible (DiRECT 46 % → 13 % à 5 ans ; ~67 % de rechute en vie réelle).
- Fenêtre de rémission gatée sur l'IMC seul ; ancienneté = modulateur (Kanbour écologique vs plausibilité
  β-cellulaire).
- Chirurgie : le seuil 30-34,9 « après échec médical » n'est pas gaté par le moteur (H ne collecte pas
  d'indicateur de contrôle glycémique) — l'alerte se déclenche à IMC ≥ 35 et le message rappelle le cas 30-34,9.
- PREDIMED-Plus : critère CV dur non publié ; PREDIMED entaché par sa rétractation/republication (2018).
- **Prévention** du DT2 (prédiabète, hors périmètre) : le mode de vie réduit l'incidence ~30-55 % mais, à 15 ans
  (DPPOS), **sans bénéfice démontré sur les complications micro-angiopathiques** ni sur la mortalité — argument
  de prudence transverse.

## Sources principales (DOI/PMID)

- **DiRECT** — Lean, *Lancet* 2018, [10.1016/S0140-6736(17)33102-1](https://doi.org/10.1016/S0140-6736(17)33102-1) ;
  extension 5 ans, *Lancet Diabetes Endocrinol* 2024, [10.1016/S2213-8587(23)00385-6](https://doi.org/10.1016/S2213-8587(23)00385-6).
- **DIADEM-1** — Taheri, *Lancet Diabetes Endocrinol* 2020, [10.1016/S2213-8587(20)30117-0](https://doi.org/10.1016/S2213-8587(20)30117-0).
- **Look AHEAD** — *NEJM* 2013, [10.1056/NEJMoa1212914](https://doi.org/10.1056/NEJMoa1212914) ; rémission Gregg, *JAMA* 2012, [10.1001/jama.2012.67929](https://doi.org/10.1001/jama.2012.67929) ; rémission → issues Gregg, *Diabetologia* 2024 (PMID 38233592).
- **Kanbour** — méta-régression, *Lancet Diabetes Endocrinol* 2025, [10.1016/S2213-8587(24)00346-2](https://doi.org/10.1016/S2213-8587(24)00346-2).
- **PREDIMED** — *NEJM* 2018 (republ.), [10.1056/NEJMoa1800389](https://doi.org/10.1056/NEJMoa1800389) ; **CORDIOPREV** — *Lancet* 2022, [10.1016/S0140-6736(22)00122-2](https://doi.org/10.1016/S0140-6736(22)00122-2).
- **Umpierre** — *JAMA* 2011, [10.1001/jama.2011.576](https://doi.org/10.1001/jama.2011.576) ; **Esposito** — *Ann Intern Med* 2009 (PMID 19721018).
- **STAMPEDE** — *NEJM* 2017, [10.1056/NEJMoa1600869](https://doi.org/10.1056/NEJMoa1600869) ; **Mingrone** — *Lancet* 2021, [10.1016/S0140-6736(20)32649-0](https://doi.org/10.1016/S0140-6736(20)32649-0) ; **ARMMS-T2D** — Courcoulas, *JAMA* 2024 (PMID 38411644) ; **SOS** — *NEJM* 2007, [10.1056/NEJMoa066254](https://doi.org/10.1056/NEJMoa066254).
- **Consensus rémission** — Riddle, *Diabetes Care* 2021, [10.2337/dci21-0034](https://doi.org/10.2337/dci21-0034).
- **Recos** : SFD 2025 (Darmon, *Méd Mal Métab* 2025;19(8):630-662) ; HAS 2024 (stratégie DT2) ; HAS parcours
  surpoids-obésité de l'adulte (2023, MàJ 2024) ; ADA/EASD 2022 (Davies, *Diabetes Care* 2022;45(11):2753, PMID
  36148880) ; EBM Guidelines/ebmfrance ; Prescrire (`docs/decision/sources/prescrire-dt2.md`, P1/P2/P9-P13).
