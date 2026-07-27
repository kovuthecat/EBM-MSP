# Mesure — le sur-blocage `fragilite` sur `prescription`

> **Objet** : vérifier, avant de faire arbitrer le référent, le constat de la passe adversariale
> `prescription` selon lequel **« 432 profils sur 2 160 perdent TOUTE option “Agent à ajouter” »**.
> **Date** : 2026-07-27 (soir), après les lots 0 et 1. **Verdict : le constat est faux**, et le
> sur-blocage réel est étroit, correct, et déjà conforme à ce que le référent avait décidé.
> **Aucune action n'est requise.**

---

## Pourquoi cette mesure a été faite

J'avais repris le chiffre « 432/2160 » dans le `PLAN-CORRECTION.md` et je m'apprêtais à le porter à
l'arbitrage du référent, en écrivant que *« l'ampleur du sur-blocage n'était pas connue au moment de la
décision »*. Le référent avait assumé ce sur-blocage le 2026-07-27 au matin, sur le motif clinique
suivant : la SFD 2025 dit d'**éviter** un sulfamide chez le sujet âgé « fragile » et de ne **jamais**
l'utiliser chez le « dépendant » ; le nœud n'ayant pas de catégorie « dépendant » (`fragilite` est un
booléen), l'exclusion retire aussi le sulfamide au sujet seulement fragile.

Faire arbitrer sur un chiffre de seconde main aurait répété l'erreur de la journée : le référent a déjà
tranché une fois sur une prémisse fausse que je lui avais fournie (le seuil de CK, avant lecture de
NG238).

## Ce qui a été mesuré, et avec quel instrument

Deux instruments, l'un mécanique et l'autre décisif.

### 1. Comparaison APPARIÉE (`genererPairesBooleennes`)

Le banc sait produire, pour un même patient, les deux versions `fragilite = true` et `false`, **toutes
choses égales par ailleurs**, dérivés recalculés. C'est l'instrument prévu pour cette question
(invariant 6 du domaine), et c'est celui que la passe adversariale n'a pas employé.

Sur 1 840 patients appariés :

| effet du passage `fragilite = false → true` | patients |
|---|---|
| perd **toutes** ses options « Agent à ajouter » | **9** (0,5 %) |
| en perd **certaines** | 28 |
| **inchangé** | 1 803 |
| **se retrouve sans AUCUNE option, toutes familles confondues** | **0** |

Et surtout — **une seule option est jamais perdue**, dans les 37 cas :

```
  37×  Sulfamide (gliclazide MR ou glimépiride) — option glycémique de bas rang, derrière la gliptine
```

### 2. Lecture du contenu — ce qui rend le résultat CERTAIN et non probabiliste

Le banc de `prescription` est en stratégie 2 (échantillonnage, cf. `banc/grammaire.test.ts` G3) : un
comptage n'y est jamais qu'une fréquence. La lecture, elle, tranche.

`fragilite` apparaît **six fois** dans `prescription.yaml`, et **une seule est une `exclusions`** :

| ligne | rôle | retire une option ? |
|---|---|---|
| `:225` | `derive` de `terrain_cible_assouplie` | non |
| `:278` | `derive` de `metformine_deprescriptible` | non |
| `:594`, `:632` | règles de `priorite` (`quand`) | non — change un rang |
| `:1167` | alerte de nœud | non — D21 : une alerte ne retire rien |
| **`:1055`** | **`exclusions` de l'option Sulfamide** | **oui, et c'est la seule** |

**Le seul geste que `fragilite == true` puisse retirer à un patient est donc le sulfamide.** Ce n'est pas
un résultat d'échantillonnage : c'est une propriété du contenu.

## Pourquoi le rapport annonçait 432

Le chiffre mesure autre chose : le nombre de profils dont la famille « Agent à ajouter » est **vide**,
sans contrôler la cause. Reproduit ici sur le banc courant :

```
  fragile = true  : 920 profils, dont 780 sans option « Agent à ajouter »
  fragile = false : 920 profils, dont 760 sans
```

780 contre 760. La quasi-totalité de ces familles vides n'a **rien à voir avec la fragilité** : elles le
sont parce que les conditions de la famille ne sont pas réunies (`classes_a_benefice_indisponibles`,
`position_vs_cible`, la classe déjà en cours…). Compter l'**état** au lieu de mesurer l'**effet** gonfle
le constat d'un facteur ~40.

C'est un défaut de méthode, pas de lecture : la question « que retire la fragilité ? » appelle une
comparaison appariée, et le dépôt en fournit une.

## Exemples réels, tirés de la mesure

Les trois premiers patients qui perdent toute leur famille « Agent à ajouter » :

```
âge 18, DFG 40, HbA1c 9, IMC 30, tt=[tirzepatide], intention=déprescrire
  non fragile → Sulfamide
  fragile     → (rien dans « Agent à ajouter »)
     reçoit : Metformine (socle) + Poursuivre le traitement en cours et réévaluer

âge 18, DFG 45, HbA1c 10, IMC 26, tt=[gliptine], intention=initier
  non fragile → Sulfamide
  fragile     → (rien dans « Agent à ajouter »)
     reçoit : Metformine (socle) + Remplacer la gliptine (aucun bénéfice sur critère dur)

âge 76, DFG 41, HbA1c 8, IMC 14, tt=[tirzepatide], intention=initier
  non fragile → Sulfamide
  fragile     → (rien dans « Agent à ajouter »)
     reçoit : Metformine (socle) + Poursuivre le traitement en cours et réévaluer
```

Aucun n'est laissé sans conduite. Le seul geste retiré est celui que la SFD 2025 vise nommément.

*(Les profils du banc sont mécaniques, pas épidémiologiques : « 18 ans et fragile » n'existe pas en
consultation. Ce sont les OPTIONS qui portent le résultat, pas la plausibilité des patients.)*

## Conclusion

**Le sur-blocage est réel, minuscule, et il tombe exactement là où le référent l'a voulu.** L'arbitrage
du matin n'a pas été rendu sur une prémisse fausse : il n'y a rien à rouvrir, et rien à corriger dans le
contenu. La ligne correspondante du `PLAN-CORRECTION.md` (§2.2) est retirée.

## Ce que cet épisode ajoute au constat de méthode

C'est le **quatrième** rapport de la journée qui sur-accuse le contenu — après les trois red-teams dont
`CONSTRUIRE-UN-MODULE.md` §P4 avait déjà tiré la leçon. Le motif est chaque fois le même : un agent
mesure ce qu'il peut mesurer facilement (un état, un comptage brut) plutôt que ce que la question
demande (un effet, donc une comparaison contrefactuelle).

Règle à ajouter au procédé : **toute affirmation de la forme « N profils perdent X » doit être produite
par une comparaison appariée**, jamais par un comptage d'état. Le dépôt fournit l'instrument
(`genererPairesBooleennes`) ; ne pas l'employer devrait invalider le constat, pas seulement l'affaiblir.
