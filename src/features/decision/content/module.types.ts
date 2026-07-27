/**
 * Types TS miroir de `schema/module.schema.json` (DECISIONS.md D22). Source de vérité = le schéma JSON ;
 * ces types le reflètent 1:1, comme `node.types.ts` pour les nœuds.
 *
 * Un MODULE regroupe plusieurs nœuds d'un même domaine et porte ce qu'ils ont en COMMUN : un cadrage
 * partagé (posé une fois plutôt que répété nœud par nœud — invariant I4) et un primer qui oriente vers le
 * bon nœud. La jointure module ↔ nœuds se fait par `libelle` ↔ `Noeud.module`.
 *
 * GARDE-FOU R1 (D22, § Conséquences), à ne pas éroder : un module est un **flux d'écran**, jamais un
 * chaînage obligatoire. Aucun critère n'y est saisi, aucune valeur n'est transmise à un nœud, et chaque
 * nœud reste évaluable seul. Le moteur ignore totalement ce type — il n'apparaît dans aucune évaluation.
 */
import type { Meta } from './node.types.ts'

/** Une voie du primer : vers quel nœud orienter, et ce qui, en consultation, y oriente. */
export interface Orientation {
  /** Id du nœud cible. Doit exister ET appartenir au module (intégrité vérifiée par un test). */
  noeud: string
  libelle: string
  /**
   * Ce qui oriente vers ce nœud. AIDE AU CHOIX, jamais une condition : rien n'est évalué ici, et le
   * praticien reste libre d'ouvrir n'importe quel nœud du module — y compris celui dont aucun indice
   * ne correspond. En faire une règle transformerait le primer en chaînage, ce que D22 interdit.
   */
  indices?: string[]
}

export interface Primer {
  question: string
  orientations: Orientation[]
}

export interface ModuleDecision {
  id: string
  domaine: string
  /** Valeur de jointure : égale au champ `module` des nœuds du module (ex. `RHD`). */
  libelle: string
  titre: string
  population_cible?: string
  /**
   * Préambule PARTAGÉ — mêmes règles que `Noeud.cadrage` (D24) : énoncés vrais pour tous les patients du
   * module, sans condition, jamais un avertissement. C'est ce qui évite de répéter le même cadrage dans
   * chaque nœud.
   */
  cadrage: string[]
  primer: Primer
  meta: Meta
}
