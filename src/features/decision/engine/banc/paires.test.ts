/**
 * Banc d'un nœud — INVENTAIRE FIGÉ DES PAIRES DE CARTES CO-ACTIVES (T-160, P14/S1) et INVARIANT « pas
 * deux cartes de même intitulé » (T-161, P14/S1).
 *
 * POURQUOI T-160 EXISTE — un diagnostic, pas une précaution théorique. Le 2026-08-06,
 * `__snapshots__/caracterisation.prescription.txt` (924 Ko) et `caracterisation.insuline.txt` (620 Ko)
 * ont été relus à la main : l'information « quelles cartes s'affichent ENSEMBLE pour un même patient »
 * y était déjà présente (des cartes titrées « Sulfamide »/« Glinide » en double, « Ne pas sur-titrer »
 * avec « Titrer la basale »), mais illisible — un fichier de 900 Ko ne se relit pas.
 * `construireContenuPaires` ci-dessous AGRÈGE cette même information, nœud par nœud, dans un fichier de
 * quelques dizaines à ~200 lignes : quel intitulé co-apparaît avec quel autre, et sur combien de profils.
 * CHIFFRES RÉELS (vérifiés à l'écriture, DEUX chemins de code indépendants — `evaluateNode` direct ET
 * `construireVueDecision`, cf. « Si bloqué » de T-160) sur les `NB_PROFILS_FIGES` = 180 profils du banc,
 * PLUS PRÉCIS que l'estimation à main levée de la tâche (qui parlait de 9/1 profils et de « ~210 » paires
 * pour `prescription`) : 116 paires distinctes pour `prescription`, dont 39 profils affichent un intitulé
 * en double (33× « Sulfamide », 6× « Glinide » — pas 9/1). Toujours le MÊME ordre de grandeur (centaines
 * pour les nœuds riches, dizaines pour `insuline`/les RHD, zéro pour les nœuds à sortie unique) : aucun
 * signal d'extraction fausse (cf. T-160 étape 5) — l'estimation de tâche était juste imprécise.
 *
 * CE FICHIER NE JUGE RIEN (même posture que `caracterisation.test.ts`, et pour la même raison) : il
 * FIGE l'existant. UN DIFF ICI N'EST PAS UNE RÉGRESSION EN SOI — une paire nouvelle signifie que deux
 * cartes s'affichent désormais ensemble pour au moins un profil du banc ; c'est un fait à RELIRE carte
 * par carte (référent clinique), jamais un échec à corriger en modifiant le moteur pour que l'ancien
 * texte revienne, et jamais accepté à l'aveugle par une régénération automatique (même convention que
 * `caracterisation.test.ts`, cf. sa docstring de tête).
 *
 * SECTION « PAIRES INTRA-FAMILLE » (T-160 étape 4) : parmi les paires ci-dessus, celles dont les deux
 * cartes appartiennent à la même `Famille` de contenu (`Option.famille`, `Noeud.familles`). Si cette
 * famille est déclarée `exclusive` (alternatives, une seule à retenir), la voir apparaître ici est le
 * signal qu'une alternative est présentée comme cumulable pour au moins un profil — c'est exactement le
 * défaut ③ que cette section rend visible.
 *
 * ÉCHANTILLON : les MÊMES profils FIGÉS que `caracterisation.test.ts` (`fixtureProfils.ts`,
 * `NB_PROFILS_FIGES` = 180, profil #0 = VIERGE) — pas un nouveau tirage. C'est l'échantillon sur lequel
 * le diagnostic du 2026-08-06 a été fait à la main sur les deux gros snapshots ; le réutiliser ici rend
 * les deux comparables et évite d'introduire une seconde source d'instabilité en index (cf. la
 * justification de conception complète en tête de `fixtureProfils.ts`).
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5 / DECISIONS.md D8) : itère sur `noeuds`, aucun id de nœud ni nom
 * d'intitulé codé en dur — un futur domaine obtient son inventaire de paires sans modification de ce
 * fichier.
 *
 * ---------------------------------------------------------------------------------------------------
 * T-161 — DEUX CARTES APPLICABLES NE PORTENT JAMAIS LE MÊME INTITULÉ, ci-dessous (après les snapshots).
 *
 * `prescription` comptait, au 2026-08-06 (diagnostic initial de T-161), 7 intitulés DUPLIQUÉS dans son
 * contenu (Sulfamide ×3, Metformine / iSGLT2 / AR GLP-1 / Tirzépatide / Gliptine / Glinide ×2) —
 * LÉGITIME tant que deux homonymes ne s'affichent jamais ENSEMBLE pour un même patient : le nœud sait
 * déjà désambiguïser par le libellé (« Metformine (DFG < 30) », « Metformine (désintensification) »).
 * Le diagnostic du 2026-08-06 avait montré que cette condition NE TENAIT PAS pour deux de ces sept noms :
 * 39 profils du banc affichaient un intitulé en double parmi leurs cartes applicables — 33 avec deux
 * cartes « Sulfamide », 6 avec deux cartes « Glinide » (chiffre vérifié par DEUX chemins de calcul
 * indépendants, cf. « Si bloqué » ci-dessous : ce n'était pas un artefact d'extraction).
 *
 * RÉSORBÉ le 2026-08-06 (P14/S6, T-169) — PAS par ce test, par le CONTENU. T-169 a retitré les quatre
 * cartes concernées (« Sulfamide — remplacer par un agent à bénéfice démontré », « Sulfamide — réduire
 * la posologie », et les deux équivalents glinide) pour un motif CLINIQUE propre (rendre l'action
 * lisible dans le titre, décision référent) — la désambiguïsation d'intitulé est un effet de bord de ce
 * retitrage, pas son objet. Conséquence mécanique, mesurée après coup : les 39 profils en double
 * disparaissent, et AUCUN autre nœud ni AUCUNE autre paire de noms dupliqués (Metformine / iSGLT2 /
 * AR GLP-1 / Tirzépatide / Gliptine, ni sur `prescription` ni sur les autres nœuds) n'en produit — le
 * test tourne désormais réellement à zéro violation, sur tout le banc. L'invariant est donc VERT en
 * écriture normale (`it`, plus `it.fails`) : le maintenir en `it.fails` ferait ÉCHOUER la suite
 * (« Expect test to fail », constaté), puisqu'il ne peut plus mordre sur rien. Les cinq autres noms
 * dupliqués (Metformine/iSGLT2/AR GLP-1/Tirzépatide/Gliptine) restent des DOUBLONS DE FICHIER — hors
 * périmètre de T-169 (P14/S6 · « Hors périmètre » : « ne pas renommer les intitulés dupliqués hors
 * sulfamide/glinide… c'est S8/T-171 ») — mais ils ne co-apparaissent sur AUCUN profil du banc à ce jour ;
 * si une future modification de contenu les fait un jour co-apparaître, cet invariant (désormais actif
 * en continu, plus seulement à l'écriture) le détectera immédiatement, sans attendre T-171.
 *
 * Le second test ci-dessous ne porte sur AUCUN contenu réel : il PROUVE que l'invariant mord (patron
 * I20/I24, `libelles.test.ts` / `invariants-contenu.test.ts`), sur un nœud fabriqué, indépendamment de
 * l'état du contenu — inchangé par la résorption ci-dessus.
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import type { Noeud, Option } from '../../content/node.types.ts'
import type { Criteria } from '../conditions.ts'
import { calculerCriteresDerives } from '../deriveCritere.ts'
import { evaluateNode } from '../evaluateNode.ts'
import { buildDefaultCriteria } from '../../lib/formLayout.ts'
import { NB_PROFILS_FIGES, profilsFigesPourNoeud } from './fixtureProfils.ts'

/**
 * Les `NB_PROFILS_FIGES` profils du banc pour un nœud (profil #0 = VIERGE, `buildDefaultCriteria`, PUIS
 * dérivé — `evaluateNode` attend des critères DÉJÀ dérivés, `construireVueDecision` le fait pour
 * l'écran, on le refait ICI puisqu'on appelle `evaluateNode` directement, cf. « Si bloqué » de T-160).
 * Les `NB_PROFILS_FIGES - 1` suivants viennent de `profilsFigesPourNoeud`, qui dérive déjà en interne.
 * MÊME construction que `NB_PROFILS_CARACTERISATION` profils de `caracterisation.test.ts` (cf. tête de
 * fichier : même échantillon, à dessein).
 */
function profilsDuBanc(node: Noeud): Criteria[] {
  const vierge = calculerCriteresDerives(node.criteres_entree, buildDefaultCriteria(node.criteres_entree))
  return [vierge, ...profilsFigesPourNoeud(node, NB_PROFILS_FIGES - 1)]
}

/** Options APPLICABLES d'un nœud pour un profil (jamais `excluded`/`nonRetenues`/`enAttente`, T-160
 * étape 1) — appel direct à `evaluateNode` (pas `construireVueDecision` : ce banc n'a besoin ni des
 * badges, ni des familles déjà groupées, ni d'aucun autre calcul de présentation). */
function optionsApplicables(node: Noeud, criteria: Criteria): Option[] {
  return evaluateNode(node, criteria).applicable
}

// =======================================================================================================
// T-160 — inventaire figé des paires de cartes co-actives
// =======================================================================================================

/** Une paire non ordonnée {a, b} d'intitulés co-actifs (a < b, ordre lexicographique brut — PAS
 * `localeCompare`, dont le classement des caractères accentués dépend des données ICU disponibles sur
 * la machine d'exécution : un ordre non garanti identique d'un poste à l'autre romprait le déterminisme
 * byte-à-byte du snapshot, cf. tête de fichier de `caracterisation.test.ts`). */
interface EntreePaire {
  a: string
  b: string
  /** Nombre de profils du banc où `a` et `b` sont co-actifs (au moins une carte de chaque intitulé,
   * toutes deux `applicable`, pour ce même profil). */
  count: number
  /** Famille commune si, pour AU MOINS UN des profils comptés, une carte `a` et une carte `b`
   * appartiennent à la MÊME `Option.famille` — `undefined` sinon (T-160 étape 4). */
  familleCommune?: string
}

/** Agrège les paires co-actives d'un nœud sur `profilsDuBanc(node)` (T-160 étapes 1-2). Une SEULE
 * entrée par intitulé distinct côté agrégation (deux cartes de même intitulé toutes deux applicables —
 * la situation que T-161 met sous test — ne forment pas une « paire » : une paire relie deux intitulés
 * DIFFÉRENTS) ; la famille d'une carte s'obtient sur un exemplaire quelconque partageant cet intitulé
 * dans ce profil, ce que documente `parIntitule` ci-dessous. */
function agregerPaires(node: Noeud): EntreePaire[] {
  const paires = new Map<string, EntreePaire>()
  for (const criteria of profilsDuBanc(node)) {
    const parIntitule = new Map<string, Option>()
    for (const option of optionsApplicables(node, criteria)) {
      if (!parIntitule.has(option.intitule)) parIntitule.set(option.intitule, option)
    }
    const intitules = [...parIntitule.keys()].sort()
    for (let i = 0; i < intitules.length; i++) {
      for (let j = i + 1; j < intitules.length; j++) {
        const a = intitules[i]
        const b = intitules[j]
        const cle = JSON.stringify([a, b])
        const entree = paires.get(cle) ?? { a, b, count: 0 }
        entree.count += 1
        const optA = parIntitule.get(a)!
        const optB = parIntitule.get(b)!
        if (optA.famille !== undefined && optA.famille === optB.famille) entree.familleCommune = optA.famille
        paires.set(cle, entree)
      }
    }
  }
  return [...paires.values()].sort((x, y) => (x.a === y.a ? (x.b < y.b ? -1 : 1) : x.a < y.a ? -1 : 1))
}

/** Ligne de snapshot d'une paire : `nb×  A  ⟷  B` (T-160 étape 3). */
function formatPaire(entree: EntreePaire): string {
  return `${entree.count}×  ${entree.a}  ⟷  ${entree.b}`
}

/** Construit le contenu texte complet du snapshot de paires d'un nœud : en-tête (mode d'emploi), section
 * « Paires », section « Paires intra-famille » (T-160 étapes 3-4). */
function construireContenuPaires(node: Noeud): string {
  const profils = profilsDuBanc(node)
  const paires = agregerPaires(node)
  const intraFamille = paires.filter((p) => p.familleCommune !== undefined)

  const lignes: string[] = [
    `# PAIRES DE CARTES CO-ACTIVES (cliquet) — nœud « ${node.id} » (${node.titre})`,
    '#',
    "# Un diff ICI n'est PAS une régression en soi : il doit être RELU, carte par carte — même",
    "# convention que caracterisation.test.ts (cf. sa docstring de tête). Une paire nouvelle signifie",
    "# que deux cartes s'affichent désormais ensemble pour au moins un profil du banc, jamais un échec",
    '# à corriger en modifiant le moteur pour que l’ancien texte revienne.',
    '#',
    `# ${profils.length} profils évalués, ${paires.length} paire(s) distincte(s).`,
    '',
    '## Paires (triées par intitulé)',
    '',
  ]

  if (paires.length === 0) {
    lignes.push('(aucune paire — au plus une carte applicable par profil sur tout le banc)')
  } else {
    for (const paire of paires) lignes.push(formatPaire(paire))
  }

  lignes.push(
    '',
    '## Paires intra-famille',
    '#',
    '# Les deux cartes de la paire appartiennent à la MÊME famille de contenu (Option.famille /',
    '# Noeud.familles). Une famille EXCLUSIVE (alternatives) qui apparaît ici est le signal qu’une',
    '# alternative est présentée comme cumulable pour au moins un profil (défaut ③, cf. tête de fichier).',
    '',
  )
  if (intraFamille.length === 0) {
    lignes.push('(aucune paire intra-famille)')
  } else {
    for (const paire of intraFamille) {
      const famille = node.familles?.find((f) => f.libelle === paire.familleCommune)
      const nature = famille === undefined ? 'famille non déclarée au nœud ?!' : famille.exclusive ? 'EXCLUSIVE' : 'cumulable'
      lignes.push(`${paire.count}×  [famille « ${paire.familleCommune} » — ${nature}]  ${paire.a}  ⟷  ${paire.b}`)
    }
  }

  return `${lignes.join('\n')}\n`
}

describe.each(noeuds.map((node) => [node.id, node] as const))(
  'banc — paires de cartes co-actives (cliquet) · nœud %s',
  (_id, node) => {
    it(
      `snapshot __snapshots__/paires.${node.id}.txt (diff à RELIRE carte par carte, jamais accepté à l’aveugle)`,
      async () => {
        const contenu = construireContenuPaires(node)
        await expect(contenu).toMatchFileSnapshot(`./__snapshots__/paires.${node.id}.txt`)
      },
    )
  },
)

// =======================================================================================================
// T-161 — deux cartes applicables ne portent jamais le même intitulé
// =======================================================================================================

/** Violations de l'invariant T-161 pour UN nœud et UN profil : une entrée par intitulé partagé par ≥ 2
 * options APPLICABLES simultanément, avec les FAMILLES des cartes concernées (c'est la famille qui
 * permet de comprendre pourquoi elles coexistent, cf. étape 2 de la tâche). Fonction pure, réutilisée
 * par le test réel ci-dessous ET par la preuve qui le suit (patron I20/I24 : un seul calcul, deux
 * usages — le second n'exerçant la règle que sur un nœud fabriqué, indépendant du contenu). */
function violationsIntitulesDupliques(node: Noeud, criteria: Criteria, indexProfil: number): string[] {
  const parIntitule = new Map<string, Option[]>()
  for (const option of optionsApplicables(node, criteria)) {
    const memes = parIntitule.get(option.intitule) ?? []
    memes.push(option)
    parIntitule.set(option.intitule, memes)
  }
  const violations: string[] = []
  for (const [intitule, memes] of parIntitule) {
    if (memes.length <= 1) continue
    const familles = memes.map((o) => o.famille ?? '(sans famille)').join(' / ')
    violations.push(
      `nœud "${node.id}", profil #${indexProfil} : ${memes.length} cartes intitulées "${intitule}" sont ` +
        `applicables simultanément (familles : ${familles}).`,
    )
  }
  return violations
}

describe('T-161 — deux cartes applicables ne portent jamais le même intitulé', () => {
  // VERT depuis le 2026-08-06 (P14/S6, T-169 — cf. docstring de tête pour l'historique complet et le
  // pourquoi de la bascule `it.fails` → `it`) : `prescription` affichait auparavant deux cartes
  // « Sulfamide » sur 33 profils du banc, deux cartes « Glinide » sur 6 profils (39 au total). Le
  // retitrage de T-169 a résorbé ces deux noms ; les cinq autres noms dupliqués du nœud (hors périmètre
  // de T-169, cf. `plans/P14/S8.md` T-171) ne co-apparaissent sur aucun profil du banc, et l'invariant
  // les surveille désormais en continu plutôt que de rester dispensé jusqu'à T-171.
  it(
    'aucun nœud, sur aucun profil figé du banc, n’a deux options de même intitulé applicables simultanément',
    () => {
      const violations: string[] = []
      for (const node of noeuds) {
        profilsDuBanc(node).forEach((criteria, indexProfil) => {
          violations.push(...violationsIntitulesDupliques(node, criteria, indexProfil))
        })
      }
      expect(violations).toEqual([])
    },
  )

  it('mord sur deux options fabriquées de même intitulé toutes deux applicables, laisse passer une fois renommée (preuve que l’invariant sert)', () => {
    const option: Option = {
      intitule: 'Option synthétique T-161',
      role: 'socle',
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
      conditions: ['toujours'],
    }
    const noeudFabrique: Noeud = {
      id: 'noeud-test-t161',
      domaine: 'test',
      titre: 'Nœud de test T-161',
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [],
      options: [option, { ...option }],
      argumentaire: 'x',
      sources: {
        references_primaires: [],
        synthese_critique: { donnee: '' },
        reco_officielle: { source: '', position: '', divergence: false, explication: '' },
      },
      incertitudes: [],
      veille_liee: [],
      meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide', version: '1.0', changelog: [] },
    }

    // Mord : les deux options fabriquées, même intitulé, toutes deux applicables (`["toujours"]`).
    expect(violationsIntitulesDupliques(noeudFabrique, {}, 0)).toHaveLength(1)

    // Laisse passer : la seconde renommée (désambiguïsation), plus rien à signaler.
    const noeudRenomme: Noeud = {
      ...noeudFabrique,
      options: [option, { ...option, intitule: 'Option synthétique T-161 (bis)' }],
    }
    expect(violationsIntitulesDupliques(noeudRenomme, {}, 0)).toEqual([])
  })
})
