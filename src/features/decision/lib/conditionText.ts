/**
 * Met en forme lisible les chaînes `conditions` satisfaites, renvoyées par le moteur
 * (`evaluateNode(...).reasons`), pour la ligne « Pourquoi cette option » (ARCHITECTURE.md D3 ;
 * S4.md T-006 "Décision clé" : « le pourquoi vient des conditions satisfaites renvoyées par le
 * moteur »). Reformate le texte des règles réellement évaluées par `evaluateNode` — ne réévalue
 * rien, n'invente aucune règle : traduction variable/valeur/opérateur → libellés (`lib/labels.ts`),
 * `AND`/`OR` → « et »/« ou ». Transparence brief §7 (« aucun score caché ») : on montre la règle
 * exacte, pas une paraphrase qui pourrait s'en écarter.
 *
 * Tokenisation volontairement minimale et locale à l'affichage : ne réutilise pas
 * `engine/conditions.ts` (S4 ne modifie/n'importe pas le moteur S3 pour cet usage de présentation) ;
 * couvre exactement les formes acceptées par le moteur (brief §11, cf. commentaires de
 * `conditions.ts`) : `variable OP valeur`, composé par `AND`/`OR`, pas de parenthèses.
 *
 * DEUX AJOUTS DE P10/S2 (T-079), tous deux purement d'affichage :
 *  - `Option.motifs` — une branche peut porter un MOTIF RÉDIGÉ par le contenu, qui remplace alors sa
 *    traduction mécanique. Le repli reste la branche humanisée : le contenu qui n'en déclare pas (100 %
 *    au jour de T-079) est rendu exactement comme avant ;
 *  - `describeNonApplicable` — les options NON RETENUES ne sont plus décrites par une liste positive de
 *    cas (« A ou B ou C ») qu'une lecture naïve prend pour une affirmation sur le patient, mais par une
 *    énumération NÉGATIVE (« ne s'applique pas : ni A, ni B, ni C »). Ces branches-là sont TOUTES fausses
 *    (le moteur ne retient qu'une expression échouée, cf. `EvaluateNodeResult.nonRetenues`) : le filtrage
 *    par branche vraie de P10/S1 n'y a aucun sens et n'y est pas appliqué.
 */
import { labelForCritere, labelForEnumValue } from './labels'

const ATOMIC_RE = /^(\w+)\s*(==|!=|<=|>=|<|>)\s*(.+)$/
/**
 * Appartenance à une liste — forme du moteur (`conditions.ts`, `deriveCritere.ts`) que `ATOMIC_RE` ne
 * reconnaît PAS, faute d'opérateur de comparaison. Sans elle, `humanizeAtomic` retombait sur son repli
 * « renvoyer la chaîne telle quelle » et affichait un JETON DU DSL au clinicien
 * (« traitements_en_cours ne_contient_pas gliptine »). Même classe de défaut que le sentinel `toujours`
 * attrapé en vérification red-team de D16 — jamais recherchée ailleurs qu'à l'endroit où elle avait mordu.
 */
const MEMBERSHIP_RE = /^(\w+)\s+(contient|ne_contient_pas)\s+(.+)$/

const OPERATOR_LABELS: Record<string, string> = {
  '==': '=',
  '!=': '≠',
  '<=': '≤',
  '>=': '≥',
  '<': '<',
  '>': '>',
}

function humanizeAtomic(text: string): string {
  const trimmed = text.trim()

  const membership = MEMBERSHIP_RE.exec(trimmed)
  if (membership) {
    const [, variable, operator, rawValue] = membership
    const verbe = operator === 'contient' ? 'comprend' : 'ne comprend pas'
    return `${labelForCritere(variable)} ${verbe} ${labelForEnumValue(rawValue.trim())}`
  }

  const match = ATOMIC_RE.exec(trimmed)
  if (!match) return trimmed
  const [, variable, operator, rawValue] = match
  const value = rawValue.trim()

  // Booléen : « ASCVD établie = Oui » se lit comme une case de formulaire, pas comme une raison
  // clinique. Le libellé seul porte l'affirmation, « : non » la négation — tournure sûre quel que soit
  // le libellé, là où « pas de <libellé> » produirait des fautes de genre et de nombre.
  if (operator === '==' && value === 'true') return labelForCritere(variable)
  if (operator === '==' && value === 'false') return `${labelForCritere(variable)} : non`

  const operatorLabel = OPERATOR_LABELS[operator] ?? operator
  const valueLabel = value === 'true' ? 'Oui' : value === 'false' ? 'Non' : labelForEnumValue(value)
  return `${labelForCritere(variable)} ${operatorLabel} ${valueLabel}`
}

function humanizeAndTerm(term: string): string {
  return term
    .split(/\s+AND\s+/)
    .map((atomic) => humanizeAtomic(atomic))
    .join(' et ')
}

/**
 * Motifs rédigés d'une option (`Option.motifs`, P10/S2), indexés par le TEXTE EXACT d'une branche `OR`
 * de ses `conditions`/`prerequis`. Type local à l'affichage — c'est ici, et nulle part ailleurs, que
 * cette carte est consommée.
 */
export type MotifsRediges = Readonly<Record<string, string>>

/** Termes `OR` d'une expression — MÊME découpage que `engine/conditions.ts` `splitTopLevel` (le DSL n'a
 * pas de parenthèses, `AND` est prioritaire) ; c'est ce qui rend l'indexation par texte de branche fiable
 * des deux côtés. Les bords sont rognés, comme le fait le moteur avant d'évaluer. */
function branches(expression: string): string[] {
  return expression.split(/\s+OR\s+/).map((terme) => terme.trim())
}

/**
 * Index des motifs par branche NORMALISÉE (espaces de bord rognés des deux côtés — clé du contenu comme
 * branche de l'expression). C'est LA MÊME normalisation que celle de l'invariant I24
 * (`engine/banc/invariants-contenu.test.ts`), et elles doivent le rester : une clé qu'I24 accepte doit
 * être une clé que cette table retrouve, sinon le garde-fou déclarerait bon un motif que l'écran
 * n'afficherait jamais — exactement le silence qu'il existe pour empêcher.
 *
 * Aucune autre tolérance : un espace INTERNE en trop (`age  >=  75`) est une autre chaîne, refusée par
 * I24 plutôt que devinée ici. Deviner ouvrirait la porte à un second tokenizer, dont la divergence avec
 * le moteur serait la prochaine famille de défauts (cf. docstring de `engine/expressionsNoeud.ts`).
 */
function indexerMotifs(motifs?: MotifsRediges): Map<string, string> {
  const index = new Map<string, string>()
  for (const [cle, motif] of Object.entries(motifs ?? {})) index.set(cle.trim(), motif)
  return index
}

/** Une branche telle qu'elle s'affiche : son motif rédigé si le contenu en déclare un, sinon sa
 * traduction mécanique. */
function texteDeBranche(branche: string, index: Map<string, string>): string {
  return index.get(branche) ?? humanizeAndTerm(branche)
}

function humanizeExpression(expression: string, index: Map<string, string>): string {
  return branches(expression)
    .map((orTerm) => texteDeBranche(orTerm, index))
    .join(' ou ')
}

/**
 * Initiale en minuscule — pour insérer un libellé au MILIEU d'une phrase (« ne s'applique pas : ni
 * maladie cardiovasculaire établie… ») sans y laisser des capitales de début de ligne.
 *
 * NE TOUCHE PAS AUX SIGLES ni aux casses internes (`IMC`, `DFG`, `HbA1c`) : un libellé dont le premier
 * mot porte une majuscule ailleurs qu'en tête est rendu tel quel. Générique — la règle porte sur la
 * CASSE, jamais sur une liste de mots connus (aucun nom de critère ici, CLAUDE.md invariant 5).
 *
 * N'est JAMAIS appliqué à un motif rédigé : la prose d'auteur se rend telle qu'elle est écrite.
 */
function initialeEnMinuscule(texte: string): string {
  const premierMot = texte.split(' ')[0] ?? ''
  if (/\p{Lu}/u.test(premierMot.slice(1))) return texte
  return texte.charAt(0).toLocaleLowerCase('fr-FR') + texte.slice(1)
}

/**
 * `reasons` = les chaînes de `Option.conditions` satisfaites par les critères courants (identiques,
 * par référence de contenu, à ce que `evaluateNode` a évalué). Les éléments du tableau sont en ET
 * logique (`evaluateNode` : `option.conditions.every(...)`). Cas spéciaux `['default']` (repli) et
 * `['toujours']` (socle systématiquement applicable, D16) : message explicite plutôt que d'afficher
 * littéralement le sentinel moteur — sinon une carte affiche « Pourquoi cette option : toujours »,
 * un jeton interne présenté au clinicien (trouvé par vérification red-team de D16).
 *
 * `motifs` (P10/S2, optionnel) : la carte `Option.motifs` de l'option rendue. Depuis P10/S1, chaque
 * élément de `reasons` est une branche RÉELLEMENT VRAIE pour ce patient (`lib/vueDecision.ts`
 * `raisonsSituationnelles`/`motifRangSituationnel`) — un motif écrit pour une branche FAUSSE n'est donc
 * jamais cherché, encore moins affiché, sans avoir à le filtrer ici. Les sentinelles gardent leurs
 * messages : elles ne sont pas des branches, aucune clé de `motifs` ne peut les désigner (I24) —
 * SAUF `default` (extension post-S5) : la carte de repli peut porter un motif rédigé sous cette clé
 * réservée, pour dire *pourquoi ce patient-ci* plutôt que la phrase générique de moteur (repli
 * `cible-glycemique` cité en recette comme « une phrase de moteur, pas de médecin »). `toujours`, lui,
 * n'a pas cette échappatoire : le socle systématique n'a par construction rien de patient-spécifique à
 * motiver.
 */
export function describeReasons(reasons: string[], motifs?: MotifsRediges): string {
  if (reasons.length === 1 && reasons[0] === 'default') {
    return (
      motifs?.['default'] ??
      "Option par défaut : retenue en l'absence de toute autre option plus spécifique applicable."
    )
  }
  if (reasons.length === 1 && reasons[0] === 'toujours') {
    return 'Socle maintenu par la recommandation officielle, quelles que soient les comorbidités.'
  }
  const index = indexerMotifs(motifs)
  return reasons.map((reason) => humanizeExpression(reason, index)).join(' et ')
}

/**
 * POURQUOI CETTE OPTION N'EST PAS LÀ (R4, « non retenue faute de condition ») — `condition` est la seule
 * expression échouée que le moteur retient (`EvaluateNodeResult.nonRetenues`), donc une expression dont
 * TOUTES les branches sont fausses pour ce patient.
 *
 * LE DÉFAUT CORRIGÉ (P10/S2). L'écran passait cette expression à `describeReasons`, qui la rendait comme
 * n'importe quelle raison : « Maladie cardiovasculaire établie ou IMC ≥ 30 ou … et HbA1c à la cible :
 * non ». Une liste POSITIVE de cas, terminée par un « : non » qui arrive six lignes plus loin — elle se
 * lit comme une affirmation sur le patient avant de se faire nier. Énumérer ces branches reste honnête
 * (c'est la règle exacte, transparence D3) ; c'est la POLARITÉ de la phrase qui était fausse.
 *
 * D'où l'énumération négative, qui porte la négation en tête et la répète à chaque item. Deux formes,
 * pour une raison de langue et non de style : « ni » n'existe pas au singulier en français — une
 * condition à branche unique se dit donc au conditionnel (« il faudrait … »), qui la donne à lire comme
 * ce qui MANQUE et non comme un fait.
 *
 * Les motifs rédigés (`Option.motifs`) sont consommés ici comme partout ailleurs ; ce sont les branches
 * illisibles de ce panneau qui les justifient en premier.
 */
export function describeNonApplicable(condition: string, motifs?: MotifsRediges): string {
  const index = indexerMotifs(motifs)
  const cas = branches(condition).map((branche) => {
    // La prose d'auteur n'est jamais retouchée ; seule la traduction mécanique est mise en bas de casse
    // pour s'insérer au milieu de la phrase.
    return index.get(branche) ?? initialeEnMinuscule(humanizeAndTerm(branche))
  })
  if (cas.length === 1) return `ne s'applique pas : il faudrait ${cas[0]}`
  return `ne s'applique pas : ni ${cas.join(', ni ')}`
}
