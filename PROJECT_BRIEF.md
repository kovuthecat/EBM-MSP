# PROJECT_BRIEF.md — ebm-msp

Plateforme evidence-based pour les praticiens de la MSP, à **deux modules frères** partageant
la même base de code, la même taxonomie de thèmes et un pont article ↔ nœud de décision.

Briefs sources (référence complète, autorité du contenu) :
`docs/decision/BRIEF_DECISION.md` · `docs/veille/BRIEF_VEILLE.md` ·
`docs/veille/GRILLE_APPRECIATION.md` · `docs/veille/SOP_veille.md`.

## Objectif du projet

Outiller les soignants de la MSP avec (1) une **aide à la décision clinique** interrogeable par
critères, dans une approche *evidence-based critique* (reco officielle affichée à côté de la position
raisonnée, divergences signalées, niveau de preuve transparent), et (2) une **veille scientifique
hebdomadaire** critique, classée par thème et par profession, dont les items pertinents alimentent
les algorithmes de décision **après validation humaine**.

Le module Décision est **générique et multi-domaine par conception** : le moteur ne connaît aucun
domaine clinique par son nom, chaque nœud porte un champ `domaine`, et de **nouveaux domaines** (CV,
BPCO, gériatrie/déprescription, prévention… — la taxonomie partagée les liste déjà) viendront
s'ajouter au fil des phases sans retoucher le moteur. **Le diabète de type 2 de l'adulte est le
premier domaine** (celui qui amorce et valide le socle), pas le seul.

## Usage prévu

- Usage personnel : non (outil collectif MSP)
- Usage local : non
- Déploiement prévu : oui — **déployé** (ebm-msp.vercel.app), module Décision utilisé en consultation
- Utilisateurs autres que moi : oui (praticiens MSP : MG, IPA, sage-femme, orthophoniste, IDEL)

## Fonctionnalités MVP

1. **Module Décision** — moteur de règles déterministe **générique** (multi-domaine) : saisie de
   critères cliniques → options applicables (avantages/inconvénients, niveau de preuve, effet
   absolu/NNT, posologie conditionnelle au patient) ; argumentaire à 3 niveaux de lecture (reco
   officielle vs position critique, drapeau de divergence, sources primaires seules à l'écran) ;
   alertes de sécurité ; date de revue + disclaimer. Mémoire de session volatile pré-remplissant
   les critères partagés d'un nœud à l'autre (D28). **Premier domaine = DT2** : 6 nœuds
   (`cible-glycemique`, `prescription` — fusion B+C+D, `insuline`, `statine`, `rhd-alimentation`,
   `rhd-activite-physique` regroupés en module RHD) ; nœud aspirine retiré (pas d'algorithme à
   construire).
2. **Contenu versionné** — un fichier YAML par nœud (`/content/decision/noeuds`, + argumentaire
   exhaustif `.md`), par module et par jeu de critères communs de domaine (D54), validé par **JSON
   Schema** (`/schema/decision`) ; une entrée de veille par YAML (`/content/veille/<semaine>`), typée
   mais sans schéma gelé à ce jour. Séparation stricte contenu / logique / présentation ; banc de
   non-régression du contenu (vignettes, couverture, invariants, relation).
3. **Module Veille** — flux filtrable (thème, profession, niveau d'impact, route brève/analyse), trié
   par date (défaut), temps de lecture, niveau de preuve ou impact ; badge impact pratique/informatif ;
   durée de lecture affichée ; bandeau « non relu par un référent de profession » (D61). Le lien article →
   nœud impacté est porté par le contenu (`impact_algorithme`), pas encore affiché.
4. **Comptes MSP (veille)** — mêmes comptes et même instance Supabase UE qu'`annuaire-msp` (D51) :
   garder/masquer une entrée (onglet « Ma bibliothèque », D62), retours utilisateur avec capture
   d'écran et écran référent « Retours », édition référent d'une entrée par surcouche Supabase, jamais
   le YAML (D64). Aucune donnée patient.
5. **Workflow d'intégration tracé** — une entrée de veille peut *proposer* un diff sur un nœud ;
   un humain *valide* ; application versionnée + changelog. **Jamais** de mise à jour automatique.

## Hors périmètre v1

- **Domaine DT2, v1** : exclut DT1, grossesse, complications aiguës, pied diabétique (bornes du
  premier domaine, pas de l'outil).
- **Autres domaines de décision** (CV, BPCO, gériatrie, prévention…) : *pas dans la v1* mais **prévus**
  — le moteur est construit générique pour les accueillir (voir Vision). Ce ne sont pas des exclusions
  définitives, ce sont les phases suivantes.
- **Veille** : taxonomie de 14 thèmes ; production sur 12 (9 thèmes MG + pédiatrie, orthophonie,
  santé-femme-périnatalité — D40, D60, D61, D63). `soins-infirmiers` et `ETP` restent au modèle de
  données sans production.
- Collecte automatisée (PubMed E-utilities, Europe PMC, GitHub Action) — infra Phase 4 (D7) ; la
  collecte passe par une boîte mail dédiée (newsletters + RSS), triée à la main.
- Toute logique de ML / score caché : proscrit par conception (moteur déterministe uniquement).

## Stack technique

- Frontend : **Vite + React + TypeScript**, tests **Vitest** ; navigation sans routeur, YAML importé
  au build (plugin Vite), validation Ajv (D9).
- Backend : **Supabase (UE)** — uniquement le module Veille (comptes, états garder/masquer, retours,
  surcouche d'édition référent). Le module Décision est **100 % statique, sans backend, sans
  persistance** (mémoire de session en RAM seulement, D28).
- Base de données : Supabase (Postgres UE), **instance partagée avec `annuaire-msp`** (tables
  préfixées `veille_`/`ebm_`, D51) ; le contenu clinique vit en **YAML versionné git**, compilé en JSON
  pour le runtime.
- Authentification : Supabase Auth par e-mail + mot de passe, comptes communs à `annuaire-msp`,
  connexion par choix du prénom (D51).
- Hébergement : statique (Vercel) + Supabase UE ; versioning git, publication par pull request.
- Autres services : dépendances runtime `@supabase/supabase-js` et `html2canvas` (retours), seules
  exceptions à la pile figée (D51) ; aucun ML, aucune analyse côté serveur du contenu.

## Contraintes et priorités

- **Transparence du niveau de preuve** et des sources sur chaque proposition ; reco officielle et
  position critique côte à côte ; divergence signalée ; l'écran ne cite que des sources primaires (D48).
- **Zéro donnée patient stockée** ; saisie du module Décision volatile (RGPD allégé).
- **Logique déterministe et auditable** : chaque nœud daté, versionné, changelog ; aucune mise à jour
  d'algorithme automatique et silencieuse.
- **Droit d'auteur** (veille) : résumé critique + lien, jamais de reproduction intégrale (Prescrire,
  journaux) ; pas de contournement de paywall.
- **Vérification bi-agents** + relecture différée à J+3 par le référent (D39), tri-agents sur
  orthophonie/santé-femme faute de référent de profession (D61) = process de *production de contenu*,
  pas une feature runtime de l'app — documenté dans `docs/veille/`.

## Risques connus

- **Statut de dispositif médical (MDR, règlement UE 2017/745)** : vérification toujours ouverte, alors
  que l'outil est déjà en ligne (le couplage veille → algorithme peut l'impliquer).
- Charge de veille hebdomadaire élevée — une seule édition publiée à ce jour (`2026-W33`).
- Exactitude clinique : contenu sourcé, en cas de doute signaler plutôt qu'inventer ; toute sortie IA
  re-vérifiée sur la source primaire (l'IA hallucine des DOI et des chiffres). 4 nœuds DT2 sur 6
  restent en `brouillon` en attendant la relecture référent finale.
- Référent unique (MG) : les analyses orthophonie/santé-femme ne sont pas relues sur le fond clinique.
- Couplage à `annuaire-msp` : liste des membres copiée dans les deux dépôts, migrations SQL exécutées
  à la main dans Supabase Studio.

---

## Roadmap / jalons

### Vision

Un outil MSP fiable et auditable qui rend visible *le niveau de preuve et ses limites*, distingue
critère dur et critère de substitution, et fait vivre les algorithmes au rythme d'une veille critique
— sans jamais qu'une donnée nouvelle ne modifie un algorithme sans décision humaine tracée.
À terme, une **bibliothèque de domaines de décision** (DT2 d'abord, puis CV, BPCO, gériatrie,
prévention…) servie par un moteur générique unique et une veille commune — le DT2 valide le socle.

### MVP (Phase 1)

- [x] Schéma de données (JSON Schema nœud) + moteur de règles TS pur testé
- [x] UI module Décision (saisie critères → options → argumentaire dépliable)
- [x] Nœud A « Cible glycémique » complet comme preuve de concept

### Version 1 (Phases 2–3)

- [x] Nœuds B→H du DT2 (`prescription` = B+C+D, `insuline`, `statine`, module RHD ; aspirine retiré)
- [ ] Validation clinique référent finale des nœuds DT2 (passage à `statut: valide`)
- [x] Module Veille : modèle d'entrée, page filtrable, comptes Supabase partagés avec `annuaire-msp`
- [ ] Module Veille : schéma d'entrée gelé (JSON Schema), pont affiché veille ↔ nœud
- [ ] Workflow d'intégration veille → nœud exercé de bout en bout (3 propositions `candidate`, aucune
      appliquée)

### Version 2 / idées futures (Phases 4+)

- [ ] **Nouveaux domaines de décision** au-delà du DT2 (CV, BPCO, gériatrie/déprescription,
      prévention…) — un domaine = un jeu de nœuds YAML, sans modifier le moteur
- [ ] Collecte automatisée (PubMed/Europe PMC/RSS + GitHub Action hebdomadaire)
- [x] Veille étendue à l'orthophonie et à la santé-femme-périnatalité (D60, D61) et à la pédiatrie (D63)
- [ ] Veille : production `soins-infirmiers` (IDEL) et `ETP`
- [x] Mise en ligne (Vercel) du module Décision
- [ ] Pilote praticiens + itération, cadence de maintenance

### Critères avant ajout de feature

- complexité et coût de maintenance proportionnés ;
- découpage en tâches ciblées sans refactor global ;
- documentation claire dans `PROJECT_MAP.md`.

### À éviter pour l'instant

- Élargir la décision au-delà du DT2 avant que le socle (moteur + nœud A) soit stable.
- Automatiser la collecte avant que le pipeline manuel de veille soit rodé.
- Toute persistance dans le module Décision.
