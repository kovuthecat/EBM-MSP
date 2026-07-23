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
