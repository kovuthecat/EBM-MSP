# Red-team (Agent B) — seuils rénaux du sulfamide et du glinide, nœud `prescription`

> Étape 2 du circuit `recherche-preuve-triangulee`. Cible : le retour OpenEvidence brut
> (`epreuve/entrees/OE-retour-brut-extrait.md`, chantier 2026-07-27), sur son volet
> **recommandations françaises (SFD, HAS)** uniquement, conformément à la priorité fixée par le
> référent. Aucun rapport Agent A n'a été fourni pour ce tour : le red-team porte donc seul sur le
> retour OE. Aucune requête OpenEvidence n'a été effectuée pour ce travail (instruction du mandat).

## Accès — état en tête de rapport

- ✅ **SFD, *Prise de position 2025* sur les stratégies d'utilisation des traitements de
  l'hyperglycémie dans le DT2** (Med Mal Metab 2025;19:630-662) — accès complet, texte intégral,
  fichier local `docs/decision/sources/SFD 2025.pdf`.
- ✅ **HAS, *Stratégie thérapeutique du patient vivant avec un diabète de type 2*** (mai 2024) —
  accès complet, texte intégral, fichier local
  `docs/decision/sources/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf`.
- Ces deux documents étaient déjà archivés dans le projet (`docs/decision/sources/`) : ils ont
  suffi à trancher les deux affirmations prioritaires du retour OE sans qu'il soit nécessaire de
  rouvrir PubMed/Consensus/ClinicalTrials.gov pour ce tour — la question posée (« un texte français
  existe-t-il ? ») se règle par lecture directe des deux sources primaires françaises, pas par une
  recherche bibliographique supplémentaire.
- Pas d'accès bloqué à signaler sur ce tour.

## Affirmations du retour OE visées (recommandations françaises)

1. Sulfamides — tableau « French SFD / HAS » : *« No specific SFD/HAS guideline text on
   sulfonylurea eGFR thresholds was identified in the literature. French practice generally follows
   ESC/EASD and EMA labelling. »*
2. Répaglinide — tableau « French HAS/SFD » : *« No specific French guideline text on repaglinide
   in ESRD was identified. French practice generally follows EMA labelling, which permits use with
   caution in severe renal impairment (CrCl 20–40) but is silent below CrCl 20. »*

## Findings classés par sévérité et origine

### HAUTE sévérité

**F1 — OpenEvidence seule fautive.** L'affirmation « aucun texte SFD/HAS n'a été identifié sur le
seuil de DFG des sulfamides » est fausse : la SFD dispose d'un seuil chiffré et univoque.

> Passage source : SFD, *Prise de position 2025*, Tableau I, note 2, p. 633 : « **Les sulfamides
> hypoglycémiants sont contre-indiqués en cas d'IRC sévère ou terminale.** » — combinée à la note 1
> de la même page : « Stade 4 : débit de filtration glomérulaire (DFG) entre 15 et 29 mL/min/
> 1,73 m² ; stade 5 : DFG < 15 mL/min/1,73 m². »
>
> Confirmé et opérationnalisé par l'Avis n° 12, p. 643 : « Chez les patients vivant avec un DT2 et
> présentant une IRC sévère (DFG entre 15 et 29 mL/min/1,73 m²) ou terminale (DFG < 15 mL/min/
> 1,73 m²), on visera une HbA1c cible ≤ 8 % (64 mmol/mol), avec une limite inférieure de 7 %
> (53 mmol/mol) en cas de traitement par glinide ou insuline (**SU contre-indiqués**) ».

Effet : il existe un seuil français explicite — **DFG < 30 mL/min/1,73 m² = contre-indication de
classe des sulfamides hypoglycémiants** — qu'OpenEvidence présente à tort comme absent de la
littérature.

**F2 — OpenEvidence seule fautive.** L'affirmation « aucun texte français spécifique sur le
répaglinide en IRC terminale n'a été identifié ; la pratique française suit l'étiquetage EMA, qui
autorise l'usage prudent en IRC sévère (CrCl 20-40) mais reste silencieux en dessous de CrCl 20 »
est fausse : la SFD autorise explicitement le répaglinide jusqu'au stade terminal.

> Passage source : SFD, *Prise de position 2025*, Avis n° 12 bis, p. 644 : « **Au stade d'IRC
> terminale (DFG < 15 mL/min/1,73 m²), parmi les molécules commercialisées en France, seuls
> l'insuline, le répaglinide** (avec un risque d'hypoglycémies pour ces deux traitements), la
> vildagliptine à la dose de 50 mg/j et la sitagliptine à la dose de 25 mg/j (forme non
> commercialisée en France) **peuvent être utilisés**. »
>
> Même Avis, également p. 644, pour le stade IRC sévère (DFG 15-29) : formulation identique
> incluant le répaglinide parmi les rares molécules retenues.

Effet : loin d'être « silencieuse » sous CrCl 20, la position SFD est **plus permissive et plus
précise** que l'étiquetage EMA rapporté par OE — elle couvre explicitement l'IRC terminale (le
périmètre exact de la sous-question du référent), avec pour seule réserve la surveillance du risque
hypoglycémique, pas une contre-indication.

### MOYENNE sévérité

**F3 — OpenEvidence seule fautive (nuance sur la partie « HAS » de l'affirmation).** Même
indépendamment de la SFD, l'affirmation d'une absence totale de texte français sur le répaglinide
en insuffisance rénale ne tient pas pour la HAS non plus : la RBP HAS 2024 mentionne explicitement
le répaglinide comme option non contre-indiquée en maladie rénale.

> Passage source : HAS, *Stratégie thérapeutique du patient vivant avec un diabète de type 2*
> (mai 2024), R.78, p. 23 : « répaglinide (demi-vie courte) et en raison de sa **« non-CI » en cas
> de maladie rénale** ». Également R.61, p. 20, et R.101, p. 29 (répaglinide cité comme alternative
> « si la prise alimentaire est irrégulière »).

Portée : la HAS ne fixe pas de seuil de DFG chiffré pour le répaglinide (contrairement à la SFD),
mais énonce bien une position positive et publiée — ce qui contredit déjà, à lui seul, le « silence »
total du côté français allégué par OE. Sévérité MOYENNE plutôt que HAUTE : cette nuance ne change
pas la conclusion clinique (déjà établie par F2), elle affaiblit seulement davantage la formulation
d'OE.

## Confirmations obtenues

Aucune des deux affirmations d'OpenEvidence portant spécifiquement sur les recommandations
françaises (SFD/HAS) — pour les sulfamides comme pour le répaglinide — n'a résisté à la
vérification directe des sources primaires. Les deux ont été contredites par des documents déjà
archivés dans le projet, ce qui écarte l'hypothèse d'un simple defaut d'accès (les deux textes sont
publiés, indexés, et l'un d'eux — HAS 2024 — est même cité en toile de fond méthodologique par la
SFD elle-même).

Hors périmètre prioritaire de ce tour (recommandations françaises), les seuils internationaux cités
par OE (Endocrine Society : glimépiride < 30, glyburide < 60 ; KDOQI : glipizide préféré ; ADVANCE
pour le gliclazide) n'ont pas été rouverts et restent **NON VÉRIFIÉ** à ce stade — à traiter dans un
tour ultérieur si le référent le juge décisionnel.

## Décompte final

| Sévérité | Origine | Nombre |
|---|---|---|
| HAUTE | OpenEvidence seule fautive | 2 |
| MOYENNE | OpenEvidence seule fautive | 1 |
| — | Agent A et OpenEvidence (erreur partagée) | 0 (pas de rapport Agent A fourni) |
| — | Agent A seule | 0 |
| — | Source primaire elle-même | 0 |
| — | Non-vérifiable (accès bloqué) | 0 |

**Confirmations françaises obtenues : 0/2** — les deux affirmations d'OE sur la position française
sont erronées ; à l'inverse, **2 positions françaises positives et chiffrées ont été établies** par
ce red-team (SFD sur les SU, SFD+HAS sur le répaglinide).

## Verdicts par sous-question du référent

**Sous-question 1 — seuils de DFG des sulfamides hypoglycémiants en IRC (position française) :**
Le retour OE affirme à tort qu'aucun texte SFD/HAS ne traite du seuil. En réalité, la SFD (2025)
fixe un seuil explicite : **sulfamides hypoglycémiants contre-indiqués en dessous de DFG
30 mL/min/1,73 m²** (stades IRC sévère et terminale), énoncé comme contre-indication de classe, non
différencié par molécule à ce niveau de la recommandation (le Tableau III / Avis n° 6, p. 635,
distingue seulement le glibenclamide comme le plus à risque hypoglycémique au sein de la classe —
« qu'il est préférable de ne plus utiliser » — mais ceci reste un critère de choix entre SU, pas un
second seuil de DFG). **La question est donc tranchée côté français** : le seuil est 30 mL/min/
1,73 m², contrairement à ce que rapporte OE.

**Sous-question 2 — répaglinide en IRC terminale (position française) :**
Le retour OE sous-estime la position française réelle. La SFD autorise explicitement le répaglinide
jusqu'au stade terminal (DFG < 15 mL/min/1,73 m², pré-dialyse), sous seule surveillance du risque
hypoglycémique, sans contre-indication formelle ; la HAS confirme qualitativement la
« non-contre-indication » en maladie rénale sans fixer de seuil chiffré. **Le référent dispose donc
d'une position SFD chiffrée et positive**, plus riche que ce qu'indique le retour OE — à faire
valider cliniquement avant tout encodage.

## Proposition de libellé concret (nœud `prescription`, sous réserve de validation clinique humaine)

> **Sulfamides hypoglycémiants** : contre-indiqués si DFG < 30 mL/min/1,73 m² (IRC sévère ou
> terminale) — SFD, *Prise de position 2025*, Tableau I (note 2) et Avis n° 12.
>
> **Répaglinide** : utilisable jusqu'à l'IRC terminale (DFG < 15 mL/min/1,73 m²), y compris en
> pré-dialyse, sous surveillance renforcée du risque hypoglycémique (pas de contre-indication
> formelle) — SFD 2025, Avis n° 12 bis ; position qualitative concordante côté HAS 2024 (R.61, R.78,
> R.101 : répaglinide « non-CI » en maladie rénale).

Ce libellé n'est qu'une proposition issue du red-team : conformément au pipeline nœud
(`docs/decision/00-global.md`, étape 6), il doit passer par la validation clinique humaine du
référent avant tout encodage YAML, et respecter la grammaire nœud (`docs/decision/GRAMMAIRE-NOEUD.md`)
pour sa formulation finale (état vs intention, écarté ≠ non-indiqué, etc.).
