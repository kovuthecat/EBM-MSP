# Décision DT2 — méthode de construction des nœuds

Autorité du contenu clinique du **domaine `diabete-type-2`**. Un nœud d'algorithme est la **sortie**
d'un travail de preuve tracé ; ce fichier fixe la méthode, la racine `docs/decision/` la porte.

**La grammaire générique a été sortie d'ici : [`GRAMMAIRE-NOEUD.md`](GRAMMAIRE-NOEUD.md).** Elle ne
connaît aucun domaine et énonce ce qu'un nœud doit exprimer (R1→R9) plus la structure de son banc de
test — donc réutilisable telle quelle par les domaines à venir. **Ce fichier-ci reste DT2** : pipeline
de preuve, règles de sourcing, socle de sources, état des nœuds. Les deux se lisent ensemble avant
d'écrire un nœud ; la grammaire d'abord.

**Le procédé de construction a lui aussi été sorti d'ici :
[`CONSTRUIRE-UN-MODULE.md`](CONSTRUIRE-UN-MODULE.md)** — dans quel ordre bâtir un module (P0→P7),
avec quelles portes de sortie et quelles checklists opposables. Ce fichier-ci décrit **comment
sourcer** (étape P4 du procédé) ; l'autre décrit **quand le faire et ce qui doit être acquis avant**.
Pour un nouveau domaine, `CONSTRUIRE-UN-MODULE.md` se lit **en premier** — la collecte n'est que la
cinquième étape.

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
- **Ne jamais recopier un PMID rendu par OpenEvidence** (règle établie le 2026-07-29, passe A du nœud E).
  Mesure faite ce jour-là : **6 des 7 PMID** rendus par OE étaient faux, et ils pointaient vers des articles
  *existants mais sans rapport* — neuro-imagerie pour ACE, ACCORD Lipid pour NAVIGATOR, gynécomastie et
  histiocytose pour 4T, portefeuille diététique pour STOP-NIDDM. Un PMID faux ne se voit pas : il a la bonne
  forme, il résout, et il donne au lecteur pressé l'impression d'une vérification. **Ses DOI, eux, étaient
  justes (3/3) et ses chaînes de citation aussi (6/7)** — le défaut est donc localisé à l'identifiant
  numérique, pas à la connaissance de la littérature. Conduite à tenir : reprendre le **DOI** ou la
  **citation complète** (auteur, revue, année, volume, pages) et **retrouver le PMID soi-même**. Cette règle
  est également rappelée en tête de chaque fichier de prompts OE.
- **Un verdict d'absence est une affirmation, et il se source comme les autres** (règle établie le
  2026-07-29 après analyse de l'échec du 2026-07-27). « Aucune source ne porte X » n'est recevable que si
  (a) le **corpus local** `docs/decision/sources/` a été **ouvert** — pas seulement listé — et (b) **au moins
  deux méthodes d'extraction** ont été essayées sur les pièces pertinentes. Motif : le 2026-07-27, un
  red-team a conclu qu'aucune source SFD ne portait le seuil de 0,5 U/kg alors qu'il est **verbatim dans
  l'Avis n° 19 de la SFD 2025**, présent dans le corpus ; il avait travaillé sur un téléchargement web
  illisible sans jamais ouvrir le fichier local, contre l'instruction explicite ci-dessous. Aggravant : le
  même chantier avait **déjà renversé** un verdict « PDF non extractible » quelques jours plus tôt
  (`redteam-seuils-renaux.md` §7.2). Un PDF qui résiste à un outil cède souvent au suivant — et une pièce
  du corpus (`10_petites_astuces_anti-sédentarité.pdf`) est réellement à **0 caractère extractible**, ce qui
  se constate, se note, et ne se déduit pas.
- **Périmètre OpenEvidence (non négociable).** OE n'a **pas d'accès fiable** aux sources de reco & EBM
  **françaises/francophones/indépendantes** (**HAS, SFD, CMG, Prescrire, Médicalement Geek/DragiWebdo,
  Minerva, Exercer, ebmfrance**) : sommé de les couvrir, il **hallucine** (PMID/URL/positions inventés — déjà
  arrivé, cf. `noeuds/E-insuline.md` §5). **Ne jamais** demander à OE d'explorer/citer ces sources ; cadrer ses
  prompts sur les **essais primaires** et les **recommandations internationales indexées** (ADA/EASD, ADA
  Standards of Care, ESC/EAS, KDIGO…). La reco française et la position critique sont curées **par les agents**
  (sources locales `docs/decision/sources/` + web + référent), **jamais par OE**. Cf. `BRIEF_DECISION.md` §14bis.
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
- *OpenEvidence / web = débroussaillage complémentaire, **jamais** source primaire.* **OE ne sait pas
  interroger les sources FR ci-dessus** (HAS/SFD/CMG/Prescrire/Médicalement Geek…) — il les hallucine : elles
  sont traitées par les agents (sources locales + web), pas par un prompt OE. Cf. Règles de sourcing ci-dessus.

La **reco officielle** (HAS, CMG) est affichée **à côté** de la position critique (Prescrire/EBM),
divergence signalée (brief §2).

## Sources locales déjà disponibles (`docs/decision/sources/`)

> **Avant de chercher une source sur le web ou de la demander au référent, vérifier ce dossier.**
> Il contient des PDF/notes déjà collectés (certains fournis par le référent, hors droit de
> reproduction intégrale — cf. Règles de sourcing ci-dessus) : **inutile de les re-chercher en ligne**,
> et souvent **impossible** de les retrouver par recherche web (PDF scannés, accès payant, ou email).
>
> **Tableau complété le 2026-07-29** : il n'en recensait que **10 pièces sur 18**, et deux des manquantes
> (SFD Paramédical 2022, SFD MCG 2017) étaient déjà **utilisées** par le nœud E. Un corpus partiellement
> catalogué produit exactement le faux négatif décrit dans les règles de sourcing ci-dessus — la ligne
> manquante devient une source « qui n'existe pas ». **Toute pièce ajoutée à `sources/` doit être inscrite
> ici dans le même geste**, avec ce qu'elle est réellement (deux entrées ci-dessous portent un nom de
> fichier trompeur).

| Fichier | Contenu |
| --- | --- |
| `prescrire-dt2.md` | Notes de synthèse **Prescrire** DT2 (usage interne, résumé critique + citations courtes + refs exactes) — réutilisable pour les nœuds B, C, D, E, F, H. Ne jamais reproduire intégralement côté outil. |
| `strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf` | RBP **HAS** « Stratégie thérapeutique du patient vivant avec un DT2 » (2024) — reco officielle de référence, cibles d'HbA1c en Annexe 3. |
| `SFD 2025.pdf` | Recommandations **SFD 2025** (Société Francophone du Diabète) — volumineux (texte intégral). |
| `rapport_gtg_glucides_sfd.pdf` | Rapport SFD sur les **glucides** (groupe de travail glucides). |
| `Insulinothérapie dans le diabète de type 2 _ ebmfrance.pdf` | Fiche **ebmfrance** insulinothérapie DT2 — utile pour le nœud E (Insuline). |
| `HAS 2025 - Parcours de soins DT2 - guide.pdf` | Guide **HAS** « Parcours de soins du patient adulte vivant avec un DT2 », **adopté le 26 juin 2025** (décision n° 2025.0159/DC/SBP), publié le 16 juillet 2025. **§5.2 : « avant les repas : 0,70 à 1,20 g/l ; en post-prandial (2 h) : < 1,80 g/l »** — les deux seuils capillaires du nœud E, **en g/L**, dans une source de 2025. Porte aussi (§8.1) « la baisse de l'HbA1c survenant en l'absence d'intensification évoque un surtraitement ». Versé et **vérifié en primaire** le 2026-07-29 (passe A). |
| `HAS 2011 - fiche BUTS autosurveillance glycemique DT2.pdf` | Fiche de bon usage **HAS/CNEDiMTS**, avril 2011 (FBUTSGLYCEM2), 2 p. — **origine historique** des deux mêmes seuils, en mg/dL, et **seule source française chiffrant les rythmes d'ASG** : « au moins 4/jour si plus d'une injection ; 2 à 4/jour si une seule ». **Aucun grade imprimé, aucun essai cité** : force forte, certitude très faible. Versée et vérifiée en primaire le 2026-07-29. |
| `Lifestyle education in type 2 diabetes _ ebmfrance.pdf` | Fiche **ebmfrance** éducation/mode de vie DT2 — utile pour le nœud H (RHD). |
| `Traitement global et suivi du diabète de type 2 _ ebmfrance.pdf` | Fiche **ebmfrance** traitement global et suivi DT2 — vue d'ensemble transverse. |
| `guide HAS._parcours_surpoids-obesite_de_ladulte.pdf` | Guide de parcours **HAS** surpoids-obésité de l'adulte (2023, MàJ 2024) — classes d'obésité, seuils/prérequis chirurgie, approche non culpabilisante ; utile pour le nœud H (RHD). |
| `pdp_pompe_insuline_externe_mcg.pdf` | **Prise de position SFD PARAMÉDICAL 2022** — « Prise en charge des patients vivant avec un diabète traités par pompe à insuline externe portable et/ou utilisant la mesure continue de glucose ». Porte la **Fig. 2** (cibles TIR/TBR/TAR) triangulée avec Battelino 2019, et le **§6.8** (critères de réévaluation à 3 mois : port > 60 %, absence d'hypoglycémie sévère, TIR, HbA1c). Utilisé par le nœud E, **jamais catalogué ici jusqu'au 2026-07-29**. |
| `mmm_referentielmcg_ep11.pdf` | **SFD 2017, hors-série n° 1** (*Méd. Mal. Métab.* vol. 11, juin 2017) — « Éducation à l'utilisation pratique et à l'interprétation de la **Mesure Continue du Glucose** : position d'experts français ». ⚠ **Le nom du fichier induit en erreur** : « mcg » = Mesure Continue du Glucose, **pas** le Collège de la Médecine Générale — le nœud D avait cité ce fichier comme s'il portait une position du CMG, ce qui est faux. Pré-consensus (visait TIR 60 %, avant Battelino 2019) ; **déclaration d'intérêts massive** (Abbott, Dexcom, Medtronic, Insulet, Roche) à afficher avec toute reprise. §9 : caveats de fiabilité des capteurs. |
| `NICE 2023.pdf` | ⚠ **Ce n'est PAS NG28 (diabète)** : c'est **NG238**, *Cardiovascular disease: risk assessment and reduction, including lipid modification*, publiée le 14 décembre 2023 (52 occurrences de « NG238 », **zéro** de « insulin »). Établi par le red-team du 2026-07-29. Pièce du nœud **F (statine)**, sans usage possible pour le nœud E. Le fichier gagnerait à être renommé. |
| `statin-intolerance-pathway.pdf` | Arbre décisionnel **intolérance aux statines** (ressource adossée aux guidances NICE CG181/TA385/TA393-394/TA694/TA733) — nœud F ; couvre l'effet nocebo et la reprise à dose réduite. |
| `HAS activité physique.pdf` | Guide **HAS** « Guide des connaissances sur l'activité physique » — nœud H (RHD), volet activité physique. |
| `manger bouger reco.pdf` | Repères nutritionnels **Santé publique France / Manger Bouger** — nœud H, matériel patient. |
| `4DDK001_400x600_50PC_AFF_reco chaque petit pas compte_E2_VDEF.pdf` | Affiche patient « **Chaque petit pas compte** » (activité physique) — nœud H, support d'éducation, pas une source de preuve. |
| `10_petites_astuces_anti-sédentarité.pdf` | Affiche patient anti-sédentarité — nœud H. ⚠ **0 caractère extractible** (PDF entièrement matriciel) : le seul fichier du corpus dont le contenu est inaccessible aux outils texte. Constaté et mesuré le 2026-07-29 ; à lire à l'œil si son contenu devient nécessaire. |

## Échelle GRADE simplifiée

`eleve` (ECR de qualité, critères durs, cohérent) · `modere` (ECR avec limites, ou substitution solide) ·
`faible` (essais fragiles, sous-groupes, observationnel bien conduit) · `tres_faible` (avis, extrapolation).

## Nœuds du domaine DT2 (7 nœuds : A–F, H) — état

| Id | Nœud | Dossier | Statut preuve | Nœud YAML |
| --- | --- | --- | --- | --- |
| A | Cible glycémique | `noeuds/A-cible-glycemique.md` | **VALIDÉ + ENCODÉ (T-007bis)** : `content/…/cible-glycemique.yaml` v2.0 `statut: valide` · sortie unique · 27/27 tests verts | P1/S2 |
| B | 1re intention (par comorbidités) | `noeuds/B-premiere-intention.md` | **VALIDÉ + ENCODÉ (v1.4, 2026-07-23)** : `content/…/premiere-intention.yaml` (multi-options) + argumentaire niveau 3 ; base de preuve complète et vérifiée (bi-agents + 5 OpenEvidence + 3 passes de vérif. dont YAML/triangulation + HAS/Méd. Geek/SFD 2025 + Prescrire). Tous arbitrages validés référent ; **MIGRÉ vers le moteur P2** : garde-fou catabolique + CI DFG<20/DFG<30 en `exclusions` (tracées), priorité par critère dominant/phénotype en `priorite` conditionnelle (REIN→iSGLT2 rang1 ; ASCVD→iSGLT2 devant tirzépatide ; obésité seule→tirzépatide rang2). **v1.4 : correctif de production** — metformine passée en sentinel `["toujours"]` (D16, rang 0) : elle disparaissait entièrement dès qu'un ajout matchait (encodée par erreur `["default"]`), bug signalé par un utilisateur. Badge distinct « Recommandation officielle » sur le socle vs « Recommandée » (EBM) sur la 1re option d'ajout. 115 tests + build OK. Restant : vars décompensation/cétose | **✔ encodé** |
| C | **Intensification / Optimisation** (ajout · substitution SU/gliptine → iSGLT2/GLP-1 · désintensification) | `noeuds/C-intensification.md` | **VALIDÉ + ENCODÉ + VÉRIFIÉ BI-AGENTS (2026-07-23)** : `content/…/intensification.yaml` v1.0 `statut: valide` (**10 options**) + argumentaire niveau 3. **3 leviers** (désintensifier / introduire-substituer iSGLT2-GLP1 / remplacer SU) + **sécurité rénale metformine** (arrêt DFG<30 / réduction 30-59, RCP ANSM) · garde-fous durs (`exclusions` DFG<20 ; **non-association gliptine+GLP-1 par construction** + détection du combo préexistant ; désintensif. exclusive & jamais un protecteur). Preuves triangulées **bi-agents × OpenEvidence × HAS 2024 × SFD 2025** ; **vérif. encodage bi-agents A/B** (17 profils, 0 HAUTE, 5 corrections) ; **87 tests + build**. | **✔ encodé** |
| D | Sulfamides / gliptines (place résiduelle) | `noeuds/D-sulfamides-gliptines.md` | **ENCODÉ (brouillon v0.1) + VÉRIFIÉ BI-AGENTS ÉTAPE 8 (0 HAUTE/0 MOYENNE) — 2026-07-24** (`content/…/sulfamides-gliptines.yaml` + argumentaire ; Ajv+137 tests+build). Triangulation A × OE × red-team B réconcilié ; dossier §0-§8 rédigé (multi-options : socle « préférer iSGLT2/aGLP1 » + gliptine (rang 1) + sulfamide (rang 2), déclencheur `classes_a_benefice_indisponibles`, garde-fous durs saxa/alo-IC, glibenclamide, hypo, DFG<30). Preuves agents A : gliptines = 4 CVOT neutres + **signal IC saxa/alo** (sita/lina neutres) ; SU = **CV-neutres vs comparateurs modernes** (CAROLINA/TOSCA.IT/GRADE), vrai risque = hypo+poids, **glibenclamide à proscrire** ; zéro bénéfice dur des 2 classes ; **linagliptine idéale en IRC (sans adaptation) MAIS jamais commercialisée en France → gliptine FR = SITAGLIPTINE** (dose adaptée au DFG). Reco off. (HAS 2024/SFD 2025/ADA-EASD) = 2e/3e ligne non préférentielle, gliptine avant SU ; **Prescrire écarte les gliptines** (divergence). **OE 2ᵉ passe + red-team B faits : `[À VÉRIFIER]` levés contre source primaire** (PMID faux écartés côté OE ET agents ; agents 3/4 corrects, OE 1/4). Corrections : pancréatite = signal significatif en méta (OR 1,6-1,8) ; pemphigoïde Lee HR 1,42 (pas 2,2) ; ACP 2024 PMID 38639546 ; glibenclamide WHO EML restreint 2021 ; **ADA cortico-induit NON vérifié** (retiré) ; garde-fou IC élargi saxa **+ alo** (AHA Classe III). **Décisions référent Q1-Q5 appliquées** : coût NON critère FR (`contrainte_cout` retiré) ; déclencheur `classes_a_benefice_indisponibles` ; gliptine (rang 1) devant SU (rang 2) ; seuils rénaux figés d'après les RCP ; ancrage soins premiers = **ebmfrance « Traitement global »** (pas de source CMG) ; **point hypo tranché : SU gardé en alerte molle, pas de gate dur**. **Vérif. encodage bi-agents** : Agent A fidélité (0 HAUTE/0 MOYENNE) × Agent B red-team moteur (10 profils via `evaluateNode`, garde-fou DFG<30 appliqué+tracé, 0 HAUTE/0 MOYENNE). **Câblé dans l'app** (1 libellé). **RESTE : validation clinique FINALE du référent → `statut: valide`.** ⚠ GRADE durabilité (SU > gliptine) ; **source CMG erronée** (mmm_referentielmcg = MCG glucose 2017, pas Collège Méd. Générale). | **✔ encodé (brouillon)** |
| E | **Insuline** (initiation · optimisation basale · ajout bolus/basal-plus · adaptation basal-bolus) | `noeuds/E-insuline.md` | **ENCODÉ (brouillon v0.1) + VÉRIFIÉ BI-AGENTS ÉTAPE 8 (0 HAUTE après correction) — 2026-07-24** : `content/…/insuline.yaml` + `insuline.argumentaire.md`. Nœud **multi-options routé par `situation_insuline`** (4 situations, 11 options, 9 alertes). Pipeline complète : 5 agents A × **OE 2ᵉ passe** × **red-team B1/B2/B3** (PMID corrigés — tous les PMID litigieux d'OE étaient faux ; « Prescrire=NPH » & « position CMG » = **inventions OE écartées** ; hypo sévère analogue-vs-NPH **NON significative** — Cochrane 2020). **MCG = 2 axes** : contrôle (TIR/TAR/GMI = interprétation/alertes, consensus) vs sécurité (TBR/CV/hypo = gate). **Doses calculées** (poids + doses actuelles). Arbitrages §8-1→8-7 tranchés. **Vérif. étape 8** : Agent A fidélité (0 HAUTE, 4 corrections traçabilité) × Agent B red-team moteur (27 profils, 1 HAUTE = trou d'exclusion 2a/hypo-nocturne **corrigé + re-tracé**). Ajv 7/7, **136 tests**, build. **CÂBLAGE GÉNÉRIQUE RÉALISÉ** (3 features réutilisables : critères DÉRIVÉS calculés via champ `derive` du schéma + `engine/deriveCritere.ts` ; nombres OPTIONNELS via `criteresReferences()` ; tooltips AGP `describeEnumValue`) ; visuel dans `VALIDATION.md`. Ancrages : ORIGIN, 4T, Treat-to-Target, DEVOTE, DUAL VII, FullSTEP, Bertuol NMA, Battelino 2019, MOBILE, FreeDM2. **★ PASSE A « PILOTER SANS CAPTEUR » — 2026-07-29, `insuline.yaml` v0.26 → v0.30** (5 agents A × OpenEvidence × red-team B1/B2/B3 × conciliation × 8 arbitrages référent A→H ; dossier `noeuds/E-insuline.md` **§3 SOUS-DOSSIER E6** + `validation/chantier-2026-07-29/`). Motif : la majorité des DT2 insulino-traités FR n'ont pas de capteur en permanence, et le nœud ne savait raisonner que sur une courbe. **Encodé** : `TBR_severe` **retiré** (inobtenable sans capteur) ; glycémie à jeun en **3 états** (`gaj_basse`/`gaj_a_cible`/`gaj_haute` — l'ancien booléen confondait *au-dessus* et *en dessous*, si bien qu'une glycémie basse ouvrait la titration) ; **pivot « avant les repas »** (`glycemie_pre_repas`, cf. FullSTEP qui titre sur le pré-prandial suivant et STEP-Wise qui ne trouve aucune différence entre les deux stratégies) ; bande **0,70-1,30** (borne basse HAS = seuil d'hypoglycémie, donc déclencheur ; borne haute SFD/ADA — **divergence avec HAS assumée**) ; antécédent d'hypoglycémie sévère déplacé d'`exclusions` vers une **alerte** (R8) ; option **« Envisager d'instaurer une MCG »** en tête (SFD Avis 23, primo-prescription MG). **Consignation (lot 4, v0.30, comportement inchangé)** : 12 références ajoutées, **tous PMID re-dérivés par le red-team — 6 des 7 PMID d'OpenEvidence étaient FAUX** ; **D2** (borne « ±10-20 % » sans aucune source, qui s'affichait en **dose calculée**), **D3** (l'algorithme de titration n'est **pas** celui de Riddle — seul le « ~60 % » l'est), **D4** (le seuil 0,5 U/kg **est** verbatim SFD Avis 19, contrairement à ce que le nœud affirmait) corrigés ; argumentaire **§ 5 bis** neuf. **2 corpus versés et vérifiés en primaire** (HAS 2011 fiche BUTS, HAS 2025 Parcours de soins §5.2) ; tableau du corpus porté de 10 à 18 pièces. **Silence délibéré consigné** : le nœud n'énonce PAS que l'autosurveillance est sans bénéfice propre (Nauck 2014 négatif), arbitrage référent motivé — c'est l'instrument de mesure, pas une intervention. **★ VALIDÉ CLINIQUEMENT PAR LE RÉFÉRENT le 2026-07-29** : `content/…/insuline.yaml` **v0.31 `statut: valide`**. Reste : affichage du nombre de dose calculé = P3+. | **✔ VALIDÉ** |
| F | **Statine chez le diabétique** | `noeuds/F-statine.md` | **VALIDÉ + ENCODÉ + VÉRIFIÉ BI-AGENTS (2026-07-23)** : `content/…/statine.yaml` **v1.0 `statut: valide`** (**ordered-first-match**, 3 tiers EBM-ancrés + 3 alertes) + argumentaire niveau 3. Preuves **agents A × red-team B (essais + reco) × OpenEvidence OE-F1→F5** (DOI/chiffres vérifiés source primaire) ; **reco française SFE/SFD/NSFA/SFC 2026** (PMID 41651737) + note **conflits d'intérêt** ; stratification « que dit l'EBM » (enrichissement CARDS/HPS, **pas** de seuil SCORE2 ; mortalité primaire non revendiquée) ; rosuva 10-20. **Vérif. encodage bi-agents étape 8 : 0 finding HAUTE** (A fidélité + B red-team moteur, ~35 profils) ; **122 tests + build.** Restant P3 : câblage formulaire D3 (nouveaux critères). | **✔ encodé** |
| H | RHD / perte de poids / rémission | `noeuds/H-rhd.md` | à faire | P2 |

> **Nœud G (aspirine) retiré** : pas d'algorithme à construire (pas de prévention primaire — ASCEND ;
> secondaire = systématique). Reste **7 nœuds**. L'info aspirine pourra vivre comme note statique dans
> le contexte prévention CV, pas comme nœud interrogeable.

Gabarit de dossier : `noeuds/_TEMPLATE.md`.
