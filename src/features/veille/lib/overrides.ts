import { supabase } from '../../../lib/supabase'
import type { EntreeVeille, NiveauImpact, NiveauPreuveVeille } from '../content/entree.types'

/**
 * Surcouche éditoriale référent des entrées de veille (D64, 2026-08-14) — table
 * `public.veille_entree_overrides` (`supabase/schema.sql`), une ligne par entrée éditée.
 *
 * Le contenu SOURCE reste le YAML versionné (`content/veille/**`, CLAUDE.md invariant 3) : cette
 * table ne le remplace pas, elle porte un correctif RAPIDE (coquille, reclassement, reformulation
 * constatés après publication) que le référent pose sans commit. `fusionnerOverride` l'applique
 * champ par champ à l'affichage — un champ NULL dans l'override signifie « non édité, le YAML fait
 * foi », jamais « vidé » (cf. commentaire de la table). Le YAML n'est jamais réécrit par ce module :
 * une correction qui doit survivre à une réédition future du fichier doit encore y être reportée à la
 * main — c'est un correctif d'écran, pas un second système de vérité.
 */
export interface VeilleOverride {
  titre: string | null
  resultat_resume: string | null
  appreciation_critique: string | null
  niveau_impact: NiveauImpact | null
  niveau_preuve: NiveauPreuveVeille | null
  themes: string[] | null
  professions_concernees: string[] | null
}

/** Sous-ensemble de `VeilleOverride` réellement modifiable par le formulaire (D64) — mêmes clés. */
export type ChampsEditables = VeilleOverride

const COLUMNS =
  'article_id,titre,resultat_resume,appreciation_critique,niveau_impact,niveau_preuve,themes,professions_concernees'

/** Tous les overrides existants, sous forme de dictionnaire `article_id -> override`. Lecture publique. */
export async function loadOverrides(): Promise<Record<string, VeilleOverride>> {
  const { data, error } = await supabase.from('veille_entree_overrides').select(COLUMNS)
  if (error) throw new Error(error.message)
  const overrides: Record<string, VeilleOverride> = {}
  for (const ligne of (data ?? []) as (VeilleOverride & { article_id: string })[]) {
    const { article_id, ...champs } = ligne
    overrides[article_id] = champs
  }
  return overrides
}

/** Pose ou remplace l'override d'une entrée (référent uniquement — RLS). */
export async function saveOverride(articleId: string, champs: ChampsEditables): Promise<void> {
  const { data: session } = await supabase.auth.getSession()
  const userId = session.session?.user.id
  if (!userId) throw new Error('Connexion requise.')
  const { error } = await supabase.from('veille_entree_overrides').upsert({
    article_id: articleId,
    ...champs,
    updated_by: userId,
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
}

/** Retire l'override d'une entrée — retour à la version YAML d'origine (référent uniquement — RLS). */
export async function deleteOverride(articleId: string): Promise<void> {
  const { error } = await supabase.from('veille_entree_overrides').delete().eq('article_id', articleId)
  if (error) throw new Error(error.message)
}

/**
 * Fusionne une entrée YAML avec son override éventuel : chaque champ de l'override remplace celui du
 * YAML **uniquement s'il est non NULL** — un override absent ou incomplet laisse le YAML faire foi,
 * champ par champ. `entree.id` sert de clé de recherche dans `overrides`, jamais l'inverse : cette
 * fonction ne peut pas faire apparaître une entrée qui n'existe pas dans le corpus YAML.
 */
export function fusionnerOverride(entree: EntreeVeille, override: VeilleOverride | undefined): EntreeVeille {
  if (!override) return entree
  return {
    ...entree,
    titre: override.titre ?? entree.titre,
    resultat_resume: override.resultat_resume ?? entree.resultat_resume,
    appreciation_critique: override.appreciation_critique ?? entree.appreciation_critique,
    niveau_impact: override.niveau_impact ?? entree.niveau_impact,
    niveau_preuve: override.niveau_preuve ?? entree.niveau_preuve,
    themes: override.themes ?? entree.themes,
    professions_concernees: override.professions_concernees ?? entree.professions_concernees,
  }
}
