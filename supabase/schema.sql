-- ============================================================================
-- ebm-msp — module Veille, schéma Supabase (D51, 2026-08-06)
-- MÊME PROJET SUPABASE que `annuaire-msp` (mêmes comptes MSP, `auth.users`/`public.members`/
-- `public.is_member()` déjà créés par `annuaire-msp/supabase/schema.sql` — À EXÉCUTER APRÈS LUI,
-- une seule fois, sur la même instance).
-- À exécuter dans Supabase → SQL Editor → Run. Ré-exécutable sans casse.
--
-- TABLE EN `public`, PAS DANS UN SCHÉMA DÉDIÉ : un schéma séparé (`veille.*`) est plus lisible mais
-- exige d'ajouter ce schéma aux « Exposed schemas » de l'API (Dashboard → Settings → API), une étape
-- manuelle facile à oublier et qui casserait silencieusement le client JS (404 sur toute requête) tant
-- qu'elle n'est pas faite. Préfixe `veille_` à la place, même compromis que si on avait un schéma —
-- juste sans le piège de configuration.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ÉTAT « gardé »/« masqué » d'une entrée de veille, PAR PRATICIEN.
-- Contrairement à `annuaire-msp` (données PARTAGÉES entre membres), ceci est un marqueur PERSONNEL :
-- chacun voit et modifie uniquement ses propres lignes (RLS sur `user_id = auth.uid()`, pas
-- `public.is_member()` — inutile ici, `auth.uid()` n'existe que pour un compte déjà provisionné).
-- `article_id` = `EntreeVeille.id` (contenu YAML statique, `content/veille/**`) : AUCUNE clé
-- étrangère possible (le contenu ne vit pas en base) — un id qui disparaît du contenu (article
-- retiré) laisse une ligne orpheline, sans conséquence (elle ne s'affiche simplement plus, filtrée
-- côté client par `entrees` qui ne la contient plus).
-- ---------------------------------------------------------------------------
create table if not exists public.veille_article_etats (
  user_id    uuid not null references auth.users (id) on delete cascade,
  article_id text not null,
  etat       text not null check (etat in ('garde', 'masque')),
  updated_at timestamptz not null default now(),
  primary key (user_id, article_id)
);

create index if not exists veille_article_etats_user_idx on public.veille_article_etats (user_id);

alter table public.veille_article_etats enable row level security;

drop policy if exists veille_article_etats_select on public.veille_article_etats;
create policy veille_article_etats_select on public.veille_article_etats
  for select using (user_id = auth.uid());

drop policy if exists veille_article_etats_insert on public.veille_article_etats;
create policy veille_article_etats_insert on public.veille_article_etats
  for insert with check (user_id = auth.uid());

drop policy if exists veille_article_etats_update on public.veille_article_etats;
create policy veille_article_etats_update on public.veille_article_etats
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists veille_article_etats_delete on public.veille_article_etats;
create policy veille_article_etats_delete on public.veille_article_etats
  for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- RETOURS UTILISATEUR (bouton flottant « Un souci ? ») — même fonction que `annuaire-msp`
-- (`public.feedback`), TABLE SÉPARÉE (`ebm_feedback`) plutôt que la même table : les deux apps
-- partagent le projet Supabase mais pas le sujet des retours (un référent qui traite les retours
-- de l'annuaire n'a aucune raison de voir ceux d'ebm-msp mélangés, et inversement), et `feedback`
-- porte déjà un `contact_id` propre à l'annuaire qui n'a pas de sens ici.
-- Réutilise `public.is_referent()` et `public.is_member()`, déjà créés par `annuaire-msp` (même
-- projet) — non redéfinis ici.
-- ---------------------------------------------------------------------------
create table if not exists public.ebm_feedback (
  id             uuid primary key default gen_random_uuid(),
  -- on delete set null : si le compte part, le retour reste lisible.
  author_id      uuid references public.members (id) on delete set null default auth.uid(),
  category       text not null default 'probleme'
                   check (category in ('probleme', 'donnee', 'suggestion')),
  message        text not null,
  status         text not null default 'nouveau'
                   check (status in ('nouveau', 'en_cours', 'resolu')),

  -- Contexte capturé automatiquement à l'envoi (aide à reproduire / corriger).
  url            text,        -- URL complète
  page_label     text,        -- nom lisible de l'écran (« Aide à la décision », « Veille clinique »…)
  viewport       text,        -- « 1440×900 »
  user_agent     text,
  -- Capture d'écran (data URL JPEG redimensionnée+compressée côté client), optionnelle et
  -- volumineuse : jamais sélectionnée dans la liste des retours, chargée à la demande au détail.
  screenshot     text,
  has_screenshot boolean not null default false,

  created_at     timestamptz not null default now()
);

create index if not exists ebm_feedback_status_idx on public.ebm_feedback (status, created_at desc);

alter table public.ebm_feedback enable row level security;

-- Tout membre dépose un retour signé ; seul le référent lit, traite (statut) et supprime — même
-- politique que `public.feedback` de l'annuaire.
drop policy if exists ebm_feedback_insert on public.ebm_feedback;
create policy ebm_feedback_insert on public.ebm_feedback
  for insert with check (public.is_member() and author_id = auth.uid());
drop policy if exists ebm_feedback_select on public.ebm_feedback;
create policy ebm_feedback_select on public.ebm_feedback
  for select using (public.is_referent());
drop policy if exists ebm_feedback_update on public.ebm_feedback;
create policy ebm_feedback_update on public.ebm_feedback
  for update using (public.is_referent()) with check (public.is_referent());
drop policy if exists ebm_feedback_delete on public.ebm_feedback;
create policy ebm_feedback_delete on public.ebm_feedback
  for delete using (public.is_referent());
