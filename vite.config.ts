/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@modyfi/vite-plugin-yaml'

// https://vite.dev/config/
export default defineConfig({
  // yaml() : contenu Décision versionné en YAML (/content), importé en objets JS au build
  // (DECISIONS.md D3/D9). Le moteur/l'UI ne lisent jamais de YAML brut au runtime.
  plugins: [react(), yaml()],
  test: {
    // Exclut les worktrees temporaires des agents Claude Code (isolation:"worktree",
    // .claude/worktrees/<id>/) : ce sont des clones complets du dépôt, non exclus par les
    // défauts vitest (qui ne couvrent que .git/.cache, pas .claude) — sans ce garde, `npm test`
    // exécute deux fois chaque suite dès qu'un worktree existe encore sur disque.
    exclude: ['**/node_modules/**', '**/dist/**', '**/.git/**', '.claude/worktrees/**'],
  },
})
