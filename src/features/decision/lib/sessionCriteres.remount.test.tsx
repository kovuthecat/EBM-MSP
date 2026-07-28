// @vitest-environment jsdom

/**
 * Preuve bout en bout de T-026/D33 (« Nouveau patient ») — le défaut D-13/F-C de
 * `docs/decision/validation/recette-navigateur-2026-07-28.md` : « HbA1c cible · repris de votre saisie »
 * survivait d'un patient à l'autre, sans aucun geste pour l'effacer.
 *
 * Ce fichier rejoue exactement la mécanique que `App.tsx` orchestre au clic sur le bouton (couvert côté
 * geste/confirmation par `Header.test.tsx`) : une valeur SAISIE sur un premier nœud (patient A), reprise
 * sur un second nœud (patient B, comme dans la recette — deux nœuds distincts, un critère `partage`
 * commun), PUIS `reinitialiserSession()` (la purge exposée par T-026), PUIS un nœud RE-MONTÉ (nouvelle
 * instance React, ce que produit le `key` avancé dans `App.tsx`). Sans la purge, cette dernière étape
 * reproduirait D-13 telle quelle ; avec elle, aucune reprise ne doit plus apparaître.
 *
 * Nœuds SYNTHÉTIQUES (mêmes conventions que
 * `screens/DecisionNodeScreen.interaction.test.tsx` — contenu mocké via `getNoeudById`, générique,
 * aucun nom de critère clinique réel, DECISIONS.md D8) : ce fichier ne dépend d'aucun contenu DT2 et ne
 * touche ni `screens/DecisionNodeScreen.tsx` ni `components/` (hors périmètre S5) — il les IMPORTE en
 * boîte noire, exactement comme le fait déjà le fichier cité ci-dessus.
 */
import { cleanup, render, fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Noeud, Option } from '../content/node.types'
import { DecisionNodeScreen } from '../screens/DecisionNodeScreen'
import { reinitialiserSession } from './sessionCriteres'

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

  // Un seul critère `nombre`, déclaré `partage: true` à l'IDENTIQUE sur les deux nœuds (invariant I4,
  // rappelé par `sessionCriteres.ts` `valeurCompatible`) — c'est la condition pour que la valeur circule.
  function buildNode(id: string): Noeud {
    return {
      id,
      domaine: 'test',
      titre: `Nœud de test (${id})`,
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [{ nom: 'cible_partagee', type: 'nombre', min: 6, max: 9.5, partage: true }],
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

  return { NOEUD_A: buildNode('noeud-A'), NOEUD_B: buildNode('noeud-B') }
})

vi.mock('../content/loadNodes', () => ({
  getNoeudById: (id: string) => [NOEUD_A, NOEUD_B].find((n) => n.id === id),
  getNoeudsByDomaine: () => [NOEUD_A, NOEUD_B],
  noeuds: [NOEUD_A, NOEUD_B],
  noeudsParDomaine: { test: [NOEUD_A, NOEUD_B] },
}))

// Aucun module déclaré pour ces nœuds : `getModuleDuNoeud` (appelé par `DecisionNodeScreen`) doit
// pouvoir répondre `undefined` sans lever — mock minimal, pas de comportement de module à tester ici.
vi.mock('../content/loadModules', () => ({
  getModuleDuNoeud: () => undefined,
  getModuleById: () => undefined,
  entreesListe: () => [],
}))

afterEach(() => {
  cleanup()
  reinitialiserSession()
})

/** Le seul champ `nombre` du nœud synthétique. */
function champCiblePartagee(): HTMLInputElement {
  return screen.getByRole('spinbutton') as HTMLInputElement
}

describe('sessionCriteres + remontage — la purge efface bien une reprise inter-patients (D-13/F-C, T-026/D33)', () => {
  it('AVANT purge : une valeur saisie sur le nœud A est reprise, marquée, sur un nœud B fraîchement monté', () => {
    // Patient A, nœud A : saisit la valeur partagée.
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    fireEvent.change(champCiblePartagee(), { target: { value: '7' } })
    expect(champCiblePartagee().value).toBe('7')
    unmount() // simule la sortie du nœud (retour à la liste), sans rechargement de page.

    // Patient B (un AUTRE patient, dans la même session onglet), nœud B, jamais ouvert avant : ce que la
    // recette a observé et signalé DÉFAUT grave (D-13) — reproduit ici pour prouver que le mécanisme K6
    // sous-jacent (D28) fonctionne bien tel quel, AVANT d'exercer la correction de T-026 ci-dessous.
    render(<DecisionNodeScreen nodeId={NOEUD_B.id} go={() => {}} />)
    expect(champCiblePartagee().value).toBe('7')
    expect(screen.getByText('· repris de votre saisie', { exact: false })).toBeTruthy()
  })

  it('APRÈS purge (« Nouveau patient », T-026) : un nœud RE-MONTÉ ne reprend plus rien — ni valeur, ni mention', () => {
    // Même séquence que ci-dessus : patient A saisit, sort du nœud.
    const { unmount: unmountA } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    fireEvent.change(champCiblePartagee(), { target: { value: '8.4' } })
    unmountA()

    // Le geste « Nouveau patient » = exactement ce que `App.tsx` fait au clic (`handleNouveauPatient`) :
    // purger la session, puis (dans l'app réelle) avancer `resetEpoch`, ce qui change le `key` et force
    // React à démonter puis remonter l'écran — ici simulé par un `unmount()` explicite suivi d'un nouveau
    // `render()`, l'équivalent exact d'un changement de `key` du point de vue du composant.
    reinitialiserSession()

    // Patient B, nœud B, sur une instance FRAÎCHEMENT MONTÉE après la purge : aucune reprise possible,
    // la `Map` est vide au moment où `valeursReprises` est lue (à l'initialisation de l'état, cf.
    // `DecisionNodeScreen.tsx`).
    render(<DecisionNodeScreen nodeId={NOEUD_B.id} go={() => {}} />)
    expect(champCiblePartagee().value).toBe('')
    expect(screen.queryByText('· repris de votre saisie', { exact: false })).toBeNull()

    // Et le nœud A lui-même, ré-ouvert après la purge, ne retrouve pas non plus SA propre valeur d'avant
    // — condition nécessaire pour que « Nouveau patient » vide vraiment tout, pas seulement ce qui a été
    // repris ailleurs.
    cleanup()
    render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    expect(champCiblePartagee().value).toBe('')
    expect(screen.queryByText('· repris de votre saisie', { exact: false })).toBeNull()
  })
})
