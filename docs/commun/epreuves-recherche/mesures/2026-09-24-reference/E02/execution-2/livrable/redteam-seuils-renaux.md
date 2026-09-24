# Red-team (Agent B) — seuils rénaux du sulfamide et du glinide (nœud `prescription`, DT2)

Circuit `recherche-preuve-triangulee`, étape 2. **Périmètre restreint par le référent** : cette passe
red-team porte sur le retour OpenEvidence brut seul (`epreuve/entrees/OE-retour-brut-extrait.md`), il
n'existe pas de rapport Agent A pour ce chantier à attaquer conjointement — c'est un écart assumé au
gabarit standard du skill, pas un oubli. **Priorité de mission fixée par le référent** : les affirmations
du retour OE portant sur les recommandations françaises (SFD, HAS). Aucune requête OpenEvidence n'a été
posée pour ce travail (interdiction explicite de la mission, respectée).

## Accès

| Source | Statut d'accès |
| --- | --- |
| `docs/decision/sources/SFD 2025.pdf` (Prise de position SFD 2025, DT2) | **Obtenu** — texte intégral extrait (33 p. du PDF = pagination imprimée 630-662) |
| `docs/decision/sources/HAS 2025 - Parcours de soins DT2 - guide.pdf` | **Obtenu** — texte intégral extrait (113 p.) |
| `docs/decision/sources/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf` (HAS, reco stratégie médicamenteuse) | **Obtenu** — texte intégral extrait (56 p.) |
| `docs/decision/sources/prescrire-dt2.md` | Obtenu (déjà en clair) |
| Sources internationales citées par OE (KDIGO 2022, ADA 2026, Endocrine Society 2019, KDOQI 2012, FDA labels, ADVANCE, CPRD *BMJ* 2016, etc.) | **Non couvert dans cette passe** — hors périmètre prioritaire fixé par le référent (affirmations françaises). À rouvrir dans un tour ultérieur si le référent le demande. |
| Figure 3 de SFD 2025 (tableau couleur DFG × molécule, p. 16 du PDF / p. 645 imprimée) | **Partiellement bloqué** — limite technique locale (rendu image par tranches `pages=` indisponible, `pdftoppm`/poppler absent de l'environnement) ; le texte brut extrait ne restitue pas l'association cellule-couleur-colonne. Le texte des Avis n°12/12 bis comble ce trou pour les deux questions posées, mais le détail fin par palier intermédiaire (ex. réduction de dose 30-59 vs 45-59 par molécule) reste non vérifiable par ce biais. |

## Findings classés par sévérité et par origine

### HAUTE — OpenEvidence seule fautive

**F1. La table OE affirme qu'aucun texte SFD/HAS ne donne de seuil de DFG pour les sulfamides — c'est faux pour la SFD.**

> Citation OE (ligne « French SFD / HAS » du tableau §1) : *« No specific SFD/HAS guideline text on sulfonylurea eGFR thresholds was identified in the literature. French practice generally follows ESC/EASD and EMA labelling. »*

Or, **SFD 2025** (`SFD 2025.pdf`, p. 3 du PDF = p. 632 imprimée, Tableau I, note 2) énonce noir sur blanc :

> « Les sulfamides hypoglycémiants sont contre-indiqués en cas d'IRC sévère ou terminale. »

— avec le seuil chiffré donné juste au-dessus dans la même note (stade 4 : DFG 15-29 mL/min/1,73 m² ; stade 5 : DFG < 15), et confirmé de façon plus opérationnelle en **Avis n°12** (p. 14 du PDF = p. 643 imprimée) :

> « Chez les patients vivant avec un DT2 et présentant une IRC sévère (DFG entre 15 et 29 mL/min/1,73 m2) ou terminale (DFG < 15 mL/min/1,73 m2), on visera une HbA1c cible ≤ 8 % (64 mmol/mol), avec une limite inférieure de 7 % (53 mmol/mol) en cas de traitement par glinide ou insuline (**SU contre-indiqués**), pour minimiser le risque hypoglycémique. »

Et en **Avis n°12 bis** (p. 15 du PDF = p. 644 imprimée), la liste des molécules autorisées au stade sévère (DFG 15-29) omet explicitement les sulfamides (glimépiride, gliclazide, glibenclamide), cohérent avec la contre-indication.

C'est donc un **seuil chiffré, explicite, opposable** (DFG < 30 mL/min/1,73 m², soit stades 4-5) — exactement ce qu'OE affirme ne pas exister dans la littérature SFD/HAS. La phrase de repli d'OE (« French practice generally follows ESC/EASD and EMA labelling ») est elle-même une généralisation **sans référence numérotée** (seule ligne du tableau OE sans `[n]` associé), alors que la SFD a une position française propre, distincte d'un simple renvoi au libellé EMA.

**Impact** : si le nœud `prescription` avait été rédigé sur la base du retour OE brut sans vérification, il aurait manqué la position française opposable et aurait pu laisser croire qu'aucun repère chiffré français n'existe — faux, et potentiellement dangereux (le seuil existe et doit gater la prescription).

---

**F2. La table OE affirme qu'aucun texte français ne traite du répaglinide en IRC terminale — c'est faux pour la SFD, qui le nomme explicitement et de façon plus précise que la source « la plus permissive » citée par OE.**

> Citation OE (ligne « French HAS/SFD » du tableau §3, section répaglinide) : *« No specific French guideline text on repaglinide in ESRD was identified. French practice generally follows EMA labelling, which permits use with caution in severe renal impairment (CrCl 20-40) but is silent below CrCl 20. »*
> Citation OE (bottom line du même paragraphe) : *« The most specific endorsement comes from the Swiss Society for Endocrinology and Diabetology, which states it "may be used in dialysis patients." »*

Or, **SFD 2025**, Avis n°12 bis (p. 15 du PDF = p. 644 imprimée), stade IRC terminale :

> « Au stade d'IRC terminale (DFG < 15 mL/min/1,73 m2), parmi les molécules commercialisées en France, seuls **l'insuline, le répaglinide** (avec un risque d'hypoglycémies pour ces deux traitements), la vildagliptine à la dose de 50 mg/j et la sitagliptine à la dose de 25 mg/j (forme non commercialisée en France) peuvent être utilisés. »

Et la Figure 3 (p. 16 du PDF = p. 645 imprimée) porte une colonne « < 15 ou dialyse (IRC terminale) » avec une ligne « Répaglinide », confirmant que le palier couvre nommément la dialyse.

Cette position SFD est **au moins aussi permissive** que celle de la Swiss Society citée par OE comme « la plus spécifique identifiée » (« may be used in dialysis patients ») — SFD le classe parmi les rares molécules *utilisables* à ce stade, sans contre-indication énoncée, seule réserve le risque d'hypoglycémie. OE a donc raté, sur une question qu'elle devait explicitement chercher côté France, la source française la plus directement pertinente et la plus autorisée pour ce nœud (SFD = société savante française de référence du projet).

**Impact** : identique à F1 — un nœud rédigé sur le retour OE brut aurait sous-estimé l'existence d'une position française claire et aurait pu se rabattre sur une source étrangère (suisse) moins directement opposable en France.

---

### MOYENNE — OpenEvidence seule (risque de cadrage, pas une erreur factuelle isolée)

**F3. Le message « gliclazide utilisable jusqu'à eGFR ~30 » (nuance PK internationale mise en avant par OE) risque d'entrer en tension avec la position SFD, qui ne distingue pas les molécules de la classe SU au seuil de DFG 30.**

OE consacre une section entière (§2, « Is Gliclazide Safer in CKD ? ») à argumenter que le gliclazide, du fait de ses métabolites inactifs, serait plus sûr que le glimépiride/glibenclamide en IRC, et cite l'essai ADVANCE comme support d'un usage « down to eGFR ~30 without excess hypoglycemia ». La SFD 2025, elle, formule la contre-indication au stade IRC sévère/terminale (DFG < 30) **pour « les sulfamides hypoglycémiants »** comme classe, sans exception nommée pour le gliclazide dans le texte de l'Avis n°12/12 bis relevé. La Figure 3 distingue bien Glimépiride et Gliclazide en lignes séparées, mais l'association cellule-couleur-colonne n'a pas pu être vérifiée (cf. tableau des accès ci-dessus) — impossible donc de confirmer ou d'infirmer une nuance par molécule à un palier intermédiaire (30-59) depuis cette figure.

**Risque concret pour le nœud** : reprendre tel quel le cadrage OE pourrait suggérer une marge de manœuvre pour le gliclazide sous ou près de DFG 30 non couverte par la position SFD opposable en France, qui est catégorique par classe au même seuil. Un futur tour de vérification devrait rouvrir spécifiquement la Figure 3 (rendu image, pas extraction texte) pour trancher si la SFD distingue les molécules entre 30 et 59, avant tout libellé qui nommerait le gliclazide spécifiquement.

---

### BASSE — OpenEvidence seule (défaut de synthèse, sans conséquence chiffrée directe sur le périmètre France)

**F4. Mélange non signalé entre CrCl (Cockcroft-Gault, labels FDA/EMA) et eGFR (KDIGO/ADA, et DFG au sens SFD/HAS) comme s'ils étaient interchangeables.**

Le retour OE bascule sans avertissement entre « CrCl » (sections FDA/EMA sur le répaglinide, ex. « CrCl 20-40 mL/min ») et « eGFR » (sections KDIGO/ADA/Endocrine Society), alors que les deux ne coïncident pas systématiquement (écart net chez les patients à masse musculaire faible ou âgés — situation fréquente en DT2 avec IRC). La SFD 2025 utilise exclusivement le DFG (comparable à l'eGFR) dans son tableau de stades. Ce n'est pas une erreur sur le périmètre prioritaire France (la SFD est cohérente en interne), mais c'est un défaut de rigueur d'OE qui pourrait, si le nœud citait un seuil « CrCl » d'un label américain comme équivalent à un seuil « DFG » français sans le signaler, introduire une confusion clinique. À traiter comme point de vigilance rédactionnelle plutôt que comme une correction factuelle.

---

### Non-vérifiable dans cette passe (à traiter comme un résultat honnête)

- Le détail fin de la Figure 3 de SFD 2025 (association cellule-couleur-colonne pour Glimépiride/Gliclazide/Répaglinide entre les paliers 30-44 et 45-59) — limite technique locale (rendu PDF en image indisponible), pas un accès bloqué au sens paywall. Le texte des Avis n°12/12 bis suffit à trancher les deux sous-questions posées, mais pas une éventuelle nuance intra-classe entre 30 et 59.
- L'ensemble des affirmations OE portant sur les sources internationales (KDIGO 2022, ADA 2026, Endocrine Society 2019, KDOQI 2012, AHA/HFSA 2019, FDA label glimépiride, ADVANCE, CPRD *BMJ* 2016, cohortes citées [10]-[19]) — non rouvertes dans cette passe car hors priorité de mission (France). Statut : **NON VÉRIFIÉ**, pas confirmé, pas infirmé.

## Confirmations obtenues

- **HAS 2025 (« Parcours de soins DT2 », guide)** ne donne effectivement **aucun seuil chiffré de DFG** pour les sulfamides — seulement une mention qualitative (p. 46, section Complications rénales : risque hypoglycémique « plus élevé à partir du stade 3 » du fait de la clairance réduite ; p. 58 : IRC citée comme facteur de risque d'hypoglycémie chez les patients sous insulinosécréteurs). Sur ce point précis (HAS, pas SFD), l'affirmation OE tient.
- **HAS 2025 ne nomme jamais le répaglinide** (le mot n'apparaît pas dans le document) — seul le terme générique « glinides » apparaît (4 occurrences), sans lien avec l'IRC sévère/terminale. Confirme, pour HAS spécifiquement, l'absence de texte dédié relevée par OE.
- **La recommandation HAS antérieure** (« Stratégie thérapeutique du patient vivant avec un diabète de type 2 ») ne donne pas non plus de seuil chiffré pour les SU (uniquement des mentions qualitatives sur le risque d'hypoglycémie, R.61/R.69/R.78/R.102), et ne mentionne le répaglinide en lien avec la fonction rénale qu'une fois, de façon qualitative (« non-CI » en cas de maladie rénale, R.78, sans stade précisé). Cohérent avec un manque de texte spécifique côté HAS (ancien et nouveau documents).
- **Prescrire** (`prescrire-dt2.md`) ne fournit pas non plus de seuil de DFG pour les sulfamides en tant que classe (seul un seuil DFG < 30 est donné pour la **metformine**, pas pour les SU) — cohérent avec l'absence de seuil SU dans les sources françaises hors SFD.
- Le seuil SFD (DFG < 30, stades 4-5) est **redondant entre deux passages indépendants** du même document (note de tableau p. 3/632 et Avis n°12 p. 14/643) — cohérence interne, pas une coïncidence de citation isolée.

## Décompte final

| Sévérité | OE seule | Agent A ET OE | Agent A seule | Source primaire elle-même | Non-vérifiable |
| --- | --- | --- | --- | --- | --- |
| HAUTE | 2 (F1, F2) | – | – | – | – |
| MOYENNE | 1 (F3) | – | – | – | – |
| BASSE | 1 (F4) | – | – | – | 2 (Figure 3 détail ; sources internationales hors périmètre) |
| **Total** | **4** | **0** | **0** | **0** | **2** |

*(Pas de colonne « Agent A » car aucun rapport Agent A n'existe pour ce chantier — cf. remarque de périmètre en tête de document.)*

## Verdict par sous-question

**1. Seuil de DFG des sulfamides hypoglycémiants en IRC.**
OE se trompe sur le volet français : la SFD (2025) fixe un seuil chiffré et opposable — **contre-indication dès le stade IRC sévère, DFG < 30 mL/min/1,73 m² (stades 4 et 5)** —, formalisé dans le Tableau I (note 2), l'Avis n°12 et l'Avis n°12 bis. HAS (2025 et reco antérieure) reste qualitative sans seuil propre, ce qui confirme la partie de l'affirmation OE relative à HAS seule, mais pas à SFD/HAS conjointement. Point encore ouvert (non vérifié dans cette passe) : la SFD distingue-t-elle gliclazide/glimépiride/glibenclamide *avant* le seuil de 30 (paliers 30-44/45-59), ou le seuil de contre-indication est-il strictement uniforme pour toute la classe ? — à trancher sur la Figure 3 en rendu image avant tout libellé nommant une molécule spécifiquement plus permissive.

**2. Répaglinide en IRC terminale.**
OE se trompe également sur le volet français : la SFD (2025) **nomme explicitement le répaglinide** comme l'une des rares molécules utilisables au stade IRC terminale (DFG < 15 ou dialyse), avec pour seule réserve le risque d'hypoglycémie — position au moins aussi permissive que celle de la Swiss Society présentée par OE comme la plus spécifique identifiée dans la littérature. HAS ne nomme jamais le répaglinide ; l'ancienne reco HAS le mentionne une fois, de façon qualitative et sans préciser le stade. La SFD comble donc directement le vide que le référent cherchait à faire vérifier.

## Proposition de libellé concret (à valider par le référent avant tout encodage)

> **Sulfamides hypoglycémiants (gliclazide, glimépiride, glibenclamide)** : contre-indiqués à partir du
> stade d'insuffisance rénale chronique sévère (DFG < 30 mL/min/1,73 m² — stades 4 et 5), selon la SFD
> (Prise de position 2025, Tableau I note 2 et Avis n°12/12 bis).
>
> **Répaglinide** : utilisable jusqu'au stade d'insuffisance rénale chronique terminale (DFG < 15 mL/min/1,73 m²
> ou dialyse), avec vigilance renforcée sur le risque d'hypoglycémie — pas de contre-indication énoncée à ce
> stade (SFD, Prise de position 2025, Avis n°12 bis).
>
> *Réserve à lever avant encodage* : vérifier en rendu image la Figure 3 (SFD 2025, p. 645 imprimée) pour
> confirmer l'absence de nuance par molécule de SU entre les paliers DFG 30-44 et 45-59, avant de nommer une
> molécule (ex. gliclazide) comme éventuellement plus permissive que les autres SU à l'approche du seuil de 30.

Ce libellé n'est pas prêt pour un encodage YAML direct — il porte la décision jusqu'au référent (validation
clinique humaine, étape 6 du pipeline `00-global.md`), conformément à la règle du circuit.
