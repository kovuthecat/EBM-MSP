/**
 * Connexion par prénom (menu déroulant) → email (D51, 2026-08-06, demande utilisateur « reprends le
 * système » de `annuaire-msp`). Port EXACT de `annuaire-msp/src/features/auth/memberLogins.ts` —
 * même liste, mêmes comptes (même projet Supabase, D51). Supabase Auth s'authentifie par email : ce
 * module traduit le prénom choisi en email AVANT `signInWithPassword`.
 *
 * ⚠️ Ajouter/retirer un membre = éditer CETTE liste ET celle de `annuaire-msp` (deux copies, pas de
 * source unique entre les deux dépôts). Les prénoms doivent rester **uniques**.
 */
export interface MemberLogin {
  prenom: string
  email: string
}

/** Trié par prénom pour l'affichage du menu déroulant. */
export const MEMBER_LOGINS: MemberLogin[] = [
  { prenom: 'Adèle', email: 'adele.labbe.le.picard@gmail.com' },
  { prenom: 'Anne', email: 'annekammerer.sf@gmail.com' },
  { prenom: 'Antonin', email: 'amathieu@mspmenilmontant.fr' },
  { prenom: 'Aurélien', email: 'aurelien.descarpentries@gmail.com' },
  { prenom: 'Cécile', email: 'cecilegatter@gmail.com' },
  { prenom: 'Charlène', email: 'charly.lemet@gmail.com' },
  { prenom: 'Elena', email: 'elena.nasreddine@gmail.com' },
  { prenom: 'Estelle', email: 'gregoreestelle@gmail.com' },
  { prenom: 'Maylis', email: 'mbayleorthophoniste@gmail.com' },
  { prenom: 'Thibault', email: 'ipamspmenilmontant@tuta.com' },
]

/** Email associé à un prénom, ou `undefined` si le prénom n'est pas dans la liste. */
export function emailForPrenom(prenom: string): string | undefined {
  return MEMBER_LOGINS.find((m) => m.prenom === prenom)?.email
}
