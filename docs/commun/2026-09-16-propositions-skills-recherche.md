# Améliorer les skills de recherche d’EBM MSP

Rapport du **16 septembre 2026** — propositions à discuter, sans modification des skills ni du code.
Complété le **24 septembre 2026** : faits nouveaux, sources externes, inventaire des incidents du
dépôt et propositions N1–N8 (§13).

## 1. Recommandation

**Conserver les quatre skills métier et renforcer leurs contrats de recherche et de vérification.** Le projet dispose déjà d’un circuit plus adapté à l’EBM que les collections généralistes : source primaire obligatoire, distinction repérage/preuve, appréciation critique, contradiction, validation humaine avant intégration dans la décision.

Les trois apports les plus utiles sont :

1. Une recherche **rejouable et bornée**, avec requêtes, périmètre, exclusions et critères d’arrêt explicites.
2. Une traçabilité **par affirmation**, reliant chaque conclusion à la pièce réellement lue, plutôt qu’au seul article cité.
3. Un usage **explicite et évalué des modèles OpenEvidence**, avec modèle demandé, modèle constaté et gain réel mesuré après vérification.

Je recommande d’adapter quelques mécanismes de Superpowers, K-Dense et Research Hub, sans installer leurs workflows complets. Les recommandations ci-dessous sont des propositions propres à EBM MSP ; elles n’ont pas été testées sur ses circuits.

## 2. Périmètre et méthode de l’audit

Lecture des quatre skills dans `.claude/skills/` : `recherche-source-primaire`, `recherche-preuve-triangulee`, `verif-source-veille`, `tri-boite-mail`. Confrontation avec `CLAUDE.md`, les documents de cadrage, `docs/veille/SOP_veille.md`, `GRILLE_APPRECIATION.md`, `docs/decision/00-global.md`, `CONSTRUIRE-UN-MODULE.md` et un rapport historique de contradiction sur la statine chez le sujet très âgé.

Lecture de `docs/commun/OUTIL-INTERFACE-OE.md`, des instructions du dépôt voisin Interface-OE et de son parseur CLI `src/cli/index.ts`. Consultation des deux dépôts proposés, puis des fichiers sources des skills retenus. Les liens externes ont été consultés le 16 septembre 2026 ; leurs branches sont évolutives, aucune révision n’a été installée ou figée.

**Limites :** audit documentaire, sans essai comparatif des agents, sans interrogation clinique d’OpenEvidence, sans connexion au compte et sans installation. Les performances annoncées par les fournisseurs ne constituent pas une validation locale. Les recommandations cliniques du dossier historique n’ont pas été réévaluées : il sert uniquement à identifier des modes d’erreur.

## 3. Ce que le projet fait déjà bien

| Élément existant | Conséquence pour les propositions |
|---|---|
| Table maîtresse avec population exacte, effets, horizon, GRADE et accès | La compléter, éviter une deuxième table concurrente |
| Agent A et contradicteur B ; circuit distinct pour une question et pour un article | Préserver cette distinction |
| Vérification des chiffres à la page ou au tableau | Formaliser le lien par affirmation et le rendre contrôlable |
| Registres, protocole/SAP, recherche de preprints | Améliorer les statuts d’accès et de version |
| Journal de screening, exclusions, reports bornés en veille | Étendre la traçabilité des requêtes à la recherche Décision ; ne pas réinventer le screening |
| Taxonomie des incertitudes dans `CONSTRUIRE-UN-MODULE.md` | La faire appliquer par la boucle de recherche |
| Errata/rétractations déjà prévus par la SOP §10 | Ajouter une vérification explicite avant réutilisation |
| Archives Markdown, zéro donnée patient, validation humaine des nœuds | Garder ces invariants pour chaque adaptation |

Le rapport historique `docs/decision/validation/chantier-2026-07-26/redteam-preuve-statine-sujet-tres-age.md` contient notamment une erreur partagée entre Agent A et OE, ainsi qu’une omission de l’agent comblée par OE. C’est un argument local pour une comparaison sur pièces, et non pour un vote entre réponses.

## 4. Ressources communautaires retenues

`awesome-claude-code` est un **catalogue de découverte**, pas un standard de qualité médicale. Sa rubrique recherche conduit notamment à K-Dense et AI Research Skills. Les recommandations suivantes reposent sur les fichiers des projets eux-mêmes. [Catalogue consulté](https://github.com/hesreallyhim/awesome-claude-code#research--scientific-inquiry).

| Ressource inspectée | Mécanisme utile | Adaptation proposée / limite |
|---|---|---|
| Superpowers — `writing-skills` | Tester le comportement avec et sans skill ; descriptions centrées sur les déclencheurs ; références séparées | Constituer des cas d’échec EBM et alléger les entrées, sans importer le workflow de développement |
| Superpowers — `verification-before-completion` | Exiger une preuve observée avant d’annoncer un résultat | Vérifier chaque affirmation décisionnelle et annoncer explicitement les points non contrôlés |
| K-Dense — `literature-review` | Périmètre préalable, requêtes datées, sélection documentée | Ajouter un journal de recherche proportionné ; ne pas qualifier automatiquement la recherche de « revue systématique » |
| K-Dense — `citation-management` | Normaliser les identifiants et dédupliquer les références | Relier DOI, PMID, PMCID, identifiant d’essai et versions, sans confondre identité bibliographique et validité d’une conclusion |
| K-Dense — `scientific-critical-thinking` | Distinguer méthodes, biais, statistiques et portée des affirmations | Compléter les angles de contradiction, en conservant la grille EBM locale |
| Research Hub — `literature-triage-matrix` | Comparer les études dans une matrice persistante, avec identifiants stables | Enrichir la table existante et conserver les contradictions ; rejeter les raccourcis de lecture |

Sources directes : [writing-skills](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md), [verification-before-completion](https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md), [literature-review](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/literature-review/SKILL.md), [citation-management](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/citation-management/SKILL.md), [scientific-critical-thinking](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/scientific-critical-thinking/SKILL.md), [literature-triage-matrix](https://github.com/WenyuChiou/research-hub/blob/master/skills/literature-triage-matrix/SKILL.md).

### Ce que je ne reprendrais pas

- **L’installation globale de Superpowers** : elle superposerait un workflow de développement à celui déjà vendoré sous `.claude/`.
- **Le skill K-Dense `literature-review` tel quel** : il impose notamment des figures générées par IA et privilégie un outillage externe spécifique. Ces obligations n’améliorent pas la preuve clinique et ajoutent des dépendances. Sa préférence pour les travaux très cités ne doit pas devenir un critère de qualité EBM.
- **Les raccourcis de Research Hub** : son skill autorise le recours aux connaissances du modèle pour des articles connus, privilégie des notes secondaires et limite la lecture des PDF. Ce n’est pas acceptable pour confirmer les résultats décisionnels du projet.
- **Un dispositif complet Zotero/Obsidian/NotebookLM** : les fichiers versionnés répondent déjà au besoin immédiat. Une bibliothèque documentaire pourra être étudiée si leur volume devient problématique.

Ces limites sont observables dans les [instructions K-Dense](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/literature-review/SKILL.md) et [Research Hub](https://github.com/WenyuChiou/research-hub/blob/master/skills/literature-triage-matrix/SKILL.md). Avant toute copie future : vérifier la licence du fichier et de ses dépendances, conserver les attributions, noter la révision et relire les mises à jour. Les skills externes sont ici des objets d’étude, pas des instructions activées.

## 5. Propositions prioritaires

### P0 — Corriger la qualification de l’accès et des outils

**Constat local :** `recherche-source-primaire` indique d’abord que `is_open_access: false` avec `pmc_id: null` confirme l’inaccessibilité, puis explique correctement qu’une absence de PMCID n’implique pas un paywall. Ces consignes peuvent conduire à des reports contradictoires.

**Proposition :** distinguer `non récupéré`, `échec technique`, `résumé accessible`, `texte intégral accessible`, `paywall constaté sur cette voie`, `accès restant à vérifier`. L’absence de PMC ne ferme que cette voie. Vérifier aussi l’éditeur et, si nécessaire, un dépôt légitime ou l’accès du référent. L’aide PubMed distingue les liens vers PMC et vers d’autres fournisseurs de texte intégral. [Documentation NLM](https://pubmed.ncbi.nlm.nih.gov/help/).

Distinguer aussi **outil de transport**, **document récupéré** et **résumé généré** : un texte primaire obtenu par connecteur reste primaire ; une synthèse générée ne le devient pas parce qu’elle cite un PMID.

Remplacer la liste supposée de connecteurs disponibles par un contrôle léger des capacités réellement exposées dans la session. Isoler les noms d’outils, tarifs, quotas et volumes de bases dans des fiches datées : leurs valeurs actuelles ne sont pas vérifiées par cet audit.

**Cibles :** `recherche-source-primaire` et ses références. **Acceptation :** un cas sans PMCID mais accessible chez l’éditeur n’est plus classé inaccessible ; un outil absent ne déclenche pas des appels inventés.

### P0 — Borner la boucle par la nature de l’incertitude

**Constat local :** le skill triangulé demande de boucler jusqu’à résolution des points décisionnels. Or la documentation du projet distingue déjà lacune de preuve, sourçage manquant et arbitrage humain.

**Proposition :** avant chaque relance, classer le point et annoncer ce que la requête suivante pourrait effectivement changer.

| Situation | Suite proposée |
|---|---|
| Source probablement disponible mais non consultée | Recherche ciblée avec voie d’accès nommée |
| Désaccord vérifiable entre rapports | Retour au passage source litigieux |
| Aucune étude pertinente retrouvée après le périmètre prévu | Consigner la lacune et les limites de couverture ; ne pas transformer ce résultat en preuve d’absence |
| Arbitrage de valeur ou de formulation | Présenter les options au référent |
| Blocage d’accès ou budget épuisé | Livrer un état partiel avec condition précise de reprise |

La fermeture d’une recherche ne signifie pas la validation d’un nœud : une affirmation essentielle non étayée reste bloquée ou doit être retirée/reformulée avec validation humaine. En veille, conserver la règle des deux reports et les conditions de reclassement de la SOP.

**Cibles :** étape 3 de `recherche-preuve-triangulee`, cohérence avec `00-global.md`. **Acceptation :** chaque point ouvert possède une nature, une prochaine action utile ou un motif d’arrêt. Corriger aussi les renvois incohérents P4/P5 : la collecte est P4 dans le procédé actuel.

### P1 — Rendre la recherche rejouable

Pour chaque question ouverte, compléter le PICO par : décision à éclairer, horizon, critères patients prioritaires, types d’études pertinents, restrictions justifiées, date limite et couverture prévue. Conserver les vignettes gelées comme point de départ de P4.

Ajouter au dossier existant un journal léger : **base/interface, requête exacte, date, filtres, nombre de résultats affichés, nombre effectivement examinés, références retenues/exclues et motif**. Si l’outil ne fournit pas de total, écrire « non disponible ». Prévoir synonymes, termes contrôlés quand appropriés, études citées et études citantes ; vérifier qu’une étude repère connue est retrouvée.

La couverture dépend de la question : PubMed et registres pour une intervention, sources professionnelles officielles pour les recommandations, autres bases si elles apportent un complément. Deux interfaces interrogeant le même corpus ne valent pas deux recherches indépendantes. Ne pas imposer un nombre de bases pour remplir une case.

**Inspiration :** traçabilité de `literature-review`, adaptée à une recherche clinique ciblée. **Cibles :** triangulation et recherche primaire ; en veille, enrichir le journal existant. **Acceptation :** un autre lecteur peut comprendre et rejouer la recherche, y compris les recherches sans résultat.

### P1 — Relier les affirmations aux pièces consultées

Compléter la table maîtresse plutôt que la remplacer. Un article peut étayer plusieurs affirmations avec des statuts différents.

Champs proposés : identifiant d’affirmation, sous-question/vignette, formulation exacte, étude et version, passage/page/tableau, mode d’accès, donnée extraite, calcul éventuel, statut de vérification, contradiction et destination envisagée.

Séparer trois axes : **identité de la référence**, **accès au passage utile**, **solidité de l’inférence**. Un DOI valide n’établit pas que l’article soutient la phrase ; un texte intégral disponible n’établit pas la qualité méthodologique.

Relier les publications issues d’un même essai par son identifiant de registre : essai princeps, sous-groupe, suivi prolongé et preprint ne constituent pas quatre confirmations indépendantes. Ajouter un contrôle daté des corrections/rétractations et préciser la relation entre preprint et publication finale. Cette vérification opérationnalise la SOP §10.

**Inspiration :** normalisation bibliographique de K-Dense et matrice comparative de Research Hub ; granularité clinique proposée pour EBM MSP. **Acceptation :** toute phrase décisionnelle peut être suivie jusqu’à un passage effectivement consulté, ou porte explicitement son impossibilité de vérification.

### P1 — Renforcer l’indépendance utile de la contradiction

Le circuit veille protège déjà l’indépendance A/B. Pour les questions Décision à fort enjeu, proposer à B une première lecture de la question et des pièces avant de lui révéler les conclusions A/OE. Il note les critères, chiffres et réserves attendus, puis confronte les rapports. Cette passe peut être limitée aux affirmations décisives pour maîtriser le coût.

Pour OE, générer le prompt depuis les sous-questions cliniques en évitant d’y injecter la conclusion attendue. Si A fournit une liste d’essais à vérifier, le noter comme recherche complémentaire guidée, et non comme découverte indépendante.

Conserver les confirmations obtenues et les objections retirées. Ajouter, si pertinent, une recherche ciblée de résultat contradictoire ou de suivi ultérieur. **Plusieurs modèles peuvent partager les mêmes sources et les mêmes erreurs : leur accord n’augmente pas mécaniquement le niveau de preuve.**

**Cible :** `recherche-preuve-triangulee`. **Acceptation :** les erreurs communes A/OE restent détectables et la provenance des conclusions est visible. Aucun changement de validation humaine ou de circuit §7/§7bis n’est proposé ici.

### P1 — Encadrer les chiffres dérivés et la certitude

La demande systématique d’effets absolus est utile, mais peut pousser l’agent à produire un NNT quand les données ne le permettent pas. Exiger la distinction **valeur publiée / recalculée / non calculable** et, pour tout calcul, ses données d’entrée, son horizon et sa méthode.

Conserver le type d’estimation original : HR, RR et OR ne sont pas interchangeables ; distinguer risque cumulé et taux d’événements. Une conversion ne doit pas être improvisée. Prévoir une justification par critère de jugement et ensemble d’études pour la certitude, au-delà de l’appréciation de chaque article. [Cochrane, mesures d’effet](https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-06).

**Cibles :** table de preuve, prompt OE et grille de contradiction. **Acceptation :** l’absence d’un NNT calculable constitue une sortie valide ; aucun chiffre recalculé n’est présenté comme extrait de l’article.

### P2 — Organiser la réutilisation sans figer une preuve périmée

La règle actuelle de ne pas refaire un travail vérifié est bonne. La compléter par la date de dernière recherche, le périmètre couvert et les événements justifiant une mise à jour : nouvelle publication, résultats d’un essai attendu, correction, changement de recommandation ou extension du PICO.

Réutiliser les extractions déjà vérifiées quand elles restent pertinentes ; mener une recherche de nouveautés datée plutôt que relire systématiquement tout le corpus. Les recommandations françaises restent nécessaires à l’applicabilité locale, même si elles sont exclues du prompt OE pour éviter les doublons.

**Cibles :** triangulation, recherche primaire et dossiers de preuve existants. **Acceptation :** chaque réutilisation dit ce qui est repris, ce qui a été actualisé et ce qui reste hors périmètre.

## 6. OpenEvidence : intégrer les modèles explicitement

### État documentaire vérifié

Le communiqué d’OpenEvidence du **3 septembre 2026** annonce Osler, Sackett et Snow en production, et Darwin en aperçu de recherche sur candidature. Il présente Osler comme modèle par défaut, Sackett pour une recherche plus approfondie, Snow comme successeur de Deep Consult. Les latences indiquées sont approximatives et annoncées par l’entreprise. Le communiqué primaire a été lu dans sa republication Business Wire ; les pages directes OE et Business Wire n’ont pas été récupérées par l’outil. [Communiqué OpenEvidence republié](https://knoetv.marketminute.com/article/bizwire-2026-9-3-introducing-the-openevidence-model-family).

| Modèle | Positionnement annoncé | Usage proposé pour EBM MSP, à évaluer |
|---|---|---|
| **Osler** | Réponse rapide, environ 5 s | Repérage étroit ou identification d’une référence ; inutile si une recherche bibliographique directe suffit |
| **Sackett** | Examen approfondi, environ 30 s ; peut demander du contexte | Premier candidat pour une question EBM ciblée avec plusieurs preuves à comparer |
| **Snow** | Investigation prolongée, environ 5 min | Question large ou controversée, corpus dispersé, lacune précise après une première collecte |
| **Darwin** | Accès recherche restreint | Hors circuit standard ; ne pas le supposer disponible sur le compte |

Le positionnement produit ne prouve ni une supériorité locale ni l’indépendance des modèles. Aucun classement de fiabilité clinique n’est déduit des benchmarks annoncés. L’accès effectif du compte à chaque modèle reste à constater.

### Politique proposée

**Ne pas exécuter Osler → Sackett → Snow automatiquement.** Choisir directement le modèle adapté à la question et au budget autorisé ; ne monter en profondeur que pour une lacune identifiée. Sackett est une hypothèse de défaut pour la triangulation, pas une recommandation déjà validée par mesure.

Documenter à chaque retour : modèle demandé, modèle réellement observé, date, prompt exact, lien de conversation, caractère neuf ou poursuivi de la conversation, durée, complétude, références proposées et apport après vérification. Si le modèle n’est pas observable, écrire « inconnu » plutôt que l’inférer de la vitesse.

Une demande de contexte de Sackett est un état intermédiaire : rester sur une question clinique générique, sans donnée patient, et ne pas traiter cette demande comme une réponse finale. Snow nécessite une détection fiable de fin de génération ; le temps écoulé seul ne prouve ni la complétude ni un échec.

### Écart technique constaté

Le parseur local `Interface-OE/src/cli/index.ts` expose la question, `--output`, `--conversation`, `--no-launch` et `--json`. Il rejette les options inconnues : **aucune option de sélection de modèle n’existe dans ce fichier**. La documentation EBM MSP ne décrit pas davantage cette sélection. Aucune session réelle n’a été ouverte pour vérifier le comportement de l’interface.

> **Mise à jour du 24 septembre — dépassé.** Interface-OE accepte `--modele osler|sackett|snow`
> depuis le 17 septembre et écrit le modèle constaté en tête de la réponse ; les conséquences 1 et 2
> ci-dessous sont en grande partie traitées côté Interface-OE, pas encore dans la doc d’EBM MSP.
> Détail : §13.1 et N1.

Conséquences proposées :

1. À court terme, si un modèle particulier est nécessaire, le sélectionner et le constater dans l’interface avec le référent ; sinon conserver « modèle inconnu ». Ne pas ajouter une commande fictive au skill.
2. Dans un chantier Interface-OE distinct, étudier sélection et confirmation du modèle, persistance de ce choix dans l’archive, état « clarification requise » et complétude des réponses longues.
3. Une fois ces capacités démontrées, actualiser le mode d’emploi partagé, puis les deux skills qui appellent OE.

Les règles actuelles restent applicables : budget et questions autorisés, appels séquentiels, aucun recours à une API interne, arrêt sur défi anti-robot, zéro donnée patient. La disponibilité de plusieurs modèles ne justifie aucune rafale supplémentaire.

## 7. Architecture documentaire proposée

Conserver les quatre points d’entrée. Ajouter leurs références progressivement, sans créer d’emblée une nouvelle collection de skills :

| Emplacement à faire évoluer ultérieurement | Contenu |
|---|---|
| `recherche-source-primaire` | États d’accès, identité/version, découverte des capacités disponibles |
| Ses références | Fiches datées par outil et règles de recherche bibliographique |
| `recherche-preuve-triangulee` | Cadrage, journal, affirmations, indépendance, critères d’arrêt |
| `verif-source-veille` | Réutilisation des mêmes statuts et vérification des chiffres dérivés |
| `tri-boite-mail` | Changements limités : conserver les identifiants trouvés et tracer les doublons d’étude |
| `docs/commun/OUTIL-INTERFACE-OE.md` | Autorité unique pour modèles, capacités observées et règles d’usage |
| Dossiers de validation existants | Journal et registre de preuves au sein du chantier, sans nouvel entrepôt concurrent |

Réserver un éventuel nouveau skill `actualiser-dossier-preuve` au moment où ce travail devient récurrent. Des descriptions courtes indiqueraient quand charger chaque skill ; les procédures et cas limites resteraient dans le corps ou les références. C’est une adaptation du principe de déclenchement et de chargement progressif de Superpowers, à éprouver sur les prompts réels du projet.

## 8. Évaluation proposée avant adoption

Préparer un petit corpus figé à partir des incidents historiques, avec résultat attendu relu par le référent. Comparer le circuit actuel et sa version candidate sur les mêmes pièces, en notant modèle, date, outils et budget. Une exécution unique ne suffit pas à caractériser un comportement variable.

| Cas d’épreuve | Comportement attendu |
|---|---|
| Article sans PMCID, disponible chez l’éditeur | Aucun report prématuré |
| DOI réel mais article ne soutenant pas l’affirmation | Citation rejetée pour cette affirmation |
| Même essai dans trois publications | Une seule famille d’étude, rôles distingués |
| Protocole ou essai terminé sans résultats | Aucune conclusion d’efficacité inventée |
| A et OE donnent la même valeur erronée | Correction par retour au passage source |
| HR seul, sans données suffisantes de risque absolu | NNT non calculable, sans invention |
| Désaccord clinique non résoluble par une recherche | Arbitrage transmis, boucle interrompue avec motif |
| Rapport ancien, étude nouvelle ou correction | Actualisation explicite du périmètre concerné |
| OE incomplet, clarification ou modèle non identifié | Statut visible ; aucune validation implicite |
| Pression pour conclure malgré accès partiel | Limite maintenue dans la conclusion |

Mesurer : erreurs majeures restantes, affirmations décisionnelles avec passage vérifié, omissions importantes, faux reports, objections infondées, temps de relecture humaine, nombre de requêtes et coût. L’objectif n’est pas de maximiser le nombre de citations ni la longueur du rapport.

Pour OE, proposer ensuite un **pilote séparé soumis au budget du référent**, par exemple trois questions figées comparées entre modèles accessibles, en nouvelles conversations et séquentiellement. Un lecteur vérifie les sorties sans connaître le modèle quand c’est possible. Mesurer surtout les sources pertinentes supplémentaires et les erreurs après contrôle. Ce pilote n’a pas été exécuté.

## 9. Ordre d’adoption conseillé

> Révisé le 24 septembre : §13.6.

| Lot | Contenu | Effort relatif | Condition de réussite |
|---|---|---|---|
| **1 — Corriger** | Statuts d’accès, outils réellement disponibles, P4/P5, nature des incertitudes | Faible | Disparition des contradictions documentaires sans assouplissement des exigences de preuve |
| **2 — Tracer** | Journal rejouable, registre par affirmation, familles d’études, calculs | Modéré | Un dossier pilote se relit sans reconstituer la recherche à partir du chat |
| **3 — Éprouver** | Cas d’échec comparés avant/après ; coût de la contradiction | Modéré | Aucun défaut majeur sur le corpus d’acceptation, sans régression sur les cas déjà réussis |
| **4 — Adapter OE** | Confirmation des capacités de l’interface, sélection/archivage, pilote des modèles | Modéré à élevé, dépend d’Interface-OE | Modèle effectif et complétude observables ; gain mesuré avant généralisation |
| **5 — Entretenir** | Actualisation ciblée et revue des fiches outils | Récurrent, limité | Réutilisation des preuves sans maintien silencieux d’informations périmées |

Ces lots décrivent des suites possibles. **Ce rapport est le seul livrable créé : aucun skill installé ou modifié, aucun code écrit, aucune requête clinique OE consommée.**

## 10. Complément : une skill d’agrégation et de réconciliation des preuves

**Oui : je recommande une skill dédiée `consolider-preuves`, commune à Décision et Veille, avec un mode adapté à chacun.** Elle compléterait les quatre skills existantes. Elle formaliserait une responsabilité aujourd’hui répartie entre le rapport B, l’orchestrateur et, en veille §7bis, l’agent C. Cette proposition précise et étend l’architecture de la section 7.

### 10.1 Trois opérations à distinguer

| Opération | Question | Résultat attendu |
|---|---|---|
| **Agrégation** | Quelles données distinctes possédons-nous pour cette question ? | Ensemble organisé, sans doublons d’études, avec versions et provenance |
| **Réconciliation** | Pourquoi les extractions ou conclusions diffèrent-elles ? | Divergence corrigée, expliquée ou laissée ouverte avec motif |
| **Synthèse** | Que permet d’affirmer l’ensemble des preuves ? | Conclusion par population, comparaison, critère et horizon, avec certitude et limites |

Un résumé de rapports ne remplit pas ces trois fonctions. Le risque principal est qu’une synthèse fluide fasse disparaître un conflit ou transforme deux reprises d’une même source en confirmations indépendantes.

La distinction étude/publication et la résolution documentée des différences entre extractions sont cohérentes avec le [chapitre 5 du manuel Cochrane](https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-05). Le contrat opérationnel proposé ci-dessous est une adaptation au projet, pas une procédure Cochrane complète.

### 10.2 Contrat de la skill proposée

**Déclenchement :** plusieurs rapports ou sources doivent être consolidés pour une même décision, ou deux lectures d’un article divergent. Pas nécessaire pour simplement retrouver une référence.

**Entrées :** question et sous-questions, périmètre clinique, table maîtresse, rapports d’extraction et de contradiction, retour OE s’il existe, pièces accessibles, arbitrages antérieurs et destination du livrable. Chaque entrée porte une date/version. Une pièce absente reste absente : le réconciliateur ne complète pas de mémoire.

**Autorité :** la skill organise le travail ; elle ne change pas qui valide. En Décision, elle prépare le dossier pour le référent. En veille §7, l’orchestrateur réconcilie ; en §7bis, C conserve le rôle défini par la SOP et D61. Elle ne déclenche donc pas systématiquement un agent supplémentaire.

**Sortie :** le dossier consolidé et un journal des divergences, avec un verdict par sous-question. Pas de YAML clinique, de classement définitif hors mandat ni de publication automatique.

### 10.3 Procédure proposée

1. **Figer les entrées du passage.** Lister les rapports et versions consultés. Garder les extractions A/B originales afin de pouvoir expliquer une correction ultérieure.
2. **Regrouper les familles d’études.** Associer princeps, sous-groupes, suivi, protocole et corrections. Cartographier aussi le recouvrement des essais entre revues systématiques : une revue et ses essais inclus ne sont pas des preuves indépendantes à additionner.
3. **Former des groupes comparables.** Organiser les données par population, intervention, comparateur, critère, horizon et type d’analyse. Garder visibles les écarts de définition au lieu de les aplatir dans un effet unique.
4. **Dresser le journal des divergences.** Inscrire les deux affirmations exactes, leurs sources, la catégorie de conflit, l’enjeu pour la décision et la pièce nécessaire pour trancher.
5. **Résoudre sur pièces.** Rouvrir les passages concernés ; corriger les erreurs d’extraction ; conserver séparément les résultats réellement différents. Une recherche complémentaire doit répondre à un manque précis et respecter le budget, notamment OE.
6. **Synthétiser par résultat pertinent pour le patient.** Présenter bénéfices, dommages, applicabilité et incertitudes, sans note globale calculée à partir des avis des agents.
7. **Préparer le transfert.** Donner les formulations soutenables, celles à exclure, les arbitrages humains et les points empêchant la suite. Relier chaque conclusion à ses affirmations sources et aux vignettes concernées.

### 10.4 Une typologie des divergences qui dicte l’action

| Divergence | Action du réconciliateur |
|---|---|
| DOI, PMID ou identité d’essai différents | Vérifier la correspondance bibliographique avant de comparer les chiffres |
| Deux chiffres pour le même résultat | Vérifier tableau, population d’analyse, horizon, version et correction éventuelle |
| HR présenté comme RR, taux comme risque, ITT comme per-protocole | Restaurer la mesure et l’analyse originales ; ne pas harmoniser par simple renommage |
| Populations, comparateurs ou critères différents | Séparer les conclusions : il peut ne pas y avoir de contradiction |
| Essais comparables donnant des résultats différents | Décrire l’incohérence, les biais et l’imprécision ; ne pas choisir celui qui confirme le dossier |
| Recommandations divergentes | Comparer question, date de recherche, corpus, méthode et contexte d’application |
| Rapport d’agent contredisant une source | Corriger le rapport, avec le passage qui justifie la correction |
| Pièce décisive inaccessible | Laisser le point non vérifiable ; identifier ce qui débloquerait la conclusion |
| Préférence clinique ou choix de conception | Soumettre un arbitrage ; ne pas chercher une « source gagnante » |

**Pas de hiérarchie automatique « document le plus récent = vérité ».** Un protocole renseigne la préspecification ; il ne prouve pas le résultat. Un erratum peut corriger une valeur ; une recommandation plus récente peut reposer sur un corpus plus ancien qu’une revue concurrente. Le choix de la pièce dépend du fait à établir.

Exemple fictif : A décrit un bénéfice à deux ans en population totale ; B ne retrouve pas de résultat concluant à un an dans un sous-groupe. La réconciliation doit d’abord séparer ces deux questions, puis déterminer laquelle correspond au périmètre du module. Faire la moyenne des deux conclusions n’a pas de sens.

### 10.5 Synthèse du corpus : les garde-fous supplémentaires

**Pas de méta-analyse automatique.** Le mode normal serait une synthèse structurée. Une estimation combinée demanderait un mandat, un protocole et une vérification méthodologique distincts. Éviter le vote « trois études positives contre deux négatives », en particulier lorsqu’il repose sur la significativité statistique. [Cochrane, synthèses sans méta-analyse](https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-12).

**Certitude par critère de jugement.** Ne pas moyenner les niveaux GRADE des articles. Apprécier l’ensemble pertinent en explicitant risque de biais, incohérence, indirectness/applicabilité, imprécision et biais de publication. Conserver l’étiquette « GRADE simplifié » du projet sans revendiquer une évaluation formelle complète. [Cochrane, certitude des preuves](https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-14).

**Trois plans séparés dans la conclusion :** ce que montrent les données ; ce que recommandent les organismes ; ce que le projet propose d’en faire. Une recommandation est la source de sa propre position, mais ne remplace pas les études qui étayent ses chiffres. Une décision de mise en œuvre ne doit pas être présentée comme un résultat expérimental.

**OE reste une voie de repérage et un rapport à contrôler.** Osler, Sackett et Snow ne constituent pas trois études ni trois votes indépendants. Leurs résultats alimentent les mêmes lignes de preuve, après vérification des sources.

### 10.6 Livrables et critères d’acceptation

Deux vues au sein du dossier existant suffisent :

- **Synthèse décisionnelle courte** : une ligne par sous-question, conclusion, certitude, population/horizon, limites et statut de validation.
- **Annexe de traçabilité** : familles d’études, résultats sources, divergences avec résolution motivée, conclusions abandonnées et actions restantes. Réutiliser la table maîtresse et les fichiers de réconciliation existants plutôt que recopier leurs données.

Une divergence peut porter les états `corrigée`, `expliquée par le périmètre`, `persistante entre études`, `non vérifiable` ou `arbitrage humain`. **« Réconciliation terminée » ne signifie pas « tout le monde est d’accord »** : cela signifie que chaque désaccord important a été traité et que son effet sur la conclusion est visible.

Cas d’acceptation à ajouter à la section 8 : deux méta-analyses partageant les mêmes essais ; conflit artificiel dû à des horizons différents ; recommandation récente mais recherche ancienne ; désaccord réel maintenu dans la synthèse ; nouvelle correction invalidant une conclusion antérieure. Toute divergence décisionnelle sans traitement explicite empêche de déclarer la consolidation complète.

## 11. Complément : une skill pour ouvrir un module sur un nouveau thème

**Je recommande `construire-module-decision`, une skill d’orchestration du procédé existant.** Sa valeur serait de faire respecter l’ordre, les livrables et les reprises, en appelant les skills spécialisées au bon moment.

### 11.1 Commencer par qualifier la demande

Dans ce projet, un **thème de veille**, un **domaine de décision** et un **module regroupant des nœuds** sont différents. La skill doit vérifier lequel est demandé. Ajouter un thème de veille renvoie à la taxonomie et à la SOP ; cela ne justifie pas une construction P0→P7. Un module D22 regroupe des nœuds et propose une orientation, sans imposer un chaînage obligatoire.

Pour un domaine de décision, établir une fiche courte : utilisateurs et situations de consultation, décisions à aider, périmètre exclu, référent compétent, sources institutionnelles pertinentes et liens avec les domaines déjà présents. Distinguer, par exemple, dépistage, confirmation diagnostique, traitement, surveillance et déprescription : les intentions du DT2 ne se recopient pas par défaut.

### 11.2 Un préalable documentaire réel

`docs/decision/CONSTRUIRE-UN-MODULE.md` affiche encore **« Non arbitrée — les étapes et les portes de sortie sont à valider par le référent avant d’engager le deuxième domaine »**, malgré plusieurs amendements et décisions particulières déjà actées, notamment D54.

Avant de rendre cette skill prescriptive, rapprocher le document des décisions en vigueur et distinguer : obligations déjà actées, proposition de procédé encore à arbitrer, références devenues historiques. Ne pas remettre en question toutes les décisions prises, mais ne pas traiter l’ensemble comme approuvé tacitement. Ce point concerne une future mise en œuvre ; il ne bloque pas le présent rapport.

### 11.3 Parcours proposé et livrables

| Phase | Travail de la skill | Sortie / porte |
|---|---|---|
| **P0 — Préparer** | Vérifier les prérequis génériques réels, le catalogue des critères et la compatibilité du type de décision avec le moteur | État des prérequis avec preuves et écarts ; aucune promesse de réutilisation sans vérification |
| **P1 — Cadrer** | Recueillir les intentions et l’existant écrits par le référent ; préparer le découpage et l’ouverture du vocabulaire commun de sécurité | Périmètre, nœuds/modules, méthode de mesure et conventions explicités |
| **P2 — Figer les situations** | Organiser les vignettes et signaler les situations manquantes ; les sorties attendues restent celles du référent | Contrat clinique daté, sans DSL ni conditions techniques |
| **P3 — Éprouver l’écran** | Faire examiner trois situations sur une maquette au contenu fictif clairement identifié | Validation du langage et de l’organisation, distincte de la validation EBM |
| **P4 — Sourcer et consolider** | Dériver les sous-questions des vignettes ; appeler `recherche-preuve-triangulee`, puis `consolider-preuves` | Dossier consolidé ; points bloquants, limites et arbitrages explicites ; validation clinique avant encodage |
| **P5 — Encoder** | Dresser d’abord la table prévue des options/conditions, puis produire le contenu conforme à la grammaire | Table antérieure au YAML, contenu et argumentaire cohérents, validations techniques |
| **P6 — Vérifier** | Distinguer fidélité aux preuves et comportement ; comparer table prévue/régénérée ; vérifier la sécurité à l’échelle du domaine | Écarts justifiés, contrôles requis satisfaits, aucune conclusion globale fondée seulement sur la compilation |
| **P7 — Recetter** | Organiser recette référent et navigateur, y compris retours arrière et changements d’intention | Recettes closes sans défaut grave ouvert, dans le périmètre de publication autorisé |

Le document actuel réserve P1 au référent « sans agent et sans source ». La skill doit respecter cette origine du contenu : présenter les champs à renseigner et détecter ce qui manque, sans fabriquer les intentions cliniques. Une assistance plus active à cette rédaction serait un amendement à discuter explicitement.

Les vignettes doivent être **synthétiques, non identifiantes**, même si elles s’inspirent de situations habituelles. La formulation actuelle « patients réels » de P2 ne doit jamais être interprétée comme une autorisation d’enregistrer des dossiers patients : l’invariant zéro donnée patient reste prioritaire.

### 11.4 Ce que cette skill apporterait au-delà d’une checklist

**Un état de chantier unique.** Noter la phase courante, la prochaine action, les livrables et versions, les validations obtenues et les blocages. À la reprise, vérifier les pièces ; ne pas redémarrer la recherche ni considérer une case cochée comme preuve suffisante.

**Une chaîne traçable.** Relier intention → vignette → question de preuve → conclusion validée → option → vérification du comportement. Repérer aussi une recherche ne servant aucune décision et une option ne correspondant à aucune vignette.

**Une règle de réouverture.** Si P4 contredit une sortie attendue en P2, produire le conflit et soumettre sa révision au référent ; ne pas forcer la littérature à satisfaire la vignette. Si P5 découvre une situation oubliée, rouvrir le contrat avant de changer la table. Un nouveau fait de sécurité impose de revoir les nœuds concernés via le vocabulaire commun et l’invariant associé.

**Une vérification entre domaines.** Comparer la définition, les unités et le sens des critères partagés ; une ressemblance de nom ne suffit pas. Rechercher les divergences légitimes de contexte et les contradictions involontaires avec les domaines existants.

**Une sortie légitime sans nouveau module.** À l’issue du cadrage, une fiche informative, un enrichissement d’un module existant ou un périmètre plus étroit peuvent mieux répondre au besoin. Pour une démarche diagnostique ou une logique temporelle nouvelle, vérifier d’abord si le moteur peut la représenter ; isoler une évolution du socle dans un chantier distinct si nécessaire.

### 11.5 Découpage de la skill et épreuves

Le fichier principal porterait déclencheurs, états, portes et règles de reprise. Des références contiendraient les gabarits de cadrage, vignettes, bilan des prérequis et clôture. `CONSTRUIRE-UN-MODULE.md` resterait l’autorité du procédé après clarification de son statut ; `GRAMMAIRE-NOEUD.md` resterait celle de l’écriture. Les commandes de contrôle doivent être vérifiées dans le dépôt courant, pas recopiées depuis des exemples historiques.

Épreuves proposées : demande de nouveau thème ambiguë ; prérequis générique manquant ; référent absent pour une attente clinique ; tentation de lancer OE avant P2 ; preuve contredisant une vignette ; sécurité affectant un autre nœud ; reprise après interruption ; YAML fidèle mais comportement incorrect. Réussir signifie aiguiller, préserver les validations et reprendre au bon endroit, pas produire du contenu à tout prix.

## 12. Priorité entre ces deux créations

1. **Spécifier puis éprouver `consolider-preuves` sur un dossier existant.** Son utilité est immédiate pour les deux circuits ; elle permet de mesurer si la synthèse devient plus vérifiable et plus rapide à relire.
2. **Clarifier le statut du procédé P0→P7 puis créer `construire-module-decision`.** La tester d’abord sur l’ouverture d’un domaine limité, en s’arrêtant aux portes nécessitant le référent.
3. **Conserver l’actualisation comme une capacité des dossiers**, avant d’en faire éventuellement une troisième skill. Éviter plusieurs points d’entrée ayant la même responsabilité.

Ces deux skills sont proposées, **pas créées**. Ce complément reste documentaire et n’engage ni construction d’un module ni recherche clinique.

## 13. Compléments du 24 septembre 2026

**Ce qui change pour toi.** Le rapport tient ; trois choses bougent.

1. **Une partie de §6 est dépassée** : Interface-OE choisit et constate le modèle OE depuis le
   17 septembre. Mais la doc d’EBM MSP l’ignore, et la commande qu’elle donne pointe vers un dossier
   absent de ce poste : lancée telle quelle, elle échoue avec le code que le skill lit comme
   « réponse OE incomplète ».
2. **Le corpus d’épreuve de §8 existe déjà** dans le dépôt : une trentaine d’incidents documentés,
   chacun avec le rapport qui l’a corrigé. L’évaluation peut rejouer les retours OE archivés sans
   consommer une seule requête.
3. **Les publications 2025-2026 confortent P1** (relier chaque affirmation au passage lu) : l’erreur
   la plus fréquente des outils d’IA n’est pas la référence inventée, c’est la référence réelle qui
   ne soutient pas la phrase — le dépôt en a trois cas confirmés.

S’y ajoutent huit propositions (N1–N8, §13.4) et une décision qui t’appartient (D1, §13.5 : la
future commande `article` d’Interface-OE face à l’invariant 7).

**Méthode.** Relecture des quatre skills, de `docs/decision/00-global.md` et du mode d’emploi OE ;
inventaire en lecture seule de `docs/decision/validation/`, `docs/veille/verifications-backlog/`, du
journal de boîte mail et de l’historique git des skills (par un agent ; cinq de ses constats
recontrôlés à la main) ; lecture du dépôt Interface-OE ; pages primaires consultées le 24 septembre
(liens ci-dessous). Aucune requête OE, aucun skill ni code modifié.

### 13.1 Faits nouveaux depuis le 16 septembre

| Fait constaté | Preuve | Conséquence |
|---|---|---|
| Le CLI accepte `--modele osler\|sackett\|snow`. Il lit le modèle affiché avant et après le choix, et écrit `- Modèle : <nom>` — ou `inconnu` — en tête du markdown. Modèle demandé mais introuvable sur la page : code 1, sans question consommée | Interface-OE, commit `a477c2b` (17/09) ; `src/cli/index.ts:42` ; `src/core/extraction/markdown.ts:57-58` ; `docs/utiliser-le-cli.md:43` | L’« écart technique » de §6 et ses conséquences 1-2 sont en grande partie traités. Restent à mettre à jour `OUTIL-INTERFACE-OE.md` et `recherche-preuve-triangulee`, qui ignorent l’option |
| Le chemin du CLI écrit dans le skill et le mode d’emploi (`C:/Users/kovu/SynologyDrive/Thibault/Projets/Interface-OE/…`) n’existe pas sur ce poste ; le dépôt à jour, CLI construit, est `C:\Users\Kovu\Projets\Interface-OE` | Contrôle d’existence du 24/09 | `node` sur un chemin absent sort en **code 1** — celui que le skill traduit par « réponse incomplète ». Un chemin mort se déguise en réponse OE tronquée |
| Le guide OE décrit Sackett en « quelques secondes à une minute » (le communiqué annonçait ~30 s) et comme plus enclin à **demander une précision** ; Snow en « cinq minutes ou plus », successeur de Deep Consult ; Darwin sur candidature ; choix par un sélecteur | [Guide OE — modèles](https://www.openevidence.com/user-guide/models), lu le 24/09 | Les latences ont déjà bougé : ne pas les figer dans un skill. La demande de précision confirme l’état « clarification requise » de §6 |
| Interface-OE prépare `interface-oe article <DOI>` : accès ouvert (Unpaywall, puis Europe PMC), **puis Sci-Hub en repli**, pour « les trois projets consommateurs ». Le plan en est à sa première session (noyau non écrit) | Interface-OE, `docs/decisions/2026-09-21-recuperer-un-article-par-doi.md:8-9,21-24` ; `plans/P12/index.md:30,69` | La branche Sci-Hub est incompatible avec l’invariant 7 et la règle d’ouverture de `recherche-source-primaire` (« jamais de contournement de paywall »). À trancher avant qu’elle n’existe : D1 |

### 13.2 Ce que les sources externes ajoutent

**Trois niveaux d’erreur de citation, qu’aucune vérification unique ne couvre.**

| Niveau | Question | Ce qu’on sait |
|---|---|---|
| Identité | L’identifiant écrit est-il le bon ? | Mesure locale : 6 PMID sur 7 tapés par OE faux, ses DOI justes (`00-global.md:103-111`) |
| Existence | La référence existe-t-elle ? | Lotan et al., *npj Health Systems* 2026 ([PMC13538487](https://pmc.ncbi.nlm.nih.gov/articles/PMC13538487/)) : 4 979 citations OE, aucune inventée, 3 erreurs d’attribution. Les auteurs précisent qu’ils **n’ont pas vérifié** que les références soutenaient les affirmations |
| Soutien | La référence porte-t-elle la phrase ? | SourceCheckup, Wu et al., *Nat Commun* 2025;16:3615 ([article](https://www.nature.com/articles/s41467-025-58551-6)) : selon le modèle, 50 à 90 % des réponses de LLM ne sont pas entièrement soutenues par les sources qu’elles citent. Dans le dépôt : trois mésattributions OE confirmées, références exactes mais rattachement faux (`validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md:310-313`) |

Conséquence : un outil « sans référence inventée » peut rester mal soutenu. Le troisième niveau est
le plus fréquent, et P1 (registre par affirmation) est la seule proposition qui l’attaque
directement : un argument pour ne pas le laisser attendre derrière le lot 1.

**OE sur questions complexes : une performance modeste, à mesurer avant d’en faire un réflexe.**
Jagarapu et al., préprint medRxiv, décembre 2025, **non relu par les pairs**
([lien](https://www.medrxiv.org/content/10.64898/2025.11.29.25341091v1)) : 100 scénarios de
surspécialité, 34 % de réponses exactes en recherche rapide, 41 % en Deep Consult. Petit
échantillon, anciens modèles ; il n’établit rien sur Snow, mais corrobore le statut de débroussaillage
et justifie le pilote de §8.

**Revues rapides Cochrane : on vérifie l’extraction, et l’omission se chiffre.** Nussbaumer-Streit
et al., *BMJ EBM* 2023 ([PMC10715469](https://pmc.ncbi.nlm.nih.gov/articles/PMC10715469/)) : une
personne extrait, **une seconde vérifie exactitude et complétude** ; même règle pour le risque de
biais ; un tri par une seule personne **manque environ 13 % des études pertinentes**, d’où un double
tri d’environ 20 % des références pour se calibrer. Le couple A/B couvre la vérification ; il ne
couvre pas l’omission : B attaque ce qu’A a trouvé, pas ce qu’A n’a pas trouvé. Les essais manqués du
dépôt (`redteam-preuve-statine-sujet-tres-age.md:90-104`, `CONCILIATION-passeA.md:108`) ont été
rattrapés par OE — par chance, pas par construction.

**IA et synthèses de preuve : les positions 2025 de Cochrane, Campbell, JBI et CEE.** Déclaration
commune (Flemyng et al. 2025, [PMC12603384](https://pmc.ncbi.nlm.nih.gov/articles/PMC12603384/)) et
position du groupe Revues rapides de Cochrane (Gartlehner et al. 2025,
[PMC12644243](https://pmc.ncbi.nlm.nih.gov/articles/PMC12644243/)) : les auteurs restent
responsables ; **aucune étape entièrement automatisée** ; déclarer l’outil, sa version, la date,
l’usage et, pour un LLM, les prompts ; justifier que l’outil convient à cet usage. Le projet en
respecte l’esprit — validation par le référent — mais ses rapports d’agents ne disent ni quel modèle
Claude les a produits, ni avec quels outils (N5).

Ces textes visent des revues, pas une veille ; ils éclairent pourtant le §7bis, seule étape des
circuits où un agent décide sans relecture humaine (D61 : compétence « non levée, seulement
contenue », bandeau visible). Rien à trancher aujourd’hui : inclure un cas §7bis dans l’évaluation
(lot 3) et rouvrir la question si une erreur passe.

**Contrôles d’accès et d’intégrité : des voies ouvertes, sans connecteur.** Aucun des connecteurs
nommés par `recherche-source-primaire` (PubMed, ClinicalTrials.gov, Consensus, SciSpace, Elicit)
n’est exposé dans une session Claude Code comme celle de ce complément (recherche d’outils du
24/09) : ses consignes y sont inapplicables. Des API publiques couvrent l’essentiel par simple
lecture web :

| Besoin | Voie ouverte | À savoir |
|---|---|---|
| Copie légale en accès ouvert d’un DOI | [Unpaywall](https://unpaywall.org/products/api) | Exige une adresse de contact en paramètre : celle du projet plutôt que la personnelle. Statuts `gold`, `green`, `hybrid`, `bronze`, `closed` — de quoi alimenter les états d’accès de P0 |
| Rétractation, correction | [API Crossref](https://www.crossref.org/blog/retraction-watch-retractions-now-in-the-crossref-api/), qui intègre la base Retraction Watch | Gratuite, sans clé |
| Toutes les publications d’un essai | PubMed, champ `[si]` avec le numéro NCT ([NLM](https://www.nlm.nih.gov/pubs/techbull/mj05/mj05_ct.html)) | Rattache princeps, sous-groupes et suivis à une même famille d’étude (P1) |
| Préprint ↔ version publiée | [Europe PMC](https://europepmc.org/) | Lien annoncé, non éprouvé ici |
| Études citées et citantes | [OpenAlex](https://developers.openalex.org/api-reference/introduction) | Gratuit ; sert la passe d’omission (N6) |

**Écrire les skills : la doc officielle d’Anthropic plutôt que Superpowers.**
[Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) :
écrire les évaluations **avant** d’étoffer les consignes (trois scénarios, mesure de référence sans le
skill, essai sur chaque modèle utilisé) ; nommer un outil MCP avec son serveur (`Serveur:outil`) ;
ranger ce qui est daté dans une section « anciens usages ». Les quatre skills sont courts (72 à
131 lignes, limite recommandée 500) ; leurs défauts sont ailleurs : `recherche-source-primaire:95-102`
nomme `search_trials` pour Elicit **et** pour ClinicalTrials.gov, ambiguïté que le nom qualifié
lève ; le même skill fige sans date des volumes et tarifs (8 M/36 M articles, 200 crédits,
545 000 essais).

### 13.3 Ce que le dépôt ajoute

**Trois règles de sourcing que les skills ne portent pas.** `00-global.md` les a tirées
d’incidents ; les skills, censés dispenser de relire la procédure, les ignorent :

- ne jamais recopier un PMID rendu par OE (`00-global.md:103-111`) — or le gabarit de prompt du
  skill triangulé demande à OE un « PMID/DOI exact » (`recherche-preuve-triangulee/SKILL.md:49-50`) ;
- un verdict d’absence exige d’avoir ouvert le corpus local `docs/decision/sources/` et essayé deux
  méthodes d’extraction (`00-global.md:112-122`) ;
- la liste des sources exclues du prompt OE contient Exercer (`00-global.md:124-125`), pas celle du
  skill (`recherche-preuve-triangulee/SKILL.md:54-56`).

**Un second renvoi P5 résiduel** : `docs/commun/OUTIL-INTERFACE-OE.md:84` (« P4/P5 »), en plus de
`recherche-source-primaire:8`. Le commit de création des skills (`a4da28b`) annonçait déjà la
correction.

**L’exemple de référence du skill triangulé a perdu son entrée OE** : `OE-statine-sujet-tres-age.md`
a été supprimé par `790adaa` (28/07, purge de chantier), alors que le skill présente ce dossier comme
« exemple complet et vérifié ».

**Aucune trace de modèle ni de lien OE** : les deux retours OE du dépôt ont été collés à la main. Le
suivi des modèles part de zéro — le CLI le fournit désormais sans effort (N1).

**Le corpus d’épreuve de §8 est déjà là.** Huit items de veille vérifiés, dont trois reportés — tous
pour un problème d’accès, aucun pour un désaccord de fond — et quatre chantiers Décision
(26/07 → 11/08). Correspondance avec les cas de §8 :

| Cas d’épreuve | Incident à rejouer |
|---|---|
| Accès mal qualifié | 6 des 10 articles déclarés inaccessibles étaient ouverts dans PMC (`validation/chantier-2026-07-27/redteam-sur-basalisation.md:220-236`) ; A04 reporté alors que le SAP était public (`JOURNAL_BOITE_MAIL.md:85`) |
| Faux verdict d’absence | Seuil SFD déclaré introuvable, présent mot pour mot dans le corpus local (`validation/chantier-2026-07-29/CONCILIATION-passeA.md:113-133`) |
| Même erreur chez A et OE | IC de PROSPER identiquement faux (`redteam-preuve-statine-sujet-tres-age.md:42-57`) ; quatre erreurs partagées (`redteam-titration-mcg-2026-08-11.md:376-391`) |
| Référence exacte, affirmation non soutenue | Trois mésattributions OE (`redteam-titration-mcg-2026-08-11.md:310-355`) |
| Mauvaise identité d’étude | A12 rétrospective présentée comme prospective (`JOURNAL_BOITE_MAIL.md:43,90`) ; fichier local « NICE 2023 » = NG238, pas NG28 (`CONCILIATION-passeA.md:118-119`) |
| Chiffre dérivé | NNT d’ACE 33, corrigé à ~40 (`validation/chantier-2026-07-29/redteam-B2-chiffres.md:444`) ; p unilatéral présenté comme bilatéral (`verifications-backlog/ORTHO01-agent-C-reconciliation.md:163-183`) |
| Spin du relais | Équivalence présentée en supériorité (A12), une proposition présentée en trois recommandations (A06) (`JOURNAL_BOITE_MAIL.md:122-129`) |
| Faux « aucun ECR » d’OE | ECR publié six mois avant la requête (`redteam-titration-mcg-2026-08-11.md:369-374`) |
| Capture qui change le sens | Signe `<` avalé à la copie : seuils de réduction de dose disparus (`validation/chantier-2026-07-29/OE-passeA-lecture-et-integrite.md:17-30`), récidive le 11/08 |

Chaque incident a son rapport correcteur, donc son résultat attendu : le corpus se constitue par
sélection, pas par invention. Les retours OE archivés se rejouent tels quels.

### 13.4 Propositions nouvelles

**N1 — Remettre à jour le mode d’emploi OE (lot 1).** Documenter `--modele` et la ligne `Modèle` ;
n’écrire le chemin du CLI qu’à un seul endroit (`OUTIL-INTERFACE-OE.md`), le skill y renvoie ; avant
l’appel, vérifier que le fichier existe. *À quoi tu le verras :* chaque `OE-*.md` indique son
modèle ; un chemin faux échoue avec un message explicite au lieu d’un faux « incomplet ». *Revers :*
le chemin reste propre à un poste ; sur un autre ordinateur, il se change à un seul endroit.

**N2 — Rattacher les skills aux règles de sourcing de `00-global.md` (lot 1).** Par renvoi, pas par
copie : le prompt OE demande DOI et citation complète, plus jamais le PMID ; tout verdict d’absence
passe par le corpus local et deux méthodes d’extraction ; la liste d’exclusion renvoie à
`00-global.md`. *À quoi tu le verras :* plus de PMID d’origine OE dans les dossiers ; chaque
« introuvable » cite la pièce locale ouverte. *Revers :* négligeable.

**N3 — Outils nommés sans ambiguïté, repli quand ils manquent (lot 1, complète P0).** Qualifier
chaque outil par son serveur ; en tête de circuit, constater les outils exposés et, à défaut, passer
par les voies ouvertes de §13.2 ; déplacer tarifs et volumes dans une section datée. *À quoi tu le
verras :* chaque rapport d’agent commence par « outils disponibles : … ». *Revers :* les voies
ouvertes font des requêtes web au moment de la recherche (jamais dans l’application) ; Unpaywall
veut une adresse de contact, à choisir par toi.

**N4 — Contrôle d’intégrité daté des études décisives (lot 2).** Pour chaque étude qui porte une
conclusion : rétractation ou correction (Crossref), famille d’essai (`[si]` PubMed), préprint devenu
publication (Europe PMC) ; une ligne datée dans la table maîtresse. Opérationnalise P1 et la SOP
§10. *À quoi tu le verras :* une colonne « intégrité vérifiée le … ». *Revers :* trois requêtes par
étude décisive ; s’en tenir à celles-là.

**N5 — En-tête de provenance des rapports d’agents (lot 2).** Modèle Claude, date, outils réellement
disponibles, accès obtenus ou bloqués, consignes utilisées : les champs que §6 demande pour OE,
appliqués aux agents, comme l’exigent les positions Cochrane/Campbell/JBI/CEE. Rempli par
l’orchestrateur, qui sait quel modèle il a lancé, et non par l’agent sur lui-même. *À quoi tu le
verras :* cinq lignes en tête de chaque rapport A/B/C. *Revers :* un peu de discipline à chaque
lancement.

**N6 — Passe d’omission sur les sous-questions décisives (lot 2, conditionnée au lot 3).** Une
recherche courte, sans lire A : études citantes des essais clés, registres, résultat de sens
contraire. Elle peut fusionner avec la « première lecture » de B proposée en P1 (indépendance).
*À quoi tu le verras :* une rubrique « cherché, non trouvé par A » dans le rapport B. *Revers :*
un coût de plus ; ne l’adopter que si le lot 3 montre des omissions sur le corpus.

**N7 — Évaluer avec l’outillage existant (lot 3).** La skill `skill-creator`, disponible dans cet
environnement, compare un comportement avec et sans skill sur des scénarios fixés. Nourrie des cas
de §13.3 et des retours OE archivés, elle rend l’évaluation de §8 exécutable **sans requête OE**.
*Revers :* chaque passage consomme des tokens Claude ; le résultat attendu reste à relire par le
référent.

**N8 — Éprouver la capture du signe `<` (lot 4, dépôt Interface-OE).** Aucun test d’extraction
d’Interface-OE ne porte un `<` suivi d’une valeur (recherche du 24/09). Le défaut a frappé deux
captures manuelles ; vérifier que la capture par CLI le préserve avant de lui confier des seuils.
*Revers :* un chantier dans l’autre dépôt.

### 13.5 Décision qui t’appartient — D1 : la commande `article` et l’invariant 7

> **Sans objet pour l’instant (24 septembre).** Le référent confirme que l’accès Sci-Hub de P12 ne
> fonctionne pas ; P12 s’est arrêté après S1 (H1 réfutée, S2–S6 non commencées). La partie accès
> ouvert n’arrivera donc pas non plus par Interface-OE : les skills doivent joindre Unpaywall et
> Europe PMC elles-mêmes. La question ne revient que si P12 reprend.

L’invariant 7 et `recherche-source-primaire` interdisent le contournement de paywall ; la future
commande d’Interface-OE en fait un repli automatique.

- **(a) Option « accès ouvert seulement » demandée à Interface-OE**, seule forme appelée depuis
  EBM MSP · coût : une option dans P12, dont le noyau n’est pas écrit · ne ferme rien.
- **(b) Commande telle quelle, résultat « trouvé (Sci-Hub) » écarté côté EBM MSP** · coût nul en
  code · perd la garantie : le PDF est déjà téléchargé et archivé quand on l’écarte.
- **(c) Pas de branchement : Unpaywall et Europe PMC appelés directement** · coût : refaire ce
  qu’Interface-OE fera · perd le passage par le tunnel.

**Recommandation : (a)**, seule option où le téléchargement contraire à l’invariant n’a jamais lieu,
et moins chère maintenant qu’après la session S2 de P12. Si tu estimes que l’invariant 7 — rédigé
pour la veille — ne vise que ce qui est publié, et non la lecture de travail, alors (b) suffit ; mais
c’est une révision d’invariant, à écrire dans `DECISIONS.md`, pas à laisser implicite.

### 13.6 Ordre d’adoption révisé

| Lot | Ajouts du 24 septembre | Effet |
|---|---|---|
| 1 — Corriger | N1, N2, N3 | Reste documentaire et peu coûteux ; corrige un défaut actif (chemin OE mort, code 1 mal lu) |
| 2 — Tracer | N4, N5 ; N6 sous condition | P1 gagne en priorité : c’est lui qui vise l’erreur la plus fréquente (§13.2) |
| 3 — Éprouver | Corpus de §13.3, outil N7 | Aucune requête OE ; seul le pilote des modèles (§8) en consomme |
| 4 — Adapter OE | Réduit à N8, à la doc (N1) et au pilote des modèles | Sélection et trace du modèle déjà faites côté Interface-OE |
| Avant tout branchement de `article` | D1 | — |

Ce complément, comme le rapport, ne modifie aucun skill ni aucun code et ne consomme aucune requête OE.

## 14. Refonte retenue (arbitrage du 24 septembre 2026)

**Arbitrage du référent :** refonte complète, **option C** — trois couches, agents dédiés et skill
`construire-module-decision` dans le même chantier. Adresse de contact Unpaywall :
`ebmmsp@gmail.com`. Garde-fou OE (§14.3) : recommandé, en attente d’accord. Ce chapitre est
l’entrée de `/nouveau-plan` ; il remplace, pour l’architecture, les §7 et §12.

### 14.1 Pourquoi refondre

Les défauts relevés ont trois causes que du texte en plus ne corrige pas :

1. **Des questions déterministes tranchées au jugement** — accès, identité d’un PMID, rétractation,
   famille d’essai : un appel d’API y répond ; aujourd’hui un agent en décide (6 accès sur 10 et
   6 PMID sur 7 faux, §13.3). `choisir-mecanisme` place le script avant la skill.
2. **Des règles à deux domiciles qui divergent** — quatre écarts skills/`00-global.md`, plus le
   chemin du CLI (§13.3).
3. **Des circuits qui réinventent les étapes communes** — extraction, contradiction, réconciliation
   n’ont pas les mêmes statuts en veille et en Décision ; la consolidation n’a pas de domicile (§10).

### 14.2 Architecture cible

Les noms des skills existantes sont conservés (onze fichiers les citent) : on refond le contenu.

```text
CIRCUITS (points d’entrée)       recherche-preuve-triangulee   Décision : une question clinique
                                 verif-source-veille           Veille : un article
                                 tri-boite-mail                quasi inchangé (+ DOI/NCT relevés)
                                 construire-module-decision    nouveau : orchestre P0→P7
      │ lancent
AGENTS DÉDIÉS (.claude/agents/)  extracteur-preuve (A) · contradicteur-preuve (B)
                                 reconciliateur-preuve (C veille §7bis, consolidation)
      │ chargent
SOCLE (une skill, références     recherche-source-primaire/references/
chargées à la demande)             acces-identite.md · registre-affirmations.md
                                   contradiction.md · consolidation.md (remplace la skill
                                   consolider-preuves de §10) · openevidence.md · lecons.md
      │ appellent
OUTILS DÉTERMINISTES             scripts/identite.mjs · scripts/verifier-registre.mjs
```

- **`identite.mjs`** — pour un DOI ou un PMID : identifiants recoupés (PMID, PMCID, DOI), accès
  ouvert et lien légal (Unpaywall), rétractation ou correction (Crossref), publications du même
  essai (`[si]` PubMed), préprint lié (Europe PMC). `fetch` natif de Node, aucune dépendance ;
  outillage de recherche, jamais dans l’application (invariant 1 intact). Doit échouer bruyamment si
  une API change.
- **`verifier-registre.mjs`** — contrôle du registre des affirmations : toute ligne « vérifiée » a sa
  localisation et son mode d’accès ; tout NNT est publié, recalculé (données d’entrée fournies) ou non
  calculable. Fait de P1 une porte, pas une intention. Format imposé aux nouveaux dossiers seulement.
- **Agents dédiés** — consignes stables au lieu d’un prompt recomposé à chaque fois ; modèle fixé en
  en-tête, donc provenance (N5) automatique ; B reçoit d’abord la question et les pièces, pas les
  conclusions de A. Point à vérifier : cohabitation avec les agents vendorés du workflow dans
  `.claude/agents/` lors d’un `/maj-workflow`.
- **Socle** — une règle, un domicile : le principe et sa raison restent dans `00-global.md` ou la
  SOP ; le socle porte la marche à suivre et renvoie à la section. `lecons.md` relie chaque incident
  à sa règle, à son domicile et à son cas d’épreuve : garde-fou contre la dérive et index du corpus.
- **OpenEvidence (`openevidence.md`)** — modèle annoncé avec la demande d’accord (« k questions,
  modèle X, parce que ») ; hypothèses de départ à éprouver : Sackett pour des sous-questions P4
  groupées, Snow pour une question large ou une lacune ciblée, Osler presque jamais (l’identification
  passe par `identite.mjs`) ; aucune montée automatique ; ligne `Modèle :` comparée à la demande ;
  **demande de précision détectée par la skill**, Interface-OE ne la repérant pas (code 0) → statut
  `clarification requise`, relance par `--conversation` seulement avec accord ; PMID d’OE jamais
  recopiés.
- **`construire-module-decision`** — contrat de §11. **Préalable :** clarifier le statut de
  `CONSTRUIRE-UN-MODULE.md`, encore « non arbitrée » (§11.2) ; sans cela, la skill rendrait
  prescriptif un procédé que le référent n’a pas validé.

### 14.3 Garde-fou OE : une confirmation à chaque question

> **Arbitrage du 2026-09-24 : hook refusé.** Le garde-fou est une règle écrite, à un seul endroit :
> `.claude/skills/recherche-source-primaire/references/openevidence.md` § 1 — aucune question OE
> sans accord du référent dans la conversation ; seul l'orchestrateur appelle le CLI, jamais un
> agent. La proposition ci-dessous est conservée pour mémoire (`DECISIONS.md` D65).

Proposition : un hook `PreToolUse` sur les outils Bash **et** PowerShell, qui demande ta
confirmation dès qu’une commande appelle le CLI d’Interface-OE (`demander`).

- **Pour :** le risque est asymétrique — une requête non voulue engage le compte personnel (défi
  anti-robot déjà déclenché une fois, CGU), un clic coûte quelques secondes ; l’option C multiplie
  les exécutions autonomes (agents dédiés, sessions orchestrées), là où « demander avant de poser »,
  écrit en prose, est le plus fragile ; enfin, c’est ce hook, et non la liste d’outils des agents, qui
  empêche un agent muni de Bash d’appeler OE.
- **Pourquoi un hook plutôt qu’une règle de permission :** une règle de permission filtre un motif
  de commande, contournable par une autre graphie du chemin ou par l’autre shell ; un hook inspecte
  le texte de la commande quel que soit l’outil.
- **Revers :** une vague orchestrée s’arrête à chaque question OE jusqu’à ton clic — c’est l’effet
  voulu, à condition de regrouper les questions OE dans une étape dédiée du circuit.
- **À vérifier avant de s’y fier :** le comportement en mode auto et dans un agent d’arrière-plan.
  L’effet attendu est l’échec fermé (refus), jamais l’exécution silencieuse.

### 14.4 Séquence proposée pour le plan

| Ordre | Contenu | Porte |
|---|---|---|
| 0 | Déclarer `.claude/n0.json` (absent : le contrôle N0 ne tourne pas) | N0 exécutable |
| 1 | Corpus d’épreuve (§13.3) et mesure des skills actuelles (`skill-creator`), sans requête OE | Mesure de référence écrite |
| 2 | `identite.mjs`, `verifier-registre.mjs` et leurs tests | N0 vert |
| 3 | Socle, `lecons.md`, `openevidence.md`, hook OE (si accord) | Aucune règle recopiée hors de son domicile |
| 4 | Agents dédiés, réécriture des deux circuits, renvois des onze fichiers et du mode d’emploi OE | Circuits déroulables de bout en bout |
| 5 | Mesure sur le corpus : skills actuelles / nouvelles avec agents génériques / nouvelles avec agents dédiés | Aucune régression ; gain attribué à chaque couche |
| 6 | Statut de `CONSTRUIRE-UN-MODULE.md` arbitré par le référent (indépendant, peut avancer en parallèle) | Document arbitré |
| 7 | `construire-module-decision` et ses épreuves (§11.5) | Épreuves passées |
| — | Pilote des modèles OE (§8), séparé, sur ton budget | Accord explicite |

La mesure à trois configurations de l’étape 5 répond au principal revers de C (tout changer d’un
coup rend un gain ou une régression inattribuable) sans renoncer à l’option.
