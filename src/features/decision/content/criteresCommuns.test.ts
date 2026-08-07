/**
 * Mécanisme des critères communs de domaine (T-188, P14/S15) : le fichier commun
 * (`content/decision/criteres-communs/<domaine>.yaml`, `schema/decision/criteres-communs.schema.json`),
 * la forme courte `{ ref }` dans `criteres_entree` (`schema/decision/noeud.schema.json`, définition
 * `critereEntreeRef`), et la résolution au chargement (`loadNodes.ts`, `resoudreCritereEntree`).
 *
 * QUATRE CHOSES TESTÉES ICI (brief `plans/P14/S15.md`, T-188 étape 6) :
 *  1. résolution correcte — définition commune + mise en scène locale FUSIONNÉES ;
 *  2. refus, PAR LE SCHÉMA, d'une surcharge de champ de définition à côté d'un `ref` ;
 *  3. erreur explicite (jamais de repli silencieux) sur un `ref` inconnu, ou un domaine sans fichier
 *     commun — même politique que `ConditionError` du moteur ;
 *  4. NON-RÉGRESSION explicite — un nœud sans aucun `ref` se charge exactement comme avant ce mécanisme.
 *
 * Les tests 1/3/4 exercent `resoudreCritereEntree` avec une map de critères communs SYNTHÉTIQUE (4ᵉ
 * paramètre, injectée) plutôt que le contenu réel : ils ne dépendent donc d'aucune décision de contenu
 * future (S17 pourra enrichir `content/decision/criteres-communs/diabete-type-2.yaml` sans casser ces
 * tests). Un test dédié, séparé, vérifie en plus la démonstration RÉELLE (`cetonemie` sur `prescription`)
 * pour que le mécanisme soit vérifié bout en bout, pas seulement en unitaire.
 */
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv, { type AnySchemaObject } from 'ajv'
import { describe, expect, it } from 'vitest'
import {
  CritereCommunError,
  estRef,
  fichiersCriteresCommuns,
  noeuds,
  resoudreCritereEntree,
} from './loadNodes.ts'
import type { CritereCommun, CritereEntree, CritereEntreeRef } from './node.types.ts'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const lireSchema = (nom: string) =>
  JSON.parse(readFileSync(path.resolve(dirname, `../../../../schema/decision/${nom}`), 'utf-8')) as AnySchemaObject

// =========================================================================================================
// 1. Résolution correcte — définition commune + mise en scène locale fusionnées
// =========================================================================================================

describe('résolution `{ ref }` — définition commune fusionnée avec la mise en scène locale', () => {
  const definitionCommune: CritereCommun = {
    nom: 'exemple_partage',
    type: 'bool',
    aide: 'Aide portée par la définition commune.',
    partage: true,
    // `concerne` volontairement présent ici : le test vérifie plus bas qu'il n'est PAS recopié.
    concerne: ['classe-a', 'classe-b'],
  }
  const communsSynthetiques = new Map<string, Map<string, CritereCommun>>([
    ['domaine-test', new Map([[definitionCommune.nom, definitionCommune]])],
  ])

  it('fusionne les champs de définition (type, aide, partage) avec la mise en scène locale (groupe, visible_si)', () => {
    const entreeRef: CritereEntreeRef = {
      ref: 'exemple_partage',
      groupe: 'Section locale',
      visible_si: 'autre_critere == true',
    }
    const resolu = resoudreCritereEntree('noeud-test', 'domaine-test', entreeRef, communsSynthetiques)
    expect(resolu).toEqual({
      nom: 'exemple_partage',
      type: 'bool',
      aide: 'Aide portée par la définition commune.',
      partage: true,
      groupe: 'Section locale',
      visible_si: 'autre_critere == true',
    })
  })

  it('un `ref` sans aucune mise en scène résout la définition commune seule (aucun champ de présentation ajouté)', () => {
    const resolu = resoudreCritereEntree('noeud-test', 'domaine-test', { ref: 'exemple_partage' }, communsSynthetiques)
    expect(resolu).toEqual({
      nom: 'exemple_partage',
      type: 'bool',
      aide: 'Aide portée par la définition commune.',
      partage: true,
    })
  })

  it('ne recopie JAMAIS `concerne` sur le `CritereEntree` résolu (aucun effet moteur ni de rendu — réservé à l’invariant S16)', () => {
    const resolu = resoudreCritereEntree('noeud-test', 'domaine-test', { ref: 'exemple_partage' }, communsSynthetiques)
    expect(resolu).not.toHaveProperty('concerne')
  })

  it('`presomption_non` de l’entrée `{ ref }` (LOCAL, D30) est repris — jamais porté par le fichier commun', () => {
    const entreeRef: CritereEntreeRef = { ref: 'exemple_partage', presomption_non: true }
    const resolu = resoudreCritereEntree('noeud-test', 'domaine-test', entreeRef, communsSynthetiques)
    expect(resolu.presomption_non).toBe(true)
  })

  it('démonstration réelle (T-188) : `prescription` reçoit `cetonemie` en `CritereEntree` complet, résolu depuis le fichier commun du domaine', () => {
    const prescription = noeuds.find((n) => n.id === 'prescription')
    expect(prescription, 'le nœud "prescription" doit exister dans le contenu réel').toBeDefined()

    const cetonemie = prescription!.criteres_entree.find((c) => c.nom === 'cetonemie')
    expect(cetonemie, '"cetonemie" doit être résolu (aucun `ref` ne doit survivre au chargement)').toBeDefined()

    // Identique BIT À BIT à la déclaration inline d'avant T-188 (cf. le changelog de prescription.yaml) :
    // c'est exactement la garantie que le golden master de caractérisation vérifie déjà de son côté
    // (aucun snapshot `caracterisation.*` ne doit bouger, cf. plans/P14/S15.md § Validation).
    expect(cetonemie).toEqual({ nom: 'cetonemie', type: 'bool', groupe: "Signaux d'alerte" })
    expect(estRef(cetonemie!)).toBe(false)
  })

  it('la définition commune de `cetonemie` (content/decision/criteres-communs/diabete-type-2.yaml) est bien un booléen sans arbitrage de contenu', () => {
    const fichierDT2 = fichiersCriteresCommuns.find((f) => f.domaine === 'diabete-type-2')
    expect(fichierDT2).toBeDefined()
    const cetonemie = fichierDT2!.criteres.find((c) => c.nom === 'cetonemie')
    expect(cetonemie).toBeDefined()
    expect(cetonemie!.type).toBe('bool')
  })
})

// =========================================================================================================
// 4. Non-régression — un nœud sans aucun `ref` se charge exactement comme avant ce mécanisme
// =========================================================================================================

describe('non-régression — une entrée déjà complète (sans `ref`) traverse la résolution sans changement', () => {
  it('renvoie EXACTEMENT le même objet (identité référentielle) — aucune fusion, aucune copie appliquée', () => {
    const entreeComplete: CritereEntree = { nom: 'age', type: 'nombre', min: 0, max: 120 }
    // Map VIDE volontaire : une entrée complète ne doit consulter AUCUN fichier commun pour se résoudre.
    const resolu = resoudreCritereEntree('noeud-test', 'domaine-test', entreeComplete, new Map())
    expect(resolu).toBe(entreeComplete)
  })

  it('le contenu réel se charge : `noeuds` non vide, et chaque `criteres_entree` est entièrement résolu (aucun `ref` résiduel)', () => {
    expect(noeuds.length).toBeGreaterThan(0)
    for (const noeud of noeuds) {
      for (const critere of noeud.criteres_entree) {
        expect(estRef(critere), `nœud "${noeud.id}" : un critère non résolu a atteint \`noeuds\``).toBe(false)
        expect(typeof critere.nom).toBe('string')
        expect(critere.nom.length).toBeGreaterThan(0)
      }
    }
  })

  it('les nœuds SANS aucun `ref` (tout le domaine hors la démonstration `cetonemie`) portent des critères identiques à leur déclaration YAML — aucun champ ajouté ni retiré par la résolution', () => {
    // `insuline` ne référence aucun critère commun (seul `prescription` porte la démonstration T-188) :
    // son `hypo_severe_recurrente`, seconde candidate de S14, reste déclaré en forme complète.
    const insuline = noeuds.find((n) => n.id === 'insuline')
    expect(insuline).toBeDefined()
    const hypoSevereRecurrente = insuline!.criteres_entree.find((c) => c.nom === 'hypo_severe_recurrente')
    expect(hypoSevereRecurrente).toEqual({
      nom: 'hypo_severe_recurrente',
      type: 'bool',
      groupe: "Signaux d'alerte et tolérance",
    })
  })
})

// =========================================================================================================
// 3. Erreurs explicites — jamais de repli silencieux (même politique que `ConditionError` du moteur)
// =========================================================================================================

describe('erreurs explicites de résolution — nomment toujours le nœud et le critère fautifs', () => {
  it('`ref` vers un domaine sans AUCUN fichier commun → `CritereCommunError` nommant le nœud, le critère et le domaine', () => {
    const communsVides = new Map<string, Map<string, CritereCommun>>()
    const appel = () =>
      resoudreCritereEntree('mon-noeud', 'domaine-sans-fichier', { ref: 'quoi-que-ce-soit' }, communsVides)

    expect(appel).toThrow(CritereCommunError)
    // Même idiome que `conditions.test.ts` (`toThrow(/…/)`) : le message DOIT nommer le nœud, le critère
    // et le domaine — c'est la garantie explicite du brief (§7 : « jamais de repli silencieux »).
    expect(appel).toThrow(/mon-noeud/)
    expect(appel).toThrow(/quoi-que-ce-soit/)
    expect(appel).toThrow(/domaine-sans-fichier/)
  })

  it('`ref` introuvable dans un fichier commun EXISTANT → `CritereCommunError` nommant le nœud et le critère', () => {
    const communs = new Map<string, Map<string, CritereCommun>>([
      ['domaine-test', new Map([['existe', { nom: 'existe', type: 'bool' }]])],
    ])
    const appel = () => resoudreCritereEntree('mon-noeud', 'domaine-test', { ref: 'inexistant' }, communs)

    expect(appel).toThrow(CritereCommunError)
    expect(appel).toThrow(/mon-noeud/)
    expect(appel).toThrow(/inexistant/)
  })

  it('le contenu réel ne contient AUCUN `ref` orphelin — le chargement de `noeuds` (import statique ci-dessus) n’a levé aucune `CritereCommunError`', () => {
    // Si un `ref` du contenu réel était fautif, l'import de `noeuds` en tête de fichier aurait déjà
    // lancé au chargement du module — cette assertion documente l'intention plutôt que de la re-tester
    // (on ne peut pas « re-déclencher » un import déjà résolu). Le fait que ce fichier de test s'exécute
    // du tout est la preuve que la résolution n'a levé sur aucun nœud réel.
    expect(noeuds.length).toBeGreaterThan(0)
  })
})

// =========================================================================================================
// 2. Refus, PAR LE SCHÉMA, d'une surcharge de champ de définition à côté d'un `ref`
// =========================================================================================================

describe('schéma (`noeud.schema.json`) — `criteres_entree` refuse un champ de définition à côté d’un `ref`', () => {
  const noeudSchema = lireSchema('noeud.schema.json')
  const ajv = new Ajv({ allErrors: true, strict: true })
  // Même patron que `modules.test.ts` (le schéma s'enregistre sous son PROPRE `$id`, déjà porté par le
  // document JSON — aucun second argument à passer).
  ajv.addSchema(noeudSchema)
  // Compilée à part (plutôt que de valider un nœud entier) : c'est la forme d'une ENTRÉE de
  // `criteres_entree` qui est en cause, pas la conformité d'un nœud complet — même `oneOf` que celui
  // posé sur `criteres_entree.items` dans le schéma réel (cf. son `$comment`).
  const validateCritereEntreeItem = ajv.compile({
    oneOf: [
      { $ref: 'https://ebm-msp.local/schema/noeud.schema.json#/definitions/critereEntree' },
      { $ref: 'https://ebm-msp.local/schema/noeud.schema.json#/definitions/critereEntreeRef' },
    ],
  })

  it('accepte la forme complète (`nom` + `type`, sans `ref`)', () => {
    expect(validateCritereEntreeItem({ nom: 'x', type: 'bool' })).toBe(true)
  })

  it('accepte la forme courte (`ref` + mise en scène, sans aucun champ de définition)', () => {
    expect(validateCritereEntreeItem({ ref: 'x', groupe: 'Section', visible_si: 'y == true' })).toBe(true)
  })

  it('accepte la forme courte avec `presomption_non` (LOCAL, D30 — pas un champ de définition)', () => {
    expect(validateCritereEntreeItem({ ref: 'x', presomption_non: true })).toBe(true)
  })

  it('REFUSE un `ref` accompagné de `type` — la surcharge silencieuse que ce mécanisme élimine', () => {
    expect(validateCritereEntreeItem({ ref: 'x', type: 'bool' })).toBe(false)
  })

  it('REFUSE un `ref` accompagné de `valeurs`', () => {
    expect(validateCritereEntreeItem({ ref: 'x', valeurs: ['a', 'b'] })).toBe(false)
  })

  it('REFUSE un `ref` accompagné de `derive`, `partage` ou `aide` (tous champs de définition)', () => {
    expect(validateCritereEntreeItem({ ref: 'x', derive: 'y == true' })).toBe(false)
    expect(validateCritereEntreeItem({ ref: 'x', partage: true })).toBe(false)
    expect(validateCritereEntreeItem({ ref: 'x', aide: 'texte' })).toBe(false)
  })

  it('REFUSE une entrée sans `nom` ET sans `ref` (ni l’une ni l’autre des deux formes)', () => {
    expect(validateCritereEntreeItem({ type: 'bool' })).toBe(false)
  })
})

// =========================================================================================================
// Conformité du fichier commun réel au schéma dédié — filet complémentaire, même patron que
// `content.test.ts`/`modules.test.ts` pour les deux autres types de fichiers de contenu.
// =========================================================================================================

describe('content/decision/criteres-communs/**/*.yaml — conformité à schema/decision/criteres-communs.schema.json', () => {
  const ajv = new Ajv({ allErrors: true, strict: true })
  const validate = ajv.compile(lireSchema('criteres-communs.schema.json'))

  it('au moins un fichier de critères communs existe (sinon ce test ne teste rien)', () => {
    expect(fichiersCriteresCommuns.length).toBeGreaterThan(0)
  })

  it.each(fichiersCriteresCommuns.map((f) => [f.domaine, f] as const))(
    'fichier du domaine "%s" conforme au schéma',
    (domaine, fichier) => {
      const valid = validate(fichier)
      expect(valid, `Fichier "${domaine}" invalide :\n${JSON.stringify(validate.errors, null, 2)}`).toBe(true)
    },
  )

  it('chaque `nom` de critère est UNIQUE dans son fichier (sinon la résolution par `ref` serait ambiguë en silence)', () => {
    for (const fichier of fichiersCriteresCommuns) {
      const noms = fichier.criteres.map((c) => c.nom)
      const uniques = new Set(noms)
      expect(uniques.size, `domaine "${fichier.domaine}" : noms en double parmi ${noms.join(', ')}`).toBe(noms.length)
    }
  })
})
