import { EvidenceBadge } from '../../shared/badges/EvidenceBadge'
import type { Option } from '../content/node.types'
import { describeReasons } from '../lib/conditionText'
import { toSharedNiveauPreuve } from '../lib/labels'
import './OptionCard.css'

interface OptionCardProps {
  option: Option
  /** 1re option applicable (ordre du nœud, `evaluateNode`) : badge « Recommandée » (T-006 étape 2). */
  isPrimary: boolean
  /** Conditions satisfaites pour cette option (`evaluateNode(...).reasons.get(option)`). */
  reasons: string[]
}

/**
 * Carte d'option applicable (T-006 étape 2) : intitulé, badge « Recommandée » sur la 1re, badge
 * preuve, effet attendu, avantages/inconvénients, contre-indications si renseignées, et la ligne
 * « Pourquoi cette option » dérivée des conditions satisfaites par le moteur (`lib/conditionText.ts`).
 */
export function OptionCard({ option, isPrimary, reasons }: OptionCardProps) {
  return (
    <div className={isPrimary ? 'option-card option-card--primary' : 'option-card'}>
      <div className="option-card__header">
        <div className="option-card__title">{option.intitule}</div>
        <div className="option-card__badges">
          {isPrimary && <span className="option-card__recommended-badge">Recommandée</span>}
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
