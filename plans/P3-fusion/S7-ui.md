# S7‑ui · T‑026 — Refonte du flux de saisie (maquette 4a), générique

**Modèle/effort** : Sonnet (logique pure) / Opus (arbitrages). **Parallélisable** avec S1–S4.
**Sortie** : composants sous `src/features/decision/…` + tests unitaires. **Validation visuelle = humaine**
(VALIDATION.md ; jamais Playwright). Autorité maquette : `handoff/Prototype saisie 4a.dc.html`.

## Principe

La maquette 4a est **générique** : primer → drapeaux → groupes, estompage des champs sans effet, reco live.
On l'implémente comme des **composants et une logique node‑agnostiques** (invariant 5) : ça marche pour A/E/F/H
aujourd'hui et pour le nœud `prescription` dès que S5 le câble. **Aucun nom de nœud en dur.**

## Lots

### Lot 1 — Moteur de pertinence (pur, testable) — *à faire en premier*
`src/features/decision/engine/relevance.ts` :
- `criteresPertinents(node, criteria) : Set<string>` — pour chaque critère **saisissable** (non `derive`),
  perturber sa valeur sur un jeu de **valeurs candidates** (bool → `[true,false]` ; enum → `valeurs` ; liste →
  toggle de chaque valeur ; nombre → seuils extraits des `conditions`/`exclusions`/`alertes` mentionnant le
  critère, ± ε, plus bornes). Décisif ⇔ la **signature des options applicables change** (multiset d'`intitule`,
  cf. maquette). ⚠ **recomputer les critères `derive`** ([`deriveCritere.ts`](../../src/features/decision/engine/deriveCritere.ts))
  après chaque perturbation (sinon un input qui ne pilote que via un dérivé serait vu « sans effet »).
- `champsDecisifsManquants(node, criteria, touched) : string[]` = pertinents ∩ non‑`touched` → alimente la
  **reco provisoire**.
- Tests : `relevance.test.ts` sur A (cible) et un nœud multi‑options — vérifier qu'un critère hors‑jeu est
  bien « sans effet » et qu'un critère pivot est « décisif », y compris via un dérivé.

### Lot 2 — Formulaire adaptatif
Remplacer/étendre [`CriteriaForm.tsx`](../../src/features/decision/components/CriteriaForm.tsx) : ordre
**primer → drapeaux (bool) → groupes**, avec estompage (`opacity`) des champs non pertinents (Lot 1) et
verrouillage des groupes conditionnels (ex. bloc MCG derrière un flag). **Schéma contenu** (ajouts
optionnels, rétro‑compatibles — à acter avec S1) : `primer` (critère renseigné en premier), `groupes`
(regroupement des champs), éventuel tag `impact` par critère. Sans ces champs, repli sur le rendu à plat
actuel.

### Lot 3 — Reco provisoire
Panneau d'options rendu **en live**, badgé « **Provisoire — N champ(s) décisif(s) manquant(s) : … »**
tant que `champsDecisifsManquants` est non vide, puis « **Recommandation** » quand vide. Résout la tension
remarque 6 (ne demander que l'utile) × remarque 7 (pas de reco tant que l'essentiel manque) **sans** gate dur.

### Lot 4 — Argumentaire lisible (remarque 8)
[`OptionCard.tsx`](../../src/features/decision/components/OptionCard.tsx) : `effet_attendu` en tête (1 ligne),
`avantages`/`inconvenients` **repliés** en puces courtes ; niveau 3 (`argumentaire_exhaustif`) derrière un
clic ([`ArgumentPanel.tsx`](../../src/features/decision/components/ArgumentPanel.tsx)). En parallèle,
**réécrire court** les puces du YAML (action clinique en tête, citation reléguée) — tâche contenu, à faire
lors de l'encodage S3 pour le nœud fusionné, et rétro‑appliquée à A/E/F/H si le temps le permet.

## Critère de sortie

Lots 1–3 : composants + tests unitaires verts, build + typecheck OK, rendu consigné dans VALIDATION.md
(validation visuelle par le référent). Lot 4 : cartes lisibles + tiering. Générique, aucune régression A/E/F/H.
