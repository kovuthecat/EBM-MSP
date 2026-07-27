import { EvidenceBadge } from '../../shared/badges/EvidenceBadge'
import type { Alerte, Option } from '../content/node.types'
import { describeReasons } from '../lib/conditionText'
import { labelForCritere, toSharedNiveauPreuve } from '../lib/labels'
import type { CalculAffiche, CalculEnAttente } from '../lib/vueDecision'
import { AlertList } from './AlertList'
import './OptionCard.css'

interface OptionCardProps {
  option: Option
  /**
   * Badge en tête de carte (T-006 étape 2 ; D16) :
   * - `'recommandee'` — 1re option EBM la plus indiquée (hors socle « toujours ») ;
   * - `'reco-officielle'` — option « toujours » (ex. socle metformine) : maintenue par la reco
   *   officielle française, à distinguer du badge EBM ci-dessus (le socle n'est pas « la » sortie
   *   la plus indiquée par les données, juste ce que la reco officielle maintient en 1re intention) ;
   * - `null` — carte non mise en avant.
   */
  badge: 'recommandee' | 'reco-officielle' | null
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
}

/**
 * Carte d'option applicable (T-006 étape 2) : intitulé, badge de mise en avant, badge preuve, effet
 * attendu, avantages/inconvénients (qui portent déjà la position critique — D12), contre-indications
 * si renseignées, les alertes propres à l'option (jamais affichées pour une option écartée ou non
 * retenue, puisque cette carte n'existe alors pas — cf. `lib/vueDecision.ts` `OptionVue.alertes`), la
 * ligne « Proposé parce que » dérivée des termes réellement vrais pour ce patient (R6,
 * `lib/conditionText.ts`), et — quand elle compte — le motif du rang parmi les options de sa famille.
 */
export function OptionCard({ option, badge, reasons, calculs, calculsEnAttente, motifRang, alertes }: OptionCardProps) {
  return (
    <div className={badge ? 'option-card option-card--primary' : 'option-card'}>
      <div className="option-card__header">
        <div className="option-card__title">{option.intitule}</div>
        <div className="option-card__badges">
          {badge === 'recommandee' && <span className="option-card__recommended-badge">Recommandée</span>}
          {badge === 'reco-officielle' && (
            <span className="option-card__official-badge">Recommandation officielle (France)</span>
          )}
          <EvidenceBadge niveau={toSharedNiveauPreuve(option.niveau_preuve)} />
        </div>
      </div>

      <div className="option-card__effet">{option.effet_attendu}</div>

      {/* R2 : le délai est posé À CÔTÉ de l'effet, jamais confronté à l'espérance de vie du patient par
          l'outil — cette mise en balance est l'arbitrage du praticien (invariant 2, aucun score caché).
          Formulation « Délai du bénéfice : X » plutôt que « Bénéfice attendu en X », qui deviendrait
          fautive pour les valeurs `immédiat` et `non établi`. */}
      {option.delai_benefice && (
        <div className="option-card__delai">Délai du bénéfice : {option.delai_benefice}</div>
      )}

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

      {option.contre_indications && option.contre_indications.length > 0 && (
        <div className="option-card__ci">
          <span className="option-card__ci-label">Contre-indications : </span>
          {option.contre_indications.join(' · ')}
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
    </div>
  )
}
