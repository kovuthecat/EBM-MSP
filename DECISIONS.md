# DECISIONS.md — ebm-msp

Journal des décisions **transverses / architecturales**. Les décisions propres à un sous-domaine
(un nœud clinique, la méthodo de veille) vont dans `docs/decision/` ou `docs/veille/`, pas ici.

Format : cf. template. Les décisions caduques descendent en `## Archives`.

---

## Décisions

## 2026-07-22 — D1 · Stack Vite + React + TS (+ Supabase UE pour la veille)

### Décision

Vite + React + TypeScript + Vitest pour toute l'app. **Supabase (région UE)** uniquement pour le
module Veille (auth + données utilisateur). Le module Décision reste **100 % statique, sans backend,
sans persistance**.

### Contexte

Les briefs recommandaient Astro (ou vanilla). Tout l'écosystème MSP de Thibault est déjà sur
Vite+React+TS (ETP interactif, annuaire-msp) ou +Supabase (annuaire-msp, S&C, cosme-diy).

### Alternatives envisagées

- Astro (défaut du brief) : bon pour un site de contenu, mais stack nouvelle, moins alignée.
- Vanilla HTML/CSS/JS : le plus léger, mais coûteux à maintenir pour 2 modules (filtres, comptes).

### Raison du choix

Cohérence d'écosystème (réutilisation d'acquis, maintenance par les mêmes modèles IA), priorité
« architecture facile à manipuler par les modèles » (`CONVENTIONS.md`). Le brief posait Astro comme
recommandation explicitement optionnelle. ETP interactif est le précédent direct (app clinique MSP,
multi-thèmes, statique) et sert de modèle d'organisation.

### Conséquences

Contenu YAML compilé en JSON pour le runtime (Vite), moteur de règles en TS pur testé (satisfait le
besoin « logique déterministe et auditable » du brief). Supabase introduit une dépendance backend
bornée au seul module Veille.

### Impact IA

Structure et invariants calqués sur ETP interactif → contexte de démarrage familier.

---

## 2026-07-22 — D2 · Un repo, deux modules feature-first, taxonomie partagée

### Décision

Un seul repo. Découpage `src/features/decision`, `src/features/veille`, `src/features/shared`.
Taxonomie de thèmes **commune** aux deux modules ; pont `impact_algorithme.noeuds_impactes`
(veille) ↔ `veille_liee` (nœud).

### Raison du choix

Les briefs posent explicitement « même plateforme, même dépôt git, taxonomie commune, lien
article → nœud ». Feature-first isole les modules tout en partageant le socle (badges, types, pont).

### Conséquences

Le module Décision ne dépend pas de Supabase ; seul `veille` le fait. Fichiers de contexte racine
(`STATUS`, `DECISIONS`, `PROJECT_MAP`, `VALIDATION`) restent **au niveau projet** ; le détail par
sous-domaine est routé vers `docs/decision/` et `docs/veille/` (pas un STATUS/DECISIONS par module).

---

## 2026-07-22 — D3 · Contenu versionné YAML + JSON Schema ; moteur de règles TS pur

### Décision

Un fichier YAML par nœud (`/content/noeuds`) et par entrée de veille (`/content/veille`), validé par
**JSON Schema** (`/schema`), compilé en JSON pour le runtime. Le moteur de règles est un **module TS
pur**, testé unitairement, filtrant les options via des `conditions` booléennes — **aucun score caché,
jamais de ML**.

### Raison du choix

Sépare contenu / logique / présentation (brief §5, §9). Publication d'un nœud ou d'une veille par pull
request → traçabilité git. Un moteur pur est auditable et testable (exigence MDR potentielle).

### Conséquences

Chaque nœud porte `meta` (date_revue, auteur, statut brouillon/valide, version, changelog). Le rendu
UI est piloté par le contenu ; le moteur ne connaît aucun nœud par son nom.

---

## 2026-07-22 — D4 · Zéro donnée patient ; RGPD minimisé côté veille

### Décision

Aucune donnée patient nulle part. Module Décision : saisie **volatile**, aucune persistance. Module
Veille : seules données personnelles = e-mail (pro MSP), profil (profession), ids « pour mémoire »,
préférences d'affichage — sur Supabase **UE**, chiffré en transit et au repos, self-service de
suppression de compte.

### Raison du choix

Brief §3/§9bis (RGPD allégé, minimisation). Réduit la surface réglementaire.

### Conséquences

Politique de confidentialité + CGU + registre des traitements à rédiger (Phase 3, avant les comptes).
HDS *a priori* non requis (pas de donnée de santé) — à confirmer.

---

## 2026-07-22 — D5 · Intégration veille → algorithme : validation humaine obligatoire

### Décision

Une donnée de veille ne modifie **jamais** un nœud automatiquement. Chaîne tracée : détection
(`proposition_maj = candidate`) → diff proposé par Claude → **validation comité** (`validee`/`rejetee`,
datée) → application versionnée (bump version + changelog `veille_source` + `date_revue` + `veille_liee`).

### Raison du choix

Sécurité clinique + statut potentiel de dispositif médical : toute modification d'algorithme d'aide à
la décision doit être maîtrisée, justifiée, historisée (brief décision §13).

### Conséquences

Traçabilité bidirectionnelle veille ↔ nœud. Le comité éditorial est le seul à pouvoir changer un nœud.

---

## 2026-07-22 — D6 · Vérification bi-agents = process de production, hors runtime

### Décision

La « double lecture » bi-agents (Agent A analyste vs Agent B contradicteur, orchestrés par Claude Code,
puis réconciliation) est un **processus de production de contenu**, exécuté au moment de rédiger/mettre
à jour une entrée de veille ou un nœud — **pas une fonctionnalité de l'application web**. Documenté dans
`docs/veille/` (référence : briefs §13bis / §7ter + SOP §7).

### Raison du choix

Éviter de confondre méthodologie éditoriale et surface applicative. L'app affiche le résultat (entrées,
nœuds), pas l'orchestration.

### Conséquences

Aucune dépendance runtime liée aux agents. Les journaux d'analyse + réconciliation sont archivés hors
app (auditabilité MDR).

---

## 2026-07-22 — D7 · Collecte automatisée = infra Phase 4, hors MVP

### Décision

La moisson automatisée (PubMed E-utilities, Europe PMC, RSS, web-fetch programmé, orchestration
GitHub Action hebdomadaire écrivant `/collecte/AAAA-Www.json` en PR) est **repoussée en Phase 4**. Le
MVP et la V1 fonctionnent avec une production de veille **manuelle assistée**.

### Raison du choix

Roder d'abord le pipeline manuel (screening, grille, publication) avant d'automatiser le repérage.
L'automatisation ne publie rien — elle ne fait que produire des candidats.

---

## 2026-07-22 — D8 · Module Décision générique et multi-domaine (DT2 = premier domaine)

### Décision

Le module Décision n'est **pas** un outil « DT2 » : c'est un moteur générique servant une bibliothèque
de **domaines de décision**. Le moteur et l'UI ne connaissent **aucun domaine ni nœud par son nom** ;
chaque nœud porte un champ `domaine` (ex. `diabete-type-2`) et tout est piloté par le contenu. **Le
DT2 est le premier domaine** livré (il amorce et valide le socle) ; CV, BPCO, gériatrie, prévention…
suivront en ajoutant des nœuds YAML, sans toucher au moteur.

### Contexte

Précision apportée par Thibault à l'initiation : le DT2 est le premier des nombreux domaines à venir,
pas le périmètre définitif. Aligné sur le précédent ETP interactif (moteur multi-thème par conception :
le générique vit dans `src/components`/`registry`, le spécifique sous `src/features/<theme>/`).

### Conséquences

- La navigation Décision prévoit un niveau **domaine** (sélecteur/en-tête) même si un seul est présent
  en v1 (`ARCHITECTURE.md` D2).
- Le JSON Schema du nœud rend `domaine` obligatoire ; le contenu s'organise par domaine
  (`/content/noeuds/<domaine>/…` envisageable quand plusieurs domaines coexistent).
- « Élargir la décision au-delà du DT2 » n'est pas un hors-périmètre définitif mais une **phase
  ultérieure** (cf. `PROJECT_BRIEF.md` Roadmap) — à ne pas entamer avant que le socle DT2 soit stable.

---

## Décisions ouvertes (à trancher avec le comité MSP)

- **Méthode d'authentification veille** : magic link vs e-mail+mot de passe (reco : magic link + liste
  blanche MSP). — *ouvert, tranché en Phase 3.*
- **Statut MDR (règlement UE 2017/745)** : à faire vérifier **avant mise en ligne**. — *ouvert.*
- **Composition du comité éditorial** et référents par profession. — *ouvert, gouvernance MSP.*
- **Liste finale des sources de veille par profil** (Tier 1→4 de la SOP). — *ouvert.*

---

## Archives

> Une ligne par décision caduque : `YYYY-MM-DD — Titre — remplacée par <décision/date>`.
