# Bilan des prérequis — P0

Autorité : `CONSTRUIRE-UN-MODULE.md` § P0 et § 3 (invariants génériques) ; arbitrage A1, amendé :
« porte bloquante, sauf la ligne « catalogue inter-domaines » (T-019), qui ne bloque pas et reste à
cadrer avec D22 et D36 ». Livrable : `<dossier du chantier>/prerequis.md`, référencé dans l'état.

Le bilan ne promet aucune réutilisation qu'il n'a pas vérifiée. Chaque ligne porte la commande lancée,
sa date et son résultat, pas une appréciation.

| Prérequis | Bloque ? | Preuve | Fondement |
| --- | --- | --- | --- |
| R7 en vigueur (valeur indéterminée) | oui | `npx vitest run src/features/decision/engine/banc/vierge.test.ts` vert | D20, D30 |
| Invariants génériques du banc verts sur tous les nœuds existants (I3, I4, I7, « jamais une option affichée dont une exclusion est vraie », I2′) | oui | `npx vitest run src/features/decision/engine/banc/invariants.test.ts src/features/decision/engine/banc/invariants-contenu.test.ts` vert ; nommer, par recherche dans ces fichiers, le test qui porte chaque invariant | D19 ; A1 |
| Bornes `min`/`max` sur tout critère `nombre` | oui | `npx vitest run src/features/decision/engine/banc/couverture.test.ts` vert ; schéma `schema/noeud.schema.json` | table validée le 2026-07-26, D54 |
| Catalogue de critères canonique inter-domaines (T-019) | **non** (A1) | état constaté (existe, partiel, absent) et écarts relevés entre domaines | à cadrer avec D22 et D36 |
| Corrections systémiques du moteur connues et non faites | oui | liste des chantiers du socle ouverts qui touchent ce que le domaine demandera (`TASKS.md`), chacun avec son effet sur le domaine | §6 item 4 (A1) |
| Compatibilité du type de décision avec le moteur | oui, si incompatible | constat de la fiche de domaine (`cadrage.md` § 1) | §11.3 du rapport de propositions |

Les commandes ont été vérifiées dans le dépôt le 2026-09-24. Avant de les lancer, vérifier que le
fichier existe encore. `node .claude/workflow/bin/n0.mjs` rejoue toute la suite, mais un vert global
ne dit pas **quel** prérequis il prouve : garder la commande ciblée.

## Issue

- Toutes les lignes bloquantes vertes : P0 franchie, consignée dans l'état avec la date.
- Une ligne bloquante rouge : P0 non franchie. La correction relève du socle ; elle se propose au
  référent comme **chantier distinct**, et ce chantier-ci attend. Tout contenu écrit avant est de la
  dette.
- Ligne « catalogue » : son état et ses écarts se consignent ; elle n'arrête pas P1.
