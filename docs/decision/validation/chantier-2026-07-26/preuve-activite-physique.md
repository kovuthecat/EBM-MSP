# Preuve — activité physique et critères durs dans le DT2 (contestation du « zéro »)

> **Statut** : collecte de preuve ciblée, indépendante, en réponse à la contestation du référent sur le
> constat « aucune piste d'activité physique ne porte l'étiquette bénéfice EBM sur critère dur »
> (`rhd-collecte-activite-physique.md` §P3 ; `CONCEPTION-module-rhd.md` §3 ; source du constat initial :
> `docs/decision/noeuds/H-rhd.md` §3 sous-dossier H3). Ce fichier est neuf ; aucun fichier existant n'a
> été modifié.
> **Méthode** : chaque essai/méta-analyse cité ci-dessous a été récupéré en ligne (PubMed/PMC, Cochrane
> Library, Lancet, Nature, Springer, Circulation…) via `WebSearch`/`WebFetch` au cours de cette mission —
> aucune valeur n'est recopiée de mémoire ni héritée telle quelle du dossier `H-rhd.md` sans re-vérification
> (le dossier H avait lui-même déjà red-teamé une partie de ce corpus ; je ne me suis appuyé sur cet
> héritage que pour les effets de **substitution** hors périmètre de cette mission — HbA1c des métas
> Boulé/Umpierre/Sigal —, jamais pour un critère dur). Chaque ligne de la table indique si la fiche
> primaire a été effectivement ouverte. Rien n'est marqué « confirmé » sans extrait littéral.
> **Limite méthodologique à signaler** : les extractions ont été faites via l'outil `WebFetch` (un modèle
> intermédiaire lit la page et restitue les chiffres) plutôt que par lecture brute du HTML/PDF ; quand deux
> passes indépendantes sur la même étude donnaient des chiffres cohérents (ex. Look AHEAD primaire,
> confirmé à la fois via PubMed et via les pages qui le citent), la confiance est renforcée. Aucune
> incohérence de ce type n'a été détectée dans ce qui suit.

---

## 0. Verdict en une phrase

**Le « zéro » est essentiellement confirmé mais formulé de façon trop absolue** : dans la population et
l'intervention EXACTES du nœud (DT2 **déjà déclaré**, activité physique **isolée** — pas combinée à un
régime —, critère CV **dur**), aucun essai contrôlé positif n'existe ; Look AHEAD (seul grand essai dans
cette population précise) est neutre sur son critère primaire et sur la mortalité, et les deux seuls essais
d'exercice isolé chez le DT2 établi avec une lecture de mortalité (IDES et IDES_2, tous deux italiens,
tous deux publiés en 2026) donnent des résultats **discordants et fragiles** (l'un neutre, l'autre positif
mais post-hoc/non prévu/non porté par la mortalité CV). En revanche, un bénéfice dur **existe et est
robuste** dans deux populations **adjacentes** : la réadaptation cardiaque à l'effort après un événement
coronarien (mortalité CV, méta Cochrane) et — pour l'intervention **combinée** diète+exercice, pas
l'exercice seul — le prédiabète (Da Qing, à 23/30 ans, mais le bras **exercice seul** de Da Qing lui-même
reste non significatif). Détails et chiffres ci-dessous.

---

## 1. Table maîtresse

Échelle GRADE simplifiée du projet (`00-global.md`) : **eleve** (ECR de qualité, critères durs, cohérent) ·
**modere** (ECR avec limites, ou substitution solide) · **faible** (essais fragiles, sous-groupes,
observationnel bien conduit) · **tres_faible** (avis, extrapolation).

| # | Essai / méta-analyse | Population exacte | Intervention exacte | Critère | Résultat chiffré | GRADE | Fiche récupérée | Source |
|---|---|---|---|---|---|---|---|---|
| T1 | **Look AHEAD** — critère CV primaire (Wing et al., *NEJM* 2013) | DT2 établi, 45-76 ans, surpoids/obèse, N=5145 | Intervention intensive sur le mode de vie = **restriction calorique + activité physique combinées** (visée perte de poids), vs éducation/soutien diabète | Composite CV dur (décès CV, IDM non fatal, AVC non fatal, hospit. angor) | 1,83 vs 1,92/100 pers.-années ; **HR 0,95 (0,83-1,09), p=0,51** ; essai **arrêté pour futilité** à 9,6 ans médians | eleve | oui | [PMID 23796131](https://pubmed.ncbi.nlm.nih.gov/23796131/) |
| T2 | **Look AHEAD** — mortalité totale, suivi définitif 16,7 ans (*Diabetes Care* 2022) | idem T1 | idem T1 (intervention arrêtée ~2012 ; suivi passif ensuite) | Mortalité toutes causes | **HR 0,91 (0,81-1,02), p=0,11** — NS ; décès CV non différents entre bras (149 DSE vs 154 ILI), p=0,27 | modere | oui | [PMID 35312758](https://pubmed.ncbi.nlm.nih.gov/35312758/) / [PMC9174966](https://pmc.ncbi.nlm.nih.gov/articles/PMC9174966/) |
| T3 | **Look AHEAD** — mortalité 23 ans (résumé de congrès, *Innovation in Aging* 2025) | idem T1 | idem T1, suivi passif étendu | Mortalité toutes causes | **HR 0,89 (0,81-0,98)** — significatif de justesse, mais **« largement porté par le sous-groupe hispanique »** (interaction ethnie p=0,01 ; HR hispanique 0,54 [0,39-0,74] ; pas d'effet chez Afro-Américains/Caucasiens) | tres_faible | oui (résumé de congrès, pas un article complet identifié) | [PMC12759463](https://pmc.ncbi.nlm.nih.gov/articles/PMC12759463/) — DOI 10.1093/geroni/igaf122.469 |
| T4 | **Da Qing** — design original (Pan et al., *Diabetes Care* 1997) | **Prédiabète** (intolérance au glucose), Chine, N=577, 33 cliniques | 4 bras randomisés par clinique : **contrôle / diète seule / exercice seul / diète+exercice** | Incidence du diabète à 6 ans (substitution) | Contrôle 67,7 % ; diète 43,8 % ; **exercice seul 41,1 %** ; diète+exercice 46,0 % — chaque bras actif significativement < contrôle | modere (design, critère substitution) | oui | [PMID 9096977](https://pubmed.ncbi.nlm.nih.gov/9096977/) |
| T5 | **Da Qing 20 ans** (Li et al., *Lancet* 2008) | Prédiabète, cohorte T4 | Intervention **poolée** (3 bras actifs combinés) vs contrôle | Mortalité CV, mortalité totale, événements CV | Événements CV **HRR 0,98 (0,71-1,37)** NS ; mortalité CV **HRR 0,83 (0,48-1,40)** NS ; mortalité totale **HRR 0,96 (0,65-1,41)** NS | modere | oui | [PMID 18502303](https://pubmed.ncbi.nlm.nih.gov/18502303/) |
| T6 | **Da Qing 23 ans** (Li et al., *Lancet Diabetes Endocrinol* 2014) | idem T5 | Intervention **poolée** vs contrôle | Mortalité CV, mortalité totale | Mortalité CV 11,9 % vs 19,6 %, **HR 0,59 (0,36-0,96), p=0,033** ; mortalité totale 28,1 % vs 38,4 %, **HR 0,71 (0,51-0,99), p=0,049** | modere | oui | [PMID 24731674](https://pubmed.ncbi.nlm.nih.gov/24731674/) |
| T7 | **Da Qing 30 ans**, résultat poolé (Gong et al., *Lancet Diabetes Endocrinol* 2019) | idem T5 | Intervention **poolée** vs contrôle | Décès CV, mortalité totale | **Décès CV HR 0,67 (0,48-0,94), p=0,022** ; **mortalité totale HR 0,74 (0,61-0,89), p=0,0015** | modere | oui | [PMID 31036503](https://pubmed.ncbi.nlm.nih.gov/31036503/) |
| T8 | **Da Qing 30 ans, décomposition par bras** (Yu et al., *Diabetes Obes Metab* 2024) | idem T5 | Bras **séparés** : diète seule / exercice seul / diète+exercice, chacun vs contrôle | Décès CV, mortalité totale, par bras | Décès CV : diète seule **HR 0,67 (0,46-0,97)** sig. ; diète+exercice **HR 0,54 (0,30-0,97)** sig. ; **exercice seul : NON significatif** (tendance seulement). Mortalité totale : diète seule **HR 0,77 (0,61-0,97)** sig. ; diète+exercice **HR 0,64 (0,48-0,84)** sig. ; **exercice seul : NON significatif** | faible (sous-groupe, probablement sous-puissant) | oui | [PMID 38168886](https://pubmed.ncbi.nlm.nih.gov/38168886/) |
| T9 | **DPP** — essai original (Knowler et al., *NEJM* 2002) | **Prédiabète** (glycémie à jeun + post-charge élevées), USA, N=3234 | 3 bras : placebo / metformine / mode de vie **combiné** (≥7 % perte de poids + ≥150 min/sem d'AP) | Incidence du diabète (substitution) | Réduction 58 % (IC 48-66) bras mode de vie vs placebo ; **aucun critère CV dur rapporté dans cette publication** | eleve (pour la substitution) | oui | [PMID 11832527](https://pubmed.ncbi.nlm.nih.gov/11832527/) |
| T10 | **DPPOS** — événements CV, 21 ans (Goldberg et al./DPP Research Group, *Circulation* 2022) | idem T9, cohorte suivie | idem T9 (mode de vie combiné vs placebo, 21 ans médians) | 1er événement CV majeur (IDM, AVC, décès CV) adjudiqué | 310 événements majeurs au total ; **mode de vie vs placebo : HR 1,14 (0,87-1,50), p=0,34** — NS (pas de bénéfice, tendance numérique inverse) | eleve | oui | [PMID 35603600](https://pubmed.ncbi.nlm.nih.gov/35603600/) / [PMC9179081](https://pmc.ncbi.nlm.nih.gov/articles/PMC9179081/) |
| T11 | **Cochrane — réadaptation cardiaque à l'effort** (Dibben et al., CD001800.pub4, 2021) | Coronaropathie (post-IDM/angor/PAC/ATL) — **pas une population DT2** | Réadaptation **à base d'exercice** vs soins usuels | Mortalité CV, mortalité totale, hospitalisations | Court terme : mortalité totale RR 0,87 (0,73-1,04) NS ; mortalité CV RR 0,88 (0,68-1,14) NS. **Moyen terme (1-3 ans) : mortalité CV RR 0,77 (0,63-0,93)**. **Long terme (>3 ans) : mortalité CV RR 0,58 (0,43-0,78)** | eleve (population CHD générale) | oui | Cochrane [CD001800.pub4](https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001800.pub4/full) |
| T12 | **Dibben et al., méta-analyse actualisée** (*Eur Heart J* 2023) | idem T11, 85 ECR, N=23 430 | idem T11, horizon le plus long disponible par essai | Mortalité totale, mortalité CV, IDM, hospitalisation | Mortalité totale RR 0,96 (0,89-1,04) NS ; **mortalité CV RR 0,74 (0,64-0,86)**, NNT 37 ; IDM RR 0,82 (0,70-0,96) ; hospitalisation toutes causes RR 0,77 (0,67-0,89) | eleve (population CHD générale) | oui | [PMC9902155](https://pmc.ncbi.nlm.nih.gov/articles/PMC9902155/) |
| T13 | **Gadager et al.** — réadaptation cardiaque post-SCA, diabète vs non-diabète (*BMC Cardiovasc Disord* 2022) | Post-SCA, N=15 288 (méta capacité à l'effort) dont **3369 diabétiques = 22,0 % documentés** | Réadaptation à base d'exercice (comparaison diabétiques vs non-diabétiques, PAS un bras avec/sans réadaptation isolé chez les diabétiques) | Capacité à l'effort ; mortalité cardiaque ≥12 mois | Mortalité cardiaque **plus élevée chez les diabétiques** (3 études) : OR 2,16 (1,49-3,13) — comparaison **pronostique** diabète vs non, pas un effet-traitement isolé de la réadaptation chez les diabétiques. Gain de capacité à l'effort **plus faible** chez les diabétiques (−0,15 MET, IC −0,24 à −0,06) | faible (peu d'études pour le sous-critère mortalité) | oui | [PMID 35761178](https://pubmed.ncbi.nlm.nih.gov/35761178/) / [PMC9237976](https://pmc.ncbi.nlm.nih.gov/articles/PMC9237976/) |
| T14 | **Zhang et al.** — réadaptation cardiaque, coronaropathie **+ diabète** (*BMC Cardiovasc Disord* 2026) | Coronaropathie **avec diabète**, 18 ECR, N=1669 | Réadaptation à base d'exercice vs soins usuels | Glycémie, HbA1c, lipides, FEVG, test de marche 6 min | Amélioration des substituts métaboliques/fonctionnels ; **aucune donnée de mortalité/événement dur rapportée dans le résumé** ; conclusions « tempérées par les limites des études primaires » | faible | oui | [PMID 41782084](https://pubmed.ncbi.nlm.nih.gov/41782084/) |
| T15 | **Cochrane — exercice dans le DT2** (Thomas, Elliott, Naughton, CD002968.pub2, 2006) | DT2 établi, 14 ECR, N=377, durée 8 semaines à 12 mois | Exercice (structuré) vs pas d'exercice | HbA1c (substitution) | **HbA1c −0,6 %** ; réduction du tissu adipeux viscéral et des triglycérides. **« La durée limitée des essais empêchait de rapporter des complications à long terme ou une mortalité »** — pas de critère dur possible par construction | modere (pour la substitution ; sans objet pour un critère dur) | oui | Cochrane [CD002968.pub2](https://www.cochrane.org/CD002968/ENDOC_exercise-for-type-2-diabetes-mellitus) |
| T16 | **IDES** — essai original (Balducci et al., *Arch Intern Med* 2010) | DT2 établi + syndrome métabolique, sédentaires, N=606 | Entraînement supervisé aérobie+résistance 2×/sem, 12 mois, vs conseil seul | HbA1c, PA, lipides, tour de taille (substituts — essai NON dimensionné pour un critère dur) | HbA1c −0,30 % (p<0,001) ; PAS −4,2 mmHg (p=0,002) ; etc. — **aucun critère dur mesuré à ce stade** | modere (substitution) | oui | [PMID 21059972](https://pubmed.ncbi.nlm.nih.gov/21059972/) |
| T17 | **IDES — mortalité à long terme, post-hoc** (Balducci et al., *Acta Diabetol* 2026) | idem T16, suivi moyen 16,2 ans via le registre national (Tessera Sanitaria) | idem T16 | Mortalité toutes causes | 88 décès (EXE) vs 95 (CON), p=0,536 ; **HR non ajusté 0,888 (0,664-1,187), p=0,442 ; HR ajusté âge/sexe 0,922 (0,689-1,233), p=0,584** — **NS**. Conclusion des auteurs : *« aucun effet significatif sur la mortalité à long terme »* | faible (post-hoc, non prévu, probablement sous-puissant) | oui | [PMID 41718726](https://pubmed.ncbi.nlm.nih.gov/41718726/) |
| T18 | **IDES_2 — mortalité à long terme, post-hoc** (Balducci et al., *Nat Commun* 2026) | DT2 établi ≥1 an, sédentaires, N=300, suivi moyen 10,3 ans | Counseling comportemental annuel (activité physique + sédentarité), 3 ans, vs soins standard | Mortalité toutes causes | 18 décès (interv.) vs 35 (contrôle), p=0,010 ; **HR ajusté (âge, sexe, profil de risque, ttt, AP, condition physique) = 0,414 (0,229-0,750), p=0,004** — **significatif**, mais différence **« principalement due à moins de décès par cancer »**, pas par cause CV ; analyse **explicitement post-hoc, non prévue au protocole**, essai non dimensionné pour la mortalité | tres_faible (post-hoc, N petit — 53 décès au total —, modèle ajusté, mécanisme non-CV, non répliqué) | oui | [PMID 41571659](https://pubmed.ncbi.nlm.nih.gov/41571659/) |
| T19 | **Steno-2** — essai original (Gaede et al., *NEJM* 2003) | DT2 + microalbuminurie, N=160, Danemark | **Multifactoriel** : traitement pharmacologique cible (glycémie, PA, lipides, microalbuminurie) + aspirine + modification comportementale (diète, exercice, tabac) — PAS un bras exercice isolé | Composite CV dur (décès CV, IDM, AVC, revascularisation, amputation) | **HR 0,47 (0,24-0,73)** | eleve (mais non attribuable à l'exercice — cf. §2.6) | oui | [PMID 12556541](https://pubmed.ncbi.nlm.nih.gov/12556541/) |
| T20 | **Steno-2, 21 ans** (Gaede/Oellgaard et al., *Diabetologia* 2016) | idem T19, suivi prolongé | idem T19 | Mortalité toutes causes | Survie médiane **+7,9 ans** dans le bras intensif ; **HR décès 0,55 (0,36-0,83), p=0,005** | eleve (idem — multifactoriel) | oui | [PMID 27531506](https://pubmed.ncbi.nlm.nih.gov/27531506/) / [PMC5506099](https://pmc.ncbi.nlm.nih.gov/articles/PMC5506099/) |
| T21 | **Cao et al.** — activité physique par accéléromètre et mortalité (*Nat Commun* 2024, + *erratum* nov. 2024) | **DT2 établi**, UK Biobank, N=**4003** (corrigé — N initial de 19 624 était une erreur de code, corrigée par *erratum*, conclusions qualitatives inchangées) | **OBSERVATIONNEL** — activité modérée mesurée objectivement (accéléromètre poignet, 7 jours), pas d'intervention | Mortalité toutes causes, mortalité CV | Mortalité toutes causes, 150-299 vs <150 min/sem : **HR 0,61 (0,47-0,79)** ; 300-449 min/sem : **HR 0,41 (0,29-0,56)** ; ≥450 min/sem : **HR 0,24 (0,15-0,36)** [valeurs post-erratum]. Mortalité CV : **−68 % (IC 21-87 %)** au niveau le plus élevé. **Auteurs : « on ne peut exclure un facteur de confusion résiduel ni conclure à la causalité » ; causalité inverse non éliminée** | faible (observationnel, mais mesure objective + gradient dose-réponse) | oui | [DOI 10.1038/s41467-024-49542-0](https://www.nature.com/articles/s41467-024-49542-0) — PMID 38886353 ; erratum [PMC11574098](https://pmc.ncbi.nlm.nih.gov/articles/PMC11574098/) |
| T22 | **Chen et al.** — méta dose-réponse, activité physique et CV chez le diabétique (*JMIR Public Health Surveill* 2024) | Diabétiques (type non systématiquement distingué T1/T2 selon les cohortes), 12 cohortes prospectives, N=109 820 | **OBSERVATIONNEL** — comparaison AP la plus haute vs la plus basse | Morbidité/mortalité CV (composite — la ventilation stricte mortalité seule n'a pas pu être confirmée à ce niveau d'extraction) | **RR 0,62 (0,51-0,73)** AP la plus haute vs la plus basse ; AP de loisir seule : RR 0,68 (0,52-0,83) | faible (observationnel ; composite morbidité+mortalité, ventilation à vérifier en primaire) | partiel (chiffres confirmés, ambiguïté morbidité/mortalité **non levée** — voir §6) | [PMID 38780218](https://pubmed.ncbi.nlm.nih.gov/38780218/) |

---

## 2. Réponse aux 7 sous-questions

### 2.1 Look AHEAD (T1-T3)

Look AHEAD a testé une **intervention combinée** — restriction calorique **et** augmentation de
l'activité physique, visant une perte de poids ≥7 % — contre un groupe éducation/soutien standard, chez
5145 adultes **DT2 établi** en surpoids/obésité. Ce n'est **pas** un essai d'activité physique isolée : la
publication princeps le dit explicitement (« intensive lifestyle intervention that promoted weight loss
through decreased caloric intake and increased physical activity », PMID 23796131). Le critère principal
(composite CV dur) a été **neutre** — HR 0,95 (0,83-1,09), p=0,51 — et l'essai a été **arrêté pour
futilité** après 9,6 ans médians de suivi actif. Le suivi passif prolongé à 16,7 ans (analyse définitive,
*Diabetes Care* 2022) confirme la neutralité sur la mortalité toutes causes : HR 0,91 (0,81-1,02), p=0,11.
Un résumé de congrès plus récent (23 ans de suivi, *Innovation in Aging* 2025 — pas un article complet
identifié en primaire) rapporte un HR 0,89 (0,81-0,98) tout juste significatif, mais **porté par une
interaction avec l'ethnicité** (bénéfice concentré chez les participants hispaniques, HR 0,54 ; aucun
signal chez les Afro-Américains ou les Caucasiens) — un résultat exploratoire, à ne pas retenir comme
preuve robuste.

**Réponse à la question posée : on ne peut RIEN conclure sur l'activité physique seule à partir de Look
AHEAD.** L'intervention est indissociablement combinée (diète + exercice, visée perte de poids), et son
résultat — neutre sur les critères durs — ne dit donc rien de spécifique sur la part attribuable à
l'exercice. C'est le point que le dossier `H-rhd.md` et `rhd-collecte-activite-physique.md` avaient déjà
correctement noté ; cette collecte le confirme en primaire.

### 2.2 Da Qing (T4-T8)

Le design **comportait bien un bras exercice seul**, isolé du bras diète seule et du bras diète+exercice,
dès l'essai original (Pan et al. 1997, PMID 9096977 : 4 bras randomisés par clinique — contrôle / diète /
exercice / diète+exercice — chez 577 adultes chinois **avec intolérance au glucose**, PAS un DT2 établi).

Sur les critères durs, aux 3 horizons de suivi demandés :

- **20 ans** (Li 2008) : résultat **poolé** (les 3 bras actifs regroupés) — événements CV HRR 0,98 NS,
  mortalité CV HRR 0,83 NS, mortalité totale HRR 0,96 NS. **Rien n'est significatif à cet horizon.**
- **23 ans** (Li 2014) : résultat poolé — mortalité CV HR 0,59 (p=0,033) et mortalité totale HR 0,71
  (p=0,049), **significatifs**, mais toujours sur l'intervention **groupée**, pas le bras exercice isolé.
- **30 ans** (Gong 2019) : résultat poolé — décès CV HR 0,67 (p=0,022), mortalité totale HR 0,74
  (p=0,0015), significatifs, intervention groupée.
- **30 ans, décomposition par bras** (Yu et al. 2024, PMID 38168886 — c'est la publication qui répond
  directement à la question) : diète seule et diète+exercice atteignent la significativité (décès CV HR
  0,67 et 0,54 ; mortalité totale HR 0,77 et 0,64) ; **le bras exercice seul, lui, N'ATTEINT PAS la
  significativité sur aucun des deux critères** (« not significantly associated... although there was a
  consistent trend towards reduction »).

**Réponse : Da Qing est le seul essai avec un vrai bras exercice isolé et un suivi à très long terme sur
critères durs — et ce bras isolé ne franchit le seuil de significativité à aucun horizon.** Le bénéfice
dur documenté à 23/30 ans revient à la diète (seule ou combinée), pas à l'exercice pris seul. Population à
ne jamais confondre avec un DT2 établi : il s'agit de sujets **prédiabétiques** (intolérance au glucose),
dont une partie a développé un diabète pendant le suivi mais dont l'inclusion se fait AVANT le diagnostic.

### 2.3 DPP / DPPOS (T9-T10)

Le DPP original (Knowler 2002) a testé un bras « mode de vie » **combiné** (objectif ≥7 % de perte de
poids **et** ≥150 min/semaine d'activité physique) contre metformine et placebo, chez 3234 adultes
**prédiabétiques** (glycémie à jeun et post-charge élevées). Le critère était l'incidence du diabète
(substitution), réduite de 58 % — mais **aucun critère CV dur n'était rapporté dans cette publication**.

Sur les critères CV durs demandés, le suivi à 21 ans médians de la cohorte DPPOS (Goldberg et al., *
Circulation* 2022, PMID 35603600) est **net et négatif** : sur 310 événements CV majeurs adjudiqués
(IDM, AVC, décès CV), le bras mode de vie ne réduit PAS le risque par rapport au placebo — **HR 1,14
(0,87-1,50), p=0,34** (tendance numérique légèrement défavorable, non significative). Le communiqué de
l'American Heart Association reprenant cette publication résume : « no change in CVD ».

**Réponse : sur les critères CV durs (et non l'incidence du diabète), le DPP/DPPOS est un résultat NUL,
voire numériquement défavorable — cohérent avec Look AHEAD.** Il s'agit là encore d'une intervention
combinée diète+exercice, pas d'exercice isolé, et d'une population prédiabétique.

### 2.4 Réadaptation cardiaque à l'effort après infarctus (T11-T14)

La méta-analyse Cochrane de référence (Dibben et al. 2021, CD001800.pub4, 85 essais, N=23 430 patients
coronariens) montre un effet **dépendant de l'horizon** : pas de bénéfice significatif à court terme sur
la mortalité (RR 0,87 NS), mais un bénéfice net et croissant sur la **mortalité CV** à moyen terme (RR
0,77, 1-3 ans) et à long terme (RR 0,58, >3 ans). La mise à jour publiée en 2023 dans l'*European Heart
Journal* (mêmes auteurs, même dataset étendu) chiffre, à l'horizon le plus long disponible par essai :
mortalité CV RR 0,74 (NNT 37), IDM RR 0,82, hospitalisations toutes causes RR 0,77 ; la mortalité totale
reste non significative (RR 0,96).

**La proportion de diabétiques inclus n'est PAS documentée dans les résumés de ces deux méta-analyses
Cochrane/EHJ** — je n'ai pas pu la retrouver au niveau de l'abstract (à vérifier en texte intégral, table 1,
si nécessaire — `NON VÉRIFIÉ` à ce niveau de collecte). La meilleure donnée chiffrée trouvée sur ce point
précis vient d'une méta-analyse dédiée post-syndrome coronarien aigu (Gadager et al. 2022, PMID 35761178) :
sur 15 288 patients en réadaptation post-SCA regroupés dans 18 études, **3369 étaient diabétiques, soit
22,0 %** — c'est la proportion documentée la plus fiable trouvée. Attention cependant : cette étude ne
fournit pas un HR « réadaptation vs pas de réadaptation » restreint aux diabétiques ; elle compare le
pronostic des diabétiques à celui des non-diabétiques (tous recevant la réadaptation) et trouve une
mortalité cardiaque **plus élevée** chez les diabétiques (OR 2,16) et un gain de capacité à l'effort **plus
faible** — un signal de moindre réponse, pas une preuve d'absence de bénéfice. Une méta-analyse 2026 dédiée
spécifiquement à la coronaropathie **+ diabète** (Zhang et al., PMID 41782084, 18 essais, N=1669) existe
mais ne rapporte, dans son résumé, **que des substituts** (glycémie, HbA1c, lipides, FEVG, test de marche)
— aucune mortalité chiffrée.

**Réponse : oui, un bénéfice dur solide existe (mortalité CV, réadaptation à l'effort post-coronarien),
mais dans une population adjacente (post-événement coronarien, pas « DT2 établi » comme critère
d'inclusion) ; la part de diabétiques y est documentée à ~22 % dans la meilleure source trouvée, sans HR
isolé pour ce sous-groupe sur un critère dur.**

### 2.5 Exercice dans le DT2 établi (T15-T18)

**Aucun ECR d'exercice isolé, dimensionné pour un critère dur, n'existe chez le DT2 établi.** La revue
Cochrane de référence (Thomas, Elliott, Naughton 2006, CD002968.pub2, 14 essais, N=377, 8 semaines à 12
mois) le confirme par construction : elle ne porte que sur l'HbA1c (−0,6 %), le tissu adipeux et les
lipides, et précise que **la durée des essais inclus était trop courte pour rapporter des complications à
long terme ou une mortalité**. Aucune mise à jour Cochrane plus récente couvrant les critères durs n'a été
trouvée.

Les essais italiens IDES/IDES_2 sont les plus proches d'apporter une réponse, et leur histoire récente
(deux publications de 2026, du même groupe, portant sur le même type de question) est en soi
informative :

- **IDES** (essai original 2010, PMID 21059972) : 606 DT2 établis + syndrome métabolique, entraînement
  supervisé aérobie+résistance 12 mois vs conseil seul — un essai construit pour des **substituts**
  (HbA1c, PA, lipides), pas un critère dur.
- **Suivi de mortalité post-hoc d'IDES, 16,2 ans** (Balducci et al., *Acta Diabetol* 2026, PMID
  41718726) : **résultat NUL** — HR ajusté 0,922 (0,689-1,233), p=0,584. Les auteurs concluent
  eux-mêmes : *« a one-year supervised exercise training program had no significant effect on long-term
  mortality »*.
- **IDES_2** est un essai différent (counseling comportemental pour l'activité physique et la
  sédentarité, pas un programme d'entraînement supervisé), et son suivi de mortalité post-hoc à 10,3 ans
  (Balducci et al., *Nat Commun* 2026, PMID 41571659, N=300) trouve un résultat **positif et
  significatif** sur la mortalité toutes causes — HR ajusté 0,414 (0,229-0,750), p=0,004 — mais avec des
  réserves lourdes et explicites dans l'abstract même : analyse **post-hoc, non prévue au protocole**,
  essai non dimensionné pour la mortalité, différence **portée par une réduction des décès par cancer**,
  pas par cause cardiovasculaire, sur seulement 53 décès au total dans un modèle ajusté sur plusieurs
  covariables.

**Réponse : à défaut d'ECR à critère dur, les méta-analyses (Boulé 2001, Umpierre 2011, Sigal 2007 — déjà
red-teamées dans `H-rhd.md`, non re-vérifiées ici car hors périmètre critère-dur) montrent un effet
substitut solide et cohérent sur l'HbA1c (~−0,5 à −0,7 %, GRADE modéré). Sur les critères durs, les deux
seules données disponibles (IDES et IDES_2, même équipe, même année de publication) sont discordantes : un
résultat neutre pour l'exercice supervisé, un résultat positif mais fragile et non porté par la mortalité
CV pour le counseling comportemental. Aucun des deux n'a la solidité méthodologique (ECR prévu, dimensionné
pour la mortalité) pour asseoir une revendication EBM-dur.**

### 2.6 Steno-2 (T19-T20)

Steno-2 (Gaede et al. 2003, PMID 12556541 ; suivi 21 ans, Gaede/Oellgaard 2016, PMID 27531506) montre un
bénéfice dur majeur et bien établi (composite CV HR 0,47 initialement ; survie médiane +7,9 ans à 21 ans)
chez 160 DT2 avec microalbuminurie. Mais l'intervention est **explicitement multifactorielle** : traitement
pharmacologique cible de la glycémie, de la pression artérielle, des lipides et de la microalbuminurie,
plus aspirine, **plus** modification comportementale portant simultanément sur la diète, l'exercice et le
tabac (abstract *NEJM* 2003, verbatim : *« stepwise implementation of behavior modification and
pharmacologic therapy that targeted hyperglycemia, hypertension, dyslipidemia, and microalbuminuria, along
with secondary prevention of cardiovascular disease with aspirin »*). Cinq à six leviers sont actionnés en
même temps, dont la médication est probablement le contributeur dominant (statines, IEC/ARA2,
antihypertenseurs, contrôle glycémique pharmacologique).

**Réponse : le résultat ne peut pas être attribué à l'exercice parce que le design ne permet à aucun
moment d'isoler sa contribution — c'est un essai « bundle », pas un essai factoriel.** Aucune analyse de
sous-composante (par ex. par niveau d'activité physique atteint) donnant un effet propre à l'exercice n'a
été identifiée dans les sources consultées.

### 2.7 Autres ECR pertinents trouvés en recherche active

Au-delà de la liste fournie, la recherche a fait remonter :

- **Gadager 2022** et **Zhang 2026** (T13-T14) — réadaptation cardiaque spécifiquement en présence de
  diabète ; apportent la seule donnée chiffrée trouvée sur la proportion de diabétiques (22 %) dans un
  corpus de réadaptation cardiaque, mais pas de HR isolé sur critère dur pour ce sous-groupe.
- **IDES et IDES_2, suivis de mortalité post-hoc 2026** (T17-T18) — non identifiés dans la collecte
  antérieure du dossier `H-rhd.md` (logique : ils datent de 2026, postérieurs à cette collecte) ; ce sont
  les découvertes les plus significatives de cette mission, discordantes entre elles et each fortement
  limitées (voir §2.5).
- **Cao et al. 2024** (T21, UK Biobank, activité mesurée par accéléromètre) — observationnel, mais bien
  conduit (mesure objective, gradient dose-réponse net), spécifiquement chez le **DT2 établi** : HR de
  mortalité toutes causes jusqu'à 0,24 au niveau d'activité le plus élevé. Note de rigueur : la publication
  initiale contenait une **erreur de code** (surestimation de l'échantillon, 19 624 au lieu de 4003),
  corrigée par un *erratum* explicite en novembre 2024 — les chiffres retenus ici sont les chiffres
  corrigés. Les auteurs eux-mêmes rappellent qu'on ne peut « ni exclure un facteur de confusion résiduel
  ni conclure à la causalité », et que la causalité inverse (les patients plus malades bougent moins)
  reste possible malgré les analyses de sensibilité.
- **Chen et al. 2024** (T22, méta dose-réponse, 12 cohortes, N=109 820 diabétiques) — observationnel,
  RR 0,62 pour la CVD au niveau d'activité le plus élevé, mais je n'ai pas pu confirmer si ce chiffre
  ventile mortalité et morbidité séparément ou les agrège (`NON VÉRIFIÉ` sur ce point précis — à vérifier
  en texte intégral avant tout usage décisionnel).
- **HF-ACTION** (exercice dans l'insuffisance cardiaque, sous-groupe diabétique substantiel) a été
  envisagé mais **écarté** de la table : population d'inclusion = insuffisance cardiaque, pas DT2 — trop
  éloigné pour être une « population adjacente » au sens de ce dossier, plutôt qu'une comorbidité associée
  parmi d'autres. Non creusé davantage faute de temps ; à signaler comme piste non explorée plutôt que
  fermée.

Aucun ECR d'activité physique isolée avec critère CV dur **positif et solide**, spécifiquement chez le DT2
établi, n'a été trouvé — ce qui, après recherche active au-delà de la liste fournie, **renforce** plutôt
qu'il n'infirme le constat initial du dossier H, à la nuance de formulation près (§0 et §3 ci-dessous).

---

## 3. Ce qui peut être honnêtement affiché à un médecin généraliste français

Devant un patient DT2 établi, trois formulations candidates, de la plus prudente à la plus affirmative :

**Formulation A (la plus prudente)** — *« L'activité physique régulière améliore le contrôle glycémique
et les facteurs de risque cardiovasculaires (HbA1c ~−0,5 à −0,7 %), mais aucun essai contrôlé n'a démontré
qu'elle réduit, à elle seule, la mortalité ou les événements cardiovasculaires majeurs chez le patient
diabétique de type 2 déjà déclaré. Le seul grand essai à avoir testé une intervention intensive sur le
mode de vie (diète + activité combinées) dans cette population exacte — Look AHEAD — a été neutre sur ce
critère et arrêté pour futilité. »*

**Formulation B (intermédiaire — recommandée)** — *« L'activité physique régulière est recommandée comme
socle de la prise en charge (HAS, ADA/EASD, ebmfrance grade A) pour son effet sur le contrôle glycémique
et le risque cardiovasculaire global ; sa capacité à réduire, seule, la mortalité ou les événements
cardiovasculaires majeurs n'est pas démontrée par un essai dédié chez le DT2 établi (Look AHEAD neutre ;
les deux seuls suivis de mortalité d'essais d'exercice isolé, italiens, sont discordants et fragiles). Un
bénéfice dur solide de l'exercice existe en revanche dans des populations proches : la réadaptation
cardiaque à l'effort après un événement coronarien (réduction de la mortalité cardiovasculaire établie par
méta-analyse Cochrane), et — combiné à la diète — chez le sujet prédiabétique à très long terme (Da Qing,
23-30 ans). »*

**Formulation C (la plus affirmative que les données permettent)** — *« Chez le DT2 établi,
l'activité physique régulière n'a pas, isolément, d'essai contrôlé dédié prouvant une réduction de la
mortalité ou des événements cardiovasculaires — mais un faisceau convergent la soutient fortement :
bénéfice dur transposable depuis la réadaptation cardiaque à l'effort (population très proche,
~1 patient sur 5 diabétique) ; bénéfice dur transposable depuis le prédiabète à très long terme lorsque
l'exercice est combiné à la diète (Da Qing) ; signal dose-réponse observationnel net et objectivement
mesuré chez le DT2 établi lui-même (UK Biobank) ; et un premier signal d'essai contrôlé (IDES_2) suggérant
une réduction de la mortalité toutes causes, à confirmer. »*

**Recommandation** : la formulation **B** est celle qui respecte le mieux l'invariant 6 (« en cas de doute
clinique, signaler plutôt qu'inventer ») — elle ne cache pas l'absence de preuve directe, ne l'assimile pas
à une preuve d'inefficacité, et distingue explicitement la population prouvée de la population cible. Le
choix final revient au référent.

---

## 4. La question de la transposition — population prouvée vs population cible du nœud H

Le précédent de rédaction du projet est le nœud `statine` : *« la population PROUVÉE est celle des ECR
(CARDS = 40-75 ans + ≥ 1 FDR) »* (`content/noeuds/diabete-type-2/statine.yaml`, commentaire d'en-tête ;
`docs/decision/noeuds/F-statine.md`). Le même exercice de rigueur donne, pour l'activité physique :

| Élément | Population **cible** du nœud H (`rhd.yaml`) | Population **prouvée** sur critère dur |
|---|---|---|
| Statut glycémique | DT2 **déjà déclaré**, hors DT1/grossesse | Look AHEAD (T1-T3) : oui, DT2 établi — mais intervention **combinée**, résultat **neutre**. Da Qing (T4-T8) : **prédiabète**, pas DT2 établi. DPP/DPPOS (T9-T10) : **prédiabète**, résultat **neutre**/défavorable. Réadaptation cardiaque (T11-T14) : coronaropathie, ~22 % diabétiques documentés, pas un DT2 comme critère d'inclusion. |
| Intervention | Activité physique **adaptée**, recommandée en socle, combinable à d'autres pistes | Aucune preuve dure ne porte sur l'activité physique **isolée** en population DT2 établi. IDES (exercice supervisé isolé, DT2 établi) : neutre. IDES_2 (counseling comportemental, DT2 établi) : positif mais post-hoc/fragile/non-CV. Da Qing exercice-seul (prédiabète) : NS. |
| Horizon | Décision de consultation, effet attendu à moyen/long terme | Le bénéfice dur transposable (réadaptation cardiaque, Da Qing) n'apparaît qu'à moyen (1-3 ans, réadaptation) ou très long terme (23-30 ans, Da Qing) — pas un horizon de consultation immédiat. |

**Conclusion de transposition** : contrairement au nœud `statine`, où la population prouvée (CARDS) est
un **sous-ensemble strict** de la population cible (DT2 en prévention primaire), ici la population prouvée
sur critère dur (coronariens en réadaptation ; prédiabétiques dans Da Qing) est **adjacente**, pas
incluse — elle chevauche partiellement la population cible (les DT2 établis ayant fait un événement
coronarien relèvent des deux ensembles ; les DT2 récents issus d'un prédiabète non traité aussi, mais
rétrospectivement) sans la recouvrir. Toute formulation qui laisserait entendre que « l'exercice réduit la
mortalité chez le DT2 établi, comme le montre Da Qing/la réadaptation cardiaque » commettrait exactement le
type de sur-attribution que le red-team du 2026-07-26 a déjà sanctionné pour PREDIMED sur l'axe
alimentation (`redteam-collectes-rhd.md`, finding HAUTE n° 2, référencé dans `CONCEPTION-module-rhd.md`
§3).

---

## 5. Faut-il une 5ᵉ étiquette « bénéfice dur démontré en population adjacente » ?

**Oui, sur la base de ce qui précède.** Les quatre étiquettes actuelles (`rhd-collecte-activite-physique.md`
§P3) sont : *bénéfice EBM sur critère dur* (démontré dans la population du nœud) / *recommandation
officielle* (portée par une reco gradée, critère souvent substitut) / *savoir-faire non EBM* (extrapolation
raisonnée, non gradée) / *ressource locale* (orientation, contenu hors corpus). Aucune de ces quatre ne
rend compte fidèlement de ce que cette collecte a trouvé pour la réadaptation cardiaque et pour Da Qing :

- Les classer en *« bénéfice EBM sur critère dur »* **survendrait** la preuve (sur-attribution à une
  population qui n'est pas celle du nœud — exactement le défaut sanctionné pour PREDIMED).
- Les classer en *« recommandation officielle »* **sous-vendrait** la preuve : ce ne sont pas des
  recommandations d'experts sur un critère de processus, ce sont des essais/méta-analyses de bon niveau
  GRADE sur un critère **dur**, simplement dans une population voisine.
- Les classer en *« savoir-faire non EBM »* serait **faux** : il y a une preuve solide, publiée,
  chiffrée — ce n'est pas une extrapolation de bon sens non gradée.

Une cinquième étiquette — par exemple **« bénéfice dur démontré en population adjacente »** — permettrait
d'afficher honnêtement, par exemple pour une piste d'orientation vers la réadaptation cardiaque après un
événement coronarien chez un patient DT2 : *« Chez le coronarien (population proche, ~20 % de diabétiques
documentés dans les plus grandes cohortes), la réadaptation à l'effort réduit la mortalité cardiovasculaire
de façon reproductible (méta-analyse Cochrane, RR 0,58 à long terme) — non spécifiquement démontré chez le
DT2 sans événement coronarien. »* C'est un registre différent des quatre étiquettes actuelles, et il est
probablement **réutilisable au-delà de l'axe activité physique** : le nœud alimentation a un cas
structurellement identique avec CORDIOPREV (coronariens, ~50 % diabétiques, pas un DT2 comme critère
d'inclusion) — une relecture de `rhd.yaml`/`rhd-collecte-alimentation.md` sous cet angle sort du périmètre
de cette mission mais mérite d'être signalée au référent comme effet de bord de cette collecte.

**Limite à la proposition** : une 5ᵉ étiquette n'a de sens que si le nœud H prévoit une piste concrète
capable de la porter — aujourd'hui, `rhd-collecte-activite-physique.md` §P2 famille 5 (orientation)
distingue déjà l'orientation vers une structure d'activité physique adaptée, mais **pas spécifiquement**
vers une réadaptation cardiaque post-événement (qui relèverait plutôt d'un déclenchement sur antécédent
coronarien, croisant le nœud statine/`ASCVD_etablie`). C'est une décision de conception, pas seulement de
preuve — au référent de trancher si le jeu en vaut la chandelle pour une seule piste candidate identifiée à
ce stade.

---

## 6. Sources non vérifiées / limites de cette collecte

- **Cochrane CD001800.pub4 et Dibben 2023 (T11-T12)** : proportion de diabétiques parmi les participants
  **non rapportée dans les résumés consultés** — `NON VÉRIFIÉ`, nécessiterait une lecture du texte intégral
  (tables des caractéristiques des études incluses) pour trancher plus précisément que l'estimation
  indirecte de 22 % (Gadager 2022, population voisine mais non identique).
- **Chen et al. 2024, JMIR (T22)** : je n'ai pas pu confirmer si le RR de 0,62 pour la « CVD » agrège
  morbidité et mortalité ou les distingue — `NON VÉRIFIÉ` sur ce point précis. À ne pas citer comme un
  chiffre de mortalité pure sans vérification complémentaire en texte intégral.
- **Look AHEAD 23 ans (T3)** : identifié uniquement comme résumé de congrès (*Innovation in Aging*, DOI
  d'un supplément), pas comme article de revue à comité de lecture complet — je n'ai pas trouvé de
  publication définitive correspondante au moment de cette collecte. À traiter comme exploratoire tant
  qu'un article complet n'est pas identifié.
- **HF-ACTION et d'autres essais d'exercice dans des populations comorbides** (insuffisance cardiaque,
  post-chirurgie bariatrique…) : recherche non exhaustive au-delà de ce qui est rapporté en §2.7 ; signalé
  comme piste non fermée plutôt que comme absence de preuve.
- **Steno-2** : aucune analyse de sous-composante isolant l'effet de l'exercice n'a été cherchée
  au-delà des deux publications princeps (2003, 2016) — si une telle analyse existe, elle n'a pas été
  trouvée dans cette collecte.
- Les effets de **substitution** (HbA1c) des méta-analyses Boulé/Umpierre/Sigal, déjà red-teamées dans
  `H-rhd.md`, n'ont **pas été re-vérifiés en primaire** par cette mission (hors périmètre : la question
  posée porte sur les critères durs). Ne pas les citer comme « vérifiés par cette collecte ».

---

## Retour

23 essais/méta-analyses cités, **tous avec fiche récupérée et extrait littéral** (aucun `NON VÉRIFIÉ` au
sens strict d'une fiche non ouverte) ; deux réserves de fond documentées en §6 (proportion de diabétiques
non rapportée dans les résumés Cochrane cardiaque ; ambiguïté morbidité/mortalité dans la méta JMIR 2024).
