# Brief — Outil d'aide à la décision « Diabète de type 2 »

**Version :** 0.4 (à valider par le comité MSP)
**Destinataire :** développement avec Claude Code
**Approche :** evidence-based *critique* — partir des données brutes et de leurs limites, afficher la reco officielle **et** la position raisonnée, signaler les divergences.

**Deux volets :**
1. **Aide à la décision** — algorithmes interrogeables par critères.
2. **Veille scientifique hebdomadaire** — classée par thème, analyse critique, avec intégration contrôlée des nouvelles données dans les algorithmes.

---

## 1. Objectif & périmètre

Outil web pour les praticiens de la MSP. Le praticien saisit des critères cliniques ; l'outil propose une ou plusieurs options avec avantages/inconvénients et niveau de preuve, et un argumentaire sourcé accessible à la demande. Un second volet publie une veille hebdomadaire critique, dont les items pertinents alimentent les algorithmes après validation.

**Périmètre MVP :** diabète de type 2 de l'adulte. **Hors périmètre :** DT1, grossesse, complications aiguës, pied diabétique, autres domaines cliniques.

---

## 2. Principes non négociables

1. **Transparence** du niveau de preuve et des sources sur chaque proposition.
2. **Reco officielle affichée à côté de la position critique**, divergence signalée (le praticien choisit et documente).
3. **Aucune donnée patient stockée** : saisie volatile → RGPD allégé.
4. **Disclaimer** : aide à la réflexion, le praticien reste seul responsable.
5. **Logique déterministe et auditable** : moteur de règles, jamais de ML.
6. **Chaque nœud daté, versionné, signé** ; **toute modification d'algorithme est tracée** (changelog).
7. **Aucune mise à jour automatique et silencieuse d'un algorithme** : la veille *propose*, un humain *valide*.

---

## 3. Utilisateurs & contexte

Médecins généralistes de la MSP (extensible IPA / pharmaciens), en consultation. Interface rapide, lisible sur mobile, argumentaire dépliable à la demande.

---

## 4. Échelle de niveau de preuve (GRADE simplifié)

| Niveau | Signification |
|---|---|
| **Élevé** | ECR de bonne qualité sur critères durs, résultats cohérents. |
| **Modéré** | ECR avec limites (substitution, imprécision) ou preuve indirecte solide. |
| **Faible** | Essais fragiles, sous-groupes, observationnel bien conduit. |
| **Très faible** | Avis, extrapolation, données très indirectes. |

Préciser toujours **critère dur vs substitution** et **effet absolu / NNT** si disponible.

---

## 5. Modèle de données

Contenu = données versionnées, **un fichier YAML par nœud** dans `/content/noeuds`, plus **un fichier par entrée de veille** dans `/content/veille`. Validation par **JSON Schema**. Séparer *contenu / logique / présentation*.

### 5.1 Schéma d'un nœud de décision

```yaml
id:
domaine: diabete-type-2
titre:
population_cible:
criteres_entree: [ {nom, type, valeurs?} ]
options:
  - intitule:
    avantages: []
    inconvenients: []
    effet_attendu:            # absolu / NNT / NNH, sinon "non chiffrable"
    niveau_preuve:            # eleve | modere | faible | tres_faible
    conditions: []            # règles d'affichage (booléen sur variables)
    contre_indications: []
argumentaire:
sources:
  references_primaires: [ {titre, annee, lien, type_critere} ]
  medicalement_geek: {synthese, lien}
  prescrire: {synthese}
  reco_officielle: {source, position, divergence, explication}
incertitudes: []
veille_liee: []               # ids d'entrées de veille ayant modifié ce nœud
meta:
  date_revue:
  auteur:
  statut:                     # brouillon | valide
  version:                    # ex. 1.2
  changelog: [ {date, auteur, resume, veille_source?} ]
```

### 5.2 Schéma d'une entrée de veille

```yaml
id:                           # ex. "2026-W30-flow-semaglutide"
date_semaine:                 # ex. "2026-W30"
theme:                        # aligné sur les nœuds : cible | 1re-intention |
                              # intensification | insuline | statine | aspirine | RHD
titre_etude:
type_publication:             # ECR | méta-analyse | cohorte | reco | autre
population:
resultat_resume:
appreciation_critique:        # biais, critère dur/substitution, effet absolu/NNT,
                              # cohérence avec les données existantes, conflits d'intérêt
pertinence_pratique:          # forte | modérée | faible | nulle
niveau_preuve:                # GRADE simplifié
noeuds_impactes: []           # ids de nœuds potentiellement concernés
proposition_maj:
  statut:                     # aucune | candidate | validee | rejetee
  description:                # diff proposé sur le(s) nœud(s)
  decision_comite:            # texte + date, si traitée
source: {lien, doi?}
auteur:
```

---

## 6. Variables d'entrée communes (DT2)

`age`, `anciennete_diabete_annees`, `esperance_vie`, `fragilite`, `risque_hypoglycemie_schema`, `HbA1c_actuelle`, `DFG`, `albuminurie`, `ASCVD_etablie`, `insuffisance_cardiaque`, `IRC`, `IMC`, `prevention`, `autres_FDRCV`, `SCORE2`, `preference_injection`, `contrainte_cout`, `traitements_en_cours`.

---

## 7. Logique décisionnelle

Appariement par **règles transparentes**. Chaque option porte des `conditions` booléennes ; le moteur filtre les options applicables, les classe (préférence par nœud), et affiche **pourquoi** chacune est proposée. Aucun score caché.

---

## 8. Parcours utilisateur (UI)

**Volet 1 :** saisie des critères → options concises (avantages/inconvénients, niveau de preuve, effet absolu) → argumentaire dépliable (reco officielle vs position critique côte à côte, drapeau de divergence) → date de revue + disclaimer.

**Volet 2 :** page **Veille** chronologique, **filtrable par thème** ; chaque item montre le résumé, l'appréciation critique, la pertinence pratique, et un lien vers le(s) nœud(s) impacté(s). Un badge signale les nœuds récemment mis à jour par la veille.

---

## 9. Stack technique (recommandation)

- **Contenu** : YAML (`/content/noeuds`, `/content/veille`) + JSON Schema (`/schema`).
- **Front** : site statique — **Astro** (orienté contenu) ou HTML/CSS/JS vanilla lisant des JSON compilés.
- **Moteur de règles** : module JS pur, testé unitairement (`/tests`).
- **Hébergement** : statique (GitHub / Netlify / Cloudflare Pages).
- **Versioning** : git ; publication d'un nœud ou d'une veille par *pull request*.
- **Pas** de backend, base de données, ni ML.

Arborescence : `/content/noeuds` · `/content/veille` · `/schema` · `/src` · `/tests` · `/public`.

> **Note projet (ebm-msp) :** la stack retenue diverge de cette recommandation — voir `DECISIONS.md` D1
> (Vite + React + TS + Supabase pour la veille). Les principes contenu/moteur/versioning sont conservés.

---

## 10. Contenu du MVP — nœuds A à H

**A. Cible glycémique individualisée** — entrées : âge, ancienneté, espérance de vie/fragilité, risque hypo, comorbidités. Options : ~6,5 % / ~7 % / 7,5–8 % / 8–8,5 %. Garde-fous : éviter < 6,5 % sous hypoglycémiants (ACCORD, courbe en J), éviter baisse rapide (rétinopathie). → **gabarit complet §11.**

**B. 1re intention pilotée par comorbidités** — entrées : ASCVD, IC, IRC (DFG/albuminurie), IMC, âge, préférence injection, coût. Options : iSGLT2 (IC/IRC ou ASCVD), aGLP1 (ASCVD/obésité), metformine (socle glycémique). Note : bénéfice cardio-rénal ~indépendant de l'HbA1c, démontré sur fond de metformine.

**C. Intensification** — ajouter iSGLT2/aGLP1 à bénéfice prouvé ; association iSGLT2+aGLP1 (cohorte, preuve faible) ; éviter sulfamide/gliptine.

**D. Sulfamides / gliptines** — à éviter au long cours ; cas d'usage résiduels (coût, aigu).

**E. Insuline** — basale (glargine/degludec) ; degludec si hypoglycémies (DEVOTE) ; Xultophy si déjà sous aGLP1.

**F. Statine chez le diabétique** — statine chez la plupart ≥ 40 ans avec FDR (bénéfice = événements CV, NNT ~43 ; mortalité globale non démontrée chez le diabétique) ; discuter l'abstention chez < 50 ans, diabète < 10 ans, sans autre FDR (SCORE2). Pas de cible LDL dogmatique.

**G. Aspirine** — pas en prévention primaire (ASCEND) ; oui en secondaire.

**H. RHD / perte de poids / rémission** — intervention intensive (DiRECT, rémission ~50 %), régime méditerranéen (CV), activité physique. Traitement de fond.

---

## 11. Nœud gabarit complet — « Cible glycémique »

```yaml
id: cible-glycemique
domaine: diabete-type-2
titre: Fixer la cible d'HbA1c
population_cible: Adulte DT2, hors grossesse, hors DT1.
criteres_entree:
  - {nom: age, type: nombre}
  - {nom: anciennete_diabete_annees, type: nombre}
  - {nom: esperance_vie, type: enum, valeurs: [longue, intermediaire, limitee]}
  - {nom: fragilite, type: bool}
  - {nom: risque_hypoglycemie_schema, type: enum, valeurs: [faible, eleve]}
options:
  - intitule: "Cible ~6,5 %"
    conditions: ["age < 60", "anciennete_diabete_annees < 10", "risque_hypoglycemie_schema == faible", "esperance_vie == longue", "fragilite == false"]
    avantages: ["Bénéfice microvasculaire à long terme (legacy) si atteint sans hypoglycémie."]
    inconvenients: ["Aucun bénéfice de mortalité ; risque si atteint par sulfamide/insuline."]
    effet_attendu: "Gain surtout sur critères de substitution (albuminurie, rétinopathie infraclinique)."
    niveau_preuve: modere
    contre_indications: ["Schéma à risque d'hypoglycémie"]
  - intitule: "Cible ~7 %"
    conditions: ["default"]
    avantages: ["Compromis pour la majorité."]
    inconvenients: ["Bénéfice macrovasculaire/mortalité non démontré par le seul serrage."]
    effet_attendu: "Réduction de l'IDM non fatal (méta-analyses), pas de la mortalité."
    niveau_preuve: modere
  - intitule: "Cible 7,5–8 %"
    conditions: ["age >= 75 OR fragilite == true OR risque_hypoglycemie_schema == eleve OR esperance_vie == limitee"]
    avantages: ["Réduit le risque d'hypoglycémie ; priorité chez l'âgé/fragile."]
    inconvenients: ["Moindre contrôle des symptômes d'hyperglycémie."]
    effet_attendu: "Pas de perte démontrée sur critères durs à cet horizon."
    niveau_preuve: modere
  - intitule: "Cible 8–8,5 %"
    conditions: ["fragilite == true AND esperance_vie == limitee"]
    avantages: ["Évite hypoglycémie et sur-traitement en fin de vie."]
    inconvenients: ["Vise le confort, pas la prévention des complications."]
    effet_attendu: "non chiffrable"
    niveau_preuve: faible
argumentaire: >
  Aucun ECR n'a comparé des bandes étroites (ex. 7–7,5 vs 7,5–8 %). Les grands
  essais ont contrasté intensif (<7 %) vs standard : ACCORD (6,4 vs 7,5 %) a
  montré une SURMORTALITÉ du bras intensif ; ADVANCE et VADT sont neutres sur la
  macroangiopathie et la mortalité, gain néphrologique limité à la
  microalbuminurie. Méta-analyses (Turnbull/CONTROL, Boussageon 2011, Cochrane) :
  réduction de l'IDM non fatal, PAS de la mortalité, doublement des
  hypoglycémies sévères. L'effet legacy (UKPDS 80, DCCT/EDIC) justifie un
  serrage chez le sujet jeune à diabète récent, absent chez le DT2 installé.
  Courbe en J et ACCORD plaident pour un plancher (~6,5 %).
sources:
  references_primaires:
    - {titre: "ACCORD", annee: 2008, type_critere: dur, lien: ""}
    - {titre: "ADVANCE", annee: 2008, type_critere: mixte, lien: ""}
    - {titre: "VADT / VADT-F", annee: 2009, type_critere: dur, lien: ""}
    - {titre: "UKPDS 33 / 80", annee: 2008, type_critere: mixte, lien: ""}
    - {titre: "Boussageon, méta-analyse BMJ", annee: 2011, type_critere: dur, lien: ""}
    - {titre: "UKPDS 35 (Stratton, épidémiologique)", annee: 2000, type_critere: substitution, lien: ""}
  medicalement_geek: {synthese: "Anti sur-traitement, cible 7–8 %, molécules à effet propre.", lien: ""}
  prescrire: {synthese: "Prudence, éviter le sur-traitement, individualiser."}
  reco_officielle: {source: "ADA/EASD ; ACP 2018", position: "≤7 % individualisé ; ACP 7–8 %", divergence: false, explication: "Position alignée sur l'individualisation."}
incertitudes:
  - "Cible optimale exacte (7 vs 7–8 %)."
  - "Mécanisme de la surmortalité d'ACCORD."
  - "Valeur du time-in-range sur critères durs."
veille_liee: []
meta: {date_revue: "", auteur: "", statut: brouillon, version: "1.0", changelog: []}
```

---

## 12. Volet 2 — Veille scientifique hebdomadaire

**Objectif :** publier chaque semaine une sélection critique de la littérature DT2, classée par thème (alignés sur les nœuds), et alimenter les algorithmes quand une donnée le justifie.

**Production (assistée par Claude) :**
1. Recherche hebdomadaire (revues, alertes, OpenEvidence via prompt PICO §14, DragiWebdo/Médicalement Geek, Prescrire).
2. Pour chaque item retenu : rédaction d'une **entrée de veille** (schéma §5.2) avec appréciation critique (biais, critère dur/substitution, effet absolu/NNT, cohérence, conflits d'intérêt) et pertinence pratique.
3. Classement par thème et liaison aux `noeuds_impactes`.

**Opérationnalisation possible :** tâche planifiée hebdomadaire (côté Cowork) générant le **brouillon** de veille, que le comité relit avant publication. À défaut, workflow manuel documenté.

> **Accès Prescrire intégral (ressource clé).** Le référent dispose d'un accès Prescrire complet et peut fournir à Claude, sur demande, le **texte intégral** des articles pertinents pour l'analyse d'un nœud. Usage strictement **interne à l'appréciation critique** ; côté outil, seul un **résumé + lien** est publié, jamais le texte intégral (droit d'auteur). En pratique : pour chaque nœud, Claude établit une **liste des références Prescrire souhaitées**, le référent les transmet, l'analyse les intègre.

---

## 13. Workflow d'intégration veille → algorithme (point critique de sécurité)

Une donnée nouvelle ne modifie **jamais** un algorithme automatiquement. Chaîne obligatoire, entièrement tracée :

1. **Détection** — l'entrée de veille identifie un ou plusieurs `noeuds_impactes` et passe `proposition_maj.statut = candidate`.
2. **Proposition** — Claude rédige un **diff précis** du/des nœud(s) concerné(s) : quelle option, quel niveau de preuve, quel argumentaire, quelle éventuelle divergence avec la reco.
3. **Validation humaine** — le comité éditorial statue (`validee` / `rejetee`) avec justification datée. C'est le seul moment où un nœud clinique peut changer.
4. **Application tracée** — si validée : mise à jour du nœud, **bump de version**, entrée de **changelog** (avec `veille_source`), actualisation de `date_revue`, et renseignement de `veille_liee` (traçabilité bidirectionnelle veille ↔ nœud).

> Ce contrôle humain est essentiel à la fois cliniquement et au regard du statut potentiel de dispositif médical : la modification d'un algorithme d'aide à la décision doit être maîtrisée, justifiée et historisée.

---

## 13bis. Vérification bi-agents (fiabilisation des analyses)

À chaque proposition de mise à jour d'un nœud (déclenchée par la veille ou par une étude), **Claude Code (Opus) orchestre deux agents d'analyse indépendants, puis réconcilie**. C'est l'automatisation de la « double lecture ». Principe : *rôles différenciés + ancrage sur la source primaire + réconciliation qui escalade au lieu de lisser + humain décideur final*.

**Deux agents à rôles distincts** (pas des clones — deux clones du même modèle partagent les mêmes angles morts) :
- **Agent A — Analyste/Extracteur** : extrait les résultats, applique la grille d'appréciation, chiffre les effets absolus / NNT, rédige le diff proposé du nœud.
- **Agent B — Contradicteur/Red-team** : cherche pourquoi la conclusion serait fausse, traque le *spin*, vérifie chaque référence (DOI réel) et chaque chiffre **contre la source primaire**, confronte à la totalité des preuves.
- Contextes **séparés** (pas de dialogue A↔B) pour préserver l'indépendance ; **hétérogénéité de modèle** si possible (ex. Opus + Sonnet) pour décorréler les erreurs.

**Ancrage** : accord des deux agents ≠ vérité. Chaque affirmation est reliée à sa source ; la vérification sur l'article primaire prime sur le consensus.

**Réconciliation (Opus)** → **rapport structuré** : (1) consensus vérifié / haute confiance ; (2) divergences → à escalader ; (3) non-vérifiable → écarté ou signalé ; chaque item avec niveau de preuve + source. **Jamais de résolution silencieuse** d'un désaccord à impact clinique → escalade.

**Tie-breaker** : 3ᵉ passage ciblé **uniquement** en cas de désaccord, pas en routine (coût).

**Escalade humaine** : tout item modifiant un nœud passe au comité (cohérent avec §13). La vérification bi-agents fiabilise le brouillon, elle ne remplace pas la validation humaine.

**Journalisation** : les deux analyses + le rapport de réconciliation sont archivés → traçabilité, changelog, auditabilité (exigences MDR).

**Périmètre** : réservé aux enjeux (mise à jour d'algorithme) ; pas pour des corrections éditoriales mineures sans portée clinique.

---

## 14. Gabarit de prompt OpenEvidence

```
Population : adultes DT2 [préciser âge, comorbidités].
Intervention / Comparateur : [ex. cible 7–7,5 % vs 7,5–8 %].
Outcomes : mortalité toute cause et CV ; IDM ; AVC ; événements rénaux DURS
  (IRT, doublement créat) ; rétinopathie CLINIQUE ; hypoglycémie sévère.
Demande :
  1. ECR et méta-analyses pertinents : effectif, durée, HbA1c atteintes/bras.
  2. Distinguer critères DURS et de SUBSTITUTION.
  3. Effets en valeur ABSOLUE / NNT-NNH si disponibles.
  4. Limites méthodologiques et conflits d'intérêt.
  5. Citations vérifiables (lien / DOI).
Ne pas extrapoler ; signaler les incertitudes.
```
> Sortie = point de départ, à **re-vérifier sur les sources primaires**.

---

## 15. Gouvernance & maintenance

- **Comité éditorial** MSP (2–3 relecteurs) ; déclaration de liens d'intérêt.
- Un nœud ou une veille n'est **`valide`** qu'après relecture (pull request).
- **Cadence** : veille hebdomadaire ; revue de fond annuelle ; date de revue visible dans l'UI.
- **À vérifier** : statut de dispositif médical (règlement UE 2017/745) avant mise en ligne.

---

## 16. Disclaimer (projet)

> Cet outil est une aide à la réflexion clinique destinée aux professionnels de santé. Il synthétise des données scientifiques et leurs limites, peut diverger des recommandations officielles (divergences signalées), ne stocke aucune donnée patient et ne remplace pas le jugement du praticien, seul responsable de sa décision.

---

## 17. Décisions ouvertes (défauts proposés)

| Point | Défaut proposé |
|---|---|
| Format contenu | YAML + JSON Schema |
| Front | Astro (ou vanilla) — *voir DECISIONS.md D1 : retenu Vite+React+TS* |
| Production de la veille | Tâche planifiée hebdomadaire générant un brouillon, relu par le comité |
| Comité de relecture | À définir par la MSP |
| Statut MDR | À faire vérifier avant déploiement |

---

## 18. Feuille de route

1. **Phase 0** — valider ce brief + gouvernance.
2. **Phase 1** — schéma de données + moteur de règles + UI ; nœud A comme preuve de concept.
3. **Phase 2** — contenu des nœuds B→H.
4. **Phase 3** — volet veille : modèle d'entrée, page filtrable, workflow d'intégration.
5. **Phase 4** — pilote praticiens, retours, itération.
6. **Phase 5** — mise en ligne + cadence de maintenance (veille hebdo + revue annuelle).
