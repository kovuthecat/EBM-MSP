import { useCallback, useEffect, useState } from 'react'
import type { Navigation } from '../shared/navigation'
import { useUtilisateur } from '../shared/lib/auth'
import { submitFeedback } from './data'
import type { FeedbackCategory } from './data'
import { FEEDBACK_UI_ATTR, capturePageContext, captureScreenshot, pageLabelFor } from './context'
import './FeedbackWidget.css'

/**
 * Bouton flottant « Un souci ? » (D51, 2026-08-06, demande utilisateur « ajoute la même fonction de
 * retour utilisateur de l'annuaire ») — port de `annuaire-msp/src/features/feedback/FeedbackWidget.tsx`,
 * adapté aux conventions de cette app (CSS de fichier plutôt que styles en ligne, tokens
 * `styles/tokens.css`, navigation state-based `Navigation.screen` plutôt que `useLocation`).
 *
 * Rendu UNIQUEMENT connecté (RLS `ebm_feedback_insert` l'exige de toute façon ; `null` avant que la
 * session soit résolue évite un flash) — jamais sur l'écran de connexion lui-même (mêmes comptes,
 * même principe que l'annuaire : « jamais sur l'écran de connexion »).
 *
 * PAS PORTÉ, hors mandat de cette demande (le port du BOUTON, pas de l'écran référent) : la vue
 * `/retours` de traitement des retours (liste, changement de statut, export) — cf. backlog.
 */
interface CategoryMeta {
  key: FeedbackCategory
  icon: string
  label: string
  placeholder: string
}

const CATEGORIES: readonly CategoryMeta[] = [
  {
    key: 'probleme',
    icon: '🐞',
    label: 'Problème',
    placeholder: "Qu'est-ce qui ne marche pas ? Que faisiez-vous juste avant ?",
  },
  {
    key: 'donnee',
    icon: '✏️',
    label: 'Donnée erronée',
    placeholder: 'Quelle information est fausse ou manquante, et quelle est la bonne ?',
  },
  {
    key: 'suggestion',
    icon: '💡',
    label: 'Suggestion',
    placeholder: "Qu'est-ce qui vous simplifierait la vie ?",
  },
]

interface FeedbackWidgetProps {
  screen: Navigation['screen']
}

export function FeedbackWidget({ screen }: FeedbackWidgetProps) {
  const utilisateur = useUtilisateur()
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<FeedbackCategory>('probleme')
  const [message, setMessage] = useState('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [includeShot, setIncludeShot] = useState(true)
  const [capturing, setCapturing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeCategory = CATEGORIES.find((c) => c.key === category) ?? CATEGORIES[0]!

  const close = useCallback(() => {
    if (submitting) return
    setOpen(false)
  }, [submitting])

  const openPanel = () => {
    setOpen(true)
    setDone(false)
    setError(null)
    setMessage('')
    setCategory('probleme')
    setScreenshot(null)
    setIncludeShot(true)
    setCapturing(true)
    // Laisse le panneau (ignoré via data-feedback-ui) se peindre avant de capturer la page.
    requestAnimationFrame(() => {
      void captureScreenshot().then((shot) => {
        setScreenshot(shot)
        setIncludeShot(shot !== null)
        setCapturing(false)
      })
    })
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Décrivez le souci ou l'idée en quelques mots.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const ctx = capturePageContext(screen)
      await submitFeedback({
        category,
        message: message.trim(),
        ...ctx,
        screenshot: includeShot ? screenshot : null,
      })
      setDone(true)
      window.setTimeout(() => {
        setOpen(false)
        setDone(false)
      }, 1700)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi. Réessayez.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!utilisateur) return null

  return (
    <div {...{ [FEEDBACK_UI_ATTR]: '' }}>
      {!open && (
        <button
          type="button"
          className="feedback-widget__fab"
          onClick={openPanel}
          aria-label="Signaler un souci ou une idée sur cette page"
        >
          <span aria-hidden="true">💬</span> Un souci ?
        </button>
      )}

      {open && (
        <div className="feedback-widget__overlay" onClick={close}>
          <div className="feedback-widget__panel" onClick={(event) => event.stopPropagation()}>
            {done ? (
              <div className="feedback-widget__done">
                <span aria-hidden="true">✓</span> Merci ! Votre retour a bien été envoyé.
              </div>
            ) : (
              <>
                <div className="feedback-widget__title">Un souci ? Une idée ?</div>
                <p className="feedback-widget__subtitle">
                  Votre message va au référent. L'adresse de la page et son contexte sont joints
                  automatiquement — pas besoin de tout réexpliquer.
                </p>

                <div className="feedback-widget__categories">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      className={
                        category === c.key
                          ? 'feedback-widget__chip feedback-widget__chip--actif'
                          : 'feedback-widget__chip'
                      }
                      onClick={() => setCategory(c.key)}
                    >
                      <span aria-hidden="true">{c.icon}</span>
                      {c.label}
                    </button>
                  ))}
                </div>

                <textarea
                  className="feedback-widget__textarea"
                  placeholder={activeCategory.placeholder}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  autoFocus
                />

                {capturing && (
                  <p className="feedback-widget__note">Capture de la page en cours…</p>
                )}
                {!capturing && screenshot && (
                  <label className="feedback-widget__shot-row">
                    <input
                      type="checkbox"
                      checked={includeShot}
                      onChange={(event) => setIncludeShot(event.target.checked)}
                    />
                    <img
                      src={screenshot}
                      className="feedback-widget__thumb"
                      alt="Aperçu de la capture de la page"
                    />
                    <span>Joindre cette capture d'écran</span>
                  </label>
                )}
                {!capturing && !screenshot && (
                  <p className="feedback-widget__note">
                    Capture d'écran indisponible sur cette page — le reste du contexte est joint.
                  </p>
                )}

                <p className="feedback-widget__context">📄 {pageLabelFor(screen)}</p>

                {error && <p className="feedback-widget__error">{error}</p>}

                <div className="feedback-widget__actions">
                  <button
                    type="button"
                    className="feedback-widget__ghost"
                    onClick={close}
                    disabled={submitting}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="feedback-widget__primary"
                    onClick={() => void handleSubmit()}
                    disabled={submitting}
                  >
                    {submitting ? 'Envoi…' : 'Envoyer le retour'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
