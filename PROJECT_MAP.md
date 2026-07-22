# PROJECT_MAP.md — ebm-msp

Carte synthétique du projet. Permet d'identifier les zones pertinentes sans explorer tout le repo.

> **État actuel : projet initié, code non encore scaffoldé.** L'arborescence `src/` ci-dessous est
> la structure **cible** (fixée au cadrage) ; elle sera créée au câblage (après la maquette). Seuls
> existent aujourd'hui les fichiers de contexte, `docs/` (briefs sources) et `design/maquettes/`.

---

## Vue d'ensemble

- **Type** : web app Vite + React + TS, deux modules frères (Décision · Veille) dans un seul repo.
- **Grandes zones** : *Décision* (moteur de règles déterministe **générique multi-domaine**, 100 %
  statique ; DT2 = premier domaine) · *Veille* (liste filtrable + comptes Supabase) · *Shared*
  (taxonomie, badges, pont article↔nœud) · *Contenu* (YAML versionné + JSON Schema).
- **Flux principal** : accueil → module Décision (saisie critères → options + argumentaire) ou module
  Veille (liste filtrable → détail article) ; pont bidirectionnel article ↔ nœud.
- **Contraintes structurantes** : zéro donnée patient ; module Décision sans persistance ; moteur
  déterministe (jamais de ML) ; contenu versionné en PR ; intégration veille→nœud validée par un humain.

---

## Arborescence utile (cible)

```text
content/
  noeuds/          # 1 YAML par nœud de décision (A→H)
  veille/          # 1 YAML par entrée de veille
schema/            # JSON Schema (nœud, entrée de veille)
src/
  features/
    decision/      # moteur de règles (TS pur, testé) + UI saisie/résultats + argumentaire
    veille/        # liste filtrable + détail + auth Supabase + pour mémoire + profil
    shared/        # taxonomie thèmes, badges (preuve/impact), types communs, pont, layout/nav
  lib/             # chargement/compilation contenu, utilitaires
  components/      # UI partagée bas niveau
  types/
docs/
  decision/        # cadrage + décisions cliniques par nœud (autorité du contenu)
  veille/          # SOP, grille d'appréciation, méthodo (autorité du contenu)
design/maquettes/  # exports Claude Design (un fichier par écran)
tests/             # (ou *.test.ts colocalisés) — moteur de règles surtout
```

---

## Features principales (cible)

### Feature — decision

Rôle : aide à la décision DT2 par moteur de règles déterministe.
Points de vigilance : moteur générique (ne connaît aucun nœud par son nom) ; aucun score caché ;
100 % statique, aucune persistance ; badges niveau de preuve + distinction dur/substitution.

### Feature — veille

Rôle : veille hebdomadaire filtrable, comptes légers, couplage aux nœuds.
Points de vigilance : Supabase UE, données minimisées (RGPD) ; droit d'auteur (résumé + lien, jamais
de texte intégral) ; marqueur « impacte un algorithme » → nœud.

### Feature — shared

Rôle : taxonomie de thèmes commune, badges, types, pont article↔nœud, layout/navigation, disclaimer.

---

## Fichiers transversaux importants

### Configuration

- `package.json`, `vite.config.ts`, `tsconfig*.json` — *à créer au scaffold.*
- Variables d'environnement : Supabase (veille) — `.env` non commité, `.env.example` fourni.

### API / persistance

- Décision : aucune. · Veille : client Supabase (auth + `pour_memoire`).

### Contenu (autorité)

- `docs/decision/BRIEF_DECISION.md`, `docs/veille/BRIEF_VEILLE.md`,
  `docs/veille/GRILLE_APPRECIATION.md`, `docs/veille/SOP_veille.md`.

---

## Zones à risque ou coûteuses en contexte IA

- Contenu clinique (nœuds DT2) : exactitude médicale critique — sourcer, ne pas inventer, re-vérifier
  toute sortie IA sur la source primaire.
- Moteur de règles : la justesse du filtrage conditionne l'aide clinique — bien testé (Vitest).

---

## Règles locales importantes

- Aucune dépendance runtime ajoutée sans décision explicite (cf. `CLAUDE-BASE.md` §Dépendances).
- Module Décision : jamais de persistance, jamais de réseau au runtime.
- Toute modif de nœud clinique = versionnée + changelog + validation humaine (cf. `DECISIONS.md` D5).
