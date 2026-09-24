# Consolidation — Seuil de DFG des sulfamides / répaglinide en IRC (DT2)

## Provenance
- Agent : reconciliateur-preuve (C) — consignes : `.claude/agents/reconciliateur-preuve.md`, dernier commit : non transmise (pas de dépôt git dans cet export)
- Modèle : sonnet (en-tête de l'agent)
- Date : 2026-09-24
- Mode : Décision — consolidation
- Outils disponibles à C : Read, Grep, Glob, WebFetch, WebSearch ; absents : Write, Bash — `identite.mjs` et `verifier-registre.mjs` n'ont donc pas pu être exécutés par C dans cette session (voir § Porte du registre, en fin de dossier ; point bloquant pour l'orchestrateur, étape 7). **Les deux livrables ci-dessous ont été rédigés par C puis transcrits aux chemins prévus par l'orchestrateur**, C n'ayant pas d'outil `Write`.
- Accès obtenus :
  - `docs/decision/sources/SFD 2025.pdf` — **texte intégral accessible**, voie : `Read` sans `pages` (33 pages relues intégralement par C, indépendamment des lectures d'A et de B, spécifiquement pour trancher les points ouverts ci-dessous)
  - Les cinq pièces du chantier (cadrage, rapport A, registre, journal, rapport B) et le retour OE archivé — **texte intégral accessible**, voie : `Read`
- Accès bloqués : aucun côté lecture ; `Write` et `Bash` absents de la session de C (voir ci-dessus)

## Entrées figées (datées)
- Cadrage : `seuil-dfg-su-cadrage.md`, 2026-09-24
- Rapport A : `seuil-dfg-su-agent-A.md`, 2026-09-24
- Registre (version d'origine, avant corrections de cette consolidation) : `seuil-dfg-su-registre.md`, 2026-09-24
- Journal de recherche : `seuil-dfg-su-journal.md`, 2026-09-24
- Rapport B (contradicteur) : `seuil-dfg-su-agent-B.md`, 2026-09-24
- Retour OpenEvidence archivé : `OE-seuil-dfg-su.md` — contenu original daté 2026-07-27, réutilisé/archivé pour ce chantier au 2026-09-24 ; fiche de retour incluse ; **ne couvre pas la position SFD** (constat explicite du retour lui-même)
- Source primaire relue par C : `docs/decision/sources/SFD 2025.pdf` — *Med Mal Metab* 2025;19:630-662, DOI 10.1016/j.mmm.2025.10.002, mis en ligne le 13 novembre 2025
- Contexte, non traité comme preuve de ce chantier : `docs/decision/00-global.md` (nœud D, sulfamides/gliptines)
- Points ouverts transmis par l'orchestrateur : 3 points (glibenclamide/SQ1 ; conflation DFG/CrCl ; absence de Bash chez A et B) — traités ci-dessous

## Journal des divergences

### Divergence 1 — Finding 1 de B (HAUTE) : distinction qualitative du glibenclamide (SQ1)

- **Affirmation A** (registre, ligne A3) : « Le texte prose de la SFD 2025 ne distingue pas de seuil de DFG propre à chaque sulfamide (gliclazide, glimépiride, glibenclamide). » — exacte au sens strict (aucun seuil DFG *chiffré* différencié par molécule dans le texte prose), mais le rapport A ne restitue nulle part la phrase de l'Avis n° 6 ni la structure de la Figure 3.
- **Affirmation B** : SFD 2025, p. 635, Avis n° 6, colonne SU : « risque d'hypoglycémie (en particulier avec le glibenclamide, **qu'il est préférable de ne plus utiliser**) nécessitant une ASG » ; et p. 645, Figure 3 : les lignes « Glimépiride » et « Gliclazide » figurent séparément, **aucune ligne « Glibenclamide »** n'existe dans le tableau pratique de gestion des traitements en IRC.
- **Vérification indépendante par C** : j'ai rouvert moi-même le PDF (lecture intégrale, indépendante) et confirme mot pour mot la citation de B à la p. 635 (Avis n° 6). Je confirme aussi par lecture directe la liste complète des lignes de la Figure 3 (p. 645) : Metformine, Répaglinide, Glimépiride, Gliclazide, Acarbose, Sitagliptine, Saxagliptine, Vildagliptine, Dapagliflozine, Empagliflozine, Canagliflozine, Liraglutide, Dulaglutide, Sémaglutide, Tirzépatide, Insuline — **aucune ligne « Glibenclamide »**. Le code couleur des cellules molécule × palier de DFG reste **non vérifié (partiel)** pour les mêmes raisons techniques que A et B (couleurs non rendues en texte par l'outil de lecture) ; ce point est indépendant de la trouvaille de B, qui porte sur le texte prose et sur la structure du tableau (présence/absence de ligne), tous deux lisibles en texte.
- **Catégorie** (typologie `consolidation.md`) : omission — le rapport d'A ne contredit pas la source, mais ne la restitue pas intégralement sur un point que le cadrage nommait explicitement comme piège (« spécificité par molécule »).
- **Enjeu pour la décision** : un nœud construit sur le seul rapport A risquerait de traiter les trois sulfamides à égalité vis-à-vis du DFG, alors que la SFD proscrit le glibenclamide **en pratique**, indépendamment du palier de DFG — cohérent avec le nœud D déjà validé (« glibenclamide à proscrire »).
- **Pièce qui tranche** : SFD 2025 p. 635 (Avis n° 6) et p. 645 (Figure 3, en-têtes de lignes) — les deux relues par C.
- **État : `corrigée`.** L'extraction d'A était incomplète (pas fausse) ; le passage qui le montre est cité ; le registre est corrigé par l'ajout de la ligne A12 (voir registre corrigé).

### Divergence 2 — Finding 2 de B (MOYENNE) : conflation DFG (SFD) / clairance de la créatinine (RCP glibenclamide) (SQ1, recoupement RCP)

- **Affirmation A** (registre, ligne A5, colonne Contradiction) : « Concorde avec A1 (SFD, DFG<30) — pas une contradiction. »
- **Affirmation B** : la RCP DAONIL (glibenclamide, section 5.2) cite la **clairance de la créatinine** (grandeur non normalisée à la surface corporelle, historiquement Cockcroft-Gault), tandis que la SFD 2025 emploie systématiquement le **DFG** en mL/min/1,73 m² (grandeur normalisée, type CKD-EPI) — deux mesures apparentées mais non strictement interchangeables (écart possible chez le sujet âgé ou de poids extrême).
- **Catégorie** : mesure non restaurée à son origine — action : restaurer la grandeur d'origine, ne pas harmoniser par simple renommage.
- **Enjeu** : si le futur outil de décision interroge un DFG (et non une clairance de la créatinine), présenter les deux seuils comme un seul et même chiffre « 30 » introduirait une confusion clinique potentielle.
- **Pièce qui tranche** : SFD 2025 p. 633 (Tableau I, notes 1-2, DFG) vs RCP ANSM DAONIL 5 mg, section 5.2 (clairance de la créatinine). C n'a pas eu besoin de rouvrir la page ANSM brute : B a déjà recoupé cette citation par une invocation `WebFetch` indépendante de celle d'A (prompt différent), rendant un texte identique au mot près — le risque d'altération du chiffre par le résumé intermédiaire est donc réduit, sans que le statut d'accès change (`résumé accessible` reste le bon état).
- **Résolution** : le chiffre « 30 » des deux sources va dans le même sens clinique (pas de renversement de conclusion), mais les deux grandeurs doivent être présentées séparément dans le dossier et dans un futur argumentaire.
- **État : `corrigée`.** La colonne Contradiction de la ligne A5 du registre est réécrite pour ne plus présenter les deux grandeurs comme un seul chiffre concordant sans réserve (voir registre corrigé).

### Divergence 3 — Finding 3 de B (BASSE) : omission de la section 1 du retour OE (SQ3, non décisive)

- **Affirmation A** (table maîtresse ligne 9 / registre A10) : ne reprend que la section « Drug Label » (répaglinide/FDA) du retour OE archivé.
- **Affirmation B** : la section 1 du même retour OE compare les seuils eGFR par guideline **et par molécule** (Endocrine Society 2019, KDOQI 2012, etc.), utile au contraste que le cadrage demandait explicitement pour SQ3.
- **Vérification par C** : j'ai relu intégralement `OE-seuil-dfg-su.md` (copie complète de l'extrait archivé). Je confirme la présence de la section 1 : « Endocrine Society (2019) : glimepiride should not be used below eGFR 30 mL/min/1.73 m² and should be used with caution below eGFR 60; glyburide should be avoided below eGFR 60 » ; KDOQI 2012 recommande le glipizide (non commercialisé en France) comme SU préféré en IRC pour ses métabolites inactifs. Cette section était bien disponible dans une pièce qu'A avait par ailleurs ouverte et citée (pour une autre partie du même document).
- **Catégorie** : omission — pièce disponible, non exploitée dans la table maîtresse pour cette sous-question précise.
- **Enjeu** : limité (SQ3 est non décisive) mais le contraste demandé par le cadrage manquait.
- **État : `corrigée`.** Omission comblée par l'ajout de la ligne A13 au registre (voir registre corrigé), classée `résumé accessible` / `non vérifiée` — ce reste un résumé OE, jamais une source primaire ; les guidelines Endocrine Society/KDOQI elles-mêmes n'ont été relues en texte intégral par aucun agent de ce chantier.

### Point ouvert n° 3 (Bash absent chez A, B et C) — hors typologie des divergences, consigné séparément

Ni A, ni B, ni C n'ont eu accès à `Bash` dans leur session respective. Conséquences :
- `identite.mjs` n'a jamais été exécuté sur les références proposées par OE ni sur l'identifiant de la SFD 2025 (identité établie manuellement par A, page de titre + DOI, concordante avec le cadrage — non recoupée par le script).
- `verifier-registre.mjs` n'avait jamais tourné sur ce chantier avant cette consolidation.

Ce n'est pas une divergence entre A et B (les deux constats sont identiques et confirmés par C) : c'était un **point bloquant opérationnel**, à traiter par l'orchestrateur avant de déclarer ce dossier consolidé au sens de `consolidation.md` § Quand déclarer la consolidation complète (condition 2 : le registre doit passer sa porte, code 0). **Résolu par l'orchestrateur** : voir § Porte du registre ci-dessous pour le résultat effectif de l'exécution.

## Confirmations obtenues (rappel, non recopiées en détail — voir rapport B § Confirmations obtenues, toutes revérifiées ici par C sur les mêmes pages du PDF)

- A1, A2 (SQ1 — seuil DFG < 30, stades 4/5, exclusion implicite des SU en IRC sévère) : confirmées par C, p. 633 note 2 et p. 643-644.
- A6, A7 (SQ2 — répaglinide utilisable en IRC sévère et terminale, sans dose chiffrée) : confirmées par C, p. 643-644, Avis n° 12 bis.
- Précision « y compris dialyse » : confirmée par C, Figure 3 p. 645, en-tête de colonne « < 15 ou dialyse (IRC terminale) ».
- A11 (absence de seuil DFG chiffré pour les SU dans `prescrire-dt2.md`) : non revérifiée par C (hors PDF SFD), mais déjà confirmée indépendamment par B via `Grep` direct — aucune raison de la rouvrir.

## Synthèse décisionnelle courte

**SQ1 — Seuil de DFG des sulfamides.**
- Conclusion et certitude : les sulfamides hypoglycémiants (classe) sont contre-indiqués par la SFD 2025 en cas d'IRC sévère ou terminale, soit **DFG < 30 mL/min/1,73 m²** (stade 4 : 15-29 ; stade 5 : < 15) — SFD 2025 p. 633 (Tableau I, note 2), confirmé p. 643-644 (Avis n° 12/12 bis). Niveau de preuve : `tres_faible` (avis d'experts, aucun essai dédié à ce seuil).
- Nuance décisive, à soumettre au référent : le **glibenclamide** fait l'objet d'une mise à l'écart qualitative propre, **indépendante du DFG** (« qu'il est préférable de ne plus utiliser », Avis n° 6 p. 635) et est structurellement absent du tableau pratique de gestion IRC (Figure 3, p. 645), alors que glimépiride et gliclazide y figurent séparément. Ce n'est pas un second seuil rénal, mais une exclusion de la molécule elle-même — cohérent avec le nœud D déjà validé. **Arbitrage de conception à soumettre au référent** : comment l'encoder (exclusion de molécule vs simple seuil rénal).
- Population/horizon : adultes DT2, tous stades d'IRC ; pas d'horizon de suivi (seuil d'usage).
- Limites : aucun seuil DFG chiffré différencié par molécule dans le texte prose (confirmé A, B, C) ; couleurs de la Figure 3 non vérifiées (limite technique partagée) ; RCP gliclazide/glimépiride non chiffrées dans les passages obtenus (résumé `WebFetch`) ; seule la RCP glibenclamide chiffre un repère, mais en clairance de la créatinine, non en DFG (Divergence 2, corrigée).
- Statut de validation : dossier prêt pour relecture référent ; aucun `[À VÉRIFIER]` décisionnel bloquant sur le chiffre central.

**SQ2 — Répaglinide en IRC terminale.**
- Conclusion et certitude : la SFD 2025 liste explicitement le répaglinide parmi les molécules utilisables en IRC sévère (DFG 15-29) et terminale (DFG < 15, **dialyse comprise** — Figure 3, en-tête de colonne « < 15 ou dialyse »), avec un risque d'hypoglycémies signalé mais **sans dose ni protocole de titration chiffrés par la SFD elle-même** (Avis n° 12 bis, p. 643-644). Niveau de preuve : `tres_faible`.
- Recoupement RCP : la RCP ANSM répaglinide ne porte pas de contre-indication rénale formelle, mais ne documente aucune donnée en deçà de CrCl 20 mL/min (doublement de l'ASC/demi-vie à CrCl 20-39) — cohérent avec le retour OE archivé (label FDA), non recoupé en primaire par aucun agent de ce chantier.
- Limites : zone CrCl < 20 mL/min non couverte par des données publiées (silence, **pas** un résultat négatif) ; recoupement RCP en `résumé accessible`, partiellement revérifié par B (invocation indépendante, texte identique).
- Statut : dossier prêt pour relecture référent ; aucune divergence substantielle entre A et B.

**SQ3 (non décisive, contextuelle) — RCP françaises et guidelines internationales.**
- Conclusion : cohérence qualitative entre RCP françaises et position SFD, avec la réserve de grandeur (Divergence 2). Les guidelines internationales rapportées par OE différencient par molécule avec seuils eGFR chiffrés (ex. Endocrine Society : glimépiride CI < eGFR 30, glyburide à éviter < eGFR 60), contrastant avec le seuil SFD unique non différencié — omission de la table maîtresse d'A comblée (ligne A13).
- Limites : aucune de ces sources internationales n'a été lue en texte intégral par un agent de ce chantier (résumé OE uniquement).
- Statut : contextuel, non bloquant (SQ1/SQ2 reposent sur la SFD, lue en primaire par trois lecteurs indépendants).

## Besoin OpenEvidence (relayé, non initié par C)

A a proposé un prompt OE pour SQ3 (lecture verbatim des RCP EMA/FDA + guidelines internationales). Après le travail de B (2 citations RCP sur 5 revérifiées indépendamment, texte identique), le besoin résiduel est réduit mais non nul : 3 citations RCP restent `non vérifiée` (gliclazide 4.3, glimépiride 4.3/4.4, répaglinide 4.2/4.3). **C ne propose ni ne motive de nouvel appel OE** — c'est à l'orchestrateur de porter ce besoin, déjà motivé par A, au référent, sous la forme déjà rédigée dans `seuil-dfg-su-agent-A.md` § Proposition OE, si celui-ci le juge utile.

## Annexe de traçabilité

- **Familles d'études** : source unique et primaire pour SQ1/SQ2 = SFD 2025 (une seule famille, un seul DOI, relue trois fois indépendamment — A, B, C — jamais comptée comme trois confirmations distinctes, conformément à `contradiction.md` § 4). RCP ANSM (4 molécules) = sources réglementaires secondaires de recoupement, pas des essais. Retour OE archivé = repérage, jamais une source primaire.
- **Résultats sources** : voir table maîtresse d'A (`seuil-dfg-su-agent-A.md`), non recopiée ici.
- **Divergences avec état et résolution motivée** : les trois ci-dessus, toutes `corrigée`.
- **Conclusions abandonnées** : la formulation « la plus affirmative » d'A pour SQ1 (« la SFD et les 3 RCP convergent sur DFG<30 quelle que soit la molécule ») reste à ne pas retenir telle quelle — confirmé par C : elle ignore la mise à l'écart spécifique du glibenclamide (Divergence 1) et confond DFG et clairance de la créatinine (Divergence 2).
- **Actions restantes** :
  1. Référent : trancher l'arbitrage de conception sur le glibenclamide (exclusion de molécule vs seuil rénal) — ce n'est pas une question de preuve, mais un choix de représentation dans le futur nœud.
  2. Référent : juger si le besoin OE résiduel pour SQ3 (3 citations RCP non vérifiées) justifie une nouvelle demande d'accord.

## Porte du registre — `verifier-registre.mjs`

À exécuter par l'orchestrateur après transcription des deux livrables (C n'avait pas d'outil Bash) :
`node .claude/skills/recherche-source-primaire/scripts/verifier-registre.mjs docs/decision/validation/chantier-2026-09-24/seuil-dfg-su-registre.md`
— résultat et code de sortie à reporter ci-dessous par l'orchestrateur avant toute déclaration de
consolidation complète.

**Résultat (rempli par l'orchestrateur, étape 7 du circuit) :** voir `seuil-dfg-su-synthese.md` §
Provenance pour le code de sortie effectif et la date d'exécution.
