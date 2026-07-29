# P6 · SA3 — Grouper les champs d'`insuline` (le nœud n'a aucun `groupe`)   (ajoutée en cours de plan, suite à la découverte SB4)

> **Modèle : Sonnet · effort : medium · Vague : 3 bis (parallèle : non — après SB1/SB2, avant S6)**
> Exécutant : UNIQUEMENT la tâche ci-dessous ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-29 · Branche : —

## Contexte (pourquoi cette session existe)

SB4 (vérification inter-nœuds) a découvert que `content/noeuds/diabete-type-2/insuline.yaml` ne
déclare **aucun** champ `groupe` sur ses `criteres_entree` — contrairement aux 5 autres nœuds du
domaine. Conséquence mécanique (comportement de SB2, correct et volontaire) : `grouperChamps` renvoie un
seul groupe pour ce nœud, donc l'accordéon (chips de navigation, sections repliables) **ne s'active pas**
— le formulaire reste une longue liste plate d'environ 22 champs. C'est précisément le nœud où la recette
« praticien naïf » du 2026-07-28 avait le plus hésité (« ~21 groupes de champs, un praticien pressé
pourrait bien abandonner »). Sans cette session, `insuline` est le seul nœud à ne tirer aucun bénéfice du
plan P6.

`groupe` est un champ **d'affichage pur** (classé `inerte` dans `CHAMPS_DU_SCHEMA`, aucun effet moteur,
aucune expression) — cette session ne change AUCUN comportement de décision, uniquement l'organisation
visuelle du formulaire.

## Lire (commun à la session)

- `content/noeuds/diabete-type-2/insuline.yaml` — **en entier**, tous les `criteres_entree` (≈28 champs,
  dont plusieurs `derive` calculés — vérifie s'ils sont rendus comme champs de saisie ou non avant de
  décider s'ils ont besoin d'un `groupe`, ne le suppose pas).
- `content/noeuds/diabete-type-2/prescription.yaml` — ses `groupe` existants (5 groupes) comme modèle de
  forme (libellés courts, en français, un thème par groupe).
- `src/features/decision/lib/formLayout.ts` — `grouperChamps` : confirme qu'un champ sans `groupe`
  rejoint un groupe de repli (« Critères du patient » ou équivalent) plutôt que de disparaître, avant de
  répartir les 28 champs.

## Hors périmètre

- **N'introduis aucune nouvelle logique clinique, aucune nouvelle condition, aucun nouveau critère.**
  `groupe` est une étiquette d'affichage, rien d'autre.
- Ne renomme, ne supprime, ne réordonne aucun critère existant au-delà de l'ajout du champ `groupe`.
- Ne touche à aucun autre nœud.
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P6/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan (`WORKFLOW.md` §4d).

---

## T-044 — Un `groupe` par champ, sur le modèle clinique du flux de consultation

### Objectif

Que le formulaire `insuline` bénéficie de l'accordéon comme les 5 autres nœuds : des groupes thématiques,
dans l'ordre où un praticien y répondrait en consultation.

### Décision clé — proposition de groupement (à valider en la lisant, pas à appliquer aveuglément)

Six groupes proposés, dans cet ordre — **vérifie leur pertinence clinique en lisant le contenu réel de
chaque champ avant d'appliquer**, ajuste si un champ est mal classé, documente tout écart dans ton
rapport de tâche :

1. **Situation d'insulinothérapie** — `situation_insuline` (repère de départ du nœud, pilote les 4
   branches — même rôle que `intention` sur `prescription`).
2. **Profil et objectif glycémique** — `age`, `HbA1c_actuelle`, `HbA1c_cible`, `DFG`, `poids`.
3. **Traitement actuel** — `traitements_en_cours`, `dose_basale_actuelle`, `dose_rapide_actuelle`,
   `preference_injection`.
4. **Surveillance glycémique** — `mcg_disponible`, `TBR`, `TBR_severe`, `CV_glycemique`,
   `profil_glycemique`, `hypo_interprandiale`, `GAJ`.
5. **Signaux d'alerte et tolérance** — `risque_hypoglycemie_schema`, `hypo_severe_recurrente`,
   `symptomes_glucotoxicite`.
6. **Terrain** — `fragilite`, `esperance_vie`.

Pour les champs `derive` (`cible_atteinte`, `risque_hypoglycemique_eleve`, `terrain_cible_assouplie`,
`gaj_a_cible`, `profil_nocturne_permet_titration`, `profil_nocturne_a_cible`, `over_basalisation`) :
s'ils ne sont **pas** rendus comme champs de saisie (calculés, jamais affichés dans le formulaire), ils
n'ont pas besoin de `groupe` — vérifie-le dans `CriteriaForm.tsx`/`grouperChamps` avant de leur en poser
un inutilement.

### Lire / Modifier

**Modifier** : `content/noeuds/diabete-type-2/insuline.yaml` (ajout du champ `groupe` sur les
`criteres_entree` concernés, bump de version + changelog D5).

### Étapes

1. Liste les champs réellement rendus dans le formulaire (exclut les `derive` non affichés, si c'est le
   cas — vérifié à l'étape précédente).
2. Pose `groupe: <libellé>` sur chacun, en suivant la proposition ci-dessus, ajustée si la lecture du
   contenu réel la contredit.
3. Vérifie l'ordre : `grouperChamps` groupe dans l'ordre de PREMIÈRE apparition — l'ordre des groupes
   dans le formulaire suivra donc l'ordre des champs dans le fichier. Réordonne les champs si nécessaire
   pour que les groupes apparaissent dans l'ordre clinique voulu (celui de la Décision clé), **sans**
   changer leur ordre relatif à l'intérieur d'un même groupe.
4. Bump de version + changelog (D5) : décris l'ajout comme une réorganisation d'affichage pure, aucun
   effet clinique.
5. Fais tourner la suite. Vérifie spécifiquement que l'accordéon s'active désormais sur `insuline`
   (plusieurs groupes produits par `grouperChamps`, pas un seul).

### Validation

- Auto (bloque le commit) : `npm test` → tout vert · `npx tsc --noEmit` → 0 erreur · `npm run build` →
  OK · validation Ajv du nœud `insuline` → OK.
- Auto : un test confirme que `grouperChamps(insuline.criteres_entree, …)` produit désormais plusieurs
  groupes (pas un seul), et que chaque champ rendu appartient à l'un des groupes attendus.

### Si bloqué

Si un champ ne trouve clairement sa place dans aucun des 6 groupes proposés : ne force pas un mauvais
classement — crée un groupe supplémentaire cohérent plutôt que de mal ranger, et documente le choix.

### Message de commit (appliqué en fin de plan, cf. `WORKFLOW.md` §4d)

`feat(contenu): insuline — groupement des champs pour l'accordéon (P6)`

### Statut

Suivi dans `plans/P6/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode solo).
