import type { ReactNode } from 'react'
import './MiniMarkdown.css'

/**
 * Rendu Markdown minimal, sans dépendance (CLAUDE.md invariant 8 : pas de nouvelle dépendance
 * runtime sans décision explicite). Ce n'est pas un parseur CommonMark complet : seulement le
 * sous-ensemble réellement utilisé par les argumentaires exhaustifs (niveau 3, DECISIONS.md D11) —
 * titres `#`/`##`/`###`, listes à puces/numérotées, citation `>`, tableau `|...|`, règle horizontale
 * `---`, gras/italique/code en ligne, liens `[texte](url)`.
 */
interface MiniMarkdownProps {
  markdown: string
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/
  const tokens: ReactNode[] = []
  let rest = text
  let key = 0

  while (rest.length > 0) {
    const match = pattern.exec(rest)
    if (!match || match.index === undefined) {
      tokens.push(rest)
      break
    }
    if (match.index > 0) tokens.push(rest.slice(0, match.index))
    const token = match[0]
    if (token.startsWith('**')) {
      tokens.push(<strong key={`${keyPrefix}-${key++}`}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      tokens.push(<code key={`${keyPrefix}-${key++}`}>{token.slice(1, -1)}</code>)
    } else if (token.startsWith('[')) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token)
      if (linkMatch) {
        tokens.push(
          <a key={`${keyPrefix}-${key++}`} href={linkMatch[2]} target="_blank" rel="noreferrer">
            {linkMatch[1]}
          </a>,
        )
      }
    } else {
      tokens.push(<em key={`${keyPrefix}-${key++}`}>{token.slice(1, -1)}</em>)
    }
    rest = rest.slice(match.index + token.length)
  }
  return tokens
}

const BLOCK_STARTS = [/^#{1,3}\s/, /^>\s?/, /^\|/, /^[-*]\s/, /^\d+\.\s/]
const isOtherBlockStart = (line: string) => BLOCK_STARTS.some((pattern) => pattern.test(line))

export function MiniMarkdown({ markdown }: MiniMarkdownProps) {
  const lines = markdown.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    if (/^#{1,3}\s/.test(line)) {
      const level = /^#+/.exec(line)![0].length
      const text = line.replace(/^#{1,3}\s/, '')
      const content = renderInline(text, `h${key}`)
      blocks.push(
        level === 1 ? (
          <h2 key={key++} className="mini-md__heading mini-md__heading--1">
            {content}
          </h2>
        ) : level === 2 ? (
          <h3 key={key++} className="mini-md__heading mini-md__heading--2">
            {content}
          </h3>
        ) : (
          <h4 key={key++} className="mini-md__heading mini-md__heading--3">
            {content}
          </h4>
        ),
      )
      i++
      continue
    }

    if (line.trim() === '---') {
      blocks.push(<hr key={key++} className="mini-md__hr" />)
      i++
      continue
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push(
        <blockquote key={key++} className="mini-md__quote">
          {renderInline(quoteLines.join(' '), `q${key}`)}
        </blockquote>,
      )
      continue
    }

    if (/^\|/.test(line)) {
      const tableLines: string[] = []
      while (i < lines.length && /^\|/.test(lines[i])) {
        tableLines.push(lines[i])
        i++
      }
      const rows = tableLines
        .filter((row) => !/^\|[\s\-:|]+\|$/.test(row))
        .map((row) =>
          row
            .split('|')
            .slice(1, -1)
            .map((cell) => cell.trim()),
        )
      const [header, ...body] = rows
      if (header) {
        blocks.push(
          <table key={key++} className="mini-md__table">
            <thead>
              <tr>
                {header.map((cell, index) => (
                  <th key={index}>{renderInline(cell, `th${key}-${index}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{renderInline(cell, `td${key}-${rowIndex}-${cellIndex}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>,
        )
      }
      continue
    }

    if (/^[-*]\s/.test(line)) {
      const items: string[] = []
      // Une puce peut s'étaler sur plusieurs lignes source (habitude de rédaction de ce dossier,
      // sans marqueur sur les lignes de continuation) : on les rattache au dernier item plutôt que
      // de les laisser retomber en paragraphe séparé — sinon un **gras**/*italique* ouvert sur une
      // ligne et fermé sur la suivante laisse échapper des `*`/`**` littéraux dans le texte affiché.
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        lines[i].trim() !== '---' &&
        !/^#{1,3}\s/.test(lines[i]) &&
        !/^>\s?/.test(lines[i]) &&
        !/^\|/.test(lines[i])
      ) {
        if (/^[-*]\s/.test(lines[i])) {
          items.push(lines[i].replace(/^[-*]\s/, ''))
        } else {
          items[items.length - 1] = `${items[items.length - 1]} ${lines[i].trim()}`
        }
        i++
      }
      blocks.push(
        <ul key={key++} className="mini-md__list">
          {items.map((item, index) => (
            <li key={index}>{renderInline(item, `li${key}-${index}`)}</li>
          ))}
        </ul>,
      )
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        lines[i].trim() !== '---' &&
        !/^#{1,3}\s/.test(lines[i]) &&
        !/^>\s?/.test(lines[i]) &&
        !/^\|/.test(lines[i])
      ) {
        if (/^\d+\.\s/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s/, ''))
        } else {
          items[items.length - 1] = `${items[items.length - 1]} ${lines[i].trim()}`
        }
        i++
      }
      blocks.push(
        <ol key={key++} className="mini-md__list">
          {items.map((item, index) => (
            <li key={index}>{renderInline(item, `oli${key}-${index}`)}</li>
          ))}
        </ol>,
      )
      continue
    }

    const paragraphLines: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && lines[i].trim() !== '---' && !isOtherBlockStart(lines[i])) {
      paragraphLines.push(lines[i])
      i++
    }
    blocks.push(
      <p key={key++} className="mini-md__paragraph">
        {renderInline(paragraphLines.join(' '), `p${key}`)}
      </p>,
    )
  }

  return <div className="mini-md">{blocks}</div>
}
