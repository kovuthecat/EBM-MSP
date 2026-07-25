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
 * ⚠️ Périmètre volontairement borné à ce que l'écran rend AUJOURD'HUI : `excluded` (options écartées,
 * calculé par `evaluateNode` mais non encore affiché) n'entre PAS dans `VueDecision`. L'y mettre
 * maintenant recréerait le défaut symétrique — une signature qui contient ce que l'écran ne montre
 * pas encore, donc des critères déclarés décisifs sans rien changer de visible. `excluded` entrera
 * dans la vue et dans l'écran au même moment, dans une tâche ultérieure.
 */
import type { Alerte, Noeud, Option } from '../content/node.types.ts'
import type { Criteria } from '../engine/conditions.ts'
import { calculerCriteresDerives, evaluerNombre } from '../engine/deriveCritere.ts'
import { evaluateNode, groupesParFamille } from '../engine/evaluateNode.ts'
import { computeBadges, type OptionBadge } from './optionBadges.ts'

/** Une dose/valeur calculée déjà évaluée, prête à l'affichage (câblage P3, `Option.calculs`). */
export interface CalculAffiche {
  libelle: string
  valeur: number
  unite: string | undefined
}

/** Une option applicable, avec tout ce que sa carte (`OptionCard.tsx`) a besoin de rendre. */
export interface OptionVue {
  option: Option
  badge: OptionBadge
  /** Conditions satisfaites (le « pourquoi cette option », `EvaluateNodeResult.reasons`). */
  reasons: string[]
  /** Doses calculées déjà évaluées ; ne contient que celles calculables (cf. `evaluerNombre`). */
  calculs: CalculAffiche[]
}

/** Une section de l'écran : une famille clinique (ou le repli à plat, `libelle: undefined`). */
export interface FamilleVue {
  libelle: string | undefined
  exclusive: boolean | undefined
  /** Groupes d'égalité (`groupesExAequo`) à l'intérieur de cette famille, dans l'ordre d'affichage. */
  groupes: OptionVue[][]
}

/** Tout ce que l'écran de décision rend pour un nœud et un jeu de critères donnés. */
export interface VueDecision {
  familles: FamilleVue[]
  alertes: Alerte[]
}

/** Doses calculées d'une option (déplacé depuis `OptionCard.tsx`, comportement inchangé) : n'affiche
 * que celles calculables (une primitive non saisie — ex. poids — donne `null`, la ligne est omise). */
function calculsAffiches(option: Option, criteria: Criteria): CalculAffiche[] {
  return (option.calculs ?? [])
    .map((calcul) => ({
      libelle: calcul.libelle,
      valeur: evaluerNombre(calcul.expression, criteria),
      unite: calcul.unite,
    }))
    .filter((ligne): ligne is CalculAffiche => ligne.valeur != null)
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
 */
export function construireVueDecision(node: Noeud, criteria: Criteria): VueDecision {
  const derived = calculerCriteresDerives(node.criteres_entree, criteria)
  const { applicable, reasons, alertes, rangs } = evaluateNode(node, derived)
  const famillesBrutes = groupesParFamille(node, applicable, rangs)
  const badges = computeBadges(famillesBrutes)

  const familles: FamilleVue[] = famillesBrutes.map((famille) => ({
    libelle: famille.libelle,
    exclusive: famille.exclusive,
    groupes: famille.groupes.map((groupe) =>
      groupe.map(
        (option): OptionVue => ({
          option,
          badge: badges.get(option) ?? null,
          reasons: reasons.get(option) ?? [],
          calculs: calculsAffiches(option, criteria),
        }),
      ),
    ),
  }))

  return { familles, alertes }
}

/**
 * Sérialisation d'une option de vue : identité (intitulé — même convention que l'ancienne
 * `signature()` et que la clé React de l'écran ; `Option` n'est pas garanti unique mais suffisant en
 * pratique, cf. docstring `EvaluateNodeResult` dans `engine/evaluateNode.ts`), badge, raisons et doses.
 * Concaténation manuelle plutôt que `JSON.stringify` : `engine/relevance.ts` appelle cette fonction
 * par PERTURBATION (une reconstruction complète de la vue par valeur candidate de chaque critère
 * saisissable, cf. `criteresPertinents`) — sur le banc `prescription` (~1800 profils × ~25 critères ×
 * plusieurs candidats), ça représente des centaines de milliers d'appels ; `JSON.stringify` mesurait
 * ~6 % plus lent que cette forme sur ce banc (30,2 s vs 28,6 s, chronométré 2026-07-25), au point de
 * faire dépasser le budget de 30 s du test R5 (`banc/couverture.test.ts`). Les séparateurs (`|`, `§`,
 * `«`…) sont choisis sans autre propriété que de ne pas apparaître dans le contenu clinique réel.
 */
function serialiseOption(ov: OptionVue): string {
  const reasons = ov.reasons.join('&')
  const calculs = ov.calculs.map((c) => `${c.libelle}=${c.valeur}${c.unite ?? ''}`).join('&')
  return `${ov.option.intitule}@${ov.badge ?? ''}«${reasons}»[${calculs}]`
}

function serialiseFamille(famille: FamilleVue): string {
  return `${famille.libelle ?? ''}¤${famille.exclusive ?? ''}::${famille.groupes
    .map((groupe) => groupe.map(serialiseOption).join(','))
    .join('|')}`
}

/**
 * Sérialise une `VueDecision` en chaîne STABLE et TOTALE : deux vues égales produisent la même
 * chaîne, et RIEN du modèle de vue n'est omis (familles, groupes d'égalité, badges, raisons, doses
 * calculées, alertes) — c'est cette totalité qui garantit qu'aucun critère décisif à l'écran ne peut
 * plus être estompé à tort par `engine/relevance.ts`.
 */
export function signatureVue(vue: VueDecision): string {
  const familles = vue.familles.map(serialiseFamille).join('§§')
  const alertes = vue.alertes.map((a) => `${a.message}~${a.niveau ?? ''}`).join('|')
  return `${familles}##${alertes}`
}
