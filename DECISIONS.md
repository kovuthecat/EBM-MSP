# DECISIONS.md — ebm-msp — registre

Journal des décisions **transverses / architecturales**. Les décisions propres à un sous-domaine
(un nœud clinique, la méthodo de veille) vont dans `docs/decision/` ou `docs/veille/`, pas ici.

**Une ligne = une décision, le détail complet dans `docs/decisions/`.** Ce registre est relu à
chaque cadrage : il doit tenir sous 150 lignes (plafond appliqué par hook, cf. `WORKFLOW.md` §7).
Format du détail : cf. `Templates/DECISIONS.md`. Les décisions caduques descendent en `## Archives`.

---

## Décisions

- 2026-07-22 — **D1 · Stack** — Vite+React+TS+Vitest partout ; Supabase (UE) réservé au module Veille, Décision reste 100 % statique → [détail](docs/decisions/2026-07-22-d1-stack-vite-react-ts-supabase-ue-pour-la-veille.md)
- 2026-07-22 — **D2 · Un repo, deux modules feature-first** — taxonomie de thèmes partagée, pont veille↔nœud → [détail](docs/decisions/2026-07-22-d2-un-repo-deux-modules-feature-first-taxonomie-partagee.md)
- 2026-07-22 — **D3 · Contenu YAML+JSON Schema, moteur TS pur** — filtrage par règles booléennes transparentes, aucun score caché, jamais de ML → [détail](docs/decisions/2026-07-22-d3-contenu-versionne-yaml-json-schema-moteur-de-regles-ts-pur.md)
- 2026-07-22 — **D4 · Zéro donnée patient** — module Décision volatile, module Veille minimisé (Supabase UE) → [détail](docs/decisions/2026-07-22-d4-zero-donnee-patient-rgpd-minimise-cote-veille.md)
- 2026-07-22 — **D5 · Intégration veille→algorithme = validation humaine obligatoire** — jamais de mise à jour automatique d'un nœud → [détail](docs/decisions/2026-07-22-d5-integration-veille-algorithme-validation-humaine-obligatoire.md)
- 2026-07-22 — **D6 · Vérification bi-agents = process de production** — hors runtime, documentée dans `docs/veille/` → [détail](docs/decisions/2026-07-22-d6-verification-bi-agents-process-de-production-hors-runtime.md)
- 2026-07-22 — **D7 · Collecte automatisée repoussée en Phase 4** — MVP/V1 = veille manuelle assistée → [détail](docs/decisions/2026-07-22-d7-collecte-automatisee-infra-phase-4-hors-mvp.md)
- 2026-07-22 — **D8 · Module Décision générique multi-domaine** — DT2 = premier domaine, moteur/UI ne connaissent aucun domaine par son nom → [détail](docs/decisions/2026-07-22-d8-module-decision-generique-et-multi-domaine-dt2-premier-domai.md)
- 2026-07-22 — **D9 · Choix techniques du câblage P1** — navigation state-based sans routeur, YAML via plugin Vite, Ajv, CSS OKLCH, zéro icône MVP → [détail](docs/decisions/2026-07-22-d9-choix-techniques-du-cablage-p1-mvp-module-decision.md)
- 2026-07-22 — **D10 · Extensions schéma/moteur nœuds multi-facteurs (P2)** — critère `liste`, `priorite` sur option, `contre_indications` = exclusions dures → [détail](docs/decisions/2026-07-22-d10-extensions-schema-moteur-pour-les-noeuds-multi-facteurs-p2.md)
- 2026-07-22 — **D11 · Contenu à 3 niveaux de lecture** — recommandation → argumentaire détaillé → argumentaire exhaustif (fichier dédié par nœud) → [détail](docs/decisions/2026-07-22-d11-contenu-a-3-niveaux-de-lecture-argumentaire-exhaustif-par-no.md)
- 2026-07-23 — **D12 · Granularité molécule vs classe, transverse** — ne nommer une molécule que si l'EBM le justifie pour l'indication, sinon rester au niveau classe → [détail](docs/decisions/2026-07-23-d12-granularite-de-la-recommandation-par-molecule-uniquement-si.md)
- 2026-07-23 — **D13 · Moteur P2 réalisé** — DSL `contient`/`ne_contient_pas`, `priorite` (tri stable), `exclusions` (retrait tracé) ; vérifié bi-agents (0 HAUTE, 4 corrigées) → [détail](docs/decisions/2026-07-23-d13-realisation-p2-du-moteur-contient-ne-contient-pas-priorite-e.md)
- 2026-07-23 — **D14 · Priorité conditionnelle des options** — `priorite` accepte des règles `{quand, rang}` évaluées par patient ; vérifié bi-agents (1 HAUTE corrigée) → [détail](docs/decisions/2026-07-23-d14-priorite-conditionnelle-des-options-construit-leve-le-report.md)
- 2026-07-23 — **D15 · Alertes cliniques conditionnelles** — champ `alertes` de nœud, indépendant de la sélection des options → [détail](docs/decisions/2026-07-23-d15-alertes-cliniques-conditionnelles-rappels-avertissements-pil.md)
- 2026-07-23 — **D16 · Sentinel `toujours`** — option socle systématiquement affichée en `multi-options`, badge distinct de « Recommandée » → [détail](docs/decisions/2026-07-23-d16-sentinel-moteur-toujours-option-socle-systematiquement-affic.md)
- 2026-07-23 — **D17 · Robustesse UI** — `ScreenErrorBoundary` (jamais d'écran blanc) + formulaire du critère `liste` corrigé → [détail](docs/decisions/2026-07-23-d17-robustesse-ui-filet-d-erreur-d-ecran-formulaire-critere-list.md)
- 2026-07-25 — **D18 · Fusion B+C+D en un nœud `prescription`** — piloté par `traitements_en_cours` puis par le primer `intention` (mise à jour S8) → [détail](docs/decisions/2026-07-25-d18-fusion-des-noeuds-de-prescription-orale-b-c-d-en-un-noeud-un.md)
- 2026-07-25 — **D19 · Grammaire de modélisation d'un nœud (R1→R6)** — générique tous domaines, banc en 3 couches (vignettes/couverture/invariants) → [détail](docs/decisions/2026-07-25-d19-grammaire-de-modelisation-d-un-noeud-r1-r6-generique-tous-do.md)
- 2026-07-26 — **D20 · Valeur indéterminée, 3e état** — le moteur ne se prononce jamais sur un critère non renseigné, ni dans le sens rassurant ni alarmant → [détail](docs/decisions/2026-07-26-d20-valeur-indeterminee-le-moteur-ne-se-prononce-jamais-sur-ce-q.md)
- 2026-07-26 — **D21 · Canal d'un fait de sécurité** — exclusion (contre-indiqué) / alerte d'option (qualifie) / alerte de nœud (vrai quel que soit le geste), jamais via `priorite` → [détail](docs/decisions/2026-07-26-d21-canal-d-un-fait-de-securite-exclusion-alerte-d-option-ou-ale.md)
- 2026-07-26 — **D22 · Module de nœuds** — préambule partagé + primer d'orientation (1er usage : module RHD), jamais un chaînage obligatoire (R1) → [détail](docs/decisions/2026-07-26-d22-module-de-noeuds-preambule-partage-et-primer-de-levier.md)
- 2026-07-26 — **D23 · Position affichée = donnée publiée, jamais la revue qui la cite** — Prescrire/Médicalement Geek en référence bibliographique seulement, jamais comme argument → [détail](docs/decisions/2026-07-26-d23-la-position-affichee-s-appuie-sur-la-donnee-publiee-jamais-s.md)
- 2026-07-26 — **D24 · Champ `cadrage`** — position de lecture vraie pour tout patient (état des preuves), distincte d'une `alerte` (situation d'un patient) → [détail](docs/decisions/2026-07-26-d24-une-position-de-lecture-n-est-pas-une-alerte-le-champ-cadrag.md)
- 2026-07-27 — **D25 · `Option.role`** — socle/sécurité/geste/repli, pilote repli d'affichage + badge + plafond à 5 pistes affichées → [détail](docs/decisions/2026-07-27-d25-role-d-une-option-option-role-et-plafond-d-affichage-par-ran.md)
- 2026-07-27 — **D26 · `visible_si` sur une valeur de `liste`** — extension du DSL existant, aucun nouvel opérateur → [détail](docs/decisions/2026-07-27-d26-visible-si-sur-une-valeur-de-liste.md)
- 2026-07-27 — **D27 · Contraintes de saisie déclaratives** — `Noeud.contraintes` signale une combinaison de critères incohérente, filtre le banc synthétique → [détail](docs/decisions/2026-07-27-d27-contraintes-de-saisie-declaratives-sur-un-noeud.md)
- 2026-07-27 — **D28 · Mémoire de session inter-nœuds** — amende l'invariant CLAUDE.md 1 : `Map` volatile pré-remplissant les critères `partage`, jamais une conclusion du moteur → [détail](docs/decisions/2026-07-27-d28-memoire-de-session-inter-noeuds-amende-l-invariant-claude-md.md)
- 2026-07-27 — **D29 · Tout identifiant affiché a un libellé rédigé** — invariant I20, le repli `humanize()` cesse d'être acceptable pour du contenu publié → [détail](docs/decisions/2026-07-27-d29-tout-identifiant-de-contenu-affiche-a-un-libelle-redige-inva.md)
- 2026-07-28 — **D30 · Un `bool`/`liste` non répondu est indéterminé (amende D20)** — fin de la présomption implicite « non »/« aucun », sauf `presomption_non` explicite → [détail](docs/decisions/2026-07-28-d30-un-critere-non-repondu-est-indetermine-quel-que-soit-son-typ.md)
- 2026-07-28 — **D31 · Une contrainte violée est opposable au rendu (complète D27)** — suspend l'affichage des options, jamais les alertes de nœud → [détail](docs/decisions/2026-07-28-d31-une-contrainte-de-saisie-est-opposable-au-rendu-complete-d27.md)
- 2026-07-28 — **D32 · Halte sur indéterminé n'atteint pas les options `role: securite` (amende D11)** — le filet de sécurité reste évaluable après une halte, l'ordre du nœud fait foi ailleurs → [détail](docs/decisions/2026-07-28-d32-en-ordered-first-match-la-halte-sur-indetermine-n-atteint-pa.md)
- 2026-07-28 — **D33 · Bouton « Nouveau patient » purge la mémoire de session (complète D28)** — confirmation requise, orchestré par `App.tsx` → [détail](docs/decisions/2026-07-28-d33-la-memoire-de-session-a-un-geste-de-sortie-complete-d28.md)
- 2026-07-28 — **D34 · Contre-indications : registre de sécurité en tête, puis repli dans le dépli avec indicateur (amendement P6/SB3)** — jamais totalement invisible, libellé du `<summary>` change selon leur présence → [détail](docs/decisions/2026-07-28-d34-contre-indications-d-une-option-registre-de-securite-en-tete.md)
- 2026-07-28 — **D35 · `Option.action` (5 verbes fixes)** — effet de présentation seul, réservé aux nœuds dont le vocabulaire des intitulés l'emploie déjà (`prescription`, `insuline`) → [détail](docs/decisions/2026-07-28-d35-champ-optionnel-option-action-vocabulaire-fixe-a-5-verbes-re.md)
- 2026-07-29 — **D36 · Un critère partagé se réduit à ce que le nœud en consomme** — nom et type propres quand un nœud ne lit qu'une part d'un critère de domaine (1er cas : les 2 nœuds RHD, `traitements_en_cours` → `insuline_ou_insulinosecreteur`) → [détail](docs/decisions/2026-07-29-d36-un-critere-partage-se-reduit-a-ce-que-le-noeud-en-consomme.md)

## Décisions ouvertes (à trancher avec le comité MSP)

- **Méthode d'authentification veille** : magic link vs e-mail+mot de passe (reco : magic link + liste
  blanche MSP). — *ouvert, tranché en Phase 3.*
- **Statut MDR (règlement UE 2017/745)** : à faire vérifier **avant mise en ligne**. — *ouvert.*
- **Composition du comité éditorial** et référents par profession. — *ouvert, gouvernance MSP.*
- **Liste finale des sources de veille par profil** (Tier 1→4 de la SOP). — *ouvert.*

---

## Archives

> Une ligne par décision caduque : `YYYY-MM-DD — Titre — remplacée par <décision/date>`.
