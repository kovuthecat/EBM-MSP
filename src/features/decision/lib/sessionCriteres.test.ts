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
import { criteresSession, memoriserCriteres, reinitialiserSession, tailleSession, valeursReprises } from './sessionCriteres.ts'

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

/**
 * T-159 (P13/S8) — le compteur « Session : N valeurs » devient cliquable, `criteresSession()` en est le
 * SEUL point d'entrée en lecture. Deux familles de test : le CONTENU renvoyé (noms + origine, ordre
 * d'insertion), et — nommé comme l'invariant qu'il protège — la PREUVE qu'aucune valeur ne peut fuiter
 * par ce chemin (CLAUDE.md invariant 1, « zéro donnée patient »).
 */
describe('sessionCriteres — criteresSession (T-159, compteur cliquable)', () => {
  it('vide sur une session vierge', () => {
    expect(criteresSession()).toEqual([])
  })

  it('liste les noms mémorisés, dans l’ORDRE DE `criteresEntree` (pas celui de `criteria`/`touched`), avec origine `saisi` par défaut (repli rétro-compatible, `reprisIds` absent)', () => {
    // `memoriserCriteres` ITÈRE `criteresEntree` (EMETTEUR : `HbA1c_actuelle` déclaré avant `HbA1c_cible`,
    // tête de ce fichier) — c'est CET ordre qui gouverne l'insertion dans `memoire`, jamais celui des clés
    // de l'objet `criteria` passé en argument (ici volontairement inversé pour ne pas les confondre).
    memoriserCriteres(EMETTEUR, { HbA1c_cible: 7, HbA1c_actuelle: 9 }, new Set(['HbA1c_cible', 'HbA1c_actuelle']))
    expect(criteresSession()).toEqual([
      { nom: 'HbA1c_actuelle', origine: 'saisi' },
      { nom: 'HbA1c_cible', origine: 'saisi' },
    ])
  })

  it('distingue `repris` (4ᵉ argument de `memoriserCriteres`) de `saisi`, critère par critère', () => {
    // `HbA1c_cible` encore marqué repris au moment de l'appel (une valeur reprise d'un AUTRE nœud, non
    // éditée sur celui-ci) ; `HbA1c_actuelle` ne l'est pas (saisie directe SUR cet écran) — même appel,
    // deux origines, exactement le cas réel (`DecisionNodeScreen.tsx` `reprisApres`).
    memoriserCriteres(
      EMETTEUR,
      { HbA1c_cible: 7, HbA1c_actuelle: 9 },
      new Set(['HbA1c_cible', 'HbA1c_actuelle']),
      new Set(['HbA1c_cible']),
    )
    // Ordre de `criteresEntree` encore (`HbA1c_actuelle` avant `HbA1c_cible`) — inchangé par `reprisIds`,
    // qui ne pilote que l'ORIGINE, jamais l'ordre.
    expect(criteresSession()).toEqual([
      { nom: 'HbA1c_actuelle', origine: 'saisi' },
      { nom: 'HbA1c_cible', origine: 'repris' },
    ])
  })

  it('une saisie ultérieure sur un critère `repris` fait basculer son origine à `saisi` (édité = confirmé, D20)', () => {
    memoriserCriteres(EMETTEUR, { HbA1c_cible: 7 }, new Set(['HbA1c_cible']), new Set(['HbA1c_cible']))
    expect(criteresSession()).toEqual([{ nom: 'HbA1c_cible', origine: 'repris' }])

    // Le praticien édite la valeur SUR CET écran : l'appelant ne le passe plus dans `reprisIds`.
    memoriserCriteres(EMETTEUR, { HbA1c_cible: 7.5 }, new Set(['HbA1c_cible']))
    expect(criteresSession()).toEqual([{ nom: 'HbA1c_cible', origine: 'saisi' }])
  })

  it('vide après `reinitialiserSession`', () => {
    memoriserCriteres(EMETTEUR, { HbA1c_cible: 7 }, new Set(['HbA1c_cible']))
    expect(criteresSession()).toHaveLength(1)
    reinitialiserSession()
    expect(criteresSession()).toEqual([])
  })
})

/**
 * INVARIANT CLAUDE.md 1 — LA MÉMOIRE DE SESSION N'EXPOSE AUCUNE VALEUR PATIENT PAR `criteresSession()`.
 * Nommé comme l'invariant qu'il protège (consigne du plan, S8.md) : ce test doit rougir si `criteresSession`
 * se met un jour à renvoyer une `valeur`, quel que soit le chemin par lequel elle y arriverait.
 */
describe('sessionCriteres — invariant CLAUDE.md 1 : criteresSession() n’expose jamais de valeur', () => {
  it('mémorise des valeurs DISTINCTIVES (un nombre improbable, une chaîne, un tableau) et vérifie qu’AUCUNE ne réapparaît, sous aucune forme, dans `criteresSession()`', () => {
    const CRITERES_SENSIBLES: CritereEntree[] = [
      { nom: 'HbA1c_actuelle', type: 'nombre', min: 0, max: 999, partage: true },
      { nom: 'x', type: 'enum', valeurs: ['valeur_secrete_xyz'], partage: true },
      { nom: 'l', type: 'liste', valeurs: ['item_secret_123'], partage: true },
    ]
    memoriserCriteres(
      CRITERES_SENSIBLES,
      { HbA1c_actuelle: 123.456, x: 'valeur_secrete_xyz', l: ['item_secret_123'] },
      new Set(['HbA1c_actuelle', 'x', 'l']),
    )

    const resultat = criteresSession()

    // (1) Chaque entrée a EXACTEMENT deux clés — `nom` et `origine` — jamais `valeur` ni aucune autre.
    for (const entree of resultat) {
      expect(Object.keys(entree).sort()).toEqual(['nom', 'origine'])
    }

    // (2) Aucune trace des valeurs, même sous forme de sous-chaîne, dans le JSON du résultat entier —
    // filet qui couvre aussi un futur champ mal nommé qui réintroduirait la valeur ailleurs que `valeur`.
    const serialise = JSON.stringify(resultat)
    expect(serialise).not.toContain('123.456')
    expect(serialise).not.toContain('valeur_secrete_xyz')
    expect(serialise).not.toContain('item_secret_123')

    // (3) Les NOMS, eux, sont bien là (c'est le service rendu) — le test ne serait pas honnête s'il
    // passait aussi sur un résultat vide.
    expect(resultat.map((e) => e.nom).sort()).toEqual(['HbA1c_actuelle', 'l', 'x'])
  })
})
