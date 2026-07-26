import { useState } from 'react'
import type { Noeud } from '../content/node.types'
import { getArgumentaireExhaustif } from '../content/loadArgumentaires'
import { labelForTypeCritere } from '../lib/labels'
import { MiniMarkdown } from './MiniMarkdown'
import './ArgumentPanel.css'

interface ArgumentPanelProps {
  node: Noeud
}

/**
 * Argumentaire détaillé (niveau de lecture 2, DECISIONS.md D11), dépliable à la demande (T-006
 * étape 3) : reco officielle vs position critique côte à côte, drapeau de divergence, incertitudes,
 * sources principales. La visibilité (déplié/replié) est pilotée par l'écran appelant
 * (`DecisionNodeScreen`, état éphémère) — ce composant ne rend que le contenu.
 *
 * « Position critique » = `sources.synthese_critique` (DECISIONS.md D23 : modèle réorganisé PAR NATURE
 * de source, pas par titre de publication — fusion des ex-champs `sources.medicalement_geek` /
 * `sources.prescrire`). `donnee` porte l'argument, fondé sur les essais/méta-analyses ; `references`
 * liste les revues secondaires indépendantes consultées (Prescrire, Médicalement Geek/DragiWebdo,
 * Minerva...), rendues en fin de colonne comme des citations bibliographiques — jamais en préfixe
 * estampillant le texte comme le faisait l'ancien modèle (« Prescrire — », « Médicalement Geek — »),
 * ce qui laissait le nom de la revue porter l'argument quel que soit le texte réellement écrit. En
 * regard : `sources.reco_officielle` (HAS/SFD/ADA-EASD — organismes émettant une recommandation
 * formelle, distincts par nature d'une revue secondaire indépendante).
 *
 * Expose aussi le **niveau de lecture 3** (DECISIONS.md D11) : un lien dépliant l'argumentaire
 * exhaustif (`node.argumentaire_exhaustif`, Markdown brut chargé par `loadArgumentaires.ts`, rendu
 * par `MiniMarkdown` sans dépendance ajoutée). N'apparaît que si le nœud référence un fichier
 * existant — un nœud futur sans ce champ reste au niveau 2, pas d'erreur.
 */
export function ArgumentPanel({ node }: ArgumentPanelProps) {
  const { reco_officielle, synthese_critique, references_primaires } = node.sources
  const [exhaustifOpen, setExhaustifOpen] = useState(false)
  const exhaustif = getArgumentaireExhaustif(node.argumentaire_exhaustif)

  return (
    <div className="argument-panel">
      <div className="argument-panel__title">Reco officielle vs position critique</div>

      <div className="argument-panel__columns">
        <div className="argument-panel__column">
          <div className="argument-panel__column-title argument-panel__column-title--reco">
            Reco officielle — {reco_officielle.source}
          </div>
          <p className="argument-panel__column-text">{reco_officielle.position}</p>
          {reco_officielle.explication && (
            <p className="argument-panel__column-note">{reco_officielle.explication}</p>
          )}
        </div>
        <div className="argument-panel__column">
          <div className="argument-panel__column-title argument-panel__column-title--critique">
            Position critique
          </div>
          {synthese_critique.donnee && (
            <p className="argument-panel__column-text">{synthese_critique.donnee}</p>
          )}
          {synthese_critique.references.length > 0 && (
            <p className="argument-panel__column-note argument-panel__source-refs">
              Réf. :{' '}
              {synthese_critique.references.map((reference, index) => (
                <span key={reference.nom}>
                  {index > 0 && ' · '}
                  {reference.lien ? (
                    <a href={reference.lien} target="_blank" rel="noreferrer">
                      {reference.nom}
                    </a>
                  ) : (
                    reference.nom
                  )}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {reco_officielle.divergence && (
        <div className="argument-panel__divergence">
          <span className="argument-panel__divergence-icon" aria-hidden="true">
            !
          </span>
          Divergence entre reco officielle et position critique
        </div>
      )}

      {node.incertitudes.length > 0 && (
        <>
          <div className="argument-panel__section-title">Incertitudes</div>
          {node.incertitudes.map((incertitude, index) => (
            <div key={`${index}-${incertitude}`} className="argument-panel__list-item">
              • {incertitude}
            </div>
          ))}
        </>
      )}

      {references_primaires.length > 0 && (
        <>
          <div className="argument-panel__section-title">Sources</div>
          {references_primaires.map((reference, index) => (
            <div key={`${index}-${reference.titre}`} className="argument-panel__source-row">
              {reference.lien ? (
                <a href={reference.lien} target="_blank" rel="noreferrer">
                  {reference.titre} ({reference.annee})
                </a>
              ) : (
                <span>
                  {reference.titre} ({reference.annee})
                </span>
              )}
              <span className="argument-panel__source-type">
                {labelForTypeCritere(reference.type_critere)}
              </span>
            </div>
          ))}
        </>
      )}

      {exhaustif && (
        <div className="argument-panel__exhaustif">
          <button
            type="button"
            className="argument-panel__exhaustif-toggle"
            onClick={() => setExhaustifOpen((open) => !open)}
          >
            {exhaustifOpen
              ? "Replier l'argumentaire exhaustif"
              : "→ Argumentaire exhaustif (toutes les preuves et sources)"}
          </button>
          {exhaustifOpen && (
            <div className="argument-panel__exhaustif-body">
              <MiniMarkdown markdown={exhaustif} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
