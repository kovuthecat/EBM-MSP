# 2026-08-06 — D51 · Les comptes du module Veille réutilisent l'instance Supabase et les comptes de `annuaire-msp`

### Décision

**Un seul projet Supabase, un seul jeu de comptes, pour les deux applications de la MSP.**
`ebm-msp` (module Veille — garder/masquer une entrée, retour signé) se connecte au **même projet
Supabase** que `annuaire-msp`, réutilise tel quel son `auth.users`/`public.members`/
`public.is_member()`/`public.is_referent()` (aucune redéfinition), et reprend le **même écran de
connexion** (menu déroulant par prénom → email, `memberLogins.ts`, mêmes personnes des deux côtés).

**Pas de session partagée entre les deux apps** (deux origines web = deux `localStorage` Supabase) :
une connexion par appareil et par app, tranché explicitement par Thibault comme acceptable (session
persistante ensuite, comme l'annuaire).

**Tables `ebm-msp` en `public`, préfixées `veille_`/`ebm_`, jamais dans un schéma dédié** :
`public.veille_article_etats` (état personnel gardé/masqué, RLS `user_id = auth.uid()`) et
`public.ebm_feedback` (retours, RLS `public.is_referent()`/`public.is_member()`, table séparée du
`public.feedback` de l'annuaire — sujets différents, pas de raison de les mélanger).

### Contexte

Thibault a proposé de recenser les outils d'aide à la décision tiers existants (Antibioclic,
Gestaclic…) et d'exposer un auto-login par identifiants partagés — discussion qui a fait émerger la
question, non cadrée jusque-là, des comptes utilisateurs du module Veille (D37 les avait reportés :
« v1 sans compte »). Les deux apps de la MSP ont **strictement les mêmes utilisateurs** (les
professionnels de santé de la MSP) : dupliquer l'auth (deuxième table `members`, deuxième mécanisme
de connexion) aurait recréé un système déjà résolu dans `annuaire-msp`, avec le risque de divergence
que ça implique (deux listes de comptes à tenir à jour).

### Conséquences

- **D37 amendée** : « v1 sans compte » ne tient plus — le compte existe, mais reste **local à
  l'utilisation** (garder/masquer une entrée, déposer un retour), jamais transmis à une décision
  clinique. Le module Décision reste 100 % statique, zéro réseau au runtime (CLAUDE.md invariant 1) :
  aucun fichier de `features/decision/` n'importe `lib/supabase.ts` — vérifié par grep, pas encore par
  un test dédié (piste de dette, cf. TASKS.md).
- **`@supabase/supabase-js` et `html2canvas` entrent aux dépendances runtime** — première exception à
  l'invariant CLAUDE.md 8 (« pile figée ») depuis le début du projet, explicitement couverte par D1
  (« Supabase (UE) réservé au module Veille ») et cette décision.
- **Provisionnement inchangé** : inviter dans Supabase → Auth → Users (une fois, valable pour les deux
  apps) ; `memberLogins.ts` (prénom → email) est une **copie**, pas une source unique — ajouter/retirer
  un membre exige d'éditer les deux dépôts.
- **`supabase/schema.sql` de ce dépôt s'exécute APRÈS celui de `annuaire-msp`**, sur la même instance
  (dépend de `public.is_member()`/`public.is_referent()`, qu'il ne redéfinit pas). Non exécuté par moi
  (aucun accès direct à la base) — reste une étape manuelle pour Thibault.
- **Repoussé, hors mandat de cette décision** : l'écran référent de traitement des retours (`/retours`
  côté annuaire, liste + statuts + export) n'a pas été porté — seul le bouton de dépôt l'a été. Un
  référent qui veut lire les retours d'ebm-msp doit pour l'instant interroger `public.ebm_feedback`
  directement (Supabase Studio).
