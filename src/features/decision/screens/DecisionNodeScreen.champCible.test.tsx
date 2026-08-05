// @vitest-environment jsdom

/**
 * T-157 (P13/S8, P5) — LES CRITÈRES RÉCLAMÉS PAR LE CARTOUCHE « EN ATTENTE » MÈNENT À LEUR CHAMP.
 *
 * LE DÉFAUT MESURÉ (`docs/decision/CONSTRUIRE-UN-MODULE.md` §4, « la réponse arrive hors de portée du
 * regard ») : 2 207 px entre « À renseigner pour trancher : Espérance de vie » et son champ, aucun renvoi
 * cliquable. Le correctif : chaque nom de critère du cartouche devient un `button` qui ouvre sa section
 * (`CriteriaForm` → `champCible`, cf. sa docstring) et focalise le champ — SAUF si ce champ n'est pas
 * ATTEIGNABLE (section masquée par `visible_si`, R11), auquel cas le nom reste du texte simple (Décision
 * clé, S8.md : « un lien mort est pire que pas de lien »).
 *
 * DEUX NŒUDS SYNTHÉTIQUES (même discipline que `DecisionNodeScreen.interaction.test.tsx`/`.ctaCompte.
 * test.tsx` : un nœud par comportement, DECISIONS.md D8) :
 *  - `NODE_ATTEIGNABLE` : deux sections, le critère manquant vit dans la SECONDE (repliée par défaut) —
 *    prouve que le clic l'ouvre et y porte le focus ;
 *  - `NODE_MASQUE` : le critère manquant est cité par une option mais sa section n'a AUCUN champ visible
 *    (`cache.visible_si` faux dès le rendu initial, via `presomption_non` sur le champ qui la pilote,
 *    aucune interaction requise) — reproduit le cas R11 (« critère décisif dans une section masquée »).
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Noeud, Option } from '../content/node.types'
import { DecisionNodeScreen } from './DecisionNodeScreen'

const { NODE_ATTEIGNABLE, NODE_MASQUE } = vi.hoisted(() => {
  // `opt`/`metaCommune` définis À L'INTÉRIEUR de la factory `vi.hoisted` (même discipline que
  // `DecisionNodeScreen.interaction.test.tsx`/`.ctaCompte.test.tsx`) : `vi.mock`/`vi.hoisted` sont
  // hoistés au-dessus des imports par le transform Vitest, une fonction déclarée au niveau module
  // ordinaire ne l'est pas au même titre.
  function opt(intitule: string, conditions: string[]): Option {
    return {
      intitule,
      role: 'geste',
      conditions,
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
    }
  }

  function metaCommune() {
    return {
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
  }

  function buildAtteignableNode(): Noeud {
    return {
      id: 'noeud-champ-cible-atteignable-test',
      domaine: 'test',
      titre: 'Nœud de test (champ atteignable)',
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [
        { nom: 'intro', type: 'bool', groupe: 'Intro' },
        { nom: 'cible', type: 'nombre', groupe: 'Suite' },
      ],
      options: [opt('Option', ['cible > 5'])],
      ...metaCommune(),
    }
  }

  function buildMasqueNode(): Noeud {
    return {
      id: 'noeud-champ-cible-masque-test',
      domaine: 'test',
      titre: 'Nœud de test (champ masqué — R11)',
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [
        // `presomption_non: true` : déterminé à `false` SANS avoir été touché (D30) — `cache` est donc
        // masqué (`visible_si: "gate == true"`) DÈS LE PREMIER RENDU, aucune interaction requise pour
        // reproduire R11 (« critère décisif dans une section masquée »).
        { nom: 'gate', type: 'bool', groupe: 'Intro', presomption_non: true },
        { nom: 'cache', type: 'nombre', groupe: 'Suite', visible_si: 'gate == true' },
      ],
      options: [opt('Option', ['cache > 5'])],
      ...metaCommune(),
    }
  }

  return { NODE_ATTEIGNABLE: buildAtteignableNode(), NODE_MASQUE: buildMasqueNode() }
})

vi.mock('../content/loadNodes', () => {
  const tousLesNoeudsTest = [NODE_ATTEIGNABLE, NODE_MASQUE]
  return {
    getNoeudById: (id: string) => tousLesNoeudsTest.find((n) => n.id === id),
    getNoeudsByDomaine: () => tousLesNoeudsTest,
    noeuds: tousLesNoeudsTest,
    noeudsParDomaine: { test: tousLesNoeudsTest },
  }
})

afterEach(cleanup)

describe('DecisionNodeScreen — le cartouche « en attente » mène au champ en un clic (T-157)', () => {
  it('un critère ATTEIGNABLE (section repliée, pas masquée) : le cartouche le rend cliquable ; le clic ouvre sa section et y focalise le champ', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_ATTEIGNABLE.id} go={() => {}} />)

    // « Suite » (qui porte `cible`) est repliée par défaut — seule « Intro » (premier groupe) est ouverte.
    const titreSuite = [...container.querySelectorAll('.criteria-form__group-header-bouton')].find((b) =>
      b.textContent?.startsWith('Suite'),
    )
    expect(titreSuite).toBeDefined()

    const lien = screen.getByRole('button', { name: 'Aller au champ « Cible »' })
    fireEvent.click(lien)

    // La section « Suite » s'est ouverte : son en-tête n'est plus un bouton replié.
    const titreSuiteApres = [...container.querySelectorAll('.criteria-form__group-header-bouton')].find((b) =>
      b.textContent?.startsWith('Suite'),
    )
    expect(titreSuiteApres).toBeUndefined()

    // Le focus est arrivé sur LE champ visé, pas seulement dans sa section.
    const inputCible = container.querySelector('input[type="number"]')
    expect(inputCible).not.toBeNull()
    expect(document.activeElement).toBe(inputCible)
  })

  it("un critère NON ATTEIGNABLE (sa section n'a aucun champ visible, R11) : le cartouche le rend en texte simple, jamais cliquable", () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_MASQUE.id} go={() => {}} />)

    // `container.querySelector` plutôt que `getByText(regex)` : un matcher REGEXP ignore `exact` (piège
    // connu de testing-library) et matche donc TOUT ancêtre dont le `textContent` contient la phrase —
    // ici le `<p>` ET son parent `.decision-node__en-attente`, « plusieurs éléments trouvés ». La classe
    // du cartouche est déjà unique dans le DOM : pas besoin de passer par un texte pour l'atteindre.
    const cartouche = container.querySelector('.decision-node__en-attente')
    if (!cartouche) throw new Error('cartouche « en attente » introuvable')
    // Le cartouche cite bien `cache` (le moteur le réclame, indépendamment de la visibilité).
    expect(cartouche.textContent).toContain('Cache')

    // Aucun lien : un lien mort serait pire que pas de lien (Décision clé, S8.md).
    expect(screen.queryByRole('button', { name: /Aller au champ/i })).toBeNull()
  })
})
