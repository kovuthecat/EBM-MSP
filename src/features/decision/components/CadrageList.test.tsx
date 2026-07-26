import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { noeuds } from '../content/loadNodes'
import { CadrageList } from './CadrageList'

describe('CadrageList', () => {
  it('ne rend rien si le nœud ne déclare aucun cadrage (champ optionnel)', () => {
    expect(renderToStaticMarkup(<CadrageList cadrage={[]} />)).toBe('')
  })

  it('rend chaque énoncé', () => {
    const html = renderToStaticMarkup(
      <CadrageList cadrage={['Première position.', 'Seconde position.']} />,
    )
    expect(html).toContain('Première position.')
    expect(html).toContain('Seconde position.')
  })

  it("n'emprunte aucune classe d'alerte (D24 : un cadrage n'est pas un signal)", () => {
    // Le point du champ `cadrage` est de SORTIR ces énoncés du canal des alertes (D21, interdit n°2).
    // Les rendre avec le style d'une alerte reproduirait à l'écran le défaut corrigé dans le contenu :
    // un avertissement affiché à tout le monde, qui dévalue les alertes conditionnelles voisines.
    const html = renderToStaticMarkup(<CadrageList cadrage={['Un énoncé de cadrage.']} />)
    expect(html).not.toContain('alert-list')
    expect(html).toContain('cadrage-list')
  })

  it('le contenu réel ne place en `cadrage` que des énoncés SANS condition (D24)', () => {
    // Garde-fou de CONTENU : `cadrage` est un tableau de chaînes, donc structurellement incapable de
    // porter un `quand`. Ce test vérifie qu'on ne contourne pas la règle en réintroduisant une condition
    // dans la prose (« si le patient… », « en cas de… ») — ce qui signerait une alerte déguisée en
    // cadrage, exactement le glissement inverse de celui que D24 corrige.
    const suspects: string[] = []
    for (const node of noeuds) {
      for (const enonce of node.cadrage ?? []) {
        if (/^\s*(si |en cas d|chez le patient qui|lorsque )/i.test(enonce)) {
          suspects.push(`${node.id} :: ${enonce.slice(0, 90)}…`)
        }
      }
    }
    expect(suspects).toEqual([])
  })

  it('aucun nœud ne porte plus une position de lecture dans le canal des alertes (I6, dette levée)', () => {
    // Doublon VOLONTAIRE de l'invariant I6 du banc (`engine/banc/invariants-contenu.test.ts`), placé ici
    // parce que c'est le composant qui donne au contenu son canal de rechange : si quelqu'un supprimait
    // `cadrage`, le banc et ce fichier échoueraient ensemble, et la raison serait lisible des deux côtés.
    const defauts = noeuds.flatMap((node) =>
      (node.alertes ?? [])
        .filter((alerte) => alerte.quand === 'default')
        .map((alerte) => `${node.id} :: ${alerte.message.slice(0, 90)}…`),
    )
    expect(defauts).toEqual([])
  })
})
