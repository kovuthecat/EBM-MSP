# Accès et identité d'une source

Marche à suivre pour établir **quelle** étude on tient et **ce qu'on en a réellement lu**. Chargée
par les circuits (`recherche-preuve-triangulee`, `verif-source-veille`) et leurs agents avant toute
extraction. Elle dit **comment** ; le **pourquoi** reste à son domicile, cité en renvoi :

- la source primaire comme seule référence, l'IA comme repérage : `docs/decision/00-global.md`
  § Pipeline d'un nœud (étape 2) et `docs/veille/SOP_veille.md` §9 ;
- pas de contournement de paywall : `CLAUDE.md` invariant 7 et `docs/veille/SOP_veille.md` §8 ;
- les règles de sourcing nées d'incidents : `docs/decision/00-global.md` § Règles de sourcing.

Cette page est le **domicile du vocabulaire des états d'accès** : les autres pages (registre,
circuits, agents) l'emploient et y renvoient, sans le redéfinir.

## 1. Premier geste de tout circuit : constater les outils exposés

Avant la première recherche, constater les outils **réellement exposés dans cette session** — pas
ceux qu'une doc suppose disponibles — puis écrire, en tête du rapport :

```text
Outils disponibles : <Serveur>:<outil>, <Serveur>:<outil>, … ; absents : <ce qu'on attendait et qui manque>
```

- Un outil MCP se nomme **avec son serveur** (`Serveur:outil`) : deux serveurs peuvent exposer un
  outil du même nom, et seul le nom qualifié dit lequel a été appelé.
- Les outils natifs (lecture web, recherche web, exécution de `node`) se nomment tels quels.
- Un outil absent **n'est jamais appelé** : on ne reconstitue pas son résultat de mémoire, on
  passe par les voies ouvertes (§ 5) et on le note.
- Ce constat se fait une fois par circuit ; il se refait seulement si un outil échoue d'une manière
  qui suggère qu'il a disparu.

## 2. Les six états d'accès (domicile du vocabulaire)

Un état d'accès qualifie **une voie** (un outil, un site, une copie) pour **un passage utile** —
jamais l'article dans l'absolu. On écrit toujours l'état **et** la voie : « paywall constaté sur
cette voie (page éditeur) », pas « article fermé ».

| État | Veut dire | Ne veut pas dire |
|---|---|---|
| `non récupéré` | aucune tentative aboutie sur cette voie, ou aucune tentative | que le document est fermé |
| `échec technique` | l'outil a échoué (erreur réseau, format illisible, réponse vide, extraction ratée) | quoi que ce soit sur l'accès réel |
| `résumé accessible` | seul le résumé a été lu | que le passage utile est absent du texte intégral |
| `texte intégral accessible` | le texte intégral a été ouvert et le passage lu | que l'étude est solide (axe 3, § 4) |
| `paywall constaté sur cette voie` | on a **vu** la barrière de paiement sur cette voie précise | que toutes les voies sont fermées |
| `accès restant à vérifier` | une voie plausible existe et n'a pas encore été essayée | un échec |

Règles d'emploi :

- **Un fetch qui échoue est un `échec technique`**, jamais un paywall. On change d'outil ou de voie
  avant de conclure quoi que ce soit.
- **L'absence de PMCID ne ferme que la voie PMC.** L'article peut être libre chez l'éditeur, dans un
  dépôt, ou en préprint : tant que ces voies n'ont pas été essayées, l'état est
  `accès restant à vérifier`.
- Le mot « inaccessible » n'est pas un état : il ne s'écrit pas seul. Un report pour accès cite
  l'état de **chaque** voie essayée (§ 7).
- Le registre des affirmations reprend ces six états dans sa colonne `Accès`
  (`registre-affirmations.md` § Format) ; `verifier-registre.mjs` refuse une ligne `vérifiée` dont
  l'état dit que le passage n'a pas été lu.

## 3. Transport, document récupéré, résumé généré

Trois choses différentes, à ne jamais confondre dans un rapport :

- **l'outil de transport** — le connecteur, le fetch, le CLI qui a servi ;
- **le document récupéré** — le texte primaire lui-même (article, supplément, protocole, SAP,
  recommandation). Un texte primaire obtenu par un connecteur ou par un outil d'IA **reste
  primaire** : c'est son contenu qui compte, pas le tuyau ;
- **le résumé généré** — une synthèse produite par un outil (OpenEvidence, un moteur de recherche
  sémantique, un agent). Elle **ne devient pas primaire** parce qu'elle cite un DOI ou un PMID : elle
  reste du repérage (renvoi : `docs/decision/00-global.md` § Pipeline d'un nœud, étape 2).

Dans le rapport : « lu dans le texte intégral (voie : page éditeur, via lecture web) », pas « selon
PubMed ». Un chiffre qui n'est passé que par un résumé généré n'est pas extrait.

## 4. Trois axes, trois vérifications distinctes

| Axe | Question | Ce qui le vérifie | Ce qui ne le vérifie pas |
|---|---|---|---|
| **Identité** | L'identifiant désigne-t-il bien l'étude voulue (design, population, version) ? | `identite.mjs` (identifiants recoupés, divergences) ; la notice ; le registre d'essai | un DOI qui résout, un PMID qui a la bonne forme |
| **Accès au passage** | A-t-on lu le passage qui porte l'affirmation ? | l'état d'accès (§ 2) et la localisation (page, tableau) | un texte intégral disponible mais non ouvert |
| **Solidité de l'inférence** | Le passage soutient-il la phrase, et avec quelle certitude ? | la lecture critique (grille, contradiction) | un DOI juste ; un texte intégral lu |

- Chaque axe se conclut séparément. Un DOI valide n'établit pas que l'article soutient la phrase ; un
  texte intégral disponible n'établit pas la qualité méthodologique.
- **Identité** : si l'article trouvé ne correspond pas à la description reçue (autre design, autre
  équipe, analyse secondaire prise pour l'essai princeps, fichier local dont le nom ne dit pas le
  contenu), le **dire** et rechercher à nouveau — ne jamais forcer la correspondance. Le design
  s'établit dans la section Méthodes du texte, pas dans le relais qui l'a signalé.
- **Identité** : l'identifiant qu'on garde est celui de la notice ou de la fiche (DOI, PMID, NCT),
  jamais un numéro d'ordre propre à une interface (« [3] ») ni un identifiant recopié d'un résumé
  généré (renvoi : `docs/decision/00-global.md` § Règles de sourcing, sur les PMID rendus par OE).
- **Solidité** : se traite dans la lecture critique et la contradiction
  (`references/contradiction.md`), pas ici.

## 5. Voies ouvertes

Voies légales, sans connecteur, par simple lecture web au moment de la recherche — jamais depuis
l'application (`CLAUDE.md` invariant 1). `identite.mjs` (§ 6) en interroge quatre d'un coup.

| Besoin | Voie | À savoir |
|---|---|---|
| Identifiants recoupés (PMID, PMCID, DOI) | PMC idconv, E-utilities PubMed | Absent de PMC ≠ fermé (§ 2) |
| Copie légale en accès ouvert | Unpaywall | Statuts `gold`, `green`, `hybrid`, `bronze` : une copie ouverte connue ; `closed` : aucune copie ouverte **connue d'Unpaywall** — pas un paywall constaté |
| Rétractation, correction, erratum | Crossref (intègre la base Retraction Watch) | « Aucun avis » est un résultat daté, pas une garantie future |
| Toutes les publications d'un essai | PubMed, champ `[si]` avec le numéro d'enregistrement | Rattache princeps, sous-groupes, suivis à une même famille (`registre-affirmations.md` § Familles d'essai) |
| Préprint ↔ version publiée | Europe PMC | Lien absent = non vérifiable par API, jamais « aucun préprint » |
| Protocole, plan d'analyse statistique | Registre d'essai (ClinicalTrials.gov, autres registres), supplément de l'article | Souvent publics quand l'article ne l'est pas |
| Études citées et citantes | OpenAlex | Sert la passe d'omission (`references/contradiction.md`) |
| Texte chez l'éditeur | Page de l'article (DOI résolu) | Beaucoup d'articles sont libres chez l'éditeur sans être dans PMC |

## 6. `identite.mjs` — l'appeler, lire sa sortie

```bash
node .claude/skills/recherche-source-primaire/scripts/identite.mjs <DOI|PMID>          # rapport markdown
node .claude/skills/recherche-source-primaire/scripts/identite.mjs <DOI|PMID> --json   # sortie machine
node .claude/skills/recherche-source-primaire/scripts/identite.mjs --sonde-contrat     # quand une API semble avoir changé
```

À appeler **pour chaque étude qui porte une conclusion**, avant d'écrire son identifiant dans le
dossier. Un DOI ou un PMID suffit ; le script recoupe les autres.

Codes de sortie :

| Code | Sens | Conduite |
|---|---|---|
| `0` | rapport produit (même si des voies sont fermées ou l'identifiant inconnu des sources : c'est un résultat) | lire les sections ci-dessous |
| `1` | identifiant reconnu ni comme DOI ni comme PMID, ou une API a répondu de façon inattendue (le message nomme l'API et le champ) | corriger l'identifiant ; sinon `échec technique` de cette voie — jamais un verdict d'accès ni d'identité : noter le message, passer par la page éditeur ou PubMed à la main ; si une API semble avoir changé, lancer `--sonde-contrat` |
| `2` | aucun identifiant donné | corriger l'appel |

Lecture du rapport, section par section :

- **Identifiants recoupés** — chaque identifiant avec sa source. C'est **cet** identifiant qu'on
  écrit dans le dossier, jamais celui d'un résumé généré.
- **Divergences** — un identifiant qui diffère selon la source est un problème d'**identité** à
  résoudre avant toute extraction : ouvrir la notice, trancher, le noter.
- **Accès ouvert légal (Unpaywall)** — `oa_status` et meilleure copie. Une copie ouverte connue fait
  passer l'état à `accès restant à vérifier` **jusqu'à ce qu'on l'ouvre** ; ouverte et lue, elle
  devient `texte intégral accessible`. `closed` ne dit rien de la page éditeur : l'essayer.
- **Rétractation / correction (Crossref)** — un avis trouvé se signale en tête du rapport et dans le
  registre (colonne `Contradiction`) ; « aucun avis » s'écrit avec la date du rapport. Crossref
  n'est interrogé que par DOI : si aucun DOI ne figure parmi les identifiants recoupés, « aucun
  avis » ne vaut pas vérification — la faire à la main une fois le DOI trouvé.
- **Famille d'essai** — le numéro d'enregistrement et les publications indexées sous ce numéro :
  à reporter dans le registre (`registre-affirmations.md` § Familles d'essai).
- **Préprint lié** — « lié » : noter la relation ; « non vérifiable par API » : l'écrire tel quel.

Le script ne lit pas le texte : il ne vérifie ni l'accès au passage ni la solidité de l'inférence
(§ 4). Il ne remplace pas l'ouverture de la copie qu'il signale.

## 7. Avant de reporter pour une question d'accès

Un report pour accès n'est recevable qu'une fois ces voies essayées, **dans cet ordre**, et l'état de
chacune écrit :

1. `identite.mjs` : PMC, copie légale connue (Unpaywall), préprint lié.
2. La **page éditeur** du DOI : texte libre, suppléments, données complémentaires.
3. Le **registre de l'essai** : protocole, plan d'analyse statistique, résultats déposés — la
   question qui bloque (critère préspécifié ou non, analyse prévue ou post hoc) s'y tranche souvent
   sans l'article.
4. Un **dépôt légitime** (archive institutionnelle, dépôt d'auteur) signalé par Unpaywall.
5. Un **préprint** de la même étude : texte intégral utilisable, statut **non relu par les pairs**
   écrit dans le dossier, jamais présenté comme la version publiée ; une divergence entre préprint et
   résumé publié se signale, elle ne se tranche pas en silence.
6. Des **résumés secondaires concordants** : un chiffre trouvé seulement par eux reste `non vérifiée`
   au registre (écrit `NON VÉRIFIÉ (partiel)` dans le dossier).
7. **Demander au référent** s'il a un accès personnel ou institutionnel (bibliothèque universitaire
   ou hospitalière, abonnement) — hors de portée de l'agent, souvent le déblocage le plus simple. Le
   report n'est pas levé tant que la réponse n'est pas revenue.

Aucune de ces voies ne contourne un paywall (renvoi : `CLAUDE.md` invariant 7). Le report lui-même
suit la règle de son module : en veille, `docs/veille/SOP_veille.md` §6bis (règle de file d'attente,
deux reports au plus) ; en Décision, le point reste `[À VÉRIFIER]` (renvoi :
`docs/decision/00-global.md` § Règles de sourcing).

## 8. Avant un verdict d'absence

« Aucune source ne porte X », « aucun essai n'a étudié Y » sont des **affirmations** ; la règle et
l'incident qui l'a fondée sont dans `docs/decision/00-global.md` § Règles de sourcing (verdict
d'absence). Marche à suivre :

1. **Ouvrir** — pas seulement lister — les pièces pertinentes du corpus local
   `docs/decision/sources/` (inventaire commenté : `docs/decision/00-global.md` § Sources locales).
2. Essayer **au moins deux méthodes d'extraction** sur chaque pièce pertinente (par exemple : lecture
   directe du PDF par l'outil de lecture, puis un extracteur texte en ligne de commande). Écrire
   lesquelles.
3. **Normaliser avant de chercher** : certains PDF encodent des caractères espacés (« m o t »), et une
   recherche plein texte naïve rend zéro occurrence d'un terme présent. Supprimer les espaces, ignorer
   la casse et les accents.
4. **Témoin positif** : chercher un terme dont on sait qu'il est présent (le titre, le nom du
   produit). S'il ne sort pas non plus, c'est l'extraction qui est en cause, pas le contenu.
5. Une pièce réellement vide pour les outils texte (zéro caractère extractible) se **constate et se
   note** ; elle ne se déduit pas.
6. Hors corpus local : noter le périmètre effectivement couvert (bases, requêtes, dates) dans le
   journal de recherche (`registre-affirmations.md` § Journal de recherche). Une recherche sans
   résultat se consigne comme **lacune avec ses limites de couverture**, jamais comme preuve
   d'absence.
7. Une absence **affirmée par un outil d'IA** (« aucun essai randomisé ») n'est pas un verdict : c'est
   une piste à vérifier par la même marche, comme toute autre sortie IA.

Le rapport cite, pour chaque « introuvable », la pièce ouverte et les méthodes essayées.

---

## Anciens usages et fiches datées

Ce qui suit vient de l'ancienne page d'entrée de ce socle (`SKILL.md`, versions du 2026-08-10 au
2026-08-28). Ce sont des **constats datés**, pas des faits courants : noms d'outils, volumes et tarifs
changent sans prévenir. Avant de s'y fier, constater l'outil (§ 1) et, pour un chiffre, vérifier à la
source.

- **Connecteurs de recherche (constat du 2026-08-10)** : PubMed, ClinicalTrials.gov, Consensus,
  SciSpace, Elicit, activables par conversation dans Claude Desktop, puis exposés comme outils MCP.
  **Au 2026-09-24, aucun n'était exposé dans une session Claude Code** (rapport de propositions
  §13.2) : d'où le constat du § 1 et les voies ouvertes du § 5.
- **Connecteur PubMed (constat du 2026-08-13)** : `get_copyright_status` et `get_article_metadata`
  rendaient `is_open_access` et `pmc_id` ; `get_full_text_article` ne servait que les articles de PMC
  (alors environ 8 millions sur environ 36 millions de notices) ; `lookup_article_by_citation` et
  `convert_article_ids` retrouvaient un PMID depuis une citation ; `find_related_articles` repérait
  une étude sœur. L'ancienne consigne « `is_open_access: false` et `pmc_id: null` = inaccessibilité
  confirmée » est **retirée** : elle ne fermait que la voie PMC (§ 2).
- **Connecteur ClinicalTrials.gov (constat du 2026-08-13)** : `search_trials`, `get_trial_details`
  pour le protocole et le SAP ; `search_by_eligibility` ; `analyze_endpoints` comparait un critère de
  jugement entre plusieurs essais proches en un appel. Le réflexe « registre avant report » est
  désormais au § 7, étape 3.
- **Consensus (constat du 2026-08-13)** : recherche sémantique large, utile pour retrouver une
  référence incertaine ; filtres `study_types`, `domain`/`human`, `sample_size_min`,
  `year_min`/`year_max`, `sjr_max`, à n'appliquer que si la question les impose ; résultats numérotés
  (`[1]`, `[2]`…) dont il fallait reprendre le DOI ou le PMID de la fiche. SciSpace, même usage.
- **Elicit (constat du 2026-08-13)** : accès API conditionné à un abonnement Pro (`api_access_denied`
  sans) ; recherche à environ 200 crédits, limite de 100 requêtes par minute ; son `search_trials`
  (environ 545 000 essais, recherche sémantique) **homonyme** de celui de ClinicalTrials.gov — d'où
  la règle de nommage `Serveur:outil` du § 1 ; `create_systematic_review` jugé hors de proportion pour
  une vérification ponctuelle.
- **OpenEvidence en ligne de commande (depuis le 2026-08-28)** : marche à suivre dans un circuit :
  `references/openevidence.md` ; chemin, options et codes du CLI : `docs/commun/OUTIL-INTERFACE-OE.md`.
