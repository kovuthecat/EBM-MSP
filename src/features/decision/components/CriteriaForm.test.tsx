import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { CritereEntree } from '../content/node.types'
import { buildDefaultCriteria, CriteriaForm } from './CriteriaForm'

// Régression du crash constaté en production sur le nœud C (« intensification ») : un critère de
// type `liste` (ex. `traitements_en_cours`, D13) initialisé comme une chaîne au lieu d'un tableau
// fait lever `ConditionError` dès la 1re évaluation (`contient`/`ne_contient_pas` exigent un
// tableau) — non rattrapée, écran blanc en production (aucun error boundary à l'époque).
const CRITERES_LISTE: CritereEntree[] = [
  { nom: 'age', type: 'nombre' },
  { nom: 'fragilite', type: 'bool' },
  { nom: 'esperance_vie', type: 'enum', valeurs: ['longue', 'limitee'] },
  { nom: 'traitements_en_cours', type: 'liste', valeurs: ['metformine', 'sulfamide', 'gliptine'] },
]

describe('buildDefaultCriteria', () => {
  it('initialise un critère `liste` comme un TABLEAU vide, jamais une chaîne', () => {
    const criteria = buildDefaultCriteria(CRITERES_LISTE)
    expect(Array.isArray(criteria.traitements_en_cours)).toBe(true)
    expect(criteria.traitements_en_cours).toEqual([])
  })

  it('conserve le comportement existant pour nombre/bool/enum', () => {
    const criteria = buildDefaultCriteria(CRITERES_LISTE)
    expect(criteria.age).toBe(0)
    expect(criteria.fragilite).toBe(false)
    expect(criteria.esperance_vie).toBe('longue')
  })
})

describe('CriteriaForm — critère de type `liste`', () => {
  it('rend une case à cocher par valeur possible (pas un <select> scalaire)', () => {
    const criteria = buildDefaultCriteria(CRITERES_LISTE)
    const html = renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES_LISTE}
        criteria={criteria}
        touched={new Set()}
        onChange={() => {}}
      />,
    )
    expect(html).toContain('Traitements en cours')
    // 3 valeurs possibles -> 3 checkboxes dédiées, plus la checkbox du critère bool `fragilite`.
    const nbCheckboxes = (html.match(/type="checkbox"/g) ?? []).length
    expect(nbCheckboxes).toBe(4)
  })

  it('reflète les valeurs déjà sélectionnées comme cochées', () => {
    const criteria = { ...buildDefaultCriteria(CRITERES_LISTE), traitements_en_cours: ['sulfamide'] }
    const html = renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES_LISTE}
        criteria={criteria}
        touched={new Set()}
        onChange={() => {}}
      />,
    )
    // react-dom/server rend `checked` en attribut HTML `checked=""` uniquement quand true. Les
    // libellés passent par `humanize()` (ex. "sulfamide" -> "Sulfamide") : on isole le bloc <label>
    // correspondant plutôt que de chercher la chaîne brute.
    const labelBlocks = html.split('<label')
    const sulfamideRow = labelBlocks.find((bloc) => bloc.includes('>Sulfamide<')) ?? ''
    const gliptineRow = labelBlocks.find((bloc) => bloc.includes('>Gliptine<')) ?? ''
    expect(sulfamideRow).toContain('checked=""')
    expect(gliptineRow).not.toContain('checked=""')
  })
})

// Tâche 3 (recette référent) : le marqueur visuel « à confirmer » (bord ambre + mention) ne doit
// apparaître que sur les critères de type `nombre` — une case décoche non cochée EST une réponse
// clinique complète (« non »), la marquer « à confirmer » suggère à tort qu'il faut la cocher.
describe('CriteriaForm — marqueur « à confirmer » restreint aux `nombre` (tâche 3)', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'HbA1c_actuelle', type: 'nombre', groupe: 'Contrôle' },
    { nom: 'ASCVD_etablie', type: 'bool', groupe: 'Comorbidités' },
    { nom: 'albuminurie', type: 'enum', valeurs: ['normo', 'macro'], groupe: 'Comorbidités' },
  ]

  const rendre = (aConfirmer: Set<string>) =>
    renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={buildDefaultCriteria(CRITERES)}
        touched={new Set()}
        pertinents={new Set(CRITERES.map((c) => c.nom))}
        aConfirmer={aConfirmer}
        onChange={() => {}}
      />,
    )

  it('marque un `nombre` décisif non renseigné (bord ambre + mention)', () => {
    const html = rendre(new Set(['HbA1c_actuelle']))
    expect(html).toContain('data-confirmer="true"')
    expect(html).toContain('à confirmer')
  })

  /**
   * ASSERTION INVERSÉE le 2026-07-27 (soir) — arbitrage référent A8, après la recette VISUELLE. Ce test
   * exigeait qu'un `bool` ORDINAIRE décisif ne porte JAMAIS le marqueur, au motif que « décoché EST la
   * réponse non ». Le motif est juste pour le MOTEUR (D20 : un `bool` sans `confirmation_requise` est
   * déterminé par défaut) et il ne l'était pas pour le PRATICIEN : sur `statine`, l'écran annonçait
   * « 1 critère décisif non confirmé » alors qu'aucun champ ne portait de marqueur — un compteur que
   * rien à l'écran ne permettait de résoudre.
   *
   * Le référent a tranché pour la congruence : compteur et marqueurs ont la même définition. La
   * contrepartie — une densité de marqueurs plus forte — est assumée et mesurée
   * (`docs/decision/validation/chantier-2026-07-27/mesure-densite-marqueurs.md`).
   */
  it('marque AUSSI un `bool` ORDINAIRE décisif non renseigné — A8 : compteur et marqueurs congruents', () => {
    const html = rendre(new Set(['ASCVD_etablie']))
    expect(html).toContain('data-confirmer="true"')
    expect(html).toContain('à confirmer')
  })

  /**
   * L'INVARIANT que l'arbitrage A8 institue, et la raison d'être de ce test : le nombre annoncé par le
   * bandeau est TOUJOURS le nombre de marqueurs affichés. C'est la propriété que la recette visuelle a
   * trouvée violée, et elle ne peut plus l'être sans faire échouer ce test.
   */
  it('autant de marqueurs affichés que de critères réclamés, quels que soient leurs types', () => {
    const reclames = new Set(['HbA1c_actuelle', 'ASCVD_etablie', 'albuminurie'])
    const html = rendre(reclames)
    expect(html.split('· à confirmer').length - 1).toBe(reclames.size)
  })

  /**
   * ASSERTION INVERSÉE le 2026-07-27 (défaut A de la recette référent). Ce test exigeait qu'un `enum`
   * décisif non renseigné NE PORTE PAS le marqueur — c'était cohérent avec la règle d'alors, « le
   * défaut d'un `enum` est une valeur du contenu, donc une réponse ». Cette règle était fausse : D20
   * range `enum` avec `nombre`, indéterminé tant qu'il n'est pas saisi, et le moteur le traite ainsi
   * depuis (`deriveCritere.ts` `critereEstDetermine`).
   *
   * L'écart avait une conséquence directe en consultation : `valeurParDefaut` initialise un `enum` à sa
   * première valeur déclarée, le segment s'allumait donc sans clic, et RIEN ne signalait que la réponse
   * manquait. L'écran affirmait une chose, le moteur en croyait une autre.
   */
  it('marque un `enum` décisif non renseigné — D20 le range avec `nombre` (indéterminé tant que non saisi)', () => {
    const html = rendre(new Set(['albuminurie']))
    expect(html).toContain('data-confirmer="true"')
    expect(html).toContain('à confirmer')
  })

  it('expose l’état des segments aux lecteurs d’écran (A9) — `aria-pressed`, `false` tant que non touché', () => {
    // `data-on` ne pilotait que le style : un lecteur d'écran annonçait des boutons indiscernables.
    // `false` partout tant que le critère n'est pas `touched` EST la représentation de l'indéterminé.
    const html = rendre(new Set(['albuminurie']))
    expect(html).toContain('aria-pressed="false"')
    expect(html).not.toContain('aria-pressed="true"')
  })

  it("n'allume aucun segment d'un `enum` non touché, même s'il porte sa valeur par défaut", () => {
    // Le pendant du marqueur, et la moitié qui MENTAIT : `buildDefaultCriteria` pose `albuminurie` à
    // `normo` (première valeur déclarée) sans que personne ne l'ait choisi. `touched` étant vide ici,
    // aucun `data-on` ne doit apparaître.
    const html = rendre(new Set(['albuminurie']))
    expect(html).not.toContain('data-on')
  })
})

// D20 R7 (SPEC-valeur-indeterminee.md §2.2) : un `bool` `confirmation_requise` N'EST PAS une case
// ordinaire — son « non » par défaut ne peut pas être présumé sans risque, il porte donc le même
// marqueur qu'un `nombre`, à la différence d'un `bool` classique (cf. suite précédente).
describe('CriteriaForm — `bool` `confirmation_requise` porte le marqueur « à confirmer » (D20 R7)', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'HbA1c_actuelle', type: 'nombre', groupe: 'Contrôle' },
    { nom: 'diabete_complique', type: 'bool', confirmation_requise: true, groupe: 'Comorbidités' },
    { nom: 'ASCVD_etablie', type: 'bool', groupe: 'Comorbidités' },
  ]

  const rendre = (aConfirmer: Set<string>) =>
    renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={buildDefaultCriteria(CRITERES)}
        touched={new Set()}
        pertinents={new Set(CRITERES.map((c) => c.nom))}
        aConfirmer={aConfirmer}
        onChange={() => {}}
      />,
    )

  it('marque un `bool` `confirmation_requise` décisif non renseigné (bord ambre + mention)', () => {
    const html = rendre(new Set(['diabete_complique']))
    expect(html).toContain('data-confirmer="true"')
    expect(html).toContain('à confirmer')
  })

  // INVERSÉ le 2026-07-27 (soir, A8) pour la même raison que ci-dessus : un `bool` ORDINAIRE réclamé
  // porte désormais le marqueur, exactement comme son voisin `confirmation_requise`. La distinction de
  // type reste réelle POUR LE MOTEUR (l'un est déterminé par défaut, l'autre non) — elle a simplement
  // cessé d'être visible à l'écran, où elle ne servait qu'à rendre un compteur insoluble.
  it('marque le `bool` ORDINAIRE comme son voisin `confirmation_requise` — la distinction reste au moteur, plus à l’écran', () => {
    const html = rendre(new Set(['diabete_complique', 'ASCVD_etablie']))
    const labelBlocks = html.split('<label')
    const ascvdRow = labelBlocks.find((bloc) => bloc.includes('Maladie cardiovasculaire')) ?? ''
    expect(ascvdRow).toContain('à confirmer')
  })

})

// Tâches 4 & 5 (recette référent) : pied de section avec rappel des `nombre` manquants et bouton
// « Rien à signaler » pour les `bool` manquants — purement dérivé du TYPE, aucun nom en dur.
describe('CriteriaForm — pied de section (tâches 4 & 5)', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'HbA1c_actuelle', type: 'nombre', groupe: 'Section' },
    { nom: 'DFG', type: 'nombre', groupe: 'Section' },
    { nom: 'ASCVD_etablie', type: 'bool', groupe: 'Section' },
    { nom: 'insuffisance_cardiaque', type: 'bool', groupe: 'Section' },
  ]

  it('affiche le rappel textuel des `nombre` décisifs manquants, avec leurs libellés', () => {
    const html = renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={buildDefaultCriteria(CRITERES)}
        touched={new Set()}
        pertinents={new Set(['HbA1c_actuelle', 'DFG'])}
        aConfirmer={new Set(['HbA1c_actuelle', 'DFG'])}
        onChange={() => {}}
      />,
    )
    expect(html).toContain('À renseigner dans cette section')
    expect(html).toContain('HbA1c actuelle (%)')
    expect(html).toContain('DFG')
  })

  it('affiche « Rien à signaler » quand ≥ 2 `bool` décisifs sont non renseignés, avec un handler fourni', () => {
    const html = renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={buildDefaultCriteria(CRITERES)}
        touched={new Set()}
        pertinents={new Set(['ASCVD_etablie', 'insuffisance_cardiaque'])}
        aConfirmer={new Set(['ASCVD_etablie', 'insuffisance_cardiaque'])}
        onConfirmerChamps={() => {}}
        onChange={() => {}}
      />,
    )
    expect(html).toContain('Rien à signaler')
  })

  // D20 R7 (SPEC-valeur-indeterminee.md §2.2) : seuil abaissé de 2 à 1 — un `bool` `confirmation_requise`
  // ISOLÉ (ex. `diabete_complique` sur `statine`) n'a, sans ce bouton, AUCUN moyen d'être confirmé
  // (compteur allumé, aucune action possible — l'impasse constatée en recette).
  it("affiche « Rien à signaler » avec un SEUL `bool` décisif manquant (seuil abaissé à 1, D20 R7)", () => {
    const html = renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={buildDefaultCriteria(CRITERES)}
        touched={new Set()}
        pertinents={new Set(['ASCVD_etablie'])}
        aConfirmer={new Set(['ASCVD_etablie'])}
        onConfirmerChamps={() => {}}
        onChange={() => {}}
      />,
    )
    expect(html).toContain('Rien à signaler')
  })

  it("n'affiche pas le bouton sans `onConfirmerChamps` fourni (rétro-compatible)", () => {
    const html = renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={buildDefaultCriteria(CRITERES)}
        touched={new Set()}
        pertinents={new Set(['ASCVD_etablie', 'insuffisance_cardiaque'])}
        aConfirmer={new Set(['ASCVD_etablie', 'insuffisance_cardiaque'])}
        onChange={() => {}}
      />,
    )
    expect(html).not.toContain('Rien à signaler')
  })
})

// Tâche 6b (recette référent) : un champ déjà `touched` n'est jamais estompé, même redevenu non pertinent.
describe('CriteriaForm — un champ `touched` n’est jamais estompé (tâche 6b)', () => {
  const CRITERES: CritereEntree[] = [{ nom: 'age', type: 'nombre' }]

  it('estompe un critère non pertinent et non touché', () => {
    const html = renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={buildDefaultCriteria(CRITERES)}
        touched={new Set()}
        pertinents={new Set()}
        onChange={() => {}}
      />,
    )
    expect(html).toContain('data-dim="true"')
  })

  it('ne l’estompe plus une fois `touched`, malgré la même absence de pertinence', () => {
    const html = renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={buildDefaultCriteria(CRITERES)}
        touched={new Set(['age'])}
        pertinents={new Set()}
        onChange={() => {}}
      />,
    )
    expect(html).not.toContain('data-dim')
  })
})

// D20 R7 (défauts de recette 12.2/13.3) : le rendu d'un `nombre` ne suit QUE `touched`, jamais la valeur
// stockée — c'est ce qui garantit qu'un champ « vidé » (retiré de `touched` par l'appelant, cf.
// `DecisionNodeScreen.tsx` `handleCriteriaEffacer`) redevient visuellement indiscernable d'un champ
// « jamais touché », plutôt que de continuer à afficher un « 0 » qui se lirait comme une vraie réponse.
// Pas de test d'INTERACTION (pas d'infra RTL/jsdom dans ce projet, cf. DECISIONS.md § tâche `liste`) : la
// branche `onEffacer` de `CriteriaForm.tsx` (déclenchée par un `<input>` vidé) est validée visuellement.
describe('CriteriaForm — un `nombre` non `touched` affiche toujours un champ VIDE, jamais la valeur stockée (D20 R7)', () => {
  const CRITERES: CritereEntree[] = [{ nom: 'DFG', type: 'nombre' }]

  it('valeur par défaut (0) ET non `touched` → champ vide (jamais saisi)', () => {
    const html = renderToStaticMarkup(
      <CriteriaForm criteresEntree={CRITERES} criteria={{ DFG: 0 }} touched={new Set()} onChange={() => {}} />,
    )
    expect(html).not.toContain('value="0"')
  })

  it('même valeur stockée (0) mais `touched` → « 0 » AFFICHÉ (une vraie réponse « zéro »)', () => {
    const html = renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={{ DFG: 0 }}
        touched={new Set(['DFG'])}
        onChange={() => {}}
      />,
    )
    expect(html).toContain('value="0"')
  })
})


/**
 * A7 — le repère de départ, rendu. `criteresPilotes` (testé dans `lib/formLayout.test.ts`) désigne le
 * champ ; ici on vérifie qu'il est bien RENDU, et qu'il disparaît une fois répondu — une fois la réponse
 * donnée, il n'y a plus lieu d'y envoyer le praticien.
 */
describe('CriteriaForm — A7 : repère de départ sur le champ pilote', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'intention', type: 'enum', valeurs: ['initier', 'optimiser'], groupe: 'Section' },
    { nom: 'traitements_en_cours', type: 'liste', valeurs: ['metformine'], groupe: 'Section', visible_si: 'intention != initier' },
  ]

  const rendre = (touched: ReadonlySet<string>) =>
    renderToStaticMarkup(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={buildDefaultCriteria(CRITERES)}
        touched={touched}
        onChange={() => {}}
      />,
    )

  it('marque le champ pilote tant qu’il n’est pas répondu', () => {
    const html = rendre(new Set())
    expect(html).toContain('data-pilote="true"')
    expect(html).toContain('détermine la suite')
  })

  it('retire le repère dès que le pilote est répondu', () => {
    const html = rendre(new Set(['intention']))
    expect(html).not.toContain('data-pilote')
    expect(html).not.toContain('détermine la suite')
  })

  it('ne marque QUE le pilote, pas les champs qu’il commande', () => {
    const html = rendre(new Set())
    // Un seul repère à l'écran : le signal perdrait tout son sens s'il était porté par plusieurs champs.
    expect(html.split('détermine la suite').length - 1).toBe(1)
  })
})
