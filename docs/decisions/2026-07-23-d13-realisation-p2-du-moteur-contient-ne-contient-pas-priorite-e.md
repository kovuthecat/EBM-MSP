# 2026-07-23 — D13 · Réalisation P2 du moteur : `contient`/`ne_contient_pas`, `priorite`, exclusions dures

### Décision

Implémentation des extensions moteur prévues en **D10** (jusque-là forward-compat de principe, en fait
absentes du schéma/moteur) :

- **DSL — critère `liste` + opérateurs `contient` / `ne_contient_pas`.** Une valeur de critère peut
  désormais être un **tableau de libellés** (`CriteriaValue` étendu à `string[]`) ; `traitements_en_cours
  contient iSGLT2` / `ne_contient_pas iSGLT2` teste l'appartenance. Nécessaire aux nœuds C/D/E (« ne pas
  re-proposer une classe déjà en place »). Un opérateur scalaire (`== < >=`…) sur une liste, ou `contient`
  sur un non-liste, **lève `ConditionError`** (jamais de faux silencieux, brief §7).
- **`priorite` (entier optionnel sur `option`).** En mode `multi-options`, les options applicables sont
  triées par `priorite` **croissante** (tri **stable** ; absence = rang le plus faible, ordre du contenu
  préservé). C'est un **rang FIXE**. Ignoré en `ordered-first-match` (l'ordre du nœud EST la priorité).
- **Exclusions dures — nouveau champ optionnel `exclusions` sur `option`.** Expressions DSL (même
  grammaire que `conditions`). Une option par ailleurs applicable est **retirée** si l'une de ses
  `exclusions` est vraie, et **reportée dans `EvaluateNodeResult.excluded`** (raison = expression(s)
  déclenchée(s)) — jamais retirée en silence. Vaut dans les **deux** modes de sélection. Le repli
  (`["default"]`) est lui aussi soumis à ses propres exclusions.

### Précision vs D10 (prose vs machine)

D10 disait « `contre_indications` = exclusions dures évaluées par le moteur ». En pratique,
`contre_indications` porte du **texte destiné au lecteur** (nœuds A/B en contiennent). On **sépare** donc :
`contre_indications` (prose d'affichage, inchangé) ↔ **`exclusions`** (expressions DSL évaluables). Le
schéma documente ce partage.

### Portée immédiate

- **Schéma + types + moteur** étendus (champs **optionnels** → **aucune migration**). Nœuds **A/B
  inchangés** : ils n'utilisent ni `priorite`, ni `exclusions`, ni `liste` → comportement identique.
- **Nœud B non migré** vers `exclusions`/`priorite` (sa validation clinique resterait à refaire) : il
  conserve son garde-fou de sécurité encodé **en `conditions`** (`symptomes_glucotoxicite == false` sur
  iSGLT2 et l'association), fonctionnellement correct. Migration = tâche ultérieure tracée.

### Vérification bi-agent du comportement (2026-07-23, après codage — pipeline étape 8)

Deux agents indépendants, contextes séparés (A = fidélité au contrat, Sonnet ; B = red-team, Opus) :

- **Agent A** : **CONFORME** aux 13 clauses du contrat (DSL `contient`/`ne_contient_pas` + erreurs
  explicites, `EvaluateNodeResult.excluded`, exclusions dures dans les 2 modes, tri stable par `priorite`
  — `priorite: 0` bien traité comme rang valide via `??`, non `||`, propagation `ConditionError`, non-régression).
- **Agent B** : 0 finding HAUTE, **4 findings** MOYENNE/BASSE convergents (même cause racine : le moteur
  dérivait un booléen muet de collections vides). **Corrigés** : (1) `splitTopLevel` lève désormais sur un
  segment vide (expression vide/blanche, opérateur `AND`/`OR` pendant, et donc `exclusions: ['']` — une
  contre-indication ne peut plus être désactivée en silence) ; (2) `requireConditions` rejette une option
  non-repli au tableau `conditions` vide (plus d'applicabilité vacante neutralisant le repli) ; (3)
  durcissement du schéma (`conditions` : `minItems: 1` + `items.minLength: 1` ; `exclusions.items.minLength: 1`).
- Suite après corrections : **67 tests verts** (38 antérieurs + 22 features P2 + 7 garde-fous red-team) ;
  `npm run build` (typecheck + build) OK.

### Explicitement différé (à trancher si le besoin se confirme)

- **`priorite` conditionnel** (le rang bascule selon la comorbidité dominante — souhait du nœud B :
  IC/rein → iSGLT2 d'abord ; athérome/obésité → AR GLP-1 d'abord). Jugé initialement sur-ingénierie
  pour un seul nœud → **finalement construit en D14** sur décision du référent (« on construit »).
- **Variables dédiées** `decompensation` / `cetose` (bool) et `contexte_aigu` (D) : côté **contenu**, à
  ajouter au cadrage des nœuds concernés (pas un besoin moteur).

### Raison

Modéliser fidèlement C/D/E (multivalué) et rendre les contre-indications de sécurité **opérantes** sans
détourner la prose d'affichage, tout en gardant le moteur **déterministe et sans échec silencieux**
(D3, brief §7). Choix de forme (nommage `exclusions`, rang fixe vs conditionnel) = **délégué au référent**
comme D9/D10 ; documenté ici pour veto éventuel.
