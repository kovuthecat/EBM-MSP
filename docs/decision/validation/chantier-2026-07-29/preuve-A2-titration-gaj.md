# Titration de la basale sur la glycémie à jeun capillaire — monter, **descendre**, s'arrêter, et le sujet âgé

Note de preuve (agent A — extraction/chiffrage), chantier « Passe A — insuline sans capteur », 2026-07-29.
Nœud `insuline` (domaine `diabete-type-2`). Pendant « agents » du prompt **OE-A2**.

> **Ce document ne modifie rien.** Lecture seule sur `content/**`, `src/**`, `schema/**` et sur
> [`E-insuline.md`](../../noeuds/E-insuline.md). Il propose, il n'encode pas. Un seul fichier écrit.
>
> **Discipline de traçage.** Chaque référence ci-dessous a été ouverte, ou son statut est écrit. Les
> articles hébergés sur `diabetesjournals.org` et `endocrinepractice.org` renvoient un **HTTP 403** :
> quand aucune version PMC n'existe, le statut est **secondaire concordant** ou **non ouvert**, et
> c'est dit à chaque fois. Aucun PMID/DOI n'est cité sans avoir été affiché par PubMed, Europe PMC ou
> PMC. **Un PMID a été corrigé au passage** : PREDICTIVE 303 = **17924873**, pas 17924872 (qui est une
> étude sur la cannelle — vérifié via Europe PMC).
>
> **Périmètre d'arbitrage.** Le repère de **0,5 U/kg/j** a été instruit et red-teamé le 2026-07-27
> ([`preuve-sur-basalisation.md`](../chantier-2026-07-27/preuve-sur-basalisation.md),
> [`redteam-sur-basalisation.md`](../chantier-2026-07-27/redteam-sur-basalisation.md)) ; **l'arbitrage
> est rendu et n'est pas rouvert ici**. Le §4 ci-dessous cherche *autre chose*, et signale une
> **correction factuelle** au dossier de 2026-07-27 qui ne change pas l'arbitrage (§4.4).

---

## 1. La question

Chez l'adulte **DT2 sous insuline basale**, quels sont les **algorithmes de titration publiés fondés
sur la glycémie capillaire à jeun** ? Trois volets :

1. **La règle de descente** — quelle valeur de glycémie à jeun, combien d'occurrences, et **de combien**
   réduire (unités fixes ou pourcentage) ?
2. **Le plafond** — existe-t-il une borne fondée sur les preuves au-delà de laquelle cesser de monter,
   **autre** que le repère déjà arbitré de 0,5 U/kg/j ?
3. **Le sujet âgé / fragile** — existe-t-il un essai ou un sous-groupe pré-spécifié soutenant un **pas
   plus petit**, un **intervalle plus long**, ou une **cible de glycémie à jeun plus haute** au-delà de
   75 ans ou en cas de fragilité — ou n'est-ce qu'un accord d'experts ?

**PICO.** P = adulte DT2 sous basale, sans capteur (autosurveillance capillaire). I = algorithme de
titration guidé par la glycémie à jeun, incluant sa règle de descente. C = autre algorithme, autre
cible, ou absence d'algorithme. O = **DURS** : hypoglycémie **sévère** (nécessitant l'aide d'un tiers),
événements CV, mortalité. **SUBSTITUTS** : HbA1c, glycémie à jeun, % atteignant la cible, hypoglycémie
**symptomatique / documentée / d'alerte**, dose d'insuline, poids.

**Conversions employées partout** : g/L = mmol/L × 0,18 ; g/L = mg/dL ÷ 100.
`3,9 mmol/L = 0,70 g/L` · `4,0 = 0,72` · `5,0 = 0,90` · `5,6 = 1,01` · `6,0 = 1,08` · `6,1 = 1,10` ·
`7,0 = 1,26` · `7,2 = 1,30`.

---

## 2. Ce que disent les sources locales (`docs/decision/sources/`) — lues avant toute recherche web

### 2.1 ebmfrance / Duodecim, « Insulinothérapie dans le diabète de type 2 » — **la règle de descente y est, complète**

**Fichier local** : `Insulinothérapie dans le diabète de type 2 _ ebmfrance.pdf` (Duodecim 27/05/2022,
contextualisation ebmfrance 26/06/2024). C'est la « position EBM de référence » du nœud
(`E-insuline.md` §5 tableau E5). **Lu intégralement (8 pages).** Citations verbatim :

> **Montée** — « le patient reçoit par écrit un guide simple d'auto-ajustement : **augmenter la dose de
> 2 unités si la glycémie à jeun est supérieure à 6,0 mmol/l pendant 3 matins consécutifs**. »
> *(p. 4 ; 6,0 mmol/L = 1,08 g/L)*

> **DESCENTE** — « **si la glycémie à jeun est inférieure à 4,0 mmol/l** [0,72 g/L] :
> — **1 fois sur 3 : pas de modification du dosage** ;
> — **plus fréquemment : réduire la dose de 2 unités** ;
> — si les glycémies à jeun restent basses, contacter un(e) infirmier(e). » *(p. 4)*

> **Descente sur symptômes** *(Tableau 1)* — « (sauf si la glycémie à jeun est au moins une fois
> inférieure à 4,0 mmol/l). **Si le patient fait des hypoglycémies symptomatiques, réduire la dose de
> 4 unités.** Si le patient fait des hypoglycémies récurrentes, il doit contacter son centre de
> traitement. » *(p. 5)*

> **Cible** — « Ne pas oublier l'auto-ajustement de la dose d'insuline et la **plage cible de 4,0 à
> 6,0 mmol/l** pour la glycémie à jeun » *(p. 7 ; = **0,72-1,08 g/L**)*. **⚠ Incohérence interne de la
> source** : p. 5, « Si la glycémie à jeun ne se situe pas dans l'**intervalle cible (5,0 à
> 6,0 mmol/l)**, l'HbA1c cible de 7,0 % ne sera pas atteinte » *(= 0,90-1,08 g/L)*. La même fiche donne
> donc **deux bornes basses différentes** (4,0 et 5,0 mmol/L). La borne **haute (6,0 mmol/L = 1,08 g/L)**
> est constante.

> **Suivi** — « Pendant le traitement par insuline du soir, il suffit de mesurer la glycémie à jeun le
> matin et lorsque les symptômes d'hypoglycémie apparaissent. » · « Une fois la dose stabilisée, la
> mesure de la glycémie à jeun peut être effectuée moins fréquemment, par exemple une fois par
> semaine. » *(p. 7)*

**C'est la réponse la plus directe au volet 1, et elle était déjà dans le dépôt.** Elle tranche
explicitement la question posée par la vignette V-A1 (« **une** GAJ basse ou **plusieurs** ? ») : **une
seule sur trois ne fait rien ; au-delà, −2 U** ; et **−4 U** si l'hypoglycémie est *symptomatique*.
Niveau : **guide de pratique** (Duodecim/EBM Guidelines), le niveau de preuve `B` de la fiche porte sur
« analogues lents vs NPH » et « insuline ajoutée à la metformine », **pas** sur l'algorithme de
titration lui-même, qui est présenté sans grade.

### 2.2 HAS 2024, RBP « Stratégie thérapeutique du patient vivant avec un DT2 » — **descente présente, symétrique, grade AE**

**Fichier local** : `strategie_therapeutique_…_-_recommandations.pdf`, **R.87, grade AE** (accord
d'experts). Extrait verbatim (texte extrait du PDF) :

> « L'instauration d'une insuline intermédiaire ou analogue lente pourra se faire avec les règles de
> pratique suivantes :
> — prescription d'une **dose initiale faible** (à titre indicatif, en général de **0,1 unité/kg par
> 24 heures**…) ;
> — **définition d'un objectif pour la glycémie à jeun au réveil selon l'objectif d'HbA1c personnalisé
> du patient** ;
> — **adaptation des doses d'insuline tous les 3 jours** en fonction des glycémies au réveil et de
> l'objectif fixé (à titre indicatif, la dose peut être **augmentée ou réduite de 1 ou 2 UI**, sauf cas
> particulier) ;
> — **réévaluation du traitement (ADO et/ou insuline) régulièrement et selon besoin en cas
> d'hypoglycémies fréquentes ou d'une hypoglycémie sévère** ; […] »

**Deux points décisionnels.** (a) La HAS énonce la titration **de façon symétrique** (« augmentée **ou
réduite** ») — la descente n'est pas un oubli, elle est dans le même geste ; mais elle **ne donne aucun
seuil bas de glycémie** ni aucun compte d'occurrences. (b) **La HAS ne fixe aucune cible chiffrée de
glycémie à jeun** : elle la fait dériver de l'objectif d'HbA1c personnalisé. Toute borne numérique
affichée par l'outil (0,70-1,20 g/L ou autre) **ne vient donc pas de la HAS**.

### 2.3 SFD 2025 (Darmon et al., *Méd. Mal. Métab.* 2025;19(8):630-662) — **la source la plus proche du texte encodé**

**Fichier local** : `SFD 2025.pdf`. **Avis n° 18**, verbatim (texte extrait du PDF) :

> « Par exemple, **pour obtenir une HbA1c < 7 % (53 mmol/mol), il faudra viser une glycémie au réveil
> entre 0,80 g/L et 1,30 g/L** et « titrer » l'insuline basale dans ce sens (par exemple : **adaptation
> des doses d'insuline tous les trois jours en fonction des glycémies au réveil, la dose pouvant être
> augmentée ou réduite de 2 U — ou de 10 % chez les patients traités par de fortes doses d'insuline
> basale, par exemple supérieures à 40 U/j**). »

Et l'initiation : « **6 à 10 U/jour ou 0,1 à 0,2 U/kg/jour** ».

**Constat de traçabilité, à red-teamer (hypothèse, pas accusation).** Le texte affiché par le nœud —
« **+2 U** si la glycémie à jeun reste au-dessus de la cible **3 matins de suite** (ou **+10-20 %** par
paliers si dose **> 40 U**), à adapter **tous les 3 jours** » (`insuline.yaml`, options « Initier une
insuline basale » et « Titrer la basale ») — **coïncide mot pour mot avec l'Avis 18 de la SFD**
(pas / seuil de 40 U / rythme de 3 jours) et avec ebmfrance (les « 3 matins consécutifs »), **et non
avec l'algorithme de Riddle 2003**, qui est hebdomadaire et gradué (+2/+4/+6/+8 U selon la bande de
GAJ, cf. §3). Or le YAML attribue ces éléments à Treat-to-Target :

- `insuline.yaml` l. 641 : « … à adapter tous les 3 jours. **Algorithme validé (Treat-to-Target :
  ~60 % atteignent la cible)** » ;
- `insuline.yaml` l. 229 et l. 1295 (commentaires) : les bornes 0,70 / 1,20 g/L sont dites
  « **sourcées Treat-to-Target (Riddle 2003, PMID 14578243)** ».

**Ce qui est exact** : « ~60 % atteignent la cible » **est** un résultat de Riddle 2003 (≈ 60 % ≤ 7 %
dans chaque bras). **Ce qui est à vérifier** : le **pas, le rythme et le seuil de 40 U** ne sont pas
ceux de Riddle mais ceux de la **SFD 2025 / ebmfrance** ; et l'**intervalle 0,70-1,20 g/L** ne
correspond, en l'état de mes lectures, **à aucune des sources retrouvées** — SFD dit **0,80-1,30**,
ebmfrance **0,72-1,08** (ou 0,90-1,08), ADA **0,80-1,30**, Riddle **≤ 1,00**. Sa borne **basse (0,70)**
est en revanche le seuil universel d'hypoglycémie (3,9 mmol/L), qui sert de **plancher** dans les trois
bras de l'ECR FPG GOAL (§3) et de borne basse du TIR. **Hypothèse à red-teamer, avec les citations
ci-dessus ; ce n'est pas un défaut clinique** (1,20 g/L est encadré par 1,08 et 1,30), c'est un **défaut
d'attribution** — et une occasion : la source réelle (SFD Avis 18) **porte déjà la descente**.

**Avis n° 19** (plafond, cité ici pour le §4) :

> « En cas de résultats insuffisants sous insulinothérapie basale + metformine (HbA1c > objectif malgré
> des glycémies à jeun dans la cible ou HbA1c > objectif et glycémie à jeun au-dessus de la cible
> **malgré de fortes doses d'insuline basale, c'est-à-dire plus de 0,5 U/kg/j**), l'avis d'un
> endocrinologue-diabétologue est souhaitable. »

**Avis n° 21** (sujet âgé, cité pour le §5) :

> « Pour les personnes âgées dites « fragiles » […] et [celles] dont l'état de santé est très altéré
> […] : des **glycémies capillaires préprandiales comprises entre 1 et 2 g/L** et/ou une **HbA1c < 9 %**
> (75 mmol/mol) sont recommandées, en **restant au-dessus de 7,5 %** (58 mmol/mol) **en cas de
> traitement par insuline**. »

*(Note : ces avis SFD sont une **prise de position d'experts**, sans échelle de grade ; le seul appui
cité pour le sujet âgé est **GERODIAB**, cohorte observationnelle française.)*

### 2.4 Prescrire (`sources/prescrire-dt2.md`) — **rien sur la titration**

Lecture intégrale des notes locales (P1-P13) : **aucune occurrence d'un algorithme de titration, d'une
cible de glycémie à jeun, ni d'une règle de descente**. Prescrire ne traite l'insuline que comme (a) un
ajout « si HbA1c très élevé / si éviter la prise de poids n'est pas prioritaire », le GLP-1 étant « le
plus souvent 1er choix » avant, et (b) un profil d'effets indésirables : **hypoglycémies, prise de
poids, aggravation de la rétinopathie si baisse rapide d'HbA1c**. **Résultat négatif, à afficher comme
tel** — et cohérent avec la correction n° 3 du red-team de `E-insuline.md` §5b (« Prescrire = NPH » était
une invention d'OpenEvidence).

### 2.5 Autres fichiers locaux — hors sujet, vérifié

- `NICE 2023.pdf` = **NG238, « Cardiovascular disease: risk assessment and reduction, including lipid
  modification »** (14/12/2023) — c'est la source du nœud **statine**, **pas** une reco diabète. Aucune
  recommandation de titration insulinique. *(Vérifié par extraction texte.)*
- `mmm_referentielmcg_ep11.pdf` = hors-série SFD 2017 sur la **Mesure Continue du Glucose** — hors
  périmètre capillaire (et déjà signalé comme mal étiqueté « CMG » dans `MEMORY`/§D).
- `pdp_pompe_insuline_externe_mcg.pdf` = pompe / boucle fermée — hors périmètre MG.
- `Traitement global et suivi du diabète de type 2 _ ebmfrance.pdf` — non ré-ouvert ici (la fiche
  insulinothérapie dédiée, §2.1, est plus spécifique).

### 2.6 Ce que le nœud encode déjà (état au commit courant, lecture seule)

| Élément | Où | Statut après cette collecte |
|---|---|---|
| Cible GAJ 0,70-1,20 g/L | `gaj_a_cible`, `gaj_basse`, `gaj_haute` (dérivés) | Bornes **plausibles** mais **attribution à revoir** (§2.3) |
| +2 U si GAJ haute 3 matins de suite ; +10-20 % si > 40 U ; tous les 3 j | options « Initier » et « Titrer la basale » | **Confirmé** — source réelle = **SFD 2025 Avis 18** (+ ebmfrance pour les « 3 matins ») |
| « ~60 % atteignent la cible (Treat-to-Target) » | option « Titrer la basale » | **Confirmé** (Riddle 2003) |
| −2 à −4 U ou −10-20 % | option « Corriger l'hypoglycémie ou la variabilité » | **Confirmé et sur-confirmé** : −2 U (ebmfrance, SFD, HAS 1-2 UI), −4 U (ebmfrance, si hypo *symptomatique*), −10 % (SFD si > 40 U) |
| `gaj_basse == true` en `exclusions` de « Titrer » + déclencheur du geste correctif | passe A du 2026-07-29 | **Cohérent avec toutes les sources lues** — aucune n'autorise à monter sous une GAJ basse |

---

## 3. Tableau des algorithmes publiés

> **Lecture.** « ↑ » = augmentation, « ↓ » = réduction. **Toutes les valeurs de sortie de cette colonne
> « % à la cible sans hypo » sont des SUBSTITUTS** (HbA1c, GAJ), sauf mention « DUR » explicite.
> Statut des sources : **[P]** = primaire ouvert et lu · **[S×2]** = deux revues secondaires ouvertes et
> concordantes, primaire en 403 · **[S]** = une seule source secondaire · **[NR]** = non rapporté par les
> sources ouvertes.

### 3.1 Les six essais nommés dans la question

| Essai (réf.) | Cible GAJ | Pas de MONTÉE + fréquence | **RÈGLE DE DESCENTE** | Qui titre | % à la cible sans hypo · horizon | Statut |
|---|---|---|---|---|---|---|
| **Treat-to-Target** — Riddle, *Diabetes Care* 2003;26(11):3080-6 · **PMID 14578243** · DOI 10.2337/diacare.26.11.3080 | **≤ 100 mg/dL (1,00 g/L)** | Sur la **moyenne des 2 jours précédents** : ≥ 180 → **+8 U** ; 140-180 → **+6 U** ; 120-140 → **+4 U** ; 100-120 → **+2 U**. **Hebdomadaire** | **(a) PAS d'augmentation** si une glycémie **< 72 mg/dL (4,0 mmol/L = 0,72 g/L)** a été documentée dans la **semaine** écoulée. **(b) RÉDUCTION** si **hypoglycémie sévère** (aide d'un tiers) **ou** glycémie **< 56 mg/dL (0,56 g/L)** dans la semaine — **−2 à −4 U/j** | Médecin (patient auto-mesure) | ≈ **60 %** ≤ 7 % dans chaque bras ; **33,2 % vs 26,7 %** ≤ 7 % **sans hypo nocturne documentée** (glargine vs NPH) → **ARD 6,5 pp, NNT ≈ 15 · 24 sem** (SUBSTITUT composite) | **[S×2]** primaire 403 |
| **AT.LANTUS** — Davies, *Diabetes Care* 2005;28(6):1282-8 · **PMID 15920040** · DOI 10.2337/diacare.28.6.1282 | **≤ 100 mg/dL (1,00 g/L)** (FBG ≤ 5,5 mmol/L) | **Algo 1 (clinique)** : ≥ 180 → +6-8 U ; 140-180 → +4 U ; 120-140 → +2 U ; 100-120 → 0-2 U — **hebdomadaire**. **Algo 2 (patient)** : **+2 U tous les 3 jours** | **AUCUNE bande de réduction rapportée** par les deux revues ouvertes | Algo 1 médecin · Algo 2 patient | **Hypo sévère < 1 % dans les deux bras** (**DUR**) ; Algo 2 (patient) > Algo 1 sur le contrôle | **[S×2]** primaire 403 ; ⚠ **les deux revues intervertissent les libellés Algo 1/Algo 2** (§8-2) |
| **INSIGHT** — Gerstein, *Diabet Med* 2006;23(7):736-42 · **PMID 16842477** · DOI 10.1111/j.1464-5491.2006.01881.x | **≤ 5,5 mmol/L (0,99 g/L)** | **+1 U par jour** tant que la GAJ > 5,5 mmol/L. **Quotidien** | **NON RAPPORTÉE** par les sources ouvertes | **Patient** (auto-titration) | Critère principal = 2 HbA1c consécutives ≤ 6,5 % ; dose finale ≈ 38 U | **[S]** primaire payant |
| **LANMET** — Yki-Järvinen, *Diabetologia* 2006;49(3):442-51 · **PMID 16456680** · DOI 10.1007/s00125-005-0132-0 | **4,0-5,5 mmol/L (0,72-0,99 g/L)** | Sur la **moyenne de 3 jours consécutifs** pré-petit-déjeuner : > 100 mg/dL → **+2 U** ; > 180 mg/dL → **+4 U** | **NON RAPPORTÉE** par la revue ouverte | **Patient** (auto-ajustement, transmission par modem) | Glargine+MET réduit l'hypo symptomatique des **12 premières semaines** vs NPH+MET ; contrôle équivalent à 36 sem | **[S]** primaire payant (403 Springer) |
| **PREDICTIVE 303 / « 303 Algorithm »** — Meneghini, *Diabetes Obes Metab* 2007;9(6):902-13 · **PMID 17924873** · DOI 10.1111/j.1463-1326.2007.00804.x | **80-110 mg/dL (0,80-1,10 g/L)** | Sur la **moyenne des 3 GAJ précédentes** : **> 110 mg/dL → +3 U** | **⭐ La plus explicite : moyenne des 3 GAJ < 80 mg/dL (0,80 g/L) → −3 U.** Entre 80 et 110 : pas de changement. **Tous les 3 jours** | **Patient** (bras 1) vs médecin « standard of care » (bras 2) | Bras patient supérieur au bras médecin sur l'HbA1c (substitut) | **[S×2]** primaire payant |
| **ATLAS** — Garg, *Endocr Pract* 2015;21(2):143-57 · **PMID 25297660** | **110 mg/dL (1,10 g/L)** | **Même algorithme dans les deux bras** (non détaillé par les sources ouvertes) | **NON RAPPORTÉE** | **Patient (n=275) vs médecin (n=277)**, randomisé | **HbA1c < 7 % SANS hypoglycémie sévère : 40,0 % (patient) vs 32,9 % (médecin), p = 0,086** → ARD 7,1 pp, **NNT ≈ 14 · 24 sem**, **NON significatif**. **Hypo sévère 0,7 % dans les deux bras (DUR, aucune différence)**. Dose 28,9 vs 22,2 U (p < 0,001) ; ΔFBG −2,85 vs −2,48 mmol/L (p = 0,001) | **[S]** primaire 403 |

### 3.2 Les autres algorithmes qui, eux, **tabulent** la descente (matériel décisionnel)

Extraits de **Patel D, Triplitt C, Trujillo J.** *Appropriate Titration of Basal Insulin in Type 2
Diabetes and the Potential Role of the Pharmacist.* **Adv Ther 2019;36(5):1031-1051 · PMID 30900198 ·
PMC6824379** *(ouvert et lu)* — Tables 2, 3 et 4 ; recoupés quand possible avec **Chun J, Strong J,
Urquhart S.** *Insulin Initiation and Titration in Patients With Type 2 Diabetes.* **Diabetes Spectr
2019;32(2):104-111 · PMID 31168280 · PMC6528396** *(ouvert et lu)*.

| Algorithme | Cible GAJ | Montée | **DESCENTE** | Fréquence |
|---|---|---|---|---|
| **Programme BEGIN** (Gough 2013 · Meneghini 2013 « FLEX » · Onishi 2013 · Zinman 2013) | **70-90 mg/dL (0,70-0,90 g/L)** | 90-125 → +2 U ; 126-143 → +4 U ; 144-161 → +6 U ; ≥ 162 → +8 U | **< 56 mg/dL (0,56) → −4 U ; 56-69 mg/dL (0,56-0,69) → −2 U** ; 70-89 → pas de changement. Sur la **moyenne (ou la plus basse) des 3 GAJ consécutives** | Hebdomadaire |
| **BEGIN EASY AM/PM** (Zinman 2013, bras degludec) | 70-90 mg/dL | +4 / +8 / +12 / +16 U | **< 56 → −8 U ; 56-69 → −4 U** (pas doublé dans les deux sens) | Hebdomadaire |
| **EDITION 3** (Bolli 2015, glargine U300) | **80-100 mg/dL (0,80-1,00)** | > 100 et < 140 → +3 U ; ≥ 140 → +6 U | **≥ 60 et < 80 mg/dL → −3 U** ; **< 60 mg/dL, ou hypoglycémie sévère, ou hypoglycémies symptomatiques multiples → −3 U ou plus, à la discrétion de l'investigateur** | Hebdomadaire |
| **TITRATE** (Blonde 2009, détémir ; **2 cibles randomisées**) | **70-90** *vs* **80-110 mg/dL** | > cible → **+3 U** | **< 3,9 mmol/L (0,70 g/L) → −3 U** | **Tous les 3 jours**, patient |
| **GOAL A1C** (Kennedy 2006) | 70-100 mg/dL | ≥ 100-<120 → 0-2 U … ≥ 180 → +8 U | **< 70 mg/dL (0,70) → revenir à la dose antérieure, plus basse.** **Hypoglycémie sévère (< 36 mg/dL) → arrêt de toute majoration pendant 1 semaine** | Hebdomadaire |
| **LANCELOT** (Home 2015, PMC4282751 — *algorithme « sensible à l'hypoglycémie »*) | **80-100 mg/dL** (à jeun **et** nocturne) | GAJ > 5,5-≤ 7,8 et nocturne > 7,8 → +2 U ; les deux > 7,8 → +4 U | **Glycémie nocturne et/ou à jeun ≤ 4,4 mmol/L (0,79 g/L), OU hypoglycémie symptomatique → −2 U.** **Hypoglycémie sévère ou HbA1c ≤ 6,0 % → aucune majoration autorisée pour le reste de l'essai** | Hebdo puis bi-hebdo |
| **BEGIN: Once** (Philis-Tsimikas 2013 — *2 algorithmes patient comparés*) | ≥ 91 mg/dL | « Simple » : **+4 U** sur **une seule** GAJ · « Stepwise » : +2/+4/+6/+8 U sur la plus basse de 3 | « Simple » : **< 56 → −4 U** · « Stepwise » : **< 56 → −4 U ; 56-70 → −2 U** | Hebdomadaire, patient |
| **FPG GOAL** (Yang 2019 — voir §3.3) | **3 cibles randomisées**, plancher commun 3,9 mmol/L | > cible → **+2 U** | **⭐ FPG ≤ 3,9 mmol/L (0,70 g/L) OU hypoglycémie nocturne → −2 U, dans les trois bras**, sur **la plus basse des 3 dernières GAJ** | Hebdo (S1-S8) puis /2 sem |
| **ADA** (tel que tabulé par Patel 2019, Table 4) | **4,4-7,2 mmol/L (0,80-1,30 g/L)**, individualisée | +2-4 U ou +10-15 % | **« Réduire la dose de 4 U ou de 10-20 % de la dose totale quotidienne »** ; « pendant la titration, la dose doit être réduite si une hypoglycémie survient » | 1 à 2 ×/semaine |
| **AACE/ACE** (idem) | < 6,1 mmol/L (1,10 g/L) | +2 U (schéma fixe) ; +1 U à +20 % de la DTQ (schéma ajustable) | **« Réduire la dose totale quotidienne de 10-20 % si glycémie < 70 mg/dL ; de 20-40 % si < 40 mg/dL »** | Tous les 2-3 jours |
| **Synthèse soins premiers** — Mehta R, Goldenberg R, Katselnik D, Kuritzky L. *Ann Med* 2021;53(1):998-1009 · **PMID 34165382** · PMC8231382 *(ouvert et lu)* | **80-130 mg/dL (0,80-1,30 g/L)** (cible ADA) | +1 U/j (détémir, glargine U100) ou +2-4 U une à deux fois/sem ; « pas plus souvent que tous les 3-4 jours » pour les plus longues | **« Si une hypoglycémie survient (GAJ < 70 mg/dL [3,9 mmol/L]), le patient doit réduire la dose de basale de 2-4 unités ou de 10 % de la dose totale. »** · **« Si les épisodes se répètent (1-2 par semaine), le schéma de titration doit être revu. »** | — |

### 3.3 L'essai qui **randomise la cible** (le plus décisionnel du lot)

**FPG GOAL** — Yang W, Ma J, Yuan G, et al. *Determining the optimal fasting glucose target for patients
with type 2 diabetes: results of the multicentre, open-label, randomized-controlled FPG GOAL trial.*
**Diabetes Obes Metab 2019;21(8):1973-1977 · PMID 30938035 · DOI 10.1111/dom.13733** (PMC6772047,
**ouvert et lu**). Protocole publié : PMC5037905 (**ouvert et lu**, table de titration complète).

- **Design** : ECR ouvert, parallèle, treat-to-target, **24 semaines**, **n = 947** (885 complétés),
  DT2 chinois non contrôlés sous 1-3 ADO, HbA1c > 7 % à ≤ 10,5 %. Glargine U100, **0,2 U/kg/j** au départ.
- **Randomisation 1:3:3 sur la CIBLE de glycémie à jeun** : `3,9 < GAJ ≤ 5,6` (n=136) *vs*
  `3,9 < GAJ ≤ 6,1` (n=405) *vs* `3,9 < GAJ ≤ 7,0` mmol/L (n=406) — soit **≤ 1,01 / ≤ 1,10 / ≤ 1,26 g/L**,
  **plancher commun 0,70 g/L**.
- **Algorithme (identique dans les 3 bras, verbatim du protocole)** : décision sur **« la valeur la plus
  basse des 3 dernières GAJ consécutives »** ; **« ≤ 3,9 mmol/L ou hypoglycémie nocturne → −2 U »** ;
  dans l'intervalle cible → **« pas de changement »** ; au-dessus → **« +2 U »**.
- **Résultats (tous SUBSTITUTS)** :

| Critère (24 sem) | ≤ 5,6 | ≤ 6,1 | ≤ 7,0 | Effet absolu |
|---|---|---|---|---|
| **HbA1c < 7 %** (primaire) | 44,4 % | **46,1 %** | 37,7 % | **≤ 6,1 vs ≤ 7,0 : ARD +8,4 pp, NNT ≈ 12** (p = 0,017) |
| Hypoglycémie **d'alerte** (≤ 3,9 mmol/L) | **38,9 %** | 27,5 % | 23,3 % | ≤ 5,6 vs ≤ 6,1 : **ARD +11,4 pp, NNH ≈ 9** · ≤ 6,1 vs ≤ 7,0 : ARD +4,2 pp, **NNH ≈ 24** |
| Hypoglycémie cliniquement importante (≤ 3,0 mmol/L) | 4,8 % | 2,0 % | 3,8 % | pas de gradient |
| **Hypoglycémie SÉVÈRE (DUR)** | 0 | **1 patient** | **1 patient** | **Aucun signal ; essai non dimensionné pour ce critère** |

- **Conclusion des auteurs** : « The optimal FBG target for most Chinese patients with T2D appears to be
  **3,9-6,1 mmol/L** » (= **0,70-1,10 g/L**).
- **GRADE : modéré** pour le substitut (ECR, randomisation de la cible, mais **ouvert**, population
  chinoise, 24 sem, **aucun critère dur**), **très faible** pour toute inférence sur les critères durs.
- *Réplication à petite échelle* : Yuan L, et al. *J Diabetes Res* 2021;2021:5524313 · **PMID 34337072** ·
  PMC8294995 (n = 71, mêmes 3 cibles, ±1-2 U) — même conclusion (6,1 mmol/L), effectif trop faible pour
  conclure seul.
- **⚠ Discordance à signaler** : **Wolters J, Wollenhaupt D, Abd El Aziz M, Nauck MA.** *Impact of the
  Fasting Plasma Glucose Titration Target on the Success of Basal Insulin Titration…: A Systematic
  Analysis.* **J Diabetes Res 2022;2022:4758042 · PMID 35942330** (PMC9356801, ouvert) — **43 essais,
  17 643 patients**, comparaison **entre bras d'essais différents** (donc **écologique, non
  randomisée**) : cibles plus basses → meilleur contrôle (HbA1c ≤ 6,5 % chez **33,4 %** vs **18,7 %**,
  ARD 14,7 pp) **« sans augmenter le risque d'hypoglycémie »** (hypo symptomatique 41,3 % vs 49,4 %).
  **Conclusion opposée à FPG GOAL sur l'hypoglycémie.** La comparaison **randomisée** (FPG GOAL) doit
  primer sur la comparaison **inter-essais** (Wolters), confondue par tout ce qui distingue les
  populations et les époques. **GRADE : faible** pour Wolters.

### 3.4 Comparaisons tête-à-tête d'algorithmes

| Comparaison | Réf. | Résultat | Portée |
|---|---|---|---|
| **Patient vs médecin**, même algorithme | **ATLAS** (Garg 2015, PMID 25297660) | HbA1c < 7 % sans hypo sévère **40,0 % vs 32,9 %** (NS, p = 0,086) ; hypo sévère **0,7 % vs 0,7 % (DUR)** | Le patient titre **au moins aussi bien**, sans excès d'hypoglycémie sévère |
| **Patient vs clinique**, algorithmes différents | **AT.LANTUS** (Davies 2005) | Algo patient (+2 U/3 j) **supérieur** sur le contrôle ; hypo sévère **< 1 %** dans les deux bras | idem |
| **+1 U/jour vs +2 U/3 jours** | Li L, et al. *Patient Prefer Adherence* 2024;18:687-694 · **PMID 38524199** (PMC10959243, ouvert) | **n = 81, 4 semaines** : atteinte de la cible de GAJ **100 % vs 88,1 %** ; 0 vs 1 hypoglycémie ; dose 21,2 ± 4,3 vs 18,8 ± 6,7 U. **Aucune règle de descente dans le protocole** | **Trop petit et trop court** pour trancher ; critère = adhésion/GAJ. **GRADE : très faible** |
| **2 cibles de GAJ** (70-90 vs 80-110 mg/dL) | **TITRATE** (Blonde 2009) | Cible basse → plus de patients à l'HbA1c cible ; ±3 U/3 j patient | Corrobore le sens de FPG GOAL (substitut) |
| **Cible ≥ 100 mg/dL vs plus basse** | **Strange P.** *J Diabetes Sci Technol* 2007;1(4):540-548 · **PMID 19885117** · PMC2769634 (ouvert) | « … meilleur contrôle glycémique moyen avec **peu de risque d'hypoglycémie sévère, tant que la cible de glycémie du matin n'est pas inférieure à 100 mg/dL** » ; le taux d'hypoglycémie sévère **double** quand la cible passe de 100 à 90 mg/dL (donnée « GOT ») | Revue narrative ; le doublement cité est **[À VÉRIFIER]** (essai non identifié par moi) |

### 3.5 GRADE par corps de preuve

| Corps de preuve | Critère | GRADE |
|---|---|---|
| **La titration treat-to-target de la basale sur la GAJ abaisse l'HbA1c en soins primaires** | SUBSTITUT (HbA1c, GAJ, % à la cible) | **modéré** — nombreux ECR concordants, effet reproductible, mais tous ouverts et tous sur substituts |
| **La titration menée par le patient vaut celle menée par le médecin** | SUBSTITUT + hypo sévère (DUR) | **modéré** (ATLAS randomisé, AT.LANTUS ; hypo sévère identique et rare) |
| **Le choix de la CIBLE de GAJ arbitre contrôle vs hypoglycémie** | SUBSTITUT | **modéré** (FPG GOAL, randomisation de la cible) ; **discordance** avec l'analyse écologique de Wolters |
| **La RÈGLE DE DESCENTE elle-même** | — | **très faible / accord d'experts.** **Aucun essai n'a jamais randomisé une règle de descente** : dans tous les protocoles ci-dessus, la descente est une **clause de sécurité** appliquée identiquement à tous les bras, jamais un objet de comparaison. Sa **direction** est unanime, ses **seuils et ses pas divergent** (§7-1) |
| **Un plafond de dose fondé sur les preuves** | — | **inexistant** (§4) |
| **Un schéma de titration modifié par l'âge** | — | **inexistant en randomisé** ; cibles relevées = **accord d'experts** gradé C/E (§5) |

---

## 4. Le plafond

### 4.1 Ce qui a déjà été instruit et n'est pas rouvert

Le repère **0,5 U/kg/j** : généalogie, grade E, post-hoc Umpierrez 2019 non pré-spécifié (N=458),
retrait des Standards ADA en 2025, maintien AACE, absence d'essai de stratégie, analyse intra-patient de
Reid 2016. **Arbitrage rendu le 2026-07-27** (le seuil n'est **pas** une exclusion dure ; il reste
**déclencheur** de « Ne pas sur-titrer la basale »). **Rien ici ne le rouvre.**

### 4.2 Ce que cette collecte a cherché à côté — et ce qu'elle trouve

| Candidat de plafond | Source | Statut réel |
|---|---|---|
| **Aucune dose maximale** | **ADA Standards of Care 2026, §9** (*Diabetes Care* 2026;49(Suppl 1):S183-S215 · **PMID 41358900** · PMC12690185, **relu ici**) | **Confirmé : le document ne fixe aucune dose maximale de basale et aucun critère chiffré d'arrêt de titration.** Il ne donne d'ailleurs **aucune cible chiffrée de glycémie à jeun** pour la titration. Les signaux de sur-basalisation (rec. **9.26, grade E**) restent : différentiel coucher-réveil, hypoglycémie, variabilité |
| **« Aucune donnée éligible »** | **Luo Y, et al.** *J Diabetes* 2023;15(5):419-435 · **PMID 37038616** (relu au chantier précédent) | **« There is no eligible evidence to investigate the optimal maintenance dose for basal insulins. »** Doses d'entretien réellement atteintes à la cible : **0,19-0,78 U/kg/j** selon l'insuline |
| **0,5-1,0 U/kg/j** | **Mehta 2021**, *Ann Med* 53(1):998-1009 · **PMID 34165382** (ouvert, lu) | « La dose de basale doit être augmentée autant que nécessaire **jusqu'à environ 0,5-1,0 U/kg/j dans certains cas** » ; réévaluer au-delà. **Avis d'experts, fourchette deux fois plus large que le repère de 0,5** |
| **> 150 U/j** | **Home PD**, *Diabetes Obes Metab* 2025 · **PMID 40035222** · PMC12169081 (ouvert, lu) | « lorsque le contrôle pré-petit-déjeuner ne peut être atteint **malgré des doses de basale poussées à des niveaux élevés (> 150 U/j)** […] cela demande davantage d'expertise ». **Borne ABSOLUE de compétence, pas pondérale, avis d'experts** |
| **60 U/j · 50 U** | LixiLan-L ; DUAL II/V | **Plafonds opérationnels de protocole**, pas des résultats — ils bornent le comparateur, ils ne testent rien |
| **La cible de GAJ comme plafond fonctionnel** | **FPG GOAL** (§3.3) | ⭐ **Le seul « plafond » adossé à une randomisation.** Ce n'est pas une dose : c'est le fait que **la titration s'arrête quand la GAJ entre dans l'intervalle cible**. FPG GOAL montre que **le choix de l'intervalle** (et non la dose atteinte) arbitre contrôle vs hypoglycémie. C'est aussi la définition « clinique » de Davidson déjà retenue par le nœud |

### 4.3 Réponse du §4

**Non : il n'existe aucune borne de dose fondée sur les preuves, ni pondérale ni absolue.** Toutes les
valeurs en circulation (0,5 · 0,5-1,0 · 150 U/j) sont des **avis d'experts** ou des **plafonds de
protocole** ; la seule revue systématique dédiée conclut à l'**absence de donnée éligible** ; l'ADA 2026
n'en fixe aucune. **Le seul point d'arrêt randomisé est la cible de glycémie à jeun elle-même** — et
c'est déjà, sous une autre forme, ce que le nœud encode (`gaj_a_cible` → « Ne pas sur-titrer »).

### 4.4 ⚠ Correction factuelle au dossier du 2026-07-27 — **qui ne rouvre pas l'arbitrage**

Le rapport `preuve-sur-basalisation.md` (§2.5, §6-10, §7 et P4) et son red-team (§6 « Question 6 »)
concluent tous deux que l'attribution « **SFD** » du seuil de 0,5 U/kg était **erronée**, sur une
**recherche négative** — le red-team précisant lui-même la cause : « *Prise de position SFD 2025, PDF
officiel — téléchargé mais **flux PDF compressé non extractible** par l'outil de lecture* » (§7-4).

**Le PDF local a été extrait ici (`pdftotext -layout -enc UTF-8`), et la SFD 2025 porte bien le seuil**,
**Avis n° 19**, verbatim :

> « … **malgré de fortes doses d'insuline basale, c'est-à-dire plus de 0,5 U/kg/j** … »

**Ce que ça change / ce que ça ne change pas.**

- **Ça corrige** : (a) la proposition **P4** du rapport (« aucune source SFD n'a été retrouvée » →
  **fausse**) ; (b) la phrase affichée à l'utilisateur dans `insuline.yaml` (l. 595), « *retiré des
  Standards ADA en 2025 mais **reste retenu par l'AACE*** », qui est **incomplète** : il est aussi
  retenu par la **SFD 2025**, c'est-à-dire par la **reco française de référence du nœud** ;
  (c) le champ `incertitudes` du YAML, qui pourra de nouveau citer la SFD **avec la référence exacte**.
- **Ça ne change pas l'arbitrage.** Celui-ci ne reposait pas sur le *nombre* de sociétés savantes mais
  sur le **niveau de preuve** (grade E, post-hoc non pré-spécifié) et sur l'**absence d'essai de
  stratégie** — deux constats intacts. Ajouter la SFD ajoute un **troisième porteur d'accord
  d'experts**, pas une donnée. Le seuil reste ce qu'il est : un **repère discuté**, déclencheur d'une
  option concurrente, jamais une interdiction. **Effet secondaire notable** : l'usage SFD est
  **exactement** celui-là — « l'avis d'un endocrinologue-diabétologue est souhaitable », pas « ne pas
  titrer ». C'est **plus proche** de ce que fait le nœud que ne l'était l'attribution ADA.

---

## 5. Le sujet âgé / fragile

### 5.1 Ce qui existe en randomisé

| Étude | Ce qu'elle est | Ce qu'elle montre | Ce qu'elle **ne** montre **pas** |
|---|---|---|---|
| **SENIOR** — Ritzel R, et al. *Diabetes Care* 2018;41(8):1672-1680 · **PMID 29895556** · DOI 10.2337/dc18-0168 (abstract lu via Europe PMC) | **ECR dédié aux ≥ 65 ans**, ouvert, 2 bras parallèles, **n = 1 014**, âge moyen **71 ans**, **~20 % de ≥ 75 ans** | ⭐ **La titration y visait une glycémie à jeun auto-mesurée de 5,0-7,2 mmol/L, soit 0,90-1,30 g/L** — cible **volontairement relevée** par rapport aux ECR antérieurs, alignée sur la cible ADA du sujet âgé « en bonne santé ». Contrôle glycémique comparable entre les deux insulines ; **hypoglycémie symptomatique documentée (≤ 3,9 mmol/L) 1,12 vs 2,71 événements/patient-an, RR 0,45 (IC 95 % 0,25-0,83)** en faveur de la glargine U300, « particulièrement chez les ≥ 75 ans » — **SUBSTITUT** | **La cible n'a PAS été randomisée** : les deux bras l'utilisaient. SENIOR compare **des molécules**, pas des cibles ni des rythmes. Elle établit qu'une cible relevée est **praticable et sûre** chez l'âgé, **pas** qu'elle vaut mieux qu'une cible serrée |
| **TOP** (Titration and Optimization) — **Fritsche A, et al.** *BMJ Open Diab Res Care* 2019;7(1):e000668 · **PMID 31423316** · DOI 10.1136/bmjdrc-2019-000668 · PMC6688703 (**ouvert et lu**) | **Registre prospectif observationnel**, Allemagne, glargine U100 ; **sous-analyse post hoc par âge** : < 65 (n=1 122) · 65-74 (n=771) · **≥ 75 (n=569)** ; **12 mois** | En **pratique réelle**, les ≥ 75 ans sont titrés **moins vite** : **+8,8 U/j** contre +11,6 U/j chez les < 65 (mais **+0,11 vs +0,13 U/kg, non significativement différent**). Résultats : ΔHbA1c **−1,22 %** (≥ 75) vs −1,47 % (< 65) ; **atteinte de la cible d'HbA1c 54,7 % (≥ 75) vs 46,0 % (< 65)**. **Hypoglycémie symptomatique 3,4 % (≥ 75) vs 1,4 % (< 65) → ARD 2,0 pp, NNH ≈ 50 sur 12 mois — SUBSTITUT, observationnel** | **Post hoc, non randomisé, non contrôlé.** L'algorithme **ne différait pas** par l'âge : c'est le **comportement des médecins** qui différait. Aucune inférence causale possible |
| **Munshi MN, et al.** *Simplification of Insulin Regimen in Older Adults and Risk of Hypoglycemia.* **JAMA Intern Med 2016;176(7):1023-1025 · PMID 27273335 · DOI 10.1001/jamainternmed.2016.2288** | **Lettre de recherche**, effectif restreint, **non randomisée** (avant/après) | Simplification d'un schéma complexe vers une glargine quotidienne ± non-insulines, avec MCG | **Ne fournit ni cible, ni pas, ni intervalle de titration validés** ; texte intégral non ouvert (**[À VÉRIFIER]**) |

### 5.2 Ce qui existe en accord d'experts — et qui converge

| Source | Cible de glycémie **à jeun / préprandiale** chez l'âgé | Grade affiché |
|---|---|---|
| **ADA 2026, §13 Older Adults** (*Diabetes Care* 2026;49(Suppl 1):S277-… · PMC12690186, **lu**), **Table 13.2** | **En bonne santé : 80-130 mg/dL (0,80-1,30 g/L)** · **complexe/intermédiaire : 90-150 mg/dL (0,90-1,50 g/L)** · **très complexe / mauvaise santé : 100-180 mg/dL (1,00-1,80 g/L)** | **C** (rec. 13.7a-c) |
| **ADA 2026, §13** — désintensification | « **Désintensifier** les médicaments hypoglycémiants (insuline, sulfamides, glinides) […] chez les personnes à haut risque d'hypoglycémie » | **B** (13.14a) |
| **ADA 2026, §13** — simplification | « **Simplifier** les schémas complexes (en particulier l'insuline) pour réduire le risque d'hypoglycémie, la polymédication et le fardeau du traitement » | **B** (13.14c) · « désintensifier quand le fardeau dépasse le bénéfice » = **E** (13.14b) |
| **SFD 2025, Avis 21** | **Fragile / dépendant : glycémies capillaires préprandiales entre 1 et 2 g/L**, HbA1c < 9 %, **> 7,5 % si insuline** | Prise de position d'experts (**pas d'échelle de grade**) ; appui cité = **GERODIAB**, observationnel |
| **HAS 2024** | Aucune cible glycémique chiffrée pour l'âgé (R.87 renvoie à l'objectif d'HbA1c personnalisé). **R.103** : « éviter le **surtraitement** ; une **désintensification** peut être proposée » · **R.104** : insuline si les autres traitements sont impossibles, recours à une tierce personne / MCG · **R.105** : si l'écart à l'objectif est **< 0,5 % d'HbA1c**, l'**absence de traitement médicamenteux** peut être envisagée | **AE** (accord d'experts) pour les trois |
| **ebmfrance** | « Un niveau cible **plus élevé** peut être justifié si le patient a des **hypoglycémies sévères récurrentes**, une **espérance de vie limitée**, une **altération des fonctions cognitives / réduction de la capacité fonctionnelle**, des complications vasculaires graves, d'autres maladies systémiques graves » — **exprimé en HbA1c, pas en glycémie à jeun** | Non gradé |

### 5.3 Ce qui n'existe pas

- **Aucun essai, aucun sous-groupe pré-spécifié**, n'a testé un **pas de titration plus petit**
  (p. ex. +1 U au lieu de +2 U) chez le sujet âgé.
- **Aucun essai** n'a testé un **intervalle plus long** (p. ex. tous les 7 jours au lieu de tous les
  3 jours) chez le sujet âgé. Recherche menée sur les essais de titration eux-mêmes (Riddle, AT.LANTUS,
  INSIGHT, LANMET, PREDICTIVE 303, ATLAS, TITRATE, BEGIN, EDITION, FPG GOAL) : **aucun** ne stratifie ni
  ne modifie son algorithme selon l'âge. Le seul essai comparant deux **rythmes** (+1 U/j vs +2 U/3 j,
  Li 2024, PMID 38524199) **excluait les > 75 ans** (18-75 ans).
- **Aucun essai** n'a **randomisé** une cible de glycémie à jeun relevée chez l'âgé. FPG GOAL, le seul
  essai qui randomise la cible, n'a **pas** de sous-groupe d'âge rapporté.
- **Aucune donnée sur critère DUR** (hypoglycémie sévère, mortalité) ne soutient une modulation de la
  titration par l'âge : SENIOR rapporte l'hypoglycémie **symptomatique** (substitut) ; TOP est
  observationnel.

### 5.4 Réponse du §5, en une phrase

**Accord d'experts seulement — mais un accord d'experts convergent, gradé, et portant sur la CIBLE, pas
sur le pas ni sur le rythme.** Quatre sources indépendantes (ADA grade C, SFD, HAS, ebmfrance) relèvent
la cible chez le sujet âgé/fragile ; **une seule donnée randomisée** (SENIOR) montre qu'une cible
relevée à **0,90-1,30 g/L** est praticable et sûre chez les ≥ 65 ans — sans la comparer à une cible
serrée. **Le pas (+2 U) et l'intervalle (3 jours) ne sont modulés par l'âge dans aucune source, ni
EBM ni experte.**

---

## 6. Recommandations — françaises et internationales, séparées

### 6.1 Françaises

| Source | Cible GAJ | Montée | **Descente** | Rythme | Plafond | Sujet âgé | Statut de preuve |
|---|---|---|---|---|---|---|---|
| **HAS 2024** R.87 | **Aucune valeur chiffrée** — dérivée de l'objectif d'HbA1c personnalisé | **± 1 ou 2 UI** | **± 1 ou 2 UI** *(énoncé symétrique, aucun seuil bas)* | **Tous les 3 jours** | Aucun. R.86 : recours au spécialiste si difficulté | R.103 surtraitement / désintensification · R.105 arrêt possible si écart < 0,5 % | **AE** (accord d'experts) |
| **SFD 2025** Avis 18 · 19 · 21 | **0,80-1,30 g/L** (pour viser HbA1c < 7 %) | **+2 U**, ou **+10 %** si dose **> 40 U/j** | **−2 U**, ou **−10 %** si dose > 40 U/j *(aucun seuil bas de glycémie)* | **Tous les 3 jours** | **> 0,5 U/kg/j → avis endocrinologue + MCG** (Avis 19) | Avis 21 : **préprandial 1-2 g/L** si fragile/dépendant, HbA1c < 9 % et **> 7,5 % sous insuline** | Prise de position d'experts, **non gradée** |
| **ebmfrance / Duodecim** | **4,0-6,0 mmol/L (0,72-1,08 g/L)** *(⚠ 5,0-6,0 dans un autre passage de la même fiche)* | **+2 U** si GAJ **> 6,0 mmol/L 3 matins consécutifs** | ⭐ **GAJ < 4,0 mmol/L (0,72 g/L) : 1 fois sur 3 → rien ; plus souvent → −2 U.** **Hypoglycémie symptomatique → −4 U.** Hypoglycémies récurrentes → contacter le centre | Auto-ajustement continu ; surveillance hebdomadaire une fois stabilisé | Aucun (dose « 10 à 200 unités », moyenne 70 U sous un seul ADO) | Cible d'HbA1c relevée si hypo sévères récurrentes, EV limitée, troubles cognitifs, complications graves | Guide de pratique ; le grade **B** de la fiche porte sur d'**autres** énoncés, pas sur l'algorithme |
| **Prescrire** | — | — | — | — | — | — | **Ne traite pas la titration** (résultat négatif, §2.4) |
| **CMG** (Collège de la Médecine Générale) | — | — | — | — | — | — | **Recherche négative** : aucune position CMG dédiée à l'insulinothérapie ou à sa titration retrouvée. *(Confirme le constat de `E-insuline.md` §5b-4 ; le fichier local `mmm_referentielmcg_ep11.pdf` n'est pas une source CMG.)* |

**Convergence française** : les trois sources qui donnent un algorithme (HAS, SFD, ebmfrance)
s'accordent sur **le rythme (3 jours ou 3 matins) et sur le pas (2 U)**, et **les trois énoncent la
descente**. Elles **divergent sur la cible** (aucune / 0,80-1,30 / 0,72-1,08) et **seule ebmfrance donne
un seuil bas de glycémie et un compte d'occurrences**.

### 6.2 Internationales

| Source | Cible GAJ | Montée | **Descente** | Plafond | Sujet âgé |
|---|---|---|---|---|---|
| **ADA Standards 2026, §9** (PMC12690185, **relu**) | **Aucune valeur chiffrée dans la section 9** | Dose initiale 0,1-0,2 U/kg/j ; pas de pas chiffré dans les recommandations numérotées | Aucune recommandation numérotée de réduction de dose ; « il faut envisager de **diminuer la basale** pour réduire le risque d'hypoglycémie » | **Aucune dose maximale.** Rec. **9.26 (E)** : signaux de sur-basalisation = différentiel coucher-réveil, hypoglycémie, variabilité | Renvoi au §13 |
| **ADA — figure de titration** telle que tabulée par **Patel 2019** (PMC6824379) | **4,4-7,2 mmol/L (0,80-1,30 g/L)** | +2-4 U ou +10-15 %, 1-2 ×/sem | **−4 U ou −10-20 % de la dose totale** | Intensifier si GAJ ≥ 300 mg/dL ou HbA1c ≥ 10 % | — |
| **ADA Standards 2026, §13** (PMC12690186, **lu**) | **0,80-1,30 / 0,90-1,50 / 1,00-1,80 g/L** selon l'état de santé (**grade C**) | — | **Désintensifier (B)** · **simplifier (B)** | — | Cf. §5.2 |
| **AACE/ACE** (via Patel 2019) | < 1,10 g/L | +2 U (fixe) ou +1 U à +20 % de la DTQ (ajustable), tous les 2-3 j | **−10-20 % de la DTQ si glycémie < 70 mg/dL ; −20-40 % si < 40 mg/dL** | Maintient **0,5 U/kg** (cf. arbitrage 2026-07-27) | — |
| **IDF** (via Patel 2019) | < 1,15 g/L | +2 U tous les 3 jours | Non spécifiée | Non spécifié | — |

**Divergence internationale à afficher** : **l'ADA 2026 ne chiffre plus rien** (ni cible de GAJ, ni pas,
ni plafond) dans ses recommandations numérotées, là où **AACE, IDF et les recos françaises chiffrent**.
La règle de descente la plus « dure » est celle de l'**AACE** (−10-40 % de la dose totale), la plus
graduée celle d'**ebmfrance** (rien / −2 U / −4 U selon la fréquence et le caractère symptomatique).

---

## 7. Réponse aux trois volets

### 7.1 Volet 1 — LA RÈGLE DE DESCENTE

**Ce qui est DÉMONTRÉ** *(c'est-à-dire testé contre un comparateur)* : **rien.** **Aucun essai n'a jamais
randomisé une règle de descente.** Dans les onze protocoles lus, la descente est une **clause de sécurité
appliquée à l'identique dans tous les bras** ; elle n'a jamais été l'objet de la comparaison. Ce qui est
démontré, c'est que **des algorithmes contenant une règle de descente atteignent la cible avec un taux
d'hypoglycémie sévère très bas** (ATLAS 0,7 % ; AT.LANTUS < 1 % ; FPG GOAL 1 patient/bras) — mais le
mérite ne peut pas être attribué à la descente en particulier.

**Ce qui est un ACCORD D'EXPERTS, unanime sur la direction, divergent sur les chiffres** :

| Question | Réponses trouvées | Ce que ça donne |
|---|---|---|
| **Quelle valeur ?** | **0,70 g/L (3,9 mmol/L)** : FPG GOAL (protocole), TITRATE, Mehta 2021, GOAL A1C · **0,72 g/L (4,0 mmol/L)** : **ebmfrance**, Riddle (*hold*) · **0,79 g/L (4,4 mmol/L)** : LANCELOT · **0,80 g/L** : **PREDICTIVE 303**, EDITION 3 · **0,56 g/L (3,1 mmol/L)** : Riddle (*réduction*), programme BEGIN | **Faisceau serré autour de 0,70-0,80 g/L** pour déclencher la descente. La borne basse actuelle du nœud (**0,70 g/L**) est **la valeur la plus fréquemment retenue**, et le plancher commun des trois bras de FPG GOAL |
| **Combien d'occurrences ?** | ⭐ **ebmfrance : 1 fois sur 3 → rien ; plus fréquemment → agir** · **FPG GOAL : la plus BASSE des 3 dernières GAJ → agir dès la première** · **BEGIN : la plus basse des 3** · **PREDICTIVE 303 : la MOYENNE des 3** · **Riddle : une seule valeur basse dans la semaine suffit à SUSPENDRE la montée** · **Mehta 2021 : 1-2 épisodes/semaine → revoir le schéma** | **Vraie divergence.** Deux écoles : « **une seule suffit** » (FPG GOAL, BEGIN, Riddle pour le *hold*) et « **il en faut plus d'une sur trois** » (ebmfrance). **Point à trancher par le référent, pas par moi (§9-2)** — et c'est exactement la question laissée ouverte par la vignette V-A1 |
| **De combien ?** | **−2 U** : ebmfrance, SFD, FPG GOAL, LANCELOT, BEGIN (bande haute) · **−1 à −2 UI** : HAS · **−3 U** : PREDICTIVE 303, TITRATE, EDITION 3 · **−4 U** : ebmfrance (*si symptomatique*), BEGIN (bande basse), ADA · **−10 %** : SFD si dose > 40 U/j · **−10-20 % de la DTQ** : ADA, AACE, Mehta 2021 · **−20-40 %** : AACE si < 40 mg/dL | **Convergence : −2 à −4 U, ou −10-20 % si la dose est forte.** **C'est exactement ce que le nœud affiche déjà** (« −2 à −4 U ou −10-20 % ») — **confirmé, aucune correction nécessaire** |
| **Gradation ?** | ebmfrance (rien / −2 / −4), BEGIN (−2 / −4), AACE (−10-20 % / −20-40 %), EDITION 3 (−3 / −3 ou plus) | La **gradation par la profondeur ou le caractère symptomatique** de l'hypoglycémie est le motif le plus constant |

**Deux règles de descente sont directement transposables telles quelles, et elles sont dans le dépôt** :

> **ebmfrance** (le plus adapté au capillaire en MG) : *GAJ < 0,72 g/L — 1 fois sur 3 : ne rien changer ;
> plus souvent : −2 U ; hypoglycémie symptomatique : −4 U ; hypoglycémies récurrentes : recours.*
>
> **SFD 2025 Avis 18** (déjà la source réelle de la montée encodée) : *tous les 3 jours, ± 2 U — ou
> ± 10 % au-delà de 40 U/j.* Symétrique, sans seuil bas.

**GRADE du corps de preuve « règle de descente » : très faible (accord d'experts).** À afficher comme
tel, jamais comme un algorithme validé.

### 7.2 Volet 2 — LE PLAFOND

- **DÉMONTRÉ : rien.** Aucun essai n'a testé « plafonner puis intensifier autrement » contre « continuer
  à titrer ». La revue systématique dédiée conclut à l'**absence de donnée éligible** (Luo 2023).
- **ACCORD D'EXPERTS, divergent** : **0,5 U/kg/j** (AACE ; **et SFD 2025 Avis 19 — §4.4** ; **retiré par
  l'ADA en 2025**) · **0,5-1,0 U/kg/j** (Mehta 2021) · **> 150 U/j** (Home 2025, borne de compétence).
- **INEXISTANT** : toute autre borne fondée sur les preuves. **Rien de nouveau n'a été trouvé** qui
  puisse remplacer ou renforcer le repère déjà arbitré.
- **Le seul point d'arrêt adossé à une randomisation est la CIBLE de glycémie à jeun** (FPG GOAL) : une
  fois la GAJ dans l'intervalle, monter la basale ne fait plus qu'échanger de l'hypoglycémie contre rien.
  **C'est déjà le mécanisme du nœud** (`gaj_a_cible` → « Ne pas sur-titrer la basale »). Cette collecte
  **conforte** cette modélisation ; elle n'en propose pas d'autre.

### 7.3 Volet 3 — LE SUJET ÂGÉ / FRAGILE

- **Pas de titration plus petit** → **INEXISTANT**. Aucun essai, aucun sous-groupe pré-spécifié, aucune
  recommandation. Le seul essai comparant deux pas excluait les > 75 ans.
- **Intervalle plus long** → **INEXISTANT**. Aucune source, EBM ou experte, ne module le rythme par l'âge.
  *(En pratique réelle, TOP montre que les médecins titrent moins **vite** chez les ≥ 75 ans — c'est un
  comportement observé, pas une recommandation, et le résultat est ambigu : même atteinte de cible,
  **plus** d'hypoglycémie symptomatique.)*
- **Cible de glycémie à jeun plus haute** → **ACCORD D'EXPERTS, convergent et gradé** : ADA 2026
  Table 13.2 (**grade C**) 0,80-1,30 → 0,90-1,50 → 1,00-1,80 g/L selon l'état de santé ; SFD Avis 21
  **1-2 g/L en préprandial** chez le fragile/dépendant ; HAS R.103/R.105 (**AE**) ; ebmfrance (cible
  d'HbA1c relevée). **Un seul appui randomisé, indirect** : SENIOR (n=1 014, ≥ 65 ans) a **utilisé** une
  cible relevée de **0,90-1,30 g/L** sans la comparer à une cible serrée.
- **Réponse franche** : **« accord d'experts seulement »**, et c'est un résultat, pas un échec. Mais
  l'accord est **unanime, gradé C/AE, et porte spécifiquement sur la CIBLE**. **Il n'autorise pas** à
  écrire dans le nœud que l'on titre « plus lentement » chez l'âgé — cette phrase n'a **aucune source**.

---

## 8. `[À VÉRIFIER]`

1. **`[À VÉRIFIER — primaire 403]` Riddle 2003, règle exacte de descente.** Les deux jambes (*hold* si
   glycémie < 72 mg/dL dans la semaine ; *réduction* si hypoglycémie sévère ou glycémie < 56 mg/dL,
   −2 à −4 U/j) proviennent de **deux sources secondaires ouvertes et concordantes** (Patel 2019
   PMC6824379, ligne « Dailey 2014 » ; et une reformulation indépendante de l'algorithme retrouvée en
   recherche : « in the absence of plasma glucose < 4,0 mmol/L (< 72 mg/dL) »). Le PDF éditeur renvoie
   **403** ; aucun contournement de paywall tenté (invariant 7). **À faire confirmer par le référent
   s'il a accès au texte intégral.**
2. **`[À VÉRIFIER]` AT.LANTUS — inversion des libellés Algorithme 1 / Algorithme 2 entre deux revues.**
   Patel 2019 attribue les incréments **+6-8 U hebdomadaires** à l'**Algorithme 1 (clinique)** et
   **+2 U tous les 3 jours** à l'**Algorithme 2 (patient)** ; **Chun 2019 les intervertit**. Le design
   publié (algorithme piloté par la clinique, à incréments plus larges, vs algorithme patient à pas
   fixe) rend **Patel plus plausible**, mais le primaire est en 403. **Ne rien encoder de cette
   ligne tant qu'elle n'est pas tranchée.**
3. **`[À VÉRIFIER — non rapportée]` Règles de descente d'AT.LANTUS, INSIGHT, LANMET et ATLAS.** Les
   sources ouvertes ne les rapportent pas. **Silence des revues ≠ absence dans le protocole** : à ne pas
   présenter comme « ces essais n'avaient pas de règle de descente ».
4. **`[À VÉRIFIER]` PREDICTIVE 303 (−3 U si moyenne des 3 GAJ < 80 mg/dL)** — deux revues ouvertes
   concordantes ; primaire payant (*Diabetes Obes Metab* 2007, PMID **17924873**).
5. **`[À VÉRIFIER]` FPG GOAL / protocole.** Le protocole ouvert (PMC5037905) porte, dans le texte extrait,
   le sigle **« BEYOND III »** ; les trois cibles (≤ 5,6 / ≤ 6,1 / ≤ 7,0 mmol/L), le plancher 3,9 et le
   ratio de randomisation **1:3:3** sont **identiques** à FPG GOAL. **Très probablement le même essai
   sous un autre sigle de programme, non confirmé.**
6. **`[À VÉRIFIER]` Strange 2007** : « le taux d'hypoglycémie sévère **double** quand la cible passe de
   100 à 90 mg/dL » (donnée attribuée à un essai « GOT » que je n'ai pas identifié). **Chiffre
   décisionnel s'il était confirmé** — il donnerait la première quantification d'un coût de sécurité à
   abaisser la cible sur un **critère DUR**.
7. **`[À VÉRIFIER]` Chiffres d'hypoglycémie du tableau de Strange 2007** (Riddle 2,5 /pt-an ; AT.LANTUS
   0,9 et 1,1 /pt-an) : la colonne est intitulée « severe hypoglycemia » mais ces valeurs sont
   incompatibles avec les « < 1 % » rapportés par l'abstract d'AT.LANTUS — **probable confusion de
   colonne**. Non repris dans le corps de cette note.
8. **`[À VÉRIFIER]` ADA — figure de titration et règle « −4 U ou −10-20 % »** : lue **via Patel 2019
   (Table 4)**, pas dans le texte 2026 de l'ADA §9, qui ne la contient pas sous forme de recommandation
   numérotée. **Ne pas attribuer ce chiffre à « ADA 2026 » sans avoir ouvert la figure.**
9. **`[À VÉRIFIER]` AACE 2023/2026** : `endocrinepractice.org` en **403** (déjà constaté au chantier du
   2026-07-27). Les règles AACE citées ici viennent de Patel 2019.
10. **`[À VÉRIFIER]` Munshi 2016** : texte intégral non ouvert ; classé « clinical trial » par PubMed mais
    publié comme **lettre de recherche**. Ne rien en tirer de chiffré.
11. **`[À VÉRIFIER]` ebmfrance — incohérence interne de la borne basse** (4,0 mmol/L p. 4 et p. 7 ;
    5,0 mmol/L p. 5). Point à signaler au référent : **quelle borne basse la fiche entend-elle
    réellement ?** Cela n'affecte pas la règle de descente, qui est ancrée sur **4,0 mmol/L**.

---

## 9. Demandes au référent

1. **Trancher l'attribution du bloc de titration encodé (§2.3).** Le pas, le rythme et le seuil de 40 U
   viennent de la **SFD 2025 Avis 18** (et des « 3 matins consécutifs » d'ebmfrance), pas de
   Treat-to-Target. Faut-il **corriger l'attribution** dans `insuline.yaml` (l. 641, l. 229, l. 1295) et
   dans les `sources` du nœud ? *(Mon avis : oui, et c'est une amélioration — la source réelle
   **porte déjà la règle de descente**, ce que Riddle ne fournit qu'indirectement.)*
2. **Trancher la question d'occurrences du volet 1** — la seule vraie divergence de cette collecte :
   **une seule GAJ basse suffit-elle** (FPG GOAL, BEGIN, et le *hold* de Riddle) **ou en faut-il plus
   d'une sur trois** (ebmfrance) ? Les deux sont sourcées, aucune n'est démontrée. *(Mon avis, à
   red-teamer : la version **ebmfrance** est la mieux adaptée au capillaire en MG parce qu'elle
   distingue le bruit de mesure du signal, et parce qu'elle **gradue** — rien / −2 U / −4 U. Mais c'est
   un arbitrage clinique, pas un résultat de preuve.)*
3. **Trancher la cible affichée.** L'intervalle **0,70-1,20 g/L** n'a été retrouvé dans aucune source.
   Trois candidats sourçables : **SFD 0,80-1,30** (reco FR de référence du nœud) · **ebmfrance
   0,72-1,08** (position EBM de référence du nœud) · **FPG GOAL 0,70-1,10** (seule randomisation de la
   cible). *(Mon avis : conserver **0,70** en borne basse — c'est le seuil d'hypoglycémie, le plancher
   des trois bras de FPG GOAL, et la borne qui gouverne déjà `gaj_basse` — et documenter la borne haute
   choisie. Un changement de borne haute **modifie le comportement du nœud** : à ne pas faire sans
   décision explicite.)*
4. **Statuer sur la correction §4.4 (SFD porte bien le 0,5 U/kg, Avis 19).** Sans rouvrir l'arbitrage :
   faut-il mettre à jour le texte affiché de « Ne pas sur-titrer la basale » (`insuline.yaml` l. 595) et
   le champ `incertitudes` pour citer la SFD 2025 Avis 19 à côté de l'AACE ? *(Mon avis : oui — le texte
   actuel dit à l'utilisateur français que le repère est porté par l'AACE et retiré par l'ADA, en
   omettant que **sa propre société savante nationale le porte**, et **avec un usage identique à celui
   du nœud** : « avis d'un endocrinologue souhaitable », pas « ne pas titrer ».)*
5. **Statuer sur le volet 3.** Aucune source n'autorise à écrire « titrer plus lentement chez l'âgé ».
   Trois options : (a) ne rien ajouter ; (b) ajouter une **alerte** de cible relevée chez l'âgé/fragile,
   sourcée **SFD Avis 21 + ADA Table 13.2 (grade C)**, **sans toucher au pas ni au rythme** ;
   (c) modéliser une cible de GAJ conditionnelle au terrain. *(Mon avis : (b). C'est ce que les sources
   soutiennent, exactement, et cela répond à la dette **I14** et à la vignette V-A5 — la version
   capillaire de l'alerte de cibles assouplies — sans inventer de gradation non sourcée. (c) modifierait
   `gaj_basse`/`gaj_haute`, donc le comportement, sur un accord d'experts : à ne pas faire à la légère.)*
6. **Textes souhaités** : accès au texte intégral de **Riddle 2003** (*Diabetes Care* 26:3080-3086) et de
   **Davies 2005** (*Diabetes Care* 28:1282-1288) — tous deux en **403** — pour lever les `[À VÉRIFIER]`
   1 et 2. Idem **AACE 2026** (*Endocr Pract*) et **Meneghini 2007** (*DOM*) si disponibles.
7. **Rappel de procédure.** Conformément à `CONSTRUIRE-UN-MODULE.md` §P4, **rien de ce document n'entre
   dans `content/**` avant sa passe adversariale (agent B)** — en particulier les trois points qui
   prennent la forme flatteuse d'« un défaut trouvé chez vous » : l'attribution Treat-to-Target (§2.3),
   la borne 1,20 g/L (§9-3) et la recherche négative SFD du 2026-07-27 (§4.4). **Ce sont des hypothèses
   citées, pas des verdicts.**

---

## 10. Sources

### Ouvertes et lues dans cette collecte

| # | Référence | Accès |
|---|---|---|
| 1 | **ebmfrance / Duodecim.** *Insulinothérapie dans le diabète de type 2.* MàJ Duodecim 27/05/2022, contextualisation ebmfrance 26/06/2024. **Algorithme complet, montée ET descente.** | `docs/decision/sources/Insulinothérapie dans le diabète de type 2 _ ebmfrance.pdf` (local, 8 p.) · https://www.ebmfrance.net/Guidelines/Details/ebm00491 |
| 2 | **HAS.** *Stratégie thérapeutique du patient vivant avec un diabète de type 2*, mai 2024. **R.87 (AE)** titration ± 1-2 UI/3 j · **R.88, R.89** · **R.103, R.104, R.105 (AE)** sujet âgé. | `docs/decision/sources/strategie_therapeutique…pdf` (local, extrait par `pdftotext`) |
| 3 | **SFD 2025** — Darmon P, Bauduceau B, Bordier L, et al. *Méd. Mal. Métab.* 2025;19(8):630-662. **Avis 18** (cible 0,80-1,30 g/L, ± 2 U ou ± 10 % > 40 U/j, /3 j) · **Avis 18 bis, 18 ter** · **Avis 19** (> 0,5 U/kg/j) · **Avis 21** (âgé : préprandial 1-2 g/L) · **Tableaux I et II**. | `docs/decision/sources/SFD 2025.pdf` (local, extrait par `pdftotext`) |
| 4 | **Prescrire** — notes locales P1-P13. **Aucune mention de titration** (résultat négatif). | `docs/decision/sources/prescrire-dt2.md` |
| 5 | **Patel D, Triplitt C, Trujillo J.** *Appropriate Titration of Basal Insulin in Type 2 Diabetes and the Potential Role of the Pharmacist.* Adv Ther 2019;36(5):1031-1051. **PMID 30900198.** Tables 2-4 : algorithmes par essai et par reco, **descentes incluses**. | https://pmc.ncbi.nlm.nih.gov/articles/PMC6824379/ |
| 6 | **Chun J, Strong J, Urquhart S.** *Insulin Initiation and Titration in Patients With Type 2 Diabetes.* Diabetes Spectr 2019;32(2):104-111. **PMID 31168280.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC6528396/ |
| 7 | **Yang W, Ma J, Yuan G, et al.** *Determining the optimal fasting glucose target… FPG GOAL trial.* Diabetes Obes Metab 2019;21(8):1973-1977. **PMID 30938035** · DOI 10.1111/dom.13733. **ECR randomisant la cible.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC6772047/ |
| 8 | **Protocole de l'essai ci-dessus** (« BEYOND III ») — *Assessment of three fasting plasma glucose targets for insulin glargine-based therapy in people with T2DM in China: study protocol.* **Table de titration complète, y compris la descente (−2 U si FPG ≤ 3,9 mmol/L ou hypoglycémie nocturne).** | https://pmc.ncbi.nlm.nih.gov/articles/PMC5037905/ |
| 9 | **Wolters J, Wollenhaupt D, Abd El Aziz M, Nauck MA.** *Impact of the Fasting Plasma Glucose Titration Target on the Success of Basal Insulin Titration…* J Diabetes Res 2022;2022:4758042. **PMID 35942330.** *(Analyse écologique, discordante de FPG GOAL sur l'hypoglycémie.)* | https://pmc.ncbi.nlm.nih.gov/articles/PMC9356801/ |
| 10 | **Yuan L, Li F, Zhou Y, et al.** *Fasting Glucose of 6.1 mmol/L as a Possible Optimal Target…* J Diabetes Res 2021;2021:5524313. **PMID 34337072.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC8294995/ |
| 11 | **Fritsche A, et al.** *HbA1c target achievement in the elderly: results of the Titration and Optimization trial (TOP)…* BMJ Open Diab Res Care 2019;7(1):e000668. **PMID 31423316.** *(Registre observationnel, sous-analyse post hoc par âge.)* | https://pmc.ncbi.nlm.nih.gov/articles/PMC6688703/ |
| 12 | **Mehta R, Goldenberg R, Katselnik D, Kuritzky L.** *Practical guidance on the initiation, titration, and switching of basal insulins: a narrative review for primary care.* Ann Med 2021;53(1):998-1009. **PMID 34165382.** **Descente : −2-4 U ou −10 % si GAJ < 70 mg/dL ; revoir le schéma si 1-2 épisodes/sem. Plafond : 0,5-1,0 U/kg/j.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC8231382/ |
| 13 | **Home PD.** *An overview of insulin therapy for the non-specialist.* Diabetes Obes Metab 2025. **PMID 40035222.** *(« > 150 U/j » comme borne de compétence.)* | https://pmc.ncbi.nlm.nih.gov/articles/PMC12169081/ |
| 14 | **Rosenstock J, Bajaj HS, Lingvay I, Heller SR.** *Clinical perspectives on the frequency of hypoglycemia in treat-to-target randomized controlled trials comparing basal insulin analogs in T2D.* BMJ Open Diab Res Care 2024. **PMID 38749508.** *(Table des cibles de GAJ par essai ; ne rapporte aucune règle de descente.)* | https://pmc.ncbi.nlm.nih.gov/articles/PMC11097869/ |
| 15 | **Strange P.** *Treat-to-target insulin titration algorithms when initiating long or intermediate acting insulin in type 2 diabetes.* J Diabetes Sci Technol 2007;1(4):540-548. **PMID 19885117.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC2769634/ |
| 16 | **ADA Professional Practice Committee.** *9. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2026.* Diabetes Care 2026;49(Suppl 1):S183-S215. **PMID 41358900.** **Rec. 9.26 (E)** ; **aucune dose maximale, aucune cible chiffrée de GAJ.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC12690185/ |
| 17 | **ADA Professional Practice Committee.** *13. Older Adults: Standards of Care in Diabetes—2026.* Diabetes Care 2026;49(Suppl 1):S277-… **Table 13.2 (grade C)** ; **rec. 13.14a (B), 13.14b (E), 13.14c (B).** | https://pmc.ncbi.nlm.nih.gov/articles/PMC12690186/ |
| 18 | **Li L, et al.** *Comparison of Efficacy and Adherence of Patient-Preferred (1 U/day) and Guideline-Recommended (2 U every 3 days) Basal Insulin Titration Algorithms.* Patient Prefer Adherence 2024;18:687-694. **PMID 38524199.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC10959243/ |
| 19 | **Europe PMC REST API** — résolution des PMID/PMCID et vérification des métadonnées (dont la **correction PREDICTIVE 303 : 17924873**, et l'abstract de **SENIOR**). | https://www.ebi.ac.uk/europepmc/webservices/rest/ |

### Métadonnées vérifiées, texte intégral NON ouvert (statut explicite)

| # | Référence | Statut |
|---|---|---|
| 20 | **Riddle MC, Rosenstock J, Gerich J.** *The Treat-to-Target Trial…* Diabetes Care 2003;26(11):3080-3086. **PMID 14578243** · DOI 10.2337/diacare.26.11.3080 | **403** (PDF éditeur). Algorithme reconstitué par **2 sources secondaires concordantes** — `[À VÉRIFIER]` 1 |
| 21 | **Davies M, et al.** *…comparison of two treatment algorithms using insulin glargine* (**AT.LANTUS**). Diabetes Care 2005;28(6):1282-1288. **PMID 15920040** · DOI 10.2337/diacare.28.6.1282 | **403**. Libellés Algo 1/Algo 2 **contradictoires entre deux revues** — `[À VÉRIFIER]` 2 |
| 22 | **Gerstein HC, et al.** *…Canadian INSIGHT Study.* Diabet Med 2006;23(7):736-742. **PMID 16842477** · DOI 10.1111/j.1464-5491.2006.01881.x | Payant (Wiley). Montée +1 U/j confirmée ; **descente non rapportée** |
| 23 | **Yki-Järvinen H, et al.** *Insulin glargine or NPH combined with metformin… the LANMET study.* Diabetologia 2006;49(3):442-451. **PMID 16456680** · DOI 10.1007/s00125-005-0132-0 | **303 → idp.springer.com** (authentification). Cible 4,0-5,5 mmol/L et montée confirmées par Patel 2019 ; **descente non rapportée** |
| 24 | **Meneghini L, Koenen C, Weng W, Selam JL.** *…(303 Algorithm) for insulin detemir… PREDICTIVE 303 study.* Diabetes Obes Metab 2007;9(6):902-913. **PMID 17924873** · DOI 10.1111/j.1463-1326.2007.00804.x | Payant. **Descente −3 U si moyenne des 3 GAJ < 80 mg/dL** — deux secondaires concordantes |
| 25 | **Garg SK, et al.** *Patient-led versus physician-led titration of insulin glargine… ATLAS study.* Endocr Pract 2015;21(2):143-157. **PMID 25297660** | **403** (endocrinepractice.org). Résultats chiffrés depuis l'abstract |
| 26 | **Ritzel R, et al.** *…SENIOR Study.* Diabetes Care 2018;41(8):1672-1680. **PMID 29895556** · DOI 10.2337/dc18-0168 | Abstract intégral lu via **Europe PMC** ; texte intégral en 403 |
| 27 | **Munshi MN, et al.** *Simplification of Insulin Regimen in Older Adults and Risk of Hypoglycemia.* JAMA Intern Med 2016;176(7):1023-1025. **PMID 27273335** · DOI 10.1001/jamainternmed.2016.2288 | Pas d'abstract sur PubMed ; texte intégral non ouvert |
| 28 | **AACE.** *Comprehensive T2D Management Algorithm* — éditions 2023 et 2026, *Endocr Pract* | **403** (constat déjà fait le 2026-07-27). Règles AACE citées **via Patel 2019** |

### Recherches NÉGATIVES (à afficher comme telles)

- **CMG (Collège de la Médecine Générale)** — aucune position dédiée à l'insulinothérapie ou à sa
  titration retrouvée. *(Une recherche négative n'est pas une preuve d'absence.)*
- **Prescrire** — aucun contenu sur la titration dans les notes locales P1-P13.
- **NICE** — le fichier local `NICE 2023.pdf` est **NG238 (lipides)**, pas une reco diabète.
- **Essai randomisant un pas, un intervalle ou une cible de titration SELON L'ÂGE** — aucun.
- **Essai randomisant une RÈGLE DE DESCENTE** — aucun.
