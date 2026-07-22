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
- Déploiement prévu : oui (statique + Supabase UE pour la veille)
- Utilisateurs autres que moi : oui (praticiens MSP : MG, IPA, sage-femme, orthophoniste, IDEL)

## Fonctionnalités MVP

1. **Module Décision** — moteur de règles déterministe **générique** (multi-domaine) : saisie de
   critères cliniques → options applicables (avantages/inconvénients, niveau de preuve, effet
   absolu/NNT) ; argumentaire dépliable (reco officielle vs position critique, drapeau de divergence) ;
   date de revue + disclaimer. **Premier domaine = DT2** ; PoC = nœud A « Cible glycémique », puis
   nœuds B→H du DT2.
2. **Contenu versionné** — un fichier YAML par nœud (`/content/noeuds`) et par entrée de veille
   (`/content/veille`), validé par **JSON Schema** (`/schema`). Séparation stricte contenu / logique /
   présentation.
3. **Module Veille** — page chronologique filtrable (thème, profession, niveau d'impact, semaine,
   niveau de preuve) ; badge impact pratique/informatif ; temps de lecture ; lien article → nœud impacté.
4. **Comptes légers (veille)** — auth + profil (profession) + « pour mémoire » (ids d'articles), via
   Supabase UE, données personnelles minimisées (aucune donnée patient).
5. **Workflow d'intégration tracé** — une entrée de veille peut *proposer* un diff sur un nœud ;
   un humain *valide* ; application versionnée + changelog. **Jamais** de mise à jour automatique.

## Hors périmètre v1

- **Domaine DT2, v1** : exclut DT1, grossesse, complications aiguës, pied diabétique (bornes du
  premier domaine, pas de l'outil).
- **Autres domaines de décision** (CV, BPCO, gériatrie, prévention…) : *pas dans la v1* mais **prévus**
  — le moteur est construit générique pour les accueillir (voir Vision). Ce ne sont pas des exclusions
  définitives, ce sont les phases suivantes.
- La **veille**, elle, couvre tous les profils/thèmes dès le départ (contenu montant en charge
  progressivement).
- Collecte automatisée (PubMed E-utilities, Europe PMC, RSS, GitHub Action) — infra Phase 4.
- Toute logique de ML / score caché : proscrit par conception (moteur déterministe uniquement).

## Stack technique

- Frontend : **Vite + React + TypeScript** (comme ETP interactif / annuaire-msp), tests **Vitest**.
- Backend : **Supabase (UE)** — uniquement le module Veille (auth + données utilisateur). Le module
  Décision est **100 % statique, sans backend, sans persistance**.
- Base de données : Supabase (Postgres UE) pour les comptes ; le contenu clinique vit en **YAML
  versionné git**, compilé en JSON pour le runtime.
- Authentification : à trancher (magic link vs e-mail+mot de passe — reco magic link + liste blanche
  MSP) → `DECISIONS.md`.
- Hébergement : statique (Vercel) + Supabase UE ; versioning git, publication par pull request.
- Autres services : aucun ML, aucune analyse côté serveur du contenu.

## Contraintes et priorités

- **Transparence du niveau de preuve** et des sources sur chaque proposition ; reco officielle et
  position critique côte à côte ; divergence signalée.
- **Zéro donnée patient stockée** ; saisie du module Décision volatile (RGPD allégé).
- **Logique déterministe et auditable** : chaque nœud daté, versionné, changelog ; aucune mise à jour
  d'algorithme automatique et silencieuse.
- **Droit d'auteur** (veille) : résumé critique + lien, jamais de reproduction intégrale (Prescrire,
  journaux) ; pas de contournement de paywall.
- **Vérification bi-agents** = process de *production de contenu* (double lecture automatisée par Claude
  Code), pas une feature runtime de l'app — documenté dans `docs/veille/`.

## Risques connus

- **Statut de dispositif médical (MDR, règlement UE 2017/745)** : à faire vérifier avant mise en ligne
  (le couplage veille → algorithme peut l'impliquer).
- Charge de veille hebdomadaire élevée (tous profils) — atténuée par la montée en charge progressive.
- Exactitude clinique : contenu sourcé, en cas de doute signaler plutôt qu'inventer ; toute sortie IA
  re-vérifiée sur la source primaire (l'IA hallucine des DOI et des chiffres).

---

## Roadmap / jalons

### Vision

Un outil MSP fiable et auditable qui rend visible *le niveau de preuve et ses limites*, distingue
critère dur et critère de substitution, et fait vivre les algorithmes au rythme d'une veille critique
— sans jamais qu'une donnée nouvelle ne modifie un algorithme sans décision humaine tracée.
À terme, une **bibliothèque de domaines de décision** (DT2 d'abord, puis CV, BPCO, gériatrie,
prévention…) servie par un moteur générique unique et une veille commune — le DT2 valide le socle.

### MVP (Phase 1)

- [ ] Schéma de données (JSON Schema nœud + veille) + moteur de règles TS pur testé
- [ ] UI module Décision (saisie critères → options → argumentaire dépliable)
- [ ] Nœud A « Cible glycémique » complet comme preuve de concept

### Version 1 (Phases 2–3)

- [ ] Nœuds B→H (1re intention, intensification, sulfamides/gliptines, insuline, statine, aspirine, RHD)
- [ ] Module Veille : modèle d'entrée, page filtrable, comptes Supabase, workflow d'intégration veille→nœud

### Version 2 / idées futures (Phases 4+)

- [ ] **Nouveaux domaines de décision** au-delà du DT2 (CV, BPCO, gériatrie/déprescription,
      prévention…) — un domaine = un jeu de nœuds YAML, sans modifier le moteur
- [ ] Collecte automatisée (PubMed/Europe PMC/RSS + GitHub Action hebdomadaire)
- [ ] Extension des profils de veille (sage-femme / orthophoniste / IDEL étoffés)
- [ ] Pilote praticiens + itération, puis mise en ligne + cadence de maintenance

### Critères avant ajout de feature

- complexité et coût de maintenance proportionnés ;
- découpage en tâches ciblées sans refactor global ;
- documentation claire dans `PROJECT_MAP.md`.

### À éviter pour l'instant

- Élargir la décision au-delà du DT2 avant que le socle (moteur + nœud A) soit stable.
- Automatiser la collecte avant que le pipeline manuel de veille soit rodé.
- Toute persistance dans le module Décision.
