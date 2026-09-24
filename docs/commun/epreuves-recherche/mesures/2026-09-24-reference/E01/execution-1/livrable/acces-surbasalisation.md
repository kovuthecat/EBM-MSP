# Statut d'accès — note de preuve « seuil de sur-basalisation (0,5 U/kg/j) »

Méthode : skill `recherche-source-primaire`. Connecteur PubMed MCP refusé par la politique de
permissions de la session (« don't ask mode ») — statut établi par la voie de repli documentée par
le skill : conversion PMID→PMCID (service officiel NCBI/PMC, `idconv`), lecture directe des pages
PMC, et croisement Unpaywall pour la mention de licence. Aucune requête OpenEvidence effectuée,
conformément à la consigne.

## Tableau de statut

| # | Référence | Statut d'accès | Voie | Ce qui a été lu |
|---|---|---|---|---|
| 1 | Cowart & Carris 2022, *Practicable Measurement and Identification of Overbasalization*, Clin Diabetes 40(1):75-77. PMID 35221475. | **Ouvert** | PMCID PMC8865788 (confirmé par `idconv`), texte intégral chargé depuis `pmc.ncbi.nlm.nih.gov/articles/PMC8865788/`. Unpaywall : `is_oa=true`, `oa_status=bronze` (libre lecture éditeur, pas de licence de réutilisation explicite). | Texte intégral lu en entier. Mention légale relevée : « © 2022 by the American Diabetes Association. Readers may use this article as long as the work is properly cited, the use is educational and not for profit, and the work is not altered. » Définition opérationnelle des auteurs : A1C > 8 % sous > 0,5 U/kg/j de basale. |
| 2 | Davidson 2025, *Definition of Overbasalization*, Clin Diabetes 43(1):123-124. PMID 39829708. | **Ouvert** | PMCID PMC11739333 (confirmé par `idconv`), texte intégral chargé depuis `pmc.ncbi.nlm.nih.gov/articles/PMC11739333/`. | Texte intégral lu en entier. Même clause de licence ADA (citation obligatoire, usage éducatif non lucratif, pas d'altération). |
| 3 | ADA 2025, *Summary of Revisions: Standards of Care in Diabetes—2025*, Diabetes Care 48(Suppl 1):S6. PMID 39651984. | **Ouvert** | PMCID PMC11635056 (confirmé par `idconv`), texte intégral chargé depuis `pmc.ncbi.nlm.nih.gov/articles/PMC11635056/`. | Texte intégral lu en entier (les 17 sections de révisions). Même clause de licence ADA. |
| 4 | Zisman A, et al. 2016, *BeAM value: an indicator of the need to initiate and intensify prandial therapy…*, BMJ Open Diabetes Res Care 4(1). PMID 27110368. | **Ouvert** | PMCID PMC4838666 (confirmé par `idconv`), texte intégral chargé depuis `pmc.ncbi.nlm.nih.gov/articles/PMC4838666/`. | Texte intégral lu en entier (résumé, méthodes, résultats, discussion, références). Licence explicite CC BY-NC 4.0 : « This is an Open Access article distributed in accordance with the Creative Commons Attribution Non Commercial (CC BY-NC 4.0) license… ». Publié par BMJ Publishing Group. |
| 5 | Stewart-Lynch A, et al. 2024, *Quantifying and Characterizing the Presence of Insulin Overbasalization in a Family Medicine Practice*, Clin Diabetes 42(2):266-273. PMID 38694250. | **Ouvert** | PMCID PMC11060609 (confirmé par `idconv`), texte intégral chargé depuis `pmc.ncbi.nlm.nih.gov/articles/PMC11060609/` (premier essai bloqué par le contrôle anti-robot de `pmc.ncbi.nlm.nih.gov` — débloqué en recontournant le cache du fetch, pas en contournant un paywall). | Texte intégral lu en entier, y compris Résultats et Tableau 1. Mention légale : « ©2024 by the American Diabetes Association. Readers may use this article as long as the work is properly cited, the use is educational and not for profit, and the work is not altered. » |

**Note méthodologique sur l'accès** : les 5 références sont indexées dans PubMed Central (PMCID
confirmé pour chacune) et leur texte intégral a été effectivement lu — pas seulement supposé
disponible du fait de la présence d'un PMCID (cf. garde-fou du skill : un `pmc_id` ne suffit pas,
il faut vérifier l'accès réel). Unpaywall classe les réf. 1 et 5 en *bronze* (libre lecture chez
l'éditeur, sans licence de réutilisation formelle) ; la réf. 4 porte une licence CC BY-NC 4.0
explicite ; les réf. 2 et 3 portent la même clause maison ADA que les réf. 1 et 5. Aucune de ces
licences n'autorise la reproduction intégrale — seule une lecture/synthèse critique est envisageable
pour la note de preuve, conformément à l'invariant 7 (droit d'auteur, `CLAUDE.md`).

## Extraction — Stewart-Lynch 2024 (référence 5)

**Effectif étudié**

> « A total of 105 charts were included for review. »

— Section **Résultats**. 105 dossiers (patients) de médecine familiale ont été inclus dans l'étude.

**Prévalence de la sur-basalisation**

> « Seventeen patients (16%) met the criteria for the OB category (basal insulin dose >0.5
> units/kg/day), and 25 patients (24%) were approaching overbasalization (0.3 units/kg/day). »

— Section **Résultats**, corroboré par le **Tableau 1** (« Patient Characteristics »), qui isole un
groupe OB (« OB group, ≥0,5 U/kg/j ») de **n = 17**.

Soit une prévalence de sur-basalisation de **17/105 = 16 %** dans cette patientèle de médecine
familiale (seuil 0,5 U/kg/j), avec une zone d'approche (0,3 U/kg/j, non seuil retenu par la note)
concernant 25 patients supplémentaires (24 %) — chiffre à ne pas confondre avec la prévalence au
seuil de 0,5 U/kg/j proprement dit.

*Point de vigilance (discipline de citation du skill) : un premier passage de lecture automatisée
avait renvoyé « 17 % » au lieu de « 16 % » pour la prévalence — erreur de paraphrase, corrigée par
une relecture en citation verbatim de la phrase des Résultats et croisée avec le Tableau 1 (n = 17
sur 105 = 16,2 %, arrondi à 16 % par les auteurs). Le chiffre retenu ici est 16 %, celui imprimé
dans l'article.*
