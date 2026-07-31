# 2026-07-28 — D31 · Une contrainte de saisie est opposable au rendu (complète D27)

### Décision

Quand `contraintesViolees` (D27) n'est pas vide pour le formulaire courant, l'écran de nœud
(`src/features/decision/screens/DecisionNodeScreen.tsx`) ne rend **plus** ni les options applicables, ni
les options écartées/non retenues, ni le bloc « en attente » : un bloc unique
(`decision-node__contrainte-suspension`, `role="alert"`, registre visuel des faits de sécurité) porte le
ou les messages de contrainte violée, avec les libellés rédigés des critères en cause (I20). Les alertes
de **nœud** (D15, faits de sécurité indépendants du geste retenu) restent, elles, affichées **au-dessus**
du bloc de suspension : suspendre les résultats ne fait jamais disparaître un fait de sécurité qui aurait
dû rester.

### Contexte

D27 (2026-07-27) avait introduit `Noeud.contraintes` comme signalement d'une combinaison de critères
incohérente **en tant que saisie**, mais son seul effet observable était le filtrage des profils
synthétiques du banc (`filtrerParContraintes`) — jamais branché sur l'écran réel. Recette du 2026-07-28
(D-04) : sur `insuline`, TBR = 1 et TBR sévère = 95, le message d'impossibilité s'affichait correctement
(bandeau ambre en tête de `CriteriaForm`) et **trois cartes « Recommandée » subsistaient**, dont
« Corriger l'hypoglycémie (réduire la dose) » et « Ajouter un bolus au repas principal » **en même
temps** — réduire et intensifier sur une saisie que l'outil venait de déclarer impossible. Second défaut
mesuré par la même recette : le message s'affichait 848 px au-dessus du champ fautif (D-15), poussant
tout le formulaire de 60 px à son apparition.

### Raison du choix

C'est la forme générale décrite par ce plan : deux couches croient des choses différentes, et la plus
affirmative gagne à l'écran — ici, « cette saisie est incohérente » (le bandeau) contre « voici trois
gestes à faire » (le panneau de résultats, juste en dessous). Rendre la contrainte opposable au rendu,
plutôt que parallèle, ferme l'écart au lieu de l'habiller.

### Conséquences

- L'ancrage vers le champ fautif reste un **nom en clair**, pas un lien cliquable : aucun champ de
  `CriteriaForm` ne porte d'`id` HTML aujourd'hui, et la session s'est arrêtée là plutôt que de
  construire un mécanisme de navigation — limite notée explicitement, pas un oubli.
- Le bandeau que `CriteriaForm` affichait en tête de formulaire (848 px au-dessus du champ, D-15) est
  retiré : une contrainte violée n'est plus rendue qu'**une seule fois**, à la place du panneau de
  résultats.
- Un nœud dont plusieurs contraintes sont violées à la fois affiche un item par contrainte, dans le même
  bloc.
