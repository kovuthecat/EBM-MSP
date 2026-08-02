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
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Noeud, Option } from '../content/node.types'
import { reinitialiserSession } from '../lib/sessionCriteres'
import { DecisionNodeScreen } from './DecisionNodeScreen'

const { NOEUD_A, NOEUD_B, NOEUD_ESP_A, NOEUD_ESP_B } = vi.hoisted(() => {
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

  // T-061 x T-057 (défaut signalé en recette P8 2026-07-30, §Scénario A/C) — SECOND couple de nœuds
  // synthétiques, DÉDIÉ à la suggestion d'espérance de vie : NOEUD_A/NOEUD_B ci-dessus n'ont qu'un seul
  // champ (`cible_partagee`) et `champCiblePartagee()` (plus bas) suppose un SEUL spinbutton à l'écran —
  // ajouter `age` à ces nœuds casserait ce sélecteur pour les quatre tests existants. Mêmes quatre drivers
  // que `DecisionNodeScreen.esperanceVie.test.tsx` (`age`/`fragilite`/`comorbidite_grave`/`antecedent_cv`),
  // déclarés `partage: true` cette fois (contrairement à ce fichier de test, qui n'exerce jamais la
  // reprise) — plus `esperance_vie` elle-même, également `partage: true` : nécessaire pour le second test
  // ci-dessous (un praticien qui l'a déjà choisie sur le nœud précédent), sans effet sur le premier (elle
  // n'est jamais `touched` sur NOEUD_ESP_A dans ce cas, donc jamais mémorisée ni reprise, cf.
  // `sessionCriteres.ts` `memoriserCriteres`).
  function buildNoeudEsperanceVie(id: string): Noeud {
    return {
      id,
      domaine: 'test',
      titre: `Nœud de test espérance de vie (${id})`,
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [
        { nom: 'age', type: 'nombre', min: 0, max: 110, partage: true },
        { nom: 'fragilite', type: 'bool', partage: true },
        { nom: 'comorbidite_grave', type: 'bool', partage: true },
        { nom: 'antecedent_cv', type: 'bool', partage: true },
        { nom: 'esperance_vie', type: 'enum', valeurs: ['longue', 'intermediaire', 'limitee'], partage: true },
      ],
      options: [SOCLE],
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

  return {
    NOEUD_A: buildNode('noeud-A'),
    NOEUD_B: buildNode('noeud-B'),
    NOEUD_ESP_A: buildNoeudEsperanceVie('noeud-esp-A'),
    NOEUD_ESP_B: buildNoeudEsperanceVie('noeud-esp-B'),
  }
})

vi.mock('../content/loadNodes', () => ({
  getNoeudById: (id: string) => [NOEUD_A, NOEUD_B, NOEUD_ESP_A, NOEUD_ESP_B].find((n) => n.id === id),
  getNoeudsByDomaine: () => [NOEUD_A, NOEUD_B, NOEUD_ESP_A, NOEUD_ESP_B],
  noeuds: [NOEUD_A, NOEUD_B, NOEUD_ESP_A, NOEUD_ESP_B],
  noeudsParDomaine: { test: [NOEUD_A, NOEUD_B, NOEUD_ESP_A, NOEUD_ESP_B] },
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

// Helpers du couple NOEUD_ESP_A/NOEUD_ESP_B (T-061 x T-057 ci-dessous) — mêmes sélecteurs que
// `DecisionNodeScreen.esperanceVie.test.tsx`, dupliqués plutôt qu'importés : ce sont de simples fonctions
// de requête DOM sans dépendance partagée, et les deux fichiers ciblent des nœuds synthétiques distincts.
function champAge(): HTMLInputElement {
  return screen.getByRole('spinbutton') as HTMLInputElement
}

function checkbox(nom: RegExp): HTMLInputElement {
  return screen.getByRole('checkbox', { name: nom }) as HTMLInputElement
}

function segmentEsperanceVie(libelle: string): HTMLButtonElement {
  const groupe = screen.getByRole('group', { name: 'Espérance de vie' })
  return within(groupe).getByRole('button', { name: libelle }) as HTMLButtonElement
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

/**
 * T-061 x T-057 — LE DÉFAUT DE CETTE SESSION, signalé en recette P8 (2026-07-30, §Scénario A/C, « signalé,
 * non corrigé ») : « Reprendre les valeurs de ce patient » levait la frontière ci-dessus SANS jamais
 * relancer la suggestion auto d'espérance de vie (T-061, `DecisionNodeScreen.esperanceVie.test.tsx`) —
 * `esperance_vie` restait « à confirmer » pour un patient dont l'âge et la fragilité venaient pourtant
 * d'être repris de l'écran précédent. Aucun test existant ne combinait les deux mécanismes :
 * `esperanceVie.test.tsx` ne passe jamais par une reprise de session (nœud monté à neuf) ; les tests
 * ci-dessus ne portent que sur `cible_partagee`, un critère que `hasEsperanceVieCritere` ne reconnaît pas
 * — T-061 n'y est structurellement jamais exercée. D'où ce second couple de nœuds (`NOEUD_ESP_A`/
 * `NOEUD_ESP_B`, déclarés en tête de fichier) et ce second `describe`, plutôt que d'étendre le premier.
 */
describe('DecisionNodeScreen — la reprise relance la suggestion d’espérance de vie (T-057 x T-061)', () => {
  it('« Reprendre les valeurs de ce patient » recalcule esperance_vie à partir des drivers repris', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_ESP_A.id} go={() => {}} />)
    fireEvent.change(champAge(), { target: { value: '88' } })
    fireEvent.click(checkbox(/Fragilité/))
    fireEvent.click(checkbox(/Comorbidité grave/))
    unmount()

    render(<DecisionNodeScreen nodeId={NOEUD_ESP_B.id} go={() => {}} />)
    // Avant le clic : la frontière de re-entrée est affichée, et rien n'a encore été (re)posé pour
    // `esperance_vie` — LE DÉFAUT signalé en recette laissait ce segment ainsi indéfiniment.
    expect(screen.getByText('Reprendre les valeurs de ce patient')).toBeTruthy()
    expect(segmentEsperanceVie('Limitée').getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(screen.getByText('Reprendre les valeurs de ce patient'))

    // `comorbidite_grave` (reprise) suffit seule à suggérer 'limitee' (`suggestEsperanceVie`) — le
    // correctif recalcule bien la suggestion à partir des valeurs REPRISES, exactement comme si le
    // praticien venait de les saisir ici.
    expect(segmentEsperanceVie('Limitée').getAttribute('aria-pressed')).toBe('true')
    expect(segmentEsperanceVie('Longue').getAttribute('aria-pressed')).toBe('false')
    // Marquée comme suggérée (`preremplis`), jamais comme affirmée par le praticien (`touched`) — même
    // mention que T-061 sur un montage frais (D20, `CriteriaForm.tsx` `renderOrigine`).
    expect(screen.getByText('· calculé, à vérifier', { exact: false })).toBeTruthy()
  })

  it('ne recalcule pas esperance_vie si le praticien l’avait déjà choisie sur le nœud précédent', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_ESP_A.id} go={() => {}} />)
    fireEvent.change(champAge(), { target: { value: '88' } })
    fireEvent.click(checkbox(/Comorbidité grave/)) // driverait seul vers 'limitee'
    fireEvent.click(segmentEsperanceVie('Longue')) // mais le praticien choisit lui-même 'longue'
    unmount()

    render(<DecisionNodeScreen nodeId={NOEUD_ESP_B.id} go={() => {}} />)
    fireEvent.click(screen.getByText('Reprendre les valeurs de ce patient'))

    // La valeur REPRISE est un choix du praticien (D28) : la suggestion ne l'écrase jamais, ici pas plus
    // qu'à la saisie directe (comportement déjà verrouillé par `esperanceVie.test.tsx`, non régressé par
    // ce correctif).
    expect(segmentEsperanceVie('Longue').getAttribute('aria-pressed')).toBe('true')
    expect(segmentEsperanceVie('Limitée').getAttribute('aria-pressed')).toBe('false')
  })
})
