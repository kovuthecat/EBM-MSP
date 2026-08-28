---
name: recherche-preuve-triangulee
description: Circuit de collecte et vérification de preuve pour le module Décision — question clinique ouverte plutôt qu'une source unique, recherche Agent A + prompt OpenEvidence ciblé + red-team Agent B sur les deux retours combinés. À dérouler pour l'étape P4 (« Collecte EBM ») de `docs/decision/CONSTRUIRE-UN-MODULE.md`, ou pour toute question ponctuelle du référent sur un nœud existant. Référence `docs/decision/00-global.md` §Pipeline d'un nœud, étapes 2-4.
---

# Recherche de preuve triangulée — module Décision

Charge d'abord le skill `recherche-source-primaire`. Ce circuit répond à une **question clinique
(PICO)**, pas à la vérification d'un document donné — c'est la différence structurante avec
`verif-source-veille`. Exemple complet et vérifié qui a servi de référence pour ce skill :
`docs/decision/validation/chantier-2026-07-26/preuve-statine-sujet-tres-age.md` +
`redteam-preuve-statine-sujet-tres-age.md`.

Circuit **plus coûteux** que la vérification veille par nature : Agent A cherche dans plusieurs
sources, pas dans une seule, et Agent B rouvre chacune indépendamment. Un skill ne réduit pas ce
coût — il évite de reconstruire la discipline de citation et les gabarits de prompt à chaque fois.

## Étape 1 — Agent A : collecte et appréciation

Donne-lui la question clinique exacte du référent, telle quelle. Réflexe d'outillage : privilégier
les connecteurs MCP nommés dans `recherche-source-primaire` (PubMed, ClinicalTrials.gov, Consensus,
Elicit) avant un fetch web générique — accès structuré (PMID, statut open access, SAP d'essai) plus
fiable qu'un scraping de page. `recherche-source-primaire` reste la référence pour les pièges propres
à chaque connecteur (accès Elicit à tester une fois, extraction PDF ClinicalTrials, etc.). Il doit produire une **table
maîtresse des preuves** avec, par ligne : étude (PMID/DOI), population **exacte** (tranche d'âge
réelle incluse, comorbidités incluses/exclues), intervention, critère (dur ou substitution),
résultat **chiffré en effet absolu** (pas seulement relatif — NNT/NNH, IC, horizon temporel), niveau
GRADE, statut de récupération (`oui` / `partiel — via résumés secondaires concordants` /
`NON VÉRIFIÉ`), URL.

Discipline non négociable :
- Un chiffre non confirmé par citation directe du texte primaire (accès payant) est marqué
  `NON VÉRIFIÉ (partiel)`, jamais présenté comme équivalent à un chiffre vérifié.
- Distinguer un **essai terminé sans résultats publiés** d'un essai dont le résultat est confirmé
  négatif ou absent — un protocole n'est pas un résultat.
- Proposer plusieurs **formulations graduées** (de la plus prudente à la plus affirmative) plutôt
  qu'une seule conclusion tranchée — c'est au référent de choisir le degré d'affirmation, pas à
  l'agent de le décider à sa place.
- Ne pas dupliquer un travail de preuve déjà fait et vérifié dans un dossier existant du projet — le
  rappeler pour mémoire sans le refetcher.

### Générer le prompt OpenEvidence à la fin du rapport d'Agent A

Prompt **prêt à poser**. OpenEvidence est désormais **interrogeable en ligne de commande**, par
l'application Interface-OE — commande, codes de sortie, coût et garde-fous :
`docs/commun/OUTIL-INTERFACE-OE.md`. Son statut ne change pas pour autant : outil externe de
débroussaillage, **jamais une source primaire**, et un retour obtenu par CLI n'est pas plus fiable
qu'un retour collé à la main. Éléments obligatoires du prompt :
- Pour chaque essai cité : population exacte, intervention, critère dur/substitution, effet
  **absolu** chiffré avec IC et horizon, PMID/DOI exact.
- **Consigne impérative** : si aucun essai randomisé ne répond précisément à la question, l'écrire
  explicitement (« aucun ECR trouvé ») plutôt que de substituer silencieusement une étude
  observationnelle ou un avis d'expert présenté comme un niveau de preuve équivalent.
- Exclusion explicite des sources déjà pré-appréciées que le projet connaît (HAS, SFD, CMG,
  Prescrire, Médicalement Geek/DragiWebdo, Minerva, ebmfrance) — OpenEvidence doit chercher les
  essais primaires et les recommandations internationales indexées, pas reformuler ce que le projet
  a déjà.
- Les sous-questions précises que le référent veut trancher, nommées une par une (pas une question
  générale) — c'est ce qui permet au red-team de vérifier point par point.

**Poser la question** — après accord explicite du référent, une requête OE étant prélevée sur son
compte et son budget (`docs/commun/OUTIL-INTERFACE-OE.md` § Le coût) :

```bash
node "C:/Users/kovu/SynologyDrive/Thibault/Projets/Interface-OE/out/cli/index.js" demander "<prompt>" --output docs/decision/validation/<chantier>/OE-<sujet>.md --json
```

Une seule question à la fois, jamais deux appels en parallèle ; un appel peut attendre plusieurs
minutes (file d'attente + rythme humain), ne pas le couper. **Code de sortie 3 = défi anti-robot :
arrêt immédiat, aucun réessai, la main au référent.** Code 1 : la réponse est incomplète et le dit
en tête — ne pas la passer à Agent B comme si elle était entière.

Si le CLI est indisponible (application injoignable, routage inactif, code 3), repli inchangé : le
référent exécute le prompt à la main et sauvegarde le retour au même chemin.

## Étape 2 — Agent B : red-team sur les deux retours combinés

Contexte isolé. Attaque **conjointement** le rapport d'Agent A et le fichier OpenEvidence — pas l'un
puis l'autre séparément. Rouvre directement les sources primaires via les connecteurs MCP (PubMed,
ClinicalTrials.gov, Consensus, Elicit — cf. `recherche-source-primaire`), revues, PDF officiels,
partout où l'accès n'est pas payant ; note explicitement les accès obtenus et les accès bloqués en
tête de son rapport.

### Structure de sortie attendue (gabarit vérifié sur l'exemple statine)

- **Findings classés par sévérité** (HAUTE / MOYENNE / BASSE) **et par origine** : OpenEvidence
  seule fautive / Agent A ET OpenEvidence (erreur partagée — signale souvent une source secondaire
  commune, pas une coïncidence) / Agent A seule / la source primaire elle-même (une coquille dans le
  document source, pas une erreur des agents) / non-vérifiable (accès bloqué, à traiter comme un
  résultat honnête, pas un manquement).
- **Section « Confirmations obtenues »** distincte des findings — ce qui a été vérifié et tient,
  pas seulement ce qui cloche.
- **Un décompte final** par sévérité et par origine — utile pour juger la fiabilité relative
  d'OpenEvidence vs de l'agent sur ce type de question, dans la durée.
- **Un verdict par sous-question** posée par le référent, pas un verdict global unique.
- **Une proposition de libellé concret** pour le contenu qui irait dans le nœud (`.yaml` ou
  argumentaire) si le référent valide — pas seulement une critique, une sortie exploitable.

## Étape 3 — Boucler jusqu'à résolution

`00-global.md` : « Répéter la boucle A/B/OE jusqu'à ce que les `[À VÉRIFIER]` décisionnels soient
levés. » Ce n'est pas un circuit à passage unique comme la veille — si des points restent
`NON VÉRIFIÉ` ou `[À VÉRIFIER]` après le premier passage et qu'ils sont décisionnels (pèsent sur le
choix clinique), relancer un tour ciblé sur ces points précis plutôt que de conclure avec une
incertitude non résolue.

## Sortie finale

Le rapport de red-team porte la décision jusqu'au référent (étape 6, validation clinique humaine du
pipeline `00-global.md`) — jamais d'encodage direct en YAML depuis ce circuit sans cette validation.
