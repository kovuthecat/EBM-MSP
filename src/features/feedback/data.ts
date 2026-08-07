import { supabase } from '../../lib/supabase'
import type { PageContext } from './context'

export type FeedbackCategory = 'probleme' | 'donnee' | 'suggestion'
export type FeedbackStatus = 'nouveau' | 'en_cours' | 'resolu'

export interface FeedbackInput extends PageContext {
  category: FeedbackCategory
  message: string
  screenshot: string | null
}

/** Dépose un retour signé (`author_id` = utilisateur connecté, imposé par la RLS d'insertion). */
export async function submitFeedback(input: FeedbackInput): Promise<void> {
  const { data: session } = await supabase.auth.getSession()
  const userId = session.session?.user.id
  if (!userId) throw new Error('Connexion requise pour envoyer un retour.')
  const { error } = await supabase
    .from('ebm_feedback')
    .insert({ ...input, author_id: userId, has_screenshot: input.screenshot !== null })
  if (error) throw new Error(error.message)
}

/**
 * Écran référent `/retours` (D51) — port de `annuaire-msp/src/data/feedback.ts` §référent, sur la
 * table `ebm_feedback` (pas de `contact_id` ici : cette app n'a pas de fiche à relier au retour).
 * RLS `ebm_feedback_select`/`_update`/`_delete` réservent lecture/traitement au référent.
 */
export interface FeedbackListItem {
  id: string
  author_id: string | null
  category: FeedbackCategory
  message: string
  status: FeedbackStatus
  url: string | null
  page_label: string | null
  viewport: string | null
  user_agent: string | null
  has_screenshot: boolean
  created_at: string
  author: { prenom: string | null; nom: string | null; email: string | null } | null
}

const LIST_COLUMNS =
  'id,author_id,category,message,status,url,page_label,viewport,user_agent,' +
  'has_screenshot,created_at,author:members(prenom,nom,email)'

/** Liste des retours, plus récents d'abord (référent uniquement — RLS). Sans les captures. */
export async function loadRetours(): Promise<FeedbackListItem[]> {
  const { data, error } = await supabase
    .from('ebm_feedback')
    .select(LIST_COLUMNS)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as FeedbackListItem[]
}

export interface FeedbackExportItem extends FeedbackListItem {
  screenshot: string | null
}

/** Tous les retours AVEC leur capture, pour l'export téléchargeable (référent — RLS). */
export async function loadRetoursPourExport(): Promise<FeedbackExportItem[]> {
  const { data, error } = await supabase
    .from('ebm_feedback')
    .select(`${LIST_COLUMNS},screenshot`)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as FeedbackExportItem[]
}

/** Capture d'écran d'un retour, chargée à la demande (colonne volumineuse). */
export async function loadRetourCapture(id: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('ebm_feedback')
    .select('screenshot')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data?.screenshot as string | null | undefined) ?? null
}

export async function updateRetourStatus(id: string, status: FeedbackStatus): Promise<void> {
  const { error } = await supabase.from('ebm_feedback').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteRetour(id: string): Promise<void> {
  const { error } = await supabase.from('ebm_feedback').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
