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

/**
 * Intégrité référentielle `Noeud.familles` ↔ `Option.famille` (correctif « ordre accidentel / badge
 * multi-natures », 2026-07-25) : le schéma JSON ne peut PAS croiser deux champs (un `option.famille`
 * inconnu de `familles[].libelle` y passerait inaperçu), d'où ce test dédié plutôt qu'un commentaire.
 * Deux sens de vérification :
 * - toute valeur `option.famille` utilisée doit être déclarée dans `familles[].libelle` du même nœud
 *   (sinon l'option tomberait dans un trou noir : `groupesParFamille` l'ignorerait silencieusement) ;
 * - toute famille déclarée doit être utilisée par au moins une option (sinon une section morte, jamais
 *   affichée, resterait dans le contenu sans que rien ne le signale).
 */
describe('intégrité référentielle Noeud.familles ↔ Option.famille', () => {
  it.each(noeuds.map((noeud) => [noeud.domaine, noeud.id, noeud] as const))(
    'nœud "%s/%s" : chaque `option.famille` référence une famille déclarée, chaque famille déclarée est utilisée',
    (_domaine, id, noeud) => {
      const familles = noeud.familles ?? []
      const libellesDeclares = new Set(familles.map((f) => f.libelle))
      const famillesUtilisees = new Set(
        noeud.options.map((o) => o.famille).filter((f): f is string => f != null),
      )

      for (const famille of noeud.options.map((o) => o.famille).filter((f): f is string => f != null)) {
        expect(
          libellesDeclares.has(famille),
          `Nœud "${id}" : option.famille "${famille}" n'est déclarée dans aucune entrée de \`familles\`.`,
        ).toBe(true)
      }
      for (const libelle of libellesDeclares) {
        expect(
          famillesUtilisees.has(libelle),
          `Nœud "${id}" : famille "${libelle}" déclarée dans \`familles\` mais utilisée par aucune option.`,
        ).toBe(true)
      }
    },
  )
})
