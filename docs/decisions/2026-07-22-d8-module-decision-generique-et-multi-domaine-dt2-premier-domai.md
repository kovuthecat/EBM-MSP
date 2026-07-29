# 2026-07-22 — D8 · Module Décision générique et multi-domaine (DT2 = premier domaine)

### Décision

Le module Décision n'est **pas** un outil « DT2 » : c'est un moteur générique servant une bibliothèque
de **domaines de décision**. Le moteur et l'UI ne connaissent **aucun domaine ni nœud par son nom** ;
chaque nœud porte un champ `domaine` (ex. `diabete-type-2`) et tout est piloté par le contenu. **Le
DT2 est le premier domaine** livré (il amorce et valide le socle) ; CV, BPCO, gériatrie, prévention…
suivront en ajoutant des nœuds YAML, sans toucher au moteur.

### Contexte

Précision apportée par Thibault à l'initiation : le DT2 est le premier des nombreux domaines à venir,
pas le périmètre définitif. Aligné sur le précédent ETP interactif (moteur multi-thème par conception :
le générique vit dans `src/components`/`registry`, le spécifique sous `src/features/<theme>/`).

### Conséquences

- La navigation Décision prévoit un niveau **domaine** (sélecteur/en-tête) même si un seul est présent
  en v1 (`ARCHITECTURE.md` D2).
- Le JSON Schema du nœud rend `domaine` obligatoire ; le contenu s'organise par domaine
  (`/content/noeuds/<domaine>/…` envisageable quand plusieurs domaines coexistent).
- « Élargir la décision au-delà du DT2 » n'est pas un hors-périmètre définitif mais une **phase
  ultérieure** (cf. `PROJECT_BRIEF.md` Roadmap) — à ne pas entamer avant que le socle DT2 soit stable.
