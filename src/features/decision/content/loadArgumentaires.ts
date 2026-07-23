/**
 * Charge les argumentaires exhaustifs (niveau 3 de lecture, DECISIONS.md D11) : un fichier Markdown
 * brut par nœud (`content/noeuds/<domaine>/<id>.argumentaire.md`), importé tel quel au build via le
 * suffixe `?raw` de Vite (aucun rendu Markdown interprété ici — cf. `components/MiniMarkdown.tsx`,
 * qui l'affiche sans dépendance runtime ajoutée, CLAUDE.md invariant 8). Import eager, cohérent avec
 * `loadNodes.ts` (contenu 100 % statique, aucun réseau au runtime).
 */
const modules = import.meta.glob<string>('../../../../content/noeuds/**/*.argumentaire.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

/** Table `nom de fichier tel que déclaré par `argumentaire_exhaustif`` → contenu Markdown brut. */
const parNomDeFichier: Record<string, string> = {}
for (const [chemin, contenu] of Object.entries(modules)) {
  const nomDeFichier = chemin.split('/').pop()
  if (nomDeFichier) parNomDeFichier[nomDeFichier] = contenu
}

/** Contenu de l'argumentaire exhaustif d'un nœud, si le fichier référencé existe. */
export function getArgumentaireExhaustif(nomDeFichier: string | undefined): string | undefined {
  if (!nomDeFichier) return undefined
  return parNomDeFichier[nomDeFichier]
}
