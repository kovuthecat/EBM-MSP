# Insulinothérapie du DT2 — argumentaire exhaustif

> Niveau de lecture 3 (preuve complète). Document autonome distillé du dossier de preuve
> `docs/decision/noeuds/E-insuline.md` (sources croisées et vérifiées, PMID/DOI
> vérifiés et **corrigés** contre source primaire — §5b). **VALIDÉ CLINIQUEMENT PAR LE RÉFÉRENT le
> 2026-07-29** (`insuline.yaml` v0.31, `meta.statut: valide`).
>
> **Mis à jour le 2026-07-29 — passe A « piloter l'insuline sans capteur »** (revue de preuve dédiée,
> conciliation, 8 arbitrages référent). Nouveautés : **§ 5 bis** (la branche
> capillaire, entièrement neuve) ; correction de deux mésattributions dans du contenu **publié** (l'algorithme
> de titration n'est **pas** celui de Treat-to-Target ; le seuil de 1,80 g/L n'est porté par **aucune** des
> trois références qui lui étaient adossées) et d'un chiffre **sans aucune source** (« ± 10-20 % », dont la
> borne haute n'existe nulle part et qui s'affichait en dose calculée). Dossier de preuve correspondant :
> `docs/decision/noeuds/E-insuline.md` **§3 SOUS-DOSSIER E6**.

## En bref

Quand une insuline devient nécessaire dans le DT2, quatre situations se présentent — **initier** une basale,
**optimiser** une basale, **ajouter un bolus** (basal-plus), **adapter** un basal-bolus. Fils directeurs :

- **La basale d'abord, en gardant les non-insulines.** Insuline basale + antidiabétiques (oraux et/ou GLP-1)
  = meilleur profil de tolérance parmi les schémas testés en essai randomisé (4T : hypoglycémie 2,3 vs
  12,0 évén./patient/an et poids +1,9 vs +5,7 kg vs un schéma prandial à 1 an, PMID 17890232). Les schémas
  **prandial et prémélangé systématiques ne sont pas fondés sur les preuves** (surcroît d'hypoglycémie et
  de poids, gain d'HbA1c modeste — Bertuol, méta-analyse en réseau 2026).
- **Intensifier par étapes, GLP-1 avant le bolus.** Sur une basale insuffisante, ajouter un GLP-1 (ou une
  association fixe) donne le même contrôle que le basal-bolus avec **moins d'hypoglycémie et de poids** ;
  réserver le bolus (basal-plus au repas principal, puis basal-bolus) aux cas où basale + GLP-1 sont insuffisants.
- **Sécurité d'abord, pas de sur-promesse.** Molécule et cible pilotées par le **risque hypoglycémique**
  (analogues de 2ᵉ génération si risque élevé). L'insuline **améliore le contrôle et le microvasculaire mais
  n'a aucun bénéfice cardiovasculaire démontré** (ORIGIN neutre).
- **La MCG guide, elle ne décide pas.** Les cibles de Time in Range sont un **consensus**, pas un critère
  dur ; elles servent l'interprétation et les alertes. Seule la dimension **hypoglycémie** (temps sous la
  cible, variabilité) pilote des recommandations de sécurité.

## 1. Quand initier — et pourquoi la basale (argumentation négative du prandial/prémix)

**Quand.** L'insuline s'instaure lorsque la cible d'HbA1c (issue du nœud A) n'est pas atteinte malgré les
non-insulines optimisées (le GLP-1 étant préféré comme premier injectable), en cas de contre-indication /
intolérance à celles-ci, ou d'emblée en cas de **glucotoxicité symptomatique** (polyuro-polydipsie,
amaigrissement) — HAS 2024 (R.89 : HbA1c ≥ 10 % ou glycémies > 3 g/L répétées → schéma intensifié d'emblée),
ADA 2026 (rec 9.20). *À noter : la HAS déclenche sur des seuils glycémiques, le critère « symptômes »
est propre à l'ADA.*

**Basale = choix.** L'association agents oraux + insuline basale du soir est confirmée par l'essai randomisé
ci-dessous. Le bras basal a le meilleur profil de tolérance :

| Étude | Comparaison | Hypoglycémie | Poids | HbA1c |
| --- | --- | --- | --- | --- |
| **4T 1 an** (PMID 17890232) | basal détémir vs biphasique vs prandial (ajout oraux) | **2,3 vs 5,7 vs 12,0** évén./pt/an | **+1,9 vs +4,7 vs +5,7 kg** | 7,6 vs 7,3 vs 7,2 % |
| **4T 3 ans** (PMID 19850703) | idem, avec intensification | médiane **1,7 vs 3,0 vs 5,7** | basal le moindre | converge ~6,8-7,1 % ; **81,6 %** du bras basal ont dû ajouter un 2ᵉ type |
| **Bertuol NMA 2026** (58 ECR, 19 122 pts) | vs basale | hausse **limite** de l'hypo sévère | **+~1 kg** | prandial −0,38 %, biphasique −0,24 %, basal-bolus −0,31 % |

**Argumentation négative.** Le gain d'HbA1c des schémas complexes est **modeste** (0,24-0,38 %, substitut) et
se paie en hypoglycémie et en poids ; à 3 ans (4T), lorsque la plupart des patients basal ont été intensifiés,
les HbA1c convergent — l'avantage cumulé du départ en basale (moins d'hypo, moins de poids) persiste. D'où :
**prandial et prémélangé écartés de la 1ʳᵉ intention** — gain d'HbA1c modeste (0,24-0,38 %, substitution)
qui se paie en hypoglycémie et en poids. **Niveau de preuve : modéré à élevé** (essais robustes ; critères
de substitution + sécurité).

**Titration.** Dose initiale = **poids × 0,1-0,2 U/kg/j** (repli fixe 10 U le soir si le poids n'est pas
disponible — **DONNÉE À FOURNIR** : position pragmatique usuelle, non validée spécifiquement par un essai
identifié dans le dossier de preuve), auto-ajustement **+2 U** si la glycémie à jeun reste au-dessus de la
cible **3 matins de suite** (ou **+10 %** par paliers si dose > 40 U), adaptation **tous les 3 jours** ;
cible **0,70-1,30 g/L**.

*Sourçage corrigé le 2026-07-29 (passe A, défauts D2/D3).* Cet algorithme était présenté comme « validé par
Treat-to-Target ». **Il ne l'est pas** : Riddle 2003 (PMID 14578243) titre **par semaine**, en paliers
**gradués +2/+4/+6/+8 U** selon l'écart, vers une cible **≤ 1,00 g/L**. Rien de ce que l'outil affiche ne
vient de cet essai — **seul le « ~60 % atteignent la cible » est de lui**, et il vaut pour le *principe*
d'une titration pilotée par la glycémie à jeun, pas pour ce protocole-ci. Chaque élément est désormais rendu
à sa source : **« 3 matins de suite » = ebmfrance** (verbatim) · **rythme de 3 jours et symétrie
montée/descente = HAS 2024 R.87** (grade accord d'experts, qui écrit « augmentée **ou réduite** de 1 ou
2 UI ») · **pas de 2 U et palier au-delà de 40 U = SFD 2025 Avis 18**. La borne « +10-**20** % » qui figurait
ici **n'avait aucune source** — la SFD écrit 10 %, l'ADA 10-15 %, personne n'écrit 20 % : ramenée à 10 %.
**Aucun essai n'a jamais randomisé une règle de titration de ce type**, ni *a fortiori* une règle de
descente : c'est un accord d'experts, à force forte et à certitude très faible.

**Cohérence de saisie (2026-07-26).** Un patient déclaré « naïf d'insuline » ne peut, par définition, avoir
déjà une insuline basale dans ses traitements en cours — le prérequis qui retire silencieusement l'option
« Initier une insuline basale » dans ce cas (2026-07-25) est correct mais insuffisant seul : une alerte de
nœud le dit désormais explicitement au praticien (incohérence situation/traitements déclarés).

## 2. Choix de la molécule basale — hypoglycémie nocturne (substitut) vs sévère (dur)

Chez le patient à risque d'hypoglycémie (âgé, fragile, insuffisance rénale, hypoglycémies nocturnes, **ou
antécédent d'hypoglycémie sévère récurrente — cf. `risque_hypoglycemique_eleve`, ci-dessous**), préférer un **analogue
de 2ᵉ génération** (glargine U300 ou degludec) à glargine U100 / détémir, a fortiori à la NPH.

*Correction 2026-07-26.* L'antécédent d'hypoglycémie sévère
récurrente (`hypo_severe_recurrente`) — le signal de sécurité le plus direct collecté par ce nœud, un fait
observé plutôt qu'un drapeau déclaratif de fragilité — n'orientait jusqu'ici jamais ce choix : un patient
non fragile, non âgé, à espérance de vie longue, dont le SEUL marqueur de risque était cet antécédent,
recevait la même recommandation qu'un patient sans aucun facteur de risque. Le même signal pilotait
pourtant déjà, plus loin dans ce nœud, la désintensification du basal-bolus (§4) — même concept de
sécurité, deux encodages. Fusionné dans le dérivé `risque_hypoglycemique_eleve` (arbitrage, cf. `insuline.yaml`
`incertitudes` — le référent doit pouvoir revoir ce choix).

| Comparaison | Hypo nocturne / symptomatique (substitut) | Hypo SÉVÈRE (dur) |
| --- | --- | --- |
| Degludec vs glargine U100 — **SWITCH 2** (PMID 28672317) | RR **0,70** globale, **0,58** nocturne | 1,6 % vs 2,4 %, **p=0,35 (NS)** en maintenance |
| Degludec vs glargine U100 — **DEVOTE** (PMID 28605603) | — | **RR 0,60**, ARR 1,7 pt, **NNT ~59 / 2 ans** (population à très haut risque) |
| Glargine U300 vs U100 — **EDITION** poolée (PMID 25929311) | nocturne **−31 %** | 2,3 % vs 2,6 % (rare, NS) |
| Analogues 1ʳᵉ gén vs **NPH** — **Cochrane Semlitsch 2020** (PMID 33166419) | globale/nocturne réduites | **RR 0,68 (0,46-1,01), p=0,06 — NON significatif** |

**Points de vigilance (à ne pas survendre).** (1) La réduction de l'hypoglycémie **sévère** n'est démontrée que
pour **degludec vs glargine U100** (DEVOTE) ; pour la 1ʳᵉ génération vs NPH, elle n'atteint **pas** la
significativité (Cochrane 2020). (2) **Pas de supériorité** d'un analogue de 2ᵉ génération sur l'autre : BRIGHT
(PMID 30104294) conclut à l'équivalence ; **CONCLUDE** (PMID 31984443) a **manqué son critère primaire**
(RR 0,88 NS), ses résultats nocturne/sévère n'étant qu'exploratoires. (3) La donnée observationnelle est
discordante (Bradley : HR 0,71 ; Lipska : non concluante). → Recommandation au niveau de la **classe** (D12),
bénéfice affiché = hypoglycémie **nocturne**, l'hypoglycémie sévère réservée au cas degludec vs glargine U100.
**Niveau de preuve : modéré.**

## 3. Intensification — GLP-1 / association fixe avant le bolus

Sur une basale insuffisante — glycémie à jeun (ou, quand la MCG est disponible, profil **nocturne**, cf.
§5) à la cible mais HbA1c au-dessus (écart post-prandial), **ou** sur-basalisation franche (dose/poids >
~0,5 U/kg) même si la glycémie à jeun reste hors cible —, **ne pas sur-titrer la basale**. Depuis
2026-07-26, `over_basalisation == true` **exclut** l'option « Titrer la basale » et déclenche, à lui seul,
ce relais (indépendamment de la glycémie à jeun) : la sur-basalisation est en elle-même une raison de ne pas
titrer davantage.

**Cumul sécurité/efficacité en « basale seule » (2026-07-26).** Jusqu'ici, une hypoglycémie/variabilité
nocturne ou une sur-basalisation ne laissait qu'un geste de sécurité (réduire la dose, temporiser) : l'HbA1c
au-dessus de la cible restait sans réponse. Les 2 options d'intensification décrites plus bas (GLP-1/
association fixe, ajout d'un bolus) sont désormais **aussi** applicables en situation « basale seule »
quand l'un de ces 2 signaux est présent ET que la cible n'est pas atteinte — **cumulables** avec le geste de
sécurité, jamais une alternative à lui. Contenu clinique réutilisé à l'identique (aucune nouvelle
justification) ; portée volontairement limitée à ces 2 signaux, cf. incertitudes §9.

**Garde-fou d'hypoglycémie en « basale_plus_bolus » (2026-07-26).** La situation intermédiaire
(basale + un bolus) ne portait, jusqu'à ce lot, **aucune** `exclusions` sur ses 2 options d'escalade — un
antécédent d'hypoglycémie sévère récurrente ou un TBR élevé n'empêchait rien. Corrigé sur le modèle de
« Titrer la basale » : les 2 options d'escalade **excluent** TBR > 4 %, CV > 36 % et un profil nocturne
d'hypoglycémie. *Deux amendements du 2026-07-29 (passe A) portent sur cette phrase, qui en comptait quatre
de plus.* (1) **« TBR sévère > 1 % » a disparu** : ce critère est retiré du nœud — il n'est **jamais
obtenable sans capteur**, et il en fallait un que le patient sans MCG puisse déclencher (c'est désormais
une **glycémie à jeun sous 0,70 g/L**). (2) **L'antécédent d'hypoglycémie sévère récurrente n'exclut plus
rien** : le référent a tranché qu'*« un antécédent d'hypoglycémie sévère sous un ancien schéma ne présume
pas du risque sous le schéma actuel — il ne doit pas empêcher de titrer »*. Il n'a pas disparu pour autant
— sa **portée reste universelle**, mais par le canal d'une **alerte de nœud** (R8 : commenter, non
commander), et il continue d'alimenter `risque_hypoglycemique_eleve`. Pour que l'exclusion ne se traduise
pas par un silence (aucune réponse offerte),
« Corriger l'hypoglycémie ou la variabilité... » (jusqu'ici propre à « basale seule ») est réutilisée telle
quelle pour cette situation.

| Stratégie (vs basal-bolus) | HbA1c | Hypoglycémie | Poids | Injections |
| --- | --- | --- | --- | --- |
| **IDegLira — DUAL VII** (PMID 29483185, comparateur non plafonné) | non-inférieure (ETD −0,02 %) | **rate ratio 0,11** | **−3,6 kg** | **1 vs ≥ 4** |
| **GLP-1 + basale — méta Eng** (PMID 25220191) | −0,1 % | **RR 0,67** | **−5,66 kg** | — |
| **GLP-1 + insuline — méta Maiorino** (26 ECR, PMID 28325801) | similaire | **RR 0,66** | −4,7 kg | — |
| **Basal-plus par étapes — FullSTEP** (PMID 24622667) | non-inférieure | **rate ratio 0,58** | similaire | progressif |

**Hiérarchie.** (1) **GLP-1 ou association fixe** (IDegLira, iGlarLixi) — même contrôle que le basal-bolus,
moins d'hypoglycémie et de poids, une injection. (2) Si un bolus est nécessaire : **basal-plus** (un bolus au
repas principal, ≈ 10 % de la basale ou 4 U, guidé par l'excursion post-prandiale de l'AGP), n'escalader que
si besoin. (3) **Prémélangée = option dégradée** (dernier recours, uniquement si refus des injections
multiples + repas réguliers — ADA 2026), jamais avant les précédentes. **Réserve** : aucun essai de
morbi-mortalité CV pour les associations fixes → bénéfice **substitutif**. **Niveau de preuve : modéré**
(faible pour le prémix).

## 4. Adaptation du basal-bolus & désintensification

Le basal-bolus est **inclus dans le périmètre du MG** (arbitrage référent §8-5). Optimiser la répartition
(~50/50) et ajuster **à partir des doses actuelles**, guidé par le profil AGP : hypo nocturne → réduire la
basale ; phénomène de l'aube → augmenter la basale ; excursions post-prandiales → augmenter / avancer le
bolus ; hypo interprandiale → réduire le bolus. Le **calcul formel des ratios glucides-insuline et du facteur
de sensibilité n'est pas inclus** (éducation spécialisée). Depuis 2026-07-26, cette optimisation
couvre aussi la situation « basale_plus_bolus » une fois ses 2 gestes d'ajout (GLP-1, bolus) épuisés — cette
situation intermédiaire retombait jusqu'ici sur le seul repli « poursuivre et réévaluer » malgré une cible
non atteinte.

**Réduire la basale sur signal AGP — carte à part entière depuis le 2026-08-02 (T-067, `plans/P12/S4.md`,
exécutant les arbitrages référent B3a/B3b/B3c du 2026-07-30 de `plans/P8/S9.md`).** Jusqu'ici, « baisse
continue nocturne → réduire la basale » n'existait que dans la phrase ci-dessus ; le praticien devait
l'appliquer lui-même, y compris en « basale seule » et en « basale + 1 bolus », où « Optimiser la
répartition… » ne s'affiche pas (défaut mesuré en N11 de la recette du 2026-08-02). La baisse continue
nocturne (lecture AGP, `profil_nocturne == baisse_continue`) déclenche désormais une option « Réduire la
basale » à part entière, ouverte dans **tout** schéma comportant une basale, chiffrée sur le patron exact
de la montée (`calculs` : « Basale réduite (−2 U) » = `dose_basale_actuelle - 2` ; prose citant aussi le
palier −10 % au-delà de 40 U/j, réévaluation à 3 jours). Retirée en contrepartie du déclencheur de
« Corriger l'hypoglycémie ou la variabilité », qui garde ses trois déclencheurs de SEUIL (TBR > 4 %,
CV > 36 %, glycémie à jeun basse sans capteur).

**Provenance — corrigée le 2026-08-02 en 2ᵉ passe.** La 1ʳᵉ rédaction de cette carte écrivait « par
symétrie avec le protocole de titration ; aucune donnée propre à la décroissance », en application
littérale d'une rectification de `plans/P12/S4.md` citant un rapport OpenEvidence (« aucun schéma de
décroissance validé **par essai** n'existe pour l'insuline hors relais thérapeutique »). Vérification
faite (comme le prescrit l'étape 5 de `plans/P8/S9.md`) et signalée à l'orchestrateur plutôt que tranchée
seule : le nœud cite déjà HAS 2024 R.87 et SFD 2025 Avis 18 comme portant EXPLICITEMENT la règle dans les
deux sens pour la descente RÉACTIVE (§ ci-dessous) — exactement le registre de cette carte. **La
confusion identifiée** : OpenEvidence affirme l'absence d'un ESSAI (niveau de certitude), pas l'absence
d'une SOURCE (existence d'un accord d'experts qui, lui, n'est pas contesté). L'arbitrage référent du
2026-07-30 (« chiffrer par symétrie faute de donnée ») reposait sur une absence que le nœud lui-même
contredit — une prémisse factuelle à corriger, pas une décision clinique à rouvrir. **Provenance
corrigée** : les chiffres sont portés par HAS 2024 R.87 et SFD 2025 Avis 18 (accord d'experts, grade AE),
`niveau_preuve: modere`, alignée sur « Corriger l'hypoglycémie ou la variabilité » qui porte les mêmes
chiffres pour le même registre de descente réactive. La nuance qui reste vraie et conservée sur la
carte : aucun essai n'a randomisé cette règle de décroissance contre une autre stratégie — un accord
d'experts encadre le geste, il ne le démontre pas.

**Désintensification.** Chez le sujet fragile, à espérance de vie limitée, âgé (≥ 75 ans), à risque
hypoglycémique élevé, ou avec hypoglycémies sévères récurrentes (`risque_hypoglycemique_eleve`, dérivé aligné
2026-07-26 sur celui du nœud A, **et englobant depuis le 2026-07-26 l'antécédent d'hypoglycémie
sévère récurrente** — jusqu'ici ce même signal pilotait la désintensification sans jamais orienter le choix
de la molécule à l'initiation, cf. § 2) : relâcher la cible, simplifier le schéma, réduire les doses,
envisager un GLP-1 pour réduire les besoins — éviter le surtraitement (HAS 2024 R.103 ; SFD 2025 Avis 21).
*L'âge seul (≥ 75 ans, sans case « fragile » cochée) suffit désormais à déclencher l'allègement — auparavant
absent du gate, ce qui pouvait priver un octogénaire à l'objectif de toute proposition d'allègement.*

**Vitesse de descente d'une désescalade PROGRAMMÉE — non sourcée, STOP explicite (P10/S8, 2026-07-31).**
Ni R.103 (accord d'experts, **aucun chiffre**, vérifié p. 29 du PDF HAS) ni l'Avis 21 de la SFD (qui
chiffre une **cible** glycémique du sujet fragile/dépendant — préprandial 1-2 g/L — pas un rythme de
réduction) ne disent de combien ni à quel rythme réduire. R.105 chiffre un écart (< 0,5 % d'HbA1c) mais
pour l'**arrêt total** du traitement médicamenteux, pas une réduction graduée d'insuline, et sans préciser
le sens de l'écart. C'est une question **différente** de la descente RÉACTIVE d'une hypoglycémie/
variabilité documentée (§ ci-dessus et alerte E6-g du dossier de preuve), pour laquelle R.87/Avis 18 sont
au contraire explicitement chiffrés (−2 U, ou −10 % au-delà de 40 U/j, tous les 3 jours) — reprendre ce
chiffre ici par symétrie serait exactement l'inférence par analogie que `DECISIONS.md` D23 interdit :
l'asymétrie est clinique, pas seulement arithmétique. Recherche complémentaire (web, guides de
déprescription gériatriques) : rien de plus qu'un guide canadien à preuve très faible (Farrell 2017, 2
études avant-après), hors corpus français, non retenu. **Conduite affichée : jugement clinique, surveillance
rapprochée** — position alignée sur celle de la carte sœur « Réduire la posologie de l'insuline » de
`prescription.yaml` (P9/S8).

**Orientation.** Alerte vers le spécialiste (± pompe / boucle fermée = centres initiateurs, hors initiation
MG) si le **déséquilibre persiste malgré l'optimisation** ou en **situation particulière** (hypoglycémies
sévères récurrentes / non-perception, instabilité marquée, grossesse ou projet).

## 5. Mesure Continue du Glucose — consensus, substituts, interprétation

**Distinction fondamentale (§8-4).** Trois niveaux de preuve à ne pas confondre :

| | Statut | Source |
| --- | --- | --- |
| Cibles TIR/TBR/TAR/CV/GMI | **CONSENSUS d'experts** | Battelino / ATTD 2019 (PMID 31177185) |
| Lien TIR → complications | **OBSERVATIONNEL** | Beck 2019 (ré-analyse DCCT, **DT1**, PMID 30352896) ; Lu 2021 (cohorte **T2D**, PMID 33097560) |
| Bénéfice d'une PEC guidée par MCG | ECR à **substituts** (HbA1c, TIR) ; pas de critère dur en DT2 | MOBILE (PMID 34077499), FreeDM2 2026, Jancev 2024 (PMID 38363342) |

**Cibles (Battelino 2019).** Standard : TIR > 70 %, TBR < 4 % (< 70 mg/dL) et < 1 % (< 54), TAR < 25 % (> 180)
et < 5 % (> 250), CV ≤ 36 %, sur ≥ 14 jours / ≥ 70 % de données. **Assouplies** (âgé / haut risque) : TIR >
50 %, TBR < 1 %. Les cibles ont **évolué** (le référentiel SFD 2017 visait TIR 60 %) — à afficher comme
repères d'interprétation, non comme objectifs validés sur les complications.

**Preuve clinique.** MOBILE (DT2 sous basale seule) : HbA1c **−0,4 %**, TIR **+15 points** (substituts) ;
FreeDM2 2026 (DT2 sous basale + iSGLT2/GLP-1) : HbA1c −0,6 % / −0,5 %, hypoglycémie sévère 0 vs 2 ; méta Jancev
: HbA1c −0,31 %, **hypoglycémie sévère RR 0,66 NS**. **Aucune preuve sur les complications dures ni la
mortalité.** L'utilité forte et consensuelle = **dépistage / prévention de l'hypoglycémie** et **aide à la
titration**. La réduction d'hospitalisations pour hypoglycémie sévère est un **signal observationnel**
(Nathanson, registre suédois, RR 0,51), non confirmé en ECR.

**Deux axes dans le moteur.** *Axe CONTRÔLE* (TIR, TAR, GMI) : redondant avec l'HbA1c qui gate déjà →
interprétation + alertes seulement. *Axe SÉCURITÉ* (TBR, CV > 36 %, hypo nocturnes — **« TBR sévère »
retiré le 2026-07-29**, cf. § 5 bis) : critère
**dur** (EBM DEVOTE) → **gate** les recommandations de sécurité (réduire la dose, 2ᵉ génération, relâcher la
cible, désintensifier). Sans MCG : repli sur la **glycémie à jeun** (titration) et les **profils capillaires
6-7 points** (intensification).

**Pivot de « basale seule » (E-03, 2026-07-26, REDÉFINI le 2026-07-30 — P8/S7, arbitrage référent).** Le
référent a répété 3 fois (dont recette capture 8) que la glycémie à jeun n'est plus le bon pivot pour
décider de titrer une basale — l'aspect **nocturne** de la courbe prime, la GAJ n'étant que le cas de repli
en l'absence de MCG (« ce qui est maintenant rare »). Le moteur lit `profil_nocturne` (ex-`profil_glycemique`
; et non plus `GAJ`) comme pivot QUAND `mcg_disponible == true`. **Ce que le 2026-07-30 renverse** : jusque-là
un profil « stable » (rien de notable) OU « phénomène de l'aube » (glycémie qui remonte en fin de nuit)
admettaient l'un et l'autre la titration. Le référent tranche que la courbe **plate** (ex-« stable »), si
l'HbA1c reste au-dessus de l'objectif, dit que **la basale n'est pas en cause** — seule une **hausse
continue** (couverture insuffisante) admet désormais la titration ; une courbe plate route vers « Ne pas
sur-titrer la basale — intensifier autrement » (GLP-1 puis bolus). Le second terme (HbA1c au-dessus de
l'objectif) n'est PAS composé dans le dérivé `profil_nocturne_a_cible` lui-même — `cible_atteinte` est
lui-même un dérivé, et le nœud borne ses dérivés à un seul niveau de dérivation (`deriveCritere.ts` n'enchaîne
jamais un `derive` sur un autre) — il est porté par les `conditions` des options consommatrices, qui le
portaient déjà pour d'autres raisons : composer ce repli ne change la liste d'aucune option concernée
(vérifié). L'ex-« excursions post-prandiales » (post-prandial, donc diurne) n'a plus de rôle sur le pivot
NOCTURNE : ce signal a rejoint son propre champ `profil_entre_repas` (`hausse_entre_repas`), gaté sur la
présence d'un bolus. **Le repli SANS MCG a changé le 2026-07-29** (comportement inchangé depuis) : ce n'est
plus « la glycémie à jeun hors de l'intervalle » (`gaj_a_cible == false`) mais « **au-dessus** de l'intervalle »
(`gaj_haute`). La distinction n'est pas cosmétique — l'ancienne formulation confondait *au-dessus* et *en
dessous*, si bien qu'une glycémie du matin **basse** ouvrait la proposition d'**augmenter** la dose. Trois
états distincts remplacent le booléen : `gaj_basse` (< 0,70 g/L, qui **retire** la titration et **ouvre** le
geste correctif), `gaj_a_cible` (0,70-1,30) et `gaj_haute` (> 1,30, qui autorise la titration). Point de
vigilance appliqué, inchangé depuis 2026-07-26 : `profil_nocturne` non renseigné (un `enum` n'a pas de
présomption, D30) n'est **ni** une courbe plate **ni** une hausse — l'absence de réponse ne se lit jamais
comme une information rassurante ni comme un motif de titrer (même défaut que D20).

**Interprétation → décision (lecture de l'AGP).** TBR élevé, CV > 36 % → corriger l'hypoglycémie ou la
variabilité (↓ basale, 2ᵉ génération, relâcher la cible) ; **baisse continue nocturne → réduire la basale**,
chiffré par symétrie avec la titration, carte à part entière depuis le 2026-08-02 (T-067, § ci-dessus) ;
glycémie à jeun / TAR nocturne, hausse continue nocturne → titrer la basale ; courbe nocturne PLATE avec
une HbA1c au-dessus de l'objectif → la basale n'est pas en cause, ne pas sur-titrer, intensifier autrement ;
glycémie à jeun à la cible mais TAR diurne / TIR bas, ou hausse entre les repas → écart prandial → GLP-1
puis bolus ; baisse entre les repas → ↓ bolus.

## 5 bis. Piloter sans capteur — la branche capillaire (passe A, 2026-07-29)

La majorité des patients DT2 insulino-traités suivis en médecine générale **n'ont pas de capteur en
permanence** : refus, rupture de capteur entre deux consultations, ou simple non-prescription. Jusqu'au
2026-07-29, l'outil savait raisonner sur une courbe et retombait, sans capteur, sur la seule glycémie à
jeun. Cette section dit ce que la preuve autorise dans cette branche — et ce qu'elle n'autorise pas.

**Toutes les données ci-dessous ont été vérifiées en source primaire ; les PMID
ont été re-vérifiés contre PubMed et non repris d'OpenEvidence** (6 des 7 PMID rendus par OE lors de cette
passe étaient faux, tout en pointant vers des articles réels et sans rapport).

### La cible capillaire est de la doctrine française, sans aucun essai derrière

| Source | Ce qu'elle porte |
| --- | --- |
| **HAS, fiche de bon usage « BUTS »** (avril 2011) | **0,70-1,20 g/L avant les repas** ; post-prandial 2 h **< 1,80 g/L**. Seule source française chiffrant les **rythmes** d'autosurveillance (≥ 4/jour si plus d'une injection, 2-4/jour si une seule) |
| **HAS 2025, guide *Parcours de soins DT2*, §5.2** | **les mêmes seuils, en g/L** — l'unité exacte de l'outil |
| **SFD 2025, Avis 18** | cible **0,80-1,30 g/L** ; **± 2 U**, ou **± 10 %** au-delà de 40 U/j |
| **ADA Standards, Table 6.3** | pic post-prandial **< 180 mg/dL** |

**Aucune de ces sources n'imprime de grade ni ne cite d'essai** : force forte, **certitude très faible**.
Elles disent *où viser*, jamais *ce qu'on y gagne*.

**Deux décisions de l'outil s'écartent de la lettre de ces sources, et c'est assumé.** (1) **La bande
retenue est 0,70-1,30 g/L** : borne haute de la SFD et de l'ADA, borne basse de la HAS. (2) **La borne basse
n'est pas un bord d'intervalle mais un déclencheur de sécurité** — 0,70 g/L *est* le seuil international
d'hypoglycémie (Battelino ; SFD Tableau II) : la cible commence exactement là où l'hypoglycémie finit. Une
glycémie du matin en dessous **retire** la proposition de titrer et **ouvre** le geste correctif.

### Le pivot est « avant les repas », pas « à jeun » — et c'est ce que les essais ont instrumenté

La HAS écrit « **avant les repas** ». L'outil appliquait ces bornes à la seule **glycémie à jeun** : un
rétrécissement silencieux du champ de la source, relevé lors d'une vérification ultérieure et qu'aucune recherche initiale n'avait vu.
Les essais tranchent dans le même sens :

| Essai | Ce qu'il établit |
| --- | --- |
| **FullSTEP** (PMID 24622667) | Titre le bolus sur le **relevé PRÉ-prandial suivant de la veille**, bande **4,0-7,2 mmol/L (0,71-1,30 g/L)**, **± 1 U** ; bolus supplémentaires **sur l'HbA1c ≥ 7 %**, pas sur une post-prandiale |
| **STEP-Wise** (PMID 21550957) | **A randomisé la question elle-même** — titrer sur la post-prandiale *vs* sur le pré-prandial : **écart de traitement −0,06 % [−0,29 ; +0,17]**, aucune différence |

**Conséquence de conception.** Un **seul** champ posé avant un repas donne le critère du bolus : pas de
champ post-prandial, pas de découpage horaire. La glycémie du matin n'est qu'un **cas particulier** du
pré-prandial. *Un seul champ et non trois* — la charge de saisie est le risque n° 1 du projet, et un seul
suffit à décider même s'il ne localise pas le repas en cause.

### Argumentation négative : viser la post-prandiale n'a jamais rien amélioré de dur

| Essai | Résultat |
| --- | --- |
| **HEART2D** (PMID 19246588) | Nul, **arrêté pour futilité**. ⚠ **La séparation glycémique visée n'a pas été obtenue** (0,8 au lieu de 2,5 mmol/L) : c'est un « **pas démontré** », jamais un « réfuté » |
| **ACE** (PMID 28917545) | Acarbose : **HR 0,98 [0,86-1,11]**, 5,0 ans |
| **NAVIGATOR** (PMID 20228402) | Natéglinide : **HR 0,94 [0,82-1,09]**, avec un **excès d'hypoglycémie** |
| **IDF**, verbatim | *« lack of direct randomised clinical trial evidence that correcting postmeal hyperglycaemia improves clinical outcomes [Level 1-] »* |

→ L'outil **affiche** le seuil de 1,80 g/L (c'est la cible officielle) mais ne le fait **agir** sur aucune
option. Le pré-prandial n'est pas meilleur *en résultat* — il est meilleur *en preuve d'usage* : c'est sur
lui que les essais ont su faire titrer un bolus.

### La limite honnête de cette branche : l'autosurveillance manque la nuit

**Munshi** (PMID 21357814) : sous MCG en aveugle, **95 des 102 épisodes hypoglycémiques (93 %) ne sont
reconnus ni par une autosurveillance à 4 mesures/jour, ni par les symptômes**. *Portée à respecter* : n = 40,
sujets âgés (75 ± 5 ans), population mixte DT1/DT2, et **93 % est une proportion d'épisodes, pas de
patients**. C'est affiché sur les cartes concernées comme une **raison de prudence, jamais de renoncement**.

**Et l'instrument lui-même n'a pas fait ses preuves — l'outil choisit délibérément de ne pas le dire.**
**Nauck 2014** (PMID 24445534, n = 300) est l'essai randomisé qui pose exactement la question — autosurveillance
*vs* pas d'autosurveillance chez l'insulino-traité — et **il est négatif** (différence d'HbA1c
**0,0 % [−0,2 ; +0,2]**). S'y ajoute que **Prescrire est un blanc total sur ce sujet** (7 termes testés, zéro
occurrence) : l'outil n'a **aucune contre-expertise indépendante sur son propre instrument de mesure**,
alors que ses deux sources chiffrantes sont institutionnelles et que la SFD porte des conflits d'intérêts
dispositifs. **Décision du référent, verbatim** : *« Non. Prête à confusion. Les glycémies capillaires
permettent a minima au soignant de raisonner en l'absence de MCG. »* L'autosurveillance n'est pas ici une
intervention thérapeutique dont on vanterait l'effet — c'est **l'instrument sans lequel il n'y a pas de
décision du tout** ; lui opposer l'absence d'effet propre serait une erreur de catégorie, qui désarmerait le
praticien sans rien lui offrir à la place. *Silence délibéré, consigné pour ne pas être « corrigé ».*

### La branche est souvent réversible — et l'outil le propose désormais en premier

**SFD 2025, Avis 23** : la MCG est **remboursée** et **primo-prescriptible par le médecin généraliste** chez
un DT2 sous 1-2 injections **dont l'équilibre n'est pas atteint**. Le plafond de 200 bandelettes/an **exclut**
les insulino-traités : **l'obstacle à densifier la surveillance est clinique, pas économique.**

L'option « Envisager d'instaurer une mesure continue du glucose » s'affiche **en tête**, dans une famille
dédiée (« Avant de décider — la mesure »). **Portée exacte fixée par le référent** : *« Proposer une MCG est
une option valable car elle est parfois oubliée chez certains patients, mais il faut aussi noter que
certains patients la refusent ou se trouvent en rupture de capteur entre deux consultations. Il faut donc
pouvoir raisonner en l'absence de MCG, mais le raisonnement est moins fiable. Si pas d'urgence on peut donc
le différer en attente de données de MCG. »* → **le raisonnement du jour J porte sur les données qu'on a** ;
l'option est une ouverture, jamais un préalable. Le terme « dont l'équilibre n'est pas atteint » est encodé
littéralement : sans lui, l'option préemptait le repli chez le patient déjà à l'objectif.

### Ce que la preuve NE permet PAS d'encoder

- **Un garde-fou de sur-titration par créneaux horaires.** Personne n'a randomisé « heure de la journée →
  composant de l'insuline » ; **Bergenstal 2008** (PMID 18364392) l'*instrumente dans ses deux bras*, donc
  il la présuppose. **Le découpage en quatre périodes fixes n'existe dans aucune source** — les découpages
  attestés sont binaires (jour/nuit) et servent à **décrire**, jamais à décider. Les fenêtres nocturnes
  elles-mêmes divergent : 00:00-06:00 (HAT) · 00:00-05:59 (DEVOTE, SWITCH 2, CONCLUDE, EDITION) ·
  22:00-06:00 (Munshi) · aucune heure chez Battelino ni à l'ADA. **Bolli 2019** (PMID 30160030) place le pic
  d'hypoglycémies à **06:00-08:00**, *juste après* la fenêtre nocturne standard — un argument pour se méfier
  des découpages, pas pour en fabriquer un.
- **Une titration plus lente chez le sujet âgé.** **SENIOR** (PMID 29895556), seul essai randomisé dédié aux
  ≥ 65 ans, randomise **deux insulines à cible commune** : il **n'a testé ni un pas ni un intervalle
  différents**. « **Relever la cible** » a plusieurs sources (ADA 2026 Table 13.2 grade C, SFD Avis 21,
  HAS R.103) ; « titrer plus lentement » n'en a aucune. C'est la première voie qui est encodée.
- **Le seuil post-prandial de protocole de 4T (1,26 g/L)** — texte intégral inaccessible, reste `[À VÉRIFIER]`.

## 6. Doses — aide au calcul (§8-7)

Le nœud aide au **calcul** (pas seulement au conseil) à partir du **poids** et des **doses actuelles** :

- **Initiation** : poids × 0,1-0,2 U/kg/j (repli fixe 10 U). *Ratio affiché ici, calcul câblé au formulaire.*
- **Majoration** : **+2 U** (glycémie à jeun 3 matins au-dessus de la cible — *ebmfrance*) ou **+10 %** par
  paliers si dose > 40 U/j (*SFD 2025 Avis 18*) ; réévaluation tous les 3 jours (*HAS 2024 R.87*).
- **Diminution** (hypoglycémie) : **−2 U**, ou **−10 %** de la dose au-delà de 40 U/j (*SFD 2025 Avis 18*) —
  **jusqu'à −4 U si l'hypoglycémie est symptomatique** (*ebmfrance* ; la condition est bien la nature
  symptomatique de l'épisode, **pas** une glycémie à jeun basse : la fiche est en deux morceaux, qu'une
  première lecture avait fusionnés à tort). HAS 2024 R.87 écrit la règle **dans les deux sens** — « augmentée
  **ou réduite** de 1 ou 2 UI » — alors que l'outil n'en encodait que la montée.
- **Basal-plus** : ≈ 10 % de la dose basale actuelle (ou 4 U) au repas principal.
- **Over-basalisation** : repère dose basale / poids > 0,5 U/kg (dérivé `over_basalisation`) → basculer vers
  GLP-1 / bolus plutôt que monter la basale. **Porté verbatim par la SFD 2025, Avis n° 19** *(correction du
  2026-07-29 : l'outil affirmait qu'« aucune source SFD ne porte ce seuil » — c'était faux, et ce verdict
  d'absence venait d'une vérification qui n'avait jamais ouvert le PDF du corpus local)*. Il reste **faiblement
  fondé** (post-hoc non pré-spécifié d'Umpierrez 2019 ; retiré par l'ADA en 2025, maintenu par l'AACE ;
  aucun essai n'a comparé « plafonner puis intensifier autrement » à « continuer à titrer »), d'où son canal :
  **déclencheur** du relais, et non plus exclusion de « Titrer la basale » (retirée le 2026-07-27).

> ⚠ **Aucun de ces chiffres n'a été randomisé.** Ils viennent d'accords d'experts concordants (HAS, SFD,
> ebmfrance) et non d'une stratégie validée : ils **encadrent** le geste, ils ne le **démontrent** pas. La
> borne « ±10-**20** % » qui a longtemps figuré ici n'avait, elle, **aucune source du tout** — la SFD écrit
> 10 %, l'ADA 10-15 %, personne n'écrit 20 %. Elle était allée jusqu'à l'écran sous forme de **dose
> calculée** (« Basale réduite (−20 %) »), corrigée le 2026-07-29.

Périmètre : basale → basal-bolus (médecine générale) ; **hors** ratios glucides-insuline / facteur de
sensibilité formels et pompe / boucle fermée.

## 7. Sécurité cardiovasculaire & garde-fous de voix

**ORIGIN** (glargine vs soins standard, n=12 537, 6,2 ans, PMID 22686416) : MACE **HR 1,02 (0,94-1,11)**,
mortalité **HR 0,98**, **cancer HR 1,00** (aucun sur-risque) — **CV-neutre**, confirmé par l'extension
**ORIGINALE** (PMID 26681720), au prix de ~3× plus d'hypoglycémie sévère (1,00 vs 0,31/100 pers.-an) et de
~+2 kg. **Garde-fous** : ✗ ne jamais revendiquer un bénéfice CV / de mortalité pour l'insuline ; ✗ ne pas
présenter les cibles de TIR comme des critères durs ; ✗ ne pas banaliser prandial/prémix systématique ;
distinguer partout **contrôle & métriques de MCG (substituts obtenus)** vs **hypoglycémie sévère & complications
(critères durs)**.

## 8. Reco officielle vs position critique — divergences

**Reco officielle.** Toutes placent l'insuline en dernier, après les non-insulines à bénéfice cardio-rénal.
Ancrage français affiché = **SFD 2025** (Avis 18 : basale ; 18 bis : analogue lent > NPH, U300/degludec si
risque hypo ; 19 : GLP-1 préféré à l'insuline intensifiée, basal-plus > prémix ; 21 : désintensification ;
23 : MCG remboursée si insuline, primoprescription MG). ADA 2026 : GLP-1 avant l'insuline (rec 9.21), MCG grade
A (rec 7.15).

**Synthèse critique indépendante** (revues consultées en référence, cf. § Sources) — affichée à côté.
L'objectif reste d'éviter les complications : l'insuline corrige la glycémie et prévient le microvasculaire
(extrapolé) mais n'a aucun bénéfice CV démontré (**ORIGIN**, MACE HR 1,02) ; les schémas prandial/prémélangé
systématiques ne sont pas soutenus par les essais (**Bertuol**, méta-analyse en réseau 2026) ; les cibles de
Time in Range restent un **consensus d'experts** (Battelino/ATTD 2019), non un critère dur validé sur les
complications — le lien TIR-complications est observationnel (Beck 2019 en DT1 ; Lu 2021 en DT2) — d'où une
vigilance sur le surtraitement, surtout chez l'âgé.

**Divergences (deux frictions).** (1) **HAS 2024** (R.88, grade AE) admet le **prémix** à parité avec le
basal-bolus et reste **muette sur la 2ᵉ génération** et sur « le GLP-1 avant le bolus » — deux préférences
appuyées sur des essais publiés : réduction démontrée de l'hypoglycémie nocturne (SWITCH 2 RR 0,70 ; EDITION
U300 −31 %) et, vs glargine U100, de l'hypoglycémie sévère (DEVOTE, NNT ~59/2 ans) pour le choix de
génération ; même contrôle avec moins d'hypoglycémie et de poids (DUAL VII ; méta Eng/Maiorino) pour le
GLP-1 avant le bolus — **SFD 2025** les énonce explicitement, la HAS reste silencieuse. (2) **MCG / TIR** :
axe **SFD 2025 / ADA 2026 technophile** (MCG grade A, délivrance automatisée désormais proposée en DT2,
**fort conflit d'intérêt dispositifs**) vs **HAS réservée** (pas de cible TIR) et le fait que les cibles de
TIR restent un consensus d'experts, non un critère dur (cf. ci-dessus). Sur le reste (basale + oraux/GLP-1,
insuline en dernier, 2ᵉ génération pour l'hypo, GLP-1 avant le bolus), **SFD 2025 converge avec l'EBM**.

**Là où la position critique manque — et il faut le dire.** Sur **l'autosurveillance glycémique elle-même**,
il n'y a **pas** de position critique disponible : **Prescrire est muet** (7 termes testés dans les notes de
synthèse du corpus, **zéro occurrence**), et les deux seules sources qui chiffrent des seuils capillaires
sont **institutionnelles** (HAS 2011, HAS 2025), sans grade ni essai. La SFD, qui chiffre par ailleurs les
cibles de MCG, porte des **conflits d'intérêts dispositifs massifs**. Autrement dit : l'outil pilote
l'insuline avec un instrument de mesure sur lequel il n'a **aucune contre-expertise indépendante**, et dont
le seul essai randomisé dédié (**Nauck 2014**, n = 300) est **négatif**. Ce n'est pas une divergence — c'est
un **trou dans le corpus critique**, et il est signalé comme tel plutôt que comblé par une inférence.
*Ce trou reste réservé à ce niveau de lecture (argumentaire exhaustif) plutôt que porté par une alerte
affichée au premier niveau de l'écran (cf. § 5 bis, motif détaillé).*

*Réserves (sources écartées) :* la position « **Prescrire tient la NPH pour référence** » et la
« **position CMG** » attribuées par OpenEvidence sont **des inventions non sourcées** : Prescrire ne traite pas
la hiérarchie NPH / analogues dans nos sources, et il n'existe pas de prise de position CMG dédiée (la seule
source généraliste réelle est Joubert 2025, favorable à la MCG). Elles ne sont pas encodées.

## 9. Incertitudes

- **Les deux seuils capillaires de l'outil (0,70-1,30 g/L ; < 1,80 g/L à 2 h) ne reposent sur aucun essai.**
  Doctrine HAS (2011, reprise en 2025) et SFD, sans grade imprimé ni essai cité : **force forte, certitude
  très faible**. L'outil s'écarte en outre de la lettre de la HAS sur la borne haute (1,30 et non 1,20),
  au profit de la SFD et de l'ADA — divergence assumée par le référent.
- **Aucune règle de titration — ni de montée, ni de descente — n'a jamais été randomisée.** Les pas (± 2 U,
  ± 10 %), le rythme (3 jours) et le déclencheur (« 3 matins de suite ») sont des accords d'experts
  concordants. *Treat-to-Target ne valide que le principe d'une titration pilotée par la glycémie à jeun,
  pas ce protocole* (correction du 2026-07-29).
- **Cibler la glycémie post-prandiale n'a jamais amélioré un critère dur** (HEART2D nul mais **séparation
  glycémique non obtenue** — « pas démontré », jamais « réfuté » ; ACE et NAVIGATOR nuls ; IDF verbatim).
  L'outil **affiche** 1,80 g/L comme cible officielle sans le faire **agir** : à ne pas « corriger ».
- **Le garde-fou de sur-titration par créneaux horaires n'a aucun socle** : personne n'a randomisé
  « heure → composant », Bergenstal 2008 le présuppose dans ses deux bras, le découpage en quatre périodes
  n'existe nulle part, les fenêtres nocturnes divergent d'un essai à l'autre. Reporté par le référent,
  **à rouvrir seulement si une preuve nouvelle apparaît**.
- **Chez l'âgé, la preuve porte sur la cible, pas sur la vitesse** : SENIOR randomise deux insulines à
  cible commune et n'a testé ni un pas ni un intervalle différents.
- **L'autosurveillance glycémique n'a pas démontré de bénéfice propre chez l'insulino-traité** (Nauck 2014,
  n = 300, différence d'HbA1c 0,0 %) et manque 93 % des épisodes hypoglycémiques (Munshi, série de 40 sujets
  âgés, population mixte). **L'outil ne l'énonce délibérément pas** — arbitrage référent motivé, cf. § 5 bis.
- MCG : cibles = consensus ; lien TIR-complications observationnel ; bénéfice en DT2 sur substituts, sans
  preuve sur critères durs ni mortalité.
- Bénéfice microvasculaire de l'insuline = extrapolé du contrôle glycémique, non démontré par un essai dédié.
- Seuil d'over-basalisation 0,5 U/kg = repère **non validé par ECR**, mais **bien porté verbatim par la
  SFD 2025, Avis n° 19** *(corrigé le 2026-07-29 : l'argumentaire affirmait le contraire, sur la foi d'un
  verdict d'absence rendu sans ouvrir le corpus local)*. Il **n'est plus une exclusion** de « Titrer la
  basale » depuis le 2026-07-27 — seulement un **déclencheur** du relais « intensifier autrement », les
  deux options coexistant sous le tri par rang.
- 2ᵉ génération : hypoglycémie sévère démontrée pour degludec vs glargine U100 seulement ; 1ʳᵉ génération vs
  NPH non significative ; pas de supériorité inter-2ᵉ-génération.
- Associations fixes : bénéfice substitutif, aucun CVOT dédié.
- Câblage formulaire (P3) : dérivés, calcul des doses, tooltips AGP, variable `hypo_severe_recurrente`.
- **Pivot nocturne (E-03, implémenté 2026-07-26, REDÉFINI le 2026-07-30 — P8/S7) :**
  `profil_nocturne_permet_titration` / `profil_nocturne_a_cible` remplacent `gaj_a_cible` comme pivot de
  « basale seule » quand `mcg_disponible == true`. *Amendé le 2026-07-29 : le pivot du repli sans MCG est
  désormais `gaj_haute` (> 1,30 g/L) et non plus `gaj_a_cible == false`, qui englobait l'hypoglycémie à
  jeun — cf. § 5.* **TRANCHÉ le 2026-07-30 :** la courbe plate (ex-« stable ») cesse d'admettre la
  titration — seule une hausse continue le fait ; une courbe plate avec HbA1c au-dessus de l'objectif route
  vers « Ne pas sur-titrer... — intensifier autrement ». `profil_glycemique` (`liste` de 4 valeurs) et le
  critère propre `hypo_interprandiale` sont remplacés par deux `enum` — `profil_nocturne`
  (baisse/hausse/plate) et `profil_entre_repas` (hausse/baisse/pas de signal). L'ex-« excursions
  post-prandiales » (qui alimentait `profil_nocturne_a_cible` jusqu'au 2026-07-29) rejoint
  `profil_entre_repas` et n'a plus de rôle sur le pivot nocturne — le point resté « non tranché » dans une
  version antérieure de cette entrée (hypo interprandiale n'alimentant aucun des deux dérivés nocturnes)
  reste vrai sous la nouvelle forme : ni la hausse ni la baisse entre les repas n'entrent dans le pivot
  nocturne, l'une comme l'autre étant des signaux diurnes qui accusent le bolus, pas la basale. L'assimilation
  « hausse continue → admet la titration » reste une lecture clinique standard, inchangée depuis 2026-07-26.
- **Cumul sécurité/efficacité (E-04b/E-06, implémenté 2026-07-26) :** les options d'intensification de
  « basale_plus_bolus » sont réutilisées en « basale seule », mais seulement sur les 2 signaux nommés par
  le référent (hypoglycémie/variabilité nocturne, sur-basalisation) — le cas « GAJ/profil nocturne à la
  cible SEUL » reste sans option d'efficacité dédiée (prose uniquement), non généralisé faute de mandat.
  Ces 2 options portent leurs `priorite` d'origine (1/2), qui chevauchent en « basale seule » celles, sans
  rapport clinique, des options de sécurité (le nœud ne déclare pas de `familles`) — signalé, non corrigé.
  Même chevauchement introduit en sens inverse ci-dessous : « Corriger l'hypoglycémie... » et
  « Optimiser la répartition du basal-bolus », réutilisées en « basale_plus_bolus », y chevauchent les
  options d'escalade — même limite, même non-correction assumée.
- **RÉSOLU 2026-07-26** — « Désintensifier / alléger le
  schéma » (basal-bolus) : l'alignement sur `risque_hypoglycemique_eleve` (2026-07-26) avait préservé
  `hypo_severe_recurrente` comme déclencheur indépendant, en OR littéral, distinct de ce que décrivait la
  consigne référent d'alors — et jamais lu par « Choisir un analogue basal de 2ᵉ génération » (§2), même
  concept de sécurité encodé deux fois (invariant I4). Arbitrage tranché : `hypo_severe_recurrente` est
  désormais **fusionné dans `risque_hypoglycemique_eleve`** plutôt que laissé en déclencheur indépendant par option — à
  confirmer par le référent, deux conséquences : (1) le OR littéral sur « Désintensifier » a été retiré
  (redondant) ; (2) la population des alertes « cibles MCG assouplies » (§5) s'élargit au même signal.
- **Situation « basale_plus_bolus » (2026-07-26) :**
  cette situation intermédiaire n'avait ni option de sécurité (401/401 profils à risque du banc sans aucune
  réponse à une hypoglycémie documentée) ni option de titration/optimisation une fois ses 2 gestes d'ajout
  épuisés (60/92 profils, cible non atteinte). Corrigé par réutilisation de 2 options déjà écrites pour
  d'autres situations (§3, §4) et par l'ajout d'`exclusions` aux 2 options d'escalade, sur le modèle de
  « Titrer la basale ». Point à confirmer par le référent : les `exclusions` ajoutées incluent
  `hypo_severe_recurrente == true`, en plus des 4 signaux MCG du modèle cité — nécessaire pour couvrir le
  profil exact du rapport (TBR bas, TBR sévère nul, seul l'antécédent signale le risque), mais c'est une
  extension de périmètre au-delà du mandat explicite pour ce canal précis.
  **TRANCHÉ le 2026-07-29, en sens inverse** : l'antécédent est **retiré de ces `exclusions`** — il
  n'empêche plus de titrer, parce qu'un épisode survenu **sous un schéma antérieur** ne présume pas du
  risque sous le schéma actuel. Sa portée reste universelle, par le canal d'une **alerte de nœud**. Le
  signal « TBR sévère » invoqué ci-dessus n'existe plus dans le nœud (retiré en début de passe A :
  inobtenable sans capteur).

## Sources (PMID/DOI vérifiés et corrigés contre source primaire)

- **ORIGIN** — Gerstein HC et al., *N Engl J Med* 2012;367(4):319-28. PMID 22686416 · DOI 10.1056/NEJMoa1203858.
- **ORIGINALE** — ORIGIN Trial Investigators, *Diabetes Care* 2016;39(5):709-16. PMID 26681720.
- **DEVOTE** — Marso SP et al., *N Engl J Med* 2017;377(8):723-32. PMID 28605603 · DOI 10.1056/NEJMoa1615692.
- **SWITCH 2** — Wysham C et al., *JAMA* 2017;318(1):45-56. PMID 28672317 · DOI 10.1001/jama.2017.7117.
- **BRIGHT** — Rosenstock J et al., *Diabetes Care* 2018;41(10):2147-54. PMID 30104294 · DOI 10.2337/dc18-0559.
- **CONCLUDE** — Philis-Tsimikas A et al., *Diabetologia* 2020;63(4):698-710. PMID 31984443. (Commentaire : Del Prato, *Diabetologia* 2020.)
- **EDITION 1-2-3 poolée** — Ritzel R et al., *Diabetes Obes Metab* 2015;17(9):859-67. PMID 25929311.
- **Cochrane analogues vs NPH** — Semlitsch T et al., *Cochrane Database Syst Rev* 2020;11:CD005613.pub4. PMID 33166419.
- **Treat-to-Target** — Riddle MC, Rosenstock J, Gerich J. *Diabetes Care* 2003;26(11):3080-6. PMID 14578243.
- **Porcellati (méta poolée)** — Porcellati F et al., *Medicine (Baltimore)* 2017;96(5):e6022. PMID 28151905.
- **4T** — Holman RR et al., *N Engl J Med* 2007;357(17):1716-30 (PMID 17890232) ; 3 ans 2009;361(18):1736-47 (PMID 19850703).
- **DUAL VII** — Billings LK et al., *Diabetes Care* 2018;41(5):1009-16. PMID 29483185 · DOI 10.2337/dc17-1114.
- **Eng (méta GLP-1 + basale)** — Eng C et al., *Lancet* 2014;384(9961):2228-34. PMID 25220191.
- **Maiorino (méta)** — Maiorino MI et al., *Diabetes Care* 2017;40(4):614-24 (26 ECR). PMID 28325801.
- **FullSTEP** — Rodbard HW et al., *Lancet Diabetes Endocrinol* 2014;2(1):30-7. PMID 24622667.
- **Bertuol (NMA)** — Bertuol VC et al., *Diabetologia* 2026;69(5):1150-63. DOI 10.1007/s00125-025-06633-x.
- **Battelino / consensus TIR** — Battelino T et al., *Diabetes Care* 2019;42(8):1593-1603. PMID 31177185 · DOI 10.2337/dci19-0028.
- **Beck (validation TIR)** — Beck RW et al., *Diabetes Care* 2019;42(3):400-405. PMID 30352896.
- **Lu (TIR & mortalité, T2D)** — Lu J et al., *Diabetes Care* 2021;44(2):549-555. PMID 33097560.
- **MOBILE** — Martens T et al., *JAMA* 2021;325(22):2262-72. PMID 34077499 · DOI 10.1001/jama.2021.7444.
- **FreeDM2** — Wilmot EG et al., *Lancet Diabetes Endocrinol* 2026;14(6):463-74. DOI 10.1016/S2213-8587(26)00076-8.
- **Jancev (méta MCG DT2)** — Jancev M et al., *Diabetologia* 2024;67(5):798-810. PMID 38363342.
- **Nathanson (registre suédois)** — Nathanson D et al., *Diabetologia* 2025;68(1):41-51. PMID 39460755.
- **Reco** — SFD 2025 (Darmon P et al., *Méd. Mal. Métab.* 2025;19(8):630-662) ; HAS 2024 « Stratégie thérapeutique du DT2 » ; ADA *Standards of Care* 2026 (ch. 7 DOI 10.2337/dc26-S007 ; ch. 9 DOI 10.2337/dc26-S009) ; ADA/EASD 2022 (Davies MJ et al., PMID 36148880) ; AACE 2022 (PMID 35963508) / 2026 (Samson) ; Joubert M et al. 2025 (*Méd. Mal. Métab.* 19:331-347) ; ebmfrance/Duodecim « Insulinothérapie dans le DT2 » (ebm00491).

### Ajouts de la passe A « pilotage sans capteur » (2026-07-29)

> **Tous les PMID ci-dessous ont été re-vérifiés contre PubMed.** Aucun n'est
> repris d'OpenEvidence : **6 des 7 PMID rendus par OE lors de cette passe étaient faux**, tout en pointant
> vers des articles réels et sans rapport (ACE → neuro-imagerie ; NAVIGATOR → ACCORD Lipid ; 4T →
> gynécomastie puis histiocytose). Ses **DOI**, en revanche, étaient justes (3/3). Règle de procédé versée
> dans `docs/decision/00-global.md`.

- **STEP-Wise** — Meneghini L et al., *Endocr Pract* 2011;17(5):727-36. PMID 21550957. *(A randomisé le pivot
  de titration lui-même : post-prandial vs pré-prandial, ETD −0,06 % [−0,29 ; +0,17].)*
- **HEART2D** — Raz I et al., *Diabetes Care* 2009;32(3):381-6. PMID 19246588. *(Post hoc sujets âgés :
  PMID 21593301.)*
- **ACE** — Holman RR et al., *Lancet Diabetes Endocrinol* 2017;5(11):877-86. PMID 28917545. *(NNT du critère
  « diabète incident » recalculé lors d'une vérification : ARR 2,5 pp → **NNT ≈ 40/5 ans**, et non 33.)*
- **NAVIGATOR** — Holman RR et al., *N Engl J Med* 2010;362(16):1463-76. PMID 20228402.
- **Nauck (autosurveillance chez l'insulino-traité)** — Nauck M et al., *Diabetologia* 2014, n = 300.
  PMID 24445534.
- **Munshi (hypoglycémies non détectées)** — Munshi MN et al., *Diabetes Care* 2011. PMID 21357814 ;
  texte intégral PMC4123960. *(À ne pas confondre avec Munshi 2016, PMID 27273335.)*
- **Zick** — 2007, PMID 18034602. ⚠ Le sigle « **SAFIR** » est **absent du titre et de l'abstract** : ne pas
  l'étiqueter ainsi. Le « 46 % » qui circulait est un **calcul d'agent non signalé**, à recalculer ou retirer.
- **SENIOR** — Ritzel R et al., *Diabetes Care* 2018;41(8):1672-80. PMID 29895556. ⚠ Sa cible relevée est
  **90-130 mg/dL**, dont la borne basse est **au-dessus** de celle de l'ADA (Table 13.2 : 80-130) — l'égalité
  entre les deux, affirmée dans une première lecture, est **inexacte**.
- **Bolli (répartition horaire des hypoglycémies)** — Bolli GB et al., *Diabetes Obes Metab* 2019;21(2):402-7.
  PMID 30160030 · DOI 10.1111/dom.13515. ⚠ Le « doublement » des événements par extension de fenêtre
  **n'est pas publié** : ne pas l'écrire.
- **Bergenstal (attribution horaire → composant)** — Bergenstal RM et al., *Diabetes Care* 2008;31(7):1305-10.
  PMID 18364392. *(L'instrumente dans ses deux bras : la présuppose, ne la teste pas.)*
- **HAS, fiche de bon usage « BUTS » de l'autosurveillance glycémique dans le DT2** — CNEDiMTS, avril 2011
  (FBUTSGLYCEM2), 2 p. Corpus local. *Origine historique des deux seuils capillaires ; aucun grade, aucun essai.*
- **HAS, guide « Parcours de soins du patient adulte vivant avec un DT2 »** — adopté le 26 juin 2025
  (décision n° 2025.0159/DC/SBP), §5.2 pp. 38-40 et §8.1 p. 66. Corpus local. *Les mêmes seuils, en g/L.*
- **HAS 2024, RBP « Stratégie thérapeutique du DT2 », R.87 p. 25** (grade accord d'experts). Corpus local.
  *Règle d'adaptation **symétrique** : « augmentée ou réduite de 1 ou 2 UI » tous les 3 jours.*
- **SFD 2025, Avis 18** (cible 0,80-1,30 g/L ; ± 2 U ou ± 10 % au-delà de 40 U/j), **Avis 19** (seuil de
  sur-basalisation 0,5 U/kg, **verbatim**), **Avis 23** (MCG remboursée, primo-prescription par le médecin
  généraliste chez un patient « dont l'équilibre n'est pas atteint »). Corpus local.
- **ebmfrance/Duodecim, « Insulinothérapie dans le DT2 » (ebm00491)** — porte **verbatim** le « 3 matins de
  suite ». ⚠ Sa règle de descente est **en deux morceaux** (le −4 U dépend de l'hypoglycémie
  **symptomatique**) et la fiche imprime **deux bornes basses différentes** (4,0 et 5,0 mmol/L).
- **SFD Paramédical 2022** (`pdp_pompe_insuline_externe_mcg.pdf`, corpus local) — Fig. 2 (cibles TIR/TBR/TAR)
  et §6.8 (réévaluation à 3 mois). **SFD 2017, hors-série n° 1** (`mmm_referentielmcg_ep11.pdf`) — position
  d'experts sur la MCG. ⚠ Le nom de ce dernier fichier induit en erreur : « mcg » = **Mesure Continue du
  Glucose**, *pas* le Collège de la Médecine Générale ; **déclaration d'intérêts massive** (Abbott, Dexcom,
  Medtronic, Insulet, Roche).
