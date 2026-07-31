# 2026-07-22 — D10 · Extensions schéma/moteur pour les nœuds multi-facteurs (P2)

### Décision

Issu du cadrage des 8 nœuds (`docs/decision/CADRAGE-8-noeuds.md`) ; validé par le référent (choix
technique délégué) :

- **`traitements_en_cours` = critère multivalué** : ajouter un type `liste` (avec `valeurs`) et un
  opérateur `contient` au DSL de conditions (moteur, P2). *(alternative « un bool par classe » écartée :
  moins lisible.)*
- **Options des nœuds multi-facteurs (B, C)** : plusieurs options peuvent être **« recommandées »
  simultanément**, chacune avec son « pourquoi ». Champ optionnel **`priorite`** (entier) sur `option`
  pour l'ordre ; pas de gagnant unique forcé.
- **`contre_indications` = exclusions dures** : le moteur (P2) les évalue pour **retirer/avertir** une
  option, distinctement de `conditions` (applicabilité).

### Portée

**P2** (nœuds B→H). **Le nœud A / P1 n'est pas concerné** (n'utilise que `nombre`/`enum`/`bool`, options
en échelle, pas de multivalué, CI triviales). **Forward-compat** : le JSON Schema (S2) inclut **dès
maintenant** le type `liste` et le champ optionnel `priorite` → pas de migration de schéma en P2.

### Raison

Modéliser fidèlement B/C (indications cardio-rénales multiples des iSGLT2/aGLP1) sans échelle
artificielle ; les CI sont cliniquement des exclusions dures. Cf. §Observations du cadrage.
