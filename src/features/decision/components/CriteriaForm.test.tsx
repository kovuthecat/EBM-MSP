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

  it("ne marque PAS un `bool` décisif non renseigné, même présent dans aConfirmer", () => {
    const html = rendre(new Set(['ASCVD_etablie']))
    expect(html).not.toContain('data-confirmer')
    expect(html).not.toContain('à confirmer')
  })

  it("ne marque pas non plus un `enum` décisif non renseigné", () => {
    const html = rendre(new Set(['albuminurie']))
    expect(html).not.toContain('data-confirmer')
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

  it("n'affiche PAS « Rien à signaler » avec un seul `bool` décisif manquant (le geste direct suffit)", () => {
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
    expect(html).not.toContain('Rien à signaler')
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
