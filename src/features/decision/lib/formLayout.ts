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
 *
 * VALEUR INDÉTERMINÉE (DECISIONS.md D20, `docs/decision/validation/chantier-2026-07-26/
 * SPEC-valeur-indeterminee.md` §2, point 5 de la tâche) : `champEstVisible` accepte un troisième
 * paramètre optionnel `renseignes` — un `visible_si` INDÉTERMINÉ rend le champ **VISIBLE**, jamais
 * masqué. Justification : masquer un champ sur une donnée qu'on ignore encore le réinitialiserait à sa
 * valeur par défaut (`reinitialiserChampsMasques`), ce qui AFFIRMERAIT une valeur — exactement le défaut
 * que ce chantier corrige (un champ masqué à tort sur `intention` non renseignée, par exemple, effacerait
 * silencieusement un `traitements_en_cours` déjà saisi). Mieux vaut montrer un champ qui se révélera
 * sans objet une fois le champ dont il dépend renseigné, que masquer — et donc potentiellement
 * réinitialiser — un champ dont on ne sait pas encore s'il l'est. `grouperChamps`/
 * `reinitialiserChampsMasques`/`champsVisibles` acceptent le même paramètre optionnel et le traduisent,
 * UNE SEULE FOIS par appel (pas par champ), en ensemble EFFECTIF via `determinesEffectifs`
 * (`engine/deriveCritere.ts`) avant de le transmettre à `champEstVisible`. Absent (repli) : comportement
 * RIGOUREUSEMENT INCHANGÉ, comme partout ailleurs dans ce chantier.
 */
import type { CritereEntree } from '../content/node.types.ts'
import type { Criteria, CriteriaValue } from '../engine/conditions.ts'
import { evaluateCondition } from '../engine/conditions.ts'
import { calculerCriteresDerives, determinesEffectifs } from '../engine/deriveCritere.ts'

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
 *
 * `renseignes` (D20, cf. docstring de tête) : un `visible_si` qui s'évalue à `INDETERMINE` rend le champ
 * VISIBLE (`!== false`, pas seulement `=== true`) — jamais masqué sur une donnée inconnue. ATTENDU DÉJÀ
 * EFFECTIF (fold bool/liste + dérivés déterminés) : cette fonction, générique, ne connaît aucun `type`
 * de critère — c'est aux appelants (`grouperChamps`/`reinitialiserChampsMasques` ci-dessous) de le
 * calculer, une seule fois par appel plutôt qu'une fois par champ.
 */
export function champEstVisible(
  critere: CritereEntree,
  criteriaDerives: Criteria,
  renseignes?: ReadonlySet<string>,
): boolean {
  if (critere.visible_si == null) return true
  return evaluateCondition(critere.visible_si, criteriaDerives, renseignes) !== false
}

/**
 * Champs SAISISSABLES (non `derive`) actuellement visibles, groupés par `groupe` dans l'ordre de première
 * apparition. Les critères dérivés ne sont jamais rendus (calculés, cf. `deriveCritere.ts`) ; un groupe
 * dont tous les champs sont masqués disparaît entièrement.
 */
export function grouperChamps(
  criteresEntree: CritereEntree[],
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): GroupeChamps[] {
  const derives = calculerCriteresDerives(criteresEntree, criteria)
  const effectifs = determinesEffectifs(criteresEntree, derives, renseignes)
  const groupes: GroupeChamps[] = []
  const indexParLibelle = new Map<string | undefined, number>()

  for (const critere of criteresEntree) {
    if (critere.derive != null) continue
    if (!champEstVisible(critere, derives, effectifs)) continue
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
  renseignes?: ReadonlySet<string>,
): { criteria: Criteria; reinitialises: string[] } {
  let courant = criteria
  const reinitialises: string[] = []

  // Borne de sécurité : au pire un champ réinitialisé par tour, jamais de boucle infinie sur un contenu
  // dont les `visible_si` s'entre-déclencheraient.
  for (let tour = 0; tour <= criteresEntree.length; tour += 1) {
    const derives = calculerCriteresDerives(criteresEntree, courant)
    const effectifs = determinesEffectifs(criteresEntree, derives, renseignes)
    const aReinitialiser = criteresEntree.filter((critere) => {
      if (critere.derive != null) return false
      if (champEstVisible(critere, derives, effectifs)) return false
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
export function champsVisibles(
  criteresEntree: CritereEntree[],
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): Set<string> {
  return new Set(grouperChamps(criteresEntree, criteria, renseignes).flatMap((g) => g.champs.map((c) => c.nom)))
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
  // `touched` PASSÉ COMME `renseignes` (correctif du 2026-07-27, cause racine S3). Cet appel omettait
  // le 3ᵉ paramètre et retombait donc sur « tout est renseigné » — alors que le formulaire réel, lui,
  // calcule sa visibilité EN TERNAIRE (`CriteriaForm` passe `touched` à `grouperChamps`).
  //
  // L'écart n'est pas théorique : sur un `visible_si` INDÉTERMINÉ, les deux couches divergeaient dans
  // des sens opposés. Le formulaire applique le repli « fail open » de R7 et AFFICHE le champ ; ce
  // calcul-ci l'évaluait strictement et pouvait le tenir pour MASQUÉ, donc ne pas le réclamer. Un champ
  // décisif, affiché, non répondu, et silencieusement absent de « à confirmer » — exactement la classe
  // de défaut que ce chantier corrige ailleurs (l'écran affirme une chose, le calcul en croit une
  // autre), à une couche de plus.
  //
  // Les deux couches lisent désormais la même chose. La docstring ci-dessus insiste sur le fait que
  // réclamé et estompé dérivent de la MÊME source pour rendre la contradiction impossible : la
  // visibilité devait suivre la même règle.
  const visibles = champsVisibles(criteresEntree, criteria, touched)
  return [...pertinents].filter((nom) => !touched.has(nom) && visibles.has(nom))
}
