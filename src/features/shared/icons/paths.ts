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
  | 'coeur'
  | 'cible'
  | 'seringue'
  | 'loupe'
  | 'goutte'
  | 'poumons'
  | 'tensiometre'
  | 'coeur-pouls'
  | 'cerveau'
  | 'rein'
  | 'deprescription'

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

  // à tracer (aucun équivalent maquette) — pictogramme cœur classique, même gabarit que les tracés
  // pleins ci-dessus (lecture, drapeau) : deux lobes + pointe basse, `fill: currentColor`, stroke annulé.
  // Ajouté 2026-08-05 (T-149, écran de sélection des nœuds) pour l'entrée « Règles hygiéno-diététiques ».
  coeur: createElement('path', {
    d: 'M12 21s-7.5-4.6-10-9.1C.5 8.2 2.4 4.5 6 4.5c2 0 3.6 1.1 6 3.5 2.4-2.4 4-3.5 6-3.5 3.6 0 5.5 3.7 4 7.4C19.5 16.4 12 21 12 21z',
    fill: 'currentColor',
    stroke: 'none',
  }),

  // à tracer — cible/objectif (trois cercles concentriques), même rayon extérieur que info/interdit.
  // Ajouté 2026-08-05 (T-149) pour l'entrée « Fixer la cible d'HbA1c ».
  cible: createElement(
    Fragment,
    null,
    createElement('circle', { cx: '12', cy: '12', r: '9' }),
    createElement('circle', { cx: '12', cy: '12', r: '5' }),
    createElement('circle', { cx: '12', cy: '12', r: '1', fill: 'currentColor', stroke: 'none' }),
  ),

  // à tracer — seringue stylisée (corps + piston + aiguille), même gabarit trait que gelule ci-dessus.
  // Ajouté 2026-08-05 (T-149) pour l'entrée « Insulinothérapie du DT2 ».
  seringue: createElement(
    Fragment,
    null,
    createElement('line', { x1: '3', y1: '21', x2: '9', y2: '15' }),
    createElement('rect', {
      x: '8.5',
      y: '7.5',
      width: '11',
      height: '4.2',
      rx: '0.6',
      transform: 'rotate(-45 14 9.6)',
    }),
    createElement('line', {
      x1: '17.5',
      y1: '4.5',
      x2: '20',
      y2: '7',
      transform: 'rotate(0 0 0)',
    }),
    createElement('line', { x1: '16', y1: '3', x2: '18.5', y2: '5.5' }),
    createElement('line', { x1: '18', y1: '1', x2: '20.5', y2: '3.5' }),
  ),

  // à tracer (aucun équivalent maquette) — loupe classique (cercle + manche), pictogramme universel de
  // recherche/veille. Ajouté 2026-08-06 (T-151) pour la carte « Veille hebdomadaire » de l'accueil,
  // remplace `lecture` (triangle « lire/ouvrir », moins spécifique à l'idée de veille documentaire).
  loupe: createElement(
    Fragment,
    null,
    createElement('circle', { cx: '10.5', cy: '10.5', r: '7' }),
    createElement('line', { x1: '15.8', y1: '15.8', x2: '21', y2: '21' }),
  ),

  // à tracer (aucun équivalent maquette) — goutte classique (larme inversée, base arrondie, pointe en
  // haut), pictogramme universel de fluide/mesure capillaire. Ajoutée 2026-08-06 (T-152) pour le domaine
  // Diabète de type 2 (glycémie capillaire) sur l'écran de sélection des domaines.
  goutte: createElement('path', {
    d: 'M12 3 C12 3 6 11 6 15.5 C6 19 8.7 21 12 21 C15.3 21 18 19 18 15.5 C18 11 12 3 12 3 Z',
  }),

  // à tracer (aucun équivalent maquette) — deux poumons stylisés (deux lobes symétriques + trachée),
  // pictogramme universel de l'appareil respiratoire. Ajoutée 2026-08-06 (T-152) pour le domaine BPCO.
  poumons: createElement(
    Fragment,
    null,
    createElement('line', { x1: '12', y1: '3', x2: '12', y2: '10' }),
    createElement('path', { d: 'M12 8 C9 8 7 10 7 14 C7 18 8 21 6 21 C4.5 21 4 18 4 14 C4 10 6 8 9 8' }),
    createElement('path', { d: 'M12 8 C15 8 17 10 17 14 C17 18 16 21 18 21 C19.5 21 20 18 20 14 C20 10 18 8 15 8' }),
  ),

  // à tracer (aucun équivalent maquette) — tensiomètre stylisé (cadran + aiguille), pictogramme de la
  // mesure de pression artérielle. Ajoutée 2026-08-06 (T-152, retour utilisateur — icônes de domaine
  // trop génériques dans un premier jet) pour le domaine Hypertension artérielle.
  tensiometre: createElement(
    Fragment,
    null,
    createElement('path', { d: 'M4 17 A8 8 0 0 1 20 17' }),
    createElement('line', { x1: '12', y1: '17', x2: '8.5', y2: '10.5' }),
    createElement('circle', { cx: '12', cy: '17', r: '1.3', fill: 'currentColor', stroke: 'none' }),
    createElement('line', { x1: '4', y1: '20', x2: '20', y2: '20' }),
  ),

  // à tracer — cœur EN CONTOUR (pas le tracé plein de `coeur` ci-dessus) traversé d'une ligne de pouls
  // (ECG), pictogramme du risque cardiovasculaire. Ajoutée 2026-08-06 (T-152, même retour utilisateur)
  // pour le domaine Risque cardiovasculaire — distinct de `coeur` (RHD, relation praticien-patient :
  // sens affectif) par la LIGNE DE POULS, qui porte tout le sens clinique ici.
  'coeur-pouls': createElement(
    Fragment,
    null,
    createElement('path', {
      d: 'M12 20s-7-4.3-9.4-8.5C1.2 8 2.9 4.7 6.2 4.7c1.9 0 3.4 1 5.8 3.3 2.4-2.3 3.9-3.3 5.8-3.3 3.3 0 5 3.3 3.6 6.8C19 15.7 12 20 12 20z',
    }),
    createElement('polyline', { points: '5 13 8.5 13 10 9.5 13 16.5 14.5 13 19 13' }),
  ),

  // à tracer — cerveau stylisé (ovale + sillon central + deux replis), pictogramme de la santé mentale.
  // Ajoutée 2026-08-06 (T-152, même retour utilisateur) pour le domaine Dépression — remplace la
  // réutilisation de `coeur`, jugée trop peu spécifique.
  cerveau: createElement(
    Fragment,
    null,
    createElement('ellipse', { cx: '12', cy: '12', rx: '9', ry: '7' }),
    createElement('line', { x1: '12', y1: '5.5', x2: '12', y2: '18.5' }),
    createElement('path', { d: 'M6.5 9.5 Q8.5 7.5 10.5 9.5' }),
    createElement('path', { d: 'M13.5 9.5 Q15.5 7.5 17.5 9.5' }),
  ),

  // à tracer — haricot (rein), pictogramme classique de l'appareil urinaire (silhouette concave côté
  // hile). Ajoutée 2026-08-06 (T-152, même retour utilisateur) pour le domaine Insuffisance rénale —
  // remplace la réutilisation de `goutte` (partagée avec le DT2, jugée peu spécifique).
  rein: createElement('path', {
    d: 'M8.5 3 C4.5 3 2.5 7 2.5 12 C2.5 17 4.5 21 8.5 21 C11.5 21 11.5 16.5 14 15 C17 13.5 17.5 10 14.5 9 C11.5 8 11.5 3 8.5 3 Z',
  }),

  // à tracer — gélule scindée en deux moitiés espacées, même gabarit trait que `gelule` (rotation -35°),
  // pictogramme de la RÉDUCTION d'un traitement (pas son ajout, à la différence de `gelule` pleine).
  // Ajoutée 2026-08-06 (T-152, même retour utilisateur) pour le domaine Déprescrire chez le sujet âgé —
  // remplace `moins` seul, jugé trop abstrait sans le contexte du médicament.
  deprescription: createElement(
    Fragment,
    null,
    createElement('rect', {
      x: '2.5',
      y: '9',
      width: '7',
      height: '4.2',
      rx: '1.5',
      transform: 'rotate(-35 12 12)',
    }),
    createElement('rect', {
      x: '14.5',
      y: '9',
      width: '7',
      height: '4.2',
      rx: '1.5',
      transform: 'rotate(-35 12 12)',
    }),
  ),
}
