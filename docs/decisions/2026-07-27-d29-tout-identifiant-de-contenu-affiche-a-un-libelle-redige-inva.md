# 2026-07-27 — D29 · Tout identifiant de contenu affiché a un libellé rédigé (invariant I20)

### Décision

Tout critère d'entrée et toute valeur d'énumération d'un nœud **publié** doit avoir un libellé rédigé
dans `lib/labels.ts` (`libelleCritereCatalogue`/`libelleValeurCatalogue`, vérifié par
`banc/libelles.test.ts`, invariant I20). Le repli mécanique `humanize()` (retire `_`/`-`, majuscule
initiale, sans accent) reste en place pour le runtime, mais cesse d'être une sortie acceptable pour du
contenu publié.

### Contexte

Les deux nœuds du module RHD sont arrivés en recette avec **zéro** de leurs 29 critères catalogué :
l'écran affichait « Frequence boissons sucrees », « Retinopathie non stabilisee ou proliferante ».
Rien n'échouait — le repli réussit toujours (`?? humanize(nom)`) — donc rien ne l'avait signalé avant
une relecture à l'œil.

### Raison du choix

Une propriété testable plutôt qu'une discipline de relecture (même logique que D20/I3-I7) : un
dictionnaire de libellés peut grossir en silence à chaque nœud ajouté, `humanize()` masque l'oubli en
produisant toujours quelque chose de lisible-mais-faux (sans accent). Le test associé (I20bis) dénombre
en plus les clés que plus aucun nœud ne déclare, sous un plafond mesuré (pas estimé) qui ne peut que
descendre — garde-fou contre un dictionnaire qui se remplirait de libellés morts sans jamais être faux
sur le critère principal.
