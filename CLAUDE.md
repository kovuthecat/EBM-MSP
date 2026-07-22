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

# Typecheck seul
npx tsc --noEmit
```

- Variables d'environnement : Supabase (module Veille uniquement) → `.env` (non commité), `.env.example`.
  Module Décision : aucune (100 % statique).
- Ne jamais committer de secret (`.env`, clés, tokens).

@C:\Users\kovu\SynologyDrive\Thibault\Projets\Templates\CLAUDE-BASE.md

## Règles spécifiques au projet

### À lire avant une tâche importante

- `PROJECT_BRIEF.md` (objectif, périmètre) · `ARCHITECTURE.md` (écrans, découpage) ·
  `DECISIONS.md` (arbitrages transverses) · `PROJECT_MAP.md` (localisation).
- Autorité du contenu clinique : `docs/decision/` (nœuds DT2) · méthodo veille : `docs/veille/`
  (SOP, grille, briefs sources).

### Invariants non négociables

1. **Zéro donnée patient**, partout. Module Décision : **aucune persistance, aucun réseau** au runtime
   (saisie volatile). Module Veille : données personnelles minimisées (e-mail, profil, ids « pour
   mémoire ») sur Supabase UE — cf. `DECISIONS.md` D4.
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
