# Nœud A « Cible glycémique » — Rapport de 2ᵉ passe (vérification indépendante)

- **Date** : 2026-07-22 · **Réconciliation** : Opus
- **Méthode** : 2 vérificateurs **indépendants**, contextes neufs, **modèles hétérogènes**, sur le contenu
  **consolidé** (dossier + argumentaire exhaustif, après intégration HAS/Prescrire) :
  - **V1 — Fact-checker (Sonnet)** : re-vérifie chaque chiffre/DOI/table HAS contre les sources primaires
    (a téléchargé le PDF HAS et lu l'Annexe 3 mot pour mot ; Prescrire non accessible = non-vérifiable).
  - **V2 — Red-team (Opus)** : attaque la construction de l'algorithme (bandes/conditions déroulées sur
    cas patients), la cohérence interne, les affirmations de convergence.
- **Verdict global : NON prêt à encoder.** La revue de preuves est **solide** (tous les chiffres d'essais
  confirmés, aucun DOI faux, aucune fabrication). Les défauts sont dans la **traduction preuves → algorithme**
  et sont **chirurgicaux**.

## 1. Consensus vérifié (haute confiance)

- **Chiffres d'essais confirmés au CI près** (V1) : ACCORD (HR mortalité 1,22 ; composite 0,90 NS ; IDM
  0,76 ; **NNH mortalité ≈ 100** recalculé 95→100) ; Turnbull (mortalité 1,04, IDM 0,85, hypo 2,48) ;
  Boussageon (1,04 / 0,85 / 2,33) ; Cochrane 2013 (1,00 / 2,18) ; Ray (IDM OR 0,83) ; UKPDS 80 (−13 %/−15 %) ;
  VADT-15 ans (NS) ; Stratton (−21 %/point). **Tous les DOIs réels.**
- **Table HAS 2024 fidèle** au texte officiel (Annexe 3 du doc « Recommandations », p.41-42), y compris la
  citation « aucune corrélation n'a démontré le lien HbA1c → morbi-mortalité » (p.6).
- **Qualité de la revue** jugée bonne par les deux passes.

## 2. Corrections BLOQUANTES (avant encodage)

### Algorithme (V2)
- **A1 — `age` variable morte + contradiction §4↔§6.** `age` est listé comme « driver encodé » mais
  **aucune condition ne l'utilise** ; le ≤6,5 % n'a **pas de borne d'âge** → un sujet **78 ans robuste,
  diabète récent** obtiendrait ≤6,5 %, ce que la preuve (legacy = sujet *jeune*) désavoue. Le brief §11
  avait `age < 60`, supprimé sans justification.
- **A2 — CV établi évolué NON routé vers ≤8 %.** `antecedent_cv` ne sert qu'à *exclure* le ≤6,5 %. Un
  coronarien sévère non fragile tombe en **≤7 %** — la **population d'ACCORD** (surmortalité). C'est la
  distinction **la plus EBM-étayée** (conclusion d'ACCORD, pas de l'accord d'experts) et elle est perdue.
- **A3 — Conditions non mutuellement exclusives ; sémantique « 1re vraie l'emporte » non spécifiée ;
  conflit avec le moteur « multi-options » du brief §7-8.** Correct « par accident » via un ordre implicite
  (ex. ≤6,5 % n'exclut pas `comorbidite_grave`, rattrapé seulement parce que ≤8 % est évalué avant).

### Faits (V1)
- **F1 — Coca 2012 : chiffres erronés.** L'argumentaire attribue à Coca « IRT RR 0,62 / doublement créat
  0,84 » qui sont en réalité **ceux de Ruospo/Cochrane 2017**. Vrais chiffres Coca : **IRT RR 0,69
  (0,46–1,05) ; doublement créat RR 1,06 (0,92–1,22)** (NS). Conclusion qualitative inchangée, valeurs à dissocier.
- **F2 — « sans hypoglycémie » n'est pas une condition de profil officielle HAS pour le ≤6,5 %.** Le texte
  HAS conditionne ≤6,5 % à : nouvellement dx + EV>15 ans + **sans antécédent CV** (note : « atteint par MHD
  puis monothérapie orale »). Impact : le YAML §6 utilise `risque_hypoglycemie_schema == faible` sur ≤6,5 %.
  → **Réconciliation Opus** : la contrainte de **faible risque hypo est cliniquement fondée et cohérente
  avec la note HAS** (« atteint par MHD/monothérapie orale » = sans agent hypoglycémiant) ; on peut la
  **garder**, mais **re-citée correctement** (note HAS, pas une condition de profil inventée). *Arbitrage référent.*

## 3. À corriger avant publication (important, non bloquant pour la logique)

- **B1 — `divergence: false` est faux** → **viole le principe #2 du brief** (« divergence signalée »).
  Prescrire ne recommande pas ≤6,5 % (≈7 %) et MG « déprescrire si <6,5 % » ; le défaut ≤7 % vs Prescrire
  ≈7,5 %. → `divergence: true` sur l'option ≤6,5 % + note douce sur le défaut.
- **B2 — Notation « ≤6,5 % » contredit le garde-fou « déprescrire si <6,5 % »** → exprimer **« ~6,5 % »**
  ou **« 6,5–7 % »**.
- **B3 — `niveau_preuve` incohérent** : ≤6,5 en `faible` mais ≤7/≤8 en `modere` alors qu'**aucune bande
  n'a été testée** → aligner (dissocier « preuve intensif-vs-standard » de « preuve du seuil exact »).
- **B4 — Inférence « ADVANCE 6,5 % sans surmortalité → danger = stratégie, pas chiffre »** : comparaison
  inter-essais confondue ; mécanisme ACCORD inconnu → formuler prudemment. Currie **nadir ~7,5 %** (confirmé)
  ne soutient pas ≤6,5 % côté mortalité.
- **F5 — Cochrane CD008143 (Hemmingsen) formellement RETIRÉ en 2015** (pub4, PMID 26222248) pour **conflit
  d'intérêt non déclaré** (2 auteurs employés par l'industrie). Retrait administratif (résultats non
  invalidés scientifiquement) mais **à signaler** en note de prudence.
- **F3 — « < 9 % » (strict), pas « ≤ 9 % »** pour l'âgé dépendant (texte HAS exact).
- **F4 — NNH hypo « ≈9–15 » : borne basse non sourcée** ; Boussageon (même corpus) calcule **NNH 15–52**.
  → vérifier la source exacte ou **élargir la fourchette**.
- **F6 — 35 % vs 36 %** de MCV à l'inclusion d'ACCORD (incohérence inter-fichiers) → harmoniser **35 %**.

## 4. Mineur

- **B5** — `anciennete < 5` (proxy « nouvellement dx ») et le seuil 10 ans : falaises nettes sans base ECR
  → documenter comme **conventions d'implémentation**, pas comme EBM.
- **C1** — `comorbidite_grave` non défini alors qu'il route vers ≤8/≤9 → fournir une **définition/aide clinique**.
- **C2** — **IRC absente** : l'IRC avancée **augmente réellement le risque hypo** (clairance ↓ insuline/sulfamides)
  = EBM physiopathologique, pas seulement accord d'experts → faire **alimenter `risque_hypoglycemie_schema`
  ou `comorbidite_grave` par le DFG**.
- **C3** — **Garde-fous non structurés** : le §6 a abandonné `avantages/inconvenients/effet_attendu/
  contre_indications` du gabarit §11 (l'outil sortirait une cible **nue**) ; garde-fou rétinopathie seulement
  en commentaire ; **aucun verrou d'entrée** DT1/grossesse/aigu. → restaurer `contre_indications` par option
  + gate de périmètre + input « rétinopathie préexistante » pour l'alerte.
- **C4** — `fragilite` conflée avec âge/EV.
- **C5** — Les `[À VÉRIFIER]` chiffrés (NNT/NNH) **ne doivent pas s'afficher dans l'UI** tant que non confirmés.

## 5. Plan de correction

### (a) Objectives — applicables directement (factuel/documentaire)
F1 (chiffres Coca/Ruospo dissociés) · F5 (note retrait Cochrane) · F3 (< 9 %) · F6 (35 %) · F4 (fourchette
NNH hypo élargie/sourcée) · B2 (notation ~6,5 %) · B3 (niveau_preuve aligné) · B4 (formulation prudente) ·
C5 (pas de NNT/NNH bruts dans l'UI).

### (b) Décisions du référent (conception clinique) — **requises avant encodage**
1. **A1** : verrouiller le ≤6,5 % par l'âge (`age < 65 ?`) **ou** s'aligner strict HAS (EV>15 ans, retirer
   `age` des entrées et corriger la prose) ?
2. **A2 + C1** : router le **CV établi grave / macro évoluée** vers ≤8 % — proposition : **définir
   `comorbidite_grave` de façon à inclure « complication macrovasculaire évoluée » et « IRC sévère »**, ce
   qui route vers ≤8 % (reste dans les drivers grossiers EBM). OK ?
3. **A3** : le nœud « cible » est à **sortie unique** (une bande) → spécifier une sémantique **« ordered
   first-match »** au niveau du schéma (distincte du moteur « multi-options » des nœuds B/C) **et** rendre
   les conditions **disjointes** (ajouter `comorbidite_grave == false` à ≤6,5 %) + tests couvrant les chevauchements.
4. **F2** : garder la condition « faible risque hypo » sur ≤6,5 % (re-citée note HAS) — confirmer.
5. **B1** : acter `divergence: true` sur ≤6,5 % + note de divergence douce sur le défaut.
6. **C2/C3** : intégrer le DFG au risque hypo ; restaurer `contre_indications` + garde-fou rétinopathie +
   gate de périmètre (DT1/grossesse/aigu).

## 6. Convergence des deux vérificateurs

- Les deux : **preuves solides, algorithme/intégration à corriger**.
- Les deux pointent le **≤6,5 %** comme le point faible (V2 : âge/divergence/notation ; V1 : condition
  « sans hypo » non officielle).
- **V2 (A2) + V1 (HAS confirmé)** convergent : la distinction **CV établi → cible plus lâche** est réelle
  (HAS **et** EBM d'ACCORD) et **manque** à l'algorithme → à ajouter.

---

*Archivage (brief §13bis) : ce rapport réconcilie les deux analyses indépendantes de 2ᵉ passe. Étape
suivante : décisions du référent (§5b), application des corrections, re-vérification ciblée, PUIS encodage
YAML + `meta.statut: valide`.*
