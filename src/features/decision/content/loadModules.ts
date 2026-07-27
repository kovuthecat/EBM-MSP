/**
 * Agrège les modules de décision YAML (`/content/modules/<domaine>/*.yaml`) en objets `ModuleDecision`
 * typés (DECISIONS.md D22), sur le même mécanisme que `loadNodes.ts` : import eager au build, contenu
 * 100 % statique, aucun réseau au runtime (CLAUDE.md invariant 1).
 *
 * Le socle ne connaît aucun module par son nom (invariant CLAUDE.md 5) : tout vient du contenu. Un
 * domaine sans fichier de module fonctionne exactement comme avant — la liste des nœuds reste à plat.
 */
import type { ModuleDecision } from './module.types.ts'
import type { Noeud } from './node.types.ts'

const fichiers = import.meta.glob<{ default: ModuleDecision }>(
  '../../../../content/modules/**/*.yaml',
  { eager: true },
)

/** Tous les modules déclarés, tous domaines confondus. */
export const modules: ModuleDecision[] = Object.values(fichiers).map((mod) => mod.default)

/** Module par id (l'id est unique tous domaines confondus). */
export function getModuleById(id: string): ModuleDecision | undefined {
  return modules.find((module) => module.id === id)
}

/**
 * Module auquel appartient un nœud, s'il en a un. La jointure passe par `Noeud.module` ↔
 * `ModuleDecision.libelle` : un nœud peut porter `module` sans qu'aucun fichier de module n'existe
 * (c'était l'état du dépôt avant D22 — le champ était écrit et lu par personne), auquel cas cette
 * fonction renvoie `undefined` et l'écran de nœud se comporte comme avant.
 */
export function getModuleDuNoeud(noeud: Noeud): ModuleDecision | undefined {
  if (!noeud.module) return undefined
  return modules.find(
    (module) => module.libelle === noeud.module && module.domaine === noeud.domaine,
  )
}

/**
 * Entrées de la liste d'un domaine : un module compte pour UNE entrée (qui ouvre l'écran de module),
 * un nœud sans module compte pour lui-même. L'ordre suit celui des nœuds reçus — le module prend la
 * place de son PREMIER nœud, de sorte qu'un tri déjà appliqué en amont (`sortNodesForDomaine`) reste
 * respecté sans que cette fonction ait à connaître un ordre.
 */
export type EntreeListe =
  | { type: 'noeud'; noeud: Noeud }
  | { type: 'module'; module: ModuleDecision; noeuds: Noeud[] }

export function entreesListe(noeuds: Noeud[]): EntreeListe[] {
  const entrees: EntreeListe[] = []
  const modulesVus = new Map<string, { module: ModuleDecision; noeuds: Noeud[] }>()

  for (const noeud of noeuds) {
    const module = getModuleDuNoeud(noeud)
    if (!module) {
      entrees.push({ type: 'noeud', noeud })
      continue
    }
    const existant = modulesVus.get(module.id)
    if (existant) {
      existant.noeuds.push(noeud)
      continue
    }
    const groupe = { module, noeuds: [noeud] }
    modulesVus.set(module.id, groupe)
    entrees.push({ type: 'module', module, noeuds: groupe.noeuds })
  }

  return entrees
}
