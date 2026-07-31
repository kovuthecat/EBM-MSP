# 2026-07-28 — D30 · Un critère non répondu est indéterminé, quel que soit son type (amende D20)

### Décision

Un critère `bool`/`liste` non renseigné vaut désormais **`indéterminé`**, au même titre que
`nombre`/`enum` — plus de présomption implicite « non »/« aucun ». Le champ de contenu qui portait
l'exception s'appelle désormais **`presomption_non`** (renommé depuis `confirmation_requise`, **sens
inversé**) : `presomption_non: true` est l'exception explicite qui rend un `bool`/`liste` déterminé par
son défaut tant qu'il n'est pas renseigné — réservée aux critères qui ne participent à **aucune**
condition, `exclusions` ou `prerequis` d'une option `role: securite` du nœud. Absent ou `false` = le
critère reste indéterminé jusqu'à saisie, comme un `nombre`/`enum`.

`critereEstDetermine` (`src/features/decision/engine/deriveCritere.ts`) porte la règle ; l'écran
(`decisifsAConfirmer`, `src/features/decision/lib/formLayout.ts`) a été réaligné sur la **même** fonction
moteur (`determinesEffectifs`) au lieu de son propre filtre `!touched.has(nom)`, pour que le marqueur
« à confirmer » et le compteur de critères non confirmés ne puissent plus diverger de ce que le moteur
tient réellement pour répondu.

La liste des critères éligibles à `presomption_non` a été établie **mécaniquement** (parcours des
`conditions`/`exclusions`/`prerequis`/`quand` d'alerte de chaque nœud), pas à la main : les critères qui
portaient déjà `confirmation_requise: true` (5 sur `rhd-activite-physique`, 2 sur `rhd-alimentation`, 3
sur `statine`) n'ont **jamais** reçu `presomption_non` — ils restent indéterminés.

### Contexte

Recette navigateur du 2026-07-28 : formulaire **entièrement vierge** sur `rhd-activite-physique` →
quatre cartes « Recommandée » justifiées par « Interrompt habituellement les longues périodes assises :
non » et « Offre d'activité de proximité connue : non » (D-01) ; sur `cible-glycemique`, une cible
~6,5 % justifiée par « Antécédent cardiovasculaire : non et Comorbidité grave : non et Fragilité : non »,
les trois marqués « · à confirmer » **dans la même page** (D-02). D20 posait l'inverse (« `bool`/`liste`
restent déterminés par défaut, sauf `confirmation_requise` ») : la recette a montré que ce défaut,
présenté comme rassurant côté contenu, produisait exactement le symptôme que D20 avait été écrite pour
éliminer côté `nombre`/`enum`.

### Raison du choix

La forme du défaut n'est pas propre à `nombre`/`enum` : c'est « le moteur affirme sur une donnée qu'il
n'a jamais reçue », quel que soit le type porteur. Traiter les deux familles de types différemment
n'avait jamais été un choix clinique, seulement l'état du schéma au moment de D20. Arbitrage référent du
2026-07-28.

### Conséquences

- Saisie allongée : un praticien qui laisse un drapeau vide ne bloque plus une seule option, il bloque
  **toutes** celles qui le lisent — le geste « Rien à signaler » (répond en un clic à toute une section)
  devient donc structurant, pas cosmétique.
- Nouvel invariant de banc **I21** (`engine/banc/vierge.test.ts`) : sur tout nœud publié, un profil
  entièrement vide ne produit **aucune** option `applicable`.
- **Dette ouverte, nommée, non résolue par ce plan.** Sur le nœud `prescription`, deux critères
  (`traitements_en_cours`, `intolerance_traitement`) sont masqués par `visible_si: "intention !=
  initier"` et n'ont **pas pu** recevoir `presomption_non` (ils gardent de vraies conditions
  `role: securite`/`exclusions` ailleurs sur le même nœud) — masqués, ils sont donc devenus indéterminés
  pour un patient `initier`, faisant partir en attente une vingtaine d'options qui n'ont, par
  construction, aucun objet pour un naïf. P4/S9 (T-031) a répété le garde `intention != initier` (motif
  R8) sur toutes les citations **positives** des deux critères — suffisant pour clore `intolerance_
  traitement` en entier. Le même geste reste **impuissant** sur les citations **négatives** de
  `traitements_en_cours` (`ne_contient_pas X`, garde-fous de non-duplication sur 8 options d'ajout :
  Insuline d'initiation, Introduire un iSGLT2/un AR GLP‑1/le tirzépatide, Association, Envisager
  l'insuline, Gliptine/Sulfamide place résiduelle) : y répéter le même garde en `AND` **exclurait à
  tort** ces options pour tout patient `initier` — régression confirmée sur le banc (I2′, profils
  #227/#763/#1230). Tracée dans `engine/banc/impasse.test.ts` (`IMPASSES_CONNUES_T018`) et
  `engine/banc/invariants-contenu.test.ts` (`VIOLATIONS_R8_CONNUES_T018`), à revoir avec le référent :
  soit revenir sur l'exclusion de `traitements_en_cours` de `presomption_non` sur ce nœud, soit une
  évolution du DSL vers un garde de polarité inverse.
