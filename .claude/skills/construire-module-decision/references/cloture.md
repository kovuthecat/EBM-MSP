# Clôture — preuves de P5 à P7, checklists, fin de chantier

Autorité : `CONSTRUIRE-UN-MODULE.md` § P5, § P6, § P7 et § 2 ; `GRAMMAIRE-NOEUD.md` pour l'écriture.
Chaque preuve se consigne dans l'état : commande, date, résultat. Commandes vérifiées dans le dépôt le
2026-09-24 ; vérifier que le fichier existe encore avant de les lancer.

## P5 — Encodage (A9, D30)

1. **Brouillon de table d'abord.** Dans le dossier de preuve du nœud (`docs/decision/noeuds/<fichier>.md`,
   section dédiée) : une ligne par option envisagée, colonnes `role` · `famille` (et `exclusive`) ·
   rang · `conditions` · `prerequis` · `exclusions`, rédigée depuis les vignettes gelées et le dossier
   consolidé. Commit **avant** le premier commit du YAML.
2. **Antériorité prouvée** :
   `git log --diff-filter=A --format="%h %cs" -- docs/decision/noeuds/<fichier>.md content/decision/noeuds/<domaine>/<nœud>.yaml`.
   Un brouillon postérieur ne vaut rien et ne se rattrape pas : il faut le dire au référent.
3. **YAML** sous `GRAMMAIRE-NOEUD.md`. Un fait manque pour décider : on ajoute le critère, on n'affaiblit
   pas la règle (D20). Aucun contenu clinique inventé.
4. **Porte** : `node .claude/workflow/bin/n0.mjs` sort à 0 (schéma, typecheck, build, tests) ; aucun
   `presomption_non` sans motif écrit, aucun sur un critère lu par une option `role: securite` (D30,
   précisée par D55).

## P6 — Deux vérifications (A9, D30, D32, D54)

| Preuve | Commande ou pièce |
| --- | --- |
| Piste A, fidélité au dossier | vérification bi-agents, étape 8 de `docs/decision/00-global.md` |
| Piste B, comportement : banc vert, ou rouges en dette nommée (décision, date, chantier) | `node .claude/workflow/bin/n0.mjs` ; vignettes du chantier traduites en tests |
| I21, I22, I23 verts | `npx vitest run src/features/decision/engine/banc/vierge.test.ts src/features/decision/engine/banc/securite-atteignable.test.ts` |
| Table régénérée, **diffée** contre le brouillon ; chaque écart justifié par écrit | `npx vitest run src/features/decision/engine/banc/tableConditions.test.ts` → `src/features/decision/engine/banc/__snapshots__/table-conditions.<nœud>.txt` |
| Portée domaine : aucun fait de sécurité nouveau sans `concerne` ni déclaration | `npx vitest run src/features/decision/engine/banc/invariants-contenu.test.ts -t "I33"` |
| Invariants de rendu verts | `npx vitest run src/features/decision/engine/banc/rendu-textuel.test.ts` |

**Fidèle n'est pas correct.** Un YAML fidèle au dossier (piste A close) peut produire une sortie qui
contredit une vignette gelée : la piste B le montre, et **la vignette gagne**. On ne clôt pas en
invoquant la fidélité. Soit le contenu est corrigé et la piste B repasse, soit le référent rouvre la
vignette (réouverture consignée).

Devant un invariant rouge, poser les trois questions du § 3 : le contenu a-t-il tort, l'invariant
est-il trop large, demande-t-il l'inverse de la grammaire ? C'est un aide-mémoire (A12), il ne bloque
pas.

## P7 — Recette (A10)

- Recette référent sur le déployé.
- Recette navigateur selon `docs/decision/validation/PROMPT-recette-navigateur.md`, dans le navigateur
  intégré de Claude Code Desktop uniquement (`/verif-visuelle`, `/revue-d-usage`). Elle joue les
  allers-retours (changer l'intention sur un formulaire rempli, revenir, relire), et relit les résumés
  des sections repliées après chaque geste global.
- Porte : les deux recettes closes, aucun défaut grave ouvert.

## Checklists (§ 2), avant `valide`

- **Opposables** : les items sans repère, qui reposent sur une décision du registre, et les items
  marqués A3, A9, R11 ou R12. Chacun se coche **avec sa preuve** : test, ligne de YAML, commande.
- **Aide-mémoire** *(A11, A12)* : ils se présentent au référent, un par un, avec la question qu'ils
  posent. Sa réponse se consigne, mais un item non retenu ne bloque rien.
- **Opposables pour les nouveaux domaines** (A12) : chaque entrée `incertitudes` porte un préfixe de
  nature (`PREUVE:`, `ARBITRAGE:`, `CONCEPTION:`, `SOURÇAGE:`, `TECHNIQUE:`) ; un seul état de chantier.

## Fin de chantier

1. Chaque nœud est `valide`, ou son statut est dit au référent.
2. La chaîne traçable de l'état ne laisse aucun orphelin, ou chacun est justifié.
3. Les décisions de l'état ont migré : transverses vers `DECISIONS.md`, cliniques vers
   `docs/decision/noeuds/`.
4. L'état se clôt par une ligne datée : ce qui est livré, ce qui reste ouvert et sa nature.
