---
name: recherche-source-primaire
description: Socle commun des circuits de preuve — établir l'identité et l'accès d'une source primaire (étude, essai, méta-analyse), tenir le registre des affirmations, contredire, consolider, encadrer OpenEvidence, avec deux scripts déterministes (identite.mjs, verifier-registre.mjs). Chargé par `verif-source-veille` et `recherche-preuve-triangulee` et par leurs agents — rarement invoqué seul.
---

# Recherche de source primaire — socle

Socle commun aux deux circuits de preuve du projet : la veille (`docs/veille/SOP_veille.md` §7,
§7bis) et la collecte du module Décision (étape P4 de `docs/decision/CONSTRUIRE-UN-MODULE.md`,
méthode dans `docs/decision/00-global.md`). Les circuits (`verif-source-veille`,
`recherche-preuve-triangulee`) le chargent, eux et leurs agents ; il ne s'invoque seul que pour une
question ponctuelle d'accès ou d'identité.

Cette page n'est qu'une entrée : elle dit **quelle référence ouvrir**. Chaque référence porte la
marche à suivre et renvoie au domicile de la règle — une règle, un domicile.

## Garde-fou central

La source primaire est la seule référence ; un outil d'IA, un connecteur, un relais de presse ou un
résumé secondaire ne servent qu'au repérage. Domicile : `docs/decision/00-global.md` § Pipeline d'un
nœud (l.20-30, étape 2) et `docs/veille/SOP_veille.md` §9. Jamais de contournement de paywall :
`CLAUDE.md` invariant 7.

## Premier geste

Constater les outils réellement exposés dans la session et écrire `Outils disponibles : …` en tête
du rapport, chaque outil MCP nommé `Serveur:outil` ; un outil absent n'est jamais appelé. Marche à
suivre : `references/acces-identite.md` § 1.

## Quelle référence pour quel besoin

| Besoin | Référence |
|---|---|
| Qualifier l'accès (six états), établir l'identité d'une étude, voies ouvertes, avant un report pour accès, avant un verdict d'absence | `references/acces-identite.md` |
| Relier chaque affirmation au passage lu, familles d'essai, chiffres dérivés, journal de recherche, réutiliser un dossier | `references/registre-affirmations.md` |
| Contredire une collecte : lecture indépendante, erreurs communes, omissions | `references/contradiction.md` |
| Consolider plusieurs rapports en un dossier | `references/consolidation.md` |
| Poser une question à OpenEvidence et traiter son retour (accord, modèle, statut du retour) | `references/openevidence.md` |
| Savoir quel incident a fait naître quelle règle, et où elle vit | `references/lecons.md` |

Ne charger que la référence dont l'étape a besoin.

## Scripts

Outillage de recherche, lancé depuis la racine du dépôt — jamais depuis l'application
(`CLAUDE.md` invariant 1). Aucune dépendance : `fetch` natif de Node.

```bash
# Identité, accès ouvert légal, rétractation/correction, famille d'essai, préprint lié
node .claude/skills/recherche-source-primaire/scripts/identite.mjs <DOI|PMID> [--json]

# Porte du registre des affirmations, avant de déclarer un dossier consolidé
node .claude/skills/recherche-source-primaire/scripts/verifier-registre.mjs <registre.md> [--json]
```

Lecture de leur sortie et de leurs codes : `references/acces-identite.md` § 6 et
`references/registre-affirmations.md` § La porte.

## OpenEvidence

Aucune question OE sans accord du référent donné dans la conversation ; seul l'orchestrateur
appelle le CLI, jamais un agent. Détail : `references/openevidence.md` § 1 ; chemin, options et
codes du CLI : `docs/commun/OUTIL-INTERFACE-OE.md`.

## Ce qui a quitté cette page

Tarifs, volumes et noms d'outils des connecteurs (constats d'août 2026) : `references/acces-identite.md`
§ Anciens usages et fiches datées.
