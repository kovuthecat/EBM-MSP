# Améliorer les skills de recherche d’EBM MSP

Rapport du **16 septembre 2026** — propositions à discuter, sans modification des skills ni du code.

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
