/**
 * Modules de décision (DECISIONS.md D22) : conformité au schéma + INTÉGRITÉ RÉFÉRENTIELLE entre un
 * module et ses nœuds. Le schéma JSON ne peut pas croiser deux fichiers — c'est exactement là que se
 * logent les erreurs de ce mécanisme, d'où ces tests plutôt qu'un commentaire.
 *
 * Le défaut que ces tests auraient attrapé s'ils avaient existé plus tôt : `module: RHD` était écrit
 * dans les deux nœuds RHD depuis leur création et n'était lu par AUCUN code — un champ de contenu
 * orphelin, invisible aussi bien à l'écran qu'aux tests.
 */
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv, { type AnySchemaObject, type ErrorObject } from 'ajv'
import { describe, expect, it } from 'vitest'
import { entreesListe, getModuleDuNoeud, modules } from './loadModules.ts'
import { noeuds } from './loadNodes.ts'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const lireSchema = (nom: string) =>
  JSON.parse(readFileSync(path.resolve(dirname, `../../../../schema/decision/${nom}`), 'utf-8')) as AnySchemaObject

const ajv = new Ajv({ allErrors: true, strict: true })
// `module.schema.json` référence `noeud.schema.json#/definitions/meta` : les deux doivent être connus
// d'Ajv, sinon la compilation échoue sur une `$ref` non résolue.
ajv.addSchema(lireSchema('noeud.schema.json'))
const validate = ajv.compile(lireSchema('module.schema.json'))

function formatErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors || errors.length === 0) return '(aucun détail)'
  return errors
    .map((err) => `  - champ "${err.instancePath || '/'}" : ${err.message} ${JSON.stringify(err.params)}`)
    .join('\n')
}

describe('modules de décision (conformité à schema/decision/module.schema.json)', () => {
  it.each(modules.map((module) => [module.id, module] as const))(
    'module "%s" conforme au schéma',
    (id, module) => {
      expect(validate(module), `Module "${id}" invalide :\n${formatErrors(validate.errors)}`).toBe(true)
    },
  )
})

describe('intégrité référentielle module ↔ nœuds (D22)', () => {
  it('tout `Noeud.module` déclaré correspond à un fichier de module existant', () => {
    // Sens 1 — un nœud qui se dit d'un module fantôme : le champ serait mort, comme avant D22.
    const orphelins = noeuds
      .filter((noeud) => noeud.module != null && getModuleDuNoeud(noeud) === undefined)
      .map((noeud) => `${noeud.id} (module déclaré : "${noeud.module}")`)
    expect(orphelins).toEqual([])
  })

  it('tout module déclaré regroupe au moins DEUX nœuds', () => {
    // Sens 2 — un module d'un seul nœud n'a aucun objet : il ajoute un écran d'interstice sans rien
    // mutualiser, et fait payer un clic de plus au praticien pour une seule destination.
    const insuffisants = modules
      .map((module) => ({
        module,
        n: noeuds.filter((noeud) => getModuleDuNoeud(noeud)?.id === module.id).length,
      }))
      .filter(({ n }) => n < 2)
      .map(({ module, n }) => `${module.id} : ${n} nœud(s)`)
    expect(insuffisants).toEqual([])
  })

  it('chaque orientation du primer vise un nœud EXISTANT et appartenant au module', () => {
    const fautives: string[] = []
    for (const module of modules) {
      for (const orientation of module.primer.orientations) {
        const noeud = noeuds.find((n) => n.id === orientation.noeud)
        if (!noeud) {
          fautives.push(`${module.id} → "${orientation.noeud}" : nœud inexistant`)
          continue
        }
        if (getModuleDuNoeud(noeud)?.id !== module.id) {
          fautives.push(
            `${module.id} → "${orientation.noeud}" : ce nœud n'appartient pas au module (module = ${noeud.module ?? 'aucun'})`,
          )
        }
      }
    }
    expect(fautives).toEqual([])
  })

  it('chaque nœud du module est ATTEIGNABLE depuis le primer', () => {
    // Sans ce test, un nœud pourrait appartenir à un module sans qu'aucune orientation n'y mène :
    // l'écran de module l'ayant retiré de la liste des nœuds, il deviendrait inaccessible — une
    // régression silencieuse, et la plus grave que ce mécanisme puisse produire.
    const inatteignables: string[] = []
    for (const module of modules) {
      const cibles = new Set(module.primer.orientations.map((o) => o.noeud))
      for (const noeud of noeuds.filter((n) => getModuleDuNoeud(n)?.id === module.id)) {
        if (!cibles.has(noeud.id)) inatteignables.push(`${module.id} :: ${noeud.id}`)
      }
    }
    expect(inatteignables).toEqual([])
  })

  it('un module et ses nœuds sont du même domaine', () => {
    const incoherents = noeuds
      .filter((noeud) => {
        const module = getModuleDuNoeud(noeud)
        return module != null && module.domaine !== noeud.domaine
      })
      .map((noeud) => noeud.id)
    expect(incoherents).toEqual([])
  })
})

describe('liste d\'un domaine : un module compte pour une entrée', () => {
  it('les nœuds d\'un module sont repliés sous une entrée unique, les autres restent à plat', () => {
    const entrees = entreesListe(noeuds.filter((n) => n.domaine === 'diabete-type-2'))
    const entreesModule = entrees.filter((e) => e.type === 'module')
    const noeudsRepliés = entreesModule.flatMap((e) => (e.type === 'module' ? e.noeuds : []))

    expect(entreesModule.length).toBeGreaterThan(0)
    // Aucun nœud replié ne doit AUSSI apparaître comme entrée de premier niveau (sinon on entrerait
    // dans un nœud du module sans jamais voir son cadrage — l'écran de module perdrait son objet).
    const idsPlats = new Set(entrees.flatMap((e) => (e.type === 'noeud' ? [e.noeud.id] : [])))
    for (const noeud of noeudsRepliés) expect(idsPlats.has(noeud.id)).toBe(false)
  })

  it('un domaine sans module donne exactement la liste des nœuds, dans le même ordre', () => {
    // Non-régression du repli : le mécanisme ne doit rien changer là où aucun module n'est déclaré.
    const sansModule = noeuds.filter((n) => n.module == null)
    const entrees = entreesListe(sansModule)
    expect(entrees.map((e) => (e.type === 'noeud' ? e.noeud.id : `module:${e.module.id}`))).toEqual(
      sansModule.map((n) => n.id),
    )
  })
})
