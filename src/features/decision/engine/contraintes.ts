/**
 * CONTRAINTES DE SAISIE — relations entre critères qui doivent rester vraies (`Noeud.contraintes`,
 * schema/noeud.schema.json). Une saisie qui en viole une décrit un patient **impossible**, pas un patient
 * rare.
 *
 * POURQUOI CE MODULE EXISTE (défaut K3, seconde recette navigateur du 2026-07-27). Sur le nœud
 * `Insulinothérapie`, `TBR = 1` avec `TBR sévère = 95` était accepté sans un mot : le temps passé sous
 * 54 mg/dL est par définition INCLUS dans le temps passé sous 70, donc 95 % contre 1 % ne peut pas exister.
 * Le nœud en tirait trois cartes « Recommandée », dont « Ajouter un bolus au repas principal » — chez un
 * patient que la saisie décrit comme passant 95 % du temps en hypoglycémie sévère. Aucune validation
 * CROISÉE entre critères n'existait, ni au schéma, ni à la saisie, ni au banc.
 *
 * CE QUE CE MODULE NE FAIT PAS, et c'est délibéré :
 *
 * - il ne CORRIGE rien. Devant `TBR = 1` / `TBR sévère = 95`, l'outil ne peut pas savoir laquelle des deux
 *   valeurs est fausse — seul le praticien le sait. Il signale, il ne tranche pas.
 * - il ne REFUSE pas la saisie. Bloquer un champ tant qu'une relation n'est pas satisfaite empêche de
 *   corriger dans l'ordre qu'on veut (baisser `TBR sévère` avant de monter `TBR`, ou l'inverse), et
 *   transforme un garde-fou en obstacle.
 * - il n'entre dans AUCUNE sélection d'option. `evaluateNode` ne lit pas `contraintes` : une contrainte
 *   violée ne retire aucune carte et n'en ajoute aucune. Ce serait un effet caché (invariant 2 / D3), et
 *   surtout un mauvais service — le praticien qui a mal saisi veut voir le signalement, pas un écran qui
 *   change de forme sans dire pourquoi.
 *
 * DEUX CONSOMMATEURS : le formulaire (`components/CriteriaForm.tsx`, signalement au praticien) et le banc
 * (`engine/banc/profils.ts`, qui cesse d'engendrer des profils impossibles — sans quoi il dépense ses
 * profils sur des états qui n'existent pas et fige leur sortie absurde dans un golden master).
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5 / D8) : aucun nom de nœud ni de critère ici, tout est lu sur `Noeud`.
 */
import { INDETERMINE, evaluateCondition, type Criteria } from './conditions.ts'
import type { Contrainte, Noeud } from '../content/node.types.ts'

/**
 * Contraintes de `node` VIOLÉES par `criteria`. Une contrainte INDÉTERMINÉE (au moins un de ses deux
 * opérandes non encore renseigné, D20/R7) n'est PAS violée : tant que le praticien n'a pas donné les deux
 * valeurs, aucune relation entre elles ne peut être fausse. C'est la différence avec un traitement binaire,
 * qui signalerait une incohérence dès le premier champ rempli.
 *
 * `renseignes` omis ⇒ repli « tout est renseigné », comme partout ailleurs dans le moteur.
 */
export function contraintesViolees(
  node: Noeud,
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): Contrainte[] {
  const violees: Contrainte[] = []
  for (const contrainte of node.contraintes ?? []) {
    const valeur = evaluateCondition(contrainte.expression, criteria, renseignes)
    if (valeur === INDETERMINE) continue
    if (valeur === false) violees.push(contrainte)
  }
  return violees
}

/** `criteria` décrit-il un patient possible au regard des contraintes déclarées par `node` ? */
export function respecteContraintes(
  node: Noeud,
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): boolean {
  return contraintesViolees(node, criteria, renseignes).length === 0
}
