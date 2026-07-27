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
 *
 * `prerequis` (R6, `docs/decision/GRAMMAIRE-NOEUD.md`, arbitrage indication/prérequis) : une option est
 * applicable si TOUTES ses `conditions` **ET** TOUS ses `prerequis` sont vrais — évalués par le moteur
 * exactement de la même façon (même grammaire DSL, même traitement de l'échec — R4). La SEULE différence
 * est en aval, à l'affichage (`lib/vueDecision.ts`) : la justification montrée au praticien (`reasons`)
 * ne cite jamais un `prerequis`, seulement les `conditions` vraies — un `prerequis` est un garde-fou de
 * cohérence (« ne prend pas déjà cette classe », « la niche de repli n'est pas ouverte ») qui n'apprend
 * rien affiché. Les sentinelles `["default"]`/`["toujours"]` portent sur `conditions` uniquement (leur
 * `prerequis` éventuel, lui, reste une expression DSL réelle, évaluée normalement). Optionnel : un nœud
 * qui n'en déclare aucun garde exactement le comportement antérieur.
 *
 * VALEUR INDÉTERMINÉE (DECISIONS.md D20, `docs/decision/validation/chantier-2026-07-26/
 * SPEC-valeur-indeterminee.md` §2) : `evaluateNode` accepte un troisième paramètre optionnel
 * `renseignes: ReadonlySet<string>` — les noms de critères BRUTS effectivement fournis par le
 * praticien. Absent ⇒ repli « tout est renseigné », comportement RIGOUREUSEMENT INCHANGÉ (aucune
 * fonction ternaire ne renvoie jamais `INDETERMINE`) : c'est ce qui permet à la suite existante et aux
 * bancs de continuer à tourner sans modification. Fourni, `evaluateNode` calcule d'abord l'ensemble
 * EFFECTIF des critères déterminés (`deriveCritere.ts` `determinesEffectifs` : le `renseignes` brut,
 * élargi aux `bool`/`liste` sans `confirmation_requise`, et aux critères DÉRIVÉS eux-mêmes déterminés),
 * puis évalue `conditions`/`prerequis`/`exclusions`/`priorite[].quand`/`alertes[].quand` en TERNAIRE
 * contre cet ensemble : une option dont l'une de ses `conditions`/`prerequis`/`exclusions` reste
 * INDÉTERMINÉE part dans le nouveau registre `enAttente` — ni `applicable`, ni `excluded`, ni
 * `nonRetenues` (Q1/Q2 du référent, §0 de la spec).
 */
import type { Alerte, CritereEntree, Noeud, Option } from '../content/node.types.ts'
import type { Criteria, Ternaire } from './conditions.ts'
import { ConditionError, INDETERMINE, evaluateCondition } from './conditions.ts'
import { determinesEffectifs } from './deriveCritere.ts'

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
  /**
   * Conditions satisfaites (le « pourquoi ») pour chaque option de `applicable` : toujours
   * `[...option.conditions]`, JAMAIS `option.prerequis` (R6, arbitrage indication/prérequis) — un
   * prérequis est évalué pour l'applicabilité mais n'est pas une justification montrable. Reste la
   * liste LITTÉRALE des conditions (branches `OR` comprises) ; `lib/vueDecision.ts` en tire la version
   * SITUATIONNELLE (termes `OR` réellement vrais) pour l'affichage.
   */
  reasons: Map<Option, string[]>
  /**
   * Options qui auraient été applicables mais qu'une exclusion dure a retirées, indexées par la ou
   * les expressions `exclusions` déclenchées (le « pourquoi de l'exclusion »). Vide si aucune (D13).
   */
  excluded: Map<Option, string[]>
  /**
   * Options NON RETENUES faute de `condition` OU de `prerequis` (R4, `docs/decision/GRAMMAIRE-NOEUD.md` ;
   * `prerequis` : § arbitrage indication/prérequis) : l'option n'a jamais été candidate — l'une de ses
   * `conditions` ou l'un de ses `prerequis` était faux (les deux sont évalués à l'identique, seule la
   * restitution à l'écran diffère). Indexées par la PREMIÈRE expression non satisfaite rencontrée (pas
   * toutes) : c'est celle qui explique, cf. R4. Distinct d'`excluded` : ici l'option n'était pas indiquée
   * pour ce patient (information d'EXPLICATION, consultée sur demande) ; `excluded` retire une option qui
   * ÉTAIT indiquée (information de SÉCURITÉ, toujours visible). Les options de repli (`["default"]`) et
   * « toujours » (D16) n'y figurent, PAR LEURS `conditions`, JAMAIS (leur sentinel n'est pas une expression
   * évaluable — le moteur ne l'évalue jamais comme condition) ; elles PEUVENT néanmoins y figurer par un
   * `prerequis` propre qui échoue, exactement comme une option ordinaire — un sentinel n'exempte que la
   * sentinelle elle-même, pas ses `prerequis`. Vide si toutes les options non-repli/non-toujours sont soit
   * applicables, soit exclues, ET tous les `prerequis` (de toute option, sentinel comprise) sont vrais.
   */
  nonRetenues: Map<Option, string>
  /**
   * Options EN ATTENTE (D20, SPEC-valeur-indeterminee.md §2.4/§2.5, Q1/Q2 référent) : NI `applicable`
   * NI `excluded` NI `nonRetenues` — l'une de leurs `conditions`, `prerequis` ou `exclusions` reste
   * INDÉTERMINÉE faute de critère renseigné, le moteur ne peut donc pas se prononcer (ni proposer, ni
   * écarter). Indexées par les noms de critères PRIMITIFS (jamais un nom dérivé, cf. `criteresManquants`
   * ci-dessous) à renseigner pour lever l'indétermination — jamais vide pour une entrée présente ici —
   * afin que l'écran puisse afficher « à renseigner : … » (§2.5). Vide quand `renseignes` est absent
   * (repli) : cette famille de résultat n'existe alors pas, comme avant ce champ.
   *
   * ASYMÉTRIE DÉLIBÉRÉE avec `excluded`/`nonRetenues` (le point le plus sensible du lot, cf. tests
   * dédiés) : une `exclusion` indéterminée n'est JAMAIS traitée comme fausse (l'option resterait
   * proposée alors qu'un garde-fou de sécurité n'a pas pu être vérifié) ni comme vraie (elle serait
   * écartée à tort, perdant une option peut-être indiquée) — elle bascule ICI, dans un état qui n'est ni
   * l'un ni l'autre.
   */
  enAttente: Map<Option, string[]>
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
  /**
   * Motif de rang (R6 couche 2, `docs/decision/GRAMMAIRE-NOEUD.md` § « pourquoi à ce rang ») : pour
   * chaque option de `applicable` dont le rang (`rangs`) provient d'une règle de `priorite`
   * CONDITIONNELLE (D14) dont le `quand` a matché, la condition `quand` de CETTE règle — brute (DSL),
   * à humaniser côté vue comme `reasons` (`lib/conditionText.ts`). Gratuit : `resolvePriorite` connaît
   * déjà cette information au moment où elle détermine le rang de tri, elle n'est jamais réévaluée.
   *
   * ABSENTE pour une option sans `priorite`, à `priorite` FIXE (D13, un simple entier), ou dont seule la
   * règle de repli `quand: "default"` a matché (pas de motif clinique distinct à exposer — la note
   * d'appel de `resolvePriorite` documente ce dernier cas). Vide en `ordered-first-match` (la `priorite`
   * y est ignorée, D11, comme `rangs`).
   *
   * Ne décide PAS si le motif doit être affiché : `resolvePriorite`/`evaluateNode` tournent des centaines
   * de fois par frappe via la boucle de perturbation (`engine/relevance.ts`) et n'ont aucune connaissance
   * de la famille du patient. C'est `lib/vueDecision.ts` (le modèle de vue, calculé une fois par rendu)
   * qui décide du RENDU — réservé aux familles comptant au moins deux groupes d'égalité, cf. R6 : sans
   * concurrence de rang réelle, « pourquoi celle-ci d'abord » ne veut rien dire.
   */
  rangMotifs: Map<Option, string>
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
 *
 * NE PORTE QUE SUR `conditions` (R6, arbitrage indication/prérequis) : un `prerequis` ne remplace pas
 * une condition — une option dont `conditions` serait vide mais `prerequis` rempli resterait sans aucun
 * « pourquoi » montrable, exactement le défaut que cette garde existe pour empêcher. `prerequis` reste
 * optionnel et peut légitimement être vide/absent (aucune garde équivalente n'est nécessaire côté
 * `prerequis` : un tableau vide s'y comporte comme « aucun garde-fou », jamais comme une vérité vacante
 * puisqu'il ne conditionne jamais, à lui seul, l'affichage d'un « pourquoi »).
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
 * qui s'évaluent à vrai (au sens STRICT, `=== true` — jamais `INDETERMINE`, D20) pour ces critères. Vide
 * si l'option n'a pas d'`exclusions`. Propage `ConditionError` comme le reste du moteur (jamais de faux
 * silencieux, brief §7). N'est appelée qu'une fois le VERDICT global des exclusions déjà tranché à
 * `true` (`classerOption` ci-dessous) : ne reporte donc que les expressions CONFIRMÉES, jamais une
 * indéterminée qui aurait par ailleurs basculé l'option dans `enAttente`.
 */
function triggeredExclusions(option: Option, criteria: Criteria, effectifs?: ReadonlySet<string>): string[] {
  if (!option.exclusions || option.exclusions.length === 0) return []
  return option.exclusions.filter((expr) => evaluateCondition(expr, criteria, effectifs) === true)
}

/**
 * Première expression de `expressions` qui s'évalue à FAUX (au sens STRICT), ou `undefined` si aucune ne
 * l'est. Appelée par `classerOption` ci-dessous une fois le verdict global déjà tranché à `false` — sur
 * `conditions`+`prerequis` combinés ou `prerequis` seul selon l'option (R6, arbitrage indication/
 * prérequis) : les deux sont évalués EXACTEMENT de la même façon par le moteur, seule la restitution à
 * l'écran les distingue (`lib/vueDecision.ts`). Même nombre
 * d'appels à `evaluateCondition` qu'un `.every()` — arrêt au premier échec — mais expose L'EXPRESSION
 * fautive plutôt qu'un simple booléen, sans évaluation supplémentaire (R4, `docs/decision/
 * GRAMMAIRE-NOEUD.md` : « la condition non satisfaite est déjà connue au moment où la boucle s'arrête,
 * il suffit de la retenir »). N'est appelée qu'après un verdict global déjà `false` (`classerOption`) :
 * il existe forcément une expression strictement fausse à trouver, jamais seulement indéterminée.
 */
function firstFailingExpression(
  expressions: string[],
  criteria: Criteria,
  effectifs?: ReadonlySet<string>,
): string | undefined {
  for (const expression of expressions) {
    if (evaluateCondition(expression, criteria, effectifs) === false) return expression
  }
  return undefined
}

/**
 * Statut TERNAIRE (D20) de `expressions` prises en ET (`conditions`+`prerequis` d'une option, ou
 * `prerequis` seul pour une sentinelle) : `false` dès qu'UNE expression est fausse (court-circuit —
 * boucle explicite, PAS `expressions.map(...)` puis `ternaryAll` : un `.map()` évaluerait TOUJOURS
 * toutes les expressions, y compris celles qu'un contenu réel rend volontairement inatteignables
 * derrière une condition déjà fausse plus tôt, risquant une `ConditionError` nouvelle sur une expression
 * jamais réellement rencontrée avant ce chantier — même raison que `evaluateCondition`, `conditions.ts`).
 * Sinon `INDETERMINE` si au moins une l'est, sinon `true`. `[]` ⇒ `true` (vérité vacante, `.every()`).
 */
function statutToutes(
  expressions: string[],
  criteria: Criteria,
  effectifs: ReadonlySet<string> | undefined,
): Ternaire {
  let indetermine = false
  for (const expression of expressions) {
    const valeur = evaluateCondition(expression, criteria, effectifs)
    if (valeur === false) return false
    if (valeur === INDETERMINE) indetermine = true
  }
  return indetermine ? INDETERMINE : true
}

/**
 * Statut TERNAIRE (D20) de `expressions` prises en OU (`exclusions` d'une option, Q2 référent) : `true`
 * dès qu'UNE expression est vraie (court-circuit, même motif que `statutToutes`), sinon `INDETERMINE` si
 * au moins une l'est, sinon `false`. `[]` ⇒ `false` (comme l'ancien `.some()` sur `[]`).
 */
function statutUne(
  expressions: string[],
  criteria: Criteria,
  effectifs: ReadonlySet<string> | undefined,
): Ternaire {
  let indetermine = false
  for (const expression of expressions) {
    const valeur = evaluateCondition(expression, criteria, effectifs)
    if (valeur === true) return true
    if (valeur === INDETERMINE) indetermine = true
  }
  return indetermine ? INDETERMINE : false
}

/**
 * Primitifs référencés (mot entier) par `expression`, parmi `criteres` — un critère DÉRIVÉ référencé est
 * DÉROULÉ vers les primitifs que SON PROPRE `derive` référence (un seul niveau : ce contenu ne chaîne
 * jamais un dérivé sur un autre, cf. docstring `deriveCritere.ts` `calculerCriteresDerives`). Utilitaire
 * de `criteresManquants` ci-dessous — jamais utilisé pour évaluer quoi que ce soit : mécanique de
 * nommage pour que la liste « à renseigner : … » (D20 §2.5) cite des CHAMPS DE FORMULAIRE réels, jamais
 * un concept dérivé non saisissable (`lib/formLayout.ts` : « les critères dérivés ne sont jamais rendus »).
 */
function primitivesReferencees(expression: string, criteres: CritereEntree[]): string[] {
  const noms = new Set<string>()
  for (const critere of criteres) {
    if (!new RegExp(`\\b${critere.nom}\\b`).test(expression)) continue
    if (critere.derive == null) {
      noms.add(critere.nom)
      continue
    }
    for (const autre of criteres) {
      if (autre.derive == null && new RegExp(`\\b${autre.nom}\\b`).test(critere.derive)) noms.add(autre.nom)
    }
  }
  return [...noms]
}

/**
 * Primitifs à renseigner pour lever l'indétermination d'une ou plusieurs expressions DSL (D20 §2.5,
 * « à renseigner : … ») : parmi les primitifs référencés par `expressions` (dérivés déroulés vers leurs
 * primitifs, cf. `primitivesReferencees`), ceux qui ne sont PAS dans `effectifs`. Toujours non vide
 * quand appelée juste après un `statutToutes`/`statutUne` ayant renvoyé `INDETERMINE` sur ces mêmes
 * `expressions` — c'est justement ce qui a produit ce résultat.
 */
function criteresManquants(
  expressions: string[],
  criteres: CritereEntree[],
  effectifs: ReadonlySet<string>,
): string[] {
  const referencees = new Set(expressions.flatMap((e) => primitivesReferencees(e, criteres)))
  return [...referencees].filter((nom) => !effectifs.has(nom))
}

/**
 * Classe UNE option (sentinelle `["toujours"]`/`["default"]`, dont seul `prerequis` est une expression
 * évaluable — cf. appelants ci-dessous —, ou option ordinaire) contre ses `expressionsCondition`
 * (`conditions`+`prerequis`, ou `prerequis` seul pour une sentinelle) PUIS ses `exclusions` — TOUJOURS
 * dans cet ordre (R6 : une option non indiquée n'a de toute façon rien à exclure). Mute
 * `enAttente`/`nonRetenues`/`excluded` selon le verdict (D20, Q1/Q2 référent) ; renvoie `true`
 * SEULEMENT si l'option est APPLICABLE — la seule issue qui n'est pas déjà entièrement tracée par cette
 * fonction, à charge de l'appelant de la pousser dans `applicable`/`reasons`.
 *
 * ASYMÉTRIE DÉLIBÉRÉE (cf. docstring `EvaluateNodeResult.enAttente`) : `statutToutes` indéterminé (une
 * `conditions`/un `prerequis` non tranchable) ⇒ `enAttente`, jamais `nonRetenues` (qui affirmerait « non
 * indiqué ») ni `applicable` (qui affirmerait « indiqué »). `statutUne` (exclusions) indéterminé ⇒
 * `enAttente` de la MÊME façon, jamais `excluded` (affirmerait la contre-indication) ni un passage sous
 * silence vers `applicable` (laisserait passer un geste peut-être contre-indiqué, Q2).
 */
function classerOption(
  option: Option,
  expressionsCondition: string[],
  criteria: Criteria,
  effectifs: ReadonlySet<string> | undefined,
  criteresEntree: CritereEntree[],
  enAttente: Map<Option, string[]>,
  nonRetenues: Map<Option, string>,
  excluded: Map<Option, string[]>,
): boolean {
  const statutCond = statutToutes(expressionsCondition, criteria, effectifs)
  if (statutCond === INDETERMINE) {
    enAttente.set(option, criteresManquants(expressionsCondition, criteresEntree, effectifs ?? new Set()))
    return false
  }
  if (statutCond === false) {
    nonRetenues.set(option, firstFailingExpression(expressionsCondition, criteria, effectifs)!)
    return false
  }
  const exclusions = option.exclusions ?? []
  const statutExcl = statutUne(exclusions, criteria, effectifs)
  if (statutExcl === INDETERMINE) {
    enAttente.set(option, criteresManquants(exclusions, criteresEntree, effectifs ?? new Set()))
    return false
  }
  if (statutExcl === true) {
    excluded.set(option, triggeredExclusions(option, criteria, effectifs))
    return false
  }
  return true
}

/**
 * Alertes déclenchées parmi une liste `alertes` pour ces critères : celles dont `quand` vaut
 * `"default"` (toujours) ou dont l'expression DSL est vraie AU SENS STRICT (`=== true` — jamais
 * `INDETERMINE`, D20 : « une alerte dont le `quand` est indéterminé ne s'affiche pas », §2.4). Propage
 * `ConditionError` sur une expression malformée (jamais de faux silencieux, brief §7).
 *
 * Brique commune aux alertes de NŒUD (`Noeud.alertes`, D15 — appelée ci-dessous par `evaluateAlertes`,
 * dans `EvaluateNodeResult.alertes`) et aux alertes d'OPTION (`Option.alertes`, schéma § additions
 * alertes d'option, `docs/decision/GRAMMAIRE-NOEUD.md`). Ces dernières ne sont **volontairement PAS**
 * évaluées ici, ni tracées dans `EvaluateNodeResult` : elles ne concernent que ce qui est AFFICHÉ pour
 * une option déjà APPLICABLE (`lib/vueDecision.ts` `construireVueDecision`, une fois par cycle de rendu),
 * jamais l'applicabilité elle-même — alors qu'`evaluateNode` tourne des centaines de fois par frappe via
 * la boucle de perturbation (`engine/relevance.ts`). Exportée pour cette réutilisation plutôt que
 * dupliquée dans `lib/vueDecision.ts`.
 *
 * `renseignes` (D20) : ATTENDU DÉJÀ EFFECTIF (fold bool/liste + dérivés déterminés, cf.
 * `deriveCritere.ts` `determinesEffectifs`) — cette fonction, générique, ne connaît aucun type de
 * critère et ne peut pas faire ce calcul elle-même. `evaluateAlertes` ci-dessous le passe déjà calculé
 * (une fois par appel d'`evaluateNode`) ; `lib/vueDecision.ts` (alertes d'option) fait de même.
 */
export function evaluateAlertesDeListe(
  alertes: Alerte[] | undefined,
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): Alerte[] {
  if (!alertes || alertes.length === 0) return []
  return alertes.filter(
    (alerte) => alerte.quand === 'default' || evaluateCondition(alerte.quand, criteria, renseignes) === true,
  )
}

/**
 * Alertes cliniques déclenchées d'un NŒUD pour ces critères (D15) : indépendant de la sélection des
 * options. Cf. `evaluateAlertesDeListe` pour la sémantique de `quand`.
 */
function evaluateAlertes(node: Noeud, criteria: Criteria, effectifs?: ReadonlySet<string>): Alerte[] {
  return evaluateAlertesDeListe(node.alertes, criteria, effectifs)
}

/**
 * Résolution du rang d'une option pour ces critères (`resolvePriorite`) : le rang lui-même, ET — quand
 * il provient d'une règle CONDITIONNELLE (D14) autre que le repli `"default"` — le `quand` de cette
 * règle, retenu au passage sans réévaluation (R6 couche 2, docstring `EvaluateNodeResult.rangMotifs`).
 */
interface ResolutionRang {
  rang: number
  /** `quand` de la règle de `priorite` retenue, si et seulement si ce n'est pas le repli `"default"`. */
  motif?: string
}

/**
 * Rang effectif d'une option pour ces critères. `priorite` peut être :
 * - **absente** → rang le plus faible (`+Infinity`, placée en dernier) ;
 * - un **entier** → rang FIXE (D13) ;
 * - une **liste de règles** `{ quand, rang }` → rang CONDITIONNEL (D14) : la 1re règle dont `quand`
 *   est vrai (ou vaut exactement `"default"`) donne le rang ; si aucune ne matche → `+Infinity`.
 * Propage `ConditionError` si un `quand` est malformé (jamais de faux silencieux, brief §7).
 *
 * Expose aussi le MOTIF de ce rang (R6 couche 2) quand il vient d'une règle conditionnelle réelle : la
 * boucle ci-dessous connaît déjà `regle.quand` au moment où elle retient le rang, coût nul à le
 * renvoyer. Le repli `"default"` n'a, par construction, aucun motif clinique distinct (c'est l'ABSENCE
 * de toute autre règle qui l'a fait matcher) : `motif` reste `undefined` dans ce cas.
 *
 * `effectifs` (D20, SPEC §2.4) : une règle dont `quand` est INDÉTERMINÉ ne matche pas — « un rang n'est
 * pas un fait clinique », contrairement à `conditions`/`exclusions` — on passe simplement à la règle
 * suivante (`=== true` strict ci-dessous, ni `false` ni `INDETERMINE` ne matchent). N'affecte jamais
 * `enAttente` : l'applicabilité de l'option est déjà tranchée avant que son rang soit résolu.
 */
function resolvePriorite(option: Option, criteria: Criteria, effectifs?: ReadonlySet<string>): ResolutionRang {
  const p = option.priorite
  if (p === undefined) return { rang: Number.POSITIVE_INFINITY }
  if (typeof p === 'number') {
    if (!Number.isFinite(p)) {
      throw new ConditionError(`Option "${option.intitule}" : priorité numérique invalide (${String(p)}).`)
    }
    return { rang: p }
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
    const matched = regle.quand === 'default' || evaluateCondition(regle.quand, criteria, effectifs) === true
    if (!matched) continue
    if (!Number.isFinite(regle.rang)) {
      throw new ConditionError(
        `Option "${option.intitule}" : règle de priorité (${regle.quand}) sans "rang" fini (${String(regle.rang)}).`,
      )
    }
    return { rang: regle.rang, motif: regle.quand === 'default' ? undefined : regle.quand }
  }
  return { rang: Number.POSITIVE_INFINITY }
}

/**
 * Évalue un nœud de décision pour un jeu de critères et renvoie les options applicables, ordonnées,
 * avec la liste des conditions satisfaites par option. Propage `ConditionError` (via
 * `evaluateCondition`) sans la capturer : une variable de critère inconnue ou une condition mal
 * formée dans le contenu doit être visible, jamais avalée en silence (brief §7).
 *
 * `renseignes` (D20, optionnel) : cf. docstring de tête du fichier. `undefined` ⇒ repli, comportement
 * inchangé. Fourni : `determinesEffectifs` calcule d'abord l'ensemble effectif une seule fois, ensuite
 * consommé par toutes les évaluations ternaires ci-dessous (alertes de nœud, `conditions`/`prerequis`/
 * `exclusions` de chaque option, `priorite[].quand`).
 */
export function evaluateNode(node: Noeud, criteria: Criteria, renseignes?: ReadonlySet<string>): EvaluateNodeResult {
  const effectifs = determinesEffectifs(node.criteres_entree, criteria, renseignes)

  // Alertes cliniques (D15) : indépendantes de la sélection des options, calculées dans tous les cas.
  const alertes = evaluateAlertes(node, criteria, effectifs)

  // Nœud à sortie unique (D11) : la 1re option applicable dans l'ordre du nœud l'emporte.
  if (node.selection === 'ordered-first-match') {
    return {
      ...evaluateOrderedFirstMatch(node, criteria, effectifs),
      alertes,
      rangs: new Map(),
      rangMotifs: new Map(),
    }
  }

  const applicable: Option[] = []
  const reasons = new Map<Option, string[]>()
  const excluded = new Map<Option, string[]>()
  const nonRetenues = new Map<Option, string>()
  const enAttente = new Map<Option, string[]>()
  const defaults: Option[] = []
  let anyNonDefaultApplicable = false

  for (const option of node.options) {
    if (isDefaultOption(option)) {
      defaults.push(option)
      continue
    }
    if (isToujoursOption(option)) {
      // Toujours candidate (D16), sans compter comme un non-default « réel » : ne doit pas
      // masquer un éventuel repli `default` par ailleurs. Le sentinel lui-même n'a pas de `prerequis`
      // à échouer, mais l'option PEUT en porter un (R6) : évalué normalement (via `classerOption`,
      // `expressionsCondition` = `prerequis` seul, `conditions` n'étant pas une expression évaluable),
      // AVANT les `exclusions` (une option retirée par prérequis n'était pas applicable, elle n'a donc
      // rien à exclure). D20 : indéterminé sur l'un ou l'autre → `enAttente`, jamais silencieux.
      if (
        classerOption(
          option,
          option.prerequis ?? [],
          criteria,
          effectifs,
          node.criteres_entree,
          enAttente,
          nonRetenues,
          excluded,
        )
      ) {
        applicable.push(option)
        reasons.set(option, [...option.conditions])
      }
      continue
    }
    requireConditions(option)
    // R4 : la condition fautive (s'il y en a une) est retenue au passage, sans réévaluation (cf.
    // docstring `firstFailingExpression`) ; D20 : une indétermination bascule l'option dans `enAttente`
    // plutôt que `nonRetenues` (cf. docstring `classerOption`).
    if (
      classerOption(
        option,
        [...option.conditions, ...(option.prerequis ?? [])],
        criteria,
        effectifs,
        node.criteres_entree,
        enAttente,
        nonRetenues,
        excluded,
      )
    ) {
      anyNonDefaultApplicable = true
      applicable.push(option)
      reasons.set(option, [...option.conditions])
    }
  }

  // Le repli ne s'active que si AUCUNE option non-default n'est réellement applicable (une option
  // exclue ne compte pas), ET si le moteur n'est EN ATTENTE sur aucune option. Le repli est lui aussi
  // soumis à ses propres `prerequis` (R6, évalués AVANT les `exclusions` — mêmes raisons que la branche
  // « toujours » ci-dessus) puis exclusions.
  //
  // LA CONDITION `enAttente.size === 0` EST UNE RÉVISION DE D20, datée du 2026-07-27 — pas la
  // correction d'un oubli. Le comportement antérieur était délibéré et motivé ainsi : « rester
  // silencieux sur une option ne doit pas priver le patient d'un repli par ailleurs sûr ». La recette
  // référent l'a renversé, sur pièces : sur `insuline` chez un patient naïf, les 9 options passaient en
  // attente ET la carte « Poursuivre le schéma d'insuline en cours » s'affichait, avec le badge
  // « Recommandée ». Le moteur suspendait explicitement son jugement et l'écran concluait quand même.
  //
  // C'est la violation frontale de R7 — « le moteur ne se prononce jamais sur ce qu'il ignore ». Le
  // motif d'origine gardait sa valeur tant qu'on voyait le repli comme un filet neutre ; il tombe dès
  // qu'on regarde ce que le repli DIT. Celui d'`insuline` affirme « objectif atteint, sans hypoglycémie
  // ni variabilité » : ce n'est pas un filet, c'est une conclusion sur le patient (défaut D de la même
  // recette, corrigé côté contenu au lot 2).
  //
  // I2′ (« jamais de sortie vide ») RESTE TENU, et c'est ce qui rend la révision sûre : dans cette
  // branche `enAttente` est non vide par construction, donc le bloc EN ATTENTE de l'écran a toujours
  // quelque chose à montrer — c'est son rôle déclaré (« sur formulaire vierge, c'est ce bloc qui prend
  // le relais du panneau de résultats vide »). L'invariant I2′ du banc, lui, ne teste QUE des profils
  // intégralement renseignés, où `enAttente` est vide : il n'est pas affecté.
  //
  // `ordered-first-match` n'avait PAS ce défaut : `evaluateOrderedFirstMatch` s'arrête net sur une
  // option indéterminée et n'atteint jamais son repli (cf. sa docstring, « HALTE sur indéterminé »).
  // La correction ne concerne donc que le mode `multi-options`, qui reprend ici la même doctrine.
  if (!anyNonDefaultApplicable && enAttente.size === 0) {
    for (const option of defaults) {
      if (
        classerOption(
          option,
          option.prerequis ?? [],
          criteria,
          effectifs,
          node.criteres_entree,
          enAttente,
          nonRetenues,
          excluded,
        )
      ) {
        applicable.push(option)
        reasons.set(option, [...option.conditions])
      }
    }
  }

  // Tri stable par priorité (fixe D13 ou conditionnelle D14). Rangs pré-calculés une seule fois :
  // évite de ré-évaluer les conditions à chaque comparaison et fait remonter proprement une
  // ConditionError (plutôt qu'en plein tri) ; sans `priorite`, l'ordre du contenu est préservé.
  // Le motif de rang (R6 couche 2, `rangMotifs`) est un sous-produit GRATUIT de ce même calcul : aucune
  // évaluation supplémentaire, `resolvePriorite` le connaît déjà au moment où elle fixe le rang.
  const rangs = new Map<Option, number>()
  const rangMotifs = new Map<Option, string>()
  for (const option of applicable) {
    const resolution = resolvePriorite(option, criteria, effectifs)
    rangs.set(option, resolution.rang)
    if (resolution.motif !== undefined) rangMotifs.set(option, resolution.motif)
  }
  applicable.sort((a, b) => {
    // `resolvePriorite` garantit un nombre fini ou `+Infinity` (jamais `undefined`/`NaN`) : comparaison
    // explicite plutôt qu'une soustraction (qui donnerait `NaN` pour deux `+Infinity`) ; rangs égaux
    // → 0, l'ordre du contenu est préservé (tri stable).
    const ra = rangs.get(a) as number
    const rb = rangs.get(b) as number
    if (ra === rb) return 0
    return ra < rb ? -1 : 1
  })

  return { applicable, reasons, excluded, nonRetenues, enAttente, alertes, rangs, rangMotifs }
}

/**
 * Sélection « ordered-first-match » (sortie UNIQUE, DECISIONS.md D11) : renvoie la PREMIÈRE option
 * non-default, dans l'ordre du nœud, dont toutes les conditions (ET tous les prérequis, R6) sont vraies ;
 * à défaut, l'option de repli (`["default"]`, placée en dernier). Pour les nœuds à cible unique (ex.
 * cible glycémique) : l'ordre EST la sémantique explicite, ce qui lève l'ambiguïté des conditions qui se
 * chevauchent. Propage `ConditionError` comme `evaluateNode` (jamais de faux silencieux, brief §7).
 *
 * `nonRetenues` (R4) ne peut tracer que les options VUES avant l'arrêt de la boucle (le 1er match ou
 * l'épuisement du nœud) : une fois une option retenue, les suivantes dans l'ordre du nœud ne sont
 * jamais évaluées — cohérent avec `excluded`, qui a la même limite en OFM.
 *
 * D20 (SPEC §2.4) — HALTE sur indéterminé, pas un simple saut : si l'option rencontrée dans l'ordre du
 * nœud est INDÉTERMINÉE (`conditions`/`prerequis`/`exclusions`), la boucle S'ARRÊTE là plutôt que de
 * tester l'option suivante. L'ORDRE du nœud FAIT FOI (D11) : sauter une option indéterminée pour en
 * retenir une plus loin reviendrait à décider qu'elle ne matche pas, ce qui est précisément ce que le
 * moteur ignore. Le nœud entier devient `enAttente` sur CETTE seule option ; les options suivantes — y
 * compris le repli — ne sont jamais atteintes, même limite que `nonRetenues`/`excluded` ci-dessus. Ce
 * choix n'est pas explicitement tranché par la spec (silencieuse sur l'interaction OFM/`enAttente`) —
 * signalé au rapport de tâche.
 */
function evaluateOrderedFirstMatch(
  node: Noeud,
  criteria: Criteria,
  effectifs: ReadonlySet<string> | undefined,
): Omit<EvaluateNodeResult, 'alertes' | 'rangs' | 'rangMotifs'> {
  const excluded = new Map<Option, string[]>()
  const nonRetenues = new Map<Option, string>()
  const enAttente = new Map<Option, string[]>()
  const vide: EvaluateNodeResult['reasons'] = new Map()

  for (const option of node.options) {
    if (isDefaultOption(option)) continue
    requireConditions(option)
    const expressionsCondition = isToujoursOption(option) ? option.prerequis ?? [] : [...option.conditions, ...(option.prerequis ?? [])]
    const applicable = classerOption(
      option,
      expressionsCondition,
      criteria,
      effectifs,
      node.criteres_entree,
      enAttente,
      nonRetenues,
      excluded,
    )
    if (applicable) {
      return { applicable: [option], reasons: new Map([[option, [...option.conditions]]]), excluded, nonRetenues, enAttente }
    }
    if (enAttente.has(option)) {
      // Halte immédiate (cf. docstring) : les options suivantes, repli compris, ne sont pas évaluées.
      return { applicable: [], reasons: vide, excluded, nonRetenues, enAttente }
    }
    // Sinon (non retenue ou exclue) : l'ordre du nœud continue vers l'option suivante.
  }
  const fallback = node.options.find(isDefaultOption)
  if (fallback) {
    const applicable = classerOption(
      fallback,
      fallback.prerequis ?? [],
      criteria,
      effectifs,
      node.criteres_entree,
      enAttente,
      nonRetenues,
      excluded,
    )
    if (applicable) {
      return {
        applicable: [fallback],
        reasons: new Map([[fallback, [...fallback.conditions]]]),
        excluded,
        nonRetenues,
        enAttente,
      }
    }
    return { applicable: [], reasons: vide, excluded, nonRetenues, enAttente }
  }
  return { applicable: [], reasons: vide, excluded, nonRetenues, enAttente }
}
