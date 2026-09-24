# Red-team — seuils rénaux du sulfamide et du glinide (nœud `prescription`)

## 1. En-tête de provenance

- **Date** : 2026-09-24
- **Rôle** : Agent B — red-team, mode Décision (circuit `recherche-preuve-triangulee`, étape de contradiction du retour OE brut ; pas de rapport d'Agent A sur ce chantier).
- **Retour OE contrôlé** : `epreuve/entrees/OE-retour-brut-extrait.md` (chantier 2026-07-27, extrait « seuil rénal des sulfamides » et « répaglinide en IRC terminale »).
- **Méthode** : `acces-identite.md` §8 (verdict d'absence — jamais recevable sans ouverture du corpus local et sans au moins deux tentatives d'extraction), motivée par le précédent daté du 2026-07-27 documenté dans `docs/decision/00-global.md` § Règles de sourcing (un red-team avait déjà conclu à tort qu'aucune source SFD ne portait un seuil, faute d'avoir ouvert le corpus local) et par le constat, dans le même fichier, qu'OpenEvidence ne sait pas interroger les sources françaises et les halluciné.
- **Déroulement en deux passes** : une première extraction (sous-agent) a produit un rapport dont les citations se sont révélées correctes sur le fond mais **mal attribuées** (passages réels de `SFD 2025.pdf` cités comme provenant de `HAS 2025 - Parcours de soins DT2 - guide.pdf`). L'orchestrateur a rouvert intégralement les deux PDF en primaire pour vérifier chaque citation avant de rendre ce rapport — voir §3 « Objection retirée / erreur corrigée ».
- **Corpus local réellement ouvert et lu intégralement en primaire par l'orchestrateur** (`docs/decision/sources/`) :
  - `SFD 2025.pdf` — Darmon P. et al., « Prise de position de la Société Francophone du Diabète (SFD) sur les stratégies d'utilisation des traitements de l'hyperglycémie dans le diabète de type 2 – 2025 », *Med Mal Metab* 2025;19:630-662. Lu intégralement (33 pages PDF, pagination imprimée 630-662).
  - `HAS 2025 - Parcours de soins DT2 - guide.pdf` — HAS, « Parcours de soins du patient adulte vivant avec un diabète de type 2 », validé par le Collège le 26 juin 2025. Lu intégralement (113 pages PDF, pagination imprimée 1-112).
- **Pièces secondaires non rouvertes par l'orchestrateur** (ouvertes par le sous-agent lors de la première passe, écartées comme hors sujet) : `rapport_gtg_glucides_sfd.pdf` (rapport SFD sur les glucides), `prescrire-dt2.md` (notes Prescrire, hors périmètre SFD/HAS de la priorité).
- **Pièce non ouverte, signalée comme point ouvert** : `strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf` (RBP HAS 2024). Le guide HAS 2025 renvoie explicitement à ce document pour le détail du choix des molécules selon la fonction rénale (§4.1.3) sans le reprendre lui-même. Non vérifié faute de temps — voir §6.
- **OpenEvidence** : non interrogé (interdit pour ce travail).

## 2. Affirmations vérifiées

### 2.1. Affirmation prioritaire n°1 — seuils DFG des sulfamides (tableau §1 du retour OE, ligne « French SFD / HAS »)

> *« No specific SFD/HAS guideline text on sulfonylurea eGFR thresholds was identified in the literature. French practice generally follows ESC/EASD and EMA labelling. »*

**Verdict : affirmation fausse.**

- **Passage source** — `SFD 2025.pdf`, Tableau I (objectifs d'HbA1c à individualiser), note de bas de page n°2, page imprimée 633 (page 4 du PDF) : *« Les sulfamides hypoglycémiants sont contre-indiqués en cas d'IRC sévère ou terminale. »* La note 1 du même tableau chiffre ces stades : *« Stade 4 : débit de filtration glomérulaire (DFG) entre 15 et 29 mL/min/1,73 m2 ; stade 5 : DFG < 15 mL/min/1,73 m2. »* — soit une contre-indication de classe des sulfamides (donc glimépiride, gliclazide, glibenclamide) en dessous de DFG 30 mL/min/1,73 m², chiffrée, publiée par la SFD en novembre 2025.
- **Passage source** — `SFD 2025.pdf`, Figure 3 « Insuffisance rénale chronique (IRC) : gestion des traitements de l'hyperglycémie », page imprimée 645 (page 16 du PDF) : tableau à colonnes de DFG (« 60-89 », « 30-44 et 45-59 », « 15-29 », « < 15 ou dialyse ») listant nommément, parmi ses lignes, **Glimépiride** et **Gliclazide** — c'est-à-dire une position française par molécule et par palier de DFG jusqu'au stade dialyse.

C'est un texte français officiel (SFD, société savante de référence française pour le diabète, position 2025 relue par un groupe de lecture incluant deux représentants de la Fédération Française des Diabétiques), daté, chiffré, qui traite directement la question posée à OE.

### 2.2. Affirmation prioritaire n°2 — répaglinide en IRC terminale/dialyse (tableau §2 du retour OE, ligne « French HAS/SFD »)

> *« No specific French guideline text on repaglinide in ESRD was identified. French practice generally follows EMA labelling, which permits use with caution in severe renal impairment (CrCl 20-40) but is silent below CrCl 20. »*

**Verdict : affirmation fausse, de façon encore plus nette que la précédente.**

- **Passage source** — `SFD 2025.pdf`, Avis n° 12 bis « Insuffisance rénale chronique (IRC) : gestion des traitements de l'hyperglycémie », page imprimée 643-644 (pages 14-15 du PDF) :
  - Stade IRC sévère (DFG 15-29 mL/min/1,73 m²) : *« la metformine doit être arrêtée et seuls l'insuline, le répaglinide (avec un risque d'hypoglycémies pour ces deux traitements), le liraglutide, le sémaglutide, le dulaglutide, le tirzépatide […], la vildagliptine à la dose de 50 mg/j et la sitagliptine à la dose de 25 mg/j […] peuvent être utilisés. »*
  - Stade IRC terminale (DFG < 15 mL/min/1,73 m²) : *« parmi les molécules commercialisées en France, seuls l'insuline, le répaglinide (avec un risque d'hypoglycémies pour ces deux traitements), la vildagliptine à la dose de 50 mg/j et la sitagliptine à la dose de 25 mg/j […] peuvent être utilisés. »*
- **Passage source** — `SFD 2025.pdf`, Figure 3 (page imprimée 645, page 16 du PDF) : une ligne « Répaglinide » nommément présente dans le tableau, jusqu'à la colonne « < 15 ou dialyse ».

C'est un texte français officiel, daté de novembre 2025, qui affirme explicitement — et sans ambiguïté — que le répaglinide fait partie des rares molécules **utilisables au stade IRC terminale (DFG < 15)**, avec la même réserve d'hypoglycémie que l'insuline. Ce n'est ni une extrapolation de RCP EMA, ni une position implicite.

### 2.3. Le document `HAS 2025 - Parcours de soins DT2 - guide.pdf` ne porte PAS ces passages

Point de méthode important, corrigé après la première passe (voir §3) : les deux affirmations ci-dessus proviennent intégralement de `SFD 2025.pdf`. Après lecture intégrale du guide HAS 2025 (113 pages), **aucune trace n'y a été trouvée** d'un « Avis n° 12 bis », d'une « Figure 3 », ni d'un tableau par molécule et par palier de DFG. La section pertinente du guide HAS (§4.1.3 « Prise en charge médicamenteuse », p. 29-30, et §6.1.3 « Complications rénales », p. 45-46) se limite à une phrase générale : *« Surveillance du risque hypoglycémique (autosurveillance, ETP), particulièrement dans le cas de traitement par sulfamide ou insuline. »* Le guide renvoie explicitement, pour le détail par molécule, à la RBP HAS « Stratégie thérapeutique du patient vivant avec un diabète de type 2 » (2024) — document distinct, non ouvert dans ce chantier (cf. §6, point ouvert).

Le verdict d'absence d'OE reste donc réfuté dès lors qu'on ne considère que la SFD : la ligne du retour OE nommait explicitement « SFD/HAS » et « HAS/SFD », et la SFD à elle seule porte, verbatim, exactement ce qu'OE affirme absent.

## 3. Objection retirée / erreur corrigée en cours de rédaction

Une première extraction (sous-agent, outils identiques) avait produit les mêmes citations mais les avait attribuées à `HAS 2025 - Parcours de soins DT2 - guide.pdf`, pages « imprimées 643-645 ». Cette attribution était intenable : la pagination imprimée du guide HAS va de 1 à 112, jamais jusqu'à 643. L'orchestrateur a rouvert les deux PDF intégralement en primaire (et non par relecture partielle) avant de rendre ce rapport, ce qui a permis de retrouver les mêmes passages, verbatim, dans `SFD 2025.pdf` (dont la pagination imprimée va de 630 à 662 — cohérente avec « page imprimée 643 »). Le contenu des citations tient donc, mais leur attribution documentaire a été corrigée. C'est un rappel direct de l'angle « Identité » de `contradiction.md` §3 : une référence exacte sur le fond mais qui désigne le mauvais document reste une erreur à corriger avant tout report.

## 4. Findings

| # | Sévérité | Origine | Description |
|---|---|---|---|
| F1 | **HAUTE** | OE seule | Verdict d'absence faux sur le seuil rénal des sulfamides en France. OE affirme qu'aucun texte SFD/HAS ne porte de seuil de DFG pour les sulfamides et que la pratique française « suit » l'ESC/EASD et le RCP EMA. En réalité, la SFD 2025 pose une contre-indication de classe explicite en IRC sévère/terminale (DFG < 30, chiffrée) et donne une position par molécule (glimépiride, gliclazide) et par palier de DFG jusqu'au stade dialyse (`SFD 2025.pdf`, Tableau I note 2 p. 633 et Figure 3 p. 645). Schéma identique à l'incident du 2026-07-27 documenté dans `docs/decision/00-global.md` § Règles de sourcing : un verdict d'absence sur une source SFD rendu sans ouverture complète du corpus local, alors que le passage est verbatim disponible. |
| F2 | **HAUTE** | OE seule | Verdict d'absence faux sur le répaglinide en IRC terminale/dialyse. OE affirme n'avoir identifié aucun texte français spécifique et que la pratique française « suit » le RCP EMA, silencieux sous CrCl 20. En réalité, la SFD 2025 (Avis n° 12 bis, `SFD 2025.pdf` p. 643-644) énonce nommément que le répaglinide est l'une des rares molécules utilisables au stade IRC terminale (DFG < 15), avec prudence sur l'hypoglycémie — un texte français officiel de novembre 2025, daté et spécifique, que le prompt OE n'a pas su produire ni signaler comme hors de sa portée. |
| F3 | **BASSE** | non vérifiable / point ouvert | La question de savoir si le guide HAS 2025 (via son renvoi à la RBP HAS 2024 « Stratégie thérapeutique du patient vivant avec un diabète de type 2 ») porte, lui aussi, une position chiffrée par molécule sur ce sujet n'a pas été tranchée : ce troisième document du corpus local n'a pas été ouvert dans ce chantier faute de temps. Le retour OE nommait « SFD/HAS » conjointement ; F1 et F2 réfutent déjà le verdict d'absence via la SFD seule, donc ce point n'affecte pas la conclusion, mais reste à vérifier avant toute reformulation du nœud qui citerait spécifiquement une position HAS distincte de la SFD sur ce point précis. |

Aucun finding « la source elle-même » (coquille) : les documents primaires eux-mêmes sont cohérents en interne (le Tableau I et la Figure 3 de la SFD se corroborent).

## 5. Confirmations obtenues

- Le classement relatif de risque hypoglycémique entre sulfamides évoqué par OE (glibenclamide plus à risque que les autres SU) est cohérent avec la position SFD 2025 : *« pour les SU : […] risque d'hypoglycémie (en particulier avec le glibenclamide, qu'il est préférable de ne plus utiliser) »* — `SFD 2025.pdf`, Avis n° 6, page imprimée 635 (page 6 du PDF). Ce n'était pas la question posée à OE (qui portait sur les seuils de DFG, pas sur le classement intra-classe), mais la cohérence est notée pour mémoire.
- L'affirmation d'OE selon laquelle les seuils de DFG des sulfamides relèvent d'un consensus pharmacocinétique plutôt que d'essais dédiés n'est pas contredite par la lecture de la SFD : la position SFD 2025 relève elle-même de l'avis d'experts sur la littérature disponible (préambule, Partie 6), pas d'un essai randomisé dédié au seuil. Ce point de la synthèse OE tient, mais reste distinct du verdict d'absence réfuté en §2.

## 6. Décompte

- **Par sévérité** : HAUTE = 2 ; MOYENNE = 0 ; BASSE = 1 (point ouvert, pas un finding sur une affirmation vérifiée).
- **Par origine** : OE seule = 2.

## 7. Verdict par sous-question

**Seuil de DFG des sulfamides (gliclazide, glimépiride, glibenclamide) en IRC** : le verdict d'absence d'OE sur une position SFD/HAS est **faux**, vérifié directement dans `SFD 2025.pdf` (Tableau I note 2, Figure 3). Le nœud `prescription` doit citer cette source française — la SFD, société savante de référence en diabétologie en France — comme position officielle, plutôt que de s'appuyer, comme le suggérait OE, uniquement sur l'ESC/EASD et le RCP EMA.

**Répaglinide en IRC terminale/dialyse** : le verdict d'absence d'OE est **faux**, de manière encore plus nette : la SFD 2025 traite nommément le répaglinide au stade IRC terminale (DFG < 15) dans un texte français explicite et daté (Avis n° 12 bis). C'est le cas le plus net des deux : une phrase de position française existe, verbatim, exactement sur la question posée à OE, et OE ne l'a pas trouvée.

**Point ouvert restant** : la contribution propre du guide HAS 2025 (au-delà de son renvoi à la RBP HAS 2024, non ouverte ici) n'a pas été établie positivement — nature du point : source probablement disponible mais non consultée ; suite : rejouer une recherche ciblée sur `strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf` si le nœud a besoin de citer HAS spécifiquement (et pas seulement SFD) sur ce point.

Ces deux résultats confirment, sur ce chantier également, le constat déjà consigné dans `docs/decision/00-global.md` § Règles de sourcing : **un verdict d'absence rendu par OpenEvidence sur du contenu SFD/HAS n'est jamais recevable tel quel** et doit systématiquement être vérifié sur pièces avant d'être intégré à un dossier de preuve ou à un nœud. Ce chantier ajoute un corollaire méthodologique : même une extraction qui cite un passage réel doit voir son **attribution documentaire** revérifiée avant d'être reportée (§3).
