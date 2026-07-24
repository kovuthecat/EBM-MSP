import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Alerte } from '../content/node.types'
import { AlertList } from './AlertList'

describe('AlertList', () => {
  it('ne rend rien si aucune alerte', () => {
    expect(renderToStaticMarkup(<AlertList alertes={[]} />)).toBe('')
  })

  it('rend le message de chaque alerte', () => {
    const alertes: Alerte[] = [
      { quand: 'default', niveau: 'info', message: 'Rappel neutre.' },
      { quand: 'IMC >= 35', niveau: 'attention', message: 'Point de vigilance.' },
    ]
    const html = renderToStaticMarkup(<AlertList alertes={alertes} />)
    expect(html).toContain('Rappel neutre.')
    expect(html).toContain('Point de vigilance.')
  })

  it('distingue le style "attention" du style "info" (D15)', () => {
    const alertes: Alerte[] = [
      { quand: 'default', niveau: 'info', message: 'Info.' },
      { quand: 'x == true', niveau: 'attention', message: 'Attention.' },
    ]
    const html = renderToStaticMarkup(<AlertList alertes={alertes} />)
    expect(html).toContain('alert-list__item--info')
    expect(html).toContain('alert-list__item--attention')
  })

  it('traite une alerte sans `niveau` comme "info" (champ optionnel, D15)', () => {
    const alertes: Alerte[] = [{ quand: 'default', message: 'Sans niveau explicite.' }]
    const html = renderToStaticMarkup(<AlertList alertes={alertes} />)
    expect(html).toContain('alert-list__item--info')
    expect(html).not.toContain('alert-list__item--attention')
  })
})
