import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Navigation } from '../shared/navigation'
import { useEstReferent } from '../shared/lib/auth'
import {
  deleteRetour,
  loadRetourCapture,
  loadRetours,
  loadRetoursPourExport,
  updateRetourStatus,
} from './data'
import type { FeedbackCategory, FeedbackListItem, FeedbackStatus } from './data'
import './RetoursScreen.css'

/**
 * Écran référent `/retours` (D51, 2026-08-06, demande utilisateur « ajoute l'écran de retour du
 * référent côté ebm-msp ») — port de `annuaire-msp/src/features/feedback/RetoursPage.tsx`, sur la
 * table `ebm_feedback` : relit les retours des membres, change leur statut, ouvre la capture d'écran
 * à la demande, exporte tout en JSON, supprime les retours traités.
 *
 * Garde d'accès : `useEstReferent()` (double barrière avec la RLS `ebm_feedback_select`, qui de
 * toute façon ne renverrait rien à un non-référent). `undefined` = résolution en cours (évite un
 * flash) ; `false` renvoie à l'accueil.
 */

const CATEGORY_META: Record<FeedbackCategory, { icon: string; label: string }> = {
  probleme: { icon: '🐞', label: 'Problème' },
  donnee: { icon: '✏️', label: 'Donnée erronée' },
  suggestion: { icon: '💡', label: 'Suggestion' },
}

const STATUS_META: Record<FeedbackStatus, { label: string }> = {
  nouveau: { label: 'Nouveau' },
  en_cours: { label: 'En cours' },
  resolu: { label: 'Résolu' },
}

const STATUS_ORDER: readonly FeedbackStatus[] = ['nouveau', 'en_cours', 'resolu']

type StatusFilter = FeedbackStatus | 'tous'

function authorLabel(a: FeedbackListItem['author']): string {
  if (!a) return 'Compte supprimé'
  const full = [a.prenom, a.nom].filter(Boolean).join(' ').trim()
  return full || a.email || 'Membre'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface RetoursScreenProps {
  go: Navigation['go']
}

export function RetoursScreen({ go }: RetoursScreenProps) {
  const estReferent = useEstReferent()
  const [items, setItems] = useState<FeedbackListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('tous')
  const [lightbox, setLightbox] = useState<string | 'loading' | null>(null)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await loadRetours())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec du chargement des retours.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (estReferent) void refresh()
  }, [estReferent, refresh])

  useEffect(() => {
    if (estReferent === false) go('home')
  }, [estReferent, go])

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = { tous: items.length, nouveau: 0, en_cours: 0, resolu: 0 }
    for (const it of items) c[it.status] += 1
    return c
  }, [items])

  const visible = useMemo(
    () => (filter === 'tous' ? items : items.filter((it) => it.status === filter)),
    [items, filter],
  )

  const handleStatus = async (id: string, status: FeedbackStatus) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)))
    try {
      await updateRetourStatus(id, status)
    } catch {
      void refresh() // resync en cas d'échec
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer définitivement ce retour ?')) return
    setItems((prev) => prev.filter((it) => it.id !== id))
    try {
      await deleteRetour(id)
    } catch {
      void refresh()
    }
  }

  const handleExport = async () => {
    setExporting(true)
    setExportError(null)
    try {
      const rows = await loadRetoursPourExport()
      const payload = {
        export: 'ebm-msp-retours',
        generated_at: new Date().toISOString(),
        count: rows.length,
        items: rows.map((r) => ({
          id: r.id,
          created_at: r.created_at,
          category: r.category,
          status: r.status,
          message: r.message,
          author: r.author,
          author_id: r.author_id,
          page_label: r.page_label,
          url: r.url,
          viewport: r.viewport,
          user_agent: r.user_agent,
          has_screenshot: r.has_screenshot,
          screenshot: r.screenshot,
        })),
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `retours-ebm-msp-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (e) {
      setExportError(e instanceof Error ? e.message : "Échec de l'export.")
    } finally {
      setExporting(false)
    }
  }

  const handleViewShot = async (id: string) => {
    setLightbox('loading')
    try {
      const url = await loadRetourCapture(id)
      setLightbox(url ?? null)
      if (!url) window.alert('Aucune capture disponible pour ce retour.')
    } catch {
      setLightbox(null)
      window.alert('Échec du chargement de la capture.')
    }
  }

  if (estReferent === undefined) return <p className="retours__etat">Chargement…</p>
  if (estReferent === false) return null // redirection en cours (effet ci-dessus)

  return (
    <div className="retours">
      <div className="retours__header-row">
        <div>
          <h1 className="retours__title">Retours des membres</h1>
          <p className="retours__subtitle">
            Les signalements envoyés depuis le bouton « Un souci ? ». Vous seul (référent) y avez accès.
          </p>
        </div>
        <button
          type="button"
          className="retours__export-btn"
          onClick={() => void handleExport()}
          disabled={exporting || counts.tous === 0}
          title="Télécharger tous les retours (infos techniques + message + capture) dans un fichier JSON"
        >
          {exporting ? 'Export…' : '⬇ Exporter tout (.json)'}
        </button>
      </div>

      {exportError && <p className="retours__export-error">{exportError}</p>}

      <div className="retours__filtres">
        {(['tous', ...STATUS_ORDER] as StatusFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            className={
              filter === f ? 'retours__filtre-chip retours__filtre-chip--actif' : 'retours__filtre-chip'
            }
            onClick={() => setFilter(f)}
          >
            {f === 'tous' ? 'Tous' : STATUS_META[f].label} ({counts[f]})
          </button>
        ))}
      </div>

      {error && <p className="retours__erreur">{error}</p>}
      {loading && !items.length ? (
        <p className="retours__etat">Chargement des retours…</p>
      ) : visible.length === 0 ? (
        <p className="retours__etat">
          {items.length === 0 ? 'Aucun retour pour le moment.' : 'Aucun retour dans ce filtre.'}
        </p>
      ) : (
        <ul className="retours__liste">
          {visible.map((it) => (
            <RetourCarte
              key={it.id}
              item={it}
              onStatusChange={handleStatus}
              onDelete={handleDelete}
              onViewShot={handleViewShot}
            />
          ))}
        </ul>
      )}

      {lightbox !== null && (
        <div className="retours__lightbox" onClick={() => setLightbox(null)}>
          {lightbox === 'loading' ? (
            <p className="retours__lightbox-chargement">Chargement de la capture…</p>
          ) : (
            <img src={lightbox} className="retours__lightbox-img" alt="Capture d'écran du retour" />
          )}
        </div>
      )}
    </div>
  )
}

function RetourCarte({
  item,
  onStatusChange,
  onDelete,
  onViewShot,
}: {
  item: FeedbackListItem
  onStatusChange: (id: string, status: FeedbackStatus) => void
  onDelete: (id: string) => void
  onViewShot: (id: string) => void
}) {
  const cat = CATEGORY_META[item.category]
  const status = STATUS_META[item.status]
  return (
    <li className="retours-carte">
      <div className="retours-carte__header">
        <span className={`retours-carte__badge retours-carte__badge--${item.category}`}>
          <span aria-hidden="true">{cat.icon}</span> {cat.label}
        </span>
        <span className={`retours-carte__badge retours-carte__badge--statut-${item.status}`}>
          {status.label}
        </span>
        <span className="retours-carte__meta-auteur">
          {authorLabel(item.author)} · {formatDate(item.created_at)}
        </span>
      </div>

      <p className="retours-carte__message">{item.message}</p>

      <p className="retours-carte__contexte">
        📄 {item.page_label ?? '—'}
        {item.url ? ` · ${item.url}` : ''}
      </p>
      {item.viewport && <p className="retours-carte__contexte">🖥️ {item.viewport}</p>}

      <div className="retours-carte__footer">
        <label className="retours-carte__statut-select">
          Statut{' '}
          <select
            value={item.status}
            onChange={(e) => onStatusChange(item.id, e.target.value as FeedbackStatus)}
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        </label>

        {item.has_screenshot && (
          <button type="button" className="retours-carte__lien" onClick={() => onViewShot(item.id)}>
            Voir la capture
          </button>
        )}
        <button
          type="button"
          className="retours-carte__lien retours-carte__lien--danger"
          onClick={() => onDelete(item.id)}
        >
          Supprimer
        </button>
      </div>
    </li>
  )
}
