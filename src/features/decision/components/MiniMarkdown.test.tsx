import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { MiniMarkdown } from './MiniMarkdown'

// Fixture volontairement proche du contenu réel (content/noeuds/diabete-type-2/*.argumentaire.md) :
// un titre # en première ligne a déjà provoqué une boucle infinie (branche titre sans `i++`) qui
// gelait l'onglet à l'ouverture du niveau 3 (DECISIONS.md D11) — ce test la couvre en régression.
const FIXTURE = `# Titre niveau 1

> Citation sur
> deux lignes.

## Sous-titre

Paragraphe avec **gras**, *italique* et \`code\`, et un [lien](https://example.org).

- item 1
- item 2

1. premier
2. second

| Colonne A | Colonne B |
| --- | --- |
| a1 | b1 |

---

Dernier paragraphe.
`

describe('MiniMarkdown', () => {
  it('termine et rend les titres, citation, listes, tableau et texte enrichi', () => {
    const html = renderToStaticMarkup(<MiniMarkdown markdown={FIXTURE} />)
    expect(html).toContain('Titre niveau 1')
    expect(html).toContain('Sous-titre')
    expect(html).toContain('<blockquote')
    expect(html).toContain('<strong>gras</strong>')
    expect(html).toContain('<em>italique</em>')
    expect(html).toContain('<code>code</code>')
    expect(html).toContain('href="https://example.org"')
    expect(html).toContain('<ul')
    expect(html).toContain('<ol')
    expect(html).toContain('<table')
    expect(html).toContain('<hr')
    expect(html).toContain('Dernier paragraphe.')
  })

  it("ne boucle pas indéfiniment sur un document ne contenant qu'un titre", () => {
    const html = renderToStaticMarkup(<MiniMarkdown markdown={'# Seul titre\n'} />)
    expect(html).toContain('Seul titre')
  })

  it('rattache les lignes de continuation à la puce en cours (pas de `**`/`*` qui fuient)', () => {
    // Reproduit le cas réel (cible-glycemique.argumentaire.md) : une puce dont le texte, et un
    // **gras** qu'elle contient, s'étalent sur plusieurs lignes source sans marqueur de continuation.
    const markdown = [
      '- **Étude X (2009)** — 4 essais : mortalité toutes causes **HR 1,04',
      '  (0,90–1,20, NS)** ; événements CV majeurs **HR 0,91**.',
      '- Deuxième item.',
    ].join('\n')
    const html = renderToStaticMarkup(<MiniMarkdown markdown={markdown} />)
    expect(html).not.toContain('**')
    expect(html).toContain('<strong>HR 1,04 (0,90–1,20, NS)</strong>')
    expect(html).toContain('<strong>HR 0,91</strong>')
    expect(html).toContain('Deuxième item.')
  })
})
