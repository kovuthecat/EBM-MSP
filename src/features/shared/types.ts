/**
 * Types partagés entre les modules Décision et Veille (socle générique,
 * cf. CLAUDE.md invariant 5 : `shared` ne connaît aucun domaine ni nœud).
 */

/** Échelle GRADE simplifiée (ARCHITECTURE.md « Principe transverse d'affichage »). */
export type NiveauPreuve = 'eleve' | 'modere' | 'faible' | 'tres-faible'

/** Niveau d'impact d'une entrée de veille (pratique = action possible / informatif = contexte). */
export type NiveauImpact = 'pratique' | 'informatif'
