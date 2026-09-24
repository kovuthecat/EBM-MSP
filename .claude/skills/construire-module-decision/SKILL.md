---
name: construire-module-decision
description: Orchestration du procédé P0→P7 pour ouvrir un nouveau domaine de décision ou un module de nœuds (D22) — qualifie d'abord la demande (thème de veille, domaine de décision, module, nœud, ou sortie sans module), tient un état de chantier unique, fait respecter les portes arbitrées de `docs/decision/CONSTRUIRE-UN-MODULE.md`, appelle `recherche-preuve-triangulee` en P4, rouvre le contrat quand la preuve ou l'encodage le contredit, reprend au bon endroit après interruption. À dérouler quand le référent veut ouvrir un nouveau thème, domaine ou module dans le module Décision, ou reprendre un tel chantier. Ne produit aucun contenu clinique à la place du référent.
---

# Construire un module de décision — orchestration du procédé

Cette skill fait tenir **l'ordre, les livrables et les portes** du procédé ; elle appelle les circuits
spécialisés au bon moment. Elle ne porte aucune règle en propre : chaque règle a son domicile, et la
skill y renvoie section par section.

| Autorité | Pour quoi | Où |
| --- | --- | --- |
| Le procédé (ordre, portes, checklists) | ce que la skill fait respecter | `docs/decision/CONSTRUIRE-UN-MODULE.md` |
| Ce que le référent a tranché dans le procédé, point par point (A1-A12) | ce qui est prescrit ou seulement proposé | `docs/decision/ARBITRAGE-construire-un-module.md`, `DECISIONS.md` D66 |
| L'écriture d'un nœud (R1→R16) | P5, relectures | `docs/decision/GRAMMAIRE-NOEUD.md` |
| La preuve (P4) | sourcing, red-team, OE | `recherche-preuve-triangulee`, socle `recherche-source-primaire` |

Si cette skill et `CONSTRUIRE-UN-MODULE.md` divergent, **le document prime** : appliquer le document et
signaler l'écart au référent.

## Mode : ce que la skill prescrit

**Relire l'en-tête de statut de `CONSTRUIRE-UN-MODULE.md` à chaque ouverture de la skill.** Au
2026-09-24, il vaut « arbitré en partie » (D66). La skill en tire son mode :

- **Prescrit** (porte bloquante, rien ne passe sans preuve) : les passages sans repère, qui reposent sur
  une décision du registre, et ceux qui portent le repère *(arbitré le 2026-09-24 — Ax)*, amendements
  compris.
- **Proposé** (présenté au référent, qui décide ; jamais une porte) : les passages marqués
  *(aide-mémoire — A11)* ou *(aide-mémoire — A12)*, et les passages historiques.

Si l'en-tête change, le mode suit. « Procédé arbitré » : tout devient prescrit, sauf ce qui est marqué
rejeté. « Reste une proposition » : la skill **oriente sans prescrire**. Elle qualifie la demande, tient
l'état et propose l'ordre, mais aucune porte ne bloque.

## Ce que la skill ne fait jamais

1. **Écrire du contenu clinique à la place du référent.** En P1, elle interroge sans jamais proposer
   d'intention (A2). En P2, elle peut proposer des vignettes, marquées « proposée, non validée » : une
   vignette n'entre au contrat qu'après la validation écrite du référent (A5). Elle ne tranche jamais une
   sortie attendue, un arbitrage ou une validation clinique, et ne tient jamais un silence pour un accord.
2. **Enregistrer une donnée patient.** Toute vignette est une situation synthétique, non identifiante
   (A4, D4, invariant 1 de `CLAUDE.md`). Si une situation dictée contient une date, un lieu ou une
   histoire singulière, elle est écartée et le référent reformule la situation type.
3. **Ouvrir la collecte (P4), OpenEvidence compris, avant le gel des vignettes (P2)** (A5). OE ne
   s'interroge qu'à l'étape 3 de `recherche-preuve-triangulee`, sur accord écrit du référent.
4. **Écrire du YAML avant P5 et son brouillon de table des conditions** (A9).
5. **Passer une porte sur une case cochée.** Une porte passe sur pièce : fichier au chemin dit, commit,
   sortie de commande, validation du référent datée et tracée dans l'état.
6. **Modifier le moteur ou le socle** dans le chantier d'un module. Une évolution du socle devient un
   chantier distinct, proposé au référent.

## Étape 0 — Qualifier la demande

Avant tout fichier, établir **quoi** est demandé. Un thème de veille, un domaine de décision et un
module de nœuds sont trois choses différentes.

| Demande | Signes | Suite |
| --- | --- | --- |
| **Thème de veille** | surveiller un sujet, ajouter une source ou un thème à la taxonomie | **pas de P0→P7** ; renvoyer à la taxonomie et à `docs/veille/SOP_veille.md` (précédent : D63), puis s'arrêter |
| **Domaine de décision** | un champ clinique nouveau, avec ses propres décisions à aider | fiche de domaine (`references/cadrage.md` § 1), puis P0 |
| **Module de nœuds (D22)** | regrouper des nœuds d'un domaine existant sous un primer d'orientation | au moins deux nœuds, jamais de chaînage (D22, checklist 2.5) ; pas un nouveau domaine |
| **Nœud dans un domaine existant** | une décision de plus dans un domaine qui a déjà son fichier commun | P1 à P7 pour ce nœud ; le fichier commun du domaine existe déjà |
| **Ambiguë** | rien ne départage | poser au référent les questions de la fiche ; **ne rien ouvrir** tant qu'il n'a pas répondu |

**Une sortie légitime sans nouveau module.** À l'issue du cadrage, présenter au référent les issues qui
répondent parfois mieux au besoin : une fiche informative, l'enrichissement d'un nœud ou d'un module
existant, un périmètre plus étroit. Pour une démarche diagnostique ou une logique temporelle nouvelle,
vérifier d'abord que le moteur sait la représenter ; sinon, proposer un chantier du socle, distinct. Le
référent choisit.

## L'état de chantier unique

Un seul document d'état par chantier (opposable, A12 ; `CONSTRUIRE-UN-MODULE.md` §6, item 1) :
`docs/decision/validation/chantier-<AAAA-MM-JJ>-<domaine>/ETAT.md`, daté du jour d'ouverture et conservé
jusqu'à la clôture. Gabarit : `references/etat-chantier.md`. Tous les livrables du chantier vont dans ce
dossier, sauf ceux que le procédé domicilie ailleurs (fichier commun sous `content/`, brouillon de table
dans `docs/decision/noeuds/`).

Il porte la phase courante, **une** prochaine action, les livrables (chemin et commit), les validations
obtenues (qui, quand, sur quoi, où c'est tracé), les blocages et leur nature, la chaîne traçable et les
réouvertures. La chaîne traçable relie intention → vignette → sous-question de preuve → conclusion
validée → option → vérification du comportement. Elle fait voir une recherche qui ne sert aucune
décision, et une option qui ne répond à aucune vignette.

Mettre l'état à jour à chaque porte franchie, à chaque réouverture et avant de rendre la main. Une
décision s'y écrit, puis migre : vers `DECISIONS.md` si elle est transverse, vers
`docs/decision/noeuds/` si elle est clinique.

## Les portes, P0 à P7

Chaque ligne renvoie à sa section de `CONSTRUIRE-UN-MODULE.md` §1. Le détail des preuves à réunir est
dans les références.

| Phase | Statut au 2026-09-24 | Preuve exigée pour passer | Ce que la skill ne fait pas |
| --- | --- | --- | --- |
| **P0** Prérequis | prescrit, A1 amendé : la ligne « catalogue » (T-019) ne bloque pas | bilan des prérequis, chaque ligne avec la commande qui la prouve (`references/prerequis.md`) | construire le catalogue inter-domaines ; corriger le socle dans ce chantier |
| **P1** Cadrer | prescrit : A2 amendé, A3, D54 | intentions et inventaire de l'existant écrits par le référent ; trois questions tranchées par écrit ; fichier commun du domaine créé, règle de cliquet en tête (`references/cadrage.md` § 2) | proposer une intention |
| **P2** Vignettes | prescrit : A4, A5 amendé | vignettes validées puis gelées par le référent (date, trace) ; rouges attendus nommés ; cas tordus couverts (`references/vignettes.md`) | geler à sa place ; garder une vignette identifiante |
| **P3** Écran | prescrit : A6 | trois écrans rendus sur trois vignettes, contenu fictif marqué partout ; registre de formulation validé par le référent | présenter la maquette comme du contenu |
| **P4** Preuve | prescrit : A7, A8 | dossier consolidé par `recherche-preuve-triangulee`, porte du registre à 0, validé cliniquement par le référent (§ P4 ci-dessous) | collecter hors des décisions que les vignettes exigent ; relancer avant d'avoir intégré la collecte précédente |
| **P5** Encodage | prescrit : A9, D30 | brouillon de table dans le dossier du nœud, **antérieur** au premier commit du YAML ; N0 vert ; `presomption_non` conforme (`references/cloture.md` § P5) | écrire le brouillon après le YAML |
| **P6** Vérifier | prescrit : A9, D30, D32, D54 | piste A close ; piste B verte ou dette nommée ; I21, I22, I23 verts ; table régénérée **diffée** contre le brouillon, chaque écart justifié ; I33 (`references/cloture.md` § P6) | tenir une fidélité au dossier pour un comportement correct |
| **P7** Recette | prescrit : A10 | recette référent et recette navigateur closes, sans défaut grave ouvert, allers-retours et résumés repliés compris (`references/cloture.md` § P7) | automatiser la recette navigateur hors du navigateur intégré |

**Checklists du §2**, avant tout `valide` : les items sans repère ou marqués A3, A9, R11 et R12 sont
opposables ; les items *(aide-mémoire — A11)* se présentent au référent, ils ne bloquent pas
(`references/cloture.md` § Checklists).

**Commandes.** Celles des références ont été vérifiées dans le dépôt le 2026-09-24. Avant de les lancer,
vérifier que le fichier visé existe encore ; ne jamais recopier une commande d'un exemple historique.

## P4 — appeler le circuit de preuve

Enchaînement arbitré (A7) :

1. **Dériver les sous-questions des vignettes gelées.** Chacune cite la ou les vignettes et la décision
   qu'elle sert. Une sous-question qui ne sert aucune décision exigée par une vignette ne se lance pas
   (A8).
2. **Invoquer `recherche-preuve-triangulee`.** Son cadrage (étape 1) reçoit les vignettes gelées. Son
   étape 3 porte la seule demande d'accord OE, et son étape 6 fait la consolidation
   (`.claude/skills/recherche-source-primaire/references/consolidation.md`).
3. **Porter la synthèse au référent** pour validation clinique avant P5. Entre la collecte et la passe
   adversariale, tout ce qu'on lui rapporte est annoncé comme **provisoire** (§ P4).
4. **Une collecte qui accuse un nœud existant** est suspecte d'abord (A8). Aucune correction qui en
   vient n'entre dans `content/` avant sa passe adversariale.

## Réouvertures

Une réouverture se consigne dans l'état. Elle ne dégèle que la pièce concernée : les autres
validations restent acquises.

- **La preuve (P4) contredit une sortie attendue (P2).** Écrire le conflit dans l'état : vignette,
  sortie attendue, conclusion consolidée, certitude, source. Soumettre la révision de la vignette au
  référent. Ne pas plier la littérature à la vignette, ne pas modifier la vignette soi-même. Les
  décisions concernées restent bloquées avant P5 jusqu'à sa réponse.
- **L'encodage (P5) découvre une situation oubliée.** Rouvrir P2 (vignette proposée, validée, gelée)
  **avant** de toucher au brouillon de table.
- **Le diff de P6 diverge.** Soit le brouillon sous-estimait un cas réel, et l'on rouvre P2 ; soit
  l'encodage a dérivé sans raison, et l'on corrige le YAML. Une divergence non justifiée bloque la
  clôture (A9).
- **Un nouveau fait de sécurité apparaît.** Il s'écrit dans le fichier commun du domaine, avec son
  `concerne`. On lance I33, puis on rouvre **chaque nœud concerné, clos compris** : il déclare le fait
  (`{ ref }`) ou le range hors périmètre avec un motif clinique (D54).

## Référent absent

Qualification ambiguë, intentions, validation ou gel de vignettes, accord OE, validation clinique du
dossier, arbitrage, recette : aucun de ces gestes ne se fait sans le référent. S'il est injoignable :

1. écrire dans l'état la question précise, en blocage « attente référent » ;
2. n'avancer que sur ce qui ne dépend pas de lui (le bilan technique de P0, par exemple) ;
3. s'arrêter là.

Ne jamais remplir une sortie attendue « en attendant », ni tenir une vignette proposée pour validée.

## Reprise après interruption

1. Lire l'état du chantier.
2. **Re-vérifier chaque pièce** : le fichier existe au chemin dit, le commit existe, la date du
   brouillon précède celle du YAML, chaque validation est tracée (qui, quand, où). En P4, rejouer la
   porte du registre. Une case cochée sans pièce ne vaut rien.
3. **Reprendre à la première porte dont la preuve manque**, même si l'état annonce une phase plus
   avancée. Écrire l'écart dans l'état.
4. **Ne pas relancer la recherche** : réutiliser le dossier du chantier. Une relance passe par l'étape 5
   de `recherche-preuve-triangulee`, qui exige de dire ce qu'elle changerait.
5. Consigner la reprise : date, porte retrouvée, pièces manquantes.

Des pièces existent mais aucun état : le reconstituer à partir des pièces, le marquer « reconstitué »,
et demander au référent de confirmer toute validation qui n'a pas de trace.

## Entre domaines

Quand un critère porte le nom d'un critère d'un domaine existant, comparer sa définition, son unité et
son sens (R14) ; la ressemblance de nom ne suffit pas. Consigner les divergences dans l'état. Le
référent dit si une divergence est légitime (contexte différent) ou involontaire. Le catalogue
inter-domaines (T-019) ne bloque pas P0 (A1) : ses écarts se consignent.

## Références

- `references/etat-chantier.md` : gabarit de l'état de chantier.
- `references/cadrage.md` : fiche de domaine, gabarit P1, questions à poser sans proposer.
- `references/vignettes.md` : gabarit de vignette, contrôle non identifiant, gel.
- `references/prerequis.md` : bilan des prérequis de P0.
- `references/cloture.md` : preuves de P5 à P7, checklists, clôture d'un nœud et du chantier.
