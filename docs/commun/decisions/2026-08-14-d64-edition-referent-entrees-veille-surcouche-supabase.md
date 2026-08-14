# 2026-08-14 — D64 · Le référent édite une entrée de veille via une surcouche Supabase, jamais le YAML

### Décision

**Le référent peut corriger titre, résumé, appréciation critique, niveau d'impact, niveau de preuve,
thèmes et professions concernées d'une entrée de veille depuis l'écran, sans passer par un commit.**
La correction s'écrit dans une nouvelle table `public.veille_entree_overrides`
(`supabase/schema.sql`), une ligne par entrée éditée, et se **fusionne** au contenu YAML à
l'affichage (`src/features/veille/lib/overrides.ts` `fusionnerOverride`) : chaque champ de
l'override remplace celui du YAML **seulement s'il est non NULL**, un override absent ou partiel
laissant le YAML faire foi.

**Le contenu SOURCE reste le YAML versionné (D3 inchangée).** Cette table n'est pas un second
système de vérité : c'est un correctif rapide (coquille, reclassement de thème/impact constaté après
publication) que le référent pose sans rouvrir une PR. Une correction qui doit survivre à une
**réédition future** du fichier (le prochain lot de rédaction écrasant la ligne d'origine) doit
encore être reportée à la main dans le YAML — l'override ne le fait pas pour lui.

**Lecture publique, écriture référent.** RLS `select using (true)` : le correctif doit s'afficher à
tout visiteur du flux, connecté ou non (le flux se consulte sans compte). RLS
`insert`/`update`/`delete using (public.is_referent())` : même fonction que `ebm_feedback` (D51),
non redéfinie. Le rôle référent existait déjà (`useEstReferent()`, `public.members.role`) — cette
décision n'en crée pas un nouveau, elle lui donne un second usage.

**Un format « brève » ne peut pas recevoir d'appréciation critique via ce canal.** SOP §5bis
interdit à une brève de porter une appréciation critique propre ; le formulaire d'édition masque ce
champ quand `entree.route === 'breve'`, pas seulement l'affichage.

### Contexte

Demande directe de Thibault (2026-08-14) : « le référent doit pouvoir éditer les posts du module
veille : le titre, le résumé, l'analyse, le badge, les tags… ». Trois options de persistance ont été
posées avant d'écrire une ligne de code (surcouche Supabase / commit GitHub automatisé via API /
formulaire générant un YAML à copier-coller) — la première a été retenue en connaissance de cause :
elle est la seule des trois qui rouvre, même partiellement, l'invariant « le contenu se publie par
pull request » (D3). Les deux autres le respectaient intégralement mais l'une exige un token GitHub
en écriture (surface de risque nouvelle), l'autre n'offre aucune édition « en direct » sur le site
déployé.

### Conséquences

- **Deux systèmes de vérité coexistent désormais pour le contenu Veille édité** : le YAML (source,
  versionné, relu par PR) et la table `veille_entree_overrides` (correctif d'écran, jamais relu par
  personne d'autre que le référent qui l'a posé). Aucun mécanisme de réconciliation n'existe : un
  override ancien peut diverger silencieusement d'un YAML mis à jour depuis sur d'autres champs.
  Piste de dette à surveiller si le nombre d'overrides grossit (cf. `TASKS.md`).
- **`themesPresents`/`professionsPresentes`** (`content/loadEntrees.ts`, dérivés du YAML seul) ne
  sont plus utilisés par `VeilleListScreen.tsx` pour peupler les filtres — recalculés localement
  depuis les entrées **fusionnées**, pour qu'un thème ajouté par une édition apparaisse dans le
  filtre. Les exports `loadEntrees.ts` eux-mêmes sont inchangés (toujours le YAML brut) : tout autre
  consommateur futur de ces exports devra faire le même choix.
- **`supabase/schema.sql` complété, non exécuté par moi** (aucun accès direct à la base, même
  contrainte que D51) — reste une étape manuelle pour Thibault : exécuter le bloc
  `veille_entree_overrides` dans Supabase Studio → SQL Editor avant que l'édition ne fonctionne en
  production. Tant que la table n'existe pas, le crayon d'édition reste visible pour le référent
  (le rôle se lit indépendamment) mais l'enregistrement échoue avec l'erreur Supabase brute.
- **Repoussé, hors mandat de cette décision** : aucune trace d'audit des éditions (qui a changé quoi,
  quand) au-delà de `updated_by`/`updated_at` — pas d'historique des versions successives d'un
  override, pas de diff visible entre YAML et override pour le référent qui édite.
