/**
 * Agrège tous les nœuds de décision YAML (`/content/decision/noeuds/<domaine>/*.yaml`) en objets `Noeud`
 * typés, importés au build via le plugin Vite YAML (DECISIONS.md D9). Import eager : le contenu
 * Décision est 100 % statique (CLAUDE.md invariant 1 — aucun réseau au runtime).
 *
 * Le module et l'UI ne connaissent aucun domaine par son nom (DECISIONS.md D8) : cette agrégation
 * regroupe simplement par le champ `domaine` porté par chaque nœud, pour préparer le multi-domaine.
 *
 * RÉSOLUTION DES CRITÈRES COMMUNS (T-188, P14/S15), AJOUTÉE ICI ET NULLE PART AILLEURS. Un nœud peut
 * référencer une définition partagée (`content/decision/criteres-communs/<domaine>.yaml`) au lieu de
 * redéclarer un critère en entier — `{ ref: <nom> }`, augmenté des seuls champs de mise en scène locaux
 * (`CritereEntreeRef`, `node.types.ts`). Cette résolution a lieu ICI, à la construction d'`export const
 * noeuds`, AVANT que quoi que ce soit d'autre voie le nœud : le moteur (`engine/`), le formulaire et le
 * banc reçoivent donc toujours des `CritereEntree` complets et ignorent totalement ce mécanisme — c'est
 * le point de conception central de T-188 (plans/P14/S15.md § Décision clé, « le partage porte sur la
 * DÉFINITION, jamais sur la MISE EN SCÈNE »). Ne PAS déplacer cette résolution dans `engine/` : si son
 * fonctionnement semblait l'exiger, ce serait le signe d'un design mal compris (cf. § Si bloqué du plan).
 */
import type {
  CritereCommun,
  CritereEntree,
  CritereEntreeRef,
  FichierCriteresCommuns,
  Noeud,
  NoeudBrut,
} from './node.types.ts'

/**
 * Erreur de résolution d'un `{ ref }` (T-188) — MÊME POLITIQUE que `ConditionError` du moteur
 * (`engine/conditions.ts`) : jamais de repli silencieux, le message NOMME le nœud et le critère fautifs.
 * Définie ICI plutôt qu'importée du moteur : le CHARGEMENT du contenu ne dépend d'aucun module `engine/`
 * (couche en amont de lui, cf. `content.test.ts`/`modules.test.ts` — aucun fichier de `content/`
 * n'importe `engine/` à ce jour), et cette erreur est spécifique à ce mécanisme de chargement.
 */
export class CritereCommunError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CritereCommunError'
  }
}

const modules = import.meta.glob<{ default: NoeudBrut }>(
  '../../../../content/decision/noeuds/**/*.yaml',
  { eager: true },
)

const modulesCriteresCommuns = import.meta.glob<{ default: FichierCriteresCommuns }>(
  '../../../../content/decision/criteres-communs/*.yaml',
  { eager: true },
)

/** Tous les fichiers de critères communs, TELS QUE DÉCLARÉS (un objet par domaine) — exposé, au même
 * titre que `noeuds` plus bas, pour la conformité au schéma et les tests d'intégrité
 * (`criteresCommuns.test.ts`). */
export const fichiersCriteresCommuns: FichierCriteresCommuns[] = Object.values(modulesCriteresCommuns).map(
  (mod) => mod.default,
)

/**
 * Critères communs indexés par domaine puis par nom, pour une résolution en O(1) par `ref`. Convention
 * du dépôt : UN fichier par domaine (`<domaine>.yaml`) — si deux fichiers déclaraient un jour le même
 * domaine, le second écraserait le premier dans cette map plutôt que de lever ; ce n'est pas un cas que
 * T-188 doit couvrir (aucun mécanisme du dépôt ne permet aujourd'hui d'écrire deux fichiers pour le même
 * domaine sans que ce soit une erreur d'auteur visible autrement, ex. `content.test.ts`).
 */
const criteresCommunsParDomaine = new Map<string, Map<string, CritereCommun>>()
for (const fichier of fichiersCriteresCommuns) {
  const parNom = criteresCommunsParDomaine.get(fichier.domaine) ?? new Map<string, CritereCommun>()
  for (const critere of fichier.criteres) parNom.set(critere.nom, critere)
  criteresCommunsParDomaine.set(fichier.domaine, parNom)
}

/** Distingue la forme courte (`{ ref }`) de la forme complète (`{ nom, type, ... }`) — les deux sont
 * mutuellement exclusives par construction du schéma (`oneOf`, `noeud.schema.json`). EXPORTÉE pour
 * `criteresCommuns.test.ts`. */
export function estRef(critere: CritereEntree | CritereEntreeRef): critere is CritereEntreeRef {
  return 'ref' in critere
}

/**
 * Résout UNE entrée de `criteres_entree` : la forme complète traverse inchangée (NON-RÉGRESSION — un
 * nœud sans aucun `ref` produit exactement le même objet qu'avant ce mécanisme, cf. l'identité
 * référentielle du retour anticipé ci-dessous) ; la forme courte est remplacée par la définition commune
 * FUSIONNÉE avec la mise en scène locale.
 *
 * ORDRE DE FUSION : les champs de définition (`nom`, `type`, `valeurs`, `min`, `max`, `paliers`,
 * `derive`, `partage`, `aide` — jamais `concerne`, ignoré ici, cf. `CritereCommun.concerne`) viennent
 * TOUJOURS de la définition commune ; les champs de mise en scène locaux (`groupe`, `visible_si`, …,
 * `presomption_non`) viennent TOUJOURS de l'entrée `{ ref }`. Les deux ensembles sont disjoints par
 * construction du schéma (`critereEntreeRef` n'admet aucun champ de définition) : il n'y a donc jamais de
 * champ que les deux voudraient fixer, et l'ordre d'étalement (`{ ...definition, ...miseEnScene }`) ne
 * fait que refléter cette disjonction plutôt que trancher un conflit.
 *
 * `criteresCommuns` PARAMÉTRÉ (défaut = les fichiers réels du dépôt) plutôt que lu directement sur la
 * fermeture du module : rend la fonction pure et EXPORTÉE testable avec une map synthétique, sans dépendre
 * du contenu réel ni simuler `import.meta.glob` (`criteresCommuns.test.ts`). Le seul appelant de
 * production (`export const noeuds` ci-dessous) ne passe jamais ce 4ᵉ argument — il reçoit donc toujours
 * `criteresCommunsParDomaine`, exactement comme si le paramètre n'existait pas.
 */
export function resoudreCritereEntree(
  noeudId: string,
  domaine: string,
  critere: CritereEntree | CritereEntreeRef,
  criteresCommuns: ReadonlyMap<string, ReadonlyMap<string, CritereCommun>> = criteresCommunsParDomaine,
): CritereEntree {
  if (!estRef(critere)) return critere

  const communsDuDomaine = criteresCommuns.get(domaine)
  if (!communsDuDomaine) {
    throw new CritereCommunError(
      `Nœud "${noeudId}" : le critère "${critere.ref}" est référencé via \`ref\`, mais aucun fichier de ` +
        `critères communs n'existe pour le domaine "${domaine}" (attendu : ` +
        `content/decision/criteres-communs/${domaine}.yaml).`,
    )
  }

  const definition = communsDuDomaine.get(critere.ref)
  if (!definition) {
    throw new CritereCommunError(
      `Nœud "${noeudId}" : le critère "${critere.ref}" est référencé via \`ref\`, introuvable dans le ` +
        `fichier de critères communs du domaine "${domaine}" (content/decision/criteres-communs/` +
        `${domaine}.yaml). Vérifier le nom, ou ajouter cette définition à ce fichier.`,
    )
  }

  // `ref`/`concerne` explicitement exclus du résultat (jamais lus, seulement retirés) : `void` les
  // marque « lus » pour `noUnusedLocals` (tsconfig.app.json) sans dépendre d'une convention de nommage
  // par soulignement, dont le traitement diffère entre variables déstructurées et paramètres de fonction.
  const { ref, ...miseEnScene } = critere
  void ref
  const { concerne, ...definitionSansConcerne } = definition
  void concerne
  return { ...definitionSansConcerne, ...miseEnScene }
}

/** Tous les nœuds de décision, tous domaines confondus — `criteres_entree` déjà RÉSOLU (aucun `ref`
 * ne survit à cette étape). */
export const noeuds: Noeud[] = Object.values(modules).map((mod) => {
  const brut = mod.default
  return {
    ...brut,
    criteres_entree: brut.criteres_entree.map((critere) =>
      resoudreCritereEntree(brut.id, brut.domaine, critere),
    ),
  }
})

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
