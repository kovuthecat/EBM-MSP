import { useEffect, useId, useState } from 'react'
import { Icon } from '../../shared/icons/Icon'
import { EvidenceBadge } from '../../shared/badges/EvidenceBadge'
import { PastilleInfo } from '../../shared/ui/PastilleInfo'
import type { ActionOption, Alerte, Option, ReferencePrimaire } from '../content/node.types'
import type { ContreIndicationEvaluee } from '../engine/evaluateNode'
import { describeReasons } from '../lib/conditionText'
import { labelForCritere, toSharedNiveauPreuve } from '../lib/labels'
import type { CalculAffiche, CalculEnAttente } from '../lib/vueDecision'
import { AlertList } from './AlertList'
import './OptionCard.css'

interface OptionCardProps {
  option: Option
  /**
   * Badge en tête de carte (T-006 étape 2 ; D16, étendu le 2026-07-29) :
   * - `'recommandee'` — 1re option EBM la plus indiquée (hors socle « toujours ») : « c'est le meilleur
   *   choix parmi plusieurs, d'après les données » ;
   * - `'reco-officielle'` — option « toujours » (ex. socle metformine) : maintenue par la reco
   *   officielle française, à distinguer du badge EBM ci-dessus (le socle n'est pas « la » sortie
   *   la plus indiquée par les données, juste ce que la reco officielle maintient en 1re intention) ;
   * - `'securite'` — option `role: securite` (D25) mise en avant : « c'est ce qui reste quand le
   *   traitement habituel est écarté », JAMAIS « c'est le meilleur choix parmi plusieurs » ;
   * - `null` — carte non mise en avant.
   *
   * ARBITRAGE RÉFÉRENT DU 2026-07-29 — pourquoi une QUATRIÈME valeur. Une carte de sécurité peut se
   * retrouver en tête et recevait alors « Recommandée » (cas réel : `statine`, maladie CV établie +
   * intolérance avérée → « Statine indisponible — alternatives hypolipémiantes », seule carte affichée).
   * Ce badge disait alors autre chose que ce qui est vrai : le praticien lit « c'est le meilleur choix
   * parmi plusieurs » là où il faut lire « c'est ce qui reste ». Décision : PAS de suppression du badge
   * (la carte reste bien la conduite à tenir), mais un badge DISTINCT — exactement le précédent D16, qui
   * avait séparé « Recommandation officielle » de « Recommandée » pour la même raison.
   *
   * LA DÉCISION NE SE PREND PAS ICI. Cette carte n'a jamais à connaître `option.role` pour choisir son
   * badge : elle rend la valeur qu'on lui donne. Le calcul vit dans `lib/optionBadges.ts`
   * (`computeBadges`), consommé par `lib/vueDecision.ts` puis passé tel quel par
   * `screens/DecisionNodeScreen.tsx` — un `if (option.role === …)` greffé ici recréerait le couplage que
   * cette séparation évite, et ferait diverger l'écran de la signature de pertinence
   * (`engine/relevance.ts`, qui sérialise `badge` depuis le même modèle de vue).
   */
  badge: 'recommandee' | 'reco-officielle' | 'securite' | null
  /**
   * Justification SITUATIONNELLE (R6, `docs/decision/GRAMMAIRE-NOEUD.md`) : les termes réellement vrais
   * pour ce patient (`lib/vueDecision.ts` `OptionVue.reasons`), pas la règle recopiée telle quelle.
   */
  reasons: string[]
  /** Doses calculées DÉJÀ ÉVALUÉES (`lib/vueDecision.ts` `construireVueDecision`) : cette carte ne
   * connaît plus les critères du patient, seulement le résultat déjà filtré (non-calculables omis). */
  calculs: CalculAffiche[]
  /**
   * Doses déclarées mais NON calculables faute d'un critère (défaut J de la recette référent du
   * 2026-07-27) : la carte les nomme et dit quel champ les débloque, au lieu de s'afficher muette.
   */
  calculsEnAttente?: CalculEnAttente[]
  /**
   * Motif de rang (R6 couche 2, « pourquoi à ce rang » — `lib/vueDecision.ts` `OptionVue.motifRang`) :
   * les termes réellement vrais pour ce patient qui ont fixé le rang de CETTE option parmi les autres de
   * sa famille (P10/S1, même traitement que `reasons` ci-dessus — jamais la disjonction entière).
   * `undefined` la plupart du temps (cf. docstring `OptionVue.motifRang` pour les conditions
   * d'affichage) — n'apparaît que quand ça compte cliniquement (deux options en concurrence de rang
   * réelle).
   */
  motifRang: string[] | undefined
  /**
   * Alertes PORTÉES PAR CETTE OPTION (addendum alertes d'option, `docs/decision/GRAMMAIRE-NOEUD.md`) :
   * déjà filtrées par `lib/vueDecision.ts` (`OptionVue.alertes`) — seulement celles dont `quand` est
   * vrai pour ce patient. Rendues via `AlertList` (réutilisation du composant des alertes de nœud,
   * jamais un second rendu), variante `'option'` pour s'insérer dans la carte.
   */
  alertes: Alerte[]
  /**
   * Contre-indications DÉJÀ ÉVALUÉES (`lib/vueDecision.ts` `OptionVue.contreIndications`, T-068 P9) :
   * texte + état (`active` / `levee` / `indetermine`). La carte ne lit plus les deux formes de contenu
   * (chaîne / objet `{ texte, condition }`) et n'évalue rien — même frontière que `calculs` et `alertes`.
   *
   * OPTIONNELLE, et le repli n'est pas une commodité : absente, la carte retombe sur
   * `option.contre_indications` traitées comme TOUTES ACTIVES, c'est-à-dire EXACTEMENT le rendu d'avant
   * T-068. C'est ce qui permet à un appelant qui ne connaît pas encore cette dimension (tests de rendu
   * pur, futur consommateur du composant) de rester juste par défaut, plutôt que d'afficher une carte
   * sans contre-indication — le pire des deux mondes pour un fait de sécurité.
   */
  contreIndications?: ContreIndicationEvaluee[]
  /**
   * Vrai QUAND CETTE CARTE EST LA SEULE RENDUE SUR L'ÉCRAN (P12/S10, T-136, arbitrage référent du
   * 2026-08-02, point 4). LA CARTE NE LE SAIT PAS PAR ELLE-MÊME — elle ne voit ni ses sœurs ni le nœud :
   * l'appelant (`screens/DecisionNodeScreen.tsx`) compte les options EFFECTIVEMENT AFFICHÉES
   * (`optionsRenduesCount`, T-113 — `partitionAffichage.principales` aplati, PAS `vue.familles` en
   * entier : une carte reléguée derrière « Autres pistes possibles (N) » ne compte pas comme visible) et
   * transmet le résultat de cette comparaison, jamais un nom de nœud (invariant CLAUDE.md 5).
   *
   * EFFET : le panneau `--preuves` (effet chiffré, délai, essais qui les portent — c'est là que vit,
   * depuis le 2026-08-04, la phrase EBM que P11 avait mise derrière le chevron ; elle était jusque-là
   * dans `--argumentaire`, cf. `panneauOuvert` ci-dessous) s'ouvre PAR DÉFAUT au lieu de `null`. Ce qui
   * est rouvert d'office est la DONNÉE EBM, pas un nom de panneau : l'état initial a suivi le
   * déménagement. Le chevron reste utilisable pour le replier : ceci ne change que l'ÉTAT
   * INITIAL d'un `useState`, jamais le mécanisme d'un seul panneau ouvert à la fois (D45, non révoqué).
   * UN `useEffect` RESYNCHRONISE cet état à CHAQUE CHANGEMENT de valeur de cette prop (pas seulement au
   * montage) : un formulaire qui se remplit progressivement peut faire passer la même carte (même
   * `key`) de seule à accompagnée sans la démonter — sans cette resynchronisation, un panneau ouvert au
   * moment « seule » restait ouvert pour toujours, même après que d'autres cartes soient apparues.
   *
   * Défaut `false` : tout appelant qui ne transmet pas cette prop (les bancs de test, un futur
   * consommateur) obtient exactement le comportement d'avant cette session — tous panneaux fermés.
   */
  carteUnique?: boolean
  /**
   * MASQUE LE CHIP DE BADGE (« Recommandée »/« Recommandation officielle (France) »/« Mesure de
   * sécurité ») SUR CETTE CARTE (bug/demande égalité, 2026-08-04) — l'appelant (`DecisionNodeScreen.tsx`)
   * le passe à `true` quand TOUTES les cartes d'un même groupe d'égalité (`.decision-node__egalite-grid`)
   * partagent le même `badge`, pour l'afficher UNE SEULE FOIS au-dessus de la paire plutôt que de le
   * répéter carte par carte. N'affecte QUE le chip textuel : la bordure `--primary` pilotée par `badge`
   * reste posée sur chaque carte (chaque carte individuelle reste visuellement mise en avant). Défaut
   * `false` : tout appelant qui ne transmet pas cette prop obtient le rendu historique (chip sur chaque
   * carte).
   */
  badgeMasque?: boolean
  /**
   * MASQUE LE CHIP « bas rang » (voir `option.bas_rang`, `node.types.ts`) SUR CETTE CARTE, même logique
   * et même appelant que `badgeMasque` ci-dessus — hoisté au-dessus du groupe d'égalité quand toutes ses
   * cartes sont `bas_rang` à l'identique. N'affecte que le chip : l'atténuation visuelle de la carte
   * (`option-card--bas-rang`) reste posée sur chaque carte individuellement.
   */
  basRangMasque?: boolean
  /**
   * BADGE D'ACTION EFFECTIF (2026-08-04, demande utilisateur) — remplace `option.action` pour la
   * bordure/la pastille QUAND FOURNI, sinon repli sur `option.action` (comportement historique). Permet
   * à une MÊME option de porter un verbe différent selon le patient (ex. metformine : « Ajouter » vs
   * « Maintenir » — cf. `option.action_si`, résolu par `lib/vueDecision.ts` `resoudreActionEffective`,
   * jamais recalculé ici : la carte ne connaît toujours pas les critères du patient, seulement le
   * résultat déjà résolu, même frontière que `calculs`/`badge`).
   */
  actionEffective?: ActionOption
  /**
   * BIBLIOGRAPHIE DU NŒUD (`node.sources.references_primaires`), pour résoudre `option.sources_ids` en
   * titres et liens dans le panneau « État des preuves » (2026-08-04). La carte reçoit la liste ENTIÈRE
   * et filtre elle-même : c'est un simple `Map.get` par id, aucune règle métier — la faire faire à
   * l'appelant l'obligerait à connaître la structure du panneau.
   *
   * Défaut `[]` : un appelant qui ne la transmet pas (bancs de rendu, futur consommateur) obtient un
   * panneau sans la ligne « D'après », jamais une erreur ni une liste d'ids bruts affichée.
   */
  bibliographie?: ReferencePrimaire[]
}

/**
 * Chip de badge de mise en avant (« Recommandée »/« Recommandation officielle (France) »/« Mesure de
 * sécurité ») — extrait de la rangée de badges d'`OptionCard` (2026-08-04) pour être réutilisable
 * TEL QUEL au-dessus d'un groupe d'égalité entier (`DecisionNodeScreen.tsx`, `badgeMasque`) quand toutes
 * ses cartes partagent le même badge : même texte, mêmes classes CSS, un seul et même composant — jamais
 * une deuxième version du libellé à maintenir en synchronisation.
 */
export function OptionBadgeChip({ badge }: { badge: 'recommandee' | 'reco-officielle' | 'securite' }) {
  if (badge === 'recommandee') return <span className="option-card__recommended-badge">Recommandée</span>
  if (badge === 'reco-officielle') {
    return <span className="option-card__official-badge">Recommandation officielle (France)</span>
  }
  return <span className="option-card__securite-badge">Mesure de sécurité</span>
}

/**
 * Chip « bas rang » — même principe de réutilisation qu'`OptionBadgeChip` ci-dessus, pour le hoister
 * au-dessus d'un groupe d'égalité dont toutes les cartes sont `bas_rang` (`DecisionNodeScreen.tsx`,
 * `basRangMasque`).
 */
export function BasRangChip() {
  return <span className="option-card__bas-rang-badge">Option de repli — à défaut de mieux</span>
}

/**
 * Bordure gauche par verbe d'action (SB3, P6) : une classe dédiée par verbe, chacune posant
 * `border-left` sur son token `--c-action-*` (`tokens.css`) — sauf `maintenir`, qui n'a pas de token
 * propre et réutilise directement `--c-accent-decision` (`OptionCard.css`). `option.action` absent
 * (les 4 autres nœuds, et les options de `prescription`/`insuline` volontairement laissées sans
 * verbe) : aucune classe n'est ajoutée, la bordure reste celle d'aujourd'hui.
 *
 * CONSERVÉE TELLE QUELLE par S6 (P11) : deux canaux pour le même verbe (bordure + pastille, cf.
 * `ACTION_LABEL` ci-dessous), volontairement redondants (`plans/P11/S6.md` étape 3). Nom de classe
 * NON RENOMMABLE — `OptionCard.test.tsx` l.279-308 l'asserte à la lettre.
 */
const ACTION_BORDER_CLASS: Record<ActionOption, string> = {
  ajouter: 'option-card--action-ajouter',
  remplacer: 'option-card--action-remplacer',
  arreter: 'option-card--action-arreter',
  reduire: 'option-card--action-reduire',
  maintenir: 'option-card--action-maintenir',
}

/**
 * Libellé de la pastille d'action (P11/S6, T-111) — REMPLACE `ACTION_ICON` (emoji, supprimé) : la
 * maquette (l.273) porte le MOT du verbe sur fond teinté, jamais un pictogramme. Même dictionnaire
 * exhaustif sur union fermée que `ACTION_BORDER_CLASS` ci-dessus (TypeScript signale toute valeur
 * manquante). La bordure gauche (`ACTION_BORDER_CLASS`) reste posée EN PLUS de cette pastille — deux
 * canaux pour la même information, déjà en place avant S6 et volontairement conservés.
 */
const ACTION_LABEL: Record<ActionOption, string> = {
  ajouter: 'Ajouter',
  remplacer: 'Remplacer',
  arreter: 'Arrêter',
  reduire: 'Réduire',
  maintenir: 'Maintenir',
}

/**
 * Les CINQ panneaux de la carte (P11/S6, `preuves` ajouté le 2026-08-04) — un seul ouvert à la fois,
 * `null` = tous fermés.
 */
type PanneauNom = 'pourquoi' | 'posologie' | 'ci' | 'preuves' | 'argumentaire'

/**
 * Carte d'option applicable (T-006 étape 2), REFONDUE EN LIGNE UNIQUE le 2026-08-01 (P11/S6, T-111) —
 * **arbitrage référent du même jour, question 3 : « carte en une ligne, tout au clic »**. Cette refonte
 * AMENDE D34 et fait tomber un acquis posé le MATIN du même jour : « la posologie reste TOUJOURS
 * visible » (cf. historique ci-dessous). Le référent a tranché en connaissance de cause — la compacité
 * l'emporte, la posologie passe derrière une pastille. Ne pas rouvrir ce débat ici ; le point est tracé
 * par D45 (S9).
 *
 * STRUCTURE ACTUELLE — une rangée TOUJOURS visible, quatre panneaux TOUJOURS RENDUS mais `hidden` :
 *
 * 1. `.option-card__badges` (optionnel, AU-DESSUS de la rangée) — « Recommandée » / « Recommandation
 *    officielle (France) » / « Mesure de sécurité ». Sortis de la rangée : le plus long (34 caractères)
 *    déborderait une colonne de 380 px cumulé à l'intitulé. N'apparaît que sur 1 à 2 cartes par écran,
 *    une ligne dédiée coûte donc peu.
 * 2. `.option-card__rangee` — LA ligne : pastille d'action (mot du verbe, remplace l'ex-emoji), intitulé
 *    (`flex: 1`), `EvidenceBadge` (pastille de texte — le rendu en points de P11/S5 a été révoqué par
 *    arbitrage référent du 2026-08-02, P11/S10 T-117 ; c'est désormais l'élargissement de la mise en
 *    page, T-118, qui rend cette ligne tenable), puis trois `PastilleInfo` (P11/S3) qui ouvrent chacune
 *    UN panneau (« Proposé parce que », « Posologie » — si contenu, « Contre-indications » — si
 *    l'option en porte), puis un chevron qui ouvre l'argumentaire.
 * 3. `<AlertList variant="option">` — INCHANGÉ depuis A5, HORS de tout panneau. Un fait de sécurité
 *    s'affiche avec son motif (D21) ; aucun arbitrage de cette session n'a porté dessus, et ça reste
 *    vrai après elle.
 * 4. Cinq panneaux, DANS CET ORDRE, chacun `hidden` quand fermé : `--pourquoi` (justification + motif
 *    de rang), `--posologie` (aperçu, doses calculées, doses en attente — défaut J, cf. plus bas),
 *    `--ci` (contre-indications actives/indéterminées puis levées, T-068, inchangé), `--preuves`
 *    (état des preuves : effet chiffré, délai, essais qui les portent), `--argumentaire`
 *    (avantages/inconvénients).
 *
 * LE BADGE DE NIVEAU DE PREUVE EST UNE COMMANDE (2026-08-04, demande utilisateur). Il ouvre le panneau
 * `--preuves`, qui porte `effet_attendu` + `delai_benefice` + LES ESSAIS de `option.sources_ids`. Trois
 * raisons, dans l'ordre de poids : (a) `sources_ids` — les essais qu'une option déclare comme portant
 * SES chiffres, obligatoires par l'invariant I8 dès `niveau_preuve` modéré ou élevé — n'était affiché
 * NULLE PART dans l'application, vérifié par recherche : le contenu portait une traçabilité que le
 * praticien ne pouvait pas lire ; (b) le badge était le seul élément de la rangée sans action, alors
 * qu'il pose exactement la question à laquelle ce panneau répond (« modérée d'après quoi ? ») ; (c) ça
 * dégage du panneau `--argumentaire` la donnée chiffrée, qui y cohabitait avec les avantages/
 * inconvénients — deux registres différents (ce que les essais ont mesuré / ce que ça change en
 * pratique).
 *
 * TOUJOURS RENDUS, JAMAIS EN MONTAGE CONDITIONNEL — et ce n'est pas cosmétique, deux raisons précises :
 * (a) `aria-controls` d'une pastille doit pointer vers un élément qui EXISTE dans le DOM, ouvert ou non
 * (motif standard d'une *disclosure* accessible) ; (b) c'est ce qui permet au garde-fou
 * `engine/banc/carte-affichage.test.tsx` (I12) de continuer à vérifier OÙ vit chaque texte via
 * `renderToStaticMarkup` — avec un montage conditionnel, un panneau fermé serait simplement absent du
 * HTML et le test ne prouverait plus rien. Un panneau sans rien à montrer (ex. `--ci` sur une option
 * sans aucune contre-indication) reste donc rendu, vide, masqué — aucune pastille ne pointe vers lui.
 *
 * UN SEUL PANNEAU OUVERT À LA FOIS (`useState<PanneauNom | null>`), chevron d'argumentaire compris :
 * ouvrir une pastille referme la précédente, sinon la carte « une ligne » redevient une carte haute dès
 * trois clics — exactement ce que cette refonte visait à corriger.
 *
 * EXCEPTION D'ÉTAT INITIAL (P12/S10, T-136, arbitrage référent du 2026-08-02, point 4) : quand la prop
 * `carteUnique` est vraie — cette carte est la SEULE rendue sur l'écran de son nœud — `panneauOuvert`
 * démarre sur `'preuves'` au lieu de `null`. Ça ne révoque ni D45 ni la règle ci-dessus (toujours un
 * seul panneau ouvert, le chevron replie toujours) : seul l'état de DÉPART change, pour un cas où il n'y
 * a aucune concurrence de place entre cartes (il n'y en a qu'une). C'est la régression P11 signalée en
 * recette (N2, « Fixer la cible ») : l'argument EBM (`effet_attendu`) vivait avant la refonte directement
 * sur la carte, la refonte l'a mis derrière le même chevron que sur un écran à cinq cartes — là où le
 * budget d'espace qui justifiait le repli n'existe pas, puisqu'il n'y a qu'une carte à montrer. LE
 * PANNEAU VISÉ A CHANGÉ LE 2026-08-04, l'intention non : `effet_attendu` a déménagé d'`--argumentaire`
 * vers `--preuves`, l'état initial le suit. Ce qui est rouvert d'office est la donnée EBM, pas un nom
 * de panneau.
 *
 * `PastilleInfo` (P11/S3) NE CONNAÎT QUE `ton="neutre"|"danger"` — suffisant pour la pastille CI
 * (`danger` ssi une contre-indication n'est pas levée). La pastille POSOLOGIE a besoin d'un registre
 * AMBRE (« il manque une dose ») qui n'existe pas encore sur ce composant : le détail du contournement
 * — volontairement confiné à ce fichier, `PastilleInfo` n'est pas dans le périmètre « Modifier » de
 * cette session — est documenté dans `OptionCard.css` (`.option-card__pastille-attention`).
 *
 * HISTORIQUE (pourquoi la posologie a été, puis n'est plus, toujours visible). A5 (2026-07-27) avait
 * mesuré une carte à 0,71-1,06 écran de haut, et replié argumentaire ET contre-indications derrière UN
 * dépli, en laissant la posologie visible en permanence. Le 2026-08-01 au matin, un premier correctif
 * avait séparé un second dépli dédié aux contre-indications (registre de sécurité propre, distinct de
 * l'argumentaire) — TOUJOURS avec la posologie hors dépli. C'est CET acquis, « la posologie se lit à
 * chaque prescription, jamais derrière un clic », que l'arbitrage référent du même jour (question 3,
 * après avoir vu la maquette Claude Design) fait tomber : au profit d'une carte tenant sur une seule
 * ligne, tout — posologie comprise — passe derrière une pastille. Le fait de sécurité (contre-
 * indications, alertes d'option) garde un traitement séparé et plus visible (ton `danger`, `AlertList`
 * hors panneau) ; SEULE la posologie perd sa visibilité permanente, décision assumée et tracée (D45).
 *
 * GARDE-FOU : `engine/banc/carte-affichage.test.tsx` (I12) vérifie sur les six nœuds RÉELS que les
 * contre-indications (tous états) vivent dans `.option-card__panneau--ci`, que les alertes d'option et
 * rien d'autre ne vit dans le socle, que les doses vivent dans `.option-card__panneau--posologie`, que
 * « Proposé parce que » vit dans `.option-card__panneau--pourquoi`, que les quatre panneaux sont fermés
 * par défaut SANS `carteUnique`, et qu'une contre-indication non levée fait apparaître une pastille de
 * ton `danger` dans la rangée. Complété par P12/S10 (T-136) : un second bloc du même fichier couvre le
 * cas `carteUnique` — `--argumentaire` seul ouvert par défaut, les trois autres restent fermés.
 *
 * SUITE T-068 (P9, 2026-07-30) — UNE CONTRE-INDICATION PEUT SE TAIRE. Le contenu peut attacher une
 * `condition` (même DSL qu'`exclusions`) à une contre-indication vérifiable ; l'état qui en résulte
 * (`active` / `levee` / `indetermine`) est calculé par le moteur (`engine/evaluateNode.ts`
 * `evaluerContreIndications`), porté par le modèle de vue (`lib/vueDecision.ts`
 * `OptionVue.contreIndications`) et rendu ici. Une contre-indication levée est DÉSAMORCÉE, jamais
 * effacée (bloc « Ne s'applique pas à ce patient », dans le panneau `--ci`) et ne compte plus dans le
 * décompte affiché à l'ouverture. Aucun changement pour une contre-indication sans `condition`.
 */
/**
 * Repli du `contreIndications` non fourni (cf. la docstring de cette prop) : les contre-indications
 * déclarées, TOUTES tenues pour actives, sans évaluer aucune `condition` — le composant n'a pas les
 * critères du patient et n'a rien à évaluer (`lib/vueDecision.ts` le fait, une fois par cycle de rendu).
 * Volontairement PAS un appel à `evaluerContreIndications` avec des critères vides : ça lèverait une
 * `ConditionError` (variable inconnue) sur une contre-indication conditionnelle, là où l'état par défaut
 * est précisément « affichée normalement ».
 */
function contreIndicationsParDefaut(option: Option): ContreIndicationEvaluee[] {
  return (option.contre_indications ?? []).map((ci) => ({
    texte: typeof ci === 'string' ? ci : ci.texte,
    etat: 'active' as const,
  }))
}

export function OptionCard({
  option,
  badge,
  reasons,
  calculs,
  calculsEnAttente,
  motifRang,
  alertes,
  contreIndications,
  carteUnique = false,
  badgeMasque = false,
  basRangMasque = false,
  actionEffective,
  bibliographie = [],
}: OptionCardProps) {
  // Repli sur `option.action` (statique) quand l'appelant ne transmet pas `actionEffective` — comportement
  // historique inchangé pour tout consommateur qui ignore encore cette prop (bancs de test compris).
  const actionAffichee = actionEffective ?? option.action
  const classeCarte = [
    'option-card',
    badge && 'option-card--primary',
    option.bas_rang && 'option-card--bas-rang',
    actionAffichee && ACTION_BORDER_CLASS[actionAffichee],
  ]
    .filter(Boolean)
    .join(' ')

  // Présence des contre-indications — pilote leur rendu : TOUTES (actives, indéterminées ET levées)
  // vivent dans le MÊME panneau `--ci`, jamais ailleurs (garde-fou I12).
  //
  // T-068 (P9, 2026-07-30) : la liste est SCINDÉE PAR ÉTAT à l'intérieur de ce panneau. Les contre-
  // indications `active` et `indetermine` gardent le rendu d'avant, à l'octet près (même bloc, même
  // libellé, même séparateur) ; seules les `levee` — une `condition` que les critères saisis ont rendue
  // FAUSSE — passent dans un second bloc, en retrait. Sur tout contenu sans `condition` (100 % du
  // contenu au jour de cette livraison), `levees` est vide et cette carte rend exactement ce qu'elle
  // rendait.
  const contreIndicationsVues = contreIndications ?? contreIndicationsParDefaut(option)
  const ciAffichees = contreIndicationsVues.filter((ci) => ci.etat !== 'levee')
  const ciLevees = contreIndicationsVues.filter((ci) => ci.etat === 'levee')
  const aDesContreIndications = ciAffichees.length > 0
  const aDesContreIndicationsDuTout = contreIndicationsVues.length > 0

  // Contenu de la pastille POSOLOGIE (P11/S6) — rendue seulement s'il y a quelque chose à montrer.
  const enAttentePosologie = (calculsEnAttente?.length ?? 0) > 0
  const aDuContenuPosologie = Boolean(option.apercu) || calculs.length > 0 || enAttentePosologie

  // Textes de survol (desktop, `PastilleInfo`) — même contenu que ce que le panneau montre en tête,
  // condensé sur une ligne (le panneau, lui, peut en montrer plus : motif de rang, doses non calculées).
  const texteProposeParceQue = describeReasons(reasons, option.motifs)
  const texteSurvolPosologie =
    option.apercu ??
    (calculs.length > 0
      ? calculs
          .map((ligne) => `${ligne.libelle} ≈ ${Math.round(ligne.valeur)}${ligne.unite ? ` ${ligne.unite}` : ''}`)
          .join(' · ')
      : 'Doses non calculées — voir le détail')
  const texteSurvolCi = aDesContreIndications
    ? ciAffichees.map((ci) => ci.texte).join(' · ')
    : 'Aucune contre-indication active'

  // Un seul panneau ouvert à la fois (Décision clé n°2 de `PastilleInfo`, S3 ; même registre que
  // `CriteriaForm.tsx` `detailOuvert`). `idBase` (React 19 `useId`) évite toute collision d'`id` entre
  // plusieurs cartes montées sur le même écran.
  // Essais qui portent les chiffres de CETTE option (`option.sources_ids`, exigés par l'invariant I8 dès
  // `niveau_preuve` modéré/élevé) — résolus contre la bibliographie du nœud. Un id inconnu est ignoré
  // ICI : le signaler est le travail d'un invariant de contenu, pas d'un composant de rendu au milieu
  // d'une consultation.
  const parId = new Map(bibliographie.map((reference) => [reference.id, reference]))
  const essais = (option.references ?? [])
    .map((id) => parId.get(id))
    .filter((reference): reference is ReferencePrimaire => Boolean(reference))

  const idBase = useId()
  const idPourquoi = `${idBase}-pourquoi`
  const idPosologie = `${idBase}-posologie`
  const idCi = `${idBase}-ci`
  const idPreuves = `${idBase}-preuves`
  const idArgumentaire = `${idBase}-argumentaire`
  // ÉTAT INITIAL (P12/S10, T-136) : `'argumentaire'` quand cette carte est seule sur son écran
  // (`carteUnique`, cf. docstring de la prop) — c'est là que vit la phrase EBM que P11 avait mise
  // derrière le chevron. `null` dans tous les autres cas, comportement inchangé depuis P11/S6.
  const [panneauOuvert, setPanneauOuvert] = useState<PanneauNom | null>(carteUnique ? 'preuves' : null)
  const togglePanneau = (nom: PanneauNom) => setPanneauOuvert((actuel) => (actuel === nom ? null : nom))

  // RESYNCHRONISATION SUR CHANGEMENT DE `carteUnique` (P12/S10, T-136 — bug trouvé au navigateur, pas
  // par le banc de test : `useState(carteUnique ? …)` ne fixe qu'un état INITIAL, lu une seule fois au
  // montage). Sur un formulaire qui se remplit progressivement, la MÊME carte (même `key`, cf.
  // `DecisionNodeScreen.tsx`) peut d'abord être seule à l'écran puis rejointe par d'autres — vérifié en
  // conditions réelles sur `prescription` (« Metformine — instaurer ou poursuivre » : seule carte après
  // l'étape « orientation », rejointe par trois autres après « terrain »). Sans cet effet, son panneau
  // `--argumentaire` restait ouvert pour toujours, la carte perdant la compacité de D45 dès qu'elle
  // cessait d'être seule. Ne s'exécute QUE quand `carteUnique` change de valeur (tableau de dépendances)
  // — jamais sur un simple re-rendu à `carteUnique` inchangé, donc jamais sur un repli manuel de
  // l'utilisateur (clic sur le chevron) pendant que la carte reste seule.
  useEffect(() => {
    setPanneauOuvert(carteUnique ? 'preuves' : null)
  }, [carteUnique])

  return (
    <div className={classeCarte}>
      {((badge && !badgeMasque) || (option.bas_rang && !basRangMasque)) && (
        <div className="option-card__badges">
          {badge && !badgeMasque && <OptionBadgeChip badge={badge} />}
          {option.bas_rang && !basRangMasque && <BasRangChip />}
        </div>
      )}

      {/* LA RANGÉE — toujours visible, une ligne (P11/S6). */}
      <div className="option-card__rangee">
        {actionAffichee && (
          <span
            className={`option-card__action-pastille option-card__action-pastille--${actionAffichee}`}
          >
            {ACTION_LABEL[actionAffichee]}
          </span>
        )}
        <span className="option-card__title">{option.intitule}</span>
        {/* LE BADGE EST UNE COMMANDE (2026-08-04) — cf. docstring de tête. `EvidenceBadge` reste un
            composant PARTAGÉ et PUREMENT visuel (module Veille compris) : c'est le bouton qui porte
            l'interaction et l'accessibilité (`aria-expanded`/`aria-controls`), pas le badge. */}
        <button
          type="button"
          className="option-card__preuves-toggle"
          aria-label={`État des preuves — ${option.intitule}`}
          aria-expanded={panneauOuvert === 'preuves'}
          aria-controls={idPreuves}
          onClick={() => togglePanneau('preuves')}
        >
          <EvidenceBadge niveau={toSharedNiveauPreuve(option.niveau_preuve)} />
        </button>
        <PastilleInfo
          icone="info"
          libelle="Proposé parce que"
          texte={texteProposeParceQue}
          ouvert={panneauOuvert === 'pourquoi'}
          onToggle={() => togglePanneau('pourquoi')}
          panneauId={idPourquoi}
        />
        {aDuContenuPosologie && (
          // Cf. docstring de tête : `PastilleInfo` ne porte pas encore de ton `attention` — cette classe
          // (`OptionCard.css`) surcharge sa couleur SANS toucher au composant partagé.
          <span className={enAttentePosologie ? 'option-card__pastille-attention' : undefined}>
            <PastilleInfo
              icone="gelule"
              libelle="Posologie"
              texte={texteSurvolPosologie}
              ouvert={panneauOuvert === 'posologie'}
              onToggle={() => togglePanneau('posologie')}
              panneauId={idPosologie}
            />
          </span>
        )}
        {aDesContreIndicationsDuTout && (
          <PastilleInfo
            icone="triangle-alerte"
            libelle="Contre-indications"
            texte={texteSurvolCi}
            ouvert={panneauOuvert === 'ci'}
            onToggle={() => togglePanneau('ci')}
            panneauId={idCi}
            ton={aDesContreIndications ? 'danger' : 'neutre'}
          />
        )}
        <button
          type="button"
          className="option-card__chevron"
          aria-label="Argumentaire complet"
          aria-expanded={panneauOuvert === 'argumentaire'}
          aria-controls={idArgumentaire}
          onClick={() => togglePanneau('argumentaire')}
        >
          <Icon nom="chevron-bas" />
        </button>
      </div>

      {/* Alertes PORTÉES PAR CETTE OPTION (addendum alertes d'option, GRAMMAIRE-NOEUD.md) : rendues
          seulement ici, HORS de tout panneau (D21, inchangé depuis A5) — jamais sous le formulaire,
          à la différence des alertes de nœud (`AlertList` rendue par `DecisionNodeScreen.tsx`). */}
      <AlertList alertes={alertes} variant="option" />

      {/* PANNEAU « POURQUOI » — justification + motif de rang, P11/S6. Ex-contenu du dépli argumentaire,
          sorti dans son propre panneau (et sa propre pastille) : « Proposé parce que » et « Ce rang
          tient compte de » se lisent une fois par option, ils méritent un accès direct plutôt que d'être
          noyés dans l'argumentaire complet (effet/délai/avantages/inconvénients). */}
      <div
        id={idPourquoi}
        className="option-card__panneau option-card__panneau--pourquoi"
        hidden={panneauOuvert !== 'pourquoi'}
      >
        <div className="option-card__pourquoi">Proposé parce que : {texteProposeParceQue}</div>
        {motifRang && motifRang.length > 0 && (
          <div className="option-card__rang">
            Ce rang tient compte de : {describeReasons(motifRang, option.motifs)}
          </div>
        )}
      </div>

      {/* PANNEAU « POSOLOGIE » — P11/S6 fait tomber l'acquis « toujours visible » du 2026-08-01 matin
          (cf. docstring de tête) : `option.apercu`, les doses calculées puis les doses EN ATTENTE
          (défaut J, 2026-07-27 — la carte dit ce qu'elle attend) vivent maintenant ici, derrière la
          pastille `gelule`, dans cet ordre. */}
      <div
        id={idPosologie}
        className="option-card__panneau option-card__panneau--posologie"
        hidden={panneauOuvert !== 'posologie'}
      >
        {option.apercu && (
          <div className="option-card__apercu">
            <span className="option-card__calculs-label">Posologie : </span>
            {option.apercu}
          </div>
        )}
        {/* Texte détaillé (2026-08-04, demande utilisateur) : schéma de titration/observance, sorti de
            l'argumentaire avantages/inconvénients pour vivre ici, là où un praticien qui cherche « comment
            je prescris » le cherche réellement — cf. docstring `Option.posologie_detail`. */}
        {option.posologie_detail?.map((paragraphe, index) => (
          <div key={`${index}-${paragraphe.slice(0, 30)}`} className="option-card__apercu">
            {paragraphe}
          </div>
        ))}
        {calculs.length > 0 && (
          <div className="option-card__calculs">
            <span className="option-card__calculs-label">Doses indicatives : </span>
            {calculs.map((ligne, index) => (
              <span key={`${index}-${ligne.libelle}`} className="option-card__calcul">
                {ligne.libelle} ≈ {Math.round(ligne.valeur)}
                {ligne.unite ? ` ${ligne.unite}` : ''}
                {index < calculs.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </div>
        )}
        {calculsEnAttente && calculsEnAttente.length > 0 && (
          <div className="option-card__calculs option-card__calculs--en-attente">
            <span className="option-card__calculs-label">Doses non calculées : </span>
            {calculsEnAttente.map((ligne, index) => (
              <span key={`${index}-${ligne.libelle}`} className="option-card__calcul">
                {ligne.libelle} — à renseigner : {ligne.criteresManquants.map(labelForCritere).join(', ')}
                {index < calculsEnAttente.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* PANNEAU « CONTRE-INDICATIONS » — registre de sécurité, INCHANGÉ depuis T-068 dans son contenu
          (actives/indéterminées puis levées en retrait) ; seul son CONTENANT change de nature (panneau
          `hidden` plutôt que `<details>`). Toujours rendu, même sans aucune contre-indication déclarée
          (aucune pastille ne pointe alors vers lui — cf. docstring de tête). */}
      <div id={idCi} className="option-card__panneau option-card__panneau--ci" hidden={panneauOuvert !== 'ci'}>
        {aDesContreIndications && (
          <div className="option-card__ci">
            <span className="option-card__ci-label">
              {ciAffichees.length} {ciAffichees.length > 1 ? 'contre-indications' : 'contre-indication'} :{' '}
            </span>
            {ciAffichees.map((ci) => ci.texte).join(' · ')}
          </div>
        )}
        {ciLevees.length > 0 && (
          <div className="option-card__ci option-card__ci--levee">
            <span className="option-card__ci-label">Ne s'applique pas à ce patient : </span>
            <span className="option-card__ci-levee-texte">{ciLevees.map((ci) => ci.texte).join(' · ')}</span>
          </div>
        )}
      </div>

      {/* PANNEAU « ÉTAT DES PREUVES » (2026-08-04) — ouvert par le badge de niveau de preuve. CE QUE LES
          ESSAIS ONT MESURÉ : l'effet chiffré, son délai d'apparition, et les essais qui les portent. À
          distinguer du panneau `--argumentaire` ci-dessous, qui dit ce que ça change EN PRATIQUE. */}
      <div
        id={idPreuves}
        className="option-card__panneau option-card__panneau--preuves"
        hidden={panneauOuvert !== 'preuves'}
      >
        <div className="option-card__effet">{option.effet_attendu}</div>

        {/* R2 : le délai est posé À CÔTÉ de l'effet, jamais confronté à l'espérance de vie du patient
            par l'outil — cette mise en balance est l'arbitrage du praticien (invariant 2, aucun score
            caché). Formulation « Délai du bénéfice : X » plutôt que « Bénéfice attendu en X », qui
            deviendrait fautive pour les valeurs `immédiat` et `non établi`. */}
        {option.delai_benefice && (
          <div className="option-card__delai">Délai du bénéfice : {option.delai_benefice}</div>
        )}

        {essais.length > 0 && (
          <div className="option-card__essais">
            <span className="option-card__essais-label">D'après : </span>
            {essais.map((reference, index) => (
              <span key={reference.id}>
                {index > 0 && ' · '}
                {reference.lien ? (
                  <a href={reference.lien} target="_blank" rel="noreferrer">
                    {reference.titre} ({reference.annee})
                  </a>
                ) : (
                  `${reference.titre} (${reference.annee})`
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* PANNEAU « ARGUMENTAIRE » — avantages/inconvénients. Ex-contenu du dépli unique d'A5, amputé de
          « Proposé parce que »/« Ce rang tient compte de » (partis dans le panneau `--pourquoi`), des
          contre-indications (parties dans `--ci`), et depuis le 2026-08-04 de l'effet chiffré et de son
          délai (partis dans `--preuves` ci-dessus). */}
      <div
        id={idArgumentaire}
        className="option-card__panneau option-card__panneau--argumentaire"
        hidden={panneauOuvert !== 'argumentaire'}
      >
        <div className="option-card__lists">
          <div>
            <div className="option-card__list-title">Avantages</div>
            {option.avantages.map((avantage, index) => (
              <div key={`${index}-${avantage}`} className="option-card__list-item">
                • {avantage}
              </div>
            ))}
          </div>
          <div>
            <div className="option-card__list-title">Inconvénients</div>
            {option.inconvenients.map((inconvenient, index) => (
              <div key={`${index}-${inconvenient}`} className="option-card__list-item">
                • {inconvenient}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
