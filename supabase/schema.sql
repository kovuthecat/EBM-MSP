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

-- ---------------------------------------------------------------------------
-- ÉDITION RÉFÉRENT DES ENTRÉES DE VEILLE (D64, 2026-08-14) — le contenu SOURCE reste le YAML
-- versionné (`content/veille/**`, CLAUDE.md invariant 3 : « le contenu se publie par pull request »).
-- Cette table ne le remplace pas : elle porte une SURCOUCHE éditoriale, un sous-ensemble de champs
-- que le référent peut corriger sans commit (coquille, reformulation, reclassement de thème/impact
-- constatés après publication) — l'écran fusionne YAML + override à l'affichage
-- (`src/features/veille/lib/overrides.ts` `fusionnerOverride`), l'override l'emportant champ par
-- champ quand il est non NULL. Le YAML source n'est jamais modifié par cette table : un référent qui
-- veut que la correction survive à une réédition du fichier (le prochain lot de rédaction écrasant la
-- ligne d'origine) doit encore la reporter dans le YAML — cette table est un correctif RAPIDE, pas un
-- second système de vérité. `article_id` = `EntreeVeille.id`, AUCUNE clé étrangère possible (même
-- motif que `veille_article_etats` ci-dessus : le contenu ne vit pas en base).
--
-- LECTURE PUBLIQUE (pas seulement `is_member()`) : le flux Veille se consulte sans connexion
-- (`VeilleListScreen.tsx`), et le contenu corrigé doit s'afficher à TOUT visiteur, pas seulement aux
-- comptes provisionnés — ce n'est pas une donnée personnelle, c'est le contenu public de l'entrée.
-- ÉCRITURE RÉSERVÉE AU RÉFÉRENT (`public.is_referent()`), même politique que `ebm_feedback` ci-dessus.
-- ---------------------------------------------------------------------------
create table if not exists public.veille_entree_overrides (
  article_id             text primary key,
  titre                  text,
  resultat_resume        text,
  -- '' (chaîne vide) distingue « appréciation critique vidée par le référent » de NULL (« champ non
  -- édité, le YAML fait foi ») — une brève dont `appreciation_critique` est légitimement NULL au YAML
  -- ne doit jamais se voir imposer une valeur par cette table tant que le référent n'a rien écrit.
  appreciation_critique  text,
  niveau_impact          text check (niveau_impact in ('pratique', 'informatif')),
  niveau_preuve          text check (niveau_preuve in ('eleve', 'modere', 'faible', 'tres_faible')),
  themes                 text[],
  professions_concernees text[],
  updated_by             uuid references public.members (id) on delete set null,
  updated_at             timestamptz not null default now()
);

alter table public.veille_entree_overrides enable row level security;

drop policy if exists veille_entree_overrides_select on public.veille_entree_overrides;
create policy veille_entree_overrides_select on public.veille_entree_overrides
  for select using (true);

drop policy if exists veille_entree_overrides_upsert on public.veille_entree_overrides;
create policy veille_entree_overrides_upsert on public.veille_entree_overrides
  for insert with check (public.is_referent());
drop policy if exists veille_entree_overrides_update on public.veille_entree_overrides;
create policy veille_entree_overrides_update on public.veille_entree_overrides
  for update using (public.is_referent()) with check (public.is_referent());
drop policy if exists veille_entree_overrides_delete on public.veille_entree_overrides;
create policy veille_entree_overrides_delete on public.veille_entree_overrides
  for delete using (public.is_referent());
