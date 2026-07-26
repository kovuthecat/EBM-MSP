/**
 * Générateur de PROFILS DE CRITÈRES pour le banc d'un nœud (docs/decision/GRAMMAIRE-NOEUD.md,
 * section « Le banc d'un nœud — trois couches »), couches 2 (couverture) et 3 (invariants).
 *
 * DEPUIS R7 (DECISIONS.md D20, `docs/decision/validation/chantier-2026-07-26/
 * SPEC-valeur-indeterminee.md` §2), ce module produit aussi des profils PARTIELLEMENT renseignés
 * (`genererProfilsPartiels`, en fin de fichier) : les fonctions ci-dessous (`genererProfils`,
 * `genererPairesBooleennes`) ne renvoient QUE des `Criteria` bruts, sans notion de `renseignes` — un
 * profil qu'elles engendrent est toujours implicitement COMPLET (repli « tout est renseigné » côté
 * moteur). `genererProfilsPartiels` les réutilise puis retire un sous-ensemble de `renseignes`, à graine
 * fixe — seule façon de mettre l'indétermination (R7) sous test, cf. sa docstring.
 *

 * GÉNÉRIQUE par construction (invariant CLAUDE.md 5 / DECISIONS.md D8) : ce module ne connaît AUCUN nom
 * de critère ni de nœud (les noms de critère qu'il manipule sont lus dynamiquement sur `Noeud`, jamais
 * codés en dur). Pour chaque critère SAISISSABLE (non `derive`) de `Noeud.criteres_entree`, il tire une
 * valeur admissible selon son `type` :
 * - `bool`   → true / false ;
 * - `enum`   → une des `valeurs` déclarées ;
 * - `liste`  → un sous-ensemble des `valeurs` déclarées (peut être vide ou complet) ;
 * - `nombre` → un des seuils littéraux présents dans les règles DU NŒUD qui MENTIONNENT ce critère
 *   (`conditions`, `exclusions`, `priorite` conditionnelle, `alertes[].quand`, ou le `derive` d'un
 *   AUTRE critère), chacun décliné à −1 / lui-même / +1, FILTRÉS au domaine déclaré (`critere.min`/
 *   `critere.max`, table validée référent, docs/decision/GRAMMAIRE-NOEUD.md) pour ne jamais attribuer à
 *   ce critère le seuil littéral d'un AUTRE opérande de la même expression (ex. le 0,5 d'un ratio
 *   dose/poids devenant un seuil de POIDS, corrigé le 2026-07-26 — cf. `tirageDansDomaine`,
 *   `seuilsNumeriques` ci-dessous) ; plus deux bornes plancher/plafond (le domaine [min, max] lui-même si
 *   déclaré, sinon 0 et 999 en repli historique) qui couvrent le cas où AUCUN littéral EN DOMAINE
 *   n'a été trouvé (un tel critère n'aura alors que ces valeurs de repli — ce qui le rend visible comme
 *   « jamais décisif » côté R5, cf. `couverture.test.ts`, exactement l'effet recherché quand c'est
 *   véritablement le cas).
 *
 * Même IDÉE que la fonction interne (non exportée) `valeursCandidates` de `engine/relevance.ts` —
 * réimplémentée ici à dessein (les deux moteurs ne doivent jamais diverger sur le filtre de domaine, sous
 * peine de perturber la pertinence sur des valeurs que le banc n'engendre plus — cf. le filtre `min`/`max`
 * appliqué aux deux, 2026-07-26). Les deux implémentations restent volontairement proches
 * mais pas identiques (ε = 1 ici contre 0,01 dans `relevance.ts`, qui vise le franchissement exact d'un
 * seuil pour la perturbation ; ici on veut surtout des COMBINAISONS variées de critères).
 *
 * DEUX STRATÉGIES DE COMBINAISON (et non un tirage indépendant naïf profil par profil) :
 *
 * 1. PRODUIT CARTÉSIEN COMPLET des critères ÉNUMÉRABLES (bool/enum/nombre — pas `liste`) quand il reste
 *    de taille raisonnable (≤ `PLAFOND_ENUMERATION_EXHAUSTIVE`) : un petit nœud (peu de critères) peut
 *    quand même porter une option gardée par une CONJONCTION étroite de 5-7 clauses (constaté sur le
 *    nœud `cible-glycemique`, 7 clauses, produit cartésien 1 920) — un tirage indépendant, même
 *    stratifié, sous-représente ce genre de conjonction par pur hasard sur un petit banc. Énumérer TOUT
 *    le produit cartésien (compté en base mixte, puis mélangé à graine fixe) GARANTIT que chaque
 *    combinaison de critères énumérables apparaît au moins une fois dès que le banc est au moins aussi
 *    grand que ce produit — `tailleEffective` relève au besoin la taille demandée pour l'atteindre.
 * 2. À défaut (nœud trop riche pour une énumération complète, ex. `prescription`/`insuline`, ~25
 *    critères saisissables) : ÉCHANTILLONNAGE STRATIFIÉ — chaque critère reçoit sa PROPRE séquence de
 *    valeurs, mélangée (Fisher-Yates) par blocs répétés de sa liste de candidats, de sorte que CHAQUE
 *    candidat apparaisse environ `count / nombre_de_candidats` fois, réparti sur tout l'échantillon
 *    (Latin Hypercube Sampling) plutôt que soumis à la variance d'un tirage IID. Les séquences de
 *    critères différents utilisent des graines dérivées indépendamment (hash du nom du critère), donc
 *    leurs combinaisons restent non corrélées.
 *
 * Les critères `liste` (multivalués) sont toujours traités par la stratégie 2, quelle que soit la
 * stratégie retenue pour les autres critères : chaque valeur possible reçoit sa propre séquence
 * stratifiée d'inclusion (booléenne), recombinées en sous-ensembles.
 *
 * DÉTERMINISME (obligatoire) : PRNG à graine fixe écrit à la main (mulberry32), jamais `Math.random`.
 * À `node`/`count`/`seed` identiques, `genererProfils` renvoie EXACTEMENT les mêmes profils à chaque
 * exécution — condition nécessaire pour qu'un `it.fails` documente une dette précise et reproductible,
 * et pour qu'une régression future se manifeste de façon stable (pas un flake).
 */
import type { Criteria, CriteriaValue } from '../conditions.ts'
import type { CritereEntree, Noeud } from '../../content/node.types.ts'
import { calculerCriteresDerives } from '../deriveCritere.ts'

/**
 * PRNG mulberry32 : rapide, déterministe, qualité suffisante pour un banc de test (aucun besoin
 * cryptographique). Renvoie une fonction `() => number` dans [0, 1), API interchangeable avec
 * `Math.random` mais jamais `Math.random` lui-même (déterminisme obligatoire, cf. docstring module).
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function random() {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Hash de chaîne (FNV-1a) : dérive une graine entière déterministe à partir d'un nom de critère, pour
 * que chaque critère utilise un flux de hasard INDÉPENDANT des autres (mécanique — n'accorde aucun sens
 * particulier au nom, ne fait que le distinguer d'un autre nom).
 */
function hashChaine(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Graine par défaut du banc — fixe, arbitraire, jamais recalculée à l'exécution. */
const GRAINE_PAR_DEFAUT = 20260725

/** Tous les fragments de règle DU NŒUD où un critère peut apparaître (mécanique, aucun nom connu). */
function reglesDuNoeud(node: Noeud): string[] {
  const regles: string[] = []
  for (const option of node.options) {
    regles.push(...option.conditions)
    if (option.exclusions) regles.push(...option.exclusions)
    if (Array.isArray(option.priorite)) regles.push(...option.priorite.map((regle) => regle.quand))
  }
  for (const alerte of node.alertes ?? []) regles.push(alerte.quand)
  for (const critere of node.criteres_entree) if (critere.derive) regles.push(critere.derive)
  return regles
}

/**
 * Domaine de REPLI d'un critère borné (`critere.min`/`critere.max`, schema/noeud.schema.json, table
 * validée référent, docs/decision/GRAMMAIRE-NOEUD.md) quand AUCUN littéral EN DOMAINE n'a été trouvé
 * dans les règles du nœud — soit qu'aucune règle ne mentionne le critère, soit que toutes les mentions
 * extraites appartenaient en réalité à un AUTRE opérande de la même expression (le défaut diagnostiqué
 * dans `banc/couverture.test.ts` : le 0,5 d'un ratio `dose_basale_actuelle / poids > 0.5` devenait un
 * seuil de POIDS, le 1000/2000 d'une dose de metformine devenait un seuil de DFG). Tirage DÉTERMINISTE
 * (mulberry32, graine dérivée du nom du critère — jamais `Math.random`, cf. docstring de tête du module) :
 * les deux bornes elles-mêmes plus 3 tirages intérieurs, assez pour peupler `sequenceStratifiee` sans
 * coût combinatoire supplémentaire.
 */
function tirageDansDomaine(min: number, max: number, nomCritere: string): number[] {
  if (min === max) return [min]
  const rng = mulberry32((GRAINE_PAR_DEFAUT ^ hashChaine(`__domaine_${nomCritere}__`)) >>> 0)
  const valeurs = new Set<number>([min, max])
  while (valeurs.size < 5) valeurs.add(Math.round((min + rng() * (max - min)) * 100) / 100)
  return [...valeurs]
}

/**
 * Seuils numériques candidats pour un critère `nombre` : littéraux trouvés dans les règles du nœud qui
 * MENTIONNENT ce critère (mot entier, `\b`), déclinés à −1/lui-même/+1, FILTRÉS au domaine déclaré
 * (`critere.min`/`critere.max`) pour écarter le seuil littéral d'un AUTRE opérande de la même expression
 * — cf. `tirageDansDomaine` ci-dessus pour le repli quand ce filtre ne laisse plus aucun littéral. Domaine
 * NON déclaré (min/max absents pour ce critère) : comportement historique intégralement inchangé (0 et
 * 999 en plancher/plafond, aucun filtre).
 */
function seuilsNumeriques(node: Noeud, critere: CritereEntree): number[] {
  const motif = new RegExp(`\\b${critere.nom}\\b`)
  const { min, max } = critere
  const dansDomaine = (v: number) => (min == null || v >= min) && (max == null || v <= max)
  const brut = new Set<number>()
  for (const regle of reglesDuNoeud(node)) {
    if (!motif.test(regle)) continue
    for (const litteral of regle.match(/-?\d+(?:\.\d+)?/g) ?? []) {
      const n = Number(litteral)
      if (!Number.isFinite(n)) continue
      brut.add(n)
      brut.add(Math.round((n - 1) * 100) / 100)
      brut.add(Math.round((n + 1) * 100) / 100)
    }
  }
  const seuils = new Set<number>([...brut].filter(dansDomaine))
  if (seuils.size > 0) {
    // Bornes plancher/plafond garanties EN DOMAINE (remplace le sentinel universel 0/999, hors domaine
    // pour la plupart des critères bornés — ex. un poids de 0 kg) : au moins deux valeurs même quand des
    // littéraux réels existent déjà.
    if (min != null) seuils.add(min)
    if (max != null) seuils.add(max)
    if (min == null && max == null) {
      seuils.add(0)
      seuils.add(999)
    }
    return [...seuils]
  }
  // Aucun littéral EN DOMAINE : cf. `tirageDansDomaine` ci-dessus.
  if (min != null && max != null) return tirageDansDomaine(min, max, critere.nom)
  return [0, 999] // aucune borne déclarée pour ce critère : repli historique intégral.
}

/** Domaine énumérable d'un critère non `liste` (candidats un par un) ; `null` pour un critère `liste`
 * (sous-ensemble, traité à part — cf. docstring module). */
function domaineEnumerable(node: Noeud, critere: CritereEntree): CriteriaValue[] | null {
  if (critere.type === 'bool') return [true, false]
  if (critere.type === 'enum') return [...(critere.valeurs ?? [])]
  if (critere.type === 'nombre') return seuilsNumeriques(node, critere)
  return null // 'liste'
}

/** Au-delà de cette taille, le produit cartésien des critères énumérables n'est plus énuméré en entier
 * (coût prohibitif) : repli sur l'échantillonnage stratifié seul (stratégie 2, cf. docstring module). */
const PLAFOND_ENUMERATION_EXHAUSTIVE = 20000

/**
 * Taille EFFECTIVE du banc pour `node` (hors critère `omettre`, le cas échéant) à une taille demandée
 * `count` : si le produit cartésien des critères énumérables reste raisonnable, il sert de PLANCHER
 * (garantit une couverture EXHAUSTIVE de toute conjonction) ; sinon `count` est inchangé.
 */
function tailleEffective(node: Noeud, count: number, omettre?: string): number {
  let produit = 1
  let auMoinsUnEnumerable = false
  for (const critere of node.criteres_entree) {
    if (critere.derive != null || critere.nom === omettre) continue
    const domaine = domaineEnumerable(node, critere)
    if (domaine === null) continue // 'liste' : hors produit cartésien
    auMoinsUnEnumerable = true
    produit *= Math.max(1, domaine.length)
    if (produit > PLAFOND_ENUMERATION_EXHAUSTIVE) return count
  }
  return auMoinsUnEnumerable ? Math.max(count, produit) : count
}

/** Mélange (Fisher-Yates) une copie de `valeurs` avec le PRNG fourni ; ne mute pas l'original. */
function melanger<T>(valeurs: readonly T[], rng: () => number): T[] {
  const copie = [...valeurs]
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = copie[i]
    copie[i] = copie[j]
    copie[j] = tmp
  }
  return copie
}

/**
 * Énumère TOUTES les combinaisons du produit cartésien de `domaines` (comptage en base mixte : l'indice
 * `idx` se décompose en un chiffre par domaine, comme une numération à bases variables). Longueur du
 * résultat = produit des tailles de domaine.
 */
function enumererCombinaisons(domaines: CriteriaValue[][]): CriteriaValue[][] {
  const taille = domaines.reduce((acc, d) => acc * Math.max(1, d.length), 1)
  const combinaisons: CriteriaValue[][] = []
  for (let idx = 0; idx < taille; idx++) {
    let reste = idx
    const combinaison: CriteriaValue[] = []
    for (const domaine of domaines) {
      const n = Math.max(1, domaine.length)
      combinaison.push(domaine[reste % n])
      reste = Math.floor(reste / n)
    }
    combinaisons.push(combinaison)
  }
  return combinaisons
}

/**
 * Séquence stratifiée de `count` valeurs tirées de `candidats` : répète la liste par blocs, chaque bloc
 * mélangé (Fisher-Yates) par le PRNG fourni. Sur `count` positions, chaque candidat apparaît environ
 * `count / candidats.length` fois — jamais 0 fois dès que `count >= candidats.length`.
 */
function sequenceStratifiee<T>(candidats: readonly T[], count: number, seed: number): T[] {
  if (candidats.length === 0) return []
  const rng = mulberry32(seed)
  const sequence: T[] = []
  while (sequence.length < count) sequence.push(...melanger(candidats, rng))
  return sequence.slice(0, count)
}

/**
 * Construit, pour chaque critère SAISISSABLE de `node` (à l'exclusion de `omettre`, s'il est fourni),
 * sa séquence de `count` valeurs admissibles (`count` doit déjà être la taille EFFECTIVE, cf.
 * `tailleEffective` — cette fonction ne la recalcule pas côté enveloppe, seulement côté décision de
 * stratégie par groupe de critères, cf. docstring module).
 */
function construireSequences(
  node: Noeud,
  count: number,
  seedBase: number,
  omettre?: string,
): Map<string, CriteriaValue[]> {
  const saisissables = node.criteres_entree.filter((c) => c.derive == null && c.nom !== omettre)
  const listeCriteres = saisissables.filter((c) => c.type === 'liste')
  const enumerables = saisissables.filter((c) => c.type !== 'liste')

  const sequences = new Map<string, CriteriaValue[]>()

  const domaines = enumerables.map((c) => domaineEnumerable(node, c) ?? [])
  const produit = domaines.reduce((acc, d) => acc * Math.max(1, d.length), 1)

  if (enumerables.length > 0 && produit <= PLAFOND_ENUMERATION_EXHAUSTIVE) {
    // Stratégie 1 : produit cartésien COMPLET, mélangé par blocs à graine fixe.
    const rng = mulberry32((seedBase ^ hashChaine('__cartesien__')) >>> 0)
    const base = enumererCombinaisons(domaines)
    const combos: CriteriaValue[][] = []
    while (combos.length < count) combos.push(...melanger(base, rng))
    const tronque = combos.slice(0, count)
    enumerables.forEach((critere, ci) => {
      sequences.set(
        critere.nom,
        tronque.map((combo) => combo[ci]),
      )
    })
  } else {
    // Stratégie 2 : séquence stratifiée INDÉPENDANTE par critère (nœud trop riche pour tout énumérer).
    for (const critere of enumerables) {
      const seedCritere = (seedBase ^ hashChaine(critere.nom)) >>> 0
      sequences.set(critere.nom, sequenceStratifiee(domaineEnumerable(node, critere) ?? [], count, seedCritere))
    }
  }

  // Critères `liste` : toujours par séquence d'inclusion stratifiée indépendante par valeur possible.
  for (const critere of listeCriteres) {
    const seedCritere = (seedBase ^ hashChaine(critere.nom)) >>> 0
    const valeurs = critere.valeurs ?? []
    const parValeur = valeurs.map((v) => sequenceStratifiee([true, false], count, (seedCritere ^ hashChaine(v)) >>> 0))
    const sousEnsembles: string[][] = Array.from({ length: count }, (_, i) =>
      valeurs.filter((_, vi) => parValeur[vi][i]),
    )
    sequences.set(critere.nom, sousEnsembles)
  }

  return sequences
}

/**
 * Taille de banc RECOMMANDÉE (avant ajustement éventuel pour couverture exhaustive, cf.
 * `tailleEffective` interne) pour un nœud : proportionnelle au nombre de critères SAISISSABLES (non
 * `derive`) — vise ~2000 profils pour un nœud aussi riche que `prescription` (~25 critères
 * saisissables), moins pour un petit nœud (ex. `statine`, 6 critères). Purement mécanique (ne lit que
 * `.length`, ne connaît aucun nom de nœud ni de critère) : un futur domaine en hérite sans réglage.
 *
 * `genererProfils`/`genererPairesBooleennes` peuvent renvoyer PLUS que cette taille : si le produit
 * cartésien des critères énumérables du nœud (petit nœud, conjonction étroite) le dépasse, il sert de
 * plancher pour garantir une couverture exhaustive plutôt que de sous-échantillonner une conjonction
 * rare (cf. docstring module, stratégie 1).
 */
export function tailleBanc(node: Noeud): number {
  const saisissables = node.criteres_entree.filter((critere) => critere.derive == null).length
  return Math.max(200, Math.min(2000, saisissables * 80))
}

/**
 * Génère des profils de critères VALIDES pour `node`, critères DÉRIVÉS déjà calculés
 * (`calculerCriteresDerives` appliqué avant renvoi — prêts pour `evaluateNode` sans étape
 * supplémentaire, cf. consigne de tâche « Applique calculerCriteresDerives avant toute évaluation »).
 * Déterministe : mêmes `node`/`count`/`seed` ⇒ mêmes profils, dans le même ordre. Le nombre de profils
 * renvoyé peut dépasser `count` (jamais en-deçà) : cf. `tailleEffective`/docstring module.
 */
export function genererProfils(node: Noeud, count: number, seed = GRAINE_PAR_DEFAUT): Criteria[] {
  const effectif = tailleEffective(node, count)
  const sequences = construireSequences(node, effectif, seed)
  const profils: Criteria[] = []
  for (let i = 0; i < effectif; i++) {
    const brut: Criteria = {}
    for (const [nom, sequence] of sequences) brut[nom] = sequence[i]
    profils.push(calculerCriteresDerives(node.criteres_entree, brut))
  }
  return profils
}

/**
 * Une PAIRE de profils, identiques sur tous les critères saisissables SAUF `critere` (vrai dans `aVrai`,
 * faux dans `aFaux`) — outil de l'invariant « toutes choses égales par ailleurs » (ex. invariant 6 du
 * domaine DT2 : `fragilite` ne doit jamais AUGMENTER le nombre d'options d'une famille). Générique :
 * `critere` est un paramètre, ce module ne connaît toujours aucun nom de critère par avance ; c'est
 * l'appelant (le fichier d'invariants, seul autorisé à connaître du contenu par son nom) qui choisit
 * quel critère booléen apparier.
 *
 * Les critères DÉRIVÉS qui dépendent de `critere` (ex. `terrain_fragile` dépend de `fragilite`) sont
 * RECALCULÉS séparément pour chaque membre de la paire : c'est le comportement recherché, pas un
 * artefact — l'effet EN CASCADE de `critere` sur les dérivés fait partie de ce que l'invariant observe.
 */
export interface PaireBooleenne {
  aVrai: Criteria
  aFaux: Criteria
}

export function genererPairesBooleennes(
  node: Noeud,
  count: number,
  critere: string,
  seed = GRAINE_PAR_DEFAUT,
): PaireBooleenne[] {
  const effectif = tailleEffective(node, count, critere)
  const sequences = construireSequences(node, effectif, seed, critere)
  const paires: PaireBooleenne[] = []
  for (let i = 0; i < effectif; i++) {
    const brut: Criteria = {}
    for (const [nom, sequence] of sequences) brut[nom] = sequence[i]
    paires.push({
      aVrai: calculerCriteresDerives(node.criteres_entree, { ...brut, [critere]: true }),
      aFaux: calculerCriteresDerives(node.criteres_entree, { ...brut, [critere]: false }),
    })
  }
  return paires
}

// ---------------------------------------------------------------------------------------------------
// R7 · Profils PARTIELLEMENT renseignés (DECISIONS.md D20, `docs/decision/validation/chantier-2026-07-26/
// SPEC-valeur-indeterminee.md` §2) : le golden master ci-dessus (`genererProfils`) engendre uniquement
// des profils COMPLETS — un `renseignes` n'existe nulle part dans ce module avant cette section. Sans
// elle, la caractérisation de l'indétermination (`caracterisation.test.ts`) et l'invariant I3
// (`invariants.test.ts`) n'ont AUCUN profil à examiner : le défaut que R7 corrige (« le moteur ne
// distingue pas non-renseigné de zéro ») serait livré sans un seul test capable de le mettre en évidence.
// ---------------------------------------------------------------------------------------------------

/** Expressions `exclusions` du nœud (mécanique, aucun nom de critère connu à l'avance) : sous-ensemble
 * volontairement ÉTROIT de `reglesDuNoeud` ci-dessus — ne cible QUE les garde-fous (Q2 référent, D20,
 * SPEC §0 : « un garde-fou sur un critère non renseigné ⇒ option en attente », le scénario le plus
 * sensible du chantier, cf. le défaut réel « metformine écartée sur un DFG jamais saisi »). */
function exclusionsDuNoeud(node: Noeud): string[] {
  const regles: string[] = []
  for (const option of node.options) if (option.exclusions) regles.push(...option.exclusions)
  return regles
}

/** `critere` est-il cité (mot entier) dans au moins une expression de `regles` ? Même mécanique que
 * `seuilsNumeriques` ci-dessus (motif `\b`), réutilisée à dessein plutôt que dupliquée sous une autre
 * forme. */
function critereCiteDans(critere: CritereEntree, regles: string[]): boolean {
  const motif = new RegExp(`\\b${critere.nom}\\b`)
  return regles.some((regle) => motif.test(regle))
}

/**
 * Un profil PARTIELLEMENT renseigné : les mêmes VALEURS concrètes qu'un profil complet (`criteria` —
 * SPEC §2.6, `touched` est un statut de PROVENANCE, jamais une seconde copie de la valeur), mais
 * `renseignes` ne couvre qu'un SOUS-ENSEMBLE des critères saisissables du nœud. `masque` = les noms
 * retirés d'un `renseignes` par ailleurs complet, exposé pour que l'appelant (document de relecture
 * clinique, `caracterisation.test.ts`) puisse décrire la construction de chaque profil sans le
 * redériver. `regime` DISTINGUE explicitement les deux RÉGIMES de construction (cf. `genererProfilsPartiels`
 * ci-dessous) — NE PAS le redériver de `masque.length` côté appelant : un masque STRATIFIÉ peut, par
 * hasard (fraction × total arrondie), retirer exactement UN critère sur un petit nœud (`statine`, 6
 * critères saisissables), ce qui ressemblerait à tort à un masque CIBLÉ si on se fiait à la seule
 * longueur.
 */
export interface ProfilPartiel {
  criteria: Criteria
  renseignes: ReadonlySet<string>
  masque: string[]
  regime: 'critique' | 'stratifie'
}

/**
 * Génère `count` profils PARTIELLEMENT renseignés pour `node` (R7, DECISIONS.md D20). Réutilise `count`
 * profils COMPLETS de `genererProfils` (mêmes valeurs concrètes, mêmes garanties de déterminisme) et
 * retire de `renseignes` un sous-ensemble de critères SAISISSABLES, à graine fixe.
 *
 * DEUX RÉGIMES DE MASQUE, dans cet ordre (les premiers profils sont les plus CIBLÉS, donc les plus
 * lisibles en relecture clinique) :
 *
 * 1. Un critère CRITIQUE — `nombre`/`enum` CITÉ PAR UNE `exclusions` de `node` (`exclusionsDuNoeud`
 *    ci-dessus) — masqué SEUL (tous les autres critères restent renseignés), un profil par critère
 *    critique, dans l'ordre de `criteres_entree`. C'est le scénario Q2 du référent (garde-fou sur donnée
 *    manquante) à l'état le plus pur : un seul champ manque, et c'est justement celui qui commande un
 *    garde-fou. `bool`/`liste` ne peuvent PAS produire ce scénario (SPEC §2.2 : ils restent déterminés
 *    par défaut sauf `confirmation_requise`, absent de tout le contenu actuel) — non retenus ici.
 * 2. Au-delà (nœud sans assez de critères critiques pour couvrir `count`, ex. `cible-glycemique`/`rhd`/
 *    `statine`, aucune `exclusions` déclarée) : un masque STRATIFIÉ plus large — une fraction du
 *    formulaire tirée dans [20 %, 70 %) à graine fixe (dérivée de l'INDICE du profil, jamais
 *    `Math.random`, cf. docstring de tête du module) — simule un formulaire réellement partiel, pas
 *    seulement un champ isolé.
 *
 * Générique (CLAUDE.md invariant 5 / DECISIONS.md D8) : ne connaît aucun nom de critère par avance, lit
 * tout dynamiquement sur `node`, comme le reste de ce module.
 */
export function genererProfilsPartiels(node: Noeud, count: number, seed = GRAINE_PAR_DEFAUT): ProfilPartiel[] {
  const saisissables = node.criteres_entree.filter((c) => c.derive == null)
  const tousLesNoms = saisissables.map((c) => c.nom)
  const exclusions = exclusionsDuNoeud(node)
  const critiques = saisissables.filter(
    (c) => (c.type === 'nombre' || c.type === 'enum') && critereCiteDans(c, exclusions),
  )

  const base = genererProfils(node, count, seed).slice(0, count)
  const profils: ProfilPartiel[] = []

  for (let i = 0; i < base.length; i++) {
    let masque: string[]
    let regime: ProfilPartiel['regime']
    if (i < critiques.length) {
      masque = [critiques[i].nom]
      regime = 'critique'
    } else {
      const rng = mulberry32((seed ^ hashChaine(`__masque_partiel_${i}__`)) >>> 0)
      const fraction = 0.2 + 0.5 * rng() // dans [0.2, 0.7)
      const nb = Math.min(tousLesNoms.length, Math.max(1, Math.round(tousLesNoms.length * fraction)))
      masque = melanger(tousLesNoms, rng).slice(0, nb)
      regime = 'stratifie'
    }
    const masqueSet = new Set(masque)
    profils.push({
      criteria: base[i],
      renseignes: new Set(tousLesNoms.filter((nom) => !masqueSet.has(nom))),
      masque,
      regime,
    })
  }
  return profils
}
