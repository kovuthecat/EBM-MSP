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
import { fichiersCriteresCommuns, noeuds } from '../../content/loadNodes.ts'
import { fragmentsDuNoeud } from '../expressionsNoeud.ts'
import { contraintesViolees } from '../contraintes.ts'
import { calculerCriteresDerives, determinesEffectifs } from '../deriveCritere.ts'
import { evaluateCondition } from '../conditions.ts'
import { champEstVisible, valeurParDefaut } from '../../lib/formLayout.ts'
import { genererProfils, genererProfilsBruts, tailleBanc } from './profils.ts'
import type { CritereEntree, FichierCriteresCommuns, Noeud, Option } from '../../content/node.types.ts'
import type { Criteria, CriteriaValue } from '../conditions.ts'

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

/**
 * VIOLATIONS R8 CONNUES — introduites par T-018 (P4/S1, D30, 2026-07-28), PAS des dispenses.
 *
 * D30 (amende D20) rend `bool`/`liste` indéterminés par défaut (comme `nombre`/`enum`), sauf
 * `presomption_non: true` posé mécaniquement par le contenu (audit T-018 étape 4, rapport de tâche).
 * Deux critères, auparavant hors du périmètre d'I10 (déterminés par défaut, donc jamais dans `gardes`),
 * y entrent désormais parce qu'ils N'ONT PAS reçu `presomption_non` (ils gardent une `exclusions`/
 * condition d'option `role: securite` réelle sur le nœud cité, donc l'audit les a exclus à raison) :
 *
 * - `insuline :: mcg_disponible` / `insuline :: profil_nocturne` (ex-`profil_glycemique`, renommé
 *   2026-07-30, P8/S7) — masqués par
 *   `situation_insuline != naif`. Les VIOLATIONS RÉELLES ne portent QUE sur des alertes de nœud et des
 *   `derive` (`profil_nocturne_permet_titration`/`profil_nocturne_a_cible`), jamais sur une `conditions`/
 *   `prerequis` d'option : les options qui pivotent sur ces dérivés portent, elles, un garde
 *   `situation_insuline` propre (vérifié), donc AUCUNE option ne part réellement en attente sur un champ
 *   invisible pour ces deux critères (I11, `banc/impasse.test.ts`, vert sur ce nœud) — l'impact réel est
 *   qu'une alerte peut ne pas s'afficher pour un patient naïf, ce qu'elle ne fait de toute façon jamais
 *   (le "naïf" ne prend pas encore d'insuline). Dette de FORME (I10 ne voit pas l'« acquis » d'un
 *   `derive`/d'une alerte, qui ne vit dans aucune option), pas de fond.
 * - `prescription :: traitements_en_cours` / `prescription :: intolerance_traitement` — masqués par
 *   `intention != initier`. LÀ, la violation était RÉELLE et significative : une vingtaine d'options qui
 *   portent sur un traitement déjà en cours (arrêter/réduire/remplacer…) partaient EN ATTENTE pour un
 *   patient INITIER au lieu d'être NON RETENUES — confirmé par I11 (`banc/impasse.test.ts`), qui échouait
 *   RÉELLEMENT sur ce nœud pour ce motif. CORRIGÉ le 2026-07-28 par P4/S9 (T-031) pour `intolerance_
 *   traitement` EN ENTIER et pour `traitements_en_cours` sur ses citations POSITIVES (`contient X`)
 *   uniquement — cf. docstring de `VIOLATIONS_R8_CONNUES_T018` ci-dessous pour la partie de
 *   `traitements_en_cours` qui RESTE en dette (citations NÉGATIVES `ne_contient_pas X`, sur des
 *   prérequis de non-duplication où répéter le garde en `AND` produirait une régression pire que le
 *   défaut d'origine).
 *
 * Clé = `${node.id} :: ${nom}` (le CRITÈRE masqué, pas le terme précis — le nombre de termes affectés
 * varie avec le contenu, le critère est la partie stable). AUTO-EXPIRANTE : si un jour AUCUNE violation
 * ne cite plus ce critère sur ce nœud, le test réclame le retrait de l'entrée.
 *
 * `prescription :: traitements_en_cours` — PARTIELLEMENT RÉSORBÉE le 2026-07-28 (P4/S9, T-031), REDEVENUE
 * une entrée à PÉRIMÈTRE PLUS ÉTROIT (pas retirée en entier). Le motif R8 (garde `intention != initier`
 * répété EN TÊTE de chaque terme, donc en `AND`) résout correctement toute citation POSITIVE
 * (`traitements_en_cours contient X`, sur les options qui portent sur un traitement déjà en cours) : pour
 * un patient INITIER, forcer le terme à `false` est exactement le comportement voulu (un naïf ne « contient »
 * rien). Il échoue en revanche sur les citations NÉGATIVES (`traitements_en_cours ne_contient_pas X`),
 * utilisées comme garde-fous de NON-DUPLICATION sur les options d'AJOUT (« Insuline d'initiation »,
 * « Introduire un iSGLT2 / un AR GLP‑1 / le tirzépatide », « Association iSGLT2+AR GLP‑1 », « Envisager
 * l'insuline », « Gliptine »/« Sulfamide — place résiduelle ») : un patient INITIER satisfait TRIVIALEMENT
 * « ne prend pas déjà X » (il ne prend rien), le prérequis DEVRAIT donc valoir `true` pour lui — jamais
 * `false`. Prépendre `intention != initier AND ` à ces termes-là les force à `false` pour TOUT patient
 * initier, ce qui EXCLUT ENTIÈREMENT ces options d'ajout pour un naïf — une régression, pas une
 * correction : confirmée sur `invariants.test.ts` (I2′), profils #227/#763/#1230, où plus AUCUNE option
 * n'était `applicable` alors qu'un DFG effondré ou une dénutrition rendaient une insulinothérapie ou un
 * iSGLT2 cliniquement nécessaires dès l'initiation. Essayé puis REVERTÉ dans cette même session. Ce que
 * ça exigerait réellement (résoudre `ne_contient_pas X` à `true`, pas `false`, pour un patient initier)
 * dépasse la répétition mécanique d'un garde : soit revenir sur l'exclusion de `traitements_en_cours` de
 * `presomption_non` sur ce nœud (décision de T-018, motivée par de vraies `exclusions`/options `role:
 * securite`, qu'aucune règle mécanique ne permet de trancher seule), soit une évolution du moteur/DSL
 * pour un garde de polarité inverse. Hors périmètre mécanique de S9 (aucune nouvelle logique clinique,
 * aucun moteur) — laissé en dette, à revoir avec le référent : cf. rapport de tâche T-031.
 */
const VIOLATIONS_R8_CONNUES_T018 = new Map<string, string>([
  [
    'statine :: CK_UI_L',
    'T-133 (P12/S8, 2026-08-03) : masqué par `visible_si: "intolerance_statine != non"`, lu par le ' +
      "DÉRIVÉ `CK_x_normale` (`CK_UI_L / CK_normale_sup`) SANS répéter ce garde — MÊME MÉCANISME que " +
      "`insuline :: mcg_disponible` ci-dessous (« I10 ne voit pas l'« acquis » d'un derive, qui ne vit " +
      "dans aucune option »), pas un défaut de fond : TOUTES les options qui lisent `CK_x_normale` " +
      "portent déjà, dans leur PROPRE condition, le garde `intolerance_statine != non` — vérifié, et " +
      "c'est ce que confirme I11 (`banc/impasse.test.ts`), vert sur `statine`. Un patient sans intolérance " +
      '(`intolerance_statine == non`) voit donc ces options court-circuitées à `false` sur LEUR PROPRE ' +
      "garde AVANT même que `CK_x_normale` ne soit lu — aucune option ne part réellement en attente sur un " +
      'champ invisible. Ne PAS répéter le garde À L\'INTÉRIEUR de l\'expression `derive` (qui n\'est que de ' +
      "l'arithmétique pure, `CK_UI_L / CK_normale_sup` — aucune grammaire pour y insérer un `AND` " +
      'booléen sans changer la NATURE du critère, `type: nombre`).',
  ],
  [
    'statine :: CK_normale_sup',
    'T-133 (P12/S8, 2026-08-03) : même mécanisme, même dérivé, même nœud que `statine :: CK_UI_L` ' +
      'ci-dessus — cf. son motif complet.',
  ],
  [
    'insuline :: mcg_disponible',
    "D30/T-018 (2026-07-28) : masqué par `situation_insuline != naif`, non éligible à `presomption_non` " +
      "sur ce nœud (garde une condition d'option `role: securite` réelle) — violations réelles limitées " +
      "à des alertes de nœud (aucune option, I11 vert). Cf. docstring de VIOLATIONS_R8_CONNUES_T018.",
  ],
  [
    'insuline :: profil_nocturne',
    'D30/T-018 (2026-07-28) : même mécanisme que `mcg_disponible` ci-dessus, même nœud — violations ' +
      'réelles limitées à des `derive` (aucune option, I11 vert). Clé renommée le 2026-07-30 (P8/S7) : ce ' +
      "critère s'appelait `profil_glycemique` (`liste`) avant sa scission en deux `enum` — même dette, " +
      'même critère, cf. `insuline.yaml` changelog v0.34.',
  ],
  [
    'prescription :: traitements_en_cours',
    'D30/T-018 puis P4/S9/T-031 (2026-07-28) : citations POSITIVES (`contient X`) corrigées par R8 — ' +
      'seules restent en violation les citations NÉGATIVES (`ne_contient_pas X`) des prérequis de ' +
      "non-duplication sur les options d'ajout (Insuline d'initiation, Introduire iSGLT2/AR GLP‑1/" +
      "tirzépatide, Association, Envisager l'insuline, Gliptine/Sulfamide place résiduelle). Y répéter le " +
      'garde en `AND` les exclurait à tort pour tout patient initier (régression confirmée sur I2′, cf. ' +
      'docstring ci-dessus) — hors périmètre mécanique de S9/T-031.',
  ],
])

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
      // même règle que `engine/deriveCritere.ts` `critereEstDetermine` (D30, amende D20/SPEC §2.2) :
      // DEPUIS LE 2026-07-28 (P4/S1, T-018), `nombre`/`enum`/`bool`/`liste` sont TOUS indéterminés dès
      // qu'ils ne sont pas saisis — SAUF `presomption_non: true` (ex-`confirmation_requise`, sens
      // INVERSÉ : c'est désormais l'EXCEPTION qui rend `bool`/`liste` déterminés PAR DÉFAUT, pas
      // l'inverse).
      //
      // Ce filtre reste NÉCESSAIRE (et son motif d'origine tient toujours) pour tout `bool`/`liste`
      // portant `presomption_non: true` : masqué, un tel critère vaut sa valeur par défaut (« non »,
      // `[]`) et reste DÉTERMINÉ — aucune option ne part en attente à cause de lui, R8 ne s'y applique
      // pas. Exemple actuel : `traitements_en_cours` (`liste`, masquée à l'initiation) sur `insuline`,
      // où il porte `presomption_non: true`. (Les deux nœuds RHD ne déclarent plus ce nom depuis le
      // 2026-07-29 — remplacé par le bool `insuline_ou_insulinosecreteur`, `presomption_non` conservé.)
      //
      // ⚠ SUR `prescription`, CE MÊME `traitements_en_cours` NE PORTE PAS `presomption_non` (éligibilité
      // mécanique différente : il y garde plusieurs `exclusions`/conditions `role: securite` réelles,
      // cf. `content/noeuds/diabete-type-2/prescription.yaml`) — masqué à l'initiation, il devient donc
      // désormais INDÉTERMINÉ comme n'importe quel autre critère non renseigné. C'est un changement de
      // comportement RÉEL de ce lot (pas seulement de ce test) : à documenter dans le rapport de tâche
      // T-018 comme cas (b) si un test exécutable (`evaluateNode.prescription.test.ts`, bancs) le révèle
      // — hors périmètre de CE fichier, qui ne fait qu'en tirer la conséquence pour I10.
      //
      // ⚠ CE FILTRE EST DYNAMIQUE, et c'est voulu : le jour où `presomption_non` disparaîtrait d'un
      // critère `bool`/`liste` qui le porte aujourd'hui (ex. `traitements_en_cours` sur `insuline`), il
      // ENTRERAIT dans le périmètre et l'invariant réclamerait ses gardes. Exemple VÉCU en sens inverse le
      // 2026-07-30 (P8/S7) : `profil_glycemique` (`liste`, ex-`presomption_non` INAPPLICABLE — seul
      // `hypo_interprandiale` le portait, comme critère propre) a été scindé en deux `enum`
      // (`profil_nocturne`/`profil_entre_repas`), un type que `presomption_non` ne concerne JAMAIS
      // (`critereEstDetermine`) — sans effet sur ce filtre, qui ne teste `presomption_non` que pour
      // `bool`/`liste`, mais la clé `insuline :: profil_glycemique` de `VIOLATIONS_R8_CONNUES_T018`
      // (ci-dessous) a dû être renommée `profil_nocturne` avec le critère.
      const indeterminable = critere.type === 'nombre' || critere.type === 'enum' || critere.presomption_non !== true
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
    const criteresEnViolation = new Set<string>()
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
            criteresEnViolation.add(nom)
            if (VIOLATIONS_R8_CONNUES_T018.has(`${node.id} :: ${nom}`)) continue // dette connue, cf. ci-dessus
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

    // Auto-expiration : une entrée de VIOLATIONS_R8_CONNUES_T018 qui ne correspond plus à AUCUNE
    // violation réelle sur ce nœud est une dette résorbée — à retirer, pas à oublier ici.
    for (const [cle] of VIOLATIONS_R8_CONNUES_T018) {
      if (!cle.startsWith(`${node.id} :: `)) continue
      const nom = cle.slice(`${node.id} :: `.length)
      expect(
        criteresEnViolation.has(nom),
        `"${cle}" ne correspond plus à aucune violation réelle sur "${node.id}" : dette résorbée, retirer ` +
          `l'entrée de VIOLATIONS_R8_CONNUES_T018.`,
      ).toBe(true)
    }
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


// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// I14 — LA VOIX PROPRE D'UN DRAPEAU
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

/**
 * I14 — **un drapeau booléen qui n'agit qu'à travers le `derive` d'un autre critère n'a pas de voix
 * propre** : le patient qui le déclare reçoit exactement le même écran que celui qui déclare n'importe
 * lequel de ses voisins du même dérivé.
 *
 * LE CAS RÉEL (recette navigateur du 2026-07-27, classe K8). Sur `rhd-activite-physique`, quatre
 * drapeaux de sécurité alimentent `verrou_effort` en OU. Deux ont bien leur canal propre
 * (`limitation_physique_connue` conditionne une option, `neuropathie_ou_mal_perforant_plantaire` porte
 * une alerte de nœud dédiée qui restitue ce que le verrou retire). Les deux autres —
 * `symptomes_ischemie_effort` et `retinopathie_non_stabilisee_ou_proliferante` — n'apparaissent NULLE
 * PART ailleurs que dans ce `derive`. Un patient qui déclare des symptômes d'ischémie à l'effort reçoit
 * donc le même écran qu'un patient qui déclare une simple limitation, sans qu'un mot n'évoque
 * l'exploration cardiologique avant de prescrire de l'activité physique.
 *
 * POURQUOI PAS I13. `banc/discernabilite.test.ts` mesure la discernabilité par comparaison appariée, et
 * ces deux drapeaux y sont VERTS — à juste titre : sur un profil où les trois autres sont faux, les
 * retourner change bel et bien l'écran. La propriété manquante n'est donc pas « ce drapeau agit » mais
 * « ce drapeau a une voix qui LUI est propre », et elle se lit dans le contenu seul, sans profil ni
 * tirage. Les deux invariants sont complémentaires et aucun ne remplace l'autre.
 *
 * CE QUE L'INVARIANT NE TRANCHE PAS. Qu'un drapeau doive ou non avoir sa voix propre est une décision
 * CLINIQUE. L'invariant rend la question visible et opposable, il n'y répond pas : chaque entrée de la
 * dette ci-dessous porte la question posée au référent, et le test échoue AUSSI quand une entrée devient
 * périmée — la dette ne peut pas se fossiliser.
 *
 * DÉLIBÉRÉMENT SANS MOTEUR, comme le reste de ce fichier : `fragmentsDuNoeud` visite toutes les
 * expressions du nœud avec leur `chemin`, il suffit de distinguer celles qui vivent dans un `derive` des
 * autres. Aucun tirage, donc un verdict exact et non une fréquence.
 */
const DRAPEAUX_SANS_VOIX_PROPRE_CONNUS: Record<string, Record<string, string>> = {
  // `rhd-activite-physique` A ÉTÉ RETIRÉ le 2026-08-05 (P13/S7, T-155) — DETTE RÉSORBÉE, ses deux entrées
  // avec (`symptomes_ischemie_effort`, `retinopathie_non_stabilisee_ou_proliferante`).
  //
  // CE QUI A CHANGÉ, ET POURQUOI ÇA SUFFIT. La question posée par cet invariant n'était pas « ce drapeau
  // agit-il ? » (il agissait déjà, via `verrou_effort`) mais « a-t-il une voix qui LUI est propre, lisible
  // dans le contenu sans dérive ? ». T-155 (D7 de la revue de conception du 2026-08-04, indépendant de K8)
  // a décomposé l'unique usage de `verrou_effort` — l'exclusion de « Envisager un programme d'activité
  // physique adaptée… » — en ses quatre composants cités EN CLAIR, en disjonction, à la place du dérivé
  // agrégatif. Conséquence mécanique, non recherchée mais vérifiée : les deux drapeaux qui ne vivaient
  // QUE dans le `derive` de `verrou_effort` ont désormais, eux aussi, une citation hors `derive` — la même
  // expression d'exclusion qui donne son canal aux deux autres composants. Les QUESTIONS AU RÉFÉRENT que
  // portaient ces deux entrées (une conduite PROPRE et distincte pour l'ischémie d'effort / la
  // rétinopathie, au-delà du simple retrait de la famille « pratique structurée ») restent OUVERTES — ce
  // correctif ne les tranche pas, il répare seulement l'asymétrie de canal qu'I14 mesure. Si le référent
  // veut une conduite distincte pour l'un ou l'autre, c'est un chantier de contenu séparé (et, pour la
  // rétinopathie, T-154/P13/S7 a cherché une source pour cette conduite précise et n'en a trouvé aucune
  // dans ce nœud — cf. bilan P13/S7).
  //
  // `rhd-alimentation` A ÉTÉ RETIRÉ le 2026-07-27 — DETTE RÉSORBÉE, ses trois entrées avec.
  //
  // La question posée par cet invariant était : « les trois signes de trouble du comportement alimentaire
  // sont cliniquement distincts, mais produisent le même écran — faut-il les distinguer ? » Le référent a
  // répondu dans l'autre sens : ne pas les distinguer, les FUSIONNER. « Il me semblait qu'on utilisait
  // plus les signes de TCA puisqu'on proposait uniquement des recommandations et pas de restriction. »
  // C'est une question de repérage, pas trois, et le dérivé `verrou_tca` qui n'en faisait que la
  // disjonction disparaît avec elles.
  //
  // CE QUE L'INVARIANT A RÉELLEMENT ATTRAPÉ, avec le recul : non pas « trois signaux confondus » mais
  // « trois cases pour une seule information ». La distinction utile n'était pas dans la DÉCISION (rien
  // ne lisait un signe en particulier) mais dans les LIBELLÉS, qui portaient le contenu de l'encadré 11
  // de la HAS. C'est ce contenu qu'il fallait sauver — d'où le champ `aide` ajouté au schéma le même jour,
  // et non un troisième canal d'alerte.
  //
  // `insuline.fragilite` A ÉTÉ RETIRÉ le 2026-08-07 (P14/S17, arbitrage 2 de S14, docs/decision/
  // validation/criteres-communs-2026-08-06.md §6) — DETTE RÉSORBÉE.
  //
  // C'est EXACTEMENT la question que cette entrée posait au référent qui a été tranchée : « passons en
  // sécurité partout » (décision référent en conversation, 2026-08-07). Une alerte de nœud
  // `quand: "fragilite == true"`, `niveau: attention`, a été ajoutée à `insuline.yaml` (sur le modèle de
  // l'alerte `hypo_severe_recurrente` voisine) — `fragilite` est désormais citée hors `derive`, elle a sa
  // voix propre. Même décision appliquée à `cible-glycemique` (qui n'apparaissait pas dans cette dette :
  // `fragilite` y était déjà citée directement dans les `conditions` des options, pas seulement via un
  // `derive` — I14 ne l'avait donc jamais signalée sur ce nœud).
}

describe('I14 — un drapeau qui n’agit qu’à travers un `derive` n’a pas de voix propre', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))('nœud %s', (id, node) => {
    const connus = DRAPEAUX_SANS_VOIX_PROPRE_CONNUS[id] ?? {}
    const fragments = fragmentsDuNoeud(node)
    const sansVoix: string[] = []

    for (const critere of node.criteres_entree) {
      if (critere.type !== 'bool' || critere.derive != null) continue
      const cite = new RegExp(`\\b${critere.nom}\\b`)
      const citations = fragments.filter((fragment) => cite.test(fragment.expression))
      // Jamais cité du tout : c'est un critère MORT, et c'est R5 (`couverture.test.ts`) qui le dit —
      // pas cet invariant-ci, qui parlerait alors d'un défaut qu'un autre test nomme déjà mieux.
      if (citations.length === 0) continue
      if (citations.every((fragment) => fragment.chemin.includes('derive'))) sansVoix.push(critere.nom)
    }

    expect(sansVoix.filter((nom) => connus[nom] == null)).toEqual([])
    expect(Object.keys(connus).filter((nom) => !sansVoix.includes(nom))).toEqual([])
  })
})


// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// I15 — MÉCANISER R9 : « SAVOIR SI LE GESTE EST DÉJÀ FAIT »
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

/**
 * I15 — **une option qui propose de POURSUIVRE quelque chose doit déclarer un `prerequis`.**
 *
 * LE CAS RÉEL (recette navigateur du 2026-07-27, classe K1). Sur `Traiter : initier, optimiser,
 * intensifier`, avec l'intention « Initier » — donc AUCUN traitement en cours, et le champ
 * « Traitements en cours » masqué par cette intention même — la carte « Poursuivre le traitement en
 * cours et réévaluer » sort avec le badge « Recommandée », et son argumentaire affirme « objectif
 * atteint sans agent iatrogène à optimiser » alors que « Au-dessus de l'objectif » vient d'être saisi.
 * Le nœud propose de poursuivre un traitement qui n'existe pas.
 *
 * POURQUOI AUCUN TEST NE LE VOYAIT. `couverture.test.ts` exige que chaque règle se DÉCLENCHE : ici elle
 * se déclenche, c'est un succès. L'invariant 1 de `invariants.test.ts` ne contrôle que les `exclusions`.
 * Rien n'interdisait à une option de repli de s'appliquer quand son présupposé est faux — R9
 * (`GRAMMAIRE-NOEUD.md`, « savoir si le geste est déjà fait ») existait en toutes lettres, mais
 * uniquement comme consigne de rédaction.
 *
 * LA MÊME CLASSE, DEUX NŒUDS. Le comptage du module `insuline` (`comptage-module-insuline.md`) avait
 * déjà relevé que son repli « Poursuivre le schéma d'insuline en cours » ne nomme AUCUNE situation et
 * vaut donc aussi pour le patient naïf d'insuline. C'est le même défaut, trouvé par une autre voie : ce
 * n'est pas une bizarrerie de `prescription`, c'est R9 qui n'est pas mécanisé.
 *
 * FORME, PAS SÉMANTIQUE. L'invariant ne juge pas le CONTENU du prérequis — il ne saurait pas le faire.
 * Il exige seulement qu'une option dont l'intitulé annonce une continuation en déclare un, c'est-à-dire
 * qu'un auteur se soit posé la question « à quelle condition ce geste a-t-il un objet ? ». Le champ
 * existe déjà (R6), et `couverture.test.ts` vérifie même que chaque `prerequis` mord sur au moins un
 * profil : la mécanique est entièrement en place, il ne manquait que l'obligation.
 *
 * Aucun id de nœud dans la LOGIQUE (CLAUDE.md invariant 5) — seule la dette en nomme, comme partout
 * ailleurs dans ce fichier.
 */
const VERBES_DE_CONTINUATION = ['poursuivre', 'maintenir', 'continuer', 'reconduire']

/**
 * Verbes d'INSTAURATION. Une option qui annonce les deux (« Metformine — instaurer ou poursuivre »)
 * n'a aucun présupposé à garder : elle vaut que le geste soit déjà fait ou non, et c'est justement ce
 * que son intitulé dit.
 */
const VERBES_D_INSTAURATION = ['instaurer', 'initier', 'introduire', 'debuter', 'commencer', 'ajouter']

/** Sans accents ni casse : « Poursuivre », « poursuivre », « POURSUIVRE » se valent. */
function normalise(texte: string): string {
  return texte.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * CALIBRATION — troisième invariant du dépôt à passer par une réduction de portée après confrontation
 * au contenu réel (après I9 et I10), et le motif est chaque fois le même : la première rédaction
 * décrivait la FORME du défaut observé, pas sa CAUSE.
 *
 * Rédaction 1 — « tout intitulé portant un verbe de continuation exige un `prerequis` » : 5 cas, dont
 * **3 faux positifs**. « Maintenir la pratique actuelle » et « Poursuivre les habitudes actuelles »
 * (`rhd-activite-physique`) portent des `conditions` qui ÉTABLISSENT déjà l'état continué
 * (`frequence_activite_structuree == deux_a_trois_fois_semaine AND …`) : leur présupposé est vérifié,
 * simplement par un autre champ que `prerequis`. Exiger un prérequis de plus n'aurait rien protégé.
 *
 * Rédaction 2, retenue — l'exigence ne porte que sur les options **de REPLI** (`conditions:
 * ["default"]`), c'est-à-dire celles qui s'appliquent SANS qu'aucune condition n'ait rien établi. C'est
 * exactement la situation du défaut K1 : un repli qui propose de poursuivre un traitement, retenu parce
 * qu'aucune autre option ne s'appliquait, sans que rien n'ait jamais vérifié qu'un traitement existe.
 *
 * Le sentinel `toujours` en est aussi exclu, mais pour une autre raison : « Metformine — instaurer ou
 * poursuivre » annonce les DEUX gestes et vaut donc dans les deux cas (cf. `VERBES_D_INSTAURATION`).
 */
/**
 * ⚠ DETTE MAINTENUE, ET LE MOTIF A CHANGÉ le 2026-07-27 (nuit).
 *
 * Le référent avait tranché les deux prérequis (`intention != initier` sur `prescription`,
 * `situation_insuline != naif` sur `insuline`). **Ils ont été posés, et immédiatement retirés** : avec
 * eux, l'invariant **I2′** (« jamais `applicable` VIDE quand tous les critères sont renseignés »)
 * échoue sur les deux nœuds. Retirer un repli, c'est retirer le filet.
 *
 * MESURÉ AVANT DE RENONCER, et c'est le résultat qui compte :
 *
 * - `prescription` — **6 profils sur 1840**, tous de la même forme : `intention == initier`, aucun
 *   traitement en cours, **DFG entre 3 et 29**. La metformine (socle) est exclue sous 30, et plus
 *   aucune autre option ne s'applique. Autrement dit : **le nœud n'a AUCUNE conduite pour un diabète
 *   nouvellement diagnostiqué en insuffisance rénale sévère.** Ce trou ne vient pas du prérequis — il
 *   préexistait, MASQUÉ par un repli absurde qui proposait de « poursuivre » un traitement inexistant.
 *   Le prérequis n'a fait que le découvrir.
 * - `insuline` — **7 profils sur 1760**, tous INCOHÉRENTS : situation « naïf » alors que
 *   `traitements_en_cours` contient déjà `insuline_basale` ou `insuline_rapide`. Le nœud porte déjà une
 *   alerte pour cette saisie contradictoire. Ce sont des artefacts du générateur, pas des patients.
 *
 * DÉCISION : ne pas livrer un écran vide. Un repli qui dit une chose fausse est moins grave qu'un écran
 * qui ne dit rien — le second est un cul-de-sac en consultation. Les prérequis attendent donc que le
 * trou soit comblé côté contenu, ce qui demande une réponse clinique : que propose-t-on à un DT2
 * nouvellement diagnostiqué avec un DFG < 30 ?
 */
const CONTINUATIONS_SANS_PREREQUIS_CONNUES: Record<string, Record<string, string>> = {
  // `prescription` A ÉTÉ RETIRÉ le 2026-07-27 — DETTE ENTIÈREMENT RÉSORBÉE, la table est vide et
  // l'invariant s'applique désormais sans exception aux six nœuds.
  //
  // Le chemin mérite d'être noté, parce qu'il contredit la façon dont la dette avait été formulée la
  // veille (« il faut une conduite pour le DT2 nouvellement diagnostiqué en insuffisance rénale sévère »,
  // au singulier). Il a fallu TROIS correctifs de natures différentes, et aucun n'aurait suffi seul :
  //   6 → 5  CONTENU — l'AR GLP‑1 n'avait aucun terme d'ouverture par le rein, alors qu'il n'a aucune
  //          exclusion rénale. Le patient à DFG 15 au-dessus de l'objectif ne recevait rien.
  //   5 → 2  BANC — trois profils déclaraient un traitement en cours sous l'intention « initier ». Le
  //          formulaire ne peut pas les produire (`visible_si`) ; le générateur, si. `Noeud.contraintes`.
  //   2 → 0  CONTENU, sur énoncé du référent — « un patient naïf sous son objectif ne nécessite pas de
  //          traitement, seulement des RHD ». La carte manquait, tout simplement.
  // Diagnostiquer « le contenu a un trou » là où deux tiers du signal venait d'un artefact d'instrument
  // aurait fait écrire des règles cliniques pour couvrir des patients qui n'existent pas.
  // `insuline` A ÉTÉ RETIRÉ le 2026-07-27 — DETTE RÉSORBÉE, et la façon dont elle l'a été mérite d'être
  // notée. Le prérequis ne pouvait pas être posé parce que 7 profils du banc perdaient leur dernière
  // option ; ces 7 profils étaient des saisies impossibles (naïf + insuline déjà cochée), c'est-à-dire des
  // artefacts d'un générateur qui tire chaque critère indépendamment. La réponse n'était donc ni « poser
  // le prérequis et accepter un écran vide » ni « renoncer au prérequis », mais **cesser d'engendrer des
  // patients qui n'existent pas** : `Noeud.contraintes` (schéma, 2026-07-27). Le prérequis se pose depuis
  // sans qu'aucun invariant ne bronche.
}

describe('I15 — une option de REPLI qui propose de CONTINUER déclare un `prerequis` (mécanise R9)', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))('nœud %s', (id, node) => {
    const connus = CONTINUATIONS_SANS_PREREQUIS_CONNUES[id] ?? {}
    const sansPrerequis: string[] = []

    for (const option of node.options) {
      // REPLI seulement : une option à conditions réelles a déjà dit quand elle s'applique.
      if (!option.conditions.includes('default')) continue
      const intitule = normalise(option.intitule)
      if (!VERBES_DE_CONTINUATION.some((verbe) => intitule.includes(verbe))) continue
      if (VERBES_D_INSTAURATION.some((verbe) => intitule.includes(verbe))) continue
      if ((option.prerequis ?? []).length === 0) sansPrerequis.push(option.intitule)
    }

    expect(sansPrerequis.filter((intitule) => connus[intitule] == null)).toEqual([])
    expect(Object.keys(connus).filter((intitule) => !sansPrerequis.includes(intitule))).toEqual([])
  })
})

/**
 * I16 — une `contrainte` déclarée est VIOLABLE, et le banc ne la viole jamais.
 *
 * Les deux moitiés répondent à deux façons opposées de se tromper, et aucune ne suffit seule.
 *
 * 1. **VIOLABLE.** Une contrainte qu'aucun profil ne peut enfreindre est morte : soit son expression est
 *    mal écrite (une garde trop large la rend vraie partout), soit elle décrit une relation qui ne
 *    pouvait de toute façon pas être fausse. Dans les deux cas elle donne l'illusion d'un garde-fou. La
 *    violabilité se mesure sur les profils BRUTS (`genererProfilsBruts`, avant filtrage) — c'est la seule
 *    façon de voir ce que le filtre retire.
 * 2. **JAMAIS VIOLÉE dans le banc.** C'est le bout utile : le contrat de `genererProfils`. Un jour où
 *    quelqu'un ajoutera un chemin de génération qui court-circuite le filtre (comme `genererProfilsBruts`
 *    le fait légitimement ici), cette moitié le dira.
 *
 * Ni nœud ni critère nommé (D8) : la table `contraintes` est lue sur le contenu.
 */
describe('I16 — toute `contrainte` est violable, et le banc filtré ne la viole jamais', () => {
  it.each(noeuds.filter((n) => (n.contraintes ?? []).length > 0).map((n) => [n.id, n] as const))(
    'nœud %s',
    (_id, node) => {
      const taille = tailleBanc(node)

      // (1) Violable — sur le tirage BRUT, celui que le filtre n'a pas encore vu.
      const bruts = genererProfilsBruts(node, taille).map((p) => calculerCriteresDerives(node.criteres_entree, p))
      const jamaisViolees = (node.contraintes ?? [])
        .filter((c) => !bruts.some((profil) => contraintesViolees(node, profil).includes(c)))
        .map((c) => `contrainte jamais violable sur ${bruts.length} profils bruts : "${c.expression}"`)
      expect(jamaisViolees).toEqual([])

      // (2) Le banc, lui, n'en viole aucune.
      const violations = genererProfils(node, taille)
        .flatMap((profil) => contraintesViolees(node, profil))
        .map((c) => c.expression)
      expect([...new Set(violations)]).toEqual([])
    },
  )
})

/**
 * I17 — le `role` déclaré (A3) et les sentinelles de `conditions` disent la MÊME chose.
 *
 * POURQUOI CET INVARIANT EST LE CŒUR D'A3, et pas un contrôle de forme. `role` existe parce que le
 * contenu n'avait aucun moyen de déclarer ce qu'une option EST : `priorite` portait trois sens à la fois,
 * et le seul indice restant était un libellé de famille en français que le moteur ne peut pas lire. Mais
 * une déclaration qui DÉRIVE en silence de la mécanique serait pire que pas de déclaration du tout : on
 * lirait `role` en croyant lire une intention, alors qu'il contredirait le comportement réel.
 *
 * Deux équivalences, vérifiées DANS LES DEUX SENS :
 *   `conditions: ["toujours"]`  ⟺  `role: socle`
 *   `conditions: ["default"]`   ⟺  `role: repli`
 *
 * Le sens « ⇐ » est le plus utile des deux : il interdit de déclarer `repli` une option qui a de vraies
 * conditions (elle s'afficherait comme un dernier recours alors qu'elle a sa propre indication), et
 * `socle` une option qui ne s'applique pas toujours.
 *
 * `securite` et `geste` ne sont PAS mécanisables : rien dans les conditions ne dit qu'un geste est un
 * geste de sécurité. C'est précisément l'information que le contenu seul détient — et la raison d'être
 * du champ. Cet invariant ne peut donc pas les vérifier, et ne prétend pas le faire.
 */
describe('I17 — `role` (A3) ne contredit jamais les sentinelles de `conditions`', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))('nœud %s', (_id, node) => {
    const violations: string[] = []
    for (const option of node.options) {
      const seule = option.conditions.length === 1 ? option.conditions[0] : undefined
      const attendu = seule === 'toujours' ? 'socle' : seule === 'default' ? 'repli' : undefined

      if (attendu != null && option.role !== attendu) {
        violations.push(`« ${option.intitule} » : conditions ["${seule}"] ⇒ role "${attendu}", déclaré "${option.role}"`)
      }
      // Sens inverse : un `role` de sentinelle sans la sentinelle correspondante.
      if (option.role === 'socle' && seule !== 'toujours') {
        violations.push(`« ${option.intitule} » : role "socle" sans conditions ["toujours"]`)
      }
      if (option.role === 'repli' && seule !== 'default') {
        violations.push(`« ${option.intitule} » : role "repli" sans conditions ["default"]`)
      }
    }
    expect(violations).toEqual([])
  })
})

/**
 * I19 — un critère `partage` (K6) est déclaré à l'IDENTIQUE partout où il apparaît.
 *
 * POURQUOI. `partage` fait circuler une valeur SAISIE d'un nœud à l'autre dans une même consultation. Si
 * deux nœuds déclarent le même nom avec deux encodages — un `nombre` ici, un `enum` là ; des bornes
 * différentes ; des valeurs d'énumération qui ne se recouvrent pas — on ferait circuler un concept sous
 * un nom commun avec deux définitions. C'est la dette I4 (« un concept, un encodage »), déjà constatée sur
 * ce dépôt entre `prescription` et `insuline`, et elle deviendrait ici un transport de données faux.
 *
 * `lib/sessionCriteres.ts` refuse déjà, à l'exécution, une valeur que le critère receveur ne peut pas
 * représenter. Mais un refus silencieux à l'exécution ne se voit pas : le praticien ressaisirait sans
 * savoir pourquoi. Cet invariant interdit la divergence EN AMONT, au moment où le contenu s'écrit — la
 * ceinture est dans le code, les bretelles sont ici.
 *
 * Aucun nom de nœud ni de critère dans la logique (D8) : tout est lu sur le contenu.
 */
describe('I19 — un critère `partage` a le même encodage sur tous les nœuds qui le déclarent', () => {
  it('aucune divergence de type, de bornes ou de valeurs', () => {
    const parNom = new Map<string, { noeud: string; critere: CritereEntree }[]>()
    for (const node of noeuds) {
      for (const critere of node.criteres_entree) {
        if (critere.partage !== true) continue
        const entrees = parNom.get(critere.nom) ?? []
        entrees.push({ noeud: node.id, critere })
        parNom.set(critere.nom, entrees)
      }
    }

    const violations: string[] = []
    for (const [nom, entrees] of parNom) {
      const [reference, ...autres] = entrees
      for (const { noeud, critere } of autres) {
        const memeValeurs =
          JSON.stringify(critere.valeurs ?? null) === JSON.stringify(reference.critere.valeurs ?? null)
        if (
          critere.type !== reference.critere.type ||
          critere.min !== reference.critere.min ||
          critere.max !== reference.critere.max ||
          !memeValeurs
        ) {
          violations.push(
            `"${nom}" déclaré différemment sur "${reference.noeud}" et "${noeud}" : ` +
              `type ${reference.critere.type}/${critere.type}, ` +
              `bornes [${reference.critere.min}, ${reference.critere.max}] vs [${critere.min}, ${critere.max}]`,
          )
        }
      }
    }
    expect(violations).toEqual([])

    // Garde-fou du garde-fou : un invariant sur un ensemble VIDE est vert pour rien. Le jour où plus
    // aucun contenu ne déclare `partage`, ce test doit le dire plutôt que de rester silencieusement vrai.
    expect(parNom.size).toBeGreaterThan(0)
  })
})

/**
 * I24 — toute clé de `Option.motifs` désigne une BRANCHE QUI EXISTE (P10/S2, T-079).
 *
 * POURQUOI CET INVARIANT EST OBLIGATOIRE, ET PAS UN CONFORT. `motifs` est une carte indexée par le TEXTE
 * EXACT d'un terme `OR` de `conditions`/`prerequis` (cf. `Option.motifs`). Une clé mal recopiée — un
 * espace en trop autour d'un opérateur, `>=` écrit `> =`, une branche renommée d'un côté seulement — ne
 * lève RIEN : le motif est simplement introuvable, et l'écran retombe sur la branche humanisée. Le
 * contenu affirmerait avoir rédigé un motif, l'écran n'en montrerait pas, et rien nulle part ne le
 * dirait. Sans cet invariant, le mécanisme est un piège — même classe de garde qu'I20 sur les libellés
 * (« jamais un identifiant affiché sans libellé rédigé »).
 *
 * VACUITÉ ASSUMÉE, ET SURVEILLÉE AUTREMENT. Au jour de T-079, aucun nœud ne déclare `motifs` (la session
 * livre le mécanisme, S3-S6 écrivent les motifs) : la première assertion est donc vraie sur un ensemble
 * vide. C'est exactement le cas où un invariant est « vert pour rien » — d'où le SECOND test, qui exerce
 * la règle sur une option fabriquée et vérifie qu'elle MORD sur une clé fausse. Il ne dépend d'aucun
 * contenu et reste donc valable avant comme après le remplissage.
 *
 * Générique (CLAUDE.md invariant 5) : aucun nom de nœud, de domaine ni de critère. Le découpage en
 * branches est celui du moteur (`engine/conditions.ts` `splitTopLevel` : le DSL n'a pas de parenthèses,
 * `AND` est prioritaire sur `OR`) — réécrit ici en une ligne, comme le tokenizer local en tête de
 * fichier, plutôt qu'importé : cet invariant porte sur le CONTENU tel qu'il est écrit, son verdict ne
 * doit pas pouvoir bouger avec le moteur.
 */
function branchesDeclarees(option: Option): Set<string> {
  const declarees = new Set<string>()
  for (const expression of [...option.conditions, ...(option.prerequis ?? [])]) {
    for (const branche of expression.split(/\s+OR\s+/)) declarees.add(branche.trim())
  }
  return declarees
}

/** Clés de `motifs` qui ne désignent aucune branche de l'option — la violation qu'I24 refuse. */
function clesDeMotifsOrphelines(option: Option): string[] {
  const declarees = branchesDeclarees(option)
  return Object.keys(option.motifs ?? {}).filter((cle) => !declarees.has(cle.trim()))
}

describe('I24 — chaque clé de `motifs` désigne une branche réellement présente dans l’option', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))(
    'nœud %s : aucune clé de `motifs` ne pointe dans le vide',
    (_id, node) => {
      const violations: string[] = []
      for (const option of node.options) {
        for (const cle of clesDeMotifsOrphelines(option)) {
          violations.push(
            `« ${option.intitule} » : la clé de \`motifs\` "${cle}" ne correspond à AUCUN terme OR de ses ` +
              `\`conditions\`/\`prerequis\`. Le motif serait ignoré en silence. Branches disponibles : ` +
              `${[...branchesDeclarees(option)].map((b) => `"${b}"`).join(' · ')}`,
          )
        }
      }
      expect(violations).toEqual([])
    },
  )

  it('mord sur une clé fabriquée fausse, et laisse passer la clé exacte (preuve que l’invariant sert)', () => {
    const option: Option = {
      intitule: 'Option synthétique I24',
      role: 'geste',
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
      conditions: ['MARQUEUR_a == 1 OR MARQUEUR_b > 0 AND MARQUEUR_b < 30'],
      prerequis: ['MARQUEUR_c ne_contient_pas x'],
    }

    // Les trois formes LÉGITIMES : une branche simple, une branche CONJONCTIVE entière (`AND` compris),
    // et une branche de `prerequis`. Espaces de bord tolérés, et rien d'autre.
    expect(
      clesDeMotifsOrphelines({
        ...option,
        motifs: {
          'MARQUEUR_a == 1': 'motif A',
          'MARQUEUR_b > 0 AND MARQUEUR_b < 30': 'motif B',
          '  MARQUEUR_c ne_contient_pas x  ': 'motif C',
        },
      }),
    ).toEqual([])

    // Les trois formes FAUSSES, et ce sont celles qu'on écrit réellement par erreur : un ATOME isolé
    // d'une conjonction, l'EXPRESSION ENTIÈRE (`OR` non découpé), et une branche qui n'existe nulle part.
    expect(
      clesDeMotifsOrphelines({
        ...option,
        motifs: {
          'MARQUEUR_b > 0': 'atome isolé d’une conjonction',
          'MARQUEUR_a == 1 OR MARQUEUR_b > 0 AND MARQUEUR_b < 30': 'expression entière',
          'MARQUEUR_z == 42': 'branche inexistante',
        },
      }).sort(),
    ).toEqual(
      [
        'MARQUEUR_b > 0',
        'MARQUEUR_a == 1 OR MARQUEUR_b > 0 AND MARQUEUR_b < 30',
        'MARQUEUR_z == 42',
      ].sort(),
    )

    // Une option sans `motifs` (100 % du contenu au jour de T-079) n'a évidemment rien à violer.
    expect(clesDeMotifsOrphelines(option)).toEqual([])
  })
})

/**
 * I26 (R11, T-138, P13/S1) — **aucune règle `preremplissage` ne pose, sur un critère dont le `visible_si`
 * est FAUX dans le même état, une valeur différente de `valeurParDefaut(critere)`.**
 *
 * POURQUOI CET INVARIANT EXISTE. `prescription.yaml` pré-remplit désormais `traitements_en_cours` à `[]`
 * quand `intention == initier` — exactement la valeur que `reinitialiserChampsMasques` (R8) impose de
 * toute façon à ce critère masqué. C'est ce qui rend le mécanisme compatible avec R1/R8 (cf. le
 * commentaire YAML du critère) : rien n'est affirmé en silence, puisque la valeur posée EST le défaut.
 * Cette tolérance NE VAUT QUE parce que la valeur posée est triviale — le jour où un contenu poserait,
 * sur un critère masqué, une valeur DIFFÉRENTE du défaut (une vraie affirmation sur un état invisible à
 * l'écran), ce raisonnement ne tiendrait plus : ce serait un état affirmé sans être observable, l'exact
 * défaut que R8 existe pour interdire. Cet invariant mécanise cette limite, pour qu'un futur contenu ne
 * puisse pas invoquer par erreur le même raisonnement de tolérance dans un cas où il ne vaut plus.
 *
 * MÉTHODE. Rejoue, sur chaque profil du banc de chaque nœud, EXACTEMENT ce que fait
 * `appliquerPreremplissage` (`lib/formLayout.ts`) : première règle dont le `quand` est vrai AU SENS
 * STRICT (mêmes fonctions, `calculerCriteresDerives`/`determinesEffectifs`/`evaluateCondition` — aucune
 * réimplémentation susceptible de diverger du moteur réel). Pour chaque règle qui matcherait, vérifie que
 * SI le critère porteur est alors MASQUÉ (`champEstVisible` faux), la valeur qu'elle poserait égale
 * `valeurParDefaut(critere)` — comparaison DE CONTENU pour les tableaux (`[]` égale `[]`), puisqu'ici on
 * juge la VALEUR déclarée par le contenu, pas l'identité d'objet qui protège `appliquerPreremplissage`
 * contre le rejeu (cf. sa docstring — un souci différent).
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5) : aucun nom de critère ni de nœud dans la logique — un futur domaine
 * obtient la protection sans modification de ce fichier.
 */
function valeurEgaleAuDefaut(valeur: string | string[], defaut: CriteriaValue): boolean {
  if (Array.isArray(valeur) || Array.isArray(defaut)) {
    return (
      Array.isArray(valeur) &&
      Array.isArray(defaut) &&
      valeur.length === defaut.length &&
      valeur.every((v) => (defaut as string[]).includes(v))
    )
  }
  return valeur === defaut
}

/** Violations d'I26 sur UN profil (complet — `renseignes` non transmis, repli « tout est renseigné »,
 * cf. `profils.ts`) : un pré-remplissage qui matche sur un critère masqué doit poser sa valeur par défaut. */
function violationsPreremplissageMasque(node: Noeud, profil: Criteria): string[] {
  const violations: string[] = []
  const derives = calculerCriteresDerives(node.criteres_entree, profil)
  const effectifs = determinesEffectifs(node.criteres_entree, derives, undefined)
  for (const critere of node.criteres_entree) {
    const regles = critere.preremplissage ?? []
    if (regles.length === 0) continue
    const regle = regles.find((r) => evaluateCondition(r.quand, derives, effectifs) === true)
    if (regle == null) continue
    if (champEstVisible(critere, derives, effectifs)) continue // visible : la propriété ne parle pas de ce cas
    const defaut = valeurParDefaut(critere)
    if (!valeurEgaleAuDefaut(regle.valeur, defaut)) {
      violations.push(
        `"${critere.nom}" masqué (visible_si faux) mais la règle "${regle.quand}" pose ` +
          `${JSON.stringify(regle.valeur)} — attendu la valeur par défaut ${JSON.stringify(defaut)}`,
      )
    }
  }
  return violations
}

describe('I26 — un pré-remplissage sur un critère masqué ne pose jamais que sa valeur par défaut (R11, T-138)', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))('nœud %s', (_id, node) => {
    // Vacuité : aucun critère à examiner sur un nœud qui ne déclare `preremplissage` nulle part.
    if (node.criteres_entree.every((c) => (c.preremplissage ?? []).length === 0)) return
    const violations = genererProfils(node, tailleBanc(node)).flatMap((profil) =>
      violationsPreremplissageMasque(node, profil),
    )
    expect([...new Set(violations)]).toEqual([])
  })

  it('mord sur une valeur non triviale posée en silence sur un champ masqué, laisse passer la valeur par défaut', () => {
    const criteresOk: CritereEntree[] = [
      { nom: 'declencheur', type: 'bool' },
      { nom: 'porte', type: 'bool' },
      {
        nom: 'champ',
        type: 'liste',
        valeurs: ['x', 'y'],
        visible_si: 'declencheur == true',
        preremplissage: [{ quand: 'porte == true', valeur: [] }],
      },
    ]
    // État synthétique : `declencheur` FAUX ⇒ « champ » masqué ; `porte` VRAI ⇒ la règle matche.
    const profil = { declencheur: false, porte: true, champ: [] }

    // Valeur par défaut posée (`[]`) : aucune violation.
    expect(violationsPreremplissageMasque({ criteres_entree: criteresOk } as Noeud, profil)).toEqual([])

    // Même situation, mais la règle pose une valeur NON TRIVIALE sur le champ masqué : mord.
    const criteresFautifs: CritereEntree[] = criteresOk.map((c) =>
      c.nom === 'champ' ? { ...c, preremplissage: [{ quand: 'porte == true', valeur: ['x'] }] } : c,
    )
    const violations = violationsPreremplissageMasque({ criteres_entree: criteresFautifs } as Noeud, profil)
    expect(violations).toHaveLength(1)
    expect(violations[0]).toContain('"champ" masqué')

    // Le même critère VISIBLE (declencheur vrai) échappe à la propriété — elle ne parle que du masqué.
    const profilVisible = { declencheur: true, porte: true, champ: [] }
    expect(violationsPreremplissageMasque({ criteres_entree: criteresFautifs } as Noeud, profilVisible)).toEqual([])
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// T-163 (P14/S2, mécanise R10) — les prérequis des options `default` couvrent le domaine du nœud
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

/**
 * POURQUOI CET INVARIANT, ET EN QUOI IL DIFFÈRE D'I22/I23 (`banc/securite-atteignable.test.ts`, R10).
 * I22/I23 mécanisent déjà R10 (« tout patient repart avec quelque chose »), mais sur des PROFILS TIRÉS
 * par le banc — ils ne peuvent donc voir qu'un trou que le générateur a effectivement échantillonné. Le
 * trou de `prescription` est STRUCTUREL : ses deux replis sont gardés par
 * `intention == initier AND cible_atteinte == true` et `intention != initier` — le cas
 * `intention == initier AND cible_atteinte == false` n'est couvert par AUCUN des deux, quel que soit le
 * nombre de profils tirés. Cet invariant-ci vérifie la COMBINATOIRE COMPLÈTE des critères cités par les
 * replis, jamais un échantillon.
 *
 * CE QUE « COUVRIR » VEUT DIRE ICI. Un nœud `multi-options` évalue TOUS ses replis (`engine/
 * evaluateNode.ts`, boucle `for (const option of defaults)`) : dès qu'AUCUNE option non-repli ne
 * s'applique, chaque repli dont le `prerequis` est vrai s'affiche. « Couvrir le domaine » signifie donc :
 * pour toute combinaison des critères cités par au moins un `prerequis` de repli, AU MOINS UN repli doit
 * avoir un `prerequis` vrai (un repli sans aucun `prerequis` couvre alors tout, trivialement).
 *
 * PÉRIMÈTRE : `nombre` (et tout type non énuméré ici, `liste` comprise) N'EST PAS énumérable en un
 * ensemble fini de valeurs pertinentes — on retombe alors sur l'exigence plus faible mais toujours
 * mécanique qu'AU MOINS un repli soit INCONDITIONNEL (`prerequis` vide ou absent), seul moyen de garantir
 * la couverture sans énumérer un continuum. `enum`/`bool` seuls se prêtent au produit croisé exact,
 * plafonné à 4096 combinaisons (au-delà, même repli sur la règle précédente — aucun contenu réel du
 * domaine n'approche ce plafond aujourd'hui).
 *
 * DÉRIVÉ CITÉ PAR UN `prerequis` DE REPLI (cf. « Si bloqué », `plans/P14/S2.md`) : traité comme n'importe
 * quel autre critère, via son PROPRE `type` déclaré (`cible_atteinte`, `type: bool`, domaine
 * `[true, false]`) — jamais déroulé vers ses primitifs (hors périmètre, cf. le plan).
 *
 * ROUGE À L'ÉCRITURE, ET C'ÉTAIT ATTENDU : `prescription` (renvoi S8/T-177) et les deux nœuds RHD, qui
 * n'avaient AUCUN repli du tout (renvoi S7/T-170). `insuline`, qui partitionne EXACTEMENT son seul critère
 * cité (`situation_insuline == naif` / `!= naif`, un `enum` à 2 branches complémentaires), est resté VERT
 * de bout en bout.
 *
 * RÉSORBÉ le 2026-08-06 (P14/S8, T-177) : le repli « Mesures hygiéno‑diététiques seules — réévaluer » de
 * `prescription` a perdu `cible_atteinte == true` de son `prerequis` (ne cite plus que
 * `intention == initier`) — ses deux replis partitionnent désormais EXACTEMENT `intention`, et
 * `cible_atteinte` disparaît de `nomsCites` (plus aucun repli ne le cite). Les deux nœuds RHD étaient
 * déjà résorbés par S7/T-170. `it.fails` → `it` : les six nœuds sont désormais VERTS.
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5) : aucun nom de critère ni de nœud dans la LOGIQUE — seul ce
 * commentaire, à titre d'exemple, en nomme.
 */
const PLAFOND_PRODUIT_T163 = 4096

/** Les options de REPLI d'un nœud (`conditions` vaut exactement `["default"]`). */
function optionsRepliDuNoeud(node: Noeud): Option[] {
  return node.options.filter((o) => o.conditions.length === 1 && o.conditions[0] === 'default')
}

/** Produit croisé de plusieurs domaines nommés — `[{nom, valeurs}]` → une `Criteria` par combinaison. */
function produitCroiseDomaines(domaines: { nom: string; valeurs: CriteriaValue[] }[]): Criteria[] {
  let combinaisons: Criteria[] = [{}]
  for (const { nom, valeurs } of domaines) {
    const suivantes: Criteria[] = []
    for (const combinaison of combinaisons) {
      for (const valeur of valeurs) suivantes.push({ ...combinaison, [nom]: valeur })
    }
    combinaisons = suivantes
  }
  return combinaisons
}

/** Un repli couvre-t-il cette combinaison (tous ses `prerequis` vrais — `[]` couvre tout, trivialement) ? */
function combinaisonCouverte(replis: Option[], combinaison: Criteria): boolean {
  return replis.some((option) =>
    (option.prerequis ?? []).every((expr) => evaluateCondition(expr, combinaison) === true),
  )
}

/** Violations R10 d'UN nœud (cf. docstring ci-dessus pour la méthode complète). */
function violationsCouvertureRepli(node: Noeud): string[] {
  const replis = optionsRepliDuNoeud(node)
  if (replis.length === 0) {
    return [
      `nœud "${node.id}" : aucune option de repli (\`conditions: ["default"]\`) — un patient dont aucune ` +
        `autre option n'est applicable repart sans conduite ni attente (R10).`,
    ]
  }

  const nomsCites = new Set<string>()
  for (const option of replis) {
    for (const expr of option.prerequis ?? []) {
      for (const nom of extraireCriteres(expr)) nomsCites.add(nom)
    }
  }
  if (nomsCites.size === 0) return [] // aucun `prerequis` cité par aucun repli : le premier les couvre tous.

  const rang = new Map(node.criteres_entree.map((c, i) => [c.nom, i]))
  const criteresCites = [...nomsCites]
    .map((nom) => node.criteres_entree.find((c) => c.nom === nom))
    .filter((c): c is CritereEntree => c != null)
    .sort((a, b) => (rang.get(a.nom) ?? 0) - (rang.get(b.nom) ?? 0))

  const inconditionnel = replis.some((o) => (o.prerequis ?? []).length === 0)
  const nonEnumerables = criteresCites.filter((c) => c.type !== 'enum' && c.type !== 'bool')
  if (nonEnumerables.length > 0) {
    if (inconditionnel) return []
    return [
      `nœud "${node.id}" : les prérequis de repli citent un critère non énumérable ` +
        `(${nonEnumerables.map((c) => `"${c.nom}" (${c.type})`).join(', ')}) — aucun repli n'est pourtant ` +
        `inconditionnel (sans \`prerequis\`) pour couvrir le reste du domaine (R10).`,
    ]
  }

  const domaines = criteresCites.map((c) => ({
    nom: c.nom,
    valeurs: (c.type === 'bool' ? [true, false] : (c.valeurs ?? [])) as CriteriaValue[],
  }))
  const taille = domaines.reduce((acc, d) => acc * d.valeurs.length, 1)
  if (taille > PLAFOND_PRODUIT_T163) {
    if (inconditionnel) return []
    return [
      `nœud "${node.id}" : produit croisé des prérequis de repli trop grand (${taille} > ` +
        `${PLAFOND_PRODUIT_T163}) — aucun repli inconditionnel pour couvrir le reste du domaine (R10).`,
    ]
  }

  const violations: string[] = []
  for (const combinaison of produitCroiseDomaines(domaines)) {
    if (combinaisonCouverte(replis, combinaison)) continue
    const description = criteresCites.map((c) => `${c.nom}=${combinaison[c.nom]}`).join(', ')
    violations.push(`nœud "${node.id}" : combinaison non couverte par aucun repli — ${description} (R10).`)
  }
  return violations
}

describe('T-163 (P14/S2, mécanise R10) — les prérequis des options `default` couvrent le domaine du nœud', () => {
  // VERT depuis le 2026-08-06 (P14/S8, T-177) : `prescription` et les deux nœuds RHD (S7/T-170) sont
  // désormais couverts, cf. docstring ci-dessus. `it.fails` → `it`.
  it(
    'toute combinaison des critères cités par les prérequis de repli est couverte par au moins un repli',
    () => {
      const violations = noeuds.flatMap((node) => violationsCouvertureRepli(node))
      expect(violations).toEqual([])
    },
  )
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// T-164 (P14/S2, mécanise R5) — tout critère déclaré a au moins un lecteur
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

/**
 * R5 (`docs/decision/GRAMMAIRE-NOEUD.md`, § « Un critère qu'on demande doit agir ») existe en prose
 * depuis l'origine du domaine ; rien ne le vérifiait. `rhd-activite-physique.verrou_effort` est déclaré
 * et cité NULLE PART : la carte « programme d'APA » réécrit ses 4 termes en clair dans ses `exclusions`
 * au lieu de lire le dérivé — deux endroits à tenir cohérents au lieu d'un.
 *
 * LECTEURS QUI COMPTENT (Décision clé, `plans/P14/S2.md`) — la liste EXACTE, ni plus ni moins :
 * `conditions`, `prerequis`, `exclusions`, `alertes[].quand` (nœud ET option), `calculs[].expression`,
 * `derive` d'un AUTRE critère, `visible_si`, `valeurs_visible_si`, `preremplissage[].quand`,
 * `contraintes[].expression`, `familles[].prioritaire_si`. `priorite[].quand`, `action_si[].quand` et
 * `contre_indications[].condition` sont VOLONTAIREMENT ABSENTS de cette liste (Décision clé du plan) :
 * un rang, un badge ou l'état visuel d'une contre-indication ne sont pas le genre d'effet que R5 vise
 * (« la recommandation, un rang, une alerte, une dose calculée ») — un rang parmi des options DÉJÀ TOUTES
 * proposées n'individualise rien de ce qui EST proposé, contrairement à une `condition` qui ajoute ou
 * retire une carte.
 *
 * `preremplissage` COMPTE comme lecteur, et c'est un choix délibéré (Décision clé) : c'est ce qui rendra
 * `HbA1c_cible` légitime après S11 (K6, `plans/P13/S5.md`) sans qu'il agisse par ailleurs sur la
 * sélection — proposer une valeur de départ est déjà « faire quelque chose » au sens de R5.
 *
 * EXCLUSION DE SOI-MÊME (Décision clé, étape 1) : pour le critère EXAMINÉ, sa propre `derive` et son
 * propre `visible_si` sont retirés de la concaténation avant la recherche — « un critère ne se lit pas
 * lui-même ». Sans cette exclusion, un critère dérivé qui se citerait lui-même (jamais rencontré dans ce
 * contenu, mais possible en théorie) se validerait sans qu'aucun AUTRE endroit du nœud ne le lise.
 *
 * ROUGE À L'ÉCRITURE (S2), PUIS RESTÉ ROUGE APRÈS S8/T-172 : `rhd-activite-physique.verrou_effort` avait
 * deux lecteurs concurrents (liste « à renseigner » vs rendu du motif d'écartement, cf. le bilan de
 * `plans/P14/S8.md`) — remplacer l'exclusion par `verrou_effort == true` aurait dégradé la précision du
 * message affiché (retour en arrière sur T-155/D7). **VERT depuis le 2026-08-07** (décision référent) :
 * `verrou_effort` est retiré du contenu plutôt que gardé sans lecteur — cf. le changelog
 * `rhd-activite-physique.yaml`. Si un critère est de nouveau signalé, `plans/P14/S2.md` demande un STOP
 * (rapporté, pas corrigé ici).
 */
/**
 * D50/T-179 (P14/S10) — EXTRAITE de `expressionsLectrices` (ci-dessous) pour être RÉUTILISÉE telle quelle
 * par l'invariant du garde-fou D50, plus bas dans ce fichier : la liste des lecteurs qui COMPTENT contre ce
 * garde-fou est CELLE DE R5 (« exhaustive », D50), MOINS `preremplissage` (seul lecteur AUTORISÉ pour un
 * critère publié). Décision de S9, à la relecture de D50 : « réutilise la même liste que R5 pour éviter
 * deux listes désynchronisées » — S9 avait constaté que la première rédaction de `plans/P14/S10.md`
 * énumérait cette liste À LA MAIN et y avait DÉJÀ oublié `calculs[].expression` et `valeurs_visible_si`.
 * Une seule fonction, deux appelants (`expressionsLectrices` lui ajoute `preremplissage[].quand`,
 * l'invariant D50 plus bas l'utilise NUE) : aucune seconde énumération à tenir synchrone avec celle-ci.
 */
function expressionsLectricesHorsPreremplissage(node: Noeud, critereExamine: CritereEntree): string[] {
  const expressions: string[] = []
  for (const option of node.options) {
    expressions.push(...option.conditions)
    expressions.push(...(option.prerequis ?? []))
    expressions.push(...(option.exclusions ?? []))
    expressions.push(...(option.calculs ?? []).map((c) => c.expression))
    expressions.push(...(option.alertes ?? []).map((a) => a.quand))
  }
  expressions.push(...(node.alertes ?? []).map((a) => a.quand))
  expressions.push(...(node.contraintes ?? []).map((c) => c.expression))
  for (const famille of node.familles ?? []) {
    if (famille.prioritaire_si) expressions.push(famille.prioritaire_si)
  }
  for (const critere of node.criteres_entree) {
    if (critere.derive && critere !== critereExamine) expressions.push(critere.derive)
    if (critere.visible_si && critere !== critereExamine) expressions.push(critere.visible_si)
    for (const expr of Object.values(critere.valeurs_visible_si ?? {})) expressions.push(expr)
  }
  return expressions
}

function expressionsLectrices(node: Noeud, critereExamine: CritereEntree): string[] {
  const expressions = expressionsLectricesHorsPreremplissage(node, critereExamine)
  for (const critere of node.criteres_entree) {
    for (const regle of critere.preremplissage ?? []) expressions.push(regle.quand)
  }
  return expressions
}

describe('T-164 (P14/S2, mécanise R5) — tout critère déclaré a au moins un lecteur', () => {
  it(
    'aucun `criteres_entree[].nom` n’est absent de la concaténation de ses lecteurs',
    () => {
      const violations: string[] = []
      for (const node of noeuds) {
        for (const critere of node.criteres_entree) {
          const lu = expressionsLectrices(node, critere).some((expr) => citeLeCritere(expr, critere.nom))
          if (!lu) {
            violations.push(
              `nœud "${node.id}" :: critère "${critere.nom}" déclaré sans AUCUN lecteur — R5 : « un ` +
                `critère qu'on demande doit agir ; sinon on ne le demande pas » ` +
                `(docs/decision/GRAMMAIRE-NOEUD.md).`,
            )
          }
        }
      }
      expect(violations).toEqual([])
    },
  )
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// T-179 (P14/S10, mécanise le garde-fou de D50) — un critère PUBLIÉ n'a aucun lecteur hors préremplissage
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

/**
 * D50 (`docs/commun/decisions/2026-08-06-d50-*.md`) amende D28 : l'option RETENUE d'un nœud à sortie
 * unique (`selection: ordered-first-match`) peut PUBLIER une valeur en mémoire de session
 * (`Option.publie`). Le GARDE-FOU OPPOSABLE qui rend ce mécanisme acceptable au regard de R1 (aucun
 * chaînage entre nœuds) — « c'est la condition de validité du mécanisme, pas un supplément » (D50) : un
 * critère alimenté par publication ne peut avoir AUCUN LECTEUR AUTRE QU'UN `preremplissage`. Sans lui, une
 * valeur PUBLIÉE (une CONCLUSION du moteur sur un autre nœud) pourrait piloter une RÈGLE de CE nœud — le
 * chaînage entre nœuds que R1/D28 interdisent depuis l'origine, sous un nom différent. « Sans cet
 * invariant, le mécanisme n'est pas livré du tout » (D50).
 *
 * LISTE DES LECTEURS INTERDITS = celle de R5/T-164 CI-DESSUS, MOINS `preremplissage` —
 * `expressionsLectricesHorsPreremplissage` (définie plus haut), PARTAGÉE avec `expressionsLectrices` :
 * jamais une seconde liste tenue à la main (cf. sa docstring pour le précédent qui motive ce choix).
 *
 * PORTÉE GLOBALE (D50 : « la mémoire de session est un espace de noms unique », D28) : un critère publié
 * l'est PARTOUT où son nom est déclaré, pas seulement sur le nœud qui le publie — `nomsPublies` ci-dessous
 * collecte donc les noms publiés sur TOUT LE DOMAINE (toutes les options de tous les nœuds), et
 * `violationsGardeFouD50` vérifie CHAQUE occurrence de ces noms, sur CHAQUE nœud qui les déclare, pas
 * seulement sur le nœud publicateur.
 *
 * `Option.publie.critere` N'EST PAS AJOUTÉ à `expressionsLectricesHorsPreremplissage` : c'est un NOM CITÉ
 * (l'identifiant d'un critère cible), jamais une EXPRESSION DSL — il n'a pas la forme d'un « lecteur » au
 * sens de cet invariant, exactement comme `Option.famille`/`Calcul.libelle` n'en ont pas non plus.
 *
 * SUR DES NŒUDS DE FIXTURE (ci-dessous), JAMAIS SUR `content/` (S11 s'en charge, `plans/P14/S10.md`
 * "Hors périmètre") : le premier test, lui, tourne sur `noeuds` (le contenu réel) — DOIT être vert dès
 * l'écriture, puisqu'aucun nœud réel ne déclare encore `publie` au jour de T-179 (`nomsPublies(noeuds)` y
 * est vide) ; c'est ce test-là que S11 fera trébucher le jour où un critère publié gagnerait un lecteur
 * interdit. Les deux tests de fixture qui suivent prouvent que le CALCUL lui-même détecte bien une
 * violation quand il y en a une (rouge attendu sur la fixture, symétrique du test qui passe).
 */
function nomsPublies(domaine: readonly Noeud[]): Set<string> {
  const noms = new Set<string>()
  for (const node of domaine) {
    for (const option of node.options) {
      if (option.publie) noms.add(option.publie.critere)
    }
  }
  return noms
}

/** Toutes les violations du garde-fou D50 sur `domaine` — un message par (nœud, critère) fautif. */
function violationsGardeFouD50(domaine: readonly Noeud[]): string[] {
  const publies = nomsPublies(domaine)
  const violations: string[] = []
  for (const node of domaine) {
    for (const critere of node.criteres_entree) {
      if (!publies.has(critere.nom)) continue
      const lecteurs = expressionsLectricesHorsPreremplissage(node, critere)
      if (lecteurs.some((expr) => citeLeCritere(expr, critere.nom))) {
        violations.push(
          `nœud "${node.id}" :: critère publié "${critere.nom}" a un lecteur hors préremplissage — D50 : ` +
            `« un critère alimenté par publication ne peut avoir aucun lecteur autre qu'un ` +
            `préremplissage » (docs/commun/decisions/2026-08-06-d50-une-option-de-noeud-a-sortie-unique-` +
            `peut-publier-une-valeur.md).`,
        )
      }
    }
  }
  return violations
}

/** Gabarit minimal, commun aux deux nœuds de fixture ci-dessous (mêmes conventions que les fixtures RTL
 *  du dossier `screens/*.test.tsx` : aucun champ clinique réel, D8). */
function noeudFixtureD50(partiel: Pick<Noeud, 'id' | 'criteres_entree' | 'options'> & Partial<Noeud>): Noeud {
  return {
    domaine: 'test',
    titre: `Nœud de test (${partiel.id})`,
    population_cible: 'test',
    argumentaire: 'x',
    sources: {
      references_primaires: [],
      synthese_critique: { donnee: '' },
      reco_officielle: { source: '', position: '', divergence: false, explication: '' },
    },
    incertitudes: [],
    veille_liee: [],
    meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide', version: '1.0', changelog: [] },
    ...partiel,
  }
}

/** Le nœud PUBLICATEUR de fixture : un `ordered-first-match` dont l'unique option publie
 *  `valeur_publiee_fixture`. Commun aux deux scénarios de fixture ci-dessous. */
const NOEUD_FIXTURE_PUBLICATEUR: Noeud = noeudFixtureD50({
  id: 'fixture-d50-publicateur',
  selection: 'ordered-first-match',
  criteres_entree: [],
  options: [
    {
      intitule: 'Option socle (fixture)',
      role: 'socle',
      conditions: ['toujours'],
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
      publie: { critere: 'valeur_publiee_fixture', valeur: 7 },
    },
  ],
})

describe("D50/T-179 (P14/S10) — un critère publié n'a aucun lecteur hors préremplissage", () => {
  it('sur le contenu réel : le garde-fou est vert (peuplé le 2026-08-06 par P14/S11, T-181 : `HbA1c_cible` publié par `cible-glycemique`, reçu par `prescription`/`insuline` — seul lecteur des deux côtés : `preremplissage` de `position_vs_cible`)', () => {
    expect(violationsGardeFouD50(noeuds)).toEqual([])
  })

  it('fixture : un critère publié cité dans les `conditions` d’un AUTRE nœud VIOLE le garde-fou (rouge attendu)', () => {
    const noeudRecepteurFautif = noeudFixtureD50({
      id: 'fixture-d50-recepteur-fautif',
      criteres_entree: [{ nom: 'valeur_publiee_fixture', type: 'nombre', min: 0, max: 20 }],
      options: [
        {
          intitule: 'Option qui lit la valeur publiée dans une condition',
          role: 'geste',
          conditions: ['valeur_publiee_fixture > 5'],
          avantages: [],
          inconvenients: [],
          effet_attendu: 'non chiffrable',
          niveau_preuve: 'faible',
        },
      ],
    })

    const violations = violationsGardeFouD50([NOEUD_FIXTURE_PUBLICATEUR, noeudRecepteurFautif])

    expect(violations).not.toEqual([])
    expect(violations[0]).toContain('fixture-d50-recepteur-fautif')
    expect(violations[0]).toContain('valeur_publiee_fixture')
    expect(violations[0]).toContain('D50')
  })

  it('fixture : un critère publié cité SEULEMENT dans un `preremplissage[].quand` reste CONFORME (cas légitime de D50)', () => {
    const noeudRecepteurLegitime = noeudFixtureD50({
      id: 'fixture-d50-recepteur-legitime',
      criteres_entree: [
        { nom: 'valeur_publiee_fixture', type: 'nombre', min: 0, max: 20 },
        {
          nom: 'position_suggeree_fixture',
          type: 'enum',
          valeurs: ['a', 'b'],
          // SEUL lecteur autorisé du critère publié : un `preremplissage[].quand` d'un AUTRE critère —
          // exactement le canal que le garde-fou D50 laisse ouvert (« sinon le mécanisme ne suggère plus
          // rien »).
          preremplissage: [{ quand: 'valeur_publiee_fixture > 5', valeur: 'a' }],
        },
      ],
      options: [
        {
          intitule: 'Option qui ne lit jamais la valeur publiée',
          role: 'socle',
          conditions: ['toujours'],
          avantages: [],
          inconvenients: [],
          effet_attendu: 'non chiffrable',
          niveau_preuve: 'faible',
        },
      ],
    })

    expect(violationsGardeFouD50([NOEUD_FIXTURE_PUBLICATEUR, noeudRecepteurLegitime])).toEqual([])
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// T-165 (P14/S2, mécanise D30) — `presomption_non` reste hors des canaux de sécurité
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

/**
 * D30 pose en prose (`DECISIONS.md`) l'éligibilité de `presomption_non: true` : réservée aux critères qui
 * ne participent à AUCUNE condition d'option `role: securite` ni à AUCUNE `exclusions` du nœud. Cette
 * règle a été appliquée À LA MAIN, critère par critère, à l'écriture de T-018 (audit consigné dans le
 * changelog de chaque nœud) — rien, depuis, ne la revérifie mécaniquement. Le risque n'est pas
 * l'asymétrie d'aujourd'hui (`traitements_en_cours`, présumé faux sur `insuline`, pas sur `prescription`
 * où il gate des cartes de sécurité — ASYMÉTRIE DOCUMENTÉE ET CORRECTE, cf.
 * `CRITERES_DIVERGENTS_CONNUS` dans `coherence-inter-noeuds.test.ts`) : c'est le jour où une carte de
 * sécurité future se mettra à lire un critère présumé faux SANS que personne ne le remarque à la
 * relecture.
 *
 * UN NIVEAU DE DÉROULEMENT (Décision clé, étape 3) : un critère présumé faux peut être cité INDIRECTEMENT
 * — une expression sensible cite un critère DÉRIVÉ, dont le `derive` cite lui-même le critère présumé
 * faux. C'est ce que l'audit T-018, manuel et limité aux citations DIRECTES, ne pouvait pas voir.
 * RÉPLIQUE LOCALE de `primitivesReferencees` (`engine/evaluateNode.ts`) — MÊME algorithme (un seul
 * niveau, ce contenu ne chaîne jamais un dérivé sur un autre), PAS un import : cette fonction n'est pas
 * exportée par le moteur, et cet invariant porte sur le CONTENU tel qu'il est écrit — même raison que le
 * tokenizer local d'I6/I7 et le découpage de branches d'I24 en tête de ce fichier.
 *
 * CE QUI EST « SENSIBLE » (Décision clé, étape 2) : les `conditions` de toute option `role: securite` (un
 * fait de sécurité qui se déclencherait à tort sur un critère présumé faux), ET TOUTES les `exclusions`
 * du nœud, quelle que soit l'option (une exclusion présumée fausse ne retirerait jamais l'option qu'elle
 * est censée garder sous contrôle). `prerequis` est HORS de cet ensemble, à dessein : un `prerequis`
 * garde une COHÉRENCE (R6), il ne retire pas un fait de sécurité — c'est exactement le cas
 * `insuline`/`traitements_en_cours` que D30 autorise.
 *
 * DOIT ÊTRE VERT DÈS L'ÉCRITURE. Si l'un des deux tests ci-dessous est rouge sur le contenu actuel : STOP
 * (`plans/P14/S2.md`), ne pas ajuster le contenu ni la règle — décision référent.
 */
function primitivesExposeesUnNiveau(expression: string, criteres: CritereEntree[]): Set<string> {
  const noms = new Set<string>()
  for (const critere of criteres) {
    if (!new RegExp(`\\b${critere.nom}\\b`).test(expression)) continue
    if (critere.derive == null) {
      noms.add(critere.nom)
      continue
    }
    for (const autre of criteres) {
      if (autre.derive == null && new RegExp(`\\b${autre.nom}\\b`).test(critere.derive)) noms.add(autre.nom)
    }
  }
  return noms
}

/** Expressions « sensibles » d'un nœud (Décision clé, étape 2) : `conditions` des options `role:
 * securite`, et TOUTES les `exclusions` du nœud. */
function expressionsSensibles(
  node: Pick<Noeud, 'options'>,
): { expression: string; option: Option; canal: string }[] {
  const sensibles: { expression: string; option: Option; canal: string }[] = []
  for (const option of node.options) {
    if (option.role === 'securite') {
      for (const expr of option.conditions) {
        sensibles.push({ expression: expr, option, canal: 'condition (role: securite)' })
      }
    }
    for (const expr of option.exclusions ?? []) sensibles.push({ expression: expr, option, canal: 'exclusions' })
  }
  return sensibles
}

/**
 * EXCEPTIONS D30 ACCEPTÉES — décision référent (Thibault), 2026-08-06, P14/S2/T-165. PAS des dispenses
 * de forme : chaque entrée est un cas vérifié individuellement, pas un blanc-seing.
 *
 * `prescription :: infections_uro_genitales_recidivantes` — exposée INDIRECTEMENT, via le dérivé
 * `isglt2_indisponible` (un `OR` parmi trois), dans l'`exclusions` de « Glinide [remplacer] ». Cette
 * carte est `role: geste` (pas `securite`) : elle choisit ENTRE deux gestes non bloquants — remplacer le
 * glinide par une classe protectrice, ou réduire sa posologie (seul insulinosécréteur utilisable sous
 * DFG 30, arbitrage référent A2 du 2026-07-30, cf. commentaire `prescription.yaml` en tête de l'option).
 * Si l'antécédent n'est pas renseigné, présumé absent : la carte « remplacer » peut s'afficher au lieu
 * de « réduire la posologie » — un choix de LIBELLÉ entre deux gestes de la même famille, pas une
 * exposition dangereuse (l'INITIATION effective d'un iSGLT2 reste gouvernée, ailleurs dans ce nœud, par
 * ses propres gardes directs sur ce critère — jamais par cette carte). Décision référent 2026-08-06 :
 * garder `presomption_non` tel quel — « un drapeau rouge non coché est considéré absent » est le
 * principe général de l'outil, pas une exception ad hoc à ce seul critère. Vérifié : c'est la SEULE
 * `exclusions` du nœud que `isglt2_indisponible`/`aglp1_indisponible` atteignent (les autres citations
 * du couple sont des `conditions`/`prerequis` d'options `role: geste`, hors du périmètre de D30 par
 * construction — `expressionsSensibles` ne les inclut déjà pas).
 *
 * Clé = `${node.id} :: ${critère exposé}`, même convention que `VIOLATIONS_R8_CONNUES_T018` ci-dessus.
 * AUTO-EXPIRANTE : si un jour aucune violation ne cite plus ce critère sur ce nœud, le test réclame le
 * retrait de l'entrée.
 */
const EXCEPTIONS_D30_T165 = new Map<string, string>([
  [
    'prescription :: infections_uro_genitales_recidivantes',
    'Décision référent 2026-08-06 (P14/S2/T-165) : exposition indirecte via `isglt2_indisponible` dans ' +
      "l'exclusion de « Glinide [remplacer] » (role: geste, pas securite) — accepté, cf. docstring ci-dessus.",
  ],
])

/** Violations D30 d'UN nœud : un critère `presomption_non: true` exposé (directement, ou via UN niveau
 * de dérivé) par une expression sensible, hors `EXCEPTIONS_D30_T165` connues. */
function violationsPresomptionNonHorsSecurite(
  node: Pick<Noeud, 'id' | 'criteres_entree' | 'options'>,
): string[] {
  const presumesFaux = node.criteres_entree.filter((c) => c.presomption_non === true)
  if (presumesFaux.length === 0) return []
  const violations: string[] = []
  for (const { expression, option, canal } of expressionsSensibles(node)) {
    const exposes = primitivesExposeesUnNiveau(expression, node.criteres_entree)
    for (const critere of presumesFaux) {
      if (!exposes.has(critere.nom)) continue
      if (EXCEPTIONS_D30_T165.has(`${node.id} :: ${critere.nom}`)) continue // décision référent, cf. ci-dessus
      violations.push(
        `nœud "${node.id}" :: option "${option.intitule}" (${canal}) :: expression "${expression}" cite ` +
          `"${critere.nom}" (\`presomption_non: true\`) — D30 interdit qu'un critère présumé faux ` +
          `gouverne un canal de sécurité.`,
      )
    }
  }
  return violations
}

describe('T-165 (P14/S2, mécanise D30) — `presomption_non` reste hors des canaux de sécurité', () => {
  it('aucun critère `presomption_non: true` n’est cité, même via un dérivé, dans une condition de sécurité ou une exclusion (hors exceptions référent documentées)', () => {
    const violations = noeuds.flatMap((node) => violationsPresomptionNonHorsSecurite(node))
    expect(violations).toEqual([])
  })

  it('EXCEPTIONS_D30_T165 ne contient aucune entrée périmée (auto-expiration)', () => {
    for (const [cle] of EXCEPTIONS_D30_T165) {
      const [nodeId, nom] = cle.split(' :: ')
      const node = noeuds.find((n) => n.id === nodeId)
      expect(node, `nœud "${nodeId}" de EXCEPTIONS_D30_T165 introuvable`).toBeDefined()
      const presumesFaux = node!.criteres_entree.filter((c) => c.presomption_non === true)
      const expose = expressionsSensibles(node!).some(({ expression }) =>
        primitivesExposeesUnNiveau(expression, node!.criteres_entree).has(nom),
      )
      expect(
        expose && presumesFaux.some((c) => c.nom === nom),
        `"${cle}" ne correspond plus à aucune exposition réelle — dette résorbée, retirer l'entrée de ` +
          `EXCEPTIONS_D30_T165.`,
      ).toBe(true)
    }
  })

  it('mord sur un cas fabriqué (dérivé qui expose un critère présumé faux dans une condition `role: securite`), laisse passer le même dérivé cité hors canal sensible', () => {
    const primitif: CritereEntree = { nom: 'critere_presume_faux', type: 'liste', valeurs: ['x'], presomption_non: true }
    const derive: CritereEntree = { nom: 'derive_qui_expose', type: 'bool', derive: 'critere_presume_faux contient x' }
    const optionSecuriteFautive: Option = {
      intitule: 'Option de sécurité synthétique',
      role: 'securite',
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
      conditions: ['derive_qui_expose == true'],
    }
    const noeudFautif = { id: 'synthetique', criteres_entree: [primitif, derive], options: [optionSecuriteFautive] }
    const violations = violationsPresomptionNonHorsSecurite(noeudFautif)
    expect(violations).toHaveLength(1)
    expect(violations[0]).toContain('critere_presume_faux')

    // Contre-épreuve : la même option de sécurité, mais dont la condition ne cite PAS le dérivé sensible —
    // rien à exposer, rien à mordre.
    const noeudPropre = {
      ...noeudFautif,
      options: [{ ...optionSecuriteFautive, conditions: ['toujours'] }],
    }
    expect(violationsPresomptionNonHorsSecurite(noeudPropre)).toEqual([])
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// I33 (P14/S16, T-189) — UN FAIT DE SÉCURITÉ CONCERNÉ PAR UNE CLASSE PRESCRITE EST ÉVALUÉ, OU DÉCLARÉ
// HORS PÉRIMÈTRE (principe P2 de la revue de conception du 2026-08-04)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

/**
 * I33 mécanise LE PRINCIPE P2 tel qu'énoncé par la revue de conception du 2026-08-04, arbitré le
 * 2026-08-06 (`plans/P14/S16.md` § Décision clé) :
 *
 * > « un test d'invariant vérifie qu'un critère de sécurité déclarable quelque part est évalué (ou
 * > explicitement déclaré hors périmètre) par tout nœud qui prescrit une classe concernée. »
 *
 * LES DEUX MOITIÉS COMPTENT AUTANT L'UNE QUE L'AUTRE. Un invariant qui exigerait que TOUT nœud voie TOUT
 * fait commun serait ingérable et faux — `statine` n'a rien à faire de la cétonémie. Ce qui est
 * inacceptable n'est pas l'ABSENCE, c'est l'ABSENCE SILENCIEUSE. D'où la porte de sortie explicite,
 * `Noeud.criteres_hors_perimetre` (`{ nom, motif }`, `node.types.ts`) : le motif est lu par un HUMAIN,
 * jamais par la machine — son EXISTENCE suffit à transformer un oubli en décision.
 *
 * CE QUE « PRESCRIRE UNE CLASSE » VEUT DIRE ICI, ET COMMENT C'EST DÉTECTÉ — sans aucun nom de nœud ni de
 * domaine codé en dur (CLAUDE.md invariant 5). Une valeur de `CritereCommun.concerne` (fichier commun du
 * DOMAINE du nœud examiné, `content/decision/criteres-communs/<domaine>.yaml`, exposé par
 * `loadNodes.ts` sous `fichiersCriteresCommuns`) est « prescrite » par un nœud si elle apparaît, MOT
 * ENTIER, dans au moins une expression `conditions`/`prerequis`/`exclusions` d'au moins une option de ce
 * nœud — les TROIS canaux qui, à eux seuls, RETIENNENT ou RETIRENT une option pour un patient (même
 * périmètre que `criteresDesGardeFous`, I7 en tête de ce fichier, pour `exclusions`/`prerequis`, étendu
 * ici à `conditions` : la question n'est plus « qu'est-ce qui protège » mais « qu'est-ce qui est
 * proposé »). `alertes[].quand`, `derive`, `visible_si`… ne comptent PAS : ils ne PRESCRIVENT rien par
 * eux-mêmes, ils décrivent ou affichent.
 *
 * LA RÈGLE, pour chaque (nœud, fait commun) où au moins une classe concernée est prescrite par ce nœud :
 * le nœud doit DÉCLARER le fait (forme complète OU `{ ref }` — INDISCERNABLES une fois `criteres_entree`
 * résolu par `loadNodes.ts`, d'où la simple recherche par `nom` ci-dessous, jamais une inspection de la
 * forme d'origine) OU le lister dans `criteres_hors_perimetre`. Ni l'un ni l'autre ⇒ ABSENCE SILENCIEUSE.
 *
 * DEUX GARDE-FOUS SYMÉTRIQUES SUR `criteres_hors_perimetre` LUI-MÊME (`plans/P14/S16.md`, étapes 5 et
 * 6 — sans eux, cette porte de sortie deviendrait un second angle mort) :
 *   - un fait à la fois DÉCLARÉ et listé hors périmètre est une CONTRADICTION (lequel des deux ment ?) ;
 *   - un fait hors périmètre qu'AUCUNE classe prescrite ne concerne est une DÉCLARATION MORTE — rien à
 *     écarter ici, la liste deviendrait un cimetière si elle n'était jamais vérifiée.
 * Les deux font échouer le test au même titre que l'absence silencieuse — les TROIS vérifications sont
 * INDÉPENDANTES (elles ne s'excluent pas mutuellement : un même fait pourrait en théorie cumuler
 * contradiction et déclaration morte, si la classe qui l'avait un jour rendu pertinent a disparu du
 * contenu pendant qu'il restait déclaré ET hors périmètre à la fois).
 *
 * ROUGE À L'ÉCRITURE, ET C'EST ATTENDU (`plans/P14/S16.md` § Validation, `it.fails`) : sur les DEUX
 * défauts nommément mesurés par S14 (`docs/decision/validation/criteres-communs-2026-08-06.md` § 3.1) —
 *   - `insuline` prescrit `insuline_basale`/`insuline_rapide` (deux valeurs de `concerne` de `cetonemie`)
 *     sans déclarer `cetonemie` ni le lister hors périmètre ;
 *   - `prescription` prescrit `sulfamide`/`glinide` (les deux valeurs de `concerne` de
 *     `hypo_severe_recurrente`) sans déclarer ce fait ni le lister hors périmètre.
 * Cet invariant CONSTATE — il ne corrige rien : `plans/P14/S18.md` (insuline/cetonemie) et
 * `plans/P14/S19.md` (prescription/hypo_severe_recurrente) lèveront ces deux défauts, chacun par une
 * décision de CONTENU propre (déclarer le fait, ou le déclarer hors périmètre avec un motif clinique —
 * ce choix n'appartient pas à ce test). `it.fails` → `it` le jour où le second des deux tombe.
 *
 * `hypo_severe_recurrente` A GAGNÉ SA DÉFINITION COMMUNE EN S16 (et non en S17, comme le reste de la
 * liste candidate de S14) POUR QUE CE MESSAGE PUISSE LA NOMMER — cf. `content/decision/criteres-communs/
 * diabete-type-2.yaml`, MÊME GESTE que S15 pour `cetonemie` : une DÉFINITION commune ajoutée, AUCUNE
 * déclaration de nœud convertie. `insuline.yaml` continue de déclarer `hypo_severe_recurrente` en forme
 * COMPLÈTE, sans `{ ref }` — cette conversion est un déplacement de contenu, hors mandat de S16
 * (`plans/P14/S16.md` § Hors périmètre : « ne modifier aucun contenu clinique »), laissée à S18/S19.
 */
function expressionsPrescriptivesDuNoeud(node: Pick<Noeud, 'options'>): string[] {
  const expressions: string[] = []
  for (const option of node.options) {
    expressions.push(...option.conditions)
    expressions.push(...(option.prerequis ?? []))
    expressions.push(...(option.exclusions ?? []))
  }
  return expressions
}

/** Les valeurs de `classes`, PARMI CELLES-LÀ SEULEMENT, effectivement prescrites par ce nœud (mot entier,
 * cf. docstring ci-dessus pour le périmètre exact des trois canaux `conditions`/`prerequis`/`exclusions`
 * qui comptent comme « prescription »). */
function classesPrescritesParmi(node: Pick<Noeud, 'options'>, classes: readonly string[]): string[] {
  const expressions = expressionsPrescriptivesDuNoeud(node)
  return classes.filter((classe) => expressions.some((expr) => new RegExp(`\\b${classe}\\b`).test(expr)))
}

/**
 * Toutes les violations d'I33 sur UN nœud, contre l'ensemble des `fichiers` de critères communs. Seul le
 * fichier dont `domaine` égale `node.domaine` est pertinent — un domaine SANS fichier commun n'a
 * simplement rien à vérifier ici, ce n'est pas une erreur (contrairement à `resoudreCritereEntree` de
 * `loadNodes.ts`, qui lève si un `ref` y renvoie explicitement : ici, aucun `ref` n'est en jeu, seulement
 * la présence ou l'absence d'un fait DANS le contenu résolu du nœud).
 */
function violationsFaitsConcernes(
  node: Pick<Noeud, 'id' | 'domaine' | 'options' | 'criteres_entree' | 'criteres_hors_perimetre'>,
  fichiers: readonly FichierCriteresCommuns[],
): string[] {
  const fichier = fichiers.find((f) => f.domaine === node.domaine)
  if (!fichier) return []

  const violations: string[] = []
  for (const fait of fichier.criteres) {
    const classesConcernees = fait.concerne ?? []
    const classesPrescrites = classesPrescritesParmi(node, classesConcernees)
    const pertinent = classesPrescrites.length > 0
    const declare = node.criteres_entree.some((c) => c.nom === fait.nom)
    const horsPerimetre = (node.criteres_hors_perimetre ?? []).find((h) => h.nom === fait.nom)

    if (declare && horsPerimetre) {
      violations.push(
        `nœud "${node.id}" :: fait "${fait.nom}" :: CONTRADICTION — déclaré dans \`criteres_entree\` ET ` +
          `listé dans \`criteres_hors_perimetre\` (motif : "${horsPerimetre.motif}") :: retirer l'un des deux.`,
      )
    }
    if (!pertinent && horsPerimetre) {
      violations.push(
        `nœud "${node.id}" :: fait "${fait.nom}" :: DÉCLARATION MORTE — listé dans ` +
          `\`criteres_hors_perimetre\` (motif : "${horsPerimetre.motif}"), mais aucune des classes que ce ` +
          `fait concerne (${classesConcernees.join(', ') || 'aucune'}) n'est prescrite par ce nœud :: rien ` +
          `à écarter ici, retirer l'entrée.`,
      )
    }
    if (pertinent && !declare && !horsPerimetre) {
      violations.push(
        `nœud "${node.id}" :: fait "${fait.nom}" :: ABSENCE SILENCIEUSE — ce nœud prescrit ` +
          `${classesPrescrites.join(', ')} (concernée(s) par "${fait.nom}", ` +
          `content/decision/criteres-communs/${node.domaine}.yaml), mais ne déclare pas "${fait.nom}" ` +
          `(forme complète ou \`{ ref }\`) et ne le liste pas dans \`criteres_hors_perimetre\` :: deux ` +
          `issues, jamais une troisième — (1) déclarer "${fait.nom}" dans \`criteres_entree\`, ou ` +
          `(2) le lister dans \`criteres_hors_perimetre: [{ nom: "${fait.nom}", motif: "…" }]\` avec un ` +
          `motif clinique (principe P2, plans/P14/S16.md).`,
      )
    }
  }
  return violations
}

describe('I33 (P14/S16, T-189) — un fait de sécurité concerné est évalué, ou déclaré hors périmètre (P2)', () => {
  // VERT DEPUIS LE 2026-08-07 (P14/S19, T-192) — `it.fails` → `it`, comme annoncé par la docstring
  // ci-dessus : les DEUX défauts nommément mesurés par S14 sont désormais levés, chacun par sa session
  // (`plans/P14/S18.md`, insuline/cetonemie — `{ ref: cetonemie }` + alerte de nœud, T-191 ; `plans/P14/
  // S19.md`, prescription/hypo_severe_recurrente — `{ ref: hypo_severe_recurrente }` + terme sur les
  // cartes d'allègement sulfamide/glinide, T-192). Si ce test redevient rouge, c'est qu'un défaut du même
  // type a été réintroduit ailleurs dans le domaine — ne PAS revenir à `it.fails` sans le diagnostiquer.
  it(
    'aucun nœud ne prescrit une classe concernée par un fait commun sans le déclarer ni le lister hors périmètre',
    () => {
      const violations = noeuds.flatMap((node) => violationsFaitsConcernes(node, fichiersCriteresCommuns))
      expect(violations).toEqual([])
    },
  )

  /**
   * VACUITÉ NON PERTINENTE ICI (à la différence d'I24) : le test ci-dessus n'est PAS vert sur un ensemble
   * vide au jour de l'écriture — il mord déjà sur le contenu réel (les deux défauts S14). Ce second test
   * garde néanmoins le PATRON d'I24 (« mord sur un cas fabriqué, laisse passer le cas légitime ») : il
   * prouve que le MÉCANISME de détection lui-même distingue les trois natures de violation et les deux
   * cas légitimes, INDÉPENDAMMENT du contenu réel — ce que le test ci-dessus, par construction, ne peut
   * pas démontrer isolément (un seul type de violation — l'absence — y est actuellement exercé).
   */
  it('mord sur trois défauts fabriqués (absence silencieuse, contradiction, déclaration morte), laisse passer les deux cas légitimes et le fait non pertinent', () => {
    const fichierFictif: FichierCriteresCommuns = {
      domaine: 'test-i33',
      criteres: [
        { nom: 'fait_absence_silencieuse', type: 'bool', concerne: ['CLASSE_A'] },
        { nom: 'fait_contradiction', type: 'bool', concerne: ['CLASSE_B'] },
        { nom: 'fait_declaration_morte', type: 'bool', concerne: ['CLASSE_C'] },
        { nom: 'fait_correctement_declare', type: 'bool', concerne: ['CLASSE_D'] },
        { nom: 'fait_correctement_hors_perimetre', type: 'bool', concerne: ['CLASSE_E'] },
        { nom: 'fait_non_pertinent', type: 'bool', concerne: ['CLASSE_JAMAIS_PRESCRITE'] },
      ],
    }

    const optionQuiPrescrit = (classe: string): Option => ({
      intitule: `Option synthétique I33 (${classe})`,
      role: 'geste',
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
      conditions: [`traitements_en_cours contient ${classe}`],
    })

    // Options qui prescrivent A, B, D, E — délibérément AUCUNE ne prescrit C ni CLASSE_JAMAIS_PRESCRITE :
    // c'est ce qui rend `fait_declaration_morte` et `fait_non_pertinent` NON PERTINENTS pour ce nœud.
    const noeudFautif = {
      id: 'fixture-i33-fautif',
      domaine: 'test-i33',
      options: [
        optionQuiPrescrit('CLASSE_A'),
        optionQuiPrescrit('CLASSE_B'),
        optionQuiPrescrit('CLASSE_D'),
        optionQuiPrescrit('CLASSE_E'),
      ],
      criteres_entree: [
        // Déclaré ET listé hors périmètre plus bas ⇒ contradiction.
        { nom: 'fait_contradiction', type: 'bool' },
        // Déclaré, pertinent, PAS hors périmètre ⇒ cas légitime, aucune violation.
        { nom: 'fait_correctement_declare', type: 'bool' },
      ] satisfies CritereEntree[],
      criteres_hors_perimetre: [
        { nom: 'fait_contradiction', motif: 'motif de test (contradiction attendue)' },
        // CLASSE_C n'est prescrite par AUCUNE option ⇒ déclaration morte.
        { nom: 'fait_declaration_morte', motif: 'motif de test (déclaration morte attendue)' },
        // CLASSE_E est prescrite, le fait n'est PAS déclaré par ailleurs ⇒ cas légitime, aucune violation.
        { nom: 'fait_correctement_hors_perimetre', motif: 'motif de test (cas légitime attendu)' },
      ],
    }

    const violations = violationsFaitsConcernes(noeudFautif, [fichierFictif])

    expect(violations).toHaveLength(3)
    expect(
      violations.some((v) => v.includes('fait_absence_silencieuse') && v.includes('ABSENCE SILENCIEUSE')),
    ).toBe(true)
    expect(violations.some((v) => v.includes('fait_contradiction') && v.includes('CONTRADICTION'))).toBe(true)
    expect(
      violations.some((v) => v.includes('fait_declaration_morte') && v.includes('DÉCLARATION MORTE')),
    ).toBe(true)

    // Les deux cas légitimes et le fait non pertinent ne sont nommés par AUCUNE violation.
    expect(violations.some((v) => v.includes('fait_correctement_declare'))).toBe(false)
    expect(violations.some((v) => v.includes('fait_correctement_hors_perimetre'))).toBe(false)
    expect(violations.some((v) => v.includes('fait_non_pertinent'))).toBe(false)

    // Contre-épreuve, patron I24 : un nœud SANS aucun `criteres_hors_perimetre` ni `criteres_entree`
    // pertinent, contre un fichier commun VIDE de `concerne`, ne mord sur rien — la fonction ne fabrique
    // aucune violation sur un ensemble sans classe concernée.
    const fichierSansConcerne: FichierCriteresCommuns = {
      domaine: 'test-i33',
      criteres: [{ nom: 'fait_sans_concerne', type: 'bool' }],
    }
    expect(
      violationsFaitsConcernes({ id: 'fixture-i33-vide', domaine: 'test-i33', options: [], criteres_entree: [] }, [
        fichierSansConcerne,
      ]),
    ).toEqual([])

    // Domaine sans fichier commun : rien à vérifier, jamais une erreur (à la différence d'un `ref` non
    // résolu par `loadNodes.ts`, hors périmètre de cet invariant).
    expect(
      violationsFaitsConcernes(
        { id: 'fixture-i33-domaine-inconnu', domaine: 'domaine-sans-fichier-commun', options: [], criteres_entree: [] },
        [fichierFictif],
      ),
    ).toEqual([])
  })
})
