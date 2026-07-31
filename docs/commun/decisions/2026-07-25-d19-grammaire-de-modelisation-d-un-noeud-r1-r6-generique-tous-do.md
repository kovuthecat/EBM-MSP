# 2026-07-25 — D19 · Grammaire de modélisation d'un nœud (R1→R6), générique tous domaines

### Décision

Six règles, énoncées **hors de tout domaine** dans `docs/decision/GRAMMAIRE-NOEUD.md`, deviennent
contraignantes pour l'écriture de n'importe quel nœud — DT2 comme domaines à venir :

- **R1** — un **état** clinique ne se déduit jamais d'une **intention** déclarée. Corollaire : quand un
  état est calculable par un autre nœud, on **pose la question** dans le nœud qui en a besoin plutôt que
  d'imposer un chaînage ; l'autre nœud reste une aide, jamais un prérequis.
- **R2** — toute option porte son **délai de bénéfice**. L'outil le pose à côté de l'horizon du patient
  et **ne conclut pas à sa place** : convertir « espérance de vie limitée » en mois produirait une fausse
  précision et un arbitrage clinique caché (invariant 2).
- **R3** — modifier un traitement existant, c'est **deux décisions** : le verdict sur la ligne (déclenché
  par sa seule présence) et le choix du remplaçant (avec ses propres garde-fous). Les exclusions du
  verdict sont structurelles, jamais celles d'une destination.
- **R4** — « écartée par une `exclusion` » (elle était indiquée, un garde-fou l'a retirée : **sécurité**,
  affichée) et « non retenue faute de `condition` » (elle n'était pas indiquée : **explication**, sur
  demande) sont deux silences distincts, qui ne se présentent pas de la même façon.
- **R5** — un critère qu'on demande doit **changer quelque chose à l'écran** pour au moins un profil du
  banc, sinon il est retiré ou rebranché.
- **R6** — l'argumentaire est **situationnel** : les critères de *ce* patient qui ont fait proposer
  l'option, jamais l'énumération de ceux qui pourraient la faire proposer.

Le banc d'un nœud cesse d'être une collection de vignettes et devient **trois couches** : vignettes
(relecture clinique, donc peu nombreuses), couverture (mécanique, aucune relecture), invariants
(validés une fois, vérifiés ensuite sur tout l'espace des profils). Sept invariants DT2 validés par le
référent le 2026-07-25.

### Portée

- `position_vs_cible` remplace la déduction de `cible_atteinte` depuis `intention` (R1) ; le seuil absolu
  `HbA1c >= 8,5 %` de `palette_glycemique_ouverte`, aveugle à l'objectif du patient, disparaît.
- Le switch d'un agent sans bénéfice dur se déclenche sur sa **seule présence** (décision référent) ; la
  comorbidité choisit désormais le remplaçant et son rang. Nouveau dérivé
  `remplacement_agent_sans_benefice`, **sulfamide seulement** à ce stade — la gliptine l'y rejoindra
  quand `ne_contient_pas gliptine` sera levé de l'option AR GLP‑1, après R4 (séquencement tranché par le
  référent : garantie structurelle conservée d'abord, dette de la recette assumée jusque-là).
- Champ `delai_benefice` (affichage seul) ; trois valeurs extraites d'`effet_attendu` déjà sourcés.
- Grammaire `derive` étendue à `contient`/`ne_contient_pas` — le schéma la déclarait déjà, à tort, comme
  un sur-ensemble de `conditions`.
- Écran et signature de pertinence unifiés sur un **modèle de vue unique** : tout ce qui est affiché
  entre dans la signature par construction.
- `BRIEF_DECISION.md` §5/§6/§7 et `00-global.md` renvoient à la grammaire au lieu de la redire ; la liste
  des « variables communes » du §6 est supprimée (elle avait divergé : quatre variables listées
  n'existaient dans aucun nœud).

### Raison

La recette référent du nœud `prescription` (2026-07-25) a produit une série de corrections qui ne
convergeait pas : chaque correctif révélait le défaut suivant. Le diagnostic, obtenu en rejouant le
profil de recette sur le moteur réel, est que **les défauts n'étaient pas des bugs d'affichage mais des
défauts de modélisation du raisonnement clinique** — donc reproductibles à l'identique dans tout nœud et
tout domaine à venir. Quatre régressions successives avaient d'ailleurs la même cause unique : deux
sous-systèmes en désaccord sur « ce qui est affiché ». La règle de discipline qui les encadrait n'a pas
tenu quatre fois ; elle devient structurelle.
