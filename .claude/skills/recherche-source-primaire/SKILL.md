---
name: recherche-source-primaire
description: Techniques pour localiser, accéder et confirmer le statut d'une source primaire (étude, essai, méta-analyse) avant toute appréciation critique. Utilisé par `verif-source-veille` et `recherche-preuve-triangulee` — pas un skill à invoquer seul en général, plutôt une référence chargée par eux.
---

# Recherche de source primaire

Discipline commune aux deux pipelines de preuve du projet (veille §7/§7bis, décision P5).
Invariant non négociable : **jamais de contournement de paywall** (`CLAUDE.md` invariant 7). Les
techniques ci-dessous servent à trouver un accès **légitime**, pas à en fabriquer un.

## Connecteurs disponibles (Claude Desktop, à activer par conversation)

PubMed, ClinicalTrials.gov, Consensus, SciSpace, Elicit — icône connecteurs dans la barre de
saisie. Une fois activés pour la conversation, ils apparaissent comme outils MCP (`ToolSearch` avec
des mots-clés précis si non chargés). **Même statut qu'OpenEvidence** (`SOP_veille.md` §4,
`docs/decision/00-global.md` §2) : débroussaillage et identification, **jamais une référence en
soi** — toute affirmation reste vérifiée sur la source primaire avant classement.

### OpenEvidence — interrogeable en ligne de commande, sans changer de statut

Depuis le 2026-08-28, OE se pose **en CLI** par l'application Interface-OE (mode d'emploi, coût,
codes de sortie, garde-fous : `docs/commun/OUTIL-INTERFACE-OE.md`). Ça n'en fait **pas** un
connecteur comme les autres :
- une requête est prélevée sur le compte personnel de Thibault et sur son budget → **demander
  avant de poser**, jamais une rafale décidée seul ;
- un défi anti-robot (code de sortie 3) **arrête la session** : aucun réessai, aucune reformulation,
  la main au référent ;
- statut inchangé : **débroussaillage, jamais une référence en soi**. OE ne remplace ni PubMed ni la
  source primaire, et un retour obtenu par CLI n'est pas plus fiable qu'un retour collé à la main.

### PubMed — vérifier l'accès avant de conclure à un échec de récupération

`get_copyright_status` (ou `get_article_metadata`) donne `is_open_access` et `pmc_id` en un appel.
**Toujours vérifier ça avant d'écrire qu'un article est « inaccessible »** — un fetch qui échoue
peut être un problème d'outil, pas un problème d'accès réel. Si `is_open_access: false` et
`pmc_id: null`, l'inaccessibilité est confirmée et peut être actée (→ `reporte` ou repli en brève,
selon le pipeline).

Le texte intégral (`get_full_text_article`) n'existe que pour les articles présents dans **PubMed
Central** — sous-ensemble d'environ 8 millions d'articles sur les ~36 millions de notices PubMed
(abstract seul pour le reste, même quand l'article n'est pas payant ailleurs). Un `pmc_id` absent
n'est donc pas forcément un paywall — vérifier aussi l'accès direct chez l'éditeur avant de
conclure. Pour une citation incomplète ou douteuse plutôt qu'une inaccessibilité,
`lookup_article_by_citation`/`convert_article_ids` retrouvent le PMID exact ; `find_related_articles`
sert à repérer une réplication ou une étude sœur de la même équipe (utile pour le piège de
confusion entre essai princeps et analyse secondaire, cf. discipline de citation ci-dessous).

### ClinicalTrials.gov — le réflexe qui débloque le plus de reports

Avant de reporter un item pour inaccessibilité du texte intégral d'un essai, **chercher le
protocole et le plan d'analyse statistique (SAP) sur le registre** (`search_trials`,
`get_trial_details`). Souvent publics même quand l'article publié est payant. A débloqué un report
sur ce projet (SAP de l'essai SELECT, cf. `docs/veille/JOURNAL_BOITE_MAIL.md` §2bis) : la question
qui bloquait (un critère était-il préspécifié ou post-hoc ?) s'est tranchée sur le SAP, pas sur
l'article.

Pour comparer un critère de jugement entre plusieurs essais proches du même domaine (même
population, même classe d'intervention), `analyze_endpoints` fait la comparaison systématique en un
appel plutôt que de rouvrir chaque `get_trial_details` un par un pour extraire manuellement les
critères — utile en appui d'une appréciation GRADE quand plusieurs essais sont en jeu.

**Piège d'extraction PDF, rencontré sur un SAP téléchargé** : certains PDF encodent les caractères
espacés (« S e m a gl uti d e »). Une recherche plein texte naïve peut renvoyer zéro occurrence
d'un terme qui est pourtant présent — faux négatif qui peut passer pour un résultat. **Normaliser
(supprimer les espaces) avant de conclure à une absence.** Contrôle utile : chercher un terme dont
on est certain qu'il est présent (le nom du produit, par ex.) — s'il ne matche pas non plus,
l'extraction est en cause, pas le contenu.

### Consensus / SciSpace — retrouver une référence incertaine

Utiles quand la référence d'un article est incomplète ou probablement fausse (repérée via un
relais de presse, une citation approximative). Recherche sémantique large, cross-source. **Ne pas
citer un chiffre depuis leur résumé** — une fois l'article identifié, remonter à la source (PubMed,
DOI direct) pour toute donnée chiffrée.

Consensus expose des filtres (`study_types` — RCT, non-RCT, essai en laboratoire, simulation, etc.
—, `domain`/`human`, `sample_size_min`, `year_min`/`year_max`, `sjr_max`) mais **ne pas les
appliquer par défaut** — seulement quand la question du référent restreint explicitement (ex. « des
ECR chez l'humain avec au moins 100 participants »). Une recherche large sans filtre reste le
réglage par défaut pour du débroussaillage. Consensus cite ses résultats par numéro ([1], [2]…) —
reprendre le PMID/DOI de la fiche, pas seulement ce numéro, pour la table maîtresse des preuves.

### Preprint (medRxiv, bioRxiv) — repli si la version publiée est verrouillée

Quand l'article publié est payant et qu'aucune autre voie légitime (PMC, protocole/SAP,
résumés secondaires concordants) ne débloque l'accès, chercher si une **version preprint** de la
même étude existe. Ça donne accès au texte intégral, mais avec un statut différent — **non
peer-reviewed** — à marquer explicitement dans la table de preuve (jamais présenté comme
équivalent à la version publiée). Si les résultats du preprint et du résumé de la version publiée
divergent, signaler la divergence plutôt que de trancher silencieusement pour l'un ou l'autre.

### Elicit — vérifier l'accès API avant de compter dessus

Nécessite un abonnement Pro côté compte pour l'accès API ; sans lui, `search_papers`/`search_trials`
renvoient `api_access_denied`. Tester une fois en début de session ; ne pas re-tester à chaque appel
si le refus est déjà tombé une fois.

Coûteux en usage si l'accès est actif : recherche ≈ 200 crédits, limite globale 100 requêtes/minute
tous plans confondus. Grouper les questions plutôt que relancer une recherche par sous-critère.
`search_trials` couvre ~545 000 essais en recherche sémantique — complémentaire de
`search_trials`/`search_by_eligibility` de ClinicalTrials.gov (recherche structurée par champs),
pas un doublon : utile quand la formulation de la question ne correspond à aucun champ structuré
évident. `create_systematic_review` (screening à grande échelle) est hors de proportion pour une
vérification de nœud ponctuelle — réservé à une revue de littérature complète si le référent la
demande explicitement.

## Le garde-fou central, hérité de la veille mais valable partout

**« Une source de repérage ne détermine jamais la route »** (`TRI_BOITE_MAIL.md`, `SOP_veille.md`
§9). La presse médicale (Tier 3, réseau « -pratique.com »), un communiqué, un résumé secondaire
signalent un sujet — ils ne remplacent jamais la lecture de la publication d'origine. Ce projet a
constaté plusieurs fois cette session que des chiffres relayés étaient exacts mais **le cadrage
faux** (titre inversant le message, comparateur mal identifié, conclusion d'équivalence transformée
en supériorité) — invisible sans remonter à la source.

## Discipline de citation

- Chaque chiffre est relié à sa **localisation exacte** (page, tableau, section) dans la source
  primaire — jamais « selon l'article » sans plus de précision.
- Un chiffre trouvé seulement via un résumé secondaire concordant (2-3 sources indépendantes) est
  marqué **`NON VÉRIFIÉ (partiel)`**, pas présenté comme confirmé.
- Une source réellement inaccessible (paywall confirmé par vérification d'accès, pas par simple
  échec de fetch, et sans issue via PMC, protocole/SAP, preprint ou résumés secondaires
  concordants) est un motif de **report**, pas de silence ni d'invention. Avant d'acter le report,
  **demander au référent s'il a un accès personnel ou institutionnel à l'article** (bibliothèque
  universitaire/hospitalière, abonnement) — hors de portée de l'agent, mais souvent le déblocage le
  plus simple ; ne pas lever le report tant que la réponse n'est pas revenue.
- Si un article attendu ne correspond pas à la description qu'on en a (piège déjà rencontré :
  confusion entre deux études de la même équipe, ou entre un essai princeps et une analyse
  secondaire) — le dire explicitement et rechercher à nouveau plutôt que de forcer la correspondance.
