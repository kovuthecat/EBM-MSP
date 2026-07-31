# 2026-07-23 — D17 · Robustesse UI : filet d'erreur d'écran + formulaire critère `liste`

### Décision

Deux correctifs de robustesse de l'application, suite à un **crash de production** (écran blanc) signalé sur
le nœud C en saisissant l'âge du patient :

1. **`ScreenErrorBoundary`** (`src/features/shared/layout/ScreenErrorBoundary.tsx`) : limite d'erreur React
   enveloppant chaque écran (`AppShell`, remontée par `key` à chaque changement d'écran/nœud). Sans elle,
   toute exception de rendu (notamment une `ConditionError` volontairement non rattrapée par le moteur,
   brief §7) faisait disparaître tout l'arbre React — un écran **blanc**, muet, en production. La limite
   affiche désormais le message d'erreur et un bouton de retour, cohérent avec l'invariant « propager
   plutôt que masquer » : une erreur **visible**, jamais une page blanche.
2. **`CriteriaForm` / `buildDefaultCriteria`** (formulaire de critères, D3/S4) : ne géraient pas le type de
   critère `liste` (D13, ex. `traitements_en_cours`) — `buildDefaultCriteria` l'initialisait comme une
   **chaîne** (1re valeur de `valeurs`) au lieu d'un **tableau**, faisant lever `ConditionError` dès la 1re
   évaluation (`contient`/`ne_contient_pas` exigent un tableau, `conditions.ts`). Cause racine du crash :
   l'écran (câblé en P1 pour le nœud A) n'avait jamais été étendu pour les types ajoutés en P2. Corrigé :
   `buildDefaultCriteria` initialise `liste` à `[]` ; `CriteriaForm` rend un groupe de cases à cocher (une
   par valeur possible) pour tout critère de type `liste`, togglant l'appartenance au tableau.

### Portée

- Aucun changement moteur/schéma (le type `liste` existait déjà, D13) — uniquement l'écran de saisie.
- Tests : `CriteriaForm.test.tsx` (régression directe : `liste` → tableau, rendu en cases à cocher, reflet
  de la sélection). Le filet d'erreur n'a pas de test unitaire dédié (pas d'infra RTL/jsdom interactive dans
  le projet, cf. `MEMORY.md` feedback validation visuelle = humaine) — à valider visuellement.

### Raison

Le nœud C (`traitements_en_cours`, type `liste`) est le premier contenu réel à exercer ce type en dehors des
tests — l'écart entre contenu P2 et UI P1 n'avait jamais été détecté avant un usage réel. Le filet d'erreur
est une défense en profondeur générique (pas spécifique au nœud C) : toute future incohérence de contenu se
traduira par un message lisible, jamais par un écran mort.
