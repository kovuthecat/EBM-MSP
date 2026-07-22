# SOP — Procédure de veille clinique (MSP)

**Version :** 1.0 · **Statut :** à valider par le comité éditorial · **Prochaine revue :** +12 mois
**Destinée à être publiée dans l'outil (page « Méthode »)** — la transparence de la méthode est un gage de fiabilité.

---

## 1. Objet & champ d'application

Décrire la procédure **reproductible** de production de la veille hebdomadaire : de la collecte à la publication, jusqu'à l'éventuel impact sur les algorithmes d'aide à la décision. S'applique à tous les thèmes et profils (MG, IPA maladies chroniques, sage-femme, orthophoniste, IDEL).

**Objectif de fiabilité :** deux référents appliquant cette SOP doivent produire des résultats comparables ; chaque semaine doit être auditable.

---

## 2. Rôles & responsabilités

| Rôle | Responsabilité |
|---|---|
| **Référent(s) de profession** | Collecte, présélection, analyse, classement pour leur domaine. |
| **Relecteur (2ᵉ lecture)** | Validation indépendante des items à impact pratique. |
| **Référent algorithme** | Analyse, avec Claude Code, des items pouvant modifier un nœud de décision. |
| **Comité éditorial** | Validation finale des modifications d'algorithme ; revue de la SOP. |

Déclaration de **liens d'intérêt** obligatoire pour tout contributeur.

---

## 3. Cadence

Cycle **hebdomadaire** fixe (jour à définir). Revue de fond de la SOP et des sources : **annuelle**.

---

## 4. Hiérarchie des sources (modèle 6S)

Priorité aux sources **pré-évaluées** (haut rendement / temps maîtrisé). On ne descend aux études brutes que pour un signal à fort impact.

- **Tier 1 — EBM secondaire pré-appréciée :** Minerva, Prescrire, Cochrane, NNT.com, McMaster EvidenceAlerts, BMJ EBM, Médicalement Geek/DragiWebdo, Exercer.
- **Tier 2 — Recommandations & agences :** HAS, **Collège de la Médecine Générale (CMG)**, sociétés savantes par thème, ANSM.
- **Tier 3 — Sommaires de grandes revues (alertes TOC) :** NEJM, Lancet, JAMA, BMJ, Annals + revues spécialisées par profil.
- **Tier 4 — Études primaires :** en **vérification/approfondissement** d'un signal déjà repéré uniquement.

> OpenEvidence / web-fetch IA = **débroussaillage complémentaire**, jamais source primaire. Toute sortie IA est re-vérifiée sur l'article original (référence réelle, chiffres exacts).

La liste détaillée des sources par profil est maintenue en annexe versionnée.

---

## 5. Procédure hebdomadaire (étapes)

### Étape 1 — Collecte
Relever les nouveautés des sources Tier 1–3 via **alertes automatisées** (PubMed *saved searches*/RSS, alertes TOC, EvidenceAlerts, flux des sociétés savantes). L'automatisation garantit l'exhaustivité et la reproductibilité.

### Étape 2 — Présélection (screening)
Appliquer les **critères d'inclusion/exclusion** (§6). Tenir le **journal de screening** (repéré / retenu / exclu + motif) — mini-flux type PRISMA hebdomadaire.

### Étape 3 — Analyse critique
Pour chaque article retenu : remplir la **grille d'appréciation critique** (document séparé). L'analyse est fiabilisée par la **vérification bi-agents** (§7) pour les items à impact pratique.

### Étape 4 — Classement
Renseigner : `themes[]`, `professions_concernees[]`, `niveau_preuve` (GRADE simplifié), **`niveau_impact` (pratique / informatif)**, `temps_lecture_min`, `impact_algorithme`.

### Étape 5 — Double validation
Tout item **à impact pratique** est relu par un second contributeur. Désaccord → discussion tracée, escalade au comité si non résolu.

### Étape 6 — Mise en forme & publication
Rédiger l'**entrée de veille** (schéma du brief), **résumé + lien** (jamais de copie intégrale — §8), puis **push** git → relecture → publication. Archiver la semaine.

### Étape 7 — Impact sur les algorithmes
Pour les items `concerne_decision`, le référent algorithme, avec Claude Code, rédige un **diff proposé** du/des nœud(s) → **validation comité** → mise à jour **versionnée et tracée** (changelog). Aucune modification automatique (cf. brief décision §13).

---

## 6. Critères d'inclusion / exclusion

**Inclure :** design pertinent (ECR, méta-analyse, recommandation, cohorte de qualité) ; question pertinente pour les soins premiers / le profil ; **critère de jugement important pour le patient**.

**Exclure :** études précliniques/animales ; très petits effectifs non répliqués ; critères **purement intermédiaires** sans portée clinique ; communiqués de presse sans article ; doublons ; contenu déjà couvert.

---

## 7. Vérification bi-agents

Pour l'analyse hebdomadaire et les items à impact pratique : **Claude Code (Opus) orchestre deux agents indépendants puis réconcilie** (détail : brief décision §13bis).
- **Agent A (Analyste/Extracteur)** vs **Agent B (Contradicteur/Red-team)** ; contextes séparés ; hétérogénéité de modèle si possible.
- Ancrage sur la **source primaire** (accord ≠ vérité).
- Réconciliation → rapport : consensus vérifié / divergences à escalader / non-vérifiable.
- Escalade humaine obligatoire ; journalisation des deux analyses + réconciliation.

---

## 8. Droit d'auteur & accès

- **Résumé critique + lien** vers la source ; **jamais** de reproduction du texte intégral (Prescrire, journaux).
- **Pas de contournement de paywall** : on exploite abstract / open access / communiqués ; le référent complète s'il a un accès légitime.

---

## 9. Garde-fous de fiabilité

- Ne pas sur-réagir à une **étude isolée** ; la replacer dans la totalité des preuves.
- **Remonter à la source primaire** (jamais communiqué / réseau social).
- Lire **résultats absolus** et critères **pré-enregistrés** (déjouer le spin et les critères changés en cours de route).
- Éviter « absence de preuve = preuve d'absence » et la surinterprétation de l'observationnel.
- **Rétractations / errata** : vérifier (Retraction Watch, alertes revue) avant toute intégration, surtout si l'item modifie un algorithme.
- **Vérifier chaque sortie IA** (DOI réel, chiffres exacts).

---

## 10. Traçabilité, archivage & corrections

- **Journal de screening** hebdomadaire conservé.
- **Archivage** des semaines passées (consultables/filtrables).
- **Changelog** des impacts sur les algorithmes (lien veille → nœud).
- **Corrections** : erratum daté si un item publié est corrigé/rétracté en amont ; boucle de retour utilisateurs.

---

## 11. Gestion documentaire de la SOP

- SOP **versionnée** (git) ; toute modification = nouvelle version + note de changement.
- Revue au moins **annuelle** ou dès qu'un incident/retour le justifie.
- **À vérifier** : statut de dispositif médical (règlement UE 2017/745) pour le volet couplé aux algorithmes.
