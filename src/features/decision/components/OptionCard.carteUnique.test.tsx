// @vitest-environment jsdom

/**
 * P12/S10 (T-136) — RÉGRESSION TROUVÉE AU NAVIGATEUR, PAS PAR LE BANC DE TEST. `useState(carteUnique ?
 * 'preuves' : null)` (`OptionCard.tsx`) ne fixe qu'un état INITIAL, lu une seule fois au montage —
 * `renderToStaticMarkup` (le reste des tests de ce dossier) ne fait qu'UN rendu et ne peut donc jamais
 * voir ce défaut. Constaté en conditions réelles sur `prescription`, profil « coronarien sous
 * metformine+gliptine » (S3, mesure.mjs) : la carte « Metformine — instaurer ou poursuivre » est SEULE
 * à l'écran juste après l'étape « orientation » du formulaire (`carteUnique=true`), puis REJOINTE par
 * trois autres cartes après l'étape « terrain » (`carteUnique=false`) — SANS jamais démonter (même
 * `key`, cf. `screens/DecisionNodeScreen.tsx`). Sans resynchronisation (l'effet ajouté dans
 * `OptionCard.tsx`), le panneau ouvert d'office restait ouvert pour toujours, cassant la compacité D45
 * dès que la carte cessait d'être seule sur son écran.
 *
 * CE FICHIER OBSERVE LA COMMANDE, PAS LE NOM DU PANNEAU. Le panneau ouvert d'office était
 * `--argumentaire` ; c'est `--preuves` depuis le 2026-08-04, où l'argument EBM a déménagé. Ce qui est
 * testé ici — un état initial resynchronisé sur changement de prop — n'a jamais dépendu de QUEL panneau
 * s'ouvre : le helper `commandeDuPanneauParDefaut` nomme donc son rôle, pas le panneau, pour qu'un
 * prochain déménagement ne demande qu'une ligne.
 *
 * Isolé au niveau du COMPOSANT (`rerender`), sans dépendre du contenu réel ni du formulaire (D8) : ce
 * fichier ne connaît ni nœud ni critère par son nom, une simple bascule de la prop `carteUnique` suffit
 * à reproduire la transition qui a révélé le défaut.
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { Option } from '../content/node.types'
import { OptionCard } from './OptionCard'

afterEach(() => {
  cleanup()
})

function optionDeBase(): Option {
  return {
    intitule: 'Option de test',
    role: 'geste',
    avantages: ['Avantage de test.'],
    inconvenients: ['Inconvénient de test.'],
    effet_attendu: 'Effet attendu de test (non chiffrable).',
    niveau_preuve: 'modere',
    conditions: ['toujours'],
  }
}

function carte(carteUnique: boolean) {
  return (
    <OptionCard
      option={optionDeBase()}
      badge={null}
      reasons={['toujours']}
      calculs={[]}
      calculsEnAttente={[]}
      motifRang={undefined}
      alertes={[]}
      carteUnique={carteUnique}
    />
  )
}

/** La commande du panneau ouvert d'office par `carteUnique` — aujourd'hui le badge de niveau de preuve,
 * qui commande `--preuves` (cf. docstring de tête). `getByRole` sur une expression : le libellé accessible
 * porte l'intitulé de l'option, dont ce fichier n'a pas à connaître la valeur (D8). */
function commandeDuPanneauParDefaut() {
  return screen.getByRole('button', { name: /^État des preuves/ })
}

describe('OptionCard — carteUnique, transition sans démontage (P12/S10, T-136)', () => {
  it('carteUnique=true au montage : le panneau ouvert d’office (--preuves) l’est bien', () => {
    render(carte(true))
    expect(commandeDuPanneauParDefaut().getAttribute('aria-expanded')).toBe('true')
  })

  it('LE DÉFAUT VISÉ : carteUnique passe de true à false SANS démontage (rerender) → le panneau se referme', () => {
    const { rerender } = render(carte(true))
    expect(commandeDuPanneauParDefaut().getAttribute('aria-expanded')).toBe('true')

    rerender(carte(false))

    expect(commandeDuPanneauParDefaut().getAttribute('aria-expanded')).toBe('false')
  })

  it('carteUnique passe de false à true (la carte, d’abord accompagnée, se retrouve seule) → le panneau s’ouvre', () => {
    const { rerender } = render(carte(false))
    expect(commandeDuPanneauParDefaut().getAttribute('aria-expanded')).toBe('false')

    rerender(carte(true))

    expect(commandeDuPanneauParDefaut().getAttribute('aria-expanded')).toBe('true')
  })

  it("un repli manuel (nouveau clic sur la commande) pendant que carteUnique RESTE true n'est pas annulé par un re-rendu sans changement de la prop", () => {
    const { rerender } = render(carte(true))
    expect(commandeDuPanneauParDefaut().getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(commandeDuPanneauParDefaut())
    expect(commandeDuPanneauParDefaut().getAttribute('aria-expanded')).toBe('false')

    // Re-rendu avec carteUnique INCHANGÉ (toujours true) — ne doit pas rouvrir ce que l'utilisateur a fermé.
    rerender(carte(true))
    expect(commandeDuPanneauParDefaut().getAttribute('aria-expanded')).toBe('false')
  })
})
