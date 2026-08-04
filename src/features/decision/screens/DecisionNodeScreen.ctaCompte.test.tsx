// @vitest-environment jsdom

/**
 * T-113 (P11/S7) — LE CTA MOBILE NE COMPTE PLUS LES OPTIONS REPLIÉES.
 *
 * LE DÉFAUT REPRODUIT ICI. Le bouton flottant « Voir les recommandations (N) », affiché sous 960px,
 * annonçait `optionsRenduesCount` — un aplatissement de `vue.familles` EN ENTIER, y compris les cartes
 * que le plafond d'affichage K5 (`lib/replierAffichage.ts`, `PLAFOND_PISTES = 5`) replie derrière
 * « Autres pistes possibles (N) ». Le praticien qui suit le bouton lisait donc un nombre qu'il ne
 * retrouvait pas à l'écran sans un geste de plus. Le correctif fait porter le compte sur
 * `plafonnerPistes(vue).principales` — les options effectivement visibles SANS déplier le repli.
 *
 * NŒUD SYNTHÉTIQUE (même discipline que `DecisionNodeScreen.interaction.test.tsx`/`.legende.test.tsx`) :
 * 8 options `geste`, toutes applicables (`toujours`) — 8 > `PLAFOND_PISTES`, donc le repli K5 s'active
 * forcément, quelle que soit l'implémentation exacte de `plafonnerPistes` (déjà testée isolément par
 * `lib/replierAffichage.test.ts`, hors périmètre ici). Seul le point vérifié : le nombre affiché par CE
 * bouton est bien le compte des options VISIBLES, strictement inférieur au total déclaré par le nœud —
 * jamais l'aplatissement complet d'avant cette session.
 *
 * `window.matchMedia` MOQUÉ (jsdom ne l'implémente pas, cf. `DecisionNodeScreen.tsx` `supportsMatchMedia`)
 * pour forcer `isNarrow = true` dès le montage — sans quoi le CTA (`< 960px` seulement) ne serait jamais
 * rendu et ce test ne pourrait rien vérifier. Portée à ce seul fichier (chaque fichier de test obtient son
 * propre `window` jsdom, cf. `@vitest-environment jsdom` en tête) : n'affecte aucun autre test du dépôt.
 */
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Noeud, Option } from '../content/node.types'
import { PLAFOND_PISTES } from '../lib/replierAffichage'
import { DecisionNodeScreen } from './DecisionNodeScreen'

const NB_OPTIONS_GESTE = 7 // + 1 socle = 8 options au total, > PLAFOND_PISTES (5)

const NODE = vi.hoisted(() => {
  function opt(intitule: string, extra: Partial<Option> = {}): Option {
    return {
      intitule,
      role: 'geste',
      conditions: ['toujours'],
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
      ...extra,
    }
  }

  const socle: Option = { ...opt('Socle'), role: 'socle' }
  const gestes = Array.from({ length: 7 }, (_, i) => opt(`Geste ${i}`))

  const noeud: Noeud = {
    id: 'noeud-cta-compte-test',
    domaine: 'test',
    titre: 'Nœud de test (CTA — compte)',
    population_cible: 'test',
    selection: 'multi-options',
    criteres_entree: [{ nom: 'critere_neutre', type: 'bool', groupe: 'Divers', presomption_non: true }],
    options: [socle, ...gestes],
    argumentaire: 'x',
    sources: {
      references_primaires: [],
      synthese_critique: { donnee: '' },
      reco_officielle: { source: '', position: '', divergence: false, explication: '' },
    },
    incertitudes: [],
    veille_liee: [],
    meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide' as const, version: '1.0', changelog: [] },
  }
  return noeud
})

vi.mock('../content/loadNodes', () => ({
  getNoeudById: (id: string) => (id === NODE.id ? NODE : undefined),
  getNoeudsByDomaine: () => [NODE],
  noeuds: [NODE],
  noeudsParDomaine: { test: [NODE] },
}))

beforeAll(() => {
  // jsdom ne fournit pas `matchMedia` (cf. `DecisionNodeScreen.tsx` `supportsMatchMedia`) : on le crée
  // de toutes pièces pour ce fichier, `lib.dom.d.ts` déclare `Window.matchMedia` comme accessible en
  // écriture — pas besoin de `@ts-expect-error` ici (vérifié par `tsc -b`, cf. `npm run build`).
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

afterEach(cleanup)

describe('DecisionNodeScreen — compte du CTA flottant mobile (T-113)', () => {
  it('sur un profil au-delà du plafond K5, le compte du CTA est strictement inférieur au total des options', () => {
    render(<DecisionNodeScreen nodeId={NODE.id} go={() => {}} />)
    const total = 1 + NB_OPTIONS_GESTE // socle + gestes
    expect(total).toBeGreaterThan(PLAFOND_PISTES)

    const bouton = screen.getByRole('button', { name: /Voir les recommandations/ })
    const match = bouton.textContent?.match(/\((\d+)\)/)
    expect(match).not.toBeNull()
    const compteAffiche = Number(match?.[1])

    expect(compteAffiche).toBeLessThan(total)
    // Cohérent avec le repli K5 : jamais plus que le plafond ne peut en montrer sans déplier « Autres
    // pistes possibles ».
    expect(compteAffiche).toBeLessThanOrEqual(PLAFOND_PISTES)
  })
})
