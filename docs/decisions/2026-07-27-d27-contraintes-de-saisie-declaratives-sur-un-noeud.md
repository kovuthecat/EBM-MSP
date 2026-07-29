# 2026-07-27 — D27 · Contraintes de saisie déclaratives sur un nœud

### Décision

Nouveau champ optionnel `Noeud.contraintes` : liste de `{ expression, message }`, DSL identique aux
autres conditions. Contrairement à `alertes` (D15, informe sur un patient réel) et `exclusions` (D13,
retire une option), une **contrainte** signale une combinaison de critères **incohérente en tant que
saisie** — ex. « une situation d'insulinothérapie "naïf" et une insuline déjà cochée dans les
traitements en cours ne peuvent pas être vraies ensemble ». Le générateur de banc (`profils.ts`) filtre
désormais les profils synthétiques qui violent une contrainte du nœud (`filtrerParContraintes`), avec
sur-génération (`FACTEUR_SURGENERATION = 3`) pour compenser le rejet plutôt que de réduire la taille
du banc.

### Contexte

Sans ce filtre, les profils *frozen* (fixtures gelées, `geler-profils.maintenance.test.ts`) pouvaient
figer une combinaison de critères impossible en pratique et, à la faveur d'une évolution du contenu,
perdre leur dernière option applicable — l'écran d'un patient qui ne peut pas exister aurait affiché
une page vide, faussement comptée comme un trou de couverture clinique réel.

### Conséquences

`reparerFixtureProfils` remplace, dans une fixture gelée, uniquement les profils devenus invalides —
jamais la fixture entière (préserve la reproductibilité des autres profils, `banc/geler-profils`).
