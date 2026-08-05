/**
 * Modèle de vue UNIQUE de l'écran de décision (`docs/decision/GRAMMAIRE-NOEUD.md`, § « Prérequis
 * d'architecture » cité par R2/R4/R6) : `construireVueDecision` calcule TOUT ce que
 * `DecisionNodeScreen.tsx` a besoin de rendre pour un nœud et un jeu de critères donnés, et rien
 * d'autre. L'écran ne fait plus AUCUN calcul — il consomme `VueDecision` telle quelle.
 *
 * Ne réimplémente aucune logique : compose les briques existantes, chacune restant testable seule.
 * - `evaluateNode` (sélection/tri/alertes), `engine/evaluateNode.ts` ;
 * - `groupesParFamille` (sections + groupes d'égalité), `engine/evaluateNode.ts` ;
 * - `computeBadges` (badge par option), `lib/optionBadges.ts` ;
 * - le calcul des doses (`Option.calculs`), DÉPLACÉ ici depuis `components/OptionCard.tsx` (qui
 *   l'évaluait lui-même avant ce refactor).
 *
 * Pourquoi ce fichier existe : `engine/relevance.ts` calcule quels critères sont « décisifs » en
 * comparant une SIGNATURE de ce qui est affiché avant/après perturbation d'un critère. Cette
 * signature reconstruisait auparavant l'écran À LA MAIN, en chaîne, dans `relevance.ts` — chaque
 * dimension ajoutée à l'écran (groupes d'égalité, familles, badges, alertes) devait être répercutée
 * manuellement dans cette reconstruction, et l'oubli s'est produit quatre fois. Avec ce fichier,
 * `signatureVue` sérialise directement le même objet `VueDecision` que l'écran rend : tout ce qui
 * est affiché est dans la signature PAR CONSTRUCTION, plus par discipline.
 *
 * R4 (`docs/decision/GRAMMAIRE-NOEUD.md`) : `ecartees` (options retirées par une `exclusion` —
 * information de SÉCURITÉ, toujours affichée) et `nonRetenues` (options qui ont échoué sur une
 * `condition` — information d'EXPLICATION, consultée sur demande) entrent désormais dans
 * `VueDecision` ET dans `signatureVue`. C'est ce qui garantit qu'un critère qui ne change QUE l'une de
 * ces deux listes reste détecté comme DÉCISIF par `engine/relevance.ts` — sinon il serait estompé à
 * tort comme « sans effet », le défaut récurrent que ce fichier existe pour empêcher (cf. R6, même
 * document).
 *
 * R6 (même document, § « l'argumentaire est situationnel ») : `OptionVue.reasons` n'est plus la liste
 * littérale de `Option.conditions` (`EvaluateNodeResult.reasons`) mais les termes `OR` réellement vrais
 * pour CE patient (`engine/conditions.ts` `termesVrais`), calculés ICI et non dans `evaluateNode` —
 * `evaluateNode` tourne des centaines de fois par frappe via la boucle de perturbation, une
 * justification situationnelle n'a de coût que pour ce qui est rendu. `OptionVue.motifRang` (R6 couche
 * 2, « pourquoi à ce rang ») vient du même sous-produit gratuit d'`evaluateNode`
 * (`EvaluateNodeResult.rangMotifs`, issu de `resolvePriorite`), mais n'est PAS affiché brut : c'est une
 * expression du même DSL (`priorite[].quand`), qui peut elle aussi être une disjonction `OR` — ce fichier
 * lui applique `termesVrais` (P10/S1, même correctif que `reasons` : n'afficher que la ou les branches
 * réellement vraies pour ce patient, pas la disjonction entière) avant de décider DE L'AFFICHER, réservé
 * aux familles à au moins deux groupes d'égalité (une vraie concurrence de rang).
 * Ces deux dimensions entrent dans `signatureVue` au même titre que les autres (totalité, ci-dessus) :
 * un critère qui ne change QUE la justification ou QUE le motif de rang doit rester DÉCISIF.
 *
 * Alertes d'OPTION (addendum au schéma, même document § « Additions au schéma ») : `OptionVue.alertes`
 * ne vient PAS d'`evaluateNode`/`EvaluateNodeResult` — calculée ICI, sur `option.alertes`, avec la même
 * brique que les alertes de nœud (`evaluateAlertesDeListe`, `engine/evaluateNode.ts`), pour la même
 * raison que `reasons` : un coût par cycle de rendu, jamais par perturbation. Répond au défaut constaté
 * en recette où une alerte de NŒUD (qui ne voit que les critères) s'affichait à propos d'un traitement
 * que le moteur venait précisément d'écarter — une alerte d'OPTION, elle, n'existe que sur un `OptionVue`,
 * donc uniquement pour une option retenue par le moteur. Entre dans `signatureVue` comme les autres
 * dimensions (totalité) : un critère qui ne change QUE l'alerte d'une option doit rester DÉCISIF.
 *
 * VALEUR INDÉTERMINÉE (DECISIONS.md D20, SPEC-valeur-indeterminee.md §2) : `construireVueDecision`
 * accepte un troisième paramètre optionnel `renseignes: ReadonlySet<string>` (noms bruts fournis par le
 * praticien), transmis à `evaluateNode` (registre `enAttente`, désormais porté par `VueDecision`) et
 * utilisé ICI pour recalculer l'ensemble EFFECTIF (`engine/deriveCritere.ts` `determinesEffectifs`) —
 * consommé par `calculsAffiches`/les alertes d'option, exactement pour la même raison que `reasons`
 * ci-dessus (coût par cycle de rendu, `evaluateNode` ne le fait que pour LUI-MÊME). `enAttente` entre
 * dans `signatureVue` comme les autres dimensions (totalité) : un critère qui ne change QUE la liste des
 * options en attente doit rester DÉCISIF pour `engine/relevance.ts`.
 */
import type { ActionOption, Alerte, CritereEntree, Noeud, Option } from '../content/node.types.ts'
import type { Criteria } from '../engine/conditions.ts'
import { evaluateCondition, termesVrais } from '../engine/conditions.ts'
import { calculerCriteresDerives, determinesEffectifs, evaluerNombre } from '../engine/deriveCritere.ts'
import {
  type ContreIndicationEvaluee,
  evaluateAlertesDeListe,
  evaluateNode,
  evaluerContreIndications,
  groupesParFamille,
} from '../engine/evaluateNode.ts'
import { computeBadges, type OptionBadge } from './optionBadges.ts'

/** Une dose/valeur calculée déjà évaluée, prête à l'affichage (câblage P3, `Option.calculs`). */
export interface CalculAffiche {
  libelle: string
  valeur: number
  unite: string | undefined
}

/**
 * Une dose/valeur déclarée par le contenu mais NON calculable pour ce patient, avec les champs à
 * renseigner pour l'obtenir (défaut J de la recette référent, cf. `calculsEnAttente` plus bas).
 */
export interface CalculEnAttente {
  libelle: string
  criteresManquants: string[]
}

/** Une option applicable, avec tout ce que sa carte (`OptionCard.tsx`) a besoin de rendre. */
export interface OptionVue {
  option: Option
  badge: OptionBadge
  /**
   * Badge d'action EFFECTIVEMENT affiché pour CE patient (2026-08-04, demande utilisateur) — résolution
   * de `option.action_si` (première règle strictement vraie, D20) avec repli sur `option.action` statique
   * si aucune ne matche ou si `action_si` est absent (`resoudreActionEffective` ci-dessous). `undefined`
   * ssi ni l'un ni l'autre n'est déclaré (nœuds hors `prescription`/`insuline`, cf. docstring
   * `Option.action`) — `OptionCard.tsx` retombe alors sur l'absence de pastille, comportement historique.
   */
  actionEffective?: ActionOption
  /**
   * Justification SITUATIONNELLE (R6, `docs/decision/GRAMMAIRE-NOEUD.md`) : les termes `OR` de
   * `option.conditions` réellement VRAIS pour CE patient — jamais la règle recopiée telle quelle
   * (`EvaluateNodeResult.reasons`, qui reste la liste littérale des conditions, cf. `raisonsSituationnelles`
   * ci-dessous). En général un seul motif ; plusieurs quand le patient cumule les indications (information
   * clinique, pas du bruit). Les sentinelles `["default"]`/`["toujours"]` traversent inchangées —
   * `describeReasons` (`lib/conditionText.ts`) les traite par un cas spécial.
   *
   * NE CONTIENT JAMAIS `option.prerequis` (R6, § arbitrage indication/prérequis) : un prérequis est un
   * garde-fou de cohérence (« ne prend pas déjà cette classe », « la niche n'est pas ouverte »), vrai
   * chez la quasi-totalité des patients — son énoncé n'apprend rien affiché, même s'il est aussi vrai
   * qu'une condition (l'évaluateur du moteur ne fait aucune différence entre les deux). Volontaire, pas
   * un oubli : voir `raisonsSituationnelles`, qui ne lit que `conditions`.
   */
  reasons: string[]
  /** Doses calculées déjà évaluées ; ne contient que celles calculables (cf. `evaluerNombre`). */
  calculs: CalculAffiche[]
  /**
   * Doses déclarées que ce patient ne permet pas encore de calculer (défaut J, 2026-07-27). Vide dès
   * que tout est renseigné — et vide aussi en repli `renseignes === undefined`, où rien n'est
   * indéterminé. La carte s'en sert pour dire ce qui lui manque, au lieu de se taire.
   */
  calculsEnAttente: CalculEnAttente[]
  /**
   * Motif de rang (R6 couche 2, « pourquoi à ce rang ») : les termes `OR` réellement vrais (P10/S1,
   * `termesVrais`, même traitement que `reasons`) du `quand` de la règle de `priorite` CONDITIONNELLE
   * (D14) qui a fixé le rang de cette option pour ce patient (`EvaluateNodeResult.rangMotifs`).
   * `undefined` si l'option n'a pas de motif de rang (pas de `priorite`, `priorite` FIXE D13, ou seul le
   * repli `"default"` a matché) OU si sa famille ne compte qu'UN SEUL groupe d'égalité — sans concurrence
   * de rang réelle dans la famille, « pourquoi celle-ci d'abord » ne veut rien dire (cf.
   * `construireVueDecision`, qui applique cette dernière condition). Jamais vide quand défini : `quand`
   * a été retenu par `resolvePriorite` parce qu'il s'est évalué vrai, `termesVrais` y trouve donc toujours
   * au moins une branche.
   */
  motifRang: string[] | undefined
  /**
   * Alertes PORTÉES PAR CETTE OPTION (`option.alertes`, `docs/decision/GRAMMAIRE-NOEUD.md` § additions
   * au schéma), déjà filtrées : seulement celles dont `quand` est vrai pour CE patient
   * (`evaluateAlertesDeListe`, `engine/evaluateNode.ts`). Calculées ICI (dans `construireVueDecision`),
   * **PAS** dans `evaluateNode`/`EvaluateNodeResult` — mêmes raisons que `reasons` ci-dessus : une alerte
   * d'option ne concerne que ce qui est RENDU, jamais l'applicabilité, et `evaluateNode` tourne des
   * centaines de fois par frappe via la boucle de perturbation.
   *
   * `OptionVue` n'existe QUE pour les options APPLICABLES (cf. `familles` dans `VueDecision`) : c'est ce
   * qui garantit, PAR CONSTRUCTION, qu'une alerte d'option ne s'affiche jamais pour un geste que le moteur
   * n'a pas retenu — le défaut constaté en recette (une alerte de nœud citant un traitement qui vient
   * d'être ÉCARTÉ) ne peut pas se reproduire ici : une option écartée ou non retenue n'a pas d'`OptionVue`
   * (elle vit dans `VueDecision.ecartees`/`nonRetenues`, qui ne portent pas d'alertes).
   */
  alertes: Alerte[]
  /**
   * Rang RÉSOLU de cette option pour ce patient (`EvaluateNodeResult.rangs`), exposé depuis le 2026-07-27
   * pour le repli d'affichage de l'écran (dette « plafond d'affichage », `rhd-alimentation` et
   * `rhd-activite-physique`). `undefined` quand l'option n'a pas de `priorite` — cas des nœuds en
   * `ordered-first-match`, où le rang n'a aucun sens (D11 : `priorite` y est ignoré).
   *
   * L'écran s'en sert pour DÉPLIER le meilleur rang et REPLIER le reste, jamais pour retirer quoi que ce
   * soit : le contenu de `familles` est identique avec ou sans repli, seule sa présentation change. Le
   * moteur ne connaît pas cette notion — c'est bien une décision d'affichage, et elle doit le rester.
   */
  rang: number | undefined
  /**
   * Contre-indications de cette option AVEC LEUR ÉTAT pour ce patient (T-068, P9 —
   * `engine/evaluateNode.ts` `evaluerContreIndications`). Remplace, pour l'affichage, la lecture directe
   * de `option.contre_indications` : la carte n'a plus à connaître les deux formes de contenu (chaîne
   * historique / objet `{ texte, condition }`), elle reçoit un texte et un état.
   *
   * Calculées ICI et non dans `evaluateNode`, exactement comme `alertes` ci-dessus et pour la même
   * raison : une contre-indication ne retire jamais l'option (c'est le rôle d'`exclusions`, D13), elle ne
   * concerne donc que ce qui est RENDU — une fois par cycle de rendu, jamais par perturbation.
   *
   * JAMAIS FILTRÉES : une contre-indication `levee` reste dans cette liste (elle s'affiche, désamorcée),
   * la retirer ici reproduirait sous une autre forme le défaut que T-068 corrige — R4, une information de
   * sécurité ne disparaît pas en silence.
   */
  contreIndications: ContreIndicationEvaluee[]
}

/** Une section de l'écran : une famille clinique (ou le repli à plat, `libelle: undefined`). */
export interface FamilleVue {
  libelle: string | undefined
  exclusive: boolean | undefined
  /** Groupes d'égalité (`groupesExAequo`) à l'intérieur de cette famille, dans l'ordre d'affichage. */
  groupes: OptionVue[][]
}

/**
 * Une option ÉCARTÉE (R4) : elle était indiquée (ses `conditions` étaient vraies), une `exclusion` l'a
 * retirée. Information de SÉCURITÉ — toujours affichée, discrètement, avec son motif.
 */
export interface OptionEcarteeVue {
  option: Option
  /**
   * Branches SITUATIONNELLES des `exclusions` déclenchées (P13/S4, T-144) : les termes `OR` réellement
   * VRAIS pour CE patient, PAS l'expression `exclusions` complète (`EvaluateNodeResult.excluded`, qui
   * reste la liste littérale des expressions déclenchées, disjonctions comprises). Même traitement que
   * `OptionVue.reasons` (R6, `raisonsSituationnelles` ci-dessous) — MÊME défaut, MÊME correctif, jamais
   * réinventé : `describeReasons` (`lib/conditionText.ts`) recevait auparavant l'expression entière et la
   * rendait telle quelle (« Metformine écarté : Traitements en cours comprend Metformine et DFG ≥ 45 et
   * DFG < 60 et Dose > 2000 ou … ou … »), alors qu'une `exclusions` déclenchée est PAR CONSTRUCTION une
   * disjonction dont au moins une branche est vraie (`engine/evaluateNode.ts` `triggeredExclusions` :
   * `statutUne === true`) — R6, volet rendu du 2026-08-04, `docs/decision/GRAMMAIRE-NOEUD.md`. Jamais
   * vide : chaque expression triée dans `excluded` s'est évaluée `true` (jamais `INDETERMINE`,
   * `classerOption`), elle a donc au moins un terme `OR` vrai, cf. `exclusionsSituationnelles` ci-dessous.
   * Peut porter PLUSIEURS expressions déclenchées à la fois (une option peut violer plusieurs
   * `exclusions` simultanément) — chacune contribue ses propres branches vraies, dans l'ordre.
   */
  motifs: string[]
}

/**
 * Une option NON RETENUE faute de `condition` (R4) : elle n'était pas indiquée pour ce patient.
 * Information d'EXPLICATION — consultée sur demande, jamais poussée à l'écran.
 */
export interface OptionNonRetenueVue {
  option: Option
  /** Première condition non satisfaite (`EvaluateNodeResult.nonRetenues`) — celle qui explique. */
  condition: string
}

/**
 * Une option EN ATTENTE (D20, SPEC-valeur-indeterminee.md §2.4/§2.5) : NI proposée NI écartée — l'une de
 * ses `conditions`/`prerequis`/`exclusions` reste indéterminée. `manquants` = les critères PRIMITIFS à
 * renseigner pour lever l'indétermination (`EvaluateNodeResult.enAttente`), jamais vide.
 */
export interface OptionEnAttenteVue {
  option: Option
  manquants: string[]
}

/** Tout ce que l'écran de décision rend pour un nœud et un jeu de critères donnés. */
export interface VueDecision {
  familles: FamilleVue[]
  alertes: Alerte[]
  /** R4 — options écartées par une exclusion (sécurité, toujours visibles). */
  ecartees: OptionEcarteeVue[]
  /** R4 — options non retenues faute de condition (explication, à la demande). */
  nonRetenues: OptionNonRetenueVue[]
  /** D20 — options en attente faute de critère renseigné (ni proposées, ni écartées, §2.5). */
  enAttente: OptionEnAttenteVue[]
}

/** Doses calculées d'une option (déplacé depuis `OptionCard.tsx`, comportement inchangé) : n'affiche
 * que celles calculables (une primitive non saisie — ex. poids — donne `null`, la ligne est omise ;
 * D20 : idem si un opérande est indéterminé au sens de `renseignes`/`effectifs`, ou si le calcul se
 * heurte à une division par zéro — jamais de `Infinity`/`NaN` affiché, cf. `evaluerNombre`). */
function calculsAffiches(option: Option, criteria: Criteria, effectifs?: ReadonlySet<string>): CalculAffiche[] {
  return (option.calculs ?? [])
    .map((calcul) => ({
      libelle: calcul.libelle,
      valeur: evaluerNombre(calcul.expression, criteria, effectifs),
      unite: calcul.unite,
    }))
    .filter((ligne): ligne is CalculAffiche => ligne.valeur != null)
}

/**
 * Doses NON calculables d'une option, avec les critères à renseigner pour les obtenir (défaut J de la
 * recette référent, 2026-07-27).
 *
 * LE DÉFAUT, ET CE QU'IL N'ÉTAIT PAS. `calculsAffiches` ci-dessus OMET une ligne non calculable — le
 * bon comportement (afficher `NaN` serait pire). Mais la carte apparaissait alors **sans aucune dose**,
 * et rien n'y disait qu'un poids la ferait apparaître : sur `insuline`, « Initier une insuline basale »
 * s'affichait muette, son repli « 10 U le soir » ne vivant que dans la prose d'`effet_attendu`.
 *
 * Le rapport de recette proposait de faire entrer ces critères dans le registre `enAttente` du moteur.
 * VÉRIFIÉ AVANT DE CODER, et c'était inutile : `poids` EST déjà pertinent (la perturbation de
 * `engine/relevance.ts` ajoute le critère à `renseignes` avant de comparer, donc le calcul redevient
 * calculable et la signature change) et il EST déjà réclamé par `decisifsAConfirmer`. Le moteur faisait
 * son travail. Ce qui manquait était le LIEN : le champ était marqué « à confirmer » dans le
 * formulaire, à plusieurs sections de la carte qui, elle, restait silencieuse sur la raison de son
 * silence.
 *
 * D'où un correctif d'AFFICHAGE et non de moteur — plus local, sans toucher à la sémantique de
 * `enAttente` (« ni proposée, ni écartée »), qui ne dit rien de ce cas : l'option EST proposée, c'est sa
 * dose qui manque.
 */
function calculsEnAttente(
  option: Option,
  criteria: Criteria,
  criteresEntree: CritereEntree[],
  effectifs?: ReadonlySet<string>,
): CalculEnAttente[] {
  return (option.calculs ?? [])
    .filter((calcul) => evaluerNombre(calcul.expression, criteria, effectifs) == null)
    .map((calcul) => ({
      libelle: calcul.libelle,
      // Mêmes noms de champ que « à renseigner : … » du bloc EN ATTENTE (D20 §2.5) : le praticien lit
      // partout le même vocabulaire, et jamais un nom de critère dérivé (non saisissable).
      criteresManquants: criteresEntree
        .filter((critere) => critere.derive == null)
        .filter((critere) => new RegExp(`\\b${critere.nom}\\b`).test(calcul.expression))
        .filter((critere) => effectifs == null || !effectifs.has(critere.nom))
        .map((critere) => critere.nom),
    }))
}

/**
 * Une sentinelle moteur (`["default"]` D11, `["toujours"]` D16) N'EST PAS une expression évaluable :
 * `termesVrais`/`evaluateCondition` lèveraient dessus (`ConditionError`, variable de critère inconnue).
 * Même test que `isDefaultOption`/`isToujoursOption` (`engine/evaluateNode.ts`), réécrit ici sur un
 * `string[]` brut plutôt que sur une `Option` — évite d'exporter ces deux prédicats hors du moteur pour
 * un usage aussi ponctuel.
 */
function estSentinelle(conditions: string[]): boolean {
  return conditions.length === 1 && (conditions[0] === 'default' || conditions[0] === 'toujours')
}

/**
 * Justification SITUATIONNELLE d'une option (R6, `docs/decision/GRAMMAIRE-NOEUD.md`) : `option.conditions`
 * porte plusieurs chaînes en ET (`evaluateNode` : `.every(...)`) — on applique `termesVrais` à CHACUNE et
 * on concatène, plutôt que de recopier les règles littéralement (`EvaluateNodeResult.reasons`, qui reste
 * la liste brute des conditions, inchangée — utile ailleurs, ex. `evaluateNode.cible-glycemique.test.ts`).
 * Les sentinelles
 * traversent SANS être évaluées (cf. `estSentinelle`) : `describeReasons` les traite par un cas spécial.
 *
 * PREND EXPLICITEMENT `option.conditions` en paramètre, PAS `option.prerequis` (R6, § arbitrage
 * indication/prérequis, livraison 2) : un `prerequis` est évalué EXACTEMENT comme une condition par le
 * moteur (`engine/evaluateNode.ts`), et serait donc tout aussi « décisif » si on le passait ici — c'est
 * précisément ce que l'arbitrage écarte. Ne JAMAIS élargir cette fonction à `option.prerequis`, même par
 * souci de symétrie avec le moteur : la séparation conditions/prérequis n'a de sens QUE si cette
 * frontière est tenue ici.
 */
function raisonsSituationnelles(conditions: string[], criteria: Criteria): string[] {
  if (estSentinelle(conditions)) return conditions
  return conditions.flatMap((condition) => termesVrais(condition, criteria))
}

/**
 * Branches SITUATIONNELLES d'une ou plusieurs `exclusions` déclenchées (P13/S4, T-144, R6 volet rendu) —
 * MÊME correctif que `raisonsSituationnelles` ci-dessus, appliqué à `EvaluateNodeResult.excluded` plutôt
 * qu'à `reasons` : `motifsDeclenches` porte la ou les expressions `exclusions` COMPLÈTES qui se sont
 * évaluées vraies (`engine/evaluateNode.ts` `triggeredExclusions`), disjonctions comprises — on n'y
 * applique `termesVrais` à CHACUNE et on concatène, plutôt que de recopier les expressions littéralement.
 *
 * PAS DE GARDE `estSentinelle` ICI, contrairement à `raisonsSituationnelles` : une `exclusions` n'est
 * jamais un sentinel `["default"]`/`["toujours"]` (ces jetons n'existent que sur `Option.conditions`) —
 * chaque expression reçue ici est une expression DSL réelle, évaluable par `termesVrais` sans exception à
 * traiter en amont.
 *
 * SÛR SANS `renseignes`, pour la MÊME raison que `raisonsSituationnelles` : `termesVrais` n'accepte pas
 * cet argument et présume tout renseigné, mais `classerOption` (`engine/evaluateNode.ts`) ne range une
 * option dans `excluded` QUE lorsque `statutUne(exclusions, …)` a tranché STRICTEMENT `true` (jamais
 * `INDETERMINE`, D20) — la même garantie qui couvre déjà `reasons` pour les options `applicable` couvre
 * ici `excluded`, appliquée au même évaluateur du moteur.
 */
function exclusionsSituationnelles(motifsDeclenches: string[], criteria: Criteria): string[] {
  return motifsDeclenches.flatMap((motif) => termesVrais(motif, criteria))
}

/**
 * Termes `OR` réellement vrais du `quand` d'une règle de `priorite` CONDITIONNELLE retenue (P10/S1,
 * même correctif que `raisonsSituationnelles` ci-dessus, appliqué à `EvaluateNodeResult.rangMotifs`).
 * `quand` n'est JAMAIS une sentinelle (`resolvePriorite` ne renseigne `motif` que pour une règle réelle,
 * `"default"` en est explicitement exclu) : pas de garde `estSentinelle` à faire ici, contrairement à
 * `raisonsSituationnelles`.
 */
function motifRangSituationnel(motif: string | undefined, criteria: Criteria): string[] | undefined {
  if (motif === undefined) return undefined
  return termesVrais(motif, criteria)
}

/**
 * Une expression est-elle un TEST DE PÉRIMÈTRE — « ce patient prend-il déjà telle classe ? » — plutôt
 * qu'une indication clinique ? Vrai quand TOUS ses termes `OR` sont des tests d'appartenance
 * (`contient` / `ne_contient_pas`) sur un critère de type `liste`.
 *
 * GÉNÉRIQUE PAR LE TYPE (invariant CLAUDE.md 5) : aucun nom de critère ni de classe en dur. C'est le
 * `type: liste` déclaré par le contenu qui décide, pas une liste de noms tenue à jour à la main.
 */
function estTestDePerimetre(expression: string, listes: ReadonlySet<string>): boolean {
  const termes = expression.split(/\s+OR\s+/).flatMap((t) => t.split(/\s+AND\s+/))
  if (termes.length === 0) return false
  return termes.every((terme) => {
    const m = /^\s*(\w+)\s+(contient|ne_contient_pas)\s+/.exec(terme)
    return m != null && listes.has(m[1])
  })
}

/**
 * Le « pourquoi pas d'autres options », NETTOYÉ de ses constats de périmètre (défaut I de la recette
 * navigateur du 2026-07-27).
 *
 * LE DÉFAUT, MESURÉ. Sur `prescription`, un patient voyait **18,7 lignes en moyenne**, dont 60 % de la
 * forme « Traitements en cours comprend Sulfamide / Gliptine / Insuline… » — chez quelqu'un qui n'en
 * prend aucun. Ce n'est pas une explication clinique : c'est un constat de périmètre. Les cinq autres
 * nœuds n'en produisent aucune (0 %), ce qui confirme que le défaut tient à une forme d'écriture et non
 * au mécanisme.
 *
 * DEUX TRAITEMENTS, dans cet ordre, et le premier compte autant que le second :
 *  1. si l'option a une AUTRE condition fausse qui n'est pas un test de périmètre, c'est celle-là qu'on
 *     montre. Le moteur retient la PREMIÈRE expression fausse (R4) ; ce n'est pas forcément la plus
 *     parlante. On ne supprime donc pas une ligne, on l'améliore ;
 *  2. si toutes les conditions fausses sont des tests de périmètre, la ligne est RETIRÉE : l'option est
 *     hors sujet pour ce patient, et le dire n'apprend rien.
 *
 * POURQUOI ICI ET NON DANS LE MOTEUR. `EvaluateNodeResult.nonRetenues` reste EXHAUSTIF — R4 veut que
 * toute option non retenue ait un motif enregistré, et des vignettes référent en dépendent
 * explicitement (y compris pour les `prerequis` faux). C'est une décision d'AFFICHAGE : le moteur dit
 * pourquoi, la vue décide de ce qui mérite d'être lu. La même frontière que `reasons` situationnelles.
 */
function nettoyerNonRetenues(
  node: Noeud,
  nonRetenues: ReadonlyMap<Option, string>,
  criteria: Criteria,
): OptionNonRetenueVue[] {
  const listes = new Set(node.criteres_entree.filter((c) => c.type === 'liste').map((c) => c.nom))
  const vues: OptionNonRetenueVue[] = []
  for (const [option, condition] of nonRetenues) {
    if (!estTestDePerimetre(condition, listes)) {
      vues.push({ option, condition })
      continue
    }
    // (1) chercher une condition fausse plus parlante — jamais dans `prerequis` (R6 : un garde-fou de
    // cohérence n'est pas une justification montrable).
    const meilleure = option.conditions.find(
      (c) => c !== 'default' && c !== 'toujours' && !estTestDePerimetre(c, listes) && evaluateCondition(c, criteria) === false,
    )
    // (2) sinon, retirer la ligne.
    if (meilleure != null) vues.push({ option, condition: meilleure })
  }
  return vues
}

/**
 * Résout le badge d'action EFFECTIVEMENT affiché pour ce patient (`Option.action_si`, 2026-08-04,
 * demande utilisateur) — même sémantique que `resolvePriorite`/`estHissee` (`engine/evaluateNode.ts`)
 * pour leurs propres règles conditionnelles : PREMIÈRE règle dont `quand` s'évalue STRICTEMENT VRAIE
 * (`=== true`, jamais `INDETERMINE` — D20, une donnée manquante ne fait jamais basculer l'affichage)
 * l'emporte. Repli sur `option.action` (statique) si `action_si` est absent OU si aucune règle ne
 * matche — c'est ce qui rend ce champ un pur AJOUT : une option qui ne le déclare pas garde exactement
 * le rendu d'avant ce champ.
 */
function resoudreActionEffective(
  option: Option,
  criteria: Criteria,
  effectifs: ReadonlySet<string> | undefined,
): ActionOption | undefined {
  if (option.action_si) {
    for (const regle of option.action_si) {
      if (evaluateCondition(regle.quand, criteria, effectifs) === true) return regle.action
    }
  }
  return option.action
}

/**
 * Construit le modèle de vue complet d'un nœud pour un jeu de critères. Recalcule les critères
 * dérivés en entrée (`calculerCriteresDerives`) avant d'évaluer le nœud — comme le faisait
 * `relevance.ts` — puis regroupe par famille (`groupesParFamille`) et calcule les badges
 * (`computeBadges`), exactement le pipeline que suivait `DecisionNodeScreen.tsx`.
 *
 * Les doses calculées (`OptionVue.calculs`) sont évaluées depuis `criteria` TEL QUE REÇU (pas les
 * dérivés) : c'est le comportement historique de `OptionCard.tsx`, conservé à l'identique — les
 * expressions de `Option.calculs` (ex. `poids * 0.1`) portent sur des primitives saisies, jamais sur
 * un critère dérivé.
 *
 * `OptionVue.reasons` (R6) est calculé ICI, PAS dans `evaluateNode` : ce dernier tourne des centaines de
 * fois par frappe via la boucle de perturbation (`engine/relevance.ts`), et une justification
 * situationnelle n'est utile que pour ce qui est RENDU une fois par cycle de rendu React. `motifRang`
 * (R6 couche 2) est en revanche un sous-produit GRATUIT déjà calculé par `evaluateNode`
 * (`EvaluateNodeResult.rangMotifs`) — cette fonction ne fait que décider SI on le montre : seulement
 * pour une famille dont `groupesParFamille` a produit AU MOINS DEUX groupes d'égalité (une vraie
 * concurrence de rang), sinon « pourquoi celle-ci d'abord » n'a pas de réponse à donner (R6).
 */
export function construireVueDecision(node: Noeud, criteria: Criteria, renseignes?: ReadonlySet<string>): VueDecision {
  const derived = calculerCriteresDerives(node.criteres_entree, criteria)
  const { applicable, alertes, rangs, rangMotifs, excluded, nonRetenues, enAttente } = evaluateNode(
    node,
    derived,
    renseignes,
  )
  // Ensemble EFFECTIF recalculé ICI (D20) : `evaluateNode` fait le même calcul pour SES propres besoins,
  // mais ne l'expose pas (coût par perturbation, cf. docstring de tête) — `calculsAffiches`/les alertes
  // d'option en ont besoin À NOUVEAU, une seule fois par cycle de rendu, comme `reasons` ci-dessous.
  const effectifs = determinesEffectifs(node.criteres_entree, derived, renseignes)
  // `criteria`/`effectifs` transmis pour que `groupesParFamille` puisse évaluer un éventuel
  // `Famille.prioritaire_si` (arbitrage référent A3, 2026-08-01) — `derived` (pas `criteria` brut), même
  // source que `evaluateNode` ci-dessus, pour que l'expression de hissage lise les mêmes valeurs que les
  // `conditions` d'option.
  const famillesBrutes = groupesParFamille(node, applicable, rangs, derived, effectifs)
  const badges = computeBadges(famillesBrutes)

  const familles: FamilleVue[] = famillesBrutes.map((famille) => {
    const motifRangPertinent = famille.groupes.length >= 2
    return {
      libelle: famille.libelle,
      exclusive: famille.exclusive,
      groupes: famille.groupes.map((groupe) =>
        groupe.map(
          (option): OptionVue => ({
            option,
            badge: badges.get(option) ?? null,
            actionEffective: resoudreActionEffective(option, derived, effectifs),
            reasons: raisonsSituationnelles(option.conditions, derived),
            calculs: calculsAffiches(option, criteria, effectifs),
            calculsEnAttente: calculsEnAttente(option, criteria, node.criteres_entree, effectifs),
            motifRang: motifRangPertinent ? motifRangSituationnel(rangMotifs.get(option), derived) : undefined,
            alertes: evaluateAlertesDeListe(option.alertes, derived, effectifs),
            rang: rangs.get(option),
            // T-068 : mêmes critères DÉRIVÉS et même ensemble EFFECTIF que les alertes d'option
            // ci-dessus — une `condition` de contre-indication est une expression du même DSL, lue par
            // le même évaluateur, elle doit donc voir exactement les mêmes valeurs.
            contreIndications: evaluerContreIndications(option.contre_indications, derived, effectifs),
          }),
        ),
      ),
    }
  })

  // R4 : ordre de `EvaluateNodeResult.excluded`/`nonRetenues`, lui-même l'ordre d'itération de
  // `node.options` dans `evaluateNode` (les deux Map sont peuplées dans cet ordre) — déterministe,
  // stable d'un appel à l'autre pour un même contenu.
  // T-144 : `motifs` porte désormais les branches SITUATIONNELLES (`exclusionsSituationnelles`), pas les
  // expressions `exclusions` littérales — même traitement que `reasons` ci-dessus (R6).
  const ecartees: OptionEcarteeVue[] = [...excluded].map(([option, motifsDeclenches]) => ({
    option,
    motifs: exclusionsSituationnelles(motifsDeclenches, derived),
  }))
  const nonRetenuesVue = nettoyerNonRetenues(node, nonRetenues, derived)
  // D20 : même ordre déterministe que ci-dessus (ordre d'itération de `node.options` dans `evaluateNode`).
  const enAttenteVue: OptionEnAttenteVue[] = [...enAttente].map(([option, manquants]) => ({ option, manquants }))

  return { familles, alertes, ecartees, nonRetenues: nonRetenuesVue, enAttente: enAttenteVue }
}

/**
 * Sérialisation d'une option de vue : identité (intitulé — même convention que l'ancienne
 * `signature()` et que la clé React de l'écran ; `Option` n'est pas garanti unique mais suffisant en
 * pratique, cf. docstring `EvaluateNodeResult` dans `engine/evaluateNode.ts`), badge, raisons, doses et
 * motif de rang (R6 couche 2 — DIMENSION AFFICHÉE depuis ce travail, donc soumise au même invariant de
 * totalité que les autres : un critère qui ne change QUE le motif de rang doit rester décisif pour
 * `engine/relevance.ts`, cf. `vueDecision.test.ts`). Concaténation manuelle plutôt que `JSON.stringify` :
 * `engine/relevance.ts` appelle cette fonction par PERTURBATION (une reconstruction complète de la vue
 * par valeur candidate de chaque critère saisissable, cf. `criteresPertinents`) — sur le banc
 * `prescription` (~1800 profils × ~25 critères × plusieurs candidats), ça représente des centaines de
 * milliers d'appels ; `JSON.stringify` mesurait ~6 % plus lent que cette forme sur ce banc (30,2 s vs
 * 28,6 s, chronométré 2026-07-25), au point de faire dépasser le budget de 30 s du test R5
 * (`banc/couverture.test.ts`). Les séparateurs (`|`, `§`, `«`…) sont choisis sans autre propriété que de
 * ne pas apparaître dans le contenu clinique réel.
 *
 * `alertes` (addendum alertes d'option, `docs/decision/GRAMMAIRE-NOEUD.md`) entre dans cette
 * sérialisation au même titre que les autres dimensions : c'est ce qui garantit qu'un critère qui ne
 * change QUE l'alerte d'une option (aucune autre dimension affichée ne bouge) reste vu DÉCISIF par
 * `engine/relevance.ts` — exactement le piège que l'unification écran/signature a fermé pour les autres
 * dimensions (cf. docstring de tête de ce fichier).
 *
 * `calculsEnAttente` (T-059, P8 · S3, 2026-07-30) — MÊME totalité, corrigeant un oubli symétrique de
 * `calculs` : deux jeux de critères où un calcul reste également IMPOSSIBLE dans les deux cas (`calculs`
 * inchangé, vide) peuvent pourtant réclamer des critères MANQUANTS différents (ex. une dose = basale +
 * rapide, un seul des deux champs renseigné selon le jeu) — c'était jusqu'ici invisible à la signature,
 * donc à `engine/relevance.ts` : le champ manquant restant se voyait à tort « sans effet sur la reco »
 * (mesuré en recette, N11, § « Défaut net » — `docs/decision/validation/
 * recette-praticien-naif-2026-07-30.md`). `criteresManquants` est sérialisé tel quel : son ORDRE est
 * déterministe pour un même contenu (`calculsEnAttente` ci-dessus le construit par un filtrage successif
 * de `node.criteres_entree`, un tableau figé à l'ordre de déclaration YAML — jamais un `Set` dont l'ordre
 * d'itération dépendrait de l'historique d'insertion), condition nécessaire pour ne pas faire clignoter
 * l'estompage du formulaire à signature équivalente.
 */
function serialiseOption(ov: OptionVue): string {
  const reasons = ov.reasons.join('&')
  const calculs = ov.calculs.map((c) => `${c.libelle}=${c.valeur}${c.unite ?? ''}`).join('&')
  const calculsEnAttente = ov.calculsEnAttente.map((c) => `${c.libelle}:${c.criteresManquants.join(',')}`).join('&')
  const alertes = ov.alertes.map((a) => `${a.message}~${a.niveau ?? ''}`).join('|')
  const motifRang = (ov.motifRang ?? []).join('&')
  return `${ov.option.intitule}@${ov.badge ?? ''}«${reasons}»[${calculs}]{${calculsEnAttente}}¦${motifRang}‖${alertes}${serialiseContreIndications(ov.contreIndications)}`
}

/**
 * Contre-indications NON `active` d'une option (T-068, P9), pour `serialiseOption` ci-dessus — MÊME
 * totalité que les autres dimensions affichées : un critère qui ne change QUE l'état d'une
 * contre-indication (une CI qui se désamorce, ou qui cesse de l'être) doit rester DÉCISIF pour
 * `engine/relevance.ts`, faute de quoi le champ qui la commande serait estompé à tort comme « sans effet
 * sur la reco » — le défaut récurrent que la docstring de tête de ce fichier décrit.
 *
 * SEGMENT OMIS QUAND TOUTES LES CI SONT `active` (le cas de 100 % du contenu au jour de T-068 : aucun
 * nœud ne déclare encore de `condition`). Ce n'est pas une optimisation, c'est ce qui rend la dimension
 * additive SANS toucher au golden master de caractérisation (`engine/banc/__snapshots__/`, qui liste des
 * `signatureVue` complètes profil par profil) : sur un contenu sans `condition`, la signature reste BYTE À
 * BYTE celle d'avant ce champ. La totalité n'en souffre pas — l'ensemble des contre-indications d'une
 * option est FIXE (seul leur état varie avec les critères), donc « segment vide » y désigne sans ambiguïté
 * l'état « toutes actives », et deux vues qui diffèrent par un état produisent bien deux chaînes
 * différentes. Le jour où une CI conditionnelle est encodée (S3-S6), le segment apparaît et le diff de
 * snapshot est alors le signal ATTENDU, pas un dommage collatéral.
 */
function serialiseContreIndications(contreIndications: ContreIndicationEvaluee[]): string {
  const nonActives = contreIndications.filter((ci) => ci.etat !== 'active')
  if (nonActives.length === 0) return ''
  return `‡${nonActives.map((ci) => `${ci.texte}=${ci.etat}`).join('&')}`
}

function serialiseFamille(famille: FamilleVue): string {
  return `${famille.libelle ?? ''}¤${famille.exclusive ?? ''}::${famille.groupes
    .map((groupe) => groupe.map(serialiseOption).join(','))
    .join('|')}`
}

/** Sérialisation d'une option écartée (R4) : identité + TOUS les motifs d'exclusion déclenchés. */
function serialiseEcartee(ecartee: OptionEcarteeVue): string {
  return `${ecartee.option.intitule}«${ecartee.motifs.join('&')}»`
}

/** Sérialisation d'une option non retenue (R4) : identité + la condition fautive retenue. */
function serialiseNonRetenue(nonRetenue: OptionNonRetenueVue): string {
  return `${nonRetenue.option.intitule}«${nonRetenue.condition}»`
}

/** Sérialisation d'une option en attente (D20) : identité + TOUS les critères manquants (ordre stable,
 * cf. `criteresManquants`/`primitivesReferencees`, `engine/evaluateNode.ts` — construits sur un `Set`
 * puis `node.criteres_entree`, donc déterministes pour un même contenu). */
function serialiseEnAttente(enAttente: OptionEnAttenteVue): string {
  return `${enAttente.option.intitule}«${enAttente.manquants.join('&')}»`
}

/**
 * Sérialise une `VueDecision` en chaîne STABLE et TOTALE : deux vues égales produisent la même
 * chaîne, et RIEN du modèle de vue n'est omis (familles, groupes d'égalité, badges, raisons, doses
 * calculées ET doses EN ATTENTE — `calculsEnAttente`, T-059 — alertes, ÉTAT DES CONTRE-INDICATIONS —
 * T-068, cf. `serialiseContreIndications` — options écartées, non retenues et EN ATTENTE — R4/D20) —
 * c'est cette totalité qui garantit qu'aucun critère décisif à l'écran ne peut plus être estompé à tort
 * par `engine/relevance.ts`.
 */
export function signatureVue(vue: VueDecision): string {
  const familles = vue.familles.map(serialiseFamille).join('§§')
  const alertes = vue.alertes.map((a) => `${a.message}~${a.niveau ?? ''}`).join('|')
  const ecartees = vue.ecartees.map(serialiseEcartee).join('|')
  const nonRetenues = vue.nonRetenues.map(serialiseNonRetenue).join('|')
  const enAttente = vue.enAttente.map(serialiseEnAttente).join('|')
  return `${familles}##${alertes}##${ecartees}##${nonRetenues}##${enAttente}`
}
