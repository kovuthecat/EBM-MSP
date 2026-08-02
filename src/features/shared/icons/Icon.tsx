import { ICON_PATHS, type NomIcone } from './paths'
import './Icon.css'

interface IconProps {
  nom: NomIcone
  taille?: number
  libelle?: string
  className?: string
}

/**
 * Icône SVG générique (P11/S2, T-104) — tracés inline recopiés à la main depuis la maquette
 * `traiter-refonte-ergonomie-v2` (`paths.ts` détaille la source, ligne par ligne), amende D9
 * (« zéro icône MVP », 2026-07-22). Remplacera en S4→S7 les emoji et caractères ASCII qui tiennent
 * lieu d'icônes aujourd'hui (`OptionCard.tsx`, `CriteriaForm.tsx`, `DecisionNodeScreen.tsx`,
 * `HomeScreen.tsx`) — aucun consommateur câblé dans cette session, le kit est créé seul.
 *
 * Décoratif par défaut (`aria-hidden`), comme les deux usages actuels d'emoji qu'elle remplacera
 * (`OptionCard.tsx` l.265, `CriteriaForm.tsx` l.555) : le texte à côté porte déjà l'information.
 * Passer `libelle` bascule vers `role="img"` + `aria-label`, pour les rares cas où l'icône serait
 * seule porteuse de sens.
 *
 * La couleur vient toujours de `currentColor` (jamais de couleur en dur dans un tracé, cf. `paths.ts`)
 * — c'est ce qui permet aux tons du composant appelant de la piloter.
 */
export function Icon({ nom, taille = 14, libelle, className }: IconProps) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={libelle ? undefined : 'true'}
      role={libelle ? 'img' : undefined}
      aria-label={libelle}
    >
      {ICON_PATHS[nom]}
    </svg>
  )
}
