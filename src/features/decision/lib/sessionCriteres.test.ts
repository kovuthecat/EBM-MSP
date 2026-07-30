/**
 * Banc de la mémoire de session (`lib/sessionCriteres.ts`, K6 — décision référent du 2026-07-27).
 *
 * CE FICHIER GARDE UN ÉTAT GLOBAL MUTABLE, la seule pièce de ce type du module Décision, et qui décide de
 * ce qu'un praticien voit pré-rempli à l'écran. Les trois propriétés vérifiées ici sont celles qui rendent
 * la décision du référent tenable : ne circule QUE ce que le contenu déclare, QUE ce que le praticien a
 * saisi, et QUE ce que le nœud receveur sait représenter.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import type { CritereEntree } from '../content/node.types.ts'
import { memoriserCriteres, reinitialiserSession, tailleSession, valeursReprises } from './sessionCriteres.ts'

const EMETTEUR: CritereEntree[] = [
  { nom: 'HbA1c_actuelle', type: 'nombre', min: 4, max: 18, partage: true },
  { nom: 'HbA1c_cible', type: 'nombre', min: 6, max: 9.5, partage: true },
  { nom: 'prive', type: 'nombre', min: 0, max: 100 },
  { nom: 'derive_partage', type: 'bool', derive: 'HbA1c_actuelle > 8', partage: true },
]

beforeEach(() => {
  reinitialiserSession()
})

describe('sessionCriteres — ce qui circule', () => {
  it('ne mémorise QUE les critères déclarés `partage` par le contenu', () => {
    // Le socle n'a pas le droit de connaître `HbA1c_cible` par son nom (D8) : c'est le contenu qui décide.
    memoriserCriteres(EMETTEUR, { HbA1c_actuelle: 9, HbA1c_cible: 7, prive: 42 }, new Set(['HbA1c_actuelle', 'HbA1c_cible', 'prive']))
    expect(valeursReprises(EMETTEUR).map((r) => r.nom).sort()).toEqual(['HbA1c_actuelle', 'HbA1c_cible'])
  })

  it('ne mémorise QUE ce que le praticien a SAISI — une valeur par défaut n’est pas une réponse', () => {
    // D20/R7 : propager un champ jamais touché ferait circuler un silence comme s'il était une donnée.
    memoriserCriteres(EMETTEUR, { HbA1c_actuelle: 0, HbA1c_cible: 7 }, new Set(['HbA1c_cible']))
    expect(valeursReprises(EMETTEUR).map((r) => r.nom)).toEqual(['HbA1c_cible'])
  })

  it('ne mémorise jamais un critère DÉRIVÉ, même déclaré `partage`', () => {
    // Un dérivé est une CONCLUSION calculée, pas une saisie : le faire circuler rouvrirait R1.
    memoriserCriteres(EMETTEUR, { derive_partage: true }, new Set(['derive_partage']))
    expect(valeursReprises(EMETTEUR)).toEqual([])
  })

  it('la session est vidée par `reinitialiserSession` — modèle du rechargement de page', () => {
    memoriserCriteres(EMETTEUR, { HbA1c_cible: 7 }, new Set(['HbA1c_cible']))
    expect(valeursReprises(EMETTEUR)).toHaveLength(1)
    reinitialiserSession()
    expect(valeursReprises(EMETTEUR)).toEqual([])
  })
})

describe('sessionCriteres — ce que le nœud receveur sait représenter', () => {
  it('refuse une valeur hors des bornes DU RECEVEUR', () => {
    memoriserCriteres(EMETTEUR, { HbA1c_actuelle: 17 }, new Set(['HbA1c_actuelle']))
    const receveurEtroit: CritereEntree[] = [{ nom: 'HbA1c_actuelle', type: 'nombre', min: 4, max: 12, partage: true }]
    expect(valeursReprises(receveurEtroit)).toEqual([])
  })

  it('refuse un changement de TYPE entre l’émetteur et le receveur', () => {
    memoriserCriteres(EMETTEUR, { HbA1c_cible: 7 }, new Set(['HbA1c_cible']))
    const receveurEnum: CritereEntree[] = [{ nom: 'HbA1c_cible', type: 'enum', valeurs: ['bas', 'haut'], partage: true }]
    expect(valeursReprises(receveurEnum)).toEqual([])
  })

  it('refuse une valeur d’énumération que le receveur ne déclare pas', () => {
    const emetteurEnum: CritereEntree[] = [{ nom: 'x', type: 'enum', valeurs: ['a', 'b'], partage: true }]
    memoriserCriteres(emetteurEnum, { x: 'b' }, new Set(['x']))
    const receveurEnum: CritereEntree[] = [{ nom: 'x', type: 'enum', valeurs: ['a'], partage: true }]
    expect(valeursReprises(receveurEnum)).toEqual([])
  })

  it('accepte une `liste` dont toutes les valeurs sont déclarées par le receveur', () => {
    const emetteur: CritereEntree[] = [{ nom: 'l', type: 'liste', valeurs: ['a', 'b'], partage: true }]
    memoriserCriteres(emetteur, { l: ['a'] }, new Set(['l']))
    expect(valeursReprises(emetteur)).toEqual([{ nom: 'l', valeur: ['a'] }])
  })

  it('rend la valeur telle quelle quand tout concorde', () => {
    memoriserCriteres(EMETTEUR, { HbA1c_actuelle: 9.2, HbA1c_cible: 7 }, new Set(['HbA1c_actuelle', 'HbA1c_cible']))
    const receveur: CritereEntree[] = [{ nom: 'HbA1c_actuelle', type: 'nombre', min: 4, max: 18, partage: true }]
    expect(valeursReprises(receveur)).toEqual([{ nom: 'HbA1c_actuelle', valeur: 9.2 }])
  })
})

describe('sessionCriteres — tailleSession (T-056, compteur sans contenu)', () => {
  it('vaut 0 sur une session vierge', () => {
    expect(tailleSession()).toBe(0)
  })

  it('vaut 2 après mémorisation de deux critères, puis 0 après `reinitialiserSession`', () => {
    memoriserCriteres(EMETTEUR, { HbA1c_actuelle: 9, HbA1c_cible: 7 }, new Set(['HbA1c_actuelle', 'HbA1c_cible']))
    expect(tailleSession()).toBe(2)

    reinitialiserSession()
    expect(tailleSession()).toBe(0)
  })
})
