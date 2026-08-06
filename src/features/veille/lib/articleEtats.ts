import { supabase } from '../../../lib/supabase'

/**
 * État personnel « gardé »/« masqué » d'une entrée de veille (D51, 2026-08-06) — table
 * `public.veille_article_etats` (`supabase/schema.sql`), une ligne par (utilisateur, article).
 * PERSONNEL, pas partagé (à la différence des données de `annuaire-msp`) : chacun garde/masque
 * pour soi, RLS sur `user_id = auth.uid()`.
 *
 * `article_id` = `EntreeVeille.id` (contenu YAML statique) : aucune clé étrangère possible, le
 * contenu ne vit pas en base — cf. le commentaire du schéma SQL.
 */
export type EtatArticle = 'garde' | 'masque'

/** Tous les états de l'utilisateur connecté, sous forme de dictionnaire `article_id -> état`. */
export async function chargerEtats(): Promise<Record<string, EtatArticle>> {
  const { data, error } = await supabase.from('veille_article_etats').select('article_id, etat')
  if (error) throw new Error(error.message)
  const etats: Record<string, EtatArticle> = {}
  for (const ligne of data ?? []) etats[ligne.article_id as string] = ligne.etat as EtatArticle
  return etats
}

/** Pose ou remplace l'état d'un article pour l'utilisateur connecté. */
export async function definirEtat(articleId: string, etat: EtatArticle): Promise<void> {
  const { data: session } = await supabase.auth.getSession()
  const userId = session.session?.user.id
  if (!userId) throw new Error('Connexion requise.')
  const { error } = await supabase
    .from('veille_article_etats')
    .upsert({ user_id: userId, article_id: articleId, etat, updated_at: new Date().toISOString() })
  if (error) throw new Error(error.message)
}

/** Retire l'état d'un article (retour à « ni gardé ni masqué »). */
export async function retirerEtat(articleId: string): Promise<void> {
  const { error } = await supabase.from('veille_article_etats').delete().eq('article_id', articleId)
  if (error) throw new Error(error.message)
}
