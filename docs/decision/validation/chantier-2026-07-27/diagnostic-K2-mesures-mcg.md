# Diagnostic K2 — les mesures de MCG lues sans garde `mcg_disponible`

> **Objet** : chiffrer la classe K2 de la seconde recette navigateur (« champ visible mais
> inobtenable ») pour que la décision clinique soit prise sur pièces.
> **Date** : 2026-07-27 (nuit). **AUCUN CONTENU N'A ÉTÉ MODIFIÉ** — le correctif suppose une décision
> clinique qui vous revient, et elle n'est pas la même pour les deux classes trouvées.

---

## 1. Le défaut, confirmé

`insuline.yaml` lit `TBR`, `TBR_severe`, `CV_glycemique` et `profil_glycemique` dans **37 termes** qui
ne citent nulle part `mcg_disponible`. Sans capteur, ces mesures restent indéterminées à jamais : les
options concernées ne sont **ni proposées ni écartées**, et la reco reste « provisoire » sans fin.

C'est le cas **ordinaire** en médecine générale française — la mesure continue du glucose n'est pas la
norme chez le patient sous insuline basale.

**L'invariant I11 ne le voit pas, et il a raison** : ces champs SONT affichés (leur `visible_si` ne
porte que sur `situation_insuline`). I11 interdit qu'on réclame un champ invisible ; ici le champ est
visible, simplement impossible à remplir. C'est une classe voisine, pas la même.

## 2. Les deux classes, qui n'appellent pas la même réponse

### Classe A — la mesure DÉCLENCHE l'option (`conditions`)

| option | canal |
| --- | --- |
| Ajouter un GLP‑1 / une association fixe d'abord | `conditions` + `exclusions` |
| Ajouter un bolus au repas principal (basal‑plus) | `conditions` + `exclusions` |
| Corriger l'hypoglycémie ou la variabilité | `conditions` |
| Optimiser la répartition du basal‑bolus | `conditions` |

Sans capteur, l'option ne devrait simplement pas se déclencher **par cette branche**. Et le nœud sait
déjà l'écrire : ses options 4 et 5 portent le motif à deux branches
`mcg_disponible == false AND gaj_a_cible == true OR mcg_disponible == true AND profil_nocturne_a_cible == true`.
**C'est une omission, pas une capacité manquante du schéma.** Le champ `obtenable_si` proposé par le
rapport de recette n'est donc pas nécessaire.

### Classe B — la mesure GARDE l'option (`exclusions`) ⚠ c'est la difficile

| option | exclusions concernées |
| --- | --- |
| **Titrer la basale (augmenter la dose)** | `TBR > 4` · `TBR_severe > 1` · `CV_glycemique > 36` · `profil_glycemique contient hypo_nocturne` |
| **Ne pas sur‑titrer la basale** | les mêmes quatre |
| Ajouter un GLP‑1 / une association fixe | idem, gardées par la situation |
| Ajouter un bolus au repas principal | idem |

Les deux premières sont **les options centrales de la situation « basale seule »** — c'est-à-dire la
conduite attendue pour le patient le plus banal du nœud.

Ici, la question n'est pas d'écriture mais de sécurité : **une exclusion qui ne peut pas être évaluée
ne doit ni tomber ni bloquer, et pourtant il faut choisir.**

- La faire **tomber** revient à titrer une basale sans savoir si le patient fait des hypoglycémies —
  or c'est exactement le risque que cette exclusion existe pour prévenir.
- La laisser **bloquer** produit l'état actuel : le patient sans capteur n'obtient jamais de conduite.

**Un troisième terme existe déjà dans le contenu, et il est obtenable sans capteur** :
`hypo_severe_recurrente` (booléen, déclaré par le patient) figure déjà dans les `exclusions` des options
« Ajouter un GLP‑1 » et « Ajouter un bolus ». Rien n'empêcherait qu'il tienne le rôle de garde-fou
minimal quand la MCG est absente.

## 3. Les trois autres emplacements

- `alertes[1].quand` — l'alerte « cibles MCG » lit `CV_glycemique` et `TBR_severe` sous le seul garde
  `situation_insuline != naif` : sans capteur, elle ne se déclenche jamais. Sans gravité (une alerte ne
  retire rien), mais à corriger dans le même passage pour ne pas laisser une incohérence de plus.
- `criteres_entree[23].derive` et `[24].derive` — dérivés lisant `profil_glycemique`. À traiter avec
  leurs consommateurs, pas séparément.

## 4. Ce que je vous demande de trancher

1. **Classe A** — replier sur `gaj_a_cible` comme le font déjà les options 4 et 5, ou laisser l'option
   ne pas se déclencher sans capteur ?
2. **Classe B** — sans MCG, le garde-fou de sur‑titration :
   - **tombe**, l'option est proposée avec une alerte de surveillance explicite ; ou
   - **se replie** sur `hypo_severe_recurrente` (et éventuellement la glycémie à jeun), qui sont
     obtenables sans capteur.

Ma préférence technique va au repli sur `hypo_severe_recurrente` : il ne crée aucun champ, il utilise un
signal que le contenu déclare déjà, et il évite d'offrir une titration sans le moindre garde-fou. Mais
c'est un arbitrage de sécurité clinique, et il vous revient.

## 5. Méthode

Lecture du contenu chargé via `fragmentsDuNoeud` (`engine/expressionsNoeud.ts`), qui visite TOUTES les
expressions du nœud avec leur chemin — conditions, prérequis, exclusions, priorités, alertes de nœud et
d'option, calculs, dérivés, `visible_si`. Découpage sur les termes `OR` (le DSL est sans parenthèses et
`AND` lie plus fort : découper sur `OR` est exact, jamais une approximation). Aucun tirage, aucune
évaluation : le comptage porte sur la structure, il ne dépend ni de l'échantillonnage ni des profils.
