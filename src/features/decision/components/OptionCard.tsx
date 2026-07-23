import { EvidenceBadge } from '../../shared/badges/EvidenceBadge'
import type { Option } from '../content/node.types'
import { describeReasons } from '../lib/conditionText'
import { toSharedNiveauPreuve } from '../lib/labels'
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
  /** Conditions satisfaites pour cette option (`evaluateNode(...).reasons.get(option)`). */
  reasons: string[]
}

/**
 * Carte d'option applicable (T-006 étape 2) : intitulé, badge de mise en avant, badge preuve, effet
 * attendu, avantages/inconvénients (qui portent déjà la position critique — D12), contre-indications
 * si renseignées, et la ligne « Pourquoi cette option » dérivée des conditions satisfaites (`lib/conditionText.ts`).
 */
export function OptionCard({ option, badge, reasons }: OptionCardProps) {
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

      <div className="option-card__pourquoi">Pourquoi cette option : {describeReasons(reasons)}</div>
    </div>
  )
}
