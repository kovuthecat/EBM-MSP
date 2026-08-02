import { createElement, Fragment, type ReactNode } from 'react'

/**
 * Union fermée des icônes du kit (P11/S2, T-104) — amende D9 (« zéro icône MVP », 2026-07-22).
 * Chaque tracé est recopié tel quel depuis la maquette
 * `design/maquettes/traiter-refonte-ergonomie-v2/Traiter - Refonte ergonomie.dc.html` (ligne notée en
 * commentaire ci-dessous, dans `ICON_PATHS`). Les 4 icônes sans équivalent dans la maquette (`plus`,
 * `moins`, `echange`, `interdit`) sont tracées à la main dans le même style (viewBox 24×24, traits,
 * extrémités arrondies, gabarit hampe/pointe identique à `fleche-haut`/`fleche-bas-pleine`).
 *
 * Dictionnaire sur une union fermée, même motif que `ACTION_ICON: Record<ActionOption, string>`
 * (`OptionCard.tsx` l.107) : le compilateur signale toute valeur manquante, pas de repli silencieux.
 *
 * Fichier `.ts` (pas `.tsx`, comme demandé) : les tracés sont construits avec `createElement`, pas de
 * JSX, pour rester du TypeScript pur sans transform JSX.
 */
export type NomIcone =
  | 'chevron-bas'
  | 'chevron-gauche'
  | 'chevron-droite'
  | 'fleche-bas'
  | 'fleche-droite'
  | 'fleche-haut'
  | 'fleche-bas-pleine'
  | 'lecture'
  | 'reglages'
  | 'plus'
  | 'moins'
  | 'echange'
  | 'interdit'
  | 'triangle-alerte'
  | 'info'
  | 'gelule'
  | 'drapeau'

/**
 * Tracés : le contenu interne du `<svg>` (les enfants), jamais l'élément `<svg>` lui-même — `Icon.tsx`
 * porte `viewBox`, `stroke`, `fill`, `strokeWidth`, `strokeLinecap`, `strokeLinejoin`. Deux tracés sont
 * pleins (`lecture`, `drapeau`, comme dans la maquette) : ils posent `fill: 'currentColor'` et annulent
 * localement le `stroke="currentColor"` hérité du composant avec `stroke: 'none'`. Aucune couleur en
 * dur nulle part : uniquement `currentColor` / `none`.
 */
export const ICON_PATHS: Record<NomIcone, ReactNode> = {
  // maquette l.36 (marqueur d'accordéon) — même tracé qu'en l.100/l.180/l.279 (chevron bas générique
  // répété à chaque en-tête de section pliable)
  'chevron-bas': createElement('polyline', { points: '6 9 12 15 18 9' }),

  // maquette l.18 (bouton retour « Domaine : … »)
  'chevron-gauche': createElement('polyline', { points: '15 18 9 12 15 6' }),

  // dérivé de chevron-gauche par symétrie horizontale (axe x=12, viewBox 24×24) — aucun tracé maquette
  // pour ce sens
  'chevron-droite': createElement('polyline', { points: '9 18 15 12 9 6' }),

  // maquette l.343 (CTA flottant « Voir les recommandations ») — même tracé que chevron-bas ; noms
  // distincts car les deux usages (accordéon vs CTA de défilement) ne seront jamais interchangés
  'fleche-bas': createElement('polyline', { points: '6 9 12 15 18 9' }),

  // dérivé de fleche-haut (maquette l.43) par rotation de 90° — même gabarit hampe + pointe
  'fleche-droite': createElement(
    Fragment,
    null,
    createElement('line', { x1: '5', y1: '12', x2: '19', y2: '12' }),
    createElement('polyline', { points: '13 6 19 12 13 18' }),
  ),

  // maquette l.43 (« Intensifier »)
  'fleche-haut': createElement(
    Fragment,
    null,
    createElement('line', { x1: '12', y1: '19', x2: '12', y2: '5' }),
    createElement('polyline', { points: '6 11 12 5 18 11' }),
  ),

  // maquette l.44 (« Déprescrire ») — flèche complète (hampe + pointe), à distinguer du chevron nu
  // `fleche-bas`
  'fleche-bas-pleine': createElement(
    Fragment,
    null,
    createElement('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
    createElement('polyline', { points: '18 13 12 19 6 13' }),
  ),

  // maquette l.41 (« Initier ») — tracé plein, annule le stroke hérité
  lecture: createElement('path', { d: 'M6 4 L20 12 L6 20 Z', fill: 'currentColor', stroke: 'none' }),

  // maquette l.42 (« Optimiser »)
  reglages: createElement(
    Fragment,
    null,
    createElement('line', { x1: '4', y1: '7', x2: '20', y2: '7' }),
    createElement('line', { x1: '4', y1: '12', x2: '14', y2: '12' }),
    createElement('line', { x1: '4', y1: '17', x2: '17', y2: '17' }),
  ),

  // à tracer (aucun équivalent maquette) — croix simple, même gabarit que fleche-droite/plus
  plus: createElement(
    Fragment,
    null,
    createElement('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
    createElement('line', { x1: '5', y1: '12', x2: '19', y2: '12' }),
  ),

  // à tracer
  moins: createElement('line', { x1: '5', y1: '12', x2: '19', y2: '12' }),

  // à tracer — deux flèches opposées (haut : vers la droite, bas : vers la gauche), même gabarit
  // tête/hampe que fleche-haut/fleche-bas-pleine
  echange: createElement(
    Fragment,
    null,
    createElement('line', { x1: '4', y1: '8', x2: '16', y2: '8' }),
    createElement('polyline', { points: '14 4 18 8 14 12' }),
    createElement('line', { x1: '20', y1: '16', x2: '8', y2: '16' }),
    createElement('polyline', { points: '10 12 6 16 10 20' }),
  ),

  // à tracer — pictogramme universel d'interdiction (cercle barré), même rayon que
  // `info`/`triangle-alerte`
  interdit: createElement(
    Fragment,
    null,
    createElement('circle', { cx: '12', cy: '12', r: '9' }),
    createElement('line', { x1: '5.5', y1: '18.5', x2: '18.5', y2: '5.5' }),
  ),

  // maquette l.278 (pastille « contre-indications » de la carte d'option)
  'triangle-alerte': createElement(
    Fragment,
    null,
    createElement('path', { d: 'M12 3 L22 20 H2 Z' }),
    createElement('line', { x1: '12', y1: '9', x2: '12', y2: '14' }),
    createElement('circle', { cx: '12', cy: '17', r: '0.7', fill: 'currentColor', stroke: 'none' }),
  ),

  // maquette l.221 (« Risque hypoglycémique du schéma »), identique en l.276 (« proposé parce que »)
  info: createElement(
    Fragment,
    null,
    createElement('circle', { cx: '12', cy: '12', r: '9' }),
    createElement('line', { x1: '12', y1: '11', x2: '12', y2: '16' }),
    createElement('circle', { cx: '12', cy: '7.5', r: '0.9', fill: 'currentColor', stroke: 'none' }),
  ),

  // maquette l.277 (pastille « posologie »)
  gelule: createElement(
    Fragment,
    null,
    createElement('rect', {
      x: '3',
      y: '9',
      width: '18',
      height: '6',
      rx: '3',
      transform: 'rotate(-35 12 12)',
    }),
    createElement('line', { x1: '12', y1: '8', x2: '12', y2: '16', transform: 'rotate(-35 12 12)' }),
  ),

  // maquette l.187 (signal d'alerte) — tracé plein, annule le stroke hérité
  drapeau: createElement('path', {
    d: 'M5 3v18h1.5v-6.5H18l-2.5-4L18 6H6.5V3z',
    fill: 'currentColor',
    stroke: 'none',
  }),
}
