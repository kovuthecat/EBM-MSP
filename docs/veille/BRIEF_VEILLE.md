# Brief — Outil de veille clinique (MSP)

**Version :** 0.6 (à valider par le comité MSP)
**Destinataire :** développement avec Claude Code
**Couplage :** module frère de l'*outil d'aide à la décision DT2* — même plateforme, taxonomie de thèmes commune, lien article → nœud de décision.
**Approche :** revue critique hebdomadaire de la littérature, par thème et par profession, dans l'esprit de Médicalement Geek / DragiWebdo.

---

## 1. Objectif & périmètre

Publier chaque semaine (mise à jour manuelle assistée) une **revue critique** de la littérature, structurée par **thèmes** et **professions** de la MSP. Chaque professionnel accède en priorité au contenu de son profil, peut naviguer librement dans les autres, mettre des articles **« pour mémoire »**, et distinguer d'un coup d'œil les études **à impact sur la pratique** de celles **à titre informatif** (triage du temps de lecture).

Chaque semaine, le **référent** analyse en outre, avec Claude Code, les études susceptibles de **modifier les algorithmes d'aide à la décision** (circuit de validation du brief décision, §13 de ce dernier).

---

## 2. Principes non négociables

1. **Analyse critique** systématique : biais, critère dur vs substitution, effet absolu/NNT, conflits d'intérêt.
2. **Respect du droit d'auteur** : résumé critique + lien vers la source ; **jamais** de reproduction du texte intégral (Prescrire, journaux). Citer, ne pas copier.
3. **Pas de contournement de paywall** : on exploite ce qui est accessible (abstract, open access, communiqués) ; le référent complète manuellement s'il a un accès légitime.
4. **Transparence des sources** et du niveau de preuve sur chaque item.
5. **Triage explicite** impact pratique / informatif.
6. **Aucune donnée de santé patient** dans l'outil ; **données personnelles réduites au minimum** (comptes : voir §9 et §9bis RGPD).
7. **Couplage tracé** avec l'outil de décision : tout item modifiant un algorithme passe par la validation humaine et le changelog.

---

## 3. Utilisateurs & profils

Profils MVP (**tous inclus dès le départ** — décision validée) :
- **Médecin généraliste (MG)**
- **IPA maladies chroniques** (diabète, maladies CV, BPCO, gériatrie, prévention, ETP)
- **Sage-femme**
- **Orthophoniste**
- **Infirmier·ère libéral·e (IDEL)**

Comportement : à l'inscription (compte, §9), le membre choisit son **profil** — le contenu de son profil est **mis en avant** ; il peut consulter tout le reste librement. Le profil est modifiable dans les réglages.

> **Conséquence du choix « tous les profils »** : le sourcing et la charge de veille hebdomadaire sont conséquents. Recommandation pragmatique : le **modèle de données** couvre tous les profils dès le départ, mais la **production de contenu peut monter en charge progressivement** (démarrer par MG + IPA, puis étoffer sage-femme / orthophoniste / IDEL au fil des référents disponibles). Prévoir un **référent par profession** pour tenir la cadence.

---

## 4. Taxonomie des thèmes

Thèmes transverses et spécialisés, partagés avec l'outil de décision quand ils se recoupent :

`soins-premiers` · `diabete-metabolisme` · `cardiovasculaire-prevention` (HTA, dyslipidémie, risque CV) · `bpco-pneumo` · `geriatrie-deprescription` · `prevention-depistage-vaccination` · `ETP` · `sante-femme-perinatalite` · `orthophonie` · `soins-infirmiers` (plaies, observance, suivi) · `sante-mentale-addictologie` · `douleur-soins-palliatifs`.

**Matrice thème × profession** : chaque article porte `themes[]` et `professions_concernees[]`. Le profil détermine les thèmes priorisés (ex. IPA chroniques → diabète, CV, BPCO, gériatrie, prévention, ETP ; sage-femme → santé-femme-périnatalité, prévention, vaccination).

---

## 5. Modèle de données — article de veille

Un fichier YAML par article dans `/content/veille`, validé par JSON Schema. Champ commun avec l'outil de décision pour le couplage.

```yaml
id:                          # ex. "2026-W30-flow-semaglutide-renal"
date_semaine:                # "2026-W30"
titre:
source: {nom, lien, doi?}    # revue / site d'origine
type_publication:            # ECR | méta-analyse | cohorte | reco | éditorial | autre
themes: []                   # cf. §4
professions_concernees: []   # MG | IPA | sage-femme | orthophoniste | IDEL
niveau_impact:               # pratique | informatif
population:
resultat_resume:             # synthèse en clair (pas de copie intégrale)
appreciation_critique:       # biais, critère dur/substitution, effet absolu/NNT,
                             # cohérence, conflits d'intérêt
niveau_preuve:               # eleve | modere | faible | tres_faible (GRADE simplifié)
pertinence_pratique:         # forte | modérée | faible
impact_algorithme:
  concerne_decision:         # bool
  noeuds_impactes: []        # ids de nœuds de l'outil de décision
  proposition_maj:           # aucune | candidate | validee | rejetee
temps_lecture_min:           # estimation (aide au triage)
meta: {date_publication, auteur, statut}   # brouillon | valide
```

---

## 6. Fonctionnalités utilisateur

- **Sélection de profil** — priorisation du contenu ; navigation transversale libre.
- **Filtres** : par thème, par profession, par **niveau d'impact** (pratique / informatif), par semaine, par niveau de preuve.
- **Badge d'impact** visible sur chaque carte (pratique = action possible ; informatif = contexte).
- **« Pour mémoire »** : sauvegarde personnelle d'articles, consultables dans un espace dédié (mécanisme §9).
- **Estimation du temps de lecture** affichée, pour trier selon le temps disponible.
- **Lien vers l'argumentaire** complet et la source primaire.
- **Marqueur « impacte un algorithme »** renvoyant au nœud de décision concerné.

---

## 7. Pipeline d'extraction & production hebdomadaire

1. **Collecte automatisée** (§7quater) : APIs bibliographiques (PubMed/Europe PMC) + flux RSS + web-fetch programmé des sources sans flux — **moisson brute** de candidats. Complétée si besoin par des **prompts OpenEvidence** ciblés. On récupère ce qui est accessible (abstracts, open access, communiqués), sans contourner les paywalls.
2. **Analyse par Claude** : tri de la pertinence, appréciation critique, classement `themes` / `professions_concernees` / `niveau_impact`, estimation du niveau de preuve.
3. **Mise en forme** : génération des **entrées de veille** (schéma §5) en brouillon.
4. **Relecture référent** → correction → **push** (git) → publication.
5. **Sous-analyse « impact algorithmes »** avec Claude Code : pour les items `concerne_decision`, proposition de **diff** sur les nœuds → validation comité → mise à jour tracée (cf. brief décision §13).

> Points de vigilance : re-vérifier chaque donnée OpenEvidence sur la source primaire ; respecter le droit d'auteur (résumé + lien) ; noter que certains sites sont paywallés ou rendus en JavaScript (le web-fetch peut ne renvoyer qu'un abstract — le référent complète).

---

## 7bis. Méthodologie de veille fiable (reproductibilité)

Objectif : une veille **reproductible, documentée et standardisée** — deux référents doivent produire des résultats comparables, et chaque semaine doit être auditable. Non pas tout lire, mais filtrer de façon fiable.

### Principe directeur — partir du haut de la pyramide des preuves
Exploiter d'abord les **sources pré-évaluées** (modèle « 6S » de McMaster : systèmes → synthèses → synopsis → revues systématiques → études). On couvre le signal utile via des sources qui ont déjà filtré et apprécié la littérature ; on ne descend aux études brutes que pour les signaux à fort impact. Hiérarchie de sources fixée et versionnée (détail §8), du tier 1 (EBM secondaire pré-appréciée) au tier 4 (études primaires, en vérification seulement). OpenEvidence / web-fetch = débroussaillage complémentaire, **jamais** source primaire.

### Cycle hebdomadaire (déroulé fixe)
1. **Collecte** via alertes automatisées (PubMed *saved searches*/RSS, alertes TOC des revues, McMaster EvidenceAlerts, flux des sociétés savantes) — collecte exhaustive et reproductible.
2. **Présélection (screening)** contre des critères d'inclusion écrits ; journaliser repéré / retenu / exclu + motif (mini-flux type PRISMA hebdomadaire).
3. **Appréciation critique** avec grille standardisée (ci-dessous).
4. **Classement** : thème(s), profession(s), niveau de preuve, impact pratique vs informatif.
5. **Double validation** par un second relecteur (garde-fou contre le biais du lecteur unique).
6. **Mise en forme & publication**, puis sous-analyse « impact algorithme » avec Claude Code.

### Critères d'inclusion / exclusion (documentés)
Inclure : design pertinent (ECR, méta-analyse, reco, cohorte de qualité), question pertinente pour les soins premiers / le profil, critères importants pour le patient. Exclure : précliniques/animales, très petits effectifs non répliqués, critères purement intermédiaires sans portée clinique, communiqués sans article, doublons.

### Grille d'appréciation critique standardisée
Version allégée de RoB2 / AMSTAR-2 / GRADE, mêmes rubriques pour chaque article :
- Design & risque de biais (randomisation, aveugle, perdus de vue, arrêt précoce, ITT).
- **Critère de jugement : dur vs substitution** (rubrique la plus discriminante).
- **Effet absolu / NNT-NNH** (pas seulement le risque relatif).
- Validité externe (population ≈ celle de la MSP ?).
- Cohérence avec la totalité des preuves antérieures.
- Conflits d'intérêt / financement et détection du *spin*.
- Niveau de preuve final (GRADE simplifié) + incertitudes.

### Triage impact pratique vs informatif
Est « à impact pratique » un article qui, s'il est confirmé, **modifie une décision fréquente en MSP** (indication, molécule, cible, dépistage), avec effet absolu non trivial et validité externe correcte. Sinon → « informatif ». Ce tri conditionne le temps de lecture affiché.

### Garde-fous de fiabilité
- Ne pas sur-réagir à une **étude isolée** ; la replacer dans la totalité des preuves.
- Toujours **remonter à la source primaire** (jamais communiqué/tweet).
- Lire **résultats absolus** et critères **pré-enregistrés** (déjouer le spin et les critères changés en cours de route).
- Éviter le biais « absence de preuve = preuve d'absence » et la surinterprétation de l'observationnel.
- Vérifier **rétractations/errata** (Retraction Watch, alertes revue) avant intégration, surtout si l'item modifie un algorithme.
- **Vérifier chaque sortie IA** (références réelles, chiffres exacts — l'IA hallucine des DOI).
- **Double lecture** obligatoire pour les items à impact pratique.

### Documentation de la méthode
Une **procédure écrite (SOP)** — sources, critères, grille, cadence, rôles — **versionnée et publiée dans l'outil** (page « Méthode »). La transparence de la méthode est un gage de fiabilité (cf. la page « comment est faite la recherche bibliographique » de Médicalement Geek). Traçabilité : journal hebdomadaire (repéré/retenu/exclu), archivage, changelog des impacts sur les algorithmes. Boucle de rétroaction : corrections, retours utilisateurs, suivi des rétractations.

> **Synthèse** : sources fixes pré-appréciées + critères et grille écrits + alertes automatisées + double lecture + méthode publiée et versionnée = veille fiable et reproductible.

---

## 7ter. Vérification bi-agents (automatisation de la double lecture)

À **chaque veille hebdomadaire**, l'étape d'analyse (§7, étape 2) est fiabilisée par **deux agents indépendants orchestrés par Claude Code (Opus), puis réconciliés**. Principe : *rôles différenciés + ancrage sur la source primaire + réconciliation qui escalade au lieu de lisser + humain décideur final*. Workflow **identique** à celui de l'outil de décision (brief décision §13bis).

**Deux agents à rôles distincts** (pas des clones) :
- **Agent A — Analyste/Extracteur** : extrait résultats et effets absolus/NNT, applique la grille d'appréciation, propose thème / profession / niveau d'impact / niveau de preuve.
- **Agent B — Contradicteur/Red-team** : challenge la conclusion, traque le *spin*, vérifie chaque référence (DOI réel) et chaque chiffre **contre la source primaire**, confronte à la totalité des preuves.
- Contextes **séparés** (indépendance) ; **hétérogénéité de modèle** si possible (ex. Opus + Sonnet).

**Ancrage** : accord des agents ≠ vérité ; la vérification sur l'article primaire prime sur le consensus.

**Réconciliation (Opus)** → **rapport structuré** : consensus vérifié / divergences à escalader / non-vérifiable ; chaque item avec niveau de preuve + source. Pas de résolution silencieuse d'un désaccord à impact pratique → escalade au référent.

**Tie-breaker** : 3ᵉ passage ciblé seulement en cas de désaccord.

**Escalade humaine** : le référent valide ; pour les items modifiant un algorithme, le circuit du brief décision §13bis + §13 s'applique. La vérification bi-agents fiabilise le brouillon, elle ne remplace pas le référent.

**Journalisation** : les deux analyses + le rapport de réconciliation sont archivés (traçabilité, audit).

**Périmètre** : appliqué à l'analyse hebdomadaire et aux items à impact pratique ; allégeable pour les brèves purement informatives sans enjeu clinique.

---

## 7quater. Automatisation de la collecte (étape 1)

Principe : **automatiser le repérage, pas l'analyse**. La collecte produit une **moisson brute** de candidats normalisés qui alimente la présélection (§7bis, étape 2) — elle ne publie rien. Architecture compatible avec le dépôt git + l'hébergement statique.

### Composants
1. **Épine dorsale — APIs bibliographiques**
   - **PubMed E-utilities** (`esearch`/`efetch`) : une requête structurée **par thème/profession**, versionnée dans le dépôt (`/collecte/requetes/*.txt`). Exécution hebdomadaire, dédup par PMID/DOI.
   - **Europe PMC** (API REST) en complément (inclut preprints et open access).
2. **Flux RSS / Atom**
   - Sommaires (TOC) des grandes revues, **PubMed saved searches converties en RSS**, Cochrane, blogs EBM (DragiWebdo, Minerva), certaines sociétés savantes / agences.
   - Agrégation par script ou lecteur de flux.
3. **Sources sans flux ni API** (certaines pages de sociétés, HAS, Prescrire, Minerva)
   - **web-fetch programmé** d'une liste d'URL définie, avec **détection de changement** (diff depuis la semaine précédente). Respect de `robots.txt`, **pas de contournement de paywall** (métadonnées / abstract uniquement).
4. **Normalisation & déduplication**
   - Normaliser chaque candidat : titre, source, DOI/PMID, date, abstract, thème présumé, lien.
   - **Registre « déjà vu »** (par DOI/PMID) pour qu'un item n'apparaisse qu'une fois.
5. **Ordonnancement (scheduler)**
   - Job **hebdomadaire** : **GitHub Actions** (workflow programmé) — élégant car il écrit la moisson directement dans le dépôt en branche/PR — ou le cron du backend, ou une tâche planifiée.
   - Sortie : `/collecte/AAAA-Www.json` (candidats), déposée en PR pour le référent.

### Garde-fous
- La moisson = **candidats**, pas du contenu publié — entre en présélection (§7bis) puis analyse bi-agents (§7ter).
- Respect des **CGU et limites de débit** des APIs ; les flux fournissent métadonnées/abstract (suffisant pour trier) ; les sources sans flux → **complément manuel**.
- Chaque **requête versionnée** = collecte reproductible et auditable (cohérent avec la SOP).

### Recommandation MVP
Démarrer avec **PubMed E-utilities + Europe PMC + un socle de flux RSS** (revues + DragiWebdo/Minerva + HAS), orchestrés par un **GitHub Action hebdomadaire** produisant la moisson dans le dépôt. Étendre les sources par profil ensuite.

---

## 8. Sites de référence (à finaliser par profil)

Exemples à cadrer avec le comité (liste ouverte) :
- **Transversal / EBM** : Médicalement Geek (DragiWebdo), Minerva, Prescrire, Exercer, Cochrane, HAS.
- **Journaux** : NEJM, Lancet, JAMA, BMJ, Annals of Internal Medicine.
- **Diabète / CV** : Diabetes Care, SFD, ESC, ADA/EASD.
- **BPCO / pneumo** : SPLF, ERJ, Thorax.
- **Gériatrie** : SFGG, revues dédiées.
- **Santé-femme / périnatalité** : CNGOF, HAS maternité.
- **Orthophonie** : sociétés et revues spécifiques (à identifier).
- **Soins infirmiers** : plaies et cicatrisation (SFFPC), revues IDEL.

Chaque source : type, accès (libre/abstract/paywall), professions couvertes.

---

## 8bis. Thématiques à surveiller par profession (grille de veille)

Chaque thématique = un jeu de requêtes (PubMed/Europe PMC, §7quater) et un rattachement aux thèmes de la taxonomie (§4). Un article peut concerner plusieurs professions.

### Médecin généraliste (MG) — transversal soins premiers
- Cardiovasculaire / prévention CV : HTA, dyslipidémie/statines, risque CV (SCORE2), FA, antiagrégants/anticoagulants.
- Diabète & métabolisme ; thyroïde.
- Respiratoire : BPCO, asthme, infections respiratoires.
- Infectiologie courante & **antibiothérapie** (durées, résistance).
- Santé mentale (dépression, anxiété, sommeil) & **addictions** (tabac, alcool).
- **Dépistage & prévention** : cancers (sein, côlon, col/HPV), vaccination.
- Douleur, lombalgie/rhumatologie, usage AINS/opioïdes.
- **Gériatrie / déprescription / polymédication / iatrogénie**.
- Santé de la femme (contraception, ménopause) ; pédiatrie courante.
- Digestif (RGO/IPP), néphrologie (IRC, dépistage).

### IPA maladies chroniques — suivi & protocoles de coopération
- **Diabète de type 2** : traitements (iSGLT2, aGLP1), cibles, complications.
- **Maladies CV** : HTA, insuffisance cardiaque, FA, post-IDM, réhabilitation cardiaque.
- **BPCO** : traitements inhalés, exacerbations, réhabilitation respiratoire, sevrage tabagique.
- Insuffisance rénale chronique : dépistage, néphroprotection.
- **Gériatrie** : fragilité, chutes, troubles cognitifs, déprescription.
- **Prévention & ETP** : éducation thérapeutique, observance, activité physique adaptée, nutrition.
- Polypathologie / coordination du parcours.

### Sage-femme
- Suivi de grossesse physiologique ; **diabète gestationnel** ; **HTA gravidique / pré-éclampsie**.
- **Vaccination périnatale** (coqueluche, grippe, COVID, VRS maternel).
- Contraception & suivi gynéco de prévention (frottis/HPV) ; IVG médicamenteuse ; ménopause (champ SF).
- Post-partum : **dépression post-partum**, allaitement, rééducation périnéale.
- Supplémentations (folates, vitamine D, fer) ; prévention tabac/alcool en grossesse.
- Santé périnatale du nouveau-né.

### Orthophoniste
- Enfant : troubles du **langage oral et écrit** (dyslexie, retard de langage), communication dans les TSA.
- Adulte neuro : **aphasie post-AVC**, maladies neurodégénératives (Alzheimer, Parkinson), dysarthrie, troubles cognitivo-communicationnels.
- **Déglutition / dysphagie** (AVC, gériatrie, neuro).
- Voix et rééducation ORL (cancers, laryngectomie) ; surdité/implants ; bégaiement.
- **Efficacité des rééducations** (EBP : souvent peu d'ECR — attention au niveau de preuve).

### Infirmier·ère libéral·e (IDEL)
- **Plaies & cicatrisation** : escarres, ulcères, plaies chroniques, pansements.
- **Éducation / observance** ; suivi chronique (diabète : pied, injections ; anticoagulants).
- Soins techniques : perfusion/PICC, chambres implantables, prélèvements.
- Gériatrie à domicile : **prévention des chutes**, dépendance, **dénutrition**.
- **Soins palliatifs à domicile**, douleur.
- Prévention des infections (BMR, hygiène) ; vaccination (compétences élargies).

> Cette grille est le point de départ des requêtes ; elle est **versionnée** et affinée par les référents de profession.

---

## 9. Personnalisation — comptes utilisateurs légers (décision validée)

Choix retenu : **comptes utilisateurs**, pour synchroniser profil et « pour mémoire » entre appareils. Architecture **hybride** : contenu statique versionné (comme l'outil de décision) + **backend léger** pour l'authentification et les données utilisateur.

**Principe de minimisation** — ne stocker que le strict nécessaire :
- identifiant / e-mail (professionnel MSP) ;
- profil (profession) ;
- liste d'`ids` d'articles « pour mémoire » ;
- (optionnel) préférences d'affichage.

Aucune donnée de santé, aucune donnée patient.

**Authentification** — privilégier une méthode simple et sûre : *magic link* par e-mail ou e-mail+mot de passe, idéalement restreinte aux adresses de la MSP (liste blanche ou domaine). Éviter les connexions sociales (fuite de données tierces).

**Implémentation suggérée** — un *Backend-as-a-Service* européen (ex. Supabase/Nhost auto-hébergé ou instance UE) pour auth + base de données, afin de limiter le développement backend sur mesure. Hébergement des données **dans l'UE**.

## 9bis. RGPD — checklist (comptes = données personnelles)

Même sans donnée patient, les comptes déclenchent des obligations :
- **Base légale** (intérêt légitime / consentement) et **information** des utilisateurs.
- **Politique de confidentialité** + **CGU** accessibles.
- **Registre des traitements** (art. 30).
- **Minimisation & durée de conservation** définies (purge des comptes inactifs).
- **Droits** : accès, rectification, **suppression** (self-service de suppression de compte).
- **Sécurité** : chiffrement en transit et au repos, mots de passe hachés, journalisation des accès.
- **Hébergement UE** ; à évaluer : opportunité d'un hébergeur de données de santé (HDS) — a priori non requis ici (pas de donnée de santé), à confirmer.
- **Sous-traitance** : contrat/DPA avec le fournisseur backend.

Le reste de l'outil (contenu, taxonomie, filtres) demeure statique et versionné.

---

## 10. Articulation avec l'outil de décision

- **Même plateforme / même dépôt git**, taxonomie de thèmes commune.
- Champ `impact_algorithme.noeuds_impactes` = pont vers les nœuds de décision.
- Le workflow d'intégration (veille → algorithme) est **celui du brief décision §13** : proposition de diff par Claude → validation humaine → application versionnée et tracée. Jamais de modification automatique.

---

## 11. Stack technique (architecture hybride)

- **Contenu** : YAML (`/content/veille`) + JSON Schema, partagé avec l'outil de décision (statique, versionné git).
- **Front** : Astro (ou vanilla), pages filtrables par profil/thème/impact. *(voir DECISIONS.md D1 : retenu Vite+React+TS)*
- **Backend (nouveau)** : BaaS européen (auth + base de données) pour comptes, profil et « pour mémoire ». API minimale.
- **Données utilisateur** : hébergées dans l'UE, minimisées (§9), sécurisées (§9bis).
- **Hébergement / versioning** : contenu statique + git (pull request) ; données utilisateur côté backend.

---

## 12. Gouvernance & maintenance

- **Référent veille** (+ éventuels référents par domaine/profession) ; déclaration de liens d'intérêt.
- **Cadence** : hebdomadaire ; un article n'est **`valide`** qu'après relecture.
- **Droit d'auteur** : contrôle systématique (résumé + lien, pas de copie).
- **Archivage** : les semaines passées restent consultables et filtrables.
- **À vérifier** : statut de dispositif médical (le volet veille est plutôt informatif, mais le couplage avec l'algorithme peut l'impliquer).

---

## 13. Décisions ouvertes (défauts proposés)

| Point | Décision / défaut |
|---|---|
| Personnalisation | **Comptes utilisateurs légers** (backend UE, minimisation RGPD) — validé |
| Périmètre professions MVP | **Tous les profils** (contenu montant en charge progressivement) — validé |
| Méthode d'authentification | À trancher : magic link vs e-mail+mot de passe (reco : magic link, liste blanche MSP) |
| Ordonnanceur de collecte | GitHub Action hebdomadaire (défaut) écrivant la moisson dans le dépôt |
| Fournisseur backend | À choisir (BaaS UE type Supabase/Nhost) — *retenu Supabase, cf. DECISIONS.md D1* |
| Liste des sites de référence | À finaliser par le comité, par profil |
| Format contenu | YAML + JSON Schema (commun aux deux outils) |
| Front | Astro (ou vanilla), commun aux deux outils — *retenu Vite+React+TS* |

---

## 14. Feuille de route

1. **Phase 0** — valider ce brief ; choisir méthode d'auth + fournisseur backend ; rédiger politique de confidentialité / CGU / registre RGPD.
2. **Phase 1** — modèle d'article + page veille filtrable (profil / thème / impact).
3. **Phase 2** — comptes utilisateurs (auth, profil, « pour mémoire ») + conformité RGPD (§9bis).
4. **Phase 3** — pipeline d'extraction assisté (web-fetch + prompts OpenEvidence) et gabarit d'analyse critique.
5. **Phase 4** — couplage avec l'outil de décision (lien article → nœud, workflow d'intégration).
6. **Phase 5** — pilote sur plusieurs profils, retours, itération.
7. **Phase 6** — mise en ligne + cadence hebdomadaire (référents par profession).
