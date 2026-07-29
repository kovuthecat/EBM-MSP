# 2026-07-25 — D18 · Fusion des nœuds de prescription orale (B+C+D) en un nœud unique `prescription`

> **MISE À JOUR (2026-07-25, même jour) : refonte S8 « par intention ».** Après le go référent initial
> ci-dessous, le référent a demandé de repenser la saisie autour des **4 situations d'usage réelles** —
> `initier / intensifier / optimiser / déprescrire` — plutôt que le champ `position_vs_cible` (4 crans)
> décrit dans la décision d'origine. Le primer `intention` **remplace** `position_vs_cible` et déduit
> `cible_atteinte` ; `hba1c_sous_cible` (< 6,5 %) est désormais **dérivé de l'HbA1c saisie**, indépendant du
> nœud A. S8 a aussi ajouté une **palette glycémique** (iSGLT2/AR GLP-1 disponibles hors comorbidité,
> priorisés par elle, séquençage HAS ≥ 8,5 % à l'initiation), un **repli insuline** explicite, et une
> **déprescription nuancée** (réductions de dose distinctes par traitement, `nature_intolerance`). Vérifié
> par **4 agents adversariaux indépendants** (2 HAUTE trouvées et corrigées : non-association gliptine+
> incrétine rouverte par la palette, alertes de cohérence intention↔HbA1c manquantes) puis par une **passe
> ciblée sur 3 arbitrages référent supplémentaires** (séquençage, ordre iSGLT2/GLP-1, nature d'intolérance —
> 0 finding). **Conséquence sur le statut** : `content/…/prescription.yaml` est repassé **`brouillon` v0.9**
> (le `valide` v1.0 ci-dessous ne reflète plus le contenu réel) — la validation clinique référent se fera sur
> la version **déployée** (push `main` `a561b8b`, 2026-07-25). Détail :
> [`prescription.SPEC-intentions.md`](docs/decision/noeuds/prescription.SPEC-intentions.md) §7/§8 (décisions
> gelées) et `plans/P3-fusion/index.md` (S8). Le reste de cette décision (motivation de la fusion, portée
> technique, gating de terrain) reste valable tel quel.

### Décision

Les trois nœuds de prescription non-insulinique — **B (1re intention)**, **C (intensification/optimisation)**
et **D (sulfamides/gliptines)** — sont **fusionnés en un seul nœud `prescription`**, piloté par
`traitements_en_cours` (liste vide = naïf = 1re intention) et, depuis S8, le primer `intention`
(initier/intensifier/optimiser/déprescrire — *remplace le champ `position_vs_cible` d'origine, voir mise à
jour ci-dessus*). B/C/D (YAML + argumentaires de contenu) sont **retirés** ; leurs dossiers de preuve
`docs/decision/noeuds/` persistent comme sources. Nœuds A (cible), E (insuline), F (statine), H (RHD)
**inchangés**.

Motivation : le découpage naïf/déjà-traité était artificiel pour le clinicien (mêmes déclencheurs
comorbidité, même hiérarchie de molécules) et générait des incohérences d'encodage (ex. préférence
iSGLT2/GLP-1 encodée deux fois, divergente). La fusion permet d'écrire **une seule fois** le gating négatif
de terrain (IMC bas / dénutrition / infections uro / fragilité) et les portes SU/gliptine/intolérance.

Contenu nouveau intégré à la fusion (gel référent 2026-07-24, `prescription.SPEC.md`) : gating de terrain
(AR GLP-1 exclu IMC<22/dénutrition ; tirzépatide ⊂ obésité ; iSGLT2 rétrogradé si infections uro) ; portes
SU/gliptine/intolérance → switch (à/au-dessus cible) ou déprescription (< 6,5 %, à tout âge) ; refus
d'injection → injectables rétrogradés ; retrait du critère flou `sur_traitement`.

### Portée

- **Aucune modification du moteur** : tout est encodé en contenu (D13 `exclusions`/`liste`, D14 `priorite`
  conditionnelle, D15 `alertes`, critères `derive`). Le socle générique (D8) est inchangé.
- Cross-refs internes (E, H) mises à jour vers `nœud prescription`. Libellés UI ajoutés (`labels.ts`).
- **Validation** : encodage vérifié bi-agents (S4) + validation adversariale P2·S3-S7 (agent red-team
  indépendant + banc exécutable, 21 profils) → **0 finding HAUTE** ; corrections MOYENNE M1 (gating
  `classes_a_benefice_indisponibles`) et M2 (alerte A9) appliquées. **Puis S8** (voir mise à jour en tête de
  décision) : re-vérifié par 4 agents adversariaux indépendants (2 HAUTE corrigées) + passe ciblée sur les
  arbitrages référent (0 finding). État final : `content/…/prescription.yaml` **`statut: brouillon` v0.9**,
  build + typecheck + **158 tests** verts, **poussé sur `main`** (commit `a561b8b`) — validation clinique
  référent sur le déployé restante avant repromotion à `valide`.

### Raison

Modèle mental du clinicien (regarder traitement en cours + terrain + tolérance, quel que soit le stade),
suppression des coutures inter-nœuds, et écriture unique des garde-fous de terrain — la lacune la plus
visible des nœuds B/C historiques. Remplace/absorbe l'ex-« P3 — Remédiation » esquissé dans le plan P2.

### Arbitrages restants (référent, non bloquants)

~~M3 (trou de couverture obèse+dénutri sans comorbidité → sortie « poursuivre »)~~ **traité par S8** : le
patient obèse+dénutri sans comorbidité voit désormais iSGLT2 proposé (levier glycémique pur), GLP-1/tirzépatide
exclus (dénutrition), et un repli insuline si la palette non-insulinique est épuisée — sortie non muette.
Restent : présentation multi-options en double indication (redondance de menu, arbitrage de présentation, non
clinique) ; falaise du seuil `hba1c_sous_cible` (< 6,5 % strict, pas de zone tampon) — assumée par le référent
comme garde-fou binaire. Consignés dans les `incertitudes` du nœud et
`docs/decision/validation/RAPPORT-prescription-S3-S7.md` (fusion) /
`prescription.SPEC-intentions.md` §7-§8 (S8).
