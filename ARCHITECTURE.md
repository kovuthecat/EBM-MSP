# ARCHITECTURE.md — ebm-msp

Écrans, navigation, données, découpage technique. **Auto-suffisant** : c'est ce fichier qu'on envoie
tel quel à **Claude Design** (claude.ai) pour dessiner la maquette. Tout le nécessaire du brief est
recopié ici ; ne pas renvoyer vers d'autres fichiers.

## Rappel produit (recopié du brief)

- **Objectif** : plateforme MSP à deux modules frères. (1) *Aide à la décision clinique*
  evidence-based **critique** — moteur **générique multi-domaine** : pour chaque situation, options
  avec avantages/inconvénients, niveau de preuve, effet absolu ; reco officielle **et** position
  raisonnée côte à côte, divergence signalée. **Premier domaine livré = diabète de type 2** ;
  d'autres domaines (CV, BPCO, gériatrie, prévention…) s'ajouteront ensuite (même moteur, même UI).
  (2) *Veille scientifique hebdomadaire* critique, classée par thème et par profession, dont les items
  peuvent alimenter les algorithmes après validation humaine.
- **Fonctionnalités MVP** : module Décision (saisie de critères → options → argumentaire dépliable) ;
  contenu clinique versionné ; module Veille (liste filtrable, badge d'impact, comptes légers) ;
  couplage tracé veille → nœud de décision.
- **Plateformes cibles** : web responsive, **lisible sur mobile** (usage en consultation), argumentaire
  déplié à la demande. Ton visuel : sobre, clinique, sérieux ; lisibilité prime.
- **Principe transverse d'affichage** : transparence du niveau de preuve (échelle GRADE simplifiée :
  élevé / modéré / faible / très faible) et des sources sur chaque proposition ; distinction visuelle
  **critère dur vs critère de substitution** ; **effet absolu / NNT** mis en avant, pas seulement le
  risque relatif.

## Écrans & vues

> Un bloc par écran — matière première de la maquette. Deux modules : **Décision** (D) et **Veille** (V).

### D1 — Accueil / sélecteur de module

- Rôle : point d'entrée, orienter vers Décision ou Veille ; porter le disclaimer projet.
- Contenu clés : deux grandes cartes (Aide à la décision · Veille hebdomadaire) ; bandeau de
  disclaimer permanent (« aide à la réflexion, le praticien reste responsable ») ; accès Méthode et,
  si connecté, profil.
- Actions : entrer dans un module ; se connecter (compte veille).

### D2 — Décision : choix du domaine puis liste des nœuds

- Rôle : présenter les **domaines de décision** disponibles puis, dans un domaine, les algorithmes
  (nœuds) et y accéder. **En v1, un seul domaine : Diabète de type 2** (nœuds A→H) — mais l'écran est
  pensé pour en accueillir d'autres ensuite (CV, BPCO, gériatrie…) : prévoir un sélecteur/en-tête de
  domaine même s'il n'affiche qu'une entrée au départ.
- Contenu clés : (si plusieurs domaines) cartes de domaines ; puis liste des nœuds du domaine avec
  titre, population cible, date de revue, badge « récemment mis à jour par la veille » le cas échéant.
  Regroupement des nœuds par thème (pour DT2 : cible, 1re intention, intensification, insuline,
  statine, aspirine, RHD…).
- Actions : choisir un domaine ; ouvrir un nœud → écran D3.

### D3 — Décision : nœud interrogeable (écran central du module)

- Rôle : le cœur de l'aide à la décision. Le praticien saisit des critères → l'outil affiche les
  options applicables et **pourquoi** chacune est proposée.
- Contenu clés :
  - **Formulaire de critères** (dépend du nœud) : ex. pour « Cible glycémique » — âge, ancienneté du
    diabète, espérance de vie (longue/intermédiaire/limitée), fragilité (oui/non), risque
    d'hypoglycémie du schéma (faible/élevé). Champs variés : nombre, booléen, enum, multi-critères CV.
  - **Options résultantes** (cartes concises) : intitulé (ex. « Cible ~7 % »), avantages, inconvénients,
    **effet attendu** (absolu / NNT / NNH, ou « non chiffrable »), **badge niveau de preuve** (élevé /
    modéré / faible / très faible), contre-indications, et une ligne « pourquoi cette option » (règles
    satisfaites, sans score caché).
  - **Trois niveaux de lecture** (cf. `DECISIONS.md` D11) : **(1) recommandation** = les options ci-dessus
    (avantages/inconvénients, preuve, effet) ; **(2) argumentaire détaillé** (dépliable à la demande) :
    texte sourcé + bloc **reco officielle vs position critique côte à côte** avec **drapeau de divergence** ;
    incertitudes ; sources principales (références primaires avec type de critère dur/substitution,
    Médicalement Geek, Prescrire) ; **(3) argumentaire exhaustif** : lien « Lire l'argumentaire exhaustif »
    ouvrant `content/noeuds/<domaine>/<id>.argumentaire.md` — toutes les preuves détaillées et **toutes les sources**.
  - Pied : **date de revue** du nœud + **disclaimer**.
- Actions : saisir/modifier des critères (filtrage en direct) ; déplier/replier l'argumentaire ;
  ouvrir une source ; suivre le lien vers les entrées de veille liées.

### V1 — Veille : liste hebdomadaire filtrable (écran central du module)

- Rôle : trier le temps de lecture — distinguer d'un coup d'œil les études à impact pratique de
  celles à titre informatif.
- Contenu clés : cartes d'articles, une par entrée, montrant : titre, source, semaine (ex. 2026-W30),
  **badge d'impact** (pratique = action possible / informatif = contexte), thème(s), profession(s)
  concernée(s), **badge niveau de preuve**, **temps de lecture estimé**, marqueur « impacte un
  algorithme » (renvoi au nœud). Le contenu du **profil** de l'utilisateur est mis en avant en tête.
- Filtres : par thème, par profession, par niveau d'impact (pratique/informatif), par semaine, par
  niveau de preuve. Tri chronologique par défaut.
- Actions : filtrer ; ouvrir un article → V2 ; ajouter/retirer « pour mémoire » ; suivre « impacte un
  algorithme » → D3.

### V2 — Veille : détail d'un article

- Rôle : présenter l'appréciation critique complète et les liens.
- Contenu clés : titre, source (nom, lien, DOI), type de publication, population, **résumé du résultat**
  (jamais de copie intégrale), **appréciation critique** (biais, critère dur/substitution, effet
  absolu/NNT, cohérence avec les preuves antérieures, conflits d'intérêt), niveau de preuve, pertinence
  pratique, temps de lecture ; encart **impact algorithme** (nœud(s) concerné(s), statut de la
  proposition de mise à jour) ; lien vers la source primaire.
- Actions : ouvrir la source ; « pour mémoire » ; aller au nœud impacté (D3).

### V3 — Veille : sélection / réglage de profil

- Rôle : à l'inscription et dans les réglages, choisir sa profession (MG · IPA maladies chroniques ·
  sage-femme · orthophoniste · IDEL) → priorisation du contenu ; navigation transversale libre.
- Actions : choisir/modifier le profil ; préférences d'affichage.

### V4 — Veille : « Pour mémoire » (espace personnel)

- Rôle : retrouver les articles sauvegardés.
- Contenu clés : liste des articles mis de côté, mêmes cartes que V1, filtrables.

### V5 — Auth (connexion / inscription)

- Rôle : comptes légers restreints à la MSP. Méthode à trancher (magic link vs e-mail + mot de passe).
- Contenu clés : formulaire minimal (e-mail pro), choix du profil à l'inscription ; liens politique de
  confidentialité / CGU ; self-service de suppression de compte (RGPD).

### S1 — Méthode (SOP publiée)

- Rôle : publier la procédure de veille (transparence = gage de fiabilité). Page statique lisible.
- Contenu clés : hiérarchie des sources (modèle 6S), cycle hebdomadaire, critères d'inclusion, grille
  d'appréciation, garde-fous, version de la SOP.

## Navigation & parcours

- **Écran d'entrée** : D1 (accueil / sélecteur de module).
- **Flux Décision** : D1 → D2 (liste des nœuds) → D3 (nœud interrogeable). Argumentaire déplié en place.
- **Flux Veille** : D1 → V1 (liste filtrable) → V2 (détail) ; V3 (profil) et V4 (pour mémoire) via le
  menu du compte ; V5 (auth) pour se connecter.
- **Pont inter-modules** : depuis V2 (« impacte un algorithme ») → D3 du nœud ; depuis D3 (« veille
  liée ») → V2 des entrées associées.
- **Navigation secondaire** : barre supérieure avec bascule Décision / Veille, accès Méthode, et menu
  compte (profil, pour mémoire, déconnexion). Disclaimer permanent visible.

## Données affichées

> Entités et champs visibles à l'UI — pas le schéma BDD complet.

- **Nœud de décision** : id, titre, population cible, critères d'entrée (nom, type, valeurs), options,
  argumentaire, sources, incertitudes, date de revue, version, badge « mis à jour par la veille ».
- **Option** : intitulé, avantages[], inconvénients[], effet attendu (absolu/NNT/NNH ou « non
  chiffrable »), niveau de preuve, conditions (règles d'affichage), contre-indications[].
- **Source** : titre, année, lien/DOI, type de critère (dur / substitution / mixte) ; synthèses
  Médicalement Geek / Prescrire ; reco officielle (source, position, divergence oui/non, explication).
- **Entrée de veille** : id, semaine, titre, source (+DOI), type de publication, thèmes[],
  professions[], niveau d'impact (pratique/informatif), population, résumé, appréciation critique,
  niveau de preuve, pertinence pratique, temps de lecture, impact algorithme (nœuds, statut proposition).
- **Utilisateur** (Supabase) : e-mail, profil (profession), liste d'ids « pour mémoire », préférences.
  *Aucune donnée de santé, aucune donnée patient.*
- **Taxonomie de thèmes** (partagée décision ↔ veille) : soins-premiers, diabete-metabolisme,
  cardiovasculaire-prevention, bpco-pneumo, geriatrie-deprescription, prevention-depistage-vaccination,
  ETP, sante-femme-perinatalite, orthophonie, soins-infirmiers, sante-mentale-addictologie,
  douleur-soins-palliatifs.

## Contraintes UI

- **Mobile-first** (usage en consultation), gros éléments lisibles, argumentaire déplié à la demande.
- Module Décision **sans persistance** : la saisie de critères est volatile (rien n'est stocké).
- **Badges lisibles** pour niveau de preuve (4 niveaux) et niveau d'impact (2 niveaux) — code visuel
  cohérent entre les deux modules.
- Distinction visuelle **critère dur vs substitution**, et mise en avant de l'**effet absolu / NNT**.
- Accessibilité : contrastes suffisants, thème clair par défaut ; ton sobre et clinique.
- Disclaimer permanent, non intrusif mais toujours présent.

---

## Découpage technique

> Sans effet sur la maquette — fixe la structure du code (feature-first, cf. `CONVENTIONS.md`).

- **Features** :
  - `decision` : moteur de règles déterministe (module TS pur, testé Vitest), UI de saisie/résultats
    et rendu d'argumentaire. **Générique et multi-domaine** : ne connaît **ni domaine ni nœud** par
    son nom, tout est piloté par le contenu (`domaine` porté par chaque nœud). DT2 = premier domaine.
  - `veille` : liste filtrable + détail + auth Supabase + « pour mémoire » + profil.
  - `shared` : taxonomie de thèmes, badges (niveau de preuve / impact), types communs, pont
    article ↔ nœud, disclaimer, layout/navigation.
- **Contenu** : `/content/noeuds/*.yaml` et `/content/veille/*.yaml`, validés par `/schema/*.json`
  (JSON Schema), **compilés en JSON** pour le runtime. Séparation stricte contenu / logique / présentation.
- **État / persistance** : module Décision = **aucun état persistant** (state React éphémère) ;
  module Veille = Supabase (auth + profil + ids « pour mémoire »), données minimisées, hébergées UE.
- **Arbitrages structurants** → `DECISIONS.md` (stack, modèle de contenu, RGPD, déterminisme du moteur,
  bi-agents comme process, phasage de la collecte).

---

## Maquette UI

- Statut : [ ] à dessiner · [x] **dessinée** · [ ] câblée
- Exports : `design/maquettes/prototype-ebm-msp-neuf-crans/` — handoff Claude Design, prototype
  **HTML/CSS/JS unique** `project/MSP Menilmontant.dc.html` (les 9 écrans en un fichier), avec
  `support.js` et le logo. **Référence visuelle et d'interaction** (à recréer, pas à copier structurellement).
- Les 9 écrans couvrent 1:1 l'architecture : `home` (D1), `decisionDomains` (D2), `decisionNode` (D3),
  `veilleList` (V1), `veilleDetail` (V2), `profile` (V3), `memory` (V4), `auth` (V5), `methode` (S1).

### Système visuel (extrait du prototype — valeurs exactes dans le `.dc.html`)

- Couleurs **OKLCH**. Fond page `oklch(98% 0.006 240)` ; carte `oklch(99.5% 0.002 240)` ; bordure
  `oklch(89% 0.012 240)` ; texte `oklch(24% 0.02 245)`, atténué `oklch(50% 0.018 245)`.
- **Accent Décision = indigo `oklch(46% 0.09 254)`** ; **accent Veille = teal `oklch(58% 0.075 178)`**.
- Bandeau disclaimer permanent `oklch(95% 0.02 230)`. Header sticky avec pills Décision/Veille + menu
  compte. Rayons 8–16px, police système.
- **Badge niveau de preuve** : élevé = indigo plein · modéré = `oklch(75% 0.06 254)` · faible =
  `oklch(90% 0.03 254)`. **Badge impact** : pratique = teal plein · informatif = gris.

### Écarts maquette ↔ architecture (à répercuter au câblage)

- **Contenus cliniques = illustratifs** (décision de Thibault) : les NNT, essais et chiffres du
  prototype sont des exemples. Le contenu réel des nœuds vient de `docs/decision/` (sourcé), **jamais**
  copié du prototype.
- Le prototype liste **7 nœuds** DT2 (cible, 1re intention, intensification, insuline, statine,
  aspirine, RHD) ; le brief en prévoit **8** (A→H, dont « sulfamides/gliptines »). Le contenu
  autoritaire reste le brief §10 — arbitrer le regroupement au câblage du contenu.
- Moteur du nœud « cible » esquissé en dur (`decideTier`, 4 bandes) → à généraliser en évaluateur de
  `conditions` (moteur générique, cf. `DECISIONS.md` D3/D8).
- Multi-domaine **présent** dans le prototype (chips DT2 actif + CV/BPCO/Gériatrie « à venir »).
