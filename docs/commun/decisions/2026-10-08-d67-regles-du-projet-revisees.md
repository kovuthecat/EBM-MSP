# 2026-10-08 — D67 · Règles du projet révisées

> Issue de la revue des règles des projets (dépôt Templates,
> `docs/analyses/2026-10-08-regles-projets-inventaire.md`, section ebm-msp : 5 règles sur 23
> avaient bloqué, 4 suspectes). Tranché par l'utilisateur, règle par règle.

## Ce que ça change, en clair

- **Zéro donnée patient : inchangé sur le fond, texte remis à jour.** L'invariant 1 intègre ses
  amendements (mémoire de session D28, « Nouveau patient » D33, valeur publiée D50) et renvoie côté
  Veille à D51 au lieu de D4. Rien ne survit à la session, c'est toujours absolu.
- **Moteur générique : gardé, avec la marche à suivre.** Quand un cas semble exiger un nom de nœud
  ou de critère en dur, la voie est un champ de contenu nouveau (précédent : `prioritaire_si`, P12),
  pas une exception dans le code. Revers : chaque cas coûte un changement de schéma et passe par le
  circuit de validation des nœuds (D5).
- **« Pile runtime figée » retirée** (ancien invariant 8) : la règle commune du workflow (aucune
  dépendance hors décision de plan) dit la même chose ; stack en D1, exceptions en vigueur en D51 ;
  le module Décision reste sans réseau par l'invariant 1.
- **« Publication par pull request » retirée** (invariant 3) : jamais appliquée. La trace d'une
  modification de nœud reste version + changelog + validation humaine (invariant 4). Revers : pas
  de diff relu dans une PR avant publication.
- **Seuil deux colonnes** : ARCHITECTURE dit 1200 px (D47), réglage mesuré, pas un invariant.
- **Une règle, un fichier** : la vérification des analyses de veille (bi-agents, J+3, tri-agents)
  ne se recopie plus dans le brief, qui renvoie à `docs/veille/SOP_veille.md`.
- **Retirés ou précisés** : « à lire avant une tâche importante » (le workflow le porte) ; bloc
  « Critères avant ajout de feature » du brief (gabarit jamais appliqué) ; checklists de
  `CONSTRUIRE-UN-MODULE.md` opposables seulement pour les points validés par D66 ; renvoi
  ARCHITECTURE → `.claude/workflow/CONVENTIONS.md`.

Non touchés : `docs/decision/BRIEF_DECISION.md` et `docs/veille/BRIEF_VEILLE.md` (briefs d'origine,
historiques, qui parlent encore de pull request et d'hébergement Netlify).
