/**
 * Transforme un identifiant de contenu (snake_case / kebab-case, ex. `esperance_vie`,
 * `diabete-type-2`) en libellé d'affichage générique, pour les cas où aucun libellé dédié n'existe
 * dans `labels.ts`. Purement mécanique (remplace `_`/`-` par des espaces, majuscule initiale) — ne
 * connaît aucun domaine, nœud ou critère par son nom (CLAUDE.md invariant 5, DECISIONS.md D8).
 *
 * Limite assumée : les accents ne sont pas restitués (rien dans le slug ne permet de les déduire),
 * ex. "anciennete" reste sans son "é". Fallback honnête plutôt qu'un libellé inventé ; `labels.ts`
 * couvre les identifiants connus (dictionnaire `docs/decision/CADRAGE-8-noeuds.md` §0) avec la bonne
 * orthographe, ce fallback ne s'applique qu'aux identifiants pas encore catalogués.
 */
export function humanize(identifier: string): string {
  const withSpaces = identifier.replace(/[_-]+/g, ' ').trim()
  if (withSpaces.length === 0) return identifier
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}
