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
4. **Vérifier (bi-agents)** — Agent A extrait/chiffre, Agent B (red-team) traque le *spin* et **vérifie
   chaque DOI et chaque chiffre contre la source primaire** ; Opus réconcilie (consensus vérifié /
   divergences escaladées / non-vérifiable). Cf. §7ter du brief veille.
5. **Distiller** — options + `conditions` + `effet_attendu` + `niveau_preuve` + argumentaire
   (reco officielle vs position critique, divergence) + sources + incertitudes → section « → YAML ».
6. **Valider (référent)** — relecture clinique humaine ; passe le `statut` du dossier à `validé-référent`.
7. **Encoder** — le YAML du nœud est écrit/mis à jour (tâche de P2), `meta.statut: valide`.

## Règles de sourcing (non négociables)

- **Références réelles uniquement.** Ne jamais inventer un DOI, un chiffre, un NNT, une année. Tout élément
  non vérifié est marqué **`[À VÉRIFIER]`** et n'entre pas dans le YAML tant qu'il n'est pas confirmé.
- **Effet absolu / NNT** privilégiés au risque relatif ; toujours préciser l'**horizon temporel**.
- **Critère dur vs substitution** explicite pour chaque résultat.
- **Prescrire** : le référent peut fournir le **texte intégral** pour l'analyse (usage interne) ; côté
  outil, seul résumé + lien (droit d'auteur). Les demandes de textes sont listées en fin de dossier.
- En cas de doute clinique **non tranché par une source** : **signaler**, ne pas trancher seul.

## Échelle GRADE simplifiée

`eleve` (ECR de qualité, critères durs, cohérent) · `modere` (ECR avec limites, ou substitution solide) ·
`faible` (essais fragiles, sous-groupes, observationnel bien conduit) · `tres_faible` (avis, extrapolation).

## Nœuds du domaine DT2 (7 nœuds : A–F, H) — état

| Id | Nœud | Dossier | Statut preuve | Nœud YAML |
| --- | --- | --- | --- | --- |
| A | Cible glycémique | `noeuds/A-cible-glycemique.md` | **exploratoire (bi-agents en cours)** | P1/S2 |
| B | 1re intention (par comorbidités) | `noeuds/B-premiere-intention.md` | à faire | P2 |
| C | Intensification | `noeuds/C-intensification.md` | à faire | P2 |
| D | Sulfamides / gliptines | `noeuds/D-sulfamides-gliptines.md` | à faire | P2 |
| E | Insuline | `noeuds/E-insuline.md` | à faire | P2 |
| F | Statine chez le diabétique | `noeuds/F-statine.md` | à faire | P2 |
| H | RHD / perte de poids / rémission | `noeuds/H-rhd.md` | à faire | P2 |

> **Nœud G (aspirine) retiré** : pas d'algorithme à construire (pas de prévention primaire — ASCEND ;
> secondaire = systématique). Reste **7 nœuds**. L'info aspirine pourra vivre comme note statique dans
> le contexte prévention CV, pas comme nœud interrogeable.

Gabarit de dossier : `noeuds/_TEMPLATE.md`.
