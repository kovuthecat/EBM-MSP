/**
 * Agrège les entrées de veille YAML (`/content/veille/<AAAA-Www>/*.yaml`) en objets `EntreeVeille`
 * typés, importés au build par le plugin Vite YAML — même mécanique que `decision/content/loadNodes.ts`.
 *
 * Import eager : le contenu est statique. Le module Veille n'a pas la contrainte « aucun réseau »
 * du module Décision (CLAUDE.md invariant 1), mais rien ici ne justifie un chargement différé tant
 * que le corpus tient en quelques dizaines d'entrées.
 */
import type { EntreeVeille } from './entree.types.ts'

const modules = import.meta.glob<{ default: EntreeVeille }>(
  '../../../../content/veille/**/*.yaml',
  { eager: true },
)

/** Toutes les entrées, toutes semaines confondues. */
export const entrees: EntreeVeille[] = Object.values(modules).map((mod) => mod.default)

/**
 * Semaines présentes dans le corpus, de la plus récente à la plus ancienne.
 * Le format `AAAA-Www` se trie lexicographiquement dans l'ordre chronologique — propriété voulue
 * de la convention (SOP §3), pas un hasard.
 */
export const semaines: string[] = [...new Set(entrees.map((e) => e.date_semaine))].sort().reverse()

/** Thèmes réellement présents dans le corpus (jamais la taxonomie complète : un filtre qui ne renvoie rien est un filtre mort). */
export const themesPresents: string[] = [...new Set(entrees.flatMap((e) => e.themes))].sort()

/** Professions réellement présentes dans le corpus. */
export const professionsPresentes: string[] = [
  ...new Set(entrees.flatMap((e) => e.professions_concernees)),
].sort()

/** Entrée par id (unique toutes semaines confondues). */
export function getEntreeById(id: string): EntreeVeille | undefined {
  return entrees.find((entree) => entree.id === id)
}
