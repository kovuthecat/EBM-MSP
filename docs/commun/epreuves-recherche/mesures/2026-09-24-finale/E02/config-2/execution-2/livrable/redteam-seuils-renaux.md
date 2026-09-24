# Red-team (Agent B) — seuils rénaux du sulfamide et du glinide (nœud `prescription`, DT2)

## Provenance

- Date : 2026-09-24
- Rôle : Agent B, mode Décision (red-team), circuit réduit — pas de cadrage ni d'Agent A dans cette
  mission ponctuelle ; entrée unique : `epreuve/entrees/OE-retour-brut-extrait.md`.
- Orchestrateur/rédacteur : session courante (Claude, modèle Sonnet 5), agissant directement en
  Agent B sur instruction explicite du référent.
- Périmètre imposé par le référent : uniquement les affirmations du retour OE portant sur les
  **recommandations françaises (SFD, HAS)**. Les affirmations sur KDIGO, ADA, Endocrine Society,
  KDOQI, EMA/FDA ne sont **pas** vérifiées ici — hors mandat.
- Aucune requête OpenEvidence effectuée (interdit par consigne).
- Outils disponibles constatés : lecture de fichiers locaux (natif), Grep (recherche texte/binaire).
  Absent : extraction PDF paginée (voir § Incident technique).

## Attendus (avant ouverture des PDF sources françaises)

Formulés après lecture du retour OE et de `docs/decision/00-global.md`, **avant** d'ouvrir
`SFD 2025.pdf`, `strategie_therapeutique_...-recommandations.pdf` (HAS 2024) et
`HAS 2025 - Parcours de soins DT2 - guide.pdf` :

- **SQ1 — Seuil de DFG des sulfamides hypoglycémiants en IRC.** Une réponse sérieuse doit citer un
  texte SFD et/ou HAS avec, si possible, un seuil numérique de DFG et le statut (CI, prudence,
  adaptation de dose). `00-global.md` § Règles de sourcing documente un incident antérieur exact sur
  ce type de question (verdict d'absence porté sans ouvrir le corpus local) — attendu renforcé :
  vérifier le corpus local (`docs/decision/sources/`) avant tout verdict d'absence, avec au moins
  deux méthodes d'extraction si la première échoue.
- **SQ2 — Répaglinide en IRC terminale.** Une réponse sérieuse doit dire explicitement si le
  répaglinide est autorisé, contre-indiqué ou non évalué par la SFD/HAS aux stades sévère et
  terminal, avec le DFG concerné.
- Les deux affirmations d'OE ci-dessous constituent des **verdicts d'absence** (« no specific
  SFD/HAS guideline text... was identified ») : par construction (`docs/decision/00-global.md` §
  Règles de sourcing, `acces-identite.md` § 8), ces verdicts ne sont recevables que si le corpus
  local a été **ouvert** avec **au moins deux méthodes d'extraction** — ce qu'OE, qui n'a par
  construction pas accès au corpus local ni aux sources françaises (cf. `00-global.md` § Périmètre
  OpenEvidence), ne peut pas avoir fait. Attendu : ces deux affirmations sont *a priori* suspectes
  avant même l'ouverture des PDF.

## Incident technique (à consigner)

Le premier essai de lecture des PDF locaux avec l'outil de lecture natif en mode paginé a échoué
(`pdftoppm is not installed`) — **échec technique**, jamais un verdict d'accès ou de contenu
(`acces-identite.md` § 2). Le même outil, appelé **sans** le paramètre de pagination, a produit
l'extraction complète des trois documents. Un PDF qui résiste à un mode d'appel cède à un autre —
constat qui rejoue directement l'avertissement de `docs/decision/00-global.md` § Règles de sourcing
sur les verdicts « PDF non extractible » prématurés. Les trois pièces ont donc été **ouvertes en
texte intégral local**, pas seulement listées :
- `docs/decision/sources/SFD 2025.pdf` (33 p. imprimées, texte intégral lu)
- `docs/decision/sources/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf`
  (HAS RBP « Stratégie thérapeutique... DT2 », mai 2024, 56 p., texte intégral lu)
- `docs/decision/sources/HAS 2025 - Parcours de soins DT2 - guide.pdf` (guide parcours de soins,
  juin 2025 — consulté en complément, chapitre 6.1.3 « Complications rénales » : renvoie vers le
  guide MRC et vers la RBP 2024 ci-dessus pour le détail médicamenteux, n'apporte pas de seuil
  numérique supplémentaire propre aux sulfamides/glinides).

État d'accès retenu pour toutes les citations ci-dessous : **texte intégral accessible**, voie :
fichier local du corpus (`docs/decision/sources/`), lu directement.

---

## Findings

### F1 — SÉVÉRITÉ HAUTE — origine OE seule — SQ1 (seuil de DFG des sulfamides)

**Affirmation du retour OE** (tableau « Guideline-Specific eGFR Thresholds », ligne « French SFD /
HAS ») :

> « No specific SFD/HAS guideline text on sulfonylurea eGFR thresholds was identified in the
> literature. French practice generally follows ESC/EASD and EMA labelling. The EMA SmPC for
> gliclazide MR states it can be used "with caution" in moderate renal impairment and is
> contraindicated in severe renal impairment (qualitative, no eGFR number). »

**Ce que dit réellement la source primaire française (SFD 2025).**

- Tableau I, note 2 (verbatim, p. 633) : **« Les sulfamides hypoglycémiants sont contre-indiqués en
  cas d'IRC sévère ou terminale. »** — c'est un énoncé de classe, chiffrable dès lors que la SFD
  définit « IRC sévère » = DFG 15–29 mL/min/1,73 m² et « IRC terminale » = DFG < 15 mL/min/1,73 m²
  (même page, note 1) : la contre-indication porte donc sur un seuil précis, **DFG < 30 mL/min/1,73 m²**.
- Avis n° 12 (p. 643) : « Chez les patients vivant avec un DT2 et présentant une IRC sévère (DFG
  entre 15 et 29 mL/min/1,73 m²) ou terminale (DFG < 15 mL/min/1,73 m²), on visera une HbA1c cible
  ≤ 8 %, avec une limite inférieure de 7 % (…) en cas de traitement par glinide ou insuline **(SU
  contre-indiqués)**. »
- Avis n° 12 bis (p. 643-644) : « Au stade d'IRC sévère (DFG 15 à 29 mL/min/1,73 m²), la metformine
  doit être arrêtée et **seuls l'insuline, le répaglinide (…), le liraglutide, le sémaglutide, le
  dulaglutide, le tirzépatide (…), la vildagliptine (…) et la sitagliptine (…) peuvent être
  utilisés** » — les sulfamides (glimépiride, gliclazide) sont explicitement absents de cette liste
  d'exceptions autorisées, cohérent avec la note 2 du Tableau I.
- Figure 3 (p. 645), tableau croisé DFG × molécule : glimépiride et gliclazide passent à
  « Non indiqué » dès la colonne « 15-29 (IRC sévère) » et restent « Non indiqué » en « < 15 ou
  dialyse (IRC terminale) », alors que le répaglinide reste « Pas de réduction de dose » sur toutes
  les colonnes, y compris IRC terminale/dialyse (cf. F2).

**Verdict** : l'affirmation d'OE (« No specific SFD/HAS guideline text… ») est **fausse**. La SFD
2025 donne un texte explicite, avec seuil numérique dérivable (DFG < 30 mL/min/1,73 m²) et statut
net (contre-indication), pas une formulation qualitative comme celle prêtée par OE à l'EMA. La
présentation d'OE — reco française introuvable, pratique française alignée sur l'EMA — est un
verdict d'absence non instruit (aucune trace, dans le retour OE, d'ouverture du corpus SFD/HAS),
exactement le biais documenté par l'incident SFD Avis n° 19 relaté dans
`docs/decision/00-global.md` § Règles de sourcing.

**Nuance sur le volet HAS.** La RBP HAS 2024 (« Stratégie thérapeutique… DT2 ») ne fixe pas
elle-même de seuil de DFG chiffré propre aux sulfamides dans le corps de ses recommandations : elle
se limite à des formulations générales de prudence (R.49 : adaptation de la posologie à la fonction
rénale ; R.69/R.61 : SU non préférentiels par risque d'hypoglycémie, sans chiffre de DFG). Le volet
« HAS » de l'affirmation d'OE est donc **moins clairement faux** que le volet « SFD » — mais OE
présente les deux sources comme une seule ligne conjointe (« French SFD / HAS »), ce qui masque
que la SFD, à elle seule, contredit déjà l'énoncé d'absence.

---

### F2 — SÉVÉRITÉ HAUTE — origine OE seule — SQ2 (répaglinide en IRC terminale)

**Affirmation du retour OE** (tableau « recommandation pour répaglinide en ESRD/dialyse », ligne
« French HAS/SFD ») :

> « No specific French guideline text on repaglinide in ESRD was identified. French practice
> generally follows EMA labelling, which permits use with caution in severe renal impairment
> (CrCl 20-40) but is silent below CrCl 20. »

**Ce que dit réellement la source primaire française.**

- SFD 2025, Avis n° 12 bis (p. 644) : « Au stade d'IRC terminale (DFG < 15 mL/min/1,73 m²), parmi
  les molécules commercialisées en France, **seuls l'insuline, le répaglinide** (avec un risque
  d'hypoglycémies pour ces deux traitements), la vildagliptine à la dose de 50 mg/j et la
  sitagliptine à la dose de 25 mg/j (…) peuvent être utilisés. » Le texte couvre explicitement le
  répaglinide **jusqu'au stade terminal (DFG < 15)**, un périmètre plus sévère que la « CrCl 20-40 »
  à laquelle OE limite la donnée disponible.
- Figure 3 (p. 645) : le répaglinide est coté « Pas de réduction de dose » sur toutes les colonnes de
  DFG, y compris « < 15 ou dialyse ».
- HAS 2024 (« Stratégie thérapeutique… DT2 »), R.78 (p. 23), en trithérapie : « répaglinide
  (demi-vie courte) et **en raison de sa « non-CI » en cas de maladie rénale** » — la HAS affirme
  explicitement l'absence de contre-indication rénale du répaglinide, en toutes lettres, dans son
  propre corps de recommandations, pas dans un simple renvoi vers l'EMA.

**Verdict** : l'affirmation d'OE est **fausse** sur les deux plans qu'elle avance : (a) un texte
français spécifique existe bel et bien (SFD, avis chiffré jusqu'à DFG < 15 ; HAS, statut « non-CI »
explicite) ; (b) la source française n'est pas silencieuse en dessous de CrCl 20 — elle couvre
justement le registre le plus sévère (IRC terminale, DFG < 15, incluant la dialyse selon la Figure 3
SFD) avec une position plus permissive que ce qu'OE attribue à l'EMA.

---

## Cherché, non trouvé par A

Sans objet — ce circuit réduit ne comporte pas d'étape Agent A (pas de cadrage, pas de collecte
préalable). La « passe d'omission » de `contradiction.md` § 2 n'a pas été jouée pour la même raison ;
la vérification ci-dessus s'est faite par ouverture directe du corpus local déjà catalogué dans
`docs/decision/00-global.md` § Sources locales.

## Confirmations obtenues

Aucune confirmation à verser : les deux affirmations examinées, seules affirmations dans le mandat
du référent (recommandations françaises), sont toutes deux réfutées par la source primaire locale.
Les autres affirmations du retour OE (KDIGO, ADA, Endocrine Society, KDOQI, AHA/HFSA, NICE, FDA,
EMA, ADVANCE, CPRD…) sont **hors mandat de cette passe** et n'ont pas été vérifiées ici — leur statut
reste ouvert.

## Objections retirées

Aucune — première passe de contradiction sur ce retour, aucune objection antérieure à retirer.

## Décompte

| Sévérité | Nombre | Origine |
|---|---|---|
| HAUTE | 2 (F1, F2) | OE seule |
| MOYENNE | 0 | — |
| BASSE | 0 | — |

## Verdict par sous-question

- **SQ1 (seuil de DFG des sulfamides hypoglycémiants en IRC)** : **verdict d'absence d'OE réfuté**.
  La SFD 2025 porte un texte explicite et chiffrable : sulfamides contre-indiqués en IRC sévère ou
  terminale, soit DFG < 30 mL/min/1,73 m² (Tableau I note 2 ; Avis 12 ; Avis 12 bis ; Figure 3). La
  HAS 2024, en revanche, ne fixe pas dans son propre texte de seuil de DFG chiffré pour les SU — sur
  ce point précis, OE n'est pas contredit pour le volet strictement HAS, mais l'associe à tort à la
  SFD dans une même ligne d'absence.
- **SQ2 (répaglinide en IRC terminale)** : **verdict d'absence d'OE réfuté**, pour la SFD comme pour
  la HAS. La SFD couvre explicitement le répaglinide jusqu'au DFG < 15 (IRC terminale/dialyse) sans
  restriction supplémentaire au-delà de la prudence hypoglycémique générale ; la HAS affirme
  littéralement la « non-CI » rénale du répaglinide.

## Proposition de libellé (sous réserve de validation du référent)

- Pour le nœud, l'argumentaire ne devrait **pas** reprendre l'affirmation d'OE selon laquelle
  « aucun texte SFD/HAS » ne traite du seuil rénal des sulfamides ou du répaglinide en IRC
  terminale : cette affirmation est fausse pour la SFD sur les deux points, et pour la HAS sur le
  second point (répaglinide).
- Libellé soutenable pour la reco officielle française (SU) : « sulfamides hypoglycémiants
  contre-indiqués en dessous de DFG 30 mL/min/1,73 m² (IRC sévère et terminale) — SFD 2025, Avis 12
  et 12 bis, verbatim Tableau I note 2 ». Reste à trancher par le référent : si l'algorithme doit
  aussi représenter la position HAS 2024 (silence sur le chiffre), ou se limiter au chiffre SFD.
- Libellé soutenable pour le répaglinide : « utilisable jusqu'au stade d'IRC terminale (DFG
  < 15 mL/min/1,73 m², y compris dialyse), sous surveillance du risque hypoglycémique — SFD 2025
  Avis 12 bis et Figure 3 ; HAS 2024 R.78 ("non-CI" en maladie rénale) ». Arbitrage ouvert pour le
  référent : la SFD signale un « risque d'hypoglycémies » à mentionner comme alerte molle, pas
  comme contre-indication.
