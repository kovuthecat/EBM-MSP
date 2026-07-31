# Sources de veille — liste candidate (T-093, PV1·S2)

> Liste **candidate**, fermée (24 sources retenues), établie par fusion de deux listes d'entrée —
> `SOP_veille.md` §4 + `BRIEF_VEILLE.md` §8, et la liste apportée par Thibault le 2026-07-31 — puis
> **vérifiée en ligne le 2026-07-31** (WebFetch source par source ; WebSearch en repli quand
> l'ouverture directe échouait ; recontrôle et compléments par navigateur réel — Playwright — le même
> jour). Elle sert à démarrer l'édition `2026-W30` sans rien chercher ; S3/S4 l'élagueront au contact.
>
> **Note méthodologique** : plusieurs domaines ont refusé la connexion directe de façon répétée le
> 2026-07-31 (`prescrire.org`, `minerva-ebm.be`/`cochranelibrary.com`, `thennt.com`, `ebm.bmj.com`,
> `has-sante.fr`, `santepubliquefrance.fr`, `dgs-urgent.sante.gouv.fr` — erreurs `403`, `429`, ou
> `stream aborted`, vraisemblablement anti-bot). Dans ces cas, une vérification de repli par
> recherche web a été faite ; chaque cellule concernée le signale explicitement au lieu d'affirmer
> sans base. Aucune cellule n'est vide : une case non vérifiable porte `inconnu`.
>
> Colonnes (8, la colonne Tier étant portée par le titre de chaque table) : nom · URL · accès
> (libre/abstract/paywall) · flux (RSS-Atom/alerte e-mail/aucun + URL si trouvée) · archive datée
> navigable (oui/non/partielle) · cadence réelle · thèmes MG couverts (parmi les 9 du domaine :
> `soins-premiers`, `diabete-metabolisme`, `cardiovasculaire-prevention`, `bpco-pneumo`,
> `infectiologie-antibiotherapie`, `geriatrie-deprescription`, `prevention-depistage-vaccination`,
> `sante-mentale-addictologie`, `douleur-soins-palliatifs`) · à parcourir.

---

## Tier 1 — EBM secondaire pré-appréciée

| Nom | URL | Accès | Flux | Archive datée navigable | Cadence réelle | Thèmes MG couverts | À parcourir |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Minerva | https://minerva-ebp.be/?language=FR (ancien domaine `minerva-ebm.be` constaté non résolutif directement) | libre | aucun trouvé (non détecté sur le site ; page « Archives » existe mais pas de lien RSS repéré) | partielle (`/Home/Calendar?year=0` existe, granularité exacte non confirmée) | plusieurs fiches par mois (mise à jour groupée constatée le 26/06/2026 lors de la vérification du 2026-07-31, pas un flux continu strictement hebdomadaire) | transversal (9 thèmes selon les fiches publiées) | chaque semaine |
| Prescrire | https://www.prescrire.org/ | paywall — accès libre partiel article par article (« Accès libre » vs « Réservé aux abonnés » constaté sur les sommaires), seul abonnement payant toléré du projet | aucun trouvé (page accueil chargée avec succès en navigateur réel le 2026-07-31 — le blocage initial venait de l'outil de vérification sans navigateur, pas du site ; toujours aucune mention de flux RSS relevée) | oui (sommaires mensuels archivés, URL nommée par mois : `/sommaire-de-la-revue-prescrire/prescrire-<mois>-<annee>`) | mensuelle | transversal | chaque mois |
| Cochrane (Cochrane Library / Cochrane France) | https://www.cochranelibrary.com/ (résumés FR : https://www.cochrane.org/fr) | abstract (résumés scientifiques + résumés en langage clair libres et gratuits ; texte intégral payant — France non confirmée parmi les pays à licence nationale gratuite, à la différence de la Suisse ; embargo 12 mois avant open access selon la stratégie Cochrane) | inconnu (page chargée avec succès en navigateur réel le 2026-07-31 — 200 OK sur `cochranelibrary.com` et `cochrane.org/fr/evidence`, le 403 initial venait de l'outil de vérification sans navigateur ; toujours aucun RSS repéré dans le HTML) | non confirmée (aucune archive chronologique publique repérée sur les pages consultées) | continue (revues publiées/mises à jour au fil de l'eau, pas de calendrier hebdomadaire fixe) | transversal | chaque mois / à la demande |
| NNT.com | https://thennt.com/ | libre (site éducatif gratuit ; rien ne contredit l'absence de paywall) | **confirmé** (navigateur réel, 2026-07-31) : flux Atom principal `https://thennt.com/feed/` (auto-découvert dans le HTML), + `thennt.com/comments/feed/` | oui (archives par catégorie constatées via `thennt.com/nnt/` et `thennt.com/lr/`, revues datées) | irrégulière mais active (nouvelles revues confirmées en 2025 et 2026) | transversal | chaque semaine (flux confirmé — peut rejoindre le socle hebdomadaire, à réévaluer en S3/S4) |
| McMaster EvidenceAlerts | https://www.evidencealerts.com/ | libre avec inscription obligatoire (gratuit — « Register for free today ! ») | aucun RSS public trouvé ; alerte e-mail personnalisable par discipline après inscription | partielle (base interrogeable depuis 2003 ; filtres précis non visibles avant connexion) | inconnu (fréquence de mise à jour non précisée sur les pages publiques) | transversal (filtrable par discipline, dont médecine générale) — meilleur rapport signal/temps de la liste : screening déjà fait par des cliniciens | chaque semaine |
| BMJ Evidence-Based Medicine | https://ebm.bmj.com/ | abstract libre + texte intégral payant (paywall au-delà du résumé structuré) | RSS trouvé par recherche web (`ebm.bmj.com/rss/current.xml`) — **toujours bloqué en navigateur réel** le 2026-07-31 (page anti-bot « Please Wait », statut 429, ne se résout pas même après attente et navigation préalable sur le site principal) : contrairement à Prescrire/Cochrane/NNT.com, ce blocage résiste à un vrai navigateur, ce n'est pas une limite de l'outil de vérification — à recontrôler manuellement par Thibault si besoin | oui probable (par numéro/volume, pratique standard BMJ) — non revérifiée en direct | inconnu (périodicité non confirmée en direct) | transversal | à la demande (le résumé structuré suffit en général au screening) |
| Médicalement Geek / DragiWebdo | https://www.medicalement-geek.com/ | libre | Atom confirmé valide : https://www.medicalement-geek.com/feeds/posts/default (dernière entrée constatée : Dragi Webdo n°534, 5 juillet 2026, auteur Dr Agibus) | oui (archives par mois/année depuis février 2014) | hebdomadaire (dimanche soir), pause estivale en août | transversal | chaque semaine |
| Exercer | https://www.exercer.fr/ | mixte (articles « en accès libre » + abonnement annuel pour l'intégralité et les archives) | aucun trouvé | oui (sommaires par numéro constatés, N°217 à N°224) | 10 numéros/an | transversal (soins premiers, recherche en MG) | à la demande |

## Tier 2 — Recommandations & agences

| Nom | URL | Accès | Flux | Archive datée navigable | Cadence réelle | Thèmes MG couverts | À parcourir |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HAS | https://www.has-sante.fr/ | libre | **confirmé en navigateur réel** (2026-07-31) : la page `has-sante.fr/jcms/c_1771214/fr/nos-flux-d-information-rss` liste ~10 flux thématiques nommés (« HAS - Actualité », « HAS - Recommandations et guides », « HAS - Publications Covid-19 », « HAS - Avis sur les médicaments », etc.) ; les URL XML exactes sont générées par une icône interactive (portail JCMS) et non extractibles par simple lecture du HTML — à copier manuellement sur la page si besoin d'un flux précis | inconnu (non confirmée en direct) | inconnu (non confirmée en direct) | transversal (recommandations tous domaines) | à la demande / chaque mois |
| Collège de la Médecine Générale (CMG) | https://www.cmg.fr/ | libre | aucun trouvé | partielle (actualités datées visibles ; profondeur de navigation historique non confirmée) | irrégulière (plusieurs actualités constatées en juin-juillet 2026) | soins-premiers (transversal MG) | à la demande |
| ANSM | https://ansm.sante.fr/ | libre | RSS confirmé, plusieurs flux : `ansm.sante.fr/rss/actualites`, `ansm.sante.fr/rss/informations_securite`, `ansm.sante.fr/rss/disponibilite_produits_sante` | oui (actualités paginées, ~291 pages constatées) | quasi quotidienne | transversal (sécurité médicamenteuse, tous domaines) | chaque semaine |
| DGS-Urgent | https://dgs-urgent.sante.gouv.fr/ (archives : https://sante.gouv.fr/professionnels/article/archives-dgs-urgent) | libre pour les professionnels de santé titulaires d'un n° RPPS/ADELI (inscription gratuite) | alerte e-mail via messagerie MSSanté ; aucun flux RSS identifié | **recontrôlée en navigateur réel le 2026-07-31 : page accessible par intermittence** (chargée une fois avec le texte complet des archives, rejetée par un pare-feu applicatif — « The requested URL was rejected » — sur une tentative suivante, signe d'une protection anti-bot sensible au rythme des requêtes plutôt que d'un blocage systématique). **Constat de fond, plus important que l'accessibilité** : la page ne liste que les archives **2020 et 2021** — aucune entrée 2026 trouvée. Elle est **inexploitable pour W30/W31** (13-26 juillet 2026) en l'état ; ce n'est visiblement plus le canal d'archive courant. Un autre point d'accès aux DGS-Urgent récents reste à identifier (ou complément manuel du référent) | à l'occasion (alertes sanitaires ponctuelles, pas de calendrier fixe) | transversal (alertes sanitaires tous domaines), gratuit et actionnable par construction | chaque semaine (vérifier l'absence de nouveau message) |
| Santé Publique France / BEH | https://www.santepubliquefrance.fr/ (BEH : https://beh.santepubliquefrance.fr/beh/) | libre | **confirmé en navigateur réel** (2026-07-31) : la page `santepubliquefrance.fr/rss` liste des dizaines de flux RSS **par thème**, URL exactes de la forme `santepubliquefrance.fr/rss/<id>` (ex. `/rss/1016` cancers, `/rss/1055` chute — pertinent gériatrie, `/rss/1026` coqueluche — infectiologie) ; pas de flux généraliste unique repéré, il faut s'abonner thème par thème | oui probable, par numéro/année (existence confirmée par recherche web) — non revérifiée en direct | annoncée hebdomadaire ; cadence réelle récente non confirmée en direct — inconnu | prévention-dépistage-vaccination ; infectiologie-antibiotherapie (surveillance épidémiologique) | à la demande / chaque mois |
| SPILF (infectiologie.com) | https://www.infectiologie.com/ | libre pour l'essentiel (section « Accès membres » réservée pour une partie du contenu) | aucun trouvé | partielle (actualités datées constatées, ex. 24 juillet 2026 ; navigation séquentielle par page plutôt que par date) | irrégulière, plusieurs actualités par mois | infectiologie-antibiotherapie (seule source dédiée de la liste sur ce thème) | à la demande |
| Réseau Sentinelles | https://www.sentiweb.fr/ | libre (espace médecin optionnel pour les praticiens contributeurs du réseau) | **confirmé** (navigateur, 2026-07-31) : RSS (`sentiweb.fr/france/fr/?page=rss`) + abonnement e-mail hebdomadaire au bulletin | oui — bulletins hebdomadaires archivés par semaine calendaire (le plus récent constaté : « semaine 30, 20/07-26/07/2026 », publié le 29/07/2026), + bilans annuels | hebdomadaire, généralement le mercredi | infectiologie-antibiotherapie (grippe, gastro-entérite, varicelle, etc. — surveillance en soins primaires, produite par des médecins généralistes) ; prevention-depistage-vaccination (données épidémiologiques) | chaque semaine |
| EMA (European Medicines Agency) | https://www.ema.europa.eu/en/news | libre | **confirmé** (navigateur, 2026-07-31) : RSS (`ema.europa.eu/news-event/rss-feeds`) ; pas de page d'inscription newsletter repérée sur cette page | partielle — actualités datées mais navigation par pagination numérique uniquement (~388 pages constatées), pas de filtre chronologique par mois/année | quasi quotidienne | transversal (sécurité médicamenteuse et réglementation, échelle UE — complète ANSM plutôt qu'elle ne le duplique : signaux parfois antérieurs à leur relais français) | à la demande |
| SFGG (Société Française de Gériatrie et Gérontologie) | https://sfgg.org/ | libre pour l'essentiel (« Actualités », « Recommandations », « Revue de presse professionnelle » en accès public) + inscription requise pour une partie des contenus (adhésion membre) | RSS confirmé et valide : `https://sfgg.org/feed/` (vérifié en navigateur réel le 2026-07-31) — **signal bruité** : mélange actualités cliniques et offres d'emploi hospitalières dans le même flux, filtrage nécessaire au screening | partielle — le flux RSS porte des dates (donc filtrable a posteriori), mais la page `/recommandations/` elle-même liste ses fiches **sans date de publication ni archive chronologique** | actualités quasi quotidiennes (mélange emploi/clinique) ; rythme propre des recommandations non déterminé | geriatrie-deprescription (seule source dédiée de la liste sur ce thème, ajoutée le 2026-07-31 sur arbitrage Thibault — cf. brief §8) | chaque semaine, en filtrant le bruit emploi |

## Tier 3 — Sommaires de grandes revues (alertes TOC)

| Nom | URL | Accès | Flux | Archive datée navigable | Cadence réelle | Thèmes MG couverts | À parcourir |
| --- | --- | --- | --- | --- | --- | --- | --- |
| NEJM | https://www.nejm.org/ | abstract libre + texte intégral payant (1 article payant offert/mois avec compte gratuit) | RSS TOC confirmé (`nejm.org/action/showFeed?jc=nejm&type=etoc&feed=rss`) + alerte e-mail hebdomadaire gratuite (mercredi) | oui (par numéro) | hebdomadaire | transversal | à la demande |
| JAMA | https://jamanetwork.com/journals/jama | abstract libre + texte intégral payant | RSS confirmé (`jamanetwork.com/pages/rss`) + alertes e-mail gratuites | oui (par numéro) | hebdomadaire | transversal | à la demande |
| The Lancet | https://www.thelancet.com/ | mixte (accès libre illimité au contenu open access ; le reste suit l'abonnement) | RSS confirmé (`thelancet.com/content/rss`) + « Lancet Alerts » e-mail gratuit | oui | hebdomadaire | transversal | à la demande |
| BMJ (revue générale, distincte de BMJ EBM) | https://www.bmj.com/ | abstract libre + texte intégral payant (partie en libre accès) | RSS existant par pratique standard BMJ — URL exacte non revérifiée pour ce titre précis : inconnu | oui probable (par numéro, pratique standard) — non revérifiée en direct | hebdomadaire | transversal | à la demande |
| Annals of Internal Medicine | https://www.acpjournals.org/journal/aim | abstract libre + texte intégral payant (accès étendu pour membres ACP) | RSS confirmé (`acpjournals.org/journal/aim/alerts`) + alerte e-mail « Latest From I.M. Matters » | oui | bimensuelle (2 numéros/mois) | transversal (médecine interne, proche MG) | à la demande |

## Tier 4 — Études primaires (vérification/approfondissement d'un signal déjà repéré uniquement)

| Nom | URL | Accès | Flux | Archive datée navigable | Cadence réelle | Thèmes MG couverts | À parcourir |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Veille Médicale | https://www.veillemedicale.fr/ | libre (inscription gratuite) | aucun trouvé | non confirmée (pas de navigation datée explicite constatée) | continue (moissonnage automatisé PubMed/Embase/Cochrane, « 60-90 000 requêtes hebdo » annoncées, 620+ sous-spécialités) | transversal en théorie, mais logique de **rappel** (moteur de requêtes), pas de précision éditoriale | à la demande, **hors parcours hebdomadaire** — approfondir un signal déjà repéré uniquement |

## Contrôle (hors Tiers, hors parcours)

| Nom | URL | Accès | Flux | Archive datée navigable | Cadence réelle | Thèmes MG couverts | À parcourir |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Retraction Watch | https://retractionwatch.com/ | libre | RSS confirmé valide : https://retractionwatch.com/feed/ (mise à jour horaire constatée) | oui (archives par mois depuis août 2010) | très active (~20-30 billets/mois, 27 en juillet 2026) | transversal (intégrité scientifique, tous domaines) | à la demande, **uniquement au moment d'intégrer un item** — jamais en parcours hebdomadaire (SOP §9) |

**Total retenu : 24 sources** (8 Tier 1, 9 Tier 2, 5 Tier 3, 1 Tier 4, 1 hors-Tier de contrôle) — dans la fourchette 15-25 visée, proche de la borne haute.

---

## Ordre de parcours recommandé

Un lundi, dans cet ordre (meilleur rapport signal/temps d'abord) :

1. **EvidenceAlerts** — le screening est déjà fait par des cliniciens, filtrable par discipline : commencer ici.
2. **Médicalement Geek / DragiWebdo** — revue de presse hebdomadaire déjà digérée, gratuite, archive complète.
3. **Minerva** — fiches courtes prêtes à l'emploi (mise à jour parfois groupée plutôt que continue : vérifier qu'il y a du nouveau).
4. **ANSM** (flux actualités + sécurité) — cadence quasi quotidienne, vérifier depuis le dernier lundi.
5. **DGS-Urgent** — vérifier l'absence de nouveau message depuis la semaine précédente.

*Point de bascule* : ce qui précède est le socle hebdomadaire (5 sources, pas seize). Ce qui suit se consulte selon l'échéance du mois ou l'actualité de la semaine, pas systématiquement chaque lundi :

6. **Prescrire** — à son échéance mensuelle.
7. **HAS**, **Cochrane**, **Santé Publique France/BEH**, **SPILF**, **CMG**, **SFGG**, **EMA** — à la demande ou en fin de mois, selon l'actualité (recommandation publiée, alerte épidémiologique) ; pour SFGG, filtrer le flux des offres d'emploi avant screening.
7bis. **Réseau Sentinelles** — cadence hebdomadaire réelle (mercredi), mais **candidat à l'essai plutôt qu'au socle d'emblée** : c'est un tableau de bord épidémiologique à consulter (grippe, gastro, etc.), pas une source à dépouiller comme DragiWebdo/Minerva. À ouvrir chaque semaine en pratique, sa promotion formelle dans le socle des 5 se décide au relevé de rendement de S4, comme pour les autres ajouts de cette session.
8. **Tier 3** (NEJM, JAMA, The Lancet, BMJ, Annals of Internal Medicine) — sommaires TOC consultés seulement si un signal fort a été repéré ailleurs ; jamais en lecture systématique des 5 revues chaque semaine.
9. **Veille Médicale** — jamais en parcours hebdomadaire ; uniquement pour approfondir un signal déjà repéré (Tier 4).
10. **Retraction Watch** — jamais en parcours hebdomadaire ; uniquement au moment d'intégrer un item à la veille (contrôle, SOP §9).

**Réserve constatée à cette vérification** : plusieurs cadences et confirmations de flux (HAS, Santé Publique France/BEH, Cochrane, BMJ EBM, NNT.com) reposent en partie sur une vérification de repli par recherche web plutôt que sur l'ouverture directe de la page, les domaines ayant refusé la connexion de l'outil de vérification à plusieurs reprises le 2026-07-31 (403/429/« stream aborted »). Cela ne remet pas en cause leur place dans la liste (ce sont des institutions/revues connues et publiques), mais l'exactitude fine (URL de flux, cadence au jour près) est à recontrôler manuellement en S3/S4.

**Recontrôle par navigateur réel (Playwright, 2026-07-31, à la demande de Thibault)** : la plupart des blocages ci-dessus venaient de l'outil de vérification sans navigateur, pas des sites eux-mêmes — Prescrire, Cochrane et NNT.com se sont chargés normalement (200 OK) une fois testés avec un vrai navigateur, et NNT.com a livré un flux Atom confirmé (`thennt.com/feed/`). HAS et Santé Publique France se sont aussi chargés normalement et ont confirmé l'existence de flux RSS thématiques réels (détail dans les lignes du tableau). **Deux constats ne se résolvent pas par le navigateur** : BMJ EBM reste bloqué par une page anti-bot même en navigateur réel (à distinguer des simples limites de l'outil de vérification — recontrôle manuel nécessaire) ; et l'archive DGS-Urgent, elle, **se charge mais ne contient que les années 2020-2021** — elle est de fait inexploitable pour produire W30/W31 en rétrospectif, indépendamment de tout blocage technique. DGS-Urgent reste dans le socle hebdomadaire pour l'usage courant (alerte e-mail, à partir de `2026-W32`) ; c'est seulement son usage rétrospectif en S3/S4 qui est compromis, cf. « Non retenues » n'est pas le bon traitement ici — signalé plutôt qu'écarté, puisque le canal (alerte e-mail) fonctionne toujours en marche courante.

---

## Non retenues, et pourquoi

| Source | Motif |
| --- | --- |
| Medicine Central (Unbound Medicine) | Mal catégorisée : c'est une référence de point de soin (5-Minute Clinical Consult, Davis's Drug Guide, Diagnosaurus intégrés) — pas de flux de nouveautés à surveiller. Confirmé par recherche : produit orienté consultation à l'instant du soin, pas veille. |
| Epitomed (epitomed.com) | La médecine générale ne figure pas dans ses 13 spécialités (cardio, neuro, onco, pneumo, infectio, rhumato, gastro, endocrino, néphro, pédiatrie, urgences, dermato, anesthésie-réa) — orientation spécialités hospitalières. Tri annoncé combinant nouveauté, type d'étude, **facteur d'impact du journal** et pertinence sémantique : le raccourci exact (prestige de la revue plutôt que niveau de preuve) contre lequel la méthode du projet est construite. |
| ACP Journal Club | `paywall — pas d'accès` (contenu ACP réservé aux abonnés/membres). |
| NEJM Clinician (ex-NEJM Journal Watch, renommé en novembre-décembre 2025) | `paywall — pas d'accès`. Redondant de toute façon avec les agrégateurs EBM déjà en Tier 1 (Minerva, Cochrane, EvidenceAlerts, BMJ EBM). |
| The Medical Letter | `paywall — pas d'accès`. Source américaine : si jamais réintégrée malgré le paywall, la colonne « à parcourir » devrait porter la mention « contrôle de disponibilité FR obligatoire sur chaque item médicamenteux » (le projet s'est déjà fait piéger sur linagliptine/alogliptine, jamais commercialisées en France). |
| Prescriber's Letter (renommé « Prescriber Insights ») / Pharmacist's Letter (TRC Healthcare) | `paywall — pas d'accès`. Mêmes réserves américaines que The Medical Letter. |
| Essential Evidence Plus / InfoPOEMs | `paywall — pas d'accès`. |
| BiBL (bibl.fr) | Retirée le 2026-07-31 (arbitrage Thibault) : ne recouvre pas les thèmes MG retenus. Initialement listée en Tier 1 *repérage seul* sur la foi de la liste d'entrée fusionnée en T-093, mais sans flux RSS ni archive datée (déjà signalé comme inexploitable pour W30/W31) et sans couverture MG constatée à l'usage. |
| Veille IRDES (irdes.fr) | Candidate proposée le 2026-07-31 (inspirée de la méthode de veille de Médicalement Geek), vérifiée en ligne mais **écartée** : accès libre, archive mensuelle très structurée (2013-2026), RSS existant (`irdes.fr/fils-rss.html`) — bon dossier sur la forme, mais le fond est **économie de la santé / organisation des soins** (assurance maladie, démographie médicale, e-santé, hôpital, inégalités, politique de santé, systèmes de santé), **aucun des 9 thèmes cliniques MG retenus** n'y est couvert. |

---

## Hors périmètre de production actuel

Sources listées dans `BRIEF_VEILLE.md` §8 pour d'autres professions que le médecin généraliste — elles
ont leur place ici pour mémoire, mais ne couvrent aucun des 9 thèmes MG et ne sont donc **pas
vérifiées en ligne dans cette session** (hors périmètre T-093) :

| Source | Profession / thème visé | Statut de vérification |
| --- | --- | --- |
| CNGOF | Santé-femme / périnatalité | inconnu — non vérifiée (hors périmètre MG de cette session) |
| HAS maternité | Santé-femme / périnatalité | inconnu — non vérifiée (sous-ensemble de HAS, hors périmètre MG) |
| SFFPC (plaies et cicatrisation) | Soins infirmiers (IDEL) | inconnu — non vérifiée (hors périmètre MG) |
| Revues IDEL (non nommées dans le brief) | Soins infirmiers (IDEL) | inconnu — non identifiées précisément par `BRIEF_VEILLE.md` §8 lui-même (« à identifier ») |
| Sociétés/revues d'orthophonie (non nommées dans le brief) | Orthophonie | inconnu — non identifiées précisément par `BRIEF_VEILLE.md` §8 lui-même (« à identifier ») |

**Point tranché le 2026-07-31** : le thème MG `geriatrie-deprescription` n'avait aucune société savante
dédiée dans la liste initiale (contrairement à `infectiologie-antibiotherapie`, couvert par SPILF).
Thibault a arbitré l'ajout de la **SFGG** (https://sfgg.org/, Tier 2), vérifiée en ligne le
2026-07-31 : accès libre pour l'essentiel, flux RSS confirmé (`sfgg.org/feed/`) mais bruité (mélangé à
des offres d'emploi), page « Recommandations » sans date ni archive navigable. Elle complète la
couverture transversale existante (Minerva, Prescrire, Cochrane, EvidenceAlerts) sans la remplacer —
voir la ligne SFGG du Tier 2 ci-dessus pour le détail.

---

**État de cette liste : candidate, non validée — élaguée par contact en S3/S4.**
