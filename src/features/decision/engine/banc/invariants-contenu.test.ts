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
import { fragmentsDuNoeud } from '../expressionsNoeud.ts'
import type { CritereEntree, Option } from '../../content/node.types.ts'

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

/**
 * Critères cités par les GARDE-FOUS d'une option — les deux canaux qui RETIRENT réellement une option :
 * `exclusions` (D13) et `prerequis` (R6). Les deux sont évalués à l'identique par le moteur (« une option
 * est applicable si TOUTES ses `conditions` ET TOUS ses `prerequis` sont vrais », cf. docstring de
 * `Option.prerequis`) ; une option retirée par un `prerequis` faux est « non retenue » exactement comme
 * une option exclue. `prerequis` a été AJOUTÉ ici le 2026-07-26 (résorption de dette I7) : ne lire que
 * `exclusions` créait un angle mort — une protection écrite en `prerequis`, parfaitement légitime, était
 * comptée comme absente. `conditions` reste volontairement HORS de ce calcul : une condition dit pourquoi
 * une option est PROPOSÉE, elle n'en retire aucune — l'y inclure ferait passer l'invariant pour n'importe
 * quel critère simplement mentionné quelque part, ce qui le viderait de son sens.
 */
function criteresDesGardeFous(option: Option): Set<string> {
  const variables = new Set<string>()
  for (const expr of [...(option.exclusions ?? []), ...(option.prerequis ?? [])]) {
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
  /interdit/i,
]

// `/arrêt/i` FIGURAIT ICI et en a été RETIRÉ le 2026-07-26 (résorption de dette I7) : c'était une erreur
// de CATÉGORIE, pas un réglage trop large. « Arrêter le sulfamide », « la gliptine doit être ARRÊTÉE »,
// « réduire la posologie ou arrêter » sont des INJONCTIONS À AGIR sur le traitement en cours — l'inverse
// d'une interdiction d'un geste que le nœud propose. R3 (`docs/decision/GRAMMAIRE-NOEUD.md`, « deux
// décisions pour modifier un traitement ») exige justement que l'arrêt d'un traitement soit une OPTION
// à part entière (« Arrêter le sulfamide (DFG < 30) », « Arrêter la gliptine redondante »…) et JAMAIS une
// `exclusions` : réclamer une exclusion pour ces alertes revenait à exiger du contenu l'exact contraire de
// ce que la grammaire lui impose. Les 6 « violations » que ce radical produisait sur `insuline` et
// `prescription` étaient toutes de cette forme, et étaient la seule raison de leur mise en dette.
// Vérifié : les DEUX cas qui ont motivé l'invariant restent détectés sans lui — `statine`/`dialyse`
// (« CONTRE‑INDIQUÉE ») et `insuline`/`over_basalisation` (« ne pas poursuivre la titration ») matchent
// des tournures conservées. Le pouvoir de détection est donc intact ; seul le faux positif disparaît.

function estProhibitive(message: string): boolean {
  return TOURNURES_PROHIBITIVES.some((re) => re.test(message))
}

// ---------------------------------------------------------------------------------------------------
// I6 — DETTE ENTIÈREMENT RÉSORBÉE le 2026-07-26. La liste est vide, et l'invariant s'applique désormais
// SANS AUCUNE exception : tout `quand: "default"` sur une alerte de nœud fait échouer le banc.
//
// Les trois cas historiques (`rhd`, `insuline`, `statine`) n'ont pas été corrigés en réécrivant leurs
// messages mais en leur donnant le CANAL qui leur manquait — `Noeud.cadrage` (DECISIONS.md D24) :
//   - `rhd` : disparu avec le nœud lui-même, remplacé par le module à deux nœuds (commit 3f7a2d1) ;
//   - `insuline` (« pas de bénéfice CV démontré, ORIGIN neutre ») et `statine` (« la décision se grade
//     sur le risque absolu, pas sur une cible LDL ») : DÉPLACÉS tels quels dans `cadrage`, texte
//     inchangé. Le diagnostic qui a débloqué la dette est là : ces deux énoncés n'étaient pas de
//     mauvaises alertes, ils n'étaient pas des alertes du tout — ils portent sur l'état des preuves du
//     nœud, pas sur la situation d'un patient, donc rien ne pouvait les rendre conditionnels. Tant que
//     `alertes` était le seul canal disponible, la dette était insoluble par construction.
// Cette liste ne doit se repeupler que si un nouveau `quand: "default"` apparaît — auquel cas la vraie
// question sera « alerte mal écrite, ou cadrage qui s'ignore ? », pas « comment faire taire le test ».
const NOEUDS_AVEC_ALERTE_DEFAULT_CONNUE = new Set<string>([])

// ---------------------------------------------------------------------------------------------------
// I7 — exceptions NOMMÉES À L'ALERTE PRÈS (et non plus dispenses de nœud entier).
//
// HISTORIQUE — cette constante remplace `NOEUDS_AVEC_ALERTE_PROHIBITIVE_NON_COUVERTE_CONNUE`, un
// `Set<string>` d'ids de nœud (`insuline`, `prescription`) qui basculait le test entier en `it.fails`
// pour ces deux nœuds. Défaut de ce mécanisme, et vraie raison de le remplacer : il rendait INVISIBLE
// toute NOUVELLE alerte prohibitive non couverte sur un nœud déjà listé — la dette dispensait le nœud,
// pas le cas diagnostiqué. Une dette qui ne rétrécit jamais et qui masque ses propres successeurs
// devient du papier peint.
//
// Après le retrait de `/arrêt/i` (erreur de catégorie, cf. ci-dessus) et l'ajout de `prerequis` comme
// canal de protection reconnu, il ne reste qu'UNE alerte réellement non couverte, sur les 6 d'origine :
// `prescription` passe désormais l'invariant en entier (ses 4 « violations » étaient toutes des
// injonctions d'arrêt), et `insuline` n'en conserve qu'une seule, ci-dessous.
//
// Clé = `${node.id} :: ${alerte.quand}` — volontairement le `quand` et non le `message` : le `quand` est
// la partie STABLE d'une alerte (une reformulation éditoriale du message ne doit pas faire expirer
// l'exception en silence, alors qu'un changement de déclencheur, lui, doit la faire réexaminer).
const ALERTES_PROHIBITIVES_HORS_PERIMETRE = new Map<string, string>([
  [
    'insuline :: DFG < 45',
    "Prohibition CROISÉE, portant sur un geste d'un AUTRE nœud : le message rappelle que le sulfamide est " +
      '« contre-indiqué si DFG < 30 » et renvoie explicitement au nœud `prescription` (« cf. nœud ' +
      'prescription, place résiduelle SU/gliptine »). Le nœud `insuline` ne propose AUCUNE option de ' +
      "sulfamide — il ne peut donc pas l'exclure : exiger ici un garde-fou local demanderait au contenu " +
      "quelque chose d'impossible. La protection existe réellement, au bon endroit — l'option « Arrêter le " +
      'sulfamide (DFG < 30 — contre‑indication rénale) » du nœud `prescription` — et I7, invariant ' +
      "STRICTEMENT local au nœud par construction, ne peut pas la voir. Exception de PÉRIMÈTRE, pas de dette : " +
      "il n'y a rien à corriger dans le contenu. Le reste du message (besoins en insuline réduits, " +
      "hypoglycémie majorée) relève bien de ce nœud-ci et n'est pas prohibitif.",
  ],
])

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
   *   - une protection qui existe dans le contenu SANS prendre la forme d'un garde-fou DSL sur l'option
   *     visée — ex. une option de « verdict » séparée (switch/arrêt) qui corrige la situation sans jamais
   *     exclure la première option. C'est le cas NORMAL, et non un défaut, pour tout ce qui touche à
   *     l'arrêt d'un traitement en cours (R3) : voir la note sur le retrait de `/arrêt/i` ci-dessus ;
   *   - une prohibition CROISÉE, portant sur un geste qui appartient à un AUTRE nœud — l'invariant est
   *     strictement local au nœud, il ne peut pas voir la protection qui existe ailleurs. Ces cas sont
   *     recensés un par un dans `ALERTES_PROHIBITIVES_HORS_PERIMETRE`, avec leur motif.
   * Ce test ne prétend nommer que « telle alerte n'a AUCUN garde-fou la référençant nulle part dans le
   * nœud », jamais « telle option précise s'affiche en contradiction avec elle » (ça, seul un banc de
   * profils évalués par le moteur peut le montrer — hors périmètre ici par contrainte).
   *
   * Depuis le 2026-07-26 le test s'exécute RÉELLEMENT sur tous les nœuds (plus aucun `it.fails`) : il
   * passe à vide là où il n'y a rien à dire, et toute nouvelle alerte prohibitive non couverte le fera
   * échouer, y compris sur les deux nœuds qui étaient auparavant dispensés en bloc.
   */
  it('I7 — une alerte de nœud prohibitive a un garde-fou correspondant quelque part dans le nœud (D21)', () => {
    const violations: string[] = []
    for (const alerte of node.alertes ?? []) {
      if (alerte.quand === 'default') continue // I6 couvre déjà ce cas ; aucun critère à y lire.
      if (!estProhibitive(alerte.message)) continue
      if (ALERTES_PROHIBITIVES_HORS_PERIMETRE.has(`${node.id} :: ${alerte.quand}`)) continue

      const criteresAlerte = extraireCriteres(alerte.quand)
      if (criteresAlerte.size === 0) continue // rien à faire correspondre (forme non reconnue par le tokenizer)

      const uneOptionCouvre = node.options.some((option) => {
        const criteresGardeFous = criteresDesGardeFous(option)
        for (const critere of criteresAlerte) if (criteresGardeFous.has(critere)) return true
        return false
      })
      if (!uneOptionCouvre) {
        const optionsDuNoeud = node.options.map((o) => `"${o.intitule}"`).join(', ')
        violations.push(
          `nœud "${node.id}" :: alerte quand="${alerte.quand}" (message : "${tronque(alerte.message)}") :: ` +
            `AUCUN garde-fou (exclusions/prerequis) du nœud ne cite un des critères ` +
            `{${[...criteresAlerte].join(', ')}} :: options du nœud, aucune protégée sur ces critères : ` +
            optionsDuNoeud,
        )
      }
    }
    expect(violations).toEqual([])
  })
})

// =====================================================================================================
// I10 — UN CRITÈRE À PORTÉE CONDITIONNELLE RÉPÈTE SON GARDE DANS CHAQUE TERME QUI LE LIT.
//
// LA RÈGLE EXISTAIT DÉJÀ, ÉCRITE, JAMAIS OUTILLÉE. `docs/decision/GRAMMAIRE-NOEUD.md`, R8, dernier
// paragraphe : « un critère dont la portée est conditionnelle doit répéter cette condition dans chaque
// expression qui le lit ». Elle avait été formulée pour un cas de sécurité (`CK_sup_5N`) ; rien ne la
// vérifiait, et le même mécanisme a reproduit le défaut ailleurs.
//
// LE DÉFAUT QU'ELLE ATTRAPE (recette référent 2026-07-27, défaut G). `nature_intolerance` porte
// `visible_si: "intolerance_traitement == true"` — champ masqué tant qu'aucune intolérance n'est
// déclarée. Une condition de `prescription` le lisait SANS répéter le garde :
//     "… OR nature_intolerance == digestive"
// Champ masqué ⇒ jamais `touched` ⇒ INDÉTERMINÉ (D20) ⇒ `false OR false OR indéterminé = indéterminé`
// ⇒ l'option part « en attente » en réclamant un champ que l'écran n'affiche pas. Le praticien voit
// « Réduire la posologie de la metformine — à renseigner : Nature de l'intolérance » sans avoir nulle
// part où répondre.
//
// GRAIN DE LA VÉRIFICATION — calibré sur le contenu réel, après une première version trop grossière.
//
// (1) Par TERME `OR`, pas par expression entière. La grammaire n'a pas de parenthèses et `AND` lie plus
//     fort que `OR` : une expression est une disjonction de conjonctions. Un garde présent dans un AUTRE
//     terme ne protège rien —
//         "intolerance_traitement == true AND X   OR   nature_intolerance == digestive"
//     laisse le second terme entièrement découvert. Vérifier globalement laisserait passer exactement la
//     forme qu'on cherche.
//
// (2) MAIS le garde peut légitimement vivre dans une AUTRE expression de la même option. La première
//     rédaction l'ignorait et sortait 16 violations sur `insuline`, toutes fausses : les critères du
//     bloc MCG (`TBR`, `CV_glycemique`, `profil_glycemique`…) sont masqués par
//     `situation_insuline != naif`, et les options qui les lisent portent ce garde dans une entrée
//     `conditions` VOISINE. Or les entrées de `conditions` se combinent en ET, et le moteur
//     (`classerOption`) n'évalue les `exclusions` qu'APRÈS avoir établi conditions+prerequis vrais : le
//     garde est donc bien en vigueur au moment où l'expression est lue.
//     Sont retenues comme protectrices les expressions voisines SANS `OR` — une voisine disjonctive ne
//     garantit rien non plus (« A OR situation_insuline != naif » n'assure pas le garde).
//
// CE QUI EST EXIGÉ, ET CE QUI NE L'EST PAS : que le garde soit MENTIONNÉ, pas que la condition soit
// logiquement impliquée (indécidable ici sans moteur de preuve). Une mention peut donc être incorrecte
// tout en passant — mais l'ABSENCE de mention, elle, est toujours un défaut, et c'est la forme sous
// laquelle il s'est présenté.
// =====================================================================================================

/** Termes `OR` d'une expression DSL (la grammaire n'a pas de parenthèses ; `AND` lie plus fort). */
function termesOr(expression: string): string[] {
  return expression.split(/\s+OR\s+/)
}

/** Le terme cite-t-il ce critère (mot entier) ? */
function citeLeCritere(terme: string, nom: string): boolean {
  return new RegExp(`\\b${nom}\\b`).test(terme)
}

describe('I10 — le garde d’un critère à `visible_si` est répété dans chaque terme qui le lit (R8)', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))('nœud %s', (_id, node) => {
    const gardes = new Map<string, Set<string>>()
    for (const critere of node.criteres_entree) {
      if (!critere.visible_si) continue
      // (3) SEULS les critères dont le masquage produit réellement une INDÉTERMINATION sont concernés —
      // même règle que `engine/deriveCritere.ts` `critereEstDetermine` (D20/SPEC §2.2) : `nombre` et
      // `enum` sont indéterminés dès qu'ils ne sont pas saisis ; `bool` et `liste` gardent leur défaut
      // (« non », « aucun »), QUI EST UNE RÉPONSE, sauf `confirmation_requise`.
      //
      // Sans ce filtre, l'invariant réclamait un garde autour de chaque lecture de
      // `traitements_en_cours` (`liste`, masquée à l'initiation) dans `prescription` — 9 faux positifs.
      // Masquée, cette liste vaut `[]` : déterminée, aucune option ne part en attente. Le mécanisme que
      // R8 décrit ne s'y applique tout simplement pas.
      //
      // ⚠ CE FILTRE EST DYNAMIQUE, et c'est voulu : le jour où l'arbitrage C posera
      // `confirmation_requise: true` sur `profil_glycemique` (`liste` de `insuline`), ce critère entrera
      // dans le périmètre et l'invariant réclamera ses gardes. C'est exactement le service attendu —
      // rendre visible ce que la décision d'hier ne pouvait pas prévoir.
      const indeterminable =
        critere.type === 'nombre' || critere.type === 'enum' || critere.confirmation_requise === true
      if (!indeterminable) continue
      gardes.set(critere.nom, extraireCriteres(critere.visible_si))
    }
    if (gardes.size === 0) return // aucun critère à portée conditionnelle : rien à vérifier

    /**
     * Critères tenus pour ACQUIS au moment où une expression de cette option est lue : ceux que ses
     * `conditions`/`prerequis` voisines CONTRAIGNENT quelle que soit la branche empruntée (cf. point (2)
     * ci-dessus). Vide pour une alerte de nœud ou un `derive`, qui n'ont aucune voisine en vigueur.
     *
     * Une voisine DISJONCTIVE compte, à une condition : que CHACUN de ses termes `OR` cite le critère.
     * `situation_insuline == basale_seule OR situation_insuline == basale_plus_bolus` contraint bien
     * `situation_insuline` — quelle que soit la branche vraie, le critère est fixé. C'est la forme
     * dominante du contenu `insuline` (une option qui vaut pour deux situations sur quatre), et l'exiger
     * non disjonctive produisait 16 faux positifs sur ce seul nœud.
     */
    const acquisParOption = new Map<number, Set<string>>()
    node.options.forEach((option, i) => {
      const acquis = new Set<string>()
      for (const expression of [...option.conditions, ...(option.prerequis ?? [])]) {
        const termes = termesOr(expression)
        const parTerme = termes.map((t) => extraireCriteres(t))
        // Intersection : seuls les critères cités par TOUS les termes sont réellement contraints.
        for (const nom of parTerme[0] ?? []) {
          if (parTerme.every((critères) => critères.has(nom))) acquis.add(nom)
        }
      }
      acquisParOption.set(i, acquis)
    })

    const violations: string[] = []
    for (const fragment of fragmentsDuNoeud(node)) {
      // `affichage` exclu : un `visible_si` qui en lit un autre est une cascade de visibilité, pas une
      // lecture par le moteur de décision. `arithmetique` exclu : un `calculs` ne décide de rien — au
      // pire il ne s'affiche pas (défaut J, traité à l'écran).
      if (fragment.nature !== 'decision') continue
      const indexOption = fragment.chemin.startsWith('options[')
        ? Number(fragment.chemin.slice('options['.length, fragment.chemin.indexOf(']')))
        : undefined
      const acquis = indexOption === undefined ? new Set<string>() : (acquisParOption.get(indexOption) ?? new Set())

      for (const terme of termesOr(fragment.expression)) {
        for (const [nom, criteresDuGarde] of gardes) {
          if (!citeLeCritere(terme, nom)) continue
          if (criteresDuGarde.size === 0) continue // garde non tokenisable : rien à faire correspondre
          const protege = [...criteresDuGarde].some((g) => citeLeCritere(terme, g) || acquis.has(g))
          if (!protege) {
            violations.push(
              `nœud "${node.id}" :: ${fragment.chemin} :: le terme « ${terme.trim()} » lit ` +
                `"${nom}" (masqué par \`visible_si\`) sans que son garde {${[...criteresDuGarde].join(', ')}} ` +
                `soit répété dans le terme NI acquis par une condition/prérequis non disjonctive de ` +
                `l'option — champ masqué ⇒ indéterminé ⇒ option « en attente » sur un champ que l'écran ` +
                `n'affiche pas (R8).`,
            )
          }
        }
      }
    }
    expect(violations).toEqual([])
  })
})

// =====================================================================================================
// I9 — UNE ALERTE NE PEUT PAS ANNONCER UN SEUIL AUTRE QUE CELUI QUI LA DÉCLENCHE.
//
// POURQUOI CET INVARIANT EXISTE. Le 2026-07-27, la passe adversariale `statine` a relevé qu'une alerte
// dont le déclencheur était `CK_x_normale > 4` annonçait dans son texte « au-delà de 5 fois la normale ».
// Deux vignettes exécutables assertaient de surcroît sur la chaîne « 5 fois la normale » : le texte faux
// était VERROUILLÉ par des tests, et un correctif du seuil les aurait fait échouer sans que personne
// comprenne pourquoi.
//
// C'est la forme la plus dangereuse du défaut de duplication, parce qu'elle se lit comme une prose
// anodine : le praticien lit un seuil, le moteur en applique un autre, et les deux sont dans le même
// bloc de six lignes.
//
// PÉRIMÈTRE, ET COMMENT IL A ÉTÉ FIXÉ — par la mesure, pas au jugé. La première rédaction examinait
// tout nombre introduit par une tournure comparative (« au-delà de », « supérieur à », « > », « en
// dessous de »). Exécutée sur le contenu réel : **12 violations, dont 1 seule vraie**. Les onze autres
// étaient des messages qui citent LÉGITIMEMENT un seuil qui n'est pas le leur — une posologie
// (« initiation ≤ 500 mg » sous un déclencheur en DFG), une cible de MCG (« TIR > 70 % » sous un
// déclencheur sans nombre), un seuil voisin d'un autre critère (« iSGLT2 initiable jusqu'à DFG ≥ 20 »
// sous `DFG < 30`), un pourcentage de risque SCORE2, une cétonémie en mmol/L. Un test à 92 % de faux
// positifs n'aurait pas protégé le contenu : il aurait appris à ignorer le rouge — le défaut nommé dans
// ce fichier même à propos des budgets de temps.
//
// La cause de ces faux positifs est identifiable : **rien ne dit à quelle GRANDEUR se rapporte un
// nombre du message.** « 500 » et « 30 » ont la même forme ; seul le lecteur sait que l'un est des
// milligrammes et l'autre un DFG. Tant qu'un critère ne déclare pas son unité, aucun test ne peut faire
// cette distinction.
//
// D'où le périmètre retenu : les tournures dont l'unité est **portée par la tournure elle-même** —
// « N fois la normale », « N fois la limite supérieure ». Elles ne peuvent désigner qu'un critère
// exprimé en multiples de la normale, donc le critère du déclencheur. Zéro faux positif mesuré, et le
// défaut qui a motivé l'invariant est attrapé.
//
// FAUX NÉGATIFS ASSUMÉS, et ils sont larges : tout écart annoncé dans une autre unité passe au travers.
// La forme générale demande une déclaration d'unité sur les critères `nombre` (candidate pour un lot
// ultérieur) ; l'écrire au jugé sans cette déclaration produirait le test à 92 % de bruit mesuré
// ci-dessus. Comme pour I7 : mieux vaut manquer un cas que dévaluer le rouge.
// =====================================================================================================

/**
 * Tournures qui ANNONCENT un seuil DANS L'UNITÉ DU CRITÈRE TESTÉ. Le nombre précède la tournure. Cf. le
 * commentaire ci-dessus pour les tournures écartées après mesure, et pourquoi.
 */
const ANNONCES_DE_SEUIL: RegExp[] = [
  /(\d+(?:[.,]\d+)?)\s*fois la normale/gi,
  /(\d+(?:[.,]\d+)?)\s*fois la limite/gi,
  /(\d+(?:[.,]\d+)?)\s*N\b(?!\s*[a-zà-ÿ])/g, // « 4 N », notation courte des multiples de la normale
]

/** Nombres ANNONCÉS comme seuils par un message (cf. `ANNONCES_DE_SEUIL`), virgule décimale normalisée. */
function seuilsAnnonces(message: string): number[] {
  const nombres = new Set<number>()
  for (const motif of ANNONCES_DE_SEUIL) {
    for (const match of message.matchAll(motif)) {
      const n = Number(match[1].replace(',', '.'))
      if (Number.isFinite(n)) nombres.add(n)
    }
  }
  return [...nombres]
}

/**
 * Littéraux numériques sur lesquels l'alerte se déclenche RÉELLEMENT — ceux de son `quand`, PLUS ceux
 * des expressions `derive` des critères qu'il cite.
 *
 * Le déroulement des dérivés n'est pas un raffinement : sans lui, une alerte déclenchée sur
 * `hba1c_sous_cible == true` paraîtrait n'avoir aucun seuil, alors que le 6,5 qu'elle annonce est
 * exactement celui que son dérivé encode. Même mécanique que `primitivesReferencees`
 * (`engine/evaluateNode.ts`) : un seul niveau, ce contenu ne chaîne jamais un dérivé sur un autre.
 */
function seuilsDuDeclencheur(quand: string, criteres: CritereEntree[]): number[] {
  const litteraux = (expression: string) =>
    (expression.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number).filter(Number.isFinite)
  const seuils = new Set(litteraux(quand))
  for (const critere of criteres) {
    if (!critere.derive) continue
    if (!new RegExp(`\\b${critere.nom}\\b`).test(quand)) continue
    for (const n of litteraux(critere.derive)) seuils.add(n)
  }
  return [...seuils]
}

/**
 * Écarts annoncé/déclenché CONNUS. Clé = `${node.id} :: ${quand}`, même convention que
 * `ALERTES_PROHIBITIVES_HORS_PERIMETRE` ci-dessus (le `quand` est la partie stable ; une reformulation
 * du message ne doit pas faire expirer l'exception en silence, un changement de déclencheur doit la
 * faire réexaminer).
 *
 * **AUTO-EXPIRANTE** : le test échoue aussi quand une entrée n'est PLUS justifiée, et réclame son
 * retrait. Une dette qui ne signale pas sa propre résorption devient du papier peint — le défaut nommé
 * plus haut à propos de `NOEUDS_AVEC_ALERTE_PROHIBITIVE_NON_COUVERTE_CONNUE`.
 */
const ALERTES_A_SEUIL_ANNONCE_DIFFERENT = new Map<string, string>([
  [
    // Clé mise à jour le 2026-07-27 (soir) : le `quand` a gagné son garde `intolerance_statine != non`
    // (correctif R8/I10 du même lot). L'entrée avait donc expiré d'elle-même et le banc l'a réclamée —
    // exactement l'effet recherché : un changement de déclencheur force à rouvrir l'exception.
    'statine :: intolerance_statine != non AND CK_x_normale > 4 AND statine_deja_en_place == false',
    "DÉFAUT AVÉRÉ, pas une divergence légitime — c'est le cas qui a motivé I9. Le message annonce " +
      '« 5 fois la normale » sous un déclencheur à 4. Non corrigé ICI parce que le nombre juste est ' +
      "précisément l'objet d'un arbitrage rendu le 2026-07-27 : le référent a aligné la bande basse du " +
      'nœud sur NICE NG238 (seuil 5 N avec re-dosage à 7 jours, « rassurer » sous traitement en deçà, ' +
      '« débuter à dose plus faible » entre 4 et 5 à l’initiation). Le corriger isolément — passer le ' +
      "seul déclencheur de 4 à 5 — laisserait le nœud dans un état intermédiaire incohérent, l'option " +
      "« Interrompre » se déclenchant encore à 4. À reprendre EN UN SEUL PASSAGE au lot 2 du " +
      '`PLAN-CORRECTION.md`, avec la scission de l’option « Interrompre » (2ᵉ arbitrage du même jour) et ' +
      'la réécriture des vignettes F‑15/F‑18, qui assertent aujourd’hui sur la chaîne fausse.',
  ],
])

describe('I9 — le seuil annoncé par une alerte est celui qui la déclenche (générique, tous nœuds)', () => {
  it('aucune alerte n’annonce un seuil absent de son propre déclencheur', () => {
    const violations: string[] = []
    for (const node of noeuds) {
      // Alertes de NŒUD et alertes d'OPTION : même défaut possible des deux côtés, même définition de
      // schéma (`#alerte`) — les traiter ensemble, jamais l'une sans l'autre.
      const toutes: Array<{ ou: string; alerte: { quand: string; message: string } }> = [
        ...(node.alertes ?? []).map((alerte) => ({ ou: 'alerte de nœud', alerte })),
        ...node.options.flatMap((option) =>
          (option.alertes ?? []).map((alerte) => ({ ou: `option "${option.intitule}"`, alerte })),
        ),
      ]
      for (const { ou, alerte } of toutes) {
        if (alerte.quand === 'default') continue // aucun seuil à respecter
        const declencheurs = seuilsDuDeclencheur(alerte.quand, node.criteres_entree)
        const orphelins = seuilsAnnonces(alerte.message).filter((n) => !declencheurs.includes(n))
        const cle = `${node.id} :: ${alerte.quand}`
        if (ALERTES_A_SEUIL_ANNONCE_DIFFERENT.has(cle)) {
          // Auto-expiration : une dette résorbée doit réclamer son propre retrait.
          if (orphelins.length === 0) {
            violations.push(
              `nœud "${node.id}" :: ${ou} :: quand="${alerte.quand}" n'annonce PLUS de seuil orphelin : ` +
                `retirer son entrée de ALERTES_A_SEUIL_ANNONCE_DIFFERENT (dette résorbée).`,
            )
          }
          continue
        }
        if (orphelins.length > 0) {
          violations.push(
            `nœud "${node.id}" :: ${ou} :: quand="${alerte.quand}" annonce le(s) seuil(s) ` +
              `${orphelins.join(', ')} que son déclencheur ne contient pas (seuils réels : ` +
              `${declencheurs.join(', ') || 'aucun'}) :: message : "${tronque(alerte.message)}"`,
          )
        }
      }
    }
    expect(violations).toEqual([])
  })
})

// =====================================================================================================
// I8 — UNE OPTION QUI REVENDIQUE UN NIVEAU DE PREUVE DOIT DIRE DE QUOI ELLE LE TIRE.
//
// POURQUOI CET INVARIANT EXISTE. Le 2026-07-27, le référent a posé la question : « toutes les nouvelles
// données cherchées ont-elles été intégrées dans la base consolidée ? » Elles ne l'étaient pas. Une
// vingtaine d'essais — CLEAR Outcomes, Kraut, Aebi, SAMSON, StatinWISE, GAUSS-3, le parcours NHS, la SFD
// 2025, l'Endocrine Society… — portaient des chiffres AFFICHÉS dans les options (NNT, HR, réductions
// absolues) sans jamais figurer dans `sources.references_primaires`. Une carte affichait un NNT dérivé de
// CLEAR Outcomes alors que le nœud ne citait CLEAR Outcomes nulle part.
//
// CE QUI A LAISSÉ PASSER ÇA : rien ne reliait une option à ses sources. Le banc vérifiait les exclusions,
// les alertes, les rangs, la non-vacuité — jamais l'adossement bibliographique. Le décrochage a duré deux
// jours sans être visible, et il était antérieur : la scission glinide/sulfamide du 2026-07-26 n'avait pas
// atteint la bibliographie non plus.
//
// TROIS PROPRIÉTÉS, la troisième étant celle qui mord :
//  - I8a : les `id` de références sont UNIQUES dans un nœud (sinon `references` devient ambigu) ;
//  - I8b : tout id cité par une option EXISTE dans `sources.references_primaires` du même nœud ;
//  - I8c : toute option dont le `niveau_preuve` est `modere` ou `eleve` DÉCLARE au moins une référence.
//
// PÉRIMÈTRE ASSUMÉ DE I8c : `faible` en est dispensé — un accord d'experts ou un savoir-faire
// diététique n'a, par définition, pas d'essai à citer. Ce que I8c ne vérifie PAS non plus : que la
// référence citée soit la BONNE. Aucun test ne peut le faire ; c'est le travail de la relecture clinique
// et de la passe adversariale. I8 garantit seulement qu'une revendication de preuve est ADOSSÉE, ce qui
// est la condition pour que cette relecture soit possible.
// =====================================================================================================
describe('I8 — adossement bibliographique des options (générique, tous nœuds)', () => {
  it('I8a — les ids de références sont uniques dans chaque nœud', () => {
    const violations: string[] = []
    for (const node of noeuds) {
      const vus = new Map<string, number>()
      for (const ref of node.sources?.references_primaires ?? []) {
        if (!ref.id) continue
        vus.set(ref.id, (vus.get(ref.id) ?? 0) + 1)
      }
      for (const [id, n] of vus) {
        if (n > 1) violations.push(`nœud "${node.id}" :: id de référence "${id}" déclaré ${n} fois`)
      }
    }
    expect(violations).toEqual([])
  })

  it('I8b — toute référence citée par une option existe dans la bibliographie du nœud', () => {
    const violations: string[] = []
    for (const node of noeuds) {
      const connus = new Set((node.sources?.references_primaires ?? []).map((r) => r.id).filter(Boolean))
      for (const option of node.options) {
        for (const id of option.references ?? []) {
          if (!connus.has(id)) {
            violations.push(
              `nœud "${node.id}" :: option "${option.intitule}" cite la référence "${id}", ` +
                `absente de sources.references_primaires (ids connus : ${[...connus].join(', ') || 'aucun'})`,
            )
          }
        }
      }
    }
    expect(violations).toEqual([])
  })

  /**
   * DETTE ENTIÈREMENT RÉSORBÉE le 2026-07-27, le jour même où elle a été créée — et la façon dont elle
   * s'est résorbée vaut d'être gardée.
   *
   * En posant I8c, cinq options se sont révélées revendiquer un niveau de preuve `eleve` ou `modere` dont
   * le fondement n'était pas expérimental mais RÉGLEMENTAIRE (RCP ANSM, contre-indication de société
   * savante) ou tiré d'un accord d'experts. Aucun essai ne les portait. Deux issues s'offraient : leur
   * accrocher l'essai le plus voisin — ce qui aurait fait passer le test au vert en fabriquant exactement
   * la fausse confiance que cet invariant existe pour empêcher — ou les nommer une à une en dette.
   *
   * Elles ont d'abord été nommées ici. Puis le référent a tranché la question de fond : « le niveau de
   * preuve doit refléter la CERTITUDE DE LA PREUVE, c'est l'intérêt d'un outil EBM et pas d'un listing de
   * recos officielles. » Appliquée, cette règle vide la liste : les cinq options étaient simplement MAL
   * ÉTIQUETÉES — elles confondaient la force d'une recommandation avec la certitude d'une donnée. Toutes
   * sont passées en `faible`, sans qu'aucun geste clinique ne change.
   *
   * LEÇON, plus générale que ce cas : une dette qu'aucune réécriture ne semble pouvoir lever signale
   * souvent une question de fond non tranchée, pas un invariant trop strict. Ici, l'invariant avait
   * raison ; c'est le contenu qui se trompait, et il fallait une décision de principe pour le voir.
   * La liste reste déclarée, VIDE, comme `NOEUDS_AVEC_ALERTE_DEFAULT_CONNUE` pour I6 : si un cas
   * réapparaît un jour, il devra être nommé et motivé ici, jamais dispensé en bloc.
   */
  const OPTIONS_A_FONDEMENT_NON_EXPERIMENTAL = new Map<string, string>([])

  it('I8c — une option en preuve modérée ou élevée déclare au moins une référence', () => {
    const violations: string[] = []
    for (const node of noeuds) {
      for (const option of node.options) {
        const revendique = option.niveau_preuve === 'modere' || option.niveau_preuve === 'eleve'
        if (OPTIONS_A_FONDEMENT_NON_EXPERIMENTAL.has(`${node.id} :: ${option.intitule}`)) continue
        if (revendique && (option.references ?? []).length === 0) {
          violations.push(
            `nœud "${node.id}" :: option "${option.intitule}" déclare niveau_preuve="${option.niveau_preuve}" ` +
              `sans aucune référence — de quoi tire-t-elle ce niveau ?`,
          )
        }
      }
    }
    expect(violations).toEqual([])
  })
})
