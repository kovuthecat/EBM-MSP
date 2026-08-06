import type { Screen } from '../shared/navigation'

/**
 * Capture du contexte de page pour un retour (métadonnées) et de la capture d'écran (html2canvas) —
 * port de `annuaire-msp/src/features/feedback/context.ts` (D51, 2026-08-06, demande utilisateur
 * « ajoute la même fonction de retour utilisateur »). Adapté à la navigation state-based de cette app
 * (`Screen`, pas un `pathname` react-router) : `pageLabelFor` lit `Navigation.screen` au lieu d'une
 * URL. html2canvas chargé en import dynamique, même raison que l'annuaire — la lib (~50 Ko gzip)
 * reste hors du bundle initial, téléchargée seulement au premier clic sur le bouton flottant.
 *
 * Le widget marque sa racine DOM avec `FEEDBACK_UI_ATTR` ; `ignoreElements` s'en sert pour exclure le
 * bouton et le panneau de la capture (on veut la page, pas l'UI de signalement).
 */

export const FEEDBACK_UI_ATTR = 'data-feedback-ui'

export interface PageContext {
  url: string
  page_label: string
  viewport: string
  user_agent: string
}

/** Nom lisible de l'écran (pour trier/lire les retours côté référent). */
export function pageLabelFor(screen: Screen): string {
  const labels: Record<Screen, string> = {
    home: 'Accueil',
    decisionDomains: 'Aide à la décision — choix du domaine',
    decisionDomainNodes: 'Aide à la décision — liste des algorithmes',
    decisionModule: 'Aide à la décision — module',
    decisionNode: 'Aide à la décision — nœud',
    veilleList: 'Veille clinique',
    veilleDetail: 'Veille — détail',
    profile: 'Profil',
    memory: 'Pour mémoire',
    auth: 'Connexion',
    methode: 'Méthode',
  }
  return labels[screen] ?? screen
}

export function capturePageContext(screen: Screen): PageContext {
  return {
    url: window.location.href,
    page_label: pageLabelFor(screen),
    viewport: `${window.innerWidth}×${window.innerHeight}`,
    user_agent: navigator.userAgent,
  }
}

/** Réduit un canvas à `maxWidth` puis l'exporte en JPEG compressé (data URL). */
function toCompressedDataUrl(canvas: HTMLCanvasElement, maxWidth: number, quality: number): string {
  const ratio = canvas.width > maxWidth ? maxWidth / canvas.width : 1
  if (ratio === 1) return canvas.toDataURL('image/jpeg', quality)
  const out = document.createElement('canvas')
  out.width = Math.round(canvas.width * ratio)
  out.height = Math.round(canvas.height * ratio)
  const ctx = out.getContext('2d')
  if (!ctx) return canvas.toDataURL('image/jpeg', quality)
  ctx.drawImage(canvas, 0, 0, out.width, out.height)
  return out.toDataURL('image/jpeg', quality)
}

/**
 * Capture la zone visible de la page en data URL JPEG (best-effort). Retourne `null` en cas d'échec —
 * la capture reste un indice joint au retour, jamais une preuve.
 */
export async function captureScreenshot(): Promise<string | null> {
  try {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(document.body, {
      useCORS: true,
      logging: false,
      scale: 1,
      backgroundColor: '#f8fafc',
      ignoreElements: (el) => el.hasAttribute(FEEDBACK_UI_ATTR),
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
    })
    return toCompressedDataUrl(canvas, 1400, 0.7)
  } catch {
    return null
  }
}
