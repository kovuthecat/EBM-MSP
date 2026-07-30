/**
 * MÉMOIRE DE SESSION des critères partagés (K6, décision référent du 2026-07-27).
 *
 * LE PROBLÈME. Sortir d'un nœud et y revenir remet le formulaire à zéro : chaque nœud est monté à neuf
 * (`App.tsx` force un remontage par `key={nodeId}`), et rien ne circule d'un nœud à l'autre. Le praticien
 * ressaisit l'HbA1c, l'âge, le DFG à chaque écran d'une même consultation. Le chaînage entre nœuds avait
 * été délibérément exclu (garde-fou R1), et le « socle de critères partagé » de D22 n'a jamais été livré
 * pour cette raison.
 *
 * CE QUE LE RÉFÉRENT A TRANCHÉ, et pourquoi ça ne rouvre pas R1 : *« si la cible est connue, le module
 * peut la reprendre et pré-remplir »*, *« on peut garder une persistance par session — un reload de la
 * page reset tout »*. Trois propriétés rendent la décision tenable, et ce module les tient toutes les
 * trois :
 *
 *  1. **ce qui circule est une VALEUR SAISIE, jamais une CONCLUSION du moteur.** C'est exactement la
 *     distinction que R1 protège. Aucune sortie d'`evaluateNode` n'entre ici — seulement ce que le
 *     praticien a tapé ;
 *  2. **pré-remplie, jamais imposée.** L'écran signale d'où vient la valeur et elle reste modifiable ;
 *  3. **mémoire de session, rien d'autre.** Aucune écriture disque, aucun réseau, aucun `localStorage` —
 *     une simple `Map` de module, donc remise à zéro complète au rechargement de la page. C'est
 *     précisément le périmètre que l'invariant CLAUDE.md 1 autorise (« aucune persistance, aucun réseau »
 *     s'entend d'une persistance qui SURVIT à la session).
 *
 * QUELLES VALEURS CIRCULENT — DÉCLARÉ PAR LE CONTENU (`CritereEntree.partage`), jamais par ce module. Le
 * socle générique n'a pas le droit de connaître `HbA1c_cible` par son nom (invariant CLAUDE.md 5 / D8) :
 * une liste en dur ici serait la première connaissance de domaine du socle. Ce module ne sait que
 * mémoriser et rendre ; c'est l'auteur du contenu qui décide de quoi.
 *
 * ⚠ CE MODULE EST UN ÉTAT GLOBAL MUTABLE, la seule pièce de ce type du module Décision. C'est assumé et
 * borné : il ne contient que des valeurs de critères, il est vidé par `reinitialiserSession()` — appelé
 * par les tests (isolation d'un cas à l'autre) ET, depuis T-026/D33 (« Nouveau patient »), par
 * l'application elle-même au clic sur ce bouton du header — et rien ne le lit en dehors du
 * pré-remplissage du formulaire.
 */
import type { CritereEntree } from '../content/node.types.ts'
import type { Criteria, CriteriaValue } from '../engine/conditions.ts'

/**
 * Valeurs mémorisées pour la session en cours, par NOM de critère. Vit à la portée du module : elle
 * disparaît au rechargement de la page, jamais avant — c'est la définition même de « persistance par
 * session » retenue par le référent.
 */
const memoire = new Map<string, CriteriaValue>()

/**
 * Vide la mémoire — deux appelants légitimes, jamais un troisième :
 *  - les tests, pour qu'un cas ne contamine pas le suivant ;
 *  - le bouton « Nouveau patient » du header (T-026/D33) : le geste de fin de consultation qui manquait
 *    à D28 (cf. `docs/decision/validation/recette-navigateur-2026-07-28.md` D-13/F-C — sans lui, la
 *    cible d'un patient pouvait entrer dans le raisonnement affiché pour le suivant).
 *
 * Volontairement TRIVIALE : aucun événement, aucun abonnement. Vider la `Map` ne remet PAS à zéro un
 * formulaire déjà monté à l'écran — c'est au composant racine (`App.tsx`) de forcer, EN PLUS, le
 * remontage des écrans par `key` (même mécanisme que D28, pas un nouveau) ; cette fonction ne fait que
 * garantir qu'un écran qui (re)monte APRÈS cet appel ne trouvera plus rien à reprendre.
 */
export function reinitialiserSession(): void {
  memoire.clear()
}

/**
 * Nombre de critères actuellement mémorisés — un COMPTEUR, rien d'autre (T-056/P8). N'expose NI nom NI
 * valeur : aucune donnée patient hors du formulaire (invariant CLAUDE.md 1). Sert uniquement à rendre
 * visible, dans le header, qu'une mémoire de session existe et sa taille, pour qu'« il reste des données
 * du patient précédent » cesse d'être une information invisible avant même d'ouvrir un nœud. Lecture
 * seule : n'ajoute aucun appelant légitime à `reinitialiserSession()` ci-dessus.
 */
export function tailleSession(): number {
  return memoire.size
}

/**
 * Mémorise les valeurs SAISIES (`touched`) des critères déclarés `partage` par ce nœud. Appelée à chaque
 * changement de saisie : le coût est nul (quelques entrées de `Map`) et l'alternative — mémoriser au
 * démontage — perdrait tout si le praticien ferme l'onglet du nœud autrement qu'en naviguant.
 *
 * Ne mémorise QUE ce qui est `touched` : une valeur par défaut n'est pas une réponse (D20/R7), et la
 * propager d'un nœud à l'autre reviendrait à faire circuler un silence comme s'il était une donnée.
 */
export function memoriserCriteres(
  criteresEntree: readonly CritereEntree[],
  criteria: Criteria,
  touched: ReadonlySet<string>,
): void {
  for (const critere of criteresEntree) {
    if (critere.partage !== true || critere.derive != null) continue
    if (!touched.has(critere.nom)) continue
    memoire.set(critere.nom, criteria[critere.nom])
  }
}

/** Une valeur reprise de la session, avec le nom du critère qu'elle renseigne. */
export interface ValeurReprise {
  nom: string
  valeur: CriteriaValue
}

/**
 * Valeurs que ce nœud peut REPRENDRE de la session : ses critères déclarés `partage`, présents en
 * mémoire, et **compatibles avec sa propre déclaration**.
 *
 * LE CONTRÔLE DE COMPATIBILITÉ N'EST PAS DÉCORATIF. Deux nœuds peuvent déclarer le même nom avec deux
 * encodages différents — c'est la dette I4 (« un concept, un encodage »), qui a déjà été constatée sur ce
 * dépôt. Reprendre une valeur d'`enum` dans un nœud qui ne déclare pas cette valeur, ou un nombre dans un
 * champ devenu `liste`, injecterait une saisie que le formulaire ne sait pas rendre et que le moteur
 * pourrait rejeter. On refuse donc silencieusement plutôt que de propager : le praticien ressaisit, ce
 * qui est le pire cas acceptable. Un invariant du banc interdit par ailleurs cette divergence en amont —
 * ce contrôle est la ceinture, l'invariant les bretelles.
 */
export function valeursReprises(criteresEntree: readonly CritereEntree[]): ValeurReprise[] {
  const reprises: ValeurReprise[] = []
  for (const critere of criteresEntree) {
    if (critere.partage !== true || critere.derive != null) continue
    if (!memoire.has(critere.nom)) continue
    const valeur = memoire.get(critere.nom)!
    if (!valeurCompatible(critere, valeur)) continue
    reprises.push({ nom: critere.nom, valeur })
  }
  return reprises
}

/** La valeur mémorisée est-elle représentable par CE critère, tel que CE nœud le déclare ? */
function valeurCompatible(critere: CritereEntree, valeur: CriteriaValue): boolean {
  switch (critere.type) {
    case 'nombre':
      if (typeof valeur !== 'number' || !Number.isFinite(valeur)) return false
      if (critere.min != null && valeur < critere.min) return false
      if (critere.max != null && valeur > critere.max) return false
      return true
    case 'bool':
      return typeof valeur === 'boolean'
    case 'enum':
      return typeof valeur === 'string' && (critere.valeurs ?? []).includes(valeur)
    case 'liste':
      return Array.isArray(valeur) && valeur.every((v) => (critere.valeurs ?? []).includes(v))
  }
}
