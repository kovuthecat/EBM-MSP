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
  IC/rein → iSGLT2 d'abord ; athérome/obésité → AR GLP-1 d'abord). Jugé initialement sur-ingénierie
  pour un seul nœud → **finalement construit en D14** sur décision du référent (« on construit »).
- **Variables dédiées** `decompensation` / `cetose` (bool) et `contexte_aigu` (D) : côté **contenu**, à
  ajouter au cadrage des nœuds concernés (pas un besoin moteur).

### Raison

Modéliser fidèlement C/D/E (multivalué) et rendre les contre-indications de sécurité **opérantes** sans
détourner la prose d'affichage, tout en gardant le moteur **déterministe et sans échec silencieux**
(D3, brief §7). Choix de forme (nommage `exclusions`, rang fixe vs conditionnel) = **délégué au référent**
comme D9/D10 ; documenté ici pour veto éventuel.

---

## 2026-07-23 — D14 · Priorité conditionnelle des options (construit — lève le report de D13)

### Décision

Sur décision du référent (« on construit »), le champ `priorite` d'une `option` accepte désormais, **en
plus** d'un entier (rang fixe, D13), une **liste de règles `{ quand, rang }`** (rang **conditionnel**) :
en mode `multi-options`, le rang effectif de l'option est celui de la **1re règle dont `quand`** (condition
DSL, ou la sentinelle `"default"`) est vraie pour le patient ; si aucune ne matche → rang le plus faible
(placée en dernier). Le rang est donc **évalué par patient** (il dépend des critères). Un `quand` malformé
lève `ConditionError` (jamais de faux silencieux). Ignoré en `ordered-first-match`.

### Motivation (nœud B)

Exprime la préférence par comorbidité dominante que l'ordre fixe ne pouvait pas : `iSGLT2` rang 1 s'il
existe une indication IC/rénale, sinon rang 2 ; `AR GLP-1` l'inverse. Résultat : IC/rénal → iSGLT2 en
tête ; athérome/obésité **sans** IC/rénal → AR GLP-1 en tête (bénéfice athéromateux mieux établi pour les
AR GLP-1). **Enjeu = emphase/hiérarchisation, pas sécurité** : en `multi-options`, toutes les options
applicables restent affichées quel que soit le rang.

### Portée

- `priorite` **polymorphe** (`number | { quand, rang }[]`), schéma `oneOf`. Champs optionnels → nœuds
  A/B **inchangés**. Rangs **pré-calculés une seule fois** avant le tri (une évaluation par option, et une
  `ConditionError` remonte proprement plutôt qu'en plein tri).
- **Nœud B non encore migré** : la bascule iSGLT2/AR GLP-1 reste, en attendant, portée par l'argumentaire.
  La migration (réécriture des `priorite` + passage du garde-fou catabolique en `exclusions`) rouvrirait
  le contenu clinique validé → **nouvelle passe de vérification bi-agent** (pipeline étape 8) ; à lancer
  sur décision explicite.
- Tests : **78 verts** ; build OK.

### Vérification bi-agent du comportement (2026-07-23, après codage — pipeline étape 8)

Deux agents indépendants, contextes séparés (A = conformité, Sonnet ; B = red-team, Opus) :

- **Agent A** : **CONFORME** aux 8 clauses (polymorphisme ; `resolvePriorite` — rang `0`/négatifs,
  première-règle-gagne, sentinelle `"default"`, sinon `+Infinity` ; évaluation par patient ; tri après
  exclusions ; ignoré en `ordered-first-match` ; `ConditionError` propagée ; `oneOf` rejette les formes
  invalides ; non-régression D13).
- **Agent B** : **5 findings, 1 HAUTE**. F1 (HAUTE) : une règle qui matche mais au `rang` `undefined`/`null`
  (contenu non validé au runtime, D9) était coalescée en `+Infinity` par le `??` du comparateur → option
  reléguée en dernier **sans erreur** (faux silencieux, sur un tri qui hiérarchise des molécules). F2/F5
  (MOYENNE) : règle sans `quand`, ou `priorite` d'une forme inattendue → `TypeError` brut au lieu de
  `ConditionError`. F3 (BASSE) : `rang: NaN` → comparateur non transitif. **Tous corrigés** en durcissant
  `resolvePriorite` (gardes `Array.isArray`, `typeof quand === 'string'`, `Number.isFinite(rang)` →
  `ConditionError` nommant l'option) et en retirant le `??` masquant du comparateur. F4 (BASSE) = **pas un
  bug** : une règle `"default"` placée avant une règle spécifique rend cette dernière morte — sémantique
  first-match **conforme**, mais piège d'écriture (placer `"default"` en dernier).
- Suite après corrections : **78 tests verts** (73 + 5 garde-fous : `rang` manquant / `NaN` / non fini,
  `quand` manquant, `priorite` non-tableau → `ConditionError`) ; build OK.

### Raison

Besoin clinique réel (hiérarchisation par comorbidité) désormais jugé prioritaire par le référent ; coût
maîtrisé (extension **additive**, pré-calcul des rangs). Nœud C (intensification/optimisation) piloté par
`traitements_en_cours` en bénéficiera aussi. Choix de forme (`priorite` polymorphe plutôt qu'un champ
séparé ; sentinelle `"default"` alignée sur `conditions: ["default"]`) délégué au référent, documenté.

---

## 2026-07-23 — D15 · Alertes cliniques conditionnelles (rappels/avertissements pilotés par le contenu)

### Décision

Nouveau champ optionnel **`alertes`** au niveau du nœud : liste de `{ quand, message, niveau? }`, où `quand`
est une expression DSL (ou la sentinelle `"default"`) et `niveau` vaut `info` | `attention`. Le moteur
(`evaluateNode`) évalue les alertes **indépendamment de la sélection des options** et renvoie celles
déclenchées dans **`EvaluateNodeResult.alertes`**. Un `quand` malformé lève `ConditionError` (jamais de faux
silencieux, comme le reste du DSL).

### Motivation (nœud B v1.3)

Certains messages cliniques ne sont ni un **choix de traitement** (option) ni une **exclusion** (retrait
d'option), mais des **rappels/avertissements** liés à l'état du patient : « contrôler la cétonémie si HbA1c
élevée ou signes de glucotoxicité » ; « adapter la dose de metformine au palier de DFG » (RCP ANSM). Les
encoder en `options` polluerait la liste de recommandations ; en `exclusions` n'aurait pas de sens. D'où un
canal dédié.

### Portée

- **Schéma + types + moteur** étendus (champ **optionnel** → nœuds sans `alertes` inchangés). **Réutilise le
  DSL existant** (aucun nouvel opérateur). `evaluateOrderedFirstMatch` calcule les options ; `evaluateNode`
  injecte les alertes → les deux modes de sélection les renvoient.
- Feature de **contenu/affichage**, déterministe et sans échec silencieux (D3). Le moteur reste générique :
  le nœud porte les messages, le moteur n'en connaît aucun.
- Vérifiée : tests unitaires (nœuds synthétiques) + **trace sur le nœud B réel** (alerte cétonémie ; alertes
  de dose metformine par palier de DFG). Suite : **99 tests verts** + build.

### Raison

Modéliser les rappels cliniques sans détourner `options`/`exclusions`, en gardant la séparation
contenu / logique / présentation (D3). Choix de forme (champ nœud-level, `niveau` info/attention) délégué au
référent, documenté.

---

## 2026-07-23 — D16 · Sentinel moteur `toujours` (option socle systématiquement affichée)

### Décision

Nouveau sentinel de `conditions` : `["toujours"]` (aux côtés de `["default"]`, D10/D11). Une option
`["toujours"]` est **systématiquement applicable** en mode `multi-options` (soumise à ses `exclusions`),
**indépendamment** de ce que les autres options font — **orthogonale** au repli `default` : elle ne compte
pas comme un « non-default satisfait » et ne masque donc pas un éventuel repli par ailleurs. En mode
`ordered-first-match`, elle est traitée comme systématiquement satisfaite (gagne dès qu'atteinte dans
l'ordre du nœud). `priorite` reste utilisable normalement sur une option `toujours`.

**Distinction d'affichage (UI)** : le badge « Recommandée » (le plus haut niveau EBM) ne va plus
automatiquement à l'option d'index 0, mais à la **1re option qui n'est PAS un socle `toujours`** — une
option `toujours` porte un badge distinct **« Recommandation officielle (France) »**. Logique extraite en
fonction pure (`computeBadges`, `src/features/decision/lib/optionBadges.ts`) pour rester testable sans rendu
React ; `isToujoursOption` exporté par `evaluateNode.ts` pour que l'UI n'ait pas à dupliquer le sentinel.

### Motivation (bug de production, nœud B)

La metformine (socle du nœud B) était encodée `["default"]` (repli) : elle **disparaissait entièrement**
dès qu'une autre option non-default matchait (sémantique de repli, jamais conçue pour un socle systématique)
— contredisant le cadrage référent (« proposer la metformine en base en argumentant, et proposer d'autres
1res lignes en parallèle si le contexte clinique les justifie »). Signalé par un utilisateur (capture
d'écran, profil IC+ASCVD+obésité) : la metformine n'apparaissait plus du tout, seul un ajout (iSGLT2) était
affiché. `["toujours"]` corrige cela génériquement (pas seulement pour le nœud B — tout nœud `multi-options`
futur avec un socle similaire en bénéficie sans extension moteur supplémentaire).

### Portée

- Moteur + schéma + types étendus, champ toujours **optionnel** (un nœud qui n'utilise ni `toujours` ni
  `default` garde son comportement — non-régression, nœud A inchangé).
- **Nœud B v1.4** : metformine `conditions: ["toujours"]`, `priorite: 0` → toujours en tête, badge
  « Recommandation officielle » ; le badge « Recommandée » va à la 1re option d'ajout EBM la plus indiquée
  (ex. iSGLT2 en IC/rein, AR GLP-1 en athérome/obésité), qui se retrouve donc en **2e position**.
- Tests : nœuds synthétiques (`evaluateNode.p2.test.ts`) + `computeBadges` (`optionBadges.test.ts`) + trace
  complète sur le nœud B réel, incluant un test dédié reproduisant le profil exact signalé par l'utilisateur.

### Raison

Modéliser un « socle toujours présent » (schéma de contenu récurrent : traitement de fond qu'on ne retire
jamais, seulement complète) sans détourner le repli `default` (dont la sémantique — actif seulement en
l'absence d'autre option — reste utile ailleurs, notamment nœud A). Choix de forme (mot-clé `toujours`,
badge séparé plutôt qu'un double affichage « Recommandée ») délégué au référent, tranché explicitement :
la 1re option EBM la plus indiquée garde SON badge « Recommandée » propre, distinct de la reco officielle du
socle.

### Vérification bi-agent (2026-07-23, après codage — pipeline étape 8)

- **Agent A (fidélité)** : CONFORME sur les 2 correctifs (D16 + D17, vérifiés ensemble) — 121 tests, build OK,
  traces indépendantes sur le nœud B réel (profil exact signalé) confirmant metformine en tête + badges
  distincts.
- **Agent B (red-team)** : 3 findings, 0 HAUTE. **F1 (MOYENNE, corrigé)** : le sentinel brut `"toujours"`
  fuyait dans « Pourquoi cette option » (`conditionText.ts::describeReasons` traitait `["default"]` mais pas
  `["toujours"]`) — une carte affichait littéralement « Pourquoi cette option : toujours ». Corrigé
  (message explicite symétrique du cas `default`) + test dédié (`conditionText.test.ts`, module jusque-là
  non testé). **F2 (BASSE, doc corrigée)** : le docstring affirmait l'orthogonalité `toujours`/`default`
  sans la restreindre au mode `multi-options` — en `ordered-first-match`, un `toujours` placé avant un
  repli le masque bel et bien (aucun contenu réel ne combine les deux, comportement non changé). Docstring
  précisé + test verrouillant explicitement ce comportement. **F3 (BASSE, notée)** : le filet d'erreur
  n'enveloppe pas `Header`/`DisclaimerBar` (périmètre volontaire, risque jugé négligeable, header
  quasi-statique) — documenté dans `AppShell.tsx`.

---

## 2026-07-23 — D17 · Robustesse UI : filet d'erreur d'écran + formulaire critère `liste`

### Décision

Deux correctifs de robustesse de l'application, suite à un **crash de production** (écran blanc) signalé sur
le nœud C en saisissant l'âge du patient :

1. **`ScreenErrorBoundary`** (`src/features/shared/layout/ScreenErrorBoundary.tsx`) : limite d'erreur React
   enveloppant chaque écran (`AppShell`, remontée par `key` à chaque changement d'écran/nœud). Sans elle,
   toute exception de rendu (notamment une `ConditionError` volontairement non rattrapée par le moteur,
   brief §7) faisait disparaître tout l'arbre React — un écran **blanc**, muet, en production. La limite
   affiche désormais le message d'erreur et un bouton de retour, cohérent avec l'invariant « propager
   plutôt que masquer » : une erreur **visible**, jamais une page blanche.
2. **`CriteriaForm` / `buildDefaultCriteria`** (formulaire de critères, D3/S4) : ne géraient pas le type de
   critère `liste` (D13, ex. `traitements_en_cours`) — `buildDefaultCriteria` l'initialisait comme une
   **chaîne** (1re valeur de `valeurs`) au lieu d'un **tableau**, faisant lever `ConditionError` dès la 1re
   évaluation (`contient`/`ne_contient_pas` exigent un tableau, `conditions.ts`). Cause racine du crash :
   l'écran (câblé en P1 pour le nœud A) n'avait jamais été étendu pour les types ajoutés en P2. Corrigé :
   `buildDefaultCriteria` initialise `liste` à `[]` ; `CriteriaForm` rend un groupe de cases à cocher (une
   par valeur possible) pour tout critère de type `liste`, togglant l'appartenance au tableau.

### Portée

- Aucun changement moteur/schéma (le type `liste` existait déjà, D13) — uniquement l'écran de saisie.
- Tests : `CriteriaForm.test.tsx` (régression directe : `liste` → tableau, rendu en cases à cocher, reflet
  de la sélection). Le filet d'erreur n'a pas de test unitaire dédié (pas d'infra RTL/jsdom interactive dans
  le projet, cf. `MEMORY.md` feedback validation visuelle = humaine) — à valider visuellement.

### Raison

Le nœud C (`traitements_en_cours`, type `liste`) est le premier contenu réel à exercer ce type en dehors des
tests — l'écart entre contenu P2 et UI P1 n'avait jamais été détecté avant un usage réel. Le filet d'erreur
est une défense en profondeur générique (pas spécifique au nœud C) : toute future incohérence de contenu se
traduira par un message lisible, jamais par un écran mort.

---

## 2026-07-25 — D18 · Fusion des nœuds de prescription orale (B+C+D) en un nœud unique `prescription`

> **MISE À JOUR (2026-07-25, même jour) : refonte S8 « par intention ».** Après le go référent initial
> ci-dessous, le référent a demandé de repenser la saisie autour des **4 situations d'usage réelles** —
> `initier / intensifier / optimiser / déprescrire` — plutôt que le champ `position_vs_cible` (4 crans)
> décrit dans la décision d'origine. Le primer `intention` **remplace** `position_vs_cible` et déduit
> `cible_atteinte` ; `hba1c_sous_cible` (< 6,5 %) est désormais **dérivé de l'HbA1c saisie**, indépendant du
> nœud A. S8 a aussi ajouté une **palette glycémique** (iSGLT2/AR GLP-1 disponibles hors comorbidité,
> priorisés par elle, séquençage HAS ≥ 8,5 % à l'initiation), un **repli insuline** explicite, et une
> **déprescription nuancée** (réductions de dose distinctes par traitement, `nature_intolerance`). Vérifié
> par **4 agents adversariaux indépendants** (2 HAUTE trouvées et corrigées : non-association gliptine+
> incrétine rouverte par la palette, alertes de cohérence intention↔HbA1c manquantes) puis par une **passe
> ciblée sur 3 arbitrages référent supplémentaires** (séquençage, ordre iSGLT2/GLP-1, nature d'intolérance —
> 0 finding). **Conséquence sur le statut** : `content/…/prescription.yaml` est repassé **`brouillon` v0.9**
> (le `valide` v1.0 ci-dessous ne reflète plus le contenu réel) — la validation clinique référent se fera sur
> la version **déployée** (push `main` `a561b8b`, 2026-07-25). Détail :
> [`prescription.SPEC-intentions.md`](docs/decision/noeuds/prescription.SPEC-intentions.md) §7/§8 (décisions
> gelées) et `plans/P3-fusion/index.md` (S8). Le reste de cette décision (motivation de la fusion, portée
> technique, gating de terrain) reste valable tel quel.

### Décision

Les trois nœuds de prescription non-insulinique — **B (1re intention)**, **C (intensification/optimisation)**
et **D (sulfamides/gliptines)** — sont **fusionnés en un seul nœud `prescription`**, piloté par
`traitements_en_cours` (liste vide = naïf = 1re intention) et, depuis S8, le primer `intention`
(initier/intensifier/optimiser/déprescrire — *remplace le champ `position_vs_cible` d'origine, voir mise à
jour ci-dessus*). B/C/D (YAML + argumentaires de contenu) sont **retirés** ; leurs dossiers de preuve
`docs/decision/noeuds/` persistent comme sources. Nœuds A (cible), E (insuline), F (statine), H (RHD)
**inchangés**.

Motivation : le découpage naïf/déjà-traité était artificiel pour le clinicien (mêmes déclencheurs
comorbidité, même hiérarchie de molécules) et générait des incohérences d'encodage (ex. préférence
iSGLT2/GLP-1 encodée deux fois, divergente). La fusion permet d'écrire **une seule fois** le gating négatif
de terrain (IMC bas / dénutrition / infections uro / fragilité) et les portes SU/gliptine/intolérance.

Contenu nouveau intégré à la fusion (gel référent 2026-07-24, `prescription.SPEC.md`) : gating de terrain
(AR GLP-1 exclu IMC<22/dénutrition ; tirzépatide ⊂ obésité ; iSGLT2 rétrogradé si infections uro) ; portes
SU/gliptine/intolérance → switch (à/au-dessus cible) ou déprescription (< 6,5 %, à tout âge) ; refus
d'injection → injectables rétrogradés ; retrait du critère flou `sur_traitement`.

### Portée

- **Aucune modification du moteur** : tout est encodé en contenu (D13 `exclusions`/`liste`, D14 `priorite`
  conditionnelle, D15 `alertes`, critères `derive`). Le socle générique (D8) est inchangé.
- Cross-refs internes (E, H) mises à jour vers `nœud prescription`. Libellés UI ajoutés (`labels.ts`).
- **Validation** : encodage vérifié bi-agents (S4) + validation adversariale P2·S3-S7 (agent red-team
  indépendant + banc exécutable, 21 profils) → **0 finding HAUTE** ; corrections MOYENNE M1 (gating
  `classes_a_benefice_indisponibles`) et M2 (alerte A9) appliquées. **Puis S8** (voir mise à jour en tête de
  décision) : re-vérifié par 4 agents adversariaux indépendants (2 HAUTE corrigées) + passe ciblée sur les
  arbitrages référent (0 finding). État final : `content/…/prescription.yaml` **`statut: brouillon` v0.9**,
  build + typecheck + **158 tests** verts, **poussé sur `main`** (commit `a561b8b`) — validation clinique
  référent sur le déployé restante avant repromotion à `valide`.

### Raison

Modèle mental du clinicien (regarder traitement en cours + terrain + tolérance, quel que soit le stade),
suppression des coutures inter-nœuds, et écriture unique des garde-fous de terrain — la lacune la plus
visible des nœuds B/C historiques. Remplace/absorbe l'ex-« P3 — Remédiation » esquissé dans le plan P2.

### Arbitrages restants (référent, non bloquants)

~~M3 (trou de couverture obèse+dénutri sans comorbidité → sortie « poursuivre »)~~ **traité par S8** : le
patient obèse+dénutri sans comorbidité voit désormais iSGLT2 proposé (levier glycémique pur), GLP-1/tirzépatide
exclus (dénutrition), et un repli insuline si la palette non-insulinique est épuisée — sortie non muette.
Restent : présentation multi-options en double indication (redondance de menu, arbitrage de présentation, non
clinique) ; falaise du seuil `hba1c_sous_cible` (< 6,5 % strict, pas de zone tampon) — assumée par le référent
comme garde-fou binaire. Consignés dans les `incertitudes` du nœud et
`docs/decision/validation/RAPPORT-prescription-S3-S7.md` (fusion) /
`prescription.SPEC-intentions.md` §7-§8 (S8).

---

## 2026-07-25 — D19 · Grammaire de modélisation d'un nœud (R1→R6), générique tous domaines

### Décision

Six règles, énoncées **hors de tout domaine** dans `docs/decision/GRAMMAIRE-NOEUD.md`, deviennent
contraignantes pour l'écriture de n'importe quel nœud — DT2 comme domaines à venir :

- **R1** — un **état** clinique ne se déduit jamais d'une **intention** déclarée. Corollaire : quand un
  état est calculable par un autre nœud, on **pose la question** dans le nœud qui en a besoin plutôt que
  d'imposer un chaînage ; l'autre nœud reste une aide, jamais un prérequis.
- **R2** — toute option porte son **délai de bénéfice**. L'outil le pose à côté de l'horizon du patient
  et **ne conclut pas à sa place** : convertir « espérance de vie limitée » en mois produirait une fausse
  précision et un arbitrage clinique caché (invariant 2).
- **R3** — modifier un traitement existant, c'est **deux décisions** : le verdict sur la ligne (déclenché
  par sa seule présence) et le choix du remplaçant (avec ses propres garde-fous). Les exclusions du
  verdict sont structurelles, jamais celles d'une destination.
- **R4** — « écartée par une `exclusion` » (elle était indiquée, un garde-fou l'a retirée : **sécurité**,
  affichée) et « non retenue faute de `condition` » (elle n'était pas indiquée : **explication**, sur
  demande) sont deux silences distincts, qui ne se présentent pas de la même façon.
- **R5** — un critère qu'on demande doit **changer quelque chose à l'écran** pour au moins un profil du
  banc, sinon il est retiré ou rebranché.
- **R6** — l'argumentaire est **situationnel** : les critères de *ce* patient qui ont fait proposer
  l'option, jamais l'énumération de ceux qui pourraient la faire proposer.

Le banc d'un nœud cesse d'être une collection de vignettes et devient **trois couches** : vignettes
(relecture clinique, donc peu nombreuses), couverture (mécanique, aucune relecture), invariants
(validés une fois, vérifiés ensuite sur tout l'espace des profils). Sept invariants DT2 validés par le
référent le 2026-07-25.

### Portée

- `position_vs_cible` remplace la déduction de `cible_atteinte` depuis `intention` (R1) ; le seuil absolu
  `HbA1c >= 8,5 %` de `palette_glycemique_ouverte`, aveugle à l'objectif du patient, disparaît.
- Le switch d'un agent sans bénéfice dur se déclenche sur sa **seule présence** (décision référent) ; la
  comorbidité choisit désormais le remplaçant et son rang. Nouveau dérivé
  `remplacement_agent_sans_benefice`, **sulfamide seulement** à ce stade — la gliptine l'y rejoindra
  quand `ne_contient_pas gliptine` sera levé de l'option AR GLP‑1, après R4 (séquencement tranché par le
  référent : garantie structurelle conservée d'abord, dette de la recette assumée jusque-là).
- Champ `delai_benefice` (affichage seul) ; trois valeurs extraites d'`effet_attendu` déjà sourcés.
- Grammaire `derive` étendue à `contient`/`ne_contient_pas` — le schéma la déclarait déjà, à tort, comme
  un sur-ensemble de `conditions`.
- Écran et signature de pertinence unifiés sur un **modèle de vue unique** : tout ce qui est affiché
  entre dans la signature par construction.
- `BRIEF_DECISION.md` §5/§6/§7 et `00-global.md` renvoient à la grammaire au lieu de la redire ; la liste
  des « variables communes » du §6 est supprimée (elle avait divergé : quatre variables listées
  n'existaient dans aucun nœud).

### Raison

La recette référent du nœud `prescription` (2026-07-25) a produit une série de corrections qui ne
convergeait pas : chaque correctif révélait le défaut suivant. Le diagnostic, obtenu en rejouant le
profil de recette sur le moteur réel, est que **les défauts n'étaient pas des bugs d'affichage mais des
défauts de modélisation du raisonnement clinique** — donc reproductibles à l'identique dans tout nœud et
tout domaine à venir. Quatre régressions successives avaient d'ailleurs la même cause unique : deux
sous-systèmes en désaccord sur « ce qui est affiché ». La règle de discipline qui les encadrait n'a pas
tenu quatre fois ; elle devient structurelle.

---

## 2026-07-26 — D20 · Valeur indéterminée : le moteur ne se prononce jamais sur ce qu'il ignore

### Décision

Un critère non renseigné vaut **`indetermine`** — troisième état, distinct de `0`, de `false` et de la
première valeur d'énumération. Évaluation ternaire (`vrai OR indeterminé` = vrai ; `faux AND
indeterminé` = faux ; sinon indéterminé). Une option dont une `conditions`, `prerequis` ou
`exclusions` est indéterminée passe **en attente** : ni proposée, ni écartée. Une alerte, une dose
calculée ou un critère dérivé indéterminés ne s'affichent pas.

`nombre` et `enum` sont indéterminés tant qu'ils ne sont pas saisis. `bool` et `liste` gardent leur
défaut (« non », « aucun »), qui EST une réponse clinique — sauf déclaration explicite
`confirmation_requise` par le contenu, réservée aux drapeaux dont le « non » ne peut pas être présumé
sans risque.

### Contexte

Recette du 2026-07-25/26. Sur les 5 nœuds, 86 règles mentionnent un critère `nombre`/`enum` ; sur
valeur par défaut, 56 penchent vers le rassurant et 16 vers l'alarmant. Sur formulaire vierge,
`cible-glycemique` recommande la cible la plus stricte, `statine` désigne un tier sur trois champs
vides, et `prescription` **écarte la metformine** — socle du DT2 — sur un `DFG < 30` jamais saisi.
`touched` existait, mais vivait dans l'écran et ne franchissait pas la frontière du moteur.

### Alternatives envisagées

- **Statu quo + bandeau « reco provisoire »** : le palliatif existant, posé côté interface. Il n'a
  empêché aucun des cas constatés, et son compteur diverge de son marquage visuel (bandeau comptant
  tous les types, marqueur ne s'affichant que sur les `nombre`).
- **Afficher la reco en marquant la carte** « fondée sur une donnée non renseignée » : moins de
  travail d'interface, mais une reco fausse reste une reco affichée.
- **Suspendre les garde-fous sur donnée manquante** : écarté explicitement — seul choix du chantier
  pouvant produire pire que l'existant (geste contre-indiqué proposé sans réserve).

### Raison du choix

L'outil doit cesser d'affirmer ce qu'il ne sait pas, **et dans le sens rassurant et dans le sens
alarmant** — l'asymétrie constatée (le même vide lu « objectif atteint » ici et « insuffisance
rénale » là) est le cœur du défaut. Décision référent du 2026-07-26.

### Conséquences

Nouveau registre d'affichage `enAttente`, distinct de `ecartees` (sécurité, R4) et `nonRetenues`
(explication, R4) ; état d'écran « à renseigner » à concevoir. L'invariant de banc n° 2 (« jamais
`applicable` vide ») devient faux tel quel et se reformule : *jamais vide lorsque tous les critères
pertinents sont renseignés*. `touched` remonte de l'écran vers le modèle de critères, avec trois
statuts (`saisi`, `suggere`, `indetermine`) — une valeur `suggere` (heuristique d'interface non
sourcée) ne peut plus être citée comme un fait du patient. Coût de perturbation de `relevance.ts`
accru : R5 à isoler hors suite courante. Spécification complète :
`docs/decision/validation/chantier-2026-07-26/SPEC-valeur-indeterminee.md`.

### Impact IA

Une propriété testable remplace une discipline de relecture : les invariants I3-I7 du banc rendent
cette famille de défauts détectable, alors qu'elle était structurellement hors d'atteinte (le banc
engendre des profils à partir de *valeurs*, « inconnu » n'existait dans aucun espace de test).

---

## 2026-07-26 — D21 · Canal d'un fait de sécurité : exclusion, alerte d'option, ou alerte de nœud

### Décision

- le fait rend un geste **contre-indiqué** → `options[].exclusions`, affichée avec son motif (R4) ;
- le fait **qualifie** un geste sans l'interdire → `options[].alertes` ;
- le fait est vrai **quel que soit le geste retenu** → `alertes` de nœud.

Deux interdits : **`priorite` ne porte jamais un fait de sécurité** (rétrograder n'est pas retirer) ;
**une alerte de nœud n'a jamais `quand: "default"`** (elle s'affiche alors pour tout le monde, donc
pour personne).

### Contexte

La recette a relevé 6 couples où une alerte interdit ce qu'une carte prescrit — « ne pas INITIER une
statine » au-dessus de « Statine de haute intensité », « ne pas poursuivre la titration » au-dessus
de « Titrer la basale, +2 U ». Cause mécanique : les alertes de nœud sont évaluées sur les seuls
critères, jamais sur ce que le moteur a retenu. Sept lignes `incertitudes` actaient déjà ce choix
(« modélisé en alerte plutôt qu'en gate ») dans 4 nœuds.

### Raison du choix

Levée d'un malentendu sur D3 : l'invariant interdit les **scores cachés**, pas les **règles**. Une
`exclusion` sur `dialyse == true`, affichée avec son motif, est l'exact opposé d'un arbitrage caché —
c'est un arbitrage déclaré, sourcé et rendu à l'écran. Conflater « pas de gating hors EBM dur » avec
« aucun score caché » avait fait glisser des interdits de sécurité dans un canal sans pouvoir de
retrait.

### Conséquences

Portée mesurée : sur 35 alertes de nœud, 1 passe en `exclusion`, 4 en alerte d'option, 1 est bloquée
faute de critère d'entrée. Le canal alerte n'est pas à vider, il est à discipliner. **Couplage à ne
pas casser** : sur `statine`, transformer l'alerte dialyse en exclusion sans les critères de D22
viderait le nœud entier (3 options en `ordered-first-match`). Invariant de banc I7 : une alerte au
libellé prohibitif implique une `exclusion` correspondante.

---

## 2026-07-26 — D22 · Module de nœuds : préambule partagé et primer de levier

### Décision

Un **module** regroupe plusieurs nœuds d'un même domaine et peut porter : un en-tête de cadrage, un
socle de critères de terrain communs, et un **primer** orientant vers le ou les nœuds pertinents.
Champ optionnel, générique, piloté par le contenu — aucun nom de module connu du socle (invariant
CLAUDE.md 5). Premier usage : module **RHD** = nœud *alimentation* + nœud *activité physique*.

### Contexte

La refonte RHD porte le recueil à ~15 items de socle. La charge de saisie est le risque n° 1 déjà
constaté sur le nœud `insuline`. Par ailleurs `fragilite`, `esperance_vie`, `age` et
`traitements_en_cours` seraient redéclarés dans chaque nœud — exactement la duplication que
l'invariant I4 doit interdire.

### Alternatives envisagées

- **Module purement cosmétique** (regroupement dans la liste) : zéro évolution d'architecture, mais
  le praticien répond deux fois aux mêmes questions de terrain et le même concept est encodé deux fois.
- **Un nœud unique à deux volets** : impraticable en consultation (15 items d'un bloc).

### Raison du choix

Le module devient une **portée de partage** plutôt qu'un intitulé : 7-8 items par écran au lieu de
15, terrain posé une fois. Le motif du primer existe déjà dans le projet (`intention` sur
`prescription`). Décision référent du 2026-07-26.

### Conséquences

**Garde-fou R1** : le préambule est un flux d'écran commun, **jamais** un chaînage obligatoire — chaque
nœud doit rester évaluable seul, avec ses critères posés directement. Aucun impact sur `evaluateNode`
ni sur la signature de pertinence. Conception :
`docs/decision/validation/chantier-2026-07-26/CONCEPTION-module-rhd.md`.

### Réalisation (2026-07-27)

L'écran existe : `schema/module.schema.json` + `content/modules/<domaine>/*.yaml` +
`content/loadModules.ts` + `screens/DecisionModuleScreen.tsx`. Un module compte pour **une entrée** dans
la liste d'un domaine et ses nœuds ne s'ouvrent que depuis lui — sinon on entrerait dans un nœud sans
avoir vu le cadrage, et le mécanisme perdrait son objet.

**Livré** : le cadrage partagé (même champ que `Noeud.cadrage`, D24 — c'est le même objet, seule la
portée change) et le primer d'orientation. **Non livré, et c'est une décision** : le *socle de critères
de terrain partagé* qu'évoquait la décision initiale. Il suppose un état de saisie transmis d'un écran à
l'autre, c'est-à-dire exactement le chaînage que le garde-fou R1 interdit. Le tenir demanderait un
arbitrage explicite sur ce garde-fou ; en attendant, `fragilite`/`age` restent déclarés par nœud.

Le garde-fou est tenu **par un test** (« l'écran de module ne contient aucun champ de saisie ») et non
par la seule vigilance : le premier critère « qu'on saisirait bien une fois pour les deux » suffirait à
faire basculer le module en prérequis. Un second test vérifie que **chaque nœud du module est
atteignable depuis le primer** — l'écran les retirant de la liste du domaine, un nœud oublié dans les
orientations deviendrait inaccessible, en silence.

Au passage, ce lot a révélé que `module` était écrit dans le schéma et dans les deux nœuds RHD depuis la
décision, **mais absent du type TS `Noeud` et lu par aucun code** : un champ de contenu orphelin que rien
ne signalait, ni le schéma ni la suite de tests.

---

## 2026-07-26 — D23 · La position affichée s'appuie sur la donnée publiée, jamais sur la publication

### Décision

Un argument rendu au praticien s'appuie **exclusivement sur les données publiées** (essais,
méta-analyses) et leurs résultats. Le nom d'une revue secondaire — Prescrire, Médicalement Geek,
Minerva, ebmfrance — ne constitue **jamais** l'argument. Ces publications restent citables en
**référence bibliographique**, à côté de la donnée qui, elle, porte l'argument.

### Contexte

Relevé par le référent (2026-07-25) : « Prescrire et Médicalement Geek n'ont aucune valeur probante
par eux-mêmes — ce sont des publications qui interprètent des données ». Inventaire :
**56 occurrences** dans les 5 nœuds, dont **30 arguments d'autorité, 28 affichés au praticien**
(ex. `prescription.yaml:674` « Prescrire l'écarte. » dans les inconvénients d'une option).

### Raison du choix

Un outil d'aide à la décision fondé sur l'EBM ne peut pas substituer une autorité éditoriale à une
donnée. La distinction est déjà celle que le projet applique partout ailleurs (niveau de preuve,
critère dur vs substitution).

### Conséquences

Le correctif **ne peut pas être seulement rédactionnel**. `schema/noeud.schema.json` rend
obligatoires deux blocs nommés d'après des publications (`sources.prescrire`,
`sources.medicalement_geek`), et `components/ArgumentPanel.tsx` estampille « Prescrire — » /
« Médicalement Geek — » en préfixe visible quel que soit le texte : reformuler la prose laisserait
l'attribution à l'écran. Le modèle de données doit donc être réorganisé **par nature de source**, pas
par titre de publication. Inventaire et reformulations proposées :
`docs/decision/validation/chantier-2026-07-26/sourcage-position-critique.md`. Cinq occurrences sont
marquées « DONNÉE À FOURNIR » — l'argument n'y reposait que sur l'autorité de la revue.

---

## 2026-07-26 — D24 · Une position de lecture n'est pas une alerte : le champ `cadrage`

**Décision.** Un nœud peut déclarer `cadrage: string[]` — des **positions de lecture** vraies pour *tous*
ses patients, qui disent comment lire l'ensemble de ses options. Rendues en tête du nœud, **avant le
formulaire**, sans condition et dans un style délibérément neutre (`components/CadrageList.tsx`). Aucun
effet moteur : `evaluateNode` ignore le champ.

**Critère opposable pour choisir le champ** — la distinction n'est pas stylistique, elle décide du canal :

| Champ | Porte sur | A un `quand` | Peut être faux pour un patient |
| --- | --- | --- | --- |
| `alertes` (D15) | la **situation** d'un patient | oui | oui |
| `cadrage` (D24) | l'**état des preuves** du nœud | non | non |

Un énoncé vrai pour *certains* patients seulement est une alerte, jamais un cadrage. La réciproque est le
piège à surveiller : une alerte qu'on n'arrive pas à conditionner est presque toujours un cadrage qui
s'ignore.

**Pourquoi.** Deux nœuds portaient une position de nœud écrite en `alertes[].quand: "default"` —
`insuline` (« l'insuline n'a pas de bénéfice cardiovasculaire démontré, ORIGIN neutre ») et `statine`
(« la décision se grade sur le risque absolu, pas sur une cible LDL chiffrée »). D21 (interdit n°2) le
proscrit à raison : une alerte affichée pour tout le monde ne signale plus rien, se confond avec le décor,
et **dévalue par contagion les alertes réellement conditionnelles rendues juste à côté**. Mais la dette
était **insoluble tant que `alertes` restait le seul canal** : ces énoncés ne peuvent pas être rendus
conditionnels, puisqu'ils ne dépendent d'aucun critère. Le défaut n'était pas le texte, c'était le canal —
les deux textes ont été déplacés **inchangés**.

**Conséquences.** L'invariant I6 du banc (`engine/banc/invariants-contenu.test.ts`) s'applique désormais
**sans aucune exception** : tout `quand: "default"` sur une alerte de nœud fait échouer les tests. Le canal
de D21 compte donc quatre entrées, pas trois : `exclusions` (retirer), alerte d'option (le geste est sur la
table), alerte de nœud (la situation du patient), `cadrage` (l'état des preuves). Un écran de module (D22)
reste à faire : quand il existera, un cadrage partagé par les nœuds d'un module aura vocation à y monter
plutôt qu'à être répété nœud par nœud.

---

## 2026-07-27 — D25 · Rôle d'une option (`Option.role`) et plafond d'affichage par rang

### Décision

Nouveau champ **requis** sur `option` : `role: socle | securite | geste | repli`. Lu par trois
mécanismes qui, avant, devaient chacun deviner le rôle d'une carte à partir d'indices indirects
(sentinelle `toujours`, position dans la liste, présence d'alertes) : le repli d'affichage (une carte
ne se replie que si elle est un `geste` sans contre-indication ni alerte — `socle`/`securite`/`repli`
restent toujours dépliées), le badge, et « pourquoi pas d'autres options ». Au-delà de **5 pistes**
affichées (`PLAFOND_PISTES`), les gestes excédentaires passent sous « Autres pistes possibles (N) » ;
rien d'autre ne se replie jamais.

### Contexte

Recette du 2026-07-27 : un nœud à forte cardinalité de pistes (`rhd-alimentation`) pouvait afficher
jusqu'à dix cartes d'un coup à un patient chargé. Un premier plafond, posé sans connaître le rôle des
options, avait été neutralisé par précaution (rien à cette date ne garantissait qu'il ne replierait
jamais une carte de sécurité) — cf. `PLAN-CORRECTION.md`.

### Raison du choix

Décider *si* une carte peut se replier suppose de savoir ce qu'elle EST, pas seulement ce qu'elle
CONTIENT à l'instant T (une carte de sécurité peut n'avoir, pour un patient donné, ni contre-indication
ni alerte affichées — cela ne la rend pas repliable). Un champ déclaré, plutôt qu'une heuristique sur
les alertes visibles, rend la propriété vraie par construction et testable (invariants I16-I19 :
« une carte `securite` ne se replie jamais », vérifiés sur le banc, pas seulement sur les vignettes).

### Conséquences

Champ requis → les 27 options du domaine DT2 ont dû être qualifiées une à une (relecture complète,
pas d'inférence automatique). `replierAffichage.ts` reste générique (aucun nom de nœud/critère).

---

## 2026-07-27 — D26 · `visible_si` sur une valeur de `liste`

### Décision

`CritereEntree.visible_si` accepte désormais une condition portant sur l'appartenance à une `liste`
(`contient`/`ne_contient_pas`), pas seulement sur un `bool`/`enum`. Extension du DSL existant, aucun
nouvel opérateur.

### Raison du choix

Premier besoin réel : un champ de détail (ex. dose d'un traitement) qui ne doit apparaître que si ce
traitement précis a été coché dans `traitements_en_cours`. Sans l'extension, le contenu aurait dû soit
dupliquer le critère en `bool` (violation I4, « un concept, un encodage »), soit renoncer à masquer le
champ. Générique : sert tout futur nœud où un critère `liste` conditionne l'affichage d'un autre champ.

---

## 2026-07-27 — D27 · Contraintes de saisie déclaratives sur un nœud

### Décision

Nouveau champ optionnel `Noeud.contraintes` : liste de `{ expression, message }`, DSL identique aux
autres conditions. Contrairement à `alertes` (D15, informe sur un patient réel) et `exclusions` (D13,
retire une option), une **contrainte** signale une combinaison de critères **incohérente en tant que
saisie** — ex. « une situation d'insulinothérapie "naïf" et une insuline déjà cochée dans les
traitements en cours ne peuvent pas être vraies ensemble ». Le générateur de banc (`profils.ts`) filtre
désormais les profils synthétiques qui violent une contrainte du nœud (`filtrerParContraintes`), avec
sur-génération (`FACTEUR_SURGENERATION = 3`) pour compenser le rejet plutôt que de réduire la taille
du banc.

### Contexte

Sans ce filtre, les profils *frozen* (fixtures gelées, `geler-profils.maintenance.test.ts`) pouvaient
figer une combinaison de critères impossible en pratique et, à la faveur d'une évolution du contenu,
perdre leur dernière option applicable — l'écran d'un patient qui ne peut pas exister aurait affiché
une page vide, faussement comptée comme un trou de couverture clinique réel.

### Conséquences

`reparerFixtureProfils` remplace, dans une fixture gelée, uniquement les profils devenus invalides —
jamais la fixture entière (préserve la reproductibilité des autres profils, `banc/geler-profils`).

---

## 2026-07-27 — D28 · Mémoire de session inter-nœuds (amende l'invariant CLAUDE.md 1)

### Décision

**Amende l'invariant CLAUDE.md 1** (« aucune persistance, aucun réseau » côté Décision) : une **mémoire
de session en mémoire vive** (`lib/sessionCriteres.ts`, une `Map` de module) est autorisée pour
reprendre, d'un nœud à l'autre de la même consultation, les valeurs qu'un critère déclaré `partage:
true` a **saisies** — jamais une conclusion du moteur. Trois garanties : (1) seule une valeur
**touchée** par le praticien est mémorisée (une valeur par défaut n'est pas une réponse, D20/R7) ; (2)
un critère `derive` n'est **jamais** mémorisé (ce serait faire circuler une conclusion, pas une saisie
— rouvrirait R1) ; (3) la reprise est **pré-remplie, jamais imposée**, et **compatible avec le
récepteur** (mêmes bornes/type/énumération — `valeurCompatible`), sinon silencieusement ignorée. Vidée
intégralement au rechargement de la page.

### Contexte

Chaque nœud est monté à neuf (remontage React par `key`) : sans ce mécanisme, un praticien ressaisit
l'HbA1c, l'âge, le DFG à chaque écran d'une même consultation. Le référent a tranché explicitement :
*« on peut garder une persistance par session — un reload de la page reset tout »*. Complète, sur un
périmètre restreint et sûr, le *socle de critères de terrain partagé* qu'évoquait D22 sans le livrer
(le chaînage obligatoire qu'il aurait supposé restait interdit par R1 — cette mémoire n'enchaîne rien,
elle pré-remplit un champ qui reste un formulaire normal, modifiable, jamais lu par le moteur d'un
autre nœud comme un prérequis).

### Raison du choix

« Aucune persistance » protège contre une donnée patient qui **survit** à la consultation (disque,
réseau, `localStorage`) — c'est le risque nommé par l'invariant. Une `Map` de module, vidée au
rechargement, n'a jamais cette propriété : elle ne survit même pas à un F5. La distinguer de ce que
l'invariant interdit réellement évite de renoncer à une ergonomie réclamée par le seul référent
clinique du projet, pour un risque qui ne se pose pas.

### Conséquences

`CritereEntree.partage` déclaré nœud par nœud (jamais deviné par le socle générique — D8) ; un premier
lot de critères communs (`HbA1c_actuelle`, `HbA1c_cible`, `DFG`…) le porte. `preremplissage` (règles
`{quand, valeur}` sur un critère saisi) est le mécanisme frère, pour dériver un point de départ depuis
un AUTRE critère du même nœud plutôt que depuis la session — les deux se distinguent à l'écran (« repris
de votre saisie » vs « calculé, à vérifier »).

---

## 2026-07-27 — D29 · Tout identifiant de contenu affiché a un libellé rédigé (invariant I20)

### Décision

Tout critère d'entrée et toute valeur d'énumération d'un nœud **publié** doit avoir un libellé rédigé
dans `lib/labels.ts` (`libelleCritereCatalogue`/`libelleValeurCatalogue`, vérifié par
`banc/libelles.test.ts`, invariant I20). Le repli mécanique `humanize()` (retire `_`/`-`, majuscule
initiale, sans accent) reste en place pour le runtime, mais cesse d'être une sortie acceptable pour du
contenu publié.

### Contexte

Les deux nœuds du module RHD sont arrivés en recette avec **zéro** de leurs 29 critères catalogué :
l'écran affichait « Frequence boissons sucrees », « Retinopathie non stabilisee ou proliferante ».
Rien n'échouait — le repli réussit toujours (`?? humanize(nom)`) — donc rien ne l'avait signalé avant
une relecture à l'œil.

### Raison du choix

Une propriété testable plutôt qu'une discipline de relecture (même logique que D20/I3-I7) : un
dictionnaire de libellés peut grossir en silence à chaque nœud ajouté, `humanize()` masque l'oubli en
produisant toujours quelque chose de lisible-mais-faux (sans accent). Le test associé (I20bis) dénombre
en plus les clés que plus aucun nœud ne déclare, sous un plafond mesuré (pas estimé) qui ne peut que
descendre — garde-fou contre un dictionnaire qui se remplirait de libellés morts sans jamais être faux
sur le critère principal.

---

## 2026-07-28 — D30 · Un critère non répondu est indéterminé, quel que soit son type (amende D20)

### Décision

Un critère `bool`/`liste` non renseigné vaut désormais **`indéterminé`**, au même titre que
`nombre`/`enum` — plus de présomption implicite « non »/« aucun ». Le champ de contenu qui portait
l'exception s'appelle désormais **`presomption_non`** (renommé depuis `confirmation_requise`, **sens
inversé**) : `presomption_non: true` est l'exception explicite qui rend un `bool`/`liste` déterminé par
son défaut tant qu'il n'est pas renseigné — réservée aux critères qui ne participent à **aucune**
condition, `exclusions` ou `prerequis` d'une option `role: securite` du nœud. Absent ou `false` = le
critère reste indéterminé jusqu'à saisie, comme un `nombre`/`enum`.

`critereEstDetermine` (`src/features/decision/engine/deriveCritere.ts`) porte la règle ; l'écran
(`decisifsAConfirmer`, `src/features/decision/lib/formLayout.ts`) a été réaligné sur la **même** fonction
moteur (`determinesEffectifs`) au lieu de son propre filtre `!touched.has(nom)`, pour que le marqueur
« à confirmer » et le compteur de critères non confirmés ne puissent plus diverger de ce que le moteur
tient réellement pour répondu.

La liste des critères éligibles à `presomption_non` a été établie **mécaniquement** (parcours des
`conditions`/`exclusions`/`prerequis`/`quand` d'alerte de chaque nœud), pas à la main : les critères qui
portaient déjà `confirmation_requise: true` (5 sur `rhd-activite-physique`, 2 sur `rhd-alimentation`, 3
sur `statine`) n'ont **jamais** reçu `presomption_non` — ils restent indéterminés.

### Contexte

Recette navigateur du 2026-07-28 : formulaire **entièrement vierge** sur `rhd-activite-physique` →
quatre cartes « Recommandée » justifiées par « Interrompt habituellement les longues périodes assises :
non » et « Offre d'activité de proximité connue : non » (D-01) ; sur `cible-glycemique`, une cible
~6,5 % justifiée par « Antécédent cardiovasculaire : non et Comorbidité grave : non et Fragilité : non »,
les trois marqués « · à confirmer » **dans la même page** (D-02). D20 posait l'inverse (« `bool`/`liste`
restent déterminés par défaut, sauf `confirmation_requise` ») : la recette a montré que ce défaut,
présenté comme rassurant côté contenu, produisait exactement le symptôme que D20 avait été écrite pour
éliminer côté `nombre`/`enum`.

### Raison du choix

La forme du défaut n'est pas propre à `nombre`/`enum` : c'est « le moteur affirme sur une donnée qu'il
n'a jamais reçue », quel que soit le type porteur. Traiter les deux familles de types différemment
n'avait jamais été un choix clinique, seulement l'état du schéma au moment de D20. Arbitrage référent du
2026-07-28.

### Conséquences

- Saisie allongée : un praticien qui laisse un drapeau vide ne bloque plus une seule option, il bloque
  **toutes** celles qui le lisent — le geste « Rien à signaler » (répond en un clic à toute une section)
  devient donc structurant, pas cosmétique.
- Nouvel invariant de banc **I21** (`engine/banc/vierge.test.ts`) : sur tout nœud publié, un profil
  entièrement vide ne produit **aucune** option `applicable`.
- **Dette ouverte, nommée, non résolue par ce plan.** Sur le nœud `prescription`, deux critères
  (`traitements_en_cours`, `intolerance_traitement`) sont masqués par `visible_si: "intention !=
  initier"` et n'ont **pas pu** recevoir `presomption_non` (ils gardent de vraies conditions
  `role: securite`/`exclusions` ailleurs sur le même nœud) — masqués, ils sont donc devenus indéterminés
  pour un patient `initier`, faisant partir en attente une vingtaine d'options qui n'ont, par
  construction, aucun objet pour un naïf. P4/S9 (T-031) a répété le garde `intention != initier` (motif
  R8) sur toutes les citations **positives** des deux critères — suffisant pour clore `intolerance_
  traitement` en entier. Le même geste reste **impuissant** sur les citations **négatives** de
  `traitements_en_cours` (`ne_contient_pas X`, garde-fous de non-duplication sur 8 options d'ajout :
  Insuline d'initiation, Introduire un iSGLT2/un AR GLP‑1/le tirzépatide, Association, Envisager
  l'insuline, Gliptine/Sulfamide place résiduelle) : y répéter le même garde en `AND` **exclurait à
  tort** ces options pour tout patient `initier` — régression confirmée sur le banc (I2′, profils
  #227/#763/#1230). Tracée dans `engine/banc/impasse.test.ts` (`IMPASSES_CONNUES_T018`) et
  `engine/banc/invariants-contenu.test.ts` (`VIOLATIONS_R8_CONNUES_T018`), à revoir avec le référent :
  soit revenir sur l'exclusion de `traitements_en_cours` de `presomption_non` sur ce nœud, soit une
  évolution du DSL vers un garde de polarité inverse.

---

## 2026-07-28 — D31 · Une contrainte de saisie est opposable au rendu (complète D27)

### Décision

Quand `contraintesViolees` (D27) n'est pas vide pour le formulaire courant, l'écran de nœud
(`src/features/decision/screens/DecisionNodeScreen.tsx`) ne rend **plus** ni les options applicables, ni
les options écartées/non retenues, ni le bloc « en attente » : un bloc unique
(`decision-node__contrainte-suspension`, `role="alert"`, registre visuel des faits de sécurité) porte le
ou les messages de contrainte violée, avec les libellés rédigés des critères en cause (I20). Les alertes
de **nœud** (D15, faits de sécurité indépendants du geste retenu) restent, elles, affichées **au-dessus**
du bloc de suspension : suspendre les résultats ne fait jamais disparaître un fait de sécurité qui aurait
dû rester.

### Contexte

D27 (2026-07-27) avait introduit `Noeud.contraintes` comme signalement d'une combinaison de critères
incohérente **en tant que saisie**, mais son seul effet observable était le filtrage des profils
synthétiques du banc (`filtrerParContraintes`) — jamais branché sur l'écran réel. Recette du 2026-07-28
(D-04) : sur `insuline`, TBR = 1 et TBR sévère = 95, le message d'impossibilité s'affichait correctement
(bandeau ambre en tête de `CriteriaForm`) et **trois cartes « Recommandée » subsistaient**, dont
« Corriger l'hypoglycémie (réduire la dose) » et « Ajouter un bolus au repas principal » **en même
temps** — réduire et intensifier sur une saisie que l'outil venait de déclarer impossible. Second défaut
mesuré par la même recette : le message s'affichait 848 px au-dessus du champ fautif (D-15), poussant
tout le formulaire de 60 px à son apparition.

### Raison du choix

C'est la forme générale décrite par ce plan : deux couches croient des choses différentes, et la plus
affirmative gagne à l'écran — ici, « cette saisie est incohérente » (le bandeau) contre « voici trois
gestes à faire » (le panneau de résultats, juste en dessous). Rendre la contrainte opposable au rendu,
plutôt que parallèle, ferme l'écart au lieu de l'habiller.

### Conséquences

- L'ancrage vers le champ fautif reste un **nom en clair**, pas un lien cliquable : aucun champ de
  `CriteriaForm` ne porte d'`id` HTML aujourd'hui, et la session s'est arrêtée là plutôt que de
  construire un mécanisme de navigation — limite notée explicitement, pas un oubli.
- Le bandeau que `CriteriaForm` affichait en tête de formulaire (848 px au-dessus du champ, D-15) est
  retiré : une contrainte violée n'est plus rendue qu'**une seule fois**, à la place du panneau de
  résultats.
- Un nœud dont plusieurs contraintes sont violées à la fois affiche un item par contrainte, dans le même
  bloc.

---

## 2026-07-28 — D32 · En `ordered-first-match`, la halte sur indéterminé n'atteint pas les options `role: securite` (amende D11)

### Décision

Dans `evaluateOrderedFirstMatch` (`src/features/decision/engine/evaluateNode.ts`), quand une option
rencontrée dans l'ordre du nœud est **indéterminée** (`conditions`/`prerequis`/`exclusions`), le
parcours mémorise la halte (le nœud reste `enAttente` sur cette option) mais **n'arrête plus**
l'évaluation : il continue, en ne considérant plus, parmi les options restantes, que celles portant
**`role: securite`** (D25) — le repli `default` y compris, lui-même retesté seulement s'il porte ce
rôle. Toute option **ordinaire** placée après une halte reste hors d'atteinte, sans être évaluée ni
tracée : l'ordre du nœud continue de faire foi (D11) en dehors du filet de sécurité. Si une option de
sécurité matche après la halte, elle est retenue **et** la halte reste rapportée dans `enAttente` :
l'écran peut dire à la fois « voici le filet » et « la décision principale reste suspendue à tels
critères ».

Cette décision lève la réserve que portait la docstring de `evaluateOrderedFirstMatch` (« ce choix n'est
pas explicitement tranché par la spec ») : il l'est désormais, explicitement, par D32.

### Contexte

Recette du 2026-07-28 (D-03) : nœud `statine`, patient en prévention **secondaire** (maladie
cardiovasculaire athéromateuse établie), intolérance **avérée**, statine jamais en place, deux critères
non renseignés (`anciennete_diabete_annees`, `autres_FDRCV`). Le parcours atteignait « Discuter la
statine (décision partagée) », dont les conditions testaient ces deux critères → indéterminé → **halte**
→ écran muet. La carte suivante dans l'ordre, « Statine indisponible — alternatives hypolipémiantes »
(`role: securite`), aurait matché sur `intolerance_statine == averee` et couvrait déjà ce patient : le
seul patient à qui l'outil ne disait **rien du tout** était celui pour qui la question était la plus
urgente.

### Raison du choix

La halte reste nécessaire : elle empêche de retenir une option plus loin dans l'ordre alors qu'une
option antérieure était peut-être la bonne, ce que D20 interdit (sauter un indéterminé pour en retenir
un autre reviendrait à décider tacitement qu'il ne matche pas). Mais un fait de sécurité ne se négocie
pas contre une indétermination plus tôt dans l'ordre — même principe que D25 (« un `role: securite` est
à faire d'emblée, jamais replié ni plafonné »), appliqué ici à la halte plutôt qu'à l'affichage.

### Conséquences

- Nouveaux invariants de banc **I22** (`engine/banc/securite-atteignable.test.ts` : aucune option
  `role: securite` d'un nœud publié n'est rendue inatteignable par l'ordre du nœud) et **I23** (même
  fichier : jamais `applicable` vide **et** `enAttente` vide en même temps, sur aucun nœud publié).
- `enAttente` peut désormais porter **plusieurs** entrées en `ordered-first-match` (une par halte
  rencontrée), alors qu'une seule était possible avant cette décision.
- Aucun contenu clinique modifié : le défaut était dans le moteur, pas dans l'ordre ni les conditions de
  `statine`.

---

## 2026-07-28 — D33 · La mémoire de session a un geste de sortie (complète D28)

### Décision

Un bouton **« Nouveau patient »** (`src/features/shared/layout/Header.tsx`), placé à droite de la barre,
hors du chemin de lecture clinique, purge explicitement la mémoire de session (`reinitialiserSession()`,
`src/features/decision/lib/sessionCriteres.ts`) et force le remontage de tous les écrans montés par
`key` — y compris **sans** changer de nœud, pour que rouvrir le même nœud reparte vierge. Confirmation
(`window.confirm`) avant purge : le geste est destructif et à portée d'un clic parasite en consultation.
Orchestré par `App.tsx`, seul composant qui connaît à la fois `sessionCriteres.ts` et le mécanisme de
remontage par `key` (D28) — via un compteur `resetEpoch` injecté dans chaque `key` d'écran, jamais lu
pour sa valeur.

**Ce que ce n'est pas** : ni une purge implicite au retour à l'accueil, ni au changement de nœud.
L'accueil reste le trajet normal **à l'intérieur** d'une même consultation (D9 : pas de navigation
directe d'un nœud à l'autre) — y purger détruirait exactement ce que D28 sert à préserver (reprendre
l'HbA1c ou le DFG d'un nœud à l'autre du même patient).

### Contexte

Recette du 2026-07-28 (D-13) : après une vignette (HbA1c actuelle 8,4 / cible 7), l'ouverture d'un nœud
pour un **autre** patient pré-remplissait « HbA1c cible · repris de votre saisie » à 7, et cette valeur
entrait dans le raisonnement affiché (« Proposé parce que : … HbA1c à la cible : non »). Aucun bouton de
sortie n'existait : seul un rechargement complet (F5), que rien à l'écran ne mentionne, vidait la
mémoire. C'est le seul défaut de la recette capable de faire raisonner l'outil sur les données d'un
autre patient.

### Raison du choix

D28 est respectée à la lettre par le mécanisme lui-même (aucune valeur ne survit à un F5) : le trou
n'était pas dans la mémoire de session, il était dans l'**absence de geste de fin de consultation** qui
la vide **sans** recharger la page. Un bouton explicite, plutôt qu'une purge automatique à un point de
navigation existant, évite de réinterpréter silencieusement un trajet (l'accueil) qui a déjà un autre
sens établi (D9).

### Conséquences

- `sessionCriteres.ts` expose une fonction de purge triviale (vide la `Map` de module, aucun événement,
  aucun abonnement).
- Aucune nouvelle persistance introduite (`localStorage`/réseau toujours absents, invariant `CLAUDE.md`
  1 inchangé) : le bouton vide une mémoire déjà volatile, il n'en crée pas de nouvelle.
- Un nœud ré-ouvert après purge n'affiche plus aucune mention « · repris de votre saisie » — vérifié par
  test.

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
