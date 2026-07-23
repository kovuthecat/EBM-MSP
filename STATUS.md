# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session.

> **Dernière mise à jour :** 2026-07-23 (nuit — nœud F « Statine » validé)

## Nœud F « Statine chez le diabétique » — VALIDÉ + ENCODÉ (2026-07-23)

Pipeline complète (`docs/decision/00-global.md`) déroulée sur le nœud F : cadrage → collecte (4 sous-dossiers
d'agents + OpenEvidence OE-F1→F5) → **red-team des essais ET des recommandations** (chaque DOI/chiffre vérifié
contre source primaire ; discordances OE tranchées) → distillation → **vérification d'encodage bi-agents
(étape 8, 0 finding HAUTE)**. `content/noeuds/diabete-type-2/statine.yaml` **v1.0 `statut: valide`** +
`statine.argumentaire.md` (niveau 3) + dossier de preuve `docs/decision/noeuds/F-statine.md`. Nœud
**ordered-first-match**, 3 tiers **EBM-ancrés** (ASCVD → statine haute intensité ; diabète récent non compliqué
sans FDR → décision partagée ; sinon → statine primaire modérée, **mortalité NON revendiquée**) + 3 alertes
(> 75 ans, dialyse, risque absolu / pas de cible LDL + SCORE2 comme aide). Points saillants : stratification
**« que dit l'EBM »** (pas de seuil SCORE2 — bénéfice proportionnel au risque, CTT) ; reco = **SFE/SFD/NSFA/SFC
2026** (PMID 41651737) avec **note conflits d'intérêt** ; rosuvastatine haute intensité **10-20** (Table 4
française) ; correction de sourçage (ni HAS 2024 ni SFD 2025 ne traitent la statine). 6 critères
(age / anciennete_diabete_annees / autres_FDRCV / diabete_complique / dialyse / ASCVD_etablie). **122 tests +
build OK.** Restant P3 : câbler le formulaire D3 sur les nouveaux critères.

## Phase actuelle

**Phase 1 — Câblage MVP module Décision : P1 exécuté et consolidé.** S1→S4 exécutées (une session Sonnet
à la fois), 8 commits atomiques tâche par tâche. Squelette logiciel du module Décision fonctionnel :
scaffold, tokens, shell, Accueil/Méthode, JSON Schema + import YAML + validation Ajv, moteur de règles
générique + tests, écrans D2/D3 câblés sur la maquette et le moteur.

**T-009 — Ergonomie du formulaire de critères (D3, 2026-07-23)** : grille de champs fixée en 2 colonnes
(plus de champ isolé/orphelin), cases à cocher regroupées à part visuellement, champs numériques vides
par défaut (plus de `0` trompeur pris pour une vraie saisie) avec message d'invite tant qu'ils ne sont
pas renseignés, libellés `antecedent_cv`/`comorbidite_grave` accentués. Ajout d'une **suggestion auto
non sourcée** (modifiable, désactivée dès choix manuel) d'`esperance_vie` d'après âge/fragilité/
comorbidité grave/antécédent CV (`lib/esperanceVieDefault.ts`) — signalé comme heuristique UI, pas un
fait clinique sourcé (CLAUDE.md invariant 6). Build + **34/34 tests verts**.

**T-010 — Disclaimer, méthode publiée, niveau 3 (2026-07-23)** : ton du disclaimer permanent réécrit
(rassurant, « fondé exclusivement sur l'EBM », praticien = lien avec le patient **et** responsable de
la décision — harmonisé sur bandeau/accueil/pied d'écran nœud). Écran Méthode : ajout d'un second
bloc « Algorithmes d'aide à la décision » (résumé fidèle de `docs/decision/00-global.md`), en regard du
bloc veille existant. **Niveau de lecture 3 (D11) enfin exposé** : `ArgumentPanel` charge l'argumentaire
exhaustif (`argumentaire_exhaustif`, Markdown brut via `loadArgumentaires.ts`) et le rend avec un petit
composant `MiniMarkdown` maison (headers/listes/tableau/gras-italique-code/liens, **zéro dépendance
runtime ajoutée**, CLAUDE.md invariant 8). Deux bugs trouvés et corrigés pendant la validation
visuelle : boucle infinie sur la branche titre (oubli d'incrémenter l'index — figeait l'onglet à
l'ouverture) et puces multi-lignes source mal rattachées (laissait fuir des `**`/`*` littéraux dans le
texte). Régression couverte par `MiniMarkdown.test.tsx`. Build + **37/37 tests verts**.

**T-010bis — Lisibilité du disclaimer + périmètre (2026-07-23)** : le disclaimer (bandeau + accueil)
passe en deux phrases distinctes (première en gras, sur sa propre ligne) avec « le lien avec le
patient » et « le seul responsable » mis en avant — plus scannable qu'un bloc de texte compact.
Le bandeau disclaimer (propre au module Décision) **ne s'affiche plus sur les écrans Veille**
(`isVeilleScreen`, `navigation.ts`), qu'il ne concernait pas ; header conservé partout. Build +
**37/37 tests verts**.

**Nœud A ré-encodé et validé (T-007bis, 2026-07-22)** : `content/noeuds/diabete-type-2/cible-glycemique.yaml`
a été ré-écrit depuis le dossier de preuve, après phase exploratoire (HAS 2024 / Prescrire / Médicalement
Geek / OpenEvidence) et **double vérification indépendante (2ᵉ passe)**, avec les corrections actées par le
référent (borne d'âge sur le strict, CV grave→≤8 via `comorbidite_grave`, conditions exclusives,
`divergence:true`, `selection: ordered-first-match`). **`meta.statut: valide`, v2.0** ; build + 27/27 tests verts.

## Ce qui fonctionne

- Contexte instancié (BRIEF, ARCHITECTURE, DECISIONS D1–D11, PROJECT_MAP, TASKS, VALIDATION, CLAUDE, AGENTS).
- Maquette Claude Design intégrée (`design/maquettes/prototype-ebm-msp-neuf-crans/`).
- **P1 livré** : `npm run build` + `npm run typecheck` + `npm test` → 23/23 tests verts. Voir
  `VALIDATION.md` pour la checklist visuelle humaine (blocs Shell, Accueil/Méthode, Décision D2, Décision D3).
- Nœud A : dossier de preuve + 2ᵉ passe + argumentaire exhaustif complets ; **ré-encodage YAML fait
  (T-007bis)**, `content/…/cible-glycemique.yaml` v2.0 `statut: valide`.
- Git : remote GitHub, `main` à jour, tous les commits P1 poussés (à confirmer avant push, cf. consolidation).

## Ce qui casse / n'est pas testé

- Validation **visuelle humaine** des écrans (Shell/Accueil/Méthode/D2/D3) pas encore faite — cf.
  `VALIDATION.md`. D3 doit être re-validé visuellement sur le **contenu nœud A v2.0** (bandes validées).

## Bugs connus

- —

## Dette technique

- ~~Sémantique moteur du nœud A~~ **tranchée (T-007bis)** : `selection: ordered-first-match` (sortie
  unique) ajouté au schéma + `evaluateNode` ; les nœuds B/C restent en `multi-options` (défaut, absence du champ).
- `docs/decision/noeuds/A-cible-glycemique.md` n'ajoute pas de champ « thème » d'affichage pour D2 ;
  S4 a utilisé `titre` par défaut (contournement de présentation, pas de contenu inventé) — à revisiter
  si plusieurs nœuds par thème apparaissent (P3+).
