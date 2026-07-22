/**
 * Agrège tous les nœuds de décision YAML (`/content/noeuds/<domaine>/*.yaml`) en objets `Noeud`
 * typés, importés au build via le plugin Vite YAML (DECISIONS.md D9). Import eager : le contenu
 * Décision est 100 % statique (CLAUDE.md invariant 1 — aucun réseau au runtime).
 *
 * Le module et l'UI ne connaissent aucun domaine par son nom (DECISIONS.md D8) : cette agrégation
 * regroupe simplement par le champ `domaine` porté par chaque nœud, pour préparer le multi-domaine.
 */
import type { Noeud } from './node.types.ts'

const modules = import.meta.glob<{ default: Noeud }>(
  '../../../../content/noeuds/**/*.yaml',
  { eager: true },
)

/** Tous les nœuds de décision, tous domaines confondus. */
export const noeuds: Noeud[] = Object.values(modules).map((mod) => mod.default)

/** Nœuds regroupés par domaine (ex. `diabete-type-2`). */
export const noeudsParDomaine: Record<string, Noeud[]> = noeuds.reduce<Record<string, Noeud[]>>(
  (acc, noeud) => {
    const liste = acc[noeud.domaine] ?? []
    liste.push(noeud)
    acc[noeud.domaine] = liste
    return acc
  },
  {},
)

/** Nœud par id (l'id est unique tous domaines confondus). */
export function getNoeudById(id: string): Noeud | undefined {
  return noeuds.find((noeud) => noeud.id === id)
}

/** Nœuds d'un domaine donné (tableau vide si le domaine est inconnu). */
export function getNoeudsByDomaine(domaine: string): Noeud[] {
  return noeudsParDomaine[domaine] ?? []
}
