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
5. **Distiller** — (a) options + `conditions` + `effet_attendu` + `niveau_preuve` + `sources` → **YAML**
   du nœud ; (b) **argumentaire exhaustif** *reader-facing* (niveau 3) →
   `content/noeuds/<domaine>/<id>.argumentaire.md` (toutes les preuves détaillées + **toutes les sources**).
   Les 3 niveaux de lecture : recommandation / argumentaire détaillé / argumentaire exhaustif (cf. `DECISIONS.md` D11).
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
- **Granularité « si appuyée sur EBM »** (directive référent, 2026-07-22) : n'encoder une distinction de
  critère dans l'algorithme que si des **données EBM** (ECR/méta) la soutiennent. Les gradations d'**accord
  d'experts** (ex. HAS : sous-stades CV non évolué/évolué, IRC par stade, âgé vigoureux/fragile/malade)
  sont **affichées** comme reco officielle, mais ne **pilotent pas** le moteur.

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
