/**
 * Banc d'un nœud — COUCHE 3 « invariants », lot GRAMMAIRE (chantier 2026-07-27, cause racine S1 du
 * `PLAN-CORRECTION.md`). Ces invariants ne portent pas sur le CONTENU clinique mais sur les
 * **instruments** qui le mesurent : ils vérifient que le banc et le moteur de pertinence voient bien
 * tout ce que le schéma autorise à écrire.
 *
 * POURQUOI CE FICHIER EXISTE — le défaut qu'il rend impossible.
 *
 * La question « où, dans un nœud, une expression DSL peut-elle vivre ? » était recopiée à trois
 * endroits, et les trois copies divergeaient. Deux fonctions HOMONYMES (`reglesDuNoeud`), dans
 * `engine/relevance.ts` et `engine/banc/profils.ts`, avaient des corps différents ; **aucune des deux**
 * ne lisait `option.alertes[].quand`. Conséquence mécanique : un seuil numérique vivant uniquement dans
 * une alerte d'option n'entrait dans le domaine de tirage d'aucun des deux moteurs — le critère n'était
 * jamais engendré à cette valeur, jamais perturbé à cette valeur. Trois défauts du 2026-07-27 en
 * découlent, dont un trou de sécurité figé **en vert** dans 11 profils du golden master.
 *
 * Ce qui a rendu ça possible n'est pas l'étourderie d'un contributeur : c'est qu'aucun mécanisme ne
 * reliait le SCHÉMA (ce qu'on a le droit d'écrire) au CODE (ce qui est lu). Les trois invariants
 * ci-dessous ferment cette boucle, et c'est leur seule raison d'être :
 *
 *  - **G1** — toute propriété du schéma est CLASSÉE dans `CHAMPS_DU_SCHEMA` (`engine/expressionsNoeud.ts`).
 *    Un champ ajouté au schéma sans classification fait échouer le banc : impossible d'en ajouter un
 *    sans se poser la question « porte-t-il une expression ? ».
 *  - **G2** — tout emplacement classé `decision` est RÉELLEMENT VISITÉ par le collecteur. Vérifié par
 *    construction, sur un nœud synthétique où chaque emplacement porte un marqueur unique : c'est la
 *    seule forme de preuve qui ne se contente pas de relire le code.
 *  - **G3** — tout nœud dont le banc tombe en stratégie 2 (couverture PROBABLE au lieu de PROUVÉE) est
 *    DÉCLARÉ. `statine` y était tombé en silence le matin même, par l'ajout d'un critère.
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5) : aucun nom de nœud dans la logique — seule la constante de
 * déclaration de G3 en nomme, exactement comme les constantes de dette des autres fichiers de banc.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import type { Noeud } from '../../content/node.types.ts'
import { CHAMPS_DU_SCHEMA, fragmentsDuNoeud } from '../expressionsNoeud.ts'
import { regimeDeBanc, tailleBanc } from './profils.ts'

// ---------------------------------------------------------------------------------------------------
// G1 — le schéma et la classification ne peuvent pas diverger
// ---------------------------------------------------------------------------------------------------

interface SchemaObjet {
  properties?: Record<string, unknown>
}
interface SchemaNoeud extends SchemaObjet {
  definitions?: Record<string, SchemaObjet>
}

const schema = JSON.parse(readFileSync('schema/noeud.schema.json', 'utf-8')) as SchemaNoeud

/** Propriétés réellement déclarées par le schéma, par définition (`(racine)` pour l'objet de tête). */
function proprietesDuSchema(): Map<string, string[]> {
  const parDefinition = new Map<string, string[]>()
  parDefinition.set('(racine)', Object.keys(schema.properties ?? {}))
  for (const [nom, definition] of Object.entries(schema.definitions ?? {})) {
    // Les définitions purement scalaires (`enum` de chaînes : `niveauPreuve`, `typeCritere`) n'ont pas
    // de `properties` — rien à classer, elles n'entrent pas dans la comparaison.
    if (definition.properties) parDefinition.set(nom, Object.keys(definition.properties))
  }
  return parDefinition
}

describe('G1 — toute propriété du schéma est classée (schéma ↔ `CHAMPS_DU_SCHEMA`)', () => {
  it('aucune propriété du schéma n’échappe à la classification, et aucune classification n’est orpheline', () => {
    const attendu = proprietesDuSchema()
    const violations: string[] = []

    for (const [definition, proprietes] of attendu) {
      const classees = CHAMPS_DU_SCHEMA[definition]
      if (!classees) {
        violations.push(
          `définition "${definition}" du schéma absente de CHAMPS_DU_SCHEMA — ses ${proprietes.length} ` +
            `propriétés ne sont classées nulle part : ${proprietes.join(', ')}`,
        )
        continue
      }
      for (const propriete of proprietes) {
        if (!(propriete in classees)) {
          violations.push(
            `"${definition}.${propriete}" existe dans le schéma mais n'est pas classé — porte-t-il une ` +
              `expression DSL ? Classer dans CHAMPS_DU_SCHEMA (engine/expressionsNoeud.ts), et si oui ` +
              `l'ajouter à fragmentsDuNoeud (G2 échouera sinon).`,
          )
        }
      }
      for (const classee of Object.keys(classees)) {
        if (!proprietes.includes(classee)) {
          violations.push(
            `"${definition}.${classee}" est classé dans CHAMPS_DU_SCHEMA mais n'existe plus dans le ` +
              `schéma — classification orpheline, à retirer.`,
          )
        }
      }
    }

    for (const definition of Object.keys(CHAMPS_DU_SCHEMA)) {
      if (!attendu.has(definition)) {
        violations.push(`définition "${definition}" classée mais absente du schéma — à retirer.`)
      }
    }

    expect(violations).toEqual([])
  })
})

// ---------------------------------------------------------------------------------------------------
// G2 — le collecteur visite réellement tous les emplacements de décision
// ---------------------------------------------------------------------------------------------------

/**
 * Nœud SYNTHÉTIQUE portant un marqueur unique dans CHAQUE emplacement susceptible de contenir une
 * expression. Écrit à la main plutôt que dérivé du contenu réel : un nœud du domaine n'utilise pas
 * forcément tous les emplacements (aucun n'avait de `prerequis` numérique, par exemple), et un test de
 * complétude qui ne s'exerce que sur ce qui existe déjà ne prouve rien sur ce qu'on ajoutera demain.
 *
 * Les expressions n'ont pas besoin d'être évaluables : ce test ne fait jamais tourner le moteur, il
 * vérifie une RÉCOLTE. Elles sont volontairement absurdes pour qu'aucune ne puisse être confondue avec
 * du contenu réel si elle fuitait dans un message d'erreur.
 */
const MARQUEURS = {
  conditions: 'MARQUEUR_conditions == 1',
  prerequis: 'MARQUEUR_prerequis == 2',
  exclusions: 'MARQUEUR_exclusions == 3',
  prioriteQuand: 'MARQUEUR_priorite_quand == 4',
  alerteOption: 'MARQUEUR_alerte_option == 5',
  alerteNoeud: 'MARQUEUR_alerte_noeud == 6',
  derive: 'MARQUEUR_derive == 7',
  visibleSi: 'MARQUEUR_visible_si == 8',
  calcul: 'MARQUEUR_calcul * 9',
  contrainte: 'MARQUEUR_contrainte <= 10',
  valeurVisibleSi: 'MARQUEUR_valeur_visible_si == 11',
} as const

function noeudSynthetique(): Noeud {
  return {
    id: 'synthetique-g2',
    domaine: 'test',
    titre: 'Nœud synthétique du test de complétude G2',
    population_cible: 'aucune — ce nœud n’est jamais évalué',
    criteres_entree: [
      { nom: 'derive_test', type: 'bool', derive: MARQUEURS.derive },
      { nom: 'visible_test', type: 'bool', visible_si: MARQUEURS.visibleSi },
      // A4/F : `valeurs_visible_si` porte une expression PAR VALEUR — le collecteur doit les visiter
      // toutes, pas seulement la première.
      {
        nom: 'liste_test',
        type: 'liste',
        valeurs: ['a'],
        valeurs_visible_si: { a: MARQUEURS.valeurVisibleSi },
      },
    ],
    options: [
      {
        intitule: 'Option portant tous les emplacements',
        role: 'geste', // A3 : champ obligatoire ; sans valeur de sentinelle, c'est un geste ordinaire.
        avantages: [],
        inconvenients: [],
        effet_attendu: 'non chiffrable',
        niveau_preuve: 'faible',
        conditions: [MARQUEURS.conditions],
        prerequis: [MARQUEURS.prerequis],
        exclusions: [MARQUEURS.exclusions],
        priorite: [{ quand: MARQUEURS.prioriteQuand, rang: 1 }],
        alertes: [{ quand: MARQUEURS.alerteOption, message: 'marqueur' }],
        calculs: [{ libelle: 'marqueur', expression: MARQUEURS.calcul }],
      },
    ],
    alertes: [{ quand: MARQUEURS.alerteNoeud, message: 'marqueur' }],
    contraintes: [{ expression: MARQUEURS.contrainte, message: 'marqueur' }],
    argumentaire: '',
    sources: {
      references_primaires: [],
      synthese_critique: { donnee: '', references: [] },
      reco_officielle: { source: '', position: '', divergence: false, explication: '' },
    },
    incertitudes: [],
    veille_liee: [],
    meta: { date_revue: '2026-07-27', auteur: 'test', statut: 'brouillon', version: '0.0', changelog: [] },
  }
}

describe('G2 — le collecteur visite tous les emplacements porteurs d’expression', () => {
  it('chaque marqueur du nœud synthétique est récolté, avec la bonne nature', () => {
    const fragments = fragmentsDuNoeud(noeudSynthetique())
    const parExpression = new Map(fragments.map((f) => [f.expression, f]))

    const attendu: Array<[string, 'decision' | 'affichage' | 'arithmetique' | 'saisie']> = [
      [MARQUEURS.conditions, 'decision'],
      [MARQUEURS.prerequis, 'decision'],
      [MARQUEURS.exclusions, 'decision'],
      [MARQUEURS.prioriteQuand, 'decision'],
      // L'OMISSION HISTORIQUE : c'est cette ligne, et elle seule, qui aurait fait échouer le test avant
      // le 2026-07-27 — dans les deux implémentations à la fois.
      [MARQUEURS.alerteOption, 'decision'],
      [MARQUEURS.alerteNoeud, 'decision'],
      [MARQUEURS.derive, 'decision'],
      [MARQUEURS.visibleSi, 'affichage'],
      [MARQUEURS.calcul, 'arithmetique'],
      // `saisie` et non `decision` : une contrainte est une expression, mais aucune décision ne la lit
      // (cf. `NatureChamp`). C'est précisément la distinction que cette ligne verrouille — la classer
      // `decision` ferait entrer ses littéraux dans les domaines de tirage comme s'ils étaient des
      // frontières cliniques.
      [MARQUEURS.contrainte, 'saisie'],
      // Même nature que `visible_si` : affichage, donc hors extraction de seuils.
      [MARQUEURS.valeurVisibleSi, 'affichage'],
    ]

    const violations: string[] = []
    for (const [expression, nature] of attendu) {
      const fragment = parExpression.get(expression)
      if (!fragment) {
        violations.push(`expression "${expression}" NON RÉCOLTÉE par fragmentsDuNoeud`)
      } else if (fragment.nature !== nature) {
        violations.push(`expression "${expression}" récoltée avec la nature "${fragment.nature}", attendu "${nature}"`)
      }
    }
    expect(violations).toEqual([])
    // Aucune récolte SURNUMÉRAIRE : si le collecteur inventait un fragment, le test le dirait.
    expect(fragments).toHaveLength(attendu.length)
  })

  it('chaque champ classé `decision`/`affichage`/`arithmetique` a un marqueur dans le nœud synthétique', () => {
    // Boucle le raisonnement de G1 vers G2 : un champ classé porteur d'expression mais qu'aucun marqueur
    // n'exerce serait un angle mort du test de complétude lui-même.
    const porteurs: string[] = []
    for (const [definition, champs] of Object.entries(CHAMPS_DU_SCHEMA)) {
      for (const [champ, nature] of Object.entries(champs)) {
        if (nature !== 'inerte') porteurs.push(`${definition}.${champ}`)
      }
    }
    // 10 emplacements de schéma pour 11 marqueurs : `alerte.quand` est la MÊME définition de schéma,
    // exercée à deux endroits (nœud et option) — c'est précisément la confusion qui a produit le défaut.
    expect(porteurs.sort()).toEqual(
      [
        'alerte.quand',
        'contrainte.expression',
        'critereEntree.derive',
        'critereEntree.valeurs_visible_si',
        'critereEntree.visible_si',
        'option.calculs',
        'option.conditions',
        'option.exclusions',
        'option.prerequis',
        'option.priorite',
      ].sort(),
    )
  })
})

// ---------------------------------------------------------------------------------------------------
// G3 — un nœud ne tombe pas en couverture probabiliste par accident
// ---------------------------------------------------------------------------------------------------

/**
 * Nœuds dont le produit cartésien des critères énumérables est HORS D'ATTEINTE de toute énumération
 * exhaustive — la stratégie 2 (échantillonnage stratifié) y est une nécessité, pas une dégradation
 * subie. Chiffres mesurés le 2026-07-27.
 *
 * Ce que déclarer ici SIGNIFIE, et qu'il ne faut pas relire comme une formalité : sur ces nœuds, la
 * couverture du banc est une PROBABILITÉ, pas un théorème. Une option gardée par une conjonction étroite
 * peut y être « couverte » un jour et plus le lendemain sans qu'aucun contenu n'ait changé — c'est
 * arrivé le 2026-07-27 sur `prescription` (option « Association iSGLT2 + AR GLP‑1 »), et le diagnostic
 * a d'abord porté à tort sur le contenu.
 *
 * N'AJOUTER UN NŒUD ICI QU'APRÈS AVOIR MESURÉ son produit (`regimeDeBanc`) et constaté qu'aucun plafond
 * réaliste ne le ramène. Un nœud à 47 520 combinaisons n'a rien à y faire : il faut relever le plafond,
 * ce qui a été fait le 2026-07-27 (20 000 → 60 000) pour `statine` et `rhd-activite-physique`.
 */
const NOEUDS_HORS_ENUMERATION_EXHAUSTIVE = new Map<string, string>([
  ['rhd-alimentation', 'produit ≈ 2,9 × 10⁸ (18 critères énumérables) — hors d’atteinte.'],
  ['insuline', 'produit ≈ 8,6 × 10¹¹ (20 critères énumérables) — hors d’atteinte.'],
  ['prescription', 'produit ≈ 1,3 × 10¹² (22 critères énumérables) — hors d’atteinte.'],
])

describe('G3 — régime de banc déclaré, jamais subi', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))(
    'nœud %s — couverture exhaustive, ou stratégie 2 explicitement déclarée',
    (id, node) => {
      const regime = regimeDeBanc(node, tailleBanc(node))
      if (regime.strategie === 1) {
        expect(NOEUDS_HORS_ENUMERATION_EXHAUSTIVE.has(id)).toBe(false)
        return
      }
      expect(
        NOEUDS_HORS_ENUMERATION_EXHAUSTIVE.has(id),
        `Le nœud "${id}" est passé en stratégie 2 (couverture PROBABLE, plus prouvée) sans être ` +
          `déclaré : son produit cartésien dépasse ${regime.produitEnumerable} (plafond atteint en ` +
          `cours de calcul). Deux issues, jamais une troisième : RELEVER ` +
          `PLAFOND_ENUMERATION_EXHAUSTIVE (banc/profils.ts) si le produit reste de l'ordre de la ` +
          `dizaine de milliers — c'est ce qui a été fait pour statine le 2026-07-27 — ou DÉCLARER ce ` +
          `nœud ici avec son produit mesuré, en sachant que sa couverture devient probabiliste.`,
      ).toBe(true)
    },
  )
})
