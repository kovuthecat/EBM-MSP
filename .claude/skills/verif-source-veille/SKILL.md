---
name: verif-source-veille
description: Circuit de vérification bi-agents (§7) ou tri-agents (§7bis) d'un item de veille dont la source primaire est identifiée (ou à identifier en premier lieu). À dérouler pour tout item candidat à la route `analyse`, avant toute rédaction d'entrée. Référence `docs/veille/SOP_veille.md` §7/§7bis et `docs/veille/GRILLE_APPRECIATION.md`.
---

# Vérification bi-/tri-agents — veille

Charge d'abord le skill `recherche-source-primaire` pour les techniques d'accès. Lis
`docs/veille/GRILLE_APPRECIATION.md` (grille de travail des agents) et confirme le **thème** de
l'item avant de choisir le circuit — c'est ce qui détermine tout le reste.

## Choisir le circuit

| Thème de l'item | Circuit | Qui réconcilie | `relecture_referent` |
|---|---|---|---|
| Un des 10 thèmes MG (`soins-premiers`, `diabete-metabolisme`, `cardiovasculaire-prevention`, `bpco-pneumo`, `infectiologie-antibiotherapie`, `geriatrie-deprescription`, `pediatrie`, `prevention-depistage-vaccination`, `sante-mentale-addictologie`, `douleur-soins-palliatifs`) | **§7 bi-agents** | Toi-même (l'orchestrateur), pas un 3ᵉ agent | `true` |
| `orthophonie` ou `sante-femme-perinatalite` | **§7bis tri-agents** | Un **3ᵉ agent (C)**, en contexte isolé | `false`, bandeau visible obligatoire |

Vérifie la liste des thèmes dans `docs/veille/BRIEF_VEILLE.md` §4 avant de démarrer — elle a déjà
changé plusieurs fois (D43, D60, D61, D63) et peut avoir bougé depuis l'écriture de ce skill.

## Étape 1 — Lancer Agent A et Agent B en parallèle, contextes isolés

**Toujours par paire, jamais Agent A seul puis Agent B seul en différé** : une interruption (quota,
erreur) doit laisser des paires complètes, pas des moitiés — leçon d'un incident réel sur ce projet.

Les deux agents lisent la **même** source primaire, indépendamment, sans se voir. Chaque prompt
doit contenir :
- L'identité de la source (titre, auteurs, revue, année, DOI/PMID) — ou, si elle n'est pas
  confirmée, la mission de l'identifier en premier lieu et de déclarer l'échec plutôt que d'inventer.
- Le rappel de doctrine : `route` et `niveau_impact` sont des champs **distincts** ; une analyse qui
  conclut `informatif` est un résultat valide, pas un échec.
- La consigne **« écris ton fichier au fil de l'eau, pas seulement à la fin »** — non négociable,
  ça a déjà évité de perdre du travail lors d'une coupure de quota en pleine séance.
- Le chemin de livrable : `docs/veille/verifications-backlog/<ID>-agent-A.md` /
  `-agent-B.md`.
- Sur §7bis uniquement : rappeler qu'aucun relecteur du domaine ne validera derrière, donc rigueur
  maximale et légitimité à conclure « non publiable en l'état ».

**Agent A (analyste/extracteur)** : remplit la grille d'appréciation, chiffres reliés à leur
localisation exacte, propose un classement complet (thèmes, professions, route, niveau d'impact,
niveau de preuve, `concerne_decision`).

**Agent B (contradicteur/red-team)** : cherche ce qui cloche, mais retire une objection qui ne tient
pas après vérification plutôt que de la maintenir par principe — un red-team qui invente des
défauts est aussi inutile qu'un analyste complaisant. Vérifie **chaque chiffre** contre la source,
jamais contre un relais.

## Étape 2 — Réconciliation

### §7 (thèmes MG) — tu réconcilies toi-même

Lis les deux rapports. Tranche les divergences **sur pièces** (retour à la source si besoin, pas à
l'intuition). Une divergence non tranchable sur pièces impose `reporte` (§6bis, deux reports
maximum, puis analyse ou brève forcée avec motif écrit). Écris `docs/veille/verifications-backlog/<ID>-reconciliation.md`.

### §7bis (orthophonie, santé-femme-périnatalité) — un 3ᵉ agent tranche

Lance un **Agent C**, en contexte isolé, qui n'a vu ni le travail intermédiaire ni les échanges de A
et B — seulement leurs deux rapports finaux. Il :
- compare les deux analyses, tranche les désaccords vérifiables sur pièces (retour à la source) ;
- teste chaque point porteur contre « faut-il être du métier pour l'affirmer ? » — ce qui l'exige
  est retiré du contenu publiable, ce qui ne l'exige pas peut être publié ;
- rend la décision finale de classement **à la place du référent**, qui n'a pas la compétence de
  fond sur ce thème ;
- pose `meta.relecture_referent: false` et rédige les conditions de rédaction opposables ;
- écrit `docs/veille/verifications-backlog/<ID>-agent-C-reconciliation.md`.

Un désaccord non tranchable sur pièces impose `reporte`, comme au §7 — mais **une zone de
compétence hors de portée des trois agents, déclarée identiquement par A et B, n'est pas un
désaccord** : elle se traite par retrait du contenu concerné, pas par report indéfini d'un item
qu'aucun agent orthophoniste ne viendra jamais compléter.

## Étape 3 — Ce qui doit ressortir de toute réconciliation

- Un tableau de classement complet (`route`, `niveau_impact`, `niveau_preuve`, `themes[]`,
  `professions_concernees[]`, `concerne_decision`, `meta.relecture_referent`).
- Des **conditions de rédaction opposables** : ce que l'entrée devra dire, ce qu'elle ne devra
  jamais reprendre (formulations de spin repérées dans la source ou son relais).
- Une section honnête sur ce que la procédure ne garantit pas (l'angle mort partagé par les agents).
- Mets à jour le tableau de suivi de `docs/veille/JOURNAL_BOITE_MAIL.md` §2bis (ou l'équivalent en
  cours) au fur et à mesure, pas en bloc à la fin.

## Avant de reporter un item pour inaccessibilité

Épuiser `recherche-source-primaire` (registre d'essai, vérification d'accès PubMed) **avant**
d'accepter le report — un item reporté par réflexe alors que l'accès existait ailleurs est un
report inutile qui coûte un cycle.
