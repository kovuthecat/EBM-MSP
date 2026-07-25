/**
 * Sélection des options applicables d'un nœud de décision (brief `docs/decision/BRIEF_DECISION.md`
 * §7/§11 ; `DECISIONS.md` D3/D8). Module générique : aucun nœud/domaine par son nom — tout vient du
 * contenu (`Noeud.options[].conditions`) et des `criteria` fournis par l'appelant (UI, S4).
 *
 * Sémantique (S3 "Décision clé", d'après le brief §11) :
 * - une option est **applicable** si **toutes** les chaînes de son tableau `conditions` sont vraies
 *   (chaque chaîne peut elle-même composer des comparaisons par `AND`/`OR`, cf. `conditions.ts`) ;
 * - une option par ailleurs applicable est **exclue** (retirée) si l'une de ses `exclusions` (DSL)
 *   est vraie ; elle est alors reportée dans `excluded` avec la ou les expressions déclenchées,
 *   jamais retirée en silence (invariant « aucun score caché ») — DECISIONS.md D13 ;
 * - l'option dont `conditions` vaut exactement `["default"]` est la **repli** : applicable
 *   seulement si aucune option non-default ne l'est (une option exclue ne compte pas comme applicable) ;
 * - l'option dont `conditions` vaut exactement `["toujours"]` (DECISIONS.md D16) est **toujours**
 *   applicable (subie aux mêmes règles d'exclusion que les autres). **En mode `multi-options`**, elle
 *   est orthogonale au repli `default` : un `toujours` ne « compte » pas comme un non-default
 *   satisfait, donc ne masque pas un éventuel repli — sert un « socle » toujours affiché (ex.
 *   metformine, nœud B) que d'autres options viennent compléter. **En mode `ordered-first-match`**,
 *   cette orthogonalité NE S'APPLIQUE PAS : l'ordre du nœud fait foi (D11), donc un `toujours` gagne
 *   dès qu'il est atteint dans la boucle et masquerait un `default` (ou toute option) placé après lui
 *   — à réserver au `multi-options` tant qu'aucun contenu réel n'a besoin d'un `toujours` en OFM ;
 * - en mode `multi-options`, les options applicables sont triées par `priorite` croissante (tri
 *   stable ; absente = rang le plus faible, ordre du contenu préservé) — DECISIONS.md D13. En mode
 *   `ordered-first-match`, l'**ordre** du nœud EST la priorité (sortie unique) ; `priorite` est ignoré.
 *
 * `priorite`, `exclusions` et le sentinel `toujours` sont optionnels/nouveaux : un nœud qui ne les
 * utilise pas (A actuel) garde exactement le comportement antérieur (P2 réalisée, DECISIONS.md D13,
 * sans régression).
 */
import type { Alerte, Noeud, Option } from '../content/node.types.ts'
import type { Criteria } from './conditions.ts'
import { ConditionError, evaluateCondition } from './conditions.ts'

/**
 * Résultat de l'évaluation d'un nœud pour un jeu de critères donné.
 *
 * `reasons` est indexé par référence à l'`Option` elle-même (et non par un `optionId`) : le schéma
 * de contenu (`schema/noeud.schema.json`, `src/features/decision/content/node.types.ts`) ne porte
 * pas de champ `id` par option, seulement `intitule` — un libellé d'affichage qu'on ne veut pas
 * présumer unique. Les options de `applicable` étant les mêmes références que celles de
 * `node.options`, l'appelant peut faire `reasons.get(option)` directement.
 */
export interface EvaluateNodeResult {
  /**
   * Options applicables. En `multi-options`, triées par `priorite` croissante (défaut = ordre du
   * nœud) ; en `ordered-first-match`, un seul élément (l'ordre du nœud fait foi).
   */
  applicable: Option[]
  /** Conditions satisfaites (le « pourquoi ») pour chaque option de `applicable`. */
  reasons: Map<Option, string[]>
  /**
   * Options qui auraient été applicables mais qu'une exclusion dure a retirées, indexées par la ou
   * les expressions `exclusions` déclenchées (le « pourquoi de l'exclusion »). Vide si aucune (D13).
   */
  excluded: Map<Option, string[]>
  /**
   * Options NON RETENUES faute de `condition` (R4, `docs/decision/GRAMMAIRE-NOEUD.md`) : l'option
   * n'a jamais été candidate — l'une de ses `conditions` était fausse. Indexées par la PREMIÈRE
   * condition non satisfaite (pas toutes) : c'est celle qui explique, cf. R4. Distinct d'`excluded` :
   * ici l'option n'était pas indiquée pour ce patient (information d'EXPLICATION, consultée sur
   * demande) ; `excluded` retire une option qui ÉTAIT indiquée (information de SÉCURITÉ, toujours
   * visible). Les options de repli (`["default"]`) n'y figurent JAMAIS : leur non-activation n'est
   * pas un refus, c'est leur sémantique (le repli n'active que si rien d'autre ne s'applique). Les
   * options « toujours » (D16) n'y figurent pas non plus : sans condition réelle à échouer, elles ne
   * peuvent jamais être « non retenues faute de condition ». Vide si toutes les options non-repli/
   * non-toujours sont soit applicables, soit exclues.
   */
  nonRetenues: Map<Option, string>
  /**
   * Alertes cliniques déclenchées pour ces critères (D15) : rappels/avertissements indépendants de
   * la sélection des options (ex. contrôler la cétonémie, adapter la dose au DFG). Vide si aucune.
   */
  alertes: Alerte[]
  /**
   * Rang numérique RETENU pour chaque option de `applicable` (`resolvePriorite`, D13/D14). N'est PAS
   * consommé tel quel (en valeur brute) par les autres modules — un rang brut est trop sensible : passer
   * de rangs (2,2) à (2,3) ou de (2,3) à (2,4) sont deux changements de rang, mais seul le premier change
   * ce qui est affiché (l'égalité disparaît). Sert de matière première à `groupesExAequo` ci-dessous, qui
   * en tire la structure réellement significative — les GROUPES D'ÉGALITÉ — consommée à la fois par
   * `engine/relevance.ts` (signature de pertinence) et par l'écran (rendu « côte à côte », S7‑ui Lot 2).
   * Vide en `ordered-first-match` (la `priorite` y est ignorée, D11 : l'ordre du nœud fait foi).
   */
  rangs: Map<Option, number>
}

/**
 * Regroupe les options APPLICABLES (déjà triées par `evaluateNode`, tri stable) en groupes d'égalité :
 * une suite d'options consécutives partageant le même rang FINI. C'est très exactement ce que l'écran
 * donne à voir — un groupe de ≥ 2 membres n'a, par construction, aucune préférence interne (leur ordre
 * relatif ne vient que de l'ordre de déclaration dans le contenu, jamais d'une hiérarchie clinique) ;
 * un groupe d'un seul membre n'est à égalité avec personne.
 *
 * Garde-fou décisif : un rang `+Infinity` (option sans `priorite` déclarée, cf. `resolvePriorite`)
 * n'est JAMAIS groupé, même si plusieurs options partagent ce même `+Infinity` — sinon un nœud où
 * AUCUNE option ne déclare de `priorite` verrait TOUTES ses options « à égalité » et rendues côte à
 * côte, régression visuelle majeure sur tous les nœuds n'utilisant pas encore D13/D14. Chaque rang
 * infini forme donc son propre groupe singleton (empilage classique, inchangé).
 *
 * Fonction pure, réutilisée à l'identique par `relevance.ts` (signature de pertinence) et par
 * `DecisionNodeScreen.tsx` (rendu) : les deux DOIVENT voir la même structure, sinon le défaut d'origine
 * (égalité invisible au tri mais bien réelle au calcul) réapparaît sous une autre forme.
 */
export function groupesExAequo(applicable: Option[], rangs: Map<Option, number>): Option[][] {
  const groupes: Option[][] = []
  for (const option of applicable) {
    const rang = rangs.get(option)
    const groupeCourant = groupes[groupes.length - 1]
    const rangGroupeCourant = groupeCourant ? rangs.get(groupeCourant[0]) : undefined
    const memeRangFini =
      groupeCourant !== undefined &&
      rang !== undefined &&
      Number.isFinite(rang) &&
      rang === rangGroupeCourant
    if (memeRangFini) {
      groupeCourant.push(option)
    } else {
      groupes.push([option])
    }
  }
  return groupes
}

/**
 * Regroupement d'options d'une même FAMILLE clinique (`Option.famille`, correctif « ordre accidentel /
 * badge multi-natures », 2026-07-25) : `libelle` est le libellé de famille rendu tel quel comme titre de
 * section (ou `undefined` pour le repli à plat, cf. ci-dessous), `groupes` les groupes d'égalité
 * (`groupesExAequo`) calculés SEULEMENT parmi les options de cette famille.
 *
 * `exclusive` reflète `Noeud.familles[].exclusive` : `true` = alternatives (le badge « recommandee » se
 * limite au groupe de TÊTE de `groupes`) ; `false` = gestes cumulables (le badge va à toutes les options
 * de la famille) ; `undefined` = nœud SANS `familles` déclarées (repli), la distinction alternative/
 * cumulable n'existe alors pas et `computeBadges` retombe sur la règle historique (D16).
 */
export interface GroupeFamille {
  libelle: string | undefined
  groupes: Option[][]
  exclusive: boolean | undefined
}

/** Vue minimale d'un nœud suffisante à `groupesParFamille` (évite de dépendre de tout `Noeud`). */
type NoeudPourFamilles = Pick<Noeud, 'options'> & Partial<Pick<Noeud, 'familles'>>

/**
 * Partitionne les options APPLICABLES (déjà triées par `evaluateNode`) en FAMILLES cliniques, puis
 * calcule, À L'INTÉRIEUR de chaque famille seulement, les groupes d'égalité via `groupesExAequo` (aucune
 * duplication de logique).
 *
 * Raison d'être (défaut constaté en recette référent, nœud `prescription`) : l'axe `priorite` seul
 * mélange des natures d'actes différentes (ex. « introduire un iSGLT2 » et « réduire la posologie du
 * sulfamide » peuvent partager un rang) — les rendre « à égalité » suggère à tort un choix exclusif
 * alors que ces gestes se CUMULENT. Confiner le calcul d'égalité à l'intérieur d'une même famille
 * élimine ces faux positifs SANS toucher au tri ni aux rangs eux-mêmes (`famille` est pure présentation,
 * schema/noeud.schema.json).
 *
 * ORDRE DES SECTIONS (correctif « ordre accidentel », 2026-07-25) : si `node.familles` est déclaré,
 * l'ordre des sections EST l'ordre de ce tableau — une décision éditoriale explicite (contenu), plus
 * jamais un sous-produit de l'ordre d'écriture des `options`. Sinon (nœud sans `familles`, ou options
 * marquant `famille` sans déclaration de nœud — compatibilité des tests historiques), repli sur
 * l'ancienne convention : ordre de 1re apparition dans `node.options` (PAS `applicable`, déjà trié par
 * rang — une famille s'étale sur plusieurs rangs, en dériver l'ordre des sections de `applicable` les
 * ferait dépendre du patient, l'instabilité déjà corrigée sur le formulaire).
 *
 * Repli total : si AUCUNE option de `applicable` ne porte de `famille` (et `node.familles` absent),
 * renvoie une famille UNIQUE sans libellé (`libelle: undefined`, `exclusive: undefined`) dont les
 * groupes sont EXACTEMENT `groupesExAequo(applicable, rangs)` — comportement rigoureusement identique à
 * avant l'introduction de `famille` (non-régression sur les nœuds qui ne l'utilisent pas).
 *
 * Fonction pure, consommée à la fois par `relevance.ts` (signature de pertinence), `optionBadges.ts`
 * (calcul du badge) et `DecisionNodeScreen.tsx` (rendu par section) : les trois DOIVENT voir la même
 * structure, sinon le défaut d'origine (égalité affichée mais absente de la signature, ou l'inverse)
 * réapparaît sous une autre forme — cf. docstring `groupesExAequo` ci-dessus.
 */
export function groupesParFamille(
  node: NoeudPourFamilles,
  applicable: Option[],
  rangs: Map<Option, number>,
): GroupeFamille[] {
  if (node.familles && node.familles.length > 0) {
    const parFamille = new Map<string, Option[]>()
    for (const option of applicable) {
      // Intégrité (option.famille ∈ familles[].libelle) garantie par un test dédié
      // (content.test.ts), pas par ce moteur : une option sans famille référencée ici serait un
      // contenu invalide, jamais silencieusement absorbée.
      if (option.famille == null) continue
      if (!parFamille.has(option.famille)) parFamille.set(option.famille, [])
      parFamille.get(option.famille)!.push(option)
    }
    return node.familles
      // Une famille sans option applicable pour ce patient ne s'affiche pas.
      .filter((famille) => parFamille.has(famille.libelle))
      .map((famille) => ({
        libelle: famille.libelle,
        groupes: groupesExAequo(parFamille.get(famille.libelle)!, rangs),
        exclusive: famille.exclusive,
      }))
  }

  // Repli historique (nœud sans `familles` déclarées) : comportement rigoureusement identique à
  // avant cette évolution.
  const aucuneFamille = applicable.every((option) => option.famille == null)
  if (aucuneFamille) {
    return [{ libelle: undefined, groupes: groupesExAequo(applicable, rangs), exclusive: undefined }]
  }

  const ordre: (string | undefined)[] = []
  for (const option of node.options) {
    if (!ordre.includes(option.famille)) ordre.push(option.famille)
  }

  const parFamille = new Map<string | undefined, Option[]>()
  for (const option of applicable) {
    const cle = option.famille
    if (!parFamille.has(cle)) parFamille.set(cle, [])
    parFamille.get(cle)!.push(option)
  }

  return ordre
    .filter((libelle) => parFamille.has(libelle))
    .map((libelle) => ({
      libelle,
      groupes: groupesExAequo(parFamille.get(libelle)!, rangs),
      exclusive: undefined,
    }))
}

/** Une option de repli porte exactement `conditions: ["default"]` (brief §11, ex. "Cible ~7 %"). */
function isDefaultOption(option: Option): boolean {
  return option.conditions.length === 1 && option.conditions[0] === 'default'
}

/**
 * Une option « toujours » porte exactement `conditions: ["toujours"]` (D16, ex. socle metformine).
 * Exportée : l'UI (`DecisionNodeScreen.tsx`) s'en sert pour distinguer, à l'affichage, le socle
 * (badge « reco officielle ») de l'option EBM la plus indiquée (badge « Recommandée »), sans dupliquer
 * le sentinel `'toujours'` côté présentation.
 */
export function isToujoursOption(option: Option): boolean {
  return option.conditions.length === 1 && option.conditions[0] === 'toujours'
}

/**
 * Rejette une option non-repli au tableau `conditions` vide : sinon `[].every()` vaut `true`
 * (vérité vacante) et l'option serait applicable sans aucun « pourquoi », neutralisant le repli.
 * Défense au runtime (le schéma pose `minItems: 1`, mais `loadNodes` ne valide pas via Ajv, D9).
 */
function requireConditions(option: Option): void {
  if (option.conditions.length === 0) {
    throw new ConditionError(
      `Option "${option.intitule}" sans condition : une option non-repli doit porter au moins une ` +
        `condition (ou exactement ["default"]).`,
    )
  }
}

/**
 * Exclusions dures déclenchées d'une option : sous-ensemble de `option.exclusions` (expressions DSL)
 * qui s'évaluent à vrai pour ces critères. Vide si l'option n'a pas d'`exclusions`. Propage
 * `ConditionError` comme le reste du moteur (jamais de faux silencieux, brief §7).
 */
function triggeredExclusions(option: Option, criteria: Criteria): string[] {
  if (!option.exclusions || option.exclusions.length === 0) return []
  return option.exclusions.filter((expr) => evaluateCondition(expr, criteria))
}

/**
 * Première condition de `option.conditions` qui s'évalue à FAUX, ou `undefined` si toutes sont
 * vraies (option applicable sur ses conditions). Remplace `option.conditions.every(...)` : même
 * nombre d'appels à `evaluateCondition` — arrêt au premier échec, exactement comme `.every()` — mais
 * expose LA condition fautive plutôt qu'un simple booléen, sans évaluation supplémentaire (R4,
 * `docs/decision/GRAMMAIRE-NOEUD.md` : « la condition non satisfaite est déjà connue au moment où la
 * boucle s'arrête, il suffit de la retenir »). Coût nul par rapport au comportement précédent — décisif
 * ici : cette fonction est appelée par `evaluateNode`, lui-même rappelé des centaines de fois par
 * frappe via la boucle de perturbation (`engine/relevance.ts`).
 */
function firstFailingCondition(option: Option, criteria: Criteria): string | undefined {
  for (const condition of option.conditions) {
    if (!evaluateCondition(condition, criteria)) return condition
  }
  return undefined
}

/**
 * Alertes déclenchées d'un nœud pour ces critères (D15) : celles dont `quand` vaut `"default"`
 * (toujours) ou dont l'expression DSL est vraie. Indépendant de la sélection des options. Propage
 * `ConditionError` sur une expression malformée (jamais de faux silencieux, brief §7).
 */
function evaluateAlertes(node: Noeud, criteria: Criteria): Alerte[] {
  if (!node.alertes || node.alertes.length === 0) return []
  return node.alertes.filter(
    (alerte) => alerte.quand === 'default' || evaluateCondition(alerte.quand, criteria),
  )
}

/**
 * Rang effectif d'une option pour ces critères. `priorite` peut être :
 * - **absente** → rang le plus faible (`+Infinity`, placée en dernier) ;
 * - un **entier** → rang FIXE (D13) ;
 * - une **liste de règles** `{ quand, rang }` → rang CONDITIONNEL (D14) : la 1re règle dont `quand`
 *   est vrai (ou vaut exactement `"default"`) donne le rang ; si aucune ne matche → `+Infinity`.
 * Propage `ConditionError` si un `quand` est malformé (jamais de faux silencieux, brief §7).
 */
function resolvePriorite(option: Option, criteria: Criteria): number {
  const p = option.priorite
  if (p === undefined) return Number.POSITIVE_INFINITY
  if (typeof p === 'number') {
    if (!Number.isFinite(p)) {
      throw new ConditionError(`Option "${option.intitule}" : priorité numérique invalide (${String(p)}).`)
    }
    return p
  }
  // Contenu non validé par Ajv au runtime (D9) : garder les mêmes garde-fous « loud » qu'ailleurs
  // dans le moteur — une forme malformée lève `ConditionError` (nommant l'option), jamais un tri muet.
  if (!Array.isArray(p)) {
    throw new ConditionError(
      `Option "${option.intitule}" : priorité invalide (attendu un entier ou une liste de règles { quand, rang }).`,
    )
  }
  for (const regle of p) {
    if (typeof regle?.quand !== 'string') {
      throw new ConditionError(`Option "${option.intitule}" : règle de priorité sans "quand" (chaîne attendue).`)
    }
    if (regle.quand === 'default' || evaluateCondition(regle.quand, criteria)) {
      if (!Number.isFinite(regle.rang)) {
        throw new ConditionError(
          `Option "${option.intitule}" : règle de priorité (${regle.quand}) sans "rang" fini (${String(regle.rang)}).`,
        )
      }
      return regle.rang
    }
  }
  return Number.POSITIVE_INFINITY
}

/**
 * Évalue un nœud de décision pour un jeu de critères et renvoie les options applicables, ordonnées,
 * avec la liste des conditions satisfaites par option. Propage `ConditionError` (via
 * `evaluateCondition`) sans la capturer : une variable de critère inconnue ou une condition mal
 * formée dans le contenu doit être visible, jamais avalée en silence (brief §7).
 */
export function evaluateNode(node: Noeud, criteria: Criteria): EvaluateNodeResult {
  // Alertes cliniques (D15) : indépendantes de la sélection des options, calculées dans tous les cas.
  const alertes = evaluateAlertes(node, criteria)

  // Nœud à sortie unique (D11) : la 1re option applicable dans l'ordre du nœud l'emporte.
  if (node.selection === 'ordered-first-match') {
    return { ...evaluateOrderedFirstMatch(node, criteria), alertes, rangs: new Map() }
  }

  const applicable: Option[] = []
  const reasons = new Map<Option, string[]>()
  const excluded = new Map<Option, string[]>()
  const nonRetenues = new Map<Option, string>()
  const defaults: Option[] = []
  let anyNonDefaultApplicable = false

  for (const option of node.options) {
    if (isDefaultOption(option)) {
      defaults.push(option)
      continue
    }
    if (isToujoursOption(option)) {
      // Toujours candidate (D16), sans compter comme un non-default « réel » : ne doit pas
      // masquer un éventuel repli `default` par ailleurs. Reste soumise à ses `exclusions`.
      const triggeredAlways = triggeredExclusions(option, criteria)
      if (triggeredAlways.length > 0) {
        excluded.set(option, triggeredAlways)
        continue
      }
      applicable.push(option)
      reasons.set(option, [...option.conditions])
      continue
    }
    requireConditions(option)
    // R4 : la condition fautive (s'il y en a une) est retenue au passage, sans réévaluation (cf.
    // docstring `firstFailingCondition`).
    const failing = firstFailingCondition(option, criteria)
    if (failing !== undefined) {
      nonRetenues.set(option, failing)
      continue
    }
    // Applicable sur ses conditions : une exclusion dure la retire (et la trace dans `excluded`).
    const triggered = triggeredExclusions(option, criteria)
    if (triggered.length > 0) {
      excluded.set(option, triggered)
      continue
    }
    anyNonDefaultApplicable = true
    applicable.push(option)
    reasons.set(option, [...option.conditions])
  }

  // Le repli ne s'active que si AUCUNE option non-default n'est réellement applicable (une option
  // exclue ne compte pas). Le repli est lui aussi soumis à ses propres exclusions.
  if (!anyNonDefaultApplicable) {
    for (const option of defaults) {
      const triggered = triggeredExclusions(option, criteria)
      if (triggered.length > 0) {
        excluded.set(option, triggered)
        continue
      }
      applicable.push(option)
      reasons.set(option, [...option.conditions])
    }
  }

  // Tri stable par priorité (fixe D13 ou conditionnelle D14). Rangs pré-calculés une seule fois :
  // évite de ré-évaluer les conditions à chaque comparaison et fait remonter proprement une
  // ConditionError (plutôt qu'en plein tri) ; sans `priorite`, l'ordre du contenu est préservé.
  const rangs = new Map<Option, number>()
  for (const option of applicable) rangs.set(option, resolvePriorite(option, criteria))
  applicable.sort((a, b) => {
    // `resolvePriorite` garantit un nombre fini ou `+Infinity` (jamais `undefined`/`NaN`) : comparaison
    // explicite plutôt qu'une soustraction (qui donnerait `NaN` pour deux `+Infinity`) ; rangs égaux
    // → 0, l'ordre du contenu est préservé (tri stable).
    const ra = rangs.get(a) as number
    const rb = rangs.get(b) as number
    if (ra === rb) return 0
    return ra < rb ? -1 : 1
  })

  return { applicable, reasons, excluded, nonRetenues, alertes, rangs }
}

/**
 * Sélection « ordered-first-match » (sortie UNIQUE, DECISIONS.md D11) : renvoie la PREMIÈRE option
 * non-default, dans l'ordre du nœud, dont toutes les conditions sont vraies ; à défaut, l'option de
 * repli (`["default"]`, placée en dernier). Pour les nœuds à cible unique (ex. cible glycémique) :
 * l'ordre EST la sémantique explicite, ce qui lève l'ambiguïté des conditions qui se chevauchent.
 * Propage `ConditionError` comme `evaluateNode` (jamais de faux silencieux, brief §7).
 *
 * `nonRetenues` (R4) ne peut tracer que les options VUES avant l'arrêt de la boucle (le 1er match ou
 * l'épuisement du nœud) : une fois une option retenue, les suivantes dans l'ordre du nœud ne sont
 * jamais évaluées — cohérent avec `excluded`, qui a la même limite en OFM.
 */
function evaluateOrderedFirstMatch(
  node: Noeud,
  criteria: Criteria,
): Omit<EvaluateNodeResult, 'alertes' | 'rangs'> {
  const excluded = new Map<Option, string[]>()
  const nonRetenues = new Map<Option, string>()
  for (const option of node.options) {
    if (isDefaultOption(option)) continue
    requireConditions(option)
    if (!isToujoursOption(option)) {
      const failing = firstFailingCondition(option, criteria)
      if (failing !== undefined) {
        nonRetenues.set(option, failing)
        continue
      }
    }
    // 1re option satisfaite : une exclusion dure la saute (on continue vers la suivante).
    const triggered = triggeredExclusions(option, criteria)
    if (triggered.length > 0) {
      excluded.set(option, triggered)
      continue
    }
    return { applicable: [option], reasons: new Map([[option, [...option.conditions]]]), excluded, nonRetenues }
  }
  const fallback = node.options.find(isDefaultOption)
  if (fallback) {
    const triggered = triggeredExclusions(fallback, criteria)
    if (triggered.length > 0) {
      excluded.set(fallback, triggered)
      return { applicable: [], reasons: new Map(), excluded, nonRetenues }
    }
    return {
      applicable: [fallback],
      reasons: new Map([[fallback, [...fallback.conditions]]]),
      excluded,
      nonRetenues,
    }
  }
  return { applicable: [], reasons: new Map(), excluded, nonRetenues }
}
