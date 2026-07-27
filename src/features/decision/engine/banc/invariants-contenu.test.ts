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
   * DETTE NOMMÉE, au plus fin — une entrée par couple (nœud, option), jamais une dispense de nœud entier
   * (même doctrine que `ALERTES_PROHIBITIVES_HORS_PERIMETRE` ci-dessus).
   *
   * CE QUE CETTE LISTE DIT VRAIMENT, et c'est une trouvaille de l'invariant lui-même : ces options
   * revendiquent un niveau de preuve `eleve` ou `modere` dont le fondement n'est PAS expérimental mais
   * RÉGLEMENTAIRE (RCP ANSM, contre-indication de société savante) ou tiré d'un accord d'experts. Aucun
   * essai de `references_primaires` ne les porte, et il aurait été facile — et malhonnête — de leur
   * accrocher l'essai le plus voisin pour faire passer le test au vert. Une citation fabriquée dans ce
   * champ créerait exactement la fausse confiance que l'invariant existe pour empêcher.
   *
   * LA VRAIE QUESTION, À TRANCHER PAR LE RÉFÉRENT : `niveau_preuve` doit-il refléter la certitude de la
   * PREUVE (auquel cas une contre-indication de RCP n'est ni `eleve` ni `modere` au sens GRADE, et ces
   * options sont mal étiquetées), ou la force de la RECOMMANDATION (auquel cas l'étiquette est juste et
   * c'est le champ `references` qui a besoin d'accueillir autre chose que des essais) ? Tant que ce n'est
   * pas tranché, chaque cas est nommé ici avec son fondement réel.
   */
  const OPTIONS_A_FONDEMENT_NON_EXPERIMENTAL = new Map<string, string>([
    [
      'prescription :: Arrêter la metformine (DFG < 30 — contre‑indication rénale)',
      'Contre-indication du RCP ANSM (risque d’acidose lactique par accumulation). Aucun ECR n’a randomisé l’arrêt de la metformine sous 30 — et aucun ne le fera.',
    ],
    [
      'prescription :: Réduire la posologie de la metformine (fonction rénale altérée ou intolérance digestive)',
      'Paliers posologiques du RCP ANSM (max 2 g/j si DFG 45-59 ; 1 g/j si 30-44). Norme réglementaire, pas résultat d’essai.',
    ],
    [
      'prescription :: Arrêter le sulfamide (DFG < 30 — contre‑indication rénale)',
      'Contre-indication CITÉE par la SFD (prise de position 2023 et 2025, Tableau I note 2 + Avis n° 12) — vérifiée en source primaire le 2026-07-27. C’est une recommandation, donc sa place est `reco_officielle`, pas `references_primaires` : le schéma n’accepte dans ce champ que des références portant un `type_critere` (dur/mixte/substitution), ce qu’un texte normatif n’a pas.',
    ],
    [
      "prescription :: Suspendre l'iSGLT2 (cétonémie confirmée — suspicion d'acidocétose euglycémique)",
      'Garde-fou de sécurité (acidocétose euglycémique), porté par les RCP et les alertes d’agence. Aucun essai ne randomise la suspension.',
    ],
    [
      'insuline :: Désintensifier / alléger le schéma',
      'Accord d’experts (ADA §13, HAS R.103, SFD Avis 5 bis). L’ECR de déprescription du sujet âgé (Grant) est versé dans le nœud `prescription`, pas ici — un futur lot pourrait l’y ajouter et lever cette entrée.',
    ],
  ])

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
