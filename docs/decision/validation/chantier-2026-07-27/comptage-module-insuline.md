# Comptage — `insuline` doit-il devenir un module de 4 nœuds ?

> **Objet** : le comptage sur pièces que la recette référent (`recette-ui.md` §5) pose comme condition
> préalable — *« Trancher avant ce comptage serait décider à l'aveugle, dans un sens comme dans
> l'autre. »*
> **Date** : 2026-07-27 (soir), après les lots 0 et 1. **Statut : recommandation, pas décision.**
> **Recommandation : NE PAS scinder.** Deux des trois motifs d'origine ont disparu ce soir, et le
> troisième se traite à un coût sans commune mesure.

---

## 0. Ce qui a changé depuis que la question a été posée, et qui la change

La recette a été menée sur le déployé `f6d36fe`, **avant** le lot 1. Or le défaut **A** de cette même
recette établit que, dans cette version, **les 9 `visible_si` d'`insuline` étaient intégralement
neutralisés** : le primer `situation_insuline` n'était jamais `touched`, donc jamais déterminé, donc
tous les champs conditionnels restaient affichés (repli « fail open » de R7).

**La charge de saisie d'`insuline` a donc été mesurée sur un formulaire cassé.** Un patient naïf voyait
le bloc MCG en entier — TBR, TBR sévère, CV, profil glycémique, GAJ, doses basale et rapide — alors que
le contenu demandait de les masquer depuis le 26/07. C'est corrigé depuis le lot 1.

Le constat « 10 des 16 points de la recette concernent `insuline` » reste vrai, mais **une partie de
cette densité était un artefact du défaut A**, pas une propriété du nœud.

## 1. Ce que la scission ferait TOMBER

| gain | mesure |
|---|---|
| `visible_si` portant sur `situation_insuline` | **9** — ils n'existent que pour masquer les champs d'une situation aux autres |
| Collisions de rang entre situations | rangs **1, 2 et 3 réutilisés par 3 à 4 situations** chacun |
| Surface du défaut A | **déjà refermée par le lot 1** — le primer ne ment plus |
| Charge de saisie par écran | réelle, mais cf. §3 |

Les collisions de rang sont **déjà rattrapées par les `familles`** (correctif du 25/07, 6 familles
déclarées) : elles ne produisent plus de défaut visible. Elles restent une fragilité de conception, pas
un symptôme.

## 2. Ce que la scission COÛTERAIT

C'est ici que le comptage tranche.

### Options — 5 sur 12 ne se rangent pas dans un seul nœud

| option | situations |
|---|---|
| Corriger l'hypoglycémie ou la variabilité | `basale_seule` + `basale_plus_bolus` |
| Ajouter un GLP‑1 / une association fixe d'abord | `basale_seule` + `basale_plus_bolus` |
| Ajouter un bolus au repas principal | `basale_seule` + `basale_plus_bolus` |
| Optimiser la répartition du basal‑bolus | `basale_plus_bolus` + `basal_bolus` |
| Poursuivre le schéma en cours *(repli)* | **aucune situation nommée — vaut partout** |

Répartition : `naif` 3 · `basale_seule` 5 · `basale_plus_bolus` 5 · `basal_bolus` 2. **Quatre options
sur douze sont partagées**, plus le repli qui vaudrait dans les quatre nœuds : à dupliquer, ou à
extraire dans un mécanisme qui n'existe pas.

### Critères — le rapport est de 3 pour 1, dans le mauvais sens

| | nombre | lesquels |
|---|---|---|
| **Lus par ≥ 2 situations** → à **redéclarer dans chaque nœud** | **15** | `situation_insuline`, `cible_atteinte`, `traitements_en_cours`, `risque_hypoglycemique_eleve`, `hypo_severe_recurrente`, `TBR`, `TBR_severe`, `CV_glycemique`, `profil_glycemique`, `dose_basale_actuelle`, `gaj_a_cible`, `profil_nocturne_a_cible`, `over_basalisation`, `hypo_interprandiale`, `dose_rapide_actuelle` |
| **Propres à UNE situation** → déménageraient proprement | **5** | `symptomes_glucotoxicite`→naïf, `poids`→naïf, `mcg_disponible`→basale_seule, `profil_nocturne_permet_titration`→basale_seule, `preference_injection`→basale_plus_bolus |

**La scission dupliquerait trois fois plus qu'elle ne déménagerait.** Et le « socle de critères
partagé » que D22 devait fournir pour absorber cela **n'a délibérément pas été livré** — il casse le
garde-fou R1 sur le chaînage.

### Alertes — 7 sur 8 sont universelles

Une seule alerte de nœud (`Incohérence de saisie : situation « naïf »…`) est propre à une situation. Les
sept autres — orientation spécialiste, arrêt du sulfamide à l'introduction, iSGLT2 et acidocétose,
insuffisance rénale, cibles MCG standard, cibles assouplies, titration sans MCG — vaudraient dans les
quatre nœuds. À dupliquer ×4, ou à porter par le module, ce qui reste à concevoir.

### Coût de vérification

Re-vérification complète (pistes A et B du §P6) + régénération des fixtures figées + réécriture des
vignettes E‑01→E‑09 et F2/F3/F4, toutes validées par le référent et toutes écrites contre un nœud
unique.

## 3. Ce qui reste du motif d'origine — et comment le traiter autrement

Des trois motifs, **deux ont disparu ce soir** : la surface du défaut A (corrigée) et les collisions de
rang (déjà absorbées par les familles). Reste **la charge de saisie par écran**, motivation d'origine de
D22.

C'est un problème d'**ergonomie**, et deux propositions de la même recette l'attaquent directement, à un
coût sans commune mesure avec une scission :

- **O — repli par SECTION** : une section dont tous les champs sont non pertinents *et* non saisis se
  réduit à une ligne. Garde-fou déjà posé : ne jamais replier une section contenant un champ `touched`
  ou `aConfirmer`.
- **P1 — sortir le résultat du bas de page** (rail collant). La recette la nomme *« le seul changement
  qui attaque la cause plutôt que la quantité »*.

Avec les 9 `visible_si` réparés, le formulaire d'un patient naïf n'affiche plus que ses propres champs.
La charge de saisie a déjà diminué — de combien, seule la recette visuelle en cours peut le dire.

## 4. Un argument nouveau, dans l'autre sens, et il faut le poser honnêtement

L'invariant **inter-nœuds** livré au lot 0 (`banc/coherence-inter-noeuds.test.ts`, S7) rend la
duplication de critères **détectable** : un critère partagé entre nœuds doit y porter le même type, les
mêmes valeurs et la même dérivation, sous peine d'échec du banc. Il a d'ailleurs immédiatement révélé 4
divergences entre les nœuds existants — dont `traitements_en_cours`, déclaré avec deux vocabulaires
différents.

Cela rend la duplication **sûre** là où elle ne l'était pas ce matin. Mais **détectable n'est pas
gratuit** : 15 critères × 4 nœuds = 60 déclarations à tenir synchronisées, avec un test qui échoue à la
moindre dérive. L'invariant transforme une dette silencieuse en dette bruyante — c'est un progrès, pas
une dispense.

## 5. Recommandation

**Ne pas scinder `insuline`.** Traiter la charge de saisie par O et P1, dont le coût est sans commune
mesure et qui profitent à **tous** les nœuds, pas à un seul.

Rouvrir la question si — et seulement si — la recette visuelle établit que la charge de saisie reste
inacceptable **une fois les `visible_si` réparés**. C'est la seule mesure qui manque, et elle arrive.

**Ce qui devrait être fait indépendamment de cette décision**, parce que ce sont de vraies dettes que le
comptage a mises au jour :

- les **4 divergences inter-nœuds** (S7), dont `traitements_en_cours` — `insuline` déclare
  `insuline_basale`/`insuline_rapide`, les trois autres nœuds `insuline` : une règle
  `contient insuline` y est structurellement fausse ;
- le **repli sans situation nommée** (« Poursuivre le schéma en cours ») : il vaut pour les quatre
  situations, y compris `naif`, où il n'a aucun sens. Le lot 1 l'a rendu inoffensif sur formulaire
  vierge (défaut B), mais sa condition reste `["default"]` sans garde de situation.

## Annexe — méthode

Mesuré par lecture du contenu chargé (`loadNodes`), en rattachant chaque option, critère et alerte aux
situations que ses règles nomment explicitement (`situation_insuline == …`). Aucune évaluation du moteur,
aucun tirage : le comptage porte sur la STRUCTURE du contenu, il ne dépend donc ni de l'échantillonnage
ni des profils.

⚠ Un critère est compté « à redéclarer » dès qu'une option d'une autre situation le lit, y compris à
travers un dérivé. Le compte de 15 est donc un **majorant** : une extraction fine pourrait en ramener
quelques-uns. Il ne change pas l'ordre de grandeur, ni le rapport 3 pour 1.
