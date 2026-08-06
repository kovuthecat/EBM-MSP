import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabase'

/**
 * État d'authentification Supabase (D51) — utilisé par `AccountMenu`, `AuthScreen`,
 * `VeilleListScreen` (garder/masquer) et `FeedbackWidget`. Même instance/comptes que
 * `annuaire-msp` (cf. `lib/supabase.ts`) ; concerne UNIQUEMENT le module Veille (le module
 * Décision reste 100 % statique, zéro réseau — CLAUDE.md invariant 1).
 *
 * `undefined` = session pas encore résolue (premier rendu, avant la réponse de
 * `getSession()`) ; `null` = déconnecté ; `User` = connecté. Distinguer les deux premiers
 * évite un flash « Invité » avant qu'une session persistée ne soit restaurée.
 */
export function useUtilisateur(): User | null | undefined {
  const [utilisateur, setUtilisateur] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    let actif = true
    supabase.auth.getSession().then(({ data }) => {
      if (actif) setUtilisateur(data.session?.user ?? null)
    })
    const { data: abonnement } = supabase.auth.onAuthStateChange((_event, session) => {
      if (actif) setUtilisateur(session?.user ?? null)
    })
    return () => {
      actif = false
      abonnement.subscription.unsubscribe()
    }
  }, [])

  return utilisateur
}

export async function seConnecter(email: string, motDePasse: string): Promise<string | null> {
  const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse })
  return error ? error.message : null
}

export async function seDeconnecter(): Promise<void> {
  await supabase.auth.signOut()
}
