# 2026-07-23 — D14 · Priorité conditionnelle des options (construit — lève le report de D13)

### Décision

Sur décision du référent (« on construit »), le champ `priorite` d'une `option` accepte désormais, **en
plus** d'un entier (rang fixe, D13), une **liste de règles `{ quand, rang }`** (rang **conditionnel**) :
en mode `multi-options`, le rang effectif de l'option est celui de la **1re règle dont `quand`** (condition
DSL, ou la sentinelle `"default"`) est vraie pour le patient ; si aucune ne matche → rang le plus faible
(placée en dernier). Le rang est donc **évalué par patient** (il dépend des critères). Un `quand` malformé
lève `ConditionError` (jamais de faux silencieux). Ignoré en `ordered-first-match`.

### Motivation (nœud B)

Exprime la préférence par comorbidité dominante que l'ordre fixe ne pouvait pas : `iSGLT2` rang 1 s'il
existe une indication IC/rénale, sinon rang 2 ; `AR GLP-1` l'inverse. Résultat : IC/rénal → iSGLT2 en
tête ; athérome/obésité **sans** IC/rénal → AR GLP-1 en tête (bénéfice athéromateux mieux établi pour les
AR GLP-1). **Enjeu = emphase/hiérarchisation, pas sécurité** : en `multi-options`, toutes les options
applicables restent affichées quel que soit le rang.

### Portée

- `priorite` **polymorphe** (`number | { quand, rang }[]`), schéma `oneOf`. Champs optionnels → nœuds
  A/B **inchangés**. Rangs **pré-calculés une seule fois** avant le tri (une évaluation par option, et une
  `ConditionError` remonte proprement plutôt qu'en plein tri).
- **Nœud B non encore migré** : la bascule iSGLT2/AR GLP-1 reste, en attendant, portée par l'argumentaire.
  La migration (réécriture des `priorite` + passage du garde-fou catabolique en `exclusions`) rouvrirait
  le contenu clinique validé → **nouvelle passe de vérification bi-agent** (pipeline étape 8) ; à lancer
  sur décision explicite.
- Tests : **78 verts** ; build OK.

### Vérification bi-agent du comportement (2026-07-23, après codage — pipeline étape 8)

Deux agents indépendants, contextes séparés (A = conformité, Sonnet ; B = red-team, Opus) :

- **Agent A** : **CONFORME** aux 8 clauses (polymorphisme ; `resolvePriorite` — rang `0`/négatifs,
  première-règle-gagne, sentinelle `"default"`, sinon `+Infinity` ; évaluation par patient ; tri après
  exclusions ; ignoré en `ordered-first-match` ; `ConditionError` propagée ; `oneOf` rejette les formes
  invalides ; non-régression D13).
- **Agent B** : **5 findings, 1 HAUTE**. F1 (HAUTE) : une règle qui matche mais au `rang` `undefined`/`null`
  (contenu non validé au runtime, D9) était coalescée en `+Infinity` par le `??` du comparateur → option
  reléguée en dernier **sans erreur** (faux silencieux, sur un tri qui hiérarchise des molécules). F2/F5
  (MOYENNE) : règle sans `quand`, ou `priorite` d'une forme inattendue → `TypeError` brut au lieu de
  `ConditionError`. F3 (BASSE) : `rang: NaN` → comparateur non transitif. **Tous corrigés** en durcissant
  `resolvePriorite` (gardes `Array.isArray`, `typeof quand === 'string'`, `Number.isFinite(rang)` →
  `ConditionError` nommant l'option) et en retirant le `??` masquant du comparateur. F4 (BASSE) = **pas un
  bug** : une règle `"default"` placée avant une règle spécifique rend cette dernière morte — sémantique
  first-match **conforme**, mais piège d'écriture (placer `"default"` en dernier).
- Suite après corrections : **78 tests verts** (73 + 5 garde-fous : `rang` manquant / `NaN` / non fini,
  `quand` manquant, `priorite` non-tableau → `ConditionError`) ; build OK.

### Raison

Besoin clinique réel (hiérarchisation par comorbidité) désormais jugé prioritaire par le référent ; coût
maîtrisé (extension **additive**, pré-calcul des rangs). Nœud C (intensification/optimisation) piloté par
`traitements_en_cours` en bénéficiera aussi. Choix de forme (`priorite` polymorphe plutôt qu'un champ
séparé ; sentinelle `"default"` alignée sur `conditions: ["default"]`) délégué au référent, documenté.
