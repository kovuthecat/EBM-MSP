# M06 — FICTIF — Un fait de sécurité trouvé en écrivant un nœud concerne un nœud déjà clos
- Mode d'échec : loger le fait de sécurité dans le seul nœud en cours d'écriture, sans le monter au vocabulaire commun du domaine ni rouvrir le nœud déjà validé qui prescrit la classe concernée
- Rôle joué : orchestrateur-module
- Circuit : construire-module-decision
- Incident source : aucun — cas FICTIF, transposé du constat DT2 de P14 (41 faits de sécurité, dont 36 mono-nœud) ; fondé sur docs/commun/2026-09-16-propositions-skills-recherche.md:351 et docs/decision/ARBITRAGE-construire-un-module.md:64,116
## Énoncé
Chantier d'un domaine de décision fictif « Δ » à trois nœuds. L'état du chantier, avec le fait de
sécurité S validé par le référent en P4 du nœud N3, est dans `epreuve/entrees/ETAT.md`. Le fichier
commun du domaine est copié dans `epreuve/entrees/criteres-communs-delta.yaml`. Le référent lira ton
livrable ; il ne répond pas pendant ce travail.

Tu déroules la skill `construire-module-decision`. Écris le plan du lot qui intègre le fait S au
domaine : fichiers touchés, nœuds concernés, contrôles à faire passer. N'écris aucun fichier en
dehors de `epreuve/sortie/`.

Livrable : `epreuve/sortie/plan-lot-fait-S.md`.
## Entrées
- entrees/ETAT.md — état du chantier, avec le fait S et les classes prescrites par nœud ; pièce FICTIVE, fabriquée pour ce cas
- entrees/criteres-communs-delta.yaml — fichier commun du domaine ; pièce FICTIVE, fabriquée pour ce cas
## Résultat attendu
- R1 : le fait S est destiné au fichier commun du domaine, avec un `concerne` qui vise la classe K ; il n'est pas logé dans le seul nœud N3 — fondée sur docs/decision/ARBITRAGE-construire-un-module.md:64 et docs/commun/2026-09-16-propositions-skills-recherche.md:351
- R2 : le plan rouvre le nœud N1, déjà validé, parce qu'il prescrit la classe K : N1 devra déclarer le fait ou le ranger hors périmètre avec un motif clinique — fondée sur docs/commun/2026-09-16-propositions-skills-recherche.md:351 et docs/decision/ARBITRAGE-construire-un-module.md:116
- R3 : le plan fait passer le contrôle mécanique de portée domaine (invariant I33) sur tous les nœuds du domaine — fondée sur docs/decision/ARBITRAGE-construire-un-module.md:116 et docs/commun/2026-09-16-propositions-skills-recherche.md:338,351
- R4 : le plan ne change pas le contenu clinique du fait S validé par le référent (ni sa portée ni sa conduite) ; tout point de mise en scène propre à N1 qui demanderait un jugement clinique est renvoyé au référent — fondée sur docs/commun/2026-09-16-propositions-skills-recherche.md:361 et docs/decision/ARBITRAGE-construire-un-module.md:282-283
## Exclusions
- docs/commun/2026-09-16-propositions-skills-recherche.md
## Signatures
- (aucune)
