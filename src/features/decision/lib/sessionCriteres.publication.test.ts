/**
 * Banc de la PUBLICATION en mémoire de session (`lib/sessionCriteres.ts`, D50 — amende D28, P14/S10,
 * T-179). Décrit dans `docs/commun/decisions/2026-08-06-d50-*.md` : l'option RETENUE d'un nœud à sortie
 * unique (`selection: ordered-first-match`) peut publier une valeur — une CONCLUSION du moteur, jamais une
 * saisie — pour pré-remplir un champ de MÊME NOM sur un AUTRE nœud. `publierCritere`/`valeursPubliees` sont
 * DISTINCTES de `memoriserCriteres`/`valeursReprises` (`sessionCriteres.test.ts`, K6) : une publication
 * n'est pas une reprise, et `OrigineCritereSession` ('saisi' | 'repris') ne gagne PAS de troisième valeur
 * pour ça (cf. la docstring de tête de `sessionCriteres.ts`, « ce n'est pas un oubli »).
 *
 * SUR DES CRITÈRES DE FIXTURE, jamais le contenu réel (S11 s'en charge, `plans/P14/S10.md` "Hors
 * périmètre") — même discipline que `sessionCriteres.test.ts`.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import type { CritereEntree } from '../content/node.types.ts'
import { publierCritere, reinitialiserSession, valeursPubliees } from './sessionCriteres.ts'

const ORIGINE = { noeudId: 'fixture-cible', optionIntitule: 'Cible ≤ 7 % (fixture)' }

const RECEVEUR: CritereEntree[] = [
  { nom: 'HbA1c_cible_fixture', type: 'nombre', min: 6, max: 9.5 },
  { nom: 'prive_fixture', type: 'nombre', min: 0, max: 100 },
]

beforeEach(() => {
  reinitialiserSession()
})

describe('sessionCriteres — publication (D50/T-179)', () => {
  it('publie une valeur, avec son origine (nœud + option), retrouvable pour un critère compatible du nœud receveur', () => {
    publierCritere('HbA1c_cible_fixture', 7, ORIGINE)
    expect(valeursPubliees(RECEVEUR)).toEqual([{ nom: 'HbA1c_cible_fixture', valeur: 7, origine: ORIGINE }])
  })

  it('ne renvoie rien pour un critère jamais publié', () => {
    expect(valeursPubliees(RECEVEUR)).toEqual([])
  })

  it('ne renvoie rien pour un nom publié que le nœud receveur ne déclare pas', () => {
    publierCritere('nom_jamais_declare_ici', 7, ORIGINE)
    expect(valeursPubliees(RECEVEUR)).toEqual([])
  })

  it('refuse une valeur publiée HORS DES BORNES `min`/`max` du receveur (même garde-fou que `valeursReprises`, K6)', () => {
    publierCritere('HbA1c_cible_fixture', 12, ORIGINE) // hors de [6, 9.5]
    expect(valeursPubliees(RECEVEUR)).toEqual([])
  })

  it('refuse une valeur publiée sur un critère devenu non-`nombre` chez le receveur (une publication ne porte jamais que des nombres, D50)', () => {
    publierCritere('position_fixture', 1, ORIGINE)
    const receveurEnum: CritereEntree[] = [{ nom: 'position_fixture', type: 'enum', valeurs: ['a', 'b'] }]
    expect(valeursPubliees(receveurEnum)).toEqual([])
  })

  it('ignore un critère DÉRIVÉ du même nom, même si une valeur a été publiée sous ce nom (un dérivé n’est jamais un champ saisissable)', () => {
    publierCritere('derive_fixture', 3, ORIGINE)
    const receveurDerive: CritereEntree[] = [{ nom: 'derive_fixture', type: 'nombre', derive: 'a + b' }]
    expect(valeursPubliees(receveurDerive)).toEqual([])
  })

  it('N’EXIGE PAS `critere.partage` côté receveur — une publication n’est pas une reprise (D50)', () => {
    publierCritere('HbA1c_cible_fixture', 7, ORIGINE)
    const receveurSansPartage: CritereEntree[] = [{ nom: 'HbA1c_cible_fixture', type: 'nombre', min: 0, max: 20 }]
    expect(valeursPubliees(receveurSansPartage)).toEqual([{ nom: 'HbA1c_cible_fixture', valeur: 7, origine: ORIGINE }])
  })

  it('une SECONDE publication du même nom ÉCRASE la première — la dernière sortie du nœud publicateur fait foi', () => {
    publierCritere('HbA1c_cible_fixture', 9, ORIGINE)
    const secondeOrigine = { noeudId: 'fixture-cible', optionIntitule: 'Cible < 9 % (fixture)' }
    publierCritere('HbA1c_cible_fixture', 7, secondeOrigine)
    expect(valeursPubliees(RECEVEUR)).toEqual([{ nom: 'HbA1c_cible_fixture', valeur: 7, origine: secondeOrigine }])
  })

  it('remise à zéro complète par `reinitialiserSession` (CLAUDE.md invariant 1, modèle du rechargement de page)', () => {
    publierCritere('HbA1c_cible_fixture', 7, ORIGINE)
    expect(valeursPubliees(RECEVEUR)).toHaveLength(1)

    reinitialiserSession()

    expect(valeursPubliees(RECEVEUR)).toEqual([])
  })

  it('deux noms publiés sont chacun retrouvables indépendamment', () => {
    publierCritere('HbA1c_cible_fixture', 7, ORIGINE)
    publierCritere('prive_fixture', 42, ORIGINE)
    expect(valeursPubliees(RECEVEUR).map((v) => v.nom).sort()).toEqual(['HbA1c_cible_fixture', 'prive_fixture'])
  })
})
