/// <reference types="@modyfi/vite-plugin-yaml/modules" />

/**
 * Variables d'environnement Supabase (module Veille uniquement, D51) — cf. `src/lib/supabase.ts`.
 * Copier `.env.example` en `.env.local` (non commité) et renseigner les valeurs.
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
