# P6 · SB5 — Doctrine : ARCHITECTURE.md, DECISIONS.md, convention `action`   (rédigé par l'orchestrateur)

> **Modèle : Sonnet · effort : medium · Vague : 3 (parallèle : oui — SB4)**
> Exécutant : UNIQUEMENT la tâche ci-dessous ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-28 · Branche : —

## Lire (commun à la session)

- `ARCHITECTURE.md` — section « Maquette UI » (≈ lignes 181-210) : statut actuel, référence au prototype
  « neuf écrans » de 2026-07-22. Ce plan introduit un second pattern visuel (accordéon + colonne sticky),
  pas un remplacement du premier — les deux coexistent (le premier reste la base visuelle générale :
  tokens, cartes, badges ; le second est le shell d'écran de nœud de décision spécifiquement).
- `DECISIONS.md` — cherche si **T-025** (P4/S4, remontée des contre-indications) a été formalisée sous un
  numéro `D<n>` par P4/S7 ou si elle n'existe que comme tâche sans décision dédiée. Cherche aussi D24
  (cadrage), D25 (rôle d'option, plafond d'affichage) : ce plan ne les contredit pas, il les ré-habille.
- `docs/decision/GRAMMAIRE-NOEUD.md` — pour savoir si une règle existante couvre déjà les champs de
  contenu optionnels type `action`, ou si aucune ne le fait (probable, c'est le premier champ de ce
  genre).
- Les rapports de tâche de SB1, SB2, SB3, SA1, SA2 (ou leur code final si les rapports ne sont plus
  accessibles) : cette session documente **ce qui a été fait**, vérifié dans le code, pas ce qui était
  prévu — même principe que P4/S7.

## Hors périmètre

- **N'écris aucun code, ne touche à aucun test, à aucun YAML.** Session entièrement documentaire.
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P6/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan (`WORKFLOW.md` §4d).

---

## T-042 — Inscrire le nouveau shell et le champ `action` dans la doctrine

### Objectif

Que le prochain nœud ou le prochain domaine sache, sans redécouvrir : (a) le shell accordéon + colonne
sticky est le pattern standard d'un écran de nœud de décision ; (b) `action` est un champ optionnel,
réservé aux nœuds dont le contenu porte déjà ce vocabulaire, jamais à poser de force.

### Étapes

1. **`DECISIONS.md`** : si T-025 n'a pas de numéro `D<n>` dédié, ajoute une décision qui documente sa
   règle initiale (contre-indications toujours visibles, sans clic) **et** son amendement par ce plan
   (déplacées dans le `<details>` existant, indicateur dans le libellé du `<summary>`) — au format du
   fichier (Décision / Contexte / Raison du choix / Conséquences), datée du 2026-07-28. Si T-025 a déjà un
   numéro, amende cette décision directement plutôt que d'en écrire une nouvelle. Ajoute une seconde
   décision (nouveau numéro) pour le champ `Option.action` : optionnel, vocabulaire fixe à 5 valeurs,
   réservé aux nœuds « à action de traitement » (aujourd'hui `prescription`/`insuline`), jamais forcé sur
   un nœud dont le contenu n'a pas ce vocabulaire naturellement — cite la vérification faite avant ce
   plan (4 des 6 nœuds ne s'y prêtent pas).
2. **`ARCHITECTURE.md`** section « Maquette UI » : ajoute un paragraphe sur le shell accordéon + colonne
   sticky (source : `design/maquettes/Maquette upgrade UI.zip`, câblé aux 6 nœuds par ce plan), sans
   supprimer la référence au prototype « neuf écrans » (toujours la base des tokens/cartes). Note
   explicitement que ce shell est désormais le pattern attendu pour tout futur écran de nœud de décision.
3. **`docs/decision/GRAMMAIRE-NOEUD.md`** : si une section liste les champs de contenu optionnels et leur
   règle d'usage (ex. à côté de `presomption_non`, D30), ajoute `action` dans la même forme. Sinon, une
   ligne suffit dans la section la plus proche — ne crée pas de nouvelle sous-section pour un seul champ.
4. **Relis-toi contre le reste des documents** : si une addition contredit une règle existante, ne
   tranche pas — signale-la dans ton rapport de tâche.

### Validation

- Auto (bloque le commit) : `npm test` · `npx tsc --noEmit` · `npm run build` (aucun code touché : ils
  doivent rester verts, contrôle qu'on n'a rien touché par mégarde).
- N2 humain (bloquant pour la consolidation, pas pour le commit) : relecture par Thibault de la décision
  sur `action` et de l'amendement de T-025/contre-indications avant que ce plan soit considéré clos.

### Si bloqué

Si tu dois écrire une décision dont le code ne fait pas ce qui est décrit (SB1/SB2/SB3/SA1/SA2 auraient
livré autre chose que prévu) : STOP, signale l'écart avec le fichier et la ligne.

### Message de commit (appliqué en fin de plan, cf. `WORKFLOW.md` §4d)

`docs(doctrine): shell accordéon+sticky et champ action — ce que P6 ajoute à la grammaire`

### Statut

Suivi dans `plans/P6/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode vague parallèle).
