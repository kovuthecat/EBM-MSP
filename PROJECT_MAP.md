# PROJECT_MAP.md — ebm-msp

Carte synthétique du projet. Permet d'identifier les zones pertinentes sans explorer tout le repo.

> **État actuel (2026-07-28) : module Décision construit et déployé** (ebm-msp.vercel.app), domaine
> DT2, 6 nœuds. **Module Veille : zéro code** — arborescence ci-dessous marquée `(cible)` là où rien
> n'existe encore. Détail courant : `STATUS.md`.

---

## Vue d'ensemble

- **Type** : web app Vite + React + TS. Un seul module livré à ce jour : **Décision** (moteur de règles
  déterministe **générique multi-domaine**, 100 % statique + mémoire de session en RAM, D28 ; DT2 =
  premier domaine). *Veille* (liste filtrable + comptes Supabase) reste à l'état de roadmap (D8).
- **Flux principal actuel** : accueil → domaine (DT2) → nœud ou module RHD → saisie critères → options
  et argumentaire à 3 niveaux.
- **Contraintes structurantes** : zéro donnée patient sur disque/réseau (mémoire de session RAM
  autorisée, D28) ; moteur déterministe (jamais de ML) ; contenu versionné en PR ; intégration
  veille→nœud validée par un humain (V, à venir).

---

## Arborescence réelle

```text
content/
  decision/
    noeuds/diabete-type-2/   # 6 YAML (nœud) + 1 .argumentaire.md chacun
    modules/diabete-type-2/  # rhd.yaml — regroupe les 2 nœuds RHD (D22)
  veille/                    # (cible) — S5
schema/
  decision/                  # noeud.schema.json, module.schema.json (Ajv)
  veille/                    # (cible) — S5
src/
  features/
    decision/
      content/             # node.types.ts, loadNodes.ts, loadModules.ts, loadArgumentaires.ts
      engine/               # moteur pur (conditions, evaluateNode, deriveCritere, contraintes, relevance)
        banc/                # 3 couches de tests : vignettes, couverture, invariants génériques
      lib/                  # vueDecision (modèle de vue), formLayout, labels, sessionCriteres (D28)
      components/           # CriteriaForm, OptionCard, ArgumentPanel, AlertList…
      screens/              # DecisionDomainsScreen, DecisionModuleScreen, DecisionNodeScreen
    shared/
      badges/                # niveau de preuve, distinction dur/substitution
      layout/                # AppShell, DisclaimerBar, ScreenErrorBoundary
      screens/                # Accueil, Méthode
    veille/                  # (cible) — S6/S7
  styles/                   # tokens CSS (OKLCH)
docs/
  commun/
    decisions/               # détail par décision (`DECISIONS.md` y renvoie)
  decision/
    noeuds/                 # dossier de preuve PAR NŒUD (autorité du contenu clinique)
    validation/              # chantiers de recherche/red-team/vérification, PAR CHANTIER DATÉ
    GRAMMAIRE-NOEUD.md        # règles R1→R9, transverse aux domaines cliniques (pas aux modules), tous domaines
    CONSTRUIRE-UN-MODULE.md   # procédé P0→P7 de construction d'un domaine/module — idem
  veille/                    # (cible) SOP, grille d'appréciation — module non démarré
design/maquettes/           # exports Claude Design (un fichier par écran)
plans/                      # P1, P2, P3-fusion — historique du COMMENT, un dossier par plan clos
```

`src/features/veille/` : **n'existe pas**. `Supabase` : aucune dépendance dans `package.json` à ce
jour — le module Veille n'a pas commencé.

---

## Features principales

### Feature — decision (livrée)

Rôle : aide à la décision DT2 par moteur de règles déterministe. 6 nœuds, ~770 tests.
Points de vigilance : moteur générique (ne connaît aucun nœud/domaine par son nom, D8) ; aucun score
caché ; contenu = seule source de vérité affichée (D29 : tout identifiant a un libellé rédigé) ; mémoire
de session bornée (D28, `lib/sessionCriteres.ts`) — jamais une conclusion du moteur, jamais imposée.

### Feature — shared (livrée, périmètre restreint à Décision)

Rôle : badges niveau de preuve, layout/navigation, disclaimer, filet d'erreur d'écran. Pas encore de
taxonomie de thèmes ni de pont article↔nœud (n'a de sens qu'une fois Veille démarré).

### Feature — veille (cible, non démarrée)

Rôle prévu : veille hebdomadaire filtrable, comptes légers, couplage aux nœuds.
Points de vigilance prévus : Supabase UE, données minimisées (RGPD) ; droit d'auteur (résumé + lien,
jamais de texte intégral) ; marqueur « impacte un algorithme » → nœud.

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
- **Transverse aux domaines cliniques, pas aux modules** — ces deux fichiers appartiennent au module
  Décision et ne bougent pas avec l'arrivée de Veille : `docs/decision/GRAMMAIRE-NOEUD.md` (règles
  d'écriture d'un nœud, R1→R9) · `docs/decision/CONSTRUIRE-UN-MODULE.md` (procédé de construction d'un
  module, P0→P7, portes de sortie et checklists). `docs/decision/00-global.md` reste **DT2** (pipeline
  de preuve).

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
