# CLAUDE.md — ebm-msp

Instructions permanentes pour Claude Code. Seul fichier chargé automatiquement : il pointe vers le
reste, sans le recopier.

## Commandes

> App non encore scaffoldée (câblage à venir, après la maquette). Commandes cibles (standard Vite,
> comme ETP interactif) — deviendront réelles au scaffold (T-001) :

```bash
# Dev / serveur local
npm run dev

# Build (inclut le typecheck via tsc -b)
npm run build

# Preview du build
npm run preview

# Tests (toute la suite, Vitest)
npm test

# Test unitaire ciblé
npx vitest run src/features/decision/engine/<fichier>.test.ts

# Typecheck seul — JAMAIS `npx tsc --noEmit` : le tsconfig racine est en `files: []` + références
# de projet, donc cette commande compile 0 fichier et rend un vert vide (constaté P11, 2026-08-02).
npm run typecheck
```

- Variables d'environnement : Supabase (module Veille uniquement) → `.env` (non commité), `.env.example`.
  Module Décision : aucune (100 % statique).
- Ne jamais committer de secret (`.env`, clés, tokens).

<!-- Règles communes injectées à chaque session par le plugin `workflow` (hook SessionStart) — ne pas les recopier ici. -->

## Règles spécifiques au projet

### À lire avant une tâche importante

- `PROJECT_BRIEF.md` (objectif, périmètre) · `ARCHITECTURE.md` (écrans, découpage) ·
  `DECISIONS.md` (arbitrages transverses) · `PROJECT_MAP.md` (localisation).
- Autorité du contenu clinique : `docs/decision/` (nœuds DT2) · méthodo veille : `docs/veille/`
  (SOP, grille, briefs sources).
- **4 skills encodent les circuits répétitifs** (`.claude/skills/`) : `verif-source-veille`,
  `recherche-preuve-triangulee`, `tri-boite-mail`, `recherche-source-primaire`. Les invoquer plutôt
  que de redériver la procédure depuis les docs ci-dessus — chaque skill pointe vers sa doc source.
  **OpenEvidence se pose désormais en ligne de commande** (application Interface-OE) : coût,
  codes de sortie et garde-fous dans `docs/commun/OUTIL-INTERFACE-OE.md`.
- **Avant d'écrire ou de modifier un nœud** : `docs/decision/GRAMMAIRE-NOEUD.md` — les règles
  R1→R9, tous domaines (état ≠ intention, délai de bénéfice, deux décisions pour modifier un
  traitement, écarté ≠ non-indiqué, un critère doit agir, argumentaire situationnel, jamais se
  prononcer sur ce qu'on ignore, un canal par fait de sécurité, savoir si le geste est déjà fait).
- **Avant de démarrer un nouveau module ou domaine** : `docs/decision/CONSTRUIRE-UN-MODULE.md` —
  le procédé P0→P7 avec ses portes de sortie et ses checklists opposables. La collecte de preuve
  n'est que la 5ᵉ étape ; l'ouvrir en premier évite de refaire les vagues de correction du DT2.

### Invariants non négociables

1. **Zéro donnée patient**, partout. Module Décision : **aucun disque, aucun réseau** au runtime.
   **Amendement du 2026-07-27 (`DECISIONS.md` D28)** : une **mémoire de session** est autorisée pour
   pré-remplir, d'un nœud à l'autre, les critères que le contenu déclare `partage` — une simple `Map`
   de module, vidée à chaque rechargement de page. Ça reste « aucune persistance » au sens de
   l'invariant (rien ne survit à la session) ; ce n'est pas une exception à documenter au cas par cas.
   Module Veille : données personnelles minimisées (e-mail, profil, ids « pour mémoire ») sur Supabase
   UE — cf. `DECISIONS.md` D4.
2. **Moteur déterministe** : filtrage par règles booléennes transparentes, **aucun score caché, jamais
   de ML** (`DECISIONS.md` D3).
3. **Contenu = données versionnées** : YAML (`/content`) + JSON Schema (`/schema`), séparé de la
   logique et de la présentation. Un nœud/une veille se publie par pull request.
4. **Intégration veille → algorithme = validation humaine obligatoire** ; jamais de mise à jour
   automatique. Toute modif de nœud : bump version + changelog (`DECISIONS.md` D5).
5. **Multi-module ET multi-domaine par conception** : le socle générique (`src/features/shared`) et le
   moteur de décision ne connaissent **aucun domaine ni nœud** par son nom ; tout est piloté par le
   contenu (`domaine` porté par chaque nœud). Le spécifique vit sous `src/features/<module>/` et
   `/content/`. **DT2 = premier domaine de décision**, d'autres suivront sans toucher au moteur
   (`DECISIONS.md` D8).
6. **Exactitude médicale** : contenu sourcé (niveau de preuve GRADE simplifié, distinction
   dur/substitution, effet absolu/NNT). En cas de doute clinique, signaler plutôt qu'inventer ;
   re-vérifier toute sortie IA sur la source primaire.
7. **Droit d'auteur (veille)** : résumé critique + lien, **jamais** de reproduction intégrale ; pas de
   contournement de paywall.
8. **Pile runtime figée** : Vite + React + TS ; aucune dépendance runtime ajoutée sans décision
   explicite dans un plan (`CLAUDE-BASE.md` §Dépendances). Exception : devDependencies d'outillage/test.
