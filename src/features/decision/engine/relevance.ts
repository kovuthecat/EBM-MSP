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
import { computeBadges } from '../lib/optionBadges.ts'
import type { Criteria, CriteriaValue } from './conditions.ts'
import { calculerCriteresDerives } from './deriveCritere.ts'
import { evaluateNode, groupesParFamille } from './evaluateNode.ts'

/**
 * Signature de ce qui est affiché pour un jeu de critères : options applicables regroupées en FAMILLES
 * puis en GROUPES D'ÉGALITÉ INTERNES À CHAQUE FAMILLE (`groupesParFamille` — exactement ce que l'écran
 * rend : une section par famille, options empilées à l'intérieur sauf les groupes de ≥ 2 membres à même
 * rang FINI de la MÊME famille, rendus côte à côte), le BADGE de chacune (`computeBadges` — correctif
 * « le badge, c'est le plan », 2026-07-25) et les alertes déclenchées. Deux jeux de critères ayant la
 * même signature produisent le même écran de décision. Recalcule les dérivés avant d'évaluer.
 *
 * Les groupes (et non le rang brut) suite à un défaut de conception constaté en recette (nœud
 * `prescription`, options iSGLT2/AR GLP‑1 à égalité de rang par défaut) : comparer uniquement les
 * intitulés DANS L'ORDRE manquait le cas où un critère fait passer une option d'un rang à un autre SANS
 * jamais changer l'ordre affiché (l'égalité disparaît en interne, mais l'option qui gagnait déjà par
 * égalité + ordre du contenu reste en tête, pour une raison différente) — le critère semblait « sans
 * effet » (à tort estompé) alors qu'il pilote bel et bien un rang réel. Mais comparer le rang BRUT est
 * réciproquement trop sensible : un critère qui ferait passer une option de rang 2 à 3 SANS jamais
 * égaler ni dépasser une autre option ne change ni l'ordre ni les égalités affichées — l'écran est
 * identique, ce critère ne doit donc PAS être vu comme décisif. Les groupes d'égalité sont exactement la
 * frontière recherchée : ils changent si et seulement si l'écran change.
 *
 * Passage à `groupesParFamille` (et non `groupesExAequo` seul, correctif « priorité multi-natures ») :
 * l'écran groupe désormais PAR FAMILLE avant de calculer les égalités (`Option.famille`, présentation
 * pure) — si la signature ignorait les familles, un critère qui fait passer une option d'une famille à
 * une autre (même rang, ex. via une `priorite` conditionnelle) pourrait changer ce qui est affiché
 * (l'option change de section, ou rejoint/quitte un encadré « à égalité ») SANS que la signature bouge —
 * on recréerait exactement le défaut d'origine (un critère vu « sans effet » à tort). `relevance.ts` et
 * l'écran DOIVENT donc consommer la MÊME fonction pure. Voir `evaluateNode.ts` (`groupesParFamille`,
 * `groupesExAequo`, `EvaluateNodeResult.rangs`).
 *
 * Le BADGE fait maintenant partie de la signature (correctif « badge = plan », 2026-07-25) : depuis que
 * `computeBadges` distingue familles cumulables (tout le monde badgé) et exclusives (seule la tête l'est),
 * le badge d'une option peut changer SANS que ses groupes d'égalité ni sa famille ne changent — ex. un
 * critère qui fait passer une famille voisine d'une configuration à une autre modifie indirectement quel
 * membre est en tête ailleurs. Ignorer le badge referait le défaut d'origine (un écran qui change — le
 * mot « Recommandée » apparaît/disparaît sur une carte — sans que la signature bouge). `relevance.ts`,
 * l'écran et `computeBadges` consomment donc tous la MÊME fonction pure `groupesParFamille`.
 */
function signature(node: Noeud, criteria: Criteria): string {
  const derived = calculerCriteresDerives(node.criteres_entree, criteria)
  const { applicable, alertes, rangs } = evaluateNode(node, derived)
  const familles = groupesParFamille(node, applicable, rangs)
  const badges = computeBadges(familles)
  const options = familles
    .map(
      (famille) =>
        `${famille.libelle ?? ''}::${famille.groupes
          .map((groupe) => groupe.map((o) => `${o.intitule}@${badges.get(o) ?? ''}`).join(','))
          .join('|')}`,
    )
    .join('§§')
  return `${options}##${alertes.map((a) => a.message).join('|')}`
}

/** Tous les fragments de règle du nœud où un critère peut apparaître (pour en extraire des seuils). */
function reglesDuNoeud(node: Noeud): string[] {
  const regles: string[] = []
  for (const option of node.options) {
    regles.push(...option.conditions)
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
