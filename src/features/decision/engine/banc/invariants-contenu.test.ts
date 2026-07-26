/**
 * Banc d'un nœud — COUCHE 3 « invariants », lot GÉNÉRIQUE de CONTENU (docs/decision/GRAMMAIRE-NOEUD.md,
 * section « Le banc d'un nœud — trois couches »). Formalise DECISIONS.md D21 (canal d'un fait de
 * sécurité : exclusion / alerte d'option / alerte de nœud, et ses deux interdits).
 *
 * DEUX invariants, tous deux 100 % GÉNÉRIQUES (CLAUDE.md invariant 5 : ce fichier ne connaît AUCUN nœud
 * ni domaine par son nom dans la LOGIQUE des tests — seules les constantes de dette ci-dessous nomment
 * des ids de nœud, exactement comme `NOEUDS_AVEC_SORTIE_VIDE_CONNUE` dans `invariants.test.ts` et
 * `NOEUDS_AVEC_CRITERES_MORTS_CONNUS` dans `couverture.test.ts`) :
 *
 * - I6 — une alerte de nœud n'a jamais `quand: "default"` (s'affiche pour tout le monde, donc pour
 *   personne — D21, second interdit) ;
 * - I7 — une alerte de nœud dont le message INTERDIT un geste a une contrepartie qui RETIRE réellement
 *   l'option visée (une `exclusion` mentionnant l'un des critères cités dans le `quand` de l'alerte).
 *
 * DÉLIBÉRÉMENT SANS DÉPENDANCE AU MOTEUR : ni `evaluateNode`, ni `evaluateCondition`, ni `profils.ts`
 * (contrainte de la mission — un autre lot modifie `engine/*.ts`/`lib/*.ts` en parallèle). Les deux
 * invariants ci-dessous sont des propriétés STATIQUES du contenu YAML tel que chargé par `loadNodes` :
 * ils lisent `Noeud.alertes` et `Option.exclusions` comme du texte, avec un tokenizer maison local
 * (volontairement plus simple que celui de `engine/conditions.ts`, qu'il ne réutilise pas). Une
 * évolution du moteur ne peut donc jamais faire varier leur verdict — seul un changement de CONTENU le
 * peut, ce qui est exactement la propriété demandée.
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import type { Option } from '../../content/node.types.ts'

// ---------------------------------------------------------------------------------------------------
// Tokenizer local, minimal : extrait les noms de VARIABLES cités dans une expression `quand`/`exclusions`
// (grammaire `docs/decision/BRIEF_DECISION.md` §11 / `engine/conditions.ts` : "variable OP valeur",
// composé par AND/OR). On ne réimplémente NI la précédence AND/OR NI l'évaluation — seulement
// l'extraction des noms de variables, qui ne dépend pas de la précédence (union, pas arbre).
// ---------------------------------------------------------------------------------------------------
// `\b` seulement après les opérateurs-MOTS (`contient`/`ne_contient_pas`) : après un opérateur SYMBOLE
// (`==`, `!=`…), les deux caractères de part et d'autre sont non-alphanumériques, donc `\b` n'y matche
// JAMAIS (piège vérifié empiriquement — sans ce correctif, aucune expression "variable == valeur" n'est
// reconnue, seules les formes "contient"/"ne_contient_pas" le sont).
const VARIABLE_RE = /^(\w+)\s*(?:==|!=|<=|>=|<|>|contient\b|ne_contient_pas\b)/

/** Ensemble des noms de critères cités dans une expression DSL (`quand` ou `exclusions`). Renvoie un
 * ensemble VIDE pour les sentinelles `"default"`/`"toujours"` (aucune variable à y lire), sans cas
 * particulier : elles ne matchent simplement pas `VARIABLE_RE`. */
function extraireCriteres(expression: string): Set<string> {
  const variables = new Set<string>()
  for (const terme of expression.split(/\s+(?:AND|OR)\s+/)) {
    const match = VARIABLE_RE.exec(terme.trim())
    if (match) variables.add(match[1])
  }
  return variables
}

function criteresDesExclusions(option: Option): Set<string> {
  const variables = new Set<string>()
  for (const expr of option.exclusions ?? []) {
    for (const v of extraireCriteres(expr)) variables.add(v)
  }
  return variables
}

/** Aplatit et raccourcit un message pour un message d'échec lisible sur une ligne. */
function tronque(message: string, max = 160): string {
  const aPlat = message.replace(/\s+/g, ' ').trim()
  return aPlat.length > max ? `${aPlat.slice(0, max)}…` : aPlat
}

// ---------------------------------------------------------------------------------------------------
// I7 — tournures prohibitives (heuristique de la mission, volontairement RESTREINTE à des formes non
// ambiguës). Ce que ça attrape / ce que ça laisse passer : voir le commentaire au-dessus du test I7.
// ---------------------------------------------------------------------------------------------------
const TOURNURES_PROHIBITIVES: RegExp[] = [
  /ne pas/i,
  /ne jamais/i,
  /contre[-‑]indiqu/i, // couvre le trait d'union normal ET le U+2011 insécable (« CONTRE‑INDIQUÉE »)
  /proscri/i,
  /arrêt/i, // couvre "arrêter"/"arrêt"/"ARRÊTÉE" — volontairement le radical, pas le seul infinitif
  /interdit/i,
]

function estProhibitive(message: string): boolean {
  return TOURNURES_PROHIBITIVES.some((re) => re.test(message))
}

// ---------------------------------------------------------------------------------------------------
// Dette connue — I6. `alertes[].quand === "default"` viole D21 (interdit n°2) par CONSTRUCTION, quel
// que soit le message : il n'y a rien à "diagnostiquer" au cas par cas, seulement à constater. Trois
// nœuds sur cinq en portent une aujourd'hui (`content/noeuds/diabete-type-2/*.yaml`, vérifié dans le
// YAML source) :
//   - `rhd` (L269, « sujet âgé / fragile / dénutri ») — LE cas relevé en recette, cité par la mission :
//     « elle s'affiche pour tout le monde, donc pour personne » ;
//   - `insuline` (L333, rappel « pas de bénéfice CV démontré, ORIGIN neutre ») ;
//   - `statine` (L125, rappel « décision sur le risque absolu, pas sur le LDL »).
// `prescription` et `cible-glycemique` n'ont AUCUNE alerte de nœud en `default` — I6 y passe réellement
// (aucune découverte a posteriori nécessaire pour eux : ce sont ces deux nœuds qui montrent que
// l'invariant a un pouvoir de détection réel, pas seulement un pouvoir de documentation).
// Cette liste ne doit grossir que si un nouveau `quand: "default"` apparaît dans une alerte de nœud —
// jamais pour faire taire une régression sur un nœud qui passait. Elle doit RÉTRÉCIR au fil du lot R8
// (DECISIONS.md D21, § Conséquences) qui corrige ces trois cas.
const NOEUDS_AVEC_ALERTE_DEFAULT_CONNUE = new Set<string>(['insuline', 'rhd', 'statine'])

// ---------------------------------------------------------------------------------------------------
// Dette connue — I7. Trois nœuds portent au moins une alerte prohibitive sans exclusion correspondante
// nulle part dans le nœud, cf. `docs/decision/validation/chantier-2026-07-26/inventaire-alertes.md`
// (6 couples alerte/option contradictoires, sur `insuline`, `statine`, `prescription` — AUCUN sur `rhd`,
// dont les alertes ne contredisent aucune option du nœud) :
//   - ~~`statine`~~ : **DETTE LEVÉE le 2026-07-26** (vague 3). L'alerte `dialyse == true` est devenue une
//     `exclusion` bornée à l'initiation (`dialyse == true AND statine_deja_en_place == false`), rendue
//     possible par les deux nouveaux critères d'entrée décidés par le référent (F-statine §9.1). La
//     poursuite chez un patient déjà traité reste offerte — ce que l'alerte disait en prose sans pouvoir
//     l'exprimer. Retiré de la liste ci-dessous : le nœud passe l'invariant pour de vrai ;
//   - `insuline` : alerte `over_basalisation == true` (« ne pas poursuivre la titration de la basale »,
//     L312) — aucune des `exclusions` de « Titrer la basale » (TBR/TBR_severe/CV_glycemique/
//     profil_glycemique, L209-213) ne porte sur `over_basalisation` (Paire 1/2) ;
//   - `prescription` : plusieurs alertes prohibitives (fragilité+incrétine, intolérance digestive,
//     association insuline+sulfamide/glinide, non-association gliptine+GLP‑1) citent des critères
//     (`fragilite`, `nature_intolerance`, `traitements_en_cours`) qu'aucune `exclusions` du nœud ne
//     reprend — la protection existe parfois ailleurs dans le contenu (une AUTRE option de « verdict »,
//     un `prerequis`), mais jamais comme `exclusion` sur l'option visée : hors du périmètre que cette
//     heuristique sait vérifier (voir commentaire du test I7).
// `cible-glycemique` n'a aucune alerte de nœud (0 sur 0, vacuement conforme).
const NOEUDS_AVEC_ALERTE_PROHIBITIVE_NON_COUVERTE_CONNUE = new Set<string>(['insuline', 'prescription'])

describe.each(noeuds.map((node) => [node.id, node] as const))('banc — invariants de CONTENU (D21) · nœud %s', (_id, node) => {
  const testI6 = NOEUDS_AVEC_ALERTE_DEFAULT_CONNUE.has(node.id) ? it.fails : it
  testI6('I6 — aucune alerte de nœud n\'a `quand: "default"` (D21, interdit n°2)', () => {
    const violations: string[] = []
    for (const alerte of node.alertes ?? []) {
      if (alerte.quand === 'default') {
        violations.push(
          `nœud "${node.id}" :: alerte quand="default" (s'affiche pour TOUS les patients, donc pour ` +
            `personne — D21) :: message : "${tronque(alerte.message)}"`,
        )
      }
    }
    expect(violations).toEqual([])
  })

  /**
   * I7 — heuristique en deux temps, EXACTEMENT celle demandée par la mission (rien de plus) :
   *   1. le `message` de l'alerte contient-il une tournure prohibitive (« ne pas », « ne jamais »,
   *      « contre-indiqué·e », « proscrit », « arrêter », « interdit ») ?
   *   2. si oui, AU MOINS UNE option du nœud porte-t-elle une `exclusions` qui cite AU MOINS UN des
   *      critères présents dans le `quand` de cette alerte ?
   * Une alerte qui échoue au (1) est ignorée (pas de tournure prohibitive détectée : rien à vérifier).
   * Une alerte `quand: "default"` est ignorée ICI (déjà couverte par I6, et un `default` ne cite AUCUN
   * critère — rien à faire correspondre par construction, pas un cas où l'heuristique aurait quelque
   * chose à dire).
   *
   * CE QUE ÇA ATTRAPE : les deux cas cités par la mission (statine/dialyse vs « Statine de haute
   * intensité », insuline/over_basalisation vs « Titrer la basale ») sont détectés — vérifié dans les
   * deux sens : le mot-clé matche leur message, et AUCUNE exclusion du nœud entier ne cite leur critère.
   * Le test est délibérément GLOBAL AU NŒUD (pas option par option) : il vérifie qu'AU MOINS UNE option
   * protège, pas que celle affichée dans l'exemple le fait — c'est le seul niveau qu'une propriété de
   * CONTENU pur (sans évaluer le moteur sur un profil) peut établir sans deviner quelle carte serait
   * réellement affichée à quel patient.
   *
   * CE QUE ÇA LAISSE PASSER (faux négatifs assumés, cf. mission : « elle peut manquer un cas, elle ne
   * doit pas produire de faux positif bruyant ») :
   *   - les tournures hors de la liste fixe (« déconseiller », « éviter » : cf. `prescription` P8/P14
   *     dans l'inventaire — non détectées ici, alors qu'elles décrivent la même famille de problème) ;
   *   - une protection qui existe dans le contenu SANS prendre la forme d'une `exclusions` DSL sur
   *     l'option visée — ex. une option de « verdict » séparée (switch/arrêt) qui corrige la situation
   *     sans jamais exclure la première option, ou un `prerequis` plutôt qu'une `exclusions` ;
   *   - dans un nœud DÉJÀ en dette (options ci-dessus), la vérification étant globale au nœud, une
   *     alerte prohibitive peut se retrouver listée comme non couverte même si son geste précis est
   *     protégé PAR AILLEURS d'une façon que l'heuristique ne sait pas lire — ce test ne prétend nommer
   *     que « telle alerte n'a AUCUNE exclusion la référençant nulle part dans le nœud », pas « telle
   *     option précise s'affiche en contradiction avec elle » (ça, seul un banc de profils évalués par
   *     le moteur peut le montrer — hors périmètre ici par contrainte).
   * Sur un nœud SANS dette (ex. `rhd`, `cible-glycemique`), le test passe réellement à vide : aucune de
   * leurs alertes prohibitives (il y en a une, par ailleurs déjà en `default` donc ignorée ici) ne
   * produit de violation — la généricité de l'invariant n'est donc pas qu'un vœu, elle est vérifiée.
   */
  const testI7 = NOEUDS_AVEC_ALERTE_PROHIBITIVE_NON_COUVERTE_CONNUE.has(node.id) ? it.fails : it
  testI7('I7 — une alerte de nœud prohibitive a une `exclusion` correspondante quelque part dans le nœud (D21)', () => {
    const violations: string[] = []
    for (const alerte of node.alertes ?? []) {
      if (alerte.quand === 'default') continue // I6 couvre déjà ce cas ; aucun critère à y lire.
      if (!estProhibitive(alerte.message)) continue

      const criteresAlerte = extraireCriteres(alerte.quand)
      if (criteresAlerte.size === 0) continue // rien à faire correspondre (forme non reconnue par le tokenizer)

      const uneOptionCouvre = node.options.some((option) => {
        const criteresExcl = criteresDesExclusions(option)
        for (const critere of criteresAlerte) if (criteresExcl.has(critere)) return true
        return false
      })
      if (!uneOptionCouvre) {
        const optionsDuNoeud = node.options.map((o) => `"${o.intitule}"`).join(', ')
        violations.push(
          `nœud "${node.id}" :: alerte quand="${alerte.quand}" (message : "${tronque(alerte.message)}") :: ` +
            `AUCUNE exclusion du nœud ne cite un des critères {${[...criteresAlerte].join(', ')}} :: ` +
            `options du nœud, aucune protégée sur ces critères : ${optionsDuNoeud}`,
        )
      }
    }
    expect(violations).toEqual([])
  })
})
