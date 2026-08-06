import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase singleton — MÊME INSTANCE que `annuaire-msp` (D51, 2026-08-06, décision Thibault) :
 * les comptes de la MSP sont les mêmes personnes des deux côtés, `auth.users`/`public.members`
 * (`public.is_member()`) sont réutilisés tels quels plutôt que redupliqués. AUCUNE session partagée
 * entre les deux apps (deux origines, deux `localStorage` — Thibault a tranché : une connexion par
 * appareil et par app est acceptable). Ce module ne concerne QUE le module Veille (comptes = garder/
 * masquer des entrées) : le module Décision reste 100 % statique, zéro réseau au runtime
 * (CLAUDE.md invariant 1) — ne JAMAIS importer ce fichier depuis `features/decision/`.
 *
 * Session persistée sur le poste (`persistSession`) et rafraîchie automatiquement
 * (`autoRefreshToken`), même choix que l'annuaire (DECISIONS.md §Auth, 2026-07-16) : on se connecte
 * une fois par appareil et on y reste.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variables d'environnement Supabase manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY " +
      'doivent être définies (copier .env.example en .env.local et renseigner les valeurs — mêmes ' +
      "valeurs que `annuaire-msp/.env.local`, D51).",
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
