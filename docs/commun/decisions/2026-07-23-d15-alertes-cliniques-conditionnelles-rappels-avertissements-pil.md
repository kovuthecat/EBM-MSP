# 2026-07-23 — D15 · Alertes cliniques conditionnelles (rappels/avertissements pilotés par le contenu)

### Décision

Nouveau champ optionnel **`alertes`** au niveau du nœud : liste de `{ quand, message, niveau? }`, où `quand`
est une expression DSL (ou la sentinelle `"default"`) et `niveau` vaut `info` | `attention`. Le moteur
(`evaluateNode`) évalue les alertes **indépendamment de la sélection des options** et renvoie celles
déclenchées dans **`EvaluateNodeResult.alertes`**. Un `quand` malformé lève `ConditionError` (jamais de faux
silencieux, comme le reste du DSL).

### Motivation (nœud B v1.3)

Certains messages cliniques ne sont ni un **choix de traitement** (option) ni une **exclusion** (retrait
d'option), mais des **rappels/avertissements** liés à l'état du patient : « contrôler la cétonémie si HbA1c
élevée ou signes de glucotoxicité » ; « adapter la dose de metformine au palier de DFG » (RCP ANSM). Les
encoder en `options` polluerait la liste de recommandations ; en `exclusions` n'aurait pas de sens. D'où un
canal dédié.

### Portée

- **Schéma + types + moteur** étendus (champ **optionnel** → nœuds sans `alertes` inchangés). **Réutilise le
  DSL existant** (aucun nouvel opérateur). `evaluateOrderedFirstMatch` calcule les options ; `evaluateNode`
  injecte les alertes → les deux modes de sélection les renvoient.
- Feature de **contenu/affichage**, déterministe et sans échec silencieux (D3). Le moteur reste générique :
  le nœud porte les messages, le moteur n'en connaît aucun.
- Vérifiée : tests unitaires (nœuds synthétiques) + **trace sur le nœud B réel** (alerte cétonémie ; alertes
  de dose metformine par palier de DFG). Suite : **99 tests verts** + build.

### Raison

Modéliser les rappels cliniques sans détourner `options`/`exclusions`, en gardant la séparation
contenu / logique / présentation (D3). Choix de forme (champ nœud-level, `niveau` info/attention) délégué au
référent, documenté.
