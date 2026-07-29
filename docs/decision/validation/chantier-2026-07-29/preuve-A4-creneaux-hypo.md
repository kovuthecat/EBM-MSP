# Preuve A4 — L'heure d'une hypoglycémie guide-t-elle *quel* composant du schéma insulinique ajuster ?

> **Nature** : collecte **agent A** (extraction / chiffrage), chantier « Passe A — insuline sans capteur ».
> Éclaire la vignette **V-A9** et l'exigence **E7** de
> [`vignettes-insuline-sans-capteur.md`](vignettes-insuline-sans-capteur.md) (design des 4 créneaux),
> ainsi que le volet (c) du prompt [`OE-A4`](PROMPTS-OE-passeA.md).
>
> **Statut : NON red-teamé.** Tout ce qui suit est une extraction agent A. Aucun élément n'entre dans
> `content/**` avant la passe adversariale (agent B) prévue par `CONSTRUIRE-UN-MODULE.md` §P4.
>
> **Garde-fou P4 (rappel opposable)** : *trois collectes sur quatre ont accusé le nœud à tort le
> 2026-07-27.* Ce document **n'accuse pas** `insuline.yaml`. Sa conclusion est au contraire que la table
> de lecture actuelle du nœud (option 4a : « hypo nocturne → ↓ basale ») est **bien classée** par le
> dossier de preuve (`niveau_preuve: faible-modéré`, `E-insuline.md` §2) et que la collecte **ne permet
> pas de la remonter**, pas qu'elle serait fausse. Là où j'émets une hypothèse, elle est écrite comme
> telle avec sa citation.
>
> **Ne modifie aucun fichier sous `content/`, `src/`, `schema/`, ni `E-insuline.md`.**
>
> Auteur : agent A · date : 2026-07-29 · version 0.1

---

## §1. Question

Chez l'adulte **DT2 traité par insuline**, l'**heure de survenue d'une hypoglycémie** est-elle établie
comme un guide de **quel composant du schéma ajuster** (la basale, ou tel bolus précis) ?

Le référent propose un analogue capillaire du profil AGP : découper le nycthémère en **quatre créneaux
fixes** — nuit 0-6 h · matinée 6-12 h · après-midi 12-18 h · soir 18-24 h. La question posée à la preuve
n'est pas « est-ce raisonnable » (ça l'est) mais : **est-ce documenté, ou est-ce un raisonnement
physiopathologique ?** Les deux réponses sont recevables ; elles ne donnent pas au nœud le même droit
d'affirmer.

**PICO de la collecte**
- **P** : adulte DT2 sous insuline (basale seule, basal-plus, basal-bolus), avec ou sans capteur.
- **I** : ajuster un composant du schéma **d'après l'heure** de survenue de l'hypoglycémie.
- **C** : ajuster sans tenir compte de l'heure (règle globale : « hypo → réduire la basale ») ;
  ajuster d'après un repère **ancré sur les repas** plutôt que sur l'horloge.
- **O** : **DUR** = hypoglycémie sévère, événements CV, mortalité. **SUBSTITUTION** = HbA1c, TIR/TBR,
  taux d'hypoglycémie symptomatique déclarée, glycémie à jeun. **Aucun essai identifié n'a randomisé
  cette question** (cf. §3 et §7) : il n'y a donc **pas de corps de preuve d'intervention** à grader.

---

## §2. Sources locales (`docs/decision/sources/`) — vérifiées avant toute recherche web

Conformément à `00-global.md` §« Sources locales déjà disponibles ». Les 14 PDF du dossier ont été
convertis en texte et interrogés (`pdftotext`, sondes jetables supprimées).

| Fichier | Utile ici ? | Ce qu'il apporte / n'apporte pas |
| --- | --- | --- |
| `Insulinothérapie dans le diabète de type 2 _ ebmfrance.pdf` | **Oui, décisif** | Algorithme de titration **et de descente** sur la seule **glycémie à jeun** ; **0 occurrence du mot « nocturne »** dans toute la fiche (vérifié). Cf. §6. |
| `mmm_referentielmcg_ep11.pdf` (**SFD 2017, Mesure Continue du Glucose**) | **Oui, la seule source qui énonce la logique** | §8.6.2 et §8.6.3 : attribution horaire → composant, **immédiatement assortie de son contre-exemple**. Cf. §3 et §6. ⚠ **Ce n'est PAS le Collège de la Médecine Générale** (erreur d'étiquetage relevée au nœud D) : c'est un hors-série *Méd. Mal. Métab.*, position d'experts, à dominante **DT1/pompe**. |
| `pdp_pompe_insuline_externe_mcg.pdf` (SFD Paramédical 2022) | Oui, ponctuel | Constate que « la **période nocturne** [est] **définie selon des critères propres à chaque étude** » — c'est-à-dire, du côté français, l'aveu explicite que les fenêtres divergent. Cf. §4. |
| `strategie_therapeutique…recommandations.pdf` (HAS 2024) | Oui | R.82 / R.85 (grade **AE**) : le raisonnement est **ancré sur les repas** (à jeun vs post-prandial) et porte sur l'**hyper**glycémie. **1 seule** occurrence de « nocturne », et c'est un critère de **choix de molécule**. Cf. §6. |
| `SFD 2025.pdf` | Oui | Avis 23 (ASG) : ASG « indispensable » sous insuline, **sans prescrire les moments** ; sujet âgé : cibles **préprandiales** 1-2 g/L ; EHPAD : surtraitement et hypoglycémies « notamment la nuit ». **2** occurrences de « nocturne », aucune n'est une règle d'attribution. Cf. §6. |
| `prescrire-dt2.md` | Non | Rien sur l'heure des hypoglycémies. P1=P4 / P3 mentionnent l'hypoglycémie comme effet indésirable des insulines, sans chronologie. |
| `Traitement global et suivi du diabète de type 2 _ ebmfrance.pdf` | Non | Les 2 occurrences de « nocturne » concernent l'excrétion urinaire d'albumine. |
| `NICE 2023.pdf` | **Non — attention** | Ce fichier est **NG238 (risque CV / lipides)**, pas une reco diabète. **0 occurrence de « insulin ».** Il ne peut pas servir ici (ni être cité comme « NICE diabète »). |
| Autres (`rapport_gtg_glucides_sfd`, `guide HAS parcours surpoids-obésité`, `HAS activité physique`, `manger bouger`, `10 petites astuces`, `4DDK001…`, `statin-intolerance-pathway`) | Non | Hors sujet. |

**Conclusion §2** : le corpus local contient **une** source qui énonce la logique d'attribution
(SFD 2017 MCG) et **une** qui l'applique sans jamais nommer l'heure (ebmfrance). Le reste du travail
demandait la littérature primaire.

---

## §3. La logique d'attribution : ce qui est **donnée**, ce qui est **raisonnement**

Une ligne par source. La colonne « nature » est le cœur de la commande.

| Source (réf. vérifiée) | Ce qu'elle dit exactement | **Donnée ou raisonnement ?** |
| --- | --- | --- |
| **ADA Standards of Care 2026, ch. 9** — *Pharmacologic Approaches to Glycemic Treatment*, *Diabetes Care* 2026 · **PMID 41358900** · PMC12690185 | « *The principal action of basal insulin is to restrain hepatic glucose production and limit hyperglycemia **overnight and between meals**.* » Et : « *If basal insulin has been titrated to an acceptable fasting blood glucose level and A1C remains above goal… advancement to combination injectable therapy is necessary.* » | **RAISONNEMENT PHYSIOLOGIQUE, énoncé comme tel.** C'est un énoncé de **mécanisme d'action** (nuit + inter-prandial = domaine de la basale), pas un résultat d'essai. **Aucune** règle « hypo à telle heure → tel composant » dans le chapitre. |
| **ADA SOC 2026, ch. 9** — repère de sur-basalisation (reco n° **9.26**, grade **E** = *expert consensus* `[À VÉRIFIER]` sur la numérotation) | Signaux de sur-basalisation : « *high **bedtime-to-morning** or **postprandial-to-preprandial** glucose differential (e.g., bedtime-to-morning glucose differential ≥50 mg/dL), hypoglycemia (aware or unaware), and high glucose variability* » | **RAISONNEMENT** (grade E). ⚠ **Point de design majeur** : le seul repère horaire de l'ADA est **un écart entre deux moments ancrés sur le coucher et le lever**, pas un créneau de 6 h. |
| **ADA SOC 2026, ch. 6** — *Glycemic Goals, Hypoglycemia…* · **PMID 41358894** · PMC12690178 | Lecture intégrale : **aucune** définition horaire de l'hypoglycémie nocturne, **aucune** règle liant l'heure d'un épisode à un composant. TBR/TAR y sont « *useful parameters for insulin dose adjustments* », sans stratification temporelle. | **RIEN** — absence documentée (résultat négatif utile). |
| **Battelino 2019** — consensus international TIR, *Diabetes Care* 2019;42(8):1593-1603 · **PMID 31177185** · PMC6973648 | « *Time blocks (24-h, day, night)* » figure comme métrique de base, **sans aucune heure d'horloge**, sans cible stratifiée par moment de la journée, et **sans règle d'attribution**. | **RIEN.** Le consensus qui fonde les cibles MCG du nœud **ne fixe pas de fenêtre horaire**. |
| **SFD 2017, référentiel MCG** §8.6.2 (source locale) | « *…le phénomène de l'aube et l'hypoglycémie nocturne, **très mal évalués et difficiles à différencier par une glycémie capillaire au coucher et au lever**. Il est alors plus facile de **modifier l'insulinothérapie basale** en conséquence…* » | **RAISONNEMENT** (position d'experts). Énonce l'attribution « nuit → basale » **et**, dans la même phrase, que le **capillaire** ne sait pas trancher nuit basse vs aube haute. |
| **SFD 2017, référentiel MCG** §8.6.3 (source locale) ⚠ **contre-exemple** | « *En cas d'**hypoglycémie de fin de matinée, d'après-midi, de fin de soirée ou de début de nuit**, il convient de se poser la question d'un **bolus prandial trop fort ou trop tardif**… De la même façon, **la période (0-4 heures) peut être influencée par le bolus prandial du soir**, surtout lorsque les repas sont pris tardivement (après 20 heures). Il convient dans ce cas d'**avancer ou de réduire le bolus prandial plutôt que de baisser le débit basal**.* » | **RAISONNEMENT**, et **le seul texte trouvé qui donne la table d'attribution complète**. ⚠ Il **contredit frontalement** le mapping simple « nuit 0-6 h → basale » : **la première moitié de la nuit peut accuser le bolus du soir.** Validité externe : contexte **DT1 / pompe**, extrapolation au DT2 en MG **non testée**. |
| **Bergenstal 2008** — *Adjust to Target in Type 2 Diabetes*, *Diabetes Care* 2008;31(7):1305-10 · **PMID 18364392** · PMC2453649 · DOI 10.2337/dc07-2137 | ECR ouvert multicentrique, **n=273** DT2 sous ≥2 injections/j, **24 semaines**. « *Glulisine dose adjustment for both groups was based on **prelunch/dinner and bedtime** (these three time points are referred to as mealtime) blood glucose patterns from the previous week* » ; la glargine, elle, « *titrated weekly according to the mean of the last 3 days of **fasting** SMBG* ». | **DONNÉE PARTIELLE — le plus proche qu'on ait.** C'est un essai qui **instrumente** l'attribution (jeûne → basale ; les 3 relevés post-créneau → bolus), mais : (a) il **ne publie pas** la correspondance un-pour-un « quel relevé ajuste quel repas » — le texte des méthodes reste au niveau du **groupe** de 3 points ; (b) les **deux bras** utilisaient l'attribution : elle n'est **pas** la variable randomisée. **On ne peut donc pas dire que l'essai la valide.** |
| **Treat-to-Target / Riddle 2003** — *Diabetes Care* 2003;26(11):3080-6 · **PMID 14578243** | Titration de la basale du coucher sur la **seule glycémie à jeun** (cible ≤ 100 mg/dL) ; critère principal composite = HbA1c ≤ 7 % **sans hypoglycémie nocturne documentée** (≤ 72 mg/dL) : **33,2 % vs 26,7 %** (glargine vs NPH, p < 0,05, **24 semaines** — **SUBSTITUT**). | **DONNÉE** sur l'efficacité de la titration à jeun ; **RAISONNEMENT** pour l'attribution : l'essai *présuppose* « jeûne = basale » et n'en teste pas l'alternative. **La définition d'horloge de « nocturne » n'est pas dans l'abstract → `[À VÉRIFIER]`** (texte intégral inaccessible, HTTP 403 sur `diabetesjournals.org`). |
| **ebmfrance — « Insulinothérapie dans le DT2 »** (source locale) | Sous basale seule : « *L'autosurveillance de la glycémie (**uniquement la glycémie à jeun** en cas d'utilisation d'insuline basale)…* » · descente : « *si la glycémie à jeun est inférieure à 4,0 mmol/l — 1 fois sur 3 : pas de modification ; plus fréquemment : **réduire la dose de 2 unités*** » · « *Si le patient fait des **hypoglycémies symptomatiques, réduire la dose de 4 unités**.* » | **RAISONNEMENT appliqué, sans aucune horloge.** ⚠ **Corrobore la lecture du référent en V-A9** : sous **basale seule**, la source de référence du nœud attribue **toute** hypoglycémie symptomatique à la basale, **quelle que soit l'heure**. Le créneau n'y sert à rien pour décider. |
| **HAS 2024, R.85** (grade **AE**) | « *les profils glycémiques : y a-t-il une **hyperglycémie à jeun** ? Est-elle isolée ou associée à une ou plusieurs **hyperglycémies postprandiales** ?* » | **RAISONNEMENT** (accord d'experts), **ancré sur les repas**, et **sur l'hyper**, pas sur l'hypo. |

**Recherche d'un essai qui aurait *testé* l'attribution** : aucune stratégie « ajustement guidé par
l'heure de l'hypoglycémie » n'a été retrouvée comme **bras randomisé** (recherches Europe PMC et PubMed
sur les essais de titration basale/prandiale et sur les protocoles cités par le nœud). **Corps de preuve
d'intervention : inexistant → GRADE non applicable** (on ne grade pas une absence). Ce qui existe,
gradable, c'est l'**épidémiologie horaire** (§4), qui est une autre question.

---

## §4. Épidémiologie horaire de l'hypoglycémie en DT2 insuliné

### 4.1 Les chiffres (effet absolu / proportions + horizon)

| Étude (réf.) | Design / population | Horizon | Résultats — **absolu** | Dur / substitut | GRADE |
| --- | --- | --- | --- | --- | --- |
| ★ **HAT global** — Khunti K et al., *Diabetes Obes Metab* 2016;18(9):907-15 · **PMID 27161418** · PMC5031206 · DOI 10.1111/dom.12689 | Observationnelle non interventionnelle, **auto-questionnaire + carnet**, 27 585 patients (**DT2 n = 19 563**), 2004 sites, 24 pays | **6 mois rétrospectifs + 4 semaines prospectives** | **DT2, période prospective** : **46,5 %** (8580 ; IC95 45,8-47,2) ≥ 1 épisode ; **toute hypo 19,3 év./patient-an** (19,1-19,6) ; **nocturne : 15,9 % des patients** (2800 ; IC95 15,4-16,5) et **3,7 év./patient-an** (3,6-3,8) ; **sévère : 8,9 % des patients** (1635) et 2,5 év./patient-an. **HbA1c n'est PAS un prédicteur significatif.** | Hypo **sévère = DUR** ; hypo non sévère **auto-déclarée = SUBSTITUT** (et mesure déclarative) | **faible** pour la répartition horaire : déclaratif, biais de rappel **et de détection** (un épisode nocturne non ressenti n'est pas déclaré), financement/auteurs **Novo Nordisk** |
| **Munshi MN et al.**, *Arch Intern Med* 2011;171(4):362-4 · **PMID 21357814** · PMC4123960 | **MCG aveugle 3 jours**, n = **40**, ≥ 69 ans, HbA1c ≥ 8 % (moyenne 9,3 %), **70 % DT2**, **93 % sous insuline** | 3 jours | **65 %** (26/40) ≥ 1 épisode < 70 mg/dL ; **69 % de ceux-ci (18/26) ≥ 1 épisode nocturne** ; ★ **95 des 102 épisodes (93 %) non reconnus** par **4 glycémies capillaires/jour** ni par les symptômes | **SUBSTITUT** (glycémie interstitielle) | **faible** (n = 40, monocentrique, population sélectionnée) — mais **directement pertinent pour V-A5** |
| **Gehlaut RR et al.**, *J Diabetes Sci Technol* 2015;9(5):999-1005 · **PMID 25917335** · PMC4667336 | MCG (iPro) **5 jours**, n = **108** DT2, **69,8 % sous insuline**, 81 % sous un médicament hypoglycémiant | 5 jours | **49,1 %** (53/108) ≥ 1 épisode ; 1,74 ± 2,54 épisodes/patient/5 j ; **75 % des patients concernés ont eu des épisodes asymptomatiques** ; ★ **pas de différence jour/nuit : 1,78 vs 1,81 épisode/personne, p = 0,95** | **SUBSTITUT** | **faible** (observationnel, n modeste) |
| **Zick R et al. (SAFIR)**, *Diabetes Technol Ther* 2007;9(6):483-92 · **PMID 18034602** | Multicentrique ouvert bras unique, **n = 367** DT2 **sous multi-injections**, CGMS 72 h | 72 h, après 8 sem. de glargine | ★ **209 patients (56,9 %) hypo au CGMS vs 97 (26,4 %) par les méthodes conventionnelles** ; glycémies **nocturnes significativement plus basses au CGMS qu'à l'ASG** (123,3 vs 137,3 mg/dL en fin d'étude) | **SUBSTITUT** | **faible-modéré** (n important, mais bras unique, financement industriel) |
| **UK Hypoglycaemia Study Group**, *Diabetologia* 2007;50(6):1140-7 · **PMID 17415551** | Observationnelle 9-12 mois, 6 centres UK, **n = 383** ; DT2 : sulfamide / insuline < 2 ans / insuline > 5 ans | 9-12 mois | DT2 insuline < 2 ans : **hypo légère 4 épisodes/sujet-an** (vs 36 en DT1 < 5 ans, p < 0,001) ; **hypo sévère 0,2** (SU : 0,1) épisode/sujet-an ; **7 % vs 7 %** de patients avec ≥ 1 hypo sévère ; **glucose interstitiel < 2,2 mmol/L chez 22 % vs 20 %** | Hypo **sévère = DUR** ; interstitiel = **SUBSTITUT** | **modéré** pour les taux ; ⚠ **aucune répartition horaire ni définition de fenêtre nocturne dans l'abstract → `[À VÉRIFIER]`** (§8) |

**Proportion nocturne — calcul explicite (à ne pas confondre avec un chiffre publié)** : en DT2, HAT
donne **3,7 / 19,3 ≈ 19 %** des événements dans la fenêtre minuit-06 h, et **15,9 %** des patients
concernés sur 4 semaines. **C'est mon calcul de ratio, pas une valeur rapportée par les auteurs**
(`[À VÉRIFIER]` en red-team). L'ordre de grandeur — **environ un cinquième des épisodes déclarés** — est
à retenir tel quel : la nuit **n'est pas** le créneau majoritaire en DT2 quand on interroge le patient.
Sous MCG en revanche, Gehlaut ne trouve **aucune** différence jour/nuit — parce que la MCG voit ce que
le patient ne déclare pas.

### 4.2 ⚠ Tableau des **définitions de la fenêtre nocturne**, source par source

C'est le point décisif pour le découpage proposé : **il n'existe pas de fenêtre nocturne standard.**

| Source | Fenêtre employée | Formulation vérifiée | Statut |
| --- | --- | --- | --- |
| **HAT global** (Khunti 2016, PMID 27161418) | **minuit – 06:00** | « *nocturnal hypoglycaemia (any event occurring **between midnight and 06:00 hours**)* » | **vérifié** (texte intégral PMC) |
| **DEVOTE** (via DEVOTE 7, Pratley RE et al., *Diabetes Obes Metab* 2019;21(7):1625-33 · **PMID 30850995** · PMC6617815) | **00:01 – 05:59** | « *Nocturnal severe hypoglycaemia was defined as an episode with an investigator-reported onset **between 00:01 am and 5:59 am**.* » | **vérifié** (sur une publication DEVOTE ; le protocole princeps NEJM n'a pas été lu — cf. §8) |
| **SWITCH 2** (via Chaykin L et al., *Clin Diabetes* 2019;37(1):73-81 · **PMID 30705500** · PMC6336128) | **00:01 – 05:59** | « *Symptomatic hypoglycemia with onset **between 00:01 a.m. and 05:59 a.m.** was classified as nocturnal.* » | **vérifié** (post-hoc décrivant les méthodes de SWITCH 2 ; JAMA princeps non lu — cf. §8) |
| **CONCLUDE** (Philis-Tsimikas, *Diabetologia* 2020 · **PMID 31984443** · PMC7054369) | **00:01 – 05:59** | « *nocturnal symptomatic hypoglycaemia (severe or blood-glucose-confirmed with symptoms, **occurring between 00:01 and 05:59 h**)* » | **vérifié** (texte intégral) |
| **SWITCH PRO** (Goldenberg RM et al., *Diabetes Obes Metab* 2021;23(11):2572-81 · **PMID 34322967** · PMC9290717) | **00:01 – 05:59** | « *The nocturnal period was defined as **00:01 to 05:59 (inclusive)**.* » (mesure **MCG**) | **vérifié** |
| **Munshi 2011** (PMID 21357814) | **22:00 – 06:00** | « *at least 1 nocturnal episode (**10 pm to 6 am**)* » | **vérifié** |
| **Gehlaut 2015** (PMID 25917335) | **21:00 – 06:00** | « *Daytime was classified as from 6:00 am until **9:00 pm** and nighttime from **9:00 pm until 6:00 am**.* » | **vérifié** |
| **Battelino 2019** — consensus TIR (PMID 31177185) | **aucune heure** | « *Time blocks (24-h, day, night)* » — les blocs sont nommés, **jamais chiffrés** | **vérifié** (lecture PMC) |
| **ADA SOC 2026 ch. 6** (PMID 41358894) | **aucune** | pas de définition horaire de l'hypoglycémie nocturne | **vérifié** (lecture PMC) |
| **EDITION 1-2-3 poolée** (Ritzel, *DOM* 2015 · PMID 25929311) | **non précisée dans l'abstract** | « *lower with Gla-300 than with Gla-100 **during the night** (31 % difference in rate ratio over 6 months) and at any time (24 h, 14 %)* » | **`[À VÉRIFIER]`** — l'essai est déjà cité par le nœud, sa fenêtre reste à établir |
| **Treat-to-Target** (Riddle 2003 · PMID 14578243) | **non précisée dans l'abstract** | « *without documented nocturnal hypoglycemia (≤72 mg/dl)* » | **`[À VÉRIFIER]`** — texte intégral 403 |
| **UK Hypoglycaemia Study Group 2007** (PMID 17415551) | **non rapportée dans l'abstract** | — | **`[À VÉRIFIER]`** |
| **SFD Paramédical 2022** (source locale) | — | « *les comparaisons faites sur la période des 24 h et sur **la période nocturne définie selon des critères propres à chaque étude*** » | **vérifié** — les experts français **constatent eux-mêmes la divergence** |

**Lecture** : trois familles coexistent — **minuit-06 h** (HAT, et *de facto* le standard Novo Nordisk à
une minute près), **22 h-06 h** (Munshi), **21 h-06 h** (Gehlaut) — et les deux textes de consensus qui
comptent le plus pour le nœud (Battelino 2019, ADA SOC 2026) **ne chiffrent aucune fenêtre**. La borne
haute (06:00) est la seule qui fasse consensus dans les sources chiffrées. **La borne basse varie de
21 h à minuit** — trois heures d'écart, soit exactement le créneau où le SFD 2017 place le bolus du soir.

### 4.3 Le capillaire voit-il la nuit ? (volet c)

C'est la donnée la plus **dure** de cette collecte, et elle est **convergente** :

- **Munshi 2011** : **93 %** (95/102) des épisodes détectés par MCG étaient **non reconnus** par
  **4 glycémies capillaires par jour** ni par les symptômes, chez des sujets **âgés** (≥ 69 ans) sous
  insuline. Horizon 3 jours, n = 40.
- **Zick 2007 (SAFIR)** : **56,9 % vs 26,4 %** de patients avec hypoglycémie détectée (CGMS vs méthodes
  conventionnelles) chez 367 DT2 sous multi-injections, sur 72 h — soit **moins de la moitié** des
  patients repérés par l'ASG.
- **Gehlaut 2015** : **75 %** des patients ayant une hypoglycémie ont eu des épisodes **asymptomatiques**.
- **SFD 2017** (source locale) : hypoglycémie nocturne et phénomène de l'aube sont « *très mal évalués et
  **difficiles à différencier par une glycémie capillaire au coucher et au lever*** ».

**GRADE du corps de preuve « le capillaire manque l'hypoglycémie nocturne »** : **modéré**. Plusieurs
études indépendantes, cohérentes, effet de grande taille, mais toutes observationnelles et sur
**substitut** (glucose interstitiel), avec un biais de vérification inhérent (la MCG est le test index
*et* la référence).

**Conséquence directe pour la passe A, et elle est inconfortable** : un champ « créneau de survenue »
rempli à partir des glycémies capillaires du patient est un instrument dont **la sensibilité nocturne
est basse et connue**. Il documentera surtout les hypoglycémies **ressenties** — c'est-à-dire, en
pratique, les hypoglycémies **diurnes**. `HYPOTHÈSE` : cela biaise le champ **contre** le créneau nuit,
donc contre le seul créneau dont l'attribution est la moins ambiguë. Je le signale, je ne le tranche pas.

---

## §5. Découpage en **quatre périodes fixes** vs repères **ancrés sur les repas**

**Recherche effectuée** : consensus MCG (Battelino 2019, ADA SOC 2026 ch. 6 et 9), essais de titration
basale et prandiale (Treat-to-Target, 4T, FullSTEP, Bergenstal 2008, CONCLUDE, SWITCH PRO, DEVOTE),
sources locales FR.

**Résultat : aucune recommandation et aucun essai identifié n'emploie un découpage du nycthémère en
quatre périodes fixes.** Les repères rencontrés sont de trois natures, et une seule est horaire :

1. **Binaire jour / nuit** — c'est le seul découpage **par l'horloge** attesté. Il sert à *décrire* des
   taux d'événements (HAT, DEVOTE, SWITCH 2, CONCLUDE, EDITION), pas à *décider* d'un ajustement.
   Battelino 2019 le nomme (« *Time blocks (24-h, day, night)* ») sans le chiffrer.
2. **Ancré sur les repas et le coucher** — c'est ce qui pilote les décisions, partout :
   - Bergenstal 2008 : le trio **pré-déjeuner / pré-dîner / coucher** pour les bolus, la **glycémie à
     jeun** pour la basale ;
   - Treat-to-Target, ebmfrance, HAS R.85 : la **glycémie à jeun** pour la basale ;
   - ADA SOC 2026 : différentiel **coucher → lever** (≥ 50 mg/dL) et **post-prandial → pré-prandial**
     comme signaux de sur-basalisation ; bolus au **repas le plus copieux** ;
   - SFD 2025 : cibles **préprandiales** 1-2 g/L chez le sujet très âgé.
3. **Ancré sur la physiologie de l'injection** — SFD 2017 §8.6.3 : « l'effet du bolus prandial se
   manifeste **pendant les 4 heures qui suivent l'administration** ». Ce n'est ni une horloge fixe ni un
   repas : c'est **une fenêtre glissante attachée à l'heure réelle du repas**. C'est précisément pour
   cela que le SFD écrit que la période 0-4 h peut relever du bolus du soir « *surtout lorsque les repas
   sont pris tardivement (après 20 heures)* ».

**Ce que ça change pour la forme du champ** — et c'est la réponse à la question 3 :

| | Créneau fixe (0-6 / 6-12 / 12-18 / 18-24) | Repère ancré sur les repas |
| --- | --- | --- |
| Attesté dans une source ? | **Non** (aucune) | **Oui**, partout, y compris dans le seul ECR pertinent (Bergenstal 2008) |
| Saisissable par le patient sans capteur ? | Oui (« vers 11 h ») | Oui (« avant le déjeuner ») — et c'est **déjà** ce que le patient dit spontanément |
| Robuste aux horaires de repas décalés ? | **Non** — le contre-exemple SFD 2017 (dîner après 20 h) casse le créneau « nuit » | **Oui** par construction |
| Traduit directement en composant ? | Seulement via une table qu'aucune source ne publie | Oui : « avant le repas suivant » → bolus du repas précédent (raisonnement, cf. §3) |

`HYPOTHÈSE (agent A, à valider)` : un champ **ancré sur les repas** — *à jeun / avant le déjeuner /
avant le dîner / au coucher / la nuit* — dirait la même chose que les quatre créneaux, serait **plus
proche du langage du patient**, **plus robuste aux horaires décalés**, et surtout **serait la seule
formulation adossée à une source** (Bergenstal 2008 pour l'instrumentation, ADA SOC 2026 pour les
repères coucher/lever). Les quatre créneaux fixes, eux, ne s'adossent à rien de publié. Je ne tranche
pas : c'est un arbitrage de conception, pas un fait de preuve — mais la preuve **penche d'un côté**.

---

## §6. Ce que disent les sources FR (part agent A — OpenEvidence les hallucine)

| Source FR | Ce qu'elle dit, sur cette question précise | Portée |
| --- | --- | --- |
| **HAS 2024** (`strategie_therapeutique…pdf`) | **R.82 (AE)** : l'instauration d'une insulinothérapie « *nécessite… l'**adaptation des doses d'insuline** afin d'atteindre les objectifs glycémiques, la connaissance des moyens de prévenir et de corriger les hypoglycémies* » — **sans dire comment**. **R.85 (AE)** : le choix du schéma dépend des « *profils glycémiques : y a-t-il une **hyperglycémie à jeun** ? Est-elle isolée ou associée à une ou plusieurs **hyperglycémies postprandiales** ?* ». **Une seule** occurrence de « nocturne » dans toute la RBP, et c'est un critère de **choix de molécule** : « *par une injection quotidienne basale… selon la situation du patient (en particulier, **risque d'hypoglycémies nocturnes**)* ». | **Aucune règle d'attribution horaire.** La granularité HAS est **à jeun vs post-prandial**, en **accord d'experts (AE)** — donc, par la règle « granularité si EBM » de `00-global.md`, **affichable, non pilotant**. |
| **SFD 2025** (`SFD 2025.pdf`) | **Avis 23** : l'ASG est « **indispensable** » sous insuline « *afin d'adapter les doses d'insuline et de prévenir les hypoglycémies* » ; et « *il est indispensable d'expliquer au patient les modalités et enjeux de cette autosurveillance : **définir les moments**, la fréquence, les objectifs glycémiques et les décisions à prendre* » — **la SFD dit de définir les moments, elle ne les définit pas.** Sujet très âgé : cibles **capillaires préprandiales 1-2 g/L**. EHPAD : les patients sous insuline « *sont souvent **surtraités** avec de fréquentes hypoglycémies, **notamment la nuit*** » ; la MCG est indiquée « *pour dépister des hypoglycémies « asymptomatiques », **en particulier nocturnes*** ». Repère de sur-basalisation : « *plus de **0,5 U/kg/j*** ». | **Aucune règle d'attribution horaire.** Mais **deux appuis FR forts** pour la passe A : le surtraitement nocturne du sujet âgé (V-A5) et le fait que la SFD renvoie explicitement au **capteur** dès qu'il s'agit de voir la nuit. |
| **SFD 2017 — référentiel MCG** (`mmm_referentielmcg_ep11.pdf`) ⚠ *pas le CMG* | **La seule source du corpus qui énonce la table d'attribution** (§8.6.2 et §8.6.3, citées mot pour mot au §3). Elle l'énonce **et la relativise dans la même page** : la nuit 0-4 h peut relever du **bolus du soir** ; avant de modifier un schéma basal, « *il est important de vérifier que les hypoglycémies ne sont pas liées à des bolus de correction* ». | **Position d'experts**, **contexte DT1/pompe** dominant. Utilisable comme **argumentaire** ; **pas** comme fondement d'un gate. |
| **SFD Paramédical 2022** (`pdp_pompe…pdf`) | « *les comparaisons faites sur la période des 24 h et sur **la période nocturne définie selon des critères propres à chaque étude*** ». | Constat FR de la **non-standardisation** de la fenêtre nocturne. À citer tel quel si le nœud crée un champ « nuit ». |
| **ebmfrance — « Insulinothérapie dans le DT2 »** | Sous basale seule, **une seule mesure** : la glycémie à jeun. Descente codifiée : GAJ < 4,0 mmol/L **plus d'une fois sur trois → −2 U** ; **hypoglycémie symptomatique → −4 U** ; hypoglycémies récurrentes → contacter le centre. **Zéro occurrence du mot « nocturne » dans toute la fiche.** | ⚠ **Le point le plus utile pour E7** : la source EBM de référence du nœud attribue, **sous basale seule**, **toute** hypoglycémie symptomatique à la basale **sans distinguer l'heure** — et fournit **le geste chiffré de descente qui manque au nœud** (V-A1 / A-3). |
| **Prescrire** (`prescrire-dt2.md`) | Rien sur l'heure des hypoglycémies. P3 liste l'hypoglycémie et la prise de poids comme effets indésirables des insulines ; P1=P4 fixe la place de l'insuline. | **Muet** sur la question. À dire tel quel, pas à interpréter. |
| **CMG (Collège de la Médecine Générale)** | **Aucune source CMG dans le dépôt.** `mmm_referentielmcg_ep11.pdf` est le référentiel **Mesure Continue du Glucose** (SFD 2017), **pas** le CMG — erreur d'étiquetage déjà relevée au nœud D. | **Absence à assumer**, pas à combler par une extrapolation. |

**Divergence FR ↔ international** : aucune. Toutes les sources, françaises comme internationales,
**convergent en négatif** : personne ne publie de table « heure → composant ». La seule qui s'en
approche (SFD 2017) l'écrit pour la **MCG**, en **DT1/pompe**, et **prévient qu'elle est ambiguë**.

---

## §7. Réponse

**En un mot : c'est un raisonnement physiopathologique universellement admis mais jamais testé.**
Voici le détail, réparti comme demandé.

### 7.1 Ce qui est **démontré** (donnée)

1. **L'hypoglycémie nocturne existe, est fréquente, et est massivement sous-détectée par le capillaire.**
   Munshi : **93 %** des épisodes échappent à 4 glycémies/jour (n = 40, 3 j) ; Zick : **56,9 % vs 26,4 %**
   de patients détectés (n = 367, 72 h) ; Gehlaut : **75 %** des patients concernés ont des épisodes
   asymptomatiques. Critères **substitutifs** (glucose interstitiel). **GRADE modéré** (convergence,
   effet ample, mais observationnel).
2. **La proportion nocturne déclarée en DT2 est minoritaire.** HAT : **15,9 %** des patients DT2 et
   **3,7 / 19,3 ≈ 19 %** des événements sur 4 semaines, fenêtre minuit-06 h ; hypo sévère chez **8,9 %**
   des patients. **GRADE faible** (déclaratif, biais de détection, promoteur industriel).
3. **Sous MCG, il n'y a pas de sur-représentation nocturne.** Gehlaut : 1,78 vs 1,81 épisode/personne,
   **p = 0,95**. **GRADE faible** (n = 108, 5 jours). Ce résultat est important : il suggère que
   l'intuition « l'hypoglycémie, c'est surtout la nuit » vient de ce qu'on mesure, pas de ce qui se passe.
4. **Il n'existe pas de fenêtre nocturne standard** : minuit-06 h (HAT), 00:01-05:59 (Novo : DEVOTE,
   SWITCH 2, CONCLUDE, SWITCH PRO), 22 h-06 h (Munshi), 21 h-06 h (Gehlaut) ; **aucune** chez Battelino
   2019 ni ADA SOC 2026. **La SFD 2022 le constate elle-même.** Fait vérifié, pas une opinion.

### 7.2 Ce qui est un **raisonnement physiopathologique**

**La logique d'attribution « heure → composant » tout entière.** Elle repose sur le mécanisme d'action,
énoncé sans détour par l'ADA SOC 2026 : *« The principal action of basal insulin is to restrain hepatic
glucose production and limit hyperglycemia overnight and between meals. »* De là on déduit — et c'est
une déduction, pas un résultat — que l'hypoglycémie nocturne ou inter-prandiale accuse la basale, et
l'hypoglycémie qui suit un repas le bolus de ce repas.

- **Aucun essai n'a randomisé cette attribution** contre une alternative. L'essai qui s'en approche le
  plus, **Bergenstal 2008** (n = 273, 24 sem.), l'**instrumente dans ses deux bras** — jeûne → glargine,
  trio pré-déjeuner/pré-dîner/coucher → glulisine — donc il la **présuppose** au lieu de la tester, et
  **ne publie même pas la correspondance un-pour-un**.
- **Aucune recommandation ne l'écrit sous forme de règle.** ADA SOC 2026 ch. 6 et ch. 9 : rien.
  Battelino 2019 : rien. HAS 2024 : rien (et son unique raisonnement horaire est **AE**, sur l'hyper).
- **Le seul texte qui l'écrit** — SFD 2017 §8.6.3, position d'experts, contexte DT1/pompe —
  **l'accompagne aussitôt de son contre-exemple** : la période 0-4 h peut relever du **bolus du soir**,
  et il faut alors « *avancer ou réduire le bolus prandial plutôt que de baisser le débit basal* ».

**Conséquence pour le droit d'affirmer du nœud** : la table de lecture peut être **affichée** comme aide
au raisonnement, avec une formulation explicitement non affirmative (« oriente vers », « fait
suspecter »), au **niveau de preuve `tres_faible` à `faible`**. Elle ne peut **pas** justifier un
`niveau_preuve` supérieur, ni **piloter un gate** (au sens de `00-global.md` §granularité si EBM), ni
être présentée comme « ce que dit l'EBM ». C'est exactement le statut que lui donne déjà le dossier
(`E-insuline.md` §2, option 4a, `niveau_preuve : faible-modéré`) : **la collecte confirme le classement
existant, elle ne le corrige pas.**

### 7.3 Ce qui est **inexistant**

- **Le découpage en quatre périodes fixes de 6 h.** Aucune recommandation, aucun essai, aucune source
  française ou internationale ne l'emploie. Les découpages horaires attestés sont **binaires** (jour /
  nuit) et servent à **décrire**, jamais à **décider**.
- **Toute donnée d'efficacité de l'ajustement guidé par l'heure**, sur critère dur **ou** substitut.
  Il n'y a **rien à grader** : le corps de preuve d'intervention est vide.
- **Une fenêtre nocturne consensuelle** à laquelle adosser un champ « nuit ».

### 7.4 Lecture de la proposition de design du référent (V-A9)

Le référent écrit dans V-A9 : *« sous basale seule, tous les créneaux accusent la même chose — la
basale, ou un sulfamide que le nœud dit déjà d'arrêter. Le découpage en 4 n'y sert qu'à documenter, pas
à décider. »*

**La preuve va dans le sens de cette lecture, et par un chemin indépendant.** ebmfrance — la source de
référence du nœud pour l'insulinothérapie — code exactement cela : sous basale seule, **toute**
hypoglycémie symptomatique commande **−4 U de basale**, sans mention de l'heure ; et « *uniquement la
glycémie à jeun* » suffit à la surveillance. Le créneau n'ajoute donc rien à la décision dans cette
situation.

**Une réserve, sur l'autre moitié de la proposition.** Le référent conclut que le créneau devient
décisif **sous basal-bolus**, le créneau **nuit** restant utile partout. La preuve **ne contredit pas**
cette lecture, mais elle ne la confirme pas non plus, et elle apporte **un caveat précis** : SFD 2017
§8.6.3 dit que sous basal-bolus **la première partie de la nuit peut accuser le bolus du soir**, surtout
si le dîner est tardif. Autrement dit, **le créneau « nuit » n'est pas le plus univoque sous
basal-bolus — c'est là qu'il l'est le moins.** Si le champ est créé, `HYPOTHÈSE` : il gagnerait à
distinguer *début de nuit* (≤ 4 h après le dîner, ambigu) de *fin de nuit / réveil* (basale), plutôt
qu'à traiter « 0-6 h » comme un bloc. À arbitrer par le référent (§9, Q3).

---

## §8. `[À VÉRIFIER]`

| # | Élément | Pourquoi il n'est pas levé | Bloquant ? |
| --- | --- | --- | --- |
| V1 | **Définition d'horloge de « nocturne » dans Treat-to-Target** (Riddle 2003, PMID 14578243) | Texte intégral inaccessible (**HTTP 403** sur `diabetesjournals.org`) ; l'abstract dit seulement « *documented nocturnal hypoglycemia (≤72 mg/dl)* ». | **Oui, si** un champ « nuit » est créé : c'est l'essai sur lequel repose toute la titration du nœud. |
| V2 | **Fenêtre nocturne d'EDITION 1-2-3** (Ritzel 2015, PMID 25929311) — essai déjà cité par le nœud | Abstract : « *during the night* », sans heure. | Non (confort de cohérence). |
| V3 | **Répartition horaire et définition de la nuit dans l'UK Hypoglycaemia Study Group 2007** (PMID 17415551) | L'abstract ne rapporte ni fenêtre ni répartition horaire ; texte intégral Springer derrière authentification (redirection IDP). Les taux DT2 **insuline > 5 ans** ne sont pas non plus dans l'abstract. | Non, mais c'est une des 3 sources nommées par le référent : l'absence doit être **actée**, pas devinée. |
| V4 | **Définitions DEVOTE et SWITCH 2 lues sur les publications princeps** (NEJM 2017 / JAMA 2017) | Vérifiées ici sur **DEVOTE 7** (PMID 30850995) et sur le post-hoc SWITCH 2 (PMID 30705500), qui décrivent les méthodes de l'essai parent. Concordantes (00:01-05:59), mais **de seconde main**. | Non (concordance sur 4 publications Novo indépendantes). |
| V5 | **Numérotation « reco 9.26 » et grade E** de l'ADA SOC 2026 ch. 9 (sur-basalisation) | Extraction par lecture de la version PMC ; la numérotation exacte n'a pas été recoupée sur le PDF officiel. Le **contenu** (différentiel coucher-lever ≥ 50 mg/dL) est, lui, cité mot pour mot. | Non. |
| V6 | **Table 1 de Bergenstal 2008** — correspondance un-pour-un « quel relevé ajuste quel repas » | Deux lectures du texte intégral PMC concluent que **la publication ne l'explicite pas** (elle ne donne que le groupe des 3 points). À confirmer sur le PDF. | Non — et **l'absence est en soi le résultat**. |
| V7 | **Chiffres d'hypoglycémie de Bergenstal 2008** (« 53 épisodes / 19 patients, 0,89 év./pt-an » vs « 37 / 19, 0,67 », p = 0,58) | Extraits par lecture assistée ; l'étiquette « **sévère** » est **suspecte** au vu des taux (0,89 év./pt-an d'hypo sévère serait très élevé). **Ne pas encoder tel quel.** | Non pour cette question ; **oui** si le chiffre devait servir ailleurs. |
| V8 | **Ratio « ≈ 19 % des événements DT2 sont nocturnes »** | **Calcul de l'agent A** (3,7 / 19,3 sur les taux HAT), **pas un chiffre publié**. Les deux taux sont, eux, vérifiés au texte intégral. | Non, mais **doit être présenté comme un calcul** partout où il est repris. |
| V9 | **Fenêtres horaires des logiciels de lecture MCG** (Dexcom Clarity « Overnight / Morning / Afternoon / Evening », LibreView) | Recherche menée : les guides utilisateurs publics **ne publient pas les bornes horaires**. Piste abandonnée faute de source. | Non. C'était la seule piste de « découpage en 4 » ; elle n'aboutit pas. |

---

## §9. Demandes au référent

1. **Q1 — Le nœud a-t-il le droit d'afficher la table d'attribution ?** Ma lecture : oui, **comme
   raisonnement**, avec des verbes non affirmatifs (« oriente vers », « fait suspecter »), au niveau
   `tres_faible`/`faible`, et **sans jamais gater** une option dessus. Confirmes-tu cette borne ?
2. **Q2 — Créneaux fixes ou repères ancrés sur les repas ?** La preuve n'atteste que la seconde forme
   (Bergenstal 2008, ADA SOC 2026, HAS R.85, SFD 2025, ebmfrance). Acceptes-tu de remplacer
   *nuit / matinée / après-midi / soir* par *à jeun · avant le déjeuner · avant le dîner · au coucher ·
   la nuit* — même libellé pour le patient, mais adossé à des sources ? **C'est la seule décision de ce
   document qui change la forme du champ**, et elle est ton arbitrage, pas le mien.
3. **Q3 — Le créneau « nuit » doit-il être scindé ?** SFD 2017 §8.6.3 dit que **0-4 h peut relever du
   bolus du soir** si le dîner est tardif. Sous basal-bolus, un bloc « 0-6 h → basale » serait donc
   **faux une partie du temps**. Faut-il distinguer *début de nuit* / *fin de nuit-réveil*, ou accepter
   l'imprécision et la dire dans le texte de la carte ?
4. **Q4 — Quelle fenêtre nocturne retenir** si un champ « la nuit » est créé ? **Minuit-06 h** est la
   seule qui converge (HAT + les 4 essais Novo à une minute près) ; 22 h-06 h et 21 h-06 h existent
   aussi. Mon avis : ne **pas** afficher d'heures au patient (« pendant la nuit / au réveil ») et
   documenter minuit-06 h dans l'argumentaire.
5. **Q5 — Faut-il dire au praticien que le capillaire manque la nuit ?** C'est la donnée la plus solide
   de cette collecte (Munshi 93 % ; Zick 56,9 % vs 26,4 %) et elle a une conséquence pratique : sous
   basale seule chez un sujet âgé sous-cible (V-A5), **l'absence d'hypoglycémie déclarée ne vaut pas
   absence d'hypoglycémie**. Est-ce une alerte, une phrase dans la carte, ou hors périmètre ?
6. **Documents demandés** (les seuls `[À VÉRIFIER]` que je ne peux pas lever seul) :
   - **Riddle 2003, texte intégral** (*Diabetes Care* 2003;26:3080-6) — pour la définition de
     « nocturnal » de l'essai qui fonde la titration du nœud (**V1**, bloquant si un champ nuit est créé) ;
   - **UK Hypoglycaemia Study Group 2007, texte intégral** (*Diabetologia* 50:1140-7) — répartition
     horaire et taux du groupe DT2 insuline > 5 ans (**V3**) ;
   - **Bergenstal 2008, PDF** (*Diabetes Care* 31:1305-10) — Table 1 et définitions d'hypoglycémie
     (**V6**, **V7**) ;
   - rappel : **`prescrire 12.pdf` est toujours vide** et reste à re-fournir (dette héritée des nœuds D,
     E et H) — sans effet ici, Prescrire étant muet sur cette question.

---

### Annexe — méthode de cette collecte

Sources locales converties et interrogées en premier (`docs/decision/sources/`, 14 PDF). Recherche
primaire ensuite : NCBI E-utilities (efetch abstracts + full text PMC XML), Europe PMC REST
(recherche plein texte), lecture directe des versions PMC pour les définitions citées mot pour mot.
Chaque citation entre guillemets de ce document a été **lue dans la source** (texte intégral PMC ou PDF
local), à l'exception explicite des lignes marquées `[À VÉRIFIER]`. Aucun PMID, DOI, chiffre ou position
n'a été reconstitué de mémoire. Fichiers de travail temporaires supprimés après lecture ; aucun fichier
sous `content/`, `src/`, `schema/` ni `E-insuline.md` n'a été touché.
