# Insulinothérapie du DT2 — argumentaire exhaustif

> Niveau de lecture 3 (preuve complète). Document autonome distillé du dossier de preuve
> `docs/decision/noeuds/E-insuline.md` (5 agents A × OpenEvidence 2ᵉ passe × red-team B1/B2/B3, PMID/DOI
> vérifiés et **corrigés** contre source primaire — §5b). **BROUILLON en attente de validation référent.**

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
ADA 2026 (rec 9.20). *Note red-team : la HAS déclenche sur des seuils glycémiques, le critère « symptômes »
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
identifié dans le dossier de preuve), auto-ajustement
**+2 U** si la glycémie à jeun reste au-dessus de la cible 3 matins de suite (ou +10-20 % par paliers si dose
> 40 U), adaptation tous les 3 jours ; cible de glycémie à jeun ~0,70-1,20 g/L. Algorithme validé par
**Treat-to-Target** (PMID 14578243) : ~60 % atteignent la cible.

**Cohérence de saisie (2026-07-26).** Un patient déclaré « naïf d'insuline » ne peut, par définition, avoir
déjà une insuline basale dans ses traitements en cours — le prérequis qui retire silencieusement l'option
« Initier une insuline basale » dans ce cas (2026-07-25) est correct mais insuffisant seul : une alerte de
nœud le dit désormais explicitement au praticien (incohérence situation/traitements déclarés).

## 2. Choix de la molécule basale — hypoglycémie nocturne (substitut) vs sévère (dur)

Chez le patient à risque d'hypoglycémie (âgé, fragile, insuffisance rénale, hypoglycémies nocturnes, **ou
antécédent d'hypoglycémie sévère récurrente — cf. `risque_hypoglycemique_eleve`, ci-dessous**), préférer un **analogue
de 2ᵉ génération** (glargine U300 ou degludec) à glargine U100 / détémir, a fortiori à la NPH.

*Correction 2026-07-26 (4ᵉ lot, F4 red-team « silence et omission »).* L'antécédent d'hypoglycémie sévère
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

**Points red-team (à ne pas survendre).** (1) La réduction de l'hypoglycémie **sévère** n'est démontrée que
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

**Garde-fou d'hypoglycémie en « basale_plus_bolus » (2026-07-26, 4ᵉ lot).** La situation intermédiaire
(basale + un bolus) ne portait, jusqu'à ce lot, **aucune** `exclusions` sur ses 2 options d'escalade — un
antécédent d'hypoglycémie sévère récurrente ou un TBR élevé n'empêchait rien. Corrigé sur le modèle de
« Titrer la basale » : les 2 options d'escalade **excluent** désormais TBR > 4 %, TBR sévère > 1 %, CV >
36 %, profil nocturne d'hypoglycémie, **et** un antécédent d'hypoglycémie sévère récurrente — ce dernier
signal, absent des 4 premiers, est le seul qui couvre le patient dont la MCG reste rassurante mais dont
l'histoire ne l'est pas. Pour que l'exclusion ne se traduise pas par un silence (aucune réponse offerte),
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
de sensibilité n'est pas inclus** (éducation spécialisée). Depuis 2026-07-26 (4ᵉ lot), cette optimisation
couvre aussi la situation « basale_plus_bolus » une fois ses 2 gestes d'ajout (GLP-1, bolus) épuisés — cette
situation intermédiaire retombait jusqu'ici sur le seul repli « poursuivre et réévaluer » malgré une cible
non atteinte.

**Désintensification.** Chez le sujet fragile, à espérance de vie limitée, âgé (≥ 75 ans), à risque
hypoglycémique élevé, ou avec hypoglycémies sévères récurrentes (`risque_hypoglycemique_eleve`, dérivé aligné
2026-07-26 sur celui du nœud A, **et englobant depuis le 2026-07-26 [4ᵉ lot] l'antécédent d'hypoglycémie
sévère récurrente** — jusqu'ici ce même signal pilotait la désintensification sans jamais orienter le choix
de la molécule à l'initiation, cf. § 2) : relâcher la cible, simplifier le schéma, réduire les doses,
envisager un GLP-1 pour réduire les besoins — éviter le surtraitement (HAS 2024 R.103 ; SFD 2025 Avis 21).
*L'âge seul (≥ 75 ans, sans case « fragile » cochée) suffit désormais à déclencher l'allègement — auparavant
absent du gate, ce qui pouvait priver un octogénaire à l'objectif de toute proposition d'allègement.*

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
interprétation + alertes seulement. *Axe SÉCURITÉ* (TBR, TBR sévère, CV > 36 %, hypo nocturnes) : critère
**dur** (EBM DEVOTE) → **gate** les recommandations de sécurité (réduire la dose, 2ᵉ génération, relâcher la
cible, désintensifier). Sans MCG : repli sur la **glycémie à jeun** (titration) et les **profils capillaires
6-7 points** (intensification).

**Pivot de « basale seule » (E-03, 2026-07-26).** Le référent a répété 3 fois (dont recette capture 8) que
la glycémie à jeun n'est plus le bon pivot pour décider de titrer une basale — l'aspect **nocturne** de la
courbe prime, la GAJ n'étant que le cas de repli en l'absence de MCG (« ce qui est maintenant rare »). Le
moteur lit désormais `profil_glycemique` (et non plus `GAJ`) comme pivot QUAND `mcg_disponible == true` :
un profil « stable » (rien de notable) ou « phénomène de l'aube » (glycémie qui remonte en fin de nuit)
admet la titration ; un profil à « excursions post-prandiales » (nuit/jeûne déjà à la cible, l'écart est
diurne) admet le relais « ne pas sur-titrer ». `gaj_a_cible` reste le pivot du repli SANS MCG, comportement
inchangé. Point de vigilance appliqué : une liste `profil_glycemique` **vide** (aucune case cochée) n'est
**pas** un profil « stable » — l'absence de coche ne se lit jamais comme une information rassurante (même
défaut que D20, corrigé ici sans passer par le mécanisme `confirmation_requise`, qui répond à une saisie
manquante plutôt qu'à un choix clinique).

**Interprétation → décision (lecture de l'AGP).** TBR élevé / hypo nocturne → ↓ basale, 2ᵉ génération,
relâcher la cible ; glycémie à jeun / TAR nocturne, phénomène de l'aube → titrer la basale ; glycémie à jeun à
la cible mais TAR diurne / TIR bas → écart prandial → GLP-1 puis bolus ; hypo post-prandiale → ↓ bolus ; CV >
36 % → instabilité, ne pas sur-titrer.

## 6. Doses — aide au calcul (§8-7)

Le nœud aide au **calcul** (pas seulement au conseil) à partir du **poids** et des **doses actuelles** :

- **Initiation** : poids × 0,1-0,2 U/kg/j (repli fixe 10 U). *Ratio affiché ici, calcul câblé au formulaire.*
- **Majoration** : +2 U (glycémie à jeun 3 matins au-dessus de la cible) ou +10-20 % par paliers si dose > 40 U.
- **Diminution** (hypoglycémie) : −2 à −4 U ou −10-20 % de la dose actuelle.
- **Basal-plus** : ≈ 10 % de la dose basale actuelle (ou 4 U) au repas principal.
- **Over-basalisation** : repère dose basale / poids > 0,5 U/kg (dérivé `over_basalisation`) → basculer vers
  GLP-1 / bolus plutôt que monter la basale. *Repère non validé par ECR (`[À VÉRIFIER]`).* Depuis
  2026-07-26, ce repère non-EBM sert de **gate dur** (exclusion de « Titrer la basale », déclencheur du
  relais) — arbitrage référent assumé malgré l'absence de validation par essai.

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

*Réserves red-team (sources écartées).* La position « **Prescrire tient la NPH pour référence** » et la
« **position CMG** » attribuées par OpenEvidence sont **des inventions non sourcées** : Prescrire ne traite pas
la hiérarchie NPH / analogues dans nos sources, et il n'existe pas de prise de position CMG dédiée (la seule
source généraliste réelle est Joubert 2025, favorable à la MCG). Elles ne sont pas encodées.

## 9. Incertitudes

- MCG : cibles = consensus ; lien TIR-complications observationnel ; bénéfice en DT2 sur substituts, sans
  preuve sur critères durs ni mortalité.
- Bénéfice microvasculaire de l'insuline = extrapolé du contrôle glycémique, non démontré par un essai dédié.
- Seuil d'over-basalisation 0,5 U/kg = repère non validé par ECR ; sert pourtant, depuis 2026-07-26, de gate
  dur (exclusion / déclencheur) sur la situation « basale seule ».
- 2ᵉ génération : hypoglycémie sévère démontrée pour degludec vs glargine U100 seulement ; 1ʳᵉ génération vs
  NPH non significative ; pas de supériorité inter-2ᵉ-génération.
- Associations fixes : bénéfice substitutif, aucun CVOT dédié.
- Câblage formulaire (P3) : dérivés, calcul des doses, tooltips AGP, variable `hypo_severe_recurrente`.
- **Pivot nocturne (E-03, implémenté 2026-07-26) :** `profil_nocturne_permet_titration` / `profil_nocturne_a_cible`
  remplacent `gaj_a_cible` comme pivot de « basale seule » quand `mcg_disponible == true` ; `gaj_a_cible`
  reste le pivot du repli sans MCG. Non tranché : `hypo_interprandiale` (5ᵉ valeur de `profil_glycemique`)
  n'alimente aucun des deux nouveaux dérivés (signal ni nocturne ni post-prandial, laissé de côté) ;
  l'assimilation « phénomène de l'aube → admet la titration » est une lecture clinique standard, non
  explicitement validée pour ce nouveau dérivé.
- **Cumul sécurité/efficacité (E-04b/E-06, implémenté 2026-07-26) :** les options d'intensification de
  « basale_plus_bolus » sont réutilisées en « basale seule », mais seulement sur les 2 signaux nommés par
  le référent (hypoglycémie/variabilité nocturne, sur-basalisation) — le cas « GAJ/profil nocturne à la
  cible SEUL » reste sans option d'efficacité dédiée (prose uniquement), non généralisé faute de mandat.
  Ces 2 options portent leurs `priorite` d'origine (1/2), qui chevauchent en « basale seule » celles, sans
  rapport clinique, des options de sécurité (le nœud ne déclare pas de `familles`) — signalé, non corrigé.
  Même chevauchement introduit en sens inverse au 4ᵉ lot (ci-dessous) : « Corriger l'hypoglycémie... » et
  « Optimiser la répartition du basal-bolus », réutilisées en « basale_plus_bolus », y chevauchent les
  options d'escalade — même limite, même non-correction assumée.
- **RÉSOLU 2026-07-26 (4ᵉ lot, F4 red-team « silence et omission »)** — « Désintensifier / alléger le
  schéma » (basal-bolus) : l'alignement sur `risque_hypoglycemique_eleve` (2026-07-26, 2ᵉ lot) avait préservé
  `hypo_severe_recurrente` comme déclencheur indépendant, en OR littéral, distinct de ce que décrivait la
  consigne référent d'alors — et jamais lu par « Choisir un analogue basal de 2ᵉ génération » (§2), même
  concept de sécurité encodé deux fois (invariant I4). Arbitrage tranché : `hypo_severe_recurrente` est
  désormais **fusionné dans `risque_hypoglycemique_eleve`** plutôt que laissé en déclencheur indépendant par option — à
  confirmer par le référent, deux conséquences : (1) le OR littéral sur « Désintensifier » a été retiré
  (redondant) ; (2) la population des alertes « cibles MCG assouplies » (§5) s'élargit au même signal.
- **F2/F3 red-team « silence et omission » (2026-07-26, 4ᵉ lot) — situation « basale_plus_bolus » :**
  cette situation intermédiaire n'avait ni option de sécurité (401/401 profils à risque du banc sans aucune
  réponse à une hypoglycémie documentée) ni option de titration/optimisation une fois ses 2 gestes d'ajout
  épuisés (60/92 profils, cible non atteinte). Corrigé par réutilisation de 2 options déjà écrites pour
  d'autres situations (§3, §4) et par l'ajout d'`exclusions` aux 2 options d'escalade, sur le modèle de
  « Titrer la basale ». Point à confirmer par le référent : les `exclusions` ajoutées incluent
  `hypo_severe_recurrente == true`, en plus des 4 signaux MCG du modèle cité — nécessaire pour couvrir le
  profil exact du rapport (TBR bas, TBR sévère nul, seul l'antécédent signale le risque), mais c'est une
  extension de périmètre au-delà du mandat explicite pour ce canal précis.

## Sources (PMID/DOI vérifiés — red-team B1/B2/B3)

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
