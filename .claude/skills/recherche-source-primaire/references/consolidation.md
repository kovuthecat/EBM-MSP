# Consolidation — agréger, réconcilier, synthétiser

La méthode de qui consolide un dossier : l'agent réconciliateur (C), l'orchestrateur, ou la session
qui prépare le dossier du référent. Elle condense le contrat de
`docs/commun/2026-09-16-propositions-skills-recherche.md` §10 et **remplace la skill
`consolider-preuves`** qui y était proposée : c'est une référence que l'on charge, pas une skill de
plus ni un agent de plus.

**Pourquoi** (§14.1, cause 3) : l'extraction, la contradiction et la réconciliation n'ont pas les
mêmes statuts en veille et en Décision, et la consolidation n'avait pas de domicile. Le risque
principal est une synthèse fluide qui fait disparaître un conflit, ou qui transforme deux reprises
d'une même source en deux confirmations.

**Déclenchement** : plusieurs rapports ou sources à consolider pour une même décision, ou deux
lectures d'un article qui divergent. Retrouver une référence ne demande pas de consolidation.

## Autorité inchangée

Cette page organise le travail. Elle ne change pas **qui valide** :

| Circuit | Qui tranche | Domicile de la règle |
| --- | --- | --- |
| Décision | le **référent**, sur le dossier que la consolidation prépare | `docs/decision/00-global.md` § Pipeline d'un nœud, étapes 4 et 6 |
| Veille §7 | l'**orchestrateur**, qui réconcilie | `docs/veille/SOP_veille.md` §7 |
| Veille §7bis | l'**agent C**, dans le rôle que lui donnent la SOP et D61 | `docs/veille/SOP_veille.md` §7bis, `DECISIONS.md` D61 |

En veille, les règles propres à la réconciliation (sort d'une divergence non tranchable sur pièces,
rôle et limites de C, `meta.relecture_referent`, journalisation) ont pour seul domicile
`SOP_veille.md` §7 et §7bis. On les applique telles qu'elles y sont écrites ; cette page ne les
reformule pas. Le déroulé est dans `verif-source-veille`.

**Sortie** : un dossier consolidé et un journal des divergences, avec un verdict par sous-question.
Jamais de YAML clinique, de classement définitif hors mandat ni de publication automatique.

## Trois opérations

| Opération | Question | Résultat |
| --- | --- | --- |
| **Agrégation** | Quelles données distinctes a-t-on pour cette question ? | Ensemble organisé, sans doublon d'études, avec versions et provenance |
| **Réconciliation** | Pourquoi les extractions ou conclusions diffèrent-elles ? | Divergence corrigée, expliquée, ou laissée ouverte avec son motif |
| **Synthèse** | Que permet d'affirmer l'ensemble des preuves ? | Conclusion par population, comparaison, critère et horizon, avec certitude et limites |

Un résumé des rapports ne remplit aucune des trois.

## Entrées figées et datées

- **Liste des entrées** :
  - question et sous-questions, périmètre clinique ;
  - table maîtresse et registre des affirmations ;
  - rapports d'extraction (A) et de contradiction (B) ;
  - retour OpenEvidence s'il existe ;
  - pièces accessibles, arbitrages antérieurs, destination du livrable.
- **Chaque entrée porte une date ou une version.** La liste est figée en tête du livrable. Une pièce
  arrivée après le début du passage ouvre un nouveau passage.
- **Une pièce absente reste absente.** On ne la complète pas de mémoire : elle devient un point
  `non vérifiable`, ou une recherche ciblée (étape 5).
- **On garde les extractions A et B d'origine**, pour pouvoir expliquer une correction ultérieure.

## Procédure en sept étapes

1. **Figer les entrées.** Lister les rapports et versions consultés.
2. **Regrouper les familles d'études.** Associer princeps, sous-groupes, suivi, protocole,
   corrections et préprint : `scripts/identite.mjs` rend les publications d'un même essai.
   Cartographier aussi le recouvrement des essais entre revues systématiques : une revue et les
   essais qu'elle inclut ne sont pas des preuves indépendantes à additionner.
3. **Former des groupes comparables.** Par population, intervention, comparateur, critère, horizon
   et type d'analyse. Les écarts de définition restent visibles, au lieu d'être aplatis dans un
   effet unique.
4. **Dresser le journal des divergences.** Pour chacune :
   - les deux affirmations exactes et leurs sources ;
   - la catégorie (table ci-dessous) ;
   - l'enjeu pour la décision ;
   - la pièce qui permettrait de trancher.
5. **Résoudre sur pièces.** Rouvrir les passages concernés et corriger les erreurs d'extraction.
   Les résultats réellement différents restent séparés. Une recherche complémentaire répond à un
   manque précis et respecte le budget, OpenEvidence compris (`openevidence.md`).
6. **Synthétiser par résultat qui compte pour le patient.** Bénéfices, dommages, applicabilité et
   incertitudes, sans note globale calculée à partir des avis des agents.
7. **Préparer le transfert.** Donner :
   - les formulations soutenables et celles à exclure ;
   - les arbitrages humains attendus ;
   - les points qui bloquent la suite.

   Chaque conclusion est reliée à ses affirmations sources (ID du registre) et aux vignettes
   concernées.

## Typologie des divergences → action

| Divergence | Action |
| --- | --- |
| DOI, PMID ou identité d'essai différents | Vérifier la correspondance bibliographique (`scripts/identite.mjs`) **avant** de comparer les chiffres |
| Deux chiffres pour le même résultat | Vérifier tableau, population d'analyse, horizon, version et correction éventuelle |
| HR présenté comme RR, taux comme risque, ITT comme per-protocole | Restaurer la mesure et l'analyse d'origine ; ne pas harmoniser par simple renommage |
| Populations, comparateurs ou critères différents | Séparer les conclusions : il peut ne pas y avoir de contradiction |
| Essais comparables aux résultats différents | Décrire l'incohérence, les biais et l'imprécision ; ne pas choisir celui qui confirme le dossier |
| Recommandations divergentes | Comparer question, date de recherche, corpus, méthode et contexte d'application |
| Rapport d'agent contredisant une source | Corriger le rapport, avec le passage qui justifie la correction |
| Pièce décisive inaccessible | Laisser le point `non vérifiable` ; dire ce qui débloquerait la conclusion |
| Préférence clinique ou choix de conception | Soumettre un arbitrage ; ne pas chercher une « source gagnante » |

**Pas de « plus récent = vérité ».** Le choix de la pièce dépend du fait à établir :

- un protocole renseigne la préspécification, il ne prouve pas le résultat ;
- un erratum peut corriger une valeur ;
- une recommandation plus récente peut reposer sur un corpus plus ancien qu'une revue concurrente.

**Exemple fictif** (§10.4). A décrit un bénéfice à deux ans en population totale. B ne retrouve pas
de résultat concluant à un an dans un sous-groupe. La réconciliation sépare d'abord ces deux
questions, puis détermine laquelle correspond au périmètre du module. Faire la moyenne des deux
conclusions n'a pas de sens.

## Garde-fous de synthèse

- **Pas de méta-analyse automatique.** Le mode normal est une synthèse structurée. Une estimation
  combinée demande un mandat, un protocole et une vérification méthodologique distincts. Pas de
  vote « trois études positives contre deux négatives », surtout sur la seule significativité.
- **Certitude par critère de jugement.** On ne fait pas la moyenne des niveaux des articles. On
  apprécie l'ensemble pertinent pour ce critère sur cinq axes, chacun explicité :
  - risque de biais ;
  - incohérence ;
  - caractère indirect et applicabilité ;
  - imprécision ;
  - biais de publication.

  L'étiquette reste « GRADE simplifié » (échelle : `00-global.md` § Échelle GRADE simplifiée), sans
  revendiquer une évaluation formelle complète.
- **Trois plans séparés dans la conclusion** : ce que montrent les données, ce que recommandent les
  organismes, ce que le projet propose d'en faire. Une recommandation est la source de sa propre
  position. Elle ne remplace pas les études qui étayent ses chiffres. Une décision de mise en
  œuvre ne se présente pas comme un résultat expérimental.
- **OpenEvidence = repérage.** C'est un rapport à contrôler, jamais une source primaire. Ses modèles
  ne sont ni trois études ni trois votes : leurs résultats alimentent les mêmes lignes de preuve,
  après vérification des sources (`openevidence.md`).
- **L'accord de deux rapports n'est pas une confirmation** tant que le passage n'a pas été lu
  (`contradiction.md` §4).

## États d'une divergence

Chaque divergence du journal porte exactement un état :

| État | Sens |
| --- | --- |
| `corrigée` | Une extraction était fausse ; le passage qui le montre est cité |
| `expliquée par le périmètre` | Population, horizon, critère ou comparateur différents : pas de contradiction réelle |
| `persistante entre études` | Désaccord réel entre données comparables, maintenu visible dans la synthèse |
| `non vérifiable` | Pièce décisive inaccessible ; on dit ce qui débloquerait |
| `arbitrage humain` | Préférence clinique ou choix de conception, soumis à qui valide (§ Autorité) |

**« Réconciliation terminée » ne veut pas dire « tout le monde est d'accord ».** Chaque désaccord
important a été traité, et son effet sur la conclusion est visible.

## Deux livrables, dans le dossier existant

- **Synthèse décisionnelle courte**. Une ligne par sous-question :
  - conclusion et certitude ;
  - population et horizon ;
  - limites ;
  - statut de validation.
- **Annexe de traçabilité** :
  - familles d'études ;
  - résultats sources ;
  - divergences avec leur état et leur résolution motivée ;
  - conclusions abandonnées ;
  - actions restantes.

  L'annexe réutilise la table maîtresse, le registre et les fichiers de réconciliation existants
  plutôt que d'en recopier les données.

## Quand déclarer la consolidation complète

Les deux conditions suivantes doivent être remplies :

1. **Chaque divergence décisionnelle a un état.** Une divergence qui pèse sur la décision sans
   traitement explicite empêche de déclarer la consolidation complète.
2. **Le registre passe sa porte.** Pour un dossier qui tient un registre des affirmations (imposé
   aux nouveaux dossiers, `registre-affirmations.md` § Format), la commande suivante doit sortir
   avec le code 0 :

   ```bash
   node .claude/skills/recherche-source-primaire/scripts/verifier-registre.mjs <registre.md>
   ```

   Le code 1 liste les lignes à reprendre. Le code 2 signale un fichier absent ou illisible.

En veille, la SOP ne prévoit pas de registre. Le livrable reste le fichier de réconciliation que
fixent `SOP_veille.md` §7/§7bis et `verif-source-veille`.
