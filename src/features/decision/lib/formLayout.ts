/**
 * Mise en page du formulaire de critères (P3 · S7‑ui Lot 2) — GÉNÉRIQUE, aucun nœud ni critère connu
 * par son nom (CLAUDE.md invariant 5 / DECISIONS.md D8). Deux mécanismes, tous deux pilotés par le
 * CONTENU (`groupe`, `visible_si` de `criteres_entree`), pour que l'ordre de saisie suive le
 * raisonnement de consultation au lieu du type de donnée :
 *
 *  - **Visibilité conditionnelle** (`visible_si`) : un champ sans objet pour la situation en cours est
 *    masqué, pas seulement estompé (ex. « traitements en cours » quand l'intention est d'INITIER ;
 *    « nature de l'intolérance » quand il n'y a pas d'intolérance). Pure présentation : le critère garde
 *    sa valeur par défaut côté moteur — masquer un champ ne change donc jamais la sortie de `evaluateNode`
 *    tant que le contenu déclare `visible_si` cohérent avec les règles (cf. `champsMasquesInfluents`).
 *  - **Groupes** (`groupe`) : sections dans l'ordre de PREMIÈRE apparition des critères, libellé rendu
 *    tel quel. Le repli (aucun `groupe` déclaré) rend une section unique = comportement historique.
 *
 * Ce module ne décide d'AUCUNE sémantique clinique : il n'invente ni intitulé de section, ni ordre, ni
 * règle de visibilité — tout vient du YAML, donc de l'auteur du contenu.
 */
import type { CritereEntree } from '../content/node.types.ts'
import type { Criteria, CriteriaValue } from '../engine/conditions.ts'
import { evaluateCondition } from '../engine/conditions.ts'
import { calculerCriteresDerives } from '../engine/deriveCritere.ts'

/** Une section du formulaire : un libellé (issu du contenu) et ses champs saisissables visibles. */
export interface GroupeChamps {
  /** Libellé de section tel que déclaré dans le contenu ; `undefined` = section sans titre (repli à plat). */
  libelle: string | undefined
  champs: CritereEntree[]
}

/**
 * Valeur de départ générique d'un critère (T-006 étape 1), sans aucune connaissance clinique
 * (CLAUDE.md invariant 5) : `nombre` → 0, `bool` → false, `enum` → la première valeur déclarée,
 * `liste` → tableau vide. Sert à la fois à l'initialisation du formulaire et à la remise à zéro d'un
 * champ redevenu masqué (`reinitialiserChampsMasques`) — une seule définition, pas deux.
 */
export function valeurParDefaut(critere: CritereEntree): CriteriaValue {
  if (critere.type === 'nombre') return 0
  if (critere.type === 'bool') return false
  if (critere.type === 'liste') return []
  return critere.valeurs?.[0] ?? ''
}

/**
 * Construit l'état initial des critères depuis `criteres_entree`. Garantit que chaque critère du nœud
 * est présent dans l'objet renvoyé, pour que `evaluateNode`/`evaluateCondition` ne lève jamais une
 * "variable de critère inconnue" (`ConditionError`, `engine/conditions.ts`) sur un critère simplement
 * pas encore modifié à l'écran. Un critère `liste` initialisé comme une chaîne (au lieu d'un tableau)
 * ferait lever `contient`/`ne_contient_pas` dès la 1re évaluation (`conditions.ts` : "réservé aux
 * critères de type liste") — non rattrapé, d'où l'écran blanc autrefois constaté sur le nœud C.
 */
export function buildDefaultCriteria(criteresEntree: CritereEntree[]): Criteria {
  const criteria: Criteria = {}
  for (const critere of criteresEntree) criteria[critere.nom] = valeurParDefaut(critere)
  return criteria
}

/**
 * Le champ est‑il visible pour ces critères ? `visible_si` absent → toujours visible. L'expression est
 * évaluée sur les critères DÉRIVÉS inclus (mêmes variables que les règles du moteur). Une expression
 * invalide ne doit pas faire disparaître un champ en silence : on relaie l'erreur (même parti pris que
 * `DecisionNodeScreen` — propager plutôt que masquer un écart contenu/moteur).
 */
export function champEstVisible(critere: CritereEntree, criteriaDerives: Criteria): boolean {
  if (critere.visible_si == null) return true
  return evaluateCondition(critere.visible_si, criteriaDerives)
}

/**
 * Champs SAISISSABLES (non `derive`) actuellement visibles, groupés par `groupe` dans l'ordre de première
 * apparition. Les critères dérivés ne sont jamais rendus (calculés, cf. `deriveCritere.ts`) ; un groupe
 * dont tous les champs sont masqués disparaît entièrement.
 */
export function grouperChamps(criteresEntree: CritereEntree[], criteria: Criteria): GroupeChamps[] {
  const derives = calculerCriteresDerives(criteresEntree, criteria)
  const groupes: GroupeChamps[] = []
  const indexParLibelle = new Map<string | undefined, number>()

  for (const critere of criteresEntree) {
    if (critere.derive != null) continue
    if (!champEstVisible(critere, derives)) continue
    const index = indexParLibelle.get(critere.groupe)
    if (index === undefined) {
      indexParLibelle.set(critere.groupe, groupes.length)
      groupes.push({ libelle: critere.groupe, champs: [critere] })
    } else {
      groupes[index].champs.push(critere)
    }
  }
  return groupes
}

/**
 * SÛRETÉ : remet à leur valeur par défaut les champs devenus MASQUÉS. Sans cela, une valeur saisie puis
 * masquée continuerait de piloter le moteur en silence, sans que le praticien puisse la voir ni la
 * corriger (ex. cocher « metformine » en intensification, puis revenir à « initier » : le patient serait
 * évalué comme traité alors que l'écran affirme le contraire). Renvoie le même objet si rien ne change,
 * ainsi que les noms remis à zéro (pour que l'appelant les retire aussi de `touched`).
 *
 * Itère jusqu'à stabilité : réinitialiser un champ peut en masquer un autre (visibilités en cascade).
 */
export function reinitialiserChampsMasques(
  criteresEntree: CritereEntree[],
  criteria: Criteria,
): { criteria: Criteria; reinitialises: string[] } {
  let courant = criteria
  const reinitialises: string[] = []

  // Borne de sécurité : au pire un champ réinitialisé par tour, jamais de boucle infinie sur un contenu
  // dont les `visible_si` s'entre-déclencheraient.
  for (let tour = 0; tour <= criteresEntree.length; tour += 1) {
    const derives = calculerCriteresDerives(criteresEntree, courant)
    const aReinitialiser = criteresEntree.filter((critere) => {
      if (critere.derive != null) return false
      if (champEstVisible(critere, derives)) return false
      const defaut = valeurParDefaut(critere)
      const actuel = courant[critere.nom]
      return Array.isArray(defaut) || Array.isArray(actuel)
        ? !(Array.isArray(actuel) && actuel.length === 0)
        : actuel !== defaut
    })
    if (aReinitialiser.length === 0) break
    const suivant = { ...courant }
    for (const critere of aReinitialiser) {
      suivant[critere.nom] = valeurParDefaut(critere)
      reinitialises.push(critere.nom)
    }
    courant = suivant
  }

  return { criteria: courant, reinitialises }
}

/** Noms des champs actuellement rendus à l'écran (saisissables et non masqués). */
export function champsVisibles(criteresEntree: CritereEntree[], criteria: Criteria): Set<string> {
  return new Set(grouperChamps(criteresEntree, criteria).flatMap((g) => g.champs.map((c) => c.nom)))
}

/**
 * Critères que l'on RÉCLAME au praticien avant de considérer la reco comme stabilisée : décisifs pour ce
 * patient (`pertinents`), pas encore renseignés, et VISIBLES à l'écran.
 *
 * C'est le correctif du défaut de conception constaté en recette : l'écran exigeait auparavant tous les
 * nombres référencés par une règle (`age`, via le dérivé `terrain_fragile`) tandis que le moteur de
 * pertinence estompait ces mêmes champs comme « sans effet » — un champ pouvait donc être à la fois
 * estompé et bloquant, sans issue pour l'utilisateur. En dérivant réclamé ET estompé de la MÊME source
 * (`pertinents`), la contradiction devient impossible par construction ; le filtre de visibilité ajoute
 * la seconde impasse à éviter (réclamer un champ que l'écran n'affiche pas).
 */
export function decisifsAConfirmer(
  criteresEntree: CritereEntree[],
  criteria: Criteria,
  touched: ReadonlySet<string>,
  pertinents: ReadonlySet<string> | undefined,
): string[] {
  if (!pertinents) return []
  const visibles = champsVisibles(criteresEntree, criteria)
  return [...pertinents].filter((nom) => !touched.has(nom) && visibles.has(nom))
}
