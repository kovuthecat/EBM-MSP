// @vitest-environment jsdom

/**
 * T-061 (P8 · S2, 2026-07-30) — LA SUGGESTION AUTO D'ESPÉRANCE DE VIE DEVIENT VISIBLE ET EFFECTIVE.
 *
 * LE DÉFAUT REPRODUIT ICI. La ligne « Suggestion auto (âge, fragilité, comorbidité grave, antécédent
 * CV) — à valider » (`DecisionNodeScreen.tsx`, `hints`) ne proposait jamais rien à l'écran : le calcul
 * (`lib/esperanceVieDefault.ts`, testé isolément) tournait bien dans `handleCriteriaChange`, mais la
 * valeur écrite dans `criteria.esperance_vie` n'était ajoutée ni à `touched` ni à `preremplis` — donc
 * invisible au formulaire (aucun segment allumé, `CriteriaForm` n'illumine `aria-pressed` que sur
 * `criteresRenseignes.has(nom)`) ET ignorée du moteur (jamais dans `renseignes`). Mesuré en recette sur
 * trois patients, dont le cas d'école que la ligne nomme elle-même : 88 ans, fragilité ET comorbidité
 * grave cochées.
 *
 * NŒUD SYNTHÉTIQUE plutôt que le contenu réel `cible-glycemique` (même discipline que
 * `DecisionNodeScreen.interaction.test.tsx` : un test d'interaction reste stable quand le contenu
 * clinique évolue). Ça ne change rien à la fidélité du scénario : le mécanisme testé
 * (`lib/esperanceVieDefault.ts` `hasEsperanceVieCritere`/`suggestEsperanceVie`/`ESPERANCE_VIE_DRIVERS`)
 * est un mécanisme d'ÉCRAN, non piloté par le contenu (D8 ne s'applique pas ici) : il reconnaît les
 * critères `age`/`fragilite`/`comorbidite_grave`/`ASCVD_etablie`/`esperance_vie` par leur NOM, quel que
 * soit le nœud qui les déclare — reprendre exactement ces noms suffit à rejouer le cas réel.
 * `antecedent_cv` renommé `ASCVD_etablie` le 2026-08-07 (décision référent, arbitrage 1 de S14, P14/S17).
 *
 * Une seconde option (`OPTION_FRAGILE`, conditionnée par `fragilite`/`comorbidite_grave`) rend ces deux
 * critères DÉCISIFS pour le moteur (`engine/relevance.ts`) : sans elle, le bouton « Rien à signaler »
 * (test 3) n'aurait aucune raison certaine d'apparaître, et le test dépendrait d'un hasard d'implémentation
 * plutôt que d'un scénario construit.
 */
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Noeud, Option } from '../content/node.types'
import { DecisionNodeScreen } from './DecisionNodeScreen'

// `vi.mock` ci-dessous est hoisté au-dessus des imports (comportement Vitest) : `NODE` doit donc être
// construit dans un `vi.hoisted`, même convention que `DecisionNodeScreen.interaction.test.tsx` et
// `sessionCriteres.remount.test.tsx`, sans quoi la factory du mock référencerait une variable pas
// encore initialisée.
const NODE = vi.hoisted(() => {
  const SOCLE: Option = {
    intitule: 'Socle',
    role: 'socle',
    conditions: ['toujours'],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
  }

  const OPTION_FRAGILE: Option = {
    intitule: 'Option fragile',
    role: 'geste',
    conditions: ['fragilite == true OR comorbidite_grave == true'],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
  }

  // Même quatuor de critères que `A-cible-glycemique` (`lib/esperanceVieDefault.ts` : ce sont les
  // SEULS noms que le mécanisme reconnaît), sans dépendre du contenu réel. Un SEUL groupe (pas de
  // `groupe` déclaré) : pas d'accordéon (`CriteriaForm.tsx`, « nœud à une seule section »), tous les
  // champs restent dans le DOM sans qu'il faille ouvrir une section au préalable.
  const noeud: Noeud = {
    id: 'noeud-esperance-vie-test',
    domaine: 'test',
    titre: 'Nœud de test (espérance de vie)',
    population_cible: 'test',
    selection: 'multi-options',
    criteres_entree: [
      { nom: 'age', type: 'nombre', min: 0, max: 110 },
      { nom: 'fragilite', type: 'bool' },
      { nom: 'comorbidite_grave', type: 'bool' },
      { nom: 'ASCVD_etablie', type: 'bool' },
      { nom: 'esperance_vie', type: 'enum', valeurs: ['longue', 'intermediaire', 'limitee'] },
    ],
    options: [SOCLE, OPTION_FRAGILE],
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
  return noeud
})

vi.mock('../content/loadNodes', () => ({
  getNoeudById: (id: string) => (id === NODE.id ? NODE : undefined),
  getNoeudsByDomaine: () => [NODE],
  noeuds: [NODE],
  noeudsParDomaine: { test: [NODE] },
}))

vi.mock('../content/loadModules', () => ({
  getModuleDuNoeud: () => undefined,
  getModuleById: () => undefined,
  entreesListe: () => [],
}))

afterEach(cleanup)

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

describe('DecisionNodeScreen — suggestion auto d’espérance de vie (T-061, P8 · S2)', () => {
  it('88 ans, fragile, comorbidité grave — un segment d’espérance de vie est sélectionné (verrouille le correctif)', () => {
    render(<DecisionNodeScreen nodeId={NODE.id} go={() => {}} />)

    // Avant toute saisie : aucun segment n'est sélectionné (D20, rien n'est encore répondu).
    for (const libelle of ['Longue', 'Intermédiaire', 'Limitée']) {
      expect(segmentEsperanceVie(libelle).getAttribute('aria-pressed')).toBe('false')
    }

    fireEvent.change(champAge(), { target: { value: '88' } })
    fireEvent.click(checkbox(/Fragilité/))
    fireEvent.click(checkbox(/Comorbidité grave/))

    // `comorbidite_grave` seul suffit (`suggestEsperanceVie`) : suggestion = 'limitee'.
    expect(segmentEsperanceVie('Limitée').getAttribute('aria-pressed')).toBe('true')
    expect(segmentEsperanceVie('Longue').getAttribute('aria-pressed')).toBe('false')
    // La valeur suggérée est marquée comme un pré-remplissage (jamais `touched`) : même mention que le
    // pré-remplissage de contenu (K6, `CriteriaForm.tsx` `renderOrigine`).
    expect(screen.getByText('· calculé, à vérifier', { exact: false })).toBeTruthy()
  })

  it('la suggestion se recalcule tant que le praticien n’a pas choisi lui-même, puis s’arrête', () => {
    render(<DecisionNodeScreen nodeId={NODE.id} go={() => {}} />)

    fireEvent.change(champAge(), { target: { value: '80' } })
    // 80 ans, aucun autre facteur : ni comorbidité grave, ni fragile → palier « intermédiaire ».
    expect(segmentEsperanceVie('Intermédiaire').getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(checkbox(/Comorbidité grave/))
    // Le driver change → la suggestion se recalcule (comorbidité grave seule suffit à « limitée »).
    expect(segmentEsperanceVie('Limitée').getAttribute('aria-pressed')).toBe('true')

    // Le praticien choisit lui-même une valeur DIFFÉRENTE de la suggestion.
    fireEvent.click(segmentEsperanceVie('Longue'))
    expect(segmentEsperanceVie('Longue').getAttribute('aria-pressed')).toBe('true')

    // Un driver bouge à nouveau : la suggestion ne doit PLUS écraser le choix du praticien.
    fireEvent.click(checkbox(/Fragilité/))
    expect(segmentEsperanceVie('Longue').getAttribute('aria-pressed')).toBe('true')
  })

  it('« Rien à signaler » déclenche aussi la suggestion (geste réel du praticien, N2/N7)', () => {
    render(<DecisionNodeScreen nodeId={NODE.id} go={() => {}} />)

    // `fragilite`/`comorbidite_grave` sont DÉCISIFS pour `OPTION_FRAGILE` (`fragilite == true OR
    // comorbidite_grave == true`) et non `presomption_non` (D30) : indéterminés par défaut, donc
    // réclamés — le bouton de section existe à coup sûr, pas par hasard d'implémentation.
    const bouton = screen.getByText('Rien à signaler')
    fireEvent.click(bouton)

    // Age resté à 0 (jamais touché), les deux drapeaux confirmés à `false` (« non » est la réponse,
    // D20 R7) → palier « longue » (`suggestEsperanceVie`).
    expect(segmentEsperanceVie('Longue').getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByText('· calculé, à vérifier', { exact: false })).toBeTruthy()
  })

  it('un praticien qui a déjà choisi lui-même l’espérance de vie n’est jamais écrasé par « Rien à signaler »', () => {
    render(<DecisionNodeScreen nodeId={NODE.id} go={() => {}} />)

    fireEvent.click(segmentEsperanceVie('Longue'))
    fireEvent.click(screen.getByText('Rien à signaler'))

    expect(segmentEsperanceVie('Longue').getAttribute('aria-pressed')).toBe('true')
  })
})
