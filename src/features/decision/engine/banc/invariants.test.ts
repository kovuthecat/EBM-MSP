/**
 * Banc d'un nœud — COUCHE 3 « invariants » (docs/decision/GRAMMAIRE-NOEUD.md, section « Le banc d'un
 * nœud — trois couches »). Sept propriétés validées par le référent clinique le 2026-07-25 : les deux
 * premières valent pour TOUT nœud (moteur générique) ; les cinq suivantes sont des propriétés CLINIQUES
 * du domaine DT2 et ne concernent QUE le nœud `prescription`.
 *
 * Chaque propriété se valide UNE FOIS (relecture clinique du référent sur l'énoncé lui-même), puis se
 * revérifie mécaniquement sur un échantillon de profils tiré à graine fixe (`profils.ts`) — c'est le
 * point décisif de soutenabilité de cette couche (cf. tableau du document : « une propriété se valide
 * une fois et couvre tout l'espace »).
 *
 * ⚠ CE FICHIER (et lui seul, avec `evaluateNode.prescription.test.ts`) connaît du contenu clinique par
 * son NOM (`famille`, fragments d'`intitule`) : c'est volontaire — ces invariants EXPRIMENT des
 * propriétés cliniques du domaine DT2, pas de la logique de moteur. `profils.ts`, `couverture.test.ts`
 * et le reste du moteur restent strictement génériques (invariant CLAUDE.md 5 / DECISIONS.md D8) ; toute
 * connaissance de nom est isolée ici, dans les constantes ci-dessous.
 *
 * Traits d'union insécables (U+2011) dans les intitulés (ex. « AR GLP‑1 ») : comme le banc de vignettes
 * existant (`evaluateNode.prescription.test.ts`), on s'en affranchit en tronquant les fragments AVANT le
 * caractère problématique (ex. `'Introduire un AR GLP'` plutôt que `'... GLP‑1'`) — un simple copier-coller
 * du libellé complet échouerait silencieusement selon l'encodage de la source.
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById, noeuds } from '../../content/loadNodes.ts'
import type { Noeud } from '../../content/node.types.ts'
import type { Criteria } from '../conditions.ts'
import { evaluateCondition } from '../conditions.ts'
import { evaluateNode, groupesParFamille } from '../evaluateNode.ts'
import { computeBadges } from '../../lib/optionBadges.ts'
import { genererPairesBooleennes, genererProfils, tailleBanc } from './profils.ts'

// ---------------------------------------------------------------------------------------------------
// Constantes de contenu (nœud `prescription`, domaine DT2) — SEUL endroit du dépôt autorisé à nommer
// des options par fragment d'intitulé / famille, cf. avertissement en tête de fichier.
// ---------------------------------------------------------------------------------------------------
const FAMILLE_AGENT_A_AJOUTER = 'Agent à ajouter'

const INTRO_ISGLT2 = 'Introduire un iSGLT2'
const INTRO_GLP1 = 'Introduire un AR GLP' // tronqué avant le trait d'union insécable de « GLP‑1 »
const INTRO_TIRZEPATIDE = 'Introduire le tirzépatide'
const AGENTS_A_BENEFICE_ORGANE_INTRO = [INTRO_ISGLT2, INTRO_GLP1, INTRO_TIRZEPATIDE]

const GLIPTINE_PLACE_RESIDUELLE = 'Gliptine (sitagliptine)'
const SULFAMIDE_PLACE_RESIDUELLE = 'Sulfamide (gliclazide MR ou glimépiride)'
const INSULINE_ENVISAGER = 'Envisager l'
const INSULINE_INITIATION = "Insuline d'initiation"
const AGENTS_PUREMENT_GLYCEMIQUES_INTRO = [
  GLIPTINE_PLACE_RESIDUELLE,
  SULFAMIDE_PLACE_RESIDUELLE,
  INSULINE_ENVISAGER,
  INSULINE_INITIATION,
]

const SWITCH_GLIPTINE = 'Remplacer la gliptine' // -> AR GLP-1 (switch), seule option de ce nom
const ARRET_GLIPTINE_REDONDANTE = 'Arrêter la gliptine redondante'
const VERDICTS_GLIPTINE = [SWITCH_GLIPTINE, ARRET_GLIPTINE_REDONDANTE]

const SWITCH_SULFAMIDE = 'Remplacer le sulfamide'
const ARRET_SULFAMIDE_DFG = 'Arrêter le sulfamide (DFG'
const REDUIRE_SULFAMIDE = 'Réduire la posologie du sulfamide'
const DESINTENSIFIER = 'Désintensifier'
const VERDICTS_SULFAMIDE = [SWITCH_SULFAMIDE, ARRET_SULFAMIDE_DFG, REDUIRE_SULFAMIDE, DESINTENSIFIER]

/** Agent sans bénéfice dur → ses options de « verdict » (remplacement / arrêt / allègement), invariant 5. */
const VERDICTS_PAR_AGENT: Record<string, string[]> = {
  gliptine: VERDICTS_GLIPTINE,
  sulfamide: VERDICTS_SULFAMIDE,
}

function intitules(node: Noeud, profil: Criteria): string[] {
  return evaluateNode(node, profil).applicable.map((option) => option.intitule)
}

// ---------------------------------------------------------------------------------------------------
// Invariants 1-2 : GÉNÉRIQUES, valent pour tout nœud du dépôt (moteur, aucune connaissance de contenu).
// ---------------------------------------------------------------------------------------------------

/**
 * Nœuds pour lesquels l'invariant 2 (sortie jamais vide) est une DETTE DE CONTENU DÉJÀ CONNUE — PAS une
 * propriété de moteur à masquer sur les autres nœuds. Vide depuis le 2026-07-25 : `insuline.yaml` a reçu
 * une option de repli (« Poursuivre le schéma d'insuline en cours et réévaluer », `["default"]`, en
 * dernière position) qui bouche le trou « sortie muette » de la situation `basale_seule` sans clause de
 * sécurité déclenchée et déjà à l'objectif (arbitrage référent). Cette liste ne doit grossir que si un
 * nouveau trou est diagnostiqué et commenté — jamais pour faire taire une régression inattendue sur un
 * autre nœud (prescription, cible-glycémique, rhd, statine passent normalement).
 */
const NOEUDS_AVEC_SORTIE_VIDE_CONNUE = new Set<string>([])

describe.each(noeuds.map((node) => [node.id, node] as const))('banc — invariants génériques · nœud %s', (_id, node) => {
  const profils = genererProfils(node, tailleBanc(node))

  it('1 — jamais une option APPLICABLE dont une `exclusions` est vraie', () => {
    const violations: string[] = []
    profils.forEach((profil, i) => {
      for (const option of evaluateNode(node, profil).applicable) {
        for (const expr of option.exclusions ?? []) {
          if (evaluateCondition(expr, profil)) {
            violations.push(`profil #${i} :: option "${option.intitule}" applicable malgré exclusion "${expr}"`)
          }
        }
      }
    })
    expect(violations).toEqual([])
  })

  const testInvariant2 = NOEUDS_AVEC_SORTIE_VIDE_CONNUE.has(node.id) ? it.fails : it
  testInvariant2('2 — jamais `applicable` VIDE (aurait détecté le trou « sortie muette »)', () => {
    const profilsMuets: number[] = []
    profils.forEach((profil, i) => {
      if (evaluateNode(node, profil).applicable.length === 0) profilsMuets.push(i)
    })
    expect(profilsMuets).toEqual([])
  })
})

// ---------------------------------------------------------------------------------------------------
// Invariants 3-7 : SPÉCIFIQUES au domaine DT2 (nœud `prescription` uniquement) — propriétés cliniques,
// pas des propriétés de moteur. Ne s'appliquent à aucun autre nœud (statine, insuline, rhd, cible
// glycémique n'ont pas la notion de « gliptine »/« sulfamide »/famille « Agent à ajouter »).
// ---------------------------------------------------------------------------------------------------
describe('banc — invariants spécifiques au domaine DT2 (nœud prescription, validés référent 2026-07-25)', () => {
  const node = getNoeudById('prescription')
  if (!node) throw new Error('Nœud "prescription" introuvable (content/noeuds/diabete-type-2/prescription.yaml).')
  const taille = tailleBanc(node)
  const profils = genererProfils(node, taille)

  // NB : `applicable` seul ne convient PAS pour « simultanément proposés » — la famille « Agent à
  // ajouter » est `exclusive: true` PAR CONCEPTION (menu d'alternatives : plusieurs agents peuvent être
  // des candidats visibles à la fois, un seul est LE choix mis en avant). Gliptine et AR GLP-1 co-listés
  // comme alternatives quand aucun des deux n'est encore prescrit est donc NORMAL (constaté sur ce banc :
  // 3 profils), pas une association. Ce qui compte cliniquement (R3/D16) est qu'un seul des deux porte le
  // badge « recommandee » (`computeBadges`, réservé au groupe de TÊTE d'une famille exclusive) : c'est ce
  // que ce test vérifie, via les mêmes fonctions que l'écran (`groupesParFamille` + `computeBadges`).
  it('3a — jamais gliptine (place résiduelle) ET AR GLP-1 (introduction) recommandés SIMULTANÉMENT (badge « recommandee »)', () => {
    const violations: string[] = []
    profils.forEach((profil, i) => {
      const { applicable, rangs } = evaluateNode(node, profil)
      const badges = computeBadges(groupesParFamille(node, applicable, rangs))
      const gliptineRecommandee = applicable.some(
        (o) => o.intitule.includes(GLIPTINE_PLACE_RESIDUELLE) && badges.get(o) === 'recommandee',
      )
      const glp1Recommande = applicable.some((o) => o.intitule.includes(INTRO_GLP1) && badges.get(o) === 'recommandee')
      if (gliptineRecommandee && glp1Recommande) violations.push(`profil #${i}`)
    })
    expect(violations).toEqual([])
  })

  it('3b — gliptine + (AR GLP-1 OU tirzépatide) déjà en place ⇒ un geste correctif est applicable', () => {
    const violations: string[] = []
    profils.forEach((profil, i) => {
      const traitements = profil.traitements_en_cours
      if (!Array.isArray(traitements)) return
      const dejaCombine = traitements.includes('gliptine') && (traitements.includes('aGLP1') || traitements.includes('tirzepatide'))
      if (!dejaCombine) return
      const t = intitules(node, profil)
      if (!t.some((x) => x.includes(ARRET_GLIPTINE_REDONDANTE))) violations.push(`profil #${i}`)
    })
    expect(violations).toEqual([])
  })

  it('4 — jamais de sulfamide (place résiduelle) proposé si DFG < 30', () => {
    const violations: string[] = []
    profils.forEach((profil, i) => {
      const dfg = profil.DFG
      if (typeof dfg !== 'number' || dfg >= 30) return
      const t = intitules(node, profil)
      if (t.some((x) => x.includes(SULFAMIDE_PLACE_RESIDUELLE))) violations.push(`profil #${i} (DFG=${dfg})`)
    })
    expect(violations).toEqual([])
  })

  // DETTE REFERMÉE (2026-07-25, levée du verrou gliptine) : le profil « IMC < 22 + gliptine + athérome »
  // introduisait un iSGLT2 (bénéfice d'organe, indiqué par ASCVD_etablie) SANS qu'aucun verdict sur la
  // gliptine ne soit applicable — le switch « Remplacer la gliptine » était EXCLU par le garde-fou de
  // terrain (IMC < 22, alors propre au seul remplaçant AR GLP-1). Résorbé en contenu (pas en test) : les
  // exclusions IMC < 22 / dénutrition — celles du remplaçant, pas du verdict (R3) — ont été retirées de
  // l'option de switch de la gliptine, désormais généralisée (remplaçant choisi parmi iSGLT2/AR GLP-1
  // selon la comorbidité, comme pour le sulfamide) ; le verrou `ne_contient_pas gliptine` de l'option
  // « Introduire un AR GLP-1 » est levé (R4 livré). Le verdict sur la gliptine se déclenche donc
  // désormais dans tous les cas où un agent à bénéfice d'organe devient applicable pendant qu'elle est en
  // cours — c'est l'invariant ci-dessous, qui passe maintenant au vert.
  it(
    '5 — agent sans bénéfice dur en cours + introduction d’un agent à bénéfice d’organe ⇒ un verdict sur le premier est aussi applicable',
    () => {
      const violations: string[] = []
      profils.forEach((profil, i) => {
        const traitements = profil.traitements_en_cours
        if (!Array.isArray(traitements)) return
        const t = intitules(node, profil)
        const introduitAgentOrgane = AGENTS_A_BENEFICE_ORGANE_INTRO.some((fragment) => t.some((x) => x.includes(fragment)))
        if (!introduitAgentOrgane) return
        for (const agent of Object.keys(VERDICTS_PAR_AGENT)) {
          if (!traitements.includes(agent)) continue
          const verdictApplicable = VERDICTS_PAR_AGENT[agent].some((fragment) => t.some((x) => x.includes(fragment)))
          if (!verdictApplicable) violations.push(`profil #${i} :: agent "${agent}" sans verdict applicable`)
        }
      })
      expect(violations).toEqual([])
    },
  )

  it('6 — à `fragilite` près (toutes choses égales par ailleurs), fragilite=true ne produit jamais PLUS d’options « Agent à ajouter » que fragilite=false', () => {
    const paires = genererPairesBooleennes(node, taille, 'fragilite')
    const violations: string[] = []
    const compteAgentAAjouter = (profil: Criteria) =>
      evaluateNode(node, profil).applicable.filter((option) => option.famille === FAMILLE_AGENT_A_AJOUTER).length
    paires.forEach((paire, i) => {
      const nbVrai = compteAgentAAjouter(paire.aVrai)
      const nbFaux = compteAgentAAjouter(paire.aFaux)
      if (nbVrai > nbFaux) violations.push(`paire #${i} : fragilite=true -> ${nbVrai} options, fragilite=false -> ${nbFaux}`)
    })
    expect(violations).toEqual([])
  })

  // PARTIELLEMENT corrigé le 2026-07-25 (arbitrage référent, tâche F) : la place résiduelle gliptine/
  // sulfamide se déclenchait aussi via `classes_a_benefice_indisponibles == true`, un booléen SAISI
  // indépendamment de `position_vs_cible` — rien n'empêchait un profil `sous_objectif` (sur-contrôle,
  // cf. `cible_atteinte`) de porter aussi ce drapeau. Corrigé en contenu par l'ajout de la garde
  // `position_vs_cible != sous_objectif` aux DEUX options de place résiduelle nommées par l'arbitrage
  // (gliptine, sulfamide) — c'est tout ce que la tâche F a demandé de toucher.
  //
  // RESTRICTION DE L'INVARIANT (arbitrage référent, 2026-07-25) — c'est l'invariant qui était trop
  // large, pas le contenu. « Insuline d'initiation (état catabolique) » se déclenche sur
  // `HbA1c_actuelle >= 10 AND symptomes_glucotoxicite == true OR cetonemie == true`, SANS clause sur la
  // position, par conception (cf. son `effet_attendu` : « distinct du gate catabolique, qui ne dépend
  // pas de l'atteinte de l'objectif »). Or un patient PEUT être à sa cible, voire en dessous, ET en
  // cétose : c'est l'acidocétose euglycémique sous iSGLT2, entité reconnue. L'insuline y est
  // indispensable, et ce n'est pas « un agent glycémique de plus » — c'est un traitement d'urgence.
  //
  // C'est la DEUXIÈME fois que cet invariant doit être resserré : il disait d'abord « aucun ajout »,
  // corrigé une 1re fois parce qu'un iSGLT2 en insuffisance cardiaque reste indiqué quelle que soit la
  // glycémie. Même motif les deux fois — LES GARDE-FOUS D'URGENCE SONT ORTHOGONAUX À LA POSITION
  // GLYCÉMIQUE. Un invariant qui les ignore force à encoder une règle fausse pour passer au vert.
  it(
    '7 — aucun agent purement glycémique (gliptine, sulfamide, insuline) proposé à l’introduction si position_vs_cible == sous_objectif, HORS gate catabolique',
    () => {
      const violations: string[] = []
      profils.forEach((profil, i) => {
        if (profil.position_vs_cible !== 'sous_objectif') return
        // Gate catabolique : urgence métabolique, hors du champ de cet invariant (voir ci-dessus).
        if (profil.symptomes_glucotoxicite === true || profil.cetonemie === true) return
        const t = intitules(node, profil)
        for (const fragment of AGENTS_PUREMENT_GLYCEMIQUES_INTRO) {
          if (t.some((x) => x.includes(fragment))) violations.push(`profil #${i} :: "${fragment}"`)
        }
      })
      expect(violations).toEqual([])
    },
  )
})
