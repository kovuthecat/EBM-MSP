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
 * « Badges lisibles ... code visuel cohérent entre les deux modules »). Un rendu en points a été
 * essayé (P11/S5, T-109 — justifié par la carte d'option en une ligne) puis **révoqué par arbitrage
 * référent du 2026-08-02** (P11/S10, T-117) : retour à la pastille de texte. La rangée d'`OptionCard`
 * tient désormais grâce à l'élargissement de la mise en page (T-118), pas grâce au badge.
 * Couleurs = tokens `--c-badge-preuve-*` (`tokens.css`). `tres-faible` a maintenant son propre
 * style : les 4 niveaux sont visuellement distincts (avant P11/S10, `tres-faible` retombait sur le
 * style de `faible`, dette documentée depuis P1).
 */
export function EvidenceBadge({ niveau }: EvidenceBadgeProps) {
  return <span className={`evidence-badge evidence-badge--${niveau}`}>{LABELS[niveau]}</span>
}
