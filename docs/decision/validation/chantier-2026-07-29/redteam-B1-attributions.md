# Red-team B1 — vérification en source primaire des huit affirmations de la passe A

> Agent **B1 (red-team)**, chantier « Passe A — insuline sans capteur », **2026-07-29**.
> Cible : les affirmations des collectes **A1 · A2 · A3 · A4 · A5**, en priorité celles qui **accusent le
> contenu existant** (`CONSTRUIRE-UN-MODULE.md` §P4 : trois collectes sur quatre ont sur-accusé le nœud
> le 2026-07-27).
>
> **Aucun fichier de `content/`, `src/`, `schema/` n'a été modifié.** Les fichiers `preuve-A*.md` et
> `noeuds/E-insuline.md` n'ont pas été touchés. Ce fichier est le seul écrit.
>
> **Méthode.** Extraction texte des PDF du corpus local (`pdftotext -layout -enc UTF-8`, recoupée par
> `pypdf`), lecture directe des sources en ligne, et — quand la primaire est inaccessible — lecture d'une
> secondaire **nommée**, avec le fait signalé comme tel. Aucun contournement de paywall (invariant 7).

---

## Affirmation 1 — HAS 2011 « fiche BUTS » : existence, verbatim, statut, et renvoi de HAS 2024

**Verdict : VÉRIFIÉE sur les chiffres et le document · PARTIELLEMENT RÉFUTÉE sur le « renvoi explicite ».**

**(a) Le document existe, sous ce titre, à cette date.** HAS, *« L'autosurveillance glycémique dans le
diabète de type 2 : une utilisation très ciblée »*, collection **Bon usage des technologies de santé**,
**avril 2011**, réf. **FBUTSGLYCEM2**, 2 pages. Métadonnées PDF : `CreationDate: Tue Apr 5 18:21:01 2011`.
URL du PDF exactement celle citée par A1
(`has-sante.fr/upload/docs/application/pdf/2011-04/autosurveillance_glycemique_diabete_type_2_fiche_de_bon_usage.pdf`),
page `jcms/c_1045159`. Mention de validation en pied de fiche : « *Validé par la commission nationale
d'évaluation des dispositifs médicaux et technologies de santé de la HAS* ». **Fiche téléchargée et lue
intégralement.**

**(b) Les deux nombres y sont, mot pour mot.** Tableau « Rythme d'ASG suggéré », sous la ligne
« Insulinothérapie en cours », **p. 1** :

> « Objectifs glycémiques : avant les repas, **70 à 120 mg/dL** ; en post-prandial (2 heures après le
> repas) : **< 180 mg/dL**. »

Soit **0,70-1,20 g/L** et **< 1,80 g/L à 2 h**. Le rythme cité par A3/A5 est également verbatim : « *Au
moins 4 par jour si l'insulinothérapie comprend plus d'une injection d'insuline par jour / 2 à 4 par jour
si elle n'en comprend qu'une* ». Le point de remboursement d'A5 l'est aussi : « *Par arrêté ministériel du
25 février 2011, la prise en charge des bandelettes […] est limitée à 200 par an, à l'exception des
patients pour lesquels une insulinothérapie est en cours ou prévue à court ou moyen terme* ».
**A1, A3 et A5 ont cité cette fiche exactement.**

**⚠ Réserve de périmètre, non signalée par les collectes** : la fiche écrit « **avant les repas** »
(pré-prandial, tous repas), pas « **à jeun** ». Le nœud s'en sert comme cible de la **glycémie à jeun**
(`gaj_a_cible`, `gaj_basse`, `gaj_haute`). L'extension est défendable — le jeûne du matin est un
pré-prandial — mais elle n'est **pas** ce que HAS écrit, et doit être dite telle quelle.

**(c) Statut en 2026.** Page HAS `jcms/r_1438006` : « *Mis en ligne le 14 avr. 2011* », « *Mis à jour le
11 janv. 2013* ». **Aucun bandeau de retrait, d'archivage ou de remplacement.** La fiche figure toujours
sur la page thématique « Diabète de type 2 » (`jcms/p_3058418`), section Technologies de santé.
→ **« Toujours en ligne, sans marqueur de retrait » est vérifié.** *« Toujours en vigueur »* au sens
juridique n'est pas affirmable depuis la seule absence de bandeau : je le note comme **non vérifiable en
l'état** (cf. §NON VÉRIFIABLE).

**(d) « HAS 2024 la maintient par renvoi explicite » — la moitié tient, l'autre non.**
L'**exclusion de périmètre est verbatim**, RBP HAS 2024, **p. 5** (`sources/strategie_therapeutique_…pdf`) :

> « Cette mise à jour **ne concerne pas** les recommandations portant sur : ‒ la redéfinition des
> **objectifs glycémiques** ou la place de l'**autosurveillance glycémique** qui restent **maintenues
> selon les recommandations de bonne pratique en cours** (voir annexe pour rappel) ; »

Mais le renvoi **ne nomme pas la fiche de 2011**. Vérifications faites :
- **Annexe 1** (« Travaux élaborés par la HAS en lien avec la thématique », p. 37) : la fiche BUTS **n'y
  figure pas**.
- **Annexe 2** (« Recommandations de bonne pratique sélectionnées », rubrique **HAS**, entrées 19-27,
  p. 38-39) : la fiche BUTS **n'y figure pas** non plus.
- **Annexe 3** (p. 42), à laquelle renvoie « voir annexe pour rappel », ouvre par : « *Cette section
  rappelle les objectifs glycémiques retenus lors des **précédentes recommandations (2013)*** » — et ne
  contient que des cibles d'**HbA1c** (plus « glycémies capillaires préprandiales entre 1 et 2 g/l » chez
  la personne âgée « malade », et les cibles de grossesse « < 0,95 g/l à jeun et < 1,20 g/l en
  post-prandial à 2 heures »). **Ni 0,70-1,20, ni 1,80 g/L n'apparaissent dans la RBP 2024.**

→ **Ce qu'il faut écrire dans le nœud** : « *Cibles capillaires : 0,70-1,20 g/L avant les repas et
< 1,80 g/L à 2 h — **HAS, fiche BUTS « L'autosurveillance glycémique dans le DT2 », avril 2011
(FBUTSGLYCEM2)**, avis CNEDiMTS, **sans niveau de preuve ni référence attachés**. La RBP HAS 2024
**exclut de son périmètre** les objectifs glycémiques et l'ASG, qu'elle laisse « maintenus selon les
recommandations de bonne pratique en cours » (p. 5) **sans nommer la fiche de 2011**.* »
→ **Ne pas écrire** « HAS 2024 renvoie explicitement à la fiche 2011 » : c'est une inférence, pas une
citation. → Le `niveau_preuve` de **l'énoncé du seuil** doit passer à **`tres_faible`** (avis de
commission), indépendamment du `niveau_preuve` du **geste**.

---

## Affirmation 2 — « 0,70-1,20 g/L n'a été retrouvé dans AUCUNE source » (A2)

**Verdict : RÉFUTÉE.** A1/A3/A5 ont raison, A2 a tort — et le conflit s'explique.

L'intervalle **est** dans une source, et c'est celle du §1 : HAS 2011, fiche BUTS, « **avant les repas,
70 à 120 mg/dL** ». A2 ne l'a pas manquée par erreur de lecture : **cette fiche n'est pas dans
`docs/decision/sources/`**, et A2 a explicitement cadré sa recherche sur le corpus local + les sources
accessibles. Sa phrase « n'a été retrouvé dans aucune source » est donc une **recherche négative sur un
périmètre incomplet**, présentée comme un résultat — exactement le défaut que le §P4 nomme.

**Le reste de l'inventaire d'A2 est, lui, exact** — vérifié pièce par pièce :

| Source | Ce qu'A2 dit | Vérification |
|---|---|---|
| **SFD 2025**, Avis n° 18 | 0,80-1,30 g/L | **VÉRIFIÉ verbatim** : « *il faudra viser une glycémie au réveil entre **0,80 g/L et 1,30 g/L*** » (`SFD 2025.pdf`, Avis n° 18, p. 652) |
| **ebmfrance**, fiche insulinothérapie | 0,72-1,08 g/L | **VÉRIFIÉ** : « *l'intervalle cible (**5,0 à 6,0 mmol/l**)* » et « *moyenne des mesures à jeun comprise entre **4,0 et 6,0 mmol/l*** » (`Insulinothérapie… ebmfrance.pdf`) = 0,72-1,08 (et 0,90-1,08) |
| **ADA** | 0,80-1,30 g/L | **VÉRIFIÉ** : *Standards of Care 2026*, ch. 6, **Table 6.3** : « *Preprandial capillary plasma glucose **80-130 mg/dL** (4.4-7.2 mmol/L)* » (PMC12690178) |
| **Riddle 2003** | ≤ 1,00 g/L | **VÉRIFIÉ** : « *a simple algorithm seeking a target fasting plasma glucose **≤100 mg/dl*** » (abstract PubMed 14578243) |

**⚠ Une source du corpus local qu'aucune collecte n'a mise en face de 0,70-1,20** :
`sources/Traitement global et suivi du diabète de type 2 _ ebmfrance.pdf`, **Tableau 1** : « *4 à 7 mmol/l
avant les repas* » = **0,72-1,26 g/L**. C'est la borne la plus proche des chiffres du nœud dans le corpus,
et elle est pré-prandiale comme HAS 2011.

→ **Ce qu'il faut écrire dans le nœud** : l'intervalle **0,70-1,20 g/L est sourcé** (HAS 2011), il n'est
**pas** orphelin. Ce qui est vrai, c'est qu'il **diverge** des cibles contemporaines (SFD 2025 et ADA 2026
disent 0,80-1,30) et qu'il vient d'un **accord d'experts de 2011**, pas d'un essai. Le commentaire actuel
du YAML (l. 232, attribution à Treat-to-Target/Riddle) doit être corrigé — cf. §3.

---

## Affirmation 3 — le pas de titration : SFD 2025 Avis 18 vs Riddle 2003

**Verdict : VÉRIFIÉE en substance (le nœud n'affiche PAS l'algorithme de Riddle) · avec deux corrections
de degré contre A2.**

**(a) Ce que porte réellement Riddle 2003 (PMID 14578243).**
- Cible : « *a simple algorithm seeking a target fasting plasma glucose **≤100 mg/dl (5.5 mmol/l)*** »
  (abstract, *Diabetes Care* 2003;26(11):3080-6).
- Incréments **gradués par bande de FPG** (algorithme reproduit à l'identique, avec appel de référence
  vers Riddle 2003, dans *Diabetes Spectrum* 2019;32(2):104-111, **Table 1**, PMC6528396) :
  **+8 U si FPG ≥ 180 mg/dL · +6 U si 140-180 · +4 U si 120-140 · +2 U si ≥ 100-120**.
- Résultat cité par le nœud : **exact**. « *Approximately 60% of patients achieved HbA1c ≤7%* » ; et
  33,2 % vs 26,7 % sans hypoglycémie nocturne documentée — c'est bien ce que porte la référence
  `treat-to-target` du YAML.

⇒ **Ni le seuil de 40 U, ni le pas en pourcentage, ni les « 3 matins de suite », ni la cible 0,70-1,20
ne viennent de Riddle.** L'attribution portée par les commentaires du YAML (l. 232) et par l'énoncé
« *Algorithme validé (Treat-to-Target…)* » accolé au pas de titration (l. 656) est **inexacte sur le pas**
— exacte sur le seul chiffre de résultat (≈ 60 %).

**(b) Ce que porte réellement SFD 2025 Avis n° 18** (`sources/SFD 2025.pdf`, § 8.10, p. 652 ;
Darmon et al., *Méd. Mal. Métab.* 2025;19(8):630-662, DOI 10.1016/j.mmm.2025.10.002) :

> « […] il faudra viser une glycémie au réveil entre 0,80 g/L et 1,30 g/L et « titrer » l'insuline basale
> dans ce sens (par exemple : **adaptation des doses d'insuline tous les trois jours** en fonction des
> glycémies au réveil, la dose pouvant être **augmentée ou réduite de 2 U** — ou de **10 %** chez les
> patients traités par de fortes doses d'insuline basale, par exemple **supérieures à 40 U/j**). »

**(c) Les deux corrections contre A2.** A2 écrit que le texte du nœud « coïncide **mot pour mot** » avec
l'Avis 18. **Non — sur deux points :**
1. **« 3 matins de suite » n'est pas SFD** (SFD dit « tous les trois jours »). C'est **ebmfrance**,
   verbatim : « *augmenter la dose de **2 unités** si la glycémie à jeun est supérieure à 6,0 mmol/l
   **pendant 3 matins consécutifs*** » (`Insulinothérapie… ebmfrance.pdf`). A2 le mentionne au passage,
   mais son verdict de synthèse écrase la distinction.
2. **« +10-**20** % » n'est dans aucune des deux.** SFD dit **10 %**. Le « 10-20 % » est un chiffre de
   **réduction** (Cowart 2020 : « *consider a **10-20%** basal insulin dose reduction* » en cas
   d'hypoglycémie) ; l'ADA énonce « *adjusted by **10-15%*** ». La fourchette haute de +20 % à la hausse
   au-dessus de 40 U **n'a pas de source retrouvée**.

→ **Ce qu'il faut écrire dans le nœud** :
- ré-attribuer le pas : **SFD 2025 Avis 18** (rythme 3 jours, ±2 U, ±10 % au-delà de ~40 U/j) **+
  ebmfrance** (déclencheur « 3 matins consécutifs ») ;
- garder `treat-to-target` **uniquement** pour la phrase de résultat (« ~60 % atteignent la cible ») et
  pour le principe « titrer sans plafond jusqu'à la cible de GAJ » ;
- **ramener « +10-20 % » à « +10 % »** au-dessus de 40 U/j, ou marquer le 20 % `[À VÉRIFIER]`. La
  descente « −2 à −4 U ou −10-20 % » reste, elle, correctement sourcée (ebmfrance −2/−4 U ; SFD −10 % ;
  Cowart −10-20 %).

---

## Affirmation 4 — `fullstep`, `bertuol`, `quatre-t` ne portent pas le « < 1,80 g/L à 2 h » (A1, H2)

**Verdict : VÉRIFIÉE. Mésattribution de source confirmée dans du contenu publié.**

Phrase visée (`insuline.yaml`, option « Ajouter un bolus au repas principal », `effet_attendu`) :
« *…ajuster sur la glycémie post-prandiale (< 1,80 g/L à 2 h) ou le TAR post-prandial.* » ·
`references: [fullstep, bertuol, quatre-t]` · `niveau_preuve: modere`.

| Référence | Ce qu'elle porte réellement | Porte-t-elle 1,80 g/L ? |
|---|---|---|
| **FullSTEP** (Rodbard, *Lancet Diab Endocrinol* 2014;2(1):30-37, PMID 24622667) | Titration du bolus sur le **prochain relevé PRÉ-prandial de la veille** (pré-déjeuner pour un bolus du petit-déjeuner, pré-dîner pour celui du déjeuner, coucher pour celui du dîner), bande **4,0-7,2 mmol/L (71-130 mg/dL)**, **±1 U** (algorithme « 1-0-1 »). Ajout d'un 2ᵉ puis 3ᵉ bolus **aux semaines 11 et 22 si HbA1c ≥ 7,0 %** | **NON** |
| **Bertuol** (Bertuol Jr VC et al., *Diabetologia* 2026, epub 24/12/2025, **PMID 41436667**, DOI 10.1007/s00125-025-06633-x) | Méta-analyse **en réseau** de 58 ECR / **19 122** participants comparant basale, basal-bolus, biphasique, prandial sur HbA1c, poids, hypoglycémie sévère, dose, qualité de vie. **Aucun seuil de titration n'est un objet de cet article** | **NON** (voir réserve) |
| **4T** (Holman, *NEJM* 2007;357:1716-30, PMID 17890232 ; 3 ans *NEJM* 2009;361:1736-47, PMID 19850703) | Algorithme informatisé, **cibles identiques dans les 3 bras** : avant les repas **72-99 mg/dL (4,0-5,5 mmol/L)**, **2 h après les repas 90-126 mg/dL (5,0-7,0 mmol/L)**. Escalade décidée sur l'**HbA1c** | **NON — sa cible post-prandiale est 1,26 g/L** |

**⇒ Aucune des trois références n'énonce le nombre affiché à côté d'elles.** L'affirmation d'A1 tient, et
c'est le seul point de la passe A qui met en cause du contenu **publié**.

**Le nombre lui-même n'est pas orphelin pour autant** (et c'est là qu'A1 est plus juste que le cadrage de
la passe, cf. §5) : il est porté par **HAS 2011** (§1), par **ADA Standards** (Table 6.3 : « *Peak
postprandial capillary plasma glucose **<180 mg/dL** (<10.0 mmol/L)* », avec la note « *Postprandial
glucose may warrant special attention if A1C goals are not met despite reaching preprandial glucose
goals* »), et par le corpus local (`Traitement global… ebmfrance.pdf`, Tableau 1 : « *< 10 mmol/l après
les repas* »).

**Un second écart, qu'A1 signale et que je confirme** : le verbe **« ajuster sur »** est plus fort que ce
que la preuve autorise. FullSTEP — la seule des trois références qui instrumente le geste — **n'ajuste
pas sur la post-prandiale**, elle ajuste sur le **pré-prandial suivant**. Écrire « ajuster sur la
glycémie post-prandiale » et citer FullSTEP dit littéralement le contraire de ce que FullSTEP a fait.

→ **Ce qu'il faut écrire dans le nœud** : (i) retirer `bertuol` et `quatre-t` de l'appui de cette phrase,
ou dissocier l'appui du **geste** (basal-plus par étapes → `fullstep`, `quatre-t`, `bertuol` : légitime)
de l'appui du **seuil** (→ `HAS 2011` / `ADA Standards`, accord d'experts) ; (ii) requalifier
« *ajuster sur* » en « *contrôler la glycémie post-prandiale (repère HAS 2011 / ADA : < 1,80 g/L à 2 h)* »
ou aligner le libellé sur le **pré-prandial suivant**, qui est ce que FullSTEP a validé ; (iii) le
`niveau_preuve: modere` reste correct pour le geste, **pas** pour le seuil.

---

## Affirmation 5 — le relais francophone citait Cowart 2020, pas les Standards ADA 2020

**Verdict : VÉRIFIÉE sur le fait · avec une correction sur la prémisse et une correction de portée.**

**(a) Le billet.** *Médicalement Geek*, **Dragi Webdo n° 300, 14 février 2021**
(`medicalement-geek.com/2021/02/dragi-webdo-n300.html`), verbatim :

> « Il faut penser à introduire des doses d'insuline rapide si le dosage d'insuline basale est
> > 0,5 UI/kg, les glycémie post prandiale sont > 1,80 g/L, la différence entre glycémie au coucher et
> celle au réveil est > 0,5 g/L »

Le paragraphe **cite une seule référence**, un lien en clair vers `clinical.diabetesjournals.org/content/38/3/304`.
**Il ne cite pas les Standards ADA 2020.** ✔ A1 a raison.

**(b) Cet article est bien Cowart 2020**, *« Overbasalization: Addressing Hesitancy in Treatment
Intensification Beyond Basal Insulin »*, *Clinical Diabetes* 2020;38(3):304-310, **PMID 32699482**,
**PMC7364465**, DOI 10.2337/cd19-0061 — **revue narrative**. Son **Tableau 1** (« *How to identify
overbasalization* ») liste quatre puces, dont « *Postmeal blood glucose **>180 mg/dL*** ».
**Lu en texte intégral (PMC ouvert).**

**(c) Le seuil post-prandial y est bien sans justification.** Dans le corps de l'article :
- le **0,5 U/kg/j** est argumenté et référencé (effet plafond, réf. 13, 17-21, dont un post-hoc poolé de
  15 ECR treat-to-target) ;
- le **BeAM ≥ 50 mg/dL** est argumenté et référencé (réf. 39, 40) ;
- le **« Postmeal blood glucose >180 mg/dL » n'est repris nulle part dans le corps**, et **aucune
  référence ne lui est attachée**. ✔ A1 a raison sur le fond.

**⚠ Correction de détail contre A1** : dans le **tableau lui-même**, **aucune** des quatre puces ne porte
d'appel de référence. La phrase d'A1 « *les deux autres en portent* » est vraie du **corps de l'article**,
pas du tableau. Nuance mineure, mais A1 la présente comme une lecture du tableau.

**⚠ Correction de prémisse, contre l'énoncé de ma propre mission** : la formule « *sa seule trace est un
relais francophone des Standards ADA 2020* » **ne vient pas de `noeuds/E-insuline.md`**. Vérifié :
`E-insuline.md` l. 379 se contente d'une ligne descriptive « Méd. Geek / DragiWebdo » sans attribution
ADA. La formule vient de `PROMPTS-OE-passeA.md` l. 27 et de `vignettes-insuline-sans-capteur.md` l. 180,
et elle **reprend une conclusion du 2026-07-27** (`redteam-sur-basalisation.md` § Question 6) qui portait
sur **DragiWebdo n° 280 (13/09/2020)** et sur le marqueur **0,5 U/kg** — un **billet différent**, où le
cadrage ADA 2020 était bien explicite. **Les deux constats sont vrais et ne se contredisent pas** : ils
parlent de deux billets et de deux chiffres différents.

**⚠ Correction de portée, décisive** : « le relais ne cite pas l'ADA » **ne veut pas dire** « le nombre
n'a pas de source ». **Vérifié en source primaire** : ADA, *Standards of Care in Diabetes*, ch. 6,
**Table 6.3** — « *Peak postprandial capillary plasma glucose **<180 mg/dL** (<10.0 mmol/L)* » (édition
2026 lue sur PMC12690178 ; le seuil est stable d'édition en édition). Et la revue narrative FullSTEP
(PMC5983081) l'attribue explicitement à l'ADA : « *The ADA guidelines indicate that lowering PPG to
<180 mg/dl (<10.0 mmol/l) is a reasonable treatment strategy…* ». **Le 1,80 g/L a donc deux ancrages
officiels indépendants (HAS 2011, ADA Standards) et un ancrage dans le corpus local (ebmfrance).**

→ **Ce qu'il faut écrire dans le nœud** : le seuil **< 1,80 g/L à 2 h** est un **objectif de surveillance
d'accord d'experts**, porté par **HAS 2011 (FBUTSGLYCEM2)** et **ADA Standards, Table 6.3**, **pas** un
seuil de décision validé par essai. La chaîne Méd. Geek → Cowart 2020 est un **relais**, pas la source :
elle ne doit **pas** être citée comme fondement.

---

## Affirmation 6 — SFD 2025 porte bien le seuil de 0,5 U/kg/j (Avis 19)

**Verdict : VÉRIFIÉE. La conclusion red-teamée du 2026-07-27 était FAUSSE.**
**En revanche, l'explication qu'A2 en donne est, elle, RÉFUTÉE.**

**(a) Le fait.** `sources/SFD 2025.pdf`, **Avis n° 19** (« Objectif d'HbA1c non atteint sous
insulinothérapie basale + metformine », figure 9), § 8.10, **p. 654**, verbatim :

> « En cas de résultats insuffisants sous insulinothérapie basale + metformine (HbA1c > objectif malgré
> des glycémies à jeun dans la cible ou HbA1c > objectif et glycémie à jeun au-dessus de la cible malgré
> de fortes doses d'insuline basale, c'est-à-dire **plus de 0,5 U/kg/j**), l'avis d'un
> endocrinologue-diabétologue est souhaitable. »

**(b) Ce que ça invalide, nettement.** `chantier-2026-07-27/preuve-sur-basalisation.md` conclut :
« *aucun document SFD énonçant ce seuil n'a été retrouvé […] L'attribution « SFD » du dépôt paraît
**erronée*** » (§ 2.5), et son P4/§ 10 : « *recherche négative : aucun document SFD portant ce seuil n'a
été trouvé* ». Le red-team du même jour a **confirmé** ce verdict (`redteam-sur-basalisation.md`,
§ Question 6 : « *SFD — recherche négative confirmée* »). **Les deux se trompaient.** Le seuil est dans la
prise de position SFD 2025, dans le PDF déjà présent dans `docs/decision/sources/` depuis le 2026-07-23.

**(c) La cause n'est pas celle qu'A2 avance.** A2 attribue le faux négatif à un « PDF non extractible »,
en citant le red-team de 2026-07-27 (§ 7-4 : « *Prise de position SFD 2025, PDF officiel — téléchargé
(1,6 Mo) mais flux PDF compressé non extractible* »). **Testé ici sur le fichier local :**

| Méthode | Résultat sur `SFD 2025.pdf` (15,4 Mo, 33 p.) | « 0,5 U/kg » trouvé ? |
|---|---|---|
| `pdftotext -layout -enc UTF-8` | 188 826 caractères | **oui** |
| `pdftotext -enc UTF-8` (brut) | 540 lignes non vides | **oui** |
| `pypdf.PdfReader.extract_text()` | 136 771 caractères | **oui** |

**Le PDF local s'extrait par les trois méthodes.** Le fichier de 1,6 Mo évoqué le 2026-07-27 était un
téléchargement web, **pas** le fichier du corpus : le corpus local n'a jamais été ouvert pour cette
question, alors que `00-global.md` § « Sources locales déjà disponibles » l'exige en toutes lettres
(« *Avant de chercher une source sur le web ou de la demander au référent, vérifier ce dossier* »).
Aggravant : **dans le même chantier**, `redteam-seuils-renaux.md` § 7.2 avait déjà renversé un verdict
« PDF non extractible » (« *Je l'ai extrait sans difficulté* ») — le signal était disponible le jour même.

> ⚠ *Note pypdf* : « Avis no 19 » n'est **pas** trouvable par `pypdf` (0 occurrence) alors que
> `pdftotext` le trouve. Une recherche par **titre d'avis** peut échouer là où une recherche par **chiffre**
> réussit. C'est une leçon d'outillage à retenir, pas une excuse pour le 2026-07-27.

**(d) Ce que le fait établit — et ce qu'il n'établit pas.** Conformément à ma mission, **je n'en conclus
pas que l'arbitrage doit être rouvert.** J'établis : (i) la SFD 2025 **porte** le nombre 0,5 U/kg/j ;
(ii) elle l'emploie comme **déclencheur d'un recours au spécialiste et d'une MCG**, pas comme une
interdiction de titrer ; (iii) la phrase affichée par `insuline.yaml` l. 617 — « *retiré des Standards
ADA en 2025 mais reste retenu par l'AACE* » — est **factuellement incomplète** : il est aussi retenu par
la **reco française de référence du nœud**.

→ **Ce qu'il faut écrire dans le nœud** : ajouter la SFD 2025 Avis 19 comme porteur du repère, avec sa
formulation exacte (« *l'avis d'un endocrinologue-diabétologue est souhaitable* » + indication de MCG),
et rétablir l'attribution « SFD » dans `incertitudes` **avec la référence précise**, au lieu de la
recherche négative de 2026-07-27.

---

## Affirmation 7 — 0,70 g/L = seuil d'hypoglycémie au sens du Tableau II de la SFD (A5, divergence D-1)

**Verdict : VÉRIFIÉE.**

`sources/SFD 2025.pdf`, **Tableau II** (p. 633), intitulé « *Objectifs individualisés de temps dans la
cible, en dessous et au-dessus de la cible chez les patients vivant avec un DT2 utilisant un dispositif
de mesure en continu du glucose (selon **Battelino et al. Diabetes Care 2019;42:1593-1603**)* ».
En-têtes de colonnes, verbatim :

> « Temps passé dans la cible (TIR) **0,70-1,80 g/L** | Temps passé en dessous de la cible (TBR)
> **< 0,70 g/L** · **< 0,54 g/L** | Temps passé au-dessus de la cible (TAR) **> 1,80 g/L** · **> 2,50 g/L** »

Et l'**Avis n° 3** (p. 631) nomme explicitement ce TBR : « *le temps passé dans la cible 0,70-1,80 g/L
(Time in Range, TIR), **le temps passé en hypoglycémie (Time Below Range, TBR)** ou en hyperglycémie
(Time Above Range, TAR)* ». **La SFD assimile donc bien « < 0,70 g/L » à « hypoglycémie ».**

**Conséquence exacte sur le nœud, vérifiée dans le YAML** :
- `gaj_basse` = `situation_insuline != naif AND GAJ < 0.7` — **c'est mot pour mot le seuil
  d'hypoglycémie de la SFD** ;
- `gaj_a_cible` = `GAJ >= 0.7 AND GAJ <= 1.2` — **la borne basse de la cible commence exactement là où
  finit l'hypoglycémie**. Un patient à 0,71 g/L le matin est « à cible » pour le nœud, à une unité près
  d'être en hypoglycémie pour la SFD.

**Deux réserves à porter avec le constat** (aucune ne l'annule) :
1. Le Tableau II est une métrique de **MCG (glucose interstitiel)**, pas une cible **capillaire**. Le
   seuil de 0,70 g/L y est un plancher de sécurité, pas le bas d'une cible de titration.
2. La **cible capillaire à jeun** de la SFD est ailleurs — Avis 18, **0,80-1,30 g/L** — et c'est bien de
   là que vient la divergence D-1. ADA Table 6.3 dit de même **80-130 mg/dL**. Les deux camps décrits par
   A5 (**HAS 2011 : 0,70-1,20** vs **SFD 2025 + ADA 2026 : 0,80-1,30**) sont **vérifiés l'un et l'autre**.

→ **Ce qu'il faut écrire dans le nœud** : le commentaire actuel (l. 238-240) énonce déjà correctement le
constat, mais au conditionnel (« *seraient donc confondus* »). Il peut passer à l'indicatif : **c'est
vérifié**. La décision — garder 0,70-1,20 (HAS 2011, cohérence avec l'existant) ou aligner sur 0,80-1,30
(SFD 2025 + ADA 2026, marge de sécurité de 0,10 g/L au-dessus du seuil d'hypoglycémie) — reste un
**arbitrage référent**, que je ne tranche pas.

---

## Affirmation 8 — le « référentiel SFD 2017 sur la MCG », § 8.6.3 (A4)

**Verdict : identité du document VÉRIFIÉE · contenu PARTIELLEMENT VÉRIFIÉ · caractérisations
(« table complète », « se contredit ») RÉFUTÉES.**

**(a) Ce que le document est.** `sources/mmm_referentielmcg_ep11.pdf` (45 p.) = **« Éducation à
l'utilisation pratique et à l'interprétation de la Mesure Continue du Glucose : position d'experts
français »**, *Médecine des maladies Métaboliques*, **Hors série n° 1, Vol. 11, juin 2017**. Le groupe de
travail parle de « *ce référentiel* » (p. S31). La **SFD** y est **l'une des sociétés impliquées** parmi
plusieurs (CNPEDMM, SFD, SFE, CODEHG, EVADIAC, FFD, AJD, cités p. S3), pas l'auteur unique.
**Ce n'est en aucun cas le Collège de la Médecine Générale** : `mcg` = **Mesure Continue du Glucose**.
→ **La correction d'étiquetage déjà actée (nœud D, MEMORY) est confirmée**, et A4 la reprend
correctement. Dire « référentiel SFD 2017 » est un raccourci acceptable ; dire « référentiel du CMG »
serait faux.

**(b) Ce que § 8.6.3 dit réellement.** Titre exact : « **8.6.3. Détermination des besoins basaux dans la
journée et dans la soirée** » (p. S22). Les deux citations d'A4 sont **verbatim** :

> « En raison de la cinétique des analogues rapides de l'insuline, **l'effet du bolus prandial se
> manifeste pendant les 4 heures qui suivent l'administration** [78]. »

> « De la même façon, la période **(0-4 heures)** peut être influencée par le **bolus prandial du soir**,
> surtout lorsque les repas sont pris **tardivement (après 20 heures)**. Il convient dans ce cas
> d'**avancer ou de réduire le bolus prandial plutôt que de baisser le débit basal**, pour conserver un
> ratio bolus/basal dans l'idéal autour de 50 % [79]. »

**(c) Trois corrections.**
1. **Il n'y a AUCUNE table dans § 8.6.3.** C'est de la prose. Le document contient neuf tableaux
   (I à IX) ; **aucun** n'est une correspondance « créneau horaire → composant d'insuline ». Le seul
   élément d'attribution horaire est la **phrase de cinétique** ci-dessus (fenêtre de 4 h après le bolus).
   Parler de « la table d'attribution complète » — formule qu'A4 emploie deux fois — **surqualifie une
   phrase de physiologie**. Aucune source du corpus ne publie la table des quatre créneaux ; le constat
   d'A4 sur ce point est en réalité **plus fort** que ce qu'il en dit.
2. **Le document ne se contredit pas.** Il énonce une règle générale, puis **son exception explicitement
   introduite** (« *De la même façon…* », « *surtout lorsque…* », « *dans ce cas* »). A4, dans son propre
   fichier, l'écrit correctement — « *elle l'énonce et la relativise dans la même page* ». La formulation
   « se contredit frontalement » est un durcissement à ne pas reprendre.
3. **L'instruction est « avancer OU réduire »**, pas seulement « réduire » : le premier levier proposé est
   le **timing** du bolus, pas la dose.

**(d) Validité externe, à ne pas perdre.** Tout § 8.6 raisonne en **débit basal de pompe** (« *baisser le
débit basal* », « *débits temporaires* », « *arrêts de pompe* ») — donc contexte **DT1 / pompe**.
L'extrapolation au DT2 sous basale en médecine générale n'est **pas testée**. A4 le signale ; c'est exact
et c'est le point le plus important du § 8 pour le nœud.

→ **Ce qu'il faut écrire dans le nœud** : la fenêtre « *effet du bolus prandial sur les 4 heures qui
suivent* » et son contre-exemple (dîner après 20 h → la première partie de la nuit peut accuser le bolus
du soir) peuvent servir d'**argumentaire**, sourcés « *SFD/experts français 2017, position d'experts,
contexte DT1/pompe* ». Ils ne peuvent **pas** fonder un **gate** ni une table de créneaux fixes.

---

## Tableau récapitulatif

| # | Affirmation | Verdict | Ce qui change |
|---|---|---|---|
| 1 | HAS 2011 « BUTS » porte 0,70-1,20 et < 1,80 verbatim, toujours en vigueur, maintenue par renvoi explicite de HAS 2024 | **VÉRIFIÉE** (document, verbatim, absence de retrait) · **PARTIELLEMENT RÉFUTÉE** (renvoi HAS 2024 réel mais **générique**, la fiche 2011 n'est nommée dans aucune annexe ; « avant les repas » ≠ « à jeun ») | Sourcer les deux nombres sur HAS 2011 ; `niveau_preuve` du seuil → `tres_faible` ; ne pas écrire « renvoi explicite » |
| 2 | 0,70-1,20 g/L n'existe dans aucune source | **RÉFUTÉE** — il est verbatim dans HAS 2011. Le reste de l'inventaire d'A2 (SFD/ebmfrance/ADA/Riddle) est **exact** | L'intervalle est sourcé, pas orphelin ; il **diverge** de SFD 2025 / ADA 2026 (0,80-1,30) |
| 3 | Le pas du nœud est SFD Avis 18 « mot pour mot », pas Riddle | **VÉRIFIÉE en substance** (Riddle = +2/+4/+6/+8 U par bande, cible FPG ≤ 100 mg/dL) · **2 corrections** : « 3 matins de suite » = **ebmfrance** ; « +10-**20 %** » n'est **ni** SFD (10 %) **ni** ADA (10-15 %) | Ré-attribuer le pas à SFD 18 + ebmfrance ; garder Riddle pour le seul « ~60 % » ; ramener +20 % à `[À VÉRIFIER]` |
| 4 | `fullstep`/`bertuol`/`quatre-t` ne portent pas « < 1,80 g/L à 2 h » | **VÉRIFIÉE** — FullSTEP titre sur le **pré-prandial suivant** (4,0-7,2 mmol/L, ±1 U) ; 4T vise **1,26 g/L** à 2 h ; Bertuol est une NMA de schémas | **Mésattribution dans du contenu publié.** Dissocier appui du geste / appui du seuil ; « ajuster sur » est trop fort |
| 5 | Le relais francophone citait Cowart 2020, dont le tableau donne le seuil sans référence | **VÉRIFIÉE** (DragiWebdo n° 300 → un seul lien, *Clin Diabetes* 38(3):304 ; la puce « >180 mg/dL » n'est référencée ni justifiée) · **prémisse et portée corrigées** | Le nombre reste **sourcé ailleurs** : HAS 2011 + **ADA Table 6.3**. La chaîne Méd. Geek → Cowart est un relais, pas un fondement |
| 6 | SFD 2025 porte 0,5 U/kg/j (Avis 19) ; le 2026-07-27 a produit un faux négatif | **VÉRIFIÉE** — et la conclusion red-teamée du 2026-07-27 était **fausse**. **Mais l'explication d'A2 (« PDF non extractible ») est RÉFUTÉE** : le PDF local s'extrait par pdftotext (2 modes) **et** pypdf ; le corpus local n'avait pas été ouvert | Rétablir l'attribution SFD avec la référence exacte ; compléter la phrase l. 617. **Arbitrage non rouvert** |
| 7 | 0,70 g/L = seuil d'hypoglycémie du Tableau II SFD, confondu avec la borne basse de la cible | **VÉRIFIÉE** — Tableau II (d'après Battelino 2019) + Avis 3 (« TBR = temps passé en hypoglycémie »). `gaj_basse` = `GAJ < 0.7` **est** le seuil d'hypo SFD | Passer le commentaire du conditionnel à l'indicatif ; le choix 0,70-1,20 vs 0,80-1,30 reste **arbitrage référent** |
| 8 | Le référentiel SFD 2017 MCG § 8.6.3 écrit la table créneau→composant et se contredit | **Identité VÉRIFIÉE** (position d'experts fr. 2017 sur la Mesure Continue du Glucose, **pas** le CMG) · **contenu verbatim VÉRIFIÉ** · **« table » et « se contredit » RÉFUTÉES** (prose, pas de tableau ; exception explicite, pas contradiction ; « avancer **ou** réduire ») | Utilisable comme **argumentaire** seulement ; contexte **DT1/pompe** ; ne fonde **aucun** gate ni créneau fixe |

**Bilan de polarité.** Sur huit affirmations : **quatre confirment le contenu ou le sourcent mieux**
(1, 2, 5, 6) ; **deux le mettent en cause à raison** (4 : mésattribution publiée ; 7 : borne basse =
seuil d'hypoglycémie) ; **deux sont vraies mais surqualifiées** (3, 8). Le seul défaut **du nœud
lui-même** établi par cette passe est l'affirmation **4**. Les affirmations **2**, **6** (volet cause) et
**8** (volets « table » / « contradiction ») sont des **sur-accusations ou sur-qualifications de
collecte**, conformes au motif du § P4.

---

## Ce qui reste NON VÉRIFIABLE, et pourquoi

| Point | Motif | Impact décisionnel |
|---|---|---|
| **Statut juridique** de la fiche HAS 2011 (« en vigueur » au sens réglementaire, vs « en ligne sans bandeau de retrait ») | La HAS n'affiche pas d'état d'abrogation sur ses fiches BUTS ; l'absence de bandeau n'est pas une preuve d'opposabilité | **Faible** — pour le nœud, « source officielle française publiée, jamais retirée, non rouverte par la RBP 2024 » suffit et se dit sans sur-affirmer |
| **Cadence hebdomadaire** de l'algorithme de Riddle 2003 | *Diabetes Care* 2003 : `diabetesjournals.org` renvoie **403** (Cloudflare). Bandes et incréments confirmés via *Diabetes Spectrum* 2019, Table 1 (PMC6528396) qui cite Riddle en réf. 50 ; la **fréquence** n'y est pas reproduite | **Nul** — le constat décisionnel (« le pas du nœud n'est pas celui de Riddle ») tient sur les bandes et la cible ≤ 100 mg/dL, déjà vérifiées |
| **Texte primaire de FullSTEP** (Lancet Diab Endocrinol 2014) | Paywall Elsevier, aucun PMC. Algorithme « 1-0-1 » et bande 4,0-7,2 mmol/L lus dans une **revue en accès libre reproduisant le Table 1 de l'essai** (PMC5983081), corroborés par l'abstract PubMed (escalade sur HbA1c ≥ 7 % à S11/S22) | **Faible** — deux canaux concordants ; aucun ne contient 180 mg/dL |
| **Texte primaire de 4T** (NEJM 2007 et 2009) | `nejm.org` renvoie **403** (Cloudflare) sur les deux articles. Cibles « avant les repas 72-99 mg/dL / 2 h après les repas 90-126 mg/dL » lues via un **rendu secondaire du texte NEJM**, non ouvert directement | **Faible** — le point décisionnel (« 4T ne visait pas 1,80 g/L ») tient quelle que soit la valeur exacte, mais **le nombre 1,26 g/L reste `[À VÉRIFIER]` en primaire** |
| **Texte intégral de Bertuol 2026** | Paywall Springer (redirection IdP). Titre, auteurs, 58 ECR / 19 122 participants, critères et résultats confirmés via PubMed **41436667** | **Faible** — une NMA de schémas ne peut structurellement pas être la source d'un objectif glycémique ; mais l'absence n'est prouvée que sur l'abstract |
| **Numérotation de la reco ADA sur la sur-basalisation** (9.26, grade E) — reprise d'A4 | Non re-vérifiée ici : hors des huit affirmations qui m'étaient confiées | À traiter dans la revue du § 4 d'A4 |
| **`prescrire 12.pdf`** | Fichier **vide** dans le dépôt — à re-fournir par le référent (déjà signalé aux nœuds D, E, H) | Prescrire ne traite ni la titration ni les cibles capillaires dans les notes locales P1-P13 (constat négatif d'A2 **vérifié** par lecture de `prescrire-dt2.md`) |

**Défaut de corpus confirmé au passage** : `sources/NICE 2023.pdf` est bien **NG238**, « *Cardiovascular
disease: risk assessment and reduction, including lipid modification* » (métadonnées PDF : `Subject`
= NG238, `Author` = NICE) — **pas** NG28 (diabète). Le doute listé dans ma mission est **levé** : c'est la
source du nœud statine, hors périmètre insuline.

**Deux fichiers à verser dans `docs/decision/sources/`** (aucun n'y est aujourd'hui, et les deux portent
des chiffres structurants du nœud) : la **fiche HAS BUTS avril 2011 (FBUTSGLYCEM2)** et le **chapitre 6
des ADA Standards of Care** (Table 6.3).

---

*Fichier produit par l'agent B1 (red-team), passe A, 2026-07-29. Aucun `content/`, `src/`, `schema/`,
`preuve-A*.md` ni `E-insuline.md` modifié.*
