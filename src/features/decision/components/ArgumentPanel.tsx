import { useState } from 'react'
import type { Noeud, ReferencePrimaire } from '../content/node.types'
import { getArgumentaireExhaustif } from '../content/loadArgumentaires'
import { labelForTypeCritere } from '../lib/labels'
import { Icon } from '../../shared/icons/Icon'
import { MiniMarkdown } from './MiniMarkdown'
import './ArgumentPanel.css'

interface ArgumentPanelProps {
  node: Noeud
}

/**
 * Argumentaire détaillé (niveau de lecture 2, DECISIONS.md D11), déplié à la demande par l'écran
 * appelant (`DecisionNodeScreen`) — ce composant ne rend que le contenu.
 *
 * ORDRE DE LECTURE (refonte du 2026-08-04) : ce panneau se lit du plus général au plus précis, et
 * chaque section répond à UNE question.
 *
 * 1. **Comment ce nœud raisonne** — `node.argumentaire`. CE CHAMP N'ÉTAIT RENDU NULLE PART avant cette
 *    refonte : obligatoire au schéma, rempli avec soin dans les six nœuds, et mort. C'est pourtant la
 *    seule prose qui explique la LOGIQUE du nœud (ce qu'il hiérarchise, sur quel principe) — replié par
 *    défaut, parce qu'on n'en a pas besoin à chaque consultation, mais présent.
 * 2. **Ce que dit la recommandation officielle** / **Comment l'outil lit les données** — les deux
 *    positions, côte à côte, chacune avec SES références : citations précises des textes officiels d'un
 *    côté (`reco_officielle.references`), essais qui portent la lecture de l'autre
 *    (`synthese_critique.appuis` → `references_primaires`).
 * 3. **Divergences** — le cœur. Une divergence = un bloc à trois faces comparables (ce que dit la reco /
 *    ce que fait l'outil / sur quelles données), et non plus une prose numérotée noyée sous les colonnes.
 * 4. **Points d'accord** — `reco_officielle.explication`, redéfini comme la lecture d'ensemble.
 * 5. **Ce qui reste incertain** — `node.incertitudes`.
 * 6. **Essais et sources primaires** — `references_primaires`.
 * 7. **Argumentaire exhaustif** — niveau de lecture 3, Markdown chargé par `loadArgumentaires.ts`.
 *
 * DEUX CANAUX DE RÉFÉRENCE, PLUS TROIS (2026-08-04). `synthese_critique.references` — les revues
 * secondaires indépendantes (Prescrire, Médicalement Geek/DragiWebdo, Minerva…) — a été SUPPRIMÉ du
 * modèle. D23 les avait sorties du sujet grammatical des phrases d'argument pour que ce soit la donnée
 * qui porte l'argument ; les laisser en bibliographie sous la position les y remettait par la petite
 * porte, le lecteur lisant « position critique … Réf. : Prescrire » comme « Prescrire dit que ». Ne
 * restent affichés que des essais et des textes de recommandation officiels. Ce qui a été LU pour
 * construire une position est de la méthode, pas de la preuve : c'est tracé en commentaire YAML et dans
 * l'argumentaire exhaustif, hors de cet écran.
 *
 * REPLI SUR LE RENDU HISTORIQUE : `divergences` et `references` sont optionnels. Un nœud qui ne les
 * porte pas encore (cinq des six au jour de cette refonte) rend `explication` seule, comme avant.
 */
export function ArgumentPanel({ node }: ArgumentPanelProps) {
  const { reco_officielle, synthese_critique, references_primaires } = node.sources
  const [exhaustifOpen, setExhaustifOpen] = useState(false)
  const [raisonnementOpen, setRaisonnementOpen] = useState(false)
  const exhaustif = getArgumentaireExhaustif(node.argumentaire_exhaustif)

  // Résolution des `appuis` (ids) en références réelles. Un id inconnu est ignoré silencieusement ICI —
  // le signaler est le travail d'un invariant de contenu (banc), pas d'un composant de rendu, qui n'a
  // pas à décider quoi faire d'un contenu invalide au milieu d'une consultation.
  const parId = new Map(references_primaires.map((reference) => [reference.id, reference]))
  const appuis = (synthese_critique.appuis ?? [])
    .map((id) => parId.get(id))
    .filter((reference): reference is ReferencePrimaire => Boolean(reference))

  const divergences = reco_officielle.divergences ?? []

  return (
    <div className="argument-panel">
      {/* 1. La logique du nœud — repliée : utile une fois, pas à chaque consultation. */}
      <div className="argument-panel__raisonnement">
        <button
          type="button"
          className="argument-panel__raisonnement-toggle"
          aria-expanded={raisonnementOpen}
          onClick={() => setRaisonnementOpen((open) => !open)}
        >
          <Icon nom={raisonnementOpen ? 'chevron-bas' : 'chevron-droite'} />
          Comment ce nœud raisonne
        </button>
        {raisonnementOpen && <p className="argument-panel__raisonnement-body">{node.argumentaire}</p>}
      </div>

      {/* 2. Les deux positions, chacune avec ses propres références. */}
      <div className="argument-panel__columns">
        <div className="argument-panel__column">
          <div className="argument-panel__column-title argument-panel__column-title--reco">
            Ce que dit la recommandation officielle
          </div>
          <div className="argument-panel__column-source">{reco_officielle.source}</div>
          <p className="argument-panel__column-text">{reco_officielle.position}</p>
          {reco_officielle.references && reco_officielle.references.length > 0 && (
            <ul className="argument-panel__citations">
              {reco_officielle.references.map((reference) => (
                <li key={reference.nom} className="argument-panel__citation">
                  <span className="argument-panel__citation-nom">
                    {reference.lien ? (
                      <a href={reference.lien} target="_blank" rel="noreferrer">
                        {reference.nom}
                      </a>
                    ) : (
                      reference.nom
                    )}
                  </span>
                  {reference.detail && (
                    <span className="argument-panel__citation-detail"> — {reference.detail}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="argument-panel__column">
          <div className="argument-panel__column-title argument-panel__column-title--critique">
            Comment l'outil lit les données
          </div>
          {synthese_critique.donnee && (
            <p className="argument-panel__column-text">{synthese_critique.donnee}</p>
          )}
          {appuis.length > 0 && (
            <p className="argument-panel__column-note argument-panel__source-refs">
              D'après :{' '}
              {appuis.map((reference, index) => (
                <span key={reference.id}>
                  {index > 0 && ' · '}
                  {reference.lien ? (
                    <a href={reference.lien} target="_blank" rel="noreferrer">
                      {reference.titre}
                    </a>
                  ) : (
                    reference.titre
                  )}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {/* 3. Les divergences, une par bloc. Le drapeau annonce COMBIEN — c'est ce que le lecteur veut
          savoir en premier, et c'est ce que la prose numérotée d'avant lui cachait. */}
      {reco_officielle.divergence && (
        <div className="argument-panel__divergence">
          <span className="argument-panel__divergence-icon" aria-hidden="true">
            <Icon nom="triangle-alerte" />
          </span>
          {divergences.length > 0
            ? `${divergences.length} ${divergences.length > 1 ? 'divergences' : 'divergence'} avec la recommandation officielle`
            : 'Divergence entre reco officielle et position critique'}
        </div>
      )}

      {divergences.map((divergence) => (
        <div key={divergence.sujet} className="argument-panel__divergence-bloc">
          <div className="argument-panel__divergence-sujet">{divergence.sujet}</div>
          <dl className="argument-panel__divergence-faces">
            <dt className="argument-panel__divergence-face argument-panel__divergence-face--reco">
              La recommandation
            </dt>
            <dd className="argument-panel__divergence-texte">{divergence.position_officielle}</dd>
            <dt className="argument-panel__divergence-face argument-panel__divergence-face--outil">
              L'outil
            </dt>
            <dd className="argument-panel__divergence-texte">{divergence.position_outil}</dd>
            <dt className="argument-panel__divergence-face argument-panel__divergence-face--appui">
              Sur quelles données
            </dt>
            <dd className="argument-panel__divergence-texte">{divergence.appui}</dd>
          </dl>
        </div>
      ))}

      {/* 4. Ce sur quoi les deux lectures se rejoignent. */}
      {reco_officielle.explication && (
        <>
          <div className="argument-panel__section-title">
            {divergences.length > 0 ? "Points d'accord" : 'Lecture d’ensemble'}
          </div>
          <p className="argument-panel__accord">{reco_officielle.explication}</p>
        </>
      )}

      {node.incertitudes.length > 0 && (
        <>
          <div className="argument-panel__section-title">Ce qui reste incertain</div>
          {node.incertitudes.map((incertitude, index) => (
            <div key={`${index}-${incertitude}`} className="argument-panel__list-item">
              {incertitude}
            </div>
          ))}
        </>
      )}

      {references_primaires.length > 0 && (
        <>
          <div className="argument-panel__section-title">Essais et sources primaires</div>
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
