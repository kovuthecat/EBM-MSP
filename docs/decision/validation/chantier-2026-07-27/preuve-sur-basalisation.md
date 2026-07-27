# Seuil de sur-basalisation (0,5 U/kg/j) — d'où il vient et ce qu'il vaut

Note de preuve ponctuelle, chantier 2026-07-27, nœud `insuline` (DT2).

**Ne modifie aucun fichier de contenu ni aucun test.** Lecture seule sur `content/**`. Ce document est
un apport au dossier de preuve : il propose, il n'encode rien. À trancher par le référent.

**Question posée.** Le dérivé `over_basalisation` (`dose_basale_actuelle / poids > 0.5`) est déclaré
dans `insuline.yaml` comme un « repère (SFD / Médicalement Geek), non validé par un essai — à
confirmer ». Depuis le 2026-07-26 il n'est plus une alerte : il est une **exclusion dure** de l'option
« Titrer la basale » et un **déclencheur** de l'option « Ne pas sur-titrer la basale ». D'où vient ce
seuil, et que vaut-il ?

**Discipline appliquée.** Chaque référence ci-dessous a été ouverte via PMC, PubMed ou le site de
l'éditeur, sauf mention contraire explicite. Les articles hébergés sur `diabetesjournals.org`
renvoient un **HTTP 403** à l'outil : quand une version PMC existait, c'est elle qui a été lue et le
statut est **vérifié** ; sinon le statut est **partiel** ou **non ouvert**, et c'est écrit. Aucun
PMID/DOI n'est cité sans avoir été affiché par PubMed ou PMC.

---

## 1. Verdict en une phrase

**Le seuil de 0,5 U/kg/j est un avis d'expert (grade E), rétro-habillé en 2019 par une analyse post
hoc industrielle non préspécifiée de 458 patients, et — fait décisif — *retiré* de la définition de la
sur-basalisation par l'ADA elle-même en 2025 puis absent de l'édition 2026, au profit de marqueurs de
profil glycémique que le nœud `insuline` possède déjà.**

---

## 2. Généalogie du seuil : qui le dit, depuis quand, sur quoi

### 2.1 Chronologie

| Date | Étape | Statut du seuil à ce stade |
|---|---|---|
| avant 2019 | Le chiffre circule dans les algorithmes de pratique | **Avis d'expert**, sans support de données — c'est ce qu'écrivent les auteurs de l'étape suivante |
| 2019 | **Umpierrez et al.**, post hoc poolé de 3 ECR glargine (financement Sanofi US), N=458 | Le chiffre reçoit pour la première fois une **courbe** : plateau de réponse au-delà de ~0,5 U/kg/j. Seuil **non préspécifié** |
| 2020 (juillet) | **Cowart**, *Clin Diabetes* — revue narrative qui **nomme** le concept « overbasalization » | Le seuil devient l'ancre d'un concept nommé |
| 2020 (sept.) | **DragiWebdo n°280** (Médicalement Geek) relaie « l'ajout d'une post-prandiale se fait quand on atteint 0,5 UI/kg/j » — dans une section explicitement présentée comme un résumé des **recos ADA 2020** | Relais francophone d'une source américaine |
| 2021 | **Cowart, Updike, Pathak** — étude transversale n=655 : définition opérationnelle = HbA1c > 8 % **+** dose > 0,5 U/kg/j ; prévalence 38,1 % | Le seuil devient un **instrument de mesure** de prévalence |
| 2021 → 2025 | **Davidson** conteste le seuil à trois reprises (2021, 2022, 2025) | Controverse ouverte, publiée dans la même revue |
| 2022 → 2024 | **ADA Standards of Care** : le seuil entre dans la recommandation (2023 : rec **9.14**, grade **E**) | Consensus d'experts institutionnel |
| 2023 | **Cowart et al.** — post hoc d'ACCORD, N=9 321 : seule tentative de rattacher le seuil à des critères durs | Tentative de validation, méthodologiquement fragile (§3.3) |
| **2025** | **ADA Standards of Care 2025** : rec **9.27**, grade E — le seuil **est retiré** de la liste des signes de sur-basalisation | **Désavoué par sa source de référence** |
| 2026 | **ADA Standards of Care 2026** : rec **9.26**, grade E — le seuil reste absent | Confirmé |

### 2.2 Ce que disent les auteurs de la source empirique elle-même

Umpierrez et al. 2019 (*Diabetes Obes Metab*, PMID 30724009, PMC ouvert) est **la** publication qui a
donné au chiffre une apparence de donnée. Or les auteurs écrivent eux-mêmes que les recommandations
existantes utilisant ce seuil reposent **« principalement sur l'avis d'expert plutôt que sur l'analyse
de données cliniques »** — et le seuil de 0,5 n'était **pas préspécifié** dans leur analyse : il
résulte de la lecture de la forme d'une courbe dose-réponse.

Forme de la courbe (concordante sur deux extractions indépendantes du texte) : réponse glycémique
linéaire et forte jusqu'à ~0,3 U/kg/j, **décroissante entre 0,3 et 0,5**, **plateau au-delà de 0,5**.
Au-delà du seuil : **prise de poids supplémentaire (+1,8 kg)** et **pas d'augmentation du taux
d'hypoglycémie**. Recommandation des auteurs : *envisager* d'intensifier autrement quand la dose
« approche » 0,5 U/kg/j.

> Réserve de lecture : les chiffres par incrément (mmol/L et mmol/mol par 0,1 U/kg) affichés par
> l'extraction automatique du PMC ont des ordres de grandeur que je n'ai pas pu recouper avec
> certitude sur les unités ; je ne les reproduis donc pas. La **forme** de la courbe (linéaire →
> décroissante → plateau) est en revanche affirmée sans ambiguïté et confirmée deux fois.

**Base de données réelle** : N = 458 patients, issus de trois essais treat-to-target menés entre 1997
et 2007, sous glargine U100 + metformine + sulfamide. Financement **Sanofi US** ; deux auteurs sont
salariés Sanofi.

### 2.3 Ce que la source qui a popularisé le concept reconnaît

Cowart & Carris, *Practicable Measurement and Identification of Overbasalization* (*Clin Diabetes*
2022;40(1):75-77, PMID 35221475, **non ouvert — 403**), défendent le seuil **non pas comme validé mais
comme praticable** : la définition conceptuelle (« titrer la basale au-delà d'une dose appropriée »)
« n'offre pas au clinicien de marqueur praticable ». Le 0,5 U/kg est donc explicitement un **proxy de
mesurabilité**, choisi pour pouvoir compter des patients dans un dossier, pas parce qu'un essai
l'aurait établi.

### 2.4 La contestation, documentée et publiée

Mayer B. Davidson (*Clin Diabetes* 2021;39(4):411-414, PMID 34866782, **PMC ouvert et lu**) attaque
le seuil sur trois plans :

1. **Circularité.** *« Calculating the glycemic outcomes in this manner is a self-fulfilling prophecy,
   as the higher insulin doses simply reflect more insulin resistance. »* Une dose élevée mesure la
   résistance à l'insuline, pas un échec de la titration.
2. **Erreur de lecture de la courbe.** Le post hoc montre des variations *incrémentales* décroissantes
   par 0,1 U/kg ; Davidson objecte que la comparaison pertinente porte sur les changements
   **absolus**, et que ceux-ci sont **plus grands** chez les patients à dose élevée :
   GAJ −58,8 mg/dL (≤0,3 U/kg) vs **−90,1 mg/dL** (>0,5 U/kg), p = 0,0013 ; HbA1c −1,48 % vs
   **−1,79 %**, p = 0,0237 ; **aucune différence significative** sur la proportion atteignant les
   cibles ADA.
3. **La prémisse de sécurité est fausse.** Dans une analyse de 15 essais de phase 3 glargine
   (n = 2 837) qu'il cite — **étude non ouverte directement par moi**, chiffres rapportés par
   Davidson : 38 % des patients dépassent 0,5 U/kg ; GAJ finale quasi identique (116,6 vs
   120,7 mg/dL) ; et les taux d'hypoglycémie sont **significativement plus BAS** au-dessus du seuil,
   dont l'hypoglycémie **nocturne** : 0,85 vs 0,60 événements/patient-année (≤0,5 vs >0,5 U/kg),
   p < 0,05.

Sa contre-proposition : la sur-basalisation *clinique* est le fait d'augmenter la basale **après que
la cible de glycémie à jeun est atteinte**, pour tenter de corriger l'hyperglycémie diurne — un
raisonnement physiologique, pas un seuil pondéral. Il a réitéré la critique en 2022 (PMID 35983420,
PMC lu) et en 2025 (PMID 39829708, *Clin Diabetes* 2025;43(1):123-124, **contenu non accessible**).

### 2.5 Traçage de l'attribution portée dans le dépôt

Le YAML et `E-insuline.md` attribuent le repère à « SFD / Médicalement Geek ». Vérification :

- **Médicalement Geek / DragiWebdo n°280 (13 sept. 2020)** — **page ouverte et lue**. Le billet écrit
  bien *« L'ajout d'une post prandiale se fait quand on atteint 0,5UI/kg/j »*, mais dans une section
  qu'il présente lui-même comme un résumé des **recommandations ADA 2020**. Ce n'est donc **pas une
  source indépendante** : c'est un relais francophone de l'ADA d'alors — ADA qui a depuis retiré le
  critère. Le même billet cite d'ailleurs les deux autres marqueurs de la triade ADA (post-prandial
  > 1,80 g/L, écart coucher-réveil > 0,5 g/L).
- **SFD** — **aucun document SFD énonçant ce seuil n'a été retrouvé.** Les sources SFD consultables
  parlent d'initiation (10 U le soir, ou 0,1-0,2 U/kg/j) et de titration sur la GAJ, pas d'un plafond
  pondéral. L'attribution « SFD » du dépôt paraît **erronée** ; à défaut de preuve du contraire, elle
  devrait être retirée du champ `incertitudes`.
- **ADA/EASD 2022** (Davies et al., *Diabetes Care* 2022;45(11):2753-2786, PMID 36148880, **PMC
  ouvert et fouillé**) : ni le terme « overbasalization », ni « 0,5 U/kg » n'y figurent. Le consensus
  international conjoint n'a **jamais** porté ce seuil.

---

## 3. Niveau de preuve réel

### 3.1 Le grade officiel a toujours été « E »

Dans les Standards ADA, la recommandation qui portait le seuil est **grade E** — « consensus d'experts
ou expérience clinique », le niveau le plus bas de l'échelle ADA. Texte lu à la source (PMC, ADA 2023
rec **9.14**) :

> *« Clinicians should be aware of the potential for overbasalization with insulin therapy. Clinical
> signals that may prompt evaluation of overbasalization include basal dose more than ~0.5 units/kg/day,
> high bedtime–morning or post-preprandial glucose differential, hypoglycemia (aware or unaware), and
> high glycemic variability. »* — **grade E**

À noter : même à cette époque, l'ADA n'en faisait **pas un plafond ni une contre-indication à titrer**,
mais un **signal qui doit déclencher une évaluation** (« may prompt evaluation »). Le passage de
« signal d'alerte » à « exclusion dure » est donc une transformation opérée par le dépôt, pas héritée
de la source.

### 3.2 Aucun essai n'a testé la stratégie

**Question : existe-t-il un ECR comparant « plafonner la basale à X U/kg puis intensifier autrement »
à « continuer à titrer » ? Réponse : NON.** Aucun essai de ce type n'a été retrouvé, et une revue
systématique dédiée le confirme en creux :

> Luo Y et al., *J Diabetes* 2023;15(5):419-435 (PMID 37038616, PMC ouvert et lu), revue systématique
> avec méta-analyse sur les schémas de basale dans le DT2 : **« There is no eligible evidence to
> investigate the optimal maintenance dose for basal insulins. »** Aucun ECR n'a été conçu pour
> déterminer une dose d'entretien, encore moins un plafond.

Les essais qui « ajoutent au lieu de titrer » (type LixiLan-L, combo fixe vs glargine seule) plafonnent
la basale à une valeur **absolue** (60 U/j) **dans les deux bras** : ils ne testent donc pas le
plafond, ils le subissent également des deux côtés. *(Ce point sur LixiLan-L repose sur des résumés
concordants, protocole non ouvert à la source primaire — **partiel**.)*

### 3.3 La seule étude à critère dur est confondue

Cowart K, Vascimini A, Kumar A, Tsalatsanis A, Saba Y, Carris NW. *Impact of Overbasalization on
Clinical Outcomes in Patients With Type 2 Diabetes: A Post Hoc Analysis of a Large Randomized
Controlled Trial.* *Clin Diabetes* 2023;41(2):147-153. PMID 37092152, DOI 10.2337/cd22-0046.
**PMC ouvert, résultats et limites lus.**

Post hoc d'**ACCORD**, N = 9 321, 5 groupes ; « sur-basalisé » = basale > 0,5 U/kg/j sans bolus.
Variation ajustée d'HbA1c à 12 mois (référence = basale seule sur-basalisée, −0,67 % [−0,80 ; −0,55]) :
tous les autres groupes font significativement mieux, y compris « **pas d'insuline du tout** »
(−1,28 % [−1,30 ; −1,25]). Critère macrovasculaire élargi vs le groupe sur-basalisé : pas d'insuline
ORa 0,62 (0,47-0,81) ; basale non sur-basalisée ORa 0,64 (0,47-0,89) ; basal-bolus non sur-basalisé
ORa 0,67 (0,49-0,93). Critère composite primaire CV : **aucune association significative**.

**Pourquoi cela ne valide pas le seuil :**

1. **Le groupe qui s'en sort le mieux est « pas d'insuline ».** C'est la signature d'une **confusion
   par indication** : ce que le modèle capte, c'est la sévérité et l'ancienneté du diabète, pas un
   effet de la stratégie de dosage. Personne n'en conclut qu'il faut arrêter l'insuline.
2. **Les auteurs eux-mêmes ne traitent pas la confusion par insulinorésistance** — c'est-à-dire
   exactement l'objection de Davidson — dans leur section Limites. Ils reconnaissent le design post
   hoc, l'absence de randomisation sur ce découpage, et un possible « residual confounding ».
3. **ACCORD est un terrain particulièrement mauvais** pour isoler un effet de dose de basale : essai
   de contrôle glycémique intensif interrompu pour surmortalité, sans aGLP-1 ni iSGLT2 (les auteurs le
   notent), population à diabète très ancien.
4. Le critère principal reste un **substitut** (HbA1c) ; les critères durs sont **exploratoires**, et
   le composite primaire est négatif.

**Conclusion de §3 : le seuil n'a jamais dépassé le statut d'avis d'expert. Il n'a aucune validation
prospective, aucun essai de stratégie, et son unique étude à critère dur est un post hoc confondu dont
le résultat le plus « favorable » est absurde en clinique.**

### 3.4 Le point qui compte le plus pour le nœud : la prémisse de sécurité est démentie

Le texte affiché à l'utilisateur (`insuline.yaml`, option « Ne pas sur-titrer », et l'ancien texte
D21) motive le geste par le fait que *« l'excès de basale majore l'hypoglycémie »*. **Les données
mêmes dont le seuil est issu disent le contraire au-dessus de 0,5 U/kg** :

- Umpierrez 2019 : au-delà de 0,5 U/kg, prise de poids supplémentaire **sans** augmentation du taux
  d'hypoglycémie.
- Analyse des 15 essais glargine citée par Davidson (n = 2 837) : hypoglycémie, y compris **nocturne**,
  **significativement plus basse** au-dessus de 0,5 U/kg (0,60 vs 0,85 év./patient-année, p < 0,05) —
  probablement parce que ces patients sont plus insulinorésistants.

Ce qui **est** soutenu par les données au-delà du seuil, c'est : **rendement décroissant** (plateau de
la courbe) et **prise de poids**. Pas l'hypoglycémie. Le motif affiché est donc à corriger,
indépendamment du sort qu'on réserve au gate.

---

## 4. Seuils concurrents

Il en existe, et surtout ils ne convergent pas.

| Valeur | Ce que c'est | Source | Statut |
|---|---|---|---|
| **0,1-0,2 U/kg/j** | Dose d'**initiation** | ADA/EASD 2022 (PMC lu) ; SFD ; Médicalement Geek | Consensus, non contesté — **ce n'est pas un plafond** |
| **0,2-0,3 U/kg/j** | Initiation si HbA1c > 8 % | Algorithme AACE | *Non ouvert à la source primaire — **partiel*** |
| **0,3 U/kg/j** | Point où la réponse **commence** à décroître dans la courbe Umpierrez | Umpierrez 2019 | Aussi défendable que 0,5 si l'on veut un seuil « issu de la courbe » — ce qui montre l'arbitraire du choix |
| **0,5 U/kg/j** | Le repère contesté | Avis d'expert → ADA 2022-2024 → **retiré 2025** | Grade E, désavoué |
| **0,55 U/kg/j** | Dose **moyenne** à laquelle la cible de GAJ est atteinte dans un ECR, 46 % atteignant aussi la cible d'HbA1c sans intensifier | Essai cité par Davidson 2021 | *Essai non ouvert par moi — **partiel*** |
| **0,34-0,62 / 0,28-0,59 / 0,19-0,78 / 0,19-0,66 U/kg/j** | **Doses d'entretien réellement atteintes** en fin d'ECR treat-to-target (glargine U300 / degludec / détémir / NPH) | Luo 2023 (PMC lu) | **Vérifié** — une part substantielle des patients **à la cible** dans les ECR dépasse 0,5 U/kg |
| **0,86 U/kg/j** (extrêmes 0,3-1,3) | Dose moyenne de NPH au coucher normalisant la GAJ, HbA1c 10,9 % → 7,2 % | Cusi 1995, cité par Davidson | *Non ouvert — **partiel*** |
| **60 U/j** (absolu, non pondéral) | Plafond opérationnel des essais de combo fixe | LixiLan-L et apparentés | *Partiel* ; à noter : **absolu**, pas pondéral |

La ligne « doses d'entretien observées » est la plus gênante pour un gate à 0,5 : dans les essais qui
servent de socle de preuve à la titration, **atteindre la cible au-delà de 0,5 U/kg est ordinaire**,
pas pathologique.

---

## 5. Marqueurs alternatifs — sont-ils mieux étayés ?

**Réponse courte : ils ne sont pas mieux *prouvés* (tout est grade E), mais ils sont mieux *fondés*,
et l'ADA les a explicitement préférés au seuil pondéral.**

Texte lu à la source, **ADA 2026 §9, recommandation 9.26, grade E** (*Diabetes Care*
2026;49(Suppl 1):S183-S215, DOI 10.2337/dc26-S009, PMID 41358900, PMC12690185) :

> *« Monitor for signs of overbasalization during insulin therapy, such as significant
> bedtime-to-morning or postprandial-to-preprandial glucose differential, occurrences of hypoglycemia
> (aware or unaware), and high glycemic variability. When overbasalization is suspected, a thorough
> reevaluation should occur promptly to further tailor therapy to the individual's needs. »*
> Différentiel cité en exemple : **coucher-réveil ≥ 50 mg/dL (≥ 2,8 mmol/L)**, soit ≥ 0,5 g/L.
> **Aucune mention de 0,5 U/kg/j.** Le document ne fixe **aucune dose maximale de basale** ni aucun
> critère d'arrêt de titration.

| Marqueur | Fondement | Niveau réel |
|---|---|---|
| **Écart coucher-réveil (BeAM) ≥ 0,5 g/L** | Zisman et al., *BMJ Open Diabetes Res Care* 2016 (PMID 27110368) : post hoc poolé d'essais de phase 3 glargine, n = 1 188 / 553 / 299, auteurs Sanofi US. *(Article non ouvert directement — reCAPTCHA PubMed ; métadonnées et design via sources concordantes — **partiel**.)* | **Meilleur fondement physiologique** : il mesure directement l'excursion diurne qu'une basale ne *peut pas* corriger. Mais post hoc, industriel, **non validé sur critère dur ni en prospectif**. Davidson le juge sensible au contenu glucidique du dîner et lui préfère la glycémie préprandiale du soir > 180 mg/dL |
| **Hypoglycémie (ressentie ou non)** | Retenu ADA 2025/2026, grade E | Critère **dur** en lui-même (l'hypoglycémie est un événement, pas un substitut) — c'est le seul marqueur de la liste qui ne soit pas un proxy |
| **Variabilité glycémique élevée** | Retenu ADA 2025/2026, grade E | Substitut ; lien aux complications non démontré (cohérent avec ce que le nœud écrit déjà sur les cibles MCG) |
| **Définition « clinique » de Davidson** : titrer la basale *après* que la cible de GAJ soit atteinte | Raisonnement physiologique | Quasi **tautologique** plutôt qu'empirique — et c'est sa force : on ne peut pas corriger par la basale un écart qui n'est pas nocturne |

**Observation capitale pour le nœud** : les trois marqueurs retenus par l'ADA 2025/2026 sont **déjà
encodés** dans `insuline.yaml` — `gaj_a_cible`, `profil_nocturne_a_cible` /
`profil_nocturne_permet_titration` (pivot E-03), `hypo_severe_recurrente`, `TBR`, `TBR_severe`,
`CV_glycemique > 36`, `hypo_nocturne`. Et le pivot nocturne que le référent a imposé trois fois est
**exactement la définition de Davidson**. Le nœud a donc déjà, et depuis le 2026-07-26, la version
2026 de la définition ADA.

`over_basalisation` n'apporte de l'information que **là où il contredit ces marqueurs** : le cas où la
GAJ ou le profil nocturne sont **hors cible** — c'est-à-dire le cas où la nuit dit « la basale est
encore insuffisante ». C'est précisément là que le seuil a le plus de chances de se tromper, et c'est
précisément là qu'il retire aujourd'hui l'option de titrer.

---

## 6. Ce qui n'a pas pu être vérifié

Par honnêteté de traçage, voici les points **non confirmés à la source primaire** :

1. **Cowart K, *Overbasalization: Addressing Hesitancy…*, Clin Diabetes 2020;38(3):304-310** — article
   fondateur du terme, **non ouvert** (403 sur `diabetesjournals.org`, pas de version PMC trouvée).
   Titre / revue / année / pagination concordants sur quatre sources indépendantes ; **je n'ai pas lu
   son texte**, donc je ne peux pas dire quelle référence *lui* servait pour le 0,5 en 2020. **Je ne
   cite pas son DOI**, ne l'ayant pas affiché.
2. **Cowart & Carris 2022 (PMID 35221475)** — **non ouvert** (403 sur le HTML et sur le PDF). La
   citation du §2.3 (« n'offre pas de marqueur praticable ») provient d'un extrait de résumé
   éditorial, pas du texte intégral lu par moi.
3. **Davidson 2025 (PMID 39829708)** — métadonnées confirmées sur PubMed, **pas d'abstract**, contenu
   inaccessible. Je sais qu'il a écrit une nouvelle note sur la définition ; je ne sais pas ce qu'elle
   dit.
4. **Phrase exacte du *Summary of Revisions* ADA 2025** (Diabetes Care 2025;48(Suppl 1):S6, PMID
   39651984) — page **403**. La formulation « *revised to remove consideration of basal insulin doses
   exceeding 0.5 units/kg/day as evidence of overbasalization* » vient de deux sources secondaires
   concordantes. **Mais le fait lui-même est vérifié directement** : j'ai lu la rec 9.14 de 2023 (avec
   le seuil) et la rec 9.27 de 2025 puis la rec 9.26 de 2026 (sans le seuil) sur PMC. Le retrait est
   établi, seule sa formulation officielle ne l'est pas.
5. **Références citées par l'ADA à l'appui de la rec sur la sur-basalisation** — l'extraction
   automatique du PMC 2023 a renvoyé une référence (Bergenstal 2015, aiguilles de stylo 4 mm) qui est
   **implausible** pour cette affirmation ; il s'agit très probablement d'une erreur d'appariement de
   numéro de référence. **Je n'affirme donc rien** sur ce que l'ADA citait à l'appui de son seuil.
6. **Zisman 2016 (BeAM)** — reCAPTCHA sur PubMed, PMC non ouvert directement. Design, effectifs et
   affiliations Sanofi rapportés par sources concordantes ; **non lu à la source**.
7. **Analyse des 15 essais glargine (n = 2 837)** et **Cusi 1995** — connus uniquement par ce que
   Davidson en rapporte ; **non ouverts**. Les chiffres d'hypoglycémie du §3.4 sont donc de **seconde
   main**, quoique publiés dans une revue à comité de lecture par un contradicteur nommé.
8. **Stewart-Lynch et al. 2024** (*Clin Diabetes* 2024;42(2), PMID 38694250, DOI 10.2337/cd23-0044) —
   prévalence 43,4 % sur 398 dossiers, définition > 0,5 U/kg/j : **partiel** (reCAPTCHA PubMed,
   données via résumés concordants).
9. **AACE** — je n'ai pas ouvert l'algorithme à la source ; l'attribution du 0,5 U/kg à l'AACE
   pré-2019 reste une **hypothèse plausible non démontrée**.
10. **SFD** — **recherche négative** : aucun document SFD portant ce seuil n'a été trouvé. Une
    recherche négative n'est pas une preuve d'absence, mais elle suffit à retirer l'attribution du
    champ `incertitudes` tant que le référent ne produit pas la source.

---

## 7. Sources

**Vérifiées (texte ouvert et lu) :**

| # | Référence | URL |
|---|---|---|
| 1 | Umpierrez GE, Skolnik N, Dex T, Traylor L, Chao J, Shaefer C. *When basal insulin is not enough: A dose–response relationship between insulin glargine 100 units/mL and glycaemic control.* Diabetes Obes Metab 2019;21(6):1305-1310. PMID 30724009, DOI 10.1111/dom.13653. **Financement Sanofi US.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC6594069/ |
| 2 | Cowart K, Updike WH, Pathak R. *Prevalence of and Characteristics Associated With Overbasalization…* Clin Diabetes 2021;39(2):173-175. PMID 33986570, DOI 10.2337/cd20-0080. | https://pubmed.ncbi.nlm.nih.gov/33986570/ |
| 3 | Davidson MB. *The Clinical Definition of Overbasalization.* Clin Diabetes 2021;39(4):411-414. PMID 34866782, DOI 10.2337/cd21-0025. | https://pmc.ncbi.nlm.nih.gov/articles/PMC8603322/ |
| 4 | Davidson MB. *Clinical Overbasalization Revisited.* Clin Diabetes 2022;40(3):354-355. PMID 35983420, DOI 10.2337/cd21-0132. | https://pmc.ncbi.nlm.nih.gov/articles/PMC9331619/ |
| 5 | Cowart K, Vascimini A, Kumar A, Tsalatsanis A, Saba Y, Carris NW. *Impact of Overbasalization on Clinical Outcomes…: A Post Hoc Analysis of a Large Randomized Controlled Trial.* Clin Diabetes 2023;41(2):147-153. PMID 37092152, DOI 10.2337/cd22-0046. | https://pmc.ncbi.nlm.nih.gov/articles/PMC10115611/ |
| 6 | ADA Professional Practice Committee. *9. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2023.* Diabetes Care 2023;46(Suppl 1):S140-S157. **Rec 9.14, grade E — contient le seuil.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC9810476/ |
| 7 | ADA Professional Practice Committee. *9. Pharmacologic Approaches…—2025.* Diabetes Care 2025;48(Suppl 1):S181-… **Rec 9.27, grade E — seuil retiré.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC11635045/ |
| 8 | ADA Professional Practice Committee. *9. Pharmacologic Approaches…—2026.* Diabetes Care 2026;49(Suppl 1):S183-S215. DOI 10.2337/dc26-S009, PMID 41358900. **Rec 9.26, grade E — seuil absent, BeAM ≥ 50 mg/dL.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC12690185 |
| 9 | Davies MJ, Aroda VR, Collins BS, et al. *Management of Hyperglycemia in Type 2 Diabetes, 2022. ADA/EASD Consensus Report.* Diabetes Care 2022;45(11):2753-2786. PMID 36148880, DOI 10.2337/dci22-0034. **Le seuil n'y figure pas.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC10008140/ |
| 10 | Luo Y, et al. *Effectiveness, safety, initial optimal dose, and optimal maintenance dose range of basal insulin regimens for type 2 diabetes: A systematic review with meta-analysis.* J Diabetes 2023;15(5):419-435. PMID 37038616, DOI 10.1111/1753-0407.13381. **« No eligible evidence » sur la dose d'entretien.** | https://pmc.ncbi.nlm.nih.gov/articles/PMC10172019/ |
| 11 | Médicalement Geek — DragiWebdo n°280, 13 septembre 2020. **Relais explicite des recos ADA 2020.** | https://www.medicalement-geek.com/2020/09/dragi-webdo-n280.html |

**Partielles / non ouvertes (statut explicite) :**

| # | Référence | Statut | URL |
|---|---|---|---|
| 12 | Cowart K. *Overbasalization: Addressing Hesitancy in Treatment Intensification Beyond Basal Insulin.* Clin Diabetes 2020;38(3):304-310. | **Non ouvert (403)** — métadonnées concordantes, DOI non affiché donc non cité | https://diabetesjournals.org/clinical/article/38/3/304/32317/ |
| 13 | Cowart K, Carris NW. *Practicable Measurement and Identification of Overbasalization.* Clin Diabetes 2022;40(1):75-77. PMID 35221475, DOI 10.2337/cd21-0096. | **Non ouvert (403 HTML + PDF)** | https://pubmed.ncbi.nlm.nih.gov/35221475/ |
| 14 | Davidson MB. *Definition of Overbasalization.* Clin Diabetes 2025;43(1):123-124. PMID 39829708, DOI 10.2337/cd24-0045. | **Métadonnées vérifiées, contenu inaccessible** (pas d'abstract) | https://pubmed.ncbi.nlm.nih.gov/39829708/ |
| 15 | ADA. *Summary of Revisions: Standards of Care in Diabetes—2025.* Diabetes Care 2025;48(Suppl 1):S6. PMID 39651984. | **403** — phrase exacte non lue ; le **fait** du retrait est vérifié par comparaison directe des textes 2023/2025/2026 | https://pubmed.ncbi.nlm.nih.gov/39651984/ |
| 16 | Zisman A, et al. *BeAM value: an indicator of the need to initiate and intensify prandial therapy…* BMJ Open Diabetes Res Care 2016;4(1). PMID 27110368. | **Partiel** (reCAPTCHA) — post hoc phase 3 glargine, auteurs Sanofi US | https://pubmed.ncbi.nlm.nih.gov/27110368/ |
| 17 | Stewart-Lynch A, et al. *Quantifying and Characterizing the Presence of Insulin Overbasalization in a Family Medicine Practice.* Clin Diabetes 2024;42(2):266-… PMID 38694250, DOI 10.2337/cd23-0044. | **Partiel** (reCAPTCHA) — prévalence 43,4 %, n = 398 | https://pubmed.ncbi.nlm.nih.gov/38694250/ |

---

## 8. CE QUE ÇA CHANGERAIT POUR LE NŒUD

**La question qui commande : un repère de ce niveau de preuve peut-il légitimement servir d'EXCLUSION
DURE, ou doit-il redescendre au rang d'alerte qui qualifie le geste sans l'interdire ?**

### 8.1 Ce qui plaide POUR le maintien de l'exclusion dure

1. **Le geste n'est pas retiré dans le vide.** Le nœud propose immédiatement à la place « ajouter un
   GLP-1 / combo fixe » puis « ajouter un bolus » — des gestes dont le nœud tient déjà, sources à
   l'appui, qu'ils font au moins aussi bien sur l'HbA1c avec un meilleur profil de poids et d'hypo. Le
   coût clinique d'une exclusion à tort est donc **borné** : le patient garde un geste d'escalade
   valide.
2. **L'erreur de pratique visée est documentée, pas fantasmée.** Deux séries indépendantes (n = 655 et
   n = 398) trouvent 38 % et 43 % de patients au-dessus du seuil avec un contrôle non atteint. Le
   phénomène « on continue à monter la basale au lieu de réévaluer » **existe**, et un outil d'aide à
   la décision peut légitimement corriger un biais de pratique constaté.
3. **L'argument d'ergonomie du référent (2026-07-26) est réel et non réfuté.** Une alerte portée par
   l'option laisse la carte afficher « Titrer la basale, +2 U » : elle nuance un geste qu'elle
   continue de recommander. Si l'on juge que le geste ne doit pas être recommandé, une alerte ne fait
   pas le travail.
4. **Le nœud est un outil d'aide, pas une ordonnance.** Retirer une option d'une carte n'interdit rien
   à un praticien ; le registre est celui de la suggestion.
5. **Argument de moindre mal** : entre « sur-titrer une basale déjà haute » et « ajouter un GLP-1 »,
   même en l'absence de preuve de seuil, le second bras a un meilleur profil bénéfice/risque global.

### 8.2 Ce qui plaide CONTRE (redescendre au rang d'alerte)

1. **Le seuil n'est pas seulement « non validé » : il est désavoué par sa propre source.** L'ADA l'a
   retiré en 2025 et il reste absent en 2026. Le dépôt encoderait donc, en dur, en 2026, un critère
   que la reco d'où il vient a explicitement abandonné — et le relais francophone invoqué
   (Médicalement Geek) se présente lui-même comme un résumé de l'ADA 2020. C'est le point le plus
   lourd : ce n'est pas un repère orphelin de preuve, c'est un repère **retiré**.
2. **Le motif affiché à l'utilisateur est factuellement faux.** « L'excès de basale majore
   l'hypoglycémie » est contredit par les deux jeux de données qui ont servi à construire le seuil
   (§3.4). Un gate dont la justification écrite est démentie par sa source est un défaut de qualité en
   soi — et il est visible par le référent clinique.
3. **L'asymétrie de preuve va dans le mauvais sens.** On retire un geste dont la base de preuve est
   massive (la titration treat-to-target de la basale est le socle même de l'insulinothérapie du DT2)
   au nom d'un repère grade E, non préspécifié, issu de 458 patients d'essais 1997-2007. Le projet a
   pour invariant de distinguer donnée et consensus d'experts : ici c'est le consensus abandonné qui
   désarme la donnée.
4. **Le gate mord précisément là où il a le plus de chances de se tromper.** Il ne change rien quand
   le pivot nocturne dit déjà « ne titre pas » (l'option « Ne pas sur-titrer » se déclenchait déjà).
   Son **seul** effet propre est le cas « nuit hors cible **et** dose > 0,5 U/kg » — c'est-à-dire un
   patient dont la physiologie dit que la basale est encore insuffisante, et à qui on interdit de la
   monter. Or dans les ECR treat-to-target, les doses d'entretien **à la cible** montent
   couramment à 0,6-0,78 U/kg (Luo 2023).
5. **Le mécanisme est circulaire chez le patient insulinorésistant** (Davidson) : normaliser par le
   poids ne corrige pas la résistance à l'insuline, qui n'y est pas proportionnelle. Le critère
   pénalise donc structurellement le patient qui a *besoin* de plus d'unités, en interprétant son
   besoin comme une erreur du prescripteur.
6. **Le gate a déjà fabriqué un trou qu'il a fallu rustiner.** La note du YAML documente que
   l'exclusion créait un mutisme (patient sur-basalisé + GAJ hors cible → plus aucune option), rattrapé
   par un élargissement de condition. Un critère qui oblige à élargir une autre condition pour ne pas
   laisser le praticien sans réponse est un critère qui coûte plus qu'il ne rend.
7. **Redondance.** Les marqueurs que l'ADA a mis à la place sont **déjà tous dans le nœud**. Le nœud
   applique déjà la définition 2026 ; le seuil pondéral n'y ajoute qu'une source de désaccord.

### 8.3 Conclusion et proposition

**Conclusion : non, ce repère ne peut pas légitimement porter une exclusion dure.** Les arguments du
§8.1 sont sérieux — surtout le n° 3, l'inefficacité ergonomique d'une simple alerte — mais ils
portent sur la **forme** de l'intervention, pas sur sa **légitimité**. Or l'argument 8.2-1 est d'une
autre nature : un critère retiré par sa source de référence, dont le motif affiché est démenti par les
données de cette même source, et qui n'a d'effet propre que dans le cas où il contredit la
physiologie — ce critère n'a pas le rang requis pour retirer un geste au praticien. Le projet a pour
principe d'afficher la divergence plutôt que de trancher à la place du clinicien quand la preuve
manque ; ici la preuve ne manque pas seulement, elle a été retirée.

**Mais la solution n'est pas de revenir à l'alerte D21**, dont le référent a raison de dire qu'elle ne
faisait rien. Proposition en quatre points, à arbitrer :

- **P1 — Retirer `over_basalisation == true` des `exclusions` de « Titrer la basale ».** Le geste
  redevient disponible.
- **P2 — Le conserver comme déclencheur de « Ne pas sur-titrer la basale — intensifier autrement ».**
  Effet : les deux options s'affichent **côte à côte**, et le praticien arbitre en voyant les deux.
  C'est la réponse à l'objection d'ergonomie : ce n'est plus une alerte marginale sur une carte qui
  recommande le contraire, c'est une **option concurrente visible**. Si le référent veut renforcer le
  signal sans interdire, le levier propre est la `priorite` (afficher « Ne pas sur-titrer » **avant**
  « Titrer »), pas l'exclusion.
- **P3 — Corriger le motif affiché.** Retirer « majore l'hypoglycémie ». Le remplacer par ce que les
  données soutiennent réellement au-delà de ~0,5 U/kg : **rendement décroissant** (plateau de la
  courbe dose-réponse) et **prise de poids** (+1,8 kg, Umpierrez 2019). Et ajouter la mention
  honnête : *seuil retiré par l'ADA en 2025 au profit de marqueurs de profil glycémique.*
- **P4 — Corriger l'attribution dans `incertitudes` et dans `E-insuline.md`.** Le texte actuel
  (« repère SFD / Médicalement Geek ») est inexact sur les deux termes : aucune source SFD n'a été
  retrouvée, et Médicalement Geek se déclare relais de l'ADA 2020. Formulation proposée : *« Avis
  d'expert (grade E) relayé par les ADA Standards 2022-2024, appuyé sur un seul post hoc industriel
  non préspécifié (Umpierrez 2019, N=458) ; retiré par l'ADA en 2025 et absent en 2026 ; aucun ECR
  n'a comparé plafonner-puis-intensifier à continuer-à-titrer. »*

**Option alternative, si le référent veut rester aligné sur l'ADA 2026** : remplacer le dérivé
pondéral par un dérivé d'**écart coucher-réveil ≥ 0,5 g/L** — que le référent connaît déjà (il figure
dans le tableau de sources d'`E-insuline.md`, via Médicalement Geek) et qui est le marqueur retenu par
l'ADA 2026. Coût : un recueil supplémentaire (glycémie au coucher), et un niveau de preuve qui reste
grade E, post hoc et industriel — mieux **fondé** physiologiquement, pas mieux **prouvé**. À noter
que ce marqueur ferait en grande partie doublon avec le pivot nocturne MCG déjà en place (E-03), et
n'apporterait donc de l'information que chez le patient **sans MCG**.

**Si le référent tient malgré tout à une exclusion dure**, la formulation la moins mauvaise serait de
la conditionner au pivot nocturne — n'exclure « Titrer la basale » que si `over_basalisation == true`
**ET** (`gaj_a_cible == true` OU `profil_nocturne_a_cible == true`) — de sorte que le seuil pondéral
ne puisse **jamais** contredire la physiologie. Mais il faut voir que dans ce cas il devient presque
entièrement redondant avec le pivot, ce qui est une raison de plus de choisir P1-P4.
