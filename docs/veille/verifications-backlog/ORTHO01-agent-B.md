# ORTHO01 — Agent B (contradicteur / red-team)

**Article** : Kohmäscher A, Primaßin A, Heiler S, Avelar PDC, Franken MC, Heim S. *Effectiveness of
Stuttering Modification Treatment in School-Age Children Who Stutter: A Randomized Clinical Trial.*
JSLHR 2023;66(11):4191-4205. DOI 10.1044/2023_JSLHR-23-00224. PMID 37801699.
**Source vérifiée** : PDF texte intégral 37 p. (rendu HTML ASHAWire), lu en entier.
**Thème** : `orthophonie` · **Professions** : `orthophoniste` (MG en position de prescripteur/adresseur
uniquement) · **Relecture référent** : `false`, pas d'orthophoniste dans la boucle.

---

## 1. Vérification chiffre par chiffre

Tout est vérifié contre le texte primaire. « p. N » = numéro de page du PDF fourni.

### 1.1 Design, effectifs, flux

| Élément attendu / annoncé | Trouvé dans la source | Localisation | Verdict |
|---|---|---|---|
| ECR multicentrique, 2 bras parallèles, liste d'attente, **ouvert** (open-label) | « multicenter, two-group parallel, randomized, wait-list controlled, and **open-label** trial » | p. 7 | ✅ exact |
| Enregistrement prospectif | DRKS00015851, date d'enregistrement **2018/11/07** ; inclusions à partir de **déc. 2018** | p. 7 et p. 14 | ✅ prospectif (enregistré avant la 1re inclusion) |
| 73 enfants randomisés | 121 adressés → 47 exclus → **73 randomisés** (37 immédiat / 36 différé) | p. 14, Fig. 2 | ✅ exact |
| n = 33 vs n = 29 à 3 mois | « For between-group comparisons after 3 months, the data of 62 children (n = 33, n = 29) were available » | p. 14 | ✅ exact (62/73 = 85 %) |
| n = 59 à 12 mois | 33 (immédiat) + 26 (différé) = **59** | p. 14, Fig. 2 | ✅ exact |
| Âge 7–11 ans | Critère d'inclusion 7.0–11.0 ans ; M = 8.33 ± 1.14 vs 8.31 ± 1.11 | p. 8, Table 1 p. 15 | ✅ exact |
| 34 centres, 26 cliniciens | 34 centres ; 37 cliniciens consentants, **26 ont réellement traité** | p. 8 | ✅ exact |
| Suivi 12 mois | T0/T1(3m)/T2(6m)/T3(12m) ; T4(15m) pour le seul groupe différé | Fig. 1 p. 8 | ✅ exact |
| Aveugle des évaluateurs | Auteur 2 code les échantillons ; auteurs **1, 3, 4 aveugles au bras ET au temps** pour l'analyse des échantillons de parole | p. 9 | ✅ exact — mais aveugle **impossible** pour OASES-S et cotations parentales |

### 1.2 Critère principal et comparaison contrôlée à 3 mois (Table 2, p. 18-19)

Comparaison **entre groupes** des scores de changement T0→T1. p **unilatéraux**, correction
Bonferroni-Holm **par instrument**.

| Mesure | t(60) | p non corr. | **p corr.** | d | Verdict |
|---|---|---|---|---|---|
| **OASES-S total (critère principal)** | 2.451 | .009 | **.026** | **0.624** (moyen) | ✅ significatif |
| OASES-S — General Information | 3.369 | .001 | **.003** | **0.858** (grand) | ✅ significatif |
| OASES-S — Reactions to Stuttering | 0.463 | .261 | .261 | 0.164 | ❌ NS, effet négligeable |
| OASES-S — Communication in Daily Situations | 0.914 | .182 | .182 | 0.233 | ❌ NS |
| OASES-S — Quality of Life | 2.790 | .004 | **.014** | **0.710** (moyen) | ✅ significatif |
| **Parents — sévérité subjective** | 0.461 | .323 | .323 | **−0.118** | ❌ NS |
| **Parents — satisfaction communication** | 0.002 | .499 | .499 | **< 0.001** | ❌ NS, effet nul |
| **SSI-4 total (objectif)** | 0.363 | .359 | .359 | **0.092** | ❌ NS |
| **SSI-4 fréquence (parole spontanée)** | 0.320 | .375 | .375 | **0.082** | ❌ NS |
| **SSI-4 durée** | −0.596 | .277 | .277 | **−0.152** | ❌ NS, **signe défavorable** |
| **SSI-4 concomitants physiques** | 0.373 | .349 | .349 | **0.095** | ❌ NS |

Confirmé textuellement p. 18 : « No other comparisons of the secondary outcomes reached statistical
significance » ; et p. 24 : « **none of the changes in the secondary outcome measures were
significantly larger in the immediate-treatment group for this time interval** ».

Moyennes OASES-S (p. 17) : immédiat 2.55 → 2.17 ; différé 2.35 → 2.23. Différence de différences
≈ **0.26 point** sur une échelle 1–5. Le calcul de puissance visait une réduction de 0.5 point
(p. 12) : **l'effet observé fait la moitié de l'effet postulé**.

### 1.3 Analyse à 6 et 12 mois (Table 3 p. 20-21, Table 4 p. 22-23)

| Élément | Trouvé | Localisation | Verdict |
|---|---|---|---|
| Nature de l'analyse | « Medium-term outcomes up to 12 months were analyzed **for all children by aligning and pooling data from the two treatment groups** » | p. 13 | ⚠️ **avant/après sur groupe unique, plus aucun comparateur** |
| Recalage temporel | Les 4 temps sont alignés sur le **début de thérapie**, pas sur la randomisation | p. 13, Fig. 1 | ⚠️ le bras contrôle disparaît par construction |
| OASES-S total à 12 mois | F(2.413; 139.940) = 27.795 ; p < .001 ; **partial η² = .324** | Table 3 p. 20 | ✅ exact (chiffre de l'abstract confirmé) |
| SSI-4 total à 12 mois | F(2.283; 130.114) = 6.323 ; p = .002 ; η² = **.100** (moyen) | Table 3 p. 21 | ✅ exact |
| SSI-4 fréquence | F = 5.389 ; p = .002 ; η² = .085 | Table 3 p. 21 | ✅ exact |
| SSI-4 durée | F = 0.799 ; p = .473 ; η² = .014 | Table 3 p. 21 | ❌ **NS même sans comparateur** |
| SSI-4 concomitants physiques | F = 2.895 ; p = .040 ; η² = **.048** (petit) | Table 3 p. 21 | ⚠️ significatif mais effet petit ; en pairwise, significatif **uniquement** 12 m vs départ (p_corr = .035) |
| Parents — sévérité subjective | F = 9.748 ; p < .001 ; η² = .144 | Table 3 p. 21 | ✅ exact |
| Parents — satisfaction | F = 5.540 ; p = .002 ; η² = .087 | Table 3 p. 21 | ✅ exact |
| Ampleur clinique SSI-4 | « reduced on average by **2 points** over 12 months » | p. 23 | ✅ exact — 2 points sur un score initial de 19/16, tous deux **« mild »** |
| Fréquence de bégaiement | **4.80 % → 3.64 %** de syllabes bégayées à 12 mois | p. 23 | ✅ exact — 1,16 point de pourcentage, sans comparateur |

**Point capital confirmé** : l'abstract énonce « treatment outcomes up to 12 months were analyzed
(n = 59) » et « This was paralleled by significant improvements in parental ratings and objective
ratings ». Ces améliorations objectives sont **toutes issues de l'analyse sans témoin**. Au seul
point où un témoin non traité existait (3 mois), **aucune** mesure objective ne bouge.

### 1.4 Puissance, multiplicité, ITT

| Élément | Trouvé | Localisation | Verdict |
|---|---|---|---|
| Puissance a priori | G*Power, α = .05, 1−β = .80, f = 0.2, → **N total = 52** | p. 12 | ✅ présent ; 62 analysés à 3 mois > 52 |
| Attrition anticipée | jusqu'à 30 % → cible **75 enfants** ; 73 inclus | p. 12 | ⚠️ cible non tout à fait atteinte (73/75) |
| Qualification de f = 0.2 | les auteurs écrivent « **a medium effect of f = 0.2** » | p. 12 | ❌ **erreur** : chez Cohen, f = 0.10 petit, **0.25 moyen**, 0.40 grand. f = 0.2 est petit-à-moyen. La puissance a été calculée sur un effet plus petit que « moyen », ce qui *réduit* N — mais l'étiquette est fausse |
| Tests | « independent-sample *t* test (**one tailed**) » ; note Table 2 : « p values are reported **one tailed** » ; note Table 4 : « p values are **one sided** » | p. 13, 19, 23 | ⚠️ **tout est unilatéral** |
| Correction de multiplicité | Bonferroni-Holm, « corrected **for the number of comparisons per test instrument** » | p. 13, note Table 2 p. 19 | ⚠️ correction **par instrument** (5 / 2 / 4), pas sur les **11** comparaisons de la Table 2 |
| Comptage des comparaisons à 3 mois | **11** lignes dans la Table 2 (5 OASES-S + 2 parentales + 4 SSI-4) | Table 2 p. 18-19 | vérifié |
| ITT | « All outcomes were assessed using **intention-to-treat** analysis… **last-observation-carried-forward** » | p. 12 | ❌ **contredit par la Fig. 2** : 37 randomisés → 33 analysés (immédiat) ; 36 → 29 (3 m) puis 26 (12 m). Les non-traités sont **retirés**, pas imputés. C'est une ITT modifiée, au mieux |

**Vérification du calcul de Holm** (5 comparaisons OASES-S, valeurs non corrigées triées .001 / .004 /
.009) : ×5, ×4, ×3 → .003 / .014 / .026. Les valeurs corrigées de la Table 2 correspondent exactement.
✅ **La correction est appliquée correctement.** Je ne trouve pas de faute ici.

**En revanche, dérivation personnelle (à valider par l'agent C)** : si l'on repasse en **bilatéral**
(doublement des p non corrigés, puis Holm sur 5) → General Information ≈ .006, Quality of Life ≈ .028,
**OASES-S total ≈ .052**. Le **critère principal deviendrait non significatif** au seuil bilatéral usuel.
Le protocole formulait bien une hypothèse directionnelle (H1, p. 6), ce qui est l'argument classique en
faveur de l'unilatéral ; il reste que le résultat principal du dossier tient à ce choix de test.

### 1.5 Comparabilité initiale (Table 1, p. 15-16)

| Caractéristique | Immédiat | Différé | p | Lecture |
|---|---|---|---|---|
| OASES-S total | 2.55 ± 0.52 | 2.35 ± 0.44 | .086 | plus atteint dans le bras traité |
| SSI-4 total | **19 ± 8.6 — « mild »** | **16 ± 7.6 — « mild »** | .177 | idem ; **population globalement légère** |
| Fréquence bégaiement (%) | 6.0 ± 5.1 | 4.6 ± 4.0 | .165 | idem |
| Bilinguisme | 12 (39 %) | 8 (28 %) | .413 | — |
| Sexe masculin | 28 (85 %) | 26 (90 %) | .510 | — |
| Antécédent familial | 11 (36 %) | 15 (52 %) | .176 | — |
| Traitement antérieur : aucun | 19 (63 %) | 14 (52 %) | .527 | — |
| **OASES-S — Quality of Life** | — | — | **significatif** | « t tests were nonsignificant for all outcome measures at T0 **except for the subscale OASES-S Quality of Life** (with higher scores for the immediate-treatment group) » (p. 15) |

⚠️ Le p exact du déséquilibre initial sur la sous-échelle Quality of Life **n'est pas donné** dans la
Table 1 ni dans le texte — seulement l'affirmation qualitative. Non vérifiable en l'état.

### 1.6 COVID-19, modalité, fidélité

| Élément | Trouvé | Localisation |
|---|---|---|
| Période d'inclusion | déc. 2018 → juin 2021 | p. 14 |
| Bascule en visio | « Beginning with the **first COVID-19 lockdown in March 2021** … face-to-face assessments in the participating centers had to be replaced with **video consultations** » | p. 12 |
| ❌ **Erreur factuelle probable** | Le premier confinement allemand est de **mars 2020**, pas mars 2021. Soit coquille, soit désignation d'un confinement ultérieur ; dans les deux cas l'imprécision porte sur la datation d'une rupture méthodologique majeure | p. 12 |
| Thérapie en visio | **27 cas (47 %)** ont combiné visio et présentiel ; moyenne **16 %** des séances en visio, **étendue 4 %–67 %** | p. 16-17 |
| Interruptions | « the COVID-19 pandemic … forced clinicians to **pause treatments for at least several weeks** and to switch to video therapy **without having prior experience** » | p. 28 |
| Séances | 11 (SD 2) séances sur les 3 premiers mois ; 26 (SD 9) séances sur 39 semaines (SD 14) sur 12 mois | p. 16 |
| Achèvement | 32 enfants (62 %) traitement terminé dans les 12 mois ; **11 (21 %) poursuivaient après l'essai** | p. 16 |
| Fiabilité inter-juges | Krippendorff α : fréquence .969, durée .889, concomitants .899 ; intra-juge .942 / .934 / .876 | p. 17 |

### 1.7 Financement et conflits d'intérêt

| Recherché | Trouvé |
|---|---|
| Section « Funding » / « Disclosure » / « Conflict of interest » / « Author Contributions » | **ABSENTE du document lu.** Les sections de fin sont, dans l'ordre : *Data Availability Statement* (p. 29), *Acknowledgments* (p. 29), *Footnote* (p. 29-30), *Supplemental Material on Figshare* (p. 30), *References* (p. 30-37). Aucune déclaration de financement ni de liens d'intérêt |
| Remerciements | Hillebrandt, Holzheimer, Krug, Wiele (organisation) ; cliniciens et familles ; Editage (relecture anglaise) — aucun financeur nommé (p. 29) |
| Données | « Due to ethical concerns, supporting data **cannot be made openly available** » (p. 29) |

⚠️ **Conflit d'intérêt intellectuel non déclaré dans ce rendu, et repérable dans la bibliographie
elle-même** : le manuel de traitement utilisé dans l'essai est **Schneider P. & Kohmäscher A. (2022),
*Schul-KIDS: Manual zur Therapie stotternder Schulkinder*, Natke** (référence p. 35, citée p. 10 et
p. 28 comme « the KIDS manual »). **A. Kohmäscher, première auteure de l'essai, est co-auteure du
manuel qu'elle évalue.** Le manuel de l'essai est par ailleurs attribué à « the authors of KIDS
(Schneider & Sandrieser, 2018) » (p. 9). Kohmäscher est également auteure de la traduction allemande
de l'OASES-S servant de critère principal (Euler, Kohmäscher et al., 2016, p. 32) et de sa validation
(Kohmäscher, 2017, p. 33), ainsi que de l'enquête établissant la prédominance de KIDS (Kohmäscher,
2019, p. 33). **Développeur, traducteur de l'outil de mesure, et évaluateur** : trois casquettes,
zéro déclaration dans le document lu.

---

## 2. Objections méthodologiques, par gravité

### G1 — Rédhibitoire. La seule comparaison contrôlée de l'essai repose entièrement sur un auto-rapport non aveuglable, et toutes les mesures aveuglées sont négatives au même moment

L'essai est déclaré **open-label** (p. 7). L'enfant, ses parents et le clinicien savent tous s'il est
traité tout de suite ou dans trois mois. Le critère principal (OASES-S) est un **questionnaire rempli
par l'enfant** sur son vécu du bégaiement. Il est structurellement impossible de l'aveugler dans ce
design, et il est exposé de plein fouet à l'attente, au désir de plaire au clinicien qu'on voit chaque
semaine depuis trois mois, et à la déception symétrique de l'enfant à qui on a dit d'attendre.

Le point décisif n'est pas théorique, il est dans les chiffres. **Les auteurs ont fait aveugler les
mesures objectives** : après collecte, l'auteur 2 code les échantillons de parole de sorte que les
auteurs 1, 3 et 4 sont « **blinded to group allocation and measurement time points** » (p. 9), avec un
accord inter-juges quasi parfait (α = .889 à .969, p. 17). L'instrumentation aveuglée est donc de bonne
qualité. Or, à 3 mois :

- ce qui **n'est pas aveuglable** (OASES-S enfant) → d = 0.624, p_corr = .026 ;
- ce qui **est aveuglé** (SSI-4 : total d = 0.092 ; fréquence d = 0.082 ; durée d = **−0.152** ;
  concomitants d = 0.095) → **quatre effets nuls, dont un de signe défavorable**.

Un essai où le résultat apparaît exactement là où l'aveugle est impossible et disparaît exactement là où
il est réalisé constitue le patron classique d'un biais de mesure lié à l'ouverture de l'essai. Ce n'est
pas une preuve que l'effet n'existe pas, mais c'est la lecture la plus économique.

**Les auteurs ne discutent pas cette limite.** J'ai relu la section *Strengths and Limitations*
(p. 26-29) ligne à ligne : elle traite du caractère pragmatique, de l'hétérogénéité des cliniciens, du
bilinguisme, de la représentativité des échantillons de parole, du COVID, de l'absence de suivi
post-traitement, de la perte de données extra-cliniques, et des limites de validité des mesures
objectives. **Le mot « open-label » n'y reparaît jamais, et le biais de désirabilité sur l'auto-rapport
n'est nulle part nommé.** La seule chose qui s'en approche est, p. 27, « **the expectancy that change
can happen probably play a major role in the extent of individual improvements** » — mais c'est amené
comme un facteur commun aux psychothérapies expliquant l'hétérogénéité individuelle, pas comme une menace
sur la validité du critère principal.

### G2 — Rédhibitoire. Le résultat principal est porté par une sous-échelle de connaissances, pas par le vécu

La décomposition de l'OASES-S à 3 mois (Table 2, p. 18-19) est accablante pour la lecture clinique
courante du résultat :

- **General Information** : d = **0.858** (grand), p_corr = .003 — **le plus gros effet de tout l'essai** ;
- **Quality of Life** : d = 0.710, p_corr = .014 ;
- **Reactions to Stuttering** : d = 0.164, NS ;
- **Communication in Daily Situations** : d = 0.233, NS.

Or la première phase de KIDS est « information and contract », qui « **includes intensive education on
stuttering** » ; les auteurs eux-mêmes écrivent qu'elle « **might explain the large effect on the
subscale General Information after 3 months of treatment** » (p. 24). Autrement dit : on a enseigné à
l'enfant des connaissances sur le bégaiement, puis on lui a fait remplir un questionnaire dont une
sous-échelle mesure ses connaissances sur le bégaiement. Cette sous-échelle fonctionne ici comme un
**contrôle de manipulation** — elle vérifie que la psychoéducation a été délivrée — et non comme un
bénéfice clinique.

Les deux sous-échelles qui décrivent réellement ce que l'enfant vit — ses réactions à son bégaiement et
sa communication au quotidien — **ne bougent pas**. Le critère principal composite est donc positif
essentiellement grâce à sa composante la moins cliniquement pertinente. Ce point n'est pas discuté comme
une limite ; il est présenté p. 24 comme une confirmation cohérente du rationnel de KIDS.

Aggravant : la seconde sous-échelle contributive, **Quality of Life**, est précisément **la seule
variable déséquilibrée à l'inclusion**, en défaveur du groupe traité (p. 15). Une analyse en score de
changement, sur une variable où le groupe traité part plus haut, est le terrain d'élection de la
**régression vers la moyenne**. Et le déséquilibre va dans le même sens sur toutes les variables
cliniques (OASES total .086, SSI-4 .177, fréquence .165, p. 15-16) : le bras immédiat part
systématiquement plus atteint, donc dispose systématiquement de plus de marge de baisse.

### G3 — Grave. À 6 et 12 mois, il n'y a plus d'essai — il y a une série de cas avant/après

C'est explicite et confirmé mot pour mot : « Medium-term outcomes up to 12 months were analyzed for all
children by **aligning and pooling data from the two treatment groups** for the four time points »
(p. 13), les temps étant recalés sur le **début de thérapie** et non sur la randomisation. Une fois le
groupe liste d'attente traité à 3 mois, **plus aucun enfant n'est non traité**. La Table 3 (p. 20-21)
est une ANOVA à mesures répétées sur un groupe unique de 59 enfants ; la Table 4 (p. 22-23) est une
série de contrastes appariés pré/post.

Toutes les améliorations « objectives » vantées dans l'abstract — SSI-4 total η² = .100, fréquence
η² = .085, concomitants physiques η² = .048, passage de 4.80 % à 3.64 % de syllabes bégayées — sortent
**exclusivement** de cette analyse sans témoin. Elles sont donc compatibles, sans hiérarchie, avec :
l'effet de KIDS, l'évolution naturelle du bégaiement sur un an chez des enfants de 7-11 ans, la
régression vers la moyenne, la maturation, l'attention reçue et l'alliance thérapeutique, et l'effet du
simple passage du temps. Le design ne permet pas de les départager.

**Les auteurs ne reconnaissent pas cette limite en tant que telle.** Elle n'apparaît ni dans
*Strengths and Limitations* (p. 26-29), ni dans les *Conclusions* (p. 29). Le plus proche est p. 27 :
« As is known from psychotherapy, **an intervention itself only partly contributes to treatment
outcomes** … Other common factors, such as the therapeutic alliance, the skills, abilities,
constitutional factors of the client, environmental features, and the expectancy that change can happen
probably play a major role » — argument juste, mais mobilisé pour expliquer la **variabilité
interindividuelle**, pas pour signaler qu'à 12 mois plus rien n'est contrôlé. Et la conclusion
(p. 29) affirme sans réserve : « clinically relevant improvements in the behavioral aspects of
stuttering **can be expected** over the course of 12 months ». Sur une analyse sans comparateur, ce
« can be expected » est une inférence causale non soutenue par le design.

Aggravant, spécifique à ce jeu de données : parmi les 10 enfants du bras différé qui n'ont jamais reçu le
traitement différé, **4 le sont parce que le « treatment [was] not required after waiting period »**
(p. 15, note e de la Fig. 2). Ce sont des enfants qui se sont assez améliorés **en attendant, sans
traitement**, pour ne plus relever d'une prise en charge. Ils sont donc exclus de l'analyse poolée à
12 mois. Autrement dit, l'analyse avant/après retire sélectivement de sa cohorte des cas d'amélioration
spontanée documentés — ce qui va mécaniquement dans le sens d'un effet apparent plus favorable. Ces 4 cas
sont aussi, à eux seuls, la démonstration interne que l'amélioration spontanée existe dans cette
population et sur ce pas de temps.

### G4 — Grave. L'analyse annoncée en ITT n'en est pas une, et le LOCF favorise la thèse du maintien

Le texte affirme : « All outcomes were assessed using **intention-to-treat** analysis. In the case of
participant attrition or missing data, **last-observation-carried-forward** was implemented » (p. 12).
Le diagramme de flux dit autre chose (Fig. 2, p. 14) :

- bras immédiat : **37 randomisés**, 4 « did not receive allocated intervention », **33 analysés** ;
- bras différé : **36 randomisés**, 29 ont accompli l'attente, 26 ont reçu le traitement différé ;
  **29 analysés à 3 mois, 26 à 12 mois**.

Une ITT véritable analyse les 37 et les 36. Ici les non-traités sont **écartés**, pas imputés : c'est
une ITT modifiée. La perte est de **11/73 (15 %) à 3 mois** et **14/73 (19 %) à 12 mois**, et elle est
**asymétrique** : 4/37 (11 %) côté immédiat contre 10/36 (28 %) côté différé.

Cette asymétrie n'est pas du bruit, elle est causée par le design : les motifs de sortie du bras différé
listés p. 15 (retrait après randomisation n = 2, absence de la clinicienne pour grossesse n = 2,
**traitement non requis après l'attente n = 4**, retrait sans motif n = 2) sont pour la plupart des
conséquences directes du fait d'avoir été assigné à l'attente. Sortir de l'étude est un **résultat** de
l'allocation, et le traiter par exclusion revient à conditionner l'analyse sur un événement post-
randomisation.

Le profil des sortants n'est **nulle part comparé** à celui des restants : ni tableau, ni analyse de
sensibilité, ni comparaison des caractéristiques initiales des perdus de vue. Aucune analyse de
sensibilité sur l'imputation n'est rapportée.

Enfin, le LOCF appliqué à la trajectoire sur 12 mois est le pire choix possible pour la question posée :
il reporte la dernière valeur connue — donc, chez un enfant qui s'est amélioré puis a décroché, il
**maintient artificiellement le score amélioré** jusqu'à 12 mois. Le message central du papier étant que
« the initial improvements in the first 3 months **remained stable** up to 12 months » (p. 19), la
méthode d'imputation choisie fabrique en partie la conclusion qu'elle est censée tester.

### G5 — Grave. Spin : conclusion de transfert tirée de données déclarées inanalysables

Deux affirmations sont incompatibles dans le même article.

- p. 25 : « a similar pattern of changes was observed in the beyond clinic samples (see Supplemental
  Material S1), **indicating that changes in stuttering behavior were transferred outside the clinics** ».
- p. 28 : « Due to high data loss, the availability of beyond clinical data **were also limited** in our
  study » ; et p. 27 : « The abovementioned beyond clinic audio samples indicate similar improvements;
  however, **the data were too incomplete for statistical analyses** ».

On ne peut pas conclure au transfert en vie réelle — qui est *le* critère qui intéresserait un praticien
— à partir de données que l'on déclare par ailleurs trop incomplètes pour être analysées
statistiquement. Le verbe « indicating » p. 25 est un spin caractérisé.

Second foyer de spin, l'abstract : « treatment outcomes up to 12 months were analyzed (n = 59),
indicating **large effects of time** on the OASES-S score … This was **paralleled by significant
improvements** in parental ratings and objective ratings (stuttering severity, frequency, and physical
concomitants) ». La formulation « effects of time » est techniquement honnête, mais aucun lecteur
d'abstract ne comprendra que ces « significant improvements » objectives proviennent d'une analyse
**sans groupe témoin**, alors que les mêmes mesures objectives sont **strictement nulles** au seul
moment où un témoin existait. L'abstract ne mentionne à aucun endroit que les critères secondaires
étaient tous négatifs à 3 mois — information pourtant écrite noir sur blanc p. 24.

### G6 — Modérée à grave. Tests unilatéraux, correction de multiplicité partielle, puissance mal étiquetée

- **Unilatéral partout** (p. 13, notes des Tables 2 et 4). En repassant en bilatéral (ma dérivation,
  §1.4), le critère principal tombe à p ≈ .052 après Holm : **non significatif**. L'hypothèse H1 était
  bien directionnelle et pré-enregistrée (p. 6), ce qui est l'argument défendable ; il reste qu'un
  résultat principal qui bascule selon la latéralité du test, à un essai unique, ne supporte aucune
  affirmation forte.
- **Correction par instrument, pas sur la famille entière.** La Table 2 comporte **11 comparaisons** ;
  Holm est appliqué séparément sur 5 (OASES-S), 2 (parents) et 4 (SSI-4) — note p. 19 : « corrected for
  the number of comparisons **per test instrument** ». Le risque d'erreur de type I sur l'ensemble de la
  batterie n'est donc pas contrôlé. Atténuation honnête : le critère **principal** était pré-spécifié,
  donc cette objection porte sur les secondaires, qui sont de toute façon tous négatifs. Elle ne change
  pas la conclusion.
- **f = 0.2 qualifié de « medium effect »** (p. 12) : faux au sens de Cohen (moyen = 0.25). Erreur
  d'étiquetage sans conséquence directe sur le calcul, mais elle signale une relecture statistique
  imparfaite. Par ailleurs la cible de 75 enfants n'est pas atteinte (73), et l'effet réellement observé
  sur l'OASES-S (≈ 0.26 point) fait **la moitié** de la réduction de 0.5 point qui fondait le calcul.

### G7 — Modérée. La comparaison est « traitement vs rien », dans un pays où KIDS est déjà le standard

Les auteurs sont transparents sur ce choix : « **Because of the prevalent use of KIDS in Germany, we
opted against a superiority study** and implemented a wait-list control group for the first 3 months »
(p. 6). Le contexte est documenté : une enquête nationale (72 cliniciens répondants) montre un usage
dominant de la modification du bégaiement, et « **89 % of the clinicians reported providing … KIDS** »
pour les enfants d'âge scolaire (p. 5) — enquête signée de la première auteure (Kohmäscher, 2019).

Conséquence : l'essai peut au mieux établir que KIDS fait mieux que ne rien faire pendant trois mois sur
un auto-rapport. Il **n'établit rien** face au fluency shaping, à la thérapie de groupe intensive, ou à
toute autre approche. Les comparaisons avec Laiho & Klippi (2007) et Euler et al. (2021) aux p. 25-26
sont des **comparaisons indirectes, non appariées, entre études**, sur des populations de sévérités
initiales différentes (fréquence initiale 9.4 % en fluency shaping vs 4.8 % ici, p. 26) et des intensités
sans commune mesure (35,5 à 52,5 h sur 2-3 semaines dans l'essai finlandais vs 26 séances de 45 min sur
39 semaines ici, p. 26). La conclusion tirée p. 26 — « it seems that individual extended stuttering
modification therapy with KIDS results in **outcomes comparable to** those of intensive group treatment »
— est une allégation d'équivalence fondée sur une comparaison inter-études non ajustée. Ce n'est pas une
preuve d'équivalence.

Le choix de la liste d'attente est aussi ce qui interdit toute lecture au-delà de 3 mois (cf. G3) : le
design a été optimisé pour l'éthique et l'acceptabilité, au prix de la capacité à conclure.

### G8 — Modérée. Le COVID traverse l'essai et dégrade précisément les mesures objectives

Inclusions de décembre 2018 à juin 2021 (p. 14) : la pandémie coupe l'essai en deux. Les auteurs la
qualifient eux-mêmes de « **major limitation** » (p. 28). Concrètement :

- traitements **interrompus « for at least several weeks »**, bascule en visio par des cliniciens « **without
  having prior experience** » (p. 28) ;
- **47 % des cas** mêlent visio et présentiel, avec une part de visio allant jusqu'à **67 %** chez certains
  enfants (p. 16-17) — hétérogénéité de l'intervention non prise en compte dans l'analyse, aucune
  analyse en sous-groupe selon la part de visio n'est rapportée ;
- les **évaluations elles-mêmes** basculent en visio (p. 12). Or les auteurs admettent p. 28 que « the
  judgment of physical concomitants **is error-prone due to movements of the extremities that are not
  visible on the video** ». La modalité d'évaluation change donc au milieu de l'essai, et dégrade
  spécifiquement une composante du SSI-4 — laquelle est ensuite déclarée significative à 12 mois
  (η² = .048, petit) ;
- le contexte lui-même modifie l'exposition : « many challenging speaking situations, such as in school
  or sports, **fell away** during lockdowns or home schooling » (p. 28). Un enfant moins exposé aux
  situations difficiles rapportera mécaniquement un moindre impact du bégaiement — confusion directe
  avec le critère principal ;
- aucune analyse de sensibilité pré/post-COVID n'est présentée, alors que la date d'inclusion permettrait
  de la faire.

Enfin, la datation « first COVID-19 lockdown in **March 2021** » (p. 12) est erronée ou au minimum
équivoque (premier confinement allemand : mars 2020). Détail, mais c'est la date d'une rupture
méthodologique majeure.

### G9 — Modérée. Validité externe faible pour une patientèle de MSP française

- **Sévérité** : SSI-4 initial 19 et 16, tous deux catégorisés « **mild** » (Table 1, p. 15). La durée
  moyenne des trois plus longs blocages est de **1,41 s contre une norme SSI-4 de 6,4 ± 3,2 s** (p. 25),
  soit un échantillon très en deçà de la plage normative de l'instrument. Les auteurs invoquent
  eux-mêmes un possible **effet plancher** (p. 25). Population **légère** : les résultats ne disent rien
  des bégaiements sévères, qui sont ceux qui motivent le plus souvent une consultation.
- **Critère d'inclusion asymétrique** : l'inclusion exigeait « at least a mild-to-moderate **impact**,
  measured by the OASES-S » (p. 8) — un seuil sur le **critère principal lui-même**, sans aucun seuil de
  sévérité objective. On sélectionne donc des enfants ayant de la marge de baisse sur la variable qui
  servira de résultat principal, ce qui alimente la régression vers la moyenne (cf. G2).
- **Exclusions larges** : tout trouble neurologique, linguistique, émotionnel ou comportemental associé
  est exclu (p. 8), et les auteurs le reconnaissent : « the results **cannot be generalized** to children
  with speech-language, neurological, emotional, or behavioral impairments that require treatment »
  (p. 27). En pratique de ville, la comorbidité est la règle.
- **Contexte de soins** : Allemagne, traitement libéral remboursé par l'assurance maladie (p. 5),
  **manuel en allemand**, cliniciens tous formés à KIDS (p. 8), OASES-S en version allemande validée.
  KIDS n'est pas la pratique standard en France ; la transposition suppose une méthode, un manuel et une
  formation qui n'existent pas dans le même état ici.
- **Bilinguisme** : 39 % / 28 % (Table 1), présenté comme représentatif de la population allemande
  (p. 27) — mais les auteurs notent p. 29 que certains items de l'OASES-S « **are difficult to understand
  if children are less competent in the German language** ». Le critère principal est donc partiellement
  mal mesuré chez un tiers de l'échantillon.
- **Pertinence pour le MG** : nulle en acte. Un médecin généraliste ne délivre pas KIDS. Au mieux, cet
  article informe une décision d'adressage — laquelle ne dépend pas de cet essai.

### G10 — Mineure mais gênante. Incohérences de détail non résolues

- **Table 2, ligne « Parents — sévérité subjective »** : t = 0.461 (positif) mais d = **−0.118**
  (négatif), tandis que la ligne « durée » présente un t négatif (−0.596) avec un d négatif (−0.152),
  cohérent. La discordance de signe entre t et d sur la ligne parentale n'est pas expliquée. Sans
  conséquence (la comparaison est de toute façon NS), mais c'est une incohérence de tableau.
- **Échantillons de lecture** : « reading samples were scarce, **were only analyzed descriptively**, and
  **were used for the calculation of the total SSI-4 score** » (p. 17). Les deux propositions se
  contredisent partiellement, et surtout : si la composante lecture est présente chez certains enfants et
  absente chez d'autres, le **score total SSI-4 n'a pas la même composition d'un enfant à l'autre**, ce
  qui affaiblit la mesure objective principale. Aucune analyse de sensibilité sur ce point.
- **Ajout d'un critère après le protocole** : « The parental rating on satisfaction with communication
  **was added to the study protocol later**, but before the first data collection » (p. 11). Honnêtement
  déclaré, et antérieur à la collecte — pas un problème réel, mais à noter pour la traçabilité.
- **Fidélité de l'intervention** : les cliniciens pouvaient « change the order of the treatment phases
  and **omit phases, such as modification** » (p. 10). La phase *modification* est le cœur technique de
  l'approche Van Riper. Une intervention dont on peut retirer le composant central n'est pas une
  intervention unique ; les auteurs reconnaissent p. 27 « we do not have insight and cannot determine if
  individual decisions during treatment courses were reasonable, effective, and efficient ». Aucune
  donnée n'est rapportée sur la proportion d'enfants ayant reçu chaque phase.
- **Données non partageables** (p. 29) : aucune réanalyse indépendante possible.

---

## 3. Ce qui tient malgré tout

Cette section est écrite sans complaisance mais sans mauvaise foi. Plusieurs éléments sont solides, et
certains sont même meilleurs que la moyenne de la littérature en orthophonie.

1. **C'est un vrai essai randomisé, enregistré prospectivement.** DRKS00015851, enregistré le
   **7 novembre 2018**, première inclusion en **décembre 2018** (p. 7 et 14). L'enregistrement précède
   bien le recrutement. Protocole et checklist CONSORT (extension essais pragmatiques) déposés en
   matériel supplémentaire S3/S4. Approbation par deux comités d'éthique. Conformité déclarée à l'ICH
   E6(R2). C'est propre.

2. **Le critère principal n'a pas été changé en cours de route.** L'hypothèse H1 pré-spécifiée p. 6
   énonce que « **only** the impact of stuttering (OASES-S) would be significantly reduced » à 3 mois.
   Les auteurs avaient donc **prédit à l'avance que les critères objectifs seraient négatifs à 3 mois**,
   et c'est exactement ce qui est observé. Il n'y a **pas** de bascule opportuniste du critère principal,
   pas d'analyse post-hoc promue en principale, pas d'arrêt précoce. La discordance subjectif/objectif
   que je pointe en G1 est, du point de vue des auteurs, une prédiction vérifiée et non un échec caché.
   C'est un argument sérieux qu'il faut porter honnêtement au dossier — il ne neutralise pas l'objection
   de non-aveuglement, mais il écarte l'accusation de p-hacking.

3. **La correction de multiplicité est réellement appliquée et vérifiable.** J'ai recalculé Holm sur les
   5 comparaisons OASES-S : .003 / .014 / .026 correspondent exactement aux valeurs de la Table 2. La
   procédure est même explicitée en note de bas de page (p. 29-30). Beaucoup d'essais de cette taille ne
   corrigent rien du tout.

4. **Calcul de puissance a priori présent, transparent, et effectif atteint pour le critère principal.**
   G*Power, α = .05, puissance .80, N = 52 requis, 62 analysés à 3 mois (p. 12). L'anticipation d'une
   attrition de 30 % était lucide et s'est révélée pessimiste (15 % à 3 mois).

5. **L'aveuglement des évaluateurs sur les mesures objectives est bien fait, et la fiabilité est
   excellente.** Aveugle au bras **et au temps de mesure** (p. 9) — c'est plus exigeant que l'usage.
   Krippendorff α de .889 à .969 en inter-juges et .876 à .942 en intra-juge (p. 17). Les mesures
   objectives sont donc **crédibles**, ce qui donne du poids à leur négativité plutôt que de l'excuser.

6. **Randomisation méthodologiquement correcte.** Stratification sur l'âge (< 9 / ≥ 9 ans) et le sexe,
   randomisation par blocs, séquence générée à l'avance par le dernier auteur, allocation révélée après
   consentement écrit (p. 9). Les groupes sont effectivement comparables sur l'essentiel (Table 1 :
   tous les p entre .086 et .879, une seule exception sur une sous-échelle).

7. **Il comble un vide réel.** Brignell et al. (2021) « **did not identify any randomized controlled
   trial for this age group** » (p. 4). Cet essai est, à ma connaissance de la source, le premier ECR de
   traitement du bégaiement chez l'enfant d'âge scolaire. Sa valeur est celle d'un premier jalon, et un
   premier jalon négatif sur les critères objectifs est une information utile.

8. **Plusieurs limites sont honnêtement déclarées** : COVID comme « major limitation », absence de suivi
   après la fin du traitement, perte de données extra-cliniques, effet plancher sur la durée, faillibilité
   du jugement des concomitants physiques en visio, non-généralisabilité aux enfants avec comorbidités
   (p. 26-29). Les auteurs ne cachent pas tout — ils omettent précisément les deux limites structurelles
   (non-aveuglement du critère principal, absence de comparateur à 12 mois).

9. **La conduite pragmatique est un atout de validité écologique** : 34 centres, 26 cliniciens
   d'expérience hétérogène, formation d'une journée au manuel, documentation standardisée après chaque
   séance, deux supervisions de groupe (p. 8-10). C'est de la vraie vie, pas un centre expert unique.

---

## 4. Verdict

### 4.1 Grille — synthèse

| Rubrique | Appréciation |
|---|---|
| Type | ECR multicentrique, liste d'attente, ouvert, phase contrôlée limitée à 3 mois |
| Registre | ✅ DRKS00015851, prospectif |
| Randomisation | ✅ adéquate (stratifiée, blocs, séquence préétablie) |
| Aveugle | ❌ essai ouvert ; critère principal auto-rapporté non aveuglable. ✅ évaluateurs aveugles pour les seules mesures objectives — toutes négatives à 3 mois |
| Données de sortie | ❌ ITT annoncée mais non réalisée (33/37 et 29/36 analysés) ; attrition asymétrique 11 % vs 28 % ; LOCF favorable à l'hypothèse de maintien ; aucun profil des sortants |
| Sélection du résultat | ✅ critère principal conforme à H1 pré-spécifiée |
| Arrêt précoce | ✅ non |
| Critère principal | **Auto-rapport subjectif** (OASES-S), pertinent pour le patient en principe, mais porté ici par une sous-échelle de **connaissances** |
| Critère dur / substitution | Ni l'un ni l'autre au sens classique : critère centré patient, non aveuglable |
| Taille d'effet contrôlée | d = 0.624 sur le seul OASES-S total ; **d = 0.08 à 0.10 sur toutes les mesures objectives** |
| Précision | ❌ IC95 % **non rapportés** dans la Table 2 (une colonne « CI » est annoncée en note mais absente du rendu) ; p unilatéraux |
| Cohérence interne | ❌ discordance majeure subjectif/objectif au seul point contrôlé |
| Spin | ❌ détecté (transfert extra-clinique, abstract, « can be expected » en conclusion) |
| Financement / COI | ❌ **aucune déclaration dans le document** ; conflit intellectuel manifeste (1re auteure co-auteure du manuel évalué et traductrice de l'outil de mesure) |
| Validité externe MSP France | ❌ faible (méthode allemande, population légère, comorbidités exclues, MG non acteur) |

### 4.2 Décision

- **`niveau_preuve` : faible.**
  Point de départ ECR = élevé. Déclassements : **−1 risque de biais** (essai ouvert avec critère
  principal auto-rapporté, ITT non réalisée, attrition asymétrique et informative, LOCF) ; **−1
  imprécision** (un seul essai, 62 analysés au point contrôlé, effet moitié moindre que celui postulé,
  significativité qui dépend de la latéralité du test, IC absents) ; **−1 caractère indirect** (le seul
  résultat positif porte sur une sous-échelle de connaissances ; les données à 6-12 mois n'ont pas de
  comparateur et ne relèvent plus du niveau ECR). Soit **faible**, et **très faible** pour toute
  affirmation portant sur les 6-12 mois ou sur les critères objectifs.

- **`niveau_impact` : informatif.**
  Aucun geste de soins premiers n'est modifié. N'impacte aucun nœud d'algorithme du projet.

- **Classement : `breve`.**

**Motif.** Le dossier ne peut pas être publié en `analyse` dans la configuration prévue. Trois raisons
cumulatives :

1. **Le contenu de l'analyse serait presque entièrement une réfutation du message de l'article.** Le
   résultat principal est positif là où l'aveugle est impossible et nul, avec des tailles d'effet
   négligeables (d = 0.08 à 0.10), partout où l'aveugle a été correctement réalisé. Défendre cette
   lecture publiquement engage la crédibilité du projet sur un terrain technique.
2. **`relecture_referent: false` et aucun orthophoniste dans la boucle.** Or les points les plus
   discriminants sont **spécifiques au domaine** : que vaut réellement un gain de 1,16 point de
   pourcentage de syllabes bégayées ? La sous-échelle *General Information* de l'OASES-S est-elle
   effectivement une mesure de connaissances, comme sa dénomination et l'interprétation des auteurs
   p. 24 le suggèrent ? Un score SSI-4 de 19 « mild » avec des blocages de 1,41 s décrit-il une
   population typique de consultation ? Ce sont des questions auxquelles un médecin généraliste ne peut
   pas répondre, et sur lesquelles je ne peux moi-même me prononcer qu'à partir du texte. Publier une
   analyse critique en orthophonie sans orthophoniste relecteur contrevient à l'invariant 6 du projet
   (« en cas de doute clinique, signaler plutôt qu'inventer »).
3. **L'impact pratique pour la MSP est nul.** Aucune profession de la structure ne délivre KIDS, méthode
   allemande avec manuel et formation dédiés. Le coût de production d'une analyse complète n'est pas
   justifié par ce qu'elle changerait.

**Contenu de la brève que je défendrais** (3-4 lignes, factuel, sans conclusion clinique) :

> Premier ECR de traitement du bégaiement chez l'enfant d'âge scolaire (KIDS, Allemagne, 73 enfants,
> liste d'attente, essai ouvert). À 3 mois, seule comparaison contrôlée : le critère principal
> auto-rapporté par l'enfant s'améliore (OASES-S, d = 0.62, p corrigé = .026), porté surtout par la
> sous-échelle *connaissances sur le bégaiement* (d = 0.86) ; **aucune** des mesures objectives de
> sévérité, évaluées en aveugle, ne diffère entre les groupes (SSI-4 total d = 0.09 ; fréquence d = 0.08 ;
> concomitants d = 0.10 ; toutes NS). Les améliorations objectives rapportées à 6 et 12 mois proviennent
> d'une analyse avant/après **sans groupe témoin**, les deux bras ayant été traités. Niveau de preuve
> faible ; intérêt documentaire pour l'adressage en orthophonie, sans conséquence sur la pratique en
> soins premiers.

**Si le comité tranchait malgré tout pour `analyse`**, deux conditions non négociables de mon point de
vue : (a) **relecture par un orthophoniste** avant publication ; (b) le message pour la pratique doit
être bâti sur la discordance, pas sur l'effet. Formulation que je défendrais :

> Ce qu'établit cet essai : chez des enfants de 7-11 ans qui bégaient **légèrement**, trois mois de
> thérapie de modification du bégaiement améliorent **ce que l'enfant dit ressentir** de son trouble
> — et surtout ce qu'il en sait — davantage que trois mois d'attente. Ce que l'essai **n'établit pas** :
> que le bégaiement lui-même diminue. Au même moment, sur les mêmes enfants, avec des mesures
> objectives aveuglées et fiables, il n'y a **aucune** différence entre traités et non traités
> (d ≤ 0.10). Les gains objectifs annoncés à 12 mois reposent sur une comparaison de chaque enfant à
> lui-même, sans témoin, et ne permettent pas d'écarter l'évolution naturelle. Pour le MG : cela ne
> change pas l'indication d'adresser un enfant qui bégaie à un orthophoniste ; cela invite en revanche à
> ne promettre aux parents ni disparition du bégaiement, ni bénéfice mesurable à court terme sur la
> parole — le premier bénéfice documenté porte sur le vécu et la compréhension du trouble.

### 4.3 Points à trancher par l'agent C

1. **Ma dérivation du bilatéral** (p ≈ .052 pour le critère principal après Holm) est un calcul
   personnel par doublement des p unilatéraux, non un chiffre de l'article. À valider ou écarter.
2. **Le déséquilibre initial sur la sous-échelle Quality of Life** est affirmé p. 15 mais **son p n'est
   pas rapporté**. Ma lecture (régression vers la moyenne sur une des deux sous-échelles porteuses) est
   plausible mais invérifiable dans la source.
3. **Absence de section financement/COI** : je constate qu'elle n'existe pas dans le PDF fourni (rendu
   HTML ASHAWire). Il est possible qu'elle figure dans la version PDF éditeur. Le conflit intellectuel
   (Kohmäscher co-auteure du manuel KIDS évalué, référence p. 35) est en revanche établi par la
   bibliographie de l'article lui-même.
4. **Matériel supplémentaire S1 et S2 non consulté** (Figshare, doi 10.23641/asha.24207864) : il contient
   les statistiques descriptives complètes et les comparaisons appariées détaillées. Plusieurs de mes
   points sur les trajectoires y trouveraient confirmation ou infirmation.
