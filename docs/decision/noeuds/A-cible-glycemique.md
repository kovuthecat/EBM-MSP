# Nœud A — Cible glycémique individualisée   (dossier de preuve)

- **statut** : **corrigé selon la 2ᵉ passe** (age<70 · CV/IRC sévère→≤8 via `comorbidite_grave` · conditions
  exclusives + sortie unique · `divergence:true` · notation ~6,5 % · Coca/Ruospo dissociés · retrait Cochrane
  2015 · NNH hypo 15–52) — **À VALIDER : sign-off clinique du référent AVANT encodage** (rapport : `.verification-p2.md`)
- **version** : 0.1 · **date** : 2026-07-22 · **auteur** : Opus (réconciliation bi-agents), référent à valider
- **id YAML cible** : `cible-glycemique` · domaine `diabete-type-2`

## 0. Nature de ce dossier (garde-fou méthodo)

1re passe : **Agent A** (extraction, Sonnet) + **Agent B** (red-team, Opus), recherche web, puis
**réconciliation Opus**. Les sources primaires sont citées (DOIs vérifiés en ligne par les agents),
mais **non encore croisées avec Prescrire / Médicalement Geek ni validées cliniquement**. Per la SOP,
web/OpenEvidence = **débroussaillage, jamais source primaire** : tout ici est **provisoire**, les NNT
dérivés et éléments `[À VÉRIFIER]` ne passent pas au YAML avant confirmation.

## 1. Question & critères d'entrée

- **PICO** : adulte DT2 (hors DT1/grossesse) ; quelle cible d'HbA1c individualiser ; comparateurs =
  bandes de cible ; outcomes durs (mortalité, IDM, AVC, rénal dur) vs substitution (microangiopathie),
  hypoglycémie sévère.
- **Critères d'entrée** : `age` (nombre), `anciennete_diabete_annees` (nombre), `esperance_vie`
  (longue ≙ EV > 15 ans / intermediaire / limitee ≙ < 5 ans, *mapping HAS*), `fragilite` (bool),
  `risque_hypoglycemie_schema` (faible/eleve), **`antecedent_cv` (bool) — AJOUTÉ (décidé #2)**.
- ✅ **`antecedent_cv` = critère OFFICIEL** : la table HAS 2024/2013 (Annexe 3) réserve la cible ≤ 6,5 %
  au patient « **sans antécédent cardiovasculaire** » → ce n'est plus une déduction mais la reco elle-même.
  *(Granularité HAS restant à trancher : CV non évolué ≤7 % vs évolué ≤8 % — cf. §5/§6.)*

## 2. Rapport de réconciliation

### 2a. Consensus vérifié (haute confiance — les deux agents concordent + sources primaires)

- **ACCORD** (intensif 6,4 % vs 7,5 %, arrêté à ~3,5 ans) : **surmortalité** toutes causes **HR 1,22
  (1,01–1,46)**, mortalité CV ↑ ; **critère principal composite CV NON significatif (HR 0,90)** ;
  **IDM non fatal réduit (HR 0,76)**. **La cause de la surmortalité reste inexpliquée — les post-hoc
  ont écarté l'hypoglycémie.** *(NEJM 2008, 10.1056/NEJMoa0802743)*
- **Méta-analyses concordantes** (Turnbull/CONTROL 2009 ; Boussageon 2011 ; Hemmingsen 2011 ;
  Cochrane 2013) : **pas de réduction de mortalité** (toutes causes ~RR/HR 1,00–1,04 ; CV ~1,06–1,11,
  NS) ; bénéfice macrovasculaire **modeste, porté par l'IDM non fatal** (HR ~0,85), **pas sur l'AVC**.
- **Bénéfice microvasculaire robuste** (rétinopathie, néphropathie/albuminurie) — **critère de
  substitution** — dans tous les essais.
- **Hypoglycémie sévère ~2,2–2,5×** sous contrôle intensif (Turnbull HR 2,48 ; Boussageon RR 2,33 ;
  Cochrane RR 2,18 ; Hemmingsen RR 2,39). « Doublement » = estimation **prudente**.
- **Effet « legacy »** réel **uniquement dans le profil UKPDS** (jeune, diabète récent) : à 10 ans
  post-essai, mortalité −13 % / IDM −15 % (bras sulfamide-insuline), metformine −27 % / −33 %.
  **NON répliqué** dans VADT à 15 ans (Reaven 2019) ni ADVANCE-ON (2014). *(UKPDS 80, 10.1056/NEJMoa0806470)*
- **Aucun ECR** n'a comparé des **bandes étroites adjacentes** (7–7,5 vs 7,5–8 %) : les cibles fines
  des recos sont **extrapolées**, pas testées tête-à-tête.

### 2b. Divergences / corrections à ESCALADER (référent)

1. **Argument « courbe en J → plancher ~6,5 % » du brief §11 = faible** (Agent B). La courbe en U
   n'existe qu'en **observationnel** (Currie 2010, *Lancet*), avec **nadir ~7,5 % (pas 6,5 %)**,
   **causalité inverse probable** (fragilité/comorbidités tirent l'HbA1c basse ET la mortalité) et
   **financement Eli Lilly**. → Le plancher se justifie mieux par **ACCORD** (danger du serrage
   agressif) que par la courbe en J. **Réviser l'argumentaire du brief §11.**
2. **Dissociation ACCORD vs ADVANCE** à intégrer : **ADVANCE a atteint 6,5 % SANS surmortalité** → ce
   n'est **pas le niveau bas** qui tue, mais probablement la **stratégie agressive/rapide/polymédicamentée**
   d'ACCORD (rosiglitazone 91 % vs 57 %, prise de poids). Le nœud ne doit pas conclure « cible basse = décès ».
3. **Ajouter `antecedent_cv` ?** (cf. §1) — variable la plus discriminante de la littérature.
4. **Seuils des conditions** (âge, ancienneté) proposés ci-dessous par Agent A : diffèrent légèrement
   du brief §11 — **à arbitrer**.

### 2c. Non-vérifiable en ligne → confirmer sur source primaire / Prescrire  `[À VÉRIFIER]`

- Chiffres **absolus** exacts du suivi post-essai UKPDS 80 (seules les réductions **relatives** confirmées).
- **NNT explicites** pour Turnbull/Boussageon/Cochrane (ces publications raisonnent en RR/HR ; les NNT
  d'Agent A sont **calculés/approximatifs** : ACCORD NNH≈370/3,5 ans ; ADVANCE NNT≈53/5 ans ; UKPDS NNT≈20–36/10 ans).
- Taux **exact** d'hypoglycémie sévère dans VADT (formulations divergentes selon sources secondaires).
- Version **Cochrane pub4 (2015)** non consultée (chiffres 2013 utilisés).

### 2d. Intégration des sources curées (OpenEvidence + Médicalement Geek) — 2026-07-22

**Confirment** le consensus (pas de bénéfice mortalité/macro dur ; micro surtout substitution ; hypo
×2–3 ; legacy observationnel ; pas d'ECR sur bandes étroites).

**Corrigent / précisent** (OpenEvidence — refs ADA 2026, JAMA 2025, Ray 2009, Hemmingsen 2011, Coca
2012, Ruospo/Cochrane 2017) :
- **ACCORD NNH mortalité ≈ 100 sur 3,5 ans** (5 % vs 4 %) — le NNH≈370 calculé par Agent A **sous-estimait
  le risque** ; on retient **≈100**. *(résout un `[À VÉRIFIER]`)*
- **IDM non fatal : NNT ≈ 125 sur ~5 ans** (réduction absolue ~8/1000). *(résout)*
- **Hypoglycémie sévère : RR ~2,4** (Hemmingsen RR 2,39). **NNH ≈ 15–52** (Boussageon, même corpus) — la
  fourchette « 9–15 » (bornée à 9) n'est pas sourcée, **corrigée** en « 15–52 ». *(2ᵉ passe)*
- **Rénal dur** : bénéfice IRT **seulement dans ADVANCE** (HR 0,35 en essai → 0,54 à 10 ans ; NNT≈860/5 ans),
  **non confirmé en méta-analyse** — chiffres **dissociés par étude (correction 2ᵉ passe)** : **Coca 2012**
  IRT RR 0,69 (0,46–1,05) · doublement créat RR 1,06 (0,92–1,22) ; **Ruospo/Cochrane 2017** IRT RR 0,62
  (0,34–1,12) · doublement créat RR 0,84 (0,64–1,11) — tous NS.

**Médicalement Geek** (cadre pratique FR, anti-sur-traitement) :
- Bandes : <7 % classique · **6,5 % jeune sans complication** · **7–7,5 % >65 ans** · **7,5–8 % fragile
  comorbide** · **8–9 % espérance limitée**. **Déprescrire si HbA1c < 6,5 %.**
- Garde-fou (déjà au brief §11) : **baisse rapide de l'HbA1c → aggravation de la rétinopathie** préexistante.

**Corrobore l'ajout de `antecedent_cv`** : la **HAS 2013** conditionne la cible ≤6,5 % à « diabète récent,
espérance de vie >15 ans, **PAS de MCV avérée**, sans hypoglycémie ». L'absence de MCV établie est donc un
critère **officiel** → renforce l'escalade §2b-3 (ce n'est plus seulement une déduction d'Agent A).

## 3. Base de preuves (fiches condensées)

| Étude (source) | Design / population | HbA1c (int. vs std) | Résultat dur clé | Hypo sévère | GRADE |
|---|---|---|---|---|---|
| **UKPDS 33** *(Lancet 1998, 10.1016/S0140-6736(98)07019-6)* | ECR ouvert ; DT2 **nouveau dx**, âge ~53 | 7,0 vs 7,9 % | IDM RR 0,84 (NS, p=0,052) ; microvasc. RR 0,75 | ↑ (composite) | Micro **modéré** / dur **faible** |
| **UKPDS 80** *(NEJM 2008, 10.1056/NEJMoa0806470)* | Suivi post-essai 10 ans | (convergence H1) | **Legacy** : mortalité −13 %, IDM −15 % ; metformine −27 %/−33 % | — | **faible–modéré** (quasi-observ.) |
| **UKPDS 35 / Stratton** *(BMJ 2000, 10.1136/bmj.321.7258.405)* | **Observationnel** (association) | continue | −21 %/point HbA1c (tout évt) ; micro −37 % | n/a | **très faible–faible** (association ≠ causalité) |
| **ACCORD** *(NEJM 2008, 10.1056/NEJMoa0802743)* | ECR ; âge ~62, ancienneté ~10 ans, **35 % prév. 2de** | 6,4 vs 7,5 % | **Mortalité HR 1,22 (1,01–1,46)** ; composite CV HR 0,90 NS ; IDM non fatal 0,76 | ~3× | **modéré** (surmortalité ; arrêt précoce) |
| **ADVANCE** *(NEJM 2008, 10.1056/NEJMoa0802987)* | ECR ; âge ~66, ancienneté 8 ans | 6,5 vs 7,3 % | Composite HR 0,90 (porté par néphropathie) ; **macro/mortalité NS** | HR 1,86 | **modéré** micro / **faible** dur |
| **VADT** *(NEJM 2009, 10.1056/NEJMoa0808431 ; +2015/2019)* | ECR ; âge 60, ancienneté 11,5 ans, 97 % H | 6,9 vs 8,4 % | Principal NS (0,88) ; à 10 ans HR 0,83 CV ; **pas de legacy/mortalité à 15 ans** | ~3× | **faible** |
| **Turnbull / CONTROL** *(Diabetologia 2009, 10.1007/s00125-009-1470-0)* | Méta IPD 4 ECR, n=27 049 | — | Mortalité HR 1,04 NS ; MACE 0,91 ; IDM 0,85 | **HR 2,48** | **modéré** |
| **Boussageon** *(BMJ 2011, 10.1136/bmj.d4169)* | Méta 13 ECR, n=34 533 | — | Mortalité RR 1,04 ; IDM 0,85 ; microalb. 0,90 | RR 2,33 | **modéré** |
| **Cochrane** *(2013, 10.1002/14651858.CD008143.pub3)* | RS 28 ECR, n=34 912 | — | Mortalité RR 1,00 ; micro composite 0,88 | RR 2,18 | mortalité **modéré–élevé** |

## 4. Synthèse critique (reco officielle vs position raisonnée)

- **Position raisonnée** : le **seul bénéfice constant** d'une cible basse est **microvasculaire
  (substitution)**, au **prix d'un ~2,4× d'hypoglycémie sévère** ; **pas de bénéfice de mortalité ni
  macrovasculaire dur** chez le diabète établi (ACCORD/ADVANCE/VADT). Le **bénéfice dur** (IDM,
  mortalité) n'apparaît que dans le **profil UKPDS** (jeune, récent) et **à long horizon** (legacy).
  → **individualiser** ; éviter le serrage agressif chez l'âgé/fragile/CV établi.
- **Reco officielle = HAS 2024** (« Stratégie thérapeutique du patient vivant avec un DT2 », validée
  30/05/2024). Les **cibles d'HbA1c ne sont PAS redéfinies** : maintenues depuis **2013**, rappelées en
  **Annexe 3** (table ci-dessous). Corroboré ADA/EASD 2022, ACP 2018.

**Table officielle des cibles (HAS 2024, Annexe 3)** :

| Profil (cas général) | Cible HbA1c |
|---|---|
| La plupart des patients DT2 | **≤ 7 %** |
| Nouvellement diagnostiqué · EV > 15 ans · **sans antécédent CV** · sans hypo | **≤ 6,5 %** |
| Comorbidité grave / EV limitée (< 5 ans) · complications macrovasculaires évoluées · durée > 10 ans où viser 7 % provoque des hypos sévères | **≤ 8 %** |

- *Sous-profils HAS* : **âgé** vigoureuse ≤ 7 % · fragile ≤ 8 % · « malade »/dépendante ≤ 9 %. **Antécédent
  CV** non évolué ≤ 7 % · évolué (IDM+IC, coronaropathie sévère, polyartériel, AOMI sympto, AVC < 6 mois)
  ≤ 8 %. **IRC** modérée (3A/3B) ≤ 7 % · sévère/terminale (4/5) ≤ 8 %.
- **Convergence reco ↔ position critique (divergence FAIBLE)** : la **HAS elle-même** écrit qu'« aucune
  corrélation n'a démontré le lien entre la baisse de l'HbA1c et l'amélioration de la morbi-mortalité »
  (HbA1c = **critère intermédiaire**) et recommande d'envisager **arrêt/désescalade**. L'outil et la reco
  disent la **même chose**. Le brief §11 (« plancher ~6,5 % via courbe en J ») est **corrigé** : le ≤ 6,5 %
  est une cible officielle **réservée au profil récent sans MCV**, pas un plancher de mortalité.
- **Position critique = Prescrire** (résumé, droit d'auteur : jamais le texte intégral) — « Diabète de
  type 2 chez un adulte » (Premiers Choix, févr 2026) + « Quand la metformine ne suffit pas » (Stratégies,
  août 2023) : objectif = **éviter/retarder les complications** (surtout CV), pas la baisse d'HbA1c en soi ;
  viser **≈ 7 %** les premières années puis **≈ 7,5 %** ; **7,5–8,5 %** chez l'âgé/fragile, voire **8–9 %**
  si complication vasculaire majeure / affection grave / EV < 5 ans ; EV courte → contrôle moins strict
  **sans médicament**. → **converge** avec HAS et MG, position **un peu plus prudente** (≈7 puis ≈7,5 vs ≤7 officiel).
- **Granularité (ta règle « si appuyée sur EBM »)** : Prescrire (source la plus EBM-critique) emploie des
  bandes **grossières** → on **n'encode pas** les gradations fines d'accord d'experts (HAS : CV non
  évolué/évolué, IRC par stade, âgé vigoureux/fragile/malade). Elles restent **affichées** comme reco
  officielle. Drivers encodés = EBM-étayés : `age`, `anciennete`, `esperance_vie`, `fragilite`,
  `risque_hypo`, **`antecedent_cv`**, **`comorbidite_grave`**.

## 5. Incertitudes

- Cible optimale exacte (jamais testée en bandes étroites).
- **Mécanisme de la surmortalité ACCORD (inexpliqué).**
- Transposabilité à l'ère **GLP-1 RA / SGLT2i** (essais pré-2015 ; ces classes réduisent mortalité
  CV/rénale **indépendamment de l'HbA1c**) → « la baisse glycémique ne réduit pas la mortalité » vaut
  pour l'**ancienne** approche sulfamides/insuline.
- Place d'`antecedent_cv` dans le nœud.

## 6. → YAML (brouillon CORRIGÉ selon la 2ᵉ passe — à valider par le référent avant encodage)

**Nœud à SORTIE UNIQUE** (une seule cible) → sémantique explicite **`selection: ordered-first-match`** (à
porter dans le schéma, distincte du moteur « multi-options » des nœuds B/C). Corrections 2ᵉ passe intégrées :
**A1** `age < 70` (garde-fou du strict — legacy = sujet jeune) ; **A2/C1** CV grave & IRC sévère routés vers
≤8 via `comorbidite_grave` (redéfini) ; **A3** conditions rendues exclusives ; **B1** `divergence: true` ;
**B2** notation « ~6,5 % » ; **B3** niveau de preuve du seuil aligné (aucune bande testée en ECR).

```yaml
# id: cible-glycemique · domaine: diabete-type-2 · selection: ordered-first-match
# criteres_entree: age, anciennete_diabete_annees,
#   esperance_vie(longue≙EV>15 / intermediaire / limitee≙<5 ans),
#   fragilite(bool), risque_hypoglycemie_schema(faible/eleve), antecedent_cv(bool), comorbidite_grave(bool)
# comorbidite_grave ≙ affection grave associée, OU complication macrovasculaire ÉVOLUÉE (coronaropathie
#   sévère / AOMI symptomatique / AVC récent / insuffisance cardiaque), OU IRC sévère-terminale (stade 4/5)
options:
  - intitule: "Cible < 9 %"      # âgé dépendant « malade » / affection grave + EV limitée (HAS, accord d'experts)
    conditions: ["esperance_vie == limitee AND (fragilite == true OR comorbidite_grave == true)"]
    niveau_preuve: tres_faible
  - intitule: "Cible ≤ 8 %"      # fragile / comorbidité grave (CV grave, IRC sévère) / EV limitée / longue durée + hypos
    conditions: ["fragilite == true OR comorbidite_grave == true OR esperance_vie == limitee OR (anciennete_diabete_annees > 10 AND risque_hypoglycemie_schema == eleve)"]
    niveau_preuve: faible        # seuil non testé en ECR (aucune bande étroite comparée)
  - intitule: "Cible ~6,5 % (6,5–7 %)"   # jeune, nouvellement dx, EV>15 ans, SANS CV/comorbidité, faible hypo
    conditions: ["age < 70 AND anciennete_diabete_annees < 5 AND esperance_vie == longue AND antecedent_cv == false AND comorbidite_grave == false AND risque_hypoglycemie_schema == faible AND fragilite == false"]
    niveau_preuve: faible        # bénéfice = micro + legacy (sujet jeune, UKPDS) ; pas de bénéfice dur prouvé
  - intitule: "Cible ≤ 7 %"      # la plupart des patients — DÉFAUT (dont CV non évolué, IRC modérée, âgé vigoureux)
    conditions: ["default"]
    niveau_preuve: faible        # seuil non testé en ECR
# reco_officielle: {source: "HAS 2024, Annexe 3 (cibles 2013 maintenues)", divergence: true,
#   explication: "Convergence FORTE sur les principes (HbA1c = critère intermédiaire, anti-sur-traitement),
#   mais DIVERGENCE sur ~6,5 % : HAS le recommande (jeune/EV>15/sans CV) ; Prescrire vise ≈7 % et Médicalement
#   Geek propose de déprescrire si <6,5 %. À signaler (idéalement une divergence PAR option)."}
# sources.medicalement_geek: "cibles <7 classique ; individualiser ; déprescrire si <6,5 %"
# sources.prescrire (RÉSUMÉ, jamais le texte intégral — réf. Premiers Choix févr 2026 + Stratégies août 2023):
#   "objectif = éviter/retarder les complications (surtout CV), pas la baisse d'HbA1c ; ≈7% puis ≈7,5% ;
#    7,5–8,5% (voire 8–9%) si âgé/fragile, complication vasculaire majeure, affection grave ou EV<5 ans"
# sources.references_primaires: UKPDS33/80, Stratton, ACCORD, ADVANCE(+ON), VADT(+F), Turnbull, Boussageon,
#   Cochrane 2013 (⚠ RETIRÉ 2015, PMID 26222248, COI non déclaré — résultats non invalidés) (DOIs §3)
# niveau_preuve — NOTE (B3) : preuve « intensif vs standard » modérée, mais le SEUIL exact n'a été testé par
#   AUCUN ECR → niveau_preuve du seuil = faible (tres_faible pour < 9 %).
# argumentaire (B4) : pas de plancher-mortalité ; ~6,5 % = cible officielle du profil jeune SANS MCV récemment
#   dx ; le danger tient probablement au serrage AGRESSIF (ACCORD) — l'inférence « pas le chiffre » (ADVANCE
#   6,5 % sans surmortalité) est PLAUSIBLE mais indirecte (mécanisme ACCORD inconnu ; Currie nadir ~7,5 %).
# contre_indications (C3, à restaurer par option à l'encodage) : garde-fou « baisse rapide de l'HbA1c →
#   aggravation d'une rétinopathie préexistante » ; gate de périmètre (exclut DT1, grossesse, décompensation aiguë).
```

> **Restant pour l'encodage** (schéma S2) : porter `selection: ordered-first-match` et `argumentaire_exhaustif` ;
> restaurer la structure complète des options (`avantages`/`inconvenients`/`effet_attendu`/`contre_indications`) ;
> idéalement une `divergence` **par option** ; **ne pas afficher de NNT/NNH bruts** dans l'UI tant que non
> confirmés (C5) ; **tests unitaires** couvrant tous les chevauchements de bandes. La granularité fine HAS
> (CV non évolué/évolué, IRC par stade, âgé vigoureux/fragile/malade) reste **affichée** en reco officielle,
> non encodée comme driver.

## 7. Demandes au référent (liste de courses) — MAJ 2026-07-22

**Intégrés** : OpenEvidence ✓ · Médicalement Geek ✓ · **HAS 2024 ✓** · **Prescrire ✓** (« Diabète de type
2 chez un adulte », Premiers Choix févr 2026 ; « Quand la metformine ne suffit pas », août 2023 ;
« Prévenir/retarder le DT2 », 2006 → réservé nœud H). → **Socle de sources COMPLET pour le nœud A** ;
reste = validation clinique du référent + confirmation des `[À VÉRIFIER]` (NNT, UKPDS 80, VADT, Cochrane pub4).

**Prescrire — articles demandés** (payant : non tirables du web ouvert ; le référent a l'accès). Par priorité :

1. **[TOP] Objectif glycémique / cible d'HbA1c dans le DT2** — la synthèse/position Prescrire sur
   l'individualisation et l'évitement du sur-traitement (idées-forces / « quel objectif ? »). → devient
   la **source de la colonne « position critique »** de l'outil (champ `sources.prescrire.synthese`).
2. **[HAUT] Lecture critique des essais de contrôle intensif** (ACCORD / ADVANCE / VADT, ~2008–2010,
   *Rev Prescrire*) — balance bénéfices-risques, surmortalité ACCORD, hypoglycémies. → argumentaire critique + source.
3. **[MOYEN] Diabète du sujet âgé / hypoglycémies iatrogènes / déprescription** — pour la bande fragile/âgé
   et le versant risque.

**`[À VÉRIFIER]` restants** (Prescrire ou source primaire) : chiffres **absolus** UKPDS 80 post-essai ·
taux **exact** d'hypo sévère VADT · **Cochrane pub4 (2015)**.

**Arbitrages — RÉSOLUS par la HAS 2024** : (1) argumentaire plancher **révisé** (≤6,5 % = cible de profil
sans MCV, pas un plancher courbe-en-J ; reco et position critique **convergent**) ✓ · (2) `antecedent_cv`
**ajouté**, critère **officiel** HAS ✓ · (3) bandes = **table officielle HAS** (≤6,5/≤7/≤8/≤9) ✓.
**2ᵉ passe** : défauts d'algorithme **corrigés** (age<70 ; CV grave/IRC sévère→≤8 via `comorbidite_grave` ;
conditions exclusives ; `divergence:true` ; ~6,5 % ; Coca/Ruospo ; retrait Cochrane 2015 ; NNH 15–52) — voir
`A-cible-glycemique.verification-p2.md`. **Reste = sign-off clinique du référent** avant encodage.
