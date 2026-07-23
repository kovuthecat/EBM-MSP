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

## 2026-07-22 — D9 · Choix techniques du câblage P1 (MVP module Décision)

### Décision

Choix verrouillés pour que les sessions P1 n'aient aucune dépendance à trancher (sinon STOP) :

- **Navigation state-based**, sans routeur — on reproduit la machine à écrans du prototype
  (`screen` dans l'état). **Aucune dépendance runtime ajoutée** hors `react`/`react-dom`.
  *Conséquence : pas d'URL partageable par nœud en v1 (acceptable — outil de consultation).*
  react-router pourra être ajouté plus tard si le deep-link devient nécessaire.
- **Contenu YAML importé via plugin Vite** (`@modyfi/vite-plugin-yaml`, **devDep**) → objets JS au build.
- **Validation JSON Schema via Ajv** (**devDep**) : `/schema/*.json` vérifiés contre `/content/**` dans
  un test Vitest (échoue si un nœud est non conforme). Satisfait « validé par JSON Schema » sans
  pipeline de build séparé.
- **Styles = variables CSS OKLCH** (`:root`, un `tokens.css`) + styles co-localisés par composant.
  Pas de framework CSS, pas de CSS-in-JS. Valeurs exactes = prototype `.dc.html`.
- **Icônes** : aucune en MVP (le prototype est sobre) ; `lucide-react` autorisé plus tard si besoin.
- **Tests** : Vitest (déjà prévu).

### Raison du choix

Priorités `CONVENTIONS.md` (simplicité, peu de dépendances, pas d'abstraction prématurée). Le prototype
est déjà state-based ; ne pas ajouter de routeur tant que le besoin (deep-link) n'existe pas. Seules
2 devDeps (`@modyfi/vite-plugin-yaml`, `ajv`) — justifiées par le modèle de contenu du brief.

### Conséquences

Les sessions P1 peuvent installer ces devDeps sans re-trancher. Le module Veille (P2) réévaluera le
besoin d'un routeur et introduira Supabase.

---

## 2026-07-22 — D10 · Extensions schéma/moteur pour les nœuds multi-facteurs (P2)

### Décision

Issu du cadrage des 8 nœuds (`docs/decision/CADRAGE-8-noeuds.md`) ; validé par le référent (choix
technique délégué) :

- **`traitements_en_cours` = critère multivalué** : ajouter un type `liste` (avec `valeurs`) et un
  opérateur `contient` au DSL de conditions (moteur, P2). *(alternative « un bool par classe » écartée :
  moins lisible.)*
- **Options des nœuds multi-facteurs (B, C)** : plusieurs options peuvent être **« recommandées »
  simultanément**, chacune avec son « pourquoi ». Champ optionnel **`priorite`** (entier) sur `option`
  pour l'ordre ; pas de gagnant unique forcé.
- **`contre_indications` = exclusions dures** : le moteur (P2) les évalue pour **retirer/avertir** une
  option, distinctement de `conditions` (applicabilité).

### Portée

**P2** (nœuds B→H). **Le nœud A / P1 n'est pas concerné** (n'utilise que `nombre`/`enum`/`bool`, options
en échelle, pas de multivalué, CI triviales). **Forward-compat** : le JSON Schema (S2) inclut **dès
maintenant** le type `liste` et le champ optionnel `priorite` → pas de migration de schéma en P2.

### Raison

Modéliser fidèlement B/C (indications cardio-rénales multiples des iSGLT2/aGLP1) sans échelle
artificielle ; les CI sont cliniquement des exclusions dures. Cf. §Observations du cadrage.

---

## 2026-07-22 — D11 · Contenu à 3 niveaux de lecture ; argumentaire exhaustif par nœud

### Décision

Chaque nœud expose **3 niveaux de lecture** au professionnel :

1. **Recommandation** — options applicables avec **avantages/inconvénients**, niveau de preuve, effet attendu.
2. **Argumentaire détaillé** — dépliable : reco officielle **vs** position critique, drapeau de divergence,
   incertitudes, sources principales.
3. **Argumentaire exhaustif** — **un fichier Markdown par nœud**
   (`content/noeuds/<domaine>/<id>.argumentaire.md`) : toutes les preuves détaillées (essai par essai,
   effets absolus/NNT, GRADE) et **toutes les sources**.

Le schéma du nœud porte une référence (optionnelle) vers ce fichier : **`argumentaire_exhaustif`**
(forward-compat, à ajouter au JSON Schema en S2, comme D10).

### Contexte

Directive de Thibault (2026-07-22) : transparence **graduée** (survol → décision → preuve complète).

### Conséquences

Le **dossier de preuve** de travail (`docs/decision/noeuds/`) se **distille** en un argumentaire exhaustif
*reader-facing* (`content/`). La production d'un nœud inclut désormais cette sortie niveau 3 (cf.
`docs/decision/00-global.md`).

---

## 2026-07-23 — D12 · Granularité de la recommandation par molécule uniquement si EBM (transverse)

### Décision

Extension de la directive « granularité si appuyée sur EBM » (référent, 2026-07-22 ; cf.
`docs/decision/00-global.md` §Règles de sourcing) **au grain de la recommandation** : l'outil ne
recommande une **molécule précise** (plutôt que sa **classe**) **que si des données EBM (ECR/méta) le
justifient** pour l'indication considérée. Sinon, recommander **au niveau de la classe**, la reco
officielle (qui, comme la HAS 2024, raisonne souvent par classe) restant **affichée**.

**Vaut pour tout l'outil** (tous nœuds, tous domaines), pas seulement le nœud B.

### Exemple d'application (nœud B, iSGLT2)

- **HHF + néphroprotection** : effet-classe démontré (cana/dapa/empa cohérents) → recommandation **au
  niveau de la classe** « iSGLT2 ».
- **Mortalité / MACE** : démontré **molécule par molécule** (empagliflozine ++ ; canagliflozine et
  dapagliflozine non significatives isolément ; ertugliflozine neutre — VERTIS CV) → si l'on met en avant
  un bénéfice de mortalité, **nommer la molécule** qui l'a prouvé, sans le généraliser à la classe.

### Raison

Cohérence avec l'exactitude médicale (invariant CLAUDE.md §6) et la règle EBM : ne pas sur-généraliser un
bénéfice d'une molécule à toute sa classe, ni encoder une finesse non étayée. Le schéma porte déjà
`niveau_preuve` par option ; une option peut donc se formuler « classe X » ou « molécule Y » selon le grain
que l'EBM autorise.

---

## 2026-07-23 — D13 · Réalisation P2 du moteur : `contient`/`ne_contient_pas`, `priorite`, exclusions dures

### Décision

Implémentation des extensions moteur prévues en **D10** (jusque-là forward-compat de principe, en fait
absentes du schéma/moteur) :

- **DSL — critère `liste` + opérateurs `contient` / `ne_contient_pas`.** Une valeur de critère peut
  désormais être un **tableau de libellés** (`CriteriaValue` étendu à `string[]`) ; `traitements_en_cours
  contient iSGLT2` / `ne_contient_pas iSGLT2` teste l'appartenance. Nécessaire aux nœuds C/D/E (« ne pas
  re-proposer une classe déjà en place »). Un opérateur scalaire (`== < >=`…) sur une liste, ou `contient`
  sur un non-liste, **lève `ConditionError`** (jamais de faux silencieux, brief §7).
- **`priorite` (entier optionnel sur `option`).** En mode `multi-options`, les options applicables sont
  triées par `priorite` **croissante** (tri **stable** ; absence = rang le plus faible, ordre du contenu
  préservé). C'est un **rang FIXE**. Ignoré en `ordered-first-match` (l'ordre du nœud EST la priorité).
- **Exclusions dures — nouveau champ optionnel `exclusions` sur `option`.** Expressions DSL (même
  grammaire que `conditions`). Une option par ailleurs applicable est **retirée** si l'une de ses
  `exclusions` est vraie, et **reportée dans `EvaluateNodeResult.excluded`** (raison = expression(s)
  déclenchée(s)) — jamais retirée en silence. Vaut dans les **deux** modes de sélection. Le repli
  (`["default"]`) est lui aussi soumis à ses propres exclusions.

### Précision vs D10 (prose vs machine)

D10 disait « `contre_indications` = exclusions dures évaluées par le moteur ». En pratique,
`contre_indications` porte du **texte destiné au lecteur** (nœuds A/B en contiennent). On **sépare** donc :
`contre_indications` (prose d'affichage, inchangé) ↔ **`exclusions`** (expressions DSL évaluables). Le
schéma documente ce partage.

### Portée immédiate

- **Schéma + types + moteur** étendus (champs **optionnels** → **aucune migration**). Nœuds **A/B
  inchangés** : ils n'utilisent ni `priorite`, ni `exclusions`, ni `liste` → comportement identique.
- **Nœud B non migré** vers `exclusions`/`priorite` (sa validation clinique resterait à refaire) : il
  conserve son garde-fou de sécurité encodé **en `conditions`** (`symptomes_glucotoxicite == false` sur
  iSGLT2 et l'association), fonctionnellement correct. Migration = tâche ultérieure tracée.

### Vérification bi-agent du comportement (2026-07-23, après codage — pipeline étape 8)

Deux agents indépendants, contextes séparés (A = fidélité au contrat, Sonnet ; B = red-team, Opus) :

- **Agent A** : **CONFORME** aux 13 clauses du contrat (DSL `contient`/`ne_contient_pas` + erreurs
  explicites, `EvaluateNodeResult.excluded`, exclusions dures dans les 2 modes, tri stable par `priorite`
  — `priorite: 0` bien traité comme rang valide via `??`, non `||`, propagation `ConditionError`, non-régression).
- **Agent B** : 0 finding HAUTE, **4 findings** MOYENNE/BASSE convergents (même cause racine : le moteur
  dérivait un booléen muet de collections vides). **Corrigés** : (1) `splitTopLevel` lève désormais sur un
  segment vide (expression vide/blanche, opérateur `AND`/`OR` pendant, et donc `exclusions: ['']` — une
  contre-indication ne peut plus être désactivée en silence) ; (2) `requireConditions` rejette une option
  non-repli au tableau `conditions` vide (plus d'applicabilité vacante neutralisant le repli) ; (3)
  durcissement du schéma (`conditions` : `minItems: 1` + `items.minLength: 1` ; `exclusions.items.minLength: 1`).
- Suite après corrections : **67 tests verts** (38 antérieurs + 22 features P2 + 7 garde-fous red-team) ;
  `npm run build` (typecheck + build) OK.

### Explicitement différé (à trancher si le besoin se confirme)

- **`priorite` conditionnel** (le rang bascule selon la comorbidité dominante — souhait du nœud B :
  IC/rein → iSGLT2 d'abord ; athérome/obésité → AR GLP-1 d'abord). Jugé **sur-ingénierie pour un seul
  nœud** (mini-langage de rang conditionnel) ; la préférence reste **portée par l'argumentaire/les
  `avantages`**. À réévaluer si plusieurs nœuds la réclament.
- **Variables dédiées** `decompensation` / `cetose` (bool) et `contexte_aigu` (D) : côté **contenu**, à
  ajouter au cadrage des nœuds concernés (pas un besoin moteur).

### Raison

Modéliser fidèlement C/D/E (multivalué) et rendre les contre-indications de sécurité **opérantes** sans
détourner la prose d'affichage, tout en gardant le moteur **déterministe et sans échec silencieux**
(D3, brief §7). Choix de forme (nommage `exclusions`, rang fixe vs conditionnel) = **délégué au référent**
comme D9/D10 ; documenté ici pour veto éventuel.

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
