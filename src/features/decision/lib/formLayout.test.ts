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
    // `intolerance` reste à son défaut (false, non surchargé ci-dessous) : `nature` (visible_si
    // 'intolerance == true') est donc MASQUÉ dans ce fixture, indépendamment de ce que ce test exerce
    // (`traitements`/`HbA1c_actuelle`, VISIBLES ici). T-142/T-143 (P13/S3, 2026-08-05) : depuis le
    // correctif de sûreté ci-dessus (`reinitialiserChampsMasques`, cf. sa docstring), TOUT champ masqué
    // est désormais signalé dans `reinitialises` — y compris `nature`, dont la valeur ('aucune') coïncide
    // avec son défaut et qui n'apparaissait donc JAMAIS dans `reinitialises` avant ce correctif (c'est
    // exactement le bug de cascade découvert sur `profil_nocturne`, T-142). Ce test ne portait, avant
    // aujourd'hui, que sur les champs VISIBLES : son assertion `toEqual([])` était accidentellement plus
    // large qu'annoncé par son titre — elle vérifie ici ce que son nom promet, plus précisément.
    const avant: Criteria = { ...base(), intention: 'intensifier', traitements: ['sulfamide'], HbA1c_actuelle: 9 }
    const { criteria, reinitialises } = reinitialiserChampsMasques(CRITERES, avant)
    expect(criteria.traitements).toEqual(['sulfamide'])
    expect(criteria.HbA1c_actuelle).toBe(9)
    expect(reinitialises).not.toContain('traitements')
    expect(reinitialises).not.toContain('HbA1c_actuelle')
    expect(reinitialises).toEqual(['nature'])
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

  /**
   * T-142 (P13/S3, 2026-08-05) — DIAGNOSTIC DU PROFIL NOCTURNE, réduit à son cas minimal. Un `enum` dont
   * la RÉPONSE choisie par le praticien coïncide avec sa 1re valeur déclarée (`valeurParDefaut` : « la 1re
   * valeur déclarée » pour un `enum`) doit sortir de `reinitialises` — donc de `touched` chez l'appelant —
   * exactement comme un `enum` répondu par sa 2ᵉ ou 3ᵉ valeur. AVANT le correctif de sûreté ci-dessus,
   * `reinitialises` ne contenait JAMAIS ce nom dans ce cas précis (`actuel !== defaut` était faux dès le
   * départ) : le champ restait `touched` malgré le masquage, en silence — mesuré au navigateur sur le nœud
   * réel `insuline` (`profil_nocturne` = « Baisse continue », `valeurs[0]` du contenu).
   */
  it('un `enum` dont la valeur COÏNCIDE avec son défaut sort quand même de `reinitialises` une fois masqué (T-142, coïncidence de valeur)', () => {
    const champCible: CritereEntree[] = [
      { nom: 'porte', type: 'bool' },
      // `cible` : 1re valeur déclarée = 'a', et c'est justement celle choisie ci-dessous — la coïncidence
      // qui masquait le bug avant ce correctif.
      { nom: 'cible', type: 'enum', valeurs: ['a', 'b', 'c'], visible_si: 'porte == true' },
    ]
    const { reinitialises, valeursEffacees } = reinitialiserChampsMasques(champCible, { porte: false, cible: 'a' })
    expect(reinitialises).toContain('cible')
    expect(valeursEffacees).toEqual(expect.arrayContaining([{ nom: 'cible', valeur: 'a' }]))
  })

  /**
   * T-143 Étape 5 (P13/S3) — COMPAGNON DE `formLayout.test.ts:4/116` (le garde-fou R8 tenu par ce fichier
   * depuis l'origine) : PENDANT le masquage, `criteria[nom]` vaut le défaut ET le nom est hors de
   * l'ensemble « renseigné » côté moteur. La mémoire de restauration introduite par T-143
   * (`DecisionNodeScreen.tsx`, hors de ce module) ne doit JAMAIS être observable par `evaluateNode` — ce
   * test verrouille la partie de ce contrat que `formLayout.ts` peut vérifier seul, sans l'écran : la
   * VALEUR reste le défaut, quel que soit ce que `reinitialises`/`valeursEffacees` signalent désormais en
   * plus (l'extension de cette session n'change rien à `aMuter`, cf. sa docstring).
   */
  it('R8 tient toujours : pendant le masquage, la valeur reste le défaut et le nom est hors de `criteresRenseignes` (compagnon T-143)', () => {
    const avant: Criteria = { ...base(), intention: 'intensifier', traitements: ['metformine'] }
    const touchedAvant = new Set(['intention', 'traitements'])
    const { criteria, reinitialises } = reinitialiserChampsMasques(CRITERES, { ...avant, intention: 'initier' }, touchedAvant)
    // La valeur : le défaut d'un `liste`, une liste vide — jamais 'metformine' qui vient de disparaître.
    expect(criteria.traitements).toEqual([])
    // Le nom : simule `DecisionNodeScreen.tsx` (`touchedApres.delete(efface)`, l.508) — `criteresRenseignes`
    // (touched ∪ preremplis côté écran) ne doit plus le contenir, ce fixture n'a pas de préremplissage.
    const touchedApres = new Set(touchedAvant)
    for (const efface of reinitialises) touchedApres.delete(efface)
    expect(touchedApres.has('traitements')).toBe(false)
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

  /**
   * T-134 (P12/S9) — recette du 02/08, N7 : l'albuminurie manque au dossier de l'EHPAD et n'y sera
   * jamais. `indisponibles` (5ᵉ paramètre, optionnel) doit exclure un nom de la liste réclamée SANS rien
   * changer d'autre — PUREMENT SOUSTRACTIF, jamais une reconstruction du filtre. Le critère lui-même
   * reste NON déterminé pour le moteur (R7/D20) : ce test ne porte QUE sur ce que l'écran RÉCLAME, jamais
   * sur `touched`/`effectifs`, qui ne reçoivent jamais `indisponibles` (cf. la docstring de la fonction).
   */
  it("exclut un critère déclaré INDISPONIBLE de la liste réclamée, sans rien changer d'autre", () => {
    const criteria = profil({ intention: 'initier' })
    const pertinents = criteresPertinents(node, criteria)
    const vide = new Set<string>()
    const sansDeclaration = decisifsAConfirmer(node.criteres_entree, criteria, vide, pertinents)
    // Précondition du test : sur ce profil, l'albuminurie est bien décisive et non confirmée — sans quoi
    // ce test ne prouverait rien (cf. `CriteriaForm.test.tsx`, qui utilise la même variable comme exemple
    // d'enum décisif).
    expect(sansDeclaration).toContain('albuminurie')

    const avecDeclaration = decisifsAConfirmer(
      node.criteres_entree,
      criteria,
      vide,
      pertinents,
      new Set(['albuminurie']),
    )
    expect(avecDeclaration).not.toContain('albuminurie')
    // PUREMENT SOUSTRACTIF : le reste de la liste est BYTE À BYTE identique, rien d'autre ne bouge.
    expect(avecDeclaration).toEqual(sansDeclaration.filter((nom) => nom !== 'albuminurie'))
  })

  it('sans 5ᵉ paramètre, le comportement est STRICTEMENT inchangé (non-régression, T-134)', () => {
    const criteria = profil({ intention: 'initier' })
    const pertinents = criteresPertinents(node, criteria)
    const vide = new Set<string>()
    expect(decisifsAConfirmer(node.criteres_entree, criteria, vide, pertinents)).toEqual(
      decisifsAConfirmer(node.criteres_entree, criteria, vide, pertinents, undefined),
    )
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
      nature_intolerance: ['digestive'],
      hypoglycemie_recente: true,
    })
    const { criteria, reinitialises } = reinitialiserChampsMasques(node.criteres_entree, {
      ...avant,
      intention: 'initier',
    })
    expect(criteria.intolerance_traitement).toBe(false)
    // `liste` depuis le 2026-07-29 (multi-sélection) : la valeur par défaut est le tableau VIDE, qui dit
    // désormais ce que la valeur `aucune` disait quand ce critère était un `enum` à choix unique.
    expect(criteria.nature_intolerance).toEqual([])
    expect(criteria.hypoglycemie_recente).toBe(false)
    expect(reinitialises).toEqual(
      expect.arrayContaining(['intolerance_traitement', 'nature_intolerance', 'hypoglycemie_recente']),
    )
  })

  it('ordonne les sections selon le raisonnement de consultation', () => {
    // « Traitement actuel et contrôle » SCINDÉE en deux (2026-08-01, amélioration de lisibilité) :
    // « Traitement » (ce qui est déjà prescrit) puis « Équilibre » (l'état de contrôle glycémique) —
    // deux questions distinctes, désormais deux sections. Ordre de saisie inchangé (même position dans
    // `criteres_entree`), seul le regroupement visuel bouge.
    // « Tolérance et préférences » AJOUTÉE le 2026-08-04 (demande utilisateur) : regroupe la tolérance au
    // traitement en cours (ex-« Signaux d'alerte et tolérance ») et la préférence injectable (ex-
    // « Terrain et préférences »), juste après « Traitement » dont elle discute la tolérance — cf.
    // `prescription.yaml`, commentaire du bloc `intolerance_traitement`.
    const groupes = grouperChamps(node.criteres_entree, profil({ intention: 'intensifier' }))
    expect(groupes.map((g) => g.libelle)).toEqual([
      'Je souhaite',
      'Traitement',
      'Tolérance et préférences',
      'Équilibre',
      'Ce qui oriente le choix',
      "Signaux d'alerte",
      'Terrain',
    ])
    // Le traitement actuel est le 2e élément à renseigner, plus le dernier de la page.
    expect(groupes[1].champs[0].nom).toBe('traitements_en_cours')
    expect(groupes[3].champs[0].nom).toBe('HbA1c_actuelle')
  })
})

/**
 * P6/SA3 (T-044) — SB4 avait constaté que `insuline` était le seul nœud DT2 sans aucun `groupe` déclaré :
 * `grouperChamps` y renvoyait donc un groupe unique, désactivant l'accordéon générique (P6/SB2,
 * `CriteriaForm.tsx` : `accordeon = groupes.length > 1`). Cette session pose `groupe` sur les 22 critères
 * saisissables du nœud, en 6 sections ; ce test vérifie l'effet mesurable — plusieurs groupes, dans l'ordre
 * clinique voulu — sur le contenu RÉEL, pas une reconstitution synthétique.
 *
 * PASSÉ À 8 SECTIONS le 2026-07-30 (P8/S7) : `profil_glycemique` (`liste`, groupe « Surveillance
 * glycémique ») et le critère propre `hypo_interprandiale` (même groupe) sont remplacés par deux `enum`
 * portant chacun son PROPRE `groupe` — « Profil glycémique nocturne » et « Profil glycémique entre les
 * repas » — insérés à la même place dans `criteres_entree`, donc au même point dans l'ordre de première
 * apparition. « Surveillance glycémique » ne disparaît pas (GAJ, TBR, CV_glycemique le portent encore) ;
 * il se scinde simplement en trois sections consécutives au lieu d'une.
 */
describe('grouperChamps — le contenu réel du nœud `insuline` (P6/SA3)', () => {
  const node = getNoeudById('insuline')
  if (!node) throw new Error('Nœud "insuline" introuvable.')

  const GROUPES_ATTENDUS = [
    "Situation d'insulinothérapie",
    'Profil et objectif glycémique',
    'Traitement actuel',
    'Surveillance glycémique',
    'Profil glycémique nocturne',
    'Profil glycémique entre les repas',
    "Signaux d'alerte et tolérance",
    'Terrain',
  ]

  it('produit désormais PLUSIEURS groupes (pas un seul) — condition d’activation de l’accordéon', () => {
    const groupes = grouperChamps(node.criteres_entree, buildDefaultCriteria(node.criteres_entree))
    expect(groupes.length).toBeGreaterThan(1)
  })

  it('ordonne les 8 sections selon le raisonnement clinique (ordre de 1re apparition)', () => {
    // Formulaire vierge + situation != naif + MCG disponible pour que les groupes masqués par défaut
    // (surveillance, traitement en cours, profil nocturne — masqué sans capteur) soient comptés eux aussi :
    // `situation_insuline` vaut sa 1re valeur déclarée (`naif`) sur un formulaire vierge, ce qui masquerait
    // `traitements_en_cours`/`mcg_disponible`/etc. ; `mcg_disponible` vaut `false` par défaut (`bool`), ce
    // qui masquerait à son tour `profil_nocturne` (P8/S7, 2026-07-30 : nouvelle section conditionnée au
    // capteur, comme l'était `profil_glycemique` avant elle).
    const criteria = {
      ...buildDefaultCriteria(node.criteres_entree),
      situation_insuline: 'basale_plus_bolus',
      mcg_disponible: true,
    }
    const groupes = grouperChamps(node.criteres_entree, criteria)
    expect(groupes.map((g) => g.libelle)).toEqual(GROUPES_ATTENDUS)
  })

  it('chaque champ rendu (formulaire vierge) appartient à l’un des 8 groupes attendus', () => {
    const groupes = grouperChamps(node.criteres_entree, buildDefaultCriteria(node.criteres_entree))
    for (const groupe of groupes) {
      expect(GROUPES_ATTENDUS).toContain(groupe.libelle)
    }
  })

  it('ne rend jamais un critère `derive` — les 7 dérivés du nœud restent hors formulaire', () => {
    const rendus = grouperChamps(node.criteres_entree, buildDefaultCriteria(node.criteres_entree)).flatMap((g) =>
      g.champs.map((c) => c.nom),
    )
    for (const derive of [
      'cible_atteinte',
      'risque_hypoglycemique_eleve',
      'terrain_cible_assouplie',
      'gaj_a_cible',
      'profil_nocturne_permet_titration',
      'profil_nocturne_a_cible',
      'over_basalisation',
    ]) {
      expect(rendus).not.toContain(derive)
    }
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

/**
 * T-137 (P13/S1) — le pré-remplissage peut désormais poser une LISTE, et « aucun élément » (`[]`) en est
 * une valeur comme une autre. Fixture inspirée de `prescription.yaml` (T-138) : `intention == initier`
 * pré-remplit `traitements` à `[]` — exactement le mécanisme qui rend « Insuline d'initiation ».
 */
describe('appliquerPreremplissage — T-137 (préremplissage de liste, « aucun » compris)', () => {
  const CRITERES_LISTE: CritereEntree[] = [
    { nom: 'intention', type: 'enum', valeurs: ['initier', 'intensifier'] },
    {
      nom: 'traitements',
      type: 'liste',
      valeurs: ['metformine', 'sulfamide'],
      visible_si: 'intention != initier',
      preremplissage: [{ quand: 'intention == initier', valeur: [] }],
    },
  ]

  it('une règle `valeur: []` sur un critère `liste` pose la liste vide et cite le critère dans `preremplis`', () => {
    // Le critère part d'une valeur RÉELLE (comme un patient déclaré sous `optimiser` avant de basculer
    // sur `initier`) : le point sous test ici est que la règle s'applique et pose `[]`, pas la
    // ré-application sur un champ déjà à `[]` (couverte par le test « anti-clignotement » ci-dessous).
    const r = appliquerPreremplissage(
      CRITERES_LISTE,
      { intention: 'initier', traitements: ['metformine'] },
      new Set(['intention']),
    )
    expect(r.criteria.traitements).toEqual([])
    expect(r.preremplis).toEqual(['traitements'])
  })

  it('la même règle sur un critère `enum`/`nombre` ne pose rien (garde-fou 1 : forme tableau réservée aux `liste`)', () => {
    const criteres: CritereEntree[] = [
      { nom: 'intention', type: 'enum', valeurs: ['initier', 'intensifier'] },
      {
        nom: 'cible',
        type: 'enum',
        valeurs: ['a', 'b'],
        preremplissage: [{ quand: 'intention == initier', valeur: [] as unknown as string }],
      },
    ]
    const r = appliquerPreremplissage(criteres, { intention: 'initier', cible: 'a' }, new Set(['intention']))
    expect(r.preremplis).toEqual([])
    expect(r.criteria.cible).toBe('a')
  })

  it('une `valeur: ["metformine", "inconnu"]` dont un élément n’est pas déclaré ne pose rien (garde-fou 2)', () => {
    const criteres: CritereEntree[] = [
      { nom: 'intention', type: 'enum', valeurs: ['initier', 'intensifier'] },
      {
        nom: 'traitements',
        type: 'liste',
        valeurs: ['metformine', 'sulfamide'],
        preremplissage: [{ quand: 'intention == initier', valeur: ['metformine', 'inconnu'] }],
      },
    ]
    const r = appliquerPreremplissage(criteres, { intention: 'initier', traitements: [] }, new Set(['intention']))
    expect(r.preremplis).toEqual([])
  })

  it('rejouer le pré-remplissage sur un critère déjà à `[]` ne le remet PAS dans `preremplis` (garde-fou 3, anti-clignotement)', () => {
    const premier = appliquerPreremplissage(
      CRITERES_LISTE,
      { intention: 'initier', traitements: ['metformine'] },
      new Set(['intention']),
    )
    expect(premier.preremplis).toEqual(['traitements'])

    // REJOUE avec la SORTIE du premier appel (le critère est maintenant à `[]`, exactement comme le
    // ferait `DecisionNodeScreen` en rappelant `appliquerPreremplissage` après un autre champ édité) :
    // sans le garde-fou de contenu, `[] !== []` (deux tableaux distincts) referait entrer le critère dans
    // `preremplis` à chaque appel, et la mention « · calculé » clignoterait.
    const second = appliquerPreremplissage(CRITERES_LISTE, premier.criteria, new Set(['intention']))
    expect(second.preremplis).toEqual([])
  })

  it('un critère déjà `touched` n’est jamais pré-rempli (non-régression R1)', () => {
    const r = appliquerPreremplissage(
      CRITERES_LISTE,
      { intention: 'initier', traitements: ['metformine'] },
      new Set(['intention', 'traitements']),
    )
    expect(r.preremplis).toEqual([])
    expect(r.criteria.traitements).toEqual(['metformine'])
  })

  it('un `quand` indéterminé ne pré-remplit rien (non-régression R7) — `intention` non renseignée', () => {
    const r = appliquerPreremplissage(CRITERES_LISTE, { intention: 'initier', traitements: ['metformine'] }, new Set())
    expect(r.preremplis).toEqual([])
  })
})

/**
 * CONTRAT T-138 (P13/S1) : un pré-remplissage masqué reste déterminé pour le moteur.
 *
 * POURQUOI CE TEST EXISTE, ET POURQUOI SON ASSERTION NE SE DEVINE PAS DE SA SEULE LECTURE. `preremplis`
 * n'est PAS purgé quand un champ devient masqué, alors que `touched` l'est (`DecisionNodeScreen.tsx:508`,
 * `reinitialiserChampsMasques` ne renvoie que `reinitialises`, jamais consommé pour vider `preremplis`).
 * Conséquence : un critère masqué mais pré-rempli reste « déterminé » pour le moteur
 * (`criteresRenseignes = touched ∪ preremplis`) — exactement l'effet dont T-138 a besoin pour que
 * « Insuline d'initiation » se rende quand l'intention est *Initier*. Ce test rejoue la SÉQUENCE EXACTE
 * de `DecisionNodeScreen.handleAnswer` (l.497-557 : `reinitialiserChampsMasques` PUIS
 * `appliquerPreremplissage`, dans cet ordre) pour vérifier que le pipeline complet — pas seulement
 * `appliquerPreremplissage` isolée — pose bien la liste vide ET la cite dans `preremplis`, MÊME QUAND la
 * valeur posée est identique à la valeur par défaut (`[]` = `[]`, le cas exact de T-138 : rien à
 * distinguer d'un champ jamais touché sinon la présence dans `preremplis`).
 *
 * Un refactoring innocent de `reinitialiserChampsMasques` qui purgerait aussi `preremplis` rouvrirait
 * N25 sans qu'aucun autre test ne rougisse — c'est ce contrat qui le ferait rougir.
 */
describe('contrat T-138 — un critère pré-rempli puis masqué reste dans `preremplis`, donc dans `criteresRenseignes`', () => {
  it('bascule intention → initier, sur un formulaire jamais touché : `traitements` masqué entre dans `preremplis`', () => {
    const criteresEntree: CritereEntree[] = [
      { nom: 'intention', type: 'enum', valeurs: ['initier', 'intensifier'] },
      {
        nom: 'traitements',
        type: 'liste',
        valeurs: ['metformine', 'sulfamide'],
        visible_si: 'intention != initier',
        preremplissage: [{ quand: 'intention == initier', valeur: [] }],
      },
    ]
    const criteria = buildDefaultCriteria(criteresEntree)
    const touched = new Set<string>()

    // Reproduit `DecisionNodeScreen.handleAnswer('intention', 'initier')`, l.497-557 : l'ordre exact
    // compte (`reinitialiserChampsMasques` AVANT `appliquerPreremplissage`).
    const next = { ...criteria, intention: 'initier' }
    const renseignesApres = new Set(touched).add('intention')
    const { criteria: nettoye, reinitialises } = reinitialiserChampsMasques(criteresEntree, next, renseignesApres)
    const touchedApres = new Set(touched).add('intention')
    for (const efface of reinitialises) touchedApres.delete(efface)
    const { criteria: avecPrerempli, preremplis } = appliquerPreremplissage(criteresEntree, nettoye, touchedApres)

    expect(avecPrerempli.traitements).toEqual([])
    expect(preremplis).toEqual(['traitements'])

    // `criteresRenseignes` (DecisionNodeScreen.tsx:287) = `touched` ∪ `preremplis` : `traitements` y
    // entre bien qu'il ne soit jamais dans `touched` (le champ est masqué, le praticien n'y touche pas).
    const criteresRenseignes = new Set([...touchedApres, ...preremplis])
    expect(criteresRenseignes.has('traitements')).toBe(true)
    expect(touchedApres.has('traitements')).toBe(false)
  })

  it('un critère pré-rempli VISIBLE puis masqué par un changement ultérieur reste dans `preremplis` (reinitialiserChampsMasques ne le purge pas)', () => {
    // Deuxième forme du contrat, plus proche de sa formulation littérale : le critère est D’ABORD
    // pré-rempli alors qu'il est VISIBLE, PUIS un autre champ le masque. `reinitialiserChampsMasques`
    // remet sa VALEUR à son défaut (sûreté R8) mais ne renvoie que `reinitialises` — jamais consommé pour
    // vider un ensemble `preremplis`, qui vit entièrement côté appelant (React state, hors de ce module).
    const criteresEntree: CritereEntree[] = [
      { nom: 'porte', type: 'bool' },
      {
        nom: 'cible',
        type: 'liste',
        valeurs: ['x', 'y'],
        visible_si: 'porte == true',
        preremplissage: [{ quand: 'porte == true', valeur: ['x'] }],
      },
    ]
    // État simulé : `cible` a déjà été pré-remplie à `['x']` pendant que `porte` était vraie.
    const criteriaVisible = { porte: true, cible: ['x'] }
    const preremplisAvant = new Set(['cible'])

    // Le praticien répond « non » à `porte` : `cible` devient masquée.
    const renseignes = new Set(['porte'])
    const { criteria: nettoye, reinitialises } = reinitialiserChampsMasques(
      criteresEntree,
      { ...criteriaVisible, porte: false },
      renseignes,
    )
    expect(nettoye.cible).toEqual([]) // remis au défaut (R8 : une valeur masquée ne pilote pas le moteur)
    expect(reinitialises).toEqual(['cible'])

    // `reinitialiserChampsMasques` ne connaît PAS `preremplis` : c'est à l'appelant de décider quoi en
    // faire. `DecisionNodeScreen` ne le purge que de `touched` (l.508), jamais de `preremplis` — le
    // contrat est donc que RIEN ici ne retire spontanément 'cible' de l'ensemble `preremplisAvant`.
    expect(preremplisAvant.has('cible')).toBe(true)
  })
})
