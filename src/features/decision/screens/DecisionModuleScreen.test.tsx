// @vitest-environment jsdom

/**
 * Écran de MODULE (DECISIONS.md D22). Les assertions portent sur ce qui ferait échouer le mécanisme en
 * consultation, pas sur la mise en forme :
 *  - le cadrage partagé est bien rendu (c'est sa raison d'être : le poser une fois pour tous les nœuds) ;
 *  - chaque orientation ouvre le bon nœud ;
 *  - le GARDE-FOU R1 tient : le module n'expose aucune saisie et ne transmet aucune valeur — une
 *    régression vers un chaînage obligatoire se verrait ici.
 */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { getModuleById, modules } from '../content/loadModules'
import { DecisionModuleScreen } from './DecisionModuleScreen'

const MODULE = modules[0]
if (!MODULE) throw new Error('Aucun module dans /content/modules — ce test suppose au moins un module.')

describe('DecisionModuleScreen (D22)', () => {
  it('rend le titre et TOUS les énoncés du cadrage partagé', () => {
    const { container } = render(<DecisionModuleScreen moduleId={MODULE.id} go={vi.fn()} />)
    expect(screen.getByRole('heading', { name: MODULE.titre })).toBeTruthy()
    const rendu = (container.textContent ?? '').replace(/\s+/g, ' ')
    for (const enonce of MODULE.cadrage) {
      // Fragment stable : le texte YAML est replié sur plusieurs lignes, le DOM le rend sur une seule.
      expect(rendu).toContain(enonce.replace(/\s+/g, ' ').slice(0, 60))
    }
  })

  it('chaque orientation ouvre le nœud qu\'elle désigne', () => {
    const go = vi.fn()
    const { container } = render(<DecisionModuleScreen moduleId={MODULE.id} go={go} />)
    const boutons = [...container.querySelectorAll('.decision-module__orientation')]
    expect(boutons).toHaveLength(MODULE.primer.orientations.length)

    MODULE.primer.orientations.forEach((orientation, index) => {
      go.mockClear()
      fireEvent.click(boutons[index]!)
      expect(go).toHaveBeenCalledWith('decisionNode', { nodeId: orientation.noeud })
    })
  })

  it("n'expose AUCUN champ de saisie (garde-fou R1 : flux d'écran, jamais chaînage)", () => {
    // Si un jour un critère de terrain « partagé » est ajouté ici, ce test échouera — et c'est voulu :
    // ce serait une décision d'architecture (état de saisie inter-écrans), pas un détail d'écran.
    const { container } = render(<DecisionModuleScreen moduleId={MODULE.id} go={vi.fn()} />)
    expect(container.querySelectorAll('input, select, textarea').length).toBe(0)
  })

  it('un id inconnu ne plante pas et laisse une porte de sortie', () => {
    const go = vi.fn()
    render(<DecisionModuleScreen moduleId="module-inexistant" go={go} />)
    expect(screen.getByText('Module introuvable.')).toBeTruthy()
    fireEvent.click(screen.getByText(/Aide à la décision/))
    expect(go).toHaveBeenCalledWith('decisionDomains')
  })

  it('le module de contenu est bien celui attendu par la jointure', () => {
    expect(getModuleById(MODULE.id)?.libelle).toBe(MODULE.libelle)
  })
})
