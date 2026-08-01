import { EvidenceBadge } from '../../shared/badges/EvidenceBadge'
import type { ActionOption, Alerte, Option } from '../content/node.types'
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
}

/**
 * Bordure gauche par verbe d'action (SB3, P6) : une classe dédiée par verbe, chacune posant
 * `border-left` sur son token `--c-action-*` (`tokens.css`) — sauf `maintenir`, qui n'a pas de token
 * propre et réutilise directement `--c-accent-decision` (`OptionCard.css`). `option.action` absent
 * (les 4 autres nœuds, et les options de `prescription`/`insuline` volontairement laissées sans
 * verbe) : aucune classe n'est ajoutée, la bordure reste celle d'aujourd'hui.
 */
const ACTION_BORDER_CLASS: Record<ActionOption, string> = {
  ajouter: 'option-card--action-ajouter',
  remplacer: 'option-card--action-remplacer',
  arreter: 'option-card--action-arreter',
  reduire: 'option-card--action-reduire',
  maintenir: 'option-card--action-maintenir',
}

/**
 * Icône du verbe d'action (amélioration de lisibilité, 2026-08-01) — 100 % GÉNÉRIQUE : `ActionOption`
 * est une énumération FERMÉE à 5 valeurs, partagée par tout domaine qui l'emploie (D35), jamais un nom
 * de nœud ni un fait clinique. Un dictionnaire exhaustif sur une union fermée est sûr par construction
 * (TypeScript signale toute valeur manquante). Placée EN PLUS de l'intitulé complet, jamais à sa place :
 * l'intitulé d'une option est le texte clinique qu'un praticien applique, le tronquer pour ne garder
 * qu'« icône + classe thérapeutique » exigerait soit une réécriture heuristique du texte (risque de
 * perdre un mot qui compte), soit un nouveau champ de contenu à faire rédiger option par option — les
 * deux plus lourds qu'une icône de scan rapide, et non tranchés ici.
 */
const ACTION_ICON: Record<ActionOption, string> = {
  ajouter: '➕',
  remplacer: '🔄',
  arreter: '⛔',
  reduire: '➖',
  maintenir: '➡️',
}

/**
 * Carte d'option applicable (T-006 étape 2), ALLÉGÉE le 2026-07-27 — arbitrage référent A5, puis
 * RESTRUCTURÉE EN ZONES le 2026-08-01 (recette navigateur du même jour), puis AFFINÉE LE MÊME JOUR
 * (second passage référent, après avoir vu le premier rendu) — cf. plus bas, c'est CE second passage
 * qui décrit l'état actuel.
 *
 * POURQUOI L'ALLÈGEMENT D'ORIGINE (A5). La recette visuelle a mesuré une carte à **0,71 à 1,06 écran**
 * en largeur étroite : il faut un défilement plein écran, parfois plus, pour passer d'une carte à la
 * suivante, et un profil banal en affiche cinq. Ce sont les avantages/inconvénients (3 à 6 puces
 * longues) et le paragraphe d'effet attendu qui font ce volume — les contre-indications, elles, ne
 * pèsent que 11 à 18 % de la hauteur.
 *
 * TROIS REGISTRES DE LECTURE — chacun à SA fréquence d'usage, chacun avec SON traitement, PAS le même
 * pour les trois. Un premier passage (2026-08-01, matin) avait sorti les contre-indications ACTIVES du
 * dépli pour les rendre TOUJOURS visibles, au même titre que la posologie — ça corrigeait le défaut
 * mesuré (une dose lue à travers un avertissement rouge), mais ça en créait un autre : la sécurité
 * occupait alors le socle en permanence, même hors contexte de prescription. Le référent, en voyant ce
 * premier rendu, a corrigé le tir : la posologie reste TOUJOURS visible (elle se lit à chaque
 * prescription), mais la sécurité retourne derrière SON PROPRE dépli, distinct de l'argumentaire — replié
 * par défaut comme avant, mais reconnaissable de loin par sa couleur quand elle n'est pas neutralisée. Le
 * rouge redevient donc un signal ponctuel (on l'ouvre pour vérifier), plus un état permanent du socle.
 *
 * 1. SOCLE — POSOLOGIE, jamais repliable, registre NEUTRE (jamais rouge, quel que soit l'état des
 *    contre-indications) :
 *   - `calculs` (« Doses indicatives : 8 U/j ») — déjà hors dépli avant ce lot, inchangé ;
 *   - `option.apercu` (T-076/S9) — SORTI du libellé du `<summary>` où il était concaténé au compte de
 *     contre-indications (donc teinté rouge par contagion) : c'était le défaut d'origine, mesuré le
 *     2026-08-01. Rendu ici en ligne neutre, visible sans clic — CET ACQUIS EST CONSERVÉ TEL QUEL au
 *     second passage, le référent l'a validé explicitement ;
 *   - `calculsEnAttente` (« Doses non calculées : … à renseigner : Poids ») — la pousser derrière un
 *     dépli ferait revenir le défaut J (2026-07-27) ;
 *   - `option.alertes` — un fait de sécurité s'affiche avec son motif, il ne se déplie pas (inchangé).
 *
 * 2. DÉPLI (`<details>`) — CONTRE-INDICATIONS, propre et distinct de l'argumentaire, REPLIÉ PAR DÉFAUT
 *    (comme avant le premier passage du 2026-08-01) :
 *   - le `<summary>` FERMÉ passe en registre d'alerte (`--c-ci-warning`, icône ⚠, décompte exact)
 *     UNIQUEMENT si au moins une contre-indication n'est pas écartée (état `active` ou `indetermine`,
 *     D20/T-068) — c'est la COULEUR qui porte le signal de sécurité maintenant, plus la position (le
 *     premier passage avait supprimé la position ET la couleur ; ce second passage restaure la position
 *     derrière un dépli mais garde le principe SB6 : un fait de sécurité fermé doit s'annoncer par autre
 *     chose que le bleu-lien neutre) ;
 *   - les contre-indications ACTIVES/INDÉTERMINÉES (`ciAffichees`) ET LEVÉES (`ciLevees`, T-068) vivent
 *     TOUTES LES DEUX ici, jamais dans l'argumentaire : elles parlent de sécurité, elles restent
 *     ensemble — une levée reste « désamorcée, jamais effacée », affichée en retrait sous les actives ;
 *   - ce dépli ne rend RIEN si l'option ne porte aucune contre-indication (aucun espace réservé).
 *
 * 3. DÉPLI (`<details>`) — ARGUMENTAIRE, SÉPARÉ du précédent, TOUJOURS neutre (jamais de variante
 *    rouge — la sécurité a son propre dépli, §2), REPLIÉ PAR DÉFAUT :
 *   - « Proposé parce que » et, quand il compte, le motif du rang (R6) — REJOINTS le 2026-08-01
 *     (décision référent explicite, confirmée au second passage) : ils poussaient l'action vers le bas
 *     alors qu'ils se lisent une fois par option, pas à chaque prescription ;
 *   - effet attendu, délai du bénéfice, avantages, inconvénients — inchangés.
 *
 * DEUX `<details>` SÉPARÉS, PAS UN SEUL — c'est le point précis du second passage référent : le premier
 * correctif avait résolu « le rouge avale la posologie » en supprimant purement le dépli de sécurité (le
 * rouge devenait alors un état permanent du socle). La bonne réponse gardait les deux problèmes séparés :
 * la posologie ne doit plus JAMAIS passer par un dépli (résolu, conservé), et la sécurité doit rester un
 * DÉPLI PROPRE qu'on ouvre pour vérifier, pas une bannière permanente ni un mélange avec l'argumentaire.
 *
 * `<details>` NATIF (les deux), et c'est un choix, pas une facilité : ouverture au clic/tap (jamais au
 * survol — A5 l'exige, un survol est inutilisable au doigt en consultation), état géré par le navigateur
 * donc aucun `useState` à synchroniser, et accessibilité clavier + lecteur d'écran acquise sans code.
 *
 * GARDE-FOU : `banc/carte-affichage.test.ts` (I12) vérifie sur les six nœuds RÉELS qu'aucun texte
 * d'alerte d'option ou de dose n'atterrit jamais à l'intérieur d'un dépli (inchangé depuis A5), et que
 * les contre-indications (tous états) sont bien DANS le dépli de sécurité — plus jamais dans le socle,
 * plus jamais dans l'argumentaire.
 *
 * SUITE T-068 (P9, 2026-07-30) — UNE CONTRE-INDICATION PEUT SE TAIRE. Le contenu peut attacher une
 * `condition` (même DSL qu'`exclusions`) à une contre-indication vérifiable ; l'état qui en résulte
 * (`active` / `levee` / `indetermine`) est calculé par le moteur (`engine/evaluateNode.ts`
 * `evaluerContreIndications`), porté par le modèle de vue (`lib/vueDecision.ts`
 * `OptionVue.contreIndications`) et rendu ici. Une contre-indication levée est DÉSAMORCÉE, jamais
 * effacée (bloc « Ne s'applique pas à ce patient », dans le dépli sécurité) et ne compte plus dans le
 * décompte du `<summary>`. Aucun changement pour une contre-indication sans `condition`.
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
}: OptionCardProps) {
  const classeCarte = [
    'option-card',
    badge && 'option-card--primary',
    option.action && ACTION_BORDER_CLASS[option.action],
  ]
    .filter(Boolean)
    .join(' ')

  // Présence des contre-indications — pilote leur rendu : TOUTES (actives, indéterminées ET levées)
  // vivent désormais dans le MÊME dépli sécurité, distinct de l'argumentaire (second passage référent,
  // 2026-08-01) — plus aucune n'est dans le socle, plus aucune dans l'argumentaire.
  //
  // T-068 (P9, 2026-07-30) : la liste est SCINDÉE PAR ÉTAT à l'intérieur de ce dépli. Les contre-
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

  // SB6 (P6, 2026-07-29), RESTAURÉ le 2026-08-01 (second passage) : libellé + classe conditionnelle du
  // <summary> FERMÉ du dépli sécurité. Le décompte se déduit de `ciAffichees.length` : chaque
  // `contre_indications` du YAML est UNE phrase, `.length` donne donc un compte clinique correct — porte
  // sur les non-levées uniquement (une contre-indication levée ne gonfle plus ce chiffre), et une
  // `indetermine` reste comptée puisqu'elle reste AFFICHÉE comme active (D20) : le chiffre annoncé carte
  // fermée doit toujours être celui des lignes que le dépli montre dans le registre d'alerte.
  const classeSummaryCi = [
    'option-card__detail-summary',
    aDesContreIndications && 'option-card__detail-summary--ci',
  ]
    .filter(Boolean)
    .join(' ')
  const libelleSummaryCi = aDesContreIndications
    ? `${ciAffichees.length} ${ciAffichees.length > 1 ? 'contre-indications' : 'contre-indication'}`
    : 'Contre-indications (aucune active)'

  // Le <summary> de l'ARGUMENTAIRE, lui, reste TOUJOURS neutre — la sécurité a désormais son propre
  // dépli (ci-dessus), ce libellé n'a donc plus jamais rien à compenser.
  const libelleSummaryArgumentaire = 'Proposé parce que, effet attendu et plus'

  return (
    <div className={classeCarte}>
      <div className="option-card__header">
        <div className="option-card__title">
          {option.action && (
            <span aria-hidden="true" className="option-card__action-icon">
              {ACTION_ICON[option.action]}
            </span>
          )}
          {option.intitule}
        </div>
        <div className="option-card__badges">
          {badge === 'recommandee' && <span className="option-card__recommended-badge">Recommandée</span>}
          {badge === 'reco-officielle' && (
            <span className="option-card__official-badge">Recommandation officielle (France)</span>
          )}
          {/* Arbitrage référent 2026-07-29 (cf. docstring de la prop `badge`) : une carte mise en avant
              PARCE QU'ELLE EST UNE MESURE DE SÉCURITÉ, et non parce qu'elle serait le meilleur choix
              parmi plusieurs. Libellé volontairement court (`OptionCard.css` `.option-card__badges` gère
              déjà le retour à la ligne mobile, mais un 3e libellé long l'y forcerait presque toujours). */}
          {badge === 'securite' && <span className="option-card__securite-badge">Mesure de sécurité</span>}
          <EvidenceBadge niveau={toSharedNiveauPreuve(option.niveau_preuve)} />
        </div>
      </div>

      {/* ZONE POSOLOGIE — jamais repliable, registre NEUTRE (jamais rouge, y compris quand la carte
          porte des contre-indications actives : deux registres, deux emplacements bien distincts). Cet
          acquis du 2026-08-01 (matin) est CONSERVÉ TEL QUEL au second passage référent — c'était le
          défaut visé, il reste corrigé. */}
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

      {/* `option.apercu` (T-076/S9) — SORTI du libellé du <summary> le 2026-08-01, où il était
          concaténé au décompte de contre-indications et donc teinté du même rouge par contagion (le
          défaut mesuré ce jour-là). Rendu ici en ligne neutre, visible sans clic : c'est l'objectif même
          du champ (« un praticien qui cherche une posologie n'a aucune raison d'ouvrir un dépli »),
          enfin atteint sans emprunter le registre d'alerte pour y parvenir. Absent → rien ne s'affiche,
          rendu inchangé pour toute option qui ne le porte pas. */}
      {option.apercu && (
        <div className="option-card__apercu">
          <span className="option-card__calculs-label">Posologie : </span>
          {option.apercu}
        </div>
      )}

      {/* Défaut J (recette référent, 2026-07-27) : une dose non calculable était OMISE en silence — la
          carte s'affichait sans aucune dose, et rien n'indiquait qu'un poids la ferait apparaître. Le
          critère manquant était pourtant DÉJÀ réclamé, mais dans le formulaire, à plusieurs sections
          de là. On rétablit ici le seul lien qui manquait : la carte dit ce qu'elle attend. */}
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

      {/* Alertes PORTÉES PAR CETTE OPTION (addendum alertes d'option, GRAMMAIRE-NOEUD.md) : rendues
          seulement ici, jamais sous le formulaire — à la différence des alertes de nœud (`AlertList`
          rendue par `DecisionNodeScreen.tsx`), elles ne concernent QUE ce geste, déjà retenu ici. */}
      <AlertList alertes={alertes} variant="option" />

      {/* DÉPLI SÉCURITÉ, propre et distinct de l'argumentaire (second passage référent, 2026-08-01,
          après le premier rendu). Replié par défaut, comme avant le tout premier correctif du même
          jour — mais le `<summary>` FERMÉ porte le signal (icône ⚠, couleur `--c-ci-warning`, décompte
          exact) dès qu'au moins une contre-indication n'est pas écartée (`aDesContreIndications`,
          `active`/`indetermine`). Ne rend RIEN si l'option ne porte aucune contre-indication, quel que
          soit son état (`aDesContreIndicationsDuTout`) — aucun espace réservé pour rien. */}
      {aDesContreIndicationsDuTout && (
        <details className="option-card__detail">
          <summary className={classeSummaryCi}>
            {/* Icône décorative : le décompte + le mot « contre-indication(s) » qui suivent portent déjà
                l'information en texte (lu par tout lecteur d'écran) — l'icône n'ajoute qu'un repère
                visuel, elle est donc masquée aux technologies d'assistance plutôt que doublée. */}
            {aDesContreIndications && (
              <span className="option-card__detail-summary-icon" aria-hidden="true">
                ⚠{' '}
              </span>
            )}
            {libelleSummaryCi}
          </summary>

          {/* Contre-indications ACTIVES/INDÉTERMINÉES — registre d'alerte (`--c-disclaimer-*`,
              `OptionCard.css`), inchangé depuis SB3. */}
          {aDesContreIndications && (
            <div className="option-card__ci">
              <span className="option-card__ci-label">
                {ciAffichees.length} {ciAffichees.length > 1 ? 'contre-indications' : 'contre-indication'} :{' '}
              </span>
              {ciAffichees.map((ci) => ci.texte).join(' · ')}
            </div>
          )}

          {/* T-068 (P9, 2026-07-30) — CONTRE-INDICATIONS DÉSAMORCÉES, jamais effacées. Une contre-
              indication dont la `condition` est FAUSSE pour ce patient (« insuffisance rénale sévère »
              chez quelqu'un dont le DFG saisi est normal) ne doit plus s'afficher comme un avertissement
              actif — mais elle ne doit pas non plus disparaître : c'est la même exigence de transparence
              que R4 pour les options écartées (`docs/decision/GRAMMAIRE-NOEUD.md`), qui les montre AVEC
              leur motif plutôt que de les retirer en silence. Le praticien doit pouvoir vérifier que
              l'outil a bien VU la contre-indication et sur quelle base il la juge sans objet.

              Reste dans CE dépli (et non l'argumentaire, second passage 2026-08-01) : une contre-
              indication levée parle de sécurité, elle va avec la sécurité — même si elle n'interdit
              plus rien. Registre visuel neutre (`--levee` : estompé + barré, cf. `OptionCard.css`),
              toujours PAS `--c-disclaimer-*` : ce bloc-ci n'interdit rien, contrairement au précédent. */}
          {ciLevees.length > 0 && (
            <div className="option-card__ci option-card__ci--levee">
              <span className="option-card__ci-label">Ne s'applique pas à ce patient : </span>
              <span className="option-card__ci-levee-texte">{ciLevees.map((ci) => ci.texte).join(' · ')}</span>
            </div>
          )}
        </details>
      )}

      {/* A5 — LE DÉPLI, ARGUMENTAIRE — SÉPARÉ du dépli sécurité ci-dessus (second passage référent,
          2026-08-01). Tout ce qui instruit la décision sans être ce sur quoi on agit dans la minute, ni
          un fait de sécurité (celui-ci a son propre dépli). TOUJOURS neutre, plus jamais de variante
          rouge. Fermé par défaut : c'est l'allègement lui-même, une carte ouverte n'allège rien.
          `<details>` natif (cf. docstring de tête) — le navigateur porte l'état, le clavier et le
          lecteur d'écran.

          « Proposé parce que » et « Ce rang tient compte de » REJOIGNENT ce dépli le 2026-08-01
          (décision référent explicite, confirmée au second passage) : ils poussaient l'action
          (intitulé, badge, posologie) vers le bas alors qu'ils se lisent une fois par option, pas à
          chaque prescription — gain net de hauteur de carte, l'objectif mesurable de ce correctif. */}
      <details className="option-card__detail">
        <summary className="option-card__detail-summary">{libelleSummaryArgumentaire}</summary>

        {/* `option.motifs` (P10/S2) : une branche dont le contenu a rédigé le motif s'affiche avec CE
            texte plutôt qu'avec sa traduction mécanique. Carte optionnelle et partielle — une branche
            sans motif garde son texte d'avant T-079, à l'octet près (seul son EMPLACEMENT change ici,
            le 2026-08-01). */}
        <div className="option-card__pourquoi">Proposé parce que : {describeReasons(reasons, option.motifs)}</div>

        {/* R6 couche 2 : pourquoi CE rang parmi les autres options de la famille — seulement quand une
            vraie concurrence de rang existe (cf. `lib/vueDecision.ts` `OptionVue.motifRang`). Mêmes
            motifs rédigés : un `priorite[].quand` reprend en général une branche déjà écrite dans
            `conditions` (I24 n'indexe que celles-là), et la même situation clinique se dit alors du même
            mot aux deux lignes. */}
        {motifRang && motifRang.length > 0 && (
          <div className="option-card__rang">Ce rang tient compte de : {describeReasons(motifRang, option.motifs)}</div>
        )}

        <div className="option-card__effet">{option.effet_attendu}</div>

        {/* R2 : le délai est posé À CÔTÉ de l'effet, jamais confronté à l'espérance de vie du patient
            par l'outil — cette mise en balance est l'arbitrage du praticien (invariant 2, aucun score
            caché). Formulation « Délai du bénéfice : X » plutôt que « Bénéfice attendu en X », qui
            deviendrait fautive pour les valeurs `immédiat` et `non établi`. */}
        {option.delai_benefice && (
          <div className="option-card__delai">Délai du bénéfice : {option.delai_benefice}</div>
        )}

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
      </details>
    </div>
  )
}
