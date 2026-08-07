/**
 * Banc d'un nœud — TABLE DES CONDITIONS, RÉGÉNÉRÉE MÉCANIQUEMENT (T-193, P14/S12).
 *
 * CE QUE C'EST — et surtout ce que ce n'est pas. Ce fichier LIT le contenu d'un nœud et le rend sous
 * forme de table, une ligne par option : `role`, `famille` (avec son `exclusive` résolu), rang,
 * `conditions`, `prerequis`, `exclusions`. C'est une **lecture de contenu**, jamais une évaluation :
 * `evaluateNode` / `resolvePriorite` ne sont PAS appelés ici, aucun patient — réel ou imaginaire —
 * n'est construit, et un rang conditionnel (D14) est rendu **tel qu'écrit** (`quand → rang`, dans
 * l'ordre du contenu), jamais résolu. Une table des conditions qui évalue est une table qui ment sur sa
 * propre nature : elle n'est plus une lecture, c'est une exécution partielle (cf. « Si bloqué » de
 * T-193).
 *
 * POURQUOI ELLE EXISTE. La table du 2026-08-06 (`docs/decision/validation/table-conditions-2026-08-06.md`)
 * a trouvé neuf défauts qu'aucune vignette, aucun invariant et aucune recette n'avaient vus — parce
 * qu'elle est le seul artefact du procédé dont l'unité soit la RELATION entre cartes. Elle avait été
 * extraite **à la main** (cinq agents lisant chacun un YAML, cf. `plans/P14/S3.md` § « Méthode de
 * production ») : ça a fonctionné une fois, pour un diagnostic ponctuel sur 6 nœuds déjà écrits, mais
 * `docs/decision/CONSTRUIRE-UN-MODULE.md` exige désormais cette régénération à CHAQUE clôture de nœud
 * (porte de sortie P6), pour tout domaine à venir. Une porte de sortie qu'aucun humain ne peut faire
 * tourner ne vérifie rien — d'où cet outil, écrit AVANT la procédure qui le référence.
 *
 * PAS UNE NOUVELLE CONVENTION. Les seuils d'abréviation ci-dessous reproduisent EXACTEMENT ceux que S3
 * a posés et documentés (`table-conditions-2026-08-06.md` § 1 « Convention d'abréviation ») : diverger
 * romprait la continuité entre le diagnostic déjà relu par le référent et les tables futures. Ils sont
 * répétés ici, en code, parce qu'un seuil qui ne vit que dans un markdown daté n'est pas reproductible.
 *
 * UN DIFF ICI N'EST PAS UNE RÉGRESSION EN SOI (même convention que `caracterisation.test.ts` et
 * `paires.test.ts`, et pour la même raison) : ce fichier FIGE l'existant. Un rôle changé, une famille
 * reclassée, une condition apparue ou disparue est un FAIT À RELIRE — contre le brouillon de table
 * rédigé en P5, avant la première ligne de YAML (`CONSTRUIRE-UN-MODULE.md` P5/P6). Toute divergence non
 * expliquée bloque la clôture du nœud ; aucune n'est acceptée à l'aveugle par une régénération
 * automatique.
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5 / DECISIONS.md D8) : itère sur `noeuds`, aucun id de nœud, aucun nom
 * de critère, aucun libellé de famille codé en dur — un futur domaine obtient ses tables sans modifier
 * ce fichier.
 *
 * FORMAT DE SORTIE : du Markdown, dans un fichier `.txt`, mêmes colonnes que le document de S3. C'est
 * délibéré — la sortie se colle telle quelle dans le dossier de preuve du nœud
 * (`docs/decision/noeuds/<nœud>.md`) pour être diffée contre le brouillon de P5, qui est lui-même une
 * table Markdown.
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import type { Noeud, Option } from '../../content/node.types.ts'

// =======================================================================================================
// Convention d'abréviation — REPRISE À L'IDENTIQUE de `table-conditions-2026-08-06.md` § 1 (S3/T-166)
// =======================================================================================================

/**
 * 1. Toute expression individuelle dépassant **100 caractères** est extraite en bloc nommé sous la table
 *    de son nœud, quel que soit son nombre d'occurrences — jamais tronquée dans une cellule (au-delà
 *    d'une certaine longueur, une cellule qui tronque une expression MENT).
 */
const SEUIL_BLOC_LONG = 100

/**
 * 2. Toute expression de **40 à 100 caractères** répétée à l'identique (caractère pour caractère, tous
 *    champs confondus) dans **au moins 3 options** du même nœud reçoit elle aussi un bloc nommé, pour
 *    éviter de la recopier inutilement de nombreuses fois.
 */
const SEUIL_BLOC_REPETE = 40
const OCCURRENCES_MIN_BLOC_REPETE = 3

// 3. En deçà de 40 caractères, ou répétée dans moins de 3 options : recopiée en clair dans chaque
//    cellule — un atome court comme `DFG < 30` se lit mieux tel quel qu'à travers un renvoi.

/** Les trois champs d'une option qui partagent la grammaire DSL, dans l'ordre des colonnes de la table. */
const CANAUX = ['conditions', 'prerequis', 'exclusions'] as const
type Canal = (typeof CANAUX)[number]

/** Les expressions d'un canal pour une option — `undefined` = champ absent, distinct d'un `[]` déclaré. */
function expressionsDuCanal(option: Option, canal: Canal): string[] | undefined {
  return option[canal]
}

// =======================================================================================================
// Blocs nommés
// =======================================================================================================

interface BlocNomme {
  /** Étiquette rendue dans les cellules, ex. `PRE-1` (règle 1) ou `PRE-R1` (règle 2). */
  label: string
  expression: string
  /** Longueur en caractères — reproduite dans la liste des blocs, comme dans le document de S3. */
  longueur: number
  /** Index (1-based) des options où l'expression apparaît, triés. */
  options: number[]
  /** Canaux où l'expression apparaît, dans l'ordre des colonnes. */
  canaux: Canal[]
}

/**
 * Préfixe d'étiquette d'un nœud, dérivé de son `id` — DÉTERMINISTE et sans table de correspondance
 * (aucun id en dur) : trois premières lettres du premier segment, puis l'initiale de chaque segment
 * suivant (`insuline` → `INS`, `prescription` → `PRE`, `rhd-activite-physique` → `RHDAP`).
 * Les étiquettes du document de S3 ont été choisies à la main et peuvent donc différer d'un caractère —
 * c'est de la MISE EN FORME, explicitement hors du champ du contrôle de fidélité de T-193 (« rôles,
 * rangs, conditions — pas nécessairement la mise en forme »).
 */
function prefixeBlocs(id: string): string {
  const segments = id.split('-').filter((s) => s.length > 0)
  const tete = (segments[0] ?? id).slice(0, 3)
  const suite = segments.slice(1).map((s) => s.slice(0, 1)).join('')
  return `${tete}${suite}`.toUpperCase()
}

/** Une occurrence d'expression, dans l'ordre de lecture de la table (option, puis canal, puis item). */
interface Occurrence {
  expression: string
  /** Index 1-based de l'option, comme la colonne `#` de la table. */
  option: number
  canal: Canal
}

/** Toutes les occurrences d'expressions d'un nœud, dans l'ordre exact où la table les rend. */
function occurrencesDuNoeud(node: Noeud): Occurrence[] {
  const occurrences: Occurrence[] = []
  node.options.forEach((option, index) => {
    for (const canal of CANAUX) {
      for (const expression of expressionsDuCanal(option, canal) ?? []) {
        occurrences.push({ expression, option: index + 1, canal })
      }
    }
  })
  return occurrences
}

/**
 * Décide quelles expressions reçoivent un bloc nommé et leur attribue une étiquette, dans l'ordre de
 * PREMIÈRE APPARITION dans la table (même ordre que le document de S3). Deux séries de numéros, pour
 * que l'étiquette dise quelle règle l'a produite : `-N` pour la règle 1 (expression longue), `-RN` pour
 * la règle 2 (expression moyenne répétée).
 */
function blocsNommes(node: Noeud): Map<string, BlocNomme> {
  const occurrences = occurrencesDuNoeud(node)

  const optionsParExpression = new Map<string, Set<number>>()
  const canauxParExpression = new Map<string, Canal[]>()
  for (const { expression, option, canal } of occurrences) {
    const options = optionsParExpression.get(expression) ?? new Set<number>()
    options.add(option)
    optionsParExpression.set(expression, options)
    const canaux = canauxParExpression.get(expression) ?? []
    if (!canaux.includes(canal)) canaux.push(canal)
    canauxParExpression.set(expression, canaux)
  }

  const prefixe = prefixeBlocs(node.id)
  const blocs = new Map<string, BlocNomme>()
  let compteurLong = 0
  let compteurRepete = 0

  for (const { expression } of occurrences) {
    if (blocs.has(expression)) continue
    const longueur = expression.length
    const nbOptions = optionsParExpression.get(expression)!.size
    const estLong = longueur > SEUIL_BLOC_LONG
    const estRepete =
      longueur >= SEUIL_BLOC_REPETE && longueur <= SEUIL_BLOC_LONG && nbOptions >= OCCURRENCES_MIN_BLOC_REPETE
    if (!estLong && !estRepete) continue
    const label = estLong ? `${prefixe}-${++compteurLong}` : `${prefixe}-R${++compteurRepete}`
    blocs.set(expression, {
      label,
      expression,
      longueur,
      options: [...optionsParExpression.get(expression)!].sort((a, b) => a - b),
      canaux: canauxParExpression.get(expression)!,
    })
  }

  return blocs
}

// =======================================================================================================
// Rendu
// =======================================================================================================

/** Neutralise ce qui casserait une cellule Markdown (le DSL n'emploie ni `|` ni saut de ligne, mais un
 * `intitule` rédigé peut porter un `|`). */
function cellule(texte: string): string {
  return texte.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
}

/** Une cellule de canal : une ligne par item du tableau YAML (ET implicite entre les lignes). */
function rendreCanal(option: Option, canal: Canal, blocs: Map<string, BlocNomme>): string {
  const expressions = expressionsDuCanal(option, canal)
  if (expressions === undefined) return '—'
  if (expressions.length === 0) return '*(déclaré vide — liste inerte)*'
  return expressions
    .map((expression) => {
      const bloc = blocs.get(expression)
      return bloc === undefined ? `\`${cellule(expression)}\`` : `**[${bloc.label}]**`
    })
    .join('<br>')
}

/**
 * La colonne « rang ». `priorite` est **ignorée par le moteur** en `ordered-first-match` : c'est alors
 * l'ordre du tableau (colonne `#`) qui fait foi, et la cellule le dit. Un rang conditionnel (D14) est
 * rendu RÈGLE PAR RÈGLE, dans l'ordre du contenu — jamais résolu.
 */
function rendreRang(node: Noeud, option: Option): string {
  if (node.selection === 'ordered-first-match') return '*ignoré (OFM)*'
  const priorite = option.priorite
  if (priorite === undefined) return 'non déclaré'
  if (typeof priorite === 'number') return String(priorite)
  return priorite.map((regle) => `\`${cellule(regle.quand)}\` → ${regle.rang}`).join('<br>')
}

/** La colonne « famille » : le libellé porté par l'option, croisé avec `Noeud.familles[]`. */
function rendreFamille(node: Noeud, option: Option): string {
  if (option.famille === undefined) return '—'
  const famille = node.familles?.find((f) => f.libelle === option.famille)
  const nature =
    famille === undefined ? '**famille non déclarée au nœud**' : famille.exclusive ? '**excl.**' : 'cumul.'
  return `${cellule(option.famille)} (${nature})`
}

/** Construit le contenu texte complet de la table des conditions d'un nœud. */
function construireContenuTable(node: Noeud): string {
  const blocs = blocsNommes(node)
  const selection = node.selection ?? 'multi-options'

  const lignes: string[] = [
    `# TABLE DES CONDITIONS (régénérée mécaniquement) — nœud « ${node.id} » (${node.titre})`,
    '#',
    '# LECTURE DE CONTENU, JAMAIS UNE ÉVALUATION : aucun patient construit, `evaluateNode` jamais appelé,',
    '# rang conditionnel (D14) rendu TEL QU’ÉCRIT. Produit par `engine/banc/tableConditions.test.ts`',
    '# (T-193, P14/S12), convention d’abréviation identique à celle de S3',
    '# (`docs/decision/validation/table-conditions-2026-08-06.md` § 1) :',
    `#   · expression de plus de ${SEUIL_BLOC_LONG} caractères → bloc nommé, quel que soit son nombre d’occurrences ;`,
    `#   · expression de ${SEUIL_BLOC_REPETE} à ${SEUIL_BLOC_LONG} caractères répétée à l’identique dans au moins`,
    `#     ${OCCURRENCES_MIN_BLOC_REPETE} options du même nœud → bloc nommé ;`,
    '#   · en deçà, ou moins répétée → recopiée en clair dans chaque cellule.',
    '#',
    '# UN DIFF ICI N’EST PAS UNE RÉGRESSION EN SOI : il se relit contre le brouillon de table rédigé en P5',
    '# (`docs/decision/CONSTRUIRE-UN-MODULE.md`). Toute divergence non expliquée bloque la clôture du nœud.',
    '',
    `\`selection: ${selection}\` · ${node.options.length} option(s) · ${node.familles?.length ?? 0} famille(s) déclarée(s).`,
    '',
  ]

  if (node.familles !== undefined && node.familles.length > 0) {
    lignes.push(
      '## Familles (ordre déclaré = ordre d’affichage des sections)',
      '',
      '| Ordre | libellé | exclusive | prioritaire_si |',
      '| --- | --- | --- | --- |',
    )
    node.familles.forEach((famille, index) => {
      const nature = famille.exclusive ? '**excl.**' : 'cumul.'
      const prioritaire = famille.prioritaire_si === undefined ? '—' : `\`${cellule(famille.prioritaire_si)}\``
      lignes.push(`| ${index + 1} | ${cellule(famille.libelle)} | ${nature} | ${prioritaire} |`)
    })
    lignes.push('')
  }

  lignes.push(
    '## Options',
    '',
    '| # | intitulé | role | famille | rang | conditions | prerequis | exclusions |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
  )
  node.options.forEach((option, index) => {
    lignes.push(
      `| ${index + 1} | ${cellule(option.intitule)} | ${option.role} | ${rendreFamille(node, option)} | ` +
        `${rendreRang(node, option)} | ${rendreCanal(option, 'conditions', blocs)} | ` +
        `${rendreCanal(option, 'prerequis', blocs)} | ${rendreCanal(option, 'exclusions', blocs)} |`,
    )
  })
  lignes.push('')

  lignes.push('## Expressions nommées', '')
  if (blocs.size === 0) {
    lignes.push(
      `(aucune — aucune expression de plus de ${SEUIL_BLOC_LONG} caractères, aucune expression de ` +
        `${SEUIL_BLOC_REPETE} à ${SEUIL_BLOC_LONG} caractères répétée dans ${OCCURRENCES_MIN_BLOC_REPETE} ` +
        `options ou plus)`,
    )
  } else {
    for (const bloc of blocs.values()) {
      const options = bloc.options.length === 1 ? `option ${bloc.options[0]}` : `options ${bloc.options.join(', ')}`
      lignes.push(
        `- **[${bloc.label}]** (${bloc.longueur} car., ${options}, ${bloc.canaux.join('/')}) : ` +
          `\`${cellule(bloc.expression)}\``,
      )
    }
  }

  return `${lignes.join('\n')}\n`
}

describe.each(noeuds.map((node) => [node.id, node] as const))(
  'banc — table des conditions (régénération mécanique) · nœud %s',
  (_id, node) => {
    it(
      `snapshot __snapshots__/table-conditions.${node.id}.txt (à diffèrer contre le brouillon de P5, jamais accepté à l’aveugle)`,
      async () => {
        const contenu = construireContenuTable(node)
        await expect(contenu).toMatchFileSnapshot(`./__snapshots__/table-conditions.${node.id}.txt`)
      },
    )
  },
)

// =======================================================================================================
// L'extracteur ne s'appuie sur AUCUN id de nœud : preuve sur un nœud fabriqué (patron I20/I24)
// =======================================================================================================

describe('T-193 — l’extracteur est générique et n’évalue rien', () => {
  const optionSocle: Option = {
    intitule: 'Option socle synthétique',
    role: 'socle',
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
    conditions: ['toujours'],
    famille: 'Famille alternative',
    priorite: [
      { quand: 'critere_a == true', rang: 1 },
      { quand: 'default', rang: 9 },
    ],
  }
  const noeudFabrique: Noeud = {
    id: 'noeud-test-t193',
    domaine: 'test',
    titre: 'Nœud de test T-193',
    population_cible: 'test',
    selection: 'multi-options',
    criteres_entree: [],
    familles: [{ libelle: 'Famille alternative', exclusive: true }],
    options: [optionSocle],
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

  it('rend un rang conditionnel TEL QU’ÉCRIT, sans jamais le résoudre contre un patient', () => {
    const contenu = construireContenuTable(noeudFabrique)
    expect(contenu).toContain('`critere_a == true` → 1')
    expect(contenu).toContain('`default` → 9')
    // Un rang résolu serait un nombre seul dans la cellule : la preuve que rien n'a été évalué.
    expect(contenu).not.toContain('| 1 | Option socle synthétique | socle | Famille alternative (**excl.**) | 1 |')
  })

  it('résout `exclusive` depuis `Noeud.familles`, et signale une famille non déclarée plutôt que de la taire', () => {
    expect(construireContenuTable(noeudFabrique)).toContain('Famille alternative (**excl.**)')
    const orphelin: Noeud = {
      ...noeudFabrique,
      familles: undefined,
      options: [{ ...optionSocle, famille: 'Famille jamais déclarée' }],
    }
    expect(construireContenuTable(orphelin)).toContain('Famille jamais déclarée (**famille non déclarée au nœud**)')
  })

  it('applique les deux seuils d’abréviation de S3 : > 100 caractères, ou 40-100 répétée dans ≥ 3 options', () => {
    const longue = `critere_tres_long_${'x'.repeat(SEUIL_BLOC_LONG)} == true`
    const moyenne = `critere_moyen_${'y'.repeat(SEUIL_BLOC_REPETE)} == true`
    const courte = 'DFG < 30'
    expect(longue.length).toBeGreaterThan(SEUIL_BLOC_LONG)
    expect(moyenne.length).toBeGreaterThanOrEqual(SEUIL_BLOC_REPETE)
    expect(moyenne.length).toBeLessThanOrEqual(SEUIL_BLOC_LONG)

    // Deux options seulement portent la moyenne : sous le seuil de 3, elle reste en clair.
    const deuxOptions: Noeud = {
      ...noeudFabrique,
      options: [
        { ...optionSocle, conditions: [longue, moyenne, courte] },
        { ...optionSocle, conditions: [moyenne, courte] },
      ],
    }
    const contenuDeux = construireContenuTable(deuxOptions)
    expect(contenuDeux).toContain('**[NOETT-1]**') // la longue, règle 1
    expect(contenuDeux).not.toContain('**[NOETT-R1]**')
    expect(contenuDeux).toContain(`\`${moyenne}\``)
    expect(contenuDeux).toContain('`DFG < 30`')

    // Une troisième option portant la même expression moyenne déclenche la règle 2.
    const troisOptions: Noeud = {
      ...deuxOptions,
      options: [...deuxOptions.options, { ...optionSocle, conditions: [moyenne] }],
    }
    const contenuTrois = construireContenuTable(troisOptions)
    expect(contenuTrois).toContain('**[NOETT-R1]**')
    // Plus recopiée dans AUCUNE cellule : elle ne subsiste en clair que dans la liste des blocs nommés.
    const lignesOptions = contenuTrois.split('\n').filter((l) => /^\| \d+ \|/.test(l))
    expect(lignesOptions.some((l) => l.includes(moyenne))).toBe(false)
    expect(contenuTrois).toContain(`\`${moyenne}\``) // conservée intégralement sous la table
    expect(contenuTrois).toContain('`DFG < 30`') // la courte reste en clair, quel qu'en soit le nombre
  })

  it('distingue un champ ABSENT d’une liste déclarée VIDE (une exclusion inerte se voit)', () => {
    const contenuAbsent = construireContenuTable(noeudFabrique)
    expect(contenuAbsent).toContain('| — | — |') // prerequis et exclusions absents
    const videDeclare: Noeud = { ...noeudFabrique, options: [{ ...optionSocle, exclusions: [] }] }
    expect(construireContenuTable(videDeclare)).toContain('*(déclaré vide — liste inerte)*')
  })
})
