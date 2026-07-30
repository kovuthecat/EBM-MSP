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
   * la condition qui a fixé le rang de CETTE option parmi les autres de sa famille, DSL brut à humaniser
   * comme `reasons`. `undefined` la plupart du temps (cf. docstring `OptionVue.motifRang` pour les
   * conditions d'affichage) — n'apparaît que quand ça compte cliniquement (deux options en concurrence
   * de rang réelle).
   */
  motifRang: string | undefined
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
 * Carte d'option applicable (T-006 étape 2), ALLÉGÉE le 2026-07-27 — arbitrage référent A5.
 *
 * POURQUOI. La recette visuelle a mesuré une carte à **0,71 à 1,06 écran** en largeur étroite : il faut
 * un défilement plein écran, parfois plus, pour passer d'une carte à la suivante, et un profil banal en
 * affiche cinq. Ce sont les avantages/inconvénients (3 à 6 puces longues) et le paragraphe d'effet
 * attendu qui font ce volume — les contre-indications, elles, ne pèsent que 11 à 18 % de la hauteur.
 *
 * DEUX REGISTRES, ET LA FRONTIÈRE N'EST PAS « COURT / LONG » MAIS « AGIR / S'INSTRUIRE ».
 *
 * SOCLE, jamais repliable — ce sur quoi le praticien AGIT dans la minute :
 *   - intitulé et badges (quel geste, avec quelle force et quel niveau de preuve), et depuis SB3 (P6,
 *     2026-07-28) une bordure gauche colorée selon `option.action` quand ce verbe existe ;
 *   - `option.alertes` — un fait de sécurité s'affiche avec son motif, il ne se déplie pas ;
 *   - `calculsEnAttente` (« Doses non calculées : … à renseigner : Poids ») — la pousser derrière un
 *     dépli ferait revenir le défaut J le jour même où A5 est livré ;
 *   - `calculs` (« Doses indicatives : 8 U/j ») — MON ARBITRAGE, à confirmer : une dose est ce qu'on
 *     prescrit, et il serait incohérent de montrer « dose non calculée » sans montrer la dose calculée ;
 *   - « Proposé parce que » et, quand il compte, le motif du rang (R6) : une ligne chacun, et c'est ce
 *     qui rend la carte auditable en consultation.
 *
 * `contre_indications` — DÉPLACÉ le 2026-07-28 (SB3, P6) DANS le dépli, en tête. Historique : T-025
 * (P4/S4, même jour) l'avait remonté ici même, hors dépli, avec un registre visuel de sécurité —
 * mesure directe d'un défaut de recette (« ce que je ne dois surtout pas faire » invisible au test des
 * 20 secondes, trois fois sur trois). SB3 rouvre cette tension pour compacter la carte plus loin, et
 * Thibault l'a tranchée le 2026-07-28 : compactage accepté, MAIS PAS AU PRIX DE L'ACCESSIBILITÉ — la CI
 * quitte le socle mais reste (a) en PREMIÈRE position du dépli, avant l'effet attendu, (b) dans le même
 * registre visuel (`--c-disclaimer-*`, inchangé), (c) annoncée carte FERMÉE par le libellé du
 * `<summary>` (calculé depuis `aDesContreIndications` ci-dessous), qui change selon sa présence —
 * c'est l'unique indicateur requis fermé, aucun nouveau composant, aucune infobulle au survol. Le
 * test des 20 secondes doit être REJOUÉ (S6, vague de contrôle du plan) : c'est la mesure qui dira si
 * ce compactage a coûté ce que T-025 avait gagné.
 *
 * DÉPLI (`<details>`), ce qui INSTRUIT la décision une fois qu'on veut l'approfondir : contre-indications
 * (en tête, depuis SB3), effet attendu, délai du bénéfice, avantages, inconvénients.
 *
 * `<details>` NATIF, et c'est un choix, pas une facilité : ouverture au clic/tap (jamais au survol —
 * A5 l'exige, un survol est inutilisable au doigt en consultation), état géré par le navigateur donc
 * aucun `useState` à synchroniser, et accessibilité clavier + lecteur d'écran acquise sans code — la
 * même exigence que A9 vient de poser sur les boutons segmentés.
 *
 * GARDE-FOU : `banc/carte-affichage.test.ts` (I12) vérifie sur les six nœuds RÉELS qu'aucun texte
 * d'alerte d'option ou de dose n'atterrit jamais à l'intérieur du dépli — et, depuis SB3, que toute
 * contre-indication est bien présente et précède l'effet attendu DANS le dépli (elle n'y est plus
 * absente, elle y est en tête).
 *
 * SUITE SB6 (P6, 2026-07-29) — le libellé neutre du `<summary>` ci-dessus (« Contre-indications, effet
 * attendu et plus », même couleur qu'« en savoir plus ») s'est révélé insuffisant : la recette de
 * contrôle S6 (point 3) a rejoué le test des 20 secondes et n'a RIEN retenu, alors que T-025 le faisait
 * retenir quasi mot pour mot. Le `<summary>` fermé porte désormais une affordance de danger explicite
 * (icône ⚠, couleur dédiée `--c-ci-warning`, décompte) quand `aDesContreIndications` — cf. plus bas.
 *
 * SUITE T-068 (P9, 2026-07-30) — UNE CONTRE-INDICATION PEUT DÉSORMAIS SE TAIRE. Jusqu'ici, TOUTE
 * contre-indication déclarée par le contenu s'affichait comme un avertissement actif, quels que soient
 * les critères saisis : une carte pouvait annoncer « ⚠ 3 contre-indications » dont deux étaient déjà
 * exclues par ce que le praticien venait de renseigner. Le contenu peut maintenant attacher une
 * `condition` (même DSL qu'`exclusions`) à une contre-indication vérifiable ; l'état qui en résulte
 * (`active` / `levee` / `indetermine`) est calculé par le moteur (`engine/evaluateNode.ts`
 * `evaluerContreIndications`), porté par le modèle de vue (`lib/vueDecision.ts`
 * `OptionVue.contreIndications`) et rendu ici. Une contre-indication levée est DÉSAMORCÉE, jamais
 * effacée (bloc « Ne s'applique pas à ce patient », plus bas) et ne compte plus dans le décompte du
 * `<summary>`. Aucun changement pour une contre-indication sans `condition` — c'est-à-dire, au jour de
 * cette livraison, pour la totalité du contenu existant.
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

  // SB3 : présence des contre-indications — pilote à la fois leur rendu (dans le dépli, cf. plus bas)
  // et le libellé du <summary>, seul indicateur requis carte FERMÉE (pas de nouvelle infobulle).
  //
  // T-068 (P9, 2026-07-30) : la liste est désormais SCINDÉE PAR ÉTAT. Les contre-indications `active` et
  // `indetermine` gardent le rendu d'avant, à l'octet près (même bloc, même libellé, même séparateur) ;
  // seules les `levee` — une `condition` que les critères saisis ont rendue FAUSSE — passent dans un
  // second bloc, en retrait. Sur tout contenu sans `condition` (100 % du contenu au jour de cette
  // livraison), `levees` est vide et cette carte rend exactement ce qu'elle rendait.
  const contreIndicationsVues = contreIndications ?? contreIndicationsParDefaut(option)
  const ciAffichees = contreIndicationsVues.filter((ci) => ci.etat !== 'levee')
  const ciLevees = contreIndicationsVues.filter((ci) => ci.etat === 'levee')
  const aDesContreIndications = ciAffichees.length > 0

  // SB6 (P6, 2026-07-29) — libellé + classe conditionnelle du <summary> fermé. Le décompte se déduit de
  // `contreIndications.length` : chaque `contre_indications` du YAML est UNE phrase (règle de contenu),
  // `.length` du tableau donne donc un compte clinique correct, pas un artefact de découpage de texte.
  //
  // T-068 : le décompte porte sur `ciAffichees`, PAS sur toutes les contre-indications déclarées — une
  // contre-indication levée ne doit plus gonfler ce chiffre (sans quoi le défaut corrigé ici persisterait
  // sous une autre forme : « ⚠ 3 contre-indications » dont deux ne concernent pas ce patient). Une
  // `indetermine` reste comptée, parce qu'elle reste AFFICHÉE comme active (D20) : le chiffre annoncé
  // carte fermée doit toujours être celui des lignes que le dépli va montrer dans le registre d'alerte,
  // jamais un compte plus flatteur que ce qu'on lit en l'ouvrant.
  const classeSummary = [
    'option-card__detail-summary',
    aDesContreIndications && 'option-card__detail-summary--ci',
  ]
    .filter(Boolean)
    .join(' ')
  const libelleSummary = aDesContreIndications
    ? `${ciAffichees.length} ${ciAffichees.length > 1 ? 'contre-indications' : 'contre-indication'}, effet attendu et plus`
    : 'Effet attendu, avantages et inconvénients'

  return (
    <div className={classeCarte}>
      <div className="option-card__header">
        <div className="option-card__title">{option.intitule}</div>
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

      <div className="option-card__pourquoi">Proposé parce que : {describeReasons(reasons)}</div>

      {/* R6 couche 2 : pourquoi CE rang parmi les autres options de la famille — seulement quand une
          vraie concurrence de rang existe (cf. `lib/vueDecision.ts` `OptionVue.motifRang`). */}
      {motifRang && <div className="option-card__rang">Ce rang tient compte de : {describeReasons([motifRang])}</div>}

      {/* A5 — LE DÉPLI. Tout ce qui instruit la décision sans être ce sur quoi on agit dans la minute.
          Fermé par défaut : c'est l'allègement lui-même, une carte ouverte n'allège rien. `<details>`
          natif (cf. docstring de tête) — le navigateur porte l'état, le clavier et le lecteur d'écran. */}
      <details className="option-card__detail">
        <summary className={classeSummary}>
          {/* Icône décorative : le décompte + le mot « contre-indication(s) » qui suivent portent déjà
              l'information en texte (lu par tout lecteur d'écran) — l'icône n'ajoute qu'un repère
              visuel, elle est donc masquée aux technologies d'assistance plutôt que doublée. */}
          {aDesContreIndications && (
            <span className="option-card__detail-summary-icon" aria-hidden="true">
              ⚠{' '}
            </span>
          )}
          {libelleSummary}
        </summary>

        {/* SB3 (P6, 2026-07-28) : contre-indications déplacées ici depuis le socle (où T-025, P4/S4,
            les avait remontées le même jour) — EN PREMIÈRE POSITION du dépli, avant l'effet attendu.
            Tension tranchée par Thibault le 2026-07-28 : compactage accepté, MAIS PAS AU PRIX DE
            L'ACCESSIBILITÉ — d'où le libellé du <summary> ci-dessus, seul indicateur requis carte
            FERMÉE. Registre visuel INCHANGÉ (`OptionCard.css`, `--c-disclaimer-*`, identique à
            `.alert-list__item--attention` d'`AlertList.css`) — surtout pas le registre ambre
            `--c-attention*` de « à confirmer » / « Doses non calculées », qui signale une saisie
            incomplète, jamais une interdiction clinique. */}
        {aDesContreIndications && (
          <div className="option-card__ci">
            <span className="option-card__ci-label">Contre-indications : </span>
            {ciAffichees.map((ci) => ci.texte).join(' · ')}
          </div>
        )}

        {/* T-068 (P9, 2026-07-30) — CONTRE-INDICATIONS DÉSAMORCÉES, jamais effacées. Une contre-indication
            dont la `condition` est FAUSSE pour ce patient (« insuffisance rénale sévère » chez quelqu'un
            dont le DFG saisi est normal) ne doit plus s'afficher comme un avertissement actif — mais elle
            ne doit pas non plus disparaître : c'est la même exigence de transparence que R4 pour les
            options écartées (`docs/decision/GRAMMAIRE-NOEUD.md`), qui les montre AVEC leur motif plutôt
            que de les retirer en silence. Le praticien doit pouvoir vérifier que l'outil a bien VU la
            contre-indication et sur quelle base il la juge sans objet — sinon il ne peut ni lui faire
            confiance, ni la contredire.

            Bloc SÉPARÉ, après les actives, dans un registre visuel neutre (`--levee` : estompé + barré,
            cf. `OptionCard.css`) et surtout PAS `--c-disclaimer-*`, le registre d'interdiction clinique du
            bloc ci-dessus : une contre-indication levée n'interdit rien. Le libellé porte la raison — les
            critères saisis l'excluent — sans réafficher la condition DSL elle-même (l'écran ne montre
            jamais de DSL brut, et humaniser une condition FAUSSE se lirait comme une affirmation). */}
        {ciLevees.length > 0 && (
          <div className="option-card__ci option-card__ci--levee">
            <span className="option-card__ci-label">Ne s'applique pas à ce patient : </span>
            <span className="option-card__ci-levee-texte">{ciLevees.map((ci) => ci.texte).join(' · ')}</span>
          </div>
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
