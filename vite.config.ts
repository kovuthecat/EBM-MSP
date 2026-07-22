import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@modyfi/vite-plugin-yaml'

// https://vite.dev/config/
export default defineConfig({
  // yaml() : contenu Décision versionné en YAML (/content), importé en objets JS au build
  // (DECISIONS.md D3/D9). Le moteur/l'UI ne lisent jamais de YAML brut au runtime.
  plugins: [react(), yaml()],
})
