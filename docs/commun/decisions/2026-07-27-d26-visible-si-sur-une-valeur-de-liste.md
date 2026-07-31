# 2026-07-27 — D26 · `visible_si` sur une valeur de `liste`

### Décision

`CritereEntree.visible_si` accepte désormais une condition portant sur l'appartenance à une `liste`
(`contient`/`ne_contient_pas`), pas seulement sur un `bool`/`enum`. Extension du DSL existant, aucun
nouvel opérateur.

### Raison du choix

Premier besoin réel : un champ de détail (ex. dose d'un traitement) qui ne doit apparaître que si ce
traitement précis a été coché dans `traitements_en_cours`. Sans l'extension, le contenu aurait dû soit
dupliquer le critère en `bool` (violation I4, « un concept, un encodage »), soit renoncer à masquer le
champ. Générique : sert tout futur nœud où un critère `liste` conditionne l'affichage d'un autre champ.
