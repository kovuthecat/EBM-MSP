/**
 * Vérifie que chaque nœud de décision YAML (`/content/noeuds/**`) est conforme à
 * `schema/noeud.schema.json` (DECISIONS.md D9). Échoue avec le chemin du champ fautif si un nœud
 * est invalide — c'est le garde-fou « validation JSON Schema » exigé par le brief §5.
 *
 * Référence explicite aux types Node (ce fichier lit `schema/` via `fs`) : `tsconfig.app.json`
 * restreint volontairement `types` à `["vite/client"]` pour le code applicatif (pas de types Node
 * globaux dans le bundle navigateur) ; ce triple-slash importe les déclarations Node uniquement
 * pour ce fichier de test, sans toucher la config partagée.
 */
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv, { type AnySchemaObject, type ErrorObject } from 'ajv'
import { describe, expect, it } from 'vitest'
import { noeuds } from './loadNodes.ts'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const schemaPath = path.resolve(dirname, '../../../../schema/noeud.schema.json')
const schema = JSON.parse(readFileSync(schemaPath, 'utf-8')) as AnySchemaObject

const ajv = new Ajv({ allErrors: true, strict: true })
const validate = ajv.compile(schema)

function formatErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors || errors.length === 0) return '(aucun détail)'
  return errors
    .map((err) => `  - champ "${err.instancePath || '/'}" : ${err.message} ${JSON.stringify(err.params)}`)
    .join('\n')
}

describe('contenu des nœuds de décision (conformité à schema/noeud.schema.json)', () => {
  it('charge au moins un nœud depuis /content/noeuds', () => {
    expect(noeuds.length).toBeGreaterThan(0)
  })

  it.each(noeuds.map((noeud) => [noeud.domaine, noeud.id, noeud] as const))(
    'nœud "%s/%s" conforme au schéma',
    (_domaine, id, noeud) => {
      const valid = validate(noeud)
      expect(valid, `Nœud "${id}" invalide :\n${formatErrors(validate.errors)}`).toBe(true)
    },
  )
})
