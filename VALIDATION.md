# VALIDATION.md — jugement humain en attente (N2 uniquement) — ebm-msp

> **Ce fichier ne contient que du N2** : jugement esthétique/UX/ton. Tout ce qu'un navigateur peut
> constater seul (rendu correct, élément présent/absent, comportement d'écran) est du **N1** —
> vérifié par Claude via `/verif-visuelle`, jamais consigné ici. Cf. `WORKFLOW.md` §6.
> Plafond : 120 lignes (appliqué par hook). Légende : `[ ]` à valider · `[x]` OK · `[!]` à corriger.
> Un bloc par écran/module courant, état actuel uniquement — un écran réécrit **remplace** ses
> anciens critères.

## Purge du 2026-07-29 (migration workflow N0/N1/N2)

Les recettes P4/P5/P6 (2026-07-22 → 2026-07-29) consignées ici étaient en réalité du **N1**
(rendu d'écran, comportement, contre-indications affichées) — pas du jugement humain N2. Purgées :
détail entier dans `git log -- VALIDATION.md` et `docs/decision/validation/`. Les 3 items restés
ouverts (T-032/033/034, vérification sur le déployé) sont du N1 également → déplacés dans
`TASKS.md` comme tâche de vérification navigateur, pas comme checklist humaine.

**Aucun item N2 en attente antérieur au 2026-07-30.**

## Plan P8 (2026-07-30) — jugement humain reversé par S1-S8, recette `docs/decision/validation/recette-P8-2026-07-30.md`

- [ ] **T-055** — la confirmation « Nouveau patient » en deux temps sur le bouton (au lieu d'une boîte
      native) est-elle assez visible sans être gênante ?
- [ ] **T-056** — le compteur « Session : N valeur(s) » dans le header est-il rassurant ou anxiogène ?
- [ ] **T-057** — un clic de plus (« Reprendre » / « Repartir de zéro ») par nœud ré-ouvert dans la même
      consultation est-il acceptable en pratique ?
- [ ] **T-058** — un champ estompé **et muet** (sans mention « sans effet ») se lit-il comme
      « probablement pas utile » ou comme un bug d'affichage ?
- [ ] **T-063** — la carte « Remplacer le glinide » (et son exclusion sur DFG/IMC) dit-elle la bonne
      chose chez un patient sous répaglinide en insuffisance rénale sévère (DFG 28, niche rénale,
      scénario non rejoué en recette) ?
- [ ] **T-064/T-065** — les libellés « Baisse/Hausse continue de la glycémie nocturne » sont-ils
      symétriques et lisibles sur un AGP réel ? Deux sections repliables (nocturne / entre les repas) :
      plus lisible ou un clic de trop ?
- **T-067 non livrée** (voir recette P8, « Constat préalable ») : aucun jugement N2 à recueillir tant
  que la carte « Réduire la basale » n'existe pas — reste dans `TASKS.md`.
