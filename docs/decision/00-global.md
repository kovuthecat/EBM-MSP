# Décision DT2 — grammaire commune & méthode de construction des nœuds

Autorité du contenu clinique du **domaine `diabete-type-2`**. Un nœud d'algorithme est la **sortie**
d'un travail de preuve tracé ; ce fichier fixe la méthode, la racine `docs/decision/` la porte.

> Sources amont : `docs/decision/BRIEF_DECISION.md` (§5 schéma, §10 nœuds A→H, §11 gabarit A) ·
> `docs/veille/GRILLE_APPRECIATION.md` (grille d'appréciation) · `docs/veille/BRIEF_VEILLE.md` §7ter
> (bi-agents). Le contenu distillé alimente `content/noeuds/diabete-type-2/<id>.yaml` (validé JSON Schema).

## Pipeline d'un nœud (dossier de preuve → algorithme)

1. **Cadrer** — question clinique (PICO), critères d'entrée (→ `criteres_entree` du schéma), options envisagées.
2. **Collecter** — sources pré-appréciées d'abord (Prescrire, Médicalement Geek, Cochrane, HAS, reco
   ADA/EASD…), puis essais pivots. OpenEvidence/web = débroussaillage, **jamais** source primaire.
3. **Apprécier** — appliquer la grille à chaque étude clé : design/biais, **critère dur vs substitution**,
   **effet absolu / NNT-NNH**, validité externe, cohérence, conflits d'intérêt, GRADE.
4. **Vérifier le dossier de preuve (bi-agents)** — Agent A extrait/chiffre, Agent B (red-team) traque le
   *spin* et **vérifie chaque DOI et chaque chiffre contre la source primaire** ; débroussaillage
   OpenEvidence intégré en 2ᵉ passe ; Opus réconcilie (consensus vérifié / divergences escaladées /
   non-vérifiable). Répéter la boucle A/B/OE jusqu'à ce que les `[À VÉRIFIER]` décisionnels soient levés
   (triangulation : ne jamais trancher sur une seule source, même OpenEvidence — cf. nœud B, 3 erreurs
   corrigées par une 2ᵉ passe de lecture directe des primaires). Cf. §7ter du brief veille.
5. **Distiller** — (a) options + `conditions` + `effet_attendu` + `niveau_preuve` + `sources` → **brouillon
   YAML** du nœud ; (b) **argumentaire exhaustif** *reader-facing* (niveau 3) →
   `content/noeuds/<domaine>/<id>.argumentaire.md` : document autonome rédigé à partir du dossier consolidé
   et vérifié (étape 4), reprenant sa structure (matrices de preuve par option, gate(s) de sécurité,
   argumentation **négative** — pourquoi une classe est *hors* 1re intention —, priorité entre options,
   reco officielle vs position critique, incertitudes, **toutes les sources** avec DOI). Les 3 niveaux de
   lecture : recommandation / argumentaire détaillé / argumentaire exhaustif (cf. `DECISIONS.md` D11).
6. **Valider (référent)** — relecture clinique humaine du dossier de preuve (§2 options, §4 reco/critique,
   arbitrages ouverts) ; passe le `statut` du dossier à `validé-référent`.
7. **Encoder** — écrire `content/noeuds/<domaine>/<id>.yaml` (contenu = brouillon de l'étape 5a, mis à jour
   si le dossier a évolué depuis) + le fichier `.argumentaire.md` de l'étape 5b.
8. **Vérifier l'encodage (bi-agents, étape dédiée — distincte de l'étape 4)** — l'étape 4 vérifie le
   *dossier de preuve* ; celle-ci vérifie que le **YAML écrit reflète fidèlement** ce dossier une fois
   validé, et que son **comportement dans le moteur** est cliniquement sensé :
   - **Agent A (fidélité)** — option par option : `conditions` conformes aux déclencheurs validés (§2),
     `niveau_preuve` cohérent avec le GRADE du dossier, `effet_attendu` chiffré fidèle (§3/§5),
     `contre_indications` complètes, `sources`/DOI corrects, `reco_officielle.divergence` justifiée.
   - **Agent B (red-team)** — relit la **sémantique du DSL** (`conditions.ts` : `AND` prioritaire sur `OR`,
     pas de parenthèses) et du moteur (`evaluateNode.ts` : `ordered-first-match` vs `multi-options`) puis
     **trace plusieurs profils patients représentatifs** à travers cette sémantique (pas seulement une
     lecture statique du YAML) pour détecter : spin réintroduit, contre-indications de sécurité manquantes
     ou non appliquées, incohérences avec les décisions actées (`DECISIONS.md`), pièges de précédence
     `AND`/`OR`, et — pour les nœuds `multi-options` — des options qui se déclenchent ensemble de façon non
     voulue (ex. une association qui s'active sur un seul critère au lieu de l'intersection réelle voulue).
   - **Corriger** les écarts trouvés dans le YAML (jamais dans le dossier de preuve, qui reste la source
     d'autorité) ; en cas de correction touchant la logique, **reconfirmer par un nouveau traçage** contre
     le moteur réel (test temporaire jetable acceptable, supprimé avant commit).
   - **Validation technique** : `npx vitest run` (validation Ajv du YAML contre `schema/noeud.schema.json`,
     et tests du moteur) ainsi que `npm run build` (typecheck + build) doivent passer avant tout commit.
9. `meta.statut: valide` sur le YAML encodé, puis commit (dossier de preuve + argumentaire + YAML +
   éventuelle mise à jour du tableau des nœuds ci-dessous, dans un même commit ou des commits successifs
   clairement scindés preuve / encodage).

### Garde-fous de vérification (récapitulatif — pourquoi autant de passes)

Un nœud traverse **plusieurs couches de vérification indépendantes**, chacune couvrant un risque différent ;
aucune n'est redondante avec les autres :

| # | Couche | Vérifie quoi | Porte sur |
| --- | --- | --- | --- |
| 1 | Bi-agents A/B (étape 4) | Chaque chiffre/DOI/essai cité contre sa **source primaire** ; le *spin* d'un abstract survendu | Le **dossier de preuve** (Markdown) |
| 2 | OpenEvidence (débroussaillage + 2ᵉ passe) | Complète/recoupe l'extraction humaine ou agent ; **jamais** une source primaire en soi | Le **dossier de preuve** |
| 3 | Triangulation (relecture croisée OE × agents, au besoin) | Qu'aucune des sources précédentes ne se trompe seule (une 2ᵉ lecture directe du texte primaire a déjà corrigé des erreurs d'OpenEvidence sur le nœud B) | Le **dossier de preuve** |
| 4 | Validation clinique référent (étape 6) | Les arbitrages cliniques ouverts (frontières entre nœuds, priorités, granularité EBM vs accord d'experts) | Le **dossier de preuve** |
| 5 | Bi-agents A/B dédiés à l'encodage (étape 8) | Fidélité du **YAML** au dossier validé ; sécurité et cohérence du **comportement du moteur** (traçage de profils patients) | Le **YAML encodé** |
| 6 | Validation technique (Ajv + Vitest + build) | Conformité du YAML au JSON Schema ; non-régression du moteur ; compilation TS propre | Le **YAML encodé** |

**Règle** : un `[À VÉRIFIER]` ne quitte jamais le statut « non confirmé » sur la seule foi d'une source
secondaire (OpenEvidence, une méta-analyse citant un chiffre de seconde main…) — il faut soit la source
primaire, soit un accord explicite référent documentant pourquoi le point reste ouvert mais non bloquant.

## Règles de sourcing (non négociables)

- **Références réelles uniquement.** Ne jamais inventer un DOI, un chiffre, un NNT, une année. Tout élément
  non vérifié est marqué **`[À VÉRIFIER]`** et n'entre pas dans le YAML tant qu'il n'est pas confirmé.
- **Effet absolu / NNT** privilégiés au risque relatif ; toujours préciser l'**horizon temporel**.
- **Critère dur vs substitution** explicite pour chaque résultat.
- **Prescrire** : le référent peut fournir le **texte intégral** pour l'analyse (usage interne) ; côté
  outil, seul résumé + lien (droit d'auteur). Les demandes de textes sont listées en fin de dossier.
- En cas de doute clinique **non tranché par une source** : **signaler**, ne pas trancher seul.
- **Granularité « si appuyée sur EBM »** (directive référent, 2026-07-22) : n'encoder une distinction de
  critère dans l'algorithme que si des **données EBM** (ECR/méta) la soutiennent. Les gradations d'**accord
  d'experts** (ex. HAS : sous-stades CV non évolué/évolué, IRC par stade, âgé vigoureux/fragile/malade)
  sont **affichées** comme reco officielle, mais ne **pilotent pas** le moteur.
- **Granularité de la recommandation par molécule** (référent, 2026-07-23 — `DECISIONS.md` D12) : ne
  recommander une **molécule précise** (plutôt que sa **classe**) que si l'**EBM** le justifie pour
  l'indication ; sinon, recommander au niveau de la **classe** (reco officielle affichée). *Vaut pour tout
  l'outil.*

## Socle de sources à interroger systématiquement (chaque nœud)

Checklist reproductible — pour chaque nœud, interroger **au minimum** :

- **Prescrire** — analyse indépendante ; ancre la **« position critique »**.
- **HAS** — recommandations officielles françaises ; ancre la **« reco officielle »** (ex. RBP « Stratégie
  thérapeutique du patient vivant avec un DT2 », 2024 ; cibles d'HbA1c en Annexe 3).
- **Collège de la Médecine Générale (CMG)** — position des généralistes / soins premiers.
- **Cochrane** — revues systématiques.
- **Médicalement Geek / DragiWebdo** — EBM francophone, anti-sur-traitement.
- **Essais primaires** pivots — source primaire, vérification.
- *OpenEvidence / web = débroussaillage complémentaire, **jamais** source primaire.*

La **reco officielle** (HAS, CMG) est affichée **à côté** de la position critique (Prescrire/EBM),
divergence signalée (brief §2).

## Échelle GRADE simplifiée

`eleve` (ECR de qualité, critères durs, cohérent) · `modere` (ECR avec limites, ou substitution solide) ·
`faible` (essais fragiles, sous-groupes, observationnel bien conduit) · `tres_faible` (avis, extrapolation).

## Nœuds du domaine DT2 (7 nœuds : A–F, H) — état

| Id | Nœud | Dossier | Statut preuve | Nœud YAML |
| --- | --- | --- | --- | --- |
| A | Cible glycémique | `noeuds/A-cible-glycemique.md` | **VALIDÉ + ENCODÉ (T-007bis)** : `content/…/cible-glycemique.yaml` v2.0 `statut: valide` · sortie unique · 27/27 tests verts | P1/S2 |
| B | 1re intention (par comorbidités) | `noeuds/B-premiere-intention.md` | **VALIDÉ + ENCODÉ (v1.4, 2026-07-23)** : `content/…/premiere-intention.yaml` (multi-options) + argumentaire niveau 3 ; base de preuve complète et vérifiée (bi-agents + 5 OpenEvidence + 3 passes de vérif. dont YAML/triangulation + HAS/Méd. Geek/SFD 2025 + Prescrire). Tous arbitrages validés référent ; **MIGRÉ vers le moteur P2** : garde-fou catabolique + CI DFG<20/DFG<30 en `exclusions` (tracées), priorité par critère dominant/phénotype en `priorite` conditionnelle (REIN→iSGLT2 rang1 ; ASCVD→iSGLT2 devant tirzépatide ; obésité seule→tirzépatide rang2). **v1.4 : correctif de production** — metformine passée en sentinel `["toujours"]` (D16, rang 0) : elle disparaissait entièrement dès qu'un ajout matchait (encodée par erreur `["default"]`), bug signalé par un utilisateur. Badge distinct « Recommandation officielle » sur le socle vs « Recommandée » (EBM) sur la 1re option d'ajout. 115 tests + build OK. Restant : vars décompensation/cétose | **✔ encodé** |
| C | **Intensification / Optimisation** (ajout · substitution SU/gliptine → iSGLT2/GLP-1 · désintensification) | `noeuds/C-intensification.md` | **VALIDÉ + ENCODÉ + VÉRIFIÉ BI-AGENTS (2026-07-23)** : `content/…/intensification.yaml` v1.0 `statut: valide` (**10 options**) + argumentaire niveau 3. **3 leviers** (désintensifier / introduire-substituer iSGLT2-GLP1 / remplacer SU) + **sécurité rénale metformine** (arrêt DFG<30 / réduction 30-59, RCP ANSM) · garde-fous durs (`exclusions` DFG<20 ; **non-association gliptine+GLP-1 par construction** + détection du combo préexistant ; désintensif. exclusive & jamais un protecteur). Preuves triangulées **bi-agents × OpenEvidence × HAS 2024 × SFD 2025** ; **vérif. encodage bi-agents A/B** (17 profils, 0 HAUTE, 5 corrections) ; **87 tests + build**. | **✔ encodé** |
| D | Sulfamides / gliptines | `noeuds/D-sulfamides-gliptines.md` | à faire | P2 |
| E | Insuline | `noeuds/E-insuline.md` | à faire | P2 |
| F | **Statine chez le diabétique** | `noeuds/F-statine.md` | **VALIDÉ + ENCODÉ + VÉRIFIÉ BI-AGENTS (2026-07-23)** : `content/…/statine.yaml` **v1.0 `statut: valide`** (**ordered-first-match**, 3 tiers EBM-ancrés + 3 alertes) + argumentaire niveau 3. Preuves **agents A × red-team B (essais + reco) × OpenEvidence OE-F1→F5** (DOI/chiffres vérifiés source primaire) ; **reco française SFE/SFD/NSFA/SFC 2026** (PMID 41651737) + note **conflits d'intérêt** ; stratification « que dit l'EBM » (enrichissement CARDS/HPS, **pas** de seuil SCORE2 ; mortalité primaire non revendiquée) ; rosuva 10-20. **Vérif. encodage bi-agents étape 8 : 0 finding HAUTE** (A fidélité + B red-team moteur, ~35 profils) ; **122 tests + build.** Restant P3 : câblage formulaire D3 (nouveaux critères). | **✔ encodé** |
| H | RHD / perte de poids / rémission | `noeuds/H-rhd.md` | à faire | P2 |

> **Nœud G (aspirine) retiré** : pas d'algorithme à construire (pas de prévention primaire — ASCEND ;
> secondaire = systématique). Reste **7 nœuds**. L'info aspirine pourra vivre comme note statique dans
> le contexte prévention CV, pas comme nœud interrogeable.

Gabarit de dossier : `noeuds/_TEMPLATE.md`.
