# P6 · SB4 — Vérification inter-nœuds et finition   (rédigé par l'orchestrateur)

> **Modèle : Sonnet · effort : high · Vague : 3 (parallèle : oui — SB5)**
> Exécutant : UNIQUEMENT la tâche ci-dessous ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-28 · Branche : —

## Lire (commun à la session)

- Le résultat des sessions SB1 (`DecisionNodeScreen.tsx`/`.css`), SB2 (`CriteriaForm.tsx`/`.css`), SB3
  (`OptionCard.tsx`/`.css`, `tokens.css`), SA1/SA2 (`prescription.yaml`/`insuline.yaml`) — lis leurs
  rapports de tâche s'ils sont encore accessibles, sinon relis directement le code final de ces fichiers.
- Les 6 nœuds : `content/noeuds/diabete-type-2/{cible-glycemique,statine,prescription,insuline,
  rhd-alimentation,rhd-activite-physique}.yaml` — au moins la liste des `groupe` de chacun (pour
  `cible-glycemique`/`statine`, vérifie combien de `familles` `vueDecision.ts` produit typiquement — un
  seul résultat en `ordered-first-match` ne doit pas avoir l'air cassé dans une colonne conçue à
  l'origine pour plusieurs).
- `engine/banc/` — les invariants I21/I22/I23 (D30/D32) et les vignettes existantes : ce sont eux qui
  disent si le comportement (pas l'apparence) a bougé.

## Hors périmètre

- **Ne reconçois rien** des trois sessions précédentes (SB1/SB2/SB3) : cette session vérifie et corrige
  des détails de finition (CSS, cas limites), elle ne change pas leurs décisions de design.
- N'ajoute aucun contenu clinique.
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P6/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan (`WORKFLOW.md` §4d).

---

## T-041 — Les 6 nœuds dans le nouveau shell, sans angle mort

### Objectif

Vérifier que le shell (accordéon + colonne sticky) et la carte compacte se comportent correctement sur
les 6 nœuds — pas seulement `prescription`, sur lequel la maquette a été pensée — et corriger les cas
limites trouvés.

### Décision clé

Points de vigilance connus, à vérifier explicitement (pas une liste exhaustive — cherche activement
d'autres cas limites en lisant le contenu réel des 6 nœuds) :
- **`insuline`** a beaucoup de `groupe` (nœud le plus dense du domaine, ~21 groupes de champs par audit
  antérieur) — la barre de chips doit rester utilisable (retour à la ligne, pas de débordement horizontal
  — cf. le défaut mobile déjà trouvé sur `prescription` par la recette du 2026-07-28, ne le reproduis pas
  ailleurs).
- **`cible-glycemique`/`statine`** (`ordered-first-match`) produisent en général une seule `famille`
  active à la fois (D11) — la colonne sticky ne doit pas paraître vide ou mal proportionnée avec une
  seule carte, ni hériter d'un habillage visuel pensé pour plusieurs (« Agent à ajouter — en choisir un »
  n'a de sens qu'en `multi-options` : vérifie que le libellé de section vient bien de `FamilleVue.libelle`
  du contenu, jamais d'un texte en dur qui présupposerait plusieurs options).
- **Halte + option de sécurité (D32)** : sur `statine`, le cas ASCVD+intolérance (cf. `plans/P4/S2.md`
  pour le profil exact) doit toujours afficher la carte de sécurité dans la colonne sticky malgré la
  halte — rejoue ce test de caractérisation existant, ne le suppose pas encore vert.
- **Badge verbe** : ne doit apparaître QUE sur les options de `prescription`/`insuline` qui portent
  `action` — vérifie qu'aucune option des 4 autres nœuds n'en affiche par accident (elles n'ont jamais
  `action`, donc la bordure doit rester celle par défaut).
- **Suspension (D31)** et **zéro carte (D30)** : les deux blocs doivent maintenant s'afficher DANS la
  colonne sticky (SB1) — vérifie qu'ils sont bien dedans et pas restés à l'extérieur par un oubli de
  déplacement.

### Lire / Modifier

**Modifier** : `src/features/decision/screens/DecisionNodeScreen.css`,
`src/features/decision/components/CriteriaForm.css`, `src/features/decision/components/OptionCard.css`
(ajustements ciblés uniquement — pas de refonte). Si un correctif de fond est nécessaire (pas seulement
CSS) dans `.tsx`, fais-le, mais documente précisément pourquoi ce n'était pas couvert par SB1/SB2/SB3.

### Étapes

1. Fais tourner la suite complète (`npm test`, `npx tsc --noEmit`, `npm run build`) une première fois
   pour partir d'un état de référence.
2. Pour chacun des 6 nœuds : vérifie mécaniquement (test ou lecture directe du rendu produit par les
   fonctions existantes, pas un jugement visuel — tu n'as pas de navigateur ici) les points de vigilance
   ci-dessus.
3. Corrige les cas limites trouvés, au niveau le plus ciblé possible (CSS avant tout).
4. Rejoue les invariants du banc (I16-I25 selon ce qui existe) et les vignettes des 6 nœuds : zéro
   régression de comportement, seulement d'apparence.
5. Écris dans ton rapport de tâche la liste des cas limites trouvés et corrigés, et ceux volontairement
   laissés pour la vague de contrôle visuelle (S6) faute de pouvoir les vérifier sans navigateur.

### Validation

- Auto (bloque le commit) : `npm test` → tout vert · `npx tsc --noEmit` → 0 erreur · `npm run build` →
  OK.
- N1 visuel auto : `—`.
- N2 humain : `—` — cette session prépare le terrain pour S6, qui fait la vérification visuelle réelle.

### Si bloqué

Si un cas limite révèle que SB1/SB2/SB3 ont pris une décision incompatible entre elles (ex. SB1 attend
une prop qu'SB3 n'expose plus) : STOP, décris précisément l'incompatibilité — ne tranche pas à leur
place, ce serait reconcevoir.

### Message de commit (appliqué en fin de plan, cf. `WORKFLOW.md` §4d)

`fix(ui): shell/accordéon/carte compacte — finitions inter-nœuds (6 nœuds)`

### Statut

Suivi dans `plans/P6/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode vague parallèle).
