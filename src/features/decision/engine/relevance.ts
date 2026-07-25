/**
 * Moteur de PERTINENCE (refonte UI, plan P3 · S7‑ui Lot 1) — GÉNÉRIQUE, aucun nœud/critère connu par
 * son nom (invariant CLAUDE.md 5 / DECISIONS.md D8). Répond à deux besoins de la maquette 4a :
 *
 *  - **estompage des champs sans effet** (remarque 6) : `criteresPertinents(node, criteria)` = l'ensemble
 *    des critères SAISISSABLES dont une valeur alternative changerait ce qui est affiché (options
 *    applicables ordonnées + alertes). Un critère hors‑jeu pour ce patient précis n'y figure pas → l'UI
 *    peut l'estomper.
 *  - **reco provisoire** (remarque 7) : `champsDecisifsManquants(node, criteria, touched)` = les critères
 *    pertinents pas encore renseignés → tant qu'il en reste, la reco est « provisoire ».
 *
 * Méthode : PERTURBATION. Pour chaque critère saisissable, on essaie ses valeurs candidates et on compare
 * la « signature » du résultat (via le moteur réel `evaluateNode`) à la signature de référence. Aucune
 * heuristique cachée, aucun score : on interroge le moteur déterministe lui‑même.
 *
 * ⚠ Les critères `derive` (cible_atteinte…) sont RECALCULÉS à chaque perturbation
 * (`calculerCriteresDerives`) : sinon un critère saisi qui n'agit QUE via un dérivé serait vu « sans effet ».
 * Les critères dérivés eux‑mêmes ne sont pas perturbables (non saisis) et sont donc ignorés en entrée.
 */
import type { CritereEntree, Noeud } from '../content/node.types.ts'
import { construireVueDecision, signatureVue } from '../lib/vueDecision.ts'
import type { Criteria, CriteriaValue } from './conditions.ts'

/**
 * Signature de ce qui est affiché pour un jeu de critères, via le modèle de vue UNIQUE
 * (`lib/vueDecision.ts`) que consomme aussi l'écran (`DecisionNodeScreen.tsx`) : deux jeux de
 * critères produisant la même `VueDecision` produisent la même signature, et réciproquement — par
 * construction, plus par discipline.
 *
 * Avant ce fichier, `signature()` reconstruisait l'écran À LA MAIN, en chaîne : chaque dimension
 * ajoutée à l'affichage (groupes d'égalité, familles, badges, alertes) devait être répercutée
 * manuellement ici, et l'oubli s'est produit quatre fois de suite (cf. historique dans
 * `docs/decision/GRAMMAIRE-NOEUD.md`). Ne jamais réintroduire ce couplage : toute nouvelle dimension
 * d'affichage se branche dans `construireVueDecision`/`VueDecision`, jamais ici.
 */
function signature(node: Noeud, criteria: Criteria): string {
  return signatureVue(construireVueDecision(node, criteria))
}

/** Tous les fragments de règle du nœud où un critère peut apparaître (pour en extraire des seuils). */
function reglesDuNoeud(node: Noeud): string[] {
  const regles: string[] = []
  for (const option of node.options) {
    regles.push(...option.conditions)
    // `prerequis` (R6, GRAMMAIRE-NOEUD.md § arbitrage indication/prérequis) est évalué EXACTEMENT
    // comme `conditions` par le moteur : un seuil numérique qui n'existerait que dans un `prerequis`
    // doit être trouvé ici au même titre, sous peine de sous-échantillonner ses valeurs candidates
    // (`valeursCandidates`) et de manquer un critère pourtant décisif (R5). Aucun contenu actuel n'a
    // de `prerequis` numérique — extension par cohérence, pas un correctif d'un défaut observé.
    if (option.prerequis) regles.push(...option.prerequis)
    if (option.exclusions) regles.push(...option.exclusions)
    if (Array.isArray(option.priorite)) regles.push(...option.priorite.map((r) => r.quand))
  }
  for (const alerte of node.alertes ?? []) regles.push(alerte.quand)
  for (const critere of node.criteres_entree) if (critere.derive) regles.push(critere.derive)
  return regles
}

/**
 * Valeurs candidates à tester pour un critère saisissable. Pour un `nombre`, on cible les SEUILS
 * réellement présents dans les règles mentionnant ce critère (± ε de part et d'autre) — plus 0 et une
 * borne haute — puisque seul le franchissement d'un seuil peut changer la sortie.
 */
function valeursCandidates(node: Noeud, critere: CritereEntree, criteria: Criteria): CriteriaValue[] {
  if (critere.type === 'bool') return [true, false]
  if (critere.type === 'enum') return [...(critere.valeurs ?? [])]
  if (critere.type === 'liste') {
    const courant = Array.isArray(criteria[critere.nom]) ? (criteria[critere.nom] as string[]) : []
    // Toggle de chaque valeur possible : ajout si absente, retrait si présente.
    return (critere.valeurs ?? []).map((v) =>
      courant.includes(v) ? courant.filter((x) => x !== v) : [...courant, v],
    )
  }
  // nombre : seuils extraits des règles mentionnant le critère.
  const motif = new RegExp(`\\b${critere.nom}\\b`)
  const seuils = new Set<number>([0, 9999])
  for (const regle of reglesDuNoeud(node)) {
    if (!motif.test(regle)) continue
    for (const litt of regle.match(/-?\d+(?:\.\d+)?/g) ?? []) {
      const n = Number(litt)
      if (Number.isFinite(n)) {
        seuils.add(n)
        seuils.add(Math.round((n + 0.01) * 100) / 100)
        seuils.add(Math.round((n - 0.01) * 100) / 100)
      }
    }
  }
  return [...seuils]
}

/**
 * Critères SAISISSABLES dont une valeur alternative changerait l'affichage (options + alertes) pour ce
 * patient. Un critère absent du résultat n'a, pour ce patient précis, aucun effet sur la reco → l'UI
 * peut l'estomper. Générique : fonctionne pour n'importe quel nœud.
 */
export function criteresPertinents(node: Noeud, criteria: Criteria): Set<string> {
  const reference = signature(node, criteria)
  const pertinents = new Set<string>()
  for (const critere of node.criteres_entree) {
    if (critere.derive != null) continue // dérivé : non saisi, non perturbable directement
    for (const candidate of valeursCandidates(node, critere, criteria)) {
      if (signature(node, { ...criteria, [critere.nom]: candidate }) !== reference) {
        pertinents.add(critere.nom)
        break
      }
    }
  }
  return pertinents
}

/**
 * Critères DÉCISIFS encore MANQUANTS = pertinents (peuvent changer la reco) ∩ non encore renseignés par
 * le praticien (`touched`). Tant que la liste est non vide, la reco affichée est « provisoire » (remarque 7).
 */
export function champsDecisifsManquants(
  node: Noeud,
  criteria: Criteria,
  touched: ReadonlySet<string>,
): string[] {
  return [...criteresPertinents(node, criteria)].filter((nom) => !touched.has(nom))
}
