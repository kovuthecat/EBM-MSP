/**
 * Mise en page du formulaire (P3 · S7-ui Lot 2) : groupes issus du contenu, visibilité conditionnelle,
 * et surtout les deux GARDE-FOUS de sûreté qui rendent le masquage honnête :
 *  - un champ masqué est remis à sa valeur par défaut (il ne pilote plus le moteur en douce) ;
 *  - aucun champ masqué du contenu réel n'est décisif pour la reco (`champsMasquesInfluents`).
 * Tests génériques sur un nœud synthétique + un banc sur le vrai nœud `prescription`.
 */
import { describe, expect, it } from 'vitest'
import type { CritereEntree, Noeud } from '../content/node.types.ts'
import type { Criteria } from '../engine/conditions.ts'
import { getNoeudById } from '../content/loadNodes.ts'
import { criteresPertinents } from '../engine/relevance.ts'
import {
  buildDefaultCriteria,
  champEstVisible,
  champsVisibles,
  decisifsAConfirmer,
  grouperChamps,
  reinitialiserChampsMasques,
} from './formLayout.ts'

const CRITERES: CritereEntree[] = [
  { nom: 'intention', type: 'enum', valeurs: ['initier', 'intensifier'], groupe: 'Cadre' },
  {
    nom: 'traitements',
    type: 'liste',
    valeurs: ['metformine', 'sulfamide'],
    groupe: 'État des lieux',
    visible_si: 'intention != initier',
  },
  { nom: 'HbA1c_actuelle', type: 'nombre', groupe: 'État des lieux' },
  { nom: 'intolerance', type: 'bool', groupe: 'Tolérance' },
  {
    nom: 'nature',
    type: 'enum',
    valeurs: ['aucune', 'digestive'],
    groupe: 'Tolérance',
    visible_si: 'intolerance == true',
  },
  { nom: 'cible_atteinte', type: 'bool', derive: 'HbA1c_actuelle <= 7' },
]

const base = (): Criteria => buildDefaultCriteria(CRITERES)

describe('champEstVisible', () => {
  it('affiche un champ sans `visible_si`', () => {
    expect(champEstVisible(CRITERES[2], base())).toBe(true)
  })

  it('masque un champ dont la condition est fausse', () => {
    // `intention` vaut sa 1re valeur déclarée, soit `initier` → « traitements en cours » sans objet.
    expect(champEstVisible(CRITERES[1], base())).toBe(false)
  })

  it('affiche ce même champ dès que la condition devient vraie', () => {
    expect(champEstVisible(CRITERES[1], { ...base(), intention: 'intensifier' })).toBe(true)
  })

  describe('valeur indéterminée (DECISIONS.md D20, SPEC-valeur-indeterminee.md §2, point 5 de la tâche)', () => {
    it('un `visible_si` INDÉTERMINÉ (critère `enum` dont dépend la visibilité, non renseigné) rend le champ VISIBLE — jamais masqué', () => {
      // `traitements` (CRITERES[1]) dépend de `intention` (enum). `intention` absent de `renseignes` :
      // le champ reste affiché plutôt que masqué (et donc potentiellement réinitialisé en silence).
      expect(champEstVisible(CRITERES[1], base(), new Set())).toBe(true)
    })

    it('un `visible_si` VRAI reste visible, `renseignes` fourni ou non (aucune régression sur le cas déterminé)', () => {
      expect(champEstVisible(CRITERES[1], { ...base(), intention: 'intensifier' }, new Set(['intention']))).toBe(
        true,
      )
    })

    it('un `visible_si` FAUX (déterminé) reste masqué : seule l’indétermination bascule vers visible, pas la fausseté', () => {
      expect(champEstVisible(CRITERES[1], base(), new Set(['intention']))).toBe(false)
    })
  })
})

describe('grouperChamps', () => {
  it("ordonne les sections par première apparition, pas par type de donnée", () => {
    const groupes = grouperChamps(CRITERES, { ...base(), intention: 'intensifier' })
    expect(groupes.map((g) => g.libelle)).toEqual(['Cadre', 'État des lieux', 'Tolérance'])
    // La `liste` reste en tête de sa section (l'ancien rendu la reléguait tout en bas de la page).
    expect(groupes[1].champs.map((c) => c.nom)).toEqual(['traitements', 'HbA1c_actuelle'])
  })

  it('ne rend jamais un critère dérivé', () => {
    const rendus = grouperChamps(CRITERES, base()).flatMap((g) => g.champs.map((c) => c.nom))
    expect(rendus).not.toContain('cible_atteinte')
  })

  it('retire les champs masqués, et la section entière si elle se vide', () => {
    const groupes = grouperChamps([CRITERES[0], CRITERES[1]], base())
    expect(groupes.map((g) => g.libelle)).toEqual(['Cadre'])
  })

  it('replie sur une section unique sans titre quand le contenu ne déclare aucun groupe', () => {
    const sansGroupe = CRITERES.map(({ groupe: _groupe, ...reste }) => reste)
    const groupes = grouperChamps(sansGroupe, { ...base(), intention: 'intensifier' })
    expect(groupes).toHaveLength(1)
    expect(groupes[0].libelle).toBeUndefined()
  })

  it('D20 : un champ conditionné par un critère `enum` non renseigné reste VISIBLE (indétermination ⇒ visible)', () => {
    // `intention` (dont dépend `traitements`) absent de `renseignes` : sans D20, `traitements` serait
    // masqué (comme au 1er test « ordonne les sections… » avec `intention` par défaut = 'initier').
    const groupes = grouperChamps(CRITERES, base(), new Set())
    const rendus = groupes.flatMap((g) => g.champs.map((c) => c.nom))
    expect(rendus).toContain('traitements')
  })
})

describe('reinitialiserChampsMasques', () => {
  it('efface la valeur d’un champ que le changement vient de masquer', () => {
    // Le praticien coche un traitement en intensification, puis bascule sur « initier ».
    const avant: Criteria = { ...base(), intention: 'intensifier', traitements: ['metformine'] }
    const { criteria, reinitialises } = reinitialiserChampsMasques(CRITERES, {
      ...avant,
      intention: 'initier',
    })
    expect(criteria.traitements).toEqual([])
    expect(reinitialises).toContain('traitements')
  })

  it('laisse intacts les champs visibles', () => {
    const avant: Criteria = { ...base(), intention: 'intensifier', traitements: ['sulfamide'], HbA1c_actuelle: 9 }
    const { criteria, reinitialises } = reinitialiserChampsMasques(CRITERES, avant)
    expect(criteria.traitements).toEqual(['sulfamide'])
    expect(criteria.HbA1c_actuelle).toBe(9)
    expect(reinitialises).toEqual([])
  })

  it('traite les masquages en cascade', () => {
    // `nature` n'est visible que si `intolerance` ; masquer les deux d'un coup doit tout nettoyer.
    const cascade: CritereEntree[] = [
      { nom: 'actif', type: 'bool' },
      { nom: 'intolerance', type: 'bool', visible_si: 'actif == true' },
      { nom: 'nature', type: 'enum', valeurs: ['aucune', 'digestive'], visible_si: 'intolerance == true' },
    ]
    const { criteria, reinitialises } = reinitialiserChampsMasques(cascade, {
      actif: false,
      intolerance: true,
      nature: 'digestive',
    })
    expect(criteria).toEqual({ actif: false, intolerance: false, nature: 'aucune' })
    expect(reinitialises).toEqual(expect.arrayContaining(['intolerance', 'nature']))
  })
})

describe('decisifsAConfirmer — le contenu réel du nœud `prescription`', () => {
  const node = getNoeudById('prescription')
  if (!node) throw new Error('Nœud "prescription" introuvable.')

  const profil = (surcharge: Criteria): Criteria => ({
    ...buildDefaultCriteria(node.criteres_entree),
    HbA1c_actuelle: 8,
    DFG: 80,
    IMC: 27,
    age: 60,
    esperance_vie: 'longue',
    risque_hypoglycemie_schema: 'faible',
    albuminurie: 'normo',
    ...surcharge,
  })

  const cas: Array<[string, Criteria]> = [
    ['initiation simple', profil({ intention: 'initier' })],
    ['initiation à HbA1c élevée', profil({ intention: 'initier', HbA1c_actuelle: 9.5 })],
    ['intensification sous metformine', profil({ intention: 'intensifier', traitements_en_cours: ['metformine'] })],
    ['optimisation sous sulfamide', profil({ intention: 'optimiser', traitements_en_cours: ['sulfamide'] })],
    ['déprescription chez le fragile', profil({ intention: 'deprescrire', age: 82, fragilite: true })],
    ['intolérance déclarée', profil({ intention: 'optimiser', intolerance_traitement: true })],
  ]

  /**
   * ANTI-RÉGRESSION du défaut constaté en recette : `age` était réclamé (« renseignez l'âge » bloquait
   * tout affichage) alors qu'il était estompé « sans effet sur la reco » — sans issue pour le praticien.
   * On vérifie ici les deux impasses possibles, sur le contenu réel : un critère réclamé est toujours
   * (a) pertinent — donc jamais estompé — et (b) visible à l'écran.
   */
  it.each(cas)('%s — aucun critère réclamé n’est estompé ni masqué', (_libelle, criteria) => {
    const pertinents = criteresPertinents(node, criteria)
    const vide = new Set<string>()
    const reclames = decisifsAConfirmer(node.criteres_entree, criteria, vide, pertinents)
    const visibles = champsVisibles(node.criteres_entree, criteria)

    expect(reclames.filter((nom) => !pertinents.has(nom))).toEqual([])
    expect(reclames.filter((nom) => !visibles.has(nom))).toEqual([])
  })

  it('ne réclame plus rien une fois les critères décisifs renseignés', () => {
    const criteria = profil({ intention: 'intensifier', traitements_en_cours: ['metformine'] })
    const pertinents = criteresPertinents(node, criteria)
    expect(decisifsAConfirmer(node.criteres_entree, criteria, pertinents, pertinents)).toEqual([])
  })

  it("masque bien les traitements en cours à l'initiation, et les montre sinon", () => {
    const visibles = (criteria: Criteria) =>
      grouperChamps(node.criteres_entree, criteria).flatMap((g) => g.champs.map((c) => c.nom))
    expect(visibles(profil({ intention: 'initier' }))).not.toContain('traitements_en_cours')
    expect(visibles(profil({ intention: 'intensifier' }))).toContain('traitements_en_cours')
  })

  /**
   * TÂCHE 2 (recette référent, 2026-07-25) : un patient naïf de tout traitement (INITIER) ne peut être ni
   * intolérant à un traitement en cours, ni en hypoglycémie sous traitement — ces deux questions sont
   * masquées à l'initiation (`visible_si: "intention != initier"`). `nature_intolerance` suit en cascade
   * : déjà masqué derrière `intolerance_traitement == true`, il l'est doublement à l'initiation.
   */
  it("masque intolerance_traitement et hypoglycemie_recente à l'initiation (sans objet, naïf de traitement)", () => {
    const visibles = (criteria: Criteria) =>
      grouperChamps(node.criteres_entree, criteria).flatMap((g) => g.champs.map((c) => c.nom))
    const aInitiation = visibles(profil({ intention: 'initier' }))
    expect(aInitiation).not.toContain('intolerance_traitement')
    expect(aInitiation).not.toContain('hypoglycemie_recente')
    expect(aInitiation).not.toContain('nature_intolerance') // cascade : masqué même si intolerance_traitement était vrai

    const horsInitiation = visibles(profil({ intention: 'intensifier', traitements_en_cours: ['metformine'] }))
    expect(horsInitiation).toContain('intolerance_traitement')
    expect(horsInitiation).toContain('hypoglycemie_recente')
  })

  it('remet intolerance_traitement/hypoglycemie_recente à défaut si on repasse sur "initier" après les avoir renseignés', () => {
    const avant = profil({
      intention: 'intensifier',
      traitements_en_cours: ['metformine'],
      intolerance_traitement: true,
      nature_intolerance: 'digestive',
      hypoglycemie_recente: true,
    })
    const { criteria, reinitialises } = reinitialiserChampsMasques(node.criteres_entree, {
      ...avant,
      intention: 'initier',
    })
    expect(criteria.intolerance_traitement).toBe(false)
    expect(criteria.nature_intolerance).toBe('aucune')
    expect(criteria.hypoglycemie_recente).toBe(false)
    expect(reinitialises).toEqual(
      expect.arrayContaining(['intolerance_traitement', 'nature_intolerance', 'hypoglycemie_recente']),
    )
  })

  it('ordonne les sections selon le raisonnement de consultation', () => {
    const groupes = grouperChamps(node.criteres_entree, profil({ intention: 'intensifier' }))
    expect(groupes.map((g) => g.libelle)).toEqual([
      'Intention thérapeutique',
      'Traitement actuel et contrôle',
      'Ce qui oriente le choix',
      "Signaux d'alerte et tolérance",
      'Terrain et préférences',
    ])
    // Le traitement actuel est le 2e élément à renseigner, plus le dernier de la page.
    expect(groupes[1].champs[0].nom).toBe('traitements_en_cours')
  })
})

describe('tous les nœuds du contenu', () => {
  it('déclarent des `visible_si` évaluables sur leurs valeurs par défaut', () => {
    for (const id of ['cible-glycemique', 'prescription', 'insuline', 'rhd-alimentation', 'rhd-activite-physique', 'statine']) {
      const node = getNoeudById(id) as Noeud
      expect(node, `nœud ${id} introuvable`).toBeDefined()
      expect(() => grouperChamps(node.criteres_entree, buildDefaultCriteria(node.criteres_entree))).not.toThrow()
    }
  })
})
