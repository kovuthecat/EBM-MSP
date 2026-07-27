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
  appliquerPreremplissage,
  buildDefaultCriteria,
  champEstVisible,
  champsVisibles,
  criteresPilotes,
  decisifsAConfirmer,
  grouperChamps,
  reinitialiserChampsMasques,
  valeursProposeesDepuisSaisie,
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
    // `vide` transmis AUSSI à `champsVisibles` (correctif du 2026-07-27) : ce test mélangeait deux
    // conventions de visibilité, et c'est ce qui a rendu l'écart visible. Il passait `touched = ∅` à
    // `decisifsAConfirmer` — donc « rien n'est renseigné », `visible_si` indéterminé, champ AFFICHÉ par
    // le repli « fail open » de R7 — tout en calculant sa propre référence en mode repli « tout est
    // renseigné », où le même champ est masqué. Les deux côtés de l'assertion ne parlaient pas du même
    // écran. Ils comparent désormais la même chose, celle que le formulaire rend réellement.
    const visibles = champsVisibles(node.criteres_entree, criteria, vide)

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


/**
 * A7 — repère de départ (arbitrage référent, 2026-07-27 soir). Un formulaire long est « entièrement
 * neutre, rien ne désigne le premier champ à remplir » (recette visuelle) alors que ce champ existe et
 * décide de la moitié de l'écran. `criteresPilotes` le désigne SANS aucun nom en dur : est pilote tout
 * critère qu'un autre cite dans son `visible_si`.
 */
describe('criteresPilotes — A7, repère de départ dérivé du contenu', () => {
  it('désigne le critère cité par le `visible_si` d’un autre', () => {
    const criteres: CritereEntree[] = [
      { nom: 'intention', type: 'enum', valeurs: ['initier', 'optimiser'], groupe: 'G' },
      { nom: 'traitements', type: 'liste', valeurs: ['a', 'b'], groupe: 'G', visible_si: 'intention != initier' },
      { nom: 'age', type: 'nombre', groupe: 'G' },
    ]
    expect([...criteresPilotes(criteres)]).toEqual(['intention'])
  })

  it('n’est pas piloté par un critère qui se cite lui-même — il faudrait déjà l’avoir répondu', () => {
    const criteres: CritereEntree[] = [
      { nom: 'ck', type: 'nombre', groupe: 'G', visible_si: 'ck > 0' },
    ]
    expect(criteresPilotes(criteres).size).toBe(0)
  })

  it('ne cite jamais un critère DÉRIVÉ : il n’est pas saisissable, donc pas un point de départ', () => {
    const criteres: CritereEntree[] = [
      { nom: 'a', type: 'nombre', groupe: 'G' },
      { nom: 'seuil_atteint', type: 'bool', groupe: 'G', derive: 'a > 5' },
      { nom: 'suite', type: 'nombre', groupe: 'G', visible_si: 'seuil_atteint == true' },
    ]
    // `seuil_atteint` est cité, mais il est dérivé : c'est `a` qu'il faut répondre. Ni l'un ni l'autre
    // n'est renvoyé — `seuil_atteint` parce qu'il n'est pas saisissable, `a` parce qu'aucun `visible_si`
    // ne le cite directement. Le repère ne PRÉTEND pas dérouler la chaîne : il désigne ce que le contenu
    // nomme, ni plus (limite assumée, cf. docstring).
    expect(criteresPilotes(criteres).has('seuil_atteint')).toBe(false)
  })

  it('sur le contenu réel, désigne exactement les champs que la recette visuelle a nommés', () => {
    const insuline = getNoeudById('insuline')
    const prescription = getNoeudById('prescription')
    if (!insuline || !prescription) throw new Error('nœuds introuvables')
    expect(criteresPilotes(insuline.criteres_entree).has('situation_insuline')).toBe(true)
    expect(criteresPilotes(prescription.criteres_entree).has('intention')).toBe(true)
  })

  it('un nœud sans aucun `visible_si` n’a pas de pilote — et rien ne s’affiche différemment', () => {
    const criteres: CritereEntree[] = [
      { nom: 'a', type: 'nombre', groupe: 'G' },
      { nom: 'b', type: 'bool', groupe: 'G' },
    ]
    expect(criteresPilotes(criteres).size).toBe(0)
  })
})

/**
 * A4/F — `valeurs_visible_si` : masquer UNE valeur d'une `liste` sans masquer le champ.
 *
 * Le défaut : chez un patient déclaré naïf d'insuline, « Insuline basale » et « Insuline rapide »
 * restaient cochables dans `traitements_en_cours`. `visible_si` ne sait masquer qu'un champ entier, et le
 * contenu le disait déjà de lui-même. Troisième occurrence du même manque.
 */
describe('valeursProposees — A4/F', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'situation', type: 'enum', valeurs: ['naif', 'basale_seule'] },
    {
      nom: 'traitements',
      type: 'liste',
      valeurs: ['metformine', 'insuline_basale', 'insuline_rapide'],
      valeurs_visible_si: {
        insuline_basale: 'situation != naif',
        insuline_rapide: 'situation != naif',
      },
    },
  ]
  const critere = CRITERES[1]

  it('masque les valeurs dont la garde est FAUSSE, garde les autres', () => {
    const proposees = valeursProposeesDepuisSaisie(CRITERES, critere, { situation: 'naif', traitements: [] }, new Set(['situation']))
    expect(proposees).toEqual(['metformine'])
  })

  it('propose tout quand la garde est VRAIE', () => {
    const proposees = valeursProposeesDepuisSaisie(
      CRITERES,
      critere,
      { situation: 'basale_seule', traitements: [] },
      new Set(['situation']),
    )
    expect(proposees).toEqual(['metformine', 'insuline_basale', 'insuline_rapide'])
  })

  it('propose tout quand la garde est INDÉTERMINÉE — on ne cache jamais sur une donnée qu’on ignore', () => {
    // Même règle que `champEstVisible` (R7/D20), et pour la même raison : masquer une case sur une donnée
    // non encore renseignée reviendrait à retirer au praticien une réponse qu'il n'a pas eu l'occasion de
    // donner. `situation` hors de `renseignes` ⇒ la garde est indéterminée.
    const proposees = valeursProposeesDepuisSaisie(CRITERES, critere, { situation: 'naif', traitements: [] }, new Set())
    expect(proposees).toEqual(['metformine', 'insuline_basale', 'insuline_rapide'])
  })

  it('un critère SANS `valeurs_visible_si` renvoie ses valeurs telles quelles', () => {
    const simple: CritereEntree = { nom: 'x', type: 'liste', valeurs: ['a', 'b'] }
    expect(valeursProposeesDepuisSaisie([simple], simple, { x: [] })).toEqual(['a', 'b'])
  })
})

describe('reinitialiserChampsMasques — A4/F : une valeur cochée puis masquée est RETIRÉE', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'situation', type: 'enum', valeurs: ['naif', 'basale_seule'] },
    {
      nom: 'traitements',
      type: 'liste',
      valeurs: ['metformine', 'insuline_basale'],
      valeurs_visible_si: { insuline_basale: 'situation != naif' },
    },
  ]

  it('retire la valeur devenue masquée, conserve les autres, et le champ reste répondu', () => {
    // Le scénario exact : cocher « insuline basale » sous « basale seule », puis revenir à « naïf ».
    // Sans ce retrait, la valeur continuerait de piloter le moteur pendant que l'écran affirme le
    // contraire — le défaut que la remise à zéro des champs masqués corrige déjà un cran plus haut.
    const { criteria, reinitialises } = reinitialiserChampsMasques(
      CRITERES,
      { situation: 'naif', traitements: ['metformine', 'insuline_basale'] },
      new Set(['situation', 'traitements']),
    )
    expect(criteria.traitements).toEqual(['metformine'])
    // PAS dans `reinitialises` : l'appelant s'en sert pour retirer le champ de `touched`, or le praticien
    // a bien répondu — le vider ferait réapparaître « à confirmer » sur un champ tout juste renseigné.
    expect(reinitialises).not.toContain('traitements')
  })

  it('ne touche à rien quand toutes les valeurs cochées restent proposées', () => {
    const entree = { situation: 'basale_seule', traitements: ['insuline_basale'] }
    const { criteria } = reinitialiserChampsMasques(CRITERES, entree, new Set(['situation', 'traitements']))
    expect(criteria.traitements).toEqual(['insuline_basale'])
  })
})

/**
 * K6 — PRÉ-REMPLISSAGE CALCULÉ (`preremplissage`). Décision référent : « si la cible est connue, le module
 * peut déduire le résultat en calculant l'écart à la cible et pré-remplir la position à la cible. Sinon
 * c'est la position à la cible DÉCLARÉE qui fait foi. » Seuil donné : « nettement au-dessus » = HbA1c
 * supérieure ou égale à 1 point de plus que l'objectif.
 */
describe('appliquerPreremplissage — K6', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'actuelle', type: 'nombre', min: 4, max: 18 },
    { nom: 'cible', type: 'nombre', min: 6, max: 9.5 },
    { nom: 'nettement', type: 'bool', derive: 'actuelle > 0 AND cible > 0 AND actuelle - cible >= 1' },
    { nom: 'au_dessus', type: 'bool', derive: 'actuelle > 0 AND cible > 0 AND actuelle > cible' },
    {
      nom: 'position',
      type: 'enum',
      valeurs: ['a_l_objectif', 'au_dessus', 'nettement_au_dessus'],
      preremplissage: [
        { quand: 'nettement == true', valeur: 'nettement_au_dessus' },
        { quand: 'au_dessus == true', valeur: 'au_dessus' },
      ],
    },
  ]
  const saisi = { actuelle: 0, cible: 0, position: 'a_l_objectif' }
  const deuxRenseignes = new Set(['actuelle', 'cible'])

  it('applique la PREMIÈRE règle vraie — « nettement » l’emporte sur « au-dessus »', () => {
    // 8,0 pour une cible à 7,0 : écart de 1 point exactement, donc « nettement » (seuil ≥ 1, référent).
    const r = appliquerPreremplissage(CRITERES, { ...saisi, actuelle: 8, cible: 7 }, deuxRenseignes)
    expect(r.criteria.position).toBe('nettement_au_dessus')
    expect(r.preremplis).toEqual(['position'])
  })

  it('« au-dessus » quand l’écart est strictement inférieur à 1 point', () => {
    const r = appliquerPreremplissage(CRITERES, { ...saisi, actuelle: 7.5, cible: 7 }, deuxRenseignes)
    expect(r.criteria.position).toBe('au_dessus')
  })

  it('ne pré-remplit RIEN quand aucune règle n’est vraie — sous l’objectif, le praticien déclare', () => {
    // ⚠ Délibéré : le référent a donné le seuil du « nettement au-dessus », pas la frontière entre
    // `a_l_objectif` et `sous_objectif`. Cette frontière déclenche la déprescription — on ne la devine pas.
    const r = appliquerPreremplissage(CRITERES, { ...saisi, actuelle: 6.5, cible: 7 }, deuxRenseignes)
    expect(r.preremplis).toEqual([])
    expect(r.criteria.position).toBe('a_l_objectif')
  })

  it('ne pré-remplit RIEN tant qu’un opérande n’est pas renseigné — on ne devine pas sur une donnée absente', () => {
    // R7/D20 : `quand` est alors INDÉTERMINÉ, et l'exigence est `=== true`, pas `!== false`.
    const r = appliquerPreremplissage(CRITERES, { ...saisi, actuelle: 9, cible: 7 }, new Set(['actuelle']))
    expect(r.preremplis).toEqual([])
  })

  it('ne touche JAMAIS un champ déjà répondu — « la position déclarée fait foi »', () => {
    const r = appliquerPreremplissage(
      CRITERES,
      { ...saisi, actuelle: 9, cible: 7, position: 'a_l_objectif' },
      new Set(['actuelle', 'cible', 'position']),
    )
    expect(r.preremplis).toEqual([])
    expect(r.criteria.position).toBe('a_l_objectif')
  })

  it('refuse une valeur que le critère `enum` ne déclare pas', () => {
    const faux: CritereEntree[] = [
      { nom: 'x', type: 'enum', valeurs: ['a'], preremplissage: [{ quand: 'y == true', valeur: 'inexistante' }] },
      { nom: 'y', type: 'bool' },
    ]
    const r = appliquerPreremplissage(faux, { x: 'a', y: true }, new Set(['y']))
    expect(r.preremplis).toEqual([])
  })
})
