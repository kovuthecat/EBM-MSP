# Red-team (agent B) — preuve-activite-physique.md (2026-07-26)

Vérification adversariale du dossier `preuve-activite-physique.md` (23 essais/méta-analyses sur
activité physique et critères durs, DT2 + populations adjacentes). Méthode : réouverture de **chaque**
référence citée directement en source primaire (PubMed, PMC, Cochrane, Nature, Circulation…) via
`WebFetch`/`WebSearch`, sans réutiliser les chiffres du rapport A tant qu'ils n'étaient pas
re-confirmés. Travail réparti entre vérification directe (moi-même, sur les points signalés « exigence
particulière » par la mission : Da Qing 2024, IDES, IDES_2, CORDIOPREV/PREDIMED, Cochrane RR 0,58) et
quatre passes de vérification en parallèle sur le reste du corpus (Look AHEAD ; DPP/DPPOS/Steno-2 ;
réadaptation cardiaque + Cochrane exercice DT2 ; UK Biobank + méta JMIR). Aucun fichier existant
modifié — seul ce fichier est nouveau.

**Décompte** : **2 HAUTE**, **3 MOYENNE**, **1 BASSE** — 6 findings au total sur 23 citations + le
volet CORDIOPREV/PREDIMED.

---

## A. Findings

### F-1 [HAUTE] — GRADE « eleve » non soutenu pour la réadaptation cardiaque à long terme (T11, T12) — porte précisément sur le RR 0,58 signalé par la mission

**Où** : table maîtresse, lignes T11 (Cochrane CD001800.pub4) et T12 (Dibben, *Eur Heart J* 2023),
colonne GRADE = « eleve ».

**Ce qui est affirmé** : le rapport étiquette « eleve » (ECR de qualité, critères durs, cohérent) les
deux lignes qui portent le chiffre central de tout l'argument « population adjacente » — mortalité CV
RR 0,58 (0,43-0,78) à long terme (T11) et RR 0,74 (0,64-0,86), NNT 37, à l'horizon le plus long (T12).

**Ce que dit la source** (texte intégral Cochrane CD001800.pub4, lu directement — Cochrane.org
renvoyait 403, miroir institutionnel SDU identique consulté) : *« At short-term follow-up (6 to 12
months)… RR 0.87… moderate certainty evidence… Exercise-based CR likely results in little to no
difference in risk of cardiovascular mortality (RR 0.88… moderate certainty evidence)… At medium-term
follow-up… RR 0.77… At long-term follow-up… exercise-based CR may result in a large reduction in
cardiovascular mortality (RR 0.58, 95% CI 0.43 to 0.78; 8 trials). »* — **la revue Cochrane elle-même
n'a formellement appliqué GRADE qu'à la fenêtre 6-12 mois**, où la mortalité CV est cotée « Moderate »
(⊕⊕⊕⊝), **et le résultat y est non significatif** (RR 0,88, NS). Le RR 0,58 à long terme, sur lequel le
rapport A fonde sa comparaison à Da Qing/l'affichage « bénéfice dur robuste », **ne porte aucune
cotation GRADE formelle** — il repose sur un sous-ensemble décroissant (8 essais sur 85, 1392
participants) dont l'attrition/sélection par horizon de suivi n'est pas caractérisée. Même défaut pour
T12 (*Eur Heart J* 2023) : *« GRADE assessments… ranged from low-to-high certainty »* mais seulement
pour la fenêtre 6-12 mois ; l'analyse « longest follow-up » (RR 0,74, NNT 37) n'est, là non plus, pas
gradée par les auteurs. Sources : [Cochrane CD001800.pub4](https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001800.pub4/full) ·
[PMC9902155](https://pmc.ncbi.nlm.nih.gov/articles/PMC9902155/).

**Correction** : remplacer « eleve » par « non gradé formellement (GRADE Cochrane limité au suivi 6-12
mois, où la mortalité CV est cotée modérée et **non significative** ; le sous-groupe long terme n'est
pas coté) » pour T11 et T12. Conséquence pour le §5 du rapport (proposition de 5ᵉ étiquette) et le §0
(verdict) : le mot « robuste » appliqué au bénéfice dur de la réadaptation cardiaque est probablement
excessif — les chiffres cités sont exacts (voir ci-dessous), mais leur niveau de certitude tel
qu'affiché par Cochrane est plus bas que ce que le GRADE simplifié du projet leur attribue.

*(Précision : tous les chiffres eux-mêmes — RR 0,87/0,88/0,77/0,58 pour T11 ; RR 0,96/0,74/0,82/0,77 et
NNT 37 pour T12 — ont été vérifiés verbatim contre la source et sont exacts. Le problème est
exclusivement la cotation GRADE, pas le chiffre.)*

### F-2 [HAUTE] — Unité de randomisation CORDIOPREV mal assimilée à celle de PREDIMED dans le dossier alimentation frère (question supplémentaire de la mission)

**Où** : hors du rapport activité physique lui-même — porte sur `rhd-collecte-alimentation.md` (lignes
362-363 et 395-396, lues pour instruire la question posée par la mission ; fichier non modifié), que le
rapport activité physique cite explicitement en §5 comme structurellement comparable.

**Ce qui est affirmé** (`rhd-collecte-alimentation.md`) : *« [l'étiquette bénéfice EBM sur critère dur]
n'est attribuée qu'aux gestes qui sont la traduction directe d'un composant randomisé de PREDIMED ou
CORDIOPREV (huile d'olive/colza) »* et *« le bénéfice CV dur ne se trouve que dans le régime
méditerranéen dans son ensemble (2 ECR : PREDIMED, CORDIOPREV), et parmi ses composants, **seul l'ajout
d'huile d'olive est un bras réellement randomisé** »* — traitant PREDIMED et CORDIOPREV comme
équivalents quant à l'isolabilité du geste « huile d'olive ».

**Ce que dit la source primaire** : CORDIOPREV randomise deux **motifs alimentaires complets**, pas un
geste ajouté à un régime par ailleurs inchangé — régime méditerranéen (35 % lipides, 22 % AGMI, <50 %
glucides, **40-60 g d'huile d'olive vierge extra/jour + 1 L/semaine fourni gratuitement**, ≥3
portions/semaine de poisson gras, ≥3 portions/semaine de fruits à coque) **vs** régime pauvre en
graisses (28 % lipides, 12 % AGMI, >55 % glucides) — confirmé via la fiche ACC.org du procès-verbal
Lancet 2022 et la recherche croisée (foodswinesfromspain.com, citant le design publié). Contrairement à
PREDIMED — où les deux bras « méditerranéen » (huile d'olive vierge extra *ou* noix) reçoivent la
**même** éducation diététique de fond et ne diffèrent que par le produit supplémenté fourni, rendant la
comparaison huile-d'olive-vs-témoin relativement isolable (imparfaitement, mais réellement) — CORDIOPREV
ne comporte **aucun bras à un seul geste isolé** : la quantité totale de lipides, leur qualité (AGMI vs
glucides), le poisson et les fruits à coque changent simultanément entre les deux bras. Sources :
[ACC.org CORDIOPREV](https://www.acc.org/Latest-in-Cardiology/Clinical-Trials/2022/05/23/19/10/CORDIOPREV) ·
[foodswinesfromspain.com](https://www.foodswinesfromspain.com/en/food/news/2022/september/cordioprev-study-shows-that-an-olive-oil-rich-diet-can-prevent-c) ·
[PubMed 27297848 (design)](https://pubmed.ncbi.nlm.nih.gov/27297848/).

**Correction** : la phrase « seul l'ajout d'huile d'olive est un bras réellement randomisé » est vraie
pour **PREDIMED** mais **inexacte pour CORDIOPREV**, dont le bras « méditerranéen » est un motif
multi-composants (lipides + glucides + poisson + fruits à coque), pas un geste isolé. Reformuler :
« PREDIMED isole (imparfaitement) l'huile d'olive comme composant supplémenté ; CORDIOPREV compare deux
motifs alimentaires complets, où l'huile d'olive est un des marqueurs du motif méditerranéen mais n'est
pas isolément testée. » Cela ne renverse pas le bénéfice dur constaté dans les deux essais, mais réduit
la force de l'attribution causale au geste précis « huile d'olive » — l'un des deux piliers de l'unique
étiquette EBM-dur du module alimentation est donc un peu moins solidement rattaché au geste qu'affiché.

---

### F-3 [MOYENNE] — T22 (Chen et al., méta JMIR) : mélange T1/T2 imprécisément caractérisé, et l'ambiguïté morbidité/mortalité est en fait résolvable (et plus défavorable que suggéré)

**Où** : table maîtresse, ligne T22 ; §2.7 et §6.

**Ce qui est affirmé** : *« Diabétiques (type non systématiquement distingué T1/T2 selon les
cohortes) »* et, en §6, l'ambiguïté morbidité/mortalité du critère composite est laissée `NON VÉRIFIÉ`,
présentée comme relevant d'une limite d'extraction plutôt que d'une caractéristique structurelle de la
méta-analyse.

**Ce que dit la source** (texte intégral PMC11369533, DOI 10.2196/54318) : *« Of the 12 included
studies, only 2 focused on patients with type 1 diabetes, while the rest exclusively studied patients
with type 2 diabetes »* — ce n'est pas un mélange indistinct par cohorte, mais une répartition précise
(**2 cohortes T1D exclusives sur 12**, le reste T2D exclusif). Et sur le critère composite : *« Of the
12 included studies, 5 studies included multiple outcomes… When the outcomes… were fatal or nonfatal
CVD, fatal or nonfatal CHD, and fatal CVD, we chose fatal or nonfatal CVD… because it had greater
representation »* — le RR 0,62 pool en réalité des définitions de critère **hétérogènes** (mortalité
seule / mortalité+morbidité / incidence) selon l'étude, une source d'hétérogénéité inter-études distincte
de — et plus large que — la simple ambiguïté « mortalité ou morbidité » que le rapport signale. Source :
[PMID 38780218](https://pubmed.ncbi.nlm.nih.gov/38780218/) / PMC11369533.

**Correction** : préciser « 2 des 12 cohortes sont exclusivement T1D (le reste T2D exclusif), pondération
inconnue dans le RR poolé » plutôt que « type non systématiquement distingué » ; et remplacer « ventilation
stricte mortalité/morbidité non confirmée » par une mise en garde plus précise : le RR 0,62 agrège des
définitions de critère hétérogènes d'une cohorte à l'autre (mortalité pure, composite fatal+non-fatal,
incidence), ce qui abaisse la lisibilité causale du chiffre au-delà de la seule question mortalité vs
morbidité.

### F-4 [MOYENNE] — Omission d'une méta-analyse observationnelle pertinente (A4)

**Où** : absente de la table maîtresse et du §2.7 (« autres ECR pertinents »).

**Ce qui manque** : Liu X, Wu Z, Li N. *« Association between physical exercise and all-cause and CVD
mortality in patients with diabetes: an updated systematic review and meta-analysis »*, *African Health
Sciences* 2022;22(3). Méta-analyse d'études de cohorte (≥5 ans de suivi), **16 études, N=155 203
diabétiques, 13 821 décès** — largement plus grande que T21 (UK Biobank, N=4003 post-erratum) ou T22
(N=109 820). Résultats : mortalité toutes causes **RR 0,57 (0,49-0,67)** ; mortalité CV **RR 0,55
(0,44-0,68)** ; événements CV **RR 0,58 (0,49-0,69)** ; et surtout un **sous-groupe DT2 isolé** (8 études
sur 9 sont en DT2, 1 en DT1) donnant **RR 0,56 (0,46-0,68)** — un chiffre directement comparable et
directement pertinent pour la question posée à ce dossier. Source : [PMC9993283](https://pmc.ncbi.nlm.nih.gov/articles/PMC9993283/).

**Correction** : ajouter cette méta-analyse au corpus. Elle ne change pas le verdict (observationnelle,
même palier GRADE que T21/T22, ne peut pas établir la causalité — exactement les mêmes réserves que le
rapport applique déjà à Cao et Chen) mais elle est la plus grande méta-analyse observationnelle du champ
et sa cohérence avec T21/T22 (RR de l'ordre de 0,55-0,62 partout) **renforce** le signal dose-réponse
observationnel évoqué en formulation C — c'est un renfort de la thèse du rapport, pas une contradiction,
mais son absence est une vraie lacune de collecte au sens de l'axe A4.

### F-5 [MOYENNE] — CORDIOPREV : proportion de diabétiques légèrement sous-évaluée (« ~50 % » vs 54 % documenté)

**Où** : §5 du rapport (aparté CORDIOPREV, hors table maîtresse), et question supplémentaire de la
mission.

**Ce qui est affirmé** : *« CORDIOPREV, coronariens, ~50 % diabétiques »*.

**Ce que dit la source** : la fiche ACC.org du design CORDIOPREV indique explicitement **« Percentage
with diabetes: 54% »**, chiffre extrait de la publication de référence des caractéristiques de base.
Source : [ACC.org CORDIOPREV](https://www.acc.org/Latest-in-Cardiology/Clinical-Trials/2022/05/23/19/10/CORDIOPREV).

**Correction** : mineure — « ~50 % » est un arrondi raisonnable de 54 %, pas une erreur qui change une
conclusion. Signalé en MOYENNE uniquement parce que la mission demande une vérification au même niveau
d'exigence que pour le reste du dossier ; à corriger en « ~54 % » si le point CORDIOPREV/PREDIMED est un
jour formalisé dans un dossier de preuve à part entière.

### F-6 [BASSE] — IDES_2 (T18) : un seul des deux modèles ajustés est montré

**Où** : table maîtresse T18 et §2.5.

**Ce qui est affirmé** : *« HR ajusté (âge, sexe, profil de risque, ttt, AP, condition physique) =
0,414 (0,229-0,750), p=0,004 »* — chiffre exact (vérifié verbatim, voir ci-dessous), mais présenté comme
« le » HR ajusté.

**Ce que dit la source** (*Nat Commun* 2026, PMID 41571659, texte intégral) : l'abstract donne en fait
**deux** modèles emboîtés — *« Age-and sex-adjusted hazard ratios for mortality are significantly lower
in Intervention versus Control participants (0.498 [0.282-0.879], p = 0.016) and between-group
differences remain after further adjustment for treatments and baseline cardiometabolic risk profile,
major complications, and physical activity and fitness level (0.414 [0.229-0.750], p = 0.004) »*. Le
rapport ne cite que le second (plus ajusté, effet plus marqué), sans mentionner le premier.

**Correction** : point de forme, pas d'erreur — le chiffre retenu (0,414) est le bon et le plus complet ;
mentionner les deux HR emboîtés (0,498 puis 0,414) aurait été plus transparent mais leur omission ne
déforme pas la lecture (le modèle simple va dans le même sens et reste significatif).

---

## B. Ce qui a été vérifié et confirmé exact, sans réserve

Par souci de calibration (la mission demande d'éprouver la déclaration « tout vérifié », pas de
maximiser le nombre de findings) : les citations suivantes ont été rouvertes en source primaire, chiffre
par chiffre, et **correspondent exactement** à ce qu'écrit le rapport — aucune réserve, aucune
correction.

- **T1-T3 (Look AHEAD)** : PMID/DOI corrects, tous les chiffres (HR, IC, p, taux/100 pers.-années,
  « arrêté pour futilité », composante « intervention combinée ») confirmés verbatim, y compris le
  résumé de congrès T3 (HR 0,89 porté par le sous-groupe hispanique HR 0,54, interaction p=0,01) — le
  point le plus « trop beau pour être vrai » du dossier s'est révélé exact au chiffre près.
- **T4-T8 (Da Qing, toute la série)** — vérifiés personnellement, un par un : T4 (Pan 1997, 4 bras par
  clinique, incidences 67,7/43,8/41,1/46,0 %) ; T5 (Li 2008, HRR 0,98/0,83/0,96 poolés, NS) ; T6 (Li
  2014, HR CV 0,59 p=0,033, HR totale 0,71 p=0,049, poolé) ; T7 (Gong 2019, HR CV 0,67 p=0,022, HR totale
  0,74 p=0,0015, poolé) ; **T8 (Yu et al. 2024, PMID 38168886)** — la publication décisive — confirmée
  verbatim : *« Unexpectedly, the exercise-only intervention was not significantly associated with the
  reduction of any of these outcomes »*, avec les HR par bras (diète 0,77/0,67 ; diète+exercice
  0,64/0,54, tous deux significatifs) exactement conformes au tableau. **L'affirmation la plus décisive
  du dossier — le bras exercice seul de Da Qing reste non significatif même décomposé en 2024 — est
  intégralement confirmée.**
- **T9-T10 (DPP/DPPOS) et T19-T20 (Steno-2)** : tous confirmés, y compris la citation verbatim longue de
  Steno-2 (*« stepwise implementation of behavior modification and pharmacologic therapy… »*, mot pour
  mot identique à l'abstract PubMed) et la citation du communiqué AHA (« no change in CVD ») pour T10,
  vérifiée réelle et non inventée.
- **T11-T15 (réadaptation cardiaque + Cochrane exercice DT2)** : tous les chiffres exacts (seul le GRADE
  est en cause, F-1 ci-dessus) ; la distinction fine de T13 (Gadager — comparaison diabétique/non-diabétique
  sous réadaptation, pas un HR isolé avec/sans réadaptation) est confirmée verbatim et correctement
  posée par le rapport.
- **T16-T18 (IDES/IDES_2)** — vérifiés personnellement avec l'exigence particulière demandée par la
  mission : **T16** (essai original 2010, critères substituts uniquement, aucun critère dur — confirmé) ;
  **T17** (*Acta Diabetol* 2026, PMID 41718726, 88 vs 95 décès, HR non ajusté 0,888 p=0,442, HR ajusté
  0,922 p=0,584, conclusion *« no significant effect on long-term mortality »* — confirmé mot pour mot) ;
  **T18** (*Nat Commun* 2026, PMID 41571659, 18 vs 35 décès p=0,010, HR 0,414 p=0,004, *« mainly due to
  fewer cancer deaths »*, *« post hoc, not pre-specified analysis »* — confirmé mot pour mot). **Ce
  n'est pas une confabulation : la « perle » IDES/IDES_2 signalée par la mission comme à vérifier avec
  une exigence particulière est réelle, correctement chiffrée, et correctement qualifiée de fragile par
  le rapport.**
- **T21 (Cao, UK Biobank)** : l'histoire de l'erreur de code (N=19 624 → N=4003) et de l'erratum de
  novembre 2024 est **réelle**, vérifiée sur les deux versions (article original + « Author Correction »),
  chiffres post-erratum exacts (HR 0,61/0,41/0,24 ; −68 % mortalité CV).

---

## C. Réponse à la question CORDIOPREV / PREDIMED

**PREDIMED** : le DT2 n'est **pas** un critère d'inclusion — l'éligibilité repose sur un risque
cardiovasculaire élevé défini par *diabète de type 2* **OU** ≥3 facteurs de risque parmi tabac, HTA,
LDL, HDL, IMC, antécédents familiaux (confirmé, WikiJournalClub + abstract NEJM republié). Proportion de
diabétiques : **~50,4 %** dans le bras huile d'olive (confirmé). Unité de randomisation : trois régimes
alimentaires complets — méditerranéen + huile d'olive vierge extra fournie (1 L/semaine), méditerranéen +
fruits à coque, ou régime pauvre en graisses (conseil seul) — les deux bras méditerranéens recevant la
**même** éducation nutritionnelle de fond et ne différant que par le produit supplémenté, ce qui rend le
bras huile d'olive relativement (mais pas totalement) isolable par rapport au témoin. **Rétractation
2018** : l'article de 2013 a été rétracté pour irrégularités de randomisation touchant **~21 % des
participants** (1588/7447 — assignation non aléatoire de foyers entiers dans un centre, non-respect du
schéma de randomisation dans un autre), puis republié en 2018 avec des données réanalysées ; les
conclusions n'ont **pas changé matériellement** (HR huile d'olive 0,70→0,69 ; HR fruits à coque 0,70→0,72
selon les sources croisées) — un point de traçabilité important pour l'argumentaire, déjà signalé comme
manquant par le red-team précédent (`redteam-collectes-rhd.md`, finding A-5, MOYENNE) mais toujours
absent de `rhd-collecte-alimentation.md` à ce jour.

**CORDIOPREV** : le DT2 n'est pas non plus un critère d'inclusion — le seul critère de maladie est la
coronaropathie établie (20-75 ans, événement >6 mois, sans dysfonction VG sévère). Proportion de
diabétiques : **54 %** documentée (ACC.org), légèrement au-dessus du « ~50 % » du rapport A (F-5,
mineur). Unité de randomisation : **deux motifs alimentaires complets**, pas un geste isolé — régime
méditerranéen riche en huile d'olive (35 % lipides, 22 % AGMI, huile d'olive vierge extra fournie
gratuitement, poisson gras, fruits à coque) contre régime pauvre en graisses (28 % lipides, 12 % AGMI,
plus de glucides). Contrairement à ce que suggère la formulation actuelle du dossier alimentation
(« seul l'ajout d'huile d'olive est un bras réellement randomisé », appliquée aux deux essais
indifféremment), CORDIOPREV ne comporte **aucun bras à geste isolé** — c'est un contraste multi-composants
(F-2, HAUTE).

**Réponse à la question posée** : **oui, l'axe alimentation est dans une situation structurellement
comparable à l'axe activité physique**, et à certains égards plus fragile sur le plan documentaire : (1)
le DT2 est une comorbidité (~50-54 %), pas un critère d'inclusion, dans les deux essais qui portent
l'unique étiquette EBM-dur du module — exactement le défaut de transposition que ce rapport-ci démontre
pour Look AHEAD/réadaptation cardiaque/Da Qing ; (2) l'attribution causale au geste « huile d'olive »
est correcte pour PREDIMED mais **incorrecte** pour CORDIOPREV, dont le bras « méditerranéen » change
simultanément plusieurs variables ; (3) la rétractation/republication de PREDIMED — un signal
d'incertitude méthodologique documentaire propre, sans équivalent dans le corpus activité physique —
reste non mentionnée dans le dossier alimentation malgré un premier signalement. La proposition d'une
5ᵉ étiquette (§D) devrait donc, si elle est retenue, être **conçue dès le départ comme transversale aux
deux axes**, pas comme un correctif ponctuel pour l'activité physique seule.

## D. Avis sur la 5ᵉ étiquette « bénéfice dur démontré en population adjacente »

**Favorable, avec une réserve issue de F-1.** Le raisonnement du rapport A est solide : les quatre
étiquettes existantes forceraient soit une sur-attribution (EBM-dur), soit une sous-vente (recommandation
officielle), soit une fausse dévaluation (savoir-faire non gradé) d'un résultat qui est en réalité un
essai/méta-analyse de bon niveau sur un critère dur, simplement dans une population voisine — le
diagnostic est correct et généralisable (confirmé ci-dessus : la même situation existe côté alimentation).

La réserve : F-1 montre que le chiffre-phare choisi pour illustrer cette 5ᵉ étiquette (RR 0,58,
réadaptation cardiaque, long terme) est exact mais **non certifié « eleve » par Cochrane elle-même** — la
seule fenêtre que Cochrane a formellement gradée (6-12 mois) est non significative sur la mortalité CV.
Une 5ᵉ étiquette qui afficherait « bénéfice dur démontré en population adjacente » avec un GRADE simplifié
« eleve » reproduirait, à l'identique, le problème que cette étiquette est censée résoudre pour la
population cible : sur-représenter la certitude d'un chiffre réel mais fragile. **Recommandation
opérationnelle** : créer la 5ᵉ étiquette, mais lui associer une règle de GRADE dérivée de la source
elle-même (pas d'un jugement du rédacteur) — ici, « modere » au mieux (borné par la cotation Cochrane de
la fenêtre effectivement gradée), pas « eleve » — et exiger, comme pour ce dossier, que chaque usage de
l'étiquette cite explicitement l'écart entre population prouvée et population cible (le « ~1 patient sur
5 diabétique » que le rapport A formule déjà bien en §3, formulation C).

---

## Décompte final

| Sévérité | Nombre |
|---|---|
| HAUTE | **2** (F-1 GRADE Cochrane · F-2 unité de randomisation CORDIOPREV) |
| MOYENNE | **3** (F-3 T22 précision T1/T2+critère composite · F-4 méta observationnelle manquante · F-5 proportion CORDIOPREV) |
| BASSE | **1** (F-6 IDES_2 modèle unique affiché) |
| **Total** | **6** |

## Verdict global sur la fiabilité du rapport A

**Élevée — de loin le dossier le plus solidement vérifié de ce chantier à ce jour.** Sur 23 citations et
~30 vérifications numériques indépendantes (par moi-même et par quatre passes parallèles n'ayant eu accès
qu'à des extraits du rapport, jamais au rapport complet), **aucun PMID/DOI fabriqué, aucun déplacement de
citation (bon verbatim/mauvaise autorité) et aucun chiffre faux n'ont été trouvés** — contrairement au
passif du projet (PMID OpenEvidence fabriqués, 4 findings HAUTE de déplacement de citation sur les deux
dossiers RHD voisins le même jour). Les deux points les plus à risque signalés explicitement par la
mission — Da Qing 2024 (bras exercice seul non significatif) et IDES/IDES_2 (résultats discordants,
IDES_2 porté par la mortalité par cancer) — sont intégralement confirmés, verbatim, et ne sont pas des
confabulations. Les deux findings HAUTE trouvés ici ne portent pas sur l'existence ou l'exactitude des
chiffres du rapport activité physique lui-même, mais sur (F-1) une survalorisation du niveau de preuve
GRADE affiché pour son chiffre le plus stratégique, et (F-2) un défaut hérité du dossier alimentation
frère, découvert en répondant à la question supplémentaire de la mission. La déclaration de l'agent A
(« tout vérifié, aucune fiche non ouverte ») **tient largement la route** — une rareté pour ce projet — et
mérite d'être créditée comme telle, tout en corrigeant F-1/F-2 avant validation référent.
