import type { NiveauPreuve } from '../types'
import './EvidenceBadge.css'

interface EvidenceBadgeProps {
  niveau: NiveauPreuve
}

/**
 * Libellés d'affichage du niveau de preuve (échelle GRADE simplifiée, ARCHITECTURE.md
 * « Principe transverse d'affichage »). Enum fermée (4 valeurs, `shared/types.ts`) : dictionnaire
 * exhaustif sûr, TypeScript signale toute valeur manquante — à distinguer des libellés dérivés du
 * contenu libre (domaine, critère…) qui doivent rester génériques (cf. `decision/lib/labels.ts`).
 */
const LABELS: Record<NiveauPreuve, string> = {
  eleve: 'Preuve élevée',
  modere: 'Preuve modérée',
  faible: 'Preuve faible',
  'tres-faible': 'Preuve très faible',
}

/**
 * Badge « niveau de preuve », commun aux modules Décision et Veille (ARCHITECTURE.md :
 * « Badges lisibles ... code visuel cohérent entre les deux modules »). Prévu « optionnel » en S1
 * (`plans/P1/S1.md` T-001), jamais livré ; construit ici (S4) car T-006 (D3) le réutilise pour
 * chaque option. Couleurs = tokens `--c-badge-preuve-*` (`tokens.css`, valeurs exactes du prototype).
 *
 * NB « très faible » : le token CSS dédié n'existe pas encore (`tokens.css` l.35-36 — non présent
 * dans le bloc du prototype lu en S1, à fixer lors de la session Veille). Ce niveau n'apparaît dans
 * aucun contenu réel de P1 (cible-glycemique n'utilise que modere/faible) ; en attendant, le style
 * retombe sur la variante « faible » (cf. `EvidenceBadge.css`).
 */
export function EvidenceBadge({ niveau }: EvidenceBadgeProps) {
  return <span className={`evidence-badge evidence-badge--${niveau}`}>{LABELS[niveau]}</span>
}
