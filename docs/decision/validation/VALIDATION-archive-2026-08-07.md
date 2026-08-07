# Archive de `VALIDATION.md` — 2026-08-07 (purge de plafond, clôture documentaire de P14)

> **Rien n'a été supprimé : ces blocs ont été DÉPLACÉS ici** depuis `VALIDATION.md`, qui avait atteint
> son plafond de 120 lignes au moment d'y consigner les points N2 du plan P14 (session S12).
> Ce sont des points de **jugement humain** encore ouverts, sauf mention contraire — ils restent
> valables, ils ne sont simplement plus dans le fichier relu à chaque session.
> Légende : `[ ]` à valider · `[x]` OK · `[!]` à corriger.

---

## Purge du 2026-08-03 (clôture de P12) — note historique

**La recette praticien naïf du 2026-08-02** (`docs/decision/validation/recette-praticien-naif-2026-08-02.md`)
a rendu un jugement d'usage sur la majorité des items P8/P9/P10/P11 qui attendaient alors dans
`VALIDATION.md`. Résolus et retirés à cette occasion : T-055 à T-058 · T-075, T-076 · T-084, T-086 ·
T-107 a et b (**ne pas colorer « Refuse »**) · T-112 (légende à garder, mais comme *sommaire de
l'écran*) · T-105 (cible tactile 32 px, non prioritaire) · T-118 (remplacé par **D47**). **T-085**
(descente d'insuline sans chiffre) est résolu **en négatif** : HAS 2024 R.87 porte la règle dans les deux
sens, la source existait — cf. P12/S4.

---

## Décisions en attente (déplacées le 2026-08-07)

- [!] **T-120 — PRÉMISSE CADUQUE depuis D56 (2026-08-07), à re-trancher ou à clore.** L'item disait :
      « l'implication *athérome établi ⇒ antécédent cardiovasculaire* ne peut pas s'encoder :
      `cible-glycemique.yaml` ne déclare pas `ASCVD_etablie`, donc une règle de pré-remplissage qui le
      lit ne s'évaluerait jamais », avec pour recommandation d'**abandonner**. **D56 a fait déclarer
      `ASCVD_etablie` à `cible-glycemique`** (à la place d'`antecedent_cv`) : l'obstacle technique
      invoqué n'existe plus, et les deux critères ne sont plus deux noms mais un seul. La question
      « faut-il un pré-remplissage entre athérome et cible ? » devient donc **sans objet sous cette
      forme** — la sûreté visée est acquise par l'unification elle-même. À clore formellement.
- [ ] **S7/T-132 — faut-il finalement demander la statine en cours** (molécule + dose) ? Section
      renommée « Tolérance de la statine » (option a, arbitrée). L'ajouter permettrait à l'outil de
      dire « il y est déjà, ne touchez à rien » — au prix de deux champs et d'un cadrage à réécrire.

---

## Reste ouvert des plans antérieurs (non tranché par la recette du 02/08)

- [ ] **T-063** — « Remplacer le glinide » chez un patient sous répaglinide à DFG 28 (scénario jamais
      rejoué en recette).
- [ ] **T-064/T-065** — libellés « Baisse/Hausse continue de la glycémie nocturne » sur un AGP réel.
- [ ] **T-068** — une contre-indication levée est-elle assez visible pour rester vérifiable, et assez
      discrète pour ne plus alerter à tort ?
- [ ] **T-080 à T-083** — les blocs `cadrage` des six nœuds : justes et complets ? (La liste du nœud
      `prescription` est validée par l'usage : la recette N15 la dit « exactement celle de ce qui me
      fait hésiter ». Restent `insuline`, `statine`, `cible-glycemique` et les deux RHD.)
- [ ] **T-111 (b)** — la pastille ambre se lit « attention », pas « une dose manque » (verdict rendu
      par la recette). La correction proposée — une mention courte dans le socle — n'est pas faite.
