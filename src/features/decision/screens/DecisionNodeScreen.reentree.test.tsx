// @vitest-environment jsdom

/**
 * T-057 (P8 · S2, 2026-07-30) — UNE RE-ENTRÉE DANS UN NŒUD NE PEUT PLUS RENDRE LA RECO DU PATIENT
 * PRÉCÉDENT.
 *
 * Reproduit exactement le DÉFAUT MAJEUR de la recette du 2026-07-30 (« entre N2 et N3 », 3 clics) : un
 * nœud RE-OUVERT, dont TOUS les critères renseignés viennent de la mémoire de session (D28,
 * `lib/sessionCriteres.ts`), affichait une recommandation BADGÉE ET FINIE construite pour le patient
 * PRÉCÉDENT, avec « repris de votre saisie » — sans que rien n'ait été saisi sur CET écran.
 *
 * MÊME CONVENTION que `sessionCriteres.remount.test.tsx` (nœuds SYNTHÉTIQUES, un critère `partage`
 * commun, `unmount()`/`render()` pour simuler la sortie/ré-ouverture d'un nœud — pas de rechargement de
 * page, D28 reste vivant). Un SECOND critère, non `partage`, laissé à sa valeur par défaut : une option
 * en dépend RÉELLEMENT, pour que la carte affichée ne soit pas qu'un socle « toujours » indépendant de
 * la valeur reprise — fidèle au nœud réel `cible-glycemique`, où toutes les options décisives dépendent
 * de critères `partage: true`.
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Noeud, Option } from '../content/node.types'
import { reinitialiserSession } from '../lib/sessionCriteres'
import { DecisionNodeScreen } from './DecisionNodeScreen'

const { NOEUD_A, NOEUD_B } = vi.hoisted(() => {
  const SOCLE: Option = {
    intitule: 'Socle',
    role: 'socle',
    conditions: ['toujours'],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
  }
  const OPTION_CIBLE: Option = {
    intitule: 'Option cible',
    role: 'geste',
    conditions: ['cible_partagee >= 5'],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
  }

  function buildNode(id: string): Noeud {
    return {
      id,
      domaine: 'test',
      titre: `Nœud de test (${id})`,
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [{ nom: 'cible_partagee', type: 'nombre', min: 0, max: 20, partage: true }],
      options: [SOCLE, OPTION_CIBLE],
      argumentaire: 'x',
      sources: {
        references_primaires: [],
        synthese_critique: { donnee: '', references: [] },
        reco_officielle: { source: '', position: '', divergence: false, explication: '' },
      },
      incertitudes: [],
      veille_liee: [],
      meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide', version: '1.0', changelog: [] },
    }
  }

  return { NOEUD_A: buildNode('noeud-A'), NOEUD_B: buildNode('noeud-B') }
})

vi.mock('../content/loadNodes', () => ({
  getNoeudById: (id: string) => [NOEUD_A, NOEUD_B].find((n) => n.id === id),
  getNoeudsByDomaine: () => [NOEUD_A, NOEUD_B],
  noeuds: [NOEUD_A, NOEUD_B],
  noeudsParDomaine: { test: [NOEUD_A, NOEUD_B] },
}))

vi.mock('../content/loadModules', () => ({
  getModuleDuNoeud: () => undefined,
  getModuleById: () => undefined,
  entreesListe: () => [],
}))

afterEach(() => {
  cleanup()
  reinitialiserSession()
})

function champCiblePartagee(): HTMLInputElement {
  return screen.getByRole('spinbutton') as HTMLInputElement
}

function titresCartes(container: HTMLElement): string[] {
  return [...container.querySelectorAll('.option-card__title')].map((el) => el.textContent ?? '')
}

describe('DecisionNodeScreen — frontière de re-entrée (T-057, P8 · S2)', () => {
  it('un nœud ré-ouvert dont TOUT vient de la reprise ne rend AUCUNE carte tant que rien n’a été saisi ici', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    fireEvent.change(champCiblePartagee(), { target: { value: '7' } })
    unmount()

    const { container } = render(<DecisionNodeScreen nodeId={NOEUD_B.id} go={() => {}} />)
    // Repris, bien affiché dans le FORMULAIRE (D28, inchangé) :
    expect(champCiblePartagee().value).toBe('7')
    expect(screen.getByText('· repris de votre saisie', { exact: false })).toBeTruthy()
    // ... mais AUCUNE carte badgée dans la colonne résultats — c'est le défaut corrigé — et le choix
    // explicite est proposé à la place.
    expect(titresCartes(container)).toEqual([])
    expect(screen.getByText('Reprendre les valeurs de ce patient')).toBeTruthy()
    expect(screen.getByText('Repartir de zéro')).toBeTruthy()
  })

  it('« Reprendre les valeurs de ce patient » lève la frontière, une fois, pour ce montage', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    fireEvent.change(champCiblePartagee(), { target: { value: '7' } })
    unmount()

    const { container } = render(<DecisionNodeScreen nodeId={NOEUD_B.id} go={() => {}} />)
    fireEvent.click(screen.getByText('Reprendre les valeurs de ce patient'))

    expect(titresCartes(container).sort()).toEqual(['Option cible', 'Socle'])
    // La reprise elle-même n'est pas défaite : la valeur et sa mention restent affichées.
    expect(champCiblePartagee().value).toBe('7')
    expect(screen.getByText('· repris de votre saisie', { exact: false })).toBeTruthy()
    // Le choix a disparu : un clic suffit, pas un par re-rendu.
    expect(screen.queryByText('Reprendre les valeurs de ce patient')).toBeNull()
  })

  it('« Repartir de zéro » vide le formulaire ET purge la mémoire de session (même geste que « Nouveau patient »)', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    fireEvent.change(champCiblePartagee(), { target: { value: '7' } })
    unmount()

    const { container } = render(<DecisionNodeScreen nodeId={NOEUD_B.id} go={() => {}} />)
    fireEvent.click(screen.getByText('Repartir de zéro'))

    expect(champCiblePartagee().value).toBe('')
    expect(screen.queryByText('· repris de votre saisie', { exact: false })).toBeNull()
    // Formulaire vide → `cible_partagee` reste sous 5 → seul le socle reste applicable.
    expect(titresCartes(container)).toEqual(['Socle'])

    // La mémoire de session est bien purgée : un nœud A ré-ouvert ensuite ne retrouve plus rien non plus.
    cleanup()
    render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    expect(champCiblePartagee().value).toBe('')
    expect(screen.queryByText('· repris de votre saisie', { exact: false })).toBeNull()
  })

  it('une saisie normale (navigation en avant) n’est jamais interceptée, même quand des valeurs sont reprises', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    fireEvent.change(champCiblePartagee(), { target: { value: '7' } })
    unmount()

    const { container } = render(<DecisionNodeScreen nodeId={NOEUD_B.id} go={() => {}} />)
    // Le praticien MODIFIE la valeur reprise sur ce nœud : un geste réel, pas une ré-ouverture passive.
    fireEvent.change(champCiblePartagee(), { target: { value: '12' } })

    expect(screen.queryByText('Reprendre les valeurs de ce patient')).toBeNull()
    expect(titresCartes(container).sort()).toEqual(['Option cible', 'Socle'])
  })

  it('un nœud SANS aucune reprise (premier patient) ne montre jamais le choix', () => {
    // NOEUD_A, jamais ouvert avant dans cette session : rien à reprendre.
    const { container } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    expect(screen.queryByText('Reprendre les valeurs de ce patient')).toBeNull()
    expect(titresCartes(container)).toEqual(['Socle'])
  })
})
