/**
 * Générateur DYNAMIQUE de PROFILS DE CRITÈRES pour le banc d'un nœud (docs/decision/GRAMMAIRE-NOEUD.md,
 * section « Le banc d'un nœud — trois couches »), couches 2 (couverture) et 3 (invariants) — ces deux
 * couches ont besoin d'EXPLORER largement un espace qui bouge avec le contenu, donc de retirer ici, à
 * chaque exécution. La couche 1 (caractérisation, golden master textuel) a le besoin STRICTEMENT INVERSE
 * — un patient STABLE d'une exécution à l'autre — et ne consomme donc plus ce générateur directement
 * depuis `caracterisation.test.ts` : voir la section « CAPTURE D'UNE FIXTURE FIGÉE » en fin de fichier et
 * la justification de conception complète en tête de `banc/fixtureProfils.ts`.
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
import { respecteContraintes } from '../contraintes.ts'
import { reglesDeDecision } from '../expressionsNoeud.ts'

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

/**
 * Tous les fragments de règle DU NŒUD où un critère peut apparaître (mécanique, aucun nom connu).
 *
 * DÉLÉGUÉ à `engine/expressionsNoeud.ts` depuis le 2026-07-27 (cause racine S1). Ce fichier portait sa
 * propre copie, qui omettait `option.prerequis` ET `option.alertes[].quand` — cette seconde omission est
 * la cause DIRECTE de la « bande CK 10-50 jamais couverte » diagnostiquée ici même comme un aléa de
 * tirage : ce n'en était pas un. Les seuils de ces deux alertes n'entraient dans le domaine d'aucun
 * critère, donc aucun profil ne pouvait les franchir, et le trou de sécurité qu'ils gardaient est resté
 * figé en vert dans le golden master.
 */
function reglesDuNoeud(node: Noeud): string[] {
  return reglesDeDecision(node)
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

/**
 * Au-delà de cette taille, le produit cartésien des critères énumérables n'est plus énuméré en entier
 * (coût prohibitif) : repli sur l'échantillonnage stratifié seul (stratégie 2, cf. docstring module).
 *
 * **RELEVÉ DE 20 000 À 60 000 le 2026-07-27**, sur mesure et non au jugé. Deux nœuds se trouvaient
 * JUSTE au-dessus de l'ancien plafond et perdaient donc la garantie de couverture exhaustive pour
 * quelques milliers de combinaisons :
 *
 * | nœud | produit cartésien | régime à 20 000 | régime à 60 000 |
 * |---|---|---|---|
 * | `cible-glycemique` | 600 | 1 | 1 |
 * | `statine` | **47 520** | 2 | **1** |
 * | `rhd-activite-physique` | **55 296** | 2 | **1** |
 * | `rhd-alimentation` | 2,9 × 10⁸ | 2 | 2 |
 * | `insuline` | 8,6 × 10¹¹ | 2 | 2 |
 * | `prescription` | 1,3 × 10¹² | 2 | 2 |
 *
 * La frontière est nette : trois nœuds sont hors d'atteinte de plusieurs ordres de grandeur (aucun
 * plafond réaliste ne les ramènera), deux étaient à un facteur 2-3 près. Coût mesuré du relèvement sur
 * la suite complète : **7,6 s → 22,7 s**. Cher en proportion, dérisoire en absolu, et payé pour
 * transformer une couverture PROBABLE en couverture PROUVÉE sur deux nœuds — dont `statine`, où le
 * défaut qui a motivé la mesure était une alerte de sécurité (ASCVD + dialyse sans statine, HAUTE-4)
 * ajoutée la veille et déjà décrochée.
 *
 * CE QUI A RENDU LE DÉFAUT INVISIBLE, et qui compte plus que le chiffre : `statine` était en stratégie 1
 * jusqu'à ce que le critère `CK_x_normale` lui soit ajouté, le matin même. Onze valeurs candidates de
 * plus ont multiplié le produit par 11 et fait franchir le plafond — **en silence**. Aucun test ne
 * pouvait le dire, puisque la stratégie n'était exposée nulle part. C'est pour cela que `regimeDeBanc`
 * existe désormais et que `banc/grammaire.test.ts` exige de DÉCLARER tout nœud en stratégie 2 : le jour
 * où un nœud repassera la frontière, ce sera une décision, pas un accident.
 *
 * **RELEVÉ DE 60 000 À 120 000 le 2026-07-29**, et c'est exactement le mécanisme que le paragraphe
 * ci-dessus annonçait — cette fois SIGNALÉ, pas subi. `rhd-activite-physique` a remplacé sa `liste`
 * `traitements_en_cours` (9 valeurs) par le `bool` `insuline_ou_insulinosecreteur` : une `liste` n'est
 * PAS énumérable (`domaineEnumerable` renvoie `null`), un `bool` l'est — la simplification, qui retire
 * pourtant 8 cases à cocher au praticien, MULTIPLIE le produit cartésien par 2 (55 296 → 110 592) et lui
 * a fait franchir l'ancien plafond. `banc/grammaire.test.ts` (G3) l'a dit à l'exécution même du lot.
 *
 * | nœud | produit cartésien | régime à 60 000 | régime à 120 000 |
 * |---|---|---|---|
 * | `cible-glycemique` | 600 | 1 | 1 |
 * | `statine` | 51 840 | 1 | 1 |
 * | `rhd-activite-physique` | **110 592** | **2** | **1** |
 * | `rhd-alimentation` | 1,7 × 10⁸ | 2 | 2 |
 * | `insuline` | 8,6 × 10¹¹ | 2 | 2 |
 * | `prescription` | 1,3 × 10¹² | 2 | 2 |
 *
 * Même arbitrage qu'en 2026-07-27, et pour la même raison : ce nœud reste à un facteur 2 du plafond, la
 * seule alternative aurait été de le DÉCLARER probabiliste dans `NOEUDS_HORS_ENUMERATION_EXHAUSTIVE`
 * (`banc/grammaire.test.ts`) — que sa propre docstring interdit pour un nœud de cet ordre de grandeur —
 * et le nœud porte une alerte de sécurité (hypoglycémie à l'effort) dont on veut la couverture PROUVÉE.
 */
const PLAFOND_ENUMERATION_EXHAUSTIVE = 120000

/**
 * Taille EFFECTIVE du banc pour `node` (hors critère `omettre`, le cas échéant) à une taille demandée
 * `count` : si le produit cartésien des critères énumérables reste raisonnable, il sert de PLANCHER
 * (garantit une couverture EXHAUSTIVE de toute conjonction) ; sinon `count` est inchangé.
 */
function tailleEffective(node: Noeud, count: number, omettre?: string): number {
  const { strategie, produitEnumerable } = regimeDeBanc(node, count, omettre)
  return strategie === 1 ? Math.max(count, produitEnumerable) : count
}

/**
 * RÉGIME du banc pour `node` — quelle des deux stratégies de combinaison s'applique, et sur quel produit
 * cartésien. **Exposé le 2026-07-27**, et c'est un livrable en soi, pas un utilitaire de confort.
 *
 * POURQUOI. Les deux stratégies n'offrent PAS la même garantie :
 *  - stratégie 1 (produit cartésien énuméré) : **toute conjonction** de critères énumérables apparaît au
 *    moins une fois. La couverture est un THÉORÈME.
 *  - stratégie 2 (échantillonnage stratifié) : chaque VALEUR apparaît souvent, mais une conjonction
 *    étroite de `m` clauses n'apparaît qu'avec probabilité ~∏(1/kᵢ). La couverture devient une
 *    PROBABILITÉ.
 *
 * Le basculement de l'une à l'autre se fait **en silence**, dès que le produit franchit
 * `PLAFOND_ENUMERATION_EXHAUSTIVE` — c'est-à-dire dès qu'on ajoute un critère, ou même seulement des
 * valeurs candidates à un critère existant. Constaté le 2026-07-27 : l'ajout du critère `CK_x_normale`
 * à `statine` (le matin même) a fait passer ce nœud de la stratégie 1 à la stratégie 2 sans qu'aucun
 * test ne le signale. Une alerte de sécurité ajoutée la veille pour fermer un défaut de red-team
 * (ASCVD + dialyse sans statine) a cessé d'être couverte — non parce que le contenu avait changé, mais
 * parce que l'instrument avait changé de précision à l'insu de tout le monde.
 *
 * Un banc dont la garantie se dégrade sans le dire apprend à faire confiance à un vert qui ne vaut plus
 * ce qu'il valait. `banc/grammaire.test.ts` en fait donc une DÉCLARATION : un nœud en stratégie 2 doit
 * être nommé et motivé, jamais y tomber par accident.
 */
export interface RegimeDeBanc {
  strategie: 1 | 2
  /** Produit cartésien des domaines énumérables (critères `liste` exclus), plafonné à l'arrêt du calcul. */
  produitEnumerable: number
  /** Nombre de profils réellement engendrés à `count` demandé. */
  taille: number
}

export function regimeDeBanc(node: Noeud, count: number, omettre?: string): RegimeDeBanc {
  let produit = 1
  let auMoinsUnEnumerable = false
  for (const critere of node.criteres_entree) {
    if (critere.derive != null || critere.nom === omettre) continue
    const domaine = domaineEnumerable(node, critere)
    if (domaine === null) continue // 'liste' : hors produit cartésien
    auMoinsUnEnumerable = true
    produit *= Math.max(1, domaine.length)
    if (produit > PLAFOND_ENUMERATION_EXHAUSTIVE) {
      return { strategie: 2, produitEnumerable: produit, taille: count }
    }
  }
  if (!auMoinsUnEnumerable) return { strategie: 2, produitEnumerable: 0, taille: count }
  return { strategie: 1, produitEnumerable: produit, taille: Math.max(count, produit) }
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
 * Séquence stratifiée INDÉPENDANTE de `count` valeurs pour UN SEUL critère (non `liste` : `sequenceStratifiee`
 * directe sur son domaine énumérable ; `liste` : sous-ensembles construits par inclusion stratifiée
 * indépendante par valeur possible — même mécanique que la stratégie 2 de `construireSequences`
 * ci-dessous, qui l'utilise). Extraite pour être réutilisée par `completerFixtureProfils` (fin de fichier,
 * banc/fixtureProfils.ts) : ajouter UNE colonne à une fixture déjà figée exige de ne JAMAIS dépendre des
 * AUTRES critères du nœud — condition que seule cette fonction (par opposition à la stratégie 1, produit
 * cartésien, qui COUPLE toutes les colonnes énumérables par un seul index combiné) peut garantir.
 */
function sequencePourUnCritere(node: Noeud, critere: CritereEntree, count: number, seedBase: number): CriteriaValue[] {
  const seedCritere = (seedBase ^ hashChaine(critere.nom)) >>> 0
  if (critere.type === 'liste') return sousEnsemblesStratifies(critere, count, seedCritere)
  return sequenceStratifiee(domaineEnumerable(node, critere) ?? [], count, seedCritere)
}

/**
 * Sous-ensembles d'un critère `liste`, stratifiés PAR CARDINALITÉ (correctif du 2026-07-27).
 *
 * CE QUI ÉTAIT FAIT AVANT, et pourquoi c'était biaisé. Chaque valeur possible recevait sa propre
 * séquence d'inclusion booléenne stratifiée, indépendante des autres — soit, en pratique, `n` tirages à
 * pile ou face. Chaque valeur apparaissait bien ~50 % du temps (la propriété visée, et elle est
 * conservée ci-dessous), mais la LOI DES CARDINALITÉS qui en résultait était binomiale : sur un critère
 * à `n` valeurs, la liste VIDE ne sortait qu'une fois sur 2ⁿ.
 *
 * POURQUOI C'EST UN DÉFAUT, et pas une simple curiosité statistique. L'idiome du dépôt pour « le patient
 * ne prend pas déjà cette classe » est un `prerequis` en `ne_contient_pas`, répété une fois par classe
 * (R6). Une option gardée par 4 clauses de ce type exigeait donc un événement à 2⁻⁴, et une option
 * exigeant la liste entièrement vide un événement à 2⁻ⁿ. **Le coût croît avec le nombre de valeurs
 * DÉCLARÉES**, qui n'a aucun rapport clinique avec la rareté du profil : ajouter une 9ᵉ molécule au
 * catalogue divisait par deux la probabilité d'engendrer un patient « naïf de tout », alors que ce
 * patient est banal en consultation.
 *
 * MESURÉ sur `prescription` avant correctif : `traitements_en_cours` déclare 8 valeurs, la liste vide
 * sortait **11 fois sur 1840** profils, et seuls **126** profils (6,8 %) ne contenaient aucune des 4
 * classes que l'option « Association iSGLT2 + AR GLP‑1 » exige absentes. Cette option est passée de
 * « couverte » à « jamais applicable » sur un simple changement de graine effective — sa couverture
 * tenait au hasard, pas au banc. Vérifié dans l'autre sens : un profil construit À LA MAIN la rend
 * applicable, donc le contenu n'était pas en cause.
 *
 * CE QUI EST FAIT MAINTENANT : la CARDINALITÉ du sous-ensemble est elle-même tirée dans une séquence
 * stratifiée sur `[0, 1, …, n]` — chaque taille reçoit ~`count / (n+1)` profils, la liste vide comme la
 * liste pleine. Les valeurs retenues sont ensuite choisies par un mélange déterministe propre au profil,
 * puis remises dans l'ordre DÉCLARÉ (lisibilité des messages d'échec ; `contient` ne teste que
 * l'appartenance, l'ordre ne change aucune évaluation).
 *
 * PROPRIÉTÉ CONSERVÉE, et c'est ce qui rend le correctif sûr : la fréquence marginale de chaque valeur
 * reste ~50 % (espérance de cardinalité = n/2, choix uniforme parmi les valeurs ⇒ chaque valeur sort
 * n/2 ÷ n = 1 fois sur 2). Le banc ne perd donc rien de la couverture par valeur qu'il avait ; il gagne
 * les cardinalités extrêmes, qui étaient exponentiellement rares.
 *
 * INDÉPENDANCE PRÉSERVÉE vis-à-vis des autres critères (condition non négociable, cf. docstring de
 * `sequencePourUnCritere` : `completerFixtureProfils` ajoute UNE colonne sans toucher aux autres) : tout
 * est dérivé de `seedCritere` et de l'indice du profil, jamais des valeurs d'un autre critère.
 */
function sousEnsemblesStratifies(critere: CritereEntree, count: number, seedCritere: number): CriteriaValue[] {
  const valeurs = critere.valeurs ?? []
  if (valeurs.length === 0) return Array.from({ length: count }, () => [])
  const cardinalites = sequenceStratifiee(
    Array.from({ length: valeurs.length + 1 }, (_, k) => k),
    count,
    (seedCritere ^ hashChaine('__cardinalite__')) >>> 0,
  )
  return cardinalites.map((card, i) => {
    const rng = mulberry32((seedCritere ^ hashChaine(`__sousensemble_${i}__`)) >>> 0)
    const retenues = new Set(melanger(valeurs, rng).slice(0, card))
    return valeurs.filter((v) => retenues.has(v)) // ordre DÉCLARÉ, pas l'ordre du mélange
  })
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
      sequences.set(critere.nom, sequencePourUnCritere(node, critere, count, seedBase))
    }
  }

  // Critères `liste` : toujours par séquence d'inclusion stratifiée indépendante par valeur possible.
  for (const critere of listeCriteres) {
    sequences.set(critere.nom, sequencePourUnCritere(node, critere, count, seedBase))
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
 * TENTATIVE ×4 (320) ABANDONNÉE le 2026-08-05 (T-148) — DIAGNOSTIC LAISSÉ ICI POUR LA PROCHAINE TÂCHE.
 * La stratégie 2 (séquences stratifiées INDÉPENDANTES par critère, cf. docstring module) garantit la
 * couverture marginale de chaque critère PRIS SÉPARÉMENT, jamais la coïncidence JOINTE d'une dizaine de
 * critères sur leur valeur « bénigne » au même indice de profil — sur `prescription` (~10 critères
 * pertinents pour un patient naïf sans aucune indication ni signe de gravité), la probabilité jointe est
 * de l'ordre de 1/10 000, largement sous les 1 840 profils actuels. Symptôme observé : la carte de repli
 * « Mesures hygiéno‑diététiques seules — réévaluer » (patient naïf, déjà à l'objectif, aucune
 * comorbidité) devenue injoignable sur le banc APRÈS la levée de l'exclusion glucotoxicité sur
 * iSGLT2/AR GLP‑1/insuline (même tâche) — les deux seuls profils qui la couvraient jusque-là combinaient
 * glucotoxicité + objectif atteint, exactement le trou que ce correctif ferme autrement. VÉRIFIÉ À LA
 * MAIN (profil construit hors banc, hors régression) : la carte reste sémantiquement correcte — c'est un
 * angle mort de l'ÉCHANTILLONNAGE, pas un défaut de contenu (cf. `docs/decision/...` si un correctif de
 * contenu était suspecté, ce n'est pas le cas ici).
 * ×4 (320) retrouvait bien un profil joint bénin sur `prescription` (7 360 profils, coverage OK,
 * ~16 s pour ce seul fichier) — mais CE PARAMÈTRE EST GÉNÉRIQUE (invariant CLAUDE.md 5, aucun nom de
 * nœud) : il s'applique à TOUS les nœuds, et a fait TIMEOUT deux tests indépendants du banc
 * (`invariants-contenu.test.ts`, I16 sur `insuline`/`prescription` et I26 sur `prescription`) qui portent
 * un délai codé EN DUR à 5000 ms au lieu de `DELAI_BANC_MS` (300 000 ms) utilisé ailleurs dans le banc.
 * Élargir le banc de TOUS les nœuds pour fermer UN SEUL trou de couverture, au prix de casser des tests
 * non liés à cette tâche, dépasse le mandat d'un correctif de contenu clinique — repoussé à une tâche
 * dédiée (candidats : harmoniser les timeouts sur `DELAI_BANC_MS` avant de relever ce multiplicateur, ou
 * une stratégie de génération qui FORCE quelques profils « bénins » canoniques plutôt que de compter sur
 * la coïncidence statistique). Le test de couverture `prescription` reste donc en échec connu pour
 * l'option « Mesures hygiéno‑diététiques seules — réévaluer » jusqu'à cette tâche.
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
 * Génère des profils de critères SAISISSABLES bruts pour `node` — critères DÉRIVÉS PAS encore calculés
 * (cf. `genererProfils` ci-dessous, qui les ajoute). Déterministe : mêmes `node`/`count`/`seed` ⇒ mêmes
 * profils, dans le même ordre. Le nombre de profils renvoyé peut dépasser `count` (jamais en-deçà) : cf.
 * `tailleEffective`/docstring module.
 *
 * Réservée à deux appelants : `genererProfils` ci-dessous (usage normal, couches dynamiques couverture/
 * invariants) et `genererFixtureProfils` (fin de fichier, CAPTURE d'un jeu figé pour
 * `banc/fixtureProfils.ts`, consommé par `caracterisation.test.ts`) — cette dernière a besoin des
 * critères BRUTS, jamais dérivés, pour que la fixture figée puisse être relue avec des dérivés recalculés
 * depuis le contenu COURANT plutôt que gelés au moment de la capture (cf. justification de conception,
 * tête de `fixtureProfils.ts`).
 */
export function genererProfilsBruts(node: Noeud, count: number, seed = GRAINE_PAR_DEFAUT): Criteria[] {
  const effectif = tailleEffective(node, count)
  const sequences = construireSequences(node, effectif, seed)
  const profils: Criteria[] = []
  for (let i = 0; i < effectif; i++) {
    const brut: Criteria = {}
    for (const [nom, sequence] of sequences) brut[nom] = sequence[i]
    profils.push(brut)
  }
  return profils
}

/**
 * Génère des profils de critères VALIDES pour `node`, critères DÉRIVÉS déjà calculés
 * (`calculerCriteresDerives` appliqué avant renvoi — prêts pour `evaluateNode` sans étape
 * supplémentaire, cf. consigne de tâche « Applique calculerCriteresDerives avant toute évaluation »).
 * Déterministe : mêmes `node`/`count`/`seed` ⇒ mêmes profils, dans le même ordre. Le nombre de profils
 * renvoyé peut dépasser `count` (jamais en-deçà) : cf. `tailleEffective`/docstring module.
 *
 * Appelée UNIQUEMENT par les couches dynamiques (`couverture.test.ts`, `invariants.test.ts`,
 * `genererPairesBooleennes`/`genererProfilsPartiels` ci-dessous en repli) : `caracterisation.test.ts`
 * (couche 1, golden master) ne l'appelle plus — cf. `banc/fixtureProfils.ts` pour la raison (le tirage
 * dépend du contenu, donc instable en index d'une exécution à l'autre dès que le contenu change).
 */
export function genererProfils(node: Noeud, count: number, seed = GRAINE_PAR_DEFAUT): Criteria[] {
  const complets = genererProfilsBruts(node, count, seed).map((brut) =>
    calculerCriteresDerives(node.criteres_entree, brut),
  )
  if ((node.contraintes ?? []).length === 0) return complets
  return filtrerParContraintes(node, complets, seed)
}

/**
 * Facteur de SUR-GÉNÉRATION quand un nœud déclare des `contraintes` : le tirage étant indépendant critère
 * par critère, une relation comme `TBR_severe <= TBR` élimine environ la moitié des profils, et le banc
 * rétrécirait d'autant. On regénère donc plus large, puis on tronque à la taille demandée.
 *
 * CE QUI REND CETTE MANŒUVRE SÛRE, et ce n'est pas un détail : les séquences de ce module sont **stables
 * en préfixe**. `sequenceStratifiee` comme la stratégie 1 empilent des blocs mélangés jusqu'à atteindre la
 * taille demandée, puis tronquent — les `n` premières valeurs d'une séquence de `3n` sont donc EXACTEMENT
 * les `n` valeurs d'une séquence de `n`, à graine égale. Sur-générer n'échange aucun profil contre un
 * autre : cela en ajoute à la suite. Le banc filtré est donc le banc d'origine amputé de ses profils
 * impossibles, complété par les suivants — et non un tirage différent.
 */
const FACTEUR_SURGENERATION = 3

/**
 * Retire les profils qui violent une contrainte de `node`, en complétant par sur-génération pour tenir la
 * taille demandée. Si la sur-génération ne suffit pas (contraintes très restrictives), on renvoie ce qu'on
 * a : un banc plus court est un défaut visible (couverture qui décroche), là où un banc peuplé d'états
 * impossibles est un faux vert.
 */
function filtrerParContraintes(node: Noeud, complets: Criteria[], seed: number): Criteria[] {
  const cible = complets.length
  const retenus = complets.filter((profil) => respecteContraintes(node, profil))
  if (retenus.length >= cible) return retenus.slice(0, cible)

  const large = genererProfilsBruts(node, cible * FACTEUR_SURGENERATION, seed)
    .map((brut) => calculerCriteresDerives(node.criteres_entree, brut))
    .filter((profil) => respecteContraintes(node, profil))
  return large.slice(0, cible)
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
  // Une paire dont un membre décrit un patient IMPOSSIBLE ne prouve rien : la comparaison « toutes choses
  // égales par ailleurs » suppose que les deux côtés soient des patients. Filtrée sans sur-génération —
  // ces bancs servent à comparer, pas à couvrir, et une paire de moins ne crée pas de trou de couverture.
  if ((node.contraintes ?? []).length === 0) return paires
  return paires.filter((paire) => respecteContraintes(node, paire.aVrai) && respecteContraintes(node, paire.aFaux))
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
 * profils COMPLETS (mêmes valeurs concrètes, mêmes garanties de déterminisme) et retire de `renseignes`
 * un sous-ensemble de critères SAISISSABLES, à graine fixe.
 *
 * DEUX RÉGIMES DE MASQUE, dans cet ordre (les premiers profils sont les plus CIBLÉS, donc les plus
 * lisibles en relecture clinique) :
 *
 * 1. Un critère CRITIQUE — `nombre`/`enum` CITÉ PAR UNE `exclusions` de `node` (`exclusionsDuNoeud`
 *    ci-dessus) — masqué SEUL (tous les autres critères restent renseignés), un profil par critère
 *    critique, dans l'ordre de `criteres_entree`. C'est le scénario Q2 du référent (garde-fou sur donnée
 *    manquante) à l'état le plus pur : un seul champ manque, et c'est justement celui qui commande un
 *    garde-fou. `bool`/`liste` ne sont PAS retenus dans ce filtre CIBLÉ (le filtre ne teste que
 *    `c.type === 'nombre' || c.type === 'enum'`, inchangé par D30) : depuis le 2026-07-28 (P4/S1, T-018)
 *    un `bool`/`liste` SANS `presomption_non: true` PEUT produire le même scénario Q2 quand il est cité
 *    par une `exclusions` (ex. `dialyse` sur `statine`, `denutrition` sur `prescription`) — mais cette
 *    fonction ne les engendre pas encore comme profils CIBLÉS un par un ; ils restent couverts par le
 *    régime 2 (masque stratifié plus large) ci-dessous. Extension éventuelle, hors périmètre de ce lot
 *    (T-018 ne modifie pas la génération de profils du banc).
 * 2. Au-delà (nœud sans assez de critères critiques pour couvrir `count`, ex. `cible-glycemique`/`rhd`/
 *    `statine`, aucune `exclusions` déclarée) : un masque STRATIFIÉ plus large — une fraction du
 *    formulaire tirée dans [20 %, 70 %) à graine fixe (dérivée de l'INDICE du profil, jamais
 *    `Math.random`, cf. docstring de tête du module) — simule un formulaire réellement partiel, pas
 *    seulement un champ isolé.
 *
 * `baseProfils` (optionnel) : profils COMPLETS déjà construits, injectés par l'appelant, plutôt que
 * générés ici dynamiquement — `caracterisation.test.ts` y passe désormais son jeu FIGÉ
 * (`banc/fixtureProfils.ts` `profilsFigesPourNoeud`), pour la même raison que sa caractérisation
 * principale n'appelle plus `genererProfils` directement (cf. tête de `fixtureProfils.ts` : le tirage
 * dynamique est la source de l'instabilité en index qu'un jeu figé corrige). Absent (repli) :
 * comportement HISTORIQUE inchangé, génère dynamiquement via `genererProfils` — c'est ce repli
 * qu'utilisent encore, indirectement ou pas du tout, les autres appelants éventuels de cette fonction
 * (aucun aujourd'hui en dehors de `caracterisation.test.ts`, cf. couches couverture/invariants qui
 * n'appellent jamais `genererProfilsPartiels`).
 *
 * Générique (CLAUDE.md invariant 5 / DECISIONS.md D8) : ne connaît aucun nom de critère par avance, lit
 * tout dynamiquement sur `node`, comme le reste de ce module.
 */
export function genererProfilsPartiels(
  node: Noeud,
  count: number,
  seed = GRAINE_PAR_DEFAUT,
  baseProfils?: readonly Criteria[],
): ProfilPartiel[] {
  const saisissables = node.criteres_entree.filter((c) => c.derive == null)
  const tousLesNoms = saisissables.map((c) => c.nom)
  const exclusions = exclusionsDuNoeud(node)
  const critiques = saisissables.filter(
    (c) => (c.type === 'nombre' || c.type === 'enum') && critereCiteDans(c, exclusions),
  )

  const base = (baseProfils ?? genererProfils(node, count, seed)).slice(0, count)
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

// ---------------------------------------------------------------------------------------------------
// CAPTURE D'UNE FIXTURE FIGÉE — consommée par `banc/fixtureProfils.ts` (lecture) et
// `banc/geler-profils.maintenance.test.ts` (écriture, désactivé par défaut). Voir la justification de
// conception complète en tête de `fixtureProfils.ts` : `caracterisation.test.ts` (golden master de
// couche 1) ne tire PLUS ses profils directement depuis ce module à chaque exécution — le contenu change
// les valeurs candidates (seuils extraits des règles, cf. tête de fichier ci-dessus), donc le tirage,
// donc quel PATIENT tombe à quel index. Les fonctions ci-dessous ne changent AUCUN comportement des deux
// couches dynamiques (couverture, invariants, qui continuent d'appeler `genererProfils`/
// `genererPairesBooleennes` telles quelles, ci-dessus) — elles ajoutent seulement la mécanique de CAPTURE
// (bootstrap intégral) et de COMPLÉTION (une colonne à la fois, sans toucher aux autres) d'un jeu figé,
// réservée au chemin de maintenance explicite.
// ---------------------------------------------------------------------------------------------------

/**
 * Forme PERSISTÉE d'un jeu de profils figé (un fichier JSON par nœud, `banc/fixtures/profils.<id>.json`,
 * versionné comme n'importe quel autre golden master, cf. `banc/fixtureProfils.ts`). `profils` ne
 * contient QUE les critères SAISISSABLES (jamais les dérivés : ils sont recalculés à la LECTURE depuis le
 * contenu courant, pour qu'une évolution d'un `derive` reste visible dans le diff de sortie sans jamais
 * changer l'identité figée du patient) — et peut être PARTIEL vis-à-vis de `Noeud.criteres_entree`
 * courant : un critère absent de `criteresColonnes` n'a simplement encore reçu aucun tirage figé (cf.
 * `completerFixtureProfils` ci-dessous).
 */
export interface FixtureProfils {
  /** Id du nœud, pour un contrôle de cohérence au chargement (`banc/fixtureProfils.ts`). */
  noeudId: string
  /** Graine ayant servi à la capture d'origine — traçabilité seulement, jamais relue pour recalculer. */
  graine: number
  /** Noms des critères SAISISSABLES couverts par un tirage RÉEL (par opposition à un critère apparu dans
   * le contenu depuis la capture, qui retombe sur sa valeur par défaut jusqu'à complétion explicite). */
  criteresColonnes: string[]
  /** Les profils eux-mêmes (critères saisissables bruts uniquement, cf. docstring d'interface). */
  profils: Criteria[]
}

/**
 * Capture un jeu figé COMPLET pour `node` : EXACTEMENT `count` profils bruts (`genererProfilsBruts`,
 * PUIS `slice(0, count)` — `genererProfilsBruts` peut renvoyer PLUS que `count` si le produit cartésien
 * des critères énumérables du nœud le dépasse, plancher de couverture exhaustive utile aux couches
 * dynamiques mais hors de propos pour une fixture de taille FIXE, cf. `tailleEffective`/docstring de tête
 * du module), toutes les colonnes saisissables du contenu ACTUEL. Réservée au cas « nœud NOUVEAU, aucune
 * fixture existante » (le seul cas où repartir d'une génération intégrale est correct — il n'y a rien
 * d'existant à préserver), cf. `geler-profils.maintenance.test.ts`. Fonction PURE : n'écrit rien sur
 * disque elle-même — l'écriture est la responsabilité de `banc/fixtureProfils.ts` (`ecrireFixtureProfils`).
 */
export function genererFixtureProfils(node: Noeud, count: number, seed = GRAINE_PAR_DEFAUT): FixtureProfils {
  const criteresColonnes = node.criteres_entree.filter((c) => c.derive == null).map((c) => c.nom)
  // Les `contraintes` s'appliquent AUSSI au bootstrap d'un nœud neuf (2026-07-27) : figer d'emblée des
  // patients impossibles reviendrait à créer la dette que `reparerFixtureProfils` existe pour solder.
  const surgenere = (node.contraintes ?? []).length > 0 ? count * FACTEUR_SURGENERATION : count
  const profils = genererProfilsBruts(node, surgenere, seed)
    .filter((brut) => respecteContraintes(node, calculerCriteresDerives(node.criteres_entree, brut)))
    .slice(0, count)
  return { noeudId: node.id, graine: seed, criteresColonnes, profils }
}

/**
 * LA procédure de mise à jour d'un jeu figé face à un nouveau critère de contenu (cf. justification de
 * conception, tête de `fixtureProfils.ts`) : ajoute une colonne, tirée déterministiquement et
 * INDÉPENDAMMENT des autres (`sequencePourUnCritere` ci-dessus), pour chaque critère SAISISSABLE du
 * `node` ACTUEL absent de `fixture.criteresColonnes` — et RIEN d'autre. Toutes les valeurs déjà figées
 * (`fixture.profils`) ressortent identiques, clé pour clé, dans le résultat : c'est la propriété qui rend
 * cette fonction sûre à appeler après CHAQUE évolution de contenu, y compris quand elle ne fait rien
 * (aucun critère manquant ⇒ renvoie `fixture` telle quelle, MÊME référence). `count` reste celui de la
 * fixture existante (`fixture.profils.length`) : cette fonction ne change JAMAIS le nombre de profils
 * figés, seulement leurs colonnes — jamais la stratégie 1 (produit cartésien) de `construireSequences`,
 * qui COUPLERAIT la nouvelle colonne à toutes les colonnes existantes et invaliderait le jeu entier.
 */
/**
 * RÉPARE une fixture figée en ne remplaçant QUE les profils qui violent une `contrainte` du nœud
 * (2026-07-27, second temps du correctif K3). Les profils conformes ressortent à leur INDEX, inchangés
 * clé pour clé.
 *
 * POURQUOI, et pourquoi seulement ceux-là. Le filtrage de `genererProfils` ne protège que les couches
 * DYNAMIQUES ; `caracterisation.test.ts` lit un jeu FIGÉ, qui ne passe par aucun filtre. Mesuré le
 * 2026-07-27, une fois les contraintes déclarées : **84 des 179 profils figés d'`insuline` (47 %) et 44
 * des 179 de `prescription` (25 %) décrivent des patients impossibles.** Le golden master — celui-là même
 * qui sert de support à la relecture clinique — en documentait donc près d'un sur deux. Un cas l'a rendu
 * visible : un profil « naïf d'insuline » avec une insuline déjà cochée a PERDU sa dernière option (le
 * prérequis de repli venait d'être posé) et se serait affiché comme un ÉCRAN VIDE pour un patient qui ne
 * peut pas exister — une fausse alerte, exactement le contraire de ce qu'un golden master doit produire.
 *
 * REMPLACER SEULEMENT LES FAUTIFS, et non tout régénérer, est la même règle que celle qui gouverne
 * `completerFixtureProfils` (cf. la docstring de `geler-profils.maintenance.test.ts` : « ne régénère
 * jamais une colonne déjà figée ») : on ne touche pas à ce qui est bon. 95 patients d'`insuline` et 135 de
 * `prescription` gardent ainsi leur identité, et le diff du golden master reste lisible — il se limite aux
 * profils qui devaient changer.
 *
 * Les remplaçants sont tirés du MÊME flux déterministe, sur-généré puis filtré, et consommés dans l'ordre :
 * à graine égale, la réparation est reproductible.
 */
export function reparerFixtureProfils(
  node: Noeud,
  fixture: FixtureProfils,
  seed = GRAINE_PAR_DEFAUT,
): { fixture: FixtureProfils; remplaces: number } {
  if ((node.contraintes ?? []).length === 0) return { fixture, remplaces: 0 }
  const estConforme = (brut: Criteria) =>
    respecteContraintes(node, calculerCriteresDerives(node.criteres_entree, brut))

  const fautifs = fixture.profils.filter((p) => !estConforme(p)).length
  if (fautifs === 0) return { fixture, remplaces: 0 }

  // Réserve de remplaçants : le même tirage, sur-généré, dont on retire ce qui est déjà figé à
  // l'identique n'a pas lieu d'être — un doublon éventuel reste un patient POSSIBLE, donc acceptable.
  const reserve = genererProfilsBruts(node, fixture.profils.length * FACTEUR_SURGENERATION, seed).filter(estConforme)
  if (reserve.length < fautifs) {
    throw new Error(
      `reparerFixtureProfils : ${fautifs} profils à remplacer sur "${node.id}", ` +
        `seulement ${reserve.length} remplaçants conformes engendrés.`,
    )
  }

  let curseur = 0
  const profils = fixture.profils.map((p) => (estConforme(p) ? p : reserve[curseur++]))
  return { fixture: { ...fixture, profils }, remplaces: fautifs }
}

export function completerFixtureProfils(node: Noeud, fixture: FixtureProfils, seed = GRAINE_PAR_DEFAUT): FixtureProfils {
  if (fixture.noeudId !== node.id) {
    throw new Error(`completerFixtureProfils : fixture du nœud "${fixture.noeudId}" appliquée à "${node.id}".`)
  }
  const dejaColonnes = new Set(fixture.criteresColonnes)
  const manquants = node.criteres_entree.filter((c) => c.derive == null && !dejaColonnes.has(c.nom))
  if (manquants.length === 0) return fixture

  const count = fixture.profils.length
  const profils = fixture.profils.map((p) => ({ ...p }))
  for (const critere of manquants) {
    const colonne = sequencePourUnCritere(node, critere, count, seed)
    profils.forEach((p, i) => {
      p[critere.nom] = colonne[i]
    })
  }
  return { ...fixture, criteresColonnes: [...fixture.criteresColonnes, ...manquants.map((c) => c.nom)], profils }
}
