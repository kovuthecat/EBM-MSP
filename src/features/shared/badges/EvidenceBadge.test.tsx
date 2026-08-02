import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { NiveauPreuve } from '../types'
import { EvidenceBadge } from './EvidenceBadge'

/** Libellés attendus (`shared/types.ts`, échelle GRADE simplifiée). */
const LABELS_ATTENDUS: Record<NiveauPreuve, string> = {
  eleve: 'Preuve élevée',
  modere: 'Preuve modérée',
  faible: 'Preuve faible',
  'tres-faible': 'Preuve très faible',
}

function classe(html: string): string | undefined {
  return html.match(/class="([^"]+)"/)?.[1]
}

describe('EvidenceBadge', () => {
  it('rend le libellé exact pour chacun des 4 niveaux', () => {
    for (const [niveau, label] of Object.entries(LABELS_ATTENDUS) as [NiveauPreuve, string][]) {
      const html = renderToStaticMarkup(<EvidenceBadge niveau={niveau} />)
      expect(html).toContain(label)
    }
  })

  it('"tres-faible" produit une classe différente de "faible" (dette soldée, verrouillée par un test)', () => {
    const classeFaible = classe(renderToStaticMarkup(<EvidenceBadge niveau="faible" />))
    const classeTresFaible = classe(renderToStaticMarkup(<EvidenceBadge niveau="tres-faible" />))
    expect(classeFaible).toBe('evidence-badge evidence-badge--faible')
    expect(classeTresFaible).toBe('evidence-badge evidence-badge--tres-faible')
    expect(classeTresFaible).not.toBe(classeFaible)
  })

  it('aucun point ne subsiste dans le DOM (retour à la pastille de texte)', () => {
    for (const niveau of Object.keys(LABELS_ATTENDUS) as NiveauPreuve[]) {
      const html = renderToStaticMarkup(<EvidenceBadge niveau={niveau} />)
      expect(html).not.toContain('evidence-badge__dot')
      expect(html).not.toContain('data-rempli')
    }
  })

  it('le texte est visible directement, sans title ni .sr-only (pas de double annonce)', () => {
    const html = renderToStaticMarkup(<EvidenceBadge niveau="modere" />)
    expect(html).not.toContain('title=')
    expect(html).not.toContain('sr-only')
  })
})
