// @vitest-environment jsdom

/**
 * T-179 (P14/S10) — LE MÉCANISME DE D50 BOUT EN BOUT : un nœud `ordered-first-match` dont l'option retenue
 * porte `publie` écrit une valeur en mémoire de session (`lib/sessionCriteres.ts` `publierCritere`) ; un
 * AUTRE nœud, qui déclare un critère du même nom, la reprend au montage pour pré-remplir son formulaire,
 * signalée comme un pré-remplissage ordinaire (« · calculé, à vérifier ») PLUS son origine.
 *
 * NŒUDS SYNTHÉTIQUES (mêmes conventions que `DecisionNodeScreen.esperanceVie.test.tsx` et
 * `lib/sessionCriteres.remount.test.tsx` — contenu mocké via `getNoeudById`, générique, aucun nom de
 * critère clinique réel, D8) : ce fichier ne dépend d'aucun contenu DT2 réel (S10.md "Hors périmètre" —
 * S11 s'occupe du contenu).
 *
 * LE NŒUD PUBLICATEUR EST GATÉ PAR UN CRITÈRE `nombre` (`seuil_fixture`), PAS UN `bool` : un `nombre` non
 * saisi est TOUJOURS indéterminé (D20), sans dépendre de `presomption_non` (D30) — le scénario « en
 * attente » s'obtient donc SANS AUCUNE INTERACTION (formulaire vierge), et le scénario « sortie retenue »
 * avec UNE SEULE frappe, sans détour par la case à cocher/« Rien à signaler ».
 *
 * QUATRE SCÉNARIOS DEMANDÉS PAR `plans/P14/S10.md` (T-179, étape 7) :
 *  1. publication écrite à la sortie retenue ;
 *  2. rien écrit quand le nœud est en attente (R7/D20) ;
 *  3. la valeur publiée n'écrase jamais une saisie du praticien ;
 *  4. remise à zéro complète au rechargement (session vidée).
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Noeud, Option } from '../content/node.types'
import { DecisionNodeScreen } from './DecisionNodeScreen'
import { reinitialiserSession, valeursPubliees } from '../lib/sessionCriteres'

const { NOEUD_PUBLICATEUR, NOEUD_RECEPTEUR } = vi.hoisted(() => {
  // NŒUD PUBLICATEUR — `ordered-first-match` (D11). `seuil_fixture` (nombre) GATE l'unique option ORDINAIRE
  // (`OPTION_HAUTE`, sans `publie`) : tant qu'il n'est pas saisi, elle reste INDÉTERMINÉE (D20) et le nœud
  // reste `enAttente` — le REPLI (`OPTION_REPLI`, qui PUBLIE) n'est alors même pas atteint (D32 : une halte
  // rend hors d'atteinte tout ce qui suit, sauf `role: securite`). Dès que `seuil_fixture` est saisi et ≤ 10
  // (n'importe quelle valeur, y compris 0), `OPTION_HAUTE` devient déterminément FAUSSE (jamais indéterminée
  // pour une comparaison numérique renseignée) : aucune halte, le repli est évalué normalement et publie.
  const OPTION_HAUTE: Option = {
    intitule: 'Seuil haut (fixture, ne publie rien)',
    role: 'geste',
    conditions: ['seuil_fixture > 10'],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
  }
  const OPTION_REPLI: Option = {
    intitule: 'Cible repli (fixture)',
    role: 'repli',
    conditions: ['default'],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
    publie: { critere: 'cible_publiee_fixture', valeur: 7 },
  }
  const noeudPublicateur: Noeud = {
    id: 'fixture-d50-ecran-publicateur',
    domaine: 'test',
    titre: 'Nœud de test (publicateur)',
    population_cible: 'test',
    selection: 'ordered-first-match',
    criteres_entree: [{ nom: 'seuil_fixture', type: 'nombre', min: 0, max: 20 }],
    options: [OPTION_HAUTE, OPTION_REPLI],
    argumentaire: 'x',
    sources: {
      references_primaires: [],
      synthese_critique: { donnee: '' },
      reco_officielle: { source: '', position: '', divergence: false, explication: '' },
    },
    incertitudes: [],
    veille_liee: [],
    meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide', version: '1.0', changelog: [] },
  }

  // NŒUD RÉCEPTEUR — déclare `cible_publiee_fixture`, un critère `nombre` ORDINAIRE (pas de `partage`,
  // publication ≠ reprise, D50) : `DecisionNodeScreen.tsx` doit le pré-remplir depuis la publication.
  const SOCLE: Option = {
    intitule: 'Socle (fixture)',
    role: 'socle',
    conditions: ['toujours'],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
  }
  const noeudRecepteur: Noeud = {
    id: 'fixture-d50-ecran-recepteur',
    domaine: 'test',
    titre: 'Nœud de test (récepteur)',
    population_cible: 'test',
    selection: 'multi-options',
    criteres_entree: [{ nom: 'cible_publiee_fixture', type: 'nombre', min: 0, max: 20 }],
    options: [SOCLE],
    argumentaire: 'x',
    sources: {
      references_primaires: [],
      synthese_critique: { donnee: '' },
      reco_officielle: { source: '', position: '', divergence: false, explication: '' },
    },
    incertitudes: [],
    veille_liee: [],
    meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide', version: '1.0', changelog: [] },
  }

  return { NOEUD_PUBLICATEUR: noeudPublicateur, NOEUD_RECEPTEUR: noeudRecepteur }
})

vi.mock('../content/loadNodes', () => ({
  getNoeudById: (id: string) => [NOEUD_PUBLICATEUR, NOEUD_RECEPTEUR].find((n) => n.id === id),
  getNoeudsByDomaine: () => [NOEUD_PUBLICATEUR, NOEUD_RECEPTEUR],
  noeuds: [NOEUD_PUBLICATEUR, NOEUD_RECEPTEUR],
  noeudsParDomaine: { test: [NOEUD_PUBLICATEUR, NOEUD_RECEPTEUR] },
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

function champSeuil(): HTMLInputElement {
  return screen.getByRole('spinbutton') as HTMLInputElement
}

function champCiblePubliee(): HTMLInputElement {
  return screen.getByRole('spinbutton') as HTMLInputElement
}

describe('DecisionNodeScreen — publication D50/T-179 (option retenue d’un nœud à sortie unique)', () => {
  it('2. RIEN n’est écrit tant que le nœud publicateur reste EN ATTENTE (R7/D20) — formulaire vierge', () => {
    render(<DecisionNodeScreen nodeId={NOEUD_PUBLICATEUR.id} go={() => {}} />)

    // `seuil_fixture` jamais saisi : `OPTION_HAUTE` est INDÉTERMINÉE (D20), le nœud reste `enAttente` — le
    // bandeau le confirme, et surtout AUCUNE publication n'a eu lieu (le repli, qui la porte, n'est même
    // pas atteint, D32).
    expect(screen.getByText('En attente', { exact: false })).toBeTruthy()
    expect(valeursPubliees(NOEUD_RECEPTEUR.criteres_entree)).toEqual([])
  })

  it('1. écrit la publication dès que le nœud publicateur SORT sur l’option qui la porte (le repli, ici)', () => {
    render(<DecisionNodeScreen nodeId={NOEUD_PUBLICATEUR.id} go={() => {}} />)
    expect(valeursPubliees(NOEUD_RECEPTEUR.criteres_entree)).toEqual([]) // rien avant la saisie (cf. test 2).

    // `seuil_fixture = 3` (≤ 10) : `OPTION_HAUTE` devient déterminément FAUSSE, sans halte — le repli
    // (`OPTION_REPLI`, `conditions: ["default"]`) est donc évalué normalement, matche, et publie.
    fireEvent.change(champSeuil(), { target: { value: '3' } })

    expect(valeursPubliees(NOEUD_RECEPTEUR.criteres_entree)).toEqual([
      {
        nom: 'cible_publiee_fixture',
        valeur: 7,
        origine: { noeudId: NOEUD_PUBLICATEUR.id, optionIntitule: 'Cible repli (fixture)' },
      },
    ])
  })

  it('1bis. la publication est bien LUE par le nœud récepteur, avec son ORIGINE (nœud + option), au montage suivant', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_PUBLICATEUR.id} go={() => {}} />)
    fireEvent.change(champSeuil(), { target: { value: '3' } })
    unmount() // simule la sortie du nœud publicateur, sans rechargement de page.

    render(<DecisionNodeScreen nodeId={NOEUD_RECEPTEUR.id} go={() => {}} />)
    expect(champCiblePubliee().value).toBe('7')
    // MÊME mention visuelle qu'un pré-remplissage de contenu ordinaire (étape 5, S10.md), enrichie de
    // l'origine : nœud + intitulé de l'option retenue — réutilise le rendu existant, rien de second créé.
    expect(screen.getByText('· calculé, à vérifier', { exact: false })).toBeTruthy()
    expect(screen.getByText('Cible repli (fixture)', { exact: false })).toBeTruthy()
    expect(screen.getByText('Nœud de test (publicateur)', { exact: false })).toBeTruthy()
  })

  it('3. une valeur publiée n’écrase JAMAIS une valeur déjà SAISIE par le praticien sur le nœud récepteur', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_PUBLICATEUR.id} go={() => {}} />)
    fireEvent.change(champSeuil(), { target: { value: '3' } })
    unmount()

    // Le praticien ouvre le nœud récepteur : pré-rempli par la publication au départ (contrôle).
    render(<DecisionNodeScreen nodeId={NOEUD_RECEPTEUR.id} go={() => {}} />)
    expect(champCiblePubliee().value).toBe('7')

    // Il SAISIT lui-même une valeur différente — le pré-remplissage ne s'applique QU'À L'INITIALISATION de
    // l'état (jamais en continu, même règle qu'un pré-remplissage de contenu, K6/D50).
    fireEvent.change(champCiblePubliee(), { target: { value: '4' } })
    expect(champCiblePubliee().value).toBe('4')
    // La mention de pré-remplissage disparaît dès que le praticien touche le champ : la valeur SAISIE fait
    // foi, plus aucune trace de suggestion.
    expect(screen.queryByText('· calculé, à vérifier', { exact: false })).toBeNull()
  })

  it('4. remise à zéro complète au rechargement (« Nouveau patient », même purge que K6/D33) : plus rien à reprendre', () => {
    const { unmount: unmountPub } = render(<DecisionNodeScreen nodeId={NOEUD_PUBLICATEUR.id} go={() => {}} />)
    fireEvent.change(champSeuil(), { target: { value: '3' } })
    unmountPub()

    // Avant purge : la publication circule bien (contrôle, comme le test 1bis).
    render(<DecisionNodeScreen nodeId={NOEUD_RECEPTEUR.id} go={() => {}} />)
    expect(champCiblePubliee().value).toBe('7')
    cleanup()

    // Purge (T-026/D33) — MÊME fonction que le bouton « Nouveau patient » du header.
    reinitialiserSession()

    // Nœud récepteur RE-MONTÉ après la purge : plus aucune publication à reprendre, champ vierge.
    render(<DecisionNodeScreen nodeId={NOEUD_RECEPTEUR.id} go={() => {}} />)
    expect(champCiblePubliee().value).toBe('')
    expect(screen.queryByText('· calculé, à vérifier', { exact: false })).toBeNull()
  })
})
