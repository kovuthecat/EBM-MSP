import { supabase } from '../../lib/supabase'
import type { PageContext } from './context'

export type FeedbackCategory = 'probleme' | 'donnee' | 'suggestion'

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
