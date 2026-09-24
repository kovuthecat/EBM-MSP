# Synthèse — seuil de DFG des sulfamides hypoglycémiants / répaglinide en IRC terminale (DT2)

**Déroulé à blanc** (répétition technique du circuit `recherche-preuve-triangulee`) : ce dossier n'est
pas destiné à un encodage YAML immédiat, mais mené comme un chantier réel jusqu'au bout du circuit.

## Provenance

- Date : 2026-09-24
- Orchestrateur : session Claude Code (Sonnet 5)
- Agents lancés :
  - A — `extracteur-preuve` — sonnet (modèle hérité, champ `model:` de l'agent) — consignes datées :
    sans objet (pas de dépôt git dans cet export) — livrables : `seuil-dfg-su-agent-A.md`,
    `seuil-dfg-su-registre.md` (version d'origine), `seuil-dfg-su-journal.md`
  - B — `contradicteur-preuve` — sonnet — consignes datées : sans objet (pas de dépôt git) —
    livrable : `seuil-dfg-su-agent-B.md`
  - C — `reconciliateur-preuve` — sonnet — consignes datées : sans objet (pas de dépôt git) —
    livrables : `seuil-dfg-su-consolidation.md`, `seuil-dfg-su-registre.md` (corrigé). **C n'avait
    pas d'outil `Write` ni `Bash` dans sa session** : il a rédigé le contenu intégral des deux
    livrables dans sa réponse, que l'orchestrateur a transcrit tel quel aux chemins prévus (aucune
    reformulation du contenu clinique).
- OpenEvidence : retour **archivé**, pas de requête réelle dans cette répétition (accord déjà acquis
  pour le déroulé à blanc, cf. consigne de la répétition). Source : `epreuve/entrees/OE-retour-brut-extrait.md`,
  intégré avec fiche de retour à `OE-seuil-dfg-su.md`. Modèle demandé/observé : sans objet/inconnu
  (retour archivé hors de cette répétition, cf. fiche). Statut : **complet** (avec réserve sur les
  questions de relance en fin de section, cf. fiche). Ce retour **ne couvre pas la position SFD**
  (constat explicite du retour lui-même) — il ne répond donc pas à SQ1/SQ2, seulement à SQ3.
- Porte du registre : **non exécutée**. `node .claude/skills/recherche-source-primaire/scripts/verifier-registre.mjs …`
  n'a pu être lancé ni par A, ni par B, ni par C, ni par l'orchestrateur — **aucun outil Bash n'était
  exposé à aucun des quatre rôles dans cet environnement d'épreuve**. Ce n'est pas un contournement :
  c'est consigné comme point bloquant plutôt que de fabriquer un code de sortie. **Ce dossier est donc
  un état partiel** au sens de l'étape 7 du circuit (« Porte : code 0, sinon pas de synthèse
  "consolidée" ») — la vérification manuelle du format du registre faite par C (`consolidation.md` §
  Porte du registre) ne remplace pas la porte automatique.

## Par sous-question

### SQ1 — À partir de quel DFG la SFD contre-indique-t-elle les sulfamides ?

- **Conclusion** : DFG < 30 mL/min/1,73 m² (IRC stade 4-5, sévère ou terminale) — SFD 2025, p. 633
  (Tableau I, note 2), confirmé p. 643-644 (Avis n° 12/12 bis). **Nuance décisive** : le
  glibenclamide fait l'objet d'une mise à l'écart qualitative propre, indépendante du DFG (« qu'il
  est préférable de ne plus utiliser », Avis n° 6, p. 635) et est absent de la Figure 3 (tableau
  pratique p. 645), alors que glimépiride et gliclazide y figurent. Certitude : faible (avis
  d'experts, aucun essai dédié). Renvoi : `seuil-dfg-su-consolidation.md` § Divergence 1 ; registre
  lignes A1, A2, A3, A12.
- Population et horizon : adultes DT2, tous stades d'IRC ; pas d'horizon de suivi (seuil d'usage).
- Limites : aucun seuil DFG chiffré différencié par molécule dans le texte prose de la SFD ; Figure 3
  lue en texte, ses couleurs de cellule restent `NON VÉRIFIÉ (partiel)` (limite technique partagée
  par A, B, C) ; recoupement RCP en `résumé accessible`, pas en texte intégral.
- Statut de validation : dossier prêt pour relecture clinique référent ; **la porte du registre
  n'ayant pas tourné, ce statut reste un état partiel** au sens strict du circuit.

### SQ2 — Le répaglinide est-il utilisable en IRC terminale ?

- **Conclusion** : oui — la SFD 2025 liste le répaglinide parmi les molécules utilisables en IRC
  sévère (DFG 15-29) et terminale (DFG < 15, dialyse comprise — Figure 3, en-tête de colonne « < 15
  ou dialyse »), avec mention d'un risque d'hypoglycémies mais **sans dose ni protocole de
  surveillance chiffrés par la SFD elle-même**. Certitude : faible (avis d'experts). Renvoi :
  `seuil-dfg-su-consolidation.md` § Synthèse décisionnelle courte (SQ2) ; registre lignes A6, A7, A9.
- Population et horizon : identiques à SQ1.
- Limites : zone CrCl < 20 mL/min non couverte par des données publiées (silence, pas un résultat
  négatif — RCP ANSM et retour OE convergent sur ce point) ; recoupement RCP partiellement revérifié
  par B (invocation indépendante, texte identique), toujours en `résumé accessible`.
- Statut de validation : dossier prêt pour relecture référent ; aucune divergence substantielle entre
  A et B sur cette sous-question ; même réserve sur la porte du registre que SQ1.

### SQ3 — RCP françaises et guidelines internationales (non décisive, contextuelle)

- **Conclusion** : cohérence qualitative entre RCP françaises et position SFD, avec une réserve de
  grandeur (DFG SFD vs clairance de la créatinine RCP glibenclamide — non strictement
  interchangeables). Les guidelines internationales rapportées par OE (Endocrine Society 2019, KDOQI
  2012) différencient par molécule avec seuils eGFR chiffrés, contrastant avec le seuil SFD unique
  non différencié pour la classe. Renvoi : registre lignes A4, A5, A8, A9, A10, A13.
- Limites : aucune des sources internationales n'a été lue en texte intégral par un agent de ce
  chantier (résumé OE uniquement, non recoupé par `identite.mjs`).
- Statut : contextuel, non bloquant — SQ1/SQ2 reposent sur la SFD, lue en primaire par trois lecteurs
  indépendants (A, B, C).

## Points ouverts

| Point | Nature | Suite |
|---|---|---|
| Porte du registre non exécutée (`verifier-registre.mjs`) | Blocage d'accès (outillage, pas de source) | Relancer la porte dès qu'un environnement avec Bash est disponible ; condition précise de reprise : exécuter la commande de l'étape 7 sur `seuil-dfg-su-registre.md` et reporter le code de sortie ici avant toute déclaration de dossier « consolidé » |
| `identite.mjs` jamais exécuté sur les réf. SFD/OE/RCP | Blocage d'accès (même cause) | Idem — à lancer sur l'identité de la SFD 2025 et sur les 27 références du retour OE dès que Bash est disponible |
| Couleurs de cellule de la Figure 3 (SFD 2025, p. 645) non extraites | Source probablement disponible mais non consultée par les outils texte | Recherche ciblée : inspection visuelle du PDF (voie nommée) si la distinction par molécule/palier de DFG devient nécessaire au-delà du texte prose déjà lu |
| Arbitrage de représentation du glibenclamide (exclusion de molécule vs seuil rénal) | Arbitrage de valeur/conception | Présenter les deux options au référent (cf. ci-dessous) ; pas de relance de recherche |
| 3 citations RCP restant `non vérifiée` (gliclazide 4.3 ; glimépiride 4.3/4.4 ; répaglinide 4.2/4.3) | Source probablement disponible mais non consultée en texte intégral (seulement `résumé accessible` via WebFetch) | Recherche ciblée si jugé utile : lecture directe des RCP ANSM (voie nommée : ecodex, codes fournis au registre) ; alternative motivée par A : nouvelle question OE groupée pour SQ3 (prompt déjà rédigé dans `seuil-dfg-su-agent-A.md` § Proposition OE) — nécessite un nouvel accord référent si retenue |

## Arbitrages attendus du référent

1. **Représentation du glibenclamide dans le futur nœud `prescription`** : l'encoder comme une
   exclusion de molécule (le glibenclamide sort quel que soit le DFG dès qu'un sulfamide est
   envisagé) ou comme une variante du seuil rénal (DFG plus restrictif pour cette molécule
   spécifiquement) ? Les deux sont soutenables par la source (Avis n° 6 + absence en Figure 3) ; ce
   n'est pas un point de preuve mais un choix de conception, cohérent à trancher avec le nœud D déjà
   validé (« glibenclamide à proscrire »).
2. **Formulation à retenir pour SQ1** : la plus prudente (« sulfamides à écarter en IRC sévère/
   terminale, DFG<30, avec le glibenclamide spécifiquement déconseillé indépendamment du DFG ») est
   soutenue par le dossier ; la formulation à exclure est celle testée puis abandonnée par la
   consolidation (« la SFD et les RCP convergent sur DFG<30 quelle que soit la molécule ») — elle
   efface la nuance glibenclamide et confond DFG/clairance de la créatinine.
3. **Besoin OpenEvidence résiduel pour SQ3** : juger si les 3 citations RCP non vérifiées justifient
   une nouvelle demande d'accord (question groupée, motif : recoupement international/RCP,
   sous-question non décisive) — l'orchestrateur ne l'a pas soumise faute de nécessité pour trancher
   SQ1/SQ2.
4. **Porte du registre non passée** : le référent doit être informé que ce dossier n'a pas franchi la
   vérification automatique de format (`verifier-registre.mjs`), pour cause d'indisponibilité de
   Bash dans cette répétition — à relancer avant tout passage en encodage réel, si ce sujet devait
   un jour sortir du cadre de l'exercice.
