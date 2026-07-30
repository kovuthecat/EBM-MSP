import { useState } from 'react'
import './PopulationCible.css'

interface PopulationCibleProps {
  texte: string
}

/**
 * Repli `population_cible` (remontée UI, 2026-07-29) : ce champ de contenu porte souvent, en plus de la
 * population visée, le périmètre et les exclusions du nœud (ex. `rhd-alimentation`, `statine` — jusqu'à
 * ~1300 caractères) — un texte méthodologique légitime, mais illisible affiché en entier en pleine
 * largeur juste sous le titre. Coupé ici à la PREMIÈRE PHRASE (toujours visible), le reste replié
 * derrière un bouton : rien n'est retiré ni reformulé (le contenu clinique reste hors périmètre d'un
 * écran), seule sa présentation devient progressive.
 */
export function PopulationCible({ texte }: PopulationCibleProps) {
  const [open, setOpen] = useState(false)
  const decoupe = texte.match(/^.+?[.!?](?=\s|$)/)
  const premiere = decoupe ? decoupe[0] : texte
  const reste = texte.slice(premiere.length).trim()

  if (reste.length === 0) {
    return <p className="population-cible">{premiere}</p>
  }

  return (
    <div className="population-cible">
      <p className="population-cible__premiere">{premiere}</p>
      {open && <p className="population-cible__reste">{reste}</p>}
      <button
        type="button"
        className="population-cible__toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Réduire' : 'Voir le périmètre complet'}
      </button>
    </div>
  )
}
