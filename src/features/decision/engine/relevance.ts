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
 *
 * VALEUR INDÉTERMINÉE (DECISIONS.md D20, `docs/decision/validation/chantier-2026-07-26/
 * SPEC-valeur-indeterminee.md` §2) : `criteresPertinents`/`champsDecisifsManquants` acceptent désormais un
 * `renseignes` optionnel, transmis à `signature()` (donc à `construireVueDecision`/`evaluateNode`) pour que
 * la RÉFÉRENCE (l'état AVANT perturbation) reflète ce qui est réellement affiché — un nœud sur formulaire
 * vierge peut désormais être « en attente » plutôt que silencieusement évalué sur des zéros/`false` par
 * défaut. Absent (repli) : comportement RIGOUREUSEMENT INCHANGÉ, comme partout ailleurs dans ce chantier.
 *
 * SIMULER LA RÉPONSE, PAS SEULEMENT LA VALEUR : pour CHAQUE critère perturbé, l'essai ajoute ce seul
 * critère à l'ensemble `renseignes` de la perturbation (`renseignes ∪ {critere.nom}`), jamais les autres
 * critères encore indéterminés. Sans cet ajout, perturber un critère absent de `renseignes` ne changerait
 * JAMAIS rien : `evaluateCondition` ignore la valeur littérale d'une variable tant qu'elle n'est pas dans
 * l'ensemble effectif (`conditions.ts`), donc toute valeur candidate produirait la MÊME signature que la
 * référence (elle aussi indéterminée sur ce critère) — le critère serait vu « sans effet » et resterait
 * estompé pour toujours, l'exact mutisme que ce lot corrige. L'essai répond très précisément à la question
 * que ce module pose : « si le praticien RÉPONDAIT à ce champ, l'affichage bougerait-il ? ».
 *
 * LIMITE CONNUE, ASSUMÉE (pas un oubli) : chaque essai ne renseigne qu'UN SEUL critère à la fois — un
 * critère qui n'est décisif qu'EN CONJONCTION avec un autre critère ÉGALEMENT indéterminé (ex. « DFG < 30
 * AND age >= 75 » quand ni l'un ni l'autre n'est encore saisi) n'est donc pas détecté comme pertinent tant
 * que son co-critère reste lui aussi indéterminé — la conjonction reste `indetermine` quelle que soit la
 * valeur testée pour CE SEUL critère. Une recherche conjointe (plusieurs critères simultanément
 * indéterminés) résoudrait ce cas mais multiplierait l'espace de perturbation (combinatoire, pas linéaire)
 * — hors budget de ce lot (le calcul est déjà à ~12 s sur `prescription`, cf. SPEC §2.7). Le registre
 * `enAttente` d'`evaluateNode` (exact, pas heuristique) reste la source de vérité pour CETTE question :
 * `VueDecision.enAttente[].manquants` cite TOUJOURS tous les critères manquants d'une option, y compris en
 * conjonction — c'est lui que l'écran affiche pour le détail exact (`DecisionNodeScreen.tsx`), cette
 * heuristique de pertinence ne pilotant que l'estompage/le marqueur « à confirmer » du formulaire.
 *
 * N'AJOUTE PAS `indetermine` aux valeurs CANDIDATES testées (`valeursCandidates` ci-dessous, inchangée) :
 * ce serait une question différente (« si ce champ REDEVENAIT indéterminé, l'affichage bougerait-il ? »),
 * plus chère (un candidat de plus par critère saisissable) et hors périmètre de ce lot — limite documentée,
 * pas un oubli.
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
function signature(node: Noeud, criteria: Criteria, renseignes?: ReadonlySet<string>): string {
  return signatureVue(construireVueDecision(node, criteria, renseignes))
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
export function criteresPertinents(
  node: Noeud,
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): Set<string> {
  const reference = signature(node, criteria, renseignes)
  const pertinents = new Set<string>()
  for (const critere of node.criteres_entree) {
    if (critere.derive != null) continue // dérivé : non saisi, non perturbable directement
    // Essai = « si CE critère était répondu » (cf. docstring de tête) : ajoute UNIQUEMENT `critere.nom` à
    // `renseignes`, jamais les autres critères encore indéterminés.
    const essai = renseignes ? new Set([...renseignes, critere.nom]) : undefined
    for (const candidate of valeursCandidates(node, critere, criteria)) {
      if (signature(node, { ...criteria, [critere.nom]: candidate }, essai) !== reference) {
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
 *
 * `renseignes` (D20, optionnel, 4e paramètre) : base ternaire pour `criteresPertinents` — DISTINCT de
 * `touched`, qui ne sert ICI qu'au filtre final (« déjà répondu, donc plus manquant »). Repli `undefined` :
 * comportement HISTORIQUE inchangé (`criteresPertinents` évalue en repli « tout est renseigné », comme
 * avant ce paramètre) — c'est ce qui garde les anciens appels (2/3 arguments) valides à l'identique. En
 * production, l'appelant (`DecisionNodeScreen.tsx`) passe le MÊME ensemble aux deux (`touched`), puisque
 * c'est justement ce que ce chantier établit comme équivalence : un critère « touché » EST un critère
 * « renseigné ». Séparé ici pour ne pas figer cette équivalence dans la signature — un futur appelant
 * pourrait légitimement vouloir les deux ensembles distincts (ex. un `renseignes` reconstruit après import).
 */
export function champsDecisifsManquants(
  node: Noeud,
  criteria: Criteria,
  touched: ReadonlySet<string>,
  renseignes?: ReadonlySet<string>,
): string[] {
  return [...criteresPertinents(node, criteria, renseignes)].filter((nom) => !touched.has(nom))
}
